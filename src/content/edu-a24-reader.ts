/**
 * The Learning Grove, reader band (ages 7–10): Atlas page A24, The Law of the Jungle (Kipling’s
 * Jungle Books, central India, with “The White Seal” as the coda).
 *
 * Source: atlas-a24.ts (ATLAS_A24 and ATLAS_A24_VARIANTS). One EduScene per original scene (every
 * step scene, every done scene, every complete scene and every variant), id `reader:<original id>`,
 * with every choice kept under its original id and `set` flag (`a24-stones` in a24-10-road). Reader
 * keeps all choices, so no `defaultChoice` is needed. See EDU-STYLE.md. British spelling.
 *
 * Learning angles, from the outline: where the Seoni hills are in central India; the real animals
 * of the books (tigers, sloth bears, leopards, rock pythons, dholes, Indian elephants, langurs and
 * macaques, giant rock bees) and how they are protected today; what a monsoon and a drought do to
 * a water hole; northern fur seals and the Bering Sea; and Steller’s sea cow, which died out in
 * the 1700s because it was hunted. Also: Hindi words behind the names, fire and what it needs,
 * moon phases, river currents, simple sums with time, distance and groups, and feelings (courage,
 * fear, grief, fairness, forgiveness, belonging).
 *
 * Think questions (`ask` with no `best`) in every quest, and one `sel` lesson in every quest.
 * Domains never repeat back to back, across scenes and across quests. Each variant scene has the
 * same domain as the scene it replaces, so the order holds on both of the stones paths.
 *
 * Care notes kept: no lines from Kipling’s text or from any film (the Master Words become a plain
 * “family” line); the intro card says plainly that Kipling loved India and also believed Britain
 * should rule it, and that he was wrong; the villagers are frightened people, never stupid ones;
 * the Bandar-log are monkeys only; the Unangax̂ are never villains, the islands are named as their
 * home, and the scene cuts away; Shere Khan’s end is dust and quiet, and Akela’s death is said
 * plainly and gently with comfort straight after; Kotick’s fights are shoving matches.
 *
 * Facts used (all well established): Seoni is in central India, in Madhya Pradesh; Pench Tiger
 * Reserve is near it; Hindi `bhalu` is a bear, `hathi` an elephant, `bandar` a monkey, `cheel` a
 * kite, `sher` a tiger or lion, `khan` a chief, `akela` means alone; a black panther is a leopard
 * with a very dark coat; many night animals have a mirror layer in the eye; sloth bears eat termites,
 * ants and fruit, and mothers carry cubs on their backs; Indian rock pythons are not venomous and
 * shed their skin as they grow; dholes are red wild dogs that hunt in packs and are endangered;
 * giant honeybees build one open comb on a cliff; wild Asian elephants live in herds led by an old
 * female; each tiger’s stripes are different; India’s Project Tiger began in 1973; the monsoon
 * brings India’s rains from about June to September; fire needs fuel, heat and air; the Moon takes
 * about 29 and a half days to go from full to full; the Pole Star shows north; northern fur seal
 * pups are born dark and cannot swim at first; the Pribilof Islands lie in the Bering Sea off
 * Alaska; fur seals travel thousands of kilometres each year; a fur seal treaty was signed in
 * 1911; Steller’s sea cow was found in 1741, was hunted, and was gone by 1768.
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
const MG = say('a24-mowgli');
const MW = say('a24-mother-wolf');
const FW = say('a24-father-wolf');
const TB = say('a24-tabaqui');
const SK = say('a24-shere-khan');
const AK = say('a24-akela');
const BL = say('a24-baloo');
const BG = say('a24-bagheera');
const KA = say('a24-kaa');
const CH = say('a24-chil');
const BD = say('a24-bandar');
const ME = say('a24-messua');
const BU = say('a24-buldeo');
const VI = say('a24-villager');
const GB = say('a24-grey-brother');
const YW = say('a24-young-wolf');
const HA = say('a24-hathi');
const KO = say('a24-kotick');
const MK = say('a24-matkah');
const SC = say('a24-sea-catch');
const SL = say('a24-sea-lion');
const SV = say('a24-sea-vitch');
const GU = say('a24-gull');
const SE = say('a24-seal');
const FE = say('fern');

// ---------------------------------------------------------------- builders
type Beat = Omit<Lesson, 'id'>;
type Opt = NonNullable<Lesson['options']>[number];

const words = (t: string) => t.trim().split(/\s+/).length;
const fits = (t: string) => words(t) <= 26 && t.length <= 150;
const parts = (t: string) => t.split(/(?<=[.!?”)])\s+(?=[A-Z“(‘])/);

/**
 * Keeps every line within the reader caps (30 words, 160 characters, two sentences): a long line
 * is cut at sentence ends into several lines by the same speaker (the mood stays on the first).
 * `map[i]` is the index of the last piece of original line i, so a lesson’s `after` can follow.
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
      if (last !== undefined && n < 2 && fits(`${last} ${sentence}`)) {
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

/** One answer option. `best` marks the answer the lesson teaches; think questions have none. */
const o = (label: string, reply: Line[], best = false): Opt =>
  best ? { label, best, reply: sp(reply) } : { label, reply: sp(reply) };

const std = (standard?: string) => (standard ? { standard } : {});

/** An ask lesson (a think question when no option is marked best). */
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

/** A choice, kept under its original id. */
const ch = (
  id: string,
  label: string,
  then: Line[],
  set?: Record<string, number | boolean | string>,
): Choice => ({ id, label, ...(set ? { set } : {}), then: sp(then) });

