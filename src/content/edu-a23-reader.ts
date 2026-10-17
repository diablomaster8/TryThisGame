/**
 * The Learning Grove, reader band (ages 7–10): Atlas page A23, Remember Who You Are (a savanna
 * page: Rafiki’s baobab and the Pride Lands).
 *
 * Source: atlas-a23.ts (ATLAS_A23 and A23_VARIANTS). One EduScene per original scene, id
 * `reader:<original id>`, with every choice kept under its original id and `set` flag
 * (`a23-path`). Reader keeps all choices, so no `defaultChoice` is needed. See EDU-STYLE.md.
 * British spelling.
 *
 * Left out for this band: A23-8 The Gorge and A23-15 Home are audience `main` in the script and
 * have no Learning Grove version. This is a savanna page, not a retelling of the death: A23-9
 * says once, plainly and gently, that Simba’s father died, that Scar told Simba it was his fault,
 * and that it was not. The fall is never told and nothing is told of Scar’s end. The three
 * lifted lines are never used; where the script has them, original words stand in.
 *
 * Learning angles, from the outline: Swahili words (karibu, polepole, twiga, asante, nyota,
 * mvua, pole sana, and hakuna matata only as an everyday phrase), how a lion pride lives
 * (lionesses hunt together), the Great Migration of wildebeest and zebra between the Serengeti
 * and the Maasai Mara, dry season and rains, and why every animal on the plain matters. Kept
 * from the care notes: the land is made up (it is a cousin of Kenya’s Hell’s Gate National
 * Park), nothing is lingered on, and Rafiki is a dry, kind elder with a craft.
 *
 * Facts used: savanna is grassland with scattered trees; Kenya and Tanzania have savannas;
 * giraffes have seven neck bones, like us; a group of giraffes is called a tower; ochre is earth
 * coloured by iron minerals and people have painted with it for tens of thousands of years;
 * lion cubs are born with faint spots that fade; the Sun rises in the east; days near the
 * equator are close to 12 hours long all year; more than a million wildebeest, with zebra and
 * gazelle, travel a great loop between Tanzania’s Serengeti and Kenya’s Maasai Mara, following
 * the rains and fresh grass; there is no real elephant graveyard (it is a myth); spotted
 * hyenas hunt much of their own food and live in clans led by females; thorns protect plants;
 * vultures glide on rising warm air; lionesses hunt together; warthogs run with their tails
 * up; East Africa has two rainy seasons (the long rains about March to May, the short rains
 * about October to December); a sound that bounces back is an echo; a lion’s roar can carry
 * for kilometres.
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
const RA = say('a23-rafiki');
const SI = say('a23-simba');
const NA = say('a23-nala');
const MU = say('a23-mufasa');
const SB = say('a23-sarabi');
const ZA = say('a23-zazu');
const SC = say('a23-scar');
const SH = say('a23-shenzi');
const BA = say('a23-banzai');
const TI = say('a23-timon');
const PU = say('a23-pumbaa');

// ---------------------------------------------------------------- builders
type Beat = Omit<Lesson, 'id'>;
type Opt = NonNullable<Lesson['options']>[number];

const words = (t: string) => t.trim().split(/\s+/).length;
const fits = (t: string) => words(t) <= 26 && t.length <= 150;

/**
 * Keeps every line within the reader caps (30 words, 160 characters) and to two sentences or
 * fewer: a long line is cut at sentence ends into several lines by the same speaker (the mood
 * stays on the first). `map[i]` is the index of the last piece of original line i, so a
 * lesson’s `after` can follow.
 */
