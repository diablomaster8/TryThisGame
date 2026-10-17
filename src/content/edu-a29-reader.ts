/**
 * The Learning Grove, reader band (ages 7–10): Atlas page A29, The Honmoon (Korea, Seoul).
 *
 * Source: atlas-a29.ts (ATLAS_A29 and ATLAS_A29_VARIANTS). One EduScene per original scene (every
 * step scene, every done scene, every complete scene and every variant), id `reader:<original id>`,
 * with every choice kept under its original id and `set` flag (`a29-sleeve` in a29-06-sleeve; the
 * Sable variants keep their `a29-sable` flag). Reader keeps all choices, so no `defaultChoice` is
 * needed. This page has no sprout version (the outline says reader band only). See EDU-STYLE.md.
 * British spelling.
 *
 * Learning angles, from the outline: where Korea is (a peninsula in East Asia, water on three
 * sides) and where Seoul is; hangul, the Korean alphabet made by King Sejong’s scholars in the
 * fifteenth century so that everyone could read; the tiger and the magpie in Korean folk painting
 * (minhwa); Seoul places (the old city wall, Namsan Tower, the hanok houses); and that everyone has
 * something they think they should hide. Also: sound and vibration, light and colour, materials,
 * heating and cooling, shadows and seasonal rain, time intervals, multiplication and division with
 * story numbers, similes and motive, fairness and voting, and feelings.
 *
 * Softened for this band, as the outline says: no soul-eating. The demons “steal people’s cheer”,
 * and the film’s own word for the sealed Honmoon is never used (here it is “sealed for good”).
 * There are no lyrics, no song titles and no lifted text anywhere; every line is original.
 *
 * Think questions (`ask` with no `best`) in every quest, and one `sel` lesson in every quest.
 * Domains never repeat back to back, across scenes and across quests. Each variant scene has the
 * same domain as the scene it replaces; each variant that plays in addition to a scene differs from
 * the scenes on either side of it, so the order holds on every path (Sable hid or heel, and all
 * three a29-sleeve paths).
 *
 * Care notes kept: Rumi’s marks are never ugly, never an illness and never “fixed” (the last
 * scenes say so plainly); Celine is afraid for Rumi and is never the villain; the jeoseung saja
 * are named as the serious, kind messengers of old stories, and the demons only borrow their look;
 * the gat is described with respect; the tiger and magpie are the silly and the bright, never
 * menacing; Jinu’s end is light, said plainly (he is gone and will not come back), with comfort
 * straight after; Gwi-Ma is huge and slow, never gory; no one is hurt on screen. Korean words are
 * few and glossed: hangul, hanok, hanji, maru, gat, minhwa, jeoseung saja.
 *
 * Facts used (all well established): Korea is a peninsula in East Asia with sea on three sides;
 * Seoul is the capital of South Korea and lies on the Han River, with more than nine million
 * people; King Sejong the Great ruled Joseon from 1418 to 1450; hangul was made around 1443 and
 * announced in 1446, about 580 years ago; before it most writing used Chinese characters, which take
 * years to learn; modern hangul has 24 letters, 14 consonants and 10 vowels, stacked in square
 * blocks, one block for each syllable; hangul is “han” plus “geul” (writing); hanji is paper made
 * from the bark of the paper mulberry tree; a gat is a hat of fine horsehair and bamboo from the
 * Joseon period; the Seoul city wall is about 18 kilometres long and more than 600 years old; Namsan
 * is a hill in the middle of Seoul with a tower on top; a hanok has a tiled roof with curving
 * eaves, a wooden-floored maru, paper doors, and underfloor heating called ondol; Korean pears are
 * large and round and are often wrapped in foam nets; boricha is roasted barley tea and has no
 * caffeine; in Korean folk painting the magpie brings good news; Korea’s rainy season (jangma) runs
 * from late June into July; the Sun is low in the evening, so shadows are long; water boils at
 * 100 °C (212 °F) and steam turns back into water when it cools; sunlight is all colours mixed,
 * and red, green and blue light together make white; vibrations make sound, foam soaks up echoes,
 * and thin paper lets sound through more than a thick wall.
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
const R = say('a29-rumi');
const M = say('a29-mira');
const Z = say('a29-zoey');
const J = say('a29-jinu');
const C = say('a29-celine');
const B = say('a29-bobby');
const G = say('a29-gwima');
const F = say('a29-fan');
const LU = say('luna');

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

// ================================================================== A29-1 The First Hunters
const Q1: EduQuest = quest(
  'a29-01',
  'The First Hunters',
  {
    'a29-01-s1': {
      goal: 'Step into the old ink scroll, and find out where this page is.',
      hint: 'Touch the scroll at the bottom of the page, not the stage.',
    },
    'a29-01-s2': {
      goal: 'Walk along the scroll, one generation at a time.',
      hint: 'Follow the road along the scroll. Each painting is a new set of hunters.',
    },
  },
  [
    sc(
      'a29-01-scroll',
      [
        N(
          'Nova’s atlas falls open at a page so bright it hums: a stage, a city at night, and a tiger in a hat grinning from a corner.',
        ),
        N(
          'Under the paint, older, there is a long ink scroll. Mountains, small villages, and a road between them.',
        ),
        N(
          'A card from Nova is tucked into the page. It says to find Korea on the big map before you step in.',
        ),
        N(
          'You touch the scroll. It is cool, like paper left by a window. Then it is mist, and you are standing in the painting.',
        ),
        N(
          'Everything is ink: the hills, the pines, the roofs, even your sleeve. Your Nubbin is a round grey brushstroke at your feet.',
        ),
        N(
          'Over the far mountains come demons, drawn fast and badly, all teeth. Where they pass, the villagers go pale, as if someone wiped the colour off.',
        ),
        N(
          'A voice in the painting says the demons steal people’s cheer and carry it down to their king. He is a red smudge, the only colour in the scroll. His name is Gwi-Ma.',
          'think',
        ),
      ],
      [
        ask(
          2,
          'social-studies',
          'finding a place on a map: Korea is a peninsula, with sea on three sides',
          'D2.Geo.2.K-2',
          [
            N(
              'On Nova’s big map, Korea hangs down from the north like a thumb into the sea. How many of its sides have water?',
            ),
          ],
          [
            o(
              'Three sides.',
              [
                N('Yes. Land with water on three sides is called a peninsula, and Korea is one.'),
                N('Seoul, the big city in this story, is the capital of South Korea.'),
              ],
              true,
            ),
            o('Only one side.', [
              N('Not quite. Look at the map again: sea on the west, the south and the east.'),
              N('Water on three sides makes Korea a peninsula.'),
            ]),
            o('All four sides.', [
              N('Good thinking. Land with water on all four sides is an island.'),
              N(
                'Korea is joined to the rest of Asia in the north, so it has water on three sides.',
              ),
            ]),
          ],
          'Found Korea on a map and learned that it is a peninsula, with water on three sides.',
        ),
      ],
      [
        ch('look', 'Look at the people in the villages.', [
          N(
            'A woman in the nearest village holds a bowl of rice and has forgotten why. You want very much to give her back her colour.',
            'sad',
          ),
        ]),
        ch('nubbin', 'Pick up your Nubbin.', [
          N(
            'You lift your Nubbin, and in your arms it goes back to its own colour, and so does your hand. Good. Keep hold.',
          ),
        ]),
        ch('king', 'Look at the red smudge.', [
          N(
            'You look at it a moment too long, and it seems to look back. You look away first.',
            'shock',
          ),
        ]),
      ],
    ),
    sc(
      'a29-01-scroll-done',
      [
        N(
          'On a hill above the villages, three small figures climb to the top. They wear long skirts and short jackets, in the painter’s soft colours.',
        ),
        N('They turn to face the mountains, and take one big breath together.'),
      ],
      [
        ask(
          1,
          'science',
          'a voice is made by vibrations in the throat',
          '1-PS4-1',
          [
            N(
              'Try it: put your fingers lightly on your throat and hum. What do you feel under your fingers?',
            ),
          ],
          [
            o(
              'A buzzing, a tiny shaking.',
              [
                N(
                  'Yes. Your voice is made by tiny vibrations in your throat, and the shaking makes the air shake too.',
                ),
                N('That moving air is what carries a sound to someone’s ear.'),
              ],
              true,
            ),
            o('Nothing at all.', [
              N('Try again, a little lower, and press just a bit more firmly.'),
              N('There is a buzzing, a tiny shaking. That is the vibration that makes your voice.'),
            ]),
            o('Something hot.', [
              N('It can feel warm, because your hand is warm.'),
              N('But the thing to feel is a buzz. A voice is made of vibrations.'),
            ]),
          ],
          'Felt the vibration in the throat when humming, and learned that vibrations make a voice.',
        ),
      ],
    ),
    sc(
      'a29-01-hunters',
      [
        N(
          'The three women open their mouths and sing. You hear no words, only something like a held breath let go.',
        ),
        N(
          'Where the sound goes, the ink brightens into a shining line. It runs along the mountain ridge and closes like a stitch.',
        ),
        N(
          'The demons hit the line and stop. They pace along it and cannot cross, and the villagers get their colour back.',
        ),
        N(
          'A label in neat brushwork says the line is called the Honmoon. A voice holds it up, and only voices can keep it up.',
        ),
        N(
          'You walk on, and the scroll walks with you. Three new hunters on the hill, then three more, generation after generation.',
        ),
        N(
          'Each three hope to sing so well that the line is sealed shut for good. Nobody ever has. The last painting shows three girls on a stage, under lights that are not painted at all.',
        ),
      ],
      [
        ask(
          4,
          'literacy',
          'working out the meaning of a new word from its context: generation',
          'L.3.4',
          [
            N(
              'The scroll says “generation after generation”. Three hunters, then the next three, and the next. What is a generation?',
            ),
          ],
          [
            o(
              'A group of people born around the same time, followed by the next group.',
              [
                N('Yes. Your grandparents, your parents and you are three different generations.'),
                N('The hunters pass the Honmoon down the generations, like a family recipe.'),
              ],
              true,
            ),
            o('One single very old person.', [
              N('Not quite. A generation is a whole group of people of about the same age.'),
              N('The painting shows many groups, one after another, each taking a turn.'),
            ]),
            o('Everybody who is alive today.', [
              N('Close, but a generation is smaller: the people born around the same time.'),
              N(
                'The hunters on the scroll are different generations, because they lived in different times.',
              ),
            ]),
          ],
          'Worked out that a generation is a group born around the same time, using the scroll as a clue.',
        ),
      ],
      [
        ch('hum', 'Let your Nubbin hum along.', [
          N(
            'Your Nubbin hums, flat and happy. The shining line wobbles very slightly, as if it has been tickled.',
            'happy',
          ),
        ]),
        ch('quiet', 'Listen without a sound.', [
          N(
            'You listen. It is the kind of music that makes you stand up straighter without deciding to.',
          ),
        ]),
      ],
    ),
    sc(
      'a29-01-hunters-done',
      [
        N(
          'The ink goes from black to bright pink, then electric blue: car horns, rain on hot pavement. You step off the scroll into a city at night.',
        ),
        N(
          'Behind you, a label at the edge of the scroll says the painter used a brush and black ink, on a thick, soft paper called hanji.',
        ),
      ],
      [
        notice(
          1,
          'social-studies',
          'Korean ink painting: brush, ink and hanji paper made from mulberry bark',
          'D2.His.2.K-2',
          [
            N(
              'The label goes on: hanji is made from the bark of the paper mulberry tree, by hand, in Korea, for hundreds of years.',
            ),
            N('Painters used it for scrolls like this one. Good hanji can last a very long time.'),
          ],
          'Learned that Korean ink paintings are made on hanji, a paper from mulberry bark, and that people have used it for centuries.',
        ),
      ],
    ),
    sc(
      'a29-01-complete',
      [
        N(
          'A man in a good suit and bad trainers hurries at you with two phones, a clipboard and a face that hasn’t slept.',
        ),
        B(
          'You! Are you the new runner? You’re the new runner. You’re late. It doesn’t matter. Hold these.',
        ),
        N(
          'He gives you a bag of instant noodles, a box of light sticks, and a lanyard with your face on it, somehow.',
        ),
        B(
          'I’m Bobby. I manage Huntrix, the biggest group in Korea. Tonight is a sold-out show, and I am very calm.',
        ),
        N(
          'Your Nubbin climbs into the merchandise bag among the T-shirts, and looks out like a passenger on a bus.',
        ),
        B('Don’t touch the girls’ cases. Never touch the girls’ cases. Go, go, go.'),
      ],
      [
        ask(
          3,
          'sel',
          'people sometimes say they are fine when they are not',
          'CASEL: Self-awareness',
          [
            N(
              'Bobby says he is very calm, and he has not stopped running about. Why might someone say they are calm when they are not?',
            ),
          ],
          [
            o('To help themselves feel calm.', [
              N('That is a fair answer. Saying it can help a little, like a cheer for yourself.'),
              N('But it does not always work, and Bobby is the proof.'),
            ]),
            o('So other people don’t worry.', [
              N('That is a kind thought. Many people hide a worry to protect others.'),
              N('Sometimes it works better to say it out loud and ask for help. Remember that.'),
            ]),
            o('Because they are being funny.', [
              N('That is a fair answer too. A joke can be a way to let out nerves.'),
              N('Bobby is funny, and he is also tired. Both can be true at once.'),
            ]),
          ],
          'Thought about why people say they are calm or fine when they are not.',
        ),
      ],
    ),
  ],
  [
    gl('peninsula', 'A piece of land with sea on three sides.', 'a29-01-scroll'),
    gl('generation', 'A group of people born around the same time.', 'a29-01-hunters'),
    gl(
      'hanji',
      'A soft, strong paper made by hand from the bark of the paper mulberry tree.',
      'a29-01-hunters-done',
    ),
  ],
);

// ================================================================== A29-2 Huntrix
const Q2: EduQuest = quest(
  'a29-02',
  'Huntrix',
  {
    'a29-02-s1': {
      goal: 'Get the merchandise to the stalls before the doors open.',
      hint: 'Carry the boxes through the backstage corridor to the arena foyer.',
    },
    'a29-02-s2': {
      goal: 'Watch the show from the wings, out of everyone’s way.',
      hint: 'Stand by the side curtain, behind the yellow tape.',
    },
    'a29-02-s3': {
      goal: 'Carry the girls’ gear case to the car park.',
      hint: 'Bobby said never to touch it. Rumi just said to bring it.',
    },
  },
  [
    sc(
      'a29-02-backstage',
      [
        N(
          'Backstage is a corridor of black curtains, tape and people in headsets, all saying “copy” to nobody. A clock on the wall says 7:21.',
        ),
        N(
          'Three girls are warming up in a doorway. One does scales, one does stretches, and one eats a rice ball very fast.',
        ),
        Z(
          'Ooh, new runner! I’m Zoey. Is that a creature in the merch bag, or a very round T-shirt?',
          'happy',
        ),
        M('Mira. Don’t let Bobby see that. He’ll put it on a mug.'),
        N(
          'The third girl smiles at you properly. She has a long purple plait and long sleeves, though the corridor is roasting.',
        ),
        R(
          'I’m Rumi. Thanks for coming tonight. Bobby forgets to say it, so I say it twice. Thanks.',
        ),
        B('Runner! Merch! Foyer! The doors open at 7:30!'),
      ],
      [
        ask(
          6,
          'maths',
          'time intervals: minutes from 7:21 to 7:30',
          '3.MD.A.1',
          [
            N(
              'The clock says 7:21, and Bobby says the doors open at 7:30. How many minutes have you got?',
            ),
          ],
          [
            o(
              '9 minutes.',
              [
                N('Yes. From 7:21 to 7:30 is 9 minutes: count on 9 minutes to the half hour.'),
                N('That is just enough time to carry three boxes if you walk fast.'),
              ],
              true,
            ),
            o('11 minutes.', [
              N('Let’s count on together from 7:21: 7:22, 7:23, all the way up to 7:30.'),
              N('That is 9 minutes. Start walking.'),
            ]),
            o('30 minutes.', [
              N('The 30 is the time the doors open, not how long is left.'),
              N('Count on from 7:21 to 7:30, and you get 9 minutes.'),
            ]),
          ],
          'Worked out a time interval, 9 minutes from 7:21 to 7:30.',
        ),
      ],
      [
        ch('wave', 'Let your Nubbin wave.', [
          Z('It waved. It waved at me. I’m keeping it.', 'happy'),
          M('You can’t keep the runner’s pet.'),
        ]),
        ch('nod', 'Nod and grab the boxes.', [R('A runner who runs. Bobby might cry.', 'happy')]),
      ],
    ),
    sc(
      'a29-02-backstage-done',
      [
        N(
          'The foyer is already a sea of light sticks, and someone nearly buys a T-shirt off your back. Your Nubbin is offered four snacks.',
        ),
        N(
          'You remember Rumi saying her thanks twice, and how it made carrying the boxes feel lighter.',
        ),
      ],
      [
        ask(
          1,
          'sel',
          'saying thank you: appreciation helps people feel valued',
          'CASEL: Relationship skills',
          [N('Rumi said thank you, and then said it again. Why do you think she bothered?')],
          [
            o(
              'So people know their work is noticed.',
              [
                N('Yes. A thank-you tells a person that what they did mattered.'),
                N('It costs nothing, and it makes the next job easier to do.'),
              ],
              true,
            ),
            o('Because Bobby asked her to.', [
              N('Bobby actually forgets to. That is why Rumi does it herself.'),
              N('Good manners are best when they come from you and not from a reminder.'),
            ]),
            o('She was bored.', [
              N('Not bored. She has a big show to do, and she still stopped for you.'),
              N('That shows she wanted you to feel noticed.'),
            ]),
          ],
          'Thought about why saying thank you matters and how it helps others feel noticed.',
        ),
      ],
    ),
    sc(
      'a29-02-show',
      [
        N(
          'The lights go down. The whole arena breathes in at once, thousands of light sticks held up like a field of little moons.',
        ),
        N(
          'Then Huntrix are on stage, and the sound hits you in the chest. It is loud, and bright, and very good.',
        ),
        N(
          'You don’t catch words. You catch the shape of it: three voices that fit like hands round a cup.',
        ),
        N(
          'Above the stage, above the roof, you see something nobody else is looking at. A faint line of light across the sky, which brightens each time the three hit a high note together.',
        ),
        N(
          'In the third row a man’s face goes pale and blank for a moment. Then the chorus comes round, and he blinks and laughs and waves his light stick.',
        ),
        B('Look at the numbers. Look at those faces. Look at me not crying.', 'soft'),
      ],
      [
        notice(
          1,
          'science',
          'loud, low sounds are big vibrations you can feel; ear protection helps',
          '1-PS4-1',
          [
            N(
              'The deep thump you feel in your chest is the bass. Low, loud sounds make big, slow vibrations that shake the air and you.',
            ),
            N(
              'That is why a lot of people wear ear defenders at concerts. Big vibrations can tire out little ears.',
            ),
          ],
          'Learned that loud, low sounds are big vibrations, and why people protect their ears at concerts.',
        ),
      ],
    ),
    sc(
      'a29-02-show-done',
      [
        N('The last chord ends. The line in the sky hums like a struck glass, and holds.'),
        R('Bobby, tell the car to wait. We’ve got a thing.'),
      ],
      [
        ask(
          0,
          'literacy',
          'a simile compares two things using “like”: hums like a struck glass',
          'L.4.5',
          [
            N(
              'The line in the sky “hums like a struck glass”. What does that picture help you hear?',
            ),
          ],
          [
            o(
              'A clear, ringing note that fades slowly.',
              [
                N('Yes. A struck glass rings softly and then fades.'),
                N(
                  'A comparison with “like” or “as” is called a simile. It lets you hear with your imagination.',
                ),
              ],
              true,
            ),
            o('A loud crash.', [
              N('A crash would be a broken glass. Here the glass is only tapped.'),
              N('The simile gives you a clear, soft ringing sound.'),
            ]),
            o('A sneeze.', [
              N('Ha! Not this time. Think of tapping a glass with a spoon.'),
              N('That clear ringing is the sound the sky line makes.'),
            ]),
          ],
          'Used a simile to imagine a sound: hums like a struck glass.',
        ),
      ],
    ),
    sc(
      'a29-02-fight',
      [
        N(
          'The case is long, black and heavy. Rumi said bring it, and Rumi seems to outrank Bobby in practice.',
        ),
        N(
          'In the empty car park the strip lights flicker. Things come out of the shadows between the vans: grinning, too tall, all teeth.',
        ),
        M('Demons. Three, four… six. Open the case, runner, and then stand very far back.'),
        N(
          'Inside the case: a sword, a long-hafted blade taller than Mira, and a belt of small throwing knives, all faintly glowing.',
        ),
        N(
          'Your Nubbin takes one look at the demons and dives head-first into a stage speaker waiting to be loaded.',
        ),
        Z('Same, honestly.'),
        N(
          'Then it is very fast, and very bright. The demons come apart into smoke and sparks, and the car park smells of burnt sugar.',
        ),
      ],
      [
        ask(
          2,
          'maths',
          'equal sharing with division: 6 demons shared between 3 hunters',
          '3.OA.A.3',
          [
            N(
              'There are six demons and three hunters. If they share the demons out evenly, how many does each hunter face?',
            ),
          ],
          [
            o(
              '2 each.',
              [
                N('Yes. 6 shared between 3 is 2 each, because 2 + 2 + 2 = 6.'),
                N('Mira would call that a very tidy evening.'),
              ],
              true,
            ),
            o('3 each.', [
              N('Check by counting: 3 + 3 + 3 is 9, which is too many for six demons.'),
              N('Try 2 each: 2 + 2 + 2 is 6.'),
            ]),
            o('6 each.', [
              N('If every hunter faced 6, that would be 18 demons.'),
              N('With 6 demons shared between 3 hunters, each gets 2.'),
            ]),
          ],
          'Divided 6 by 3 to share demons equally between three hunters.',
        ),
      ],
    ),
    sc(
      'a29-02-fight-done',
      [
        N(
          'When it is over, your Nubbin climbs out of the speaker, stands on top of it, and puffs out its chest.',
        ),
        Z('Yes. You. You did that. Hero of the car park.', 'happy'),
        N('Your Nubbin hid first and puffed up second, and nobody minds either part.'),
      ],
      [
        ask(
          2,
          'sel',
          'fear is normal; courage can come after fear',
          'CASEL: Self-awareness',
          [
            N(
              'Your Nubbin dived into a speaker, and Zoey said “Same, honestly.” Can a person be scared and brave in the same evening?',
            ),
          ],
          [
            o('Yes. Being scared is not the opposite of brave.', [
              N(
                'That is a fair answer. Brave people often feel scared first, and then carry on anyway.',
              ),
              N('Zoey felt it too, and she still stood in the car park.'),
            ]),
            o('No. Brave people are never scared.', [
              N('That is a fair thing to think. A lot of stories make it seem that way.'),
              N(
                'But most brave people say they felt afraid first. The brave part is what they do next.',
              ),
            ]),
            o('Only if no one is watching.', [
              N('Interesting. Some people find it easier to be brave when someone is with them.'),
              N('Others find it easier alone. There is no single right way to be scared.'),
            ]),
          ],
          'Thought about whether a person can be afraid and brave at the same time.',
        ),
      ],
    ),
    sc(
      'a29-02-complete',
      [
        N(
          'Bobby comes down the ramp with three bottles of water and the face of a man who has decided not to ask.',
        ),
        B('Car’s here. Runner, you didn’t see any of this. What did you see?'),
        Y('A really good show.'),
        B('Perfect answer. Here, have this, it’s broken and they’re throwing it out.', 'happy'),
        N(
          'It is an old stage light, the size of a teapot, with a cracked pink filter. When you tap it, it still glows pink.',
        ),
        R('Thanks for carrying. And for not running away. Most people do, the first time.', 'soft'),
      ],
      [
        ask(
          4,
          'science',
          'a coloured filter lets through only light of its own colour',
          '1-PS4-2',
          [
            N(
              'The stage light has a pink filter, and plain white light goes in. Why does pink light come out?',
            ),
          ],
          [
            o(
              'The filter lets pink through and stops the other colours.',
              [
                N(
                  'Yes. White light has all colours in it, and the pink filter holds back most of the rest.',
                ),
                N('That is how stage crews paint a whole show in colour with one white bulb.'),
              ],
              true,
            ),
            o('The bulb itself is pink.', [
              N('Take the filter off and you would see plain white light.'),
              N('The filter does the colouring by letting only pink pass through.'),
            ]),
            o('Pink light is hotter.', [
              N('A filter doesn’t make light hotter. It only picks which colours get through.'),
              N('The filter picks out the pink and blocks the other colours.'),
            ]),
          ],
          'Learned that a coloured filter lets through only light of its own colour.',
        ),
      ],
    ),
  ],
  [
    gl('foyer', 'The big entrance hall of a theatre or arena.', 'a29-02-backstage-done'),
    gl('simile', 'A comparison that uses “like” or “as”.', 'a29-02-show-done'),
  ],
);

// ================================================================== A29-3 Ramyun
const Q3: EduQuest = quest(
  'a29-03',
  'Ramyun',
  {
    'a29-03-s1': {
      goal: 'Fetch more instant noodles from the shop downstairs.',
      hint: 'The convenience store on the corner is open all night.',
    },
    'a29-03-s2': {
      goal: 'Eat with them, and pay attention.',
      hint: 'Sit at the low table by the window.',
    },
  },
  [
    sc(
      'a29-03-kitchen',
      [
        N(
          'Huntrix’s flat is high up, with a city view and a tiny kitchen. At two in the morning, every pan in it is full of noodles.',
        ),
        Z(
          'Rule of the house. You fight demons, you eat ramyun. You fight a lot of demons, you eat a lot of ramyun.',
        ),
        M(
          'We’re out. We are, terribly, out. Two cups each for us three, and one each for you and your Nubbin.',
        ),
        R(
          'The shop on the corner. The spicy ones, the mild ones, and whatever is new. Zoey likes whatever is new.',
        ),
        Z('I like whatever is new.', 'happy'),
      ],
      [
        ask(
          2,
          'maths',
          'a two-step problem: 3 × 2 + 2',
          '3.OA.D.8',
          [
            N(
              'Mira wants two cups each for the three hunters, and one each for you and your Nubbin. How many cups must you fetch?',
            ),
          ],
          [
            o(
              '8 cups.',
              [
                N(
                  'Yes. Three hunters with two cups each is 3 × 2 = 6. Add one for you and one for your Nubbin: 6 + 2 = 8.',
                ),
                N('Eight cups. Try carrying them all in one go.'),
              ],
              true,
            ),
            o('6 cups.', [
              N('Six is just the hunters: 3 × 2 = 6.'),
              N('You and your Nubbin need one each too, so 6 + 2 = 8.'),
            ]),
            o('5 cups.', [
              N('Five is how many of you there are, but the hunters want two each.'),
              N('3 × 2 = 6, and then add 2 more: 8 cups.'),
            ]),
          ],
          'Solved a two-step problem, 3 groups of 2 plus 2 more, to find 8 cups.',
        ),
      ],
      [
        ch('go', 'Go at once.', [M('Look at that. Bobby hired someone with legs.')]),
        ch('list', 'Ask them to write it down.', [
          R('Spicy, mild, new. You’ll remember. It’s the most important list in Seoul.', 'happy'),
        ]),
      ],
    ),
    sc(
      'a29-03-kitchen-done',
      [
        N(
          'The shop is bright and humming. Every packet is covered in neat little blocks of writing, all lines, corners and small circles.',
        ),
        N(
          'You come back with a bag of noodle cups, three triangle gimbap, and a new flavour that is bright green.',
        ),
      ],
      [
        notice(
          0,
          'literacy',
          'hangul: made by King Sejong’s scholars so everyone could read; letters stack in syllable blocks',
          'RF.K.2',
          [
            N(
              'The writing is hangul, the Korean alphabet. About 580 years ago King Sejong and his scholars made it, so that everyone could learn to read.',
            ),
            N(
              'Before that, most writing used Chinese characters, which take years to learn. Hangul letters are stacked in square blocks, one block for each syllable.',
            ),
            N('The word hangul is two blocks, han and geul, and geul means writing.'),
          ],
          'Learned that King Sejong’s scholars made hangul about 580 years ago, and that its letters stack in blocks of one syllable each.',
        ),
      ],
    ),
    sc(
      'a29-03-table',
      [
        N(
          'The four of you eat on the floor round a low table, with the city lights all down the window. Your Nubbin gets the bright green one.',
        ),
        Z(
          'Did you see the man in the third row? Sad, then laughing? That was us. We did that.',
          'happy',
        ),
        N(
          'Rumi laughs too, and halfway through the laugh her voice catches. A small crack, like a dry twig.',
        ),
        R('Long night. That’s all.'),
        N(
          'The flat is hot, the window shut against the traffic, and the fan only turns the warm air round. Rumi is still in long sleeves.',
        ),
        N(
          'She pulls them down over her hands while she eats. You notice it, and then you notice yourself noticing, and look at your bowl.',
          'think',
        ),
      ],
      [
        ask(
          5,
          'sel',
          'noticing that someone may be hiding something, and wondering why',
          'CASEL: Social awareness',
          [
            N(
              'It is a hot night and Rumi keeps her sleeves down. Why might a person keep something covered, even when it is uncomfortable?',
            ),
          ],
          [
            o('She might be worried what people will think.', [
              N(
                'That is a fair answer. Many people hide something because they fear being judged.',
              ),
              N('It can feel safer, and it can also feel lonely.'),
            ]),
            o('She might just be cold.', [
              N('That is a fair thought, and you are right to keep it open. We can’t always know.'),
              N('But the room is hot, so the sleeves might mean something else.'),
            ]),
            o('She might have been told to.', [
              N(
                'That is a thoughtful answer. People sometimes hide things because someone they trust told them to.',
              ),
              N('You will find out more about that very soon.'),
            ]),
          ],
          'Wondered kindly why someone might keep something covered, and thought of different reasons.',
        ),
      ],
      [
        ch('fan', 'Turn the fan towards her.', [
          R('Thanks. I’m fine. I always run cold.', 'soft'),
          N('It isn’t true, and she knows you know, and you both eat noodles.'),
        ]),
        ch('eat', 'Say nothing and keep eating.', [
          N(
            'You eat, and Rumi eats. After a while she stops pulling at her sleeves, as if she has forgotten to.',
          ),
        ]),
      ],
    ),
    sc(
      'a29-03-table-done',
      [
        N(
          'You sat down at quarter past two. By three o’clock, Zoey is asleep with her chopsticks still in her hand.',
        ),
        N('Mira takes them out, gently, and puts a cushion under her head.'),
      ],
      [
        ask(
          0,
          'maths',
          'time intervals: from 2:15 to 3:00 is 45 minutes',
          '3.MD.A.1',
          [N('The four of you sat down at 2:15 and Zoey was asleep by 3:00. How long was that?')],
          [
            o(
              '45 minutes.',
              [
                N('Yes. From 2:15 to 2:30 is 15 minutes, and from 2:30 to 3:00 is 30 more.'),
                N('15 + 30 = 45 minutes, a long time to hold chopsticks.'),
              ],
              true,
            ),
            o('15 minutes.', [
              N('Fifteen minutes only gets you to half past two.'),
              N('Keep counting to 3:00: that is 15 + 30 = 45 minutes.'),
            ]),
            o('One hour.', [
              N('A whole hour would take you to quarter past three.'),
              N('From 2:15 to 3:00 is 45 minutes, which is a quarter of an hour short of an hour.'),
            ]),
          ],
          'Worked out a time interval, 45 minutes from 2:15 to 3:00.',
        ),
      ],
    ),
    sc(
      'a29-03-complete',
      [
        N(
          'In the morning there is a present on the gear case, with a sticky note in Zoey’s round writing.',
        ),
        N(
          'It is an empty noodle cup, washed, cut down small, with a paper rim and a strap. A hat, exactly your Nubbin’s size.',
        ),
        Z('Every hunter needs a helmet. That one is mostly soup-proof.', 'happy'),
        N('Your Nubbin puts it on and won’t take it off, not even to sleep.'),
      ],
      [
        ask(
          2,
          'science',
          'properties of materials: why a noodle cup makes a good hat',
          '2-PS1-1',
          [
            N(
              'Zoey made the hat from a noodle cup. Which property makes it a good thing to cut into a hat?',
            ),
          ],
          [
            o(
              'It is light, stiff and easy to cut.',
              [
                N(
                  'Yes. A noodle cup is light enough to wear, stiff enough to hold its shape, and easy to cut with scissors.',
                ),
                N('Choosing a material by its properties is what designers do all day.'),
              ],
              true,
            ),
            o('It is heavy and very hard.', [
              N('A heavy, hard hat would hurt a small neck.'),
              N('The cup is light, stiff and easy to cut.'),
            ]),
            o('It is soft and runny.', [
              N('A runny hat would not stay on at all.'),
              N('The cup is light and stiff, so it keeps its shape.'),
            ]),
          ],
          'Chose a material for a job by its properties: light, stiff and easy to cut.',
        ),
      ],
    ),
  ],
  [
    gl(
      'gimbap',
      'A Korean roll of rice and fillings wrapped in dried seaweed.',
      'a29-03-kitchen-done',
    ),
  ],
);

// ================================================================== A29-4 Celine
const Q4: EduQuest = quest(
  'a29-04',
  'Celine',
  {
    'a29-04-s1': {
      goal: 'Walk Rumi to Celine’s house, and carry the pears.',
      hint: 'Follow Rumi through the old lanes. Carry the fruit box carefully.',
    },
    'a29-04-s2': {
      goal: 'Wait outside the gate.',
      hint: 'Sit on the step by the wall. The paper doors aren’t thick.',
    },
  },
  [
    sc(
      'a29-04-lanes',
      [
        B(
          'Rumi’s visiting Celine. Go with her and carry the fruit. Celine likes fruit, and doesn’t like me.',
        ),
        N(
          'The fruit is a box of Korean pears, big and round, each wrapped in its own little foam net, like a pear in a jumper.',
        ),
        N(
          'Rumi takes you up through a quarter of old houses: tiled roofs with curling eaves, wooden gates, walls of pale stone.',
        ),
        R(
          'Celine was a hunter, before us. When I was little she took me in, trained me and raised me. All of it.',
        ),
        R('She taught me how to hold a sword. How to hold a note. How to hold…', 'think'),
        N('She doesn’t finish. She tugs her sleeve down, though it is already down.'),
      ],
      [
        ask(
          1,
          'literacy',
          'a simile: a pear wrapped in a net is like a pear in a jumper',
          'L.4.5',
          [
            N(
              'The writer says each pear is wrapped “like a pear in a jumper”. What is the picture meant to show?',
            ),
          ],
          [
            o(
              'The pear is wrapped up snug and protected.',
              [
                N('Yes. A jumper keeps you cosy, and the net keeps the pear safe from bruises.'),
                N('A good simile gives you a fact and a feeling in one go.'),
              ],
              true,
            ),
            o('The pear is cold.', [
              N('Jumpers can mean cold, but here the net is for protection.'),
              N('The pear is being kept snug and unbruised.'),
            ]),
            o('The pear is wearing clothes for a party.', [
              N('That is a funny picture, and it suits the story’s voice.'),
              N(
                'But the real point is that the net keeps the pear safe, like a jumper keeps you snug.',
              ),
            ]),
          ],
          'Explained what a simile shows: a pear in a foam net is wrapped up snug, like a pear in a jumper.',
        ),
      ],
      [
        ch('ask', '“How to hold what?”', [
          R('Myself. Together. You know.', 'soft'),
          N('She walks a bit faster, and you let her.'),
        ]),
        ch('pears', 'Ask about the pears in jumpers.', [
          R(
            'So they don’t bruise. Everything in this country is wrapped. Including me, according to Mira.',
            'happy',
          ),
        ]),
      ],
    ),
    sc(
      'a29-04-lanes-done',
      [
        N(
          'Celine’s house is an old hanok round a courtyard, very neat. Rumi takes the pears, and asks you to wait outside the gate.',
        ),
        N('The tiled roof curls up at the corners, as if the house is quietly smiling.'),
      ],
      [
        notice(
          1,
          'social-studies',
          'a hanok: tiled roof, paper doors and a floor warmed from below',
          'D2.His.2.K-2',
          [
            N(
              'A hanok is a traditional Korean house, built of wood, clay and tiles. Its doors and windows are covered in hanji paper, to let in soft light.',
            ),
            N(
              'Many hanok have a floor warmed from underneath. The smoke and heat from the kitchen stove run through channels beneath the rooms. That is called ondol.',
            ),
          ],
          'Learned about a hanok: tiled roof, hanji paper doors, and the ondol floor warmed from below.',
        ),
      ],
    ),
    sc(
      'a29-04-gate',
      [
        N(
          'You sit on the stone step outside. Your Nubbin, in its noodle hat, watches a sparrow on the wall.',
        ),
        N(
          'The old doors are wood and paper. You don’t mean to listen, but you hear enough anyway.',
        ),
        C('Let me see.'),
        N('A pause. A rustle of a sleeve going up.'),
        C('They’ve spread. Up past the elbow now.', 'sad'),
        R('I know. I keep them covered. Nobody has seen. Nobody will.'),
        C(
          'A hunter can’t look like what she hunts. If they saw, they wouldn’t understand. Keep them hidden.',
        ),
        R('You said that when the Honmoon is sealed for good, they’ll go. Then I’ll be… right.'),
        C('Then work harder. Sing better. Don’t let anyone in.', 'soft'),
      ],
      [
        ask(
          8,
          'sel',
          'thinking about whether you have to fix yourself before you deserve love',
          'CASEL: Self-awareness',
          [
            N(
              'Rumi hopes that when her marks go, she will finally be “right”. What do you think about that?',
            ),
          ],
          [
            o('Nobody has to be changed before they deserve love.', [
              N(
                'That is a fair answer, and a kind one. Many people hope to be loved just as they are.',
              ),
              N('Rumi isn’t sure of it yet. Keep watching to see.'),
            ]),
            o('People should try to fit in, to be safe.', [
              N(
                'That is a fair thought. Fitting in can feel safer, and Celine thinks so because she is afraid for Rumi.',
              ),
              N(
                'But hiding a part of yourself can also be tiring. Keep that in mind as the story goes on.',
              ),
            ]),
            o('It depends on who is looking.', [
              N('That is a thoughtful answer. Some people can see all of us, and some can’t.'),
              N('Finding people who can is a big part of this story.'),
            ]),
          ],
          'Thought about whether a person must be “fixed” to deserve love, and listened to more than one view.',
        ),
      ],
      [
        ch('away', 'Move further from the gate.', [
          N(
            'You get up and walk to the end of the wall, out of earshot. It is too late, but it is something.',
          ),
        ]),
        ch('stay', 'Stay where you are.', [
          N('You stay. It seems worse, somehow, to leave her out here alone when she comes out.'),
        ]),
        ch('nubbin', 'Show your Nubbin the sparrow.', [
          N(
            'You point out the sparrow. Your Nubbin chirps at it, and the sparrow chirps back, and you listen to that instead.',
          ),
        ]),
      ],
    ),
    sc(
      'a29-04-gate-done',
      [
        N(
          'Celine’s voice drops low. Then the gate opens and Rumi comes out, smiling, with her sleeves pulled down to her knuckles.',
        ),
        N('You heard it all through the doors, because paper is so thin.'),
      ],
      [
        ask(
          1,
          'science',
          'sound passes through thin paper more easily than through thick walls',
          '4-PS3-2',
          [
            N(
              'You heard Celine and Rumi through the paper doors. Why would a thick stone wall have been quieter?',
            ),
          ],
          [
            o(
              'Thin paper shakes easily, so more sound gets through.',
              [
                N(
                  'Yes. Sound is vibrating air, and the vibration shakes thin paper easily and carries on.',
                ),
                N(
                  'A thick wall takes up much more of the shaking, so less sound comes out the other side.',
                ),
              ],
              true,
            ),
            o('Paper makes sound louder.', [
              N('It does not make it louder, but it lets plenty through.'),
              N('Thin paper shakes easily, so the sound passes on.'),
            ]),
            o('Stone has no vibrations at all.', [
              N('Stone can shake a little, but it is heavy and hard to move.'),
              N('That is why a thick wall blocks more sound than a paper door.'),
            ]),
          ],
          'Learned that sound travels through thin paper more easily than through a thick wall.',
        ),
      ],
    ),
    sc(
      'a29-04-complete',
      [
        R('She liked the pears.', 'happy'),
        N(
          'She walks back down the lane quickly. You walk beside her and say nothing about anything.',
        ),
        R(
          'We’re close, you know. A few more shows like last night, and the Honmoon will be sealed for good.',
        ),
        R('And then it’ll be over. All of it.', 'soft'),
        N('She says it the way people say they’ll be happy when the weather turns.'),
      ],
      [
        ask(
          4,
          'literacy',
          'reading a simile for meaning: waiting for the weather to turn',
          'L.4.5',
          [
            N(
              'Rumi says it “the way people say they’ll be happy when the weather turns”. What does that tell you about how she feels now?',
            ),
          ],
          [
            o(
              'She is waiting for something outside herself to change before she can be happy.',
              [
                N('Yes. We can’t make the weather turn, and neither can Rumi make the marks go.'),
                N('Waiting to be happy later can make today feel grey.'),
              ],
              true,
            ),
            o('She is very happy already.', [
              N('Look at how she says it: “soft”, with a wish in it.'),
              N('People who say “I’ll be happy when…” are not happy yet.'),
            ]),
            o('She loves the rain.', [
              N('Maybe, but the simile is not really about rain.'),
              N('It is about waiting for a change that she can’t control.'),
            ]),
          ],
          'Read a simile for its meaning: waiting for something to change before being happy.',
        ),
      ],
    ),
  ],
  [
    gl(
      'hanok',
      'A traditional Korean house with a tiled roof and paper doors.',
      'a29-04-lanes-done',
    ),
    gl(
      'ondol',
      'A Korean floor warmed from underneath by heat from the stove.',
      'a29-04-lanes-done',
    ),
  ],
);

// ================================================================== A29-5 The Saja Boys
const Q5: EduQuest = quest(
  'a29-05',
  'The Saja Boys',
  {
    'a29-05-s1': {
      goal: 'Watch the new band’s debut on the big screens.',
      hint: 'The giant screen over the crossing shows the debut at eight.',
    },
    'a29-05-s2': {
      goal: 'Look closely at the crowd under the screens.',
      hint: 'Walk among the people watching, and look at their faces.',
    },
  },
  [
    sc(
      'a29-05-debut',
      [
        N(
          'At eight o’clock every big screen in the shopping street goes black at once. Then five boys walk out of the dark.',
        ),
        N(
          'They wear long black coats and wide-brimmed hats of fine black horsehair, tied under the chin. The boy in front is called Jinu.',
        ),
        N(
          'Their music is smooth and catchy, and it goes into your ear like warm water. You find your foot is tapping and stop it.',
        ),
        F('Oh. Oh, no. Who are they? Why have I never heard of them? Why do I love them?', 'shock'),
        B(
          'Who are they? Where did they come from? Nobody debuts at the top of the chart. Nobody!',
          'angry',
        ),
        N(
          'Bobby is refreshing the charts on both phones. The Saja Boys are climbing, one place a minute.',
        ),
      ],
      [
        ask(
          0,
          'science',
          'a screen changes electrical energy into light',
          '4-PS3-4',
          [
            N(
              'The giant screen is made of thousands of tiny lights. What kind of energy does it change into light?',
            ),
          ],
          [
            o(
              'Electricity.',
              [
                N('Yes. The screen is plugged in. Electrical energy goes in, and light comes out.'),
                N(
                  'Lots of devices change energy from one form into another. A screen changes electricity into light.',
                ),
              ],
              true,
            ),
            o('Sound.', [
              N(
                'Sound comes out of the speakers, not the screen. The speakers turn electricity into sound.',
              ),
              N('The screen turns electricity into light.'),
            ]),
            o('Wind.', [
              N('No wind needed. A screen runs on electricity.'),
              N('Electrical energy goes in, and light comes out.'),
            ]),
          ],
          'Learned that a screen is a device that changes electrical energy into light.',
        ),
      ],
      [
        ch('listen', 'Keep watching.', [
          N(
            'You keep watching, and the longer you watch, the harder it is to look away. That is interesting, and not in a good way.',
            'think',
          ),
        ]),
        ch('bobby', 'Calm Bobby down.', [
          B('I am calm. This is my calm face. This is what my calm face looks like now.', 'angry'),
        ]),
      ],
    ),
    sc(
      'a29-05-debut-done',
      [
        N(
          'High above the city, where only you seem to look, the line of the Honmoon flickers like a bulb about to go.',
        ),
        B('Thirtieth in the chart a few minutes ago! Now they’re eighteenth! Eighteenth!', 'angry'),
      ],
      [
        ask(
          1,
          'maths',
          'subtraction within 100: 30 take away 18',
          '2.OA.A.1',
          [N('The Saja Boys were 30th and are now 18th. How many places have they climbed?')],
          [
            o(
              '12 places.',
              [
                N(
                  'Yes. 30 − 18 = 12. You can count up from 18 to 20, which is 2, then from 20 to 30, which is 10.',
                ),
                N('2 + 10 is 12. At a place a minute, that is only twelve minutes.'),
              ],
              true,
            ),
            o('48 places.', [
              N(
                'Adding 30 and 18 gives 48. But they are going from 30th down to 18th, so we take away.',
              ),
              N('30 − 18 = 12 places.'),
            ]),
            o('8 places.', [
              N('Almost! Count up from 18 to 30 on your fingers: two to reach 20, then ten more.'),
              N('That is 12 places.'),
            ]),
          ],
          'Worked out a subtraction within 100, 30 − 18 = 12 places.',
        ),
      ],
    ),
    sc(
      'a29-05-crowd',
      [
        N(
          'You walk among the people under the screens. They are smiling, mostly, and some are singing along.',
        ),
        N(
          'But their eyes are wrong. A bit blank, a bit far, like people who have stood too long in the sun.',
        ),
        N(
          'A faint shimmer of cheer drifts up off them, like breath on a cold day, towards the screen and the boy on it.',
        ),
        N(
          'Zoey and Mira come through the crowd in caps and masks. Zoey stops by you and looks up at the hats on the screen.',
        ),
        Z(
          'Jeoseung saja. That’s what they’re dressed as. Black coat, black gat. My grandma’s stories.',
        ),
        Z(
          'In the old stories, the saja are serious messengers who walk a person to the next world after they die. They’re not the bad guys.',
        ),
        M('Which is a strange costume for a boy band.'),
        Z(
          'Unless they’re wearing it because it scares us. It’s a look that isn’t theirs.',
          'think',
        ),
      ],
      [
        notice(
          7,
          'social-studies',
          'the gat and the jeoseung saja: treating folk stories and crafts with respect',
          'D2.His.2.K-2',
          [
            N(
              'A gat is a real Korean hat from the Joseon period, made of fine horsehair and bamboo. A few craftspeople still make them by hand today.',
            ),
            N(
              'The jeoseung saja come from old Korean folk stories. They are grave and dutiful, not evil. The demons here only borrow their look.',
            ),
          ],
          'Learned that the gat is a real Korean hat, and that the jeoseung saja of folk stories are serious messengers, not villains.',
        ),
      ],
      [
        ch('shimmer', 'Tell them about the shimmer.', [
          M('You can see that? Huh. Good eyes, runner.'),
          N('Mira looks at you a little longer than before, and then at the screen.'),
        ]),
        ch('quiet', 'Keep it to yourself for now.', [
          N(
            'You keep it to yourself. Mira sees it anyway, a moment later, and mutters something quiet into her mask.',
          ),
        ]),
      ],
    ),
    sc(
      'a29-05-crowd-done',
      [
        N(
          'The song ends, the crowd wakes up a bit, and the shimmer stops. The Honmoon flickers, and holds.',
        ),
        N('You noticed your own foot tapping along earlier, and how hard it was to stop.'),
      ],
      [
        ask(
          1,
          'sel',
          'noticing when something is pulling you along, and pausing',
          'CASEL: Self-management',
          [
            N(
              'A catchy song and a big crowd can sweep us along. How can you tell when you have stopped choosing for yourself?',
            ),
          ],
          [
            o('I could stop and ask myself why I’m doing it.', [
              N('That is a fair answer. A pause to ask “do I really want this?” is a strong tool.'),
              N('It works for songs, for crowds, and for plenty of other things.'),
            ]),
            o('I could check with a friend.', [
              N('That is a good idea. Mira and Zoey noticed because they talked it over.'),
              N('A friend can see what you can’t see from inside the crowd.'),
            ]),
            o('I might not be able to tell.', [
              N('That is an honest answer. It really can be hard to tell from the inside.'),
              N('That is why noticing, like you did with your foot, is a good first step.'),
            ]),
          ],
          'Thought about how to notice being swept along by a crowd or a catchy song, and ways to pause.',
        ),
      ],
    ),
    sc(
      'a29-05-complete',
      [
        Z('I’m telling Rumi.'),
        M(
          'Rumi’s at the studio. She’s been there since six. Her voice is going, and she won’t say.',
          'sad',
        ),
        B(
          'I don’t know what you two are muttering about, but I need a hit, and I need it yesterday.',
        ),
        N(
          'Your Nubbin looks up at the screen, at the boy in the hat, and pulls the noodle cup lower over its eyes.',
        ),
      ],
      [
        ask(
          2,
          'literacy',
          'telling characters’ motives apart: who is worried about Rumi herself',
          'RL.3.3',
          [
            N(
              'Zoey wants to tell Rumi, Mira worries about her voice, and Bobby wants a hit. Whose worry is mostly about Rumi herself?',
            ),
          ],
          [
            o(
              'Mira’s.',
              [
                N('Yes. Mira notices Rumi’s voice and her tiredness, and she worries about her.'),
                N(
                  'Bobby worries about the charts, and Zoey’s mind is on the demons. Different motives, different words.',
                ),
              ],
              true,
            ),
            o('Bobby’s.', [
              N('Bobby likes the girls, but his words are about the chart, not about Rumi.'),
              N('Mira is the one who mentions Rumi’s voice and her sadness.'),
            ]),
            o('Zoey’s.', [
              N('Zoey cares a lot, but her plan is about the Saja Boys.'),
              N('Mira is the one who worries about Rumi’s tired voice.'),
            ]),
          ],
          'Compared what three characters say to work out who is most worried about Rumi.',
        ),
      ],
    ),
  ],
  [
    gl('gat', 'A traditional Korean hat made of fine horsehair and bamboo.', 'a29-05-crowd'),
    gl(
      'jeoseung saja',
      'In Korean folk stories, serious messengers who walk the dead to the next world.',
      'a29-05-crowd',
    ),
  ],
);

// ================================================================== A29-6 The Marks
const Q6: EduQuest = quest(
  'a29-06',
  'The Marks',
  {
    'a29-06-s1': {
      goal: 'Carry the gear case to the empty television studio.',
      hint: 'The music-show studio is dark after midnight. Take the loading door.',
    },
    'a29-06-s2': {
      goal: 'Watch the fight from behind the camera crane.',
      hint: 'Keep low behind the crane. Don’t help unless someone needs the case.',
    },
    'a29-06-s3': {
      goal: 'Take the water bottles to the dressing room.',
      hint: 'The dressing room is down the corridor, past the make-up chairs.',
    },
  },
  [
    sc(
      'a29-06-studio',
      [
        N(
          'After the music show’s recording, when the studio is empty, the Saja Boys stay behind. So do Huntrix, in the dark.',
        ),
        M(
          'We followed one of them home. “Home” was a crack in the air behind a vending machine. They’re demons, Rumi.',
        ),
        R('All five?'),
        Z('All five. Hats and all.'),
        N(
          'Rumi’s face goes very still. Then she nods, once, and holds out her hand to you without looking, and you give her the sword.',
        ),
        R(
          'Runner, stay by the door. If it goes badly, run, and tell Bobby we said sorry about the studio.',
        ),
      ],
      [
        ask(
          3,
          'maths',
          'comparing two groups: 5 boys and 3 hunters',
          '1.OA.A.1',
          [
            N(
              'There are five Saja Boys and three hunters. How many more boys than hunters are there?',
            ),
          ],
          [
            o(
              '2 more.',
              [
                N('Yes. 5 − 3 = 2, or count on from 3: 4, 5. Two more.'),
                N('Huntrix are used to being outnumbered, and they are good at it.'),
              ],
              true,
            ),
            o('8 more.', [
              N('8 is 5 + 3, all of them put together.'),
              N('To find “how many more”, take away: 5 − 3 = 2.'),
            ]),
            o('3 more.', [
              N('Close. Lay out three hunters and five boys in two rows, and match them up.'),
              N('Three match, and 2 boys are left over.'),
            ]),
          ],
          'Compared two groups by subtracting: 5 − 3 = 2 more.',
        ),
      ],
      [
        ch('door', 'Stay by the door.', [
          N('You stay by the door. Your Nubbin, in the merch bag, peeks out with one eye.'),
        ]),
        ch('case', 'Stay by the gear case instead.', [
          N(
            'You stay by the open case, where the spare knives are. Zoey sees, gives you a thumbs up, and doesn’t send you back.',
          ),
        ]),
      ],
    ),
    sc(
      'a29-06-studio-done',
      [
        N(
          'The studio lights come on all at once, every colour. Five boys in black coats are standing on the set, as if they have been waiting.',
        ),
        N(
          'Red, green and blue beams cross over the floor, and where they meet, the light turns white.',
        ),
      ],
      [
        notice(
          1,
          'science',
          'red, green and blue light together make white light',
          '1-PS4-2',
          [
            N(
              'Stage lights mix coloured beams. Where red, green and blue light land on the same spot, they add up to white.',
            ),
            N(
              'Red and green together make yellow. A lighting crew can paint a stage with only three colours.',
            ),
          ],
          'Learned that red, green and blue light together make white, and that mixing two makes new colours.',
        ),
      ],
    ),
    sc(
      'a29-06-fight',
      [
        N(
          'It is a fight like a dance number: fast, bright, a lot of spinning. The boys are quick, and they laugh while they fight.',
        ),
        N(
          'Zoey’s knives go thunk into a set wall. Mira’s blade sweeps a whole row of fake flowers off a stand.',
        ),
        N(
          'Huntrix move like one person with six arms, and not one of them looks at the others to check.',
        ),
        N(
          'Rumi and Jinu end up face to face on the stage stairs. Her sword is up between them, and his hand has caught her wrist.',
        ),
        N(
          'Her sleeve has ridden up. On her wrist and forearm there are marks: curling patterns, violet and silver, like ink in water.',
        ),
        N(
          'Jinu sees them, and his eyes go wide. For a moment neither of them moves at all.',
          'shock',
        ),
        N(
          'Then Mira shouts, coming up the stairs. And Jinu, very quickly, pulls Rumi’s sleeve down over the marks, and lets her go.',
        ),
        J('Another time, hunter.'),
        N(
          'He steps back into a shadow, and is not there. The other boys go with him, in a gust of cold air and a smell of old smoke.',
        ),
      ],
      [
        ask(
          2,
          'sel',
          'teamwork comes from practice and trust',
          'CASEL: Relationship skills',
          [
            N(
              'The three hunters move together without checking on each other. What helps a team work like that?',
            ),
          ],
          [
            o(
              'Practice, and trust that each one will do their part.',
              [
                N(
                  'Yes. Trust and practice go together. Each of them knows the others will be there.',
                ),
                N('It works for football teams, bands and washing-up crews, too.'),
              ],
              true,
            ),
            o('Everyone doing something different at random.', [
              N('Random would be messy and risky.'),
              N('Teams work best with practice and trust, so each knows what the others will do.'),
            ]),
            o('One person giving every order.', [
              N('A leader helps, but Huntrix don’t wait for orders in a fast fight.'),
              N('They have practised so much that they trust each other’s moves.'),
            ]),
          ],
          'Thought about what lets a team work well together: practice and trust.',
        ),
      ],
    ),
    sc(
      'a29-06-fight-done',
      [Z('Did he… did he just let you go? Why would he do that?'), R('I don’t know.', 'think')],
      [
        ask(
          1,
          'literacy',
          'using clues in the text to work out a character’s motive',
          'RL.3.3',
          [N('Rumi doesn’t know why Jinu let her go. What clue did Jinu leave that might help?')],
          [
            o(
              'He pulled her sleeve down over the marks before he left.',
              [
                N(
                  'Yes. He hid her marks from the others. That is a kind act from a rival, and a puzzling one.',
                ),
                N(
                  'Good readers collect clues like this before they decide what a character wants.',
                ),
              ],
              true,
            ),
            o('He laughed while he fought.', [
              N('That is a clue about his style, but it doesn’t explain why he let her go.'),
              N('The strongest clue is that he covered her marks.'),
            ]),
            o('He had a black coat.', [
              N('True, but all five boys have those.'),
              N('The clue to look for is what he did for Rumi: he pulled her sleeve down.'),
            ]),
          ],
          'Used a clue in the story to work out why Jinu might have let Rumi go.',
        ),
      ],
    ),
    sc(
      'a29-06-sleeve',
      [
        N(
          'In the dressing room, Mira and Zoey are arguing in the shower block about who broke the flower stand.',
        ),
        N(
          'Rumi is at the mirror with her back to the door, catching her breath. She has pushed her sleeve up to cool her arm.',
        ),
        N(
          'The marks go from her wrist almost to her shoulder now. In the mirror light they shimmer, violet and silver.',
        ),
        N(
          'She looks up and sees you in the mirror, holding three bottles of water. She doesn’t move.',
          'shock',
        ),
        N('You are the only one who has seen. Mira and Zoey are still arguing behind the door.'),
        N('Your own jacket is on the chair beside you, where you dropped it to carry the case.'),
      ],
      [
        ask(
          5,
          'sel',
          'respecting someone’s privacy while still being kind',
          'CASEL: Responsible decision-making',
          [
            N(
              'You are the only one who has seen Rumi’s marks. There is no single right way to help. What do you think matters most?',
            ),
          ],
          [
            o('That she feels safe.', [
              N('That is a fair answer. Feeling safe is where everything else starts.'),
              N('Think about which of the choices below would help her feel safest.'),
            ]),
            o('That she is the one to decide what happens next.', [
              N('That is a fair answer. A private thing belongs to the person who has it.'),
              N('Look for the choice that leaves the decision with Rumi.'),
            ]),
            o('That she knows she isn’t alone.', [
              N(
                'That is a fair answer. Knowing someone is on your side can make a big secret lighter.',
              ),
              N('Look for the choice that tells her so.'),
            ]),
          ],
          'Thought about privacy and kindness together, with no single right answer, before choosing how to help.',
        ),
      ],
      [
        ch(
          'jacket',
          'Hand her the jacket, and say nothing.',
          [
            N(
              'You put down the water and hold out the jacket. She takes it and puts it on, fast, and zips it to the chin.',
            ),
            R('Thank you.', 'soft'),
            N('She doesn’t say for what. You don’t ask.'),
          ],
          { 'a29-sleeve': 'jacket' },
        ),
        ch(
          'saw',
          '“I saw. It’s all right.”',
          [
            Y('I saw. It’s all right.'),
            N(
              'She looks at you for a long time in the mirror. Then she pulls her sleeve down, slowly, not fast.',
            ),
            R('You don’t know what it is.', 'sad'),
            Y('No. It’s still all right.'),
          ],
          { 'a29-sleeve': 'saw' },
        ),
        ch(
          'away',
          'Look away, and let her decide whether you saw.',
          [
            N(
              'You look down at the bottles in your arms, as if they are very interesting, and put them on the counter one by one.',
            ),
            N(
              'When you look up again her sleeve is down, and she is smiling at the mirror, and neither of you says anything.',
            ),
          ],
          { 'a29-sleeve': 'away' },
        ),
      ],
    ),
    sc(
      'a29-06-complete',
      [
        N(
          'Mira and Zoey come out with wet hair, still arguing. Rumi laughs at them in exactly the right places.',
        ),
        M('Why did he let you go, Rumi? Seriously.'),
        R('Maybe he was scared of you.', 'happy'),
        N('Mira likes that answer so much that she doesn’t notice it isn’t one.'),
      ],
      [
        ask(
          3,
          'literacy',
          'how a character responds to a question she wants to avoid',
          'RL.2.3',
          [N('Rumi gives Mira an answer that isn’t really an answer. What is she doing?')],
          [
            o(
              'Using a joke to keep a secret safe.',
              [
                N('Yes. A joke is a quick way to change the subject and keep something private.'),
                N('Notice that Mira laughs, and does not ask again.'),
              ],
              true,
            ),
            o('Telling Mira exactly what she thinks.', [
              N('Not quite. Rumi says only what is easy to say.'),
              N('She is protecting her secret with a joke.'),
            ]),
            o('Being rude on purpose.', [
              N('She isn’t being rude. She is laughing along, to be kind and to stay safe.'),
              N('She is using a joke to keep a secret.'),
            ]),
          ],
          'Saw how a character uses a joke to avoid a question she doesn’t want to answer.',
        ),
      ],
    ),
  ],
);

// ================================================================== A29-7 Derpy and Sussie
const Q7: EduQuest = quest(
  'a29-07',
  'Derpy and Sussie',
  {
    'a29-07-s1': {
      goal: 'Find out what is knocking over the bins behind the flats.',
      hint: 'Look in the alley behind the building, after dark.',
    },
    'a29-07-s2': {
      goal: 'Deliver the note the magpie brought. Don’t read it.',
      hint: 'Rumi is on the roof. Take the note up the fire stairs.',
    },
  },
  [
    sc(
      'a29-07-alley',
      [
        N(
          'Something is knocking over the bins behind Huntrix’s building every night, and then looking embarrassed about it.',
        ),
        N(
          'You go down with a torch. In the alley there is a tiger: a big one, blue as a bruise, with a wide silly grin and crossed eyes.',
        ),
        N(
          'On the tiger’s head stands a magpie, black and white, with a long tail and a beady, knowing eye. She looks at you sideways.',
        ),
        N('They are not from here. You can tell by the faint smoky shimmer round their edges.'),
        N(
          'Your Nubbin climbs out of the merch bag before you can stop it, walks up to the tiger and holds out the last of its biscuit.',
        ),
        N(
          'The tiger looks at the biscuit, and at your Nubbin. Then he lies down flat on his belly, very carefully, and purrs like a kettle.',
          'happy',
        ),
      ],
      [
        ask(
          2,
          'social-studies',
          'the tiger and the magpie in Korean folk painting (minhwa)',
          'D2.His.2.K-2',
          [
            N(
              'A tiger and a magpie together is a famous picture in old Korean folk painting, called minhwa. In those pictures, what does the magpie bring?',
            ),
          ],
          [
            o(
              'Good news.',
              [
                N('Yes. In Korean folk belief, a magpie’s call means good news is coming.'),
                N(
                  'In minhwa pictures the tiger is often goofy and grinning, which is why Derpy fits right in. Families hung these pictures at New Year, for luck.',
                ),
              ],
              true,
            ),
            o('A storm.', [
              N('Not quite. The magpie is a cheerful bird in these stories.'),
              N('She brings good news, and the tiger is often a bit silly.'),
            ]),
            o('A warning of danger.', [
              N('Not here. The tiger in these pictures is more funny than scary.'),
              N('The magpie brings good news.'),
            ]),
          ],
          'Learned that in Korean folk painting the magpie brings good news and the tiger is often a bit silly.',
        ),
      ],
      [
        ch('pat', 'Scratch the tiger behind the ear.', [
          N(
            'He leans into your hand so hard he falls over sideways. The magpie hops off his head just in time, and gives you a look.',
          ),
        ]),
        ch('bow', 'Nod politely to the magpie.', [
          N('The magpie looks at you, decides you will do, and nods back. Her long tail bobs.'),
        ]),
      ],
    ),
    sc(
      'a29-07-alley-done',
      [
        N('Your Nubbin climbs up the tiger’s nose and sits on his head where the magpie was.'),
        N('The tiger goes cross-eyed trying to see it, and purrs louder.'),
      ],
      [
        ask(
          1,
          'literacy',
          'showing a character trait through actions: how can you tell Derpy is gentle?',
          'RL.3.3',
          [N('Nobody says Derpy is gentle. How can you tell?')],
          [
            o(
              'He lies down carefully and lets a small Nubbin sit on his nose.',
              [
                N(
                  'Yes. What a character does tells you what a character is like, even if the writer doesn’t say it.',
                ),
                N('A big tiger who moves carefully around something small is being gentle.'),
              ],
              true,
            ),
            o('He is blue.', [
              N('The colour is fun, but it doesn’t tell you about his nature.'),
              N('Look at what he does: he lies down carefully and lets your Nubbin climb up.'),
            ]),
            o('He knocks over bins.', [
              N('That shows he is clumsy and hungry, which is funny.'),
              N('His gentleness shows in how he treats your Nubbin.'),
            ]),
          ],
          'Worked out a character trait, gentleness, from what a character does.',
        ),
      ],
    ),
    sc(
      'a29-07-note',
      [
        N(
          'The magpie hops onto the bin lid and drops a folded note in front of you. On the outside, in a careful old hand, it says “Rumi”.',
        ),
        N(
          'The tiger, Derpy as you will learn, has a name tag round his neck. The magpie’s tag says Sussie, and she is clearly in charge.',
        ),
        N(
          'You know who they belong to. The note smells faintly of old smoke, like the studio did.',
        ),
        N(
          'Sussie pecks the note towards you, then taps the fire stairs with her beak. Up: Rumi is on the roof.',
        ),
        N(
          'It is nine flights up, and each flight has 10 steps. You are absolutely not going to read the note, because it isn’t yours.',
        ),
        N('It is folded only once.', 'think'),
      ],
      [
        ask(
          4,
          'maths',
          'multiplication: 9 flights of 10 steps',
          '3.OA.A.3',
          [
            N(
              'There are nine flights of stairs, with 10 steps in each. How many steps will you climb?',
            ),
          ],
          [
            o(
              '90 steps.',
              [
                N('Yes. 9 × 10 = 90. Counting in tens: 10, 20, 30… up to 90.'),
                N('That is a lot of stairs for one small note.'),
              ],
              true,
            ),
            o('19 steps.', [
              N('19 is 9 + 10. Here we want 9 groups of 10, which is multiplication.'),
              N('9 × 10 = 90.'),
            ]),
            o('900 steps.', [
              N('That would be 90 flights. We only have 9.'),
              N('9 groups of 10 is 90.'),
            ]),
          ],
          'Multiplied 9 × 10 to count the steps in nine flights of stairs.',
        ),
        ask(
          5,
          'sel',
          'respecting other people’s private things, and what to do when you are tempted',
          'CASEL: Responsible decision-making',
          [
            N(
              'The note isn’t yours, and it’s only folded once. What do you think about reading someone else’s note?',
            ),
          ],
          [
            o('It’s private, so don’t read it.', [
              N('That is a fair answer. A folded note is a small “please don’t”.'),
              N('Being trusted with a message is a way of being trusted with a person.'),
            ]),
            o('It might be important to know what’s in it.', [
              N('That is a fair worry. Sometimes we want to know in order to help.'),
              N('But we can ask the person later, instead of peeking.'),
            ]),
            o('A quick look is only human.', [
              N('That is an honest answer. Almost everyone feels tempted.'),
              N('What counts is what we do next, and whether we are honest about it.'),
            ]),
          ],
          'Thought about being trusted with a private note, being tempted, and being honest.',
        ),
      ],
      [
        ch('read', 'Read it. Just the first line.', [
          N(
            '“Your friend with the knives pinned my coat to a wall, my best one. Meet me where the old wall goes up the hill.”',
          ),
          N(
            'You fold it back exactly as it was, feeling awful. You also want to know about the coat.',
          ),
        ]),
        ch('dont', 'Don’t read it.', [
          N(
            'You don’t read it. You hold it face down all the way up, at arm’s length, like a hot plate.',
          ),
          N(
            'At the top your Nubbin, who can’t read, unfolds it, looks at it upside down with great interest, and folds it back.',
          ),
        ]),
      ],
    ),
    sc(
      'a29-07-note-done',
      [
        N(
          'Rumi is alone on the roof, in a hoodie, looking at the line of the Honmoon over the city. It flickers more than it used to.',
        ),
        N('Below her, the lights of Seoul go on and on, to every edge of the dark.'),
      ],
      [
        notice(
          1,
          'social-studies',
          'Seoul is the capital of South Korea, on the Han River, with more than nine million people',
          'D2.Geo.2.K-2',
          [
            N(
              'Seoul is the capital of South Korea. It lies on the banks of the Han River, with hills all round.',
            ),
            N(
              'More than nine million people live in the city itself, and many more in the towns around it. That makes it one of the biggest cities in the world.',
            ),
          ],
          'Learned that Seoul is the capital of South Korea, on the Han River, and one of the world’s biggest cities.',
        ),
      ],
    ),
    sc(
      'a29-07-complete',
      [
        N('You hand her the note. She sees the writing, and opens it with her back to you.'),
        R('Did you read it?'),
        N(
          'You don’t answer fast enough. She laughs, the first real laugh you have heard from her in days.',
          'happy',
        ),
        R('Of course you did. Don’t tell Mira. Don’t tell Zoey. Don’t tell the tiger.'),
        N(
          'Down in the alley, Derpy rolls onto his back, and Sussie sits on his tummy, and they both look up at the roof.',
        ),
      ],
      [
        ask(
          2,
          'sel',
          'when you have broken someone’s trust, telling the truth and saying sorry helps',
          'CASEL: Responsible decision-making',
          [N('If you have read a note you shouldn’t have, what helps most afterwards?')],
          [
            o(
              'Tell the truth and say sorry.',
              [
                N('Yes. Honesty and an apology can mend a small break in trust.'),
                N('Rumi laughed because she had guessed, and because the break was small.'),
              ],
              true,
            ),
            o('Pretend you didn’t.', [
              N('That is tempting. But a hidden mistake can grow, and Rumi can often tell.'),
              N('Telling the truth and saying sorry is better for both of you.'),
            ]),
            o('Hope nobody asks.', [
              N(
                'A lot of people try that. But hoping often feels heavy, and it doesn’t fix anything.',
              ),
              N('Telling the truth and saying sorry is lighter.'),
            ]),
          ],
          'Learned that telling the truth and saying sorry helps mend a small break in trust.',
        ),
      ],
    ),
  ],
  [gl('minhwa', 'Korean folk painting, made by ordinary people for their homes.', 'a29-07-alley')],
);

// ================================================================== A29-8 The Voices
const Q8: EduQuest = quest(
  'a29-08',
  'The Voices',
  {
    'a29-08-s1': {
      goal: 'Keep watch at the bottom of the old city wall.',
      hint: 'Sit at the foot of the steps where the wall climbs the hill.',
    },
    'a29-08-s2': {
      goal: 'Listen to what Jinu tells her.',
      hint: 'You can hear them from the lamp at the bend in the wall.',
    },
  },
  [
    sc(
      'a29-08-watch',
      [
        R(
          'I need someone to stand at the bottom of the steps and look normal. Can you look normal?',
        ),
        N('You look at your Nubbin, in its noodle hat, and at yourself. You say you can try.'),
        N(
          'The old city wall climbs the hill in big grey stones, with lamps along it, and the whole city below like a spilt jewel box.',
        ),
        N(
          'Halfway up, Jinu is sitting on the wall in his black coat, with no hat. Derpy is asleep across his feet.',
        ),
        N(
          'Rumi goes up to him with her hands in her pockets. You stay at the bottom, looking normal.',
        ),
        N('Sussie lands beside you on the bottom step, and looks normal too, in her own way.'),
      ],
      [
        notice(
          2,
          'social-studies',
          'the Seoul city wall: more than 600 years old and about 18 kilometres long',
          'D2.His.2.K-2',
          [
            N(
              'This is Seoul’s old city wall. It is more than 600 years old, and it runs for about 18 kilometres over four hills.',
            ),
            N('It was built to protect the capital. Today people walk along it for the view.'),
          ],
          'Learned that Seoul’s city wall is more than 600 years old and about 18 kilometres long.',
        ),
        ask(
          5,
          'maths',
          'distance, speed and time: 18 km at 3 km an hour',
          '4.MD.A.2',
          [
            N(
              'The wall is about 18 kilometres long. If you walked along it at 3 kilometres an hour, how many hours would it take?',
            ),
          ],
          [
            o(
              '6 hours.',
              [
                N(
                  'Yes. 18 ÷ 3 = 6. Every hour you go 3 kilometres: 3, 6, 9, 12, 15, 18. Six hours.',
                ),
                N('Pack a lunch, and some biscuits for your Nubbin.'),
              ],
              true,
            ),
            o('15 hours.', [
              N('15 is 18 − 3. We want to know how many 3s fit into 18.'),
              N('3, 6, 9, 12, 15, 18 is six jumps, so 6 hours.'),
            ]),
            o('54 hours.', [
              N('54 is 18 × 3, but we divide to find a time.'),
              N('18 ÷ 3 = 6 hours.'),
            ]),
          ],
          'Divided 18 km by 3 km an hour to find that the walk takes 6 hours.',
        ),
      ],
      [
        ch('normal', 'Look normal.', [
          N(
            'You look normal so hard that a passing grandmother asks if you are lost, and gives your Nubbin a sweet.',
          ),
        ]),
        ch('up', 'Edge a few steps up.', [
          N(
            'You edge up a few steps. Sussie hops up beside you, step for step, as if this was her idea.',
          ),
        ]),
      ],
    ),
    sc(
      'a29-08-story',
      [
        J(
          'You have voices too. I can tell. Not the singing kind. The other kind, that talk in your head at night.',
        ),
        R('Everyone has those.'),
        J(
          'His are louder. Gwi-Ma’s. He finds the thing you’re ashamed of, and he talks to it until it’s all you can hear.',
          'sad',
        ),
        R('And you? What’s yours?'),
        J(
          'I was human once. Four hundred years ago. A poor musician with a lute and a hole in his shoe, playing in market squares.',
        ),
        J(
          'My family were hungry, and I was no use to them. The demon king offered me a voice that everyone would love.',
        ),
        J(
          'So I said yes, to feed them. And he kept the best part of me, and I never saw them again.',
          'soft',
        ),
        N('Rumi is quiet. Then she reaches out, and nearly touches his sleeve, and doesn’t.'),
        N(
          'From down the wall, you can see Jinu’s face better than she can. When he says “to feed them”, he looks away.',
          'think',
        ),
      ],
      [
        ask(
          8,
          'literacy',
          'noticing small actions that suggest a character is telling a kinder version of events',
          'RL.3.3',
          [
            N(
              'Jinu looked away when he said “to feed them”. What might that tell you about his story?',
            ),
          ],
          [
            o('Maybe it isn’t the whole truth.', [
              N(
                'That is a fair answer. People often look away when they are not quite telling it straight.',
              ),
              N('Keep that in your pocket as the story goes on.'),
            ]),
            o('Maybe it hurts too much to say.', [
              N(
                'That is a fair answer, and a kind one. Pain can make people turn their faces away.',
              ),
              N('Both can be true at once. A hurt can make a story softer.'),
            ]),
            o('Maybe he was just tired.', [
              N('That is a fair thought, and a plain one. Not every glance is a clue.'),
              N('But this is a story, and a look at that moment is likely to matter.'),
            ]),
          ],
          'Noticed a small action and wondered what it might say about whether a character’s story is complete.',
        ),
      ],
      [
        ch('notice', 'Notice it, and keep it.', [
          N(
            'You notice it, and you keep it, because it is not your story to tell. But you remember the way he looked away.',
          ),
        ]),
        ch('kind', 'Decide it doesn’t matter tonight.', [
          N(
            'Maybe it doesn’t matter. Everyone tells their own story a bit kinder than it was. You hope that’s all it is.',
          ),
        ]),
      ],
    ),
    sc(
      'a29-08-story-done',
      [
        N(
          'Rumi comes down the steps alone. Her voice, when she says “let’s go”, is rough at the edges, but it’s there.',
        ),
        N('She sips from a bottle of water and clears her throat.'),
      ],
      [
        ask(
          1,
          'science',
          'a voice is made by vibrating vocal cords; tired cords sound rough, and rest helps',
          '1-PS4-1',
          [
            N(
              'Rumi’s voice is rough because she has been singing for days. What will help her voice most?',
            ),
          ],
          [
            o(
              'Rest, and sips of water.',
              [
                N(
                  'Yes. Her vocal cords are two small folds that vibrate to make sound. When they are tired they sound rough, and they recover with rest.',
                ),
                N('Water helps keep them comfortable.'),
              ],
              true,
            ),
            o('Shouting louder.', [
              N('Shouting would make the folds more tired.'),
              N('Rest and water are what a tired voice needs.'),
            ]),
            o('Whispering all night.', [
              N('Whispering can be tiring for the voice too.'),
              N('Resting quietly, and sipping water, helps most.'),
            ]),
          ],
          'Learned that the voice comes from vibrating vocal cords, and that rest and water help a tired voice.',
        ),
      ],
    ),
    sc(
      'a29-08-complete',
      [
        R('He’s a demon. I know he’s a demon. I’m not stupid.'),
        R('But he knows about the voices. Nobody else knows about the voices.', 'soft'),
        N(
          'Halfway home she stops at a street stall and buys two fish-shaped pastries filled with red bean, and gives one to your Nubbin without asking.',
        ),
        N(
          'Your Nubbin eats the tail first. Rumi watches it and doesn’t say anything else all the way home.',
        ),
      ],
      [
        ask(
          1,
          'sel',
          'telling someone who understands can ease a worry that won’t go quiet',
          'CASEL: Relationship skills',
          [
            N(
              'Rumi feels better because someone else knows about the voices in her head. What can help when a worry won’t go quiet?',
            ),
          ],
          [
            o(
              'Telling someone who understands.',
              [
                N(
                  'Yes. A worry shared is often lighter, especially with someone who has felt the same.',
                ),
                N('If the first person doesn’t understand, try another one. It is worth trying.'),
              ],
              true,
            ),
            o('Keeping it in and waiting.', [
              N('Some worries do fade with time. But many get louder when we are alone with them.'),
              N('Telling someone you trust usually makes them smaller.'),
            ]),
            o('Pretending it isn’t there.', [
              N('That works for a few minutes. Then it tends to come back louder.'),
              N('Sharing it with a person who understands works better.'),
            ]),
          ],
          'Learned that sharing a worry with someone who understands can make it lighter.',
        ),
      ],
    ),
  ],
);

// ================================================================== A29-9 The Harsh Song
const Q9: EduQuest = quest(
  'a29-09',
  'The Harsh Song',
  {
    'a29-09-s1': {
      goal: 'Make tea while the three of them work.',
      hint: 'Use the kettle in the studio kitchen. Barley tea is in the tin.',
    },
    'a29-09-s2': {
      goal: 'Give out the tea. Take nobody’s side out loud.',
      hint: 'Put a cup by each of them. You don’t have to say anything.',
    },
  },
  [
    sc(
      'a29-09-studio',
      [
        N(
          'The rehearsal studio has thick foam on every wall and a keyboard with a coffee ring on it. Mira and Zoey have been here all night.',
        ),
        Z(
          'We’ve got it. The thing that brings them down. A new song, all about them. What they really are.',
        ),
        M(
          'We call them out in front of everyone. Every fan who loves those boys hears exactly what they are.',
        ),
        N(
          'Zoey plays it on the keyboard: a hard, bright, stabbing tune, all corners. It is very catchy, and quite cruel.',
        ),
        N(
          'Rumi listens with her arms folded and her sleeves down. She doesn’t say anything for a long time.',
          'think',
        ),
        M('Runner, tea. This is going to be a long one.'),
      ],
      [
        ask(
          0,
          'science',
          'foam soaks up sound so it does not bounce back as an echo',
          '4-PS3-2',
          [N('Why would a music studio cover its walls in foam?')],
          [
            o(
              'Foam soaks up sound, so it doesn’t bounce back as an echo.',
              [
                N(
                  'Yes. Hard walls bounce sound back at you, which muddles the music. Soft foam takes the shaking out of the air.',
                ),
                N('That is how a studio can make every note sound clean.'),
              ],
              true,
            ),
            o('To keep the room warm.', [
              N('Foam can keep warmth in, but that is not why studios use it.'),
              N('It soaks up sound, so there is no echo.'),
            ]),
            o('To make the room look cosy.', [
              N('It might do that too. But the real job is for the sound.'),
              N('Foam soaks up echoes, so every note sounds clean.'),
            ]),
          ],
          'Learned that soft foam soaks up sound, so a music studio has no echo.',
        ),
      ],
      [
        ch('barley', 'Make barley tea.', [
          N(
            'You make boricha, roasted barley tea, toasty and mild and free of caffeine. The studio starts to smell like a bakery, which helps a bit.',
          ),
        ]),
        ch('strong', 'Make it very strong.', [
          N(
            'You make it very strong. Mira looks at the colour of it and nods, as one serious person to another.',
          ),
        ]),
      ],
    ),
    sc(
      'a29-09-studio-done',
      [N('By the time the kettle clicks off, the music has stopped and the voices have started.')],
      [
        ask(
          0,
          'literacy',
          'a word with more than one meaning: voices that sing and voices that argue',
          'L.3.4',
          [
            N(
              'Earlier in the story, “voices” meant singing. Here, “the voices have started” means something else. What?',
            ),
          ],
          [
            o(
              'People are talking loudly, and arguing.',
              [
                N('Yes. “Voice” can mean the sound you sing with, or the way you speak up.'),
                N('When a word has more than one meaning, the sentence around it tells you which.'),
              ],
              true,
            ),
            o('More singing is starting.', [
              N('The line just said the music has stopped.'),
              N('So here the voices are people arguing.'),
            ]),
            o('The kettle is whistling.', [
              N('The kettle just clicked off, so it isn’t whistling now.'),
              N('The voices belong to the people, and they have started arguing.'),
            ]),
          ],
          'Used the sentence around a word to choose between two meanings of voices.',
        ),
      ],
    ),
    sc(
      'a29-09-argument',
      [
        R('It’s mean. It’s really mean. It’s not who we are.'),
        Z(
          'They’re demons, Rumi! They’re stealing our fans’ cheer! Who cares if it’s mean?',
          'angry',
        ),
        R(
          'I care. Not everything that’s not human is the same. Not everyone who’s wrong is wrong all the way through.',
        ),
        M('Listen to yourself. You sound like you’re on their side.', 'angry'),
        N(
          'That lands. Rumi pulls her sleeves down over her hands, and her voice, when it comes, cracks right in the middle.',
        ),
        R('I’m on our side. I’m always on our side.', 'sad'),
        N(
          'Nobody says anything, and the keyboard hums. You are standing in the middle of the room holding three cups of tea.',
        ),
      ],
      [
        ask(
          6,
          'sel',
          'disagreeing without cruelty; being fair to someone you disagree with',
          'CASEL: Social awareness',
          [
            N(
              'Zoey says it doesn’t matter if the song is cruel. Rumi says it does. What do you think?',
            ),
          ],
          [
            o('Being cruel is never fair, even to someone who is wrong.', [
              N('That is a fair answer. Many people would agree with Rumi.'),
              N(
                'Mira and Zoey are very hurt and very scared, which is why they want something sharp.',
              ),
            ]),
            o('If someone is hurting people, they deserve a harsh answer.', [
              N('That is a fair answer too, and it comes from caring about the fans.'),
              N('Still, it is worth asking if a harsh song is the same as a fair one.'),
            ]),
            o('You can stop someone without being cruel.', [
              N(
                'That is a thoughtful answer. You can be firm about what is wrong and still be kind in how you do it.',
              ),
              N('That might be where Rumi is heading.'),
            ]),
          ],
          'Thought about whether being cruel can ever be fair, and listened to more than one side.',
        ),
      ],
      [
        ch('rumi', 'Give Rumi hers first.', [
          N(
            'You give Rumi her cup first, and Mira’s mouth goes thin. Then you give Mira hers, and Zoey hers, and say nothing.',
          ),
        ]),
        ch('order', 'Put the cups down all at once, in a row.', [
          N(
            'You put all three down at once, in a row on the keyboard lid. Zoey snorts, despite herself: it’s very diplomatic.',
          ),
        ]),
        ch('zoey', 'Give Zoey hers first; she’s the youngest.', [
          N(
            'You give Zoey hers first. She holds it in both hands and looks at the floor, suddenly young, and the room loosens a little.',
          ),
        ]),
      ],
    ),
    sc(
      'a29-09-complete',
      [
        N('They drink the tea. They don’t make up, and they don’t fight any more either.'),
        Z(
          'We’re doing the song. At the Idol Awards. It’s a vote, Rumi, and it’s two against one.',
          'sad',
        ),
        R('Then it’s two against one.'),
        N(
          'Rumi takes her cup to the sink, and washes it, and dries it, and puts it away, and leaves.',
        ),
        M('Thanks for the tea, runner. Sorry you had to hear that.', 'soft'),
      ],
      [
        ask(
          2,
          'social-studies',
          'a vote decides by majority, but a fair group still listens to the person who is outvoted',
          'D2.Civ.8.K-2',
          [
            N(
              'Two of the three voted for the song, and Rumi voted against. What does a vote like this do, and what should a fair group still do?',
            ),
          ],
          [
            o(
              'Two out of three is the majority, and the group should still listen to Rumi’s reasons.',
              [
                N(
                  'Yes. A vote is a quick fair way to decide. A fair group also listens to the person who lost the vote.',
                ),
                N('Sometimes that one person is seeing something the others missed.'),
              ],
              true,
            ),
            o('Rumi must be quiet now.', [
              N(
                'A vote decides what the group does. It doesn’t say the one who lost must be silent.',
              ),
              N('A fair group still listens to her reasons.'),
            ]),
            o('The vote doesn’t count unless all three agree.', [
              N(
                'Some groups choose to work that way. But this group chose to go with the majority.',
              ),
              N('Even then, the one who disagrees deserves to be heard.'),
            ]),
          ],
          'Learned that a majority vote decides, and that a fair group still listens to the person who is outvoted.',
        ),
      ],
    ),
  ],
  [
    gl('boricha', 'Korean tea made from roasted barley. It has no caffeine.', 'a29-09-studio'),
    gl('majority', 'More than half of the votes.', 'a29-09-complete'),
  ],
);

// ================================================================== A29-10 The Deal
const Q10: EduQuest = quest(
  'a29-10',
  'The Deal',
  {
    'a29-10-s1': {
      goal: 'Hold the umbrella while Rumi waits on the wall.',
      hint: 'It’s raining. Go up the wall steps with the umbrella.',
    },
    'a29-10-s2': {
      goal: 'Hear the bargain.',
      hint: 'Stay by them under the lamp.',
    },
    'a29-10-s3': {
      goal: 'Look at what is wrong with Jinu.',
      hint: 'After Rumi goes, go back up to the lamp.',
    },
  },
  [
    sc(
      'a29-10-rain',
      [
        N(
          'It is raining over the city, the warm, steady rain of the summer rainy season, which Koreans call jangma. The lamps along the old wall look as if they are melting.',
        ),
        R('Come with me. If I go alone I’ll talk myself out of it.'),
        N(
          'You hold the umbrella. Your Nubbin sits on your shoulder, in its noodle hat, which the rain drums on like a little roof.',
        ),
        N(
          'Jinu is on the wall already. Derpy is sitting beside him getting soaked, and doesn’t seem to mind.',
        ),
        R('I came to offer you something. A bargain.'),
        J('Hunters don’t bargain with demons.'),
        R('This one does.'),
      ],
      [
        ask(
          1,
          'science',
          'seasonal weather patterns: Korea’s rainy season comes each year from late June into July',
          '3-ESS2-1',
          [
            N(
              'Jangma comes every year, from late June into July. If you kept a rain chart for five summers, what would you expect to see?',
            ),
          ],
          [
            o(
              'Lots of rainy days in the same stretch each year.',
              [
                N(
                  'Yes. Weather data from many years shows patterns by season. Jangma is one of them.',
                ),
                N(
                  'That is how people know when to bring an umbrella, long before the clouds arrive.',
                ),
              ],
              true,
            ),
            o('Rain on a different day each summer, never in a pattern.', [
              N(
                'Weather does change from day to day. But over several years, a rainy season shows up in the same weeks.',
              ),
              N('Charts show the pattern.'),
            ]),
            o('No rain at all in summer.', [
              N('That might be true somewhere else. In Korea, summer has a rainy season.'),
              N('The chart would show many rainy days from late June into July.'),
            ]),
          ],
          'Learned that weather data over years shows seasonal patterns, such as Korea’s summer rainy season.',
        ),
      ],
      [
        ch('cover', 'Hold the umbrella over Rumi.', [
          N(
            'You hold it over Rumi, and get wet down one side. She notices, and steps closer so it covers both of you.',
          ),
        ]),
        ch('derpy', 'Hold it over Derpy.', [
          N(
            'You hold it over the tiger. He looks up at it, astonished, as if nobody has ever done this, and purrs like a kettle on the boil.',
            'happy',
          ),
        ]),
      ],
    ),
    sc(
      'a29-10-deal',
      [
        R(
          'The Idol Awards. Help us win. Stop your band, and let us sing, and the Honmoon is sealed for good.',
        ),
        R(
          'And when it is, you don’t go back down with the others. You stay here, in the world. I’ll make sure.',
        ),
        J('Why would you do that for me?'),
        R('Because you hid my marks. You didn’t have to.', 'soft'),
        N(
          'She says it plainly, and her voice doesn’t crack at all. You hear it, and so does she: clear, the way it was on the first night.',
        ),
        N('Jinu hears it too. He looks at her for a long time, and the rain runs off his hair.'),
        J('All right. A deal.'),
      ],
      [
        ask(
          6,
          'social-studies',
          'what makes a bargain fair: both sides give and get, and both agree freely',
          'D2.Civ.8.K-2',
          [N('Rumi and Jinu have made a deal. What makes a bargain fair?')],
          [
            o(
              'Both sides get something, and both agree without being forced.',
              [
                N('Yes. A fair bargain gives each side something, and nobody is pushed into it.'),
                N('Here, Jinu helps with the awards, and Rumi helps him stay in the world.'),
              ],
              true,
            ),
            o('Only the stronger side gets something.', [
              N('That would be a one-sided deal, and one side would lose.'),
              N('A fair bargain gives both sides something.'),
            ]),
            o('One side must agree, even if it doesn’t want to.', [
              N('If someone is forced, it isn’t a real bargain.'),
              N('Both sides must agree freely.'),
            ]),
          ],
          'Learned that a fair bargain gives both sides something and that both agree freely.',
        ),
      ],
      [
        ch('shake', 'Watch them shake on it.', [
          N(
            'They shake hands, carefully, a hunter and a demon. Derpy puts his big wet paw on top of both their hands.',
          ),
        ]),
        ch('voice', 'Notice her voice.', [
          N(
            'Her voice is whole, and you want to say so, and don’t. Some things are better noticed than announced.',
            'soft',
          ),
        ]),
      ],
    ),
    sc(
      'a29-10-call',
      [
        N(
          'Rumi goes down the steps, lighter than she came up. You go back for the umbrella you left leaning on the wall.',
        ),
        N('Jinu is still there. He has a hand pressed flat on the stones, and he is shaking.'),
        N(
          'Under the lamp his shadow is the wrong size. It stretches all the way down the hill, and at the end of it there is a red glow.',
        ),
        G('A deal with a hunter. How sweet.'),
        G(
          'Shall I remind you of your mother, and your little sister, who waited for you? You never came.',
        ),
        J('Don’t.', 'sad'),
        G(
          'Then remember who you belong to, little musician. Bring her to me, and I will quiet the voices in your head.',
        ),
        N(
          'The shadow snaps back to its right size. Jinu sees you, and the umbrella, and puts a finger to his lips.',
        ),
      ],
      [
        ask(
          2,
          'science',
          'shadows are longest when the Sun is low in the sky',
          '5-ESS1-2',
          [
            N(
              'Jinu’s shadow stretches far down the hill. In the real world, when are shadows longest?',
            ),
          ],
          [
            o(
              'In the early morning and evening, when the Sun is low.',
              [
                N(
                  'Yes. When the Sun is low, it shines across the ground, and shadows stretch out long.',
                ),
                N(
                  'At noon, the Sun is high, and shadows are short. Jinu’s shadow isn’t natural at all.',
                ),
              ],
              true,
            ),
            o('At noon, when the Sun is high.', [
              N('At noon, shadows are at their shortest, because the light comes down from above.'),
              N('They are longest when the Sun is low.'),
            ]),
            o('Only at night.', [
              N('At night there is no Sun, so there are no sunlit shadows.'),
              N('Shadows are longest in the early morning and evening, when the Sun is low.'),
            ]),
          ],
          'Learned that shadows are longest when the Sun is low, in the morning and evening.',
        ),
      ],
    ),
    sc(
      'a29-10-complete',
      [
        J('You didn’t hear that.'),
        N('You don’t promise anything. You hand him the umbrella, because he hasn’t got one.'),
        N(
          'He holds it like nobody has handed him anything in four hundred years. Then he and Derpy walk off into the rain.',
        ),
        N('Your Nubbin watches them go, and pulls its hat down, and sneezes.'),
      ],
      [
        ask(
          2,
          'sel',
          'a small kindness can matter a lot to someone who is struggling',
          'CASEL: Social awareness',
          [
            N(
              'You gave Jinu an umbrella and said nothing. What can a small kindness mean to someone who is struggling?',
            ),
          ],
          [
            o('It can tell them they are not invisible.', [
              N('That is a fair answer. Being noticed can matter more than the thing itself.'),
              N('Jinu held the umbrella as if it was precious.'),
            ]),
            o('It might help them feel less alone.', [
              N(
                'That is a fair answer, and a kind one. Even a small thing can say “I am with you”.',
              ),
              N('Jinu didn’t say thank you, but you could see it.'),
            ]),
            o('It might not change much, but it does no harm.', [
              N('That is an honest answer. We can’t always see what a small kindness does.'),
              N('Often it does more than we know.'),
            ]),
          ],
          'Thought about what a small kindness can mean to someone who is struggling.',
        ),
      ],
    ),
  ],
  [
    gl('jangma', 'The rainy season in Korea, from late June into July.', 'a29-10-rain'),
    gl('bargain', 'A deal where each side gives something and gets something.', 'a29-10-deal'),
  ],
);

// ================================================================== A29-11 The Idol Awards
const Q11: EduQuest = quest(
  'a29-11',
  'The Idol Awards',
  {
    'a29-11-s1': {
      goal: 'Get the costumes to the dressing room in the backstage chaos.',
      hint: 'Carry the garment bags through the crowded corridors.',
    },
    'a29-11-s2': {
      goal: 'Watch Huntrix’s set on the backstage monitor.',
      hint: 'The monitor by the stage door shows the live feed.',
    },
    'a29-11-s3': {
      goal: 'Find the real Mira and Zoey.',
      hint: 'Try the doors along the service corridor, where the stagehands took them.',
    },
  },
  [
    sc(
      'a29-11-backstage',
      [
        N(
          'Backstage at the Idol Awards is ten times the arena: every band in Korea, every stylist, every runner, in one corridor.',
        ),
        B(
          'Costumes! Dressing room four! Three bags, four costumes in each! If you see a Saja Boy, don’t look at him, don’t speak to him!',
        ),
        N(
          'You carry three garment bags over your head through the crush. Your Nubbin rides on top of the bags like a lookout.',
        ),
        N(
          'A boy band in silver suits squeezes past, all apologising at once. Somebody’s hairspray goes off like a fog machine.',
        ),
        N(
          'Halfway down the corridor, two stagehands in caps stop Mira and Zoey and say something about a problem with the lights.',
        ),
        N(
          'Mira and Zoey follow them round a corner. Your Nubbin turns right round on the bags to watch them go, and its crown goes stiff.',
          'think',
        ),
      ],
      [
        ask(
          1,
          'maths',
          'equal groups: 3 bags of 4 costumes',
          '3.OA.A.1',
          [
            N(
              'Bobby says there are three bags with four costumes in each. How many costumes are you carrying?',
            ),
          ],
          [
            o(
              '12 costumes.',
              [
                N('Yes. Three groups of four: 4 + 4 + 4 = 12, which is 3 × 4.'),
                N('No wonder you are holding them over your head.'),
              ],
              true,
            ),
            o('7 costumes.', [
              N('7 is 3 + 4. Here we want three equal groups of four.'),
              N('4 + 4 + 4 = 12.'),
            ]),
            o('4 costumes.', [
              N('Four is how many are in just one bag.'),
              N('There are three bags, so 4 + 4 + 4 = 12.'),
            ]),
          ],
          'Found the total of three equal groups of four: 3 × 4 = 12 costumes.',
        ),
      ],
      [
        ch('follow', 'Try to follow them.', [
          N(
            'You try. A man with a rack of sequinned jackets cuts across you, and by the time he’s past, the corner is empty.',
          ),
        ]),
        ch('bobby', 'Tell Bobby.', [
          B('Lights? Fine! Lights are important! Costumes are also important! Go!'),
          N('He isn’t listening. Nobody is listening tonight.'),
        ]),
      ],
    ),
    sc(
      'a29-11-backstage-done',
      [
        N(
          'Two minutes later, Mira and Zoey come back down the corridor, smiling. They walk past you without a word.',
        ),
        N('Their eyes are too bright, and they don’t even look at your Nubbin.'),
      ],
      [
        ask(
          1,
          'literacy',
          'using clues to infer that something is wrong',
          'RL.3.3',
          [
            N(
              'Mira and Zoey smile and walk past without a word. What clues tell you something is wrong?',
            ),
          ],
          [
            o(
              'They didn’t speak, and their eyes are too bright, and they ignored the Nubbin.',
              [
                N(
                  'Yes. Three small clues add up. Good readers collect clues before they decide what a scene means.',
                ),
                N('Mira and Zoey would never walk past you without a word.'),
              ],
              true,
            ),
            o('They were smiling.', [
              N('A smile alone is a good sign. But look at what is missing: they said nothing.'),
              N('The silence, and the too-bright eyes, are the clues.'),
            ]),
            o('It was a busy corridor.', [
              N('It was busy, but they walked right past you without a word.'),
              N('That, with the too-bright eyes, is what feels wrong.'),
            ]),
          ],
          'Used several small clues to work out that something is wrong with how characters behave.',
        ),
      ],
    ),
    sc(
      'a29-11-monitor',
      [
        N(
          'On the monitor, Huntrix walk out to a roar, Rumi in the middle. Mira and Zoey are on either side of her, and they don’t look at her.',
        ),
        N(
          'The opening chords are wrong: it isn’t the song they rehearsed. It’s the harsh one, the cruel one, all corners.',
        ),
        N(
          'Rumi falters, and looks left and right. The two girls beside her are singing it at her, not with her.',
          'shock',
        ),
        N(
          'Then one of them grabs Rumi’s arm, and with one long tear of fabric, rips her sleeve away from wrist to shoulder.',
        ),
        N(
          'The cameras swing in. The marks are on every screen in the hall, on every phone in the city, violet and silver and huge.',
        ),
        N('The crowd goes very quiet. Then it starts to mutter, and the mutter has a hard edge.'),
        N(
          'On the monitor, “Mira” turns to the camera and smiles, with too many teeth. It isn’t Mira, and it never was.',
          'shock',
        ),
      ],
      [
        ask(
          5,
          'sel',
          'empathy: what helps a person who has been exposed against their will',
          'CASEL: Social awareness',
          [
            N(
              'Rumi’s private marks are on every screen, and nobody asked her. What would help her most right now?',
            ),
          ],
          [
            o('Someone who stays kind and doesn’t stare.', [
              N(
                'That is a fair answer. Kindness that doesn’t pry tells her she is still the same person to you.',
              ),
              N('Staring would make anyone feel more exposed.'),
            ]),
            o('Someone standing next to her on the stage.', [
              N(
                'That is a fair answer. Having a friend close can make a hard moment feel smaller.',
              ),
              N('Her friends are not beside her yet, which is part of what hurts.'),
            ]),
            o('A little time, away from all the screens.', [
              N(
                'That is a fair answer. Some people need to step away and catch their breath first.',
              ),
              N('Space and then company can be a good order.'),
            ]),
          ],
          'Thought about what helps someone who has been exposed against their will, with no single right answer.',
        ),
      ],
    ),
    sc(
      'a29-11-monitor-done',
      [
        N(
          'Above the hall, the Honmoon tears like wet paper. The lights all over the city flicker at once.',
        ),
      ],
      [
        ask(
          0,
          'science',
          'water weakens paper because paper is made of tangled fibres',
          '2-PS1-1',
          [
            N(
              'The Honmoon tears “like wet paper”. Why does wet paper tear so much more easily than dry paper?',
            ),
          ],
          [
            o(
              'Water gets between the paper’s fibres and loosens them.',
              [
                N(
                  'Yes. Paper is made of tiny plant fibres tangled together. Water gets in between them, so they slide apart.',
                ),
                N('That is why a soggy page falls to bits in your hand.'),
              ],
              true,
            ),
            o('Wet paper is heavier.', [
              N('It is a little heavier, but weight isn’t what makes it tear.'),
              N('The water loosens the fibres that hold it together.'),
            ]),
            o('Wet paper is colder.', [
              N('Cold has little to do with it.'),
              N('Water loosens the fibres.'),
            ]),
          ],
          'Learned that water weakens paper by getting between its tangled plant fibres.',
        ),
      ],
    ),
    sc(
      'a29-11-store',
      [
        N(
          'You run. Back down the corridor, round the corner, into a service passage that smells of paint and old sandwiches.',
        ),
        N(
          'Door after door: mops, cables, chairs. Your Nubbin jumps off the bags and runs ahead, sniffing at the gaps under the doors.',
        ),
        N('At the last door it stops, and puts both paws on it, and looks back at you.'),
        N(
          'Inside, in the dark among the folded tables, Mira and Zoey are tied back to back with tape, furious and trying to shout.',
        ),
        M('Get this off. Get it off, get it off. Who’s on stage? Who is on stage?', 'angry'),
        Z('They had our faces. They had our faces, runner!', 'shock'),
      ],
      [
        ask(
          3,
          'literacy',
          'words that show strong feelings: furious',
          'RL.1.4',
          [N('The writer says Mira and Zoey are “furious”. Which word means almost the same?')],
          [
            o(
              'Very, very angry.',
              [
                N('Yes. Furious is a strong word for anger, a bit like “boiling over”.'),
                N('Writers choose strong feeling words to show you how big a feeling is.'),
              ],
              true,
            ),
            o('A little bit sleepy.', [
              N('Sleepy would be a quiet feeling. Furious is loud.'),
              N('It means very, very angry.'),
            ]),
            o('Rather pleased.', [
              N('Mira and Zoey are tied up, so they are not pleased at all.'),
              N('Furious means very, very angry.'),
            ]),
          ],
          'Learned that furious means very angry, and noticed how strong feeling words show a big feeling.',
        ),
      ],
      [
        ch('tape', 'Tear the tape off.', [
          N('You tear the tape off, and a lot of hair with it. Nobody complains.'),
        ]),
        ch('nubbin', 'Let your Nubbin nibble through it.', [
          N(
            'Your Nubbin chews through the tape with great determination and a terrible face. It takes a while, but it works.',
          ),
        ]),
      ],
    ),
    sc(
      'a29-11-complete',
      [
        N('The three of you run back to the stage door in time to see the end on the monitor.'),
        N(
          'The two fakes melt into smoke on stage. Rumi is standing alone in the middle, holding her bare arm, with ten thousand people staring at it.',
        ),
        N(
          'Mira and Zoey stand very still in front of the monitor. They’re looking at the marks too.',
        ),
        M('How long?', 'sad'),
        N('Nobody answers. The screen goes to an advert for fizzy drinks.'),
      ],
      [
        ask(
          2,
          'social-studies',
          'respect for other people’s private things: ask first',
          'D2.Civ.8.K-2',
          [
            N(
              'Rumi’s private marks were shown to ten thousand people without her say. What is a fair rule for sharing someone else’s private things?',
            ),
          ],
          [
            o(
              'Ask them first. It is their story to share.',
              [
                N(
                  'Yes. A person’s private thing belongs to them, and asking first is how we show respect.',
                ),
                N('If they say no, that is the end of it.'),
              ],
              true,
            ),
            o('If it’s true, anyone can share it.', [
              N('Being true isn’t enough. A true thing can still be private.'),
              N('The fair rule is to ask first.'),
            ]),
            o('Share it if lots of people would like to see.', [
              N('Many people watching doesn’t make it fair. Rumi never agreed.'),
              N('The fair rule is to ask the person first.'),
            ]),
          ],
          'Learned that private things belong to the person who has them, and that we should ask first.',
        ),
      ],
    ),
  ],
  [
    gl('furious', 'Very, very angry.', 'a29-11-store'),
    gl('stagehand', 'A person who works backstage, moving scenery and lights.', 'a29-11-backstage'),
  ],
);

// ================================================================== A29-12 Seen
const Q12: EduQuest = quest(
  'a29-12',
  'Seen',
  {
    'a29-12-s1': {
      goal: 'Stay with Mira and Zoey when they come off.',
      hint: 'Go to the loading bay behind the stage.',
    },
    'a29-12-s2': {
      goal: 'Wait in the car park with the gear case.',
      hint: 'Sit on the gear case by the van.',
    },
    'a29-12-s3': {
      goal: 'Follow Rumi to the roof.',
      hint: 'Take the fire stairs to the roof of the hall.',
    },
  },
  [
    sc(
      'a29-12-after',
      [
        N(
          'Rumi comes off stage with a stagehand’s jacket round her shoulders. Mira and Zoey are waiting in the loading bay.',
        ),
        M('You lied to us. For years. Every day. Every noodle.', 'angry'),
        R('I didn’t lie. I just didn’t say.'),
        Z('That’s the same, Rumi. That’s exactly the same.', 'sad'),
        R('Celine said nobody would understand.'),
        M('You didn’t give us the chance to understand. That’s the bit I can’t get past.'),
        N(
          'Mira turns and walks out of the bay. After a moment, Zoey follows her, and doesn’t look back, and then does.',
        ),
      ],
      [
        ask(
          5,
          'sel',
          'is not telling the same as lying? Honesty and trust',
          'CASEL: Responsible decision-making',
          [
            N(
              'Rumi says she didn’t lie, she just didn’t say. Zoey says that’s the same. What do you think?',
            ),
          ],
          [
            o('Leaving something out can still break trust.', [
              N(
                'That is a fair answer. When someone relies on us to be open, leaving out a big thing can hurt as much as a lie.',
              ),
              N('That is how Mira and Zoey feel.'),
            ]),
            o('Not saying and lying are different.', [
              N('That is a fair answer. A lie says something false, and silence doesn’t.'),
              N('But silence can still leave someone feeling shut out, which is what Mira said.'),
            ]),
            o('It depends why you didn’t say.', [
              N(
                'That is a thoughtful answer. Fear and shame are different from trying to trick someone.',
              ),
              N('Rumi was afraid. Her friends were hurt anyway. Both things are true.'),
            ]),
          ],
          'Thought about whether leaving something out is the same as lying, and how silence can affect trust.',
        ),
      ],
      [
        ch('stay', 'Stay where you are.', [
          N('You stay, because somebody should. You don’t know yet that you’re the somebody.'),
        ]),
        ch('zoey', 'Catch Zoey’s eye.', [
          N(
            'Zoey catches your eye at the door, and hers are wet. She shakes her head, not at you, at everything, and goes.',
            'sad',
          ),
        ]),
      ],
    ),
    sc(
      'a29-12-after-done',
      [
        N(
          'Rumi walks off too, the other way, down the ramp into the car park, and you lose her in the crowd of cars.',
        ),
        N('You think about Zoey, who “doesn’t look back, and then does”.'),
      ],
      [
        ask(
          1,
          'literacy',
          'a sentence can show mixed feelings: Zoey does not look back, and then does',
          'RL.3.3',
          [
            N(
              'Zoey “doesn’t look back, and then does”. What does that tell you about how she feels?',
            ),
          ],
          [
            o(
              'She is hurt, and she still cares.',
              [
                N(
                  'Yes. Her feet say “go”, and her heart says “wait”. One short sentence can hold two feelings.',
                ),
                N('That is a writer’s trick for showing, not telling.'),
              ],
              true,
            ),
            o('She doesn’t care at all.', [
              N('If she didn’t care, she would not look back.'),
              N('She is hurt, and she still cares.'),
            ]),
            o('She forgot something.', [
              N('Maybe, but the story is about her feelings for Rumi.'),
              N('She is hurt, and she still cares.'),
            ]),
          ],
          'Read a sentence that holds two feelings at once, and worked out what it shows about a character.',
        ),
      ],
    ),
    sc(
      'a29-12-find',
      [
        N(
          'The car park under the awards hall smells of exhaust and spilt fizzy drink. The noise upstairs has gone thin and strange.',
        ),
        N(
          'You are sitting on the gear case, because nobody told you where else to sit. Your Nubbin is in the merchandise bag, very quiet.',
        ),
        N(
          'Rumi comes down the ramp. She has the jacket over her arm, the one you handed her in the dressing room.',
        ),
        R('Here. You should have it back.'),
        R('You helped me hide. I asked you to. That’s on me.', 'soft'),
        N(
          'She holds it out until you take it. Then she sits down beside you on the case, with her bare arm out in the air.',
        ),
        R('I’ve been hiding them so long I don’t know what my arm feels like in the wind.'),
        N('You fold the jacket on your knee, and leave it there.'),
      ],
      [
        ask(
          4,
          'sel',
          'taking responsibility without blaming others: “that’s on me”',
          'CASEL: Responsible decision-making',
          [
            N(
              'Rumi says “That’s on me”. What does it look like to take responsibility for something?',
            ),
          ],
          [
            o(
              'Saying what you did, without blaming anyone else.',
              [
                N('Yes. Taking responsibility means owning your part, plainly, with no blame.'),
                N('Rumi doesn’t blame you for the jacket. She says she asked you.'),
              ],
              true,
            ),
            o('Saying it was someone else’s fault.', [
              N('That would be blaming, not taking responsibility.'),
              N('Owning your own part is the brave bit.'),
            ]),
            o('Pretending it never happened.', [
              N('That is hiding, not owning.'),
              N('Taking responsibility means saying what you did.'),
            ]),
          ],
          'Learned that taking responsibility means owning your part plainly, without blaming others.',
        ),
      ],
    ),
    sc(
      'a29-12-find-done',
      [
        R('I have to go and see someone. Then I have to see what’s left.'),
        N(
          'She goes up the ramp towards the roof. The clock by the lift says 10:50, and the awards set ended at 10:15.',
        ),
      ],
      [
        ask(
          1,
          'maths',
          'time intervals: from 10:15 to 10:50 is 35 minutes',
          '3.MD.A.1',
          [N('The set ended at 10:15, and the clock now says 10:50. How long ago was that?')],
          [
            o(
              '35 minutes.',
              [
                N('Yes. From 10:15 to 10:45 is 30 minutes, and 5 more minutes gets you to 10:50.'),
                N('30 + 5 = 35 minutes. It feels longer, doesn’t it?'),
              ],
              true,
            ),
            o('25 minutes.', [
              N('Count on from 10:15: to 10:30 is 15, to 10:45 is 30, to 10:50 is 35.'),
              N('That is 35 minutes, not 25.'),
            ]),
            o('45 minutes.', [
              N('Nearly, but 45 minutes after 10:15 would be 11:00.'),
              N('Count on to 10:50: 35 minutes.'),
            ]),
          ],
          'Worked out a time interval, 35 minutes from 10:15 to 10:50.',
        ),
      ],
    ),
    sc(
      'a29-12-roof',
      [
        N(
          'Jinu is on the roof, by the big lit letters of the hall’s sign. Rumi walks straight up to him.',
        ),
        R('You knew. You knew they’d take Mira and Zoey. Did you?'),
        J('I didn’t stop it.'),
        R('Tell me the truth. Your family. All of it.'),
        J(
          'I didn’t go to feed them. I went because I wanted the voice. I wanted to be loved by everyone, more than I wanted to be theirs.',
          'sad',
        ),
        J(
          'I left my mother and my little sister in a house with no rice, and I never once went back.',
        ),
        N(
          'Rumi steps back from him. She looks as if he has hurt her, and as if she is sorry for him, both.',
        ),
      ],
      [
        ask(
          4,
          'literacy',
          'comparing two versions of a story to find a character’s true motive',
          'RL.3.3',
          [
            N(
              'Jinu told two versions of his story. How is this one different from the one on the wall?',
            ),
          ],
          [
            o(
              'Before, he said he left to feed his family. Now he says he left because he wanted the voice.',
              [
                N(
                  'Yes. The first version made him kinder than he was. The second is the truth, and it is harder to say.',
                ),
                N(
                  'Comparing two versions of a story is how readers find what a character really wanted.',
                ),
              ],
              true,
            ),
            o('He told the same story both times.', [
              N('Look again. The reason he left is different.'),
              N('First it was “to feed them”. Now it is “because I wanted the voice”.'),
            ]),
            o('He told two stories about a tiger.', [
              N('Derpy isn’t part of this story, though he is nearby.'),
              N('Jinu’s two stories are about why he left his family.'),
            ]),
          ],
          'Compared two versions of a character’s story to find his true motive.',
        ),
      ],
      [
        ch('stay', 'Stay by the door.', [
          N('You stay by the door. This isn’t yours to stand in the middle of.'),
        ]),
        ch('nubbin', 'Let your Nubbin go to Derpy.', [
          N(
            'Derpy is curled by the sign, ears flat. Your Nubbin goes and sits between his paws, and the tiger lowers his chin over it.',
            'soft',
          ),
        ]),
      ],
    ),
    sc(
      'a29-12-roof-done',
      [
        N(
          'Jinu doesn’t try to say anything else. Below you, from the middle of the city, a red light is welling up through the streets.',
        ),
        N(
          'From up here you can see the Han River, and the tall tower on Namsan, glowing on its hill.',
        ),
      ],
      [
        notice(
          1,
          'social-studies',
          'Namsan is a hill in the middle of Seoul, one of four hills of the old city, with a tower on top',
          'D2.Geo.2.K-2',
          [
            N(
              'Namsan is a hill right in the middle of Seoul, with a tall tower on top. You can see it from almost everywhere in the city.',
            ),
            N(
              'It is one of four hills that once guarded the old capital. The city wall you saw earlier runs over them all.',
            ),
          ],
          'Learned that Namsan is a hill in the middle of Seoul with a tower on top, and one of the four hills of the old city.',
        ),
      ],
    ),
    sc(
      'a29-12-complete',
      [
        N(
          'Through the torn Honmoon, something huge is rising out of the ground: a great shadow, with fire at its heart.',
        ),
        G('Thank you, little hunter. You opened the door yourself.'),
        N(
          'The traffic stops, and the music in the shops. All over the city, people put down what they are holding and turn the same way.',
        ),
        N(
          'They start to walk, quietly, with blank faces, towards the stadium on the river.',
          'sad',
        ),
        N('Rumi watches them go. Then she turns her back on Jinu and goes down the stairs, alone.'),
      ],
      [
        ask(
          4,
          'sel',
          'you can feel sorry for someone and still be angry with them',
          'CASEL: Social awareness',
          [
            N(
              'Rumi looked sorry for Jinu, and she turned her back on him. Can you feel sorry for someone and be angry at them, at the same time?',
            ),
          ],
          [
            o(
              'Yes. Two feelings can be true together.',
              [
                N(
                  'Yes. Feelings are not either-or. Rumi can be sad for Jinu and still need to walk away.',
                ),
                N('Noticing both is part of knowing how you really feel.'),
              ],
              true,
            ),
            o('No. You have to pick one.', [
              N('A lot of people think so, but feelings can sit side by side.'),
              N('Rumi feels sorry and angry, both.'),
            ]),
            o('Only if the other person says sorry.', [
              N('Saying sorry can help. But the feelings can be there either way.'),
              N('Rumi feels both right now.'),
            ]),
          ],
          'Learned that two feelings, such as pity and anger, can be true at the same time.',
        ),
      ],
    ),
  ],
  [gl('responsibility', 'Owning what you did, without blaming anyone else.', 'a29-12-find')],
);

// ================================================================== A29-13 Celine Again
const Q13: EduQuest = quest(
  'a29-13',
  'Celine Again',
  {
    'a29-13-s1': {
      goal: 'Go with Rumi to Celine’s house.',
      hint: 'Through the old lanes again. The streets are empty now.',
    },
    'a29-13-s2': {
      goal: 'Sit down next to Celine, and wait.',
      hint: 'Sit on the edge of the wooden floor beside her. Don’t say anything.',
    },
  },
  [
    sc(
      'a29-13-courtyard',
      [
        N(
          'The city is empty and humming with a red light. Rumi walks through the old lanes with her arm bare, and you walk behind.',
        ),
        N(
          'Celine is in the courtyard, wide awake, as if she has been waiting since the broadcast.',
        ),
        C(
          'Come inside. Quickly. We’ll put this right. We’ll cover them, and you’ll sing, and we’ll mend the Honmoon, the way it was.',
        ),
        R('The way it was is how we got here.'),
        C('Rumi. Inside.'),
        R(
          'You taught me to hide them. You loved me, I know you did. But only the half of me you could look at.',
          'sad',
        ),
        R('You never loved me all the way. Not once.'),
        N(
          'Celine opens her mouth, and nothing comes out. Rumi turns and goes out of the gate, and doesn’t run, and doesn’t look back.',
        ),
      ],
      [
        ask(
          5,
          'literacy',
          'a metaphor: loving only “half” of someone',
          'L.4.5',
          [
            N(
              'Rumi says Celine loved “only the half of me you could look at”. What does she mean?',
            ),
          ],
          [
            o(
              'Celine accepted the part of Rumi that was easy for her to see, and not the rest.',
              [
                N(
                  'Yes. Rumi isn’t saying she is cut in half. It is a metaphor for being loved with a part held back.',
                ),
                N(
                  'Words used as a picture, not exactly, are called figurative language. They make a feeling clear.',
                ),
              ],
              true,
            ),
            o('Celine only saw half of Rumi’s body.', [
              N('Not literally. The “half” stands for part of who Rumi is.'),
              N('She means that Celine accepted only the part she found easy to look at.'),
            ]),
            o('Celine only came to half of the shows.', [
              N('Nothing in the story says that.'),
              N('The half is a picture for the part of Rumi that Celine could accept.'),
            ]),
          ],
          'Read a metaphor for its meaning: being loved for only the part of you that others find easy to see.',
        ),
      ],
    ),
    sc(
      'a29-13-courtyard-done',
      [
        N('The gate swings shut, and Celine stays standing in the middle of the courtyard.'),
        N('You are still on the stone step by the gate, where you sat last time.'),
      ],
      [
        ask(
          1,
          'sel',
          'naming several feelings at once: what Celine might feel',
          'CASEL: Self-awareness',
          [N('Celine is standing alone in her courtyard. What might she be feeling?')],
          [
            o(
              'Several things at once: shock, hurt and worry.',
              [
                N(
                  'Yes. People often feel more than one thing at once, and it can be hard to name them.',
                ),
                N('Naming them one by one makes a big feeling easier to carry.'),
              ],
              true,
            ),
            o('Only anger.', [
              N('She may be angry, but feelings often come in a bundle.'),
              N('Hurt and worry are probably in there, too.'),
            ]),
            o('Nothing at all.', [
              N('She looks still, but being still isn’t the same as feeling nothing.'),
              N('She is probably feeling several big things at once.'),
            ]),
          ],
          'Practised naming several feelings that a person might have at the same moment.',
        ),
      ],
    ),
    sc(
      'a29-13-sit',
      [
        N(
          'Celine sits down on the edge of the wooden floor that runs along the house, very straight, with her hands on her knees.',
        ),
        N('She doesn’t look at you. She doesn’t tell you to go.'),
        N('You go and sit down next to her: not close, but close enough.'),
        N(
          'Your Nubbin climbs out of the bag, takes off its noodle hat, and puts it down neatly on the boards between you.',
        ),
        N(
          'The red light glows over the roofs, and a long way off a crowd is walking very quietly. Neither of you says anything.',
        ),
        N(
          'It goes on for a long time. Long enough for the courtyard stones to cool, and for a cat to cross the wall and change its mind.',
        ),
      ],
      [
        notice(
          0,
          'social-studies',
          'the maru: the wooden-floored hall or porch of a hanok',
          'D2.His.2.K-2',
          [
            N(
              'The wooden floor Celine sits on is called a maru. It is the open, wooden-floored hall or porch of a hanok.',
            ),
            N(
              'It stays cool in summer, while the rooms beside it, warmed by ondol, stay snug in winter. The family sits there to talk, eat, or watch the weather.',
            ),
          ],
          'Learned that the maru is the wooden-floored hall of a hanok, cool in summer, where families sit together.',
        ),
      ],
      [
        ch('wait', 'Wait.', [
          N(
            'You wait, that’s all. It is harder than fighting demons, and you don’t think anyone will ever thank you for it.',
          ),
        ]),
        ch('wait2', 'Wait a bit longer.', [
          N('You wait a bit longer. Celine’s hands, on her knees, slowly stop being fists.'),
        ]),
      ],
    ),
    sc(
      'a29-13-sit-done',
      [
        N('At last Celine gets up, without a word, and goes inside. You hear a kettle.'),
        N('Soon it begins to whistle, and a thin cloud of steam drifts out under the door.'),
      ],
      [
        ask(
          1,
          'science',
          'heating and cooling: water boils at 100 °C (212 °F), and steam turns back to water when it cools',
          '2-PS1-4',
          [
            N(
              'Water boils at 100 °C (212 °F), and the kettle’s steam drifts out into the cool air. What happens to steam when it cools?',
            ),
          ],
          [
            o(
              'It turns back into tiny drops of water.',
              [
                N(
                  'Yes. Heat changes water into steam, and cooling changes steam back to water. That change can be reversed.',
                ),
                N('A cold spoon held in steam gets wet for the same reason.'),
              ],
              true,
            ),
            o('It turns into ice at once.', [
              N('Ice needs much colder air than a courtyard in summer.'),
              N('Steam turns back into water drops as it cools.'),
            ]),
            o('It vanishes forever.', [
              N(
                'It doesn’t vanish. It becomes tiny drops of water in the air, which you can see as mist.',
              ),
              N('Steam cools and turns back into water.'),
            ]),
          ],
          'Learned that heating turns water into steam and cooling turns steam back into water.',
        ),
      ],
    ),
    sc(
      'a29-13-complete',
      [
        N(
          'She comes back with a tray. Two cups of barley tea, and a small saucer of water for your Nubbin.',
        ),
        N(
          'She pours, and doesn’t thank you, and doesn’t say anything about Rumi. She pours you a second cup when the first one’s gone.',
        ),
        C(
          'She was such a small girl. With her sleeves always down. I thought I was keeping her safe.',
          'sad',
        ),
        N('That is all she says. You drink the tea, and it’s good tea.'),
        N(
          'When you go, she puts your Nubbin’s noodle hat carefully back in your hand. Then she sits on the step again, looking at the gate.',
          'soft',
        ),
      ],
      [
        ask(
          3,
          'sel',
          'what sitting beside someone can say that words cannot',
          'CASEL: Relationship skills',
          [
            N(
              'You didn’t say a word to Celine, and she poured you a second cup of tea. What can sitting beside someone say that words can’t?',
            ),
          ],
          [
            o('That you are not leaving them alone.', [
              N('That is a fair answer. Staying says “I am here” more loudly than a speech.'),
              N('Celine didn’t say thank you, but the tea was her way.'),
            ]),
            o('That you aren’t going to judge them.', [
              N('That is a fair answer. Sitting quietly can show that you are not there to argue.'),
              N('It gives the other person room to feel what they feel.'),
            ]),
            o('Maybe nothing, and that is all right.', [
              N('That is an honest answer. Sometimes we can’t tell what company says.'),
              N('But Celine noticed. She came back with tea.'),
            ]),
          ],
          'Thought about what quiet company can say to someone who is hurting, with no single right answer.',
        ),
      ],
    ),
  ],
  [
    gl(
      'maru',
      'The cool, wooden-floored hall or porch of a traditional Korean house.',
      'a29-13-sit',
    ),
  ],
);

// ================================================================== A29-14 The Stadium
const SONG_END: Line[] = [
  N(
    'Mira, halfway down the aisle, blinks, and so does Zoey, two rows behind. They look at each other.',
  ),
  N(
    'Then they are running for the stage, and you are running after them with the gear case banging your knees.',
  ),
];

const Q14: EduQuest = quest(
  'a29-14',
  'The Stadium',
  {
    'a29-14-s1': {
      goal: 'Get into the stadium with the gear case.',
      hint: 'Walk with the crowd. Keep your head down and the case close.',
    },
    'a29-14-s2': {
      goal: 'Watch Rumi.',
      hint: 'Stand at the side of the stage with the case open.',
    },
  },
  [
    sc(
      'a29-14-crowd',
      [
        N(
          'The stadium on the river is full. Tens of thousands of people, standing still, faces lifted, eyes blank.',
        ),
        N(
          'A faint shimmer of cheer rises off all of them, like steam off a lake in the morning, and drifts towards the stage.',
        ),
        N(
          'On the stage the Saja Boys are singing, and behind them the great shadow with fire at its heart is drinking it all in.',
        ),
        N(
          'You push through the crowd with the gear case, and nobody stops you or sees you. Bobby is in the third row, smiling at nothing.',
          'sad',
        ),
        N(
          'Two rows behind him is Zoey, and in the aisle is Mira. Both of them blank, both of them shimmering.',
        ),
        N('You keep walking. Your Nubbin holds onto your collar with both paws.'),
      ],
      [
        ask(
          4,
          'maths',
          'ordinal numbers and adding on: two rows behind row 3',
          '1.OA.A.1',
          [N('Bobby is in row 3, and Zoey is two rows behind him. Which row is Zoey in?')],
          [
            o(
              'Row 5.',
              [
                N('Yes. Two rows behind row 3 means counting on two: row 4, then row 5.'),
                N('Behind means further from the stage, so the numbers go up.'),
              ],
              true,
            ),
            o('Row 1.', [
              N('Row 1 is in front of row 3. Behind means further back.'),
              N('Count on two from 3: row 4, row 5.'),
            ]),
            o('Row 2.', [
              N('Row 2 is in front of Bobby, not behind him.'),
              N('Count on from row 3: row 4, row 5.'),
            ]),
          ],
          'Counted on two rows from row 3 to find row 5, using the word “behind”.',
        ),
      ],
      [
        ch('bobby', 'Stop by Bobby.', [
          N(
            'You touch Bobby’s arm, and he doesn’t notice. You straighten his tie, because he would want it straight, and go on.',
            'sad',
          ),
        ]),
        ch('on', 'Keep going.', [
          N('You keep going. The quickest way to help is to get the case where it’s needed.'),
        ]),
      ],
    ),
    sc(
      'a29-14-crowd-done',
      [
        N('Then, at the back of the stadium, the big doors open, and someone walks in alone.'),
        N('The sound of her footsteps rings round the huge space, and comes back a moment late.'),
      ],
      [
        ask(
          1,
          'science',
          'sound bounces off big, hard surfaces and comes back as an echo',
          '4-PS3-2',
          [N('Her footsteps ring back a moment late, in the huge stadium. What makes that echo?')],
          [
            o(
              'The sound bounces off the far walls and comes back.',
              [
                N('Yes. Sound travels in waves, and big hard surfaces bounce them back.'),
                N('The farther the wall, the later the echo returns.'),
              ],
              true,
            ),
            o('The footsteps are made twice.', [
              N('There is only one step. The second sound is the first one coming back.'),
              N('It has bounced off the far walls.'),
            ]),
            o('Someone else is following her.', [
              N('Not here. It is an echo, a sound that bounces back.'),
              N('Big, hard walls send sound back to you.'),
            ]),
          ],
          'Learned that an echo is sound bouncing off a far wall and coming back late.',
        ),
      ],
    ),
    sc(
      'a29-14-song',
      [
        N(
          'It’s Rumi, with no sleeves at all. Her arms are bare, and her neck, and the marks run all over both, violet and silver.',
        ),
        N(
          'She walks down the middle aisle through the blank crowd, and up onto the stage, past the Saja Boys, to the front.',
        ),
        N(
          'She doesn’t sing the old songs, or the harsh one. She opens her mouth and sings something you have never heard.',
        ),
        N(
          'It has no words you can catch, and it is her own. It is like hearing someone tell the truth about herself, and be fine.',
        ),
        N(
          'Under the music the marks glow brighter, not dimmer, and she doesn’t hide them. She holds her arms out so everyone can see.',
        ),
        N(
          'The shimmer stops drifting towards the stage. Here and there in the crowd, someone blinks.',
          'soft',
        ),
      ],
      [
        ask(
          4,
          'sel',
          'the difference between hiding something and choosing to share it',
          'CASEL: Self-awareness',
          [
            N(
              'Rumi stops hiding her marks and sings. What is the difference between hiding something and choosing to share it?',
            ),
          ],
          [
            o('Sharing is a choice you make for yourself.', [
              N('That is a fair answer. Rumi chose this. Nobody tore her sleeve this time.'),
              N('Choosing makes it hers again.'),
            ]),
            o('Hiding takes a lot of energy, and sharing frees it.', [
              N('That is a fair answer. Rumi has hidden for years, and it has been tiring.'),
              N('Notice how much easier her voice is.'),
            ]),
            o('You can do both at different times.', [
              N(
                'That is a thoughtful answer. Some things we share with some people and not with others.',
              ),
              N('The key part is that you are the one who decides.'),
            ]),
          ],
          'Thought about the difference between hiding something and choosing to share it, with no single right answer.',
        ),
      ],
    ),
    sc(
      'a29-14-song-done',
      [
        N(
          'You are standing at the side of the stage holding Rumi’s long coat. She took it off on her way in, and put it in your hands, and kept walking.',
        ),
        N('You hold it, and don’t put it on her, and don’t put it away.', 'soft'),
        ...SONG_END,
      ],
      [
        ask(
          1,
          'literacy',
          'an action can show trust: handing over a coat',
          'RL.2.3',
          [N('Rumi hands you her coat without a word and walks on. What does that action show?')],
          [
            o(
              'She trusts you with something that mattered to her.',
              [
                N(
                  'Yes. A coat she had hidden behind is now in your hands. Trust can be shown without a word.',
                ),
                N('Actions can say more than speeches, and good writers use them.'),
              ],
              true,
            ),
            o('She wanted to get rid of it because it was old.', [
              N('Not here. Look at what the coat has covered.'),
              N('Handing it to you shows trust.'),
            ]),
            o('She forgot she was wearing it.', [
              N('She took it off on purpose, “on her way in”.'),
              N('She trusted you with it.'),
            ]),
          ],
          'Read an action, handing over a coat, as a sign of trust.',
        ),
      ],
    ),
    sc(
      'a29-14-complete',
      [
        N(
          'Mira and Zoey come up the stage steps two at a time. You throw Mira her blade and Zoey her belt of knives.',
        ),
        M('Rumi. We were wrong. We’ll say sorry properly later. Right now, move up.'),
        Z('Room for two more?', 'happy'),
        N(
          'Rumi looks at them, and makes room, and the three of them stand together at the front of the stage.',
        ),
        N(
          'All over the stadium people are waking up, confused, holding their phones. Bobby, in the third row, says “what” very loudly.',
        ),
      ],
      [
        ask(
          3,
          'science',
          'when different notes sound together they make harmony, because sound waves add up',
          '4-PS3-2',
          [
            N(
              'Three people can sing three different notes at once and it sounds lovely. What is that called?',
            ),
          ],
          [
            o(
              'Harmony.',
              [
                N(
                  'Yes. Each note is a sound wave. When different notes sound together, the waves add up into a fuller sound.',
                ),
                N('It is why a choir sounds bigger than one voice.'),
              ],
              true,
            ),
            o('Echo.', [
              N('An echo is one sound coming back. Harmony is different notes together.'),
              N('Three voices, three notes, one sound: harmony.'),
            ]),
            o('Silence.', [
              N('Silence is the opposite: no sound at all.'),
              N('When different notes sound together, we call it harmony.'),
            ]),
          ],
          'Learned that notes sung together make harmony, because their sound waves add up.',
        ),
      ],
    ),
  ],
  [
    gl(
      'harmony',
      'Different musical notes sounding together in a way that blends.',
      'a29-14-complete',
    ),
  ],
);

// ================================================================== A29-15 Jinu
const Q15: EduQuest = quest(
  'a29-15',
  'Jinu',
  {
    'a29-15-s1': {
      goal: 'Hold on at the side of the stage.',
      hint: 'Keep hold of the stage rail. Keep your Nubbin close.',
    },
    'a29-15-s2': {
      goal: 'See it through.',
      hint: 'Stay by the rail until the light settles.',
    },
  },
  [
    sc(
      'a29-15-strike',
      [
        N(
          'The great shadow behind the stage turns. The fire at its heart is the size of a house, and it is looking at Rumi.',
        ),
        G('Half of mine. Half of theirs. You should have been all of mine.'),
        N(
          'It reaches for her: a long arm of shadow and heat, slow, enormous, coming down over the stage like a falling wall.',
        ),
        N(
          'Rumi doesn’t run, and Mira and Zoey don’t run. They stand together and keep singing, with their weapons up.',
        ),
        N(
          'And Jinu steps out from the other boys, and walks across the stage, and stands in front of Rumi with his arms out.',
          'shock',
        ),
        N('The shadow hits him instead of her.'),
      ],
      [
        ask(
          5,
          'sel',
          'people can choose differently from how they have always chosen',
          'CASEL: Responsible decision-making',
          [
            N(
              'For four hundred years Jinu left people behind. Now he steps in front of Rumi. Why do you think he chose differently this time?',
            ),
          ],
          [
            o('Rumi’s kindness to him changed him.', [
              N('That is a fair answer. Being treated well can make us braver.'),
              N('Rumi offered him a way out, and nobody had done that in four hundred years.'),
            ]),
            o('He decided it was time to stop running.', [
              N('That is a fair answer. Sometimes the choice just becomes clear.'),
              N('He had been running from his own story for a very long time.'),
            ]),
            o('He knew it was the only way, and he was scared.', [
              N('That is an honest answer. Brave things are often done by scared people.'),
              N('He stepped forward anyway.'),
            ]),
          ],
          'Thought about why a person might choose differently after years of choosing the same way.',
        ),
      ],
      [
        ch('hold', 'Hold your Nubbin tight.', [
          N(
            'You hold your Nubbin tight. It holds you tight back, its face pressed into your coat.',
          ),
        ]),
        ch('look', 'Don’t look away.', [
          N(
            'You don’t look away. Someone should see this, all of it. You think he would want somebody to.',
          ),
        ]),
      ],
    ),
    sc(
      'a29-15-light',
      [
        N(
          'Jinu is standing in the shadow’s grip, and he is full of light. It comes out of him the way the shimmer came out of the crowd.',
        ),
        J('I left them. I’ve been leaving them for four hundred years. Not this time.'),
        N(
          'He turns to Rumi. In his hands the light gathers into one bright, whole thing, like a lantern with nothing round it.',
        ),
        J('Here. It was mine before the demon king took it. It’s whole again. Take it.', 'soft'),
        N(
          'He puts it into her hands. Then he is gone: not falling, not hurt, only light, all at once, like a window opening.',
        ),
        N(
          'Rumi stands holding the light. She lifts her head and sings, and Mira and Zoey sing with her, and you have never heard three voices fit so well.',
        ),
        N(
          'The great shadow comes apart like smoke in a wind, and is gone, and the stage is only a stage.',
        ),
        N(
          'Above the stadium the torn Honmoon closes over. It isn’t one colour. It is every colour there is, like a ribbon held up to the sun.',
          'soft',
        ),
      ],
      [
        ask(
          7,
          'science',
          'sunlight is all the colours mixed together; a rainbow shows them apart',
          '4-PS3-2',
          [N('The new Honmoon has every colour, like a rainbow. What is sunlight made of?')],
          [
            o(
              'All the colours mixed together.',
              [
                N('Yes. Sunlight looks white, but it is all the colours of the rainbow mixed up.'),
                N(
                  'Raindrops can split it apart, and then we see red, orange, yellow, green, blue and violet.',
                ),
              ],
              true,
            ),
            o('Only yellow.', [
              N('The Sun looks yellow from far away, but there is more in it.'),
              N('Sunlight is all the colours mixed.'),
            ]),
            o('Only white, with nothing inside.', [
              N('White looks plain, but it has every colour in it.'),
              N('A rainbow is what you get when raindrops split it apart.'),
            ]),
          ],
          'Learned that sunlight is all colours mixed together, and that a rainbow shows them separately.',
        ),
      ],
    ),
    sc(
      'a29-15-light-done',
      [
        N(
          'The crowd is awake, all of it. Somebody starts clapping, not knowing why, and then everybody does.',
        ),
      ],
      [
        ask(
          0,
          'literacy',
          'how characters respond to an event they do not fully understand',
          'RL.2.3',
          [
            N(
              'Somebody starts clapping “not knowing why”, and then everybody does. How do the people feel?',
            ),
          ],
          [
            o(
              'Relieved and happy, even though they don’t know what happened.',
              [
                N('Yes. They have woken up into something good, and clapping is how they say so.'),
                N('Feelings can spread through a crowd, for good as well as for bad.'),
              ],
              true,
            ),
            o('Angry.', [N('Clapping doesn’t sound angry.'), N('They are relieved and happy.')]),
            o('Bored.', [N('A bored crowd doesn’t clap.'), N('They are relieved and happy.')]),
          ],
          'Read a crowd’s response to work out how people feel when they do not know why.',
        ),
      ],
    ),
    sc(
      'a29-15-complete',
      [
        N(
          'At the edge of the stage, where Jinu stood, there is a little drift of light, like glitter after a party.',
        ),
        N(
          'Jinu is gone, and he will not come back. That is plain, and it is all right to feel sad about it.',
        ),
        N(
          'Derpy comes up the stage steps on his big soft paws and lies down on the light, and puts his chin on his paws, and doesn’t purr.',
          'sad',
        ),
        N(
          'Sussie lands on his head. Your Nubbin goes and sits between the tiger’s paws and leans on him.',
        ),
        Z('It’s not one single colour.'),
        R('No. It’s better.', 'soft'),
        N(
          'A thread of that many-coloured light drifts down from the sky, and catches round your wrist, and stays.',
        ),
      ],
      [
        ask(
          3,
          'sel',
          'sadness is allowed; what helps when someone is sad',
          'CASEL: Social awareness',
          [N('Derpy is sad and doesn’t purr. What helps when someone is sad?')],
          [
            o(
              'Sitting close, and letting them feel it.',
              [
                N(
                  'Yes. Your Nubbin leans on Derpy, and that is exactly it. You don’t have to fix a sad feeling.',
                ),
                N('Staying close tells someone they are not alone.'),
              ],
              true,
            ),
            o('Telling them to cheer up.', [
              N('That is a kind wish, but it can make a sad person feel they are doing it wrong.'),
              N('Sitting close and letting them feel it helps more.'),
            ]),
            o('Leaving them alone at once.', [
              N(
                'Some people do want a little time alone. But most want to know someone is nearby.',
              ),
              N('Staying close, quietly, works for most.'),
            ]),
          ],
          'Learned that sadness is allowed, and that sitting close and letting someone feel it helps.',
        ),
      ],
    ),
  ],
);

// ================================================================== A29-16 In Public
const C16_OPEN: Line[] = [
  N(
    'The fans thin out at last. Bobby counts phones, counts girls, and counts you, and seems happy with all the numbers.',
  ),
  B(
    'Runner. Good work. Strange work, but good. If you ever want a job that’s only a job, call me.',
    'happy',
  ),
];
const C16_HOME: Line[] = [
  N(
    'Sussie drops a folded leaf into your hand from the wall, and then hops onto your shoulder and stays there.',
  ),
  N(
    'Zoey hands you a flat parcel tied with string. Inside is a small folding screen, from Celine: a silly tiger and a bright magpie.',
    'soft',
  ),
  N(
    'The street goes flat, and bright, and smells of paint. You are in the Grove, with a magpie on your shoulder and a thread of light round your wrist.',
  ),
];

const Q16: EduQuest = quest(
  'a29-16',
  'In Public',
  {
    'a29-16-s1': {
      goal: 'Help Bobby with the street meet-up.',
      hint: 'Hand out the water and keep the queue moving.',
    },
    'a29-16-s2': {
      goal: 'Take a rest on the wall with Derpy.',
      hint: 'Sit on the wall in the sun when the queue thins.',
    },
  },
  [
    sc(
      'a29-16-street',
      [
        N(
          'Days later, in daylight, Huntrix meet their fans in the street: no stage, no tickets, a folding table and a queue round the block.',
        ),
        B(
          'Water for the queue! There are 60 people, and the water comes in packs of 12. Keep it moving. Smile. Not like that. Like a person.',
        ),
        N(
          'Rumi is in short sleeves. The marks are on both arms, violet and silver, in the plain sun.',
        ),
        F('Can I… is it all right if I look at your arm? It’s so pretty. Is that rude?'),
        R('It’s not rude. Look as long as you like.', 'happy'),
        N(
          'Mira signs a cast, and Zoey signs a forehead, with permission. A grandmother gives Rumi a bag of oranges and pats her bare arm.',
        ),
      ],
      [
        ask(
          1,
          'maths',
          'division: 60 bottles in packs of 12',
          '3.OA.A.3',
          [
            N(
              'Bobby says there are 60 people and the water comes in packs of 12. How many packs do you need for one bottle each?',
            ),
          ],
          [
            o(
              '5 packs.',
              [
                N('Yes. 60 ÷ 12 = 5, because 12, 24, 36, 48, 60 is five packs.'),
                N('Five packs, and one very busy runner.'),
              ],
              true,
            ),
            o('6 packs.', [
              N('Count the packs: 12, 24, 36, 48, 60. That is five.'),
              N('Six would be 72, which is too many.'),
            ]),
            o('12 packs.', [
              N('12 is how many are in a pack, not how many packs.'),
              N('60 ÷ 12 = 5 packs.'),
            ]),
          ],
          'Divided 60 by 12 to find that 5 packs of water are needed.',
        ),
      ],
      [
        ch('water', 'Hand out the water.', [
          N(
            'You hand out water down the whole queue. Your Nubbin hands out light sticks, one at a time, with great ceremony.',
          ),
        ]),
        ch('wall', 'Look at the wall behind the table.', [
          N(
            'On the low wall behind the table, in the sun, a blue tiger and a magpie sit very still, as if they were painted there.',
          ),
        ]),
      ],
    ),
    sc(
      'a29-16-street-done',
      [
        N(
          'Derpy and Sussie are on the wall behind the table. Nobody but you seems to think a blue tiger is odd.',
        ),
        N(
          'With the tiger grinning and the magpie perched, they look just like a picture from an old folk painting.',
        ),
      ],
      [
        notice(
          1,
          'social-studies',
          'Korean folk paintings show everyday wishes: luck, a long life, a happy home',
          'D2.His.2.K-2',
          [
            N(
              'Minhwa, Korean folk painting, was made by ordinary people for ordinary homes. It often shows wishes everyone shares: good luck, a long life, a happy family.',
            ),
            N(
              'That is why the pictures are so cheerful, and why a goofy tiger and a magpie with good news fit so well.',
            ),
          ],
          'Learned that Korean folk painting shows everyday wishes, which is why its pictures are so cheerful.',
        ),
      ],
    ),
    sc(
      'a29-16-wall',
      [
        N(
          'When the queue thins, you sit on the wall beside Derpy, with your back to the warm stone.',
        ),
        N(
          'The tiger rolls half over and holds out his big paws, the way you hold out your arms for a child.',
        ),
        N(
          'Your Nubbin climbs into them, turns round three times, and goes to sleep in the tiger’s paws, noodle hat over its eyes.',
        ),
        N(
          'Derpy purrs like a kettle. Sussie stands on his shoulder and keeps watch over both of them.',
        ),
        N(
          'Down the street, over the rooftops, faint in the daylight, the Honmoon shimmers every colour. It looks like it might hold a long time.',
        ),
        N('Rumi looks over from the table, and sees the three of them, and laughs.', 'happy'),
      ],
      [
        ask(
          0,
          'science',
          'sunlight warms the ground and stone',
          'K-PS3-1',
          [N('The wall has been in the sun all day, and it is warm against your back. Why?')],
          [
            o(
              'Sunlight warms the stone.',
              [
                N('Yes. Sunlight carries energy, and when it lands on stone, the stone warms up.'),
                N('Stone holds the warmth for a long time, so it stays cosy even in the shade.'),
              ],
              true,
            ),
            o('The stone makes its own heat.', [
              N('Stone has no heat of its own. It warms up when the Sun shines on it.'),
              N('That is why it is warm in the afternoon.'),
            ]),
            o('The wall is full of hot water.', [
              N('No water inside. Just old stone.'),
              N('The Sun warmed it.'),
            ]),
          ],
          'Learned that sunlight warms stone and the ground.',
        ),
      ],
      [
        ch('let', 'Let them sleep.', [
          N(
            'You let them sleep. Nobody needs you to do anything for a while, which is the best feeling in the world.',
            'soft',
          ),
        ]),
        ch('photo', 'Take a photo.', [
          N(
            'You take a photo: a tiger, a magpie, a Nubbin, a noodle hat. It is the best photo anyone has ever taken.',
            'happy',
          ),
        ]),
      ],
    ),
    sc(
      'a29-16-complete',
      [
        ...C16_OPEN,
        N(
          'Rumi comes over to the wall. She stops in front of you in the sun, and pushes her short sleeve up to the shoulder.',
        ),
        N(
          'She holds her arm out, the marks bright in the daylight, and turns it this way and that, as if she is seeing it for the first time.',
          'soft',
        ),
        R('You gave me a jacket once. I don’t need it now. But thanks for knowing when I did.'),
        ...C16_HOME,
      ],
      [
        ask(
          4,
          'sel',
          'everyone has something they think they should hide; what helps people stop hiding',
          'CASEL: Self-awareness',
          [
            N(
              'Almost everyone has something they think they should hide. The marks were never something to fix. What helps a person stop hiding?',
            ),
          ],
          [
            o('Someone who accepts all of them.', [
              N('That is a fair answer. Being seen and still liked is a very strong medicine.'),
              N('Rumi found that in Mira and Zoey, and in you.'),
            ]),
            o('Being brave a little at a time.', [
              N('That is a fair answer. Rumi took years, then one night, then one sunny street.'),
              N('Small steps count.'),
            ]),
            o('Meeting others who share it.', [
              N(
                'That is a fair answer. When you meet someone else like you, you stop feeling like the only one.',
              ),
              N('Rumi found that with her fans, who asked to look at her arm.'),
            ]),
          ],
          'Thought about what helps people stop hiding the things they fear others will judge, with no single right answer.',
        ),
      ],
    ),
  ],
  [gl('queue', 'A line of people waiting their turn.', 'a29-16-street')],
);

// ================================================================== exports
export const EDU_A29_READER: EduQuest[] = [
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
];

// ================================================================== Variant scenes
/**
 * One EduScene per ATLAS_A29_VARIANTS entry. Each that replaces a scene has the same lesson
 * domain as it; each that plays in addition differs from the scenes on either side of it. The
 * `a29-sable` flag the Sable variants set in the main game is set by the original scene (an
 * EduScene has no scene-level `set`).
 */
