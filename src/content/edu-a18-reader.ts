/**
 * The Learning Grove, reader band (ages 7–10, read alone): Atlas page A18, The Doll in the Pocket
 * (the East Slavic folk tale of Vasilisa the Fair).
 *
 *   A18-1  The Counterpane        vocabulary (lodge, counterpane), log houses in forest lands, equal
 *                                 groups (100 patches in 10 rows, 3.OA.A.3); think: when is a secret
 *                                 kind and when should it be told?; grief said plainly
 *   A18-2  Dollet, Eat            food and energy, multiple-meaning words, light and sight
 *                                 (1-PS4-1/-2), 3 × 7; sharing food as care, hospitality across
 *                                 cultures; think: should you always feed others first?
 *   A18-3  The Widow              two-step weights (60 kg), character motive, weeds and crops
 *                                 (2-LS2-1), sun safety, fair shares of work, why summer days are
 *                                 longer (Earth’s tilt); think: is pretending the same as lying?
 *   A18-4  Suitors                age sums (17 − 8), sound as vibration, customs and fairness, tone
 *                                 and character, empathy, mixing colours, how news and rumour travel;
 *                                 think: is a custom reason enough?
 *   A18-5  The House by the Forest  breath clouds, pitch, birch woods of the cool north, keepsakes,
 *                                 wild mushrooms, sums to 27, inference
 *   A18-6  One Candle             candle safety, body language, dark adaptation, blame, 6 × 18 cm,
 *                                 simile; think: is brave the same as not afraid?
 *   A18-7  The Three Riders       owls (silent flight), calming the body, why dawn is milky and pink
 *                                 (light scattering), 4 km × 8 h, day and night, colour and mood;
 *                                 think: when does hiding help?
 *   A18-8  The Hut                weathering, onomatopoeia, forces (oars), sensory detail, number
 *                                 patterns, the great stove; think: is politeness a kind of strength?
 *   A18-9  Supper for Ten         fractions (1/10), sound is vibration, scarcity and choosing, husk
 *                                 and chaff; think: who should have the crust?
 *   A18-10 The First Day          sleep, shadows through the day (5-ESS1-2), 5 × 9, asking for help,
 *                                 character, equal groups; think: should some questions stay unasked?
 *   A18-11 The Second Day         separating mixtures, asking for advice, time intervals, tints and
 *                                 shades, fair pay, pressing oil from seeds, foreshadowing;
 *                                 think: gift or wages?
 *   A18-12 Questions              how old tales travel (oral tradition; Baba Yaga in Ukrainian,
 *                                 Belarusian, Polish and Russian stories), the rule of three,
 *                                 betulin and birch bark, being loved as courage, oats as a seed
 *                                 crop, warm and cool colours; think: curiosity or prying?
 *   A18-13 The Skull on a Stick   light spreading out, 24 hours, muscles and rest, grams and
 *                                 kilograms, stepping back to let someone finish, predicting;
 *                                 think: should we get rid of what frightens us?
 *   A18-14 No Fire                the fire triangle, compass directions, blame, sleep and worry,
 *                                 marking a place to remember, “how many times longer”, a walking beat;
 *                                 think: do the unkind deserve a fright?
 *   A18-15 The Loom               welcoming, flax and pulling, over-and-under patterns, the five
 *                                 steps from flax to linen (pull, ret, spin, weave, bleach), why sun
 *                                 whitens cloth, pride in shared work; think: can a scary shape be
 *                                 kind?
 *   A18-16 Twelve Shirts          gifts and price, the word Tsar, 12 ÷ 2, eye rest, sharing credit,
 *                                 bell pitch, theme; think: can something be worth more than a price?
 *
 * One EduScene per original scene (every step scene, done scene and complete scene) plus the 14
 * variant scenes. Every choice keeps its original id and `set` (so `a18-crust` still works); the
 * reader band keeps all of them. No lifted text: none of the eight Magnus lines appears. Care notes
 * kept: the skull’s light drives the stepmother’s house away and nobody is burned; the fence is
 * “old bones, grey and smooth as driftwood”; Baba Yaga is frightening and fair; the mother’s
 * death is one plain, gentle scene and the illness is never named; no country, flag or state
 * symbol is named in the story, only in the plain fact boxes (where the tale is told).
 * British spelling.
 */
import type { EduDomain, EduQuest, EduScene, GlossaryEntry, Lesson } from './types';
import type { Line, Choice } from '../config/story';

type Mood = NonNullable<Line['mood']>;

const say =
  (who: string) =>
  (text: string, mood?: Mood): Line =>
    mood ? { who, text, mood } : { who, text };

// ---------------------------------------------------------------- speakers
const N = say('narrator');
const Y = say('you');
const V = say('a18-vasilisa');
const MO = say('a18-mother');
const MER = say('a18-merchant');
const STEP = say('a18-stepmother');
const ELD = say('a18-elder');
const YNG = say('a18-younger');
const DOLL = say('a18-doll');
const SU = say('a18-suitor');
const BY = say('a18-yaga');
const SK = say('a18-skull');
const OLD = say('a18-old-woman');
const TS = say('a18-tsar');

// ---------------------------------------------------------------- builders
type Beat = Omit<Lesson, 'id'>;
type Opt = NonNullable<Lesson['options']>[number];

const words = (t: string) => t.trim().split(/\s+/).length;

/**
 * Keeps lesson lines and choice replies to 30 words, 160 characters and two sentences: a longer
 * line is cut at sentence ends into several lines by the same speaker (the mood stays on the
 * first). Scene lines are written to the caps by hand, so the indexes lessons use never move.
 */
const sp = (lines: Line[]): Line[] => {
  const out: Line[] = [];
  const real = (s: string) => words(s.replace(/[.!?…)]+$/, '')) > 1;
  for (const l of lines) {
    const sentences = l.text.split(/(?<=[.!?”)])\s+(?=[A-Z“(])/);
    const chunks: string[][] = [];
    for (const s of sentences) {
      const last = chunks[chunks.length - 1];
      const joined = last ? `${last.join(' ')} ${s}` : s;
      const count = last ? last.filter(real).length : 0;
      if (last && words(joined) <= 30 && joined.length <= 160 && count + (real(s) ? 1 : 0) <= 2)
        last.push(s);
      else chunks.push([s]);
    }
    chunks.forEach((c, i) => {
      const text = c.join(' ');
      out.push(i === 0 && l.mood ? { who: l.who, text, mood: l.mood } : { who: l.who, text });
    });
  }
  return out;
};

/** One answer option. `best` marks the answer the lesson teaches (think questions have none). */
const o = (label: string, reply: Line[], best = false): Opt =>
  best ? { label, best, reply: sp(reply) } : { label, reply: sp(reply) };

const std = (standard?: string) => (standard ? { standard } : {});

/** An ask lesson with a best answer. */
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

/** A think question: no `best`; every reply honours the child’s reasoning. */
const think = ask;

/** A notice lesson: a character shares something true. */
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

/** One reader scene. Lesson ids are `reader:<of>-l<n>`, numbered in play order. */
const sc = (of: string, lines: Line[], beats: Beat[], choices?: Choice[]): EduScene => ({
  id: `reader:${of}`,
  of,
  band: 'reader',
  lines,
  ...(choices ? { choices } : {}),
  lessons: [...beats]
    .sort((a, b) => a.after - b.after)
    .map((b, i) => ({ id: `reader:${of}-l${i + 1}`, ...b })),
});

/** A choice, with the original id (and `set` flags where the original has them). */
const ch = (id: string, label: string, then: Line[], set?: Choice['set']): Choice => ({
  id,
  label,
  ...(set ? { set } : {}),
  then: sp(then),
});

const gloss = (word: string, meaning: string, of: string): GlossaryEntry => ({
  word,
  meaning,
  scene: `reader:${of}`,
});

const quest = (
  of: string,
  title: string,
  goals: EduQuest['goals'],
  scenes: EduScene[],
  glossary: GlossaryEntry[] = [],
): EduQuest => ({
  id: `reader:${of}`,
  of,
  band: 'reader',
  title,
  goals,
  scenes,
  ...(glossary.length ? { glossary } : {}),
});

// ================================================================== A18-1 The Counterpane
const A01 = quest(
  'a18-01',
  'The Counterpane',
  {
    'a18-01-s1': {
      goal: 'Step into the painted page and knock at the merchant’s house.',
      hint: 'Touch the page, then walk up to the wooden house with the carved shutters.',
    },
    'a18-01-s2': {
      goal: 'Walk Vasilisa to her mother’s door, and wait there.',
      hint: 'Stand at the bedroom door with your Nubbin. Don’t go in.',
    },
  },
  [
    sc(
      'a18-01-house',
      [
        N(
          'Nova’s atlas falls open at a page painted in egg yellow and soot black: a wooden house, a birch wood, and far off, a fence of pale sticks.',
        ),
        N(
          'The paint smells of woodsmoke. Then it is woodsmoke, and you and your Nubbin are standing on a swept step with snow piled at its edges.',
        ),
        N(
          'A big man in a fur hat opens the door before you can knock, as if he has been watching the road.',
        ),
        MER(
          'You have the traveller’s book! The woman with the map sold me needles once and bought half my ribbons, and I still don’t know who won.',
          'happy',
        ),
        MER(
          'Any friend of hers may lodge here. There’s a room over the stable, and it’s warm, because the horse is.',
        ),
        MER(
          'My wife is not well. We walk softly in this house. You’ll walk softly too, I think.',
          'sad',
        ),
        N(
          'A girl of about eight looks round his knee. She has a plait to her waist, and she studies your Nubbin the way you would study a cake.',
        ),
        V('What is it? Is it a doll? Does it eat?'),
      ],
      [
        ask(
          4,
          'literacy',
          'the meaning of a word from its context: lodge',
          'L.3.4',
          [
            N(
              'The merchant says you may lodge in the room over the stable. What does it mean to lodge somewhere?',
            ),
          ],
          [
            o(
              'To stay in a room in someone else’s home',
              [
                N(
                  'Yes. A lodger stays in a room in someone’s home, often for a fee or as a favour. The stable room is your lodging.',
                  'happy',
                ),
              ],
              true,
            ),
            o('To get stuck', [
              N(
                'That’s another meaning: a ball can lodge in a tree, which means it gets stuck. Here it means a bed under someone else’s roof.',
              ),
            ]),
            o('To go for a walk', [
              N(
                'Not a walk. A lodger stays somewhere for the night, or for longer. Look at the next line: a room, and a warm horse.',
              ),
            ]),
          ],
          'Worked out the meaning of “lodge” (to stay in a room in someone else’s home) from the sentences around it.',
        ),
      ],
      [
        ch('eats', 'Tell her it’s a Nubbin, and it eats everything.', [
          V('Everything? Even porridge? Even the burnt bit?', 'happy'),
          N('Your Nubbin looks at her as if the burnt bit is the best bit, which it is.'),
        ]),
        ch('itself', 'Let your Nubbin answer for itself.', [
          N(
            'Your Nubbin walks up and sits on her shoe. She goes very still, the way you do when a bird lands near you.',
          ),
        ]),
        ch('name', 'Ask her name first.', [
          V(
            'You are meant to say yours first. That’s manners. But I’ll tell you anyway, because you asked nicely.',
            'think',
          ),
        ]),
      ],
    ),
    sc(
      'a18-01-house-done',
      [
        V('I’m Vasilisa. Mother says I’m to be polite to lodgers, so I will be. Mostly.'),
        MER('Go and wash your hands, Vasilisa. Your mother may want you later.', 'soft'),
        N('She goes, slowly, looking back at your Nubbin all the way up the stairs.'),
        N(
          'You run a hand along the wall. It is made of whole logs, laid one on another and stuffed between with moss.',
        ),
      ],
      [
        ask(
          3,
          'social-studies',
          'why forest lands built with logs',
          'D2.Geo.2.K-2',
          [
            N(
              'Many houses in forest lands were built of logs, with moss in the gaps. Why might a village near a big forest build this way?',
            ),
          ],
          [
            o(
              'Logs were plentiful, and thick wood keeps the cold out',
              [
                N(
                  'Yes. People build from what is close at hand, and thick wood holds warmth well. The moss stops draughts.',
                  'happy',
                ),
              ],
              true,
            ),
            o('Because stone was not allowed', [
              N(
                'Nothing in the story says that. People used the nearest building material, and in a forest land that is wood.',
              ),
            ]),
            o('Because logs are cheaper than a tent', [
              N(
                'A tent would not last a winter. Logs are plentiful near a forest, and thick wood is a good insulator against the cold.',
              ),
            ]),
          ],
          'Reasoned that people build from local materials: logs are plentiful in forest lands and keep homes warm.',
        ),
      ],
    ),
    sc(
      'a18-01-counterpane',
      [
        N(
          'That evening a quiet voice at the end of the passage calls Vasilisa’s name, and the whole house hears it.',
        ),
        V('Will you come? Only to the door. I don’t like the passage when it’s dark.'),
        N(
          'You walk her to the door and stop there. The room is warm and dim, and smells of beeswax.',
        ),
        N(
          'Her mother sits up against the pillows under a counterpane sewn from a hundred bright scraps.',
        ),
        MO('Vasilisa, my darling, I am very ill, and I will not get better. Come close.', 'soft'),
        N(
          'From under the counterpane she takes a little doll, no longer than your hand, with a painted face and a red scarf.',
        ),
        MO('I am leaving you this doll, and all my love in her. Keep her close, and tell no one.'),
        MO(
          'When you are in trouble, give her something to eat first. Then ask her. She will tell you what to do.',
        ),
        V('Something to eat first. Then ask. And tell nobody.', 'think'),
        N('Her mother looks past her, to the door, to you. She doesn’t send you away.'),
      ],
      [
        think(
          8,
          'sel',
          'when a secret is kind and when it should be told',
          'CASEL: Responsible decision-making',
          [
            N(
              'Vasilisa promises to tell nobody about the doll. Is keeping a secret always the right thing? When might a secret be kind, and when should it be told to a grown-up you trust?',
            ),
          ],
          [
            o('A secret that protects something good is fine to keep', [
              N(
                'That’s a fair answer. A surprise party, or a gift, is a happy secret. The test is whether keeping it protects somebody or hurts somebody.',
                'soft',
              ),
            ]),
            o('A secret that frightens or hurts someone should be told', [
              N(
                'That’s a fair answer, and an important one. If a secret makes you scared or sad, or means someone is in danger, tell a grown-up you trust.',
                'soft',
              ),
            ]),
            o('It depends on who you promised and why', [
              N(
                'That’s a fair answer. Promises matter, and so does safety. When the two pull apart, safety comes first, and you can always ask for help deciding.',
                'soft',
              ),
            ]),
          ],
          'Thought about when a secret is a kind one to keep and when it should be told to a trusted grown-up.',
        ),
      ],
      [
        ch('stay', 'Stay where you are, by the door.', [
          N('You stay. Your Nubbin sits on your foot and does not fidget, for once.'),
        ]),
        ch('step', 'Step back into the passage, to give them the room.', [
          N(
            'Through the gap you see her mother lift a hand and lay it on Vasilisa’s head, and leave it there.',
          ),
        ]),
        ch('nod', 'Nod to her: you’ll look after the girl.', [
          MO('Thank you. She will need a friend who can keep quiet.', 'soft'),
        ]),
      ],
    ),
    sc(
      'a18-01-counterpane-done',
      [
        N('Vasilisa comes out with both hands under her apron, holding something very carefully.'),
        V('I’m not to show you. So I’m not showing you.', 'sad'),
        N('She walks back down the passage with her hands still under her apron.'),
        N(
          'You glance back at the bed. The counterpane is made of a hundred bright patches, sewn in ten tidy rows.',
        ),
      ],
      [
        ask(
          3,
          'maths',
          'equal groups: 100 patches in 10 equal rows',
          '3.OA.A.3',
          [
            N(
              'The counterpane has 100 patches in 10 equal rows. How many patches are in each row?',
            ),
          ],
          [
            o(
              '10',
              [N('Yes: 100 ÷ 10 = 10, because 10 × 10 = 100. Ten rows of ten.', 'happy')],
              true,
            ),
            o('100', [
              N(
                '100 is the total for all ten rows. Share 100 into 10 equal rows: 100 ÷ 10 = 10 in each.',
              ),
            ]),
            o('1', [
              N(
                'One per row would make only 10 patches in all. Since 10 × 10 = 100, each row has ten.',
              ),
            ]),
          ],
          'Divided 100 into 10 equal rows to find 10 per row, linking multiplication and division.',
        ),
      ],
    ),
    sc(
      'a18-01-complete',
      [
        N(
          'In the night, Vasilisa’s mother dies. That means her body stopped working, and it will not start again.',
        ),
        N(
          'In the morning the merchant sits at the kitchen table with his hat in his hands, turning it round and round.',
        ),
        N(
          'Vasilisa sits on the bottom stair, wrapped in her mother’s counterpane. Somebody has put it round her.',
        ),
        N(
          'You don’t know what to say, so you don’t say anything. You sit down on the stair beside her.',
        ),
        N('After a while your Nubbin climbs up between you and sits too.'),
        V(
          'She said I’m to be good, and not cry too much. I think I’m crying the right amount.',
          'sad',
        ),
        Y('I think so too.'),
        N(
          'Under the counterpane, her hand is closed round something small. She holds on to it all day.',
        ),
      ],
      [
        ask(
          4,
          'sel',
          'how to support someone who is grieving',
          'CASEL: Social awareness',
          [N('Vasilisa is grieving. You don’t know what to say. What helps most?')],
          [
            o(
              'Stay close, listen, and let them cry',
              [
                N(
                  'Yes. You don’t need the right words. Being there, and not hurrying the sadness, is the kindest help.',
                  'soft',
                ),
              ],
              true,
            ),
            o('Tell her to cheer up', [
              N(
                'It comes from a kind place, but grief doesn’t work like that. Staying close helps more than telling someone how to feel.',
              ),
            ]),
            o('Leave her alone so she can forget', [
              N(
                'Some quiet is fine. But being left alone can feel lonely, and a grieving person doesn’t want to forget. Stay near, and let her cry.',
              ),
            ]),
          ],
          'Learned that staying close and listening is the best support for someone who is grieving.',
        ),
      ],
    ),
  ],
  [
    gloss('lodge', 'To stay for a while in a room in somebody else’s home.', 'a18-01-house'),
    gloss('counterpane', 'A bedspread: a blanket that covers the whole bed.', 'a18-01-counterpane'),
  ],
);

// ================================================================== A18-2 Dollet, Eat
const A02 = quest(
  'a18-02',
  'Little Doll, Eat',
  {
    'a18-02-s1': {
      goal: 'Follow Vasilisa down to the cellar with a candle.',
      hint: 'Take the candle from the kitchen shelf and go down after her.',
    },
    'a18-02-s2': {
      goal: 'Hold the light while Vasilisa feeds the doll, and keep still.',
      hint: 'Keep the candle steady and don’t speak.',
    },
    'a18-02-s3': {
      goal: 'Learn how to set the food out, and make Vasilisa a promise.',
      hint: 'Lay the morsels in a row in front of the doll, then answer Vasilisa.',
    },
  },
  [
    sc(
      'a18-02-supper',
      [
        N(
          'The days after are grey and quiet. People come with pies, stand in the kitchen, and go away again.',
        ),
        N(
          'At supper Vasilisa eats almost nothing. The best bits go off her plate and into her apron: the crust, the egg, the honey cake.',
        ),
        MER('Eat, little one. You’re getting thin.', 'sad'),
        V('I am eating, Father. Look.', 'think'),
        N(
          'She chews a bit of turnip very hard, for him to see. Then she slips off her bench and out of the room.',
        ),
        N('Your Nubbin looks at you. It has noticed the honey cake too.'),
      ],
      [
        ask(
          4,
          'health',
          'people, like all animals, need food to live and grow',
          'K-LS1-1',
          [
            N(
              'Vasilisa is hiding her food. People, like all animals, need food to live: it gives us energy to move, think and grow. What will happen if she keeps going without?',
            ),
          ],
          [
            o(
              'She will get tired and find it hard to concentrate',
              [
                N(
                  'Yes. Without enough food the body runs low on energy, and the brain does too. Hungry people tire quickly and think less clearly.',
                  'happy',
                ),
              ],
              true,
            ),
            o('She will grow stronger', [
              N(
                'The opposite. A body needs fuel to grow strong. Skipping meals leaves it weak and tired.',
              ),
            ]),
            o('Nothing will change', [
              N(
                'Bodies notice. Without regular meals we feel weak, tired and cross. Her father is right to worry.',
              ),
            ]),
          ],
          'Learned that food is the body’s fuel and that going without leaves us tired and unable to concentrate.',
        ),
      ],
      [
        ch('follow', 'Take the candle and follow her.', [
          N(
            'The cellar door is open a crack. Below there is no light at all, and a very small voice.',
          ),
        ]),
        ch('finish', 'Finish your supper first, then follow.', [
          N('You finish, because you are hungry, and take the candle down after her.'),
          N('She hasn’t got far. She was waiting in the dark for somebody with a light.'),
        ]),
      ],
    ),
    sc(
      'a18-02-supper-done',
      [
        V('Oh. It’s you. Shut the door. Properly, it sticks.'),
        N('You shut it properly. It does stick, like a gate you know, a long way from here.'),
      ],
      [
        ask(
          1,
          'literacy',
          'multiple-meaning words: stick',
          'L.3.4',
          [
            N(
              'Vasilisa says the door “sticks”. The word has several meanings: a stick of wood, to stick a pin in, to stick with glue. Which meaning fits the door?',
            ),
          ],
          [
            o(
              'It doesn’t open or shut easily',
              [
                N(
                  'Yes. A door that sticks is one that jams and needs a push. Only the sentence around the word tells you which meaning is meant.',
                  'happy',
                ),
              ],
              true,
            ),
            o('It is made of sticks', [
              N(
                'A stick of wood is one meaning, but a door that “sticks” is doing something, not made of something. Look at the verb.',
              ),
            ]),
            o('It has a pin in it', [
              N(
                'Sticking a pin is another meaning, but nobody pinned the door. The sentence says shut it properly, so it jams.',
              ),
            ]),
          ],
          'Used the surrounding sentence to choose the right meaning of a multiple-meaning word (sticks).',
        ),
      ],
    ),
    sc(
      'a18-02-cellar',
      [
        N(
          'Vasilisa kneels on an upturned tub between the potatoes and the pickle crocks, and sets the doll in front of her.',
        ),
        N(
          'From her apron come the crust, the egg and the honey cake. She lays them before the doll in a careful row.',
        ),
        N(
          'Vasilisa has been going without, to save the best bits for the doll. Tonight is the first night you see it.',
        ),
        V('Little doll, please eat. I am so sad.', 'sad'),
        V(
          'Mother died, and Father is sad, and everybody brings pies. I don’t want pies. I want to know what to do.',
          'sad',
        ),
        N(
          'For a moment nothing happens. Then the doll’s painted eyes begin to shine, like two drops of lamp oil with a light behind them.',
        ),
        N(
          'The crust is gone, and the egg. Your Nubbin leans forward to see where the honey cake went, and it is gone too.',
        ),
        DOLL('Sadness is heavy, Vasilisa, but you don’t carry it alone. Go up and sleep.', 'soft'),
        DOLL('Tomorrow you will be a little lighter, and the day after, a little more.'),
        N(
          'Your Nubbin is staring at the doll. The doll, as far as anyone can tell, is staring back.',
        ),
        V('She ate. She always eats. Mother said she would.', 'happy'),
      ],
      [
        ask(
          8,
          'sel',
          'comfort that doesn’t try to fix feelings',
          'CASEL: Relationship skills',
          [
            N(
              'The doll doesn’t say “cheer up”. It says she doesn’t carry the sadness alone, and she’ll feel lighter bit by bit. Why might that help more?',
            ),
          ],
          [
            o(
              'It says the feeling is allowed, will ease, and she has company',
              [
                N(
                  'Yes. Comfort that accepts a feeling, promises it will ease with time, and stays beside you, is far stronger than an order to cheer up.',
                  'soft',
                ),
              ],
              true,
            ),
            o('It makes the sadness go away at once', [
              N(
                'It doesn’t, and that’s the honest part. Sadness needs time. What changes at once is that Vasilisa isn’t on her own.',
              ),
            ]),
            o('It gives her something to eat', [
              N(
                'The food is part of her kindness to the doll. The comfort comes from the words: you’re not alone, and it will get lighter.',
              ),
            ]),
          ],
          'Understood that good comfort accepts a feeling, promises it will ease, and stays close.',
        ),
      ],
      [
        ch('still', 'Keep the candle very still.', [
          N('The flame doesn’t even lean. Vasilisa notices, and gives you the smallest nod.'),
        ]),
        ch('closer', 'Let your Nubbin go closer.', [
          N(
            'Your Nubbin creeps up to the tub and sniffs the doll. The doll doesn’t move, and somehow it is clear that it allows this.',
          ),
        ]),
      ],
    ),
    sc(
      'a18-02-cellar-done',
      [
        V('She won’t help on an empty stomach. Mother said so.'),
        V('Nobody should have to.', 'soft'),
        N(
          'The candle between you makes a small ring of gold on the floor. Beyond the ring, the crocks are only shapes.',
        ),
      ],
      [
        ask(
          2,
          'science',
          'we see because light reaches our eyes',
          '1-PS4-2',
          [
            N(
              'Inside the candle’s ring you can see the crocks clearly. Beyond it you see only shapes. How do we see anything at all?',
            ),
          ],
          [
            o(
              'Light bounces off objects and into our eyes',
              [
                N(
                  'Yes. The candle gives out light, the light bounces off the crocks, and some of it reaches your eyes. Where little light arrives, little can be seen.',
                  'happy',
                ),
              ],
              true,
            ),
            o('Our eyes send out beams to touch things', [
              N(
                'People once thought so, but it isn’t true. Eyes only receive light. That’s why we can’t see in a room with no light at all.',
              ),
            ]),
            o('Things glow by themselves in the dark', [
              N(
                'Only a few things do, like the candle flame itself. Most things are seen by the light that bounces off them.',
              ),
            ]),
          ],
          'Learned that we see objects because light bounces off them into our eyes.',
        ),
      ],
    ),
    sc(
      'a18-02-promise',
      [
        V(
          'You saw. So now you have to learn it properly, in case I’m ever ill, or away, or I forget.',
        ),
        V('The best bits. Not the leftovers. The best bits, and first, before I have mine.'),
        V(
          'In a row, so she can see them all. Then you say the words, and you wait. You mustn’t poke her.',
        ),
        N(
          'She shows you twice. Your Nubbin watches as if there will be a test, which there may be.',
        ),
        V('Now you have to promise. Never tell. Not Father, not anybody.', 'think'),
        V('You’re not “anybody”, you’re the lodger. That’s different. I’ve decided.'),
      ],
      [
        ask(
          2,
          'maths',
          'multiplication as equal groups: 3 × 7',
          '3.OA.A.3',
          [
            N(
              'Each night you lay out 3 morsels in a row. How many morsels is that over a week of 7 nights?',
            ),
          ],
          [
            o(
              '21',
              [
                N(
                  'Yes. 7 nights of 3 morsels is 7 × 3 = 21. Three, six, nine, twelve, fifteen, eighteen, twenty-one.',
                  'happy',
                ),
              ],
              true,
            ),
            o('10', [
              N(
                'That’s 7 + 3. Each of the 7 nights has its own 3 morsels, so multiply: 7 × 3 = 21.',
              ),
            ]),
            o('37', [
              N('That’s the digits side by side. We need 7 equal groups of 3: 7 × 3 = 21.'),
            ]),
          ],
          'Used multiplication as equal groups to find 3 morsels × 7 nights = 21.',
        ),
      ],
      [
        ch('promise', 'Promise. Never, not anybody.', [
          V('Good. Shake.'),
          N('Her hand is very small and very serious.'),
        ]),
        ch('cross', 'Cross your heart, and your Nubbin’s too.', [
          N(
            'You cross your heart, then your Nubbin’s, which tickles it. Vasilisa decides this counts double.',
          ),
        ]),
        ch('why', 'Ask why it has to be a secret.', [
          V('Because people would want her. People always want things that help.', 'think'),
          V('And because Mother said so. That’s two reasons. Promise.'),
          N('You promise.'),
        ]),
      ],
    ),
    sc(
      'a18-02-promise-done',
      [
        N(
          'Climbing the cellar steps, you think of a rule you know. It is in your gran’s handwriting, the first of three.',
        ),
        N('Feed them before you feed yourself.', 'soft'),
        N(
          'Night after night, Vasilisa has gone without her own best food so that someone else could eat.',
        ),
      ],
      [
        notice(
          1,
          'social-studies',
          'sharing food shows respect in many cultures',
          'D2.Civ.8.K-2',
          [
            N(
              'In many cultures around the world, offering a guest the best food first is a way of showing respect.',
            ),
            N('Sharing bread, tea or soup says: you are welcome, and you matter.'),
          ],
          'Learned that sharing food is a sign of respect and welcome in many cultures.',
        ),
        think(
          2,
          'sel',
          'whether to feed others before yourself',
          'CASEL: Responsible decision-making',
          [
            N(
              'Hazel’s rule says feed them before you feed yourself. Is it always right to put others first? What if you were the one who was starving?',
            ),
          ],
          [
            o('Feed others first, because caring means giving', [
              N(
                'That’s a fair answer. Giving to others first is a powerful kind of love. Notice that Vasilisa still sleeps and still eats her share of turnip, so she is giving, not vanishing.',
                'soft',
              ),
            ]),
            o('Look after yourself too, or you can’t help anyone', [
              N(
                'That’s a fair answer. A hungry helper soon can’t help. Many caring people share what they have and still make sure they are fed.',
                'soft',
              ),
            ]),
            o('It depends on who needs it more', [
              N(
                'That’s a fair answer. A rule is a good start, and wise people check who needs the food most before they decide.',
                'soft',
              ),
            ]),
          ],
          'Thought about whether caring means always putting others first, or looking after yourself too.',
        ),
      ],
    ),
    sc(
      'a18-02-complete',
      [
        N(
          'After that, the best bits of Vasilisa’s supper always go missing. Her father worries that she’s thin.',
        ),
        N(
          'She is, a little. But she sleeps, and in the mornings she sings while she plaits her hair.',
        ),
        N(
          'Some nights she sends you down instead, with a bundle in a napkin. You lay it out in a row, the way she showed you.',
        ),
        N(
          'You say her words, and wait, and don’t poke. The doll’s eyes shine, and the food is gone.',
        ),
        N('It never says a word to you. It only ever speaks to her.'),
        N(
          'Your Nubbin, on the way back up, looks hopefully into the empty napkin every single time.',
        ),
      ],
      [
        ask(
          1,
          'music',
          'rhythm and repeated lines in work songs',
          'RL.2.4',
          [
            N(
              'Vasilisa sings while she works. Work songs often have a steady beat and lines that come round again and again. Why might that help?',
            ),
          ],
          [
            o(
              'A steady beat helps people keep time together, and makes the work lighter',
              [
                N(
                  'Yes. A beat gives everyone the same rhythm to move to, and repeated lines are easy to join in with, so rowing, weaving or hauling feels smoother.',
                  'happy',
                ),
              ],
              true,
            ),
            o('It makes the work faster than it can be done', [
              N(
                'Not faster than possible. It keeps a steady pace, which helps people last longer.',
              ),
            ]),
            o('It stops other people hearing', [
              N('Songs don’t hide anything. The beat is about pace and company.'),
            ]),
          ],
          'Learned that a steady beat helps people keep time together when working.',
        ),
      ],
    ),
  ],
  [gloss('morsel', 'A small piece of food, often the tastiest bit.', 'a18-02-promise')],
);

