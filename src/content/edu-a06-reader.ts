/**
 * The Learning Grove, reader band (ages 7–10): Atlas page A6, Seven Voyages.
 *
 * One EduScene per original scene (every step scene, done scene, complete scene and variant), id
 * `reader:<original id>`. Source: atlas-a06.ts. See EDU-STYLE.md and docs/briefs/edu-new.md.
 *
 *   A6-1  Two Sinbads        Baghdad the round city, paper and the House of Wisdom, multiplication, fairness
 *   A6-2  The Island...      whales, similes, words from context, blame and not knowing
 *   A6-3  The King’s Stables comparing, evidence, belief and proof, saying sorry
 *   A6-4  The Roc’s Egg      measuring a dome, sound and vibration, fear and bravery
 *   A6-5  Valley of Diamonds snakes and sunlight, diamonds, legends that travel, how much is enough
 *   A6-6  The Giant’s Island sneezes, floating (balanced forces), softened stories
 *   A6-7  The Serpent        perimeter, comparing solutions, promises to yourself
 *   A6-8  The Strange Custom grief, senses, rules and right and wrong
 *   A6-9  The Roc’s Revenge  parents and young, waves, listening, fair or unfair revenge
 *   A6-10 Old Man of the Sea tricks, consent, multiplication, coconuts and habitats
 *   A6-11 River of Jewels    rivers, caves and erosion, bar graph, what is worth having
 *   A6-12 Serendib           Sri Lanka, cinnamon, shared water and fractions, faiths and respect
 *   A6-13 The Caliph’s Gift  languages and translation, monsoon winds, distance and time, slavery
 *   A6-14 Elephant Hunter    elephant families, conservation, two-step sums, keeping a secret or a promise
 *   A6-15 Home               wind and sails, fairness and public water, distance, content with little
 *   A6-16 Porter’s Voyage    how stories travel, oral storytelling, theme, whose story is it
 *
 * One scene per original scene. Every choice keeps its original id and `set`; the reader band keeps
 * every choice (a06-stone and a06-ivory are set exactly as in the original). Every quest has one
 * think question (an `ask` with no `best`).
 *
 * Hard things (EDU-STYLE): Sinbad’s wife’s death is said plainly and gently; the burial custom is
 * “a hard rule” that sends him alone into a cave, as in the original’s childLines; the pirates’
 * capture is said once, plainly, and a notice names slavery as real, unjust and illegal today; no
 * elephant is hurt and no ivory is ever a prize. Cultural care kept: Baghdad is a city of learning;
 * the Caliph has dignity; the four faiths on Sri Pada are named equally and briefly; no quotes from
 * any text; no “exotic” clichés. Facts used are well established (Baghdad’s round plan, paper from
 * China, monsoon winds, cinnamon from Sri Lanka, elephants’ herds led by the oldest female).
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
const P = say('a06-porter');
const S = say('a06-sailor');
const YS = say('a06-young');
const ST = say('a06-steward');
const D = say('a06-daughter');
const CP = say('a06-captain');
const KI = say('a06-king-isle');
const ME = say('a06-merchant');
const GA = say('a06-gatherer');
const FA = say('a06-farmer');
const KS = say('a06-king-serendib');
const CA = say('a06-caliph');
const TR = say('a06-translator');
const MA = say('a06-master');
const NV = say('nova');

// ---------------------------------------------------------------- builders
type Beat = Omit<Lesson, 'id'>;
type Opt = NonNullable<Lesson['options']>[number];
type Dom = Lesson['domain'];

/** One answer option. `best` marks the answer the lesson teaches; think questions have none. */
const o = (label: string, reply: Line[], best = false): Opt =>
  best ? { label, best, reply } : { label, reply };

const nt = (
  after: number,
  domain: Dom,
  skill: string,
  standard: string | undefined,
  lines: Line[],
  parentNote: string,
): Beat => ({
  domain,
  skill,
  ...(standard ? { standard } : {}),
  kind: 'notice',
  after,
  lines,
  parentNote,
});

const ak = (
  after: number,
  domain: Dom,
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
  prompt,
  options,
  parentNote,
});

const dn = (
  after: number,
  domain: Dom,
  skill: string,
  standard: string | undefined,
  check: string,
  lines: Line[],
  parentNote: string,
): Beat => ({
  domain,
  skill,
  ...(standard ? { standard } : {}),
  kind: 'do',
  after,
  check,
  lines,
  parentNote,
});

/** Builds `reader:<of>` and numbers its lessons `reader:<of>-l1`, `-l2`, in play order. */
const sc = (of: string, lines: Line[], beats: Beat[], choices?: Choice[]): EduScene => {
  const id = `reader:${of}`;
  const s: EduScene = {
    id,
    of,
    band: 'reader',
    lines,
    lessons: [...beats]
      .sort((a, b) => a.after - b.after)
      .map((b, i) => ({ id: `${id}-l${i + 1}`, ...b })),
  };
  if (choices) s.choices = choices;
  return s;
};

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
  notes?: string,
): EduQuest => ({
  id: `reader:${of}`,
  of,
  band: 'reader',
  title,
  goals,
  scenes,
  glossary,
  ...(notes ? { notes } : {}),
});

const SEL = 'CASEL: Self-awareness';
const SOC = 'CASEL: Social awareness';
const REL = 'CASEL: Relationship skills';
const RES = 'CASEL: Responsible decision-making';

// ================================================================== A6-1 Two Sinbads
const A01: EduQuest = quest(
  'a06-01',
  'Two Sinbads',
  {
    'a06-01-s1': {
      goal: 'Help your friend the porter carry his load of paper across Baghdad.',
      hint: 'Pick up the basket by the porter and follow him through the lanes.',
    },
    'a06-01-s2': {
      goal: 'Rest on the bench by the great house on the way home.',
      hint: 'Sit down beside the porter in the shade by the gate.',
    },
    'a06-01-s3': {
      goal: 'Go in and meet the master of the house.',
      hint: 'Follow the steward through the courtyard to the long room.',
    },
  },
  [
    sc(
      'a06-01-street',
      [
        N(
          'Nova’s atlas falls open at a page the colour of hot stone: a round city on a river, drawn from above.',
        ),
        N(
          'You touch the river. The heat comes up off the paper, and you are standing in a lane with a basket on your back.',
        ),
        P('Steady. Steady! That basket is worth more than both of us, and it isn’t even heavy.'),
        N(
          'The man beside you carries three baskets to your one. He is a porter called Sinbad, and he has been your friend, it seems, for years.',
        ),
        P(
          'Paper, from the paper-makers’ market, for the scholars at the House of Wisdom. They write on it faster than I can fetch it.',
        ),
        P(
          'Every book in Baghdad has been on my back at some point. I can’t read a single one of them.',
          'think',
        ),
        N('Your Nubbin rides on top of your basket, among the rolls, like a cat on a warm wall.'),
        N(
          'The lane smells of bread, cumin and river mud. A man is selling cold sherbet, and everybody wants some.',
        ),
      ],
      [
        nt(
          4,
          'social-studies',
          'Baghdad was planned as a round city; paper travelled from China',
          'D2.His.2.K-2',
          [
            P(
              'This whole city was built in a perfect circle: four gates, the palace in the middle. People called it the City of Peace.',
            ),
            P(
              'And paper? Somebody in China worked out how to make it. The skill walked west along the trade roads until it reached us.',
            ),
          ],
          'Learned that Baghdad was planned as a round city and that paper-making spread from China along trade routes.',
        ),
        ak(
          7,
          'maths',
          'multiplication as equal groups',
          '3.OA.A.1',
          [
            P(
              'Three baskets on my back, one on yours. Every basket holds six rolls of paper. How many rolls are we carrying?',
            ),
          ],
          [
            o(
              '24',
              [P('Yes! Four baskets, six rolls in each: 6 + 6 + 6 + 6 = 24, or 4 × 6.')],
              true,
            ),
            o('18', [
              P('That’s my three baskets alone: 3 × 6 = 18. Add yours, another 6, and we get 24.'),
            ]),
            o('10', [
              P('That’s 4 + 6. But each of the four baskets holds six, so it’s 4 groups of 6: 24.'),
            ]),
          ],
          'Solved an equal-groups problem (4 baskets of 6 rolls = 24).',
        ),
      ],
      [
        {
          id: 'take',
          label: 'Take one of his baskets as well.',
          then: [
            P('You’re a good friend and a terrible porter. Lift from the knees.', 'happy'),
            N('Your Nubbin shifts to balance the load, and very nearly manages it.'),
          ],
        },
        {
          id: 'ask',
          label: 'Ask what the scholars do with all this paper.',
          then: [
            P(
              'They put books into Arabic, from Greek and Persian and the languages of India. Stars, medicine, numbers.',
            ),
            P(
              'And they argue. Mostly they argue. Paper’s cheaper than it was, so they argue at length.',
            ),
          ],
        },
      ],
    ),
    sc(
      'a06-01-street-done',
      [
        N(
          'At the House of Wisdom a young scholar with ink to the elbow counts the rolls twice, and pays exactly.',
        ),
        P('Exactly. He always pays exactly. Never one copper over.', 'think'),
        N(
          'Behind him, a long room of desks is full of people copying, translating and arguing in four languages at once.',
        ),
      ],
      [
        nt(
          1,
          'literacy',
          'what a scholar is; what a translation does',
          'L.3.4',
          [
            P(
              'A scholar is somebody who studies one subject for years and years. These ones also translate.',
            ),
            P(
              'To translate is to carry a book from one language into another, so people who couldn’t read it before can. It’s porter’s work, really. Only with words.',
            ),
          ],
          'Learned the words scholar and translate, and that translating carries a book into another language.',
        ),
      ],
    ),
    sc(
      'a06-01-bench',
      [
        N(
          'On the way home the porter stops in the shade of a great house, and sets his empty baskets on a stone bench.',
        ),
        N(
          'Cool air comes from the gate with a smell of roast lamb and rosewater. Somewhere inside, a lute is playing.',
        ),
        P('Listen to that. Somebody in there has never carried anything heavier than a spoon.'),
        P(
          'I carry from first light to the last call to prayer, and I go home to lentils. He sits still, and gets lamb.',
          'angry',
        ),
        P(
          'Same God made us both. I’m not complaining. I’m saying it out loud, which is different.',
        ),
        N('The porter says it quite loudly. A window above the gate is open.'),
        N(
          'Your Nubbin looks up at the window, then at you, the way it does in the Grove when someone is about to be caught.',
        ),
      ],
      [
        ak(
          4,
          'social-studies',
          'think: is it fair?',
          'D2.Civ.8.K-2',
          [
            N(
              'The porter works from dawn and eats lentils. The man inside sits still and eats lamb. Is that fair? There’s no right answer. What do you think?',
            ),
          ],
          [
            o('No, work this hard should earn more.', [
              P(
                'A fair answer. Lots of people have felt that, in every century. Hard work and good pay don’t always travel together.',
              ),
            ]),
            o('It depends how each of them got what they have.', [
              P(
                'That’s a careful answer. Maybe we should find out before deciding. I suspect somebody’s about to tell us.',
              ),
            ]),
            o('Fair or not, grumbling aloud won’t change it.', [
              P(
                'That’s a fair point too. Though I notice the window opened. Speaking up can change things after all.',
              ),
            ]),
          ],
          'Thought about whether the porter’s situation is fair, giving their own reasons.',
        ),
      ],
      [
        {
          id: 'hush',
          label: 'Tell him to keep his voice down.',
          then: [P('Why? It’s just as true in a whisper.')],
        },
        {
          id: 'agree',
          label: 'Say it isn’t fair.',
          then: [
            P('Thank you.', 'happy'),
            P('It isn’t, is it? I feel much better. No, I feel worse.', 'think'),
          ],
        },
      ],
    ),
    sc(
      'a06-01-bench-done',
      [
        N(
          'The gate opens. A steward in a spotless turban looks at the porter, then at you, then at your Nubbin.',
        ),
        ST('My master asks for the man who was talking. And his friend. And… that.'),
        N('The porter’s face does something between a wince and a grin.'),
      ],
      [
        nt(
          2,
          'sel',
          'feelings can be mixed: the porter is worried and curious at once',
          'CASEL: Self-awareness',
          [
            N(
              'The porter’s face is doing two things at once. He’s worried he’ll be told off, and curious who’s asking.',
            ),
            N(
              'Feeling two things together is normal. A mixed-up feeling isn’t wrong: it just has more than one part.',
            ),
          ],
          'Heard that people can feel two different things at once.',
        ),
      ],
    ),
    sc(
      'a06-01-hall',
      [
        N(
          'Inside there is a courtyard with a fountain, then a long room of cushions, and more food than you have ever seen at once.',
        ),
        N(
          'At the head of the room sits an old man with a white beard, and a face burnt brown by a great deal of weather.',
        ),
        S(
          'Sit, sit. Eat first. A man shouldn’t have to argue with God on an empty stomach.',
          'happy',
        ),
        P('You heard that.', 'shock'),
        S('The whole street heard. What’s your name?'),
        P('Sinbad. Sinbad the porter.'),
        S('So is mine. Sinbad the sailor. Well, Sinbad, anyway. The sailor part I had to earn.'),
        S('The young man in my stories is me, long ago. You will meet him.'),
        S(
          'You think I sat here and the lamb walked in. Let me tell you what this house cost.',
          'think',
        ),
      ],
      [
        ak(
          8,
          'literacy',
          'character motive',
          'RL.3.3',
          [
            N(
              'The old man heard the porter’s complaint, and instead of being cross he invited him in. Why do you think he did that?',
            ),
          ],
          [
            o(
              'He wanted to show the porter that things aren’t always as they look.',
              [
                S(
                  'Quite right. That’s exactly it. A fair guess from somebody who’s been watching closely.',
                ),
              ],
              true,
            ),
            o('He wanted to make the porter feel small.', [
              S(
                'Hm, possible, but look: he feeds the porter first and shares his name. People who want to make you feel small don’t usually offer lamb.',
              ),
            ]),
            o('He was lonely and wanted company.', [
              S(
                'That could be part of it, too. A house this big can be very quiet. Motives are often mixed.',
              ),
            ]),
          ],
          'Inferred a character’s motive from what he does.',
        ),
      ],
    ),
    sc(
      'a06-01-hall-done',
      [
        N('The porter sits on the very edge of a cushion, as if it might send him a bill.'),
        N('A kitchen boy puts a plate of dates beside him, and he takes exactly one.'),
      ],
      [
        ak(
          1,
          'sel',
          'helping a guest feel welcome',
          'CASEL: Social awareness',
          [
            N(
              'The porter perches on the edge of the cushion and takes exactly one date. He feels out of place. What could help him feel welcome?',
            ),
          ],
          [
            o(
              'The host saying “eat first” and sharing his own name.',
              [
                N(
                  'Yes. The old man has already done both. Small, warm acts tell a nervous guest they belong.',
                ),
              ],
              true,
            ),
            o('Leaving him alone until he relaxes.', [
              N(
                'Some people like a little space, but on his own he might never relax. A friendly word helps him settle.',
              ),
            ]),
          ],
          'Thought about how a host helps a nervous guest feel welcome.',
        ),
      ],
    ),
    sc(
      'a06-01-complete',
      [
        S('Seven times I went to sea. Seven times I swore I never would again.'),
        S(
          'Seven voyages won’t fit in one supper. I’ll tell them one at a time, and you’ll take food home for whoever is waiting.',
        ),
        P('My daughter. She’ll want to know why I’m late.', 'soft'),
        S('Then you’ll have a story to tell her. That’s the price of supper: you listen properly.'),
        N(
          'The old man looks at you and your Nubbin, as if he always knew the porter would bring you.',
        ),
        S('You too. Sit closer. When I tell a thing, it has a way of happening again.'),
      ],
      [
        dn(
          5,
          'maths',
          'time: seven nights make a week',
          '3.MD.A.1',
          'edu:count:nights:7',
          [
            S(
              'One voyage a night, seven voyages. How many days is that? A whole week. Count the evenings on your fingers.',
            ),
          ],
          'Connected seven voyages to seven nights, one week.',
        ),
      ],
    ),
  ],
  [
    gloss(
      'porter',
      'A person whose job is to carry heavy loads for other people.',
      'a06-01-street',
    ),
    gloss('sherbet', 'A cold, sweet, fruity drink.', 'a06-01-street'),
    gloss(
      'scholar',
      'Someone who studies a subject very carefully for many years.',
      'a06-01-street-done',
    ),
    gloss(
      'translate',
      'To change writing or speech from one language into another.',
      'a06-01-street-done',
    ),
    gloss(
      'steward',
      'A person who looks after a big house or its household for the owner.',
      'a06-01-bench-done',
    ),
    gloss('courtyard', 'An open space with walls or buildings round it.', 'a06-01-hall'),
  ],
);

