/**
 * The Learning Grove, reader band (ages 7–10): Atlas A10 The Heart of the Island.
 *
 * Source: atlas-a10.ts (ATLAS_A10 and A10_VARIANTS). One EduScene per original scene, every step
 * scene, done scene, complete scene and the four variants, id `reader:<original id>`. Every
 * choice keeps its original id and `set`, so a10-step and a10-approach still work. See
 * EDU-STYLE.md.
 *
 * What it teaches (the outline's Learning Grove angle):
 *   - Polynesian navigation: the star compass (32 houses, fixed rising and setting points),
 *     steady swells and how islands bend them, land-roosting seabirds at dusk, the green glow
 *     under a cloud over a lagoon, and dead reckoning (A10-8);
 *   - the Hokulea canoe: its 1976 voyage from Hawaii to Tahiti with no instruments, its navigator
 *     Mau Piailug of Satawal, and what its name means (A10-8, A10-14);
 *   - coral reefs and lagoons: polyps build reefs, a reef shelters fish, warm water bleaches
 *     coral, clean water helps it recover (A10-2, A10-13);
 *   - the Pacific on a map: the largest ocean, and the Polynesian Triangle (A10-1, A10-14);
 *   - plus oral history and genealogy, canoe plants and settlement, volcanic islands, sound,
 *     erosion, fractions, multiplication and division, time, patterns, similes and themes, and
 *     feelings: fear and rules, grief, being loved without earning it, scary people who hurt.
 *
 * Care notes kept: Maui is treated with respect (a revered figure; his deeds are told straight).
 * Tattoo is explained as sacred and personal, never as something to copy. No chant, haka or
 * prayer is written out, and Gramma's song is never written out. No lines from the film or its
 * songs. Hard things: Gramma Tala's death is said plainly (her body stopped working and it won't
 * start again) with comfort straight after; Tui's friend who died at sea is one plain line (her
 * "in her sleep" is not used); Maui's first family not keeping him keeps the original's soft
 * wording. Te Ka is fire and noise and nobody is hurt.
 * Every fact is well established; the lalo and tai word parts (A10-9) and the hongi and honi
 * greeting names (A10-13) are marked for the cultural advisers.
 *
 * Think questions (no `best`): a10-01-page-done, a10-01-story, a10-02-coconuts-done, a10-03-sand,
 * a10-04-complete, a10-05-council, a10-06-maui, a10-07-fog-done, a10-07-complete,
 * a10-08-swell-done, a10-09-lair, a10-10-story, a10-11-crack, a10-12-song,
 * a10-13-walk, a10-14-complete and the variant scenes.
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
const M = say('a10-moana');
const G = say('a10-tala');
const T = say('a10-tui');
const S = say('a10-sina');
const MU = say('a10-maui');
const TM = say('a10-tamatoa');
const FM = say('a10-farmer');
const F = say('a10-fisher');

// ---------------------------------------------------------------- builders
type Beat = Omit<Lesson, 'id'>;
type Opt = NonNullable<Lesson['options']>[number];
type Domain = Lesson['domain'];

const opt = (label: string, reply: Line[], best = false): Opt =>
  best ? { label, best, reply } : { label, reply };

/** A think-question option: every answer is honoured and none is marked best. */
const think = (label: string, reply: Line[]): Opt => ({ label, reply });

const std = (standard?: string | null) => (standard ? { standard } : {});

const notice = (
  domain: Domain,
  skill: string,
  standard: string | null,
  after: number,
  lines: Line[],
  parentNote: string,
): Beat => ({ domain, skill, ...std(standard), kind: 'notice', after, lines, parentNote });

const ask = (
  domain: Domain,
  skill: string,
  standard: string | null,
  after: number,
  prompt: Line[],
  options: Opt[],
  parentNote: string,
): Beat => ({ domain, skill, ...std(standard), kind: 'ask', after, prompt, options, parentNote });

const doit = (
  domain: Domain,
  skill: string,
  standard: string | null,
  after: number,
  check: string,
  lines: Line[],
  parentNote: string,
): Beat => ({ domain, skill, ...std(standard), kind: 'do', after, check, lines, parentNote });

