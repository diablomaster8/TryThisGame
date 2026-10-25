/**
 * The Learning Grove, reader band (ages 7–10, read alone): Atlas page A26, The Wall of Uruk (the Epic
 * of Gilgamesh, Mesopotamia, now Iraq).
 *
 * Source: atlas-a26.ts (ATLAS_A26 and A26_VARIANTS). One EduScene per original scene, id
 * `reader:<original id>`, with every original choice id and `set` flag kept. Every step scene, done
 * scene, complete scene and variant has a version with one lesson (the watch scene has two). Domains
 * never repeat back to back, across scenes and quests, and on every variant path. Each quest has a
 * think question (an `ask` with no `best`), and each variant keeps the domain of the scene it replaces,
 * except the Humbaba and Hazel notes, which differ from both of their neighbours.
 *
 * What it teaches (outline: geography, cuneiform on clay, sun-dried and kiln-fired bricks, the flood
 * tablet read again in 1872, how friends remember each other): Mesopotamia between the Tigris and the
 * Euphrates, now Iraq; cuneiform pressed into wet clay with a reed; why a kiln-fired brick outlasts a
 * sun-dried one; George Smith reading the flood tablet in 1872; multiplication, division, area, time
 * and measurement; sound, forces, light and shadows, fire, wind, steam, scorpions, snakes, the Moon;
 * similes, theme, character motive and vocabulary; honesty, grief, fairness and how we remember.
 *
 * Softened and kept (EDU-STYLE.md, “Hard things”, and the outline’s care notes):
 * - No lifted text. Shamhat is “a woman from the city” who teaches Enkidu to talk, and nothing more.
 *   Ishtar’s old friends are one plain line. The barley drink is just a drink.
 * - Humbaba’s death and the Bull of Heaven stay offscreen or soft. Humbaba’s fate is said once, plainly,
 *   with a reflective line; the Bull is stopped in a cloud of dust and nobody is hurt.
 * - Enkidu’s death is said in plain words, with the comfort straight after.
 * - Tablets are never treasure to take: the tablet stays in its box, and the brickmaker says plainly
 *   that many were taken from their places in living memory and some have come home.
 * - The flood is Uta-Napishtim’s own story, told as his, with no claim about which flood story is older.
 * - Facts used: Mesopotamia means “between the rivers”; cuneiform is wedge-shaped writing; sound is
 *   vibration; the Moon cycle is about 29.5 days; a Babylonian double-hour was two hours; scorpions
 *   are arachnids with eight legs; snakes shed their skin as they grow; baked bread cannot return to
 *   dough; kiln-fired brick resists rain; George Smith read the flood tablet in 1872; people in the
 *   marshes of southern Iraq still build with reeds.
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
const MO = say('moss');
const BR = say('a26-brickmaker');
const GI = say('a26-gilgamesh');
const EN = say('a26-enkidu');
const NI = say('a26-ninsun');
const SH = say('a26-shamhat');
const TR = say('a26-trapper');
const SP = say('a26-shepherd');
const TW = say('a26-townswoman');
const EL = say('a26-elder');
const HU = say('a26-humbaba');
const IS = say('a26-ishtar');
const SS = say('a26-shamash');
const SC = say('a26-scorpion');
const SW = say('a26-scorpion-wife');
const SI = say('a26-siduri');
const UR = say('a26-urshanabi');
const UT = say('a26-uta');
const UW = say('a26-utawife');

// ---------------------------------------------------------------- builders
type Beat = Omit<Lesson, 'id'>;
type Opt = NonNullable<Lesson['options']>[number];

const words = (t: string) => t.trim().split(/\s+/).length;
const parts = (t: string) => t.split(/(?<=[.!?”)])\s+(?=[A-Z“(‘])/);

/**
 * Keeps every narration line to two sentences or fewer and 30 words or fewer, as the reader band
 * requires: a longer narrator line is cut at sentence ends into several lines (the mood stays on the
 * first). Character lines are left alone. `map[i]` is the index of the last piece of original line
 * i, so a lesson’s `after` can follow.
 */