// ================================================================== A6-2 The Island That Moved
const A02: EduQuest = quest(
  'a06-02',
  'The Island That Moved',
  {
    'a06-02-s1': {
      goal: 'Listen to the first voyage, and step into it.',
      hint: 'Sit on your cushion in the long room until the carpet turns to sea.',
    },
    'a06-02-s2': {
      goal: 'Gather firewood with the merchants on the little island.',
      hint: 'Pick up sticks under the young trees and bring them to the fire.',
    },
    'a06-02-s3': {
      goal: 'Hold on to the washtub until the sea lets you go.',
      hint: 'Keep hold of the tub and kick towards the light.',
    },
  },
  [
    sc(
      'a06-02-telling',
      [
        S(
          'I was young, and my father left me money, and I spent it the way young men do. Quickly, and on friends.',
        ),
        S(
          'When it was nearly gone, I sold what was left, bought goods, and went down the river to Basra to take ship.',
        ),
        N('As the old sailor talks, the pattern on the carpet under your hand turns blue, and begins to move.'),
        N('The smell of lamb becomes a smell of tar and salt. The porter’s voice goes far away.'),
        P('Go on, then. I’ll mind the dates.'),
        N(
          'You are on the deck of a dhow, a ship of sewn planks, under a great triangular sail full of wind.',
        ),
        N(
          'A young man with the old man’s eyes leans on the rail, grinning at the sea as if it owes him money.',
        ),
        YS('You’re new. Good. Everybody else here has heard my jokes.', 'happy'),
      ],
      [
        nt(
          5,
          'science',
          'a triangular sail turns to catch the wind; dhows were sewn, not nailed',
          '3-PS2-1',
          [
            YS(
              'See the sail? A triangle, slung on a long slanting pole. We can swing it round to catch wind from the side, not only from behind.',
            ),
            YS(
              'And the planks are sewn together with coconut rope, not nailed. Sewn hulls flex in the waves instead of cracking.',
            ),
          ],
          'Learned that a triangular sail can be turned to catch the wind and that dhows were built with sewn planks.',
        ),
      ],
      [
        {
          id: 'joke',
          label: 'Ask to hear a joke.',
          then: [
            YS('What’s the difference between a merchant and a sailor?'),
            YS('About three days out of Basra.', 'happy'),
            N('Behind Sinbad, the helmsman groans like a man who has heard it every day for a month.'),
          ],
        },
        {
          id: 'sea',
          label: 'Ask if he’s been to sea before.',
          then: [YS('Never. Isn’t it wonderful? Nothing can possibly go wrong.', 'happy')],
        },
      ],
    ),
    sc(
      'a06-02-telling-done',
      [
        N(
          'Weeks of blue go by in a breath. Then the lookout shouts: land, a small green island, flat as a plate, on a sea with no wind.',
        ),
        N('Something about it looks wrong, though you can’t say what.'),
      ],
      [
        ak(
          1,
          'literacy',
          'similes',
          'L.4.5',
          [
            N(
              '“Flat as a plate.” That’s a simile: it compares two things using “as” or “like”. Which of these is also a simile?',
            ),
          ],
          [
            o(
              '“Swift as a deer.”',
              [N('Yes! It uses “as… as” to compare someone’s speed to a deer’s.')],
              true,
            ),
            o('“The wind was a whisper.”', [
              N(
                'Close. That compares without “as” or “like”, which makes it a metaphor, the simile’s cousin.',
              ),
            ]),
            o('“The island was small.”', [
              N(
                'That’s just a description. A simile compares one thing with another using “as” or “like”.',
              ),
            ]),
          ],
          'Identified a simile.',
        ),
      ],
    ),
    sc(
      'a06-02-island',
      [
        CP('Ashore, all of you. Stretch your legs, wash your shirts. Back aboard by evening.'),
        N(
          'The island is strange underfoot: soft, a little springy, with sand in the hollows and young trees growing out of it.',
        ),
        YS('Firewood! We’ll cook properly tonight, on dry land, like civilised people.', 'happy'),
        N(
          'The merchants build a fire and set a pot on it. Somebody starts singing a song you don’t know.',
        ),
        N(
          'Your Nubbin sits down on the ground, then stands up again quickly and looks at its feet.',
        ),
        N(
          'The ground is warm. Not sun-warm: warm from underneath, the way a sleeping animal is warm.',
        ),
      ],
      [
        ak(
          5,
          'science',
          'clues and evidence',
          undefined,
          [
            N(
              'Your Nubbin has noticed some clues. Which of them suggests the “island” is really an animal?',
            ),
          ],
          [
            o(
              'The ground is warm from underneath, and springy.',
              [
                N(
                  'Yes! Warm and springy ground is how a living thing feels. Rock and sand are only warm where the sun has touched them.',
                ),
              ],
              true,
            ),
            o('There are trees growing on it.', [
              N(
                'Trees grow on real islands, so that clue doesn’t help. Look for something rock wouldn’t do.',
              ),
            ]),
            o('There is sand in the hollows.', [
              N(
                'Sand is on many beaches, so that doesn’t tell us much. A warm, springy floor does.',
              ),
            ]),
          ],
          'Picked out the clue (warmth and springiness) that shows the island is alive.',
        ),
      ],
      [
        {
          id: 'tell',
          label: 'Tell Sinbad the ground is warm.',
          then: [
            YS('It’s the sun, friend. Have a date.'),
            N('Sinbad hands you one. Under your feet, the island breathes out.'),
          ],
        },
        {
          id: 'fire',
          label: 'Kick sand over the fire.',
          then: [
            YS('Hey! That’s supper!', 'angry'),
            N('Too late, and not enough sand. The island has already noticed.'),
          ],
        },
      ],
    ),
    sc(
      'a06-02-island-done',
      [
        N('The island shudders. All the young trees lean the same way at once.'),
        CP('Back to the ship! It isn’t an island! It’s a fish! Run!', 'shock'),
        N('The captain is wrong about one thing, though. It isn’t a fish at all.'),
      ],
      [
        ak(
          0,
          'literacy',
          'working out a word from its context',
          'L.3.4',
          [
            N(
              '“The island shudders. All the young trees lean the same way at once.” What does “shudders” mean here?',
            ),
          ],
          [
            o(
              'Shakes suddenly, all over.',
              [N('Yes! The trees leaning all at once is the clue: the whole island shook.')],
              true,
            ),
            o('Goes very quiet.', [
              N(
                'Look at the next sentence: every tree leans at once. Something that quiet wouldn’t do that. It shakes.',
              ),
            ]),
          ],
          'Worked out the meaning of “shudders” from the sentence around it.',
        ),
      ],
    ),
    sc(
      'a06-02-tub',
      [
        N(
          'The island rolls over, slowly, like somebody turning in bed. An eye the size of a cartwheel opens beside you.',
        ),
        N('It is a whale, very old. It has been asleep so long that trees grew on its back.'),
        N('Then it is gone, down into the green, and everything that was on it is in the sea.'),
        N(
          'The ship is already sailing. The captain is sure nobody could live through that, and he doesn’t look back.',
        ),
        YS('Here! The washtub! Grab hold!', 'shock'),
        N(
          'Sinbad has a wooden tub from the laundry, and he has you by the collar, and your Nubbin has you by the ear.',
        ),
        N('Far below, something huge sings one long low note. Then the sea is only the sea.'),
      ],
      [
        ak(
          6,
          'sel',
          'think: who is to blame?',
          RES,
          [
            N(
              'The merchants lit a fire on the whale’s back, not knowing. The captain sailed off, thinking everyone had drowned. Who, if anyone, is to blame for what happened?',
            ),
            N('There’s no single answer.'),
          ],
          [
            o('Nobody: they couldn’t have known it was a whale.', [
              N(
                'That’s a fair answer. It’s hard to blame someone for what they couldn’t know. Maybe the lesson is to be curious before lighting fires.',
              ),
            ]),
            o('The captain, for sailing off without checking.', [
              N(
                'A fair answer. Even if you think no one could survive, looking is the kind and careful thing to do.',
              ),
            ]),
            o('The merchants, for not asking why the ground was warm.', [
              N(
                'That’s a fair answer, too. Your Nubbin noticed. Noticing, and speaking up, matters.',
              ),
            ]),
          ],
          'Reasoned about blame and not knowing, with no single right answer.',
        ),
      ],
      [
        {
          id: 'kick',
          label: 'Kick, hard.',
          then: [N('The tub spins round and round, and goes nowhere in particular, very fast.')],
        },
        {
          id: 'float',
          label: 'Float, and let the current take you.',
          then: [YS('Good thinking. The sea knows where it’s going, even if I don’t.', 'think')],
        },
      ],
    ),
    sc(
      'a06-02-tub-done',
      [
        N(
          'A day, a night, another day. Then the tub bumps on sand, and Sinbad laughs, and is sick, and laughs again.',
        ),
        N('Your arms ache. You have held on to a tub for most of three days.'),
      ],
      [
        nt(
          1,
          'science',
          'whales are mammals that breathe air',
          '4-LS1-1',
          [
            NV(
              'Nova’s notes: whales look like fish, but they’re mammals. They breathe air through a blowhole, and mothers feed their calves milk.',
            ),
            NV(
              'A sleeping whale floats near the surface. Sailors in old times sometimes mistook one for an island, and told this very story.',
            ),
          ],
          'Learned that whales are air-breathing mammals, not fish.',
        ),
      ],
    ),
    sc(
      'a06-02-complete',
      [
        N(
          'The carpet is a carpet again. The porter is staring at you with a date halfway to his mouth.',
        ),
        P('A fish. With trees on.'),
        S('A whale. I didn’t know the word then. Neither did the captain.'),
        P('And you lit a fire on its back.', 'think'),
        S('In fairness, it was a very good fire.', 'happy'),
        P('I’d have woken up too.'),
        N('Your Nubbin is still damp. Nobody can explain this, so nobody tries.'),
      ],
      [
        ak(
          3,
          'literacy',
          'point of view: the sailor and the porter see it differently',
          'RL.3.6',
          [
            N(
              'The old man laughs about the whale; the porter is horrified. Same event, different feelings. Which is closest to how YOU felt about the fire on the whale?',
            ),
          ],
          [
            o('I laughed, like the sailor.', [
              N(
                'That’s a good way to feel about a story that ended well. Laughing about a past scare is a common way to be brave.',
              ),
            ]),
            o('I felt sorry for the whale, like the porter.', [
              N(
                'Good. That’s a kind way to feel, too. Both views are real. A story can hold both.',
              ),
            ]),
            o('Both at once.', [
              N(
                'Yes, and that’s very true to life. You can laugh at something and still feel for the creature it hurt.',
              ),
            ]),
          ],
          'Compared their own point of view with two characters’ different reactions.',
        ),
      ],
    ),
  ],
  [
    gloss(
      'dhow',
      'A traditional ship from the Arabian Sea and Indian Ocean, with a triangular sail.',
      'a06-02-telling',
    ),
    gloss(
      'lookout',
      'A person whose job is to watch for danger or land from a high place.',
      'a06-02-telling-done',
    ),
    gloss('shudders', 'Shakes suddenly and strongly, all over.', 'a06-02-island-done'),
    gloss(
      'mammal',
      'An animal that breathes air, has some hair and feeds its babies milk.',
      'a06-02-tub-done',
    ),
  ],
);

// ================================================================== A6-3 The King’s Stables
const A03: EduQuest = quest(
  'a06-03',
  'The King’s Stables',
  {
    'a06-03-s1': {
      goal: 'Go with the king’s groom to meet the king.',
      hint: 'Follow the groom up from the beach where the horses graze.',
    },
    'a06-03-s2': {
      goal: 'Help Sinbad check the cargo of a ship just in.',
      hint: 'Look at the marks painted on the bales on the quay.',
    },
    'a06-03-s3': {
      goal: 'Help Sinbad prove who he is.',
      hint: 'Look inside the bale with the green cord.',
    },
  },
  [
    sc(
      'a06-03-shore',
      [
        N(
          'You are back in the tale, on a beach, and Sinbad is sitting up and counting his fingers.',
        ),
        YS('Ten. Good. And you’re still here. Where’s here?'),
        N(
          'Down the beach, beautiful horses graze by the surf, and a groom shouts at you for frightening them.',
        ),
        N(
          'The groom is kind, once he stops shouting. He feeds you both, and takes you up to his king.',
        ),
        KI(
          'A man who came out of the sea in a washtub. Sit by me. Tell me about Baghdad.',
          'happy',
        ),
        YS(
          'It’s round, majesty. The city is perfectly round, with four gates, and the Caliph’s palace right in the middle.',
        ),
        KI('Round. Why round?', 'think'),
      ],
      [
        ak(
          6,
          'maths',
          'a circle: every point is the same distance from the centre',
          undefined,
          [
            N(
              'Sinbad could say something clever here. In a circle, how far is every point on the edge from the centre?',
            ),
          ],
          [
            o(
              'The same distance.',
              [
                N(
                  'Yes! That’s what makes a circle a circle. So in a round city, every gate is equally far from the palace.',
                ),
              ],
              true,
            ),
            o('It depends which point.', [
              N(
                'In a circle it doesn’t. Every point on the edge is the same distance from the centre. That’s the definition.',
              ),
            ]),
          ],
          'Learned that every point on a circle is the same distance from its centre.',
        ),
      ],
      [
        {
          id: 'fair',
          label: 'Say: so the palace is the same distance from every gate.',
          then: [KI('Fair. I like a fair city.', 'happy')],
        },
        {
          id: 'market',
          label: 'Say: so the markets never come to an end.',
          then: [KI('Ha! A city you can’t get out of. I know a few like that.', 'happy')],
        },
      ],
    ),
    sc(
      'a06-03-shore-done',
      [
        N(
          'The king makes Sinbad keeper of his harbour. He writes down every ship that comes and goes.',
        ),
        N('And Sinbad asks every captain the way to Baghdad.'),
        N(
          'Sinbad’s notebook fills with names, dates and cargoes, in a neat hand that gets neater every month.',
        ),
      ],
      [
        nt(
          2,
          'social-studies',
          'records and ledgers: harbour-keepers wrote down ships and goods',
          'D2.His.2.K-2',
          [
            NV(
              'Nova’s notes: harbour-keepers in old ports kept long lists of ships and cargoes, so the king knew what came in and what it was worth.',
            ),
            NV(
              'Old lists, letters and accounts like these are how we know about trade across the Indian Ocean a thousand years ago. Boring records make good history.',
            ),
          ],
          'Learned that written records of trade help us know about the past.',
        ),
      ],
    ),
    sc(
      'a06-03-harbour',
      [
        N(
          'Months pass in a page. Sinbad gets a good coat and a bad cough, and still asks every ship the way home.',
        ),
        N(
          'One morning a dhow ties up at the quay, and its sail has a patch on it you have seen before.',
        ),
        YS('That’s our ship. That’s my ship.', 'shock'),
        CP('Unloading! Most of it’s for sale. Those bales belonged to a merchant who drowned.'),
        CP(
          'Sinbad of Baghdad, God rest him. I’ll sell them here and take the money home to his family.',
        ),
        N(
          'The bales have Sinbad’s mark painted on the sacking. Your Nubbin sniffs one, and sneezes: it smells of home.',
        ),
        YS('I’m Sinbad. I’m him.'),
        CP(
          'Everybody’s Sinbad, the minute there’s something to be had. I met three Sinbads at the last port.',
          'angry',
        ),
      ],
      [
        ak(
          7,
          'sel',
          'think: who do we believe?',
          RES,
          [
            N(
              'The captain has met three false Sinbads, so he doesn’t believe this one. How should we decide whether to believe someone? There’s no one right way.',
            ),
          ],
          [
            o('Ask for proof they could only have if it’s true.', [
              N('A fair answer, and it’s what the story does next. Proof is hard to fake.'),
            ]),
            o('Believe people unless there’s a reason not to.', [
              N(
                'A fair answer. Trusting first is kind, though the captain has been tricked before, so he has a reason.',
              ),
            ]),
            o('Be careful when money is involved.', [
              N(
                'A fair answer. People do lie more when there’s something to gain, which is exactly why the captain is wary.',
              ),
            ]),
          ],
          'Thought about how we decide whom to believe.',
        ),
      ],
    ),
    sc(
      'a06-03-harbour-done',
      [
        N('The captain folds his arms. The bales sit between you, smelling of Basra.'),
        N('Sinbad looks like a man who has just been told that he is dead.'),
      ],
      [
        ak(
          1,
          'literacy',
          'feelings words',
          'RL.3.3',
          [
            N(
              'Sinbad is frustrated and a little scared. Which word best describes feeling that nobody will believe the truth?',
            ),
          ],
          [
            o(
              'Helpless.',
              [
                N(
                  'Yes. Helpless means you want to act but nothing you say or do seems to work. It’s a heavy feeling, and a friend nearby makes it lighter.',
                ),
              ],
              true,
            ),
            o('Bored.', [
              N('Not bored: Sinbad is fully awake and worried. The word we want is helpless.'),
            ]),
            o('Proud.', [
              N(
                'Proud is the opposite of how he looks. Helpless fits better: stuck, with no way to be believed.',
              ),
            ]),
          ],
          'Chose a word that matches a character’s feeling.',
        ),
      ],
    ),
    sc(
      'a06-03-proof',
      [
        YS('Ask me anything. Anything about the voyage.'),
        CP('All right. What did we eat the night the island sank?'),
        YS('Nothing. You all ran off and left the pot.'),
        CP('Hm. Then what’s in the bale with the green cord?', 'think'),
        N('Sinbad goes blank. He was a young man who never read his own lists.'),
        N(
          'Your Nubbin is already tugging at the green cord. A corner of something blue shows through: dyed cloth, folded the Baghdad way.',
        ),
      ],
      [
        nt(
          5,
          'science',
          'indigo is a dye made from a plant',
          '2-PS1-1',
          [
            NV(
              'Nova’s notes: indigo is a deep blue dye made from the leaves of the indigo plant, soaked, beaten and dried. It was traded across the Indian Ocean for centuries.',
            ),
            NV(
              'Indigo clings to the outside of each thread instead of soaking right in, so it rubs off bit by bit. That’s why blue jeans fade.',
            ),
          ],
          'Learned that indigo is a plant-based blue dye and how it sticks to cloth.',
        ),
        ak(
          3,
          'maths',
          'two-step problem',
          '3.OA.D.8',
          [
            CP(
              'One more test. A crate holds twelve jars of oil. I have two crates and five loose jars. How many jars in all?',
            ),
          ],
          [
            o(
              '29',
              [
                CP(
                  'Correct. Two crates of twelve is 24, and five loose jars makes 29. You’d make a decent merchant.',
                ),
                N('Your Nubbin counts the jars on its fingers too, and nods.'),
              ],
              true,
            ),
            o('17', [
              CP(
                'That’s one crate and the loose jars. But I said two crates: 12 + 12 = 24, and then 5 more is 29.',
              ),
            ]),
            o('36', [
              CP(
                'That treats the loose jars as a third crate. Two crates is 24; the loose five are only five: 29.',
              ),
            ]),
          ],
          'Solved a two-step word problem (2 × 12 + 5 = 29).',
        ),
      ],
      [
        {
          id: 'point',
          label: 'Point at the blue cloth, and let Sinbad say it.',
          then: [
            YS('Indigo! Twenty lengths of indigo, from my uncle’s shop by the bridge!', 'happy'),
            CP('…That’s right.', 'shock'),
          ],
        },
        {
          id: 'whisper',
          label: 'Whisper, “Your uncle’s shop.”',
          then: [
            YS('My uncle’s indigo! Twenty lengths of it!', 'happy'),
            CP('…Nobody but Sinbad would know that.', 'shock'),
          ],
        },
      ],
    ),
    sc(
      'a06-03-proof-done',
      [
        CP('I left you on a sinking fish. I’m sorry.', 'soft'),
        CP('Take your bales. And take my hand, if you will.'),
        N('Sinbad looks at the hand for a long moment. Then he takes it.'),
      ],
      [
        nt(
          1,
          'sel',
          'a real apology and forgiving',
          SOC,
          [
            N(
              'A good apology says what you did, says sorry, and doesn’t make excuses. The captain does all three: “I left you. I’m sorry.”',
            ),
            N(
              'Forgiving doesn’t mean pretending it didn’t hurt. It means choosing not to carry the hurt around any longer.',
            ),
          ],
          'Learned what makes a real apology and what forgiving means.',
        ),
      ],
    ),
    sc(
      'a06-03-complete',
      [
        N(
          'Sinbad sells his bales, gives the king a fine gift, and sails home with the captain who left him behind.',
        ),
        N('They are friends by the time they reach Basra. Sailors are like that.'),
        P('The captain left you in the sea, and you shook his hand?'),
        S('The captain came back with my things. Every bale. Do you know how rare that is?'),
        P('I’ve carried for men who’d sell their own mother’s washing.', 'think'),
        S(
          'Then you know. And I swore on my own doorstep: never again. That lasted nearly a year.',
          'happy',
        ),
      ],
      [
        ak(
          4,
          'literacy',
          'theme',
          'RL.4.2',
          [
            N(
              'Think about the whole tale: the whale, the king, the proof, the apology. What is the biggest idea the story seems to be saying?',
            ),
          ],
          [
            o(
              'People can make mistakes and still be forgiven.',
              [
                N(
                  'Yes, that’s a theme the scene returns to: the captain’s mistake, then his apology, then a friendship.',
                ),
              ],
              true,
            ),
            o('Never trust a captain.', [
              N(
                'That’s one thing a character might feel, but the ending shows the captain repaired it. The story is bigger than that.',
              ),
            ]),
            o('Round cities are best.', [
              N(
                'Funny, and it’s part of the tale, but it’s not what the main events add up to. Look at what happens between the captain and Sinbad.',
              ),
            ]),
          ],
          'Identified a theme (mistakes and forgiveness) from the whole quest.',
        ),
      ],
    ),
  ],
  [
    gloss('groom', 'A person who looks after horses.', 'a06-03-shore'),
    gloss(
      'quay',
      'A solid platform beside water where ships are loaded and unloaded.',
      'a06-03-harbour',
    ),
    gloss('bale', 'A large bundle of goods, wrapped up tight for carrying.', 'a06-03-harbour'),
    gloss('indigo', 'A deep blue dye made from a plant.', 'a06-03-proof'),
  ],
);