// ================================================================== A18-3 The Widow
const A03 = quest(
  'a18-03',
  'The Widow',
  {
    'a18-03-s1': {
      goal: 'Meet the merchant’s new wife and her daughters.',
      hint: 'Wait in the yard when the cart comes in at the gate.',
    },
    'a18-03-s2': {
      goal: 'Get up before dawn and see how the work is getting done.',
      hint: 'Go out to the garden before anyone else is up.',
    },
    'a18-03-s3': {
      goal: 'Help Vasilisa look busy when her stepmother comes round.',
      hint: 'When the back door opens, give Vasilisa something to be doing.',
    },
  },
  [
    sc(
      'a18-03-cart',
      [
        N(
          'The atlas turns a page by itself. When you step back in it is spring, and the birches have their small green coins on.',
        ),
        MER(
          'A house wants a mistress, and a girl wants a mother. I’ve found a widow with two daughters near Vasilisa’s age.',
          'think',
        ),
        MER('She seemed kind. Mostly she seemed a woman with a lot of trunks.'),
        N(
          'A cart turns in at the gate, piled with trunks. On top sit three people in good shawls, looking at the house as if pricing it.',
        ),
        STEP('So this is the house. And this is the girl.'),
        N(
          'The stepmother looks Vasilisa up and down. Her daughters do the same, one after the other, like an echo.',
        ),
        ELD('She’s very pretty.', 'angry'),
        YNG('Too pretty. It isn’t fair.', 'angry'),
        STEP(
          'Pretty fades, my loves. Sun and wind and work see to that, and there’s a great deal of work in a house like this.',
        ),
        N('Vasilisa curtsies and says nothing, with one hand in her apron pocket.'),
      ],
      [
        ask(
          3,
          'maths',
          'a two-step weight problem',
          '3.OA.D.8',
          [
            N(
              'The cart carries 3 trunks of 14 kg each and 2 trunks of 9 kg each. What do the trunks weigh altogether?',
            ),
          ],
          [
            o(
              '60 kg',
              [
                N(
                  'Yes. 3 × 14 = 42 kg, and 2 × 9 = 18 kg, and 42 + 18 = 60 kg. Two multiplications, then an addition.',
                  'happy',
                ),
              ],
              true,
            ),
            o('23 kg', [
              N(
                'That’s 14 + 9. Every trunk counts: first 3 × 14 = 42 and 2 × 9 = 18, then add them: 60 kg.',
              ),
            ]),
            o('42 kg', [
              N(
                'That’s only the three big trunks. Add the two small ones, 2 × 9 = 18, and you get 42 + 18 = 60 kg.',
              ),
            ]),
          ],
          'Solved a two-step problem: 3 × 14 = 42, 2 × 9 = 18, then 42 + 18 = 60 kg.',
        ),
      ],
      [
        ch('carry', 'Offer to carry a trunk.', [
          STEP('The lodger. Yes. You may carry all of them.'),
          N(
            'You carry all of them. Your Nubbin carries a hatbox, very seriously, with its eyes shut.',
          ),
        ]),
        ch('beside', 'Stand beside Vasilisa and say nothing.', [
          N(
            'You stand beside her. The stepmother’s eyes rest on you a moment and move on, the way you would look past a chair.',
          ),
        ]),
      ],
    ),
    sc(
      'a18-03-cart-done',
      [
        STEP(
          'Vasilisa will see to the garden, the water, the stove and the floors. A girl should be useful.',
        ),
        ELD('And we’ll see to the sitting down.', 'happy'),
        N('Vasilisa curtsies again. In her pocket, something small is very still.'),
      ],
      [
        ask(
          1,
          'literacy',
          'a character’s motive',
          'RL.3.3',
          [N('Why does the elder sister joke that she will “see to the sitting down”?')],
          [
            o(
              'She wants an easy life and is pleased to see Vasilisa doing the work',
              [
                N(
                  'Yes. Her joke shows her motive: she enjoys being idle and likes seeing the girl she envies kept busy. What a character says often shows what they want.',
                  'happy',
                ),
              ],
              true,
            ),
            o('She is afraid of hard work', [
              N(
                'That may be part of it, but the way she says it is pleased, not scared. Her words show she likes the arrangement.',
              ),
            ]),
            o('She wants to help Vasilisa', [
              N(
                'A helper offers to share. She keeps the sitting for herself, so her motive is comfort and envy.',
              ),
            ]),
          ],
          'Worked out a character’s motive from what she says: she wants comfort and enjoys the arrangement.',
        ),
      ],
    ),
    sc(
      'a18-03-dawn',
      [
        N(
          'Before dawn you hear the cellar door. You go down to the garden with your Nubbin, in your socks.',
        ),
        N('Vasilisa is sitting in the shade of the apple tree, making a crown of dandelions.'),
        N(
          'The beds are weeded and the water butts are full. Smoke is rising from the kitchen chimney, and the stove inside is hot.',
        ),
        V(
          'Shh. She did it. I fed her last night and asked her, and she said go to sleep. So I did.',
          'happy',
        ),
        N(
          'In the cabbage bed you find the doll, no taller than a weed, pulling up the last dandelion with both arms.',
        ),
        N(
          'Your Nubbin rushes to help. They fall over backwards together, and the dandelion comes out.',
        ),
        V('She’s made me a salve for the sun as well. Out of something. I don’t ask what.'),
        N(
          'Vasilisa puts her dandelion crown on your Nubbin and the doll back in her pocket, and the morning starts.',
        ),
      ],
      [
        ask(
          4,
          'science',
          'plants compete for water and light',
          '2-LS2-1',
          [N('Weeds grow among the cabbages. Why does pulling weeds help the cabbages grow?')],
          [
            o(
              'Weeds compete with the cabbages for water, light and space',
              [
                N(
                  'Yes. Every plant in a bed needs water, light and room. A weed takes some of each, so a weeded bed leaves more for the crop.',
                  'happy',
                ),
              ],
              true,
            ),
            o('Weeds are poisonous to cabbages', [
              N(
                'Most aren’t. The trouble is crowding: weeds use up water, sunlight and soil space the cabbages need.',
              ),
            ]),
            o('Weeds make the soil too warm', [
              N(
                'Not warmer. Weeds simply share, or steal, the water, light and space the cabbages need.',
              ),
            ]),
          ],
          'Learned that weeds compete with crops for water, light and space, so weeding helps the crop.',
        ),
      ],
    ),
    sc(
      'a18-03-dawn-done',
      [
        V('Now I have to look tired. Can you look tired? I can’t. I’ve been asleep.', 'think'),
        N(
          'She pulls a long face, and then a longer one. Your Nubbin copies her, and does it better.',
        ),
      ],
      [
        think(
          1,
          'sel',
          'pretending to protect someone, and honesty',
          'CASEL: Responsible decision-making',
          [
            N(
              'Vasilisa will pretend to be tired to protect the doll. Is pretending always the same as lying? When might pretending protect someone, and when might it hurt?',
            ),
          ],
          [
            o('Pretending to protect someone can be kind', [
              N(
                'That’s a fair answer. A game, a surprise, or hiding something to keep a friend safe can all be kind. The question is who is helped and who is harmed.',
                'soft',
              ),
            ]),
            o('Pretending is always a kind of lying', [
              N(
                'That’s a fair answer. A lie leaves someone believing something false. Even kind pretending carries that risk, so many people try to keep it small.',
                'soft',
              ),
            ]),
            o('It depends on whether anyone gets hurt', [
              N(
                'That’s a fair answer, and a wise test. Ask whether it protects someone or tricks someone, and whether you would be happy if it were done to you.',
                'soft',
              ),
            ]),
          ],
          'Thought about whether pretending is the same as lying, and when it protects and when it hurts.',
        ),
      ],
    ),
    sc(
      'a18-03-busy',
      [
        N(
          'The back door bangs. The stepmother comes out on to the step, a daughter on each side, to see how thin and brown Vasilisa has got.',
        ),
        STEP('Well? Is the garden done? Is the water in? I don’t suppose it is.'),
        N('Vasilisa is holding a dandelion crown and nothing else. She looks at you, very fast.'),
        ELD('She’s been picking flowers! I can tell. She’s got pollen on her nose!', 'angry'),
        STEP('Where is your hoe, girl? Where is your bucket?', 'angry'),
        N('You have about a second.'),
      ],
      [
        ask(
          0,
          'health',
          'protecting skin from the sun',
          'CASEL: Responsible decision-making',
          [
            N(
              'The stepmother hopes sun and wind will spoil Vasilisa’s looks. Strong sun really is hard on skin. What helps protect it?',
            ),
          ],
          [
            o(
              'A hat, shade at midday, sun cream and plenty of water',
              [
                N(
                  'Yes. Cover up, rest in the shade when the sun is highest, use sun cream, and drink often. Sunburn is real damage to skin, not just redness.',
                  'happy',
                ),
              ],
              true,
            ),
            o('Nothing: brown skin is always safe', [
              N(
                'A tan is the skin responding to damage. Hats, shade and sun cream protect it, and water keeps you from overheating.',
              ),
            ]),
            o('Working faster, to finish before it gets hot', [
              N(
                'Fast work may help, but it doesn’t protect skin. A hat, shade, sun cream and water do.',
              ),
            ]),
          ],
          'Learned ways to protect skin from strong sun: a hat, shade, sun cream and water.',
        ),
      ],
      [
        ch('bucket', 'Hand her an empty bucket.', [
          N(
            'She takes it and swings it as if it were full and heavy. It is a very good performance.',
          ),
          STEP('Hm. Well. Carry on, then.'),
        ]),
        ch('splash', 'Tip the dipper from the water butt over her apron.', [
          N('Splash. She looks soaked and hard done by, which is perfect.'),
          YNG('She’s all wet! Ha!', 'happy'),
          STEP('Hush. She looks… well, actually. How does she look so well?', 'angry'),
        ]),
        ch('weed', 'Get your Nubbin to stand very still, like a weed.', [
          N(
            'Your Nubbin stands stock still in the cabbage bed, still wearing the dandelion crown.',
          ),
          N('The stepmother walks right past it and never sees it. You are very proud of it.'),
        ]),
      ],
    ),
    sc(
      'a18-03-busy-done',
      [
        N(
          'The stepmother walks round the whole garden and finds nothing wrong with it. This makes her crosser than anything could.',
        ),
        STEP('Sun and wind. Every day. We shall see.', 'angry'),
      ],
      [
        ask(
          1,
          'social-studies',
          'fair sharing of household work',
          'D2.Civ.8.K-2',
          [
            N(
              'One girl does every job in the house while two others sit. What would a fairer household do?',
            ),
          ],
          [
            o(
              'Share the jobs in a rota, so everyone has a turn',
              [
                N(
                  'Yes. A rota gives everyone the same share of work and rest. Fairness doesn’t mean everyone does the same job, only that nobody carries it all.',
                  'happy',
                ),
              ],
              true,
            ),
            o('Give the hardest jobs to the youngest', [
              N(
                'That can feel unfair, since the youngest are often the least strong. A fair plan shares hard jobs and easy jobs.',
              ),
            ]),
            o('Let whoever is quietest do the work', [
              N(
                'Being quiet isn’t a reason to do more. A fair household shares the work so no one is taken for granted.',
              ),
            ]),
          ],
          'Reasoned about fairness: household work is fairest when everyone shares it.',
        ),
      ],
    ),
    sc(
      'a18-03-complete',
      [
        N(
          'Spring turns into summer. Every morning the work is done, and every evening the best bits go down to the cellar.',
        ),
        N(
          'The stepmother’s daughters sit in the shade and grow sour and pale from all the sitting.',
        ),
        N(
          'Vasilisa works in the sun, or seems to, and grows browner and stronger and lovelier every week.',
        ),
        ELD(
          'It isn’t fair. She works and works and gets prettier. We sit and sit and get worse.',
          'angry',
        ),
        N(
          'Your Nubbin, who naps in the cabbage bed on the doll’s working mornings, has never looked better either.',
        ),
      ],
      [
        ask(
          0,
          'science',
          'why summer days are longer: the Earth’s tilt',
          '1-ESS1-2',
          [N('In summer the sun stays up much longer than in winter. What causes the difference?')],
          [
            o(
              'The Earth is tilted, so in summer our part of the world leans towards the Sun',
              [
                N(
                  'Yes. The Earth’s axis is tilted. When our half leans towards the Sun we get more hours of daylight, and when it leans away the days are short.',
                  'happy',
                ),
              ],
              true,
            ),
            o('The Sun moves closer to the Earth in summer', [
              N(
                'A common guess, but no. The Earth is actually a little further from the Sun in the northern summer. The tilt is what matters.',
              ),
            ]),
            o('Clocks are changed in summer', [
              N(
                'Clocks only shift the labels of the hours. The extra daylight comes from the Earth’s tilt.',
              ),
            ]),
          ],
          'Learned that the Earth’s tilt, not distance from the Sun, gives long summer days and short winter days.',
        ),
      ],
    ),
  ],
  [
    gloss('mistress', 'The woman in charge of running a household.', 'a18-03-cart'),
    gloss('salve', 'A soothing cream for sore or burnt skin.', 'a18-03-dawn'),
  ],
);

// ================================================================== A18-4 Suitors
const A04 = quest(
  'a18-04',
  'Suitors',
  {
    'a18-04-s1': {
      goal: 'Step back into the page, some years on.',
      hint: 'Turn the atlas page and walk up the path to the merchant’s gate.',
    },
    'a18-04-s2': {
      goal: 'See what the stepmother says to the young men at the gate.',
      hint: 'Stand near the gate and listen.',
    },
    'a18-04-s3': {
      goal: 'Hold the gate for the last young man, and see him go.',
      hint: 'Open the gate when he knocks. You can’t let him in.',
    },
  },
  [
    sc(
      'a18-04-years',
      [
        N('The atlas turns several pages at once, with a sound like a flock of birds getting up.'),
        N(
          'When you step in, the birches by the house are twice as tall. The apple tree has a swing on it, too small now for anyone.',
        ),
        N(
          'Vasilisa comes down the path. She is grown: taller than you, her plait wound round her head, a basket on her arm.',
        ),
        V('You! You haven’t changed at all. Not a hair. And neither has it.', 'shock'),
        N(
          'Your Nubbin walks round her twice, puzzled, as if she were a tree it used to know as a sapling.',
        ),
        V('I’m glad. Everything else changes. It’s nice when something doesn’t.', 'soft'),
        V(
          'Stay a while? There’s been a lot of knocking at the gate lately, and I’d like somebody sensible about.',
        ),
      ],
      [
        ask(
          2,
          'maths',
          'subtraction to find an interval of years',
          '2.OA.A.1',
          [
            N(
              'Vasilisa was eight when you met her. She looks about seventeen now. About how many years has the atlas skipped?',
            ),
          ],
          [
            o(
              'About 9 years',
              [N('Yes. 17 − 8 = 9. You can count up from 8 to 17 to check: nine steps.', 'happy')],
              true,
            ),
            o('About 25 years', [
              N('That’s 17 + 8. To find the gap between two ages, subtract: 17 − 8 = 9.'),
            ]),
            o('About 8 years', [
              N('Eight was her age then, not the gap. Subtract: 17 − 8 = 9 years.'),
            ]),
          ],
          'Subtracted 8 from 17 to find the time that had passed (9 years).',
        ),
      ],
      [
        ch('knocking', 'Ask who’s been knocking.', [
          V('Young men. For me. Not for my sisters. You can imagine how that’s going.', 'think'),
        ]),
        ch('pocket', 'Ask, very quietly, about her pocket.', [
          V('Still there. Still eats better than I do. She says hello.'),
          N('The doll has said no such thing. Vasilisa is being kind to your Nubbin.'),
        ]),
      ],
    ),
    sc(
      'a18-04-years-done',
      [
        N('Behind her, down at the gate, somebody is already knocking.'),
        N('Knock, knock, knock. The sound carries up the path long before you can see the hand.'),
      ],
      [
        ask(
          1,
          'science',
          'sound travels as vibrations',
          '4-PS3-2',
          [
            N(
              'The knock is heard far up the path. How does the sound get from the gate to your ears?',
            ),
          ],
          [
            o(
              'The gate vibrates and shakes the air, and the shaking air carries the sound',
              [
                N(
                  'Yes. Every sound begins with a vibration. The vibrating wood pushes the air, and the pushes travel outward until they reach your ears.',
                  'happy',
                ),
              ],
              true,
            ),
            o('The wood sends little pieces of itself through the air', [
              N(
                'Nothing leaves the wood. It shakes the air, and the shaking, not any pieces, travels to you.',
              ),
            ]),
            o('Sound jumps instantly, with no travel time', [
              N(
                'It travels fast but not instantly. That is why you hear thunder after you see lightning.',
              ),
            ]),
          ],
          'Learned that sound is made by vibrations that travel through the air to our ears.',
        ),
      ],
    ),
    sc(
      'a18-04-gate',
      [
        N(
          'At the gate stands a young man in a clean shirt, holding his hat. There is another behind him, and another coming up the lane.',
        ),
        STEP('Who is it for? Not for my girls?', 'angry'),
        N('The first young man goes pink and says Vasilisa’s name.'),
        STEP(
          'Then go home. The youngest doesn’t marry before the elders. That is the custom in this house.',
        ),
        STEP('Come back when you have something to say to my daughters.'),
        N('He goes. The second one doesn’t get his name out before the gate swings shut on him.'),
        ELD('Nobody comes for us. Not one. It’s her face.', 'sad'),
        YNG('It’s her fault for having it.', 'angry'),
        N(
          'Upstairs, a window closes very quietly. Vasilisa doesn’t come down until they have all gone.',
        ),
      ],
      [
        think(
          3,
          'social-studies',
          'whether a custom is reason enough',
          'D2.Civ.8.K-2',
          [
            N(
              'The stepmother says it is the custom that the youngest doesn’t marry before the elders. Is “it’s the custom” a good enough reason to treat someone unfairly? What makes a custom worth keeping?',
            ),
          ],
          [
            o('A custom should be kept only if it is fair to everyone', [
              N(
                'That’s a fair answer. Many customs are kind, like greeting guests. But a custom that hurts people can be changed, because people made it.',
                'soft',
              ),
            ]),
            o('Customs hold a community together, so they matter', [
              N(
                'That’s a fair answer. Shared customs give people belonging. The harder question is what to do when a custom and fairness pull in different directions.',
                'soft',
              ),
            ]),
            o('It depends on who chose it and who it helps', [
              N(
                'That’s a fair answer. Ask who the custom serves. Here it serves the stepmother’s daughters, which is a clue.',
                'soft',
              ),
            ]),
          ],
          'Thought about whether tradition alone justifies a rule, and how fairness should shape a custom.',
        ),
      ],
    ),
    sc(
      'a18-04-gate-done',
      [
        STEP(
          'Lodger. You’ll keep that gate tomorrow. Nobody comes in for her. Do you understand me?',
          'angry',
        ),
        N('She doesn’t wait for an answer. She has never needed one.'),
      ],
      [
        ask(
          1,
          'literacy',
          'what a character’s words show about her',
          'RL.3.3',
          [
            N(
              'The stepmother ends with the words “do you understand me” and doesn’t wait for a reply. What does this show about her character?',
            ),
          ],
          [
            o(
              'She is used to being obeyed and likes to be in control',
              [
                N(
                  'Yes. A question she doesn’t wait for isn’t a question, it’s an order. Her tone shows control and an expectation of obedience.',
                  'happy',
                ),
              ],
              true,
            ),
            o('She is shy and unsure', [
              N(
                'Look at the commands and the anger. Someone who gives orders without waiting is confident about being obeyed, not shy.',
              ),
            ]),
            o('She cares deeply about what the lodger thinks', [
              N('She never waits to hear. What she cares about is that the gate stays shut.'),
            ]),
          ],
          'Inferred a character’s traits (controlling, used to obedience) from her tone and what she says.',
        ),
      ],
    ),
    sc(
      'a18-04-last',
      [
        N(
          'The next evening one more comes. He is younger than the others, with mended sleeves and a bunch of cornflowers.',
        ),
        SU(
          'Is she in? I’ve walked from the mill. I don’t want anything. I only wanted to ask her.',
        ),
        N('Behind you the stepmother is at one window. Above her, at another, is Vasilisa.'),
        SU('I suppose it’s no. I suppose it was always going to be no.', 'sad'),
        N(
          'Your Nubbin takes hold of the gate with both paws, as if that will help somebody. It isn’t clear who.',
        ),
        N(
          'The hinge creaks. It is the kind of creak that tells a house when somebody leaves, and when they come back.',
        ),
      ],
      [
        ask(
          3,
          'sel',
          'empathy for someone who expects a no',
          'CASEL: Social awareness',
          [
            N(
              'He walked a long way to ask one question, and expects no. What might he feel, and what could you do?',
            ),
          ],
          [
            o(
              'He feels disappointed and a little foolish; be kind and honest',
              [
                N(
                  'Yes. Hoping and expecting to be refused is a lonely mix. Kindness and honesty cost you little and mean a lot.',
                  'soft',
                ),
              ],
              true,
            ),
            o('He feels nothing; it is only a gate', [
              N(
                'He walked from the mill with flowers. That’s a lot of hope. Look at his voice: it’s a sad one.',
              ),
            ]),
            o('He feels angry; you should argue with him', [
              N('He sounds sad, not angry. Arguing would add to it. Kindness helps more.'),
            ]),
          ],
          'Practised empathy: recognised the young man’s disappointment and chose kindness and honesty.',
        ),
      ],
      [
        ch('flowers', 'Tell him she’d like the cornflowers.', [
          SU(
            'Would she? Then give them to her. Don’t say who. She’ll guess, or she won’t.',
            'soft',
          ),
          N('He goes off down the lane lighter than he came.'),
        ]),
        ch('hold', 'Say nothing. Just hold the gate while he goes.', [
          N(
            'He nods to you as if you were a friend, and walks off down the lane without looking back.',
          ),
        ]),
        ch('market', 'Whisper that the stepmother goes to market on Thursdays.', [
          N('He grins. Behind you, the window bangs open.'),
          STEP('I heard that!', 'angry'),
          N('He runs. Your Nubbin runs a little way after him, out of sympathy.'),
        ]),
      ],
    ),
    sc(
      'a18-04-last-done',
      [
        N(
          'Later, at the cellar door, Vasilisa thanks you for minding the gate. She doesn’t say which part she means.',
        ),
        N(
          'On the step lies a single cornflower, as blue as a clear morning. Somebody left it there.',
        ),
      ],
      [
        ask(
          1,
          'literacy',
          'similes',
          'L.4.5',
          [
            N(
              'The cornflower is “as blue as a clear morning”. What is the writer doing with the words “as blue as”?',
            ),
          ],
          [
            o(
              'Comparing the flower to something else, to help us picture its colour',
              [
                N(
                  'Yes. A comparison with “as” or “like” is a simile. A clear morning sky gives you the exact blue in your head.',
                  'happy',
                ),
              ],
              true,
            ),
            o('Saying the flower is the morning', [
              N(
                'That would be a metaphor. Here the writer says “as blue as”, so it is only a comparison: a simile.',
              ),
            ]),
            o('Telling us what time it is', [
              N('It isn’t morning in the scene. The morning is only there to show the colour.'),
            ]),
          ],
          'Identified a simile (“as blue as a clear morning”) and how it helps a reader picture a colour.',
        ),
      ],
    ),
    sc(
      'a18-04-complete',
      [
        N('That winter the knocking stops. Word has got round the lanes.'),
        STEP(
          'That girl is a curse on this house. While she’s in it, my daughters are nobody.',
          'angry',
        ),
        N('She says it to the stove, but loudly enough for the whole kitchen.'),
        N(
          'In the cellar that night, Vasilisa feeds the doll and asks it nothing at all. She only sits with it.',
        ),
        N(
          'You sit on the step above with your Nubbin, and nobody says a word. That seems to be what everybody needed.',
        ),
      ],
      [
        ask(
          0,
          'social-studies',
          'how news travelled before phones',
          'D2.His.2.K-2',
          [
            N(
              'Word got round the lanes without phones, newspapers or post. How did news travel in a village long ago?',
            ),
          ],
          [
            o(
              'By word of mouth, which meant it could change as it went',
              [
                N(
                  'Yes. News passed from person to person, at wells, gates and markets. Each telling could add or lose a little, which is how rumours grow.',
                  'happy',
                ),
              ],
              true,
            ),
            o('By flags on the church roof', [
              N(
                'Some places did use signals, but most news moved by people talking to one another.',
              ),
            ]),
            o('It didn’t travel at all', [
              N(
                'People were as curious as we are. News spread quickly by word of mouth, though not always accurately.',
              ),
            ]),
          ],
          'Learned that before phones, news travelled by word of mouth and could change as it spread.',
        ),
      ],
    ),
  ],
  [
    gloss(
      'custom',
      'Something a family or village has always done, handed down over time.',
      'a18-04-gate',
    ),
  ],
);

