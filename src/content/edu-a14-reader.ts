/**
 * The Learning Grove, reader band (ages 7–10): Atlas page A14, Homecoming (Homer’s Odyssey,
 * Greece).
 *
 * Source: atlas-a14.ts (ATLAS_A14 and A14_VARIANTS). One EduScene per original scene (every step
 * scene, every done scene, every complete scene and every variant), id `reader:<original id>`,
 * with every choice kept under its original id (and the `a14-name` flags on the three choices of
 * `a14-08-shout`). Reader keeps all choices, so no `defaultChoice` is needed. See EDU-STYLE.md.
 * British spelling.
 *
 * Learning angles, from the outline: geography (Greece, Ithaca and the islands, Pylos, Sparta,
 * Troy, compass directions), history (Homer’s poems were sung and remembered before they were
 * written; the Greek alphabet), how a loom works (warp and weft), xenia (welcoming strangers) and
 * nostos (homecoming), and why a dog can remember someone for years. Around those: science (sound,
 * wind, floating, plants, the senses, bones and scars), maths (time, equal groups, fractions,
 * sums), language (word roots, similes, homophones) and feelings (homesickness, grief, honesty,
 * mercy).
 *
 * Think questions (`ask` with no `best`) in every quest: whether safe is the same as well, whether
 * a kind not-quite-truth is right, whether to trust a stranger, what a promise is worth, and what
 * we owe a guest.
 *
 * Care notes kept: no text is quoted from Homer, Butler or any translation or film. The gods are
 * spoken of with dignity as figures in Greek stories that some people still honour; nobody is
 * punished on screen and the suitors are driven out; the Cyclops’s victims, Scylla’s six and the
 * crew lost after the Sun’s cattle are said plainly and gently (they died, offscreen); Argos and
 * Odysseus’s mother are handled as Fossil is, with comfort straight after. Nobody and no animal
 * in the Learning Grove speaks except as the Atlas page has them speak.
 * Facts used: Greece is in south-east Europe and has many islands; Ithaca is a real island in the
 * Ionian Sea off Greece’s west coast; Troy stood in what is now Turkey, east across the Aegean;
 * Odysseus’s journey is twenty years (ten at war, ten getting home); Homer’s poems were sung and
 * remembered, then written down; “text” and “textile” both come from a Latin word for weaving;
 * a loom holds long warp threads still while the weft goes over and under; “nostalgia” is from
 * Greek nostos (homecoming) and algos (pain); “Cyclops” means round-eye; bronze is copper and tin;
 * sound is vibration and a soft plug blocks it; a west wind blows from the west; the Great Bear
 * circles the Pole Star and is on your left when you face east; an olive tree can live for
 * hundreds of years; dogs have a far keener sense of smell than we do; a scar is new, thicker
 * tissue that closes a healed wound; a cutting from an olive can grow into a new tree.
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
const CS = say('a14-cyclopes');
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
const fits = (t: string) => words(t) <= 26 && t.length <= 150;

/**
 * Keeps every line within the reader caps (30 words, 160 characters): a long line is cut at
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
      if (last !== undefined && fits(`${last} ${sentence}`))
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

/** One answer option. `best` marks the answer the lesson teaches; think questions have none. */
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

/** One reader scene. Lesson ids are `reader:<of>-l<n>`, numbered in play order. */
const sc = (of: string, lines: Line[], beats: Beat[] = [], choices?: Choice[]): EduScene => {
  const cut = split(lines);
  const cutChoices = choices?.map((c) => (c.then ? { ...c, then: sp(c.then) } : c));
  return {
    id: `reader:${of}`,
    of,
    band: 'reader',
    lines: cut.lines,
    ...(cutChoices ? { choices: cutChoices } : {}),
    lessons: [...beats]
      .sort((a, b) => a.after - b.after)
      .map((b, i) => ({ id: `reader:${of}-l${i + 1}`, ...b, after: cut.map[b.after] ?? b.after })),
  };
};

const gl = (word: string, meaning: string, scene: string): GlossaryEntry => ({
  word,
  meaning,
  scene: `reader:${scene}`,
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
      goal: 'Step onto Ithaca and wait at the gate.',
      hint: 'Touch the page, then walk up to the courtyard gate.',
    },
    'a14-01-s2': {
      goal: 'Sit with Telemachus and the old traveller, and listen.',
      hint: 'Take the seat by the far pillar, out of the suitors’ way.',
    },
    'a14-01-s3': {
      goal: 'Watch from the stair as Penelope comes down.',
      hint: 'Stand at the foot of the stair, by the hall door.',
    },
  },
  [
    sc(
      'a14-01-gate',
      [
        N(
          'Nova’s atlas opens on a page of blue: the sea, a scatter of islands, and one rough island with goats on it.',
        ),
        N(
          'The blue turns warm and salty under your fingers. Then you are standing at a courtyard gate with your Nubbin.',
        ),
        N(
          'Inside, young men lounge about playing counters. The air smells of roast meat and spilt wine.',
        ),
        N('Nobody comes to the gate. An old traveller with a bronze spear waits beside you.'),
        MS(
          'A stranger should never be left standing at a gate. This was a good house once.',
          'think',
        ),
        N(
          'A young man sits among the noise as if he were somewhere else. He sees you, and goes red to the ears.',
        ),
        TM(
          'Strangers at my gate, and nobody went out to you. Forgive us. Come in, both of you. Eat first, then tell me what you need.',
        ),
      ],
      [
        ask(
          1,
          'social-studies',
          'find Greece and Ithaca on a map and say which way home lies from Troy',
          'D2.Geo.2.K-2',
          [
            MS(
              'This page shows Greece, in the south-east of Europe, with its ragged coast and hundreds of islands. Ithaca is one, out in the Ionian Sea.',
            ),
            MS(
              'Troy stood far to the east, across the sea, in what is now Turkey. Odysseus is trying to sail home from there to Ithaca. Which way must he mostly sail?',
            ),
          ],
          [
            o(
              'West',
              [
                MS(
                  'Yes. Troy is to the east of Ithaca, so home lies to the west. Greeks have sailed these seas for thousands of years.',
                ),
              ],
              true,
            ),
            o('East', [
              MS(
                'Troy is already in the east. Going east would take him further from Ithaca. Home is back the way the sun sets: west.',
              ),
            ]),
            o('North', [
              MS(
                'Troy is a little north of Ithaca’s line, but mostly it lies far to the east. Home is mostly west.',
              ),
            ]),
          ],
          'Located Greece, Ithaca and Troy and used compass directions: home from Troy lies to the west.',
        ),
        notice(
          4,
          'literacy',
          'xenia: the Greek word for guest-friendship',
          'L.3.4',
          [
            MS('The Greeks had a word for this: xenia (ZEN-ee-ah). It means guest-friendship.'),
            MS(
              'You feed a stranger and give them a seat before you ask a single question. Even your enemy’s guest was safe at your table.',
            ),
          ],
          'Learned the Greek word xenia, guest-friendship, and the custom of feeding strangers before asking their names.',
        ),
      ],
      [
        ch('wait', 'Wait to be asked in properly.', [
          TM(
            'Now you’re asked. Properly. I am Telemachus. It’s my house, for what that’s worth these days.',
          ),
        ]),
        ch('step', 'Step in. You’re hungry.', [
          N('You step in. The old traveller nods at you, as if that was the right answer too.'),
        ]),
        ch('nubbin', 'Let your Nubbin go first.', [
          N(
            'Your Nubbin trots in ahead of you and waits by the hearth, as if it knows where guests go. Telemachus laughs, for the first time in a while.',
          ),
        ]),
      ],
    ),
    sc(
      'a14-01-gate-done',
      [
        N(
          'Telemachus lifts the old man’s spear and stands it in a rack of other spears. They are all dusty.',
        ),
        N('They were his father’s.'),
        TM('Over here, away from that lot. You won’t hear yourself think near them.'),
      ],
      [
        ask(
          1,
          'sel',
          'read feelings from how someone acts',
          'CASEL: Social awareness',
          [
            N(
              'Telemachus went red to the ears when he saw you waiting, and then looked at his father’s spears. What do you think he is feeling?',
            ),
          ],
          [
            o(
              'Embarrassed and sad. A host should have come out, and he misses his father.',
              [
                N(
                  'Yes. His face, his hands and his eyes all tell you, even though he hasn’t said it. Noticing that is called empathy.',
                ),
              ],
              true,
            ),
            o('Angry with you for turning up.', [
              N(
                'He isn’t cross with you. He apologised straight away. Look at what he does: he blushes, then looks at the spears and goes quiet. That says embarrassed and sad.',
              ),
            ]),
            o('Sleepy.', [
              N(
                'Sleepy people yawn and droop. Telemachus went red and stared at his father’s spears. That points to embarrassed and sad.',
              ),
            ]),
          ],
          'Read a character’s feelings from his face and actions (embarrassed, missing his father).',
        ),
      ],
    ),
    sc(
      'a14-01-hearth',
      [
        N(
          'A maid pours water over your hands from a golden jug, then brings bread and meat. The traveller eats like someone who has walked far.',
        ),
        MS(
          'I am Mentes. My father and yours were guest-friends once. I hoped to find your father at home.',
        ),
        TM(
          'Then you are twenty years late, like everyone. He sailed to Troy when I was a baby, and he never came back.',
        ),
        TM(
          'Those men are suitors. They want my mother to marry one of them, so until she chooses, they eat here. Every day.',
          'angry',
        ),
        TM(
          'Pigs, sheep, goats, wine. They are eating my father’s house one dinner at a time.',
          'sad',
        ),
        MS('You have his eyes. I knew them well.', 'soft'),
        TM('My mother says I am his son. I never saw him, so I can’t say.', 'sad'),
        MS(
          'He is not dead. He is held somewhere on the wide sea, and he is trying. He is a man who finds a way.',
        ),
        MS(
          'Call the men of Ithaca to an assembly. Then take a ship and go asking: old Nestor at Pylos, then Menelaus at Sparta.',
        ),
      ],
      [
        ask(
          2,
          'maths',
          'add two parts to make twenty years',
          '2.OA.A.1',
          [
            N(
              'Odysseus spent ten years fighting at Troy, then another ten years trying to get home. How long has he been away in all?',
            ),
          ],
          [
            o(
              '20 years',
              [
                N(
                  'Yes: 10 + 10 = 20. Telemachus was a baby when he left, so he is about twenty himself now.',
                ),
              ],
              true,
            ),
            o('10 years', [
              N('Ten years is only the war. Add the ten years of the voyage home: 10 + 10 = 20.'),
            ]),
            o('2 years', [
              N(
                'That is far too short. Ten years at war plus ten more at sea makes 10 + 10 = 20 years.',
              ),
            ]),
          ],
          'Added 10 + 10 to find that Odysseus has been away for twenty years.',
        ),
      ],
      [
        ch('how', 'Ask Mentes how he knows.', [
          MS('Some things I know because I’ve seen them. Some, because I know him.'),
        ]),
        ch('go', 'Tell Telemachus you’ll go with him.', [
          TM('You would? You don’t even know us.'),
          N(
            'Mentes smiles into his cup. Here, it seems, a guest becomes part of the house for as long as they stay.',
          ),
        ]),
        ch('eat', 'Eat, and listen.', [
          N(
            'You eat, and listen. The bread is good: it’s the last of the good flour, and Telemachus gave it to the strangers.',
          ),
        ]),
      ],
    ),
    sc(
      'a14-01-hearth-done',
      [
        N(
          'Mentes crosses the yard. A bird flies up through the smoke-hole in the roof, and there is no Mentes.',
        ),
        TM('That was no traveller.', 'shock'),
        N('He stands differently after that, as if someone has just told him whose son he is.'),
      ],
      [
        ask(
          0,
          'science',
          'warm air rises, which carries smoke upwards',
          '4-PS3-2',
          [
            N(
              'The bird went up through the hole in the roof, the same way the smoke goes. Why does smoke rise instead of staying in the room?',
            ),
          ],
          [
            o(
              'Hot air is lighter than the cooler air around it, so it floats up.',
              [
                N(
                  'Yes. The fire heats the air, the hot air rises, and it carries the smoke with it. That is why old halls had a hole in the roof.',
                ),
              ],
              true,
            ),
            o('The smoke is trying to escape.', [
              N(
                'Smoke has no plans. It rises because the hot air carrying it is lighter than the cool air around it.',
              ),
            ]),
            o('The roof pulls it up.', [
              N(
                'Nothing pulls it. Hot air is lighter than cold air, so it floats upwards, and the smoke goes along.',
              ),
            ]),
          ],
          'Learned that heated air is lighter than cool air and rises, carrying smoke up and out.',
        ),
      ],
    ),
    sc(
      'a14-01-stair',
      [
        N(
          'In the hall the bard Phemius is singing for the suitors, about the Greeks coming home from Troy and the ones who never did.',
        ),
        N(
          'A woman comes down the stair with two maids, and stops in the doorway with a veil across her face.',
        ),
        PN(
          'Phemius, you know a hundred songs. Sing them another one. Not that one, not in this house.',
          'sad',
        ),
        TM(
          'Mother, it is not his fault what happened at Troy. Let him sing. Many men did not come home.',
          'soft',
        ),
        N('Penelope looks at her son as if he has grown taller. Then she goes back up the stair.'),
        N(
          'Through her door you glimpse a great loom, with a cloth on it as wide as a sail, the colour of undyed wool.',
        ),
        N(
          'Your Nubbin climbs two stairs to look. A maid turns it gently round and points it back down.',
        ),
      ],
      [
        ask(
          0,
          'music',
          'a thinner string makes a higher note',
          '1-PS4-1',
          [
            N(
              'Phemius plays a lyre. When he plucks a string it wobbles to and fro, and that wobble, called a vibration, is the sound you hear.',
            ),
            N(
              'His lyre’s strings are all about the same length, but some are thicker than others. Which string will sound the highest note?',
            ),
          ],
          [
            o(
              'The thinnest one',
              [
                N(
                  'Yes. A thin string wobbles quickly, and quick wobbles make a high note. Thick strings wobble slowly and sound low.',
                ),
              ],
              true,
            ),
            o('The thickest one', [
              N(
                'That one wobbles slowly, and slow wobbles make a low note. For a high note you want a thin string.',
              ),
            ]),
          ],
          'Learned that sound is vibration and that thin strings sound higher than thick ones.',
        ),
      ],
    ),
    sc(
      'a14-01-stair-done',
      [
        TM(
          'That cloth has been on that loom as long as the suitors have been in this hall. Ask Antinous about it. He loves telling it.',
          'angry',
        ),
      ],
      [
        ask(
          0,
          'literacy',
          'use a small clue to work out what is odd',
          'RL.3.3',
          [
            N(
              'A clue is a small detail that points to something bigger. Telemachus says the cloth has been on the loom for as long as the suitors have been eating his house. What is odd about that?',
            ),
          ],
          [
            o(
              'A cloth should be finished long before that.',
              [
                N(
                  'Yes. Even a very big cloth gets finished in a few months. A cloth that is never done suggests somebody doesn’t want it done.',
                ),
              ],
              true,
            ),
            o('Nothing is odd. Cloth takes ages.', [
              N(
                'It does take time, but not years and years. A weaver who works every day should finish. Telemachus is giving you a clue.',
              ),
            ]),
          ],
          'Used a small clue (a cloth that never gets finished) to notice that something is odd.',
        ),
      ],
    ),
    sc(
      'a14-01-complete',
      [
        N(
          'Night. The suitors go home to bed, promising to be back for breakfast, and they always keep that promise.',
        ),
        N(
          'Old Eurycleia, who nursed Telemachus and his father before him, lights him upstairs with a torch.',
        ),
        EC(
          'I had your father on my knee, and then you. I will see you both in one room before I am done.',
          'soft',
        ),
        TM(
          'Tomorrow I’ll call the assembly. Will you stand with me? Just stand. You needn’t say anything.',
        ),
        N('Eurycleia folds his tunic onto a peg and pulls the door shut by its silver ring.'),
        N(
          'You and your Nubbin sleep on fleeces in the porch, as guests do here. Somewhere above, very quietly, a loom is working.',
        ),
        N('It sounds as if it is going backwards.'),
      ],
      [
        ask(
          3,
          'sel',
          'think about sharing when you have little',
          'CASEL: Responsible decision-making',
          [
            N(
              'Telemachus’s house is being eaten bare, yet he gave two strangers his best bread. Why do you think he did?',
            ),
          ],
          [
            o('Because a host looks after guests, however hard things are.', [
              N(
                'That’s a fair answer. In his world, welcoming a guest was close to a law, and he is proving he is not like the suitors.',
              ),
            ]),
            o('Because sharing felt better than being as mean as the suitors.', [
              N(
                'That’s a fair answer too. He is choosing to be a different kind of person from the men who are taking from him.',
              ),
            ]),
            o('Because he wanted something from you, such as help.', [
              N(
                'That’s a fair thought. People do ask for help from guests. But he fed you before he asked for anything, and that says something about him.',
              ),
            ]),
          ],
          'Thought about why someone might share when they have little (a think question with no single answer).',
        ),
      ],
    ),
  ],
  [
    gl(
      'xenia',
      'The Greek word for guest-friendship: the custom of welcoming and feeding strangers.',
      'a14-01-gate',
    ),
    gl('suitor', 'A man who wants to marry someone and keeps coming to ask.', 'a14-01-hearth'),
  ],
);

// ================================================================== A14-2 The Assembly
const A2: EduQuest = quest(
  'a14-02',
  'The Assembly',
  {
    'a14-02-s1': {
      goal: 'Stand behind Telemachus at the assembly.',
      hint: 'Follow him to the meeting-place and stand behind his father’s seat.',
    },
    'a14-02-s2': {
      goal: 'Listen to Antinous tell the story of the web.',
      hint: 'Stay by Telemachus while Antinous speaks.',
    },
    'a14-02-s3': {
      goal: 'Hold the torch while Penelope works.',
      hint: 'Keep the torch high and steady by the loom.',
    },
  },
  [
    sc(
      'a14-02-assembly',
      [
        N(
          'At dawn the heralds call the men of Ithaca to the meeting-place. Nobody has called them together since Odysseus sailed.',
        ),
        N(
          'Telemachus comes in with a spear in his hand and two hounds at his heels. The old men make room for him in his father’s seat.',
        ),
        N(
          'You stand behind the seat with your Nubbin. The suitors sit in a row along the front, and grin.',
        ),
        TM(
          'Nobody’s army is coming. I called you about my own trouble. My father is lost, and my house is being eaten.',
          'angry',
        ),
        TM('Go home, all of you, and eat your own dinners. Aren’t you ashamed?', 'angry'),
        N(
          'He throws the speaker’s staff on the ground, and his eyes fill with tears. For a moment nobody says anything.',
        ),
        N('Then someone in the front row laughs, and the rest of the row joins in.'),
      ],
      [
        ask(
          5,
          'social-studies',
          'a meeting needs a way to give people turns',
          'D2.Civ.8.K-2',
          [
            N(
              'At Ithaca’s meetings, only the person holding the speaker’s staff could talk. Why might a meeting need something like that?',
            ),
          ],
          [
            o(
              'So everyone knows whose turn it is, and one person talks at a time.',
              [
                N(
                  'Yes. Taking turns lets every voice be heard. Much later, in the city of Athens, citizens met in an assembly and used rules like this to make decisions together.',
                ),
              ],
              true,
            ),
            o('So the speaker looks taller.', [
              N(
                'Nice idea, but no. It was for turns: whoever held the staff had the right to speak, and the others waited and listened.',
              ),
            ]),
            o('So nobody has to listen.', [
              N(
                'The opposite. While someone holds the staff, everyone else is meant to listen, and then it is their turn.',
              ),
            ]),
          ],
          'Learned that a speaker’s staff was a way of taking turns in an early assembly.',
        ),
      ],
      [
        ch('staff', 'Pick up the staff and hand it back to him.', [
          N(
            'You pick up the staff and give it back to him. He takes it without looking at you, and holds it like a rope.',
          ),
        ]),
        ch('stare', 'Stare at the one who laughed first.', [
          N(
            'You look straight at him. He stops laughing, remembers he’s a suitor, and starts again, a bit louder.',
          ),
        ]),
        ch('stay', 'Stay where you are, right behind him.', [
          N(
            'You don’t move. Telemachus feels it, and his back straightens a little against the noise.',
          ),
        ]),
      ],
    ),
    sc(
      'a14-02-assembly-done',
      [
        N(
          'A tall man in a bright cloak stands up from the front row: Antinous, the loudest of the suitors.',
        ),
        AN(
          'Blame us? Blame your mother. She is the cleverest woman in Greece, and she has led us on for years.',
          'angry',
        ),
      ],
      [
        ask(
          1,
          'sel',
          'who is to blame, and who made which choice',
          'CASEL: Responsible decision-making',
          [
            N(
              'Antinous says it is Penelope’s fault that the suitors are eating Telemachus’s house. Is he right?',
            ),
          ],
          [
            o('No. Coming and staying was the suitors’ own choice.', [
              N(
                'That’s a fair answer. Penelope may have kept them waiting, but nobody made them come, and nobody made them eat the pigs.',
              ),
            ]),
            o('Partly. She did keep them waiting.', [
              N(
                'That’s a fair answer too. Both can be true, but only one side was taking things that weren’t theirs.',
              ),
            ]),
            o('It’s hard to say when everyone blames someone else.', [
              N(
                'That’s a wise thought. When people point fingers, it helps to ask who made which choice.',
              ),
            ]),
          ],
          'Thought about blame: separating one person’s choices from another’s (a think question).',
        ),
      ],
    ),
    sc(
      'a14-02-antinous',
      [
        AN(
          'Three years she promised, and three years we waited. Shall I tell you how she did it? Everyone else knows.',
        ),
        AN(
          'She put up a great wooden frame in her room, and began weaving the finest, biggest cloth you ever saw.',
        ),
        AN(
          'She said it was a shroud, a funeral cloth, for old Laertes, Odysseus’s father. “Let me finish it first,” she said, “or the women will talk.”',
        ),
        AN('Reasonable. We are reasonable men. We waited.'),
        N(
          'As he talks, the edges of the meeting-place go soft, as if the page itself were listening.',
        ),
        N(
          'The stone turns to floorboards, and the daylight to torchlight. You are in an upstairs room, holding a torch you don’t remember picking up.',
        ),
      ],
      [
        ask(
          1,
          'literacy',
          'the word text comes from a Latin word for weaving',
          'L.3.4',
          [
            N(
              'Weaving gave us words. The Latin word texere means “to weave”, and it gave us textile, and also the word for the writing on this page.',
            ),
            N('Which of these words comes from texere?'),
          ],
          [
            o(
              'text',
              [
                N(
                  'Yes. A text is something woven out of words, the way a textile is woven out of thread. That’s why we talk about weaving a tale.',
                ),
              ],
              true,
            ),
            o('tent', [
              N(
                'A tent comes from a Latin word meaning “stretch”, not “weave”. The word from texere is text: words woven together.',
              ),
            ]),
            o('tell', [
              N(
                'Tell comes from Old English, where it meant both “count” and “relate”. It isn’t from texere. The one that is: text.',
              ),
            ]),
          ],
          'Learned that “text” and “textile” both come from the Latin for weaving.',
        ),
      ],
    ),
    sc(
      'a14-02-antinous-done',
      [N('In front of you stands the great loom. Penelope sits at it, alone, with a small knife.')],
      [
        ask(
          0,
          'maths',
          'multiply months in a year by three years',
          '3.OA.A.3',
          [
            N(
              'Antinous says Penelope kept the suitors waiting for three years. There are 12 months in every year. How many months is three years?',
            ),
          ],
          [
            o(
              '36 months',
              [N('Yes. Three groups of twelve: 12 + 12 + 12 = 36, or 3 × 12 = 36.')],
              true,
            ),
            o('15 months', [
              N('That is 3 + 12. We need three whole years of twelve months each: 3 × 12 = 36.'),
            ]),
            o('24 months', [
              N('That is two years (2 × 12). Three years is one more twelve: 24 + 12 = 36.'),
            ]),
          ],
          'Multiplied 3 × 12 to turn three years into 36 months.',
        ),
      ],
    ),
    sc(
      'a14-02-loom',
      [
        AN(
          'Every day we watched her weave. And every night, by torchlight, she took the stitches out again.',
        ),
        N(
          'Penelope pulls a thread, and a day’s work comes undone in one long, soft sigh. She winds it back on the shuttle for tomorrow.',
        ),
        PN('Hold the torch a little higher. There. Thank you.', 'soft'),
        PN(
          'Every row I weave is one more day for him to come home. Every row I take out gives that day back.',
        ),
        PN(
          'The long threads stand still and wait. The short one goes back and forth, back and forth. I know which one I am.',
          'think',
        ),
        N(
          'Your Nubbin holds the loose end of the thread so it doesn’t tangle. It is very serious about this.',
        ),
        PN(
          'They think I am slow. I am the fastest weaver on Ithaca. I have to be, to unpick it all by dawn.',
          'think',
        ),
        N('Out in the dark passage, a floorboard creaks. Someone has been listening at the door.'),
      ],
      [
        ask(
          4,
          'art',
          'how a loom works: warp and weft',
          'L.3.4',
          [
            N(
              'On a loom, long threads are stretched tight and held still. They are called the warp. A shorter thread, the weft, is passed over one warp thread and under the next, back and forth.',
            ),
            N('Penelope says the short one goes back and forth. Which thread is the weft?'),
          ],
          [
            o(
              'The short thread that goes back and forth',
              [
                N(
                  'Yes. Over, under, over, under: that pattern is how the weft locks the warp into cloth.',
                ),
              ],
              true,
            ),
            o('The long threads that stand still', [
              N(
                'Those are the warp, held tight on the frame. The weft is the short thread that travels across them.',
              ),
            ]),
          ],
          'Learned the parts of a loom: still warp threads and a back-and-forth weft thread woven over and under.',
        ),
      ],
      [
        ch('look', 'Go and look in the passage.', [
          N(
            'You look, and a maid’s skirt whisks round the corner and is gone. You know where she’s going.',
          ),
        ]),
        ch('tell', 'Tell Penelope someone heard.', [
          PN(
            'I know. I’ve known for a week which one it would be. I thought I’d finish tonight’s row anyway.',
          ),
        ]),
        ch('steady', 'Hold the torch steady. Keep going.', [
          N('You keep the torch steady, and she keeps going. Neither of you looks at the door.'),
        ]),
      ],
    ),
    sc(
      'a14-02-loom-done',
      [
        N(
          'The torchlight goes thin, and it is daylight again. You are standing in the meeting-place with empty hands.',
        ),
        AN('A maid told us. We caught her at it, so she had to finish the thing.', 'angry'),
        AN(
          'Send your mother back to her father’s house, boy, and let him marry her off. Until then, we eat.',
        ),
      ],
      [
        ask(
          0,
          'maths',
          'add and subtract to see why a total stays the same',
          '2.OA.A.1',
          [
            N(
              'Say Penelope wove 12 rows on Monday and unpicked 12 that night. She did the same on Tuesday. How many rows does the cloth have on Wednesday morning?',
            ),
          ],
          [
            o(
              '0 rows',
              [
                N(
                  'Yes: 12 − 12 = 0 each night, so she is back where she started. That is why the cloth never got finished.',
                ),
              ],
              true,
            ),
            o('24 rows', [
              N(
                'That is 12 + 12, the rows she wove. But she took out 12 each night as well: 24 − 24 = 0.',
              ),
            ]),
            o('12 rows', [
              N(
                'Close. Monday ends at 0 (12 − 12), and Tuesday ends at 0 again. So Wednesday begins with no rows at all.',
              ),
            ]),
          ],
          'Used addition and subtraction to see that weaving 12 rows and unpicking 12 leaves 0.',
        ),
      ],
    ),
    sc(
      'a14-02-complete',
      [
        N(
          'The assembly breaks up, and nobody helps Telemachus. One old man, Mentor, tries, and is shouted down.',
        ),
        N(
          'That evening at the shore, Mentor finds him again: or someone with Mentor’s face, who walks too lightly for an old man.',
        ),
        MR(
          'A ship, and twenty men to row it. I have found both. Fetch food for the voyage, and tell no one.',
        ),
        N(
          'Eurycleia fills twelve jars of wine and twenty measures of barley-meal, crying the whole time.',
        ),
        EC(
          'Your father sailed over the sea and never came back. Now you. Who will I have left to scold?',
          'sad',
        ),
        TM('Don’t tell my mother. Not for eleven or twelve days, unless she asks.', 'soft'),
        N(
          'At nightfall the ship slides out of the harbour. You sit in the stern with your Nubbin, and a wind comes up behind you from nowhere.',
        ),
        N(
          'Mentor sits by the steering oar and looks up at the sail. The wind is exactly as strong as it needs to be.',
        ),
      ],
      [
        ask(
          6,
          'science',
          'a sail catches the push of the wind',
          '3-PS2-1',
          [
            N(
              'A sail is a big sheet that catches moving air. The wind pushes on it, and that push moves the whole ship. Which wind will carry your ship straight ahead?',
            ),
          ],
          [
            o(
              'A wind blowing from behind the ship',
              [
                N(
                  'Yes. A wind from behind pushes the sail forwards, and the ship follows. Sailors call it a following wind.',
                ),
              ],
              true,
            ),
            o('A wind blowing straight at the front', [
              N(
                'That wind pushes against the ship and slows it. A ship wants the wind at its back.',
              ),
            ]),
          ],
          'Learned that wind pushes on a sail, and a wind from behind moves a ship forwards.',
        ),
      ],
    ),
  ],
  [
    gl('shroud', 'A cloth used to wrap someone who has died.', 'a14-02-antinous'),
    gl(
      'warp',
      'The long threads held tight on a loom while the cloth is woven across them.',
      'a14-02-loom',
    ),
    gl(
      'weft',
      'The thread that goes back and forth over and under the warp to make cloth.',
      'a14-02-loom',
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
      hint: 'Walk up the beach to the feast and sit where you’re put.',
    },
    'a14-03-s2': {
      goal: 'Ride to Sparta with Nestor’s son.',
      hint: 'Climb into the chariot behind Telemachus.',
    },
    'a14-03-s3': {
      goal: 'Hear what the Old Man of the Sea told Menelaus.',
      hint: 'Sit with Menelaus by the fire in the morning.',
    },
  },
  [
    sc(
      'a14-03-pylos',
      [
        N(
          'Sandy Pylos, at sunrise. The whole town is on the beach at a great feast to honour Poseidon, god of the sea.',
        ),
        TM('I can’t. I don’t know how to talk to an old king. What if I get it wrong?', 'sad'),
        MR('Some of it you will think of yourself. The rest will be given you. Go on.', 'soft'),
        N(
          'Nestor’s son runs to meet the strangers before anyone asks who they are, and sits you all on soft fleeces on the sand.',
        ),
        N(
          'Nestor is so old that he was old at Troy. He has outlived nearly everyone he went there with.',
        ),
        NE(
          'Eat first. Then names. Then, if you like, sorrows. There is always time for sorrows.',
          'soft',
        ),
        TM('I’m Odysseus’s son. I have come for news of my father. Any news, even bad.'),
        NE(
          'His son! You talk just like him. I would never have thought a young man could sound so like him.',
          'shock',
        ),
        NE(
          'But I know nothing, child. We left Troy together, quarrelled, and parted at sea. He turned back. I came home.',
          'sad',
        ),
      ],
      [
        ask(
          2,
          'sel',
          'find ways to feel braver before something nerve-racking',
          'CASEL: Self-management',
          [
            N(
              'Telemachus is frightened of talking to an old king and getting it wrong. What could help a person feel braver at a moment like that?',
            ),
          ],
          [
            o('A slow breath, and remembering why he came.', [
              N(
                'That’s a fair answer. Slow breathing calms the body, and remembering your reason gives you something stronger than the fear.',
              ),
            ]),
            o('A friend standing close by.', [
              N(
                'That’s a fair answer. You are that friend, right now. Feeling that someone is on your side can make a hard thing smaller.',
              ),
            ]),
            o('Practising a first sentence in his head.', [
              N(
                'That’s a fair answer. A first sentence gets you started, and the rest often follows. Telemachus has one ready: his name and his father’s.',
              ),
            ]),
          ],
          'Thought about ways to manage nerves before a hard conversation (a think question).',
        ),
      ],
      [
        ch('who', 'Ask who might know.', [
          NE(
            'Menelaus. He was blown about longer than any of us, and came home last. Go to Sparta. My son will drive you.',
          ),
        ]),
        ch('hope', 'Ask if there’s any hope.', [
          NE('With that one? There is always hope. I never once saw him stuck for long.'),
        ]),
        ch('nubbin', 'Let your Nubbin sit by the old king.', [
          N(
            'Your Nubbin climbs onto the fleece beside Nestor. He rests an old hand on it, as if it were a grandchild, and goes on talking.',
          ),
        ]),
      ],
    ),
    sc(
      'a14-03-pylos-done',
      [
        N(
          'When the feast is over, Mentor rises, and is a sea-eagle, and is gone over the water. Everyone on the beach falls silent.',
        ),
        NE(
          'That was Athena, daughter of Zeus. She stood by your father at Troy. If she walks beside you, you won’t go far wrong.',
          'soft',
        ),
        N(
          'Nestor’s people honour her on the shore in the old way. You stand back with your Nubbin and keep quiet, as guests should.',
        ),
      ],
      [
        ask(
          2,
          'social-studies',
          'show respect at someone else’s ceremony',
          'D2.Civ.8.K-2',
          [
            N(
              'Nestor’s people are honouring Athena in their own way. You and your Nubbin stand back and keep quiet. Why is that good manners for a guest?',
            ),
          ],
          [
            o(
              'It shows respect for what matters to other people.',
              [
                N(
                  'Yes. You don’t have to share a belief to be respectful of it. For some people in Greece today, these old gods are still honoured, so a quiet guest is a kind guest.',
                ),
              ],
              true,
            ),
            o('It means nobody will notice you.', [
              N(
                'That might be a side effect, but it isn’t the reason. Standing quietly says: this matters to you, so it matters to me to be careful.',
              ),
            ]),
            o('Guests aren’t allowed to see ceremonies.', [
              N(
                'Guests were often welcome to watch. The point is how you behave: quietly and politely, so you don’t spoil it for the people it belongs to.',
              ),
            ]),
          ],
          'Learned that guests show respect at other people’s ceremonies by staying quiet and polite.',
        ),
      ],
    ),
    sc(
      'a14-03-sparta',
      [
        N(
          'Two days in a chariot over the hills, with Nestor’s son Pisistratus at the reins. Your Nubbin rides up front and leans into the corners.',
        ),
        N(
          'Sparta lies in a hollow among the hills. Menelaus’s house gleams with bronze and gold, amber, silver and ivory.',
        ),
        TM('Pisistratus, look at it. Is this what the house of Zeus is like?', 'shock'),
        ML(
          'No mortal’s house is like Zeus’s, boy. And I would give two-thirds of all this to have back the friends who died at Troy.',
          'sad',
        ),
        N(
          'He hasn’t asked your names. In Sparta, as in Pylos, a guest is fed first and asked after.',
        ),
        N(
          'Then a woman comes down from a high room with her spindle, and stops, and stares at Telemachus.',
        ),
        HE(
          'I have never seen anyone so like another. This must be Odysseus’s son. He has his father’s feet. His hands.',
          'shock',
        ),
        ML(
          'Now that you say it… The hair, the look about the eyes. You are right, my dear.',
          'soft',
        ),
        N(
          'Telemachus holds his cloak up in front of his face. Everyone weeps a little, even Pisistratus, who never met Odysseus at all.',
        ),
      ],
      [
        ask(
          3,
          'maths',
          'two-thirds means two of three equal parts',
          '3.NF.A.1',
          [
            N(
              'Menelaus says he would give away two-thirds of his treasure. Picture it split into 3 equal piles, each one third. How many piles would he give away?',
            ),
          ],
          [
            o(
              '2 of the 3 piles',
              [
                N(
                  'Yes. Two-thirds is two of the three equal parts: 1/3 + 1/3. That leaves one pile for himself.',
                ),
              ],
              true,
            ),
            o('1 of the 3 piles', [
              N(
                'One pile is one-third. Two-thirds is one more third on top: two of the three piles.',
              ),
            ]),
            o('Half of it', [
              N(
                'Half is 1 of 2 equal parts. Two-thirds is 2 of 3 equal parts, which is a little more than half.',
              ),
            ]),
          ],
          'Understood two-thirds as two of three equal parts (1/3 + 1/3).',
        ),
        ask(
          7,
          'science',
          'children share traits with their parents',
          '3-LS3-1',
          [
            N(
              'Helen knew Telemachus was Odysseus’s son from his hair, eyes, hands and feet. Why do children so often look like their parents?',
            ),
          ],
          [
            o(
              'Traits such as hair and eye colour are passed from parents to children.',
              [
                N(
                  'Yes. Many features are inherited, though every child is also a little different from both parents.',
                ),
              ],
              true,
            ),
            o('Children copy their parents’ faces as they grow.', [
              N(
                'Faces can’t be copied, but they can be inherited. Traits are passed down from parents before a child is even born.',
              ),
            ]),
            o('It is only a coincidence.', [
              N(
                'It happens too often to be luck. Inherited traits are passed from parents to children, so families often look alike.',
              ),
            ]),
          ],
          'Learned that inherited traits are passed from parents to children, so families look alike.',
        ),
      ],
      [
        ch('yes', 'Tell them yes, it’s his son.', [
          N(
            'You say it for him, because he can’t. Menelaus reaches across the table and grips Telemachus by the arm.',
          ),
        ]),
        ch('wait', 'Let Telemachus answer.', [
          TM('I am. I’ve come to ask whether my father is alive.'),
        ]),
      ],
    ),
    sc(
      'a14-03-sparta-done',
      [ML('Sit. Eat. In the morning I’ll tell you something I’ve told nobody since I came home.')],
      [
        ask(
          0,
          'sel',
          'waiting patiently for important news',
          'CASEL: Self-management',
          [
            N(
              'Telemachus must wait all night to hear Menelaus’s secret. What can help when you are waiting for something very important?',
            ),
          ],
          [
            o(
              'Eating, resting, and thinking about something calm.',
              [
                N(
                  'Yes. Looking after your body and giving your mind a rest makes waiting easier. The news will still be there in the morning.',
                ),
              ],
              true,
            ),
            o('Asking again and again until he tells.', [
              N(
                'Asking can feel useful, but it often makes the wait feel longer, and it can wear out the person you’re asking.',
              ),
            ]),
            o('Pretending you don’t care.', [
              N(
                'Pretending hides the feeling but doesn’t make it go away. It’s better to say you are impatient, and then find something calming to do.',
              ),
            ]),
          ],
          'Thought about patience: calming ways to wait for important news.',
        ),
      ],
    ),
    sc(
      'a14-03-proteus',
      [
        ML(
          'Coming home from Troy, I was stuck twenty days on an island called Pharos. No wind, and the food running out.',
        ),
        ML(
          'A goddess of the sea took pity on us. “Catch my father, Proteus, the Old Man of the Sea,” she said. “He knows everything.”',
        ),
        ML(
          'At noon he comes up out of the waves to sleep among his seals. You must catch him, and hold on, whatever he turns into.',
        ),
        N(
          'As he tells it, the hall smells of seals. You are lying under a sealskin on a hot beach, with Menelaus and three of his men.',
        ),
        N(
          'An old man comes up out of the sea, counts his seals, counts you among them, and lies down to sleep.',
        ),
        ML('Now!'),
        N(
          'He is a lion in your arms, then a snake, a leopard, a boar; then running water, then a tall tree. Your Nubbin holds on to one leg throughout.',
        ),
        N('At last he is an old man again, and tired, and he answers.'),
        ML(
          'Odysseus is on an island, in the house of the nymph Calypso, Proteus said. She keeps him there. He has no ship, and no crew to row one.',
          'soft',
        ),
      ],
      [
        ask(
          6,
          'literacy',
          'protean means able to change shape',
          'L.3.4',
          [
            N(
              'Proteus could turn into anything, so English borrowed his name. Protean describes something that keeps changing. Which of these is protean?',
            ),
          ],
          [
            o(
              'A cloud that keeps changing shape',
              [
                N(
                  'Yes. A cloud can look like a lion, then a tree, then nothing. That is protean: always changing, like Proteus.',
                ),
              ],
              true,
            ),
            o('A stone wall that never moves', [
              N(
                'A wall stays the same, which is the opposite. Protean means changing shape again and again.',
              ),
            ]),
            o('A clock that always strikes at noon', [
              N(
                'A clock keeps its pattern. Protean is for things that keep changing form, as Proteus did.',
              ),
            ]),
          ],
          'Learned the word “protean”, from Proteus, meaning able to keep changing shape.',
        ),
      ],
      [
        ch('alive', 'Ask Menelaus: alive?', [ML('Alive. Weeping, Proteus said. But alive.')]),
        ch('look', 'Look at Telemachus.', [
          N('Telemachus is very still. Then he stands up, as if he means to swim there.'),
        ]),
      ],
    ),
    sc(
      'a14-03-proteus-done',
      [
        TM('Alive. He’s alive. Then I have to go home, now, and tell her.', 'happy'),
        ML(
          'Stay eleven or twelve days! No? Then take a gift: a silver mixing-bowl with a rim of gold. A guest goes home with something.',
        ),
      ],
      [
        ask(
          1,
          'social-studies',
          'follow a route on a map using compass directions',
          'D2.Geo.2.K-2',
          [
            N(
              'Telemachus came by sea to Pylos, then by chariot east to Sparta. To get back to his ship at Pylos, which way must the chariot go?',
            ),
          ],
          [
            o(
              'Roughly west',
              [
                N(
                  'Yes. Sparta lies east of Pylos, so the way back is roughly west. Reverse a route and each direction flips to its opposite.',
                ),
              ],
              true,
            ),
            o('Roughly east', [
              N(
                'East is the way they came. To go back the way they came, flip it to its opposite: west.',
              ),
            ]),
            o('Straight up to the sky', [
              N(
                'A chariot rides on the ground! On a map, reversing a journey flips each direction: east becomes west.',
              ),
            ]),
          ],
          'Followed and reversed a route using compass directions (east on the way there, west on the way back).',
        ),
      ],
    ),
    sc(
      'a14-03-complete',
      [
        N(
          'You ride back to Pylos and the ship. Behind you, Helen watches from the gate until the chariot is out of sight.',
        ),
        N(
          'On Ithaca the suitors have found out he’s gone. Antinous takes a fast ship and twenty men, to wait for him among the rocks.',
        ),
        N(
          'Telemachus doesn’t know that yet. He stands in the bow all the way, as if that will get him home sooner.',
        ),
        N(
          'Then Nova’s atlas turns its own page, the way a wind turns one, and you are somewhere else entirely.',
        ),
      ],
      [
        ask(
          0,
          'maths',
          'add days of travel',
          '2.OA.A.1',
          [
            N(
              'It took two days by chariot to get from Pylos to Sparta, and two days to ride back again. How many days of chariot riding is that in all?',
            ),
          ],
          [
            o(
              '4 days',
              [N('Yes: 2 + 2 = 4. A journey there and back is the same distance twice.')],
              true,
            ),
            o('2 days', [N('That is only one way. The ride back takes two more days: 2 + 2 = 4.')]),
            o('6 days', [
              N('That is one day too many for each leg. Two days there and two back is 2 + 2 = 4.'),
            ]),
          ],
          'Added 2 + 2 to find the total days of a there-and-back journey.',
        ),
      ],
    ),
  ],
  [
    gl(
      'protean',
      'Able to keep changing shape or form, like the sea-god Proteus.',
      'a14-03-proteus',
    ),
    gl('chariot', 'A light two-wheeled cart pulled by horses.', 'a14-03-sparta'),
  ],
);

