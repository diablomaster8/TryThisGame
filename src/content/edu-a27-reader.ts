/**
 * The Learning Grove, reader band (ages 7–10): Atlas page A27, The White-Haired Prince (Zal and
 * the Simurgh, Ferdowsi’s Shahnameh, Iran).
 *
 * Source: atlas-a27.ts (ATLAS_A27 and ATLAS_A27_VARIANTS). One EduScene per original scene (every
 * step scene, every done scene, every complete scene and every variant), id `reader:<original id>`,
 * with every choice kept under its original id and `set` flag (`a27-word` in a27-05-words,
 * `a27-feather` in a27-08-feather).
 * Reader keeps all choices, so no `defaultChoice` is needed. See EDU-STYLE.md. British spelling.
 *
 * Learning angles, from the outline: where Iran is and which countries share the Persian language;
 * the Shahnameh, Ferdowsi’s thirty years, and the Persian words behind its title; the Simurgh in
 * painted books; albinism, said plainly and kindly; hair that turns white with age; mountains,
 * weather, feathers and flight; the Moon, the seasons, day and night and Earth’s spin; the
 * Persian calendar and the Royal Road; writing a letter to say something hard; and feelings
 * (shame, courage, forgiveness, fairness, asking for help). Maths: sums and differences, equal
 * groups and division, perimeter, quarters, units of length and time, number patterns, symmetry.
 *
 * Think questions (`ask` with no `best`) in every quest, and one `sel` lesson in every quest.
 * Domains never repeat back to back, across scenes, quests and every a27-feather path. Each
 * variant scene has the same domain as the scene it replaces; the margin note and the Corvin line
 * (feelings) differ from the scenes beside them.
 *
 * Care notes kept: no lines from Zimmern or Ferdowsi (every lifted line is reworded); albinism is
 * named plainly, as an inherited trait and never a curse, and Sam’s shame is called wrong while Zal
 * is the most capable person in the story; the mobeds and Sam’s prayer are brief and respectful;
 * the baby is never in danger for more than a moment; Persian names are used as the Persian adviser
 * prefers; Kabul and Sistan are named on both sides of today’s border with no modern politics;
 * Mehrab’s threat and the Shah’s order to burn Kabul are cut to one frightened line; Rostam’s
 * birth follows the script (counsel from the Simurgh, a safe baby).
 *
 * Facts used (all well established): Persian is spoken as Farsi in Iran, Dari in Afghanistan and
 * Tajik in Tajikistan; the Shahnameh was finished around 1010 and took Ferdowsi about thirty years;
 * shah means king and nameh means book (or letter); English “bazaar”, “caravan” and “checkmate”
 * come from Persian; albinism is inherited and means very little melanin; hair turns white with
 * age as pigment cells slow; the Alborz range lies south of the Caspian Sea, and Damavand is its
 * highest peak at about 5,600 m; rain forms as rising air cools; birds of prey hunt mainly by
 * sight; feathers and down trap air; camel humps store fat; a mother crocodile carries hatchlings
 * in her mouth; Earth’s tilt gives longer summer days; Earth’s spin gives day and night; the
 * Moon’s cycle is about 29 and a half days; the old Persian year had 12 months of 30 days plus 5;
 * Persian kings built a Royal Road with relay riders; Yalda marks the winter solstice (about 21
 * December) with pomegranates and poetry; burning cannot be reversed and melting can; sound comes
 * from vibration; fire needs fuel, heat and air; a square has four lines of symmetry.
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

// ================================================================== A27-1 A Son for Sam
const A1: EduQuest = quest(
  'a27-01',
  'A Son for Sam',
  {
    'a27-01-s1': {
      goal: 'Step into the mountain page and find the champion’s house in Sistan.',
      hint: 'Touch the green city at the bottom of the page.',
    },
    'a27-01-s2': {
      goal: 'Go to the family’s rooms and see Sam’s son.',
      hint: 'Follow the nurse down the passage with the lamps.',
    },
    'a27-01-s3': {
      goal: 'Go with the nurse when she tells Sam.',
      hint: 'Walk behind her to the hall. Stay by the door.',
    },
  },
  [
    sc(
      'a27-01-page',
      [
        N(
          'Nova’s atlas falls open at a mountain above the clouds, a vast nest, and far below, a green city.',
        ),
        N(
          'A card says this is a story from the Shahnameh, the Book of Kings, finished by Ferdowsi around the year 1010.',
        ),
        N(
          'People in Iran, Afghanistan and Tajikistan still recite it, and they name their children from it.',
        ),
        N(
          'Ferdowsi spent about thirty years on it. This is one of its stories, retold in our own words.',
        ),
        N('The page goes warm under your hand, like a wall that has had the sun on it all day.'),
        N(
          'Then it is dust, and a gate, and you are standing in it. Inside, a big house is lit from end to end.',
        ),
        NU('A traveller? Come in. Nobody is turned away from this door tonight.', 'happy'),
        N(
          'Your Nubbin sniffs the air. Somewhere in the house there is bread, and it has made a note of where.',
        ),
      ],
      [
        ask(
          2,
          'social-studies',
          'Persian is spoken in Iran, Afghanistan and Tajikistan',
          'D2.Geo.2.3-5',
          [
            N(
              'The Shahnameh is loved in Iran, Afghanistan and Tajikistan. One language links all three countries. Which one?',
            ),
          ],
          [
            o(
              'Persian.',
              [
                N(
                  'Yes. Persian, in a few forms: it is called Farsi in Iran, Dari in Afghanistan and Tajik in Tajikistan.',
                ),
              ],
              true,
            ),
            o('Latin.', [
              N('Not Latin. The language is Persian, in a few forms: Farsi, Dari and Tajik.'),
            ]),
            o('Greek.', [
              N('Not Greek. The language is Persian, in a few forms: Farsi, Dari and Tajik.'),
            ]),
          ],
          'Learned that Persian, in its different forms, links Iran, Afghanistan and Tajikistan, where the Shahnameh is loved.',
        ),
        ask(
          3,
          'maths',
          'add to find a date: 980 + 30',
          '4.NBT.B.4',
          [
            N(
              'Suppose Ferdowsi began his book in the year 980 and worked for thirty years. In what year did he finish?',
            ),
          ],
          [
            o(
              '1010.',
              [N('Yes. 980 plus 30 is 1010, which matches “around the year 1010”.')],
              true,
            ),
            o('1000.', [N('Close. Count on: 980 plus 20 makes 1000, then 10 more makes 1010.')]),
            o('1110.', [
              N('Check the hundreds. 980 plus 30 is 1010. It is about a thousand years ago.'),
            ]),
          ],
          'Added 30 years to a start date to find when the Shahnameh was finished, around 1010.',
        ),
      ],
      [
        ch('thank', 'Thank her, and wipe your feet.', [
          NU('Good manners. You will do well here. Leave your shoes with the others.', 'soft'),
        ]),
        ch('baby', 'Ask about the baby.', [
          NU('A boy. Perfect. We are all very…', 'think'),
          N('She stops, smiles too quickly, and takes your coat.'),
        ]),
        ch('bread', 'Let your Nubbin follow its nose.', [
          N('It finds the kitchen in four seconds. The cook gives it a crust without being asked.'),
        ]),
      ],
    ),
    sc(
      'a27-01-page-done',
      [
        NU('Stay as long as you like. The master will want to thank every guest. When he knows.'),
        N('She says the last three words very quietly, to herself.'),
      ],
      [
        ask(
          1,
          'literacy',
          'Persian word parts: shah (king) and nameh (book)',
          'L.3.4',
          [
            N(
              'Shahnameh joins two Persian words: shah, which means king, and nameh, which means book. What does Shahnameh mean?',
            ),
          ],
          [
            o('Book of Kings.', [N('Yes. Shah plus nameh: Book of Kings.')], true),
            o('King of Books.', [
              N(
                'Nearly, but the words come in the other order. Shah plus nameh means Book of Kings.',
              ),
            ]),
            o('Letter to a Queen.', [
              N(
                'Nameh can mean letter as well as book, but shah means king. So it is the Book of Kings.',
              ),
            ]),
          ],
          'Worked out that Shahnameh means Book of Kings from its two Persian parts.',
        ),
      ],
    ),
    sc(
      'a27-01-birth',
      [
        N(
          'The family’s rooms are at the back of the house, warm and full of women talking softly.',
        ),
        N('In a cradle by the brazier lies a baby, asleep with both fists up by his ears.'),
        N(
          'His hair is white. Not fair: white, like frost on a bough, and soft as the down on a chick.',
        ),
        NU(
          'Eight days old, and his father has not seen him. Nobody has dared to tell him about the hair.',
          'sad',
        ),
        NU(
          'They think he will be angry. I think he will be a fool if he is. But I am only the nurse.',
        ),
        N(
          'Your Nubbin climbs up the cradle leg and looks in. The baby opens his eyes and looks back.',
        ),
      ],
      [
        ask(
          2,
          'science',
          'albinism: some people are born with very little melanin; it is inherited',
          '3-LS3-1',
          [
            N(
              'Some people are born with very little melanin, the colour in hair, skin and eyes. This is called albinism. Which is true about it?',
            ),
          ],
          [
            o(
              'It is inherited from parents, and is just how a person is made.',
              [
                N(
                  'Yes. It is passed down in families, like eye colour. You cannot catch it, and it is not a curse.',
                ),
              ],
              true,
            ),
            o('You can catch it from someone.', [
              N(
                'No. You cannot catch it. It is inherited, passed down in families, like eye colour.',
              ),
            ]),
            o('It is a curse.', [
              N(
                'No. It is only how a body is made. People with albinism may need sun hats and may see less sharply, and they are just like everyone else.',
              ),
            ]),
          ],
          'Learned plainly that albinism is an inherited trait, not a curse, and that people with it are just like everyone else.',
        ),
      ],
      [
        ch('beautiful', '“He’s beautiful.”', [NU('He is. Every bit of him.', 'soft')]),
        ch('hair', '“It’s only hair.”', [
          NU('That is what I keep saying. To the wall, mostly.', 'think'),
        ]),
        ch('tell', '“Someone should tell his father.”', [
          NU('Someone should. And someone will. It looks as if it will be me.', 'think'),
        ]),
      ],
    ),
    sc(
      'a27-01-birth-done',
      [
        N('Your Nubbin reaches in and touches the white hair, very carefully, with one paw.'),
        N('The baby grabs the paw and holds on. Neither of them seems to mind.'),
      ],
      [
        ask(
          1,
          'maths',
          'days and weeks: 8 days is 1 week and 1 day',
          '4.MD.A.2',
          [
            N(
              'The baby is eight days old. A week has seven days. How many days is that more than a week?',
            ),
          ],
          [
            o(
              'One day.',
              [N('Yes. Eight take away seven is one. He is one week and one day old.')],
              true,
            ),
            o('Two days.', [
              N('Count again: seven days make a week, and eight minus seven is one.'),
            ]),
          ],
          'Subtracted 7 from 8 to say the baby is one week and one day old.',
        ),
      ],
    ),
    sc(
      'a27-01-hall',
      [
        N(
          'Sam sits in his hall: a big man, grey at the temples, with a sword across his knees that he is not using.',
        ),
        N('The nurse goes in. You stay by the door, with your Nubbin behind your ankles.'),
        NU(
          'My lord, God has given you what you wanted: a son, strong and handsome, with nothing wrong in him.',
        ),
        NU(
          'Only his hair is white, like an old man’s. Remember he is a gift. Don’t be ungrateful for a gift.',
        ),
        SA('White?', 'shock'),
        N('He stands up. The sword slides off his knees onto the floor, and nobody picks it up.'),
        SA('Show me.'),
      ],
      [
        ask(
          5,
          'sel',
          'pausing before reacting to a surprise',
          'CASEL: Self-management',
          [
            N(
              'Sam is shocked, and acts before he thinks. What could help someone pause when something surprises them? There is no one right answer.',
            ),
          ],
          [
            o('Take a slow breath.', [
              N(
                'That is a fair answer. A slow breath gives the thinking part of us time to catch up.',
              ),
            ]),
            o('Count to ten.', [
              N(
                'That is a fair answer. Counting gives us a few seconds, and that is often enough.',
              ),
            ]),
            o('Ask a question first.', [
              N(
                'That is a fair answer. A question, such as “what do you mean?”, turns a shock into a conversation.',
              ),
            ]),
          ],
          'Thought about ways to pause before reacting to a surprise.',
        ),
      ],
    ),
    sc(
      'a27-01-hall-done',
      [
        N('He goes past you down the passage, very fast.'),
        N('The nurse looks at you, and doesn’t say anything at all.'),
      ],
      [
        ask(
          0,
          'literacy',
          'a word with two meanings: gift',
          'L.3.4',
          [
            N(
              'The nurse said a baby is “a gift”. A gift can mean a present, or a natural talent, like “a gift for music”. Which meaning did she use?',
            ),
          ],
          [
            o(
              'A present, given to be treasured.',
              [N('Yes. She meant the baby was given to Sam, and should be treasured.')],
              true,
            ),
            o('A natural talent.', [
              N(
                'A gift can mean that, as in “a gift for music”. But here she meant a precious present.',
              ),
            ]),
          ],
          'Told two meanings of the word gift apart by reading the sentence.',
        ),
      ],
    ),
    sc(
      'a27-01-complete',
      [
        N(
          'Sam stands over the cradle for a long time. The baby looks up at him with dark, steady eyes.',
        ),
        N('Sam doesn’t pick him up. That is the first wrong thing.', 'sad'),
        SA('Leave me. All of you. I need to think.'),
        N(
          'The women go out in a hurry. In the passage, the nurse takes your Nubbin’s paw, as if somebody’s paw ought to be held.',
        ),
      ],
      [
        ask(
          1,
          'social-studies',
          'fairness: everyone deserves care whatever they look like',
          'D2.Civ.8.3-5',
          [
            N(
              'Sam hesitates to hold his son because of the baby’s hair. Which idea about fairness does that go against?',
            ),
          ],
          [
            o(
              'Everyone deserves love and care, whatever they look like.',
              [N('Yes. How someone looks is never a fair reason to love them less.')],
              true,
            ),
            o('People should be treated by how they look.', [
              N(
                'No. That is just what is unfair here. A person’s looks are not a reason to treat them worse.',
              ),
            ]),
            o('It depends on the hair.', [
              N(
                'It does not. Hair colour tells us nothing about who a person is or how much they deserve care.',
              ),
            ]),
          ],
          'Talked about fairness: nobody should be treated worse because of how they look.',
        ),
      ],
    ),
  ],
  [
    gl(
      'Shahnameh',
      'A very long Persian poem, the Book of Kings, finished by Ferdowsi around the year 1010.',
      'a27-01-page',
    ),
    gl(
      'albinism',
      'A condition people are born with, in which the body makes very little of the colour called melanin.',
      'a27-01-birth',
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
      hint: 'The household gathers in the hall at first light.',
    },
    'a27-02-s2': {
      goal: 'Follow the servants up the mountain path.',
      hint: 'Keep close behind the old servant. The storm is coming from the north.',
    },
    'a27-02-s3': {
      goal: 'Stay with the baby at the foot of the high rocks.',
      hint: 'Sit with him in the lee of the big stone.',
    },
  },
  [
    sc(
      'a27-02-order',
      [
        N(
          'In the morning the whole household is called to the hall. Sam hasn’t slept, and it shows.',
        ),
        SA(
          'My enemies will laugh. They will say Sam’s son was born old, and that it means something bad for the land.',
          'angry',
        ),
        N(
          'It doesn’t mean anything. It is a baby with white hair, and he is hungry, and crying in the next room.',
        ),
        SA('Take the child away. Up to the Alborz, where nobody goes. Leave him there.', 'angry'),
        N('Nobody moves. Then an old servant at the back bows slowly, as if his back hurts.'),
        NU('My lord, he is a gift.', 'sad'),
        SA('Go.'),
      ],
      [
        ask(
          6,
          'sel',
          'when and how to speak up to someone powerful',
          'CASEL: Responsible decision-making',
          [
            N(
              'The nurse speaks up, but Sam does not listen. When is it right to speak up to someone powerful, even if it might not work? There is no one right answer.',
            ),
          ],
          [
            o('When someone is going to be hurt.', [
              N(
                'That is a fair answer. Protecting someone who cannot protect themselves is a very good reason.',
              ),
            ]),
            o('When I can do it kindly and clearly.', [
              N('That is a fair answer. A calm voice is more likely to be heard than a shout.'),
            ]),
            o('Only if I have a friend beside me.', [
              N(
                'That is a fair answer. Speaking up is easier together, and it can be brave to ask someone to stand with you.',
              ),
            ]),
          ],
          'Thought about when speaking up is right, even when it is hard.',
        ),
      ],
      [
        ch('speak', 'Speak up for the baby.', [
          Y('Please. He is your son. He hasn’t done anything.'),
          SA(
            'You are a guest in this house, and a guest does not tell me what my son is.',
            'angry',
          ),
          N('Your hands are shaking, but you said it, and the nurse heard you say it.'),
        ]),
        ch('look', 'Look Sam in the eye, and say nothing.', [
          N(
            'He looks back at you for a moment. Then he looks at the floor, and keeps looking at it.',
          ),
        ]),
        ch('nurse', 'Go and stand with the nurse.', [
          N('She doesn’t look at you, but she leans on your shoulder, just a little.'),
        ]),
      ],
    ),
    sc(
      'a27-02-order-done',
      [
        N('Sam goes out. The order stays in the room after him, like smoke.'),
        NU('Go with them. Please. Somebody kind should be there.', 'sad'),
      ],
      [
        ask(
          0,
          'literacy',
          'simile: an order that lingers like smoke',
          'L.4.5',
          [
            N(
              'The narrator says Sam’s order stayed in the room “like smoke”. Why is smoke a good comparison?',
            ),
          ],
          [
            o(
              'Smoke lingers and is hard to clear away.',
              [N('Yes. The order hangs in the air, and everyone can feel it.')],
              true,
            ),
            o('Smoke is cold.', [
              N('Smoke is usually warm. The point is that it lingers and is hard to clear.'),
            ]),
            o('Smoke is loud.', [
              N('Smoke is quiet. The point is that it lingers, as the order does.'),
            ]),
          ],
          'Explained why a simile, an order lingering like smoke, works.',
        ),
      ],
    ),
    sc(
      'a27-02-path',
      [
        N('Two servants carry the baby out of the city in a basket. You and your Nubbin follow.'),
        N(
          'The road becomes a path, and the path becomes stones. Ahead, the Alborz goes up and up into cloud.',
        ),
        SV('You don’t have to come. It isn’t your shame.', 'sad'),
        Y('It isn’t yours either.'),
        SV('I am the one carrying him. That makes it mine, I think.'),
        N('The wind gets up. The first rain comes sideways, hard and cold, out of the north.'),
      ],
      [
        ask(
          1,
          'science',
          'why clouds and rain gather over mountains',
          undefined,
          [
            N(
              'Mountains often bring storms. Wind is pushed up the slope, cools, and its water vapour turns into tiny drops. What forms?',
            ),
          ],
          [
            o(
              'Clouds, and then rain.',
              [
                N(
                  'Yes. Rising air cools, vapour turns to tiny drops, and clouds form. When the drops grow heavy, they fall as rain.',
                ),
              ],
              true,
            ),
            o('Sand.', [
              N('No. The vapour in the air turns to tiny drops of water, which make clouds.'),
            ]),
            o('Snowmen.', [
              N(
                'Ha. Snow can form up high where it is cold, but the first thing to form is cloud.',
              ),
            ]),
          ],
          'Learned that air pushed up a mountain cools, and its water vapour forms clouds and rain.',
        ),
      ],
    ),
    sc(
      'a27-02-path-done',
      [
        N(
          'By the time the path runs out, the storm is all round you, and you can’t see the city any more.',
        ),
      ],
      [
        ask(
          0,
          'maths',
          'add distances: 4 + 3 + 2',
          '3.OA.D.8',
          [
            N(
              'The servants walked 4 km on the road, 3 km on the path and 2 km on the stones. How far did they walk in all?',
            ),
          ],
          [
            o('9 km.', [N('Yes. 4 plus 3 is 7, and 7 plus 2 is 9.')], true),
            o('7 km.', [
              N('That is the road and the path. Add the 2 km on the stones as well: 9 km.'),
            ]),
            o('12 km.', [N('Check the sum: 4 plus 3 plus 2 is 9, not 12.')]),
          ],
          'Added three distances, 4 km, 3 km and 2 km, to make 9 km.',
        ),
      ],
    ),
    sc(
      'a27-02-rocks',
      [
        N(
          'At the foot of the high rocks the servants set the basket down, in the lee of a big stone.',
        ),
        SV('This is as far as anyone has ever been. Nobody climbs above here.'),
        N(
          'The other servant is already walking away. The old one stays a moment longer, holding the edge of the basket.',
        ),
        SV('I have carried him up a mountain. I will carry that the rest of my life.', 'sad'),
        N(
          'He goes, and you don’t. The rain gets in everywhere, and the baby is crying, thin and furious.',
        ),
        N(
          'Your Nubbin climbs into the basket and curls round his feet, the warmest thing it knows how to do.',
        ),
      ],
      [
        ask(
          1,
          'social-studies',
          'the Alborz mountains lie south of the Caspian Sea',
          '4-ESS2-2',
          [
            N(
              'The Alborz are real mountains, in northern Iran. They run along the southern shore of which sea?',
            ),
          ],
          [
            o(
              'The Caspian Sea.',
              [
                N(
                  'Yes. The Alborz curve along the south of the Caspian Sea. Their highest peak, Damavand, is about 5,600 metres.',
                ),
              ],
              true,
            ),
            o('The Red Sea.', [
              N('No. The Red Sea is far to the south-west. The Alborz lie south of the Caspian.'),
            ]),
            o('The Black Sea.', [
              N(
                'No. The Black Sea is further west, north of Turkey. The Alborz lie south of the Caspian.',
              ),
            ]),
          ],
          'Located the Alborz mountains south of the Caspian Sea in northern Iran.',
        ),
      ],
      [
        ch('coat', 'Wrap him in your coat.', [
          N('He stops crying for long enough to get angry about the coat instead.'),
        ]),
        ch('hum', 'Hum to him.', [
          N(
            'You hum the only tune you can think of. You can’t hear yourself over the wind, but he can, because he goes quiet.',
          ),
        ]),
        ch('hold', 'Hold him, and keep your back to the wind.', [
          N(
            'You pick him up and turn your back to the storm. He fits against your chest like he has always been there.',
          ),
        ]),
      ],
    ),
    sc(
      'a27-02-rocks-done',
      [
        N('Above the storm, something very large goes over.'),
        N('For a moment the rain stops falling on you, as if a roof had been put up.'),
      ],
      [
        ask(
          1,
          'literacy',
          'words that show what we sense: sound words',
          'L.3.4',
          [
            N(
              'Writers use sound words so you can hear a storm. Which of these is a sound word: howl, damp or grey?',
            ),
          ],
          [
            o(
              'Howl.',
              [
                N(
                  'Yes. “The wind howls” lets you hear it. Damp and grey are words for touch and sight.',
                ),
              ],
              true,
            ),
            o('Damp.', [
              N('Damp is a touch word. Howl is the sound word: you can hear a wind howl.'),
            ]),
            o('Grey.', [N('Grey is a sight word. Howl is the sound word.')]),
          ],
          'Picked out a sound word from words for sound, touch and sight.',
        ),
      ],
    ),
    sc(
      'a27-02-complete',
      [
        N('The shadow goes over again, lower. The wind it makes flattens the grass.'),
        N(
          'You hold on to the baby, and your Nubbin holds on to you. Nobody else in the world knows where the three of you are.',
        ),
        N('Then the cloud opens, and something comes down out of it.', 'shock'),
      ],
      [
        ask(
          1,
          'sel',
          'fear is normal; naming it and staying close helps',
          'CASEL: Self-management',
          [N('You are a long way from home, and you are scared. Which of these helps most?')],
          [
            o(
              'Know that fear is normal, and stay close to someone.',
              [
                N(
                  'Yes. Fear is a sign we care about being safe. Naming it and staying close helps it shrink.',
                ),
              ],
              true,
            ),
            o('Pretend I’m not scared.', [
              N(
                'Pretending is understandable, but a feeling we hide often gets bigger. Naming it helps.',
              ),
            ]),
            o('Run off alone.', [
              N(
                'Running alone could make things worse. Staying close to someone is safer and calmer.',
              ),
            ]),
          ],
          'Talked about how fear is normal, and how naming it and staying close helps.',
        ),
      ],
    ),
  ],
  [
    gl(
      'lee',
      'The sheltered side of something big, where the wind and rain do not reach.',
      'a27-02-rocks',
    ),
    gl('howl', 'A long, loud, wailing sound, like a strong wind or a wolf.', 'a27-02-rocks-done'),
  ],
);

// ================================================================== A27-3 The Simurgh
const A3: EduQuest = quest(
  'a27-03',
  'The Simurgh',
  {
    'a27-03-s1': {
      goal: 'Hold on to the baby when the great bird comes down.',
      hint: 'Don’t let go of the basket.',
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
        N('She comes down out of the cloud like a ship out of fog: a bird bigger than a house.'),
        N(
          'Her feathers are every colour a sunset has ever been, and her tail goes on behind her for a long time.',
        ),
        N(
          'She lands on the big stone above you, and the stone creaks. She looks down at the basket with one gold eye.',
        ),
        N(
          'Then she reaches down, very fast, and takes the baby up in her talons, blanket, coat and all.',
          'shock',
        ),
        N(
          'She looks at you, and at your Nubbin, still hanging on to the blanket with all four limbs. Then she takes you too.',
        ),
      ],
      [
        ask(
          2,
          'science',
          'birds of prey have very sharp eyesight',
          '4-LS1-2',
          [
            N(
              'The Simurgh found a small basket in a storm, from high above. Eagles and hawks hunt mainly by sight. Which sense do they rely on?',
            ),
          ],
          [
            o(
              'Very sharp eyesight.',
              [
                N(
                  'Yes. Many birds of prey see far more sharply than we do, so they can spot small things from high up.',
                ),
              ],
              true,
            ),
            o('A strong sense of smell.', [
              N('Most birds of prey do not smell well. They rely on very sharp eyesight.'),
            ]),
            o('Hearing the baby cry.', [
              N(
                'Hearing helps a little, but the storm was loud. Birds of prey rely mainly on very sharp eyesight.',
              ),
            ]),
          ],
          'Learned that birds of prey rely on very sharp eyesight to spot things from high up.',
        ),
      ],
      [
        ch('shout', 'Shout.', [
          N('You shout. The wind takes the shout away, and the ground takes itself away after it.'),
        ]),
        ch('hold', 'Hold on, and keep your eyes open.', [
          N('Below, the whole mountain falls away, and the storm is a grey floor under your feet.'),
        ]),
      ],
    ),
    sc(
      'a27-03-descent-done',
      [
        N(
          'Up through the cloud, and out into sun. Above the storm, the sky is enormous, and very blue, and very quiet.',
        ),
      ],
      [
        ask(
          0,
          'maths',
          'add distances in metres and convert to kilometres',
          '4.MD.A.2',
          [
            N(
              'She climbs 800 metres to the top of the cloud, then 1,200 metres more. How far is that in kilometres?',
            ),
          ],
          [
            o(
              '2 km.',
              [N('Yes. 800 plus 1,200 is 2,000 metres, and 1,000 metres make a kilometre.')],
              true,
            ),
            o('20 km.', [N('Check the units: 2,000 metres is 2 kilometres, not 20.')]),
            o('1 km.', [
              N('That is only part of it. 800 plus 1,200 is 2,000 metres, which is 2 km.'),
            ]),
          ],
          'Added 800 m and 1,200 m, then converted 2,000 m to 2 km.',
        ),
      ],
    ),
    sc(
      'a27-03-nest',
      [
        N(
          'The nest is on the very top of the Alborz, where the peak touches the stars. No one has ever stood up here.',
        ),
        N('It is built of ebony and sandalwood twined with aloe, and it is the size of a cottage.'),
        N(
          'In it are her chicks: four of them, each bigger than a pony, all beak and fluff and appetite.',
        ),
        N(
          'She sets the baby down in the middle of them. The chicks crowd in, beaks first, to see what she has brought.',
          'shock',
        ),
        N(
          'Your Nubbin drops off the blanket and stands in front of the baby, arms out, as tall as it can make itself.',
        ),
        N(
          'The Simurgh looks down at the small white-haired thing, and at the smaller thing guarding it. She feels compassion, and her heart turns over.',
        ),
        SI('No. Not him. He is your brother.', 'soft'),
      ],
      [
        ask(
          6,
          'art',
          'imagining and describing a creature the way painters of the Shahnameh did',
          'RL.4.3',
          [
            N(
              'Painters of the Shahnameh had to imagine a bird nobody had seen, with bright colours and a long, swirling tail. How would you paint her? There is no one right answer.',
            ),
          ],
          [
            o('Huge and gold, with a tail like a river of flame.', [
              N(
                'That is a fair answer. Gold and fire colours fit a bird who comes out of the sunset.',
              ),
            ]),
            o('Blue and green, with a tail like a swirl of clouds.', [
              N(
                'That is a fair answer. Painters often placed her among cloud swirls, as if she belonged to the sky.',
              ),
            ]),
            o('Every colour at once, with eyes like gold coins.', [
              N('That is a fair answer. “Every colour” is just how the story describes her.'),
            ]),
          ],
          'Imagined and described how to paint the Simurgh, as painters of old Persian books did.',
        ),
      ],
    ),
    sc(
      'a27-03-nest-done',
      [
        N(
          'The chicks pull their beaks back. One of them, the smallest, sits down hard and looks confused.',
        ),
        SI('And these two are your nestmates. We have a large family now. Sit up and make room.'),
      ],
      [
        ask(
          1,
          'sel',
          'what helps a group welcome a newcomer',
          'CASEL: Social awareness',
          [N('The chicks wanted to peck at the stranger. What helps a group welcome a newcomer?')],
          [
            o(
              'Someone speaking up for them, and making room.',
              [
                N(
                  'Yes. The Simurgh spoke up, and she made room. That is how a group learns to welcome someone.',
                ),
              ],
              true,
            ),
            o('Waiting to see if they are useful.', [
              N(
                'A newcomer should not have to earn a place. Speaking up and making room is how groups welcome people.',
              ),
            ]),
            o('Ignoring them.', [
              N('Ignoring someone makes them feel left out. Speaking up and making room helps.'),
            ]),
          ],
          'Thought about what helps a group welcome a newcomer.',
        ),
      ],
    ),
    sc(
      'a27-03-complete',
      [
        N(
          'The chicks shuffle round until there is a gap in the middle, warm and dark and smelling of sandalwood.',
        ),
        N(
          'You and your Nubbin and the baby are squeezed into it together. A wing comes down over all of you, like a blanket.',
        ),
        SI('Sleep. The storm can’t reach up here. Nothing can.', 'soft'),
        N(
          'The baby is asleep before she finishes. Your Nubbin takes longer, because the chick next to it snores.',
        ),
      ],
      [
        ask(
          1,
          'literacy',
          'simile: a wing like a blanket',
          'L.4.5',
          [
            N(
              'The narrator says a wing came down “like a blanket”. What does that comparison tell us about the wing?',
            ),
          ],
          [
            o(
              'It was warm and covering, and made them feel safe.',
              [N('Yes. A blanket covers and keeps us warm and safe, and so does her wing.')],
              true,
            ),
            o('It was heavy and scratchy.', [
              N(
                'A blanket can be heavy, but here the wing is meant to comfort. The comparison is about warmth and safety.',
              ),
            ]),
            o('It was a real blanket.', [
              N('It is a simile: the wing is only compared to a blanket. It is not actually one.'),
            ]),
          ],
          'Explained what a simile, a wing like a blanket, tells us about the wing.',
        ),
      ],
    ),
  ],
  [
    gl('talons', 'The sharp, curved claws of a bird of prey.', 'a27-03-descent'),
    gl(
      'compassion',
      'Kind feeling for someone who is in trouble, with a wish to help.',
      'a27-03-nest',
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
      hint: 'Share out what she brings: the chicks first, then the baby, then yourself.',
    },
    'a27-04-s2': {
      goal: 'Keep the baby warm through the cold night.',
      hint: 'Sit with him under the Simurgh’s wing until morning.',
    },
    'a27-04-s3': {
      goal: 'Stop the chicks sitting on the baby.',
      hint: 'Lift him out of the way whenever a chick backs up to sit down.',
    },
  },
  [
    sc(
      'a27-04-feed',
      [
        N(
          'The Simurgh hunts at dawn and comes back with breakfast for a nest the size of a cottage.',
        ),
        SI(
          'You have hands. I have only a beak. Share it out: the big ones first, or they will take it anyway.',
        ),
        N(
          'She has brought twenty-five figs for the chicks. For the baby she brings honey in the comb and warm goat’s milk, which she will not explain.',
        ),
        N(
          'The chicks eat like a landslide. Your Nubbin watches with great respect, and then tries to keep up.',
        ),
        SI('Feed them before you feed yourself. That is the only rule in this nest.', 'soft'),
        N(
          'When the four chicks have had equal shares, there is one fig left. It is a very small fig.',
        ),
      ],
      [
        ask(
          2,
          'maths',
          'division with remainder: 25 shared among 4',
          '3.OA.A.3',
          [
            N(
              'Twenty-five figs are shared equally among four chicks. How many does each chick get, and how many are left over?',
            ),
          ],
          [
            o(
              '6 each, with 1 left over.',
              [N('Yes. 4 times 6 is 24, so there is 1 fig left: the small one.')],
              true,
            ),
            o('5 each, with 5 left over.', [
              N(
                'If you gave 5 each, 20 figs are used and 5 are left, but the chicks could still have one more each. 6 each, with 1 left.',
              ),
            ]),
            o('7 each.', [
              N('Check: 4 times 7 is 28, which is more than 25. They get 6 each, with 1 left.'),
            ]),
          ],
          'Divided 25 figs among 4 chicks: 6 each with 1 left over.',
        ),
      ],
      [
        ch('eat', 'Eat the fig.', [
          N(
            'You eat it. It is the best fig you have ever had, and the Simurgh brings you two more without a word.',
          ),
        ]),
        ch('share', 'Split it with your Nubbin.', [
          N(
            'Half each. Your Nubbin eats its half in one go and looks at yours with an expression of pure hope.',
          ),
        ]),
        ch('chick', 'Give it to the smallest chick.', [
          N(
            'The smallest chick, who is always last to the figs, takes it very politely and swallows it whole.',
          ),
          SI('You learn quickly. Most guests take years.', 'happy'),
        ]),
      ],
    ),
    sc(
      'a27-04-feed-done',
      [
        N(
          'Your Nubbin is round as an apple and still looking about for more. Living with chicks has given it ideas.',
        ),
      ],
      [
        ask(
          0,
          'social-studies',
          'scarcity means choosing',
          'D2.Eco.1.3-5',
          [
            N(
              'There was only one fig, and three ways to use it. When there is not enough, what is the cost of choosing to eat it yourself?',
            ),
          ],
          [
            o(
              'Someone else does not get it.',
              [
                N(
                  'Yes. That is what scarcity means: when there is not enough, choosing one thing means giving up another.',
                ),
              ],
              true,
            ),
            o('There is no cost.', [
              N('There is a cost. If you eat the fig, the chick or your Nubbin goes without it.'),
            ]),
            o('The fig gets lonely.', [
              N('Ha. The real cost is that someone else does not get it.'),
            ]),
          ],
          'Learned that when something is scarce, choosing it for yourself has a cost to someone else.',
        ),
      ],
    ),
    sc(
      'a27-04-night',
      [
        N(
          'The nights on the peak are cold enough to crack stone. The stars are so close you could knock one off with a stick.',
        ),
        N(
          'The baby sleeps between you and your Nubbin, under the edge of the great wing, with his white hair tucked into your coat.',
        ),
        SI(
          'His father left him at the foot of my mountain, on the bare ground. I saw. I see everything from up here.',
        ),
        SI(
          'A man who could not see past the colour of a child’s hair. Well. I have no use for his eyes.',
          'angry',
        ),
        N(
          'She settles lower over all of you. Her heartbeat is slow and very loud, like a drum heard from the next valley.',
        ),
        SI('This one is mine now, until somebody deserves him.', 'soft'),
      ],
      [
        ask(
          3,
          'science',
          'feathers trap warm air and insulate',
          '4-LS1-1',
          [
            N(
              'On nights like this, frost can form on top of her wings but not underneath. Feathers insulate: they trap a layer of air. What does that air do?',
            ),
          ],
          [
            o(
              'It holds in her body’s warmth.',
              [
                N(
                  'Yes. Air is a poor conductor, so a layer of it stops her body heat from escaping.',
                ),
              ],
              true,
            ),
            o('It makes her colder.', [
              N(
                'No. A trapped layer of air holds warmth in, which is why a coat of feathers keeps a bird warm.',
              ),
            ]),
            o('It makes her heavier.', [N('Air is very light. It holds in her body’s warmth.')]),
          ],
          'Learned that the air trapped in feathers insulates a bird by holding in its body heat.',
        ),
      ],
    ),
    sc(
      'a27-04-night-done',
      [
        N('In the morning there is frost on the outside of her wings, and none at all underneath.'),
        N('The chick beside you snores like a kettle that has been left on.'),
      ],
      [
        ask(
          1,
          'literacy',
          'simile: a heartbeat like a drum heard from the next valley',
          'L.4.5',
          [
            N(
              'Her heartbeat was “like a drum heard from the next valley”. What does that simile tell us about it?',
            ),
          ],
          [
            o(
              'It was slow, deep and steady, and it carried far.',
              [
                N(
                  'Yes. A drum in the distance sounds deep and steady, and it fits a bird so large.',
                ),
              ],
              true,
            ),
            o('It was fast and quiet.', [
              N(
                'The opposite: a distant drum is slow and deep, and her heartbeat is slow and very loud.',
              ),
            ]),
            o('She was carrying a drum.', [
              N('It is a simile: her heart sounds like a drum, but she has no drum.'),
            ]),
          ],
          'Explained what a simile about a heartbeat and a drum tells us.',
        ),
      ],
    ),
    sc(
      'a27-04-sitting',
      [
        N(
          'The chicks love their new brother. They love him so much that they keep trying to sit on him.',
        ),
        N('It is how they show they like something. It is also how they would flatten it.'),
        N(
          'A chick backs up, wriggling its tail feathers, ready to settle right on top of him.',
          'shock',
        ),
        N(
          'You scoop him up just in time. The chick sits on your Nubbin instead, which is less good for your Nubbin.',
        ),
        SI(
          'Ha. They sat on each other for a month before they learned. He will need minding.',
          'happy',
        ),
        N(
          'So you mind him: all day, every day, lifting him out of the way of affectionate chicks the size of ponies.',
        ),
      ],
      [
        ask(
          5,
          'sel',
          'meaning well versus the effect on someone',
          'CASEL: Relationship skills',
          [
            N(
              'The chicks meant well, but sitting on someone hurts. Does meaning well make up for hurting someone? There is no one right answer.',
            ),
          ],
          [
            o('Yes, if it was an accident.', [
              N(
                'That is a fair answer. Accidents are not the same as unkindness, and kind intentions matter.',
              ),
            ]),
            o('No, it still hurts, so we should learn.', [
              N(
                'That is a fair answer. The Simurgh says the chicks must learn, and that is what a caring group does.',
              ),
            ]),
            o('Both: it matters, but so does learning.', [
              N(
                'That is a fair answer. Intentions matter, and so do the effects. Kind friends try to notice both.',
              ),
            ]),
          ],
          'Thought about whether good intentions are enough, and how to learn when we hurt someone by accident.',
        ),
      ],
    ),
    sc(
      'a27-04-sitting-done',
      [
        N(
          'Your Nubbin is pulled out from under the chick slightly flatter than before. It doesn’t seem to bear a grudge.',
        ),
      ],
      [
        ask(
          0,
          'maths',
          'multiply equal groups: 3 times 5 minutes',
          '3.OA.A.3',
          [
            N(
              'A chick sat on your Nubbin three times today, for five minutes each time. For how many minutes was your Nubbin sat on?',
            ),
          ],
          [
            o('15 minutes.', [N('Yes. 3 groups of 5 make 15.')], true),
            o('8 minutes.', [
              N('That adds 3 and 5. There are 3 sits of 5 minutes each, so multiply: 15.'),
            ]),
            o('35 minutes.', [N('Check the sum: 3 times 5 is 15, not 35.')]),
          ],
          'Multiplied 3 sits of 5 minutes each to make 15 minutes.',
        ),
      ],
    ),
    sc(
      'a27-04-complete',
      [
        N(
          'Weeks go by on the peak, and then months. Nobody comes, and nobody calls him anything but “the little one”.',
        ),
        SI('His name is his father’s to give. Until then, he is my chick.'),
        N(
          'The baby learns to crawl in a nest of ebony and sandalwood. His first word is a sound like a bird calling.',
        ),
        N(
          'Your Nubbin teaches him how to clap. He teaches your Nubbin how to eat a whole fig without chewing.',
        ),
      ],
      [
        ask(
          2,
          'science',
          'babies learn speech by copying the sounds around them',
          undefined,
          [N('His first word sounded like a bird call. Why would that be?')],
          [
            o(
              'Babies learn sounds by copying what they hear around them.',
              [
                N(
                  'Yes. A baby who hears birds copies birds. A baby who hears people copies them. That is how everyone learns to speak.',
                ),
              ],
              true,
            ),
            o('He was really a bird.', [
              N(
                'He was a human baby, but the only voices he heard were birds. That is why he copied them.',
              ),
            ]),
            o('He was cold.', [
              N('Cold might make a baby cry, but copying is how babies learn their first words.'),
            ]),
          ],
          'Learned that babies learn speech by copying the sounds they hear around them.',
        ),
      ],
    ),
  ],
  [
    gl(
      'insulate',
      'To stop heat from escaping. Feathers and coats insulate by trapping air.',
      'a27-04-night',
    ),
    gl(
      'scarcity',
      'Not having enough of something, so that we have to choose.',
      'a27-04-feed-done',
    ),
  ],
);

// ================================================================== A27-5 The Youth on the Mountain
const A5: EduQuest = quest(
  'a27-05',
  'The Youth on the Mountain',
  {
    'a27-05-s1': {
      goal: 'Teach the youth some words for things he has never seen.',
      hint: 'Sit with him at the nest’s edge and talk.',
    },
    'a27-05-s2': {
      goal: 'Climb down to the high pass and meet the caravan.',
      hint: 'The caravan road crosses the shoulder of the mountain, below the cloud.',
    },
  },
  [
    sc(
      'a27-05-words',
      [
        N('The page turns over by itself, slowly, like a leaf in no wind. Years go by in it.'),
        N('You and your Nubbin don’t change; atlas pages are like that. The little one does.'),
        N(
          'He is tall now, taller than you, and strong enough to carry a chick under each arm. His hair is still white as frost.',
        ),
        N('He talks like the Simurgh: grand and slow. He has never seen a person except you.'),
        YO(
          'There are words she has but cannot show me. Door. Cup. Market. What is a market?',
          'think',
        ),
        Y('Lots of people, all selling things and shouting.'),
        YO('Shouting. Like the chicks at breakfast. I think I would like a market.', 'happy'),
        YO('Teach me one more word. One she doesn’t use.'),
      ],
      [
        ask(
          5,
          'literacy',
          'English has borrowed Persian words: bazaar, caravan',
          'L.3.4',
          [
            N(
              'The word for market in Persian is bazaar, and English borrowed it. Which of these English words also comes from Persian?',
            ),
          ],
          [
            o(
              'Caravan.',
              [
                N(
                  'Yes. Caravan comes from a Persian word for a group of travellers. We will meet one soon.',
                ),
              ],
              true,
            ),
            o('Hamburger.', [
              N('No. Hamburger comes from the German city of Hamburg. Caravan comes from Persian.'),
            ]),
            o('Pizza.', [N('No. Pizza comes from Italian. Caravan comes from Persian.')]),
          ],
          'Learned that English borrowed bazaar and caravan from Persian.',
        ),
      ],
      [
        ch(
          'friend',
          'Teach him “friend”.',
          [
            Y('Friend. Someone who isn’t family, but stays anyway.'),
            YO('Friend. Then you are my friend. And the small one too.', 'happy'),
            N(
              'In Persian a friend is called dust, which sounds like “doost”. He would have liked that.',
            ),
          ],
          { 'a27-word': 'taught-friend' },
        ),
        ch(
          'home',
          'Teach him “home”.',
          [
            Y('Home. The place you come back to.'),
            YO(
              'Then this is home. I have never gone anywhere to come back from. Perhaps one day.',
              'think',
            ),
          ],
          { 'a27-word': 'taught-home' },
        ),
        ch(
          'sorry',
          'Teach him “sorry”.',
          [
            Y('Sorry. What you say when you have done something wrong, and you wish you hadn’t.'),
            YO('Nobody has ever said it to me. Is that good?', 'think'),
            N('You don’t know what to say to that, so you say nothing.'),
          ],
          { 'a27-word': 'taught-sorry' },
        ),
      ],
    ),
    sc(
      'a27-05-words-done',
      [
        N('He practises the word all afternoon: to the chicks, to the wind, and to your Nubbin.'),
        N('Your Nubbin claps every time.'),
      ],
      [
        ask(
          0,
          'maths',
          'multiply: 6 times an hour for 4 hours',
          '3.OA.A.3',
          [
            N(
              'He says the word six times every hour, for four hours. How many times does he say it?',
            ),
          ],
          [
            o('24 times.', [N('Yes. 4 hours of 6 is 24.')], true),
            o('10 times.', [N('That adds 6 and 4. There are 4 groups of 6, so multiply: 24.')]),
            o('64 times.', [N('Check: 4 times 6 is 24, not 64.')]),
          ],
          'Multiplied 4 hours by 6 times an hour to make 24.',
        ),
      ],
    ),
    sc(
      'a27-05-caravan',
      [
        N(
          'Far below the peak, a road crosses the shoulder of the mountain. Caravans go by on it: camels, bells and dust.',
        ),
        N(
          'The Simurgh sets you down on a ledge above the pass, so you can walk the last of the way like a normal person.',
        ),
        ME(
          'A traveller, up here? Have you seen him? The young man on the peak, with the white hair?',
        ),
        ME(
          'We see him every spring, at the top of the world with a bird bigger than a cloud. We tell it in every town.',
        ),
        ME('Some say he’s a spirit. Some say he’s a prince. My wife says he must be very cold.'),
        N(
          'Your Nubbin, who has had nothing but figs for a very long time, is looking at the merchant’s bread with its whole soul.',
        ),
      ],
      [
        ask(
          2,
          'social-studies',
          'caravans on trade roads carried goods, news and stories',
          'D2.His.2.3-5',
          [
            N(
              'Long ago, caravans crossed Iran along trade routes such as the Silk Road. Besides silk and spices, what else did they carry from town to town?',
            ),
          ],
          [
            o(
              'News, stories and ideas.',
              [
                N(
                  'Yes. Travellers carried stories as well as goods, which is how the tale of the white-haired youth spreads.',
                ),
              ],
              true,
            ),
            o('Nothing else.', [
              N(
                'They carried more. News and stories travelled with every caravan, and still do in this story.',
              ),
            ]),
            o('Only camels.', [
              N(
                'Camels carried the goods, but travellers also carried news, stories and ideas from place to place.',
              ),
            ]),
          ],
          'Learned that caravans on trade routes carried news, stories and ideas, as well as goods.',
        ),
      ],
      [
        ch('prince', '“He’s a prince. He just doesn’t know it yet.”', [
          ME('A prince! I knew it. I will tell them that in Sistan.', 'happy'),
        ]),
        ch('person', '“He’s a person. A kind one.”', [
          ME('A person. Well, that is less exciting, but my wife will be glad.', 'think'),
        ]),
        ch('nothing', 'Smile, and say nothing.', [
          ME('Ah, a secret. Secrets travel even faster than news.', 'happy'),
        ]),
      ],
    ),
    sc(
      'a27-05-caravan-done',
      [
        N(
          'He gives your Nubbin a whole round loaf. It carries it back up the mountain like a crown.',
        ),
        ME('Every caravan from here to the sea will have the story by midsummer. You’ll see.'),
      ],
      [
        ask(
          0,
          'science',
          'camels store fat in their humps',
          '3-LS4-3',
          [
            N(
              'The camels in the caravan can walk for days in the heat. What is stored in a camel’s hump?',
            ),
          ],
          [
            o(
              'Fat.',
              [
                N(
                  'Yes. The hump holds fat, which the camel can use for energy when food is scarce.',
                ),
              ],
              true,
            ),
            o('Water.', [
              N(
                'A common mistake. The hump stores fat, not water. Camels cope with little water in other ways.',
              ),
            ]),
            o('Air.', [N('No. The hump stores fat, which the camel can use for energy.')]),
          ],
          'Learned that a camel’s hump stores fat, which helps it survive long journeys.',
        ),
      ],
    ),
    sc(
      'a27-05-complete',
      [
        N(
          'The story goes down the mountain with the caravans, from town to town, and nobody can stop it.',
        ),
        N(
          'It reaches the green city in the east. It reaches the champion’s house, and the hall, and the man in it.',
        ),
        N(
          'Up in the nest, your Nubbin shares the loaf with four enormous chicks, fairly, smallest first.',
        ),
        N(
          'Somebody has sewn it a little white-crested cap out of chick-down, to match its brother. Nobody admits to it.',
        ),
      ],
      [
        ask(
          1,
          'sel',
          'stories travel; choosing what messages to send',
          'CASEL: Responsible decision-making',
          [
            N(
              'A story can travel across a whole land. If you could send one message to every town, what would it be? There is no one right answer.',
            ),
          ],
          [
            o('Be kind to strangers.', [
              N(
                'That is a fair answer. Kindness to strangers is a message that has crossed many roads.',
              ),
            ]),
            o('Look after the people you love.', [
              N('That is a fair answer. Many old stories carry that message.'),
            ]),
            o('Tell the truth.', [
              N('That is a fair answer. Truth carries a long way, and it keeps stories honest.'),
            ]),
          ],
          'Thought about what message to send if a story could travel to every town.',
        ),
      ],
    ),
  ],
  [
    gl('bazaar', 'A market, with many stalls. The word comes from Persian.', 'a27-05-words'),
    gl(
      'caravan',
      'A group of travellers and pack animals journeying together, often across a desert or over mountains.',
      'a27-05-caravan',
    ),
  ],
);

// ================================================================== A27-6 Sam’s Dream
const A6: EduQuest = quest(
  'a27-06',
  'Sam’s Dream',
  {
    'a27-06-s1': {
      goal: 'Go down to Sistan with the caravan and find the champion’s house.',
      hint: 'Walk with the caravan to the city gate.',
    },
    'a27-06-s2': {
      goal: 'Be in the hall when Sam wakes from his dream.',
      hint: 'Wait by the hall fire through the night.',
    },
    'a27-06-s3': {
      goal: 'Listen to the mobeds, and answer Sam’s question.',
      hint: 'Stand by the fire while the wise men speak.',
    },
  },
  [
    sc(
      'a27-06-return',
      [
        N(
          'You ride down to Sistan with the next caravan, perched on a bale of cotton, to see how the story lands.',
        ),
        N(
          'The champion’s house is the same, only older. So is the old servant at the door, who stares at you.',
        ),
        SV('You. You haven’t changed a hair. And I have gone white as…', 'shock'),
        N('He stops, touches his own white head, and doesn’t finish.'),
        SV('Is it true? What the caravans say? Is he alive?'),
        N(
          'Your Nubbin answers by holding up one end of the merchant’s loaf. Then it remembers, and holds up its white-crested cap instead.',
        ),
      ],
      [
        ask(
          2,
          'science',
          'hair turns grey or white with age as pigment cells slow down',
          undefined,
          [
            N(
              'The old servant’s hair is white because he is old, while the baby’s was white from birth. Why does hair turn white as people age?',
            ),
          ],
          [
            o(
              'The cells that make hair colour slowly make less of it.',
              [
                N(
                  'Yes. As we age, those cells make less melanin, so hair goes grey and then white. Different cause, same colour.',
                ),
              ],
              true,
            ),
            o('Worry makes it go white overnight.', [
              N(
                'A popular story, but no. Hair turns white as the cells that colour it slow down, over years.',
              ),
            ]),
            o('The sun bleaches it.', [
              N(
                'Sun can lighten hair a little, but greying comes from the colour cells slowing down with age.',
              ),
            ]),
          ],
          'Learned that hair turns grey or white with age because its colour-making cells slow down, which is different from being born with pale hair.',
        ),
      ],
      [
        ch('yes', '“He’s alive. He’s taller than you.”', [
          N(
            'The old man sits down on the doorstep, quite suddenly, and puts his face in his hands.',
          ),
          SV('Then I can put him down at last.', 'soft'),
        ]),
        ch('carry', '“You can stop carrying him now.”', [
          SV('Can I? I don’t know how. I will practise.', 'soft'),
        ]),
      ],
    ),
    sc(
      'a27-06-return-done',
      [
        SV(
          'The master doesn’t sleep well. He hasn’t slept well in years. Stay tonight. Something is coming; I feel it in my knees.',
        ),
      ],
      [
        ask(
          0,
          'maths',
          'multiply: 3 years of 12 months',
          '3.OA.A.3',
          [
            N(
              'Sam has slept badly for three years. There are twelve months in a year. How many months is that?',
            ),
          ],
          [
            o('36 months.', [N('Yes. 3 groups of 12 make 36.')], true),
            o('15 months.', [
              N('That adds 3 and 12. There are 3 years of 12 months each, so multiply: 36.'),
            ]),
            o('312 months.', [N('Check: 3 times 12 is 36, not 312.')]),
          ],
          'Multiplied 3 years by 12 months to make 36 months.',
        ),
      ],
    ),
    sc(
      'a27-06-dream',
      [
        N(
          'In the middle of the night there is a shout from Sam’s room, and the sound of a man getting up too fast.',
        ),
        N(
          'He comes into the hall with a lamp. His beard is grey now, nearly white, though he hasn’t noticed.',
        ),
        SA(
          'I dreamed. A man on an Arab horse rode up to me, and spoke to me as if I were a servant.',
          'shock',
        ),
        RI(
          'You threw away your son for his white hair. Look in a mirror, champion. Your own beard is as white as a poplar.',
          'angry',
        ),
        RI('A bird is raising your child. Is that what you call being a father?'),
        SA('Then he woke me. Or I woke. I don’t know which.', 'sad'),
      ],
      [
        ask(
          3,
          'literacy',
          'what a character’s words tell another character to do',
          'RL.3.3',
          [
            N(
              'The rider tells Sam to look in a mirror. What is the rider really telling Sam he must do?',
            ),
          ],
          [
            o(
              'Look at himself honestly, and see that he was wrong.',
              [
                N(
                  'Yes. Sam’s own beard is white too. The rider wants him to see his mistake and put it right.',
                ),
              ],
              true,
            ),
            o('Comb his beard.', [
              N('Ha. His beard is fine. The rider wants Sam to look honestly at what he did.'),
            ]),
            o('Buy a better mirror.', [
              N('The mirror is a way of saying: look at yourself, and see that you were wrong.'),
            ]),
          ],
          'Worked out what the dream rider’s words about a mirror tell Sam he must do.',
        ),
      ],
    ),
    sc(
      'a27-06-dream-done',
      [SA('Call the mobeds, the wise priests. All of them. Now, before I lose my nerve.')],
      [
        ask(
          0,
          'sel',
          'it takes courage to say “I was wrong”',
          'CASEL: Self-awareness',
          [
            N(
              'Sam has to face that he was wrong. Why might it take courage to say “I was wrong”? There is no one right answer.',
            ),
          ],
          [
            o('Because people might think less of us.', [
              N(
                'That is a fair answer. Fear of what others think holds many of us back, and being honest anyway takes courage.',
              ),
            ]),
            o('Because we have to face what we did.', [
              N('That is a fair answer. Looking straight at our own mistake is the hardest part.'),
            ]),
            o('Because it might not be forgiven.', [
              N(
                'That is a fair answer. Saying sorry with no promise of forgiveness takes a lot of heart.',
              ),
            ]),
          ],
          'Thought about why it takes courage to admit being wrong.',
        ),
      ],
    ),
    sc(
      'a27-06-mobeds',
      [
        N(
          'The mobeds, the wise men and priests, come in white robes, half asleep and wholly serious. Sam tells them the dream.',
        ),
        SA('Could it be him? After all this time?'),
        MO('My lord, the wild beasts look after their young. Even the lion. Even the crocodile.'),
        MO(
          'You turned your own child out because of the white hair his Maker gave him. That was the wrong, not the hair.',
        ),
        MO('Go and find your son. And when you find him, ask him to forgive you.'),
        N('Sam bows his head. Then he looks up, round the hall, and sees you by the fire.'),
        SA(
          'You. You were here the night he was born. Is he alive? Tell me the truth. I can bear the truth.',
          'think',
        ),
      ],
      [
        ask(
          3,
          'science',
          'animal parents care for their young: crocodiles carry hatchlings in their mouths',
          '4-LS1-1',
          [
            N(
              'The mobed says even a crocodile looks after its young. How does a mother crocodile carry her hatchlings to the water?',
            ),
          ],
          [
            o(
              'Gently, in her mouth.',
              [
                N(
                  'Yes. Her jaws are enormously strong, yet she carries hatchlings in her mouth without hurting them.',
                ),
              ],
              true,
            ),
            o('On her back.', [N('Not quite. She carries them in her mouth, very gently.')]),
            o('She leaves them to find it.', [
              N(
                'Hatchlings can find water, but the mother often helps, carrying them gently in her mouth.',
              ),
            ]),
          ],
          'Learned that animal parents care for their young, such as a mother crocodile carrying hatchlings gently in her mouth.',
        ),
      ],
      [
        ch('alive', '“He’s alive. He’s the best person I know.”', [
          N(
            'Sam closes his eyes. When he opens them they are wet, and he isn’t ashamed of it, which is new.',
          ),
          SA('Then I don’t deserve him. Good. I will start from there.', 'soft'),
        ]),
        ch('see', '“Go and see for yourself.”', [
          SA('Yes. Yes, that’s right. I should have to climb for it.', 'think'),
        ]),
        ch('hair', '“His hair is still white. Will you mind?”', [
          SA('Mind?', 'sad'),
          N(
            'He looks at his reflection in the lamp’s brass, at the white in his own beard, for a long moment.',
          ),
          SA('No. I won’t mind. I should never have minded.', 'soft'),
        ]),
      ],
    ),
    sc(
      'a27-06-mobeds-done',
      [
        SA('Sound the drums. We march for the Alborz at first light.'),
        N(
          'You don’t wait for the drums. You and your Nubbin are out of the gate before they start, running for the mountain.',
        ),
      ],
      [
        ask(
          1,
          'maths',
          'number patterns with a rule: add 5',
          '4.OA.C.5',
          [
            N(
              'The army marches in rows: 5 soldiers in the first row, 10 in the second, 15 in the third. If the rule continues, how many in the eighth row?',
            ),
          ],
          [
            o(
              '40.',
              [
                N(
                  'Yes. The rule is add 5 each time, so the eighth row has 8 times 5, which is 40.',
                ),
              ],
              true,
            ),
            o('35.', [N('That is the seventh row. The eighth adds 5 more: 40.')]),
            o('45.', [N('That is the ninth row. The eighth is 40.')]),
          ],
          'Continued a number pattern with the rule add 5, up to the eighth term.',
        ),
      ],
    ),
    sc(
      'a27-06-complete',
      [
        N('At the foot of the high rocks you stop, out of breath, and look up into the cloud.'),
        N(
          'A shadow goes over. The Simurgh comes down, looks at you with one gold eye, and seems to know everything already.',
        ),
        SI('You went down to see the story land. Did it?'),
        Y('He’s coming. With an army.'),
        SI('Then I had better put the kettle on.', 'think'),
        N('She doesn’t have a kettle. You suspect she knows that.'),
      ],
      [
        ask(
          5,
          'literacy',
          'idiom: put the kettle on, with a joke',
          'L.4.5',
          [
            N(
              '“Put the kettle on” is an old British saying. What does it mean, and what is the joke?',
            ),
          ],
          [
            o(
              'Get ready for visitors; she has no kettle.',
              [
                N(
                  'Yes. It means settle in and be ready for guests. The joke is that a giant bird has no kettle at all.',
                ),
              ],
              true,
            ),
            o('Boil water; she really has a kettle.', [
              N(
                'The text says she doesn’t. It is a saying, and the joke is that a bird of her size has no kettle.',
              ),
            ]),
            o('Go away.', [N('The opposite: it means get ready to welcome guests.')]),
          ],
          'Explained the idiom put the kettle on, and why it is funny coming from the Simurgh.',
        ),
      ],
    ),
  ],
  [
    gl(
      'mobed',
      'A wise man and priest of the old Persian faith, called Zoroastrianism, which people still follow today.',
      'a27-06-dream-done',
    ),
    gl(
      'simile',
      'A comparison that uses “as” or “like”, such as “as white as snow”.',
      'a27-06-dream',
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
      hint: 'Lie flat at the nest’s edge and look down through the gap in the cloud.',
    },
    'a27-07-s2': {
      goal: 'Watch Sam try to climb, and see him pray.',
      hint: 'Keep watching the man at the front of the army.',
    },
  },
  [
    sc(
      'a27-07-army',
      [
        N(
          'Three days later, the cloud below the nest thins, and through the gap you can see the foot of the Alborz.',
        ),
        N(
          'There is an army there. Tents, banners, horses, the glint of spears, all very small and very busy.',
        ),
        YO('What are those? Ants? They have flags.', 'think'),
        Y('People. A lot of people.'),
        YO('So many. Are they all shouting? Is it a market?', 'shock'),
        N(
          'He lies flat at the edge of the nest beside you, chin on his hands, and stares and stares.',
        ),
      ],
      [
        ask(
          3,
          'maths',
          'multiply: 8 rows of 6 tents',
          '3.OA.A.3',
          [N('The tents stand in 8 rows of 6. How many tents is that?')],
          [
            o('48.', [N('Yes. 8 groups of 6 make 48.')], true),
            o('14.', [N('That adds 8 and 6. There are 8 rows of 6, so multiply: 48.')]),
            o('86.', [N('Check: 8 times 6 is 48, not 86.')]),
          ],
          'Multiplied 8 rows by 6 tents to count 48 tents.',
        ),
      ],
    ),
    sc(
      'a27-07-army-done',
      [
        YO(
          'I didn’t know there were this many. I thought there was you, and then her, and then the chicks.',
          'soft',
        ),
      ],
      [
        ask(
          0,
          'sel',
          'big new experiences can bring mixed feelings',
          'CASEL: Self-awareness',
          [
            N(
              'The youth has met only a handful of living creatures, and now sees an army. How might that feel? There is no one right answer.',
            ),
          ],
          [
            o('Excited and a bit scared at once.', [
              N(
                'That is a fair answer. Mixed feelings are very common when something is new and big.',
              ),
            ]),
            o('Small, but curious.', [
              N(
                'That is a fair answer. Feeling small is natural at first, and curiosity helps us look closer.',
              ),
            ]),
            o('Lonely for the nest.', [
              N('That is a fair answer. Missing what we know is part of every big change.'),
            ]),
          ],
          'Thought about the mixed feelings that come with something big and new.',
        ),
      ],
    ),
    sc(
      'a27-07-foot',
      [
        N(
          'One man comes out in front of the army and starts to climb. He is big, and strong, and he gets nowhere.',
        ),
        N(
          'The rocks are sheer. He tries one way, and then another, and then he slides back to the bottom.',
        ),
        N('He tries again, and the army watches him. Nobody laughs, and that is something.'),
        N(
          'Then he stops trying. He kneels on the stones at the foot of the mountain, and bows his head, and prays.',
        ),
        N(
          'He doesn’t shout. He prays the way people pray when they have nothing left to bargain with.',
          'soft',
        ),
        N(
          'You see him first, before the Simurgh, before the youth. A man with white in his own beard.',
        ),
        N('Nobody has ever been sorrier at the bottom of anything.'),
      ],
      [
        ask(
          2,
          'social-studies',
          'Sistan is a region in Iran and Afghanistan',
          'D2.Geo.2.3-5',
          [
            N(
              'Sam was the champion of Sistan. Today, Sistan is a region in two countries. Which two?',
            ),
          ],
          [
            o(
              'Iran and Afghanistan.',
              [
                N(
                  'Yes. The Sistan region lies in south-eastern Iran and south-western Afghanistan.',
                ),
              ],
              true,
            ),
            o('Iran and India.', [
              N('Not India. Sistan lies in south-eastern Iran and south-western Afghanistan.'),
            ]),
            o('Iran and Egypt.', [
              N('Not Egypt. Sistan lies in south-eastern Iran and south-western Afghanistan.'),
            ]),
          ],
          'Learned that the region of Sistan lies in south-eastern Iran and south-western Afghanistan.',
        ),
      ],
      [
        ch('point', 'Point him out.', [
          Y('That one. The one kneeling.'),
          YO(
            'He looks sad. Why would anyone be sad at the bottom of a mountain? They could just go home.',
            'think',
          ),
        ]),
        ch('quiet', 'Say nothing yet. It isn’t your news.', [
          N(
            'You keep it to yourself. The youth watches the kneeling man without knowing why he can’t stop watching.',
          ),
        ]),
      ],
    ),
    sc(
      'a27-07-foot-done',
      [
        N(
          'Behind you, the whole nest tilts. The Simurgh has come to the edge, and is looking down.',
        ),
      ],
      [
        ask(
          0,
          'literacy',
          'vocabulary: to bargain',
          'L.3.4',
          [
            N(
              'Sam prayed like someone with “nothing left to bargain with”. What does to bargain mean?',
            ),
          ],
          [
            o(
              'To trade or argue for a deal.',
              [N('Yes. Sam has nothing left to offer in exchange, so he can only ask humbly.')],
              true,
            ),
            o('To run away.', [N('No. To bargain is to trade or argue for a deal.')]),
            o('To shout.', [N('No. To bargain is to trade or argue for a deal. Sam is quiet.')]),
          ],
          'Learned that to bargain means to trade or argue for a deal.',
        ),
      ],
    ),
    sc(
      'a27-07-complete',
      [
        N('She looks down for a long time. Her feathers lift, and settle, and lift.'),
        SI(
          'So. He has come to the bottom of my mountain, on his knees. That is the right way to come.',
          'soft',
        ),
        N(
          'She doesn’t look at the youth. She looks at you, and you understand that she has known this day was coming since the storm.',
        ),
        SI('Sit with me a moment, little stranger. Then I must tell him.', 'sad'),
      ],
      [
        ask(
          0,
          'science',
          'birds fluff their feathers to trap warm air, and to show how they feel',
          '4-LS1-1',
          [
            N(
              'The Simurgh’s feathers lift and settle. Birds fluff up their feathers for more than one reason. What is one?',
            ),
          ],
          [
            o(
              'To trap warm air and keep warm.',
              [
                N(
                  'Yes. Fluffed feathers trap more air. Birds also fluff up when they are excited or upset, which is what the Simurgh is doing now.',
                ),
              ],
              true,
            ),
            o('To clean their teeth.', [
              N(
                'Birds have no teeth. They fluff their feathers to trap warm air, and when they have strong feelings.',
              ),
            ]),
            o('To get taller for a photo.', [
              N(
                'Ha. No photos in the Alborz. They fluff to trap warm air, and when they have strong feelings.',
              ),
            ]),
          ],
          'Learned that birds fluff their feathers to trap warm air, and when they feel strongly.',
        ),
      ],
    ),
  ],
  [
    gl(
      'humble',
      'Not proud or boastful about yourself. The youth bows low, as the Simurgh did.',
      'a27-11-praise',
    ),
    gl('bargain', 'To trade or argue for a deal.', 'a27-07-foot'),
  ],
);

// ================================================================== A27-8 The Feather
const A8: EduQuest = quest(
  'a27-08',
  'The Feather',
  {
    'a27-08-s1': {
      goal: 'Be there when the Simurgh tells him.',
      hint: 'Sit at the nest’s edge with the youth and the Simurgh.',
    },
    'a27-08-s2': {
      goal: 'Stay with the youth while he decides.',
      hint: 'What you do here matters for a long time.',
    },
  },
  [
    sc(
      'a27-08-telling',
      [
        N(
          'The Simurgh folds her wings and sits down beside the youth, as low as she can make herself, which is not very low.',
        ),
        SI(
          'You have shared this nest with me since you were small enough to sit in my footprint. I have been a mother to you.',
        ),
        SI(
          'Your father put you out. Now he has come back for you. The man on his knees down there is Sam, the champion.',
        ),
        SI('The hour has come for us to part. I must give you back to your people.', 'sad'),
        N(
          'The youth looks at her, and then down through the gap in the cloud, at the small kneeling man.',
        ),
        YO('My father?', 'shock'),
      ],
      [
        ask(
          1,
          'maths',
          'convert metres to centimetres, then divide',
          '4.MD.A.1',
          [
            N(
              'Her footprint is 2 metres long. The baby was about 50 centimetres long. How many babies end to end would fit in one footprint?',
            ),
          ],
          [
            o('4.', [N('Yes. 2 metres is 200 centimetres, and 200 divided by 50 is 4.')], true),
            o('2.', [
              N('Check the units first. 2 metres is 200 centimetres, and 200 divided by 50 is 4.'),
            ]),
            o('40.', [N('Too many. 2 metres is 200 centimetres, and 200 divided by 50 is 4.')]),
          ],
          'Converted 2 m to 200 cm and divided by 50 cm to find that 4 babies fit.',
        ),
      ],
    ),
    sc(
      'a27-08-telling-done',
      [
        N(
          'The chicks have gone quiet. Even the smallest one has stopped eating, which has never happened before.',
        ),
      ],
      [
        ask(
          0,
          'sel',
          'saying goodbye: sooner or later?',
          'CASEL: Self-management',
          [
            N(
              'The Simurgh tells him straight away, and does not wait. When someone we love must leave, is it kinder to say goodbye early or late? There is no one right answer.',
            ),
          ],
          [
            o('Early, so there is time to say everything.', [
              N('That is a fair answer. Time to prepare can make a goodbye gentler.'),
            ]),
            o('Late, so we have longer together before it hurts.', [
              N('That is a fair answer. Many people feel that way, and it is a loving thought.'),
            ]),
            o('Whenever the person is ready.', [
              N('That is a fair answer. Being ready matters, and so does honesty.'),
            ]),
          ],
          'Thought about when it is kindest to say goodbye.',
        ),
      ],
    ),
    sc(
      'a27-08-feather',
      [
        YO(
          'Are you tired of me? Have I grown too big for the nest? I can be smaller. I can eat less.',
          'sad',
        ),
        SI(
          'I don’t send you away because I don’t want you. I would keep you beside me always.',
          'soft',
        ),
        SI(
          'But another life is better for you. Go down and see the world, my son, and find your own way in it.',
        ),
        N('Tears run down his face. Apart from you, he has never met a single person.'),
        N(
          'She bends her head, and pulls one feather from her breast, and lays it in his hands. It is grey and gold, as long as his arm.',
        ),
        SI('Keep this, so that you remember the one who sheltered you, wherever you go.'),
        SI('When you are in real need, put it in the fire, and I will come to you at once.'),
        N('He holds the feather against his chest, and doesn’t move. He looks at you.'),
      ],
      [
        ask(
          6,
          'social-studies',
          'objects that carry memories',
          'D2.His.2.3-5',
          [
            N(
              'A feather from her breast is something to remember her by, a keepsake. Why do people keep objects to remember others? There is no one right answer.',
            ),
          ],
          [
            o('Because holding it brings the person closer.', [
              N('That is a fair answer. A keepsake can feel like a small piece of someone.'),
            ]),
            o('Because memories can fade, and objects help.', [
              N('That is a fair answer. A keepsake reminds us of stories we might forget.'),
            ]),
            o('Because it shows we were loved.', [
              N('That is a fair answer. A gift from someone who loved us is proof that we were.'),
            ]),
          ],
          'Thought about why people keep objects, keepsakes, to remember those they love.',
        ),
      ],
      [
        ch(
          'told',
          'Tell him his father came back, and he should go.',
          [
            Y(
              'He came back. Nobody made him. He climbed as far as he could, and then he knelt down.',
            ),
            Y(
              'You should go to him. You have waited your whole life without knowing you were waiting.',
            ),
            YO('He came back.', 'think'),
            N('He says it again, quietly, trying out the shape of it. Then he stands up.'),
          ],
          { 'a27-feather': 'told' },
        ),
        ch(
          'sat',
          'Sit with him, and say nothing until he’s ready.',
          [
            N(
              'You sit down next to him at the nest’s edge, close enough for your shoulders to touch, and you don’t say anything at all.',
            ),
            N('The wind goes by, and the chicks shuffle. Your Nubbin leans on his other side.'),
            N('It takes a long time. You let it take a long time.'),
            N('Then, by himself, he stands up.', 'soft'),
          ],
          { 'a27-feather': 'sat' },
        ),
        ch(
          'night',
          'Ask the Simurgh to make Sam wait one more night.',
          [
            Y('Can he have one more night? Just one. In the nest. Then he will go.'),
            SI('One more night.', 'think'),
            SI('Yes. He left you here for years. One night more won’t hurt him.', 'soft'),
            N(
              'That night the youth sleeps in the middle of the chicks, under her wing, with the feather in his fist. In the morning, he stands up.',
            ),
          ],
          { 'a27-feather': 'night' },
        ),
      ],
    ),
    sc(
      'a27-08-feather-done',
      [
        YO(
          'I’ll go. But I am coming back to see you. And the chicks. All of them, even the one who snores.',
          'soft',
        ),
        SI('I know you will. Keep the feather dry.'),
      ],
      [
        ask(
          1,
          'science',
          'fire needs fuel, heat and air; fire safety',
          undefined,
          [
            N(
              'The feather is for burning on the day of need, so it must stay dry. What three things does a fire need? (Fire is dangerous, so only grown-ups light one.)',
            ),
          ],
          [
            o(
              'Fuel, heat and air.',
              [
                N(
                  'Yes. Take away any one of the three and a fire goes out. A wet feather would be poor fuel, which is why she says to keep it dry.',
                ),
              ],
              true,
            ),
            o('Fuel, water and wind.', [
              N('Water puts fires out. The three things are fuel, heat and air.'),
            ]),
            o('Sun, wood and sand.', [
              N(
                'Wood is a fuel, but sun and sand are not what a fire needs. The three needs are fuel, heat and air.',
              ),
            ]),
          ],
          'Learned that a fire needs fuel, heat and air, and that only grown-ups should light one.',
        ),
      ],
    ),
    sc(
      'a27-08-complete',
      [
        N(
          'The youth goes round the nest and says goodbye to each chick in turn. The smallest tries to sit on him, for old times’ sake.',
        ),
        N(
          'You say goodbye too. The nest has been your home for longer than you can count, and you have no words for it.',
        ),
        SI(
          'You were a foundling too, little stranger. Take something of the nest home with you.',
          'soft',
        ),
        N(
          'She weaves you a great round nest out of the branches nobody uses: ebony, sandalwood and aloe, big enough for a family.',
        ),
        N('Your Nubbin climbs in to test it, and has to be lifted out again by the scruff.'),
      ],
      [
        ask(
          3,
          'maths',
          'two steps: add everyone in the nest, then take away three',
          '3.OA.D.8',
          [
            N(
              'The nest holds 4 chicks, plus the youth, you and your Nubbin. When the three of you go down, how many are left?',
            ),
          ],
          [
            o(
              '4.',
              [N('Yes. 4 and 3 make 7 in the nest. 7 take away 3 is 4: the four chicks.')],
              true,
            ),
            o('6.', [
              N('That takes away only the youth. 4 and 3 make 7, and 7 take away all 3 is 4.'),
            ]),
            o('10.', [N('Nobody joins. 4 and 3 make 7, and 7 take away 3 is 4.')]),
          ],
          'Added to find 7 in the nest, then subtracted 3 to find 4 left.',
        ),
      ],
    ),
  ],
  [
    gl('keepsake', 'A small thing you keep to remember someone by.', 'a27-08-feather'),
    gl('fuel', 'Something that burns to make heat and light, such as wood.', 'a27-08-feather-done'),
  ],
);

// ================================================================== A27-9 Father and Son
const A9: EduQuest = quest(
  'a27-09',
  'Father and Son',
  {
    'a27-09-s1': {
      goal: 'Go down the mountain with the youth.',
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
        N(
          'The Simurgh carries you both down through the cloud, one in each set of talons, the way she brought you up.',
        ),
        N(
          'She sets you down on the slope above the army, a little way off, and goes back up to the edge of the cloud to watch.',
        ),
        N('Sam is still on his knees at the bottom. He hears the stones move, and looks up.'),
        N(
          'The youth starts walking, and then walking faster. For the last of it, he runs.',
          'happy',
        ),
        N(
          'He stops right in front of his father, out of breath, the feather held to his chest. He has never stood this close to anyone but you.',
        ),
        YO('You came back for me.'),
        N(
          'Sam can’t say anything at all. He just nods, again and again, like someone who has forgotten how to stop.',
        ),
      ],
      [
        ask(
          6,
          'sel',
          'forgiving quickly or making someone earn it',
          'CASEL: Relationship skills',
          [
            N(
              'The youth runs to his father at once. Is it right to forgive quickly, or should someone earn it first? There is no one right answer.',
            ),
          ],
          [
            o('Forgive quickly, if they are truly sorry.', [
              N('That is a fair answer. Forgiveness can lift a weight off both people.'),
            ]),
            o('Take time first, so the sorry is real.', [
              N('That is a fair answer. Time can show whether the sorry will last.'),
            ]),
            o('Forgive, but remember what happened.', [
              N(
                'That is a fair answer. We can forgive and still be careful, and Zal does remember.',
              ),
            ]),
          ],
          'Thought about forgiving quickly versus making someone earn forgiveness.',
        ),
      ],
    ),
    sc(
      'a27-09-descent-done',
      [
        N(
          'Your Nubbin arrives last, rolling the final bit of the slope, and comes to a stop against Sam’s boot.',
        ),
      ],
      [
        ask(
          0,
          'science',
          'gravity pulls things downhill',
          '3-PS2-1',
          [
            N(
              'Your Nubbin rolls all the way down the slope without anyone pushing it. Which force pulls things downhill?',
            ),
          ],
          [
            o(
              'Gravity.',
              [
                N(
                  'Yes. Gravity pulls everything towards the Earth. On a slope nothing balances that pull, so the Nubbin rolls until something stops it: Sam’s boot.',
                ),
              ],
              true,
            ),
            o('Magnetism.', [
              N('Magnets pull on some metals, but it is gravity that pulls everything downhill.'),
            ]),
            o('Wind.', [
              N('Wind can push things, but the pull that makes things roll downhill is gravity.'),
            ]),
          ],
          'Learned that gravity pulls objects down a slope, an unbalanced force.',
        ),
      ],
    ),
    sc(
      'a27-09-oath',
      [
        N(
          'Sam stands up. He bows, very low, to the great bird at the edge of the cloud, and thanks her with his whole voice.',
        ),
        N(
          'Then he looks at his son properly: tall and strong and handsome, with white hair, and nothing wrong in him at all.',
        ),
        SA(
          'I was wrong. I was a coward, and I was wrong, and there is nothing I can say that makes it smaller.',
          'sad',
        ),
        SA('Open your heart to me if you can. I won’t ask for more than you can give.'),
        SA(
          'I swear it, before the one who made us both: my heart will never be closed to you again.',
        ),
        SA('And I will give you anything you ever ask of me.'),
        N(
          'He gives his son a name: Zal, which means the old one, for the white hair. This time, he says it with pride.',
        ),
        ZA('Zal. I like it. It sounds like a door shutting on the right side.', 'happy'),
      ],
      [
        ask(
          6,
          'literacy',
          'theme: the same feature can be shame or pride',
          'RL.4.2',
          [
            N(
              'At first Sam was ashamed of the white hair. Now he gives the name Zal, “the old one”, with pride. What does this show?',
            ),
          ],
          [
            o(
              'The same thing can feel like shame or pride, depending on how people choose to see it.',
              [N('Yes. Nothing about the hair changed. What changed was how Sam saw it.')],
              true,
            ),
            o('Names do not matter.', [
              N('In this story the name matters a lot. It turns the shame into pride.'),
            ]),
            o('The hair turned black.', [N('It is still white. What changed was how Sam saw it.')]),
          ],
          'Explored a theme: how choosing to see something differently can turn shame into pride.',
        ),
      ],
      [
        ch('clap', 'Clap.', [
          N(
            'You clap, and your Nubbin claps. After a moment, uncertainly, so does the whole army.',
          ),
        ]),
        ch('bow', 'Bow to Zal.', [
          ZA('You don’t bow to me. You are my nestmate. Stand up.', 'happy'),
        ]),
      ],
    ),
    sc(
      'a27-09-oath-done',
      [
        N(
          'They dress Zal in fine clothes: silk, a belt with gold on it, boots. He walks in the boots like a heron on ice.',
        ),
      ],
      [
        ask(
          0,
          'maths',
          'measure and subtract lengths in centimetres',
          '4.MD.A.1',
          [
            N(
              'The tailor’s belt is 95 centimetres long. A metre is 100 centimetres. How much shorter than a metre is the belt?',
            ),
          ],
          [
            o('5 cm.', [N('Yes. 100 take away 95 is 5.')], true),
            o('15 cm.', [N('Check the subtraction: 100 minus 95 is 5.')]),
            o('195 cm.', [N('That would be adding. We want the difference: 100 minus 95 is 5.')]),
          ],
          'Subtracted 95 cm from 100 cm to find the belt is 5 cm short of a metre.',
        ),
      ],
    ),
    sc(
      'a27-09-road',
      [
        N(
          'The army goes home to Sistan with drums and trumpets and cymbals, all the way, so that every village knows.',
        ),
        N(
          'Zal rides at the front beside his father. You ride on the baggage, on a heap of tent poles, with your Nubbin in your lap.',
        ),
        ZA('It is very loud. Is the world always this loud?', 'think'),
        SA('Only when it’s happy.', 'happy'),
        N(
          'The old servant walks beside the baggage, holding the bridle of the mule, and is the quietest man in the army.',
        ),
        N(
          'Behind you, high above the cloud, a great bird turns once in the sky, and turns again, and goes home.',
          'soft',
        ),
      ],
      [
        ask(
          3,
          'music',
          'sound is made by vibrations, which travel through the air',
          '4-PS3-2',
          [N('A drum is loud enough to hear in every village. How does a drum make sound?')],
          [
            o(
              'The drum skin vibrates, and the vibrations travel through the air.',
              [
                N(
                  'Yes. Hit the skin and it shakes, and the shaking pushes the air, so the sound travels to your ears.',
                ),
              ],
              true,
            ),
            o('The drum glows.', [
              N(
                'A drum makes no light. Its skin vibrates, and the vibrations travel through the air as sound.',
              ),
            ]),
            o('The drum talks to the army.', [
              N(
                'Ha. In a way, but the real answer is vibration: the skin shakes and the air carries the sound.',
              ),
            ]),
          ],
          'Learned that sound comes from vibrations, as when a drum skin shakes.',
        ),
      ],
    ),
    sc(
      'a27-09-road-done',
      [
        N(
          'Sistan has heard. The city is hung with cloth and flowers, and everyone wants to see the white-haired prince.',
        ),
      ],
      [
        ask(
          0,
          'art',
          'repeating patterns on decorated cloth',
          '4.OA.C.5',
          [
            N(
              'A festival banner repeats this pattern: red, gold, gold, red, gold, gold, and so on. What colour is the tenth stripe?',
            ),
          ],
          [
            o('Red.', [N('Yes. Red falls on every third stripe: 1st, 4th, 7th, 10th.')], true),
            o('Gold.', [
              N(
                'Gold fills the 2nd, 3rd, 5th, 6th and so on. The 10th is red, since red falls on 1, 4, 7, 10.',
              ),
            ]),
            o('Blue.', [N('Blue is not in the pattern. The 10th stripe is red.')]),
          ],
          'Continued a repeating three-stripe pattern to find the tenth stripe.',
        ),
      ],
    ),
    sc(
      'a27-09-complete',
      [
        N(
          'At the gate the people throw flowers and blessings, and Zal catches a rose, and doesn’t know what to do with it.',
        ),
        N(
          'Your Nubbin knows: it eats it. Zal laughs so hard that he has to hold on to his father’s arm.',
        ),
        SA('You laugh with your whole self. I had forgotten people could.', 'soft'),
        ZA('The chicks taught me. They do everything with their whole selves.', 'happy'),
        N('Sam takes his son by the arm, and they go in together.'),
      ],
      [
        ask(
          2,
          'sel',
          'mixed feelings: joy with sorrow for lost time',
          'CASEL: Social awareness',
          [
            N(
              'Sam says he had forgotten that people could laugh like that. What feelings might be mixed in his voice?',
            ),
          ],
          [
            o(
              'Joy, and sadness for the years he lost.',
              [
                N(
                  'Yes. He is delighted now, and sorry about the time he missed. Both feelings can be true together.',
                ),
              ],
              true,
            ),
            o('Only anger.', [
              N('There is no anger here. His voice is soft, and mixed with joy and regret.'),
            ]),
            o('Only boredom.', [
              N('Not boredom. Sam is moved, with joy and regret mixed together.'),
            ]),
          ],
          'Noticed mixed feelings, joy and regret, in a character’s words.',
        ),
      ],
    ),
  ],
  [
    gl(
      'oath',
      'A very serious promise, often made in front of someone you respect.',
      'a27-09-oath',
    ),
    gl('vibration', 'A quick shaking back and forth. Vibrations make sound.', 'a27-09-road'),
  ],
);

// ================================================================== A27-10 The Shah’s Court
const A10: EduQuest = quest(
  'a27-10',
  'The Shah’s Court',
  {
    'a27-10-s1': {
      goal: 'Go with Sam and Zal to the Shah’s court.',
      hint: 'Walk behind Zal into the hall of audience.',
    },
    'a27-10-s2': {
      goal: 'Help Zal get through his first banquet.',
      hint: 'Neither of you knows the rules. Watch the others, and copy.',
    },
    'a27-10-s3': {
      goal: 'Sit with Zal while he hears petitions in Sistan.',
      hint: 'Stand at his shoulder in the hall and listen.',
    },
  },
  [
    sc(
      'a27-10-court',
      [
        N(
          'The Shah has heard the news, and sends for them both. The court is all carpets, lamps and very straight backs.',
        ),
        N(
          'Manuchehr sits on his throne with his crown on. Sam kneels and tells him everything, and doesn’t leave out the bad part.',
        ),
        SH('Bring the young man in.'),
        N(
          'Zal comes in, in his silk, with his white hair brushed. The whole court goes still to look at him.',
        ),
        SH('Champion, look after this one. Guard him for Iran.', 'think'),
        SH(
          'And teach him our ways: war, and feasting, and manners. How should someone raised in a nest know any of them?',
        ),
        N(
          'Zal bows, exactly as low as the Simurgh used to bow her head to him. It is not the court’s bow, and it is perfect.',
        ),
      ],
      [
        ask(
          6,
          'social-studies',
          'manners show respect, and differ between cultures',
          'D2.Civ.8.3-5',
          [
            N(
              'Zal’s bow is not the court’s bow, yet it is perfect. Why do cultures have rules of manners?',
            ),
          ],
          [
            o(
              'They show respect and help people get along.',
              [N('Yes. Manners differ from place to place, but they all say “I respect you”.')],
              true,
            ),
            o('To make life harder.', [
              N(
                'Manners can feel like that, but they exist to show respect and help people get along.',
              ),
            ]),
            o('Only kings need manners.', [
              N('Everyone uses manners. They show respect and help people get along.'),
            ]),
          ],
          'Thought about why cultures have manners: they show respect and help people get along.',
        ),
      ],
    ),
    sc(
      'a27-10-court-done',
      [
        N(
          'The Shah calls his star-readers. They read Zal’s stars, and say he will be brave and wise.',
        ),
        SH(
          'Good. I could have told them that by looking at him. But it’s nice to have it in writing.',
          'happy',
        ),
      ],
      [
        ask(
          1,
          'science',
          'we see different stars in different seasons because Earth moves round the Sun',
          '5-ESS1-2',
          [
            N(
              'Long ago, people watched the stars to tell the seasons. Why do we see different stars in winter and summer?',
            ),
          ],
          [
            o(
              'Earth travels round the Sun, so at night we face a different part of the sky.',
              [
                N(
                  'Yes. As the year goes round, the night side of Earth faces different stars, which is why stars were used as a calendar.',
                ),
              ],
              true,
            ),
            o('The stars move away and come back.', [
              N(
                'The stars stay in place. It is Earth that moves round the Sun, so we see different ones through the year.',
              ),
            ]),
            o('Winter stars are brighter.', [
              N(
                'It is not brightness. Earth moves round the Sun, so different stars are above us in each season.',
              ),
            ]),
          ],
          'Learned that different stars are visible in different seasons because Earth moves round the Sun.',
        ),
      ],
    ),
    sc(
      'a27-10-banquet',
      [
        N(
          'That night there is a banquet. There are more knives on the cloth than you have fingers, and more cups than that.',
        ),
        ZA('Which one is for eating? Why are there so many? Do they fight over them?', 'think'),
        Y('I don’t know either.'),
        ZA(
          'Then we are equal. Good. We will learn it together, like the chicks learned not to sit on me.',
          'happy',
        ),
        N(
          'Zal waits until everyone else is served before he takes anything. The courtiers think it very fine manners. It is just nest manners.',
        ),
        N(
          'Your Nubbin has nest manners of a different kind. It has eaten a whole dish of rice by itself.',
        ),
      ],
      [
        ask(
          5,
          'maths',
          'multiply: 3 dishes, each feeding 8',
          '3.OA.A.3',
          [
            N(
              'One dish of rice feeds 8 people. If your Nubbin ends up eating three dishes by itself, how many people’s worth of rice is that?',
            ),
          ],
          [
            o('24.', [N('Yes. 3 dishes of 8 make 24.')], true),
            o('11.', [N('That adds 3 and 8. There are 3 dishes of 8, so multiply: 24.')]),
            o('38.', [N('Check: 3 times 8 is 24, not 38.')]),
          ],
          'Multiplied 3 dishes by 8 portions to find 24 portions.',
        ),
      ],
      [
        ch('copy', 'Watch the courtiers, and copy what they do.', [
          N(
            'You copy the man opposite, and Zal copies you. By the third dish you both look as if you were born to it.',
          ),
          ZA('This is like hunting. You keep very still and watch.', 'happy'),
        ]),
        ch('ask', 'Ask the courtier next to you.', [
          N(
            'The courtier is delighted to be asked, and explains every knife at length. It takes until the sweets.',
          ),
          ZA('Thank you. I am going to forget all of it.', 'happy'),
        ]),
        ch('nubbin', 'Try to stop your Nubbin starting a second dish of rice.', [
          N(
            'You are too late: the Shah has seen. He laughs, and sends it a third, which is a royal honour, and also a lot of rice.',
          ),
        ]),
      ],
    ),
    sc(
      'a27-10-banquet-done',
      [
        N(
          'Your Nubbin falls asleep on a cushion with its stomach in the air, a guest of the King of Kings.',
        ),
      ],
      [
        ask(
          0,
          'literacy',
          'word origins: checkmate from the Persian shah mat',
          'L.3.4',
          [
            N(
              '“Checkmate” comes from the Persian shah mat: the king is helpless. Your Nubbin has eaten three dishes of rice. Who is helpless now?',
            ),
          ],
          [
            o(
              'Your Nubbin.',
              [
                N(
                  'Yes. Shah mat means the king can’t move. After three dishes, neither can your Nubbin.',
                ),
              ],
              true,
            ),
            o('The rice.', [N('The rice is gone. The one who can’t move is your Nubbin.')]),
            o('The chessboard.', [
              N('Nobody is playing chess. Your Nubbin is the one who can’t move.'),
            ]),
          ],
          'Learned that checkmate comes from the Persian shah mat, the king is helpless.',
        ),
      ],
    ),
    sc(
      'a27-10-petitions',
      [
        N(
          'Sam goes back to the wars, and leaves Sistan in Zal’s hands. Zal is very young for it, and very good at it.',
        ),
        N(
          'Every morning the people come to the hall with their petitions: a boundary, a debt, a goat that ate a neighbour’s washing.',
        ),
        N(
          'Zal listens to all of it. He listens the way the Simurgh listened from her peak: patiently, and to everything.',
        ),
        ZA(
          'She never decided anything in a hurry. You could see her thinking for three days about one fish.',
          'think',
        ),
        N(
          'He doesn’t judge anyone by how they look. Nobody in Sistan ever finds that surprising, for some reason.',
        ),
        N(
          'The old servant stands at the door every morning, to see the young master hear the city. He wouldn’t miss it.',
        ),
      ],
      [
        ask(
          3,
          'social-studies',
          'a fair judge hears both sides',
          'D2.Civ.8.3-5',
          [N('Two neighbours disagree about a goat and some washing. What makes a judge fair?')],
          [
            o(
              'Hearing both sides before deciding.',
              [
                N(
                  'Yes. A fair judge listens to everyone first, and that is how Zal sorts the goat from the washing.',
                ),
              ],
              true,
            ),
            o('Siding with the richer one.', [
              N('That would be unfair. A fair judge hears both sides first.'),
            ]),
            o('Deciding quickly to save time.', [
              N('Speed can be useful, but fairness needs listening to both sides first.'),
            ]),
          ],
          'Learned that a fair judge hears both sides before deciding.',
        ),
      ],
    ),
    sc(
      'a27-10-petitions-done',
      [ZA('Tell me if I get one wrong. You are the only one here who isn’t afraid to.')],
      [
        ask(
          0,
          'sel',
          'being someone people can be honest with',
          'CASEL: Relationship skills',
          [
            N(
              'Zal asks to be told when he is wrong. Why is it hard for powerful people to hear that, and how can we make it easier? There is no one right answer.',
            ),
          ],
          [
            o('By being kind when someone tells us.', [
              N(
                'That is a fair answer. If we thank the person who is honest, they will do it again.',
              ),
            ]),
            o('By asking for it, as Zal does.', [
              N('That is a fair answer. Asking out loud makes it safe for others to speak.'),
            ]),
            o('By remembering we all make mistakes.', [
              N('That is a fair answer. When we know we can be wrong, hearing it stings less.'),
            ]),
          ],
          'Thought about how to be someone others can be honest with.',
        ),
      ],
    ),
    sc(
      'a27-10-complete',
      [
        N(
          'The seasons go round. Zal grows wiser, and stronger, and his name goes out across the land like a good smell from a kitchen.',
        ),
        N(
          'He rules Sistan with patience and fairness. The goat owner and the washing owner end up friends, which is his proudest work.',
        ),
        ZA(
          'Now I would like to see the rest of the kingdom. I have only seen the top of it, and the middle.',
          'happy',
        ),
        N(
          'Your Nubbin, who has also grown, sideways, agrees that travel is a good idea, if there is food.',
        ),
      ],
      [
        ask(
          0,
          'science',
          'daylight changes through the year because of Earth’s tilt',
          '5-ESS1-2',
          [
            N(
              'As the seasons go round, summer days in Iran are longer than winter days. What causes that?',
            ),
          ],
          [
            o(
              'Earth’s tilt, as it travels round the Sun.',
              [
                N(
                  'Yes. Tilted towards the Sun, a place gets longer days. Tilted away, it gets shorter ones.',
                ),
              ],
              true,
            ),
            o('The Sun gets closer in summer.', [
              N('A common idea, but no. The cause is Earth’s tilt, not its distance from the Sun.'),
            ]),
            o('Clouds block the Sun in winter.', [
              N(
                'Clouds can hide the Sun, but the lengths of the days change because of Earth’s tilt.',
              ),
            ]),
          ],
          'Learned that the length of daylight changes through the year because of Earth’s tilt.',
        ),
      ],
    ),
  ],
  [
    gl('banquet', 'A large, formal meal for many guests.', 'a27-10-banquet'),
    gl(
      'petition',
      'A request for help or a decision, brought to someone in charge.',
      'a27-10-petitions',
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
      hint: 'Mehrab comes out to the tents at sundown.',
    },
    'a27-11-s2': {
      goal: 'Carry Zal’s gift to Mehrab in the city.',
      hint: 'Take the gift box through the city gate to the king’s house.',
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
        N(
          'Zal travels with a long train, and pitches his tents outside Kabul, by the river. The king of Kabul comes out to meet him.',
        ),
        N(
          'Mehrab comes from the line of Zahhak, a cruel old king from long ago. Mehrab himself is wise and fair.',
        ),
        N(
          'Zal feasts him in the tents until late. They like each other at once, which is awkward for both of them.',
        ),
        MH(
          'Grant me one thing, son of Sam. Come and stay under my roof. Let my house be glad of you.',
          'happy',
        ),
        ZA(
          'Ask me anything else. Not that. My father and the Shah would never forgive it. It’s nothing to do with you.',
          'sad',
        ),
        N(
          'Mehrab bows, and goes out of the tent sadly. Zal watches the door after him for a long time.',
        ),
      ],
      [
        ask(
          1,
          'social-studies',
          'Kabul is the capital of Afghanistan, on the Kabul River',
          'D2.Geo.2.3-5',
          [
            N(
              'Kabul is a real city, beside the Kabul River in a valley among mountains. It is the capital of which country today?',
            ),
          ],
          [
            o(
              'Afghanistan.',
              [
                N(
                  'Yes. Kabul is the capital of Afghanistan, where a form of Persian called Dari is widely spoken.',
                ),
              ],
              true,
            ),
            o('Iran.', [
              N('Not Iran. Iran’s capital is Tehran. Kabul is the capital of Afghanistan.'),
            ]),
            o('Tajikistan.', [
              N('Not Tajikistan. Its capital is Dushanbe. Kabul is the capital of Afghanistan.'),
            ]),
          ],
          'Learned that Kabul is the capital of Afghanistan, where a form of Persian is widely spoken.',
        ),
      ],
    ),
    sc(
      'a27-11-tents-done',
      [
        ZA(
          'I don’t like that. He was kind, and I sent him away with nothing. Will you go after him for me?',
          'sad',
        ),
      ],
      [
        ask(
          0,
          'sel',
          'refusing kindly versus accepting',
          'CASEL: Responsible decision-making',
          [
            N(
              'Zal had to say no, and still wanted to be kind. When is refusing someone kindly harder than saying yes? There is no one right answer.',
            ),
          ],
          [
            o('When we like them and have to disappoint them.', [
              N('That is a fair answer. A no hurts more when it goes to someone we care about.'),
            ]),
            o('When we cannot explain our reasons.', [
              N(
                'That is a fair answer. Zal cannot say all that is on his mind, so he sends a gift instead.',
              ),
            ]),
            o('When we are afraid of what others will say.', [
              N('That is a fair answer. Zal is bound by what his father and the Shah would think.'),
            ]),
          ],
          'Thought about how hard it is to refuse kindly someone we like.',
        ),
      ],
    ),
    sc(
      'a27-11-gift',
      [
        N(
          'Zal gives you a box of carved sandalwood. Inside is a feather-light cloth, white, with a gold border.',
        ),
        ZA('Tell him I can’t come in. But tell him I wanted to. That part is true.'),
        N(
          'You carry it through Kabul at dusk. The streets smell of bread and woodsmoke and roses.',
        ),
        N(
          'At the king’s house they take you through to the family’s rooms. It is like walking into a garden that has a roof.',
        ),
        N(
          'Mehrab is there with his wife, Queen Sindokht, and their daughter Rudaba. He opens the box, and goes pink.',
        ),
        MH(
          'He can’t come in, but he wanted to. Well. That’s the nicest no I’ve ever had.',
          'happy',
        ),
      ],
      [
        ask(
          0,
          'maths',
          'perimeter of a rectangle',
          '3.MD.D.8',
          [
            N(
              'The white cloth is 4 metres long and 2 metres wide, with a gold border all the way round the edge. How long is the gold border?',
            ),
          ],
          [
            o(
              '12 metres.',
              [N('Yes. The border is the perimeter: 4 plus 2 plus 4 plus 2 is 12.')],
              true,
            ),
            o('8 metres.', [
              N(
                'That is the area in square metres. The border goes round the edge: 4 plus 2 plus 4 plus 2 is 12.',
              ),
            ]),
            o('6 metres.', [
              N(
                'That is only one length plus one width. Go all the way round: 4 plus 2 plus 4 plus 2 is 12.',
              ),
            ]),
          ],
          'Found the perimeter of a 4 m by 2 m rectangle: 12 m.',
        ),
      ],
    ),
    sc(
      'a27-11-gift-done',
      [
        SK(
          'Sit down, messenger. Have something to eat. Your little one has already started, I see.',
        ),
      ],
      [
        ask(
          0,
          'social-studies',
          'hosts welcome guests with food; mehman means guest',
          'D2.Civ.8.3-5',
          [
            N(
              'In Persian a guest is a mehman, and hosts often offer food first. Why do hosts offer food to guests?',
            ),
          ],
          [
            o(
              'To show care and make them welcome.',
              [N('Yes. Food says “we are glad you came”, and many cultures share that custom.')],
              true,
            ),
            o('To make guests leave sooner.', [
              N('Quite the opposite: it is a way of making them welcome.'),
            ]),
            o('Because guests are always hungry.', [
              N('Guests may be hungry, but the custom is about showing care and welcome.'),
            ]),
          ],
          'Learned that hosts often offer food to a mehman, a guest, to show welcome.',
        ),
      ],
    ),
    sc(
      'a27-11-praise',
      [
        SK(
          'So tell us. What sort of man is this white-haired son of Sam? Does he belong in a nest, or on a throne?',
          'think',
        ),
        MH(
          'On a throne. His heart is like a lion’s, and he is as strong as an elephant. A friend you’d want, and an enemy you wouldn’t.',
        ),
        MH(
          'And the white hair suits him. On him, even the things people call faults look fine.',
          'happy',
        ),
        N(
          'Rudaba has said nothing at all. She is sitting very still, listening as if her life depends on it.',
        ),
        RU('You know him. You were raised with him, they say. In the nest.'),
        RU('What is he like? Not what the court says. What is he really like?'),
      ],
      [
        ask(
          5,
          'literacy',
          'character traits from what a person does',
          'RL.3.3',
          [
            N(
              'Zal feeds everyone else before himself, and he bows as the Simurgh did. Which two traits do these actions show?',
            ),
          ],
          [
            o(
              'Generous and humble.',
              [N('Yes. Feeding others first shows generosity, and his gentle bow shows humility.')],
              true,
            ),
            o('Greedy and proud.', [
              N('The opposite. Feeding others first is generous, and a gentle bow is humble.'),
            ]),
            o('Lazy and rude.', [
              N('No. Feeding others first is generous, and bowing as he does shows respect.'),
            ]),
          ],
          'Worked out a character’s traits, generous and humble, from what he does.',
        ),
      ],
      [
        ch('kind', '“He feeds everyone else before he feeds himself.”', [
          RU('Does he? Even at a banquet? With everyone watching?', 'soft'),
          Y('Especially then.'),
        ]),
        ch('bird', '“He was raised by a bird the size of a house. He still bows like her.”', [
          RU('I would like to see that bow.', 'happy'),
        ]),
        ch('hair', '“His hair is white as snow, and it suits him.”', [
          RU('Father says so too. I think I would like it.', 'soft'),
        ]),
      ],
    ),
    sc(
      'a27-11-praise-done',
      [
        N(
          'Rudaba asks you seven more questions. Sindokht watches her daughter ask them, and her face goes thoughtful.',
        ),
      ],
      [
        ask(
          0,
          'maths',
          'multiply: 7 questions of 2 minutes',
          '3.OA.A.3',
          [
            N(
              'Each question and answer takes about 2 minutes. How long do the seven questions take?',
            ),
          ],
          [
            o('14 minutes.', [N('Yes. 7 groups of 2 make 14.')], true),
            o('9 minutes.', [
              N('That adds 7 and 2. There are 7 questions of 2 minutes each, so multiply: 14.'),
            ]),
            o('72 minutes.', [N('Check: 7 times 2 is 14, not 72.')]),
          ],
          'Multiplied 7 questions by 2 minutes to make 14 minutes.',
        ),
      ],
    ),
    sc(
      'a27-11-complete',
      [
        N(
          'You walk back to the tents in the dark, with your Nubbin asleep on your shoulder, full of Kabul’s best bread.',
        ),
        N(
          'Behind you, in the king’s house, a girl who has never seen Zal sits up all night, thinking about him.',
        ),
        N(
          'In front of you, in a tent by the river, a young man who has never seen Rudaba is doing exactly the same.',
        ),
        ZA('Did he like the cloth? What did they say? Who else was there?'),
        N('You tell him about Rudaba. He doesn’t sleep at all.'),
      ],
      [
        ask(
          4,
          'health',
          'a calm routine helps the body fall asleep',
          'CASEL: Self-management',
          [N('Excited thoughts can keep us awake. Which of these helps the body fall asleep?')],
          [
            o(
              'A calm routine: dim lights, quiet, slow breaths.',
              [
                N(
                  'Yes. A calm routine tells the body it is time to rest, and slow breaths calm busy thoughts.',
                ),
              ],
              true,
            ),
            o('Looking at a bright screen.', [
              N(
                'Bright screens can keep us awake. A calm routine of dim lights and slow breaths works better.',
              ),
            ]),
            o('Running laps.', [
              N('Exercise is great in the daytime, but near bedtime a calm routine works better.'),
            ]),
          ],
          'Learned that a calm routine helps the body fall asleep.',
        ),
      ],
    ),
  ],
  [
    gl('mehman', 'The Persian word for a guest.', 'a27-11-gift-done'),
    gl('perimeter', 'The distance all the way round the edge of a shape.', 'a27-11-gift'),
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
      goal: 'Cross with the page and carry messages between the two banks.',
      hint: 'The ferry stone is a little way downstream.',
    },
    'a27-12-s3': {
      goal: 'Bring Rudaba’s maid to Zal, and carry the answer home.',
      hint: 'One maid wants to see him with her own eyes.',
    },
  },
  [
    sc(
      'a27-12-roses',
      [
        N(
          'In the morning, across the river from Zal’s tents, there is a rose garden. Rudaba’s maids are in it, in their best clothes.',
        ),
        N(
          'They pick roses and put them in their hair, and throw petals in the river to see which way they float.',
        ),
        N(
          'They work their way along the bank, very slowly, until they are exactly opposite Zal’s tents.',
        ),
        ZA('Who are they?', 'think'),
        PG('Rudaba’s maids, my lord. Picking roses. Quite near.'),
        N(
          'Zal takes his bow and goes down to the water with only his page. He shoots one arrow across the river, and it lands among the roses.',
        ),
      ],
      [
        ask(
          1,
          'science',
          'bees carry pollen from flower to flower',
          '3-LS1-1',
          [
            N(
              'A rose garden hums with bees. When a bee visits one rose and then another, what does it carry between them?',
            ),
          ],
          [
            o(
              'Pollen.',
              [
                N(
                  'Yes. Pollen carried between flowers helps them make seeds. That is pollination.',
                ),
              ],
              true,
            ),
            o('Water.', [
              N(
                'Not water. A bee carries pollen on its body from flower to flower, which helps flowers make seeds.',
              ),
            ]),
            o('Perfume.', [
              N('The scent helps bees find the flowers, but what they carry is pollen.'),
            ]),
          ],
          'Learned that bees carry pollen from flower to flower, which helps plants make seeds.',
        ),
      ],
    ),
    sc(
      'a27-12-roses-done',
      [ZA('Go across and fetch it. And take your time.', 'happy')],
      [
        ask(
          0,
          'maths',
          'subtract distances: 48 minus 30',
          '4.NBT.B.4',
          [
            N(
              'The river is 30 metres wide, and Zal’s arrow flew 48 metres. How far past the far bank did it land?',
            ),
          ],
          [
            o('18 metres.', [N('Yes. 48 take away 30 is 18.')], true),
            o('78 metres.', [
              N('That adds the two. We want the difference: 48 take away 30 is 18.'),
            ]),
            o('12 metres.', [N('Check the subtraction: 48 minus 30 is 18.')]),
          ],
          'Subtracted 30 m from 48 m to find the arrow landed 18 m past the far bank.',
        ),
      ],
    ),
    sc(
      'a27-12-boasts',
      [
        N('You go across with the page. The maids surround him at once, all talking.'),
        MD('Who shot that? Whose arrow is it? It flew like a king’s.'),
        PG(
          'Don’t you know? That is the son of Sam. There is nobody in the world as strong or as handsome.',
          'happy',
        ),
        MD('Don’t boast. Mehrab’s house has a sun in it that outshines anyone.', 'happy'),
        PG('Well, our sun can shoot an arrow across a river.'),
        MD('Ours doesn’t need to. Birds come to her.'),
        N('This goes on for some time. The page is smiling all the way back across the river.'),
      ],
      [
        ask(
          3,
          'literacy',
          'metaphor: calling a person a sun',
          'L.4.5',
          [
            N(
              'The maid calls Rudaba “a sun” in Mehrab’s house. Rudaba is not really a sun. What kind of language is this?',
            ),
          ],
          [
            o(
              'A metaphor.',
              [
                N(
                  'Yes. A metaphor says one thing is another, to show what it is like. Rudaba brings light and warmth, as the sun does.',
                ),
              ],
              true,
            ),
            o('A simile.', [
              N(
                'Close. A simile says “like” or “as”. A metaphor says Rudaba is a sun, without “like”.',
              ),
            ]),
            o('A rhyme.', [N('A rhyme is about sounds. Calling Rudaba a sun is a metaphor.')]),
          ],
          'Named a metaphor, calling Rudaba a sun, and explained what it shows.',
        ),
      ],
      [
        ch('join', 'Join in the boasting.', [
          Y('He was raised by the biggest bird in the world, and she was proud of him.'),
          MD('That’s cheating. You can’t win a boast with a true thing.', 'happy'),
        ]),
        ch('judge', 'Declare it a draw.', [
          MD('A draw. Very well. We will call it a draw until they meet. Then we’ll see.', 'think'),
        ]),
      ],
    ),
    sc(
      'a27-12-boasts-done',
      [
        ZA('Why are you smiling? What did they say? Tell me every word.', 'think'),
        N(
          'The page tells him. Zal sends you straight back across with pearls and gold for the maids, so they’ll keep his secret and carry his messages.',
        ),
      ],
      [
        ask(
          1,
          'sel',
          'pride in others versus boasting',
          'CASEL: Social awareness',
          [
            N(
              'The page is proud of Zal, and the maids are proud of Rudaba. When is pride kind, and when does it turn into boasting? There is no one right answer.',
            ),
          ],
          [
            o('Pride is kind when it lifts people up.', [
              N('That is a fair answer. Pride in a friend’s kindness or effort is lovely.'),
            ]),
            o('Boasting is when we put others down.', [
              N(
                'That is a fair answer. The maids and the page are playful, but real boasting can sting.',
              ),
            ]),
            o('It depends on how the other person feels.', [
              N('That is a fair answer. Reading how someone feels is the best test.'),
            ]),
          ],
          'Thought about the difference between kind pride and boasting.',
        ),
      ],
    ),
    sc(
      'a27-12-maid',
      [
        N(
          'The maid who is wiser than the rest takes the pearls, and asks to see the hero for herself.',
        ),
        MD(
          'A secret three people know isn’t a secret any more. So I may as well be one of the three.',
        ),
        N(
          'You bring her across, and she looks at Zal, his bow, his white hair. She nods, as if a box has been ticked.',
        ),
        MD(
          'She thinks of nothing but you. She asked a stranger seven questions about you last night.',
          'happy',
        ),
        ZA('Then show me a way to see her. Please. I can’t think about anything else.', 'soft'),
        MD('Leave it to us. Wait for word.'),
      ],
      [
        ask(
          1,
          'maths',
          'a two-step problem: a secret spreads',
          '3.OA.D.8',
          [
            N(
              'Three people know the secret. Each of the three tells 2 more people. How many people know the secret now?',
            ),
          ],
          [
            o(
              '9.',
              [N('Yes. 3 people each tell 2 more: 3 times 2 is 6 new people, and 3 plus 6 is 9.')],
              true,
            ),
            o('6.', [N('That is only the new people. Add the first three: 3 plus 6 is 9.')]),
            o('5.', [N('That adds 3 and 2. Each of the 3 tells 2, so 6 more hear it: 9 in all.')]),
          ],
          'Solved a two-step problem: 3 plus 3 times 2 is 9 people who know the secret.',
        ),
      ],
    ),
    sc(
      'a27-12-maid-done',
      [
        N(
          'Back in the family’s rooms, the maids tell Rudaba everything. She takes a whole rose apart without noticing, petal by petal.',
        ),
      ],
      [
        ask(
          0,
          'art',
          'the rose and the nightingale in Persian art and poetry',
          'RL.4.2',
          [
            N(
              'Persian poets and painters often showed a rose beside a singing bird, the nightingale. What did the pair stand for?',
            ),
          ],
          [
            o(
              'Love and longing.',
              [
                N(
                  'Yes. The nightingale sings to the rose in a way that stands for love and longing, a theme in Persian poetry.',
                ),
              ],
              true,
            ),
            o('War and fighting.', [
              N('No. The rose and the nightingale usually stand for love and longing.'),
            ]),
            o('Winter and snow.', [
              N(
                'No. The rose and the nightingale are a spring and love picture: love and longing.',
              ),
            ]),
          ],
          'Learned that the rose and the nightingale often stand for love and longing in Persian art and poetry.',
        ),
      ],
    ),
    sc(
      'a27-12-complete',
      [
        RU('You told me what he is really like. Now my maids say he shoots like a king.', 'think'),
        RU('Which is he?'),
        Y('Both.'),
        RU('Good. I would hate to have to choose.', 'happy'),
        N(
          'She gives you a cutting from the rose garden to keep, wrapped in a wet cloth, for carrying all those messages.',
        ),
        N('Your Nubbin has a rose behind each ear. Nobody can remember putting them there.'),
      ],
      [
        ask(
          3,
          'sel',
          'people can be gentle and strong at once',
          'CASEL: Self-awareness',
          [
            N(
              'Zal is gentle and a fine archer too. Can a person be gentle and strong at the same time? There is no one right answer.',
            ),
          ],
          [
            o('Yes. Strength can be gentle.', [
              N(
                'That is a fair answer. The strongest people often are careful about how they use it.',
              ),
            ]),
            o('Sometimes. It depends on the moment.', [
              N('That is a fair answer. Knowing when to be which is part of wisdom.'),
            ]),
            o('No. They pull in different directions.', [
              N(
                'That is a fair answer. They can feel like opposites, but Zal shows they can sit together.',
              ),
            ]),
          ],
          'Thought about whether a person can be gentle and strong at once.',
        ),
      ],
    ),
  ],
  [
    gl(
      'pollen',
      'A fine yellow dust made by flowers. Bees carry it from flower to flower.',
      'a27-12-roses',
    ),
    gl(
      'metaphor',
      'Saying one thing is another to show what it is like, as in “she is a sun”.',
      'a27-12-boasts',
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
      hint: 'Stand at the corner of the lane. Look out for the night porter.',
    },
    'a27-13-s3': {
      goal: 'Keep the watch until dawn.',
      hint: 'Stay at your corner. The porter comes round once.',
    },
  },
  [
    sc(
      'a27-13-dusk',
      [
        N(
          'At sundown the maid comes to the tents, in a dark cloak, and says only: come now. Everything is ready.',
        ),
        N(
          'Zal goes with her, through the back lanes of Kabul. You and your Nubbin go too, because somebody has to keep watch.',
        ),
        N(
          'Rudaba has hung her rooms with silk and carpets and filled them with flowers. You can smell them from the lane.',
        ),
        N(
          'The house is locked for the night. Rudaba is standing on the roof, in the last of the light, waiting.',
        ),
        N('She is like a cypress with the full moon on it. Zal stops walking.'),
        RU('Welcome, son of a hero. Heaven bless you for coming.', 'soft'),
      ],
      [
        ask(
          4,
          'literacy',
          'simile: like a cypress with the moon on it',
          'L.4.5',
          [
            N(
              'Cypress trees are tall, slender and dark green. Rudaba is “like a cypress with the full moon on it”. What does this simile tell us?',
            ),
          ],
          [
            o(
              'She is tall, graceful and lit with silver.',
              [N('Yes. A tall cypress and moonlight make a picture of grace and calm.')],
              true,
            ),
            o('She is short and round.', [
              N(
                'The opposite: cypresses are tall and slender, so the simile says she is tall and graceful.',
              ),
            ]),
            o('She is hiding in a tree.', [
              N('She is on a roof, not in a tree. The simile paints how she looks.'),
            ]),
          ],
          'Explained what a simile about a cypress and moonlight tells us about Rudaba.',
        ),
      ],
    ),
    sc(
      'a27-13-dusk-done',
      [ZA('Heaven bless you for waiting. Only, you are up there, and I am down here.', 'think')],
      [
        ask(
          0,
          'maths',
          'subtract a height from a rope length',
          '4.MD.A.2',
          [
            N(
              'The roof is 5 metres up, and Zal’s rope is 8 metres long. How much rope is left over once it reaches the roof?',
            ),
          ],
          [
            o('3 metres.', [N('Yes. 8 take away 5 is 3.')], true),
            o('13 metres.', [N('That adds. We want what is left over: 8 take away 5 is 3.')]),
            o('5 metres.', [N('Check: 8 minus 5 is 3.')]),
          ],
          'Subtracted 5 m from 8 m to find 3 m of rope left over.',
        ),
      ],
    ),
    sc(
      'a27-13-roof',
      [
        N(
          'Rudaba unpins her hair. It is black and very long, and she lets it down over the edge of the roof, all the way to the ground.',
        ),
        RU(
          'Here is a rope that will hold you. Take hold and climb. It’s right that I should catch you.',
          'happy',
        ),
        N('Zal takes hold of the end. Then he lifts it to his face, and lets it go.'),
        ZA('No.'),
        RU('No?', 'shock'),
        ZA('Never. It would hurt you, and I could not do that.', 'soft'),
        N(
          'He makes a running knot in a rope and throws it up. It catches first time. He goes up it in one bound.',
        ),
      ],
      [
        ask(
          5,
          'sel',
          'choosing the gentle way even when it is harder',
          'CASEL: Responsible decision-making',
          [
            N(
              'Zal could have climbed Rudaba’s hair, which was offered kindly. He chose his own rope so as not to hurt her. Is the loving choice always the easy one? There is no one right answer.',
            ),
          ],
          [
            o('No. It may mean doing more work.', [
              N('That is a fair answer. Zal took the harder way, so Rudaba would be safe.'),
            ]),
            o('Yes, when we love someone it feels easy.', [
              N(
                'That is a fair answer. Loving feels natural, but choosing gently still takes thought.',
              ),
            ]),
            o('It depends on what we are willing to give up.', [
              N('That is a fair answer. Real care often costs us something.'),
            ]),
          ],
          'Thought about whether choosing the loving, gentle way is always easy.',
        ),
      ],
    ),
    sc(
      'a27-13-roof-done',
      [
        N(
          'Up on the roof, Rudaba takes his hand, and they go in together. You take up your post at the corner of the lane.',
        ),
      ],
      [
        ask(
          0,
          'science',
          'compare solutions: hair rope or lasso; friction holds a knot',
          '3-5-ETS1-2',
          [
            N(
              'Zal compared two ways up: Rudaba’s hair, or a running knot on his own rope. A running knot tightens when pulled, thanks to friction. Which is the better solution, and why?',
            ),
          ],
          [
            o(
              'The rope: it holds, and nobody is hurt.',
              [
                N(
                  'Yes. A rope can be hooked over a post and holds safely. The friction in a knot keeps it tight, and nobody is hurt.',
                ),
              ],
              true,
            ),
            o('Her hair: it is nearer.', [
              N(
                'It might be nearer, but pulling on hair would hurt. Good engineers compare solutions on safety too.',
              ),
            ]),
            o('Neither would work.', [
              N(
                'A rope with a running knot works well, and the story shows it catching first time.',
              ),
            ]),
          ],
          'Compared two ways of climbing and chose the safer one, learning that friction holds a knot tight.',
        ),
      ],
    ),
    sc(
      'a27-13-watch',
      [
        N(
          'The night is long and warm. From the window above come voices, low, talking, and sometimes laughing.',
        ),
        N('Your Nubbin sits on your feet, which is its idea of keeping watch. It is also asleep.'),
        N(
          'At midnight the night porter comes round with his lamp, checking the locks, humming to himself.',
        ),
        N(
          'He stops at the bottom of the rope, which is hanging down the wall in plain sight.',
          'shock',
        ),
        N('He holds his lamp up to it. He looks up the wall, very slowly, towards the window.'),
        N('Your Nubbin is suddenly wide awake. So are you.'),
      ],
      [
        ask(
          3,
          'maths',
          'time intervals: 7 pm to 5 am',
          '3.MD.A.1',
          [
            N(
              'Zal reached the house at 7 in the evening, and the morning drums beat at 5. How many hours was that?',
            ),
          ],
          [
            o(
              '10 hours.',
              [N('Yes. 7 pm to midnight is 5 hours, and midnight to 5 am is 5 more: 10 hours.')],
              true,
            ),
            o('12 hours.', [
              N(
                'Count it in two parts: 7 pm to midnight is 5 hours, midnight to 5 am is 5 hours. That is 10.',
              ),
            ]),
            o('2 hours.', [
              N(
                'That takes 7 from 5, which does not work across midnight. Count 5 hours to midnight and 5 more: 10.',
              ),
            ]),
          ],
          'Worked out the time from 7 pm to 5 am: 10 hours.',
        ),
      ],
      [
        ch('greet', 'Step out and wish him good evening.', [
          N(
            'You step out and wish him good evening. He jumps, and wishes you one back, and you talk about the weather.',
          ),
          N(
            'You talk about the weather for a long time. You walk him all the way to the next street.',
          ),
        ]),
        ch('nubbin', 'Nudge your Nubbin.', [
          N(
            'Your Nubbin wakes, sees the lamp, and rolls into the lane after it. The porter follows it for three streets, trying to feed it.',
          ),
        ]),
        ch('still', 'Keep very still in the shadow.', [
          N(
            'You keep very still. The porter looks at the rope, decides it is a vine, and goes on: Kabul has unusual vines.',
          ),
        ]),
      ],
    ),
    sc(
      'a27-13-watch-done',
      [
        N(
          'In the camp the drums begin, the drums that mean morning. The voices upstairs say: not yet, please, not yet.',
        ),
      ],
      [
        ask(
          0,
          'sel',
          'coping when a happy time has to end',
          'CASEL: Self-management',
          [
            N(
              'The voices upstairs wish the night would not end. What helps most when a good time has to finish?',
            ),
          ],
          [
            o(
              'Remembering it, and looking forward to the next one.',
              [
                N(
                  'Yes. Holding on to the memory and making a plan to meet again makes goodbyes lighter.',
                ),
              ],
              true,
            ),
            o('Pretending it never happened.', [
              N(
                'That would lose the good part. Remembering it and planning the next time helps more.',
              ),
            ]),
            o('Staying angry at the morning.', [
              N('Feeling cross is natural, but remembering and planning ahead helps more.'),
            ]),
          ],
          'Talked about coping when a happy time ends: remember it, and plan the next one.',
        ),
      ],
    ),
    sc(
      'a27-13-complete',
      [
        N('The sun takes no notice of them. It comes up anyway.'),
        N(
          'Zal comes down the rope at the last moment, and stands in the lane, looking as if he has been carried up a mountain again.',
        ),
        ZA('We have sworn. Neither of us will marry anyone else. Not ever.', 'happy'),
        ZA('My father will be angry. The Shah will be angrier. I don’t care.', 'soft'),
        N(
          'He coils up the rope and hangs it over your shoulder. You find you are going to keep it.',
        ),
      ],
      [
        ask(
          0,
          'science',
          'day and night come from Earth’s spin',
          '5-ESS1-2',
          [N('We say the sun “comes up”. What is really happening?')],
          [
            o(
              'Earth spins, and our side turns towards the Sun.',
              [
                N(
                  'Yes. Earth spins once a day. When your part turns to face the Sun, we call it sunrise.',
                ),
              ],
              true,
            ),
            o('The Sun travels round the Earth.', [
              N('It looks that way, but no. Earth is the one that spins, and the Sun stays put.'),
            ]),
            o('Someone switches the Sun on.', [
              N('Ha. No one has to: Earth spins, and our side turns to face the Sun.'),
            ]),
          ],
          'Learned that sunrise happens because Earth spins and our side turns toward the Sun.',
        ),
      ],
    ),
  ],
  [
    gl(
      'cypress',
      'A tall, slim, dark green evergreen tree, common in Persian gardens.',
      'a27-13-dusk',
    ),
    gl(
      'friction',
      'The rubbing force between two surfaces that slows things down or holds them in place.',
      'a27-13-roof-done',
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
      hint: 'Ride to Sam’s camp in the north and give it into his own hands.',
    },
    'a27-14-s2': {
      goal: 'Wait while Sam reads, and while the mobeds read the stars.',
      hint: 'Stay in Sam’s tent until the star-readers come back.',
    },
    'a27-14-s3': {
      goal: 'Take Sam’s answer to Kabul.',
      hint: 'Zal sends you on to Rudaba with the good news.',
    },
    'a27-14-s4': {
      goal: 'Ride with Sindokht to Sam, and stand by her.',
      hint: 'Stay with the queen’s train all the way to Sam’s camp.',
    },
  },
  [
    sc(
      'a27-14-letter',
      [
        N(
          'In the morning Zal calls a scribe, and walks up and down the tent while he speaks, and the scribe writes.',
        ),
        ZA(
          'Father. You put me out on a mountain. A bird raised me. The sun beat on my head, and I ate what she brought.',
        ),
        ZA(
          'All that time you sat in a good house, in silk. I don’t say it to hurt you. I say it because it’s true.',
        ),
        ZA(
          'You swore you would give me anything I asked. I have never asked you for anything. This is the one thing.',
        ),
        ZA('I love Rudaba, Mehrab’s daughter. I want to marry her.'),
        ZA('You came back for me. Come with me now.'),
        N('He seals it, and holds it out to you, not to the messenger who is waiting.'),
        ZA(
          'You carry it. You were there at the beginning. He should see your face when he reads it.',
        ),
      ],
      [
        ask(
          4,
          'literacy',
          'how to write something hard, honestly and kindly',
          'RL.3.3',
          [
            N(
              'Zal’s letter says hard things: you left me on a mountain, and now I ask you for one thing. Which helps most when you write something hard?',
            ),
          ],
          [
            o(
              'Say what happened, say how you feel, and then say what you ask.',
              [N('Yes. Zal does all three, and he says plainly that he is not trying to hurt.')],
              true,
            ),
            o('Make it as angry as possible.', [
              N(
                'Anger can be honest, but it often stops the other person listening. Zal says what is true without trying to hurt.',
              ),
            ]),
            o('Leave out the truth.', [
              N('A letter without the truth cannot help. Zal says it kindly, and says it anyway.'),
            ]),
          ],
          'Learned a way to write a hard letter: say what happened, say how you feel, then say what you ask.',
        ),
      ],
    ),
    sc(
      'a27-14-letter-done',
      [
        N(
          'You ride north for four days, with the letter inside your coat and your Nubbin inside the saddlebag, eating the provisions.',
        ),
      ],
      [
        ask(
          0,
          'maths',
          'multiply: 6 hours a day for 4 days',
          '3.OA.A.3',
          [N('You ride for 6 hours each day, for 4 days. How many hours do you ride in all?')],
          [
            o('24 hours.', [N('Yes. 4 days of 6 hours make 24.')], true),
            o('10 hours.', [
              N('That adds 4 and 6. There are 4 days of 6 hours each, so multiply: 24.'),
            ]),
            o('46 hours.', [N('Check: 4 times 6 is 24, not 46.')]),
          ],
          'Multiplied 4 days by 6 hours to make 24 hours.',
        ),
      ],
    ),
    sc(
      'a27-14-stars',
      [
        N(
          'Sam reads the letter twice. Then he puts it face down on his knee, as if it might read him back.',
        ),
        SA('A bird’s nursling, and a daughter of Zahhak’s line. What could come of that?', 'think'),
        SA(
          'If I say no, I break my oath. If I say yes, the Shah will have something to say. I am caught between fire and water.',
          'sad',
        ),
        N(
          'He sends for the mobeds, and they read the stars all day. At evening they come back, smiling.',
        ),
        MO(
          'Rejoice, champion. The stars say Zal will have a son, and that he will grow into the mightiest hero of the land.',
          'happy',
        ),
        N('Sam lets out a breath he seems to have been holding since the night his son was born.'),
      ],
      [
        ask(
          2,
          'literacy',
          'figurative language: caught between fire and water',
          'L.4.5',
          [N('Sam says he is “caught between fire and water”. What does this saying mean?')],
          [
            o(
              'He is stuck between two hard choices.',
              [
                N(
                  'Yes. Fire and water are opposites, and either way he is in trouble. It is a figure of speech, like “between a rock and a hard place”.',
                ),
              ],
              true,
            ),
            o('He is standing in a river.', [
              N('Not literally. It is a figure of speech meaning stuck between two hard choices.'),
            ]),
            o('He is cooking dinner.', [
              N('Ha. No. It means he is stuck between two hard choices.'),
            ]),
          ],
          'Explained the figure of speech caught between fire and water.',
        ),
      ],
    ),
    sc(
      'a27-14-stars-done',
      [
        SA(
          'Tell him: it is folly, and I gave my word, so it shall be done. I will go to the Shah myself.',
        ),
        SA('And tell him… tell him I read every line.', 'soft'),
      ],
      [
        ask(
          0,
          'sel',
          'whether keeping a promise is always right',
          'CASEL: Responsible decision-making',
          [
            N(
              'Sam thinks the match is folly, but he keeps his word. Is keeping a promise always right? There is no one right answer.',
            ),
          ],
          [
            o('Yes. Trust depends on it.', [
              N('That is a fair answer. If promises meant nothing, no one could rely on anyone.'),
            ]),
            o('Not if it would hurt someone badly.', [
              N(
                'That is a fair answer. Some promises must be reconsidered, and that is a hard choice.',
              ),
            ]),
            o('Mostly, and we should think before promising.', [
              N('That is a fair answer. A promise made with care is easier to keep.'),
            ]),
          ],
          'Thought about whether keeping a promise is always the right thing to do.',
        ),
      ],
    ),
    sc(
      'a27-14-kabul',
      [
        N(
          'Zal reads his father’s answer and gives away half his money to the poor. Then he sends you on to Rudaba with it.',
        ),
        N(
          'In the family’s rooms there is trouble already: the queen has caught Rudaba’s maid with a gift for Zal up her sleeve.',
        ),
        N(
          'Then worse news comes on a fast horse: the Shah is angry, and has ordered Sam to march on Kabul.',
          'shock',
        ),
        N(
          'Sindokht gets the whole story out of her daughter in a quarter of an hour. Mehrab comes in, hears it, and goes grey.',
        ),
        SK(
          'You are frightened, and frightened people say foolish things. Give me the key to the treasury.',
          'angry',
        ),
        MH('What for?'),
        SK('I am going to see Sam myself.'),
      ],
      [
        ask(
          3,
          'maths',
          'a quarter of an hour is 15 minutes',
          '3.MD.A.1',
          [
            N(
              'Sindokht got the whole story in a quarter of an hour. An hour has 60 minutes. How many minutes is a quarter of it?',
            ),
          ],
          [
            o('15 minutes.', [N('Yes. An hour is 60 minutes, and a quarter of 60 is 15.')], true),
            o('30 minutes.', [N('That is half an hour. A quarter is half of that: 15 minutes.')]),
            o('45 minutes.', [N('That is three quarters of an hour. One quarter is 15 minutes.')]),
          ],
          'Worked out that a quarter of an hour is 15 minutes.',
        ),
      ],
    ),
    sc(
      'a27-14-kabul-done',
      [
        RU('Mother. I’m sorry I didn’t tell you.', 'sad'),
        SK(
          'So am I. We’ll discuss it at length when Kabul isn’t on fire. Messenger, you’re coming with me.',
        ),
      ],
      [
        ask(
          1,
          'sel',
          'rebuilding trust after hiding something',
          'CASEL: Relationship skills',
          [
            N(
              'Rudaba hid a big secret from her mother. What helps rebuild trust after hiding something?',
            ),
          ],
          [
            o(
              'Telling the truth and saying sorry.',
              [N('Yes. Honesty and an apology are where trust starts to grow back.')],
              true,
            ),
            o('Hoping nobody notices.', [
              N('Hiding more does not repair trust. Telling the truth and saying sorry does.'),
            ]),
            o('Blaming someone else.', [
              N(
                'Blaming makes things worse. Telling the truth and saying sorry helps trust grow back.',
              ),
            ]),
          ],
          'Learned that telling the truth and saying sorry helps rebuild trust.',
        ),
      ],
    ),
    sc(
      'a27-14-embassy',
      [
        N(
          'Sindokht rides out with a train two miles long: gold, horses, elephants, carpets and enough musk to scent a city.',
        ),
        N(
          'She has herself announced to Sam as an envoy from Kabul, and has all of it laid out at his feet.',
        ),
        SA('A woman, sent as an envoy, with all this? Who are you, really?', 'think'),
        SK(
          'Swear first that you will spare my life and everyone I love. Then I will tell you anything.',
        ),
        N(
          'Sam takes her hand and swears. Then she tells him: she is Mehrab’s wife, and Rudaba’s mother, and of Zahhak’s line.',
        ),
        SK(
          'Punish the wicked if you must. But spare the innocent, or you will turn day into night.',
        ),
        SA('This one was there when my son was born. Messenger: is Rudaba worthy of him?'),
      ],
      [
        ask(
          5,
          'social-studies',
          'fairness: judge people by their own choices, not their family history',
          'D2.Civ.8.3-5',
          [
            N(
              'Rudaba comes from Zahhak’s family line, but she has done nothing wrong. Should people be judged by their family history?',
            ),
          ],
          [
            o(
              'No. By their own choices.',
              [
                N(
                  'Yes. Each person is responsible for their own actions, not for what their ancestors did.',
                ),
              ],
              true,
            ),
            o('Yes. Families are all alike.', [
              N(
                'Families are not all alike. Fairness means judging a person by their own choices.',
              ),
            ]),
            o('Only if the ancestor was famous.', [
              N('Fame does not change it. Fairness means judging a person by their own choices.'),
            ]),
          ],
          'Talked about fairness: people should be judged by their own choices, not their family history.',
        ),
      ],
      [
        ch('worthy', '“She asked me seven questions about him before she ever saw him.”', [
          SA('Seven. I didn’t ask one, about my own son, for years.', 'sad'),
        ]),
        ch('boast', '“Her maids won a boasting match against his page.”', [
          SA('Then she has good people round her. That’s most of what a ruler needs.', 'happy'),
        ]),
        ch('ask', '“Ask him yourself. He’ll tell you.”', [
          SA('Yes. I’ve learned that one. I should ask him myself.', 'soft'),
        ]),
      ],
    ),
    sc(
      'a27-14-embassy-done',
      [
        SA(
          'My oath is sacred. Kabul is safe, and so are you and yours. And I want my son to have her, whoever her grandfathers were.',
        ),
      ],
      [
        ask(
          0,
          'literacy',
          'vocabulary: sacred',
          'L.3.4',
          [N('Sam says his oath is “sacred”. What does sacred mean here?')],
          [
            o(
              'Very important and deserving deep respect.',
              [
                N(
                  'Yes. He will not break it. Sacred things are treated with the greatest respect.',
                ),
              ],
              true,
            ),
            o('Easily broken.', [
              N('The opposite. Sacred means very important and deserving deep respect.'),
            ]),
            o('Secret.', [
              N(
                'Not secret: everyone heard it. Sacred means very important and deserving deep respect.',
              ),
            ]),
          ],
          'Learned that sacred means very important and deserving deep respect.',
        ),
      ],
    ),
    sc(
      'a27-14-complete',
      [
        N(
          'Sindokht rides home with her face shining, like the moon coming out from behind a cloud.',
        ),
        N(
          'Sam writes to the Shah: a letter only a sorry man could write. Zal carries it to court himself.',
        ),
        N(
          'Your Nubbin rides home on an elephant, by its own arrangement, and has to be coaxed down with a pomegranate.',
        ),
      ],
      [
        ask(
          2,
          'social-studies',
          'Shab-e Yalda: the longest night of the year is celebrated with pomegranates',
          'D2.His.2.3-5',
          [
            N(
              'Pomegranates have grown in Iran for thousands of years. On Yalda, the longest night of the year, families gather with pomegranates and poetry. Which night is the longest in the northern hemisphere?',
            ),
          ],
          [
            o(
              'The winter solstice, around 21 December.',
              [
                N(
                  'Yes. Yalda marks the winter solstice, when the days begin to grow longer again, so it is a night of hope.',
                ),
              ],
              true,
            ),
            o('The summer solstice, around 21 June.', [
              N(
                'That is the longest day. The longest night is the winter solstice, around 21 December.',
              ),
            ]),
            o('The first day of spring.', [
              N(
                'At the spring equinox, day and night are about equal. The longest night is the winter solstice, around 21 December.',
              ),
            ]),
          ],
          'Learned that Yalda marks the winter solstice, and that pomegranates are eaten on that night in Iran.',
        ),
      ],
    ),
  ],
  [
    gl(
      'nameh',
      'A Persian word that means both book and letter. Shahnameh means Book of Kings.',
      'a27-01-page-done',
    ),
    gl('envoy', 'A person sent to carry a message or speak for someone else.', 'a27-14-embassy'),
    gl('sacred', 'Very important and deserving deep respect.', 'a27-14-embassy-done'),
  ],
);

// ================================================================== A27-15 The Riddles
const A15: EduQuest = quest(
  'a27-15',
  'The Riddles',
  {
    'a27-15-s1': {
      goal: 'Sit in the circle while the mobeds question Zal.',
      hint: 'Watch, listen, and see if you can guess before he answers.',
    },
    'a27-15-s2': {
      goal: 'Hear the last and hardest riddle.',
      hint: 'Stay in the circle. The oldest mobed asks last.',
    },
    'a27-15-s3': {
      goal: 'Watch Zal at the trials of arms.',
      hint: 'Stand at the edge of the field below the Shah’s roof.',
    },
  },
  [
    sc(
      'a27-15-riddles',
      [
        N(
          'At court the Shah reads Sam’s letter, and is moved by it. But he wants to see what Zal is made of first.',
        ),
        N(
          'The mobeds sit in a circle, with Zal in the middle. You and your Nubbin are allowed to sit at the edge, very quietly.',
        ),
        MO(
          'I have seen twelve tall green trees. Each one has thirty branches. They never grow more, and never fewer.',
          'think',
        ),
        ZA('The twelve months of the year. Each one has thirty days.'),
        MO(
          'Two fine horses race for ever, one black, one white as crystal. They never catch each other.',
          'think',
        ),
        ZA('Night and day. They chase each other round the sky, and neither one wins.'),
        MO(
          'Thirty riders pass the king. Look again: one is missing. Look again: all thirty are back.',
          'think',
        ),
      ],
      [
        ask(
          6,
          'science',
          'the moon’s cycle is about 29 and a half days; mah means moon and month',
          '5-ESS1-2',
          [
            N(
              'In Persian, the word mah means both “moon” and “month”. The Moon goes from full to full in about 29 and a half days. Why would one word do both jobs?',
            ),
          ],
          [
            o(
              'Months were first counted by the Moon’s cycle.',
              [
                N(
                  'Yes. Long ago, people counted a month from one new moon to the next, and the old word for moon also named the month.',
                ),
              ],
              true,
            ),
            o('The Moon changes colour each month.', [
              N(
                'It does not change colour. It is its shape that changes, and the cycle of shapes gave people a way to count months.',
              ),
            ]),
            o('It is a coincidence.', [
              N(
                'Not a coincidence. Months were first counted by the Moon’s cycle, so the word does both jobs.',
              ),
            ]),
          ],
          'Learned that the Moon’s cycle of about 29 and a half days gave us months, and that Persian mah means both moon and month.',
        ),
      ],
      [
        ch('moon', 'Whisper: “The moon.”', [
          ZA(
            'The days of the month. The moon thins until one night it is gone, and then it comes back whole.',
          ),
          N(
            'He catches your eye. You were nearly right, and he knows you were thinking it, and he is pleased.',
          ),
        ]),
        ch('stars', 'Whisper: “The stars.”', [
          ZA(
            'The days of the month. The moon thins until one night it is gone, and then it comes back whole.',
          ),
          N('Not the stars, then. You were a long way off, and enjoyed it anyway.'),
        ]),
        ch('quiet', 'Keep quiet, and let him think.', [
          ZA(
            'The days of the month. The moon thins until one night it is gone, and then it comes back whole.',
          ),
        ]),
      ],
    ),
    sc(
      'a27-15-riddles-done',
      [
        N(
          'The mobeds look at each other. Three riddles, three answers, and he hasn’t hesitated over any of them.',
        ),
      ],
      [
        ask(
          0,
          'maths',
          'multiply: 12 months of 30 days, plus 5',
          '3.OA.A.3',
          [
            N(
              'The old Persian year had twelve months of thirty days, plus five extra days at the end. How many days is that in all?',
            ),
          ],
          [
            o(
              '365.',
              [N('Yes. 12 times 30 is 360, and 5 more days make 365, the same as our year.')],
              true,
            ),
            o('360.', [N('That is only the twelve months. Add the five extra days: 365.')]),
            o('42.', [
              N(
                'That adds 12 and 30. There are 12 months of 30 days, so multiply: 360, plus 5 is 365.',
              ),
            ]),
          ],
          'Multiplied 12 months by 30 days and added 5 to get 365 days.',
        ),
      ],
    ),
    sc(
      'a27-15-hardest',
      [
        MO(
          'A green garden. A man comes in with a sharp sickle, and cuts everything, the dry and the green alike.',
          'think',
        ),
        ZA(
          'That is time. It cuts the old and the young, and doesn’t listen to anyone. That’s why we have to be kind while we can.',
          'soft',
        ),
        N('The oldest mobed waits until the room is very quiet. This is the one he is proud of.'),
        MO(
          'People leave a city on a rock and build in a thicket below. They forget the rock. Then the earth shakes.',
          'think',
        ),
        MO('Now they long for the town on the rock. What does it mean?'),
        ZA(
          'The rock is the world that lasts. The thicket is the life we live, busy and short.',
          'think',
        ),
        ZA(
          'We all go up to the rock in the end. What matters is that we leave a good name behind us in the thicket.',
        ),
        N('Nobody speaks. Then the whole court starts talking at once.'),
      ],
      [
        ask(
          1,
          'literacy',
          'a riddle that stands for something else: metaphor',
          'L.4.5',
          [
            N(
              'In the riddle of the green garden, a man with a sickle cuts everything. What does the man with the sickle stand for?',
            ),
          ],
          [
            o(
              'Time.',
              [
                N(
                  'Yes. Zal solves it: time cuts everything down eventually, young and old, and that is why we should be kind while we can.',
                ),
              ],
              true,
            ),
            o('A farmer.', [
              N(
                'He is a farmer in the picture, but the riddle stands for something bigger. Zal says it is time.',
              ),
            ]),
            o('A thief.', [
              N('Not a thief. Zal says the sickle stands for time, which comes for us all.'),
            ]),
          ],
          'Solved a riddle in which a man with a sickle stands for time, a metaphor.',
        ),
      ],
    ),
    sc(
      'a27-15-hardest-done',
      [SH('Well. I would have needed a week for that last one. And a nap.', 'happy')],
      [
        ask(
          0,
          'sel',
          'what a good name means',
          'CASEL: Self-awareness',
          [
            N(
              'Zal says what matters is the good name we leave behind. What would you like your name to stand for? There is no one right answer.',
            ),
          ],
          [
            o('Kindness.', [
              N(
                'That is a fair answer. People remember kindness long after they forget everything else.',
              ),
            ]),
            o('Courage.', [N('That is a fair answer. Courage helps other people be brave, too.')]),
            o('Someone who kept their word.', [
              N('That is a fair answer. A name for honesty is one of the most valuable there is.'),
            ]),
          ],
          'Thought about what they would like their name to stand for.',
        ),
      ],
    ),
    sc(
      'a27-15-trials',
      [
        N('The next morning the drums call the champions out. The Shah watches from his roof.'),
        N(
          'Zal shoots further and straighter than any of them. His spear goes through every shield.',
        ),
        N(
          'Then he wrestles a champion who has never been beaten, and he is gentle about it, and he wins.',
        ),
        N('The crowd shouts and claps. Your Nubbin claps loudest, standing on your head to see.'),
        ZA(
          'I learned to throw on the peak. The chicks were always losing things over the edge.',
          'happy',
        ),
        N(
          'The champion he beat comes over, rubbing his shoulder, and asks him to teach him that last throw.',
        ),
      ],
      [
        ask(
          4,
          'health',
          'practice makes muscles and skills stronger',
          'CASEL: Self-management',
          [
            N(
              'Zal got strong and skilled by practising every day on the peak. Why does practice make us better?',
            ),
          ],
          [
            o(
              'Muscles and skills grow stronger with repeated use.',
              [
                N(
                  'Yes. Each time we practise, our muscles and our brains adjust a little, so we get better step by step.',
                ),
              ],
              true,
            ),
            o('Practice is boring, so it does not matter.', [
              N('Practice can feel slow, but it is how every skill is built.'),
            ]),
            o('Only talent matters.', [
              N('Talent helps, but practice is what turns it into skill.'),
            ]),
          ],
          'Learned that practice builds muscles and skills through repeated use.',
        ),
      ],
    ),
    sc(
      'a27-15-trials-done',
      [
        SH(
          'Enough. I’m convinced. The young man has brains and arms both, and he answers riddles faster than my mobeds ask them.',
        ),
      ],
      [
        ask(
          0,
          'maths',
          'subtract to compare: 85 and 70 metres',
          '4.NBT.B.4',
          [
            N(
              'Zal’s arrow flew 85 metres, and the best champion’s flew 70 metres. How much further did Zal’s arrow go?',
            ),
          ],
          [
            o('15 metres.', [N('Yes. 85 take away 70 is 15.')], true),
            o('155 metres.', [
              N('That adds the two. We want the difference: 85 take away 70 is 15.'),
            ]),
            o('25 metres.', [N('Check: 85 minus 70 is 15.')]),
          ],
          'Subtracted 70 from 85 to find Zal’s arrow went 15 m further.',
        ),
      ],
    ),
    sc(
      'a27-15-complete',
      [
        N(
          'The Shah writes to Sam himself: he has seen the young man, and finds him worthy, and sends him home satisfied.',
        ),
        SH('Go and marry your princess. And bring me something from the feast.', 'happy'),
        N(
          'Zal rides home with his head high. When Sam reads the Shah’s letter, he looks ten years younger.',
        ),
        N('Your Nubbin has a royal napkin tucked into its collar. It has decided to keep it.'),
      ],
      [
        ask(
          0,
          'social-studies',
          'the Persian Royal Road used relay riders to carry messages fast',
          'D2.His.2.3-5',
          [
            N(
              'Long ago, Persian kings built a Royal Road with stations where riders swapped tired horses for fresh ones. Why did that make letters travel faster?',
            ),
          ],
          [
            o(
              'A fresh horse could go faster, so the message kept moving.',
              [
                N(
                  'Yes. Each rider only rode a short stretch on a fresh horse, and the message never had to stop and rest.',
                ),
              ],
              true,
            ),
            o('The horses were magic.', [
              N('No magic: the speed came from the relay system of fresh horses and riders.'),
            ]),
            o('The road had no hills.', [
              N('It had hills too. The speed came from swapping tired horses for fresh ones.'),
            ]),
          ],
          'Learned how relay riders and fresh horses on the Persian Royal Road made letters travel faster.',
        ),
      ],
    ),
  ],
  [
    gl(
      'riddle',
      'A puzzle told in words, where you work out the answer from clues.',
      'a27-15-riddles',
    ),
    gl('sickle', 'A tool with a curved blade for cutting grass or grain.', 'a27-15-hardest'),
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
      hint: 'Find your place at the long table on the first night.',
    },
  },
  [
    sc(
      'a27-16-arrival',
      [
        N(
          'Kabul is hung with silk banners. Trumpets, harps and cymbals, and the streets sprinkled with rose-water.',
        ),
        N(
          'Mehrab comes out to meet them, and puts a crown of jewels on Zal’s white head. Nobody in the crowd thinks it looks odd.',
        ),
        N(
          'Sindokht is waiting at the door of the king’s house. Sam bows to her as to an old friend.',
        ),
        SA('How much longer are you going to hide Rudaba from me?', 'happy'),
        SK('Hide her? She is our sun. And what is it worth to you, to see her?', 'happy'),
        SA('Anything you like. My horses. My throne. Name it.'),
        N('She laughs, and takes him in through the curtains to the family’s rooms.'),
      ],
      [
        ask(
          1,
          'art',
          'lines of symmetry in a square, as in tiles and carpets',
          '4.G.A.3',
          [
            N(
              'Persian tiles and carpets often use symmetry. How many lines of symmetry does a square tile have?',
            ),
          ],
          [
            o(
              '4.',
              [
                N(
                  'Yes. You can fold a square in half straight across, straight down, and along each diagonal, and both halves match.',
                ),
              ],
              true,
            ),
            o('2.', [
              N('Two are across and down, but there are also the two diagonals: 4 in all.'),
            ]),
            o('1.', [
              N(
                'A square has more than that: straight across, straight down, and two diagonals, so 4.',
              ),
            ]),
          ],
          'Found that a square has four lines of symmetry, as in the tiles and carpets of Persian art.',
        ),
      ],
    ),
    sc(
      'a27-16-arrival-done',
      [
        N('Sam looks at Rudaba for a long time. Then he turns to Zal and shakes his head, slowly.'),
        SA(
          'I don’t have words for her. I fought dragons and never ran out of words. Well done, son.',
          'happy',
        ),
      ],
      [
        ask(
          1,
          'sel',
          'big happy feelings can leave us speechless',
          'CASEL: Self-awareness',
          [
            N(
              'Sam is so happy he has no words. Has a feeling ever been too big for words for you? There is no one right answer.',
            ),
          ],
          [
            o('Yes, when I was very happy.', [
              N('That is a fair answer. Great joy can make words feel too small.'),
            ]),
            o('Yes, when I was nervous or sad.', [
              N('That is a fair answer. Big feelings of any kind can leave us quiet.'),
            ]),
            o('Not yet, but I can imagine it.', [
              N('That is a fair answer. Imagining another person’s feelings is a good first step.'),
            ]),
          ],
          'Reflected on a time when a feeling was too big for words.',
        ),
      ],
    ),
    sc(
      'a27-16-feast',
      [
        N(
          'Zal and Rudaba sit together on one throne, while Mehrab reads out the list of gifts. The list takes most of an afternoon.',
        ),
        N(
          'Then the feast. It goes on for seven days, and nobody gets tired of it, except possibly the cooks.',
        ),
        N(
          'On the first night the maids find you a seat near the front, because the messenger ought to be near the front.',
        ),
        RU(
          'You carried every word. Without you, half of them would have fallen in the river.',
          'happy',
        ),
        ZA(
          'My nestmate. My messenger. What did you bring us? You’re allowed to have brought nothing.',
          'happy',
        ),
        N('Your Nubbin has been told the feast lasts seven days. It is not pacing itself.'),
      ],
      [
        ask(
          5,
          'literacy',
          'multiple-meaning words: pacing yourself',
          'L.3.4',
          [N('Your Nubbin is “not pacing itself”. What does pacing yourself mean here?')],
          [
            o(
              'Going slowly enough to last to the end.',
              [N('Yes. The feast lasts seven days, and your Nubbin is eating as if it ends tonight.')],
              true,
            ),
            o('Walking up and down.', [
              N('That is another meaning of pacing. Here it means going slowly enough to last.'),
            ]),
            o('Eating nothing.', [N('The opposite. Your Nubbin is eating as fast as it can.')]),
          ],
          'Worked out the meaning of pacing yourself from the feast scene.',
        ),
      ],
      [
        ch('down', 'Give them a twist of chick-down from the nest.', [
          N(
            'A soft twist of white down, from the chicks you all slept among. Zal holds it to his face.',
          ),
          ZA('It smells of sandalwood. It smells of home.', 'soft'),
        ]),
        ch('dance', 'Let your Nubbin dance.', [
          N(
            'Your Nubbin dances the only dance it knows, learned from the chicks, with a lot of flapping. Rudaba cries laughing.',
          ),
        ]),
        ch('story', 'Tell them the story of the night in the storm.', [
          N(
            'You tell them about the basket and the storm. Rudaba holds Zal’s hand so hard her knuckles go white.',
          ),
          RU('I’m glad you stayed. I’m glad somebody kind was there.', 'soft'),
        ]),
      ],
    ),
    sc(
      'a27-16-feast-done',
      [
        N(
          'Sindokht leans across and fills your plate, and then your Nubbin’s, and then your Nubbin’s again.',
        ),
      ],
      [
        ask(
          0,
          'maths',
          'unit fractions: three of four equal parts',
          '3.NF.A.1',
          [
            N(
              'Sindokht cuts a pomegranate into 4 equal parts for you to share. Your Nubbin eats 3 before you sit down. What fraction did it eat?',
            ),
          ],
          [
            o(
              '3/4',
              [N('Yes. Three of the four equal parts. You get the last quarter, if you’re quick.')],
              true,
            ),
            o('1/4', [N('That is what is left for you. Your Nubbin ate three of the four parts.')]),
          ],
          'Named three of four equal parts as the fraction 3/4.',
        ),
      ],
    ),
    sc(
      'a27-16-complete',
      [
        N('After a month in Kabul, they all go home to Sistan. This time Zal brings a queen.'),
        RU('And a proper rope. He wouldn’t use the other kind.', 'happy'),
        N(
          'In his father’s hall, Zal sets a crown of gold on her black hair, and she sets her hand on his white head.',
        ),
        N(
          'Your Nubbin has eaten, at a guess, its own weight in wedding cake. It sleeps for two days, smiling.',
        ),
      ],
      [
        ask(
          2,
          'social-studies',
          'customs are kept alive by families passing them on',
          'D2.His.2.3-5',
          [
            N(
              'In Iran today, many weddings still have a lovely decorated spread called a sofreh, with flowers, candles and sweets. How do customs like this last for hundreds of years?',
            ),
          ],
          [
            o(
              'Families pass them on to the next generation.',
              [
                N(
                  'Yes. Each generation learns the custom from the one before, and adds a little of its own.',
                ),
              ],
              true,
            ),
            o('They are written on the walls.', [
              N(
                'Some customs are written down, but most are kept alive by families passing them on.',
              ),
            ]),
            o('They cannot last.', [
              N('Many customs last a very long time, because families pass them on.'),
            ]),
          ],
          'Learned that customs, such as the wedding spread, last because families pass them on.',
        ),
      ],
    ),
  ],
  [
    gl(
      'symmetry',
      'When one half of a shape is a mirror image of the other half.',
      'a27-16-arrival',
    ),
    gl(
      'sofreh',
      'A cloth spread on the floor for a meal. At weddings in Iran it is decorated with flowers, candles and sweets.',
      'a27-16-complete',
    ),
  ],
);

// ================================================================== A27-17 The Feather in the Fire
const A17: EduQuest = quest(
  'a27-17',
  'The Feather in the Fire',
  {
    'a27-17-s1': {
      goal: 'Stay with Zal while Rudaba’s labour goes on.',
      hint: 'Sit with him in the hall outside her rooms.',
    },
    'a27-17-s2': {
      goal: 'Put the feather on the fire.',
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
        N(
          'A year goes by. Rudaba is expecting a baby, and the time has come, and it isn’t going well.',
        ),
        N('The labour is long and hard, and days go by. She can’t rest, by day or by night.'),
        N(
          'Zal sits outside her rooms with his head in his hands. He is the bravest man in Iran, and he can’t do anything.',
          'sad',
        ),
        ZA(
          'I have answered every riddle they ever asked me. I don’t know the answer to this one.',
          'sad',
        ),
        N('Your Nubbin climbs up beside him and leans, warm and heavy, on his arm.'),
        N(
          'Zal lifts his head. He is looking at the box on the shelf, where he keeps the things he brought from the mountain.',
        ),
        ZA('The feather.', 'shock'),
      ],
      [
        ask(
          4,
          'sel',
          'what helps a frightened person most',
          'CASEL: Social awareness',
          [N('Zal is frightened for someone he loves. What helps a frightened person most?')],
          [
            o(
              'Someone staying close, and listening.',
              [N('Yes. You cannot fix everything, but you can stay. Your Nubbin does just that.')],
              true,
            ),
            o('Telling them not to worry.', [
              N(
                'That is kindly meant, but it rarely helps. Staying close and listening helps more.',
              ),
            ]),
            o('Leaving them alone to think.', [
              N(
                'Some people want a little quiet, but most want company. Staying close and listening helps most.',
              ),
            ]),
          ],
          'Learned that staying close and listening helps a frightened person most.',
        ),
      ],
    ),
    sc(
      'a27-17-labour-done',
      [
        N(
          'He takes it out of the box. It is grey and gold, as long as his arm, and he has kept it dry, as he was told.',
        ),
      ],
      [
        ask(
          0,
          'maths',
          'units of length: centimetres to metres',
          '4.MD.A.1',
          [
            N(
              'The feather is as long as Zal’s arm, about 70 centimetres. How long are two such feathers laid end to end?',
            ),
          ],
          [
            o(
              '140 cm, which is 1 metre 40.',
              [N('Yes. 70 plus 70 is 140 centimetres, which is 1 metre and 40 centimetres.')],
              true,
            ),
            o('14 cm.', [N('Check the place value: 70 plus 70 is 140, not 14.')]),
            o('100 cm.', [N('That is one metre. 70 plus 70 is 140 cm, which is 1 metre 40.')]),
          ],
          'Added two 70 cm lengths to make 140 cm, or 1 m 40 cm.',
        ),
      ],
    ),
    sc(
      'a27-17-fire',
      [
        N(
          'Zal goes straight to the brazier in the middle of the hall. He doesn’t stop to think, and he doesn’t need to.',
        ),
        ZA('She said: when you are truly in need. This is the day.'),
        N('He puts the feather on the fire himself, with a steady hand.'),
        N(
          'It doesn’t burn like a feather. It burns slowly, like a candle, with a smell of sandalwood.',
        ),
        N(
          'He came straight down the mountain when his father came back, and he goes straight to the fire now. He has never been one to wait.',
        ),
        N('Outside, all at once, the light goes strange.'),
      ],
      [
        ask(
          3,
          'science',
          'burning is a change that cannot be reversed; melting can',
          undefined,
          [
            N(
              'Once the feather has burned, it can never be a feather again. Which change can be reversed: melting ice, or burning wood?',
            ),
          ],
          [
            o(
              'Melting ice.',
              [
                N(
                  'Yes. Melted ice can be frozen again. Burning makes new things, such as ash and smoke, and cannot be undone.',
                ),
              ],
              true,
            ),
            o('Burning wood.', [
              N('No. Burnt wood cannot become wood again. Melting ice can be refrozen.'),
            ]),
            o('Both can be reversed.', [
              N('Only one can. Melted ice can be frozen again, but burnt wood cannot be unburnt.'),
            ]),
          ],
          'Learned that burning cannot be reversed, but melting can.',
        ),
      ],
    ),
    sc(
      'a27-17-fire-done',
      [N('A sound like a great wind fills the air. Every shutter in the house rattles.')],
      [
        ask(
          0,
          'literacy',
          'onomatopoeia: words that sound like their meaning',
          'L.3.4',
          [N('Shutters rattle in the wind. Which of these words sounds like the noise it names?')],
          [
            o(
              'Rattle.',
              [
                N(
                  'Yes. Rattle sounds like what it means. Words like that are called onomatopoeia.',
                ),
              ],
              true,
            ),
            o('Shutter.', [
              N('Shutter names the thing, but it does not sound like a noise. Rattle does.'),
            ]),
            o('House.', [N('House names a thing, but it does not imitate a sound. Rattle does.')]),
          ],
          'Picked out an onomatopoeic word, rattle, which sounds like what it means.',
        ),
      ],
    ),
    sc(
      'a27-17-wings',
      [
        N('The sky over Sistan goes dark with wings. The whole city looks up.'),
        N(
          'The Simurgh comes down into the courtyard, which is not big enough for her, and makes it do.',
        ),
        N(
          'She looks at Zal, grown, white-haired and frightened, and bends her great head down to his.',
        ),
        SI('My son. Why do you weep? Tell me what is wrong.', 'soft'),
        ZA(
          'Rudaba. It’s Rudaba. She can’t rest, and it’s been days, and nobody knows what to do.',
          'sad',
        ),
        SI(
          'Be easy. I took you in when your father put you out, and I raised you. I have come to help you again.',
          'soft',
        ),
        N(
          'She tells him what to do, slowly and plainly, the way she used to tell him which fish were safe to eat.',
        ),
        N('Zal listens to every word. Then he goes in, and does exactly what she said.'),
      ],
      [
        ask(
          6,
          'sel',
          'when to ask for help',
          'CASEL: Relationship skills',
          [
            N(
              'Zal waited until the day of his need to call the Simurgh. When is the right time to ask for help? There is no one right answer.',
            ),
          ],
          [
            o('As soon as the problem feels too big.', [
              N('That is a fair answer. Asking early often means the problem stays smaller.'),
            ]),
            o('After trying everything we can.', [
              N(
                'That is a fair answer. Zal tried first, and then he called. Both are part of good judgement.',
              ),
            ]),
            o('Whenever we feel unsure.', [
              N(
                'That is a fair answer. Asking is not weakness, and every helper was once a person who asked.',
              ),
            ]),
          ],
          'Thought about when it is right to ask for help.',
        ),
      ],
      [
        ch('thank', 'Thank her for coming.', [
          SI('I said I would come. I keep my word, little stranger. I always did.', 'soft'),
        ]),
        ch('nubbin', 'Let your Nubbin go to her.', [
          N(
            'Your Nubbin runs to her and burrows under her wing, exactly where it used to sleep. She lets it.',
          ),
        ]),
      ],
    ),
    sc(
      'a27-17-wings-done',
      [
        N(
          'The Simurgh settles in the courtyard to wait. You sit down beside her, under the edge of her wing, like old times.',
        ),
      ],
      [
        ask(
          0,
          'maths',
          'divide a length into equal groups: 24 m into 12 m buses',
          '3.OA.A.3',
          [
            N(
              'Her wings spread 24 metres from tip to tip in this story. A bus is about 12 metres long. How many buses would fit end to end across her wings?',
            ),
          ],
          [
            o('2 buses.', [N('Yes. 24 divided by 12 is 2.')], true),
            o('12 buses.', [N('That would be 144 metres. 24 divided by 12 is 2.')]),
            o('36 buses.', [
              N('That adds. To fit buses in a length, divide: 24 divided by 12 is 2.'),
            ]),
          ],
          'Divided 24 m by 12 m to find two bus lengths fit across the wings.',
        ),
      ],
    ),
    sc(
      'a27-17-complete',
      [
        N('Near morning there is a new sound in the house: small, furious and very much alive.'),
        N(
          'The baby is big and strong, with a fist like a walnut. Rudaba laughs, tired out, and holds him up to see.',
        ),
        RU('His name is Rostam. It means delivered: the pain is over, and here he is.', 'happy'),
        N(
          'Before noon a rider sets off for Sam with a doll of the baby sewn in silk, so the grandfather can see his face.',
        ),
        N(
          'Zal comes out into the courtyard with his son in his arms, wrapped up tight, and holds him up to the Simurgh.',
        ),
        ZA('Look. Look what he is. You came the moment I called, and now he’s here.', 'happy'),
        N(
          'The Simurgh looks at the baby, and the baby looks at the Simurgh, and neither of them is at all afraid.',
        ),
        N(
          'The last thing you see on the page is Zal in the courtyard, laughing, with the baby held up to the sky.',
        ),
        N(
          'Over the courtyard wall, one small beak appears. The smallest chick has followed her all the way, and waits at the back, politely.',
        ),
        N('Your Nubbin shares its breakfast with it, smallest first.'),
        N(
          'One feather has drifted down onto the step: grey and gold, long as your arm. The Simurgh doesn’t take it back.',
        ),
        N(
          'You are back in the Grove, the atlas on your knee. The feather has come too, and your Nubbin, fed once already, is asking for second breakfast.',
        ),
      ],
      [
        ask(
          2,
          'literacy',
          'a word with several meanings: delivered',
          'L.3.4',
          [
            N(
              'Rostam’s name means “delivered”. A baby is delivered, a letter is delivered, and a person can be delivered from danger. What do these meanings share?',
            ),
          ],
          [
            o(
              'Something is brought safely from one place to another.',
              [
                N(
                  'Yes. A baby arrives safely, a letter arrives safely, and a person is brought safely out of danger. That is what the name means.',
                ),
              ],
              true,
            ),
            o('They all mean “sent away”.', [
              N('Not quite. In each case something is brought safely to where it needs to be.'),
            ]),
            o('They all mean “lost”.', [
              N('The opposite: in each case something is brought safely where it needs to be.'),
            ]),
          ],
          'Linked the different meanings of delivered, such as a baby, a letter and rescue, to the idea of being brought safely.',
        ),
      ],
    ),
  ],
  [
    gl(
      'brazier',
      'A metal tray or basket that holds a fire, used to heat or light a room.',
      'a27-01-birth',
    ),
    gl(
      'delivered',
      'Brought safely to where something needs to be, such as a baby, a letter, or someone rescued from danger.',
      'a27-17-complete',
    ),
  ],
);

// ================================================================== Variant scenes
/**
 * One EduScene per ATLAS_A27_VARIANTS entry. Each has the same lesson domain as the scene it
 * replaces, so the order of domains holds on every a27-feather path. The margin note and the
 * Corvin line (feelings) differ from the scenes beside them.
 */