// ================================================================== A6-4 The Roc’s Egg
const A04: EduQuest = quest(
  'a06-04',
  'The Roc’s Egg',
  {
    'a06-04-s1': {
      goal: 'Find out where the ship has gone.',
      hint: 'Climb the tallest tree on the island and look all round.',
    },
    'a06-04-s2': {
      goal: 'Walk round the white dome and look for a way in.',
      hint: 'Circle the dome. Put your ear to it.',
    },
    'a06-04-s3': {
      goal: 'Tie yourselves to the roc’s foot before she wakes.',
      hint: 'Help Sinbad with his turban cloth at the roc’s foot.',
    },
  },
  [
    sc(
      'a06-04-left',
      [
        S(
          'The second voyage. Money makes you bored, and boredom makes you stupid. So I went back to Basra.',
        ),
        N(
          'The carpet turns blue again, then green: an island of fruit trees, a cold spring, merchants resting in the shade.',
        ),
        YS('Eat, drink, sleep for an hour. The captain said an hour.'),
        N(
          'Sinbad lies down under a tree with his turban over his eyes. Your Nubbin lies down on his chest.',
        ),
        N(
          'You must sleep too. When you wake, the shade has moved a long way, and the sea is empty.',
        ),
        YS('An hour! He said an hour!', 'shock'),
        YS('Twice now. What is it about me that makes captains leave?', 'sad'),
      ],
      [
        nt(
          4,
          'science',
          'shadows move as the Sun moves across the sky',
          '5-ESS1-2',
          [
            NV(
              'Nova’s notes: you can tell time by shadows. As the Sun crosses the sky, shadows swing round: longest early and late, shortest at noon.',
            ),
            NV('“The shade has moved a long way” tells you how long you slept, without a clock.'),
          ],
          'Learned that shadows move and change length through the day, so they show the passing of time.',
        ),
        ak(
          6,
          'sel',
          'think: bad luck, or something to change?',
          RES,
          [
            N(
              'Sinbad has now been left behind twice. When the same thing happens twice, is it bad luck, or a pattern we could change? There’s no single answer.',
            ),
          ],
          [
            o('Bad luck: it could happen to anyone.', [
              N(
                'A fair answer. Sometimes things really are just chance, and blaming ourselves doesn’t help.',
              ),
            ]),
            o('A pattern: maybe he should stay close to the ship.', [
              N(
                'A fair answer. Noticing a pattern lets us change what we do next time, even if it wasn’t entirely our fault.',
              ),
            ]),
            o('Both: it was luck, and he could still be more careful.', [
              N('That’s a thoughtful answer. Many problems have a bit of both.'),
            ]),
          ],
          'Thought about luck versus patterns, with no single right answer.',
        ),
      ],
      [
        {
          id: 'comfort',
          label: 'Say it isn’t him, it’s captains.',
          then: [YS('That’s kind. It’s also probably true.', 'soft')],
        },
        {
          id: 'climb',
          label: 'Say you should climb a tree and look.',
          then: [YS('Yes. Doing something. Good. Better than sulking.')],
        },
      ],
    ),
    sc(
      'a06-04-left-done',
      [
        N(
          'From the top of the tallest tree you can see the whole island. On the far side stands a great white dome, shining.',
        ),
        N('It is too regular to be a hill, and too big to be a hut.'),
      ],
      [
        nt(
          1,
          'social-studies',
          'looking from high places to make a map',
          '4-ESS2-2',
          [
            NV(
              'Nova’s notes: climbing high lets you see more of the land. That’s how early map-makers worked: from hills, towers and masts.',
            ),
            NV(
              'A bird’s-eye view turns a tangle of trees into a plan you can follow. Maps are views from above that no one could see standing on the ground.',
            ),
          ],
          'Learned that high viewpoints show more of the land, as map-makers used.',
        ),
      ],
    ),
    sc(
      'a06-04-dome',
      [
        N('The dome is smooth and white and as tall as a house, and it has no door.'),
        YS(
          'Fifty paces round, I counted. No door, no window, no seam. Who builds a house with no door?',
        ),
        N(
          'Your Nubbin puts its ear to the white wall. Then it puts its whole face to it, and goes very still.',
        ),
        N('Something inside goes tap, very small. Then tap, tap.'),
        N(
          'The sun goes out. Not behind a cloud: out, the way a lamp does when somebody stands in front of it.',
        ),
        N(
          'A bird comes down out of the sky, a bird the size of a cloud, and settles over the dome like a hen.',
        ),
        YS('It’s an egg. The dome is an egg. And that is its mother.', 'shock'),
      ],
      [
        ak(
          1,
          'maths',
          'multiply, and convert units',
          '4.MD.A.1',
          [
            YS(
              'One pace is about eighty centimetres. If the dome is fifty paces round, about how many metres round is it? (100 cm = 1 m.)',
            ),
          ],
          [
            o(
              '40 metres.',
              [YS('Yes! 50 × 80 cm = 4,000 cm, and 4,000 cm is 40 metres. A big egg.')],
              true,
            ),
            o('4,000 metres.', [
              YS(
                '4,000 is the number of centimetres. A hundred of those make a metre, so 4,000 ÷ 100 = 40 metres.',
              ),
            ]),
            o('130 metres.', [
              YS(
                'That adds 50 + 80. But the paces are being multiplied: 50 steps of 80 cm. That’s 4,000 cm, or 40 metres.',
              ),
            ]),
          ],
          'Multiplied 50 paces by 80 cm and converted centimetres to metres (40 m).',
        ),
        nt(
          3,
          'science',
          'sound travels through solid things as vibrations',
          '4-PS3-2',
          [
            NV(
              'Nova’s notes: when something taps inside a shell, the shell vibrates, and the vibration travels to your ear through the wall.',
            ),
            NV(
              'That’s why putting your ear to a wall lets you hear what the air alone wouldn’t carry. Solid things can carry sound better than air.',
            ),
          ],
          'Learned that sound travels through solids as vibrations.',
        ),
      ],
    ),
    sc(
      'a06-04-dome-done',
      [
        N('The roc tucks her head under her wing. She snores, and the snore lifts your hair.'),
        N(
          'Sinbad stands very still, with his hand over his own mouth, as if his breathing might wake her.',
        ),
      ],
      [
        nt(
          1,
          'sel',
          'being scared and staying calm',
          'CASEL: Self-management',
          [
            YS('Slow breath in. Slow breath out. The body listens to the breath.'),
            YS(
              'When we’re frightened, the heart races. Breathing slowly tells the heart it can slow down too.',
            ),
          ],
          'Learned that slow breathing can help the body calm down when frightened.',
        ),
      ],
    ),
    sc(
      'a06-04-leg',
      [
        YS('She’ll fly in the morning. Birds do. Wherever she goes, it’s off this island.'),
        N(
          'He unwinds his turban, which turns out to be very long. Your Nubbin helps by getting wound up in it twice.',
        ),
        N(
          'You tie yourselves to one great scaly toe, gently, under the feathers, where she won’t feel it.',
        ),
        YS('Don’t pull. Don’t tickle. Don’t breathe on her.'),
        N(
          'At dawn the roc stands, stretches wings that cover half the sky, and steps off the island into the air.',
        ),
        N('The sea drops away under your feet. Her heartbeat comes down her leg like a drum.'),
      ],
      [
        ak(
          5,
          'science',
          'forces: lift and gravity',
          '3-PS2-1',
          [
            N(
              'For the roc to rise, which must be bigger: the upward push of her wings on the air, or the pull of gravity on her body?',
            ),
          ],
          [
            o(
              'The upward push.',
              [
                N(
                  'Yes! To climb, the push up must be bigger than the pull down. In level flight, the two are balanced.',
                ),
              ],
              true,
            ),
            o('Gravity.', [
              N('If gravity were bigger, she’d sink. To rise, the upward push has to win.'),
            ]),
            o('They must be exactly equal.', [
              N('Equal means she holds her height. To climb, the push up must win.'),
            ]),
          ],
          'Understood that a flying bird needs an upward force larger than gravity to climb.',
        ),
      ],
      [
        {
          id: 'look',
          label: 'Look down.',
          then: [N('The island is a coin. Then it is a crumb, and then it is gone.')],
        },
        {
          id: 'shut',
          label: 'Shut your eyes.',
          then: [N('Your Nubbin keeps its eyes open for both of you, and squeaks at every cloud.')],
        },
      ],
    ),
    sc(
      'a06-04-leg-done',
      [
        N(
          'At noon the roc comes down on a high bare ridge. You untie the turban faster than you have ever done anything.',
        ),
        N('Sinbad’s hands are still shaking. So are yours.'),
      ],
      [
        ak(
          1,
          'sel',
          'bravery means acting while scared',
          'CASEL: Self-management',
          [N('You were frightened up there, and you did it anyway. What is bravery?')],
          [
            o(
              'Doing something even though you feel afraid.',
              [N('Yes! Bravery isn’t not feeling fear. It’s acting well while you feel it.')],
              true,
            ),
            o('Not feeling fear at all.', [
              N(
                'Everyone feels fear sometimes, even the bravest people. Bravery is acting while you feel it.',
              ),
            ]),
          ],
          'Learned that bravery means acting while afraid.',
        ),
      ],
    ),
    sc(
      'a06-04-complete',
      [
        N(
          'The roc doesn’t notice you at all. She shakes out her feathers and goes back up into the sun.',
        ),
        N(
          'As she goes, one feather comes loose and turns over and over in the air. It is as long as you are tall.',
        ),
        N('Your Nubbin catches it, and falls over.'),
        YS(
          'Keep that. Nobody in Baghdad will believe a word of this, so you’ll want proof.',
          'happy',
        ),
        N(
          'When the carpet is a carpet again, the feather is still in your hands. The porter’s mouth is open.',
        ),
        P('That is not a chicken.'),
        S(
          'No. That is your friend’s, now. A feather a roc let go of is a gift, not a theft.',
          'happy',
        ),
      ],
      [
        ak(
          4,
          'maths',
          'compare lengths with fractions',
          '3.NF.A.1',
          [
            N(
              'The feather is as long as you are tall. Say you are 120 cm tall. A quarter of the feather is how long?',
            ),
          ],
          [
            o('30 cm', [N('Yes! A quarter means 1 of 4 equal parts: 120 ÷ 4 = 30 cm.')], true),
            o('60 cm', [N('That’s half of 120. A quarter is half of a half: 60 ÷ 2 = 30 cm.')]),
            o('4 cm', [N('Not quite: 120 split into 4 equal parts is 120 ÷ 4 = 30 cm each.')]),
          ],
          'Found a unit fraction (1/4) of a length (30 cm of 120 cm).',
        ),
      ],
    ),
  ],
  [
    gloss('pace', 'One step, used as a rough way to measure a distance.', 'a06-04-dome'),
    gloss('ridge', 'A long, narrow strip of high ground.', 'a06-04-leg-done'),
    gloss('vibration', 'A very fast shaking back and forth that makes sound.', 'a06-04-dome'),
    gloss('regular', 'Even and orderly, with a clear shape or pattern.', 'a06-04-left-done'),
  ],
);

// ================================================================== A6-5 The Valley of Diamonds
const A05: EduQuest = quest(
  'a06-05',
  'The Valley of Diamonds',
  {
    'a06-05-s1': {
      goal: 'Climb down into the valley without waking the snakes.',
      hint: 'Step only on the bare stone between the sleeping snakes.',
    },
    'a06-05-s2': {
      goal: 'Work out where the meat is coming from, and how to use it.',
      hint: 'Watch the rim of the valley and the eagles above it.',
    },
    'a06-05-s3': {
      goal: 'Ride the eagle up out of the valley.',
      hint: 'Hold on to Sinbad’s belt until you reach the rim.',
    },
  },
  [
    sc(
      'a06-05-valley',
      [
        N(
          'The ridge looks down into a deep, narrow valley with walls too steep to climb. Its floor glitters, as if someone spilt the stars.',
        ),
        YS('Diamonds. That’s a valley of diamonds. Look at the size of them!', 'shock'),
        N(
          'Between the stones, long dark shapes lie coiled in the sun: snakes, each as thick as a well rope, all asleep.',
        ),
        YS('Ah. So that’s why nobody has picked them up.'),
        N(
          'There is no way out but down, so you go down, slowly, picking the gaps between the sleeping snakes.',
        ),
        N('Your Nubbin walks on tiptoe. It has never done this before, and it does it very well.'),
      ],
      [
        nt(
          2,
          'science',
          'reptiles are cold-blooded and warm up in the sun',
          '4-LS1-1',
          [
            NV(
              'Nova’s notes: snakes are reptiles. Their bodies don’t make much heat, so they take it from outside, lying in the sun to warm up.',
            ),
            NV(
              'A warm snake can move fast, and a cold one is sluggish. These are dozing in the sun, so tread softly and don’t wake them.',
            ),
          ],
          'Learned that snakes are cold-blooded reptiles that warm their bodies in the sun.',
        ),
        ak(
          5,
          'maths',
          'multiplication',
          '3.OA.A.3',
          [
            YS(
              'Seven snakes lie in each row of the valley, and there are four rows. How many snakes must we tiptoe past?',
            ),
          ],
          [
            o(
              '28',
              [YS('Yes. Four rows of seven: 4 × 7 = 28. Twenty-eight snakes, and no sneezing.')],
              true,
            ),
            o('11', [
              YS('That adds 7 + 4. But there are four rows, with seven in each: 4 × 7 = 28.'),
            ]),
            o('21', [YS('That’s three rows of seven. There are four rows, so 4 × 7 = 28.')]),
          ],
          'Solved an equal-groups problem (4 rows of 7 snakes = 28).',
        ),
      ],
      [
        {
          id: 'breath',
          label: 'Hold your breath past the biggest snake.',
          then: [N('The snake opens one eye, considers you, and decides it isn’t hungry yet.')],
        },
        {
          id: 'round',
          label: 'Go the long way round it.',
          then: [N('It takes an hour. Sinbad complains, in a whisper, for the entire hour.')],
        },
      ],
    ),
    sc(
      'a06-05-valley-done',
      [
        N(
          'In the middle of the valley something falls out of the sky and lands with a wet slap. It is a great joint of meat.',
        ),
        N('Pale glints are stuck in its fat. Sinbad crouches over it, frowning.'),
      ],
      [
        nt(
          1,
          'science',
          'diamond is the hardest natural material',
          '2-PS1-1',
          [
            NV(
              'Nova’s notes: a diamond is pure carbon, squeezed deep in the Earth until its atoms lock together very tightly.',
            ),
            NV(
              'That makes it the hardest natural material we know. It can scratch glass, and only another diamond can scratch it.',
            ),
          ],
          'Learned that a diamond is the hardest natural material.',
        ),
      ],
    ),
    sc(
      'a06-05-meat',
      [
        N('Another lump of meat lands, and another. Diamonds stick to them, pressed into the fat.'),
        N(
          'Men on the rim are throwing the meat down. Great eagles drop out of the sky, snatch it, and carry it up.',
        ),
        YS(
          'I’ve heard of this. The eagles bring the meat up, the merchants chase them off it, and they pick out the stones.',
          'think',
        ),
        YS('If an eagle can lift that, it can lift me. And you two are very small.'),
        N(
          'Sinbad ties himself under the biggest piece of meat with what’s left of his turban. It is the least dignified thing you have ever seen.',
        ),
        N('Then Sinbad starts filling his pockets, fast, with the biggest stones in reach.'),
        YS('Take some! Quick! You’ll never be poor again!', 'happy'),
        N(
          'By your foot lies a small clear stone, no bigger than a lentil. Your Nubbin looks at it, and then at you.',
        ),
      ],
      [
        ak(
          7,
          'sel',
          'think: how much is enough?',
          RES,
          [
            N(
              'Sinbad stuffs his pockets. You could take a stone, or none. Is taking one wise, or silly? Is taking nothing wise, or silly? There’s no single right answer.',
            ),
          ],
          [
            o('Take a stone: a small gift is harmless, and means something.', [
              YS(
                'A fair answer. A small thing, chosen on purpose, can matter more than a heap you grabbed.',
              ),
            ]),
            o('Take nothing: some things are better left shining.', [
              YS(
                'A fair answer. Not everything has to be owned. Some things are just good to see.',
              ),
            ]),
            o('Take lots: you’d never be poor again.', [
              YS(
                'A fair answer. It’s honest to want safety. The tale does ask what “enough” really means, though.',
              ),
            ]),
          ],
          'Thought about what is enough, with no right answer.',
        ),
      ],
      [
        {
          id: 'stone',
          label: 'Take one small stone, for the porter.',
          set: { 'a06-stone': 'taken' },
          then: [
            N('You put it in your pocket. It is warm from the sun, and weighs almost nothing.'),
            YS('One? One! You’re madder than the fish.', 'happy'),
          ],
        },
        {
          id: 'nothing',
          label: 'Take nothing.',
          set: { 'a06-stone': 'left' },
          then: [
            N(
              'You leave it where it is. It goes on shining at the sky, as it has for a thousand years.',
            ),
            YS('Nothing? Well. More for me.', 'think'),
            YS('…You’re a strange one.', 'soft'),
          ],
        },
      ],
    ),
    sc(
      'a06-05-meat-done',
      [
        N('Your Nubbin climbs into Sinbad’s sash. You grab hold of Sinbad’s belt with both hands.'),
        N('An eagle’s shadow slides across the valley floor, getting bigger.'),
      ],
      [
        ak(
          1,
          'social-studies',
          'legends travel between cultures',
          'D2.His.2.K-2',
          [
            NV(
              'Nova’s notes: tales of a valley of jewels guarded by snakes were told in Arabic, Persian and in stories about Alexander the Great.',
            ),
            NV('Why might the same story turn up in so many places?'),
          ],
          [
            o(
              'Travellers carried it and each place told it its own way.',
              [
                NV(
                  'Yes! Merchants, sailors and pilgrims carried stories as well as goods, and every telling changed a little.',
                ),
              ],
              true,
            ),
            o('Each country invented it at exactly the same time.', [
              NV(
                'Unlikely! Stories spread because people travel and talk. Sailors and traders were the story-carriers of the old world.',
              ),
            ]),
          ],
          'Learned that the same legend spread between cultures because travellers carried it.',
        ),
      ],
    ),
    sc(
      'a06-05-lift',
      [
        N('An eagle comes down like a dropped sack, hooks the meat, and heaves.'),
        N('You leave the ground. The snakes shrink to threads, and the wind is full of feathers.'),
        N(
          'At the rim a merchant rushes out banging two pans. The eagle drops its load and flaps off, furious.',
        ),
        ME('A man! There’s a man on my meat!', 'shock'),
        ME('And there are no diamonds on it. Not one. Because you’re lying on it!', 'angry'),
        YS('Peace, friend. Here. I have more than I can carry.'),
        N(
          'Sinbad gives him a handful of stones. The merchant stops shouting all at once, like a kettle taken off the fire.',
        ),
      ],
      [
        nt(
          6,
          'literacy',
          'a simile that shows feeling',
          'L.4.5',
          [
            NV(
              '“Like a kettle taken off the fire.” The writer compares the merchant’s anger to a kettle: loud and steaming one second, and quiet the next.',
            ),
            NV(
              'A good simile makes a feeling easy to picture. What would you compare a sudden calm to?',
            ),
          ],
          'Noticed how a simile makes a character’s sudden change of feeling easy to picture.',
        ),
      ],
    ),
    sc(
      'a06-05-lift-done',
      [
        ME(
          'Twenty years I’ve thrown meat into that valley. Nobody ever came up with it before.',
          'think',
        ),
        N('The merchant looks at Sinbad as if he has met a talking cat.'),
      ],
      [
        nt(
          1,
          'sel',
          'a calm answer turns away anger',
          'CASEL: Relationship skills',
          [
            N(
              'The merchant arrived angry. Sinbad answered with “Peace, friend” and a gift, and the anger drained away.',
            ),
            N(
              'Answering anger calmly doesn’t always work, but it gives the other person room to stop. Shouting back usually keeps the fight going.',
            ),
          ],
          'Learned that answering anger calmly can help it fade.',
        ),
      ],
    ),
    sc(
      'a06-05-complete',
      [
        N('The carpet and the cushions are back, and the porter is holding his breath.'),
        S(
          'I came home rich. I gave a good part to the poor, as you should, and then I sat on the rest and got bored.',
        ),
        N(
          'Your hand is in your pocket. The little stone is still there, warm, as if it came back through the page with you.',
        ),
        N('You put it in the porter’s palm. He looks at it for a long time.'),
        P(
          'I’ve carried a hundred loads of other people’s jewels. Nobody ever gave me one.',
          'soft',
        ),
        P('I won’t sell it. Don’t ask me why. I just won’t.'),
        S('Good. A stone you don’t sell is worth more than one you do.', 'happy'),
      ],
      [
        ak(
          3,
          'literacy',
          'why a small gift can matter most',
          'RL.3.3',
          [
            N(
              'The porter has carried hundreds of loads of jewels, but he won’t sell this stone. What makes it worth more to him?',
            ),
          ],
          [
            o(
              'It was given to him by a friend who thought of him.',
              [
                N(
                  'Yes. The stone’s value isn’t in what it could be sold for: it’s in what it means.',
                ),
              ],
              true,
            ),
            o('It is the biggest stone in the valley.', [
              N('It’s no bigger than a lentil. Its worth to the porter is the thought behind it.'),
            ]),
          ],
          'Reasoned about why a small gift can be worth more to someone than money.',
        ),
      ],
    ),
  ],
  [
    gloss('coiled', 'Wound round and round in a loop or spiral.', 'a06-05-valley'),
    gloss(
      'reptile',
      'A cold-blooded animal with scaly skin, such as a snake or lizard.',
      'a06-05-valley',
    ),
    gloss('rim', 'The top edge of something round, like a cup or a valley.', 'a06-05-meat'),
    gloss('dignified', 'Calm and serious, in a way that earns respect.', 'a06-05-meat'),
  ],
);

// ================================================================== A6-6 The Giant’s Island
const A06: EduQuest = quest(
  'a06-06',
  'The Giant’s Island',
  {
    'a06-06-s1': {
      goal: 'Explore the giant’s yard with the shipwrecked sailors.',
      hint: 'Look round the yard. Count everyone.',
    },
    'a06-06-s2': {
      goal: 'Get everyone past the sleeping giant and out of the gate.',
      hint: 'Find something in the cook’s bag that would make anyone sneeze.',
    },
    'a06-06-s3': {
      goal: 'Build rafts and get off the island before the giant stops sneezing.',
      hint: 'Lash driftwood together on the beach and push off.',
    },
  },
  [
    sc(
      'a06-06-castle',
      [
        S(
          'The third voyage. I’ll tell this one gently, since there’s a child at home who’ll want it.',
          'soft',
        ),
        N(
          'The sea again: a storm, a strange island, and a house as big as a hill with a gate made of tree trunks.',
        ),
        N(
          'In the yard there are cooking pots big enough to bath in, and a bench like a ship turned upside down.',
        ),
        YS('Nobody’s home. Good. I don’t like whoever lives here, and I haven’t met him.'),
        N(
          'The ground shakes, one step at a time. A giant ducks in under the gate, with one eye in the middle of his forehead like a lamp.',
        ),
        N('He looks at the sailors, and then at his huge empty pots, and rubs his tummy.'),
        N(
          'Then he yawns enormously, lies down across the gateway, and falls asleep with one hand on the bolt.',
        ),
      ],
      [
        nt(
          3,
          'science',
          'big footsteps make vibrations you can feel',
          '4-PS3-2',
          [
            NV(
              'Nova’s notes: a heavy foot hitting the ground makes the ground shake. Those vibrations spread out through the ground like ripples on a pond.',
            ),
            NV(
              'Elephants and other big animals can feel far-off footsteps through their feet. A giant would be felt long before he is seen.',
            ),
          ],
          'Learned that heavy footsteps send vibrations through the ground.',
        ),
        dn(
          6,
          'maths',
          'add to find a total',
          '2.OA.A.1',
          'edu:add:sailors:14',
          [
            N(
              'Count the party: eleven sailors, plus Sinbad, plus you, plus your Nubbin. Add them up to see how many must get past the giant.',
            ),
          ],
          'Added 11 + 1 + 1 + 1 = 14.',
        ),
      ],
      [
        {
          id: 'pot',
          label: 'Hide in a cooking pot.',
          then: [N('Your Nubbin is already in it. It is a surprisingly good pot.')],
        },
        {
          id: 'count',
          label: 'Count the sailors, to be sure everyone is here.',
          then: [
            N('Eleven sailors, one Sinbad, one you, one Nubbin. All here, and all very quiet.'),
          ],
        },
      ],
    ),
    sc(
      'a06-06-castle-done',
      [
        YS('He’s asleep across the only way out. We go over him, or we don’t go.'),
        N('Eleven sailors look at their own feet. Nobody volunteers to go first.'),
      ],
      [
        ak(
          1,
          'sel',
          'fear and bravery in a group',
          'CASEL: Self-management',
          [
            N(
              'Everybody is scared, and nobody wants to go first. What helps a frightened group most?',
            ),
          ],
          [
            o(
              'Making a plan together, so each person has a job.',
              [
                N(
                  'Yes! A clear plan turns a big fear into small jobs. Having something to do is calming.',
                ),
              ],
              true,
            ),
            o('Waiting and hoping the giant leaves.', [
              N(
                'He’s asleep, not leaving. Waiting rarely helps when you’re in danger. A plan does.',
              ),
            ]),
            o('Everyone running at once.', [
              N(
                'That would be loud, and the giant would wake. A plan, with quiet jobs for each, works better.',
              ),
            ]),
          ],
          'Reasoned about how a plan helps a frightened group.',
        ),
      ],
    ),
    sc(
      'a06-06-gate',
      [
        N(
          'The giant snores like the sea in a cave. Each breath ruffles the sailors’ beards from across the yard.',
        ),
        YS('Pepper. The cook has pepper. Giants sneeze like anyone.', 'think'),
        N(
          'The cook hands over a whole bag of black pepper without a word, which is how you know how frightened he is.',
        ),
        N(
          'Your Nubbin is the smallest and quietest. It carries the bag up the giant’s arm, across his chest, to his nose.',
        ),
        N('It tips the bag. The giant breathes in.'),
        N(
          'He sneezes so hard he sits bolt upright, his eye streaming. He cannot see a thing for sneezing.',
        ),
        YS('Now! Out! Everybody out!', 'shock'),
      ],
      [
        nt(
          5,
          'science',
          'a sneeze is a reflex that clears the nose',
          '4-LS1-2',
          [
            NV(
              'Nova’s notes: pepper dust tickles tiny nerve-endings in the nose, and the brain sets off a sneeze to blow the dust out.',
            ),
            NV('It’s a reflex, so you can’t decide not to.'),
            NV(
              'Eyes squeeze shut in a sneeze, too. That’s why Sinbad’s plan only needed the giant’s own body to do the work.',
            ),
          ],
          'Learned that a sneeze is a reflex that clears irritating dust from the nose.',
        ),
      ],
      [
        {
          id: 'grab',
          label: 'Grab your Nubbin off the giant’s chin on the way past.',
          then: [
            N(
              'You catch it as the next sneeze comes. It goes off like a thunderclap and blows you both through the gate.',
            ),
          ],
        },
        {
          id: 'last',
          label: 'Wait and go last, after the sailors.',
          then: [
            N(
              'Everyone is out. You go last, with your Nubbin under your arm and pepper in your hair.',
            ),
          ],
        },
      ],
    ),
    sc(
      'a06-06-gate-done',
      [
        N(
          'Behind you the giant sneezes, and sneezes, and sneezes. None of the sneezes are aimed at anybody.',
        ),
        N(
          'A flock of startled gulls rises over the wall, as if somebody had shaken out a tablecloth.',
        ),
      ],
      [
        ak(
          1,
          'sel',
          'solving a problem without hurting anyone',
          RES,
          [
            N(
              'The sailors escaped without hurting the giant. Why is a plan that doesn’t hurt anyone often better than one that does?',
            ),
          ],
          [
            o(
              'Nobody is left angry, afraid or needing revenge.',
              [
                N(
                  'Yes. A plan that harms no one doesn’t make new enemies, and it’s easier to feel good about afterwards.',
                ),
              ],
              true,
            ),
            o('It’s always easier.', [
              N(
                'Not always! Sometimes it takes more cleverness. The pepper plan was clever. It was worth it because no one was hurt.',
              ),
            ]),
          ],
          'Reasoned about why a harmless solution can be better.',
        ),
      ],
    ),
    sc(
      'a06-06-raft',
      [
        N(
          'On the beach the sailors lash driftwood together with anything long: belts, ropes, Sinbad’s spare turban.',
        ),
        YS('Push! Push off!'),
        N(
          'The giant comes down to the shore, still sneezing, and throws rocks after the rafts. He is a poor thrower when he can’t see.',
        ),
        N(
          'The rocks make great white splashes far to the left and far to the right. One lands right behind you and soaks everyone.',
        ),
        N(
          'Then you are past the reef. The giant is only a shape on the shore, rubbing his eye and grumbling at the sea.',
        ),
        YS('Nobody lost. Nobody! Do you know how rarely a story gets to say that?', 'happy'),
      ],
      [
        ak(
          5,
          'science',
          'balanced forces make floating',
          '3-PS2-1',
          [
            N(
              'A loaded raft floats. Water pushes up on it. What force pulls it down, so that the two forces balance?',
            ),
          ],
          [
            o(
              'Gravity.',
              [
                N(
                  'Yes! Gravity pulls the raft down, and the water pushes up. When they are equal, the raft floats.',
                ),
              ],
              true,
            ),
            o('Wind.', [
              N(
                'Wind pushes sideways, not down. Gravity pulls down, and balances the water’s upward push.',
              ),
            ]),
            o('Nothing: floating is just magic.', [
              N(
                'There’s no magic! Gravity pulls down, water pushes up. When they’re equal, the raft stays at the surface.',
              ),
            ]),
          ],
          'Learned that floating means the upward push of water balances gravity.',
        ),
      ],
    ),
    sc(
      'a06-06-complete',
      [
        P('You sneezed a giant.'),
        S('I did not. Your friend’s little one did. I only ran.', 'happy'),
        P('My daughter will like that one.', 'happy'),
        S('That is how I tell it to children. It’s the truest way I know of telling it.', 'soft'),
      ],
      [
        ak(
          3,
          'sel',
          'think: should stories be softened for children?',
          RES,
          [
            N(
              'The old man tells a gentler version to children than to grown-ups. Is that kind, or does it hide the truth? There’s no single right answer.',
            ),
          ],
          [
            o('Kind: children can learn the hard parts when they’re older.', [
              N(
                'A fair answer. Many tellers adjust a story to fit who’s listening, and no one is cheated if the truth comes later.',
              ),
            ]),
            o('Unfair: children should hear the real story.', [
              N(
                'A fair answer. Children often cope better than we expect, and a gentle version can feel like being underestimated.',
              ),
            ]),
            o('It depends on the child and the story.', [
              N(
                'A thoughtful answer. A good teller reads the listener, which is a skill you’ve just practised.',
              ),
            ]),
          ],
          'Thought about telling stories gently to children, with no single right answer.',
        ),
      ],
    ),
  ],
  [
    gloss('lash', 'To tie something firmly with rope or cord.', 'a06-06-raft'),
    gloss('reef', 'A ridge of rock or coral just under the sea’s surface.', 'a06-06-raft'),
    gloss(
      'reflex',
      'A quick action your body does by itself, without your deciding.',
      'a06-06-gate',
    ),
    gloss('volunteers', 'Offers to do something without being told to.', 'a06-06-castle-done'),
  ],
);