// ================================================================== A14-4 Calypso’s Island
const A4: EduQuest = quest(
  'a14-04',
  'Calypso’s Island',
  {
    'a14-04-s1': {
      goal: 'Walk with the messenger to Calypso’s cave.',
      hint: 'Follow the young man with the gold sandals up from the beach.',
    },
    'a14-04-s2': {
      goal: 'Find Odysseus on the shore.',
      hint: 'Go down to the rocks above the beach.',
    },
    'a14-04-s3': {
      goal: 'Help him build the raft.',
      hint: 'Carry the drills and pegs to the shore where he works.',
    },
  },
  [
    sc(
      'a14-04-ogygia',
      [
        N(
          'An island at the navel of the sea, far from anywhere. Alder, poplar and sweet cypress grow here, with owls and sea-crows nesting in them.',
        ),
        N(
          'A vine heavy with grapes grows over the mouth of a cave. Four springs run out across meadows of violets and wild parsley.',
        ),
        N(
          'Someone lands on the beach beside you as lightly as a gull: a young man with golden sandals and a wand.',
        ),
        HM(
          'You’re far from your own country, guest. So am I, and I don’t love all this salt water. Walk with me.',
        ),
        N(
          'In the cave a cedar fire is burning, and a woman is weaving at a loom with a golden shuttle, and singing. She knows Hermes at once.',
        ),
        CA('Hermes. You don’t often come. Tell me what you want, and then let me give you dinner.'),
        N(
          'She sets the food of the gods in front of him, ambrosia and red nectar. You are given bread and figs, which is food for people.',
        ),
        HM(
          'Zeus sends word. The man who is with you must go home. It is not his fate to die here, far from his own people.',
        ),
        CA('You gods are hard. Whenever one of us loves a mortal, you begrudge it.', 'angry'),
        CA(
          'I found him clinging to a keel. I fed him. I told him I would make him never die and never grow old.',
          'sad',
        ),
        CA(
          'But nobody goes against the will of Zeus. Let him go, then, over the sea, if that is what he wants.',
          'sad',
        ),
      ],
      [
        ask(
          1,
          'science',
          'animals live where their needs are met',
          '2-LS4-1',
          [
            N(
              'The island has trees, four springs and meadows, and owls and sea-crows are nesting in the branches. Why do you think the birds chose this place?',
            ),
          ],
          [
            o(
              'It has the water, food and nesting places they need.',
              [
                N(
                  'Yes. Animals live where their needs are met: water to drink, food to eat, and safe places to raise their young.',
                ),
              ],
              true,
            ),
            o('Birds go wherever it is coldest.', [
              N(
                'Most birds prefer places that are comfortable and full of food. Here there are springs, trees and meadows, which is plenty.',
              ),
            ]),
            o('They were lost at sea.', [
              N(
                'Some birds do get lost, but nesting birds stay because they have what they need: water, food and shelter.',
              ),
            ]),
          ],
          'Learned that animals live where their needs for water, food and shelter are met.',
        ),
      ],
      [
        ch('thank', 'Thank Calypso for the figs.', [
          CA('You’re welcome, little guest. You, at least, will go home glad.'),
        ]),
        ch('where', 'Ask Hermes where Odysseus is.', [
          HM('On the shore. He is always on the shore.'),
        ]),
      ],
    ),
    sc(
      'a14-04-ogygia-done',
      [
        N(
          'Hermes goes away over the sea the way he came. Calypso puts down her shuttle and goes to find Odysseus.',
        ),
      ],
      [
        notice(
          0,
          'social-studies',
          'the old Greek gods each had a job, and some people honour them today',
          'D2.His.2.K-2',
          [
            N(
              'In the old Greek stories each god looked after part of the world: Hermes carried messages, Poseidon ruled the sea, and Athena was wise in crafts and strategy.',
            ),
            N(
              'For some people in Greece today, these gods are still honoured, so we tell their stories with care.',
            ),
          ],
          'Learned that Greek gods in the old stories each had a role, and that some people still honour them.',
        ),
      ],
    ),
    sc(
      'a14-04-shore',
      [
        N(
          'He is sitting on a rock above the beach, looking at the sea, and crying. Not loudly: the way people cry who have been at it for years.',
        ),
        N('He is broad, grey at the temples, in a beautiful cloak that somebody else gave him.'),
        OD(
          'Another guest. She has had none in seven years but me. Sit, if you like. The rock is wide.',
          'sad',
        ),
        OD(
          'Every morning I come here. Every night I go back to her, because there is nowhere else to go.',
          'sad',
        ),
        OD(
          'Ithaca is rough. Goats, mostly. I would give anything to see smoke going up from its houses, just once.',
          'soft',
        ),
        N(
          'Your Nubbin sits beside him on the rock and looks at the sea too, in case there is something out there.',
        ),
      ],
      [
        ask(
          3,
          'sel',
          'name homesickness and say what can help',
          'CASEL: Self-awareness',
          [
            N(
              'Odysseus is homesick. He misses home so much that it aches. What can help a person who feels like that?',
            ),
          ],
          [
            o(
              'Talking about home, or sitting with a friend who listens.',
              [
                N(
                  'Yes. Naming the feeling and sharing it makes it lighter. Odysseus is already doing it, out loud, to you.',
                ),
              ],
              true,
            ),
            o('Pretending it doesn’t hurt.', [
              N(
                'Hiding a feeling can make it heavier. Homesickness is normal, and saying so is usually the first step to feeling better.',
              ),
            ]),
            o('Staying alone and not speaking.', [
              N(
                'Being alone with a big feeling for years is exactly what has made Odysseus so tired. Company helps, even quiet company.',
              ),
            ]),
          ],
          'Named homesickness and thought about what helps: talking and company.',
        ),
      ],
      [
        ch('sit', 'Sit with him and say nothing.', [
          N(
            'You sit, and the sea goes in and out. After a while he wipes his face on the beautiful cloak.',
          ),
          OD('Thank you. Nobody does that.'),
        ]),
        ch('home', 'Ask him about home.', [
          OD(
            'My son was a baby. He’ll be a man. My father will be old. My mother, I hope, is well.',
          ),
        ]),
        ch('son', 'Tell him you’ve met his son.', [
          OD('My son? You’ve seen him? How… No. Don’t tell me how. Is he tall? He would be tall.'),
        ]),
      ],
    ),
    sc(
      'a14-04-shore-done',
      [
        N('Calypso comes down the beach. She stands beside him, and doesn’t touch him.'),
        CA(
          'Don’t cry any more. I will let you go. Cut trees and build a raft, and I’ll give you bread and water and a fair wind.',
          'sad',
        ),
        OD('Swear it. Swear you aren’t planning some harm.', 'think'),
        CA(
          'By the earth, and the sky, and the water of the Styx. My heart isn’t iron. I am sorry for you.',
          'soft',
        ),
      ],
      [
        ask(
          0,
          'maths',
          'multiply years by 12 months',
          '3.OA.A.3',
          [
            N(
              'Odysseus has been on this island for seven years. There are 12 months in every year. How many months is that?',
            ),
          ],
          [
            o('84 months', [N('Yes. 7 × 12 = (7 × 10) + (7 × 2) = 70 + 14 = 84 months.')], true),
            o('19 months', [
              N(
                'That is 7 + 12. Seven years of twelve months each means multiplying: 7 × 12 = 84.',
              ),
            ]),
            o('72 months', [
              N('Close, but 72 is 6 × 12. Seven years is one more twelve: 72 + 12 = 84.'),
            ]),
          ],
          'Multiplied 7 × 12 to turn seven years into 84 months.',
        ),
      ],
    ),
    sc(
      'a14-04-raft',
      [
        N(
          'She gives him a bronze axe with an olive-wood handle, and an adze, and shows him where the tallest dry trees grow.',
        ),
        N(
          'He fells twenty trees and trims them true to a line. You carry the drills; your Nubbin carries the pegs, one at a time, very proudly.',
        ),
        N(
          'He works four days: a deck, a mast and yard, a steering oar, a fence of willow against the waves. Calypso brings cloth for the sail.',
        ),
        N(
          'On the last night she sets supper in front of him, takes nectar herself, and sits across the fire.',
        ),
        CA('So you are going. If you knew all that is waiting out there, you would stay.'),
        CA(
          'Stay, and you will never die. You will never grow old. Nothing will ever happen to you again.',
          'soft',
        ),
        CA('Is she lovelier than me? She can’t be. A mortal woman can’t compare with a goddess.'),
        OD(
          'No, she can’t. She is smaller, and older, and she will die one day, and so will I.',
          'soft',
        ),
        OD(
          'And I want to go home. I want it every day. If a god wrecks me on the way, I will bear it. I’ve borne worse.',
        ),
        N('Calypso doesn’t argue. Then he looks across the fire at you, as if he wants a witness.'),
        OD('Tell me honestly, guest. Would you stay?'),
      ],
      [
        ask(
          1,
          'science',
          'a thin edge pushes hard on a small spot, so an axe can cut wood',
          '3-PS2-1',
          [
            N(
              'An axe blade is thick at the back and very thin at the edge. When you swing it, all the push is squeezed onto that thin edge. Why does that help it cut wood?',
            ),
          ],
          [
            o(
              'The push is squeezed onto a tiny spot, so it presses very hard.',
              [
                N(
                  'Yes. The same push spread over a wide, blunt edge wouldn’t cut at all. A thin edge focuses the force on a small spot.',
                ),
              ],
              true,
            ),
            o('A thin edge is lighter, so it floats through the wood.', [
              N(
                'Lighter isn’t the reason. The thin edge concentrates the push on a tiny spot, so it presses hard enough to split the wood.',
              ),
            ]),
          ],
          'Learned that a thin sharp edge focuses a push on a small area, which is why axes cut.',
        ),
        ask(
          5,
          'sel',
          'think about whether being safe is the same as being well',
          'CASEL: Responsible decision-making',
          [
            N(
              'Calypso offers Odysseus a life where nothing bad will ever happen to him, and nothing will ever happen at all. He chooses to go home anyway. Is being safe the same as being well?',
            ),
          ],
          [
            o('No. A life with nothing in it can be safe but still empty.', [
              N(
                'That’s a fair answer. Odysseus seems to think so too: he would take his risky, real life over a safe, stuck one.',
              ),
            ]),
            o('Yes. If nothing hurts, that is the best life.', [
              N(
                'That’s a fair answer. Nobody wants pain, and safety matters a great deal. Odysseus might ask whether you would still feel like yourself, though.',
              ),
            ]),
            o('It depends what you would be missing.', [
              N(
                'That’s a thoughtful answer. For Odysseus it is home, his family and his own name. For someone else it might be different.',
              ),
            ]),
          ],
          'Thought about whether safe is the same as well (a think question).',
        ),
      ],
      [
        ch('home', '“No. Home.”', [OD('Home. Yes. The word does all the work, doesn’t it.')]),
        ch('unsure', '“I don’t know.”', [
          OD('Good answer. It’s only easy once you’ve lost something.'),
        ]),
        ch('happen', '“Not if nothing would ever happen again.”', [
          OD(
            'That’s it. That’s exactly it. She’d keep me safe for ever. Safe isn’t the same as alive.',
          ),
        ]),
      ],
    ),
    sc(
      'a14-04-raft-done',
      [
        N(
          'On the fifth day he sails. He steers by the stars all night, keeping the Bear on his left hand, as Calypso told him.',
        ),
        N(
          'You sit on the deck with your back against the mast. Your Nubbin watches the island go small, and then go.',
        ),
      ],
      [
        ask(
          0,
          'science',
          'stars show direction: north is on your left when you face east',
          '5-ESS1-2',
          [
            N(
              'The Great Bear is a pattern of stars in the northern sky. Odysseus keeps it on his left. If north is on your left, which way are you facing?',
            ),
          ],
          [
            o(
              'East',
              [
                N(
                  'Yes. Face east, and north is on your left and south on your right. Sailors have steered by the Great Bear for thousands of years.',
                ),
              ],
              true,
            ),
            o('West', [
              N(
                'Face west and north is on your right. With north on your left, you must be facing east.',
              ),
            ]),
            o('South', [
              N(
                'Face south and north is behind you. For north to be on your left, you must face east.',
              ),
            ]),
          ],
          'Used the northern stars to work out direction: north on your left means facing east.',
        ),
      ],
    ),
    sc(
      'a14-04-complete',
      [
        N(
          'Calypso stands on the beach until he is out of sight. Then she goes back into her cave, to her loom.',
        ),
        N('She is weaving something. You don’t see what, and perhaps she doesn’t know yet either.'),
        N(
          'Seventeen days of wind in the sail. On the eighteenth, the shadowy hills of a new land rise out of the sea like a shield laid on the water.',
        ),
        OD('Land. Do you see? Whose, I don’t know. But land.', 'happy'),
      ],
      [
        ask(
          2,
          'literacy',
          'a simile compares two things using like or as',
          'L.4.5',
          [
            N(
              'The hills “rise out of the sea like a shield laid on the water”. That is a simile, a comparison that uses “like” or “as”. What is being compared?',
            ),
          ],
          [
            o(
              'The hills and a shield',
              [
                N(
                  'Yes. Dark, rounded hills lying on the sea do look like a great shield laid flat. A simile lets you picture something new by comparing it to something you know.',
                ),
              ],
              true,
            ),
            o('The sea and a loom', [
              N(
                'The loom belongs to Calypso. The “like” in this sentence connects the hills to a shield laid on the water.',
              ),
            ]),
            o('The wind and a sail', [
              N(
                'The wind and sail are just part of the voyage. The simile is “like a shield”, which describes the hills.',
              ),
            ]),
          ],
          'Found the simile “like a shield laid on the water” and what it compares.',
        ),
      ],
    ),
  ],
  [
    gl('ambrosia', 'The food of the gods in Greek stories.', 'a14-04-ogygia'),
    gl(
      'adze',
      'A tool like an axe, with the blade set across the handle, for shaping wood.',
      'a14-04-raft',
    ),
  ],
);

// ================================================================== A14-5 The Raft
const A5: EduQuest = quest(
  'a14-05',
  'The Raft',
  {
    'a14-05-s1': {
      goal: 'Hold on through the storm.',
      hint: 'Keep hold of your plank and keep your Nubbin on your head.',
    },
    'a14-05-s2': {
      goal: 'Swim for the shore.',
      hint: 'Stay outside the surf and swim along the coast to the river mouth.',
    },
    'a14-05-s3': {
      goal: 'Find somewhere dry to sleep.',
      hint: 'Climb the bank to the two olive bushes that grow from one root.',
    },
  },
  [
    sc(
      'a14-05-storm',
      [
        N(
          'Far off, coming home from the edge of the world, Poseidon, the god who shakes the earth, sees the little raft on his sea.',
        ),
        N(
          'He knows the man on it. He has an old anger against him, for a reason you haven’t heard yet.',
        ),
        N(
          'He gathers the clouds, and every wind comes at once. Night comes down out of the sky in the middle of the day.',
        ),
        OD(
          'The ones who fell at Troy were the lucky ones. They had their friends round them. Out here there is nobody.',
          'sad',
        ),
        N(
          'A wave as big as a house hits the raft. The mast snaps, and Odysseus goes under, and comes up, and climbs back on.',
        ),
        N(
          'You are holding a plank with both arms. Your Nubbin sits on your head, holding on to your hair, and neither of you lets go.',
        ),
        N(
          'Then a white sea-bird comes skimming through the spray, and lands on the raft, and is a woman.',
        ),
        IN(
          'Poor man. Why is Poseidon so angry with you? He won’t drown you, though he would like to. Listen to me.',
        ),
        IN(
          'Take off those heavy clothes. Leave the raft to the winds, and swim for the land of the Phaeacians.',
        ),
        IN('Here, tie my veil round your chest. While you wear it, you won’t drown.'),
        IN(
          'When you reach land, untie it and throw it back into the sea. And turn your face away as you throw.',
        ),
        N(
          'She is a bird again, and gone into the dark water. Odysseus holds the veil and looks at it with deep suspicion.',
        ),
        OD('Another god’s trick? I’ll stay on the raft while it holds. Then I’ll swim.', 'think'),
      ],
      [
        ask(
          12,
          'sel',
          'decide whether to trust help from someone you don’t know',
          'CASEL: Responsible decision-making',
          [
            N(
              'Odysseus isn’t sure whether to trust Ino’s gift. What would you want to find out before trusting help from someone you don’t know?',
            ),
          ],
          [
            o('Why is she helping, and what does she get out of it?', [
              N(
                'That’s a fair answer. Asking about someone’s reasons is a good way to test whether an offer is honest.',
              ),
            ]),
            o('Has she done anything to show she is kind?', [
              N('That’s a fair answer. What people do usually tells you more than what they say.'),
            ]),
            o('What would a trusted grown-up say?', [
              N(
                'That’s a fair answer, and a very good rule for everyday life. When you’re unsure about an offer from a stranger, check with someone you trust.',
              ),
            ]),
          ],
          'Thought about how to decide whether to trust a stranger’s help (a think question).',
        ),
      ],
      [
        ch('trust', '“She meant it. Take it.”', [
          OD(
            'Perhaps. I’ve been tricked by kinder faces. I’ll take it, and still hold on to the raft.',
          ),
        ]),
        ch('hold', 'Hold on, and say nothing.', [
          N('You hold on, and your Nubbin holds on. The raft holds on too, for now.'),
        ]),
        ch('knot', 'Help him tie the veil.', [
          N(
            'Your fingers are numb, but you get the knot tied. He nods once, with water running off his beard.',
          ),
        ]),
      ],
    ),
    sc(
      'a14-05-storm-done',
      [
        N(
          'The biggest wave of all. The raft goes to pieces like a heap of straw in a wind, and he climbs onto one beam as if it were a horse.',
        ),
        N(
          'He strips off his cloak, ties the veil round his chest, and dives in. You let go of your plank and follow.',
        ),
      ],
      [
        ask(
          0,
          'science',
          'wood floats because it is less dense than water',
          '2-PS1-1',
          [
            N(
              'The raft broke apart, but the wooden beam still holds Odysseus up. Why does wood float?',
            ),
          ],
          [
            o(
              'It is lighter than the same amount of water.',
              [
                N(
                  'Yes. Scientists say wood is less dense than water. A few very heavy woods sink, but most float, which is why people have built boats from wood for thousands of years.',
                ),
              ],
              true,
            ),
            o('Because it is wet.', [
              N(
                'Getting wet doesn’t make a thing float. It floats because the same amount of wood weighs less than the same amount of water.',
              ),
            ]),
            o('Because the sea is trying to help.', [
              N(
                'The sea has no plans, even in a story! The real reason is that wood is less dense than water, so water pushes it up.',
              ),
            ]),
          ],
          'Learned that wood floats because it is less dense than water.',
        ),
      ],
    ),
    sc(
      'a14-05-swim',
      [
        N(
          'Two days and two nights in the swell. On the third morning the wind drops, a wave lifts you, and there is land, close.',
        ),
        OD('Land! I could cry. I have been crying. I could cry more.', 'happy'),
        N(
          'But the shore is all cliff and reef, and the surf roars against it. A wave throws him onto a rock, and he holds on, and loses skin to it.',
        ),
        N(
          'He swims out again and along the coast, outside the surf, looking for a way in. Athena put that thought in his head, he says later.',
        ),
        N('There: the mouth of a river, clear of rocks and out of the wind.'),
        N(
          'He speaks to the river as a guest speaks at the door of a lord’s house. The current stills, and lets him in.',
        ),
        N(
          'He crawls up the bank into the reeds and kisses the ground. Your Nubbin lies down beside him, flat as a dropped mitten.',
        ),
      ],
      [
        ask(
          0,
          'maths',
          'hours in two days and two nights',
          '4.MD.A.1',
          [
            N(
              'Odysseus swims for two days and two nights. There are 24 hours in one day and night together. How many hours is that?',
            ),
          ],
          [
            o(
              '48 hours',
              [N('Yes. 24 + 24 = 48 hours, or 2 × 24. No wonder he can’t feel his arms.')],
              true,
            ),
            o('24 hours', [
              N('That is only one day and night. He swam two, so double it: 24 × 2 = 48.'),
            ]),
            o('12 hours', [
              N('That is only half a day. Two whole days and nights is 2 × 24 = 48 hours.'),
            ]),
          ],
          'Multiplied 2 × 24 to find that two days and two nights is 48 hours.',
        ),
        ask(
          5,
          'literacy',
          'personification: speaking to something as if it were a person',
          'L.4.5',
          [
            N(
              'Odysseus speaks to the river “as a guest speaks at the door of a lord’s house”, and the river lets him in. Treating a river as if it were a person is called personification. Which sentence is personification?',
            ),
          ],
          [
            o(
              '“The river welcomed him in.”',
              [
                N(
                  'Yes. Rivers can’t welcome anybody, but the sentence gives it a person’s manners. Writers use personification to make nature feel alive.',
                ),
              ],
              true,
            ),
            o('“The river was wide and brown.”', [
              N(
                'That simply describes the river. Personification gives a non-human thing human actions or feelings.',
              ),
            ]),
            o('“The river flows to the sea.”', [
              N(
                'That is a plain fact. For personification, the river would have to act like a person, for example by welcoming someone.',
              ),
            ]),
          ],
          'Identified personification, where a river is described as if it were a person.',
        ),
      ],
    ),
    sc(
      'a14-05-swim-done',
      [
        N(
          'When his breath comes back he unties the veil and throws it into the river, and turns his face away. The water carries it back to the sea.',
        ),
        N('You don’t look either. It seems the right thing.'),
      ],
      [
        ask(
          1,
          'sel',
          'returning what you borrowed shows trust and thanks',
          'CASEL: Relationship skills',
          [
            N(
              'Odysseus gives the veil back exactly as he was told. What does it show when we return something we borrowed?',
            ),
          ],
          [
            o(
              'That we are trustworthy, and thankful for the help.',
              [
                N(
                  'Yes. Giving things back, and saying thank you, keeps friendships strong and makes people glad to help us next time.',
                ),
              ],
              true,
            ),
            o('That we never needed the help.', [
              N(
                'He needed it very much. Returning what you borrowed isn’t about pretending you didn’t need it. It’s about being grateful and fair.',
              ),
            ]),
            o('That it doesn’t matter either way.', [
              N(
                'It matters a lot to the person who lent it, and to whether they’ll lend again. Keeping a promise to return something builds trust.',
              ),
            ]),
          ],
          'Thought about why returning borrowed things matters: trust and gratitude.',
        ),
      ],
    ),
    sc(
      'a14-05-olives',
      [
        OD(
          'If I sleep by the river, the cold will finish me. If I go up into the woods, the wild animals might. I’ll risk the woods.',
          'think',
        ),
        N(
          'Just above the bank, two olive bushes grow from one root, one wild and one tame, so close that no rain or wind or sun gets in.',
        ),
        N(
          'Underneath, the dead leaves lie deep enough to cover two or three people in winter. Odysseus is glad to see them.',
        ),
        N(
          'He lies down in the middle and heaps leaves over himself, the way a farmer far from neighbours buries an ember in the ashes to keep it alive.',
        ),
        N(
          'There is room for you, and for your Nubbin, which burrows down until only its ears show.',
        ),
        OD(
          'Two olives from one root. My wife would say that meant something. Goodnight, guest.',
          'soft',
        ),
      ],
      [
        ask(
          1,
          'science',
          'plants survive hot, dry places with deep roots and small, tough leaves',
          '3-LS4-3',
          [
            N(
              'Olive trees grow where summers are hot and dry, and some live for hundreds of years. What helps a plant survive in hot, dry weather?',
            ),
          ],
          [
            o(
              'Deep roots, and small, tough leaves that lose little water.',
              [
                N(
                  'Yes. Olive roots reach far down for water, and the narrow, leathery leaves keep it from escaping. That is why olives thrive around the Mediterranean.',
                ),
              ],
              true,
            ),
            o('Huge, thin leaves that catch every drop.', [
              N(
                'Big thin leaves lose water fast in the sun. Olives do the opposite: small, tough leaves hold water in.',
              ),
            ]),
            o('Roots that stay right at the surface.', [
              N(
                'Surface roots dry out first. Olive roots go deep to find water that is still there when the surface is dry.',
              ),
            ]),
          ],
          'Learned how olive trees survive hot dry summers: deep roots and small, tough leaves.',
        ),
      ],
      [
        ch('watch', 'Keep watch for a while.', [
          N(
            'You keep watch. Nothing comes but an owl, which looks at your Nubbin’s ears and decides against it.',
          ),
        ]),
        ch('leaves', 'Pile more leaves over him.', [
          N(
            'You heap them up to his chin, but he’s already asleep. In his sleep he says a name, and it isn’t Calypso’s.',
          ),
        ]),
        ch('sleep', 'Sleep.', [N('You sleep. It’s the first sleep anyone has had in three days.')]),
      ],
    ),
    sc(
      'a14-05-complete',
      [
        N('Athena pours sleep over his eyes, to rest him from all his labour.'),
        N(
          'Up the hill there is a walled town, and a palace, and in the palace a girl is having a dream about washing.',
        ),
        N('It isn’t her own idea. It hardly ever is, with dreams.'),
        N('Your Nubbin, in the leaves, sneezes once and goes back to sleep.'),
      ],
      [
        ask(
          0,
          'health',
          'sleep lets the body and brain recover',
          'CASEL: Self-management',
          [N('Odysseus has hardly slept for days. What does sleep do for a tired body and mind?')],
          [
            o(
              'It lets the body repair itself, and the brain rest and sort out the day.',
              [
                N(
                  'Yes. While you sleep your body mends and your brain tidies up what you learned. Children of school age need about 9 to 12 hours a night.',
                ),
              ],
              true,
            ),
            o('Nothing. It is just a way to pass the time.', [
              N(
                'Sleep is busy work for the body, even while you lie still. Muscles mend, the brain stores memories, and you wake up better able to think and feel.',
              ),
            ]),
            o('It makes you older faster.', [
              N(
                'The reverse. Good sleep helps you grow and stay healthy. Not sleeping is what makes you feel old and grumpy.',
              ),
            ]),
          ],
          'Learned that sleep helps the body repair and the brain rest, and that school-age children need about 9 to 12 hours.',
        ),
      ],
    ),
  ],
  [
    gl('surf', 'Waves breaking and foaming as they hit the shore.', 'a14-05-swim'),
    gl('reef', 'A ridge of rock or coral just under or at the surface of the sea.', 'a14-05-swim'),
  ],
);