// ================================================================== A18-5 The House by the Forest
const A05 = quest(
  'a18-05',
  'The House by the Forest',
  {
    'a18-05-s1': {
      goal: 'Say goodbye to the merchant at his sledge.',
      hint: 'Meet him by the loaded sledge in the yard.',
    },
    'a18-05-s2': {
      goal: 'Help carry the household to the new house at the forest’s edge.',
      hint: 'Load the cart, then walk beside it to the house by the birch wood.',
    },
    'a18-05-s3': {
      goal: 'Go into the birch wood with Vasilisa on an errand, and learn the path.',
      hint: 'Follow her into the trees and watch which way she turns.',
    },
  },
  [
    sc(
      'a18-05-journey',
      [
        N(
          'The merchant’s sledge stands in the yard, loaded with bales. Two horses breathe steam at each other.',
        ),
        MER('A long road this time. Far trade, far towns. Months, maybe more.', 'think'),
        MER(
          'The house is in my wife’s hands. Vasilisa is in hers too. And a little in yours, lodger, if you don’t mind it.',
        ),
        N(
          'He doesn’t say what he means by that. He looks up at the window where his wife is standing, and then at you.',
        ),
        MER('If you see the woman with the map, tell her I still don’t know who won.', 'happy'),
        V('Bring me back something small, Father. Something for my pocket.'),
        MER('Something small for your pocket. I’ll remember.', 'soft'),
      ],
      [
        ask(
          0,
          'science',
          'breath clouds: water vapour condensing in cold air, a change that reverses',
          '2-PS1-4',
          [
            N(
              'The horses’ breath looks like steam on this cold morning. What is the cloud really made of?',
            ),
          ],
          [
            o(
              'Tiny drops of water: warm, damp breath cools and turns from vapour to droplets',
              [
                N(
                  'Yes. Your breath carries invisible water vapour. In cold air it cools and condenses into tiny droplets, which you can see as a cloud. Then the droplets dry back into vapour and the cloud vanishes: the change reverses.',
                  'happy',
                ),
              ],
              true,
            ),
            o('Smoke from the horses’ lungs', [
              N(
                'Nothing is burning inside them. The cloud is water that was already in the warm breath.',
              ),
            ]),
            o('Cold air that the horses have breathed out', [
              N(
                'The breath is warm, not cold. The cloud forms because the warm, damp air meets the cold.',
              ),
            ]),
          ],
          'Learned that visible breath in cold air is water vapour cooling into tiny droplets (condensation).',
        ),
      ],
      [
        ch('promise', 'Promise to look after her.', [
          MER('Good. I believe you. You have the face of somebody who keeps things.', 'soft'),
        ]),
        ch('when', 'Ask when he’ll be back.', [
          MER('When the roads let me. Spring, if they’re kind. Or the one after.', 'sad'),
        ]),
      ],
    ),
    sc(
      'a18-05-journey-done',
      [
        N('The sledge goes out of the gate and down the lane, and the gate creaks behind it.'),
        N('It is a long, low creak. A small rusty hinge would make a high squeak instead.'),
      ],
      [
        ask(
          1,
          'music',
          'pitch depends on how fast something vibrates',
          '1-PS4-1',
          [
            N(
              'The big gate makes a low creak and a small hinge a high squeak. What makes a sound higher in pitch?',
            ),
          ],
          [
            o(
              'Faster vibrations',
              [
                N(
                  'Yes. A faster vibration gives a higher note, and a slower one gives a lower note. Short strings, small hinges and small bells vibrate faster than long, big ones.',
                  'happy',
                ),
              ],
              true,
            ),
            o('Louder vibrations', [
              N(
                'Loudness depends on how big the vibration is. Pitch, high or low, depends on how fast it is.',
              ),
            ]),
            o('Longer vibrations', [
              N(
                'Duration is how long the sound lasts. Pitch depends on speed: faster means higher.',
              ),
            ]),
          ],
          'Learned that a faster vibration makes a higher pitch and a slower one a lower pitch.',
        ),
      ],
    ),
    sc(
      'a18-05-move',
      [
        N(
          'The merchant is hardly over the hill before the stepmother sells the house, to a man with a great many rings.',
        ),
        STEP('Too big. Too dear. We’ll be snug at the edge of the wood.', 'happy'),
        N(
          'Everything goes on one cart: the trunks, the crocks, the counterpane, and you on top with your Nubbin in your lap.',
        ),
        N(
          'The new house stands where the lane gives up. Behind it the birch wood begins: white trunks, then grey, then nothing you can see.',
        ),
        ELD('Everybody says there’s a hut in there. With a fence.', 'shock'),
        YNG('Everybody says somebody lives in it. Somebody who… well. Somebody.'),
        STEP('Hush, both of you. It’s only stories.', 'think'),
        N(
          'She says it looking straight at Vasilisa, as if measuring the distance from the door to the trees.',
        ),
      ],
      [
        ask(
          3,
          'social-studies',
          'birch woods grow across the cool north',
          'D2.Geo.2.K-2',
          [
            N(
              'Birch woods stretch across the cool north, from northern Europe far into Asia, and many old folk tales are set in them. Why do birches do well in cool lands with long winters?',
            ),
          ],
          [
            o(
              'They are hardy: they cope with cold and poor soil and grow quickly',
              [
                N(
                  'Yes. Birches are tough pioneers. They colonise open ground fast, tolerate frost and thin soil, and shed their leaves for winter.',
                  'happy',
                ),
              ],
              true,
            ),
            o('They need snow to survive all year', [
              N(
                'They don’t need snow, only the ability to cope with cold. Birches grow in many cool places.',
              ),
            ]),
            o('They are always planted by people', [
              N(
                'Birch woods grow wild across huge areas. People didn’t plant them; the trees spread on their own.',
              ),
            ]),
          ],
          'Learned that birch trees are hardy and grow across the cool northern lands where this kind of tale is told.',
        ),
      ],
    ),
    sc(
      'a18-05-move-done',
      [
        N(
          'Vasilisa unpacks the counterpane last and puts it on her own bed. Her hand goes to her pocket, and stays there.',
        ),
        N('The counterpane still smells of beeswax, the way her mother’s room did.'),
      ],
      [
        think(
          1,
          'sel',
          'keeping reminders of someone you miss, or putting them away',
          'CASEL: Self-awareness',
          [
            N(
              'A smell, a blanket or a song can bring a person back to mind. When you miss someone, is it better to keep reminders close or to put them away?',
            ),
          ],
          [
            o('Keep them close: keepsakes and stories keep a person near', [
              N(
                'That’s a fair answer. Many people find comfort in a keepsake. Missing someone is not a problem to fix; it is a way of loving them.',
                'soft',
              ),
            ]),
            o('Put them away for a while, so it hurts less', [
              N(
                'That’s a fair answer. Some people need a little distance at first. Many find that the keepsakes come back out when they are ready.',
                'soft',
              ),
            ]),
            o('It changes from day to day, and either is fine', [
              N(
                'That’s a fair answer. Feelings of missing someone move like weather. You can choose again each day, and talking to someone helps.',
                'soft',
              ),
            ]),
          ],
          'Thought about whether keeping or putting away reminders helps when we miss someone, and that either can be right.',
        ),
      ],
    ),
    sc(
      'a18-05-errand',
      [
        STEP(
          'Vasilisa. We need bark for the stove, and mushrooms. The best ones are deep in. Very deep in.',
        ),
        N(
          'Vasilisa takes her basket. Before she goes she slips down to the cellar, and comes up again with an empty napkin.',
        ),
        V('Come with me, this once? Then you’ll know the way, if ever I need you to.'),
        N(
          'In the wood every birch looks like every other birch. The light is white, and the moss swallows your footsteps.',
        ),
        N(
          'Every so often Vasilisa stops and puts a hand in her pocket. Then she turns left, or right, without a moment’s doubt.',
        ),
        V('She tells me. Only when she’s eaten. Never on an empty stomach.'),
        N(
          'Far off between the trunks, for one moment, you see a fence of pale sticks with round pale things on top. Then a birch is in the way.',
        ),
      ],
      [
        ask(
          3,
          'health',
          'never eat a wild mushroom you cannot identify',
          'CASEL: Responsible decision-making',
          [
            N(
              'Mushrooms are the fruiting bodies of fungi. Some are delicious and some are deadly. Why should you never eat a wild mushroom you can’t identify?',
            ),
          ],
          [
            o(
              'Some deadly mushrooms look like safe ones, and even experts are careful',
              [
                N(
                  'Yes. Look-alikes are the danger, and some poisons are not cooked away. Never taste a wild mushroom unless an expert has identified it.',
                  'happy',
                ),
              ],
              true,
            ),
            o('Wild mushrooms are all poisonous', [
              N(
                'Many are safe, but you can’t tell by looking. That is why the rule is never to eat one you can’t identify.',
              ),
            ]),
            o('Only red mushrooms are dangerous', [
              N('Colour is not a safe guide. Some deadly mushrooms are plain white or brown.'),
            ]),
          ],
          'Learned never to eat wild mushrooms they cannot identify, because deadly ones can look like safe ones.',
        ),
      ],
      [
        ch('look', 'Stop and look harder at the fence.', [
          V('Don’t. Not today. We’re here for mushrooms.'),
          N('She takes your sleeve and turns you round, gently, the way you would turn a horse.'),
        ]),
        ch('notch', 'Notch a birch so you’ll know the way.', [
          N(
            'You notch three trunks with your thumbnail. Your Nubbin notches a fourth with its teeth, which is less tidy.',
          ),
        ]),
        ch('mushroom', 'Pick mushrooms, and don’t think about it.', [
          N(
            'You pick mushrooms. Your Nubbin picks one too and eats it, which is a different thing.',
          ),
          V('Not that one! Oh. No, it’s all right. That one’s all right.', 'shock'),
        ]),
      ],
    ),
    sc(
      'a18-05-errand-done',
      [
        N(
          'The doll brings you both home by dusk with a full basket. The stepmother, at the window, doesn’t look pleased to see you.',
        ),
        N(
          'Vasilisa tips out the basket. Her mother taught her each kind by sight: twelve red-capped mushrooms from the clearings and fifteen brown ones from the shade.',
        ),
      ],
      [
        ask(
          1,
          'maths',
          'addition within 100',
          '2.OA.A.1',
          [
            N(
              'Twelve red-capped mushrooms and fifteen brown ones. How many mushrooms are in the basket?',
            ),
          ],
          [
            o(
              '27',
              [
                N(
                  'Yes. 12 + 15 = 27. Add the tens (10 + 10 = 20) and the ones (2 + 5 = 7), then put them together.',
                  'happy',
                ),
              ],
              true,
            ),
            o('17', [N('That’s 12 + 5. Remember to add the whole 15: 12 + 15 = 27.')]),
            o('37', [N('That’s a ten too many. 10 + 10 = 20 and 2 + 5 = 7, so the total is 27.')]),
          ],
          'Added 12 and 15 to make 27, partitioning into tens and ones.',
        ),
      ],
    ),
    sc(
      'a18-05-complete',
      [
        N(
          'It goes on like that all summer. Vasilisa is sent into the wood for bark, for berries, for nothing much.',
        ),
        N('Every time, she feeds the doll first. Every time, she comes home.'),
        STEP('That girl has more luck than sense.', 'angry'),
        ELD('Or something in her pocket.', 'think'),
        N(
          'Vasilisa goes very still. Then she laughs, and pulls out a handkerchief to show them, and they lose interest.',
        ),
        N(
          'That night she asks you to keep the cellar door. You sit on the step till morning, with your Nubbin asleep on your knees.',
        ),
      ],
      [
        ask(
          3,
          'literacy',
          'using clues from the text to support an inference',
          'RL.3.3',
          [
            N(
              'The stepmother blames luck. The elder sister guesses something in the pocket. Which clue from the story supports the sister’s guess?',
            ),
          ],
          [
            o(
              'Vasilisa always feeds the doll first, and always comes home safely',
              [
                N(
                  'Yes. The pattern of events is the evidence: the feeding comes first, and the safe return follows every time. Good readers support a guess with clues.',
                  'happy',
                ),
              ],
              true,
            ),
            o('Vasilisa is very pretty', [
              N(
                'That’s true, but it says nothing about why she is safe in the wood. We need a clue about what happens to her.',
              ),
            ]),
            o('The stepmother dislikes the forest', [
              N(
                'That tells us about the stepmother, not about the pocket. Look for what Vasilisa does before each errand.',
              ),
            ]),
          ],
          'Used a repeated pattern in the story as evidence to support an inference.',
        ),
      ],
    ),
  ],
  [
    gloss(
      'fungi',
      'Living things such as mushrooms and moulds, which are neither plants nor animals.',
      'a18-05-errand',
    ),
  ],
);

// ================================================================== A18-6 One Candle
const A06 = quest(
  'a18-06',
  'One Candle',
  {
    'a18-06-s1': {
      goal: 'Sit with the family for an evening of work by one candle.',
      hint: 'Take your place at the table, near the candle.',
    },
    'a18-06-s2': {
      goal: 'See what happens to the candle.',
      hint: 'Stay at the table. It is about to go dark.',
    },
    'a18-06-s3': {
      goal: 'Set out the doll’s supper in the dark, the way Vasilisa taught you.',
      hint: 'Feel for the napkin and lay the morsels in a row, then wait.',
    },
  },
  [
    sc(
      'a18-06-evening',
      [
        N('An autumn evening, with the wind getting up. Rain needles the window.'),
        STEP('Work, all of you. Lace for you, my love. A stocking for you. Vasilisa, spin.'),
        N(
          'She goes round the house putting out every fire: the lamp, the rushlight, even the stove, banked down to grey.',
        ),
        STEP('One candle is enough. We’re not made of money.'),
        N(
          'So there is one candle on the table, four people working round it, and you, and your Nubbin, which keeps trying to sit on the warm bit.',
        ),
        N(
          'Vasilisa’s spindle turns and turns. Her thread comes out thin and even, finer than anyone’s.',
        ),
      ],
      [
        ask(
          4,
          'health',
          'candle safety',
          'CASEL: Responsible decision-making',
          [N('A candle is a real flame. What is the safest way to use one?')],
          [
            o(
              'On a steady holder, away from cloth and hair, never left alone, with water to hand',
              [
                N(
                  'Yes. Most candle fires start with a flame left unwatched or placed near something that burns. A steady holder and constant watching prevent them.',
                  'happy',
                ),
              ],
              true,
            ),
            o('Wherever is brightest, even on a pile of cloth', [
              N(
                'Cloth burns easily. A candle belongs on a steady holder, well away from anything that can catch.',
              ),
            ]),
            o('Left to burn while everyone goes to bed', [
              N(
                'An unwatched flame is how fires start. Always put a candle out before leaving the room.',
              ),
            ]),
          ],
          'Learned the basics of candle safety: a steady holder, away from things that burn, never left alone.',
        ),
      ],
      [
        ch('wool', 'Hold the wool for the younger sister.', [
          YNG('Higher. No, lower. No… oh. Just like that. Thank you.', 'soft'),
          N('For a moment she nearly smiles at you. Then she remembers she is cross.'),
        ]),
        ch('candle', 'Keep your Nubbin off the candle.', [
          N(
            'You lift your Nubbin off the table three times. The fourth time you just hold it, and it watches the flame from your lap.',
          ),
        ]),
      ],
    ),
    sc(
      'a18-06-evening-done',
      [
        N(
          'The elder sister looks at the candle, and then at her mother. Her mother nods, very slightly.',
        ),
        N('Nobody says a word. Something has just been agreed.'),
      ],
      [
        ask(
          1,
          'sel',
          'body language carries messages',
          'CASEL: Social awareness',
          [
            N(
              'No one speaks, yet something has been agreed. What do we call messages sent by a nod, a look or the way someone stands?',
            ),
          ],
          [
            o(
              'Body language',
              [
                N(
                  'Yes. Body language, also called non-verbal communication, can say as much as words. Noticing it helps us understand how others feel and what they intend.',
                  'happy',
                ),
              ],
              true,
            ),
            o('Sign writing', [
              N(
                'Sign writing is for written messages. Nods, glances and posture together are called body language.',
              ),
            ]),
            o('Echoes', [
              N('An echo is a sound bouncing back. A nod or a glance is body language.'),
            ]),
          ],
          'Learned that nods, looks and posture are body language, which helps us read people’s feelings and plans.',
        ),
      ],
    ),
    sc(
      'a18-06-wick',
      [
        ELD('This wick wants trimming. It’s smoking.'),
        N(
          'She reaches out with the scissors and snips, and the flame goes out. All of it, every bit of light in the house.',
        ),
        ELD('Oh! Oh dear. By accident.', 'shock'),
        N('In the dark, your Nubbin climbs straight up your front and into your coat.'),
        STEP('Now what? No fire in the house, and the stove gone out. We must have light.'),
        YNG('Well, I’m not going. I can see by my pins.'),
        ELD('And I can see by my needles. I’m not going either.'),
        ELD(
          'Vasilisa can fetch it. Into the wood with you, to Baba Yaga, and ask her for fire!',
          'angry',
        ),
        N('Both sisters push her out of the room into the dark, as if it had been her idea.'),
      ],
      [
        ask(
          3,
          'science',
          'eyes adjust to the dark',
          '4-LS1-2',
          [
            N(
              'In the sudden dark you see nothing, but after a while shapes appear. What is happening in your eyes?',
            ),
          ],
          [
            o(
              'The pupils widen to let in more light, and the eyes slowly grow more sensitive',
              [
                N(
                  'Yes. The pupils open wide, and over many minutes the light-sensing cells at the back of the eye become more sensitive. That is why a dark room slowly reveals its shapes.',
                  'happy',
                ),
              ],
              true,
            ),
            o('Your eyes make their own light', [
              N(
                'Eyes only receive light; they don’t send it out. They adapt to catch whatever little light there is.',
              ),
            ]),
            o('The room gets lighter by itself', [
              N(
                'The room is just as dark. It is your eyes that have changed to make the most of the little light.',
              ),
            ]),
          ],
          'Learned that in the dark the pupils widen and the eyes become more sensitive over several minutes.',
        ),
      ],
    ),
    sc(
      'a18-06-wick-done',
      [
        V('Wait for me at the cellar door. I have to ask somebody first.', 'soft'),
        N('The sisters sent her, and a sister snipped the wick. It was never her idea.'),
      ],
      [
        ask(
          1,
          'social-studies',
          'blaming someone unfairly: a scapegoat',
          'D2.Civ.8.K-2',
          [
            N(
              'When people blame one person for something they did themselves, that person is called a scapegoat. Why is this unfair?',
            ),
          ],
          [
            o(
              'The person pays for something they didn’t do',
              [
                N(
                  'Yes. A scapegoat takes the blame and the danger for others’ choices. Fair rules say people answer for their own actions.',
                  'happy',
                ),
              ],
              true,
            ),
            o('Because blaming is always rude', [
              N(
                'Sometimes blaming is deserved. Here it is unfair because the blame lands on the wrong person.',
              ),
            ]),
            o('It isn’t unfair if the person is younger', [
              N(
                'Age makes it worse, not better. Fairness means the person who did the thing answers for it.',
              ),
            ]),
          ],
          'Learned the word scapegoat and why blaming the wrong person is unfair.',
        ),
      ],
    ),
    sc(
      'a18-06-ask',
      [
        N(
          'There is no light in the cellar, only the shape of her kneeling, and the rustle of a napkin.',
        ),
        V('My hands are shaking. You do it. You know how.', 'sad'),
        N(
          'So you lay the morsels out by feel, in a row, the way she showed you years ago. The best bits, and all of her supper.',
        ),
        N('Your Nubbin’s nose comes out of your coat to check the row is straight. It is.'),
        V('Little doll, please eat. I’m frightened.', 'sad'),
        V(
          'They’re sending me to Baba Yaga for fire. Everybody says nobody comes back from her. What do I do?',
        ),
        N('In the dark, two small lights come on. The supper goes, crumb by crumb.'),
        DOLL(
          'Don’t be afraid. Go where they send you. Keep me in your pocket, and nothing bad will come to you there.',
          'soft',
        ),
        V('In my pocket. All right.'),
        N('She stands, and you hear her put the doll away, and button the pocket over it.'),
      ],
      [
        think(
          5,
          'sel',
          'being brave is not the same as not being afraid',
          'CASEL: Self-management',
          [
            N(
              'Vasilisa is frightened, and she goes anyway. Is being brave the same as not being afraid? What helps you act when you are afraid?',
            ),
          ],
          [
            o('Brave means acting even though you are afraid', [
              N(
                'That’s a fair answer. Most brave people feel fear. Courage is what they do with it.',
                'soft',
              ),
            ]),
            o('Not being afraid is the real thing', [
              N(
                'That’s a fair answer. Some people feel less fear than others. Even so, ask what you would call someone who feels fear and goes on anyway.',
                'soft',
              ),
            ]),
            o('Having someone or something that helps you, like her doll', [
              N(
                'That’s a fair answer. A friend, a plan or a comforting object can steady us. Vasilisa isn’t brave because she is alone, but because she keeps going.',
                'soft',
              ),
            ]),
          ],
          'Thought about courage as acting while afraid, and what helps when we feel fear.',
        ),
      ],
      [
        ch('coming', 'Tell her you’re coming too.', [
          V('I hoped you would. I wasn’t going to ask.', 'soft'),
        ]),
        ch('coat', 'Put your scarf round her neck.', [
          V('Then you’ll be cold.'),
          Y('I’ve got a Nubbin down my front. I’ll be fine.'),
        ]),
        ch('nubbin', 'Let your Nubbin decide.', [
          N(
            'Your Nubbin climbs down, crosses the dark cellar and sits on Vasilisa’s foot, facing the door. That settles it.',
          ),
        ]),
      ],
    ),
    sc(
      'a18-06-ask-done',
      [
        N('Up the steps, through the dark kitchen, past three people who don’t say goodbye.'),
        N('There are six cellar steps, each about eighteen centimetres high.'),
      ],
      [
        ask(
          1,
          'maths',
          'multiplication: 6 × 18 cm, a height problem',
          '4.MD.A.2',
          [
            N(
              'Each of the six steps is 18 cm high. How high is the climb from the cellar floor to the kitchen?',
            ),
          ],
          [
            o(
              '108 cm',
              [
                N(
                  'Yes. 6 × 18 = 108 cm, a little over a metre. You can find it as 6 × 10 = 60 plus 6 × 8 = 48.',
                  'happy',
                ),
              ],
              true,
            ),
            o('24 cm', [N('That’s 6 + 18. Six steps of 18 cm each means 6 × 18 = 108 cm.')]),
            o('98 cm', [
              N('Close, but check the ones: 6 × 8 = 48, and 6 × 10 = 60, so 60 + 48 = 108 cm.'),
            ]),
          ],
          'Multiplied 6 × 18 to find a height of 108 cm.',
        ),
      ],
    ),
    sc(
      'a18-06-complete',
      [
        N('Nobody brings a light to see you off. The back gate shuts behind you on its own.'),
        N(
          'The birches are white even in the dark, like a crowd of people who have stopped talking.',
        ),
        V('I know the way. She’ll tell me if I don’t.', 'think'),
        N(
          'Your Nubbin rides inside your coat with only its eyes out. In Vasilisa’s pocket, something small is awake.',
        ),
      ],
      [
        ask(
          1,
          'literacy',
          'similes',
          'L.4.5',
          [
            N(
              'The birches are “like a crowd of people who have stopped talking”. A comparison that uses “like” or “as” is called what?',
            ),
          ],
          [
            o(
              'A simile',
              [
                N(
                  'Yes. A simile compares two different things using “like” or “as”. This one makes the pale, silent trunks feel like watching people.',
                  'happy',
                ),
              ],
              true,
            ),
            o('A metaphor', [
              N(
                'A metaphor says one thing is another, with no “like” or “as”. This comparison uses “like”, so it is a simile.',
              ),
            ]),
            o('A rhyme', [
              N('Rhymes match end sounds. This is a comparison using “like”: a simile.'),
            ]),
          ],
          'Identified a simile and how it creates a picture in the reader’s mind.',
        ),
      ],
    ),
  ],
  [
    gloss(
      'scapegoat',
      'A person who is blamed for something other people did.',
      'a18-06-wick-done',
    ),
    gloss('simile', 'A comparison that uses the word like or as.', 'a18-06-complete'),
  ],
);