const split = (lines: Line[]): { lines: Line[]; map: number[] } => {
  const out: Line[] = [];
  const map: number[] = [];
  for (const l of lines) {
    const sentences = l.text.split(/(?<=[.!?”)])\s+(?=[A-Z“(])/);
    const chunks: string[] = [];
    const counts: number[] = [];
    for (const sentence of sentences) {
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

// ---------------------------------------------------------------- shared pieces
const G_SOFT = 'CASEL: Self-awareness';
const G_REL = 'CASEL: Relationship skills';
const G_SOC = 'CASEL: Social awareness';
const G_MAN = 'CASEL: Self-management';
const G_DEC = 'CASEL: Responsible decision-making';

// ================================================================== A23-1 The Presentation
const Q1: EduQuest = quest(
  'a23-01',
  'The Presentation',
  {
    'a23-01-s1': {
      goal: 'Step down into the page and find Rafiki’s baobab.',
      hint: 'Touch the red rock on the page, then follow the path down to the big tree.',
    },
    'a23-01-s2': {
      goal: 'Walk with Rafiki to the great rock, through the gathering animals.',
      hint: 'Keep close behind Rafiki’s stick. The herds will part for him.',
    },
    'a23-01-s3': {
      goal: 'Watch Rafiki present the new cub from the top of the rock.',
      hint: 'Stand at the back with the gourd. Your Nubbin will want a better view.',
    },
  },
  [
    sc(
      'a23-01-page',
      [
        N(
          'Nova’s atlas falls open at a page of red and gold: a great rock standing over a plain, and the sun just coming up behind it.',
        ),
        N('The light spills off the paper and over your hands, warm as bathwater.'),
        N(
          'Then there is dry grass to your knees, a smell of dust and dew, and a tree with a trunk as fat as a cottage.',
        ),
        N(
          'Somebody sits in the fork of it, cracking a gourd on his knee: an old mandrill with a white beard and a long stick.',
        ),
        RA(
          'Ah. There you are. The page said someone was coming. It did not say when, so I made tea for nobody, twice.',
          'happy',
        ),
        RA('Karibu. That means welcome. Come up, come up. Mind the third branch; it has opinions.'),
        N(
          'Your Nubbin is up the trunk before you, hand over hand. It sits down in the fork as if it had always lived there.',
        ),
        RA(
          'I am Rafiki. In Swahili, rafiki means friend. This is my tree. Today a king shows his son to the world, and I need somebody to carry gourds.',
        ),
        Y('I can carry gourds.'),
        RA('Good. Everyone can. Not everyone does.', 'think'),
      ],
      [
        notice(
          2,
          'social-studies',
          'what a savanna is, and where real ones are',
          'D2.Geo.2.K-2',
          [
            N(
              'This is savanna: a warm grassland with a few trees standing alone, and a long dry season between the rains.',
            ),
            N(
              'Real savannas stretch across Kenya and Tanzania. This page is made up. It is a cousin of Hell’s Gate, a park in Kenya with red cliffs, golden grass and steam rising from cracks.',
            ),
          ],
          'Learned what a savanna is and that real ones lie in Kenya and Tanzania, in East Africa.',
        ),
        ask(
          5,
          'literacy',
          'one word can have more than one meaning',
          'L.3.4',
          [
            RA(
              'Karibu means welcome. It is also the Swahili word for near. So why do you think people say it to a guest?',
            ),
          ],
          [
            o(
              'It means “come near: you are welcome close to us”',
              [
                RA(
                  'Just so. A welcome is an invitation to come near. One word, two meanings, one idea.',
                ),
              ],
              true,
            ),
            o('It sounds like a bird', [
              RA(
                'It does sound musical! But the real reason is that to welcome someone is to say “come near”. That is why karibu means both.',
              ),
            ]),
          ],
          'Learned that the Swahili word karibu means both welcome and near, and why those fit together.',
        ),
      ],
      [
        {
          id: 'gourd',
          label: 'Take the small gourd, carefully.',
          then: [
            RA(
              'Carefully. Good. Either you have done this before, or you are frightened of me. Both are useful.',
              'happy',
            ),
          ],
        },
        {
          id: 'nubbin',
          label: 'Ask what your Nubbin should carry.',
          then: [RA('Its own self, today. That is plenty for something so new.', 'soft')],
        },
        {
          id: 'hurry',
          label: 'Say you’d better hurry.',
          then: [
            RA('Polepole. Slowly. The sun is coming up whether we run or not.', 'think'),
            N('It is the first time he says it to you. It will not be the last.'),
          ],
        },
      ],
    ),
    sc(
      'a23-01-page-done',
      [
        N(
          'Rafiki swings down from the tree on his stick and sets off across the grass without looking back. You follow.',
        ),
        RA('Polepole. The sun is not going anywhere. Well. Up. But not anywhere.'),
        N(
          'Your feet want to run, and your head is full of fizz. Your Nubbin copies you, which does not help.',
        ),
        RA('Polepole is not a rule. It is a way of walking that lets you notice things.'),
      ],
      [
        ask(
          2,
          'sel',
          'slowing down helps us notice and think',
          G_MAN,
          [
            N(
              'Rafiki says going polepole (slowly) lets you notice things. When might that help you?',
            ),
          ],
          [
            o(
              'When I am excited or in a rush and might miss something important',
              [
                RA(
                  'Exactly. Slowing down, even for a breath, gives your head time to catch up with your feet.',
                  'happy',
                ),
              ],
              true,
            ),
            o('Never; fast is always better', [
              RA(
                'Fast is brilliant for some things, like escaping a bee. But for noticing, listening and learning, slower wins.',
              ),
            ]),
          ],
          'Thought about how slowing down helps us notice, listen and think.',
        ),
      ],
    ),
    sc(
      'a23-01-gathering',
      [
        N(
          'The whole plain is walking the same way: zebra, antelope, a family of elephants, and birds in clouds over all of them.',
        ),
        N('Giraffes go past with their heads up in the morning, swaying like slow ships.'),
        RA('Twiga. Giraffe. Say it.'),
        Y('Twiga.'),
        RA(
          'Good. Now you know one thing more than you did. Do that every day and you will be old and clever, like me.',
          'happy',
        ),
        N(
          'A blue-black hornbill flutters down onto a stone in front of you, very important, and looks you up and down.',
        ),
        ZA('Name? Business? Are you on the list? There is a list. I keep the list.', 'think'),
        RA('They are with me, Zazu.'),
        ZA(
          'Everything strange is with you. Very well. Go up. Mind the king’s tail; he is particular about his tail.',
        ),
      ],
      [
        notice(
          1,
          'science',
          'a giraffe’s long neck has the same number of bones as ours',
          '4-LS1-1',
          [
            RA(
              'A giraffe’s neck has seven bones, the same number as yours. Each bone is just very, very long.',
            ),
            RA(
              'That long neck lets it eat leaves from the tops of trees where no other animal can reach.',
            ),
          ],
          'Learned that a giraffe has seven neck bones, like a person, and that its long neck helps it reach leaves.',
        ),
        ask(
          4,
          'maths',
          'multiplication as equal groups',
          '3.OA.A.1',
          [
            N(
              'A group of giraffes is called a tower. Rafiki counts four towers on the path, with three giraffes in each. How many giraffes is that?',
            ),
          ],
          [
            o('12', [N('Yes. Four groups of three: 3 + 3 + 3 + 3 = 12, or 4 × 3 = 12.')], true),
            o('7', [N('That is 4 + 3. We need four groups of three: 3 + 3 + 3 + 3 = 12.')]),
            o('9', [
              N('That is only three groups of three. With four groups it is 3 + 3 + 3 + 3 = 12.'),
            ]),
          ],
          'Worked out 4 groups of 3 giraffes (4 × 3 = 12).',
        ),
      ],
      [
        {
          id: 'list',
          label: 'Ask to see the list.',
          then: [ZA('Certainly not. It is mostly in my head, which is where lists are safest.')],
        },
        {
          id: 'bow',
          label: 'Bow to Zazu.',
          then: [
            ZA('Oh! Well. Somebody was raised properly.', 'happy'),
            N('He bows back, and nearly falls off his stone.'),
          ],
        },
        {
          id: 'nubbin',
          label: 'Let your Nubbin say hello.',
          then: [
            N(
              'Your Nubbin waves. Zazu looks at it for a long moment, then files it in his head under “miscellaneous”.',
            ),
          ],
        },
      ],
    ),
    sc(
      'a23-01-gathering-done',
      [
        N(
          'The king comes down to meet Rafiki, and they hold each other, the big lion and the old mandrill, the way old friends do.',
        ),
        MU('Rafiki. You came.'),
        RA('I always come. Now. Let us see him.', 'happy'),
      ],
      [
        ask(
          2,
          'literacy',
          'what a character’s words tell us about them',
          'RL.3.3',
          [
            N(
              'The king says “You came.” Rafiki says “I always come.” What does that tell us about Rafiki?',
            ),
          ],
          [
            o(
              'He is loyal and can be counted on',
              [
                N(
                  'Yes. “Always” is a strong word. Characters show who they are by what they promise, and what they do.',
                ),
              ],
              true,
            ),
            o('He is rude', [
              N(
                'It could sound that way, but look at the hug. The word “always” shows he is reliable, not rude.',
              ),
            ]),
            o('He is lost', [
              N(
                'Rafiki knows exactly where he is. “I always come” tells us he is someone you can count on.',
              ),
            ]),
          ],
          'Inferred a character trait (loyalty) from a short piece of dialogue.',
        ),
      ],
    ),
    sc(
      'a23-01-presentation',
      [
        N(
          'The lioness, Sarabi, moves her paws aside. Between them is a cub the colour of new bread, blinking at all of you.',
        ),
        SB('Gently. He is three days old, and already he thinks he owns the place.', 'soft'),
        N(
          'Rafiki shakes a rattle of gourds over the cub. The cub sneezes, and the king laughs, low, like thunder a long way off.',
        ),
        N(
          'Rafiki dips his thumb in a gourd of fruit-red and draws one line across the cub’s brow.',
        ),
        N('Your Nubbin climbs your back, then your shoulder, then your head, to see.'),
        N(
          'Rafiki walks to the very edge of the rock and holds the cub up in both hands, high, over everything.',
        ),
        N(
          'Down on the plain, every animal sees him at once. Elephants trumpet and zebra stamp, and the birds go up in one great wheel.',
        ),
        N('Then the whole plain kneels.'),
      ],
      [
        notice(
          2,
          'music',
          'sound comes from vibration, and shakers make rhythm',
          '1-PS4-1',
          [
            RA(
              'A dried gourd with seeds inside is a shaker. The seeds bounce, the gourd shivers, and the shiver reaches your ear as sound.',
            ),
            RA(
              'People all over the world make shakers. The beat they keep is older than any song I know.',
            ),
          ],
          'Learned that a shaker makes sound by vibrating, and that people everywhere keep rhythm with shakers.',
        ),
        ask(
          6,
          'science',
          'young animals are like their parents but not the same',
          '1-LS3-1',
          [
            N(
              'Lion cubs are born with faint spots that fade as they grow, and a male cub has no mane until he is older. What does that tell us about cubs and adult lions?',
            ),
          ],
          [
            o(
              'Young animals can look different from their parents at first',
              [
                N(
                  'Yes. Cubs are like their parents but not the same: spots, small size, no mane yet. They change as they grow.',
                ),
              ],
              true,
            ),
            o('Cubs look exactly like adult lions', [
              N(
                'Almost, but not quite. A cub has faint spots and a smaller body. Those spots fade as it grows into a lion.',
              ),
            ]),
          ],
          'Learned that young animals can look different from adults and change as they grow.',
        ),
      ],
      [
        {
          id: 'kneel',
          label: 'Kneel with the plain.',
          then: [
            N(
              'You kneel on the warm stone. Your Nubbin, still on your head, kneels too, which is harder than it looks.',
            ),
          ],
        },
        {
          id: 'watch',
          label: 'Stay standing, and watch the king’s face.',
          then: [
            N(
              'The king is not looking at the plain. He is looking at his son, the way you look at a fire on a cold night.',
              'soft',
            ),
          ],
        },
      ],
    ),
    sc(
      'a23-01-complete',
      [
        N('The cub goes back to his mother and falls asleep at once, worn out by being important.'),
        MU(
          'His name is Simba. In Swahili, simba means lion. Rafiki tells me you are a guest. Then you are welcome on this rock, guest.',
        ),
        N('Rafiki is quiet on the walk home. Halfway there he stops and looks back at the rock.'),
        RA('There was one face missing up there. The king’s brother. He did not come.', 'think'),
        RA('Well. He will come or he will not. Carry the gourds. We have painting to do.'),
      ],
      [
        ask(
          3,
          'sel',
          'thinking about why someone stays away',
          G_SOC,
          [
            N(
              'The king’s brother did not come to the celebration. Why might someone stay away from a happy event? There is no one right answer.',
            ),
          ],
          [
            o('He might feel left out or cross', [
              N(
                'That’s a fair answer. Feeling left out can make a person keep away. Rafiki noticed, and that is worth noticing.',
              ),
            ]),
            o('He might just be busy or shy', [
              N(
                'That’s a fair answer too. Sometimes people stay away for quiet reasons. Rafiki is watching, to find out which it is.',
              ),
            ]),
            o('He might not be happy for his brother', [
              N(
                'That’s a fair answer. Mixed feelings are real. Rafiki’s “he will come or he will not” shows he is waiting to see.',
              ),
            ]),
          ],
          'Thought about why someone might stay away from a celebration, with no single right answer.',
        ),
      ],
    ),
  ],
  [
    gl(
      'savanna',
      'A warm grassland with a few trees, where it rains in some months and is dry in others.',
      'a23-01-page',
    ),
    gl('tower', 'The name for a group of giraffes.', 'a23-01-gathering'),
  ],
);

// ================================================================== A23-2 Rafiki’s Tree
const Q2: EduQuest = quest(
  'a23-02',
  'Rafiki’s Tree',
  {
    'a23-02-s1': {
      goal: 'Mix Rafiki’s paints: ochre from the riverbank, and red from the fruit.',
      hint: 'Bring yellow earth from the dry riverbed and ripe fruit from the tree, then grind them in the shell.',
    },
    'a23-02-s2': {
      goal: 'Hold the shell while Rafiki paints the cub on the wall of his tree.',
      hint: 'Stand still beside him with the paints. Your Nubbin will try to help.',
    },
  },
  [
    sc(
      'a23-02-paints',
      [
        N(
          'Inside, the baobab is hollow and cool, and taller than it looks. The walls are painted all the way up.',
        ),
        N(
          'Lions, mostly: kings and queens and cubs in rust and white and yellow, some so old they have gone the colour of tea.',
        ),
        RA(
          'My family. Not my family. The family I watch. Which is the same thing, if you watch long enough.',
        ),
        RA(
          'Now. The cub must go up on the wall. I need ochre, and red. You will mix them, because my knees have retired.',
        ),
        N('He gives you a tortoise shell for a bowl and a smooth stone for grinding.'),
        RA(
          'Ochre is the yellow earth by the dry river. Red is the fruit of this tree: the ripe ones, not the ones that make you sorry.',
        ),
        N(
          'Your Nubbin has already found a fruit. It has red juice up to the elbows and looks thrilled.',
        ),
        RA('Hm. That one has started without you.'),
      ],
      [
        notice(
          3,
          'science',
          'ochre is earth coloured by iron, used as paint for a very long time',
          '2-PS1-1',
          [
            RA(
              'Ochre is earth that is yellow, red or brown because of iron minerals in it. Grind it fine and it becomes paint.',
            ),
            RA(
              'People have painted with ochre for tens of thousands of years. It is some of the oldest paint there is.',
            ),
          ],
          'Learned that ochre is earth coloured by iron minerals and has been used as paint for tens of thousands of years.',
        ),
        ask(
          5,
          'maths',
          'multiplication word problem',
          '3.OA.A.3',
          [
            N(
              'Rafiki says each shell of paint needs 3 spoonfuls of ground ochre, and he wants 4 shells for the wall. How many spoonfuls of ochre will you grind?',
            ),
          ],
          [
            o(
              '12',
              [
                RA(
                  'Yes. Four shells, three spoonfuls each: 4 × 3 = 12. Polepole, now. That is a lot of grinding.',
                ),
              ],
              true,
            ),
            o('7', [
              RA('That is 4 + 3. Each of the 4 shells needs 3 spoonfuls, so 3 + 3 + 3 + 3 = 12.'),
            ]),
            o('34', [RA('That is the digits side by side. Multiply instead: 4 × 3 = 12.')]),
          ],
          'Solved a multiplication word problem: 4 shells × 3 spoonfuls = 12.',
        ),
      ],
      [
        {
          id: 'grind',
          label: 'Grind it slowly, the way he showed you.',
          then: [
            RA('Polepole. Yes. Slow paint stays on the wall. Fast paint ends up on the visitor.'),
          ],
        },
        {
          id: 'fast',
          label: 'Grind it fast, to get it done.',
          then: [
            N('A puff of yellow dust goes up your nose. You sneeze it all over the floor.'),
            RA('Polepole.'),
          ],
        },
        {
          id: 'taste',
          label: 'Wonder aloud whether the fruit is nice to eat.',
          then: [RA('It is. Eat one first. A hungry painter paints nothing but food.')],
        },
      ],
    ),
    sc(
      'a23-02-paints-done',
      [
        N(
          'The paint comes up thick and warm: a yellow like dry grass at noon, and a red like the inside of the fruit.',
        ),
        RA('Good. Asante. That is thank you. You will hear it from me more than you expect.'),
        RA('Asante sana is thank you very much. Sana means very. Try it.'),
      ],
      [
        ask(
          2,
          'literacy',
          'learning a new word from its parts',
          'L.2.4',
          [N('Asante means thank you, and sana means very. What does “asante sana” mean?')],
          [
            o(
              'Thank you very much',
              [
                RA(
                  'Yes! You added two meanings together. Words in every language are built from small pieces like this.',
                ),
              ],
              true,
            ),
            o('Good morning', [
              RA('Not quite. Asante is thank you and sana is very, so it is thank you very much.'),
            ]),
          ],
          'Worked out the meaning of the Swahili phrase asante sana (thank you very much) from its two words.',
        ),
      ],
    ),
    sc(
      'a23-02-wall',
      [
        N(
          'Rafiki climbs the inside of the tree with the shell hooked on his stick, up to a bare patch of bark at the height of your head.',
        ),
        N(
          'He paints with his fingers, quick and sure: a round body, four fat paws, ears like two little hills.',
        ),
        RA('There. Simba. Not a good likeness. He is much crosser in life.'),
        N('Last, with one dab of red, he gives the painted cub the line across its brow.'),
        RA('Now he is on the wall. As long as the wall stands, someone will know he was here.'),
        N('Your Nubbin reaches into the shell and puts a red paw-print on its own forehead.'),
        RA(
          'Ha! It wants to be on the wall as well. Not today, small one. Painting someone is a serious thing. It means you mean to remember them.',
        ),
      ],
      [
        notice(
          4,
          'social-studies',
          'people keep the past alive with paintings, stories and songs',
          'D2.His.2.K-2',
          [
            RA(
              'Long before anyone wrote things down, people kept their past by painting it on walls, telling it as stories, and singing it.',
            ),
            RA(
              'That is called oral history when it is spoken. A wall like mine, and an old story, both carry the past to people who were not there.',
            ),
          ],
          'Learned that people have kept the past alive with paintings and spoken stories, called oral history.',
        ),
        ask(
          6,
          'literacy',
          'figurative language and its meaning',
          'L.4.5',
          [
            N(
              'Rafiki says “a lion is quick, and a wall is slow,” and that somebody has to hold on to things for the quick ones. What do you think he means?',
            ),
          ],
          [
            o(
              'A painting lasts longer than a life, so it can keep a memory safe',
              [
                RA(
                  'Just so. Lions come and go. A wall stays, and holds them for whoever comes next.',
                ),
              ],
              true,
            ),
            o('Walls are slower than lions at running', [
              RA(
                'That is true, and it is the surface of what I said. Underneath: a wall lasts, so it can remember for the quick ones.',
              ),
            ]),
          ],
          'Interpreted a saying about lions being quick and a wall being slow as a way of talking about memory.',
        ),
      ],
      [
        {
          id: 'ask',
          label: 'Ask why he paints them.',
          then: [
            RA(
              'Because a lion is quick, and a wall is slow. Somebody has to hold on to things for the quick ones.',
            ),
          ],
        },
        {
          id: 'old',
          label: 'Look at the oldest paintings, near the top.',
          then: [
            N(
              'Up near the roof, a lion is painted so faint you can only see it when you stop trying. Rafiki does not say who it was.',
            ),
          ],
        },
        {
          id: 'wipe',
          label: 'Wipe your Nubbin’s forehead.',
          then: [
            RA(
              'Leave it. It suits it. Red, for a small brave one. It will wash off. Most things do.',
            ),
          ],
        },
      ],
    ),
    sc(
      'a23-02-complete',
      [
        N(
          'Rafiki climbs down and wipes his hands on the grass. He looks up at the wall for a long time.',
        ),
        RA('You will come again. The page will bring you. Here, for the small one.'),
        N(
          'He threads a tiny dried gourd onto a grass string and hangs it round your Nubbin’s neck.',
        ),
        RA(
          'For carrying. Nothing in it yet. That is the best sort of gourd: the sort that is waiting.',
        ),
        N('Your Nubbin shakes it. It makes a small, dry, important noise.'),
      ],
      [
        ask(
          3,
          'sel',
          'patience and being ready',
          G_SOFT,
          [
            N(
              'Rafiki says an empty gourd that is waiting is the best sort of gourd. What do you think he means? There is no one right answer.',
            ),
          ],
          [
            o('Being ready for something is a kind of treasure', [
              N(
                'That’s a fair answer. An empty gourd can become anything: water, seeds, a rattle. Being ready is full of possibility.',
              ),
            ]),
            o('He means you should not hurry to fill things', [
              N(
                'That’s a fair answer. Rafiki loves polepole. Waiting well, with space left to fill, is a skill.',
              ),
            ]),
            o('He is just being funny', [
              N(
                'That’s a fair answer too. Rafiki is funny. But notice how he often hides a true thing inside a joke.',
              ),
            ]),
          ],
          'Thought about what Rafiki means by an empty gourd that is waiting, with no single right answer.',
        ),
      ],
    ),
  ],
  [
    gl('ochre', 'Yellow, red or brown earth that people grind into paint.', 'a23-02-paints'),
    gl(
      'oral history',
      'The past kept alive by telling it aloud, as stories and songs.',
      'a23-02-wall',
    ),
  ],
);

// ================================================================== A23-3 Everything the Light Touches
const Q3: EduQuest = quest(
  'a23-03',
  'Everything the Light Touches',
  {
    'a23-03-s1': {
      goal: 'Carry Rafiki’s message up to the king before sunrise.',
      hint: 'Climb the back path to the top of the rock. Arrive quietly.',
    },
    'a23-03-s2': {
      goal: 'Stand with the king and his son as the sun comes up over the plain.',
      hint: 'Find a spot at the top of the rock, a little behind them. Watch where the light goes.',
    },
    'a23-03-s3': {
      goal: 'Watch the pouncing lesson, and let your Nubbin have a go.',
      hint: 'Keep low in the grass behind Simba. Zazu is the target, whether he knows it or not.',
    },
  },
  [
    sc(
      'a23-03-dawn',
      [
        N(
          'The page turns. Simba is bigger now, all feet and ears, and he has been awake since a quarter to six.',
        ),
        N(
          'Rafiki has sent you up the rock with a message for the king: the rains are late, and Rafiki is watching.',
        ),
        N('Before you can give it, a small lion lands on your feet.'),
        SI('Are you the guest? Dad says you’re the guest. Do you want to see me pounce?'),
        N(
          'He does not wait for an answer. He pounces on your Nubbin, and the two of them roll off down the rock in one ball.',
        ),
        MU('Simba. Guests are not for pouncing.'),
        SI('It started it!'),
        N(
          'It did not start it. Your Nubbin comes up out of the grass looking delighted, and dives straight back in.',
        ),
        MU(
          'Rafiki’s message? He is always watching. That is a comfort, mostly. Come. There is something I want my son to see.',
        ),
      ],
      [
        ask(
          1,
          'maths',
          'time intervals',
          '3.MD.A.1',
          [
            N(
              'Simba woke at 5:45 in the morning. The sun came up at 6:30. How many minutes was Simba awake before sunrise?',
            ),
          ],
          [
            o(
              '45 minutes',
              [
                N(
                  'Yes. From 5:45 to 6:00 is 15 minutes, and 6:00 to 6:30 is 30 more: 15 + 30 = 45.',
                ),
              ],
              true,
            ),
            o('15 minutes', [
              N(
                'That is only 5:45 to 6:00. Add 30 more minutes to reach 6:30: 15 + 30 = 45 minutes.',
              ),
            ]),
            o('75 minutes', [
              N(
                'That adds instead of counting the gap. From 5:45 up to 6:30 is 15 + 30 = 45 minutes.',
              ),
            ]),
          ],
          'Found a time interval: from 5:45 to 6:30 is 45 minutes.',
        ),
        ask(
          6,
          'sel',
          'noticing whether others are enjoying rough play',
          G_SOC,
          [
            N(
              'Simba pounced on your Nubbin, and it came up delighted. How can you tell whether someone is enjoying rough play?',
            ),
          ],
          [
            o(
              'They smile, come back for more and play back',
              [
                MU(
                  'Exactly. Look for willing faces and a game that goes both ways. If someone stops smiling, stop too.',
                ),
              ],
              true,
            ),
            o('They stay quiet', [
              MU(
                'Quiet can mean anything. Watch the face and body: smiling and playing back is a yes; pulling away is a no.',
              ),
            ]),
          ],
          'Learned to tell whether a friend is enjoying rough play: smiles, playing back, and stopping if they pull away.',
        ),
      ],
      [
        {
          id: 'wrestle',
          label: 'Let them wrestle.',
          then: [N('The two of them roll about in the grass until they are both the same colour.')],
        },
        {
          id: 'part',
          label: 'Pull them apart before anyone cries.',
          then: [
            N(
              'Nobody cries. Simba thinks being lifted by the scruff is a new game, and asks for another go.',
            ),
          ],
        },
      ],
    ),
    sc(
      'a23-03-dawn-done',
      [
        N(
          'The king walks to the very top of the rock, and Simba scrambles after him. You follow with your Nubbin under your arm.',
        ),
        N('Ahead of you, the sun is a thin gold edge on the far side of the plain.'),
        N(
          'Rafiki’s rock is tall enough to see the whole of it, from the east, where the sun is climbing, to the hills far off in the west.',
        ),
      ],
      [
        ask(
          2,
          'social-studies',
          'compass directions and the Sun’s path',
          'D2.Geo.2.K-2',
          [
            N(
              'The Sun rises in the east. If you stand on the rock and face the sunrise, which way are the hills behind you?',
            ),
          ],
          [
            o(
              'West',
              [
                N(
                  'Yes. If you face east, west is directly behind you. The Sun rises in the east and sets in the west.',
                ),
              ],
              true,
            ),
            o('North', [
              N('North would be on your left as you face east. Directly behind you is west.'),
            ]),
            o('East', [
              N('East is where you are looking, at the sunrise. Behind you is the opposite: west.'),
            ]),
          ],
          'Used the Sun rising in the east to work out that west is behind you.',
        ),
      ],
    ),
    sc(
      'a23-03-light',
      [
        N(
          'The sun comes up over the edge of the world, and the light runs across the plain like water spilt on a table.',
        ),
        MU('Look, Simba. As far as the light goes. One day all of it will be yours to look after.'),
        SI('All of it? Even the bit with the river?'),
        MU('Even the river.'),
        N(
          'Far off, past the edge of the light, there is a grey place where nothing seems to grow.',
        ),
        MU('That is beyond our borders. You must never go there.'),
        MU(
          'Everything here is joined. The grass feeds the antelope, the antelope feed us, and when we lie down at the end, we feed the grass.',
        ),
        SI('So we eat the antelope, and then the antelope… eat us? A bit?'),
        MU('A bit. Later. Much later.'),
      ],
      [
        ask(
          0,
          'literacy',
          'recognising a simile',
          'L.4.5',
          [
            N(
              '“The light runs across the plain like water spilt on a table.” What is this comparing, and how can you tell?',
            ),
          ],
          [
            o(
              'Light and water, and the word “like” shows it',
              [
                N(
                  'Yes. A comparison that uses “like” or “as” is a simile. It helps us picture the light spreading quickly and smoothly.',
                ),
              ],
              true,
            ),
            o('It says the light is wet', [
              N(
                'Not quite. The writer is not saying the light is wet; the word “like” says it moves the way water does. That is a simile.',
              ),
            ]),
          ],
          'Identified a simile and what it compares.',
        ),
        notice(
          6,
          'science',
          'food chains: energy passes along, and decomposers return it to the soil',
          '2-LS4-1',
          [
            MU(
              'Grass makes its own food from sunlight. An antelope eats the grass. A lion eats the antelope. That is a food chain.',
            ),
            MU(
              'And when anything dies, beetles, fungi and tiny soil creatures break it down and give it back to the ground, so the grass can grow. That is why every creature on the plain matters.',
            ),
          ],
          'Learned a savanna food chain (grass, antelope, lion) and that decomposers return nutrients to the soil.',
        ),
      ],
      [
        {
          id: 'lift',
          label: 'Hold your Nubbin up to see the light.',
          then: [N('It squints at the sun the way Simba did on his first morning, and sneezes.')],
        },
        {
          id: 'grey',
          label: 'Ask the king what the grey place is.',
          then: [MU('Somewhere I hope none of you ever learn about.')],
        },
      ],
    ),
    sc(
      'a23-03-pounce',
      [
        N(
          'Zazu lands on a rock beside the king with the morning report. It is long, and he has clearly practised it.',
        ),
        ZA(
          'Giraffes: tall as ever. Elephants: no complaints. The cheetahs are hungry, and the hippos would like a word about mud.',
        ),
        MU(
          'Simba. Come here. Low down in the grass. Watch his tail feathers. Slowly. Slower than that.',
        ),
        N(
          'Simba wiggles his bottom, creeps three steps, and launches himself at the hornbill with a squeak.',
        ),
        N(
          'He lands on Zazu with all four paws. Zazu says something that is not in the morning report.',
        ),
        N(
          'Your Nubbin has watched all of it with great seriousness. It wiggles, it creeps, and it pounces.',
        ),
        N('It misses Zazu by a whole lion’s length and lands in a bush.'),
      ],
      [
        ask(
          3,
          'maths',
          'two-step measurement word problem',
          '4.MD.A.2',
          [
            N(
              'Simba creeps three steps, each 40 centimetres long, and then pounces another 120 centimetres. How far has he moved in all, in centimetres?',
            ),
          ],
          [
            o(
              '240 cm',
              [
                N(
                  'Yes. Three steps of 40 cm is 120 cm, and 120 + 120 = 240 cm. That is 2 metres 40 centimetres.',
                ),
              ],
              true,
            ),
            o('160 cm', [
              N(
                'That is 40 + 120. There are three creeping steps: 3 × 40 = 120, then add the pounce: 120 + 120 = 240 cm.',
              ),
            ]),
            o('120 cm', [
              N('That is just the creeping, or just the pounce. Add them: 120 + 120 = 240 cm.'),
            ]),
          ],
          'Solved a two-step problem with centimetres: 3 × 40 + 120 = 240 cm.',
        ),
      ],
      [
        {
          id: 'cheer',
          label: 'Cheer anyway.',
          then: [N('Your Nubbin climbs out of the bush and bows. Simba cheers too, much louder.')],
        },
        {
          id: 'help',
          label: 'Help it out of the bush.',
          then: [N('It comes out covered in burrs and thoroughly pleased with itself.')],
        },
      ],
    ),
    sc(
      'a23-03-complete',
      [
        ZA('This is what comes of having guests. Everybody gets ideas.'),
        MU('Your small one will make a fine hunter one day. In a year or two. With a bigger bush.'),
        N(
          'Simba lies on his back in the grass with his paws in the air, out of breath and very proud.',
        ),
        SI('When I’m in charge, everyone will have to let me pounce on them.'),
        MU('When you’re in charge, you’ll know better. Go and find your mother.'),
      ],
      [
        ask(
          3,
          'sel',
          'what being in charge really means',
          G_DEC,
          [
            N(
              'Simba thinks being in charge means everyone has to do what he likes. His father says he will know better. What do you think being in charge means? There is no one right answer.',
            ),
          ],
          [
            o('Looking after others, not only getting your own way', [
              N(
                'That’s a fair answer. A good king looks after everyone, not only himself. Looking after everyone is the heart of it.',
              ),
            ]),
            o('Making the rules everyone follows', [
              N(
                'That’s a fair answer. A leader does make rules. The harder part is making fair ones, and following them yourself.',
              ),
            ]),
            o('Getting to do whatever you want', [
              N(
                'That’s what young Simba thinks, and it is an honest guess. His father suggests that real leaders learn it is more about duty than fun.',
              ),
            ]),
          ],
          'Thought about what it means to be in charge, with no single right answer.',
        ),
      ],
    ),
  ],
  [
    gl('simile', 'A comparison that uses the words “like” or “as”.', 'a23-03-light'),
    gl(
      'decomposer',
      'A tiny living thing, such as a fungus or a beetle, that breaks down dead plants and animals.',
      'a23-03-light',
    ),
  ],
);

// ================================================================== A23-4 Uncle Scar
const Q4: EduQuest = quest(
  'a23-04',
  'Uncle Scar',
  {
    'a23-04-s1': {
      goal: 'Follow Simba round to his uncle’s ledge.',
      hint: 'Simba has gone round the shady side of the rock. Keep up.',
    },
    'a23-04-s2': {
      goal: 'Listen to what Scar lets slip.',
      hint: 'Stay close to Simba and listen. Scar is choosing his words.',
    },
  },
  [
    sc(
      'a23-04-ledge',
      [
        N(
          'Simba cannot stop talking about the sunrise. He is going to tell everybody, and the first everybody is his uncle.',
        ),
        N(
          'Round the shady side of the rock, on a ledge the sun never quite reaches, a thin dark lion lies with his chin on his paws.',
        ),
        N('His mane is black and his eyes are green, and an old scar runs down over one of them.'),
        SI('Uncle Scar! Dad showed me the whole kingdom, and I’m going to look after all of it!'),
        SC(
          'How lovely for you. Do excuse me if I don’t get up. Getting up is for lions with somewhere to be.',
        ),
        N('He looks at you over Simba’s head. He takes a long time about it, and then he smiles.'),
        SC('And a guest. Rafiki’s, I suppose. He does collect strays.'),
      ],
      [
        ask(
          4,
          'literacy',
          'what a character’s words reveal',
          'RL.3.3',
          [
            N(
              'Scar says “Getting up is for lions with somewhere to be.” What does that tell us about him?',
            ),
          ],
          [
            o(
              'He is bitter, and he hides it behind a joke',
              [
                N(
                  'Yes. The joke has a sting in it: he is saying he has been left with nowhere to be. Characters often hide feelings in jokes.',
                ),
              ],
              true,
            ),
            o('He is just lazy', [
              N(
                'Possibly, and it is a fair guess. But notice how he turns it into a complaint about being left out. That is bitterness, wearing a lazy costume.',
              ),
            ]),
          ],
          'Inferred a character’s hidden feeling (bitterness) from a sarcastic joke.',
        ),
        ask(
          5,
          'sel',
          'noticing an uneasy feeling and acting on it',
          G_SOFT,
          [
            N(
              'Scar smiles at you for a long time, and your stomach feels strange. What should you do with that feeling?',
            ),
          ],
          [
            o(
              'Notice it, stay careful, and tell someone you trust',
              [
                N(
                  'Yes. An uneasy feeling is information, not a failing. You do not need proof to be careful, or to tell a trusted grown-up.',
                ),
              ],
              true,
            ),
            o('Ignore it so you are not rude', [
              N(
                'Being polite is good, and you can be polite and careful at once. Do not ignore a strange feeling just to be nice.',
              ),
            ]),
          ],
          'Learned to treat an uneasy feeling as a clue, to stay careful, and to tell a trusted person.',
        ),
      ],
      [
        {
          id: 'greet',
          label: 'Say good morning politely.',
          then: [SC('Good morning. Such manners. Somebody ought to bottle them.')],
        },
        {
          id: 'stare',
          label: 'Look straight back at him.',
          then: [
            N('He holds your look and does not blink, and you are the one who looks away first.'),
          ],
        },
        {
          id: 'behind',
          label: 'Keep your Nubbin behind your legs.',
          then: [
            N(
              'Your Nubbin has climbed on every animal on the plain. It does not want to go anywhere near this one.',
            ),
          ],
        },
      ],
    ),
    sc(
      'a23-04-ledge-done',
      [
        N(
          'Scar stretches, slow and careful, like someone with a bad back who wants you to ask about it.',
        ),
        N(
          'You notice how cool the ledge is. A great shoulder of rock stands between it and the sun, and its shadow lies over everything.',
        ),
      ],
      [
        ask(
          1,
          'science',
          'shadows form when something blocks light',
          '5-ESS1-2',
          [N('The ledge is cool and shady. Why is there a shadow here?')],
          [
            o(
              'Light travels in straight lines, and the rock blocks it',
              [
                N(
                  'Yes. Light cannot bend round a solid rock, so the space behind it is shadow, and cooler because no sunlight warms it.',
                ),
              ],
              true,
            ),
            o('The rock makes its own darkness', [
              N(
                'It is not the rock making darkness; it is blocking light. Where no light reaches, there is shadow.',
              ),
            ]),
          ],
          'Learned that a shadow forms where a solid object blocks light, and that shade is cooler.',
        ),
      ],
    ),
    sc(
      'a23-04-slip',
      [
        SC('Did your father show you everything, Simba? Even what lies past the northern border?'),
        SI('He said I can’t go there.'),
        SC(
          'And he’s quite right. It’s a place for grown lions. Very bold ones. Not you, of course.',
        ),
        SI('I’m bold! What’s out there?'),
        SC('Oh, no. I couldn’t. I’ve said too much already.'),
        N(
          'He turns away as if he were sorry. He isn’t, and you can tell from the end of his tail.',
        ),
        SC('Bones, Simba. Old ones, as big as trees. No place for a cub.'),
        SC(
          'Promise me you’ll keep well away. Just between us two. And don’t tell your father I mentioned it.',
        ),
        N('Simba’s eyes have gone round and shiny. He isn’t listening to the promise part at all.'),
      ],
      [
        ask(
          7,
          'sel',
          'when a secret should be shared',
          G_DEC,
          [
            N(
              'Scar says “Just between us two, and don’t tell your father.” When might a secret be one that should be shared with a trusted grown-up? There is no one right answer.',
            ),
          ],
          [
            o('When it could put someone in danger', [
              N(
                'That’s a fair answer. Secrets that could hurt someone are not the kind to keep. Telling a trusted grown-up is not being a tattletale.',
              ),
            ]),
            o('When it makes me feel uneasy or worried', [
              N(
                'That’s a fair answer. A secret that makes you feel strange is a good one to share. Happy surprises are different: they are fun to keep.',
              ),
            ]),
            o('Never; a promise is a promise', [
              N(
                'That’s a fair answer, and keeping promises matters. But a promise to keep something dangerous or scary can be broken to keep someone safe.',
              ),
            ]),
          ],
          'Thought about when a secret should be shared with a trusted adult, with no single right answer.',
        ),
      ],
      [
        {
          id: 'tell',
          label: 'Say you’ll tell the king.',
          then: [
            SC('Tell him what? That I warned his son to be careful? Do. He’ll be so grateful.'),
            N('You cannot think of an answer. That was the point.'),
          ],
        },
        {
          id: 'horrible',
          label: 'Tell Simba it sounds like a horrible place.',
          then: [SI('It sounds amazing.')],
        },
        {
          id: 'leave',
          label: 'Take Simba away from the ledge.',
          then: [N('Simba comes with you, but he looks back twice. Scar is watching both times.')],
        },
      ],
    ),
    sc(
      'a23-04-complete',
      [
        N(
          'Back at the baobab, you tell Rafiki what Scar said. He stops painting and puts his finger down very carefully.',
        ),
        RA('He told the boy where not to go. That is the same as drawing him a map.'),
        RA('We watch. And we fill the gourds, because cubs get thirsty, wherever they run.'),
        N('Rafiki wants 15 litres of water in the gourds before dark. Each gourd holds 3 litres.'),
      ],
      [
        ask(
          3,
          'maths',
          'division as equal groups',
          '3.OA.A.3',
          [
            N(
              'Rafiki wants 15 litres, and each gourd holds 3 litres. How many gourds do you need to fill?',
            ),
          ],
          [
            o(
              '5',
              [
                N(
                  'Yes. 15 ÷ 3 = 5, because five gourds of three litres make 15. Check: 5 × 3 = 15.',
                ),
              ],
              true,
            ),
            o('12', [N('That is 15 − 3. To find how many gourds, divide: 15 ÷ 3 = 5.')]),
            o('45', [
              N(
                'That is 15 × 3. We are splitting 15 litres into gourds of 3, so divide: 15 ÷ 3 = 5.',
              ),
            ]),
          ],
          'Solved a division problem: 15 litres ÷ 3 litres per gourd = 5 gourds.',
        ),
      ],
    ),
  ],
  [
    gl('shadow', 'The dark patch where something blocks the light.', 'a23-04-ledge-done'),
    gl(
      'bitter',
      'Feeling hurt and cross for a long time because of something unfair.',
      'a23-04-ledge',
    ),
  ],
);

// ================================================================== A23-5 Losing Zazu
const Q5: EduQuest = quest(
  'a23-05',
  'Losing Zazu',
  {
    'a23-05-s1': {
      goal: 'Set off with Simba, Nala and Zazu, to “the waterhole”.',
      hint: 'Zazu is in charge of the walk. Stay with the group, for as long as there is a group.',
    },
    'a23-05-s2': {
      goal: 'Keep up with the cubs as they lose Zazu among the herds.',
      hint: 'Follow the cubs through the herds. Duck under the zebra and go round the rhinoceros.',
    },
  },
  [
    sc(
      'a23-05-walk',
      [
        N(
          'Next morning Simba turns up at the baobab with a friend: a cub with pale fur and the look of a planned escape.',
        ),
        SI('This is Nala. We’re going to the waterhole. A really good waterhole. You should come.'),
        NA('It isn’t the waterhole. Tell them.'),
        SI('Shh! Zazu’s coming.'),
        N(
          'Zazu is coming. Their mothers said they could go as long as he went too, and he is taking it extremely seriously.',
        ),
        ZA(
          'In a line, please. Single file. Nobody is to be eaten, trampled, or rude to a rhinoceros.',
        ),
        ZA(
          'A herd has a thousand eyes. A lone animal has two. That is the whole reason for the line.',
        ),
        RA('Go with them. Take water. And keep your eyes open.'),
        N('Your Nubbin trots between the two cubs, very pleased to be counted as one of the gang.'),
      ],
      [
        notice(
          6,
          'science',
          'animals in groups help each other survive',
          '3-LS2-1',
          [
            N(
              'Zazu has a point. Zebra, wildebeest and many other plains animals live in herds. With many eyes and ears, someone usually spots a hunter early.',
            ),
            N(
              'A lone animal is much easier for a hunter to catch. Staying together is a survival skill.',
            ),
          ],
          'Learned that animals in groups, like herds, help each other survive because many watchers spot danger sooner.',
        ),
      ],
      [
        {
          id: 'back',
          label: 'Walk at the back with Zazu.',
          then: [
            ZA(
              'Ah, a sensible person. You and I shall keep order, and they shall resent us. It is a calling.',
            ),
          ],
        },
        {
          id: 'front',
          label: 'Walk at the front with the cubs.',
          then: [
            NA('You know it’s not the waterhole, right? You’ve worked that out?'),
            Y('I’ve worked that out.'),
          ],
        },
      ],
    ),
    sc(
      'a23-05-walk-done',
      [
        N(
          'Halfway across the plain, Simba gives Nala a look, and Nala gives it back. Then both of them run.',
        ),
        N('Behind them, Zazu’s voice shrinks to a squeak.'),
      ],
      [
        ask(
          0,
          'literacy',
          'why characters act as they do',
          'RL.3.3',
          [N('Simba and Nala run off when Zazu is not looking. Why do you think they do it?')],
          [
            o(
              'They want an adventure, and know Zazu would say no',
              [
                N(
                  'Yes. Look at the clues: the secret look, and Nala saying it is not really the waterhole. They planned it.',
                ),
              ],
              true,
            ),
            o('They are lost', [
              N(
                'They know exactly where they are going. The look they share tells us it was a plan, not an accident.',
              ),
            ]),
            o('Zazu told them to', [
              N(
                'Zazu did the opposite: he wanted them in a line. The cubs ran because they wanted to go where he would not allow.',
              ),
            ]),
          ],
          'Inferred a character’s motive from clues in the story.',
        ),
      ],
    ),
    sc(
      'a23-05-chase',
      [
        N(
          'They go straight into the middle of a herd of zebra, and you have no choice but to go in after them.',
        ),
        ZA('Come back! This is not single file! This is not any file!'),
        N(
          'Stripes everywhere. You lose the cubs, find them, then lose your own feet and land on your back in the dust.',
        ),
        N(
          'Simba runs under a giraffe. Nala goes round a rhinoceros the size of a hut, which does not notice either of them.',
        ),
        N(
          'Your Nubbin does the last bit on the back of a startled antelope, and gets off as if it had meant to.',
        ),
        N(
          'Far behind you, Zazu flies straight into a flock of flamingos and does not come out the other side.',
        ),
        SI('We lost him! I am a genius!'),
        NA('I am a genius. It was my idea.'),
      ],
      [
        notice(
          2,
          'social-studies',
          'the Great Migration is a real journey across two countries',
          'D2.Geo.2.K-2',
          [
            N(
              'Real herds like this make one of the biggest journeys on Earth. Every year more than a million wildebeest, with zebra and gazelle, travel a great loop.',
            ),
            N(
              'They walk between the Serengeti in Tanzania and the Maasai Mara in Kenya, following the rains and the fresh grass. It is called the Great Migration.',
            ),
          ],
          'Learned about the Great Migration of wildebeest and zebra between Tanzania’s Serengeti and Kenya’s Maasai Mara.',
        ),
        ask(
          5,
          'maths',
          'multiplication as equal groups',
          '3.OA.A.1',
          [
            N(
              'Nala counts the zebra she ran through: 5 groups with 12 zebra in each group. How many zebra is that?',
            ),
          ],
          [
            o(
              '60',
              [N('Yes. Five groups of twelve: 12 + 12 + 12 + 12 + 12 = 60, or 5 × 12 = 60.')],
              true,
            ),
            o('17', [N('That is 5 + 12. We need five groups of twelve, so 5 × 12 = 60.')]),
            o('50', [
              N(
                'That is 5 × 10, which leaves out two zebra in every group. Five groups of twelve is 60.',
              ),
            ]),
          ],
          'Multiplied equal groups: 5 groups of 12 zebra = 60.',
        ),
      ],
      [
        {
          id: 'zazu',
          label: 'Tell them to go back for Zazu.',
          then: [SI('Zazu’s fine. Zazu’s always fine. He’ll find us. He finds everything.')],
        },
        {
          id: 'laugh',
          label: 'Laugh, because it was a bit funny.',
          then: [NA('See? The guest thinks we’re geniuses.')],
        },
        {
          id: 'water',
          label: 'Give them a drink from Rafiki’s gourd.',
          then: [
            N(
              'They drink as if they had run across a whole country. They have run across most of one.',
            ),
          ],
        },
      ],
    ),
    sc(
      'a23-05-chase-done',
      [
        N('Ahead of you, the grass stops.'),
        N('The ground goes grey and cracked, and steam leaks up out of it, hissing.'),
        N('Your Nubbin stops dead and sniffs, ready to bolt.'),
      ],
      [
        ask(
          1,
          'science',
          'steam and condensing: some changes can be reversed',
          '2-PS1-4',
          [
            N(
              'Real places like this exist. At Hell’s Gate in Kenya, rain soaks down to hot rock deep underground and comes back up as steam. If steam touches something cold, what does it turn back into?',
            ),
          ],
          [
            o(
              'Drops of liquid water',
              [
                N(
                  'Yes. Cooling steam condenses back into liquid water. Heating and cooling can change water back and forth.',
                ),
              ],
              true,
            ),
            o('Ice at once', [
              N(
                'It would need to get much colder for that. First, cooling steam turns back into water drops.',
              ),
            ]),
            o('Smoke', [
              N('Steam is not smoke: it is water. When it cools it becomes drops of water again.'),
            ]),
          ],
          'Learned that steam is water heated into a gas, and that it condenses back into liquid water when it cools.',
        ),
      ],
    ),
    sc(
      'a23-05-complete',
      [
        N(
          'A great curved rib sticks up out of the ground, white as chalk and taller than the baobab.',
        ),
        NA('Whoa.'),
        SI('This is it. The elephant graveyard. Told you.'),
        N(
          'Beyond the first rib there is another, and then a whole skull as big as a cottage, with mist curling out of its eyes.',
        ),
        N('Your Nubbin holds on to your leg and will not let go.'),
        Y('We should go back.'),
        SI('We’ve only just got here!'),
      ],
      [
        notice(
          3,
          'literacy',
          'telling a story’s belief from the real facts',
          'RL.3.6',
          [
            N(
              'Simba believes this is where elephants go to die. You may know better: in real life there is no elephant graveyard. That is a myth: an idea many people have believed that is not true.',
            ),
            N(
              'Real elephants do stay close to their families, and they are known to pause and touch the bones of elephants that have died. But they do not travel to one secret place.',
            ),
          ],
          'Told apart what a character believes (an elephant graveyard) from the real facts: it is a myth.',
        ),
        ask(
          6,
          'sel',
          'courage and turning back',
          G_DEC,
          [
            N(
              'You said “We should go back.” Simba said “We’ve only just got here!” Is turning back a brave thing to do? There is no one right answer.',
            ),
          ],
          [
            o('Yes: it takes courage to say no when your friends want to go on', [
              N(
                'That’s a fair answer. Saying the sensible thing when others will not listen is one of the hardest kinds of courage.',
              ),
            ]),
            o('No: being brave means going on', [
              N(
                'That’s a fair answer. Some people think so. But notice that going on without thinking is how the cubs got here.',
              ),
            ]),
            o('It depends how dangerous it is', [
              N('That’s a fair answer, and a wise one. Brave and sensible are good partners.'),
            ]),
          ],
          'Thought about whether turning back is brave, with no single right answer.',
        ),
      ],
    ),
  ],
  [
    gl('herd', 'A large group of animals that live and travel together.', 'a23-05-walk'),
    gl(
      'myth',
      'An idea that many people have believed but that is not true. (A myth can also mean a traditional story.)',
      'a23-05-complete',
    ),
  ],
);

// ================================================================== A23-6 The Graveyard
const Q6: EduQuest = quest(
  'a23-06',
  'The Graveyard',
  {
    'a23-06-s1': {
      goal: 'Keep the cubs together among the bones.',
      hint: 'Stay in the open between the ribs. Do not go into the skull.',
    },
    'a23-06-s2': {
      goal: 'Run! Get the cubs away through the ribs.',
      hint: 'Weave between the ribs and through the steam. Keep Nala and Simba ahead of you.',
    },
  },
  [
    sc(
      'a23-06-bones',
      [
        N(
          'Everything here is grey: the ground, the sky, the bones, and the steam that hisses out of the cracks.',
        ),
        N(
          'Simba walks straight up to the big skull and peers into its eye, as if he were knocking on a door.',
        ),
        SI('I’m going in. I’m not scared. Are you scared?'),
        NA('No. Are you?'),
        ZA(
          'Out. Out, out, out. This is the wrong side of the border by a very long way, and I would like to go home.',
        ),
        N('Somewhere inside the skull, somebody giggles. It is not a nice giggle.'),
        N('Three hyenas slink out of the skull’s eyes and mouth, grinning.'),
        SH('Banzai. Banzai, wake up. Lunch has come to us. That never happens.'),
        BA('It’s a bird, two cubs, a guest, and a… what is that? A walking egg?'),
        N('The third hyena, Ed, just laughs. He laughs and laughs, and does not stop.'),
      ],
      [
        notice(
          9,
          'science',
          'spotted hyenas live in clans and hunt for themselves',
          '3-LS2-1',
          [
            N(
              'The giggle is real. Spotted hyenas make giggling calls when they are excited or nervous, and a whooping call that carries a long way.',
            ),
            N(
              'They are not just thieves of other animals’ dinners. Spotted hyenas hunt much of their own food, and live in clans led by the females, who are larger than the males.',
            ),
          ],
          'Learned true facts about spotted hyenas: they giggle, hunt for much of their food, and live in clans led by females.',
        ),
      ],
      [
        {
          id: 'front',
          label: 'Step in front of the cubs.',
          then: [SH('Ooh, a brave one. Brave ones are chewy.')],
        },
        {
          id: 'coat',
          label: 'Pick up your Nubbin.',
          then: [N('It burrows into your coat until only its feet are showing.')],
        },
      ],
    ),
    sc(
      'a23-06-chase',
      [
        ZA('Run!'),
        N(
          'Zazu flies at the hyenas to slow them down. They catch him by the tail and stuff him head first into a heap of old bones.',
        ),
        N(
          'You run with a cub on either side, through ribs as tall as houses, round a jawbone, under a tusk.',
        ),
        N('Your Nubbin, still in your coat, kicks a hyena on the nose, and the snapping stops.'),
        NA('This way!'),
        N(
          'Nala finds a gap under a fallen tusk and squeezes through. Simba goes after her, and you go after him on your elbows.',
        ),
        N(
          'Then the slope of bones gives way, and all three of you slide down in a rattling grey heap.',
        ),
        BA('Nowhere to run now, cubs. Shame. I like the running bit.'),
        N(
          'Simba steps in front of Nala. He opens his mouth to roar, and what comes out is a squeak.',
        ),
        N(
          'Shenzi laughs, and Simba tries again. Then a roar comes, a real one, but it is not his.',
        ),
      ],
      [
        ask(
          9,
          'music',
          'bigger sound makers make deeper sounds',
          '1-PS4-1',
          [
            N(
              'Simba squeaks, and then a great deep roar answers. In general, which makes the deeper sound: a big, heavy animal, or a small, light one?',
            ),
          ],
          [
            o(
              'The big, heavy one',
              [
                N(
                  'Yes. Bigger voice boxes vibrate more slowly, which makes a lower note. A lion’s roar can carry for kilometres.',
                ),
              ],
              true,
            ),
            o('The small, light one', [
              N(
                'Small voice boxes vibrate faster, which makes a higher note: a squeak. The deep roar comes from something big.',
              ),
            ]),
          ],
          'Learned that bigger sound makers usually make deeper (lower) sounds, because they vibrate more slowly.',
        ),
      ],
      [
        {
          id: 'bone',
          label: 'Throw a bone to distract them.',
          then: [
            N(
              'Banzai turns to look at it, because he cannot help himself. It buys you one second.',
            ),
          ],
        },
        {
          id: 'stand',
          label: 'Stay in front of the cubs.',
          then: [N('Your knees are shaking. You stay put anyway.')],
        },
      ],
    ),
    sc(
      'a23-06-chase-done',
      [
        N(
          'The king comes down the slope of bones like a landslide, and the hyenas scatter like skittles.',
        ),
        MU('Never come near my son again.'),
        SH('Your son? Oh, your son! We didn’t know he was your son! Did you know, Banzai?'),
        N(
          'They don’t wait for an answer. Three hyenas vanish into the steam, Ed laughing all the way.',
        ),
      ],
      [
        ask(
          3,
          'health',
          'telling a grown-up where you are going keeps you safe',
          G_DEC,
          [
            N(
              'The cubs went somewhere new without telling a grown-up. What is the safest plan before going somewhere you have not been?',
            ),
          ],
          [
            o(
              'Tell a trusted grown-up where you are going, and go together',
              [
                N(
                  'Yes. If something goes wrong, somebody knows where to look. That is not boring: that is clever.',
                ),
              ],
              true,
            ),
            o('Go quickly so nobody notices', [
              N(
                'Going quietly is exactly how the cubs got into trouble. If someone knows where you are, help can reach you fast.',
              ),
            ]),
          ],
          'Learned a safety rule: tell a trusted grown-up where you are going.',
        ),
      ],
    ),
    sc(
      'a23-06-complete',
      [
        N(
          'Mufasa stands among the bones, breathing hard. He does not look at the hyenas; he looks at Simba.',
        ),
        SI('Dad, I…'),
        MU('Zazu. Take Nala home.'),
        MU('Guest, you will walk with us. Rafiki would never forgive me if I lost you on the way.'),
        N(
          'Zazu pulls himself out of the bones, straightens one feather, and goes without a single word. You have never known him do that.',
        ),
        N('Nala looks back at Simba all the way to the edge of the grey.'),
      ],
      [
        ask(
          4,
          'sel',
          'reading another’s silence',
          G_SOC,
          [
            N(
              'Zazu, who never stops talking, says nothing at all. Why do you think that is? There is no one right answer.',
            ),
          ],
          [
            o('He is shaken and frightened', [
              N('That’s a fair answer. Being scared can take the words right out of us.'),
            ]),
            o('He is cross, but is being careful what he says', [
              N(
                'That’s a fair answer. Sometimes we go quiet because we are afraid of saying the wrong thing.',
              ),
            ]),
            o('He is giving the family room', [
              N('That’s a fair answer. Knowing when to step back is a kind of respect.'),
            ]),
          ],
          'Thought about why a talkative character goes silent, with no single right answer.',
        ),
      ],
    ),
  ],
  [
    gl('clan', 'A group of hyenas that live together, as a lion pride does.', 'a23-06-bones'),
    gl('distract', 'To pull someone’s attention away from something.', 'a23-06-chase'),
  ],
);

// ================================================================== A23-7 Under the Stars
const Q7: EduQuest = quest(
  'a23-07',
  'Under the Stars',
  {
    'a23-07-s1': {
      goal: 'Walk home behind the king and his son, a little way off.',
      hint: 'Keep your distance. This is not your conversation, but you are not to get lost either.',
    },
    'a23-07-s2': {
      goal: 'Sit a little way off while the king talks with his son under the stars.',
      hint: 'Stay where you are and look up. Your Nubbin will try to count the stars.',
    },
  },
  [
    sc(
      'a23-07-dusk',
      [
        N(
          'The sun is going down by the time you are back on the plain. Mufasa walks ahead, and Simba walks in his footprints.',
        ),
        N(
          'Each of the king’s prints is bigger than the whole of Simba. He has to jump from one to the next.',
        ),
        N('You stay well back with your Nubbin. Nobody needs to tell you to.'),
        MU(
          'Simba. You disobeyed me. You put Nala in danger. Do you understand what could have happened?',
        ),
        SI('I only wanted to be like you. You’d have gone in.'),
        MU('Running towards trouble isn’t brave. It’s only running.'),
        SI('Nothing scares you. Nothing ever has.'),
        MU('When I saw them all round you, I was more frightened than I have ever been.'),
      ],
      [
        ask(
          1,
          'maths',
          'converting metres to centimetres',
          '4.MD.A.1',
          [
            N(
              'Say each of Mufasa’s strides is 1 metre. Simba jumps from print to print 6 times. How many centimetres has he jumped? (1 metre = 100 centimetres.)',
            ),
          ],
          [
            o(
              '600 cm',
              [N('Yes. Six jumps of 1 metre is 6 metres, and 6 × 100 = 600 centimetres.')],
              true,
            ),
            o('106 cm', [N('That is 6 + 100. Six jumps of 100 cm each is 6 × 100 = 600 cm.')]),
            o('60 cm', [
              N('That is 6 × 10. One metre is 100 cm, so six metres is 6 × 100 = 600 cm.'),
            ]),
          ],
          'Converted 6 metres to centimetres: 6 × 100 = 600.',
        ),
      ],
      [
        {
          id: 'stop',
          label: 'Stop walking, so they can go on alone.',
          then: [
            N('You sit down in the grass. The king glances back once and gives you a small nod.'),
          ],
        },
        {
          id: 'hold',
          label: 'Hold your Nubbin a bit tighter.',
          then: [N('It lets you. It doesn’t usually.')],
        },
      ],
    ),
    sc(
      'a23-07-dusk-done',
      [
        N(
          'The two of them stop on a low rise under the first stars. You sit down a little way off, with your Nubbin on your knee.',
        ),
        N(
          'The sky goes from orange to green to a deep blue, and the light is gone almost before you notice.',
        ),
      ],
      [
        ask(
          1,
          'science',
          'day length near the equator stays close to 12 hours',
          '1-ESS1-2',
          [
            N(
              'Dusk comes fast here because this part of Africa lies close to the equator. There, day and night are each about 12 hours long all year round. How does a summer day compare with a winter day there?',
            ),
          ],
          [
            o(
              'They are about the same length',
              [
                N(
                  'Yes. Near the equator the Sun’s path barely changes through the year, so days stay close to 12 hours.',
                ),
              ],
              true,
            ),
            o('Summer days are far longer', [
              N(
                'That is true far from the equator, like in the Grove. Near the equator, days are about 12 hours all year.',
              ),
            ]),
            o('Winter days are far longer', [
              N(
                'Winter days are shorter where there are seasons like ours. At the equator, they stay close to 12 hours all year.',
              ),
            ]),
          ],
          'Learned that near the equator day length stays about 12 hours all year.',
        ),
      ],
    ),
    sc(
      'a23-07-stars',
      [
        SI('Dad? Were you really frightened?'),
        MU(
          'I was frightened today. Being brave means being frightened and doing the right thing anyway.',
        ),
        N(
          'Simba thinks about that. Then he pounces on his father’s tail, and the king rolls him over in the grass, and they are both laughing.',
        ),
        SI('Dad? You’ll always be here, won’t you?'),
        N('Mufasa does not answer straight away. He lies down in the grass and looks up.'),
        MU(
          'Look at the stars, Simba. Those stars have shone on this plain since long before I was born.',
        ),
        MU('They watched over the lions before us. If ever you can’t find your way, look up.'),
        N('Simba looks up. On your knee, your Nubbin looks up too, with its mouth open.'),
        N('It starts counting the stars on its fingers, gives up, and just looks.'),
      ],
      [
        ask(
          8,
          'literacy',
          'using a new Swahili word in a sentence',
          'L.3.4',
          [
            N(
              'Nyota is the Swahili word for star. Which sentence uses it the way it should be used?',
            ),
          ],
          [
            o(
              '“Look at all the nyota in the night sky!”',
              [N('Yes. Nyota means star, so the nyota are the stars you see at night.')],
              true,
            ),
            o('“I had a nyota for breakfast.”', [
              N(
                'Stars are far too hot for breakfast! Nyota means star, so it belongs in the night sky.',
              ),
            ]),
            o('“The nyota is wet.”', [
              N('Stars are not wet. Nyota means star, so you look up to see it.'),
            ]),
          ],
          'Used the Swahili word nyota (star) in a sentence.',
        ),
        ask(
          8,
          'sel',
          'courage and fear',
          G_SOFT,
          [
            N(
              'Mufasa says being brave means being frightened and doing the right thing anyway. Can someone who is never frightened be brave? There is no one right answer.',
            ),
          ],
          [
            o('No: bravery needs fear to push against', [
              N(
                'That’s a fair answer. If nothing frightens you, nothing is asked of your courage. Many people say bravery starts where fear does.',
              ),
            ]),
            o('Yes: some people are just very bold', [
              N(
                'That’s a fair answer. Some people feel less fear than others. Mufasa’s point is that doing the right thing despite fear is a special kind of courage.',
              ),
            ]),
            o('Maybe, but only a bit', [
              N('That’s a fair answer, and an honest one. Courage is not all or nothing.'),
            ]),
          ],
          'Thought about whether someone who is never afraid can be brave, with no single right answer.',
        ),
      ],
      [
        {
          id: 'look',
          label: 'Look up with them.',
          then: [
            N(
              'The sky is so full of stars it looks as if it might spill. You look for a long time.',
            ),
          ],
        },
        {
          id: 'away',
          label: 'Look away, and let them have it to themselves.',
          then: [
            N('You look at the grass instead. Some moments should only have two people in them.'),
          ],
        },
        {
          id: 'point',
          label: 'Point out one star to your Nubbin.',
          then: [
            N(
              'You choose a bright one, low down. Your Nubbin looks at your finger, then at the star, then back at your finger.',
            ),
          ],
        },
      ],
    ),
    sc(
      'a23-07-complete',
      [
        N('Later, at the baobab, Rafiki is waiting up with a pot of tea that has gone cold.'),
        Y('The king said he was frightened today.'),
        RA(
          'Then he is a good king. The ones who are never frightened are the ones to be frightened of.',
        ),
        RA('Drink your tea. Cold tea is still tea. It is like most things that way.'),
        N(
          'Out of the window in the tree, far off on the shady side of the rock, a pair of green eyes is looking at nothing in particular.',
        ),
      ],
      [
        ask(
          3,
          'literacy',
          'the theme of a story',
          'RL.4.2',
          [N('What is the main message about courage in this chapter?')],
          [
            o(
              'Being brave means doing the right thing even when you are afraid',
              [
                N(
                  'Yes. Mufasa shows it in what he says, and Rafiki shows it in how he answers. That repeated idea is the theme.',
                ),
              ],
              true,
            ),
            o('Brave people never feel fear', [
              N(
                'The chapter says the opposite: even a king can be frightened. The brave part is what he does next.',
              ),
            ]),
            o('Only kings can be brave', [
              N('Look at Simba, Nala and even Zazu. Courage in this story is not just for kings.'),
            ]),
          ],
          'Identified the theme of a chapter: courage means acting rightly even when afraid.',
        ),
      ],
    ),
  ],
  [
    gl('equator', 'The imaginary line around the middle of the Earth.', 'a23-07-dusk-done'),
    gl('nyota', 'The Swahili word for star.', 'a23-07-stars'),
  ],
);

// ================================================================== A23-9 Run
const Q9: EduQuest = quest(
  'a23-09',
  'Run',
  {
    'a23-09-s1': {
      goal: 'Carry Zazu along the rim after the chase.',
      hint: 'Keep along the rim of the gorge and watch where Simba goes.',
    },
    'a23-09-s2': {
      goal: 'Choose: follow Simba into exile, or carry Zazu home to Rafiki’s tree.',
      hint: 'You can’t do both. Whichever you choose, the page goes on with you.',
    },
  },
  [
    sc(
      'a23-09-chase',
      [
        N(
          'The page turns to a gorge, a deep and rocky valley. A herd of wildebeest ran through it while you were on a ledge above, tending Zazu’s hurt wing.',
        ),
        N(
          'You did not see what happened below. Here is what the page tells you, plainly: Mufasa, the king and Simba’s father, died in the gorge.',
        ),
        N('Scar told Simba it was his fault. That was not true, but Simba believed him, and ran.'),
        N(
          'You scoop Zazu up, bad wing and all, and run along the rim, with your Nubbin bouncing on your back.',
        ),
        N(
          'Below, a small gold shape is scrambling up the side of the gorge, with three grey ones snapping at its heels.',
        ),
        SH('Get him! He’s getting away!'),
        N(
          'Simba reaches the top and runs flat out across the plain towards the border, where the thorn bushes grow as thick as walls.',
        ),
        N('He throws himself into the thorns and goes through. The hyenas stop dead at the edge.'),
        BA('In there? I’m not going in there. You go in there.'),
        SH(
          'Then let him go. There’s nothing out there. And if he ever comes back, we’ll be waiting.',
        ),
      ],
      [
        notice(
          2,
          'sel',
          'grief is made of many feelings; children are not to blame',
          G_SOFT,
          [
            N(
              'When someone we love dies, we may feel sad, numb, cross, frightened, or even guilty, all in one day. All of those feelings are normal.',
            ),
            N(
              'A child is never to blame for a grown-up’s death. If a feeling like guilt will not go away, talking to a trusted grown-up helps.',
            ),
          ],
          'Learned that grief brings many feelings, that none is wrong, and that talking to a trusted adult helps.',
        ),
      ],
      [
        {
          id: 'quiet',
          label: 'Keep still until they have gone.',
          then: [
            N(
              'You crouch in the grass with Zazu against your chest until the laughing is a long way off.',
            ),
          ],
        },
        {
          id: 'glare',
          label: 'Glare after them.',
          then: [N('They don’t see it. It makes you feel very slightly better anyway.')],
        },
      ],
    ),
    sc(
      'a23-09-chase-done',
      [
        N('The thorns are still shaking where Simba went through.'),
        N('Thorn bushes grow thick all along the border, with spikes as long as your finger.'),
        N('On the far side there is only dry country, as far as you can see.'),
      ],
      [
        ask(
          1,
          'science',
          'body parts help animals survive',
          '4-LS1-1',
          [
            N(
              'Thorns protect plants from being eaten. Yet giraffes still eat from thorny acacia trees. Which giraffe body part helps most?',
            ),
          ],
          [
            o(
              'A long, tough tongue and lips',
              [
                N(
                  'Yes. A giraffe’s tongue is nearly half a metre long and tough enough to slide between the thorns.',
                ),
              ],
              true,
            ),
            o('Its spots', [
              N(
                'Spots help with hiding, but they do not help with thorns. It is the long, tough tongue and lips.',
              ),
            ]),
            o('A short neck', [
              N(
                'A giraffe has the longest neck of any animal. Its long, tough tongue does the thorn work.',
              ),
            ]),
          ],
          'Learned that a giraffe’s long, tough tongue and lips help it eat from thorny trees.',
        ),
      ],
    ),
    sc(
      'a23-09-choice',
      [
        N(
          'You stand at the thorns with Zazu in your arms. Behind you are the Pride Lands; in front, a gap where a cub went through into exile.',
        ),
        ZA(
          'Somebody has to go with him. He’s a child. He doesn’t know anything. He doesn’t even know it wasn’t…',
        ),
        N('Zazu’s wing is bound, but he can’t fly, and he is shivering in the heat.'),
        ZA('And Rafiki will want to know. Somebody has to tell him. And the queen.'),
        N('Your Nubbin looks at the thorns, then at Zazu, then up at you.'),
        ZA('I can’t choose. I’m only a hornbill. You choose.'),
      ],
      [
        ask(
          5,
          'sel',
          'making a hard choice between two kind options',
          G_DEC,
          [
            N(
              'Both choices are kind, and you cannot do both. How would you decide? There is no one right answer.',
            ),
          ],
          [
            o('Go with whoever needs me most right now', [
              N(
                'That’s a fair answer. Asking “who needs me most?” is a good way to weigh a hard choice. The page will show you what comes of it.',
              ),
            ]),
            o('Go with the person who is on their own', [
              N(
                'That’s a fair answer. Being alone makes everything feel heavier. Though notice that Zazu would be alone too.',
              ),
            ]),
            o('Go where I can be most useful', [
              N(
                'That’s a fair answer. Useful is a good test. And notice that “useful” can look different to different people.',
              ),
            ]),
          ],
          'Thought about how to choose between two kind options, with no single right answer.',
        ),
      ],
      [
        {
          id: 'simba',
          label: 'Follow Simba through the thorns.',
          set: { 'a23-path': 'simba' },
          then: [
            ZA(
              'Yes. Go. Put me down under that bush. I’ll limp home. Hornbills are excellent at limping.',
            ),
            N(
              'You leave him in the shade with half the water in your gourd, and push into the thorns after the cub.',
            ),
          ],
        },
        {
          id: 'rafiki',
          label: 'Carry Zazu home to Rafiki’s tree.',
          set: { 'a23-path': 'rafiki' },
          then: [
            ZA('Rafiki. Yes. He’ll know what to do. He always knows. It’s infuriating.'),
            N(
              'You turn your back on the thorns. It is the hardest thing you have done in a long while.',
            ),
          ],
        },
      ],
    ),
    sc(
      'a23-09-complete',
      [
        N('Behind you, the sun is going down red over the gorge.'),
        N('The page lets go of the day very slowly, as if it, too, wishes it had not happened.'),
        N('Whichever way you chose, you will think about the other way for a long time.'),
        N('Your Nubbin has its hand in yours. It does not let go once.'),
      ],
      [
        ask(
          1,
          'literacy',
          'personification',
          'L.4.5',
          [
            N(
              '“The page lets go of the day very slowly, as if it, too, wishes it had not happened.” What is the writer doing here?',
            ),
          ],
          [
            o(
              'Giving the page human feelings, called personification',
              [
                N(
                  'Yes. A page cannot wish anything, but giving it a feeling helps us feel how heavy the day was.',
                ),
              ],
              true,
            ),
            o('Giving a fact about pages', [
              N(
                'It sounds like a fact, but pages do not wish. The writer is giving the page a human feeling, called personification.',
              ),
            ]),
          ],
          'Recognised personification: a page given a human feeling.',
        ),
      ],
    ),
  ],
  [
    gl(
      'exile',
      'Being sent away, or running away, from your home, and not being able to go back.',
      'a23-09-choice',
    ),
    gl('personification', 'Describing a thing as if it had human feelings.', 'a23-09-complete'),
  ],
);

// ================================================================== A23-10 The Desert
const Q10: EduQuest = quest(
  'a23-10',
  'The Desert',
  {
    'a23-10-s1': {
      goal: 'Get through the first long day after the gorge.',
      hint: 'Stay with whoever you chose. Walk when they walk, and rest when they rest.',
    },
    'a23-10-s2': {
      goal: 'See the evening in, whatever it brings.',
      hint: 'Stay close. Help is coming, one way or another.',
    },
  },
  [
    sc(
      'a23-10-desert',
      [
        N(
          'Beyond the thorns the ground goes from grass to scrub to nothing: just orange sand, and the sun sitting on it.',
        ),
        N(
          'Simba walks ahead of you and does not look back. When you catch him up, he will not look at you either.',
        ),
        SI('Go home. You don’t have to come. Nobody has to come.'),
        Y('I know.'),
        N('You keep walking beside him anyway. After a while he stops telling you to go.'),
        N(
          'Your Nubbin walks in Simba’s footprints, the way Simba walked in his father’s, jumping from one to the next.',
        ),
        N(
          'Your gourd held 6 cups of water at sunrise. Simba drinks 2, you drink 1, and you give him the rest at noon.',
        ),
        N(
          'Then there is no water at all. He walks until he can’t, and then he lies down in the sand.',
        ),
      ],
      [
        ask(
          6,
          'maths',
          'two subtractions in a row',
          '2.OA.A.1',
          [
            N(
              'The gourd held 6 cups. Simba drank 2 and you drank 1. How many cups are left to give him at noon?',
            ),
          ],
          [
            o('3 cups', [N('Yes. 6 − 2 = 4, and 4 − 1 = 3. You give him the last 3 cups.')], true),
            o('4 cups', [N('That is only 6 − 2. You drank 1 as well: 4 − 1 = 3 cups.')]),
            o('5 cups', [
              N('That is only 6 − 1. Simba drank 2, and you drank 1: 6 − 2 − 1 = 3 cups.'),
            ]),
          ],
          'Solved a two-step subtraction problem: 6 − 2 − 1 = 3.',
        ),
      ],
      [
        {
          id: 'shade',
          label: 'Make shade over him with your coat.',
          then: [
            N(
              'You hold your coat up over him. It is not much, but it is a square of shade, and he crawls into it.',
            ),
          ],
        },
        {
          id: 'sit',
          label: 'Sit down next to him and wait.',
          then: [N('You sit down next to him, and wait. He puts his chin on your boot.')],
        },
      ],
    ),
    sc(
      'a23-10-desert-done',
      [
        N(
          'Above you, shapes begin to circle: vultures, big and patient, riding the hot air round and round.',
        ),
        N(
          'Your Nubbin stands up on Simba’s back and shakes its tiny gourd at them, furiously. It doesn’t help, but it is very brave.',
        ),
      ],
      [
        notice(
          0,
          'science',
          'vultures glide on rising warm air; they are nature’s clean-up crew',
          '4-LS1-1',
          [
            N(
              'Vultures hardly flap. The Sun heats the ground, the ground heats the air above it, and warm air rises in columns called thermals.',
            ),
            N(
              'Wide wings let a vulture glide in circles on a thermal for hours, searching with very sharp eyes. They clean up what has already died, which helps stop disease spreading.',
            ),
          ],
          'Learned that vultures glide on rising warm air (thermals) and act as nature’s clean-up crew.',
        ),
      ],
    ),
    sc(
      'a23-10-help',
      [
        N(
          'Then, from the scrub, there is a shout, and a warthog comes charging out of it with a meerkat on his back.',
        ),
        TI('Charge! Get out of here, you feathery freeloaders! Shoo! Go and bother a rhinoceros!'),
        N(
          'The vultures scatter. The warthog skids to a halt beside you, puffing, and the meerkat hops down.',
        ),
        PU('Oh, look, Timon. A little lion. He’s so tiny. And somebody with him. Can we keep him?'),
        TI('Pumbaa, are you out of your mind? …Fine. Fine! But I’m not carrying him.'),
      ],
      [
        ask(
          4,
          'sel',
          'thanks and what we owe each other',
          G_REL,
          [
            N(
              'Timon says thanking someone means that next thing you know, you owe them. Do you think he is right? There is no one right answer.',
            ),
          ],
          [
            o('No: thanking someone is just being kind', [
              N(
                'That’s a fair answer. A thank you is a gift, not a debt. Many people feel that is exactly what it should be.',
              ),
            ]),
            o('Partly: helping each other makes us a little connected', [
              N(
                'That’s a fair answer. When we help each other we do feel connected. The question is whether that is a trap, or the point.',
              ),
            ]),
            o('Yes: it is safer to owe nothing to anyone', [
              N(
                'That’s a fair answer. Timon has been burned before, and it shows. But notice that he rescues you anyway.',
              ),
            ]),
          ],
          'Thought about whether thanking someone creates a debt, with no single right answer.',
        ),
      ],
      [
        {
          id: 'thank',
          label: 'Thank them.',
          then: [
            TI(
              'Don’t thank us. Thanking is how they get you. Next thing you know, you owe somebody.',
            ),
          ],
        },
        {
          id: 'guest',
          label: 'Explain that you’re only a guest here.',
          then: [PU('That’s okay. Everybody’s a guest somewhere.')],
        },
      ],
    ),
    sc(
      'a23-10-complete',
      [
        N(
          'Pumbaa carries Simba on his back to a shady bank by a stream. You carry your Nubbin, and Timon carries nothing at all.',
        ),
        N('Simba drinks and drinks. Then he sits with his back to everyone.'),
        TI('So, kid. What’s your story?'),
        SI('I don’t have one. Not any more.'),
        TI('No story! Great! Neither have we. Well, we have one, but it’s mostly about bugs.'),
        PU('Did something happen, kid?'),
        SI('Yes. It was my fault. Please don’t ask me.'),
        N('Pumbaa looks at you. You shake your head, very slightly, and he doesn’t ask again.'),
      ],
      [
        ask(
          3,
          'literacy',
          'what a character’s words really mean',
          'RL.3.3',
          [N('Simba says “I don’t have a story. Not any more.” What do you think he means?')],
          [
            o(
              'He feels his old life has been cut off, and he cannot talk about it',
              [
                N(
                  'Yes. Everyone has a story, so “not any more” means he has shut the old one away. It hurts too much to tell.',
                ),
              ],
              true,
            ),
            o('He is bored', [
              N(
                'He is not bored; he looks away and answers quietly. His words are a way of saying “please do not ask”.',
              ),
            ]),
            o('He is making a joke', [
              N(
                'Timon makes a joke back, but Simba is not joking: he turns his back to everyone. He is hiding something painful.',
              ),
            ]),
          ],
          'Inferred what a character really means when he says he has no story.',
        ),
      ],
    ),
  ],
  [
    gl(
      'thermal',
      'A column of warm air that rises, which big birds glide on.',
      'a23-10-desert-done',
    ),
    gl('scrub', 'Dry land covered in low bushes and thorny plants.', 'a23-10-desert'),
  ],
);

// ================================================================== A23-11 No Worries
const Q11: EduQuest = quest(
  'a23-11',
  'No Worries',
  {
    'a23-11-s1': {
      goal: 'Live through the long seasons that come next.',
      hint: 'The page turns the years over for you. Stay with whoever you are with.',
    },
    'a23-11-s2': {
      goal: 'See what supper looks like now.',
      hint: 'Go where the others are gathering, and take what you’re offered.',
    },
  },
  [
    sc(
      'a23-11-oasis',
      [
        N(
          'Timon and Pumbaa live in a green place beyond the desert: waterfalls, ferns, logs, and more bugs than seems reasonable.',
        ),
        TI(
          'Make yourself at home. Our home, technically. Look at this log. Is that a log, or is that a log?',
        ),
        PU('It’s a log.'),
        TI(
          'Kid, listen. Bad thing happened? Fine. Don’t look at it. Look at something else. Look at the log.',
        ),
        PU('Hakuna matata.'),
        SI('What?'),
        PU(
          'It’s Swahili. Folks say it when the fruit falls off the tree before you can catch it. Roughly: no worries.',
        ),
        TI(
          'We say it all the time. Bug in your ear? Rain? Stuck in a hole? Well. That one’s trickier.',
        ),
        N(
          'Simba says it to himself under his breath, trying it out. It is the first time since the gorge you have seen him smile.',
        ),
        N(
          'Your Nubbin says nothing, of course. But it lies down on the log next to Simba, and that seems to help.',
        ),
      ],
      [
        ask(
          3,
          'sel',
          'looking away from a problem, and when it helps',
          G_MAN,
          [
            N(
              'Timon’s advice is “Don’t look at the bad thing. Look at the log.” When might that help, and when might it not? There is no one right answer.',
            ),
          ],
          [
            o('It helps for a short while, when you need a rest from the feeling', [
              N(
                'That’s a fair answer. A break from a big feeling is useful. Many people find they cope better after one.',
              ),
            ]),
            o('It does not help if the problem is still there', [
              N(
                'That’s a fair answer. A problem you do not look at tends to be waiting for you. Facing it, with help, is often the way through.',
              ),
            ]),
            o('It depends whether you ever go back and look', [
              N(
                'That’s a fair answer, and a wise one. A rest is good. A hiding place is something else.',
              ),
            ]),
          ],
          'Thought about when looking away from a problem helps and when it does not, with no single right answer.',
        ),
        ask(
          6,
          'literacy',
          'working out a phrase from its parts',
          'L.3.4',
          [
            N(
              'In Swahili, hakuna means “there is no” and matata means “troubles”. Word for word, what does hakuna matata mean?',
            ),
          ],
          [
            o(
              'There are no troubles',
              [
                N(
                  'Yes. “Roughly: no worries,” as Pumbaa says. It is an everyday phrase that Swahili speakers use in many small moments.',
                ),
              ],
              true,
            ),
            o('Good night', [
              N(
                'Good night is a different phrase. Hakuna is “there is no” and matata is “troubles”: there are no troubles.',
              ),
            ]),
          ],
          'Worked out the meaning of the everyday Swahili phrase hakuna matata (there are no troubles) from its two words.',
        ),
      ],
      [
        {
          id: 'say',
          label: 'Try saying it yourself.',
          then: [
            PU('Perfect! You’re a natural! No worries at all!'),
            N('That isn’t true, but it is nice to hear.'),
          ],
        },
        {
          id: 'watch',
          label: 'Keep quiet and watch Simba.',
          then: [N('He’s smiling. It doesn’t quite reach his eyes yet.')],
        },
      ],
    ),
    sc(
      'a23-11-oasis-done',
      [
        N(
          'The page turns its seasons over, one after another, like somebody leafing through a book to find their place.',
        ),
        N(
          'Simba gets bigger, and so do his paws. A mane comes in, scruffy at first, then thick and dark gold.',
        ),
        N(
          'You and your Nubbin don’t change at all. The atlas keeps your time for you, and nobody here seems to mind.',
        ),
      ],
      [
        ask(
          1,
          'science',
          'a life cycle in order',
          '3-LS1-1',
          [
            N(
              'Put a male lion’s life in order, from the start: a full dark mane, a tiny cub, a scruffy first mane.',
            ),
          ],
          [
            o(
              'Tiny cub, scruffy first mane, full dark mane',
              [
                N(
                  'Yes. Like all living things, a lion changes in a pattern: young, growing up, grown.',
                ),
              ],
              true,
            ),
            o('Full dark mane, tiny cub, scruffy first mane', [
              N(
                'A lion does not start with a full mane! It begins as a tiny cub, grows a scruffy first mane, and the mane fills in.',
              ),
            ]),
          ],
          'Put the stages of a male lion’s life in order.',
        ),
      ],
    ),
    sc(
      'a23-11-grubs',
      [
        N(
          'Supper is under a log. Pumbaa rolls it over, and underneath is a wriggling crowd of grubs, beetles and worse.',
        ),
        TI(
          'The slimy ones are tasty. The crunchy ones are… also tasty. They’re all tasty, if you don’t think about it.',
        ),
        SI('You get used to it. Honestly.'),
        N('Timon keeps a tally of what Simba ate for breakfast: slimy 4, crunchy 6, wriggly 3.'),
        N('Your Nubbin looks at the grub Pumbaa is offering it. It looks at you.'),
        N('Then it turns its back on the grub, folds its arms, and sits down with a thump.'),
        PU('That’s okay, little guy. More for me.'),
      ],
      [
        ask(
          3,
          'maths',
          'adding three numbers',
          '2.OA.A.1',
          [
            N(
              'Timon’s tally says slimy 4, crunchy 6, wriggly 3. How many bugs did Simba eat altogether?',
            ),
          ],
          [
            o('13', [N('Yes. 4 + 6 = 10, and 10 + 3 = 13 bugs.')], true),
            o('10', [N('That is only slimy and crunchy: 4 + 6 = 10. Add the 3 wriggly ones: 13.')]),
            o('14', [N('Close! Add them step by step: 4 + 6 = 10, and 10 + 3 = 13.')]),
          ],
          'Added 4 + 6 + 3 to find 13 bugs altogether.',
        ),
      ],
      [
        {
          id: 'fig',
          label: 'Find your Nubbin a fig instead.',
          then: [
            N(
              'You find a wild fig in the ferns. Your Nubbin eats the whole thing, then looks at the grubs smugly.',
            ),
          ],
        },
        {
          id: 'try',
          label: 'Try a grub yourself, to be polite.',
          then: [
            N('It’s crunchy, and then it’s something else. You swallow anyway.'),
            TI('Look at that face! That’s the face of someone who’s gonna love bugs!'),
          ],
        },
      ],
    ),
    sc(
      'a23-11-complete',
      [
        N('That night all of you lie on your backs on a log and look up at the stars.'),
        PU('I always thought they were other warthogs’ campfires. Far away. Having a nice time.'),
        SI(
          'Somebody told me once that they’re all the old kings. Up there. Keeping an eye on things.',
        ),
        TI('Kings? In the sky? Who’s been feeding you that?'),
        SI('Nobody. It doesn’t matter.'),
        N(
          'He turns over, away from the sky. Your Nubbin keeps looking at the stars long after everyone else has stopped.',
        ),
      ],
      [
        notice(
          3,
          'social-studies',
          'people in different places tell different stories about the stars',
          'D2.His.2.K-2',
          [
            N(
              'Pumbaa has one story about the stars, and Simba has another. People all over the world have told stories about them.',
            ),
            N(
              'Long before maps and clocks, people used the stars to find their way at night and to know when the seasons were turning.',
            ),
          ],
          'Learned that people everywhere told stories about the stars and used them to find their way.',
        ),
      ],
    ),
  ],
  [
    gl('tally', 'A count kept by writing down one mark for each thing.', 'a23-11-grubs'),
    gl(
      'hakuna matata',
      'An everyday Swahili phrase that means “there are no troubles”.',
      'a23-11-oasis',
    ),
  ],
);

// ================================================================== A23-12 Nala
const Q12: EduQuest = quest(
  'a23-12',
  'Nala',
  {
    'a23-12-s1': {
      goal: 'Be there when the hunter in the long grass finds the warthog.',
      hint: 'Keep near the stream at the edge of the green place, and keep your Nubbin close.',
    },
    'a23-12-s2': {
      goal: 'Give Simba and Nala some room, and stay within call.',
      hint: 'Wait by the waterfall with Timon and Pumbaa. This is between the two of them.',
    },
  },
  [
    sc(
      'a23-12-hunt',
      [
        N(
          'One afternoon Pumbaa is snuffling for beetles by the stream when he stops with one ear up.',
        ),
        PU('Did anybody else hear a… swishy noise? A big swishy noise?'),
        N(
          'The long grass on the far bank is moving against the wind. Your Nubbin goes rigid on your shoulder.',
        ),
        N('A lioness comes out of the grass at a run, low and fast, straight at Pumbaa.'),
        PU('Aaagh! She’s gonna eat me!'),
        TI('Hey! Not him! Eat… eat the guest! Eat the dumpling!'),
        N(
          'Simba comes crashing out of the ferns and meets her in mid-leap. They roll over and over in the mud.',
        ),
        N(
          'She pins him. She knows exactly where to put her paws, and she has pinned him like that before.',
        ),
        SI('Nala?'),
      ],
      [
        notice(
          4,
          'science',
          'warthogs run with their tails up and kneel to eat',
          '4-LS1-1',
          [
            N(
              'Look at Pumbaa’s tail: it stands straight up when he runs. Warthogs really do that.',
            ),
            N(
              'They also drop onto their front “knees” (really their wrists) to graze, and they shelter in burrows.',
            ),
          ],
          'Learned true facts about warthogs: tails up when they run, kneeling to graze, sheltering in burrows.',
        ),
      ],
      [
        {
          id: 'hold',
          label: 'Hold on to your Nubbin.',
          then: [N('It wants to go and help. You hold on to it anyway.')],
        },
        {
          id: 'pumbaa',
          label: 'Pull Pumbaa out of the way.',
          then: [PU('My hero!'), N('He hugs you. He is very heavy.')],
        },
      ],
    ),
    sc(
      'a23-12-hunt-done',
      [
        NA('Simba? It is you! But everyone thinks you’re…'),
        N(
          'Then she sees you, standing in the stream with your Nubbin, and her eyes go wide all over again.',
        ),
        NA('Rafiki’s guest? You’ve been with him? All this time?'),
      ],
      [
        ask(
          0,
          'literacy',
          'why a writer leaves a sentence unfinished',
          'RL.3.3',
          [
            N(
              'Nala says “everyone thinks you’re…” and does not finish. Why might the writer leave the sentence hanging?',
            ),
          ],
          [
            o(
              'Nala is too shocked to finish, and we can fill in the gap',
              [
                N(
                  'Yes. An unfinished sentence shows a character’s feelings and lets the reader do some work. We know what she means.',
                ),
              ],
              true,
            ),
            o('The writer ran out of words', [
              N('Writers choose these breaks on purpose. The break shows how stunned Nala is.'),
            ]),
          ],
          'Noticed that an unfinished sentence can show a character’s shock and lets the reader fill in the gap.',
        ),
      ],
    ),
    sc(
      'a23-12-talk',
      [
        N(
          'The two lions walk off along the stream together, shoulders touching. Timon watches them go with his mouth open.',
        ),
        TI('I don’t like where this is going. I can feel it in my fur: she’s gonna take him away.'),
        PU('Maybe she’s nice.'),
        TI('That’s worse!'),
        N(
          'Later, under the waterfall, you hear them talking. Their voices carry over the water whether you want them to or not.',
        ),
        NA(
          'The herds are gone. The river’s mud. Scar sits on the rock, and the hyenas eat whatever’s left. We’re hungry, Simba. All of us.',
        ),
        SI('I can’t go back.'),
        NA('Why not? It’s yours. It was always going to be yours.'),
        SI('Not any more. Anyway, it doesn’t matter. No worries.'),
        NA('What?'),
        SI('You stop thinking about the things you can’t change. It’s easier.'),
        NA('I used to think you’d be better at this than anyone.'),
      ],
      [
        ask(
          5,
          'science',
          'the water cycle and why rivers dry up',
          '3-ESS2-1',
          [
            N(
              'Nala says the river has turned to mud. A river is refilled by rain. What happens to a river when there is no rain for a very long time?',
            ),
          ],
          [
            o(
              'The Sun dries it up faster than it is refilled',
              [
                N(
                  'Yes. Water warms, rises into the air as vapour, and has to come back as rain to refill the river. When the rain stops, the river shrinks.',
                ),
              ],
              true,
            ),
            o('Nothing, rivers never change', [
              N(
                'Rivers can change a lot. A river needs rain to refill it. When rain stops, the Sun keeps drying it and it shrinks to mud.',
              ),
            ]),
          ],
          'Learned that rivers need rain to refill them, and shrink when the rain stops.',
        ),
        ask(
          10,
          'sel',
          'whether it helps to stop thinking about what we cannot change',
          G_MAN,
          [
            N(
              'Simba says “You stop thinking about the things you can’t change. It’s easier.” Is it easier? Is it better? There is no one right answer.',
            ),
          ],
          [
            o('It is easier for a while, but not better', [
              N(
                'That’s a fair answer. Pushing a thought away can feel like a rest. But thoughts we push away have a way of coming back louder.',
              ),
            ]),
            o('Yes, some things really cannot be changed', [
              N(
                'That’s a fair answer. Accepting what you cannot change is wise. The trick is knowing which things those really are.',
              ),
            ]),
            o('No, you can change how you carry it', [
              N(
                'That’s a fair answer, and Nala seems to think so too. Even if we cannot change what happened, we can change what we do next.',
              ),
            ]),
          ],
          'Thought about whether it helps to stop thinking about what cannot be changed, with no single right answer.',
        ),
      ],
      [
        {
          id: 'stay',
          label: 'Stay with Timon and Pumbaa, and let them talk.',
          then: [N('Pumbaa hands you a beetle, as comfort. You hold it, as comfort.')],
        },
        {
          id: 'nubbin',
          label: 'Let your Nubbin go to Nala.',
          then: [
            N(
              'It trots over and sits down beside her. She puts a paw round it without looking, the way you would with a cub.',
            ),
          ],
        },
      ],
    ),
    sc(
      'a23-12-complete',
      [
        N('When they come back, Nala will not look at Simba, and Simba will not look at anybody.'),
        NA('Tell him. You were there. Tell him he has to come home.'),
        SI('Leave them out of this.'),
        N(
          'It is 7:45 in the evening. He walks off into the dark, alone, with his head down. After a moment, you follow.',
        ),
        TI('Kid! Where you going? No worries! …A little bit of worries?'),
      ],
      [
        ask(
          3,
          'maths',
          'time intervals',
          '3.MD.A.1',
          [
            N(
              'Simba walked off at 7:45 pm and you caught up with him on the ridge at 9:10 pm. How long was that?',
            ),
          ],
          [
            o(
              '1 hour 25 minutes',
              [
                N(
                  'Yes. 7:45 to 8:45 is 1 hour, then 15 minutes to 9:00 and 10 more to 9:10: 1 hour 25 minutes.',
                ),
              ],
              true,
            ),
            o('1 hour 35 minutes', [
              N(
                'Close. 7:45 to 9:00 is 1 hour 15 minutes, and 9:00 to 9:10 is 10 more: 1 hour 25 minutes.',
              ),
            ]),
            o('2 hours 25 minutes', [
              N(
                'That is an hour too many. From 7:45 pm to 8:45 pm is one hour, so the total is 1 hour 25 minutes.',
              ),
            ]),
          ],
          'Found a time interval: from 7:45 to 9:10 is 1 hour 25 minutes.',
        ),
      ],
    ),
  ],
  [
    gl('vapour', 'Water in the air as a gas you cannot see.', 'a23-12-talk'),
    gl('graze', 'To eat grass.', 'a23-12-hunt'),
  ],
);

// ================================================================== A23-13 The Wind
const Q13: EduQuest = quest(
  'a23-13',
  'The Wind',
  {
    'a23-13-s1': {
      goal: 'Get through the night after Nala’s news.',
      hint: 'Keep going. Stay with whoever needs you most tonight.',
    },
    'a23-13-s2': {
      goal: 'Watch where the wind goes.',
      hint: 'Keep still, and follow the dust with your eyes.',
    },
  },
  [
    sc(
      'a23-13-ridge',
      [
        N(
          'Simba walks until the trees thin out, then climbs a bare ridge above the green place. You climb after him.',
        ),
        N(
          'The sky up here is enormous, and every star is out. He does not look up at any of them.',
        ),
        SI('You were there. At the gorge. You know what I did.'),
        Y('I was up on the ledge with Zazu. I didn’t see what happened down below.'),
        SI(
          'It doesn’t matter. He’s gone, and it was my fault, and nothing changes it. So why go back?',
        ),
        SI('My father told me to look up if I ever got lost. Well, I’m lost. Where are you?'),
        N('He isn’t talking to you any more. He’s talking to the sky.'),
        N('Then he throws himself down on the ridge with a thump.'),
      ],
      [
        ask(
          4,
          'sel',
          'blame that does not belong to us',
          G_SOC,
          [N('Simba says “it was my fault.” What is the kindest true thing you could tell him?')],
          [
            o(
              'A terrible thing happening does not mean you caused it, and Scar was wrong to tell you so',
              [
                N(
                  'Yes. Blaming ourselves for something that was not ours to carry is a heavy mistake. Hearing it said plainly, and kindly, can lift some of the weight.',
                ),
              ],
              true,
            ),
            o('Everybody makes mistakes', [
              N(
                'That is kind, but it quietly agrees that he made one. Here, the blame was handed to him by someone else.',
              ),
            ]),
            o('Don’t think about it', [
              N(
                'We cannot switch off a thought on request. It helps more to tell the truth, kindly, and to stay beside him.',
              ),
            ]),
          ],
          'Practised comforting a friend who blames himself for something that was not his fault.',
        ),
      ],
      [
        {
          id: 'wait',
          label: 'Sit down next to him and wait.',
          then: [N('You sit down next to him, and he doesn’t tell you to go. That is something.')],
        },
        {
          id: 'fault',
          label: 'Tell him it wasn’t his fault.',
          then: [
            SI('You don’t know that. You weren’t looking. You said so.'),
            N('He’s right: you weren’t. You don’t take it back, though.'),
          ],
        },
      ],
    ),
    sc(
      'a23-13-ridge-done',
      [
        N('A puff of dust and loose fur goes up from where he landed. The wind catches it.'),
        N('Wind is a force, and light things go where it pushes them.'),
      ],
      [
        ask(
          1,
          'science',
          'wind is a force that moves light things further',
          '3-PS2-1',
          [
            N(
              'The wind carries dust and fur away. Which would it carry farther: a dandelion seed or a pebble?',
            ),
          ],
          [
            o(
              'The dandelion seed',
              [
                N(
                  'Yes. A force moves a light thing farther than a heavy thing. That is how dandelions spread their seeds on the wind.',
                ),
              ],
              true,
            ),
            o('The pebble', [
              N(
                'A pebble is far heavier, so the same wind barely moves it. The light dandelion seed travels farther.',
              ),
            ]),
          ],
          'Learned that the same wind force moves light things farther than heavy ones.',
        ),
      ],
    ),
    sc(
      'a23-13-wind',
      [
        N(
          'The little cloud of fur and dust lifts off the ridge, turns over once, and goes up into the night.',
        ),
        N(
          'It drifts out over the green place and the desert beyond it, getting smaller, heading the way you came.',
        ),
        N(
          'Your Nubbin stands on its toes and watches it until it is only a dot against the stars, and then not even that.',
        ),
        SI('What are you looking at?'),
        N(
          'You don’t really know. Simba doesn’t ask again; he has gone back to not looking at anything.',
        ),
        N('The wind smells of dust and, very faintly, of home.'),
      ],
      [
        ask(
          4,
          'sel',
          'why we stop looking at the world when we are sad',
          G_SOFT,
          [
            N(
              'Simba has gone back to “not looking at anything”. When we are very sad, why might we stop noticing the world around us? There is no one right answer.',
            ),
          ],
          [
            o('The sadness takes up all the room in our heads', [
              N(
                'That’s a fair answer. A big feeling can fill the whole inside of us, leaving no room for anything else.',
              ),
            ]),
            o('We are protecting ourselves from more hurt', [
              N(
                'That’s a fair answer. Switching off can feel safer. It also means we miss the things that could help.',
              ),
            ]),
            o('We are tired', [
              N(
                'That’s a fair answer. Sadness is tiring, and a tired mind stops reaching outwards. Rest helps, and so does company.',
              ),
            ]),
          ],
          'Thought about why sadness makes us stop noticing the world, with no single right answer.',
        ),
        ask(
          5,
          'literacy',
          'reading hints about what will happen',
          'RL.3.3',
          [
            N(
              'The fur drifts back the way you came, and the wind smells faintly of home. What might the writer be hinting?',
            ),
          ],
          [
            o(
              'That something from home may be coming for Simba',
              [
                N(
                  'Yes. Writers plant small hints like this, called foreshadowing, so that later events feel earned. The wind is carrying a message.',
                ),
              ],
              true,
            ),
            o('That Simba is about to fall asleep', [
              N(
                'Not quite. The wind smells of home, and the fur heads home. Those hints point towards a journey, not sleep.',
              ),
            ]),
          ],
          'Noticed a hint about what will happen next (foreshadowing).',
        ),
      ],
      [
        {
          id: 'nubbin',
          label: 'Watch it go with your Nubbin.',
          then: [
            N('You watch together until there is nothing left to watch, and then a little longer.'),
          ],
        },
        {
          id: 'simba',
          label: 'Watch Simba instead.',
          then: [N('He’s pretending to be asleep. He isn’t very good at it.')],
        },
      ],
    ),
    sc(
      'a23-13-complete',
      [
        N(
          'Late in the night, from down in the ferns, comes a noise. Somebody is humming, very badly, and getting closer.',
        ),
        N('Then a voice, cheerful and slightly mad, from the top of a tree.'),
        RA(
          'There you are! I have been looking all over the page for you. You and your small one. Asante, for staying with him.',
        ),
        N('Rafiki: older, greyer, with burrs in his beard from crossing the desert.'),
        Y('How did you find us?'),
        RA('The wind told me. The wind is a terrible gossip.'),
      ],
      [
        ask(
          0,
          'music',
          'pitch: higher notes vibrate faster',
          '1-PS4-1',
          [
            N(
              'Rafiki hums badly. Put a hand on your throat and hum a low note, then a high one. When you hum a higher note, how do your vocal cords vibrate?',
            ),
          ],
          [
            o(
              'Faster',
              [
                N(
                  'Yes. High notes are fast vibrations, low notes are slow ones. That difference is what we hear as pitch.',
                ),
              ],
              true,
            ),
            o('Slower', [
              N(
                'It is the other way round: slow vibrations make low notes, and fast ones make high notes.',
              ),
            ]),
            o('They do not move', [
              N(
                'They do! That buzz you feel in your throat is the vibration. Faster buzz, higher note.',
              ),
            ]),
          ],
          'Learned that pitch depends on vibration: faster vibrations make higher notes.',
        ),
      ],
    ),
  ],
  [
    gl('foreshadowing', 'A hint in a story about what will happen later.', 'a23-13-wind'),
    gl('pitch', 'How high or low a sound is.', 'a23-13-complete'),
  ],
);

// ================================================================== A23-14 Look Harder
const Q14: EduQuest = quest(
  'a23-14',
  'Look Harder',
  {
    'a23-14-s1': {
      goal: 'Watch Rafiki find Simba in the green place.',
      hint: 'Stay back among the ferns. Rafiki has his own way of doing this.',
    },
    'a23-14-s2': {
      goal: 'Follow Rafiki through the roots to the still pool.',
      hint: 'Keep up with him through the tangle. Duck under the roots and listen for his stick.',
    },
    'a23-14-s3': {
      goal: 'Look up at the clouds.',
      hint: 'Stand still and look up. Don’t say anything.',
    },
  },
  [
    sc(
      'a23-14-find',
      [
        N(
          'In the morning Simba is sitting by himself at the edge of the trees. Rafiki walks up and sits down beside him.',
        ),
        N(
          'He doesn’t say anything at all. He picks a burr out of his beard and looks at the view.',
        ),
        SI('What? Who are you? What do you want?'),
        RA('Nothing. I am sitting. You can sit too. It is free.'),
        N(
          'Simba gets up and moves along. Rafiki gets up, moves along with him, and sits down again.',
        ),
        SI('Stop following me.'),
        RA('I am not following you. I am sitting next to you, which is very different.'),
        N(
          'This goes on for some time. You begin to see why Rafiki has never needed to lock his door.',
        ),
        SI('…I know you. You’re the old one from the baobab. The one who painted things. Rafiki.'),
        RA('And I know you. You are Mufasa’s boy. Would you like to see your father?'),
        SI('My father is gone.'),
        RA('Is he? Come with me, and we will look.'),
      ],
      [
        ask(
          7,
          'sel',
          'quiet company can help more than advice',
          G_REL,
          [
            N(
              'Rafiki does not tell Simba what to feel. He just sits beside him, again and again. Why can that work better than advice?',
            ),
          ],
          [
            o(
              'It shows Simba he is not alone, and lets him choose when to talk',
              [
                N(
                  'Yes. Sitting beside someone says “I am here” without any pressure. People often talk when they feel safe, not when they are pushed.',
                ),
              ],
              true,
            ),
            o('It does not work', [
              N(
                'It can feel slow! But look: Simba begins to talk, and he remembers who Rafiki is. Quiet company can open doors that advice shuts.',
              ),
            ]),
            o('It annoys Simba into talking', [
              N(
                'Simba is annoyed at first, you are right. But the kindness underneath is what lets him talk in the end.',
              ),
            ]),
          ],
          'Learned that sitting quietly beside someone can help them feel less alone and open up when they are ready.',
        ),
      ],
      [
        {
          id: 'ferns',
          label: 'Stay back in the ferns.',
          then: [N('You stay where you are. This one isn’t yours to do.')],
        },
        {
          id: 'sit',
          label: 'Let your Nubbin go and sit with them too.',
          then: [
            N('It goes and sits on Simba’s other side. Surrounded by people sitting, he gives up.'),
          ],
        },
      ],
    ),
    sc(
      'a23-14-find-done',
      [
        N(
          'Rafiki sets off into the trees at a run, very fast for someone so old. Simba goes after him, and so do you.',
        ),
        N(
          'The air turns damp. Ferns, roots and creepers crowd in, and the dry grass of the plain is a long way behind.',
        ),
      ],
      [
        ask(
          1,
          'maths',
          'distance, speed and time',
          '4.MD.A.2',
          [
            N(
              'Rafiki runs 200 metres every minute, and Simba chases at 150 metres every minute. After 3 minutes, how far ahead is Rafiki?',
            ),
          ],
          [
            o(
              '150 metres',
              [
                N(
                  'Yes. Rafiki runs 3 × 200 = 600 metres, Simba runs 3 × 150 = 450 metres, and 600 − 450 = 150.',
                ),
              ],
              true,
            ),
            o('50 metres', [
              N(
                'That is how much more Rafiki runs each minute (200 − 150 = 50). In 3 minutes the gap grows to 3 × 50 = 150 metres.',
              ),
            ]),
            o('450 metres', [
              N(
                'That is how far Simba runs. Rafiki runs 600, so he is 600 − 450 = 150 metres ahead.',
              ),
            ]),
          ],
          'Solved a distance and time problem: 3 × 200 − 3 × 150 = 150 metres.',
        ),
      ],
    ),
    sc(
      'a23-14-pool',
      [
        N(
          'He leads you through a tangle of roots and creepers, under, over and through, until the trees open on a small round pool.',
        ),
        N('The water is perfectly still. It holds the whole sky, and the sky is clouding over.'),
        RA('Shh. Look down. There. Into the water.'),
        N('Simba looks. He sees himself: a grown lion with an untidy mane and tired eyes.'),
        SI('It’s only me. A tired lion in a puddle.'),
        RA('Then you are not looking properly. Again. Slower.'),
        N('Rafiki touches the water with one finger. The ripples run out, and slow, and settle.'),
        N(
          'And as they settle, the face in the water changes: older, broader, a darker mane. A face Simba knew.',
        ),
        RA(
          'You see? He is not here, but you carry him. You have been carrying him about with you all along.',
        ),
        N(
          'Your Nubbin leans over the edge and sees only itself, with a red mark on its brow. It looks for a long time anyway.',
        ),
      ],
      [
        ask(
          1,
          'science',
          'reflections form on smooth surfaces',
          '1-PS4-2',
          [N('Still water shows the whole sky, but rippling water breaks the picture up. Why?')],
          [
            o(
              'A smooth surface bounces light back in order; ripples scatter it',
              [
                N(
                  'Yes. Calm water acts like a mirror. Ripples tilt the surface every which way, so the light scatters and the picture breaks.',
                ),
              ],
              true,
            ),
            o('Ripples make the sky go away', [
              N(
                'The sky is still there. Ripples tilt the water’s surface in all directions, so the reflected light scatters.',
              ),
            ]),
          ],
          'Learned that still water reflects like a mirror and ripples break up the reflection.',
        ),
        ask(
          8,
          'sel',
          'remembering someone we have lost',
          G_SOFT,
          [
            N(
              'Rafiki says Simba carries his father with him. What might it mean to carry someone who has died? There is no one right answer.',
            ),
          ],
          [
            o('We keep their stories, voice and ways inside us', [
              N(
                'That’s a fair answer. We often hear them in the things we say and do, and that keeps them close.',
              ),
            ]),
            o('We carry their love, even if we cannot see them', [
              N(
                'That’s a fair answer. Being loved does not stop when someone dies: it stays part of who we are.',
              ),
            ]),
            o('It is only a comforting thing to say', [
              N(
                'That’s a fair answer, and an honest doubt. The ache of missing someone is real. Many people find the saying true in small ways, and we can think about it for a long time.',
              ),
            ]),
          ],
          'Thought about what it means to carry someone we love after they have died, with no single right answer.',
        ),
      ],
      [
        {
          id: 'look',
          label: 'Look into the pool yourself.',
          then: [N('You see your own face, and the sky behind it, going grey and moving fast.')],
        },
        {
          id: 'simba',
          label: 'Keep watching Simba.',
          then: [N('Simba is holding his breath. He doesn’t want the water to move.')],
        },
      ],
    ),
    sc(
      'a23-14-clouds',
      [
        N(
          'A wind comes. The clouds over the pool pile up and turn, and catch the light from somewhere far above them.',
        ),
        N(
          'Out of the cloud comes a shape: a great head, a mane of light, eyes like the sun through rain.',
        ),
        SI('Father?'),
        MU('Simba.'),
        SI('I’m sorry. I can’t go back. I’ve been happy out here. Mostly. Nearly.'),
        MU('You have been sad for a long time, and you have called it peace.'),
        MU(
          'One terrible day is not the whole of you. You are my son. You have always been my son.',
        ),
        MU('Go home, my son. The ones who love you are waiting, and you belong with them.'),
        SI('Wait. Wait, please. Stay a little longer.'),
        N('The voice comes once more, faint and very far off. Then the clouds are only clouds.'),
      ],
      [
        ask(
          0,
          'science',
          'how clouds form: condensing vapour',
          '2-PS1-4',
          [
            N(
              'Warm, damp air rises and cools. What does the water vapour in it turn into, to make a cloud?',
            ),
          ],
          [
            o(
              'Tiny drops of liquid water',
              [
                N(
                  'Yes. Cooling makes vapour condense into millions of tiny drops. Together they make a cloud.',
                ),
              ],
              true,
            ),
            o('Smoke', [
              N(
                'Clouds are not smoke. They are made of tiny drops of water (or ice crystals, very high up).',
              ),
            ]),
            o('Cotton', [N('They look like cotton, but they are made of tiny drops of water.')]),
          ],
          'Learned that clouds form when water vapour cools and condenses into tiny drops.',
        ),
      ],
    ),
    sc(
      'a23-14-clouds-done',
      [
        N(
          'Simba stands still in the wind, looking at the place where the clouds were. Rafiki doesn’t hurry him.',
        ),
        N(
          'Your Nubbin looks up at the clouds for a long time. It doesn’t stop until long after the sky is plain again.',
        ),
      ],
      [
        notice(
          1,
          'social-studies',
          'people everywhere keep those they have lost close by remembering them',
          'D2.His.2.K-2',
          [
            N(
              'People everywhere find ways to keep someone close after they have died: stories, photographs, a planted tree or flowers, a special place to visit.',
            ),
            N(
              'Remembering is one of the oldest human habits. The Grove’s memorial flowers are one more way.',
            ),
          ],
          'Learned that people everywhere keep loved ones close by remembering them in different ways.',
        ),
      ],
    ),
    sc(
      'a23-14-complete',
      [
        SI('If I go home, everyone will look at me and know.'),
        N('Rafiki raps him smartly on the head with his stick: not hard, but hard enough.'),
        SI('Ow!'),
        RA('That was a moment ago. Does it still sting?'),
        SI('Yes. Obviously.'),
        RA(
          'Then a thing that happened does not stay where you left it. You can carry it, or it can chase you.',
        ),
        RA('Only one of those lets you see where you are going.'),
        N('Rafiki swings the stick again. This time Simba ducks.'),
        RA('Ha! You see? You learn.'),
        N(
          'Simba looks once at the sky, then towards the desert and the grey plain beyond it. Then he starts to run.',
        ),
      ],
      [
        ask(
          6,
          'literacy',
          'a metaphor about the past',
          'L.4.5',
          [N('Rafiki says the past can be carried, or it can chase you. What does that mean?')],
          [
            o(
              'If you run from a hard memory, it keeps catching up; if you carry it, you can move on',
              [
                N(
                  'Yes. “It can chase you” is a metaphor: the past is not a runner, but running from it never works. Carrying it lets you face forward.',
                ),
              ],
              true,
            ),
            o('The past is a real animal', [
              N(
                'It is a picture, not a real animal. Rafiki is describing how a hard memory feels when we run from it.',
              ),
            ]),
          ],
          'Interpreted a metaphor: running from a hard memory means it keeps catching up.',
        ),
      ],
    ),
  ],
  [
    gl('habitat', 'The kind of place where a plant or animal lives.', 'a23-12-hunt-rafiki'),
    gl(
      'condense',
      'To change from a gas into a liquid, as steam does on a cold window.',
      'a23-14-clouds',
    ),
  ],
);

// ================================================================== A23-16 The Rains
const Q16: EduQuest = quest(
  'a23-16',
  'The Rains',
  {
    'a23-16-s1': {
      goal: 'Stand in the first rain on Pride Rock.',
      hint: 'Stay out in the open. Let it rain on you.',
    },
    'a23-16-s2': {
      goal: 'Watch Simba climb to the top of the rock and roar.',
      hint: 'Stay below with the pride, and look up.',
    },
    'a23-16-s3': {
      goal: 'Take your place on the rock at the new presentation.',
      hint: 'Go up to the top of the rock with Rafiki.',
    },
  },
  [
    sc(
      'a23-16-rain',
      [
        N(
          'Simba has come home, and Scar no longer rules the rock. The whole pride knows now that it was never Simba’s fault.',
        ),
        N(
          'The hard times are over, but the land has been dry for so long that the first raindrops raise little puffs of dust.',
        ),
        N('The next drop lands on your Nubbin’s head, where it sits and looks surprised.'),
        N('Then the sky opens, and it rains as though it had been saving up for years.'),
        RA('Mvua! Mvua! Rain!'),
        N(
          'Rafiki dances in it with his stick over his head and his beard dripping. Pumbaa lies down in the first puddle with a happy groan.',
        ),
        N(
          'Steam comes up off the hot rock. Zazu stands in the rain with his bad wing held out, letting it wash.',
        ),
        TI('Is this it? Is this the happy ending? Somebody tell me, so I can cry properly.'),
        N(
          'Your Nubbin splashes in every puddle on the rock, one after another, so that none of them feels left out.',
        ),
      ],
      [
        notice(
          3,
          'science',
          'East Africa has two rainy seasons',
          '3-ESS2-1',
          [
            N(
              'Much of East Africa has two rainy seasons: the long rains, about March to May, and the short rains, about October to December.',
            ),
            N('In between, it is dry. Plants, animals and people all live by that calendar.'),
          ],
          'Learned that East Africa has two rainy seasons, the long rains and the short rains.',
        ),
        ask(
          4,
          'literacy',
          'why a word is repeated',
          'RL.2.4',
          [
            N(
              'Rafiki shouts “Mvua! Mvua!” twice. Mvua is Swahili for rain. Why do you think the writer repeats it?',
            ),
          ],
          [
            o(
              'It shows his joy and gives the line a rhythm',
              [
                N(
                  'Yes. Repeating a word can show excitement and make a line feel like a shout or a beat.',
                ),
              ],
              true,
            ),
            o('The writer made a mistake', [
              N('It is deliberate. Repeating the word makes it feel like a cheer.'),
            ]),
          ],
          'Noticed that repeating a word (mvua!) can show excitement and rhythm.',
        ),
      ],
      [
        {
          id: 'dance',
          label: 'Dance with Rafiki.',
          then: [RA('Yes! Badly! It is the only way!')],
        },
        {
          id: 'stand',
          label: 'Stand still and let it rain on you.',
          then: [
            N(
              'You stand still and let it rain. It runs down your collar, and you don’t mind at all.',
            ),
          ],
        },
        {
          id: 'puddle',
          label: 'Join your Nubbin in the puddles.',
          then: [
            N(
              'You jump in the biggest one together. Pumbaa, in the next puddle, gives you both a nod of deep respect.',
            ),
          ],
        },
      ],
    ),
    sc(
      'a23-16-rain-done',
      [
        N(
          'Simba walks up the rock through the rain, to the very top, where his father used to stand.',
        ),
        N(
          'Rafiki sets a straight-sided gourd on the rock to catch the rain, and scratches the depth on his stick each evening.',
        ),
        RA('Four evenings: 12 millimetres, 8, 15 and 5. The plain will want to know.'),
      ],
      [
        ask(
          2,
          'maths',
          'adding several numbers',
          '2.OA.A.1',
          [
            N(
              'Rafiki measured 12 mm, 8 mm, 15 mm and 5 mm of rain over four evenings. How many millimetres fell in all?',
            ),
          ],
          [
            o('40 mm', [N('Yes. 12 + 8 = 20, 20 + 15 = 35, and 35 + 5 = 40 millimetres.')], true),
            o('35 mm', [N('That leaves out the last 5. 12 + 8 + 15 = 35, and 35 + 5 = 40.')]),
            o('45 mm', [
              N('Close, but a little too much. 12 + 8 = 20, 20 + 15 = 35, 35 + 5 = 40.'),
            ]),
          ],
          'Added 12 + 8 + 15 + 5 = 40 millimetres of rain.',
        ),
      ],
    ),
    sc(
      'a23-16-roar',
      [
        N('He stands at the edge for a long moment in the rain, looking out over the dark plain.'),
        N(
          'Rafiki stands beside you with both hands on his stick. He doesn’t say anything; he doesn’t need to.',
        ),
        N(
          'Simba lifts his head and roars. It goes out over the plain and comes back from the hills, again and again.',
        ),
        N('Below him the lionesses roar back: Nala, Sarabi, all of them, one after another.'),
        N(
          'Your Nubbin climbs onto your shoulder, takes a deep breath, opens its mouth as wide as it will go, and lets out a tiny squeak.',
        ),
        N(
          'Simba looks down at it from the top of the rock. Then he roars again, gently, just for it.',
        ),
        NA('It’s trying. Like he used to.'),
        TI('Okay. Now I’m crying properly.'),
      ],
      [
        ask(
          2,
          'music',
          'sound bounces back as an echo',
          '1-PS4-1',
          [
            N(
              'Simba’s roar comes back from the hills. What is it that makes a sound come back, and what do we call it? (A lion’s roar can carry for kilometres.)',
            ),
          ],
          [
            o(
              'Sound bounces off hard surfaces, and the repeat is an echo',
              [
                N(
                  'Yes. Sound travels in waves, and when they hit a hard surface like a hillside, some bounce back. That is an echo.',
                ),
              ],
              true,
            ),
            o('The hills are repeating it on purpose', [
              N(
                'It sounds like they are! But hills do not speak; they bounce the sound back. That bounce is an echo.',
              ),
            ]),
          ],
          'Learned that an echo is a sound bouncing back from a hard surface.',
        ),
        ask(
          5,
          'sel',
          'gentleness as strength',
          G_SOC,
          [
            N(
              'Simba roars gently, just for your Nubbin. Can being gentle be a kind of strength? There is no one right answer.',
            ),
          ],
          [
            o('Yes: a strong lion who is gentle chooses to be', [
              N(
                'That’s a fair answer. Being able to do something big, and choosing to be careful, says a lot about a person.',
              ),
            ]),
            o('Maybe, but strength is also about being powerful', [
              N(
                'That’s a fair answer. Power matters too. The interesting thing is what someone does with it.',
              ),
            ]),
            o('It is just kindness, not strength', [
              N(
                'That’s a fair answer. Kindness and strength can be different things. This story suggests that they work best together.',
              ),
            ]),
          ],
          'Thought about whether gentleness is a kind of strength, with no single right answer.',
        ),
      ],
      [
        {
          id: 'roar',
          label: 'Roar too.',
          then: [
            N(
              'You roar, and it is not very good. Nobody minds, and Pumbaa joins in, louder and much worse.',
            ),
          ],
        },
        {
          id: 'again',
          label: 'Help your Nubbin try again.',
          then: [
            N(
              'It tries again. This time it is a slightly bigger squeak, and it looks extremely pleased with itself.',
            ),
          ],
        },
      ],
    ),
    sc(
      'a23-16-roar-done',
      [
        N('The page turns, slowly, like someone who wants to stay on the last good bit.'),
        N('Weeks of rain go by. The dust turns to mud, and the mud turns green.'),
      ],
      [
        ask(
          1,
          'science',
          'plants need water to grow, and herds follow the grass',
          '2-LS2-1',
          [N('The rains have come and the grass is growing. Why do the herds come back?')],
          [
            o(
              'Fresh grass has grown for them to eat',
              [
                N(
                  'Yes. Plants need water to grow. Plant-eaters follow the green, and the hunters follow them.',
                ),
              ],
              true,
            ),
            o('They heard the roar', [
              N(
                'A roar is lovely, but it is the grass they follow. Fresh green growth, after the rain, is what draws the herds back.',
              ),
            ]),
          ],
          'Learned that plants need water, and that herds follow fresh grass.',
        ),
      ],
    ),
    sc(
      'a23-16-green',
      [
        N(
          'When it settles, the plain is green again: green to the hills, the river full, and the herds back from everywhere.',
        ),
        N(
          'Giraffes go past with their heads up, swaying like slow ships. Twiga, you think, and smile.',
        ),
        N('Twelve zebra drink at the river, and one third of them are this year’s foals.'),
        N(
          'All the animals are gathering below the rock, the way they did on the very first morning.',
        ),
        N(
          'At the top, Simba stands with his mane dry and full, and Nala beside him with something small between her paws.',
        ),
        NA('Gently. Three days old, and already the bossiest one on the rock.'),
        N(
          'Rafiki shakes his rattle of gourds over the new cub, and the cub sneezes, just as its father did.',
        ),
        N(
          'Your Nubbin climbs your back, then your shoulder, then your head, to see. Some things never change.',
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
              'Twelve zebra drink at the river, and one third of them are foals. How many foals is that?',
            ),
          ],
          [
            o(
              '4',
              [N('Yes. One third of 12 means 12 split into 3 equal groups, and each group has 4.')],
              true,
            ),
            o('3', [N('That is 12 ÷ 4. For one third, split 12 into 3 equal groups: each has 4.')]),
            o('9', [
              N('That is 12 − 3. One third means 12 split into 3 equal groups: 12 ÷ 3 = 4.'),
            ]),
          ],
          'Found one third of 12 (12 ÷ 3 = 4).',
        ),
        ask(
          7,
          'science',
          'every living thing on a plain is connected',
          'K-ESS3-3',
          [
            N(
              'Real savannas are protected in parks like the Serengeti and Hell’s Gate. If one kind of animal, even the beetles, vanished from a plain, what would happen?',
            ),
          ],
          [
            o(
              'Others would feel it, because everything on the plain is linked',
              [
                N(
                  'Yes. Beetles clear the ground and feed the soil, so the grass grows, so the herds eat, so the lions eat. Looking after land protects all of them.',
                ),
              ],
              true,
            ),
            o('Nothing: beetles are too small to matter', [
              N(
                'Small does not mean unimportant. Dung beetles move and bury waste, which feeds the soil. Without them, the grass suffers.',
              ),
            ]),
          ],
          'Learned that living things on a plain are linked, so looking after the land protects them all.',
        ),
      ],
    ),
    sc(
      'a23-16-complete',
      [
        N(
          'Rafiki cracks a gourd and marks the cub’s brow with a line of fruit-red. Then he holds the cub up high in both hands, over everything.',
        ),
        N(
          'Down on the plain, everyone sees at once. The sound comes up the rock like the sea, and the whole plain kneels.',
        ),
        TI('Hey! Guest! Dumpling! Get over here! You stand with family!'),
        N(
          'Timon and Pumbaa pull you in between them, to the front of the rock, right beside the lions.',
        ),
        PU('We came all this way together. You don’t get to stand at the back.'),
        N('You stand with them while the plain kneels. Your Nubbin, on your head, kneels too.'),
        N(
          'Then the light comes, and the paper, and the kitchen table. Nova’s atlas lies open at a red rock over a green plain.',
        ),
        N('Between the pages there is a bookmark that wasn’t there before, and a smell of rain.'),
      ],
      [
        ask(
          4,
          'sel',
          'what belonging feels like',
          G_REL,
          [
            N(
              'Pumbaa says “You don’t get to stand at the back.” What does it show about how he sees you?',
            ),
          ],
          [
            o(
              'He counts you as one of them, because you went through the journey together',
              [
                N(
                  'Yes. Belonging often grows from shared effort, not from who we are born to. You earned your place by showing up.',
                ),
              ],
              true,
            ),
            o('He is being bossy', [
              N(
                'He is being loud, you are right! But the message under it is kind: you belong at the front, beside the people you travelled with.',
              ),
            ]),
          ],
          'Noticed that belonging can grow from going through something together.',
        ),
      ],
    ),
  ],
  [
    gl('foal', 'A baby zebra.', 'a23-16-green'),
    gl('echo', 'A sound that bounces back off a hard surface.', 'a23-16-roar'),
  ],
);

// ================================================================== variants (A23_VARIANTS)
/** Reader versions of every scene in A23_VARIANTS (the Rafiki path, the Grove scenes, the margin note). */
export const EDU_A23_READER_VARIANTS: EduScene[] = [
  // ---- Rafiki path, A23-10
  sc(
    'a23-10-desert-rafiki',
    [
      N(
        'It is dark by the time you reach the baobab. Zazu has gone quiet in your arms, which frightens you more than anything.',
      ),
      N('Rafiki is sitting in the fork of the tree. He doesn’t call down; he already knows.'),
      RA('The wind came by a little while ago. It smelled wrong. Bring him up.'),
      N(
        'He takes Zazu from you, gently, and looks at the wing you bound. He doesn’t undo any of it.',
      ),
      RA('That is good work. Slow work. You did not hurry, even then.'),
      ZA('The king, Rafiki. And the boy. The boy ran…'),
      RA('I know. Hush. I know.'),
      N(
        'Rafiki lays him on a bed of leaves. Zazu is asleep before he has finished complaining about it.',
      ),
    ],
    [
      ask(
        3,
        'science',
        'bird bones are light and hollow, so a hurt wing needs rest',
        '4-LS1-1',
        [
          N(
            'A bird’s wing bones are hollow and light, which is what lets it fly. What does that mean for a hurt wing?',
          ),
        ],
        [
          o(
            'It breaks easily, so it must be kept still while it heals',
            [
              RA(
                'Just so. Light bones are marvellous for flying and delicate when hurt. Rest and a firm wrap give a wing the best chance to mend.',
              ),
            ],
            true,
          ),
          o('It can be flapped to get better', [
            RA(
              'Flapping a hurt wing could make the break worse. Light bones need to be held still while they knit.',
            ),
          ]),
        ],
        'Learned that a bird’s light, hollow wing bones can break easily and heal best when kept still.',
      ),
    ],
    [
      {
        id: 'tell',
        label: 'Tell Rafiki what you saw.',
        then: [
          N(
            'You tell him all of it, as well as you can. He listens without a word, nodding slowly.',
          ),
        ],
      },
      {
        id: 'sit',
        label: 'Sit down beside him and say nothing.',
        then: [N('You sit down beside him. After a while he puts his old hand on top of yours.')],
      },
    ],
  ),
  sc(
    'a23-10-desert-done-rafiki',
    [
      N(
        'Rafiki climbs up inside the tree in the dark. You hear him find the painted cub on the wall.',
      ),
      N('He believes the cub is lost for good. He stands looking at the painting for a long time.'),
      N('Then he wipes it out with the flat of his hand.'),
      RA('Pole sana, little one. Pole sana.'),
    ],
    [
      ask(
        3,
        'literacy',
        'a Swahili phrase of sympathy',
        'L.3.4',
        [
          N(
            'You know that sana means very. Rafiki says “pole sana”. When do Swahili speakers say it?',
          ),
        ],
        [
          o(
            'To show sympathy when someone is hurting or has lost something',
            [
              N(
                'Yes. Pole sana means “I am very sorry”. It is what you say when someone is hurt or grieving.',
              ),
            ],
            true,
          ),
          o('To say hello', [
            N(
              'Hello is a different phrase. Pole sana is said to show sympathy: “I am very sorry”.',
            ),
          ]),
          o('To say thank you', [
            N('Thank you is asante. Pole sana is said to show sympathy: “I am very sorry”.'),
          ]),
        ],
        'Learned the Swahili phrase pole sana (I am very sorry), said to show sympathy.',
      ),
    ],
  ),
  sc(
    'a23-10-help-rafiki',
    [
      N('In the morning you climb to the top of the baobab with Rafiki to look at the rock.'),
      N(
        'A thin dark lion stands at the very top, where the king used to stand. The lionesses are below him, heads down.',
      ),
      RA('Scar.'),
      N(
        'Up the back path of the rock, in a long grey line, come the hyenas: dozens of them, and then more.',
      ),
      ZA('He’s letting them in. He’s letting them in!'),
      N('Zazu is up, wobbling, with his bound wing held close, peering through the leaves.'),
      RA('Hyenas eat and eat, and never plant anything. It won’t be long now.'),
      ZA('I have to go back. Someone has to stand by the queen.'),
      RA('Your wing.'),
      ZA('I’ll walk. Hornbills are excellent at walking.'),
    ],
    [
      ask(
        9,
        'sel',
        'brave or foolish: going on when hurt',
        G_DEC,
        [
          N(
            'Zazu insists on going back to stand by the queen, though his wing is hurt. Is that brave, foolish, or both? There is no one right answer.',
          ),
        ],
        [
          o('Brave: he is putting his friends before himself', [
            N('That’s a fair answer. Loyalty can ask a lot of us. Many people admire Zazu for it.'),
          ]),
          o('Foolish: he should let his wing heal', [
            N(
              'That’s a fair answer. A hurt wing needs rest, and rest is not weakness. You might say he should have asked for help.',
            ),
          ]),
          o('Both, and that is what makes it hard', [
            N(
              'That’s a fair answer, and an honest one. Many brave things are a bit foolish, and many foolish things are done for brave reasons.',
            ),
          ]),
        ],
        'Thought about whether Zazu going back with a hurt wing is brave or foolish, with no single right answer.',
      ),
    ],
    [
      {
        id: 'help',
        label: 'Help Zazu down the tree.',
        then: [
          N(
            'You carry him down and set him on the path. He walks off towards the rock with his chin up, very small.',
          ),
        ],
      },
      {
        id: 'stay',
        label: 'Ask him to stay.',
        then: [
          ZA(
            'I can’t. It’s my job. It has been my job since before you were born. Whatever you are.',
          ),
        ],
      },
    ],
  ),
  sc(
    'a23-10-complete-rafiki',
    [
      N(
        'That evening you sit in the hollow of the tree while Rafiki mends a gourd that doesn’t need mending.',
      ),
      N('There are four gourds on his shelf. Each holds 3 litres.'),
      RA('A king has died, and a cub is lost. And the one who wanted the rock has got it.'),
      Y('What do we do?'),
      RA('What we did before. We watch. We carry water. We wait.'),
      RA('Waiting is not nothing. Done properly, it is the hardest work there is.'),
      N('Your Nubbin sits under the smudge where the cub used to be, and looks up at it.'),
    ],
    [
      ask(
        1,
        'maths',
        'multiplication word problem',
        '3.OA.A.3',
        [
          N(
            'Rafiki has four gourds on his shelf, and each holds 3 litres. How much water could you carry if you filled every one?',
          ),
        ],
        [
          o('12 litres', [N('Yes. Four gourds of 3 litres: 4 × 3 = 12 litres.')], true),
          o('7 litres', [
            N('That is 4 + 3. Each of the four gourds holds 3 litres, so 4 × 3 = 12.'),
          ]),
          o('34 litres', [
            N('That puts the digits side by side. Multiply instead: 4 × 3 = 12 litres.'),
          ]),
        ],
        'Solved a multiplication word problem: 4 gourds × 3 litres = 12 litres.',
      ),
    ],
  ),
  // ---- Rafiki path, A23-11
  sc(
    'a23-11-oasis-rafiki',
    [
      N('The page turns its seasons over, one after another, and each one is drier than the last.'),
      N(
        'The herds go first. One morning the zebra and wildebeest are there; the next they are a line of dust going away.',
      ),
      N(
        'The grass goes yellow, then grey, then nothing. The river at the bottom of the plain shrinks to a string of mud.',
      ),
      RA(
        'A plain is not just grass. It is everyone on it, looking after each other without knowing. When that stops…',
      ),
      N(
        'You and your Nubbin don’t change at all; the atlas keeps your time for you. Rafiki gets a little greyer round the beard.',
      ),
      N(
        'Every day you carry water up to the rock in Rafiki’s gourds, for whoever needs it. There is always someone.',
      ),
      RA('Polepole. You walk too fast in this heat. A dropped gourd helps nobody.'),
    ],
    [
      ask(
        2,
        'science',
        'animals move to where their needs are met',
        'K-ESS3-1',
        [
          N(
            'When the grass dies and the river turns to mud, the herds leave. How is that like the Great Migration?',
          ),
        ],
        [
          o(
            'Herds travel to find fresh grass and water',
            [
              N(
                'Yes. Animals move to where food and water are. The Great Migration is a huge version of this, following the rains.',
              ),
            ],
            true,
          ),
          o('Herds leave because they are bored', [
            N(
              'Herds leave because they must eat and drink. They go where the grass and water are.',
            ),
          ]),
        ],
        'Connected herds leaving a drying plain to the Great Migration: animals move to find food and water.',
      ),
    ],
    [
      {
        id: 'carry',
        label: 'Carry an extra gourd up the rock.',
        then: [N('It is heavy. You carry it anyway, all the way up.')],
      },
      {
        id: 'rest',
        label: 'Rest in the shade first.',
        then: [RA('Good. Resting is part of carrying. Nobody tells you that.')],
      },
    ],
  ),
  sc(
    'a23-11-oasis-done-rafiki',
    [
      N(
        'Up at the rock, the hyenas lie about in the shade, picking their teeth with old bones. There is nothing left to eat.',
      ),
      N('Zazu is up there too, stuck near Scar’s place. When he sees you, he puts his chin up.'),
    ],
    [
      ask(
        1,
        'sel',
        'reading a friend’s feelings',
        G_SOC,
        [N('Zazu puts his chin up when he sees you. What does that tell us about how he feels?')],
        [
          o(
            'He is trying to be brave, and he is glad to see a friend',
            [
              N(
                'Yes. A lifted chin is a way of saying “I am all right” while hoping for help. It shows brave and hopeful at once.',
              ),
            ],
            true,
          ),
          o('He is angry with you', [
            N(
              'A lifted chin can look proud or cross. Here it fits better with a friend trying to look brave when someone he trusts turns up.',
            ),
          ]),
        ],
        'Read a friend’s feelings from body language (a lifted chin).',
      ),
    ],
  ),
  sc(
    'a23-11-grubs-rafiki',
    [
      N(
        'At the top of the rock, the lionesses come back from hunting with nothing. You can count their ribs.',
      ),
      N(
        'Sarabi walks at the front. She is thinner than she was, and she walks exactly as straight.',
      ),
      SC('Sarabi. Your hunting party seems to have mislaid the hunting.'),
      SB('There is nothing left to hunt, Scar. The herds have gone, and we should follow them.'),
      SC('Nobody leaves my rock.'),
      N(
        'You set your gourd down at Sarabi’s feet. She drinks a little, then gives the rest to the youngest lioness.',
      ),
      SB('Asante, guest. Tell Rafiki we are still here. Tell him we are holding.'),
    ],
    [
      notice(
        0,
        'science',
        'lionesses hunt together as a team',
        '3-LS2-1',
        [
          N(
            'A pride works as a team. The lionesses do most of the hunting, often together: some wait while others drive the prey towards them.',
          ),
          N(
            'Hunting as a group works better than hunting alone, which is why the pride needs the herds to come back.',
          ),
        ],
        'Learned that lionesses hunt together as a team, and that this helps the pride survive.',
      ),
    ],
    [
      {
        id: 'stand',
        label: 'Stand beside Sarabi.',
        then: [
          N(
            'Scar looks at you as if you were something stuck to his paw. You stand beside her and don’t move.',
          ),
        ],
      },
      {
        id: 'cubs',
        label: 'Let your Nubbin play with the cubs.',
        then: [
          N(
            'The two cubs left on the rock tumble about with your Nubbin in the dust, and for a minute nobody is hungry.',
          ),
        ],
      },
    ],
  ),
  sc(
    'a23-11-complete-rafiki',
    [
      N(
        'That night someone scratches at the baobab. It is Nala, grown, thin as a reed, with her eyes very bright.',
      ),
      NA('I’m going. Out past the border, to find help. Anyone. Anything. Don’t tell Scar.'),
      RA('I will not tell Scar. I have not told Scar anything for years. It is very restful.'),
      RA(
        'Go with her, guest. Carry water. She will need it, and somebody should see what she finds.',
      ),
      N(
        'You fill every gourd you can carry. Your Nubbin takes its own tiny one, which holds one swallow.',
      ),
      NA('Come on, then. Keep up. Polepole is for people with tea waiting.'),
      RA('I heard that. And the tea is cold.'),
    ],
    [
      ask(
        4,
        'social-studies',
        'scarcity means choosing',
        'D2.Eco.1.K-2',
        [
          N(
            'There is very little water, and the rock needs it as much as Nala’s journey does. What does scarcity mean?',
          ),
        ],
        [
          o(
            'When there is not enough of something for everyone’s needs',
            [
              N(
                'Yes. When something is scarce, people have to choose how to use it. Rafiki chooses to share what he has.',
              ),
            ],
            true,
          ),
          o('When there is far too much of something', [
            N('That is the opposite: a surplus. Scarcity means there is not enough to go round.'),
          ]),
        ],
        'Learned that scarcity means there is not enough of something, so people have to choose.',
      ),
    ],
  ),
  // ---- Rafiki path, A23-12
  sc(
    'a23-12-hunt-rafiki',
    [
      N(
        'Two days out in the desert, the gourds are nearly empty. Then the sand turns to scrub, and the scrub to green.',
      ),
      N(
        'There are waterfalls, ferns and trees heavy with fruit. Nala stops with her nose up, and her whole body goes still.',
      ),
      NA('Warthog.'),
      N('Before you can say anything, she is gone into the long grass, low and fast.'),
      N(
        'Down by a stream, a big warthog is snuffling for beetles, with a meerkat sunbathing on his back.',
      ),
      PU('Aaagh! She’s gonna eat me!'),
      N(
        'A young lion comes crashing out of the ferns and meets her in mid-leap. They roll over and over in the mud.',
      ),
      N(
        'She pins him. She knows exactly where to put her paws; she pinned him like that a long time ago.',
      ),
      SI('Nala?'),
    ],
    [
      ask(
        1,
        'science',
        'different habitats, different life',
        '2-LS4-1',
        [
          N(
            'Sand, then scrub, then green. What changes as you walk, to make the plants so different?',
          ),
        ],
        [
          o(
            'The amount of water',
            [
              N(
                'Yes. Water is what a habitat is built on. Where there is a little, scrub grows; where there is a lot, ferns and fruit trees thrive.',
              ),
            ],
            true,
          ),
          o('The colour of the sky', [
            N(
              'The sky stays the same. What changes is the water in the ground, and that decides which plants can grow.',
            ),
          ]),
        ],
        'Learned that the amount of water changes the plants that grow, from sand to scrub to green.',
      ),
    ],
    [
      {
        id: 'hold',
        label: 'Hold on to your Nubbin.',
        then: [N('It wants to go and help. You hold on to it anyway.')],
      },
      {
        id: 'run',
        label: 'Run after her.',
        then: [
          N(
            'You get there out of breath, with half the desert in your boots, just in time to see who it is.',
          ),
        ],
      },
    ],
  ),
  sc(
    'a23-12-hunt-done-rafiki',
    [
      SI('And you. Rafiki’s guest. You haven’t changed at all. How haven’t you changed?'),
      Y('It’s a long story. There’s a book in it.'),
      NA('Rafiki sent them with me. Simba, they think you’re… everyone thinks you’re…'),
    ],
    [
      ask(
        1,
        'literacy',
        'why a character’s answer is funny and true',
        'RL.3.3',
        [N('You say “It’s a long story. There’s a book in it.” Why is that a clever answer?')],
        [
          o(
            'It is true: the atlas is a book, and it keeps your time',
            [
              N(
                'Yes. It is a joke and an honest answer at once. Nova’s atlas really is the book, and it is why you have not changed.',
              ),
            ],
            true,
          ),
          o('It means nothing', [
            N(
              'It means a lot! It is both a joke and the exact truth. The atlas is a book, and it is why you have not aged.',
            ),
          ]),
        ],
        'Noticed that a character’s joke can also be literally true.',
      ),
    ],
  ),
  sc(
    'a23-12-complete-rafiki',
    [
      N('When they come back, Nala will not look at Simba, and Simba will not look at anybody.'),
      NA(
        'Go back to Rafiki. Tell him Simba’s alive. Tell him he won’t come. I’m staying; I’m not giving up on him.',
      ),
      SI('Rafiki? He thinks I’m…'),
      N(
        'He doesn’t finish. He walks off into the dark, alone, and Timon and Pumbaa look at each other.',
      ),
      N(
        'You fill your gourds at the stream and turn for home at 6:30 in the morning. It is noon when you reach the thorns.',
      ),
    ],
    [
      ask(
        4,
        'maths',
        'time intervals',
        '3.MD.A.1',
        [
          N(
            'You set off at 6:30 in the morning and reach the thorns at noon (12:00). How long did you walk?',
          ),
        ],
        [
          o(
            '5 hours 30 minutes',
            [
              N(
                'Yes. 6:30 to 12:00 is 5 hours 30 minutes: 5 hours to 11:30, then 30 minutes to noon.',
              ),
            ],
            true,
          ),
          o('6 hours 30 minutes', [
            N(
              'That is an hour too long. From 6:30 to 11:30 is 5 hours, and 30 more minutes reaches noon: 5 hours 30 minutes.',
            ),
          ]),
          o('5 hours', [
            N(
              'Close, but it misses the last half hour. 6:30 to 11:30 is 5 hours, then 30 minutes to noon: 5 hours 30 minutes.',
            ),
          ]),
        ],
        'Found a time interval: from 6:30 to 12:00 is 5 hours 30 minutes.',
      ),
    ],
  ),
  // ---- Rafiki path, A23-13
  sc(
    'a23-13-ridge-rafiki',
    [
      N(
        'You cross the desert back the way you came: two days of sand, then the thorns, the grey plain and the baobab.',
      ),
      N(
        'Rafiki sees you coming a long way off. He comes down to meet you, quicker than he usually moves.',
      ),
      RA('Well? Polepole. Breathe first. Then tell me.'),
      Y('He’s alive. Simba’s alive. He’s grown up, and he won’t come home.'),
      N(
        'Rafiki sits down hard on a root, as though somebody had pulled the ground out from under him.',
      ),
      RA('Alive.'),
      RA('And I wiped him off my wall. Oh, I am an old fool. A blind old fool.'),
    ],
    [
      ask(
        6,
        'sel',
        'forgiving ourselves when we acted on what we knew',
        G_SOFT,
        [N('Rafiki feels terrible that he wiped the cub off the wall. What might help him?')],
        [
          o(
            'Remembering that he did it believing the cub was lost',
            [
              N(
                'Yes. We can only act on what we know at the time. Being kind to ourselves about that is part of being able to put things right.',
              ),
            ],
            true,
          ),
          o('Pretending it never happened', [
            N(
              'That does not help for long. It is better to say what happened, forgive ourselves for not knowing, and then mend it.',
            ),
          ]),
        ],
        'Learned that we can forgive ourselves for acting on what we knew, and then put things right.',
      ),
    ],
    [
      {
        id: 'known',
        label: 'Tell him he couldn’t have known.',
        then: [RA('No. But I could have hoped. Hope is cheap, and I was being mean with it.')],
      },
      {
        id: 'wait',
        label: 'Sit down next to him and wait.',
        then: [
          N(
            'You sit down next to him on the root. Your Nubbin climbs into his lap, and he lets it.',
          ),
        ],
      },
    ],
  ),
  sc(
    'a23-13-ridge-done-rafiki',
    [
      N('Out over the desert, the wind is getting up. You can hear it before you feel it.'),
      N('It blows through the branches of the baobab, and they creak.'),
    ],
    [
      ask(
        1,
        'science',
        'wind is moving air, caused by warm air rising',
        '3-PS2-1',
        [
          N(
            'The Sun warms the ground, and the warm air above it rises. What rushes in to take its place?',
          ),
        ],
        [
          o(
            'Cooler air, which we feel as wind',
            [
              N(
                'Yes. Warm air rises, cooler air flows in to fill the gap, and that moving air is wind.',
              ),
            ],
            true,
          ),
          o('Water', [
            N(
              'Water stays in rivers and clouds. It is cooler air that rushes in to fill the gap, and we feel that as wind.',
            ),
          ]),
        ],
        'Learned that wind is moving air: warm air rises and cooler air flows in.',
      ),
    ],
  ),
  sc(
    'a23-13-wind-rafiki',
    [
      N(
        'A puff of dust comes in on the wind, with a few loose hairs in it, gold and dark gold, and drifts in at the baobab’s door.',
      ),
      N('Rafiki catches it in his fist. He opens his hand and sniffs, and his whole face changes.'),
      RA('Him. That is him. That is the boy, grown.'),
      N(
        'Then he laughs, a great cackling whoop, and goes up the inside of the tree like a much younger mandrill.',
      ),
      RA('Paint! Ochre! Quickly! No. Polepole. But quickly!'),
      N(
        'You mix the yellow earth with shaking hands. Rafiki takes the shell and finds the smudge where the cub used to be.',
      ),
      N('He paints the cub back in. Then, round its head, in big round strokes, he paints a mane.'),
      RA('There. Now the wall is right again. Now we go and fetch him.'),
    ],
    [
      notice(
        5,
        'social-studies',
        'people have painted on walls with ochre for tens of thousands of years',
        'D2.His.2.K-2',
        [
          N(
            'Rafiki’s way of painting is very old. People have painted on rock and cave walls with ochre for tens of thousands of years, all over the world.',
          ),
          N(
            'Some of the oldest art ever found is in Africa. Painting a memory on a wall is one of the oldest things people do.',
          ),
        ],
        'Learned that people have painted on walls with ochre for tens of thousands of years, and some of the oldest art is in Africa.',
      ),
    ],
    [
      {
        id: 'mane',
        label: 'Help him with the mane.',
        then: [
          N(
            'You do the last bit, round the back, and it comes out lopsided. Rafiki says that is exactly what Simba’s looks like.',
          ),
        ],
      },
      {
        id: 'nubbin',
        label: 'Lift your Nubbin up to look.',
        then: [
          N('Your Nubbin puts its red forehead right up against the painted lion’s, nose to nose.'),
        ],
      },
    ],
  ),
  sc(
    'a23-13-complete-rafiki',
    [
      N(
        'Rafiki takes his stick and his biggest gourd. He doesn’t lock the tree, because he has never locked it.',
      ),
      RA('Come. You know the way now. That makes you the guide and me the guest. How funny.'),
      N(
        'You set off together across the grey plain towards the desert, with the wind at your backs.',
      ),
      N(
        'Your Nubbin walks in front, very important, as though it knew the way better than either of you.',
      ),
    ],
    [
      ask(
        1,
        'literacy',
        'role reversal and irony',
        'RL.3.3',
        [
          N(
            'Rafiki says “You are the guide and I am the guest. How funny.” What is funny about it?',
          ),
        ],
        [
          o(
            'The roles have swapped: you began as his guest in his land',
            [
              N(
                'Yes. At the start, he guided you through his world. Now you know the way, and he follows. That swap is what makes it funny and fitting.',
              ),
            ],
            true,
          ),
          o('Rafiki is lost', [
            N(
              'He is not lost: he is amused. The funny part is that the one who was a guest is now the guide.',
            ),
          ]),
        ],
        'Noticed a role reversal: the guest has become the guide.',
      ),
    ],
  ),
  // ---- the cloud scene after the campaign, the margin note, the Grove painting
  sc(
    'a23-14-clouds-done-after',
    [
      N(
        'Simba stands still in the wind, looking at the place where the clouds were. Rafiki doesn’t hurry him.',
      ),
      N('Your Nubbin looks up at the clouds for a long time. Then it turns, and looks at you.'),
      N(
        'Rafiki comes and stands beside you. He puts one old hand on your shoulder, and says nothing at all.',
      ),
      N('You stand like that, the three of you, until the wind goes down.'),
    ],
    [
      notice(
        2,
        'sel',
        'standing beside someone is a way of caring',
        G_REL,
        [
          N('When someone is missing a person they love, you do not have to fix it. You cannot.'),
          N(
            'Standing beside them, even without a word, says “I am here”. That is one of the kindest things anyone can do.',
          ),
        ],
        'Learned that quiet company is a kind way to support someone who is missing a loved one.',
      ),
    ],
  ),
  sc(
    'a23-margin-hazel',
    [
      N(
        'Nova’s atlas lies open at the still pool among the roots, and a grown lion looking down into it.',
      ),
      N(
        'Beside the pool, in faint pencil you have never noticed, there is a note in the margin. You know the hand.',
      ),
      N('“Simba found his father in the water. We carry them, you know.”'),
      N('“In the face. Often the chin.”'),
      N('And under it, one letter: H.'),
      N(
        'You find you have put a hand to your own chin. Your Nubbin looks at you, then at the pool, as if comparing.',
      ),
    ],
    [
      ask(
        4,
        'sel',
        'mixed feelings when we find something from someone we love',
        'CASEL: Self-awareness',
        [
          N(
            'A note from someone you love, found when you were not expecting it, can stir up more than one feeling. What might you feel?',
          ),
          N('There is no one right answer.'),
        ],
        [
          o('Happy, because it is like hearing their voice', [
            N('That’s a fair answer. Familiar handwriting can feel like a visit.'),
          ]),
          o('Sad, because they are not here to talk to', [
            N('That’s a fair answer. Missing someone is part of loving them.'),
          ]),
          o('Both at once', [
            N('That’s a fair answer. Two feelings can sit side by side, and both are allowed.'),
          ]),
        ],
        'Thought about the mixed feelings a note from a loved one can bring, with no single right answer.',
      ),
    ],
  ),
  sc(
    'a23-16-complete-rafiki',
    [
      N(
        'Rafiki walks to the edge of the rock, stops, and turns round. He holds out a gourd to you.',
      ),
      RA('Here. You crack it.'),
      Y('Me?'),
      RA('You. You carried every gourd on this page. You can carry this one the last step.'),
      N(
        'You crack it on his stick. He marks the cub’s brow with a line of fruit-red, and lifts the cub up high over everything.',
      ),
      N(
        'Down on the plain, everyone sees at once. The sound comes up the rock like the sea, and the whole plain kneels.',
      ),
      RA(
        'Asante, guest. Slowly you came, and slowly you stayed. That is how anything good gets done.',
      ),
      N(
        'Then the light comes, and the paper, and the kitchen table. Nova’s atlas lies open at a red rock over a green plain.',
      ),
      N('Between the pages there is a bookmark that wasn’t there before, and a smell of rain.'),
    ],
    [
      ask(
        6,
        'sel',
        'doing a little at a time adds up',
        G_MAN,
        [
          N(
            'Rafiki says “slowly you came, and slowly you stayed.” What does carrying one gourd at a time show?',
          ),
        ],
        [
          o(
            'Patient, steady effort can achieve big things',
            [
              RA(
                'Yes. One gourd, then another, then another. Polepole is not slowness for its own sake: it is how you get all the way there.',
                'happy',
              ),
            ],
            true,
          ),
          o('Only big efforts matter', [
            RA(
              'Big efforts are fine. But look at the page: everything good here was carried one gourd at a time.',
            ),
          ]),
        ],
        'Reflected that steady, patient effort (polepole) adds up to something big.',
      ),
    ],
  ),
  sc(
    'a23-grove-painting',
    [
      N(
        'You look into the hollow of Hazel’s crooked tree, the way you do sometimes, for no reason. Something is in there that wasn’t before.',
      ),
      N(
        'A little painting on a piece of bark: your Nubbin in yellow ochre, round and pleased, with a line of fruit-red across its brow.',
      ),
      N(
        'Your Nubbin looks at it for a long time. Then it touches its own forehead, where the red mark used to be.',
      ),
      N('Painting someone means you mean to remember them. Somebody, somewhere, means to.'),
    ],
    [
      ask(
        3,
        'sel',
        'what it means to be remembered',
        G_SOC,
        [
          N(
            '“Painting someone means you mean to remember them.” Why might being remembered matter to a person, or a Nubbin? There is no one right answer.',
          ),
        ],
        [
          o('It tells us we mattered to someone', [
            N(
              'That’s a fair answer. To be remembered is to be told, quietly, that you were seen and valued.',
            ),
          ]),
          o('It keeps us connected to people we cannot see', [
            N(
              'That’s a fair answer. Memory is a bridge between people, even across distance or time.',
            ),
          ]),
          o('It does not matter, only the living matter', [
            N(
              'That’s a fair answer, and an honest one. Many people think so. But notice how Rafiki’s wall, and this little painting, comfort those who are still here.',
            ),
          ]),
        ],
        'Thought about why being remembered matters, with no single right answer.',
      ),
    ],
  ),
];

// ================================================================== exports
export const EDU_A23_READER: EduQuest[] = [
  Q1,
  Q2,
  Q3,
  Q4,
  Q5,
  Q6,
  Q7,
  Q9,
  Q10,
  Q11,
  Q12,
  Q13,
  Q14,
  Q16,
];

/** Every `edu:` check string used by the lessons above (the reader band has no do lessons). */
export const CHECKS: string[] = [];