// ================================================================== A14-6 Nausicaa
const A6: EduQuest = quest(
  'a14-06',
  'Nausicaa',
  {
    'a14-06-s1': {
      goal: 'Help with the washing at the river.',
      hint: 'Carry the clothes from the cart to the washing-pools.',
    },
    'a14-06-s2': {
      goal: 'Stand by Nausicaa as the stranger comes out.',
      hint: 'Don’t run. Stay by the princess.',
    },
    'a14-06-s3': {
      goal: 'Follow the cart towards the town.',
      hint: 'Walk with the maids behind the cart, and stop at Athena’s grove.',
    },
  },
  [
    sc(
      'a14-06-river',
      [
        N(
          'Morning. Down the road comes a mule-cart piled with clothes, a girl on top holding the reins, and a crowd of maids walking beside it.',
        ),
        NA(
          'Last night I dreamt a friend came and scolded me. “You could be married any day, and all your clothes are dirty.” So.',
          'happy',
        ),
        N(
          'She looks at you, a stranger standing by her river. She seems to decide that strangers are allowed at rivers.',
        ),
        NA(
          'You can help, if you like. We tread the clothes in the pools. It’s a race. The maids always win.',
        ),
        N(
          'You tread the clothes with them. Your Nubbin treads too, in a smaller pool, and is very nearly washed.',
        ),
        N(
          'The clothes are spread on the clean pebbles to dry. The girls eat their lunch on the bank, take off their veils, and play ball.',
        ),
        NA('Catch!'),
      ],
      [
        ask(
          5,
          'science',
          'the Sun’s heat dries wet things as water turns to vapour',
          '4-PS3-2',
          [
            N(
              'The wet clothes are spread on warm pebbles in the sun, and by afternoon they are dry. Where did the water go?',
            ),
          ],
          [
            o(
              'It turned into invisible water vapour and mixed with the air.',
              [
                N(
                  'Yes. The Sun’s heat moves into the cloth and turns the water into a gas that floats away. That is called evaporation.',
                ),
              ],
              true,
            ),
            o('It soaked into the pebbles and stayed there.', [
              N(
                'The pebbles are only warmed. The water left the cloth as vapour, which is why a puddle on a sunny day shrinks too.',
              ),
            ]),
            o('It vanished for ever.', [
              N(
                'Nothing vanishes. The water turned into vapour, an invisible gas, and it will fall as rain one day.',
              ),
            ]),
          ],
          'Learned that the Sun’s heat evaporates water from wet clothes into the air.',
        ),
      ],
      [
        ch('catch', 'Catch it.', [
          N(
            'You catch it and throw it back, and she laughs. She is the tallest of them and the best at the game, and knows it.',
          ),
        ]),
        ch('nubbin', 'Let your Nubbin catch it.', [
          N('Your Nubbin catches it with its whole body and falls over backwards. It counts.'),
        ]),
        ch('drop', 'Drop it, on purpose.', [
          N(
            'You drop it, and everyone shrieks, delighted. Being bad at ball is very popular here.',
          ),
        ]),
      ],
    ),
    sc(
      'a14-06-river-done',
      [
        N(
          'Nausicaa throws the ball to a maid, misses, and it lands in the deep water. Every girl screams at once.',
        ),
        N('Up in the olive bushes, the leaves stir, and something gets up.'),
      ],
      [
        ask(
          1,
          'literacy',
          'infer from a small detail what is happening',
          'RL.3.3',
          [
            N(
              'The girls scream, and then “the leaves stir, and something gets up”. What is the writer hinting at?',
            ),
          ],
          [
            o(
              'Someone was lying hidden in the bushes, and the noise woke them.',
              [
                N(
                  'Yes. “Gets up” suggests a person: a clue to something the page hasn’t said outright. Good readers fill gaps like this.',
                ),
              ],
              true,
            ),
            o('Just the wind in the leaves.', [
              N(
                'The wind could stir leaves, but wind doesn’t “get up”. That phrase points to someone who was lying down.',
              ),
            ]),
            o('The ball falling out of a tree.', [
              N(
                'The ball landed in the water, not the bushes. The clue is that something got up, so someone was there.',
              ),
            ]),
          ],
          'Made an inference from a clue (“something gets up”) to work out someone was hiding.',
        ),
      ],
    ),
    sc(
      'a14-06-bushes',
      [
        N(
          'A man comes out of the bushes, crusted with salt, holding a leafy branch in front of him because he has nothing else.',
        ),
        N(
          'He looks like a mountain lion coming out of the rain. The maids scatter along the shore.',
        ),
        N(
          'Nausicaa doesn’t run: Athena has put courage into her. She stands and waits, with the ball still in her hand.',
        ),
        OD(
          'Lady, are you a goddess, or one of us? If a goddess, you’re Artemis, by your height. If mortal, your parents are lucky people.',
          'soft',
        ),
        OD(
          'Once, at Delos, I saw a young palm tree growing by Apollo’s altar. I stood and looked at it a long time. You remind me of it.',
        ),
        OD(
          'I’ve been twenty days on the sea. Show me the town, and give me a rag to wear, and may the gods give you all your heart’s wish.',
          'soft',
        ),
        N('He doesn’t come any closer. He stays exactly where he is, and asks from there.'),
      ],
      [
        ask(
          6,
          'sel',
          'think about whether to run or stay when a stranger appears',
          'CASEL: Responsible decision-making',
          [
            N(
              'When the stranger appeared, the maids ran, but Nausicaa stayed because he kept his distance and asked politely. What would you have done?',
            ),
          ],
          [
            o('Run like the maids. Being careful with strangers is sensible.', [
              N(
                'That’s a fair answer. Caution is wise. In real life, staying near other people and telling a trusted grown-up is a good plan.',
              ),
            ]),
            o('Stay like Nausicaa, because he kept back and asked politely.', [
              N(
                'That’s a fair answer. How he behaved mattered: he stayed far away and spoke gently. It was still brave, and she had friends close by.',
              ),
            ]),
            o('Stay back, but call the others to come and help.', [
              N(
                'That’s a fair answer. Having people near you, and getting help, is a clever middle way between running and facing a stranger alone.',
              ),
            ]),
          ],
          'Thought about how to respond when a stranger appears (a think question).',
        ),
      ],
      [
        ch('vouch', 'Tell her he’s a good man.', [
          NA(
            'You know him? Then he’s welcome. My father says every stranger at our door is sent by Zeus.',
          ),
        ]),
        ch('cloak', 'Pick up a clean cloak and hold it out.', [
          N(
            'You hold out a cloak from the drying stones. He takes it and bows to you, as if you had given him a kingdom.',
          ),
        ]),
        ch('wait', 'Stay back. It’s her choice.', [
          NA('You don’t look like a bad man. You look like a man who has had bad luck.'),
        ]),
      ],
    ),
    sc(
      'a14-06-bushes-done',
      [
        NA(
          'Come back, all of you! Since when do we run from a man in trouble? Give him oil, and clothes, and something to eat.',
        ),
        N(
          'He washes the salt off in the river, away from everyone. When he comes back up the bank he looks taller and younger, and the maids stare.',
        ),
      ],
      [
        ask(
          1,
          'health',
          'washing with clean water removes dirt and germs',
          'CASEL: Self-management',
          [
            N(
              'After days in the sea, Odysseus is crusted with salt and dirt. Why is washing with clean water, and soap when we have it, good for our bodies?',
            ),
          ],
          [
            o(
              'It washes away dirt and germs that could make us ill.',
              [
                N(
                  'Yes. Washing hands and bodies removes germs and keeps cuts from getting infected. That is why a good wash makes Odysseus look like a new man.',
                ),
              ],
              true,
            ),
            o('It makes you taller.', [
              N(
                'He only looks taller because he stands up straight now that he is clean and fed! Washing keeps us healthy, not taller.',
              ),
            ]),
            o('It isn’t important.', [
              N(
                'It is very important. Germs travel on dirty hands and skin, and washing is one of the best ways to stop illness spreading.',
              ),
            ]),
          ],
          'Learned that washing removes dirt and germs and helps prevent illness.',
        ),
      ],
    ),
    sc(
      'a14-06-road',
      [
        NA(
          'Listen. Walk with the maids behind the cart as far as the town fields. Then wait in Athena’s grove, outside the walls.',
        ),
        NA(
          'If people see me come home with a man like you, they’ll talk all winter. Give me time to get home first.',
        ),
        NA('Then ask anyone for the palace of Alcinous. Even a child could show you.'),
        NA(
          'Go past my father. Go straight to my mother. She’ll be sitting by the fire, spinning purple wool. Kneel to her.',
          'think',
        ),
        NA(
          'If she likes you, you’ll get home. Don’t ask me why it works like that. It just does.',
          'happy',
        ),
        N(
          'Odysseus listens like a man taking notes. He has plainly been given directions before, and lost ships ignoring them.',
        ),
      ],
      [
        ask(
          5,
          'social-studies',
          'put directions in order: first, next, then',
          'D2.Geo.2.K-2',
          [
            N(
              'Nausicaa gave Odysseus four steps: walk behind the cart; wait in Athena’s grove; ask for the palace; go straight to the queen. What does he do just before he asks anyone for the palace?',
            ),
          ],
          [
            o(
              'Wait in Athena’s grove',
              [
                N(
                  'Yes. The order matters: cart, grove, ask for the palace, then the queen. Giving directions in order, with “first”, “next” and “then”, makes them easy to follow.',
                ),
              ],
              true,
            ),
            o('Kneel to the queen', [
              N(
                'That is the last step. Before asking for the palace he waits in the grove outside the walls, so that Nausicaa gets home first.',
              ),
            ]),
            o('Walk behind the cart', [
              N(
                'That is the first step. He does that, then waits in the grove, and only then asks for the palace.',
              ),
            ]),
          ],
          'Put four directions in order and answered which step comes just before another.',
        ),
      ],
    ),
    sc(
      'a14-06-road-done',
      [
        N(
          'You wait in the poplar grove with him until sunset. He speaks quietly there to Athena, alone, and you walk off a little to give him room.',
        ),
      ],
      [
        ask(
          0,
          'sel',
          'give people privacy for things that matter to them',
          'CASEL: Social awareness',
          [
            N(
              'Odysseus wants to speak to Athena alone, so you walk away a little. Why is giving someone room a kind thing to do?',
            ),
          ],
          [
            o(
              'It shows you respect that some things are private.',
              [
                N(
                  'Yes. Letting someone have space when they need it tells them you trust them and respect what matters to them.',
                ),
              ],
              true,
            ),
            o('Because you’re bored of waiting.', [
              N(
                'Boredom isn’t the reason. Walking away is a way of saying: this is yours, and I won’t listen in.',
              ),
            ]),
            o('Because he told you to go.', [
              N(
                'He didn’t have to say it. Noticing when someone wants privacy, without being told, is part of being a good friend.',
              ),
            ]),
          ],
          'Thought about respecting privacy as a way of caring.',
        ),
      ],
    ),
    sc(
      'a14-06-complete',
      [
        N(
          'You go up into the town after dark. High walls, a harbour full of ships, and everyone you pass looks at you, and keeps walking.',
        ),
        N(
          'A girl with a water-jar shows you the way to the palace without being asked. She has grey eyes, and walks very lightly.',
        ),
        N('Odysseus thanks her. When he looks back, the lane is empty.'),
        OD(
          'She has been with me since Troy. And sometimes, for years, she hasn’t. I don’t ask why.',
          'soft',
        ),
      ],
      [
        ask(
          2,
          'literacy',
          'spot repeated clues to work out who someone is',
          'RL.3.3',
          [
            N(
              'This girl has grey eyes, walks very lightly, and vanishes. Earlier, Mentor also “walked too lightly for an old man”. Who do you think she is?',
            ),
          ],
          [
            o(
              'Athena, in disguise again',
              [
                N(
                  'Yes. Two clues that repeat, light steps and a sudden vanishing, point to Athena. A good reader keeps a list of clues like this.',
                ),
              ],
              true,
            ),
            o('Just a girl from the town', [
              N(
                'She might be, but an ordinary girl doesn’t vanish from an empty lane. The repeated clues point somewhere else: Athena.',
              ),
            ]),
            o('Nausicaa’s maid', [
              N(
                'A maid would head home, not disappear. And Odysseus says she has been with him since Troy. That points to Athena.',
              ),
            ]),
          ],
          'Used repeated clues (light steps, vanishing) to infer that the girl is Athena.',
        ),
      ],
    ),
  ],
  [
    gl(
      'evaporation',
      'When the Sun’s heat turns liquid water into an invisible gas called water vapour.',
      'a14-06-river',
    ),
  ],
);

// ================================================================== A14-7 The Phaeacian Hall
const A7: EduQuest = quest(
  'a14-07',
  'The Phaeacian Hall',
  {
    'a14-07-s1': {
      goal: 'Go into the king’s hall with him.',
      hint: 'Walk between the gold and silver dogs and in through the doors.',
    },
    'a14-07-s2': {
      goal: 'Sit at the feast and hear the bard.',
      hint: 'Sit on the bench beside Odysseus when the bard is led in.',
    },
    'a14-07-s3': {
      goal: 'Hear him say his name.',
      hint: 'Stay at the table while the hall waits.',
    },
  },
  [
    sc(
      'a14-07-hall',
      [
        N(
          'Walls of bronze with a blue band along the top, and doors of gold. On either side of the door sit dogs of gold and silver.',
        ),
        N(
          'A god made those dogs, so that they would never grow old and never die. They watch you go in.',
        ),
        N(
          'Behind the house is an orchard where the fruit never stops: pears and figs ripen while the next ones are still in flower.',
        ),
        N(
          'Odysseus walks through the hall wrapped in a mist that hides him. Nobody sees him until he is on his knees before the queen.',
        ),
        OD(
          'Arete, queen. I’ve come through great hardship to your knees, and your husband’s. Help me home. I’ve been so long away.',
          'sad',
        ),
        N('Then he sits down in the ashes by the hearth. The whole hall goes silent.'),
        N(
          'At last an old lord clears his throat and says what everyone is thinking: a stranger in the ashes is not right.',
        ),
        AC(
          'He’s right. Up, friend. Here, take my son’s chair, beside me. Bring water for his hands. Bring him dinner.',
          'soft',
        ),
      ],
      [
        ask(
          0,
          'science',
          'bronze is a mixture of two metals, copper and tin',
          '2-PS1-1',
          [
            N(
              'The walls are bronze, the doors gold, the dogs gold and silver. Bronze isn’t a metal you dig up. It is made by melting two metals together. Which two?',
            ),
          ],
          [
            o(
              'Copper and tin',
              [
                N(
                  'Yes. Mixing tin into copper makes bronze, which is harder than copper alone. A mixture of metals is called an alloy, and it can have better properties than its parts.',
                ),
              ],
              true,
            ),
            o('Gold and silver', [
              N(
                'Gold and silver are metals on their own here. Bronze is copper mixed with a little tin.',
              ),
            ]),
            o('Iron and wood', [
              N('Wood isn’t a metal. Bronze is copper melted together with tin.'),
            ]),
          ],
          'Learned that bronze is an alloy made by melting copper and tin together.',
        ),
      ],
    ),
    sc(
      'a14-07-hall-done',
      [
        AR(
          'Stranger. Who are you? Where did you get those clothes? I know them. I made them.',
          'think',
        ),
        OD(
          'Your daughter gave them to me. Don’t blame her for not bringing me home herself. Coming alone was my idea.',
        ),
        N(
          'It wasn’t his idea. You open your mouth, and close it again, and Arete sees you do it, and very nearly smiles.',
        ),
      ],
      [
        ask(
          2,
          'sel',
          'think about a kind not-quite-truth',
          'CASEL: Responsible decision-making',
          [
            N(
              'Odysseus says coming alone was his own idea, so that Nausicaa won’t be blamed. It wasn’t true. Is a kind not-quite-truth ever right?',
            ),
          ],
          [
            o('No. A lie is a lie, even a kind one. He could have told the truth gently.', [
              N(
                'That’s a fair answer. Honesty builds trust, and the truth can usually be told kindly if you take a moment to find the words.',
              ),
            ]),
            o('Sometimes, to protect someone from unfair blame.', [
              N(
                'That’s a fair answer. He wants to keep Nausicaa safe. Many people feel that is different from a lie told to get something for yourself.',
              ),
            ]),
            o('It depends whether it hurts anyone, and whether you’d tell the truth later.', [
              N(
                'That’s a thoughtful answer. People who think about it like this often decide a kind truth is better, and a kind secret is sometimes necessary.',
              ),
            ]),
          ],
          'Thought about whether a kind not-quite-truth can ever be right (a think question).',
        ),
      ],
    ),
    sc(
      'a14-07-bard',
      [
        N(
          'Next day there are games, and dancing, and a feast. The herald leads in the bard Demodocus, who is blind, and whom the Muse loves.',
        ),
        N(
          'They hang his lyre on a peg above his head, and guide his hand to it, so he can find it.',
        ),
        N(
          'He sings of Troy: of a quarrel between two great captains, and the long war. The Phaeacians love it; they have never been to a war.',
        ),
        N(
          'Odysseus draws his purple cloak up over his head to hide his face, so they won’t see him crying. Only the king notices.',
        ),
        N(
          'Later, Odysseus cuts the best piece of his own meat and sends it to the bard by the herald.',
        ),
        OD(
          'Sing the horse. The wooden horse. Sing it as it was, and I’ll tell everyone a god gave you your song.',
        ),
        N(
          'Demodocus sings it. The page lets you hear only the shape of it, a long rise and fall, and you are glad.',
        ),
        N(
          'Odysseus weeps as a woman weeps over her husband who fell defending his town. Nobody but the king sees.',
        ),
      ],
      [
        ask(
          2,
          'social-studies',
          'stories were sung and remembered before they were written',
          'D2.His.2.K-2',
          [
            N(
              'Homer’s great poems were first sung by bards like Demodocus, with no book at all. They were written down much later. How could a bard remember such long poems?',
            ),
          ],
          [
            o(
              'With a steady rhythm and phrases that come round again and again.',
              [
                N(
                  'Yes. Beats, patterns and phrases that come round again act like handholds for the memory. People still use the same trick with songs and times tables.',
                ),
              ],
              true,
            ),
            o('He read it from a scroll with his fingers.', [
              N(
                'Bards in Homer’s day sang from memory. Writing wasn’t used for long poems then. They used rhythm and repeated phrases to remember.',
              ),
            ]),
            o('Someone whispered every word to him.', [
              N(
                'Bards learned poems over years, from other bards. Patterns and rhythm helped them hold all those words in their heads.',
              ),
            ]),
          ],
          'Learned that Homer’s poems were sung and remembered before they were written, using rhythm and repeated phrases.',
        ),
      ],
      [
        ch('hide', 'Sit closer, so he’s hidden on your side.', [
          N(
            'You shift along the bench so that from your side nobody can see his face. He leans, very slightly, against your shoulder.',
          ),
        ]),
        ch('nubbin', 'Let your Nubbin climb into his lap.', [
          N(
            'Your Nubbin climbs into his lap and sits there, under the cloak. He puts a hand on it and leaves it there.',
          ),
        ]),
        ch('listen', 'Listen to the bard.', [
          N(
            'You listen. Once, Demodocus’s blind face turns towards Odysseus, as if he can hear more than the music.',
          ),
        ]),
      ],
    ),
    sc(
      'a14-07-bard-done',
      [
        AC('Stop the song, Demodocus. Not everyone is enjoying it.'),
        AC(
          'Stranger, you’ve wept twice at songs of Troy. Tell us who you are. Nobody is nobody.',
          'soft',
        ),
      ],
      [
        ask(
          1,
          'sel',
          'crying is a normal way to let a feeling out',
          'CASEL: Self-awareness',
          [
            N(
              'Odysseus hid his face when the song made him cry. Is it all right to cry when a story reminds you of something sad?',
            ),
          ],
          [
            o(
              'Yes. Tears are a normal way of letting a big feeling out.',
              [
                N(
                  'Yes. Crying is nothing to be ashamed of. Many people feel better afterwards, and a friend sitting nearby can help.',
                ),
              ],
              true,
            ),
            o('No. Grown-ups should never cry.', [
              N(
                'Grown-ups cry too, and Odysseus is a very brave man. Crying isn’t weakness. It is what a big feeling does when it needs somewhere to go.',
              ),
            ]),
            o('Only when nobody is looking.', [
              N(
                'Some people like privacy when they cry, and that’s fine. But it’s also fine to cry with someone who cares about you.',
              ),
            ]),
          ],
          'Learned that crying is a normal way to release a big feeling, for children and grown-ups.',
        ),
      ],
    ),
    sc(
      'a14-07-name',
      [
        N(
          'He wipes his face. He looks round the hall at the gold, the lamps, the long tables, and at you.',
        ),
        OD('Where do I start? There is so much of it.', 'think'),
        OD(
          'With the name, then. I am Odysseus, son of Laertes. Men know me for my tricks. My fame has gone up as high as heaven, they tell me.',
        ),
        OD(
          'I live on Ithaca, an island you can see from a long way off. It is all rock and goats. It grows good people. Nothing is sweeter to me.',
        ),
        N('The Phaeacians lean in. That name was sung in this hall today, and here is the man.'),
        AC(
          'Odysseus. Here, in my hall. Then tell it. All of it. The night is long, and nobody here is going to sleep.',
          'shock',
        ),
        AC('And you, the other guest. You came in with him. Where are you from?'),
      ],
      [
        ask(
          2,
          'literacy',
          'the same story can use different names in different languages',
          'L.3.4',
          [
            N(
              'Many older English books call him Ulysses instead of Odysseus. Why do you think that is?',
            ),
          ],
          [
            o(
              'Roman writers used Latin forms of Greek names, and translators often kept them.',
              [
                N(
                  'Yes. The Romans told the story in Latin, where Odysseus was Ulixes, and English made that Ulysses. Athena was matched with their own goddess, Minerva.',
                ),
              ],
              true,
            ),
            o('Ulysses was a different man.', [
              N(
                'Same man, same story. Latin has its own version of each Greek name, as languages often do: John is Juan in Spanish and Jean in French.',
              ),
            ]),
            o('He changed his name on the way home.', [
              N(
                'He’s Odysseus on every page here. Ulysses is just the Latin form of his name, used by Roman writers and later translators.',
              ),
            ]),
          ],
          'Learned that Ulysses is the Latin form of Odysseus, and that names change between languages.',
        ),
      ],
      [
        ch('grove', '“A valley called the Grove. It’s small.”', [
          AC('Small places make the best guests. They know what it is to be far from home.'),
        ]),
        ch('gate', '“Somewhere with a gate that sticks.”', [
          OD('A gate that sticks. Then whoever’s at home will always hear you coming.'),
        ]),
        ch('later', '“Let him go first. It’s his story.”', [
          AC('Spoken like a good guest. Very well. Odysseus, begin.'),
        ]),
      ],
    ),
    sc(
      'a14-07-complete',
      [
        OD(
          'I’ll start with the giant. That’s where it all went wrong. And it was my own fault.',
          'sad',
        ),
        N(
          'He begins. As he talks the lamps go dim, and the hall goes soft at the edges, the way the meeting-place did.',
        ),
        N(
          'The tables become rocks. The smell of roast meat becomes the smell of sheep: a great many sheep.',
        ),
        N('This is what Nova’s atlas does when someone tells a story on its pages. You go in.'),
        N(
          'Your Nubbin takes hold of the hem of your tunic, the way it does when it isn’t sure about a place.',
        ),
      ],
      [
        ask(
          1,
          'science',
          'a wick soaks up oil so a lamp can burn steadily',
          '4-PS3-2',
          [
            N(
              'The lamps in the hall burn olive oil. A twisted cloth called a wick dips into the oil. What does the wick do?',
            ),
          ],
          [
            o(
              'It soaks up oil and feeds it slowly to the flame.',
              [
                N(
                  'Yes. Oil creeps up through the tiny gaps in the wick, and the flame burns it a little at a time. No wick, no steady light.',
                ),
              ],
              true,
            ),
            o('It makes the light by itself.', [
              N(
                'The wick doesn’t shine. The flame does, and it needs fuel. The wick carries oil up to it.',
              ),
            ]),
            o('It keeps the oil cold.', [
              N(
                'A lamp wants the oil to burn. The wick draws it upwards so that the flame can use it.',
              ),
            ]),
          ],
          'Learned that a lamp wick soaks up oil and feeds it to the flame.',
        ),
      ],
    ),
  ],
  [
    gl('bard', 'A poet who sings or tells long stories from memory.', 'a14-07-bard'),
    gl(
      'herald',
      'A messenger and announcer who calls people together and carries news.',
      'a14-07-bard',
    ),
  ],
);