// ================================================================== A18-7 The Three Riders
const A07 = quest(
  'a18-07',
  'The Three Riders',
  {
    'a18-07-s1': {
      goal: 'Walk through the birch wood all night with Vasilisa.',
      hint: 'Keep close behind her and turn when she turns.',
    },
    'a18-07-s2': {
      goal: 'Stand still and let the riders go by.',
      hint: 'Step off the path at dawn, and again at sunrise.',
    },
    'a18-07-s3': {
      goal: 'Reach the clearing at dusk, and let the last rider pass.',
      hint: 'Keep to the edge of the clearing. Hide your Nubbin if it wants hiding.',
    },
  },
  [
    sc(
      'a18-07-night',
      [
        N('All night you walk. The path isn’t a path, but Vasilisa never once stops to wonder.'),
        N(
          'Twice an owl goes over. Once something large walks past between the trunks, and doesn’t look at you, and you don’t look at it.',
        ),
        N(
          'The cold comes down. Your breath and hers go up in front of you, and the Nubbin’s, smaller, from your collar.',
        ),
        V('Talk to me. Anything. If I listen to the wood, I start to hear things.', 'sad'),
        V(
          'And if you hear hooves, stand still. That’s what they say. Stand still and let them by.',
          'think',
        ),
        N('Then, near the end of the dark, you hear hooves.'),
      ],
      [
        ask(
          1,
          'science',
          'owls are nocturnal and fly silently',
          '4-LS1-1',
          [
            N(
              'Owls are nocturnal, which means awake at night. This one glides over without a sound. Why can owls fly so quietly?',
            ),
          ],
          [
            o(
              'Soft, fringed feather edges break up the air so the wings make hardly any noise',
              [
                N(
                  'Yes. The comb-like edges of an owl’s wing feathers smooth the airflow, so prey can’t hear it coming. A body feature that helps the animal survive is an adaptation.',
                  'happy',
                ),
              ],
              true,
            ),
            o('Owls flap their wings very slowly', [
              N(
                'Slow flapping helps a little, but the real secret is the soft, fringed edges of the feathers.',
              ),
            ]),
            o('Owls can switch their wings off', [
              N(
                'Owls can’t switch anything off. Their feathers are built to muffle the sound of the air.',
              ),
            ]),
          ],
          'Learned that owls are nocturnal and that their fringed feathers let them fly almost silently.',
        ),
      ],
      [
        ch('garden', 'Tell her about your gran’s garden, quickly.', [
          N(
            'You whisper about the Grove: the pond, the gate that sticks, a gran who could make anything grow and never sat still.',
          ),
          V('She sounds like Mother. Not to look at. In the hands.', 'soft'),
        ]),
        ch('count', 'Count the birches with her, under your breath.', [
          N('You get to four hundred and twelve, and Vasilisa says thirteen.'),
          N('Your Nubbin, from inside your coat, sneezes, which makes it fourteen.'),
        ]),
        ch('hand', 'Hold her hand and say nothing.', [
          N('Her hand is cold and holds on hard. After a while it gets warmer.'),
        ]),
      ],
    ),
    sc(
      'a18-07-night-done',
      [
        N('Vasilisa stops, and you stop. Your Nubbin stops breathing, to be on the safe side.'),
        N('Your heart is going like a drum, and your hands have gone cold.'),
      ],
      [
        ask(
          1,
          'health',
          'slow breathing calms the body',
          'CASEL: Self-management',
          [N('When we are frightened our hearts beat faster. What helps slow them down again?')],
          [
            o(
              'Slow, deep breaths, which tell the body it is safe',
              [
                N(
                  'Yes. Breathing in slowly and out more slowly tells the body the danger has passed, and the heartbeat settles. Try it: in for four, out for six.',
                  'happy',
                ),
              ],
              true,
            ),
            o('Holding your breath for as long as you can', [
              N(
                'Holding your breath keeps the body on alert. Slow, steady breathing is what calms it.',
              ),
            ]),
            o('Running on the spot', [
              N('Running speeds the heart up even more. Slow breaths calm it.'),
            ]),
          ],
          'Learned that slow, deep breathing signals the body to calm down when frightened.',
        ),
      ],
    ),
    sc(
      'a18-07-white',
      [
        N(
          'A rider comes through the trees at a walk. He is all in white, on a white horse with white harness, and his face is pale and calm.',
        ),
        N(
          'He doesn’t look at you. As he passes, the sky behind the birches goes from black to grey, and then to the colour of milk.',
        ),
        V('Morning. He brought the morning. Or it followed him.', 'shock'),
        N('You walk on. The birds start: one, and then all of them.'),
        N('Then another rider comes, at a trot, all in red on a red horse, red as a hearth.'),
        N(
          'As he passes, the sun comes up over the trees, and everything you can see goes red, then gold, then plain day.',
        ),
        V('White, then red. Somebody’s counting out the day, like coins.', 'think'),
      ],
      [
        ask(
          5,
          'science',
          'why sunrise looks red and gold: light scattering',
          '4-PS3-2',
          [
            N(
              'At sunrise the sky turns red and gold. Why? At that hour sunlight has to pass through a lot of air to reach you.',
            ),
          ],
          [
            o(
              'The air scatters away the blue light, leaving reds and oranges to reach our eyes',
              [
                N(
                  'Yes. Sunlight is a mix of colours. Air scatters the blue most strongly, so when the light has a long path through the air, reds and golds are what remain.',
                  'happy',
                ),
              ],
              true,
            ),
            o('The Sun itself changes colour at dawn', [
              N(
                'The Sun’s light stays the same. It is the long path through the air that changes what colours reach us.',
              ),
            ]),
            o('Red clouds paint the sky each morning', [
              N(
                'Clouds can add colour, but even a cloudless sunrise is red and gold. The cause is the scattering of light by air.',
              ),
            ]),
          ],
          'Learned that sunrise looks red and gold because air scatters blue light when sunlight takes a long path.',
        ),
      ],
      [
        ch('bow', 'Bow your head as he passes.', [
          N('You bow. The red rider doesn’t notice, or does, and doesn’t mind.'),
        ]),
        ch('wave', 'Let your Nubbin wave.', [
          N(
            'Your Nubbin puts one paw out of your coat and waves. The red rider, without turning his head, lifts one finger from the rein.',
          ),
        ]),
      ],
    ),
    sc(
      'a18-07-white-done',
      [
        N(
          'All day you walk. The wood gets older and darker, and the birches give way to trees whose names you don’t know.',
        ),
        N(
          'You walk steadily, about four kilometres every hour, and stop only to drink at a stream.',
        ),
      ],
      [
        ask(
          1,
          'maths',
          'distance = speed × time',
          '4.MD.A.2',
          [N('If you walk 4 kilometres every hour for 8 hours, how far have you come?')],
          [
            o(
              '32 km',
              [
                N(
                  'Yes. 4 km × 8 hours = 32 km. Every hour adds another 4: 4, 8, 12, 16, 20, 24, 28, 32.',
                  'happy',
                ),
              ],
              true,
            ),
            o('12 km', [
              N('That’s 4 + 8. Each of the 8 hours covers 4 km, so multiply: 4 × 8 = 32 km.'),
            ]),
            o('48 km', [
              N('That’s 6 × 8, not 4 × 8. Four kilometres an hour for 8 hours is 32 km.'),
            ]),
          ],
          'Multiplied speed by time (4 km × 8 hours) to find a distance of 32 km.',
        ),
      ],
    ),
    sc(
      'a18-07-black',
      [
        N(
          'At dusk you come out into a clearing. On the far side stands a hut, and round the hut, a fence.',
        ),
        N(
          'Before you can look properly, there are hooves again, slow ones. A rider all in black, on a black horse, crosses the clearing.',
        ),
        N(
          'Your Nubbin goes all the way down inside your coat. You can feel it there, a warm round lump, shaking a little.',
        ),
        N(
          'The black rider reaches the gate of the hut, and then he isn’t there any more, as if the ground had opened for him.',
        ),
        N('And night falls, all at once, like a lid.'),
        V(
          'Night. That was night. They were all one thing, weren’t they? Day, and sun, and night.',
          'shock',
        ),
      ],
      [
        ask(
          4,
          'science',
          'day and night come from the Earth’s rotation',
          '5-ESS1-2',
          [N('In the story night falls all at once. In real life, why do we have day and night?')],
          [
            o(
              'The Earth spins once every 24 hours, turning each place towards and then away from the Sun',
              [
                N(
                  'Yes. Half the Earth is always in sunlight and half in shadow, and the spin carries us from one to the other. Night falls gradually, as dusk, in our world.',
                  'happy',
                ),
              ],
              true,
            ),
            o('The Sun travels round the Earth each day', [
              N(
                'It looks that way, which is why people once believed it. But the Earth spins, and that makes the Sun seem to cross the sky.',
              ),
            ]),
            o('The Moon covers the Sun at night', [
              N(
                'The Moon doesn’t cover the Sun every night. Night is simply when your side of the Earth faces away from it.',
              ),
            ]),
          ],
          'Learned that the Earth spinning once every 24 hours gives us day and night.',
        ),
      ],
      [
        ch('hold', 'Put a hand over your Nubbin, through your coat.', [
          N('You hold it through the wool. It stops shaking, mostly.'),
        ]),
        ch('hum', 'Hum something very low, for your Nubbin.', [
          N(
            'You hum the Lantern Song under your breath. Vasilisa doesn’t know it, but by the second line she is humming it back.',
          ),
        ]),
      ],
    ),
    sc(
      'a18-07-black-done',
      [
        N('Your Nubbin stays down in your coat. It isn’t coming out for anybody.'),
        N('Nobody tries to make it. You don’t think anyone should.'),
      ],
      [
        think(
          1,
          'sel',
          'when hiding helps and when it holds us back',
          'CASEL: Self-awareness',
          [
            N(
              'Your Nubbin hides when it is scared. Is hiding okay? When might it help, and when might it stop us getting something we need?',
            ),
          ],
          [
            o('Hiding for a moment helps us feel safe and steady', [
              N(
                'That’s a fair answer. A short pause to calm down is sensible. Many brave people step away first, then return.',
                'soft',
              ),
            ]),
            o('Hiding can keep us from things we need or want', [
              N(
                'That’s a fair answer. If we always hide from what scares us, the fear grows and we miss out. Small steps back towards it can help.',
                'soft',
              ),
            ]),
            o('It depends how long, and whether someone is with you', [
              N(
                'That’s a fair answer. A short rest with a friend close by is very different from hiding alone for a long time.',
                'soft',
              ),
            ]),
          ],
          'Thought about when hiding from fear helps us feel safe and when it might hold us back.',
        ),
      ],
    ),
    sc(
      'a18-07-complete',
      [
        N('In the dark round the hut, lights come on. Not in the windows, but in the fence.'),
        V('There. That’s her house. Everybody said.', 'sad'),
        N(
          'Vasilisa puts her hand in her pocket. Then she takes it out, squares her shoulders, and walks forward.',
        ),
        N('You go with her. You said you would.'),
      ],
      [
        ask(
          0,
          'art',
          'colour describes a setting and sets its mood',
          'RL.4.3',
          [
            N(
              'The tale paints its setting in colour: white for milky dawn, red for sunrise, black for night. If an artist painted this clearing, how might she show a spooky night?',
            ),
          ],
          [
            o(
              'Dark colours, with a few small bright lights standing out',
              [
                N(
                  'Yes. Dark colours feel quiet and mysterious, and a few points of light, like the glowing fence, draw the eye and add suspense.',
                  'happy',
                ),
              ],
              true,
            ),
            o('Bright yellow everywhere', [
              N(
                'Bright yellow feels cheerful and sunny. A spooky mood needs dark, muted colours with a few small lights.',
              ),
            ]),
            o('Only pale pastels', [
              N(
                'Pastels feel soft and gentle. For a spooky night, darker colours with sharp bright points work better.',
              ),
            ]),
          ],
          'Learned that artists use dark and light colours to set a mood, such as a spooky night.',
        ),
      ],
    ),
  ],
  [gloss('nocturnal', 'Active at night and resting during the day.', 'a18-07-night')],
);

// ================================================================== A18-8 The Hut
const A08 = quest(
  'a18-08',
  'The Hut',
  {
    'a18-08-s1': {
      goal: 'Look at the fence round the hut, and don’t run.',
      hint: 'Walk up to the fence slowly. Your Nubbin can stay in your coat.',
    },
    'a18-08-s2': {
      goal: 'Stand your ground while Baba Yaga comes home.',
      hint: 'Stay beside Vasilisa by the gate, and keep still.',
    },
    'a18-08-s3': {
      goal: 'Answer Baba Yaga when she asks who you are.',
      hint: 'Speak up. She will know if you’re fibbing.',
    },
  },
  [
    sc(
      'a18-08-fence',
      [
        N(
          'The fence is made of old bones, grey and smooth, the way driftwood is. On every stake there is a skull.',
        ),
        N(
          'In every skull the eyes are lit, as if somebody had left a lamp burning inside. They turn, all of them, slowly, to look at you.',
        ),
        V('Don’t look back at them. That’s what they say. Look at the gate.', 'sad'),
        N(
          'Your Nubbin looks back anyway, from your collar. One of the skulls, you could swear, looks a little surprised.',
        ),
        N(
          'Behind the fence the hut is old and black and leaning. There is smoke from its chimney, but no light in its windows.',
        ),
      ],
      [
        ask(
          0,
          'science',
          'weathering wears things smooth',
          '4-ESS2-1',
          [
            N(
              'Old bone and driftwood end up grey and smooth. What slowly wears things away like this over many years?',
            ),
          ],
          [
            o(
              'Weathering: wind, rain, sun and frost',
              [
                N(
                  'Yes. Weathering breaks down and smooths rock, wood and bone slowly. The same forces wear mountains down and make pebbles round.',
                  'happy',
                ),
              ],
              true,
            ),
            o('Polishing by someone each night', [
              N(
                'Nobody needs to. Wind, water, sunshine and frost do the work, a little at a time.',
              ),
            ]),
            o('Heat from the hut’s chimney', [
              N(
                'The chimney is too far away. Weather outside does the wearing: rain, wind, sun and frost.',
              ),
            ]),
          ],
          'Learned that weathering by wind, water, sun and frost slowly wears and smooths objects.',
        ),
      ],
      [
        ch('gate', 'Look at the gate, as she says.', [
          N('You look at the gate. It is only a gate, nearly, and that helps.'),
        ]),
        ch('face', 'Turn your Nubbin’s face into your coat.', [
          N('It goes, with a small sigh. The skulls go on looking at the place where it was.'),
        ]),
      ],
    ),
    sc(
      'a18-08-fence-done',
      [
        N(
          'Then the trees round the clearing begin to creak, and the dry leaves on the ground all lift and turn over at once.',
        ),
        N('Creak. Rustle. Rattle. The clearing is full of words that sound like what they mean.'),
      ],
      [
        ask(
          1,
          'literacy',
          'onomatopoeia',
          'RL.1.4',
          [
            N(
              'Creak, rustle and rattle sound like the noises they name. What is a word like that called?',
            ),
          ],
          [
            o(
              'Onomatopoeia',
              [
                N(
                  'Yes. Onomatopoeia means a word that imitates a sound. Writers use it to let readers hear the scene: buzz, splash, thump.',
                  'happy',
                ),
              ],
              true,
            ),
            o('An adjective', [
              N('An adjective describes a noun. A word that copies a sound is onomatopoeia.'),
            ]),
            o('A proverb', [
              N(
                'A proverb is a short saying that gives advice. A word that copies a sound is onomatopoeia.',
              ),
            ]),
          ],
          'Identified onomatopoeia and how sound words help readers hear a scene.',
        ),
      ],
    ),
    sc(
      'a18-08-mortar',
      [
        N(
          'Out of the trees comes Baba Yaga, riding in a great stone mortar and rowing through the air with the pestle.',
        ),
        N(
          'Behind her she sweeps away her own track with a broom, so that nobody can follow where she has been.',
        ),
        N(
          'She lands by the gate with a thump that shakes the fence. Every skull rattles, very politely.',
        ),
        BY(
          'Hm. Hm! I smell something. Somebody. Two somebodies, and something small and furry.',
          'think',
        ),
        BY('Who’s there? Out with it. I don’t like waiting and I don’t like guessing.', 'angry'),
        N(
          'She has a nose like a pruning hook and eyes like two wet stones. She is very old, very tall, and not at all slow.',
        ),
        V('It’s me, Granny. My stepmother’s daughters sent me. For fire. We haven’t any.'),
        BY('I know your stepmother. I know her sort.', 'think'),
        BY(
          'Fire, is it? Stay and work for me, and if you work well, you’ll have fire. If not, we’ll see what I do. Nobody wants to see twice.',
          'angry',
        ),
      ],
      [
        ask(
          0,
          'science',
          'a push in one direction gives a push back: how oars work',
          '3-PS2-1',
          [
            N(
              'Baba Yaga “rows” her mortar with a pestle. A real oar pushes the water backwards. What makes a real boat go forwards?',
            ),
          ],
          [
            o(
              'The water pushes back on the oar, so the boat is pushed forwards',
              [
                N(
                  'Yes. A push always meets a push the other way. The oar shoves water backwards, the water shoves the oar forwards, and the boat goes with it. (Baba Yaga does it through air, by magic.)',
                  'happy',
                ),
              ],
              true,
            ),
            o('The oar pulls the boat along by its handle', [
              N(
                'The handle is just where you hold it. It is the blade pushing on the water that moves the boat.',
              ),
            ]),
            o('The boat floats and drifts forward by itself', [
              N(
                'Floating keeps a boat up, but only a push makes it move. That push comes from the water pushing back on the oar.',
              ),
            ]),
          ],
          'Learned that rowing works because pushing water backwards pushes the boat forwards.',
        ),
      ],
    ),
    sc(
      'a18-08-mortar-done',
      [
        N(
          'Vasilisa curtsies, right down to the ground. Her hand doesn’t go to her pocket once, not where Baba Yaga can see.',
        ),
        N('She is shaking, and she is being perfectly polite.'),
      ],
      [
        think(
          1,
          'sel',
          'politeness as strength or as hiding fear',
          'CASEL: Social awareness',
          [
            N(
              'Vasilisa is very polite to someone frightening. Is politeness a kind of strength? Or is it only a way of hiding fear?',
            ),
          ],
          [
            o('It is a kind of strength: she stays calm and respectful', [
              N(
                'That’s a fair answer. Staying polite when you are scared takes self-control, and it often keeps a tense moment from getting worse.',
                'soft',
              ),
            ]),
            o('It is mostly hiding fear', [
              N(
                'That’s a fair answer. She is shaking, and politeness covers it. Notice that hiding the fear isn’t the same as being ruled by it.',
                'soft',
              ),
            ]),
            o('It can be both at once', [
              N(
                'That’s a fair answer. Courage and politeness often come together: you feel the fear, and you choose how to act.',
                'soft',
              ),
            ]),
          ],
          'Thought about whether being polite to someone frightening shows strength, fear or both.',
        ),
      ],
    ),
    sc(
      'a18-08-who',
      [
        N('Baba Yaga turns, and bends, and puts her nose almost on yours.'),
        BY(
          'And you. You’re not from round here. You smell of somewhere else entirely. Ponds. Fruit. Old paper.',
          'think',
        ),
        BY('Who are you, and what do you want here?'),
        N(
          'Vasilisa’s fingers find your sleeve and hold on. On the fence, the skulls lean in to listen.',
        ),
        N('Your Nubbin, deep in your coat, holds its breath again.'),
      ],
      [
        ask(
          1,
          'literacy',
          'specific sensory details describe a character in depth',
          'RL.4.3',
          [
            N(
              'Baba Yaga says you smell of ponds, fruit and old paper. Why is that a better description than “you smell odd”?',
            ),
          ],
          [
            o(
              'Specific details let us imagine it with our senses and tell us about the person',
              [
                N(
                  'Yes. Ponds, fruit and old paper paint a picture of the Grove. Specific sensory details show a character instead of just telling about them.',
                  'happy',
                ),
              ],
              true,
            ),
            o('Longer sentences are always better', [
              N(
                'Length isn’t the point. Specific details, especially ones using the senses, make a description vivid.',
              ),
            ]),
            o('It rhymes more', [
              N('It doesn’t rhyme. Its strength is specific details that we can almost smell.'),
            ]),
          ],
          'Learned that specific sensory details show a character or place more vividly than a vague word.',
        ),
      ],
      [
        ch('friend', 'I’m her friend. I lodge at her father’s.', [
          BY('A friend. Hm. Friends are rarer than lodgers. Fine.'),
        ]),
        ch('keeper', 'A Keeper. I look after small things.', [
          BY('Do you. Well, so do I, in my way. You wouldn’t like my way.', 'happy'),
        ]),
        ch('peek', 'Let your Nubbin answer, by putting its head out.', [
          N('Your Nubbin puts its head out of your coat and looks at her.'),
          BY(
            'Oh, you. Never seen one of you before. I’ve seen everything, so that’s something.',
            'think',
          ),
        ]),
      ],
    ),
    sc(
      'a18-08-who-done',
      [
        BY(
          'Same terms for you as for her, since you’re here. Work, and you go home. Shirk, and you don’t.',
          'angry',
        ),
        N('She lifts one hand. The gate opens by itself.'),
        N(
          'The bolts on the hut door shoot back in a pattern: two clacks, then four, then six, then eight…',
        ),
      ],
      [
        ask(
          2,
          'maths',
          'number patterns that follow a rule',
          '4.OA.C.5',
          [
            N(
              'Two clacks, then four, then six, then eight. What comes next, and what is the rule?',
            ),
          ],
          [
            o(
              'Ten: add 2 each time',
              [
                N(
                  'Yes. The rule is “add 2”: 2, 4, 6, 8, 10. A pattern is only a pattern if you can state the rule.',
                  'happy',
                ),
              ],
              true,
            ),
            o('Nine: add 1 each time', [
              N(
                'The jumps are 2 each time, not 1: 4 − 2 = 2, 6 − 4 = 2, 8 − 6 = 2. So the next number is 10.',
              ),
            ]),
            o('Sixteen: double each time', [
              N(
                'Doubling would go 2, 4, 8, 16. Here it goes 2, 4, 6, 8, so we add 2 and the next is 10.',
              ),
            ]),
          ],
          'Found the rule (add 2) in the pattern 2, 4, 6, 8 and extended it to 10.',
        ),
      ],
    ),
    sc(
      'a18-08-complete',
      [
        BY('In. In! Don’t stand there letting the night in. It’s mine. I know where it’s been.'),
        N(
          'Inside, the hut is hot and smoky and very full: pots, bunches of herbs, and a great white stove that takes up half the room.',
        ),
        N('Baba Yaga stretches out on a bench, puts her feet up, and looks at Vasilisa.'),
        BY('Well? I’m home and I’m hungry. What’s in the oven, girl? Bring it all.', 'happy'),
      ],
      [
        ask(
          1,
          'social-studies',
          'how a great stove was used in old homes',
          'D2.His.2.K-2',
          [
            N(
              'In old homes in cold, forested lands, a great stove often took up half the room. What jobs did it do?',
            ),
          ],
          [
            o(
              'It heated the home, cooked and baked, and gave a warm place to sleep',
              [
                N(
                  'Yes. One big masonry stove did the work of a heater, an oven and, on cold nights, a bed. It tells us how families used every bit of warmth.',
                  'happy',
                ),
              ],
              true,
            ),
            o('It was only for show', [
              N(
                'In a land with hard winters nothing was only for show. The stove kept people alive.',
              ),
            ]),
            o('It only dried the washing', [
              N('It did that too, but its main jobs were heating the room, cooking and baking.'),
            ]),
          ],
          'Learned how one great stove heated, cooked and baked in homes in cold lands long ago.',
        ),
      ],
    ),
  ],
  [
    gloss(
      'weathering',
      'The slow breaking down and smoothing of rock, wood and bone by wind, water, sun and frost.',
      'a18-08-fence',
    ),
    gloss(
      'onomatopoeia',
      'A word that sounds like the noise it names, such as creak or splash.',
      'a18-08-fence-done',
    ),
  ],
);

// ================================================================== A18-9 Supper for Ten
const A09 = quest(
  'a18-09',
  'Supper for Ten',
  {
    'a18-09-s1': {
      goal: 'Help Vasilisa carry Baba Yaga’s supper to the table.',
      hint: 'Bring dish after dish out of the great white stove.',
    },
    'a18-09-s2': {
      goal: 'Decide who has your crust.',
      hint: 'There is one crust, and a long day tomorrow. Choose.',
    },
  },
  [
    sc(
      'a18-09-supper',
      [
        N(
          'Out of the stove come pots, and pots, and pots. Vasilisa carries, and you carry, and your Nubbin carries a spoon.',
        ),
        N(
          'Soup enough for ten. A side of pork, pies, porridge, a whole goose, a jug of kvass, a jug of milk, and another jug of milk.',
        ),
        BY(
          'More! Is that the lot? Look in the back. There’s always something at the back.',
          'happy',
        ),
        N(
          'She eats the way the wind takes a field: all of it, from one side to the other, and nothing left standing.',
        ),
        N('Your Nubbin watches the goose go, with an expression of real grief.'),
        BY('Ah. Better. That’s what an old woman needs. A little something.', 'happy'),
        N(
          'On the table she leaves a bowl with a little soup at the bottom, a crust, and a scrap of pork the size of your thumb.',
        ),
        BY(
          'That’s yours, girl. Supper. And a crust for you, friend from elsewhere, since you carried. Don’t say I’m not fair.',
        ),
      ],
      [
        ask(
          6,
          'maths',
          'unit fractions: 1 out of 10 equal parts',
          '3.NF.A.1',
          [
            N(
              'Imagine the pork was cut into 10 equal pieces. Baba Yaga ate 9 and left Vasilisa 1. What fraction of the pork did Vasilisa get?',
            ),
          ],
          [
            o(
              '1/10',
              [
                N(
                  'Yes. One part out of ten equal parts is one tenth, written 1/10. Baba Yaga ate the other 9/10.',
                  'happy',
                ),
              ],
              true,
            ),
            o('1/9', [
              N(
                'The whole is cut into 10 parts, not 9. The bottom number counts all the equal pieces, so it is 1/10.',
              ),
            ]),
            o('9/10', [
              N('That is what Baba Yaga ate. Vasilisa got 1 piece out of 10, which is 1/10.'),
            ]),
          ],
          'Used a unit fraction: 1 piece out of 10 equal pieces is 1/10 (and the rest is 9/10).',
        ),
      ],
    ),
    sc(
      'a18-09-supper-done',
      [
        N(
          'Baba Yaga climbs up on to the stove, pulls a quilt over herself, and starts to snore like a saw going through a log.',
        ),
        N('The whole hut hums with it. The cups on the shelf buzz against one another.'),
      ],
      [
        ask(
          1,
          'science',
          'sound is made by vibrations',
          '4-PS3-2',
          [N('Her snore makes the cups buzz on the shelf. What is going on?')],
          [
            o(
              'Soft parts of her throat vibrate and make sound waves, and the waves make the cups vibrate too',
              [
                N(
                  'Yes. All sounds are vibrations. Her throat shakes the air, the shaking air reaches the cups, and the cups shake back.',
                  'happy',
                ),
              ],
              true,
            ),
            o('The cups are alive and join in', [
              N(
                'Even in this story, the cups are only cups. They buzz because the vibrating air shakes them.',
              ),
            ]),
            o('Snores are made of heat', [
              N(
                'Sound is made of shaking, not heat. A snore is soft tissue in the throat vibrating as air passes.',
              ),
            ]),
          ],
          'Learned that sound is made of vibrations that can travel through air and shake other objects.',
        ),
      ],
    ),
    sc(
      'a18-09-crust',
      [
        N(
          'Vasilisa takes her soup and her crust and her scrap of pork into the corner behind the stove, where Baba Yaga can’t see.',
        ),
        N(
          'You hear the napkin, and her whisper. Two small lights come on in the corner, and her supper is gone.',
        ),
        V('She needed it more. She has to do tomorrow. I only have to stand there.', 'soft'),
        N('Vasilisa is very pale. She hasn’t eaten since yesterday.'),
        N(
          'Your crust sits on the table in front of you: hard, grey, and the only food left in the hut.',
        ),
        N(
          'Your Nubbin climbs out of your coat on to the table. It looks at the crust, and then at you, and doesn’t touch it.',
        ),
        N('Tomorrow is going to be very long. You know it the way you know it is going to rain.'),
      ],
      [
        think(
          6,
          'sel',
          'weighing care for others against care for yourself',
          'CASEL: Responsible decision-making',
          [
            N(
              'There is one crust. You could give it to your Nubbin, to the doll for Vasilisa, or eat it yourself. Is there one right answer? How do you weigh looking after others against looking after yourself?',
            ),
          ],
          [
            o('Others first: those who depend on you need it most', [
              N(
                'That’s a fair answer. Hazel’s rule leans this way. Notice the cost: you will be hungry tomorrow, and that is a real cost to count.',
                'soft',
              ),
            ]),
            o('Yourself first: you cannot help anyone if you faint', [
              N(
                'That’s a fair answer. A hungry helper helps less. The question is whether your hunger or someone else’s is greater.',
                'soft',
              ),
            ]),
            o('Whoever has the greatest need, and the crust can’t be split', [
              N(
                'That’s a fair answer. Deciding by need is fair, but needs are hard to see. Asking people, where you can, helps.',
                'soft',
              ),
            ]),
          ],
          'Thought about how to choose between helping others and looking after yourself when there is not enough to share.',
        ),
      ],
      [
        ch(
          'nubbin',
          'Give it to your Nubbin.',
          [
            N(
              'You break it small and hold it out. Your Nubbin eats every crumb, slowly, looking at you the whole time.',
            ),
            N(
              'Feed them before you feed yourself. You’re hungry and it isn’t, and that seems a fair trade.',
              'soft',
            ),
          ],
          { 'a18-crust': 'nubbin' },
        ),
        ch(
          'doll',
          'Give it to the doll, for Vasilisa.',
          [
            V('For her? But it’s yours.', 'shock'),
            Y('She’s working for both of you tomorrow. She ought to eat for two.'),
            N(
              'Vasilisa sets your crust in front of the doll. The little lights come on again, brighter than before.',
            ),
          ],
          { 'a18-crust': 'doll' },
        ),
        ch(
          'self',
          'Eat it yourself. Tomorrow is long.',
          [
            N('You eat it. It is very dry, and takes a long time, and then it is gone.'),
            N(
              'Your Nubbin watches the last bit go. Then it curls up on your feet anyway, which is generous of it.',
            ),
          ],
          { 'a18-crust': 'self' },
        ),
      ],
    ),
    sc(
      'a18-09-crust-done',
      [
        N(
          'The fire in the stove sinks to red. Vasilisa curls up on the bench with one hand in her pocket.',
        ),
        N(
          'There wasn’t enough food for everyone, so somebody had to choose. People call that scarcity.',
        ),
      ],
      [
        ask(
          1,
          'social-studies',
          'scarcity means choosing',
          'D2.Eco.1.K-2',
          [
            N(
              'When there isn’t enough of something for everyone, people have to choose who gets it. What is that shortage called?',
            ),
          ],
          [
            o(
              'Scarcity',
              [
                N(
                  'Yes. Scarcity is when wants and needs are bigger than what is available, so choices have to be made. Families, shops and countries all face it.',
                  'happy',
                ),
              ],
              true,
            ),
            o('Surplus', [
              N(
                'A surplus is more than is needed. Here there is less than is needed: that is scarcity.',
              ),
            ]),
            o('Inflation', [
              N('Inflation is when prices rise. Not enough of something to go round is scarcity.'),
            ]),
          ],
          'Learned the word scarcity: not enough for everyone, so people must choose.',
        ),
      ],
    ),
    sc(
      'a18-09-complete',
      [
        N(
          'Baba Yaga stops snoring all at once, and speaks from the top of the stove without opening her eyes.',
        ),
        BY(
          'Tomorrow I go out. While I’m gone, sweep the yard, clean the hut, cook my dinner and wash my linen.',
        ),
        BY(
          'Then go to the barn, take a quarter of oats, and sift them clean. Every husk. Every bit of chaff.',
        ),
        BY('And if it isn’t all done when I come back… well. We’ll see. Goodnight.', 'happy'),
        N('She starts snoring again, exactly where she left off.'),
      ],
      [
        ask(
          2,
          'literacy',
          'the meaning of chaff and husk from context',
          'L.3.4',
          [
            N(
              'Baba Yaga wants every husk and every bit of chaff sifted out of the oats. What are chaff and husks?',
            ),
          ],
          [
            o(
              'The dry, papery outer bits that surround the grain and get blown or sifted away',
              [
                N(
                  'Yes. Grain grows inside a dry covering. Threshing and sifting separate the useful seed from the husks and chaff.',
                  'happy',
                ),
              ],
              true,
            ),
            o('The best part of the oats', [
              N(
                'The best part is the grain, the seed. Husks and chaff are the dry coverings you remove.',
              ),
            ]),
            o('Little stones in the oats', [
              N('Stones would be grit. Chaff and husks are the dry coverings of the grain itself.'),
            ]),
          ],
          'Worked out what husks and chaff are (dry coverings removed from grain) from the context.',
        ),
      ],
    ),
  ],
  [
    gloss(
      'scarcity',
      'When there is not enough of something for everyone, so people have to choose.',
      'a18-09-crust-done',
    ),
    gloss('chaff', 'The dry, papery bits that cover grain and are sifted away.', 'a18-09-complete'),
  ],
);