// ================================================================== A6-7 The Serpent
const A07: EduQuest = quest(
  'a06-07',
  'The Serpent',
  {
    'a06-07-s1': {
      goal: 'Get up a tree before the serpent reaches you.',
      hint: 'Climb the nearest tall tree, quickly.',
    },
    'a06-07-s2': {
      goal: 'Build a box of planks round yourselves in the tree, and last the night.',
      hint: 'Pull up the raft planks and tie them round the branches.',
    },
    'a06-07-s3': {
      goal: 'Signal the ship on the horizon.',
      hint: 'Wave something long from the top of the tree.',
    },
  },
  [
    sc(
      'a06-07-island',
      [
        N(
          'The rafts wash up on a second island, quiet and green. Everyone is tired enough to cry.',
        ),
        YS('Fruit. Water. Shade. I don’t trust any of it.'),
        N(
          'At dusk a hiss comes out of the long grass, slow and dry, like sand being poured from a sack.',
        ),
        N(
          'Something comes out of the grass that is longer than the ship was, as thick as a tree, and patterned like a carpet.',
        ),
        YS('Up! Up the trees, all of you!', 'shock'),
        N(
          'You climb. Your Nubbin climbs faster, and sits on the branch above you, looking down with enormous eyes.',
        ),
        N('The serpent winds round the foot of the tree, and waits. It has all night.'),
      ],
      [
        nt(
          3,
          'literacy',
          'two similes in one scene',
          'L.4.5',
          [
            NV(
              'Nova’s notes: the hiss is “like sand being poured from a sack,” and the snake is “patterned like a carpet.”',
            ),
            NV('Both are similes that use a familiar thing to help your ears and eyes.'),
            NV(
              'Writers often choose comparisons from everyday life, so the reader can hear and see something they’ve never met.',
            ),
          ],
          'Noticed similes that use everyday comparisons to make an unfamiliar thing vivid.',
        ),
        nt(
          2,
          'science',
          'many snakes are most active at dusk and night',
          '3-LS4-3',
          [
            NV(
              'Nova’s notes: in hot places many snakes hunt at dusk or night, when the ground has cooled, and hide in the heat of the day.',
            ),
            NV(
              'Being active at dusk is a way of surviving a hot habitat. That’s why the hiss comes now, not at noon.',
            ),
          ],
          'Learned that some animals are active at dusk or night as a way to survive in a hot habitat.',
        ),
      ],
      [
        {
          id: 'higher',
          label: 'Climb higher.',
          then: [
            N('The branches thin out. The serpent lifts its head, and finds it can’t quite reach.'),
          ],
        },
        {
          id: 'still',
          label: 'Stay where you are, and keep very still.',
          then: [
            N(
              'Its tongue flickers a hand’s width under your foot. Then the great head sinks away to think.',
            ),
          ],
        },
      ],
    ),
    sc(
      'a06-07-island-done',
      [
        YS('It can climb. Snakes climb. We need something it can’t get through.', 'think'),
        N('Everyone looks at the broken planks from the rafts, still tied to Sinbad’s belt.'),
      ],
      [
        ak(
          1,
          'sel',
          'think: climb higher, or build something?',
          RES,
          [
            N(
              'Two ideas: climb even higher, or build a wall of planks. Climbing is quick but may not be enough. Building takes time but could last. How would you decide?',
            ),
          ],
          [
            o('Do both: climb first, then build.', [
              YS(
                'A fair answer. Often there’s a quick fix and a lasting fix, and you need the first to have time for the second.',
              ),
            ]),
            o('Build: climbing won’t stop a snake that climbs.', [
              YS(
                'A fair answer. Choosing the thing that really answers the problem is sensible, even if it’s harder.',
              ),
            ]),
            o('Climb: it is faster and safe enough for tonight.', [
              YS('A fair answer. It might be enough, though tomorrow you’ll still need a plan.'),
            ]),
          ],
          'Compared two ways to solve a problem and gave reasons.',
        ),
      ],
    ),
    sc(
      'a06-07-box',
      [
        N(
          'Planks from the broken rafts are wedged in the lower branches. Sinbad hauls them up on his belt, one by one.',
        ),
        YS(
          'A box. A box round us, tied tight, with gaps to breathe. Like hens in a crate, only we want to be in it.',
        ),
        N(
          'You tie, and he ties, and your Nubbin holds each knot with both hands until it’s tight.',
        ),
        N(
          'All night the serpent circles the box. It tries the gaps, and rests its great head on the planks to listen.',
        ),
        N('Its breath is cold. It smells of wet stone.'),
        N(
          'Nobody sleeps. Sinbad tells you about Baghdad in a whisper: the round walls, the bridges of boats, his uncle’s indigo.',
        ),
      ],
      [
        dn(
          0,
          'maths',
          'perimeter',
          '3.MD.D.8',
          'edu:measure:box:perimeter',
          [
            YS(
              'Our box is a square, and each plank is two metres long. Add up the four sides: how long is the box round the outside?',
            ),
          ],
          'Found the perimeter of a square (4 × 2 m = 8 m).',
        ),
        nt(
          4,
          'science',
          'a snake smells with its tongue',
          '4-LS1-2',
          [
            NV(
              'Nova’s notes: a snake flicks its tongue to pick up tiny scent particles from the air, then touches them to a special organ in its mouth.',
            ),
            NV('It is “tasting” the air.'),
            NV(
              'Its tongue is forked so it can tell which side a smell is stronger on, and so which way to turn.',
            ),
          ],
          'Learned that a snake uses its tongue to gather smells.',
        ),
      ],
      [
        {
          id: 'home',
          label: 'Ask what he’ll do when he gets home.',
          then: [YS('Never go to sea again.'), YS('I always say that.', 'soft')],
        },
        {
          id: 'hum',
          label: 'Hum a Grove tune to your Nubbin.',
          then: [
            N('It doesn’t belong here, and it helps. Even the serpent goes still for a while.'),
          ],
        },
      ],
    ),
    sc(
      'a06-07-box-done',
      [
        N(
          'At first light the serpent gives up. It pours itself away into the grass, and does not come back.',
        ),
        N('Sinbad lets out a breath he seems to have held since dusk.'),
      ],
      [
        nt(
          1,
          'sel',
          'relief and what it feels like in the body',
          'CASEL: Self-awareness',
          [
            N(
              'Relief is the feeling when a worry suddenly ends. Shoulders drop, the breath comes out, and sometimes your legs go wobbly.',
            ),
            N(
              'Noticing how a feeling shows in your body helps you name it, and naming a feeling helps you handle it.',
            ),
          ],
          'Learned to notice what relief feels like in the body.',
        ),
      ],
    ),
    sc(
      'a06-07-sail',
      [
        N('A sail. A sail on the horizon, coming this way.'),
        N('Sinbad waves his whole turban at it. This takes some time, because it is very long.'),
        CP('Castaways! Up you come, all of you. Mind the paint.'),
        CP(
          'We’ve goods aboard from a merchant we left asleep on an island, a year back. Sinbad, his name was.',
        ),
        YS('You didn’t.', 'happy'),
        CP('We did. We’ve been trying to find his family ever since, to give them the money.'),
        N(
          'Sinbad laughs until he has to sit down on the deck. Your Nubbin sits down too, to keep him company.',
        ),
      ],
      [
        nt(
          6,
          'science',
          'bright signals are easier to see; light travels in straight lines',
          '1-PS4-2',
          [
            NV(
              'Nova’s notes: you see a sail because light bounces off it and travels in a straight line to your eyes.',
            ),
            NV('A long, bright cloth waved against the sky is easy to notice.'),
            NV(
              'Sailors used flags, mirrors and fires for signals because light carries far over water, where there’s nothing to block it.',
            ),
          ],
          'Learned that light travels in straight lines, so bright waved signals can be seen from far away.',
        ),
      ],
    ),
    sc(
      'a06-07-complete',
      [
        S('Third voyage. I came home with more than I left with. And I swore.'),
        P('Never again.'),
        S('Never again.'),
        P('How long did it last?', 'think'),
        S(
          'Long enough to get bored. The fourth is next, and it isn’t a funny one. I’ll tell it carefully.',
          'soft',
        ),
      ],
      [
        ak(
          2,
          'literacy',
          'a repeated line as a running joke',
          'RL.2.4',
          [
            N(
              '“Never again,” says the porter. “Never again,” says the old man. Why does the story keep repeating this line, voyage after voyage?',
            ),
          ],
          [
            o(
              'It’s a running joke: he always swears it, and always sails again.',
              [
                S(
                  'Quite right. A repeated line becomes a joke the listener is in on.',
                ),
              ],
              true,
            ),
            o('Because the writer forgot it was already said.', [
              S(
                'Not forgotten: chosen. Each time it comes back it gets funnier, because we know what happens next.',
              ),
            ]),
          ],
          'Noticed how a repeated line works as a running joke across a story.',
        ),
      ],
    ),
  ],
  [
    gloss('serpent', 'A large snake. The word is often used in old tales.', 'a06-07-island'),
    gloss('castaways', 'People left stranded on a shore after a shipwreck.', 'a06-07-sail'),
    gloss('habitat', 'The natural home of a plant or animal.', 'a06-07-island'),
    gloss('perimeter', 'The distance all the way round the outside of a shape.', 'a06-07-box'),
  ],
);

// ================================================================== A6-8 The Strange Custom
const A08: EduQuest = quest(
  'a06-08',
  'The Strange Custom',
  {
    'a06-08-s1': {
      goal: 'Listen to the fourth voyage from your cushion.',
      hint: 'Stay by the old man while he tells it.',
    },
    'a06-08-s2': {
      goal: 'In the dark cave, find where the fresh air is coming from.',
      hint: 'Stand still. Feel for a draught on your face.',
    },
    'a06-08-s3': {
      goal: 'Follow the little animal through the crack to the sea.',
      hint: 'Go where the striped animal goes, sideways if you must.',
    },
  },
  [
    sc(
      'a06-08-telling',
      [
        S(
          'The fourth voyage I’ll tell from here. You can come in at the end. The beginning you don’t need to see.',
          'soft',
        ),
        N('The lamps are lit. The porter puts down his bread, and listens with his whole face.'),
        S(
          'A storm, and a kingdom on a far shore, rich and kind. Its people rode horses with no saddles.',
        ),
        S(
          'So I made them saddles. The king loved me for it, and he found me a wife, and I loved her.',
          'happy',
        ),
        S(
          'She fell ill in the spring, and she died. I held her hand at the end, and it was gentle.',
          'sad',
        ),
        S(
          'Then they told me a hard rule of theirs. The rule meant I had to go down, alone, into a dark cave.',
          'sad',
        ),
        P('On your own?', 'shock'),
        S('On my own, with water and bread. It was their way, and I was very frightened.'),
      ],
      [
        nt(
          4,
          'sel',
          'grief: someone who has died is gone, and the sadness is love',
          SOC,
          [
            S(
              '“Died” means her body stopped working and could not start again. I’ve found it’s kinder to say the word plainly than to dress it up.',
            ),
            S(
              'The sadness I felt was love with nowhere to go. It doesn’t vanish, but it gets lighter to carry, especially if somebody sits beside you.',
            ),
          ],
          'Heard that death is said plainly and that grief is love; that company makes grief lighter.',
        ),
        ak(
          5,
          'social-studies',
          'think: can a custom be unkind even if everyone follows it?',
          'D2.Civ.8.K-2',
          [
            N(
              'Sinbad’s new home had a rule that everyone followed, and that left him frightened and alone. Can a rule be wrong even if everyone around you accepts it?',
            ),
            N('There’s no single right answer.'),
          ],
          [
            o('Yes: a rule that hurts people can be wrong however many follow it.', [
              S(
                'A fair answer. People have changed unkind customs by asking, “Who does this hurt?” Often a few people had to speak first.',
              ),
            ]),
            o('It depends: customs make sense to the people who made them.', [
              S(
                'A fair answer. It’s good to try to understand why a custom began before deciding about it, though understanding isn’t the same as agreeing.',
              ),
            ]),
            o('I’m not sure, and I want to think more.', [
              S('That’s an honest answer, and a good one. Hard questions deserve time.'),
            ]),
          ],
          'Thought about whether a widely followed rule can still be wrong, with no right answer.',
        ),
      ],
      [
        {
          id: 'hand',
          label: 'Put your hand on his.',
          then: [S('Thank you. It was a long time ago. It is also tonight.', 'soft')],
        },
        {
          id: 'lap',
          label: 'Let your Nubbin climb into his lap.',
          then: [
            N(
              'It sits on his knee and looks up at him. He rests one old hand on its head, and goes on.',
            ),
          ],
        },
      ],
    ),
    sc(
      'a06-08-telling-done',
      [
        S(
          'Come in now. Just for the dark part, and the light after it. You’ll want to have seen the light.',
          'soft',
        ),
        N('The porter wipes his eyes with the back of his hand, and doesn’t pretend otherwise.'),
      ],
      [
        nt(
          1,
          'sel',
          'it is okay to cry, and a friend does not have to fix anything',
          'CASEL: Relationship skills',
          [
            N(
              'The porter is crying, and nobody is embarrassed. Crying is how the body lets out a big feeling.',
            ),
            N(
              'When a friend is sad, we don’t have to fix it. Staying near and listening is often the most helpful thing.',
            ),
          ],
          'Learned that crying is natural and that staying close is a way to help a sad friend.',
        ),
      ],
    ),
    sc(
      'a06-08-dark',
      [
        N('The carpet goes black. It is cold and very quiet, and there is stone under your hands.'),
        N('Far above, a slab of light narrows to a line, and goes out.'),
        YS('Hello. You came. I wasn’t going to ask anyone to.', 'sad'),
        N(
          'He is younger than the old man and older than the sailor on the whale. His voice is very steady, which is how you know.',
        ),
        YS(
          'I’ve been sitting here. Eating a little. Thinking about her. I can’t tell how long it’s been.',
        ),
        N('Your Nubbin lifts its head and turns, slowly, to the left.'),
        N('There is a draught on your face, very faint. It smells, impossibly, of salt.'),
      ],
      [
        ak(
          6,
          'science',
          'moving air shows there is an opening',
          '4-LS1-2',
          [
            N(
              'A faint draught on your face, smelling of salt. What does it tell you about this cave?',
            ),
          ],
          [
            o(
              'There is an opening to the outside, probably towards the sea.',
              [
                N(
                  'Yes! Air only moves through a cave if there is somewhere for it to come in or out. And the salt smell points to the sea.',
                ),
              ],
              true,
            ),
            o('The cave is sealed tight.', [
              N(
                'If it were sealed, the air would be still. Moving air means an opening somewhere.',
              ),
            ]),
            o('Someone is blowing on you.', [
              N(
                'Nobody’s here but Sinbad and you. Moving air in a cave usually comes from an opening to the outside.',
              ),
            ]),
          ],
          'Reasoned that moving air and a salt smell show an opening to the outside.',
        ),
      ],
      [
        {
          id: 'follow',
          label: 'Take Sinbad’s hand and follow the draught.',
          then: [
            N(
              'You walk slowly, with your other hand on the wall. He holds on tight, and doesn’t say so.',
            ),
          ],
        },
        {
          id: 'listen',
          label: 'Stay still and listen first.',
          then: [
            N(
              'Far off, past the cold, something is scratching. Something small, and alive, and not afraid.',
            ),
          ],
        },
      ],
    ),
    sc(
      'a06-08-dark-done',
      [
        N(
          'Something small brushes past your ankle: a little animal with a striped face, going somewhere on purpose.',
        ),
        N('It doesn’t stop to look at you. It has the walk of somebody who knows the way home.'),
      ],
      [
        ak(
          1,
          'literacy',
          'reading a clue in a description',
          'RL.4.3',
          [
            N(
              '“It has the walk of somebody who knows the way home.” What is the writer hinting about the little animal?',
            ),
          ],
          [
            o(
              'It knows a way out of the cave, and uses it often.',
              [
                NV(
                  'Yes. The description is a clue: an animal that knows the way can lead you out. It finds the path by smell and whiskers, not sight.',
                ),
              ],
              true,
            ),
            o('It is lost and frightened.', [
              N(
                'Look again: “on purpose”, and “knows the way home”. Those words describe someone sure of where they’re going.',
              ),
            ]),
          ],
          'Read a description closely for a clue about what will happen next.',
        ),
      ],
    ),
    sc(
      'a06-08-tunnel',
      [
        N(
          'It slips into a crack in the rock. In the dark, Sinbad laughs once, for the first time.',
        ),
        YS('If it lives in here, it gets in and out. If it gets in and out, so can we.'),
        N(
          'The crack is tight, then tighter, and you go sideways. Your Nubbin goes first, and waits for you at every bend.',
        ),
        N(
          'The salt smell grows. Then there is a sound, and it is the sea, and then there is a grey light.',
        ),
        N(
          'You come out on a strip of shingle at the foot of a cliff, with the whole morning in front of you.',
        ),
        YS('Oh. Oh, look at it.', 'soft'),
        N(
          'He sits down on the stones and cries, for her and for the morning, both at once. You sit beside him, and wait.',
        ),
      ],
      [
        ak(
          5,
          'sel',
          'two feelings at once',
          SEL,
          [
            N(
              'Sinbad cries for his wife and for the morning, both at once. Can a person feel sad and glad together?',
            ),
          ],
          [
            o(
              'Yes: feelings can sit side by side.',
              [
                N(
                  'Yes. Relief at being out and sadness for what was lost can both be true in the same minute. Neither cancels the other.',
                ),
              ],
              true,
            ),
            o('No: you can only feel one thing at a time.', [
              N(
                'It can seem that way, but people often feel mixed things, like a happy-sad goodbye. Sinbad shows it.',
              ),
            ]),
          ],
          'Learned that people can feel two different feelings at once.',
        ),
      ],
    ),
    sc(
      'a06-08-tunnel-done',
      [
        N('Some days later a passing ship sees the fire on the shingle, and takes Sinbad home.'),
        N('Sinbad thanks the sailors, and doesn’t say much else for a while.'),
      ],
      [
        nt(
          1,
          'sel',
          'staying near is a way to help someone who is grieving',
          undefined,
          [
            NV(
              'Nova’s notes: after a loss, people are often quiet. They may not want to talk. They may just want someone close by.',
            ),
            NV('You sat beside Sinbad on the shingle and waited. Waiting beside someone is a kind of help.'),
          ],
          'Learned that staying quietly near a grieving person is a way to help.',
        ),
      ],
    ),
    sc(
      'a06-08-complete',
      [
        N('The lamps in the long room. The porter has stopped eating altogether.'),
        P('I’m sorry about your wife.', 'soft'),
        S(
          'Thank you. Nobody has said that to me in forty years. I never told anyone that part properly.',
          'soft',
        ),
        S(
          'That is the truth about this house, porter. It was paid for, and some of it in ways I wouldn’t sell you.',
        ),
        P('I said a foolish thing on your bench.'),
        S(
          'You said a true thing on my bench. It was only half the truth. Come back for the other half.',
        ),
      ],
      [
        nt(
          2,
          'literacy',
          'theme: what looks like luck can hide a cost',
          'RL.4.2',
          [
            NV(
              'Nova’s notes: the old man says his house was “paid for.” In stories, a rich person’s comfort often hides a past cost.',
            ),
            NV('The porter saw only the lamb; he didn’t see the voyages.'),
            NV(
              'Noticing a hidden cost is a way readers work out a theme: here, that what we see of someone’s life is only half the truth.',
            ),
          ],
          'Noticed a theme (what we see of others is half the story) from the old man’s words.',
        ),
      ],
    ),
  ],
  [
    gloss(
      'custom',
      'A rule or way of doing things that a group of people has followed for a long time.',
      'a06-08-telling',
    ),
    gloss('draught', 'A current of cool air moving through a closed space.', 'a06-08-dark'),
    gloss('shingle', 'A beach covered in small, smooth stones.', 'a06-08-tunnel'),
    gloss('grief', 'The deep sadness you feel when someone you love has died.', 'a06-08-telling'),
  ],
);

