/**
 * The Learning Grove, reader band (ages 7–10): Atlas page A15, The Humbug (Baum’s The Wonderful
 * Wizard of Oz, 1900, USA).
 *
 * Source: atlas-a15.ts (ATLAS_A15 and ATLAS_A15_VARIANTS). One EduScene per original scene (every
 * step scene, every done scene, every complete scene and every variant), id `reader:<original id>`,
 * with every choice kept under its original id and `set` flag (`a15-cap`, `a15-lamb`). Reader keeps
 * all choices, so no `defaultChoice` is needed. See EDU-STYLE.md. British spelling.
 *
 * Learning angles, from the outline: geography and history (Kansas and the prairie in 1900, the
 * four lands and the compass, Omaha, china and where the name comes from), science (what a
 * cyclone is, how a hot-air balloon flies, how coloured lenses change what you see, rust and oil,
 * floating, pollination, bees, food chains, sound, heat and light, dissolving), maths (sums,
 * times tables, fractions of a cup, area, time intervals, hours in a day, symmetry), language
 * (theme, character motive, similes, multiple-meaning words, vocabulary) and feelings (brains,
 * heart and courage, or naming what you already have; honesty, secrets, pity, fairness, safe
 * versus well).
 *
 * Think questions (`ask` with no `best`) in every quest: whether hitting a bully is ever the
 * answer, who is to blame for an accident, whether a small fib can grow, whether it matters that
 * the magic was bran, whether safe is the same as well, and what home means.
 *
 * Care notes kept: Baum’s book (1900), not the 1939 film (no film names, shoes are silver,
 * nobody sings). Deaths stay off the page and are told in a line, never described: the Witch of
 * the East is only two silver shoes; wolves, crows and bees are met and “will not trouble anyone
 * again”; the wildcat is driven off; the Kalidahs fall with the bridge (said plainly, “nobody
 * looks”); the spider “will not trouble anyone again”; the Witch of the West melts quickly with
 * no screaming, and Dorothy says plainly that she is sorry and did not mean it. The Hammer-Heads,
 * Winkies, Quadlings and china people are fairy-tale peoples. Nothing is quoted from the book.
 * Facts used: Kansas is in the middle of the USA, on the Great Plains; tornadoes there come mostly
 * in spring when warm damp air meets cold dry air; Baum’s word “cyclone” means a tornado; a
 * safe place is underground or in a room with no windows; Omaha is in Nebraska, just north of
 * Kansas; iron rusts with water and air; oil reduces friction; lions live in prides and a roar can
 * carry about 8 km; insects have 6 legs and spiders 8; wood floats because it is less dense than
 * water; a river’s current is strongest in the middle; many birds have hollow bones; storks
 * migrate; bees visit poppies for pollen; children aged 7 to 10 need about 9 to 12 hours of sleep;
 * blue and yellow paint make green; a green filter makes a red apple look dark; emerald is the
 * mineral beryl and scratches glass; fire gives heat and light; a bee colony has one queen;
 * sugar dissolves in water; gold can be hammered very thin; the first crewed hot-air balloon
 * flight was in France in 1783; hot air rises; a desert has under about 250 mm of rain a year;
 * porcelain was first made in China; soft clay baked hard cannot go back to clay; a spider is not
 * an insect; “piano” and “forte” are Italian for soft and loud; a resting heart of a child of 7
 * to 10 beats roughly 70 to 100 times a minute; silver is the best electrical conductor of the
 * metals; the sun rises in the east and sets in the west.
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
const D = say('a15-dorothy');
const SC = say('a15-scarecrow');
const TW = say('a15-woodman');
const L = say('a15-lion');
const AE = say('a15-em');
const UH = say('a15-henry');
const NW = say('a15-north');
const MK = say('a15-munchkin');
const B = say('a15-boq');
const ST = say('a15-stork');
const Q = say('a15-queen');
const G = say('a15-guardian');
const GW = say('a15-soldier');
const O = say('a15-oz');
const W = say('a15-witch');
const WK = say('a15-winkie');
const MO = say('a15-monkey');
const MM = say('a15-milkmaid');
const PR = say('a15-princess');
const TG = say('a15-tiger');
const HH = say('a15-hammerhead');
const GL = say('a15-glinda');

// ---------------------------------------------------------------- domains and standards
const M: EduDomain = 'maths';
const LIT: EduDomain = 'literacy';
const S: EduDomain = 'science';
const SS: EduDomain = 'social-studies';
const E: EduDomain = 'sel';
const MU: EduDomain = 'music';
const A: EduDomain = 'art';
const H: EduDomain = 'health';

const CASEL_SA = 'CASEL: Self-awareness';
const CASEL_SM = 'CASEL: Self-management';
const CASEL_SO = 'CASEL: Social awareness';
const CASEL_RS = 'CASEL: Relationship skills';
const CASEL_RD = 'CASEL: Responsible decision-making';
const GEO = 'D2.Geo.2.K-2';
const CIV = 'D2.Civ.8.K-2';
const HIS = 'D2.His.2.K-2';

// ---------------------------------------------------------------- builders
type Beat = Omit<Lesson, 'id'>;
type Opt = NonNullable<Lesson['options']>[number];

const words = (t: string) => t.trim().split(/\s+/).length;
const count = (t: string) => (t.match(/[.!?]+(\s|$)/g) ?? []).length;
const fits = (t: string) => words(t) <= 26 && t.length <= 150;

/**
 * Keeps every line within the reader caps (30 words, 160 characters) and narration to two
 * sentences: a long line is cut at sentence ends into several lines by the same speaker (the
 * mood stays on the first). `map[i]` is the index of the last piece of original line i, so a
 * lesson’s `after` can follow.
 */