// ================================================================== A18-10 The First Day
const A10 = quest(
  'a18-10',
  'The First Day',
  {
    'a18-10-s1': {
      goal: 'Keep close while Vasilisa asks the doll what to do.',
      hint: 'Stay by the warm stove and listen.',
    },
    'a18-10-s2': {
      goal: 'Help with the yard, the hut and the oats while Vasilisa sleeps.',
      hint: 'Sweep, scrub and sift. The doll is working too.',
    },
    'a18-10-s3': {
      goal: 'Stand by while Baba Yaga looks over the work.',
      hint: 'Wait in the yard as the night comes down.',
    },
  },
  [
    sc(
      'a18-10-night',
      [
        N(
          'When the snoring is steady, Vasilisa takes the doll out of her pocket, very slowly, and sits it on her knee.',
        ),
        V('There’s so much. I can’t do it all. Nobody could. What do I do?', 'sad'),
        N(
          'There is nothing left to give it; it has eaten already tonight. The two little lights come on all the same.',
        ),
        DOLL(
          'Don’t worry. Lie down and rest. A sleeping body grows stronger, and things look clearer by morning.',
          'soft',
        ),
        V('That’s what Mother used to say. Not the same words. The same thing.', 'soft'),
        N('She lies down on the bench, and is asleep before she has finished lying down.'),
      ],
      [
        ask(
          4,
          'health',
          'what sleep does for a growing body, and a healthy bedtime habit',
          'CASEL: Self-management',
          [
            N(
              'Most children your age need about nine to twelve hours of sleep. What does a good night’s sleep do?',
            ),
          ],
          [
            o(
              'Lets the body repair and grow, and helps the brain store what you learned',
              [
                N(
                  'Yes. While we sleep, bodies repair themselves and children grow, and the brain sorts the day’s learning into memory. A regular bedtime is a habit you can manage for yourself.',
                  'happy',
                ),
              ],
              true,
            ),
            o('Nothing: it is only time when we are switched off', [
              N(
                'Sleep is busy time for the body and brain. Missing it makes us slower, crosser and forgetful.',
              ),
            ]),
            o('It stops us getting hungry', [
              N('Sleep doesn’t replace food. Its work is repair, growth and memory.'),
            ]),
          ],
          'Learned that sleep lets the body repair and grow and helps the brain store memories, and that a regular bedtime is a habit we can manage.',
        ),
      ],
      [
        ch('watch', 'Stay awake and keep watch.', [
          N(
            'You keep watch, and so does the doll, sitting up on the end of the bench. Every so often you look at it, and it looks at you.',
          ),
        ]),
        ch('sleep', 'Do as the doll says, and sleep.', [
          N(
            'You lie down by the stove. The last thing you see is the doll, still sitting up, keeping watch for all of you.',
          ),
        ]),
      ],
    ),
    sc(
      'a18-10-night-done',
      [
        N(
          'At first light the white rider goes past the window. Baba Yaga whistles, her mortar comes, and she is gone.',
        ),
        N(
          'Through the open door you can see the fence’s shadows lying long and thin across the yard.',
        ),
      ],
      [
        ask(
          1,
          'science',
          'shadows are longest when the Sun is low',
          '5-ESS1-2',
          [
            N(
              'At first light the shadows stretch across the whole yard. Why are shadows longest early and late in the day?',
            ),
          ],
          [
            o(
              'The Sun is low in the sky, so its light comes in at a shallow angle',
              [
                N(
                  'Yes. When the Sun is low it casts long shadows, and at noon, when it is high, shadows are short. That’s how sundials tell the time.',
                  'happy',
                ),
              ],
              true,
            ),
            o('The Sun is bigger in the morning', [
              N(
                'The Sun’s size doesn’t change. What changes is its height in the sky, and so the angle of the light.',
              ),
            ]),
            o('Shadows grow while we sleep', [
              N('Shadows only exist when light is blocked. They are long when the Sun is low.'),
            ]),
          ],
          'Learned that shadows are longest when the Sun is low in the sky and shortest at midday.',
        ),
      ],
    ),
    sc(
      'a18-10-chores',
      [
        N(
          'Vasilisa sleeps on, as she was told to. The doll climbs down off the bench and goes to work.',
        ),
        N(
          'The broom sweeps the yard with nobody holding it. The pots scrub themselves, and the linen goes into the tub grey and comes out white.',
        ),
        N(
          'Your Nubbin slept well, on a full stomach. It wakes up bright, and goes straight to the barn with you.',
        ),
        N(
          'A quarter of oats is a great many oats. You sift, and your Nubbin picks out the black grains one at a time and spits them in a pile.',
        ),
        N('You sift about nine scoops an hour, from seven o’clock until noon.'),
        N(
          'The doll comes in, looks at the pile, and nods once, the way a foreman does. Then it goes to see about the dinner.',
        ),
        N(
          'By noon the oats are clean. Your Nubbin is asleep on the sack, and you are covered in chaff to the eyebrows.',
        ),
      ],
      [
        ask(
          4,
          'maths',
          'multiplication: 5 hours × 9 scoops',
          '3.OA.A.3',
          [
            N(
              'You sift 9 scoops an hour from seven o’clock until noon, which is 5 hours. How many scoops do you sift?',
            ),
          ],
          [
            o(
              '45',
              [
                N(
                  'Yes. 5 × 9 = 45 scoops. You can check by counting in nines: 9, 18, 27, 36, 45.',
                  'happy',
                ),
              ],
              true,
            ),
            o('14', [
              N(
                'That’s 5 + 9. Nine scoops are sifted in each of the 5 hours, so multiply: 5 × 9 = 45.',
              ),
            ]),
            o('54', [N('That’s 6 × 9. Seven o’clock to noon is 5 hours, not 6, so 5 × 9 = 45.')]),
          ],
          'Multiplied 5 hours × 9 scoops to find 45 scoops, checking by counting in nines.',
        ),
      ],
    ),
    sc(
      'a18-10-chores-done',
      [
        N(
          'At dusk Vasilisa wakes, and the doll climbs back into her pocket, just as the black rider crosses the clearing.',
        ),
        N('She looks at the clean yard and the sifted oats. She asked for help, and help came.'),
      ],
      [
        ask(
          1,
          'sel',
          'asking for help early',
          'CASEL: Relationship skills',
          [
            N(
              'Vasilisa couldn’t do it all alone, so she asked the doll. Why is asking for help early often wiser than struggling on alone?',
            ),
          ],
          [
            o(
              'Problems get smaller when they are shared, and it is easier to help before things go wrong',
              [
                N(
                  'Yes. Asking early is a skill, not a weakness. Someone who helps at the start can prevent a big mess later.',
                  'happy',
                ),
              ],
              true,
            ),
            o('Because other people enjoy doing your work', [
              N(
                'Some do, but that isn’t the reason. Shared problems shrink, and early help is easier to give than rescue.',
              ),
            ]),
            o('It isn’t wiser: you should always manage alone', [
              N(
                'Managing alone is sometimes right, but there are jobs nobody can do alone. Knowing when to ask is part of being strong.',
              ),
            ]),
          ],
          'Learned that asking for help early is a strength, because shared problems shrink.',
        ),
      ],
    ),
    sc(
      'a18-10-hands',
      [
        N(
          'The fence’s eyes light up and the trees creak. Baba Yaga comes down in the yard with her mortar and her broom.',
        ),
        BY('Well? Well?', 'angry'),
        N(
          'She looks at the yard, and at the hut. She tastes the dinner, runs a finger along the top of the stove, and looks at the finger.',
        ),
        N('She goes to the barn, puts her nose in the oats, and sniffs for a long time.'),
        BY(
          'Hm. Nothing to find fault with. I hate it when there’s nothing to find fault with.',
          'think',
        ),
        BY('Servants of mine! Old friends! Here are oats. Take them away and grind them.', 'happy'),
        N(
          'Out of nowhere, three pairs of hands appear. Just hands, in the air, with nobody attached.',
        ),
        N('They lift the sack of oats and carry it off into the dark, and are gone.'),
      ],
      [
        ask(
          4,
          'literacy',
          'character traits from what a character says and does',
          'RL.3.3',
          [
            N(
              'Baba Yaga hates it when she can’t find fault. What does that tell us about her character?',
            ),
          ],
          [
            o(
              'She is hard to please but fair: she looks properly and doesn’t invent faults',
              [
                N(
                  'Yes. She inspects every corner and, finding nothing wrong, grumbles but accepts it. A character’s actions show their traits.',
                  'happy',
                ),
              ],
              true,
            ),
            o('She is lazy and doesn’t check the work', [
              N(
                'She checks thoroughly: she tastes, runs a finger over the stove, and sniffs the oats. That’s the opposite of lazy.',
              ),
            ]),
            o('She is generous and always happy', [
              N(
                'Her grumbling shows she isn’t happy-go-lucky. She is strict, but fair about what she finds.',
              ),
            ]),
          ],
          'Inferred character traits (strict, thorough, fair) from a character’s actions and words.',
        ),
      ],
      [
        ch('look', 'Watch the hands go.', [
          N(
            'You watch them all the way to the edge of the dark. One of them, you are nearly sure, waves.',
          ),
        ]),
        ch('ground', 'Look at the ground until they’ve gone.', [
          N('You look at the ground, which seems wiser. Vasilisa is looking at the ground too.'),
        ]),
        ch('holdback', 'Hold your Nubbin back from following them.', [
          N(
            'Your Nubbin wants very much to see where the hands go. You hold on to it with both arms.',
          ),
        ]),
      ],
    ),
    sc(
      'a18-10-hands-done',
      [
        BY('Same again tomorrow. Different job. Go to sleep.'),
        N('You think about the hands. Three pairs, which makes six hands, all working at once.'),
      ],
      [
        ask(
          1,
          'maths',
          'multiplication as equal groups: 3 × 2',
          '3.OA.A.1',
          [N('Three pairs of hands. How many hands is that, and which multiplication shows it?')],
          [
            o(
              '6 hands: 3 × 2 = 6',
              [
                N(
                  'Yes. Three equal groups of two make 3 × 2 = 6. Each pair is a group of 2.',
                  'happy',
                ),
              ],
              true,
            ),
            o('5 hands: 3 + 2 = 5', [
              N(
                'That adds the numbers instead of the groups. Three groups with 2 in each is 3 × 2 = 6.',
              ),
            ]),
            o('9 hands: 3 × 3 = 9', [
              N('Each pair has two hands, not three. Three groups of 2 is 3 × 2 = 6.'),
            ]),
          ],
          'Used multiplication as equal groups: 3 pairs × 2 hands = 6 hands.',
        ),
      ],
    ),
    sc(
      'a18-10-complete',
      [
        N(
          'Baba Yaga eats her dinner, all of it, leaves a little at the bottom of the pot, and goes to sleep on the stove.',
        ),
        N(
          'Vasilisa looks at the empty air where the hands were, opens her mouth, and closes it again.',
        ),
        V('I’m not going to ask. I don’t want to know where they go.', 'think'),
        N('She takes out the doll and feeds it what she has, and the little lights come on.'),
      ],
      [
        think(
          2,
          'sel',
          'noticing and thanking people whose work we do not see',
          'CASEL: Social awareness',
          [
            N(
              'The hands do the work and vanish, and nobody thanks them. Who are the unseen hands in your life, the people whose work you hardly notice? How might you thank them?',
            ),
          ],
          [
            o('The people who cook and clean and fix things at home or school', [
              N(
                'That’s a fair answer. Some of the most important work is the least noticed. A simple thank you, said out loud, is a good start.',
                'soft',
              ),
            ]),
            o('The people who grow, make and carry the things we use', [
              N(
                'That’s a fair answer. Behind every meal and every shirt are many hands we never meet. Learning where things come from is one way of noticing them.',
                'soft',
              ),
            ]),
            o('I don’t usually notice them, and I’d like to', [
              N(
                'That’s a fair and honest answer. Noticing is the first step, and it is a good one to practise.',
                'soft',
              ),
            ]),
          ],
          'Thought about the people whose work goes unseen and how to notice and thank them.',
        ),
      ],
    ),
  ],
  [],
);

// ================================================================== A18-11 The Second Day
const A11 = quest(
  'a18-11',
  'The Second Day',
  {
    'a18-11-s1': {
      goal: 'Hear what the second day’s work is.',
      hint: 'Listen to Baba Yaga before she goes out.',
    },
    'a18-11-s2': {
      goal: 'Help get the earth out of the poppy seed.',
      hint: 'Work at the barn table. Your Nubbin can help.',
    },
    'a18-11-s3': {
      goal: 'Watch Baba Yaga find no fault, a second time.',
      hint: 'Wait in the yard as night falls.',
    },
  },
  [
    sc(
      'a18-11-list',
      [
        BY('Up! Up. Today the same: yard, hut, dinner, linen. And one thing more.', 'happy'),
        N(
          'She drags a sack across the floor and opens it. It is full of poppy seed from her field, tiny and blue-black.',
        ),
        N(
          'Mixed all through the seed there is earth: dry, crumbly, the same colour, and every bit as fine.',
        ),
        BY(
          'Somebody did that to me once, out of spite. Somebody always does, sooner or later.',
          'angry',
        ),
        BY('Get every bit of earth out of it. Every speck. I’ll know.'),
        N(
          'She whistles, her mortar comes to the door, and she goes off over the treetops with the broom sweeping behind her.',
        ),
        V('Every speck. You can’t even see which ones are the specks.', 'sad'),
      ],
      [
        ask(
          4,
          'science',
          'separating a mixture by a property such as size',
          '2-PS1-1',
          [
            N(
              'Some of the earth is in lumps bigger than a poppy seed. Which tool separates things by size?',
            ),
          ],
          [
            o(
              'A sieve',
              [
                N(
                  'Yes. A sieve has holes of one size: smaller things fall through and larger ones stay. Mixtures can be separated by size, weight, magnetism or dissolving.',
                  'happy',
                ),
              ],
              true,
            ),
            o('A magnet', [
              N(
                'A magnet only picks up certain metals, not earth or seeds. For separating by size, use a sieve.',
              ),
            ]),
            o('A thermometer', [N('A thermometer measures temperature. A sieve sorts by size.')]),
          ],
          'Learned that mixtures can be separated using a property such as size, with a sieve as an example.',
        ),
      ],
      [
        ch('try', 'Say you’ll try, at least.', [
          V('Thank you. I knew you’d say that. I’ll ask her first, though.'),
        ]),
        ch('remind', 'Remind her what the doll told her last night.', [
          V('Rest first, and ask, and see. Yes. I know.', 'soft'),
        ]),
      ],
    ),
    sc(
      'a18-11-list-done',
      [
        N(
          'Vasilisa takes out the doll, feeds it the last of her bread, and listens to it with her head on one side.',
        ),
        N(
          'She doesn’t panic, and she doesn’t pretend she can manage. She asks, and then she listens.',
        ),
      ],
      [
        ask(
          1,
          'sel',
          'asking for advice before acting, and listening',
          'CASEL: Responsible decision-making',
          [
            N(
              'Vasilisa asks for advice before she acts, and she really listens. Why is that a good habit when a job looks impossible?',
            ),
          ],
          [
            o(
              'You learn what you don’t know yet, and avoid mistakes',
              [
                N(
                  'Yes. Advice you actually listen to can save hours of wasted effort. Asking is the first half; listening is the second.',
                  'happy',
                ),
              ],
              true,
            ),
            o('It means someone else decides everything', [
              N(
                'Not if you still choose. Advice is information, and you decide what to do with it.',
              ),
            ]),
            o('It shows you are not clever', [
              N(
                'Clever people ask often. Nobody knows everything, and asking is how clever people get cleverer.',
              ),
            ]),
          ],
          'Learned that asking for advice and truly listening helps us avoid mistakes before a hard job.',
        ),
      ],
    ),
    sc(
      'a18-11-poppy',
      [
        N(
          'The doll climbs down off the table and walks into the poppy seed like somebody wading into a pond.',
        ),
        N(
          'Where it goes, the seed runs one way and the earth runs the other, as if they had fallen out with each other.',
        ),
        N(
          'You work the edges with a feather and a saucer. Your Nubbin blows the dust off the top, gently, and then too hard.',
        ),
        N(
          'You begin when the clock says half past eight. By half past twelve the seed is in one sack and the earth in a heap by the door.',
        ),
        N('Vasilisa sleeps through the whole thing with a smile on her face. You don’t blame her.'),
        N(
          'The doll climbs on to the heap of earth and sits there, the way you sit on a hill you have just climbed.',
        ),
      ],
      [
        ask(
          3,
          'maths',
          'time intervals',
          '3.MD.A.1',
          [N('You started at 8:30 and finished at 12:30. How long did the work take?')],
          [
            o(
              '4 hours',
              [
                N(
                  'Yes. From 8:30 to 12:30 is 4 hours: count on 9:30, 10:30, 11:30, 12:30.',
                  'happy',
                ),
              ],
              true,
            ),
            o('4 hours 30 minutes', [
              N(
                'Count the hours again: 8:30 to 9:30 is one hour, then 10:30, 11:30 and 12:30, so exactly 4 hours.',
              ),
            ]),
            o('3 hours', [
              N(
                'That misses one hour. Counting on from 8:30: 9:30, 10:30, 11:30, 12:30 is four steps, so 4 hours.',
              ),
            ]),
          ],
          'Found an interval of time by counting on from 8:30 to 12:30 (4 hours).',
        ),
      ],
    ),
    sc(
      'a18-11-poppy-done',
      [
        N(
          'The black rider crosses the clearing, and the fence’s eyes come on. In the trees, something begins to creak.',
        ),
        N('A poppy seed is tiny and blue-black, nearly the colour of the night sky.'),
      ],
      [
        ask(
          1,
          'art',
          'the multiple-meaning word “shade”: a darker colour, or shadow',
          'L.3.4',
          [
            N(
              'Painters call a colour with black added a darker “shade” of it. The poppy seed is a dark shade of blue. Which other meaning of “shade” have you met in this tale?',
            ),
          ],
          [
            o(
              'The cool, shadowy place out of the sun',
              [
                N(
                  'Yes. The sisters sat in the shade while Vasilisa worked. One word, two meanings: the sentence around it tells you which.',
                  'happy',
                ),
              ],
              true,
            ),
            o('A kind of hat', [
              N(
                'Nobody wears a “shade” here. Remember the sisters sitting out of the sun: that is the other shade.',
              ),
            ]),
            o('A loud noise', [
              N('That isn’t a meaning of “shade”. Think of the cool place under the apple tree.'),
            ]),
          ],
          'Used context to tell apart two meanings of “shade”: a darker colour, and a shadowy place out of the sun.',
        ),
      ],
    ),
    sc(
      'a18-11-oil',
      [
        N(
          'Baba Yaga comes down in her mortar, climbs out, and goes straight to the barn without a word.',
        ),
        N(
          'She puts her nose in the poppy seed and sniffs. She puts her nose in the earth and sniffs, and then does both again.',
        ),
        BY('Not a speck. Not one speck. Twice running. It isn’t natural.', 'angry'),
        BY('Servants of mine! Old friends! Take the poppy and press it. I want oil by morning.'),
        N(
          'The three pairs of hands come out of the dark, take the sack of poppy seed, and are gone with it.',
        ),
        N('Baba Yaga stands looking at the empty floor, and then at you, for a long time.'),
        BY('Hm. You helped, didn’t you. Don’t answer. I can see it on your sleeves.', 'think'),
        BY('I pay for work. I always pay for work. Here.'),
        N(
          'She takes an old mortar and pestle off a shelf, no bigger than a teacup and cracked down one side, and drops them in your hands.',
        ),
        BY('Too small for flying. Too good to burn. Plant something in it.'),
      ],
      [
        think(
          7,
          'social-studies',
          'the difference between a gift and wages',
          'D2.Civ.8.K-2',
          [
            N(
              'Baba Yaga insists that pay is not a present. What is the difference between a gift and wages? Does being paid fairly change how a person feels about their work?',
            ),
          ],
          [
            o('A gift is freely given; wages are owed for work done', [
              N(
                'That’s a fair answer. A gift comes from generosity, while wages are a fair exchange. Both can show respect, in different ways.',
                'soft',
              ),
            ]),
            o('Fair pay makes people prouder, because their work counts', [
              N(
                'That’s a fair answer. Being paid fairly says the work has value. Being thanked sincerely adds to it.',
                'soft',
              ),
            ]),
            o('It depends: sometimes thanks matter more than pay', [
              N(
                'That’s a fair answer. Between friends thanks can be enough, but a stranger doing a hard job is owed a fair return.',
                'soft',
              ),
            ]),
          ],
          'Thought about the difference between a gift and wages and why fair pay matters.',
        ),
      ],
      [
        ch('thank', 'Thank her properly.', [
          BY('Don’t thank me. I said, it’s pay. Pay isn’t a present.', 'angry'),
          N('But for a moment she looks almost pleased.'),
        ]),
        ch('flew', 'Ask whether it ever flew.', [
          BY('Once. A very short way. Into a pond.', 'think'),
          N('She doesn’t explain, and you don’t ask again.'),
        ]),
      ],
    ),
    sc(
      'a18-11-oil-done',
      [
        N(
          'By morning there is a jar of poppy-seed oil on the table, golden, and nobody saw it arrive.',
        ),
        N('The hands pressed the seeds hard, until the oil ran out of them.'),
      ],
      [
        ask(
          1,
          'science',
          'seeds store food (oil) for the young plant, and it can be pressed out',
          '3-LS1-1',
          [N('How do you get oil out of seeds like poppy or sunflower seeds?')],
          [
            o(
              'Press them hard: the seeds contain oil, and pressing squeezes it out',
              [
                N(
                  'Yes. Many seeds store oil as food for the young plant when it sprouts. Pressing breaks them open and squeezes the oil out, which is how cooking oils are made.',
                  'happy',
                ),
              ],
              true,
            ),
            o('Boil them until they turn to oil', [
              N(
                'Boiling won’t change seeds into oil. The oil is already inside the seeds, and pressing squeezes it out.',
              ),
            ]),
            o('Wait for the seeds to melt', [
              N('Seeds don’t melt. The oil is inside, and pressing is what releases it.'),
            ]),
          ],
          'Learned that many seeds store oil as food for the sprouting plant, and that pressing releases it.',
        ),
      ],
    ),
    sc(
      'a18-11-complete',
      [
        N(
          'That night there is soup again, and a crust, and a scrap of something. Baba Yaga eats the rest.',
        ),
        N(
          'The little mortar sits on the windowsill, where the fence’s light catches the crack in it.',
        ),
        V('Tomorrow she’ll let me go. Or she won’t. I can feel it coming, like weather.', 'think'),
        N(
          'Your Nubbin climbs into the cracked mortar, which fits it exactly, and goes to sleep there.',
        ),
      ],
      [
        ask(
          2,
          'literacy',
          'foreshadowing',
          'RL.4.3',
          [
            N(
              'Vasilisa says she can feel something coming “like weather”. An author who hints at what is coming is using foreshadowing. What might this hint tell us?',
            ),
          ],
          [
            o(
              'Something is about to change, for better or worse, tomorrow',
              [
                N(
                  'Yes. Foreshadowing makes readers lean forward: a change is on its way, and Vasilisa senses it before we see it.',
                  'happy',
                ),
              ],
              true,
            ),
            o('Nothing at all will happen', [
              N(
                'If nothing were coming, she wouldn’t mention it. Hints like this prepare the reader for a turn in the story.',
              ),
            ]),
            o('It is going to rain', [
              N(
                'The weather is only a comparison. Her words are about her own life, and what might change.',
              ),
            ]),
          ],
          'Recognised foreshadowing: a hint that a change is coming later in the story.',
        ),
      ],
    ),
  ],
  [
    gloss('tint', 'A colour made lighter by adding white.', 'a18-11-poppy-done'),
    gloss('foreshadowing', 'A hint in a story about what will happen later.', 'a18-11-complete'),
  ],
);