// ================================================================== A14-8 Nobody
const A8: EduQuest = quest(
  'a14-08',
  'Nobody',
  {
    'a14-08-s1': {
      goal: 'Go into the giant’s cave with Odysseus and his men.',
      hint: 'Climb up to the cave in the cliff above the shore.',
    },
    'a14-08-s2': {
      goal: 'Give the giant the wine.',
      hint: 'Carry the bowl of wine to the giant after his dinner.',
    },
    'a14-08-s3': {
      goal: 'Get out of the cave under the rams.',
      hint: 'Hold on under the woolly rams as the giant lets the flock out.',
    },
    'a14-08-s4': {
      goal: 'Decide what to do when he shouts.',
      hint: 'Answer him, or don’t, before he fills his lungs.',
    },
  },
  [
    sc(
      'a14-08-cave',
      [
        N(
          'A wild coast, and a cave high above the sea, with laurels over the mouth. Odysseus has brought twelve men, and you.',
        ),
        N(
          'Inside are racks of cheeses, pens crowded with lambs and kids, and every bucket brimming with whey. Nobody is at home.',
        ),
        SA(
          'Take the cheeses, captain. Take some lambs. And let’s go, now, before whoever lives here comes back.',
        ),
        OD('No. I want to see him. He might give us a guest-gift.', 'think'),
        N(
          'He comes home at evening: a giant with one eye, carrying a load of dry wood. He throws it down so hard that you all run to the back of the cave.',
        ),
        N(
          'He drives in his flock and rolls a stone across the doorway. Twenty-two wagons couldn’t shift that stone.',
        ),
        CY('Strangers. Who are you? Traders? Or pirates, roving the sea?'),
        OD(
          'Greeks, coming home from Troy. We’re at your knees. Give us a guest-gift, as is right. Zeus watches over strangers.',
        ),
        CY(
          'You’re a fool, stranger. We Cyclopes don’t care for Zeus. We’re stronger than he is.',
          'angry',
        ),
        N(
          'Two of the men die that night. The page goes dark for it, and Odysseus puts a hand over your eyes, so you don’t see.',
        ),
      ],
      [
        ask(
          9,
          'sel',
          'what helps when you are very frightened or sad',
          'CASEL: Self-management',
          [
            N(
              'Your Nubbin’s heart is going like a bird’s, and it is very sad about the two men too. When we are frightened or sad, what helps?',
            ),
          ],
          [
            o(
              'A slow breath, and staying close to someone safe.',
              [
                N(
                  'Yes. Slow breathing calms the body, and a safe friend beside you helps even more. It’s also all right to feel sad and scared together.',
                ),
              ],
              true,
            ),
            o('Pretending nothing is wrong.', [
              N(
                'Pretending can’t make a feeling go away. It’s better to say “I’m scared” or “I’m sad” out loud to someone you trust.',
              ),
            ]),
            o('Running away blindly.', [
              N(
                'Running without a plan can make things worse, and here there is nowhere to run. Calm breathing and staying together is wiser.',
              ),
            ]),
          ],
          'Learned ways to cope when frightened or sad: slow breathing, staying near someone safe, and saying how you feel.',
        ),
      ],
      [
        ch('hide', 'Hide your Nubbin inside your tunic.', [
          N('You tuck it inside your tunic. You can feel its heart going like a bird’s.'),
        ]),
        ch('stand', 'Stand next to Odysseus.', [
          N(
            'You stand next to him. He doesn’t look at you, but he moves half a step, so that he is between you and the fire.',
          ),
        ]),
      ],
    ),
    sc(
      'a14-08-cave-done',
      [
        N(
          'Odysseus’s hand goes to his sword, and stops. If the giant dies, nobody can move the stone, and you are all shut in for ever.',
        ),
        OD('Not like that. Think.', 'think'),
      ],
      [
        ask(
          1,
          'science',
          'test each possible solution against the problem before choosing',
          '3-5-ETS1-2',
          [
            N(
              'The problem is the stone across the door. Odysseus thinks of attacking the giant at once. Why would that not solve the problem?',
            ),
          ],
          [
            o(
              'Nobody else can move the stone, so they would be trapped.',
              [
                N(
                  'Yes. Good designers test each idea against the problem. Attacking fails the test: it leaves the stone in place and the men shut in.',
                ),
              ],
              true,
            ),
            o('Because swords never work.', [
              N(
                'Swords are fine. The trouble is the stone: if the giant dies, nobody can move it, and the men would be shut in.',
              ),
            ]),
            o('Because the giant is friendly.', [
              N(
                'He is not friendly at all. The reason is the stone: only the giant can move it, so they need a way out that keeps him alive.',
              ),
            ]),
          ],
          'Compared a possible solution with the problem’s limits (the stone) and saw why it would fail.',
        ),
      ],
    ),
    sc(
      'a14-08-wine',
      [
        N(
          'Next day, while the giant is out with his flock, Odysseus finds a great club of green olive wood lying by the pens.',
        ),
        N(
          'He has the men cut a length off it, smooth it, sharpen the end and harden it in the fire. They hide it in the straw.',
        ),
        N(
          'At evening the giant comes home. Odysseus fills a bowl with the dark wine he brought from the ship.',
        ),
        OD('Here, Cyclops. Have some wine, after your dinner.'),
        CY(
          'More. Give me more. And tell me your name, so I can give you a guest-gift you’ll like.',
          'happy',
        ),
        OD('My name is Nobody. It always has been. Ask anyone at home.', 'think'),
        CY(
          'Then here is your gift, Nobody. You’ll be the last. I’ll keep you till the very end.',
          'happy',
        ),
        N('He falls over on his back and sleeps, with his great neck bent sideways.'),
      ],
      [
        ask(
          5,
          'literacy',
          'a word can be a name or an ordinary word, which can make a trick',
          'L.3.4',
          [
            N(
              'Odysseus calls himself Nobody. Imagine the giant later shouts to his neighbours, “Nobody is hurting me!” What will the neighbours think?',
            ),
          ],
          [
            o(
              'That no one at all is hurting him, so he doesn’t need help.',
              [
                N(
                  'Yes. “Nobody” can be a name or mean “no person”, and the neighbours hear the second meaning. A word with two uses can make a clever trick.',
                ),
              ],
              true,
            ),
            o('That a man called Nobody is hurting him.', [
              N(
                'That is what the giant means. But his neighbours have never heard of a man called Nobody, so they take the plain meaning: no one.',
              ),
            ]),
            o('That he is making it up for fun.', [
              N(
                'They might suspect it, but the words tell them there’s no attacker. A word with two meanings is what makes the trick work.',
              ),
            ]),
          ],
          'Saw how a word with two meanings (a name and “no person”) can create a trick.',
        ),
      ],
    ),
    sc(
      'a14-08-wine-done',
      [
        N(
          'What happens next is quick, and the page won’t show it. There is the olive stake, and the fire, and then a roar that shakes the hill.',
        ),
        N(
          'Your Nubbin presses its face into your side. Afterwards, nobody on the ship ever talks about it.',
        ),
      ],
      [
        ask(
          0,
          'science',
          'heating can change a material for good',
          '2-PS1-4',
          [
            N(
              'The men hardened the tip of the wooden stake in a fire. The fire dried and charred the wood so that it was tougher. Could the charred wood turn back into soft, fresh wood?',
            ),
          ],
          [
            o(
              'No. Burning changes wood for good.',
              [
                N(
                  'Yes. Some changes can be undone, like melting ice, but burning can’t. Once wood is charred it can never go back to fresh wood.',
                ),
              ],
              true,
            ),
            o('Yes, if you soak it in water.', [
              N(
                'Water can’t undo charring. Melting and freezing are changes that can reverse, but burning changes the material for good.',
              ),
            ]),
            o('Yes, if you wait a year.', [
              N(
                'Waiting doesn’t help. Burning makes new materials, such as charcoal and ash, and they can’t turn back into wood.',
              ),
            ]),
          ],
          'Learned that heating can change a material permanently, as when fire chars wood.',
        ),
      ],
    ),
    sc(
      'a14-08-rams',
      [
        N(
          'The other Cyclopes come out of their caves in the night, and stand outside the stone, and shout.',
        ),
        CS('Polyphemus! What’s wrong? Is someone stealing your sheep? Is someone hurting you?'),
        CY('Nobody! Nobody is hurting me!', 'angry'),
        CS(
          'If nobody’s hurting you, it’s a sickness sent by Zeus, and we can’t help with that. Ask your father, Poseidon.',
        ),
        N(
          'They go home. Inside, in the dark, Odysseus laughs once, very quietly, at his own cleverness.',
        ),
        N(
          'In the morning the giant sits in the doorway with his arms out, feeling for anyone slipping past among the sheep.',
        ),
        N(
          'Odysseus ties the rams together in threes with willow, with a man under every middle one. He takes the biggest ram for himself.',
        ),
        N(
          'Your Nubbin goes under a lamb, holding its wool in all four paws. You hang under a ram with your face in the fleece.',
        ),
        CY(
          'Old ram. Why are you last out today? You’re always first to the grass. Are you sad for me?',
          'sad',
        ),
        N(
          'The ram goes out slowly, with Odysseus underneath. The giant’s hand passes over its back, and he doesn’t think to feel below.',
        ),
      ],
      [
        ask(
          6,
          'maths',
          'equal groups of three',
          '3.OA.A.1',
          [
            N(
              'Each trio is three rams tied together, with one man hanging under the middle ram. If four men escape this way, how many rams are in the four trios altogether?',
            ),
          ],
          [
            o(
              '12 rams',
              [N('Yes. Four groups of three: 3 + 3 + 3 + 3 = 12, or 4 × 3 = 12.')],
              true,
            ),
            o('7 rams', [
              N(
                'That is 4 + 3. Each of the four men has a trio of three rams, so it is four groups of three: 4 × 3 = 12.',
              ),
            ]),
            o('9 rams', [
              N('That is three trios. With four men there are four trios: 3 + 3 + 3 + 3 = 12.'),
            ]),
          ],
          'Used equal groups (4 groups of 3) to find 12.',
        ),
      ],
    ),
    sc(
      'a14-08-rams-done',
      [
        N(
          'Out in the daylight you let go and run, driving the fat sheep down to the ship. The men left aboard see how few you are, and weep.',
        ),
        OD('No crying. Row. Row now.', 'angry'),
      ],
      [
        ask(
          0,
          'science',
          'wool traps air, which keeps a sheep warm',
          '4-LS1-1',
          [
            N(
              'You hid in thick wool to escape. A sheep’s fleece is made of fibres that trap tiny pockets of air. What does trapped air do for the sheep?',
            ),
          ],
          [
            o(
              'It keeps the sheep warm, because trapped air stops heat leaking away.',
              [
                N(
                  'Yes. Air is a poor carrier of heat, so a layer of trapped air works like a blanket. People spin wool for the same reason.',
                ),
              ],
              true,
            ),
            o('It makes the sheep float.', [
              N(
                'Wool doesn’t make sheep float. The trapped air is a blanket that holds the sheep’s warmth in.',
              ),
            ]),
            o('It makes the wool smell.', [
              N(
                'Smell has nothing to do with it. The trapped air keeps the sheep warm in cold weather.',
              ),
            ]),
          ],
          'Learned that wool traps air, which insulates a sheep and keeps it warm.',
        ),
      ],
    ),
    sc(
      'a14-08-shout',
      [
        N(
          'The ship pulls away. When it is as far out as a shout will carry, Odysseus stands up in the stern.',
        ),
        OD(
          'Cyclops! You should have been kinder to your guests. Zeus and the other gods have paid you back.',
          'angry',
        ),
        N(
          'The giant tears the top off a hill and throws it. It lands just ahead of the bow, and the wave washes you back towards the shore.',
        ),
        SA('Captain, stop! Don’t make him angrier! He nearly had us!', 'shock'),
        N(
          'The men pull at the oars and beg him under their breath. He doesn’t hear them, or won’t.',
        ),
        N('He is filling his chest with air again. You can see the name in his mouth, ready.'),
      ],
      [
        ask(
          5,
          'sel',
          'think about acting on anger and what it might cost',
          'CASEL: Self-management',
          [
            N(
              'Odysseus is about to shout his real name, though his men beg him not to. Why might someone do something they know could cost them? What would you have done?',
            ),
          ],
          [
            o('Pride. He wants everyone to know how clever he was.', [
              N(
                'That’s a fair answer. Pride can be powerful. It’s worth asking whether being known is worth the risk.',
              ),
            ]),
            o('Anger. He is too furious to stop and think.', [
              N(
                'That’s a fair answer. When we are angry, our thinking brain slows down. A slow breath before you speak or shout gives it time to catch up.',
              ),
            ]),
            o('I’d ask him to wait until they are safely away.', [
              N(
                'That’s a fair answer. A pause often costs nothing and saves a lot. Odysseus’s men would agree with you.',
              ),
            ]),
          ],
          'Thought about acting on anger or pride and what it can cost (a think question).',
        ),
      ],
      [
        ch(
          'dont',
          'Ask him not to.',
          [
            Y('Don’t. Please. Let him go on calling you Nobody.'),
            OD('You’re right. You’re right, and I can’t. I want him to know who did it.'),
          ],
          { 'a14-name': 'dont' },
        ),
        ch(
          'shout',
          'Shout with him.',
          [
            N(
              'You stand up beside him and fill your chest too. Whatever he shouts, you’ll shout it with him.',
            ),
            OD('Ha! There. A crew of one, at least.'),
          ],
          { 'a14-name': 'shout' },
        ),
        ch(
          'silence',
          'Say nothing.',
          [
            N(
              'You say nothing. He glances at you, and sees that you know exactly what he’s about to do, and what it will cost.',
            ),
            N('He does it anyway.'),
          ],
          { 'a14-name': 'silence' },
        ),
      ],
    ),
    sc(
      'a14-08-shout-done',
      [
        OD(
          'Cyclops! If anyone ever asks who did this to you, tell them Odysseus. Odysseus, son of Laertes, of Ithaca!',
          'angry',
        ),
        N(
          'There is a silence on the shore. Then the giant lifts his hands to the sky and calls on his father, Poseidon.',
        ),
        CY(
          'Father, if I am your son, let him never come home. Or if he must, let him come late, alone, on a stranger’s ship, to trouble in his house.',
          'angry',
        ),
        N(
          'Another rock, bigger. It lands behind the stern this time, and the wave pushes you out to sea.',
        ),
      ],
      [
        ask(
          1,
          'literacy',
          'Cyclops comes from Greek words for circle and eye',
          'L.3.4',
          [
            N(
              'Cyclops comes from two Greek words: kyklos, “circle”, and ops, “eye”. So a Cyclops is a round-eyed giant. Which of these words also comes from kyklos?',
            ),
          ],
          [
            o(
              'bicycle',
              [
                N(
                  'Yes. A bicycle has two wheels, and wheels are circles. Words like cycle and cyclone come from kyklos too.',
                ),
              ],
              true,
            ),
            o('bicker', [
              N(
                'Bicker has nothing to do with circles. It means to quarrel. The word from kyklos is bicycle, with its two round wheels.',
              ),
            ]),
            o('bacon', [
              N(
                'Bacon comes from an old word for a pig’s back. The word with circles in it is bicycle.',
              ),
            ]),
          ],
          'Learned that Cyclops and bicycle share a Greek root meaning circle.',
        ),
      ],
    ),
    sc(
      'a14-08-complete',
      [
        N(
          'They row on, glad to be alive and sorry for the friends they lost. Nobody speaks for a long time.',
        ),
        N(
          'That evening Odysseus sits apart in the stern with his knife and a split piece of oar, carving.',
        ),
        OD(
          'Here. For the little one. It got out under a lamb, which is more than its share of courage.',
          'soft',
        ),
        N('It is a small board with one word cut into it: Nobody.'),
        OD('Somebody ought to get some good out of that name. I won’t be using it again.', 'think'),
      ],
      [
        ask(
          3,
          'social-studies',
          'the Greek alphabet gave us the word alphabet',
          'D2.His.2.K-2',
          [
            N(
              'Odysseus’s word would have been cut in Greek letters. The first two letters of the Greek alphabet are alpha and beta. Which English word comes from them?',
            ),
          ],
          [
            o(
              'alphabet',
              [
                N(
                  'Yes. Alpha plus beta gives alphabet. The Greeks borrowed their letters from traders from the east, and the alphabet we use today grew from theirs.',
                ),
              ],
              true,
            ),
            o('abacus', [
              N(
                'An abacus is a counting frame, from a different old word. The word made from alpha and beta is alphabet.',
              ),
            ]),
            o('beta-carrot', [
              N(
                'That one is a made-up word! The real one that comes from alpha and beta is alphabet.',
              ),
            ]),
          ],
          'Learned that the word alphabet comes from alpha and beta, the first two Greek letters.',
        ),
      ],
    ),
  ],
  [
    gl('whey', 'The watery liquid left over when milk is made into cheese.', 'a14-08-cave'),
    gl(
      'Cyclops',
      'A one-eyed giant in Greek stories. The word means “circle-eye”.',
      'a14-08-shout-done',
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
      hint: 'Go up to Aeolus’s hall inside the bronze wall.',
    },
    'a14-09-s2': {
      goal: 'Keep watch on the bag while he sleeps.',
      hint: 'Stay by the hold, near the silver thread.',
    },
    'a14-09-s3': {
      goal: 'Go back to Aeolus and ask again.',
      hint: 'Follow Odysseus up to the hall.',
    },
  },
  [
    sc(
      'a14-09-aeolia',
      [
        N(
          'The island of Aeolus floats on the sea. A wall of bronze runs all the way round it, and sheer cliffs rise above the wall.',
        ),
        N(
          'Aeolus, keeper of the winds, lives there with his wife and their twelve children. Every day they feast; every night they sleep on soft rugs.',
        ),
        AE(
          'Troy! Tell me about Troy again. The horse part. And the ships. Tell me every part.',
          'happy',
        ),
        N(
          'Odysseus tells it, for a whole month. He is a very good teller, and Aeolus a very good listener.',
        ),
        N('Your Nubbin sleeps through most of it, on a different rug every night.'),
        AE('Now. You want to go home. Watch.'),
        N(
          'He takes the hide of a nine-year-old ox, and into it he ties all the howling winds. He binds the neck with a shining silver thread.',
        ),
        N(
          'He stows it in the hold himself, so not a breath leaks out. Only the west wind he leaves free, to blow you home.',
        ),
        AE('Don’t open it. Not for anything. Do you understand me?', 'think'),
      ],
      [
        ask(
          6,
          'science',
          'wind is air on the move, started by warming air',
          '4-PS3-2',
          [
            N(
              'Aeolus ties the winds into a bag. In real life, wind is air on the move. When the Sun warms some air it rises, and cooler air rushes in to fill the space. What is wind?',
            ),
          ],
          [
            o(
              'Air that is moving',
              [
                N(
                  'Yes. Warm air rises, cool air rushes in, and that moving air is wind. It is a push you can’t see but can feel on a sail.',
                ),
              ],
              true,
            ),
            o('Clouds being pushed along', [
              N(
                'Clouds are pushed by the wind, but wind itself is the moving air. You can’t see it, only what it moves.',
              ),
            ]),
            o('The sea breathing out', [
              N(
                'A nice picture, but the sea isn’t breathing. Wind is air on the move, started by warm air rising and cool air rushing in.',
              ),
            ]),
          ],
          'Learned that wind is moving air, started when warm air rises and cooler air moves in.',
        ),
      ],
      [
        ch('promise', '“We won’t.”', [AE('Good guest. Off you go, then.')]),
        ch('inside', 'Ask what’s inside, exactly.', [
          AE('Every wind there is, but one. Try not to let them out. They don’t go back in.'),
        ]),
        ch('sniff', 'Let your Nubbin sniff the bag.', [
          N(
            'Your Nubbin sniffs the bag. Its ears blow straight back, and stay that way for an hour.',
          ),
        ]),
      ],
    ),
    sc(
      'a14-09-aeolia-done',
      [
        N(
          'The west wind fills the sail. Odysseus takes the steering oar, and won’t give it to anyone else.',
        ),
      ],
      [
        ask(
          0,
          'social-studies',
          'winds are named for where they come from, so a west wind blows towards the east',
          'D2.Geo.2.K-2',
          [
            N(
              'A west wind blows from the west, towards the east. Ithaca lies east of the floating island. Why is a west wind just right for sailing home?',
            ),
          ],
          [
            o(
              'It blows towards the east, the way they want to go.',
              [
                N(
                  'Yes. Winds are named for where they come from, so a west wind pushes things east. Sailors have always used that to plan their routes.',
                ),
              ],
              true,
            ),
            o('It blows towards the west, the way they came.', [
              N(
                'A west wind comes from the west, so it blows towards the east. That is the direction of Ithaca.',
              ),
            ]),
            o('It blows straight up.', [
              N(
                'Wind blows along the ground and sea. A west wind comes from the west and pushes towards the east, which is where home is.',
              ),
            ]),
          ],
          'Learned that winds are named for where they come from: a west wind blows towards the east.',
        ),
      ],
    ),
    sc(
      'a14-09-bag',
      [
        N(
          'Nine days and nine nights he steers. He won’t let anyone take a turn, because he wants to get home faster.',
        ),
        N(
          'On the tenth day, land. You can see men on Ithaca tending their fires, and the smoke going up.',
        ),
        OD('That’s it. That’s home. That rock, there, look. I can see the—', 'happy'),
        N(
          'He sits down against the stern and falls asleep in the middle of the sentence. He has been awake for nine days.',
        ),
        N('Down in the middle of the ship, the crew are whispering, and looking at the hold.'),
        SA(
          'Everywhere he goes, people give him presents. And what do we get? What’s in that bag, eh? Gold. Silver.',
        ),
        SA('Let’s have a look. Just a look. He’d share it if he were awake.'),
      ],
      [
        ask(
          6,
          'sel',
          'think about secrets, suspicion and keeping your word',
          'CASEL: Responsible decision-making',
          [
            N(
              'Odysseus never told the crew what was in the bag, so they guessed it was treasure and felt left out. Was it his fault, theirs, or both?',
            ),
          ],
          [
            o('His fault. Keeping secrets from friends breeds suspicion.', [
              N(
                'That’s a fair answer. When people are kept in the dark, they often fill the gap with the worst guess.',
              ),
            ]),
            o('Theirs. The bag wasn’t theirs to open.', [
              N(
                'That’s a fair answer. Feeling left out is hard, but opening something that isn’t yours breaks trust.',
              ),
            ]),
            o('Both. He should have told them, and they should have asked.', [
              N(
                'That’s a thoughtful answer. Usually trouble like this is shared: one side says too little, the other acts too soon.',
              ),
            ]),
          ],
          'Thought about secrets and suspicion, and whose fault the opened bag was (a think question).',
        ),
      ],
      [
        ch('wind', '“It’s the winds. It’s only the winds.”', [
          SA('Course it is. And I’m a Cyclops. Move over.'),
          N('They don’t believe you, and why would they? Nobody ties up wind.'),
        ]),
        ch('wake', 'Try to wake Odysseus.', [
          N(
            'You shake him, and he says something about goats, and doesn’t wake. Nine days is a long time.',
          ),
        ]),
        ch('sit', 'Sit on the bag.', [
          N(
            'You sit on the bag, and your Nubbin sits on you. Two sailors lift you both off, quite gently, and set you down out of the way.',
          ),
        ]),
      ],
    ),
    sc(
      'a14-09-bag-done',
      [
        N('They untie the silver thread. Every wind in the world comes out at once.'),
        N(
          'The sky goes black and the ship spins round. Ithaca goes small behind you, and then you can’t see it at all.',
        ),
        N(
          'He wakes, and sees, and lies down in the bottom of the ship with his cloak over his face, and doesn’t get up for a long time.',
        ),
      ],
      [
        ask(
          1,
          'science',
          'sailors measure wind strength on the Beaufort scale from 0 to 12',
          '4-PS3-2',
          [
            N(
              'Sailors measure wind on the Beaufort scale, from 0 for calm to 12 for a hurricane. With every wind at once, which number is the ship closest to?',
            ),
          ],
          [
            o(
              '12',
              [
                N(
                  'Yes. Force 12 is a hurricane, with winds above 118 kilometres an hour. That would toss a small ship like a leaf.',
                ),
              ],
              true,
            ),
            o('0', [
              N(
                'Force 0 is a flat calm, with no wind at all. Every wind at once is the opposite end of the scale.',
              ),
            ]),
            o('6', [
              N(
                'Force 6 is a strong breeze, which a ship can handle. Every wind in the world at once would be far worse.',
              ),
            ]),
          ],
          'Learned the Beaufort scale from 0 (calm) to 12 (hurricane) and used it to judge wind strength.',
        ),
      ],
    ),
    sc(
      'a14-09-again',
      [
        N(
          'The winds blow you all the way back to the floating island. Odysseus walks up to the hall with one man, and you.',
        ),
        N('Aeolus is at dinner with his family. He sees who it is, and stands up.'),
        AE('Odysseus? What happened? We sent you off with everything you needed.', 'shock'),
        OD('My crew did it. My crew, and my own sleep. Help us. Just once more.', 'sad'),
        AE(
          'Go. Leave my island. When the gods are set against a man like this, I daren’t help him.',
          'angry',
        ),
        N(
          'Nobody offers you dinner. It is the first door in this story that has been shut in your face.',
        ),
      ],
      [
        ask(
          3,
          'sel',
          'own a mistake instead of blaming others',
          'CASEL: Responsible decision-making',
          [N('Odysseus blames his crew and his own sleep. What is a good way to own a mistake?')],
          [
            o(
              'Say what happened, say sorry, and ask how to put it right.',
              [
                N(
                  'Yes. Owning a mistake means telling the truth about it, saying sorry, and offering to mend what you can. Odysseus’s own sleep is partly his to own.',
                ),
              ],
              true,
            ),
            o('Blame someone else so you feel better.', [
              N(
                'That might feel better for a minute, but it makes others trust you less. Owning your part is stronger.',
              ),
            ]),
            o('Hide and hope nobody notices.', [
              N(
                'Hidden mistakes usually get found, and they grow. Telling the truth early is almost always easier.',
              ),
            ]),
          ],
          'Learned how to own a mistake: tell the truth, say sorry, offer to put it right.',
        ),
      ],
      [
        ch('go', 'Go quietly.', [
          N(
            'You go quietly. At the door Aeolus’s youngest daughter slips your Nubbin a fig, and says nothing.',
          ),
        ]),
        ch('plead', 'Ask once more, for the crew.', [AE('No. I’m sorry. No.')]),
      ],
    ),
    sc(
      'a14-09-complete',
      [
        N(
          'No wind now: they row, day after day. The men don’t look at Odysseus, and he doesn’t look at them.',
        ),
        N(
          'After a harbour of giants that nobody will talk about, there is only one ship left of all the ships they had.',
        ),
        OD('I was so close I could see the smoke from their fires.', 'sad'),
        OD('That’s the worst of it. Not that it was far. That it was close.', 'sad'),
      ],
      [
        ask(
          2,
          'maths',
          'multiply days by 24 hours',
          '3.OA.A.3',
          [
            N(
              'Odysseus steered for nine days and nights without a break. There are 24 hours in a day. How many hours is that?',
            ),
          ],
          [
            o(
              '216 hours',
              [
                N(
                  'Yes. 9 × 24 = (9 × 20) + (9 × 4) = 180 + 36 = 216 hours. No wonder he fell asleep.',
                ),
              ],
              true,
            ),
            o('33 hours', [
              N('That is 9 + 24. Nine days of 24 hours each means multiplying: 9 × 24 = 216.'),
            ]),
            o('192 hours', [
              N('That is 8 × 24, eight days. For nine days add another 24: 192 + 24 = 216.'),
            ]),
          ],
          'Multiplied 9 × 24 to find that nine days is 216 hours.',
        ),
      ],
    ),
  ],
  [gl('hold', 'The space inside a ship where cargo is stored.', 'a14-09-aeolia')],
);

// ================================================================== A14-10 Circe
const A10: EduQuest = quest(
  'a14-10',
  'Circe',
  {
    'a14-10-s1': {
      goal: 'Go up into the woods with Odysseus.',
      hint: 'Follow the smoke towards the house in the trees.',
    },
    'a14-10-s2': {
      goal: 'Feed the pigs in the sty while he goes inside.',
      hint: 'Go round the side of the house to the sties.',
    },
    'a14-10-s3': {
      goal: 'See the men turned back.',
      hint: 'Stay by the sty when the door opens.',
    },
  },
  [
    sc(
      'a14-10-woods',
      [
        N(
          'A low, wooded island, and smoke rising from a house deep in the trees. Odysseus sends half the men to look, under Eurylochus.',
        ),
        N('Eurylochus comes back alone, running, and can’t speak at first for crying.'),
        EL(
          'Wolves and lions round the house, tame. They wagged their tails at us like dogs when their master comes home.',
          'shock',
        ),
        EL(
          'Inside, a woman was singing at a great loom. She called us in, and they all went. I stayed outside. I thought it was a trap.',
        ),
        EL('They never came out. I waited and waited. Not one.', 'sad'),
        OD('Then I’ll go. Stay here if you like.'),
        N(
          'He slings his sword and bow on his shoulder and goes up into the woods. You go with him, because guests go with their hosts.',
        ),
        N(
          'On the path a young man is standing with a gold wand, as if he’d been waiting. You have seen him before, on another beach.',
        ),
        HM(
          'Where are you going, alone, into these woods? Your men are in Circe’s sties. Will you free them? You’ll end up with them.',
        ),
        HM('Here. Take this herb. It will keep her spell off you.'),
        N(
          'He draws it out of the ground: black at the root, with a flower as white as milk. The gods call it moly, and it is hard for people to dig.',
        ),
        HM(
          'When she strikes you with her wand, draw your sword. She will ask you to stay. Make her swear by the gods first.',
        ),
        N('Then he goes up through the trees to high Olympus, and the path is empty.'),
      ],
      [
        ask(
          10,
          'science',
          'what a plant’s roots do',
          '4-LS1-1',
          [N('Moly has a black root and a flower white as milk. What is a plant’s root for?')],
          [
            o(
              'To hold the plant in the ground and take in water.',
              [
                N(
                  'Yes. Roots anchor a plant and drink water from the soil. Nobody knows which real flower moly was, but one guess is the snowdrop.',
                ),
              ],
              true,
            ),
            o('To make seeds.', [
              N(
                'Seeds are made in the flower. The root’s jobs are holding the plant steady and taking up water and minerals.',
              ),
            ]),
            o('To catch sunlight.', [
              N('Leaves catch sunlight. Roots stay underground, holding on and drinking.'),
            ]),
          ],
          'Learned the jobs of a plant’s roots: anchoring it and taking in water.',
        ),
      ],
      [
        ch('thank', 'Thank him as he goes.', [
          N(
            'You thank him, and he inclines his head, gravely. Then the path is only a path, with a little hollow where a flower was.',
          ),
        ]),
        ch('flower', 'Look at the flower.', [
          N(
            'It’s a plain white flower that smells of nothing much. Odysseus holds it as if it were a lamp.',
          ),
        ]),
      ],
    ),
    sc(
      'a14-10-woods-done',
      [
        N(
          'The house is built of smooth stone. The wolves and lions come up wagging their tails, and your Nubbin peers out at them from behind your legs.',
        ),
      ],
      [
        ask(
          0,
          'literacy',
          'tell what a character feels from what they do',
          'RL.2.3',
          [
            N(
              'Your Nubbin peers out at the wolves and lions from behind your legs. What does that tell you about how it feels?',
            ),
          ],
          [
            o(
              'Nervous, but curious',
              [
                N(
                  'Yes. Hiding behind you shows it is nervous, and peeping out shows it wants to see. Actions tell us feelings, even when no one says them.',
                ),
              ],
              true,
            ),
            o('Bored', [
              N(
                'Bored animals don’t hide. Peeping from behind your legs shows it is both nervous and curious.',
              ),
            ]),
            o('Sleepy', [
              N(
                'Sleepy animals curl up. This one is peering out, which means it is nervous but curious.',
              ),
            ]),
          ],
          'Inferred a character’s feelings from what it does (peering out from behind legs).',
        ),
      ],
    ),
    sc(
      'a14-10-sty',
      [
        N(
          'Odysseus goes in. You don’t, because Hermes gave you no moly, so you go round the side of the house instead.',
        ),
        N(
          'There are the sties, and in them the pigs: bristly, grunting, with pigs’ snouts and pigs’ voices.',
        ),
        N('But their minds are what they were, and you can see it in their eyes. They are crying.'),
        N(
          'Circe has thrown them acorns, beech-mast and cornel berries, the food that pigs eat. Some of it lies in the mud, untouched.',
        ),
        N(
          'Your Nubbin stands at the rail and looks at the biggest pig for a long time. The pig looks back.',
        ),
        N(
          'These are the men who opened the bag of winds, and you remember that. You feed them anyway.',
        ),
      ],
      [
        ask(
          3,
          'science',
          'a pig’s snout is made for finding food underground',
          '4-LS1-1',
          [
            N(
              'Real pigs poke about in the ground with strong, flat snouts, finding acorns, roots and berries. How does a snout like that help a pig survive?',
            ),
          ],
          [
            o(
              'It sniffs out and digs up food hidden in the ground.',
              [
                N(
                  'Yes. A pig’s snout is a nose and a digging tool in one, which is why pigs are good at finding acorns in an oak wood.',
                ),
              ],
              true,
            ),
            o('It lets the pig fly short distances.', [
              N('Pigs can’t fly! The snout is for smelling and digging up food from the ground.'),
            ]),
            o('It keeps the rain off.', [
              N('Not at all. A pig’s snout is for finding and digging up food.'),
            ]),
          ],
          'Learned that a pig’s snout is an adaptation for finding and digging up food.',
        ),
        ask(
          5,
          'sel',
          'think about being kind to someone who has let you down',
          'CASEL: Relationship skills',
          [
            N(
              'These men opened the bag of winds, which cost everyone dearly, and you remember. You feed them anyway. Why?',
            ),
          ],
          [
            o('Because everyone deserves kindness when they are suffering.', [
              N(
                'That’s a fair answer. Being kind doesn’t mean pretending nothing happened. It means seeing that someone is hurting.',
              ),
            ]),
            o('Because anger won’t help them or you.', [
              N(
                'That’s a fair answer. Staying angry can feel heavy to carry. Feeding them is a way of putting some of it down.',
              ),
            ]),
            o('Maybe I shouldn’t, until they say sorry.', [
              N(
                'That’s a fair answer too. Some people feel that trust has to be earned back. Kindness and fairness can pull in different directions.',
              ),
            ]),
          ],
          'Thought about kindness towards someone who has made a mistake (a think question).',
        ),
      ],
      [
        ch('talk', 'Feed them, and talk to them as men.', [
          N(
            'You feed them, and talk to them like the sailors they are, about the weather and the ship. One of them stops crying to listen.',
          ),
        ]),
        ch('scratch', 'Feed them, and scratch behind their ears.', [
          N(
            'You feed them and scratch behind their ears, which isn’t dignified, and they lean into it anyway. Some things are true in any shape.',
          ),
        ]),
        ch('nubbin', 'Let your Nubbin climb in with them.', [
          N(
            'Your Nubbin climbs over the rail and lies down in the straw among them, and they settle round it, as if it had been their idea.',
          ),
        ]),
      ],
    ),
    sc(
      'a14-10-sty-done',
      [
        N(
          'From inside the house comes a shout, and a cry, and then a woman’s voice: not frightened, only very surprised.',
        ),
      ],
      [
        ask(
          0,
          'literacy',
          'predict what has just happened from clues',
          'RL.3.3',
          [
            N(
              'Odysseus went in carrying moly. You hear a shout, and then Circe’s voice, not frightened but surprised. What do you think just happened?',
            ),
          ],
          [
            o(
              'Circe’s spell didn’t work on him.',
              [
                N(
                  'Yes. She is surprised, not scared, so something she expected to happen didn’t. Good readers use clues like this to predict.',
                ),
              ],
              true,
            ),
            o('Odysseus has been turned into a pig.', [
              N(
                'If so, you’d expect Circe to sound pleased, not surprised. The clue points to her spell failing.',
              ),
            ]),
            o('Circe has dropped her cup.', [
              N(
                'That could make a shout, but the clue is that she sounds very surprised. That fits her spell failing on Odysseus.',
              ),
            ]),
          ],
          'Predicted what happened offscreen from clues (a shout and a surprised voice).',
        ),
      ],
    ),
    sc(
      'a14-10-change',
      [
        N(
          'The door opens. Circe comes out with her wand, and Odysseus behind her, his sword still drawn.',
        ),
        CI(
          'You are Odysseus. You must be. Hermes always said you would come one day, the clever one, on your way home from Troy.',
        ),
        CI(
          'My cup did nothing to you. Nobody has ever drunk it and stayed himself. Put your sword away. Come in.',
        ),
        OD(
          'Not yet. First swear by the gods you’ll do me no harm. And give me back my men.',
          'angry',
        ),
        N(
          'She swears. Then she opens the sty and goes among the pigs with a salve, and touches each one.',
        ),
        N(
          'The bristles fall away, and they are men again, younger than before, and taller. They hold Odysseus’s hands and weep.',
        ),
        N('The house rings with it. Even Circe is moved, and turns away to look at the trees.'),
        N(
          'The youngest of the men comes over and shakes your hand without a word. He remembers the acorns.',
        ),
      ],
      [
        ask(
          7,
          'sel',
          'show thanks in ways that need no words',
          'CASEL: Relationship skills',
          [
            N(
              'The youngest man says nothing, but shakes your hand because you fed him. How else can people show thanks without words?',
            ),
          ],
          [
            o(
              'A smile, a hug, or a kind turn later on.',
              [
                N(
                  'Yes. A smile or a favour returned can say thank you as clearly as words. Showing thanks helps friendships stay strong.',
                ),
              ],
              true,
            ),
            o('There isn’t any other way.', [
              N(
                'There are lots. A nod, a smile, a hug, a gift, or helping later on can all say thank you.',
              ),
            ]),
            o('Pretending it never happened.', [
              N(
                'Then the person who helped wouldn’t know it mattered. Even a small sign of thanks tells them it did.',
              ),
            ]),
          ],
          'Thought about ways to show gratitude without words.',
        ),
      ],
    ),
    sc(
      'a14-10-complete',
      [
        CI(
          'Stay, all of you. Eat and drink until your strength comes back. You’ve been beaten so long you’ve forgotten how to be glad.',
          'soft',
        ),
        N('They stay. Days become months: feasts, and sleep, and more feasts.'),
        N(
          'The year turns round. One evening the men come to Odysseus and remind him, gently, that they have homes too.',
        ),
        OD('A whole year. I didn’t count. You’d think I’d be the one counting.', 'sad'),
        CI(
          'You may go. But first you must make another journey: to the House of the Dead, to ask the prophet Tiresias your way home.',
          'think',
        ),
        N('Odysseus sits down hard on the edge of the bed and puts his head in his hands.'),
      ],
      [
        ask(
          3,
          'maths',
          'a year is 12 months; half a year is 6',
          '4.MD.A.1',
          [
            N(
              'They stayed a whole year, which is 12 months, or about 52 weeks. If they had stayed only half a year, how many months would that be?',
            ),
          ],
          [
            o('6 months', [N('Yes. Half of 12 is 6, because 6 + 6 = 12.')], true),
            o('3 months', [N('That is a quarter of a year. Half of 12 is 6.')]),
            o('24 months', [N('That is two whole years. Half a year is half of 12, which is 6.')]),
          ],
          'Found half of a year in months (half of 12 is 6).',
        ),
      ],
    ),
  ],
  [
    gl('sty', 'A small pen where pigs are kept.', 'a14-10-sty'),
    gl('salve', 'A soft, oily ointment spread on skin to heal it.', 'a14-10-change'),
  ],
);

// ================================================================== A14-11 The House of the Dead
const A11: EduQuest = quest(
  'a14-11',
  'The House of the Dead',
  {
    'a14-11-s1': {
      goal: 'Sail with him to the edge of the world.',
      hint: 'Wait under the willows while he goes on alone.',
    },
    'a14-11-s2': {
      goal: 'Stay near while the dead come.',
      hint: 'Keep still under the willows and watch.',
    },
    'a14-11-s3': {
      goal: 'Sit with him afterwards.',
      hint: 'Stay under the willows when he comes back.',
    },
  },
  [
    sc(
      'a14-11-edge',
      [
        N(
          'This part of his story is about his mother, and about the dead. It is sad and gentle, and you can stop and come back whenever you like.',
        ),
        N(
          'The wind carries the ship all day, to the edge of the world, where the river Ocean runs round everything.',
        ),
        N(
          'A land of mist that the sun never reaches: tall poplars, and willows that drop their seeds before they ripen. Nobody lives here.',
        ),
        OD(
          'Circe told me what to do. It’s mine to do, not yours. Stay back here by the trees, with the little one.',
          'soft',
        ),
        N(
          'He goes on alone to the place she told him of, and makes the offering to the dead, the old way, out of your sight.',
        ),
        N(
          'You sit under a willow with your Nubbin in your lap. The page is grey here, like paper left out in the rain.',
        ),
      ],
      [
        notice(
          0,
          'sel',
          'sad stories are allowed, and you can pause',
          'CASEL: Self-awareness',
          [
            N('If a story makes you feel sad, that is not a mistake. It means you care.'),
            N(
              'You can pause, take a slow breath, or talk to a grown-up about it. The page will wait for you.',
            ),
          ],
          'Was told that feeling sad at a sad story is normal, and that pausing and talking to a grown-up can help.',
        ),
      ],
    ),
    sc(
      'a14-11-edge-done',
      [
        N(
          'Then they come: the dead, up out of the dark, more than you can count. They make a sound like birds a long way off.',
        ),
        N(
          'They don’t frighten you. They are only sad, and thin as breath, and looking for someone.',
        ),
      ],
      [
        ask(
          0,
          'literacy',
          'a simile helps you hear or see something',
          'L.4.5',
          [
            N(
              'The dead make a sound “like birds a long way off”. What does that simile help you hear?',
            ),
          ],
          [
            o(
              'A faint, high, fluttering sound',
              [
                N(
                  'Yes. Birds far away are quiet and thin, so the simile tells you the sound is faint and far off, and a little sad.',
                ),
              ],
              true,
            ),
            o('A very loud roar', [
              N(
                'A roar is loud and close. Birds a long way off are faint and high, which gives a soft, strange sound.',
              ),
            ]),
            o('Complete silence', [
              N(
                'There is a sound, but it’s a quiet one. The simile helps you hear something faint, like distant birds.',
              ),
            ]),
          ],
          'Used a simile (“like birds a long way off”) to picture a faint, distant sound.',
        ),
      ],
    ),
    sc(
      'a14-11-shades',
      [
        N(
          'The prophet Tiresias comes first, old and blind, with a gold staff. He knows Odysseus at once.',
        ),
        TI(
          'You want your homecoming to be sweet, Odysseus. A god will make it hard. Poseidon has not forgotten his son.',
        ),
        TI(
          'Leave the Sun’s cattle alone, on the island where you find them. Harm them, and you’ll come home late, alone, on a stranger’s ship.',
        ),
        TI(
          'And you’ll find trouble in your house: proud men eating your bread and courting your wife.',
        ),
        N(
          'Then a woman comes up out of the dark, and Odysseus makes a sound you have never heard a grown man make.',
        ),
        OD('Mother?', 'shock'),
        OD('Mother. You were alive when I sailed. I didn’t know. Nobody told me.', 'sad'),
        AM(
          'My child. How did you come here, living, through all that dark water? Have you still not got home?',
          'soft',
        ),
        OD(
          'Not yet. Tell me how you died. Was it a long illness? Tell me about my father, my son. And my wife: does she wait still?',
          'sad',
        ),
        AM(
          'She waits, and cries at night. Your son keeps the land. Your father lives out on the farm, sleeps on leaves in the vineyard, and grieves.',
          'soft',
        ),
        AM(
          'And I wasn’t ill. It was missing you, and wondering where you were, and remembering how kind you were to me. It wore me out.',
          'soft',
        ),
      ],
      [
        notice(
          3,
          'social-studies',
          'ancient Greeks imagined the dead as shadows, and people’s beliefs differ',
          'D2.His.2.K-2',
          [
            N(
              'In the old Greek stories the dead became pale shadows in a dim place beneath the earth. That is how those storytellers imagined it.',
            ),
            N(
              'People in different times and places have believed many different things about death, and every family’s beliefs deserve respect.',
            ),
          ],
          'Learned how ancient Greek storytellers imagined the dead, and that people hold many different beliefs about death.',
        ),
        ask(
          10,
          'sel',
          'missing someone is a big feeling and there are ways to cope',
          'CASEL: Self-awareness',
          [
            N(
              'In the story, Anticlea says missing her son wore her out. Missing someone is a very heavy feeling, but it is not what makes a body stop. Bodies stop for other reasons, such as being very old or very ill.',
            ),
            N('What can help when you miss someone?'),
          ],
          [
            o(
              'Talking about them, looking at pictures, or telling their stories.',
              [
                N(
                  'Yes. Sharing memories keeps a person close in your heart, and talking to someone who listens makes the heavy feeling lighter.',
                ),
              ],
              true,
            ),
            o('Pretending you don’t miss them.', [
              N(
                'Pretending usually makes the feeling heavier. It’s all right to say “I miss them”, and it helps to say it to someone who cares.',
              ),
            ]),
            o('Staying away from everyone.', [
              N(
                'Being alone with a big feeling is hard. Being near people who love you, even quietly, helps it get smaller.',
              ),
            ]),
          ],
          'Learned that missing someone is a heavy but normal feeling, and ways to cope: talking, remembering, being with people.',
        ),
      ],
    ),
    sc(
      'a14-11-shades-done',
      [
        N(
          'He reaches for her, and she goes through his arms like a shadow, or a dream. He reaches again, and a third time.',
        ),
        OD('Mother. Why won’t you stay, so we can hold each other, even here?', 'sad'),
        AM(
          'It isn’t unkindness, child. It is what we are, once we’re dead. Go back to the light. Remember all of it, and tell your wife.',
          'soft',
        ),
      ],
      [
        ask(
          2,
          'literacy',
          'think about what a character asks of someone and why',
          'RL.3.3',
          [
            N(
              'Anticlea tells her son to go back to the light, remember it all, and tell his wife. What is she asking him to do for her, and why might that matter?',
            ),
          ],
          [
            o('To keep her memory alive by telling it.', [
              N(
                'That’s a fair answer. A person who is remembered and talked about stays part of the people who loved them.',
              ),
            ]),
            o('To go on living and not stay stuck in sorrow.', [
              N(
                'That’s a fair answer. She wants him to go home to the living, not linger with the dead. Loving someone can mean wanting them to be well.',
              ),
            ]),
            o('To share the news so his wife isn’t left wondering.', [
              N(
                'That’s a fair answer. Telling the people who love you what happened is a kindness in itself.',
              ),
            ]),
          ],
          'Thought about what a mother asks of her son, and why remembering matters (a think question).',
        ),
      ],
    ),
    sc(
      'a14-11-after',
      [
        N(
          'The dead go back down into the dark. Odysseus walks back to the willows, sits down beside you, and doesn’t say anything.',
        ),
        N('His hands are open on his knees, as if he were still holding something.'),
        N(
          'Far off, the ship is waiting. The men stand at the rail and don’t call him, because they know.',
        ),
        OD('She asked about my wife. My father. My son. Not once about herself.', 'sad'),
        N(
          'Your Nubbin looks at him. Then it looks at you, the way it does when it wants to know what the rule is.',
        ),
        N(
          'You remember what Hazel did, when she didn’t know what to do. You don’t have to remember very hard.',
        ),
      ],
      [
        ask(
          5,
          'sel',
          'sit beside someone who is sad; you don’t have to fix it',
          'CASEL: Social awareness',
          [
            N(
              'Odysseus is very sad, and nothing you say can fix it. Hazel’s way was to sit beside someone and not hurry them. What helps a sad friend most?',
            ),
          ],
          [
            o(
              'Sitting beside them and listening.',
              [
                N(
                  'Yes. Being there is often enough. You don’t need the right words. Staying close tells them they’re not alone.',
                ),
              ],
              true,
            ),
            o('Telling them to cheer up.', [
              N(
                'Cheer up can make a sad person feel they’re doing it wrong. They usually need company first, and cheerfulness later.',
              ),
            ]),
            o('Changing the subject quickly.', [
              N(
                'Changing the subject can make someone feel unheard. Letting the sadness be there, with you beside them, is kinder.',
              ),
            ]),
          ],
          'Learned that sitting quietly beside a sad friend is a good way to help.',
        ),
      ],
      [
        ch('sit', 'Sit with him. That’s all.', [
          N(
            'You sit with him while the mist moves in the willows. After a long time he breathes out, all the way.',
          ),
          OD('Thank you. I couldn’t have borne anyone talking.'),
        ]),
        ch('sorry', '“I’m sorry about your mother.”', [
          OD(
            'So am I. She waited too. Everyone in my house is waiting. Some of them couldn’t wait long enough.',
          ),
        ]),
        ch('nubbin', 'Let your Nubbin climb into his hands.', [
          N(
            'Your Nubbin climbs into his open hands and sits there. It is warm and solid, and it does not go through his fingers.',
          ),
          OD('Oh.'),
        ]),
      ],
    ),
    sc(
      'a14-11-complete',
      [
        N(
          'They sail back to Circe’s island in the morning, without a word between them all the way.',
        ),
        N(
          'Odysseus stands at the stern and watches the edge of the world go grey behind him, and then go.',
        ),
        OD(
          'My father sleeps on leaves in the vineyard. In winter he sleeps by the fire, in the ashes, with the farmhands. An old king.',
          'sad',
        ),
        OD('When I get home, I’ll go to him. Not first. But I’ll go.', 'soft'),
      ],
      [
        ask(
          3,
          'social-studies',
          'telling stories about people keeps them remembered',
          'D2.His.2.K-2',
          [
            N(
              'Anticlea asked Odysseus to remember it all and tell it. How does telling stories about a person keep them remembered?',
            ),
          ],
          [
            o(
              'Each time a story is told, someone new learns who that person was.',
              [
                N(
                  'Yes. Families and whole peoples have kept their past alive this way, long before books. Historians call it oral history.',
                ),
              ],
              true,
            ),
            o('It doesn’t. Only writing keeps people remembered.', [
              N(
                'Writing helps, but for most of human history stories were spoken. Homer’s poems were remembered for generations before anyone wrote them down.',
              ),
            ]),
            o('Only the stories of kings are remembered.', [
              N(
                'Ordinary people are remembered too, in family stories, songs and sayings. Anyone can be remembered if someone keeps telling their story.',
              ),
            ]),
          ],
          'Learned that telling and retelling stories (oral history) keeps people and the past remembered.',
        ),
      ],
    ),
  ],
  [gl('prophet', 'A person who is said to know what will happen in the future.', 'a14-11-shades')],
);