const split = (lines: Line[]): { lines: Line[]; map: number[] } => {
  const out: Line[] = [];
  const map: number[] = [];
  for (const l of lines) {
    const sentences = l.text.split(/(?<=[.!?”)])\s+(?=[A-Z“(])/);
    const chunks: string[] = [];
    for (const sentence of sentences) {
      const last = chunks[chunks.length - 1];
      if (last !== undefined && fits(`${last} ${sentence}`) && count(last) < 2)
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

/** A choice, with the original’s id and `set` flag kept. */
const ch = (id: string, label: string, then: Line[], set?: Choice['set']): Choice => ({
  id,
  label,
  ...(set ? { set } : {}),
  then,
});

/** One reader scene. Lesson ids are `reader:<of>-l<n>`, numbered in play order. */
const sc = (of: string, lines: Line[], beats: Beat[], choices?: Choice[]): EduScene => {
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

/** A think question: no best answer; every reply honours the child’s reasoning. */
const think = (
  after: number,
  domain: EduDomain,
  skill: string,
  standard: string | undefined,
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

// ---------------------------------------------------------------- shared pieces
/** A15-14: the little man’s two confessions (all four versions of the screen-done scene). */
const POOR_WIZARD: Line[] = [
  O(
    'I am not a wicked man, my dear. I am only a very poor Wizard. There is a difference, though I grant it is a small one.',
    'sad',
  ),
  O('And I was frightened of the Witches, all along. That is why the walls are so high.', 'sad'),
];
/** A15-16: the balloon goes (both versions of the launch-done scene). */
const BALLOON_GONE: Line[] = [
  D('Wait! Wait for me! Oh, come back!', 'sad'),
  O('I cannot steer it! I never could! Goodbye, my dear!', 'sad'),
  N('The green balloon rises over the green towers, and gets smaller.'),
];
/** A15-20: Dorothy’s goodbye to you (both farewell versions). */
const FAREWELL: Line[] = [
  D(
    'You came with me all the way from the grey. And I still do not know where you are from.',
    'soft',
  ),
  D(
    'I shall tell Aunt Em about you. She will not believe it. She believes only what she can sweep.',
    'happy',
  ),
  D('Is it grey, where you live?'),
];
const FAREWELL_CHOICES: Choice[] = [
  ch('green', 'Tell her it is green, mostly, with a pond.', [
    D('Then you have your own place to go back to. Everybody ought to have one.', 'soft'),
  ]),
  ch('grey', 'Tell her there is a grey one there, and you love her.', [
    D('Aunt Em is grey, and I love her better than anything. So you know already.', 'soft'),
  ]),
  ch('toto', 'Let your Nubbin say goodbye to Toto.', [
    N(
      'Your Nubbin and Toto touch noses, the way they did on the prairie. Toto sneezes, and it means what it meant then.',
    ),
  ]),
];
/** A15-20: Dorothy goes home (all four endings). */
const KANSAS: Line[] = [
  N('Dorothy holds Toto tight and knocks the heels of the silver shoes together three times.'),
  D('Take me home, please. To Aunt Em.', 'soft'),
  N(
    'She is gone in three great steps. The silver shoes fall from her feet in the air, and are lost in the desert for good.',
  ),
  N(
    'For a moment the page shows Kansas: a new little farmhouse, grey grass, and Aunt Em running across it with her arms open.',
    'soft',
  ),
];
/** A15-20: the page closes (all four endings). */
const CLOSE: Line[] = [
  N(
    'The page folds shut, softly. You are back in the Grove, with Nova’s atlas on your knee and a thin silver ribbon marking the place.',
  ),
];
/** A15-20: the lamb wakes over the wall (both pocketed endings). */
const LAMB_WAKES: Line[] = [
  N(
    'Over the wall you set the lamb down in its own field. It stands stiff for a breath, then shakes, and wakes, and runs.',
    'soft',
  ),
];

// ================================================================== A15-1 The Grey Prairie
const Q1: EduQuest = quest(
  'a15-01',
  'The Grey Prairie',
  {
    'a15-01-s1': {
      goal: 'Step into the grey page and find the farmhouse.',
      hint: 'Touch the page, then walk across the prairie to the only house on it.',
    },
    'a15-01-s2': {
      goal: 'Help Uncle Henry and Aunt Em make ready for the storm.',
      hint: 'Watch the sky to the north, then help at the square door in the floor.',
    },
    'a15-01-s3': {
      goal: 'Ride out the cyclone, then step out of the page where the house comes down.',
      hint: 'Keep hold of your Nubbin. When the edge of the page curls, step through.',
    },
  },
  [
    sc(
      'a15-01-page',
      [
        N(
          'Nova’s atlas falls open at a page that is almost all grey: flat land to the edges of the paper, and one small house.',
        ),
        N(
          'Someone painted the house once, long ago. Years of sun and rain have worn every scrap of colour away.',
        ),
        N(
          'The grey goes soft under your fingers. Then it is dry grass, and you and your Nubbin are standing in it.',
        ),
        N(
          'There is no tree, no hill, no fence. The sky comes all the way down to the ground on every side.',
        ),
        N(
          'A small black dog races up and barks at your Nubbin, as if he has waited all day for something new.',
        ),
        D('Toto! Come back! Oh. Hello. I didn’t know anybody lived out this way.'),
        D(
          'I’m Dorothy, and that’s Toto. He’s the only thing round here that isn’t grey, and he knows it.',
        ),
        N('Your Nubbin and Toto sniff noses. Toto decides it is all right, and sneezes.'),
      ],
      [
        ask(
          1,
          S,
          'weathering: sun, wind and rain wear things away',
          '4-ESS2-1',
          [N('The paint on the house has worn off. What slowly wore it away?')],
          [
            o(
              'Sun, wind and rain, over many years',
              [
                N(
                  'Yes. Slow wearing away is called weathering. It wears down rock the same way, only far more slowly.',
                ),
              ],
              true,
            ),
            o('One big snowstorm', [
              N(
                'Snow can help, but this took years. Sun, wind and rain, bit by bit, is weathering.',
              ),
            ]),
            o('Toto', [
              N(
                'Toto is good at many things, but not that one. It was the weather, over many years.',
              ),
            ]),
          ],
          'Learned that sun, wind and rain slowly wear materials away (weathering).',
        ),
        ask(
          3,
          SS,
          'what a prairie looks like; where Kansas is',
          '4-ESS2-2',
          [
            N(
              'Kansas is in the middle of the United States, on the Great Plains. What would you see for miles around?',
            ),
          ],
          [
            o(
              'A flat sea of grass',
              [
                N(
                  'Yes. Wide, flat grassland is called prairie. In 1900 the farms out here were far apart.',
                ),
              ],
              true,
            ),
            o('Snowy mountains', [
              N(
                'The Rocky Mountains are far to the west. Kansas itself is flat grassland, called prairie.',
              ),
            ]),
            o('A rainforest', [
              N(
                'A rainforest is hot and wet and full of trees. Kansas is flat, dry grassland, called prairie.',
              ),
            ]),
          ],
          'Read the land: Kansas is on the flat grassland of the Great Plains, called prairie.',
        ),
      ],
      [
        ch('name', 'Tell her your name.', [
          D('That’s a nice name. It sounds like it comes from somewhere with trees.'),
        ]),
        ch('grey', 'Ask why everything is grey.', [
          D(
            'The sun, mostly, and the wind. Aunt Em came out here young and pretty, Uncle Henry says. It took the shine off her.',
            'sad',
          ),
        ]),
        ch('play', 'Let your Nubbin play with Toto.', [
          N(
            'Your Nubbin and Toto race twice round you and tumble in the dust. It is the first noise the prairie has heard all day.',
          ),
        ]),
      ],
    ),
    sc(
      'a15-01-page-done',
      [
        D('Come up to the house. Aunt Em will want to look at you.'),
        D(
          'She watches the sky like a sailor watching the sea. She is always waiting for the weather to turn.',
        ),
        N('The house is a long way off across the grass. It is the only thing to walk towards.'),
      ],
      [
        ask(
          1,
          LIT,
          'similes',
          'L.4.5',
          [
            N(
              'Dorothy says Aunt Em watches the sky like a sailor watching the sea. What is being compared, and why?',
            ),
          ],
          [
            o(
              'Aunt Em and a sailor; both watch for weather that could turn dangerous',
              [
                D(
                  'Exactly. A comparison using “like” or “as” is called a simile. This one tells you Aunt Em is wary.',
                ),
              ],
              true,
            ),
            o('The sky and the sea; both are blue', [
              D('Good eye, but look who is doing the watching. Aunt Em is compared to a sailor.'),
            ]),
            o('Dorothy and Toto', [
              D('Not quite. The sentence compares how Aunt Em watches with how a sailor watches.'),
            ]),
          ],
          'Read a simile and said what it compares and what it tells us about a character.',
        ),
      ],
    ),
    sc(
      'a15-01-storm',
      [
        N(
          'The house is one room: a stove, a table, a cupboard, two beds and a square door in the floor.',
        ),
        N(
          'Uncle Henry stands on the step, looking at the sky. It has gone a darker grey than usual.',
        ),
        UH('Storm’s coming, Em. A big one. I’m going to see to the animals.', 'think'),
        N(
          'From the north comes a low wail. The long grass bows flat, all the way to the edge of the world.',
        ),
        AE('Dorothy! The cellar! Now, child!', 'shock'),
        N(
          'Aunt Em flings open the trap door and climbs down the ladder into the small dark hole beneath.',
        ),
        N(
          'Toto jumps out of Dorothy’s arms and hides under the bed. She goes down on her knees after him.',
        ),
        D('Toto! Come out! Oh, you bad dog, come out this minute!'),
      ],
      [
        ask(
          3,
          S,
          'tornadoes come when warm damp air meets cold dry air, mostly in spring',
          '3-ESS2-1',
          [
            UH(
              'Storms like this build when warm, damp air from the south meets cold, dry air from the north. When does that happen most in Kansas?',
            ),
          ],
          [
            o(
              'In spring and early summer',
              [
                UH('That’s the one. Spring and early summer bring most of the tornadoes.'),
                N('Baum’s book calls them cyclones.'),
              ],
              true,
            ),
            o('In the middle of winter', [
              UH(
                'Winter has its own storms, but the big spinning ones come mostly in spring and early summer.',
              ),
            ]),
            o('Only in autumn', [
              UH('Autumn can have them, but spring and early summer are the busiest time.'),
            ]),
          ],
          'Learned that tornadoes (Baum’s “cyclones”) form where warm damp air meets cold dry air, mostly in spring.',
        ),
      ],
      [
        ch('door', 'Hold the trap door open for her.', [
          N(
            'You kneel and hold the trap door. Aunt Em is calling from below, and the whole house has begun to shake.',
          ),
        ]),
        ch('bed', 'Reach under the bed for Toto.', [
          N(
            'You get a hand on Toto’s collar and pass him, wriggling, to Dorothy. The floor is already shaking.',
          ),
        ]),
        ch('nubbin', 'Grab your Nubbin first.', [
          N(
            'Your Nubbin is in your arms before you know you have reached for it. It is trembling, and so is the floor.',
          ),
        ]),
      ],
    ),
    sc(
      'a15-01-storm-done',
      [
        N(
          'The wind gives a great shriek. The house shakes so hard that Dorothy sits down on the floor.',
        ),
        N(
          'Then the house turns round twice, quite slowly, and lifts off the ground like a balloon.',
        ),
        N('Far below, the cellar stays dark and still, and Aunt Em is safe in it.'),
      ],
      [
        ask(
          2,
          H,
          'where to shelter in a tornado',
          CASEL_RD,
          [N('Aunt Em knew where to go. Where is the safest place in a tornado?')],
          [
            o(
              'Underground, or in a room with no windows on the lowest floor',
              [
                N(
                  'Quite right. Glass breaks, and wind throws things about. Low and windowless is best, and go early.',
                ),
              ],
              true,
            ),
            o('Next to a window, to watch it come', [
              N(
                'Never. Windows shatter. Go to the lowest room with no windows, and stay away from glass.',
              ),
            ]),
            o('In a parked car', [
              N(
                'A car can be tossed about. A cellar, or a low inside room with no windows, is far safer.',
              ),
            ]),
          ],
          'Learned where to shelter in a tornado: underground, or a low room with no windows.',
        ),
      ],
    ),
    sc(
      'a15-01-cyclone',
      [
        N(
          'The house is carried up into the very middle of the cyclone, where it is strangely quiet. It rocks along like a cradle.',
        ),
        N('Toto runs about barking. Then he goes too near the open trap door and falls in.'),
        N('The wind holds him up. Dorothy lies flat, reaches down, and pulls him back by one ear.'),
        D('There. That is quite enough adventure for one dog.'),
        N(
          'Hours go by. Dorothy shuts the trap door and lies down on her bed, with Toto beside her.',
        ),
        D('If the house is going to fall, I would rather be asleep for it.', 'think'),
        N('You stay awake with your Nubbin in your lap. Somebody ought to.'),
        N(
          'The edge of the page has begun to curl. Through the gap you can see grass: green grass, and a great deal of it.',
        ),
      ],
      [
        ask(
          4,
          M,
          'multiplying a speed by a time to find a distance',
          '4.MD.A.2',
          [
            N(
              'Suppose the house flies at 60 kilometres an hour for 3 hours. How far does it travel?',
            ),
          ],
          [
            o(
              '180 km',
              [
                N(
                  'Yes. 60 + 60 + 60 = 180, or 3 × 60 = 180. That is a long way to travel in a house, and nobody even steered.',
                ),
              ],
              true,
            ),
            o('63 km', [
              N(
                'That adds 60 and 3, but speed and time are multiplied. Three hours of 60 km each is 3 × 60 = 180 km.',
              ),
            ]),
            o('120 km', [N('That is only two hours, and there are three: 60 + 60 + 60 = 180 km.')]),
          ],
          'Found a distance from a speed and a time: 3 × 60 = 180 km.',
        ),
      ],
      [
        ch('step', 'Step through the gap with your Nubbin.', [
          N(
            'You step through. Behind you the house drops the last few feet, with a bump that makes the whole page jump.',
          ),
        ]),
        ch('look', 'Take a last look at Dorothy, asleep.', [
          N(
            'She is fast asleep, with one arm over Toto. You step through the gap, and the house comes down behind you.',
          ),
        ]),
      ],
    ),
    sc(
      'a15-01-cyclone-done',
      [
        N(
          'You land in soft grass. After all that grey everything dazzles: green banks, tall trees heavy with fruit, a brook, birds.',
        ),
        N(
          'Behind you the grey farmhouse sits in the middle of it all, a little crooked, as if it had sat down suddenly.',
        ),
        N(
          'Your Nubbin cannot decide whether to be thrilled or nervous. It does a bit of both, and falls over.',
        ),
      ],
      [
        think(
          2,
          E,
          'feeling two things at once',
          CASEL_SA,
          [
            N(
              'Your Nubbin is thrilled and nervous at the same time. Can a person feel two feelings at once?',
            ),
          ],
          [
            [
              'Yes, they mix together',
              [
                N(
                  'That’s a fair answer. Feelings often arrive in a pair, like excitement and nerves before something new.',
                ),
              ],
            ],
            [
              'No, only one at a time',
              [
                N(
                  'That’s a fair answer. Sometimes one feeling is so big it hides the other. Notice what the quiet one says.',
                ),
              ],
            ],
            [
              'I am not sure',
              [
                N(
                  'That’s a fair answer, and an honest one. Next time something new happens, check: is there more than one feeling in there?',
                ),
              ],
            ],
          ],
          'Thought about whether two feelings can happen together, using a new place as an example.',
        ),
      ],
    ),
    sc(
      'a15-01-complete',
      [
        N(
          'Your Nubbin rolls over and over in the green grass, the way it does in the Grove after rain.',
        ),
        N(
          'The door of the house opens. Dorothy looks out with Toto in her arms, and her mouth falls open.',
        ),
        D('Oh. Oh, my. Where has Kansas gone?', 'shock'),
        N(
          'Little people in blue are coming towards the house, slowly, as if not sure it will stay where it is.',
        ),
        N(
          'Under one corner of the house two feet in silver shoes are sticking out. Only your Nubbin has noticed.',
        ),
      ],
      [
        notice(
          0,
          A,
          'contrast: a dull colour makes a bright one glow',
          'RL.4.3',
          [
            N(
              'The artist William Wallace Denslow drew the pictures for the first edition of this book, in 1900.',
            ),
            N(
              'Artists often put a dull colour next to a bright one so the bright one seems to glow. That is why green looks so rich after all that grey.',
            ),
          ],
          'Learned that contrast between a dull and a bright colour makes the bright one stand out.',
        ),
      ],
    ),
  ],
  [
    gl('prairie', 'A wide, flat stretch of grassland with very few trees.', 'a15-01-page'),
    gl(
      'cyclone',
      'Baum’s word for a tornado: a spinning funnel of wind that comes down from a storm cloud.',
      'a15-01-storm',
    ),
    gl('cellar', 'A small room under a house, below the ground.', 'a15-01-storm'),
  ],
);

// ================================================================== A15-2 The Council with the Munchkins
const Q2: EduQuest = quest(
  'a15-02',
  'The Council with the Munchkins',
  {
    'a15-02-s1': {
      goal: 'Greet the little people and the old woman in white.',
      hint: 'Walk round the house to where the Munchkins are waiting.',
    },
    'a15-02-s2': {
      goal: 'Ask the way home, and see what the slate says.',
      hint: 'Watch the Witch of the North’s hat while she counts.',
    },
    'a15-02-s3': {
      goal: 'Help Boq’s household lay the table for the night.',
      hint: 'Carry the blue dishes from the dresser to the long tables outside.',
    },
  },
  [
    sc(
      'a15-02-council',
      [
        N(
          'Three men and a woman come up, no taller than Dorothy. They wear blue, and round pointed hats with little bells that tinkle.',
        ),
        N('The woman is very old, in a white gown sprinkled with stars. She bows low to Dorothy.'),
        NW(
          'Welcome to the land of the Munchkins, my dear. This is the East, and they thank you for setting them free.',
        ),
        D('I think you have muddled me up with somebody else. I haven’t done anything.', 'shock'),
        NW('Your house did, which comes to the same. Look there, under the corner.', 'think'),
        D('Oh. Oh, the poor thing. It came down right on top of her.', 'sad'),
        NW(
          'She was the Wicked Witch of the East. She kept these people working for her night and day.',
        ),
        MK('Night and day! For years! And now we are free!', 'happy'),
        N(
          'When you look again, the feet are gone. Only the silver shoes are left, lying in the grass.',
        ),
        NW('The shoes are yours now. They hold some magic, though nobody ever learned what.'),
      ],
      [
        ask(
          2,
          SS,
          'compass directions',
          GEO,
          [
            N(
              'The old woman says this is the East. If you stand facing north, which hand points east?',
            ),
          ],
          [
            o(
              'Your right hand',
              [
                N(
                  'Yes. Facing north, east is on your right and west is on your left. “Never Eat Soggy Waffles” goes clockwise: north, east, south, west.',
                ),
              ],
              true,
            ),
            o('Your left hand', [N('That one is west. Facing north, east is on your right.')]),
            o('Straight ahead', [
              N('Straight ahead is north. East is a quarter turn to your right.'),
            ]),
          ],
          'Used a compass: facing north, east is on your right.',
        ),
      ],
      [
        ch('try', 'Tell Dorothy to try them on.', [
          D('They fit exactly, as if they had been waiting for me.', 'happy'),
        ]),
        ch('careful', 'Tell her to be careful with them.', [
          NW(
            'Wise. A charm is like a dog: best to know what it will do before you take it for a walk.',
            'think',
          ),
        ]),
        ch('sniff', 'Let your Nubbin sniff the shoes.', [
          N(
            'Your Nubbin sniffs, sneezes, and sits on the shoes, as if somebody ought to keep them warm.',
          ),
        ]),
      ],
    ),
    sc(
      'a15-02-council-done',
      [
        D(
          'Thank you. But please, can you help me get back to my Aunt Em and Uncle Henry? They will be so worried.',
        ),
        NW('Ah. That is harder. Let me see.', 'think'),
        N('Dorothy’s voice wobbled when she asked. Asking was not easy, and she did it anyway.'),
      ],
      [
        think(
          2,
          E,
          'asking for help',
          CASEL_RS,
          [
            N(
              'Dorothy asked strangers for help. Is asking for help a sign of weakness or of strength?',
            ),
          ],
          [
            [
              'Strength: it takes courage',
              [
                NW(
                  'That’s a fair answer. It often takes more courage to ask than to struggle on alone.',
                ),
              ],
            ],
            [
              'Weakness: you should manage alone',
              [
                NW(
                  'That’s a fair answer, and many people feel it. Yet even the strongest people ask. Dorothy could not cross a desert alone.',
                ),
              ],
            ],
            [
              'It depends what you ask',
              [NW('That’s a fair answer. Choosing who to ask, and when, is a skill too.')],
            ],
          ],
          'Thought about whether asking for help shows strength or weakness.',
        ),
      ],
    ),
    sc(
      'a15-02-slate',
      [
        N(
          'The Munchkins shake their heads. There are great deserts to the east, the south and the west, they say, and nobody crosses them.',
        ),
        MK('And to the north, where she lives, it is desert too. Nobody ever has.', 'sad'),
        N(
          'Dorothy begins to cry. The Munchkins, to be kind, begin to cry too, and their hat bells tinkle sadly.',
        ),
        N(
          'The Witch of the North takes off her pointed hat, balances it on her nose, and counts: one, two, three.',
        ),
        N(
          'The hat turns into a slate. In big white chalk letters it tells Dorothy to go to the City of Emeralds.',
        ),
        NW(
          'Keep to the road of yellow brick and you cannot go wrong. I cannot come with you, but I can give you my kiss.',
        ),
        NW('Nobody in all this land would dare hurt someone I have kissed.'),
        N(
          'She kisses Dorothy on the forehead. Where her lips touch there is a round, shining mark.',
        ),
      ],
      [
        ask(
          6,
          LIT,
          'why a character acts as she does',
          'RL.3.3',
          [N('Why does the Witch of the North kiss Dorothy on the forehead?')],
          [
            o(
              'To protect her on the road',
              [
                NW(
                  'Yes. She cannot go along, so she gives Dorothy protection. A character’s motive is the reason behind what she does.',
                ),
              ],
              true,
            ),
            o('To say a polite goodbye', [
              NW(
                'A kiss is a kind goodbye, but listen to what she says next. The mark is meant to protect.',
              ),
            ]),
            o('Because she is bored', [
              NW('Not bored at all. She is worried for Dorothy and wants her safe.'),
            ]),
          ],
          'Worked out a character’s motive from what she says.',
        ),
      ],
      [
        ch('you', 'Ask if she will kiss you too.', [
          NW(
            'You are only visiting, dear. Visitors bring their own luck. Mind you share it.',
            'soft',
          ),
        ]),
        ch('mark', 'Look closely at the mark.', [
          N(
            'It shines faintly, like a coin at the bottom of a well. Dorothy cannot see it, but everyone else can.',
          ),
        ]),
        ch('nose', 'Hold your Nubbin up to say goodbye.', [
          N(
            'The Witch of the North taps your Nubbin once on the nose. It goes cross-eyed with pride, and stays that way some time.',
          ),
        ]),
      ],
    ),
    sc(
      'a15-02-slate-done',
      [
        N(
          'Then she spins round three times on her left heel, and is gone. Toto barks at the place where she was.',
        ),
        N('The Munchkins wave. All their hat bells ring together, tinkle, jingle, ting.'),
        N(
          'You notice that the smallest bells ring the highest notes, and a bigger bell on a fence post gives a deeper one.',
        ),
      ],
      [
        ask(
          2,
          MU,
          'pitch: small things make higher sounds',
          '4-PS3-2',
          [N('Which makes the higher note: a tiny hat bell or a big bell on a fence post?')],
          [
            o(
              'The tiny hat bell',
              [
                N(
                  'Yes. Smaller things vibrate faster, and faster vibrations make a higher pitch. Big bells are slower and deeper.',
                ),
              ],
              true,
            ),
            o('The big bell', [
              N(
                'The other way round. The big bell vibrates slowly, so its note is deep. The tiny bell is high.',
              ),
            ]),
            o('They sound the same', [
              N('Listen again. Small and big make different notes. Small is higher, big is lower.'),
            ]),
          ],
          'Learned that smaller bells vibrate faster and sound higher.',
        ),
      ],
    ),
    sc(
      'a15-02-boq',
      [
        N(
          'By evening you have walked a fair way along the road of yellow brick. Dorothy has changed into her clean blue-and-white checked frock.',
        ),
        N(
          'You come to a big house where a rich Munchkin called Boq is giving a feast. Everyone for miles seems to be there.',
        ),
        B(
          'Welcome, Sorceress! And the Sorceress’s friend! And the Sorceress’s friend’s… whatever that is.',
          'happy',
        ),
        D('I am not a Sorceress. I am Dorothy.'),
        B(
          'Only witches and sorceresses wear white, and your frock has white in it. Now: the tables! Five of them, and every plate must be blue.',
        ),
        N(
          'You carry dishes. Each table gets four blue plates, and each plate gets a little iced cake.',
        ),
        B('And where shall the Sorceress’s friend’s whatever-it-is sit?'),
      ],
      [
        ask(
          5,
          M,
          'equal groups: 5 × 4',
          '3.OA.A.1',
          [N('Five tables, with four blue plates at each. How many plates do you carry?')],
          [
            o(
              '20',
              [
                N(
                  'Yes. Five groups of four is 5 × 4 = 20. You could also count in fours: 4, 8, 12, 16, 20.',
                ),
              ],
              true,
            ),
            o('9', [N('That adds 5 and 4. Five tables of four plates is 5 × 4, which is 20.')]),
            o('16', [N('That is four tables of four. There are five tables, so 5 × 4 = 20.')]),
          ],
          'Multiplied equal groups: 5 tables of 4 plates make 20.',
        ),
      ],
      [
        ch('toto', 'Next to Toto, at the end.', [
          N(
            'Your Nubbin and Toto share the end of the bench, and a blue cake, and nobody minds at all.',
          ),
        ]),
        ch('dorothy', 'Next to Dorothy, of course.', [
          B('Of course! A place of honour! Fetch the tall stool!', 'happy'),
        ]),
        ch('under', 'Under the table, where the crumbs land.', [
          B('Ah, a practical creature. My grandmother was the same.'),
        ]),
      ],
    ),
    sc(
      'a15-02-boq-done',
      [
        N(
          'Three Munchkins strike up on fiddles and everyone else dances. Dorothy laughs, for the first time since the cyclone.',
        ),
        N('The plates are a deep, dark blue. The cups are a pale, sky blue.'),
        N('You wonder how you would paint both with only one pot of blue.'),
      ],
      [
        ask(
          2,
          A,
          'tints and shades',
          'L.3.4',
          [N('You have one pot of blue paint. How do you make the pale blue of the cups?')],
          [
            o(
              'Add white',
              [
                N(
                  'Yes. Adding white makes a tint, a paler colour. Adding black makes a shade, a darker one.',
                ),
              ],
              true,
            ),
            o('Add black', [
              N('Black makes it darker, like the plates. For pale blue, add white.'),
            ]),
            o('Add more blue', [
              N('More blue makes it stronger, not paler. To lighten a colour, add white.'),
            ]),
          ],
          'Learned that adding white makes a paler tint and adding black a darker shade.',
        ),
      ],
    ),
    sc(
      'a15-02-complete',
      [
        N(
          'Boq gives Dorothy his best bed, with blue sheets. She falls asleep at once, with Toto curled at her feet.',
        ),
        N(
          'You sit up a while with Boq on his front step. The yellow road runs off into the dark, glowing faintly.',
        ),
        B('It is a long way to the City of Emeralds. Many days. Mind the wild parts.', 'think'),
        B(
          'But she has the Witch’s kiss, and the silver shoes. And she has you, which I suppose is something.',
        ),
        N(
          'Your Nubbin falls asleep beside the silver shoes, one paw on each, as if they might walk off without it.',
        ),
      ],
      [
        ask(
          1,
          E,
          'welcoming a stranger',
          CASEL_SO,
          [
            N(
              'Boq welcomed a girl, a dog and a creature nobody could name. What makes a stranger feel welcome?',
            ),
          ],
          [
            o(
              'Someone says hello and finds them a seat',
              [
                B(
                  'Just so. A kind word and a place at the table cost very little, and mean a great deal.',
                ),
              ],
              true,
            ),
            o('Asking a lot of questions about them', [
              B(
                'Questions can be friendly, but too many can feel like a test. A hello and a seat come first.',
              ),
            ]),
            o('Leaving them alone until they speak', [
              B('Some quiet is fine. But a first hello makes the first step much easier.'),
            ]),
          ],
          'Talked about what makes a newcomer feel welcome.',
        ),
      ],
    ),
  ],
  [
    gl(
      'Munchkin',
      'One of the small people of the eastern land of Oz, who wear blue.',
      'a15-02-council',
    ),
    gl('feast', 'A big meal with lots of people and lots of good food.', 'a15-02-boq'),
  ],
);

// ================================================================== A15-3 The Scarecrow
const Q3: EduQuest = quest(
  'a15-03',
  'The Scarecrow',
  {
    'a15-03-s1': {
      goal: 'Help lift the Scarecrow down from his pole.',
      hint: 'Climb the fence into the cornfield and hold the pole steady while Dorothy lifts.',
    },
    'a15-03-s2': {
      goal: 'Help the Scarecrow find his feet.',
      hint: 'Walk beside him on the yellow bricks and catch him when he tips.',
    },
    'a15-03-s3': {
      goal: 'Sit by the road and listen while Dorothy tells him about Kansas.',
      hint: 'Sit with them on the bank while Dorothy eats her bread.',
    },
  },
  [
    sc(
      'a15-03-pole',
      [
        N(
          'In the morning the road runs past a big field of ripe corn. High on a pole in the middle, keeping the birds off, there is a Scarecrow.',
        ),
        N(
          'His head is a little sack stuffed with straw, with a face painted on it. He wears an old pointed blue hat.',
        ),
        N('As you look at him, he winks: slowly, with his left eye.'),
        D('Did you see that? I must have dreamed it. Scarecrows in Kansas never wink.', 'shock'),
        SC(
          'Good morning. How do you do? Not very well myself, if you want the truth. It is dreadfully dull, up a pole all day.',
        ),
        SC(
          'There is a pole up the back of my coat, you see. If you could lift me off it, I would be ever so grateful.',
        ),
        N(
          'Dorothy reaches up with both arms. Someone must hold the pole steady, or it will go over with him on it.',
        ),
      ],
      [
        ask(
          4,
          S,
          'materials and their properties',
          '2-PS1-1',
          [
            N(
              'The Scarecrow is stuffed with straw. Why is straw a good filling for him, and not iron?',
            ),
          ],
          [
            o(
              'Straw is light and soft, so it is easy to carry and cannot hurt anyone',
              [
                SC(
                  'Precisely. Light and soft. I am much easier to lift than a lump of iron, and I never bruise anyone I fall on.',
                ),
              ],
              true,
            ),
            o('Straw is stronger than iron', [
              SC(
                'Hardly. Iron is much stronger. It is also far too heavy and hard for a person like me.',
              ),
            ]),
            o('Straw is shinier', [
              SC(
                'I am sorry to say that I am not shiny at all. The point of straw is that it is light and soft.',
              ),
            ]),
          ],
          'Compared materials (straw, iron) by their properties and chose by what each is for.',
        ),
      ],
      [
        ch('hold', 'Hold the pole steady.', [
          N(
            'You hold the pole. Dorothy lifts him off, and the pole jumps in your hands as if it is glad too.',
          ),
        ]),
        ch('catch', 'Stand underneath, ready to catch him.', [
          N(
            'Dorothy lifts him off. He tips, and lands on you, which is like being hit by a large, polite pillow.',
          ),
        ]),
      ],
    ),
    sc(
      'a15-03-pole-done',
      [
        SC('Thank you. Thank you both. I feel ever so much more like a person down here.', 'happy'),
        N(
          'He stretches, yawns, and falls flat on his face. Then he gets up, and falls over sideways.',
        ),
        N('You notice that he stands with his feet together, and wobbles like a skittle.'),
      ],
      [
        ask(
          2,
          H,
          'balance: a wide base is steadier',
          '3-PS2-1',
          [N('How could the Scarecrow stand more steadily?')],
          [
            o(
              'With his feet wide apart',
              [
                N(
                  'Yes. A wide base is steadier, because the middle of your weight stays over your feet. Try it yourself.',
                ),
              ],
              true,
            ),
            o('With his feet together', [
              N('That is how he is wobbling. A narrow base tips easily. Feet apart is steadier.'),
            ]),
            o('On one foot', [
              N('One foot is the hardest of all. A wide stance on two feet is steadiest.'),
            ]),
          ],
          'Learned that standing with feet apart gives a steadier base.',
        ),
      ],
    ),
    sc(
      'a15-03-feet',
      [
        N(
          'The Scarecrow has never walked before. His legs go wherever they like, and they do not consult each other first.',
        ),
        SC(
          'I was only made the day before yesterday. Before that I was nothing at all, which is restful, but not interesting.',
        ),
        D('I am going to the City of Emeralds, to ask the great Oz to send me back to Kansas.'),
        SC(
          'Does he have brains to spare, do you suppose? Straw legs I do not mind. But a straw head is another matter. People call you a fool.',
          'think',
        ),
        D(
          'I do not know. But come anyway. If he has none, you will have lost nothing but the walk.',
        ),
        N(
          'He takes six steps, and steps into a hole in the road and goes full length on the bricks. He is not hurt in the least.',
        ),
      ],
      [
        ask(
          5,
          M,
          'multiplication word problem',
          '3.OA.A.3',
          [
            N(
              'Say the Scarecrow manages 6 steps before each tumble, and he tumbles 4 times before noon. How many steps has he taken?',
            ),
          ],
          [
            o(
              '24',
              [N('Yes. Four groups of six: 4 × 6 = 24. He is learning fast, and falling faster.')],
              true,
            ),
            o('10', [N('That adds 6 and 4. Four tumbles with six steps in each is 4 × 6 = 24.')]),
            o('18', [N('That is three groups of six. He has tumbled four times, so 4 × 6 = 24.')]),
          ],
          'Solved a multiplication word problem: 4 groups of 6 steps is 24.',
        ),
      ],
      [
        ch('arm', 'Offer him your arm.', [
          SC('An arm! The very thing. I shall try very hard not to take it home with me.', 'happy'),
        ]),
        ch('holes', 'Walk ahead and call out the holes.', [
          N(
            '“Hole,” you call, and he steps round it; “hole,” and he steps round; “brick,” and he falls over the brick.',
          ),
        ]),
        ch('nubbin', 'Let your Nubbin lead him.', [
          N(
            'Your Nubbin walks in front, very slowly. The Scarecrow copies every step, and falls over only twice.',
          ),
        ]),
      ],
    ),
    sc(
      'a15-03-feet-done',
      [
        N(
          'By noon he can walk a straight line. By afternoon he can very nearly walk a curved one.',
        ),
        N(
          'His legs, which once did not consult each other, now seem at least to be on speaking terms.',
        ),
        N(
          'You find yourself walking in step with him, left, right, left, right, all the way along the yellow bricks.',
        ),
      ],
      [
        ask(
          1,
          LIT,
          'personification',
          'L.4.5',
          [
            N(
              'The narrator says the Scarecrow’s legs “do not consult each other”. What is the author doing?',
            ),
          ],
          [
            o(
              'Giving legs a human habit, to be funny',
              [
                N(
                  'Yes. This is personification: treating a thing as if it were a person. Here it makes his clumsiness funny.',
                ),
              ],
              true,
            ),
            o('Telling us legs can really talk', [
              N(
                'Not really. The author is joking. Legs cannot consult anyone, but a person could.',
              ),
            ]),
            o('Comparing legs with sticks, using “like”', [
              N(
                'There is no “like” or “as” here. That would be a simile. This gives legs a human habit.',
              ),
            ]),
          ],
          'Spotted personification: a thing given a human habit for humour.',
        ),
      ],
    ),
    sc(
      'a15-03-kansas',
      [
        N(
          'You sit down on the bank, and Dorothy shares out her bread. The Scarecrow does not eat, but he likes being passed things.',
        ),
        SC('Tell me about your country. Kansas, was it?'),
        D(
          'It is all grey. The ground and the house and the sky. Even Aunt Em and Uncle Henry, nearly.',
        ),
        SC(
          'But here there is green, and birds, and corn. Why would anyone go back to all that grey?',
          'think',
        ),
        D(
          'Even if a home is plain and dreary, it is where your own people are. You would rather be there than anywhere, however beautiful.',
          'soft',
        ),
        D('That is what makes it home.', 'soft'),
        SC('I see. So it is not the paint that makes a home.', 'think'),
      ],
      [
        think(
          5,
          E,
          'what makes a place home',
          CASEL_SA,
          [
            N(
              'Dorothy would choose her grey farm over a beautiful land. What makes a place feel like home?',
            ),
          ],
          [
            [
              'The people who live there',
              [SC('That’s a fair answer. Home is who is waiting, more than where.')],
            ],
            [
              'The things in it, like my own bed',
              [
                SC(
                  'That’s a fair answer. Familiar things are comforting. They keep us company when people are away.',
                ),
              ],
            ],
            [
              'It needn’t be one place at all',
              [
                SC(
                  'That’s a fair answer, and a surprising one. Perhaps home can travel, in a person or a song.',
                ),
              ],
            ],
          ],
          'Thought about what makes a place feel like home.',
        ),
        ask(
          6,
          LIT,
          'theme',
          'RL.4.2',
          [N('Which sentence states the theme of this scene?')],
          [
            o(
              'A home is made by the people we love, not by how it looks',
              [
                SC(
                  'Exactly. A theme is the big idea under a story, and here it is about what makes a home.',
                ),
              ],
              true,
            ),
            o('Grey farms are dull', [
              SC(
                'That is a detail, not the big idea. The scene says that plain places can still be home.',
              ),
            ]),
            o('Scarecrows do not eat', [
              SC('True, but it is a small detail. The theme is bigger: what makes a home.'),
            ]),
          ],
          'Found the theme of a short scene.',
        ),
      ],
      [
        ch('mine', 'Tell him what you miss about your own home.', [
          SC(
            'There you are, then. Everybody with brains has a place somewhere that they would rather be.',
            'happy',
          ),
        ]),
        ch('his', 'Ask him where his home is.', [
          SC(
            'A pole in a cornfield. I do not miss it at all. Perhaps that is how you can tell it was not home.',
            'think',
          ),
        ]),
        ch('asleep', 'Watch your Nubbin, asleep in Dorothy’s lap.', [
          N(
            'Your Nubbin is asleep in Dorothy’s lap, and Toto in yours. Nobody has asked them about home. They seem to have found it anyway.',
          ),
        ]),
      ],
    ),
    sc(
      'a15-03-kansas-done',
      [
        N(
          'The road goes on, and the fields begin to give way to trees. The Scarecrow walks between you, nearly straight.',
        ),
        N('Behind you the corn stands tall and gold in the sun, row after row.'),
        N('Dorothy hums as she walks. Toto trots at her heel, and your Nubbin trots at yours.'),
      ],
      [
        ask(
          1,
          S,
          'what plants need to grow',
          '2-LS2-1',
          [N('The corn grew tall in the fields. What does corn, like any plant, need to grow?')],
          [
            o(
              'Sunlight, water and soil',
              [
                N(
                  'Yes. Plants make their food from sunlight and water, and roots hold them in soil that gives them minerals.',
                ),
              ],
              true,
            ),
            o('Only soil', [
              N(
                'Soil matters, but without light and water the corn would not grow. Plants need all three.',
              ),
            ]),
            o('Only water', [
              N(
                'Water is vital, but plants also need light to make food, and soil to hold their roots.',
              ),
            ]),
          ],
          'Named what plants need: sunlight, water and soil.',
        ),
      ],
    ),
    sc(
      'a15-03-complete',
      [
        SC('Shall I tell you a secret? I am afraid of exactly one thing.'),
        D('Crows?'),
        SC('No. Crows are all bluster. Matches. A lighted match.', 'sad'),
        N('You quietly move your matches to the bottom of your bag, under everything.'),
        N(
          'That night he stands in a corner, since he never gets tired. He watches over you all till morning, and says it is the most useful he has ever felt.',
        ),
      ],
      [
        ask(
          2,
          H,
          'fire needs fuel, heat and air',
          CASEL_RD,
          [
            N(
              'A fire needs three things to burn: fuel, heat and air. What is the Scarecrow, as far as a fire is concerned?',
            ),
          ],
          [
            o(
              'Fuel: straw burns easily',
              [
                N(
                  'Yes. Straw is dry and burns fast, which is why he is right to be careful. Matches are for grown-ups: if you find some, do not touch, tell an adult.',
                ),
              ],
              true,
            ),
            o('Air', [
              N(
                'There is plenty of air everywhere, but the Scarecrow is made of dry straw. That makes him fuel.',
              ),
            ]),
            o('Heat', [
              N(
                'Heat comes from the flame. The Scarecrow is made of dry straw, and dry straw is fuel.',
              ),
            ]),
          ],
          'Learned that fire needs fuel, heat and air, and why matches are for grown-ups.',
        ),
      ],
    ),
  ],
  [
    gl('ripe', 'Fully grown and ready to be picked and eaten.', 'a15-03-pole'),
    gl('bluster', 'Loud, empty noise that sounds fierce but means nothing.', 'a15-03-complete'),
  ],
);

// ================================================================== A15-4 The Tin Woodman
const Q4: EduQuest = quest(
  'a15-04',
  'The Tin Woodman',
  {
    'a15-04-s1': {
      goal: 'Follow the groaning sound into the forest.',
      hint: 'Leave the road where the trees are thickest, and listen.',
    },
    'a15-04-s2': {
      goal: 'Find the oil-can in the Woodman’s cottage.',
      hint: 'Look along the shelf for the can with the long thin spout.',
    },
    'a15-04-s3': {
      goal: 'Oil the Woodman’s joints, in the right order.',
      hint: 'Start with whatever lets him speak, then whatever is tiredest.',
    },
  },
  [
    sc(
      'a15-04-groan',
      [
        N(
          'In the morning Dorothy goes into the trees to look for water. Not far off, somebody groans.',
        ),
        D('What was that?', 'shock'),
        N(
          'In a clearing stands a man made all of tin, with his axe raised over his head as if he had stopped in the middle of a stroke.',
        ),
        N('A tree beside him is half chopped through, and has been for some time.'),
        TW(
          'Mm. Mm-hm. I have been groaning for a year or more. You are the first to come and see why.',
          'sad',
        ),
        N(
          'He speaks through his teeth, because his jaw will not open. His voice comes out like a gate that wants oiling.',
        ),
        TW(
          'Oil, please. I rusted solid in a rainstorm. There is a can of it on the shelf in my cottage, just through the trees.',
        ),
        TW('Strictly speaking, tin hardly rusts. It is my iron hinges that seized.'),
      ],
      [
        ask(
          7,
          S,
          'rust: iron meets water and air',
          '2-PS1-1',
          [
            N(
              'The Woodman’s iron hinges rusted in the rain. What two things must iron meet before it rusts?',
            ),
          ],
          [
            o(
              'Water and air',
              [
                TW(
                  'Just so. Iron, water and the oxygen in the air make rust, that flaky red-brown crust. Oil keeps the water off.',
                ),
              ],
              true,
            ),
            o('Sunlight and sand', [
              TW(
                'Sand and sunlight do not rust anything. It takes water and the air together. Rain is the worst.',
              ),
            ]),
            o('Cold and dark', [
              TW(
                'Cold and dark alone do not do it. It takes water and air. That is why a dry iron gate lasts longer.',
              ),
            ]),
          ],
          'Learned that iron rusts when it meets water and air, and that oil keeps the water off.',
        ),
      ],
      [
        ch('go', 'Say you will fetch it.', [
          TW('Thank you. Mind the step. I made it before I was tin, and it has never been level.'),
        ]),
        ch('how', 'Ask how it happened.', [
          TW(
            'A rainstorm. I was chopping, and it rained, and I forgot to shelter. That is all. It is always all.',
            'sad',
          ),
        ]),
      ],
    ),
    sc(
      'a15-04-groan-done',
      [
        N('The cottage is just through the trees. You go, with your Nubbin at your heels.'),
        N(
          'Behind you the Woodman does not move, because he cannot. His eyes follow you all the way into the trees.',
        ),
        D('He waited a whole year, and nobody even stopped.', 'sad'),
      ],
      [
        ask(
          2,
          E,
          'helping when someone is in trouble',
          CASEL_SO,
          [
            N(
              'When you notice that someone seems to be stuck or in trouble, what is the best first thing to do?',
            ),
          ],
          [
            o(
              'Stop and ask what is wrong',
              [D('Yes. Stopping is the hard part, and often the only part that matters.')],
              true,
            ),
            o('Assume someone else will help', [
              D(
                'That is easy to do. People in crowds often wait for someone else, so nobody acts. Be the one who asks.',
              ),
            ]),
            o('Walk on, it is not your business', [
              D('A year of walking on is how he ended up stuck. A question costs a minute.'),
            ]),
          ],
          'Talked about what to do when someone seems to be in trouble: stop and ask.',
        ),
      ],
    ),
    sc(
      'a15-04-cottage',
      [
        N(
          'The cottage is small and very tidy. Everything has been put away by somebody with all the time in the world.',
        ),
        N(
          'There is a bed nobody sleeps in, a table nobody eats at, and a shelf of tins, each with a little dust on top.',
        ),
        N(
          'On the shelf stand three oil-cans: a big square one, a small round one, and a middle one with a long thin spout.',
        ),
        N(
          'A label says the big square can holds one litre. The small round can holds a quarter of a litre.',
        ),
        N(
          'Behind the door a picture is pinned up: a Munchkin girl, drawn in pencil, smiling at someone outside the frame.',
        ),
        N('Under it someone has written a name, crossed it out, and written it again.'),
      ],
      [
        ask(
          3,
          M,
          'unit fractions: how many quarters make a whole',
          '3.NF.A.1',
          [
            N(
              'The big can holds 1 litre. The small round can holds 1/4 of a litre. How many small cans fill the big one?',
            ),
          ],
          [
            o('4', [N('Yes. Four quarters make one whole: 1/4 + 1/4 + 1/4 + 1/4 = 1.')], true),
            o('3', [
              N(
                'Three quarters is not quite a whole litre. It takes four: 1/4 + 1/4 + 1/4 + 1/4 = 1.',
              ),
            ]),
            o('2', [N('Two quarters make a half. It takes four quarters to make a whole.')]),
          ],
          'Used unit fractions: four quarters make one whole.',
        ),
      ],
      [
        ch('spout', 'Take the one with the long spout.', [
          N(
            'The long spout will reach right into the joints. You tuck the can under your arm, and it sloshes, comfortably full.',
          ),
        ]),
        ch('big', 'Take the big square one, to be sure.', [
          N(
            'The big one is empty, and the one with the spout is full. You take that one instead, and feel you have learned something.',
          ),
        ]),
        ch('picture', 'Look at the picture a little longer.', [
          N('She has a kind, untidy face. Somebody drew it very carefully, a long time ago.'),
          N('You take the can with the long spout, and go.'),
        ]),
      ],
    ),
    sc(
      'a15-04-cottage-done',
      [
        N(
          'You run back through the trees. The Woodman has not moved, but his eyes are glad to see you.',
        ),
        N(
          'You keep thinking of the girl in the pencil picture: a kind, untidy face, drawn very carefully.',
        ),
        N('Whoever drew it took trouble over her eyes.'),
      ],
      [
        ask(
          2,
          A,
          'proportion in a drawn face',
          '1.G.A.3',
          [
            N(
              'Artists who draw faces place the eyes with care. Where do the eyes sit on a real head?',
            ),
          ],
          [
            o(
              'About halfway down',
              [
                N(
                  'Yes. Most people draw them too high. The eyes sit about halfway between the top of the head and the chin.',
                ),
              ],
              true,
            ),
            o('Near the top', [
              N('That is the usual mistake! Look in a mirror: the eyes are about halfway down.'),
            ]),
            o('Near the chin', [
              N('Too low. Check in a mirror: the eyes are about halfway down the head.'),
            ]),
          ],
          'Learned a drawing rule: the eyes sit about halfway down the head.',
        ),
      ],
    ),
    sc(
      'a15-04-oil',
      [
        D('Where shall we start?'),
        TW('Mm. Mmm-m.', 'sad'),
        SC('I think he says “neck”. Though I may only think so because I have no brains.'),
        N(
          'The neck is rusted so badly that Dorothy has to work the head from side to side while you drip in oil.',
        ),
        N(
          'At last it turns, with a long, slow creak. The Woodman moves his head carefully, as if it might come off.',
        ),
        TW(
          'Thank you. Now my arms, please. I have held this axe up for a year, and I should like to put it down.',
        ),
        N(
          'You oil the arms. They creak, then give. He lowers the axe and leans it against the tree with a great sigh.',
        ),
        TW('And now, if you would, my legs.'),
      ],
      [
        ask(
          4,
          LIT,
          'sound words that show what we hear',
          'RL.1.4',
          [N('The head turns with a long, slow creak. What kind of word is “creak”?')],
          [
            o(
              'A word that sounds like the noise it names',
              [
                N(
                  'Yes. Words like creak, drip and clank copy a sound. They help a reader hear the page.',
                ),
              ],
              true,
            ),
            o('A word for a colour', [
              N('Not a colour. It is a word that imitates a sound, like drip and clank.'),
            ]),
            o('A word for a person', [
              N('A creak is a noise. The word sounds like the noise it names.'),
            ]),
          ],
          'Noticed sound words that imitate the noise they name.',
        ),
        ask(
          6,
          S,
          'friction: oil makes surfaces slide',
          '3-PS2-1',
          [N('The arms creaked, then gave. Why does oil help a stiff joint move?')],
          [
            o(
              'It makes the surfaces slippery, so they rub less',
              [
                N(
                  'Yes. Rubbing between surfaces is called friction. Oil in the gap lowers it, so the joint swings freely.',
                ),
              ],
              true,
            ),
            o('It makes the metal softer', [
              N(
                'The metal stays the same. The oil sits between the surfaces and lets them slide, which lowers friction.',
              ),
            ]),
            o('It makes the joint heavier', [
              N(
                'Oil weighs almost nothing. What it does is lower the friction, so the surfaces slide.',
              ),
            ]),
          ],
          'Learned that oil lowers friction between rubbing surfaces.',
        ),
      ],
      [
        ch('legs', 'Do his legs.', [
          N(
            'You oil his legs, one joint at a time, until he can walk. He takes three steps, then three more, for the pleasure of it.',
          ),
        ]),
        ch('jaw', 'Give his jaw another drop first.', [
          TW('Ah. Yes. Much better. I had not liked to ask.', 'happy'),
          N('Then you do his legs, and he takes three steps for the pleasure of it.'),
        ]),
        ch('all', 'Oil everything you can find, twice.', [
          N('You oil him from top to toe, twice. He shines like a new kettle.'),
          TW('I may slip over. But I shall slip over very smoothly.', 'happy'),
        ]),
      ],
    ),
    sc(
      'a15-04-oil-done',
      [
        TW(
          'Another year and I would have been a statue. I am more obliged to you than I can say.',
          'soft',
        ),
        N(
          'He bows, a little stiffly, and for the first time in a year something in the clearing is moving.',
        ),
        N('Dorothy helps him pick up his axe, and he tucks it carefully under one arm.'),
      ],
      [
        ask(
          0,
          LIT,
          'multiple-meaning words',
          'L.3.4',
          [
            N(
              'The Woodman says he is “more obliged to you than I can say”. What does obliged mean here?',
            ),
          ],
          [
            o(
              'Very thankful',
              [
                N(
                  'Yes. Here it means grateful. The word can also mean forced to, as in “you are obliged to wear a seat belt”.',
                ),
              ],
              true,
            ),
            o('Forced to', [
              N(
                'That is its other meaning. Here nobody is forcing him. He is saying he is very thankful.',
              ),
            ]),
            o('Angry', [
              N('He is anything but angry. In this sentence, obliged means very thankful.'),
            ]),
          ],
          'Worked out which meaning of obliged fits the sentence.',
        ),
      ],
    ),
    sc(
      'a15-04-complete',
      [
        TW('May I ask why you are in the great forest?'),
        D(
          'We are going to the City of Emeralds, to see the great Oz. I want to go home, and the Scarecrow wants some brains.',
        ),
        TW('This Oz. Might he have a heart he could spare?', 'think'),
        N('He taps his chest. It rings hollow, like an empty pail.'),
        TW(
          'I was a man once, and I loved a Munchkin girl. Then my axe was enchanted, and I lost myself one piece at a time.',
          'sad',
        ),
        TW(
          'The tinsmith made me new pieces, but he never made a heart. And without one I forgot how to love her.',
          'sad',
        ),
        SC(
          'I shall still ask for brains. A heart is no use to somebody who cannot think what to do with it.',
        ),
        TW('A clever man can be miserable. I would rather be happy, and a heart is how.'),
        N('Dorothy puts the oil-can into your hands. From now on, it seems, it is yours to carry.'),
      ],
      [
        think(
          7,
          E,
          'what matters most for a good life',
          CASEL_RD,
          [
            N(
              'The Scarecrow wants brains and the Woodman wants a heart. Which matters more for a good life: being clever, or being kind?',
            ),
          ],
          [
            [
              'Being clever',
              [
                SC(
                  'That’s a fair answer. A clever person can solve a great many problems, including other people’s.',
                ),
              ],
            ],
            [
              'Being kind',
              [
                TW(
                  'That’s a fair answer. A kind person is welcome everywhere, even when they are not the cleverest.',
                ),
              ],
            ],
            [
              'You need both',
              [
                SC(
                  'That’s a fair answer, and probably the wisest one. It is why the pair of us walk together.',
                ),
              ],
            ],
          ],
          'Thought about whether cleverness or kindness matters more for a good life.',
        ),
      ],
    ),
  ],
  [
    gl(
      'rust',
      'The red-brown crust that forms on iron when it meets water and air.',
      'a15-04-groan',
    ),
    gl(
      'obliged',
      'Very thankful to someone. It can also mean forced to do something.',
      'a15-04-oil-done',
    ),
  ],
);

// ================================================================== A15-5 The Cowardly Lion
const Q5: EduQuest = quest(
  'a15-05',
  'The Cowardly Lion',
  {
    'a15-05-s1': {
      goal: 'Walk on through the deep forest.',
      hint: 'Stay together on the yellow bricks. The woods are darker here.',
    },
    'a15-05-s2': {
      goal: 'Let your Nubbin decide about the Lion, in its own time.',
      hint: 'Sit down on the roadside and wait. Do not pull your Nubbin forward.',
    },
  },
  [
    sc(
      'a15-05-roar',
      [
        N(
          'The road runs into thick woods. It is dim under the trees, and now and then something growls a long way off.',
        ),
        N('Your Nubbin walks so close to your boots that you keep treading on it.'),
        N('Then comes a terrible roar, and out of the trees bounds a great Lion.'),
        N(
          'One blow of his paw spins the Scarecrow to the side of the road. His claws strike the Woodman, and only scratch the tin.',
        ),
        N('Little Toto runs at the Lion, barking. The Lion opens his great mouth.'),
        N('Dorothy rushes forward and smacks the Lion right on the nose.'),
        D('Leave him alone! You great bully, picking on a little dog. Shame on you!', 'angry'),
        L('I did not bite him.', 'sad'),
        N('The Lion rubs his nose where Dorothy hit it. His eyes are filling up.'),
      ],
      [
        ask(
          2,
          S,
          'animals in groups: lions and their prides',
          '3-LS2-1',
          [
            N(
              'Real lions live in family groups called prides, and a roar can carry about eight kilometres. Why would a lion roar so loudly?',
            ),
          ],
          [
            o(
              'To call to its pride and warn rivals to keep away',
              [
                N(
                  'Yes. A roar says “here I am” to family and “stay out” to strangers. Living in a pride helps lions hunt and guard their young.',
                ),
              ],
              true,
            ),
            o('To scare earthworms', [
              N(
                'Earthworms are not listening. A roar carries far, so a lion can reach its pride and warn off rivals.',
              ),
            ]),
            o('Only because it is hungry', [
              N(
                'Hunger is not the reason. A roar is for calling the pride together and warning rivals away.',
              ),
            ]),
          ],
          'Learned that lions live in prides and roar to call their family and warn rivals.',
        ),
      ],
      [
        ch('still', 'Stand still. Your Nubbin is behind your boots.', [
          N(
            'Your Nubbin is pressed flat behind your heels, shaking. You do not move, so that it has something to hide behind.',
          ),
        ]),
        ch('scarecrow', 'Go and pick up the Scarecrow.', [
          N('You set the Scarecrow on his feet and pat him back into shape.'),
          SC('Thank you. Is the Lion still there? I could not see, being upside down.'),
        ]),
      ],
    ),
    sc(
      'a15-05-roar-done',
      [
        D('No, but you meant to frighten him, which is nearly as bad.'),
        L('I know. I have always known. Knowing does not help.', 'sad'),
        N('Dorothy looks at her stinging hand. She is not sure she is proud of that smack.'),
      ],
      [
        think(
          2,
          E,
          'standing up to a bully',
          CASEL_RD,
          [
            N(
              'Dorothy hit the Lion to protect Toto. Is hitting ever the right answer to a bully? What else could she have done?',
            ),
          ],
          [
            [
              'Never: find another way',
              [
                N(
                  'That’s a fair answer. She could have shouted, picked Toto up, or put herself between them. Those may work without anyone getting hurt.',
                ),
              ],
            ],
            [
              'Sometimes, to protect someone small',
              [
                N(
                  'That’s a fair answer. Protecting someone matters. Even so, notice that Dorothy herself is unsure afterwards.',
                ),
              ],
            ],
            [
              'It depends on the bully',
              [
                N(
                  'That’s a fair answer. Often the safest thing is to get away and get help, whoever the bully is.',
                ),
              ],
            ],
          ],
          'Thought about whether hitting is ever the answer to a bully, and what else could be done.',
        ),
      ],
    ),
    sc(
      'a15-05-sit',
      [
        N(
          'The Lion sits down in the road and wipes his eyes with the tip of his tail. He looks very large and very miserable.',
        ),
        L(
          'A lion is meant to be brave. King of Beasts, and all that. So I roar, and everyone runs away.',
        ),
        L('But if anything ever stood up to me, I should run myself. I cannot help it.', 'sad'),
        TW(
          'Perhaps there is something wrong with your heart. Then be glad of it. I have not even that.',
          'sad',
        ),
        N(
          'Your Nubbin comes out from behind your boots a little at a time: one paw, then its nose, then the rest of it.',
        ),
        N(
          'It walks across the road, stops, thinks about going back, and does not. Then it sits down beside the Lion, against his foreleg.',
        ),
        L('Oh. Oh, look. It is not afraid of me.', 'soft'),
      ],
      [
        ask(
          5,
          LIT,
          'character traits',
          'RL.3.3',
          [N('Which word best describes your Nubbin when it sits down beside the Lion?')],
          [
            o(
              'Brave: it acted even though it was scared',
              [L('Yes. Brave does not mean not scared. It means doing the thing anyway.')],
              true,
            ),
            o('Fearless: it felt no fear at all', [
              L(
                'Look at its shaking paws. It was scared, and went anyway. That is brave, not fearless.',
              ),
            ]),
            o('Careless: it did not think', [
              L('It thought for a long time, remember. It stopped, and thought about going back.'),
            ]),
          ],
          'Chose a character trait (brave) that fits what a character does, not only what she feels.',
        ),
      ],
      [
        ch('tell', 'Tell him it is just as frightened as he is.', [
          L('Is it? And it came over anyway? Well. Well, I never.', 'think'),
        ]),
        ch('nothing', 'Say nothing. Let them sit.', [
          N(
            'You say nothing. The Lion does not move a whisker, in case your Nubbin changes its mind.',
          ),
        ]),
      ],
    ),
    sc(
      'a15-05-sit-done',
      [
        D(
          'We are going to the great Oz. He will give the Scarecrow brains, and the Woodman a heart.',
        ),
        L('Would he have any courage to spare, do you think? For a lion?', 'think'),
        D('I should think he has a cupboard full. Come with us.'),
        N(
          'So you set off in a line: Dorothy, the Scarecrow, the Woodman and you on two legs, the Lion and Toto on four.',
        ),
      ],
      [
        ask(
          3,
          M,
          'two-step word problem',
          '3.OA.D.8',
          [
            N(
              'Leaving out your Nubbin: four walkers have two legs each, and two walkers have four legs each. How many legs are on the road?',
            ),
          ],
          [
            o(
              '16',
              [
                N(
                  'Yes. Four walkers on two legs is 4 × 2 = 8. Two walkers on four legs is 2 × 4 = 8. Then 8 + 8 = 16.',
                ),
              ],
              true,
            ),
            o('12', [
              N('Close. Do the two groups separately: 4 × 2 = 8 and 2 × 4 = 8. Then 8 + 8 = 16.'),
            ]),
            o('14', [
              N('Check each group: 4 × 2 = 8 legs, and 2 × 4 = 8 legs. Together that is 16.'),
            ]),
          ],
          'Solved a two-step word problem: 4 × 2 and 2 × 4 make 16 legs.',
        ),
      ],
    ),
    sc(
      'a15-05-complete',
      [
        N(
          'So you all go on together, the Lion walking beside Dorothy with great dignity, and Toto not at all sure about it.',
        ),
        N(
          'Later the Woodman steps on a beetle by accident, and is so sorry that tears run down his face.',
        ),
        N('The tears run into the hinges of his jaw, and in a moment his jaw has rusted shut.'),
        TW('Mm. Mmm!', 'sad'),
        N('You have the oil-can. You do his jaw while the Scarecrow holds his hat.'),
        TW(
          'Having no heart, I must take great care never to be unkind to anything. I must watch where I step.',
          'sad',
        ),
        N('After that he walks looking down at the road, and steps over every ant.'),
      ],
      [
        ask(
          1,
          S,
          'insects have six legs',
          '4-LS1-1',
          [N('A beetle is an insect. How many legs does every insect have?')],
          [
            o(
              'Six',
              [
                N(
                  'Yes. Six legs, three body parts and, usually, wings. Spiders have eight legs, so they are not insects.',
                ),
              ],
              true,
            ),
            o('Eight', [
              N('Eight belongs to spiders, which are not insects. Every insect has six legs.'),
            ]),
            o('Four', [N('Four is for animals like dogs and mice. Every insect has six legs.')]),
          ],
          'Learned that insects have six legs, while spiders have eight.',
        ),
      ],
    ),
  ],
  [
    gl('pride', 'A family group of lions that lives and hunts together.', 'a15-05-roar'),
    gl(
      'bully',
      'Someone who uses their size or strength to frighten people smaller than they are.',
      'a15-05-roar',
    ),
  ],
);

// ================================================================== A15-6 The Kalidahs
const Q6: EduQuest = quest(
  'a15-06',
  'The Kalidahs',
  {
    'a15-06-s1': {
      goal: 'Cross the first ditch on the Lion’s back.',
      hint: 'Climb on when the Lion crouches. Hold his mane, and do not look down.',
    },
    'a15-06-s2': {
      goal: 'Keep watch at the back as the wood grows darker.',
      hint: 'Walk last and listen for growls among the trees.',
    },
    'a15-06-s3': {
      goal: 'Help bring the tree down across the ditch, then hurry everyone over.',
      hint: 'Pull the rope when the Woodman shouts. Cross quickly, and do not stop on the trunk.',
    },
  },
  [
    sc(
      'a15-06-ditch',
      [
        N(
          'The road comes to a ditch, right across it, wide and very deep. At the bottom are big jagged rocks.',
        ),
        SC('We cannot fly, and I do not fancy climbing down. So it is jump it, or stay put.'),
        N('You pace it out, heel to toe. The ditch is four metres across.'),
        L('I might be able to jump that. I can leap about five metres, on a good day.', 'think'),
        SC(
          'Then you are our bridge! One at a time, on your back. I will go first. If you fell short, I should not mind much, being straw.',
        ),
        L('I am frightened of heights, you know. And of ditches. But I will try.', 'sad'),
      ],
      [
        ask(
          3,
          M,
          'measurement word problem in metres',
          '4.MD.A.2',
          [
            N(
              'The ditch is 4 m across and the Lion can leap 5 m. By how many metres could he clear it?',
            ),
          ],
          [
            o(
              '1 metre',
              [N('Yes. 5 − 4 = 1. Not much spare for a nervous lion, with a rider on his back.')],
              true,
            ),
            o('9 metres', [
              N('That adds them. To see what is left over, subtract: 5 − 4 = 1 metre.'),
            ]),
            o('2 metres', [N('Check the sum: 5 take away 4 leaves 1 metre.')]),
          ],
          'Subtracted lengths in metres to find a safety margin.',
        ),
      ],
      [
        ch('second', 'Go second, with your Nubbin in your coat.', [
          N(
            'You go second, with your Nubbin buttoned into your coat. The Lion leaps, and for a moment there is nothing under you at all.',
          ),
        ]),
        ch('last', 'Go last, after Dorothy.', [
          N(
            'You go last. By then the Lion has the knack of it, and lands like a cat coming down off a wall.',
          ),
        ]),
      ],
    ),
    sc(
      'a15-06-ditch-done',
      [
        L('There. That was very frightening. I shall have to sit down.', 'shock'),
        N('He sits, panting. His heart is thumping so hard you can see it in his chest.'),
        N(
          'Your Nubbin climbs out of your coat and sits beside him, panting too, to keep him company.',
        ),
      ],
      [
        ask(
          1,
          H,
          'slow breathing calms a racing heart',
          CASEL_SM,
          [N('When we are scared, our hearts beat faster. What helps them slow down again?')],
          [
            o(
              'Slow, deep breaths',
              [
                N(
                  'Yes. Breathing in slowly and out more slowly tells your body the danger has passed. Try it: in for four, out for six.',
                ),
              ],
              true,
            ),
            o('Running about', [
              N('Running makes your heart beat faster still. Sit, and breathe slowly.'),
            ]),
            o('Holding your breath', [
              N('Holding your breath makes the body more tense. Slow breaths are better.'),
            ]),
          ],
          'Learned that slow breathing helps a racing heart settle after a fright.',
        ),
      ],
    ),
    sc(
      'a15-06-watch',
      [
        N(
          'On this side the forest is darker still. Strange noises come out of the trees, deep and rumbling.',
        ),
        L('Those are the Kalidahs. They live in this part of the forest.', 'shock'),
        L(
          'Great beasts with bodies like bears and heads like tigers, and long, long claws. I am more afraid of them than of anything.',
        ),
        N(
          'You walk at the back. Every time a twig snaps, your Nubbin checks behind you, and then behind itself.',
        ),
        N(
          'Soon the road comes to a second ditch. This one is so wide that the Lion knows at once he cannot jump it.',
        ),
        TW(
          'There is a tall tree here by the edge. If I chop it so that it falls across, we can walk over.',
        ),
        SC(
          'A bridge! That is just the sort of thing I shall think of myself, once I have brains.',
          'happy',
        ),
      ],
      [
        ask(
          2,
          LIT,
          'describing a character or setting in depth',
          'RL.4.3',
          [N('Which sentence paints the clearer picture of a Kalidah?')],
          [
            o(
              'Its great bear body shook the bracken, and its tiger eyes shone green in the dark.',
              [
                N(
                  'Yes. Strong details (a body, a sound, a colour) let a reader see it. “Scary” only tells.',
                ),
              ],
              true,
            ),
            o('It was a very scary animal.', [
              N(
                'It is true, but it only tells us how to feel. Details such as shaking bracken and shining eyes let us see it.',
              ),
            ]),
            o('It was an animal in the forest.', [
              N('That is correct, but nearly empty. Good description uses sights and sounds.'),
            ]),
          ],
          'Chose the description that uses concrete details instead of just telling.',
        ),
      ],
      [
        ch('listen', 'Keep listening to the trees.', [
          N('You keep listening. The rumbling has stopped, which is worse than the rumbling.'),
        ]),
        ch('tree', 'Help the Woodman choose the tree.', [
          N('You pick the straightest tree. The Woodman agrees, and sets his axe to it.'),
        ]),
      ],
    ),
    sc(
      'a15-06-watch-done',
      [
        N(
          'The Woodman has cut a deep notch on the side of the trunk that faces the ditch. Now he chops from the other side.',
        ),
        N('The tree begins to creak. Behind you, in the dark wood, something else begins to move.'),
        N('Everyone goes quiet and takes hold of the rope.'),
      ],
      [
        ask(
          1,
          S,
          'forces: which way a cut tree falls',
          '3-PS2-1',
          [N('The notch is on the ditch side. Which way will the tree fall?')],
          [
            o(
              'Towards the notch, across the ditch',
              [
                N(
                  'Yes. Gravity pulls the tree down, and the cut leaves it weakest on the notch side, so it tips that way. Woodcutters plan every fall.',
                ),
              ],
              true,
            ),
            o('Away from the notch', [
              N(
                'It is the other way. The notch removes wood on that side, so the trunk gives way there first.',
              ),
            ]),
            o('Straight up', [
              N('Nothing falls up. Gravity pulls it down, towards the weakened side.'),
            ]),
          ],
          'Reasoned about how a cut weakens one side of a tree and gravity makes it fall that way.',
        ),
      ],
    ),
    sc(
      'a15-06-bridge',
      [
        N(
          'You loop a rope round the top of the tree. When the Woodman shouts, you and the Lion pull, and it falls with a crash across the ditch.',
        ),
        N(
          'The ditch is eight metres wide, and the tree is twelve metres long. It lies straight across, with the same length resting on each bank.',
        ),
        N(
          'You are just starting over when there is a sharp growl behind you. Two great beasts are running out of the trees.',
        ),
        L('The Kalidahs!', 'shock'),
        N(
          'Dorothy goes first with Toto in her arms, then the Woodman, then the Scarecrow. You go with your Nubbin under your arm.',
        ),
        N(
          'The Lion goes last. On the far side he turns and gives a roar so terrible that the Scarecrow falls over backwards.',
        ),
        N(
          'The Kalidahs stop short. Then they see that there are two of them and one of him, and they come on.',
        ),
        L('Stand behind me, all of you. I will hold them as long as I can.', 'angry'),
        SC('Wait! The tree! Chop the tree!', 'shock'),
      ],
      [
        think(
          7,
          E,
          'courage and fear together',
          CASEL_SM,
          [
            N(
              'The Lion is shaking, and he stands in front of his friends anyway. Is he brave if he is scared the whole time?',
            ),
          ],
          [
            [
              'Yes: brave means acting while scared',
              [
                L(
                  'That’s a fair answer. Many people say the same. Courage only counts when there is something to be afraid of.',
                ),
              ],
            ],
            [
              'No: brave means not feeling fear',
              [
                L(
                  'That’s a fair answer, and a common idea. Yet then nobody who felt fear could ever be called brave, which seems a pity.',
                ),
              ],
            ],
            [
              'Both can be true',
              [L('That’s a fair answer. A person can shake and still stand. I should know.')],
            ],
          ],
          'Thought about whether a person can be brave and frightened at the same time.',
        ),
      ],
      [
        ch('beside', 'Stand beside the Lion.', [
          N(
            'You stand beside the Lion with your knees shaking, and his are shaking too. You can both feel it.',
          ),
        ]),
        ch('back', 'Pull Dorothy back from the edge.', [
          N(
            'You pull Dorothy back from the edge and hold on to her sleeve. She holds on to yours.',
          ),
        ]),
      ],
    ),
    sc(
      'a15-06-bridge-done',
      [
        N(
          'The Woodman swings his axe. Just as the Kalidahs are halfway over, the tree splits and falls into the gulf, beasts and all.',
        ),
        N('Nobody looks down. After a while the Lion lets out a long breath.'),
        L('Well. That was very nearly the end of me, and I did not care for it at all.', 'shock'),
        N('To steady your mind, you work out how much of the tree lay on each bank.'),
      ],
      [
        ask(
          3,
          M,
          'two-step word problem',
          '3.OA.D.8',
          [
            N(
              'The ditch is 8 m wide and the tree is 12 m long, lying straight across with equal ends on each bank. How much rests on each bank?',
            ),
          ],
          [
            o(
              '2 m',
              [N('Yes. 12 − 8 = 4 m is left over, and shared between two banks that is 2 m each.')],
              true,
            ),
            o('4 m', [
              N('That is the total left over, but there are two banks. 4 ÷ 2 = 2 m on each.'),
            ]),
            o('8 m', [
              N(
                'That is the width of the ditch. The part on the banks is 12 − 8 = 4 m, or 2 m on each.',
              ),
            ]),
          ],
          'Solved a two-step measurement problem: 12 − 8 = 4, shared over two banks, is 2 m each.',
        ),
      ],
    ),
    sc(
      'a15-06-complete',
      [
        N(
          'The trees thin out. In the afternoon you come to a broad river, running fast; on the far side the yellow road goes on through meadows.',
        ),
        SC(
          'We must make a raft. Woodman, you cut the logs. I shall stand here and think about it.',
        ),
        N(
          'The Woodman starts chopping. Your Nubbin finds a patch of sun on the bank and lies in it, flat as a pancake.',
        ),
        L('That was brave of you, standing by me. You were shaking, though.', 'think'),
        Y('So were you.'),
        L('Yes. I noticed. But we both stayed, did we not?', 'soft'),
      ],
      [
        ask(
          0,
          SS,
          'rivers: source and mouth',
          '4-ESS2-2',
          [
            N(
              'Every river has a source, where it starts, and a mouth, where it ends at the sea or a bigger river. Which is usually higher up?',
            ),
          ],
          [
            o(
              'The source',
              [
                N(
                  'Yes. Rivers run downhill, so they start high, in hills or mountains, and end low, at the sea.',
                ),
              ],
              true,
            ),
            o('The mouth', [
              N(
                'The mouth is where the river finishes, and it is the low end. Water flows downhill, from the high source.',
              ),
            ]),
            o('They are at the same height', [
              N(
                'Then the water would not flow! A river runs because its source is higher than its mouth.',
              ),
            ]),
          ],
          'Learned that rivers flow from a high source to a low mouth.',
        ),
      ],
    ),
  ],
  [
    gl('Kalidah', 'A made-up forest beast with a bear’s body and a tiger’s head.', 'a15-06-watch'),
    gl('ditch', 'A long, deep, narrow channel dug or worn in the ground.', 'a15-06-ditch'),
  ],
);

// ================================================================== A15-7 The River and the Stork
const Q7: EduQuest = quest(
  'a15-07',
  'The River and the Stork',
  {
    'a15-07-s1': {
      goal: 'Tie the logs into a raft.',
      hint: 'Bind each log to the next with a double knot. Your Nubbin will hand you the ends.',
    },
    'a15-07-s2': {
      goal: 'Ride the raft across, and get everyone ashore.',
      hint: 'Hold on in the middle. When the Lion swims, hold the Woodman’s belt.',
    },
    'a15-07-s3': {
      goal: 'Wave down the Stork and ask her to fetch the Scarecrow.',
      hint: 'Walk back up the bank until you see the pole, then signal the big bird overhead.',
    },
  },
  [
    sc(
      'a15-07-raft',
      [
        N(
          'By morning the Woodman has cut enough logs. He pegs them together, and you tie every join twice, to be sure.',
        ),
        TW(
          'I do not know any knots. I was a woodman. Woodmen only know how to make things fall down.',
        ),
        N(
          'Your Nubbin holds the rope ends in its mouth and hands them to you one at a time, very solemnly.',
        ),
        N(
          'The Scarecrow cuts poles to push the raft along. He cuts one for himself, very long, and is proud of it.',
        ),
        L('I shall sit in the middle and keep very still. It is what I am best at.'),
        D('Where did you learn your knots?'),
      ],
      [
        ask(
          0,
          S,
          'floating: wood is less dense than water',
          '2-PS1-1',
          [N('Why does a raft made of logs float?')],
          [
            o(
              'Wood is lighter than the same amount of water',
              [
                N(
                  'Yes. The scientist’s word is less dense. A log weighs less than the water it pushes aside, so the water holds it up.',
                ),
              ],
              true,
            ),
            o('Because logs are flat', [
              N(
                'Shape helps a raft stay steady, but a flat stone sinks. Wood floats because it is lighter than the same amount of water.',
              ),
            ]),
            o('Because water likes wood', [
              N(
                'Water has no likes! Wood floats because it is less dense: lighter than the same amount of water.',
              ),
            ]),
          ],
          'Learned that wood floats because it is less dense than water.',
        ),
      ],
      [
        ch('gran', 'From your gran. She tied up everything.', [
          D(
            'Mine are Aunt Em’s. She ties the bread-cloth so tight you need a knife to get in.',
            'happy',
          ),
        ]),
        ch('book', 'From a book with pictures in it.', [
          SC('A book! Brains come in books, I have heard. Perhaps I could stuff one in.', 'think'),
        ]),
        ch('chew', 'Your Nubbin taught you. It chews them.', [
          N('Your Nubbin, hearing this, chews the next knot. You tie it again.'),
        ]),
      ],
    ),
    sc(
      'a15-07-raft-done',
      [
        N(
          'The raft has seven logs, side by side, pegged and tied. It floats, and everyone climbs aboard.',
        ),
        N('It sinks a little under the Lion, and comes up again.'),
        N('You count the joins between the logs. Each one is tied twice.'),
      ],
      [
        ask(
          2,
          M,
          'a two-step problem: joins and knots',
          '3.OA.D.8',
          [
            N(
              'Seven logs lie side by side, and every join between neighbours is tied twice. How many knots is that?',
            ),
          ],
          [
            o(
              '12',
              [
                N(
                  'Yes. Seven logs have 6 joins between them, and each is tied twice: 6 × 2 = 12 knots.',
                ),
              ],
              true,
            ),
            o('14', [
              N(
                'That would be 7 joins. But the last log has no neighbour on its far side: 6 joins, and 6 × 2 = 12 knots.',
              ),
            ]),
            o('7', [
              N(
                'That counts only the logs. There are 6 joins, and each is tied twice, so 6 × 2 = 12.',
              ),
            ]),
          ],
          'Solved a two-step problem: 7 logs have 6 joins, tied twice each, so 12 knots.',
        ),
      ],
    ),
    sc(
      'a15-07-current',
      [
        N(
          'At first the raft goes well. Then, in the middle, the current takes it and carries it downstream, away from the yellow road.',
        ),
        SC(
          'We are going the wrong way! This river runs west, to the Wicked Witch’s country!',
          'shock',
        ),
        N(
          'The Scarecrow pushes his long pole into the river bottom as hard as he can. It sticks fast in the mud.',
        ),
        N(
          'Before he can pull it out, the raft is swept away from under him. He is left clinging to the top of the pole, in the middle of the river.',
        ),
        SC('Goodbye!', 'sad'),
        D('Oh, the poor Scarecrow!', 'sad'),
        L(
          'We must do something. I can swim. Hold on to my tail, Woodman, and I will pull us to the bank.',
        ),
        N(
          'The Lion jumps in. The Woodman holds his tail, you hold the Woodman’s belt, and the Lion swims with all his strength.',
        ),
      ],
      [
        ask(
          1,
          SS,
          'rivers: where the current is strongest',
          GEO,
          [
            N(
              'The raft went wrong in the middle of the river. Where is a river’s current usually strongest?',
            ),
          ],
          [
            o(
              'In the middle',
              [
                N(
                  'Yes. Banks and the river bed rub against the water and slow it down, so the fastest water is out in the middle.',
                ),
              ],
              true,
            ),
            o('Right beside the bank', [
              N(
                'The bank slows the water down by rubbing against it. The fastest water is out in the middle.',
              ),
            ]),
            o('It is the same everywhere', [
              N('Not quite. Water near the banks is slowed down. The middle runs fastest.'),
            ]),
          ],
          'Learned that a river’s current is usually strongest in the middle.',
        ),
      ],
      [
        ch('shout', 'Shout to the Scarecrow that you will come back.', [
          SC('Thank you! I shall not go anywhere! I cannot!', 'sad'),
        ]),
        ch('spray', 'Hold your Nubbin out of the spray.', [
          N(
            'You hold your Nubbin up out of the spray. It watches the Scarecrow the whole way, until he is a dot.',
          ),
        ]),
      ],
    ),
    sc(
      'a15-07-current-done',
      [
        N(
          'At last you reach the bank, far downstream. Everyone is soaked, and you oil the Woodman at once.',
        ),
        D('Now we must walk back up the bank and find him.'),
        N(
          'The Lion is shivering, and not only from cold. He is afraid of water, and he swam anyway.',
        ),
      ],
      [
        think(
          2,
          E,
          'why people face fears for others',
          CASEL_SO,
          [
            N(
              'The Lion was frightened of the river, and swam for his friends. Why do people do scary things for other people?',
            ),
          ],
          [
            [
              'They care more about the friend than the fear',
              [
                L(
                  'That’s a fair answer. Love can be louder than fear, though fear does not go quiet.',
                ),
              ],
            ],
            [
              'They feel they have to',
              [
                L(
                  'That’s a fair answer. A sense of duty can be a strong push, when no one else will act.',
                ),
              ],
            ],
            [
              'They cannot bear to do nothing',
              [
                L(
                  'That’s a fair answer. Doing nothing sometimes hurts more than doing the scary thing.',
                ),
              ],
            ],
          ],
          'Thought about why people do frightening things to help someone else.',
        ),
      ],
    ),
    sc(
      'a15-07-stork',
      [
        N(
          'You walk back along the bank a long way. At last you see him, sitting on his pole in the middle of the river, very lonely.',
        ),
        D('He is too far out. Nobody could swim to him now.', 'sad'),
        TW(
          'I would give a great deal to have him back. I had no friends at all before this week.',
          'sad',
        ),
        N(
          'A big Stork is flying over, quite low, looking for fish. Her wings are as wide as a man is tall.',
        ),
        N('Your Nubbin sees her first, and stands up on its back legs.'),
      ],
      [
        ask(
          3,
          S,
          'body parts that help animals survive',
          '4-LS1-1',
          [N('Many birds, storks included, have hollow bones. How does that help a stork fly?')],
          [
            o(
              'Light bones mean less weight to lift',
              [
                N(
                  'Yes. Hollow bones are strong but light, so wings do not have so much weight to carry.',
                ),
              ],
              true,
            ),
            o('Hollow bones make her float', [
              N('Not float, exactly. They make her light, so her wings can lift her.'),
            ]),
            o('They help her whistle', [
              N('Not for whistling. They keep her body light, so she can fly.'),
            ]),
          ],
          'Learned that many birds have hollow bones, which keep them light enough to fly.',
        ),
      ],
      [
        ch('wave', 'Wave both arms at the Stork.', [
          N(
            'You wave both arms. The Stork tilts, circles, and lands on the bank beside you, folding up like an umbrella.',
          ),
        ]),
        ch('whistle', 'Whistle as loud as you can.', [
          N(
            'You whistle. The Stork wheels round to see what bird could make such a dreadful noise, and lands beside you.',
          ),
        ]),
        ch('hold', 'Hold your Nubbin up so she can see it.', [
          N(
            'You hold your Nubbin up. The Stork comes down for a closer look, decides it is not a fish, and stays to talk.',
          ),
        ]),
      ],
    ),
    sc(
      'a15-07-stork-done',
      [
        ST('Well? What is all this waving about?'),
        D('I am Dorothy, and that is our friend the Scarecrow, out there on the pole.'),
        ST(
          'Is he heavy? I cannot carry anything heavy. I dropped a goose once and I have never heard the end of it.',
        ),
        D('He is only straw. He weighs hardly anything.'),
        ST('Then I will try. But if he is heavier than he looks, back in the river he goes.'),
      ],
      [
        ask(
          2,
          LIT,
          'character traits from small details',
          'RL.3.3',
          [N('What does the Stork’s story about dropping a goose tell us about her?')],
          [
            o(
              'She is cautious, and a bit funny about her mistakes',
              [
                ST(
                  'Just so. A small detail shows a lot: she remembers her mistakes, and she knows her limits.',
                ),
              ],
              true,
            ),
            o('She is very strong', [
              ST(
                'If she were very strong she would not be fussing over weights. The detail shows she is cautious.',
              ),
            ]),
            o('She hates geese', [
              ST('I have nothing against geese. The detail shows I am careful about what I carry.'),
            ]),
          ],
          'Inferred a character’s traits from a small detail.',
        ),
      ],
    ),
    sc(
      'a15-07-complete',
      [
        N(
          'The Stork flies out over the water, takes the Scarecrow by the arm in her long claws, and carries him back to the bank.',
        ),
        SC(
          'I was beginning to think I would spend the rest of my life on a stick. Again!',
          'happy',
        ),
        N(
          'He hugs everybody, even the Lion and Toto. He hugs you twice, and your Nubbin once, carefully.',
        ),
        SC(
          'When I have my brains, I shall come back and think of something splendid to do for you.',
        ),
        ST(
          'Don’t mention it. I have a nest full of chicks to get back to, and they will not stop shouting.',
          'happy',
        ),
        N('She flies away. The Scarecrow waves until she is gone, and then a little longer.'),
      ],
      [
        ask(
          4,
          E,
          'accepting thanks',
          CASEL_RS,
          [N('When the Stork says “Don’t mention it”, what does she mean?')],
          [
            o(
              'It was no trouble, and he owes her nothing',
              [
                ST(
                  'Exactly. It is a kind way to accept thanks. “Don’t mention it” makes the help feel light.',
                ),
              ],
              true,
            ),
            o('Keep it a secret', [
              ST('Not a secret at all. It is just a polite phrase for: it was no trouble.'),
            ]),
            o('She is cross with him', [
              ST('Not cross. She is brushing the thanks aside, kindly, because it was no trouble.'),
            ]),
          ],
          'Understood the polite phrase “don’t mention it” and how to accept thanks.',
        ),
      ],
    ),
  ],
  [
    gl(
      'current',
      'The steady flow of water in a river, which can carry things along with it.',
      'a15-07-current',
    ),
    gl('downstream', 'In the direction that a river flows.', 'a15-07-current'),
  ],
);

// ================================================================== A15-8 The Poppy Field and the Field Mice
const Q8: EduQuest = quest(
  'a15-08',
  'The Poppy Field and the Field Mice',
  {
    'a15-08-s1': {
      goal: 'Carry your Nubbin out of the poppies.',
      hint: 'Hold your breath where the flowers are thickest and head for the green beyond.',
    },
    'a15-08-s2': {
      goal: 'Watch over Dorothy by the river, out of the poppies.',
      hint: 'Stay on the grass by the river bank, where the breeze is fresh.',
    },
    'a15-08-s3': {
      goal: 'Tie a string to every mouse.',
      hint: 'Loop a string gently round a mouse, and pass the other end to the Woodman.',
    },
  },
  [
    sc(
      'a15-08-poppies',
      [
        N(
          'The road leads you through meadows of flowers, yellow and white and blue. Then, ahead, a great field of scarlet poppies.',
        ),
        N('Bees hum from flower to flower. The smell is very strong and very sweet.'),
        D('I think I shall sit down for a minute. Just one minute.', 'soft'),
        TW(
          'Do not sit down! The smell of these flowers sends you to sleep, and nobody can wake you.',
          'shock',
        ),
        N('Dorothy’s eyes close, and she sinks down among the poppies. Toto lies down beside her.'),
        N(
          'Your Nubbin walks slower and slower. It lies down with its nose in a red flower, fast asleep.',
        ),
        N(
          'You feel it too: a heaviness in your arms and legs. Real poppies cannot do this; it is only the story’s magic.',
        ),
        L(
          'Run, all of you! I will go as fast as I can and wait for you on the other side!',
          'shock',
        ),
        SC(
          'The Woodman and I do not breathe, so we can carry Dorothy and Toto. You carry your Nubbin, Keeper. Quick!',
        ),
      ],
      [
        ask(
          1,
          S,
          'pollination',
          '2-LS2-2',
          [
            N(
              'A bee visits a poppy to collect pollen. What does the bee also do, without meaning to?',
            ),
          ],
          [
            o(
              'Carries pollen to the next flower, helping it make seeds',
              [
                N(
                  'Yes. That is pollination. Pollen from one flower must reach another of the same kind before seeds can form.',
                ),
              ],
              true,
            ),
            o('Eats the flower’s roots', [
              N(
                'Bees do not eat roots. As they travel from flower to flower, pollen sticks to them and helps flowers make seeds.',
              ),
            ]),
            o('Makes the flower grow taller', [
              N(
                'The bee does not make it taller. By carrying pollen to the next flower, it helps seeds to form.',
              ),
            ]),
          ],
          'Learned that bees carry pollen between flowers, helping them make seeds.',
        ),
      ],
      [
        ch('breath', 'Hold your breath and run.', [
          N('You hold your breath, scoop up your Nubbin, and run until your chest burns.'),
        ]),
        ch('sleeve', 'Breathe through your sleeve and walk steadily.', [
          N(
            'You breathe through your sleeve and put one foot in front of the other, and do not look at how far it is.',
          ),
        ]),
      ],
    ),
    sc(
      'a15-08-poppies-done',
      [
        N(
          'You come out on to grass at the edge of the field. Your Nubbin sneezes and wakes up, very cross about it.',
        ),
        N('The Lion is lying asleep among the poppies, a long way back. He very nearly made it.'),
        SC('We can do nothing for him. He is much too heavy to lift.', 'sad'),
        N('Your Nubbin yawns, and you wonder how much sleep a person really needs.'),
      ],
      [
        ask(
          3,
          H,
          'how much sleep children need',
          CASEL_SM,
          [N('About how many hours of sleep does a child of 7 to 10 need each night?')],
          [
            o(
              '9 to 12 hours',
              [
                N(
                  'Yes. Sleep is when your body grows and your brain sorts out what you learned. Most children aged 7 to 10 need 9 to 12 hours.',
                ),
              ],
              true,
            ),
            o('5 to 6 hours', [
              N(
                'That is far too little for a child. Children aged 7 to 10 need about 9 to 12 hours.',
              ),
            ]),
            o('14 to 16 hours', [
              N(
                'That is closer to what a very small baby needs. At 7 to 10, 9 to 12 hours is right.',
              ),
            ]),
          ],
          'Learned that children aged 7 to 10 need about 9 to 12 hours of sleep.',
        ),
      ],
    ),
    sc(
      'a15-08-wildcat',
      [
        N('You lay Dorothy on the grass by the river, where the fresh breeze can wake her.'),
        N(
          'A low growl, and a great yellow wildcat comes bounding through the grass, chasing something small and grey.',
        ),
        N(
          'It is a little field mouse, running for her life. The wildcat is gaining on her with every bound.',
        ),
        N(
          'The Woodman, though he has no heart, knows it is wrong for the big one to catch the small one. He charges, shouting, with his axe held high.',
        ),
        N('The wildcat takes one look at a bellowing man of tin, and bolts for the trees.'),
        Q('Oh, thank you! Thank you! I thought that was the end of me.'),
        TW(
          'Please do not mention it. I have no heart, you see, so I try to help anyone who needs a friend. Even a mouse.',
        ),
        Q('A mouse? I am the Queen. The Queen of every Field Mouse there is!', 'shock'),
        N(
          'Out of the grass come mice, dozens of mice, then hundreds, all running and squeaking to their Queen.',
        ),
      ],
      [
        ask(
          2,
          S,
          'food chains: producers',
          'K-LS1-1',
          [
            N(
              'Seeds feed the mouse, and the mouse feeds the wildcat. Which part of this chain makes its own food from sunlight?',
            ),
          ],
          [
            o(
              'The plant the seeds come from',
              [
                N(
                  'Yes. Plants are the producers: they make food from sunlight, water and air. Everything else in a food chain depends on them.',
                ),
              ],
              true,
            ),
            o('The mouse', [
              N(
                'The mouse eats seeds, so it is a consumer. The plant that grew them makes its own food from sunlight.',
              ),
            ]),
            o('The wildcat', [
              N(
                'The wildcat eats other animals, so it is a consumer. Plants make their own food from sunlight.',
              ),
            ]),
          ],
          'Learned that plants are the producers at the start of a food chain.',
        ),
      ],
      [
        ch('bow', 'Bow to the Queen.', [
          Q(
            'Thank you. Most people do not, at my size. It is very hard to be a Queen at my size.',
            'happy',
          ),
        ]),
        ch('still', 'Make sure your Nubbin keeps still.', [
          N(
            'Your Nubbin keeps perfectly still, with a mouse on its head. It has decided this is an honour.',
          ),
        ]),
        ch('lion', 'Ask if the mice can help the Lion.', [
          Q('A Lion? In the poppies? A friend of yours? He would not… eat us?', 'shock'),
        ]),
      ],
    ),
    sc(
      'a15-08-wildcat-done',
      [
        SC('Oh! I have thought of something! A great many mice. And the Lion!', 'happy'),
        Q('A Lion? Will he not eat us?'),
        SC('Not he. He is a coward. Also he is asleep. Also he is our friend.'),
        N('You think of the wildcat, the mouse and the Lion: big and small, all in one meadow.'),
      ],
      [
        think(
          3,
          E,
          'is anyone too small to matter?',
          CASEL_SO,
          [
            N(
              'The Woodman helped a mouse, and now mice will help a lion. Is anyone ever too small to matter?',
            ),
          ],
          [
            [
              'No: small helpers can do big things',
              [SC('That’s a fair answer. This afternoon rather proves it.')],
            ],
            [
              'Yes: some jobs need real size',
              [
                SC(
                  'That’s a fair answer. Some jobs do. But you can often split a big job into small pieces, as the mice will show.',
                ),
              ],
            ],
            [
              'It depends on the job',
              [SC('That’s a fair answer, and a careful one. Match the helper to the task.')],
            ],
          ],
          'Thought about whether small helpers can matter in a big job.',
        ),
      ],
    ),
    sc(
      'a15-08-strings',
      [
        SC(
          'Woodman, make us a cart with wheels. Your Majesty, tell your people to bring a long piece of string each.',
        ),
        N(
          'The Woodman chops and pegs. In an hour he has made a low cart, with wheels cut from a tree trunk.',
        ),
        N(
          'The mice arrive with their strings, and the first of them line up in rows of eight, twelve rows in all.',
        ),
        SC(
          'Now: one string round each mouse, very loose. Round the middle, not the neck. They must be comfortable.',
        ),
        N(
          'So you tie: loop, knot, next mouse; loop, knot, next mouse. Your Nubbin hands you the strings.',
        ),
        Q('Mind the little one at the end. She is very young and very proud of being asked.'),
        N(
          'At last every string is tied. The mice stand in long rows in front of the cart, like a great grey carpet with whiskers.',
        ),
      ],
      [
        ask(
          4,
          M,
          'multiplication in arrays',
          '3.OA.A.3',
          [N('The first mice stand in 12 rows of 8. How many strings have you tied for them?')],
          [
            o(
              '96',
              [
                N(
                  'Yes. 12 rows of 8 is 12 × 8 = 96. You can check: 10 × 8 = 80, and 2 × 8 = 16, and 80 + 16 = 96.',
                ),
              ],
              true,
            ),
            o('20', [N('That adds 12 and 8. Twelve rows of eight mice is 12 × 8 = 96.')]),
            o('86', [
              N('Close, but not quite. Try 10 × 8 = 80, then 2 × 8 = 16. Together that is 96.'),
            ]),
          ],
          'Multiplied an array: 12 rows of 8 mice make 96.',
        ),
      ],
      [
        ch('count', 'Count the mice.', [
          N(
            'You get to four hundred and twelve, then a mouse moves and you have to start again. You decide “a great many” will do.',
          ),
        ]),
        ch('bow', 'Tie the little one’s string last, with a bow.', [
          Q('A bow! She will be impossible now. Thank you.', 'happy'),
        ]),
      ],
    ),
    sc(
      'a15-08-strings-done',
      [
        N(
          'The Scarecrow and the Woodman go into the poppies, without breathing, and roll the sleeping Lion on to the cart.',
        ),
        N(
          'Then the Queen gives the word, and the mice pull, thousands together, and the heavy cart begins to move.',
        ),
        N(
          'They pull in time, with a tiny chant, one squeak for each step. It is an old way to share out a heavy job.',
        ),
      ],
      [
        ask(
          2,
          MU,
          'a steady beat helps people work together',
          'RL.2.4',
          [
            N(
              'Sailors and workers have long sung work songs while hauling ropes. Why does a steady beat help them?',
            ),
          ],
          [
            o(
              'Everyone pulls at the same moment',
              [
                N(
                  'Yes. A steady beat keeps a crowd in step, so all the pulls land together. That is what rhythm is for.',
                ),
              ],
              true,
            ),
            o('It makes the rope lighter', [
              N(
                'The rope weighs the same! The beat helps everyone pull together at the same moment.',
              ),
            ]),
            o('It scares the rope', [
              N('Ropes are not scared! The beat simply keeps everyone pulling in time.'),
            ]),
          ],
          'Learned that a steady beat helps a group pull together in time.',
        ),
      ],
    ),
    sc(
      'a15-08-complete',
      [
        N(
          'They haul the Lion out of the poppies on to the green grass, where the air is fresh. Then you untie every mouse.',
        ),
        N(
          'Dorothy wakes up on the bank. She hears the whole story, and thanks every mouse she can reach.',
        ),
        Q(
          'You have only to call us. Come out into the fields and call, and we shall come running. We are quick, for our size.',
        ),
        N(
          'Much later the Lion wakes up. He is very glad to be alive, and very surprised to hear how.',
        ),
        L('Mice? Mice carried me? Little mice?', 'shock'),
        N(
          'Your Nubbin climbs up and lies down between his ears, very pleased with itself, as if it did most of the pulling.',
        ),
      ],
      [
        ask(
          2,
          SS,
          'communities work by helping one another',
          CIV,
          [
            N(
              'The Queen promises help whenever Dorothy calls. Why do communities work better when members help each other?',
            ),
          ],
          [
            o(
              'Together they can do things nobody could do alone',
              [
                Q(
                  'Just so. A mouse cannot pull a lion, and a thousand mice can. That is what a community is.',
                ),
              ],
              true,
            ),
            o('Because a ruler orders it', [
              Q(
                'Orders can help, but help freely given is stronger. The mice came because they were asked, and because Dorothy’s friend saved their Queen.',
              ),
            ]),
            o('They do not work better', [
              Q(
                'Think of the cart. One mouse could not move it, but a thousand did. Helping each other makes them stronger.',
              ),
            ]),
          ],
          'Talked about how members of a community can do together what none could do alone.',
        ),
      ],
    ),
  ],
  [
    gl(
      'pollen',
      'A fine yellow or orange dust made by flowers, which they need to make seeds.',
      'a15-08-poppies',
    ),
    gl('scarlet', 'A bright, strong red.', 'a15-08-poppies'),
  ],
);

// ================================================================== A15-9 The Green Spectacles
const Q9: EduQuest = quest(
  'a15-09',
  'The Green Spectacles',
  {
    'a15-09-s1': {
      goal: 'Follow the yellow road to the great green gate.',
      hint: 'Walk on until the sky itself looks green, then ring the bell by the gate.',
    },
    'a15-09-s2': {
      goal: 'Let the Guardian lock the green spectacles on you, and on your Nubbin.',
      hint: 'Sit still while he buckles them. Your Nubbin will want to watch you go first.',
    },
    'a15-09-s3': {
      goal: 'Walk through the streets of the Emerald City.',
      hint: 'Follow the Guardian through the streets to the Palace in the middle.',
    },
  },
  [
    sc(
      'a15-09-gate',
      [
        N(
          'The fences by the road are painted green now, and so are the houses. Even the light seems a little green.',
        ),
        N(
          'Ahead there is a green glow in the sky. Then a great high wall, bright green, and a gate studded with emeralds.',
        ),
        N(
          'Dorothy pushes the button by the gate, and a silvery tinkle sounds inside. The gate swings slowly open.',
        ),
        N(
          'Before you stands a little man in green from head to foot, and even his skin is faintly green.',
        ),
        G('And what brings you to the Emerald City?'),
        D('Please, we should like to see the Great Oz.', 'think'),
        G(
          'To see Oz? Nobody has asked that in years. A foolish errand might make him very angry.',
          'shock',
        ),
      ],
      [
        ask(
          1,
          A,
          'mixing colours',
          '2-PS1-1',
          [
            N(
              'The Munchkins wear blue and the Winkies wear yellow, and the City is green. Which two paints mix to make green?',
            ),
          ],
          [
            o(
              'Blue and yellow',
              [
                N(
                  'Yes. Blue and yellow make green. Red and yellow make orange, and red and blue make purple.',
                ),
              ],
              true,
            ),
            o('Red and yellow', [N('Those make orange. For green you need blue and yellow.')]),
            o('Red and blue', [N('Those make purple. For green you need blue and yellow.')]),
          ],
          'Learned that blue and yellow paint mix to make green.',
        ),
      ],
      [
        ch('not', 'Say it is not a foolish errand.', [
          SC('Foolish? Certainly not. Important. Very. And we hear he is a good Wizard, besides.'),
        ]),
        ch('far', 'Say you have all come a very long way.', [
          G(
            'Everybody has, to get here. It is a long way from everywhere. That is rather the point of it.',
          ),
        ]),
        ch('foot', 'Let your Nubbin answer, its own way.', [
          N(
            'Your Nubbin walks up to the Guardian and sits on his foot. He looks down at it, and seems a little less worried.',
          ),
        ]),
      ],
    ),
    sc(
      'a15-09-gate-done',
      [
        G(
          'Then you will want to see him. But spectacles first. Nobody goes in without spectacles.',
        ),
        N('He calls your long, hard journey an errand, as if it were a trip to the shops.'),
      ],
      [
        ask(
          1,
          LIT,
          'vocabulary in context',
          'L.3.4',
          [N('The Guardian calls the visit an errand. What does errand mean?')],
          [
            o(
              'A short trip to do a job',
              [
                N(
                  'Yes. You run an errand to post a letter or buy bread. Calling a long trek an errand is a little joke.',
                ),
              ],
              true,
            ),
            o('A kind of fruit', [N('Not a fruit! An errand is a short trip to do a job.')]),
            o('A long holiday', [
              N(
                'Quite the opposite. An errand is a short trip to do a job, so calling this journey one is a joke.',
              ),
            ]),
          ],
          'Worked out the meaning of errand from context.',
        ),
      ],
    ),
    sc(
      'a15-09-spectacles',
      [
        D('Why spectacles?'),
        G(
          'Because the City is so bright and glorious that it would blind you without them. Everyone wears them, even the people who live here.',
        ),
        G(
          'They are locked on. Oz ordered it so when the City was first built, and I have the only key.',
        ),
        N(
          'He opens a big box of spectacles of every size and shape, and every one has green glass in it.',
        ),
        N(
          'He fits a pair on each of your friends, and a little pair on Toto. Two gold bands go round the back of each head and lock together.',
        ),
        N(
          'For your Nubbin he hunts a long time, and finds a very small pair with round lenses. Then yours. The gold bands click shut behind your ears.',
        ),
        N(
          'Everything is green: the walls, the floor, your own hands. Your Nubbin looks up at you, green, through its little green lenses.',
        ),
      ],
      [
        ask(
          6,
          S,
          'how coloured filters change what we see',
          '1-PS4-2',
          [
            N(
              'Green glass lets green light through and holds back most other colours. Through it, how would a red apple look?',
            ),
          ],
          [
            o(
              'Dark, almost black',
              [
                N(
                  'Yes. A red apple sends back mostly red light, and green glass blocks red, so little reaches your eye. White things would look green.',
                ),
              ],
              true,
            ),
            o('Bright red', [
              N('Not through green glass. It blocks red light, so the apple would look dark.'),
            ]),
            o('Blue', [
              N(
                'Green glass does not turn red into blue. It blocks the red, so the apple looks dark.',
              ),
            ]),
          ],
          'Learned that coloured glass lets its own colour through and blocks others, so colours change.',
        ),
      ],
      [
        ch('ask', 'Ask why they have to be locked.', [
          G(
            'Because Oz said so. That is the best sort of reason. It saves everybody a great deal of thinking.',
          ),
        ]),
        ch('check', 'Check that your Nubbin is all right.', [
          N(
            'Your Nubbin turns its head left, then right, then looks at you for a long time, as if to make sure you are still you.',
          ),
        ]),
      ],
    ),
    sc(
      'a15-09-spectacles-done',
      [
        N('The others look at one another through green glass, and nobody asks why.'),
        N('It is easier, somehow, not to.'),
        N(
          'You think of the Guardian’s answer: “Because Oz said so.” It sounded like a reason, and it was not one.',
        ),
      ],
      [
        think(
          2,
          E,
          'asking why; thinking for yourself',
          CASEL_RD,
          [
            N(
              'Nobody asked why the spectacles had to be locked. When is it good to ask “why”? Is it ever risky never to ask?',
            ),
          ],
          [
            [
              'Always ask when it affects you',
              [
                N(
                  'That’s a fair answer. If a rule affects you, you have a right to know the reason.',
                ),
              ],
            ],
            [
              'Ask, but choose your moment',
              [
                N(
                  'That’s a fair answer. A good question asked kindly and at the right time is often heard better.',
                ),
              ],
            ],
            [
              'Some rules can just be followed',
              [
                N(
                  'That’s a fair answer. Not every rule needs a speech. But a rule that nobody can explain is worth a second look.',
                ),
              ],
            ],
          ],
          'Thought about when to ask “why”, and the risk of never asking.',
        ),
      ],
    ),
    sc(
      'a15-09-streets',
      [
        N(
          'Even through green spectacles the City dazzles you. The streets are lined with fine houses set with emeralds.',
        ),
        N(
          'The people are dressed in green, and their skin looks green too. They stare at the Lion, and the children hide behind their mothers.',
        ),
        N(
          'A man is selling green lemonade for four green pennies a glass. A boy is selling green popcorn for three pennies a bag.',
        ),
        SC('Everything is green. I wonder why.', 'think'),
        D('It is the Emerald City. It is meant to be green.'),
        SC('Of course. Of course it is.'),
        N('Everyone looks happy and well off. Nobody looks up very much.'),
      ],
      [
        ask(
          2,
          M,
          'a two-step money problem',
          '3.OA.D.8',
          [
            N(
              'You buy two glasses of lemonade and one bag of popcorn. How many green pennies do you pay?',
            ),
          ],
          [
            o(
              '11',
              [
                N(
                  'Yes. Two lemonades is 2 × 4 = 8 pennies. Add the popcorn at 3 pennies: 8 + 3 = 11.',
                ),
              ],
              true,
            ),
            o('7', [
              N(
                'That adds one lemonade and one popcorn. You bought two lemonades: 2 × 4 = 8, and 8 + 3 = 11.',
              ),
            ]),
            o('14', [N('That is two of each. One bag of popcorn is 3: 8 + 3 = 11.')]),
          ],
          'Solved a two-step money problem: 2 × 4 + 3 = 11 pennies.',
        ),
      ],
      [
        ch('lemonade', 'Buy your Nubbin a green lemonade.', [
          N('Your Nubbin drinks it all and looks up for more.'),
          N(
            'Whether the lemonade is really green, you will never know. The spectacles do not come off.',
          ),
        ]),
        ch('towers', 'Look up at the towers.', [
          N(
            'The towers are green against a green sky. It is very beautiful, and it gives you a slight headache.',
          ),
        ]),
      ],
    ),
    sc(
      'a15-09-streets-done',
      [
        N(
          'At last you come to a great building in the middle of the City: the Palace of Oz, the Great Wizard.',
        ),
        N('You look back at the high wall, and the single gate you came in by.'),
        N('Nobody in the streets raises a voice, and nobody looks up at the towers.'),
      ],
      [
        ask(
          1,
          SS,
          'walled cities in history',
          HIS,
          [N('Many old cities had high walls with a few gates. Why?')],
          [
            o(
              'To defend the city and to control who came in',
              [
                N(
                  'Yes. Walls kept out enemies and gates let guards check who entered. Here, it also keeps everybody in.',
                ),
              ],
              true,
            ),
            o('To keep the wind out', [
              N(
                'Walls do give some shelter, but the real reason was defence, and to control who came in.',
              ),
            ]),
            o('Only to look pretty', [
              N(
                'Some walls are handsome, but the main job was defence and control of who entered.',
              ),
            ]),
          ],
          'Learned why old cities had walls and gates: defence and control of entry.',
        ),
      ],
    ),
    sc(
      'a15-09-complete',
      [
        N(
          'At the Palace door stands a soldier in a green uniform, with a long green beard that reaches to his knees.',
        ),
        GW('You wish to see the Great Oz. I shall tell him you are here.', 'think'),
        N(
          'He goes in, and is gone a long time. You all wait in the green hall, on a green carpet, under a green ceiling.',
        ),
        GW('Oz will see you. But one at a time, and one each day.'),
        GW(
          'Until then you may each have a room in the Palace, with a green bed, and a green bath, and green books.',
        ),
        N(
          'Your room has a little green fountain in it. Your Nubbin sleeps in the basin, with its spectacles on.',
        ),
      ],
      [
        notice(
          0,
          S,
          'minerals: emerald and hardness',
          '2-PS1-1',
          [
            N(
              'A real emerald is a green crystal of a mineral called beryl. Its green comes from tiny traces of chromium inside.',
            ),
            N('It is hard: an emerald can scratch glass, but glass cannot scratch an emerald.'),
          ],
          'Learned that emerald is a green mineral, hard enough to scratch glass.',
        ),
      ],
    ),
  ],
  [
    gl('errand', 'A short trip to do a job, such as posting a letter.', 'a15-09-gate'),
    gl('spectacles', 'An old word for glasses worn to help you see.', 'a15-09-gate-done'),
  ],
);

// ================================================================== A15-10 Oz, the Great and Terrible
const Q10: EduQuest = quest(
  'a15-10',
  'Oz, the Great and Terrible',
  {
    'a15-10-s1': {
      goal: 'Go into the Throne Room with Dorothy.',
      hint: 'Walk in behind Dorothy, stand where the Soldier puts you, and keep still.',
    },
    'a15-10-s2': {
      goal: 'Hear what Oz looked like to the others.',
      hint: 'Wait in the green hall each day, and talk to whoever comes out.',
    },
    'a15-10-s3': {
      goal: 'Wait outside the Throne Room while the Lion goes in.',
      hint: 'Stand by the door with the others and watch the light under it.',
    },
  },
  [
    sc(
      'a15-10-head',
      [
        N(
          'In the morning the Soldier comes for Dorothy. She holds on to your sleeve, and he looks at you, and lets you come.',
        ),
        N(
          'The Throne Room is big and round, with a high arched roof, and emeralds set close together on walls, ceiling and floor.',
        ),
        N(
          'In the middle is a big throne of green marble. On it, with no body to hold it up, is an enormous Head.',
        ),
        O('You stand before Oz, the Great and Terrible. Speak. What do you want of me?', 'angry'),
        D('I am Dorothy. I am nobody very much. I have come to ask for your help.'),
        O('Those silver shoes. How did you come by them? And the mark on your forehead?'),
        D(
          'My house fell on the Witch of the East, and the Witch of the North kissed me. Please, I want to go back to Kansas.',
        ),
        O(
          'Then you must do something for me first. Nothing is free here. You must earn it.',
          'think',
        ),
      ],
      [
        ask(
          3,
          LIT,
          'multiple-meaning words: terrible',
          'L.3.4',
          [
            N(
              'Oz calls himself “Great and Terrible”. Today terrible means very bad. What does he want people to think it means?',
            ),
          ],
          [
            o(
              'Awe-inspiring and fearsome',
              [
                N(
                  'Yes. In the old sense, terrible meant something that fills you with fear and wonder. Oz hopes the old meaning scares people, not the new one.',
                ),
              ],
              true,
            ),
            o('Very bad at his job', [
              N(
                'That is today’s meaning, and it would be funny, since he is a poor Wizard. But Oz is hoping for the old meaning: fearsome.',
              ),
            ]),
            o('Silly and harmless', [
              N('That is the opposite of what he wants. He wants to sound fearsome.'),
            ]),
          ],
          'Learned that terrible once meant awe-inspiring and fearsome, and which meaning Oz wants.',
        ),
      ],
      [
        ch('hand', 'Hold Dorothy’s hand.', [
          N(
            'Dorothy’s hand is cold, and holds on tight. The Head watches you both, and does not blink.',
          ),
        ]),
        ch('look', 'Look at the Head very carefully.', [
          N('You look carefully. The eyes move, and the mouth.'),
          N('It is a very good Head, almost too good.'),
        ]),
      ],
    ),
    sc(
      'a15-10-head-done',
      [
        O(
          'Rid the land of the Wicked Witch of the West. Put an end to her. Then I will send you home.',
        ),
        D('But I cannot! I have never hurt anything on purpose in my whole life.', 'sad'),
        O(
          'You have my answer. Until the Witch is gone, you will not see your Aunt and Uncle again. Go.',
        ),
        N('He has named a price, and it goes against everything Dorothy is.'),
      ],
      [
        think(
          3,
          E,
          'fairness: a price that goes against someone’s beliefs',
          CASEL_RD,
          [
            N(
              'Oz asks Dorothy to do harm as the price of a favour. Is it fair to ask someone to do what they believe is wrong?',
            ),
          ],
          [
            [
              'No, that is not fair',
              [
                N(
                  'That’s a fair answer. A price that makes you act against your beliefs costs more than it looks.',
                ),
              ],
            ],
            [
              'Yes, if the favour is big enough',
              [
                N(
                  'That’s a fair answer, though hard. Notice that Dorothy herself says she cannot.',
                ),
              ],
            ],
            [
              'It depends what the harm is',
              [
                N(
                  'That’s a fair answer. The size of the harm, and whether it is truly needed, matters a great deal.',
                ),
              ],
            ],
          ],
          'Thought about whether it is fair to demand someone act against their beliefs.',
        ),
      ],
    ),
    sc(
      'a15-10-reports',
      [
        N(
          'The next day it is the Scarecrow’s turn. He comes out of the Throne Room looking dazed, and sits down on the floor.',
        ),
        SC(
          'He was not a Head. He was a lovely Lady in green silk gauze, with wings. She said I should have brains when the Witch was gone.',
        ),
        N(
          'The day after, the Woodman goes in. He comes out walking carefully, the way he does when he has been frightened.',
        ),
        TW(
          'He was not a Lady. He was a terrible Beast, nearly as big as an elephant, with five eyes and five arms and woolly hair all over.',
          'shock',
        ),
        TW('He said the same. The Witch, first. Then a heart.', 'sad'),
        D('He was a Head when I went in.', 'think'),
        SC('Then which is he really?'),
      ],
      [
        ask(
          3,
          M,
          'a two-step word problem',
          '3.OA.D.8',
          [
            N(
              'The Beast had five eyes and five arms. If two such Beasts stood side by side, how many eyes and arms would they have in all?',
            ),
          ],
          [
            o(
              '20',
              [N('Yes. One Beast has 5 + 5 = 10 eyes and arms, and two Beasts have 2 × 10 = 20.')],
              true,
            ),
            o('10', [N('That is one Beast. Two Beasts is 2 × 10 = 20.')]),
            o('25', [N('Check it: 5 eyes + 5 arms is 10 on one Beast, and 2 × 10 is 20.')]),
          ],
          'Solved a two-step problem: (5 + 5) × 2 = 20.',
        ),
      ],
      [
        ch('all', 'Say he might be all of them.', [
          SC(
            'All of them? That is a great deal of Wizard. I should be quite worn out, being so many things.',
            'think',
          ),
        ]),
        ch('none', 'Say he might be none of them.', [
          N('Everyone goes quiet.'),
          TW('None of them? Then what is in there?', 'shock'),
        ]),
        ch('wait', 'Say you will know when the Lion has been.', [
          L('Me? Oh. Oh, dear. I had forgotten it was me tomorrow.', 'shock'),
        ]),
      ],
    ),
    sc(
      'a15-10-reports-done',
      [
        L(
          'I shall roar at him. Then he will have to give me what I ask. Or I shall run away. It could go either way.',
          'think',
        ),
        N(
          'Tomorrow it is the Lion’s turn. Everyone goes quiet, and the lamp in the hall flickers.',
        ),
      ],
      [
        ask(
          1,
          S,
          'fire gives out heat and light',
          '4-PS3-2',
          [N('A flame gives out two kinds of energy that we can sense. Which two?')],
          [
            o(
              'Heat and light',
              [
                N(
                  'Yes. A flame warms you and lights the room, which is why a Ball of Fire would be hot and bright.',
                ),
              ],
              true,
            ),
            o('Sound and smell', [
              N('A fire may crackle and smell of smoke, but its main energy is heat and light.'),
            ]),
            o('Cold and dark', [N('The very opposite! A flame gives out heat and light.')]),
          ],
          'Learned that fire gives out heat and light.',
        ),
      ],
    ),
    sc(
      'a15-10-fire',
      [
        N('On the third day the Lion goes in. The door shuts behind him with a click.'),
        N(
          'You wait outside with the others. Under the door there is a line of light, and it is getting brighter, and redder.',
        ),
        N(
          'Then the heat comes, so strong that the Woodman takes a step back and the Scarecrow takes three.',
        ),
        SC('Mind the door. Mind the door, please. I am very dry.', 'shock'),
        N(
          'The door bursts open and the Lion comes out at a gallop, with his tail between his legs.',
        ),
        L(
          'A Ball of Fire! He was a Ball of Fire, so hot I could not look at it! I went nearer and it singed my whiskers.',
          'shock',
        ),
        N('Your Nubbin runs to him and pats out a small smoking place on the end of his tail.'),
      ],
      [
        ask(
          6,
          H,
          'fire safety: stop, drop and roll',
          CASEL_RD,
          [N('If your clothes ever caught fire, what should you do?')],
          [
            o(
              'Stop, drop and roll',
              [
                N(
                  'Yes. Stop where you are, drop to the ground, and roll to smother the flames. Running only feeds the fire with air. Always tell a grown-up afterwards.',
                ),
              ],
              true,
            ),
            o('Run to find help', [
              N('Running gives the flames more air. Stop, drop and roll instead.'),
            ]),
            o('Wave your arms', [N('Waving fans the flames. Stop, drop and roll puts them out.')]),
          ],
          'Learned fire safety: stop, drop and roll.',
        ),
      ],
      [
        ch('whiskers', 'Look at his whiskers.', [
          N(
            'Three whiskers are curled at the ends, like the corners of an old letter. Later he is rather proud of them.',
          ),
        ]),
        ch('said', 'Ask what the Ball of Fire said.', [
          L(
            'Exactly what he said to all of you. The Witch, first. Then courage. Then everything.',
            'sad',
          ),
        ]),
      ],
    ),
    sc(
      'a15-10-fire-done',
      [
        L(
          'He is the same, whatever he looks like. He wants the Witch gone, and he wants us to do it.',
        ),
        N('A Head, a Lady, a Beast and a Ball of Fire. Four faces, and one message.'),
        N('You look at the others. Nobody speaks, and the lamp in the hall hisses.'),
      ],
      [
        ask(
          1,
          LIT,
          'drawing an inference',
          'RL.3.3',
          [
            N(
              'Oz gave the same message in four different forms. What does that suggest about him?',
            ),
          ],
          [
            o(
              'One person is behind all four, pretending',
              [
                L(
                  'Exactly. When the message never changes but the face does, the faces are probably just costumes.',
                ),
              ],
              true,
            ),
            o('He forgot what he looked like', [
              L('A funny idea, but the message is the clue. It stayed the same every time.'),
            ]),
            o('There are four different Wizards', [
              L(
                'Four Wizards with one message? It is more likely there is one person with four disguises.',
              ),
            ]),
          ],
          'Inferred from a repeated message that one person is behind four disguises.',
        ),
      ],
    ),
    sc(
      'a15-10-complete',
      [
        N(
          'That night you all sit in the green hall and talk it over. Nobody wants to go, and nobody can see another way.',
        ),
        D('I suppose we must try. But I do not want to hurt anybody. Not even her.', 'sad'),
        L('I will come. I shall be too frightened to be much use. But I will come.'),
        SC('I shall come too. I shall not be much use either, being such a fool.'),
        TW('I have not the heart to harm even a Witch. But if you go, I must go with you.'),
        N(
          'In the morning the Guardian unlocks your spectacles and puts them back in his box. He points west, towards the setting sun, where there is no road at all.',
        ),
      ],
      [
        ask(
          5,
          SS,
          'compass directions: the sun sets in the west',
          GEO,
          [
            N(
              'The Guardian points towards the setting sun. If you face the setting sun, which way are you facing?',
            ),
          ],
          [
            o(
              'West',
              [
                N(
                  'Yes. The sun rises in the east and sets in the west. So with the setting sun in front of you, east is behind you.',
                ),
              ],
              true,
            ),
            o('East', [
              N('East is where the sun rises, the other way. The setting sun is in the west.'),
            ]),
            o('South', [
              N('South is on your left when you face west. The setting sun is in the west.'),
            ]),
          ],
          'Learned that the setting sun shows west.',
        ),
      ],
    ),
  ],
  [
    gl(
      'terrible',
      'In old stories, something so powerful that it fills you with fear and awe.',
      'a15-10-head',
    ),
    gl('gauze', 'A very thin, see-through cloth.', 'a15-10-reports'),
  ],
);

// ================================================================== A15-11 The Witch of the West
const Q11: EduQuest = quest(
  'a15-11',
  'The Witch of the West',
  {
    'a15-11-s1': {
      goal: 'Keep watch while the Witch sends her creatures.',
      hint: 'Stay close to the others. When you see the next wave coming, call it.',
    },
    'a15-11-s2': {
      goal: 'Hold on to Dorothy when the Winged Monkeys come.',
      hint: 'Do not run. Hold Dorothy’s hand and keep your Nubbin close.',
    },
    'a15-11-s3': {
      goal: 'Bring the Lion food in secret, as Dorothy does.',
      hint: 'When the Witch is asleep, carry what you saved from supper out to the yard.',
    },
  },
  [
    sc(
      'a15-11-waves',
      [
        N(
          'The country to the west is rough and hilly, with no farms and no houses. Everything there is yellow, the Winkies’ colour.',
        ),
        N(
          'The Wicked Witch of the West has only one eye, but it sees as far as a telescope. From her castle door she sees you all.',
        ),
        N(
          'She blows a silver whistle, and a pack of great wolves comes running out of the far hills. The Woodman goes to stand in front of the rest of you, axe raised.',
        ),
        N(
          'It is over quickly. The wolves will not trouble anyone again, and you do not look long.',
        ),
        N(
          'Next she sends a flock of wild crows. The Scarecrow stands up with his arms stretched out, and when it is over the sky is empty.',
        ),
        N(
          'Then a swarm of black bees. The Scarecrow pulls out his own straw and covers Dorothy, Toto, the Lion, you and your Nubbin with it.',
        ),
        N(
          'The bees find only the Woodman, who is tin. Their stings break on him, and that is the end of the bees.',
        ),
        N(
          'Last she sends a dozen Winkie soldiers with spears. The Lion gives one great roar, and they run all the way home.',
        ),
        N('Far away in her castle the Witch stamps her foot.'),
        W('Then I shall use the Cap. There is nothing else left.', 'angry'),
      ],
      [
        ask(
          5,
          M,
          'multiplication word problem',
          '3.OA.A.3',
          [
            N(
              'The Scarecrow covers the five of you with straw, and each needs 3 handfuls. How many handfuls does he pull out?',
            ),
          ],
          [
            o(
              '15',
              [
                SC(
                  'Yes. Five of you with three handfuls each: 5 × 3 = 15. I am rather thin now, but it was worth it.',
                ),
              ],
              true,
            ),
            o('8', [
              SC('That adds 5 and 3. Five of you needing three handfuls each is 5 × 3 = 15.'),
            ]),
            o('12', [
              SC(
                'Close. That is four of you. Count again: Dorothy, Toto, the Lion, you, your Nubbin. Five of you, and 5 × 3 = 15.',
              ),
            ]),
          ],
          'Solved a multiplication word problem: 5 × 3 = 15 handfuls.',
        ),
      ],
      [
        ch('straw', 'Help stuff the Scarecrow again.', [
          SC(
            'Thank you. I feel quite myself. A bit lumpy round the middle, but that is how I like it.',
            'happy',
          ),
        ]),
        ch('fur', 'Pick the straw out of your Nubbin’s fur.', [
          N(
            'Your Nubbin has straw in its ears and its fur and its mouth. It seems to like the taste.',
          ),
        ]),
      ],
    ),
    sc(
      'a15-11-waves-done',
      [
        N(
          'In the Witch’s cupboard is a Golden Cap with a ring of diamonds round it. Whoever owns it may call the Winged Monkeys three times.',
        ),
        N(
          'She has used it twice already. She puts it on, stands on one foot and then the other, and says the words.',
        ),
        N(
          'You think back to the black bees. A real bee colony has one queen and thousands of workers, and none of them takes orders from a Witch.',
        ),
      ],
      [
        ask(
          2,
          S,
          'animals in groups: bee colonies',
          '3-LS2-1',
          [N('How many queens does a honeybee colony have?')],
          [
            o(
              'One',
              [
                N(
                  'Yes. One queen lays the eggs, and thousands of workers gather food, build the comb and care for the young. They help each other survive.',
                ),
              ],
              true,
            ),
            o('Twelve', [
              N(
                'There is just one. Several queens in one hive would fight. The workers do all the other jobs.',
              ),
            ]),
            o('Hundreds', [N('Hundreds of workers, thousands even, but only one queen.')]),
          ],
          'Learned that a honeybee colony has one queen and many workers who help each other.',
        ),
      ],
    ),
    sc(
      'a15-11-monkeys',
      [
        N(
          'The sky darkens, and there is a great rushing of wings. A band of Monkeys comes down out of the sky, each with a pair of huge wings.',
        ),
        MO('Sorry about this. We have no choice in it. That is the whole trouble with us.', 'sad'),
        N(
          'Some of them seize the Woodman, fly high over a rocky place, and drop him. He lies there dented and battered, and cannot move.',
        ),
        N(
          'Others catch the Scarecrow and pull out all his straw. His hat and boots and clothes go into the top of a tall tree.',
        ),
        N(
          'The rest throw ropes round the Lion, lift him up, and fly off with him towards the Witch’s castle.',
        ),
        N('Then the King flies down at Dorothy with his long arms out, and stops.'),
        MO(
          'Stop! The mark of the Good Witch, on her forehead. We cannot touch her. Nor anyone holding her hand.',
        ),
        N(
          'You are holding her hand, and had not known you were. Your Nubbin is holding on to your boot.',
        ),
      ],
      [
        think(
          7,
          E,
          'responsibility when you are made to act',
          CASEL_SO,
          [
            N(
              'The Monkeys say they have no choice. If someone is made to do something, are they still responsible for it?',
            ),
          ],
          [
            [
              'Yes: they still choose how they act',
              [
                MO(
                  'That’s a fair answer. Even when choices are narrow, people may choose how gently to do a hard thing.',
                ),
              ],
            ],
            [
              'No: if they have no choice, it is not their fault',
              [
                MO(
                  'That’s a fair answer. Blame usually belongs most to whoever gives the orders. I hope you are right.',
                ),
              ],
            ],
            [
              'It depends how much choice they had',
              [
                MO(
                  'That’s a fair answer, and a careful one. “How much choice” is the question a good judge asks.',
                ),
              ],
            ],
          ],
          'Thought about who is responsible when someone is made to act.',
        ),
      ],
      [
        ch('tighter', 'Hold on tighter.', [
          N(
            'You hold on tighter. The Monkeys lift Dorothy, Toto, you and your Nubbin, very gently, as if you were eggs.',
          ),
        ]),
        ch('shout', 'Shout to the Scarecrow that you will come back.', [
          N(
            'Up in the tree the Scarecrow’s hat nods, or the wind does it. You decide it was the Scarecrow.',
          ),
        ]),
      ],
    ),
    sc(
      'a15-11-monkeys-done',
      [
        N(
          'The Monkeys carry you over the hills to the Witch’s castle, set you down at the door, and fly away.',
        ),
        W('Hm. The Good Witch’s mark. And the silver shoes.', 'think'),
        N(
          'For a moment the Witch looks afraid. Then she looks into Dorothy’s eyes, and sees that the girl has no idea what the shoes can do.',
        ),
        W('She does not know. Look at her. She has not the least idea.', 'happy'),
      ],
      [
        ask(
          3,
          LIT,
          'a character’s motive',
          'RL.3.3',
          [
            N(
              'Why does the Witch look so pleased when she sees that Dorothy does not know what the shoes can do?',
            ),
          ],
          [
            o(
              'She thinks she can find a way to take them',
              [
                W(
                  'Quite right. A character’s motive is what drives her. Here, she wants the shoes.',
                ),
              ],
              true,
            ),
            o('She likes Dorothy', [W('Not at all! Look at what she does next.')]),
            o('She is glad to see a new face', [
              W(
                'A new face has nothing to do with it. She is pleased because Dorothy cannot defend the shoes.',
              ),
            ]),
          ],
          'Worked out a character’s motive: the Witch wants the shoes.',
        ),
      ],
    ),
    sc(
      'a15-11-yard',
      [
        W(
          'You! Girl! Clean the pots, sweep the floor, and keep the fire fed. And you, whatever you are, help her.',
          'angry',
        ),
        N(
          'So you work in the Witch’s kitchen with Dorothy. The Witch does not dare touch her, because of the mark, so she shouts instead.',
        ),
        N(
          'Out in the yard the Lion is shut behind a gate. The Witch means to harness him like a horse, to pull her carriage.',
        ),
        N('Every time she comes near, he roars so loud that she jumps back.'),
        W('Then you shall have nothing to eat until you do as I say.', 'angry'),
        N(
          'So every night, when the Witch is asleep, Dorothy carries food to the Lion from the cupboard. You keep watch at the kitchen door.',
        ),
        N(
          'Tonight it is your turn to carry it. Your Nubbin follows you out across the dark yard, on its softest feet.',
        ),
      ],
      [
        ask(
          4,
          H,
          'why bodies need regular meals',
          'K-LS1-1',
          [N('The Lion has gone hungry for days. Why do our bodies need regular meals?')],
          [
            o(
              'Food is fuel: it gives us energy to move, think and grow',
              [
                N(
                  'Yes. Without fuel a body runs down, slows its thinking and gets weak. That is why Dorothy’s secret suppers matter so much.',
                ),
              ],
              true,
            ),
            o('Food is only for pleasure', [
              N('Food can be a pleasure, but it is mainly fuel: energy to move, think and grow.'),
            ]),
            o('Only growing children need food', [
              N('Everybody needs food, whatever their age. Food is fuel for every body.'),
            ]),
          ],
          'Learned that food is fuel, giving energy to move, think and grow.',
        ),
      ],
      [
        ch('bread', 'Bring him the bread you saved from supper.', [
          L('Bread. Lovely. You must have gone hungry for this.', 'soft'),
        ]),
        ch('stew', 'Bring him a bowl of the Witch’s own stew.', [
          L('Her own stew? From her own pot? That is the bravest thing I ever saw.', 'happy'),
        ]),
        ch('sit', 'Bring the food, then stay and sit with him.', [
          N(
            'You sit with your back against his side. He is warm, and he purrs, very quietly, in case the Witch hears.',
          ),
        ]),
      ],
    ),
    sc(
      'a15-11-yard-done',
      [
        L('How shall we ever get away? Is there any way at all?', 'sad'),
        D('I do not know. But we will find one. Somebody always does.'),
        N(
          'The Lion’s purr is very quiet, so the Witch will not hear. It is as soft as a note marked piano in a piece of music.',
        ),
      ],
      [
        ask(
          2,
          MU,
          'music words: piano and forte',
          'L.3.4',
          [N('Musicians use Italian words to say how loudly to play. What does piano mean?')],
          [
            o(
              'Soft',
              [
                N(
                  'Yes. Piano means soft. Its partner forte means loud. The instrument piano got its name because it can play both: it was first called a pianoforte.',
                ),
              ],
              true,
            ),
            o('Loud', [N('That is forte. Piano is its opposite: soft.')]),
            o('Fast', [N('Speed has other words, such as allegro. Piano means soft.')]),
          ],
          'Learned the music words piano (soft) and forte (loud).',
        ),
      ],
    ),
    sc(
      'a15-11-complete',
      [
        N(
          'Days go by. The Witch watches the silver shoes all the time with her one eye, and wants them more than anything.',
        ),
        N('Dorothy only takes them off at night, and for her bath.'),
        N(
          'The Witch is afraid of the dark, and more afraid of water, so she never comes near either.',
        ),
        N('You sweep the floor round the bucket by the kitchen door. Nobody ever empties it.'),
      ],
      [
        ask(
          3,
          S,
          'shadows form when something blocks light',
          '5-ESS1-2',
          [
            N(
              'A shadow forms where something blocks the light. Which would make the darker shadow: the bucket, or a clear glass jar?',
            ),
          ],
          [
            o(
              'The bucket',
              [
                N(
                  'Yes. The bucket is opaque: light cannot pass through it. A clear jar lets most light through, so its shadow is faint.',
                ),
              ],
              true,
            ),
            o('The glass jar', [
              N(
                'Glass is clear, so most light passes through. The opaque bucket blocks it and makes the darker shadow.',
              ),
            ]),
            o('They make the same shadow', [
              N(
                'Opaque things block light and clear things let it pass, so their shadows are different.',
              ),
            ]),
          ],
          'Learned that opaque things block light and make dark shadows, clear things do not.',
        ),
      ],
    ),
  ],
  [
    gl(
      'colony',
      'A large group of animals, such as bees, that live and work together.',
      'a15-11-waves-done',
    ),
    gl(
      'harness',
      'To fit a strap-and-buckle frame on an animal so that it can pull a cart.',
      'a15-11-yard',
    ),
  ],
);

// ================================================================== A15-12 The Bucket of Water
const Q12: EduQuest = quest(
  'a15-12',
  'The Bucket of Water',
  {
    'a15-12-s1': {
      goal: 'See the Witch’s trick, and try to warn Dorothy.',
      hint: 'Sweep near the middle of the kitchen floor. Something there is not right.',
    },
    'a15-12-s2': {
      goal: 'Stand clear while Dorothy throws the bucket.',
      hint: 'Step back from the doorway, and mind your Nubbin’s feet.',
    },
    'a15-12-s3': {
      goal: 'Help the Winkies mend the Woodman and restuff the Scarecrow.',
      hint: 'Go with the Winkies to the rocks and the tall tree. Carry straw back for the Scarecrow.',
    },
  },
  [
    sc(
      'a15-12-bar',
      [
        N('One morning the Witch is in a very good mood. She hums, and does not shout once.'),
        N(
          'In the middle of the kitchen floor she has laid an iron bar, and by her magic made it so nobody can see it.',
        ),
        N(
          'You do not see it. But your Nubbin stops and sniffs at a place on the floor where there is nothing, and will not walk over it.',
        ),
        N('Dorothy comes in with the pail, humming too, because it seems to be catching.'),
        W(
          'Fetch me the wood, girl. Quickly now. Straight across the floor. Don’t mind me.',
          'happy',
        ),
        N('Dorothy starts across the floor, and you see your Nubbin’s ears go flat.'),
      ],
      [
        ask(
          5,
          LIT,
          'how characters respond; clues in a story',
          'RL.2.3',
          [N('Which clue tells you that something unseen lies on the floor?')],
          [
            o(
              'Your Nubbin will not step there, and its ears go flat',
              [
                N(
                  'Yes. Good readers look for what a character does, not only what is said. The Nubbin’s behaviour is real evidence.',
                ),
              ],
              true,
            ),
            o('The Witch is humming', [
              N(
                'Her good mood is suspicious, and a fair clue to something being up. But the Nubbin’s behaviour points to the exact spot.',
              ),
            ]),
            o('Dorothy is carrying a pail', [
              N('The pail is not a clue about the floor. Look at what the Nubbin does.'),
            ]),
          ],
          'Used a character’s behaviour as a clue to what is happening.',
        ),
      ],
      [
        ch('warn', 'Call out to Dorothy to stop.', [
          N('You call out. Dorothy turns to look at you, steps backwards, and falls over the bar.'),
        ]),
        ch('feel', 'Kneel and feel the floor where your Nubbin is sniffing.', [
          N(
            'Your hand finds cold iron where there is nothing to see. Before you can say so, Dorothy walks straight into it.',
          ),
        ]),
      ],
    ),
    sc(
      'a15-12-bar-done',
      [
        N('Dorothy trips and falls flat, and one silver shoe comes off.'),
        N('Before she can reach it, the Witch has snatched it up and put it on her own thin foot.'),
        W('Ha! One silver shoe. Half a charm is a great deal better than none.', 'happy'),
        N('Dorothy sits up, rubbing her knee. It is going to bruise.'),
      ],
      [
        ask(
          3,
          H,
          'first aid for a bruise',
          CASEL_RD,
          [N('Dorothy has bruised her knee. What helps a bruise?')],
          [
            o(
              'Rest it, and put a cool pack wrapped in cloth on it',
              [
                N(
                  'Yes. Rest and something cool help reduce swelling. Always wrap the cold pack, and tell a grown-up about any bump that really hurts.',
                ),
              ],
              true,
            ),
            o('Run on it as hard as possible', [
              N('Running would make it worse. Rest the knee and keep it cool.'),
            ]),
            o('Put something very hot on it straight away', [
              N('Heat early on can make swelling worse. Cool is better, wrapped in cloth.'),
            ]),
          ],
          'Learned first aid for a bruise: rest, a wrapped cool pack, and tell a grown-up.',
        ),
      ],
    ),
    sc(
      'a15-12-bucket',
      [
        D('Give me back my shoe!', 'angry'),
        W('Certainly not. It is mine now. Finders keepers.', 'happy'),
        D('It is not yours! You have no right to it! You are a mean, wicked old thing!', 'angry'),
        W(
          'Shout all you like, girl. I shall have the other one off you too, one fine day.',
          'happy',
        ),
        N(
          'Dorothy is so angry that she picks up the bucket of water by the door and throws it over the Witch, from head to foot.',
        ),
        N('The Witch gives a gasp. Then, as Dorothy stares at her, she begins to shrink.'),
        W('Water! Oh, you wretched girl, water! I am going, I am going…', 'shock'),
        D('I am sorry! I did not know!', 'shock'),
        N(
          'She melts quickly and quietly, like sugar in hot tea. In a moment there is only a brown puddle on the floor, and her empty dress.',
        ),
      ],
      [
        ask(
          8,
          S,
          'dissolving',
          '2-PS1-1',
          [N('We say sugar “melts” in hot tea. What really happens to it?')],
          [
            o(
              'It dissolves: it breaks into tiny pieces that spread through the water',
              [
                N(
                  'Yes. The sugar is still there, just too small to see. Taste the tea and you would know. That is dissolving, which is different from melting.',
                ),
              ],
              true,
            ),
            o('It disappears for ever', [
              N(
                'Matter does not just vanish. The sugar spreads out in tiny pieces. You can taste it, so it is still there.',
              ),
            ]),
            o('It turns into water', [
              N(
                'Sugar does not become water. It dissolves, spreading through the water as tiny pieces.',
              ),
            ]),
          ],
          'Learned that sugar dissolves in water: it spreads out in tiny pieces and is still there.',
        ),
      ],
      [
        ch('back', 'Hold your Nubbin back from the puddle.', [
          N('Your Nubbin very much wants to sniff the puddle. You do not let it.'),
        ]),
        ch('dorothy', 'Go to Dorothy.', [
          D('I did not know. I did not know it would do that.', 'sad'),
          N(
            'You stand with her a moment. She is shaking a little, and so is the bucket in her hand.',
          ),
        ]),
      ],
    ),
    sc(
      'a15-12-bucket-done',
      [
        N('Dorothy picks the silver shoe out of the puddle, dries it, and puts it back on.'),
        N('Then she pours a fresh bucket over the puddle and sweeps it all out of the door.'),
        D('She is gone. She is really gone. And I did not mean it.', 'sad'),
        D('Now the Lion can come in.'),
      ],
      [
        think(
          3,
          E,
          'accidents, blame and feeling sorry',
          CASEL_SA,
          [
            N(
              'Dorothy did not mean to harm the Witch, and the Witch was cruel. Can you feel sorry about something you never meant to do? Whose fault is an accident?',
            ),
          ],
          [
            [
              'Yes: feeling sorry is natural',
              [
                N(
                  'That’s a fair answer. Sorrow does not always need a fault. It can just mean we cared about what happened.',
                ),
              ],
            ],
            [
              'It was the Witch’s own fault',
              [
                N(
                  'That’s a fair answer. The Witch chose to be cruel. Yet notice that Dorothy still feels sad. Both things can be true.',
                ),
              ],
            ],
            [
              'It was nobody’s fault',
              [
                N(
                  'That’s a fair answer. An accident is something nobody planned. What matters is how we act next.',
                ),
              ],
            ],
          ],
          'Thought about feeling sorry and blame when something happens by accident.',
        ),
      ],
    ),
    sc(
      'a15-12-mend',
      [
        N(
          'Dorothy lets the Lion out of the yard. Then she calls all the Winkies together and tells them they are free.',
        ),
        WK('Free? No more working for her? Not ever?', 'shock'),
        N(
          'The Winkies hold a feast day and dance, all in yellow. It is their colour, as blue is the Munchkins’.',
        ),
        D('Now, please, can you help us find our friends?'),
        WK('We have tinsmiths. The best in the land. Show us where the tin man fell.'),
        N(
          'You lead them to the rocks. The Woodman lies there, badly dented, with his axe rusted and its blade broken.',
        ),
        N(
          'The tinsmiths work for three days and four nights, hammering and soldering and polishing, until he is straight again.',
        ),
        N(
          'Then you all go to the tall tree where the Scarecrow’s clothes are caught. The Woodman chops it down with his new axe.',
        ),
        N(
          'To fill the Scarecrow again takes twelve handfuls of clean straw. Each Winkie carries three handfuls.',
        ),
      ],
      [
        ask(
          8,
          M,
          'division as equal sharing',
          '3.OA.A.3',
          [
            N(
              'Twelve handfuls of straw are needed, and each Winkie carries three. How many Winkies carry the straw?',
            ),
          ],
          [
            o(
              '4',
              [N('Yes. 12 ÷ 3 = 4, because 4 × 3 = 12. Four Winkies, three handfuls each.')],
              true,
            ),
            o('9', [
              N(
                'That subtracts 3 from 12. The question is how many threes fit into twelve: 12 ÷ 3 = 4.',
              ),
            ]),
            o('36', [
              N('That multiplies. Here we share twelve between carriers of three: 12 ÷ 3 = 4.'),
            ]),
          ],
          'Divided 12 handfuls into groups of 3 to get 4 carriers.',
        ),
      ],
      [
        ch('oil', 'Oil the Woodman’s new joints.', [
          TW(
            'Ah. Thank you. They made me splendid, but they forgot I am a person who needs oiling.',
            'happy',
          ),
        ]),
        ch('straw', 'Give the Scarecrow an extra handful of straw.', [
          SC(
            'Oh! I feel so plump and important. As if I might have a thought at any moment.',
            'happy',
          ),
        ]),
      ],
    ),
    sc(
      'a15-12-mend-done',
      [
        SC('There. Am I myself again? It feels like me.', 'happy'),
        N(
          'He is himself, and the Woodman is himself, and the Lion is purring. Dorothy laughs, then cries, then laughs again.',
        ),
        N(
          'The Winkies dance in yellow, and your eye keeps drifting to a purple ribbon one of them is wearing. The two colours seem to make each other glow.',
        ),
      ],
      [
        ask(
          2,
          A,
          'the colour wheel: opposite colours',
          '2-PS1-1',
          [
            N(
              'On a colour wheel, which colour sits opposite yellow, so that the two make each other glow?',
            ),
          ],
          [
            o(
              'Purple',
              [
                N(
                  'Yes. Purple (violet) is opposite yellow. Artists call opposites complementary colours, and put them side by side for punch.',
                ),
              ],
              true,
            ),
            o('Orange', [
              N(
                'Orange sits next to yellow on the wheel, so the two blend rather than clash. The opposite of yellow is purple.',
              ),
            ]),
            o('Green', [
              N(
                'Green is next to yellow too, and a mix of blue and yellow. The opposite of yellow is purple.',
              ),
            ]),
          ],
          'Learned that purple is opposite yellow on the colour wheel (complementary colours).',
        ),
      ],
    ),
    sc(
      'a15-12-complete',
      [
        N(
          'Before you leave, Dorothy goes to the Witch’s cupboard to fill her basket. On the shelf she finds the Golden Cap.',
        ),
        D('It is very pretty. And it fits. I shall wear it instead of my sunbonnet.'),
        N(
          'She does not know what it does, and neither, exactly, do you. It sits on her head, glittering, waiting.',
        ),
        WK('And this is for your little one. We made it in the night.', 'happy'),
        N(
          'It is a tiny gold cap, beaten thin, with glass beads round the band for diamonds. It fits your Nubbin exactly.',
        ),
        WK('It does not call anything. It is just a hat. But it is a very good hat.'),
        N(
          'The Winkies ask the Woodman to stay and rule them. He says he will come back, once he has a heart.',
        ),
      ],
      [
        ask(
          4,
          S,
          'properties of metals: malleable',
          '2-PS1-1',
          [
            N(
              'The tinsmiths beat the little cap thin from a lump of gold. Gold can be hammered into very thin sheets without breaking. What is that property called?',
            ),
          ],
          [
            o(
              'Malleable',
              [
                N(
                  'Yes. A malleable metal can be hammered or pressed into shape without cracking. Gold is one of the most malleable metals there is.',
                ),
              ],
              true,
            ),
            o('Brittle', [
              N(
                'Brittle things snap or shatter when hit, like glass. Gold bends and spreads instead. That is called malleable.',
              ),
            ]),
            o('Magnetic', [
              N(
                'Magnetic means attracted to a magnet, which gold is not. Being easy to hammer thin is called malleable.',
              ),
            ]),
          ],
          'Learned that a malleable metal such as gold can be hammered thin without breaking.',
        ),
      ],
    ),
  ],
  [
    gl(
      'tinsmith',
      'A person who makes and mends things out of tin and other thin metal.',
      'a15-12-mend',
    ),
    gl(
      'malleable',
      'Able to be hammered or pressed into a new shape without breaking.',
      'a15-12-complete',
    ),
  ],
);

// ================================================================== A15-13 The Golden Cap
const Q13: EduQuest = quest(
  'a15-13',
  'The Golden Cap',
  {
    'a15-13-s1': {
      goal: 'Read the words inside the Golden Cap.',
      hint: 'Turn the Cap over and read the lining aloud. It tells you which foot to stand on.',
    },
    'a15-13-s2': {
      goal: 'Fly to the Emerald City, and listen to the Monkey King.',
      hint: 'Hold on to the King as he carries you. Ask him something, or let him be.',
    },
  },
  [
    sc(
      'a15-13-lost',
      [
        N(
          'Going back east there is no road. You walk towards the rising sun, but the grass all looks the same, and soon you are lost.',
        ),
        SC(
          'I have no brains, so I cannot help. But it seems to me we have passed that bush three times.',
          'think',
        ),
        N('Days go by. The Lion is hungry, and the Woodman has stopped talking to save his oil.'),
        D('I know! The Queen of the Field Mice!'),
        N(
          'Dorothy calls, the way the Queen told her. In a minute a great many little feet come pattering through the grass.',
        ),
        Q('Friends! What do you need?'),
        D('We are lost. Which way is the Emerald City?'),
        Q(
          'Miles and miles. But you are wearing the Cap that calls the Winged Monkeys. Did you not know? They could fly you there before lunch.',
          'think',
        ),
        N(
          'Dorothy turns the Cap over and hands it to you. You are the one who reads the signs, and this seems to be a sign.',
        ),
        N(
          'Inside the band are three odd words, and small instructions about which foot to stand on. They look like nonsense, which is how charms look.',
        ),
      ],
      [
        ask(
          1,
          SS,
          'compass directions: sunrise is east',
          GEO,
          [
            N(
              'You set out in the morning, walking towards the rising sun. Which way are you going?',
            ),
          ],
          [
            o(
              'East',
              [
                SC(
                  'Yes. The sun rises in the east. With no landmarks, people tend to drift in circles, which is why we met the same bush three times.',
                ),
              ],
              true,
            ),
            o('West', [
              SC('West is where the sun sets. We walked towards where it rises, which is east.'),
            ]),
            o('North', [
              SC('North is a quarter turn to the left of east. The rising sun is in the east.'),
            ]),
          ],
          'Learned that the sun rises in the east, and that people without landmarks drift in circles.',
        ),
      ],
      [
        ch('read', 'Read the words out for her, slowly.', [
          N(
            'You read them slowly. Dorothy says them after you, standing on her left foot, then her right, then both.',
          ),
        ]),
        ch('foot', 'Let your Nubbin stand on one foot too.', [
          N(
            'Your Nubbin stands on one foot, falls over, stands on the other, and falls over again. Dorothy laughs in the middle of the charm.',
          ),
        ]),
      ],
    ),
    sc(
      'a15-13-lost-done',
      [
        N('A great chattering and flapping, and the band of Winged Monkeys lands all round you.'),
        MO('First call. What is it you want?', 'think'),
        D('Please, carry us to the Emerald City. We have lost our way.'),
        N(
          'Dorothy thinks of the Cap as a charm. A charm can be a magic spell. It can also be a pleasing quality, as in “a charming smile”.',
        ),
      ],
      [
        ask(
          3,
          LIT,
          'multiple-meaning words: charm',
          'L.3.4',
          [N('In which sentence does charm mean a magic spell?')],
          [
            o(
              'The old Cap held a charm that called the Monkeys.',
              [
                N(
                  'Yes. Here a charm is a spell with power. The other uses mean a pleasing quality, as in “the cottage had great charm”.',
                ),
              ],
              true,
            ),
            o('The cottage had a good deal of charm.', [
              N(
                'Here charm means a pleasing, attractive quality. The magic-spell meaning is the one in the Cap sentence.',
              ),
            ]),
            o('Her charm made everyone smile.', [
              N(
                'Here charm means a pleasing, winning quality of a person. The Cap sentence is the magic one.',
              ),
            ]),
          ],
          'Told two meanings of charm apart in context.',
        ),
      ],
    ),
    sc(
      'a15-13-flight',
      [
        N(
          'Two Monkeys make a chair of their hands for Dorothy. Others take the Scarecrow and the Woodman, and a whole team takes the Lion.',
        ),
        N(
          'The King carries you himself, with your Nubbin held tight. The ground goes by far below, like a green and yellow blanket.',
        ),
        D('Why do you have to do what the Cap says?', 'think'),
        MO('It is a long story. But we have a long way to go, so I will tell it.', 'sad'),
        MO(
          'We were free, once. The forest was ours. We went where we liked and ate what we found, and nobody gave us orders.',
        ),
        MO(
          'There was a princess, a sorceress, called Gayelette. She was to marry a young man named Quelala, the best and wisest in the land.',
        ),
        MO(
          'One day my grandfather, who was King then, saw Quelala walking by the river in fine clothes. He thought it would be funny.',
        ),
        MO(
          'We dropped him in the river. He climbed out laughing, but Gayelette did not laugh at all.',
        ),
        MO(
          'So she bound us to the Golden Cap. Whoever owns it may call us three times, and we must obey.',
          'sad',
        ),
        MO(
          'We have been called ever since. We go where we are sent, and carry what we are told, and drop what we are told.',
          'sad',
        ),
      ],
      [
        notice(
          3,
          SS,
          'oral history: how stories carry the past',
          HIS,
          [
            N('The Monkey King tells his people’s past aloud, just as it was told to him.'),
            N(
              'Before writing was common, and in many places still, history is kept this way. It is called oral history.',
            ),
          ],
          'Learned that oral history carries the past by being told aloud.',
        ),
        think(
          9,
          E,
          'fairness of a punishment',
          CASEL_RD,
          [
            N(
              'The Monkeys were bound for ever because of one prank. Is that fair? What would a fair punishment be?',
            ),
          ],
          [
            [
              'No: it is far too harsh',
              [
                MO(
                  'That’s a fair answer. A fair punishment fits the wrong, and should come to an end.',
                ),
              ],
            ],
            [
              'Yes: they brought it on themselves',
              [
                MO(
                  'That’s a fair answer, and my grandfather’s prank was a poor one. But my people were not all guilty. Is it fair to bind children as well?',
                ),
              ],
            ],
            [
              'A fair one would end after a time',
              [
                MO(
                  'That’s a fair answer. A punishment with no end is no longer a lesson. It is a chain.',
                ),
              ],
            ],
          ],
          'Thought about whether the Monkeys’ punishment was fair and what fair would look like.',
        ),
      ],
      [
        ch(
          'ask',
          'Ask what they would do, if they were free.',
          [
            MO('Free?', 'shock'),
            MO('I do not know. Nobody has ever asked. I shall have to think about it.', 'think'),
            N(
              'He flies on in silence. Every so often you see him look up at the sky, as if it had changed.',
            ),
          ],
          { 'a15-cap': 'asked' },
        ),
        ch(
          'silent',
          'Say nothing. Listen to the wind.',
          [
            N(
              'You say nothing. The King flies on, and the wind takes his story away behind you, over the fields.',
            ),
          ],
          { 'a15-cap': 'silent' },
        ),
      ],
    ),
    sc(
      'a15-13-flight-done',
      [
        N(
          'The Monkeys set you all down at the gate of the Emerald City, bow once, and fly away fast.',
        ),
        SC('Now that is how to travel. No ditches at all.', 'happy'),
        N(
          'You look up at the Monkeys, now small as birds. From up there the whole road looked like a map.',
        ),
      ],
      [
        ask(
          2,
          S,
          'maps show the land from above',
          '4-ESS2-2',
          [N('A map shows the land as if seen from straight above. Why is that view so useful?')],
          [
            o(
              'You can see the whole layout and the distances at once',
              [
                N(
                  'Yes. From above you see where everything is, and how far apart. That is what a map is for.',
                ),
              ],
              true,
            ),
            o('It makes things look bigger', [
              N(
                'Things look smaller from above, not bigger. The view lets you see the whole layout at once.',
              ),
            ]),
            o('It hides the roads', [
              N('The opposite. From above, roads, rivers and walls all show up clearly.'),
            ]),
          ],
          'Learned that maps give a view from above, showing layout and distances.',
        ),
      ],
    ),
    sc(
      'a15-13-complete',
      [
        N(
          'The Guardian of the Gates is very surprised to see you. He looks at you all twice, as if counting.',
        ),
        G('You went to see the Wicked Witch of the West. And you came back?', 'shock'),
        SC('Melted, with a bucket. Dorothy did it.'),
        G('Melted? Truly? Well, well, well.', 'happy'),
        N(
          'He opens his big box and locks the green spectacles on you all again, seven pairs in all. The gold bands click shut behind your ears.',
        ),
        N(
          'Your Nubbin holds still for its pair without being asked. It has got used to the world being green.',
        ),
      ],
      [
        ask(
          4,
          M,
          'doubling and equal groups',
          '3.OA.A.1',
          [
            N(
              'There are seven pairs of spectacles, and each is held on by two gold bands. How many gold bands is that?',
            ),
          ],
          [
            o(
              '14',
              [N('Yes. Seven pairs with two bands each is 7 × 2 = 14. That is double seven.')],
              true,
            ),
            o('9', [N('That adds 7 and 2. Seven pairs, two bands in each pair: 7 × 2 = 14.')]),
            o('12', [N('Close. Six pairs would be 12. There are seven pairs: 7 × 2 = 14.')]),
          ],
          'Multiplied equal groups: 7 pairs × 2 bands = 14.',
        ),
      ],
    ),
  ],
  [
    gl('charm', 'A magic spell or object. It can also mean a pleasing quality.', 'a15-13-lost'),
    gl(
      'oral history',
      'The past, kept alive by telling it aloud from one generation to the next.',
      'a15-13-flight',
    ),
  ],
);

// ================================================================== A15-14 The Humbug
const Q14: EduQuest = quest(
  'a15-14',
  'The Humbug',
  {
    'a15-14-s1': {
      goal: 'Go into the Throne Room together, all of you.',
      hint: 'Stand together in the middle of the room, and keep your eyes open.',
    },
    'a15-14-s2': {
      goal: 'Hear the little man out.',
      hint: 'Stand still and let him talk. He is more frightened than you are.',
    },
    'a15-14-s3': {
      goal: 'Decide whether to keep his secret.',
      hint: 'He is asking you, of all of them. Answer him.',
    },
  },
  [
    sc(
      'a15-14-voice',
      [
        N(
          'Oz keeps you waiting four days. On the fifth, the Scarecrow sends word that the Winged Monkeys might be asked their opinion.',
        ),
        N('You are let in at once, all of you together.'),
        N(
          'There is no Head, no Lady, no Beast and no Ball of Fire: only the empty throne, and a hush.',
        ),
        O('Oz, the Great and Terrible, is listening. Why have you come?'),
        N(
          'The voice comes from near the top of the great dome. It seems to come from everywhere at once.',
        ),
        D('We have come for what you promised us. The Wicked Witch is gone.'),
        O(
          'Is she really gone? Goodness. Melted. Well… give me a day. I shall need a little time to think it over.',
          'shock',
        ),
        TW('You have had weeks to think!', 'angry'),
        SC('Not one more day. Not one.', 'angry'),
        L('I think… I think I should roar now.', 'think'),
      ],
      [
        ask(
          4,
          S,
          'sound reflects off hard curved walls',
          '4-PS3-2',
          [N('Why does a voice in a big round hall seem to come from everywhere at once?')],
          [
            o(
              'Sound bounces off the curved walls and reaches you from many directions',
              [
                N(
                  'Yes. Sound waves reflect off hard surfaces, and a dome sends them in every direction. A ventriloquist can use that, too.',
                ),
              ],
              true,
            ),
            o('Sound is louder in green rooms', [
              N(
                'Colour makes no difference to sound. It is the hard curved walls bouncing the sound around.',
              ),
            ]),
            o('The voice is really in your head', [
              N(
                'You are hearing it with your ears. The sound bounces off the dome and arrives from every direction.',
              ),
            ]),
          ],
          'Learned that sound bounces off hard curved walls, so a voice can seem to come from everywhere.',
        ),
      ],
      [
        ch('roar', 'Tell the Lion to go on, then.', [
          N(
            'The Lion gives a roar so loud and fierce that Toto jumps away from him in alarm, and runs off into a corner.',
          ),
        ]),
        ch('let', 'Let go of your Nubbin.', [
          N(
            'Your Nubbin, let go, runs after Toto, who has run off barking at a corner of the room.',
          ),
        ]),
      ],
    ),
    sc(
      'a15-14-voice-done',
      [
        N('Toto tips over a screen that stands in the corner. It falls with a crash.'),
        N(
          'Behind it stands a little old man, with a bald head and a wrinkled face. He looks as surprised as anybody.',
        ),
        N(
          'Everything your friends believed is about to change. In a story, a moment like this is called a turning point.',
        ),
      ],
      [
        ask(
          2,
          LIT,
          'turning point in a story',
          'RL.2.3',
          [N('What changes at this turning point?')],
          [
            o(
              'The friends find out that Oz is only a man, not a great Wizard',
              [
                N(
                  'Yes. A turning point is where the story swings a new way. Everything after this scene is different.',
                ),
              ],
              true,
            ),
            o('Toto learns to bark', [
              N(
                'Toto has barked all along. The turning point is that the friends discover who Oz really is.',
              ),
            ]),
            o('The Lion gets his courage', [
              N(
                'That comes later, and in a very different way. This moment is where they discover Oz is only a man.',
              ),
            ]),
          ],
          'Named the turning point of a scene and what it changes.',
        ),
      ],
    ),
    sc(
      'a15-14-screen',
      [
        N('The Woodman raises his axe and rushes at the little man.'),
        TW('Who are you?', 'angry'),
        O('I… I am Oz, the Great. Please put that down!', 'shock'),
        D('But you were a great big Head!'),
        SC('And a Lady, with wings.'),
        L('And on fire!'),
        O('All of those were me, and none of them were. It was all pretending.', 'sad'),
        SC('Then you are a humbug!', 'shock'),
        O('Yes. Humbug is quite the right word for it.', 'sad'),
        O(
          'I was born in Omaha. I was a ventriloquist, which means I can throw my voice, into a bird, or a statue, or a dome.',
        ),
        O(
          'Then I went up in balloons at the circus, to draw the crowds. One day the ropes got twisted, and I could not come down.',
        ),
        O(
          'I came down out of the clouds, and the people thought I was a Wizard. It was green, so I called it the Emerald City.',
        ),
        O(
          'Then I had to make the name come true, so I gave everybody green spectacles, locked on. It was only a small lie, to begin with.',
          'sad',
        ),
      ],
      [
        ask(
          9,
          SS,
          'where Omaha is',
          GEO,
          [
            N(
              'Omaha is a city in the state of Nebraska, just north of Kansas. If Dorothy walked from Kansas to Omaha, which way would she go?',
            ),
          ],
          [
            o(
              'North',
              [
                N(
                  'Yes. Nebraska lies directly north of Kansas. Omaha stands on the Missouri River, on the border with Iowa.',
                ),
              ],
              true,
            ),
            o('South', [N('South would take her towards Texas. Nebraska is north of Kansas.')]),
            o('West', [N('West would take her towards Colorado. Omaha is to the north.')]),
          ],
          'Learned that Omaha is in Nebraska, north of Kansas.',
        ),
        think(
          12,
          E,
          'how a small fib can grow',
          CASEL_RD,
          [
            N(
              'Oz says a small lie grew until everyone wore locked spectacles. How can a small untruth grow?',
            ),
          ],
          [
            [
              'You need more lies to cover the first one',
              [
                O(
                  'That’s a fair answer, and it is exactly what happened to me. One fib wanted a second to keep it company.',
                  'sad',
                ),
              ],
            ],
            [
              'People start to rely on it',
              [
                O(
                  'That’s a fair answer. Once everyone was comfortable, nobody wanted the truth to spoil it, least of all me.',
                  'sad',
                ),
              ],
            ],
            [
              'It cannot grow: a small lie stays small',
              [
                O(
                  'That’s a fair answer, and I wish it were true. Sometimes it does stay small. Mine did not.',
                  'sad',
                ),
              ],
            ],
          ],
          'Thought about how one small lie can lead to bigger ones.',
        ),
      ],
      [
        ch('band', 'Touch the gold band behind your ear.', [
          N('The City is green because you are wearing green. It was never very much else.'),
        ]),
        ch('lenses', 'Look at your Nubbin, in its little green lenses.', [
          N(
            'Your Nubbin looks back at you through two green circles. It has never once seen this place as it really is.',
          ),
        ]),
      ],
    ),
    sc(
      'a15-14-screen-done',
      [
        ...POOR_WIZARD,
        N('Somebody in the valley promises things like this.'),
        N('Safe, he says. As if it came in a bottle.'),
      ],
      [
        ask(
          3,
          LIT,
          'multiple-meaning words: humbug',
          'L.3.4',
          [N('Oz is called a humbug. What does the word mean here?')],
          [
            o(
              'A person who pretends to be more than they are',
              [
                N(
                  'Yes. A humbug is a fraud or pretender. In Britain it is also a striped mint sweet, which is a very different thing.',
                ),
              ],
              true,
            ),
            o('A striped mint sweet', [
              N(
                'That is a real meaning too, in Britain. But in this story it means someone who pretends to be more than they are.',
              ),
            ]),
            o('A big, noisy bird', [N('Not a bird. In this story it means a pretender.')]),
          ],
          'Told apart two meanings of humbug and chose the one that fits.',
        ),
      ],
    ),
    sc(
      'a15-14-secret',
      [
        N(
          'Dorothy and the others have gone to the far side of the room to talk it over in angry whispers. The little man turns to you.',
        ),
        O(
          'You have not said anything. You are from somewhere else, are you not? I can always tell. I was from somewhere else once.',
        ),
        O(
          'Please do not tell anyone outside this room. The people here are happy. They think they are safe, because I am here.',
        ),
        O(
          'If they knew, they would be frightened. And then they would be very angry with me, and that would frighten me.',
        ),
        N(
          'He looks very old and very small, like someone who has been holding his breath for years.',
        ),
        O(
          'I will do my best for your friends, I promise. I am good at making people feel better. It is nearly the same thing.',
          'think',
        ),
      ],
      [
        ask(
          5,
          E,
          'secrets: when to tell a trusted adult',
          CASEL_RD,
          [N('Which sort of secret should you always tell a trusted grown-up about?')],
          [
            o(
              'One that makes you feel scared, unsafe or uncomfortable',
              [
                N(
                  'Yes. A surprise party is a happy secret. A secret that frightens you or makes your tummy flip is one to share with a grown-up you trust. So is any secret a grown-up asks you to keep from other grown-ups, like this one.',
                ),
              ],
              true,
            ),
            o('A surprise birthday party', [
              N(
                'A surprise party is a happy secret, and fun to keep until the day. The ones to tell are those that make you feel scared or unsafe.',
              ),
            ]),
            o('Where a friend hid a present', [
              N(
                'That is a harmless secret, and kind to keep. The ones to tell a grown-up are secrets that make you feel scared or unsafe.',
              ),
            ]),
          ],
          'Learned to tell happy secrets from secrets that should be shared with a trusted adult.',
        ),
      ],
      [
        ch('keep', 'Promise to keep his secret.', [
          O('Thank you. Thank you. You do not know what that is, to someone like me.', 'soft'),
          N('He shakes your hand. His hand is warm and damp, the hand of a frightened man.'),
        ]),
        ch('theirs', 'Tell him it is not yours to keep. It is theirs.', [
          O('Theirs. Yes. I suppose it is. I suppose it always was.', 'sad'),
          N(
            'He does not argue. He looks almost relieved, the way people do when the worst has been said out loud.',
          ),
        ]),
        ch('quiet', 'Say nothing, and look at the screen.', [
          N(
            'You look at the screen on the floor, and so does he. Neither of you says anything for quite a long time.',
          ),
        ]),
      ],
    ),
    sc(
      'a15-14-secret-done',
      [
        O(
          'Come to me in the morning, all of you. I shall have something for each of you. I always do.',
        ),
        N('You have waited four days already. You wonder how many hours that is.'),
      ],
      [
        ask(
          1,
          M,
          'units of time: days and hours',
          '4.MD.A.1',
          [N('How many hours are there in four days?')],
          [
            o(
              '96',
              [
                N(
                  'Yes. There are 24 hours in a day, and 4 × 24 = 96. You can work it out as 4 × 20 = 80 plus 4 × 4 = 16.',
                ),
              ],
              true,
            ),
            o('24', [N('That is just one day. Four days is 4 × 24 = 96 hours.')]),
            o('48', [N('That is two days. Four days is 4 × 24 = 96 hours.')]),
          ],
          'Converted days to hours: 4 × 24 = 96.',
        ),
      ],
    ),
    sc(
      'a15-14-complete',
      [
        D('But how will I get home to Kansas?'),
        O(
          'Ah. Kansas. That one will take some thinking. Give me a few days. I will find a way, I promise.',
        ),
        SC('And my brains?'),
        O('Tomorrow. Brains, a heart and courage. Come in the morning, one at a time.'),
        L('But you are only a humbug. How can a humbug give anybody anything?', 'think'),
        O(
          'You would be surprised. Most of what people want, they only want to be told they have.',
          'think',
        ),
        N(
          'Going out, you stand the screen back up in its corner. It seems kinder, somehow, than leaving it on the floor.',
        ),
      ],
      [
        ask(
          5,
          E,
          'noticing what you already have',
          CASEL_SA,
          [N('What might it mean to notice what you already have?')],
          [
            o(
              'Seeing strengths in yourself that you had not given credit for',
              [
                N(
                  'Yes. The Scarecrow solved problems, the Woodman cared, and the Lion went on. Each had what they asked for, long before they asked.',
                ),
              ],
              true,
            ),
            o('Counting up your toys', [
              N(
                'Toys are nice, but this is about qualities inside you, such as thinking, kindness and courage.',
              ),
            ]),
            o('Asking a Wizard for more', [
              N('Here it is the opposite: noticing what is already yours.'),
            ]),
          ],
          'Reflected on noticing the strengths you already have.',
        ),
      ],
    ),
  ],
  [
    gl(
      'humbug',
      'A person who pretends to be more than they are. In Britain it is also a striped mint sweet.',
      'a15-14-screen',
    ),
    gl(
      'ventriloquist',
      'A performer who can make their voice seem to come from somewhere else.',
      'a15-14-screen',
    ),
  ],
);

// ================================================================== A15-15 The Magic Art
const Q15: EduQuest = quest(
  'a15-15',
  'The Magic Art',
  {
    'a15-15-s1': {
      goal: 'Help Oz mix the Scarecrow’s brains.',
      hint: 'Measure out the bran, then hand Oz the pins and needles, points away from you.',
    },
    'a15-15-s2': {
      goal: 'Help Oz make the Woodman’s heart.',
      hint: 'Hold the silk heart steady while Oz stuffs it with sawdust.',
    },
    'a15-15-s3': {
      goal: 'Pour out the Lion’s courage.',
      hint: 'Hold the green dish while Oz pours from the square green bottle, then pass it to the Lion.',
    },
  },
  [
    sc(
      'a15-15-brains',
      [
        N(
          'In the morning the Scarecrow goes in first. Oz asks for an assistant, and looks at you.',
        ),
        O(
          'Sit there, if you please. I shall have to take your head off, only for a minute. Brains go in at the top.',
        ),
        SC('Take it off by all means. I hardly use it.', 'happy'),
        N(
          'Oz unpins the Scarecrow’s head and takes out the straw. Then he fetches a sack of bran from the back room.',
        ),
        O(
          'Now. I need exactly one cup of bran. This scoop holds a quarter of a cup. Fill it for me, will you?',
        ),
        N(
          'You fill the quarter-cup scoop three times and tip it in. Then you hand him pins and needles, a pinch at a time, points away from you.',
        ),
        N('He stirs them in with a wooden spoon. One more scoop makes the full cup.'),
      ],
      [
        ask(
          5,
          M,
          'unit fractions of a cup',
          '3.NF.A.1',
          [
            N(
              'You have tipped in three scoops, and each scoop is 1/4 of a cup. What fraction of a cup is that, and how many more scoops make a full cup?',
            ),
          ],
          [
            o(
              '3/4 of a cup, and one more scoop',
              [
                O(
                  'Quite right. Three quarters, and one more quarter makes four quarters, which is one whole cup.',
                ),
              ],
              true,
            ),
            o('3/3 of a cup, and no more', [
              O(
                'Not quite. The pieces are quarters, so the bottom number is 4: three scoops is 3/4. It takes one more to make the whole.',
              ),
            ]),
            o('1/3 of a cup, and two more scoops', [
              O(
                'Look at the scoop: it holds a quarter, so there are four in a cup. Three scoops is 3/4, and one more makes a whole.',
              ),
            ]),
          ],
          'Used unit fractions: three quarter-cups make 3/4 of a cup, and one more makes a whole.',
        ),
      ],
      [
        ch('more', 'Suggest a few more pins, to be safe.', [
          O(
            'More pins. Yes. He will be very sharp. Sharp is good in a Scarecrow; it keeps the crows thoughtful.',
          ),
        ]),
        ch('spoon', 'Ask what the spoon is for.', [
          O('For stirring. And for looking busy. Most of magic is looking busy, my dear.', 'think'),
        ]),
        ch('taste', 'Watch your Nubbin, who is eating the bran.', [
          N('Your Nubbin eats a mouthful of bran, makes a face, and does not try any more brains.'),
        ]),
      ],
    ),
    sc(
      'a15-15-brains-done',
      [
        N(
          'Oz fills the Scarecrow’s head with the mixture and packs straw round it to hold it in. Then he pins the head back on.',
        ),
        O(
          'There. Your new brains, fresh from the sack. You will be a very great thinker now.',
          'happy',
        ),
        SC('I feel wise. Very wise. There is a bump on my head, and that is the brains.', 'happy'),
        N(
          'A real human brain weighs about 1.4 kilograms. It does the thinking, remembering and feeling, and runs your body too.',
        ),
      ],
      [
        ask(
          3,
          S,
          'the brain and what protects it',
          '4-LS1-1',
          [N('A real brain is soft. What protects it?')],
          [
            o(
              'The skull',
              [
                N(
                  'Yes. The skull is a hard case of bone around the brain, and the soft tissue and fluid inside cushion it too. That is why helmets matter.',
                ),
              ],
              true,
            ),
            o('Your hair', [
              N(
                'Hair keeps your head warm, but it is the skull, the bone, that protects the brain.',
              ),
            ]),
            o('Your ears', [
              N('Ears are for hearing. The skull, a hard bone case, protects the brain.'),
            ]),
          ],
          'Learned that the skull protects the brain, which does our thinking and runs the body.',
        ),
      ],
    ),
    sc(
      'a15-15-heart',
      [
        N(
          'Next comes the Woodman. Oz takes a pair of tinsmith’s shears and cuts a small square hole in the left side of his chest.',
        ),
        TW('Will it hurt?', 'think'),
        O(
          'Not at all. You will not feel a thing. That is rather the trouble you came about, is it not?',
        ),
        N(
          'From a chest of drawers Oz takes a pretty heart, made all of silk. You hold it steady while he stuffs it with sawdust.',
        ),
        TW('It is very beautiful. But will it be kind?', 'think'),
        O('The kindest I have in stock.'),
        N(
          'He puts it in the Woodman’s chest, puts back the square of tin, and solders it, very neatly.',
        ),
        N(
          'You have a real heart of your own, about the size of your fist. Put two fingers on the inside of your wrist and find the beat.',
        ),
      ],
      [
        doit(
          7,
          H,
          'finding and counting a pulse',
          '4-LS1-1',
          'edu:count:pulse:15s',
          [
            N(
              'Count the beats you feel in 15 seconds, then multiply by 4 to find your beats in a minute.',
            ),
            N(
              'At rest, a child your age has roughly 70 to 100 beats a minute, so about 17 to 25 in 15 seconds.',
            ),
          ],
          'Found a pulse and counted beats in 15 seconds to estimate a heart rate.',
        ),
      ],
      [
        ch('listen', 'Put your ear to the Woodman’s chest.', [
          N(
            'You listen. There is a soft rustle in there, like someone turning over in bed, and the Woodman holds very still.',
          ),
        ]),
        ch('polish', 'Polish the patch where the hole was.', [
          TW(
            'Thank you. I should like it to show. A heart ought to show a little, I think.',
            'soft',
          ),
        ]),
      ],
    ),
    sc(
      'a15-15-heart-done',
      [
        TW('I feel it. I am sure I feel it. Thank you, thank you.', 'happy'),
        O('Do not mention it. Please. Really, do not.', 'think'),
        N(
          'When people say someone “has a good heart”, they do not mean the muscle. They mean something else.',
        ),
      ],
      [
        ask(
          2,
          E,
          'figures of speech about feelings',
          CASEL_SO,
          [N('When we say someone has a good heart, what do we mean?')],
          [
            o(
              'That they are kind and caring',
              [
                N(
                  'Yes. It is a metaphor: the heart stands for kindness. The Woodman wants the feeling, not just the organ.',
                ),
              ],
              true,
            ),
            o('That their heart beats well', [
              N(
                'That would be a doctor’s meaning. As a figure of speech, a good heart means kindness.',
              ),
            ]),
            o('That they are good at sport', [
              N('Sport has nothing to do with it. A good heart means a kind, caring nature.'),
            ]),
          ],
          'Understood “a good heart” as a metaphor for kindness.',
        ),
      ],
    ),
    sc(
      'a15-15-courage',
      [
        N(
          'Last comes the Lion. Oz takes down a square green bottle from a high shelf, and you hold the dish while he pours.',
        ),
        N('It is green, and it fizzes a little. It smells of nothing at all.'),
        L('What is it?', 'think'),
        O(
          'Courage. Or it will be, once it is inside you. That is where courage lives. Out here in the dish, it is only green.',
        ),
        L(
          'I have been afraid all the way here. Of the Kalidahs, the river, the Witch. Of everything.',
          'sad',
        ),
        O(
          'Of course you have. Everyone facing danger is afraid. Brave is going on anyway, and you have done that the whole way.',
          'soft',
        ),
        O('But drink it anyway. It is a very nice green.'),
      ],
      [
        ask(
          5,
          LIT,
          'theme',
          'RL.4.2',
          [N('Which sentence best states the theme of what Oz tells the Lion?')],
          [
            o(
              'Courage is going on despite fear, not feeling no fear',
              [
                O(
                  'Exactly. The theme is the idea beneath the story: the Lion has been brave all along, because he went on while frightened.',
                ),
              ],
              true,
            ),
            o('Lions are always brave', [
              O(
                'If that were so, this Lion would not be here asking. The idea is that courage is going on despite fear.',
              ),
            ]),
            o('Green drinks are magic', [
              O(
                'The drink is only green. The idea Oz gives him is the real gift: courage is going on despite fear.',
              ),
            ]),
          ],
          'Stated the theme of a speech: courage is acting despite fear.',
        ),
      ],
      [
        ch('hand', 'Hand the Lion the dish.', [
          N(
            'You hold the dish out. The Lion looks at it, and at you, and drinks it to the bottom.',
          ),
        ]),
        ch('carry', 'Let your Nubbin carry it over.', [
          N(
            'Your Nubbin carries the dish over in its mouth, very carefully, spilling only a little. The Lion drinks the rest.',
          ),
        ]),
      ],
    ),
    sc(
      'a15-15-courage-done',
      [
        L('Oh! I feel… I feel very full of something. Courage, I expect.', 'happy'),
        N(
          'The dish was round, and the bottle was tall and square. You notice that the bottle’s base is a perfect square.',
        ),
      ],
      [
        ask(
          1,
          A,
          'lines of symmetry',
          '4.G.A.3',
          [N('The base of the bottle is a square. How many lines of symmetry does a square have?')],
          [
            o(
              '4',
              [
                N(
                  'Yes. Two run through the middles of opposite sides, and two run corner to corner. Fold a square along any of them and the halves match.',
                ),
              ],
              true,
            ),
            o('2', [
              N(
                'A rectangle that is not a square has two. A square has two more, running corner to corner: four in all.',
              ),
            ]),
            o('1', [
              N(
                'Try folding a square paper: you can fold it four different ways so that the halves match.',
              ),
            ]),
          ],
          'Learned that a square has four lines of symmetry.',
        ),
      ],
    ),
    sc(
      'a15-15-complete',
      [
        N(
          'Your friends go out into the green hall: the Scarecrow thinking hard, the Woodman listening to his chest, the Lion walking very tall.',
        ),
        N('Everyone feels better. You can see it from here.'),
        O('What else could I do? They ask me for things nobody in the world can give.', 'sad'),
        O(
          'So I give them something else, and tell them it is the thing. And it works, mostly. Bran, and sawdust, and green water.',
        ),
        N('You watch them through the doorway, happy, all three, with what they had all along.'),
        N('You wonder whether it matters that it is bran, and you are not sure.'),
        N('Your Nubbin leans on your leg. It is not sure either.'),
        O(
          'Dorothy will be harder. You cannot fill a girl’s head with bran and tell her she is in Kansas.',
          'sad',
        ),
      ],
      [
        think(
          6,
          E,
          'real versus pretend help',
          CASEL_RD,
          [
            N(
              'Your friends feel better, but the brains were bran, the heart was sawdust and the courage was green water. Does it matter that the magic was not real?',
            ),
          ],
          [
            [
              'Yes: they were fooled',
              [
                N(
                  'That’s a fair answer. Being told something that is not true, even kindly, is a kind of trick. And a trick can break.',
                ),
              ],
            ],
            [
              'No: it helped them see what they had',
              [
                N(
                  'That’s a fair answer. Perhaps the bran only gave them permission to notice what they already could do.',
                ),
              ],
            ],
            [
              'Both can be true',
              [
                N(
                  'That’s a fair answer. A kind trick can help and still be a trick. Oz himself is not sure, and neither is your Nubbin.',
                ),
              ],
            ],
          ],
          'Thought about whether it matters that a comforting gift was not real.',
        ),
      ],
    ),
  ],
  [
    gl(
      'bran',
      'The rough outer layer of grain, which is sifted out when flour is made.',
      'a15-15-brains',
    ),
    gl('solder', 'To join pieces of metal using a melted metal that sets hard.', 'a15-15-heart'),
  ],
);

// ================================================================== A15-16 The Balloon
const Q16: EduQuest = quest(
  'a15-16',
  'The Balloon',
  {
    'a15-16-s1': {
      goal: 'Help sew the great green balloon.',
      hint: 'Hold the silk strips straight while Dorothy sews the seams.',
    },
    'a15-16-s2': {
      goal: 'See the balloon off from the Palace yard.',
      hint: 'Stand by the ropes in front of the Palace, and keep an eye on Toto.',
    },
    'a15-16-s3': {
      goal: 'Ask about the way south, now the balloon has gone.',
      hint: 'Go with Dorothy to the Palace, where the Scarecrow now sits, and listen to the Soldier.',
    },
  },
  [
    sc(
      'a15-16-sew',
      [
        N(
          'On the third day Oz sends for Dorothy. He has thought of a way, he says: he came here in a balloon, and he will leave in one.',
        ),
        O(
          'And I will come too. I have had enough of humbugging. A circus would suit me better; at least everyone knows the clown is a clown.',
          'happy',
        ),
        D('Oh! Shall we really go home?'),
        O(
          'We shall make a balloon of silk and fill it with hot air. Hot air I have plenty of. It is the silk we need.',
        ),
        N(
          'So for three days you sit with Dorothy and sew strips of green silk together, while Oz cuts them out.',
        ),
        N('The finished balloon will be more than twenty feet long, which is about six metres.'),
        N(
          'You hold the strips straight while Dorothy sews. Your Nubbin sits in the pile of offcuts like an egg in a green nest.',
        ),
        O('Then a coat of glue inside, to keep the air in. And a big clothes-basket to sit in.'),
      ],
      [
        ask(
          5,
          M,
          'measurement and division',
          '4.MD.A.1',
          [
            N(
              'The balloon is about 6 metres long, and each silk strip is 2 metres long. How many strips laid end to end make 6 m?',
            ),
          ],
          [
            o('3', [N('Yes. 6 ÷ 2 = 3, because 3 × 2 = 6. Three strips, end to end.')], true),
            o('4', [N('Check it: 4 strips would be 4 × 2 = 8 m. Three strips make 6 m.')]),
            o('12', [
              N('That multiplies 6 and 2. Here we ask how many twos fit into six: 6 ÷ 2 = 3.'),
            ]),
          ],
          'Divided a length in metres into equal strips: 6 ÷ 2 = 3.',
        ),
      ],
      [
        ch('stitch', 'Ask Dorothy to show you her stitch.', [
          D(
            'Aunt Em taught me. Small and even, she says. Small and even, and do not pull.',
            'soft',
          ),
        ]),
        ch('basket', 'Test the clothes-basket with your Nubbin.', [
          N(
            'Your Nubbin climbs in, turns round three times, and goes to sleep. The basket seems to work.',
          ),
        ]),
        ch('steer', 'Ask Oz if he has ever steered one.', [
          O(
            'Steered? My dear, nobody steers a balloon. You go where the wind likes. That is how I got here.',
            'think',
          ),
        ]),
      ],
    ),
    sc(
      'a15-16-sew-done',
      [
        N(
          'At last the balloon is finished: more than twenty feet long, green as everything else, and shining with glue.',
        ),
        N('Along its length run the seams, where each strip is stitched to the next.'),
        N(
          'Dorothy runs her hand along them, finds a place where the stitches pull, and sews it again.',
        ),
      ],
      [
        ask(
          1,
          LIT,
          'multiple-meaning words: seam',
          'L.3.4',
          [N('In which sentence does seam mean the join between two pieces of cloth?')],
          [
            o(
              'Dorothy checked every seam for gaps in the silk.',
              [
                N(
                  'Yes. In sewing, a seam is the line where two pieces of cloth are stitched together.',
                ),
              ],
              true,
            ),
            o('A seam of coal ran through the hill.', [
              N(
                'That is another meaning: a long layer of coal or rock. The silk sentence is about stitching.',
              ),
            ]),
          ],
          'Told two meanings of seam apart and chose the sewing one.',
        ),
      ],
    ),
    sc(
      'a15-16-launch',
      [
        N(
          'Word goes round the City that the Great Oz is going up into the clouds. Everybody comes to see.',
        ),
        N(
          'The Woodman has built a fire. Oz holds the bottom of the balloon over it, and the hot air fills it out.',
        ),
        O(
          'Good people! I am off to call on a brother Wizard in the clouds. The Scarecrow will rule while I am gone. Be good to him.',
          'happy',
        ),
        SC('Me? Oh. Well. I do have the brains for it now.', 'happy'),
        N('The balloon swells and tugs against its ropes. Oz climbs into the basket.'),
        O('Dorothy! Quickly! It will not wait!', 'shock'),
        D('I cannot find Toto anywhere!', 'shock'),
        N(
          'Toto has run into the crowd, barking at a kitten. Dorothy runs after him, catches him, and runs back.',
        ),
        N(
          'Oz is holding out his hands to help her in. Then, crack: the ropes give way, and the balloon rises without her.',
        ),
      ],
      [
        ask(
          1,
          S,
          'how a hot-air balloon flies',
          '3-PS2-1',
          [N('Why does the balloon fill out and rise when the air inside is heated?')],
          [
            o(
              'Hot air is lighter than the cooler air around it, so the balloon is pushed up',
              [
                N(
                  'Yes. Heating the air makes it spread out, so a balloonful weighs less than the same amount of cool air outside. The first people to fly this way did so in France, in 1783.',
                ),
              ],
              true,
            ),
            o('The fire pulls the balloon up', [
              N(
                'Fire does not pull. It heats the air, and hot air is lighter than the cooler air outside, so the balloon floats up.',
              ),
            ]),
            o('The silk is magic', [
              N(
                'The silk is only silk. It is the hot air inside, lighter than the cool air outside, that lifts the balloon.',
              ),
            ]),
          ],
          'Learned that heated air is lighter than cool air, so a hot-air balloon rises.',
        ),
      ],
      [
        ch('rope', 'Run after the trailing rope.', [
          N(
            'You run after the trailing rope, and jump, and miss it by a long way. It goes up past the roofs.',
          ),
        ]),
        ch('catch', 'Catch Dorothy before she falls.', [
          N(
            'Dorothy stumbles, and you catch her. Toto is still in her arms, looking very pleased with himself.',
          ),
        ]),
      ],
    ),
    sc(
      'a15-16-launch-done',
      [...BALLOON_GONE, N('Then smaller. Then it is gone.')],
      [
        think(
          3,
          E,
          'a near miss and disappointment',
          CASEL_SM,
          [
            N(
              'Dorothy missed the balloon by a few steps. How do you feel when you narrowly miss something you wanted? What helps?',
            ),
          ],
          [
            [
              'Angry at myself',
              [
                N(
                  'That’s a fair answer. Anger at ourselves is common. It helps to remember that Toto was loose and nobody could have planned for a kitten.',
                ),
              ],
            ],
            [
              'Sad, and then ready to try again',
              [
                N(
                  'That’s a fair answer. Letting yourself be sad first often makes it easier to find a new plan.',
                ),
              ],
            ],
            [
              'I want someone to comfort me',
              [
                N(
                  'That’s a fair answer. Asking for comfort is wise, and a friend beside Dorothy right now would help.',
                ),
              ],
            ],
          ],
          'Thought about the feelings that follow a near miss and what helps.',
        ),
      ],
    ),
    sc(
      'a15-16-south',
      [
        N('Dorothy cries for a long time. Then she wipes her eyes and puts on the Golden Cap.'),
        D('The Monkeys could carry me over the desert. I shall use the second call.'),
        MO(
          'We cannot. Our wings stop where Oz’s power stops. The desert is the end of us as much as it is of you.',
          'sad',
        ),
        N('They fly away. Dorothy sits down on the steps, and Toto licks her face.'),
        GW(
          'You might try Glinda, the Good Witch of the South. She lives right at the edge of the desert. If anyone knows the way over, she will.',
        ),
        N(
          'A desert is a place that gets less than about 250 millimetres of rain in a year, however hot or cold it is.',
        ),
        D('Then I shall go to Glinda.'),
      ],
      [
        ask(
          5,
          SS,
          'what makes a desert',
          GEO,
          [
            N(
              'A desert gets less than about 250 millimetres of rain a year. Which of these places is a desert?',
            ),
          ],
          [
            o(
              'A place with 100 mm of rain a year',
              [
                N(
                  'Yes. Deserts are defined by how little rain they get, not by heat. Parts of Antarctica are deserts too.',
                ),
              ],
              true,
            ),
            o('A place with 900 mm of rain a year', [
              N(
                'That is plenty of rain, enough for woods and fields. A desert gets under about 250 mm a year.',
              ),
            ]),
            o('A place with 1,500 mm of rain a year', [
              N(
                'That is a very wet place, even a rainforest. A desert gets under about 250 mm a year.',
              ),
            ]),
          ],
          'Learned that a desert is defined as a place with under about 250 mm of rain a year.',
        ),
      ],
      [
        ch('come', 'Say you will go with her.', [
          D('Will you? Oh, thank you. I do not think I could start again on my own.', 'soft'),
        ]),
        ch('look', 'Look round at the others.', [
          N('Nobody needs to be asked. The Lion is already standing up.'),
        ]),
      ],
    ),
    sc(
      'a15-16-south-done',
      [
        L(
          'I will come, of course. And when she is home, I shall go and find a forest and live there.',
        ),
        SC(
          'I shall come as far as Glinda’s. Then I shall come back and rule. With my brains.',
          'happy',
        ),
        TW('And I. My heart would not let me stay behind.', 'soft'),
        N(
          'You tot up the calls on the Golden Cap. The Witch used two before Dorothy. Dorothy has used two: the flight, and the one that failed.',
        ),
      ],
      [
        ask(
          3,
          M,
          'add and subtract word problem',
          '3.OA.D.8',
          [
            N(
              'Each owner may call the Monkeys three times, and Dorothy has used two. How many calls has Dorothy left, and how many has the Cap been used for in all, counting the Witch’s two?',
            ),
          ],
          [
            o(
              '1 left, 4 in all',
              [
                N(
                  'Yes. 3 − 2 = 1 call left for Dorothy, and 2 + 2 = 4 calls used by the two owners together.',
                ),
              ],
              true,
            ),
            o('2 left, 5 in all', [
              N(
                'Check it: Dorothy has used two of her three, so 3 − 2 = 1 is left. The total used is 2 + 2 = 4.',
              ),
            ]),
            o('1 left, 5 in all', [
              N('One left is right. But the Witch used two and Dorothy two, so 2 + 2 = 4 in all.'),
            ]),
          ],
          'Solved a two-part problem: 3 − 2 = 1 call left; 2 + 2 = 4 calls used in total.',
        ),
      ],
    ),
    sc(
      'a15-16-complete',
      [
        N(
          'In the morning the Guardian of the Gates unlocks everybody’s spectacles at the gate and puts them back in his box.',
        ),
        N('When he comes to your Nubbin, he stops, and looks at it, and looks at you.'),
        G(
          'Keep that pair. It has got used to them. Some do. Keep yours too, if you like, to remember us by.',
          'think',
        ),
        N(
          'Without the spectacles, the City is plain stone and glass, with a little green paint here and there.',
        ),
        N('It is very pretty, and not very green at all.'),
        N('You put your pair in your pocket. Your Nubbin keeps its own on, and you let it.'),
      ],
      [
        ask(
          4,
          A,
          'warm and cool colours',
          'RL.1.4',
          [N('Artists call colours warm or cool. Which of these is a warm colour?')],
          [
            o(
              'Red',
              [
                N(
                  'Yes. Red, orange and yellow are warm, like fire and sunshine. Blue, green and purple are cool, like water and shade. The City’s plain stone, with a little green paint, now feels cool.',
                ),
              ],
              true,
            ),
            o('Blue', [
              N(
                'Blue is a cool colour, like water and shade. Red, orange and yellow are the warm ones.',
              ),
            ]),
            o('Green', [
              N(
                'Green is cool, like leaves in shade. The warm colours are red, orange and yellow.',
              ),
            ]),
          ],
          'Learned to tell warm colours (red, orange, yellow) from cool ones (blue, green, purple).',
        ),
      ],
    ),
  ],
  [
    gl('seam', 'A line where two pieces of cloth are sewn together.', 'a15-16-sew-done'),
    gl(
      'desert',
      'A dry place with very little rain, under about 250 mm in a year.',
      'a15-16-south',
    ),
  ],
);

// ================================================================== A15-17 The Fighting Trees and the China Country
const Q17: EduQuest = quest(
  'a15-17',
  'The Fighting Trees and the China Country',
  {
    'a15-17-s1': {
      goal: 'Get through the forest of fighting trees.',
      hint: 'Keep behind the Woodman. When a branch grabs, let him chop.',
    },
    'a15-17-s2': {
      goal: 'Climb the white wall, and help the cross milkmaid.',
      hint: 'Climb the ladder the Woodman makes, and go down very carefully on the other side.',
    },
    'a15-17-s3': {
      goal: 'Meet the china Princess, and decide about the lamb.',
      hint: 'Stand still and speak softly. Then choose, with your Nubbin at the fence.',
    },
  },
  [
    sc(
      'a15-17-trees',
      [
        N(
          'South of the City the land is rough. On the second day you come to a thick wood, with no way round it.',
        ),
        N(
          'The Scarecrow goes in first. As he comes under the first tree, its branches bend down and twine round him.',
        ),
        N(
          'In a moment he is lifted off the ground and flung, head over heels, back among the rest of you.',
        ),
        SC('Well! That was very rude. I shall try another tree.', 'shock'),
        N('He tries another tree, and is flung back again.'),
        TW('Let me go first.'),
        N(
          'When a big branch bends down to seize him, the Woodman chops it through. The whole tree shakes its branches, crossly, and lets him by.',
        ),
        L('Only the first row fights, I think. They are guarding the wood.'),
      ],
      [
        ask(
          6,
          S,
          'what tree roots do',
          '2-LS2-1',
          [N('Real trees cannot grab, but their roots do two important jobs. What are they?')],
          [
            o(
              'Hold the tree in the ground and take in water',
              [
                N(
                  'Yes. Roots anchor a tree against wind and soak up water and minerals from the soil. Without them a tree could not stand or drink.',
                ),
              ],
              true,
            ),
            o('Make leaves and flowers', [
              N(
                'Leaves and flowers grow higher up. Roots anchor the tree and take in water and minerals.',
              ),
            ]),
            o('Catch passing travellers', [
              N('Not in real life! Roots anchor the tree and take in water and minerals.'),
            ]),
          ],
          'Learned the two jobs of roots: anchoring the tree and taking in water.',
        ),
      ],
      [
        ch('behind', 'Keep right behind the Woodman.', [
          N(
            'You keep so close behind the Woodman that a branch reaching for you finds his axe instead, and thinks better of it.',
          ),
        ]),
        ch('coat', 'Tuck your Nubbin inside your coat.', [
          N(
            'You button your Nubbin into your coat. A branch pats you all over, finds nothing to grab, and gives up.',
          ),
        ]),
      ],
    ),
    sc(
      'a15-17-trees-done',
      [
        N(
          'Behind the first row, the trees are only trees. Everyone gets through, the Scarecrow last, very ruffled.',
        ),
        N(
          'You are ruffled too, and so is your Nubbin, whose fur sticks up as if it had touched a balloon.',
        ),
        N(
          'Behind you the first row shakes out its branches and settles down, looking very pleased with itself.',
        ),
      ],
      [
        ask(
          1,
          LIT,
          'multiple-meaning words: ruffled',
          'L.3.4',
          [N('Ruffled can mean untidy, or upset. Which fits the Scarecrow here?')],
          [
            o(
              'Both: his straw is untidy and he is cross',
              [
                N(
                  'Yes. Authors love a word that does two jobs. His straw sticks out and his feelings are rumpled.',
                ),
              ],
              true,
            ),
            o('Neither: he is calm', [
              N('Look at him: straw sticking out and a cross face. He is untidy and upset.'),
            ]),
            o('Only untidy', [
              N(
                'Untidy is right, but he has been flung about by trees and is not happy. Upset is part of it too.',
              ),
            ]),
          ],
          'Understood that ruffled can mean untidy and upset, and saw it do both jobs.',
        ),
      ],
    ),
    sc(
      'a15-17-wall',
      [
        N(
          'On the far side of the wood is a high wall, smooth and white, like the side of a dinner plate.',
        ),
        N('One section of it is twelve metres long and three metres high.'),
        N(
          'The Woodman makes a ladder. The Scarecrow climbs it first, looks over, and says nothing at all for a moment, which is not like him.',
        ),
        N(
          'On the other side the ground is white and smooth and shining, like the bottom of a great platter. There are little houses, all made of china and brightly painted.',
        ),
        N(
          'Nearest the wall, a china milkmaid is milking a china cow. As you jump down, the cow gives a kick.',
        ),
        N(
          'Over goes the stool, and over goes the pail, and over goes the milkmaid herself, with a clatter. The cow’s leg has snapped clean off.',
        ),
        MM(
          'Look what you have done! Her leg is off! Now it is the mender’s for her, and glue, and a week of standing still!',
          'angry',
        ),
        D('I am very sorry. Please forgive us.', 'sad'),
      ],
      [
        ask(
          1,
          M,
          'area of a rectangle',
          '3.MD.C.7',
          [N('One section of the wall is 12 m long and 3 m high. What is its area?')],
          [
            o(
              '36 square metres',
              [
                N(
                  'Yes. Area is length × height: 12 × 3 = 36 square metres. That is 36 squares, each one metre by one metre.',
                ),
              ],
              true,
            ),
            o('15 square metres', [
              N('That adds 12 and 3. Area multiplies length by height: 12 × 3 = 36.'),
            ]),
            o('30 square metres', [
              N('Close. Try it in steps: 10 × 3 = 30, then 2 × 3 = 6, and together that is 36.'),
            ]),
          ],
          'Found the area of a rectangle by multiplying: 12 × 3 = 36 m².',
        ),
      ],
      [
        ch('leg', 'Pick up the cow’s leg and hand it back.', [
          MM(
            'Well. Thank you. You might have broken it worse, I suppose, being so enormous.',
            'think',
          ),
        ]),
        ch('small', 'Say sorry too, as small as you can.', [
          N(
            'You crouch down very small and say you are sorry. The milkmaid sniffs, and is a little less cross.',
          ),
        ]),
      ],
    ),
    sc(
      'a15-17-wall-done',
      [
        N(
          'The milkmaid leads the cow away limping on three legs, carrying the fourth, and looks back over her shoulder at you all.',
        ),
        D('We will have to walk very carefully. Everything here breaks.', 'think'),
        N(
          'Fine plates and cups are made from clay, baked hard. The people of China first made them so finely, more than a thousand years ago.',
        ),
      ],
      [
        ask(
          2,
          SS,
          'where the word china comes from',
          HIS,
          [N('In English, fine plates and cups are called china. Why?')],
          [
            o(
              'Porcelain was first made in China, long ago',
              [
                N(
                  'Yes. Potters in China perfected porcelain, and fine dishes travelled the world under the name of their country.',
                ),
              ],
              true,
            ),
            o('Because they ring like a chime when tapped', [
              N(
                'Fine china does ring when you tap it, but that is not the reason. The name comes from China, where porcelain was first made.',
              ),
            ]),
            o('Because they are white as chalk', [
              N(
                'They are often white, but the name comes from the country, China, where porcelain was first made.',
              ),
            ]),
          ],
          'Learned that china dishes are named for China, where porcelain was first made.',
        ),
      ],
    ),
    sc(
      'a15-17-lamb',
      [
        N(
          'A little further on you meet a beautiful china Princess in a dress of many colours. She stops, and then she runs.',
        ),
        D('Wait! Please! We will not hurt you!'),
        PR(
          'Oh! Please do not run at me! If I fall I might break, and it is not at all nice, being mended.',
          'shock',
        ),
        D(
          'You are so lovely. Would you come home with me? Aunt Em has not a single pretty thing in the house.',
        ),
        PR('Oh, no. Here we walk about, and talk, and visit, and do as we like.'),
        PR(
          'Out there our joints would go hard. We would stand on a shelf being admired, and never walk again. Pretty is all we would be.',
          'sad',
        ),
        D('Then I will not ask again. I would hate you to be unhappy.', 'soft'),
        N(
          'Beside the path is a little field with a china fence round it. China lambs, no bigger than a thimble, are grazing on china grass.',
        ),
        N(
          'One of them comes to the fence. Your Nubbin goes to the fence too, and they touch noses, very gently.',
        ),
        N(
          'Your Nubbin looks up at you, and then at your pocket, which is just the right size, and then at the lamb.',
        ),
        N('It has never wanted anything this much. You can tell.'),
      ],
      [
        ask(
          5,
          S,
          'baking clay: changes that cannot be reversed',
          '2-PS1-4',
          [
            N(
              'China is made by baking soft clay in a very hot oven called a kiln, until it goes hard. Can baked china be turned back into soft clay?',
            ),
          ],
          [
            o(
              'No, baking is a change that cannot be undone',
              [
                N(
                  'Yes. Some changes, like melting ice, can be reversed. Baking clay cannot. Once it has set hard, it stays hard.',
                ),
              ],
              true,
            ),
            o('Yes, just add water', [
              N(
                'Unbaked clay goes soft again with water, but baked china does not. The change in the oven is permanent.',
              ),
            ]),
            o('Yes, if you wait long enough', [
              N(
                'Waiting does not help. The change in the kiln is permanent: baked clay does not go soft again.',
              ),
            ]),
          ],
          'Learned that baking clay is a change that cannot be reversed.',
        ),
        think(
          10,
          E,
          'safe versus well',
          CASEL_RD,
          [
            N(
              'Is keeping something safe the same as keeping it well? Is it kind to keep what you love safe if it can no longer be itself?',
            ),
          ],
          [
            [
              'Safe is not the same as well',
              [
                N(
                  'That’s a fair answer. A thing can be perfectly safe and still be unhappy, like a bird in a cage with plenty of seed.',
                ),
              ],
            ],
            [
              'Safe comes first',
              [
                N(
                  'That’s a fair answer. Staying alive matters most of all. But notice that the Princess says pretty is all they would be.',
                ),
              ],
            ],
            [
              'It depends on the thing and on what it wants',
              [
                N(
                  'That’s a fair answer. The wisest answer starts by asking what the lamb, and the Nubbin, really want.',
                ),
              ],
            ],
          ],
          'Thought about whether keeping something safe is the same as keeping it well.',
        ),
      ],
      [
        ch(
          'pocket',
          'Slip the lamb into your pocket, to keep it safe.',
          [
            N(
              'You lift the lamb over the fence. It is warm and light, and its legs kick a little.',
            ),
            N(
              'You slip it into your pocket, to keep it safe. Your Nubbin keeps one paw on the outside of the pocket all the way.',
            ),
          ],
          { 'a15-lamb': 'pocketed' },
        ),
        ch(
          'field',
          'Put it back in its field.',
          [
            N(
              'You lift your Nubbin gently away from the fence. The lamb bleats once, very small, like a spoon on a cup.',
            ),
            N(
              'Your Nubbin looks back three times. Then it stops looking back, and walks closer to you.',
            ),
          ],
          { 'a15-lamb': 'returned' },
        ),
      ],
    ),
    sc(
      'a15-17-complete',
      [
        N(
          'Crossing the china country, the Lion’s tail swings round by accident and knocks over a little china church.',
        ),
        L('Oh dear. Oh dear, oh dear. I will go the long way round. On tiptoe.', 'shock'),
        N('China people come running with glue pots. They seem quite used to it.'),
        N(
          'At the far side is another wall, not so high. You climb it, drop into tall grass, and the china country is behind you.',
        ),
        D('I am glad we saw it. I am glad we did not take anything away.', 'soft'),
        N(
          'A china tile on the wall was a plain rectangle, painted with flowers. You wonder where you could fold it so the halves match.',
        ),
      ],
      [
        ask(
          5,
          A,
          'lines of symmetry in a rectangle',
          '4.G.A.3',
          [N('A plain rectangle that is not a square has how many lines of symmetry?')],
          [
            o(
              '2',
              [
                N(
                  'Yes. One down the middle and one across the middle. A square has four, but a rectangle’s diagonals do not work.',
                ),
              ],
              true,
            ),
            o('4', [
              N('Four is for a square. A rectangle that is longer than it is wide has just two.'),
            ]),
            o('1', [
              N(
                'Try folding paper: you can fold a rectangle in half two different ways so the halves match.',
              ),
            ]),
          ],
          'Learned that a non-square rectangle has two lines of symmetry.',
        ),
      ],
    ),
  ],
  [
    gl('ruffled', 'Untidy and rumpled, or upset and annoyed.', 'a15-17-trees-done'),
    gl('kiln', 'A very hot oven used to bake clay until it goes hard.', 'a15-17-lamb'),
  ],
);

// ================================================================== A15-18 The King of Beasts
const Q18: EduQuest = quest(
  'a15-18',
  'The King of Beasts',
  {
    'a15-18-s1': {
      goal: 'Go with the Lion into the great old forest.',
      hint: 'Walk among the old trees until you find the gathering of animals.',
    },
    'a15-18-s2': {
      goal: 'Wait at the edge of the clearing while the Lion goes alone.',
      hint: 'Stay with Dorothy at the clearing’s edge, and keep your Nubbin with you.',
    },
  },
  [
    sc(
      'a15-18-council',
      [
        N(
          'Past the tall grass is a forest of great old trees, the biggest you have ever seen. It is dark and quiet, and the ground is soft with leaves.',
        ),
        L('What a forest. I could live in a forest like this for ever.', 'soft'),
        N(
          'In a big clearing there are hundreds of animals: tigers and elephants, bears and foxes, all talking at once.',
        ),
        N('When they see the Lion, they all go quiet. A great tiger comes up and bows.'),
        TG('King of Beasts! You have come. You have come at last. We need you badly.', 'happy'),
        TG(
          'A monster. A spider bigger than an elephant, with legs like tree trunks, eight of them.',
        ),
        TG(
          'It creeps through the forest and hunts us, one by one. None of us is safe. We were talking about what to do.',
          'sad',
        ),
        N(
          'Your Nubbin is pressed against the back of your legs again, the way it was on the road the day you met the Lion.',
        ),
      ],
      [
        ask(
          5,
          S,
          'spiders have eight legs; insects have six',
          '4-LS1-1',
          [
            N(
              'The Tiger says the spider has eight legs. Which of these animals also has eight legs?',
            ),
          ],
          [
            o(
              'Another spider',
              [
                N(
                  'Yes. All spiders have eight legs and two body parts. Insects, like beetles, have six legs and three body parts, so a spider is not an insect.',
                ),
              ],
              true,
            ),
            o('A beetle', [N('A beetle is an insect, with six legs. Spiders have eight.')]),
            o('A mouse', [N('A mouse has four legs. Spiders have eight.')]),
          ],
          'Learned that spiders have eight legs and are not insects.',
        ),
      ],
      [
        ch('lion', 'Look at the Lion.', [
          N(
            'The Lion is very still, with his mane up. You cannot tell whether that is courage or the other thing.',
          ),
        ]),
        ch('pick', 'Pick up your Nubbin.', [
          N('You pick up your Nubbin. Its heart is going fast, and so is yours.'),
        ]),
      ],
    ),
    sc(
      'a15-18-council-done',
      [
        L('If I deal with this spider, will you have me for your King?', 'think'),
        TG('Gladly. All of us.'),
        L('Then wait here.'),
        N(
          'You wonder how the animals chose a King. Nobody voted, and nobody seems to have been asked.',
        ),
      ],
      [
        ask(
          3,
          SS,
          'fair ways to choose a leader',
          CIV,
          [N('Which way of choosing a leader is the fairest?')],
          [
            o(
              'Everyone gets a vote',
              [
                N(
                  'Yes. When everyone gets an equal say, the leader answers to the group. That is what voting is for.',
                ),
              ],
              true,
            ),
            o('The biggest animal decides', [
              N(
                'Size is a poor reason. The biggest animal might be the least kind. A fair choice gives everyone a say.',
              ),
            ]),
            o('The first one to arrive', [
              N('Being first is luck, not fairness. A fair way gives everyone an equal say.'),
            ]),
          ],
          'Talked about fair ways to choose a leader.',
        ),
      ],
    ),
    sc(
      'a15-18-wait',
      [
        L('Look after my friends for me. I am going now, before I think about it.', 'think'),
        N('He goes off into the trees alone. Nobody follows him, because he asked them not to.'),
        N(
          'Your Nubbin starts after him. It stops at the edge of the trees, comes back to you, and sits down.',
        ),
        D('He was so frightened of the Kalidahs. He was nearly frightened of a mouse.', 'sad'),
        SC('He drank his courage. I saw it. It was green.', 'think'),
        TW(
          'I do not think it was ever in the dish. I think it was in him all along. My heart tells me so.',
          'soft',
        ),
        N('You wait. The forest is very quiet: the kind of quiet that is listening.'),
        N('Nobody talks. Even the Scarecrow does not think out loud.'),
      ],
      [
        think(
          7,
          E,
          'respecting a friend’s wish to face something alone',
          CASEL_RS,
          [
            N(
              'The Lion asked everyone to stay behind, and went alone. When is it right to let a friend face something alone, and when should you go too?',
            ),
          ],
          [
            [
              'Respect their wish, but wait close by',
              [
                TW(
                  'That’s a fair answer. It is the one we chose: he asked, so we waited, and we stayed close.',
                  'soft',
                ),
              ],
            ],
            [
              'Go with them anyway',
              [
                TW(
                  'That’s a fair answer. A friend beside you can be a comfort. But some tasks only the one person can do, and they may need to do it alone.',
                  'soft',
                ),
              ],
            ],
            [
              'It depends how dangerous it is',
              [
                TW(
                  'That’s a fair answer, and a careful one. The bigger the danger, the more you must weigh their wish against their safety.',
                  'soft',
                ),
              ],
            ],
          ],
          'Thought about when to respect a friend’s wish to go alone and when to go along.',
        ),
      ],
      [
        ch('sit', 'Sit down and wait, with your Nubbin in your lap.', [
          N(
            'You sit, and your Nubbin climbs into your lap. You wait the way you would wait for anyone.',
          ),
        ]),
        ch('stand', 'Stand at the edge and watch the trees.', [
          N(
            'You stand and watch the dark between the trees. Once, far off, there is a sound, and then nothing.',
          ),
        ]),
      ],
    ),
    sc(
      'a15-18-wait-done',
      [
        N(
          'At last, in the grey of the morning, the Lion comes back through the trees. He walks slowly, and very straight.',
        ),
        L('It is done. It will not catch anyone any more. You can stop being afraid.'),
        N('He does not say how, and nobody asks him.'),
        N(
          'You worked it out while you waited: he left at nine in the evening, and it is now six in the morning.',
        ),
      ],
      [
        ask(
          3,
          M,
          'time intervals',
          '3.MD.A.1',
          [
            N(
              'The Lion left at 9 o’clock in the evening and came back at 6 the next morning. How long was he away?',
            ),
          ],
          [
            o(
              '9 hours',
              [
                N(
                  'Yes. From 9 at night to midnight is 3 hours, and midnight to 6 is 6 more, so 9 hours in all.',
                ),
              ],
              true,
            ),
            o('3 hours', [
              N(
                'That is only as far as midnight. Add the 6 hours from midnight to 6 in the morning: 3 + 6 = 9.',
              ),
            ]),
            o('15 hours', [
              N('That is too long. Split it at midnight: 3 hours, then 6 more, makes 9.'),
            ]),
          ],
          'Worked out a time interval across midnight: 9 pm to 6 am is 9 hours.',
        ),
      ],
    ),
    sc(
      'a15-18-complete',
      [
        N('All the animals bow down to the Lion as their King.'),
        L('I will be back to look after you, once Dorothy is safe on her way home. Not before.'),
        TG('We will wait, Your Majesty.'),
        N(
          'The Lion comes back to you. He lies down and puts his great head on the ground, so that your Nubbin can reach his nose.',
        ),
        L('I was afraid the whole time. The whole time. My knees knocked.', 'soft'),
        Y('I know. You went anyway.'),
        L('Yes. I did, did I not?', 'soft'),
        N('Your Nubbin pats his nose, very gently, the way it did on the road where you met.'),
      ],
      [
        ask(
          6,
          LIT,
          'theme',
          'RL.4.2',
          [N('Which sentence best states the theme of the Lion’s whole journey?')],
          [
            o(
              'Courage is acting while you are afraid',
              [
                L(
                  'Exactly. The Lion was afraid at the ditch, in the river, and here, and he acted each time. That is the idea running under the whole story.',
                ),
              ],
              true,
            ),
            o('Lions are stronger than spiders', [
              L(
                'That might be true in this story, but it is a detail. The deeper idea is that courage means acting while afraid.',
              ),
            ]),
            o('Forests are dark', [
              L('So they are, but it is only the setting. The theme is about courage.'),
            ]),
          ],
          'Stated the theme of a character’s journey: courage is acting despite fear.',
        ),
      ],
    ),
  ],
  [
    gl(
      'monster',
      'A huge, frightening creature, usually one that only exists in stories.',
      'a15-18-council',
    ),
    gl(
      'King of Beasts',
      'A title for the lion, which people long ago called the king of all animals.',
      'a15-18-council',
    ),
  ],
);

// ================================================================== A15-19 The Hammer-Heads
const Q19: EduQuest = quest(
  'a15-19',
  'The Hammer-Heads',
  {
    'a15-19-s1': {
      goal: 'Climb the rocky hill towards the south.',
      hint: 'Follow the Scarecrow up the rocks, and stop when a voice tells you to.',
    },
    'a15-19-s2': {
      goal: 'Read the charm with Dorothy for her third and last call.',
      hint: 'Stand by Dorothy and read the words inside the Cap with her.',
    },
  },
  [
    sc(
      'a15-19-hill',
      [
        N(
          'Past the forest a steep hill rises, covered from top to bottom with great pieces of rock.',
        ),
        SC('Rocks. A great many rocks. Well, up we go.'),
        N('He leads the way. You are halfway up the first rocks when a rough voice calls out.'),
        HH('Stop there! Our hill! Nobody goes over our hill!', 'angry'),
        N(
          'From behind a rock comes a very odd man with no arms at all, and a big flat head on a neck that folds up like a concertina.',
        ),
        SC('Terribly sorry, but we have to get over. We are on our way south, to the Quadlings.'),
        N(
          'Quick as lightning, the man’s head shoots forward on its stretching neck, and the flat top of it hits the Scarecrow in the middle.',
        ),
        N('The Scarecrow goes tumbling, head over heels, all the way down the hill.'),
        N(
          'From behind every rock a hundred more Hammer-Heads pop up, laughing a hard, rough laugh. They are a fairy-tale people, and very proud of their hill.',
        ),
      ],
      [
        ask(
          7,
          S,
          'forces and motion on a slope',
          '3-PS2-1',
          [
            N(
              'The Scarecrow rolled all the way down the hill. Which hill would send a ball rolling faster: a steep one, or a gentle one?',
            ),
          ],
          [
            o(
              'A steep one',
              [
                N(
                  'Yes. Gravity pulls things down, and on a steeper slope more of that pull goes into rolling, so things speed up faster.',
                ),
              ],
              true,
            ),
            o('A gentle one', [
              N(
                'A gentle slope slows things down, since less of gravity’s pull goes into the roll. The steeper the hill, the faster the ball.',
              ),
            ]),
            o('They are the same', [
              N(
                'Try it with a ball and a book propped at two angles. The steeper slope gives a faster roll.',
              ),
            ]),
          ],
          'Learned that a ball rolls faster down a steeper slope, because gravity pulls it down.',
        ),
      ],
      [
        ch('pick', 'Run down and pick up the Scarecrow.', [
          N('You find him at the bottom, upside down in a bush.'),
          SC('I have brains now, and I can tell you I did not see that coming.', 'shock'),
        ]),
        ch('duck', 'Duck behind a rock with your Nubbin.', [
          N(
            'You duck behind a rock. A head on a long neck comes round the side, looks at your Nubbin, and goes back again.',
          ),
        ]),
      ],
    ),
    sc(
      'a15-19-hill-done',
      [
        N(
          'The Lion, very brave now, roars and dashes up the hill. A head shoots out, and down he rolls too, like a big cannon-ball.',
        ),
        L('Ow. Ow. Courage is all very well, but it does not help your nose.', 'sad'),
        N('His nose is sore, and swelling a little. You sit him down, and he lets you look at it.'),
      ],
      [
        ask(
          2,
          H,
          'first aid for a knock to the head or face',
          CASEL_RD,
          [
            N(
              'The Lion has taken a knock on the nose. What is the right thing to do after a knock on the head or face?',
            ),
          ],
          [
            o(
              'Rest, hold a wrapped cool pack on it, and tell a grown-up',
              [
                N(
                  'Yes. Rest and a cool pack help the swelling, and a grown-up should always know about a knock to the head or face, in case it needs checking.',
                ),
              ],
              true,
            ),
            o('Carry on playing as if nothing happened', [
              N('Carrying on could make things worse. Rest, a cool pack, and tell a grown-up.'),
            ]),
            o('Rub it hard', [
              N('Rubbing can hurt more. A wrapped cool pack, rest, and a grown-up are better.'),
            ]),
          ],
          'Learned what to do after a knock to the head or face: rest, a wrapped cool pack, tell a grown-up.',
        ),
      ],
    ),
    sc(
      'a15-19-call',
      [
        D('It is no good fighting people who shoot their heads out. What shall we do?'),
        TW('Call the Winged Monkeys. You have one call left.', 'think'),
        D('It is the last one. After this, the Cap will not do anything for me ever again.', 'sad'),
        SC('Then use it on something worth it. This seems worth it. My middle hurts.'),
        N(
          'Dorothy puts on the Golden Cap and says the words. You read them out with her, very clearly, since it is the last time.',
        ),
        N(
          'You tap the beat of the words as you read them, one-two-three-four, the way a band counts in a tune.',
        ),
        N('The Monkeys come down as fast as ever, the whole band, and line up in front of her.'),
        MO('Third call. The last. What is it to be?', 'think'),
        D('Carry us over the hill to the country of the Quadlings.'),
        MO('Up you come, then.'),
      ],
      [
        ask(
          5,
          MU,
          'beats in a bar',
          'RL.2.4',
          [
            N(
              'Music is counted in groups of beats called bars. In 4/4 time, how many beats are in each bar?',
            ),
          ],
          [
            o(
              'Four',
              [
                N(
                  'Yes. The top number says how many beats are in a bar, so 4/4 means four. A waltz is 3/4, so it has three.',
                ),
              ],
              true,
            ),
            o('Three', [
              N('Three beats is a waltz, written 3/4. In 4/4 there are four beats in each bar.'),
            ]),
            o('Two', [N('Two beats a bar is a march, often written 2/4. In 4/4 there are four.')]),
          ],
          'Learned that 4/4 time has four beats in each bar.',
        ),
      ],
      [
        ch('thank', 'Thank the Monkey King.', [
          MO(
            'Thank us? Hm. Nobody does that. The Cap does not say anything about thanks.',
            'think',
          ),
        ]),
        ch('watch', 'Watch the Monkey King as he lifts you.', [
          N(
            'He lifts you as gently as before. His wings beat hard and slow, and he looks, you think, very tired.',
          ),
        ]),
      ],
    ),
    sc(
      'a15-19-call-done',
      [
        N(
          'The Monkeys carry you all over the hill. The Hammer-Heads shoot their heads high in the air, and cannot reach.',
        ),
        N(
          'Your Nubbin looks down at them, and they look up at your Nubbin, and that is the end of the Hammer-Heads.',
        ),
        N(
          'The Monkey King flew all this way for a Cap that never once said thank you. His wings are slow, and his arms hang low.',
        ),
      ],
      [
        think(
          2,
          E,
          'thanking someone who is made to help',
          CASEL_SO,
          [
            N(
              'The Monkeys help only because the Cap makes them. Should we thank someone who is made to help us?',
            ),
          ],
          [
            [
              'Yes: thanks always matter',
              [
                MO(
                  'That’s a fair answer. Thanks cost nothing, and mean the most to those who are rarely given them.',
                  'soft',
                ),
              ],
            ],
            [
              'No: they have no choice',
              [
                MO(
                  'That’s a fair answer. Yet being thanked reminds a person that they are seen as a person, not as a tool.',
                  'soft',
                ),
              ],
            ],
            [
              'Yes, and also ask what they want',
              [
                MO(
                  'That’s a fair answer, and a wise one. Thanks is a start. Asking is the next step.',
                  'soft',
                ),
              ],
            ],
          ],
          'Thought about whether to thank someone who has no choice but to help.',
        ),
      ],
    ),
    sc(
      'a15-19-complete',
      [
        N(
          'The Monkeys set you down in the country of the Quadlings, and fly away. The King looks back once from the sky.',
        ),
        N('Everything here is red: the fences, the houses, the bridges, the Quadlings’ clothes.'),
        N(
          'The Quadlings are small and cheerful. They give Dorothy something to eat, and she thanks them.',
        ),
        D('Please, which way is Glinda’s castle?'),
        N('A Quadling points. Far down the road a castle is shining in the sun.'),
      ],
      [
        ask(
          4,
          SS,
          'the lands of Oz and the compass',
          GEO,
          [
            N(
              'The Munchkins live in the east and the Winkies in the west. Where do the red-clad Quadlings live?',
            ),
          ],
          [
            o(
              'In the south',
              [
                N(
                  'Yes. East is blue, west is yellow, south is red, with the Emerald City in the middle. A map of Oz is a colour map and a compass in one.',
                ),
              ],
              true,
            ),
            o('In the north', [
              N(
                'You have come south from the Emerald City, and here is red. The Quadlings live in the south.',
              ),
            ]),
            o('In the middle', [
              N('The middle is the green Emerald City. The Quadlings are in the south.'),
            ]),
          ],
          'Matched a colour-coded land to its compass direction: the Quadlings live in the south.',
        ),
      ],
    ),
  ],
  [
    gl(
      'Quadling',
      'One of the small, cheerful people of the southern land of Oz, who wear red.',
      'a15-19-complete',
    ),
    gl('cannon-ball', 'A heavy iron ball once fired from a cannon.', 'a15-19-hill-done'),
  ],
);

// ================================================================== A15-20 Glinda
const Q20: EduQuest = quest(
  'a15-20',
  'Glinda',
  {
    'a15-20-s1': {
      goal: 'Go before Glinda, the Good Witch of the South.',
      hint: 'Walk up to Glinda’s throne with Dorothy and the others, and listen.',
    },
    'a15-20-s2': {
      goal: 'Hear how Glinda will spend the Cap’s calls, and say your goodbyes.',
      hint: 'Stand with your friends while Glinda tells each of them where they will go.',
    },
    'a15-20-s3': {
      goal: 'Say goodbye to Dorothy.',
      hint: 'Stay by Dorothy and Toto until she is ready to go.',
    },
  },
  [
    sc(
      'a15-20-glinda',
      [
        N(
          'At the castle gate stand three girls in handsome red uniforms. They lead you all into a great room.',
        ),
        N(
          'Glinda sits on a red throne. She is beautiful and young-looking, with rich red hair, and her eyes are blue and kind.',
        ),
        GL('Well, my dear. What is it you need?', 'soft'),
        D('I want to go home to Kansas. Aunt Em will be sure I am lost for good by now.', 'sad'),
        GL(
          'There is a way, my dear, and I shall tell you. But I shall want the Golden Cap in return.',
          'soft',
        ),
        D('Gladly. It is no use to me now. I have used all three calls.'),
        GL(
          'The silver shoes will carry you over the desert. You could have gone home the day you came, if you had only known what they do.',
        ),
        D('The very first day?', 'shock'),
        SC(
          'But then I would never have got my brains! I would have spent my whole life up a pole in a cornfield.',
          'shock',
        ),
        TW('And I would still be standing in that clearing with my axe in the air.'),
        L('And I would still be roaring at little dogs, and crying about it afterwards.'),
        N(
          'Dorothy looks down at the silver shoes for a long time. They have been on her feet the whole way.',
        ),
      ],
      [
        notice(
          6,
          S,
          'properties of silver',
          '2-PS1-1',
          [
            N('Real silver is a shiny metal. It carries electricity better than any other metal.'),
            N(
              'It also tarnishes: left in the air, it slowly goes dark, because it reacts with sulphur gases there. That is why people polish it.',
            ),
          ],
          'Learned that silver is a shiny metal that is the best conductor of electricity and tarnishes in air.',
        ),
        think(
          11,
          E,
          'the journey versus the destination',
          CASEL_RD,
          [
            N(
              'Dorothy could have gone home on the first day, but she would have missed her friends and everything she learned. Is the journey worth more than the arrival?',
            ),
          ],
          [
            [
              'Yes: the journey made her who she is',
              [
                GL(
                  'That’s a fair answer. What we become on the road is often worth more than the place we reach.',
                  'soft',
                ),
              ],
            ],
            [
              'No: home matters most, and it was a long detour',
              [
                GL(
                  'That’s a fair answer. Dorothy herself longs for home above all. A detour can be hard, and lonely too.',
                  'soft',
                ),
              ],
            ],
            [
              'Both together',
              [
                GL(
                  'That’s a fair answer. She needed to go on the journey to value home, and the friends to enjoy it.',
                  'soft',
                ),
              ],
            ],
          ],
          'Thought about whether a journey can be worth more than its destination.',
        ),
      ],
      [
        ch('shoes', 'Look at the shoes.', [
          N('They are dusty from the road and scuffed at the toes. They do not look like much.'),
        ]),
        ch('mind', 'Ask Dorothy if she minds.', [
          D(
            'No. I am glad I did not know. I would have gone straight home, and none of them would have anything.',
            'soft',
          ),
        ]),
      ],
    ),
    sc(
      'a15-20-glinda-done',
      [
        GL(
          'Knock the heels together three times and tell them where you want to go. They will take you there in three steps.',
        ),
        N('Three steps, over a desert. You wonder how far each step must be.'),
        N('Dorothy looks at her heels as if she were meeting them for the first time.'),
      ],
      [
        ask(
          1,
          M,
          'division word problem',
          '3.OA.A.3',
          [
            N(
              'Suppose the desert is 600 km wide and the shoes cross it in three equal steps. How long is each step?',
            ),
          ],
          [
            o(
              '200 km',
              [N('Yes. 600 ÷ 3 = 200, because 3 × 200 = 600. A very long stride.')],
              true,
            ),
            o('300 km', [
              N('That would be two steps: 2 × 300 = 600. Three equal steps: 600 ÷ 3 = 200 km.'),
            ]),
            o('180 km', [
              N(
                'Check by multiplying: 3 × 180 = 540, which is short. 3 × 200 = 600, so each step is 200 km.',
              ),
            ]),
          ],
          'Divided a distance into three equal steps: 600 ÷ 3 = 200 km.',
        ),
      ],
    ),
    sc(
      'a15-20-goodbye',
      [
        GL('Now. The Golden Cap, and its three calls. Let me see.', 'think'),
        GL(
          'Scarecrow: the Monkeys will carry you back to the Emerald City, to rule. The people will be lucky in you.',
        ),
        SC('Thank you. I have just thought of eleven new laws. I shall begin with those.', 'happy'),
        GL(
          'Woodman: they will carry you to the land of the Winkies, who want you for their ruler.',
        ),
        TW('I shall rule them kindly. I have the heart for it now.', 'soft'),
        GL(
          'Lion: they will carry you over the Hammer-Heads to your forest, to be King of the Beasts.',
        ),
        L('Thank you. I should not care to meet the Hammer-Heads again, even as a King.'),
        GL(
          'And then I shall give the Cap to the King of the Monkeys, so that he and his band are free for ever.',
          'soft',
        ),
        N('Dorothy hugs each of them in turn, and cries, and kisses the Lion on his great nose.'),
      ],
      [
        ask(
          2,
          SS,
          'fairness and rules',
          CIV,
          [N('The Scarecrow has thought of eleven new laws. What makes a law fair?')],
          [
            o(
              'It applies to everyone, including the ruler',
              [
                N(
                  'Yes. A law that rulers can ignore is not fair. Fairness means the same rules for everybody.',
                ),
              ],
              true,
            ),
            o('It only applies to people the ruler dislikes', [
              N('That is the opposite of fair. A fair law is one that applies to everyone alike.'),
            ]),
            o('It never changes, whatever happens', [
              N(
                'Good laws can be changed when they turn out to be wrong. What makes them fair is that they apply to everyone alike.',
              ),
            ]),
          ],
          'Talked about what makes a law fair: it applies to everyone alike.',
        ),
      ],
      [
        ch('oil', 'Oil the Woodman’s jaw. He is crying.', [
          N(
            'The Woodman is crying, of course. You oil his jaw one last time, while the Scarecrow holds his hat, as he did once before.',
          ),
          TW(
            'Keep the can. I mean it. You have been the best oil-can-carrier in all of Oz.',
            'soft',
          ),
        ]),
        ch('scarecrow', 'Shake the Scarecrow’s hand.', [
          SC(
            'If you ever need a thought, come to the Emerald City. I have plenty now. I can spare one.',
            'happy',
          ),
        ]),
        ch('lion', 'Rest your hand on the Lion’s mane.', [
          L(
            'Goodbye, Keeper. Goodbye, little one. You sat by me first. I shall not forget it.',
            'soft',
          ),
        ]),
      ],
    ),
    sc(
      'a15-20-goodbye-done',
      [
        N('Glinda’s girls bring you a present: a pair of silver shoes, just your size, shining.'),
        N('You put them on, and knock your heels together three times.'),
        N('Nothing happens at all.'),
        GL('They are only shoes, dear. Most shoes are.', 'happy'),
      ],
      [
        ask(
          3,
          LIT,
          'humour: understatement',
          'L.4.5',
          [N('Why is Glinda’s remark funny?')],
          [
            o(
              'She states the obvious in a calm, dry way',
              [
                GL(
                  'Exactly. Saying something plainly obvious, with a straight face, is called understatement. It is a favourite trick of dry humour.',
                ),
              ],
              true,
            ),
            o('She says something that is not true', [
              GL('Quite the opposite. What she says is perfectly true. That is the joke.'),
            ]),
            o('She shouts it', [
              GL('She is perfectly calm. The humour is in how plain and dry she is.'),
            ]),
          ],
          'Recognised understatement as the source of a dry joke.',
        ),
      ],
    ),
    sc(
      'a15-20-farewell',
      [
        N(
          'Dorothy turns to you last. Toto is in her arms, and your Nubbin is sitting on your feet.',
        ),
        N(
          'She looks at you as if she is fixing you in her memory, the way you fix a house you are leaving.',
        ),
        N('Glinda’s girls have gone quiet. Even Toto keeps still.'),
        ...FAREWELL,
      ],
      [
        think(
          5,
          E,
          'what is good about an ordinary home',
          CASEL_SA,
          [N('Dorothy asks if your home is grey. What is good about a plain, ordinary home?')],
          [
            [
              'The people who live there',
              [
                D(
                  'That’s a fair answer. It is what Aunt Em and Uncle Henry taught me, even if I did not know it then.',
                  'soft',
                ),
              ],
            ],
            [
              'It is the one you know',
              [
                D(
                  'That’s a fair answer. Knowing every creak and corner is a comfort. It is part of what makes it ours.',
                  'soft',
                ),
              ],
            ],
            [
              'Nothing: prettier homes are better',
              [
                D(
                  'That’s a fair answer, and I wondered the same once. After the Emerald City, I am not so sure.',
                  'soft',
                ),
              ],
            ],
          ],
          'Thought about what is good about an ordinary home.',
        ),
      ],
      FAREWELL_CHOICES,
    ),
    sc(
      'a15-20-complete',
      [
        ...KANSAS,
        N(
          'Then the Monkeys come for your friends: the Scarecrow north, the Woodman west, the Lion over the hill to his forest.',
        ),
        N(
          'Glinda gives the Golden Cap to the King of the Monkeys. He bows, and the band flies off without a word.',
        ),
        N(
          'The page carries you home the way you came. Its last picture is the china wall, and a lamb by it, waiting to see you off.',
          'soft',
        ),
        ...CLOSE,
      ],
      [
        ask(
          7,
          LIT,
          'theme',
          'RL.4.2',
          [N('Which sentence best sums up the theme of Dorothy’s whole story?')],
          [
            o(
              'What you are looking for may have been with you all along',
              [
                N(
                  'Yes. The shoes, the brains, the heart and the courage were there from the beginning. The journey helped each to notice what they already had.',
                ),
              ],
              true,
            ),
            o('Never leave home', [
              N(
                'Dorothy left home and found friends and herself. The theme is not about staying put, but about what we already have.',
              ),
            ]),
            o('Shoes are magic', [
              N(
                'The shoes helped, but only at the end. The theme is about finding what we already have.',
              ),
            ]),
          ],
          'Stated the theme of a whole story: what you seek may already be with you.',
        ),
      ],
    ),
  ],
  [
    gl('ruler', 'A person who leads a country or a people and makes its laws.', 'a15-20-goodbye'),
    gl(
      'tarnish',
      'To lose shine and turn dull or dark, as silver does in the air.',
      'a15-20-glinda',
    ),
  ],
);

// ================================================================== variants
/** Reader versions of every scene in ATLAS_A15_VARIANTS. */
const HUMBUG_ASK = (after: number): Beat =>
  ask(
    after,
    LIT,
    'multiple-meaning words: humbug',
    'L.3.4',
    [N('Oz is called a humbug. What does the word mean here?')],
    [
      o(
        'A person who pretends to be more than they are',
        [
          N(
            'Yes. A humbug is a fraud or pretender. In Britain it is also a striped mint sweet, which is a very different thing.',
          ),
        ],
        true,
      ),
      o('A striped mint sweet', [
        N(
          'That is a real meaning too, in Britain. But in this story it means someone who pretends to be more than they are.',
        ),
      ]),
      o('A big, noisy bird', [N('Not a bird. In this story it means a pretender.')]),
    ],
    'Told apart two meanings of humbug and chose the one that fits.',
  );
const GONE_THINK = (after: number): Beat =>
  think(
    after,
    E,
    'a near miss and disappointment',
    CASEL_SM,
    [
      N(
        'Dorothy missed the balloon by a few steps. How do you feel when you narrowly miss something you wanted? What helps?',
      ),
    ],
    [
      [
        'Angry at myself',
        [
          N(
            'That’s a fair answer. Anger at ourselves is common. It helps to remember that Toto was loose and nobody could have planned for a kitten.',
          ),
        ],
      ],
      [
        'Sad, and then ready to try again',
        [
          N(
            'That’s a fair answer. Letting yourself be sad first often makes it easier to find a new plan.',
          ),
        ],
      ],
      [
        'I want someone to comfort me',
        [
          N(
            'That’s a fair answer. Asking for comfort is wise, and a friend beside Dorothy right now would help.',
          ),
        ],
      ],
    ],
    'Thought about the feelings that follow a near miss and what helps.',
  );

export const EDU_A15_READER_VARIANTS: EduScene[] = [
  sc(
    'a15-14-screen-done-reconciled',
    [
      ...POOR_WIZARD,
      N('You knew a man like this.'),
      N('He gave the trick back. His hand was blue.', 'soft'),
    ],
    [HUMBUG_ASK(3)],
  ),
  sc(
    'a15-14-screen-done-bargained',
    [
      ...POOR_WIZARD,
      N('You knew a man like this.'),
      N('He sold the trick, along with everything else.'),
    ],
    [HUMBUG_ASK(3)],
  ),
  sc(
    'a15-14-screen-done-forced',
    [...POOR_WIZARD, N('You knew a man like this.'), N('He only let go when he fell.', 'sad')],
    [HUMBUG_ASK(3)],
  ),
  sc(
    'a15-16-launch-done-reconciled',
    [
      ...BALLOON_GONE,
      N('Your Nubbin watches it go. Then it turns and looks back at you, for a long moment.'),
      N('Some of them come back, you think.', 'soft'),
    ],
    [GONE_THINK(4)],
  ),
  sc(
    'a15-20-farewell-pocketed',
    [
      N('Before Dorothy goes, you take the china lamb out of your pocket to show Glinda.'),
      N('It is cold, and stiff, and its legs are set hard.'),
      N('It is only an ornament now: pretty, and still.', 'sad'),
      N('Your Nubbin touches it with its nose, and nothing happens, and it touches it again.'),
      GL('Ah. You meant to keep it safe. The ones who love them best so often do.', 'soft'),
      GL(
        'You heard what the Princess told you. Carry it home, back over its own wall, and it will wake.',
      ),
      L('My forest lies that way. If nobody else can take you, I will walk you there myself.'),
      ...FAREWELL,
    ],
    [
      think(
        6,
        E,
        'when love holds too tight',
        CASEL_SA,
        [
          N(
            'You meant to keep the lamb safe, and it went still. How can love sometimes get in the way of what someone needs?',
          ),
        ],
        [
          [
            'Love can hold on too tight',
            [
              GL(
                'That’s a fair answer. Holding tight feels like caring, but a loved thing sometimes needs room.',
                'soft',
              ),
            ],
          ],
          [
            'You meant well, and that counts',
            [
              GL(
                'That’s a fair answer. Meaning well matters. It is also fine to mend a mistake, which is what we are about to do.',
                'soft',
              ),
            ],
          ],
          [
            'The lamb needed its field',
            [
              GL(
                'That’s a fair answer. Often the kindest thing is to let someone go back to where they can be themselves.',
                'soft',
              ),
            ],
          ],
        ],
        'Thought about how loving something can lead us to hold it too tight.',
      ),
    ],
    FAREWELL_CHOICES,
  ),
  sc(
    'a15-20-complete-asked',
    [
      ...KANSAS,
      N(
        'Then the Monkeys carry your friends away, and Glinda puts the Golden Cap into the King’s hands. He holds it a long time, looking at you.',
      ),
      MO(
        'You asked me what we would do, if we were free. I have thought about it all this way.',
        'think',
      ),
      MO('Play.', 'happy'),
      N(
        'The whole band loops over Glinda’s castle, round and round, shrieking. A feather comes down and lands on your Nubbin’s head.',
      ),
      N(
        'The page carries you home the way you came. Its last picture is the china wall, and a lamb by it, waiting to see you off.',
        'soft',
      ),
      ...CLOSE,
    ],
    [
      ask(
        6,
        LIT,
        'why a short answer can carry a lot',
        'RL.3.3',
        [
          N(
            'The Monkey King answers in one word: “Play.” Why is a one-word answer so powerful here?',
          ),
        ],
        [
          o(
            'After years of orders, the simplest wish tells you the most',
            [
              MO(
                'Quite so. A long speech would have been about rules. One word says what he longed for.',
                'soft',
              ),
            ],
            true,
          ),
          o('He ran out of words', [
            MO(
              'Not at all. He had thought about it all the way. The short answer was chosen.',
              'soft',
            ),
          ]),
          o('He was being rude', [
            MO('Not rude. It was the plain truth, and it came from a free heart.', 'soft'),
          ]),
        ],
        'Saw how a very short answer can carry a character’s deepest wish.',
      ),
    ],
  ),
  sc(
    'a15-20-complete-asked-pocketed',
    [
      ...KANSAS,
      N(
        'Then the Monkeys carry your friends away, and Glinda puts the Golden Cap into the King’s hands. He looks at you over it.',
      ),
      MO(
        'You asked me what we would do, if we were free. Play. But a favour first, our first free one, if you will let us.',
        'happy',
      ),
      N(
        'They loop once over the castle, shrieking, and a feather drops on your Nubbin’s head. Then they lift you, and fly north to the china wall.',
      ),
      ...LAMB_WAKES,
      ...CLOSE,
    ],
    [
      ask(
        5,
        LIT,
        'a character’s motive',
        'RL.3.3',
        [
          N(
            'Why might the freed Monkeys be glad to carry the lamb home as their first free favour?',
          ),
        ],
        [
          o(
            'They know what it is to be kept from where you belong',
            [
              MO(
                'Just so. Having been bound themselves, they understand a captive thing wanting to go home.',
                'soft',
              ),
            ],
            true,
          ),
          o('They are bored', [
            MO(
              'Not bored. They are choosing to help, which is a different thing from being made to.',
              'soft',
            ),
          ]),
          o('They want the lamb for themselves', [
            MO('Quite the opposite. They are freeing the lamb, not keeping it.', 'soft'),
          ]),
        ],
        'Worked out why the freed Monkeys want to return the lamb: they know what captivity is.',
      ),
    ],
  ),
  sc(
    'a15-20-complete-pocketed',
    [
      ...KANSAS,
      N('The Monkeys come for the Scarecrow and the Woodman. The Lion lets them go without him.'),
      L(
        'I will walk. My forest lies that way, and so does the china wall. A King can walk into his own forest.',
        'soft',
      ),
      N(
        'Glinda gives the Golden Cap to the King of the Monkeys, and the band flies off without a word.',
      ),
      N(
        'The Lion walks you north, all the way to the china wall, with your Nubbin riding on his back.',
      ),
      ...LAMB_WAKES,
      ...CLOSE,
    ],
    [
      ask(
        5,
        LIT,
        'what a choice shows about a character',
        'RL.3.3',
        [
          N(
            'The Lion chooses to walk with you rather than fly. What does that show about him now?',
          ),
        ],
        [
          o(
            'He is steady, and decides for himself',
            [
              L(
                'Quite right. The Lion who ran from a little dog now makes his own plans and keeps a promise.',
                'soft',
              ),
            ],
            true,
          ),
          o('He is afraid of heights', [
            L(
              'He was, once. But he has crossed ditches and a river since. This time he simply prefers to walk with a friend.',
              'soft',
            ),
          ]),
          o('He is lazy', [
            L('Walking all that way is hardly lazy. It is a way of keeping you company.', 'soft'),
          ]),
        ],
        'Saw how a character’s choice shows how much he has grown.',
      ),
    ],
  ),
];

// ================================================================== exports
export const EDU_A15_READER: EduQuest[] = [
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
  Q19,
  Q20,
];

/** Every `edu:` check string used by the lessons above. */
export const CHECKS: string[] = ['edu:count:pulse:15s'];