// ================================================================== A6-9 The Roc’s Revenge
const A09: EduQuest = quest(
  'a06-09',
  'The Roc’s Revenge',
  {
    'a06-09-s1': {
      goal: 'Try to stop the merchants breaking the roc’s egg.',
      hint: 'Get to the white dome before the merchants do.',
    },
    'a06-09-s2': {
      goal: 'Hang on to a plank when the rocs drop their boulders.',
      hint: 'Grab the nearest plank and keep your Nubbin close.',
    },
  },
  [
    sc(
      'a06-09-egg',
      [
        S(
          'The fifth voyage. I had my own ship by then, and I let other merchants sail on it. That was my mistake.',
        ),
        N(
          'Sinbad’s new ship sails away from the sunrise. Nova’s compass needle points north, as always, and the cook trusts it more than the captain.',
        ),
        N('An island, and a white dome. You know at once what it is, and the merchants don’t.'),
        YS('Don’t touch it. I mean it. I have met its mother.'),
        N(
          'The merchants laugh at him, pick up rocks, and start knocking on the shell to see what is inside.',
        ),
        N(
          'The shell cracks. A huge wet chick tumbles out, all legs and fluff, and shrieks at the sky.',
        ),
        YS('You fools. You complete, absolute fools.', 'angry'),
      ],
      [
        ak(
          1,
          'social-studies',
          'direction: reading a compass',
          '4-ESS2-2',
          [
            NV(
              'Nova’s notes: the Sun rises in the east. The ship sails away from it. Which way is the ship going?',
            ),
          ],
          [
            o(
              'West.',
              [
                NV(
                  'Yes. Away from the east is west. A compass needle points north, so west is to the left when you face north.',
                ),
              ],
              true,
            ),
            o('East.', [
              NV('That would be sailing toward the sunrise. The ship sails away from it, so it goes west.'),
            ]),
            o('North.', [
              NV('North is where the needle points. The sunrise is in the east, and away from east is west.'),
            ]),
          ],
          'Used where the Sun rises, and a compass, to work out a direction.',
        ),
        ak(
          5,
          'sel',
          'listening to a warning',
          REL,
          [N('Sinbad warned the merchants, and they laughed. Why might people ignore a warning?')],
          [
            o(
              'They think they know better, or don’t want to be told what to do.',
              [
                N(
                  'Yes. Pride, and not wanting to be told, are common reasons. A warning works best when it comes with respect.',
                ),
              ],
              true,
            ),
            o('They never hear it at all.', [
              N(
                'They did hear it; the story says they laughed. Ignoring a warning is usually a choice.',
              ),
            ]),
          ],
          'Reasoned about why people ignore a warning.',
        ),
      ],
      [
        {
          id: 'chick',
          label: 'Help the chick into the shade of the rocks.',
          then: [
            N(
              'It is as big as a donkey and as soft as a pillow. It lets you push it, complaining, into the shade.',
            ),
            N('Your Nubbin sits beside it. They seem to understand each other perfectly.'),
          ],
        },
        {
          id: 'between',
          label: 'Stand between the merchants and the chick.',
          then: [
            N('The merchants back off, muttering. One of them looks up at the sky, and goes pale.'),
          ],
        },
      ],
    ),
    sc(
      'a06-09-egg-done',
      [
        N('Two shadows cross the island, one after the other, each the size of a field.'),
        N(
          'The chick stops shrieking and begins to chirp, high and delighted. Its parents have come.',
        ),
      ],
      [
        nt(
          1,
          'science',
          'young birds and parents recognise each other by voice',
          '1-LS3-1',
          [
            NV(
              'Nova’s notes: a chick is helpless when it hatches. Many birds need their parents to feed, warm and guard them for weeks, or months.',
            ),
            NV(
              'Nova’s notes: many young birds learn their parents’ calls, and parents learn their chick’s, even in a crowd. Penguin chicks do this among thousands.',
            ),
            NV(
              'Young are like their parents, but not the same: a fluffy chick has the same beak shape and the same call-style, long before it can fly.',
            ),
          ],
          'Learned that young birds need their parents, that parent and young recognise each other by sound, and that young are like but not the same as their parents.',
        ),
      ],
    ),
    sc(
      'a06-09-boulders',
      [
        N(
          'Sinbad gets everyone aboard, and the ship runs before the wind as fast as it has ever gone.',
        ),
        N('High above, the rocs are carrying something in their claws: boulders as big as houses.'),
        YS('Hard over! Hard over, now!', 'shock'),
        N('The first boulder misses by a ship’s length, and sends up a wall of white water.'),
        N('The second doesn’t miss. The deck turns into planks, and the planks turn into sea.'),
        N(
          'You come up with a plank under one arm and your Nubbin under the other. The sky is full of wings.',
        ),
        N(
          'The rocs circle once, and go back down to their chick. They are not cruel: they were only answering.',
        ),
      ],
      [
        ak(
          6,
          'sel',
          'think: was the rocs’ revenge fair?',
          RES,
          [
            N(
              'The rocs punished the whole ship, even people who had tried to stop the merchants. They were protecting their chick. Was that fair?',
            ),
            N('There’s no single right answer.'),
          ],
          [
            o('Understandable, but not fair to the innocent.', [
              N(
                'A fair answer. Fear and anger can make anyone strike at everyone nearby. It’s still worth asking who gets hurt.',
              ),
            ]),
            o('Fair: the ship carried the people who did it.', [
              N(
                'A fair answer. Some people feel that way about a whole group. Others say it’s better to look at what each person did.',
              ),
            ]),
            o('Revenge is rarely fair, but I see why they did it.', [
              N(
                'A thoughtful answer. Understanding why someone acted isn’t the same as saying it was right.',
              ),
            ]),
          ],
          'Reasoned about whether revenge is fair, with no right answer.',
        ),
      ],
      [
        { id: 'shout', label: 'Shout for Sinbad.', then: [YS('Here! Over here! Swim to me!')] },
        {
          id: 'float',
          label: 'Float, and save your breath.',
          then: [
            N('Sinbad’s plank bumps into yours an hour later. Sinbad looks very pleased to see you.'),
          ],
        },
      ],
    ),
    sc(
      'a06-09-boulders-done',
      [
        N(
          'A current takes you both. By evening there is an island under your feet, full of fruit and running water.',
        ),
        N('You have never been so glad of a fig.'),
        N('Sinbad says he counted the waves while you floated: one lifted the plank every six seconds.'),
      ],
      [
        nt(
          2,
          'science',
          'ocean currents carry things',
          '4-ESS2-1',
          [
            NV(
              'Nova’s notes: currents are rivers inside the sea, made by wind, tides and warmth. They carry floating things, from planks to seeds, a very long way.',
            ),
            NV(
              'Coconuts reach faraway islands this way. A coconut can float for months and still grow when it lands.',
            ),
          ],
          'Learned that ocean currents carry floating things, including seeds, over long distances.',
        ),
        dn(
          2,
          'maths',
          'time intervals',
          '3.MD.A.1',
          'edu:time:waves:interval',
          [
            YS(
              'One wave lifted the plank every six seconds. How many waves lifted it in one minute? There are 60 seconds in a minute.',
            ),
          ],
          'Divided 60 seconds by 6 to get 10 waves a minute (6 × 10 = 60).',
        ),
      ],
    ),
    sc(
      'a06-09-complete',
      [
        N(
          'The porter has brought his daughter tonight. She is asleep in the corner on a heap of cushions, holding a fig.',
        ),
        P('They had it coming. The merchants, I mean.'),
        S('They did. So did I, a little. I knew, and I didn’t make them listen.', 'think'),
        P('You told them.'),
        S('Telling isn’t making someone listen. You know that. You carry for scholars.'),
        P('Ha. True.', 'happy'),
      ],
      [
        ak(
          3,
          'literacy',
          'what a character’s words show about him',
          'RL.3.3',
          [
            N(
              'The old man says he is partly to blame, because he “didn’t make them listen.” What do his words show about him?',
            ),
          ],
          [
            o(
              'He is honest about his own part, without taking all the blame.',
              [
                N(
                  'Yes. He names his part and no more: the merchants still chose. Owning your share honestly is a mark of good character.',
                ),
              ],
              true,
            ),
            o('He thinks everything was his fault.', [
              N(
                'Not everything: he says “a little”. The merchants made their own choice. He sees his share, no more and no less.',
              ),
            ]),
            o('He is blaming somebody else.', [
              N(
                'Look again: he points at himself, not at anyone else. That’s what makes it honest.',
              ),
            ]),
          ],
          'Inferred a character’s honesty from how he talks about his own mistake.',
        ),
      ],
    ),
  ],
  [
    gloss('chick', 'A baby bird.', 'a06-09-egg'),
    gloss('shrieks', 'Makes a high, loud, sharp cry.', 'a06-09-egg'),
    gloss('boulders', 'Very large rounded rocks.', 'a06-09-boulders'),
    gloss(
      'current',
      'A steady flow of water or air moving in one direction.',
      'a06-09-boulders-done',
    ),
  ],
);

// ================================================================== A6-10 The Old Man of the Sea
const A10: EduQuest = quest(
  'a06-10',
  'The Old Man of the Sea',
  {
    'a06-10-s1': {
      goal: 'Help the little old man across the stream.',
      hint: 'Go to the stream where the old man is sitting.',
    },
    'a06-10-s2': {
      goal: 'Find a way to make the Old Man of the Sea let go.',
      hint: 'Watch what the old man reaches for. Look for a low branch.',
    },
    'a06-10-s3': {
      goal: 'Get coconuts down from the palms with the gatherers.',
      hint: 'Throw pebbles near the monkeys, never at them.',
    },
  },
  [
    sc(
      'a06-10-bank',
      [
        N(
          'By a stream sits a little old man wrapped in seaweed, with legs as long and limp as kelp.',
        ),
        N(
          'He has a face like a walnut, and he does not speak. He points across the stream, and holds out his arms.',
        ),
        YS('He wants carrying over. Poor old thing. Here, grandfather, up you come.', 'soft'),
        N('Sinbad lifts him on to his shoulders. The old man weighs almost nothing.'),
        N(
          'Then he crosses his long legs round Sinbad’s neck, and squeezes. On the far bank, he does not get down.',
        ),
        YS('All right. Off you get. Grandfather? Off?'),
        N(
          'The old man drums his heels on Sinbad’s chest, and points at a fig tree. Sinbad has become a horse.',
        ),
      ],
      [
        ak(
          4,
          'sel',
          'consent: asking, and hearing “no”',
          'CASEL: Relationship skills',
          [
            N(
              'Sinbad helped, but the old man never asked for more than a ride, and then simply refused to get down.',
            ),
            N('When we want something from another person, what should we do first?'),
          ],
          [
            o(
              'Ask, and listen to the answer, including “no”.',
              [
                N(
                  'Yes. That’s what consent means: a real yes from someone who is free to say no. The old man doesn’t ask, and that’s the trouble.',
                ),
              ],
              true,
            ),
            o('Just do it, if it seems helpful.', [
              N(
                'Even helpful things need a yes first. Sinbad said yes to a ride, not to being ridden for days.',
              ),
            ]),
            o('Wait for them to say no first.', [
              N(
                'Better to ask first. A person shouldn’t have to stop you from doing something unasked.',
              ),
            ]),
          ],
          'Learned that consent means asking first and respecting a no.',
        ),
      ],
      [
        {
          id: 'pull',
          label: 'Try to lift him off.',
          then: [N('His legs tighten. Sinbad goes red in the face, and you stop at once.')],
        },
        {
          id: 'ask',
          label: 'Ask him politely to get down.',
          then: [N('He looks at you with bright black eyes, and points at another fig tree.')],
        },
      ],
    ),
    sc(
      'a06-10-bank-done',
      [
        N(
          'Days pass like this. The old man sleeps on Sinbad’s shoulders, eats on them, and never once gets down.',
        ),
        N(
          'Sinbad’s knees have started to bend in the wrong places, and his smile has gone somewhere else.',
        ),
      ],
      [
        dn(
          1,
          'maths',
          'multiplication: equal groups',
          '3.OA.A.1',
          'edu:multiply:figs:days',
          [
            YS(
              'Grandfather eats six figs a day. If he rides me for seven days, how many figs does he eat? Count them in groups of six.',
            ),
          ],
          'Multiplied 6 × 7 = 42 figs.',
        ),
      ],
    ),
    sc(
      'a06-10-fig',
      [
        YS('I can’t sleep. I can’t lie down. He steers me by the ears.', 'sad'),
        N(
          'Your Nubbin is watching the old man’s hands. They are always reaching: for figs, for grapes, for anything just out of reach.',
        ),
        N(
          'By the stream one fig tree hangs a low branch heavy with the ripest fruit on the island. It is just too high for him.',
        ),
        N(
          'Your Nubbin points at the branch, then at the old man, then at Sinbad’s knees. Then it bends its own.',
        ),
        YS('Under the branch. Then duck.', 'think'),
        YS('Oh, you wicked, wonderful thing.', 'happy'),
      ],
      [
        ak(
          1,
          'literacy',
          'character motive from actions',
          'RL.3.3',
          [
            N(
              'Your Nubbin watches what the old man’s hands do. What does his reaching tell us about what motivates him?',
            ),
          ],
          [
            o(
              'He is greedy for the next thing: he can’t stop wanting more.',
              [
                N(
                  'Yes. His actions show his motive: he never has enough, so he can be tempted by something just out of reach.',
                ),
              ],
              true,
            ),
            o('He is frightened of falling.', [
              N(
                'He might be, but look at his hands: they reach for fruit, not for safety. Greed explains it better.',
              ),
            ]),
          ],
          'Inferred a character’s motive from his actions.',
        ),
      ],
      [
        {
          id: 'steer',
          label: 'Lead Sinbad under the low branch.',
          then: [
            N(
              'The old man reaches up with both arms. Then he leans higher, greedily, and his legs loosen to let him.',
            ),
          ],
        },
        {
          id: 'tickle',
          label: 'Send your Nubbin to tickle his feet first.',
          then: [
            N(
              'The old man squirms and kicks. Then he sees the figs, stretches for them, and his legs loosen to let him.',
            ),
          ],
        },
      ],
    ),
    sc(
      'a06-10-fig-done',
      [
        YS('Now!'),
        N(
          'Sinbad ducks. The old man is left hanging from the branch by both hands, his mouth full of fig, looking very surprised.',
        ),
        N('The old man isn’t hurt. He is simply, for the first time in a week, on his own.'),
      ],
      [
        ak(
          2,
          'sel',
          'think: was the trick fair?',
          RES,
          [
            N(
              'Sinbad tricked the old man, who had refused to get down. Nobody was hurt. Is a trick like this fair? There’s no single right answer.',
            ),
          ],
          [
            o('Fair: he wouldn’t listen, and nobody was harmed.', [
              N(
                'A fair answer. When someone won’t listen and it’s harming you, a harmless trick can be better than a fight.',
              ),
            ]),
            o('Not quite fair: it’s better to be honest.', [
              N(
                'A fair answer. Honesty matters, and a trick can feel like a kind of lying, even when it’s gentle.',
              ),
            ]),
            o('It depends what else Sinbad could have done.', [
              N(
                'A thoughtful answer. If asking and pulling both failed, the trick was perhaps the kindest way left.',
              ),
            ]),
          ],
          'Reasoned about whether a harmless trick is fair, with no right answer.',
        ),
      ],
    ),
    sc(
      'a06-10-coconuts',
      [
        N(
          'Sinbad doesn’t wait to see whether the old man can climb down. He runs, you run, and your Nubbin runs fastest.',
        ),
        N(
          'On the shore you meet sailors from a ship, gathering coconuts. They can’t believe Sinbad got away.',
        ),
        GA('Nobody gets away from him. Nobody. He rides them for years.', 'shock'),
        GA('Come with us. On this island you pick coconuts with pebbles and a bad temper. Watch.'),
        N(
          'The palms are tall and smooth and full of monkeys. The sailors throw pebbles near the monkeys, carefully missing.',
        ),
        N('The monkeys throw coconuts back, with tremendous energy and no aim at all.'),
      ],
      [
        nt(
          5,
          'science',
          'habitats: a palm tree is home and food for many animals',
          '2-LS4-1',
          [
            NV(
              'Nova’s notes: a palm is a whole habitat. Monkeys climb it for coconuts, birds nest in the crown, and insects live in the bark.',
            ),
            NV(
              'Where a habitat has food, water and shelter, animals gather. Take the trees away, and they leave.',
            ),
          ],
          'Learned that a palm tree can be a habitat providing food and shelter to many animals.',
        ),
      ],
      [
        {
          id: 'throw',
          label: 'Throw a pebble.',
          then: [N('A coconut comes back and lands in your arms. You have won something.')],
        },
        {
          id: 'faces',
          label: 'Let your Nubbin pull faces at them instead.',
          then: [
            N('It works even better. It rains coconuts.'),
            GA('We’re keeping that one.', 'happy'),
          ],
        },
      ],
    ),
    sc(
      'a06-10-complete',
      [
        YS('He wasn’t wicked, you know, the old man. He just found a good shoulder and liked it.'),
        YS('I’ve known merchants like that.', 'think'),
        N(
          'Back in the long room, the porter rubs his own shoulders without noticing he’s doing it.',
        ),
        P('I’ve carried men like that. Never put them down, either.'),
        S('You did. You got up off my bench and came in. That’s putting something down.'),
        P('…Hm.', 'soft'),
      ],
      [
        nt(
          4,
          'literacy',
          'a metaphor: carrying as holding on to a worry',
          'L.4.5',
          [
            NV(
              'Nova’s notes: “That’s putting something down” is a metaphor. The porter isn’t carrying a thing; he’s carrying a grievance and an old way of seeing himself.',
            ),
            NV(
              'A metaphor says one thing is another, with no “like” or “as”. “Putting something down” means letting a heavy feeling go.',
            ),
          ],
          'Understood a metaphor in which putting something down means letting go of a heavy feeling.',
        ),
      ],
    ),
  ],
  [
    gloss('kelp', 'A large brown seaweed that grows in long, slippery strands.', 'a06-10-bank'),
    gloss(
      'consent',
      'Saying yes because you really want to, when saying no is allowed too.',
      'a06-10-bank',
    ),
    gloss('greedily', 'In a way that shows you want more and more of something.', 'a06-10-fig'),
    gloss('temper', 'Your mood, especially how quickly you get cross.', 'a06-10-coconuts'),
  ],
);