// ================================================================== A14-12 The Sirens
const A12: EduQuest = quest(
  'a14-12',
  'The Sirens',
  {
    'a14-12-s1': {
      goal: 'Hear Circe’s advice for the voyage.',
      hint: 'Walk with them along the shore, away from the sleeping men.',
    },
    'a14-12-s2': {
      goal: 'Let him seal your ears with wax.',
      hint: 'Sit on the bench and keep still while he does it.',
    },
    'a14-12-s3': {
      goal: 'Watch him at the mast as the ship rows past.',
      hint: 'Stay on the bench by the mast. You won’t hear a thing.',
    },
  },
  [
    sc(
      'a14-12-advice',
      [
        N(
          'Back on Circe’s island the men sleep by the ship. Circe takes Odysseus by the hand and leads him apart, and you walk on his other side.',
        ),
        CI(
          'First you’ll come to the Sirens. They sing to every sailor who passes. Whoever stops to hear them never gets home.',
        ),
        CI(
          'They sit in a green meadow by the sea, and the grass round them is full of the wrecks of sailors who stopped to listen.',
        ),
        CI(
          'Warm some wax until it’s soft, and press it into every one of your men’s ears, so that not a note gets in. And row past.',
        ),
        CI(
          'If you want to hear them yourself, let your men tie you to the mast, hand and foot. If you beg to be untied, they must tie you tighter.',
        ),
        OD('And after the Sirens?'),
        CI(
          'After them there are two ways, and both are bad. I’ll tell you of them when you need it. You will want to fight. Don’t.',
          'think',
        ),
      ],
      [
        ask(
          3,
          'science',
          'a soft plug blocks and soaks up the vibrations that carry sound',
          '1-PS4-1',
          [
            N(
              'Sound travels as vibrations in the air that shake the eardrum. Why does wax in your ears make the world quiet?',
            ),
          ],
          [
            o(
              'It plugs the ear, so most vibrations can’t reach the eardrum.',
              [
                N(
                  'Yes. The wax seals the way in, and being soft, it soaks up much of what is left. Earplugs work the same way.',
                ),
              ],
              true,
            ),
            o('It makes the sound go backwards.', [
              N(
                'Sound doesn’t go backwards. The wax blocks the ear, so fewer vibrations reach the eardrum.',
              ),
            ]),
            o('It tells the brain to stop listening.', [
              N(
                'The brain would still hear if the sound arrived. Wax works earlier, by blocking the vibrations before they reach the eardrum.',
              ),
            ]),
          ],
          'Learned that sound is vibration and that a soft plug like wax blocks and soaks it up.',
        ),
        ask(
          4,
          'sel',
          'make a plan ahead of time so you can resist a temptation',
          'CASEL: Self-management',
          [
            N(
              'Odysseus knows he will beg to be untied, so he asks his crew to tie him up now and ignore his begging later. Why is deciding ahead of time a clever way to stay safe?',
            ),
          ],
          [
            o(
              'In the moment the pull may be too strong to think clearly.',
              [
                N(
                  'Yes. When a strong feeling arrives, thinking gets harder. A plan made while calm can protect you from the version of you who isn’t.',
                ),
              ],
              true,
            ),
            o('Because rope is very strong.', [
              N(
                'Rope helps, but the clever part is the plan: he decided while calm, so his later self can’t undo it.',
              ),
            ]),
            o('It isn’t clever. He should just be brave.', [
              N(
                'Bravery matters, but even brave people use plans. Deciding ahead is a way of being brave early, before the pull gets strong.',
              ),
            ]),
          ],
          'Learned that making a plan while calm can help you resist a strong temptation later.',
        ),
      ],
      [
        ch('wax', 'Ask if you should have wax too.', [
          CI(
            'Unless you want to stay in that meadow for ever. You too, little guest. And the small one.',
          ),
        ]),
        ch('why', 'Ask Odysseus why he wants to hear them.', [
          OD(
            'Because nobody has, and lived. Because I want to know. That’s always been my trouble.',
          ),
        ]),
      ],
    ),
    sc(
      'a14-12-advice-done',
      [
        N(
          'At dawn Circe walks off up the island and doesn’t look back. The ship slides out on a fair wind she sends after you.',
        ),
      ],
      [
        ask(
          0,
          'music',
          'a steady beat helps a team move together',
          'CASEL: Relationship skills',
          [
            N(
              'When the wind drops, the crew will row. Rowers keep time with a steady beat so all the oars dip together. Why does a steady beat help?',
            ),
          ],
          [
            o(
              'Everyone moves at the same moment, so the boat goes smoothly.',
              [
                N(
                  'Yes. A shared beat keeps a team together, whether they are rowing, marching or dancing.',
                ),
              ],
              true,
            ),
            o('It makes the oars quieter.', [
              N(
                'The beat doesn’t change the sound of the oars. It helps everyone pull at the same time, so the boat goes straight and fast.',
              ),
            ]),
            o('It tells the wind to blow.', [
              N(
                'The wind doesn’t listen to the beat. The beat is for the rowers: it makes them pull together.',
              ),
            ]),
          ],
          'Learned that a steady beat keeps a team moving together, as when rowing.',
        ),
      ],
    ),
    sc(
      'a14-12-wax',
      [
        N(
          'The wind drops, and the sea goes as flat as a plate. The men take down the sail and start to row.',
        ),
        N(
          'Odysseus cuts a round cake of wax small with his sword, and kneads it in his strong hands until the sun has made it soft.',
        ),
        OD('Ears. Everyone. You first, Eurylochus, and stop making that face.'),
        N(
          'He goes down the benches one man at a time. Then he comes to you, and to your Nubbin, and does yours just as carefully.',
        ),
        N(
          'The world goes muffled, then quiet, then silent. You can feel the oars knocking through the boards, but you can’t hear them.',
        ),
        N(
          'The men tie Odysseus to the mast, upright, hand and foot, and go back to their oars. He nods at you, and his lips say: watch.',
        ),
      ],
      [
        ask(
          1,
          'science',
          'warming softens wax and cooling hardens it again',
          '2-PS1-4',
          [
            N(
              'The sun warms the wax until it goes soft. After the wax sits in your ears and cools, what will happen to it?',
            ),
          ],
          [
            o(
              'It will go firm again, because cooling can reverse the change.',
              [
                N(
                  'Yes. Warming and cooling wax is a change that can be reversed, like melting and freezing ice. That is why wax makes a good earplug: soft to shape, firm to stay.',
                ),
              ],
              true,
            ),
            o('It will stay soft for ever.', [
              N(
                'Wax goes firm as it cools. The change from hard to soft and back can be repeated, so it can be undone.',
              ),
            ]),
            o('It will turn to water.', [
              N('Wax doesn’t turn to water. Warming makes it soft, cooling makes it firm again.'),
            ]),
          ],
          'Learned that warming softens wax and cooling hardens it, a change that can be reversed.',
        ),
        ask(
          4,
          'literacy',
          'words for sound have shades of meaning',
          'L.3.4',
          [
            N(
              'The world goes muffled, then quiet, then silent. Which order goes from loudest to quietest?',
            ),
          ],
          [
            o(
              'muffled, quiet, silent',
              [
                N(
                  'Yes. Muffled is sound with a blanket over it, quiet is faint, and silent is none at all. Words with close meanings have shades, and good writers choose the right one.',
                ),
              ],
              true,
            ),
            o('silent, quiet, muffled', [
              N(
                'Silent is the very quietest, with no sound at all. It belongs at the end, not the start.',
              ),
            ]),
            o('quiet, muffled, silent', [
              N(
                'Muffled is louder than quiet: it is sound with a layer over it. The order from loud to soft is muffled, quiet, silent.',
              ),
            ]),
          ],
          'Put sound words in order (muffled, quiet, silent) and learned about shades of meaning.',
        ),
      ],
    ),
    sc(
      'a14-12-wax-done',
      [N('Your Nubbin keeps touching its ears with its paws, in case they have gone somewhere.')],
      [
        ask(
          0,
          'health',
          'protect your ears from very loud sounds',
          'CASEL: Responsible decision-making',
          [
            N(
              'Your Nubbin keeps checking its ears. Real ears are delicate, and very loud noise can damage hearing for good. What can you do around very loud sound?',
            ),
          ],
          [
            o(
              'Wear ear protection, or move away from the noise.',
              [
                N(
                  'Yes. Ear defenders and earplugs protect hearing, and distance helps too. Hearing damage can’t be mended, so protecting it matters.',
                ),
              ],
              true,
            ),
            o('Turn it up and get used to it.', [
              N(
                'Getting used to loud noise doesn’t make it safe. It can damage hearing without your noticing, so it’s better to protect your ears.',
              ),
            ]),
            o('Nothing can be done.', [
              N(
                'A lot can be done: earplugs, ear defenders, turning the volume down, and standing further away.',
              ),
            ]),
          ],
          'Learned that very loud sounds can harm hearing and how to protect your ears.',
        ),
      ],
    ),
    sc(
      'a14-12-sirens',
      [
        N(
          'A green meadow slides past on the right, very close, and two figures sit in the grass. Their mouths are open: they are singing.',
        ),
        N('You hear nothing at all. You only see what the song does to him.'),
        N(
          'He strains at the ropes, and the cords stand out in his neck. He nods and nods at the men to untie him, with his eyebrows, his whole face.',
        ),
        N(
          'Eurylochus and Perimedes get up from their oars, tie him tighter, and go back to rowing, as they were told.',
        ),
        N(
          'He is shouting something, over and over. You can’t hear it, and you are glad, and you are also, just a little, sorry.',
        ),
        N(
          'The men row harder with their eyes on their oars. Nobody looks at the meadow, and nobody looks at him either.',
        ),
      ],
      [
        ask(
          4,
          'sel',
          'think about whether curiosity is always good',
          'CASEL: Responsible decision-making',
          [
            N(
              'The Sirens promise to tell Odysseus everything, and he is tied up safely, yet he still wants to go to them. Is wanting to know everything always good?',
            ),
          ],
          [
            o('Yes. Curiosity is how we learn. He just needs a safe way to do it.', [
              N(
                'That’s a fair answer. Curiosity is a wonderful thing, and Odysseus’s plan is a safe way to follow it: he hears, but he stays in the boat.',
              ),
            ]),
            o('No. Some things are too dangerous to find out.', [
              N(
                'That’s a fair answer. Some kinds of knowing cost more than they give, and wise people can tell the difference.',
              ),
            ]),
            o('It depends what it costs and who it puts at risk.', [
              N(
                'That’s a thoughtful answer. Odysseus risks only himself, and his crew are shielded. Who pays for your curiosity is worth asking.',
              ),
            ]),
          ],
          'Thought about whether curiosity is always good, and what it might cost (a think question).',
        ),
      ],
      [
        ch('look', 'Keep looking at him.', [
          N(
            'You keep looking at him, so that somebody does. He sees you watching, and it seems to help him hold on.',
          ),
        ]),
        ch('away', 'Look away, at the sea.', [
          N('You look at the sea. It is flat and blue and says nothing, which is a mercy.'),
        ]),
        ch('paws', 'Hold your Nubbin’s paws over its ears.', [
          N(
            'You hold your Nubbin’s paws over its ears, in case the wax isn’t enough. It holds yours over your ears, in case yours isn’t.',
          ),
        ]),
      ],
    ),
    sc(
      'a14-12-sirens-done',
      [
        N('The meadow falls behind. The men take the wax out of their ears, and untie him.'),
        OD(
          'They said they knew everything. Every man who fought at Troy, and everything that ever happens on the earth.',
          'soft',
        ),
        OD(
          'They said: stop, and we’ll tell you. And I’d have stopped, and stayed, and never asked for anything again.',
          'sad',
        ),
      ],
      [
        notice(
          0,
          'art',
          'ancient Greek painters showed the Sirens as part bird, part woman',
          'D2.His.2.K-2',
          [
            N(
              'Greek painters loved this scene. On a famous painted jar made about 2,500 years ago, Odysseus is tied to the mast while the Sirens, shown as women with bird bodies, circle the ship.',
            ),
            N('Painters, like bards, kept the story alive for people who couldn’t read.'),
          ],
          'Learned that ancient Greek painters showed the Sirens as bird-women, and that art kept stories alive.',
        ),
      ],
    ),
    sc(
      'a14-12-complete',
      [
        N(
          'He rubs his wrists where the ropes were. He looks at you as if he wants to ask what it was like, hearing nothing.',
        ),
        OD('Was it quiet? On your side?'),
        Y('Very.'),
        OD('I envy you. I don’t envy you. Both.', 'think'),
      ],
      [
        ask(
          3,
          'sel',
          'feel two opposite feelings at once',
          'CASEL: Self-awareness',
          [
            N(
              'Odysseus says he envies you, and doesn’t, both. Can a person feel two opposite feelings at once?',
            ),
          ],
          [
            o(
              'Yes. Feelings can be mixed.',
              [
                N(
                  'Yes. You can be excited and nervous, or glad and sorry, in the very same moment. Naming both helps them feel less confusing.',
                ),
              ],
              true,
            ),
            o('No. You can feel only one thing at a time.', [
              N(
                'Feelings are often more crowded than that. Odysseus is a good example: he wanted to hear the song, and he is also glad he is safe.',
              ),
            ]),
            o('Only grown-ups can.', [
              N(
                'Children feel mixed feelings too, such as being sad to leave and excited to go. It’s very common at any age.',
              ),
            ]),
          ],
          'Learned that people can feel two opposite feelings at once, and that naming both helps.',
        ),
      ],
    ),
  ],
  [gl('mast', 'The tall upright pole that holds a ship’s sail.', 'a14-12-advice')],
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
      hint: 'Go ashore with the crew, and keep away from the herds.',
    },
    'a14-13-s3': {
      goal: 'Hold on to the fig tree over the whirlpool.',
      hint: 'Grab the fig tree and hang on until the timbers come back up.',
    },
  },
  [
    sc(
      'a14-13-strait',
      [
        N(
          'Two rocks: on one side, high up, a cave in a cliff too smooth to climb. On the other, under a fig tree, the sea goes down a great hole.',
        ),
        N(
          'That is Charybdis. Three times a day she drinks the sea down, and three times she throws it up, and when she drinks you can see the sand.',
        ),
        N(
          'In the cave on the other side lives Scylla. Circe told him of her: a thing with six long necks, and a small, high voice, like a puppy’s.',
        ),
        OD(
          'Better to lose six than lose them all. Steer close under the cliff. And don’t tell the men about her. They’d stop rowing.',
          'sad',
        ),
        N(
          'He puts on his armour, takes two spears and stands in the bow, against Circe’s advice. He can’t help it.',
        ),
        N('The men row, staring at Charybdis. Nobody is looking up.'),
        N(
          'Then the page goes dark for a moment, and comes back. Six of the crew are lost from the benches, and you didn’t see it happen.',
        ),
        OD('Row. Don’t look up. Row!', 'angry'),
      ],
      [
        ask(
          1,
          'science',
          'whirlpools form where strong currents squeeze through a gap or meet',
          '4-ESS2-2',
          [
            N(
              'Real whirlpools form where strong currents squeeze through a narrow gap or crash into each other. Many people think this story was inspired by the narrow Strait of Messina, between Italy and Sicily. Where is a whirlpool most likely?',
            ),
          ],
          [
            o(
              'A narrow strait with strong currents',
              [
                N(
                  'Yes. Squeezed water speeds up and starts to spin. Sailors in Homer’s time had good reason to fear places like that.',
                ),
              ],
              true,
            ),
            o('A still pond on a calm day', [
              N('A still pond has no strong currents, so there is nothing to make the water spin.'),
            ]),
            o('A puddle in the road', [
              N(
                'A puddle has no current at all. Whirlpools need moving water squeezed into a narrow space.',
              ),
            ]),
          ],
          'Learned that whirlpools form where strong currents squeeze through narrow gaps.',
        ),
        notice(
          7,
          'sel',
          'sad things happen, and it helps to tell someone how it feels',
          'CASEL: Self-awareness',
          [
            N(
              'The six men have died. Losing friends is one of the hardest things there is, and Odysseus will carry that sadness for the rest of his life.',
            ),
            N(
              'If something sad happens in a story, or in real life, it helps to tell someone you trust how it feels.',
            ),
          ],
          'Was gently told that losing friends is very hard, and that telling a trusted person how you feel helps.',
        ),
      ],
    ),
    sc(
      'a14-13-strait-done',
      [
        N(
          'The strait opens out, and behind you the sea roars down Charybdis’s throat and comes back up. Ahead lies a green island, with cattle on it.',
        ),
      ],
      [
        ask(
          0,
          'literacy',
          'homophones: strait and straight sound alike',
          'L.3.4',
          [
            N(
              'A strait is a narrow stretch of water between two lands. It sounds just like straight, as in a straight line. Which sentence uses “strait” correctly?',
            ),
          ],
          [
            o(
              'The ship sailed through the narrow strait.',
              [
                N(
                  'Yes. A strait is water, and this ship is sailing in it. Words that sound alike but mean different things are called homophones.',
                ),
              ],
              true,
            ),
            o('He drew a strait line.', [
              N(
                'A line that doesn’t bend is straight, spelled s-t-r-a-i-g-h-t. A strait is a narrow stretch of water.',
              ),
            ]),
            o('The road ran strait ahead.', [
              N(
                'A road with no bends is straight. Strait is the narrow channel of water the ship has just passed through.',
              ),
            ]),
          ],
          'Learned the homophones strait (narrow water) and straight (not bent).',
        ),
      ],
    ),
    sc(
      'a14-13-island',
      [
        N(
          'The island of the Sun. Fat cattle with broad brows and curling horns graze along the shore: seven herds, and seven flocks of sheep.',
        ),
        OD('Tiresias warned me. Circe warned me. We sail past.', 'think'),
        EL(
          'You’re made of iron, you. We’re tired, and it’s getting dark. Let us land and sleep. One night.',
          'angry',
        ),
        N(
          'The men all shout for Eurylochus. Odysseus makes them swear not to touch the cattle, and they swear, and you land.',
        ),
        N(
          'In the night the wind changes and blows from the south for a month, and never stops. The food runs out.',
        ),
        N(
          'The men fish, and snare birds, and go hungry. Odysseus goes inland alone to ask the gods for help, and falls asleep.',
        ),
        N(
          'Eurylochus calls the men together. You can see what he’s going to say before he says it.',
        ),
      ],
      [
        ask(
          6,
          'sel',
          'think about a promise made when you are hungry and afraid',
          'CASEL: Responsible decision-making',
          [
            N(
              'The crew swore not to touch the Sun’s cattle. Weeks later they are hungry and frightened. Is a promise still a promise when keeping it is hard?',
            ),
          ],
          [
            o('Yes. A promise that only holds when it’s easy isn’t worth much.', [
              N('That’s a fair answer. Promises matter most exactly when they are hard to keep.'),
            ]),
            o('Partly. Staying alive matters, and a promise shouldn’t starve you.', [
              N(
                'That’s a fair answer. People do weigh promises against needs. The trouble here is that they didn’t try Odysseus’s plan, or wait for him.',
              ),
            ]),
            o('It depends on who the promise was made to, and what else they could do.', [
              N(
                'That’s a thoughtful answer. A promise to the gods, made to the leader, with other food unfound, is a tangled one. Good decisions look for another way first.',
              ),
            ]),
          ],
          'Thought about keeping a promise when it is hard (a think question).',
        ),
      ],
      [
        ch('fetch', 'Go and find Odysseus.', [
          N(
            'You run inland with your Nubbin, and find him asleep in a hollow out of the wind. By the time you wake him, you can smell the fires.',
          ),
        ]),
        ch('argue', 'Stay and argue with the crew.', [
          EL(
            'Better to drown in one gulp than starve slowly on an island. We’ll make it up to the Sun. We’ll build him a temple.',
          ),
          N('Nobody listens to you. They’re too hungry to listen to anybody.'),
        ]),
        ch('herd', 'Stand with the cattle.', [
          N(
            'You stand among the cattle, calm and huge and gold in the dusk. The men walk round you, quite politely, and take them anyway.',
          ),
        ]),
      ],
    ),
    sc(
      'a14-13-island-done',
      [
        N('Odysseus comes down to the shore, smells the meat cooking, and cries out to the gods.'),
        N(
          'Far above, the Sun goes to the gods to complain, and Zeus listens. Nothing more is said aloud on the page.',
        ),
      ],
      [
        ask(
          1,
          'science',
          'day and night happen because the Earth spins once in about 24 hours',
          '5-ESS1-2',
          [
            N(
              'In the Greek story the Sun is a god who crosses the sky each day. Scientists later worked out that day and night happen because the Earth spins. How long does one full spin take?',
            ),
          ],
          [
            o(
              'About 24 hours',
              [
                N(
                  'Yes. One spin is about a day. The side of the Earth facing the Sun has day, and the side turned away has night.',
                ),
              ],
              true,
            ),
            o('About one week', [
              N('A week is seven days. The Earth makes seven full spins in a week, one each day.'),
            ]),
            o('About one hour', [
              N(
                'An hour is far too fast. The Earth takes about 24 hours to turn once, which is why we have 24 hours in a day.',
              ),
            ]),
          ],
          'Learned that day and night come from the Earth spinning once about every 24 hours.',
        ),
      ],
    ),
    sc(
      'a14-13-fig',
      [
        N(
          'Six days the men feast. On the seventh the wind drops and you sail, and as soon as the island is out of sight a black cloud stands over the ship.',
        ),
        N(
          'Zeus’s thunderbolt strikes the ship, and it fills with smoke. The men go into the sea, and the page doesn’t show you their faces.',
        ),
        N(
          'All the crew are lost. They have died, and only Odysseus is left. He lashes the mast to the keel with a leather strap, and rides them.',
        ),
        N('Odysseus is shaking. You and your Nubbin hold on to the mast, and to him.'),
        N('All night the wind carries you back the way you came.'),
        OD('No. Not back. Not back to her.', 'shock'),
        N(
          'At dawn you are at Charybdis again. The sea goes down her throat, and the mast and keel go with it.',
        ),
        N(
          'Odysseus leaps up and catches the fig tree above her, and hangs there like a bat. You catch hold beside him, and your Nubbin holds on to you.',
        ),
        N(
          'There is no foothold, and no climbing up. You can only hang, and wait for her to give the timbers back.',
        ),
      ],
      [
        ask(
          0,
          'maths',
          'add days to find a total',
          '2.OA.A.1',
          [
            N(
              'The south wind blew for a month, about 30 days. Then the men feasted for 6 days before sailing. About how many days did they spend on the island?',
            ),
          ],
          [
            o(
              '36 days',
              [N('Yes. 30 + 6 = 36 days. That’s a long time to be stuck on one small island.')],
              true,
            ),
            o('24 days', [
              N('That is 30 − 6. We need to add the feasting days to the month: 30 + 6 = 36.'),
            ]),
            o('6 days', [N('That is only the feast. Add the month of wind: 30 + 6 = 36 days.')]),
          ],
          'Added 30 + 6 to find a total of 36 days.',
        ),
        ask(
          8,
          'health',
          'muscles tire when they work hard, and rest helps them recover',
          'CASEL: Self-management',
          [
            N(
              'Your arms burn from hanging on. Muscles tire when they work hard for a long time. What helps tired muscles recover?',
            ),
          ],
          [
            o(
              'Rest, water and food',
              [
                N(
                  'Yes. Rest gives muscles time to mend, water keeps them working, and food gives them fuel. After a hard effort, all three help.',
                ),
              ],
              true,
            ),
            o('Working them even harder straight away', [
              N(
                'Hard work after hard work can strain muscles. Rest, water and food help them recover.',
              ),
            ]),
            o('Nothing. They never need to recover.', [
              N(
                'Every muscle needs recovery time. That is why athletes rest between hard sessions.',
              ),
            ]),
          ],
          'Learned that tired muscles recover with rest, water and food.',
        ),
      ],
      [
        ch('hang', 'Hang on.', [
          N(
            'You hang on, and your arms burn. Odysseus talks to you all the while, about nothing, about goats, so you don’t think about letting go.',
          ),
        ]),
        ch('count', 'Count, to make it go faster.', [
          N(
            'You count, and get to a number you didn’t know you knew. Odysseus counts with you, under his breath.',
          ),
        ]),
        ch('look', 'Look at Odysseus.', [
          N(
            'He is looking down into the whirlpool, quite calm: he has hung over worse. You decide, for now, to believe him.',
          ),
        ]),
      ],
    ),
    sc(
      'a14-13-fig-done',
      [
        N(
          'At the hour when a judge gets up from the court to go home to supper, the timbers come back up out of Charybdis.',
        ),
        N(
          'Odysseus lets go and drops onto them, and you drop after him, and he paddles away with his hands.',
        ),
      ],
      [
        notice(
          0,
          'social-studies',
          'before clocks, people told time by the Sun and by daily events',
          'D2.His.2.K-2',
          [
            N(
              '“The hour when a judge goes home to supper” tells you roughly when it is: late afternoon. Before clocks, people told time by the Sun and by what happened each day.',
            ),
            N('The Greeks also used sundials, which tell time by the shadow of a stick.'),
          ],
          'Learned that before clocks people told time by the Sun, daily events and sundials.',
        ),
      ],
    ),
    sc(
      'a14-13-complete',
      [
        N(
          'Nine days he drifts. On the tenth night the sea brings him to Calypso’s island, and she takes him in.',
        ),
        N(
          'The page turns back, and you are on a bench in the Phaeacian hall. The lamps are low, and nobody has moved.',
        ),
        OD(
          'And the rest you know. I told it you yesterday. I don’t like telling a story twice.',
          'soft',
        ),
        N('No one in the hall says anything for a long time. Then Alcinous stands up.'),
        AC(
          'You’ll go home tomorrow, on our fastest ship, with gifts from everyone here. Nobody will say you came to us and left with nothing.',
        ),
      ],
      [
        ask(
          1,
          'literacy',
          'a frame story holds other stories inside it',
          'RL.4.3',
          [
            N(
              'Odysseus tells his adventures to the Phaeacians, and we step inside them. A story told inside another story is called a frame story. What is the frame here?',
            ),
          ],
          [
            o(
              'The evening in the Phaeacian hall',
              [
                N(
                  'Yes. The hall is the frame, and the Cyclops, the winds, Circe and the rest are stories inside it. Many famous books use this trick.',
                ),
              ],
              true,
            ),
            o('The Cyclops’s cave', [
              N(
                'The cave is one of the stories inside. The frame is the evening in the hall where Odysseus is telling them.',
              ),
            ]),
            o('Penelope’s loom', [
              N(
                'The loom belongs to another part of the tale. The frame is the evening in the Phaeacian hall, where Odysseus tells his adventures.',
              ),
            ]),
          ],
          'Learned that a frame story holds other stories, and found the frame (the hall).',
        ),
      ],
    ),
  ],
  [
    gl('strait', 'A narrow stretch of water joining two larger areas of sea.', 'a14-13-strait'),
    gl('timbers', 'The wooden beams and planks of a ship.', 'a14-13-fig'),
  ],
);