export const EDU_A27_READER_VARIANTS: EduScene[] = [
  // s24Done: plays once after a27-04-complete
  sc(
    'a27-margin-hazel',
    [
      N(
        'Nova’s atlas lies open at the great nest on the peak, and the four round chicks, and the small white head among them.',
      ),
      N(
        'Beside the nest, in faint pencil you have never noticed, there is a note in the margin. You know the hand.',
      ),
      N('“White hair at birth. I’d have kept him.”', 'soft'),
      N('And under it, one letter: H.'),
      N(
        'Your Nubbin puts one paw on the drawing of the baby, very gently, the way it touched his hair in the cradle.',
      ),
    ],
    [
      ask(
        3,
        'sel',
        'what it means to keep someone, beyond keeping them safe',
        'CASEL: Social awareness',
        [
          N(
            'Hazel wrote that she would have kept him. What does “keeping” someone mean, beyond keeping them safe? There is no one right answer.',
          ),
        ],
        [
          o('Loving them as they are.', [
            N(
              'That is a fair answer. Hazel’s note says the hair was never the problem, and love does not ask for changes.',
            ),
          ]),
          o('Staying, even when it is hard.', [
            N('That is a fair answer. Keeping someone means being there, which the Simurgh was.'),
          ]),
          o('Making a place where they belong.', [
            N('That is a fair answer. The nest is exactly that, for a baby nobody else wanted.'),
          ]),
        ],
        'Thought about what it means to keep someone beyond keeping them safe, prompted by Hazel’s margin note.',
      ),
    ],
  ),
  // corvinGate = family: one line after a27-07-foot#5
  sc(
    'a27-07-corvin',
    [
      N(
        'For a moment he makes you think of someone else: a man at a stuck gate, lifting and pushing, who came back.',
        'soft',
      ),
    ],
    [
      ask(
        0,
        'sel',
        'why people return to put right what they broke',
        'CASEL: Social awareness',
        [
          N(
            'Sam came back to mend what he broke, and so did the man at the stuck gate. Why do you think people return to put things right? There is no one right answer.',
          ),
        ],
        [
          o('Because they feel guilty.', [
            N('That is a fair answer. Guilt can be a push towards doing better.'),
          ]),
          o('Because they still love someone.', [
            N('That is a fair answer. Love is a strong reason to try again.'),
          ]),
          o('Because they finally see they were wrong.', [
            N(
              'That is a fair answer. Seeing clearly can take a very long time, but it is worth it.',
            ),
          ]),
        ],
        'Thought about why people come back to put right what they broke.',
      ),
    ],
  ),
  // a27-feather = sat
  sc(
    'a27-09-descent-sat',
    [
      N(
        'The Simurgh carries you both down through the cloud, one in each set of talons, the way she brought you up.',
      ),
      N(
        'She sets you down on the slope above the army, a little way off, and goes back up to the edge of the cloud to watch.',
      ),
      N('Sam is still on his knees at the bottom. He hears the stones move, and looks up.'),
      N(
        'The youth walks down slowly: he stops, and looks, and walks on. He is taking his time, the way you let him.',
      ),
      N(
        'Sam gets up off his knees, and doesn’t climb, and doesn’t call out. He waits, as long as it takes.',
        'soft',
      ),
      N(
        'At the bottom the youth stops in front of his father, the feather held to his chest. He has never stood this close to anyone but you.',
      ),
      YO('You waited for me.'),
      N(
        'Sam can’t say anything at all. He just nods, again and again, like someone who has forgotten how to stop.',
      ),
    ],
    [
      ask(
        6,
        'sel',
        'waiting for someone can be a way of respecting them',
        'CASEL: Relationship skills',
        [
          N(
            'Sam waits, and does not climb or call out. Why might waiting be a way of respecting someone? There is no one right answer.',
          ),
        ],
        [
          o('It lets them choose for themselves.', [
            N(
              'That is a fair answer. Waiting gives the other person room to make their own choice.',
            ),
          ]),
          o('It shows we are not in a hurry to be forgiven.', [
            N('That is a fair answer. Patience can say “I know I must earn this”.'),
          ]),
          o('It makes the meeting feel safe.', [
            N('That is a fair answer. When nobody rushes, both people can breathe.'),
          ]),
        ],
        'Thought about how waiting for someone can be a way of showing respect.',
      ),
    ],
  ),
  // a27-feather = night
  sc(
    'a27-09-descent-night',
    [
      N(
        'In the grey of the morning the Simurgh carries you both down through the cloud, the way she brought you up.',
      ),
      N(
        'She sets you down on the slope above the army, a little way off, and goes back up to the edge of the cloud to watch.',
      ),
      N(
        'Sam is still on his knees at the bottom, where he has been all night, in the cold. He hears the stones move, and looks up.',
      ),
      N('The youth comes down to him, rested, with the smell of the nest still on him.'),
      N(
        'Sam opens his mouth to speak, and nothing comes out but a whisper. He has prayed all night, and his voice is gone.',
        'sad',
      ),
      N(
        'The youth stops in front of him, the feather held to his chest. He has never stood this close to anyone but you.',
      ),
      YO('You stayed. All night, on the stones.'),
      N('Sam can only nod, again and again. It turns out that is all he needs to say.'),
    ],
    [
      ask(
        6,
        'sel',
        'whether actions or words matter more when saying sorry',
        'CASEL: Relationship skills',
        [
          N(
            'Sam stayed all night, until his voice was gone, to show he was sorry. Do actions matter more than words when we say sorry? There is no one right answer.',
          ),
        ],
        [
          o('Yes. Actions show we mean it.', [
            N('That is a fair answer. Staying all night says more than any speech.'),
          ]),
          o('No. Words are needed too.', [
            N(
              'That is a fair answer. Sam still has to say it, and the youth still has to hear it.',
            ),
          ]),
          o('Both, together.', [
            N('That is a fair answer. Words give the sorry a shape, and actions give it weight.'),
          ]),
        ],
        'Thought about whether actions or words matter more when saying sorry.',
      ),
    ],
  ),
  // a27-word = taught-sorry (A27-5): replaces a27-09-oath
  sc(
    'a27-09-oath-taught-sorry',
    [
      N(
        'Sam stands up. He bows, very low, to the great bird at the edge of the cloud, and thanks her with his whole voice.',
      ),
      N(
        'Then he looks at his son properly: tall and strong and handsome, with white hair, and nothing wrong in him at all.',
      ),
      SA(
        'I was wrong. I was a coward, and I was wrong, and there is nothing I can say that makes it smaller.',
        'sad',
      ),
      SA('Open your heart to me if you can. I won’t ask for more than you can give.'),
      SA('I’m sorry. I don’t know how to say it any better than that.', 'sad'),
      YO('So that is what it sounds like. I wondered.', 'soft'),
      SA(
        'I swear it, before the one who made us both: my heart will never be closed to you again.',
      ),
      SA('And I will give you anything you ever ask of me.'),
      N(
        'He gives his son a name: Zal, which means the old one, for the white hair. This time, he says it with pride.',
      ),
      ZA('Zal. I like it. It sounds like a door shutting on the right side.', 'happy'),
    ],
    [
      ask(
        8,
        'literacy',
        'theme: the same feature can be shame or pride',
        'RL.4.2',
        [
          N(
            'At first Sam was ashamed of the white hair. Now he gives the name Zal, “the old one”, with pride. What does this show?',
          ),
        ],
        [
          o(
            'The same thing can feel like shame or pride, depending on how people choose to see it.',
            [N('Yes. Nothing about the hair changed. What changed was how Sam saw it.')],
            true,
          ),
          o('Names do not matter.', [
            N('In this story the name matters a lot. It turns the shame into pride.'),
          ]),
          o('The hair turned black.', [N('It is still white. What changed was how Sam saw it.')]),
        ],
        'Explored a theme: how choosing to see something differently can turn shame into pride.',
      ),
    ],
    [
      ch('clap', 'Clap.', [
        N(
          'You clap, and your Nubbin claps. After a moment, uncertainly, so does the whole army.',
        ),
      ]),
      ch('bow', 'Bow to Zal.', [
        ZA('You don’t bow to me. You are my nestmate. Stand up.', 'happy'),
      ]),
    ],
  ),
  // a27-word = taught-home (A27-5): replaces a27-09-road
  sc(
    'a27-09-road-taught-home',
    [
      N(
        'The army goes home to Sistan with drums and trumpets and cymbals, all the way, so that every village knows.',
      ),
      N(
        'Zal rides at the front beside his father. You ride on the baggage, on a heap of tent poles, with your Nubbin in your lap.',
      ),
      ZA('It is very loud. Is the world always this loud?', 'think'),
      SA('Only when it’s happy.', 'happy'),
      ZA('Is Sistan where I come back to now? I was told that is what home means.', 'think'),
      SA('Yes. It’s louder than a nest, but yes.', 'soft'),
      N(
        'The old servant walks beside the baggage, holding the bridle of the mule, and is the quietest man in the army.',
      ),
      N(
        'Behind you, high above the cloud, a great bird turns once in the sky, and turns again, and goes home.',
        'soft',
      ),
    ],
    [
      ask(
        5,
        'music',
        'sound is made by vibrations, which travel through the air',
        '4-PS3-2',
        [N('A drum is loud enough to hear in every village. How does a drum make sound?')],
        [
          o(
            'The drum skin vibrates, and the vibrations travel through the air.',
            [
              N(
                'Yes. Hit the skin and it shakes, and the shaking pushes the air, so the sound travels to your ears.',
              ),
            ],
            true,
          ),
          o('The drum glows.', [
            N(
              'A drum makes no light. Its skin vibrates, and the vibrations travel through the air as sound.',
            ),
          ]),
          o('The drum talks to the army.', [
            N(
              'Ha. In a way, but the real answer is vibration: the skin shakes and the air carries the sound.',
            ),
          ]),
        ],
        'Learned that sound comes from vibrations, as when a drum skin shakes.',
      ),
    ],
  ),
  // a27-word = taught-friend (A27-5): replaces a27-09-complete
  sc(
    'a27-09-complete-taught-friend',
    [
      N(
        'At the gate the people throw flowers and blessings, and Zal catches a rose, and doesn’t know what to do with it.',
      ),
      N(
        'Your Nubbin knows: it eats it. Zal laughs so hard that he has to hold on to his father’s arm.',
      ),
      SA('You laugh with your whole self. I had forgotten people could.', 'soft'),
      ZA('The chicks taught me. They do everything with their whole selves.', 'happy'),
      ZA('Father, this is my friend. Someone who isn’t family, but stays anyway.', 'happy'),
      SA('Then they’re family now. That’s how it works here.'),
      ZA('Then I shall need another word.', 'think'),
      N('Sam takes his son by the arm, and they go in together.'),
    ],
    [
      ask(
        2,
        'sel',
        'mixed feelings: joy with sorrow for lost time',
        'CASEL: Social awareness',
        [
          N(
            'Sam says he had forgotten that people could laugh like that. What feelings might be mixed in his voice?',
          ),
        ],
        [
          o(
            'Joy, and sadness for the years he lost.',
            [
              N(
                'Yes. He is delighted now, and sorry about the time he missed. Both feelings can be true together.',
              ),
            ],
            true,
          ),
          o('Only anger.', [
            N('There is no anger here. His voice is soft, and mixed with joy and regret.'),
          ]),
          o('Only boredom.', [
            N('Not boredom. Sam is moved, with joy and regret mixed together.'),
          ]),
        ],
        'Noticed mixed feelings, joy and regret, in a character’s words.',
      ),
    ],
  ),
  // a27-feather = sat
  sc(
    'a27-14-letter-sat',
    [
      N(
        'In the morning Zal calls a scribe, and walks up and down the tent while he speaks, and the scribe writes.',
      ),
      ZA(
        'Father. You put me out on a mountain. A bird raised me. The sun beat on my head, and I ate what she brought.',
      ),
      ZA(
        'All that time you sat in a good house, in silk. I don’t say it to hurt you. I say it because it’s true.',
      ),
      ZA(
        'You swore you would give me anything I asked. I have never asked you for anything. This is the one thing.',
      ),
      ZA('I love Rudaba, Mehrab’s daughter. I want to marry her.'),
      ZA('I learned to wait on a mountain. I can wait for you.', 'soft'),
      N('He seals it, and holds it out to you, not to the messenger who is waiting.'),
      ZA(
        'You carry it. You sat with me, that day at the edge. He should see your face when he reads it.',
      ),
    ],
    [
      ask(
        4,
        'literacy',
        'how to write something hard, honestly and kindly',
        'RL.3.3',
        [
          N(
            'Zal’s letter says hard things, and asks for something. Which helps most when you write something hard?',
          ),
        ],
        [
          o(
            'Say what happened, say how you feel, and then say what you ask.',
            [N('Yes. Zal does all three, and he says plainly that he is not trying to hurt.')],
            true,
          ),
          o('Make it as angry as possible.', [
            N(
              'Anger can be honest, but it often stops the other person listening. Zal says what is true without trying to hurt.',
            ),
          ]),
          o('Leave out the truth.', [
            N('A letter without the truth cannot help. Zal says it kindly, and says it anyway.'),
          ]),
        ],
        'Learned a way to write a hard letter: say what happened, say how you feel, then say what you ask.',
      ),
    ],
  ),
  // a27-feather = night
  sc(
    'a27-14-letter-night',
    [
      N(
        'In the morning Zal calls a scribe, and walks up and down the tent while he speaks, and the scribe writes.',
      ),
      ZA(
        'Father. You put me out on a mountain. A bird raised me. The sun beat on my head, and I ate what she brought.',
      ),
      ZA(
        'All that time you sat in a good house, in silk. I don’t say it to hurt you. I say it because it’s true.',
      ),
      ZA(
        'You swore you would give me anything I asked. I have never asked you for anything. This is the one thing.',
      ),
      ZA('I love Rudaba, Mehrab’s daughter. I want to marry her.'),
      ZA('I made you wait one night. You made me wait many. Let’s call it even.', 'happy'),
      N('He seals it, and holds it out to you, not to the messenger who is waiting.'),
      ZA(
        'You carry it. You asked for my last night in the nest. He should see your face when he reads it.',
      ),
    ],
    [
      ask(
        4,
        'literacy',
        'how to write something hard, honestly and kindly',
        'RL.3.3',
        [
          N(
            'Zal’s letter says hard things, and asks for something. Which helps most when you write something hard?',
          ),
        ],
        [
          o(
            'Say what happened, say how you feel, and then say what you ask.',
            [N('Yes. Zal does all three, and he says plainly that he is not trying to hurt.')],
            true,
          ),
          o('Make it as angry as possible.', [
            N(
              'Anger can be honest, but it often stops the other person listening. Zal says what is true without trying to hurt.',
            ),
          ]),
          o('Leave out the truth.', [
            N('A letter without the truth cannot help. Zal says it kindly, and says it anyway.'),
          ]),
        ],
        'Learned a way to write a hard letter: say what happened, say how you feel, then say what you ask.',
      ),
    ],
  ),
  // a27-feather = sat
  sc(
    'a27-17-fire-sat',
    [
      N(
        'Zal goes to the brazier in the middle of the hall, and stops, and stands there with the feather in his hands.',
      ),
      ZA('She said: when you are truly in need. This is the day.'),
      N('He holds it a long moment. You don’t hurry him; you never have.'),
      N('Then he turns round and holds it out to you.'),
      ZA(
        'You put it on. You sat with me at the edge until I could stand. Sit with me now.',
        'soft',
      ),
      N(
        'You take the feather and lay it on the fire, and sit down beside him on the step. He leans on your shoulder.',
      ),
      N(
        'It doesn’t burn like a feather. It burns slowly, like a candle, with a smell of sandalwood.',
      ),
      N('Outside, all at once, the light goes strange.'),
    ],
    [
      ask(
        6,
        'science',
        'burning is a change that cannot be reversed; melting can',
        undefined,
        [
          N(
            'Once the feather has burned, it can never be a feather again. Which change can be reversed: melting ice, or burning wood?',
          ),
        ],
        [
          o(
            'Melting ice.',
            [
              N(
                'Yes. Melted ice can be frozen again. Burning makes new things, such as ash and smoke, and cannot be undone.',
              ),
            ],
            true,
          ),
          o('Burning wood.', [
            N('No. Burnt wood cannot become wood again. Melting ice can be refrozen.'),
          ]),
          o('Both can be reversed.', [
            N('Only one can. Melted ice can be frozen again, but burnt wood cannot be unburnt.'),
          ]),
        ],
        'Learned that burning cannot be reversed, but melting can.',
      ),
    ],
  ),
  // a27-feather = night
  sc(
    'a27-17-fire-night',
    [
      N(
        'Zal goes to the brazier in the middle of the hall, and looks at the feather for a moment.',
      ),
      ZA('She said: when you are truly in need. This is the day.'),
      ZA('She gave me a night, once, because you asked. I hope she has one more in her.', 'soft'),
      N('He lays the feather on the fire. Your Nubbin stands beside him, holding on to his boot.'),
      N(
        'It doesn’t burn like a feather. It burns slowly, like a candle, with a smell of sandalwood.',
      ),
      N('Outside, all at once, the light goes strange.'),
    ],
    [
      ask(
        4,
        'science',
        'burning is a change that cannot be reversed; melting can',
        undefined,
        [
          N(
            'Once the feather has burned, it can never be a feather again. Which change can be reversed: melting ice, or burning wood?',
          ),
        ],
        [
          o(
            'Melting ice.',
            [
              N(
                'Yes. Melted ice can be frozen again. Burning makes new things, such as ash and smoke, and cannot be undone.',
              ),
            ],
            true,
          ),
          o('Burning wood.', [
            N('No. Burnt wood cannot become wood again. Melting ice can be refrozen.'),
          ]),
          o('Both can be reversed.', [
            N('Only one can. Melted ice can be frozen again, but burnt wood cannot be unburnt.'),
          ]),
        ],
        'Learned that burning cannot be reversed, but melting can.',
      ),
    ],
  ),
  // a27-feather = sat
  sc(
    'a27-17-complete-sat',
    [
      N('Near morning there is a new sound in the house: small, furious and very much alive.'),
      N(
        'The baby is big and strong, with a fist like a walnut. Rudaba laughs, tired out, and holds him up to see.',
      ),
      RU('His name is Rostam. It means delivered: the pain is over, and here he is.', 'happy'),
      N(
        'Before noon a rider sets off for Sam with a doll of the baby sewn in silk, so the grandfather can see his face.',
      ),
      N(
        'Zal comes out into the courtyard with his son in his arms, and sits down on the step beside you, and doesn’t say anything at all.',
      ),
      N('He doesn’t need to. You sit there together, all three of you, and let the morning come.'),
      N(
        'Days later, far away in his camp, Sam opens a parcel and finds a little silk doll with his grandson’s face.',
      ),
      N(
        'The last thing you see on the page is Sam, the great champion, holding the doll in both hands and weeping for joy.',
        'soft',
      ),
      N(
        'Over the courtyard wall, one small beak appears. The smallest chick has followed her all the way, and waits at the back, politely.',
      ),
      N('Your Nubbin shares its breakfast with it, smallest first.'),
      N(
        'One feather has drifted down onto the step: grey and gold, long as your arm. The Simurgh doesn’t take it back.',
      ),
      N(
        'You are back in the Grove, the atlas on your knee. The feather has come too, and your Nubbin, fed once already, is asking for second breakfast.',
      ),
    ],
    [
      ask(
        2,
        'literacy',
        'a word with several meanings: delivered',
        'L.3.4',
        [
          N(
            'Rostam’s name means “delivered”. A baby is delivered, a letter is delivered, and a person can be delivered from danger. What do these meanings share?',
          ),
        ],
        [
          o(
            'Something is brought safely from one place to another.',
            [
              N(
                'Yes. A baby arrives safely, a letter arrives safely, and a person is brought safely out of danger. That is what the name means.',
              ),
            ],
            true,
          ),
          o('They all mean “sent away”.', [
            N('Not quite. In each case something is brought safely to where it needs to be.'),
          ]),
          o('They all mean “lost”.', [
            N('The opposite: in each case something is brought safely where it needs to be.'),
          ]),
        ],
        'Linked the different meanings of delivered, such as a baby, a letter and rescue, to the idea of being brought safely.',
      ),
    ],
  ),
  // a27-feather = night
  sc(
    'a27-17-complete-night',
    [
      N('Near morning there is a new sound in the house: small, furious and very much alive.'),
      N(
        'The baby is big and strong, with a fist like a walnut. Rudaba laughs, tired out, and holds him up to see.',
      ),
      RU('His name is Rostam. It means delivered: the pain is over, and here he is.', 'happy'),
      N(
        'Before noon a rider sets off for Sam with a doll of the baby sewn in silk, so the grandfather can see his face.',
      ),
      N(
        'Zal comes out into the courtyard with his son in his arms, and holds him up to the Simurgh.',
      ),
      N('She looks at the baby for a long time. Then she turns her great gold eye on you.'),
      SI('You were right to give him the night.', 'soft'),
      N('She spreads her wings, which fill the whole sky over Sistan, and goes up.'),
      N(
        'The last thing you see on the page is the Simurgh circling over the house, once and again, before she turns for home.',
      ),
      N(
        'Over the courtyard wall, one small beak appears. The smallest chick has followed her all the way, and waits at the back, politely.',
      ),
      N('Your Nubbin shares its breakfast with it, smallest first.'),
      N(
        'One feather has drifted down onto the step: grey and gold, long as your arm. The Simurgh doesn’t take it back.',
      ),
      N(
        'You are back in the Grove, the atlas on your knee. The feather has come too, and your Nubbin, fed once already, is asking for second breakfast.',
      ),
    ],
    [
      ask(
        2,
        'literacy',
        'a word with several meanings: delivered',
        'L.3.4',
        [
          N(
            'Rostam’s name means “delivered”. A baby is delivered, a letter is delivered, and a person can be delivered from danger. What do these meanings share?',
          ),
        ],
        [
          o(
            'Something is brought safely from one place to another.',
            [
              N(
                'Yes. A baby arrives safely, a letter arrives safely, and a person is brought safely out of danger. That is what the name means.',
              ),
            ],
            true,
          ),
          o('They all mean “sent away”.', [
            N('Not quite. In each case something is brought safely to where it needs to be.'),
          ]),
          o('They all mean “lost”.', [
            N('The opposite: in each case something is brought safely where it needs to be.'),
          ]),
        ],
        'Linked the different meanings of delivered, such as a baby, a letter and rescue, to the idea of being brought safely.',
      ),
    ],
  ),
  // Sable's trust stage: bonded
  sc(
    'a27-close-sable-bonded',
    [
      N(
        'You shut the atlas, and put the feather in a glass on the cottage mantel, where the light can get at it.',
      ),
      N(
        'When you look back, Sable is curled up asleep on the mantel shelf, right underneath it. You didn’t see her get up there.',
      ),
      N(
        'The tip of the feather moves a little in her breathing. She doesn’t wake, and you don’t wake her.',
        'soft',
      ),
    ],
    [
      ask(
        2,
        'sel',
        'trust shows in where someone chooses to rest',
        'CASEL: Relationship skills',
        [
          N(
            'Sable chose to sleep right under the feather, in your cottage. What does it tell us about trust when a shy animal sleeps near you?',
          ),
        ],
        [
          o(
            'That she feels safe near you.',
            [
              N(
                'Yes. A shy animal rests only where it feels safe, so her sleep is a sign of trust you earned.',
              ),
            ],
            true,
          ),
          o('That she is bored.', [
            N('Possibly, but a shy animal sleeping deeply near you is mostly a sign of trust.'),
          ]),
          o('That nothing is happening.', [
            N('A lot is happening. She feels safe enough to sleep, and that is trust.'),
          ]),
        ],
        'Learned that a shy animal sleeping nearby shows it feels safe and trusts you.',
      ),
    ],
  ),
  // Sable's trust stage: met, not bonded
  sc(
    'a27-close-sable-wary',
    [
      N(
        'You shut the atlas. The feather has slipped out of your hand somewhere, and you can’t find it.',
      ),
      N(
        'Then you do: on the ground at the edge of the long grass. Sable is lying in the grass a little way off, watching it.',
      ),
      N(
        'She doesn’t touch it, and she doesn’t go. When you pick it up, her eyes follow it all the way to the mantel.',
        'soft',
      ),
    ],
    [
      ask(
        2,
        'sel',
        'trust grows slowly; caution and curiosity can sit together',
        'CASEL: Relationship skills',
        [
          N(
            'Sable watches, but stays near. What does it tell us when someone is wary and curious at the same time?',
          ),
        ],
        [
          o(
            'That trust is growing, slowly.',
            [
              N(
                'Yes. Staying nearby while watching carefully is a first step. Patience and kindness help it grow.',
              ),
            ],
            true,
          ),
          o('That she dislikes you.', [
            N('Not necessarily. If she disliked you she would leave, but she stays, watching.'),
          ]),
          o('That she is about to bite.', [
            N(
              'Unlikely. A wary animal that stays near is usually curious and deciding whether to trust.',
            ),
          ]),
        ],
        'Learned that an animal that is wary but stays nearby may be starting to trust.',
      ),
    ],
  ),
];

// ================================================================== exports
export const EDU_A27_READER: EduQuest[] = [
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
export const CHECKS: string[] = [];