export const EDU_A29_READER_VARIANTS: EduScene[] = [
  // Hazel’s margin note (s24Done): plays after a29-01-complete (domain differs from SE and MA)
  sc(
    'a29-01-margin-hazel',
    [
      N(
        'When you next look at Nova’s atlas, there is a pencil note under the ink scroll, low in the margin. You know the hand.',
      ),
      N('“Never been. Nova says it’s all singing.”'),
      N('“I’d hum.”', 'soft'),
    ],
    [
      ask(
        2,
        'literacy',
        'a short note can show a person’s character: Hazel’s joke',
        'RL.3.3',
        [N('Hazel’s note is only nine words long. What does it show about her?')],
        [
          o(
            'She would love to go, and she makes a joke so it doesn’t feel too big.',
            [
              N(
                'Yes. “I’d hum” is funny, and it is also a wish to join in, said in a small, brave way.',
              ),
              N('Short words can carry a lot, if you read for the character behind them.'),
            ],
            true,
          ),
          o('She dislikes singing.', [
            N('Then she would not say she would hum.'),
            N('The joke shows she wants to join in.'),
          ]),
          o('She has been there many times.', [
            N('The note says “Never been”.'),
            N('It shows she would love to go.'),
          ]),
        ],
        'Read a short note for what it shows about Hazel’s character: a wish to join in, said as a joke.',
      ),
    ],
  ),
  // Sable comes (plays after a29-01-scroll; differs from SS and SC)
  sc(
    'a29-01-sable-hid',
    [
      N(
        'Something brushes your ankle in the ink: Sable has come with you. She is a grey smudge in the grey mist, keeping very low.',
      ),
      N(
        'She doesn’t come to your hand. She finds the deepest shadow on the scroll and goes into it, and watches you from there.',
      ),
    ],
    [
      ask(
        1,
        'sel',
        'a frightened friend needs space and time; staying near without crowding',
        'CASEL: Social awareness',
        [N('Sable is frightened, so she hides in the shadow. What helps a frightened friend?')],
        [
          o(
            'Staying nearby, going slowly, and not crowding her.',
            [
              N(
                'Yes. Giving space, staying close and being patient is how you earn a scared friend’s trust.',
              ),
              N('Sable chose the shadow. Leaving her there is a kind of respect.'),
            ],
            true,
          ),
          o('Pulling her out into the light.', [
            N('That would probably frighten her more.'),
            N('Staying nearby and going slowly works better.'),
          ]),
          o('Ignoring her completely.', [
            N('She would think you had forgotten her.'),
            N('Staying near and going slowly is best.'),
          ]),
        ],
        'Learned that a frightened friend needs space, patience and a calm presence nearby.',
      ),
    ],
  ),
  sc(
    'a29-01-sable-heel',
    [
      N(
        'Sable has come with you. She walks at your heel through the ink, grey on grey, and her ears are up.',
      ),
      N(
        'She looks at the demons on the far mountains for a long moment. Then she looks at you, and stays where she is.',
      ),
    ],
    [
      ask(
        1,
        'sel',
        'trust grows when someone stays near and does not push',
        'CASEL: Relationship skills',
        [
          N(
            'Sable looked at the demons, looked at you, and stayed. What does that show about how she feels about you?',
          ),
        ],
        [
          o(
            'She trusts you enough to stay close, even when something scary is near.',
            [
              N('Yes. Trust shows when someone stays close in a scary moment.'),
              N('You earned that by being patient with her.'),
            ],
            true,
          ),
          o('She doesn’t care about anything.', [
            N('She looked at the demons and then at you, which says she cares.'),
            N('She trusts you enough to stay.'),
          ]),
          o('She is waiting for the demons to leave.', [
            N('She may be, but she looked at you and chose to stay.'),
            N('That shows trust.'),
          ]),
        ],
        'Saw how staying close in a scary moment can show trust.',
      ),
    ],
  ),
  // a29-sable = hid
  sc(
    'a29-02-stage-hid',
    [
      N(
        'In a gap under the stage, between two cases of cables, a pair of eyes catches the light. Sable has found the darkest place in the arena.',
      ),
      N('Every time the bass drops she flattens a little. She doesn’t leave.'),
    ],
    [
      ask(
        1,
        'sel',
        'loud places can be too much; it is all right to find somewhere quiet',
        'CASEL: Self-management',
        [
          N(
            'Sable flattens under the stage when the bass drops. Is it all right to find somewhere quieter when a place is too loud?',
          ),
        ],
        [
          o(
            'Yes. Everyone has a different amount of noise they can take.',
            [
              N('Yes. Looking after yourself, by finding somewhere calm, is a skill.'),
              N('Sable is still at the show. She has just found a way to stay.'),
            ],
            true,
          ),
          o('No. You should always stay in the middle.', [
            N('Staying in the middle is hard when it is too much.'),
            N('Finding a calmer corner is fine, and it can let you stay longer.'),
          ]),
          o('Only if somebody lets you.', [
            N('You can look after yourself without waiting for permission.'),
            N('Sable chose her own spot.'),
          ]),
        ],
        'Learned that loud places can be too much, and that finding a quiet spot is a way of looking after yourself.',
      ),
    ],
  ),
  sc(
    'a29-03-pans-hid',
    [
      N(
        'When you get back, the kitchen has an extra guest. Sable is behind the stack of noodle pans by the cooker, only her ears showing.',
      ),
      N(
        'Rumi sees her, and doesn’t say anything, and puts a few plain noodles on a saucer by the pans, and leaves them there.',
        'soft',
      ),
    ],
    [
      ask(
        1,
        'science',
        'animals need food that suits them: plain, not spicy',
        'K-LS1-1',
        [N('Rumi puts plain noodles on a saucer for Sable, not spicy ones. Why?')],
        [
          o(
            'Animals need food that suits them, and spicy food can upset a pet’s tummy.',
            [
              N(
                'Yes. Animals need the right food to stay well, and what suits people doesn’t always suit pets.',
              ),
              N('Rumi chose plain and left it quietly, a kind and careful thing.'),
            ],
            true,
          ),
          o('Spicy food is too expensive.', [
            N('Cost isn’t the reason here.'),
            N('Spicy food can upset a pet’s tummy, so plain is safer.'),
          ]),
          o('Sable likes plain things better, always.', [
            N('We can’t know that, and animals vary.'),
            N('Plain is safer for her tummy.'),
          ]),
        ],
        'Learned that animals need food that suits them, and that plain food is safer for pets than spicy food.',
      ),
    ],
  ),
  sc(
    'a29-11-store-hid',
    [
      N(
        'Under the folded tables, at the back of the store room, something grey moves. Sable has been in here all along, hiding from the noise.',
      ),
      N(
        'She watches the tape come off Mira’s wrists. When you go, she comes after you, one shadow at a time.',
      ),
    ],
    [
      ask(
        1,
        'science',
        'many night animals have a reflective layer in the eye, so eyes shine in the dark',
        '4-LS1-2',
        [
          N(
            'In dark places, Sable’s eyes seem to glint. Why do many animals’ eyes shine in the dark?',
          ),
        ],
        [
          o(
            'A shiny layer at the back of the eye bounces light back.',
            [
              N(
                'Yes. Many night animals have a mirror-like layer in the eye, which helps them see in dim light.',
              ),
              N('That layer sends some light back out, so their eyes seem to glow.'),
            ],
            true,
          ),
          o('Their eyes make their own light.', [
            N('Eyes don’t make light. They reflect it.'),
            N('The shiny layer inside bounces light back.'),
          ]),
          o('They are wet and cold.', [
            N('Wetness isn’t why. It is the shiny layer inside the eye.'),
            N('It bounces light back.'),
          ]),
        ],
        'Learned that many animals have a mirror-like layer in the eye that helps them see in the dark.',
      ),
    ],
  ),
  sc(
    'a29-16-street-hid',
    [
      N(
        'Sable has found the shade at the foot of the wall, under Sussie. The magpie looks down at her, and hops down, and sits beside her.',
      ),
      N(
        'The two of them watch the queue together from the shade, one grey, one black and white, very still.',
        'soft',
      ),
    ],
    [
      ask(
        1,
        'sel',
        'there are many ways of joining in: a quiet way is fine',
        'CASEL: Social awareness',
        [
          N(
            'Sable and Sussie watch from the shade, not from the middle. Can that be a way of joining in?',
          ),
        ],
        [
          o(
            'Yes. People join in at their own pace.',
            [
              N(
                'Yes. Being there, quietly, still counts. Everyone has their own way and their own speed.',
              ),
              N('Sussie sat beside her, which is a lovely way to say “welcome”.'),
            ],
            true,
          ),
          o('No. If you are not in the middle, you are not joining in.', [
            N('The middle is only one place to be.'),
            N('Watching from the shade is a way of being there too.'),
          ]),
          o('Only if you speak to everyone.', [
            N('Not at all. Some people join in without a word.'),
            N('Sable and Sussie are a good example.'),
          ]),
        ],
        'Learned that joining in can be quiet, and that people do it at their own pace.',
      ),
    ],
  ),
  // a29-sable = heel
  sc(
    'a29-14-crowd-heel',
    [
      N(
        'Sable is at your heel the whole way through the crowd. All those blank faces, all that noise, and she doesn’t go under anything.',
      ),
      N('Her ears are up. She walks right beside you, close enough to touch, and keeps walking.'),
    ],
    [
      ask(
        1,
        'sel',
        'being brave is easier with a friend beside you',
        'CASEL: Relationship skills',
        [N('Sable walks through the scary crowd without hiding. What helps her be brave?')],
        [
          o(
            'Having someone she trusts right beside her.',
            [
              N('Yes. Many brave things feel smaller when a friend is next to you.'),
              N('Trust is a kind of courage you can share.'),
            ],
            true,
          ),
          o('Not being scared at all.', [
            N('She may well be scared. Her ears are up, which means she is alert.'),
            N('Being brave is walking on, with someone beside you.'),
          ]),
          o('The crowd being quiet.', [
            N('The crowd is blank, which is eerie in its own way.'),
            N('It is her friend beside her that helps.'),
          ]),
        ],
        'Saw that being brave can be easier with a trusted friend close by.',
      ),
    ],
  ),
  sc(
    'a29-16-street-heel',
    [
      N(
        'Sable walks out into the middle of the pavement, in the full sun, and lies down there, grey and in plain view.',
      ),
      N(
        'The fans in the queue step round her, carefully, the way you step round a cat in a doorway. She stays exactly where she is.',
        'soft',
      ),
    ],
    [
      ask(
        1,
        'sel',
        'respecting an animal’s space: step round, do not grab',
        'CASEL: Social awareness',
        [N('The fans step carefully round Sable. What does that show?')],
        [
          o(
            'Respect: giving an animal space when it hasn’t asked to be touched.',
            [
              N(
                'Yes. Animals have feelings and their own say. Giving them space is a way of being fair.',
              ),
              N('If they want to be petted, they will let you know.'),
            ],
            true,
          ),
          o('The fans are afraid of her.', [
            N('They aren’t afraid. They are being careful and kind.'),
            N('They give her space.'),
          ]),
          o('They don’t notice her.', [
            N('They clearly notice. They step round her carefully.'),
            N('It shows respect.'),
          ]),
        ],
        'Learned that giving an animal space, and waiting for it to come to you, shows respect.',
      ),
    ],
  ),
  // after the page, in the Grove (Luna)
  sc(
    'a29-grove-luna-heel',
    [
      N('Luna looks at Sable, who is lying in the middle of the path in the sun, and then at you.'),
      LU(
        'She went somewhere loud and bright, and didn’t hide? Well. Don’t make a fuss of it. She’ll know.',
      ),
    ],
    [
      ask(
        1,
        'literacy',
        'understatement: Luna’s dry words hide how proud she is',
        'RL.3.3',
        [N('Luna says “Well. Don’t make a fuss of it.” What is she really saying?')],
        [
          o(
            'That she is proud, said in a dry way.',
            [
              N('Yes. Some people hide big feelings under small, dry words. Luna is one of them.'),
              N('Readers learn to hear what is under what is said.'),
            ],
            true,
          ),
          o('That she is cross with Sable.', [
            N('If she were cross, she would not say Sable will know.'),
            N('She is proud, quietly.'),
          ]),
          o('That she doesn’t care.', [
            N('She watched closely and spoke to you about it.'),
            N('That shows she cares, dryly.'),
          ]),
        ],
        'Heard the feeling hidden under Luna’s dry words: quiet pride in Sable.',
      ),
    ],
  ),
  sc(
    'a29-grove-luna-hid',
    [
      N('Luna looks at Sable, who is under the bench, and then at you.'),
      LU(
        'She went somewhere loud and bright, and came home. Hiding still counts as going. Don’t make a fuss of it.',
      ),
    ],
    [
      ask(
        1,
        'literacy',
        'understatement: Luna’s dry words hide how proud she is',
        'RL.3.3',
        [N('Luna says “Hiding still counts as going.” What does she mean?')],
        [
          o(
            'That Sable was brave to go, even though she hid.',
            [
              N('Yes. Luna is saying that going was the brave part, even if hiding came with it.'),
              N('A dry line can hold a kind thought.'),
            ],
            true,
          ),
          o('That hiding is silly.', [
            N('She says it counts, which means it matters.'),
            N('She is praising Sable.'),
          ]),
          o('That Sable shouldn’t have gone.', [
            N('She says Sable “came home”, which is good news to Luna.'),
            N('She thinks going was brave.'),
          ]),
        ],
        'Heard the kind thought under Luna’s dry line: going counts, even if you hide.',
      ),
    ],
  ),
  // A29-12, step 2 (sleeve = saw): replaces a29-12-find
  sc(
    'a29-12-find-saw',
    [
      N(
        'The car park under the awards hall smells of exhaust and spilt fizzy drink. The noise upstairs has gone thin and strange.',
      ),
      N(
        'You are sitting on the gear case, because nobody told you where else to sit. Your Nubbin is in the merchandise bag, very quiet.',
      ),
      N(
        'Rumi comes down the ramp fast, looking along the rows of cars. When she sees you, she stops looking.',
      ),
      N(
        'She sits down on the case beside you. She came to you first, before Mira, before Zoey, before Celine.',
      ),
      R('You saw. In the dressing room. And you said it was all right.'),
      R('Was it true? Or were you only being nice?'),
      Y('It was true. It still is.'),
      N('She lets her breath go, all of it, like someone putting down a heavy bag.', 'soft'),
      R('Everyone saw tonight. You saw first. That helps. I don’t know why, but it helps.'),
    ],
    [
      ask(
        5,
        'sel',
        'comfort only works if it is true',
        'CASEL: Relationship skills',
        [
          N(
            'Rumi asks whether “it’s all right” was true, or only nice. Why does it matter that comfort is honest?',
          ),
        ],
        [
          o(
            'Because comfort only works if the person can believe it.',
            [
              N('Yes. Honest comfort can be trusted, and trusted comfort can be leaned on.'),
              N('You said it was true, and it was, so it held.'),
            ],
            true,
          ),
          o('It doesn’t matter, as long as it is nice.', [
            N('Nice can feel good for a minute. But if it isn’t true, it can crumble later.'),
            N('Honest kindness lasts.'),
          ]),
          o('Because lying is always wrong.', [
            N('Honesty matters, yes, and so does kindness. The best comfort has both.'),
            N('That is what you gave Rumi.'),
          ]),
        ],
        'Thought about why honest comfort matters, and how true kindness can be trusted.',
      ),
    ],
  ),
  // A29-12, step 2 (sleeve = away): replaces a29-12-find
  sc(
    'a29-12-find-away',
    [
      N(
        'The car park under the awards hall smells of exhaust and spilt fizzy drink. The noise upstairs has gone thin and strange.',
      ),
      N(
        'You are sitting on the gear case, because nobody told you where else to sit. Your Nubbin is in the merchandise bag, very quiet.',
      ),
      N(
        'Rumi comes down the ramp and stops in front of you. Her arm is bare, and she doesn’t cover it.',
      ),
      R('In the dressing room. That night. You looked away. Did you see?'),
    ],
    [
      ask(
        3,
        'sel',
        'different people need different kinds of kindness; you can ask',
        'CASEL: Relationship skills',
        [
          N(
            'You looked away that night to be kind, and Rumi still isn’t sure what you saw. How can you find out what kind of kindness someone needs?',
          ),
        ],
        [
          o(
            'Ask them, and listen to the answer.',
            [
              N('Yes. People need different things, and the quickest way to know is to ask.'),
              N('Looking away was kind, and asking would have been kind too.'),
            ],
            true,
          ),
          o('Guess, and hope for the best.', [
            N('Guessing can work, but it can also leave someone unsure. Asking is more certain.'),
            N('Ask, and listen.'),
          ]),
          o('Do what you would like done to you.', [
            N('That is a good start. But other people may need something different.'),
            N('Asking tells you what they need.'),
          ]),
        ],
        'Learned that people need different kinds of kindness, and that asking is a good way to find out.',
      ),
    ],
    [
      ch('yes', '“Yes. I saw.”', [
        Y('Yes. I saw.'),
        R('And you let me think you hadn’t.'),
        N('She doesn’t sound angry. She sounds as if she is working something out.', 'think'),
        R('That was kind. I think. I don’t know any more which kind of kind I need.'),
      ]),
      ch('quiet', 'Say nothing.', [
        N('You don’t say anything. You don’t look away this time, either.'),
        R('Right. Yes. You did.', 'soft'),
        N('She sits down on the end of the case, not quite next to you, and looks at her own arm.'),
      ]),
    ],
  ),
  // A29-14, step 2 done (sleeve = saw): replaces a29-14-song-done
  sc(
    'a29-14-song-done-saw',
    [
      N(
        'Halfway through, with the marks blazing on her arms, Rumi looks round the stadium once, and finds you at the side of the stage.',
      ),
      N('Only for a moment. Then she looks back out at the crowd, and sings louder.', 'soft'),
      ...SONG_END,
    ],
    [
      ask(
        1,
        'literacy',
        'a single look can carry a message',
        'RL.2.3',
        [
          N(
            'Rumi looks for you once, only for a moment, and then sings louder. What does that single look tell you?',
          ),
        ],
        [
          o(
            'That she remembers who said it was all right.',
            [
              N('Yes. One look can say “thank you” and “I’m ready” at once.'),
              N('Then she looks away, because she doesn’t need to check any more.'),
            ],
            true,
          ),
          o('That she is lost.', [
            N('She found you at once, so she isn’t lost.'),
            N('The look says she remembers.'),
          ]),
          o('That she forgot the words.', [
            N('She sings louder straight after, so she hasn’t forgotten anything.'),
            N('The look says she remembers who helped her.'),
          ]),
        ],
        'Read a single look as a message: remembering who said it was all right.',
      ),
    ],
  ),
  // A29-14, step 2 done (sleeve = away): replaces a29-14-song-done
  sc(
    'a29-14-song-done-away',
    [
      N(
        'Rumi doesn’t look for anyone, not Mira, not Zoey, not you. She sings straight out, at all of them.',
      ),
      N('She doesn’t need to look for anyone. That is the whole point.', 'soft'),
      ...SONG_END,
    ],
    [
      ask(
        1,
        'literacy',
        'not looking for anyone shows she no longer needs permission',
        'RL.2.3',
        [
          N(
            'Rumi doesn’t look for anyone, and the story says that is “the whole point”. What does it mean?',
          ),
        ],
        [
          o(
            'She no longer needs anyone’s permission to be herself.',
            [
              N('Yes. She isn’t checking whether it is safe. She has decided.'),
              N('That is quiet courage, shown by what she doesn’t do.'),
            ],
            true,
          ),
          o('She is angry at everyone.', [
            N('There is no anger in how she sings.'),
            N('She doesn’t need to look for permission.'),
          ]),
          o('She can’t see anyone.', [
            N('She can see. She just doesn’t need to look.'),
            N('She no longer needs permission.'),
          ]),
        ],
        'Read what a character does not do, looking for nobody, as a sign of confidence.',
      ),
    ],
  ),
  // A29-16 complete (sleeve = saw): replaces a29-16-complete
  sc(
    'a29-16-complete-saw',
    [
      ...C16_OPEN,
      Z(
        'Group photo! Huntrix and staff! Bobby, hold the phone up higher. Higher. Like a tall person.',
        'happy',
      ),
      N(
        'You go to step out of the way. Rumi catches you by the sleeve and pulls you into the middle, between her and Mira.',
      ),
      R('You were the first one to say it was all right. You’re in the photo.', 'happy'),
      N(
        'In the photo, her arm is round your shoulders, marks and all. Your Nubbin is a blur in the front, waving.',
      ),
      ...C16_HOME,
    ],
    [
      ask(
        5,
        'sel',
        'everyone has something they think they should hide; a friend who says it is all right',
        'CASEL: Self-awareness',
        [
          N(
            'Almost everyone has something they think they should hide. What helps a person stop hiding?',
          ),
        ],
        [
          o('Hearing, from someone, that it is all right.', [
            N('That is a fair answer. You were the first to say it, and Rumi remembered.'),
            N('Kind words, said early, can last a long time.'),
          ]),
          o('Being brave a little at a time.', [
            N('That is a fair answer. Rumi took years, then one night, then one sunny street.'),
            N('Small steps count.'),
          ]),
          o('Meeting others who share it.', [
            N(
              'That is a fair answer. Finding that you are not the only one makes hiding feel less needed.',
            ),
            N('Rumi’s fans came to look at her arm and smiled.'),
          ]),
        ],
        'Thought about what helps people stop hiding what they fear others will judge, with no single right answer.',
      ),
    ],
  ),
  // A29-16 complete (sleeve = away): replaces a29-16-complete
  sc(
    'a29-16-complete-away',
    [
      ...C16_OPEN,
      N(
        'You pick up the empty boxes and go across the street to the van. When you turn round, Rumi is looking for you over the crowd.',
      ),
      N('She lifts her bare arm and waves, once, a big wave, from right across the street.'),
      N('You wave back, and neither of you comes any closer. That’s enough.', 'soft'),
      ...C16_HOME,
    ],
    [
      ask(
        4,
        'sel',
        'everyone has something they think they should hide; a friendship does not have to be close to be real',
        'CASEL: Self-awareness',
        [
          N(
            'Almost everyone has something they think they should hide. What helps a person stop hiding?',
          ),
        ],
        [
          o('Someone who gives them space to decide.', [
            N('That is a fair answer. You looked away, and let Rumi choose. That was a gift.'),
            N('Space can be a kind of care.'),
          ]),
          o('Being brave a little at a time.', [
            N('That is a fair answer. Rumi took years, then one night, then one sunny street.'),
            N('Small steps count.'),
          ]),
          o('Meeting others who share it.', [
            N(
              'That is a fair answer. Finding that you are not the only one makes hiding feel less needed.',
            ),
            N('Rumi’s fans came to look at her arm and smiled.'),
          ]),
        ],
        'Thought about what helps people stop hiding what they fear others will judge, with no single right answer.',
      ),
    ],
  ),
];

/** Every `edu:` check string used by the lessons above (this page has no `do` lessons). */
export const CHECKS: string[] = [];