/** Builds `reader:<of>` and numbers its lessons `reader:<of>-l1`, `-l2`, in play order. */
const sc = (
  of: string,
  lines: Line[],
  beats: Beat[],
  extra: { choices?: Choice[] } = {},
): EduScene => ({
  id: `reader:${of}`,
  of,
  band: 'reader',
  lines,
  ...extra,
  lessons: [...beats]
    .sort((a, b) => a.after - b.after)
    .map((b, i) => ({ id: `reader:${of}-l${i + 1}`, ...b })),
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
  glossary: GlossaryEntry[],
): EduQuest => ({
  id: `reader:${of}`,
  of,
  band: 'reader',
  title,
  goals,
  scenes,
  ...(glossary.length ? { glossary } : {}),
});

const g = (goal: string, hint: string) => ({ goal, hint });

// ================================================================== the quests

const Q01: EduQuest = quest(
  'a10-01',
  'The Chosen One',
  {
    'a10-01-s1': g(
      'Step onto the island and find the voice telling a story.',
      'Touch the page, then follow the children’s laughter to the open house.',
    ),
    'a10-01-s2': g(
      'Hear the rest of the story, the frightening bit included.',
      'Stay in the shade with the children until the story is done.',
    ),
    'a10-01-s3': g(
      'Watch over the baby turtle on the beach.',
      'Go down to the waterline where the toddler has escaped to.',
    ),
  },
  [
    sc(
      'a10-01-page',
      [
        N(
          'Nova’s atlas falls open at a page washed in sea-blue. There is an island in the middle of it, very green, ringed with white.',
        ),
        N(
          'The paint goes warm under your hand, then wet. Then it is sand, and you and your Nubbin are standing in it.',
        ),
        N(
          'Behind the palms there is a house with no walls, only a roof on posts. A crowd of small children sits inside it.',
        ),
        N(
          'An old woman is telling them a story with her hands. A painted cloth hangs behind her: an island shaped like a sleeping woman.',
        ),
        G(
          'Before the palms, before the fish, there was the sea and nothing else. Then the mother island came up out of it.',
          'soft',
        ),
        G(
          'Her heart could make things grow. She gave that away to every island she could reach. Green, and more green, and more.',
          'happy',
        ),
        N(
          'She spots you at the edge of the shade, and doesn’t miss a beat. She just shuffles up to make room.',
        ),
        G(
          'Sit, sit. Somebody from past the reef. We don’t get many. Your little one can sit on the end.',
        ),
        N(
          'Your Nubbin sits on the end, beside a toddler with a great deal of hair. The toddler pats it, firmly, like a drum.',
        ),
      ],
      [
        notice(
          'social-studies',
          'the Pacific is the largest ocean; maps show land and water',
          '2-ESS2-2',
          0,
          [
            N(
              'Nova’s page is a map of the Pacific Ocean. The Pacific is the largest ocean on Earth, bigger than all the world’s land put together.',
            ),
            N(
              'Thousands of islands are scattered across it. Motunui is one tiny green dot among them.',
            ),
          ],
          'Learned that the Pacific is the largest ocean and holds thousands of islands.',
        ),
        ask(
          'literacy',
          'what a simile compares',
          'L.4.5',
          8,
          [
            N(
              'Your Nubbin is patted “firmly, like a drum”. What does that simile tell us about the way the toddler pats?',
            ),
          ],
          [
            opt(
              'Firmly, with a steady beat, as if she were drumming',
              [
                N(
                  'Yes. A drum is struck firmly and in rhythm, so the simile gives us the sound and the feel of her pats.',
                ),
              ],
              true,
            ),
            opt('Very gently, like stroking a cat', [
              N('A drum is hit, not stroked. The simile means firm, steady pats.'),
            ]),
            opt('She is not patting it at all', [
              N('She is patting it, and the simile compares her pats to drumming.'),
            ]),
          ],
          'Worked out what a simile tells us about how a character acts.',
        ),
      ],
    ),
    sc(
      'a10-01-page-done',
      [
        G(
          'Now. Where was I? The heart. Everyone wanted it. And one of them came to take it.',
          'think',
        ),
      ],
      [
        ask(
          'sel',
          'thinking about why people take what is not theirs',
          'CASEL: Responsible decision-making',
          0,
          [
            G('Everyone wanted the heart. And one of them came to take it.', 'think'),
            N('Why might someone take something that was never theirs to take? Think it over.'),
          ],
          [
            think('They were greedy', [
              N('Greed is one reason. Keep that in mind: later, the story gives a different one.'),
            ]),
            think('They wanted to be loved or admired', [
              N('That is a deep answer. People sometimes do wrong things to feel they matter.'),
            ]),
            think('They did not think anyone would mind', [
              N('That happens too. Not asking is easier than finding out what others think.'),
            ]),
          ],
          'Gave a reason someone might take what is not theirs.',
        ),
      ],
    ),
    sc(
      'a10-01-story',
      [
        G('A trickster. A shapeshifter, with a great fish hook the gods gave him. Maui.'),
        G(
          'He took the heart, and the mother island began to crumble. As he fled, a demon of earth and fire rose up after him.',
        ),
        N(
          'Most of the children squeal and hide behind each other. The toddler leans forward, delighted.',
        ),
        G(
          'Maui was struck from the sky, and the heart and his hook fell into the sea. Nobody has found them since.',
        ),
        G(
          'And the darkness is still spreading, island by island. One day it will reach us.',
          'sad',
        ),
        N(
          'A tall man ducks in under the roof, with the face of a father who has heard this story before.',
        ),
        T('Mother. That’s enough. They won’t sleep for a week.'),
        T(
          'There is no darkness, and nobody here needs to cross the reef. We have fish, we have coconuts, we have each other. That’s plenty.',
        ),
        N(
          'The children scatter. The toddler is carried off under his arm, upside down, still waving at your Nubbin.',
        ),
        G(
          'He’s my son, and he’s a good chief. He’s also wrong. Both at once. You’ll find that’s quite common.',
          'soft',
        ),
      ],
      [
        notice(
          'social-studies',
          'oral history: knowledge kept by telling',
          'D2.His.2.K-2',
          3,
          [
            N(
              'Gramma Tala tells this story by heart. For centuries, Pacific peoples kept stories, family histories and star paths by learning them and telling them aloud.',
            ),
            N(
              'Each generation had to listen carefully, because the knowledge lived only in people’s memories.',
            ),
          ],
          'Learned that Pacific peoples kept their history by telling it aloud, generation to generation.',
        ),
        ask(
          'sel',
          'being good and wrong at once',
          'CASEL: Social awareness',
          9,
          [
            N(
              'Gramma Tala says her son is a good chief and also wrong, both at once. Can that be true of a person?',
            ),
          ],
          [
            think('Yes. Good people can be wrong sometimes', [
              N('That is a kind way to see it. A mistake does not cancel a person’s goodness.'),
            ]),
            think('No. A good person is never wrong', [
              N('That is a strong view. Think of a time a good person you know made a mistake.'),
            ]),
            think('It depends what they are wrong about', [
              N('A fair point. Some mistakes are small, and some cost a great deal.'),
            ]),
          ],
          'Thought about whether a good person can be wrong.',
        ),
      ],
    ),
    sc(
      'a10-01-story-done',
      [
        N(
          'Gramma Tala picks up a stick and walks off towards the shore, humming. She doesn’t look back to see if you follow, and you do.',
        ),
      ],
      [
        ask(
          'literacy',
          'what actions show about a character',
          'RL.3.3',
          0,
          [
            N(
              'Gramma Tala walks off without checking that you are following. What does that tell us about her?',
            ),
          ],
          [
            opt(
              'She trusts you and expects you to come along',
              [
                N(
                  'Yes. She does not look back because she is sure you will follow, and actions can show trust.',
                ),
              ],
              true,
            ),
            opt('She has forgotten you are there', [
              N(
                'She noticed you at once, earlier. Not looking back is a sign of trust, not forgetting.',
              ),
            ]),
            opt('She wants to be left alone', [
              N('Then she would not have taken you in. She expects you to follow.'),
            ]),
          ],
          'Read a character’s action to work out what she trusts.',
        ),
      ],
    ),
    sc(
      'a10-01-turtle',
      [
        N(
          'The toddler has got loose again. She is down on the wet sand, frowning at something small and flat.',
        ),
        N('It is a baby turtle, trying to reach the water. Seabirds circle above it, with ideas.'),
        N(
          'The toddler pulls a big leaf off a bush and holds it over the turtle like a roof. She walks beside it, step by step.',
        ),
      ],
      [
        notice(
          'science',
          'a sea turtle’s life cycle',
          '3-LS1-1',
          1,
          [
            N(
              'Sea turtles lay eggs in nests dug in warm sand. When the babies hatch, they crawl to the sea by themselves, usually at night.',
            ),
            N(
              'Only a few survive to be adults. Birds and crabs eat many on the way, which is why the toddler’s leaf-roof matters.',
            ),
          ],
          'Learned how sea turtles begin life: eggs in sand, then a dangerous crawl to the sea.',
        ),
      ],
      {
        choices: [
          {
            id: 'shade',
            label: 'Send your Nubbin to walk on the other side.',
            then: [
              N(
                'Your Nubbin waddles along the other side of the turtle, holding up its arms. Together they make a very small, very slow parade.',
              ),
            ],
          },
          {
            id: 'birds',
            label: 'Wave the birds away.',
            then: [
              N(
                'You flap your arms at the birds, and your Nubbin flaps its tiny wings. The birds decide, on balance, to go and bother someone else.',
              ),
            ],
          },
        ],
      },
    ),
    sc(
      'a10-01-turtle-done',
      [
        N(
          'The turtle reaches the foam and is gone. The toddler claps, and so does your Nubbin, mostly missing.',
          'happy',
        ),
      ],
      [
        notice(
          'sel',
          'caring for wildlife responsibly',
          'CASEL: Responsible decision-making',
          0,
          [
            N(
              'In the story the toddler helps. In real life, hatchlings need to crawl to the sea on their own, and people should not pick them up.',
            ),
            N(
              'What does help is keeping beach lights off at night, because bright lights can lead hatchlings away from the water.',
            ),
          ],
          'Learned how people really help baby sea turtles: leave them be and keep lights off.',
        ),
      ],
    ),
    sc(
      'a10-01-complete',
      [
        N(
          'Then the sea pulls back from the toddler’s feet, and keeps pulling, and stands up in a wall of clear water.',
        ),
        N(
          'Fish hang in it like flecks in glass. The wall leans down to look at her, the way a dog leans down to a puppy.',
        ),
        N(
          'It sets a shell in her hands, then another. Then a small green stone with a spiral cut into it.',
        ),
        T('Moana! Moana, where are you?'),
        N(
          'The water falls back to being just the sea. The toddler runs to her father’s voice, and the green stone drops in the sand.',
        ),
        N('Gramma Tala bends, slowly, and picks it up. She tucks it into the shell at her neck.'),
        G(
          'The sea picks who it picks, and never explains itself. Grandchildren are the same.',
          'soft',
        ),
        N('The page ripples. When it settles, the palms are taller, and some years have gone by.'),
      ],
      [
        ask(
          'literacy',
          'what a simile tells us',
          'L.4.5',
          1,
          [
            N(
              'The water “leans down to look at her, the way a dog leans down to a puppy.” What does this tell you about the ocean?',
            ),
          ],
          [
            opt(
              'It is huge and gentle, and curious about her',
              [
                N(
                  'Yes. A big dog leaning to a puppy is careful and interested, so the ocean seems the same.',
                ),
              ],
              true,
            ),
            opt('It is about to attack her', [
              N('A dog leaning down to a puppy is friendly. The simile shows the ocean is gentle.'),
            ]),
            opt('The ocean is really a dog', [
              N(
                'A simile compares two different things. The sea is like a big, kind dog, but it is still the sea.',
              ),
            ]),
          ],
          'Used a simile to understand a character: the ocean.',
        ),
      ],
    ),
  ],
  [
    gloss(
      'trickster',
      'A character in stories who plays tricks and breaks rules, sometimes to cause trouble and sometimes to help.',
      'a10-01-story',
    ),
    gloss(
      'shapeshifter',
      'Someone in a story who can change into a different creature or shape.',
      'a10-01-story',
    ),
  ],
);

const Q02: EduQuest = quest(
  'a10-02',
  'The Reef',
  {
    'a10-02-s1': g(
      'Walk the village with the chief’s daughter, and see the coconut trees.',
      'Meet Moana by the chief’s house and go up to the grove.',
    ),
    'a10-02-s2': g(
      'Go down to the lagoon, where the nets have come in empty.',
      'Find the fishermen at the boat shelter.',
    ),
    'a10-02-s3': g(
      'Go out to the breakers with Moana, and bring her back in.',
      'Wade out to the reef edge and be ready to pull.',
    ),
  },
  [
    sc(
      'a10-02-coconuts',
      [
        N(
          'Moana is sixteen now, and is being taught to be chief, which mostly means people bringing her problems.',
        ),
        M(
          'You’re Gramma’s guest! She said you’d come back. She says that about everyone, but she was right this time.',
          'happy',
        ),
        M('Come on. The coconut farmers want me. They always want me before breakfast.'),
        FM('Look at this. Cracked one open this morning.'),
        N(
          'He holds out a coconut split in half. Inside, where it should be white, it is black and soft and smells of nothing good.',
        ),
        FM('Whole trees of them. Not just old trees. Young ones too.'),
        M(
          'Then we clear those trees and plant a new grove over there. It’s good ground. We just haven’t used it.',
          'think',
        ),
        N('The farmer nods slowly, which on Motunui means yes, and also means we’ll see.'),
      ],
      [
        notice(
          'science',
          'plant disease spreads, and coconuts travel by sea',
          '3-LS4-4',
          5,
          [
            N(
              'Plant diseases can spread from tree to tree, which is why farmers clear sick trees and plant new ones on clean ground.',
            ),
            N(
              'Coconuts float, and sea currents carried them between islands. That is one way coconut palms reached so many shores.',
            ),
          ],
          'Learned that plant diseases spread, and that floating coconuts can cross the sea.',
        ),
      ],
      {
        choices: [
          {
            id: 'dig',
            label: 'Offer to dig the first hole for the new grove.',
            then: [
              FM('A guest who digs. Now I’ve seen everything.', 'happy'),
              N(
                'You dig. Your Nubbin helps by sitting in the hole, to check it is the right size.',
              ),
            ],
          },
          {
            id: 'ask',
            label: 'Ask how long the trees have been sick.',
            then: [
              FM(
                'Since the rains. It started on the far side and walked this way, a tree at a time.',
                'think',
              ),
              N(
                'Moana looks towards the far side of the island, and then past it, at the sea. She doesn’t say anything.',
              ),
            ],
          },
        ],
      },
    ),
    sc(
      'a10-02-coconuts-done',
      [M('That’s one. Next it’ll be the roofs, or the fishing. It’s always the fishing.')],
      [
        ask(
          'sel',
          'noticing how someone else feels',
          'CASEL: Social awareness',
          0,
          [
            N(
              'Moana is learning to be chief, and every problem lands on her. How might she be feeling, do you think?',
            ),
          ],
          [
            think('Overwhelmed', [
              N('A good guess. Trouble after trouble before breakfast is a lot to carry.'),
            ]),
            think('Proud to be trusted', [
              N('That could be true too. People can feel proud and tired together.'),
            ]),
            think('Lonely, because nobody else can fix it', [
              N('That is thoughtful. Being the one people turn to can feel lonely.'),
            ]),
          ],
          'Thought about how a young leader might feel under pressure.',
        ),
      ],
    ),
    sc(
      'a10-02-lagoon',
      [
        N(
          'The fishing canoes are drawn up on the sand, their nets draped over them, dry. Nothing in them but weed.',
        ),
        F(
          'Every day, fewer. Today, none. The lagoon’s been fished out, or the fish have gone somewhere.',
          'sad',
        ),
        M('Different nets? The far side of the island?'),
        F('Tried both. Nothing.'),
        N(
          'Moana looks past the lagoon, to where the waves break white on the reef. Past that, the sea is a darker blue.',
        ),
        M('Then we go out past the reef. The fish must be out there somewhere.', 'think'),
        N(
          'The fishermen go very quiet. One of them looks over your shoulder, where the chief has just walked up.',
        ),
        T('We don’t cross the reef.'),
        T(
          'We have one rule, and it keeps us safe. You know it. You’ll be chief. You’ll keep it too.',
        ),
        N(
          'Moana opens her mouth, and closes it again. Your Nubbin, sensing a mood, sits on her foot.',
        ),
      ],
      [
        notice(
          'science',
          'what a reef and a lagoon are',
          '2-LS4-1',
          4,
          [
            N(
              'A reef is a ridge of rock or coral just under the sea’s surface. Waves break on it, so the water behind it, the lagoon, stays calm.',
            ),
            N(
              'That calm water is a safe nursery for young fish, and a good place to fish from a canoe.',
            ),
          ],
          'Learned how a reef shelters a calm lagoon.',
        ),
        ask(
          'social-studies',
          'scarcity means choosing',
          'D2.Eco.1.K-2',
          5,
          [
            N(
              'When there are fewer fish, the village has to make choices. Which of these is a choice caused by scarcity?',
            ),
          ],
          [
            opt(
              'Sharing the few fish fairly, or looking for new fishing grounds',
              [
                N(
                  'Yes. When something runs short, people must decide how to share it or where to find more.',
                ),
              ],
              true,
            ),
            opt('Choosing what colour to paint a canoe', [
              N('A paint colour is a choice, but the fish running short does not cause it.'),
            ]),
            opt('Pretending there is no problem', [
              N('Ignoring it is not a plan. Scarcity means people must choose how to cope.'),
            ]),
          ],
          'Linked fewer fish to the choices a village must make.',
        ),
      ],
    ),
    sc(
      'a10-02-lagoon-done',
      [
        N(
          'The chief walks off. Moana watches the reef for a long time, chewing the inside of her cheek.',
        ),
        M('He didn’t say why. He never says why.', 'angry'),
      ],
      [
        ask(
          'maths',
          'a rule that halves each time',
          '4.OA.C.5',
          1,
          [
            N(
              'Say the lagoon’s catch fell over four days like this: 48 fish, 24, 12, 6. What is the rule, and what comes next?',
            ),
          ],
          [
            opt(
              'Halve it each day, so 3 fish next',
              [N('Yes. 48 ÷ 2 = 24, 24 ÷ 2 = 12, 12 ÷ 2 = 6, so 6 ÷ 2 = 3.')],
              true,
            ),
            opt('Take away 6 each day, so 0 fish next', [
              N(
                'Check it: 48 − 6 is 42, not 24. The amount lost shrinks each day, so the rule is halving.',
              ),
            ]),
            opt('Take away 12 each day', [
              N('48 − 12 is 36, not 24. Halving matches every step: the next number is 3.'),
            ]),
          ],
          'Found a halving rule in a number pattern and extended it.',
        ),
      ],
    ),
    sc(
      'a10-02-breakers',
      [
        N(
          'An hour later, Moana is pushing a small canoe off the sand, with a spotted pig sitting in the front of it.',
        ),
        M('That’s Pua. He’s coming for luck. Don’t tell anyone. I’m only going to look.'),
        N(
          'She paddles well in the lagoon. At the reef, the waves come in bigger and closer, one after another, like a crowd at a door.',
        ),
        N(
          'The third wave lifts the canoe, turns it over, and throws it back towards the beach like a leaf.',
        ),
        Y('Moana!', 'shock'),
        N(
          'You wade in up to your chest. Your Nubbin paddles past you, much faster, its tiny wings going like a fan.',
        ),
        N(
          'Between you, you get hold of her arm, and then Pua, who is very much not enjoying this.',
        ),
      ],
      [
        notice(
          'science',
          'coral reefs are built by tiny animals',
          '3-LS4-3',
          2,
          [
            N(
              'Coral looks like rock or a plant, but a reef is built by animals. Each coral polyp is tiny, with a soft body and tentacles.',
            ),
            N(
              'A polyp makes a hard limestone skeleton around itself. Over thousands of years, billions of polyps build a reef big enough to stop ocean waves.',
            ),
          ],
          'Learned that coral reefs are built by tiny animals called polyps.',
        ),
      ],
    ),
    sc(
      'a10-02-breakers-done',
      [
        N(
          'Moana sits on the sand with a cut on her foot and the canoe in two pieces beside her. Pua stands well up the beach, sulking.',
        ),
        M('Fine. Fine. Point taken.', 'sad'),
        N(
          'Your Nubbin comes out of the shallows last. In its mouth is a small white shell with a spiral on it, like a tiny staircase.',
        ),
      ],
      [
        ask(
          'literacy',
          'what a simile compares',
          'L.4.5',
          2,
          [
            N(
              'The shell has a spiral “like a tiny staircase.” What do a spiral shell and a staircase have in common?',
            ),
          ],
          [
            opt(
              'Both wind round and round, step by step, to a centre',
              [N('Yes. A spiral turns round a middle point, as a spiral staircase does.')],
              true,
            ),
            opt('Both are made of wood', [
              N('Not wood. The simile is about the shape: winding round and round.'),
            ]),
            opt('Both are cold', [N('Temperature is not the point. They share a winding shape.')]),
          ],
          'Explained what a shell and a staircase have in common in a simile.',
        ),
      ],
    ),
    sc(
      'a10-02-complete',
      [
        M(
          'He’s right. I nearly drowned the pig. Maybe I’m meant to stay, and be a good chief, and keep the rule.',
          'sad',
        ),
        N('She looks at the cut on her foot, and not at the reef. It takes some effort.'),
        N(
          'Your Nubbin drops the spiral shell in your hand, very pleased with itself. You put it somewhere safe.',
        ),
        N(
          'Down the beach, out of sight round the point, somebody is laughing on her own, and splashing.',
        ),
        M(
          'That’ll be Gramma. She dances with the sea. Everybody thinks she’s odd. She says that’s their business.',
          'soft',
        ),
      ],
      [
        ask(
          'sel',
          'what helps after a failure',
          'CASEL: Self-management',
          1,
          [
            N(
              'Moana failed, and now she wonders whether she should give up. What helps most after a failure?',
            ),
          ],
          [
            opt(
              'Rest, work out what went wrong, and try again with help',
              [
                N(
                  'Yes. Failing teaches, and trying again with a plan and a helper is how people get better.',
                ),
              ],
              true,
            ),
            opt('Never try again', [
              N('Giving up keeps you safe, but it also stops you learning.'),
            ]),
            opt('Blame someone else', [
              N('Blaming feels easier, but it does not show you what to change.'),
            ]),
          ],
          'Talked about learning from a failure and trying again.',
        ),
      ],
    ),
  ],
  [
    gloss('grove', 'A small group of trees growing together.', 'a10-02-coconuts'),
    gloss(
      'lagoon',
      'A calm stretch of shallow sea water, often sheltered by a reef or a ring of coral.',
      'a10-02-lagoon',
    ),
    gloss(
      'reef',
      'A ridge of rock or coral near the surface of the sea, where waves break.',
      'a10-02-lagoon',
    ),
    gloss(
      'polyp',
      'A tiny coral animal with a soft body and tentacles that builds a hard skeleton around itself.',
      'a10-02-breakers',
    ),
  ],
);

const Q03: EduQuest = quest(
  'a10-03',
  'Gramma Tala',
  {
    'a10-03-s1': g(
      'Find Gramma Tala dancing at the water’s edge.',
      'Walk round the point, to where the waves come in long and low.',
    ),
    'a10-03-s2': g(
      'Let Gramma Tala teach your Nubbin one step.',
      'Stand in the shallows with your Nubbin and choose a step.',
    ),
    'a10-03-s3': g(
      'Sit on the sand with Gramma and Moana while the tide turns.',
      'Sit down beside Gramma Tala on the dry sand.',
    ),
  },
  [
    sc(
      'a10-03-point',
      [
        N(
          'Round the point, the waves come in long and slow. Gramma Tala is dancing in the edge of them, in a skirt that is soaked to the knee.',
        ),
        N(
          'She moves the way the water moves. Forward when it comes in, back when it goes, as if the two of them had rehearsed.',
        ),
        N(
          'On her back, from shoulder to shoulder, is a tattoo of a manta ray. It is old, and the lines have softened, and it is beautiful.',
        ),
        G('Don’t stand there like a post. The sea doesn’t bite. Not today.'),
        M('Gramma, you shouldn’t be out here on your own.'),
        G(
          'I’m not on my own. I’ve got the sea, and a guest, and a round little thing with wings. That’s a crowd.',
          'happy',
        ),
        G(
          'Mantas are my favourites. When I’m finished here, that’s what I’ll be. I’ve told everyone. They don’t have to go to meetings.',
        ),
        M('Gramma!'),
      ],
      [
        notice(
          'science',
          'waves move energy, not water',
          '4-PS3-2',
          1,
          [
            N(
              'Wind pushing on the sea makes waves. A wave carries energy across the water, but the water itself mostly just moves up and down in small circles.',
            ),
            N('That is why a floating coconut bobs on a wave and does not rush ashore with it.'),
          ],
          'Learned that waves carry energy while the water mostly bobs in place.',
        ),
        ask(
          'literacy',
          'what humour shows about a character',
          'RL.3.3',
          6,
          [
            N(
              'Gramma says that when she is a manta, she will not have to go to meetings. What does this show about her?',
            ),
          ],
          [
            opt(
              'She is playful and not afraid of growing old',
              [N('Yes. She can joke about the future, which shows she is at peace with it.')],
              true,
            ),
            opt('She is cross with everyone', [N('Her tone is warm and teasing, not cross.')]),
            opt('She wants to leave the island', [
              N('She is joking about what she will be, not about leaving.'),
            ]),
          ],
          'Used a character’s joke to understand her outlook.',
        ),
      ],
    ),
    sc(
      'a10-03-point-done',
      [
        N(
          'Your Nubbin has crept down into the foam and is trying to copy her. It mostly falls over, very sincerely.',
        ),
        G('Oh, now. That one has the makings.', 'happy'),
      ],
      [
        notice(
          'art',
          'dance carries stories',
          'D2.His.2.K-2',
          1,
          [
            N(
              'Across the Pacific, dance is more than fun. It is a way of telling stories, remembering people and showing respect for the land and sea.',
            ),
            N(
              'Gramma’s dance with the waves is part of that long tradition, in the story’s own invented way.',
            ),
          ],
          'Heard that dance can tell stories and keep memories alive across Pacific cultures.',
        ),
      ],
    ),
    sc(
      'a10-03-step',
      [
        G('Come here, small one. Feet in the water. Feel it pull? That’s the sea saying hello.'),
        N('Your Nubbin stands in the foam, rocking a little each time it goes out.'),
        G(
          'I’ve got two steps for a beginner. One for the manta, one for the wave. You only get one today. I’m old, my knees are older.',
        ),
        G('Which shall it be?', 'think'),
      ],
      [
        doit(
          'science',
          'balance: forces and leaning',
          '3-PS2-1',
          1,
          'edu:balance:lean:hold',
          [
            N(
              '(Stand with your feet apart. Lean slowly to one side until you feel you might wobble, then come back to centre.)',
            ),
            N(
              'You stay up while your weight is over your feet. Lean too far, and the forces are unbalanced, so you fall.',
            ),
          ],
          'Felt the balance point when leaning, and learned why leaning too far makes you fall.',
        ),
      ],
      {
        choices: [
          {
            id: 'glide',
            label: 'The stingray glide.',
            set: { 'a10-step': 'glide' },
            then: [
              G(
                'Arms out wide, and soft. Lean, and let the sea carry you sideways. Don’t flap. Mantas never flap. They fly in the water.',
              ),
              N(
                'Your Nubbin spreads its arms, leans, and slides along the foam on one foot, perfectly level, for very nearly a second.',
                'happy',
              ),
            ],
          },
          {
            id: 'wave',
            label: 'The wave step.',
            set: { 'a10-step': 'wave' },
            then: [
              G(
                'Up on your toes when it comes in. Down and back when it goes. Roll your arms like the water rolls over itself.',
              ),
              N(
                'Your Nubbin rises, sinks, rises, rolling its little arms, a beat behind the sea and then, suddenly, right on it.',
                'happy',
              ),
            ],
          },
        ],
      },
    ),
    sc(
      'a10-03-step-done',
      [
        G(
          'There. That’s yours now. A step’s like a name. Once somebody’s taught it to you, it doesn’t come off.',
          'soft',
        ),
      ],
      [
        ask(
          'literacy',
          'what a simile means',
          'L.4.5',
          0,
          [
            N(
              'Gramma says, “A step’s like a name. Once somebody’s taught it to you, it doesn’t come off.” What does she mean?',
            ),
          ],
          [
            opt(
              'What you are given with love belongs to you for good',
              [N('Yes. A name, or a step, is yours once someone gives it to you.')],
              true,
            ),
            opt('Names are written in ink', [
              N('She does not mean ink. “Doesn’t come off” means it cannot be taken away.'),
            ]),
            opt('You must never learn another step', [
              N('She is describing how teaching lasts, not forbidding new things.'),
            ]),
          ],
          'Worked out the meaning of a simile about learning.',
        ),
      ],
    ),
    sc(
      'a10-03-sand',
      [
        N(
          'Gramma sits down on the dry sand with a noise like a sack of shells. Moana sits beside her, and you on the other side.',
        ),
        M('I tried to go past the reef this morning. I nearly drowned Pua.'),
        G(
          'I know. I saw. You went out on the wrong side, in the wrong boat, at the wrong tide. Otherwise, very good.',
          'happy',
        ),
        M('Dad says the reef keeps us safe.'),
        G('It does. Safe is a good thing. It isn’t the only thing.', 'soft'),
        G(
          'Your father once had a reason for his rule. You should ask him for it, one day. Gently.',
        ),
        N('She looks at Moana for a long moment, as if she is weighing something in her hand.'),
        G('You’ve got a question in you the size of a canoe. You always have. Ask it.', 'think'),
      ],
      [
        ask(
          'sel',
          'is safe the same as well?',
          'CASEL: Responsible decision-making',
          4,
          [
            N(
              'Gramma says safe is a good thing, but not the only thing. Is being safe the same as being well?',
            ),
          ],
          [
            think('Safe is what matters most', [
              N(
                'Staying safe is very important. Think about what you would miss if you stayed safe all the time.',
              ),
            ]),
            think('Safe can mean missing things that make life good', [
              N(
                'That is what Gramma seems to mean: a very small life is safe, but may not be a full one.',
              ),
            ]),
            think('Both matter, and it depends on the risk', [
              N('A wise answer. Good decisions weigh the danger against what is gained.'),
            ]),
          ],
          'Thought about whether being safe is the same as being well.',
        ),
      ],
    ),
    sc(
      'a10-03-sand-done',
      [
        M('Who we are. Where we came from. Why we never leave.', 'think'),
        G('Good. Get your guest. Bring a torch. It’s a walk.'),
      ],
      [
        notice(
          'social-studies',
          'genealogies: knowing who we come from',
          'D2.His.2.K-2',
          0,
          [
            N(
              'Moana asks who they are and where they came from. Pacific peoples answered with genealogy: a spoken record of ancestors, back to the first.',
            ),
            N('Reciting a genealogy told you where you belonged, and who had come before you.'),
          ],
          'Learned that Pacific peoples used spoken genealogies to say who they are and where they come from.',
        ),
      ],
    ),
    sc(
      'a10-03-complete',
      [
        N(
          'Gramma gets up, which takes three tries and a hand from you. She does not mention the hand.',
        ),
        N(
          'Your Nubbin walks behind her up the beach, still doing its step, a little crooked, every few paces.',
        ),
        G('It’ll come. Everything worth having comes slow. Mantas, grandchildren, steps.', 'soft'),
      ],
      [
        ask(
          'maths',
          'multiply to find a total',
          '3.OA.A.3',
          2,
          [
            N(
              'Gramma says everything worth having comes slowly. If your Nubbin practises its step for 5 minutes a day for 12 days, how many minutes is that?',
            ),
          ],
          [
            opt(
              '60 minutes, which is one hour',
              [N('Yes: 12 × 5 = 60, and 60 minutes make one hour. Slow practice adds up.')],
              true,
            ),
            opt('17 minutes', [
              N('17 is 12 + 5. Each of the 12 days has 5 minutes, so multiply: 12 × 5 = 60.'),
            ]),
            opt('50 minutes', [N('Close: 10 days would be 50. With 12 days it is 12 × 5 = 60.')]),
          ],
          'Multiplied equal daily amounts of practice time and converted to hours.',
        ),
      ],
    ),
  ],
  [
    gloss(
      'genealogy',
      'A record of a family’s ancestors, naming each generation back through time.',
      'a10-03-sand-done',
    ),
  ],
);

const Q04: EduQuest = quest(
  'a10-04',
  'The Cave of Canoes',
  {
    'a10-04-s1': g(
      'Follow Gramma Tala behind the waterfall.',
      'Carry the torch up the stream to where the water falls over the rocks.',
    ),
    'a10-04-s2': g(
      'Find what is hidden at the bottom of the cave.',
      'Go down the passage and look at the shapes in the dark.',
    ),
    'a10-04-s3': g('Watch what the drum remembers.', 'Stand back while Moana beats the drum.'),
  },
  [
    sc(
      'a10-04-falls',
      [
        N(
          'Gramma leads you up a stream to a rock face with a waterfall coming down it, thin and noisy.',
        ),
        G(
          'There. Behind it. I’ve been waiting a long time to show somebody. You first, Moana. Guest second. Round one third.',
        ),
        N(
          'Moana looks at the waterfall, then at Gramma, and steps through. You hear her gasp on the other side.',
        ),
        N(
          'You follow, and the water hits your head like a cold hand. Your Nubbin goes through at a run with its eyes shut.',
        ),
        N(
          'Behind the falls there is a passage in the rock, sloping down, and the sound of the sea somewhere at the bottom of it.',
        ),
        G('Go on, then. Light the way. I’ll be along. My knees take the long way round.'),
      ],
      [
        notice(
          'science',
          'moving water wears away rock',
          '4-ESS2-1',
          3,
          [
            N(
              'Falling water is strong. Over thousands of years it wears away the rock below it, a process called erosion.',
            ),
            N('That is how some waterfalls cut hollows behind them, big enough to hide a passage.'),
          ],
          'Learned that falling water slowly erodes rock and can carve hollows.',
        ),
      ],
    ),
    sc(
      'a10-04-falls-done',
      [
        N(
          'The torch makes the wet rock shine. Your Nubbin’s emote ball glows a little too, which is no help but is company.',
        ),
      ],
      [
        ask(
          'literacy',
          'what a narrator’s joke means',
          'RL.3.3',
          0,
          [
            N(
              'Your Nubbin’s emote ball glows, “which is no help but is company.” What does the narrator mean?',
            ),
          ],
          [
            opt(
              'It does not light the way, but it is nice not to be alone',
              [
                N(
                  'Yes. Light helps you see and company helps you feel brave, but the glow gives only the second.',
                ),
              ],
              true,
            ),
            opt('The ball is broken', [
              N('The glow is working. It just does not give enough light to see by.'),
            ]),
            opt('Nubbins are afraid of caves', [
              N('The line is about comfort, not about fear of caves.'),
            ]),
          ],
          'Understood a narrator’s dry joke about comfort.',
        ),
      ],
    ),
    sc(
      'a10-04-canoes',
      [
        N(
          'The passage opens into a cavern as big as the meeting house. A dim blue light comes in from the sea at the far end.',
        ),
        N('Moana lifts the torch, and the shapes in the dark turn into boats.'),
        N(
          'Not fishing canoes. Great voyaging canoes, twin-hulled, with their sails furled and their steering oars laid along the decks.',
        ),
        N(
          'There are dozens of them, under dust and cobweb, and every one is finer than anything on the beach.',
          'shock',
        ),
        M('Whose are these? Who built them? We don’t build these. Nobody builds these.', 'shock'),
        N(
          'Your Nubbin climbs up onto the nearest hull and sits there, very small, under a mast as tall as a tree.',
        ),
        N('At the front of the cave is a great drum. The skin is old, but tight.'),
      ],
      [
        notice(
          'social-studies',
          'real voyaging canoes',
          'D2.His.2.K-2',
          2,
          [
            N(
              'Real Pacific voyaging canoes were often double-hulled, two hulls joined by a deck. In Hawaiian this is a waʻa kaulua.',
            ),
            N(
              'Builders lashed them together with cord made from plant fibre, and the canoes carried families, plants and animals across open ocean.',
            ),
          ],
          'Learned that Pacific peoples built double-hulled voyaging canoes lashed with plant-fibre cord.',
        ),
        ask(
          'maths',
          'multiply to find a total',
          '3.OA.A.3',
          3,
          [
            N(
              'There are dozens of canoes. Say there are 4 rows with a dozen in each row: how many canoes are there?',
            ),
          ],
          [
            opt('48', [N('Yes. A dozen is 12, and 4 × 12 = 48.')], true),
            opt('16', [N('16 is 4 × 4. A dozen is 12, so each row has 12: 4 × 12 = 48.')]),
            opt('412', [N('That glues the numbers together. Multiply: 4 × 12 = 48.')]),
          ],
          'Multiplied rows by a dozen to find 48.',
        ),
      ],
      {
        choices: [
          {
            id: 'dust',
            label: 'Brush the dust off the nearest prow.',
            then: [
              N(
                'Under the dust the wood is carved: waves, stars, and a long line of small figures, each with a hand on the next one’s shoulder.',
              ),
            ],
          },
          {
            id: 'torch',
            label: 'Hold the torch high so Moana can see.',
            then: [
              N(
                'You hold the torch up. Moana walks the length of the cave touching each hull as she passes, the way you’d count heads.',
              ),
            ],
          },
        ],
      },
    ),
    sc(
      'a10-04-canoes-done',
      [G('Bang the drum, Moana. Go on. It’s been waiting for you.', 'soft')],
      [
        notice(
          'science',
          'sound and vibration',
          '4-PS3-2',
          0,
          [
            N(
              'When Moana hits the drum, its skin vibrates, and the shaking passes to the air as sound.',
            ),
            N(
              'A big drum vibrates slowly, so it makes a deep sound. A small drum vibrates faster and sounds higher.',
            ),
          ],
          'Learned that vibrations make sound, and that bigger drums sound deeper.',
        ),
      ],
    ),
    sc(
      'a10-04-drum',
      [
        N('Moana beats the drum once. The sound goes all round the cave and comes back bigger.'),
        N(
          'She beats it again, and again, and the torchlight seems to move on the sails, as if a wind were filling them.',
        ),
        N(
          'Then you are not in a cave. You are on the open sea, on the deck of one of those canoes, in full sail under the stars.',
        ),
        N(
          'All round you are more canoes, and on them people steering, singing, reading the sky, laughing at the tops of their voices.',
        ),
        N(
          'A woman at a steering oar looks straight at you and grins, the way you’d grin at someone who has nearly worked out a joke.',
        ),
        N(
          'They find an island, and land, and plant, and build. Then they load the canoes again and sail on to find the next one.',
        ),
        N('Your Nubbin, on the deck beside you, is doing its step without seeming to know it.'),
      ],
      [
        notice(
          'social-studies',
          'Pacific settlement and canoe plants',
          'D2.His.2.K-2',
          5,
          [
            N(
              'Over more than two thousand years, voyagers settled islands from Tonga and Samoa out to Hawaiʻi, Rapa Nui and Aotearoa New Zealand.',
            ),
            N(
              'They carried “canoe plants” like coconut, taro and breadfruit, and animals like pigs and chickens, to start new homes.',
            ),
          ],
          'Learned how Pacific voyagers settled distant islands and carried plants and animals with them.',
        ),
      ],
    ),
    sc(
      'a10-04-drum-done',
      [
        N(
          'The drum stops ringing. You are in the cave again, with dust on your feet and the sound of the sea at the far end.',
        ),
      ],
      [
        ask(
          'maths',
          'multiply rate by time',
          '3.OA.A.3',
          0,
          [N('A steady drum beats twice every second. How many beats are there in 30 seconds?')],
          [
            opt('60', [N('Yes. 2 beats × 30 seconds = 60 beats.')], true),
            opt('32', [N('32 is 30 + 2. Each second has 2 beats, so multiply: 2 × 30 = 60.')]),
            opt('15', [
              N(
                '15 is 30 ÷ 2, which would be one beat every two seconds. This drum beats twice a second, so 60.',
              ),
            ]),
          ],
          'Multiplied beats per second by seconds to find a total.',
        ),
      ],
    ),
    sc(
      'a10-04-complete',
      [
        M(
          'They didn’t stay. They went. Every island, they found it and they left it and went on. We did that.',
          'happy',
        ),
        G(
          'We did. Until the darkness came, and the boats stopped coming home, and the chiefs said: no more. Stay inside the reef.',
        ),
        G('And we hid the boats. And we forgot. All but a few of us, being stubborn.', 'soft'),
        N(
          'Gramma opens the shell at her neck and takes out the green stone with the spiral on it.',
        ),
        G(
          'The ocean gave you this when you were small. I kept it for you. It’s the heart of Te Fiti, the mother island.',
          'soft',
        ),
        G(
          'The darkness is here, Moana. The coconuts, the fish. Someone has to find Maui and make him put it back.',
        ),
        M('I have to tell Dad. Now. Right now.', 'happy'),
        N(
          'She is out of the cave before Gramma has finished smiling. Your Nubbin runs after her, and then back for you.',
        ),
      ],
      [
        ask(
          'sel',
          'good decisions that cost something later',
          'CASEL: Responsible decision-making',
          2,
          [
            N(
              'The chiefs hid the boats to keep everyone safe, and in time people forgot who they were. Was that a good choice?',
            ),
          ],
          [
            think('Yes, it kept people alive', [
              N('Safety matters. But notice the cost: the people lost a part of their story.'),
            ]),
            think('No, forgetting cost too much', [
              N(
                'That is a strong view. Think about whether there was another way to be safe and remember.',
              ),
            ]),
            think('It was good then and poor later', [
              N('A subtle answer. Choices can fit one time and not the next.'),
            ]),
          ],
          'Thought about a decision that protected people now but cost them later.',
        ),
      ],
    ),
  ],
  [
    gloss('voyaging', 'Making long journeys, especially across the sea.', 'a10-04-canoes'),
    gloss('hull', 'The main body of a boat, which floats on the water.', 'a10-04-canoes'),
  ],
);

const Q05: EduQuest = quest(
  'a10-05',
  'Setting Sail',
  {
    'a10-05-s1': g(
      'Stand by Moana while she tells the chief what she found.',
      'Go to the meeting house, where the elders are gathered.',
    ),
    'a10-05-s2': g(
      'Sit with Gramma Tala in her house.',
      'Go to Gramma’s house and sit by her mat.',
    ),
    'a10-05-s3': g(
      'Carry food and water down to the hidden canoe in the dark.',
      'Take the bundles from Sina and carry them to the cave’s sea mouth.',
    ),
  },
  [
    sc(
      'a10-05-council',
      [
        N(
          'Moana bursts into the meeting house with cobweb in her hair. The elders look up from a very long talk about roof thatch.',
        ),
        M(
          'Our people sailed. There are boats in a cave, real boats, and we can find more fish, and Maui, and fix everything.',
          'happy',
        ),
        T('The cave. She showed you the cave.', 'angry'),
        M('You knew? You knew, and you never…'),
        T(
          'We are not going past the reef. I’ll burn those boats before I see one leave this beach.',
          'angry',
        ),
        N('The meeting house goes very still. Somebody puts down a roof bundle without a sound.'),
        T(
          'When I was your age, I went past the reef. My best friend came with me. The sea was rough, and I came home, and he died out there.',
          'sad',
        ),
        T('I won’t lose you to it. I won’t.', 'sad'),
        N(
          'For a moment he isn’t a chief at all, only a man who has been afraid for a very long time.',
        ),
      ],
      [
        ask(
          'social-studies',
          'is fear a good reason for a rule?',
          'D2.Civ.8.K-2',
          8,
          [N('Tui would burn the boats to keep Moana safe. Is fear a good reason to make a rule?')],
          [
            think('Yes. Fear can protect people', [
              N(
                'Fear can warn us of real danger. Ask whether the rule still fits the danger today.',
              ),
            ]),
            think('No. Fear makes rules that are too big', [
              N('Often it does. A rule made from grief can keep out safety and joy together.'),
            ]),
            think('It is a starting point, and the rule should be checked', [
              N(
                'A wise answer. Fear tells us something matters, then we have to look at it clearly.',
              ),
            ]),
          ],
          'Thought about whether fear is a good basis for a rule.',
        ),
      ],
    ),
    sc(
      'a10-05-council-done',
      [
        N(
          'Then a boy runs in from outside, breathless, with news: Gramma Tala has fallen, down by the shore.',
          'shock',
        ),
      ],
      [
        ask(
          'literacy',
          'how a plot event changes a scene',
          'RL.3.3',
          0,
          [
            N(
              'Just as Moana and Tui reach their worst moment, a boy runs in with news. What does this do to the story?',
            ),
          ],
          [
            opt(
              'It interrupts the argument and shifts what matters most',
              [
                N(
                  'Yes. The news breaks the argument off and turns everyone’s attention to Gramma Tala.',
                ),
              ],
              true,
            ),
            opt('It makes the argument longer', [
              N('The boy’s news stops the argument. Something more urgent has come up.'),
            ]),
            opt('It solves the problem', [
              N('Nothing is solved. It simply changes what everyone must do next.'),
            ]),
          ],
          'Saw how a sudden event shifts the direction of a scene.',
        ),
      ],
    ),
    sc(
      'a10-05-bedside',
      [
        N(
          'Gramma lies on her mat with a healer beside her. She is very small all of a sudden, and her hands are cool.',
        ),
        N(
          'Moana kneels by her head, and you sit at the foot. Your Nubbin sits on the mat, carefully, as if it knows.',
        ),
        G('Don’t fuss. I’m old. Old people do this. It’s allowed.', 'soft'),
        G(
          'You have to go. Tonight. While your father is busy being frightened of the right thing for the wrong reason.',
        ),
        M('I can’t leave you. Not now.', 'sad'),
        G(
          'I’ll be the bit of you that keeps going when you want to stop. That’s not poetry. That’s just how grandmothers work.',
          'soft',
        ),
        N(
          'She presses the shell with the heart in it into Moana’s hand and folds her fingers over it.',
        ),
        G(
          'Find Maui. Take him across the sea. Make him give it back. And mind your guest. Guests are a responsibility.',
          'happy',
        ),
        N(
          'Then she turns her head to your Nubbin, and smiles, and moves one hand on the mat, in the step she taught it.',
        ),
      ],
      [
        notice(
          'sel',
          'grief can come before a death',
          'CASEL: Self-awareness',
          5,
          [
            N(
              'When someone we love is very old or ill, we can feel sad before anything has happened. That is normal.',
            ),
            N(
              'Spending time with them and saying what is in your heart can help, as Moana is doing.',
            ),
          ],
          'Learned that sadness about a loved one’s illness is normal and that spending time together helps.',
        ),
      ],
    ),
    sc(
      'a10-05-bedside-done',
      [G('Go on, my girl. I’m so proud of you.', 'soft')],
      [
        doit(
          'literacy',
          'writing or saying a short message to someone you love',
          null,
          0,
          'edu:write:kind-words',
          [
            N(
              '(Think of someone you love. Say to them, or write down, one thing you most want them to know.)',
            ),
            N(
              'Gramma Tala made sure Moana knew she was proud of her. Words like that stay with people.',
            ),
          ],
          'Wrote or said something kind to a loved one, as Gramma did for Moana.',
        ),
      ],
    ),
    sc(
      'a10-05-pack',
      [
        N(
          'In Moana’s house, someone is already packing. It’s her mother, Sina, folding food into bundles by the light of one lamp.',
        ),
        S('Dried fish. Coconuts, the good ones. Water. More water. You always forget water.'),
        M('Mum. I…'),
        S(
          'I know. I heard. I’m not going to stop you. I’m going to make sure you’ve got enough to eat.',
          'soft',
        ),
        N(
          'She holds Moana for a long time. Then she holds you, briefly, as if you were hers too, and hands you a bundle.',
        ),
        N(
          'You carry the bundles down the dark path to the cave’s sea mouth, where Moana has dragged out the smallest of the canoes.',
        ),
        N('It still looks enormous. Moana loads it with her jaw set and her hands shaking.'),
      ],
      [
        notice(
          'science',
          'how drying keeps food',
          null,
          0,
          [
            N(
              'Sina packs dried fish. Drying takes the water out of food, and without water, the bacteria and moulds that spoil food cannot grow.',
            ),
            N('That is why dried and salted food can last for weeks on a long voyage.'),
          ],
          'Learned that drying food stops it spoiling, so it keeps on long voyages.',
        ),
        ask(
          'maths',
          'multiply to find a total',
          '3.OA.A.3',
          1,
          [
            N(
              'Sina says you always forget water. If Moana needs 3 gourds a day for 7 days, how many gourds must she load?',
            ),
          ],
          [
            opt('21', [N('Yes. 7 days of 3 gourds each: 7 × 3 = 21.')], true),
            opt('10', [
              N('10 is 3 + 7. Each day needs its own 3 gourds, so multiply: 7 × 3 = 21.'),
            ]),
            opt('4', [
              N('4 is the difference. Count equal groups instead: seven groups of 3 is 21.'),
            ]),
          ],
          'Multiplied gourds per day by days to plan supplies.',
        ),
      ],
      {
        choices: [
          {
            id: 'steady',
            label: 'Hold the canoe steady while she loads.',
            then: [
              N(
                'You hold the hull still against the swell. By the third bundle her hands are steadier, or she has stopped letting you see.',
              ),
            ],
          },
          {
            id: 'water',
            label: 'Tell her what Sina said about water.',
            then: [
              M('I do always forget water.', 'soft'),
              N(
                'She counts the water gourds out loud, all of them, and then once more, for her mother.',
              ),
            ],
          },
        ],
      },
    ),
    sc(
      'a10-05-pack-done',
      [
        N(
          'When you turn round, your Nubbin is gone. So is the village rooster, Heihei, who is not known for going anywhere on purpose.',
        ),
      ],
      [
        ask(
          'literacy',
          'predict from clues in the story',
          'RL.3.3',
          0,
          [
            N(
              'Your Nubbin and Heihei have gone missing, and Heihei is “not known for going anywhere on purpose.” What can you predict?',
            ),
          ],
          [
            opt(
              'Heihei followed your Nubbin, perhaps onto the canoe',
              [
                N(
                  'A good guess. The clue is that Heihei never goes anywhere on purpose, so he probably tagged along.',
                ),
              ],
              true,
            ),
            opt('Heihei flew to another island', [
              N(
                'Chickens cannot fly that far, and he does nothing on purpose. A nearby hiding place is likelier.',
              ),
            ]),
            opt('Nobody can possibly guess', [
              N('The story gives clues. Heihei follows and wanders, so the canoe is a good bet.'),
            ]),
          ],
          'Predicted what happens next using clues about a character.',
        ),
      ],
    ),
    sc(
      'a10-05-complete',
      [
        N(
          'Moana pushes the canoe off into the dark lagoon. The sail goes up crooked, and she doesn’t know how to fix it yet.',
        ),
        N(
          'From under the deck at the bow comes a small, determined cluck, and then a small, determined squeak.',
        ),
        Y('Wait! Moana! My Nubbin’s in your boat!', 'shock'),
        N(
          'You wade in after it, up to your waist, up to your chest. Then the sea lifts you, quite gently, and puts you on the deck.',
        ),
        M('Did the ocean just give me a passenger?', 'shock'),
        N(
          'Behind you, on the shore, the lamps are lit in Gramma Tala’s house. As you watch, the brightest of them goes out.',
        ),
        N(
          'Gramma Tala has died, quietly, with her family round her. Moana sees the light go, and knows.',
          'sad',
        ),
        N(
          'Then, under the canoe, something glows. A great manta ray, lit from inside, glides past beneath you and out through the reef.',
          'soft',
        ),
        N('Moana wipes her eyes, and turns the canoe after it.', 'soft'),
      ],
      [
        notice(
          'sel',
          'grief and what helps',
          'CASEL: Self-awareness',
          6,
          [
            N(
              'When someone dies, their body stops working and cannot start again. Grief can feel like sadness, anger, tiredness, or even a sudden laugh.',
            ),
            N(
              'All of that is normal. It helps to tell someone, remember the person together, and do something in their honour.',
            ),
          ],
          'Learned what dying means, that grief has many feelings, and what helps.',
        ),
        notice(
          'science',
          'how a manta ray feeds',
          '4-LS1-1',
          7,
          [
            N(
              'A real manta ray can have a wingspan of up to about seven metres. It eats tiny drifting animals called plankton, which it strains from the water as it swims.',
            ),
            N(
              'Two flaps on either side of its mouth, called cephalic fins, help funnel the water in.',
            ),
          ],
          'Learned how a manta ray’s body helps it feed on plankton.',
        ),
      ],
    ),
  ],
  [gloss('elders', 'The oldest and most respected people in a community.', 'a10-05-council')],
);

const Q06: EduQuest = quest(
  'a10-06',
  'Maui',
  {
    'a10-06-s1': g('Ride out the storm in the canoe.', 'Bail water and hold on to the mast.'),
    'a10-06-s2': g('Meet the demigod on his rock.', 'Walk up the beach towards the giant shadow.'),
    'a10-06-s3': g(
      'Get out of the cave Maui shut you in.',
      'Climb up inside the great carved figure to the hole at the top.',
    ),
  },
  [
    sc(
      'a10-06-storm',
      [
        N(
          'The first day is blue and easy. Your Nubbin and Heihei come out of the hull and sit on the deck, both looking surprised to be at sea.',
        ),
        M('Gramma said to sail by the hook-shaped stars. Those. There. I think. Maybe.', 'think'),
        N(
          'On the second night a storm comes up out of nowhere, black and loud, and the sea stands up in hills.',
        ),
        M('Bail! Bail, and hold on to something!', 'shock'),
        N(
          'You bail with a coconut shell. Your Nubbin bails with its hands, very fast, mostly onto you.',
        ),
        N(
          'A wave the size of the meeting house rolls the canoe over, and everything goes dark and cold and loud.',
        ),
      ],
      [
        notice(
          'social-studies',
          'Maui’s fishhook in the stars',
          '5-ESS1-2',
          1,
          [
            N(
              'In Hawaiʻi and across Polynesia, the curved tail of the constellation Scorpius is told as Maui’s great fishhook.',
            ),
            N('Navigators used it, with other stars, to keep their direction on the open sea.'),
          ],
          'Learned that Polynesian stories see Maui’s fishhook in the constellation Scorpius.',
        ),
        notice(
          'science',
          'how tropical storms form',
          '3-ESS2-1',
          2,
          [
            N(
              'Tropical storms grow over warm ocean water, about 26.5 °C (80 °F) or more, where warm, moist air rises and spins.',
            ),
            N(
              'Pacific sailors learned the signs of a coming storm: swell patterns, wind shifts and clouds.',
            ),
          ],
          'Learned that tropical storms form over warm seas, and that sailors read the signs.',
        ),
      ],
    ),
    sc(
      'a10-06-storm-done',
      [
        N(
          'You wake on a beach with sand in your mouth. The canoe lies tipped on its side nearby, and Moana is shaking water out of her ears.',
        ),
        N('Your Nubbin is asleep on top of Heihei, who hasn’t noticed.'),
      ],
      [
        ask(
          'literacy',
          'what makes a line funny',
          'RL.3.3',
          1,
          [
            N(
              '“Your Nubbin is asleep on top of Heihei, who hasn’t noticed.” What makes this line funny?',
            ),
          ],
          [
            opt(
              'Heihei is too oblivious to notice, right after a terrifying storm',
              [N('Yes. The calm, silly detail contrasts with the danger just before it.')],
              true,
            ),
            opt('Heihei is badly hurt', [
              N('Nobody is hurt. The humour comes from Heihei being clueless.'),
            ]),
            opt('Nubbins always sleep on chickens', [
              N('The joke is about this moment, and about Heihei missing everything.'),
            ]),
          ],
          'Explained how a calm, silly detail after a scary scene creates humour.',
        ),
      ],
    ),
    sc(
      'a10-06-maui',
      [
        N(
          'A shadow falls across the beach. It belongs to a man the size of a small hill, with hair like a storm cloud and a broad grin.',
        ),
        N(
          'Every part of his skin that you can see is covered in tattoos. Each one is a picture of a great deed.',
        ),
        MU(
          'Visitors! At last. A thousand years on a rock, and finally, an audience. You’ll want to know who I am.',
          'happy',
        ),
        MU(
          'Maui. I pulled islands up out of the sea on a fishing line. I slowed the sun so your days would be long enough.',
        ),
        MU(
          'I brought fire down to people so they could cook. Most people like to say thank you. Some of them cry. Either is fine.',
        ),
        N('He leans down to your Nubbin, which leans back.'),
        MU('And what is this? A coconut with opinions?', 'think'),
        M(
          'My island is dying because of what you took. I’m Moana, and you’re coming with me to put it back.',
          'angry',
        ),
        MU('Am I.', 'think'),
      ],
      [
        notice(
          'social-studies',
          'tattoo as a record, with respect',
          'D2.His.2.K-2',
          1,
          [
            N(
              'In many Pacific cultures, tattoo (tatau in Samoa, tā moko in Aotearoa, kākau in Hawaiʻi) records a person’s family, rank and deeds.',
            ),
            N(
              'Trained experts make them, and they are sacred and personal: not decoration to copy for fun.',
            ),
          ],
          'Learned that traditional Pacific tattoos record family and deeds and deserve respect.',
        ),
        ask(
          'sel',
          'pride and boasting',
          'CASEL: Self-awareness',
          4,
          [
            N(
              'Maui lists his great deeds and says some people cry with thanks. Is there a difference between being proud of what you have done and boasting?',
            ),
          ],
          [
            think('Pride is quiet and boasting is loud', [
              N('That is one way to tell. Boasting often wants others to react.'),
            ]),
            think('Boasting is pride that needs an audience', [
              N('A sharp answer. Maui does call his visitors an audience.'),
            ]),
            think('They are the same thing', [
              N('Some people feel that way. Ask what each one wants from other people.'),
            ]),
          ],
          'Thought about the difference between being proud and boasting.',
        ),
      ],
      {
        choices: [
          {
            id: 'thank',
            label: 'Thank him for the long days.',
            then: [
              MU('See? Somebody was brought up properly.', 'happy'),
              N('Moana gives you a long look. You are supposed to be on her side.'),
            ],
          },
          {
            id: 'behind',
            label: 'Keep your Nubbin behind your legs.',
            then: [
              N(
                'Your Nubbin peers round your knee at him, and Maui peers back. Your Nubbin doesn’t blink first, which bothers him more than it should.',
              ),
            ],
          },
        ],
      },
    ),
    sc(
      'a10-06-maui-done',
      [
        MU(
          'Thanks for the boat, by the way. I’ve been waiting a very long time for a boat.',
          'happy',
        ),
      ],
      [
        ask(
          'literacy',
          'what a quick line shows about a character',
          'RL.3.3',
          0,
          [N('Maui thanks you for the boat, “by the way.” What does that tell us about him?')],
          [
            opt(
              'He has already decided to take it, and the thanks is a polite excuse',
              [N('Yes. After a thousand years on a rock, a boat is exactly what he wants.')],
              true,
            ),
            opt('He is giving the boat back', [N('He is thanking you, not returning it.')]),
            opt('He does not care about boats', [
              N('He has waited a long time for one, so he cares a great deal.'),
            ]),
          ],
          'Read a throwaway line to understand a character’s plan.',
        ),
      ],
    ),
    sc(
      'a10-06-statue',
      [
        N(
          'Somehow, in the space of three boasts, he has herded you all into a cave and rolled a boulder over the mouth.',
        ),
        M('He’s taking the boat. He is taking my boat!', 'angry'),
        N(
          'Inside the cave there is a huge stone figure of Maui, carved by somebody who admired him very much. It is hollow.',
        ),
        N(
          'Moana starts climbing up inside it. You go after her, with your Nubbin riding on your shoulder.',
        ),
        N(
          'At the top is a hole, and through the hole is the sky, and far below is the sea and a canoe sailing away from the island.',
        ),
        M('Right.', 'angry'),
        N(
          'She jumps, and you shut your eyes and jump after her. Your Nubbin shuts its eyes too, which is unnecessary, as it is already falling.',
        ),
      ],
      [
        ask(
          'sel',
          'using anger well',
          'CASEL: Self-management',
          1,
          [
            N(
              'Moana is furious that Maui is taking her boat. What helps people use anger well, instead of just exploding?',
            ),
          ],
          [
            opt(
              'Breathe, then turn it into a plan, as Moana does by climbing out',
              [N('Yes. Anger can give you energy, and a plan points it somewhere useful.')],
              true,
            ),
            opt('Shout until it goes away', [
              N('Shouting lets off steam, but it rarely solves the problem.'),
            ]),
            opt('Pretend you are not angry', [
              N('Hiding it does not help. Naming it and steering it does.'),
            ]),
          ],
          'Talked about turning anger into a plan.',
        ),
        ask(
          'maths',
          'divide to find how long',
          '3.OA.A.3',
          6,
          [
            N(
              'Say the hollow statue is 30 metres tall and Moana climbs 5 metres each minute. How many minutes does she take to reach the top?',
            ),
          ],
          [
            opt('6 minutes', [N('Yes. 30 ÷ 5 = 6.')], true),
            opt('25 minutes', [N('25 is 30 − 5. Ask how many 5s fit into 30: 30 ÷ 5 = 6.')]),
            opt('150 minutes', [
              N('150 is 30 × 5. Division fits here: six 5-metre climbs make 30.'),
            ]),
          ],
          'Divided a height by a climbing rate to find the time.',
        ),
      ],
    ),
    sc(
      'a10-06-statue-done',
      [
        N(
          'The sea catches you all like a hand. It sets you on the canoe’s deck in a neat row, damp and blinking.',
        ),
      ],
      [
        ask(
          'literacy',
          'personification',
          'RL.4.3',
          0,
          [
            N(
              'In this story the ocean acts like a character that makes choices. Which detail shows this best?',
            ),
          ],
          [
            opt(
              'It sets you on the deck in a neat row, as though it cares',
              [
                N(
                  'Yes. Catching you like a hand and setting you down gently is how a person would act.',
                ),
              ],
              true,
            ),
            opt('It is blue and wet', [
              N('Those are facts about water. We want a detail that shows choice.'),
            ]),
            opt('It is very deep', [
              N('Depth is a fact too. Look for something the sea does on purpose.'),
            ]),
          ],
          'Found a detail that shows the sea acting like a character.',
        ),
      ],
    ),
    sc(
      'a10-06-complete',
      [
        MU('No. No, no. You can’t be on my boat.', 'shock'),
        M('Your boat?', 'angry'),
        N(
          'He picks Moana up and drops her over the side. The sea puts her straight back on the deck.',
        ),
        N(
          'He does it again. The sea puts her back again, slightly wetter, with an air of patience.',
        ),
        N('He tries it with your Nubbin. The sea puts your Nubbin back on his head.'),
        MU(
          'Fine. Fine! The ocean’s on your side. The ocean was always a bit of a show-off.',
          'angry',
        ),
        N(
          'Heihei walks across the deck, off the edge, and into the sea. The sea puts him back too, and he doesn’t notice that either.',
        ),
      ],
      [
        ask(
          'maths',
          'add to find a total',
          '2.OA.A.1',
          6,
          [
            N(
              'The sea puts Moana back twice, your Nubbin once, and Heihei once. How many times does the sea put someone back on board?',
            ),
          ],
          [
            opt('4', [N('Yes. 2 + 1 + 1 = 4.')], true),
            opt('3', [N('Count again: Moana twice, Nubbin once, Heihei once. 2 + 1 + 1 = 4.')]),
            opt('5', [N('That is one too many. Moana 2, Nubbin 1, Heihei 1 makes 4.')]),
          ],
          'Added small numbers to count how often the sea returned the passengers.',
        ),
      ],
    ),
  ],
  [
    gloss(
      'tattoo',
      'A design marked into the skin for life. In many Pacific cultures, tattoos record a person’s family and deeds, and are made by trained experts.',
      'a10-06-maui',
    ),
    gloss(
      'deed',
      'Something a person does, especially something brave or important.',
      'a10-06-maui',
    ),
  ],
);

const Q07: EduQuest = quest(
  'a10-07',
  'The Kakamora',
  {
    'a10-07-s1': g(
      'Watch the strange boat come out of the fog.',
      'Stand at the stern and look into the fog bank.',
    ),
    'a10-07-s2': g(
      'Get Heihei back from the pirates.',
      'Follow Moana across to the big raft. Your Nubbin will be welcome there.',
    ),
    'a10-07-s3': g(
      'Get the canoe clear of the pirate raft.',
      'Take the sheet line and hold the sail tight while Maui steers.',
    ),
  },
  [
    sc(
      'a10-07-fog',
      [
        N('Maui has agreed to nothing, but he is steering, which Moana is counting as a start.'),
        N(
          'A fog bank lies across the sea ahead. Out of it comes a sound of drums, and then a boat made of driftwood and lashed-together logs.',
        ),
        N(
          'Then another boat, and another, all joined into one great floating raft, crewed by little round people in coconut armour.',
        ),
        N(
          'Each one has a face painted on the front of its coconut. Some faces are fierce; some are just very proud of their paint.',
        ),
        MU(
          'Kakamora. Pirates. Everything they see, they take. Including small things. Including you.',
          'shock',
        ),
        N(
          'Your Nubbin looks at the Kakamora, and the Kakamora look at your Nubbin. A long, round silence passes between them.',
        ),
      ],
      [
        notice(
          'science',
          'how sea fog forms',
          '3-ESS2-1',
          1,
          [
            N(
              'Fog forms when warm, moist air drifts over cooler water. The air cools, and its water vapour turns into tiny droplets that hang in the air.',
            ),
            N('Fog is really a cloud sitting on the sea, which is why it is so hard to see far.'),
          ],
          'Learned that fog is a cloud at the surface, formed when warm moist air cools.',
        ),
        ask(
          'maths',
          'multiply to find a total',
          '3.OA.A.1',
          3,
          [
            N(
              'Say the raft is made of 5 boats, and each boat has 8 Kakamora. How many Kakamora in all?',
            ),
          ],
          [
            opt('40', [N('Yes. Five groups of 8: 5 × 8 = 40.')], true),
            opt('13', [N('13 is 5 + 8. There are 5 groups of 8, so multiply: 5 × 8 = 40.')]),
            opt('58', [N('That joins the digits. Multiply instead: 5 × 8 = 40.')]),
          ],
          'Multiplied equal groups to count a crowd.',
        ),
      ],
      {
        choices: [
          {
            id: 'wave',
            label: 'Let your Nubbin wave at them.',
            then: [
              N(
                'Your Nubbin waves. Forty coconuts wave back, slowly, all at once, which is somehow worse than drums.',
              ),
            ],
          },
          {
            id: 'hold',
            label: 'Scoop your Nubbin up and hold it close.',
            then: [
              N(
                'You pick your Nubbin up. Across the water, several painted faces look hurt, and one of them looks at you.',
              ),
            ],
          },
        ],
      },
    ),
    sc(
      'a10-07-fog-done',
      [
        M('Why are they looking at it like that?', 'think'),
        MU('They think it’s one of theirs. A little one. That has lost its coconut.', 'think'),
      ],
      [
        ask(
          'literacy',
          'a character’s point of view',
          'RL.3.6',
          1,
          [
            N(
              'Maui says the Kakamora think your Nubbin is “one of theirs.” From their side, what is happening, and do they believe they are being bad?',
            ),
          ],
          [
            think('They think they are welcoming a lost friend', [
              N('That fits what they do next. Someone can act kindly and still be a pirate.'),
            ]),
            think('They know they are pirates and do not mind', [
              N('Possible. People do not always see themselves as the villain, though.'),
            ]),
            think('They do not think much at all, they just love shiny small things', [
              N('A fair guess. Their fondness for your Nubbin is simple and warm.'),
            ]),
          ],
          'Considered how the Kakamora see a situation differently from the heroes.',
        ),
      ],
    ),
    sc(
      'a10-07-chase',
      [
        N(
          'Darts thunk into the deck as coconut-armoured pirates swarm aboard. One of them grabs Heihei and scampers off with him.',
        ),
        M('Heihei’s swallowed the heart! I saw him! He thought it was a pebble!', 'shock'),
        MU('Then I’d say goodbye to the heart. And the chicken. Lovely chicken.'),
        N(
          'Moana jumps across to the pirate raft. Your Nubbin, after a moment’s thought, jumps after her.',
        ),
        N(
          'The Kakamora part to let it through, and some of them pat it. One of them paints a fierce face on its tummy.',
        ),
        N(
          'Your Nubbin walks straight through their ranks to Heihei, picks him up under one arm, and walks back out again.',
        ),
        N(
          'Nobody stops it. They are too busy cheering what they think is the smallest pirate they have ever seen.',
        ),
      ],
      [
        notice(
          'science',
          'why chickens swallow stones',
          '4-LS1-1',
          1,
          [
            N(
              'Heihei thought the heart was a pebble, and real chickens do swallow small stones on purpose.',
            ),
            N(
              'The stones sit in a muscular part of the body called the gizzard and help grind up hard seeds, since chickens have no teeth.',
            ),
          ],
          'Learned that chickens swallow small stones to grind food in their gizzards.',
        ),
      ],
    ),
    sc(
      'a10-07-chase-done',
      [
        N(
          'Moana swings back across on a rope with your Nubbin clinging to her back, and Heihei clinging to your Nubbin.',
        ),
        N('Heihei is calmly eating a dart.'),
      ],
      [
        ask(
          'literacy',
          'multiple meanings of a word',
          'L.3.4',
          1,
          [
            N(
              'Heihei is “calmly eating a dart”, a small pointed missile. What else can the word “dart” mean?',
            ),
          ],
          [
            opt(
              'To move suddenly and quickly',
              [N('Yes. A fish can dart away, and Moana darts across the raft.')],
              true,
            ),
            opt('To sleep for a long time', [N('Not that. To dart is to dash quickly.')]),
            opt('A kind of drum', [N('A drum is a drum. “Dart” as a verb means to move fast.')]),
          ],
          'Learned a second meaning of “dart”.',
        ),
      ],
    ),
    sc(
      'a10-07-escape',
      [
        MU('Hold that line! Tighter! No, the other line!', 'angry'),
        N('You hold a rope that hums like a bowstring. The canoe leans over and leaps away.'),
        N('The raft comes after you, drums going, faster than anything that big should be.'),
        N('Moana scrambles to the bow, finds the gap between two raft-boats, and points.'),
        M('There! Go between them!'),
        N(
          'Maui swings the steering oar and the canoe shoots through the gap. Behind you, the two halves of the raft bump, and come unlashed.',
        ),
      ],
      [
        notice(
          'science',
          'sails and forces',
          '3-PS2-1',
          1,
          [
            N(
              'Wind pushes on a sail. Pulling the rope, called the sheet, changes the angle of the sail to the wind, so the push can drive the canoe forward or sideways.',
            ),
            N(
              'Sailors balance that push against the water’s grip on the hulls, trimming the sheet as the wind changes.',
            ),
          ],
          'Learned that the angle of a sail changes how the wind pushes a canoe.',
        ),
      ],
    ),
    sc(
      'a10-07-escape-done',
      [N('The pirates drift away in the fog, drumming crossly, in two directions at once.')],
      [
        ask(
          'literacy',
          'multiple meanings of a word: cross',
          'L.3.4',
          0,
          [
            N(
              'The pirates drift off “drumming crossly.” The word cross has more than one meaning. Which one fits here?',
            ),
          ],
          [
            opt(
              'Grumpy and annoyed',
              [N('Yes. Crossly means in a grumpy way. They are cross about losing Heihei.')],
              true,
            ),
            opt('Going from one side to the other', [
              N('That is another meaning: you cross the sea. Here crossly means grumpily.'),
            ]),
            opt('Shaped like an X', [
              N('A cross can be an X shape, but crossly describes their mood: grumpy.'),
            ]),
          ],
          'Chose the right meaning of a word with several meanings (cross).',
        ),
      ],
    ),
    sc(
      'a10-07-complete',
      [
        N(
          'Heihei coughs up the green stone onto the deck with no fuss at all. Moana washes it, twice.',
        ),
        M('Now. You’ll help me. You owe me. I saved your boat.', 'happy'),
        MU('My boat.', 'angry'),
        MU(
          'Listen. Te Fiti’s heart has a demon of fire guarding it. Te Kā. I can’t get past Te Kā without my hook.',
        ),
        MU(
          'And my hook is at the bottom of the world, in the Realm of Monsters. And you can’t even sail.',
          'think',
        ),
        M('Then teach me.'),
        N(
          'Your Nubbin still has a fierce face painted on its tummy. It looks down at it, often, with pride.',
        ),
      ],
      [
        ask(
          'social-studies',
          'fairness and claims',
          'D2.Civ.8.K-2',
          1,
          [
            N(
              'Moana says, “You owe me. I saved your boat.” Maui answers, “My boat.” Does saving something give you a claim on it?',
            ),
          ],
          [
            think('Saving it earns thanks, not ownership', [
              N('A clear view. Gratitude and ownership are different things.'),
            ]),
            think('Yes, Maui owes her something for it', [
              N('Perhaps a favour, even if not the boat. Debts of kindness are real.'),
            ]),
            think('It depends who owned the boat first', [
              N('Fair. Who built or found it matters in deciding whose it is.'),
            ]),
          ],
          'Thought about whether doing someone a favour gives a claim on what you saved.',
        ),
        ask(
          'sel',
          'asking for help when you are cross',
          'CASEL: Relationship skills',
          5,
          [
            N(
              'Moana asks Maui to teach her, even though she is cross with him. Why is asking hard, and why is it brave?',
            ),
          ],
          [
            opt(
              'It means putting pride aside to get something that matters',
              [N('Yes. Asking means admitting you need something, and that takes courage.')],
              true,
            ),
            opt('It is easy, so it is not brave', [
              N(
                'It can feel easy, but when you are cross with someone it is very hard to ask them for help.',
              ),
            ]),
            opt('Nobody should ever ask for help', [
              N('Everyone needs help sometimes. Asking is how we learn.'),
            ]),
          ],
          'Talked about why asking for help can be brave.',
        ),
      ],
    ),
  ],
  [gloss('armour', 'A hard covering worn to protect the body.', 'a10-07-fog')],
);

const Q08: EduQuest = quest(
  'a10-08',
  'Wayfinding',
  {
    'a10-08-s1': g(
      'Learn to read the stars with your hand.',
      'Sit at the stern after dark and hold your hand out to the horizon.',
    ),
    'a10-08-s2': g(
      'Feel the swell through the hull.',
      'Lie down on the deck and put one hand flat on the wood.',
    ),
    'a10-08-s3': g(
      'Watch for the bird that is going home.',
      'At dusk, keep watch from the bow for a single bird.',
    ),
  },
  [
    sc(
      'a10-08-stars',
      [
        N('Night falls clear. The sky is so full of stars that it looks crowded.'),
        MU(
          'Right. You want to sail, you start with the stars. Hold your hand out. Flat. Little finger on the line of the sea.',
        ),
        N(
          'Moana holds out her hand, and you hold out yours. Your Nubbin holds out something, roughly hand-shaped.',
        ),
        MU(
          'Stars rise in the same places on the sea’s edge, every night. Learn where each one comes up, and where it goes down.',
        ),
        MU(
          'Then you know which way you’re pointing. Your hand tells you how high it climbs at its highest, and that tells you how far north you are.',
        ),
        M('That’s it? That’s the secret?', 'think'),
        MU('That’s the first night of it. It takes years. Most of a life.', 'soft'),
      ],
      [
        notice(
          'science',
          'the star compass: stars rise and set at fixed points',
          '5-ESS1-2',
          1,
          [
            N(
              'This skill is called wayfinding. A navigator pictures the horizon as a ring of “houses”, and the Hawaiian star compass has 32 of them.',
            ),
            N(
              'Each star rises in its own house and sets in another, in the same places every night. Learn the houses and you can tell direction.',
            ),
          ],
          'Learned that stars rise and set at fixed points on the horizon, which wayfinders use as a compass.',
        ),
        ask(
          'maths',
          'multiply to estimate an angle',
          '3.OA.A.1',
          4,
          [
            N(
              'A closed fist held at arm’s length covers about 10 degrees of sky. If a star sits three fists above the horizon, about how high is it?',
            ),
          ],
          [
            opt('About 30 degrees', [N('Yes. Three fists of 10 degrees each: 3 × 10 = 30.')], true),
            opt('About 13 degrees', [
              N('13 is 3 + 10. Each fist is 10 degrees, so three fists are 3 × 10 = 30.'),
            ]),
            opt('About 3 degrees', [
              N('3 is the number of fists. Each one covers 10 degrees, so the height is 30.'),
            ]),
          ],
          'Used multiplication to estimate how high a star is with fists.',
        ),
      ],
    ),
    sc(
      'a10-08-stars-done',
      [
        N(
          'Moana checks her hand against the same star every few minutes, as if it might move without asking.',
        ),
      ],
      [
        ask(
          'literacy',
          'what actions show about a character',
          'RL.3.3',
          0,
          [
            N(
              'Moana checks her hand against the same star again and again. What does this tell us about the way she learns?',
            ),
          ],
          [
            opt(
              'She is eager and careful, and tests what she has just learned',
              [N('Yes. Checking and re-checking is how skills become reliable.')],
              true,
            ),
            opt('She does not trust Maui at all', [
              N('She trusts the lesson enough to practise it. She is testing herself, not him.'),
            ]),
            opt('She is bored', [
              N('Boredom would make her stop. She keeps checking because she cares.'),
            ]),
          ],
          'Read a character’s repeated action to understand how she learns.',
        ),
      ],
    ),
    sc(
      'a10-08-swell',
      [
        MU('Clouds come and cover the stars. Then what?'),
        M('Then… you’re lost?'),
        MU(
          'Lie down. Put your hand on the hull. Shut your eyes. And for once in your life, be quiet.',
          'think',
        ),
        N(
          'You lie on the warm wood. Underneath you, the canoe is lifting and falling, lifting and falling, slow as breathing.',
        ),
        MU(
          'That’s the big swell. It comes from far away, from the same quarter, for days. Keep it at the same angle, you keep your course.',
        ),
        MU(
          'And when it bounces off an island, it crosses itself. You can feel the island before you can see it.',
        ),
        N(
          'Moana lies very still. Her face changes, the way a face does when it hears its own name in a crowd.',
          'soft',
        ),
        M('There. Two. Two swells. One from there, one from there.', 'happy'),
      ],
      [
        notice(
          'science',
          'swells travel far and bend round islands',
          '4-PS3-2',
          5,
          [
            N(
              'Ocean swells can travel thousands of kilometres from a distant storm, keeping a steady direction for days.',
            ),
            N(
              'When a swell meets an island, it bends round it and crosses itself. Marshall Islanders even made “stick charts” of swell patterns to remember them.',
            ),
          ],
          'Learned that swells keep direction over long distances and bend around islands, which navigators feel.',
        ),
      ],
      {
        choices: [
          {
            id: 'feel',
            label: 'Feel for the second swell yourself.',
            then: [
              N(
                'You press your palm flat and wait. It takes a long time, and then there it is: a smaller lift, crossing the big one, like a second heartbeat.',
              ),
            ],
          },
          {
            id: 'nubbin',
            label: 'Let your Nubbin try.',
            then: [
              N(
                'Your Nubbin lies down with its whole face on the wood. Whatever it feels, it feels it very deeply, and falls asleep.',
              ),
            ],
          },
        ],
      },
    ),
    sc(
      'a10-08-swell-done',
      [MU('Huh. Not bad. Not good. Not bad.', 'think')],
      [
        ask(
          'sel',
          'honest feedback',
          'CASEL: Relationship skills',
          0,
          [
            N(
              'Maui says, “Not bad. Not good. Not bad.” How can honest, plain feedback like this help someone learn more than “perfect!” or “terrible!”?',
            ),
          ],
          [
            think('It shows how far there is to go without discouraging', [
              N('Yes, it says what is true and keeps the door open.'),
            ]),
            think('It can still feel a bit cold', [
              N('It can. Honest feedback works best when the learner knows you are on their side.'),
            ]),
            think('It depends on the person', [
              N('True. Some people like it blunt, others need warmth.'),
            ]),
          ],
          'Thought about how honest feedback helps someone learn.',
        ),
      ],
    ),
    sc(
      'a10-08-birds',
      [
        N(
          'At dusk, Maui sits at the bow beside your Nubbin. The two of them watch the sky with the same squint.',
        ),
        MU(
          'In the morning, fishing birds fly out from land. In the evening, they fly home to it. Watch which way they go.',
        ),
        N('A single white bird crosses the red sky, low and steady, in a hurry to be somewhere.'),
        N('Your Nubbin points at it with its whole arm. Then its whole body.', 'happy'),
        MU(
          'Good. That way’s land. And see that cloud? Green on its belly. That’s a lagoon under it, shining up.',
        ),
        M('Stars. Swells. Birds. Clouds.', 'think'),
        MU(
          'The rest is memory. Every turn you’ve made since your own beach, kept in your head in order. Lose that, and the sky can’t help you.',
          'soft',
        ),
      ],
      [
        notice(
          'science',
          'how land birds and clouds point to land',
          '3-LS4-3',
          1,
          [
            N(
              'Seabirds such as terns and noddies sleep on land but fish at sea. They fly out at dawn and return at dusk, so an evening bird shows the way home.',
            ),
            N(
              'Wayfinders also watch for a greenish glow on the underside of a cloud, which comes from light reflecting off a shallow lagoon beneath it.',
            ),
          ],
          'Learned how seabirds at dusk and the green glow under a cloud can point to land.',
        ),
        ask(
          'maths',
          'distance from speed and time (dead reckoning)',
          '4.MD.A.2',
          6,
          [
            N(
              'Maui keeps every stretch of the voyage in his head. If Moana sails east for 3 hours at 6 kilometres an hour, how far east has she come?',
            ),
          ],
          [
            opt(
              '18 kilometres',
              [
                N(
                  'Yes. 3 × 6 = 18. Keeping count of direction, speed and time like this is called dead reckoning.',
                ),
              ],
              true,
            ),
            opt('9 kilometres', [
              N('9 is 3 + 6. Each of the 3 hours covers 6 kilometres, so 3 × 6 = 18.'),
            ]),
            opt('2 kilometres', [
              N('2 is 6 ÷ 3. She goes 6 kilometres in every hour, so 3 hours make 18.'),
            ]),
          ],
          'Multiplied speed by time to find a distance, the sum behind dead reckoning.',
        ),
      ],
    ),
    sc(
      'a10-08-birds-done',
      [
        N(
          'Moana takes the steering oar for the first time. Maui lets her, which is the nicest thing he has done so far.',
        ),
      ],
      [
        notice(
          'social-studies',
          'Hōkūleʻa and Mau Piailug',
          'D2.His.2.K-2',
          0,
          [
            N(
              'In 1976 the double-hulled canoe Hōkūleʻa sailed from Hawaiʻi to Tahiti with no compass and no map.',
            ),
            N(
              'Its navigator, Mau Piailug of Satawal in Micronesia, shared his knowledge with Hawaiian sailors, who have carried it on ever since.',
            ),
          ],
          'Learned about the 1976 Hōkūleʻa voyage and the navigator Mau Piailug.',
        ),
      ],
    ),
    sc(
      'a10-08-complete',
      [
        N(
          'That night Moana sits up late, weaving with strips of pandanus leaf left over from patching the sail.',
        ),
        N(
          'In the morning there is a tiny woven sail tied to your Nubbin’s back, between its wings. It fits perfectly.',
        ),
        M('Every voyager needs a sail. Even a small one. Especially a small one.', 'happy'),
        N(
          'Your Nubbin turns round and round, trying to see it. Heihei turns round too, in solidarity, or by accident.',
        ),
      ],
      [
        ask(
          'maths',
          'pattern and division',
          '3.OA.A.3',
          1,
          [
            N(
              'Moana weaves in a pattern: over two strips, under one, over two, under one. In a row of 12 strips, how many does she pass under?',
            ),
          ],
          [
            opt(
              '4',
              [
                N(
                  'Yes. Each “over 2, under 1” group has 3 strips, so 12 ÷ 3 = 4 groups and 4 unders.',
                ),
              ],
              true,
            ),
            opt('6', [
              N('6 would be half of 12. Each group of 3 has only one “under”, so 12 ÷ 3 = 4.'),
            ]),
            opt('8', [
              N(
                '8 is the number of overs. The pattern has 2 overs for each under, so unders are 4.',
              ),
            ]),
          ],
          'Used a repeating pattern and division to count weaving strips.',
        ),
      ],
    ),
  ],
  [
    gloss(
      'wayfinding',
      'Finding your way across land or sea, without maps or instruments, using clues from nature.',
      'a10-08-stars',
    ),
    gloss(
      'horizon',
      'The line in the distance where the sea or land seems to meet the sky.',
      'a10-08-stars',
    ),
    gloss(
      'swell',
      'A long, smooth wave that rolls across the open sea, often from a storm far away.',
      'a10-08-swell',
    ),
    gloss(
      'pandanus',
      'A tropical plant with long, tough leaves that people weave into mats, baskets and sails.',
      'a10-08-complete',
    ),
  ],
);

const Q09: EduQuest = quest(
  'a10-09',
  'Lalotai',
  {
    'a10-09-s1': g(
      'Climb the tall rock at the edge of the world.',
      'Climb the stone pillar after Moana, ledge by ledge.',
    ),
    'a10-09-s2': g(
      'Find your way through the Realm of Monsters.',
      'Follow the glowing plants and keep your Nubbin close.',
    ),
    'a10-09-s3': g(
      'Get the hook back from the crab who has it.',
      'Keep Tamatoa talking while Moana works round behind him.',
    ),
  },
  [
    sc(
      'a10-09-pillar',
      [
        N('A stone pillar stands alone in the sea, so tall the top of it is in cloud.'),
        MU(
          'The way down to Lalotai is at the top. Yes, the way down is up. Don’t look at me like that. I didn’t build it.',
        ),
        N(
          'Maui climbs it the easy way, which is by being enormous. Moana climbs it the hard way, with her fingers and her toes.',
        ),
        N(
          'You climb behind her. Your Nubbin climbs behind you, holding your heel, which you would rather it didn’t.',
        ),
        N(
          'At the top there is a flat place, and a great carved stone, and the wind tugging at everything.',
        ),
        N(
          'Maui puts his hands on the stone and says some old words, low and quiet. The page doesn’t write them down.',
          'soft',
        ),
        N(
          'The rock opens like a mouth. Below it there is nothing at all, and a long way down, a glow.',
        ),
      ],
      [
        notice(
          'literacy',
          'a word’s parts: lalo and tai',
          'L.3.4',
          1,
          [
            N(
              'In Samoan, lalo means “below” and tai means “sea”, so Lalotai means “beneath the sea”. In some Pacific stories it is a realm under the ocean.',
            ),
            N('Knowing the parts of a word can help you work out what it means, in any language.'),
          ],
          'Learned that breaking a word into parts, here lalo and tai, can reveal its meaning.',
        ),
      ],
    ),
    sc(
      'a10-09-pillar-done',
      [
        MU('Wait here. This is a monster realm. No place for a… Moana? Moana!', 'shock'),
        N('She has already jumped, and so has your Nubbin. You sigh, and jump after them.'),
      ],
      [
        ask(
          'sel',
          'courage and caution',
          'CASEL: Responsible decision-making',
          1,
          [
            N(
              'Moana jumps into the unknown, and her courage is real. What would make her jump wiser?',
            ),
          ],
          [
            opt(
              'Taking a moment to look and think about what could go wrong, then deciding',
              [N('Yes. Courage with a moment of thought is the strongest kind.')],
              true,
            ),
            opt('Waiting until it is completely safe', [
              N('Nothing new is ever completely safe. A pause and a plan is the aim.'),
            ]),
            opt('Never jumping', [
              N('That would keep her safe, but she would never find the hook.'),
            ]),
          ],
          'Talked about combining courage with a moment of careful thought.',
        ),
      ],
    ),
    sc(
      'a10-09-depths',
      [
        N(
          'You land on something soft that turns out to be a giant flower, which closes up a little, interested.',
        ),
        N(
          'Lalotai is upside down. The sea is the sky here, a far-off ripple overhead, and everything below glows: purple, green, gold.',
        ),
        N(
          'Plants swing round to watch you pass. Something with too many eyes blinks at you from a crack, and decides not to bother.',
        ),
        M(
          'Maui’s hook. He said it would be with something that collects things. Something that likes shiny things.',
          'think',
        ),
        N('Your Nubbin’s emote ball floats above its head, glowing softly, as it always does.'),
        N('A lot of eyes in the dark turn towards it at once.', 'shock'),
      ],
      [
        notice(
          'science',
          'bioluminescence in real deep-sea animals',
          '4-PS3-2',
          4,
          [
            N(
              'The glowing plants are made up, but real deep-sea animals, like some jellyfish and anglerfish, do make light inside their bodies. It is called bioluminescence.',
            ),
            N(
              'They glow to find food, to scare enemies, or to find a mate in water where sunlight never reaches.',
            ),
          ],
          'Learned that some real deep-sea animals make their own light.',
        ),
      ],
    ),
    sc(
      'a10-09-depths-done',
      [
        N(
          'A trail of shining things leads down into a cave: shells, bones, a lost earring, a whole fishing canoe painted gold.',
        ),
      ],
      [
        ask(
          'maths',
          'multiply to count piles',
          '3.OA.A.3',
          0,
          [
            N(
              'Say the shiny trail has 7 piles of shells, with 8 shells in each pile. How many shells in all?',
            ),
          ],
          [
            opt('56', [N('Yes. 7 × 8 = 56.')], true),
            opt('15', [N('15 is 7 + 8. Seven piles of 8 means 7 × 8 = 56.')]),
            opt('48', [N('48 is 6 × 8. With seven piles, it is 7 × 8 = 56.')]),
          ],
          'Multiplied piles by shells to find a total.',
        ),
      ],
    ),
    sc(
      'a10-09-lair',
      [
        N(
          'At the bottom of the cave is a crab the size of a house. His shell is crusted all over with treasure, and he is admiring it.',
        ),
        N('On the very top of his shell, among the gold, is a huge fish hook carved from bone.'),
        TM(
          'Visitors. How rare. Most things that come down here are lunch, and lunch doesn’t usually knock.',
        ),
        TM('Oh. Oh, what is that? On the little round one. The floating thing. It glows.', 'happy'),
        N('He leans right down to your Nubbin’s emote ball, his eyes on stalks, very close.'),
        TM(
          'I must have it. It would go just here, by my left eye. Everyone would look at it, and then at me.',
          'happy',
        ),
        N('Your Nubbin, worried, turns its ball into a question mark. Tamatoa gasps with delight.'),
        TM('It does tricks!', 'shock'),
      ],
      [
        ask(
          'sel',
          'why people want things',
          'CASEL: Self-awareness',
          5,
          [
            N(
              'Tamatoa wants the glowing ball so everyone will look at it, and then at him. Why do people want things, and is wanting to be admired wrong?',
            ),
          ],
          [
            think('To feel valued', [
              N('That is often true. The trouble comes when things are the only way we feel it.'),
            ]),
            think('Because beautiful things bring joy', [
              N(
                'A fair reason. Collecting what you love is different from needing it to impress people.',
              ),
            ]),
            think('It is a way of showing off, and that is fine in small amounts', [
              N('An honest view. Wanting to be seen is human; what matters is how far it goes.'),
            ]),
          ],
          'Thought about why people want things and whether wanting admiration is wrong.',
        ),
      ],
      {
        choices: [
          {
            id: 'show',
            label: 'Let your Nubbin show off its ball.',
            then: [
              N(
                'Your Nubbin makes a heart, a spiral, a plain ball, an exclamation mark. Tamatoa claps his claws, completely lost.',
              ),
            ],
          },
          {
            id: 'ask',
            label: 'Ask Tamatoa about his shell.',
            then: [
              TM(
                'Since you ask. Every piece is a story, and every story is about me. Let me start at the bottom left…',
                'happy',
              ),
            ],
          },
        ],
      },
    ),
    sc(
      'a10-09-lair-done',
      [
        N(
          'Behind him, Moana has climbed up his shell with her hands full of glowing weed, and is quietly lifting off the hook.',
        ),
      ],
      [
        notice(
          'science',
          'crabs and the real coconut crab',
          '4-LS1-1',
          0,
          [
            N(
              'Crabs have a hard outer skeleton and shed it as they grow. The real coconut crab of the Pacific, the largest land crab, climbs palms and cracks coconuts.',
            ),
            N(
              'Tamatoa is a story, but some crabs, called decorator crabs, really do stick seaweed and sponges on their shells as camouflage.',
            ),
          ],
          'Learned about crab bodies, the coconut crab, and how crabs decorate their shells.',
        ),
      ],
    ),
    sc(
      'a10-09-complete',
      [
        TM('Wait. That’s mine. Everything here is mine.', 'angry'),
        N(
          'Moana throws the hook to Maui, and Maui catches it. Tamatoa turns, and turns, and topples onto his back with his legs waving.',
        ),
        TM('Somebody turn me over! This is very undignified! I am never undignified!', 'angry'),
        N(
          'A geyser of warm water bursts up from the floor and carries all of you, very fast, back up into the real sky.',
        ),
        N(
          'You land in the sea beside the canoe. Your Nubbin lands in it too, and the paint on its tummy finally washes off.',
        ),
        N(
          'Down below, faintly, you can still hear Tamatoa asking for help, and also for compliments.',
        ),
      ],
      [
        notice(
          'literacy',
          'the prefix un- in undignified',
          'L.3.4',
          2,
          [
            N(
              'Tamatoa says he is never undignified. Dignified means calm and grand, and the prefix un- means not.',
            ),
            N(
              'So undignified means not grand at all: stuck on your back with your legs waving, for example.',
            ),
          ],
          'Used the prefix un- to work out the meaning of undignified.',
        ),
      ],
    ),
  ],
  [
    gloss('realm', 'A kingdom, or a place with its own rules and creatures.', 'a10-09-pillar-done'),
    gloss(
      'undignified',
      'Looking silly or embarrassed, instead of calm and grand.',
      'a10-09-complete',
    ),
    gloss(
      'bioluminescence',
      'Light made by a living thing, like the glow of some deep-sea animals.',
      'a10-09-depths',
    ),
  ],
);

const Q10: EduQuest = quest(
  'a10-10',
  'The Hook',
  {
    'a10-10-s1': g(
      'Watch Maui try to change shape.',
      'Keep well back on the deck while Maui practises.',
    ),
    'a10-10-s2': g(
      'Sit with Maui while he tells you about his tattoos.',
      'Sit down near Maui at the stern. Don’t push.',
    ),
    'a10-10-s3': g(
      'Help Maui find his hawk.',
      'Hold the canoe steady and steer into the wind while Maui tries again.',
    ),
  },
  [
    sc(
      'a10-10-practice',
      [
        MU('Right. Now we’re back in business. Hawk.', 'happy'),
        N('There is a flash of light. Where Maui was, there is a fish, flapping on the deck.'),
        MU('Hawk!', 'angry'),
        N('A flash, and a pig. Your Nubbin and Pua would have got on.'),
        MU(
          'A thousand years without it. It’s like a muscle. It’s like… stop laughing. Hawk!',
          'angry',
        ),
        N(
          'A flash. Something with a hawk’s wings and a shark’s head flops off the side of the canoe into the sea.',
        ),
        N('Your Nubbin, to be supportive, flaps its own wings. It doesn’t take off either.'),
      ],
      [
        notice(
          'science',
          'how fish, pigs and hawks breathe',
          '4-LS1-1',
          1,
          [
            N(
              'Maui turns into a fish, a pig, and a hawk. A fish takes oxygen from water through gills, while pigs and hawks breathe air into their lungs.',
            ),
            N('Each body is shaped for its habitat: fins to swim, legs to run, and wings to fly.'),
          ],
          'Learned that gills, lungs and body shape suit each animal’s habitat.',
        ),
      ],
    ),
    sc(
      'a10-10-practice-done',
      [
        N(
          'Maui climbs back aboard as himself, dripping, and sits down hard at the stern with his back to everyone.',
        ),
      ],
      [
        ask(
          'sel',
          'frustration and starting again',
          'CASEL: Self-management',
          0,
          [
            N(
              'Maui is frustrated about losing a skill that used to be easy. What helps when we feel like that?',
            ),
          ],
          [
            opt(
              'Say how you feel, rest, then try again with kind people nearby',
              [
                N(
                  'Yes. Naming the feeling and having encouragement make it easier to start again.',
                ),
              ],
              true,
            ),
            opt('Never try again', [
              N('Giving up ends the frustration, but also the chance to improve.'),
            ]),
            opt('Blame everyone around you', [
              N('Blame is easy, but it makes the problem harder to fix.'),
            ]),
          ],
          'Talked about handling frustration when a skill feels harder than it used to.',
        ),
      ],
    ),
    sc(
      'a10-10-story',
      [
        N(
          'Nobody says anything for a long time. Moana sits near Maui, you sit near Moana, and your Nubbin sits nearest of all.',
        ),
        M('Your tattoos. Are they all things you did?'),
        MU(
          'Every one. I earned every one. The sun. The fire. The islands. The coconut. The wind.',
          'soft',
        ),
        M('There’s a space. On your back. With nothing in it.'),
        N('Maui is quiet for so long that you think he won’t answer.'),
        MU(
          'I wasn’t born a demigod. I was born a baby. To people. And they didn’t want me. They let the sea take me.',
          'sad',
        ),
        MU(
          'The gods found me. Made me what I am. And I went back to the people and gave them everything. Islands. Fire. Long days.',
          'sad',
        ),
        MU(
          'So they’d want me. So they’d love me. That’s what the gifts were for. All of them.',
          'sad',
        ),
        N('Moana doesn’t say anything for a moment. Then she says the true thing, plainly.'),
        M(
          'The gifts were kind. But nobody should have to earn being kept. Babies don’t. You didn’t.',
          'soft',
        ),
      ],
      [
        ask(
          'literacy',
          'a character’s motive',
          'RL.3.3',
          6,
          [N('Why did Maui give people islands, fire and long days?')],
          [
            opt(
              'He hoped they would love him and keep him',
              [
                N(
                  'Yes, he tells us so himself. His gifts were generous, but they came from a hurt.',
                ),
              ],
              true,
            ),
            opt('He wanted to show off', [
              N('He does like an audience, but he says his real reason was to be wanted.'),
            ]),
            opt('The gods ordered him to', [
              N('The gods made him what he is, but he says the giving was his own choice.'),
            ]),
          ],
          'Worked out a character’s hidden reason for his actions.',
        ),
        ask(
          'sel',
          'do we have to earn being kept?',
          'CASEL: Self-awareness',
          9,
          [
            N(
              'Moana says nobody should have to earn being kept. Thinking about why Maui gave so many gifts, do you agree?',
            ),
          ],
          [
            think('Yes. Everyone deserves love just for being themselves', [
              N('That is what Moana says. Gifts can be kind without being the price of belonging.'),
            ]),
            think('Mostly, but people also show love by giving', [
              N(
                'Giving is lovely. The trouble is when you give because you are afraid of being sent away.',
              ),
            ]),
            think('I am not sure', [
              N('That is honest. It is a big question, and the story is still working on it.'),
            ]),
          ],
          'Thought about whether love must be earned.',
        ),
      ],
      {
        choices: [
          {
            id: 'water',
            label: 'Pass him the water gourd.',
            then: [
              N(
                'You hand him the water. He takes it without looking, and holds it, and doesn’t drink, and doesn’t give it back.',
              ),
            ],
          },
          {
            id: 'closer',
            label: 'Say nothing. Sit a little closer.',
            then: [
              N(
                'You shift along the deck, not much. Your Nubbin, who has never understood not much, climbs into Maui’s lap and stays there.',
              ),
            ],
          },
        ],
      },
    ),
    sc(
      'a10-10-story-done',
      [N('Maui doesn’t answer. But he doesn’t turn his back again either.')],
      [
        ask(
          'literacy',
          'how actions show feelings',
          'RL.2.3',
          0,
          [
            N(
              'Maui does not answer, but he does not turn his back again either. What does this show?',
            ),
          ],
          [
            opt(
              'He is listening and feels a little less alone',
              [N('Yes. Staying turned toward someone can say what words cannot.')],
              true,
            ),
            opt('He is angry', [N('Angry people turn away. He is staying.')]),
            opt('He is falling asleep', [
              N('The line is about him opening up, not about tiredness.'),
            ]),
          ],
          'Read a character’s body language to understand a feeling.',
        ),
      ],
    ),
    sc(
      'a10-10-hawk',
      [
        M('Try again. Not because you have to. Because you can.'),
        MU('…Hawk.', 'think'),
        N('A flash, and the flash is softer this time.'),
        N(
          'A great hawk lifts off the stern, beats once, twice, and climbs into the sky in a long, wide spiral.',
          'happy',
        ),
        M('Ha! Look at him go!', 'happy'),
        N(
          'You hold the canoe into the wind. Your Nubbin stands on the bow with its arms up, as if it’s doing the flying.',
        ),
      ],
      [
        notice(
          'science',
          'how hawks use wind and wide wings',
          '4-LS1-1',
          3,
          [
            N(
              'A hawk has wide wings that catch rising air, so it can soar in great circles without flapping much. Birds usually take off facing the wind, for more lift.',
            ),
            N('That is why Moana has you hold the canoe into the wind.'),
          ],
          'Learned that hawks soar on rising air and take off into the wind.',
        ),
      ],
    ),
    sc(
      'a10-10-hawk-done',
      [
        N(
          'The hawk dives, pulls up just over the waves, and lands on the mast. It is very obviously grinning.',
        ),
      ],
      [
        ask(
          'maths',
          'a fraction of attempts',
          '3.NF.A.1',
          0,
          [
            N(
              'Maui tried four times: fish, pig and a hawk-shark came first, and the real hawk came fourth. What fraction of his tries made a proper hawk?',
            ),
          ],
          [
            opt('1/4', [N('Yes. One try out of four equal tries is one quarter.')], true),
            opt('1/3', [N('There were four tries in all, not three. One out of four is 1/4.')]),
            opt('3/4', [N('3/4 is the failed tries. The real hawk was 1 of the 4, so 1/4.')]),
          ],
          'Wrote a unit fraction for one success in four tries.',
        ),
      ],
    ),
    sc(
      'a10-10-complete',
      [
        MU('Did you see that? The roll at the end? I did a roll.', 'happy'),
        M('We saw. Everyone saw. The fish saw.', 'happy'),
        N(
          'He teaches her the rest that afternoon, properly: tacking, steering, reading the shapes of waves. He’s a good teacher, when he forgets to show off.',
        ),
        N(
          'That evening, Moana steers alone while Maui sleeps. Your Nubbin keeps watch beside her, until it doesn’t.',
        ),
      ],
      [
        notice(
          'sel',
          'practice and encouragement',
          'CASEL: Self-management',
          1,
          [
            N(
              'Maui relearned the hawk by trying, failing and trying again, with Moana saying “because you can”.',
            ),
            N(
              'Practice works best when it comes with encouragement rather than pressure, and a mistake is part of learning, not the end of it.',
            ),
          ],
          'Learned that practice with encouragement helps you improve and that mistakes are part of learning.',
        ),
      ],
    ),
  ],
  [gloss('demigod', 'In old stories, someone who is part god and part human.', 'a10-10-story')],
);

const Q11: EduQuest = quest(
  'a10-11',
  'Te Kā',
  {
    'a10-11-s1': g(
      'Sail up to the barrier islands at night.',
      'Keep watch from the bow as the canoe closes on the dark islands.',
    ),
    'a10-11-s2': g(
      'Get the canoe out from under the fire.',
      'Bail and hold the sail as Moana turns for the gap.',
    ),
    'a10-11-s3': g(
      'Stand by while Maui and Moana argue.',
      'Stay on the deck. This isn’t your argument.',
    ),
  },
  [
    sc(
      'a10-11-barrier',
      [
        N(
          'A ring of black islands lies across the sea, smoking. Behind them, faint and far, is the shape of a great green island, asleep.',
        ),
        MU(
          'Te Fiti’s behind the ring. And between us and her is Te Kā. Keep away from the shore. Let me go first.',
        ),
        M('I can get through. I know the swell now. There’s a gap.'),
        MU('Moana. Let me go first.'),
        N(
          'The ash on the black island moves, and stands up. It is a giant made of rock and fire, taller than the pillar at the edge of the world.',
        ),
        N(
          'Your Nubbin hides under the deck with Heihei, which is the first sensible thing either of them has done all trip.',
        ),
      ],
      [
        notice(
          'science',
          'how volcanic islands form',
          '2-ESS1-1',
          0,
          [
            N(
              'Many Pacific islands, including Hawaiʻi, began as volcanoes on the sea floor. Each eruption added lava that cooled to rock until the peak broke the surface.',
            ),
            N(
              'Over millions of years, the sea, wind and rain wear a volcanic island down, and corals build reefs around it.',
            ),
          ],
          'Learned how volcanic islands rise from the sea floor and slowly change.',
        ),
      ],
    ),
    sc(
      'a10-11-barrier-done',
      [N('Te Kā roars. It isn’t a word: it’s the sound of a mountain having a very bad day.')],
      [
        ask(
          'literacy',
          'personification',
          'L.4.5',
          0,
          [
            N(
              'Te Kā’s roar is “the sound of a mountain having a very bad day.” What does this phrase tell us about the roar?',
            ),
          ],
          [
            opt(
              'It is huge and angry, like a rumbling mountain',
              [N('Yes. Treating the mountain like a cross person gives the roar size and temper.')],
              true,
            ),
            opt('It is quiet and gentle', [
              N('A mountain in a bad mood is rumbling and angry, not gentle.'),
            ]),
            opt('The mountain is really speaking words', [
              N('The narrator says it is not a word. The phrase is a comparison.'),
            ]),
          ],
          'Explained how a funny comparison shows the size and anger of a roar.',
        ),
      ],
    ),
    sc(
      'a10-11-gap',
      [
        N('Moana turns for the gap. Maui flies as the hawk, at Te Kā’s face, to draw it off.'),
        N(
          'Te Kā swats at him with a hand like a hillside. He swerves, and dives, and comes back again.',
        ),
        M('Nearly. Nearly there!'),
        N('Te Kā turns from the hawk to the canoe. Its hand comes down.'),
        N(
          'Maui drops out of the sky in his own shape and blocks it with his hook. There is a crack like lightning.',
          'shock',
        ),
        N(
          'The wave throws the canoe backwards, out past the ring, far out into the dark sea. You hold on to anything you can.',
        ),
      ],
      [
        ask(
          'science',
          'light travels faster than sound',
          '4-PS3-2',
          4,
          [
            N(
              'Maui’s hook meets Te Kā’s hand with “a crack like lightning.” In real storms, why do we see lightning before we hear thunder?',
            ),
          ],
          [
            opt(
              'Light travels much faster than sound',
              [
                N(
                  'Yes. Light arrives almost at once, but sound is slow enough that you can count the gap.',
                ),
              ],
              true,
            ),
            opt('Thunder happens first but hides', [
              N('Both happen together. Light just reaches you far sooner.'),
            ]),
            opt('Sound is faster but louder things are slow', [
              N('Sound is much slower than light, whatever its loudness.'),
            ]),
          ],
          'Learned that light travels faster than sound.',
        ),
      ],
      {
        choices: [
          {
            id: 'line',
            label: 'Grab the sail line.',
            then: [
              N(
                'You get the line and keep it, though it burns your palms. The sail tears, but it stays on the canoe, because of you.',
              ),
            ],
          },
          {
            id: 'heihei',
            label: 'Grab Heihei, who has wandered out again.',
            then: [
              N(
                'You catch Heihei by the tail feathers as he strolls towards the edge. He looks at you as if you are the strange one.',
              ),
            ],
          },
        ],
      },
    ),
    sc(
      'a10-11-gap-done',
      [
        N(
          'When the sea is quiet again, the canoe is a long way off, with a torn sail. Te Kā’s glow sinks back down into the ash.',
        ),
      ],
      [
        ask(
          'maths',
          'distance, speed and time',
          '4.MD.A.2',
          0,
          [
            N(
              'Say the wave carried the canoe 3 kilometres from the barrier, and the canoe sails back at 1 kilometre every 20 minutes. How long does it take to return?',
            ),
          ],
          [
            opt(
              '60 minutes, or 1 hour',
              [N('Yes. 3 km at 20 minutes per km is 3 × 20 = 60 minutes.')],
              true,
            ),
            opt('23 minutes', [
              N('23 is 3 + 20. Each kilometre takes 20 minutes, so multiply: 3 × 20 = 60.'),
            ]),
            opt('20 minutes', [N('20 minutes is one kilometre. There are three, so 3 × 20 = 60.')]),
          ],
          'Used distance and speed to work out a journey time.',
        ),
      ],
    ),
    sc(
      'a10-11-crack',
      [
        N(
          'Maui is holding his hook in both hands. There is a crack running right through it, from the point nearly to the grip.',
        ),
        MU('I told you to turn back. I told you. Look at it.', 'angry'),
        M('We can fix it. We’ll try again. We’ll go round the other way.'),
        MU(
          'One more hit and it’s gone. That hook is the only thing anyone ever wanted from me. Break it, and there’s nothing left to want.',
          'angry',
        ),
        M('That’s not true. You know that’s not true.', 'sad'),
        MU('The sea should have asked somebody who listens.', 'angry'),
        N('That lands, and stays. Moana doesn’t answer.', 'sad'),
        MU('I’m sorry. I am. Good luck.', 'sad'),
        N(
          'There is a flash. A hawk lifts off the stern, and flies away to the north, and doesn’t look back.',
        ),
      ],
      [
        ask(
          'sel',
          'when someone leaves because they feel useless',
          'CASEL: Relationship skills',
          5,
          [
            N(
              'Maui decides to leave because his hook is cracked and he thinks nobody will want him. Was he right to go?',
            ),
          ],
          [
            think('Yes, it was honest of him to say he was sorry and step back', [
              N('He did apologise. But he left Moana alone with the problem.'),
            ]),
            think('No. He gave up on her and on himself', [
              N('A tough view. Notice that he comes back later.'),
            ]),
            think('He was scared, and fear makes people leave', [
              N('A kind reading. Fear can look like leaving, even when someone cares.'),
            ]),
          ],
          'Thought about why someone might leave when they feel useless.',
        ),
      ],
    ),
    sc(
      'a10-11-crack-done',
      [N('Moana watches until he is a speck, and then until he isn’t.', 'sad')],
      [
        ask(
          'literacy',
          'figurative meaning of a word',
          'L.3.4',
          0,
          [N('Moana watches “until he is a speck.” What does speck mean?')],
          [
            opt(
              'A tiny spot, because he is far away',
              [N('Yes. A speck is a very small dot, and a hawk far away looks like one.')],
              true,
            ),
            opt('A kind of bird', [N('Not a bird. A speck is a tiny spot.')]),
            opt('A big shadow', [N('The opposite: a speck is tiny.')]),
          ],
          'Worked out the meaning of “speck” from context.',
        ),
      ],
    ),
    sc(
      'a10-11-complete',
      [
        N(
          'Moana sits at the bow with the green stone in her hand. She doesn’t cry, which is worse.',
        ),
        M('I can’t do this. I’m not enough for it.', 'sad'),
        M('Find somebody who is. Please. Take it back.', 'sad'),
        N(
          'She leans over the side and holds out the stone. The sea rises up, gently, and takes it from her hand, and sinks back down.',
        ),
        N(
          'You don’t say anything; you sit down beside her. Your Nubbin comes out from under the deck and sits beside you.',
        ),
        N('The three of you sit like that, with Heihei, for a long time, while the canoe drifts.'),
      ],
      [
        notice(
          'sel',
          'company helps more than advice',
          'CASEL: Relationship skills',
          4,
          [
            N('You say nothing. You just sit beside Moana, and so does your Nubbin.'),
            N(
              'When someone is very discouraged, advice often does not help but company does. Sitting beside them says, “You are not alone.”',
            ),
          ],
          'Learned that sitting beside a discouraged friend can help more than advice.',
        ),
      ],
    ),
  ],
  [gloss('speck', 'A tiny spot.', 'a10-11-crack-done')],
);

const Q12: EduQuest = quest(
  'a10-12',
  'The Manta Ray',
  {
    'a10-12-s1': g(
      'Watch the light that comes up through the water.',
      'Look over the side of the canoe.',
    ),
    'a10-12-s2': g(
      'Watch the manta, and let your Nubbin answer it.',
      'Bring your Nubbin to the side and let it see the manta move.',
    ),
    'a10-12-s3': g('Listen to Gramma’s song.', 'Sit with Moana and Gramma under the stars.'),
  },
  [
    sc(
      'a10-12-light',
      [
        N('Late in the night, a soft blue light comes up through the sea under the canoe.'),
        N('It is a manta ray, glowing from inside, circling slowly round the hulls.'),
        N(
          'Moana looks up. Sitting at the stern, as if she has always been there, is Gramma Tala.',
          'soft',
        ),
        G('Well. You’re a long way past the reef.'),
        M('Gramma?', 'shock'),
        G(
          'I told you. I said I’d come back as one of those. Nobody listens to their grandmother.',
          'happy',
        ),
        N(
          'Moana goes to her and holds on, and Gramma holds on back. She is a bit see-through round the edges, but her arms are real enough.',
        ),
      ],
      [
        notice(
          'science',
          'manta rays',
          '4-LS1-1',
          1,
          [
            N(
              'Giant manta rays are the largest rays in the sea, up to about seven metres wide. They are gentle and harmless to people.',
            ),
            N(
              'They “fly” through the water with slow beats of their wing-like fins, gliding between beats, and they eat plankton.',
            ),
          ],
          'Learned that manta rays are huge, gentle plankton-eaters that “fly” through water.',
        ),
      ],
      {
        choices: [
          {
            id: 'room',
            label: 'Go to the bow and give them room.',
            then: [
              N(
                'You take your Nubbin to the bow and look at the stars for a while. Over Moana’s shoulder, Gramma catches your eye and nods.',
              ),
            ],
          },
          {
            id: 'hello',
            label: 'Bring your Nubbin to say hello.',
            then: [
              N(
                'Your Nubbin pats Gramma’s knee, very gently, as if checking that she is there. She is, just about.',
              ),
              G(
                'Hello, small one. Still a bit crooked? Good. Crooked is how you know it’s yours.',
                'happy',
              ),
            ],
          },
        ],
      },
    ),
    sc(
      'a10-12-light-done',
      [
        G(
          'I’m not here to tell you what to do. I never did that. I’m here because you’re sad, and I’m nosy.',
          'soft',
        ),
      ],
      [
        notice(
          'sel',
          'missing someone is a kind of love',
          'CASEL: Self-awareness',
          0,
          [
            N('Moana misses Gramma. Missing someone is one of the ways we go on loving them.'),
            N(
              'People keep their loved ones close by telling stories about them, keeping their words, and passing their skills on.',
            ),
          ],
          'Learned that missing someone is a form of love and that remembering keeps them close.',
        ),
      ],
    ),
    sc(
      'a10-12-manta',
      [
        N(
          'The manta turns in the water and rises, and moves along the side of the canoe with its great wings out wide and level.',
        ),
        N(
          'It isn’t swimming. It is gliding: leaning, letting the sea carry it sideways, never once flapping.',
        ),
        N('Your Nubbin stands up very slowly on the deck.'),
        N(
          'Then it spreads its arms, and leans, and slides along the planks on one foot, level and soft, the way Gramma taught it.',
          'happy',
        ),
        N(
          'The manta glides, and your Nubbin glides. They go up the side of the canoe together, the big one in the sea and the small one on deck.',
        ),
        G('There. You didn’t forget. I told you it doesn’t come off.', 'soft'),
        N('Moana laughs, wet-faced. It is the first time she has laughed since the barrier.'),
      ],
      [
        ask(
          'science',
          'how gliding differs from flapping',
          '4-LS1-1',
          1,
          [N('The manta “isn’t swimming, it is gliding.” Which of these is gliding?')],
          [
            opt(
              'Moving smoothly without flapping, carried by the water',
              [N('Yes. Gliding is moving without effort, using the flow around you.')],
              true,
            ),
            opt('Flapping hard to go faster', [
              N('Flapping is the opposite. Gliding is smooth and steady.'),
            ]),
            opt('Standing still', [N('A glider keeps moving. It just does not push hard.')]),
          ],
          'Defined gliding as smooth movement without flapping.',
        ),
      ],
    ),
    sc(
      'a10-12-manta-done',
      [
        G(
          'Things you’re taught with love, you keep. You don’t have to try. They stay put.',
          'soft',
        ),
      ],
      [
        ask(
          'literacy',
          'theme',
          'RL.4.2',
          0,
          [
            N(
              'Gramma says, “Things you’re taught with love, you keep.” What big idea (theme) is she giving Moana?',
            ),
          ],
          [
            opt(
              'What we learn from people who love us stays with us',
              [N('Yes. The step, the swells and the stories are all still Moana’s.')],
              true,
            ),
            opt('Dancing is better than sailing', [
              N('The theme is bigger than one skill. It is about what love leaves behind.'),
            ]),
            opt('Nothing can be learned', [
              N('The opposite: Gramma says what we learn with love lasts.'),
            ]),
          ],
          'Named the theme of a character’s words.',
        ),
      ],
    ),
    sc(
      'a10-12-song',
      [
        G('Tell me about yourself. Not the chief’s daughter bit. The rest.', 'soft'),
        M('I don’t know. I thought I did. I got it all wrong.', 'sad'),
        N(
          'Gramma doesn’t answer. She starts to sing instead, very low, an old voyaging song you have never heard.',
        ),
        N(
          'It has no words you can catch. It has the names of islands in it, and the names of people, one after another, going back and back.',
        ),
        N(
          'Overhead, the stars move. They become sails: the great canoes from the cave, crossing the sky, full of people looking down.',
        ),
        N('Your Nubbin looks up at them with its mouth open. One of the steerers waves.'),
        N('Moana stands. She is crying and she is standing up straight, both at once.'),
        M(
          'Everything I was taught, I’ve still got. Gramma’s stories. Dad’s care for people. Maui’s swells. None of it came off.',
          'soft',
        ),
        M('It doesn’t matter who picked me. I’m picking me. I’ll take it back myself.', 'happy'),
      ],
      [
        notice(
          'social-studies',
          'songs that carry knowledge',
          'D2.His.2.K-2',
          3,
          [
            N(
              'Pacific navigators sometimes memorised star paths and island names in songs and chants, so the knowledge could be passed on without writing.',
            ),
            N(
              'Gramma’s song has names in it, going back and back. The story does not write the song down, so it stays hers.',
            ),
          ],
          'Learned that songs and chants helped Pacific navigators remember and pass on knowledge.',
        ),
        ask(
          'sel',
          'who we are: given and chosen',
          'CASEL: Self-awareness',
          8,
          [
            N(
              'Moana says it does not matter who picked her: she is picking herself. Can we choose who we are, or is some of it given to us?',
            ),
          ],
          [
            think('We are given family and place, but we choose what we do with them', [
              N('A strong answer. Moana keeps everything she was taught and chooses her course.'),
            ]),
            think('We choose almost everything', [
              N(
                'Some people feel that way. Consider the things you did not pick, like where you were born.',
              ),
            ]),
            think('We are mostly given our lives', [
              N(
                'There is truth in that. Moana’s moment is about taking one thing back: the choice.',
              ),
            ]),
          ],
          'Thought about what in a person is given and what is chosen.',
        ),
      ],
    ),
    sc(
      'a10-12-song-done',
      [
        N(
          'She dives over the side, down and down into the dark, and comes up a long minute later with the green stone in her fist.',
        ),
      ],
      [
        ask(
          'literacy',
          'repetition for effect',
          'RL.2.4',
          0,
          [
            N(
              'The line says she dives “down and down into the dark.” Why does the writer repeat the word “down”?',
            ),
          ],
          [
            opt(
              'Repeating it makes the dive feel long and deep',
              [N('Yes. Repetition stretches time, so we feel every metre of the dive.')],
              true,
            ),
            opt('The writer forgot', [
              N('It is deliberate. Repeating a word can set a rhythm and a mood.'),
            ]),
            opt('It means she went up', [
              N('It means the opposite. “Down and down” is a deep dive.'),
            ]),
          ],
          'Explained how repeating a word changes the feel of a line.',
        ),
      ],
    ),
    sc(
      'a10-12-complete',
      [
        N(
          'When she climbs back aboard, the stern is empty. Out on the water, the manta turns once, and glides off towards Te Fiti.',
        ),
        N(
          'Moana mends the sail by starlight while you hold the edges. Your Nubbin holds Heihei, who is trying to eat the thread.',
        ),
        M('She’s not gone, is she? Not really.'),
        Y('I don’t think anybody you love is ever all the way gone.', 'soft'),
        M('No. I don’t either.', 'soft'),
        N(
          'At dawn she turns the canoe back towards the ring of black islands, and doesn’t hesitate.',
        ),
      ],
      [
        ask(
          'science',
          'why the Sun rises: the Earth spins',
          '5-ESS1-2',
          5,
          [N('Moana turns the canoe at dawn. Why does the Sun seem to rise every morning?')],
          [
            opt(
              'The Earth spins, turning our side towards the Sun',
              [
                N(
                  'Yes. The Earth keeps spinning, and as our side turns towards the Sun, it looks as if the Sun climbs up.',
                ),
              ],
              true,
            ),
            opt('The Sun travels round the Earth each day', [
              N(
                'People once thought so. In fact the Earth spins, and that makes the Sun seem to move.',
              ),
            ]),
            opt('The clouds move out of the way', [
              N('Clouds can hide the Sun, but dawn comes because the Earth turns us towards it.'),
            ]),
          ],
          'Learned that sunrise happens because the Earth spins.',
        ),
      ],
    ),
  ],
  [],
);

const Q13: EduQuest = quest(
  'a10-13',
  'Te Fiti',
  {
    'a10-13-s1': g(
      'Run the barrier again.',
      'Hold the sail while Moana weaves the canoe through the ring.',
    ),
    'a10-13-s2': g(
      'Look across at the island where Te Fiti should be.',
      'Climb the mast to see over the black rocks.',
    ),
    'a10-13-s3': g(
      'Walk the path behind Moana, in your own way.',
      'Follow Moana down the path through the sea. Choose how you go.',
    ),
  },
  [
    sc(
      'a10-13-run',
      [
        N(
          'This time Moana doesn’t go straight. She reads the swell bouncing off the black islands and sails the cross of it, left, right, left.',
        ),
        N(
          'Te Kā rises out of the ash, roaring. Its fire falls where the canoe was a moment ago, and never where it is.',
        ),
        M('Hold it! Hold it, now let go! Now!'),
        N('You let go of the sail line. The canoe spins round a rock as if it were dancing.'),
        N('Then Te Kā’s hand comes down ahead of you, and there is nowhere left to go.'),
        N(
          'And a hawk drops out of the sky, and turns into a man with a cracked hook, and stands in front of the canoe.',
          'shock',
        ),
        MU('Told you to let me go first.', 'happy'),
        M('You came back!', 'happy'),
        MU('I’ve got a lot of other tattoos. I could do with one I didn’t do for applause.'),
      ],
      [
        ask(
          'maths',
          'finding a term in a repeating pattern',
          '4.OA.C.5',
          0,
          [
            N(
              'Moana zig-zags through the ring: left, right, left, right, and so on. What is her 9th turn?',
            ),
          ],
          [
            opt(
              'Left, because odd turns are left',
              [N('Yes. Turns 1, 3, 5, 7 and 9 are left, and the even turns are right.')],
              true,
            ),
            opt('Right, because 9 is a big number', [
              N('Size does not decide it. Odd-numbered turns are left, and 9 is odd.'),
            ]),
            opt('It could be either', [N('The pattern fixes it. Turn 9 is odd, so it is left.')]),
          ],
          'Found the 9th item in a repeating pattern.',
        ),
        ask(
          'literacy',
          'what a character has understood',
          'RL.3.3',
          8,
          [N('Maui says he could do with “one I didn’t do for applause.” What has he understood?')],
          [
            opt(
              'A brave deed done because it is right is worth more than one done for praise',
              [N('Yes. He is finally acting from his own heart, not for a crowd.')],
              true,
            ),
            opt('He wants more tattoos', [
              N(
                'The tattoo is a way of saying something deeper: he wants to do good for its own sake.',
              ),
            ]),
            opt('He is joking about nothing', [
              N('There is humour, but the line shows real change in him.'),
            ]),
          ],
          'Understood how a character’s attitude has changed.',
        ),
      ],
    ),
    sc(
      'a10-13-run-done',
      [
        MU('Go! I’ll hold her! Go!'),
        N(
          'He meets Te Kā’s fist with the hook, and the crack spreads, and the hook breaks in his hands. He stands there anyway.',
        ),
      ],
      [
        notice(
          'sel',
          'courage while afraid',
          'CASEL: Self-management',
          1,
          [
            N(
              'Maui comes back, and stands in front of the danger he left behind. He is not unafraid.',
            ),
            N(
              'Courage does not mean having no fear. It means doing what matters while you are afraid.',
            ),
          ],
          'Learned that courage means acting while afraid, not having no fear.',
        ),
      ],
    ),
    sc(
      'a10-13-spiral',
      [
        N('Moana scrambles up the mast. You go up behind her, to see what she sees.'),
        N(
          'Past the ring of black islands, where the great green island should be sleeping, there is nothing. Only a hollow in the sea.',
          'shock',
        ),
        M('She’s gone. Te Fiti isn’t there.'),
        N(
          'Moana looks back at Te Kā. On its chest, among the cracks and the glowing rock, there is a mark: a spiral.',
        ),
        N(
          'It is the same spiral that is on the stone in her hand. The same spiral on the shell in your pocket.',
        ),
        M('Oh.', 'soft'),
        M(
          'She’s not guarding the heart. She is the heart’s home. She’s Te Fiti, without it.',
          'soft',
        ),
      ],
      [
        notice(
          'art',
          'spirals in nature and Pacific art',
          null,
          4,
          [
            N(
              'Spirals appear in nature: fern fronds unfurl in one, and many shells grow in one. In Aotearoa, the koru, an unfurling fern, is a spiral symbol of new life.',
            ),
            N(
              'Here the spiral on the stone, the shell and Te Kā’s chest is the story’s own sign that they belong together.',
            ),
          ],
          'Noticed spirals in nature and learned about the koru as a symbol of new life.',
        ),
        ask(
          'literacy',
          'making an inference',
          'RL.3.3',
          6,
          [
            N(
              'Moana says, “She’s not guarding the heart. She is the heart’s home.” What has she worked out about Te Kā?',
            ),
          ],
          [
            opt(
              'Te Kā is Te Fiti, who lost her heart and became furious',
              [
                N(
                  'Yes, the spiral is the clue. The scary one is the island, missing the thing that made her herself.',
                ),
              ],
              true,
            ),
            opt('Te Kā is a guard hired by Maui', [
              N('The spiral on her chest matches the stone, so she is more than a guard.'),
            ]),
            opt('Te Kā is a volcano with no feelings', [
              N('She is a volcano, but the story shows she has been hurting.'),
            ]),
          ],
          'Made an inference from a clue about who a character really is.',
        ),
      ],
    ),
    sc(
      'a10-13-spiral-done',
      [
        N(
          'Moana climbs down. She faces the open water between the canoe and Te Kā, and she holds up her hand.',
        ),
        N(
          'The sea parts. A path opens, wet sand and shells, straight from the canoe to the burning giant.',
          'shock',
        ),
      ],
      [
        notice(
          'science',
          'tides can uncover paths of sand',
          '1-ESS1-1',
          1,
          [
            N(
              'Real seas do not part on command. But at low tide, some sandbars are uncovered, and people can walk across to small islands.',
            ),
            N(
              'Tides rise and fall about twice a day, mostly because of the pull of the Moon, so the path is covered again later.',
            ),
          ],
          'Learned that low tide can uncover sandy paths, and that the Moon mostly causes the tides.',
        ),
      ],
    ),
    sc(
      'a10-13-walk',
      [
        N(
          'Moana walks down the path through the sea. Te Kā sees her, and turns, and comes roaring down to meet her.',
        ),
        N('She doesn’t run, or raise a hand. She keeps walking.'),
        N(
          'You step down onto the wet sand behind her, with your Nubbin at your side. Your heart is going like Moana’s drum.',
        ),
      ],
      [
        ask(
          'sel',
          'three ways to approach someone upset',
          'CASEL: Social awareness',
          2,
          [
            N(
              'Te Kā frightens you, but she is hurting. When is a gift, a word, or quiet walking with open hands the best way to reach someone like that?',
            ),
          ],
          [
            think('A gift, when something was lost that you can return', [
              N('A fair match. A thoughtful gift can show you understand.'),
            ]),
            think('A word, when they need to know they are remembered', [
              N('Yes. Words can reach someone who feels forgotten.'),
            ]),
            think('Just walking, when nothing needs fixing but they need company', [
              N('Quiet presence is often the kindest of all.'),
            ]),
          ],
          'Thought about gift, word and quiet company as ways to approach someone who is hurting.',
        ),
      ],
      {
        choices: [
          {
            id: 'gift',
            label: 'Carry the spiral shell, held out in your open hand.',
            set: { 'a10-approach': 'gift' },
            then: [
              N(
                'You take out the little spiral shell your Nubbin found on Motunui’s reef, and walk with it held out on your palm.',
              ),
              N(
                'Te Kā’s glowing eyes drop to it: the same spiral. For a moment the roar goes quieter.',
                'soft',
              ),
            ],
          },
          {
            id: 'word',
            label: 'Say, out loud, that you remember her.',
            set: { 'a10-approach': 'word' },
            then: [
              Y('We remember you. All the green. The islands. We remember who gave them.', 'soft'),
              N(
                'Your voice is very small against the fire. It carries anyway, the way voices do over water.',
              ),
            ],
          },
          {
            id: 'walk',
            label: 'Just keep walking, slowly, hands open.',
            set: { 'a10-approach': 'walk' },
            then: [
              N(
                'You don’t say anything, and you don’t hold anything. You walk, slowly, with your hands open, the way Moana is walking.',
              ),
              N('Your Nubbin walks beside you, step for step, which is a lot of steps for it.'),
            ],
          },
        ],
      },
    ),
    sc(
      'a10-13-walk-done',
      [
        N(
          'Te Kā reaches Moana and stoops, enormous, fire running off it like water. Moana stands still and lifts her face.',
        ),
        M(
          'I see the spiral. I know you. You’ve been waiting a long time for somebody to bring it home.',
          'soft',
        ),
        N('She touches her forehead to Te Kā’s, gently. The giant goes very still.'),
      ],
      [
        notice(
          'social-studies',
          'greetings that share breath',
          'D2.Civ.8.K-2',
          2,
          [
            N(
              'Moana touches her forehead to Te Kā’s. In many Pacific cultures people greet by touching noses or foreheads: the hongi in Aotearoa, the honi in Hawaiʻi.',
            ),
            N('It is a sign of respect, and of sharing breath and life.'),
          ],
          'Learned that touching noses or foreheads is a respectful greeting in some Pacific cultures.',
        ),
      ],
    ),
    sc(
      'a10-13-complete',
      [
        N('Moana sets the green stone into the spiral on Te Kā’s chest. It fits like a key.'),
        N(
          'The fire goes out of the rock, and the cracks fill with moss, then ferns, then flowers. The giant’s shape softens into a green woman, lying down.',
        ),
        N(
          'She becomes an island again: green and more green and more, as far as you can see.',
          'happy',
        ),
        N(
          'Te Fiti opens her eyes, just once, and looks at Moana, and then at you, and then, for rather a long time, at your Nubbin.',
        ),
        N(
          'She reaches into the earth of herself and takes out Maui’s hook, mended and new, and holds it out to him.',
          'soft',
        ),
        MU('I’m sorry. For what I took. I’m sorry.', 'sad'),
        N(
          'Te Fiti smiles. Then she lies back down, and is an island, and the sea round her goes clear and full of fish.',
          'soft',
        ),
      ],
      [
        notice(
          'science',
          'protecting reefs',
          '3-LS4-4',
          6,
          [
            N(
              'When water is clean and cool, reef fish and corals do well. When seawater gets too warm, corals can turn white (bleaching), and may recover if it cools.',
            ),
            N(
              'People help reefs by fishing carefully, keeping the sea clean and slowing the warming of the oceans. Te Fiti’s return does the same here.',
            ),
          ],
          'Learned that clean, cool water helps reefs, and how coral bleaching happens and can recover.',
        ),
      ],
    ),
  ],
  [gloss('spiral', 'A shape that winds round and round a centre point.', 'a10-13-spiral')],
);

const Q14: EduQuest = quest(
  'a10-14',
  'Voyagers Again',
  {
    'a10-14-s1': g(
      'Say goodbye to Maui.',
      'Stand with Moana on the deck while Maui gets ready to fly.',
    ),
    'a10-14-s2': g('Bring the canoe home to Motunui.', 'Sail in through the gap in the reef.'),
    'a10-14-s3': g(
      'Sail out with Motunui’s first voyage, and watch from the bow.',
      'Help carry the canoes out from the cave, then take your place at the bow.',
    ),
  },
  [
    sc(
      'a10-14-farewell',
      [
        N(
          'The canoe rides easy on a clear sea. Maui sits on the stern for the last time, turning his new hook over in his hands.',
        ),
        MU('You could come with me, you know. Lots of islands. You’d be good at it.'),
        M('I know. I’ve got an island. And a lot of people to teach.', 'happy'),
        MU('Teach them well. The stars, the swells. The birds. Don’t leave out the birds.', 'soft'),
        N(
          'He looks down at his arm. Among the old marks of his deeds, there is a new one: a girl at a steering oar.',
          'soft',
        ),
        MU('I didn’t do that one. It just turned up. Best one I’ve got.', 'happy'),
        N('He gives your Nubbin a tap on the head with one finger, very carefully.'),
        MU('Goodbye, coconut. You were the least use of anybody, and I’ll miss you most.', 'happy'),
      ],
      [
        ask(
          'literacy',
          'what teasing can mean',
          'RL.3.3',
          7,
          [
            N(
              'Maui says, “You were the least use of anybody, and I’ll miss you most.” What is going on?',
            ),
          ],
          [
            opt(
              'He is joking, to say something warm without being soppy',
              [N('Yes. Teasing is one way people show they care without saying it outright.')],
              true,
            ),
            opt('He means every word as an insult', [
              N('The second half, “I’ll miss you most,” shows affection.'),
            ]),
            opt('He is making fun of Moana', [
              N('He is talking to your Nubbin, and the teasing is kind.'),
            ]),
          ],
          'Read a teasing goodbye as a sign of affection.',
        ),
      ],
      {
        choices: [
          {
            id: 'heart',
            label: 'Let your Nubbin say goodbye its own way.',
            then: [
              N(
                'Your Nubbin turns its emote ball into a heart and holds it up as high as it can reach. Maui looks at it a moment longer than he means to.',
              ),
            ],
          },
          {
            id: 'hawks',
            label: 'Tell him you’ll watch for hawks.',
            then: [
              Y('We’ll watch for hawks. Any hawk. Just in case.', 'soft'),
              MU('Do. If it does a roll at the top, it’s me.', 'happy'),
            ],
          },
        ],
      },
    ),
    sc(
      'a10-14-farewell-done',
      [
        N(
          'A flash, and a hawk climbs into the sky in a long spiral, does a roll at the top, and is gone.',
        ),
      ],
      [
        notice(
          'social-studies',
          'the Polynesian Triangle on the map',
          '4-ESS2-2',
          0,
          [
            N(
              'Polynesian voyagers settled nearly every habitable island in a huge triangle, with corners at Hawaiʻi, Aotearoa New Zealand and Rapa Nui (Easter Island).',
            ),
            N('Each side is thousands of kilometres long, and most of it is open water.'),
          ],
          'Learned that Polynesian voyagers settled islands across the huge triangle bounded by Hawaiʻi, Aotearoa and Rapa Nui.',
        ),
      ],
    ),
    sc(
      'a10-14-home',
      [
        N(
          'Motunui comes up over the edge of the sea, green and greener. The coconut trees are heavy with fruit.',
        ),
        N(
          'There are fish in the lagoon. You can see them from the canoe, flicking silver over the sand.',
        ),
        N(
          'Moana steers in through the reef herself, through the same breakers that threw her out, without a wobble.',
        ),
        N(
          'Her mother is running down the beach. Her father is running behind, which a chief does not usually do.',
        ),
        T('Moana!'),
        N(
          'He holds her so tightly she squeaks. Then he holds her at arm’s length and looks at her, the way you look at a map.',
        ),
        T('You went past the reef.', 'soft'),
        M('I went past the reef. And I came home. Both.', 'happy'),
        S('Of course she did. I packed her lunch.', 'happy'),
      ],
      [
        ask(
          'sel',
          'mixed feelings',
          'CASEL: Social awareness',
          5,
          [
            N(
              'Tui holds Moana at arm’s length, looking at her “the way you look at a map.” Which feelings might he have all at once?',
            ),
          ],
          [
            opt(
              'Relief, pride and a little leftover fear',
              [N('Yes. Feelings are often mixed, and naming them all helps.')],
              true,
            ),
            opt('Only anger', [N('He is angry no longer. Look at how tightly he held her.')]),
            opt('Only boredom', [N('He ran down the beach. He is anything but bored.')]),
          ],
          'Named several feelings a parent could have at once.',
        ),
      ],
    ),
    sc(
      'a10-14-home-done',
      [
        N(
          'Moana climbs the cairn of chiefs’ stones on the hill, and sets a shell on top, where her stone should go.',
        ),
      ],
      [
        notice(
          'literacy',
          'a new word: cairn',
          'L.2.4',
          0,
          [
            N(
              'A cairn is a pile of stones built as a marker or memorial. Here each chief has added a stone, so it holds a whole line of leaders.',
            ),
            N('Moana’s shell on top says: this leader belongs in the line that came before.'),
          ],
          'Learned the word cairn, and how each chief’s stone adds to a line of leaders.',
        ),
      ],
    ),
    sc(
      'a10-14-bow',
      [
        N(
          'The whole village goes up the stream and through the waterfall. One by one, the great canoes come out of the cave into the light.',
        ),
        N(
          'You carry the end of a steering oar and your Nubbin carries Heihei. Pua carries nothing, and supervises.',
        ),
        N(
          'The sails go up, all of them. Moana stands at the steering oar of the first canoe, holding her hand out flat to the horizon.',
        ),
        N(
          'Out past the reef, a blue light comes up under the hulls. The manta, gliding beside you, wings out wide.',
          'soft',
        ),
        N(
          'Your Nubbin climbs to the very tip of the bow. Then it spreads its arms, and leans, and does Gramma’s glide, out over the water.',
          'happy',
        ),
        N(
          'The manta glides with it. The people on the canoes see, and point, and some of them begin to laugh, and some to cry.',
        ),
        T(
          'That’s my mother’s step. She did it on the beach every evening. I thought it was just her.',
          'soft',
        ),
        M('It’s never just one person. That’s the whole point of it.', 'soft'),
      ],
      [
        notice(
          'social-studies',
          'what the name Hōkūleʻa means',
          'D2.His.2.K-2',
          2,
          [
            N(
              'The canoe Hōkūleʻa is named for the star Arcturus, called “star of gladness” in Hawaiian. Arcturus passes straight overhead in Hawaiʻi.',
            ),
            N(
              'Its 1976 voyage to Tahiti showed the world that Pacific peoples could navigate by nature alone.',
            ),
          ],
          'Learned what Hōkūleʻa’s name means and why its 1976 voyage mattered.',
        ),
        ask(
          'maths',
          'distance, speed and time',
          '4.MD.A.2',
          5,
          [
            N(
              'Hawaiʻi to Tahiti is about 4,000 kilometres. If a canoe could sail 100 kilometres every day, how many days would it take?',
            ),
          ],
          [
            opt(
              '40 days',
              [
                N(
                  'Yes, 4,000 ÷ 100 = 40. Hōkūleʻa took about 34 days in 1976, so it sailed a little faster.',
                ),
              ],
              true,
            ),
            opt('4 days', [N('4 days would need 1,000 km a day. 4,000 ÷ 100 = 40.')]),
            opt('400 days', [N('400 would be 10 km a day. At 100 km a day, 4,000 ÷ 100 = 40.')]),
          ],
          'Divided a voyage distance by a daily distance to find the days taken.',
        ),
      ],
    ),
    sc(
      'a10-14-bow-done',
      [
        N(
          'The canoes sail on together, towards the next island, which nobody has seen yet.',
          'happy',
        ),
      ],
      [
        notice(
          'science',
          'the steady star',
          '5-ESS1-2',
          0,
          [
            N(
              'In Hawaiʻi, the North Star sits low in the northern sky. Hawaiians call it Hōkūpaʻa, the “steady star”, because it hardly moves while the others wheel past.',
            ),
            N('Voyagers used it to check how far north or south they were.'),
          ],
          'Learned that the North Star hardly moves and that Hawaiians call it Hōkūpaʻa.',
        ),
      ],
    ),
    sc(
      'a10-14-complete',
      [
        N('Moana finds you at the bow at sunset, and sits beside you a while.'),
        M('You never told me where you came from. Somewhere past the reef, Gramma said.'),
        Y('A garden. With a pond in it. I’m a long way from it.', 'soft'),
        M('Then you know the way home. You always know where you started.', 'soft'),
        N(
          'Out in the sea behind you, where the path through the water was, Te Fiti’s shore is green. Your spiral shell is on it somewhere, with her.',
        ),
        N('The page gives a long, slow sigh, like a sail letting go of the wind.'),
        N(
          'You are back in the Grove with Nova’s atlas on your knee. The ground will not hold still; it sways like a deck, and your Nubbin smells of salt.',
        ),
        N(
          'By the pond there is a small voyaging canoe, twin-hulled, with a woven sail no bigger than a tablecloth.',
        ),
        N(
          'Up on the hill, a ring of flat stones has appeared in the grass, each one marked with a house of the rising stars.',
        ),
        N(
          'A small white spiral shell is painted on the canoe’s prow, where the real one would have gone. Your Nubbin checks on it twice, then sits in the boat.',
          'happy',
        ),
      ],
      [
        ask(
          'sel',
          'knowing where you started',
          'CASEL: Self-awareness',
          3,
          [
            N(
              'Moana says, “You always know where you started.” What does she mean, and can knowing where you started help you work out where to go?',
            ),
          ],
          [
            think('It means remembering who you are and where you come from', [
              N('Yes. A voyager who forgets the start cannot find the way home.'),
            ]),
            think('It means knowing the way back if you are lost', [
              N('That is the navigator’s view. Dead reckoning needs a starting point.'),
            ]),
            think('It is mostly about feeling at home inside yourself', [
              N('A lovely reading. Home can be a place and a feeling.'),
            ]),
          ],
          'Thought about what “knowing where you started” means for a voyager and for a person.',
        ),
      ],
    ),
  ],
  [gloss('cairn', 'A pile of stones put up as a marker or a memorial.', 'a10-14-home-done')],
);

export const EDU_A10_READER_VARIANTS: EduScene[] = [
  sc(
    'a10-12-manta-wave',
    [
      N(
        'The manta turns in the water and rises, and rolls along the side of the canoe, up with each swell and down with it.',
      ),
      N(
        'It isn’t swimming. It is riding the sea: rising when the water rises, sinking when it falls, its wing-tips rolling over.',
      ),
      N('Your Nubbin stands up very slowly on the deck.'),
      N(
        'Then it goes up on its toes, and down and back, rolling its little arms, the way Gramma taught it, right on the beat of the sea.',
        'happy',
      ),
      N(
        'The manta rises, and your Nubbin rises. They go up the side of the canoe together, the big one in the sea and the small one on deck.',
      ),
      G('There. You didn’t forget. I told you it doesn’t come off.', 'soft'),
      N('Moana laughs, wet-faced. It is the first time she has laughed since the barrier.'),
    ],
    [
      notice(
        'science',
        'swells lift floating things without carrying them',
        '4-PS3-2',
        1,
        [
          N(
            'A swell passing under a canoe lifts it up and lets it back down. The wave’s energy travels on, but the canoe stays about where it was.',
          ),
          N(
            'That is why the manta and your Nubbin can ride the swell together without being carried away.',
          ),
        ],
        'Learned that a swell lifts and lowers a floating object while its energy travels on.',
      ),
    ],
  ),
  sc(
    'a10-14-bow-wave',
    [
      N(
        'The whole village goes up the stream and through the waterfall. One by one, the great canoes come out of the cave into the light.',
      ),
      N(
        'You carry the end of a steering oar and your Nubbin carries Heihei. Pua carries nothing, and supervises.',
      ),
      N(
        'The sails go up, all of them. Moana stands at the steering oar of the first canoe, holding her hand out flat to the horizon.',
      ),
      N(
        'Out past the reef, a blue light comes up under the hulls. The manta, rising and sinking with the swell beside you.',
        'soft',
      ),
      N(
        'Your Nubbin climbs to the very tip of the bow. Then it rises on its toes, and sinks, and rolls its arms: Gramma’s wave step, on the beat.',
        'happy',
      ),
      N(
        'The manta rolls with it. The people on the canoes see, and point, and some of them begin to laugh, and some to cry.',
      ),
      T(
        'That’s my mother’s step. She did it on the beach every evening. I thought it was just her.',
        'soft',
      ),
      M('It’s never just one person. That’s the whole point of it.', 'soft'),
    ],
    [
      notice(
        'social-studies',
        'what the name Hōkūleʻa means',
        'D2.His.2.K-2',
        2,
        [
          N(
            'The canoe Hōkūleʻa is named for the star Arcturus, called “star of gladness” in Hawaiian. Arcturus passes straight overhead in Hawaiʻi.',
          ),
          N(
            'Its 1976 voyage to Tahiti showed the world that Pacific peoples could navigate by nature alone.',
          ),
        ],
        'Learned what Hōkūleʻa’s name means and why its 1976 voyage mattered.',
      ),
      ask(
        'maths',
        'distance, speed and time',
        '4.MD.A.2',
        5,
        [
          N(
            'Hawaiʻi to Tahiti is about 4,000 kilometres. If a canoe could sail 100 kilometres every day, how many days would it take?',
          ),
        ],
        [
          opt(
            '40 days',
            [
              N(
                'Yes, 4,000 ÷ 100 = 40. Hōkūleʻa took about 34 days in 1976, so it sailed a little faster.',
              ),
            ],
            true,
          ),
          opt('4 days', [N('4 days would need 1,000 km a day. 4,000 ÷ 100 = 40.')]),
          opt('400 days', [N('400 would be 10 km a day. At 100 km a day, 4,000 ÷ 100 = 40.')]),
        ],
        'Divided a voyage distance by a daily distance to find the days taken.',
      ),
    ],
  ),
  sc(
    'a10-14-complete-word',
    [
      N('Moana finds you at the bow at sunset, and sits beside you a while.'),
      M('You never told me where you came from. Somewhere past the reef, Gramma said.'),
      Y('A garden. With a pond in it. I’m a long way from it.', 'soft'),
      M('Then you know the way home. You always know where you started.', 'soft'),
      M(
        'What you said to her, on the path. That you remembered. I think she heard that. I think it helped.',
        'soft',
      ),
      N('The page gives a long, slow sigh, like a sail letting go of the wind.'),
      N(
        'You are back in the Grove with Nova’s atlas on your knee. The ground will not hold still; it sways like a deck, and your Nubbin smells of salt.',
      ),
      N(
        'By the pond there is a small voyaging canoe, twin-hulled, with a woven sail no bigger than a tablecloth.',
      ),
      N(
        'Up on the hill, a ring of flat stones has appeared in the grass, each one marked with a house of the rising stars.',
      ),
      N(
        'Along the canoe’s hull runs a line of small carved spirals, one for each thing remembered. Your Nubbin counts them, and loses count.',
        'happy',
      ),
    ],
    [
      ask(
        'sel',
        'being remembered',
        'CASEL: Self-awareness',
        4,
        [
          N(
            'Moana says Te Kā heard you say you remembered her. Why can being remembered help someone who feels lost?',
          ),
        ],
        [
          think('It tells them they still matter to someone', [
            N('Yes. Being remembered is a way of being held.'),
          ]),
          think('It reminds them who they were', [
            N('A deep answer. Names and memories can bring a person back to themselves.'),
          ]),
          think('It might not help everyone', [
            N('True. But it often does, and it costs nothing to offer.'),
          ]),
        ],
        'Thought about why being remembered can comfort someone.',
      ),
    ],
  ),
  sc(
    'a10-14-complete-walk',
    [
      N('Moana finds you at the bow at sunset, and sits beside you a while.'),
      M('You never told me where you came from. Somewhere past the reef, Gramma said.'),
      Y('A garden. With a pond in it. I’m a long way from it.', 'soft'),
      M('Then you know the way home. You always know where you started.', 'soft'),
      M(
        'On the path, you didn’t say anything. You just came. That was the bravest thing on the whole sea, after me.',
        'happy',
      ),
      N('The page gives a long, slow sigh, like a sail letting go of the wind.'),
      N(
        'You are back in the Grove with Nova’s atlas on your knee. The ground will not hold still; it sways like a deck, and your Nubbin smells of salt.',
      ),
      N(
        'By the pond there is a small voyaging canoe, twin-hulled, with a woven sail no bigger than a tablecloth.',
      ),
      N(
        'Up on the hill, a ring of flat stones has appeared in the grass, each one marked with a house of the rising stars.',
      ),
      N(
        'On the canoe’s bow deck, two pairs of small footprints are painted: yours, and a rounder pair beside them. Your Nubbin stands in its pair.',
        'happy',
      ),
    ],
    [
      ask(
        'sel',
        'showing up without words',
        'CASEL: Relationship skills',
        4,
        [
          N(
            'Moana says you said nothing on the path, you just came. Why can simply showing up be one of the bravest and kindest things we do?',
          ),
        ],
        [
          think('It shows you care without needing credit', [
            N('Yes. Quiet courage often goes unnoticed, and that is part of its power.'),
          ]),
          think('It is brave because you cannot hide behind words', [
            N('A sharp answer. When all you have is yourself, you cannot pretend.'),
          ]),
          think('It is not enough on its own', [
            N('Sometimes you must do more. But showing up is often where help starts.'),
          ]),
        ],
        'Thought about why simply showing up for someone can be brave and kind.',
      ),
    ],
  ),
];

export const EDU_A10_READER: EduQuest[] = [
  Q01,
  Q02,
  Q03,
  Q04,
  Q05,
  Q06,
  Q07,
  Q08,
  Q09,
  Q10,
  Q11,
  Q12,
  Q13,
  Q14,
];

/** Every `edu:` check string used by a `do` lesson in this band. */
export const CHECKS: string[] = ['edu:balance:lean:hold', 'edu:write:kind-words'];