// ================================================================== A18-12 Questions
const A12 = quest(
  'a18-12',
  'Questions',
  {
    'a18-12-s1': {
      goal: 'Stand by Vasilisa while Baba Yaga eats, and listen.',
      hint: 'Keep quiet at the table. Vasilisa will speak.',
    },
    'a18-12-s2': {
      goal: 'Decide whether to ask a question of your own.',
      hint: 'Think about what Baba Yaga just said about questions.',
    },
    'a18-12-s3': {
      goal: 'Hear how Vasilisa answers Baba Yaga’s question.',
      hint: 'Stay near the door. It may be time to go quickly.',
    },
  },
  [
    sc(
      'a18-12-supper',
      [
        N(
          'Baba Yaga eats, and eats, and Vasilisa stands by the table with her hands folded, saying nothing.',
        ),
        BY(
          'What are you standing there for, dumb as a post? Say something. It’s like eating with a gatepost watching.',
          'angry',
        ),
        V('Granny, may I ask you some questions?'),
        BY('Ask, then. Only mind which questions you pick.', 'think'),
        V('On the road a rider went past me, all in white, on a white horse. Who was he?'),
        BY('That was my bright day.'),
        V('And then another, all in red, on a red horse?'),
        BY('That was my red sun.'),
        V('And at your gate, one all in black?'),
        BY('My dark night. All three mine, all faithful. They come and go when I say.', 'happy'),
        N(
          'Vasilisa thinks of the three pairs of hands; you can see her think of them. She shuts her mouth.',
        ),
      ],
      [
        ask(
          10,
          'social-studies',
          'oral tradition: how old tales travel and change',
          'D2.His.2.K-2',
          [
            N(
              'This tale was told aloud for hundreds of years before a collector, Alexander Afanasyev, gathered it into a book in the 1800s. Baba Yaga is in Ukrainian, Belarusian, Polish and Russian stories too. Why do old tales change a little from place to place?',
            ),
          ],
          [
            o(
              'Tellers remembered them and retold them in their own words, adding local details',
              [
                N(
                  'Yes. Stories passed from person to person by speaking, not writing, are called oral tradition. Each teller keeps the heart of the tale and changes the details.',
                  'happy',
                ),
              ],
              true,
            ),
            o('Because each place invented a completely different story', [
              N(
                'The tales share too much for that: the same characters, the same shape. Places kept the same heart and varied the details.',
              ),
            ]),
            o('Because tales were printed with mistakes', [
              N(
                'For most of their history these tales were told, not printed. The changes came from retelling aloud.',
              ),
            ]),
          ],
          'Learned that old tales passed on by word of mouth (oral tradition) spread and changed from place to place.',
        ),
      ],
    ),
    sc(
      'a18-12-supper-done',
      [
        BY('Is that all? Nothing else?'),
        N('Bright day, red sun, dark night. Fairy tales love things that come in threes.'),
      ],
      [
        ask(
          1,
          'literacy',
          'the rule of three in folk tales: patterns of repetition',
          'RL.2.4',
          [
            N(
              'Three riders: white, red and black. Folk tales often use three of things, like three wishes or three brothers. Why might that be?',
            ),
          ],
          [
            o(
              'A pattern of three is easy to remember aloud, and builds up to a surprise',
              [
                N(
                  'Yes. Two sets a pattern and the third completes it, or breaks it. That makes three good for tales told from memory.',
                  'happy',
                ),
              ],
              true,
            ),
            o('Storytellers could only count to three', [
              N(
                'People counted perfectly well. Three is simply the smallest number that makes a satisfying pattern.',
              ),
            ]),
            o('Because three is a lucky number everywhere', [
              N(
                'Luck varies from culture to culture. The reason here is that three is easy to remember and to build a story on.',
              ),
            ]),
          ],
          'Learned that folk tales often use patterns of three because they are easy to remember and build suspense.',
        ),
      ],
    ),
    sc(
      'a18-12-question',
      [
        V('That’s all, Granny. I’ve asked about what is outside your yard, and that’s enough.'),
        BY(
          'So you have, and so it is. Good girl. You only ask about what’s outside my yard, not what’s in it.',
          'think',
        ),
        BY(
          'People who ask about what goes on inside… well. I don’t like them. They don’t stay long, one way and another.',
        ),
        N('Baba Yaga turns her wet-stone eyes on you.'),
        BY('And you? Hm? Anything you want to know, friend from elsewhere?'),
        N(
          'You think of the hands, and you can’t help it. They are right there in your head, waving.',
        ),
      ],
      [
        think(
          2,
          'sel',
          'curiosity and prying',
          'CASEL: Social awareness',
          [
            N(
              'Baba Yaga says some questions are welcome and others are not. Are there questions we should never ask? When is curiosity a gift, and when is it prying?',
            ),
          ],
          [
            o('Curiosity is a gift when it respects other people’s privacy', [
              N(
                'That’s a fair answer. Asking about the world and about people’s ideas is how we learn. Prying is asking for what someone has not chosen to share.',
                'soft',
              ),
            ]),
            o('It is prying if the person would be hurt or frightened by the question', [
              N(
                'That’s a fair answer. Imagining how the question will land is a good test. Ask yourself whether the answer is yours to know.',
                'soft',
              ),
            ]),
            o('You can ask, but you must accept “no” for an answer', [
              N(
                'That’s a fair answer. Asking is rarely wrong. Pushing after someone says no is where curiosity turns into prying.',
                'soft',
              ),
            ]),
          ],
          'Thought about the difference between healthy curiosity and prying into private matters.',
        ),
      ],
      [
        ch('hands', 'Ask about the hands.', [
          N('You open your mouth. Under the table, Vasilisa stands on your foot, hard.'),
          Y('…About the weather. Is it going to be cold tomorrow?'),
          BY('Very. Good question. Much better than the one you were going to ask.', 'happy'),
        ]),
        ch('nothing', 'Ask nothing. Shake your head.', [
          BY('Wise. Wiser than you look. That isn’t hard, but still.', 'think'),
        ]),
        ch('birches', 'Ask about something outside the yard: the birches.', [
          Y('Why are the birches white?'),
          BY('So my bright day has something to shine on when I’m not using him. Next.', 'happy'),
        ]),
      ],
    ),
    sc(
      'a18-12-question-done',
      [
        N(
          'Baba Yaga leans back. She has eaten everything, as usual, and is in the mood to ask a question herself.',
        ),
        N(
          'Outside the window the birches stand pale in the dark. Their bark peels off in thin papery strips.',
        ),
      ],
      [
        ask(
          1,
          'science',
          'describing a material by its properties: birch bark',
          '2-PS1-1',
          [
            N(
              'Baba Yaga’s answer was a joke. Real birch bark is white, papery and peels in thin sheets. Long ago, which property made it good for writing letters on?',
            ),
          ],
          [
            o(
              'It peels in thin, flat sheets that a sharp point can scratch',
              [
                N(
                  'Yes. People in some lands once scratched whole letters on birch bark. Its white colour comes from a natural substance in it called betulin.',
                  'happy',
                ),
              ],
              true,
            ),
            o('It is cold to touch', [
              N(
                'Coldness doesn’t help you write. Thin sheets that take a scratched mark are what made it useful.',
              ),
            ]),
            o('It is heavy and hard', [
              N(
                'Birch bark is light and thin, not heavy. That is exactly why it worked as a kind of paper.',
              ),
            ]),
          ],
          'Described birch bark by its properties (white, thin, peels in sheets) and linked them to its old use for writing.',
        ),
      ],
    ),
    sc(
      'a18-12-blessing',
      [
        BY(
          'Now I’ll ask one. How did you get all my work done? Every husk. Every speck. Twice.',
          'think',
        ),
        N('Vasilisa’s hand goes towards her pocket, and stops, and goes back to her apron.'),
        V('My mother’s love helped me!'),
        N('Baba Yaga goes very still. Then she gets up, all of her, right up to the rafters.'),
        BY(
          'Love like that? Then off you go, and quickly! Nobody so loved can stay with me!',
          'angry',
        ),
        N(
          'She bundles Vasilisa out of the hut, and you, and your Nubbin, and slams the door so hard the herbs fall off the beams.',
        ),
        N(
          'In the yard she pulls a skull off the fence, stake and all. Its eyes are burning like two coals.',
        ),
        BY(
          'Here. Here’s fire for your stepmother’s daughters. That’s what you came for. Take it and go!',
        ),
      ],
      [
        ask(
          2,
          'sel',
          'feeling loved helps us be brave',
          'CASEL: Self-awareness',
          [
            N(
              'Vasilisa says her mother’s love helped her. How can feeling loved help someone be brave?',
            ),
          ],
          [
            o(
              'Knowing someone believes in you gives you steadiness, even when they are not there',
              [
                N(
                  'Yes. Being loved is like a steady floor under your feet. Vasilisa carries her mother’s belief in her, and it holds her up.',
                  'soft',
                ),
              ],
              true,
            ),
            o('It makes danger disappear', [
              N(
                'It doesn’t remove the danger. What it gives is courage to face it, because you know you matter.',
              ),
            ]),
            o('It only works when the person is in the room', [
              N(
                'It works long after: Vasilisa’s mother is gone, and her love still helps. Memory can be a very strong support.',
              ),
            ]),
          ],
          'Reflected on how feeling loved gives us courage even when the person is not with us.',
        ),
      ],
    ),
    sc(
      'a18-12-gate',
      [
        N(
          'At the gate, Baba Yaga stops you with one long finger. She bends and sniffs your Nubbin, and then you.',
        ),
        BY('Someone here feeds others first. I can smell it.', 'think'),
        BY(
          'Here. A bag of my oats, for whoever it was. The little one can carry it. Don’t come back.',
        ),
        N(
          'Your Nubbin takes the bag in its mouth, which is all of its mouth, and doesn’t drop it the whole way home.',
        ),
      ],
      [
        ask(
          2,
          'science',
          'a seed grows into a new plant: the oat life cycle',
          '3-LS1-1',
          [
            N(
              'Oats are the seeds of a grass-like plant. What happens if you plant an oat seed in damp soil in spring?',
            ),
          ],
          [
            o(
              'It germinates and grows into a new oat plant',
              [
                N(
                  'Yes. A seed is a plant waiting to start. Planted in damp, warm soil it sprouts, grows, flowers and makes new seeds: the life cycle.',
                  'happy',
                ),
              ],
              true,
            ),
            o('It turns into porridge', [
              N(
                'Porridge is what people make from the grain in a kitchen. Planted, the seed grows into a plant.',
              ),
            ]),
            o('Nothing happens, because grain is dead', [
              N('Grain is alive but resting. With water and warmth it wakes up and sprouts.'),
            ]),
          ],
          'Learned that an oat grain is a seed that can germinate and grow into a new plant.',
        ),
      ],
    ),
    sc(
      'a18-12-complete',
      [
        N(
          'The gate swings shut behind you. The fence’s eyes watch you go, all but one pair, which is in Vasilisa’s hands.',
        ),
        N(
          'She holds the stick out in front of her as far as her arms will reach. The skull lights the path like a lantern.',
        ),
        V('I said it. I said Mother. I didn’t know it would make her so cross.', 'shock'),
        Y('You didn’t say anything wrong.'),
        V('No. I didn’t, did I.', 'soft'),
      ],
      [
        ask(
          1,
          'art',
          'sorting colours into warm and cool, and counting each group',
          'K.MD.B.3',
          [
            N(
              'The skull’s glow is amber, a warm colour like fire. Artists sort colours into warm and cool. Sort these six: red, blue, orange, green, yellow, purple. How many are warm?',
            ),
          ],
          [
            o(
              'Three: red, orange and yellow',
              [
                N(
                  'Yes. Red, orange and yellow are warm, the colours of fire and sunshine, and blue, green and purple are the three cool ones.',
                  'happy',
                ),
              ],
              true,
            ),
            o('Two: red and orange', [
              N('Yellow belongs with them too, like sunshine. That makes three warm, three cool.'),
            ]),
            o('Six: all of them', [
              N(
                'Blue, green and purple feel like water and shade, so they are cool. Three are warm.',
              ),
            ]),
          ],
          'Sorted six colours into warm and cool groups and counted three in each.',
        ),
      ],
    ),
  ],
  [
    gloss(
      'oral tradition',
      'Stories, songs and sayings passed on by speaking rather than writing.',
      'a18-12-supper',
    ),
    gloss(
      'betulin',
      'The white substance in birch bark that gives it its colour.',
      'a18-12-question-done',
    ),
  ],
);

// ================================================================== A18-13 The Skull on a Stick
const A13 = quest(
  'a18-13',
  'The Skull on a Stick',
  {
    'a18-13-s1': {
      goal: 'Walk home through the dark wood by the skull’s light.',
      hint: 'Keep inside the circle of light and walk where it shines.',
    },
    'a18-13-s2': {
      goal: 'Stay with Vasilisa when she wants to throw the skull away.',
      hint: 'Wait beside her at the edge of the wood.',
    },
    'a18-13-s3': {
      goal: 'Carry the skull the last stretch, so Vasilisa’s arms can rest.',
      hint: 'Take the stick, hold it out in front, and walk to the house.',
    },
  },
  [
    sc(
      'a18-13-dark',
      [
        N(
          'The wood at night is a different wood. The skull’s light makes a small round room of it, and you walk inside the room.',
        ),
        N(
          'Your Nubbin, full and rested, walks ahead of you at the very edge of the light, unafraid.',
        ),
        N(
          'When the path forks it stops and waits, and the skull’s light swings that way, as if the two of them had agreed it.',
        ),
        V('Look at it. It isn’t frightened at all. How is it not frightened?', 'shock'),
        V('Mother used to say: a fed child sleeps, and a hungry one sees wolves.', 'soft'),
        N(
          'You walk all night and all the next day. The skull’s light goes pale in the sun, but never goes out.',
        ),
      ],
      [
        ask(
          0,
          'science',
          'light spreads out and weakens with distance',
          '1-PS4-2',
          [
            N(
              'The skull’s light makes a bright round room, dim at its edge. Why is a light bright near the lamp and dim far away?',
            ),
          ],
          [
            o(
              'Light spreads out as it travels, so the farther away you are the weaker it is',
              [
                N(
                  'Yes. The same amount of light is spread over a wider and wider area, so each patch gets less. That is why distant lamps and stars look faint.',
                  'happy',
                ),
              ],
              true,
            ),
            o('Darkness pushes the light back', [
              N(
                'Darkness is just the absence of light, so it can’t push. The light itself spreads thinner with distance.',
              ),
            ]),
            o('The lamp gets tired the further it reaches', [
              N(
                'The lamp gives out the same light all the time. It is the spreading out that makes the edge dim.',
              ),
            ]),
          ],
          'Learned that light spreads out as it travels, so it looks dimmer the farther we are from the source.',
        ),
      ],
    ),
    sc(
      'a18-13-dark-done',
      [
        N(
          'At dusk on the second day you see the stepmother’s house ahead. There is no light in it at all.',
        ),
        N(
          'You set out at six in the evening. Now it is six in the evening again, a whole day and night later.',
        ),
      ],
      [
        ask(
          1,
          'maths',
          'time intervals in hours',
          '3.MD.A.1',
          [
            N(
              'You set out at six in the evening and arrive at six the next evening. How many hours have you been walking?',
            ),
          ],
          [
            o(
              '24 hours',
              [
                N(
                  'Yes. From 6 pm to 6 pm the next day is one whole day: 12 hours to 6 am, and 12 more to 6 pm, which makes 24.',
                  'happy',
                ),
              ],
              true,
            ),
            o('12 hours', [
              N(
                'That is only to 6 the next morning. Keep going until 6 that evening and you reach 24 hours.',
              ),
            ]),
            o('6 hours', [
              N(
                'That is the time on the clock, not the length of the walk. A whole day and night is 24 hours.',
              ),
            ]),
          ],
          'Found a time interval of 24 hours from 6 pm to 6 pm the next day.',
        ),
      ],
    ),
    sc(
      'a18-13-throw',
      [
        N(
          'At the edge of the wood Vasilisa stops. Her arms are shaking from holding the stick out all this way.',
        ),
        V(
          'I can’t take it into the house. It’s a head. It’s somebody’s head. I’ll throw it in the ditch.',
          'sad',
        ),
        V('They’ll have fire by now. They’ll have got some from a neighbour. They won’t need it.'),
        N('She lifts the stick to throw. Your Nubbin puts both paws over its eyes.'),
        SK('Don’t throw me away.'),
        N('The voice comes from the skull. It is a dry voice, like leaves, and not at all unkind.'),
        SK('Take me to your stepmother’s house. That is where I’m wanted.'),
        V('Oh.', 'shock'),
      ],
      [
        think(
          3,
          'sel',
          'what to do before getting rid of what frightens us',
          'CASEL: Self-management',
          [
            N(
              'Vasilisa wants to get rid of what frightens her. Is that always wise? What could she do first, before she decides?',
            ),
          ],
          [
            o('Stop, breathe, and look at what is really frightening', [
              N(
                'That’s a fair answer. A frightening thing often looks different once you slow down. Pausing is a way of choosing instead of reacting.',
                'soft',
              ),
            ]),
            o('Ask someone she trusts, or the thing itself', [
              N(
                'That’s a fair answer. Asking can turn up facts we didn’t have. Here, the skull speaks up, and she finds out what it needs.',
                'soft',
              ),
            ]),
            o('Sometimes getting rid of it is the right choice', [
              N(
                'That’s a fair answer. Not every frightening thing should be kept. The wise part is deciding after thinking, not in the first rush of fear.',
                'soft',
              ),
            ]),
          ],
          'Thought about pausing to understand a fear before deciding whether to get rid of what causes it.',
        ),
      ],
      [
        ch('listen', 'Tell her to do as it says.', [
          V('Yes. All right. Yes. It did nearly say please.', 'think'),
        ]),
        ch('hers', 'Say nothing. It’s her choice.', [
          N(
            'You wait. Vasilisa looks at the skull for a long time, and the skull, patiently, looks back.',
          ),
          V('All right. Home.'),
        ]),
      ],
    ),
    sc(
      'a18-13-throw-done',
      [
        N(
          'She lowers the stick. Her arms are trembling so much that the light shakes on the snow.',
        ),
        N('She has held a heavy stick out in front of her for a whole day.'),
      ],
      [
        ask(
          1,
          'health',
          'muscles move the body; tired muscles need rest',
          '4-LS1-1',
          [
            N(
              'Holding something out for hours makes arm muscles shake and ache. What helps tired muscles?',
            ),
          ],
          [
            o(
              'Rest, a gentle stretch and a drink of water',
              [
                N(
                  'Yes. Muscles pull on bones to move your arms, and they tire when they work without a break. Rest, stretching and water help them recover.',
                  'happy',
                ),
              ],
              true,
            ),
            o('Holding on even harder', [
              N('Gripping harder makes the muscle work even more. Resting lets it recover.'),
            ]),
            o('Staying completely still for days', [
              N(
                'A little rest is right, but muscles also like gentle movement. Rest, stretch and water are best.',
              ),
            ]),
          ],
          'Learned that rest, gentle stretching and water help tired muscles recover.',
        ),
      ],
    ),
    sc(
      'a18-13-carry',
      [
        Y('Give it to me. Just as far as the gate.'),
        N('You take the stick. It is lighter than you thought, and warm, like a cup of something.'),
        N(
          'Vasilisa shakes out her arms and blows on her hands, and walks beside you with one hand on your sleeve.',
        ),
        N('The skull looks ahead at the dark house. Its eyes get brighter the nearer you come.'),
        SK('Nearly there.', 'think'),
        N('Your Nubbin climbs up on to your shoulder to see where you’re all going.'),
      ],
      [
        ask(
          1,
          'maths',
          'grams and kilograms',
          '4.MD.A.1',
          [
            N(
              'Imagine the skull and its stick weigh 450 grams. Two of them would weigh 900 grams. Is that more or less than a kilogram?',
            ),
          ],
          [
            o(
              'Less: a kilogram is 1000 grams',
              [
                N(
                  'Yes. 1 kg = 1000 g, and 900 g is 100 g short of that. Always check which unit you are in before you compare.',
                  'happy',
                ),
              ],
              true,
            ),
            o('More: 900 is a big number', [
              N(
                'The size of the number depends on the unit. A kilogram is 1000 grams, so 900 grams is less.',
              ),
            ]),
            o('The same: grams and kilograms are equal', [
              N(
                'A kilogram is much bigger than a gram: 1 kg = 1000 g. So 900 g is a little less than a kilogram.',
              ),
            ]),
          ],
          'Compared 900 grams with 1 kilogram (1000 grams) by converting between units.',
        ),
      ],
      [
        ch('steady', 'Hold it steady, far out in front.', [
          N(
            'You hold it at arm’s length. The light goes before you up the path, like a carpet being unrolled.',
          ),
        ]),
        ch('polite', 'Ask the skull, politely, how it is.', [
          SK('Busy. It has been a long time since anybody asked.'),
          N('It doesn’t say any more, and you don’t ask again.'),
        ]),
      ],
    ),
    sc(
      'a18-13-carry-done',
      [
        N('At the gate you hand the stick back to Vasilisa. It should be her who carries it in.'),
        N('You helped her through the hard stretch, and now you step back.'),
      ],
      [
        ask(
          1,
          'sel',
          'stepping back lets someone finish',
          'CASEL: Relationship skills',
          [
            N(
              'You helped carry the stick, then handed it back so Vasilisa could carry it in. Why might stepping back be the kindest part of helping?',
            ),
          ],
          [
            o(
              'It lets her finish what she started and keeps her pride',
              [
                N(
                  'Yes. Good helpers give support, then step back, so the person can feel the achievement is theirs.',
                  'happy',
                ),
              ],
              true,
            ),
            o('It means you got tired of helping', [
              N(
                'The scene says the opposite: you chose it for her sake. Stepping back can be a way of respecting someone.',
              ),
            ]),
            o('It doesn’t matter who carries it', [
              N('It matters to Vasilisa. People feel stronger when they finish what they began.'),
            ]),
          ],
          'Learned that good helpers support someone and then step back so they can finish for themselves.',
        ),
      ],
    ),
    sc(
      'a18-13-complete',
      [
        N(
          'The house is dark from top to bottom: no candle, no lamp, no glow from the stove, not a chink anywhere.',
        ),
        V('They’re waiting for me. They’ve never once waited for me before.', 'think'),
        N('Your Nubbin climbs down off your shoulder and stands close against your leg.'),
        N('The door flies open before you reach it.'),
      ],
      [
        ask(
          2,
          'literacy',
          'predicting from clues in the text',
          'RL.3.3',
          [
            N(
              'The house is dark, Vasilisa says they are waiting, and your Nubbin presses close. What is the best prediction about what comes next?',
            ),
          ],
          [
            o(
              'Someone inside has been waiting, and what happens next will involve the stepmother’s family',
              [
                N(
                  'Yes. The clues all point to tension and a meeting. Good readers predict from what the text gives them, and then check.',
                  'happy',
                ),
              ],
              true,
            ),
            o('There is a surprise party', [
              N(
                'Nothing in the scene suggests a party. The dark house, the warning words and the Nubbin’s fear all point to tension.',
              ),
            ]),
            o('Nothing will happen', [
              N(
                'A door that flies open by itself is a clue that something will. Predictions use such clues.',
              ),
            ]),
          ],
          'Made a prediction by using clues in the text: the dark house, Vasilisa’s words and the Nubbin’s fear.',
        ),
      ],
    ),
  ],
  [],
);