// ================================================================== A6-11 The River of Jewels
const A11: EduQuest = quest(
  'a06-11',
  'The River of Jewels',
  {
    'a06-11-s1': {
      goal: 'Search the beach of wrecks for a way off the coast.',
      hint: 'Follow the river along the beach.',
    },
    'a06-11-s2': {
      goal: 'Build a raft from the wreckage.',
      hint: 'Gather planks and rope from the wrecks by the cave mouth.',
    },
    'a06-11-s3': {
      goal: 'Ride the raft through the mountain in the dark.',
      hint: 'Lie flat on the raft and hold on.',
    },
  },
  [
    sc(
      'a06-11-coast',
      [
        S('The sixth voyage. I was an old fool by then, and you know it, so you needn’t say so.'),
        P('I wasn’t going to.', 'happy'),
        N(
          'A ship broken on a mountain coast. The beach is heaped with the wreckage of a hundred other ships, all spoiled by the sea.',
        ),
        YS('Everything anybody ever lost is on this beach. And none of it is any use.'),
        S(
          'My shipmates went over the mountain to look for a road. I never learned what became of them. I hope they found one.',
          'soft',
        ),
        N(
          'A river runs down the beach the wrong way. It doesn’t flow into the sea: it flows into a cave in the mountain.',
        ),
        YS('Water goes somewhere. A river always goes somewhere.', 'think'),
      ],
      [
        nt(
          6,
          'science',
          'water flows downhill and carves caves',
          '4-ESS2-1',
          [
            NV(
              'Nova’s notes: rivers flow downhill, and water will use any gap in the rock. Over thousands of years, flowing water wears rock away and carves tunnels and caves.',
            ),
            NV(
              'That slow wearing-away is called erosion. An underground river like this one is real in many limestone mountains.',
            ),
          ],
          'Learned that flowing water can carve tunnels and caves through erosion.',
        ),
      ],
      [
        {
          id: 'mountain',
          label: 'Look up at the mountain road.',
          then: [
            N(
              'It goes up into cloud, steep and bare. Sinbad looks at it for a long time, then back at the river.',
            ),
          ],
        },
        {
          id: 'river',
          label: 'Put your hand in the river.',
          then: [
            N('It is cold and quick, and tugs at your fingers as if it wants you to come along.'),
          ],
        },
      ],
    ),
    sc(
      'a06-11-coast-done',
      [
        YS('A raft, then. If the river goes in, it comes out.'),
        N(
          'He looks at the heaps of broken planks along the beach, and for the first time that day he almost smiles.',
        ),
      ],
      [
        ak(
          1,
          'sel',
          'hope and problem-solving',
          'CASEL: Self-management',
          [
            N(
              'Sinbad was stuck, and then he had an idea, and his mood lifted. Why does having a plan, even a rough one, make us feel better?',
            ),
          ],
          [
            o(
              'It gives us something to do, so we feel less helpless.',
              [
                N(
                  'Yes! Taking one small step turns “nothing can be done” into “here is what I can do”, and that’s calming.',
                ),
              ],
              true,
            ),
            o('It makes the problem disappear.', [
              N(
                'The problem is still there. But a plan changes how we feel about it, and that’s the first step.',
              ),
            ]),
          ],
          'Reasoned about how a plan helps us feel less helpless.',
        ),
      ],
    ),
    sc(
      'a06-11-raft',
      [
        N(
          'Planks from the wrecks, rope from the wrecks, and Sinbad’s knots, which are getting very good.',
        ),
        N(
          'The pebbles in the riverbed are jewels, red and blue and green, as common here as gravel.',
        ),
        YS('Look at them. Nobody would believe me.', 'happy'),
        N('Sinbad fills a sack with them. Of course he does.'),
        N(
          'Your Nubbin picks up one green pebble, looks at it, and puts it back exactly where it was.',
        ),
        YS('You and your friend. Neither of you is any good at being rich.'),
      ],
      [
        ak(
          4,
          'maths',
          'reading a bar graph',
          '2.MD.D.10',
          [
            N('Sinbad counts his sack: 6 red jewels, 4 blue ones and 9 green ones.'),
            N('On a bar graph, which bar is tallest, and how many more green than blue are there?'),
          ],
          [
            o(
              'Green is tallest; 5 more than blue.',
              [N('Yes! 9 green − 4 blue = 5. The tallest bar is the biggest group.')],
              true,
            ),
            o('Red is tallest; 2 more than blue.', [
              N(
                'Red is 6, but green is 9, so green is tallest. And 9 − 4 = 5 more green than blue.',
              ),
            ]),
            o('Blue is tallest; 4 more than green.', [
              N('Blue is the smallest group, 4. Green is the tallest at 9: 9 − 4 = 5.'),
            ]),
          ],
          'Read a bar graph and compared two groups (9 − 4 = 5).',
        ),
        nt(
          2,
          'science',
          'river stones are smooth because water rubs them',
          '4-ESS2-1',
          [
            NV(
              'Nova’s notes: the current tumbles riverbed stones against each other for years, rubbing off their corners. That’s why they’re smooth and round.',
            ),
            NV(
              'Real gems, like rubies and sapphires, are found in river gravels in Sri Lanka, washed down from the hills and polished along the way.',
            ),
          ],
          'Learned that flowing water smooths stones, and that real gems are found in river gravels.',
        ),
      ],
      [
        {
          id: 'help',
          label: 'Help him tie the sack to the raft.',
          then: [YS('Thank you. If we sink, at least we’ll sink impressively.', 'happy')],
        },
        {
          id: 'tease',
          label: 'Ask if he’s ever been good at it.',
          then: [
            YS(
              'No. I’m good at getting rich. Being rich is a different thing altogether.',
              'think',
            ),
          ],
        },
      ],
    ),
    sc(
      'a06-11-dark',
      [
        N(
          'The cave swallows the raft. The light goes, and the roof comes down until it brushes your hair.',
        ),
        N(
          'The river carries you on in the dark, fast and cold. You lie flat, and your Nubbin lies flat on top of you.',
        ),
        YS('Keep your head down. Keep your head down, and think of something nice.'),
        N(
          'Where the rock comes close, it glitters faintly, like a sky with all the wrong stars in it.',
        ),
        N('Hours, or days. Sinbad falls asleep, and so do you.'),
        N('The last thing you hear is the river, laughing to itself about something.'),
      ],
      [
        ak(
          2,
          'sel',
          'think: what is worth having?',
          RES,
          [
            N(
              'Sinbad filled a sack with jewels; your Nubbin put one back. If you could keep only one thing from this whole voyage, what would be worth having?',
            ),
            N('There’s no right answer.'),
          ],
          [
            o('The story itself: the memory is mine for free.', [
              YS(
                'A fair answer. Nobody can take a memory, and it weighs less than a sack of stones.',
              ),
            ]),
            o('Something small, that reminds me of a friend.', [
              YS(
                'A fair answer. The porter would agree: a lentil-sized stone from a friend is worth more than a sackful.',
              ),
            ]),
            o('Jewels: they could help a lot of people.', [
              YS(
                'A fair answer. Wealth can do good, if it’s shared. It depends what we do with it.',
              ),
            ]),
          ],
          'Reflected on what is worth having, with no right answer.',
        ),
      ],
      [
        {
          id: 'grove',
          label: 'Think of the Grove.',
          then: [
            N(
              'You think of the pond, the fruit trees, and the cottage step warm in the sun. It helps more than you expect.',
            ),
          ],
        },
        {
          id: 'porter',
          label: 'Think of the porter, waiting on his cushion.',
          then: [N('You can almost hear him, far off: “Go on, then. I’ll mind the dates.”')],
        },
      ],
    ),
    sc(
      'a06-11-complete',
      [
        N(
          'You wake to sunshine and voices. The raft is tied to a bank among green fields, and people are looking down at you.',
        ),
        P('Where? Where did it come out?'),
        S('Serendib. The great island at the foot of India. But that’s a story of its own.'),
        P('You can’t stop there!', 'angry'),
        S('I’m old. I can stop where I like.', 'happy'),
        P('Never again?'),
        S('…I am considering it.', 'think'),
        P('That’s a no.'),
      ],
      [
        nt(
          2,
          'social-studies',
          'Serendib is Sri Lanka, an island south of India',
          '2-ESS2-2',
          [
            NV(
              'Nova’s notes: Serendib is an old Arabic name for the island we now call Sri Lanka, just off the southern tip of India.',
            ),
            NV(
              'Ships from Basra sailed down the Gulf, out past Oman, across the Arabian Sea to India’s coast, and south to the island.',
            ),
            NV('It was a famous stop for gems and spices.'),
          ],
          'Learned that Serendib is Sri Lanka and located it relative to India and Arabia.',
        ),
      ],
    ),
  ],
  [
    gloss(
      'wreckage',
      'The broken pieces left after a ship or building is destroyed.',
      'a06-11-coast',
    ),
    gloss(
      'erosion',
      'The slow wearing-away of rock or soil by water, wind or ice.',
      'a06-11-coast',
    ),
    gloss('gravel', 'Small stones, often found in river beds.', 'a06-11-raft'),
    gloss('glitters', 'Shines with small, quick flashes of light.', 'a06-11-dark'),
  ],
);

// ================================================================== A6-12 Serendib
const A12: EduQuest = quest(
  'a06-12',
  'Serendib',
  {
    'a06-12-s1': {
      goal: 'Go with the farmers to see their king.',
      hint: 'Walk with the farmer through the fields to the palace.',
    },
    'a06-12-s2': {
      goal: 'Tell the King of Serendib about Baghdad.',
      hint: 'Sit with Sinbad before the king.',
    },
    'a06-12-s3': {
      goal: 'Climb the great mountain with the pilgrims before you sail.',
      hint: 'Join the pilgrims on the steps at night.',
    },
  },
  [
    sc(
      'a06-12-bank',
      [
        FA('You came out of the mountain. Nobody comes out of the mountain.', 'shock'),
        YS('I didn’t mean to. I’m from Baghdad.'),
        FA(
          'Baghdad! The Caliph’s city. Come, then. Our king will want to hear this himself.',
          'happy',
        ),
        N('Terraces of rice step down the hills, bright green, with water shining in every one.'),
        N('Along the paths stand trees whose bark smells of cinnamon when you rub it.'),
        N(
          'Your Nubbin rubs every tree it passes, and arrives at the palace smelling like a pudding.',
        ),
      ],
      [
        nt(
          4,
          'science',
          'cinnamon is the inner bark of a tree native to Sri Lanka',
          '2-LS2-1',
          [
            NV(
              'Nova’s notes: cinnamon comes from the inner bark of a tree that grows wild in Sri Lanka. The bark is peeled, dried, and curls into the sticks you know.',
            ),
            NV(
              'The tree needs warmth and plenty of rain. Sri Lanka has both, which is why it was famous for cinnamon for a very long time.',
            ),
          ],
          'Learned that cinnamon comes from the inner bark of a tree native to Sri Lanka.',
        ),
        ak(
          5,
          'maths',
          'unit fractions',
          '3.NF.A.1',
          [
            FA(
              'We fill four terrace pools from one stream, the same amount in each. What fraction of the water does each pool get?',
            ),
          ],
          [
            o(
              'One quarter (1/4).',
              [FA('Yes! Four equal parts, so each pool gets 1 of the 4: one quarter.')],
              true,
            ),
            o('One half (1/2).', [
              FA('Half would be for two pools. With four sharing, each gets one quarter, 1/4.'),
            ]),
            o('All of it (4/4).', [
              FA('4/4 would be all of the water. One pool gets just one part of the four: 1/4.'),
            ]),
          ],
          'Found a unit fraction (1/4) for four equal shares.',
        ),
      ],
      [
        {
          id: 'cinnamon',
          label: 'Ask the farmer about the trees.',
          then: [
            FA(
              'Cinnamon. Your merchants buy it from us, and sell it in Baghdad for ten times the price.',
              'happy',
            ),
          ],
        },
        {
          id: 'rice',
          label: 'Ask about the water in the terraces.',
          then: [
            FA(
              'It comes down from the hills, field to field. Each farmer passes it on to the next. That’s the rule.',
            ),
          ],
        },
      ],
    ),
    sc(
      'a06-12-bank-done',
      [
        N(
          'The palace is cool and open, full of birds. The king is already waiting, curious as a boy.',
        ),
        N('Nobody has told him to be solemn. He is leaning forward, with his chin on his fist.'),
      ],
      [
        nt(
          1,
          'literacy',
          'a simile for a character',
          'L.4.5',
          [
            NV(
              'Nova’s notes: “Curious as a boy.” A simile that shows the king’s character in a few words: eager, open, not hiding his interest.',
            ),
            NV(
              'A few well-chosen words can show who a person is, and a whole room can be seen through them.',
            ),
          ],
          'Noticed how a simile quickly shows a character’s nature.',
        ),
      ],
    ),
    sc(
      'a06-12-court',
      [
        KS('Welcome. Sit. They tell me you came by our river, through the mountain?'),
        YS('I did, majesty. Not on purpose.'),
        KS(
          'Then you came by a road nobody has used. Tell me about your Caliph. Is he a just man?',
          'think',
        ),
        YS(
          'I’ve never met him. They say he walks the city at night in plain clothes, to see how his people live.',
        ),
        KS('A king who goes to look for himself. Good. Then I will write to him.', 'happy'),
        KS(
          'When a ship sails for Basra, you will carry my letter, and my gifts. You will be my messenger.',
        ),
      ],
      [
        ak(
          3,
          'sel',
          'why a leader should see for themselves',
          'CASEL: Social awareness',
          [
            N(
              'The king likes that the Caliph walks the city to see for himself. Why might that make someone a better leader?',
            ),
          ],
          [
            o(
              'They learn what people’s lives are really like.',
              [
                N(
                  'Yes. You can’t understand someone’s life from a palace window. Seeing for yourself builds empathy.',
                ),
              ],
              true,
            ),
            o('It shows off.', [
              N(
                'Maybe, but the king is impressed that he does it quietly, in plain clothes. That suggests he really wants to learn.',
              ),
            ]),
          ],
          'Reasoned about why leaders learn by seeing people’s lives for themselves.',
        ),
      ],
      [
        {
          id: 'honour',
          label: 'Nudge Sinbad to accept.',
          then: [
            YS('It would be an honour, majesty.'),
            N('Sinbad says it beautifully. Then he whispers to you, “What have I done?”'),
          ],
        },
        {
          id: 'nubbin',
          label: 'Let your Nubbin bow to the king.',
          then: [
            N(
              'It bows so low it rolls over. The king laughs out loud, and the whole court is allowed to laugh too.',
            ),
          ],
        },
      ],
    ),
    sc(
      'a06-12-peak',
      [
        N(
          'Before the ship sails, Sinbad climbs the island’s great mountain with the pilgrims, all night, to see the sun rise.',
        ),
        N('At the top there is a footprint in the rock, far bigger than any foot.'),
        FA(
          'Some say it’s Adam’s, the first man. Some say the Buddha’s. Some say Shiva’s, and some say Saint Thomas’s.',
        ),
        FA('We all climb the same steps. It’s a good mountain for that.', 'soft'),
        N(
          'The sun comes up red over the sea. Everyone on the summit goes quiet at once, whoever they came for.',
        ),
        N(
          'Your Nubbin sits on your foot, very still, the way it does for the first frost in the Grove.',
        ),
      ],
      [
        ak(
          3,
          'social-studies',
          'different beliefs can share a place with respect',
          'D2.Civ.8.K-2',
          [
            N(
              'People of different faiths climb the same steps to the same summit, each honouring it in their own way. What makes that possible?',
            ),
          ],
          [
            o(
              'Respect: each person lets the others honour it their way.',
              [
                FA(
                  'Yes. Sharing a place doesn’t need everyone to agree. It needs everyone to be respectful.',
                ),
              ],
              true,
            ),
            o('They all believe the same thing.', [
              FA(
                'They don’t! The farmer lists four different beliefs. What they share is respect for each other.',
              ),
            ]),
          ],
          'Learned that people of different beliefs can share a special place through mutual respect.',
        ),
      ],
    ),
    sc(
      'a06-12-complete',
      [
        N('The king gives Sinbad a letter, and gifts for the Caliph, and a ship home.'),
        P('A king who writes to another king, because a sailor washed up in his river.'),
        S('That’s how most friendships between countries start, I think. Somebody washes up.'),
        P('Did you swear again?', 'happy'),
        S('I did. That one very nearly took.', 'happy'),
      ],
      [
        ak(
          1,
          'sel',
          'think: should a king trust a stranger?',
          RES,
          [
            N(
              'A sailor washed up in the king’s river, and the king trusted him with a letter. Is it wise to trust a stranger? There’s no single right answer.',
            ),
          ],
          [
            o('Yes, if they’ve shown good character.', [
              S('A fair answer. Sinbad showed honesty and courage, and a good king notices that.'),
            ]),
            o('Not at first: trust should be earned slowly.', [
              S(
                'A fair answer. The king tested Sinbad with questions before he trusted him with the letter.',
              ),
            ]),
            o('It depends how much is at stake.', [
              S(
                'A thoughtful answer. A small favour needs little trust, and a royal letter needs a lot.',
              ),
            ]),
          ],
          'Reflected on trusting a stranger, with no right answer.',
        ),
        nt(
          2,
          'social-studies',
          'trade and letters connected countries',
          'D2.His.2.K-2',
          [
            NV(
              'Nova’s notes: kingdoms around the Indian Ocean traded gems, spices, cloth and ideas, and wrote letters and sent envoys to each other.',
            ),
            NV(
              'Friendships between countries often started this way: with one traveller, one letter, and a reason to keep writing.',
            ),
          ],
          'Learned that trade and letters connected kingdoms around the Indian Ocean.',
        ),
      ],
    ),
  ],
  [
    gloss(
      'terrace',
      'A flat strip of land cut into a hillside like a step, used for farming.',
      'a06-12-bank',
    ),
    gloss('pilgrim', 'A person who makes a special journey for religious reasons.', 'a06-12-peak'),
    gloss('summit', 'The very top of a mountain.', 'a06-12-peak'),
    gloss(
      'messenger',
      'A person who carries a message or letter from one place to another.',
      'a06-12-court',
    ),
  ],
);

// ================================================================== A6-13 The Caliph’s Gift
const A13: EduQuest = quest(
  'a06-13',
  'The Caliph’s Gift',
  {
    'a06-13-s1': {
      goal: 'Go with Sinbad to the Caliph’s court with the King of Serendib’s letter.',
      hint: 'Enter the palace of the Green Dome and wait to be called.',
    },
    'a06-13-s2': {
      goal: 'Sail with the monsoon and deliver the Caliph’s letter to Serendib.',
      hint: 'Board at Basra when the wind turns, and carry the letter to the king.',
    },
  },
  [
    sc(
      'a06-13-palace',
      [
        N(
          'Sinbad comes home through the Basra Gate of the round city, and goes straight to the palace of the Green Dome.',
        ),
        N(
          'The court is crowded with petitioners, scholars and inky clerks. One man selling figs has got in by mistake.',
        ),
        CA('Peace be upon you. You are the man who came out of a mountain?'),
        YS('And upon you, peace, Commander of the Faithful. Through a mountain, rather.'),
        CA('And the King of Serendib has written to me. Read it to us, please.', 'think'),
        TR(
          'He writes that he has heard of your justice. He sends a cup cut from a single ruby, and asks to be your friend.',
        ),
        TR(
          'It is written in Arabic, majesty, and very good Arabic. Somebody in Serendib has been reading our books.',
        ),
        CA('Then he shall have more of them, and an answer. Sinbad, you will carry it.', 'happy'),
        YS('Majesty, I have sworn never to go to sea again.'),
        CA('Then swear again afterwards. You seem to be good at it.'),
      ],
      [
        nt(
          6,
          'literacy',
          'translation carries ideas between languages',
          'L.3.4',
          [
            TR(
              'Scholars here read Greek, Persian, Syriac and Sanskrit, and write it all out again in Arabic. Whole sciences have crossed that way.',
            ),
            TR(
              'The numbers you use for counting came to us from India, and from Arabic they went on to Europe. Ideas travel by translation.',
            ),
          ],
          'Learned that translators carried books and ideas, including numbers, between languages and cultures.',
        ),
        ak(
          9,
          'sel',
          'kind teasing and unkind teasing',
          'CASEL: Relationship skills',
          [
            N(
              '“Then swear again afterwards. You seem to be good at it.” The Caliph is teasing Sinbad. Is it kind teasing or unkind teasing?',
            ),
          ],
          [
            o(
              'Kind: Sinbad can laugh too, and nobody is made small.',
              [
                N(
                  'Yes. Kind teasing is a shared joke that the other person enjoys. If they stop laughing, it’s time to stop.',
                ),
              ],
              true,
            ),
            o('Unkind: he is making fun of Sinbad.', [
              N(
                'It can feel close. But he is smiling and trusting Sinbad with a gift. Teasing is kind when both people enjoy it.',
              ),
            ]),
          ],
          'Told kind teasing from unkind teasing, and when to stop.',
        ),
      ],
      [
        {
          id: 'translator',
          label: 'Ask the translator which languages they read at the House of Wisdom.',
          then: [
            TR('Greek, Persian, Syriac, Sanskrit. A little Chinese, badly.', 'happy'),
            TR(
              'If a book exists anywhere, somebody in this city is putting it into Arabic. Or wants to.',
            ),
          ],
        },
        {
          id: 'cup',
          label: 'Let your Nubbin look into the ruby cup.',
          then: [
            N('It sees its own face in the cup, small and red, and is delighted.'),
            CA('I see the gift has found its true admirer.', 'happy'),
          ],
        },
      ],
    ),
    sc(
      'a06-13-palace-done',
      [
        N('The Caliph sends books with the letter, and fine cloth, and a saddle worked in silver.'),
        N('Sinbad looks at the saddle for a long moment, and says nothing at all.'),
      ],
      [
        ak(
          1,
          'literacy',
          'inference from a silent reaction',
          'RL.2.3',
          [N('Sinbad stares at the silver saddle and says nothing. What might he be remembering?')],
          [
            o(
              'The saddles he made for the kingdom where his wife lived.',
              [
                N(
                  'Yes. That’s the link: in the fourth voyage he made saddles for the horses, and loved a wife there. A silent look can hold a lot of memory.',
                ),
              ],
              true,
            ),
            o('He is wondering how much it costs.', [
              N(
                'Possible, but a merchant would say so. His silence suggests something deeper: a memory of the saddles from the fourth voyage.',
              ),
            ]),
          ],
          'Inferred a character’s memory from a silent reaction.',
        ),
      ],
    ),
    sc(
      'a06-13-monsoon',
      [
        N(
          'Basra, in the season of the winds. Dhows crowd the quay, every one of them waiting for the same thing.',
        ),
        CP(
          'Half the year the wind blows from the south-west, and half the year from the north-east.',
        ),
        CP(
          'We go out on one, and come home on the other. Miss it, and you wait a year. So nobody misses it.',
        ),
        YS('Six voyages, and I never once asked why we left when we did.', 'think'),
        CP('That’s because you’re a merchant. You only ask what things cost.', 'happy'),
        N(
          'The wind turns in the night. In the morning every sail in Basra fills at once, like a flock lifting.',
        ),
        N(
          'Weeks of blue. Then green hills, and terraces of rice, and a king waiting on the shore.',
        ),
        KS('Books! He sent books!', 'happy'),
      ],
      [
        nt(
          2,
          'science',
          'monsoon winds reverse with the seasons because land and sea heat differently',
          '3-ESS2-1',
          [
            NV('Nova’s notes: in summer, land heats up faster than sea.'),
            NV(
              'Warm air rises over land, and cooler air rushes in from the sea to replace it: a wet wind from the south-west.',
            ),
            NV(
              'In winter the land cools faster than the sea, so the wind reverses and blows from the north-east. This yearly flip is called the monsoon.',
            ),
          ],
          'Learned that monsoon winds reverse with the seasons because land and sea heat and cool at different rates.',
        ),
        dn(
          6,
          'maths',
          'distance, speed and time',
          '4.MD.A.2',
          'edu:calculate:voyage:days',
          [
            CP(
              'From Basra to Serendib is about five thousand kilometres by sea. On a good day, a dhow sails a hundred kilometres. How many days is that?',
            ),
          ],
          'Divided 5,000 km by 100 km/day to get 50 days.',
        ),
      ],
    ),
    sc(
      'a06-13-monsoon-done',
      [
        KS('Go home safely, messenger. Tell your Caliph I am reading.'),
        N('The king stands on the quay with an armful of books until the ship is a speck.'),
      ],
      [
        ak(
          1,
          'literacy',
          'reading between the lines of a short message',
          'RL.3.3',
          [
            N(
              '“Tell your Caliph I am reading.” It’s only five words. What else is the king saying to the Caliph?',
            ),
          ],
          [
            o(
              'Thank you for the books, and I want to stay friends.',
              [
                N(
                  'Yes. A short message can carry a lot: thanks, pleasure, and an invitation to keep writing.',
                ),
              ],
              true,
            ),
            o('Please stop sending me books.', [
              N(
                'He is hugging an armful of them on the quay! “I am reading” is a thank-you, and a wish to keep the friendship going.',
              ),
            ]),
          ],
          'Inferred the fuller meaning of a short message.',
        ),
      ],
    ),
    sc(
      'a06-13-complete',
      [
        N(
          'On the way home, pirates take the ship and sell everyone aboard in the market of a far town. Sinbad is bought by a merchant who deals in ivory.',
        ),
        P('After all that? After the letter?', 'shock'),
        S('After all that. The sea never once asked me whether I deserved it.', 'soft'),
        S('The last part I want you both to see. There is a choice in it, and it isn’t mine.'),
      ],
      [
        nt(
          0,
          'social-studies',
          'slavery was real, and it was unjust',
          'D2.Civ.8.K-2',
          [
            NV(
              'Nova’s notes: to be bought and sold means being treated as property, forced to work and not allowed to leave. That is called slavery.',
            ),
            NV(
              'It happened in many places and times in history. It was cruel and wrong, and it is against the law in every country today.',
            ),
          ],
          'Learned plainly that slavery was real in history, was unjust, and is illegal today.',
        ),
        ak(
          3,
          'sel',
          'think: do people get what they deserve?',
          RES,
          [
            N(
              'The old man says the sea never asked whether he deserved it. Do good and bad things happen to people because of what they deserve?',
            ),
            N('There’s no single right answer.'),
          ],
          [
            o('No: luck and other people’s choices play a big part.', [
              S(
                'A fair answer. Many wise people have said the same. Which is why we try to help one another when bad luck falls.',
              ),
            ]),
            o('Partly: our choices matter, but not for everything.', [
              S(
                'A fair answer. Choices can steer a voyage, but they can’t stop every storm, or every pirate.',
              ),
            ]),
            o('Yes: in the end, people get what they deserve.', [
              S(
                'A fair answer, and a hopeful one. It’s a belief many hold, though the tale suggests the sea doesn’t always agree.',
              ),
            ]),
          ],
          'Reasoned about whether people get what they deserve, with no right answer.',
        ),
      ],
    ),
  ],
  [
    gloss(
      'petitioners',
      'People who come to a ruler or court to ask for something.',
      'a06-13-palace',
    ),
    gloss(
      'monsoon',
      'A wind that blows from one direction for part of the year and the opposite for the rest, often bringing heavy rain.',
      'a06-13-monsoon',
    ),
    gloss(
      'translator',
      'A person who turns writing or speech from one language into another.',
      'a06-13-palace',
    ),
    gloss(
      'slavery',
      'A system where one person is owned by another and forced to work without freedom.',
      'a06-13-complete',
    ),
  ],
);