// ================================================================== A14-14 Home Asleep
/** The harbour scene up to the last two lines, which differ by the a14-name choice. */
const HARBOUR_COMMON: Line[] = [
  N('He wakes. A mist lies over everything, and he doesn’t know where he is.'),
  OD(
    'What country is this? They promised me Ithaca, and they’ve put me down on some strange shore and gone.',
    'angry',
  ),
  N(
    'A young shepherd comes down the path: fine-boned, like a king’s son, with a good cloak and a spear in his hand.',
  ),
  SH(
    'You must be a long way from home, stranger, not to know this place. This is Ithaca. Even at Troy they’ve heard of Ithaca.',
  ),
  N(
    'Odysseus’s heart leaps. Then, because he is who he is, he tells the shepherd a long, sad lie about being a runaway from Crete.',
  ),
  N(
    'The shepherd smiles, and is a tall woman, grave and beautiful. You have met her before, more than once, in other faces.',
  ),
  AT(
    'Even here, on your own island, you’d spin me a tale. That carefulness is why I have never been able to leave you.',
    'soft',
  ),
  AT(
    'I am Athena, daughter of Zeus, who has stood by you in every trouble. Look. Your harbour. Your olive tree. Your mountain.',
  ),
  N('The mist lifts. He knows it all at once, and kneels, and puts his face to the ground.'),
  AT(
    'Your house is full of men who court your wife and eat your bread. Nobody must know you yet. Not one person.',
  ),
  N(
    'She touches him with her wand. His skin wrinkles, his hair thins, and his fine clothes are rags that stink of smoke.',
  ),
  N(
    'He is an old beggar with a staff and a torn bag on a cord. He looks down at himself, and laughs.',
  ),
  BG('Well. Nobody will know me now.', 'think'),
];
const harbourBeats = (): Beat[] => [
  ask(
    3,
    'literacy',
    'nostalgia comes from the Greek nostos (homecoming) and algos (pain)',
    'L.3.4',
    [
      N(
        'The Greeks had a word for homecoming: nostos (NOS-toss). Another Greek word, algos, means pain. Put them together and you get an English word for the ache of missing home or the past.',
      ),
      N('What is it?'),
    ],
    [
      o(
        'nostalgia',
        [
          N(
            'Yes. Nostalgia is “homecoming-pain”. The Odyssey is the most famous homecoming story of all.',
          ),
        ],
        true,
      ),
      o('nostril', [
        N('A nostril is part of your nose. The word from nostos and algos is nostalgia.'),
      ]),
      o('nautical', [
        N(
          'Nautical means to do with ships. The word that means the ache of missing home is nostalgia.',
        ),
      ]),
    ],
    'Learned that nostalgia comes from the Greek words nostos (homecoming) and algos (pain).',
  ),
  ask(
    13,
    'sel',
    'think about the difference between being careful and being honest',
    'CASEL: Responsible decision-making',
    [
      N(
        'Odysseus lies even to a friendly stranger on his own island, because being careful has kept him alive for twenty years. Is being careful the same as being honest?',
      ),
    ],
    [
      o('No. You can be careful by staying quiet, without telling a lie.', [
        N(
          'That’s a fair answer. Keeping something private is different from saying something false, and many people feel that matters.',
        ),
      ]),
      o('Sometimes a lie is needed to stay safe.', [
        N(
          'That’s a fair answer. Odysseus has good reasons. It’s still worth asking what each lie costs, and who gets hurt by it.',
        ),
      ]),
      o('It depends who you are talking to.', [
        N(
          'That’s a thoughtful answer. We owe the people we trust more of the truth than we owe a stranger, and Athena has been testing him.',
        ),
      ]),
    ],
    'Thought about whether being careful is the same as being honest (a think question).',
  ),
];
const A14: EduQuest = quest(
  'a14-14',
  'Home Asleep',
  {
    'a14-14-s1': {
      goal: 'Sail with the Phaeacians to Ithaca.',
      hint: 'Sit in the stern beside him through the night.',
    },
    'a14-14-s2': {
      goal: 'Stay with him when he wakes.',
      hint: 'Wait on the sand beside him until he stirs.',
    },
  },
  [
    sc(
      'a14-14-ship',
      [
        N(
          'The Phaeacian ship has no steering oar. It doesn’t need one: it knows the way to every harbour in the world.',
        ),
        N(
          'Odysseus lies down on a rug in the stern and is asleep at once, in a deep, deep sleep. He has earned it.',
        ),
        N(
          'The ship runs faster than a falcon, and the water hisses along her sides. You sit by him, with your Nubbin in your lap, and watch the stars.',
        ),
        N(
          'Behind you Scheria goes small. Ahead there is nothing but dark sea, and then, before dawn, a dark shape.',
        ),
        N('Twenty years he has been gone: ten at the war, and ten on the way back.'),
        N('He is smiling in his sleep. You have never seen him smile without a trick behind it.'),
      ],
      [
        ask(
          3,
          'social-studies',
          'Ithaca is a real island off Greece’s west coast',
          'D2.Geo.2.K-2',
          [
            N(
              'The dark shape ahead is Ithaca. It is a real island, still there today, on Greece’s west coast. If you stood on the Greek mainland and looked towards Ithaca, which way would you face?',
            ),
          ],
          [
            o(
              'West',
              [
                N(
                  'Yes. Ithaca lies off the west coast, in the Ionian Sea. A few thousand people live there today.',
                ),
              ],
              true,
            ),
            o('East', [
              N(
                'East is inland, towards Troy and the sunrise. Ithaca lies the other way, out to sea in the west.',
              ),
            ]),
            o('North', [
              N(
                'Ithaca is a little north of the middle of Greece’s west coast, but from the mainland you’d look mostly west, out to sea.',
              ),
            ]),
          ],
          'Located Ithaca as a real island off Greece’s west coast, using compass directions.',
        ),
      ],
      [
        ch('cloak', 'Pull his cloak up over his shoulder.', [
          N('You pull it up, and he doesn’t wake. He mutters something about a dog.'),
        ]),
        ch('stars', 'Watch the stars.', [
          N(
            'You watch the stars. The bright one that brings the dawn comes up, and the ship runs into harbour.',
          ),
        ]),
        ch('sleep', 'Sleep too.', [
          N('You sleep, and dream of a gate, and of somebody lifting and pushing it.'),
        ]),
      ],
    ),
    sc(
      'a14-14-ship-done',
      [
        N(
          'In the harbour an olive tree grows at the head of the bay, beside a cave of the nymphs, where bees keep honey in stone jars.',
        ),
        N(
          'The sailors lift him off the ship still asleep, rug and all, and lay him on the sand. They set his gifts under the olive tree, and go.',
        ),
      ],
      [
        ask(
          0,
          'science',
          'bees carry pollen from flower to flower as they gather nectar',
          '2-LS2-2',
          [
            N(
              'Bees visit flowers to collect nectar, which they turn into honey. What else do they do, without meaning to?',
            ),
          ],
          [
            o(
              'Carry pollen from flower to flower, which helps plants make seeds.',
              [
                N(
                  'Yes. Pollen sticks to a bee’s fur and rubs off on the next flower. That is called pollination, and many fruits and nuts depend on it.',
                ),
              ],
              true,
            ),
            o('Pull weeds out of the ground.', [
              N(
                'Bees don’t weed. They move pollen between flowers, which is what lets many plants make seeds and fruit.',
              ),
            ]),
            o('Wake the flowers up.', [
              N(
                'Flowers don’t need waking! A bee carries pollen as she feeds, and that’s how plants make seeds.',
              ),
            ]),
          ],
          'Learned that bees pollinate flowers by carrying pollen between them as they gather nectar.',
        ),
      ],
    ),
    sc(
      'a14-14-harbour',
      [...HARBOUR_COMMON, BG('You told me once to keep my name. I’m keeping it now.', 'soft')],
      harbourBeats(),
    ),
    sc(
      'a14-14-harbour-done',
      [
        N(
          'Together you hide his gifts deep in the cave of the nymphs: gold and bronze and fine cloth. Athena sets a stone across the mouth.',
        ),
        AT(
          'Go to the swineherd. He has stayed true. I am going to Sparta, to bring your son home.',
        ),
        N(
          'She is gone. The beggar leans on his staff, and the staff is real, and so, now, is the limp.',
        ),
      ],
      [
        ask(
          0,
          'science',
          'caves form slowly as rainwater dissolves limestone',
          '2-ESS1-1',
          [
            N(
              'Greece has many caves in limestone rock. Rainwater is very slightly acidic, and it slowly dissolves limestone and leaves hollows behind. Is that a fast change or a slow one?',
            ),
          ],
          [
            o(
              'Very slow, over thousands of years',
              [
                N(
                  'Yes. Rain wears away rock a tiny amount at a time. Some changes to the Earth happen in a day, like a landslide, and others take longer than people have been alive.',
                ),
              ],
              true,
            ),
            o('Fast, in a single day', [
              N(
                'A big cave can’t form in a day. Water dissolves limestone so slowly that it takes thousands of years to carve out a hollow.',
              ),
            ]),
            o('It can’t happen at all', [
              N(
                'It does happen. Rainwater slowly dissolves limestone, and over a very long time it can carve out a cave.',
              ),
            ]),
          ],
          'Learned that some caves form very slowly as rainwater dissolves limestone.',
        ),
      ],
    ),
    sc(
      'a14-14-complete',
      [
        N(
          'You walk up from the harbour by a rough track through the woods. Ithaca is all rock and goats and thorn, and he looks at every bit of it.',
        ),
        BG('That rock. I fell off that rock when I was six. That one too.', 'soft'),
        N(
          'He stops to touch an olive tree, and then another. Your Nubbin touches them too, since it seems to be what’s done here.',
        ),
        BG('Home. I’m home. And I can’t tell anyone.', 'sad'),
      ],
      [
        ask(
          3,
          'sel',
          'name mixed feelings: joy and loneliness together',
          'CASEL: Self-awareness',
          [
            N(
              'Odysseus is home at last, but he cannot tell anyone. Which words fit how he might feel?',
            ),
          ],
          [
            o(
              'Joyful and lonely, both at once',
              [
                N(
                  'Yes. Feelings can sit side by side. He is thrilled to be home and lonely because nobody can know it yet.',
                ),
              ],
              true,
            ),
            o('Only happy', [
              N(
                'He is certainly happy, but he also said he can’t tell anyone. That secret is a lonely thing to carry, so there is more than happiness here.',
              ),
            ]),
            o('Only bored', [
              N(
                'Nothing here is boring to him. He is touching trees and remembering falls from rocks. Joy and loneliness are a better fit.',
              ),
            ]),
          ],
          'Named mixed feelings (joy and loneliness) for a character who is home but must keep it secret.',
        ),
      ],
    ),
  ],
  [
    gl(
      'nostos',
      'The Greek word for a homecoming, the root of the English word nostalgia.',
      'a14-14-harbour',
    ),
  ],
);

// ================================================================== A14-15 The Swineherd
const A15: EduQuest = quest(
  'a14-15',
  'The Swineherd',
  {
    'a14-15-s1': {
      goal: 'Come to the swineherd’s hut.',
      hint: 'Climb the track to the stone yard on the hill.',
    },
    'a14-15-s2': {
      goal: 'Help Eumaeus with the pigs, into the night.',
      hint: 'Pour the acorns into the troughs and herd the piglets in.',
    },
    'a14-15-s3': {
      goal: 'Be there when Telemachus comes home.',
      hint: 'Stay in the hut when the dogs go quiet on the path.',
    },
  },
  [
    sc(
      'a14-15-hut',
      [
        N(
          'High on the hill, a yard walled with stones and topped with thorn: twelve sties, and four dogs as fierce as wolves.',
        ),
        N(
          'The dogs see the beggar and rush at him, barking. He has the sense to sit down and let his staff fall.',
        ),
        N(
          'A man runs out of the hut shouting, throwing stones at the dogs until they scatter. He has dropped the leather he was cutting for sandals.',
        ),
        EU(
          'Old man, they nearly had you. That would have been one more grief for me, and I’ve plenty.',
          'shock',
        ),
        EU(
          'Come in, both of you. Eat first. Then tell me where you’re from and what trouble you’re in.',
        ),
        N(
          'He piles brushwood under a shaggy goatskin to make a seat. He brings the best he has, and a drink in a wooden bowl, and serves you himself.',
        ),
        BG('May Zeus give you what you most want, friend, for taking me in like this.', 'soft'),
        EU(
          'Every stranger and beggar is in Zeus’s care. You don’t turn them away, even when you’ve only a little to give.',
        ),
        EU(
          'My master would have done better by you. He was good to me. But he’s dead somewhere far off, and nobody even knows where.',
          'sad',
        ),
        N('The beggar looks into his cup, and doesn’t say anything for a moment.'),
      ],
      [
        ask(
          7,
          'social-studies',
          'a shared rule about welcoming strangers makes a community safer',
          'D2.Civ.8.K-2',
          [
            N(
              'Eumaeus is poor, yet he gives a ragged stranger his best food and a seat. In his world everybody shared the rule of welcoming strangers. What does a community gain from a rule like that?',
            ),
          ],
          [
            o(
              'Travellers and people in need can count on being safe and fed.',
              [
                N(
                  'Yes. When everyone follows the rule, anybody who falls on hard times, including you, can expect a welcome. A shared rule makes people safer.',
                ),
              ],
              true,
            ),
            o('Nothing. It only costs the host.', [
              N(
                'It costs a little, but the host gains too: someday he may be the stranger. A community where everyone helps looks after its own.',
              ),
            ]),
            o('Everyone can ignore rules.', [
              N(
                'The reverse. A rule that everybody keeps is a promise between neighbours, and it works because people trust each other to follow it.',
              ),
            ]),
          ],
          'Learned how a shared rule of welcoming strangers makes a community safer and more trusting.',
        ),
      ],
      [
        ch('alive', '“He might not be dead.”', [
          EU(
            'Every beggar who comes here says that. My mistress gives them a cloak for it. I’ve stopped believing.',
          ),
        ]),
        ch('master', 'Ask Eumaeus about his master.', [
          EU(
            'He was kind. He gave me this hut and these sties. If he’d come home, he’d have given me a field of my own.',
          ),
        ]),
        ch('eat', 'Eat, and let the beggar talk.', [
          BG(
            'Friend, I swear to you: he will come home. This very year, between the old moon and the new.',
          ),
          EU('I’ll believe that when I see him walk in through that gate.'),
        ]),
      ],
    ),
    sc(
      'a14-15-hut-done',
      [
        BG('Mark my words: he will come, between the old moon and the new.'),
        BG(
          'If he comes, give me a cloak and tunic. If he doesn’t, set your dogs on me, and I’ll deserve it.',
        ),
        EU('That would do wonders for my good name. No, old man. Eat.', 'happy'),
      ],
      [
        ask(
          0,
          'science',
          'the Moon takes about a month to go through its phases',
          '1-ESS1-1',
          [
            N(
              'The beggar promised Odysseus would come “between the old moon and the new”, when the Moon is dark at the turn of the month. About how long is it from one new moon to the next?',
            ),
          ],
          [
            o(
              'About 29 or 30 days, roughly a month',
              [
                N(
                  'Yes. The Moon goes through all its phases, from new to full and back to new, in about 29 and a half days. The word month comes from the word moon.',
                ),
              ],
              true,
            ),
            o('About one week', [
              N(
                'A week is only a quarter of the cycle. The Moon takes about a month to go from new, to full, and back again.',
              ),
            ]),
            o('About one year', [
              N(
                'A year holds about twelve of those cycles. One new moon to the next takes about a month.',
              ),
            ]),
          ],
          'Learned that the Moon takes about a month to go through its phases, from one new moon to the next.',
        ),
      ],
    ),
    sc(
      'a14-15-pigs',
      [
        N(
          'At evening the herdsmen drive the pigs home from the oak woods, grunting and squealing, into the sties for the night.',
        ),
        EU(
          'Here, you can help. Mind the big sow, she bites. And mind the little one: it’s faster than it looks.',
        ),
        N(
          'You pour the acorns and the mash. Your Nubbin herds the piglets, badly but with enormous seriousness, into the wrong sty.',
        ),
        EU('Not bad. Not that one. That one. There.', 'happy'),
        N(
          'The night comes in cold and wet, with rain on a west wind. The beggar shivers in his rags by the fire.',
        ),
        BG(
          'Let me tell you a story. Once at Troy we lay out all night in an ambush, and I’d forgotten my cloak…',
          'think',
        ),
        N(
          'It is a long story and a very obvious hint. Eumaeus laughs, and goes and finds him a cloak.',
        ),
        EU('There. Nobody has to tell a tale that long to get a cloak in my hut.', 'happy'),
        N(
          'Then Eumaeus takes his own thick cloak and his spear, and goes out into the rain to sleep by the boars, under a rock out of the wind.',
        ),
      ],
      [
        ask(
          2,
          'maths',
          'multiply to find a total number of pigs',
          '3.OA.A.3',
          [
            N(
              'There are twelve sties. If each sty held 5 pigs, how many pigs would Eumaeus look after?',
            ),
          ],
          [
            o(
              '60 pigs',
              [
                N(
                  'Yes. 12 × 5 = 60. You can do it as 10 × 5 = 50, plus 2 × 5 = 10, which makes 60.',
                ),
              ],
              true,
            ),
            o('17 pigs', [
              N(
                'That is 12 + 5. Twelve sties with five pigs in each is a multiplication: 12 × 5 = 60.',
              ),
            ]),
            o('50 pigs', [
              N('That is 10 × 5, only ten sties. Add the last two sties, 2 × 5 = 10, to get 60.'),
            ]),
          ],
          'Multiplied 12 × 5 to find the number of pigs in twelve sties.',
        ),
        ask(
          8,
          'sel',
          'think about why someone gives up their own comfort for others',
          'CASEL: Social awareness',
          [
            N(
              'Eumaeus gives the beggar a cloak, then goes out into the rain himself to sleep by the pigs. Why do you think he does that?',
            ),
          ],
          [
            o('Because he cares about his animals and his guests more than his own comfort.', [
              N(
                'That’s a fair answer. For Eumaeus, looking after the pigs is looking after his master’s house, and looking after guests is part of the same job.',
              ),
            ]),
            o('Because it is simply what he has done every night for years.', [
              N(
                'That’s a fair answer too. Some kindness is so much a habit that the person doesn’t think of it as special.',
              ),
            ]),
            o('Because he wants the beggar to feel welcome, not guilty.', [
              N(
                'That’s a thoughtful answer. Giving up his bed without making a fuss lets his guest accept it without feeling like a burden.',
              ),
            ]),
          ],
          'Thought about why someone gives up comfort for others (a think question).',
        ),
      ],
      [
        ch('out', 'Go out with Eumaeus to the boars.', [
          N(
            'You go out with him. The rain is cold and the boars are warm and smell terrible, and he makes room for you under the rock without a word.',
          ),
        ]),
        ch('in', 'Stay inside with the beggar.', [
          BG('Look at him go. Out in that, for my pigs. And they say I’m a hard man to impress.'),
        ]),
        ch('cloak', 'Offer Eumaeus your cloak.', [
          EU(
            'Keep it, guest. I’ve done this every night for twenty years. I’d sleep worse indoors.',
          ),
        ]),
      ],
    ),
    sc(
      'a14-15-pigs-done',
      [
        N(
          'In the hut, by the fire, the beggar lies awake a long time under the borrowed cloak, watching the door.',
        ),
      ],
      [
        ask(
          0,
          'science',
          'clothing keeps you warm by trapping the heat your body makes',
          '4-PS3-2',
          [
            N(
              'The beggar was shivering until he got a thick cloak. Why does a thick cloak help you stay warm?',
            ),
          ],
          [
            o(
              'It traps the heat your body makes.',
              [
                N(
                  'Yes. A cloak doesn’t make heat. It holds your own body’s warmth close, so less of it drifts away into the cold air.',
                ),
              ],
              true,
            ),
            o('It makes heat on its own.', [
              N(
                'A cloak has no fire in it. It keeps your own body’s heat from escaping, which is why a thick one works better than a thin one.',
              ),
            ]),
            o('It keeps the rain from being cold.', [
              N(
                'Rain stays cold, but a thick cloak keeps the cold away from your skin and the warmth in. The heat you feel is your own.',
              ),
            ]),
          ],
          'Learned that clothing keeps us warm by trapping body heat.',
        ),
      ],
    ),
    sc(
      'a14-15-son',
      [
        N(
          'Days pass, and one morning the dogs don’t bark at the footsteps on the path. They crowd round the newcomer, whining with joy.',
        ),
        N('Eumaeus is mixing a drink. The bowls fall out of his hands, and he runs to the door.'),
        N(
          'It is Telemachus, home from Sparta. He came round by another way, as Athena told him, and Antinous’s ship waited for nothing.',
        ),
        N(
          'Eumaeus kisses his head and his eyes and his hands, like a father whose only son has come home after ten years away.',
        ),
        TM(
          'I came here first, before the palace. I wanted to know: has my mother married? Is my father’s bed full of cobwebs?',
        ),
        EU('She’s still there. She waits. She cries at night.', 'soft'),
        TM('Go and tell her I’m home. Tell her quietly. Not the suitors.'),
        N(
          'Eumaeus goes. Then there is someone at the edge of the yard whom only the beggar and the dogs can see.',
        ),
        N(
          'The dogs don’t bark; they slink away whining to the far side of the yard. The beggar goes out to her.',
        ),
        N(
          'When he comes back in he is not a beggar. He is tall and dark-bearded, in a clean cloak and tunic.',
        ),
        TM('You’re… a god. You must be. Be kind to us. We’ll bring you gifts.', 'shock'),
        OD('I am no god. I am your father. The one you’ve grieved for.', 'soft'),
      ],
      [
        ask(
          3,
          'sel',
          'happy tears are real: people can cry when they are glad',
          'CASEL: Self-awareness',
          [
            N(
              'Eumaeus is so glad that he drops the bowls and kisses Telemachus’s head. Before the day is over there will be tears. Can people cry when they are happy?',
            ),
          ],
          [
            o(
              'Yes. Happy tears are real.',
              [
                N(
                  'Yes. Strong feelings of any kind can bring tears, including joy and relief. It’s the body’s way of letting a big feeling out.',
                ),
              ],
              true,
            ),
            o('No. Crying is only for sadness.', [
              N(
                'Crying can come with joy, relief and surprise too. Most people have shed a few happy tears at some point.',
              ),
            ]),
            o('Only children cry when they’re happy.', [
              N('Grown-ups do as well. Eumaeus is grown up, and he’s about to cry with joy.'),
            ]),
          ],
          'Learned that people can cry when they are happy as well as when they are sad.',
        ),
      ],
    ),
    sc(
      'a14-15-son-done',
      [
        N(
          'Telemachus doesn’t believe it, and then he does. They hold each other and cry, louder than birds whose young have been taken from the nest.',
        ),
        N('You go out into the yard with your Nubbin, sit on the wall, and leave them to it.'),
      ],
      [
        ask(
          0,
          'literacy',
          'a simile can show how big a feeling is',
          'L.4.5',
          [
            N(
              'They cry “louder than birds whose young have been taken from the nest”. What does that simile tell you about their feeling?',
            ),
          ],
          [
            o(
              'It is very big, and it comes from deep love.',
              [
                N(
                  'Yes. Parent birds cry out because they care for their young so much. The simile tells us the tears come from twenty years of love and waiting.',
                ),
              ],
              true,
            ),
            o('They are being noisy on purpose.', [
              N(
                'Nothing about it is on purpose. The simile shows feeling too big to hold in, like a bird calling for its young.',
              ),
            ]),
            o('They are cross with each other.', [
              N(
                'They are holding each other. The simile is about how loud and deep the feeling is, and the feeling is love and relief.',
              ),
            ]),
          ],
          'Understood a simile as a way to show how big a feeling is.',
        ),
      ],
    ),
    sc(
      'a14-15-complete',
      [
        OD('Tell nobody. Not Eumaeus, not your grandfather, not your mother. Not yet.', 'think'),
        TM('How many are we against? There are more than a hundred of them. And two of us.', 'sad'),
        OD('Two, and the guest. And Athena, and Zeus. Do you think that will do?'),
        TM('Put like that…', 'think'),
        N(
          'By the time Eumaeus comes back, the beggar is a beggar again, sitting by the fire, warming his hands.',
        ),
      ],
      [
        ask(
          1,
          'maths',
          'subtract to compare two groups',
          '2.OA.A.1',
          [
            N(
              'Say there are about 100 suitors. On Odysseus’s side there are three: Odysseus, Telemachus and you. How many more suitors are there than friends?',
            ),
          ],
          [
            o(
              '97 more',
              [
                N(
                  'Yes. 100 − 3 = 97. The odds look impossible, which is why Odysseus is counting on a plan, not numbers.',
                ),
              ],
              true,
            ),
            o('103 more', [
              N(
                'That is 100 + 3. To compare, take the smaller group away from the bigger: 100 − 3 = 97.',
              ),
            ]),
            o('3 more', [
              N(
                'Three is the number of friends. The suitors are the bigger group, so subtract: 100 − 3 = 97.',
              ),
            ]),
          ],
          'Subtracted 100 − 3 to compare two groups and find the difference.',
        ),
      ],
    ),
  ],
  [gl('brushwood', 'Dry sticks and small branches.', 'a14-15-hut')],
);

// ================================================================== A14-16 Argos
/** The first eight lines of the gate scene, shared by every version. */
const GATE_COMMON: Line[] = [
  N(
    'Outside the gate lies a heap of dung from the mules and cattle, waiting to be carried out to the fields. On it lies an old dog.',
  ),
  N(
    'He is crawling with ticks, and nobody looks after him now. His master is away, and the maids don’t bother.',
  ),
  EU(
    'That’s Argos. The master raised him from a pup, and sailed for Troy before he ever got to hunt with him.',
    'sad',
  ),
  EU(
    'Once, no deer in the deep woods could get away from him. The best nose on the island. Look at him now.',
    'sad',
  ),
  N('The old dog lifts his head. His nose works at the air.'),
  N(
    'He knows. After twenty years, through the rags and the staff and the old man’s face, he knows.',
  ),
  N(
    'His ears go flat against his head, and his tail thumps once in the dirt, then again. He can’t get up.',
  ),
  N(
    'The beggar can’t go to him. If he kneels to this dog in front of the swineherd, the whole town will know by dinner.',
  ),
];
const GATE_END: Line[] = [
  EU('Come on, old man. They’ll have eaten it all.'),
  N(
    'Eumaeus goes in through the gate, and the beggar follows. He doesn’t look back at the heap, because he can’t.',
  ),
];
const gateBeats = (): Beat[] => [
  ask(
    7,
    'sel',
    'think about hiding love to stay safe',
    'CASEL: Responsible decision-making',
    [
      N(
        'The beggar loves his dog, but if he kneels to him the whole town will know who he is. Is it right to hide love in order to stay safe?',
      ),
    ],
    [
      o('Yes. His plan matters more than one moment.', [
        N(
          'That’s a fair answer. He is choosing the bigger good, though it costs him something precious.',
        ),
      ]),
      o('No. Love is more important than any plan.', [
        N(
          'That’s a fair answer. Some people would say that a loved one waiting twenty years deserves a kind word, whatever the cost.',
        ),
      ]),
      o('He can show love in small ways that nobody else notices.', [
        N(
          'That’s a thoughtful answer. A small, secret sign of love can be a way to keep faith with both his plan and his dog.',
        ),
      ]),
    ],
    'Thought about whether hiding love to stay safe is right (a think question).',
  ),
];
const A16: EduQuest = quest(
  'a14-16',
  'Argos',
  {
    'a14-16-s1': {
      goal: 'Walk into town with Eumaeus and the beggar.',
      hint: 'Carry the beggar’s bag down the track to the town spring.',
    },
    'a14-16-s2': {
      goal: 'Stop at the gate, by the heap.',
      hint: 'Stand at the courtyard gate with them.',
    },
    'a14-16-s3': {
      goal: 'Sit with Argos in the sun.',
      hint: 'Sit down beside the heap and stay.',
    },
  },
  [
    sc(
      'a14-16-road',
      [
        N(
          'Eumaeus and the beggar set off down the rough track to the town. The beggar leans on his staff, and you carry his bag.',
        ),
        N(
          'At the spring outside the town, where people draw water, a goatherd driving goats to the suitors’ dinner sees you.',
        ),
        N(
          'He jeers at the beggar and kicks out at him as he passes. The beggar takes it, and doesn’t fall, and doesn’t answer.',
        ),
        EU('One day the master will come home and see to you, goatherd.', 'angry'),
        N(
          'Your Nubbin stares at the goatherd all the way out of sight without blinking, which is all it can do, and it does it thoroughly.',
        ),
        BG('Leave it. I’ve had worse from the sea.', 'think'),
      ],
      [
        ask(
          2,
          'sel',
          'stay calm and don’t hit back when someone is unkind',
          'CASEL: Self-management',
          [
            N(
              'The goatherd kicks the beggar, and the beggar doesn’t hit back, because he has a bigger plan. When someone is unkind to you, what are some good ways to respond?',
            ),
          ],
          [
            o(
              'Take a breath, walk away, and tell a trusted grown-up.',
              [
                N(
                  'Yes. Staying calm keeps you in charge of what happens next, and telling a grown-up gets you help, especially if you were hurt.',
                ),
              ],
              true,
            ),
            o('Hit back harder.', [
              N(
                'Hitting back usually makes things worse and can get someone hurt. Walking away and telling someone is stronger.',
              ),
            ]),
            o('Pretend it didn’t hurt.', [
              N(
                'It’s fine to feel hurt. Saying “that wasn’t okay” and telling someone you trust is better than keeping it in.',
              ),
            ]),
          ],
          'Learned how to respond when someone is unkind: stay calm, walk away, tell a trusted grown-up.',
        ),
      ],
    ),
    sc(
      'a14-16-road-done',
      [
        N(
          'The house comes in sight. You can hear a lyre from the yard and smell the meat: the suitors are at dinner.',
        ),
      ],
      [
        ask(
          0,
          'science',
          'we use several senses at once to know what is near',
          '4-LS1-2',
          [
            N(
              'Before you can see inside the house, you hear a lyre and smell roasting meat. Which two senses told you the suitors were at dinner?',
            ),
          ],
          [
            o(
              'Hearing and smell',
              [
                N(
                  'Yes. Ears pick up the sound of the lyre and the nose picks up the smell. Our senses work together to tell us what is nearby.',
                ),
              ],
              true,
            ),
            o('Touch and taste', [
              N(
                'You can’t touch or taste a house that is still far away. Sound and smell travel through the air, so hearing and smell reach you first.',
              ),
            ]),
            o('Sight only', [
              N(
                'You can’t see inside yet. The clues are a sound and a smell, so it is hearing and smell.',
              ),
            ]),
          ],
          'Identified hearing and smell as the senses that detect what is out of sight.',
        ),
      ],
    ),
    sc(
      'a14-16-gate',
      [
        ...GATE_COMMON,
        N('The beggar says one word under his breath, so that only the dog and you can hear it.'),
        BG('Nobody.', 'soft'),
        ...GATE_END,
      ],
      gateBeats(),
    ),
    sc(
      'a14-16-gate-done',
      [N('You stay at the gate with your Nubbin. Somebody should.')],
      [
        ask(
          0,
          'health',
          'what an old dog needs to stay healthy',
          'K-LS1-1',
          [
            N(
              'Argos is old and thin and covered in ticks, because nobody is looking after him. What does an old dog need to stay healthy?',
            ),
          ],
          [
            o(
              'Good food, clean water, a soft bed, and visits to the vet.',
              [
                N(
                  'Yes. Older dogs also like short walks and gentle brushing, and someone to check them for ticks. Looking after a pet well is a big and kind job.',
                ),
              ],
              true,
            ),
            o('Only a heap to lie on.', [
              N(
                'A dung heap isn’t kind or safe. Pets need food, water, shelter, and a person who cares for them.',
              ),
            ]),
            o('Nothing. Dogs look after themselves.', [
              N(
                'Pet dogs depend on people for food, water, shelter and health checks. Argos shows what happens when nobody does it.',
              ),
            ]),
          ],
          'Learned what an old dog needs to stay healthy: food, water, a soft bed, vet visits and care.',
        ),
      ],
    ),
    sc(
      'a14-16-sit',
      [
        N(
          'You sit down beside the heap, in the sun, where it’s warm. Your Nubbin goes up to the old dog slowly, the way it would go up to Moss.',
        ),
        N(
          'Argos sniffs it. Then he lets his head go down, and your Nubbin lies against his side, where the ribs show.',
        ),
        N(
          'From the hall comes the noise of the suitors, and the lyre. Out here there is only the sun, and the flies, and the three of you.',
        ),
        N(
          'He smells of dust and age. Somebody once brushed this coat every day: you can tell from the way it lies.',
        ),
        N('His tail moves once more in the dust, for no one you can see.'),
        N(
          'His eyes are on the gate, where his master went in. He is very tired, and the waiting is done.',
        ),
      ],
      [
        ask(
          1,
          'science',
          'dogs have a keen sense of smell and remember people they love',
          '4-LS1-2',
          [
            N(
              'Argos knew his master through the rags. Dogs have a far keener sense of smell than people, and can remember the scent and voice of someone they love for years. Real dogs live ten to fifteen years, so twenty is the poem’s way of saying he waited a very long time. How did Argos know the beggar?',
            ),
          ],
          [
            o(
              'By his smell and his voice',
              [
                N(
                  'Yes. A dog’s nose and ears are very sharp, and a loved scent stays in a dog’s memory. That is why pet dogs are so thrilled when you come home.',
                ),
              ],
              true,
            ),
            o('By his clothes', [
              N(
                'The beggar’s clothes are rags, which is no clue at all. A dog knows a person by scent and voice.',
              ),
            ]),
            o('By his staff', [
              N(
                'Any old man might carry a staff, so it is no clue. A dog is far more likely to know him by the way he smells and sounds.',
              ),
            ]),
          ],
          'Learned that dogs recognise loved people by scent and voice, and that a dog’s sense of smell is far keener than ours.',
        ),
      ],
      [
        ch('ears', 'Scratch behind his ears.', [
          N(
            'You scratch behind his ears, where a good dog’s ears always want scratching. His eyes half close.',
          ),
        ]),
        ch('sit', 'Just sit with him.', [
          N('You just sit. You don’t need to do anything, and he doesn’t need you to.'),
        ]),
        ch('tell', 'Tell him, quietly, that his master’s home.', [
          Y('He’s home. You were right. He came back.'),
          N('Argos sighs: a long sigh, like a dog lying down at the end of a day in the woods.'),
        ]),
      ],
    ),
    sc(
      'a14-16-sit-done',
      [
        N('Argos puts his head down on his paws, and doesn’t lift it again.'),
        N('Argos has died. His body has stopped working, and it will not start again.'),
        N('He waited twenty years, and saw his master come home, and then he let go.'),
        N(
          'Your Nubbin stays against his side for a long while after, until the sun moves off the heap.',
        ),
      ],
      [
        ask(
          3,
          'sel',
          'what helps after a pet dies',
          'CASEL: Self-awareness',
          [N('It is very sad when a loved animal dies. What can help us afterwards?')],
          [
            o(
              'Remembering them, telling stories, and being with people who care.',
              [
                N(
                  'Yes. Talking about the good times keeps them close, and the people who love you can share the sadness. Crying is part of it.',
                ),
              ],
              true,
            ),
            o('Pretending it never happened.', [
              N(
                'Pretending can make the sadness stay hidden and heavy. It helps to say “I miss him”, and to hear that others do too.',
              ),
            ]),
            o('Getting a new pet straight away.', [
              N(
                'Some people do, in time. But a new pet can’t replace the one you lost. It’s kind to let yourself feel sad first.',
              ),
            ]),
          ],
          'Learned that after a pet dies it helps to remember, talk and be with caring people.',
        ),
      ],
    ),
    sc(
      'a14-16-complete',
      [
        N('Later, Eumaeus comes out and finds you there. He looks at the dog for a long time.'),
        EU(
          'He was a good dog. The best. He’d have known the master anywhere, if the master had come.',
          'sad',
        ),
        N('Eumaeus doesn’t know, and you don’t tell him. That isn’t yours to tell.'),
        N(
          'Together you carry Argos out to the edge of the fields, under an olive tree. Your Nubbin pats the earth down flat with its paws.',
        ),
      ],
      [
        notice(
          3,
          'social-studies',
          'people in ancient Greece put up stones for animals they loved',
          'D2.His.2.K-2',
          [
            N(
              'In ancient Greece and Rome, people sometimes put up small carved stones, with a few lines of writing, for dogs and other animals they loved.',
            ),
            N('Remembering a loved animal is a very old human habit.'),
          ],
          'Learned that people in ancient Greece sometimes made memorial stones for loved animals.',
        ),
      ],
    ),
  ],
  [gl('ticks', 'Tiny creatures that cling to animals and feed on their blood.', 'a14-16-gate')],
);