// ================================================================== A18-14 No Fire
const A14 = quest(
  'a18-14',
  'No Fire',
  {
    'a18-14-s1': {
      goal: 'Bring the skull into the house with Vasilisa.',
      hint: 'Follow her through the door.',
    },
    'a18-14-s2': {
      goal: 'Stay by the cold stove with Vasilisa through the long night.',
      hint: 'Sit by the hearth and don’t leave her on her own.',
    },
    'a18-14-s3': {
      goal: 'Help Vasilisa bury the skull and lock up the house.',
      hint: 'Dig under the birch by the gate, then walk her to the road.',
    },
  },
  [
    sc(
      'a18-14-door',
      [
        STEP(
          'You! You came back. And you’ve brought fire. Well, come in, come in, don’t stand there.',
          'shock',
        ),
        N('For the first time ever she is pleased to see Vasilisa. It doesn’t suit her face.'),
        ELD('We’ve had no light since you went. None. We tried and tried.', 'sad'),
        YNG(
          'We fetched fire from the neighbours, three times. Every time we brought it in at the door, it went out.',
        ),
        ELD('Candles, coals, a lamp. Out, out, out, the moment they crossed the step.', 'shock'),
        STEP('Well, never mind that. Put it on the table. It’ll do for a lamp.'),
        N(
          'Vasilisa sets the skull on the table, on its stick, facing the room. Its eyes are very bright.',
        ),
      ],
      [
        ask(
          4,
          'science',
          'comparing solutions: what puts a flame out (fuel, heat, oxygen)',
          '3-5-ETS1-2',
          [
            N(
              'A fire needs three things: fuel, heat, and oxygen from the air. Compare these three solutions. Which one would put out a candle?',
            ),
          ],
          [
            o(
              'Covering it with a jar, so it runs out of oxygen',
              [
                N(
                  'Yes. Smothering takes away the oxygen. (Only grown-ups should ever put out a flame.) Water takes away heat, and removing the wick takes away the fuel.',
                  'happy',
                ),
              ],
              true,
            ),
            o('Adding more wax', [
              N(
                'More wax is more fuel, which keeps a candle burning. To put it out, remove fuel, heat or oxygen.',
              ),
            ]),
            o('Holding it closer to the stove', [
              N(
                'That adds heat, so the flame would burn on. Putting a fire out means taking away fuel, heat or oxygen.',
              ),
            ]),
          ],
          'Compared three solutions against the fire triangle (fuel, heat, oxygen) and chose the one that would put a candle out.',
        ),
      ],
      [
        ch('stand', 'Stand next to Vasilisa, by the door.', [
          N(
            'You stand by her. The stepmother doesn’t look at you: she is looking at the skull, and the skull is looking at her.',
          ),
        ]),
        ch('close', 'Keep your Nubbin close.', [
          N(
            'You pick your Nubbin up and hold it against your chest. It doesn’t want to look at the table either.',
          ),
        ]),
      ],
    ),
    sc(
      'a18-14-door-done',
      [
        N(
          'The stepmother moves to the stove, and the skull’s eyes follow her. She moves to the window, and they follow her there too.',
        ),
        N(
          'The stove stands against the north wall of the kitchen, and the window is in the east wall.',
        ),
      ],
      [
        ask(
          1,
          'social-studies',
          'compass directions',
          'D2.Geo.2.K-2',
          [
            N(
              'The stepmother walks from the stove on the north wall to the window on the east wall. Roughly which way is she heading?',
            ),
          ],
          [
            o(
              'South-east',
              [
                N(
                  'Yes. Moving away from the north wall means heading south, and moving towards the east wall means heading east. Together that is south-east.',
                  'happy',
                ),
              ],
              true,
            ),
            o('North-west', [
              N(
                'That is the opposite way. She leaves the north wall, so she heads south, and she goes towards the east wall: south-east.',
              ),
            ]),
            o('North-east', [
              N(
                'She is leaving the north wall, not going towards it. South, plus east, makes south-east.',
              ),
            ]),
          ],
          'Used compass directions to describe movement from a north wall to an east wall (south-east).',
        ),
      ],
    ),
    sc(
      'a18-14-stare',
      [
        STEP('Turn it round. Turn it to the wall!', 'shock'),
        N(
          'Vasilisa turns it to the wall. The eyes still look at the stepmother, from the back of the skull, somehow.',
        ),
        ELD('It’s looking at me. Mother, it’s looking at me!'),
        N(
          'The sisters go down to the cellar, and the eyes find them there. They climb to the loft, and the eyes find them in the loft.',
        ),
        N(
          'There is no shouting, and nobody is hurt. There is only the steady light, and three people trying to get out of it.',
        ),
        N(
          'Vasilisa sits by the cold stove, and you sit beside her with your Nubbin in your lap. The light never once looks at you.',
        ),
        V('I didn’t want this. I only went for fire.', 'sad'),
      ],
      [
        think(
          6,
          'sel',
          'whether unkind people deserve a fright, and what Vasilisa’s feelings show',
          'CASEL: Social awareness',
          [
            N(
              'The people who were unkind to Vasilisa are driven out of their house by fright. Do they deserve it? How does Vasilisa feel about it, and what does that tell us about her?',
            ),
          ],
          [
            o('They were unkind, so they have a little coming', [
              N(
                'That’s a fair answer. Many people feel that way. Notice that Vasilisa doesn’t, and ask yourself why that matters.',
                'soft',
              ),
            ]),
            o('Nobody deserves to be frightened out of their home', [
              N(
                'That’s a fair answer. Vasilisa seems to think so too: she is sorry. Her kindness shows she is not like them.',
                'soft',
              ),
            ]),
            o('Being unkind has consequences, but we can still feel sorry', [
              N(
                'That’s a fair answer. Both can be true: they chose how they treated her, and she can still wish no one had been hurt or scared.',
                'soft',
              ),
            ]),
          ],
          'Thought about whether unkindness deserves a fright and what Vasilisa’s sorrow shows about her character.',
        ),
      ],
      [
        ch('sit', 'Sit with her, and say nothing.', [
          N(
            'You sit with her. It is the longest night you have ever sat through, and you sit through all of it.',
          ),
        ]),
        ch('sleeve', 'Put your sleeve over her eyes.', [
          N(
            'She leans against your shoulder with your sleeve over her eyes. After a while, she sleeps.',
          ),
        ]),
        ch('tell', 'Tell her it isn’t her doing.', [
          Y('You went for fire. That’s all you did.'),
          V('I know. I know. Will you stay up with me anyway?', 'soft'),
        ]),
      ],
    ),
    sc(
      'a18-14-stare-done',
      [
        N(
          'Some time before dawn, the back door opens and shuts, three times. Then the house is quiet.',
        ),
        N('You have been awake all night, and worried people find it hard to sleep.'),
      ],
      [
        ask(
          1,
          'health',
          'winding down when you are worried',
          'CASEL: Self-management',
          [N('When you are worried at bedtime, what helps you rest?')],
          [
            o(
              'A calm routine: dim light, slow breaths, and telling someone what is worrying you',
              [
                N(
                  'Yes. A calm routine tells the body it is safe to sleep, and saying a worry out loud makes it smaller.',
                  'happy',
                ),
              ],
              true,
            ),
            o('Staring at a bright screen to take your mind off it', [
              N(
                'Bright screens wake the brain up. Dim light, slow breaths and talking help sleep arrive.',
              ),
            ]),
            o('Keeping the worry secret so nobody else is bothered', [
              N(
                'Worries shrink when shared. Telling a trusted person is a strength, not a bother.',
              ),
            ]),
          ],
          'Learned that a calm routine, slow breathing and sharing a worry help us sleep.',
        ),
      ],
    ),
    sc(
      'a18-14-morning',
      [
        N(
          'In the morning the house is empty. The stepmother’s shawl is gone from its hook, and her daughters’ boots from the step.',
        ),
        N(
          'Three sets of footprints go off down the lane in the snow, fast. They don’t come back, that day or any day.',
        ),
        V('Gone. Just… gone. I didn’t hate them. I don’t think I ever hated them.', 'sad'),
        N(
          'The skull sits on the table, dim now, as if it were tired. Vasilisa wraps it in a clean cloth.',
        ),
        V('It did what it came to do. It should go in the ground, under a tree. Somewhere quiet.'),
        N(
          'You dig under the birch by the gate, where the snow is thin. Your Nubbin digs too, which helps less but means more.',
        ),
      ],
      [
        ask(
          5,
          'social-studies',
          'marking a place to remember',
          'D2.His.2.K-2',
          [
            N(
              'People mark places they want to remember with a stone, a tree or a flower. In the Grove a memorial flower grows for each Nubbin who has faded. Why do people mark special places?',
            ),
          ],
          [
            o(
              'It gives memories a place to stay, and a place to visit',
              [
                N(
                  'Yes. A marked place makes remembering something you can do with your feet as well as your mind. It also tells others that someone or something mattered.',
                  'happy',
                ),
              ],
              true,
            ),
            o('So nobody ever walks there again', [
              N('The opposite: marked places invite people to visit and remember.'),
            ]),
            o('Because stones are cheaper than books', [
              N(
                'Cost isn’t the reason. A stone, a tree or a flower is a lasting sign that something mattered.',
              ),
            ]),
          ],
          'Learned that people mark special places with stones, trees or flowers to remember what mattered.',
        ),
      ],
      [
        ch('stone', 'Set a flat stone on top.', [
          N(
            'You find a flat stone and set it over the place, and Vasilisa nods. It looks like a place somebody remembers.',
          ),
        ]),
        ch('words', 'Ask if she wants to say something.', [
          V('Thank you for the light. That’s all. I think that’s enough.', 'soft'),
        ]),
      ],
    ),
    sc(
      'a18-14-morning-done',
      [
        N(
          'Vasilisa locks the door, hangs the key on a string round her neck, and doesn’t look back at the house.',
        ),
        N('The string is sixty centimetres long. The key is six centimetres long.'),
      ],
      [
        ask(
          1,
          'maths',
          'how many times longer: division',
          '3.OA.A.3',
          [
            N(
              'The string is 60 cm long and the key is 6 cm long. How many times longer is the string than the key?',
            ),
          ],
          [
            o(
              '10 times',
              [N('Yes. 60 ÷ 6 = 10, because 6 × 10 = 60. The string is ten keys long.', 'happy')],
              true,
            ),
            o('54 times', [
              N(
                'That’s 60 − 6, how much longer in centimetres. “How many times” asks for division: 60 ÷ 6 = 10.',
              ),
            ]),
            o('360 times', [
              N('That’s 60 × 6. To find how many keys fit in the string, divide: 60 ÷ 6 = 10.'),
            ]),
          ],
          'Used division to compare lengths: 60 cm ÷ 6 cm = 10 times longer.',
        ),
      ],
    ),
    sc(
      'a18-14-complete',
      [
        V(
          'I’ll go to town and find somewhere to wait for Father. He said spring, if the roads were kind.',
        ),
        N(
          'You walk with her down the lane, the way the footprints went, and then the other way, towards the town.',
        ),
        N(
          'Halfway, she stops and feeds the doll a piece of the bread you brought. The little lights come on, even in daylight.',
        ),
        V('She says we’ll be all right. She says we’ll find a kind old woman.', 'happy'),
        DOLL('Go on, Vasilisa. It’s not far now.', 'soft'),
      ],
      [
        ask(
          1,
          'music',
          'tempo: the beat of words and feet',
          'RL.2.4',
          [
            N(
              'Walking has a steady beat. Say “not far now, not far now” in time with your feet. If you walked twice as fast, what would happen to the beat?',
            ),
          ],
          [
            o(
              'It would be twice as quick: a faster tempo',
              [
                N(
                  'Yes. The speed of a beat is called tempo. Walking slowly is a slow tempo, and hurrying is a fast one. Music uses tempo to set a mood.',
                  'happy',
                ),
              ],
              true,
            ),
            o('The beat would stop', [
              N(
                'The beat would carry on, only quicker. Speeding up changes the tempo, not the steadiness.',
              ),
            ]),
            o('The beat would get louder', [
              N(
                'Loudness is a different thing, called volume. Walking faster makes a faster beat, a quicker tempo.',
              ),
            ]),
          ],
          'Learned that tempo is the speed of a beat, and that walking faster makes a quicker tempo.',
        ),
      ],
    ),
  ],
  [],
);

// ================================================================== A18-15 The Loom
const A15 = quest(
  'a18-15',
  'The Loom',
  {
    'a18-15-s1': {
      goal: 'Find Vasilisa somewhere to stay in town.',
      hint: 'Knock at the little house at the end of the last lane.',
    },
    'a18-15-s2': {
      goal: 'Find an old comb, a shuttle and a horse’s mane for the doll.',
      hint: 'Ask round the town: the barber, the weaver’s widow, the stable.',
    },
    'a18-15-s3': {
      goal: 'Help bleach the linen on the spring grass.',
      hint: 'Spread the linen on the meadow and keep it damp.',
    },
  },
  [
    sc(
      'a18-15-town',
      [
        N(
          'The town is all fences and smoke and dogs. At the very end of the last lane stands a little house with one window and a crooked step.',
        ),
        N('An old woman answers the door, with flour on her hands and nobody else in the house.'),
        OLD(
          'A girl on her own, and a… whatever that is. Come in. You’ve both the look of somebody waiting for something.',
          'soft',
        ),
        V('For my father. He’s far away, trading. Could I stay, Granny, till he comes? I’ll work.'),
        OLD(
          'Stay. I’ve a bench and a stove and nobody to talk to but the cat, and he’s rude.',
          'happy',
        ),
        N(
          'The cat looks at your Nubbin, and your Nubbin looks at the cat. Neither of them blinks first.',
        ),
      ],
      [
        ask(
          4,
          'sel',
          'what makes a welcome feel kind',
          'CASEL: Relationship skills',
          [
            N(
              'The old woman welcomes two strangers with a bench and a stove. What makes a welcome feel kind?',
            ),
          ],
          [
            o(
              'Making room, offering something simple, and asking nothing in return',
              [
                N(
                  'Yes. A kind welcome is generous and easy. The old woman doesn’t make a fuss; she just makes room.',
                  'happy',
                ),
              ],
              true,
            ),
            o('Asking lots of questions before letting them in', [
              N('Questions can wait. A kind welcome makes the person feel safe first.'),
            ]),
            o('Giving the biggest gift she owns', [
              N('Size doesn’t matter. A bench, a stove and a friendly word are plenty.'),
            ]),
          ],
          'Identified what makes a welcome kind: making room, simplicity, and asking nothing in return.',
        ),
      ],
      [
        ch('water', 'Offer to fetch the water.', [
          OLD('Two pails, then. The well’s at the corner. Mind the dog. He’s worse than the cat.'),
        ]),
        ch('cat', 'Introduce your Nubbin to the cat.', [
          N(
            'Your Nubbin walks up to the cat and sits down beside it. After a long time, the cat allows this.',
          ),
        ]),
      ],
    ),
    sc(
      'a18-15-town-done',
      [
        V(
          'Granny, I can’t sit idle. Will you buy me some flax? The best you can find. I’ll spin it.',
        ),
        N(
          'Flax is a tall, slim plant with blue flowers. It is pulled up by the roots, not cut, so that its long stem fibres stay as long as possible.',
        ),
      ],
      [
        ask(
          1,
          'science',
          'flax is pulled to keep its fibres long: a material’s properties',
          '2-PS1-1',
          [N('Why is flax pulled up by the roots instead of being cut?')],
          [
            o(
              'So the stem fibres stay as long as possible, making stronger thread',
              [
                N(
                  'Yes. Long fibres twist into strong, fine thread; short ones make weaker thread. The way a crop is harvested depends on what we want from it.',
                  'happy',
                ),
              ],
              true,
            ),
            o('Because the roots are the part we eat', [
              N(
                'Flax is grown for its stem fibres and its seeds, not its roots. Pulling keeps the stem fibres long.',
              ),
            ]),
            o('Because cutting would hurt the plant', [
              N(
                'The plant is finished either way. Pulling is used to keep the fibres as long as possible.',
              ),
            ]),
          ],
          'Learned that flax is pulled up by the roots so its stem fibres stay long, giving stronger thread.',
        ),
      ],
    ),
    sc(
      'a18-15-loom',
      [
        N(
          'Vasilisa spins through the dark days. Her thread comes out so fine it is like hair, like nothing, like a thought.',
        ),
        OLD(
          'Lovely. Too lovely. There isn’t a loom in this town that will take thread like that. It’ll snap in the reed.',
          'sad',
        ),
        N(
          'That night Vasilisa goes down to the old woman’s little cellar with a crust, and you go with her, holding the light.',
        ),
        N('The doll eats, and the lights come on. It talks to Vasilisa, low, for a long time.'),
        V('An old comb. An old shuttle. And a horse’s mane. That’s what she wants.', 'think'),
        V(
          'Will you find them? I can’t ask Granny for a horse’s mane. She’ll think I’ve gone strange.',
        ),
      ],
      [
        ask(
          5,
          'maths',
          'a repeating over-under pattern (plain weave)',
          '4.OA.C.5',
          [
            N(
              'On a loom the lengthwise threads are called the warp. The shuttle carries a cross thread over one warp thread, then under the next, and so on. With 12 warp threads in a row, over how many does the cross thread pass?',
            ),
          ],
          [
            o(
              '6',
              [
                N(
                  'Yes. Over, under, over, under: every second thread, so half of 12 is 6 over and 6 under. That simple pattern is called plain weave.',
                  'happy',
                ),
              ],
              true,
            ),
            o('12', [
              N(
                'Passing over all 12 would not weave anything. It alternates, over one, under one, so half are over: 6.',
              ),
            ]),
            o('3', [
              N(
                'That would be one in four. Plain weave goes over one, under one, which is half of the 12: 6.',
              ),
            ]),
          ],
          'Found the rule of plain weave (over one, under one) and used it: half of 12 threads is 6.',
        ),
      ],
      [
        ch('ask', 'Go out first thing and ask round.', [
          N(
            'The barber has a comb with three teeth missing, and the weaver’s widow has a shuttle. The stableman cuts you a mane’s worth and asks no questions.',
          ),
        ]),
        ch('stable', 'Send your Nubbin to the stable, where it has made friends with the horse.', [
          N(
            'Your Nubbin comes back with a long switch of mane trailing from its mouth. The horse, it seems, didn’t mind.',
          ),
        ]),
      ],
    ),
    sc(
      'a18-15-loom-done',
      [
        N(
          'By morning there is a loom in the corner, small and neat, strung with Vasilisa’s thread. Nobody heard it being made.',
        ),
        N(
          'While you thread it, your Nubbin falls asleep in the heap of combed flax beside it, curled up tight. Nobody has the heart to move it.',
        ),
      ],
      [
        ask(
          1,
          'social-studies',
          'how linen was made by hand long ago, step by step',
          'D2.His.2.K-2',
          [
            N(
              'Long ago, families made linen by hand in five steps: bleach, spin, pull, weave and ret (soak the stems so the woody part rots away). Which order did they go in?',
            ),
          ],
          [
            o(
              'Pull, ret, spin, weave, bleach',
              [
                N(
                  'Yes. Pull, ret, spin, weave, bleach: you can’t spin what hasn’t been retted, or weave what hasn’t been spun. Today machines do most of it, in the same order.',
                  'happy',
                ),
              ],
              true,
            ),
            o('Weave, pull, spin, ret, bleach', [
              N(
                'You can’t weave before there is thread, and thread comes from spinning retted fibres. Start with pulling the plant.',
              ),
            ]),
            o('Bleach, spin, pull, weave, ret', [
              N(
                'Bleaching comes last, on the finished cloth. Begin by pulling the plant, then ret, spin and weave.',
              ),
            ]),
          ],
          'Put the five steps of making linen by hand long ago in order (pull, ret, spin, weave, bleach), and compared it with today.',
        ),
      ],
    ),
    sc(
      'a18-15-bleach',
      [
        N(
          'All winter Vasilisa weaves. By the time the snow goes there is a roll of linen as thick as a log and as light as a scarf.',
        ),
        OLD('Now it wants the sun. Out on the grass with it.'),
        N(
          'You carry it to the meadow and spread it on the new grass, a long white road through the green.',
        ),
        N(
          'Every hour you sprinkle it from the can, and the sun works on it, and it gets whiter by the day.',
        ),
        N(
          'Your Nubbin is not allowed on the linen. It understands this perfectly, and lies at the very edge with one paw on.',
        ),
        V(
          'It’s the first thing I’ve made all by myself. Well. Me and her. And you, carrying.',
          'happy',
        ),
      ],
      [
        ask(
          3,
          'science',
          'sunlight breaks down colour: bleaching',
          '4-PS3-2',
          [N('Linen was spread on grass in the sun to whiten it. What in sunlight does this?')],
          [
            o(
              'Light energy, including ultraviolet light, breaks down the colour in the fibres',
              [
                N(
                  'Yes. Sunlight carries energy that breaks up coloured substances in the cloth, so it fades and whitens. It is the same reason sunlit curtains fade.',
                  'happy',
                ),
              ],
              true,
            ),
            o('The warmth melts the colour away', [
              N(
                'Warmth helps a little, but the main work is done by the light itself, especially ultraviolet.',
              ),
            ]),
            o('The grass gives off white powder', [
              N(
                'Grass leaves nothing on the cloth. The whitening is done by the sunlight, with the damp helping.',
              ),
            ]),
          ],
          'Learned that light energy from the Sun breaks down colour in cloth, which is how linen was bleached.',
        ),
      ],
      [
        ch('sprinkle', 'Take a turn with the watering can.', [
          N(
            'You sprinkle the whole length, end to end. A little rainbow follows you, then gives up.',
          ),
        ]),
        ch('lie', 'Lie in the grass beside it and watch the sky.', [
          N(
            'You lie down beside the linen, and Vasilisa lies down too. For one afternoon, nobody has to do anything at all.',
          ),
        ]),
      ],
    ),
    sc(
      'a18-15-bleach-done',
      [
        OLD(
          'Whiter than snow. Finer than anything. I’ve never seen the like, and I’ve seen a lot.',
          'happy',
        ),
        N(
          'Vasilisa glances at you, and at the pocket by her heart, and says nothing. She doesn’t need to.',
        ),
      ],
      [
        ask(
          1,
          'sel',
          'sharing credit and feeling proud',
          'CASEL: Self-awareness',
          [
            N(
              'Vasilisa made the linen with help from the doll, the old woman and you. How does it feel to share credit for something you’ve made?',
            ),
          ],
          [
            o(
              'Proud and thankful, because good work often depends on others',
              [
                N(
                  'Yes. Pride and gratitude fit together. Knowing who helped makes the achievement richer, not smaller.',
                  'happy',
                ),
              ],
              true,
            ),
            o('Disappointed, because it should all be yours', [
              N(
                'Some people feel that, but sharing usually makes the work feel bigger and friendships stronger.',
              ),
            ]),
            o('Embarrassed, because help means you could not do it alone', [
              N('Very few big things are done alone. Accepting help is part of doing well.'),
            ]),
          ],
          'Reflected on feeling proud and thankful when good work is shared with helpers.',
        ),
      ],
    ),
    sc(
      'a18-15-complete',
      [
        N(
          'All winter the old woman has been whittling by the stove, and wouldn’t say what. Now she puts it in your hands.',
        ),
        N(
          'It is a lantern shade carved from birch, round, with two eye-holes: a skull, but a kind one. There is no bone in it anywhere.',
        ),
        OLD('For the light that brought her home. Without the rest of it.', 'soft'),
        N(
          'Put a candle inside, and the eyes glow warm and slow, like somebody pleased to see you.',
        ),
      ],
      [
        think(
          2,
          'art',
          'your point of view and the characters’: the same shape can feel scary or kind',
          'RL.3.6',
          [
            N(
              'To the stepmother the skull was terrifying; to Vasilisa it was the light that brought her home. How does the kind lantern feel to you? What decides?',
            ),
          ],
          [
            o('The colours, the light and the setting change how it feels', [
              N(
                'That’s a fair answer. Warm light and a smiling carving feel safe; cold, dark settings feel spooky. Artists choose these on purpose.',
                'soft',
              ),
            ]),
            o('What we already know and feel about it', [
              N(
                'That’s a fair answer. Our memories and stories colour what we see. This skull saved Vasilisa, so it may feel friendly to her.',
                'soft',
              ),
            ]),
            o('The person who made it, and why', [
              N(
                'That’s a fair answer. The old woman made it with kindness, and that kindness can be felt in the way it looks.',
                'soft',
              ),
            ]),
          ],
          'Compared their own view of the lantern with the characters’ views, and thought about how colour, setting, memory and the maker’s intention change how a shape feels.',
        ),
      ],
    ),
  ],
  [
    gloss('warp', 'The lengthwise threads held tight on a loom.', 'a18-15-loom'),
    gloss(
      'ret',
      'To soak flax so that the woody part rots away and leaves the fibres.',
      'a18-15-loom-done',
    ),
  ],
);

// ================================================================== A18-16 Twelve Shirts
const A16 = quest(
  'a18-16',
  'Twelve Shirts',
  {
    'a18-16-s1': {
      goal: 'Walk with the old woman to the palace with the linen.',
      hint: 'Carry the roll. She does the talking.',
    },
    'a18-16-s2': {
      goal: 'Help make up the twelve shirts.',
      hint: 'Sit at the window with Vasilisa, where the light is best.',
    },
    'a18-16-s3': {
      goal: 'Stand with Vasilisa when the Tsar asks to meet the seamstress.',
      hint: 'Walk her to the palace. She’s shaking.',
    },
  },
  [
    sc(
      'a18-16-palace',
      [
        V('Sell it, Granny. Keep the money, for both of us.'),
        OLD(
          'Sell cloth like this? No. Cloth like this is a gift, or it’s nothing. It’s going to the Tsar.',
          'think',
        ),
        N(
          'So off you go to the palace, the old woman in her best shawl and you with the roll of linen on your shoulder.',
        ),
        N(
          'She walks up and down under the palace windows with the linen over her arm, as if she had always meant to.',
        ),
        N(
          'A window opens. A man looks out, then comes down, and turns out to be the Tsar, in his slippers.',
        ),
        TS('What’s that you have, old mother?'),
        OLD('A wonder, Majesty. I’ll show it to nobody but you.'),
        TS('Then I’d better see it.'),
        N(
          'He holds the linen up to the light, and the light goes through it as if it weren’t there.',
        ),
        TS('What do you want for it?'),
        OLD('Nothing. Nobody could put a price on it, so I shan’t try. It’s a gift.', 'soft'),
      ],
      [
        think(
          10,
          'social-studies',
          'whether something can be worth more than a price',
          'D2.Eco.1.K-2',
          [
            N(
              'The old woman says cloth like this is a gift or it is nothing. Can some things be worth more than any price? When is giving better than selling?',
            ),
          ],
          [
            o('Some things are too special to sell: their worth is in the giving', [
              N(
                'That’s a fair answer. A gift makes a bond between giver and receiver that money can’t. The old woman values that more than coins.',
                'soft',
              ),
            ]),
            o('Everything has a fair price, and being paid is respectful', [
              N(
                'That’s a fair answer. A fair price respects the work. The question is whether, for this cloth, a price could ever match its worth.',
                'soft',
              ),
            ]),
            o('It depends on whether she needs the money', [
              N(
                'That’s a fair answer. Giving freely is easier when you are not in need. It is worth asking what the old woman and Vasilisa might lose.',
                'soft',
              ),
            ]),
          ],
          'Thought about when giving is better than selling, and whether worth can exceed a price.',
        ),
      ],
      [
        ch('bow', 'Bow, since everyone else is.', [
          N('You bow. Your Nubbin, sitting on the roll of linen, bows too, and slides off.'),
        ]),
        ch('off', 'Keep your Nubbin off the linen.', [
          N(
            'You catch your Nubbin just as it reaches for a corner. The Tsar laughs, which lets the guards laugh, carefully.',
          ),
        ]),
      ],
    ),
    sc(
      'a18-16-palace-done',
      [
        N('The Tsar thanks her and sends her home with presents. But that isn’t the end of it.'),
        N('In the old tales “Tsar” is the title of a ruler of the land, a little like a king.'),
      ],
      [
        ask(
          1,
          'literacy',
          'words that show respect: titles',
          'L.3.4',
          [
            N(
              'The old woman calls the Tsar “Majesty”. What does that title show about how she speaks to him?',
            ),
          ],
          [
            o(
              'It shows respect for his rank',
              [
                N(
                  'Yes. A title is a word of respect. Calling someone Majesty, Sir or Doctor shows you honour the role they hold.',
                  'happy',
                ),
              ],
              true,
            ),
            o('It shows she is afraid of him', [
              N(
                'She isn’t shaking; she is calm. A title is a polite word of respect, not necessarily fear.',
              ),
            ]),
            o('It is his first name', [
              N('A first name is a personal name. “Majesty” is a title that goes with his rank.'),
            ]),
          ],
          'Learned that titles like Majesty are words of respect, shown by how a character speaks.',
        ),
      ],
    ),
    sc(
      'a18-16-shirts',
      [
        N(
          'Three days later a man from the palace knocks at the door, with the linen under his arm and a worried face.',
        ),
        OLD(
          'Nobody at court can sew it. The needles slide off it. The Tsar asks, whoever spun it and wove it, can she make shirts of it?',
        ),
        V('Yes. Tell him yes.'),
        N(
          'She sews for a week: twelve shirts, one after another, at the window where the light is best.',
        ),
        N(
          'You thread her needles, because her eyes are tired by evening. Your Nubbin sorts the buttons into rows.',
        ),
        N(
          'The doll works at night. In the morning there is always one more seam done than anybody remembers sewing.',
        ),
      ],
      [
        ask(
          3,
          'maths',
          'division: 12 ÷ 2',
          '3.OA.A.3',
          [
            N(
              'She makes twelve shirts. If she finished two shirts every day, how many days would twelve shirts take?',
            ),
          ],
          [
            o(
              '6 days',
              [
                N(
                  'Yes. 12 ÷ 2 = 6, because 2 × 6 = 12. In a week of seven days she would finish with a day to spare.',
                  'happy',
                ),
              ],
              true,
            ),
            o('10 days', [
              N('That’s 12 − 2. To find how many groups of 2 are in 12, divide: 12 ÷ 2 = 6.'),
            ]),
            o('24 days', [
              N(
                'That’s 12 × 2. Two shirts a day is faster than one a day, so the answer should be fewer than 12: 12 ÷ 2 = 6.',
              ),
            ]),
          ],
          'Divided 12 shirts by 2 shirts a day to find 6 days.',
        ),
      ],
    ),
    sc(
      'a18-16-shirts-done',
      [
        N(
          'Twelve shirts lie folded on the table, white as first snow, and the old woman carries them to the palace.',
        ),
        N('Vasilisa rubs her tired eyes. Sewing small stitches all week is hard work for them.'),
      ],
      [
        ask(
          1,
          'health',
          'eye muscles focus the eye; resting them after close work',
          '4-LS1-1',
          [
            N(
              'Close work like sewing tires the eyes. A good habit is to look at something far away for twenty seconds every twenty minutes. Why does that help?',
            ),
          ],
          [
            o(
              'It relaxes the muscles that keep the eyes focused on near things',
              [
                N(
                  'Yes. Focusing close up keeps eye muscles tense. Looking far away lets them relax, which helps prevent aching eyes and headaches.',
                  'happy',
                ),
              ],
              true,
            ),
            o('It makes the eyes bigger', [
              N('Eyes stay the same size. The break is for the muscles that focus them.'),
            ]),
            o('It lets the needle cool down', [
              N('Needles don’t get hot from sewing. The break is for your eyes’ focusing muscles.'),
            ]),
          ],
          'Learned that looking far away regularly relaxes the eye muscles during close work.',
        ),
      ],
    ),
    sc(
      'a18-16-tsar',
      [
        N(
          'The Tsar puts on one of the shirts, and then sends for the seamstress. He wants to see who made such things with her two hands.',
        ),
        V('Me? At the palace? Like this?', 'shock'),
        OLD('Like that. Wash your face. It’s a very good face.', 'happy'),
        N(
          'You walk her there. On the steps she stops and puts her hand in her pocket, and takes it out again, steadier.',
        ),
        N(
          'The Tsar looks at Vasilisa, and goes on looking, and forgets entirely what he meant to say.',
        ),
        TS('You made these? All of them?'),
        V('Yes, Majesty. With help.'),
        TS(
          'Then I don’t want to let you go. Not today, and I’d like it to be not ever. Would you mind that very much?',
          'soft',
        ),
        N(
          'Vasilisa looks at you, and you look at her. She doesn’t need anybody to tell her what to say.',
        ),
        V('I wouldn’t mind it at all.', 'happy'),
      ],
      [
        ask(
          6,
          'sel',
          'honesty and sharing credit',
          'CASEL: Responsible decision-making',
          [N('Vasilisa says “With help.” Why is that an honest and generous thing to say?')],
          [
            o(
              'It is true, and it shares the credit',
              [
                N(
                  'Yes. She could have claimed all the praise, but she tells the truth about the help she had. Honesty and generosity often go together.',
                  'happy',
                ),
              ],
              true,
            ),
            o('It makes the shirts look better', [
              N('The shirts are the same either way. Her words are about telling the truth.'),
            ]),
            o('It makes the Tsar feel sorry for her', [
              N('She isn’t asking for pity. She is being truthful about who helped.'),
            ]),
          ],
          'Talked about honesty and sharing credit: saying who helped is true and generous.',
        ),
      ],
      [
        ch('cheer', 'Cheer, out loud, in a palace.', [
          N(
            'You cheer. Your Nubbin cheers in its own way, which is to run round the throne room twice.',
          ),
        ]),
        ch('squeeze', 'Just squeeze her hand.', [
          N('You squeeze her hand. She squeezes back so hard it hurts, and laughs.'),
        ]),
      ],
    ),
    sc(
      'a18-16-tsar-done',
      [
        N(
          'They are married within the month. Bells ring, somebody throws grain, and your Nubbin eats a good deal of it.',
        ),
        N(
          'The biggest bell in the tower gives a deep note, and the smallest rings high and bright.',
        ),
      ],
      [
        ask(
          1,
          'music',
          'bigger bells make lower notes',
          '1-PS4-1',
          [N('The biggest bell gives the deepest note. Why?')],
          [
            o(
              'Bigger bells vibrate more slowly, and slower vibrations make lower notes',
              [
                N(
                  'Yes. A big bell shakes slowly, so its note is deep, and a small bell shakes quickly, so its note is high. Pitch depends on the speed of vibration.',
                  'happy',
                ),
              ],
              true,
            ),
            o('Bigger bells are simply louder', [
              N(
                'Loudness and pitch are different. A big bell can be loud, but its note is lower because it vibrates more slowly.',
              ),
            ]),
            o('Bigger bells are heavier, so they fall asleep', [
              N('Bells don’t sleep. A big bell vibrates slowly, which gives a low pitch.'),
            ]),
          ],
          'Learned that bigger bells vibrate more slowly and so sound lower.',
        ),
      ],
    ),
    sc(
      'a18-16-complete',
      [
        N(
          'In the spring the merchant comes home over the hill, thinner and browner, with a sledge full of far-off things.',
        ),
        MER('Married? My Vasilisa? To whom? To the… oh. Oh, my goodness.', 'shock'),
        N(
          'She takes him to live with her, and the old woman too, who complains about the palace stairs and is very happy.',
        ),
        N(
          'Your Nubbin carries Baba Yaga’s bag of oats down the palace steps, as proudly as it carried it out of the wood.',
        ),
        N(
          'Last of all, Vasilisa gives your Nubbin a painted doll no bigger than a thumb, in a pouch of its own on a cord.',
        ),
        N(
          'The tale ends the way the old books end it: the little doll stayed in her pocket, always.',
        ),
        N(
          'The page settles, and you are back in the Grove with the atlas on your knee. Your Nubbin checks its pouch twice: the small painted doll is still there.',
        ),
      ],
      [
        ask(
          5,
          'literacy',
          'the theme of a story',
          'RL.4.2',
          [N('What is the main idea, or theme, of this tale?')],
          [
            o(
              'Caring for others, and being cared for in return, is a kind of strength',
              [
                N(
                  'Yes. Vasilisa feeds the doll first, shares, and helps, and help returns to her at every turn. A theme is the big idea the story leaves you with.',
                  'happy',
                ),
              ],
              true,
            ),
            o('Wealth always wins in the end', [
              N(
                'Money isn’t what carries Vasilisa through. What helps is care that she gives and receives.',
              ),
            ]),
            o('Everyone should stay at home', [
              N(
                'Vasilisa travels, works and meets danger. Her strength comes from kindness, not from staying put.',
              ),
            ]),
          ],
          'Identified the story’s theme: caring for others, and being cared for in return, is a kind of strength.',
        ),
      ],
    ),
  ],
  [
    gloss(
      'Tsar',
      'The title of a ruler in old East Slavic tales, a little like a king.',
      'a18-16-palace-done',
    ),
  ],
);