/** One reader scene. Lesson ids are `reader:<of>-l<n>`, numbered in play order. */
const sc = (of: string, lines: Line[], beats: Beat[], choices?: Choice[]): EduScene => {
  const cut = split(lines);
  return {
    id: `reader:${of}`,
    of,
    band: 'reader',
    lines: cut.lines,
    ...(choices ? { choices } : {}),
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

// ================================================================== A24-1 The Cave
const A1: EduQuest = quest(
  'a24-01',
  'The Cave',
  {
    'a24-01-s1': {
      goal: 'Step into the Seoni hills and find the wolves’ cave.',
      hint: 'Touch the page where the cave mouth is, then climb the slope towards it.',
    },
    'a24-01-s2': {
      goal: 'Keep still in the cave while Tabaqui and the tiger’s roar go by.',
      hint: 'Stay by the wall. Watch the cave mouth, not the jackal.',
    },
    'a24-01-s3': {
      goal: 'Stand behind Mother Wolf while Shere Khan comes to the door.',
      hint: 'Stay behind her. The cave mouth is too narrow for a tiger, and she knows it.',
    },
  },
  [
    sc(
      'a24-01-page',
      [
        N(
          'Nova’s atlas falls open at hills the colour of warm brick, going blue at the edges with dusk.',
        ),
        N(
          'A card is tucked into the page in Nova’s small writing. “Rudyard Kipling was born in Bombay in 1865, and he loved India.”',
        ),
        N(
          '“He also believed Britain had the right to rule India. He was wrong: India was never Britain’s to rule.”',
        ),
        N('“Read his animals with both facts in your pocket. N.”'),
        N(
          'You put the card back. Warm dusk breathes off the paper, and there is dry grass under your boots.',
        ),
        N(
          'This is Seoni, in the very middle of India. The hills are low and rocky, and at night the jungle wakes up.',
        ),
        N(
          'Ahead is a slope of rocks with a cave in it, and above it a long flat rock with nobody on it yet.',
        ),
        N(
          'In the cave a big grey wolf is stretching. A she-wolf lies with her nose across four tumbling cubs.',
        ),
        FW(
          'Hrrm. Who is that at the door? A guest, by the smell. A very small one, and a strange one.',
          'think',
        ),
        MW(
          'Let them in, if they have come politely. Nobody who knocks politely gets eaten in this house.',
        ),
      ],
      [
        ask(
          5,
          'social-studies',
          'finding a place on a map: Seoni is in the middle of India',
          'D2.Geo.2.K-2',
          [
            N(
              'Nova’s atlas shows the whole of India, a country shaped a bit like a kite. Where is Seoni on it?',
            ),
          ],
          [
            o(
              'Right in the middle.',
              [
                N('Yes. Seoni is in central India, in a state called Madhya Pradesh.'),
                N('Real tigers still live in forests near there, in a park called Pench.'),
              ],
              true,
            ),
            o('On the far northern edge.', [
              N('Not quite. The far north is where the great Himalayan mountains are.'),
              N('Seoni is in the middle of the country, with hills and forests around it.'),
            ]),
            o('On an island out at sea.', [
              N('Good guess about islands. India has some.'),
              N('But Seoni is inland, in the middle of the country, a long way from any sea.'),
            ]),
          ],
          'Located Seoni in the middle of India and learned that real tigers live in nearby forests.',
        ),
      ],
      [
        ch('bow', 'Bow at the cave mouth and wait to be asked.', [
          MW(
            'Good manners. Come in, then, and mind the cubs’ tails. They leave them everywhere.',
            'happy',
          ),
        ]),
        ch('nubbin', 'Let your Nubbin go in first.', [
          N(
            'Your Nubbin trots in, sniffs the nearest cub, and is sniffed back, thoroughly, from both ends.',
          ),
        ]),
        ch('sit', 'Sit down outside and let them look at you.', [
          FW('Hm. It sits like it means no harm. Come in out of the dew.'),
        ]),
      ],
    ),
    sc(
      'a24-01-page-done',
      [
        N(
          'The cave smells of warm fur and old bones. In the dark, Mother Wolf’s eyes shine like two green lamps.',
        ),
        N('Your Nubbin stares back. Its own eyes shine a little too, which pleases it very much.'),
        MW(
          'Guests of the Free People sit by the wall. That is you. And your little one sits wherever it likes, apparently.',
        ),
      ],
      [
        notice(
          1,
          'science',
          'many night animals have a mirror layer in the eye that helps them see in the dark',
          '4-LS1-2',
          [
            FW(
              'Eyes shine in the dark because of a mirror at the back of the eye. Many night hunters have one.',
            ),
            FW(
              'It bounces dim light back through the eye a second time, so there is twice the chance to catch it.',
            ),
          ],
          'Learned that many night animals have a mirror layer in their eyes that helps them see in dim light.',
        ),
      ],
    ),
    sc(
      'a24-01-cub',
      [
        N(
          'A thin shadow slides into the cave mouth on its belly: a jackal, smiling with every one of his teeth.',
        ),
        TB(
          'Oh, chief of the wolves, what a cave! What a family! Such fine strong teeth on those cubs already!',
        ),
        TB(
          'And a guest! How grand. Is there a bone, for poor Tabaqui? Even a dry one. I am not proud.',
          'happy',
        ),
        FW('There is a bone by the wall. Take it and go.'),
        TB(
          'I only mention, in passing, that Shere Khan is hunting in these hills. Lame Shere Khan. Thought you would like to know.',
        ),
        N(
          'He crunches the bone, flatters the cubs’ teeth once more, says something unkind about their ears, and is gone.',
        ),
        N('Down in the valley a tiger’s whine rises, long and angry. Father Wolf’s fur stands up.'),
        FW('The fool. He is hunting Man, and a woodcutter’s fire has burnt his feet.', 'angry'),
        N(
          'Something rustles in the bushes. Father Wolf crouches to spring, and stops himself in mid-air.',
        ),
        FW('A man’s cub! Look!', 'shock'),
        N(
          'In the cave mouth, holding on to a low branch, stands a brown baby who has only just learned to walk.',
        ),
        N(
          'He is not frightened in the least. He toddles in, pushes among the cubs, and settles down to get warm.',
        ),
      ],
      [
        ask(
          2,
          'literacy',
          'flattery: kind-sounding words used to get something',
          'RL.3.3',
          [
            N(
              'Tabaqui says lots of lovely things about the cave and the cubs. What does he really want?',
            ),
          ],
          [
            o(
              'A bone, and the news he can sell.',
              [
                N('Right. His words are sweet because they are working for him.'),
                N('We call that flattery: praise that is meant to get something, not to be kind.'),
              ],
              true,
            ),
            o('To be the wolves’ best friend.', [
              N(
                'He acts like it. But look at what he does next: he crunches the bone and runs off to gossip.',
              ),
              N('A real friend’s kind words don’t come with a hand held out.'),
            ]),
            o('To teach the cubs to hunt.', [
              N('Ha! No. Tabaqui is the sort who follows hunters and picks up the scraps.'),
              N('His sweet talk is how he gets them.'),
            ]),
          ],
          'Worked out that Tabaqui’s flattery was a way of getting a bone, and that kind words can have a hidden aim.',
        ),
      ],
      [
        ch('room', 'Nudge your Nubbin to make room for him.', [
          N(
            'Your Nubbin shuffles over. The baby leans on it as if it were a cushion, which, to be fair, it nearly is.',
          ),
        ]),
        ch('still', 'Keep perfectly still.', [
          N(
            'You do not move. Mother Wolf notices that, and something in her eyes softens towards you.',
          ),
        ]),
      ],
    ),
    sc(
      'a24-01-cub-done',
      [
        MW(
          'A man’s cub. So that is what they look like. No fur at all, and not a bit afraid of us.',
          'soft',
        ),
        N(
          'The baby finds her warm side and goes to sleep against it, as if he had always lived here.',
        ),
        N(
          'Four wolf cubs sleep in a heap beside him, a tangle of tails and ears. Each one has four small paws.',
        ),
      ],
      [
        ask(
          2,
          'maths',
          'multiplication as equal groups (4 groups of 4)',
          '3.OA.A.1',
          [
            N(
              'Four cubs are asleep in a heap. Each cub has four paws. How many wolf paws are in the heap?',
            ),
          ],
          [
            o(
              '16.',
              [
                N('Yes. Four groups of four is 16: 4 × 4 = 16.'),
                N('Four paws, four paws, four paws, four paws.'),
              ],
              true,
            ),
            o('8.', [
              N('That is four plus four. But there are four cubs, and each has four paws.'),
              N('Count them in fours: 4, 8, 12, 16. Sixteen paws.'),
            ]),
            o('4.', [
              N('That is how many paws one cub has.'),
              N('With four cubs we count four paws four times: 4, 8, 12, 16. Sixteen paws.'),
            ]),
          ],
          'Used equal groups to work out 4 × 4 = 16 paws.',
        ),
      ],
    ),
    sc(
      'a24-01-door',
      [
        N(
          'The moonlight in the cave mouth goes dark. A huge striped head is pushed into the gap, and shoulders after it.',
        ),
        N(
          'He cannot get further in. The cave is too narrow, and he knows it, and it makes him angrier.',
        ),
        SK('A man’s cub went this way. Its parents have run off. Give it to me.', 'angry'),
        FW(
          'We are the Free People. We answer to our own leader, not to a tiger who hunts cows and woodcutters.',
        ),
        SK(
          'Free? Must Shere Khan stand in a wolf’s doorway and ask twice? Give me what is mine!',
          'angry',
        ),
        N(
          'Mother Wolf comes forward over her cubs. In the dark her eyes and the tiger’s meet, and hers do not move.',
        ),
        MW(
          'You have my answer. The cub is mine. He will not be harmed, and he will grow up to run with the pack.',
          'angry',
        ),
        MW('Go back to your woodcutters with your burnt feet, lame one. Go!'),
        N(
          'Shere Khan backs out of the cave mouth, growling. From the dark he shouts that this is not the end of it.',
        ),
        MW(
          'You are mine now, little one. I will call you Mowgli, the Frog, because you have no fur at all.',
          'soft',
        ),
        MW('Lie still, little Frog. You are safe in here.', 'soft'),
      ],
      [
        ask(
          9,
          'sel',
          'what bravery is: being scared and doing the right thing anyway',
          'CASEL: Self-awareness',
          [
            N(
              'Mother Wolf was brave. Her heart must have been pounding. What do you think makes someone brave?',
            ),
          ],
          [
            o('Not feeling scared at all.', [
              N('That is a fair answer. Lots of people think it.'),
              MW(
                'But then a brave deed would be easy. Many brave people say they were frightened and did it anyway.',
                'think',
              ),
            ]),
            o('Feeling scared, and doing the right thing anyway.', [
              N('That is a fair answer too, and it is the one many people give.'),
              MW(
                'Courage is not the lack of fear. It is a decision you make with your legs still wobbling.',
                'soft',
              ),
            ]),
            o('Caring about someone enough to stand up for them.', [
              N('A fair answer. Mother Wolf said she was only being a mother.'),
              MW('Sometimes love gives you a steadier voice than you thought you had.', 'soft'),
            ]),
          ],
          'Thought about what courage is, and whether being brave means being unafraid.',
        ),
      ],
      [
        ch('brave', 'Tell her that was the bravest thing you have seen.', [
          MW('Brave? I was being a mother. It looks the same from outside.', 'happy'),
        ]),
        ch('quiet', 'Say nothing. Breathe out.', [
          N('You breathe out. So does Father Wolf, rather louder, and he pretends he did not.'),
        ]),
      ],
    ),
    sc(
      'a24-01-door-done',
      [
        FW(
          'He will go to the pack, you know. The Law says every cub must be shown at the Council.',
          'think',
        ),
        MW('Then we will show him. At the full moon. Let them look.'),
        N('Above the cave mouth, a pale moon is hanging, almost round, but not quite.'),
      ],
      [
        ask(
          2,
          'science',
          'the Moon goes from full to full in about a month',
          '1-ESS1-1',
          [N('The wolves meet at the full moon. How long is it from one full moon to the next?')],
          [
            o(
              'About a month.',
              [
                N('Yes. The Moon takes about 29 and a half days to go from full to full.'),
                N('It shrinks away to nothing, then grows back to a bright round circle again.'),
              ],
              true,
            ),
            o('About a day.', [
              N('The Moon does change a little each night, but not that fast.'),
              N('From one full moon to the next takes about a month.'),
            ]),
            o('About a year.', [
              N('A year is the Sun’s big circle with the seasons.'),
              N('The Moon’s shapes come round much faster. A full moon returns about every month.'),
            ]),
          ],
          'Learned that the Moon takes about a month to go from full moon to full moon.',
        ),
      ],
    ),
    sc(
      'a24-01-complete',
      [
        N(
          'Night settles. Mother Wolf licks the man’s cub clean, then the wolf cubs, then, after some thought, your Nubbin.',
        ),
        N(
          'Your Nubbin is so surprised it falls over. Then it curls up among the cubs, between Mowgli and the smallest wolf, and sleeps.',
        ),
        MW(
          'It can stay there. A thing that sleeps in a wolf’s den is a wolf, more or less. Mostly less.',
          'happy',
        ),
        N(
          'You lie by the wall and listen to the whole den breathing in the dark. A pack is a kind of family, and families come in many shapes.',
        ),
      ],
      [
        notice(
          2,
          'sel',
          'families and packs can be made by choice as well as by birth',
          'CASEL: Social awareness',
          [
            MW('Some of my family were born to me, and one was brought in out of the cold.'),
            MW('I say they are all mine. What makes a family is who looks after whom.', 'soft'),
          ],
          'Heard that a family can be made by caring for one another, not only by being born into it.',
        ),
      ],
    ),
  ],
  [
    gl(
      'flatter',
      'To praise someone more than you mean, so that you can get something from them.',
      'a24-01-cub',
    ),
  ],
);

// ================================================================== A24-2 The Council Rock
const A2: EduQuest = quest(
  'a24-02',
  'The Council Rock',
  {
    'a24-02-s1': {
      goal: 'Go up to the Council Rock with the wolves at the full moon.',
      hint: 'Walk behind Mother Wolf. Stop at the edge of the circle; guests do not go in.',
    },
    'a24-02-s2': {
      goal: 'Watch the Council decide whether the man’s cub may stay.',
      hint: 'Stay at the edge and keep quiet. Only the Council speaks.',
    },
  },
  [
    sc(
      'a24-02-climb',
      [
        N(
          'At the full moon the wolves climb to the Council Rock. The hilltop is so heaped with boulders that a whole pack can sit hidden there.',
        ),
        N(
          'Mowgli toddles beside Mother Wolf with a fist in her fur, and the cubs tumble round him.',
        ),
        FW(
          'The Law says every cub is shown to the pack, so that any wolf will know it again. Then it may run where it likes.',
        ),
        N(
          'On the flat rock lies a great grey wolf, old and strong, stretched out in the moonlight.',
        ),
        FW('Akela, the Lone Wolf. He leads because he is strong, and cunning, and fair.'),
        N(
          'Your Nubbin looks at the moon, takes a deep breath, and lets out a howl. It comes out like a kettle.',
        ),
        YW('What was that?', 'shock'),
        MW('A guest. Don’t stare. It is rude.', 'happy'),
      ],
      [
        ask(
          5,
          'science',
          'sound is made by vibrations; animals use sound to talk across distance',
          '1-PS4-1',
          [
            FW(
              'Wolves howl to talk across the hills. What is a howl, really, to the air around it?',
            ),
          ],
          [
            o(
              'Air wobbling very fast, called vibrating.',
              [
                N('Yes. A throat wobbles the air, the air wobbles your ear, and you hear it.'),
                N('Open country carries a wolf’s howl for kilometres.'),
              ],
              true,
            ),
            o('A sort of light you can hear.', [
              N(
                'Light and sound are different things. Light can cross empty space, and sound cannot.',
              ),
              N('Sound is air wobbling, called vibrating.'),
            ]),
            o('Nothing. It is only inside our heads.', [
              N('Good that you are thinking about hearing. But sound is real, out in the air.'),
              N('You can feel it: put a hand on your throat and hum. That buzz is the vibration.'),
            ]),
          ],
          'Learned that a howl is a vibration of the air, and that wolves use it to talk over long distances.',
        ),
      ],
      [
        ch('hush', 'Hush your Nubbin gently.', [
          N('It hushes. Then, very quietly, it practises the howl again under its breath.'),
        ]),
        ch('proud', 'Tell it that was a fine howl.', [
          N(
            'It sits up very straight. For the rest of the night it looks at the moon as if they had an understanding.',
          ),
        ]),
      ],
    ),
    sc(
      'a24-02-climb-done',
      [
        N(
          'You stop at the edge of the circle, among the rocks, where the guests and the old ones sit.',
        ),
        N(
          'Mother Wolf pushes Mowgli into the moonlight. He sits there laughing, with a heap of pebbles from the hilltop.',
        ),
        MG('Eight white ones and five grey ones. Look. I sorted them.', 'happy'),
      ],
      [
        ask(
          2,
          'maths',
          'adding and comparing: 8 + 5 = 13, and 3 more white than grey',
          '2.OA.A.1',
          [
            MG(
              'How many pebbles do I have altogether? And how many more white ones than grey ones?',
            ),
          ],
          [
            o(
              '13 altogether, and 3 more white ones.',
              [
                N('Yes. 8 + 5 = 13, and 8 − 5 = 3.'),
                N('Adding finds the total. Subtracting finds the difference.'),
              ],
              true,
            ),
            o('13 altogether, and 5 more white ones.', [
              N('The total is right: 8 + 5 = 13. Well done.'),
              N('To find how many more, take the smaller from the bigger: 8 − 5 = 3.'),
            ]),
            o('12 altogether, and 3 more white ones.', [
              N('The difference is right: 8 − 5 = 3.'),
              N('The total is one more than that. Count on from 8: 9, 10, 11, 12, 13.'),
            ]),
          ],
          'Practised adding two numbers within 20 and finding the difference by subtracting.',
        ),
      ],
    ),
    sc(
      'a24-02-council',
      [
        AK('You know the Law. Look, wolves. Look closely at each cub.'),
        N('A muffled roar comes up from behind the rocks. Shere Khan has followed.'),
        SK(
          'The cub is mine. Give him to me. What have the Free People to do with a man’s cub?',
          'angry',
        ),
        AK(
          'Who speaks for this cub? The Law says two, who are not his father and mother, must speak for him.',
        ),
        N(
          'Nobody answers. Mother Wolf gets ready for what she knows would be her last fight, if it comes to fighting.',
        ),
        N(
          'Then a big brown bear heaves himself up on his hind legs. He has sat so still you took him for a rock.',
        ),
        BL(
          'I will speak for him. A man’s cub never hurt anyone. I am a poor hand at speeches, but that is true. Let him run with you.',
          'think',
        ),
        BL('I will teach him myself.'),
        AK('We need another. Who speaks besides Baloo?'),
        N(
          'A black shadow drops into the circle: Bagheera the panther, the colour of a moonless night, with a voice like warm milk.',
        ),
        BG(
          'I will add my own gift to Baloo’s word: a whole bull, not far from here, for the pack to share.',
        ),
        BG(
          'Accept the man’s cub under the Law, and the bull is the pack’s. A fair trade, I think.',
        ),
        N(
          'The young wolves’ ears go up, because they are always hungry. A whole bull, for one small cub?',
        ),
      ],
      [
        ask(
          8,
          'social-studies',
          'why a fair rule asks for more than one voice (fairness and rules)',
          'D2.Civ.8.K-2',
          [
            N(
              'The Law says two wolves, who are not his parents, must speak for a cub. Why might the Law ask for two? There is no right answer.',
            ),
          ],
          [
            o('One voice could be wrong, so two is safer.', [
              N(
                'That is a fair answer. Two people can check each other, and a mistake is harder to make.',
              ),
              N(
                'Many human rules work this way too. Judges often sit in groups for the same reason.',
              ),
            ]),
            o('Parents should decide, not anyone else.', [
              N(
                'That is a fair answer. Parents know the cub best, and they do speak first in the cave.',
              ),
              N(
                'The Law adds others in case the parents are missing, or too scared, or the cub has nobody.',
              ),
            ]),
            o('It depends whether the two speakers are honest.', [
              N('That is a sharp answer. Any rule is only as good as the people who follow it.'),
              N(
                'Baloo and Bagheera are good speakers because they promise something real: a bear’s teaching, a panther’s bull.',
              ),
            ]),
          ],
          'Thought about why a fair rule might need more than one person to speak up for someone.',
        ),
      ],
      [
        ch('edge', 'Stay where you are and keep very still.', [
          N('You keep still. Beside you, your Nubbin keeps so still it forgets to blink.'),
        ]),
        ch('hand', 'Put your hand on your Nubbin’s back.', [
          N(
            'Your Nubbin leans into your hand. Across the circle, Mother Wolf sees, and nods once.',
          ),
        ]),
      ],
    ),
    sc(
      'a24-02-council-done',
      [
        N(
          'The wolves come one by one to look at Mowgli, and then they go down the hill after the bull.',
        ),
        AK('He is the pack’s now. Take him home, and bring him up properly.'),
        N('The names on this hill come from Hindi, one of the many languages spoken in India.'),
        N(
          'By the time the pack reaches the bottom of the hill, Mowgli is asleep on a wolf’s back.',
        ),
      ],
      [
        notice(
          2,
          'literacy',
          'the names of the characters are real Hindi words',
          'L.3.4',
          [
            BL('My name comes from bhalu, the Hindi word for bear. Akela means alone, or lone.'),
            BL(
              'Bandar is a monkey and hathi an elephant. Sher is a big cat, a tiger or a lion, and a khan is a chief.',
            ),
            BL(
              'So Shere Khan’s name means Tiger Chief. He picked a grand name for a lame cat.',
              'happy',
            ),
          ],
          'Learned that several story names are Hindi words: bhalu (bear), akela (alone), bandar (monkey), hathi (elephant), sher (tiger or lion), khan (chief).',
        ),
      ],
    ),
    sc(
      'a24-02-complete',
      [
        N('Shere Khan roars into the night, furious. Nobody answers him.'),
        BG(
          'Shout all you like. That little cub will grow, and one day you will wish you had been quieter.',
          'think',
        ),
        N('Bagheera passes you on the way down, and gives you a long yellow look.'),
        BG(
          'And you, guest. You stood still, and said nothing you did not know. That is rarer than a bull.',
        ),
        BL(
          'Lessons start when the cub can stand without falling over. You too. And that.',
          'happy',
        ),
        N('“That” is your Nubbin, which is trying to howl at the moon again, very small.'),
      ],
      [
        ask(
          3,
          'sel',
          'knowing when to listen, and not pretending to know',
          'CASEL: Self-management',
          [
            N(
              'Bagheera says staying quiet and not pretending was “rarer than a bull”. Why might that be a strength?',
            ),
          ],
          [
            o(
              'Knowing when to listen is a skill.',
              [
                BG(
                  'Yes. Anyone can talk. Knowing when to listen, and saying only what you know, is harder.',
                  'soft',
                ),
                N(
                  'Baloo and Bagheera both spoke up, and you were right to stay quiet. Each was the right choice at the time.',
                ),
              ],
              true,
            ),
            o('Speaking up is always wrong.', [
              BG('No. Baloo spoke up, and it saved a life.', 'think'),
              N('The skill is knowing when. Today your job was to watch, and you did it.'),
            ]),
            o('Because wolves like quiet guests.', [
              BG('Ha. That helps. But it is about more than manners.'),
              N('Not pretending to know things is how other people learn they can trust you.'),
            ]),
          ],
          'Talked about listening when it matters, and being honest about what you know.',
        ),
      ],
    ),
  ],
  [
    gl('Law', 'The set of rules that every animal in the jungle agrees to keep.', 'a24-02-council'),
    gl(
      'Hindi',
      'One of the main languages of India, spoken by hundreds of millions of people.',
      'a24-02-council-done',
    ),
  ],
);

// ================================================================== A24-3 Baloo's Lessons
const A3: EduQuest = quest(
  'a24-03',
  'Baloo’s Lessons',
  {
    'a24-03-s1': {
      goal: 'Join Mowgli at Baloo’s lessons in the glade.',
      hint: 'The glade is below the Council Rock, by the fallen tree. Bring your Nubbin.',
    },
    'a24-03-s2': {
      goal: 'Learn the Master Words of the jungle from Baloo.',
      hint: 'Say the Words back slowly, with the right voice for each people.',
    },
    'a24-03-s3': {
      goal: 'Practise the calls in the glade until Baloo is satisfied.',
      hint: 'Match each call to its people: the hunters, the birds, the snakes.',
    },
  },
  [
    sc(
      'a24-03-glade',
      [
        N(
          'Seasons go by, as they do on this page. Mowgli is a boy of seven now, brown and quick and full of opinions.',
        ),
        N(
          'Baloo sits on a fallen tree in a glade with his eyes half shut, like a schoolmaster who has seen everything twice.',
        ),
        BL(
          'Sit. Both of you. All three of you. The Law of the Jungle is old, and long, and it does not care if you are bored.',
        ),
        MG('I am always bored. You have been teaching me for ever.', 'angry'),
        BL(
          'Wolves need only a little of the Law. A man’s cub must learn all of it. So must a guest.',
        ),
        BL(
          'Which branches will hold you, and which are rotten. How to speak politely to the wild bees.',
        ),
        BL(
          'How to beg pardon of a bat you have woken. How to call to the water-snakes before you jump into their pool.',
        ),
        N(
          'Your Nubbin tries to look at Baloo, the bees and the bat all at once. It has gone slightly cross-eyed.',
        ),
      ],
      [
        ask(
          5,
          'science',
          'bees carry pollen from flower to flower, so fruit and seeds can grow',
          '2-LS2-2',
          [
            BL(
              'Why speak politely to bees? Because they are busy. They carry pollen from flower to flower. What grows because of it?',
            ),
          ],
          [
            o(
              'Fruit and seeds.',
              [
                BL(
                  'Right. Pollen from one flower reaches another, and then that flower can make fruit and seeds.',
                  'happy',
                ),
                N(
                  'Without bees, many jungle trees would have much less fruit for the monkeys, the bears and the deer.',
                ),
              ],
              true,
            ),
            o('Rocks.', [
              BL('Ha. Rocks do their growing very slowly, and bees have nothing to do with it.'),
              N('Pollen helps flowers turn into fruit and seeds. That is what bees are for.'),
            ]),
            o('Clouds.', [
              BL('Clouds are made of water, far above the flowers.'),
              N('Bees carry pollen, and the flowers use it to make fruit and seeds.'),
            ]),
          ],
          'Learned that bees spread pollen between flowers so that plants can make fruit and seeds.',
        ),
      ],
      [
        ch('listen', 'Listen hard and say each one back.', [
          BL(
            'Good. A guest who listens. You can teach the cub manners while I teach him the Law.',
            'happy',
          ),
          MG('Hmph.'),
        ]),
        ch('mowgli', 'Whisper to Mowgli that you are bored too.', [
          MG('Really? I thought guests liked everything.', 'happy'),
          BL('I heard that. I hear everything. Bears do.'),
        ]),
      ],
    ),
    sc(
      'a24-03-glade-done',
      [
        BL(
          'First, the Strangers’ Hunting Call. You give it when you hunt outside your own territory, until you are answered.',
        ),
        BL(
          'It asks leave, because you are hungry. The answer gives it, as long as you eat what you catch and never kill for sport.',
        ),
        MG('Why ask? If I am hungry, I am hungry.'),
        N(
          'Your Nubbin looks at the ground it is sitting on, and then at the next patch of ground, and tiptoes politely between them.',
        ),
      ],
      [
        ask(
          2,
          'social-studies',
          'respecting other people’s land and rules by asking leave',
          'D2.Civ.8.K-2',
          [N('Why does the Strangers’ Call ask leave before hunting on another wolf’s ground?')],
          [
            o(
              'Asking shows respect and stops fights.',
              [
                BL(
                  'Yes. A territory is a place that someone has been looking after. Asking says: I know it is yours.',
                  'happy',
                ),
                N(
                  'Real animals mark their territories with scent and calls. Many people do something like it with signs, gates and manners.',
                ),
              ],
              true,
            ),
            o('So the wolves can hunt everything.', [
              BL(
                'The opposite. The Call comes with a promise: eat what you catch, kill for no sport.',
              ),
              N('Asking leave is for respect, and it keeps the peace.'),
            ]),
            o('It is just a funny noise.', [
              BL('It sounds funny to a bear. But the noise has a meaning: please, may I?'),
              N('It is how strangers say they come in peace.'),
            ]),
          ],
          'Understood that asking leave before using someone else’s ground is a way of showing respect and avoiding fights.',
        ),
        notice(
          3,
          'science',
          'sloth bears eat termites, ants, fruit and honey; mothers carry cubs on their backs',
          '4-LS1-1',
          [
            BL(
              'In the real jungle, a bear like me is called a sloth bear. We have long claws for digging out termites, and we love ants, fruit and honey.',
            ),
            BL(
              'Sloth bear mothers carry their cubs on their backs. Sloth bears are protected by law in India today.',
            ),
          ],
          'Learned that Baloo is a sloth bear: it digs for termites and ants, eats fruit and honey, carries its cubs on its back, and is protected by law in India.',
        ),
      ],
    ),
    sc(
      'a24-03-words',
      [
        BL(
          'Now the Master Words. They matter more than anything else I teach. Say them right, and the jungle will let you be.',
        ),
        BL(
          'There is a word for the Hunting People, a word for the Birds, and a word for the Snakes.',
        ),
        MG('Yes, yes, I know them. I know them better than you do. Listen.', 'happy'),
        N(
          'Mowgli gabbles the Words the way a child says a poem for a grown-up, to get it over with.',
        ),
        BL('Again. Slowly. For the Hunting People.'),
        BL('You and I are family, all of us, under the same sky.'),
        BL(
          'Use the hunters’ voice for that, deep in the chest. For the Birds, you whistle it, like Chil the kite.',
        ),
        BL(
          'For the Snakes you say it with a hiss that cannot be written down. You will learn it from them.',
        ),
        N(
          'Mowgli yawns in the middle of the hiss. Baloo cuffs him, not hard, but hard enough to sit him down.',
        ),
        MG('Ow! You always hit me! I hate you!', 'angry'),
        BG(
          'He cuffs you because he loves you, little brother. Better a bear’s cuff now than a snake’s bite later.',
          'soft',
        ),
      ],
      [
        ask(
          1,
          'literacy',
          'a word with more than one meaning: master',
          'L.3.4',
          [
            BL(
              'I call them the Master Words. “Master” is a word with a few meanings. Which one do I mean?',
            ),
          ],
          [
            o(
              'The most important, the chief ones.',
              [
                BL(
                  'Yes. Master here means chief, the one that matters most. The jungle is run on them.',
                  'happy',
                ),
                N(
                  'Master can also mean someone who has got really good at a skill, as in master of a craft.',
                ),
              ],
              true,
            ),
            o('The owner of a pet.', [
              BL('That is another meaning of master. But the Words do not belong to anyone.'),
              N('Here it means the chief ones, the ones that matter most.'),
            ]),
            o('A big key that opens every door.', [
              BL('A master key does open every door. A sharp thought.', 'happy'),
              N('Here the sense is chief: the most important Words of all.'),
            ]),
          ],
          'Looked at the many meanings of the word “master” and chose the one that fits.',
        ),
      ],
      [
        ch('repeat', 'Say the Words for the Hunting People, slowly.', [
          N(
            'You say them slowly, in the deepest voice you have. Baloo’s little eyes close all the way, which is praise.',
          ),
        ]),
        ch('why', 'Ask Baloo why the Words work.', [
          BL(
            'Because everyone in the jungle has said them, for longer than the hills. A thing everyone keeps is a law.',
            'think',
          ),
        ]),
        ch('sit', 'Sit down next to Mowgli while he sulks.', [
          N(
            'You sit beside him and say nothing. After a while he stops sulking, mostly so he can show you the bird whistle.',
          ),
        ]),
      ],
    ),
    sc(
      'a24-03-words-done',
      [
        N(
          'Your Nubbin, at the back, has been listening. It puffs itself up and gives a small, determined hiss.',
        ),
        BL('That is not wrong, actually. Huh. The snakes might take that.', 'shock'),
        MG('He hit me, and now he is pleased with the Nubbin. It is not fair.', 'sad'),
      ],
      [
        ask(
          2,
          'sel',
          'thinking about how adults should teach and correct children',
          'CASEL: Responsible decision-making',
          [
            N(
              'Bagheera says a cuff now is better than a snake’s bite later. Is hurting someone ever the right way to teach them? There is no one right answer.',
            ),
          ],
          [
            o('No. Teaching should never hurt.', [
              N(
                'That is a fair answer, and in the Grove it is the rule. Nobody hits here, not even a bear.',
              ),
              N(
                'You can learn the same lesson from a clear word, a pause, or a job done again, and no one has to be afraid.',
              ),
            ]),
            o('A little cuff is fine if it keeps you safe.', [
              N(
                'That is a fair thing to think about. Baloo’s cuff is small, and he is trying to stop Mowgli getting hurt.',
              ),
              N(
                'But Mowgli says it hurt his feelings. What Baloo meant and what Mowgli felt can be different, and both matter.',
              ),
            ]),
            o('It depends on whether the person loves you.', [
              N('That is a fair answer. Love does change how a thing feels.'),
              N(
                'But the hurt can be just as real, so many teachers choose words, not blows. Both Baloo and Mowgli have a point.',
              ),
            ]),
          ],
          'Reflected on how a person trying to keep us safe should teach, and how a correction can feel to the child.',
        ),
      ],
    ),
    sc(
      'a24-03-calls',
      [
        BL(
          'Now we practise. I will be the jungle. You come into my ground and you say the right thing to the right one.',
        ),
        N(
          'Baloo goes behind a bush and becomes, in turn, a very bad bird, a very bad snake and a passable bear.',
        ),
        BL('Tweet. I am a kite. Very fierce. Speak.', 'happy'),
        MG('He is the worst bird in the world.', 'happy'),
        BL('I heard that too.'),
        N(
          'Mowgli whistles the Birds’ word without thinking. He is good at this, when he stops pretending he is not.',
        ),
        N(
          'Your Nubbin hisses at the bear and growls at the bird. Baloo patiently explains it the right way round, twice.',
        ),
        BL(
          'Growl for the hunters, whistle for the birds, hiss for the snakes. Growl, whistle, hiss. Growl, whistle, hiss.',
        ),
      ],
      [
        ask(
          7,
          'maths',
          'finding the next item in a repeating pattern',
          '4.OA.C.5',
          [
            BL(
              'Listen: growl, whistle, hiss, growl, whistle, hiss, growl, whistle… What comes next?',
            ),
          ],
          [
            o(
              'Hiss.',
              [
                BL(
                  'Yes. The pattern repeats every three calls, and the third call is the hiss.',
                  'happy',
                ),
                N(
                  'Spot the part that repeats, then carry on with it. That is how you find the rule.',
                ),
              ],
              true,
            ),
            o('Growl.', [
              BL(
                'Growl is how this round started. The pattern goes growl, whistle, hiss, then starts again.',
              ),
              N('We have just heard the whistle, so the next call is the hiss.'),
            ]),
            o('Whistle.', [
              BL('We have had a whistle already in this round, right at the end.'),
              N('Growl, whistle, then the third call of the group: the hiss.'),
            ]),
          ],
          'Found the next item in a growl-whistle-hiss pattern by spotting the part that repeats.',
        ),
      ],
    ),
    sc(
      'a24-03-calls-done',
      [
        BL(
          'Enough. The cub knows it and will not say it, and the guest says it and is still learning it.',
          'think',
        ),
        BL('And the small one has its own law, which is a mystery to bears.'),
        N(
          'Your Nubbin hisses at a passing stick insect. The insect does not move. Nobody can tell if it is impressed.',
        ),
      ],
      [
        notice(
          2,
          'science',
          'snakes feel low rumbles through the ground and taste the air with their tongues',
          '4-LS1-2',
          [
            BL(
              'A snake has no ears you can see. It feels your footsteps through the ground, in its belly.',
            ),
            BL(
              'And it flicks its tongue to taste the air. It tells the snake where you are, and what you had for lunch.',
              'happy',
            ),
          ],
          'Learned that a snake has no outside ears, feels vibrations through the ground and uses its tongue to taste the air.',
        ),
      ],
    ),
    sc(
      'a24-03-complete',
      [
        N(
          'Baloo lies back on his tree with a huge, satisfied grunt, as if he had done all the work himself.',
        ),
        BL(
          'The Law is like the creeper on a tree trunk. It holds everything up, and you only see it when it is gone.',
        ),
        MG('Can I go now?'),
        BL('Go. And do not go near the Monkey-People. I mean it.', 'think'),
        N(
          'Mowgli looks away very quickly, the way a boy looks away who has been somewhere he should not.',
        ),
      ],
      [
        ask(
          1,
          'literacy',
          'understanding a simile: the Law is like a creeper',
          'L.4.5',
          [BL('I said the Law is like a creeper on a tree. Why is that a good comparison?')],
          [
            o(
              'It holds things up, and you only notice when it is gone.',
              [
                BL(
                  'Yes. A comparison using “like” or “as” is a simile. A good one shows you something new.',
                  'happy',
                ),
                N('A rule you never think about is probably working well.'),
              ],
              true,
            ),
            o('Because the Law is green.', [
              BL('Ha. It is not green. A simile matches how things work, not how they look.'),
              N('A creeper holds up the tree, and the Law holds up the jungle.'),
            ]),
            o('Because Baloo likes trees.', [
              BL('I do like trees. But the reason goes deeper.'),
              N('Both the creeper and the Law quietly hold things together.'),
            ]),
          ],
          'Explained what Baloo’s simile means: a creeper and a law both hold things together, unseen.',
        ),
      ],
    ),
  ],
  [
    gl(
      'territory',
      'The area of ground that an animal, or a group of animals, looks after and defends.',
      'a24-03-glade-done',
    ),
    gl(
      'creeper',
      'A climbing plant that winds itself round a tree trunk and holds on tight.',
      'a24-03-complete',
    ),
  ],
);

// ================================================================== A24-4 The Monkey-People
const A4: EduQuest = quest(
  'a24-04',
  'The Monkey-People',
  {
    'a24-04-s1': {
      goal: 'Look for Mowgli, who has gone off sulking under the trees.',
      hint: 'Follow the chattering. The Monkey-People are never quiet for long.',
    },
    'a24-04-s2': {
      goal: 'Watch for Chil the kite, and see where he goes.',
      hint: 'Look up. Chil circles over the monkeys, and then he turns back.',
    },
    'a24-04-s3': {
      goal: 'Go with Baloo and Bagheera to ask Kaa for help.',
      hint: 'He is sunning himself on a warm ledge. Speak politely, and do not mention that he looks hungry.',
    },
  },
  [
    sc(
      'a24-04-trees',
      [
        N(
          'Mowgli lies on Bagheera’s back in the noon heat, telling a secret to anyone who will listen.',
        ),
        MG(
          'The Bandar-log are nice to me. They give me nuts. They say I will be their leader one day. Baloo never says that.',
        ),
        BL(
          'The Monkey-People have no law. They have no leader. They boast and chatter and pretend to be great.',
          'angry',
        ),
        BL('Then a nut falls, and they forget it all and laugh.'),
        N(
          'Mowgli goes red and stalks off to sulk under a tree. Above him, the leaves start to whisper with a hundred grey hands.',
        ),
        BD(
          'Hoo! Look at us! Look how clever we are! Nobody in the jungle is as clever as us!',
          'happy',
        ),
        BD('Everybody agrees! We just agreed! What were we agreeing about? Ooh, a nut!'),
        N(
          'A whole troop of monkeys drops through the branches like falling fruit. When they swing back up, Mowgli is with them.',
        ),
        MG('Baloo! Bagheera!', 'shock'),
      ],
      [
        ask(
          7,
          'science',
          'animals living in groups help each other survive',
          '3-LS2-1',
          [
            N(
              'Real monkeys, like the langurs and macaques of India, live in a group called a troop. How does a troop help them?',
            ),
          ],
          [
            o(
              'Many pairs of eyes spot danger and find food.',
              [
                N(
                  'Yes. In a troop, someone is always watching, and a warning call can save everyone.',
                ),
                N('Group living helps many animals survive, from wolves to meerkats.'),
              ],
              true,
            ),
            o('It makes them louder than the tigers.', [
              N('Monkeys are very loud. But a loud troop is not what keeps them safe.'),
              N('They survive because many eyes spot danger, and members warn each other.'),
            ]),
            o('It does not help. They would do just as well alone.', [
              N('A lone monkey is easy prey. A troop watches out for each other.'),
              N('That is why most monkeys live in groups.'),
            ]),
          ],
          'Learned that animals like monkeys live in groups called troops, where many eyes help spot danger and find food.',
        ),
      ],
      [
        ch('shout', 'Shout for Baloo and Bagheera.', [
          N(
            'They are already running. Baloo runs like a landslide, and Bagheera like a shadow that is late for something.',
          ),
        ]),
        ch('follow', 'Run underneath and keep the monkeys in sight.', [
          N(
            'You run. Your Nubbin keeps its eyes on the treetops so well that it walks into a tree.',
          ),
        ]),
      ],
    ),
    sc(
      'a24-04-trees-done',
      [
        N(
          'The monkeys travel the treetops along their own roads, high and fast. Below them, nobody can keep up for long.',
        ),
        N('Mowgli, swung from hand to hand, sees a kite circling high above. He takes a breath.'),
        N(
          'From up there, the whole forest must look like a map: a river, a ridge, a clearing, a green sea of trees.',
        ),
      ],
      [
        ask(
          2,
          'social-studies',
          'a map shows a place from above, so you can see the whole route',
          'D2.Geo.2.K-2',
          [
            N(
              'A map shows a place as if you were looking down from above, like a kite. Why does that help someone searching for Mowgli?',
            ),
          ],
          [
            o(
              'You can see the whole route, and the landmarks, at once.',
              [
                N(
                  'Yes. From above you can follow the river and the ridge and see where each leads.',
                ),
                N('A map lets you read a whole place in one look.'),
              ],
              true,
            ),
            o('It makes the forest look smaller and less scary.', [
              N('It does look smaller. But the real help is the view of the whole route.'),
              N('Seen from above, you can plan where to go.'),
            ]),
            o('It makes the monkeys slow down.', [
              N('Sadly not. The monkeys do not look at maps.'),
              N('A map helps the searcher see the route and where it leads.'),
            ]),
          ],
          'Learned that a map is a view from above that shows a whole route and its landmarks.',
        ),
      ],
    ),
    sc(
      'a24-04-chil',
      [
        N(
          'Mowgli whistles the Master Word of the Birds, the way he did in the glade when he forgot to pretend he could not.',
        ),
        N(
          'High above, Chil the kite tips one wing, and drops lower to see who has called him by the proper word.',
        ),
        CH('You are no bird, little one. And yet you have the Word.'),
        MG(
          'Watch where they take me! Tell Baloo and Bagheera! The bear and the panther of the Seeonee wolves!',
          'shock',
        ),
        CH('Whose trail? Who calls?'),
        MG('Mowgli! The Frog, the wolves’ man-child! Please! Watch where I go!'),
        N(
          'Chil swings away higher and higher, without a flap, riding a thermal, a pillar of warm air rising from the hot ground.',
        ),
        N('Until he is a dot against the blue, keeping the treetops in sight.'),
        CH(
          'They have taken him to the Cold Lairs. The Monkey-People stay there a night, a month. Who knows? They do not.',
        ),
      ],
      [
        ask(
          6,
          'science',
          'soaring birds ride rising warm air called thermals',
          '4-PS3-2',
          [N('Chil climbs higher and higher without flapping his wings. What lifts him?')],
          [
            o(
              'Warm air rising from the ground.',
              [
                N(
                  'Yes. Sunshine heats the ground, the air above warms and rises, and big birds ride it up.',
                ),
                N(
                  'That air column is called a thermal. It lets the kite look out over the forest for hours without getting tired.',
                ),
              ],
              true,
            ),
            o('The wind pushing him from below.', [
              N('Wind does help birds. But a kite also circles in still weather.'),
              N('The lift comes from warm air rising, called a thermal.'),
            ]),
            o('A very strong flap of his wings.', [
              N('A flap helps at the start. But Chil does not flap at all while he climbs.'),
              N('He rides a thermal, which is warm air rising.'),
            ]),
          ],
          'Learned that kites and other big birds soar by riding thermals, columns of warm air rising from the ground.',
        ),
      ],
      [
        ch('thanks', 'Thank Chil properly, with the Birds’ word.', [
          CH(
            'Thank you, guest. You whistle like a duck. But you whistle. That is more than most.',
            'happy',
          ),
        ]),
        ch('baloo', 'Turn to Baloo. What now?', [
          BL('Now I think. Bears do not think fast. But they think all the way down.', 'think'),
        ]),
      ],
    ),
    sc(
      'a24-04-chil-done',
      [
        BG(
          'The Cold Lairs. They are twelve kilometres from here. They are not afraid of us there.',
          'angry',
        ),
        BG('They know we cannot climb the way they do.'),
        BL(
          'They are afraid of one thing. Kaa. He climbs as well as they do, and they know it in their bones.',
        ),
        BL('I trot four kilometres in an hour, if nobody talks to me.'),
      ],
      [
        ask(
          3,
          'maths',
          'distance, speed and time: 12 km at 4 km an hour',
          '4.MD.A.2',
          [
            N(
              'The Cold Lairs are 12 kilometres away. Baloo trots 4 kilometres in each hour. How many hours will the trip take?',
            ),
          ],
          [
            o(
              '3 hours.',
              [
                N('Yes: 12 ÷ 4 = 3. Every hour he covers 4 kilometres: 4, 8, 12.'),
                N('Three hours, if nobody talks to him.'),
              ],
              true,
            ),
            o('4 hours.', [
              N('That is how many kilometres he covers each hour.'),
              N(
                'Count the hours: after 1 hour he has done 4, after 2 hours 8, after 3 hours 12. Three hours.',
              ),
            ]),
            o('8 hours.', [
              N('In 8 hours, at 4 kilometres an hour, he would go 32 kilometres. Far too far!'),
              N('Each hour is 4 kilometres. 12 ÷ 4 = 3 hours.'),
            ]),
          ],
          'Divided a distance by a speed to find how many hours a journey takes.',
        ),
      ],
    ),
    sc(
      'a24-04-kaa',
      [
        N(
          'Kaa lies on a warm ledge in the afternoon sun, admiring himself. He has just changed his skin.',
        ),
        N(
          'He is a rock python, and every metre of him is beautifully patterned in brown and yellow.',
        ),
        KA(
          'Well, well. A bear, and a panther, and a small strange guest, and a smaller, stranger one. What brings you?',
          'think',
        ),
        BG('Greetings, Kaa. We are hunting. The Bandar-log have taken our man’s cub.'),
        BL('They call you names, Kaa. Old rope, they call you. Bootlace. Wriggler.', 'think'),
        KA('Do they.', 'angry'),
        N(
          'Kaa’s head goes very still. That stillness is worse than any roar, and every monkey in the jungle knows it.',
        ),
        KA('The Monkey-People have been very foolish. Where is this cub of yours?'),
      ],
      [
        ask(
          4,
          'literacy',
          'a metaphor says one thing is another to show what it is like',
          'L.4.5',
          [BL('The monkeys call Kaa “old rope” and “bootlace”. Is Kaa really a rope?')],
          [
            o(
              'No. It is a metaphor, a joke comparing him to a rope.',
              [
                N('Yes. A metaphor says one thing is another, to show what it is like.'),
                N('Here the monkeys mean Kaa is long and floppy. Kaa does not find it funny.'),
              ],
              true,
            ),
            o('Yes. He is a rope with a head.', [
              N('He is long, like a rope, and that is the joke. But he is a living python.'),
              N(
                'When something is called another thing to show what it is like, that is a metaphor.',
              ),
            ]),
            o('No. The monkeys cannot see properly.', [
              N('Their eyesight is good. They know what Kaa is, and that is why they are scared.'),
              N('They are using a metaphor: calling him a rope, to mock him.'),
            ]),
          ],
          'Understood that “old rope” and “bootlace” are metaphors that compare Kaa to something else, here to tease him.',
        ),
      ],
      [
        ch('polite', 'Bow to Kaa and tell him his new skin suits him.', [
          KA('It does. Thank you for noticing. Nobody notices.', 'happy'),
          N('Bagheera rolls his eyes at you, but he looks impressed.'),
        ]),
        ch('nubbin', 'Keep your Nubbin behind you.', [
          KA(
            'Wise little guest. I do not eat guests. But I have been known to forget things.',
            'think',
          ),
        ]),
      ],
    ),
    sc(
      'a24-04-kaa-done',
      [
        KA(
          'The Cold Lairs, by moonlight. I will go by my own road. Do not wait for me. I will be there when I am there.',
        ),
        N(
          'He pours himself off the ledge and is gone into the grass, and the grass does not even move.',
        ),
        N(
          'Left on the warm stone is a long, thin, papery ghost of a snake: Kaa’s old skin, without a rip in it.',
        ),
      ],
      [
        ask(
          2,
          'science',
          'snakes shed their skin as they grow',
          '3-LS1-1',
          [N('Kaa has left his old skin on the ledge. Why do snakes shed their skin?')],
          [
            o(
              'They grow, and the old skin does not stretch.',
              [
                N('Yes. A snake grows all its life, and its outer skin does not grow with it.'),
                N(
                  'So it wriggles out of the old skin and shows the new one underneath. Young snakes shed more often than old ones.',
                ),
              ],
              true,
            ),
            o('They are bored with the colour.', [
              N('The new skin is the same colours as before.'),
              N('Snakes shed because they have grown too big for the old skin.'),
            ]),
            o('It protects them from the rain.', [
              N('The new skin is no more waterproof than the old.'),
              N('A snake sheds because it grows, and the old skin does not stretch.'),
            ]),
          ],
          'Learned that snakes shed their skin because they keep growing and the old skin does not stretch.',
        ),
      ],
    ),
    sc(
      'a24-04-complete',
      [
        N(
          'You run with Baloo and Bagheera all afternoon. Baloo is soon out of breath, and keeps going anyway.',
        ),
        BL('I should have watched him better. I cuffed him, and then I did not watch him.', 'sad'),
        BG('You taught him the Words, and he used them. That was you, old bear.'),
        N(
          'Your Nubbin rides on Baloo’s back for the last mile, because its legs are short. Baloo lets it.',
        ),
      ],
      [
        ask(
          2,
          'sel',
          'blame and responsibility: when something goes wrong, whose fault is it?',
          'CASEL: Responsible decision-making',
          [
            N(
              'Baloo blames himself. Bagheera says Baloo’s teaching is what saved Mowgli. Who do you think is right? There is no one right answer.',
            ),
          ],
          [
            o('Baloo, a teacher should keep watching.', [
              N(
                'That is a fair answer. A grown-up who looks after a child does have a duty to watch.',
              ),
              N('But a teacher cannot see everything, and the monkeys chose to carry Mowgli away.'),
            ]),
            o('Bagheera. The Words got Mowgli out.', [
              N(
                'That is a fair answer. The Master Word brought Chil down, and Chil brought the help.',
              ),
              N('Both things are true: Baloo worried, and his lessons worked.'),
            ]),
            o('Neither. The monkeys are to blame.', [
              N('That is a fair answer. The monkeys did the carrying.'),
              N(
                'Even so, people who care often feel a duty to do better next time, which is how Baloo feels.',
              ),
            ]),
          ],
          'Thought about who is to blame when something goes wrong, and how caring people can feel responsible even when it is not all their fault.',
        ),
      ],
    ),
  ],
  [
    gl('troop', 'A group of monkeys that live and travel together.', 'a24-04-trees'),
    gl(
      'thermal',
      'A column of warm air rising from hot ground, which big birds use to climb without flapping.',
      'a24-04-chil',
    ),
  ],
);

// ================================================================== A24-5 The Cold Lairs
const A5: EduQuest = quest(
  'a24-05',
  'The Cold Lairs',
  {
    'a24-05-s1': {
      goal: 'Creep into the Cold Lairs by moonlight and find Mowgli.',
      hint: 'Keep to the shadow of the broken walls. The summer-house is in the middle of the terrace.',
    },
    'a24-05-s2': {
      goal: 'Watch from the summer-house wall while Bagheera and Baloo fight their way in.',
      hint: 'Keep your Nubbin close. You are here to watch, not to wrestle monkeys.',
    },
    'a24-05-s3': {
      goal: 'Get your Nubbin out of the Cold Lairs while Kaa dances.',
      hint: 'Do not watch Kaa. Cover your Nubbin’s eyes and follow Mowgli out.',
    },
  },
  [
    sc(
      'a24-05-cistern',
      [
        N(
          'The Cold Lairs are a lost city on a hill: ruins of roofless palaces, dry fountains, and trees pushing up through the floors.',
        ),
        N(
          'Kings built it once. Nobody remembers which ones, least of all the monkeys, who think they built it themselves.',
        ),
        BD(
          'We are great! We are clever! We have a man’s cub, and he will show us how to weave sticks!',
          'happy',
        ),
        BD(
          'Weave, man’s cub! Weave! No, wait, we are bored of that. Let us have a council about it. What were we doing?',
        ),
        N(
          'They drop Mowgli through the broken roof of a little summer-house. Inside, the floor is alive with cobras.',
        ),
        MG('You and I are family, all of us, under the same sky.'),
        N(
          'He says it with the Snakes’ hiss, the one Baloo said could not be written down. The cobras lower their hoods.',
        ),
        N(
          'Your Nubbin, at the doorway beside you, gives its small hiss too. One old cobra turns its head and seems to approve.',
        ),
      ],
      [
        ask(
          1,
          'social-studies',
          'how we learn about people who lived long ago from what they left behind',
          'D2.His.2.K-2',
          [
            N(
              'Nobody remembers who built the Cold Lairs. How could a person today find out about the people who lived in a ruined city?',
            ),
          ],
          [
            o(
              'By studying what they left: walls, tools, pots and written words.',
              [
                N('Yes. Experts called archaeologists dig carefully and piece together clues.'),
                N('Stories and songs passed down through families help too.'),
              ],
              true,
            ),
            o('By asking the monkeys.', [
              N('The monkeys do not remember. That is the joke.'),
              N('People find out from what was left behind, and from stories and records.'),
            ]),
            o('There is no way to find out.', [
              N('There is. It is slow, careful work, but it can be done.'),
              N('Walls, tools, pots, writing and passed-down stories are all clues.'),
            ]),
          ],
          'Learned that people find out about the past from objects, buildings, writing and stories left behind.',
        ),
      ],
      [
        ch('signal', 'Wave to Mowgli through the broken lattice.', [
          MG('You came! Is Baloo here? Is he cross?', 'happy'),
          Y('Very. He is also running.'),
        ]),
        ch('stay', 'Stay hidden, and watch the terrace for Bagheera.', [
          N(
            'A black shape is already moving along the far wall, very slow, the way a cloud moves across the moon.',
          ),
        ]),
      ],
    ),
    sc(
      'a24-05-cistern-done',
      [
        MG(
          'Stay where the snakes are, they say. The snakes are fine. I said the Words. It is the monkeys that are not fine.',
          'think',
        ),
        N(
          'The cobras sway gently, hoods spread wide like fans. A spread hood is how a cobra says: I am here, keep back.',
        ),
        N('Outside, the moon goes behind a cloud.'),
      ],
      [
        ask(
          1,
          'health',
          'what to do if you meet a wild snake: stay calm, step back, tell a grown-up',
          'CASEL: Responsible decision-making',
          [
            N(
              'Mowgli knows the Snakes’ word. You do not. What should you do if you ever meet a wild snake?',
            ),
          ],
          [
            o(
              'Stay calm, step back slowly, and tell a grown-up.',
              [
                N('Yes. Most snakes want to be left alone. Backing away gives them room to go.'),
                N('Never touch a wild snake, even a small one.'),
              ],
              true,
            ),
            o('Pick it up to look closer.', [
              N('Please do not. Even a small snake can bite if it is frightened.'),
              N('Stand still, step back slowly, and tell a grown-up.'),
            ]),
            o('Run and scream.', [
              N(
                'That is a natural feeling. But sudden noise and fast movement can scare the snake more.',
              ),
              N('Staying calm, backing away slowly and telling a grown-up is safer.'),
            ]),
          ],
          'Practised what to do on meeting a wild snake: stay calm, step back slowly and tell a grown-up.',
        ),
      ],
    ),
    sc(
      'a24-05-fight',
      [
        N('Bagheera comes up the terrace at a run, knocking monkeys left and right like skittles.'),
        N(
          'Then a hundred more pour over him. He disappears under grey fur and noise, which is not the same as being beaten.',
        ),
        BG('Get to the water! To the tank! They will not follow into water!', 'angry'),
        N(
          'Baloo arrives at the bottom of the wall, puffing like a kettle on the boil, and wades into the crowd.',
        ),
        BL('I am coming! I am coming, Bagheera! Ouf! There are too many of them!', 'angry'),
        N(
          'Then a heavy, patient knocking comes from the far wall, one blow, and another, as if the hill itself wants in.',
        ),
        N('A section of old stone falls inward. Through the gap, head first, comes Kaa.'),
        BD('Kaa! It is Kaa! Run! Run!', 'shock'),
        N(
          'Every monkey in the Cold Lairs scatters at once. Half race up the walls, and the other half dive into the trees.',
        ),
      ],
      [
        ask(
          8,
          'maths',
          'sharing equally: 100 split into 2 equal groups',
          '3.OA.A.3',
          [
            N(
              'About a hundred monkeys run. Half go up the walls and half go into the trees. How many go each way?',
            ),
          ],
          [
            o(
              '50 each way.',
              [
                N('Yes. Half of 100 is 50, because 50 + 50 = 100.'),
                N('Sharing into two equal groups is the same as dividing by 2.'),
              ],
              true,
            ),
            o('10 each way.', [
              N('Ten groups of ten make 100. But here there are just two groups.'),
              N('100 ÷ 2 = 50, and 50 + 50 = 100.'),
            ]),
            o('25 each way.', [
              N('25 + 25 = 50, which is only half of the monkeys.'),
              N('Each group needs 50, since 50 + 50 = 100.'),
            ]),
          ],
          'Divided 100 by 2 to share a group equally, and checked it by adding.',
        ),
      ],
      [
        ch('cheer', 'Cheer, quietly, behind your hand.', [
          N(
            'You cheer behind your hand. Your Nubbin cheers behind both of its, which mostly covers its eyes.',
          ),
        ]),
        ch('help', 'Kick open the summer-house door for Mowgli.', [
          N(
            'The door is rotten, and gives at the first kick. Mowgli climbs out, dusty, and checks you over the way Baloo would.',
          ),
        ]),
      ],
    ),
    sc(
      'a24-05-fight-done',
      [
        N(
          'Bagheera climbs out of the water tank, soaked and furious, and shakes himself. Baloo sits down very suddenly.',
        ),
        BL('I am not hurt. I am old. It is different.', 'think'),
        N(
          'He is breathing hard, and his old legs are shaking. He is trying not to let anyone see.',
        ),
      ],
      [
        ask(
          2,
          'sel',
          'saying what you need: telling people you are tired is brave and helpful',
          'CASEL: Self-awareness',
          [N('Baloo is worn out, but he says only that he is old. What would help most?')],
          [
            o(
              'Saying plainly, “I need to rest.”',
              [
                N('Yes. Telling people what you need lets them help.'),
                N(
                  'Baloo’s friends cannot guess that his legs are tired. When he says so, Bagheera can carry the news and Mowgli can fetch water.',
                ),
              ],
              true,
            ),
            o('Pretending he is fine.', [
              N('That is what Baloo is doing, and it is hard on him.'),
              N('Saying “I need a rest” is brave and lets others help.'),
            ]),
            o('Walking away so no one sees.', [
              N('It feels easier at the time. But then nobody knows he needs help.'),
              N('Telling someone you trust is what lets them look after you.'),
            ]),
          ],
          'Talked about saying what we need plainly, and why asking for rest or help is a strength.',
        ),
      ],
    ),
    sc(
      'a24-05-dance',
      [
        KA(
          'Is that the man’s cub? Good. Now stay, all of you. I am going to dance. The Dance of the Hunger of Kaa.',
        ),
        N(
          'Kaa has no legs. Muscles ripple along him in waves, and his belly scales grip the stones as he begins to loop, coil over coil.',
        ),
        N('Round and round he goes, and the moonlight runs along his back like water.'),
        N(
          'Up on the walls the monkeys stop chattering. One by one, they begin to climb down towards him.',
        ),
        N(
          'So do Baloo and Bagheera. They take a step forward, and then another, with their eyes fixed and strange.',
        ),
        MG('Bagheera! Baloo! Do not look! Come away!', 'shock'),
        N(
          'Your Nubbin is leaning forward too, its eyes wide and round. You feel your own feet want to step.',
        ),
        N(
          'Mowgli grabs Bagheera’s neck and Baloo’s ear and pulls, hard. They come out of it, shuddering, like waking.',
        ),
        BG(
          'Hold on to me, little brother. Do not let go. My feet want to go back to him.',
          'shock',
        ),
      ],
      [
        ask(
          1,
          'science',
          'how snakes move without legs: strong muscles and gripping belly scales',
          '4-LS1-1',
          [N('Kaa has no legs at all. How does a snake like him move?')],
          [
            o(
              'With muscles that ripple, and scales that grip.',
              [
                N(
                  'Yes. A snake pushes against the ground with ripples of muscle, and its belly scales catch on the surface.',
                ),
                N('That is how it can climb, swim and slither with no feet.'),
              ],
              true,
            ),
            o('By hopping on its tail.', [
              N('Some tiny animals hop on a tail, but snakes do not.'),
              N('They move by rippling muscles, with belly scales gripping the ground.'),
            ]),
            o('By floating just above the ground.', [
              N('That would be a wonderful trick. But snakes keep touching the ground.'),
              N('They push along with muscles, with their scales gripping the surface.'),
            ]),
          ],
          'Learned that snakes move with rippling muscles and belly scales that grip the ground.',
        ),
      ],
      [
        ch('eyes', 'Put your hand over your Nubbin’s eyes and pick it up.', [
          N(
            'You lift it, with your palm over its eyes. It goes limp and trusting, and you walk out without looking back.',
          ),
        ]),
        ch('turn', 'Turn your Nubbin round to face you, and carry it out.', [
          N(
            'It stares at your face instead of Kaa. You walk out of the Cold Lairs backwards, which is harder than it sounds.',
          ),
        ]),
      ],
    ),
    sc(
      'a24-05-dance-done',
      [
        N(
          'Outside the walls, in the clean moonlight, everyone breathes again. Behind you the city has gone very quiet.',
        ),
        N(
          'Your Nubbin rubs its eyes when you put it down, as if it has had a long and confusing dream.',
        ),
        N(
          'It is shivering a little. You sit down, and take three slow breaths with it: in through the nose, out through the mouth.',
        ),
      ],
      [
        ask(
          2,
          'sel',
          'calming down after a scare with slow breaths and company',
          'CASEL: Self-management',
          [
            N(
              'Your Nubbin is shaky after the fright. What helps most when you feel wobbly after a scare?',
            ),
          ],
          [
            o(
              'Slow breaths, and sitting with someone you trust.',
              [
                N(
                  'Yes. Slow breaths tell your body it is safe, and a friend nearby makes it easier.',
                ),
                N('The wobble fades, like a wave going out.'),
              ],
              true,
            ),
            o('Pretending it never happened.', [
              N(
                'Many people try that. But the wobbly feeling usually comes back if we push it away.',
              ),
              N('Slow breaths and a friendly voice help it pass.'),
            ]),
            o('Running as fast as you can.', [
              N('Running can burn off some of the shakiness, true.'),
              N('But slow breaths with a friend is the quickest way to feel calm again.'),
            ]),
          ],
          'Practised calming down after a scare: slow breathing and sitting with someone you trust.',
        ),
      ],
    ),
    sc(
      'a24-05-complete',
      [
        BG(
          'You went off with the Monkey-People, and we had to come and get you. That costs something, under the Law.',
          'think',
        ),
        MG('I know. I am sorry. I was wrong. Baloo was right.', 'sad'),
        N(
          'Bagheera gives him a few soft cuffs, the panther way of settling a debt. Mowgli picks himself up and says nothing.',
        ),
        BG(
          'Now jump on my back, little brother. We are going home. It is finished, and the Law forgets what is paid.',
          'soft',
        ),
        N(
          'Kaa is still coiled on the moonlit terrace when you look back. He nods to you, slowly, and does not follow.',
        ),
        KA(
          'Come and see me, guest. Sleep in my coils, on a cold night. They keep the warmth very well.',
        ),
      ],
      [
        ask(
          3,
          'social-studies',
          'making amends: is saying sorry enough, and should a mistake cost something?',
          'D2.Civ.8.K-2',
          [
            N(
              'Mowgli said sorry, and Bagheera also gave him a small cuff to settle the debt. Is saying sorry enough on its own? There is no one right answer.',
            ),
          ],
          [
            o('Yes. Saying sorry and meaning it is enough.', [
              N('That is a fair answer. A true sorry is the most important part.'),
              N(
                'Even so, many people also want to make things right with an action, like mending or helping.',
              ),
            ]),
            o('No. You should also fix or pay for the harm.', [
              N(
                'That is a fair answer. A sorry is stronger when it comes with putting things right.',
              ),
              N('The size of the fix should match the harm, which is what makes it fair.'),
            ]),
            o('It depends on how big the mistake was.', [
              N(
                'That is a thoughtful answer. A small slip may need only a sorry, and a bigger one more.',
              ),
              N('In the Grove, the point is to make things whole, not to make anyone feel small.'),
            ]),
          ],
          'Thought about whether saying sorry is enough, and how making things right can be fair to everyone.',
        ),
      ],
    ),
  ],
  [
    gl(
      'ruins',
      'What is left of buildings that have fallen down or been left empty for a very long time.',
      'a24-05-cistern',
    ),
    gl(
      'hood',
      'The loose skin around a cobra’s neck, which it spreads wide like a fan when it feels threatened.',
      'a24-05-cistern',
    ),
  ],
);

// ================================================================== A24-6 The Red Flower
const A6: EduQuest = quest(
  'a24-06',
  'The Red Flower',
  {
    'a24-06-s1': {
      goal: 'Find Bagheera and Mowgli under the trees at night.',
      hint: 'Bagheera lies along a branch over the path, where the shade is deepest.',
    },
    'a24-06-s2': {
      goal: 'Go down to the village at dawn with Mowgli for the Red Flower.',
      hint: 'Wait in the ditch by the first hut. Mowgli goes in alone.',
    },
    'a24-06-s3': {
      goal: 'Help Mowgli keep the fire alive all day.',
      hint: 'Bring dry twigs, not green ones. Feed it a little at a time.',
    },
  },
  [
    sc(
      'a24-06-branch',
      [
        N(
          'Years go by on the page. Mowgli is ten or eleven now, long-legged, and he has never once lived in a house.',
        ),
        N(
          'Akela grows old. Shere Khan, who never gave up, has made friends with the young wolves, and feeds them scraps.',
        ),
        N(
          'Bagheera lies along a branch over the path. He is black as ink, though in a patch of moonlight faint spots show in his coat.',
        ),
        BG(
          'Little brother. Shere Khan has not forgotten you. I have said it before, and I am saying it again.',
          'think',
        ),
        MG('You say it every night. I am sleepy, Bagheera. Say it tomorrow.'),
        BG(
          'The young wolves listen to him now. They say a man’s cub has no place with the pack. Akela is old.',
        ),
        BG(
          'One day he will miss his kill. Then there will be no Lone Wolf, and no one to speak for you.',
        ),
        BG(
          'I was born among men, in cages. I broke the lock and came away. Men are clever. So are you, little brother.',
        ),
      ],
      [
        ask(
          2,
          'science',
          'a “black panther” is a leopard with a very dark coat; variation in a species',
          '3-LS3-1',
          [
            N(
              'Bagheera is called a black panther, but you can see spots in the moonlight. What is a black panther, really?',
            ),
          ],
          [
            o(
              'A leopard with a very dark coat.',
              [
                N(
                  'Yes. Some leopards are born with extra dark colouring, so their spots hide in the black.',
                ),
                N(
                  'Animals of the same kind can look different from one another. We call that variation.',
                ),
              ],
              true,
            ),
            o('A different animal, a cousin of the bear.', [
              N('Bears are not close cousins of cats at all.'),
              N('A black panther is a leopard with a dark coat, which is an example of variation.'),
            ]),
            o('A tiger painted black.', [
              N('Tigers have stripes, and leopards have spots. Nobody has to paint anyone.'),
              N('Some leopards are just born very dark.'),
            ]),
          ],
          'Learned that a black panther is a leopard born with a very dark coat, an example of variation within a species.',
        ),
      ],
      [
        ch('ask', 'Ask Bagheera what Mowgli should do.', [
          BG(
            'Men keep a thing in their huts that every beast is afraid of. The Red Flower. Fire. Fetch some.',
          ),
        ]),
        ch('mowgli', 'Look at Mowgli. He has gone very quiet.', [
          MG('They are my brothers. I grew up in their cave. Why would they want me gone?', 'sad'),
          BG('Then be ready for them, little brother. Fetch the Red Flower.'),
        ]),
      ],
    ),
    sc(
      'a24-06-branch-done',
      [
        MG('The Red Flower. I know where. They keep it by the doors at night. I will go now.'),
        BG('Take the guest. Guests are good at carrying things. And they do not smell of wolf.'),
        N(
          'For a very long time, fire was the most powerful tool people had. Bagheera knows its worth as well as anyone.',
        ),
      ],
      [
        ask(
          2,
          'social-studies',
          'how fire changed people’s lives long ago',
          'D2.His.2.K-2',
          [
            N(
              'People have used fire for a very long time. Why was it so important to families long ago?',
            ),
          ],
          [
            o(
              'It gave warmth, light and cooked food, and kept wild animals back.',
              [
                N(
                  'Yes. Fire let people stay warm in cold places and cook food so it was safer and tastier.',
                ),
                N('It gave light after dark, and a place to gather and share stories.'),
              ],
              true,
            ),
            o('It was only good for making smoke signals.', [
              N('Smoke signals are one use. But fire did much more.'),
              N('Warmth, light, cooking and safety were the big ones.'),
            ]),
            o('It was not important. People did fine without it.', [
              N('Many people in cold places could not have lived without it.'),
              N('Fire gave warmth, light and cooked food, and kept wild animals away.'),
            ]),
          ],
          'Learned how fire gave people warmth, light, cooked food and protection long ago.',
        ),
      ],
    ),
    sc(
      'a24-06-pot',
      [
        N(
          'You lie in a ditch at the edge of the village, in the cold before dawn. Your Nubbin lies in the ditch too, very damp.',
        ),
        N(
          'A farmer’s wife comes out of the nearest hut with a clay pot of glowing coals, to light the fire in the field.',
        ),
        N(
          'She sets it down by the door and goes back for her shawl. Mowgli is out of the ditch before she reaches the step.',
        ),
        N('He comes back with the pot held in both hands, breathing on it the way he saw her do.'),
        MG('She looks like me. They all look like me. I thought they would be different.', 'think'),
        VI('My fire-pot! Where has it gone? Who took my fire?', 'shock'),
        N(
          'The woman stares at the empty place on her step. She does not look like a monster; she looks like someone with a cold breakfast.',
        ),
      ],
      [
        ask(
          6,
          'sel',
          'taking something you badly need: what do you owe the person you took it from?',
          'CASEL: Responsible decision-making',
          [
            N(
              'Mowgli took the fire-pot without asking, because he needed it so much. The woman now has a cold breakfast. What do you think? There is no one right answer.',
            ),
          ],
          [
            o('It was wrong to take it without asking.', [
              N(
                'That is a fair answer. She did not choose to share it, and she is cold and cross now.',
              ),
              N('Mowgli could have asked, even though he did not speak her language.'),
            ]),
            o('He needed it, so it was fair enough.', [
              N('That is an honest answer. He had a very serious reason.'),
              N(
                'But the woman needed it too. Her neighbour shared fire with her, but nobody asked her before taking hers.',
              ),
            ]),
            o('It was wrong, but he should make it up to her.', [
              N('That is a thoughtful answer. Mistakes can be mended.'),
              N(
                'That is why you leave something on the step: a way of saying thank you, and sorry.',
              ),
            ]),
          ],
          'Thought about taking something you badly need without asking, and what we owe the person it belonged to.',
        ),
      ],
      [
        ch('coin', 'Leave something on the step for her before you go.', [
          N(
            'You leave a smooth river stone with a hole in it, the best thing in your pocket. It is not enough, but it is something.',
          ),
        ]),
        ch('go', 'Run after Mowgli with the pot.', [
          N(
            'You run. Behind you a neighbour’s door opens, and she gets her fire from there, because it is a village and they share.',
          ),
        ]),
      ],
    ),
    sc(
      'a24-06-pot-done',
      [
        N(
          'Back in the jungle, Mowgli sets the pot down on a flat stone and looks at it for a long time.',
        ),
        MG(
          'If I do not feed it, it will die. The woman fed it with sticks and dry stuff. I saw her.',
        ),
        N('Under the grey ash a few coals pulse red, like a slow heartbeat.'),
      ],
      [
        ask(
          2,
          'science',
          'a fire needs fuel, heat and air',
          '4-PS3-2',
          [
            MG(
              'What does a fire need to stay alive? Think about it: the woman gave it sticks, and she blew on it.',
            ),
          ],
          [
            o(
              'Fuel, heat and air.',
              [
                N(
                  'Yes. Sticks are the fuel, the hot coals are the heat, and blowing brings fresh air.',
                ),
                N('Take away any one of the three and the fire goes out.'),
              ],
              true,
            ),
            o('Only water.', [
              N('Water puts fire out. It does the opposite of feeding it.'),
              N('A fire needs fuel, heat and air.'),
            ]),
            o('Only sticks.', [
              N('Sticks are the fuel, and a fire cannot live without them.'),
              N('But it also needs heat to keep it going, and air to burn.'),
            ]),
          ],
          'Learned that a fire needs fuel, heat and air to keep burning.',
        ),
      ],
    ),
    sc(
      'a24-06-feed',
      [
        N(
          'All day you and Mowgli feed the Red Flower with dry twigs and bark, and keep it in the shade, out of the wind.',
        ),
        MG(
          'Dry sticks are its fuel. Every quarter of an hour, three of them. Not more, or it chokes. Not fewer, or it sulks.',
        ),
        N(
          'Your Nubbin brings twigs too, mostly dry ones. One is a beetle, which it thinks better of and puts back.',
        ),
        MG(
          'It eats like a wolf cub. Always hungry. And if you stop, it goes grey and sulks, like Baloo.',
          'happy',
        ),
        N(
          'Once the coals go dull and you both blow on them, cheeks puffed, until they glow red again.',
        ),
        N(
          'A wolf comes past in the afternoon. He sees the pot and goes the long way round, with his fur on end.',
        ),
        MG(
          'He is afraid of it. They all are. I am not. Is that what it means, being a man?',
          'think',
        ),
      ],
      [
        ask(
          1,
          'maths',
          'multiplying to find a total: 3 sticks, 4 times in an hour',
          '3.OA.A.3',
          [
            N(
              'Mowgli feeds the fire three sticks every quarter of an hour. There are four quarters in an hour. How many sticks does it eat in one hour?',
            ),
          ],
          [
            o(
              '12 sticks.',
              [
                N('Yes. Four feedings of three sticks: 3 × 4 = 12.'),
                N('3, 6, 9, 12, counting once for each quarter of the hour.'),
              ],
              true,
            ),
            o('7 sticks.', [
              N('That is 3 + 4, which mixes up the two numbers.'),
              N('Each of the four feedings is 3 sticks, so we multiply: 3 × 4 = 12.'),
            ]),
            o('9 sticks.', [
              N('Nine is three feedings of three sticks.'),
              N('There are four quarters in an hour, so four feedings: 3, 6, 9, 12.'),
            ]),
          ],
          'Multiplied 3 × 4 to find the number of sticks used in an hour.',
        ),
      ],
      [
        ch('answer', 'Tell him you do not know. You are still working it out too.', [
          MG('Good. I do not like people who know everything. Except Baloo. He has to.', 'happy'),
        ]),
        ch('blow', 'Show him how to blow gently, not hard.', [
          N('He copies you, and the coals glow like a cat’s eyes in the dark. He laughs out loud.'),
        ]),
      ],
    ),
    sc(
      'a24-06-feed-done',
      [
        N(
          'By evening the fire-pot is glowing steadily, and Mowgli has a dead branch beside it, ready.',
        ),
        N('Tabaqui slinks into the clearing, grinning, with his tail low.'),
        TB(
          'The young wolves want Mowgli at the Council Rock tonight. All of them. Such a lot of them. Such big teeth.',
          'happy',
        ),
      ],
      [
        ask(
          1,
          'literacy',
          'word choice shows character: slinks, grinning',
          'RL.1.4',
          [
            N(
              'The story says Tabaqui “slinks” into the clearing, grinning. What does the word slinks tell us about him?',
            ),
          ],
          [
            o(
              'He moves sneakily, as if he is up to no good.',
              [
                N('Yes. Slinking is creeping low and quietly, so as not to be seen.'),
                N(
                  'Authors pick words like slinks to show what a character is like, without saying it outright.',
                ),
              ],
              true,
            ),
            o('He is proud and marches boldly.', [
              N('Marching would be a proud word. Slinking is the opposite: low and sneaky.'),
              N('The author wants us to feel he is not to be trusted.'),
            ]),
            o('He is very tired.', [
              N('A tired animal would trudge or shuffle.'),
              N('Slinking is creeping quietly, a clue he is up to something.'),
            ]),
          ],
          'Saw how a single word choice, “slinks”, shows what kind of character Tabaqui is.',
        ),
      ],
    ),
    sc(
      'a24-06-complete',
      [
        BG(
          'Akela missed his kill tonight. They say the young wolves tricked the buck into knocking him down.',
          'sad',
        ),
        MG('Then I will go to the Council. With this.'),
        N(
          'He lifts the fire-pot in both hands. It lights his face from below, and for a moment he looks older than he is.',
        ),
        BG(
          'Stay near, guest. Stay near him. He does not know yet how heavy that pot is going to be.',
          'soft',
        ),
        N(
          'Fire is a wonderful tool and a serious one. Wherever you live, matches and lighters are for grown-ups to use.',
        ),
      ],
      [
        ask(
          3,
          'health',
          'fire safety: leave matches and lighters alone and tell a grown-up',
          'CASEL: Responsible decision-making',
          [
            N(
              'Fire is very powerful. If you ever found matches or a lighter lying around at home, what should you do?',
            ),
          ],
          [
            o(
              'Leave them alone and tell a grown-up.',
              [
                N('Yes. Fire is not a toy, and grown-ups know how to handle it safely.'),
                N('Telling an adult straight away is always the right choice.'),
              ],
              true,
            ),
            o('Try one, just once, to see how it works.', [
              N('It is natural to be curious. But fire can spread in a second.'),
              N('Leave them where they are, and tell a grown-up.'),
            ]),
            o('Hide them so nobody finds them.', [
              N('Hiding them leaves a danger nobody knows about.'),
              N('Tell a grown-up, and let them put the matches somewhere safe.'),
            ]),
          ],
          'Practised fire safety: leaving matches and lighters alone and telling a grown-up.',
        ),
      ],
    ),
  ],
  [
    gl(
      'fuel',
      'Anything that burns to give heat and light, such as wood, coal or oil.',
      'a24-06-feed',
    ),
    gl(
      'slinks',
      'Moves along quietly and low to the ground, as if trying not to be seen.',
      'a24-06-feed-done',
    ),
  ],
);

// ================================================================== A24-7 The Council of Fire
const A7: EduQuest = quest(
  'a24-07',
  'The Council of Fire',
  {
    'a24-07-s1': {
      goal: 'Go up to the Council Rock with Mowgli and the fire-pot.',
      hint: 'Keep the pot steady. Stand at the edge, as before.',
    },
    'a24-07-s2': {
      goal: 'Stay with Mowgli on the rock after the Council breaks.',
      hint: 'Sit with him. You do not need to say anything.',
    },
  },
  [
    sc(
      'a24-07-council',
      [
        N('Akela lies beside his rock tonight, not on top of it. Everyone knows what that means.'),
        N(
          'Shere Khan walks up and down in front of the young wolves, being flattered. He is not even supposed to be here.',
        ),
        SK('The man’s cub is mine. Give him to me, and I will trouble you no more.', 'angry'),
        YW('A man’s cub. What has a man’s cub to do with us? Let him go back to his own kind!'),
        AK(
          'He has eaten our food. He has slept with us. He has driven game for us, and broken no word of the Law.',
          'think',
        ),
        AK(
          'I missed my kill. I know what follows. But take my life, not his. I will not fight you for it. That is my offer.',
        ),
        N(
          'Mowgli stands up with the fire-pot in his hands. He stretches out his arms and yawns, very rude, very slow.',
        ),
        MG(
          'Stop it! You keep telling me I am a man. All right. Men carry this, so I brought some.',
        ),
        N(
          'He tips the pot onto the ground. The coals catch a tuft of dry moss, and it flares up bright.',
        ),
        N(
          'Every wolf on the hill scrambles back from the light, ears flat. They feel the heat on their fur before it can touch them.',
        ),
      ],
      [
        ask(
          9,
          'science',
          'animals’ senses warn them of danger: heat, smell and sight',
          '4-LS1-2',
          [
            N(
              'The wolves scramble back before the flames touch them. How can an animal tell that fire is dangerous from a distance?',
            ),
          ],
          [
            o(
              'It feels the heat, smells the smoke and sees the flicker.',
              [
                N(
                  'Yes. Senses are an animal’s early warning system, and fire sets off several at once.',
                ),
                N('Wild animals learn to treat fire with great respect.'),
              ],
              true,
            ),
            o('It reads the danger sign.', [
              N('Ha. No signs in the jungle, though that would be handy.'),
              N('Animals use senses: they feel the heat, smell the smoke and see the light.'),
            ]),
            o('It cannot tell. It only learns by touching it.', [
              N('Touching would hurt very badly, and animals avoid that.'),
              N(
                'They can feel the heat from far off, smell smoke and see the flames, which is how they know.',
              ),
            ]),
          ],
          'Learned that animals use their senses, such as feeling heat and smelling smoke, to sense danger before touching it.',
        ),
      ],
      [
        ch('back', 'Step back with your Nubbin, out of the light.', [
          N('You step back. Your Nubbin hides its face in your knees, and peeks.'),
        ]),
        ch('stand', 'Stand where you are, behind Mowgli.', [
          N(
            'You stand where you are. Across the firelight Mother Wolf sees you there, at his back, and her eyes thank you.',
          ),
        ]),
      ],
    ),
    sc(
      'a24-07-council-done',
      [
        N(
          'Mowgli thrusts the dead branch into the fire, and swings it round his head among the cowering wolves.',
        ),
        N('Sparks fly, the flames flutter and roar, and the tiger’s whiskers crackle in the heat.'),
        N('He goes straight at Shere Khan with the flame. The tiger turns and runs for the dark.'),
      ],
      [
        ask(
          1,
          'literacy',
          'words that show a sense: crackle is a sound word',
          'RL.1.4',
          [
            N(
              'The tiger’s whiskers “crackle” in the heat. Which sense does that word make you imagine?',
            ),
          ],
          [
            o(
              'Hearing: you can almost hear the snap.',
              [
                N('Yes. Crackle is a sound word, and it also makes you feel the heat.'),
                N(
                  'Authors use words like crackle, flutter and roar to help us hear a scene in our heads.',
                ),
              ],
              true,
            ),
            o('Taste.', [
              N('Not this time, though burnt sugar might crackle too.'),
              N('Crackle is a sound word: it helps us hear the scene.'),
            ]),
            o('Smell.', [
              N('Singed whiskers do smell, true. But the word crackle is about a sound.'),
              N('It helps us hear the scene.'),
            ]),
          ],
          'Identified “crackle” as a sound word that helps readers hear a scene.',
        ),
      ],
    ),
    sc(
      'a24-07-tears',
      [
        MG(
          'Go! All of you! Akela goes free, to live as he pleases. You will not hurt him, because I do not want you to.',
          'angry',
        ),
        MG(
          'And I am going to my own people. If they are my own people. The jungle is shut to me.',
          'sad',
        ),
        N(
          'Shere Khan and the young wolves have fled. Only Akela and Bagheera and the four cubs stay, and you.',
        ),
        N(
          'Then something hurts inside him, somewhere no thorn or tooth has ever reached. He catches his breath.',
        ),
        N('Water runs out of his eyes and down his face, and he cannot stop it.'),
        MG('What is this? Why will it not stop? Is something wrong with me, Bagheera?', 'shock'),
        BG(
          'No, little brother. Wolves cannot do that. Men can. You are a man now; that is all it means.',
          'soft',
        ),
        BG('It is all right to let them fall, Mowgli. Crying is how sadness comes out.', 'soft'),
        N('So he cries, hard, with his whole body, the way you only can the first time.'),
      ],
      [
        ask(
          8,
          'sel',
          'crying: is it weakness, or just a way feelings come out?',
          'CASEL: Self-awareness',
          [
            N(
              'Mowgli has never cried before and thought something was wrong. Do you think crying is weak, or something else? There is no one right answer.',
            ),
          ],
          [
            o('Crying is not weak. It is how big feelings come out.', [
              N('That is a fair answer, and a lot of doctors and teachers agree.'),
              N('Holding a big feeling in can feel heavier than letting it out.'),
            ]),
            o('It is better to keep it in and stay strong.', [
              N('That is a fair thing to think, and many people were taught it.'),
              N('But Bagheera, who is very strong, says to let them fall. Strong people cry too.'),
            ]),
            o('It depends where you are and who is with you.', [
              N('That is a thoughtful answer. It is easier to cry with someone safe nearby.'),
              N('That is why you sit beside Mowgli and do not say anything.'),
            ]),
          ],
          'Talked about crying, and whether it is weak or a normal way for feelings to come out.',
        ),
      ],
      [
        ch('sit', 'Sit down beside him on the rock, and wait.', [
          N(
            'You sit beside him. Your Nubbin climbs into his lap, uninvited, and stays there until he has finished.',
          ),
        ]),
        ch('arm', 'Put your arm round his shoulders.', [
          N(
            'He leans into you the way a cub leans into its mother’s side. It goes on a long time, and you do not mind.',
          ),
        ]),
      ],
    ),
    sc(
      'a24-07-tears-done',
      [
        MG(
          'My face is all wet. And salty. And I feel… tired. Hollow, like I ran all night.',
          'sad',
        ),
        BG(
          'That is what it does. Tears are salty water, and crying is hard work for a body. Drink something, and rest.',
        ),
        MG('Now I will go to men. But first I must say goodbye to my mother.', 'sad'),
        N(
          'He goes down to the cave and puts his face in Mother Wolf’s fur. The cubs, who are grown now, howl.',
        ),
      ],
      [
        ask(
          1,
          'health',
          'looking after your body after a big cry: water, rest and a hug',
          'CASEL: Self-management',
          [
            N(
              'After a long cry, Mowgli feels tired and thirsty. What could help his body feel better?',
            ),
          ],
          [
            o(
              'A drink of water, a rest, and a hug.',
              [
                N('Yes. Crying uses up energy and water, so it helps to drink and rest.'),
                N('A friendly hug helps your heart as well as your body.'),
              ],
              true,
            ),
            o('Running a long way to forget it.', [
              N('Some people like to move about after a cry, and that is fine.'),
              N('But the body needs water and rest first, and a hug helps.'),
            ]),
            o('Pretending nothing has happened.', [
              N('It is hard to hide a big feeling, and it does not make it smaller.'),
              N('A drink, a rest and a hug will help far more.'),
            ]),
          ],
          'Learned that after crying the body can feel tired and thirsty, and that water, rest and a hug help.',
        ),
      ],
    ),
    sc(
      'a24-07-complete',
      [
        MW(
          'Come back to us, my bare little frog. Come often. Your brothers will watch the road for you.',
          'sad',
        ),
        MG(
          'I will come back. And I will bring the tiger’s coat with me, to show the pack I meant it. Do not forget me.',
          'soft',
        ),
        N(
          'The Council ended at midnight. Dawn comes at six o’clock, and Mowgli goes down the hill alone towards the smoke of the villages.',
        ),
        N(
          'The fire-pot is cold on the Council Rock. Bagheera pushes it towards you with his nose.',
        ),
        BG('Keep it, guest. You fed it. That makes it partly yours, under any law I know.'),
      ],
      [
        ask(
          2,
          'maths',
          'time intervals in hours: midnight to six o’clock is 6 hours',
          '1.MD.B.3',
          [
            N(
              'The Council ended at midnight, and dawn comes at six o’clock. How many hours is that?',
            ),
          ],
          [
            o(
              '6 hours.',
              [
                N('Yes. Count the hours on a clock: 1, 2, 3, 4, 5, 6.'),
                N('From 12 o’clock midnight to 6 o’clock in the morning is six hours.'),
              ],
              true,
            ),
            o('12 hours.', [
              N('Twelve is how many hours there are on the clock face, and half a day.'),
              N('Count on from midnight to six: 1, 2, 3, 4, 5, 6.'),
            ]),
            o('1 hour.', [
              N('One hour from midnight is only one o’clock.'),
              N('Dawn is at six, so count 1, 2, 3, 4, 5, 6: six hours.'),
            ]),
          ],
          'Worked out a time interval of 6 hours between midnight and six o’clock.',
        ),
      ],
    ),
  ],
  [
    gl(
      'cowering',
      'Crouching low and shrinking back because you are afraid.',
      'a24-07-council-done',
    ),
    gl('flattered', 'Praised too much, by someone who wants something from you.', 'a24-07-council'),
  ],
);

// ================================================================== A24-8 Messua
const A8: EduQuest = quest(
  'a24-08',
  'Messua',
  {
    'a24-08-s1': {
      goal: 'Walk into the village with Mowgli.',
      hint: 'Walk slowly, and keep your Nubbin in your arms. The village dogs are nervous.',
    },
    'a24-08-s2': {
      goal: 'Go out with Mowgli to herd the village buffalo.',
      hint: 'Sit on a buffalo’s back and let it graze. Mowgli knows which ones bite.',
    },
    'a24-08-s3': {
      goal: 'Go with Mowgli to the village tree in the evening.',
      hint: 'Sit at the back. The men tell tales under the great fig tree after dark.',
    },
  },
  [
    sc(
      'a24-08-gate',
      [
        N(
          'Mowgli walks down from the hills to the plain, far from Seoni. He has never seen so many people in one place.',
        ),
        N(
          'Round the village lie flat fields, and beyond them a river shines. A well stands by the gate, with women queuing at it.',
        ),
        N(
          'The village dogs bark, and the children run indoors. A crowd gathers at the gate to stare at a boy with twigs in his hair.',
        ),
        VI(
          'A wolf-child! Look at his arms, the old bites. He has run with wolves since he was small.',
          'shock',
        ),
        VI('Poor thing. Poor lost thing. Someone ought to take him in.'),
        N(
          'A woman comes forward with heavy copper rings on her arms. She looks at Mowgli’s face for a long time.',
        ),
        ME(
          'My Nathoo. The tiger took my Nathoo, years ago. He had eyes like that. He would be this age now.',
          'soft',
        ),
        ME(
          'Come home, son. Whoever you are, come home. And bring your friend. You both look hungry.',
        ),
      ],
      [
        ask(
          2,
          'social-studies',
          'places and land use: villages are near water and farmland',
          'D2.Geo.2.K-2',
          [N('Look at where this village stands. What do people need close to where they live?')],
          [
            o(
              'Water and farmland for food.',
              [
                N('Yes. Many villages grow up beside a river or a well, with fields close by.'),
                N('People settle where their basic needs can be met.'),
              ],
              true,
            ),
            o('Only a good view.', [
              N('A nice view is a bonus. But people cannot drink a view.'),
              N(
                'Water and fields come first, which is why this village has a river, a well and fields.',
              ),
            ]),
            o('Nothing. People can live anywhere with no water.', [
              N('People need water every single day, and so do their crops and animals.'),
              N('So villages grow up near rivers, wells and good farmland.'),
            ]),
          ],
          'Looked at where a village is and why people settle near water and farmland.',
        ),
      ],
      [
        ch('thank', 'Thank her, and bow.', [
          ME('Bowing! Such manners. Where did you two learn manners in a forest?', 'happy'),
          Y('From a bear.'),
        ]),
        ch('mowgli', 'Let Mowgli go in first.', [
          N(
            'He goes in first, slowly, like a wild thing into a trap. Messua holds the door and does not hurry him.',
          ),
        ]),
      ],
    ),
    sc(
      'a24-08-gate-done',
      [
        N(
          'Messua gives him milk and bread, and looks into his eyes, and he looks back at her. It is almost enough.',
        ),
        ME(
          'My Nathoo had a little red cap. He would not take it off, even to sleep. Do you remember?',
          'sad',
        ),
        N('Mowgli does not remember. He looks at the floor, and his hands are very still.'),
      ],
      [
        ask(
          1,
          'sel',
          'being with someone who is sad about losing someone: listen and be gentle',
          'CASEL: Social awareness',
          [
            N(
              'Messua lost her son a long time ago, and she still misses him. What is a kind way to be with someone who is missing a person they love?',
            ),
          ],
          [
            o(
              'Sit with her, listen, and be gentle.',
              [
                N('Yes. You do not have to fix a sadness. Being there is the gift.'),
                N(
                  'Missing someone is a sign of how much you loved them, and it can stay with a person for a long time.',
                ),
              ],
              true,
            ),
            o('Tell her to cheer up.', [
              N(
                'That usually does not help. Feelings do not switch off when someone tells them to.',
              ),
              N('Listening kindly works better.'),
            ]),
            o('Change the subject quickly.', [
              N('It can feel awkward to stay with a sad feeling, so many of us do this.'),
              N('But if the person wants to talk, listening is kinder.'),
            ]),
          ],
          'Thought about how to be kind to someone who is sad about losing a loved one: listening, being gentle, and staying.',
        ),
      ],
    ),
    sc(
      'a24-08-herd',
      [
        N(
          'Mowgli learns to speak, and to wear a cloth. He sleeps badly under a roof, and sometimes he sleeps in the field.',
        ),
        N(
          'Then they give him the buffalo to herd, because nobody else can make them mind. He rides them like boats.',
        ),
        N(
          'When the sun is high the buffalo wade into the river and wallow in the mud, with only their noses showing.',
        ),
        MG('Men. They make noise all day. They gossip like monkeys. But Messua is good.', 'think'),
        N(
          'At the edge of the grazing ground a grey shape is waiting by the river. Grey Brother, Mother Wolf’s eldest.',
        ),
        GB(
          'Little brother. Shere Khan has gone away to the far side of the hills, to heal his coat.',
          'happy',
        ),
        GB('When his coat grows back, he says, he will come for you. I came to warn you.'),
        MG(
          'I am not afraid of him. Watch for him for me, brother. Sit on the rock by the river, if he comes.',
        ),
      ],
      [
        ask(
          2,
          'science',
          'water buffalo wallow in mud to cool down and protect their skin',
          '3-LS4-3',
          [N('The buffalo lie in the mud all afternoon. Why do water buffalo love mud so much?')],
          [
            o(
              'It cools them down and protects their skin.',
              [
                N('Yes. Buffalo cannot sweat much, so wet mud keeps them cool.'),
                N('A coat of mud also keeps biting flies off and shades the skin from the sun.'),
              ],
              true,
            ),
            o('To hide from the other animals.', [
              N('A big buffalo in a mud bath is not very hidden.'),
              N('The mud keeps them cool and protects their skin.'),
            ]),
            o('To practise being a boat.', [
              N('Mowgli does treat them like boats.'),
              N('But they wallow to keep cool and protect their skin.'),
            ]),
          ],
          'Learned that water buffalo cool down and protect their skin from sun and insects by wallowing in mud.',
        ),
      ],
      [
        ch('pet', 'Scratch Grey Brother behind the ears.', [
          GB(
            'You are still here, guest. And the little one. Good. Does it still howl like a kettle?',
            'happy',
          ),
          N('It does. It demonstrates.'),
        ]),
        ch('nubbin', 'Let your Nubbin go and say hello.', [
          N(
            'Your Nubbin trots to Grey Brother and tumbles against his legs like the cub it thinks it is.',
          ),
        ]),
      ],
    ),
    sc(
      'a24-08-herd-done',
      [
        N('Days pass, in the heat, with the buffalo up to their noses in the mud.'),
        N('There are twelve buffalo in the herd, and Mowgli counts them each evening, to be sure.'),
        N(
          'Your Nubbin learns to ride a buffalo too. It falls off twice, into the mud, and gets back on, very dignified.',
        ),
      ],
      [
        ask(
          1,
          'maths',
          'multiplication: 12 buffalo with 4 legs each is 48 legs',
          '3.OA.A.3',
          [
            N(
              'Twelve buffalo are standing in the mud, and each one has four legs. How many buffalo legs are in the mud?',
            ),
          ],
          [
            o(
              '48.',
              [
                N('Yes: 12 × 4 = 48. You can do 10 × 4 = 40 and 2 × 4 = 8, then 40 + 8 = 48.'),
                N('Breaking a big sum into easy parts is a handy trick.'),
              ],
              true,
            ),
            o('16.', [
              N('That is 12 + 4. But there are four legs for every buffalo, not four more.'),
              N('Twelve buffalo times four legs is 48.'),
            ]),
            o('24.', [
              N('Twenty-four is 12 × 2, which would be for animals with two legs.'),
              N('Buffalo have four legs, so it is 12 × 4 = 48.'),
            ]),
          ],
          'Multiplied 12 × 4 = 48 by splitting it into easier parts (40 and 8).',
        ),
      ],
    ),
    sc(
      'a24-08-tree',
      [
        N('In the evenings the men sit on a stone platform under a great fig tree, and talk.'),
        N(
          'Buldeo the hunter tells the best stories. He has an old musket and a voice that goes down when he wants you to lean in.',
        ),
        BU(
          'The tiger that took Messua’s boy is no tiger at all. He is a ghost. The ghost of a mean old man from over the river.',
          'think',
        ),
        BU(
          'I know it, because the old man limped, and this tiger limps. You see? It stands to reason.',
        ),
        VI('Do not talk about ghosts after dark, Buldeo. The children are listening.', 'shock'),
        N('Mowgli laughs out loud. Everyone turns to look.'),
        MG(
          'He limps because he was born lame. Everyone knows that. And he is no ghost; he is just old and bad-tempered.',
          'happy',
        ),
        N(
          'Buldeo’s face goes hot. But under it, for a moment, you see that he is afraid, of the tiger and of the dark.',
        ),
      ],
      [
        ask(
          3,
          'literacy',
          'checking a reason: does “both limp” prove the tiger is a ghost?',
          'RL.3.6',
          [
            N(
              'Buldeo says the old man limped and the tiger limps, so the tiger must be the old man’s ghost. Is that a good reason? There is no one right answer.',
            ),
          ],
          [
            o('No. Two things can share one feature without being the same.', [
              N('That is a fair answer. Lots of animals limp, and many people do too.'),
              N(
                'A good reason fits all the facts, and this one skips the plainest one: the tiger was born lame.',
              ),
            ]),
            o('Yes. It fits the story he is telling.', [
              N('That is a fair answer. A reason can fit a story and still not prove it.'),
              N('Ask: what else could explain it? Here, a tiger born lame.'),
            ]),
            o('It is a good story, even if it is a poor reason.', [
              N('That is a clever answer. Stories can be fun without being proof.'),
              N(
                'The trick is knowing which is which, so that fear does not make up an explanation.',
              ),
            ]),
          ],
          'Tested a character’s reasoning, noticing that sharing one feature does not prove two things are the same.',
        ),
      ],
      [
        ch('buldeo', 'Ask Buldeo to tell you more about the forest.', [
          BU('Hmph. At least someone here knows how to listen.', 'happy'),
          N(
            'He tells you about a peacock as big as a cart. You nod, politely, all the way through.',
          ),
        ]),
        ch('mowgli', 'Nudge Mowgli. He has made Buldeo look foolish in front of everyone.', [
          MG('He is foolish. Oh. You mean I should not say so. Wolves just say so.', 'think'),
          N('He thinks about that for a whole minute, which is a long time for him.'),
        ]),
      ],
    ),
    sc(
      'a24-08-tree-done',
      [
        N(
          'Buldeo goes home early. Next morning the headman tells Mowgli to graze the buffalo far out on the plain.',
        ),
        N(
          'In many Indian villages, a village council called a panchayat helps settle problems like this one.',
        ),
        ME('Come home, son. Come home, and sleep. Leave old men to their stories.', 'soft'),
      ],
      [
        ask(
          1,
          'social-studies',
          'villages choose people or councils to settle disputes fairly',
          'D2.Civ.8.K-2',
          [N('When two people in a village disagree, who might help to settle it fairly?')],
          [
            o(
              'A headman, or a village council.',
              [
                N('Yes. A leader or a small council hears everyone and decides what is fair.'),
                N(
                  'A panchayat is the traditional council in many Indian villages. Today panchayats are elected by the villagers.',
                ),
              ],
              true,
            ),
            o('The strongest person.', [
              N('Being strong does not make someone fair.'),
              N('Villages usually ask a trusted leader or a council who listen to everyone.'),
            ]),
            o('Whoever shouts loudest.', [
              N('That would be a very noisy kind of fairness.'),
              N('A fair way is to ask a leader or council to listen to everyone first.'),
            ]),
          ],
          'Learned that villages often have a headman or council to listen to everyone and settle disagreements fairly.',
        ),
      ],
    ),
    sc(
      'a24-08-complete',
      [
        N(
          'Messua makes you a bed by the hearth. She makes your Nubbin one too, in a basket with a folded blanket.',
        ),
        ME(
          'Two strays and a boy. I always wanted a full house. It is just I thought there would be fewer feathers.',
          'happy',
        ),
        N(
          'Your Nubbin is moulting a little, from all the excitement. She sweeps up after it without a word.',
        ),
        N(
          'That night you hear Mowgli get up and go out to sleep in the field, under the sky. Messua hears it too, and does not stop him.',
        ),
      ],
      [
        ask(
          3,
          'sel',
          'respecting that people need different things to feel at home',
          'CASEL: Social awareness',
          [
            N(
              'Messua made Mowgli a bed, but he goes out to sleep under the sky. She does not stop him. Why is that kind?',
            ),
          ],
          [
            o(
              'She respects what he needs, even if it is different.',
              [
                N('Yes. Being kind sometimes means letting people be themselves.'),
                N('Mowgli grew up under the sky. Sleeping under a roof is a big change.'),
              ],
              true,
            ),
            o('She does not care where he sleeps.', [
              N('She cares a lot. She made the bed and she heard him go.'),
              N('Letting him choose is a way of respecting him.'),
            ]),
            o('She is too tired to stop him.', [
              N('Maybe she is. But she could have called him back, and she chose not to.'),
              N('That is respect for what he needs.'),
            ]),
          ],
          'Understood that respecting what someone needs, even when it differs from our plan, is a way of caring.',
        ),
      ],
    ),
  ],
  [
    gl(
      'headman',
      'The person chosen to lead a village and help settle its problems.',
      'a24-08-tree-done',
    ),
    gl(
      'wallow',
      'To roll or lie about in mud or water for pleasure or to cool down.',
      'a24-08-herd',
    ),
  ],
);

// ================================================================== A24-9 Tiger! Tiger!
const A9: EduQuest = quest(
  'a24-09',
  'Tiger! Tiger!',
  {
    'a24-09-s1': {
      goal: 'Meet Grey Brother at the ford with Mowgli.',
      hint: 'The ford is where the river widens. Watch for a grey back in the grass.',
    },
    'a24-09-s2': {
      goal: 'Watch from the top of the ravine while the herd comes through.',
      hint: 'Stay flat, and wave when both halves are in. Then cover your ears.',
    },
    'a24-09-s3': {
      goal: 'Watch at the ravine mouth while Buldeo comes for the bounty.',
      hint: 'Keep your Nubbin back. Akela will handle Buldeo; nobody gets hurt.',
    },
  },
  [
    sc(
      'a24-09-ford',
      [
        N(
          'One morning there is a grey shape on the rock by the river, at the ford, where the water spreads wide and runs shallow.',
        ),
        GB(
          'He is back. He ate well last night, and now he is sleeping it off down in the dry ravine by the river.',
          'think',
        ),
        GB(
          'Full and slow, in the heat of the day. Tonight he means to wait for you at the village gate.',
        ),
        MG(
          'Then he is full, and he is slow. And he is lying in a ravine with a mouth at each end. Akela! Is Akela here?',
        ),
        N(
          'From the long grass rises the great grey Lone Wolf, gaunt now, but with his eyes as clear as ever.',
        ),
        AK(
          'I am here, little brother. I have been waiting since the Council of Fire for you to need me.',
          'happy',
        ),
        MG(
          'Split the herd for me. Cows and calves at one end. Bulls and plough-buffalo at the other. And then drive.',
          'angry',
        ),
      ],
      [
        ask(
          0,
          'science',
          'rivers flow slower where they are wide and shallow, and faster in narrow places',
          '4-ESS2-1',
          [
            N(
              'The ford is the place where the river spreads wide and runs shallow. Where would the water move fastest?',
            ),
          ],
          [
            o(
              'Through a narrow, steep gap.',
              [
                N(
                  'Yes. Squeezed into a narrow channel, water speeds up, and it can carve the rock.',
                ),
                N(
                  'Where the river spreads wide, it slows down. That is why a ford is a safe place to cross.',
                ),
              ],
              true,
            ),
            o('Across the wide, shallow ford.', [
              N('Not quite. Wide and shallow slows a river down, which is why people cross there.'),
              N('A narrow gap speeds the water up.'),
            ]),
            o('It moves at the same speed everywhere.', [
              N('Rivers change speed all the time, from still pools to rushing rapids.'),
              N('Narrow, steep places are fast, and wide, flat places are slow.'),
            ]),
          ],
          'Learned that rivers speed up in narrow places and slow down where they spread wide and shallow, as at a ford.',
        ),
      ],
      [
        ch('help', 'Ask what you and your Nubbin can do.', [
          MG(
            'Stand at the top of the ravine and wave when the herd is in. Do not go down. Whatever you hear.',
          ),
        ]),
        ch('akela', 'Greet Akela, who you last saw by the fire.', [
          AK(
            'Welcome, guest. You stood at his back. The pack noticed, after. Some of them were ashamed.',
            'soft',
          ),
        ]),
      ],
    ),
    sc(
      'a24-09-ford-done',
      [
        N(
          'Akela and Grey Brother run in among the buffalo. In a few minutes the herd is split, and grumbling, in two.',
        ),
        MG(
          'Fifteen cows and calves at this end, and nine bulls at that one. Twenty-four in all. Count them again, brother.',
        ),
        N(
          'You climb to the top of the ravine with your Nubbin, where you can see both ends, and lie flat in the hot grass.',
        ),
      ],
      [
        ask(
          1,
          'maths',
          'adding and comparing: 15 + 9 = 24, and 6 more cows and calves than bulls',
          '2.OA.A.1',
          [
            N(
              'Mowgli has 15 cows and calves and 9 bulls. How many buffalo in all? And how many more cows and calves than bulls?',
            ),
          ],
          [
            o(
              '24 in all, and 6 more cows and calves.',
              [
                N('Yes. 15 + 9 = 24, and 15 − 9 = 6.'),
                N('Add to find the whole herd, and subtract to compare the two groups.'),
              ],
              true,
            ),
            o('24 in all, and 9 more cows and calves.', [
              N('The total is right. Well done.'),
              N('To compare, take 9 from 15: 15 − 9 = 6.'),
            ]),
            o('6 in all, and 24 more cows and calves.', [
              N('Those numbers have swapped jobs.'),
              N('We add to get the total, 15 + 9 = 24, and subtract to compare, 15 − 9 = 6.'),
            ]),
          ],
          'Added 15 + 9 to find a total and subtracted to compare two groups.',
        ),
      ],
    ),
    sc(
      'a24-09-ravine',
      [
        N(
          'Mowgli rides the lead bull of the herd, Rama, round the head of the ravine. Akela drives the other half in from below.',
        ),
        N(
          'Both halves are in, and you wave. Mowgli puts his hands to his mouth and shouts down into the ravine.',
        ),
        MG('Shere Khan! Wake up! It is Mowgli! I have come with the buffalo!', 'angry'),
        N('Then the herd pours in from both ends at once.'),
        N(
          'A roar of hooves. A cloud of red dust rises up the walls of the ravine like smoke, and hides everything.',
        ),
        N(
          'Your Nubbin buries its face in your side. You put your hands over its ears, and then over your own.',
        ),
        N(
          'Then it is quiet. A long quiet, with only the dust settling, and a buffalo blowing through its nose.',
        ),
      ],
      [
        ask(
          5,
          'health',
          'very loud noise can hurt your ears, so protect them',
          'CASEL: Responsible decision-making',
          [N('You covered your ears when the herd roared by. Why is that a good idea?')],
          [
            o(
              'Very loud noise can hurt your ears.',
              [
                N(
                  'Yes. Sounds that are too loud can damage the tiny parts of the ear that let us hear.',
                ),
                N('If a noise is very loud, cover your ears or move away, and tell a grown-up.'),
              ],
              true,
            ),
            o('So you cannot hear anything ever again.', [
              N('It is the opposite. Covering your ears is how to keep your hearing safe.'),
              N('Cover your ears or move away from very loud noise.'),
            ]),
            o('It makes the dust go away.', [
              N('The dust stays where it is.'),
              N('Covering your ears helps keep them safe from very loud sound.'),
            ]),
          ],
          'Learned that very loud noise can hurt our ears, and that covering them or moving away protects our hearing.',
        ),
      ],
      [
        ch('wait', 'Wait at the top until the dust clears.', [
          N(
            'You wait. Below, Mowgli climbs down off Rama, and walks into the settling dust, and does not come out for a while.',
          ),
        ]),
        ch('hold', 'Hold your Nubbin and count your breaths.', [
          N(
            'You count to forty. On forty-one, Akela trots up the side of the ravine and sits down next to you, panting.',
          ),
        ]),
      ],
    ),
    sc(
      'a24-09-ravine-done',
      [
        AK(
          'It is finished. Shere Khan is dead. He will not trouble the jungle again, nor the village.',
          'think',
        ),
        N(
          'The buffalo spread out across the plain and start eating grass as if nothing has happened. To them, nothing has.',
        ),
        N('They graze side by side, shoulder to shoulder, the whole herd together.'),
      ],
      [
        ask(
          2,
          'science',
          'herd animals stay together because a group is safer than being alone',
          '3-LS2-1',
          [
            N(
              'The buffalo stay close together, shoulder to shoulder. Why do herd animals stay in a group?',
            ),
          ],
          [
            o(
              'Many animals together can watch out for each other.',
              [
                N(
                  'Yes. In a herd someone is always alert, and a big group is harder for a hunter to attack.',
                ),
                N('This is called safety in numbers.'),
              ],
              true,
            ),
            o('They have nowhere else to go.', [
              N('The plain is huge. They could scatter anywhere.'),
              N('They stay together because a group is safer than one alone.'),
            ]),
            o('They like to be crowded.', [
              N('Maybe they do. But there is a big survival reason.'),
              N('In a group, many eyes watch for danger, which is safer for each animal.'),
            ]),
          ],
          'Learned that herd animals stay together because many animals watching for danger are safer than a lone animal.',
        ),
      ],
    ),
    sc(
      'a24-09-bounty',
      [
        N(
          'Down at the ravine mouth Mowgli kneels with his back to you, busy. He means to take the hide to the Council Rock.',
        ),
        N(
          'Buldeo comes running from the village with his musket, red-faced and out of breath, having heard the noise.',
        ),
        BU(
          'Ho! That tiger has a hundred rupees on its head. A hunter’s bounty. Mine, by rights. Leave it to me, boy.',
          'angry',
        ),
        MG('It is my kill. I am taking the hide. Go away, old man.'),
        BU('You? A herd-boy? I will have the headman beat you for this!', 'angry'),
        MG('Akela. This man is bothering me.'),
        N(
          'Akela stands up out of the grass, and Buldeo finds himself flat on his back with a grey wolf standing over him.',
        ),
        N(
          'Akela does not bite. He only stands there, very large and very calm, like a heavy rug that has opinions.',
        ),
      ],
      [
        ask(
          2,
          'social-studies',
          'rules that protect wild tigers today',
          'D2.Civ.8.K-2',
          [
            N(
              'A bounty was a reward for hunting a tiger. Today hunting tigers is against the law in India. Why might the law have changed?',
            ),
          ],
          [
            o(
              'Tigers became rare, and the law helps them survive.',
              [
                N('Yes. Hunting and loss of forest made wild tigers fewer and fewer.'),
                N(
                  'India started Project Tiger in 1973 to protect them, and most of the world’s wild tigers live there today.',
                ),
              ],
              true,
            ),
            o('Tigers are no longer dangerous.', [
              N('A tiger is still a powerful wild animal.'),
              N(
                'The law protects them because there are far fewer wild tigers than there used to be.',
              ),
            ]),
            o('Nobody wants the money any more.', [
              N('Money is not the reason.'),
              N('Tigers became rare, and laws were made to protect those that are left.'),
            ]),
          ],
          'Learned that laws, such as India’s Project Tiger from 1973, now protect wild tigers because they became rare.',
        ),
      ],
      [
        ch('help', 'Help Buldeo up when Akela lets him go.', [
          N(
            'He takes your hand, shaking. He tries to say something brave and cannot, and nods instead.',
          ),
        ]),
        ch('mowgli', 'Ask Mowgli to let him go now.', [
          MG('Let him up, brother. He is frightened. He is just a frightened old man.', 'think'),
          N('Akela steps off. Buldeo runs, and you are glad.'),
        ]),
      ],
    ),
    sc(
      'a24-09-bounty-done',
      [
        N(
          'Buldeo runs back to the village as fast as his legs will go. He will tell a story about this, a very large one.',
        ),
        MG(
          'He will tell them I am a sorcerer. Let him. I have kept my word to Mother Wolf.',
          'think',
        ),
        N(
          'Buldeo threatened Mowgli, and Mowgli still asked Akela to let him up. You turn that over in your head as you walk.',
        ),
      ],
      [
        ask(
          2,
          'sel',
          'being gentle with someone who was unkind because they were scared',
          'CASEL: Social awareness',
          [
            N(
              'Buldeo shouted at Mowgli, but Mowgli let him go because he was frightened. Should we be gentle with people who are unkind because they are scared? There is no one right answer.',
            ),
          ],
          [
            o('Yes. Fear can make anyone act badly.', [
              N(
                'That is a fair answer. Understanding why someone behaves badly does not make it right, but it can make us gentler.',
              ),
              N('Mowgli stopped the fight, and he did not carry on punishing Buldeo.'),
            ]),
            o('No. If they were unkind, they should face the result.', [
              N(
                'That is a fair answer. Actions have results, and it matters that Buldeo hears Mowgli’s no.',
              ),
              N(
                'But Mowgli did not need to frighten him more. Being firm and being gentle can go together.',
              ),
            ]),
            o('It depends on whether they say sorry.', [
              N('That is a thoughtful answer. Saying sorry matters a lot.'),
              N('Buldeo ran off before he could say anything, so we do not know yet.'),
            ]),
          ],
          'Thought about whether to be gentle with someone who acted unkindly because they were frightened.',
        ),
      ],
    ),
    sc(
      'a24-09-complete',
      [
        N(
          'By evening the hide is rolled and tied, and Mowgli carries it on his shoulder like a bundle of washing.',
        ),
        AK('You did what you said you would do, little brother. Not many do.'),
        MG('I said it on the Council Rock. In front of everyone. So now it has to go there.'),
        N(
          'Behind you, in the dusk, the lights of the village come on one by one, and voices are rising.',
        ),
      ],
      [
        ask(
          2,
          'literacy',
          'theme: keeping a promise matters',
          'RL.4.2',
          [
            N(
              'Mowgli says, “I said it on the Council Rock, so now it has to go there.” What big idea, or theme, is the story showing?',
            ),
          ],
          [
            o(
              'Keeping your promises matters.',
              [
                N(
                  'Yes. The theme is the big idea under the story. Here it is that your word is worth keeping, even when it is hard.',
                ),
                N('Akela says “not many do”, which shows how rare it is.'),
              ],
              true,
            ),
            o('Always be the biggest and the loudest.', [
              N('Mowgli was neither the biggest nor the loudest.'),
              N('He kept his word, and that is the idea the story is showing.'),
            ]),
            o('Never ask other people for help.', [
              N('Mowgli asked Akela and Grey Brother for help, and the plan worked.'),
              N('The idea is about keeping your word.'),
            ]),
          ],
          'Identified the theme that keeping a promise matters, using Mowgli’s words as evidence.',
        ),
      ],
    ),
  ],
  [
    gl('ford', 'A shallow place in a river where people and animals can cross.', 'a24-09-ford'),
    gl('bounty', 'A reward paid for catching or hunting something.', 'a24-09-bounty'),
  ],
);

// ================================================================== A24-10 Stones
const A10: EduQuest = quest(
  'a24-10',
  'Stones',
  {
    'a24-10-s1': {
      goal: 'Walk back to the village with Mowgli at dusk.',
      hint: 'Walk at his side. Keep your Nubbin in your arms when the voices start.',
    },
    'a24-10-s2': {
      goal: 'Choose: go with Mowgli into the jungle, or stay a little with Messua.',
      hint: 'Either road is a good one. Mowgli will understand both.',
    },
  },
  [
    sc(
      'a24-10-dusk',
      [
        N(
          'At the edge of the village the whole place is waiting for you, with torches, and with Buldeo in front.',
        ),
        BU(
          'That is him. He talks to wolves. They do what he tells them. I saw it with my own eyes, and so did my back.',
          'angry',
        ),
        VI(
          'Wolf-boy! Sorcerer! He turned himself into a wolf and back again. He will do the same to our cattle!',
          'shock',
        ),
        VI('Go away! Go back to the jungle, and take your demons with you!', 'angry'),
        N(
          'Somebody throws a stone, and it goes wide. Then another, and another, clattering on the road round your feet.',
        ),
        N(
          'They are not aiming well; their hands are shaking. They are not cruel people, but very frightened ones.',
        ),
        MG(
          'Again? First the wolves throw me out because I am a man. Now men throw me out because I am a wolf.',
          'sad',
        ),
        N(
          'Then a woman pushes through the crowd, running, with her arms out. It is Messua, and she is crying.',
        ),
        ME(
          'Oh, my son, my son! They say you are a sorcerer. I do not believe it. Go, go quickly. They will hurt you.',
          'sad',
        ),
      ],
      [
        ask(
          5,
          'sel',
          'fear and unkindness: is being scared a reason to be unkind?',
          'CASEL: Responsible decision-making',
          [
            N(
              'The villagers threw stones because they were frightened. Is being scared a good reason to be unkind? There is no one right answer.',
            ),
          ],
          [
            o('No. You can be scared and still be kind.', [
              N('That is a fair answer. Fear is a feeling. What we do with it is a choice.'),
              N('Messua was scared too, and she ran towards Mowgli, not away.'),
            ]),
            o('It explains it, but it does not excuse it.', [
              N(
                'That is a thoughtful answer. Knowing why someone did something helps us understand.',
              ),
              N(
                'The stones could still have hurt someone, so what the villagers did still matters.',
              ),
            ]),
            o('Yes. Fear takes over and people cannot help it.', [
              N('That is an honest answer. Fear is strong, and sometimes it takes over fast.'),
              N(
                'But people can learn to pause and breathe before acting, and that is what we practise.',
              ),
            ]),
          ],
          'Talked about whether fear can excuse unkind behaviour, and how we can choose to be kind even when scared.',
        ),
      ],
      [
        ch('shield', 'Stand between Messua and the stones.', [
          N(
            'You stand in the road with your Nubbin behind you. Nobody throws anything at you; nobody quite dares.',
          ),
        ]),
        ch('nubbin', 'Hold your Nubbin tight and keep your head down.', [
          N(
            'Your Nubbin trembles against you. A stone lands near your boot, and rolls, and stops.',
          ),
        ]),
      ],
    ),
    sc(
      'a24-10-dusk-done',
      [
        MG(
          'Go back, Messua. It is not your fault. You were good to me. Go home before they turn on you.',
          'soft',
        ),
        ME('Goodbye, my son. Goodbye. I do not know if you are Nathoo. I loved you anyway.', 'sad'),
        N('She stands with her hands pressed together, until you can hardly see her.'),
      ],
      [
        ask(
          1,
          'literacy',
          'character: Messua’s love does not depend on whether Mowgli is really Nathoo',
          'RL.3.3',
          [
            N(
              'Messua says, “I do not know if you are Nathoo. I loved you anyway.” What does that tell us about her?',
            ),
          ],
          [
            o(
              'Her love does not depend on being proved right.',
              [
                N('Yes. She loves Mowgli for who he is, whether or not he is her lost son.'),
                N('A good clue to character is what a person does when they are not sure.'),
              ],
              true,
            ),
            o('She is confused about who he is.', [
              N('She may be a little. But look at what she chooses: to love him either way.'),
              N('That tells us she is generous.'),
            ]),
            o('She does not care about him very much.', [
              N('She ran through a crowd with her arms out, crying. She cares a great deal.'),
              N('Her love does not depend on knowing the answer.'),
            ]),
          ],
          'Used what a character says and does to understand her: Messua’s love does not depend on certainty.',
        ),
      ],
    ),
    sc(
      'a24-10-road',
      [
        N(
          'Mowgli turns and walks away up the road, towards the dark line of the trees. Akela and Grey Brother come out of the grass to meet him.',
        ),
        N(
          'Messua stands in the road behind you, with her hands pressed to her mouth. The crowd has gone quiet now, and a little ashamed.',
        ),
        N('She has lost a son twice now. Once to a tiger, and once to her own neighbours.'),
        MG('Guest? Are you coming? The jungle is home. You know the Words. You can come.', 'think'),
        N(
          'Your Nubbin looks at Mowgli, then back at Messua, then up at you. It is waiting to see what you do.',
        ),
        ME(
          'Go on, both of you. Do not worry about me. I have my house, and my husband. I will be well enough.',
          'sad',
        ),
      ],
      [
        ask(
          4,
          'social-studies',
          'choices have a cost: choosing one thing means not choosing another',
          'D2.Eco.1.K-2',
          [
            N(
              'You cannot be in two places at once. If you choose one road, you give up the other. What do we call what you give up when you choose?',
            ),
          ],
          [
            o(
              'The cost of the choice.',
              [
                N('Yes. Every choice has a cost: what you give up to get something else.'),
                N('Neither road here is wrong. Each one just costs something different.'),
              ],
              true,
            ),
            o('A mistake.', [
              N('Not a mistake. Giving something up is not the same as getting it wrong.'),
              N('It is the cost of the choice, and a good choice can still have a cost.'),
            ]),
            o('Nothing. You can have both.', [
              N('Wouldn’t that be nice? But a day only has so many hours.'),
              N('When you cannot have both, what you give up is the cost of your choice.'),
            ]),
          ],
          'Learned that every choice has a cost: what we give up when we choose one thing over another.',
        ),
      ],
      [
        ch(
          'mowgli',
          'Go with Mowgli into the jungle.',
          [
            MG(
              'Good. The wolves will be glad. The little one has been howling for them all week.',
              'happy',
            ),
          ],
          { 'a24-stones': 'mowgli' },
        ),
        ch(
          'messua',
          'Stay a little with Messua, and follow later.',
          [MG('Yes. Stay with her. Someone should. I will know where to find you.', 'soft')],
          { 'a24-stones': 'messua' },
        ),
      ],
    ),
    sc(
      'a24-10-road-done',
      [
        N(
          'You catch up with Mowgli at the edge of the trees. Behind you the torches stand in the road, getting smaller.',
        ),
        N(
          'Dusk is deepening. The cicadas stop, a nightjar starts, and from somewhere above a deep voice says hoo.',
        ),
        N(
          'Your Nubbin trots between Akela and Grey Brother, nose up, a wolf among wolves. It has never been so pleased with itself.',
        ),
      ],
      [
        ask(
          1,
          'science',
          'dusk: nocturnal animals wake and daytime animals settle',
          '4-LS1-2',
          [N('The jungle sounds change at dusk. The cicadas stop and an owl starts. Why?')],
          [
            o(
              'Night animals are waking up, and day animals are settling.',
              [
                N(
                  'Yes. Animals that are active at night are called nocturnal, and owls, bats and leopards are some of them.',
                ),
                N('Their senses suit the dark: big eyes, sharp ears and a keen sense of smell.'),
              ],
              true,
            ),
            o('It is just a coincidence.', [
              N('It happens every dusk, so it is a pattern, not a coincidence.'),
              N('Night animals wake up as the day animals settle down.'),
            ]),
            o('Because the forest is angry.', [
              N('Forests do not get angry.'),
              N('The change is because night animals are waking up, and day animals are settling.'),
            ]),
          ],
          'Learned that nocturnal animals wake at dusk and that their senses suit the dark.',
        ),
      ],
    ),
    sc(
      'a24-10-complete',
      [
        MG(
          'Tonight the hide goes to the Council Rock. I promised. And after that, you hunt with us. A whole season.',
        ),
        N(
          'So you do, after. You hunt with the four wolves through the turning year, and learn the jungle from inside.',
        ),
        N(
          'Here the year turns through three big seasons: the hot weather, the rains and the cool weather. Each lasts about four months.',
        ),
        N('You learn where the deer drink, and which trees hum with bees.'),
        GB(
          'You are still terrible at it, guest. But you are terrible in the right direction.',
          'happy',
        ),
        N(
          'Your Nubbin catches its first beetle. It brings it to you, very proud, and you let it go again when it is not looking.',
        ),
      ],
      [
        ask(
          2,
          'maths',
          'multiplying: 3 seasons of about 4 months is 12 months',
          '3.OA.A.1',
          [
            N(
              'Here there are 3 big seasons, and each lasts about 4 months. How many months is that?',
            ),
          ],
          [
            o(
              '12 months.',
              [
                N('Yes. Three groups of 4 months: 3 × 4 = 12.'),
                N('Which matches the months on any calendar.'),
              ],
              true,
            ),
            o('7 months.', [
              N('That is 3 + 4. But we want three groups of four.'),
              N('4, 8, 12. Twelve months.'),
            ]),
            o('10 months.', [
              N('Ten is not quite it. Count three fours: 4, 8, 12.'),
              N('Twelve months make a year.'),
            ]),
          ],
          'Multiplied 3 × 4 = 12 to see that three seasons of about four months make a year.',
        ),
      ],
    ),
  ],
  [
    gl(
      'nightjar',
      'A bird that hunts insects at night and rests by day, with a soft, churring call.',
      'a24-10-road-done',
    ),
    gl(
      'cicadas',
      'Large insects that make a loud, buzzing song in warm places.',
      'a24-10-road-done',
    ),
  ],
);

// ================================================================== A24-11 Look Well
const A11: EduQuest = quest(
  'a24-11',
  'Look Closely',
  {
    'a24-11-s1': {
      goal: 'Climb to the Council Rock as the moon comes up.',
      hint: 'Follow the path up the hill. Mowgli is already there.',
    },
    'a24-11-s2': {
      goal: 'Watch the pack come to the Council Rock.',
      hint: 'Stay still. This is the pack’s business.',
    },
  },
  [
    sc(
      'a24-11-climb',
      [
        N('By whichever road you came, you reach the Council Rock as the moon clears the hills.'),
        N(
          'Mowgli is already there. He has spread the great striped hide flat across the stone, and pinned it with four bamboo pegs.',
        ),
        N(
          'Your Nubbin looks at the stripes for a long time. Then it sits down on the very corner, carefully, like a cushion it is not sure of.',
        ),
        MG('I said I would bring it here. I keep my word. Not everyone does, on this hill.'),
        N(
          'Akela climbs up slowly and lies down on the hide, at full length, in the place where he used to lie.',
        ),
        AK(
          'There. That is where I lay, before. It feels the same. My bones are older. That is all.',
          'soft',
        ),
      ],
      [
        ask(
          0,
          'science',
          'the Moon rises about 50 minutes later each night',
          '1-ESS1-1',
          [N('The moon rises at 7 o’clock tonight. About when will it rise tomorrow night?')],
          [
            o(
              'A little before 8 o’clock.',
              [
                N(
                  'Yes. The Moon rises about 50 minutes later each night, because it is slowly circling the Earth.',
                ),
                N(
                  'That is why the full moon rises at sunset, and later phases rise late at night.',
                ),
              ],
              true,
            ),
            o('At 7 o’clock again, exactly.', [
              N('That is true for the Sun, nearly. The Moon is different.'),
              N('It rises about 50 minutes later each night.'),
            ]),
            o('Much earlier, at about 5 o’clock.', [
              N('It goes the other way round: later, not earlier.'),
              N('About 50 minutes later each night, so a little before 8 tomorrow.'),
            ]),
          ],
          'Learned that the Moon rises about 50 minutes later each night as it circles the Earth.',
        ),
      ],
      [
        ch('sit', 'Sit at the edge, where the guests sit.', [
          N('You sit in your old place among the rocks. It fits you better than it did.'),
        ]),
        ch('akela', 'Go and sit near Akela.', [
          AK(
            'Sit, guest. You have earned a closer seat. Not too close. I still have fleas.',
            'happy',
          ),
        ]),
      ],
    ),
    sc(
      'a24-11-climb-done',
      [
        N('Akela lifts his head and gives the old call, the Council call, out over the hills.'),
        N('Your Nubbin answers it. It still sounds like a kettle, but a kettle that means it.'),
        N(
          'Akela said the stone feels the same, and his bones feel older. He means he is still himself inside, in a body that has aged.',
        ),
      ],
      [
        ask(
          2,
          'literacy',
          'character depth: a person can feel the same inside while their body changes',
          'RL.4.3',
          [
            N(
              'Akela says, “It feels the same. My bones are older.” What is he telling us about himself?',
            ),
          ],
          [
            o(
              'He feels like himself inside, though his body has aged.',
              [
                N(
                  'Yes. People and wolves can feel the same on the inside for a very long time, while the outside changes.',
                ),
                N('It tells us Akela is calm about getting old.'),
              ],
              true,
            ),
            o('He is cross that the rock has changed.', [
              N('He says the rock feels the same. It is Akela who has changed, and he knows it.'),
              N('He says it calmly, not crossly.'),
            ]),
            o('He does not remember where he lay.', [
              N('He remembers exactly. It is the very place.'),
              N('He is telling us he feels the same, though he is older.'),
            ]),
          ],
          'Looked closely at what a character says to learn about how he sees himself: the same inside, older outside.',
        ),
      ],
    ),
    sc(
      'a24-11-pack',
      [
        N(
          'They come up the hill in ones and twos, thin, and some of them limping. Many have been in traps, or fought with each other.',
        ),
        N(
          'Without a leader the pack has fallen apart: no law, no hunting together, everybody for himself.',
        ),
        AK('Look. Look closely, wolves. Have I kept my word? Has the man’s cub kept his?', 'think'),
        N('The wolves look at the hide, and then at Mowgli. A long murmur goes round the rock.'),
        YW(
          'Lead us again, Akela. We have had enough of being without a law. And you, man’s cub, lead us too.',
          'sad',
        ),
        YW('We are sick of the tiger’s ways. We want to be the Free People again.'),
        BG(
          'Not so fast. You only want him back because you are hungry and lame. You threw him out when you were fat.',
          'angry',
        ),
        MG(
          'No. Man threw me out, and wolf threw me out. Now I will hunt alone. With my four brothers, if they will come.',
          'think',
        ),
      ],
      [
        ask(
          6,
          'sel',
          'forgiveness: should Mowgli forgive wolves who only want him back because they need him?',
          'CASEL: Relationship skills',
          [
            N(
              'The young wolves threw Mowgli out when it suited them, and want him back now they are hungry. Should he forgive them? There is no one right answer.',
            ),
          ],
          [
            o('Yes. Everyone makes mistakes, and they said they are sorry.', [
              N('That is a fair answer. Forgiving can set the forgiver free, too.'),
              N('Bagheera would say: forgive, but remember what happened.'),
            ]),
            o('No. They only want him because they need him.', [
              N(
                'That is a fair answer. A sorry that arrives because of a need is not always a true one.',
              ),
              N('Mowgli does choose to hunt alone, which is his right.'),
            ]),
            o('He can forgive them without going back to live with them.', [
              N('That is a thoughtful answer. Forgiving and trusting are two different things.'),
              N('Forgiving is a feeling inside. Trusting again has to be earned over time.'),
            ]),
          ],
          'Thought about forgiveness, and how it differs from trusting someone again.',
        ),
      ],
      [
        ch('proud', 'Look at Mowgli and nod.', [
          N('He sees it. He does not nod back, but he stands a little straighter.'),
        ]),
        ch('pack', 'Look at the thin young wolves instead.', [
          N(
            'They are ashamed, and hungry, and young. One of them sees you looking, and looks at his own paws.',
          ),
        ]),
      ],
    ),
    sc(
      'a24-11-pack-done',
      [
        GB('We will come. All four of us. Where you hunt, we hunt.'),
        N(
          'Akela lies on the hide and looks out over the hills. He does not say yes to the pack, and he does not say no.',
        ),
        N(
          'A real wolf pack is usually one family: a mother and father and their young. They share food and look after the pups together.',
        ),
      ],
      [
        ask(
          2,
          'science',
          'wolves live in family packs that share food and care for the young',
          '3-LS2-1',
          [
            N(
              'A real wolf pack is usually a family, with a mother, a father and their young. How does that help the pack survive?',
            ),
          ],
          [
            o(
              'They share food and look after the pups together.',
              [
                N(
                  'Yes. Everyone has a job, and the whole family can hunt things that are too big for one wolf.',
                ),
                N('The young learn how to hunt from the older ones.'),
              ],
              true,
            ),
            o('Wolves do not need families to survive.', [
              N('Wolves that live alone find it much harder to hunt big animals.'),
              N('A family pack shares the work and the food.'),
            ]),
            o('It makes the pack louder than other animals.', [
              N('Wolves can be loud together, true.'),
              N('But the real gain is sharing food and caring for the young.'),
            ]),
          ],
          'Learned that wolf packs are usually families that share food, hunt together and care for their pups.',
        ),
      ],
    ),
    sc(
      'a24-11-complete',
      [
        N(
          'When the pack has gone, the Council Rock is empty again. The flat stone is warm from the day.',
        ),
        BG(
          'Good. He will do. He did not need them in the end. That is how you know a cub has grown.',
          'think',
        ),
        BG(
          'He and his four brothers make five. Five is odd: pair them up, and one is left over. Now add your Nubbin, which seems to have joined, and that is six.',
        ),
        N(
          'Your Nubbin climbs onto the flat stone where Akela lay, turns round three times, and settles down to watch the moon.',
        ),
        BG(
          'Look at that. It is calling a Council of one. Take the rock home with you, guest. You will find a place for it.',
          'happy',
        ),
      ],
      [
        ask(
          2,
          'maths',
          'odd and even numbers: 5 is odd, 6 is even',
          '2.OA.C.3',
          [
            N(
              'Mowgli and his four wolf brothers make 5. With your Nubbin, that makes 6. Which of those numbers is even?',
            ),
          ],
          [
            o(
              '6. It can be shared into pairs with none left over.',
              [
                N('Yes. Even numbers make pairs with none left over: 6 is three pairs.'),
                N('Five makes two pairs and one left over, so it is odd.'),
              ],
              true,
            ),
            o('5. It is a friendly number.', [
              N('Five is friendly, but it is odd: two pairs and one left over.'),
              N('Six is even, which means three neat pairs.'),
            ]),
            o('Both are even.', [
              N('Try pairing up five wolves: two pairs, and one left over.'),
              N('Only 6 pairs up with nobody left.'),
            ]),
          ],
          'Used pairing to decide that 5 is odd and 6 is even.',
        ),
      ],
    ),
  ],
  [
    gl('murmur', 'A low, soft sound made by many voices speaking quietly together.', 'a24-11-pack'),
    gl('lame', 'Not able to walk properly because a leg or foot is hurt.', 'a24-11-pack'),
  ],
);

// ================================================================== A24-12 The Water Truce
const A12: EduQuest = quest(
  'a24-12',
  'The Water Truce',
  {
    'a24-12-s1': {
      goal: 'Walk down the dry river with Mowgli and Baloo.',
      hint: 'Follow the riverbed down. The only water left is at the Peace Rock.',
    },
    'a24-12-s2': {
      goal: 'Sit by the pool while Hathi tells the old story.',
      hint: 'Sit on the bank near Hathi. When the old elephant talks, the jungle listens.',
    },
    'a24-12-s3': {
      goal: 'Let your Nubbin drink at the pool with everyone else.',
      hint: 'Set it down on the bank. It will find its own place.',
    },
  },
  [
    sc(
      'a24-12-dry',
      [
        N(
          'A year comes when the rains do not, and a drought settles on the jungle. It goes brown, then grey, then crackles underfoot like paper.',
        ),
        N(
          'The streams dry up one after another. Then even the Waingunga shrinks to a trickle between hot white stones.',
        ),
        BL(
          'All my long life I have lived in these hills, and I have never seen it this bad. Look at me, cub. I am half the bear I was.',
          'sad',
        ),
        MG('You are still bigger than me. Look at my ribs. I can count them.'),
        BL(
          'Count them later. Down there, the Peace Rock. There is still water round it, and while there is, there is a truce.',
        ),
        N(
          'In the middle of the river a long blue rock stands up out of the water. You can see it now that the water has dropped.',
        ),
        N(
          'Hathi the wild elephant stands beside it with his three sons. When he saw the rock, he called the Water Truce.',
        ),
        BL(
          'The rains in this country come on the monsoon wind, from about June to September. This year the wind failed us.',
        ),
      ],
      [
        notice(
          7,
          'science',
          'the monsoon brings India’s yearly rains, and a drought is a long time with too little rain',
          '3-ESS2-1',
          [
            BL(
              'In summer the land heats faster than the sea. Hot air rises over the land, and damp wind rushes in from the ocean.',
            ),
            BL(
              'That wind drops its water as rain. If it comes late or weak, there is a drought: a long time with too little rain.',
            ),
          ],
          'Learned that the monsoon brings India’s yearly rains, and that a drought is a long time with too little rain.',
        ),
      ],
      [
        ch('carry', 'Carry your Nubbin over the hot stones.', [
          N(
            'The stones burn through your boots. Your Nubbin rides in your arms, panting, and you both feel the cool coming off the pool.',
          ),
        ]),
        ch('baloo', 'Walk beside Baloo, who is going slowly.', [
          BL(
            'Thank you. Do not make a fuss of it. A bear has his pride, even when it is thin.',
            'soft',
          ),
        ]),
      ],
    ),
    sc(
      'a24-12-dry-done',
      [
        N(
          'At the Peace Rock the whole jungle has come to drink. Deer stand beside wolves, and pigs beside panthers.',
        ),
        N('Nobody hunts while the Truce holds. Nobody even looks at anybody else that way.'),
        MG(
          'I am counting them. Each paw print I draw in the dust is two animals. Four for the deer, three for the wolves, two for the pigs.',
        ),
        N(
          'Hathi’s sons dig a hollow in the wet sand with their feet, so the smaller animals can reach the water.',
        ),
      ],
      [
        ask(
          2,
          'maths',
          'reading a scaled picture graph: each print stands for 2',
          '3.MD.B.3',
          [
            N(
              'Mowgli drew 4 prints for deer, 3 for wolves and 2 for pigs. Each print stands for 2 animals. How many animals is that altogether?',
            ),
          ],
          [
            o(
              '18.',
              [
                N('Yes. 4 + 3 + 2 = 9 prints, and 9 × 2 = 18 animals.'),
                N(
                  'A scaled graph is quick to read once you remember what each picture stands for.',
                ),
              ],
              true,
            ),
            o('9.', [
              N('Nine is the number of prints. But each print stands for two animals.'),
              N('9 prints × 2 = 18 animals.'),
            ]),
            o('24.', [
              N('That would be 12 prints. There are only 9.'),
              N('4 + 3 + 2 = 9 prints, and 9 × 2 = 18.'),
            ]),
          ],
          'Read a scaled picture graph where each symbol stands for 2, and found the total (18).',
        ),
        notice(
          3,
          'science',
          'wild Asian elephants live in herds led by an old mother, and can dig for water',
          '3-LS2-1',
          [
            HA(
              'In the real jungle, an Asian elephant herd is led by the oldest mother, not by a father. I am only a story elephant.',
              'happy',
            ),
            HA(
              'Real elephants can dig for water in a dry riverbed, and then other animals drink from the hole.',
            ),
            HA('India began Project Elephant in 1992 to protect them.'),
          ],
          'Learned that real Asian elephants live in herds led by an old female, dig for water in dry riverbeds, and are protected in India by Project Elephant.',
        ),
      ],
    ),
    sc(
      'a24-12-tale',
      [
        HA(
          'You young ones always ask why we keep the Truce. Listen, then. This is how fear came.',
          'think',
        ),
        HA(
          'In the beginning, nobody in the jungle was afraid of anybody. We ate grass and leaves, all of us, even the tigers.',
        ),
        HA(
          'The First of the Elephants made the jungle, and he chose a judge to keep the peace: the First Tiger, who was very fair.',
        ),
        HA(
          'One day two bucks fought, and the First Tiger, judging them, struck out and one of the bucks died. He did not mean it.',
        ),
        HA(
          'That was the first death. The jungle did not know what death was, and so it learned fear.',
        ),
        HA(
          'The First Tiger ran away into the marshes, and the reeds marked his coat with stripes. Tigers have worn them ever since.',
        ),
        HA(
          'So once a year, the tigers remember. And when the water is low, we all remember, and we drink together.',
        ),
        N('Nobody says anything for a while. A deer drinks, and lifts its head, and drinks again.'),
        MG('Is that true, Hathi?', 'think'),
        HA('It is old. That is a different thing from true, and sometimes a better one.'),
      ],
      [
        ask(
          9,
          'literacy',
          'old stories explain the world: is a story that is not literally true worth keeping?',
          'RL.4.2',
          [
            N(
              'Hathi says a story can be old without being true, and “sometimes a better one”. Is a story that is not true still worth keeping? There is no one right answer.',
            ),
          ],
          [
            o('Yes. Stories can teach us things that facts cannot.', [
              N(
                'That is a fair answer. This one is about fear, and what it means to look after each other when things are hard.',
              ),
              N(
                'People in India and everywhere have told old stories like this to explain the world.',
              ),
            ]),
            o('No. If it is not true, we should drop it.', [
              N('That is a fair answer. Facts are very important, especially in science.'),
              N(
                'But stories can still show us something true about people, even when the events did not happen.',
              ),
            ]),
            o('Keep it, but remember it is a story and not a fact.', [
              N(
                'That is a thoughtful answer. We can enjoy a story and still ask what really happened.',
              ),
              N('That is what Mowgli is doing when he asks: is it true?'),
            ]),
          ],
          'Thought about the difference between an old story and a true fact, and why people keep stories that explain the world.',
        ),
      ],
      [
        ch('thank', 'Thank Hathi for the story.', [
          HA(
            'Thank me by keeping the Truce. It is easy to keep when you are full. It counts when you are thirsty.',
          ),
        ]),
        ch('quiet', 'Say nothing, and look at the water.', [
          N(
            'You look at the water. It is very low, and very still, and everyone in the jungle is drinking from it.',
          ),
        ]),
      ],
    ),
    sc(
      'a24-12-tale-done',
      [
        BG(
          'Good story. I have heard it a hundred times. It is better when you are thirsty.',
          'think',
        ),
        BL('Everything is better when you are thirsty. Except being thirsty.'),
        BG(
          'Funny thing: the real reason for stripes is much plainer. In tall grass, a striped coat breaks up a tiger’s outline.',
        ),
      ],
      [
        ask(
          2,
          'science',
          'camouflage: stripes help a tiger hide in tall grass',
          '3-LS4-3',
          [
            N(
              'Hathi’s story says the reeds painted the First Tiger’s stripes. What do stripes really help a tiger do?',
            ),
          ],
          [
            o(
              'Hide in tall grass, which is called camouflage.',
              [
                N('Yes. Stripes break up a tiger’s shape in the light and shade of tall grass.'),
                N(
                  'Prey animals see poorly in some colours, so the tiger’s orange blends in. Each tiger’s stripes are also different, like a fingerprint.',
                ),
              ],
              true,
            ),
            o('Look scary to other tigers.', [
              N('Stripes do not work as a threat sign.'),
              N('They help tigers hide, called camouflage.'),
            ]),
            o('Keep them cool in the sun.', [
              N('Their coat is the same thickness all over, stripes or not.'),
              N('The stripes are for camouflage in tall grass.'),
            ]),
          ],
          'Learned that a tiger’s stripes are camouflage, helping it blend in with tall grass.',
        ),
      ],
    ),
    sc(
      'a24-12-drink',
      [
        N(
          'You set your Nubbin down on the bank. It looks at the water, and at all the animals, and at you.',
        ),
        N('Then it walks down to the edge between two deer, and bends, and drinks.'),
        N(
          'The deer beside it is a young one, a fawn with white spots. It looks at your Nubbin, and goes on drinking.',
        ),
        N(
          'They drink side by side, the fawn and your Nubbin, as if they had done it every evening of their lives.',
        ),
        MG(
          'There. The Truce. That is what Baloo was teaching me, all those years. I thought it was just words.',
          'soft',
        ),
        BL('It is just words. Words that everyone keeps. That is all a law is, cub.'),
      ],
      [
        ask(
          5,
          'sel',
          'sharing something scarce: agreed rules everyone keeps',
          'CASEL: Relationship skills',
          [
            N(
              'Wolves and deer drink side by side, though they are usually enemies. What makes it possible?',
            ),
          ],
          [
            o(
              'An agreement that everyone keeps.',
              [
                BL(
                  'Yes. A promise only works if everyone keeps it, and it keeps working because everyone does.',
                  'happy',
                ),
                N(
                  'It is the same with taking turns on a swing. The rule is simple, and it works when all of us agree.',
                ),
              ],
              true,
            ),
            o('The wolves are not hungry.', [
              N('They are hungry, and that is what makes the Truce hard.'),
              N('It works because everyone has agreed to keep it.'),
            ]),
            o('The deer are too fast to catch.', [
              N('Deer are fast, but that is not it.'),
              N('The animals have agreed, and each one keeps the promise.'),
            ]),
          ],
          'Understood that a shared rule works when everyone agrees to keep it, even those who are usually enemies.',
        ),
      ],
      [
        ch('watch', 'Watch them drink.', [
          N('You watch. It is one of the quietest things you have ever seen.'),
        ]),
        ch('join', 'Kneel and drink too.', [
          N(
            'You kneel at the edge and cup the water in your hands. It tastes of stone, and of rain that has not come yet.',
          ),
        ]),
      ],
    ),
    sc(
      'a24-12-drink-done',
      [
        N(
          'That night, far off, there is a rumble of thunder from the hills. Everybody lifts their head at once.',
        ),
        N(
          'The first drops fall on the hot stones and hiss. Then the rain comes, and the Truce is over, and no one minds.',
        ),
        N(
          'The water in the sky was once water in rivers and seas. The Sun lifted it, the cold sky turned it to cloud, and now it falls again.',
        ),
      ],
      [
        ask(
          1,
          'science',
          'the water cycle: water evaporates, forms clouds and falls as rain',
          '3-ESS2-1',
          [N('The rain that falls tonight began somewhere else. Where does rain come from?')],
          [
            o(
              'Water that rose from rivers and seas, formed clouds and fell.',
              [
                N(
                  'Yes. The Sun warms water, which rises as invisible vapour. High up it cools into clouds and falls as rain.',
                ),
                N('It is the water cycle, and the monsoon is one very big turn of it.'),
              ],
              true,
            ),
            o('The sky makes new water from nothing.', [
              N('Water is not made from nothing. It travels round and round.'),
              N('Rain is water that rose from rivers and seas, formed clouds and fell.'),
            ]),
            o('It comes from the Moon.', [
              N('The Moon is far, far away, and has no water for us.'),
              N('Rain is the Earth’s own water travelling round.'),
            ]),
          ],
          'Learned that rain is part of the water cycle: water evaporates, forms clouds, and falls again.',
        ),
      ],
    ),
    sc(
      'a24-12-complete',
      [
        N(
          'The rain comes in sheets. The river comes back, brown and loud, and covers the Peace Rock by morning.',
        ),
        N(
          'The fawn and its mother are gone into the grass. Your Nubbin looks for them for a while, then gives up.',
        ),
        HA(
          'Good. Now everyone goes back to being afraid of each other. It is the natural way. But we remember.',
          'think',
        ),
        N('Your Nubbin stands in the rain with its face up and its mouth open, drinking the sky.'),
      ],
      [
        ask(
          2,
          'social-studies',
          'scarcity: when there is not enough, people must agree how to share',
          'D2.Eco.1.K-2',
          [
            N(
              'The animals needed a truce in the drought, and they do not need one now the river is full. Why?',
            ),
          ],
          [
            o(
              'When there is not enough of something, we must agree how to share it.',
              [
                N(
                  'Yes. That is called scarcity. When there is plenty, nobody needs rules for sharing.',
                ),
                N('When it is scarce, a fair way of sharing keeps the peace.'),
              ],
              true,
            ),
            o('The animals are no longer thirsty, so they forgot the Truce.', [
              N(
                'Partly true. But the real reason is that there is enough water for all of them now.',
              ),
              N('When something is plentiful we do not need a truce to share it.'),
            ]),
            o('Rain makes the animals friendlier.', [
              N('It may feel nicer. But the animals have not changed.'),
              N('The change is that there is now enough water for everyone.'),
            ]),
          ],
          'Learned about scarcity: when something is in short supply, people and animals must agree how to share it fairly.',
        ),
      ],
    ),
  ],
  [
    gl('truce', 'An agreement to stop fighting for a while.', 'a24-12-dry'),
    gl(
      'drought',
      'A long time with very little rain, when streams and ponds dry up.',
      'a24-12-dry',
    ),
  ],
);

// ================================================================== A24-13 Letting in the Jungle
const A13: EduQuest = quest(
  'a24-13',
  'Letting in the Jungle',
  {
    'a24-13-s1': {
      goal: 'Wait by Messua’s hut in the dark.',
      hint: 'Stay out of the torchlight. Mowgli will come when the village is asleep.',
    },
    'a24-13-s2': {
      goal: 'Go with Messua and her husband to the road.',
      hint: 'Keep to the dark under the trees. The wolves run alongside, out of sight.',
    },
    'a24-13-s3': {
      goal: 'Watch the jungle come into the village.',
      hint: 'Climb to the ridge and watch. It takes a whole season, and nobody is hurt.',
    },
  },
  [
    sc(
      'a24-13-hut',
      [
        N(
          'Word comes through the jungle, from wolf to wolf: the village has tied up Messua and her husband in their own hut.',
        ),
        N(
          'Buldeo has told the village that they took in a sorcerer. Now the village means to punish them for it, in the morning.',
        ),
        N(
          'You wait with Mowgli in the trees above the village. Down below, torches move about, and men argue in loud voices.',
        ),
        VI(
          'A wolf-demon, under our own roofs. We could all have been eaten in our beds. They will answer for it.',
          'angry',
        ),
        N(
          'When the village is asleep, Mowgli slides down out of the trees and in at the back of the hut.',
        ),
        N(
          'From the branches you watch the little window. Inside, a shadow bends over two other shadows, and works at the ropes.',
        ),
        N(
          'Your Nubbin wriggles on the branch, longing to rush down to Messua. You breathe slowly, and so does it.',
        ),
        MG('Messua. It is me. Hush. I have come to take you away.', 'soft'),
      ],
      [
        ask(
          6,
          'sel',
          'holding an urge to rush in: slow breathing and a plan',
          'CASEL: Self-management',
          [
            N(
              'Your Nubbin wants to rush down, but a noise could wake the village. What helps when you want to rush in but need to wait?',
            ),
          ],
          [
            o(
              'A slow breath, and remembering the plan.',
              [
                N(
                  'Yes. A slow breath calms the body, and the plan reminds you why waiting is right.',
                ),
                N('Waiting quietly is a way of helping.'),
              ],
              true,
            ),
            o('Rushing in anyway to be brave.', [
              N(
                'That is a natural feeling. But rushing in could wake the guards and make things worse.',
              ),
              N('A slow breath and keeping to the plan is the braver choice.'),
            ]),
            o('Looking away so you cannot see.', [
              N('It may feel easier. But then you cannot keep watch, and that is your job.'),
              N('A slow breath and staying alert will help.'),
            ]),
          ],
          'Practised holding back an urge to rush in, using slow breathing and sticking to a plan.',
        ),
      ],
      [
        ch('watch', 'Keep watch on the street.', [
          N('You keep your eyes on the street. One dog barks, once, and then thinks better of it.'),
        ]),
        ch('nubbin', 'Hold your Nubbin still on the branch.', [
          N(
            'Your Nubbin is trembling with wanting to go down to Messua. You hold it, and it lets you.',
          ),
        ]),
      ],
    ),
    sc(
      'a24-13-hut-done',
      [
        N(
          'The back door opens. Mowgli comes out with Messua on one arm and her husband on the other, both stiff from the ropes.',
        ),
        ME('My son, my son. I knew you would come. I did not believe it, but I knew.', 'sad'),
        N(
          'She is shaking, but she is smiling too, and she holds on to his sleeve as if he might vanish.',
        ),
      ],
      [
        ask(
          1,
          'literacy',
          'understanding a character: hope and belief can feel different',
          'RL.3.3',
          [N('Messua says, “I did not believe it, but I knew.” What do you think she means?')],
          [
            o(
              'She hoped deep down, even when it seemed unlikely.',
              [
                N(
                  'Yes. You can hold on to a hope without feeling sure. It sits quietly underneath.',
                ),
                N(
                  'Authors use lines like this to show what a character feels beneath the surface.',
                ),
              ],
              true,
            ),
            o('She is mixed up and does not know what she thinks.', [
              N('Lots of people feel mixed up when they are scared.'),
              N('But she says she knew, which tells us she hoped deep down.'),
            ]),
            o('She is lying to make Mowgli feel good.', [
              N('Nothing in the scene suggests that. She is shaking and holding on to his sleeve.'),
              N('She is telling the truth about a hope she held on to.'),
            ]),
          ],
          'Looked at what a character’s words show about her inner feelings: a hope that held on even when she could not believe it.',
        ),
      ],
    ),
    sc(
      'a24-13-road',
      [
        N(
          'Mowgli leads them through the dark, the long way round the fields. Grey Brother and the others run unseen beside the path.',
        ),
        MG(
          'There is a town that way, towards the rising sun, a long day’s walk. Nobody there knows you, and the law there will keep you safe.',
          'think',
        ),
        ME(
          'Come with us. Please. Come and be my son in a place where nobody throws stones.',
          'sad',
        ),
        MG('I cannot. Not yet. But I will know where you are. The jungle tells me things.'),
        MG(
          'Guest. Go up to the hill where Hathi feeds, and give him my word. Say: the fields. He will know.',
        ),
        N('You run up into the dark with your Nubbin, while Mowgli walks Messua to the road.'),
        N(
          'Hathi is where Mowgli said, pulling down branches. He hears the message, and stands very still, with his ears out.',
        ),
        HA(
          'The fields. Yes. I remember those fields, and what was done there to my legs, long ago. Tell him yes.',
          'think',
        ),
      ],
      [
        ask(
          1,
          'social-studies',
          'compass directions: the Sun rises in the east',
          'D2.Geo.2.K-2',
          [
            N(
              'Mowgli points the way to the town: towards the rising sun. Which direction is that?',
            ),
          ],
          [
            o(
              'East.',
              [
                N('Yes. The Sun rises in the east and sets in the west.'),
                N('So Messua and her husband will walk east, with the dawn in front of them.'),
              ],
              true,
            ),
            o('West.', [
              N('West is where the Sun goes down in the evening.'),
              N('The rising sun is in the east.'),
            ]),
            o('North.', [
              N('North is the way of the Pole Star, not the Sun.'),
              N('The Sun rises in the east.'),
            ]),
          ],
          'Learned that the Sun rises in the east, and used it to find a compass direction.',
        ),
      ],
      [
        ch('ask', 'Ask Hathi what he will do.', [
          HA('Nothing quick. Nothing cruel. We will only let the jungle in. It was there first.'),
        ]),
        ch('nod', 'Bow to Hathi, and go back down.', [
          N('Hathi lifts his trunk to you, very slowly, the way you would raise a hat.'),
        ]),
      ],
    ),
    sc(
      'a24-13-road-done',
      [
        N(
          'When you get back, Messua and her husband are only two small shapes on the road, walking away into the grey of dawn.',
        ),
        N(
          'The sky is lit pink and grey, though the sun has not yet shown. She turns once, at the bend, and lifts her hand.',
        ),
        N('You lift yours.'),
      ],
      [
        ask(
          1,
          'science',
          'twilight: the sky lights up before the Sun rises',
          '5-ESS1-2',
          [
            N(
              'The sky is glowing before the sun has come up. Why does the sky brighten before sunrise?',
            ),
          ],
          [
            o(
              'Sunlight reaches the air above us before it reaches the ground.',
              [
                N(
                  'Yes. The Sun is still below the horizon, but its light lights up the air high overhead and scatters down.',
                ),
                N('That glow is called dawn, or twilight.'),
              ],
              true,
            ),
            o('The Moon turns itself up.', [
              N('The Moon does not brighten like that.'),
              N('The dawn glow is sunlight, shining on the air above us before the Sun has risen.'),
            ]),
            o('The stars get closer.', [
              N('The stars are as far away as ever.'),
              N('The glow is sunlight lighting the upper air before the Sun rises.'),
            ]),
          ],
          'Learned that the sky glows before sunrise because sunlight lights the air above us before it reaches the ground.',
        ),
      ],
    ),
    sc(
      'a24-13-jungle',
      [
        N('It is not one night. It takes the whole of the rains.'),
        N(
          'Hathi and his three sons walk through the fields at night and trample them flat. The deer and the pigs eat what is left.',
        ),
        N(
          'The wild things come closer every evening, and the cattle are frightened. The well goes green.',
        ),
        N(
          'The creepers climb the walls, and the roofs fall in under the rain. Trees push up through the floors.',
        ),
        N(
          'In the end the villagers pack their carts, and go down the valley to their relations, and do not come back.',
        ),
        N(
          'Nobody is hurt, and nobody is killed. The jungle simply comes in, slowly, the way it does when people stop holding it out.',
        ),
        BG('It was a hard thing to do, little brother. Harder than the tiger.', 'think'),
        MG(
          'They threw stones at Messua. They were going to hurt her. And now there is no village to hurt anyone in.',
          'angry',
        ),
      ],
      [
        ask(
          7,
          'sel',
          'fairness and consequences: was letting in the jungle fair to the villagers?',
          'CASEL: Responsible decision-making',
          [
            N(
              'Mowgli and Hathi drove the villagers out without hurting anyone. Was that fair? There is no one right answer.',
            ),
          ],
          [
            o('Yes. They were going to hurt Messua, and nobody was harmed.', [
              N(
                'That is a fair answer. They stopped a harm, and chose a way that hurt no one’s body.',
              ),
              N('But the villagers lost their homes, and that is a real cost too.'),
            ]),
            o('No. The villagers were frightened, not wicked.', [
              N('That is a fair answer. They were scared of something they did not understand.'),
              N('Mowgli says himself that he does not feel the way he thought he would.'),
            ]),
            o('It was both fair and sad.', [
              N(
                'That is a thoughtful answer. A thing can be right and still leave sadness behind.',
              ),
              N(
                'Many hard choices are like that, and noticing the sadness is part of choosing well.',
              ),
            ]),
          ],
          'Thought about whether a protective action can be fair while still costing someone dearly.',
        ),
      ],
      [
        ch('sad', 'Tell him it is sad all the same.', [
          MG('It is. I know. I do not feel like I thought I would.', 'sad'),
        ]),
        ch('quiet', 'Say nothing, and look at the green roofs.', [
          N(
            'You look at the place where the village was. A peacock is standing on what used to be the well.',
          ),
        ]),
      ],
    ),
    sc(
      'a24-13-jungle-done',
      [
        N(
          'By the next dry season you can hardly tell a village was ever there. Just humps under the creepers, and one stone platform.',
        ),
        N('A fig tree grows out of the platform now. The same tree Buldeo told his stories under.'),
        N('Its roots are pushing the old stones apart, a little more every year.'),
      ],
      [
        ask(
          1,
          'science',
          'animals spread seeds; roots can split stone',
          '2-LS2-2',
          [N('A fig tree is growing on a stone platform. How might its seed have got there?')],
          [
            o(
              'A bird or another animal dropped it.',
              [
                N('Yes. Many animals eat fruit and drop the seeds far away in their droppings.'),
                N(
                  'A seed that lands in a crack with a little soil can sprout, and its roots can split stone.',
                ),
              ],
              true,
            ),
            o('The stone made it.', [
              N('Stones do not make seeds.'),
              N('A bird or animal probably dropped it, and it sprouted in a crack.'),
            ]),
            o('It grew from nothing, overnight.', [
              N('Every tree grows from a seed.'),
              N('An animal probably carried it, and it grew slowly over years.'),
            ]),
          ],
          'Learned that animals spread seeds in their droppings, and that a tree’s roots can split stone as they grow.',
        ),
      ],
    ),
    sc(
      'a24-13-complete',
      [
        N(
          'You sit on the ridge with Mowgli, looking down at the green humps where the houses were.',
        ),
        MG(
          'Messua got to the town. Chil saw her there, in a house with a blue door. She has a garden.',
          'soft',
        ),
        MG(
          'It was about twenty-four kilometres, and she walked at four kilometres an hour. Chil timed her.',
        ),
        N(
          'Your Nubbin is asleep against your side, with its paws twitching. In its dream, you think, it is running with wolves.',
        ),
      ],
      [
        ask(
          2,
          'maths',
          'distance = speed × time: 4 km an hour for 6 hours is 24 km',
          '3.OA.A.3',
          [N('Messua walks 4 kilometres every hour. How far does she get in 6 hours?')],
          [
            o(
              '24 kilometres.',
              [
                N('Yes: 4 × 6 = 24. Count by fours: 4, 8, 12, 16, 20, 24.'),
                N('That is a good day’s walk.'),
              ],
              true,
            ),
            o('10 kilometres.', [
              N('That is 4 + 6. But she goes 4 kilometres in each of 6 hours.'),
              N('4 × 6 = 24.'),
            ]),
            o('18 kilometres.', [
              N('Eighteen would be 3 kilometres an hour for 6 hours.'),
              N('At 4 kilometres an hour, it is 4 × 6 = 24.'),
            ]),
          ],
          'Multiplied a speed by a time (4 × 6 = 24) to find the distance travelled.',
        ),
      ],
    ),
  ],
  [
    gl('trample', 'To walk heavily on something and crush it flat.', 'a24-13-jungle'),
    gl('dawn', 'The first light of the day, just before the sun comes up.', 'a24-13-road-done'),
  ],
);

// ================================================================== A24-14 Red Dog
const A14: EduQuest = quest(
  'a24-14',
  'Red Dog',
  {
    'a24-14-s1': {
      goal: 'Go with Mowgli to Kaa, to make a plan against the red dogs.',
      hint: 'Kaa is lying on the river bank. He thinks slowly, and then he is right.',
    },
    'a24-14-s2': {
      goal: 'Watch the red dogs come up the river from the bank.',
      hint: 'Stay on the high bank with your Nubbin. You are here to watch and to wait.',
    },
    'a24-14-s3': {
      goal: 'Sit with Akela and Mowgli on the river bank.',
      hint: 'Go down to the bank. Sit beside them. You do not need to say anything.',
    },
  },
  [
    sc(
      'a24-14-plan',
      [
        N('A lone wolf comes into the Seoni hills at dusk, limping on one foreleg, with bad news.'),
        GB(
          'The red dogs are coming, the dhole, up the river, two hundred of them. Maybe more.',
          'shock',
        ),
        GB(
          'They do not stop. They do not sleep. They eat everything in front of them, and wolves run from them.',
        ),
        MG(
          'The Free People do not run. Not from anyone. Kaa will know what to do. Kaa always knows.',
          'angry',
        ),
        N('Kaa lies along the bank of the Waingunga, very old now, and very wise, and very large.'),
        KA(
          'Dhole. Hmm. They run in a pack, and they do not think. That is their strength. It is also their weakness.',
          'think',
        ),
        KA(
          'I will show you a place. The Bee Rocks, the gorge where the Little People live. A whole colony of wild bees, in the cliffs.',
        ),
        KA(
          'Lead the dogs past the Bee Rocks, and into the river. The river does the rest. And your wolves wait downstream.',
        ),
      ],
      [
        ask(
          6,
          'science',
          'bees defend their colony: a bee colony is a group that protects its home',
          '3-LS2-1',
          [
            N(
              'Kaa says the bees will not like it when somebody runs through their home. Why do bees attack when their nest is disturbed?',
            ),
          ],
          [
            o(
              'They are defending their colony, their young and their honey.',
              [
                N('Yes. A bee colony is a family of thousands, and bees guard it together.'),
                N(
                  'Giant rock bees hang their single big comb in the open on a cliff, so they stand guard around it.',
                ),
              ],
              true,
            ),
            o('They are bored.', [
              N('Bees have very busy lives, and boredom is not in them.'),
              N('They defend their colony, their young and their honey.'),
            ]),
            o('They are hunting for food.', [
              N('Bees eat nectar and pollen from flowers.'),
              N('They sting to defend their home.'),
            ]),
          ],
          'Learned that a bee colony defends its nest, young and honey together, which is why disturbing it is dangerous.',
        ),
      ],
      [
        ch('clever', 'Tell Kaa that is very clever.', [
          KA(
            'Of course it is. I am old. Being old is mostly being clever, and stiff in the mornings.',
            'happy',
          ),
        ]),
        ch('bees', 'Ask what the bees will do.', [
          KA(
            'What bees always do, when somebody runs through their house. Nothing gentle. But nothing they cannot outrun.',
          ),
        ]),
      ],
    ),
    sc(
      'a24-14-plan-done',
      [
        MG(
          'I will lead them. I am faster than any wolf through the trees. I will jump into the river at the bottom of the gorge.',
        ),
        KA(
          'And I will be waiting in the water, to pull you out. Do not make me wait long. I get bored.',
        ),
        N(
          'Mowgli goes quiet for a moment. This is the dangerous part, and he has picked it for himself.',
        ),
      ],
      [
        ask(
          2,
          'literacy',
          'how a character responds to an event: courage and trust',
          'RL.2.3',
          [
            N(
              'Mowgli takes the dangerous part of the plan for himself, and trusts Kaa to catch him. What does that show about him?',
            ),
          ],
          [
            o(
              'He is brave, and he trusts his friends.',
              [
                N(
                  'Yes. He does not ask someone else to take the risk, and he trusts Kaa to do his part.',
                ),
                N('How a character responds to trouble shows what they are like.'),
              ],
              true,
            ),
            o('He does not understand the danger.', [
              N('He understands it very well. He chose the fastest runner’s job.'),
              N('He is brave, and he trusts Kaa.'),
            ]),
            o('He wants to show off.', [
              N(
                'Possibly a little. But look at what he does: he plans carefully and shares the work.',
              ),
              N('That shows courage and trust.'),
            ]),
          ],
          'Saw how a character’s response to danger shows his courage and his trust in friends.',
        ),
      ],
    ),
    sc(
      'a24-14-river',
      [
        N(
          'You stand on the high bank of the river, downstream of the gorge, with the wolves of the Seoni pack.',
        ),
        N(
          'Far up the gorge there is a sound like the whole world humming. Then a roar of barking, and a long brown rush.',
        ),
        N(
          'The red dogs pour down the gorge after Mowgli, and the bees pour out of the cliffs after the red dogs.',
        ),
        N(
          'Mowgli comes off the cliff edge in a long jump, straight into the river. A great brown coil rises under him: Kaa.',
        ),
        N(
          'The dogs come after him into the deep water, howling. The current takes them down, fast, towards the waiting wolves.',
        ),
        N(
          'Then it is all noise and spray. You cannot see anything but white water, and grey backs, and red ones.',
        ),
        AK(
          'Stay back, guest. Keep the little one back. This is the pack’s fight, and it is the last one I will fight.',
          'think',
        ),
      ],
      [
        ask(
          4,
          'science',
          'moving water pushes things along: a force in one direction (unbalanced)',
          '3-PS2-1',
          [N('The river carries the dogs downstream. What is pushing them along?')],
          [
            o(
              'The force of the moving water.',
              [
                N(
                  'Yes. Moving water pushes on anything in it. A strong push in one direction is an unbalanced force.',
                ),
                N('A stick in a river drifts the same way, as the water pushes it.'),
              ],
              true,
            ),
            o('The wind alone.', [
              N('Wind can push things on water, but the river is doing most of the work here.'),
              N('The moving water is pushing them.'),
            ]),
            o('Nothing. They are swimming for fun.', [
              N(
                'They are being swept along. Even strong swimmers cannot fight a strong current for long.',
              ),
              N('The force of the moving water is pushing them.'),
            ]),
          ],
          'Learned that moving water pushes things along with a force, and that an unbalanced force makes things move.',
        ),
      ],
      [
        ch('hold', 'Hold your Nubbin close and keep watching.', [
          N('Your Nubbin trembles but keeps watching too. Neither of you looks away.'),
        ]),
        ch('cover', 'Turn your Nubbin away from the river.', [
          N(
            'You turn it to face the trees. It lets you, and leans into your knees, and you watch for both of you.',
          ),
        ]),
      ],
    ),
    sc(
      'a24-14-river-done',
      [
        N(
          'It goes on a long time. Then the noise of the river is only the river again, and the red dogs are gone.',
        ),
        N(
          'Some ran, and some went down with the water. The pack holds the river, and it is morning.',
        ),
        GB('Forty of us came down to the bank. Seven are limping, but we are all here.', 'soft'),
      ],
      [
        ask(
          2,
          'maths',
          'subtraction in a word problem: 40 − 7 = 33',
          '2.OA.A.1',
          [
            N(
              'Forty wolves came to the river bank, and seven are limping. How many wolves are not limping?',
            ),
          ],
          [
            o(
              '33.',
              [
                N('Yes: 40 − 7 = 33. Take 10 from 40 to make 30, then add 3 back.'),
                N('Good wolves, all of them.'),
              ],
              true,
            ),
            o('47.', [
              N('That is 40 + 7. We want to take the limping ones away.'),
              N('40 − 7 = 33.'),
            ]),
            o('43.', [
              N('43 is more than 40, so some have been added, not taken away.'),
              N('Take 7 from 40: 33.'),
            ]),
          ],
          'Solved a subtraction word problem within 100: 40 − 7 = 33.',
        ),
      ],
    ),
    sc(
      'a24-14-akela',
      [
        N(
          'Akela lies very still on the shingle, with Mowgli kneeling beside him. He is not hurt; he is only very, very old.',
        ),
        AK(
          'It was a good fight. I always wanted the last one to be a good one. And it was.',
          'soft',
        ),
        MG('Do not talk. Rest. You can rest now.', 'sad'),
        AK(
          'I have been resting all my life, between hunts. This is different. Little brother, lift me. Let me see the hills.',
          'soft',
        ),
        N(
          'Mowgli lifts the old grey head onto his knee, so that Akela can see the Seoni hills in the morning light.',
        ),
        AK(
          'I said I would look after you. A long time ago, at the Council Rock. Have I kept my word?',
          'think',
        ),
        MG('Always. Every time.', 'sad'),
        AK(
          'Good. Then go to your own people, when it is time. Not yet. But when it is time. Promise me.',
          'soft',
        ),
        N(
          'Mowgli promises, and Akela closes his eyes. His breath goes out, long and slow, and does not come back.',
        ),
        N('Akela has died. His old body has stopped working, and it will not start again.'),
      ],
      [
        ask(
          9,
          'sel',
          'what dying means, said plainly, and that it is all right to be sad',
          'CASEL: Social awareness',
          [N('Akela has died. What does that mean?')],
          [
            o(
              'His body has stopped working and will not start again.',
              [
                N('Yes. That is what dying means. It is final, and it is no one’s fault.'),
                N('It is all right to feel sad. Feeling sad shows how much he mattered.'),
              ],
              true,
            ),
            o('He is just sleeping, and will wake up soon.', [
              N(
                'It can look like sleep, but it is not. A sleeping body wakes up. A body that has died does not.',
              ),
              N('Saying so plainly is kinder, so that nobody is afraid of going to sleep.'),
            ]),
            o('He has gone away on a trip.', [
              N('Akela has not gone on a trip. He has died, and he will not come back.'),
              N('That is a sad thing to understand, and we can feel sad together.'),
            ]),
          ],
          'Learned plainly what it means when someone dies, and that feeling sad is a normal and loving response.',
        ),
      ],
      [
        ch('sit', 'Sit down beside them, and wait.', [
          N(
            'You sit on the shingle beside them, and nobody says anything for a long time. That is the right thing to say.',
          ),
        ]),
        ch('hand', 'Put your hand on Mowgli’s back.', [
          N(
            'He does not look round. But he leans back against your hand a little, and stays there.',
          ),
        ]),
      ],
    ),
    sc(
      'a24-14-akela-done',
      [
        N(
          'Your Nubbin creeps up and lies down against Akela’s grey side, the way it used to lie with the cubs in the cave.',
        ),
        N('It stays there until the sun is high. Nobody moves it.'),
        N(
          'Mowgli has red eyes, a tight throat and heavy, tired arms. All of that is what sadness does to a body.',
        ),
      ],
      [
        ask(
          2,
          'health',
          'looking after yourself when you are grieving: company, talking, rest and remembering',
          'CASEL: Self-management',
          [N('After someone we love dies, we may feel heavy, achy and tired. What can help?')],
          [
            o(
              'Being with people who care, talking, resting and remembering.',
              [
                N('Yes. Grief takes a lot of energy, and company and rest help.'),
                N('Remembering the good times is a way to keep someone close.'),
              ],
              true,
            ),
            o('Keeping very busy so we never think about it.', [
              N('Being busy can give a break, and that is fine for a while.'),
              N('But the feelings wait, so it is good to share them with someone as well.'),
            ]),
            o('Staying completely alone.', [
              N('Some quiet time can be good.'),
              N('But being with caring people usually helps most.'),
            ]),
          ],
          'Learned that after a loss, company, talking, rest and remembering can help our bodies and hearts.',
        ),
      ],
    ),
    sc(
      'a24-14-complete',
      [
        N(
          'That evening the pack howls for Akela from the Council Rock. Mowgli howls with them, and so do you.',
        ),
        N(
          'Your Nubbin howls too. For once it does not sound like a kettle; it sounds like a wolf.',
        ),
        GB('He waited all those years. For you to need him. And then he got to be needed.', 'sad'),
        MG('He was the best of us. He was the Lone Wolf. He led us for a hundred years.'),
        GB('Not a hundred, little brother.', 'soft'),
        MG('It felt like a hundred.', 'sad'),
      ],
      [
        ask(
          5,
          'literacy',
          'theme: being remembered keeps someone with us',
          'RL.4.2',
          [
            N(
              'The whole pack howls for Akela, and Mowgli says he led them “for a hundred years”. Is being remembered a way of keeping someone with us? There is no one right answer.',
            ),
          ],
          [
            o('Yes. People live on in how we remember them.', [
              N(
                'That is a fair answer. The howl, the stories, and Mowgli’s words all keep Akela close.',
              ),
              N('It is why the Grove grows a flower on the hill for every Nubbin that fades.'),
            ]),
            o('No. Remembering is not the same as being here.', [
              N(
                'That is a fair answer. Nothing can be quite the same as having someone beside you.',
              ),
              N('Remembering is what we have left, and it does comfort many people.'),
            ]),
            o('Both: it does not bring them back, but it does help.', [
              N('That is a thoughtful answer. Both parts are true.'),
              N(
                'Mowgli says “a hundred years”, which is exaggeration, because it felt that long and meant so much.',
              ),
            ]),
          ],
          'Thought about whether being remembered is a way to keep someone with us after they have died.',
        ),
      ],
    ),
  ],
  [
    gl(
      'dhole',
      'A wild dog of Asia with a reddish coat that hunts in packs, and is now endangered.',
      'a24-14-plan',
    ),
    gl('gorge', 'A deep, narrow valley with steep rocky sides.', 'a24-14-plan'),
  ],
);

// ================================================================== A24-15 The Spring Running
const A15: EduQuest = quest(
  'a24-15',
  'The Spring Running',
  {
    'a24-15-s1': {
      goal: 'Find Mowgli, who has been unhappy all day.',
      hint: 'He is by the river, throwing stones in. Nobody else has time for him; it is spring.',
    },
    'a24-15-s2': {
      goal: 'Run north through the night with Mowgli and Grey Brother.',
      hint: 'Keep up as best you can. Watch for a light ahead.',
    },
  },
  [
    sc(
      'a24-15-spring',
      [
        N(
          'Mowgli is nearly seventeen. He is tall and strong, and he is the Master of the Jungle, and everyone knows it.',
        ),
        N(
          'Then spring comes, and all the jungle is busy with it, singing, nesting, running. Nobody has time for him.',
        ),
        MG(
          'I call and nobody comes. Even Bagheera has gone off somewhere. I feel sick. Not hungry sick. Just sick.',
          'sad',
        ),
        BG(
          'It is the spring, little brother. It does this. I will be back in a few days. I do not know why. I just will.',
          'think',
        ),
        N('He is gone. Mowgli throws a stone into the river, and another, and another.'),
        MG(
          'I have eaten good food. I have drunk good water. Why do I feel like this, guest? What is wrong with me?',
          'sad',
        ),
      ],
      [
        ask(
          5,
          'sel',
          'feeling something and not knowing why is allowed',
          'CASEL: Self-awareness',
          [
            N(
              'Mowgli feels strange and cannot say why. Is it all right to feel something big and not know the reason? There is no one right answer.',
            ),
          ],
          [
            o('Yes. Feelings do not always come with a reason.', [
              N(
                'That is a fair answer. Sometimes the body and heart change before the mind has words for it.',
              ),
              N('Growing up can feel like that, especially in spring.'),
            ]),
            o('No. There is always a reason if you look.', [
              N('That is a fair answer. Often there is, and it can help to look for it.'),
              N('But sometimes the reason is slow to appear, and that is allowed too.'),
            ]),
            o('Yes, and it helps to tell someone.', [
              N('That is a wise answer. Saying it out loud makes it a bit lighter.'),
              N('That is what Mowgli does when he asks you.'),
            ]),
          ],
          'Thought about big feelings that arrive without an obvious reason, and that it helps to say them out loud.',
        ),
      ],
      [
        ch('dunno', 'Tell him you do not know. But it happens to people.', [
          MG(
            'People. Not wolves. That is the answer, is it not? That is always the answer.',
            'sad',
          ),
        ]),
        ch('sit', 'Sit next to him and throw stones too.', [
          N(
            'You throw stones with him, and your Nubbin throws one backwards over its own head. Mowgli almost laughs.',
          ),
        ]),
      ],
    ),
    sc(
      'a24-15-spring-done',
      [
        MG(
          'I am going to run. All night, as far as I can. Maybe it will go away if I run.',
          'angry',
        ),
        GB(
          'I will come with you, little brother. Somebody has to. Keep the star that never moves in front of you. That is north.',
          'soft',
        ),
        N('Low over the northern hills, one star hangs steady while the others turn round it.'),
      ],
      [
        ask(
          2,
          'science',
          'the Pole Star shows north because it hardly moves in the night sky',
          '5-ESS1-2',
          [
            N(
              'Grey Brother says to keep the star that never moves in front of you. Which star shows travellers where north is?',
            ),
          ],
          [
            o(
              'The Pole Star, also called Polaris.',
              [
                N(
                  'Yes. The Earth spins around an axis that points almost straight at Polaris, so it seems to stand still.',
                ),
                N('All the other stars appear to circle round it during the night.'),
              ],
              true,
            ),
            o('The brightest star in the sky.', [
              N('The brightest star is not the Pole Star, and it moves as the night goes on.'),
              N(
                'Polaris is not especially bright. It simply sits almost exactly above the Earth’s North Pole.',
              ),
            ]),
            o('The Moon.', [
              N('The Moon is not a star, and it rises and sets.'),
              N('The Pole Star is the steady one that shows north.'),
            ]),
          ],
          'Learned that the Pole Star appears to stay still in the night sky and shows travellers where north is.',
        ),
      ],
    ),
    sc(
      'a24-15-lamp',
      [
        N(
          'You run all night, north, through jungle you have never seen, with Mowgli out in front and Grey Brother at your heel.',
        ),
        N('Your Nubbin rides on Grey Brother’s back for the last part, holding on with both paws.'),
        N(
          'Near dawn there is a light ahead, low down: a lamp in the window of a little hut at the edge of some fields.',
        ),
        N(
          'A woman comes to the door holding the lamp, with a little grey in her hair now. It is Messua.',
        ),
        ME(
          'Who is there? Who is it? There is nothing to steal here. Only me, and my baby.',
          'shock',
        ),
        MG('It is me. Messua. It is me.', 'soft'),
        ME(
          'Nathoo? No. Mowgli. Oh, my son, my son, how tall you are. Come in, come in, you are half starved.',
          'happy',
        ),
      ],
      [
        ask(
          6,
          'literacy',
          'why a character says one name then another: old hope and new knowledge',
          'RL.3.3',
          [
            N(
              'Messua says “Nathoo?” and then corrects herself: “No. Mowgli.” Why do you think she does that?',
            ),
          ],
          [
            o(
              'An old habit of hope, and then she sees who he really is.',
              [
                N('Yes. She missed Nathoo for so long that the name leaps out first.'),
                N('Then she says Mowgli, and loves him as himself. That is what makes it moving.'),
              ],
              true,
            ),
            o('She forgot his name.', [
              N('She did not forget. She corrects herself straight away.'),
              N('The first name is an old hope, and the second is the truth.'),
            ]),
            o('She is making a joke.', [
              N('It is a tender moment, not a joke.'),
              N('Her old hope for Nathoo comes out first, and then she sees Mowgli.'),
            ]),
          ],
          'Worked out why a character says one name and then corrects it: an old hope meeting the present truth.',
        ),
      ],
      [
        ch('follow', 'Follow Mowgli in.', [
          N('You follow him in. The hut smells of smoke and milk and baby.'),
        ]),
        ch('wait', 'Stay in the doorway and let them have this.', [
          N(
            'You stay in the doorway. Grey Brother lies down at your feet, and puts his chin on your boot.',
          ),
        ]),
      ],
    ),
    sc(
      'a24-15-lamp-done',
      [
        N(
          'Messua gives Mowgli milk and a round loaf of bread. She cuts it into four equal pieces, and he eats three of them.',
        ),
        N('Her husband died last year; she says it plainly, and does not cry.'),
        N('On a mat in the corner a baby sleeps, fat and brown, with one fist in the air.'),
      ],
      [
        ask(
          0,
          'maths',
          'unit fractions: a loaf cut into 4 equal pieces; 1 of 4 is left',
          '3.NF.A.1',
          [
            N(
              'Messua cuts the loaf into four equal pieces, and Mowgli eats three. What fraction of the loaf is left?',
            ),
          ],
          [
            o(
              'One quarter, or 1/4.',
              [
                N(
                  'Yes. Four equal parts make a whole. Three are eaten, so one part, 1/4, is left.',
                ),
                N('A quarter is one of four equal pieces.'),
              ],
              true,
            ),
            o('One half, or 1/2.', [
              N('A half would be two of four pieces.'),
              N('Only one piece is left: one quarter, 1/4.'),
            ]),
            o('Three quarters, or 3/4.', [
              N('Three quarters is how much Mowgli ate.'),
              N('What is left is the other piece: 1/4.'),
            ]),
          ],
          'Used unit fractions to find that one quarter of the loaf is left after three of four equal pieces are eaten.',
        ),
      ],
    ),
    sc(
      'a24-15-complete',
      [
        N(
          'Mowgli eats everything Messua gives him, and then, without meaning to, he falls asleep on her floor.',
        ),
        N(
          'She covers him with a blanket. She sits on a stool beside him all morning, mending, and does not wake him.',
        ),
        N(
          'Grey Brother lies outside the door, and your Nubbin lies down with him. You sit on the step in the sun.',
        ),
      ],
      [
        notice(
          2,
          'sel',
          'being near someone is enough: you do not always need words',
          'CASEL: Relationship skills',
          [
            ME(
              'He does not need me to say anything. He only needs to wake up and find someone still here.',
              'soft',
            ),
            ME('Sitting quietly beside a person is a very old way of saying you care.'),
          ],
          'Heard that sitting quietly beside someone is a way of showing care, even without words.',
        ),
      ],
    ),
  ],
  [
    gl(
      'nesting',
      'Building a nest, or sitting in one, to lay eggs and raise baby birds.',
      'a24-15-spring',
    ),
    gl(
      'mending',
      'Repairing something that is torn or broken, such as clothes.',
      'a24-15-complete',
    ),
  ],
);

// ================================================================== A24-16 Man Goes to Man
const A16: EduQuest = quest(
  'a24-16',
  'The Spring Running',
  {
    'a24-16-s1': {
      goal: 'Go back with Mowgli to the Council Rock.',
      hint: 'Baloo and Kaa are waiting. They know already.',
    },
    'a24-16-s2': {
      goal: 'Wait at the Council Rock for Bagheera.',
      hint: 'He will come. Panthers are always last, and always on purpose.',
    },
    'a24-16-s3': {
      goal: 'Do what Mowgli asked of you.',
      hint: 'He asked you one thing. Do that.',
    },
  },
  [
    sc(
      'a24-16-rock',
      [
        N(
          'You come back to the Council Rock in the grey before dawn. Baloo is there, very old now and almost blind.',
        ),
        N(
          'Kaa is coiled round the rock, three times, the way he lies when he means to stay a while.',
        ),
        BL(
          'Cub. You have come to tell us something. Do not bother. We know. We have known since spring.',
          'soft',
        ),
        MG('I do not want to go. But I want to go. Both. I do not understand it.', 'sad'),
        KA(
          'Changing your skin. I have done it many times, and it never gets easier. It itches, and then it fits.',
          'think',
        ),
        KA('People belong with people in the end. But the jungle will always be your home too.'),
        BL(
          'Make your own trail, cub. Make your own lair. Find your own people. We will still be here. In a way.',
          'soft',
        ),
      ],
      [
        ask(
          4,
          'literacy',
          'a metaphor for growing up: changing your skin',
          'L.4.5',
          [
            N(
              'Kaa says growing up is like changing your skin: it itches, and then it fits. Is that a good comparison? There is no one right answer.',
            ),
          ],
          [
            o('Yes. Growing up is uncomfortable, then you settle.', [
              N('That is a fair answer. Kaa is saying the itchy part is real, and it passes.'),
              N('A good metaphor makes a hard feeling easier to talk about.'),
            ]),
            o('No. A snake’s skin is nothing like a boy’s life.', [
              N('That is a fair answer. Comparisons are never perfect.'),
              N(
                'Even so, Kaa chose it to show that a big change can feel odd before it feels right.',
              ),
            ]),
            o('It is good, but growing up is more than itching.', [
              N('That is a thoughtful answer. The metaphor is a small window on a big thing.'),
              N(
                'Mowgli feels sad, excited and confused all at once, and the skin comparison covers only part of that.',
              ),
            ]),
          ],
          'Thought about a metaphor, whether it fits, and what a comparison can and cannot show about growing up.',
        ),
      ],
      [
        ch('baloo', 'Go and sit by Baloo.', [
          BL(
            'Is that the guest? Your voice has changed. You used to say the Words like a frightened bird.',
            'happy',
          ),
        ]),
        ch('kaa', 'Thank Kaa for the Cold Lairs.', [
          KA('It was nothing. A dance. A wall. I enjoyed the wall.', 'happy'),
        ]),
      ],
    ),
    sc(
      'a24-16-rock-done',
      [
        MG('Where is Bagheera? I cannot go without Bagheera.', 'sad'),
        N('Far off down the hill, something is moving through the bushes. Then it stops.'),
        BL(
          'He is coming. A panther who wants to be silent makes no sound at all. If you can hear him, he wants us to.',
        ),
      ],
      [
        ask(
          2,
          'science',
          'cats walk quietly on soft paw pads',
          '4-LS1-1',
          [
            N(
              'Leopards and panthers can move without a sound. What helps a cat creep up so quietly?',
            ),
          ],
          [
            o(
              'Soft pads on the bottoms of their paws.',
              [
                N(
                  'Yes. The pads cushion each step, and the claws fold back so they do not click on the ground.',
                ),
                N('That is why a leopard can walk right by without being heard.'),
              ],
              true,
            ),
            o('Very small feet.', [
              N('A leopard’s paws are quite big.'),
              N('The quiet comes from the soft pads underneath, with the claws held in.'),
            ]),
            o('They float just above the ground.', [
              N('That would be even quieter. But no cat can float.'),
              N('It is the soft pads that muffle each step.'),
            ]),
          ],
          'Learned that cats move quietly because soft paw pads cushion each step and their claws fold away.',
        ),
      ],
    ),
    sc(
      'a24-16-bagheera',
      [
        N(
          'Bagheera comes up the hill at a trot, breathing hard, with the morning sun on his black coat.',
        ),
        BG(
          'I have killed a bull in the valley, young and fat. I paid for you with a bull, cub, at the beginning.',
          'think',
        ),
        BG('Now I have paid it again, and the debt is all square. So you go free, owing nobody.'),
        MG('Bagheera. I will come back and see you.', 'sad'),
        BG(
          'Do not come back for us. Come back for yourself, if you ever need to, and we will know.',
          'soft',
        ),
        N(
          'He licks Mowgli’s feet, once, the way the panthers do it. Then he turns away down the hill.',
        ),
        N('At the bottom he looks back.'),
        BG('Good luck on your new road. Never forget that Bagheera loved you.', 'soft'),
        N(
          'And he is gone into the trees. Mowgli stands with his hands open, the way you do when you have dropped something.',
        ),
        MG(
          'Guest, you were in the cave the first night. Say the Words with me, one more time.',
          'sad',
        ),
        N('So you say them, the two of you, standing on the Council Rock in the early sun.'),
        Y('You and I are family, all of us, under the same sky.'),
      ],
      [
        ask(
          7,
          'sel',
          'saying goodbye honestly and kindly',
          'CASEL: Relationship skills',
          [
            N(
              'Bagheera says goodbye, even though it clearly hurts. What is a kind way to say goodbye to someone you love?',
            ),
          ],
          [
            o(
              'Say what you feel, be honest, and wish them well.',
              [
                N(
                  'Yes. Bagheera says he loved Mowgli, and wishes him luck. That is honest and kind.',
                ),
                N('A clear goodbye can be easier to carry than one that stays unsaid.'),
              ],
              true,
            ),
            o('Slip away without saying anything.', [
              N('It can feel easier. But the other person is left wondering.'),
              N('Saying goodbye, even a short one, helps both of you.'),
            ]),
            o('Pretend you do not care.', [
              N('That might feel safer at the time. But it hides the love.'),
              N('Bagheera shows it: say what you feel, and wish them well.'),
            ]),
          ],
          'Practised thinking about how to say goodbye honestly and kindly, as Bagheera does.',
        ),
      ],
    ),
    sc(
      'a24-16-bagheera-done',
      [
        N('Mowgli looks at you for a long time. Then he puts his hand on your Nubbin’s head.'),
        MG(
          'I was one winter old when Bagheera bought me with a bull. I will be seventeen this summer.',
          'soft',
        ),
        MG('Will you walk the first mile with me? Just the first. Then you go home, and I go on.'),
      ],
      [
        ask(
          1,
          'maths',
          'subtraction: 17 − 1 = 16 years',
          '2.OA.A.1',
          [
            N(
              'Mowgli was one year old when Bagheera bought him, and he will be seventeen this summer. How many years have passed?',
            ),
          ],
          [
            o(
              '16 years.',
              [
                N('Yes: 17 − 1 = 16. Count on from 1 up to 17, and it is 16 steps.'),
                N('That is a lot of seasons with the pack.'),
              ],
              true,
            ),
            o('18 years.', [
              N('That is 17 + 1. But we want the gap between the two ages.'),
              N('Take 1 away from 17: 16.'),
            ]),
            o('17 years.', [
              N('He is 17 now, but he was already 1 at the start.'),
              N('So the time between is 17 − 1 = 16 years.'),
            ]),
          ],
          'Subtracted 1 from 17 to find the number of years between two ages (16).',
        ),
      ],
    ),
    sc(
      'a24-16-trail',
      [
        N(
          'You walk the first mile with Mowgli, down off the hills, north, towards the villages where men live.',
        ),
        N(
          'Grey Brother and the three other wolves run beside you, very quiet, ears down. They are going with him.',
        ),
        GB(
          'The jungle is not shut. We will be his four brothers, wherever he lives. There is no law that says we cannot.',
          'happy',
        ),
        N(
          'Your Nubbin trots in the middle of the four wolves, as if it were going too. It has never doubted it is a wolf.',
        ),
        MG('Here. This is the mile. The stone with the moss on.', 'soft'),
        N(
          'You stop at the mossy stone. Mowgli does not make a speech; he just looks at you, and at your Nubbin, and nods.',
        ),
      ],
      [
        ask(
          4,
          'social-studies',
          'landmarks help us give and follow directions',
          'D2.Geo.2.K-2',
          [
            N(
              'Mowgli says the first mile ends at “the stone with the moss on”. Why are landmarks like that useful when you are giving directions?',
            ),
          ],
          [
            o(
              'They are things you can see and recognise along the way.',
              [
                N('Yes. A landmark tells you where you are, and when you have arrived.'),
                N('Maps use landmarks too: a hill, a river, a bridge, a mossy stone.'),
              ],
              true,
            ),
            o('They make the road longer.', [
              N('A landmark does not change the distance.'),
              N('It helps you recognise where you are along the way.'),
            ]),
            o('Only grown-ups can see them.', [
              N('Anyone can spot a landmark, and children are often best at it.'),
              N('They are things we can all see and recognise.'),
            ]),
          ],
          'Learned that landmarks are visible things that help us give and follow directions.',
        ),
      ],
      [
        ch('hunting', 'Tell him: safe travels.', [
          MG('Safe travels, guest. Safe travels, little wolf.', 'happy'),
        ]),
        ch('hug', 'Hug him.', [
          N(
            'He does not know what to do with a hug, so he does it the wolf way, and pushes his head against your shoulder.',
          ),
        ]),
      ],
    ),
    sc(
      'a24-16-trail-done',
      [
        N(
          'He walks on up the trail with the four wolves round him, and does not look back. That is how you know he will be all right.',
        ),
        N(
          'Your Nubbin watches them go until they are dots. Then it sits down on the mossy stone, and you sit with it.',
        ),
        N(
          'The wolves will find their way by nose. A wolf’s sense of smell is many times better than ours.',
        ),
      ],
      [
        ask(
          2,
          'science',
          'a wolf’s sense of smell is far keener than a human’s',
          '4-LS1-2',
          [
            N(
              'The four wolves follow the trail by nose. How does a wolf’s sense of smell compare with ours?',
            ),
          ],
          [
            o(
              'It is many times better.',
              [
                N(
                  'Yes. A wolf can smell things a long way off, and can tell who walked a trail, and when.',
                ),
                N('That is why wolves are such good trackers.'),
              ],
              true,
            ),
            o('About the same.', [
              N('A wolf’s nose is far more powerful than ours.'),
              N('It can smell things we would never notice.'),
            ]),
            o('Worse. Wolves mostly use their eyes.', [
              N('Eyesight matters, but a wolf’s nose is its strongest tool.'),
              N('It is many times keener than ours.'),
            ]),
          ],
          'Learned that a wolf’s sense of smell is many times keener than a human’s, which helps it follow trails.',
        ),
      ],
    ),
    sc(
      'a24-16-complete',
      [
        N(
          'The last thing you see is the trail going north in the sun, and four grey shapes and a boy going up it.',
        ),
        N('Far behind you the Council Rock sits in the morning sun, empty, and it does not mind.'),
        N('Your Nubbin looks back at it once, the way a wolf does, and then trots on.'),
        N(
          'The page goes soft at the edges, like a cave mouth at dusk. Then it is your own kitchen, and the atlas open on the table.',
        ),
        N(
          'Tucked into the back of the page is a plank, carved by somebody with a knife and a lot of patience.',
        ),
      ],
      [
        notice(
          2,
          'sel',
          'you can belong in more than one place at once',
          'CASEL: Social awareness',
          [
            N(
              'Mowgli goes to live among people, and the jungle is still home to him. Both can be true.',
            ),
            N(
              'The plank says we all belong together, under the same sky. You can belong in more than one place, and love more than one home.',
            ),
          ],
          'Heard that a person can belong in more than one place and have more than one home.',
        ),
      ],
    ),
  ],
  [
    gl('debt', 'Something you owe to someone else, such as money or a favour.', 'a24-16-bagheera'),
    gl('lair', 'The den or home of a wild animal.', 'a24-16-rock'),
  ],
);

// ================================================================== A24-17 The White Seal
const A17: EduQuest = quest(
  'a24-17',
  'The White Seal',
  {
    'a24-17-s1': {
      goal: 'Turn the page, and step onto the seals’ beach in the north.',
      hint: 'Keep to the rocks at the top of the beach. The bulls are busy, and very large.',
    },
    'a24-17-s2': {
      goal: 'Paddle in the surf while Kotick learns to swim.',
      hint: 'Stay in the shallows. The big waves are for seals, not for guests.',
    },
    'a24-17-s3': {
      goal: 'Follow Kotick inland, and turn back with him.',
      hint: 'Stay with Kotick. When he turns away, turn with him.',
    },
  },
  [
    sc(
      'a24-17-beach',
      [
        N(
          'The jungle page has a last leaf folded into it. You open it, and the air goes cold and smells of salt and fish.',
        ),
        N(
          'These are the Pribilof Islands in the Bering Sea, off Alaska. They are the home of Unangax̂ families, some of whom were brought here long ago to work the seal harvest.',
        ),
        N(
          'Below you is a beach called Novastoshnah, roaring from end to end with seals: thousands and thousands of them.',
        ),
        N(
          'The big bulls are shoving each other for places on the rocks, chest to chest, bellowing. Nobody gets hurt; everybody gets loud.',
        ),
        SC(
          'Out of my place! Out! I was here last year, and the year before! This is my rock, and I am keeping it!',
          'angry',
        ),
        N(
          'A big grey bull with a scarred neck wins his rock, and flops down on it, very pleased with himself. That is Sea Catch.',
        ),
        MK(
          'You are late. You are always late. And you have been fighting again. Look at your neck.',
          'think',
        ),
        N(
          'That is Matkah, his wife: smaller, soft-eyed, sensible. Beside her, in the shelter of the rock, is something new.',
        ),
        MK('Oh, look! Our baby is white! White as sea-foam!', 'shock'),
        SC('Nonsense. There has never been such a thing as a white seal.', 'think'),
        MK('I cannot help that. There is one now.'),
      ],
      [
        ask(
          2,
          'social-studies',
          'locating the Bering Sea and the Pribilof Islands on a map',
          'D2.Geo.2.K-2',
          [
            N(
              'Nova’s page says the Pribilof Islands are in the Bering Sea. Which two lands does the Bering Sea lie between?',
            ),
          ],
          [
            o(
              'Alaska and Siberia (Russia).',
              [
                N(
                  'Yes. The Bering Sea is the cold, stormy water between Alaska, in North America, and Siberia, in Russia.',
                ),
                N('It is named after Vitus Bering, an explorer who sailed there in the 1700s.'),
              ],
              true,
            ),
            o('Australia and India.', [
              N('Those lands are far to the south, in warm seas.'),
              N('The Bering Sea is far north, between Alaska and Siberia.'),
            ]),
            o('Spain and Brazil.', [
              N('Those are across the Atlantic Ocean, far from here.'),
              N('The Bering Sea is in the far north, between Alaska and Siberia.'),
            ]),
          ],
          'Located the Bering Sea between Alaska and Siberia, and learned about the Pribilof Islands as a seal breeding ground and Unangax̂ homeland.',
        ),
      ],
      [
        ch('look', 'Creep closer to look at the pup.', [
          N(
            'He is pale as sea-foam, all over, with soft blue eyes. Everyone else on the beach is dark grey.',
          ),
        ]),
        ch('nubbin', 'Keep your Nubbin back from the shoving bulls.', [
          N(
            'A bull the size of a wardrobe flops past. Your Nubbin hides behind your legs and peeks round them.',
          ),
        ]),
      ],
    ),
    sc(
      'a24-17-beach-done',
      [
        N(
          'They name the pup Kotick. He crawls up to your Nubbin, nose to nose, and they look at each other for a long while.',
        ),
        N(
          'Then your Nubbin, who believes it is a wolf, decides on the spot that it is a seal as well.',
        ),
        N(
          'Most northern fur seal pups are born dark, nearly black. A white one like Kotick is very rare.',
        ),
      ],
      [
        ask(
          2,
          'science',
          'variation: animals of one kind can look different from each other',
          '3-LS3-1',
          [
            N(
              'Kotick is white, and all the other pups are dark. What do we call the small differences between animals of the same kind?',
            ),
          ],
          [
            o(
              'Variation.',
              [
                N('Yes. Variation is why no two animals of a kind are exactly alike.'),
                N(
                  'Sometimes it makes an animal stand out, like Kotick, and sometimes it helps an animal survive.',
                ),
              ],
              true,
            ),
            o('Disguise.', [
              N('Disguise is when an animal hides on purpose.'),
              N('The word you want is variation: natural differences between members of a kind.'),
            ]),
            o('A mistake.', [
              N('Nature does not make mistakes in that sense.'),
              N('Differences between animals of one kind are called variation.'),
            ]),
          ],
          'Learned that variation means the natural differences between animals of the same kind, such as a rare white seal pup.',
        ),
      ],
    ),
    sc(
      'a24-17-surf',
      [
        N(
          'Seal pups cannot swim when they are born. They have to learn, and it is a struggle, and Kotick is no different.',
        ),
        MK(
          'In you go. The waves will lift you. Do not fight them. Ride them. That is all swimming is.',
          'happy',
        ),
        N(
          'Kotick goes in, and a wave picks him up and puts him back on the beach upside down. He tries again.',
        ),
        N(
          'You wade in up to your knees with your Nubbin in your arms. The water is so cold it makes your teeth ache.',
        ),
        N(
          'Your Nubbin wriggles out of your arms and paddles beside Kotick, doggedly, the way it does everything.',
        ),
        KO(
          'I did it! I am swimming! Look, Mother! Look at the little round one, it is swimming too!',
          'happy',
        ),
        N(
          'Kotick was born in July. By October he swims like a seal born to it, which he is. Then the whole herd turns south, out to the open sea.',
        ),
        N(
          'When they come back the next summer, Kotick is a year older, and still as white as foam.',
        ),
      ],
      [
        ask(
          6,
          'maths',
          'time intervals in months: July to October is 3 months',
          '3.MD.A.1',
          [N('Kotick was born in July and swims well by October. How many months is that?')],
          [
            o(
              '3 months.',
              [
                N('Yes. July to August is 1, to September is 2, to October is 3.'),
                N('Counting on month by month is a handy way to find a time interval.'),
              ],
              true,
            ),
            o('4 months.', [
              N(
                'Counting July itself, you would get 4. But July to October is the gap between them.',
              ),
              N('August, September, October: 3 months have passed.'),
            ]),
            o('1 month.', [
              N('One month after July is only August.'),
              N('Count on: August, September, October. That is 3 months.'),
            ]),
          ],
          'Counted on to find a time interval of 3 months from July to October.',
        ),
      ],
      [
        ch('cheer', 'Cheer for Kotick from the shallows.', [
          N(
            'Kotick does a roll in the water, showing off, and swallows a mouthful of sea. He comes up spluttering and pleased.',
          ),
        ]),
        ch('warm', 'Wrap your Nubbin in your coat after.', [
          N(
            'It shivers inside your coat for a while, and then falls asleep, smelling strongly of seaweed.',
          ),
        ]),
      ],
    ),
    sc(
      'a24-17-surf-done',
      [
        KO(
          'There are the young ones going inland. The bachelors. Where do they go? I am going to see.',
          'think',
        ),
        N(
          'The wind off the sea is sharp and wet, and the salt stings your lips. The beach roars behind you.',
        ),
        N('You follow him up the beach. You wish, already, that you had not.'),
      ],
      [
        ask(
          1,
          'literacy',
          'words that show senses: sharp, wet, stings',
          'RL.1.4',
          [
            N(
              'The page says the wind is “sharp and wet” and the salt “stings your lips”. Which senses do those words show?',
            ),
          ],
          [
            o(
              'Touch and taste: how things feel and how salt tastes.',
              [
                N('Yes. Sharp, wet and stings make the cold wind feel real to a reader.'),
                N('Good writers use words for the senses so you feel as if you are there.'),
              ],
              true,
            ),
            o('Only sight.', [
              N('Some of the words could be seen. But sharp, wet and stings are about feeling.'),
              N('They show touch and taste.'),
            ]),
            o('Hearing.', [
              N('The beach roars, true, and that is hearing.'),
              N('These words show touch and taste.'),
            ]),
          ],
          'Identified sense words, such as sharp, wet and stings, that help a reader feel what a character feels.',
        ),
      ],
    ),
    sc(
      'a24-17-drove',
      [
        N(
          'Men from the village are walking a herd of young seals slowly inland, away from the sea, with long sticks.',
        ),
        N(
          'The men work quietly, at a job they were made to do, for a company far away. They are not villains; they are workers.',
        ),
        N(
          'Kotick follows at the back, curious. Then he understands what happens to the young seals at the end of the walk.',
        ),
        N(
          'He turns away. You turn with him, and put your hand over your Nubbin’s eyes, and the page turns too.',
        ),
        KO(
          'They do not come back. None of them come back. Every summer. Mother, every summer?',
          'shock',
        ),
        MK(
          'Every summer. It has been so since before your grandfather’s grandfather. There is nothing to be done.',
          'sad',
        ),
        KO(
          'Then I will find somewhere else. A beach where men cannot come. There must be one, somewhere in the sea.',
          'angry',
        ),
        SE(
          'Find a beach where men cannot come? Listen to the white one. Go and catch the moon while you are at it.',
          'happy',
        ),
      ],
      [
        ask(
          3,
          'sel',
          'facing a hard truth: is it better to know?',
          'CASEL: Self-awareness',
          [
            N(
              'Kotick finds out something very sad. Is it better to know a hard truth, or not to know it? There is no one right answer.',
            ),
          ],
          [
            o('Better to know. You cannot change what you do not know about.', [
              N(
                'That is a fair answer. Knowing is the first step to doing something, as Kotick shows.',
              ),
              N('It still hurts. You can feel both.'),
            ]),
            o('Better not to know. It only makes you sad.', [
              N(
                'That is a fair answer. Hard truths hurt, and wishing not to know is a very human wish.',
              ),
              N(
                'But Kotick says he will look for another beach, and he can only do that because he knows.',
              ),
            ]),
            o('Better to know, with someone beside you.', [
              N('That is a wise answer. A hard thing is easier to carry with company.'),
              N('That is why you sit with Kotick on the cold beach.'),
            ]),
          ],
          'Thought about whether it is better to know a hard truth, and how company helps when we learn something sad.',
        ),
      ],
      [
        ch('believe', 'Tell Kotick you believe him.', [
          KO(
            'Do you? You are the first. Well, second. Your little round one looked like it did.',
            'soft',
          ),
        ]),
        ch('sit', 'Sit down next to him on the cold beach, and wait.', [
          N(
            'You sit beside him. After a while he stops shaking, and looks out at the sea instead of inland.',
          ),
        ]),
      ],
    ),
    sc(
      'a24-17-drove-done',
      [
        KO(
          'I am going to look. Every summer, every winter, until I find it. And then I will bring them all.',
          'angry',
        ),
        N(
          'Your Nubbin sits up beside him on the beach and looks out to sea too, as if it means to help.',
        ),
        N(
          'Northern fur seals were once hunted so much that they nearly vanished. In 1911 several countries signed a treaty to protect them.',
        ),
      ],
      [
        ask(
          2,
          'social-studies',
          'why countries make agreements to protect animals that cross borders',
          'D2.Civ.8.K-2',
          [
            N(
              'Fur seals swim across the whole North Pacific. Why would countries need to agree together to protect them?',
            ),
          ],
          [
            o(
              'The seals cross borders, so one country alone cannot protect them.',
              [
                N(
                  'Yes. Seals do not stop at borders, so many countries must agree on the same rules.',
                ),
                N(
                  'Today people on the islands, including Unangax̂ communities, also help look after the seals and their home.',
                ),
              ],
              true,
            ),
            o('So the seals can sign it too.', [
              N('Ha. Seals cannot sign. People make the agreement on their behalf.'),
              N('It is needed because the seals swim across many countries’ waters.'),
            ]),
            o('It does not matter. They can look after themselves.', [
              N('Seals had a very hard time when hunting went unchecked.'),
              N('Countries agree together because seals cross borders.'),
            ]),
          ],
          'Learned that countries make shared agreements to protect animals, such as fur seals, that travel across borders.',
        ),
      ],
    ),
    sc(
      'a24-17-complete',
      [
        N(
          'That night Kotick swims out past the end of the beach and keeps going, a white speck in the dark water.',
        ),
        MK(
          'He will not find it. There is not one. But he is white, and different, and he will not be told.',
          'sad',
        ),
        SC('He gets that from me.'),
        MK('He gets it from both of us. Go to sleep.', 'soft'),
        N(
          'Northern fur seals really do travel thousands of kilometres each year, out to the open ocean and back to their beaches.',
        ),
      ],
      [
        ask(
          3,
          'science',
          'migration: animals travel far for food and to breed',
          '3-LS4-3',
          [
            N(
              'Real fur seals leave their beaches each autumn and swim thousands of kilometres. Why do they make such a long trip?',
            ),
          ],
          [
            o(
              'To find food in the open ocean, then return to breed on the beaches.',
              [
                N('Yes. This long seasonal journey is called migration.'),
                N(
                  'Many animals do it, from whales to birds, to follow food and find a safe place for their young.',
                ),
              ],
              true,
            ),
            o('Because they are lost.', [
              N('They are not lost. They know exactly where to go.'),
              N('They migrate to find food and to breed.'),
            ]),
            o('To get away from the cold.', [
              N('They are built for the cold, with thick fur and blubber.'),
              N('They migrate to find food, and come back to breed.'),
            ]),
          ],
          'Learned that migration is a long seasonal journey animals make to find food and breed in safe places.',
        ),
      ],
    ),
  ],
  [
    gl('harvest', 'The gathering of a crop, or of animals, for people to use.', 'a24-17-beach'),
    gl(
      'bachelors',
      'In the seal story, the young male seals that have no place of their own yet.',
      'a24-17-surf-done',
    ),
  ],
);

// ================================================================== A24-18 Where No Man Comes
const A18: EduQuest = quest(
  'a24-18',
  'The Hidden Beaches',
  {
    'a24-18-s1': {
      goal: 'Search the northern sea with Kotick for a safe beach.',
      hint: 'Ask everyone. The old sea lion first. Mind the walrus; he is grumpy.',
    },
    'a24-18-s2': {
      goal: 'Follow the Sea Cows through the dark water with Kotick.',
      hint: 'Stay close behind Kotick. The page lets you breathe; it is that kind of page.',
    },
    'a24-18-s3': {
      goal: 'Go home with Kotick, and watch him bring the seals.',
      hint: 'Stay at the top of the beach. This is shoving, not fighting, and nobody gets hurt.',
    },
  },
  [
    sc(
      'a24-18-search',
      [
        N(
          'Kotick searches for five years. The page carries you along with him, from island to island, through fog and ice.',
        ),
        KO(
          'Old sea lion! You know everything. Is there a beach in the sea where men never come?',
          'think',
        ),
        SL(
          'Never heard of one. Men come everywhere, sooner or later. Ask Sea Vitch. He is older than me, and ruder.',
        ),
        N(
          'Sea Vitch the walrus is asleep on a rock, enormous, whiskery, with tusks like two old yellow candles.',
        ),
        SV(
          'What? Who? Go away. I was asleep. I am always asleep. What kind of a seal is white, anyway? Shoo.',
          'angry',
        ),
        KO('You fat old clam-cracker! I only asked you a question!', 'angry'),
        N('The gulls on the rocks above hear that, and love it. They have never liked Sea Vitch.'),
        GU('Clam-cracker! Clam-cracker! Sea Vitch is a clam-cracker! Clam-crack-crack!', 'happy'),
        SV(
          'Hrrmph. Ask the Sea Cows, then, and leave me in peace. If they are still alive. Nobody has seen them for years.',
        ),
      ],
      [
        ask(
          5,
          'literacy',
          'compound words: clam-cracker is two words joined to make a new one',
          'L.3.4',
          [
            N(
              'Kotick calls Sea Vitch a “clam-cracker”, and the gulls love it. That is a compound word, two words joined into one. What does it mean?',
            ),
          ],
          [
            o(
              'Someone who cracks clams open.',
              [
                N(
                  'Yes. Clam plus cracker: a walrus really does eat clams from the sea floor, so the name fits.',
                ),
                N(
                  'Compound words, like sunshine or notebook, are made by joining two words and combining their meanings.',
                ),
              ],
              true,
            ),
            o('A cracker made out of clams.', [
              N('That is a funny picture, and you can see how the words might mean that.'),
              N(
                'But here a cracker is someone who cracks things open, so a clam-cracker cracks clams.',
              ),
            ]),
            o('A crack in a clam.', [
              N('Good try: both words are in there.'),
              N(
                'In this name the second word is the one who does the cracking: a walrus cracking clams.',
              ),
            ]),
          ],
          'Worked out the meaning of the compound word clam-cracker from its two parts.',
        ),
      ],
      [
        ch('sorry', 'Apologise to Sea Vitch for the noise.', [
          SV(
            'Hm. Manners. From a land-thing. The world is full of surprises. Still go away.',
            'think',
          ),
        ]),
        ch('gulls', 'Shoo the gulls away.', [
          N(
            'The gulls rise up shrieking, and settle again two feet away, and start again. Gulls are like that.',
          ),
        ]),
      ],
    ),
    sc(
      'a24-18-search-done',
      [
        KO(
          'The Sea Cows. I have never even seen one. Nobody has. Everyone says they are a story.',
          'think',
        ),
        N(
          'Five years go by: five summers on the beaches, and five winters out at sea. Kotick grows big and strong, and stays as white as the first day.',
        ),
        N('Every summer he tries a new coast, and every summer he comes home without it.'),
      ],
      [
        ask(
          1,
          'maths',
          'multiplying: 5 years of 12 months is 60 months',
          '3.OA.A.3',
          [
            N(
              'Kotick searched for 5 years, and every year has 12 months. How many months did he search?',
            ),
          ],
          [
            o(
              '60 months.',
              [
                N('Yes: 5 × 12 = 60. Split it up: 5 × 10 = 50, and 5 × 2 = 10, so 50 + 10 = 60.'),
                N('It is a long time to keep looking for something nobody believes in.'),
              ],
              true,
            ),
            o('17 months.', [
              N('That is 5 + 12. But there are 12 months in each of the 5 years.'),
              N('So we multiply: 5 × 12 = 60.'),
            ]),
            o('50 months.', [
              N('That would be 5 × 10. Each year has 12 months, not 10.'),
              N('5 × 12 = 60.'),
            ]),
          ],
          'Multiplied 5 × 12 = 60 to turn years into months, splitting 12 into 10 and 2.',
        ),
      ],
    ),
    sc(
      'a24-18-cows',
      [
        N(
          'At the end of the fifth winter, far to the west, Kotick finds them: huge, slow, dark shapes grazing on the kelp.',
        ),
        N(
          'Sea Cows. Bigger than walruses, quieter than fish, with small heads and soft lips, moving very slowly.',
        ),
        KO(
          'Hello? Excuse me? I am looking for a beach. A safe one. Where men do not come. Please.',
          'think',
        ),
        N(
          'The Sea Cows say nothing; they cannot, or they will not. They only chew the kelp, and look at him.',
        ),
        N(
          'Then, very slowly, they begin to move north, along the coast. Kotick follows, and you follow Kotick.',
        ),
        N(
          'At last they dive, and swim into a black opening in the cliff, deep under the water. A tunnel.',
        ),
        N(
          'You hold your breath and your Nubbin and go in after them. The atlas is a kind page here; your breath lasts.',
        ),
        N(
          'Then light ahead, green and gold. You come up into a quiet bay, with long smooth beaches all round it.',
        ),
      ],
      [
        ask(
          1,
          'science',
          'Steller’s sea cow was hunted until it was gone; its relatives are protected today',
          '3-LS4-4',
          [
            N(
              'In this story the Sea Cows are alive. In real life, Steller’s sea cow was found in 1741 and gone by 1768. What happened?',
            ),
          ],
          [
            o(
              'Hunters took them all, because they were slow and easy to catch.',
              [
                N(
                  'Yes. They died out in less than thirty years. When the last one died, there were no more, and nobody can bring them back.',
                ),
                N(
                  'That is sad. Their cousins, manatees and dugongs, are protected now, and we can look after the animals that are still here.',
                ),
              ],
              true,
            ),
            o('They swam away to a warmer sea.', [
              N('They did not. They lived only around a few cold islands.'),
              N('People hunted them until none were left.'),
            ]),
            o('They are still alive, hidden somewhere.', [
              N(
                'Scientists have searched for a very long time. Steller’s sea cow is gone for ever.',
              ),
              N(
                'People hunted them until none were left, which is why we protect their cousins now.',
              ),
            ]),
          ],
          'Learned plainly that Steller’s sea cow died out in the 1700s because it was hunted, and that its relatives are protected today.',
        ),
      ],
      [
        ch('look', 'Look round the bay.', [
          N(
            'There are beaches sheltered from the wind, with cliffs on every side and no paths down. Nobody has ever walked here.',
          ),
        ]),
        ch('thank', 'Turn and thank the Sea Cows.', [
          N(
            'They are already going, slow and silent, back into the dark of the tunnel. One of them looks back, once.',
          ),
        ]),
      ],
    ),
    sc(
      'a24-18-cows-done',
      [
        KO(
          'This is it. This is it. Men cannot come here. Nobody can, unless they are a seal, and swim under the cliffs.',
          'happy',
        ),
        N(
          'Kotick hauls out on the beach and lies there, breathing, in the sun. Your Nubbin lies down beside him.',
        ),
        N('The Sea Cows never spoke a single word, and yet they led him all the way here.'),
      ],
      [
        ask(
          2,
          'literacy',
          'what characters do can say more than what they say',
          'RL.3.3',
          [
            N(
              'The Sea Cows never say anything, but they help Kotick more than anyone. What does that show?',
            ),
          ],
          [
            o(
              'What a character does can tell us more than what they say.',
              [
                N(
                  'Yes. A character’s actions show who they are, and often more truly than their words.',
                ),
                N('Good readers watch what characters do, not only what they say.'),
              ],
              true,
            ),
            o('Silent characters are not important.', [
              N('The Sea Cows are the most important characters in this whole quest.'),
              N('Their actions tell us what they are like.'),
            ]),
            o('The Sea Cows are shy.', [
              N('They may be. But look at what they do: they guide him all the way.'),
              N('Actions can show more than words.'),
            ]),
          ],
          'Learned that a character’s actions can reveal more about them than their words.',
        ),
      ],
    ),
    sc(
      'a24-18-home',
      [
        N(
          'Kotick swims all the way home to Novastoshnah and tells the seals about the hidden beaches.',
        ),
        N('They laugh at him, of course: a white seal, with his head full of stories.'),
        SE(
          'Hidden beaches! Go and lie in the sun, white one, and stop bothering your elders.',
          'happy',
        ),
        N(
          'So Kotick, who has grown big and strong in five years of searching, puts his chest against the biggest bull’s chest.',
        ),
        N(
          'And he shoves, and roars, and shoves again, all along the beach, until every bull who laughed has been pushed into the sea.',
        ),
        SC(
          'That is my son! That is my son! Come on, then, who is next? Who else says there are no beaches?',
          'happy',
        ),
        N(
          'Sea Catch joins in, shoving with his scarred old neck and shouting for joy. Nobody bleeds, but everybody is very wet.',
        ),
        KO('I am going to the new beaches! Who is coming with me?', 'angry'),
      ],
      [
        ask(
          7,
          'sel',
          'persuading or pushing: is making people do what you think is best the same as helping them?',
          'CASEL: Responsible decision-making',
          [
            N(
              'Kotick shoves the bulls until they follow. Is making people do what you think is best the same as helping them? There is no one right answer.',
            ),
          ],
          [
            o('No. Helping is when people choose for themselves.', [
              N(
                'That is a fair answer. Kotick’s way is rough, and the seals do choose to follow in the end.',
              ),
              N('Many people think the best way to change a mind is to listen and explain.'),
            ]),
            o('Yes, if it saves them from harm.', [
              N('That is a fair answer. Kotick is trying to save the seals from the hunt.'),
              N(
                'But he does it by shoving, which makes it hard to tell whether they follow because they agree or because they are pushed.',
              ),
            ]),
            o('It depends how much harm is at stake, and whether it is only a shove.', [
              N(
                'That is a thoughtful answer. A little force to prevent a big harm is different from forcing someone for no good reason.',
              ),
              N('Even then, the best result is when the others choose to go.'),
            ]),
          ],
          'Thought about the difference between persuading and forcing, and whether pushing people toward what we think is best is helping.',
        ),
      ],
      [
        ch('cheer', 'Cheer from the top of the beach.', [
          N(
            'Your Nubbin cheers too, like a kettle: a wolf kettle, or a seal kettle. It does not mind which.',
          ),
        ]),
        ch('matkah', 'Look for Matkah.', [
          MK(
            'He was always going to do it. I told his father so. His father did not believe me either.',
            'happy',
          ),
        ]),
      ],
    ),
    sc(
      'a24-18-home-done',
      [
        N('The seals stop laughing. They look at the white seal, and they look at each other.'),
        N(
          'And then, a few at a time, then more, then more again, until the sea is full of heads, they follow him out to sea.',
        ),
        N(
          'Ten, then a hundred, then a thousand, and still more behind them. Each count is ten times the last.',
        ),
      ],
      [
        ask(
          2,
          'maths',
          'a pattern with a rule: each number is 10 times the last',
          '4.OA.C.5',
          [
            N(
              'The seals follow Kotick in groups of 10, then 100, then 1,000. Each number is 10 times the one before. What comes next?',
            ),
          ],
          [
            o(
              '10,000.',
              [
                N('Yes. 1,000 × 10 = 10,000.'),
                N('Find the rule, multiply by 10, and carry on. That is how a pattern grows.'),
              ],
              true,
            ),
            o('2,000.', [
              N('That would be adding 1,000, but the rule is to multiply by 10.'),
              N('1,000 × 10 = 10,000.'),
            ]),
            o('1,100.', [
              N('That adds 100, but the rule is multiplying by 10.'),
              N('1,000 × 10 = 10,000.'),
            ]),
          ],
          'Found the next number in a pattern by working out the rule (multiply by 10).',
        ),
      ],
    ),
    sc(
      'a24-18-complete',
      [
        N(
          'You stand on the empty beach at Novastoshnah and watch the herd go, a long dark line with one white seal at the front.',
        ),
        N(
          'Every summer after, more of them go. The men who come to the beach find fewer seals, and then none.',
        ),
        N(
          'Your Nubbin watches until the white speck is gone. Then it turns round and looks at you, as if it has been somewhere.',
        ),
        N(
          'The page goes soft, like sea-fog. You are back at your own kitchen table, with the atlas open at the end of the book.',
        ),
        N(
          'There is a small white seal sitting by the pond outside, flopping, looking pleased with itself. It seems to know the way.',
        ),
        N(
          'Kotick took them to the hidden beaches, and the seals live there still, safe, far out in that cold sea.',
        ),
      ],
      [
        ask(
          5,
          'social-studies',
          'protected places and the rules that keep wild animals safe today',
          'D2.Civ.8.K-2',
          [
            N(
              'Kotick found a safe beach where nobody hunts. Today some places are set aside by law so that wild animals can live safely. What are they called?',
            ),
          ],
          [
            o(
              'Nature reserves, or wildlife refuges.',
              [
                N(
                  'Yes. Rules keep hunters and builders out. Pench Tiger Reserve, near Seoni, is one for tigers, and fur seals are protected by law too.',
                ),
                N('Safe places are how many wild animals survive.'),
              ],
              true,
            ),
            o('Zoos only.', [
              N('Zoos care for some animals, but most wild animals live outdoors.'),
              N('Nature reserves and refuges protect their real homes.'),
            ]),
            o('There are none. Wild animals look after themselves.', [
              N('Many places are protected, and they matter a great deal.'),
              N('They are called nature reserves or wildlife refuges.'),
            ]),
          ],
          'Learned that nature reserves and wildlife refuges are places protected by rules so that wild animals can live safely.',
        ),
      ],
    ),
  ],
  [
    gl(
      'tusks',
      'Very long teeth that stick out of an animal’s mouth, such as a walrus’s or an elephant’s.',
      'a24-18-search',
    ),
    gl(
      'kelp',
      'A large brown seaweed that grows in cold, shallow seas, like a forest under the water.',
      'a24-18-cows',
    ),
  ],
);

// ================================================================== Variant scenes
/**
 * One EduScene per ATLAS_A24_VARIANTS entry. Each has the same lesson domain as the scene it
 * replaces (or, for a24-17-margin-hazel, differs from its neighbours), so the order of domains
 * holds on every path.
 */
export const EDU_A24_READER_VARIANTS: EduScene[] = [
  // Fern’s memory (s8Reunited): replaces a24-02-council-done
  sc(
    'a24-02-council-done-fern',
    [
      N(
        'The wolves come one by one to look at Mowgli, and then they go down the hill after the bull.',
      ),
      N('From the edge of the page, faint as pencil, comes a voice you know. Fern, remembering.'),
      FE('That is what Bramble did for the strays.', 'soft'),
      AK('He is the pack’s now. Take him home, and bring him up properly.'),
    ],
    [
      ask(
        2,
        'literacy',
        'why a memory arrives at a certain moment: motive and connection',
        'RL.3.3',
        [
          N(
            'Fern’s memory comes at just this moment, when Baloo and Bagheera speak up for a cub who is not theirs. Why?',
          ),
        ],
        [
          o(
            'Bramble also took in strays, so the two stories match.',
            [
              N(
                'Yes. Fern sees the same kindness in two places: someone taking in a creature who needed a home.',
              ),
              N('Authors link two moments like this to show a pattern, and what it means.'),
            ],
            true,
          ),
          o('Fern was only passing by.', [
            N(
              'Fern is not really passing by. Her voice is a memory coming from the edge of the page.',
            ),
            N('It arrives here because the two stories match.'),
          ]),
          o('She wants to interrupt the Council.', [
            N('She speaks softly, as a memory. She is not interrupting.'),
            N('She is connecting this moment with what Bramble did.'),
          ]),
        ],
        'Worked out why a memory appears at a certain point in a story: two moments of kindness echo each other.',
      ),
    ],
  ),
  // stones = messua: replaces a24-10-road-done
  sc(
    'a24-10-road-done-messua',
    [
      N(
        'Mowgli goes into the trees with Akela and Grey Brother. Your Nubbin watches him go, and then leans against Messua’s leg.',
      ),
      ME(
        'You stayed. Oh, you foolish, kind thing. Come in. Come in and I will make something hot.',
        'sad',
      ),
      N(
        'Behind you in the dark trees an owl calls once. When it flies over the hut, its wings make no sound at all.',
      ),
    ],
    [
      ask(
        2,
        'science',
        'owls fly silently because of soft, fringed feathers',
        '4-LS1-1',
        [
          N(
            'The owl flew right over the hut, and you did not hear its wings. What helps owls fly so quietly?',
          ),
        ],
        [
          o(
            'Soft, fringed feathers that muffle the sound of the air.',
            [
              N('Yes. Owl feathers have soft edges that break up the noise of air flowing past.'),
              N('That lets an owl sneak up on prey, and listen at the same time.'),
            ],
            true,
          ),
          o('They only glide and never flap.', [
            N('Owls do flap. It is their feathers that make the silence.'),
            N('Soft, fringed edges muffle the sound.'),
          ]),
          o('Their wings are very small.', [
            N('Owls have big wings for their size.'),
            N('The soft feathers do the work.'),
          ]),
        ],
        'Learned that owls fly silently because the soft, fringed edges of their feathers muffle the sound of the air.',
      ),
    ],
  ),
  // stones = messua: replaces a24-10-complete
  sc(
    'a24-10-complete-messua',
    [
      N(
        'You stay with Messua a while. Her neighbours do not speak to her now, so you carry her water from the well yourself.',
      ),
      N('Each pail holds five litres, and you make four trips a day.'),
      ME(
        'He was my son for a year. That is more than I thought I would have again. More than most get twice.',
        'soft',
      ),
      N(
        'On the first night, at moonrise, Grey Brother scratches at the back door. Mowgli wants you at the Council Rock.',
      ),
      ME(
        'Go on. Go and see him keep his promise. And come back after. The door is on the latch.',
        'soft',
      ),
      N(
        'Your Nubbin sleeps in her basket by the hearth on the nights you are there. She has started calling it “the little one”.',
      ),
    ],
    [
      ask(
        1,
        'maths',
        'multiplication: 5 litres × 4 trips = 20 litres',
        '3.OA.A.3',
        [
          N(
            'Each pail holds 5 litres, and you carry 4 pails a day. How many litres of water is that?',
          ),
        ],
        [
          o(
            '20 litres.',
            [
              N('Yes: 5 × 4 = 20. Count in fives: 5, 10, 15, 20.'),
              N('That is a lot of water for one set of arms.'),
            ],
            true,
          ),
          o('9 litres.', [
            N('That is 5 + 4. But there are four pails of five litres.'),
            N('5, 10, 15, 20. Twenty litres.'),
          ]),
          o('25 litres.', [
            N('Twenty-five would be five pails. You make four trips.'),
            N('5 × 4 = 20 litres.'),
          ]),
        ],
        'Multiplied 5 × 4 = 20 to find how many litres of water four pails hold.',
      ),
    ],
  ),
  // stones = messua: replaces a24-13-hut
  sc(
    'a24-13-hut-messua',
    [
      N(
        'It has been a quiet season in Messua’s hut. Then one evening the men come, with torches and with Buldeo.',
      ),
      VI(
        'A wolf-demon, under our own roofs. We could all have been eaten in our beds. They will answer for it.',
        'angry',
      ),
      N(
        'They tie Messua and her husband with ropes, and leave them in the hut, and set a guard outside. They do not tie you.',
      ),
      N(
        'Nobody quite looks at you, because nobody knows what a guest is. That turns out to be useful.',
      ),
      ME('Do not. They will tie you too. Stay out of it. Please.', 'shock'),
      N(
        'You wait until the guard falls asleep against the wall. Then you kneel down and start on the knots.',
      ),
      N(
        'Your Nubbin works at the rope round her husband’s ankles with its paws, very seriously, and makes it worse, then better.',
      ),
      N(
        'By the time Mowgli slides in at the back of the hut, the ropes are already loose on the floor.',
      ),
      MG('You did it. You stayed, and you did it. Good. Come on. All of you.', 'happy'),
    ],
    [
      ask(
        4,
        'sel',
        'caring about others even when you are frightened yourself',
        'CASEL: Social awareness',
        [
          N(
            'Messua is tied up and in danger, but she tells you to stay out of it. What does that show about her?',
          ),
        ],
        [
          o(
            'She thinks of your safety before her own.',
            [
              N('Yes. She is scared, and still more worried about you than herself.'),
              N(
                'Caring about someone else when you are in trouble yourself is a deep kind of kindness.',
              ),
            ],
            true,
          ),
          o('She does not want any help.', [
            N('She is worried for you, not rejecting help.'),
            N('She puts your safety first.'),
          ]),
          o('She is angry with you.', [
            N('She sounds scared, not cross.'),
            N('Her words come from caring about your safety.'),
          ]),
        ],
        'Noticed that caring for someone else’s safety, even when frightened yourself, shows deep kindness.',
      ),
    ],
    [
      ch('watch', 'Keep an eye on the sleeping guard.', [
        N('He snores on. One dog barks, once, and then thinks better of it.'),
      ]),
      ch('nubbin', 'Lift your Nubbin before it chews the rope.', [
        N('You lift it away. It has a bit of rope in its mouth, and looks proud of it.'),
      ]),
    ],
  ),
  // stones = messua: replaces a24-13-hut-done
  sc(
    'a24-13-hut-done-messua',
    [
      N(
        'The back door opens without a sound. Messua leans on you, and her husband leans on Mowgli, both stiff from the ropes.',
      ),
      ME('My son. And you. I knew. I did not believe it, but I knew.', 'sad'),
      N('She says “and you” as if you had always been in the family.'),
    ],
    [
      ask(
        1,
        'literacy',
        'small words carry meaning: “and you”',
        'RL.3.3',
        [N('Messua says, “My son. And you.” What does adding “and you” tell us?')],
        [
          o(
            'She counts you as one of her family now.',
            [
              N('Yes. Two small words show how she feels about you, without having to explain.'),
              N('Good readers notice little words like these.'),
            ],
            true,
          ),
          o('She is just being polite.', [
            N('She might be. But she says it in a moment of real feeling.'),
            N('It suggests she counts you as family.'),
          ]),
          o('She has forgotten your name.', [
            N('She does not use your name because she is too moved to remember to.'),
            N('The words tell us you matter to her.'),
          ]),
        ],
        'Noticed how two small words, “and you”, show how a character feels about someone.',
      ),
    ],
  ),
  // stones = messua: replaces a24-13-road
  sc(
    'a24-13-road-messua',
    [
      MG(
        'Guest, take them to the road. The road to the town, a long day’s walk. Walk towards the sunrise. I have to go and talk to Hathi.',
        'think',
      ),
      MG(
        'Nobody there knows them, and the law there will keep them safe. The wolves will run beside you. You will not see them.',
      ),
      N(
        'So you walk Messua and her husband through the dark, the long way round the fields, with your Nubbin at your heel.',
      ),
      N(
        'Sometimes, in the grass beside the path, there is a soft sound like something grey keeping pace.',
      ),
      ME('You stayed with me. When he went, you stayed. I will not forget it.', 'soft'),
      N(
        'At the road she stops, and holds your face in both her hands, the way she used to hold Mowgli’s.',
      ),
      ME('Go and find him. Tell him we are safe. Tell him to eat properly.', 'soft'),
    ],
    [
      ask(
        0,
        'social-studies',
        'compass directions: if you face east, west is behind you',
        'D2.Geo.2.K-2',
        [
          N(
            'Mowgli says to walk towards the sunrise. If you face the sunrise, which direction is behind you?',
          ),
        ],
        [
          o(
            'West.',
            [
              N(
                'Yes. You face east towards the sunrise, so west, where the Sun sets, is behind you.',
              ),
              N('North is on your left and south is on your right.'),
            ],
            true,
          ),
          o('East.', [
            N('East is in front of you, where the Sun comes up.'),
            N('Behind you is the opposite direction: west.'),
          ]),
          o('North.', [
            N('North would be on your left if you face east.'),
            N('Directly behind you is west.'),
          ]),
        ],
        'Used the rising Sun to find east, and worked out that west is behind you when you face east.',
      ),
    ],
    [
      ch('promise', 'Promise you will.', [
        ME('Good. And you eat properly too. Both of you.', 'happy'),
      ]),
      ch('nubbin', 'Let your Nubbin say goodbye.', [
        N(
          'Your Nubbin presses its face against her ankle. She bends and kisses the top of its head.',
        ),
      ]),
    ],
  ),
  // stones = messua: replaces a24-13-road-done
  sc(
    'a24-13-road-done-messua',
    [
      N('You watch them go: two small shapes on the road, walking away into the grey of dawn.'),
      N('The grass is wet with dew, though no rain has fallen, and your boots are soaked.'),
      N(
        'She turns once, at the bend, and lifts her hand, and you lift yours. Then you go back to find Mowgli and Hathi.',
      ),
    ],
    [
      ask(
        1,
        'science',
        'dew forms when the night air cools and water vapour turns into drops',
        '3-ESS2-1',
        [N('The grass is wet, but it did not rain. Where did the water come from?')],
        [
          o(
            'Water vapour in the cool night air turned into drops, called dew.',
            [
              N(
                'Yes. Air holds invisible water vapour. When the air cools at night, some of it turns into tiny drops on cold surfaces.',
              ),
              N('When the Sun warms the grass, the dew dries and goes back into the air.'),
            ],
            true,
          ),
          o('The grass sweats.', [
            N(
              'Plants do not sweat like we do, though a plant can release a little water of its own.',
            ),
            N('Most of the wet comes from water vapour in the night air.'),
          ]),
          o('The Moon dripped it.', [
            N('The Moon has no water to drip.'),
            N('The wet comes from water vapour in the cooling air.'),
          ]),
        ],
        'Learned that dew is water vapour from the air that turns into drops when the night air cools.',
      ),
    ],
  ),
  // stones = mowgli: replaces a24-15-lamp
  sc(
    'a24-15-lamp-mowgli',
    [
      N('Messua looks at you over Mowgli’s head, polite and puzzled. She does not know you.'),
      N(
        'It has been years. A season with the wolves, then more seasons, and you look like something the jungle raised.',
      ),
      ME(
        'And you, friend. Are you hungry too? Sit down. Whoever you are, you came in with my son, and that is enough.',
        'soft',
      ),
      N(
        'You sit by the door and eat her bread, and you do not remind her. It does not seem to matter tonight.',
      ),
    ],
    [
      ask(
        2,
        'literacy',
        'what a character’s welcome shows: generosity to a stranger',
        'RL.3.3',
        [
          N(
            'Messua does not know you, but she feeds you anyway: “you came in with my son, and that is enough.” What does that show about her?',
          ),
        ],
        [
          o(
            'She is generous, and welcomes people who matter to someone she loves.',
            [
              N('Yes. She does not need to know you to be kind to you.'),
              N('How a character treats a stranger shows what she is like.'),
            ],
            true,
          ),
          o('She is not very careful.', [
            N('Being generous is not the same as being careless.'),
            N('She welcomes you because you came with her son.'),
          ]),
          o('She is hiding something.', [
            N('Nothing suggests that.'),
            N('Her welcome is real, and shows generosity.'),
          ]),
        ],
        'Saw how a character’s kindness to a stranger shows her generous nature.',
      ),
    ],
  ),
  // stones = messua: replaces a24-15-lamp
  sc(
    'a24-15-lamp-messua',
    [
      N(
        'Messua sees you over Mowgli’s head, and her face lights up as if somebody had turned the lamp higher.',
      ),
      ME(
        'You! It is you! You stayed with me, that time, when nobody else would. Oh, come here.',
        'happy',
      ),
      N(
        'She lifts the baby off the mat and puts him in your arms, warm and heavy and asleep, so she can feed Mowgli.',
      ),
      ME('Hold him. He likes being held. He is not fussy. Not like his brother.', 'happy'),
      N(
        'The baby opens his eyes and looks at your Nubbin, and your Nubbin looks back. Neither of them blinks for a long time.',
      ),
    ],
    [
      ask(
        2,
        'literacy',
        'why a character trusts someone: you stayed when others would not',
        'RL.3.3',
        [N('Messua hands you her baby straight away. Why does she trust you so much?')],
        [
          o(
            'Because you stayed with her when nobody else would.',
            [
              N('Yes. Trust is built by what someone does, especially in hard times.'),
              N('You stayed, and so she remembers you.'),
            ],
            true,
          ),
          o('Because the baby is asleep.', [
            N('A sleeping baby is a nice detail, but it is not the reason.'),
            N('She trusts you because you stayed with her.'),
          ]),
          o('Because she has no one else.', [
            N('She has Mowgli right there.'),
            N('She trusts you because of what you did when things were hard.'),
          ]),
        ],
        'Understood that Messua trusts the Keeper because of how they behaved in a hard time.',
      ),
    ],
  ),
  // stones = messua: replaces a24-16-bagheera-done
  sc(
    'a24-16-bagheera-done-messua',
    [
      N('Mowgli looks at you for a long time. Then he puts his hand on your Nubbin’s head.'),
      MG(
        'I was one winter old when Bagheera bought me with a bull. I will be seventeen this summer.',
        'soft',
      ),
      MG(
        'You stayed with Messua, when I could not. Will you look in on her? On your way home. Just once. Tell her I am coming.',
        'soft',
      ),
    ],
    [
      ask(
        1,
        'maths',
        'subtraction: 17 − 1 = 16 years',
        '2.OA.A.1',
        [
          N(
            'Mowgli was one year old when Bagheera bought him, and he will be seventeen this summer. How many years have passed?',
          ),
        ],
        [
          o(
            '16 years.',
            [
              N('Yes: 17 − 1 = 16. Count on from 1 up to 17, and you take 16 steps.'),
              N('That is a lot of seasons with the pack.'),
            ],
            true,
          ),
          o('18 years.', [
            N('That is 17 + 1. But we want the gap between two ages.'),
            N('Take 1 away from 17: 16.'),
          ]),
          o('17 years.', [
            N('He is 17 now, but he was already 1 at the start.'),
            N('So the time between is 17 − 1 = 16 years.'),
          ]),
        ],
        'Subtracted 1 from 17 to find the number of years between two ages (16).',
      ),
    ],
  ),
  // stones = messua: replaces a24-16-trail
  sc(
    'a24-16-trail-messua',
    [
      N(
        'You walk with Mowgli as far as the fork in the trail, at the foot of the hills. Grey Brother and his brothers run beside him.',
      ),
      MG(
        'This way for me, the long way round, to say goodbye to the hills. That way for you: the hut with the lamp. You know it.',
        'soft',
      ),
      N(
        'He goes off along the ridge with the four wolves round him, and does not look back. That is how you know he will be all right.',
      ),
      N(
        'You take the other path, through the fields, with your Nubbin trotting ahead. It knows the way too.',
      ),
      N(
        'The lamp is lit in the window, though it is not dark yet. Messua is in the doorway, shading her eyes.',
      ),
      ME('Is he coming? Did he say? Tell me he is coming.', 'think'),
    ],
    [
      ask(
        1,
        'social-studies',
        'a landmark at a fork in the path helps you choose the right way',
        'D2.Geo.2.K-2',
        [
          N(
            'A fork is where a path splits in two. Why does Mowgli point to “the hut with the lamp”?',
          ),
        ],
        [
          o(
            'It is a clear landmark, so you can tell which path is yours.',
            [
              N('Yes. At a fork, a landmark you know tells you which way to go.'),
              N('Mowgli names the one thing you will recognise from far away.'),
            ],
            true,
          ),
          o('To make you walk faster.', [
            N('He is not hurrying you.'),
            N('He names a landmark so you know which path to take.'),
          ]),
          o('Because he is lost.', [
            N('He knows exactly where he is going.'),
            N('The lamp hut is a landmark for you.'),
          ]),
        ],
        'Learned that a recognisable landmark helps you choose the right path at a fork.',
      ),
    ],
    [
      ch('yes', 'Tell her he is coming.', [
        ME('Then I will make more bread. I will make all the bread.', 'happy'),
      ]),
      ch('baby', 'Ask after the baby first.', [
        ME('Asleep, for once. Come and see. Quietly.', 'soft'),
      ]),
    ],
  ),
  // stones = messua: replaces a24-16-trail-done
  sc(
    'a24-16-trail-done-messua',
    [
      N('Inside, the baby is asleep on his mat, fat and brown, with one fist up by his ear.'),
      N('Babies sleep many hours each day, because their bodies are growing fast.'),
      N(
        'Your Nubbin creeps over and lies down beside him, carefully, the way it used to lie down with the wolf cubs.',
      ),
    ],
    [
      ask(
        1,
        'science',
        'babies sleep a lot because they are growing fast',
        '1-LS1-2',
        [N('The baby sleeps for many hours each day. Why do babies need so much sleep?')],
        [
          o(
            'Their bodies and brains are growing very fast and need rest.',
            [
              N(
                'Yes. Growing takes a lot of energy, and sleep is when a young body does some of its best growing.',
              ),
              N('That is also why grown-ups look after babies so carefully.'),
            ],
            true,
          ),
          o('They are lazy.', [
            N('Babies are not lazy. They are working hard at growing.'),
            N('Sleep helps their bodies and brains grow.'),
          ]),
          o('Because they are bored.', [
            N('Babies are not bored. They are busy growing.'),
            N('Their bodies and brains need lots of rest.'),
          ]),
        ],
        'Learned that babies sleep a lot because their bodies and brains grow quickly and need rest.',
      ),
    ],
  ),
  // stones = messua: replaces a24-16-complete
  sc(
    'a24-16-complete-messua',
    [
      N(
        'The last thing you see is the hut in the evening, the lamp lit in the window, and the baby asleep inside.',
      ),
      N(
        'Somewhere up the trail, Mowgli is walking towards it with four wolves. Messua has put the bread on.',
      ),
      N(
        'The page goes soft at the edges, like lamplight. Then it is your own kitchen, and the atlas open on the table.',
      ),
      N(
        'Tucked into the back of the page is a plank, carved by somebody with a knife and a lot of patience.',
      ),
    ],
    [
      notice(
        1,
        'sel',
        'having someone waiting for you is a way of belonging',
        'CASEL: Social awareness',
        [
          ME('A lit lamp in a window means: somebody is waiting for you here.', 'soft'),
          ME('That is what a home is. It is the place where someone has put the bread on.'),
        ],
        'Heard that having someone waiting for you, with a lamp lit and bread ready, is a way of belonging.',
      ),
    ],
  ),
  // s24Done: plays once after a24-17-complete
  sc(
    'a24-17-margin-hazel',
    [
      N(
        'Nova’s atlas lies open at the seals’ beach, and the white pup in the shelter of his mother’s rock.',
      ),
      N(
        'Beside the pup, low in the margin, there is a pencil note you have never noticed. You know the hand.',
      ),
      N('“Safe beach first. Then a well one.”', 'soft'),
      N('“He found both.”', 'soft'),
      N('And under it, one letter: H.'),
      N(
        'Your Nubbin puts its nose on the white seal in the picture, and then on the H, and leaves it there.',
      ),
    ],
    [
      ask(
        4,
        'sel',
        'being safe and being well are not the same thing',
        'CASEL: Self-awareness',
        [
          N(
            'Hazel wrote, “Safe beach first. Then a well one.” Is being safe the same as being well? There is no one right answer.',
          ),
        ],
        [
          o('No. Safe means nothing can hurt you. Well means you can thrive.', [
            N(
              'That is a fair answer. A hidden beach keeps the seals safe, and a good life is more than hiding.',
            ),
            N('Kotick wanted both for his herd, and Hazel noticed it.'),
          ]),
          o('Yes. If you are safe, you are well.', [
            N('That is a fair answer. Safety is very important, and it comes first.'),
            N('But some safe places can still be lonely or dull. A well place has more in it.'),
          ]),
          o('Safe comes first, then well.', [
            N('That is a thoughtful answer, and it is just what Hazel wrote.'),
            N(
              'You cannot thrive if you are always in danger, and you cannot be well just by hiding.',
            ),
          ]),
        ],
        'Thought about whether being safe is the same as being well, using Hazel’s margin note about Kotick as a prompt.',
      ),
    ],
  ),
];

// ================================================================== exports
export const EDU_A24_READER: EduQuest[] = [
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
];

/** Every `edu:` check string used by the lessons above. */
export const CHECKS: string[] = [];