// ================================================================== A14-17 The Scar
const A17: EduQuest = quest(
  'a14-17',
  'The Scar',
  {
    'a14-17-s1': {
      goal: 'Sit by the fire while Penelope questions the beggar.',
      hint: 'Wait in the hall after the suitors go home.',
    },
    'a14-17-s2': {
      goal: 'Hold the lamp while the old nurse washes his feet.',
      hint: 'Stand by the basin with the lamp.',
    },
    'a14-17-s3': {
      goal: 'Hear Penelope’s dream.',
      hint: 'Stay by the fire while she talks.',
    },
  },
  [
    sc(
      'a14-17-hearth',
      [
        N(
          'Night, and the suitors have gone home to bed. The hall is a mess of cups and crusts and spilt wine.',
        ),
        N(
          'Penelope comes down from her room and sits in her chair by the fire, the one inlaid with ivory and silver.',
        ),
        PN(
          'Stranger, first I’ll ask what everyone asks. Who are you? Where are you from? Who are your people?',
        ),
        BG(
          'Ask me anything but that. If I start remembering I’ll cry, and your maids will think I’m foolish.',
          'sad',
        ),
        PN(
          'Since he went, I have no beauty and no strength left. These men wear me out. I wove a shroud to keep them off, and they caught me.',
          'sad',
        ),
        N(
          'Then the beggar tells her a long tale: that he is from Crete, and once had Odysseus as a guest in his house, on the way to Troy.',
        ),
        PN('Then tell me what he wore. If you can, I’ll believe you.', 'think'),
        BG(
          'A purple cloak, double, with a gold brooch. On it a hound held a fawn in its paws as it struggled. Everyone stared at that brooch.',
          'soft',
        ),
        N(
          'Penelope weeps, the way snow melts on the high mountains when the wind changes. She gave him that cloak herself.',
        ),
        BG(
          'He’s near. He’s alive. He’ll be home within the year, between the old moon and the new.',
          'soft',
        ),
      ],
      [
        ask(
          7,
          'literacy',
          'a small, specific detail is good evidence',
          'RL.3.3',
          [
            N(
              'Penelope asks what Odysseus wore. Why is a detail like the hound on the brooch better proof than just saying “I knew him”?',
            ),
          ],
          [
            o(
              'Only someone who had really seen it would remember such a detail.',
              [
                N(
                  'Yes. Specific details are hard to invent, so they work as evidence. Writers and detectives both look for them.',
                ),
              ],
              true,
            ),
            o('Because it is longer and sounds clever.', [
              N(
                'Length doesn’t prove anything. It’s the detail that matters, because a real memory contains small, odd things a liar wouldn’t think of.',
              ),
            ]),
            o('Because it sounds beautiful.', [
              N(
                'Beautiful words don’t prove anything. A specific detail only someone who was there could know does.',
              ),
            ]),
          ],
          'Learned that specific details work as evidence that someone really saw something.',
        ),
      ],
      [
        ch('eyes', 'Look at the beggar’s eyes.', [
          N(
            'His eyes are dry. He is holding them dry, like a man holding a door shut against the wind.',
          ),
        ]),
        ch('cloth', 'Pass Penelope a cloth for her eyes.', [
          PN('Thank you. You’re a kind guest. You keep strange company, but you’re kind.'),
        ]),
        ch('nubbin', 'Let your Nubbin sit at Penelope’s feet.', [
          N(
            'Your Nubbin sits at her feet and leans on her ankle. She puts her hand down to it without looking, the way you do with an old dog.',
          ),
        ]),
      ],
    ),
    sc(
      'a14-17-hearth-done',
      [
        PN(
          'You’re my guest now. Nurse! Come and wash this man’s feet. He’s the age your master would be.',
        ),
        BG(
          'Not one of the young ones. They’ll laugh. If you have an old woman who has suffered as much as I have, let her do it.',
          'think',
        ),
      ],
      [
        ask(
          0,
          'social-studies',
          'washing a guest’s feet was part of Greek hospitality',
          'D2.His.2.K-2',
          [
            N(
              'In a hot, dusty land where people wore sandals, a host would have a guest’s feet washed. Why would that feel kind after a long walk?',
            ),
          ],
          [
            o(
              'It cools and cleans tired feet, and shows the host cares.',
              [
                N(
                  'Yes. It soothes the guest and says, “You are welcome here.” Many cultures have a small kindness like this for guests.',
                ),
              ],
              true,
            ),
            o('It is just to make the floor clean.', [
              N('The floor isn’t the point. The washing is a comfort and a welcome for the guest.'),
            ]),
            o('It shows the guest is a servant.', [
              N(
                'The opposite. A host washing a guest’s feet, or having them washed, honours the guest.',
              ),
            ]),
          ],
          'Learned that washing a guest’s feet was a welcoming custom in ancient Greek hospitality.',
        ),
      ],
    ),
    sc(
      'a14-17-scar',
      [
        N('Old Eurycleia brings a shining basin and pours in cold water, and then hot.'),
        EC(
          'Gladly, for her sake and for yours. Many strangers have come here, and none so like him. The feet, the voice.',
          'think',
        ),
        BG('Everyone who saw us both says so.', 'think'),
        N(
          'He turns quickly away from the firelight, into the shadow. Too late: he has remembered the scar.',
        ),
        N(
          'Long ago, as a boy, hunting on Mount Parnassus with his grandfather’s sons, a boar ran at him and tore his leg above the knee.',
        ),
        N(
          'Eurycleia runs her hands down his leg, and finds it, and knows it. She lets go, and his foot drops into the basin.',
        ),
        N('The bronze rings and the basin tips. The water runs all over the floor.'),
        EC(
          'You’re Odysseus. You are. My child. And I didn’t know you till I touched you.',
          'shock',
        ),
        N(
          'She turns to tell Penelope. But Penelope is looking the other way: Athena has turned her thoughts elsewhere.',
        ),
        N('The beggar puts his hand over the old woman’s mouth and draws her close.'),
        BG(
          'Nurse. Do you want to ruin me? You nursed me yourself. Be quiet. Nobody must know. Nobody.',
          'angry',
        ),
      ],
      [
        ask(
          5,
          'health',
          'a scar is new, thicker tissue that closes a healed wound',
          '4-LS1-1',
          [
            N(
              'Odysseus’s boar wound healed long ago, yet he still has a scar. Why does a deep cut leave a scar?',
            ),
          ],
          [
            o(
              'The body repairs it with new, thicker tissue that looks different from the skin around it.',
              [
                N(
                  'Yes. Skin can mend a shallow scrape perfectly, but a deep wound is patched with scar tissue, which stays. It is the body’s repair work, still visible.',
                ),
              ],
              true,
            ),
            o('The cut never really heals.', [
              N(
                'It has healed. The scar is the repair: new tissue that closed the wound for good.',
              ),
            ]),
            o('Scars only appear on old people.', [
              N(
                'Scars appear at any age. Anyone with a deep cut can get one, and many people have a scar with a story.',
              ),
            ]),
          ],
          'Learned that a scar is new tissue the body grows to repair a deep wound.',
        ),
      ],
      [
        ch('mop', 'Mop up the water, quickly.', [
          N(
            'You mop it up with a cloth, fast, and fetch more hot water, so it looks like a spill. Penelope doesn’t turn round.',
          ),
        ]),
        ch('watch', 'Watch Penelope.', [
          N(
            'You watch Penelope, who is looking into the fire, very still. Whether she heard, you will never be sure.',
          ),
        ]),
        ch('still', 'Keep still and say nothing.', [
          N(
            'You keep still. Eurycleia’s eyes go to you over his hand, and you nod, and she nods back.',
          ),
        ]),
      ],
    ),
    sc(
      'a14-17-scar-done',
      [
        EC('I’ll be as silent as stone, or iron.', 'soft'),
        BG('Hush, now. Fetch me more water. You spilt the last.', 'soft'),
      ],
      [
        ask(
          1,
          'sel',
          'think about when keeping a secret is right, and when to tell',
          'CASEL: Responsible decision-making',
          [
            N(
              'You saw everything, and you are keeping the secret. When is it right to keep a secret, and when should you tell?',
            ),
          ],
          [
            o('When keeping it protects someone, like a surprise or a safety plan.', [
              N(
                'That’s a fair answer. A secret that protects someone, or is a nice surprise, can be a kindness.',
              ),
            ]),
            o('Never. Secrets cause trouble.', [
              N(
                'That’s a fair answer. Secrets do cause trouble, and many people prefer to be open. Still, a surprise party is a secret too.',
              ),
            ]),
            o('If a secret makes you scared or worried, tell a trusted grown-up.', [
              N(
                'That’s a very wise answer, and a rule worth keeping. Secrets that make you feel unsafe are never yours to carry alone.',
              ),
            ]),
          ],
          'Thought about when to keep a secret and when to tell a trusted adult (a think question).',
        ),
      ],
    ),
    sc(
      'a14-17-dream',
      [
        PN(
          'Stranger, one more thing, and then I’ll let you sleep. I had a dream. Tell me what it means.',
        ),
        PN(
          'I keep twenty geese in the yard. I love to watch them peck their grain. In my dream a great eagle came down from the mountain.',
        ),
        PN(
          'When he flew off again, the geese were gone, every one. I wept, and the women came to comfort me.',
        ),
        PN(
          'Then the eagle came back and sat on the roof-beam, and spoke with a man’s voice. “I am your husband,” he said, “come home.”',
        ),
        BG('There’s only one way to read that, lady. The eagle told you himself.', 'soft'),
        PN(
          'Dreams are hard to read. They come to us through two gates: one made of horn, and one of ivory.',
          'think',
        ),
        PN(
          'The dreams that come through the ivory gate deceive us. The ones through the gate of horn come true. I don’t think mine came through the horn.',
          'sad',
        ),
        N(
          'Two gates. You think of yours, at home, and how it sticks, and how you always know who has come through it.',
        ),
        PN(
          'Tomorrow I’ll set them a test: my husband’s bow, and twelve axes in a row. Whoever can string the bow and shoot through all twelve, I’ll go with.',
          'sad',
        ),
        BG('Do it. Don’t put it off. He’ll be here before any of them can string it.', 'soft'),
      ],
      [
        ask(
          1,
          'maths',
          'share 20 into 4 equal groups',
          '3.OA.A.3',
          [
            N(
              'Penelope keeps twenty geese. If she put them in four equal rows, how many geese would be in each row?',
            ),
          ],
          [
            o('5 geese', [N('Yes. 20 ÷ 4 = 5, because 4 × 5 = 20.')], true),
            o('16 geese', [
              N(
                'That is 20 − 4. Dividing into four equal rows asks: what number times 4 makes 20? That is 5.',
              ),
            ]),
            o('80 geese', [
              N(
                'That is 20 × 4, which makes the groups bigger instead of sharing them. Share 20 into four rows: 20 ÷ 4 = 5.',
              ),
            ]),
          ],
          'Divided 20 by 4 to share geese into four equal rows.',
        ),
        ask(
          6,
          'literacy',
          'a symbol stands for a bigger idea',
          'L.4.5',
          [
            N(
              'Penelope’s two dream gates are a symbol: the ivory gate stands for false dreams, and the gate of horn for true ones. What is a symbol?',
            ),
          ],
          [
            o(
              'Something that stands for a bigger idea.',
              [
                N(
                  'Yes. A gate, a dove, or a flag can each stand for something larger. Writers use symbols to say a lot in a few words.',
                ),
              ],
              true,
            ),
            o('A word that sounds like another word.', [
              N(
                'That’s a homophone, like strait and straight. A symbol is an object or image that stands for a bigger idea, like the two gates.',
              ),
            ]),
            o('A very long description.', [
              N(
                'A symbol can be tiny, even one object. What makes it a symbol is that it stands for something bigger.',
              ),
            ]),
          ],
          'Learned that a symbol is something that stands for a bigger idea, like the two dream gates.',
        ),
      ],
    ),
    sc(
      'a14-17-dream-done',
      [
        N(
          'Penelope goes up to her room and cries for her husband until Athena closes her eyes in sleep.',
        ),
        N(
          'The beggar lies down in the porch on an ox-hide, with fleeces over him. He doesn’t sleep, and neither do you.',
        ),
      ],
      [
        ask(
          1,
          'sel',
          'ways to settle worries that keep you awake',
          'CASEL: Self-management',
          [
            N(
              'The beggar and you lie awake, thinking about tomorrow. What can help when worries keep you awake at night?',
            ),
          ],
          [
            o(
              'Slow breathing, thinking of something calm, or telling a grown-up.',
              [
                N(
                  'Yes. Slow breaths settle the body, a calm picture settles the mind, and telling someone often makes a worry smaller.',
                ),
              ],
              true,
            ),
            o('Staring at the worry as hard as you can.', [
              N(
                'Staring at a worry usually makes it bigger. A calm thought or a slow breath, or talking to someone, works better.',
              ),
            ]),
            o('Telling yourself you must never worry.', [
              N(
                'Everyone worries sometimes. The trick is helping the worry quieten down, with breathing, calm thoughts or a chat with someone you trust.',
              ),
            ]),
          ],
          'Learned ways to settle worries at night: slow breathing, calm thoughts, talking to a grown-up.',
        ),
      ],
    ),
    sc(
      'a14-17-complete',
      [
        N(
          'In the night the beggar hears some of the maids going out, laughing, to meet the suitors.',
        ),
        N(
          'His heart growls in his chest like a dog standing over her pups. He tells it to be still: it has borne worse.',
        ),
        BG(
          'In the cave, with the giant, I had to wait. I waited then. I can wait one more night.',
          'soft',
        ),
        N('Your Nubbin has fallen asleep against his back. He lets it.'),
      ],
      [
        ask(
          1,
          'science',
          'animal parents protect and care for their young',
          '1-LS1-2',
          [
            N(
              'His heart growls “like a dog standing over her pups”. Why do animal parents guard their young so fiercely?',
            ),
          ],
          [
            o(
              'Young animals can’t protect or feed themselves yet.',
              [
                N(
                  'Yes. Puppies, chicks and calves depend on their parents for food, warmth and safety until they can manage alone.',
                ),
              ],
              true,
            ),
            o('Because the young are very heavy.', [
              N(
                'Weight has nothing to do with it. Young animals are small and weak, so their parents protect them.',
              ),
            ]),
            o('They don’t. Animals don’t care.', [
              N(
                'Many animals care a great deal for their young. Dogs, birds and elephants all guard and look after theirs.',
              ),
            ]),
          ],
          'Learned that animal parents guard and feed their young because the young cannot yet look after themselves.',
        ),
      ],
    ),
  ],
  [gl('brooch', 'A decorative pin worn on clothes.', 'a14-17-hearth')],
);

// ================================================================== A14-18 The Bow
const A18: EduQuest = quest(
  'a14-18',
  'The Bow',
  {
    'a14-18-s1': {
      goal: 'Help carry the axes into the hall.',
      hint: 'Bring the axes from the storeroom, two at a time.',
    },
    'a14-18-s2': {
      goal: 'Watch the suitors try the bow.',
      hint: 'Stand where you can see the bow and the door.',
    },
    'a14-18-s3': {
      goal: 'See the beggar string the bow.',
      hint: 'Watch from beside his stool.',
    },
  },
  [
    sc(
      'a14-18-axes',
      [
        N(
          'Morning: a feast day for Apollo the archer. The suitors come early, as they always do, and sit down to eat.',
        ),
        N(
          'Penelope climbs to the high storeroom with a bronze key on an ivory handle. The doors groan open like a bull in a meadow.',
        ),
        N(
          'Inside, on a peg, hangs the great bow in its case. A friend gave it to Odysseus long ago, as a guest-gift.',
        ),
        N('He never took it to Troy. He left it at home, to remember his friend by.'),
        N(
          'Penelope sits down with the bow across her knees and cries over it. Then she gets up and carries it down to the hall.',
        ),
        PN(
          'Listen to me, all of you. Here is my husband’s bow. Whoever strings it most easily and shoots through all twelve axes, I’ll go with him.',
          'sad',
        ),
        N(
          'Telemachus digs a long trench in the floor, straight to a line, and sets the axes up one behind another. You carry them in, two at a time.',
        ),
        N(
          'Each axe-head has a ring at the top where the handle would go: twelve rings, in one straight line, for an arrow to pass through.',
        ),
        TM('I’ll try it first. If I can string it, my mother can stay here with me.'),
        N(
          'Three times he tries, and the fourth time he nearly has it. Then he sees the beggar give the smallest shake of the head, and stops.',
        ),
      ],
      [
        ask(
          6,
          'maths',
          'divide 12 by 2 to find the number of trips',
          '3.OA.A.3',
          [N('There are twelve axes, and you carry two at a time. How many trips do you make?')],
          [
            o(
              '6 trips',
              [
                N(
                  'Yes. 12 ÷ 2 = 6, because 6 × 2 = 12. Counting in twos: 2, 4, 6, 8, 10, 12 takes six steps.',
                ),
              ],
              true,
            ),
            o('10 trips', [
              N(
                'That would carry just 1 axe on most trips. Count in twos to twelve: 2, 4, 6, 8, 10, 12. That is six trips.',
              ),
            ]),
            o('24 trips', [
              N(
                'That is 12 × 2, which is more than needed. Twelve axes, carried two at a time, is 12 ÷ 2 = 6 trips.',
              ),
            ]),
          ],
          'Divided 12 axes into pairs to find 6 trips.',
        ),
        ask(
          9,
          'sel',
          'think about stopping when a trusted person signals you to wait',
          'CASEL: Self-management',
          [
            N(
              'Telemachus is very close to stringing the bow, then stops when his father shakes his head. Was that giving up, or being wise?',
            ),
          ],
          [
            o('Wise. He trusted a bigger plan over his pride.', [
              N(
                'That’s a fair answer. Stopping when it was hard to stop took self-control. He chose the plan over looking strong.',
              ),
            ]),
            o('Giving up. He was so close.', [
              N(
                'That’s a fair answer. It must have hurt to stop. The question is whether finishing would have helped or harmed the plan.',
              ),
            ]),
            o('Both. It was hard, and it was the right thing.', [
              N(
                'That’s a thoughtful answer. Doing the wise thing is often also the hardest thing.',
              ),
            ]),
          ],
          'Thought about whether stopping at a trusted signal is giving up or being wise (a think question).',
        ),
      ],
      [
        ch('nod', 'Nod at Telemachus.', [
          TM('Too weak. Too young. Or the gods are against it. Let someone stronger try.'),
          N('He says it well. He sits down near his father, and nobody notices that either.'),
        ]),
        ch('pass', 'Pass the bow along to the suitors.', [
          N(
            'You carry it down the line. It is heavier than any bow you’ve ever held, and the string hums faintly when you touch it.',
          ),
        ]),
        ch('watch', 'Watch the beggar.', [
          N(
            'The beggar is looking at the bow the way you’d look at an old friend across a crowded room.',
          ),
        ]),
      ],
    ),
    sc(
      'a14-18-axes-done',
      [N('The suitors line up to try, from left to right, the way the wine goes round.')],
      [
        ask(
          0,
          'science',
          'a drawn bow stores energy that becomes the arrow’s movement',
          '4-PS3-4',
          [
            N(
              'When you pull back a bowstring, the bow bends and stores energy, like a stretched spring. What happens to that stored energy when you let go?',
            ),
          ],
          [
            o(
              'It turns into the movement of the arrow.',
              [
                N(
                  'Yes. The bent bow springs straight and pushes the arrow forward. Stored energy becoming movement is how catapults and trampolines work too.',
                ),
              ],
              true,
            ),
            o('It disappears.', [
              N(
                'Energy never just disappears. Here it changes form: from stored energy in the bent bow to movement of the arrow.',
              ),
            ]),
            o('It goes into the string and stays there.', [
              N(
                'Some warms the bow and string a little, but most becomes the arrow’s movement. That is what sends the arrow flying.',
              ),
            ]),
          ],
          'Learned that a drawn bow stores energy that changes into the movement of the arrow.',
        ),
      ],
    ),
    sc(
      'a14-18-suitors',
      [
        N(
          'Leodes tries first: the only one of them who ever disapproved of the rest. His soft hands can’t bend it an inch.',
        ),
        AN('Warm it at the fire. Grease it with fat. It’s only stiff from the storeroom.'),
        N(
          'They warm it and grease it. One after another they try, and fail, and pass it on, red in the face.',
        ),
        N(
          'Only Antinous and Eurymachus, the strongest, haven’t tried yet. They are taking their time.',
        ),
        N(
          'Out in the yard the beggar is talking to Eumaeus, low. Then he pulls back his rags and shows him the scar.',
        ),
        N(
          'Eumaeus sits down on the step as if his legs have gone. Then he gets up and hugs the beggar, and kisses his head and his shoulders.',
        ),
        BG(
          'Go and tell the nurse to lock the women’s doors. And bar the yard gate, Eumaeus. Tie it with a rope.',
          'think',
        ),
        N('Eumaeus ropes the yard gate shut and tests it twice. It doesn’t stick; it just holds.'),
      ],
      [
        ask(
          0,
          'literacy',
          'describe a character by what they do',
          'RL.3.3',
          [
            N(
              'Leodes is the only suitor who ever disapproved of the others. What does that tell us about him?',
            ),
          ],
          [
            o(
              'He knows right from wrong, even when his friends don’t.',
              [
                N(
                  'Yes. A character who disagrees with the crowd shows us he has a mind of his own. We learn who people are by what they do when others do otherwise.',
                ),
              ],
              true,
            ),
            o('He is the strongest.', [
              N(
                'The scene says the opposite: his soft hands can’t bend the bow an inch. Disapproving shows his character, not his strength.',
              ),
            ]),
            o('He is the tallest.', [
              N(
                'Nothing says anything about his height. What the writer tells us is that he disapproved of the others, which shows his sense of right and wrong.',
              ),
            ]),
          ],
          'Described a character’s qualities from what he does (disapproving when others don’t).',
        ),
      ],
      [
        ch('door', 'Stand by the hall door with Eumaeus.', [
          N(
            'You stand by the door with Eumaeus, who is shaking. He tells you, very quietly, that he has never been so happy in his life.',
          ),
        ]),
        ch('stool', 'Go and stand by the beggar’s stool.', [
          N(
            'You go and stand by his stool. He puts a hand on your shoulder for a moment, like a man steadying himself.',
          ),
        ]),
        ch('nubbin', 'Keep your Nubbin close.', [
          N('You pick up your Nubbin and hold it. It’s going to get loud in here; it already is.'),
        ]),
      ],
    ),
    sc(
      'a14-18-suitors-done',
      [
        N(
          'Eurymachus tries, and fails, and groans. Antinous says it’s a holy day, no day for bending bows: they’ll try again tomorrow.',
        ),
      ],
      [
        notice(
          0,
          'social-studies',
          'the ancient Greeks kept festival days, and many communities still do',
          'D2.His.2.K-2',
          [
            N(
              'The ancient Greeks set aside days for festivals, with feasts, music, games and processions for their gods. A holy day was a day apart from ordinary work.',
            ),
            N(
              'Many communities around the world still keep festival days, which bring people together to share food, stories and traditions.',
            ),
          ],
          'Learned that ancient Greeks kept festival days, and that festivals still bring communities together.',
        ),
      ],
    ),
    sc(
      'a14-18-string',
      [
        BG(
          'My lords, let me try the old bow. I’d like to know if there’s any strength left in these old arms.',
        ),
        AN('You? A beggar? You’re lucky we let you eat with us. Eat up and be quiet.', 'angry'),
        PN(
          'Antinous, it isn’t right to insult a guest in this house. Do you think, if he strings it, he’ll take me home? He doesn’t think so himself.',
          'angry',
        ),
        TM('The bow is mine to give, Mother. Go up to your room. I’ll see to this.', 'soft'),
        N(
          'She goes, wondering at her son, and upstairs Athena puts her into a deep sleep. She will hear nothing of what comes next.',
        ),
        N(
          'Eumaeus carries the bow down the hall through the shouting and puts it into the beggar’s hands.',
        ),
        N(
          'He turns it over and over, feeling along it for worm in the horn after so many years. The suitors snigger.',
        ),
        N(
          'Then, as easily as a bard fits a new string to his lyre, he strings the great bow, without even standing up.',
        ),
        N('He plucks the string. It sings, clear and sweet, like a swallow.'),
        N('Out of a clear sky Zeus thunders, once, and the hall goes white. The beggar smiles.'),
        N(
          'He fits an arrow, and from where he sits he draws, and lets fly. It goes clean through all twelve axes and out the other side.',
        ),
        BG(
          'Telemachus, your guest hasn’t shamed you. I didn’t miss, and I didn’t take long over the stringing. There’s strength in me yet.',
          'soft',
        ),
      ],
      [
        ask(
          8,
          'music',
          'a tighter string makes a higher note',
          '1-PS4-1',
          [
            N(
              'The bowstring sings when it is plucked, just like a lyre string. If he tightened the string even more, what would happen to the note?',
            ),
          ],
          [
            o(
              'It would go higher.',
              [
                N(
                  'Yes. A tighter string wobbles faster, and faster wobbles make a higher note. That is how musicians tune a lyre, a guitar or a violin.',
                ),
              ],
              true,
            ),
            o('It would go lower.', [
              N(
                'Lower notes come from slower wobbles, and a looser string. A tighter string wobbles faster and sounds higher.',
              ),
            ]),
            o('It would stay exactly the same.', [
              N(
                'Tightening changes the note. The tighter the string, the faster it vibrates, and the higher the sound.',
              ),
            ]),
          ],
          'Learned that a tighter string vibrates faster and makes a higher note.',
        ),
      ],
    ),
    sc(
      'a14-18-complete',
      [
        N('The hall is silent. Somewhere outside, a dog barks, and stops.'),
        N(
          'Telemachus picks up his sword and spear and comes and stands by his father’s chair, armed in bronze.',
        ),
        N(
          'The beggar stands up, and he isn’t stooping any more. He hasn’t been for a while, and nobody noticed.',
        ),
        N('You hold your Nubbin a little tighter. It is very quiet in the hall.'),
      ],
      [
        ask(
          3,
          'sel',
          'calm a racing heart in a tense moment',
          'CASEL: Self-management',
          [
            N(
              'It is very quiet in the hall, and your heart is thumping. What can help calm a racing heart?',
            ),
          ],
          [
            o(
              'Slow breaths in and out, and holding someone safe.',
              [
                N(
                  'Yes. Breathing slowly tells your body it can ease off, and holding your Nubbin helps. Try breathing in for four, out for four.',
                ),
              ],
              true,
            ),
            o('Holding your breath.', [
              N(
                'Holding your breath can make the heart feel louder. Slow, steady breaths calm it better.',
              ),
            ]),
            o('Telling yourself you can’t be scared.', [
              N(
                'Being scared is normal. It’s better to say “I’m nervous”, and then breathe slowly.',
              ),
            ]),
          ],
          'Learned that slow breathing and a safe hug can calm a racing heart in a tense moment.',
        ),
      ],
    ),
  ],
  [],
);

// ================================================================== A14-19 The Hall Cleared
const A19: EduQuest = quest(
  'a14-19',
  'The Hall Cleared',
  {
    'a14-19-s1': {
      goal: 'Stand behind him in the doorway.',
      hint: 'Stay just behind the threshold with Telemachus and Eumaeus.',
    },
    'a14-19-s2': {
      goal: 'Hold your ground as Athena comes.',
      hint: 'Stay in the doorway. Don’t run.',
    },
    'a14-19-s3': {
      goal: 'Help set the hall straight.',
      hint: 'Collect the cups from under the tables.',
    },
  },
  [
    sc(
      'a14-19-threshold',
      [
        N(
          'He throws off his rags. He leaps up onto the great stone threshold with the bow and the quiver, and pours the arrows out at his feet.',
        ),
        N(
          'Telemachus stands on one side of him and Eumaeus on the other, with spears. You are just behind, with your Nubbin.',
        ),
        N(
          'His first arrow knocks the gold cup out of Antinous’s hand as he lifts it to drink. The wine goes everywhere.',
        ),
        N(
          'The suitors look round the walls for the shields and spears that always hang there. The walls are bare: Telemachus took them down last night.',
        ),
        OD(
          'You thought I’d never come home from Troy. You ate my house. You courted my wife while I was alive. You didn’t fear the gods.',
          'angry',
        ),
        N(
          'He doesn’t say his name, and he doesn’t need to. Every face in the hall has gone the colour of whey.',
        ),
        EM(
          'If you really are Odysseus, home again, then you’re right, all of it. We’ll pay it back. Every sheep, every cup, twenty times over.',
          'shock',
        ),
        OD('Not if you gave me everything your fathers ever had. This is my house.', 'angry'),
      ],
      [
        ask(
          7,
          'social-studies',
          'think about whether paying back is enough to make things fair',
          'D2.Civ.8.K-2',
          [
            N(
              'Eurymachus offers to pay everything back twenty times over, and Odysseus says no. When someone has wronged others, is paying back enough to make things fair?',
            ),
          ],
          [
            o('Yes. Repairing the damage is the heart of fairness.', [
              N(
                'That’s a fair answer. Putting right what was damaged matters a great deal, and many fair systems start there.',
              ),
            ]),
            o('No. They must also be truly sorry and promise not to do it again.', [
              N(
                'That’s a fair answer. Paying for damage doesn’t show whether someone has changed. Trust usually needs both.',
              ),
            ]),
            o('It depends on what was taken. Some things can’t be paid back.', [
              N(
                'That’s a thoughtful answer. Time, trust and safety can’t be handed back like a cup, and that is why wrongs of that kind are harder to put right.',
              ),
            ]),
          ],
          'Thought about fairness and whether paying back is enough to put things right (a think question).',
        ),
      ],
      [
        ch('stand', 'Stand with Telemachus.', [
          N('You stand by Telemachus. He’s trembling, and so are you, and neither of you moves.'),
        ]),
        ch('gate', 'Slip out and untie the rope on the yard gate.', [
          N(
            'You slip out and untie the rope, and leave the yard gate standing open. Whatever happens in there, there should be a way out.',
          ),
        ]),
        ch('nubbin', 'Put your Nubbin behind you.', [
          N(
            'You put your Nubbin behind you. It puts its paws on the backs of your knees, to be sure you’re still there.',
          ),
        ]),
      ],
    ),
    sc(
      'a14-19-threshold-done',
      [
        N(
          'Eurymachus draws his sword and shouts to the others to rush the door. Nobody wants to be first, and then everyone moves at once.',
        ),
      ],
      [
        ask(
          0,
          'health',
          'when we are frightened our heart and breathing speed up to get the body ready',
          'CASEL: Self-awareness',
          [
            N(
              'When you are scared, your heart beats faster and you breathe more quickly. Why does the body do this?',
            ),
          ],
          [
            o(
              'It gets the muscles ready to act, with extra blood and oxygen.',
              [
                N(
                  'Yes. It is an old, useful alarm system. Slow, steady breathing tells the body the danger has passed.',
                ),
              ],
              true,
            ),
            o('Because the body is broken.', [
              N(
                'Not at all. It’s the body working exactly as it should, preparing you to run, fight, or stay very still.',
              ),
            ]),
            o('Because the body wants to sleep.', [
              N(
                'The opposite. A fast heart and quick breathing wake the body up and get it ready for action.',
              ),
            ]),
          ],
          'Learned that a racing heart and quick breathing when scared are the body’s alarm system, and slow breathing calms it.',
        ),
      ],
    ),
    sc(
      'a14-19-aegis',
      [
        N(
          'Then there is someone else in the doorway: old Mentor, or someone wearing his face. Then a swallow flies up to the smoky roof-beam and sits there.',
        ),
        N(
          'From the roof Athena raises the aegis, the shield of Zeus. It touches no one; it doesn’t need to.',
        ),
        N(
          'Terror goes through the hall like a wind. The suitors scatter like cattle when the gadfly gets among them in the long days of spring.',
        ),
        N(
          'They run: out of the side door, over the courtyard wall, through the yard and down the road to the town. Cups and stools go flying.',
        ),
        N(
          'Antinous runs fastest of all, with his cloak over his head. Eurymachus is not far behind.',
        ),
        N('Odysseus stands in the doorway and lets them go. Not one arrow leaves the quiver.'),
        N(
          'Then they are gone, down the road into the town, and they don’t come back. Not that night, and not ever.',
        ),
      ],
      [
        ask(
          2,
          'literacy',
          'a simile compares a panicking crowd to cattle bothered by a gadfly',
          'L.4.5',
          [
            N(
              'The suitors scatter “like cattle when the gadfly gets among them”. A gadfly is a biting fly that drives cattle wild. What does the simile tell you about the suitors?',
            ),
          ],
          [
            o(
              'They panic and run in every direction.',
              [
                N(
                  'Yes. Cattle bothered by a gadfly stampede with no plan, which is exactly how the suitors look. A good simile packs a whole picture into a few words.',
                ),
              ],
              true,
            ),
            o('They walk away calmly.', [
              N(
                'Cattle bothered by a gadfly don’t walk calmly. They bolt. The simile shows the suitors panicking.',
              ),
            ]),
            o('They stand still and watch.', [
              N('A gadfly sends cattle running. The simile means the suitors scatter and run.'),
            ]),
          ],
          'Explained a simile (cattle and a gadfly) to show how the suitors panic.',
        ),
      ],
    ),
    sc(
      'a14-19-aegis-done',
      [
        N(
          'The hall is empty. The swallow on the roof-beam is gone, and there is only the mess, and the sound of your own breathing.',
        ),
        TM('They’re gone. They’re really gone.', 'shock'),
      ],
      [
        ask(
          0,
          'science',
          'swallows nest under roofs and migrate south each winter',
          '3-LS4-3',
          [
            N(
              'Swallows build mud nests under roofs. When summer ends, they fly thousands of kilometres south to warmer lands, and come back in spring. What is this long yearly journey called?',
            ),
          ],
          [
            o(
              'Migration',
              [
                N(
                  'Yes. Migration lets animals find food and warmth when their home turns cold. Swallows, whales and many butterflies migrate.',
                ),
              ],
              true,
            ),
            o('Hibernation', [
              N(
                'Hibernation is when an animal sleeps through the winter. Swallows don’t sleep it off; they fly away to warmer places.',
              ),
            ]),
            o('Evolution', [
              N(
                'Evolution is slow change over many generations. A swallow’s yearly flight to warmer lands is called migration.',
              ),
            ]),
          ],
          'Learned that swallows migrate: they travel long distances each year to find food and warmth.',
        ),
      ],
    ),
    sc(
      'a14-19-clean',
      [
        N(
          'Old Eurycleia comes running from the women’s rooms, sees the empty hall, and opens her mouth to cheer.',
        ),
        OD(
          'No. Be glad in your heart, nurse, and keep quiet. It isn’t right to crow over beaten men.',
          'soft',
        ),
        N(
          'Under a table, hugging his lyre, is Phemius the bard. Beside him, under a cowhide, is Medon the herald.',
        ),
        TM(
          'Father, leave them be. Phemius only sang because they made him. Medon looked after me when I was small.',
          'soft',
        ),
        OD(
          'Come out, both of you. You’re safe. Go and tell people that doing right is better than doing wrong.',
          'soft',
        ),
        N(
          'Then the work. The maids carry out the broken stools, Telemachus and Eumaeus scrape the tables, and you collect cups from under everything.',
        ),
        N(
          'Odysseus asks for fire and sulphur to make the hall clean, and lights the fire himself. The smoke goes up through the roof, out over Ithaca.',
        ),
      ],
      [
        ask(
          4,
          'sel',
          'staying humble after winning, and showing mercy',
          'CASEL: Social awareness',
          [
            N(
              'Odysseus spares the bard and the herald, and tells Eurycleia not to cheer over beaten men. Why is it good to stay humble when you have won?',
            ),
          ],
          [
            o(
              'It stops winning from turning into cruelty, and lets peace begin.',
              [
                N(
                  'Yes. Gloating makes enemies and keeps a quarrel alive. Showing mercy is what lets everyone go home afterwards.',
                ),
              ],
              true,
            ),
            o('It isn’t good. Winners should show off.', [
              N(
                'Showing off might feel good for a minute, but it hurts others and makes new quarrels. Being gracious is stronger.',
              ),
            ]),
            o('It doesn’t matter either way.', [
              N(
                'It matters a lot to the people who lost. Kindness after winning can turn an enemy into a neighbour.',
              ),
            ]),
          ],
          'Learned that staying humble and showing mercy after winning helps people make peace.',
        ),
        ask(
          5,
          'maths',
          'add one to a count',
          '2.OA.A.1',
          [
            N(
              'You find 41 cups on the tables, and your Nubbin finds one more under the bard’s chair. How many cups is that?',
            ),
          ],
          [
            o('42 cups', [N('Yes. 41 + 1 = 42.')], true),
            o('40 cups', [
              N('That is 41 − 1. Your Nubbin found an extra cup, so add: 41 + 1 = 42.'),
            ]),
            o('82 cups', [
              N('That is 41 + 41. Your Nubbin found just one extra cup, so it is 41 + 1 = 42.'),
            ]),
          ],
          'Added 41 + 1 to find 42 cups.',
        ),
      ],
      [
        ch('cups', 'Stack the cups by the door.', [
          N('You stack the cups by the door and count them again, to be sure.'),
        ]),
        ch('maids', 'Help the maids with the stools.', [
          N(
            'The maids work fast and don’t talk. One of them, the one who told about the loom, works fastest of all, and won’t look up.',
          ),
        ]),
        ch('bard', 'Sit with the shaking bard a while.', [
          N(
            'You sit with Phemius on the step. His hands won’t stop shaking, so he tunes his lyre, very badly, until they do.',
          ),
        ]),
      ],
    ),
    sc(
      'a14-19-clean-done',
      [
        N(
          'The hall is clean and the fire burns clear. Eurycleia goes up the stairs to wake Penelope, and nearly falls over her own feet.',
        ),
      ],
      [
        ask(
          0,
          'health',
          'cleaning up and fresh air keep a room healthy',
          'CASEL: Responsible decision-making',
          [
            N(
              'After the mess, the hall is scrubbed and the smoke goes up through the roof. Why is it healthy to clean up after a mess and let fresh air in?',
            ),
          ],
          [
            o(
              'It clears away dirt, germs and stale smoke.',
              [
                N(
                  'Yes. Cleaning removes the things that can make people ill, and fresh air carries stale air and smoke away.',
                ),
              ],
              true,
            ),
            o('It makes the room warmer.', [
              N(
                'Fresh air can make a room cooler, not warmer. The point is to clear away dirt, germs and smoke.',
              ),
            ]),
            o('It isn’t important.', [
              N(
                'A clean room with fresh air helps keep everyone well, which matters when people are going to live there.',
              ),
            ]),
          ],
          'Learned that cleaning and fresh air keep a room healthy by removing dirt, germs and stale smoke.',
        ),
      ],
    ),
    sc(
      'a14-19-complete',
      [
        OD('You stood in my door when it mattered. Guest-friend. Come here.', 'soft'),
        N('He takes the great bow and unstrings it, carefully, and puts it into your hands.'),
        OD(
          'A friend gave me this once, a guest-friend, long ago. I never took it to war. I kept it at home, over the door, to remember him by.',
        ),
        OD(
          'Do the same. Keep it unstrung, over your own door, and remember you had a friend on Ithaca.',
          'soft',
        ),
      ],
      [
        ask(
          3,
          'literacy',
          'a gift can carry a friendship across time: theme',
          'RL.4.2',
          [
            N(
              'The bow was a guest-gift to Odysseus, and now it is a guest-gift to you. What idea about friendship does this show?',
            ),
          ],
          [
            o(
              'Gifts can carry a friendship across time and distance.',
              [
                N(
                  'Yes. A theme is a big idea a story returns to. Here the bow keeps a friendship alive long after the friends have parted.',
                ),
              ],
              true,
            ),
            o('Weapons are the best presents.', [
              N(
                'The bow is a weapon, but what matters is the memory it holds. The idea is about friendship, not fighting.',
              ),
            ]),
            o('You should never give away a gift.', [
              N(
                'Odysseus is doing the very opposite. Passing the bow on is how a friendship goes on.',
              ),
            ]),
          ],
          'Identified a theme: gifts carry friendships across time and distance.',
        ),
      ],
    ),
  ],
  [
    gl(
      'aegis',
      'In Greek stories, the shield of Zeus, carried by Athena, that fills enemies with fear.',
      'a14-19-aegis',
    ),
  ],
);