// ================================================================== variants
export const EDU_A18_READER_VARIANTS: EduScene[] = [
  // ---------------------------------------------------------------- Hazel’s margin note (s24Done)
  sc(
    'a18-02-margin-hazel',
    [
      N(
        'Beside the cellar picture, low in the margin, there is a pencil note you have never noticed. You know the hand.',
      ),
      N('“Feed them first. Somebody’s mother said it before I did.”', 'soft'),
      N('And under it, one letter: H.'),
      N('Your Nubbin puts its chin on the page, right on the H, and leaves it there.'),
    ],
    [
      ask(
        1,
        'social-studies',
        'proverbs pass wisdom down the generations',
        'D2.His.2.K-2',
        [
          N(
            'Hazel says somebody’s mother said it first. A short saying handed down through families is called a proverb. Why do proverbs last for hundreds of years?',
          ),
        ],
        [
          o(
            'They are short and easy to remember, and people keep passing them on',
            [
              N(
                'Yes. A few words carry a lesson that was worth keeping, so each generation repeats it. Hazel is passing one on, and so was Vasilisa’s mother.',
                'happy',
              ),
            ],
            true,
          ),
          o('Because they are written on stone', [
            N(
              'Most proverbs were never written down at first. They lasted because people kept saying them.',
            ),
          ]),
          o('Because nobody can forget them', [
            N(
              'People forget lots of things. Proverbs survive because they are short and useful enough to hand on.',
            ),
          ]),
        ],
        'Learned that proverbs are short sayings that pass wisdom down through families and last because people keep repeating them.',
      ),
    ],
  ),
  // ---------------------------------------------------------------- A18-10, step 2 (doll, self)
  sc(
    'a18-10-chores-doll',
    [
      N(
        'Vasilisa sleeps on, as she was told to. The doll climbs down off the bench and goes to work.',
      ),
      N(
        'The broom sweeps the yard with nobody holding it. The pots scrub themselves, and the linen goes into the tub grey and comes out white.',
      ),
      N(
        'The doll was fed twice last night, and it works like two dolls. When you get to the barn, the oats are already sifted.',
      ),
      N(
        'Every husk is gone, and every black grain, and the sack is tied. Your share was done before you were awake.',
      ),
      N(
        'You pick up the broom. The doll takes it out of your hands, firmly, and gives you a stool to sit on.',
      ),
      N('So you sit. It is a very strange morning, being the only one in the hut doing nothing.'),
      N(
        'Once, going past with the washing, the doll pats your Nubbin on the head. It doesn’t stop working to do it.',
      ),
    ],
    [
      ask(
        2,
        'maths',
        'multiplication: two dolls’ worth of work',
        '3.OA.A.3',
        [
          N(
            'Say one doll can finish 12 jobs in a morning. Fed twice, it works like two dolls. How many jobs does it finish?',
          ),
        ],
        [
          o(
            '24',
            [
              N(
                'Yes. Two dolls’ worth of 12 jobs is 2 × 12 = 24 jobs. Doubling 12 gives 24.',
                'happy',
              ),
            ],
            true,
          ),
          o('14', [N('That’s 12 + 2. Twice the work means two groups of 12: 2 × 12 = 24.')]),
          o('6', [
            N('That’s 12 ÷ 2, which halves the work. The doll works twice as hard, so double: 24.'),
          ]),
        ],
        'Doubled 12 jobs to find 24, using multiplication as equal groups.',
      ),
    ],
  ),
  sc(
    'a18-10-chores-self',
    [
      N(
        'Vasilisa sleeps on, as she was told to. The doll climbs down off the bench and goes to work.',
      ),
      N(
        'The broom sweeps the yard with nobody holding it. The pots scrub themselves, and the linen goes into the tub grey and comes out white.',
      ),
      N(
        'Your crust is inside you, and your arms work. So you sift your share yourself, the slow way, a handful at a time.',
      ),
      N(
        'A quarter of oats is a great many oats. Your Nubbin is hungry and droopy, and lies on the sack and watches.',
      ),
      N('You manage six scoops an hour, for eight hours.'),
      N(
        'The doll does its share, and Vasilisa’s, and keeps the dinner going. Yours it leaves to you.',
      ),
      N(
        'By the time the white light is high, your hands are raw and the chaff is up to your knees.',
      ),
      N('By the time it has gone red and low, you are done. You checked twice.'),
    ],
    [
      ask(
        4,
        'maths',
        'multiplication: 8 hours × 6 scoops',
        '3.OA.A.3',
        [N('You manage six scoops an hour for eight hours. How many scoops is that?')],
        [
          o(
            '48',
            [
              N(
                'Yes. 8 × 6 = 48 scoops. You can do 8 × 5 = 40 and add one more 8 to get 48.',
                'happy',
              ),
            ],
            true,
          ),
          o('14', [N('That’s 8 + 6. Six scoops in each of eight hours: 8 × 6 = 48.')]),
          o('42', [N('That’s 7 × 6. There are eight hours, so 8 × 6 = 48.')]),
        ],
        'Multiplied 8 × 6 to find 48 scoops sifted by hand.',
      ),
    ],
  ),
  // ---------------------------------------------------------------- A18-11, step 2 (self)
  sc(
    'a18-11-poppy-self',
    [
      N(
        'The doll climbs down off the table and walks into the poppy seed, and the seed and the earth start running apart around it.',
      ),
      N('It works Vasilisa’s half, and leaves your half alone.'),
      N('It looks at you once, and you understand that it isn’t unkind. It is only fair.'),
      N(
        'So you pick earth out of poppy seed, speck by speck, with the point of a pin and a great deal of patience.',
      ),
      N(
        'You begin at half past eight in the morning. Your Nubbin, hungry and slow today, sits by your elbow and noses the specks you’ve missed towards you.',
      ),
      N('By a quarter past six your eyes are watering, and it is done.'),
      N('The doll walks all the way round your half, slowly, and finds nothing wrong with it.'),
    ],
    [
      ask(
        4,
        'maths',
        'time intervals across the day',
        '3.MD.A.1',
        [
          N(
            'You began at 8:30 in the morning and finished at 6:15 in the evening. How long did you work?',
          ),
        ],
        [
          o(
            '9 hours 45 minutes',
            [
              N(
                'Yes. From 8:30 am to 5:30 pm is 9 hours, and from 5:30 to 6:15 is another 45 minutes: 9 hours 45 minutes.',
                'happy',
              ),
            ],
            true,
          ),
          o('10 hours 15 minutes', [
            N(
              'That’s too long. 8:30 to 6:30 pm is exactly 10 hours, and 6:15 is 15 minutes before that: 9 hours 45 minutes.',
            ),
          ]),
          o('8 hours 15 minutes', [
            N('That’s too short. From 8:30 to 5:30 is 9 hours already, then add 45 minutes.'),
          ]),
        ],
        'Found a longer time interval, 8:30 am to 6:15 pm, by counting on in hours and minutes.',
      ),
    ],
  ),
  // ---------------------------------------------------------------- A18-12, step 3 done (doll, self)
  sc(
    'a18-12-gate-doll',
    [
      N(
        'At the gate, Baba Yaga stops you with one long finger. She bends and sniffs your pockets, and Vasilisa’s, and frowns.',
      ),
      BY(
        'Twice the work done, and nobody tired. I don’t ask how. I don’t ask whose hands.',
        'think',
      ),
      BY('Go on. Don’t come back.'),
    ],
    [
      ask(
        0,
        'science',
        'the senses: smell',
        '4-LS1-2',
        [
          N(
            'Baba Yaga finds things out with her nose. People traditionally count five senses. Which is the sense she is using here?',
          ),
        ],
        [
          o(
            'Smell',
            [
              N(
                'Yes. The five senses are sight, hearing, smell, taste and touch. Smell works when tiny particles in the air reach special cells in the nose.',
                'happy',
              ),
            ],
            true,
          ),
          o('Hearing', [
            N('Hearing uses the ears. She is sniffing, which uses the sense of smell.'),
          ]),
          o('Touch', [N('Touch uses the skin. Sniffing uses the nose, so it is smell.')]),
        ],
        'Named smell as one of the five senses and how it works.',
      ),
    ],
  ),
  sc(
    'a18-12-gate-self',
    [
      N(
        'At the gate, Baba Yaga stops you with one long finger. She takes your hand, turns it over, and looks at the blisters.',
      ),
      BY('Hm. Honest, at least.', 'think'),
      BY('You worked. I pay for work.'),
      N(
        'She tips a fair handful of oats into your palm, folds your fingers over it, and pushes you out of the gate.',
      ),
    ],
    [
      ask(
        0,
        'science',
        'friction causes blisters',
        '3-PS2-1',
        [
          N(
            'Sifting all day has raised blisters on your hands. What force makes skin blister when it rubs against something rough?',
          ),
        ],
        [
          o(
            'Friction',
            [
              N(
                'Yes. Friction is the force that resists when two surfaces rub. It turns movement into heat and wear, and enough of it raises a blister. Gloves reduce it.',
                'happy',
              ),
            ],
            true,
          ),
          o('Gravity', [
            N('Gravity pulls things down. The rubbing that raises blisters is friction.'),
          ]),
          o('Magnetism', [
            N(
              'Magnetism acts on certain metals. Blisters come from friction, the force of rubbing.',
            ),
          ]),
        ],
        'Learned that friction, the force of rubbing, can wear and blister skin.',
      ),
    ],
  ),
  // ---------------------------------------------------------------- A18-13, step 1 (doll, self)
  sc(
    'a18-13-dark-doll',
    [
      N(
        'The wood at night is a different wood. The skull’s light makes a small round room of it, and you walk inside the room.',
      ),
      N(
        'Your Nubbin rides inside your coat with its eyes shut tight. Every time an owl calls, it shivers.',
      ),
      N(
        'Vasilisa goes first, holding the skull out in front of her, as far from herself as she can.',
      ),
      V('It keeps looking at me. Not at the path. At me.', 'sad'),
      N(
        'In her pocket the doll is warm and full. Her steps are surer than yours, and she never once looks back.',
      ),
      N(
        'You walk all night and all the next day. The skull’s light goes pale in the sun, but never goes out.',
      ),
    ],
    [
      ask(
        1,
        'science',
        'shivering: muscles make heat',
        '4-LS1-1',
        [N('Your Nubbin shivers in the cold. Why does the body shiver?')],
        [
          o(
            'Tiny rapid muscle movements make heat to keep the body warm',
            [
              N(
                'Yes. Shivering is the body’s heater: muscles twitch quickly, and the movement releases warmth. It is the body’s automatic answer to cold.',
                'happy',
              ),
            ],
            true,
          ),
          o('To shake the cold off the skin', [
            N('Cold doesn’t sit on the skin like dust. Shivering makes heat inside the body.'),
          ]),
          o('Because the muscles are asleep', [
            N('The muscles are very active when we shiver; they are making heat.'),
          ]),
        ],
        'Learned that shivering is the body making heat with quick muscle movements.',
      ),
    ],
  ),
  sc(
    'a18-13-dark-self',
    [
      N(
        'The wood at night is a different wood. The skull’s light makes a small round room of it, and you walk inside the room.',
      ),
      N(
        'Your Nubbin rides inside your coat with its eyes shut tight. Every time an owl calls, it shivers.',
      ),
      N(
        'Somewhere in the night you open your fist and give it Baba Yaga’s oats, a few at a time, as you walk.',
      ),
      N('It eats them all, and stops shivering. Late, but not too late.', 'soft'),
      V('You gave it your wages.', 'soft'),
      N(
        'You walk all night and all the next day. The skull’s light goes pale in the sun, but never goes out.',
      ),
    ],
    [
      ask(
        2,
        'health',
        'animals need food: it gives energy and warmth',
        'K-LS1-1',
        [
          N(
            'Your Nubbin stops shivering after eating oats. Why does food help us keep warm and moving?',
          ),
        ],
        [
          o(
            'Our bodies turn food into energy, and some of it becomes heat',
            [
              N(
                'Yes. Food is fuel. The body releases its energy for moving, thinking and staying warm. Oats release their energy slowly, which is why people eat them in winter.',
                'happy',
              ),
            ],
            true,
          ),
          o('Food warms us only because it is hot', [
            N(
              'Even cold food gives energy. The warmth comes from the body using the food as fuel.',
            ),
          ]),
          o('Food makes the cold go away', [
            N('Cold stays cold. Food gives the body fuel to make its own heat.'),
          ]),
        ],
        'Learned that the body turns food into energy for movement and heat.',
      ),
    ],
  ),
  // ---------------------------------------------------------------- A18-15, step 2 done (doll, self)
  sc(
    'a18-15-loom-done-doll',
    [
      N(
        'By morning there is a loom in the corner, small and neat, strung with Vasilisa’s thread. Nobody heard it being made.',
      ),
      N(
        'Beside it stands a second loom, no bigger than a slipper. On it, half woven, is a cloth the size of a handkerchief.',
      ),
      V('That one isn’t for me. She won’t say who it’s for. I can guess.', 'happy'),
    ],
    [
      ask(
        1,
        'literacy',
        'synonyms: miniature, tiny',
        'L.3.4',
        [
          N(
            'The second loom is “no bigger than a slipper”. Which word means the same as very small?',
          ),
        ],
        [
          o(
            'Miniature',
            [
              N(
                'Yes. Miniature, tiny, minute and petite all mean very small. A good writer picks the one that fits best.',
                'happy',
              ),
            ],
            true,
          ),
          o('Enormous', [
            N('That means the opposite: very big. A loom no bigger than a slipper is miniature.'),
          ]),
          o('Ordinary', [
            N('Ordinary means usual. A slipper-sized loom is unusually small: miniature.'),
          ]),
        ],
        'Chose a synonym (miniature) for very small, using context.',
      ),
    ],
  ),
  sc(
    'a18-15-loom-done-self',
    [
      N(
        'By morning there is a loom in the corner, small and neat, strung with Vasilisa’s thread. Nobody heard it being made.',
      ),
      N(
        'Your Nubbin is awake and helping, handing up the bobbins one at a time. It has kept close to your hands ever since the oats.',
      ),
    ],
    [
      ask(
        1,
        'social-studies',
        'how linen was made by hand long ago, step by step',
        'D2.His.2.K-2',
        [
          N(
            'Long ago, families made linen by hand in five steps: bleach, spin, pull, weave and ret (soak the stems so the woody part rots away). Which order did they go in?',
          ),
        ],
        [
          o(
            'Pull, ret, spin, weave, bleach',
            [
              N(
                'Yes. Pull, ret, spin, weave, bleach, and the bleaching comes last, on finished cloth. Today machines do most of it, in the same order.',
                'happy',
              ),
            ],
            true,
          ),
          o('Weave, pull, spin, ret, bleach', [
            N(
              'Weaving needs thread, which needs spun fibres, which needs retted flax, which needs a pulled plant. Start with pulling.',
            ),
          ]),
          o('Bleach, spin, pull, weave, ret', [
            N(
              'Bleaching comes last. The order starts with pulling the plant: pull, ret, spin, weave, bleach.',
            ),
          ]),
        ],
        'Put the five steps of making linen by hand long ago in order (pull, ret, spin, weave, bleach), and compared it with today.',
      ),
    ],
  ),
  // ---------------------------------------------------------------- A18-16, step 2 (self)
  sc(
    'a18-16-shirts-self',
    [
      N(
        'Three days later a man from the palace knocks at the door, with the linen under his arm and a worried face.',
      ),
      OLD(
        'Nobody at court can sew it. The needles slide off it. The Tsar asks, whoever spun it and wove it, can she make shirts of it?',
      ),
      V('Yes. Tell him yes.'),
      V('Will you sew one? You’ve good hands now. I saw them on the oats.'),
      N(
        'So you sew one shirt of the twelve, slowly, a stitch at a time, the way you sifted. It comes out very plain and very straight.',
      ),
      N(
        'Your Nubbin sorts the buttons. It keeps back the plainest two for your shirt, and guards them.',
      ),
    ],
    [
      ask(
        4,
        'maths',
        'unit fractions: 1 shirt out of 12',
        '3.NF.A.1',
        [
          N(
            'Vasilisa sews eleven shirts and you sew one. What fraction of the twelve shirts did you sew?',
          ),
        ],
        [
          o(
            '1/12',
            [
              N(
                'Yes. One shirt out of twelve equal shirts is 1/12. Vasilisa sewed the other 11/12.',
                'happy',
              ),
            ],
            true,
          ),
          o('1/11', [N('The whole is all twelve shirts, so the bottom number is 12, not 11.')]),
          o('12/1', [N('That says twelve wholes. One shirt out of twelve is 1/12.')]),
        ],
        'Used a unit fraction: 1 shirt out of 12 is 1/12.',
      ),
    ],
  ),
  // ---------------------------------------------------------------- A18-16, complete (doll, self)
  sc(
    'a18-16-complete-doll',
    [
      N(
        'In the spring the merchant comes home over the hill, thinner and browner, with a sledge full of far-off things.',
      ),
      MER('Married? My Vasilisa? To whom? To the… oh. Oh, my goodness.', 'shock'),
      N(
        'She takes him to live with her, and the old woman too, who complains about the palace stairs and is very happy.',
      ),
      V('She wove this on her little loom. She wants your little one to have something.', 'soft'),
      N(
        'A cloth the size of a handkerchief, fine as breath. Your Nubbin sniffs it, and lies down on it at once.',
      ),
      N(
        'Last of all, Vasilisa gives your Nubbin a painted doll no bigger than a thumb, in a pouch of its own on a cord.',
      ),
      N(
        'The tale ends the way the old books end it: the little doll stayed in her pocket, always.',
      ),
      N(
        'The page settles, and you are back in the Grove with the atlas on your knee. Your Nubbin checks its pouch twice: the small painted doll is still there.',
      ),
    ],
    [
      ask(
        6,
        'literacy',
        'theme: kindness returns',
        'RL.4.2',
        [
          N(
            'The doll weaves a cloth for your Nubbin, because you fed her first. What does that show about the story’s theme?',
          ),
        ],
        [
          o(
            'Kindness is repaid, often in ways you didn’t expect',
            [
              N(
                'Yes. You gave a crust, and the doll gave a cloth. The theme of the tale is that care comes round again.',
                'happy',
              ),
            ],
            true,
          ),
          o('Dolls are always grateful', [
            N(
              'The doll is grateful in this tale, but the idea is bigger: kindness tends to be repaid.',
            ),
          ]),
          o('You should never share your food', [
            N('The story says the opposite: sharing led to the cloth.'),
          ]),
        ],
        'Connected a story event to its theme: kindness is repaid.',
      ),
    ],
  ),
  sc(
    'a18-16-complete-self',
    [
      N(
        'In the spring the merchant comes home over the hill, thinner and browner, with a sledge full of far-off things.',
      ),
      MER('Married? My Vasilisa? To whom? To the… oh. Oh, my goodness.', 'shock'),
      N(
        'She takes him to live with her, and the old woman too, who complains about the palace stairs and is very happy.',
      ),
      N(
        'At the wedding the Tsar wears one shirt you know: yours, the plainest of the twelve. He says it is for ordinary days.',
      ),
      N('Vasilisa presses its spare button into your hand. It is plain, and white, and yours.'),
      N(
        'Last of all, Vasilisa gives your Nubbin a painted doll no bigger than a thumb, in a pouch of its own on a cord.',
      ),
      N(
        'The tale ends the way the old books end it: the little doll stayed in her pocket, always.',
      ),
      N(
        'The page settles, and you are back in the Grove with the atlas on your knee. Your Nubbin checks its pouch twice: the small painted doll is still there.',
      ),
    ],
    [
      ask(
        6,
        'literacy',
        'theme: honest work matters',
        'RL.4.2',
        [
          N(
            'The Tsar wears your plain shirt for ordinary days. What does that suggest about the story’s theme?',
          ),
        ],
        [
          o(
            'Plain, honest work has real worth, even if it is not fancy',
            [
              N(
                'Yes. Your shirt did not shine, but it was straight and true, and it was chosen. The tale values honest work done with care.',
                'happy',
              ),
            ],
            true,
          ),
          o('Only the finest things matter', [
            N(
              'The tale chooses the opposite: the plainest shirt is the one worn on ordinary days.',
            ),
          ]),
          o('Buttons are the most important part', [
            N('The button is a keepsake. The theme is about the worth of honest work.'),
          ]),
        ],
        'Connected a story detail to its theme: honest work has worth even when plain.',
      ),
    ],
  ),
  // ---------------------------------------------------------------- Sable bonded (Grove, read-only)
  sc(
    'a18-16-sable',
    [
      N(
        'You shut the atlas. Under the cottage table, in the dark, something grey has been waiting for you to come back.',
      ),
      N(
        'Sable. She has the little painted doll between her paws, held very carefully, the way she would hold an egg.',
      ),
      N(
        'She doesn’t give it back, and she doesn’t run. After a while she puts her chin down on it and shuts her eyes.',
        'soft',
      ),
      N('Your Nubbin looks at its empty pouch, and then at her, and sits down beside her to wait.'),
    ],
    [
      ask(
        2,
        'sel',
        'patience with a shy animal',
        'CASEL: Social awareness',
        [N('Sable is shy and slow to trust. What is a kind way to be with her?')],
        [
          o(
            'Sit quietly nearby, and wait until she is ready',
            [
              N(
                'Yes. Patience tells a shy animal she is safe. Your Nubbin’s way of sitting beside her is just right.',
                'soft',
              ),
            ],
            true,
          ),
          o('Take the doll back right away', [
            N('Grabbing would frighten her, and she might hide again. Waiting shows respect.'),
          ]),
          o('Call her loudly until she comes out', [
            N('Loud calls can scare a shy animal. Quiet and patience work better.'),
          ]),
        ],
        'Chose patience and quiet as the kind way to be with a shy animal.',
      ),
    ],
  ),
];

// ================================================================== exports
export const EDU_A18_READER: EduQuest[] = [
  A01,
  A02,
  A03,
  A04,
  A05,
  A06,
  A07,
  A08,
  A09,
  A10,
  A11,
  A12,
  A13,
  A14,
  A15,
  A16,
];
/** The reader band uses no do lessons, so there are no `edu:` check strings. */
export const CHECKS: string[] = [];