// ================================================================== A6-14 The Elephant Hunter
const A14: EduQuest = quest(
  'a06-14',
  'The Elephant Hunter',
  {
    'a06-14-s1': {
      goal: 'Sit in the tree by the elephants’ path with Sinbad.',
      hint: 'Climb up beside Sinbad before dawn, and watch the path.',
    },
    'a06-14-s2': {
      goal: 'Go where the herd takes you.',
      hint: 'Hold on to Sinbad, and let the elephants lead.',
    },
    'a06-14-s3': {
      goal: 'The master is at his gate. Decide what to tell him.',
      hint: 'Talk to the master at the gate.',
    },
  },
  [
    sc(
      'a06-14-tree',
      [
        MA('You’re the one who talks to kings? Good. Can you shoot?'),
        YS('Badly.'),
        MA(
          'It doesn’t matter. Sit in the tree by the elephants’ path. When they pass, shoot. I need ivory.',
        ),
        N(
          'Every morning Sinbad sits in the tree with the bow. You sit beside him, and your Nubbin sits on the branch above.',
        ),
        N(
          'Every morning the herd comes past in the half-light, slow and huge, led by an old cow with one tusk broken short.',
        ),
        N('Every morning Sinbad’s arrows land in the mud, a long way from any elephant.'),
        YS('I’m the worst archer in the world. On purpose. Don’t tell him.'),
      ],
      [
        nt(
          4,
          'science',
          'elephant herds are families led by the oldest female',
          '3-LS2-1',
          [
            NV(
              'Nova’s notes: an elephant herd is a family of mothers, aunts, sisters and calves, led by the oldest female, the matriarch.',
            ),
            NV('She remembers where the water is, and the way home.'),
            NV(
              'Staying together helps them survive: more eyes to spot danger, and many adults to protect each calf.',
            ),
          ],
          'Learned that an elephant herd is a family led by the oldest female, and that group living helps survival.',
        ),
        ak(
          6,
          'maths',
          'two-step word problem',
          '3.OA.D.8',
          [
            N(
              'Sinbad “misses” with three arrows every morning. How many arrows is that in a week of seven mornings, and then in six weeks?',
            ),
          ],
          [
            o(
              '21 a week; 126 in six weeks.',
              [
                N(
                  'Yes! 3 × 7 = 21 a week, and 21 × 6 = 126. No wonder the master keeps buying more.',
                ),
              ],
              true,
            ),
            o('21 a week; 27 in six weeks.', [
              N('Right for a week: 21. But six weeks is 21 × 6, not 21 + 6: that’s 126.'),
            ]),
            o('10 a week; 60 in six weeks.', [
              N(
                'That adds 3 + 7. Three arrows each morning for seven mornings is 3 × 7 = 21, and six weeks is 21 × 6 = 126.',
              ),
            ]),
          ],
          'Solved a two-step multiplication problem (3 × 7 = 21; 21 × 6 = 126).',
        ),
      ],
      [
        {
          id: 'promise',
          label: 'Promise not to tell.',
          then: [YS('Thank you. He isn’t a bad man. He’s just a man with a warehouse.', 'soft')],
        },
        {
          id: 'calves',
          label: 'Count the calves in the herd.',
          then: [
            N(
              'Four calves, walking under their mothers like boats in a harbour. One stops to look up at you, and is hurried on.',
            ),
          ],
        },
      ],
    ),
    sc(
      'a06-14-tree-done',
      [
        N('Weeks of mud and missed arrows. The master grumbles, and buys more arrows.'),
        N('Sinbad starts to look forward to the dawn: he has begun to know the herd by sight.'),
      ],
      [
        ak(
          1,
          'sel',
          'doing the right thing quietly',
          RES,
          [
            N(
              'Sinbad is secretly missing on purpose, and not telling his master. Is it right to secretly disobey an order you believe is wrong?',
            ),
          ],
          [
            o('It’s hard: but protecting a living thing can matter more than the order.', [
              N(
                'A fair answer. Many people have faced that choice. Honesty and kindness can pull in different directions.',
              ),
            ]),
            o('No: he should tell the master the truth.', [
              N(
                'That’s a fair view too. Honesty matters, and Sinbad could have spoken openly. Notice that he is choosing not to harm, which is a good aim.',
              ),
            ]),
          ],
          'Weighed obedience against protecting a living thing, honouring the child’s reasoning.',
        ),
      ],
    ),
    sc(
      'a06-14-herd',
      [
        N(
          'One morning the herd doesn’t pass. It stops, and gathers round the tree, and is very quiet.',
        ),
        N(
          'The old cow wraps her trunk round the tree and pulls it over slowly, the way you would pull a weed you were fond of.',
        ),
        N(
          'Sinbad falls. She catches him in her trunk, sets him on her back, and the herd turns off the path.',
        ),
        YS('Don’t let go of me! Come with me!', 'shock'),
        N('She lets you climb up behind Sinbad. She doesn’t seem to mind your Nubbin at all.'),
        N('They walk all day, up into the hills, to a valley whose floor is white.'),
        N(
          'It is a valley of old bones and old tusks. This is where the elephants come when they are very old, to lie down.',
        ),
        N(
          'The cow sets you down, unhurt. The herd stands round you in a ring, looking, and then they turn and go.',
        ),
        YS('They brought me here. They’re saying: here, take these, and leave us alone.', 'soft'),
      ],
      [
        nt(
          6,
          'science',
          'real elephants investigate the bones of their dead, and remember',
          '4-LS1-2',
          [
            NV(
              'Nova’s notes: real elephants have no secret graveyard, but they do stop at the bones of elephants that have died, touching them gently.',
            ),
            NV(
              'Elephants have large brains and long memories. The old female may remember a waterhole, or a path, from many years ago.',
            ),
          ],
          'Learned that real elephants investigate the bones of dead elephants, and that they have long memories.',
        ),
      ],
    ),
    sc(
      'a06-14-herd-done',
      [
        YS(
          'Go on ahead to the town. I’ve twisted my ankle, and I’ll be slow. He’ll ask you first.',
        ),
        YS(
          'You decide what he’s told. I’ve done all the deciding for elephants I ever want to do.',
        ),
      ],
      [
        nt(
          0,
          'health',
          'looking after a sprained ankle',
          undefined,
          [
            NV(
              'Nova’s notes: a twisted ankle is usually a sprain, a stretched band inside the joint. It swells and aches, but it heals.',
            ),
            NV(
              'Rest it, keep your weight off it, and hold something cool on it. If it’s very bad, a grown-up should get it checked.',
            ),
          ],
          'Learned simple first aid for a sprained ankle: rest, keep weight off it, cool it, and get it checked.',
        ),
      ],
    ),
    sc(
      'a06-14-gate',
      [
        N('The master meets you at his gate, and he is worried, and not only about his ivory.'),
        MA(
          'The tree’s down. The path’s churned up. I thought the beasts had trampled him.',
          'shock',
        ),
        MA('Where is he? Where did Sinbad go?'),
        N('Behind you, far off on the hill road, the herd is walking home in a long grey line.'),
        N('The master follows your eyes to the hills, and back again.'),
        N('Your Nubbin looks at the herd, then at the master, then at you. It waits.'),
      ],
      [
        ak(
          5,
          'sel',
          'think: a promise, or a secret?',
          RES,
          [
            N(
              'You could tell the master, if he promises to take only old tusks and never hunt. Or you could keep the herd’s secret.',
            ),
            N(
              'Which is wiser: trusting a promise, or protecting a secret? There’s no single right answer.',
            ),
          ],
          [
            o('Trust his promise: he is worried, and might keep his word.', [
              N(
                'A fair answer. Giving someone a chance to be trusted can bring out their best, though it’s a risk.',
              ),
            ]),
            o('Keep the secret: the elephants can’t speak for themselves.', [
              N(
                'A fair answer. Protecting someone who has no voice is a serious reason. Notice it costs Sinbad a season.',
              ),
            ]),
            o('Hard to know: both could go wrong.', [
              N(
                'An honest answer. Sometimes there’s no perfectly safe option, only a best guess made with care.',
              ),
            ]),
          ],
          'Weighed trusting a promise against keeping a secret, with no right answer.',
        ),
      ],
      [
        {
          id: 'tell',
          label: 'Tell him, once he swears to take only the old tusks and never hunt again.',
          set: { 'a06-ivory': 'told' },
          then: [
            Y('There’s a valley. They took him there. Before I show you, swear something.'),
            MA('Swear what?', 'think'),
            Y('Only what’s already lying there. And no more hunting. Not ever.'),
            MA('…I swear it. On my children.', 'soft'),
          ],
        },
        {
          id: 'keep',
          label: 'Keep the elephants’ secret.',
          set: { 'a06-ivory': 'kept' },
          then: [
            Y('I don’t know where he went.'),
            MA('You don’t know? Or you won’t say?', 'think'),
            N('You say nothing. Beside you, your Nubbin says nothing very loudly.'),
            MA('…He’ll come back. Where else would he go?'),
          ],
        },
      ],
    ),
    sc(
      'a06-14-gate-done',
      [
        N(
          'That evening Sinbad limps in through the gate. He looks at you and at the master, and understands everything without a word.',
        ),
        N('He puts a hand on your shoulder, once, and goes in to supper.'),
      ],
      [
        nt(
          1,
          'literacy',
          'body language shows feeling',
          'RL.1.4',
          [
            NV(
              'Nova’s notes: Sinbad says nothing, but a hand on the shoulder tells you he is grateful. Writers use gestures, not only words, to show feelings.',
            ),
            NV(
              'Next time you read, look for what a character does with their hands, face and feet. It often says more than their words.',
            ),
          ],
          'Noticed that gestures can show feelings without words.',
        ),
      ],
    ),
    sc(
      'a06-14-complete',
      [
        N(
          'The master takes his carts to the valley, and loads them with the tusks the herd let fall when they died old.',
        ),
        N(
          'On the road back, the herd passes the carts. They don’t stop, and the master bows his head to them until they’re gone.',
        ),
        MA('You’ve made me rich, Sinbad. You’re free. Go home, and take your share.'),
        YS('The elephants bought my freedom with their old tusks. I didn’t earn it. I mean to remember that.', 'soft'),
        MA('Nobody in this town will hunt them again. There’s no need now, and I’ve sworn.'),
      ],
      [
        nt(
          3,
          'science',
          'conservation: how people protect elephants',
          '3-LS4-4',
          [
            NV(
              'Nova’s notes: real elephants are in danger from ivory hunters and shrinking habitats. Selling ivory across borders has been banned since 1989.',
            ),
            NV(
              'Elephants are also protected by rangers, reserves, and by people leaving them wild land. Keeping them safe takes many people and many years.',
            ),
          ],
          'Learned that elephants are protected by bans on ivory trade, reserves and rangers.',
        ),
      ],
    ),
  ],
  [
    gloss('ivory', 'The hard, creamy-white material of an elephant’s tusks.', 'a06-14-tree'),
    gloss(
      'matriarch',
      'The oldest and most senior female, who leads a family group.',
      'a06-14-tree',
    ),
    gloss('herd', 'A large group of animals that live and travel together.', 'a06-14-tree'),
    gloss(
      'tusk',
      'A very long pointed tooth that sticks out beside an animal’s mouth.',
      'a06-14-complete',
    ),
  ],
);

// ================================================================== A6-15 Home
const A15: EduQuest = quest(
  'a06-15',
  'Home',
  {
    'a06-15-s1': {
      goal: 'Come home to Baghdad with Sinbad.',
      hint: 'Walk with Sinbad from the quay to the round city.',
    },
    'a06-15-s2': {
      goal: 'Walk the porter home to his street.',
      hint: 'Leave the great house with the porter and his daughter.',
    },
  },
  [
    sc(
      'a06-15-quay',
      [
        N('The ship comes into Basra early, on the first of the winds, sitting low in the water.'),
        YS('Home. Rich, early, and in one piece. That has never once happened before.', 'happy'),
        N(
          'He hires a boat up the river, and walks in through the Basra Gate with porters behind him, and you beside him.',
        ),
        N(
          'At the palace he tells the Caliph that the King of Serendib is reading. The Caliph laughs, and is pleased.',
        ),
        YS('Seven times. Seven! And I swear it now, in front of you two: there is no eighth.'),
        N(
          'For once, he keeps it. You can tell, because the old man in the long room is sitting so very still.',
        ),
      ],
      [
        nt(
          5,
          'science',
          'a ship sits lower when it is loaded: floating and weight',
          '3-PS2-1',
          [
            NV(
              'Nova’s notes: a heavy cargo pushes a ship lower in the water until the upward push of the water equals the weight.',
            ),
            NV('A mark on the hull, a load-line, shows the safe depth.'),
            NV(
              'A ship “sitting low” is a quick, true clue that the hold is full, even before you’ve seen inside.',
            ),
          ],
          'Learned that a loaded ship sits lower until the water’s upward push balances its weight.',
        ),
        ak(
          4,
          'sel',
          'think: what makes a homecoming good?',
          RES,
          [
            N(
              'Sinbad is rich and early. In the other version of the story he is poor and late. What makes coming home good? There’s no single right answer.',
            ),
          ],
          [
            o('Being safe, and having someone waiting.', [
              YS(
                'A fair answer. The porter and the old man have each other. That’s a good homecoming at any price.',
              ),
            ]),
            o('Bringing something back to share.', [
              YS(
                'A fair answer. Sharing what you’ve brought is a way of making home better for everybody.',
              ),
            ]),
            o('Feeling you’ve learned something.', [
              YS(
                'A fair answer. A voyage that changes you is a voyage you can bring home, whatever’s in your pockets.',
              ),
            ]),
          ],
          'Reflected on what makes coming home good, with no right answer.',
        ),
      ],
      [
        {
          id: 'believe',
          label: 'Say you believe him this time.',
          then: [YS('So do I. That’s new.', 'happy')],
        },
        {
          id: 'doubt',
          label: 'Ask how long it will last.',
          then: [
            YS('Ha! Fair.', 'happy'),
            YS('This time, I think, for good. I’ve run out of things to be bored of.', 'soft'),
          ],
        },
      ],
    ),
    sc(
      'a06-15-street',
      [
        N('The carpet turns back into a carpet. The old man is smiling down at his own hands.'),
        S(
          'I came home heavy that time, heavier than ever. I’ve always wondered what to do with it.',
        ),
        S('Porter. Your street. Does it have a fountain?'),
        P('There’s a well at the far end. The women walk there and back all morning.', 'think'),
        S('Then it has a fountain now. Or it will by the spring.'),
        N(
          'Next morning, when you walk the porter home, there are workmen on his street with a cart of stone, marking out a fountain.',
        ),
        D('Baba! They’re building water! Right here!', 'happy'),
      ],
      [
        nt(
          4,
          'social-studies',
          'public water fountains were a gift to a whole community',
          'D2.Civ.8.K-2',
          [
            NV(
              'Nova’s notes: in many cities of the old Islamic world, the rich paid for public fountains, called sabils, so anyone could drink for free.',
            ),
            NV(
              'Fresh water close to home saves hours of walking, especially for children and the people who carried it.',
            ),
          ],
          'Learned that public drinking fountains were built as a gift to the whole community.',
        ),
        ak(
          5,
          'maths',
          'multiplication and time',
          '3.OA.A.3',
          [
            D(
              'The women walk to the well and back every morning. If each trip takes 20 minutes and a woman makes 3 trips, how many minutes does she walk?',
            ),
            D('And how many hours is that?'),
          ],
          [
            o(
              '60 minutes: one hour.',
              [
                D(
                  'Yes! 3 × 20 = 60 minutes, which is exactly 1 hour. A fountain on the street gives that hour back!',
                ),
              ],
              true,
            ),
            o('23 minutes.', [
              D(
                'That adds 3 + 20. Three trips of 20 minutes is 3 × 20 = 60 minutes, which is one hour.',
              ),
            ]),
            o('120 minutes.', [
              D('That doubles. Three trips of 20: 3 × 20 = 60 minutes, which is one hour.'),
            ]),
          ],
          'Multiplied 3 × 20 = 60 minutes and converted it to 1 hour.',
        ),
      ],
      [
        {
          id: 'why',
          label: 'Ask the old man why.',
          then: [S('Because a man complained on my bench, and he was right.')],
        },
        {
          id: 'cup',
          label: 'Promise the daughter you’ll come back for the first drink.',
          then: [
            D('You have to! I’ll save you the first cup. And one for the little one.', 'happy'),
          ],
        },
      ],
    ),
    sc(
      'a06-15-complete',
      [
        N('Later, back in the long room, the old man opens a chest.'),
        S('Before you go, I have something for you and your little one.'),
        N(
          'It is a sail, folded small: old canvas, salt-stained, with a patch on it you have seen before.',
        ),
        S('From my first ship. The one that left me on the whale, and came back with my bales.'),
        S(
          'Hang it somewhere you can see the wind. It’s no use to me now. I don’t go anywhere.',
          'soft',
        ),
        P('Then give me one more evening. Next time, you’ll hear mine.'),
        S('Yours?', 'happy'),
        P('I’ve been listening for seven nights. I think I’ve got one.'),
      ],
      [
        ak(
          3,
          'science',
          'wind as a force on a sail',
          '3-PS2-1',
          [
            N(
              'Hung from a pole, the sail swings round to show the wind’s direction. If the wind is pushing the sail towards the east, which way is the wind blowing from?',
            ),
          ],
          [
            o(
              'From the west.',
              [
                N(
                  'Yes! A wind blowing from the west pushes things towards the east. Wind is named for where it comes from.',
                ),
              ],
              true,
            ),
            o('From the east.', [
              N(
                'A wind from the east would push the sail towards the west. A push towards the east means the wind comes from the west.',
              ),
            ]),
            o('From above.', [
              N(
                'Wind moves sideways across the ground. A push to the east means a wind from the west.',
              ),
            ]),
          ],
          'Reasoned that a wind that pushes a sail eastwards blows from the west.',
        ),
        nt(
          6,
          'literacy',
          'a character decides to become a teller',
          'RL.3.3',
          [
            NV(
              'Nova’s notes: the porter has spent seven nights as a listener, and now says he has “got one”: a story of his own.',
            ),
            NV('Characters in good stories change, and this is his change.'),
            NV(
              'Notice that he doesn’t say he is clever or brave. He says he has been listening. Listening, the story suggests, is where telling begins.',
            ),
          ],
          'Noticed how a character changes from listener to teller.',
        ),
      ],
    ),
  ],
  [
    gloss(
      'load-line',
      'A mark painted on a ship’s side that shows how low it can safely sit in the water.',
      'a06-15-quay',
    ),
    gloss(
      'fountain',
      'A built structure that supplies drinking water, or sends water into the air.',
      'a06-15-street',
    ),
    gloss('canvas', 'Strong, heavy cloth used for sails and tents.', 'a06-15-complete'),
    gloss(
      'sabil',
      'A public drinking fountain, paid for as a gift to everyone who passes.',
      'a06-15-street',
    ),
  ],
);