// ================================================================== A14-20 The Olive-Tree Bed
/** The first twelve lines of the bed scene, shared by every version. */
const BED_COMMON: Line[] = [
  OD(
    'Strange woman. The gods made you harder than anyone. Nurse, make me up a bed out here. I’ll sleep alone.',
    'sad',
  ),
  PN(
    'I’m not proud, and I’m not cold. I know very well what you looked like when you sailed.',
    'soft',
  ),
  PN(
    'Eurycleia, move the great bed out of our room, the one he built himself. Make it up for him out here.',
    'think',
  ),
  N('Odysseus goes white. He stands up.'),
  OD(
    'Who moved my bed? Nobody could. Nobody living could shift it, however young and strong, unless a god helped him.',
    'angry',
  ),
  OD(
    'I built it. An olive tree grew in the courtyard, tall and thick and green, and I built our room round it, stone by stone.',
    'angry',
  ),
  OD(
    'I roofed it and hung the doors. Then I cut away the branches, trimmed the trunk, and made it the bedpost. I bored the holes myself.',
  ),
  OD('That was our secret. Has someone cut the trunk? Tell me. Is my bed still there?', 'sad'),
  N('Her knees give way. She runs to him, and puts her arms round his neck, and kisses him.'),
  PN(
    'Don’t be angry with me. So many men have come with stories. I had to be sure it was you.',
    'sad',
  ),
  N(
    'He holds her and weeps. She is to him what the land is to a swimmer who has been a long time in the sea.',
  ),
  N(
    'Athena holds back the dawn at the edge of the world, and keeps the horses of the morning in their stable, so the night goes on.',
  ),
];
const bedBeats = (): Beat[] => [
  ask(
    6,
    'science',
    'roots anchor a tree, so a bedpost made from a living trunk can’t be moved',
    '4-LS1-1',
    [
      N(
        'Odysseus built the bed from a living olive trunk, still rooted in the ground. Why is a tree with roots so hard to move?',
      ),
    ],
    [
      o(
        'Its roots anchor it deep in the ground.',
        [
          N(
            'Yes. Roots spread out and grip the soil, which holds a tree in place in strong winds. A bed built from a rooted trunk is part of the house itself.',
          ),
        ],
        true,
      ),
      o('Because the trunk is made of iron.', [
        N('Wood isn’t iron. It is the roots under the ground that hold a living tree fast.'),
      ]),
      o('Because nobody has tried to move it.', [
        N('The point is that nobody could. A rooted tree is held by its roots.'),
      ]),
    ],
    'Learned that roots anchor a tree, which is why a bed built round a living trunk cannot be moved.',
  ),
];
const A20: EduQuest = quest(
  'a14-20',
  'The Olive-Tree Bed',
  {
    'a14-20-s1': {
      goal: 'Wait in the hall while Penelope comes down.',
      hint: 'Sit on the step by the hearth and keep out of the way.',
    },
    'a14-20-s2': {
      goal: 'Stay while she tests him.',
      hint: 'Keep still by the hearth and listen.',
    },
    'a14-20-s3': {
      goal: 'Go with him to his father’s orchard.',
      hint: 'Walk out to Laertes’s farm in the hills.',
    },
  },
  [
    sc(
      'a14-20-hall',
      [
        EC(
          'Wake up, child! He’s home. He’s here. The beggar in the hall was him all along. Telemachus knew!',
          'happy',
        ),
        PN(
          'Nurse, the gods have made you mad. Why wake me? I was sleeping so well. I haven’t slept like that since he went.',
          'angry',
        ),
        N(
          'Penelope comes down the stair, and stops. She sits down across the hearth from him in the firelight, and looks at him, and doesn’t speak.',
        ),
        N('He sits by a pillar with his eyes down, waiting for her to say something. She doesn’t.'),
        TM(
          'Mother. Hard mother. Your heart’s harder than stone. Any other woman would have run to him after twenty years.',
          'angry',
        ),
        PN(
          'Child, I can’t. I can’t speak, or ask, or look him in the face. If it is him, we have signs between us. Secret ones.',
          'soft',
        ),
        N('Odysseus smiles, then. He knows her.'),
        OD('Leave your mother be, Telemachus. She’ll test me. Soon she’ll know me better.', 'soft'),
      ],
      [
        ask(
          5,
          'sel',
          'think about being careful with a hope that seems too good to be true',
          'CASEL: Social awareness',
          [
            N(
              'After twenty years of false stories, Penelope doesn’t run to him. She wants proof first. Is she being hard-hearted, or wise?',
            ),
          ],
          [
            o('Wise. She has been tricked before, and needs to be sure.', [
              N('That’s a fair answer. Careful hope protects a person from being hurt again.'),
            ]),
            o('Hard-hearted. After twenty years she should believe him.', [
              N(
                'That’s a fair answer. Telemachus feels exactly that. It’s hard to see someone you love hold back.',
              ),
            ]),
            o('Neither. She is afraid of hoping too much.', [
              N(
                'That’s a thoughtful answer. When something matters this much, hope and fear can feel like the same thing.',
              ),
            ]),
          ],
          'Thought about whether being careful with a long-awaited hope is wise or hard-hearted (a think question).',
        ),
      ],
      [
        ch('step', 'Sit down on the step, out of the way.', [
          N('You sit on the step. This part is theirs, and you’re only here to see it.'),
        ]),
        ch('look', 'Look at Penelope.', [
          N(
            'She is looking at him the way she looked at her loom all those nights: row by row, checking every stitch.',
          ),
        ]),
        ch('nubbin', 'Hold your Nubbin still.', [
          N(
            'You hold your Nubbin still. It badly wants to go to one of them, and can’t decide which.',
          ),
        ]),
      ],
    ),
    sc(
      'a14-20-hall-done',
      [
        N(
          'He goes to bathe. When he comes back Athena has made him taller and stronger, with hair curling like hyacinth petals, and he sits down across from her again.',
        ),
      ],
      [
        ask(
          0,
          'literacy',
          'a simile with a flower paints a picture',
          'L.4.5',
          [
            N(
              'His hair curls “like hyacinth petals”. A hyacinth is a spring flower with small, tightly curled petals. What picture does the simile give you?',
            ),
          ],
          [
            o(
              'Soft, tight curls, dark and glossy.',
              [
                N(
                  'Yes. You can almost see the curls. A simile lets a writer say a lot in a few words by comparing one thing to something you already know.',
                ),
              ],
              true,
            ),
            o('Straight, flat hair.', [
              N('Hyacinth petals curl, so the simile points to the opposite: tight, soft curls.'),
            ]),
            o('Hair that is very short.', [
              N(
                'The simile is about the shape, not the length. Hyacinth petals curl, so the hair has curls.',
              ),
            ]),
          ],
          'Pictured a simile (hair like hyacinth petals) and what it says about the hair.',
        ),
      ],
    ),
    sc(
      'a14-20-bed',
      [
        ...BED_COMMON,
        OD('Penelope. It’s me. It’s Odysseus.', 'soft'),
        N(
          'It is the first time he has said his own name aloud since the giant’s island, and you hear it. It sounds different, said quietly, at home.',
        ),
      ],
      bedBeats(),
    ),
    sc(
      'a14-20-bed-done',
      [
        N(
          'You go quietly out of the hall with your Nubbin, and leave them by the fire. There is a lot to tell, and the night is as long as Athena has made it.',
        ),
      ],
      [
        notice(
          0,
          'social-studies',
          'the olive tree was sacred to Athena, and Athens is named for her',
          'D2.His.2.K-2',
          [
            N(
              'In the old Greek story of how Athens got its name, Athena won the city by giving it the first olive tree, which brought food, oil and wood.',
            ),
            N(
              'The city of Athens is named for her, and olives are still a big part of Greek life today.',
            ),
          ],
          'Learned the old story of Athena and the olive tree, and that Athens is named for her.',
        ),
      ],
    ),
    sc(
      'a14-20-orchard',
      [
        N(
          'Morning. Odysseus, Telemachus, Eumaeus and you walk out to old Laertes’s farm in the hills, among the vines.',
        ),
        N(
          'Laertes is alone in the orchard, digging round a young tree. His tunic is patched and dirty, with leather gaiters against the thorns.',
        ),
        N('Odysseus stands under a tall pear tree and watches him, and can’t speak for a while.'),
        OD(
          'Old man, you know your work. Every plant here is cared for: fig and vine and olive and pear. Only you aren’t cared for.',
          'soft',
        ),
        LA(
          'Who are you? Have you come from far off? I had a son once. I suppose he’s dead.',
          'sad',
        ),
        N(
          'Odysseus begins to tell him a story, a clever one, and stops halfway. He can’t do it, not to this old man.',
        ),
        OD(
          'Father, it’s me. I’m the one you’ve been grieving for. I’ve come home, in the twentieth year.',
          'soft',
        ),
        LA('If you’re my son, give me a sign. A real one.', 'think'),
        OD(
          'The scar, from the boar on Parnassus. And the trees. When I was little I followed you round this orchard asking the name of every tree.',
        ),
        OD(
          'You gave me thirteen pear trees, ten apple trees and forty figs, and fifty rows of vines, each ripening at its own time.',
          'soft',
        ),
        N(
          'Laertes’s knees give way. He puts his arms round his son’s neck, and Odysseus catches him as he falls.',
        ),
      ],
      [
        ask(
          3,
          'sel',
          'how to look after older people',
          'CASEL: Social awareness',
          [
            N(
              'Odysseus sees that every plant in the orchard is cared for, but old Laertes is not. How can we help look after older people we know?',
            ),
          ],
          [
            o(
              'Visit, listen, help with jobs, and show we care.',
              [
                N(
                  'Yes. Time and company matter as much as help. Even a short visit and a good listen can brighten someone’s day.',
                ),
              ],
              true,
            ),
            o('Leave them alone. They don’t need anyone.', [
              N(
                'Most people, young or old, need company and care. Laertes shows how lonely it can get when nobody visits.',
              ),
            ]),
            o('Only family should help.', [
              N(
                'Family often does, but neighbours and friends can help too. Anyone who cares can make a difference.',
              ),
            ]),
          ],
          'Thought about ways to care for older people: visiting, listening, helping.',
        ),
        ask(
          9,
          'maths',
          'add three numbers to find a total',
          '2.OA.A.1',
          [
            N(
              'Laertes’s gift to his son was thirteen pear trees, ten apple trees and forty fig trees. How many trees is that altogether?',
            ),
          ],
          [
            o('63 trees', [N('Yes. 13 + 10 = 23, and 23 + 40 = 63.')], true),
            o('53 trees', [N('Close. 13 + 10 = 23, but 23 + 40 is 63, not 53.')]),
            o('36 trees', [N('Add each number: 13 + 10 = 23, then 23 + 40 = 63.')]),
          ],
          'Added 13 + 10 + 40 to find 63 trees.',
        ),
      ],
      [
        ch('count', 'Count the pear trees.', [
          N('You count them: thirteen, still. Some of them are very old now, and still bearing.'),
        ]),
        ch('stool', 'Fetch the old man a stool.', [
          N(
            'You fetch a stool from the hut. Laertes sits, and holds on to his son’s hand, and won’t let go of it.',
          ),
        ]),
        ch('nubbin', 'Let your Nubbin carry his gloves.', [
          N(
            'Your Nubbin carries Laertes’s gardening gloves for him, one at a time, and lays them very carefully on the wall.',
          ),
        ]),
      ],
    ),
    sc(
      'a14-20-orchard-done',
      [
        LA(
          'Father Zeus, the gods are still on Olympus after all, if those men have had what they deserved.',
          'soft',
        ),
        N(
          'Then the families of the suitors come up the road from the town, angry, with spears, wanting payment for their shame.',
        ),
      ],
      [
        ask(
          1,
          'social-studies',
          'ways to settle a quarrel between two groups peacefully',
          'D2.Civ.8.K-2',
          [
            N(
              'Two angry groups face each other with spears. What are some ways to settle a quarrel peacefully?',
            ),
          ],
          [
            o(
              'Stop, listen, and let a fair go-between help them agree.',
              [
                N(
                  'Yes. Putting down weapons, hearing both sides, and having a fair person help are the beginnings of peace.',
                ),
              ],
              true,
            ),
            o('Fight until one side wins.', [
              N(
                'That might end a quarrel for a while, but the losers stay angry and the fight can start again. Peace needs both sides to agree.',
              ),
            ]),
            o('Ignore it and hope it goes away.', [
              N('Quarrels left alone usually get worse. Someone has to start the talking.'),
            ]),
          ],
          'Learned that peace needs stopping, listening and a fair go-between.',
        ),
      ],
    ),
    sc(
      'a14-20-complete',
      [
        N(
          'Before anyone can lift a spear, old Mentor steps between the two sides. When he speaks, it isn’t Mentor’s voice at all.',
        ),
        AT('Men of Ithaca, stop. No more of this. Make peace, and let it hold.'),
        N(
          'Out of a clear sky comes thunder. The spears go down, and the families stand in the road, and then, one by one, go home.',
        ),
        N(
          'Athena, still in Mentor’s shape, makes peace between the house and the town, and both sides swear to keep it.',
        ),
        PN(
          'Take my loom, guest. The big one upstairs. I won’t need a loom that works backwards any more.',
          'happy',
        ),
        N('Telemachus brings a cutting from the olive in the bedroom wall, wrapped in wet cloth.'),
        OD(
          'Plant it by your water. Build something round it, if you like. That’s what they’re for.',
          'soft',
        ),
        N(
          'The sea goes blue again under your fingers, and the island goes small, and you are home, with the atlas on your knee.',
        ),
        N(
          'In one hand there is an olive cutting in wet cloth. Your Nubbin is holding the corner of a very large loom.',
        ),
        N(
          'A long road home, and a house that waited. Odysseus could have stayed safe on Calypso’s shore, and chose to be well instead.',
        ),
      ],
      [
        ask(
          5,
          'science',
          'a cutting needs moisture to grow roots and become a new tree',
          '3-LS1-1',
          [
            N(
              'Telemachus wraps an olive cutting in wet cloth so that it can grow into a new tree. Why keep the cutting wet?',
            ),
          ],
          [
            o(
              'Roots need moisture to start growing.',
              [
                N(
                  'Yes. A cutting has no roots yet, so it needs damp to grow them. Once it has roots, it can take water from the soil and grow into a tree like its parent.',
                ),
              ],
              true,
            ),
            o('So that it floats.', [
              N('A cutting isn’t going on a boat. Moisture lets the cut end sprout roots.'),
            ]),
            o('To keep it clean.', [
              N(
                'Cleanliness isn’t the reason. Without moisture the cut stem would dry out, and roots couldn’t grow.',
              ),
            ]),
          ],
          'Learned that a cutting needs moisture to grow roots and become a new plant.',
        ),
      ],
    ),
  ],
  [],
);

// ================================================================== variants
const SIT_BEATS = (): Beat[] => [
  ask(
    1,
    'science',
    'dogs have a keen sense of smell and remember people they love',
    '4-LS1-2',
    [
      N(
        'Argos knew his master through the rags. Dogs have a far keener sense of smell than people, and can remember the scent and voice of someone they love for years. Real dogs live ten to fifteen years, so twenty is the poem’s way of saying he waited a very long time. How did Argos know the beggar?',
      ),
    ],
    [
      o(
        'By his smell and his voice',
        [
          N(
            'Yes. A dog’s nose and ears are very sharp, and a loved scent stays in a dog’s memory. That is why pet dogs are so thrilled when you come home.',
          ),
        ],
        true,
      ),
      o('By his clothes', [
        N(
          'The beggar’s clothes are rags, which is no clue at all. A dog knows a person by scent and voice.',
        ),
      ]),
      o('By his staff', [
        N(
          'Any old man might carry a staff, so it is no clue. A dog is far more likely to know him by the way he smells and sounds.',
        ),
      ]),
    ],
    'Learned that dogs recognise loved people by scent and voice, and that a dog’s sense of smell is far keener than ours.',
  ),
];
const SIT_CHOICES: Choice[] = [
  ch('ears', 'Scratch behind his ears.', [
    N(
      'You scratch behind his ears, where a good dog’s ears always want scratching. His eyes half close.',
    ),
  ]),
  ch('sit', 'Just sit with him.', [
    N('You just sit. You don’t need to do anything, and he doesn’t need you to.'),
  ]),
  ch('tell', 'Tell him, quietly, that his master’s home.', [
    Y('He’s home. You were right. He came back.'),
    N('Argos sighs: a long sigh, like a dog lying down at the end of a day in the woods.'),
  ]),
];
const COMPLETE_20: Line[] = [
  N(
    'Before anyone can lift a spear, old Mentor steps between the two sides. When he speaks, it isn’t Mentor’s voice at all.',
  ),
  AT('Men of Ithaca, stop. No more of this. Make peace, and let it hold.'),
  N(
    'Out of a clear sky comes thunder. The spears go down, and the families stand in the road, and then, one by one, go home.',
  ),
  N(
    'Athena, still in Mentor’s shape, makes peace between the house and the town, and both sides swear to keep it.',
  ),
  PN(
    'Take my loom, guest. The big one upstairs. I won’t need a loom that works backwards any more.',
    'happy',
  ),
  N('Telemachus brings a cutting from the olive in the bedroom wall, wrapped in wet cloth.'),
  OD(
    'Plant it by your water. Build something round it, if you like. That’s what they’re for.',
    'soft',
  ),
  OD(
    'And thank you. For saying nothing, that day on the ship. For not telling me what I already knew.',
    'soft',
  ),
  N(
    'The sea goes blue again under your fingers, and the island goes small, and you are home, with the atlas on your knee.',
  ),
  N(
    'In one hand there is an olive cutting in wet cloth. Your Nubbin is holding the corner of a very large loom.',
  ),
  N(
    'A long road home, and a house that waited. Odysseus could have stayed safe on Calypso’s shore, and chose to be well instead.',
  ),
];

export const EDU_A14_READER_VARIANTS: EduScene[] = [
  sc(
    'a14-corvin-joins',
    [
      N(
        'When the page opens, someone is standing on it beside you who wasn’t there before: Corvin Vale, in his good coat, a little out of breath.',
      ),
      CV(
        'I saw the atlas open on the step. I hope you don’t mind. There’s no gate on a page, so I couldn’t knock.',
        'soft',
      ),
      CV('I know something about the long way home.', 'soft'),
      N(
        'Your Nubbin looks at him for a long moment. Then it walks on ahead, which means he can come.',
      ),
    ],
    [
      ask(
        0,
        'health',
        'after running, breathing speeds up and then slows down with rest',
        'CASEL: Self-awareness',
        [
          N(
            'Corvin is a little out of breath because he hurried. When you run, what happens to your breathing?',
          ),
        ],
        [
          o(
            'It speeds up, then slows down again when you rest.',
            [
              N(
                'Yes. Your body needs more air when you run, so you breathe faster. Resting lets it settle.',
              ),
            ],
            true,
          ),
          o('It stops completely.', [
            N('Breathing never stops. It speeds up when you run, and slows again when you rest.'),
          ]),
          o('It stays exactly the same.', [
            N(
              'Running makes your muscles need more air, so you breathe faster. That is how the body keeps up.',
            ),
          ]),
        ],
        'Learned that breathing speeds up when we run and slows down again with rest.',
      ),
    ],
  ),
  sc(
    'a14-14-harbour-shout',
    [...HARBOUR_COMMON, BG('And you. Not a word this time. Not even a little one.', 'happy')],
    harbourBeats(),
  ),
  sc(
    'a14-14-harbour-silence',
    [...HARBOUR_COMMON, BG('You won’t say anything. You never do. I’m counting on it.', 'soft')],
    harbourBeats(),
  ),
  sc(
    'a14-16-gate-shout',
    [
      ...GATE_COMMON,
      N('The beggar turns his face away and wipes a tear off quickly, so that Eumaeus won’t see.'),
      ...GATE_END,
    ],
    gateBeats(),
  ),
  sc(
    'a14-16-gate-silence',
    [...GATE_COMMON, N('The beggar looks at you, once. That’s all.'), ...GATE_END],
    gateBeats(),
  ),
  sc(
    'a14-16-sit-corvin',
    [
      N(
        'You sit down beside the heap, in the sun, where it’s warm. Your Nubbin goes up to the old dog slowly, the way it would go up to Moss.',
      ),
      N(
        'Argos sniffs it. Then he lets his head go down, and your Nubbin lies against his side, where the ribs show.',
      ),
      N(
        'From the hall comes the noise of the suitors, and the lyre. Out here there is only the sun, and the flies, and the three of you.',
      ),
      N(
        'He smells of dust and age. Somebody once brushed this coat every day: you can tell from the way it lies.',
      ),
      N(
        'Corvin comes back out through the gate and sits down on the ground on your other side, in his good coat.',
      ),
      N(
        'He puts a hand on the old dog’s back. His hands were cold for twenty-two years; they are warm now, and Argos leans into the warmth.',
      ),
      CV('Twenty years on a heap, waiting. Nobody waited for me like that.', 'sad'),
      CV('No. That isn’t true, is it. Somebody did.', 'soft'),
      N('Argos’s tail moves once more in the dust, for no one you can see.'),
      N(
        'His eyes are on the gate, where his master went in. He is very tired, and the waiting is done.',
      ),
    ],
    SIT_BEATS(),
    SIT_CHOICES,
  ),
  sc(
    'a14-19-aegis-done-corvin',
    [
      N(
        'The hall is empty. The swallow on the roof-beam is gone, and there is only the mess, and the sound of your own breathing.',
      ),
      TM('They’re gone. They’re really gone.', 'shock'),
      CV('I was them once. I opened a gate and let them in.', 'sad'),
      N(
        'Nobody answers him. He looks at the hall: the spilt wine, the broken stools, the open door.',
      ),
      CV('Driven out is right. Some of them come back better.', 'soft'),
    ],
    [
      ask(
        0,
        'science',
        'swallows nest under roofs and migrate south each winter',
        '3-LS4-3',
        [
          N(
            'Swallows build mud nests under roofs. When summer ends, they fly thousands of kilometres south to warmer lands, and come back in spring. What is this long yearly journey called?',
          ),
        ],
        [
          o(
            'Migration',
            [
              N(
                'Yes. Migration lets animals find food and warmth when their home turns cold. Swallows, whales and many butterflies migrate.',
              ),
            ],
            true,
          ),
          o('Hibernation', [
            N(
              'Hibernation is when an animal sleeps through the winter. Swallows don’t sleep it off; they fly away to warmer places.',
            ),
          ]),
          o('Evolution', [
            N(
              'Evolution is slow change over many generations. A swallow’s yearly flight to warmer lands is called migration.',
            ),
          ]),
        ],
        'Learned that swallows migrate: they travel long distances each year to find food and warmth.',
      ),
    ],
  ),
  sc(
    'a14-20-bed-shout',
    [
      ...BED_COMMON,
      OD('A friend once shouted my name with me, at a giant. It cost me ten years.', 'soft'),
      OD('I’m not sorry about the company.', 'happy'),
      N(
        'Penelope looks at you over his shoulder. She will want to hear all of it later, every word.',
      ),
    ],
    bedBeats(),
  ),
  sc(
    'a14-20-bed-silence',
    [
      ...BED_COMMON,
      N(
        'Penelope looks at you over his shoulder for a moment, as if to ask who you are. Then she doesn’t mind.',
      ),
    ],
    bedBeats(),
  ),
  sc('a14-20-complete-silence', COMPLETE_20, [
    ask(
      5,
      'science',
      'a cutting needs moisture to grow roots and become a new tree',
      '3-LS1-1',
      [
        N(
          'Telemachus wraps an olive cutting in wet cloth so that it can grow into a new tree. Why keep the cutting wet?',
        ),
      ],
      [
        o(
          'Roots need moisture to start growing.',
          [
            N(
              'Yes. A cutting has no roots yet, so it needs damp to grow them. Once it has roots, it can take water from the soil and grow into a tree like its parent.',
            ),
          ],
          true,
        ),
        o('So that it floats.', [
          N('A cutting isn’t going on a boat. Moisture lets the cut end sprout roots.'),
        ]),
        o('To keep it clean.', [
          N(
            'Cleanliness isn’t the reason. Without moisture the cut stem would dry out, and roots couldn’t grow.',
          ),
        ]),
      ],
      'Learned that a cutting needs moisture to grow roots and become a new plant.',
    ),
  ]),
  sc(
    'a14-close-family',
    [
      N(
        'When you close the atlas, Corvin is sitting on the step beside you, rubbing his hands together. They’re warm, and he keeps checking.',
      ),
      CV('He came home, and his dog knew him. I’ll be thinking about that for a week.', 'soft'),
      N(
        'He gets up and goes to the gate, and lifts and pushes, and goes out. It sticks behind him, the way it does for everyone who belongs here.',
      ),
    ],
    [
      ask(
        1,
        'sel',
        'think about second chances and earning trust back',
        'CASEL: Relationship skills',
        [
          N(
            'Corvin once did something wrong, and he is still trying to make it right. Should people get second chances? What would help someone earn trust back?',
          ),
        ],
        [
          o('Yes, if they are honest and keep trying to put things right.', [
            N(
              'That’s a fair answer. Trust comes back slowly, through honest actions repeated over time.',
            ),
          ]),
          o('Only if the people who were hurt agree.', [
            N(
              'That’s a fair answer. The people who were hurt get a say in whether they can trust again.',
            ),
          ]),
          o('It depends on what they did, and why.', [
            N(
              'That’s a thoughtful answer. Understanding why someone acted as they did doesn’t excuse it, but it can help us decide what comes next.',
            ),
          ]),
        ],
        'Thought about second chances and how someone earns trust back (a think question).',
      ),
    ],
  ),
  sc(
    'a14-close-guest',
    [
      N('When you close the atlas it is evening in the Grove, and somebody is at the gate.'),
      N(
        'It is Corvin Vale, with his hands on the top bar. He doesn’t try the latch; he knocks on the gatepost, twice, and waits.',
      ),
      CV('I saw the light. I won’t stay. I only wanted to see that you’d come back.', 'soft'),
      N(
        'You lift and push, and let him in for a cup of tea. He watches your hands, and you turn them so he can’t quite see.',
      ),
    ],
    [
      ask(
        2,
        'social-studies',
        'waiting to be invited in shows respect for someone else’s home',
        'D2.Civ.8.K-2',
        [
          N(
            'Corvin knocks on the gatepost and waits, instead of trying the latch. What does that show about how he treats a home that isn’t his?',
          ),
        ],
        [
          o(
            'He respects that he must be invited in.',
            [
              N(
                'Yes. Knocking and waiting is a way of saying “this is your place, and I will come in only if you say so”. It is the same spirit as xenia.',
              ),
            ],
            true,
          ),
          o('He doesn’t know how latches work.', [
            N('He knows perfectly well. He is choosing not to touch it, out of respect.'),
          ]),
          o('He is trying to sneak in.', [
            N(
              'Sneaking in wouldn’t involve knocking twice and waiting. Knocking is the opposite of sneaking.',
            ),
          ]),
        ],
        'Learned that knocking and waiting shows respect for another person’s home.',
      ),
    ],
  ),
  sc(
    'a14-close-shut',
    [
      N(
        'When you close the atlas it is evening in the Grove. You go down to the gate, for no reason you could name.',
      ),
      N('The lane beyond it is empty. Nobody is standing there.'),
      N(
        'You lift and push, out of habit, and it sticks, as it always does. You stand there a while anyway, listening.',
      ),
    ],
    [
      ask(
        1,
        'literacy',
        'a setting can give a mood',
        'RL.4.3',
        [
          N(
            'The writer tells us the lane is empty, and that you stand there listening. What mood does that give the scene?',
          ),
        ],
        [
          o(
            'Quiet, waiting, and a little lonely',
            [
              N(
                'Yes. Short, plain sentences about an empty lane make the scene feel still. Writers choose details like these to build a mood.',
              ),
            ],
            true,
          ),
          o('Loud and exciting', [
            N(
              'There is no noise or action here, just an empty lane and someone listening. That makes a quiet mood.',
            ),
          ]),
          o('Funny', [
            N(
              'Nothing here is meant to be funny. The empty lane and the listening give a quiet, waiting mood.',
            ),
          ]),
        ],
        'Identified how setting details (an empty lane, listening) build a quiet, waiting mood.',
      ),
    ],
  ),
  sc(
    'a14-margin-hazel',
    [
      N('Nova’s atlas lies open at the Argos page: the gate, the heap, the old dog in the sun.'),
      N(
        'In the margin, in soft pencil you have never noticed, there is a note. You know the hand.',
      ),
      N('“Argos waited twenty years and still knew him, even in rags.”'),
      N('“That’s why our gate sticks.”'),
      N('“So I’d hear. H.”', 'soft'),
      N(
        'You sit with the page open. Outside, faintly, the gate creaks in the wind, and doesn’t open.',
      ),
    ],
    [
      ask(
        4,
        'literacy',
        'cause and effect: a note explains why the gate sticks',
        'RL.3.3',
        [
          N(
            'Hazel’s note says Argos waited, and that is why the gate sticks, “so I’d hear”. What does she mean by that?',
          ),
        ],
        [
          o(
            'A sticking gate lets you hear anyone coming, the way Argos waited and listened.',
            [
              N(
                'Yes. She links a cause (the gate sticks) to an effect (you hear visitors) and to the old dog who waited. A margin note can say a lot in a few words.',
              ),
            ],
            true,
          ),
          o('Gates are always broken.', [
            N('The note says the sticking is on purpose: it’s a way of hearing people come.'),
          ]),
          o('Argos opened the gate himself.', [
            N(
              'Argos is only in the story on the page. The gate sticks so that the Keeper will always hear who is arriving.',
            ),
          ]),
        ],
        'Read a margin note for cause and effect (the gate sticks so you will hear who comes).',
      ),
    ],
  ),
  sc(
    'a14-margin-hazel-family',
    [
      N('Nova’s atlas lies open at the Argos page: the gate, the heap, the old dog in the sun.'),
      N(
        'In the margin, in soft pencil you have never noticed, there is a note. You know the hand.',
      ),
      N('“Argos waited twenty years and still knew him, even in rags.”'),
      N('“That’s why our gate sticks.”'),
      N('“So I’d hear. H.”', 'soft'),
      N('Underneath, in a second hand, in ink, small and careful:'),
      N('“I came back. C.”', 'soft'),
      N(
        'You sit with the page open. Outside, faintly, the gate creaks in the wind, and doesn’t open.',
      ),
    ],
    [
      ask(
        4,
        'literacy',
        'cause and effect: a note explains why the gate sticks',
        'RL.3.3',
        [
          N(
            'Hazel’s note says Argos waited, and that is why the gate sticks, “so I’d hear”. What does she mean by that?',
          ),
        ],
        [
          o(
            'A sticking gate lets you hear anyone coming, the way Argos waited and listened.',
            [
              N(
                'Yes. She links a cause (the gate sticks) to an effect (you hear visitors) and to the old dog who waited. A margin note can say a lot in a few words.',
              ),
            ],
            true,
          ),
          o('Gates are always broken.', [
            N('The note says the sticking is on purpose: it’s a way of hearing people come.'),
          ]),
          o('Argos opened the gate himself.', [
            N(
              'Argos is only in the story on the page. The gate sticks so that the Keeper will always hear who is arriving.',
            ),
          ]),
        ],
        'Read a margin note for cause and effect (the gate sticks so you will hear who comes).',
      ),
    ],
  ),
];

// ================================================================== exports
export const EDU_A14_READER: EduQuest[] = [
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

/** Every `edu:` check string used by the lessons above (the reader band has no `do` lessons). */
export const CHECKS: string[] = [];