const split = (lines: Line[]): { lines: Line[]; map: number[] } => {
  const out: Line[] = [];
  const map: number[] = [];
  for (const l of lines) {
    if (l.who !== 'narrator') {
      out.push(l);
      map.push(out.length - 1);
      continue;
    }
    const chunks: string[] = [];
    const counts: number[] = [];
    for (const sentence of parts(l.text)) {
      const last = chunks[chunks.length - 1];
      const n = counts[counts.length - 1] ?? 0;
      if (last !== undefined && n < 2 && words(last) + words(sentence) <= 30) {
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

/** One answer option. `best` marks the answer the lesson teaches (a think question has none). */
const o = (label: string, reply: Line[], best = false): Opt =>
  best ? { label, best, reply: sp(reply) } : { label, reply: sp(reply) };

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
  ...(standard ? { standard } : {}),
  kind: 'ask',
  after,
  prompt: sp(prompt),
  options,
  parentNote,
});

const notice = (
  after: number,
  domain: EduDomain,
  skill: string,
  standard: string,
  lines: Line[],
  parentNote: string,
): Beat => ({ domain, skill, standard, kind: 'notice', after, lines: sp(lines), parentNote });

/** A choice, with its original id and flags. */
const ch = (id: string, label: string, then: Line[], set?: Choice['set']): Choice => ({
  id,
  label,
  ...(set ? { set } : {}),
  then: sp(then),
});

/** Maps a lesson's original line index to its split index; a bad index fails loudly at load. */
const mapped = (map: number[], at: number, of: string): number => {
  const i = map[at];
  if (i === undefined) throw new Error(`${of}: lesson after line ${at} is out of range`);
  return i;
};

/** One reader scene. Lesson ids are `reader:<of>-l<n>`, numbered in play order. */
const sc = (of: string, lines: Line[], beats: Beat[], choices?: Choice[]): EduScene => {
  const { lines: out, map } = split(lines);
  return {
    id: `reader:${of}`,
    of,
    band: 'reader',
    lines: out,
    ...(choices ? { choices } : {}),
    lessons: [...beats]
      .sort((a, b) => a.after - b.after)
      .map((b, i) => ({ id: `reader:${of}-l${i + 1}`, ...b, after: mapped(map, b.after, of) })),
  };
};

/** Vocabulary: word, meaning, id of the scene where it first appears. */
const GLOSSARY: [string, string, string][] = [];
const gloss = (of: string, word: string, meaning: string): void => {
  GLOSSARY.push([of, word, meaning]);
};

const quest = (
  of: string,
  title: string,
  goals: EduQuest['goals'],
  scenes: EduScene[],
): EduQuest => {
  const ids = new Set(scenes.map((s) => s.of));
  const glossary: GlossaryEntry[] = GLOSSARY.filter(([sceneOf]) => ids.has(sceneOf)).map(
    ([sceneOf, word, meaning]) => ({
      word,
      meaning,
      scene: `reader:${sceneOf}`,
    }),
  );
  return {
    id: `reader:${of}`,
    of,
    band: 'reader',
    title,
    goals,
    scenes,
    ...(glossary.length ? { glossary } : {}),
  };
};

/** A think question: no best answer, and every reply honours the child’s reasoning. */
const think = (
  after: number,
  domain: EduDomain,
  skill: string,
  standard: string,
  prompt: Line[],
  options: [string, Line[]][],
  parentNote: string,
): Beat =>
  ask(
    after,
    domain,
    skill,
    standard,
    prompt,
    options.map(([label, reply]) => o(label, reply)),
    parentNote,
  );

gloss('a26-01-page', 'rampart', 'The wide top of a city wall, where people can walk.');
gloss('a26-01-page-done', 'kiln', 'A very hot oven for baking clay until it is hard.');
gloss('a26-01-tablet', 'cuneiform', 'Wedge-shaped writing, pressed into wet clay with a reed.');
gloss('a26-01-tablet', 'lapis', 'A deep blue stone with tiny flecks of gold-coloured mineral.');
gloss('a26-03-herd', 'steppe', 'A huge, dry grassland with few trees.');
gloss('a26-03-pits', 'snare', 'A trap made of rope or net, set to catch an animal.');
gloss('a26-04-coax', 'skittish', 'Nervous and quick to run off.');
gloss('a26-05-bread', 'barley', 'A grain, grown in fields, that people grind into flour.');
gloss('a26-05-night', 'nocturnal', 'Awake and active at night.');

// ================================================================== A26-1 The Wall
const Q1 = quest(
  'a26-01',
  'The Wall',
  {
    'a26-01-s1': {
      goal: 'Step into the page and walk the wall of Uruk.',
      hint: 'Touch the sunlit wall on the page, then follow the old brickmaker along the top.',
    },
    'a26-01-s2': {
      goal: 'Find the copper tablet box at the foot of the wall and read the lapis tablet.',
      hint: 'The box is set into the wall’s foundation, by the stair. The brickmaker will show you.',
    },
  },
  [
    sc(
      'a26-01-page',
      [
        N(
          'Nova’s atlas falls open at a page so bright it warms your face. A great brick wall stands in the sun, with date palms and a river.',
        ),
        N(
          'Your Nubbin puts both paws flat on the paper, as if to test whether it is hot. It is, a little.',
        ),
        N(
          'The bricks are warm under your feet, and you are standing on the rampart of a city. Two carts could pass side by side up here.',
        ),
        N(
          'Below, flat roofs run down to a river. An old woman with clay to her elbows sits on a stack of bricks, eating a date.',
        ),
        BR(
          'New, are you? Everyone is new once. Walk the wall with me. It is the best way to meet a city.',
        ),
        BR(
          'This is Uruk. It stood in the land between two rivers, the Tigris and the Euphrates. Today that land is part of Iraq.',
        ),
        BR(
          'The Greeks later called it Mesopotamia, which means “between the rivers”. Rivers meant water, crops and boats.',
        ),
      ],
      [
        notice(
          6,
          'social-studies',
          'Mesopotamia means “between the rivers”; Uruk stood in what is now Iraq',
          'D2.Geo.2.3-5',
          [
            N(
              '(Find the two rivers on Nova’s map. The Tigris and the Euphrates both run south-east through Iraq to the sea.)',
            ),
          ],
          'Learned where Mesopotamia was: between the Tigris and the Euphrates, in what is now Iraq.',
        ),
      ],
      [
        ch('bricks', 'Ask her how you tell a good brick.', [
          BR(
            'You knock it. A good brick rings, and a bad one says “thud” and lets you down when it rains.',
            'happy',
          ),
        ]),
        ch('king', 'Ask who built the wall.', [
          BR(
            'The king says he did. The king says a lot of things. Come down and I will show you something better.',
            'think',
          ),
        ]),
      ],
    ),
    sc(
      'a26-01-page-done',
      [
        N(
          'Your Nubbin knocks on the parapet with one paw, and listens with its head on one side. It seems satisfied.',
        ),
        BR(
          'That is how you test a brick. Some of these were baked in a kiln, a very hot oven, and some only dried in the sun.',
        ),
        BR(
          'Now down the stairs. Mind the third one. It has been mended since my grandmother’s day.',
        ),
      ],
      [
        ask(
          1,
          'science',
          'sound is made of vibrations',
          '4-PS3-2',
          [N('A knock makes the brick ring. What is a sound made of?')],
          [
            o(
              'Tiny back-and-forth shakes, called vibrations',
              [
                BR(
                  'Yes. The knock shakes the brick, the brick shakes the air, and your ear feels the shaking as sound.',
                ),
              ],
              true,
            ),
            o('Light', [
              BR(
                'Not quite. Light is something we see. Sound is shaking, passed along through the air.',
              ),
            ]),
            o('Heat', [
              BR(
                'Not quite. A knock does warm a brick a tiny bit, but the ringing is shaking, called vibration.',
              ),
            ]),
          ],
          'Learned that sound is made of vibrations.',
        ),
      ],
    ),
    sc(
      'a26-01-tablet',
      [
        N(
          'At the foot of the stair, set into the oldest bricks, there is a box of copper, green with years. Its lock is a bronze bolt.',
        ),
        BR('Slide the bolt. Go on. It is meant to be opened. That is the whole point of it.'),
        N(
          'Inside lies a tablet of lapis, deep blue and flecked with gold like a night sky. Little wedge-shaped marks run across it.',
        ),
        N('You cannot read them. Then, the longer you look, you can.'),
        BR(
          'That is cuneiform. Scribes pressed a reed into wet clay, and every press left a wedge. This one was cut into stone, to last.',
        ),
        BR(
          'The tablet begins with our city and its high wall. Then it is all about a king who saw everything, and what it cost him.',
        ),
        N(
          'The wedges begin to move like ants in a line. The air smells of hot dust and river water.',
        ),
      ],
      [
        notice(
          4,
          'literacy',
          'cuneiform means wedge-shaped; scribes pressed a reed into wet clay',
          'L.3.4',
          [
            BR(
              'The word “cuneiform” comes from the Latin for “wedge”. You can see the corner of the reed in every mark.',
            ),
            BR(
              'Groups of wedges made signs, some for words and some for sounds. People wrote like this more than four thousand years ago.',
            ),
          ],
          'Learned that cuneiform is wedge-shaped writing, pressed into clay, and what the word means.',
        ),
      ],
      [
        ch('read', 'Read on.', [
          N(
            'You read on. The wedges become words, and the words become a street, and you are standing in it.',
          ),
        ]),
        ch('nubbin', 'Let your Nubbin turn the tablet over.', [
          N(
            'Your Nubbin turns the tablet over with great care. On the back, the story keeps going, and so do you.',
          ),
        ]),
      ],
    ),
    sc(
      'a26-01-tablet-done',
      [
        N(
          'When you look up, the brickmaker has put the tablet back in its box and slid the bolt home.',
        ),
        BR('It stays here. That is what it is for. Anyone can come and open the box and read it.'),
        BR('Go on, then. I will be on the wall when you are done.'),
      ],
      [
        think(
          1,
          'sel',
          'weighing where a very old thing should be kept',
          'CASEL: Responsible decision-making',
          [
            N(
              'The brickmaker puts the tablet back instead of taking it. What do you think is the right place for something so old?',
            ),
          ],
          [
            [
              'Where it was found, so people can come to it',
              [
                N(
                  'That is a fair answer. It matches what the brickmaker believes: a thing stays part of its place.',
                ),
              ],
            ],
            [
              'In a museum, where it is kept safe',
              [
                N(
                  'That is a fair answer. A safe place matters. The brickmaker thinks a thing matters more where it belongs.',
                ),
              ],
            ],
            [
              'Anywhere that lets lots of people see it',
              [
                N(
                  'That is a fair answer. Sharing matters. The question is how to share without taking from the people it belongs to.',
                ),
              ],
            ],
          ],
          'Thought about where a very old and precious thing belongs, and how to share it fairly.',
        ),
      ],
    ),
    sc(
      'a26-01-complete',
      [
        N(
          'The street is full of people, all of them tired. Somewhere above them, a drum is beating, and it does not stop.',
        ),
        N(
          'It beats four times, rests, beats four times, rests, and beats four times again. Then it starts over.',
        ),
        N(
          'Your Nubbin takes hold of your trouser leg. You are in the story now, a stranger in Uruk, and the king is awake.',
        ),
      ],
      [
        ask(
          1,
          'maths',
          'three equal groups of four',
          '3.OA.A.1',
          [
            N(
              'The drum beats in three groups of four. How many beats in all, before it starts over?',
            ),
          ],
          [
            o('12', [N('Yes. Three groups of four: 4, 8, 12.')], true),
            o('7', [N('That is 3 + 4. Three groups of four means 4 + 4 + 4 = 12.')]),
            o('34', [N('Careful: three groups of four is 4 + 4 + 4, which is 12.')]),
          ],
          'Used three equal groups of four to make 12.',
        ),
      ],
    ),
  ],
);

// ================================================================== A26-2 The King Who Never Rests
const Q2 = quest(
  'a26-02',
  'The King Who Never Rests',
  {
    'a26-02-s1': {
      goal: 'Watch the king’s games in the great square.',
      hint: 'Follow the drum to the great square, and find a place by the well.',
    },
    'a26-02-s2': {
      goal: 'Go up to the temple with the people of Uruk.',
      hint: 'At dusk the crowd climbs the temple steps. Go with the woman from the square.',
    },
  },
  [
    sc(
      'a26-02-games',
      [
        N(
          'In the great square, young men are running races, and carrying stones, and running races again. Nobody looks as if they want to.',
        ),
        N(
          'In the middle, taller than anyone, stands a man with a curled black beard and arms like roof beams.',
        ),
        GI('Again! Faster! Who is tired? Nobody is tired! Uruk does not get tired!', 'happy'),
        N(
          'That is Gilgamesh, king of Uruk. Two parts of him are god, and one part is man, and you cannot tell which part is talking.',
        ),
        TW(
          'He has been at it since the new moon. Games all day, building all night. Nobody may go home.',
          'sad',
        ),
        N('A boy in the race stumbles and sits down in the dust. He does not get up.'),
      ],
      [
        ask(
          5,
          'health',
          'a tired body needs water and rest',
          'CASEL: Self-management',
          [N('The boy is exhausted. Which is the best help for a very tired body?')],
          [
            o(
              'Water and a proper rest',
              [
                N(
                  'Yes. Water and rest are what a tired body needs. Children your age need about nine to twelve hours of sleep a night.',
                ),
              ],
              true,
            ),
            o('One more race, to toughen him up', [
              N(
                'Not quite. Pushing a worn-out body harder only makes it more tired. It needs water and rest.',
              ),
            ]),
            o('Ignoring it until he feels better', [
              N('He might, in time. But water and rest help sooner, and they are kind.'),
            ]),
          ],
          'Learned that a very tired body needs water and rest.',
        ),
      ],
      [
        ch('water', 'Take the boy some water from the well.', [
          N(
            'You draw a bucket and carry the boy a cup. He drinks it all, and looks at you as if you had brought him the sea.',
          ),
        ]),
        ch('sit', 'Sit down in the dust beside him.', [
          N(
            'You sit down beside him. After a moment your Nubbin sits too, and so, quietly, does the boy’s mother.',
          ),
        ]),
      ],
    ),
    sc(
      'a26-02-games-done',
      [
        N('The king sees none of it. He has already started another race.'),
        TW(
          'Thank you. It is the first kind thing anyone has done in this square since the new moon.',
          'soft',
        ),
      ],
      [
        ask(
          1,
          'sel',
          'small kindnesses matter to someone who has had none',
          'CASEL: Social awareness',
          [
            N(
              'The woman says it is the first kind thing since the new moon. What does that show about small kindnesses?',
            ),
          ],
          [
            o(
              'They can matter a lot to someone who is tired and worried',
              [
                N(
                  'Yes. A cup of water is small, but to someone who has had nothing kind for weeks, it is a great deal.',
                ),
              ],
              true,
            ),
            o('They only matter if the king sees', [
              N(
                'Not quite. The king saw nothing, and still the kindness mattered. It mattered to the boy and his mother.',
              ),
            ]),
          ],
          'Talked about how small kindnesses matter, even when nobody important notices.',
        ),
      ],
    ),
    sc(
      'a26-02-clay',
      [
        N(
          'At dusk the people climb the temple steps with lamps. They do not shout, because they are too tired to shout.',
        ),
        TW(
          'Gods of the city, he is too strong for us. Give him someone his own size. Someone to wear him out.',
          'sad',
        ),
        N(
          'The lamps flicker, though there is no wind. And for a moment, high over the temple, you see something no one else seems to.',
        ),
        N(
          'A great woman, made of starlight, washes her hands in the evening sky. She pinches off a little clay and rolls it between her palms.',
        ),
        N(
          'That is the goddess Aruru, who made people in the first place. She drops the clay, gently, far away in the wild.',
        ),
        N('Your Nubbin watches it fall all the way, with its mouth open.'),
      ],
      [
        ask(
          3,
          'science',
          'clay is soft when wet and hard when dry',
          undefined,
          [
            N(
              'Aruru shapes wet clay. Why is clay such a useful material for people who want to build and write?',
            ),
          ],
          [
            o(
              'It can be shaped while soft, then it dries hard and keeps its shape',
              [
                N(
                  'Yes. Soft clay becomes a brick, a pot or a tablet, and when it dries or is baked, it stays that way.',
                ),
              ],
              true,
            ),
            o('It never changes', [
              N(
                'It does change! Clay is soft when wet and hard when it dries. That change is why it is so useful.',
              ),
            ]),
            o('It dissolves in water, so it is easy to wash away', [
              N(
                'Wet clay goes soft and muddy, but dry or baked clay holds firm. That is why bricks last.',
              ),
            ]),
          ],
          'Learned that clay can be shaped while wet and hardens when it dries.',
        ),
      ],
      [
        ch('tell', 'Tell the woman what you saw.', [
          TW('Clay? In the wild? Well. I asked for help. I did not say what shape.'),
        ]),
        ch('keep', 'Keep it to yourself for now.', [
          N(
            'You keep it to yourself. The woman pats your arm, as if you had prayed hardest of anyone.',
          ),
        ]),
      ],
    ),
    sc(
      'a26-02-clay-done',
      [
        N(
          'Far off, beyond the river and the fields, something new opens its eyes in the long grass.',
        ),
        N('The eyes open slowly, like a door in the morning, and the light comes in.'),
      ],
      [
        ask(
          1,
          'literacy',
          'recognising a simile',
          'L.4.5',
          [
            N(
              '“The eyes open like a door in the morning” is a simile. Which of these is also a simile?',
            ),
          ],
          [
            o(
              '“He ran like the wind.”',
              [N('Yes. A simile compares two things using “like” or “as”.')],
              true,
            ),
            o('“He was the wind.”', [
              N('That compares too, but without “like” or “as”. That is a metaphor.'),
            ]),
            o('“He ran very fast.”', [
              N('That is plain description. A simile needs a comparison with “like” or “as”.'),
            ]),
          ],
          'Told a simile from a metaphor and a plain sentence.',
        ),
      ],
    ),
    sc(
      'a26-02-complete',
      [
        N(
          'Down in the square, the drum keeps going. Gilgamesh is still awake, still building, still certain nothing can stop him.',
        ),
        N('Your Nubbin has turned to face the wild, where the clay fell. Its ears are up.'),
      ],
      [
        think(
          1,
          'social-studies',
          'what a fair rule about work and rest would look like',
          'D2.Civ.8.3-5',
          [
            N(
              'The king never lets his people rest. What would a fair rule about work and rest look like in a city?',
            ),
          ],
          [
            [
              'Everyone works, and everyone gets time to rest',
              [
                N(
                  'That is a fair answer. A rule that gives everyone rest, including the king, is hard to argue with.',
                ),
              ],
            ],
            [
              'The king decides, because he is the king',
              [
                N(
                  'That is a fair answer to think about. But the people of Uruk cried out: when one person decides alone, people can get hurt.',
                ),
              ],
            ],
            [
              'The people vote on how long to work',
              [
                N(
                  'That is a fair answer. Many places today let people have a say in rules that affect them.',
                ),
              ],
            ],
          ],
          'Thought about what a fair rule for work and rest might be.',
        ),
      ],
    ),
  ],
);

// ================================================================== A26-3 The Wild Man
const Q3 = quest(
  'a26-03',
  'The Wild Man',
  {
    'a26-03-s1': {
      goal: 'Go out to the water hole on the steppe.',
      hint: 'Leave Uruk by the river gate and follow the gazelle tracks to the water.',
    },
    'a26-03-s2': {
      goal: 'Find out who set the pits and snares, and what happened to them.',
      hint: 'Walk the edge of the steppe and look for filled-in pits and torn snares.',
    },
  },
  [
    sc(
      'a26-03-herd',
      [
        N(
          'Three days out from the wall, the fields give way to steppe: dry grass, thorn trees, and a sky that goes on for ever.',
        ),
        N(
          'At the water hole, three gazelles are drinking with their knees bent. Four more come trotting up, and two wander off again.',
        ),
        N(
          'In among them, on all fours, drinks a man. He is hairy all over, like a goat, and has never worn a stitch.',
        ),
        N(
          'He grazes with the gazelles and drinks with them, and he looks perfectly happy. This is Enkidu, though he does not know he has a name yet.',
        ),
        N(
          'Your Nubbin trots straight past you, down to the water, and drinks beside the smallest gazelle.',
        ),
        EN('Hhh?', 'think'),
        N(
          'Enkidu lifts his dripping face and looks at your Nubbin. Then he goes back to drinking, as if it had always been there.',
        ),
      ],
      [
        ask(
          1,
          'maths',
          'add and take away within 100',
          '3.OA.D.8',
          [
            N(
              'Three gazelles are at the water. Four more arrive, and two leave. How many gazelles are at the water hole now?',
            ),
          ],
          [
            o('5', [N('Yes. 3 + 4 = 7, and 7 − 2 = 5.')], true),
            o('9', [N('That is 3 + 4 + 2. Two of them left, so take 2 away: 7 − 2 = 5.')]),
            o('7', [N('That is the number after the four arrived. Two then left, so 7 − 2 = 5.')]),
          ],
          'Added and took away to find five gazelles.',
        ),
      ],
      [
        ch('let', 'Let your Nubbin stay with the herd.', [
          N(
            'You let it stay. It lies down in the cool mud with the gazelles, more content than you have ever seen it.',
          ),
        ]),
        ch('call', 'Call your Nubbin back.', [
          N(
            'You call. Your Nubbin looks at you, and flicks an ear, and stays exactly where it is.',
          ),
        ]),
      ],
    ),
    sc(
      'a26-03-herd-done',
      [
        N(
          'You sit under a thorn tree and watch them. Your Nubbin is in the middle of the herd, nose to nose with a fawn.',
        ),
        N(
          'Enkidu grooms a gazelle’s ear with great care. There is nothing wild about the way he does it.',
        ),
      ],
      [
        ask(
          1,
          'science',
          'animals in groups help each other survive',
          '3-LS2-1',
          [N('Gazelles stay together in a herd. How does a herd help each gazelle survive?')],
          [
            o(
              'Many eyes and ears notice danger sooner',
              [N('Yes. When one gazelle spots a threat, the whole herd can run.')],
              true,
            ),
            o('Herds make the grass grow faster', [
              N('Not quite. The herd does not grow the grass. What it does is spot danger sooner.'),
            ]),
            o('Gazelles in a herd never get thirsty', [
              N(
                'Not quite. Every gazelle still needs water. A herd helps by watching for danger together.',
              ),
            ]),
          ],
          'Learned that living in a group helps animals notice danger.',
        ),
      ],
    ),
    sc(
      'a26-03-pits',
      [
        N(
          'At the edge of the steppe there are pits dug to catch game. Every one of them has been filled in, with care, by hand.',
        ),
        N(
          'The snares have been torn up and laid in a tidy pile. Somebody has been very busy on the herd’s behalf.',
        ),
        N(
          'A man with a net over his shoulder comes over the rise. He stops dead at the pits, and goes pale.',
        ),
        TR('Again! Every pit, every snare. Three days I worked on those.', 'angry'),
        TR(
          'It is a man. A wild man, strong as a star from heaven. He runs with them. He sets them free.',
          'shock',
        ),
        TR(
          'I cannot feed my family on empty nets. I am going home to my father. He will know what to do.',
        ),
      ],
      [
        think(
          5,
          'sel',
          'seeing both sides when two people need different things',
          'CASEL: Social awareness',
          [
            N(
              'The trapper needs food for his family. Enkidu is freeing the animals. Who do you think is in the right?',
            ),
          ],
          [
            [
              'The trapper, because his family needs to eat',
              [
                N(
                  'That is a fair answer. A hungry family is a real problem. Enkidu does not yet understand that.',
                ),
              ],
            ],
            [
              'Enkidu, because the animals are his friends',
              [
                N(
                  'That is a fair answer. He is protecting those he cares about. He does not yet know what the nets are for.',
                ),
              ],
            ],
            [
              'Both, and they need to understand each other',
              [N('That is a fair answer. Neither is wicked. They need what the other cannot see.')],
            ],
          ],
          'Thought about a conflict where each side has a real need.',
        ),
      ],
      [
        ch('sorry', 'Tell him you are sorry about his work.', [
          TR(
            'So am I. And I am sorry I am frightened of him. I do not think he means harm. He just does not know about nets.',
            'soft',
          ),
        ]),
        ch('herd', 'Say the herd seemed happy, at least.', [
          TR('Happy! The gazelles are happy. I am the one with the empty pot.', 'think'),
          N('Then he laughs, once, despite himself.'),
        ]),
      ],
    ),
    sc(
      'a26-03-pits-done',
      [
        N(
          'He runs off towards the river, net flapping. Behind you, at the water, the wild man is filling in another pit.',
        ),
        N('He pats the earth flat with both hands, very gently, as if tucking someone in.'),
      ],
      [
        ask(
          1,
          'literacy',
          'a character’s motive',
          'RL.3.3',
          [
            N(
              'Why does Enkidu fill in the pits? Think about what he knows and what he cares about.',
            ),
          ],
          [
            o(
              'He wants to keep his animal friends safe, though he does not understand why the trapper set them',
              [
                N(
                  'Yes. His motive is care for his friends. He sees danger to them but does not yet understand the trapper’s side.',
                ),
              ],
              true,
            ),
            o('He wants to annoy the trapper', [
              N('Not quite. He has never met the trapper. His motive is to keep the herd safe.'),
            ]),
            o('He likes digging and filling', [
              N('Look at how gently he pats the earth. His motive is care for his friends.'),
            ]),
          ],
          'Explained a character’s motive from what he knows and cares about.',
        ),
      ],
    ),
    sc(
      'a26-03-complete',
      [
        N(
          'By evening the trapper is far away on the road to his father, and then on the road to Uruk.',
        ),
        N('Your Nubbin is still with the herd. It does not look round when you say its name.'),
      ],
      [
        notice(
          0,
          'social-studies',
          'land near rivers was green; land away from them was dry steppe',
          'D2.Geo.2.3-5',
          [
            N(
              '(Look at Nova’s map.) The land beside the rivers was green and could be farmed, because the rivers brought water.',
            ),
            N('Further out, it turned to dry steppe, where herds roamed.'),
          ],
          'Learned that land beside Mesopotamia’s rivers was fertile, while land further away was dry steppe.',
        ),
      ],
    ),
  ],
);

// ================================================================== A26-4 Shamhat
const Q4 = quest(
  'a26-04',
  'Shamhat',
  {
    'a26-04-s1': {
      goal: 'Walk Shamhat out to the water hole with the trapper.',
      hint: 'Meet the trapper at Uruk’s river gate and carry Shamhat’s bundle.',
    },
    'a26-04-s2': {
      goal: 'Sit at the water hole with Shamhat until Enkidu understands her.',
      hint: 'Sit by the water. Do not chase. It takes days.',
    },
    'a26-04-s3': {
      goal: 'Coax your Nubbin back from the herd.',
      hint: 'The gazelles are skittish now. Go slowly, and let your Nubbin come to you.',
    },
  },
  [
    sc(
      'a26-04-road',
      [
        N(
          'The trapper comes back from Uruk with a woman from the city. She walks quickly, and carries her own bundle until you take it.',
        ),
        SH(
          'I am Shamhat. The king sent me. He says the wild man needs someone to talk to. I think he is right, for once.',
        ),
        TR('He does not talk. He grunts. He drinks out of the pond on his knees.'),
        SH('So did you, once. Somebody sat with you until you did not.', 'soft'),
        N(
          'The bundle smells of bread and sweet oil. In it are twelve dates, a flat loaf and a clean robe folded small.',
        ),
        SH(
          'I will share the dates between me, the trapper and Enkidu, the same number each. Most people want to tame him. I want to be the first person he understands.',
        ),
      ],
      [
        ask(
          4,
          'maths',
          'sharing equally: division',
          '3.OA.A.3',
          [
            N(
              'Twelve dates shared equally between three people. How many dates does each person get?',
            ),
          ],
          [
            o('4', [N('Yes. 12 ÷ 3 = 4, because 4 + 4 + 4 = 12.')], true),
            o('3', [
              N(
                'Check it: 3 + 3 + 3 = 9, which is too few. Each person gets 4, because 4 + 4 + 4 = 12.',
              ),
            ]),
            o('6', [N('Check it: 6 + 6 + 6 = 18, which is too many. Each person gets 4.')]),
          ],
          'Divided twelve dates equally among three people.',
        ),
      ],
      [
        ch('how', 'Ask her how she will do it.', [
          SH(
            'Patience. I will sit where he can see me, and talk, and not need anything. Then one day he will answer.',
          ),
        ]),
        ch('nubbin', 'Tell her your Nubbin ran off with the herd.', [
          SH('Then we have the same job, you and I. Let us see who finishes first.'),
        ]),
      ],
    ),
    sc(
      'a26-04-sit',
      [
        N(
          'Shamhat sits on a flat rock by the water hole, and you sit a little way off. The trapper hides in a bush and is no help.',
        ),
        N(
          'The first day, Enkidu watches her from behind a gazelle. The second day, he comes and sniffs her bundle.',
        ),
        SH('That is bread. You do not know bread yet. You will. This is my hand. That is yours.'),
        N(
          'By the fourth day he sits across the rock from her, the way your Nubbin sits across from you on the hill at home.',
        ),
        N(
          'She talks about the city, and the river, and the man who never sleeps. Enkidu listens with his whole face.',
        ),
        EN('Hand.', 'think'),
        SH('Hand. Yes. And what do you call yourself?', 'happy'),
        EN('…Enkidu.'),
      ],
      [
        think(
          4,
          'sel',
          'why waiting patiently helps someone feel safe',
          'CASEL: Relationship skills',
          [
            N(
              'Shamhat never chases Enkidu. She sits, talks and waits. Why do you think that works better than chasing?',
            ),
          ],
          [
            [
              'He gets to come close when he feels safe',
              [
                N(
                  'That is a fair answer. When you do not push, the other person can choose to come closer.',
                ),
              ],
            ],
            [
              'She shows she wants nothing from him',
              [N('That is a fair answer. Someone who asks for nothing is easier to trust.')],
            ],
            [
              'It does not always work, but here it did',
              [
                N(
                  'That is a fair answer. Waiting takes time, and it is not a guarantee. It gave Enkidu room to choose.',
                ),
              ],
            ],
          ],
          'Thought about why patient waiting can build trust.',
        ),
      ],
    ),
    sc(
      'a26-04-sit-done',
      [
        N(
          'He says it again, louder, as if trying the word for size. Then he laughs, a big surprised human laugh.',
        ),
        SH('There you are. I knew there was someone in there.', 'happy'),
      ],
      [
        ask(
          1,
          'literacy',
          'what an action shows about a character',
          'RL.3.3',
          [
            N(
              'Shamhat asks Enkidu what he calls himself, instead of giving him a name. What does that show about her?',
            ),
          ],
          [
            o(
              'She respects him and lets him choose his own name',
              [N('Yes. Her question treats Enkidu as a person with a say in who he is.')],
              true,
            ),
            o('She does not know his name', [
              N('She might not. But the way she asks shows respect.'),
            ]),
            o('She is in a hurry', [
              N('She has waited days. The question shows patience and respect.'),
            ]),
          ],
          'Read a character’s respect from the way she asks a question.',
        ),
      ],
    ),
    sc(
      'a26-04-coax',
      [
        N('Enkidu walks back down to the gazelles, the way he has every evening of his life.'),
        N(
          'They lift their heads, and look at him, and run, every one. They do not know him any more.',
        ),
        EN('Wait! It is me!', 'sad'),
        N('He tries to run after them, and cannot keep up. His legs are a man’s now.'),
        N(
          'Your Nubbin has been left behind by the herd, too. It sits alone in the grass, skittish and watching them go.',
        ),
        SH('Go to yours. I will go to mine.', 'soft'),
      ],
      [
        ask(
          3,
          'science',
          'animals use their senses to know each other',
          '4-LS1-2',
          [N('Why might the gazelles stop recognising Enkidu? He has the same face as yesterday.')],
          [
            o(
              'He smells different and moves differently now, and gazelles rely on smell and movement',
              [
                N(
                  'Yes. Many animals recognise each other mostly by smell. Clothes and oil change how he smells.',
                ),
              ],
              true,
            ),
            o('The gazelles forgot him overnight', [
              N('Not quite. They did not forget. His smell and his movements changed.'),
            ]),
            o('Gazelles cannot see faces', [
              N('They do see. But smell matters a great deal to them, and his smell has changed.'),
            ]),
          ],
          'Learned that animals recognise each other by senses such as smell.',
        ),
      ],
      [
        ch('call', 'Call its name.', [
          N(
            'You call its name. It hears you, and thinks about it for a long moment, and then it comes, slowly, then all at once.',
          ),
        ]),
        ch('wait', 'Sit down in the grass and wait.', [
          N('You sit down in the grass and wait. The sun goes down a finger’s width.'),
          N(
            'Then there is a weight against your side, warm and a bit muddy, as if it had been there all along.',
          ),
        ]),
        ch('date', 'Hold out a date from Shamhat’s bundle.', [
          N(
            'You hold out a date. Your Nubbin comes for the date, and stays for you, and gets very sticky.',
          ),
        ]),
      ],
    ),
    sc(
      'a26-04-coax-done',
      [
        N(
          'Across the water, Enkidu is sitting with his head in his hands, and Shamhat is sitting beside him, saying nothing.',
        ),
        N('After a while he leans against her shoulder, the way your Nubbin leans against yours.'),
      ],
      [
        ask(
          1,
          'sel',
          'what helps when we feel sad',
          'CASEL: Self-awareness',
          [N('Enkidu is sad. Shamhat does not talk him out of it. What is she doing that helps?')],
          [
            o(
              'Staying close, and letting him be sad',
              [N('Yes. Sometimes we do not need fixing. We need someone to sit beside us.')],
              true,
            ),
            o('Telling him to cheer up', [
              N('That is what some people try. It rarely helps. Staying close helps more.'),
            ]),
            o('Leaving him alone to get over it', [
              N('Some quiet is fine. But company, without fuss, helps more.'),
            ]),
          ],
          'Noticed that staying close without trying to fix a feeling can help.',
        ),
      ],
    ),
    sc(
      'a26-04-complete',
      [
        SH(
          'You are not less, you know. You are more. You lost the herd and found the whole world. Come and see it.',
        ),
        EN('Will it run away from me too?', 'sad'),
        SH('Some of it. Not the best of it.'),
        N(
          'She gives him half of her robe to wear, and takes his hand, and leads him like a child towards the shepherds’ camp.',
        ),
      ],
      [
        ask(
          1,
          'literacy',
          'what a character’s words really mean',
          'RL.3.3',
          [N('Shamhat says, “You lost the herd and found the whole world.” What does she mean?')],
          [
            o(
              'He lost one way of living, but gained a much bigger one',
              [N('Yes. She is comforting him by showing what his loss opens up.')],
              true,
            ),
            o('He lost a herd of gazelles and found a map', [
              N('Not a real map. She means a bigger life: people, cities and friends.'),
            ]),
            o('She is trying to trick him', [
              N('Her words are kind, and she stays beside him. She is encouraging, not tricking.'),
            ]),
          ],
          'Worked out the meaning of a comforting line from a character.',
        ),
      ],
    ),
  ],
);

// ================================================================== A26-5 Bread and Ale
const Q5 = quest(
  'a26-05',
  'Bread and Barley',
  {
    'a26-05-s1': {
      goal: 'Help the shepherds feed Enkidu his first supper.',
      hint: 'Carry the bread and the jugs from the shepherds’ fire to Enkidu.',
    },
    'a26-05-s2': {
      goal: 'Keep watch over the flocks with Enkidu at night.',
      hint: 'Take a lamp to the sheepfold and stay up with Enkidu.',
    },
  },
  [
    sc(
      'a26-05-bread',
      [
        N(
          'The shepherds’ camp is a ring of tents round a fire, and a lot of sheep with opinions. The shepherds crowd round to look at Enkidu.',
        ),
        SP('He is as tall as the king. Taller. Sit down, friend, sit down. You must be hungry.'),
        N(
          'You set a round loaf in front of him, and a jug of thick barley drink. Enkidu looks at them as if they might bite.',
        ),
        EN('What is this?', 'think'),
        SH(
          'That is bread. People eat it. And that is a drink. People drink it. Go on. It is what we do.',
        ),
        N(
          'He sniffs the bread, and licks it. He takes a very small bite, and his eyebrows go up into his hair.',
        ),
        N(
          'Then he eats until he is full, and his face shines like a lamp. And then, to everyone’s surprise, including his own, he sings.',
        ),
        SP('More jugs, water-carrier! He drinks like the whole flock.', 'happy'),
      ],
      [
        ask(
          7,
          'science',
          'how grain becomes bread',
          undefined,
          [
            N(
              'Enkidu has never seen bread made. Which order is right for how a loaf of bread is made?',
            ),
          ],
          [
            o(
              'Barley or wheat grows in a field, the grain is ground into flour, then the dough is mixed and baked',
              [
                N(
                  'Yes. Plants need water and light to grow grain. People turn the grain into flour, then dough, then bread.',
                ),
              ],
              true,
            ),
            o('Dough is baked, then ground, then planted', [
              N(
                'That order cannot work. The plant comes first, then the flour, then the dough, then the baked loaf.',
              ),
            ]),
            o('Bread grows on trees like fruit', [
              N(
                'Bread does not grow on trees, but its grain grows on plants like barley and wheat.',
              ),
            ]),
          ],
          'Put the steps of making bread in order, from plant to loaf.',
        ),
      ],
      [
        ch('clap', 'Clap along.', [
          N('You clap along, and so do the shepherds. Your Nubbin hops in time, mostly.'),
        ]),
        ch('bread', 'Break your own loaf with your Nubbin.', [
          N(
            'You break your loaf in two. Enkidu watches, and breaks his, and holds out half to the shepherd beside him.',
          ),
        ]),
      ],
    ),
    sc(
      'a26-05-bread-done',
      [
        N(
          'Afterwards the shepherds trim his hair, and he washes in the stream and rubs oil into his skin. Shamhat gives him clothes.',
        ),
        SP('Look at him. He looks like a bridegroom. Or a king.', 'happy'),
        EN('Is that good?'),
        SH('That depends on the king.'),
      ],
      [
        ask(
          2,
          'health',
          'washing helps keep us healthy',
          'CASEL: Responsible decision-making',
          [
            N(
              'Enkidu washes in the stream for the first time. Why is washing good for our health?',
            ),
          ],
          [
            o(
              'It removes dirt and germs that can make us ill',
              [
                N(
                  'Yes. Washing, especially our hands before eating, helps keep germs out of our bodies.',
                ),
              ],
              true,
            ),
            o('It makes us tire out so we sleep', [
              N('Not the reason. Washing helps because it removes dirt and germs.'),
            ]),
            o('It is only for looking smart', [
              N('It does help us look tidy, but its real job is removing dirt and germs.'),
            ]),
          ],
          'Learned that washing removes dirt and germs and helps keep us healthy.',
        ),
      ],
    ),
    sc(
      'a26-05-night',
      [
        N(
          'That night the shepherds sleep, properly, for the first time in a long while. Enkidu keeps watch, and you keep him company.',
        ),
        N(
          'He sits on the fold wall with a big stick across his knees. He does not need a lamp. He sees in the dark like the herd did.',
        ),
        EN(
          'The wolves come from there. The lions from over there. I know them. I used to drink with them.',
          'think',
        ),
        N(
          'Something moves out in the dark. A low grey shape slides along the edge of the grass, then another.',
        ),
        N(
          'Enkidu stands up on the wall and says something to them, not in words. The shapes stop, then turn and slip away.',
        ),
        EN('They know me too. They know whose side I am on now.', 'sad'),
      ],
      [
        ask(
          1,
          'science',
          'body parts help nocturnal animals survive',
          '4-LS1-1',
          [
            N(
              'Owls and many other night hunters are nocturnal, which means active at night. Which body part helps a nocturnal animal most?',
            ),
          ],
          [
            o(
              'Large eyes that gather light, and sharp hearing and smell',
              [
                N(
                  'Yes. Many night animals have big eyes, and great hearing and smell, to find their way in the dark.',
                ),
              ],
              true,
            ),
            o('Bright feathers', [
              N(
                'Bright colours would give them away. Night animals do better with big eyes and sharp senses.',
              ),
            ]),
            o('A loud voice', [
              N(
                'A loud voice would warn their prey. Night hunters rely on sharp eyes, ears and noses.',
              ),
            ]),
          ],
          'Learned how body parts help nocturnal animals find their way in the dark.',
        ),
      ],
      [
        ch('lamp', 'Hold the lamp up anyway.', [
          N('You hold up the lamp. He looks at it, and at you, and smiles.'),
          EN('That is for the sheep. So they know someone is here. Good.', 'happy'),
        ]),
        ch('sit', 'Sit beside him on the wall.', [
          N(
            'You sit beside him on the wall. Your Nubbin climbs into the gap between you, and falls asleep at once.',
          ),
        ]),
      ],
    ),
    sc(
      'a26-05-night-done',
      [
        N(
          'Every night after that, the shepherds sleep, and no lamb is lost. They start calling him “the watchman”.',
        ),
        N(
          'There are three folds, with twelve sheep in each, and every morning he counts them, out loud, and gets the same number.',
        ),
      ],
      [
        ask(
          1,
          'maths',
          'multiplication in word problems',
          '3.OA.A.3',
          [
            N(
              'There are three folds with twelve sheep in each. How many sheep does Enkidu guard in all?',
            ),
          ],
          [
            o('36', [N('Yes. Three groups of 12: 12 + 12 + 12 = 36.')], true),
            o('15', [N('That is 12 + 3. Three groups of 12 means 12 + 12 + 12 = 36.')]),
            o('24', [N('That is two folds. With three folds, it is 12 + 12 + 12 = 36.')]),
          ],
          'Multiplied three groups of twelve to find 36.',
        ),
      ],
    ),
    sc(
      'a26-05-complete',
      [
        N(
          'One morning a traveller passes the camp on his way to Uruk, and grumbles about the king who never rests.',
        ),
        EN('Someone should stand up to him.', 'angry'),
        SH('Someone should. Shall we go to the city, then, you and I?'),
        N('Enkidu looks at the steppe, and at the flocks, and at you. Then he nods.'),
      ],
      [
        think(
          3,
          'sel',
          'weighing what might go right and wrong before acting',
          'CASEL: Responsible decision-making',
          [
            N(
              'Enkidu wants to stand up to the king. What might go right, and what might go wrong, if he does?',
            ),
          ],
          [
            [
              'It might make the king stop, and the people could rest',
              [N('That is a fair answer. Standing up to unfairness can change things.')],
            ],
            [
              'The king might get angry and hurt someone',
              [
                N(
                  'That is a fair answer. A strong person who is challenged can react badly. It is good to think ahead.',
                ),
              ],
            ],
            [
              'Talking first would be better than fighting',
              [N('That is a fair answer. Starting with words keeps more doors open.')],
            ],
          ],
          'Thought about the possible good and bad results of standing up to someone powerful.',
        ),
      ],
    ),
  ],
);

gloss('a26-06-cups', 'steward', 'A person who looks after a big household and its servants.');
gloss('a26-08-elders', 'incense', 'A sweet-smelling smoke made by burning resin or wood.');
gloss('a26-08-complete', 'blessing', 'A kind wish for someone’s safety and good fortune.');
gloss(
  'a26-09-watch-done',
  'resin',
  'The sticky, sweet-smelling sap of some trees, such as cedars.',
);
gloss('a26-10-plea', 'mercy', 'Kindness shown to someone you have the power to hurt.');
gloss('a26-10-river', 'cubit', 'An old measure of length, about the length of a forearm.');

// ================================================================== A26-6 Ninsun's Dreams
const Q6 = quest(
  'a26-06',
  'Ninsun’s Dreams',
  {
    'a26-06-s1': {
      goal: 'Carry the cups to Ninsun’s hall in the palace.',
      hint: 'The steward at the palace kitchens needs a cup-bearer. Take the tray to the queen mother’s hall.',
    },
    'a26-06-s2': {
      goal: 'Stay and hear what Ninsun makes of the dreams.',
      hint: 'Stand by the fountain with the tray while Ninsun talks to her son.',
    },
  },
  [
    sc(
      'a26-06-cups',
      [
        N(
          'Back in Uruk, the palace steward is short of hands. He looks at you, and at your Nubbin, and gives you a tray of silver cups.',
        ),
        N(
          'The cups stand in three rows of four. Ninsun’s hall is cool and quiet, with a fountain, and the goddess sits beside it, in no hurry about anything.',
        ),
        N(
          'Gilgamesh is pacing in front of her, and for once he is not shouting. He looks like a boy who has had a bad night.',
        ),
        GI(
          'Mother, I dreamed again. A star fell out of the sky and landed beside me, like a rock.',
          'think',
        ),
        GI(
          'I tried to lift it and could not. Me! The city came out to stare. And I loved it. I held it as if it were a person.',
        ),
        N(
          'You hold out the tray. He takes a cup without looking, and drinks, and forgets to give it back.',
        ),
        N(
          'Your Nubbin counts the cups with one paw: eleven. It counts again, slowly, and gives the king a long look.',
        ),
      ],
      [
        ask(
          6,
          'maths',
          'multiplication as equal groups',
          '3.OA.A.1',
          [
            N(
              'The cups are in three rows of four. How many cups were on the tray before Gilgamesh took one?',
            ),
          ],
          [
            o('12', [N('Yes. Three rows of four is 4 + 4 + 4 = 12. Now there are 11.')], true),
            o('7', [N('That is 3 + 4. Three rows of four is 4 + 4 + 4 = 12.')]),
            o('34', [N('Careful: three rows of four is 4 + 4 + 4 = 12.')]),
          ],
          'Used three rows of four to find 12.',
        ),
      ],
      [
        ch('wait', 'Wait with the tray until he has finished.', [
          N(
            'You wait. Ninsun catches your eye over his shoulder, and the corner of her mouth goes up.',
          ),
        ]),
        ch('ninsun', 'Offer Ninsun a cup too.', [
          NI('Thank you. Somebody in this palace remembers the rest of us drink as well.'),
        ]),
      ],
    ),
    sc(
      'a26-06-cups-done',
      [
        NI('Sit down, my son. You are wearing a hole in my floor. Tell me the other dream too.'),
        N('Gilgamesh sits at last, still turning the cup in his hands.'),
      ],
      [
        ask(
          0,
          'literacy',
          'figurative language in dialogue',
          'L.3.4',
          [N('Ninsun says her son is “wearing a hole in my floor”. What does she really mean?')],
          [
            o(
              'He has been pacing up and down for ages',
              [
                N(
                  'Yes. She exaggerates to be funny. She means he has been walking up and down so much it feels as if he might wear the floor away.',
                ),
              ],
              true,
            ),
            o('There is a real hole in her floor', [
              N(
                'There is not. It is an exaggeration, a joke. She means he has been pacing a great deal.',
              ),
            ]),
            o('She wants him to dig a hole', [
              N('No. It is a joke about how much he has been pacing.'),
            ]),
          ],
          'Worked out the meaning of an exaggeration used as a joke.',
        ),
      ],
    ),
    sc(
      'a26-06-meaning',
      [
        GI(
          'There was an axe, lying in the street. A strange one. People were all round it. I loved that too, and wore it at my side.',
          'think',
        ),
        NI(
          'The star that fell, the axe in the street. They are the same thing, my son. They are a person.',
        ),
        NI(
          'A friend is coming to you. Strong as a star from heaven. He will stand beside you and save you, again and again.',
        ),
        GI('A friend? I have a whole city.'),
        NI('You have a city that is tired of you. That is not the same.', 'soft'),
        N(
          'Gilgamesh opens his mouth to argue, and shuts it again. He looks out of the window, towards the steppe.',
        ),
      ],
      [
        think(
          5,
          'sel',
          'a crowd is not the same as a friend',
          'CASEL: Relationship skills',
          [
            N(
              'Gilgamesh has a whole city around him, but Ninsun says he needs a friend. Is a crowd the same as a friend?',
            ),
          ],
          [
            [
              'No. A friend knows you and cares about you',
              [N('That is a fair answer. Many people can be near you without knowing you.')],
            ],
            [
              'Sometimes, if the crowd is kind',
              [
                N(
                  'That is a fair answer. A kind crowd is lovely. Ninsun says this one is tired of him, which is different.',
                ),
              ],
            ],
            [
              'Yes, because more people is better',
              [
                N(
                  'That is a fair answer to think about. But Gilgamesh is lonely among thousands. Closeness matters more than numbers.',
                ),
              ],
            ],
          ],
          'Thought about the difference between being surrounded by people and having a friend.',
        ),
      ],
      [
        ch('true', 'Tell him you think she is right.', [
          GI(
            'Do you? You have been in my city a week. Hm. You have probably seen more of it than I have.',
            'think',
          ),
        ]),
        ch('quiet', 'Say nothing, and refill his cup.', [
          N(
            'You refill his cup. He looks at it, then at you, as if he had just noticed someone was holding the tray.',
          ),
        ]),
      ],
    ),
    sc(
      'a26-06-complete',
      [
        GI('Who are you, anyway? Whose are you?'),
        Y('Nobody’s. I am new here.'),
        GI(
          'Well, stay new. Carry my cups. There are not many people who stand still long enough to hear my dreams.',
        ),
        N(
          'That night, for the first time since the new moon, the drum in the square stops before midnight.',
        ),
        N(
          'The moon over Uruk is half full now. When the games began, there was no moon at all.',
        ),
      ],
      [
        ask(
          4,
          'science',
          'the Moon’s cycle takes about a month',
          '5-ESS1-2',
          [
            N(
              'The people say the games began at the new moon. About how many days pass from one new moon to the next?',
            ),
          ],
          [
            o(
              'About 29 or 30 days',
              [
                N(
                  'Yes. The Moon takes about 29½ days to go through all its phases, from one new moon to the next. That is where we get the idea of a month.',
                ),
              ],
              true,
            ),
            o('About 7 days', [
              N(
                'That is about a quarter of the cycle, from new moon to first quarter. The whole cycle takes about 29½ days.',
              ),
            ]),
            o('A whole year', [
              N('A year is much longer. From new moon to new moon is about 29½ days.'),
            ]),
          ],
          'Learned that the Moon’s cycle takes about 29 and a half days.',
        ),
      ],
    ),
  ],
);

// ================================================================== A26-7 The Door
const Q7 = quest(
  'a26-07',
  'The Door',
  {
    'a26-07-s1': {
      goal: 'Meet Enkidu and Shamhat at the gate and bring them into the city.',
      hint: 'They are coming up the river road. Wait at the great gate.',
    },
    'a26-07-s2': {
      goal: 'Watch the two of them meet at the door.',
      hint: 'Stand back in the crowd. Keep your Nubbin out of the way.',
    },
  },
  [
    sc(
      'a26-07-gate',
      [
        N(
          'Enkidu comes up the river road in his borrowed clothes, with Shamhat beside him. People leave their work to stare.',
        ),
        TW(
          'Look at him! He is the king’s size exactly. He is like the king’s own shadow, only hairier.',
        ),
        TW('He was raised on milk from the wild. They say he can wrestle a lion.'),
        N('Enkidu sees you by the gate. His face breaks into a grin.'),
        EN('The water-carrier! With the little one that ran with my gazelles!', 'happy'),
        N('Your Nubbin, embarrassed, hides behind your leg.'),
        SH('He wants to meet your king. I have told him what to expect. He does not believe me.'),
      ],
      [
        ask(
          6,
          'social-studies',
          'why cities grew beside rivers',
          'D2.Geo.2.3-5',
          [
            N(
              'The road runs beside the river, and so does the city. Why did cities like Uruk grow up beside rivers?',
            ),
          ],
          [
            o(
              'Rivers gave water to drink and to grow crops, and a way to travel and carry goods',
              [
                N(
                  'Yes. Water for people and fields, plus boats for trade. A river was a road, a well and a farm all at once.',
                ),
              ],
              true,
            ),
            o('Rivers kept cities warm in winter', [
              N('Not the main reason. Cities grew beside rivers for water, crops and travel.'),
            ]),
            o('There was nowhere else to build', [
              N(
                'There was plenty of land. Water, crops and boat travel are what drew people to the rivers.',
              ),
            ]),
          ],
          'Learned why early cities grew beside rivers.',
        ),
      ],
      [
        ch('warn', 'Warn him the king is very strong.', [
          EN('Good. So am I. Somebody should tell him so.'),
        ]),
        ch('gentle', 'Tell him the king is lonely.', [
          EN('Lonely?'),
          N(
            'He thinks about that for a long time. He knows the word from the steppe, when the herd ran.',
          ),
        ]),
      ],
    ),
    sc(
      'a26-07-gate-done',
      [
        N(
          'The crowd follows you through the streets, getting bigger, all the way to the great square.',
        ),
        N('Five people follow at the gate. At each corner, the crowd doubles.'),
      ],
      [
        ask(
          1,
          'maths',
          'a doubling pattern',
          '4.OA.C.5',
          [
            N(
              'Five people at the gate, then 10, then 20 at the corners. If the crowd doubles once more, how many people follow?',
            ),
          ],
          [
            o('40', [N('Yes. The rule is “double”: 5, 10, 20, 40.')], true),
            o('30', [
              N(
                'That would be adding 10 each time. The rule here is doubling, so 20 doubled is 40.',
              ),
            ]),
            o('25', [
              N('That would be adding 5 each time. The rule is doubling: 20 doubled is 40.'),
            ]),
          ],
          'Continued a doubling pattern: 5, 10, 20, 40.',
        ),
      ],
    ),
    sc(
      'a26-07-door',
      [
        N(
          'Gilgamesh comes striding across the square towards a great door. Enkidu steps into the doorway and plants his feet.',
        ),
        GI('Out of my way.'),
        EN('No.'),
        N(
          'Gilgamesh stops. Nobody has said that word to him in his whole life, and he does not seem to know what to do with it.',
        ),
        N(
          'Then they grab each other like two bulls and wrestle in the street. The doorposts shake and the wall trembles.',
        ),
        N(
          'They wrestle up the street and down it, and neither will give way, and neither will let go.',
        ),
        N(
          'At last Gilgamesh’s knee touches the ground, and everyone gasps. It has never touched the ground before.',
        ),
      ],
      [
        ask(
          6,
          'science',
          'balanced and unbalanced forces',
          '3-PS2-1',
          [
            N(
              'For a long time, neither friend can move the other. Then Gilgamesh’s knee touches the ground. What changed?',
            ),
          ],
          [
            o(
              'The forces stopped being balanced, and one push became stronger',
              [
                N(
                  'Yes. Equal pushes in opposite directions cancel out, and nothing moves. When one gets stronger, the balance breaks.',
                ),
              ],
              true,
            ),
            o('The forces disappeared', [
              N(
                'Forces do not disappear. They stop balancing out. One push became stronger than the other.',
              ),
            ]),
            o('The ground pushed Gilgamesh over by itself', [
              N(
                'The ground does push back, but what changed was the balance between the two friends’ pushes.',
              ),
            ]),
          ],
          'Learned that balanced forces cancel, and unbalanced forces change motion.',
        ),
      ],
      [
        ch('hold', 'Hold your Nubbin back from the fight.', [
          N(
            'You scoop up your Nubbin before it can join in. It wriggles in your arms, cheering on both sides at once.',
          ),
        ]),
        ch('cover', 'Pull the woman from the square out of the dust.', [
          N(
            'You pull her back under an awning. She coughs, and grips your arm, and does not take her eyes off the door.',
          ),
        ]),
      ],
    ),
    sc(
      'a26-07-door-done',
      [
        N(
          'Gilgamesh kneels in the dust, breathing hard, with Enkidu over him. For a moment the whole square holds its breath.',
        ),
        N(
          'Then Gilgamesh starts to laugh, and Enkidu laughs too. He holds out a hand, and the king takes it.',
        ),
      ],
      [
        think(
          1,
          'sel',
          'why a fight can end in friendship',
          'CASEL: Relationship skills',
          [N('They fought hard, and ended as friends. Why do you think that happened?')],
          [
            [
              'Each had finally met someone who would not give way',
              [
                N(
                  'That is a fair answer. Gilgamesh had never been refused. Respect can grow from being matched.',
                ),
              ],
            ],
            [
              'They had both been lonely',
              [
                N(
                  'That is a fair answer. Both were alone in their own way, and the fight ended it.',
                ),
              ],
            ],
            [
              'It is not usual: fights do not often end like this',
              [
                N(
                  'That is a fair answer. Usually they do not. Here, both could laugh at themselves, which helps.',
                ),
              ],
            ],
          ],
          'Thought about why a fight ended in friendship, and what is unusual about it.',
        ),
      ],
    ),
    sc(
      'a26-07-complete',
      [
        GI('Where have you been all my life?', 'happy'),
        EN('Eating grass, mostly.'),
        N('That evening Ninsun takes Enkidu’s face in her hands and looks at it for a long time.'),
        NI(
          'You were the star. You were the axe. From today you are my son, and his brother.',
          'soft',
        ),
        N(
          'Enkidu, who has never had a mother, does not know where to put his hands. Your Nubbin shows him by climbing into her lap.',
        ),
      ],
      [
        ask(
          4,
          'literacy',
          'what a small detail shows about a character',
          'RL.4.3',
          [
            N(
              'Enkidu “does not know where to put his hands”. What does that small detail show about how he feels?',
            ),
          ],
          [
            o(
              'He is shy and unsure, because he has never been mothered',
              [N('Yes. A small action can show a big feeling without anyone saying it.')],
              true,
            ),
            o('He is angry', [
              N(
                'He is not angry here. Not knowing where to put your hands shows shyness and surprise.',
              ),
            ]),
            o('He is bored', [
              N('Not bored. The detail shows he is overwhelmed by a kindness he has never known.'),
            ]),
          ],
          'Read a character’s feelings from a small detail of what he does.',
        ),
      ],
    ),
  ],
);

// ================================================================== A26-8 The Cedar Forest
const Q8 = quest(
  'a26-08',
  'The Cedar Forest',
  {
    'a26-08-s1': {
      goal: 'Bring water to the friends on the palace roof.',
      hint: 'Fill the jar at the palace well and climb to the roof.',
    },
    'a26-08-s2': {
      goal: 'Go with the friends to the elders, then up to Ninsun’s roof.',
      hint: 'The elders meet at the city gate. Ninsun prays on the roof at sunrise.',
    },
    'a26-08-s3': {
      goal: 'Pack the bread for the road while the smiths forge the axes.',
      hint: 'Go to the bakehouse, then carry the packs to the gate.',
    },
  },
  [
    sc(
      'a26-08-plan',
      [
        N(
          'You carry a water jar up to the palace roof. The two friends are lying on their backs, looking at the sky.',
        ),
        GI('Enkidu. Only the gods last for ever. A person gets a short life, and then it is over.'),
        GI(
          'So let us do something they will remember. The Cedar Forest. Humbaba, who guards it. Let us go.',
          'happy',
        ),
        N('Enkidu sits up so fast he knocks the jar. You catch it.'),
        EN(
          'I know that forest. I ran in its edges, when I was wild. Humbaba is as old as the mountains. When he shouts, the cedars bend.',
          'shock',
        ),
        GI('Are you frightened? You? I will go first.'),
      ],
      [
        think(
          5,
          'sel',
          'what lasts: a famous name, or what we do for others',
          'CASEL: Self-awareness',
          [
            N(
              'Gilgamesh wants to make a name that lasts longer than he does. What do you think lasts longer: a famous name, or something you did for other people?',
            ),
          ],
          [
            [
              'A famous name, because people repeat it',
              [
                N(
                  'That is a fair answer. Names do travel. Gilgamesh’s did, for over four thousand years.',
                ),
              ],
            ],
            [
              'What you did for others, because it changes their lives',
              [
                N(
                  'That is a fair answer. A kindness can live on in people who never knew your name.',
                ),
              ],
            ],
            [
              'Maybe both, but they are not the same thing',
              [
                N(
                  'That is a fair answer. A name tells people who. A deed tells them what you were like.',
                ),
              ],
            ],
          ],
          'Thought about whether a famous name or a kind deed lasts longer.',
        ),
      ],
      [
        ch('why', 'Ask why he wants to go.', [
          GI('To make a name. A name that lasts longer than I do. What else is there?'),
          N('Enkidu looks at you, as if hoping you might know.'),
        ]),
        ch('water', 'Pour them both a cup and say nothing.', [
          N(
            'You pour them both a cup. Enkidu holds his without drinking, the way people hold something to stop their hands shaking.',
          ),
        ]),
      ],
    ),
    sc(
      'a26-08-plan-done',
      [
        N('You pour from the jar, which holds two litres. Each cup holds 250 millilitres.'),
        EN('If you go, I will go. Somebody has to bring you back.', 'sad'),
      ],
      [
        ask(
          1,
          'maths',
          'units of volume: litres and millilitres',
          '4.MD.A.1',
          [
            N(
              'The jar holds 2 litres, which is 2000 millilitres. Each cup holds 250 millilitres. How many cups can you fill?',
            ),
          ],
          [
            o(
              '8',
              [N('Yes. 250 × 4 = 1000, so a litre fills 4 cups, and two litres fill 8.')],
              true,
            ),
            o('4', [N('That is one litre’s worth. The jar holds two litres, so 4 + 4 = 8 cups.')]),
            o('10', [N('Check: 10 × 250 = 2500, which is more than 2000. It is 8 cups.')]),
          ],
          'Converted litres to millilitres and divided to find eight cups.',
        ),
      ],
    ),
    sc(
      'a26-08-elders',
      [
        N(
          'The elders of Uruk sit on their benches by the gate. They hear Gilgamesh out, and shake their heads, all together.',
        ),
        EL(
          'You are young, Gilgamesh. Your heart runs ahead of you. You do not know what you are talking about.',
        ),
        EL(
          'Let Enkidu go first. He knows the road. And come back to us. We have got used to you.',
          'soft',
        ),
        N(
          'At sunrise Ninsun climbs her roof in her best robe and crown. She lifts incense to the sun god Shamash.',
        ),
        NI(
          'Shamash, my son cannot sit still, and you made him so. Now he is going a long way, to a fight he does not know.',
          'sad',
        ),
        NI('Watch over him. Let the long days go fast for him. And bring him home.'),
        N('The sun climbs a little higher, and is very bright. You decide that is a yes.'),
      ],
      [
        ask(
          2,
          'social-studies',
          'listening to people who have experience',
          'D2.Civ.8.3-5',
          [
            N(
              'The elders say Enkidu should lead, because he knows the road. Why is it wise to listen to someone with experience?',
            ),
          ],
          [
            o(
              'They have seen what can go wrong, and can help us avoid it',
              [
                N(
                  'Yes. Experience is knowledge from having been there. Good leaders listen to it, even when they are bold.',
                ),
              ],
              true,
            ),
            o('Older people are always right', [
              N(
                'Not always. But those who have walked the road know things we do not. Listening helps us decide.',
              ),
            ]),
            o('It is never worth it', [
              N(
                'Listening costs little. Gilgamesh does not quite follow this advice, as we will see.',
              ),
            ]),
          ],
          'Talked about why it is wise to listen to someone with experience.',
        ),
      ],
      [
        ch('bow', 'Bow your head while she prays.', [
          N('You bow your head. Beside you your Nubbin does too, and peeks.'),
        ]),
        ch('watch', 'Watch the sun come up.', [
          N(
            'You watch the sun. It is enormous, and gold, and seems to be looking straight back at the roof.',
          ),
        ]),
      ],
    ),
    sc(
      'a26-08-elders-done',
      [
        NI(
          'Enkidu. You are not my son by birth, but I am giving him to you to look after. Bring him home.',
          'soft',
        ),
        N('The sun is clear of the horizon now, over the east side of the city.'),
      ],
      [
        ask(
          1,
          'science',
          'the Sun rises in the east',
          '5-ESS1-2',
          [N('Ninsun prays to the rising sun. In which direction does the Sun rise?')],
          [
            o(
              'East',
              [N('Yes. The Sun rises in the east and sets in the west, because the Earth spins.')],
              true,
            ),
            o('West', [N('That is where it sets. The Sun rises in the east.')]),
            o('North', [N('Not north. The Sun rises in the east and sets in the west.')]),
          ],
          'Learned that the Sun rises in the east.',
        ),
      ],
    ),
    sc(
      'a26-08-pack',
      [
        N(
          'All morning the smiths’ hammers ring. They cast axes for the friends, and swords so heavy two men groan to lift each.',
        ),
        N(
          'Your job is bread. You pack twenty-four flat loaves into six packs, the same number in each, with dates and onions and a pot of oil.',
        ),
        N(
          'You pack them the way your Nubbin likes its fruit: the soft things on top, so nothing gets squashed.',
        ),
        GI('Bread? I am going to face a monster. I do not need bread.'),
        EN(
          'You will need bread. You always need bread. That is the first thing I learned about people.',
        ),
        N('Enkidu takes a pack from you, and checks it, and nods.'),
      ],
      [
        ask(
          5,
          'maths',
          'division: sharing equally',
          '3.OA.A.3',
          [
            N(
              'Twenty-four loaves go into six packs, the same number in each. How many loaves in one pack?',
            ),
          ],
          [
            o('4', [N('Yes. 24 ÷ 6 = 4, because 6 × 4 = 24.')], true),
            o('6', [N('Check: 6 packs of 6 would be 36. It is 4 in each, because 6 × 4 = 24.')]),
            o('18', [N('That is 24 − 6. Division asks how many in each pack: 24 ÷ 6 = 4.')]),
          ],
          'Divided 24 loaves equally into six packs.',
        ),
      ],
      [
        ch('extra', 'Pack an extra loaf, just in case.', [
          EN('Good. That one is for coming home.'),
        ]),
        ch('water', 'Fill the waterskins too.', [
          N(
            'You fill the waterskins at the well. Water-carrier: it is your job now, and you are good at it.',
          ),
        ]),
      ],
    ),
    sc(
      'a26-08-complete',
      [
        N(
          'The whole city comes out to the gate to see them off. The elders give their blessings, and a lot of advice.',
        ),
        EL(
          'Let Enkidu go ahead. Trust him. And take the water-carrier. Somebody sensible ought to go.',
        ),
        N(
          'So you go too, with your Nubbin on the pack. The wall of Uruk gets smaller behind you, and then it is gone.',
        ),
      ],
      [
        ask(
          0,
          'literacy',
          'the meaning of an unfamiliar word',
          'L.3.4',
          [N('The elders give their “blessings”. What is a blessing?')],
          [
            o(
              'A kind wish for someone’s safety and good fortune',
              [N('Yes. A blessing is a hope for someone’s good, said out loud.')],
              true,
            ),
            o('A piece of advice about what to pack', [
              N('That is advice. A blessing is a kind wish, such as “go safely”.'),
            ]),
            o('A kind of bread', [
              N('Ha! Not bread, though the bread is kind too. A blessing is a kind wish.'),
            ]),
          ],
          'Learned the meaning of the word “blessing”.',
        ),
      ],
    ),
  ],
);

// ================================================================== A26-9 Dreams on the Mountain
const Q9 = quest(
  'a26-09',
  'Dreams on the Mountain',
  {
    'a26-09-s1': {
      goal: 'Make camp on the mountain and keep the fire.',
      hint: 'Gather brush on the slope, then build the fire in the hollow by the well.',
    },
    'a26-09-s2': {
      goal: 'Keep the watch through the nights on the road.',
      hint: 'Sit up by the fire while the friends sleep.',
    },
  },
  [
    sc(
      'a26-09-fire',
      [
        N(
          'They walk fifty leagues a day, which would take anyone else a month and a half. You and your Nubbin trot to keep up.',
        ),
        N(
          'Each evening Gilgamesh climbs a mountain and pours out flour as a gift, and asks for a dream. Then you make camp.',
        ),
        N(
          'You dig a well, and build the fire, and Enkidu builds a little shelter of brush so the king can sleep out of the wind.',
        ),
        N('In the night Gilgamesh sits bolt upright.'),
        GI(
          'Enkidu! Was that you? Something woke me, and I am cold all over. I dreamed a mountain fell on me, and pinned me like a fly.',
          'shock',
        ),
        EN(
          'A good dream! A very good dream. The mountain is Humbaba, and he will fall. We will stand on him.',
          'happy',
        ),
      ],
      [
        ask(
          2,
          'science',
          'what a fire needs to burn',
          '4-PS3-2',
          [
            N(
              'You build the fire up. A fire gives out heat and light. What does it need to keep burning?',
            ),
          ],
          [
            o(
              'Fuel such as wood, air, and enough heat',
              [
                N(
                  'Yes. Take away fuel, air or heat, and a fire goes out. Pile the brush loosely so air can get in.',
                ),
              ],
              true,
            ),
            o('Only wood', [
              N(
                'Wood is the fuel, but a fire also needs air and heat. Pile it loosely so air flows through.',
              ),
            ]),
            o('Only water', [N('Water puts fires out! A fire needs fuel, air and heat.')]),
          ],
          'Learned that a fire needs fuel, air and heat.',
        ),
      ],
      [
        ch('fire', 'Build the fire up higher.', [
          N(
            'You pile on more brush. The fire jumps up, and the dark backs off a little, and Gilgamesh lies down again.',
          ),
        ]),
        ch('blanket', 'Put your blanket over the king.', [
          N(
            'You put your blanket over him, and he does not notice. In the morning he will think he dreamed that too.',
          ),
        ]),
      ],
    ),
    sc(
      'a26-09-fire-done',
      [
        N(
          'Enkidu waits until the king is snoring. Then he looks at you across the fire, and his face is not happy at all.',
        ),
      ],
      [
        ask(
          0,
          'sel',
          'noticing feelings hidden behind words',
          'CASEL: Social awareness',
          [
            N(
              'Enkidu told the king it was a good dream, but his face is not happy. What does that tell you?',
            ),
          ],
          [
            o(
              'He is hiding how worried he really is',
              [
                N(
                  'Yes. Faces often tell the truth when words do not. Noticing helps us be a better friend.',
                ),
              ],
              true,
            ),
            o('He is sleepy', [
              N(
                'He might be. But a worried face looks different from a sleepy one. This one is hiding worry.',
              ),
            ]),
            o('He is angry with the king', [
              N('He is not angry. He is protecting the king, and hiding his own fear.'),
            ]),
          ],
          'Noticed that someone’s face can show feelings that their words hide.',
        ),
      ],
    ),
    sc(
      'a26-09-watch',
      [
        N('Every night it is the same. A mountain, a dream, a cold wake in the dark.'),
        N('Gilgamesh dreams of a wild bull, of thunder, of a sky that rains down fire and ash.'),
        N('And every morning Enkidu says, cheerfully, it is a good dream, the best dream yet.'),
        N(
          'On the fifth night, while the king sleeps, Enkidu sits down beside you at the fire. Dusk fell at seven, and dawn will not come until five.',
        ),
        EN('They were bad dreams. All of them. You know that.', 'sad'),
        EN(
          'But you cannot send a man to a fight with a bad dream on him. So I tell him it was good. That is what friends are for.',
        ),
      ],
      [
        ask(
          3,
          'maths',
          'time intervals',
          '3.MD.A.1',
          [
            N(
              'Dusk falls at 7 in the evening, and dawn comes at 5 in the morning. How long is the night watch?',
            ),
          ],
          [
            o(
              '10 hours',
              [N('Yes. 7 pm to midnight is 5 hours, and midnight to 5 am is 5 more: 10 hours.')],
              true,
            ),
            o('12 hours', [N('That would be 7 pm to 7 am. Dawn is at 5 am, so it is 10 hours.')]),
            o('2 hours', [
              N(
                'That is the gap between 5 and 7 as numbers. The night runs from 7 pm to 5 am, so 10 hours.',
              ),
            ]),
          ],
          'Worked out a time interval across midnight: 7 pm to 5 am is 10 hours.',
        ),
        think(
          5,
          'sel',
          'when a kind lie and honesty pull apart',
          'CASEL: Responsible decision-making',
          [
            N(
              'Enkidu tells the king each dream was good, though he knows it was bad. Was that kind, dishonest, or both?',
            ),
          ],
          [
            [
              'Kind, because it gave the king courage',
              [
                N(
                  'That is a fair answer. Enkidu’s aim is to help his friend face the day. The cost is that the king does not hear the truth.',
                ),
              ],
            ],
            [
              'Dishonest, because the king deserves the truth',
              [
                N(
                  'That is a fair answer. Being told the truth is a form of respect. It might also have let the king choose differently.',
                ),
              ],
            ],
            [
              'Both, and it is hard to say which matters more',
              [
                N(
                  'That is a fair answer. Many honest people have faced this. Honesty and kindness can pull in different directions.',
                ),
              ],
            ],
          ],
          'Thought about whether a kind untruth is kind, dishonest or both.',
        ),
      ],
      [
        ch('right', 'Tell him he did the right thing.', [
          EN('Did I? I hope so. I am new at friends.'),
        ]),
        ch('you', 'Ask him who tells him the dreams are good.', [
          EN('Nobody. That is all right. I have you, sitting up with the fire.'),
        ]),
      ],
    ),
    sc(
      'a26-09-watch-done',
      [
        N('He falls asleep sitting up, with his head on his knees. You keep the fire till dawn.'),
        N(
          'In the morning, on the skyline, there is a dark green line, and a smell on the wind like a sawmill: cut wood, and sweet, sticky resin. The Cedar Forest.',
        ),
      ],
      [
        ask(
          1,
          'literacy',
          'language that appeals to the senses',
          undefined,
          [N('Which phrase in the last line appeals most to the sense of smell?')],
          [
            o(
              '“a smell on the wind like a sawmill: cut wood, and sweet, sticky resin”',
              [
                N(
                  'Yes. It names smells directly. Good writers use senses so we feel we are there.',
                ),
              ],
              true,
            ),
            o('“a dark green line”', [
              N('That appeals to sight, because it describes colour and shape.'),
            ]),
            o('“on the skyline”', [N('That tells us where, but not how it smells.')]),
          ],
          'Picked out words that appeal to the sense of smell.',
        ),
      ],
    ),
    sc(
      'a26-09-complete',
      [
        N(
          'The cedars are taller than the wall of Uruk. Their shade is so cool and deep it looks like water. Brown cones lie scattered in the needles.',
        ),
        GI('There. Did I not say? Good dreams, every one.', 'happy'),
        N(
          'Enkidu says nothing. He puts his hand flat on the first cedar, as if to say sorry to it.',
        ),
      ],
      [
        ask(
          2,
          'science',
          'conifers and how they reproduce',
          '3-LS1-1',
          [N('Cedars are conifers. Which statement about conifers is true?')],
          [
            o(
              'Many keep their needles all year, and their seeds grow in cones',
              [
                N(
                  'Yes. Cedar, pine and fir are conifers. Seeds inside cones fall and, if they land well, grow into new trees.',
                ),
              ],
              true,
            ),
            o('They lose all their leaves every autumn', [
              N(
                'Many deciduous trees do. Most conifers keep their needles, which is why forests of them stay green.',
              ),
            ]),
            o('They have flowers and fruit like apples', [
              N('Conifers make seeds in cones, not in fruit. Apples are flowering trees.'),
            ]),
          ],
          'Learned that cedars are conifers whose seeds grow in cones.',
        ),
      ],
    ),
  ],
);

// ================================================================== A26-10 Humbaba
const Q10 = quest(
  'a26-10',
  'Humbaba',
  {
    'a26-10-s1': {
      goal: 'Follow the friends into the Cedar Forest.',
      hint: 'Keep to Humbaba’s path between the cedars, and stay behind Enkidu.',
    },
    'a26-10-s2': {
      goal: 'Stand by while Humbaba begs, and decide what you will say.',
      hint: 'Stay close to the friends. Choose what to say when Gilgamesh looks round.',
    },
    'a26-10-s3': {
      goal: 'Help send the great cedar down the river to Uruk.',
      hint: 'Carry the ropes to the riverbank and help lash the raft.',
    },
  },
  [
    sc(
      'a26-10-forest',
      [
        N(
          'Humbaba’s path runs straight into the forest, wide and clean, as if someone swept it every morning. Somebody does.',
        ),
        N(
          'The cedars smell of resin and old shade, and no birds sing here. Your Nubbin walks so close to your heels it treads on them.',
        ),
        GI('This one. The tallest we have passed. Let us see if he comes.'),
        N(
          'Gilgamesh lifts his axe and cuts into a cedar. The sound goes off through the forest like a dropped plate.',
        ),
        N('Far away, something roars. It is not loud, exactly. It is everywhere, like weather.'),
        HU('Who has come into my forest? Who has cut my tree?', 'angry'),
        N(
          'Then he is there between the trees: huge, and ancient, with a face like a coil of wool.',
        ),
      ],
      [
        notice(
          6,
          'social-studies',
          'cedar forests grow on the mountains of Lebanon today',
          'D2.Geo.2.3-5',
          [
            N(
              'Nobody knows exactly where the Cedar Forest was. Many people think of the mountains of Lebanon, where cedar trees still grow today.',
            ),
            N('(Find Lebanon on Nova’s map.)'),
          ],
          'Learned that cedar forests still grow in the mountains of Lebanon, and found it on a map.',
        ),
      ],
      [
        ch('still', 'Stand very still.', [
          N(
            'You stand very still. His eyes pass over you and your Nubbin and move on: you were never the ones he wanted.',
          ),
        ]),
        ch('hide', 'Pull your Nubbin behind a cedar.', [
          N(
            'You pull your Nubbin behind a cedar. The bark is warm, and you feel the tree breathe, or you think you do.',
          ),
        ]),
      ],
    ),
    sc(
      'a26-10-forest-done',
      [
        GI('Shamash! Now! You promised my mother!', 'shock'),
        N('Your heart is going like a drum. Your Nubbin’s fur is standing on end.'),
      ],
      [
        ask(
          1,
          'health',
          'slow breathing calms a frightened body',
          'CASEL: Self-management',
          [N('Your heart is racing and you feel frightened. Which helps your body calm down?')],
          [
            o(
              'A slow breath in, and a longer breath out',
              [
                N(
                  'Yes. A long breath out tells your body it is safe. Try it now: in for four, out for six.',
                ),
              ],
              true,
            ),
            o('Holding your breath', [
              N(
                'That makes your heart work harder. Slow breathing, with a long breath out, helps.',
              ),
            ]),
            o('Breathing as fast as you can', [
              N(
                'That can make you feel dizzier. A slow breath in and a longer one out helps more.',
              ),
            ]),
          ],
          'Practised slow breathing to calm a frightened body.',
        ),
      ],
    ),
    sc(
      'a26-10-plea',
      [
        SS('I hear.'),
        N(
          'The voice comes out of the sun. Then the winds come: thirteen great winds from every side, roaring through the cedars.',
        ),
        N(
          'They pin Humbaba where he stands, like a hand holding down a leaf. He cannot go forward, and he cannot go back.',
        ),
        HU(
          'Gilgamesh. Let me live. I will be your servant. I will cut the cedars for you myself, as many as you want.',
          'sad',
        ),
        HU(
          'This forest is all I have. The god Enlil gave it to me to keep. I have kept it since before your city had a wall.',
        ),
        N(
          'Gilgamesh lowers his axe a little and looks at Humbaba for a long time. Something in his face is changing.',
        ),
        EN(
          'Do not listen to him, my friend. Finish it. Before the great gods hear and stop you. Make your name.',
          'angry',
        ),
        N(
          'Gilgamesh turns his head, and looks at you. Of everyone in the forest, it is you he looks at.',
        ),
      ],
      [
        think(
          7,
          'sel',
          'mercy, fear and the cost of a hard choice',
          'CASEL: Responsible decision-making',
          [
            N(
              'Humbaba begs for his life. Enkidu says to finish it. Whatever you say could change what happens. What would you weigh up before you answer?',
            ),
          ],
          [
            [
              'That Humbaba is begging, and cannot hurt anyone now',
              [
                N(
                  'That is a fair answer. Mercy looks hardest at someone who can no longer fight back.',
                ),
              ],
            ],
            [
              'That Enkidu knows the forest, and may be right to be afraid',
              [
                N(
                  'That is a fair answer. Enkidu’s fear is real. It is worth asking if fear is a good guide to a choice.',
                ),
              ],
            ],
            [
              'That a choice like this cannot be undone',
              [
                N(
                  'That is a fair answer. When something cannot be taken back, it deserves the slowest thinking.',
                ),
              ],
            ],
          ],
          'Thought about mercy and a hard choice that cannot be undone.',
        ),
      ],
      [
        ch(
          'spoke',
          'Speak for Humbaba: let him go.',
          [
            Y(
              'Let him go. He is only doing what he was told. He is keeping his trees, like you keep your wall.',
            ),
            N(
              'Enkidu stares at you, and Gilgamesh’s axe drops lower. For a long breath, nobody moves.',
            ),
          ],
          { 'a26-humbaba': 'spoke' },
        ),
        ch(
          'silent',
          'Say nothing.',
          [
            N(
              'You say nothing; you do not know what is right. You hold on to your Nubbin, and the wind roars, and Gilgamesh looks away.',
            ),
          ],
          { 'a26-humbaba': 'silent' },
        ),
        ch(
          'agreed',
          'Agree with Enkidu.',
          [
            Y('Enkidu is right. He knows this forest. If he says finish it, finish it.'),
            N('Enkidu nods at you, grim. Gilgamesh lifts his axe again.'),
          ],
          { 'a26-humbaba': 'agreed' },
        ),
      ],
    ),
    sc(
      'a26-10-plea-done',
      [
        N(
          'Whatever anyone says, Gilgamesh has already decided. He steps forward into the wind, and Enkidu goes with him.',
        ),
        N('You turn your face away, into your Nubbin’s fur.'),
        N(
          'The wind drops, all thirteen winds at once. And the Cedar Forest goes quiet, the deep quiet of a held breath let go.',
        ),
        N(
          'Humbaba has died, and it cannot be undone. Whatever you chose, it is all right to feel uneasy.',
        ),
      ],
      [
        ask(
          3,
          'sel',
          'it is all right to feel uneasy, and to share the feeling',
          'CASEL: Self-awareness',
          [N('You feel uneasy, and the forest is quiet. What could help you most right now?')],
          [
            o(
              'Staying close to someone you trust, and saying how you feel',
              [N('Yes. Hard feelings get lighter when someone is near, and when we say them out loud.')],
              true,
            ),
            o('Pretending nothing is wrong', [
              N('That keeps the feeling inside. Sharing it with someone you trust helps more.'),
            ]),
            o('Running away from everyone', [
              N('Being alone makes it heavier. Staying near someone you trust helps more.'),
            ]),
          ],
          'Learned that it is all right to feel uneasy, and that sharing a feeling helps.',
        ),
      ],
    ),
    sc(
      'a26-10-river',
      [
        N(
          'Afterwards nobody talks much. The friends cut cedars, and Enkidu cuts the tallest of all, whose top scraped the sky.',
        ),
        EN(
          'We will make a door of it. Seventy-two cubits high. For Enlil’s temple. So he is not angry with us.',
          'sad',
        ),
        N(
          'A cubit is about the length of a forearm, roughly half a metre. You carry ropes and lash logs.',
        ),
        N(
          'Your Nubbin carries one twig at a time, very solemnly, to the raft. Gilgamesh says nothing at all, and keeps looking back at the forest.',
        ),
        N(
          'At last the raft is lashed, and the friends push it out into the Euphrates. It turns once, slowly, and sets off home.',
        ),
      ],
      [
        ask(
          2,
          'maths',
          'converting old units to metres',
          '4.MD.A.1',
          [
            N(
              'A cubit is about half a metre. The door is 72 cubits high. About how many metres is that?',
            ),
          ],
          [
            o(
              '36 metres',
              [N('Yes. Half of 72 is 36. That is as tall as a twelve-storey building.')],
              true,
            ),
            o('72 metres', [
              N(
                'That would be one metre per cubit. A cubit is only half a metre, so halve it: 36.',
              ),
            ]),
            o('144 metres', [
              N('That would be doubling. A cubit is half a metre, so halve 72 to get 36.'),
            ]),
          ],
          'Converted 72 cubits to about 36 metres by halving.',
        ),
        ask(
          4,
          'science',
          'what causes wind',
          '4-PS3-2',
          [N('Thirteen winds roared through the cedars. What causes wind in the real world?')],
          [
            o(
              'The Sun heats the Earth unevenly, and air moves from cooler places to warmer ones',
              [
                N(
                  'Yes. Warm air rises, cooler air rushes in, and we feel moving air as wind. Heat from the Sun drives it.',
                ),
              ],
              true,
            ),
            o('Trees waving their branches', [
              N(
                'It is the other way round. Wind makes trees wave. The Sun’s uneven heating makes the wind.',
              ),
            ]),
            o('The Moon pulling on the air', [
              N(
                'The Moon pulls on the seas, to make tides. For wind, it is the Sun heating the Earth unevenly.',
              ),
            ]),
          ],
          'Learned that wind comes from the Sun heating the Earth unevenly.',
        ),
      ],
      [
        ch('cone', 'Keep a cedar cone in your pocket.', [
          N(
            'You pick up a cedar cone and keep it in your pocket. It smells of the forest the whole way home.',
          ),
        ]),
        ch('look', 'Look back at the forest until it is gone.', [
          N(
            'You look back until the forest is only a dark line, and then not even that. Somebody should.',
          ),
        ]),
      ],
    ),
    sc(
      'a26-10-complete',
      [
        N(
          'The river carries you home through the reeds. Herons stand on one leg and watch the raft go by.',
        ),
        N('Gilgamesh has made his name. He does not look as if it fits him quite as he expected.'),
      ],
      [
        ask(
          1,
          'literacy',
          'theme: what a story is really about',
          'RL.4.2',
          [
            N(
              'Gilgamesh has the name he wanted, but it does not fit as he expected. Which theme does that suggest?',
            ),
          ],
          [
            o(
              'Getting what you want can feel different from what you imagined',
              [
                N(
                  'Yes. A theme is an idea a story keeps returning to. Here, it is that winning does not always feel like winning.',
                ),
              ],
              true,
            ),
            o('Names are always more important than people', [
              N('The story hints at the opposite. Gilgamesh looks uneasy with his new name.'),
            ]),
            o('Rivers are always safer than forests', [
              N(
                'That is true of nothing in particular. The theme is about the feeling after getting what you wanted.',
              ),
            ]),
          ],
          'Identified a theme: getting what you want can feel different from what you imagined.',
        ),
      ],
    ),
  ],
);

gloss('a26-13-dream', 'council', 'A group of important people who meet to decide something.');
gloss('a26-14-statue', 'memorial', 'Something made or kept so that a person will be remembered.');
gloss('a26-15-road', 'wilderness', 'Wild land where few or no people live.');
gloss(
  'a26-15-road-done',
  'arachnid',
  'An animal with eight legs and no wings, such as a spider or scorpion.',
);
gloss('a26-15-gate', 'terrible', 'In old stories, so great or strange that it makes you afraid.');

// ================================================================== A26-11 Ishtar
const Q11 = quest(
  'a26-11',
  'Ishtar',
  {
    'a26-11-s1': {
      goal: 'Fetch warm water for the king to wash.',
      hint: 'Heat water in the palace kitchen and carry it to the king’s rooms.',
    },
    'a26-11-s2': {
      goal: 'Stand by while the goddess Ishtar makes her offer.',
      hint: 'Stay by the door with your Nubbin. Do not get between a goddess and a king.',
    },
  },
  [
    sc(
      'a26-11-wash',
      [
        N(
          'Home in Uruk, Gilgamesh asks for warm water. You carry it up, jar after jar, until the king’s rooms are full of steam.',
        ),
        N(
          'He washes the forest out of his long hair and shakes it down his back. He puts on clean clothes and his crown.',
        ),
        GI('There. Do I look like a king who has made a name?'),
        EN('You look like a king who has had a bath. That is a start.'),
        N(
          'Gilgamesh throws a wet cloth at him. It is the first time either of them has laughed since the forest.',
        ),
        N(
          'Then the light in the room goes gold and strange, as if the sun had come indoors. Your Nubbin’s fur stands up.',
        ),
      ],
      [
        ask(
          4,
          'science',
          'condensation: some changes can be reversed',
          undefined,
          [N('Steam rises from the hot water. If the steam touches a cold window, what happens?')],
          [
            o(
              'It cools and turns back into drops of water',
              [
                N(
                  'Yes. Heating turns water into steam, and cooling turns steam back into water. That kind of change can be reversed.',
                ),
              ],
              true,
            ),
            o('It turns into stone', [
              N('No. Steam cools back into drops of water on cold glass.'),
            ]),
            o('It disappears for ever', [
              N('The water is still there. It cools into tiny drops of liquid on the window.'),
            ]),
          ],
          'Learned that cooling turns steam back into water, a change that can be reversed.',
        ),
      ],
      [
        ch('cloth', 'Hand Enkidu a dry cloth.', [
          N('You hand Enkidu a dry cloth. He holds it like a shield, and peers at the gold light.'),
        ]),
        ch('jar', 'Put down the jar and stand by the door.', [
          N(
            'You put the jar down and stand by the door. Whoever is coming, you would like to be near the way out.',
          ),
        ]),
      ],
    ),
    sc(
      'a26-11-offer',
      [
        N(
          'The goddess Ishtar stands in the doorway, bright as the evening star. Her eyes are fixed on Gilgamesh, and nobody else.',
        ),
        IS(
          'Gilgamesh. You are beautiful. Stay with me. Be my king, and I will give you a chariot of lapis and gold.',
          'happy',
        ),
        IS(
          'Kings will kneel to you. Your flocks will double every spring. You will want for nothing.',
        ),
        N('Gilgamesh looks at her for a long moment. Then he shakes his head.'),
        GI('Everyone you have loved has come to grief. Why would I be different?', 'think'),
        N('Ishtar’s face goes very still. The gold light in the room turns the colour of a storm.'),
        IS('You will be sorry, king of Uruk.', 'angry'),
      ],
      [
        ask(
          4,
          'social-studies',
          'weighing what you give up against what you gain',
          'D2.Eco.1.3-5',
          [
            N(
              'Ishtar offers a golden chariot and much more, but it comes with a price. What is wise to do when someone offers you a great gift?',
            ),
          ],
          [
            o(
              'Think about what you would give up as well as what you would gain',
              [
                N(
                  'Yes. Every choice has a cost: when you choose one thing, you give up another. Gilgamesh looks at the whole price.',
                ),
              ],
              true,
            ),
            o('Take it, because gifts are free', [
              N('Gifts often come with strings. It is wise to ask what it would cost you.'),
            ]),
            o('Refuse everything on principle', [
              N(
                'Not always wise either. The point is to weigh what you gain against what you give up.',
              ),
            ]),
          ],
          'Learned that every choice has a cost, and that it helps to weigh what we give up as well as what we gain.',
        ),
      ],
      [
        ch('bow', 'Bow low as she passes.', [
          N(
            'You bow low as she sweeps past. You feel her look at you, briefly, as if at a fly on a wall.',
          ),
        ]),
        ch('nubbin', 'Keep your Nubbin out of her way.', [
          N(
            'You scoop your Nubbin out of her path. The hem of her robe crackles past it like summer lightning.',
          ),
        ]),
      ],
    ),
    sc(
      'a26-11-offer-done',
      [EN('That was not clever, brother.', 'shock'), GI('No. But it was true.')],
      [
        think(
          1,
          'sel',
          'whether a true thing can also be unkind',
          'CASEL: Self-awareness',
          [
            N(
              'Gilgamesh said something true that made a goddess furious. Can something be true and still unkind?',
            ),
          ],
          [
            [
              'Yes. Truth can still be said gently or harshly',
              [
                N(
                  'That is a fair answer. How we say a true thing can matter as much as what we say.',
                ),
              ],
            ],
            [
              'No. If it is true, it is not unkind',
              [
                N(
                  'That is a fair answer. Honesty is a kindness of a kind. But Ishtar was hurt, which suggests the way of saying matters too.',
                ),
              ],
            ],
            [
              'It depends why you say it',
              [
                N(
                  'That is a fair answer. A true thing said to help is not the same as one said to hurt.',
                ),
              ],
            ],
          ],
          'Thought about whether a true thing can be unkind, and how the way we say it matters.',
        ),
      ],
    ),
    sc(
      'a26-11-complete',
      [
        N(
          'High above the city, in a place you can only half see, Ishtar weeps in front of her father Anu, king of the gods.',
        ),
        N(
          'She asks him for the Bull of Heaven. At first he says no, but she will not stop asking.',
        ),
        N('In the end Anu gives her the Bull.'),
      ],
      [
        ask(
          1,
          'literacy',
          'a character’s motive',
          'RL.3.3',
          [
            N(
              'Why does Ishtar ask her father for the Bull of Heaven? Think about how she felt after Gilgamesh’s answer.',
            ),
          ],
          [
            o(
              'She is hurt and angry, and wants to punish him',
              [
                N(
                  'Yes. Her motive is wounded pride turned to anger. Knowing why a character acts helps us understand the story.',
                ),
              ],
              true,
            ),
            o('She is bored', [N('Not bored. She wept in front of her father, so she was hurt.')]),
            o('She wants to help Uruk', [
              N('If she did, she would not call a Bull to its streets. Her motive is anger.'),
            ]),
          ],
          'Explained a character’s motive from how she felt.',
        ),
      ],
    ),
  ],
);

// ================================================================== A26-12 The Bull of Heaven
const Q12 = quest(
  'a26-12',
  'The Bull of Heaven',
  {
    'a26-12-s1': {
      goal: 'Get the children in the market away from the cracks.',
      hint: 'Lead them up the wall stairs, away from the river side of the market.',
    },
    'a26-12-s2': {
      goal: 'Watch from the wall as the friends face the Bull together.',
      hint: 'Stay on the wall with the children. Keep them back from the edge.',
    },
  },
  [
    sc(
      'a26-12-bull',
      [
        N(
          'It comes down out of the sky on the river side of town: a bull the size of a temple, the colour of thunderclouds.',
        ),
        N(
          'It snorts, and the ground cracks open, and a hundred market stalls tip into the hole. It snorts again, and the river leaps its banks.',
        ),
        TW('The children! Somebody get the children!', 'shock'),
        N(
          'There are twelve of them, stuck by the fruit stalls. You know the way: up the wall stairs, minding the third one.',
        ),
        N(
          'You can lead two at a time. Your Nubbin runs ahead and stops on every step to look back, so the smallest ones have something to follow.',
        ),
      ],
      [
        ask(
          4,
          'maths',
          'division in a word problem',
          '3.OA.A.3',
          [
            N(
              'There are twelve children, and you lead two at a time. How many trips up the stairs do you need?',
            ),
          ],
          [
            o('6', [N('Yes. 12 ÷ 2 = 6, because 2 × 6 = 12.')], true),
            o('10', [N('That is 12 − 2. Division asks how many twos fit into 12: 6.')]),
            o('24', [N('That is 12 × 2. To split 12 into pairs, divide: 12 ÷ 2 = 6.')]),
          ],
          'Divided twelve children into pairs to find six trips.',
        ),
      ],
      [
        ch('lead', 'Lead the children up the stairs.', [
          N('You lead them up, two at a time, holding hands in a long chain. Nobody lets go.'),
        ]),
        ch('carry', 'Carry the smallest one.', [
          N(
            'You lift the smallest child on to your hip. She grips your collar with both fists and does not cry once.',
          ),
        ]),
      ],
    ),
    sc(
      'a26-12-bull-done',
      [
        N(
          'From the top of the wall you can see it all: the Bull, the cracks, and two small figures running straight at it.',
        ),
        TW(
          'That is the king. And his brother. They are mad. They are both completely mad.',
          'shock',
        ),
      ],
      [
        think(
          1,
          'sel',
          'courage and recklessness',
          'CASEL: Self-awareness',
          [N('The friends run straight at the Bull. Was that brave, or foolish?')],
          [
            [
              'Brave, because they protected the city',
              [N('That is a fair answer. They went towards the danger to keep others safe.')],
            ],
            [
              'Foolish, because they could have been hurt',
              [
                N(
                  'That is a fair answer. Courage and carelessness can look the same from outside. The difference is often whether you thought first.',
                ),
              ],
            ],
            [
              'Both, depending on the reason',
              [
                N(
                  'That is a fair answer. Brave and foolish are not always opposites. It is worth asking what you are risking and why.',
                ),
              ],
            ],
          ],
          'Thought about the difference between bravery and recklessness.',
        ),
      ],
    ),
    sc(
      'a26-12-fight',
      [
        N(
          'Enkidu grabs the Bull by its horns. It throws froth in his face and lashes its great tail, and he holds on.',
        ),
        EN('Now, brother! Together!'),
        N(
          'Gilgamesh comes in from the side, and the dust goes up like a wall of its own, and you cannot see anything at all.',
        ),
        N('The children hold their breath. Your Nubbin covers its eyes, then uncovers one.'),
        N(
          'When the dust settles, the Bull of Heaven lies on its side in the square, quite still, like a hill after a landslide. Nobody has been hurt.',
        ),
        N(
          'Ishtar appears on the wall of Uruk, in a storm of gold. Enkidu glares up at her from the square.',
        ),
        EN('Go home! Leave our city alone! And take your storms with you!', 'angry'),
        N('Ishtar turns away with her women, and weeps for the Bull. Then she is gone.'),
      ],
      [
        ask(
          4,
          'literacy',
          'recognising a simile',
          'L.4.5',
          [
            N(
              '“Lies on its side, like a hill after a landslide.” Which words show this is a simile?',
            ),
          ],
          [
            o(
              '“like a hill”: it compares using “like”',
              [
                N(
                  'Yes. A simile compares two different things using “like” or “as”. A bull and a hill have little in common, except being huge and still.',
                ),
              ],
              true,
            ),
            o('“lies on its side”', [
              N('That just tells us what the Bull does. The comparison starts with “like”.'),
            ]),
            o('“after a landslide”', [
              N('That adds a time. The comparison itself is “like a hill”.'),
            ]),
          ],
          'Picked out the comparison word that makes a simile.',
        ),
      ],
      [
        ch('cheer', 'Cheer with the children.', [
          N(
            'You cheer, the children cheer, and somebody bangs a pot. The whole wall shakes with it.',
          ),
        ]),
        ch('quiet', 'Look at the Bull for a while.', [
          N(
            'You look at the Bull for a while. It came because someone was angry; it never chose to come at all.',
          ),
        ]),
      ],
    ),
    sc(
      'a26-12-complete',
      [
        N(
          'That night the friends ride through the streets of Uruk in a chariot. The people line the way, shouting their names.',
        ),
        GI('Whose names do we shout tonight? Whose?', 'happy'),
        TW('Gilgamesh! And Enkidu!'),
        N(
          'Enkidu waves. He catches sight of you in the crowd, and waves harder, until your Nubbin waves back with both arms.',
        ),
        N(
          'Scribes in the crowd are already pressing the night into clay, so that people far in the future can read about it.',
        ),
      ],
      [
        ask(
          4,
          'social-studies',
          'how we learn about the distant past',
          'D2.His.2.3-5',
          [
            N(
              'How do we know about people who lived thousands of years ago, such as the people of Uruk?',
            ),
          ],
          [
            o(
              'From the writings, buildings and objects they left behind',
              [
                N(
                  'Yes. Tablets, bricks, pots and walls are clues. Historians put them together like a puzzle.',
                ),
              ],
              true,
            ),
            o('Because they are still alive', [
              N('Not so! We learn from what they left behind: tablets, buildings and objects.'),
            ]),
            o('By guessing', [
              N('Historians do not just guess. They study tablets and objects as evidence.'),
            ]),
          ],
          'Learned that we know about the distant past from the writings and objects people left.',
        ),
      ],
    ),
  ],
);

// ================================================================== A26-13 The Gods' Council
const Q13 = quest(
  'a26-13',
  'The Gods’ Council',
  {
    'a26-13-s1': {
      goal: 'Sit with Enkidu when he wakes from his dream.',
      hint: 'He has called for you before dawn. Go to his room.',
    },
    'a26-13-s2': {
      goal: 'Go with Enkidu to the cedar door.',
      hint: 'He wants to see the great door at the temple. Walk him there.',
    },
  },
  [
    sc(
      'a26-13-dream',
      [
        N('Before dawn a servant shakes you awake. Enkidu is asking for you, and for the king.'),
        N(
          'He is sitting on the edge of his bed with the blanket round his shoulders. He is very pale.',
        ),
        EN(
          'I dreamed. The great gods sat in council: the sky god, the wind god, and Shamash. They were talking about us.',
          'sad',
        ),
        EN(
          'Because we killed Humbaba and the Bull of Heaven, one of us has to die. Enlil said so. And it will not be Gilgamesh. It will be me.',
        ),
        GI(
          'No. No. It was a dream. I will tell you it was a good one, the way you did for me.',
          'shock',
        ),
        N('Enkidu tries to smile at that. He does not quite manage it.'),
      ],
      [
        ask(
          5,
          'health',
          'what helps after a frightening dream',
          'CASEL: Self-management',
          [N('Enkidu has woken from a frightening dream. Which helps most?')],
          [
            o(
              'Telling someone, and slow breaths until the fear shrinks',
              [
                N(
                  'Yes. Saying a scary dream out loud makes it smaller, and slow breathing calms the body. Dreams are not predictions.',
                ),
              ],
              true,
            ),
            o('Keeping it secret so nobody worries', [
              N('Secrets can make fear grow. Telling someone you trust helps.'),
            ]),
            o('Never going to sleep again', [
              N(
                'Tiredness makes dreams harder to bear. Telling someone and slow breathing are better.',
              ),
            ]),
          ],
          'Learned what helps after a frightening dream: telling someone and slow breathing.',
        ),
      ],
      [
        ch('sit', 'Sit down on the bed beside him.', [
          N(
            'You sit down beside him, and the bed creaks. Your Nubbin climbs up on his other side.',
          ),
        ]),
        ch('water', 'Bring him a cup of water.', [
          N(
            'You bring him water. His hands shake, so you hold the cup with him until he has drunk.',
          ),
        ]),
      ],
    ),
    sc(
      'a26-13-dream-done',
      [
        N('Enkidu turns to look at you. He does not say anything at all.'),
        N(
          'He takes your hand, and holds it, quite hard, while the window goes from black to grey.',
        ),
      ],
      [
        think(
          1,
          'sel',
          'when silence is the kindest thing to give',
          'CASEL: Relationship skills',
          [
            N(
              'Enkidu says nothing, and holds your hand. When might silence be the best thing to give a friend?',
            ),
          ],
          [
            [
              'When words would not help, but company would',
              [N('That is a fair answer. Sometimes the most useful thing is to stay.')],
            ],
            [
              'When the person is not ready to talk',
              [N('That is a fair answer. Silence gives room to decide when to speak.')],
            ],
            [
              'Almost never: words are better',
              [
                N(
                  'That is a fair answer. Many people do find talking helps. It is worth asking your friend which they want.',
                ),
              ],
            ],
          ],
          'Thought about when silence and company are the kindest thing to give a friend.',
        ),
      ],
    ),
    sc(
      'a26-13-door',
      [
        N(
          'He wants to see the cedar door, so you walk him to the temple, slowly. It stands there, huge and fragrant and new.',
        ),
        EN(
          'Door. If I had known what you would cost me, I would have left you standing in your forest.',
          'angry',
        ),
        EN(
          'And the trapper. If he had left me alone at the water. And Shamhat, who taught me to talk. I curse them all.',
          'angry',
        ),
        N(
          'The sun comes up over the wall. It shines straight into the doorway, and the door’s long shadow stretches across the stones.',
        ),
        SS(
          'Enkidu. Why curse Shamhat? She gave you your first bread. She gave you clothes to wear.',
        ),
        SS(
          'She gave you Gilgamesh for a friend. And when you die, he will weep for you, and the whole city will.',
        ),
        N(
          'Enkidu stands very still in the sunlight. His face crumples, and then, slowly, it clears.',
        ),
      ],
      [
        ask(
          3,
          'science',
          'shadows change with the Sun’s height',
          '5-ESS1-2',
          [N('The rising Sun makes the door’s shadow long. When in the day are shadows shortest?')],
          [
            o(
              'Around midday, when the Sun is highest',
              [
                N(
                  'Yes. A low Sun, in the morning and evening, throws long shadows. A high Sun at midday makes them short.',
                ),
              ],
              true,
            ),
            o('At sunrise', [N('At sunrise the Sun is low, so shadows are long.')]),
            o('At midnight', [N('At midnight there is no sunlight to make a shadow.')]),
          ],
          'Learned that shadows are shortest around midday and longest when the Sun is low.',
        ),
      ],
      [
        ch('bread', 'Tell him she gave him bread, too, the first day.', [
          EN('She did. I licked it first. You were there.'),
        ]),
        ch('quiet', 'Stay quiet, and let him think.', [
          N(
            'You stay quiet. The sun is warm on the three of you: Enkidu, you, and your Nubbin, leaning on his leg.',
          ),
        ]),
      ],
    ),
    sc(
      'a26-13-door-done',
      [
        EN(
          'Shamhat. I take it back. I wish you a warm house, and a full table, and friends at your door.',
          'soft',
        ),
        EN('You found me in the grass and brought me home. I bless you.', 'soft'),
      ],
      [
        ask(
          1,
          'sel',
          'remembering the good someone did',
          'CASEL: Self-awareness',
          [
            N(
              'Enkidu takes back his curses once he remembers what Shamhat gave him. What does that show?',
            ),
          ],
          [
            o(
              'When we are hurting, remembering the good someone did can calm us down',
              [
                N(
                  'Yes. Pain makes us angry at the wrong people. Remembering kindness helps us find the right words again.',
                ),
              ],
              true,
            ),
            o('He changed his mind because he was told to', [
              N(
                'Shamash reminded him, but Enkidu chose to take the curses back. That took courage.',
              ),
            ]),
            o('He did not mean either one', [
              N(
                'He meant the curses when he said them. Taking them back shows he was strong enough to change.',
              ),
            ]),
          ],
          'Noticed how remembering kindness can calm anger and lead to taking words back.',
        ),
      ],
    ),
    sc(
      'a26-13-complete',
      [
        N('He woke before dawn at half past five. By noon he is too tired to stand.'),
        N('Gilgamesh carries him back to bed, as gently as he once held a star in a dream.'),
        GI(
          'Rest. Then you will be better. You always get better. You are the strongest man in the world, after me.',
        ),
        EN('After you. Of course.', 'soft'),
      ],
      [
        ask(
          1,
          'maths',
          'time intervals to the minute',
          '3.MD.A.1',
          [
            N(
              'Enkidu woke at 5:30 in the morning, and by noon (12:00) he is exhausted. How long has he been awake?',
            ),
          ],
          [
            o(
              '6 hours 30 minutes',
              [
                N(
                  'Yes. 5:30 to 11:30 is 6 hours, and 11:30 to 12:00 is another half an hour: 6 hours 30 minutes.',
                ),
              ],
              true,
            ),
            o('7 hours', [
              N(
                'Check: 5:30 plus 7 hours is 12:30, which is past noon. So it is 6 hours 30 minutes.',
              ),
            ]),
            o('5 hours 30 minutes', [
              N(
                'Close, but 5:30 plus 5 hours 30 is 11:00, and noon is an hour later. It is 6 hours 30 minutes.',
              ),
            ]),
          ],
          'Found a time interval: 5:30 to 12:00 is 6 hours 30 minutes.',
        ),
      ],
    ),
  ],
);

// ================================================================== A26-14 Twelve Days
const Q14 = quest(
  'a26-14',
  'Twelve Days',
  {
    'a26-14-s1': {
      goal: 'Sit with Enkidu while he is ill.',
      hint: 'Take water to his room, and stay.',
    },
    'a26-14-s2': {
      goal: 'Stay with Enkidu and Gilgamesh on the twelfth day.',
      hint: 'Stay in the room. There is nothing to do but be there.',
    },
    'a26-14-s3': {
      goal: 'Go with Gilgamesh when he has a statue made of his friend.',
      hint: 'Find the king in the smiths’ quarter, with the gold and the lapis.',
    },
  },
  [
    sc(
      'a26-14-sickbed',
      [
        N(
          'Enkidu lies ill for twelve days. Each day he is a little more tired, and a little further away.',
        ),
        N(
          'You fetch water and cool cloths. Mostly you just sit, on the stool by the bed, because he likes someone there.',
        ),
        N(
          'Gilgamesh sits on the other side, and does not sleep. You have never seen him sit still so long.',
        ),
        EN('Tell me about where you come from. Is it big, like Uruk?', 'soft'),
        Y('No. It is small. There is a garden, and a pond, and a hill.'),
        EN('A hill. Good. I like hills. You can see what is coming.'),
        N(
          'Your Nubbin lies on the end of the bed, across his feet, to keep them warm. He says it is the best blanket he has ever had.',
        ),
      ],
      [
        ask(
          2,
          'health',
          'how to care for someone who is ill',
          'CASEL: Social awareness',
          [N('Enkidu is ill. Which of these helps a poorly friend most?')],
          [
            o(
              'Water, rest, and someone calm sitting nearby',
              [N('Yes. Good care is often simple: comfort, water, rest and company.')],
              true,
            ),
            o('Lots of noise and visitors', [
              N('That would tire him out. A quiet room and a calm person help more.'),
            ]),
            o('Leaving him completely alone', [
              N('Rest matters, but so does having someone near. Calm company helps most.'),
            ]),
          ],
          'Talked about how to care for someone who is ill: comfort, water, rest and calm company.',
        ),
      ],
      [
        ch('grove', 'Tell him about the Grove.', [
          N(
            'You tell him about the Grove: the Nubbins, the fruit trees, the lanterns. He listens with his eyes shut, smiling.',
          ),
        ]),
        ch('hum', 'Hum the tune he sang at the shepherds’ fire.', [
          N(
            'You hum the tune he sang at the shepherds’ fire, and get it a bit wrong. He hums it back right, very quietly.',
          ),
        ]),
        ch('hand', 'Just hold his hand.', [
          N('You hold his hand. It is very big, and very warm, and it holds yours back.'),
        ]),
      ],
    ),
    sc(
      'a26-14-sickbed-done',
      [
        EN('Water-carrier. Will you do something for me, after?'),
        EN(
          'Look after the gazelles. Not the city ones. The wild ones, at the water hole. Make sure nobody digs pits there.',
          'soft',
        ),
        Y('I will.'),
      ],
      [
        ask(
          2,
          'science',
          'protecting a habitat',
          '3-LS4-4',
          [
            N(
              'Pits at the water hole put the gazelles in danger. Which would best protect the gazelles’ habitat?',
            ),
          ],
          [
            o(
              'Leaving the water hole and grazing land safe and undisturbed',
              [
                N(
                  'Yes. A habitat is where an animal finds food, water and shelter. Protecting it protects the animals.',
                ),
              ],
              true,
            ),
            o('Fencing the gazelles away from the water', [
              N('That would leave them thirsty. Protect the water hole instead.'),
            ]),
            o('Moving the water hole somewhere else', [
              N('Animals depend on the water that is there. It is better to protect it.'),
            ]),
          ],
          'Learned that protecting a habitat, such as a water hole, protects the animals that need it.',
        ),
      ],
    ),
    sc(
      'a26-14-death',
      [
        N(
          'On the twelfth day the house is very quiet. Even the street outside seems to walk on tiptoe.',
        ),
        N(
          'Gilgamesh has not left the bedside for days. You keep bringing water, and he keeps not drinking it.',
        ),
        EN('Brother. Do you remember the door? Your knee in the dust?', 'soft'),
        GI('I let you win.'),
        EN('You did not.', 'happy'),
        N(
          'He laughs, a little, and closes his eyes. Your Nubbin is curled against his hand, and it does not move, and neither do you.',
        ),
        N(
          'Some time in the afternoon his breathing goes slower, and softer. Then it stops, as gently as a door being closed.',
        ),
        N(
          'Enkidu has died. That means his body has stopped working, and it will not start again. It is not like sleep.',
        ),
        N(
          'Gilgamesh draws the cloth over his friend’s face, carefully, like a bride’s veil. He gets up and walks the room like a lioness who has lost her cubs.',
        ),
        GI(
          'Enkidu was my friend, my brother. He ran with me through the mountains and the cedar forest, and never once let go.',
          'sad',
        ),
        GI('Who will I tell my dreams to now?', 'sad'),
        N(
          'You do not have an answer. Nobody does. You sit on the floor by the bed, and wait, and the light goes.',
        ),
      ],
      [
        ask(
          11,
          'health',
          'what helps when someone dies',
          'CASEL: Self-awareness',
          [N('Enkidu has died. When we are grieving, what helps?')],
          [
            o(
              'Letting the feeling be, and staying close to people who care',
              [
                N(
                  'Yes. Grief has no timetable. Crying is allowed, and so is company. Remembering helps too.',
                ),
              ],
              true,
            ),
            o('Pretending we feel nothing', [
              N('Feelings do not go away when we hide them. They often ease when we share them.'),
            ]),
            o('Getting over it as quickly as possible', [
              N('Grief takes as long as it takes. There is no right speed.'),
            ]),
          ],
          'Talked plainly about death and what helps when we are grieving.',
        ),
      ],
    ),
    sc(
      'a26-14-death-done',
      [
        N(
          'Your Nubbin climbs down off the bed, and into Gilgamesh’s lap when at last he sits, and stays there.',
        ),
        N(
          'It does not do anything or make a sound all night. It is the kindest thing anyone does.',
        ),
      ],
      [
        ask(
          1,
          'sel',
          'staying close helps when words cannot',
          'CASEL: Relationship skills',
          [
            N(
              'The Nubbin does not say or do anything all night, and it is the kindest thing anyone does. Why?',
            ),
          ],
          [
            o(
              'It stays, which tells Gilgamesh he is not alone',
              [N('Yes. Sometimes being there is the whole kindness.')],
              true,
            ),
            o('It cannot talk, so it has no choice', [
              N('Perhaps. But it chose to stay close, which is a kind act.'),
            ]),
            o('Because noise would wake the city', [
              N(
                'That is a thoughtful guess, but the reason is simpler: it stays close, and he is not alone.',
              ),
            ]),
          ],
          'Noticed that staying close to someone who is grieving can be the kindest thing.',
        ),
      ],
    ),
    sc(
      'a26-14-statue',
      [
        N(
          'Gilgamesh calls every smith and jeweller in Uruk. He wants a statue of his friend, and it must be perfect.',
        ),
        N(
          'They make it of gold and lapis, and polish it until it shines. It has Enkidu’s big hands, and his grin.',
        ),
        N(
          'The whole city weeps for him: the elders, the shepherds, the woman from the square. Even the river seems to.',
        ),
        GI('He is not in it. Look at it. It is beautiful, and he is not in it.', 'sad'),
        N(
          'Gilgamesh stands in front of the statue for a long time. Then he looks at his own hands, as if they belonged to someone else.',
        ),
        GI(
          'I am going to die too, like him. One day my body will stop, and that will be the end of me. I cannot bear it.',
          'shock',
        ),
      ],
      [
        think(
          5,
          'social-studies',
          'whether a memorial is the same as the person',
          'D2.His.2.3-5',
          [
            N(
              'Gilgamesh says the statue is beautiful, but Enkidu is not in it. Is a memorial the same as the person?',
            ),
          ],
          [
            [
              'No. It helps us remember, but the person has died',
              [
                N(
                  'That is a fair answer. A memorial points to someone. It is not the same as them.',
                ),
              ],
            ],
            [
              'Partly, because the memory is part of the person',
              [
                N(
                  'That is a fair answer. Some people think that remembering keeps part of someone alive.',
                ),
              ],
            ],
            [
              'The stories we tell matter more than the statue',
              [
                N(
                  'That is a fair answer. Stories are carried by people, and they can change people long after.',
                ),
              ],
            ],
          ],
          'Thought about whether a memorial is the same as the person it remembers.',
        ),
      ],
      [
        ch('date', 'Put a date by the statue, for Enkidu.', [
          N(
            'You put a date at the statue’s feet. It is the first thing he ever ate from a person’s hand.',
          ),
        ]),
        ch('stand', 'Stand next to Gilgamesh.', [
          N(
            'You stand next to him. He does not look at you, but he does not send you away either.',
          ),
        ]),
      ],
    ),
    sc(
      'a26-14-complete',
      [
        GI(
          'There is one man the gods let live for ever. Uta-Napishtim, at the end of the world. I will find him. I will ask him how.',
        ),
        N(
          'He tears off his fine clothes, and pulls on rough lion skins, and walks out of the city gate without saying goodbye.',
        ),
        N(
          'You fill six waterskins, two litres each, and your Nubbin climbs on to the pack. Somebody has to carry the water.',
        ),
        N(
          'Between Gilgamesh, you and your Nubbin, three litres a day is all the water you can spare.',
        ),
      ],
      [
        ask(
          3,
          'maths',
          'a word problem with distance, volume and time',
          '4.MD.A.2',
          [
            N(
              'You carry six waterskins of two litres each. If the three of you drink three litres a day in all, how many days does the water last?',
            ),
          ],
          [
            o('4 days', [N('Yes. 6 × 2 = 12 litres, and 12 ÷ 3 = 4 days.')], true),
            o('6 days', [
              N('That is the number of waterskins. The total is 12 litres, and 12 ÷ 3 = 4 days.'),
            ]),
            o('2 days', [
              N('That is the litres per skin. The total is 12 litres, and 12 ÷ 3 = 4 days.'),
            ]),
          ],
          'Multiplied and divided to find how many days the water lasts.',
        ),
      ],
    ),
  ],
);

// ================================================================== A26-15 Lion Skins
const Q15 = quest(
  'a26-15',
  'Lion Skins',
  {
    'a26-15-s1': {
      goal: 'Follow Gilgamesh to the twin mountains of Mashu.',
      hint: 'Keep up with him across the wilderness. Carry the water.',
    },
    'a26-15-s2': {
      goal: 'Wait while the scorpion-man and his wife decide whether to let you through.',
      hint: 'Stand back behind Gilgamesh, and let him do the talking.',
    },
    'a26-15-s3': {
      goal: 'Walk the dark road of the sun holding on to Gilgamesh’s belt.',
      hint: 'Do not let go. Count the double-hours as you go.',
    },
  },
  [
    sc(
      'a26-15-road',
      [
        N(
          'Gilgamesh walks the wilderness in his lion skins. His beard grows ragged and his face grows thin.',
        ),
        N(
          'He does not talk. At night he lies awake and looks at the stars as if they had let him down.',
        ),
        GI(
          'I used to be afraid of nothing. Now I am afraid of everything, and most of all of dying.',
          'sad',
        ),
        N(
          'You give him water. He drinks it now, at least, a little, which you count as a good day.',
        ),
        N(
          'At last two mountains rise ahead, so tall they hold up the sky, with a gate between them where the sun goes in and out.',
        ),
        N(
          'Your Nubbin, on the pack, has gone very small and quiet. It puts its paws over its eyes, then uncovers one.',
        ),
      ],
      [
        ask(
          3,
          'sel',
          'what helps when a fear feels too big',
          'CASEL: Self-awareness',
          [
            N(
              'Gilgamesh’s fear is huge, and he has told nobody but you. What helps when a fear feels too big?',
            ),
          ],
          [
            o(
              'Naming it to someone, and taking small steps while staying close to others',
              [
                N(
                  'Yes. A fear said aloud is smaller, and small steps are easier than one giant leap.',
                ),
              ],
              true,
            ),
            o('Walking so far that you outrun it', [
              N(
                'That is what Gilgamesh is trying, and it is wearing him out. Sharing the fear helps more.',
              ),
            ]),
            o('Pretending it is not there', [
              N(
                'That is hard to keep up, and fears often shout louder when ignored. Naming it helps.',
              ),
            ]),
          ],
          'Talked about what helps when a fear feels too big.',
        ),
      ],
      [
        ch('eat', 'Make him eat some bread.', [GI('You sound like him.'), N('But he eats it.')]),
        ch('stars', 'Lie down and look at the stars with him.', [
          N(
            'You lie down beside him and look. After a while, without meaning to, he points out a star Enkidu liked.',
          ),
        ]),
      ],
    ),
    sc(
      'a26-15-road-done',
      [
        N(
          'By the gate there are two figures, keeping watch. They are people down to the waist, and scorpions below.',
        ),
        N(
          'A real scorpion has eight legs, two pincers and a curved tail with a sting. It is a cousin of the spider.',
        ),
      ],
      [
        ask(
          1,
          'science',
          'arachnids and their body parts',
          '4-LS1-1',
          [
            N(
              'Scorpions have eight legs and are related to spiders. What group of animals are they?',
            ),
          ],
          [
            o(
              'Arachnids',
              [
                N(
                  'Yes. Arachnids have eight legs, no wings and no antennae. Spiders, scorpions and mites are all arachnids.',
                ),
              ],
              true,
            ),
            o('Insects', [
              N('Insects have six legs. Scorpions have eight, so they are arachnids.'),
            ]),
            o('Crustaceans', [
              N('Crustaceans, such as crabs, mostly live in water. Scorpions are arachnids.'),
            ]),
          ],
          'Learned that scorpions are arachnids with eight legs, like spiders.',
        ),
      ],
    ),
    sc(
      'a26-15-gate',
      [
        N(
          'The scorpion-man is terrible to look at, with a glare that could bring down a mountain. His wife stands at his side.',
        ),
        SC('Look, wife. The one who comes to us has the body of a god.'),
        SW('Two parts of him, husband. One part is a man. You always forget the man.'),
        SC('And who is the small one with the water?'),
        N(
          'His wife looks at you, and at your Nubbin, and tilts her head. You think, from her face, that she rather likes small ones.',
        ),
        GI(
          'I am looking for Uta-Napishtim, who lives for ever. I want to ask him about life, and death.',
        ),
        SC(
          'No one has ever gone this way. Twelve double-hours of dark, with no light at all. Nobody comes out the other side.',
          'think',
        ),
        GI('I will go anyway. Nothing in your dark is worse than what I carry. Open the gate.'),
        SC('Then go, and come back safe. The gate is open.', 'soft'),
      ],
      [
        ask(
          4,
          'literacy',
          'words with older meanings',
          'L.3.4',
          [
            N(
              'The scorpion-man is “terrible to look at”. In an old story like this, what does “terrible” mean?',
            ),
          ],
          [
            o(
              'So great or strange that it makes you afraid',
              [
                N(
                  'Yes. Its old meaning was “causing terror”. Today we mostly use it to mean “very bad”.',
                ),
              ],
              true,
            ),
            o('Very untidy', [
              N('Not untidy. Here it means so frightening that you want to look away.'),
            ]),
            o('Rather silly', [N('Not silly. In old stories, “terrible” means causing terror.')]),
          ],
          'Learned an older meaning of the word “terrible”.',
        ),
      ],
      [
        ch('thank', 'Thank the scorpion-people.', [
          N(
            'You thank them, and the scorpion-man does not answer. His wife lifts one claw, very slightly, like a wave.',
          ),
        ]),
        ch('belt', 'Take hold of Gilgamesh’s belt before the dark.', [
          N('You take hold of his belt. He looks down at your hand, and then lets you.'),
        ]),
      ],
    ),
    sc(
      'a26-15-dark',
      [
        N(
          'The dark inside the mountain is thicker than any night. You cannot see your hand, or Gilgamesh.',
        ),
        N(
          'You can feel his belt, though, and the rough lion skin, and your Nubbin’s breath on your neck. You hold on.',
        ),
        GI('One double-hour. Two of your hours, water-carrier. Thick dark. Nothing.'),
        GI('Four. Five. Still nothing.', 'sad'),
        N('He counts aloud, so you know he is there. You count with him, so he knows you are.'),
        GI('Nine. I feel the north wind on my face.', 'think'),
        GI('Eleven. There is light. Look. Look!', 'shock'),
        N(
          'At the twelfth double-hour you step out into the sun, blinking, into a garden where the trees bear jewels.',
        ),
      ],
      [
        ask(
          7,
          'maths',
          'a unit of time and multiplication',
          '3.MD.A.1',
          [
            N(
              'A Babylonian double-hour was two of our hours. Twelve of them make how many of our hours?',
            ),
          ],
          [
            o(
              '24 hours, a whole day and night',
              [N('Yes: 12 × 2 = 24. They walked for a whole day, in the dark.')],
              true,
            ),
            o('12 hours', [
              N('That would be single hours. Each double-hour is two hours, so 12 × 2 = 24.'),
            ]),
            o('14 hours', [N('That is 12 + 2. Each of the twelve is two hours, so 12 × 2 = 24.')]),
          ],
          'Multiplied twelve double-hours by two to get 24 hours.',
        ),
      ],
    ),
    sc(
      'a26-15-dark-done',
      [
        N(
          'Your Nubbin is shivering, from the cold of the dark. Gilgamesh looks at it for a moment.',
        ),
        N(
          'Then he cuts a strip off the edge of his lion skin with his knife, and wraps it round the Nubbin’s shoulders like a cloak.',
        ),
      ],
      [
        ask(
          1,
          'science',
          'we see things when light reaches our eyes',
          '4-PS3-2',
          [N('Inside the mountain you could not see your own hand. Why not?')],
          [
            o(
              'There was no light to bounce off things and reach your eyes',
              [
                N(
                  'Yes. We see when light bounces off objects into our eyes. With no light, there is nothing to see.',
                ),
              ],
              true,
            ),
            o('Your eyes stopped working', [
              N('Your eyes were fine. With no light, nothing could be seen.'),
            ]),
            o('The dark is a solid wall', [
              N(
                'Dark is simply the lack of light. Nothing blocked your eyes. There was just no light.',
              ),
            ]),
          ],
          'Learned that we see when light bounces off objects into our eyes.',
        ),
      ],
    ),
    sc(
      'a26-15-complete',
      [
        GI('There. Now you look like a hero too. Do not let it go to your head.', 'happy'),
        N(
          'It is the first joke he has made since the twelve days. Your Nubbin wears the cloak with enormous pride.',
        ),
        N(
          'Beyond the jewelled garden there is a sea, and a little house beside it, with smoke coming from the chimney.',
        ),
      ],
      [
        think(
          1,
          'sel',
          'why a joke can be a sign of healing',
          'CASEL: Relationship skills',
          [
            N(
              'This is Gilgamesh’s first joke since Enkidu died. Why might a joke mean someone is beginning to feel a little better?',
            ),
          ],
          [
            [
              'It shows he can feel something besides sadness for a moment',
              [
                N(
                  'That is a fair answer. Grief rarely leaves all at once. A bit of light is a start.',
                ),
              ],
            ],
            [
              'It shows he is not thinking about Enkidu any more',
              [
                N(
                  'That is a fair answer to think about. But people can laugh and still miss someone terribly.',
                ),
              ],
            ],
            [
              'It is a way of thanking the Nubbin for its company',
              [N('That is a fair answer. A kindness returned can look like a joke.')],
            ],
          ],
          'Thought about why a first small joke can be a sign that someone is beginning to heal.',
        ),
      ],
    ),
  ],
);

gloss('a26-16-siduri', 'tavern', 'A place where travellers can sit, eat and drink.');
gloss('a26-16-stones', 'grief', 'The deep sadness we feel when someone we love has died.');
gloss('a26-16-complete', 'punt', 'To push a boat along with a long pole.');
gloss('a26-17-tale', 'immortal', 'Living for ever and never dying.');
gloss(
  'a26-17-snake',
  'shed',
  'To let something drop off or fall away. A snake sheds its old skin as it grows.',
);
gloss(
  'a26-18-foot-done',
  'heritage',
  'The history and treasures a people have inherited from the past.',
);

// ================================================================== A26-16 Siduri
const SIDURI_DONE_BEAT = ask(
  1,
  'health',
  'why sleep matters',
  'CASEL: Self-management',
  [
    N(
      'Your Nubbin falls asleep as soon as it can. Why is sleep so important, especially when we are sad or worn out?',
    ),
  ],
  [
    o(
      'Our bodies and brains recover and repair while we sleep',
      [
        N(
          'Yes. Sleep helps growing bodies, and helps feelings settle too. Children your age need about nine to twelve hours.',
        ),
      ],
      true,
    ),
    o('It makes time pass faster', [
      N('It can feel that way, but its real job is repair and rest.'),
    ]),
    o('It is only for babies', [N('Everyone needs sleep, and children need more than adults.')]),
  ],
  'Learned why sleep matters for bodies, brains and feelings.',
);

const Q16 = quest(
  'a26-16',
  'Siduri',
  {
    'a26-16-s1': {
      goal: 'Sit in Siduri’s tavern by the sea and hear what she says.',
      hint: 'Siduri has barred her door. Wait until she opens it.',
    },
    'a26-16-s2': {
      goal: 'Find Ur-Shanabi the boatman in the woods.',
      hint: 'Follow Gilgamesh into the woods by the shore. He has gone ahead.',
    },
    'a26-16-s3': {
      goal: 'Help cut punting poles for the crossing.',
      hint: 'Gather the straight poles Gilgamesh cuts, and stack them by the boat.',
    },
  },
  [
    sc(
      'a26-16-siduri',
      [
        N(
          'By the sea at the edge of the world there is a little tavern with a vine over the door. Siduri keeps it.',
        ),
        N(
          'She sees a wild man in lion skins coming up the beach, and bars her door, and climbs up on her roof to look.',
        ),
        SI(
          'Who are you, looking like that? Your cheeks are hollow. You look like someone who has walked a very long way.',
          'shock',
        ),
        GI(
          'I am Gilgamesh. My friend died. I cannot bear it. I am looking for the man who never dies.',
          'sad',
        ),
        N(
          'Siduri looks at him for a long time. Then she climbs down, and opens the door, and gives you each a stool and a cup.',
        ),
        SI(
          'Gilgamesh, when people were first made, dying was made with them. Everyone gets a share of it, even kings.',
        ),
        SI(
          'So have your supper while it is hot. Get clean. Sing badly, if you like. And look properly at whoever is next to you.',
        ),
        N('Gilgamesh turns his cup round and round. He is not listening, and he does not want to.'),
      ],
      [
        ask(
          6,
          'literacy',
          'the theme of a character’s advice',
          'RL.4.2',
          [
            N(
              'Siduri says: eat, get clean, sing, and look properly at the people next to you. What is the theme of her advice?',
            ),
          ],
          [
            o(
              'Life is short, so enjoy it and treasure the people you have',
              [
                N(
                  'Yes. A theme is the idea underneath. Siduri’s idea is that a short life is made rich by people.',
                ),
              ],
              true,
            ),
            o('Always do what you are told', [
              N('She is not ordering him around. She is offering a way to live well.'),
            ]),
            o('Keep searching, never give up', [
              N('That is what Gilgamesh believes. Siduri says the opposite: enjoy what you have.'),
            ]),
          ],
          'Identified the theme of Siduri’s advice: treasure the people you have in a short life.',
        ),
      ],
      [
        ch('listen', 'Tell Siduri you were listening.', [
          SI(
            'I know. You have got the face of someone who listens. It is rarer than you would think, in my trade.',
          ),
        ]),
        ch('paw', 'Hold your Nubbin’s paw.', [
          N(
            'You hold your Nubbin’s paw under the table. Siduri sees, and does not say anything, and refills your cup.',
          ),
        ]),
      ],
    ),
    sc(
      'a26-16-siduri-done',
      [
        N(
          'Your Nubbin climbs into your lap and goes to sleep there, warm and heavy. It does not need telling.',
        ),
        GI('Where is the boatman? The one who crosses the sea.', 'angry'),
        SI(
          'Ur-Shanabi. In the woods, by the shore. Be gentle with him. Be gentle with something, for once.',
        ),
      ],
      [SIDURI_DONE_BEAT],
    ),
    sc(
      'a26-16-stones',
      [
        N(
          'Gilgamesh runs ahead into the woods. By the time you catch up, there is a crash, and another, and then a silence.',
        ),
        N(
          'In a clearing, among broken pieces of stone, stands a boatman with a pole, staring at the king.',
        ),
        UR(
          'Those were the Stone Things. They crewed my boat. They could cross the Waters of Death without touching them.',
          'shock',
        ),
        UR('And you smashed them. Because you were sad, and they were there.'),
        N(
          'Gilgamesh looks at the pieces as if he has just woken up. His hands are grey with stone dust.',
        ),
        GI('I did not think.', 'sad'),
        UR('No. People do not, when they are grieving. I have ferried enough of them.', 'soft'),
      ],
      [
        think(
          6,
          'sel',
          'whether grief excuses harm',
          'CASEL: Self-management',
          [
            N(
              'Gilgamesh broke the Stone Things because of his grief. Does grief excuse breaking things?',
            ),
          ],
          [
            [
              'No, but it helps us understand why it happened',
              [N('That is a fair answer. An explanation is not an excuse. Both matter.')],
            ],
            [
              'Yes, because he could not help it',
              [
                N(
                  'That is a fair answer. Grief can overwhelm people. Ur-Shanabi is gentle about it, but the Stone Things are still gone.',
                ),
              ],
            ],
            [
              'It depends on whether he tries to make it right',
              [N('That is a fair answer. What we do after a mistake says a lot about us.')],
            ],
          ],
          'Thought about the difference between understanding why harm happened and excusing it.',
        ),
      ],
      [
        ch('pieces', 'Help gather the pieces into a pile.', [
          N(
            'You gather the pieces, carefully, into a neat pile. Ur-Shanabi watches, and nods, as if that was the right thing to do.',
          ),
        ]),
        ch('ask', 'Ask Ur-Shanabi if there is another way.', [
          UR('There is. It is harder. Everything is harder now. Can you hold an axe, little one?'),
        ]),
      ],
    ),
    sc(
      'a26-16-poles',
      [
        UR(
          'Cut poles. Long ones, straight, and a great many. Each pole may touch the water once, and then you let it go.',
        ),
        UR(
          'If your hand touches the Waters of Death, you will not need to find Uta-Napishtim. Understand?',
        ),
        N(
          'So Gilgamesh cuts, and you carry, and Ur-Shanabi trims. You stack the poles in rows of ten, six rows high.',
        ),
        N(
          'Your Nubbin, in its lion cloak, drags a small branch to the pile as its share. Ur-Shanabi trims that too, gravely.',
        ),
        N(
          'The work seems to do Gilgamesh good. By the end of the day he is sweating, and tired, and less wild in the eyes.',
        ),
        GI('Enkidu would have been better at this. He could fell a tree with a look.', 'soft'),
      ],
      [
        ask(
          3,
          'maths',
          'multiplication: rows and columns',
          '3.OA.A.3',
          [
            N(
              'The poles are stacked in six rows of ten, and each pole is used once. How many times can the boat be pushed along?',
            ),
          ],
          [
            o('60', [N('Yes. Six rows of ten is 6 × 10 = 60.')], true),
            o('16', [N('That is 6 + 10. Six rows of ten is 6 × 10 = 60.')]),
            o('600', [N('That is 6 × 100. Six rows of ten is 6 × 10 = 60.')]),
          ],
          'Multiplied six rows of ten to find 60.',
        ),
      ],
      [
        ch('ask', 'Ask him to tell you about Enkidu.', [
          N(
            'He tells you, while he works: the steppe, the door, the forest. He laughs twice, and it surprises him both times.',
          ),
        ]),
        ch('work', 'Just keep carrying.', [
          N(
            'You keep carrying, and he keeps cutting, side by side, in a rhythm. Some work is a kind of talking.',
          ),
        ]),
      ],
    ),
    sc(
      'a26-16-complete',
      [
        N(
          'At dawn you push off. The Waters of Death are black and flat and smell of nothing at all.',
        ),
        N(
          'Gilgamesh punts: each pole touches once, he lets it go, and you hand him the next. One by one, the stack shrinks.',
        ),
        N(
          'When the last pole is gone, he holds his lion skins up for a sail, and the wind takes you the rest of the way.',
        ),
        UR('There. The far shore. Somebody has been waiting a long time for someone to come.'),
      ],
      [
        ask(
          2,
          'science',
          'a sail changes wind into motion',
          '4-PS3-4',
          [N('The lion-skin sail catches the wind and the boat moves. What is the sail doing?')],
          [
            o(
              'Catching moving air, so the wind’s energy becomes the boat’s motion',
              [
                N(
                  'Yes. A sail is a device that turns the energy of moving air into motion, with no engine and no oars.',
                ),
              ],
              true,
            ),
            o('Making the water move by itself', [
              N('The water is not moving the boat here. The sail catches the wind.'),
            ]),
            o('Hiding the boat from the dark', [
              N('It is not there for hiding. It catches the wind to push the boat.'),
            ]),
          ],
          'Learned that a sail turns the energy of moving air into the motion of a boat.',
        ),
      ],
    ),
  ],
);

// ================================================================== A26-17 Uta-Napishtim
const Q17 = quest(
  'a26-17',
  'Uta-Napishtim',
  {
    'a26-17-s1': {
      goal: 'Hear Uta-Napishtim’s story on the far shore.',
      hint: 'Sit by his door with Gilgamesh and listen.',
    },
    'a26-17-s2': {
      goal: 'Watch over Gilgamesh while he tries to stay awake.',
      hint: 'Stay by him through the test. Help Uta-Napishtim’s wife with the loaves.',
    },
    'a26-17-s3': {
      goal: 'Watch Gilgamesh dive for the plant at the bottom of the sea.',
      hint: 'Stay in the boat with Ur-Shanabi and hold the rope.',
    },
    'a26-17-s4': {
      goal: 'Walk home with Gilgamesh and Ur-Shanabi.',
      hint: 'Stop with them at the pool on the road home.',
    },
  },
  [
    sc(
      'a26-17-tale',
      [
        N(
          'On the far shore an old man sits on a bench by his door, watching you come. He does not look like a god. He looks like a grandfather.',
        ),
        GI(
          'I want what you have. I want to be immortal, and never die. My friend died, and I cannot stop thinking about it.',
          'sad',
        ),
        UT(
          'Do we build houses to stand for ever? Do we make promises to last for ever? No. The river rises and goes down. Nothing stays.',
          'soft',
        ),
        GI('But you stayed. Tell me how.'),
        UT('Then sit. It is a long story, and it is mine.'),
        N(
          'He tells how the god Ea whispered through the reed wall of his house: tear it down, and build a boat. He took on board his family, craftsmen, and every kind of animal.',
        ),
        N(
          'The storm lasted six days and seven nights. Then there was only water, flat and grey, as far as anyone could see. He sent out a dove, and it came back; a swallow, and it came back. Then a raven, which did not.',
        ),
      ],
      [
        notice(
          6,
          'social-studies',
          'how the flood tablet was read again in 1872',
          'D2.His.2.3-5',
          [
            N(
              '(Nova’s atlas adds a note. Uta-Napishtim’s flood story was pressed into clay tablets that lay buried for more than two thousand years.)',
            ),
            N(
              '(In 1872 a man named George Smith, working on broken tablets at the British Museum in London, read part of it. Nobody had read those words in all that time.)',
            ),
          ],
          'Learned that the flood tablet lay buried for thousands of years and was read again in 1872.',
        ),
      ],
      [
        ch('animals', 'Ask what happened to the animals.', [
          UT(
            'They walked off down the gangplank and never thanked me, not one. I did not mind. That is animals.',
          ),
        ]),
        ch('wife', 'Ask his wife if she minds living for ever.', [
          UW(
            'Some days. The bread is good, though. And he still tells that story as if I was not there.',
          ),
        ]),
      ],
    ),
    sc(
      'a26-17-tale-done',
      [
        GI('Then the gods could do it again. For me.'),
        UT('Could they? Let us see if you can do something smaller first.'),
      ],
      [
        think(
          1,
          'sel',
          'whether living for ever would be a good thing',
          'CASEL: Self-awareness',
          [N('Gilgamesh wants never to die. Would you want to live for ever? Why, or why not?')],
          [
            [
              'Yes, there is so much to see and learn',
              [
                N(
                  'That is a fair answer. Curiosity is a good reason. It is worth asking what happens when everyone you love is gone.',
                ),
              ],
            ],
            [
              'No, because things matter more when they do not last',
              [
                N(
                  'That is a fair answer. Many people feel that a limited time makes each day count.',
                ),
              ],
            ],
            [
              'I am not sure, and that is honest',
              [
                N(
                  'That is a fair answer. It is a very big question, and wise people have disagreed about it for thousands of years.',
                ),
              ],
            ],
          ],
          'Thought about whether living for ever would be a good thing.',
        ),
      ],
    ),
    sc(
      'a26-17-test',
      [
        UT(
          'Stay awake for seven days and seven nights. If you cannot beat sleep, how will you beat death?',
        ),
        GI('Easily. I have hardly slept since…', 'angry'),
        N(
          'He sits down on the sand with his back against the house. Before he has finished yawning, he is fast asleep.',
        ),
        UW('Wake him. Let him go home the way he came.', 'soft'),
        UT(
          'He will only say he never slept. Bake him a loaf every day, and put it by his head. Then he will know.',
        ),
        N(
          'So every day she bakes a loaf, and every day you set it by his head, in a row. Your Nubbin guards them, mostly.',
        ),
      ],
      [
        ask(
          5,
          'maths',
          'subtraction in a word problem',
          '4.NBT.B.4',
          [
            N(
              'One loaf is baked each day and set in a row. How many days older is the first loaf than the fifth?',
            ),
          ],
          [
            o('4 days', [N('Yes. The fifth is baked four days after the first: 5 − 1 = 4.')], true),
            o('5 days', [
              N(
                'That counts the first loaf’s own day. From loaf 1 to loaf 5 is four steps: 5 − 1 = 4.',
              ),
            ]),
            o('1 day', [
              N('Each step is a day, and there are four steps between loaf 1 and loaf 5.'),
            ]),
          ],
          'Subtracted to find that the first loaf is four days older than the fifth.',
        ),
      ],
      [
        ch('wake', 'Try to wake him on the first day.', [
          N(
            'You shake his shoulder, and he snores. You have woken him from bad dreams before, but this is something else.',
          ),
        ]),
        ch('count', 'Help her count the loaves.', [
          N(
            'You count the loaves with her: one, two, three, all in a row. She teaches you how to tell how old bread is by tapping it.',
          ),
        ]),
        ch('sleep', 'Let him sleep. He needs it.', [
          N(
            'You let him sleep: he has not slept properly since the twelve days. Uta-Napishtim’s wife looks at you, and nods.',
          ),
        ]),
      ],
    ),
    sc(
      'a26-17-test-done',
      [
        N(
          'On the seventh day Uta-Napishtim touches him, and he wakes. The first loaf by his head is dry as a brick.',
        ),
        GI('I only just shut my eyes.'),
        N(
          'Then he sees the row: dry, leathery, soggy, furry with mould, grey, fresh, and one still warm. He puts his face in his hands.',
        ),
        N(
          'The warm loaf is missing one corner. Your Nubbin is looking very hard at the sea.',
        ),
        UT(
          'Ur-Shanabi. Take him to wash. Give him clean clothes. Clothes that will stay clean till he gets home.',
        ),
      ],
      [
        ask(
          3,
          'science',
          'some changes cannot be reversed',
          undefined,
          [
            N(
              'The loaves change as they age, and the mould is a kind of fungus. Which change cannot be undone?',
            ),
          ],
          [
            o(
              'Baking dough into bread',
              [
                N(
                  'Yes. Heat changes dough for good. You cannot turn a loaf back into dough, just as you cannot un-bake a cake.',
                ),
              ],
              true,
            ),
            o('Melting butter and letting it set again', [
              N('That one can be undone: cooling sets melted butter again.'),
            ]),
            o('Freezing water into ice and letting it melt', [
              N('That one can be undone too. Melting turns ice back to water.'),
            ]),
          ],
          'Learned that baking dough into bread is a change that cannot be reversed.',
        ),
      ],
    ),
    sc(
      'a26-17-plant',
      [
        N(
          'He is washed, and his hair is clean, and he wears new clothes. He looks like a king again, a tired one.',
        ),
        UW('You cannot send him home with nothing. He walked all that way.', 'soft'),
        UT(
          'Gilgamesh. I will tell you something hidden. There is a plant at the bottom of the sea, and its thorns are sharp.',
        ),
        UT('Eat it, and you are young again.'),
        N(
          'Gilgamesh ties heavy stones to his feet. You hold the rope in the boat, and he drops into the deep, and is gone.',
        ),
        N(
          'You count, and your Nubbin peers over the side at the green water. The rope goes slack, then tight.',
        ),
        N(
          'He comes up gasping, with his hands torn by the thorns, holding a plant with a pale flower like a star.',
        ),
      ],
      [
        ask(
          6,
          'literacy',
          'telling a simile from a metaphor',
          'L.4.5',
          [
            N(
              '“A pale flower like a star” compares two things. Which one is a metaphor, not a simile?',
            ),
          ],
          [
            o(
              '“The flower was a star.”',
              [N('Yes. A metaphor says one thing is another, with no “like” or “as”.')],
              true,
            ),
            o('“The flower was as pale as a star.”', [N('That one uses “as”, so it is a simile.')]),
            o('“The flower looked like a star.”', [N('That one uses “like”, so it is a simile.')]),
          ],
          'Told a metaphor from a simile.',
        ),
      ],
      [
        ch('pull', 'Haul him into the boat.', [
          N('You haul with Ur-Shanabi until he flops over the side, laughing, dripping, alive.'),
        ]),
        ch('hands', 'Look at his hands.', [
          N(
            'You look at his hands, and Ur-Shanabi wraps them in a strip of your spare cloth. Gilgamesh does not even notice.',
          ),
        ]),
      ],
    ),
    sc(
      'a26-17-plant-done',
      [
        GI(
          'Look at it, Ur-Shanabi. Look! I will take it home and try it on an old man first.',
          'happy',
        ),
        GI('And then I will eat it, and be young again. And everyone I love can have a share.'),
        N(
          'The plant has four equal leaves. He plans to share it with Ur-Shanabi, the elders, and the people of Uruk, and keep a quarter himself.',
        ),
      ],
      [
        ask(
          2,
          'maths',
          'unit fractions',
          '3.NF.A.1',
          [
            N(
              'Gilgamesh keeps a quarter of the plant. If the plant is split into four equal parts, how many parts is that?',
            ),
          ],
          [
            o(
              '1 part, because a quarter is 1/4',
              [N('Yes. A quarter is one of four equal parts: 1/4.')],
              true,
            ),
            o('2 parts', [N('Two of four is a half, 2/4 or 1/2. A quarter is just one part.')]),
            o('4 parts', [N('Four of four is the whole plant. A quarter is one part.')]),
          ],
          'Used four equal parts to find a quarter, or 1/4.',
        ),
      ],
    ),
    sc(
      'a26-17-snake',
      [
        N('You walk home, and Gilgamesh carries the plant in both hands, like a lamp.'),
        N(
          'After many leagues you come to a cool pool. Gilgamesh lays the plant on the bank and goes down to bathe.',
        ),
        N(
          'Your Nubbin goes to splash in the shallows. You sit on the bank, between the plant and the road.',
        ),
        N(
          'Something moves in the grass. A snake, long and quiet, slides out, smells the flower, and takes it in its mouth.',
        ),
        N(
          'Before anyone can move, it is gone. On the bank where the plant lay there is only a skin, empty and new-shed.',
        ),
        GI('No. No, no.', 'shock'),
        N(
          'Gilgamesh comes up out of the water, and looks at the skin, and sits down on the bank. And he weeps.',
        ),
      ],
      [
        ask(
          4,
          'science',
          'a snake sheds its skin as it grows',
          '3-LS1-1',
          [N('The snake leaves a shed skin on the bank. Why do snakes shed their skin?')],
          [
            o(
              'Their bodies grow, and the old skin gets too small',
              [
                N(
                  'Yes. A snake’s skin does not stretch much, so it sheds it as it grows. That is part of its life cycle.',
                ),
              ],
              true,
            ),
            o('They shed it to become young again', [
              N('That is the legend. In real life they shed the skin because they have grown.'),
            ]),
            o('They shed it when they are cold', [
              N('Cold does not make them shed. Growing does.'),
            ]),
          ],
          'Learned that snakes shed their skin as they grow.',
        ),
      ],
      [
        ch('sit', 'Sit down beside him.', [
          N('You sit down beside him. He weeps like a child, with his whole body, and you stay.'),
        ]),
        ch('skin', 'Pick up the snake’s old skin.', [
          N(
            'You pick up the skin, light as paper. The snake is bigger now somewhere, which is something.',
          ),
        ]),
      ],
    ),
    sc(
      'a26-17-snake-done',
      [
        GI(
          'All that way. My hands torn to pieces. And now a snake has it. I have given it to a snake.',
          'sad',
        ),
        UR('Yes. And now we go home anyway. Come on.'),
      ],
      [
        ask(
          1,
          'sel',
          'coping with a big disappointment',
          'CASEL: Self-awareness',
          [
            N(
              'Gilgamesh has lost the plant after so much effort. What helps most with a big disappointment?',
            ),
          ],
          [
            o(
              'Letting yourself feel it, with a friend walking beside you',
              [
                N(
                  'Yes. Disappointment needs room. A friend’s company, without lectures, makes it lighter.',
                ),
              ],
              true,
            ),
            o('Telling yourself you should not mind', [
              N('That tends to bury the feeling. Letting it be, with someone near, helps more.'),
            ]),
            o('Going straight back to trying again', [
              N('Sometimes, later. But first a disappointment deserves a pause.'),
            ]),
          ],
          'Talked about coping with a big disappointment: feel it, and keep company.',
        ),
      ],
    ),
    sc(
      'a26-17-complete',
      [
        N(
          'You walk on, the three of you, with your Nubbin dripping on the pack. It is a quiet walk.',
        ),
        N(
          'In your pocket you find a little reed boat, plaited tight. Uta-Napishtim’s wife must have made it while the loaves baked.',
        ),
        N(
          'People in the marshes of southern Iraq still build houses and boats from reeds today. Reeds are light, hollow and bendy, and they float.',
        ),
      ],
      [
        ask(
          2,
          'science',
          'properties of materials and why they suit a job',
          undefined,
          [N('Reeds are light, hollow and bendy. Which job are those properties best for?')],
          [
            o(
              'Building a boat that floats and a house that bends with the wind',
              [
                N(
                  'Yes. Lightness and hollow stems help a boat float, and bendiness helps reed walls move without snapping.',
                ),
              ],
              true,
            ),
            o('Making a hammer', [
              N('A hammer needs to be heavy and hard. Reeds are light and bendy.'),
            ]),
            o('Building a stone wall', [
              N('A stone wall needs hard, heavy material. Reeds suit light, floating things.'),
            ]),
          ],
          'Linked the properties of reeds to what they are used for.',
        ),
      ],
    ),
  ],
);

// ================================================================== A26-18 The Wall of Uruk
const FOOT_BEAT = ask(
  6,
  'science',
  'weathering: why kiln-fired brick lasts',
  '4-ESS2-1',
  [
    N(
      'Sun-dried bricks crumble in the rain, but kiln-fired bricks last for thousands of years. Why?',
    ),
  ],
  [
    o(
      'Firing changes the clay for good, so water cannot soften it',
      [
        N(
          'Yes. Baking clay in a kiln changes it so it will not turn back to mud. Rain slowly wears sun-dried brick away: that is called weathering.',
        ),
      ],
      true,
    ),
    o('Kiln bricks are painted to keep the rain off', [
      N('There is no paint. The firing itself changes the clay.'),
    ]),
    o('Sun-dried bricks are made of different mud', [
      N('The mud is the same. The difference is the fire in the kiln.'),
    ]),
  ],
  'Learned that firing changes clay for good, so kiln-fired bricks resist weathering far longer than sun-dried bricks.',
);

const FOOT_CHOICES = [
  ch('tablet', 'Ask her if the tablet is still in the box.', [
    BR('It is. Always will be, if people leave it be. That one, nobody takes.'),
  ]),
  ch('name', 'Ask if she will put her own mark on it too.', [
    BR('Me? No. I am on all the others.'),
  ]),
];

const BRICK_LINES = [
  BR('Now then. Every brick in this wall has someone’s hand in it. Want yours in?'),
  N(
    'She lays a fresh clay brick in front of you. You press your hand into it, and your Nubbin, after some thought, presses a paw.',
  ),
  BR(
    'Kiln-fired, this one. Sun-dried bricks crumble in the rain. Kiln-fired, they last for thousands of years.',
  ),
];

const HOME_LINES = [
  GI('Go home, water-carrier. Walk on your own wall. Look at its bricks.'),
  N(
    'The sun on the bricks gets warmer and yellower, until it is lamplight on a page, and your own table, and the Grove.',
  ),
  N(
    'In your hands there is a brick, still warm from the kiln. Your handprint is in it, and a small round pawprint beside.',
  ),
];

const COMPLETE_BEAT = think(
  2,
  'sel',
  'how people and things are remembered',
  'CASEL: Relationship skills',
  [
    N(
      'Gilgamesh went to the end of the world to avoid dying, and came home to his wall, where you pressed your hand into a brick. What do you think lasts?',
    ),
  ],
  [
    [
      'The wall, because it will stand for thousands of years',
      [N('That is a fair answer. Stone and brick outlast people. The wall of Uruk has, nearly.')],
    ],
    [
      'The story, because people keep telling it',
      [N('That is a fair answer. You are reading it about four thousand years later.')],
    ],
    [
      'What we do for the people who remember us',
      [N('That is a fair answer. A kindness is carried on by whoever received it.')],
    ],
  ],
  'Thought about what lasts: walls, stories, and the kindness we leave behind.',
);

const Q18 = quest(
  'a26-18',
  'The Wall of Uruk',
  {
    'a26-18-s1': {
      goal: 'Walk the wall of Uruk with Gilgamesh and Ur-Shanabi.',
      hint: 'Climb the wall stair. Mind the third step.',
    },
    'a26-18-s2': {
      goal: 'Go down to the foot of the wall, where the story started.',
      hint: 'The old brickmaker is waiting by the copper tablet box.',
    },
  },
  [
    sc(
      'a26-18-wall',
      [
        N(
          'You come home across the plain at evening. The wall of Uruk is gold in the low sun, and the river runs beside it.',
        ),
        N(
          'Gilgamesh stops. He looks at the wall for a long while, as if he had never properly seen it.',
        ),
        UR('So that is your city. It is big.'),
        GI('It is. Come up. I will show you.'),
        N(
          'You climb the wall stair together. Your Nubbin knows the way, and waits on the third step for you, which wobbles.',
        ),
        N(
          'On top, the wind is warm. The whole city is laid out below, roofs and orchards and smoke from supper fires.',
        ),
        GI(
          'Walk the top of this wall, Ur-Shanabi. Look at how it stands, and at its bricks. See how they were baked hard in the fire.',
        ),
        GI(
          'Town, orchards and clay-pits, a square mile of each. And half a square mile for Ishtar’s temple. That is what I made.',
        ),
      ],
      [
        ask(
          7,
          'maths',
          'area of a rectangle',
          '3.MD.C.7',
          [
            N(
              'One square mile is a square one mile long on every side. Uruk wants a new orchard, 2 miles long and 3 miles wide. How many square miles is that?',
            ),
          ],
          [
            o('6 square miles', [N('Yes. Area is length times width: 2 × 3 = 6.')], true),
            o('5 square miles', [
              N(
                'That is 2 + 3, which is half the distance round (the perimeter). Area is 2 × 3 = 6.',
              ),
            ]),
            o('1 square mile', [
              N('One square mile is a 1 by 1 square. A 2 by 3 orchard is six of them.'),
            ]),
          ],
          'Multiplied length and width to find an area of 6 square miles.',
        ),
      ],
      [
        ch('knock', 'Knock on a brick.', [
          N(
            'You knock on a brick, and it rings. Gilgamesh hears it, and for the first time in a long time, he smiles.',
          ),
        ]),
        ch('look', 'Look at the city with them.', [
          N(
            'Somebody is calling children in for supper, and somebody is singing. It all goes on, and on.',
          ),
        ]),
      ],
    ),
    sc(
      'a26-18-wall-done',
      [GI('I went to the end of the world. And here it is. It was here the whole time.', 'soft')],
      [
        ask(
          0,
          'literacy',
          'theme: what Gilgamesh learns',
          'RL.4.2',
          [
            N('“I went to the end of the world. And here it is.”'),
            N('“It was here the whole time.” What idea is Gilgamesh expressing?'),
          ],
          [
            o(
              'What we search for far away can be close to home',
              [
                N(
                  'Yes. That is a theme found in stories all over the world: the treasure was near all along.',
                ),
              ],
              true,
            ),
            o('The world has no end', [
              N('That is not what he says. He means the thing he wanted was here at home.'),
            ]),
            o('Walls are better than rivers', [
              N('He is looking at his own city, and seeing what it is worth.'),
            ]),
          ],
          'Identified a theme: what we seek far away can be close to home.',
        ),
      ],
    ),
    sc(
      'a26-18-foot',
      [
        N(
          'At the foot of the wall, by the copper box, the old brickmaker is sitting on her stack of bricks, eating a date.',
        ),
        BR('There you are. Long story, was it? They always are, his.'),
        N(
          'Below the wall, on the patch of rough grass by the river, a gazelle is grazing. It lifts its head, and looks at you, and does not run.',
        ),
        GI('He asked you to look after them. You did.', 'soft'),
        ...BRICK_LINES,
      ],
      [FOOT_BEAT],
      FOOT_CHOICES,
    ),
    sc(
      'a26-18-foot-done',
      [
        BR(
          'Not every tablet stays put. Plenty were taken from their places, in living memory.',
          'sad',
        ),
        BR(
          'Some have come home since. Every one that comes home is a little bit of a city put back.',
        ),
        N(
          'Gilgamesh gives you a small box made of cedarwood, smelling of the forest. It was cut from the offcuts of the great door.',
        ),
        GI(
          'For your own tablets. Put your story in it, whatever it is. And leave it where people can open it.',
        ),
      ],
      [
        ask(
          1,
          'social-studies',
          'fairness about things that belong to a people',
          'D2.Civ.8.3-5',
          [
            N(
              'Many tablets were taken from the places they belonged, and some have come home. What is a fair way to treat a people’s heritage?',
            ),
          ],
          [
            o(
              'Protect it, and return it to where it belongs when we can',
              [
                N(
                  'Yes. Heritage belongs to the people it comes from, and to the whole world to learn from, but taking it without asking is unfair.',
                ),
              ],
              true,
            ),
            o('Keep it, because it is safer in a faraway museum', [
              N(
                'Safety matters, but that does not make taking it fair. Many countries and museums now work to return what was taken.',
              ),
            ]),
            o('Sell it to the highest bidder', [
              N(
                'Selling a people’s treasures would take them away from the people they belong to. That is why many countries have laws against it.',
              ),
            ]),
          ],
          'Talked about treating a people’s heritage fairly: protect it and return it where possible.',
        ),
      ],
    ),
    sc(
      'a26-18-complete',
      [
        N(
          'Your Nubbin climbs up to your shoulder, and sits there, looking at the wall, the way someone older might.',
        ),
        ...HOME_LINES,
      ],
      [COMPLETE_BEAT],
    ),
  ],
);

// ================================================================== variants
export const EDU_A26_READER_VARIANTS: EduScene[] = [
  sc(
    'a26-01-page-moss',
    [
      N(
        'Nova’s atlas falls open at a page so bright it warms your face. A great brick wall stands in the sun, with date palms and a river.',
      ),
      N(
        'Moss has come to see what you are reading. He climbs your sleeve and settles on your shoulder.',
      ),
      MO(
        'Old, that wall. Older than me, nearly. I will come, if it is all the same to you. I like a wall.',
      ),
      N(
        'The bricks are warm under your feet, and you are standing on the rampart of a city. Below, flat roofs run down to a river.',
      ),
      N(
        'An old woman with clay to her elbows sits on a stack of bricks, eating a date. She nods to Moss as to an old neighbour.',
      ),
      BR(
        'New, are you? Everyone is new once. Walk the wall with me. It is the best way to meet a city.',
      ),
      BR(
        'This is Uruk. It stood in the land between two rivers, the Tigris and the Euphrates. Today that land is part of Iraq.',
      ),
      BR(
        'The Greeks later called it Mesopotamia, which means “between the rivers”. Rivers meant water, crops and boats.',
      ),
      MO(
        'Some of these bricks are older than I am. I don’t say that about many things.',
      ),
    ],
    [
      notice(
        8,
        'social-studies',
        'Mesopotamia means “between the rivers”; Uruk stood in what is now Iraq',
        'D2.Geo.2.3-5',
        [
          N(
            '(Find the two rivers on Nova’s map. The Tigris and the Euphrates both run south-east through Iraq to the sea.)',
          ),
        ],
        'Learned where Mesopotamia was: between the Tigris and the Euphrates, in what is now Iraq.',
      ),
    ],
    [
      ch('bricks', 'Ask her how you tell a good brick.', [
        BR(
          'You knock it. A good brick rings, and a bad one says “thud” and lets you down when it rains.',
          'happy',
        ),
      ]),
      ch('king', 'Ask who built the wall.', [
        BR(
          'The king says he did. The king says a lot of things. Come down and I will show you something better.',
          'think',
        ),
      ]),
    ],
  ),
  sc(
    'a26-03-herd-done-moss',
    [
      N(
        'You sit under a thorn tree and watch them. Moss climbs down off your shoulder and sits in the shade beside you.',
      ),
      N(
        'Enkidu grooms a gazelle’s ear with great care. There is nothing wild about the way he does it.',
      ),
      MO('Nothing wrong with him. He just has not met anyone yet.'),
    ],
    [
      ask(
        2,
        'science',
        'animals in groups help each other survive',
        '3-LS2-1',
        [N('Gazelles stay together in a herd. How does a herd help each gazelle survive?')],
        [
          o(
            'Many eyes and ears notice danger sooner',
            [N('Yes. When one gazelle spots a threat, the whole herd can run.')],
            true,
          ),
          o('Herds make the grass grow faster', [
            N('Not quite. The herd does not grow the grass. What it does is spot danger sooner.'),
          ]),
          o('Gazelles in a herd never get thirsty', [
            N(
              'Not quite. Every gazelle still needs water. A herd helps by watching for danger together.',
            ),
          ]),
        ],
        'Learned that living in a group helps animals notice danger.',
      ),
    ],
  ),
  sc(
    'a26-13-dream-done-spoke',
    [
      N('Enkidu turns to look at you. His eyes are wet.'),
      EN('You said to let him go. You were the only one.', 'sad'),
      EN(
        'I told him to finish it. I was frightened, so I was cruel. I wish I had listened to you.',
      ),
      N('He takes your hand, and holds it, quite hard, while the window goes from black to grey.'),
    ],
    [
      think(
        2,
        'sel',
        'whether fear explains cruelty or excuses it',
        'CASEL: Relationship skills',
        [
          N(
            'Enkidu says he was frightened, so he was cruel. Is being scared a reason to be unkind, or only an explanation?',
          ),
        ],
        [
          [
            'Only an explanation: we can be scared and still choose kindly',
            [N('That is a fair answer. Fear can push us, but we still get to choose how we act.')],
          ],
          [
            'A reason, because fear is very strong',
            [
              N(
                'That is a fair answer. Fear can feel overwhelming. Enkidu does not excuse himself. He says sorry.',
              ),
            ],
          ],
          [
            'Both: it explains, and it is still worth saying sorry',
            [
              N(
                'That is a fair answer. Understanding why we did something and owning it can go together.',
              ),
            ],
          ],
        ],
        'Thought about whether fear is a reason for unkindness or only an explanation.',
      ),
    ],
  ),
  sc(
    'a26-13-dream-done-agreed',
    [
      N('Enkidu turns to look at you. He tries to smile.'),
      EN('We did it together. We will carry it together.'),
      N('He takes your hand, and holds it, quite hard, while the window goes from black to grey.'),
    ],
    [
      think(
        1,
        'sel',
        'what it means to carry something together',
        'CASEL: Relationship skills',
        [
          N(
            'Enkidu says, “We did it together. We will carry it together.” Can a heavy thing be lighter when it is carried together?',
          ),
        ],
        [
          [
            'Yes: a shared burden is lighter',
            [
              N(
                'That is a fair answer. Many sad or heavy things feel lighter with someone beside you.',
              ),
            ],
          ],
          [
            'No: each person still carries their own part',
            [
              N(
                'That is a fair answer. Nobody can feel your feelings for you. But company still helps.',
              ),
            ],
          ],
          [
            'It depends on whether you talk about it',
            [N('That is a fair answer. Sharing in words can make carrying together real.')],
          ],
        ],
        'Thought about whether a heavy feeling is lighter when carried together.',
      ),
    ],
  ),
  sc(
    'a26-14-sickbed-done-spoke',
    [
      EN('Water-carrier. Will you do something for me, after?'),
      N(
        'He opens his big hand, and in it is a cedar seed, small and brown, from the forest. He must have carried it all this way.',
      ),
      EN(
        'Plant it. For Humbaba’s forest. One tree back, for all the ones we took. You will know where.',
        'soft',
      ),
      Y('I will.'),
    ],
    [
      ask(
        3,
        'science',
        'what a seed needs to grow',
        '3-LS1-1',
        [N('Enkidu gives you a cedar seed to plant. What does a seed need to grow into a tree?')],
        [
          o(
            'Soil, water and light, and time',
            [
              N(
                'Yes. A seed needs water to wake up, soil to hold its roots, light to grow and plenty of time. A cedar can live for hundreds of years.',
              ),
            ],
            true,
          ),
          o('Only water', [N('Water is vital, but it also needs soil, light and time.')]),
          o('Darkness and dry air', [
            N('Seeds sleep in the dry, but to grow they need water, light and soil.'),
          ]),
        ],
        'Learned that a seed needs soil, water, light and time to grow.',
      ),
    ],
  ),
  sc(
    'a26-14-sickbed-done-agreed',
    [
      EN('Water-carrier. Will you do something for me, after?'),
      EN(
        'Remember me to the shepherds. Tell them their watchman thought of them. Tell them to keep the lamps lit for the sheep.',
        'soft',
      ),
      Y('I will.'),
    ],
    [
      ask(
        2,
        'social-studies',
        'how stories carry the past',
        'D2.His.2.3-5',
        [
          N(
            'Enkidu asks you to carry a message to people far away. How do spoken stories carry the past from one person to another?',
          ),
        ],
        [
          o(
            'Each person who hears them can tell them again, so they travel through time',
            [
              N(
                'Yes. Before many people could write, stories lived in memory and travelled by voice. Oral history is still used today.',
              ),
            ],
            true,
          ),
          o('They do not: only writing keeps the past', [
            N(
              'Writing helps a great deal, but stories passed on by voice have kept history alive for thousands of years.',
            ),
          ]),
          o('They always stay exactly the same', [
            N(
              'Spoken stories shift a little with each telling, which is one reason people also write them down.',
            ),
          ]),
        ],
        'Learned that spoken stories carry the past from person to person.',
      ),
    ],
  ),
  sc(
    'a26-14-death-done-moss',
    [
      N(
        'Moss climbs down from your shoulder, slowly, and sits on the end of the bed, by Enkidu’s feet.',
      ),
      N('He says nothing at all. Not one word, all night.'),
      N('You have known him long enough to know what that means. It is the kindest thing he has.'),
      N('Your Nubbin climbs into Gilgamesh’s lap when at last he sits, and stays there too.'),
    ],
    [
      ask(
        2,
        'sel',
        'staying close helps when words cannot',
        'CASEL: Relationship skills',
        [
          N(
            'Moss, who usually has something to say, says nothing all night. Why is that his kindest thing?',
          ),
        ],
        [
          o(
            'He gives his company without trying to fix anything',
            [
              N(
                'Yes. He has lost many friends himself, and knows that sometimes the kind thing is to stay.',
              ),
            ],
            true,
          ),
          o('He has run out of things to say', [
            N('Perhaps, but it looks like a choice. His silence is a gift.'),
          ]),
          o('He does not care', [
            N('Look at where he sits: at Enkidu’s feet, all night. He cares.'),
          ]),
        ],
        'Noticed that silent company can be the kindest thing for someone who is grieving.',
      ),
    ],
  ),
  sc(
    'a26-16-siduri-done-moss',
    [
      MO('She is right, you know. I would have said it shorter. But she is right.'),
      SI('And who is this, on your shoulder?', 'think'),
      MO('Someone who has outlived a good many friends, and is still having his supper.', 'soft'),
      SI('Then you will have a cup with me.', 'soft'),
      GI('Where is the boatman? The one who crosses the sea.', 'angry'),
      SI(
        'Ur-Shanabi. In the woods, by the shore. Be gentle with him. Be gentle with something, for once.',
      ),
      N('Your Nubbin climbs into your lap and goes to sleep there, warm and heavy.'),
    ],
    [{ ...SIDURI_DONE_BEAT, after: 6 }],
  ),
  sc(
    'a26-17-snake-done-hazel',
    [
      GI(
        'All that way. My hands torn to pieces. And now a snake has it. I have given it to a snake.',
        'sad',
      ),
      UR('Yes. And now we go home anyway. Come on.'),
      N(
        'At the very edge of the sky, where a page would have its margin, there is writing in pencil, small and slanted. You know the hand.',
      ),
      N('“Lost the plant. Kept the wall.”'),
      N('“Good trade.”', 'soft'),
      N('And under it, one letter: H.'),
    ],
    [
      think(
        4,
        'literacy',
        'what a short note means',
        'RL.3.6',
        [
          N('Hazel’s note says: “Lost the plant. Kept the wall.”'),
          N('“Good trade.” Do you agree it was a good trade?'),
        ],
        [
          [
            'Yes: a wall that shelters a city is worth more than a plant',
            [N('That is a fair answer. A wall protects many people for a long time.')],
          ],
          [
            'No: the plant could have saved people he loved',
            [N('That is a fair answer. It is a real loss. Hazel’s view is not the only view.')],
          ],
          [
            'It was not a trade at all: the snake just took it',
            [
              N(
                'That is a fair answer. Hazel chooses to see something gained from something lost. You can choose how you see it.',
              ),
            ],
          ],
        ],
        'Compared their own view with a character’s about whether a loss was a good trade.',
      ),
    ],
  ),
  sc(
    'a26-18-foot-spoke',
    [
      N(
        'At the foot of the wall, by the copper box, the old brickmaker is sitting on her stack of bricks, eating a date.',
      ),
      BR('There you are. Long story, was it? They always are, his.'),
      N(
        'Below the wall, by the river, there is a cedar sapling no higher than your knee. You know whose seed it was.',
      ),
      N(
        'Gilgamesh kneels down beside it. He touches one of its little needles, very carefully, with a hand that tore on thorns.',
      ),
      GI('You told me to let him go. I should have listened to you.', 'sad'),
      ...BRICK_LINES,
    ],
    [{ ...FOOT_BEAT, after: 7 }],
    FOOT_CHOICES,
  ),
  sc(
    'a26-18-foot-agreed',
    [
      N(
        'At the foot of the wall, by the copper box, the old brickmaker is sitting on her stack of bricks, eating a date.',
      ),
      BR('There you are. Long story, was it? They always are, his.'),
      N(
        'Gilgamesh stops beside you. He looks at you for a long time, without saying anything, the way you look at a well to see how deep it goes.',
      ),
      GI('We both learned it late.', 'soft'),
      N(
        'He does not say what, and he does not need to. Somewhere out on the steppe, the shepherds are lighting their lamps.',
      ),
      ...BRICK_LINES,
    ],
    [{ ...FOOT_BEAT, after: 7 }],
    FOOT_CHOICES,
  ),
  sc(
    'a26-18-complete-moss',
    [
      N(
        'Moss has been quiet all the way home. Now he sits up on your shoulder and looks at the wall, brick by brick.',
      ),
      MO('He went to the end of the world so as not to die, and came home and pointed at a wall.'),
      MO('That is the right answer. He just took the long way.', 'soft'),
      ...HOME_LINES,
    ],
    [{ ...COMPLETE_BEAT, after: 3 }],
  ),
  sc(
    'a26-18-complete-moss-spoke',
    [
      N(
        'Moss has been quiet all the way home. Now he sits up on your shoulder and looks at the wall, brick by brick.',
      ),
      MO('He went to the end of the world so as not to die, and came home and pointed at a wall.'),
      MO('That is the right answer. He just took the long way.', 'soft'),
      N('He looks down at the cedar sapling by the river for a while.'),
      MO('And somebody let a tree live. That is the other answer.', 'soft'),
      ...HOME_LINES,
    ],
    [{ ...COMPLETE_BEAT, after: 5 }],
  ),
  sc(
    'a26-grove-brick',
    [
      N(
        'You carry the brick up the hill to the flat stone where Moss always sits, and lay it in the grass beside it.',
      ),
      N(
        'Your handprint and the pawprint face the sky. Your Nubbin knocks on the brick with one paw, and listens: it rings.',
      ),
      N(
        'You put the cedar box on the cottage shelf. When you open it, the room smells of a forest a very long way off.',
      ),
    ],
    [
      ask(
        2,
        'literacy',
        'language that appeals to the senses',
        undefined,
        [
          N(
            '“The room smells of a forest a very long way off.” Which sense does this sentence appeal to?',
          ),
        ],
        [
          o(
            'Smell',
            [
              N(
                'Yes. Writers use senses so that we feel we are in the room. This one gives a smell and a sense of distance.',
              ),
            ],
            true,
          ),
          o('Hearing', [
            N('The ringing brick is about hearing, but this sentence is about smell.'),
          ]),
          o('Taste', [
            N(
              'We might taste air, but a smell comes through the nose. This sentence is about smell.',
            ),
          ]),
        ],
        'Identified that a sentence appeals to the sense of smell.',
      ),
    ],
  ),
  sc(
    'a26-grove-brick-flower',
    [
      N(
        'You carry the brick up the hill to Moss’s flower by the flat stone, and lay it in the grass beside it.',
      ),
      N(
        'Your handprint and the pawprint face the sky. Your Nubbin knocks on the brick with one paw, and listens: it rings.',
      ),
      N(
        'You sit for a while by the flower and the brick. It seems the right thing to do here.',
        'soft',
      ),
      N(
        'You put the cedar box on the cottage shelf. When you open it, the room smells of a forest a very long way off.',
      ),
    ],
    [
      ask(
        3,
        'literacy',
        'language that appeals to the senses',
        undefined,
        [
          N(
            '“The room smells of a forest a very long way off.” Which sense does this sentence appeal to?',
          ),
        ],
        [
          o(
            'Smell',
            [
              N(
                'Yes. Writers use senses so that we feel we are in the room. This one gives a smell and a sense of distance.',
              ),
            ],
            true,
          ),
          o('Hearing', [
            N('The ringing brick is about hearing, but this sentence is about smell.'),
          ]),
          o('Taste', [
            N(
              'We might taste air, but a smell comes through the nose. This sentence is about smell.',
            ),
          ]),
        ],
        'Identified that a sentence appeals to the sense of smell.',
      ),
    ],
  ),
];

// ================================================================== exports
export const EDU_A26_READER: EduQuest[] = [
  Q1,
  Q2,
  Q3,
  Q4,
  Q5,
  Q6,
  Q7,
  Q8,
  Q9,
  Q10,
  Q11,
  Q12,
  Q13,
  Q14,
  Q15,
  Q16,
  Q17,
  Q18,
];

/** Every `edu:` check string used by the lessons above (the reader band has no `do` lessons). */
export const CHECKS: string[] = [];