// ================================================================== A6-16 The Porter’s Voyage
const A16: EduQuest = quest(
  'a06-16',
  'The Porter’s Voyage',
  {
    'a06-16-s1': {
      goal: 'Listen to the porter tell his own story.',
      hint: 'Sit in the long room with the household.',
    },
    'a06-16-s2': {
      goal: 'Take the storyteller’s cushion home and find it a place in the Grove.',
      hint: 'Step back through the page, then put the cushion down somewhere your Nubbins can gather.',
    },
    'a06-16-s3': {
      goal: 'Tell your own story to the Grove.',
      hint: 'Sit on the storyteller’s cushion.',
    },
  },
  [
    sc(
      'a06-16-telling',
      [
        N(
          'The last evening. The long room is full: the steward, the cook, the porter’s daughter, and the old man, for once a listener.',
        ),
        P('I’ve never told a story. I’ve carried a few. Bear with me.'),
        N(
          'He takes something from his sash and sets it on the low table. The lamplight finds it: a small clear stone, no bigger than a lentil.',
        ),
        P(
          'This is the first line of my story. A friend brought it out of a valley that nobody comes back from.',
        ),
        P(
          'I’ve carried other people’s jewels all my life. This is the only one anybody ever brought for me. So I’ll never sell it.',
        ),
        P(
          'My story is short. I’m a porter in Baghdad. I carry paper to the House of Wisdom, and I can’t read, so I listen.',
        ),
        P(
          'I listened to a rich man for seven nights, and I found out he was paid for, the same as me. Only in different coins.',
        ),
      ],
      [
        nt(
          5,
          'social-studies',
          'oral storytelling: stories can be carried without writing',
          'D2.His.2.K-2',
          [
            NV(
              'Nova’s notes: for most of history, stories were told aloud, not written. A teller learned a tale by listening, then told it in their own way.',
            ),
            NV(
              'Tales like Sinbad’s were told aloud long before anyone wrote them down. A porter who can’t read is just the sort of person who carried them.',
            ),
          ],
          'Learned that stories were passed on aloud for centuries before being written, and that a person who cannot read can still carry a story.',
        ),
      ],
    ),
    sc(
      'a06-16-telling-done',
      [
        P(
          'And at the end, a herd walked home through the hills, and nobody shot at them, and nobody ever will.',
        ),
        P('My friend went free, and the old elephants paid for it, in bones.', 'soft'),
        N(
          'Nobody says anything. Then the old man claps, slowly, and the steward joins in, and then everybody does.',
        ),
      ],
      [
        ak(
          1,
          'literacy',
          'metaphor in the porter’s last line',
          'L.4.5',
          [
            N(
              '“The old elephants paid for it, in bones.” The porter is using “paid for” in a surprising way. What is he saying?',
            ),
          ],
          [
            o(
              'That Sinbad’s freedom came from the old tusks the elephants left, not from killing any.',
              [
                N(
                  'Yes. “Paid for” turns bones into a kind of coin. The elephants gave only what they had already left behind.',
                ),
              ],
              true,
            ),
            o('That the master paid the elephants money.', [
              N(
                'Not literally. “Paid for, in bones” is a figure of speech: the price was what the herd had already left behind.',
              ),
            ]),
          ],
          'Interpreted a figurative use of “paid for”.',
        ),
      ],
    ),
    sc(
      'a06-16-grove',
      [
        S(
          'Take this. It’s the cushion I told from, all seven nights. I have a feeling I’m done telling.',
        ),
        N('It is fat and round and faded, embroidered with a small ship under a big sail.'),
        P(
          'He’s done telling. Now he wants to listen. Fifty years late, he says, and he’s starting with me.',
          'happy',
        ),
        D('And me. I’m telling him the giant one tomorrow. With the pepper.', 'happy'),
        N(
          'You step back through the page. The lamps go, and the Grove’s own evening is all round you, smelling of grass.',
        ),
        N(
          'Your Nubbin is already dragging the cushion across the lawn, looking for the right spot.',
        ),
      ],
      [
        ak(
          2,
          'sel',
          'listening is a gift',
          REL,
          [
            N(
              'The old man says he is done telling, and now wants to listen. Why might being listened to be a gift for the person who is speaking?',
            ),
          ],
          [
            o(
              'It shows they matter and that their words are valued.',
              [
                N(
                  'Yes. Being heard makes people feel they matter. It costs nothing but attention, and it is rare.',
                ),
              ],
              true,
            ),
            o('It doesn’t matter either way.', [
              N(
                'It matters a lot! The porter has listened for seven nights, and today he gets to be heard. That’s a gift.',
              ),
            ]),
          ],
          'Learned that being listened to shows we matter.',
        ),
      ],
      [
        {
          id: 'pond',
          label: 'Set it down by the pond.',
          then: [
            N('Where the water can listen too. Your Nubbin approves, and sits on it at once.'),
          ],
        },
        {
          id: 'trees',
          label: 'Set it down under the fruit trees.',
          then: [
            N(
              'In the shade, where the evening comes first. Your Nubbin approves, and sits on it at once.',
            ),
          ],
        },
      ],
    ),
    sc(
      'a06-16-grove-done',
      [
        N(
          'One by one your Nubbins come over the grass and sit down in a ring round the cushion, as if somebody had rung a bell.',
        ),
        N('There is a space left, exactly the size of a person.'),
      ],
      [
        dn(
          0,
          'maths',
          'odd and even: pairing off a ring',
          '2.OA.C.3',
          'edu:count:nubbins:odd-even',
          [
            N('Count the Nubbins in the ring. Is the number odd or even? Pair them off, two by two, to check.'),
            N('If one is left over, it sits on your foot. It is usually the same one.'),
          ],
          'Counted a ring of Nubbins and paired them off to tell odd from even.',
        ),
      ],
    ),
    sc(
      'a06-16-tell',
      [
        N('You sit on the cushion. All the small faces turn up to you.'),
        N(
          'Behind you there are footsteps on the grass. Nova sits down at the back of the ring without a word.',
        ),
        N('You have never told a story either. You think of the porter’s hands on the table.'),
        N('Your Nubbin climbs off the cushion and sits on your foot instead, to help.'),
        N(
          'You take a breath, the way the old man did, as if the Grove were a ship and you could feel it move.',
        ),
        N('Then you begin.'),
      ],
      [
        ak(
          2,
          'sel',
          'think: being nervous before you share',
          SEL,
          [
            N(
              'You have never told a story before, and you feel nervous. What could help a person who is nervous about sharing something of their own?',
            ),
          ],
          [
            o('Take a breath, and begin small.', [
              N(
                'Yes. A breath and a small first line is how the old man started, and how the porter did too.',
              ),
            ]),
            o('Wait until it is perfect.', [
              N(
                'Perfect might never come! Stories improve by being told. A small start is better than a perfect wait.',
              ),
            ]),
            o('Ask a friend to sit nearby.', [
              N(
                'Very good. Your Nubbin does exactly that. A friend at your side makes beginning easier.',
              ),
            ]),
          ],
          'Reflected on what helps when you feel nervous about sharing.',
        ),
      ],
      [
        {
          id: 'whale',
          label: 'Begin with the island that was a whale.',
          then: [
            Y('Once there was an island that was fast asleep…'),
            N('Your Nubbin rolls on to its back, being the whale.'),
          ],
        },
        {
          id: 'porter',
          label: 'Begin with the porter on the bench.',
          then: [
            Y(
              'Once there was a man who carried every book in Baghdad, and couldn’t read a single one…',
            ),
          ],
        },
        {
          id: 'elephants',
          label: 'Begin with the elephants.',
          then: [
            Y('Once there was a herd of elephants who only wanted to be left alone…'),
            N('Every Nubbin in the ring goes very still.'),
          ],
        },
      ],
    ),
    sc(
      'a06-16-complete',
      [
        N(
          'It takes you all evening. Your Nubbin acts out every part, badly and with great feeling, especially the roc.',
        ),
        NV(
          'That page always tells it a bit differently. I’ve never heard the porter get the last word before.',
          'happy',
        ),
        NV(
          'Who told it first? Nobody knows. In the book, it’s a woman in Persia, telling a king one story a night.',
        ),
        NV(
          'She kept a cruel king listening for a thousand and one nights, until he learned to be kind.',
          'soft',
        ),
        NV(
          'Persian and Arabic, then French, then English, and now you, on a cushion. Stories travel like sailors. They come home changed.',
        ),
        N('Your Nubbins don’t leave the ring for a long time, even after the stars are out.'),
      ],
      [
        ak(
          5,
          'sel',
          'think: whose story is it?',
          RES,
          [
            N(
              'A story told in Persian, then Arabic, then French, then English, and changed by every teller. Whose story is it now? There’s no single right answer.',
            ),
          ],
          [
            o('Everyone’s who has told or heard it.', [
              NV(
                'A fair answer. A story keeps growing as it’s shared, and each teller adds to it.',
              ),
            ]),
            o('The first teller’s, though others have changed it.', [
              NV(
                'A fair answer. The first teller started it, and that matters, even if nobody knows who they were.',
              ),
            ]),
            o('Mine, once I have told it in my own way.', [
              NV(
                'A fair answer. Telling a story makes it yours for the moment, and it’s still the world’s.',
              ),
            ]),
          ],
          'Reflected on how stories change as they travel and whose they are, with no right answer.',
        ),
        nt(
          4,
          'social-studies',
          'stories travel across languages and cultures',
          'D2.His.2.K-2',
          [
            NV(
              'Nova’s notes: the Thousand and One Nights was written down in Arabic. Its frame story came from an older Persian book.',
            ),
            NV(
              'Sinbad’s tales joined it, and it was later translated into French, English and many other languages.',
            ),
            NV(
              'Translators carried the tales across the world. Each new version is a bridge between people who didn’t share a language.',
            ),
          ],
          'Learned that the Sinbad tales spread across many languages through translators.',
        ),
      ],
    ),
  ],
  [
    gloss('embroidered', 'Decorated with a design sewn on cloth in thread.', 'a06-16-grove'),
    gloss('lentil', 'A small, flat, round seed eaten as food.', 'a06-16-telling'),
    gloss(
      'metaphor',
      'A way of describing something by saying it is something else.',
      'a06-16-telling-done',
    ),
  ],
);

// ================================================================== variant scenes
export const EDU_A06_READER_VARIANTS: EduScene[] = [
  // plays once after a06-01-complete (or when the page opens) if s24Done is set
  sc(
    'a06-margin-hazel',
    [
      N(
        'In the margin beside the round city, in soft pencil you have never noticed before, there is a note. You know the hand.',
      ),
      N(
        '“Seven voyages, and he still came home to tell it to a porter. Somebody has to stay put and listen. I volunteer. H.”',
      ),
      N(
        'Underneath, smaller, is a whale drawn in three quick lines, with a tree growing out of its back.',
      ),
    ],
    [
      nt(
        2,
        'literacy',
        'a margin note is a quiet conversation across time',
        'L.3.4',
        [
          NV(
            'Nova’s notes: the margin is the empty edge of a page. Readers have always written notes there, and a note can talk to every later reader.',
          ),
          NV(
            'Hazel’s note is short and warm and a bit funny, like her. A margin note is how a reader says, “I was here, and I thought about this.”',
          ),
        ],
        'Learned that a margin note is a reader’s message to later readers.',
      ),
    ],
  ),
  // a06-stone = left: replaces a06-05-complete
  sc(
    'a06-05-complete-left',
    [
      N('The carpet and the cushions are back, and the porter is holding his breath.'),
      S(
        'I came home rich. I gave a good part to the poor, as you should, and then I sat on the rest and got bored.',
      ),
      N('Your pockets are empty. The porter notices you checking them.'),
      P('Nothing? You were in a valley of diamonds, and you brought back nothing?'),
      P('That’s either very wise or very silly. I’ll think about it tonight.', 'think'),
      S('Everything I brought out of that valley, I spent. You can’t spend what you left there.'),
    ],
    [
      ak(
        4,
        'social-studies',
        'think: is leaving something behind wise or silly?',
        'D2.Eco.1.K-2',
        [
          N(
            'The porter can’t decide whether leaving the diamonds was wise or silly. What do you think? There’s no single right answer.',
          ),
        ],
        [
          o('Wise: some things are better left than owned.', [
            S('A fair answer. Not everything beautiful needs to be taken home.'),
          ]),
          o('Silly: the stone could have helped the porter.', [
            S(
              'A fair answer. A small stone could have meant a lot to a poor friend. It’s a real cost.',
            ),
          ]),
          o('Neither: it was your choice, and a choice can be both.', [
            S('A thoughtful answer. Choices often hold a gain and a loss together.'),
          ]),
        ],
        'Reflected on whether choosing to take nothing was wise or silly, with no right answer.',
      ),
    ],
  ),
  // a06-ivory = kept: replaces a06-14-complete
  sc(
    'a06-14-complete-kept',
    [
      N('Sinbad stays. A season passes in a page: a dry season, then the rains.'),
      N(
        'Three times the herd walks past the master’s gate, slow and huge and calm. Three times they harm nothing, not even his garden.',
      ),
      MA(
        'Three times. They could flatten this house in a minute, and they walk round my beans.',
        'think',
      ),
      MA('I’m done. No more arrows. No more hunting, not by me, and not by anyone I pay.', 'soft'),
      MA('Go home, Sinbad. You’re free. I’ve nothing to give you, and I’m sorry for that.', 'sad'),
      YS('You’re giving me home. That’s plenty.', 'soft'),
    ],
    [
      nt(
        3,
        'sel',
        'seeing kindness can change a mind',
        SOC,
        [
          N(
            'The master changed his mind not because he was argued with, but because he watched the herd and saw gentleness he hadn’t expected.',
          ),
          N(
            'Changing your mind when you learn something new is a strength, not a weakness. It takes courage to say, “I was wrong.”',
          ),
        ],
        'Learned that observing kindness can change a mind and that changing one’s mind takes courage.',
      ),
      dn(
        1,
        'science',
        'seasons and the rains',
        '3-ESS2-1',
        'edu:order:seasons:rains',
        [
          N(
            'A dry season, then the rains. In many hot lands the year has wet and dry seasons instead of winter and summer. Put the two in order of the story.',
          ),
        ],
        'Put a dry season and a rainy season in order, as in many hot lands.',
      ),
    ],
  ),
  // a06-ivory = kept: replaces a06-15-quay
  sc(
    'a06-15-quay-kept',
    [
      N(
        'Sinbad comes home late, on the last of the winds, on a ship that carries him for nothing, with only a staff and a borrowed cloak.',
      ),
      N(
        'From Basra he walks the river road to Baghdad, because he can’t pay for a boat. It takes eleven days.',
      ),
      YS('Home. Poor, late, and in one piece. That still counts.'),
      N(
        'At the palace he tells the Caliph that the King of Serendib is reading. The Caliph thanks him, and gives him supper.',
      ),
      YS('Fair enough. He doesn’t owe me for elephants.', 'happy'),
      YS('Seven times. And I swear it now, in front of you two: there is no eighth.'),
      N(
        'For once, he keeps it. You can tell, because the old man in the long room is sitting so very still.',
      ),
    ],
    [
      ak(
        1,
        'maths',
        'distance, speed and time',
        '4.MD.A.2',
        [N('Sinbad walks about 40 kilometres a day. How far does he walk in eleven days?')],
        [
          o(
            '440 kilometres.',
            [
              N(
                'Yes! 40 × 11 = 440 km: about the real distance from Basra to Baghdad by the river road.',
              ),
            ],
            true,
          ),
          o('51 kilometres.', [
            N('That adds 40 + 11. Forty kilometres a day for eleven days is 40 × 11 = 440 km.'),
          ]),
          o('400 kilometres.', [
            N('That is 40 × 10. There are eleven days, so it’s 40 × 11 = 440 km.'),
          ]),
        ],
        'Multiplied 40 km × 11 days = 440 km.',
      ),
      nt(
        3,
        'literacy',
        'contentment',
        'L.3.4',
        [
          N(
            'Sinbad is poor, but calm. That’s contentment: feeling you have enough, whatever you carry.',
          ),
          N(
            'Contentment isn’t the same as giving up. Sinbad still cares, and still tells the truth. He just no longer needs more to feel at peace.',
          ),
        ],
        'Learned the meaning of contentment.',
      ),
    ],
    [
      {
        id: 'believe',
        label: 'Say you believe him this time.',
        then: [YS('So do I. That’s new.', 'happy')],
      },
      {
        id: 'doubt',
        label: 'Ask how long it will last.',
        then: [
          YS('Ha! Fair.', 'happy'),
          YS(
            'This time, for good. I’ve nothing left to go to sea for, and I find I don’t mind.',
            'soft',
          ),
        ],
      },
    ],
  ),
  // a06-ivory = kept: replaces a06-15-street
  sc(
    'a06-15-street-kept',
    [
      N('The carpet turns back into a carpet. The old man is smiling down at his own hands.'),
      S('I came home with nothing that time. It’s the voyage I’m proudest of.'),
      P('Nothing? After all that?'),
      S(
        'Not a coin. I sat on the steps of this house, which was shut up, and I didn’t have the key.',
      ),
      P('Then tonight you eat at mine.', 'soft'),
      S('Porter, I have a cook.', 'shock'),
      P('You have a cook. I have lentils, a daughter, and a roof that only leaks a bit. Come on.'),
      N(
        'The porter’s home is one room, swept clean. His daughter gives the old man the best cushion, which is the only cushion.',
      ),
      D('Baba says you were poor once too. Is that true?'),
      S('Once. Only for a season. It was a very good season.', 'soft'),
    ],
    [
      ak(
        6,
        'sel',
        'hospitality: sharing what you have',
        REL,
        [
          N(
            'The porter has little, and still shares his supper with the old man. What does his sharing say about him?',
          ),
        ],
        [
          o(
            'That generosity doesn’t depend on being rich.',
            [
              N(
                'Yes. The porter gives what he has, which is the true meaning of generous. Wealth isn’t needed, just willingness.',
              ),
            ],
            true,
          ),
          o('That he is trying to impress the old man.', [
            N(
              'Not likely: the old man has a cook. He is doing it because his friend needs a meal, which is simple kindness.',
            ),
          ]),
        ],
        'Reasoned that generosity does not depend on wealth.',
      ),
    ],
    [
      {
        id: 'eat',
        label: 'Eat the lentils with them.',
        then: [S('I’ve eaten at the Caliph’s table. These are better. Don’t tell him.', 'happy')],
      },
      {
        id: 'nubbin',
        label: 'Let your Nubbin sit with the daughter.',
        then: [
          N(
            'She feeds it lentils one at a time, and tells it the whale story, wrong, with tremendous confidence.',
          ),
        ],
      },
    ],
  ),
  // a06-stone = left: replaces a06-16-telling
  sc(
    'a06-16-telling-nothing',
    [
      N(
        'The last evening. The long room is full: the steward, the cook, the porter’s daughter, and the old man, for once a listener.',
      ),
      P('I’ve never told a story. I’ve carried a few. Bear with me.'),
      N(
        'He sets nothing on the low table. He looks at the empty place where something could be, and smiles.',
      ),
      P('I had nothing, so I listened.'),
      P(
        'That’s my first line. A friend went into a valley of diamonds and brought me nothing back. I’ve decided it was a present.',
      ),
      P(
        'My story is short. I’m a porter in Baghdad. I carry paper to the House of Wisdom, and I can’t read, so I listen.',
      ),
      P(
        'I listened to a rich man for seven nights, and I found out he was paid for, the same as me. Only in different coins.',
      ),
    ],
    [
      nt(
        4,
        'social-studies',
        'oral storytelling: every teller begins by listening',
        'D2.His.2.K-2',
        [
          NV(
            'Nova’s notes: for most of history, stories were told aloud. A teller learned a tale by listening, then told it in their own way.',
          ),
          NV(
            '“I had nothing, so I listened” is how every teller starts. Tales like Sinbad’s travelled for centuries this way, mouth to ear.',
          ),
        ],
        'Learned that stories were passed on aloud by people who first learned them by listening.',
      ),
    ],
  ),
  // a06-ivory = kept: replaces a06-16-telling-done
  sc(
    'a06-16-telling-done-kept',
    [
      P(
        'And at the end, a herd walked past a gate three times, and nobody shot at them, and nobody ever will.',
      ),
      P('My friend went free, and the elephants paid for it with a season of patience.', 'soft'),
      N(
        'Nobody says anything. Then the old man claps, slowly, and the steward joins in, and then everybody does.',
      ),
    ],
    [
      ak(
        1,
        'literacy',
        'metaphor in the porter’s last line',
        'L.4.5',
        [N('“The elephants paid for it with a season of patience.” What is the porter saying about what Sinbad’s freedom cost?')],
        [
          o(
            'That it cost time: a patient season of waiting, not a price in coins.',
            [
              N(
                'Yes. “Paid for” turns time and patience into a kind of coin. Sinbad’s freedom cost him patience.',
              ),
            ],
            true,
          ),
          o('That someone paid the master a lot of money.', [
            N(
              'Not literally. A season is a stretch of time, so the “payment” was waiting and patience.',
            ),
          ]),
        ],
        'Interpreted a figurative use of “paid for” in a different ending.',
      ),
    ],
  ),
];

// ================================================================== exports
export const EDU_A06_READER: EduQuest[] = [
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

/** Every `edu:` check used by a `do` lesson in this file. */
export const CHECKS: string[] = [
  'edu:count:nights:7',
  'edu:add:sailors:14',
  'edu:measure:box:perimeter',
  'edu:time:waves:interval',
  'edu:multiply:figs:days',
  'edu:calculate:voyage:days',
  'edu:count:nubbins:odd-even',
  'edu:order:seasons:rains',
];
