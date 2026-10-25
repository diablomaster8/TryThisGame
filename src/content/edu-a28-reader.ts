/**
 * The Learning Grove, reader band (ages 7–10): Atlas page A28, The Box of Stories (the Anansesem,
 * Akan spider stories of Ghana, with a Jamaican Anancy telling).
 *
 * Source: atlas-a28.ts (ATLAS_A28 and ATLAS_A28_VARIANTS). One EduScene per original scene (every
 * step scene, every done scene, every complete scene and every variant), id `reader:<original id>`,
 * with every choice kept under its original id and `set` flag (`a28-fairy` in a28-06-wait,
 * `a28-gate` in a28-12-last-driven). Reader keeps all choices, so no `defaultChoice` is needed. See
 * EDU-STYLE.md. British spelling.
 *
 * Learning angles, from the outline: where Ghana and Jamaica are, and what lies between them; Akan
 * day names (Kwaku is a boy born on a Wednesday); how spiders make silk and why only some web
 * threads are sticky; how hornets build paper nests and live in colonies; and how stories travel
 * when people tell them, and change a little each time. Also: Twi words, Anansesem as a living
 * tradition, area, measuring in metres and centimetres, time intervals, fractions, patterns,
 * symmetry, sums and sharing, heat, vibration and sound, seeds, and feelings (respect, patience,
 * honesty, being welcome, listening).
 *
 * Think questions (`ask` with no `best`) in every quest, and one `sel` lesson in every quest.
 * Domains never repeat back to back, across scenes and across quests. Each variant scene has the
 * same domain as the scene it replaces (the margin note is a feelings lesson, between a literacy
 * scene and a science scene), so the order holds on every path.
 *
 * Care notes kept: no lines from Rattray or any published telling (the storyteller’s opening and
 * closing and Ntikuma’s idea are our own words); Anansesem is presented as a living tradition, told
 * today; Nyame is named respectfully as the Supreme Being of the Akan; the creatures all go up to
 * the Sky-god alive; Aso’s mother’s funeral is warm and plain, and “died” is said plainly; the one
 * sentence about enslaved people in the Jamaican yard is kept, plain and dignified, nothing is
 * shown; Jamaican speech is plain English (no dialect spelling); the doll is a carved doll.
 *
 * Facts used (all well established): Ghana is in West Africa on the Gulf of Guinea; the Asante are
 * part of the Akan, the largest group in southern Ghana, and Kumasi was their capital; Twi is a
 * main Akan language; Akan day names (Monday Kwadwo, Tuesday Kwabena, Wednesday Kwaku, Thursday
 * Yaw, Friday Kofi, Saturday Kwame, Sunday Kwesi; Ama is a Saturday girl’s name); spiders have eight
 * legs and make silk in spinnerets; orb weavers make dry spokes and a sticky spiral; hornets chew
 * wood into paper pulp and live in colonies; snakes flick their tongues to collect scent; a
 * python is not venomous; leopards hunt mostly at night; reptiles warm up from their surroundings;
 * yams are tubers; tree sap seals cuts; buttercups have five petals; flowers attract pollinators;
 * dandelion seeds travel on the wind; frogs call at night; a drum’s skin vibrates; heat moves from
 * hotter things to cooler ones; hot air rises; Ghana’s south is wetter and forested, its north
 * drier savannah; Jamaica is an island in the Caribbean Sea, south of Cuba, with Kingston as its
 * capital; the Atlantic lies between Ghana and the Caribbean.
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
const ST = say('a28-storyteller');
const CH = say('a28-children');
const AN = say('a28-ananse');
const NY = say('a28-nyame');
const AS = say('a28-aso');
const ON = say('a28-onini');
const OS = say('a28-osebo');
const MM = say('a28-mmoatia');
const YA = say('a28-ya-nsia');
const NT = say('a28-ntikuma');
const MO = say('a28-mourner');
const EL = say('a28-elder');
const YC = say('a28-yard-child');
const W = say('wisp');

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

// ================================================================== A28-1 We Don’t Really Mean It
const A1: EduQuest = quest(
  'a28-01',
  'We Don’t Really Mean It',
  {
    'a28-01-s1': {
      goal: 'Step into the courtyard on the atlas page and find a place in the ring.',
      hint: 'Touch the carved stool on the page, then walk towards the fire.',
    },
    'a28-01-s2': {
      goal: 'Listen to how the storyteller begins, and answer her with the children.',
      hint: 'Stay on your mat by the fire until she has spoken.',
    },
    'a28-01-s3': {
      goal: 'Fall into the story, and meet the one it is about.',
      hint: 'Keep listening. When the courtyard fades, look for whoever is sitting beside you.',
    },
  },
  [
    sc(
      'a28-01-courtyard',
      [
        N(
          'Nova’s atlas falls open at a page the colour of a warm night: a courtyard, a carved stool, and a ring of faces round a fire.',
        ),
        N(
          'You touch the stool. The paper is warm, and then the air is, and you are standing at the edge of the ring.',
        ),
        N(
          'This is an Asante village in Ghana. Crickets are singing, and somewhere a pot is being scraped.',
        ),
        N(
          'Children sit on mats round the fire, elbowing for the front. Grown-ups lean in the doorways with their arms folded.',
        ),
        CH('Nana’s coming! Nana!', 'happy'),
        N(
          'An old woman crosses the courtyard, slowly, because she can. She has a cloth over one shoulder and all the time in the world.',
        ),
        N('Your Nubbin looks at the one empty mat, right at the front, and then at you.'),
      ],
      [
        ask(
          2,
          'social-studies',
          'finding Ghana on a map of Africa',
          'D2.Geo.2.3-5',
          [N('Nova’s atlas says this village is in Ghana. Where is Ghana?')],
          [
            o(
              'On the west coast of Africa, beside the Gulf of Guinea.',
              [
                N('Yes. Ghana lies in West Africa, with a warm coast on the Gulf of Guinea.'),
                N('The Asante, who live here, are part of the Akan.'),
              ],
              true,
            ),
            o('In the far north of Europe.', [
              N('Not quite. Europe is a different continent, and a long way north.'),
              N('Ghana is in West Africa, on the coast of the Gulf of Guinea.'),
            ]),
            o('On an island in the Pacific Ocean.', [
              N('The Pacific is on the other side of the world.'),
              N('Ghana is a country in West Africa, beside the Atlantic Ocean.'),
            ]),
          ],
          'Located Ghana in West Africa, and met the Asante and the Akan.',
        ),
      ],
      [
        ch('front', 'Sit on the front mat.', [
          N('A small girl shuffles over to make room, without once taking her eyes off the stool.'),
        ]),
        ch('back', 'Sit at the back, by a doorway.', [
          N('A man in the doorway nods to you, as if latecomers are expected and nearly forgiven.'),
          N('Your Nubbin goes to the front anyway, and sits on the end of the girl’s mat.'),
        ]),
      ],
    ),
    sc(
      'a28-01-courtyard-done',
      [
        N('The old woman lowers herself on to the stool. The fire pops.'),
        N('Everybody goes quiet, even the grown-ups, even the man still scraping the pot.'),
      ],
      [
        ask(
          1,
          'sel',
          'listening as a way of showing respect',
          'CASEL: Social awareness',
          [N('Why does everybody, even the grown-ups, go quiet when the storyteller sits down?')],
          [
            o(
              'Listening closely shows respect for the teller and the tale.',
              [
                N(
                  'Yes. A story is a gift from the teller, and listening well is how you say thank you.',
                ),
              ],
              true,
            ),
            o('They are all too tired to talk.', [
              N('Perhaps a few are tired. But the quiet is a choice.'),
              N('People go quiet because listening closely shows respect.'),
            ]),
            o('They are afraid of her.', [
              N('Nobody looks afraid. They look eager.'),
              N('The quiet is respect: it makes room for the story.'),
            ]),
          ],
          'Thought about why listening quietly is a way to show respect.',
        ),
      ],
    ),
    sc(
      'a28-01-stool',
      [
        ST('Before I begin, you must all understand something.', 'think'),
        ST('None of what I am about to tell you is really true. Not truly. Not at all.'),
        N('She says it twice, the way you knock twice on a door you fully intend to open.'),
        N(
          'At once the children shout back at her, all together, loud enough to lift the moths off the wall.',
        ),
        CH('Tell it! Tell it anyway!', 'happy'),
        N('The girl beside you nudges you: you are meant to shout too. Everybody is.'),
      ],
      [
        ask(
          4,
          'literacy',
          'why a storyteller might open this way: a motive',
          'RL.3.3',
          [
            N(
              'The storyteller says her tale is not true, and the children shout, “Tell it anyway!” Why do you think she begins like this?',
            ),
          ],
          [
            o('It is a game between teller and listeners: everybody knows it is a story.', [
              N('That is a fair answer. A shared game makes the listeners part of the telling.'),
              N('Nana would say the children are doing half the work.'),
            ]),
            o('It reminds listeners that a tale is not news, so nobody takes it too literally.', [
              N(
                'That is a fair answer. A story can be true in what it means without being true in fact.',
              ),
            ]),
            o('It is polite, like asking permission to begin.', [
              N('That is a fair answer. The shout back is their permission.'),
              N('Good manners and good storytelling often travel together.'),
            ]),
          ],
          'Thought about why a storyteller might open a tale by saying it is not true, and why listeners answer.',
        ),
      ],
      [
        ch('shout', 'Shout it with them.', [
          Y('Tell it anyway!', 'happy'),
          N(
            'Your Nubbin shouts too. It comes out as a squeak, and the old woman points at it, delighted.',
          ),
        ]),
        ch('mouth', 'Mouth it, a bit shyly.', [
          N(
            'The girl shouts it again, for both of you. Your Nubbin bounces in time, which seems to count.',
          ),
        ]),
      ],
    ),
    sc(
      'a28-01-stool-done',
      [
        ST(
          'Good. Now that we all agree none of it happened, I can tell you exactly how it happened.',
          'happy',
        ),
        N('The children laugh. You laugh too, a beat behind them.'),
        N('You count six mats round the fire, with four children squeezed on to each.'),
      ],
      [
        ask(
          2,
          'maths',
          'equal groups: 6 groups of 4',
          '3.OA.A.1',
          [
            N(
              'Six mats, with four children on each. How many children are sitting round the fire?',
            ),
          ],
          [
            o(
              '24',
              [
                N('Yes. Six groups of four is 6 × 4 = 24.'),
                N('You can check by adding: 4, 8, 12, 16, 20, 24.'),
              ],
              true,
            ),
            o('10', [
              N('That is 6 + 4. We need six groups of four, which is multiplication.'),
              N('Count by fours: 4, 8, 12, 16, 20, 24. So 24 children.'),
            ]),
            o('20', [
              N('Close. That is only five mats. Count by fours: 4, 8, 12, 16, 20…'),
              N('One more mat makes 24.'),
            ]),
          ],
          'Found the total of six equal groups of four by multiplying and by skip counting.',
        ),
      ],
    ),
    sc(
      'a28-01-fall',
      [
        ST('This is a story about Kwaku Ananse, the spider. Who else would it be about?'),
        CH('Ananse!', 'happy'),
        ST('Once there were no stories on the earth at all. Not one. Imagine that.'),
        N('You try. It is like trying to imagine a room with no corners.'),
        ST('Every story there was belonged to the Sky-god, Nyame, and he kept them by him.'),
        N(
          'Her voice goes low, and the courtyard goes with it. Under her words the crickets chirp on, and the stars come down close.',
        ),
        N(
          'Your Nubbin grips your sleeve. Then the mat under you is red earth, there are trees, and it is morning.',
        ),
        N('Something is sitting on a fallen log beside you, swinging a great many legs.'),
      ],
      [
        ask(
          5,
          'science',
          'sound is made by vibration',
          '4-PS3-2',
          [
            N(
              'A cricket makes its chirp by rubbing its wings together. What is really making the sound?',
            ),
          ],
          [
            o(
              'Parts of the wings vibrate, and the shaking travels through the air.',
              [
                N('Yes. Rubbing makes the wing parts vibrate, which means shake very fast.'),
                N('The shaking passes through the air to our ears, and we hear it as sound.'),
              ],
              true,
            ),
            o('Air whistling through the cricket’s throat.', [
              N('Crickets do not sing from the throat. They use their wings.'),
              N('The wings vibrate, and that shaking is the sound.'),
            ]),
            o('Its legs tapping on the ground.', [
              N('Tapping makes a different sound. A cricket’s song comes from its wings.'),
              N('They rub together and vibrate, and the vibration is what we hear.'),
            ]),
          ],
          'Learned that crickets make sound by rubbing their wings, which vibrate, and that vibrations are sound.',
        ),
      ],
    ),
    sc(
      'a28-01-fall-done',
      [
        N(
          'It is a spider the size of a cooking pot, in a hat, and it is looking at you the way a trader looks at a cart.',
        ),
        AN('You have two arms. And a bag. Excellent.', 'think'),
        AN('A spider has eight legs and nowhere at all to put a python.'),
        AN('And eight legs means eight socks. My wife Aso has eight legs too. Ruinous.'),
        N('Your Nubbin reaches for a silver thread on the log, and sticks to it.'),
        N(
          'The spider unpicks it without looking, like somebody who has done this many times before.',
        ),
      ],
      [
        ask(
          3,
          'maths',
          'equal groups: 2 spiders with 8 legs each',
          '3.OA.A.1',
          [
            N(
              'Ananse needs a sock for every leg, and so does Aso. How many socks do the two of them need?',
            ),
          ],
          [
            o('16', [N('Yes. Two spiders with eight legs each is 2 × 8 = 16 socks.')], true),
            o('10', [
              N('That is 8 + 2. Each spider has eight legs, and there are two spiders.'),
              N('8 + 8 = 16 socks.'),
            ]),
            o('8', [
              N('That is only Ananse’s socks. Aso has eight legs too.'),
              N('8 + 8 = 16 socks.'),
            ]),
          ],
          'Multiplied two equal groups of eight to find how many socks two spiders need.',
        ),
      ],
    ),
    sc(
      'a28-01-complete',
      [
        AN(
          'I am Kwaku Ananse. You will carry things for me, and in return you will see the cleverest thing ever done.',
          'happy',
        ),
        N(
          'Behind you, very faint, you can still hear the fire, and the old woman’s voice going on.',
        ),
        AN('That is her, telling us. Do not worry about it. She gets me right. Mostly right.'),
        AN('Come. We are going to see the Sky-god. Walk tall. Not too tall. He is taller.'),
        N(
          'Your Nubbin falls in behind him, stepping where he steps, which is hard work with eight legs to copy.',
        ),
      ],
      [
        ask(
          3,
          'literacy',
          'describing a character from what he says and does',
          'RL.3.3',
          [N('Ananse has said a lot about himself already. Which words describe him best so far?')],
          [
            o(
              'Clever, boastful and a little sly.',
              [
                N('Yes. He boasts about his cleverness, and he is already planning a trick.'),
                N('Good readers notice what a character says and does, not just what he claims.'),
              ],
              true,
            ),
            o('Shy, honest and tired.', [
              N('Look at what he says: “the cleverest thing ever done”. That is not shy.'),
              N('He is clever, boastful and a little sly.'),
            ]),
            o('Slow, gentle and sleepy.', [
              N('Ananse is quick and full of plans. Nothing sleepy about him.'),
              N('Clever, boastful and a little sly fits better.'),
            ]),
          ],
          'Described a character’s traits using evidence from his words and actions.',
        ),
      ],
    ),
  ],
  [
    gl(
      'Asante',
      'A large Akan people of Ghana. Their historic capital is the city of Kumasi.',
      'a28-01-courtyard',
    ),
    gl(
      'Akan',
      'The largest group of peoples in southern Ghana. They speak related languages, such as Twi.',
      'a28-01-courtyard',
    ),
    gl('vibrate', 'To shake very fast, back and forth.', 'a28-01-fall'),
  ],
);

// ================================================================== A28-2 The Sky-god’s Stories
const A2: EduQuest = quest(
  'a28-02',
  'The Sky-god’s Stories',
  {
    'a28-02-s1': {
      goal: 'Climb Ananse’s thread up to the Sky-god’s court.',
      hint: 'Follow Ananse up the silver line from the clearing.',
    },
    'a28-02-s2': {
      goal: 'Stand with Ananse while he asks the Sky-god his price.',
      hint: 'Stay a respectful step behind Ananse in the court.',
    },
    'a28-02-s3': {
      goal: 'Walk into the forest with Ananse to plan the first capture.',
      hint: 'Sit with Ananse on the root at the foot of the thread.',
    },
  },
  [
    sc(
      'a28-02-climb',
      [
        N(
          'Ananse spins a thread straight up into the morning and climbs it, and you climb after him. Nobody explains how.',
        ),
        N(
          'Your Nubbin rides on your shoulders, sticks to your hair, and stays stuck all the way up.',
        ),
        AN('Don’t look down. Down is where all the people who didn’t think of this are.', 'happy'),
        N(
          'At the top is a court of white cloud. Elders sit on carved stools, and at the far end is a light too bright to look at.',
        ),
        N(
          'Rich men are leaving as you arrive, their servants carrying out gifts that were all refused.',
        ),
        AN('Kings. Big towns. They came to buy the Sky-god’s stories. Couldn’t pay.', 'think'),
        AN(
          'I, on the other hand, have no money at all. It is a great advantage. Nobody watches a poor spider.',
        ),
      ],
      [
        ask(
          2,
          'science',
          'how spiders make silk',
          '4-LS1-1',
          [N('Real spiders spin silk too. Where on a spider’s body does the silk come from?')],
          [
            o(
              'Tiny spouts called spinnerets at the back, where liquid silk hardens into thread.',
              [
                N('Yes. Silk is made inside the spider as a liquid.'),
                N(
                  'It leaves through the spinnerets and turns into a strong thread as it is pulled out.',
                ),
              ],
              true,
            ),
            o('From its mouth, like a long string of spit.', [
              N('Some creatures do make threads from their mouths, but not spiders.'),
              N('A spider’s silk comes from spinnerets at the back of its body.'),
            ]),
            o('From the leaves it eats.', [
              N('A spider does not make silk out of leaves. Most spiders eat insects.'),
              N('Its body makes the silk, and it comes out of the spinnerets.'),
            ]),
          ],
          'Learned that spiders make silk inside their bodies and spin it out of spinnerets.',
        ),
      ],
      [
        ch('pay', 'Ask what he means to pay with, then.', [
          AN('With whatever he asks for. That is the trick. Agree first. Work out how afterwards.'),
        ]),
        ch('hair', 'Unstick your Nubbin from your hair first.', [
          N(
            'It takes a while. An elder on a stool watches the whole business with deep interest, and nods when it is done.',
          ),
        ]),
      ],
    ),
    sc(
      'a28-02-climb-done',
      [
        N(
          'Ananse straightens his hat, takes three steps forward, and bows so low that the brim touches the cloud.',
        ),
        N(
          'The light at the end of the court is Nyame, the Sky-god, the Supreme Being of the Akan, whom many people still honour today.',
        ),
      ],
      [
        ask(
          1,
          'sel',
          'respect for someone with great age or wisdom',
          'CASEL: Social awareness',
          [N('Why does Ananse bow so low at the Sky-god’s court?')],
          [
            o(
              'To show deep respect for someone great and wise.',
              [
                N('Yes. Bowing is a way of showing respect without a word.'),
                N('In many places, people honour elders and leaders with gestures like this.'),
              ],
              true,
            ),
            o('Because he dropped something.', [
              N('That would be funny, but Ananse is bowing on purpose.'),
              N('He bows to show respect to the Sky-god.'),
            ]),
            o('To hide his face from the elders.', [
              N('He is not hiding. A bow is a greeting that says, “I honour you.”'),
            ]),
          ],
          'Thought about how a bow shows respect for a leader or an elder.',
        ),
      ],
    ),
    sc(
      'a28-02-price',
      [
        NY('Kwaku Ananse. You have come a long way up, for a spider.'),
        AN('Great one. I have come to buy your stories.', 'happy'),
        N(
          'A murmur goes round the elders, who sit in three rows of four on their carved stools. One of them stops chewing.',
        ),
        NY(
          'Great towns have come to buy them. Kings have come. They have all gone home again with their gold.',
        ),
        NY('What makes you think you can pay what they could not?'),
        AN('Name the price, great one. Whatever it is, I will pay it.'),
        NY(
          'Then hear it. Bring me Onini, the python, and Mmoboro, the hornets, the whole cross nest of them.',
        ),
        NY(
          'Bring me Osebo, the leopard, the strongest hunter in the forest. And bring me Mmoatia, the fairy who is never caught.',
        ),
        AN('I will bring them all. And my own old mother, Ya Nsia, as well.', 'happy'),
        N('Your Nubbin turns and stares at him. So do you.'),
        NY('So be it. Go, Kwaku Ananse.'),
      ],
      [
        ask(
          2,
          'maths',
          'equal groups: 3 rows of 4',
          '3.OA.A.1',
          [N('The elders sit in three rows of four stools. How many elders are in the court?')],
          [
            o('12', [N('Yes. Three rows of four is 3 × 4 = 12 elders.')], true),
            o('7', [
              N('That is 3 + 4. There are three rows, and four elders in each row.'),
              N('3 × 4 = 12.'),
            ]),
            o('34', [
              N('That is the numbers 3 and 4 side by side. We need three groups of four.'),
              N('4 + 4 + 4 = 12.'),
            ]),
          ],
          'Multiplied the rows by the stools in each row to find how many elders sit in the court.',
        ),
      ],
      [
        ch('mother', 'Whisper, “Your mother?”', [
          AN('She will love it up here. Very good stools.', 'think'),
        ]),
        ch('silent', 'Say nothing. Some things don’t need saying.', [
          N(
            'Ananse glances at you sideways, as if your silence has told him something he’d rather not hear.',
          ),
        ]),
      ],
    ),
    sc(
      'a28-02-price-done',
      [
        N(
          'On the way down the thread Ananse is humming. You are counting on your fingers: a python, a swarm, a leopard, a fairy.',
        ),
        N('Your Nubbin is counting too, on its toes, and has run out.'),
        N(
          'The four names are Twi words. Twi is a main Akan language, spoken by millions of people in Ghana.',
        ),
      ],
      [
        ask(
          2,
          'literacy',
          'learning the meaning of new words',
          'L.3.4',
          [N('Onini means python. Which of these Twi names means leopard?')],
          [
            o(
              'Osebo',
              [
                N('Yes. Osebo is the leopard.'),
                N('Mmoboro means hornets, and Mmoatia are the little fairies of Akan belief.'),
              ],
              true,
            ),
            o('Mmoboro', [
              N('Mmoboro means hornets, the ones in the paper nest.'),
              N('The leopard is Osebo.'),
            ]),
            o('Mmoatia', [N('Mmoatia are fairies, quick and small.'), N('The leopard is Osebo.')]),
          ],
          'Matched Twi animal names to their meanings: Onini, Osebo, Mmoboro and Mmoatia.',
        ),
      ],
    ),
    sc(
      'a28-02-road',
      [
        N(
          'At the foot of the thread Ananse sits down on a root and looks you over properly, for the first time.',
        ),
        AN('Eight legs, I have. Two arms, you have. And that one? What does it do?', 'think'),
        N('Your Nubbin, as if it has been asked, sits down in a puddle of sap and sticks.'),
        AN('Ah. A specialist.'),
        AN(
          'Kwaku, they call me, because I was born on a Wednesday. Every Akan child has a day name. What is yours?',
        ),
        AN(
          'Friday boys are Kofi. Saturday, Kwame. Sunday, Kwesi. Wednesday is best, obviously.',
          'happy',
        ),
      ],
      [
        ask(
          5,
          'social-studies',
          'Akan day names',
          'D2.His.2.3-5',
          [
            N(
              'Akan families name children for the day they were born. Kwaku is a boy born on a Wednesday. What would a boy born on a Saturday be called?',
            ),
          ],
          [
            o(
              'Kwame',
              [
                N('Yes. Kwame is for Saturday. A Saturday girl is called Ama.'),
                N('Kofi is a Friday boy, and Kwesi is a Sunday boy.'),
              ],
              true,
            ),
            o('Kofi', [N('Kofi is for Friday, one day too early.'), N('A Saturday boy is Kwame.')]),
            o('Kwesi', [
              N('Kwesi is for Sunday, one day too late.'),
              N('A Saturday boy is Kwame.'),
            ]),
          ],
          'Learned that Akan children are named for their birth day, and matched a day to a name.',
        ),
      ],
      [
        ch('day', 'Tell him the day you were born on.', [
          AN('A fine day. Not as fine as Wednesday. But fine.', 'happy'),
        ]),
        ch('unknown', 'Say you don’t know.', [
          AN('Then you can choose one. That is better still. I would choose Wednesday.'),
        ]),
      ],
    ),
    sc(
      'a28-02-road-done',
      [
        N('He gets up, dusts off his hat, and points into the trees with three legs at once.'),
        AN('Python first. He is the vainest. Vain ones are easy.'),
        N(
          'A python is a snake with no venom. It catches its food and squeezes it, and it finds its way partly by flicking its tongue.',
        ),
      ],
      [
        ask(
          2,
          'science',
          'a snake’s tongue collects scent',
          '4-LS1-2',
          [N('A python flicks its tongue in and out. What is the tongue doing?')],
          [
            o(
              'Collecting tiny scent particles from the air, so it can smell.',
              [
                N('Yes. The tongue picks up scent from the air and ground.'),
                N(
                  'The snake then presses it to special organs in its mouth that sense the smells.',
                ),
              ],
              true,
            ),
            o('Cooling itself down, like a dog panting.', [
              N('Snakes do not cool themselves that way. They lie in shade instead.'),
              N('Flicking the tongue is how they collect scents.'),
            ]),
            o('Making a hissing noise.', [
              N('A hiss comes from breathing out, not from the tongue.'),
              N('The tongue flicks to collect scents.'),
            ]),
          ],
          'Learned that a snake flicks its tongue to collect scent, one of its senses.',
        ),
      ],
    ),
    sc(
      'a28-02-complete',
      [
        N(
          'The forest is enormous, green and noisy. Somewhere in it is a python, and somewhere a fairy.',
        ),
        AN('One thing at a time. That is how you eat a whole yam.', 'happy'),
        N(
          'He sets off. You set off after him, and your Nubbin sets off after you, with a leaf stuck to its foot.',
        ),
        N(
          'Ananse agreed to the Sky-god’s price first, and left working out how to pay it until afterwards.',
        ),
      ],
      [
        ask(
          3,
          'sel',
          'making promises: think before you agree',
          'CASEL: Responsible decision-making',
          [
            N(
              'Ananse said yes first and worked out how afterwards. Is that a good way to make a promise?',
            ),
          ],
          [
            o('No. Only promise what you know you can do.', [
              N('That is a fair answer. A promise is something other people rely on.'),
              N(
                'Ananse promised Nyame his own mother, and never asked her first. She has views on that.',
              ),
            ]),
            o('Sometimes. A big promise can push you to find a way.', [
              N(
                'That is a fair answer. Some great things only get done because someone said yes first.',
              ),
              N('The risk is who gets hurt if you cannot do it.'),
            ]),
            o('It depends who gets hurt if you fail.', [
              N(
                'That is a fair answer. A promise that risks only yourself is different from one that risks others.',
              ),
              N('Notice how many creatures Ananse’s promise puts at risk.'),
            ]),
          ],
          'Thought about when it is wise to make a big promise, and who is affected if it is broken.',
        ),
      ],
    ),
  ],
  [
    gl(
      'spinneret',
      'One of the tiny spouts at the back of a spider’s body that spin silk into thread.',
      'a28-02-climb',
    ),
    gl('Twi', 'A main language of the Akan people of Ghana.', 'a28-02-price-done'),
    gl(
      'day name',
      'A name given to a child for the day of the week they were born, common among the Akan.',
      'a28-02-road',
    ),
    gl(
      'venom',
      'Poison that an animal injects with a bite or sting. A python has none.',
      'a28-02-road-done',
    ),
  ],
);

// ================================================================== A28-3 Onini the Python
const A3: EduQuest = quest(
  'a28-03',
  'Onini the Python',
  {
    'a28-03-s1': {
      goal: 'Find a long palm branch and some creeper for Ananse.',
      hint: 'Look along the forest floor for a fallen branch; the creeper is where your Nubbin walks into it.',
    },
    'a28-03-s2': {
      goal: 'Watch Ananse and Aso’s argument from close by, with a straight face.',
      hint: 'Stand by the branch under the python’s tree.',
    },
    'a28-03-s3': {
      goal: 'Hold the python’s tail while Ananse “measures” him.',
      hint: 'Take the tail end of the python and don’t let go.',
    },
  },
  [
    sc(
      'a28-03-branch',
      [
        AN('We need a palm branch. A long one. And creeper, for tying. Plenty of creeper.'),
        N(
          'You find a fallen palm branch longer than a canoe. Your Nubbin finds the creeper by walking into it.',
        ),
        AN(
          'Now. My wife Aso is coming. When she gets here we will have a terrible argument, and you will look shocked.',
        ),
        N(
          'A spider in a headcloth comes along the path with a basket, already looking tired of him.',
        ),
        AS('What are you doing with that branch, Kwaku?', 'think'),
        AN('Not now, Aso. Argue with me. Loudly. By the python’s tree.'),
        AS('I always argue with you loudly. I don’t need a reason.'),
      ],
      [
        ask(
          1,
          'science',
          'choosing a material for its properties',
          undefined,
          [N('Ananse wants creeper for tying, not a plank. Why is creeper better?')],
          [
            o(
              'It is flexible and strong, so it bends round things and holds a knot.',
              [
                N('Yes. Materials are chosen for their properties.'),
                N('Creeper is bendy and strong. A plank is strong but stiff.'),
              ],
              true,
            ),
            o('It is heavy, so it holds things down.', [
              N('Weight is not what matters for tying. Creeper is quite light.'),
              N('It is useful because it is flexible and strong.'),
            ]),
            o('It is shiny.', [
              N('Shininess does not help with tying.'),
              N('Creeper works because it is flexible and strong.'),
            ]),
          ],
          'Chose a material for tying by comparing flexible and stiff properties.',
        ),
      ],
    ),
    sc(
      'a28-03-branch-done',
      [
        N('The three of you drag the branch to a great tree with roots like knuckles.'),
        N('The roots are fat, brown and gnarled, and they grip the ground tightly.'),
        N('Something long is asleep up in the branches, and you can hear it breathing.'),
      ],
      [
        ask(
          0,
          'literacy',
          'recognising a simile',
          'L.4.5',
          [N('The tree has “roots like knuckles”. What kind of language is that?')],
          [
            o(
              'A simile: it compares two things using “like”.',
              [
                N('Yes. A simile says one thing is like another, to help you picture it.'),
                N('Knuckles are bony and knobbly, so you can see the roots.'),
              ],
              true,
            ),
            o('A rhyme.', [
              N('Nothing here rhymes. It is a comparison.'),
              N('Using “like” to compare two things is a simile.'),
            ]),
            o('A fact about trees.', [
              N('Roots are not really knuckles. It is a picture in words.'),
              N('Comparing two things with “like” is a simile.'),
            ]),
          ],
          'Recognised a simile (roots like knuckles) as a comparison using “like”.',
        ),
      ],
    ),
    sc(
      'a28-03-argue',
      [
        AN('He IS longer than this branch!', 'angry'),
        AS('He is NOT! He is shorter! Anybody can see it!', 'angry'),
        AN('Longer!'),
        AS('Shorter! Ask anybody you like!'),
        N(
          'They are both very good at this. You start to suspect they have had a great deal of practice.',
        ),
        N(
          'A head comes down out of the tree, very slowly, followed by an enormous amount of python.',
        ),
        ON('What is all this noise about my length?'),
        AN(
          'Onini! Thank goodness. My wife says you are shorter than this branch. I say you are longer. Settle it for us?',
        ),
        ON('Shorter? Lay the branch down. I will lie beside it.', 'angry'),
        N(
          'He pours himself along the branch and stretches, and stretches harder. There is still a hand’s width of branch to spare.',
        ),
      ],
      [
        ask(
          4,
          'sel',
          'settling a disagreement with evidence, not volume',
          'CASEL: Relationship skills',
          [
            N(
              'Ananse and Aso shout at each other, and neither gives way. What would settle it fairly?',
            ),
          ],
          [
            o(
              'Measuring the python against the branch.',
              [
                N('Yes. Evidence settles an argument better than volume.'),
                N('Once you measure, nobody has to take anybody’s word for it.'),
              ],
              true,
            ),
            o('Whoever shouts loudest wins.', [
              N(
                'That ends the argument, but it does not settle it. The branch is still the same length.',
              ),
              N('Measuring would settle it fairly.'),
            ]),
            o('Asking a passer-by to pick a side.', [
              N('A passer-by only has an opinion. The branch has the answer.'),
              N('Measuring the python settles it.'),
            ]),
          ],
          'Talked about settling a disagreement by checking the facts instead of shouting.',
        ),
      ],
      [
        ch('nearly', 'Tell Onini he very nearly has it.', [
          ON('Nearly is not a length a python accepts.', 'angry'),
        ]),
        ch('straight', 'Keep a very straight face.', [
          N('You manage. Your Nubbin does not, and has to turn round and look hard at a tree.'),
        ]),
      ],
    ),
    sc(
      'a28-03-argue-done',
      [
        AN(
          'Your tail keeps slipping, that is the trouble. My helper will hold it, so we can measure you properly.',
        ),
        N(
          'You measure. The branch is exactly three metres long. Onini, stretched as far as he can go, is two metres ninety.',
        ),
      ],
      [
        ask(
          1,
          'maths',
          'comparing lengths in metres and centimetres',
          '4.MD.A.1',
          [
            N(
              'The branch is 3 metres. Onini is 2 metres 90 centimetres. How many centimetres short of the branch is he?',
            ),
          ],
          [
            o(
              '10',
              [
                N('Yes. 3 metres is 300 centimetres, and 300 − 290 = 10.'),
                N('Ten centimetres is about a hand’s width, just as the scene says.'),
              ],
              true,
            ),
            o('90', [
              N(
                'That is the centimetres past two metres. Change 3 metres to 300 centimetres first.',
              ),
              N('300 − 290 = 10.'),
            ]),
            o('100', [
              N('That is one metre. Onini is two metres 90, only a little short of three.'),
              N('300 − 290 = 10 centimetres.'),
            ]),
          ],
          'Converted metres to centimetres and subtracted to find a small difference in length.',
        ),
      ],
    ),
    sc(
      'a28-03-tie',
      [
        N('You hold the tail end. It is heavy, dry and much stronger than you are.'),
        AN('Just to measure you properly. Head end now. And a bit in the middle. For accuracy.'),
        N(
          'Round and round goes the creeper, quick and neat, nose to tail. Onini doesn’t notice until he can’t move to notice.',
        ),
        ON('This is not measuring.', 'shock'),
        AN('No. You are very long, though. I will tell everyone.', 'happy'),
        N('Your Nubbin, helping with a knot, ties its own foot into it.'),
      ],
      [
        ask(
          2,
          'science',
          'how a snake moves without legs',
          '4-LS1-1',
          [N('A python has no legs. How does it move along the ground?')],
          [
            o(
              'Muscles ripple along its body, and belly scales grip the ground.',
              [
                N('Yes. Its ribs and muscles move in waves.'),
                N('The scales on its belly grip the ground, so it can slither without any legs.'),
              ],
              true,
            ),
            o('It rolls like a wheel.', [
              N('Snakes do not roll. They slither.'),
              N('Muscles and belly scales do the work.'),
            ]),
            o('It hops on its tail.', [
              N('A snake cannot hop. It slides along the ground.'),
              N('Muscles and belly scales do the work.'),
            ]),
          ],
          'Learned how a snake moves using muscles, ribs and belly scales.',
        ),
      ],
      [
        ch('sorry', 'Tell Onini you’re sorry.', [
          ON('Sorry, from the one holding my tail.', 'sad'),
          N('That is fair. You keep holding it anyway, and feel bad.'),
        ]),
        ch('pat', 'Pat the python’s nose, carefully.', [
          N(
            'He looks at you with one cold eye. It is not friendship, but it is not biting either.',
          ),
        ]),
      ],
    ),
    sc(
      'a28-03-tie-done',
      [
        N(
          'Ananse unties your Nubbin’s foot, one strand at a time, and leaves the python exactly as tied as he was.',
        ),
        N('Onini glares out of the creeper. He is unhurt, but his pride hurts more than he does.'),
      ],
      [
        ask(
          1,
          'sel',
          'fairness and trickery: a think question',
          'CASEL: Responsible decision-making',
          [
            N(
              'Ananse tricked Onini by pretending to measure him. Was it a fair trick? Does it matter that Onini is proud and boastful?',
            ),
          ],
          [
            o('No. A trick is a trick, however proud someone is.', [
              N(
                'That is a fair answer. Being annoying does not give anyone the right to trick you.',
              ),
              N('Onini might say the same.'),
            ]),
            o('Partly. His pride made him easy to fool, but Ananse should still be honest.', [
              N('That is a fair answer. A weakness can explain a trick without excusing it.'),
            ]),
            o('In a story, tricks like this are a kind of game.', [
              N('That is a fair answer. Tricks in tales are often a game.'),
              N('The question is whether you would enjoy it if it were you.'),
            ]),
          ],
          'Thought about whether a trick is fair, and whether someone’s pride makes it more acceptable.',
        ),
      ],
    ),
    sc(
      'a28-03-complete',
      [
        AN('One! One, for a spider with no money! Aso, did you see?', 'happy'),
        AS('I saw. I argued. You are welcome.', 'think'),
        N(
          'Onini goes up the thread to the Sky-god, wrapped like a parcel and loudly offended the whole way.',
        ),
        N('He will be well looked after up there. It is a court, not a kitchen.'),
        AN('Hornets next. Find me a gourd.'),
      ],
      [
        ask(
          3,
          'social-studies',
          'fair rules: hearing both sides',
          'D2.Civ.8.3-5',
          [
            N(
              'In traditional Akan courts, a chief and his elders listen to both sides of a quarrel. Why is hearing both sides a fair rule?',
            ),
          ],
          [
            o(
              'You cannot judge fairly if you have only heard one side.',
              [
                N('Yes. Each side knows something the other does not.'),
                N('Hearing everyone is what makes a decision fair.'),
              ],
              true,
            ),
            o('It makes the quarrel last longer.', [
              N('It can take longer, but a quick decision can be an unfair one.'),
              N('Hearing both sides is fair because each side knows something the other does not.'),
            ]),
            o('So that the loudest side wins.', [
              N('Hearing both sides is meant to stop that.'),
              N('It lets quiet people be heard too.'),
            ]),
          ],
          'Thought about why hearing both sides is a fair way to settle a quarrel.',
        ),
      ],
    ),
  ],
  [
    gl(
      'creeper',
      'A climbing plant with long, bendy stems that can be used like rope.',
      'a28-03-branch',
    ),
    gl(
      'simile',
      'A comparison that uses “like” or “as”, such as “roots like knuckles”.',
      'a28-03-branch-done',
    ),
  ],
);

// ================================================================== A28-4 Mmoboro the Hornets
const A4: EduQuest = quest(
  'a28-04',
  'Mmoboro the Hornets',
  {
    'a28-04-s1': {
      goal: 'Fill a gourd with water for Ananse’s “rain”.',
      hint: 'Take the full gourd to the stream and fill it to the brim.',
    },
    'a28-04-s2': {
      goal: 'Pour the rain when Ananse gives the word.',
      hint: 'Stand under the nest with the water gourd, and wait for Ananse.',
    },
    'a28-04-s3': {
      goal: 'Stop up the gourd before the hornets work it out.',
      hint: 'Take the plug of grass from Ananse and close the gourd, quickly.',
    },
  },
  [
    sc(
      'a28-04-gourd',
      [
        N(
          'Ananse cuts the top off a dry gourd and hands it to you. Then he hands you a second gourd, for water.',
        ),
        AN('The dry one is the house. The wet one is the rain. Don’t mix them up.'),
        N(
          'He picks a plantain leaf as wide as a door and holds it over his head, like a chief under an umbrella.',
        ),
        AN('Fill it to the brim. Hornets can tell a stingy rain.'),
        N(
          'The water gourd holds two litres. Your Nubbin, helping, brings back about half of that.',
        ),
      ],
      [
        ask(
          4,
          'maths',
          'volume word problem: half of 2 litres',
          '4.MD.A.2',
          [
            N(
              'The gourd holds 2 litres, and your Nubbin brought half of that. How many more litres are needed to fill it?',
            ),
          ],
          [
            o('1', [N('Yes. Half of 2 litres is 1 litre, so 2 − 1 = 1 litre more.')], true),
            o('2', [
              N('That is the whole gourd. Your Nubbin already brought 1 litre.'),
              N('2 − 1 = 1 litre more.'),
            ]),
            o('½', [
              N('Half a litre is a different amount. Half of 2 litres is 1 litre.'),
              N('So 1 litre is still needed.'),
            ]),
          ],
          'Found half of a quantity and subtracted to answer a volume word problem.',
        ),
      ],
      [
        ch('why', 'Ask why the hornets would believe it’s raining.', [
          AN('Because I will tell them. Nobody argues with weather.', 'happy'),
        ]),
        ch('leaf', 'Offer to hold the leaf.', [
          AN('No. The leaf is the costume. I am the actor. You are the weather.'),
        ]),
      ],
    ),
    sc(
      'a28-04-gourd-done',
      [
        N(
          'The nest hangs from a branch like a grey paper lantern. It hums, and it hums louder the closer you get.',
        ),
        N(
          'Hornets build it from paper they make themselves, by chewing wood into pulp and spreading it in thin layers. Hundreds of them share the work.',
        ),
      ],
      [
        ask(
          1,
          'science',
          'animals in groups help each other survive',
          '3-LS2-1',
          [
            N(
              'Hundreds of hornets live in one nest and share the work of building, guarding and feeding the young. Why does living in a group help them survive?',
            ),
          ],
          [
            o(
              'Many workers can do jobs that one hornet could not do alone.',
              [
                N('Yes. A group like this is called a colony.'),
                N(
                  'Each hornet has a job, and together they can build, defend and feed far more than one could.',
                ),
              ],
              true,
            ),
            o('It is warmer when they are crowded.', [
              N('Warmth helps a little, but it is not the main reason.'),
              N('A colony survives because many workers share the jobs.'),
            ]),
            o('So that they can sting more people.', [
              N('Hornets sting to defend the nest, not to hunt people.'),
              N('The main benefit is that many workers share the jobs.'),
            ]),
          ],
          'Learned that animals living in groups, such as a hornet colony, share jobs and survive better.',
        ),
      ],
    ),
    sc(
      'a28-04-rain',
      [
        AN('Now. Pour.'),
        N('You tip water over the nest. Ananse tips the rest over his own leaf, so that it drums.'),
        AN('Rain! Rain, Mmoboro! The rain has come, and you will all be soaked!', 'shock'),
        AN(
          'Look at me, I have a leaf. You have nothing! Come into my gourd. It is lovely and dry in here.',
        ),
        N(
          'The humming changes note. One hornet comes out, then ten, then all of them, wet and cross and looking for a roof.',
        ),
        N('They pour into the dry gourd like smoke going back down a chimney.'),
      ],
      [
        ask(
          5,
          'literacy',
          'why a trick works: a character’s motive',
          'RL.3.3',
          [N('Why do the hornets believe Ananse’s pretend rain?')],
          [
            o(
              'They really are wet, so his story matches what they feel.',
              [
                N('Yes. They are wet, so “it is raining” sounds right to them.'),
                N('Noticing why someone was fooled helps you spot a trick yourself.'),
              ],
              true,
            ),
            o('Hornets believe everything they are told.', [
              N('It is not about believing everything. They are wet and cross, and want shelter.'),
              N('His story fits what they feel.'),
            ]),
            o('They are too sleepy to notice.', [
              N('They are wide awake, and angry.'),
              N('They believe him because they really are wet.'),
            ]),
          ],
          'Worked out why the hornets believed Ananse: the trick matched what they could feel.',
        ),
      ],
    ),
    sc(
      'a28-04-stopper',
      [
        N('Ananse holds out a plug of twisted grass. All eight of his legs are jiggling.'),
        AN('Now! Now, now, now!', 'shock'),
        N(
          'A hornet’s head pokes out of the gourd’s mouth, looks about, and goes back in to tell the others.',
        ),
        AN('Quickly, before one of them has a thought!', 'shock'),
        N('Inside the gourd the hornets are beginning to notice that it is not raining in there.'),
        N('The buzz you can hear is wings, beating very fast and shaking the air.'),
        N('Your Nubbin stands on tiptoe beside you, ready to help with whatever this is.'),
      ],
      [
        ask(
          6,
          'science',
          'why a hornet buzzes: fast wingbeats make sound',
          undefined,
          [N('Why does a hornet buzz?')],
          [
            o(
              'Its wings beat very fast, and that shakes the air.',
              [
                N('Yes. Fast wingbeats shake the air, and we hear the shaking as a buzz.'),
                N('A bigger, slower wing makes a lower hum.'),
              ],
              true,
            ),
            o('It hums with its mouth.', [
              N('A hornet has no voice like ours.'),
              N('The buzz comes from its wings beating very fast.'),
            ]),
            o('Its legs rub together.', [
              N('Some insects do make sound that way, but not hornets.'),
              N('A hornet’s buzz comes from its wings beating very fast.'),
            ]),
          ],
          'Learned that a hornet’s buzz is the sound of its wings beating very fast.',
        ),
      ],
      [
        ch('jam', 'Jam the stopper in.', [
          N(
            'It goes in with a squeak. The gourd buzzes in your hands like a pot coming to the boil.',
          ),
        ]),
        ch('sit', 'Let your Nubbin close it.', [
          N(
            'Your Nubbin sits on the hole, which is about the right size. You slide the grass in under it, carefully.',
          ),
        ]),
      ],
    ),
    sc(
      'a28-04-stopper-done',
      [
        N(
          'One last hornet, late for everything, lands on your Nubbin’s nose, thinks about it, and stings.',
        ),
        N(
          'Your Nubbin looks at you with enormous eyes. Ananse plucks the hornet off with two fingers and drops it into a tiny gourd of his own.',
        ),
        AN('A spare. A spider always keeps a spare.', 'happy'),
        N('Your Nubbin looks at the tiny gourd, and its eyes go narrow.'),
        AN('Two!', 'happy'),
        N('Two of the Sky-god’s four things are paid: the python and the hornets.'),
      ],
      [
        ask(
          5,
          'maths',
          'a fraction of a whole: 2 of 4 equal parts',
          '3.NF.A.1',
          [N('Two of the four things are paid. What fraction of the price is paid?')],
          [
            o(
              '1/2',
              [
                N('Yes. Two out of four equal parts is 2/4, which is the same as 1/2.'),
                N('Ananse is halfway.'),
              ],
              true,
            ),
            o('1/4', [
              N('1/4 would be one thing out of four. Two have been paid.'),
              N('2/4 is the same as 1/2.'),
            ]),
            o('2/3', [
              N('There are four things, not three, so the bottom number is 4.'),
              N('2/4 is the same as 1/2.'),
            ]),
          ],
          'Wrote two of four equal parts as a fraction and saw that 2/4 is the same as 1/2.',
        ),
        ask(
          5,
          'sel',
          'tricks in stories: a think question',
          'CASEL: Responsible decision-making',
          [
            N(
              'Ananse tricks the hornets with a pretend storm. Stories are full of clever tricks like this. Are they all right in a story, even if they would be wrong in real life?',
            ),
          ],
          [
            o('Yes. In a story, nobody is really hurt, and we can enjoy the cleverness.', [
              N('That is a fair answer. A story is a safe place to try out a trick.'),
              N('Notice, though, that the hornets are still frightened in the tale.'),
            ]),
            o('No. A trick is still a trick, wherever it happens.', [
              N(
                'That is a fair answer. Some people say stories teach us how we feel about tricks.',
              ),
              N('It is fine to enjoy a story and still disagree with Ananse.'),
            ]),
            o('It depends on who the trick is played on, and why.', [
              N(
                'That is a fair answer. A trick on someone dangerous is different from one on a friend.',
              ),
              N('Why do you think Ananse thinks the hornets deserve it?'),
            ]),
          ],
          'Thought about whether tricks in stories are acceptable, and how that differs from real life.',
        ),
      ],
    ),
    sc(
      'a28-04-complete',
      [
        N('Ananse does a small dance on all eight legs, with the gourd held high over his hat.'),
        N(
          'The hornets go up the thread to the Sky-god. They buzz the whole way, but they go, and none the worse.',
        ),
        N(
          'Your Nubbin’s nose has a small red lump on it. It holds a grudge against the gourd, the hornets and, a little, the sky.',
        ),
        AN('Leopard next. For a leopard, we dig.'),
      ],
      [
        ask(
          2,
          'literacy',
          'working out the meaning of a word from context',
          'L.3.4',
          [N('Your Nubbin “holds a grudge”. What is a grudge?')],
          [
            o(
              'Staying cross about something for a long time.',
              [
                N('Yes. A grudge is a long-lasting bad feeling about something that happened.'),
                N('Your Nubbin is still cross about its nose.'),
              ],
              true,
            ),
            o('A kind of small gourd.', [
              N('It sounds like it could be one! But no.'),
              N('A grudge is staying cross about something for a long time.'),
            ]),
            o('A loud sneeze.', [
              N('That would be a different story!'),
              N('A grudge is staying cross for a long time.'),
            ]),
          ],
          'Worked out the meaning of “grudge” from the story.',
        ),
      ],
    ),
  ],
  [
    gl(
      'gourd',
      'A hard-shelled fruit that is dried and hollowed out to make a container.',
      'a28-04-gourd',
    ),
    gl(
      'plantain',
      'A banana-like plant with huge leaves, and a starchy fruit that is cooked.',
      'a28-04-gourd',
    ),
    gl('pulp', 'Soft, wet mush, such as chewed wood.', 'a28-04-gourd-done'),
    gl('grudge', 'A bad feeling you keep about something for a long time.', 'a28-04-complete'),
  ],
);

// ================================================================== A28-5 Osebo the Leopard
const A5: EduQuest = quest(
  'a28-05',
  'Osebo the Leopard',
  {
    'a28-05-s1': {
      goal: 'Help Ananse dig a pit across the leopard’s path.',
      hint: 'Dig where Ananse has scratched a line, then cover the hole with sticks and leaves.',
    },
    'a28-05-s2': {
      goal: 'Come back to the pit at dawn and see what is in it.',
      hint: 'Rest at Ananse’s, then return to the leopard’s path at first light.',
    },
    'a28-05-s3': {
      goal: 'Carry the leopard, safely bundled, to the foot of the thread.',
      hint: 'Take one end of the bundle; your Nubbin will take the tail.',
    },
  },
  [
    sc(
      'a28-05-pit',
      [
        N(
          'Ananse finds the leopard’s path by its smell, which is strong, and its prints, which are larger than you would like.',
        ),
        AN('Here. Dig. Deep enough for a leopard to sit in and think about his life.'),
        N(
          'You dig. Ananse supervises, which mostly means sitting on the spoil heap and saying “deeper”.',
        ),
        N(
          'Your Nubbin digs too, with great energy and no direction, and ends up in a smaller hole of its own.',
        ),
        AN(
          'The pit is three metres long and two wide. Sticks across the top, then leaves. It must look like nothing at all.',
        ),
        N(
          'When you have finished, it looks like a path. You have to remember very hard where it isn’t.',
        ),
      ],
      [
        ask(
          4,
          'maths',
          'area of a rectangle: 3 m by 2 m',
          '3.MD.C.7',
          [
            N(
              'The pit is 3 metres long and 2 metres wide. How many square metres of leaves cover the top?',
            ),
          ],
          [
            o(
              '6',
              [
                N('Yes. The area of a rectangle is length × width: 3 × 2 = 6 square metres.'),
                N('That is six squares, each one metre by one metre.'),
              ],
              true,
            ),
            o('5', [
              N('That is 3 + 2, which adds the sides. Area is length times width.'),
              N('3 × 2 = 6 square metres.'),
            ]),
            o('10', [
              N(
                'That is the distance round the edge, which would be 3 + 2 + 3 + 2. That is the perimeter.',
              ),
              N('Area is 3 × 2 = 6 square metres.'),
            ]),
          ],
          'Found the area of a rectangle by multiplying length by width.',
        ),
      ],
    ),
    sc(
      'a28-05-pit-done',
      [
        AN(
          'Now we go home and sleep. Leopards walk at night. That is when the hole earns its keep.',
        ),
        N(
          'A leopard’s spots break up its outline in the dark and the dappled light. Its eyes see well in dim light, so night is its time.',
        ),
      ],
      [
        ask(
          1,
          'science',
          'how a leopard’s body suits night hunting',
          '4-LS1-2',
          [N('Why do leopards hunt mostly at night?')],
          [
            o(
              'They see well in dim light, and their spots help them hide.',
              [
                N('Yes. Good night vision and camouflage are a hunter’s tools.'),
                N('Camouflage means colours or patterns that help an animal blend in.'),
              ],
              true,
            ),
            o('They are afraid of the sun.', [
              N('Leopards are not afraid of the sun. They just hunt better in the dark.'),
              N('Their eyes see well in dim light, and their spots help them hide.'),
            ]),
            o('They cannot walk in daylight.', [
              N('They can, and sometimes do. But they hunt mostly at night.'),
              N('Their eyes see well in dim light, and their spots help them hide.'),
            ]),
          ],
          'Learned how a leopard’s night vision and spotted coat help it hunt at night.',
        ),
      ],
    ),
    sc(
      'a28-05-fall',
      [
        N('In the night there is a crash, a thump, and a long, low, astonished growl.'),
        N(
          'At first light you creep back along the path. The sticks have gone, and the pit has a leopard in it.',
        ),
        OS('Who dug this? Who digs a hole in a leopard’s own road?', 'angry'),
        N('Osebo is magnificent, spotted all over, and very, very embarrassed.'),
        N('Ananse puts on a face of enormous concern, which he must keep somewhere handy.'),
        AN('Osebo! My poor friend! What a terrible hole! Who would do such a thing?', 'sad'),
      ],
      [
        ask(
          5,
          'sel',
          'pretending and lying: a think question',
          'CASEL: Responsible decision-making',
          [
            N(
              'Ananse dug the hole, then pretends to be shocked. Is pretending the same as lying? Does it matter that Osebo cannot see the whole picture?',
            ),
          ],
          [
            o('Yes. Pretending to be shocked is a lie, because he is hiding the truth.', [
              N('That is a fair answer. A lie does not need to be a spoken sentence.'),
              N('A face can say something false too.'),
            ]),
            o('No. A pretend face is a performance, not a statement.', [
              N(
                'That is a fair answer. But a performance meant to fool someone has a different purpose.',
              ),
              N('Osebo cannot tell it is pretend, and that matters.'),
            ]),
            o('It depends on whether anyone is harmed by it.', [
              N('That is a fair answer. Many people judge a deception by what it does to others.'),
              N('What does it do to Osebo?'),
            ]),
          ],
          'Thought about whether pretending to be innocent is the same as lying.',
        ),
      ],
      [
        ch('look', 'Look anywhere but at the spoil heap.', [
          N(
            'You look at the sky, and so does your Nubbin. The spoil heap is right behind you, being obvious.',
          ),
        ]),
        ch('help', 'Ask Osebo if he’s hurt.', [OS('Only my dignity. Which is worse.', 'sad')]),
      ],
    ),
    sc(
      'a28-05-web',
      [
        AN(
          'Let me help you out. Spiders are wonderful with ropes. I will bend this young tree down and tie a line to it.',
        ),
        OS('You? Help? You are a spider.', 'think'),
        AN('Exactly. Put your arms through this loop, and the tree will lift you right out.'),
        N('The leopard climbs into a loop that turns out to be more loops than he thought.'),
        N(
          'The web goes round and round and round. When the tree springs up, Osebo goes with it, wrapped, furious and unhurt.',
        ),
        OS('Spider. When I get out of this.', 'angry'),
        AN('Yes, yes. Everyone says that.', 'happy'),
      ],
      [
        ask(
          4,
          'science',
          'why an orb web has sticky and dry threads',
          '4-LS1-1',
          [
            N(
              'In a real orb web, a wheel-shaped web, only the spiral threads are sticky. Why not make every thread sticky?',
            ),
          ],
          [
            o(
              'So the spider can walk on the dry threads without getting stuck.',
              [
                N('Yes. The spokes are dry, and the sticky spiral catches the insects.'),
                N(
                  'The spider walks along the dry spokes, so it never gets caught in its own trap.',
                ),
              ],
              true,
            ),
            o('The sticky silk is only for decoration.', [
              N('Sticky silk does a very important job: it catches the food.'),
              N('The dry threads are there so the spider can walk without getting stuck.'),
            ]),
            o('Sticky threads break more easily.', [
              N('Many are strong. The sticky ones are the trap.'),
              N('The dry threads let the spider walk without getting stuck.'),
            ]),
          ],
          'Learned that an orb web has dry spokes for the spider and a sticky spiral to catch food.',
        ),
      ],
      [
        ch('court', 'Tell Osebo the Sky-god keeps a fine court.', [
          OS('Then the Sky-god can come and untie me himself.', 'angry'),
        ]),
        ch('quiet', 'Say nothing, and take the heavy end.', [
          N('Osebo looks at you upside down. He seems to think better of you for not explaining.'),
        ]),
      ],
    ),
    sc(
      'a28-05-web-done',
      [
        N(
          'The bundle is very heavy and very cross. You carry the front, and your Nubbin carries the tip of the tail, which keeps twitching.',
        ),
        N(
          'The thread to the Sky-god is a hundred metres tall, with a knot every twenty-five metres.',
        ),
        N(
          'Your Nubbin sticks at the first knot. Ananse unpicks it, sighing. It sticks at the second, and he sighs louder.',
        ),
        N('At the third knot he unpicks it for good, and it stays free.'),
      ],
      [
        ask(
          3,
          'maths',
          'a distance word problem: 100 − 3 × 25',
          '4.MD.A.2',
          [
            N(
              'The thread is 100 metres tall, with a knot every 25 metres. Your Nubbin is unstuck at the third knot. How many metres of thread are left to climb?',
            ),
          ],
          [
            o(
              '25',
              [
                N('Yes. Three knots is 3 × 25 = 75 metres up.'),
                N('Then 100 − 75 = 25 metres left.'),
              ],
              true,
            ),
            o('75', [
              N('That is how far up it has gone, not how far is left.'),
              N('100 − 75 = 25 metres left.'),
            ]),
            o('50', [
              N('That would be two knots. It has reached the third.'),
              N('3 × 25 = 75, and 100 − 75 = 25 metres left.'),
            ]),
          ],
          'Multiplied to find a distance climbed, then subtracted to find how far was left.',
        ),
      ],
    ),
    sc(
      'a28-05-complete',
      [
        N(
          'Osebo goes up to the Sky-god alive and extremely cross, which is the way many tellings have it.',
        ),
        AN(
          'Three! Python, hornets, leopard. And my mother, of course. She is practically packed.',
          'happy',
        ),
        AN('Now the hard one. Nobody sees a fairy unless she wants to be seen.', 'think'),
        N(
          'On Nova’s map the forests of Ghana are mostly in the south. The north is drier, with open grassland called savannah.',
        ),
      ],
      [
        ask(
          3,
          'social-studies',
          'Ghana’s forest in the south and savannah in the north',
          'D2.Geo.2.3-5',
          [
            N(
              'Ghana’s south is warm and wet with rainforest. Its north is drier savannah. Where would you expect the tallest, thickest trees?',
            ),
          ],
          [
            o(
              'In the south.',
              [
                N('Yes. More rain means more trees, and bigger ones.'),
                N('Leopards live in both places, wherever they find enough prey and cover.'),
              ],
              true,
            ),
            o('In the north.', [
              N('The north is drier, so the trees are fewer and smaller.'),
              N('The tallest, thickest trees are in the wetter south.'),
            ]),
            o('They are the same everywhere.', [
              N('The land changes from south to north, because the rain changes.'),
              N('The tallest, thickest trees are in the wetter south.'),
            ]),
          ],
          'Learned that southern Ghana is wet and forested and northern Ghana is drier savannah.',
        ),
      ],
    ),
  ],
  [
    gl('spoil heap', 'The pile of earth dug out of a hole.', 'a28-05-pit'),
    gl(
      'savannah',
      'A warm grassland with scattered trees and a long dry season.',
      'a28-05-complete',
    ),
  ],
);

// ================================================================== A28-6 Mmoatia and the Gum Doll
const A6: EduQuest = quest(
  'a28-06',
  'Mmoatia and the Gum Doll',
  {
    'a28-06-s1': {
      goal: 'Carve a small doll for Ananse’s trap.',
      hint: 'Take the soft wood and knife from Ananse, and carve at the table by his door.',
    },
    'a28-06-s2': {
      goal: 'Hide by the odum tree and watch who comes for the yam.',
      hint: 'Crouch behind the big root and keep still until dusk.',
    },
    'a28-06-s3': {
      goal: 'Decide what to do while Ananse is away fetching rope.',
      hint: 'Go to the fairy under the odum tree.',
    },
  },
  [
    sc(
      'a28-06-doll',
      [
        N(
          'Ananse gives you a block of soft wood and a small knife, and points at it as if the rest is obvious.',
        ),
        AN('A doll. A small one, the size of a fairy. Arms, legs, a face. Nothing fancy.'),
        N(
          'You carve, and it comes out round-headed and solemn, with its arms held out the same on each side.',
        ),
        N('Your Nubbin looks at it and sits up straighter.'),
        AN('Lovely. Now the gum.'),
        N(
          'He coats the doll all over from a gourd of sticky sap, thick and shining. Your Nubbin touches it once, which is a mistake.',
        ),
        N('It takes both of you to get it loose.'),
      ],
      [
        ask(
          2,
          'maths',
          'a line of symmetry',
          '4.G.A.3',
          [
            N(
              'The doll’s arms are held out the same on both sides. If you drew a line down its middle, what would you notice?',
            ),
          ],
          [
            o(
              'The two halves are mirror images: the doll has a line of symmetry.',
              [
                N('Yes. A line of symmetry splits a shape into two matching halves.'),
                N('If you folded the doll along that line, the two sides would fit exactly.'),
              ],
              true,
            ),
            o('The left half is bigger.', [
              N('You carved the arms the same on each side, so the halves match.'),
              N('That is a line of symmetry.'),
            ]),
            o('Nothing: every doll looks different on each side.', [
              N('Many dolls do, but this one has arms held out the same on each side.'),
              N('Matching halves mean a line of symmetry.'),
            ]),
          ],
          'Recognised a line of symmetry in a doll that looks the same on both sides.',
        ),
      ],
    ),
    sc(
      'a28-06-doll-done',
      [
        N(
          'Ananse sets a bowl of mashed yam in the doll’s lap and props it under a great odum tree, where the fairies come to play.',
        ),
        AN('Now we hide, and we are very, very quiet. You especially.'),
        N(
          'The gum is sap from a tree. Many trees ooze a sticky sap when their bark is cut, and it hardens into a seal.',
        ),
      ],
      [
        ask(
          2,
          'science',
          'why trees make sap',
          '4-LS1-1',
          [N('Why do trees make sticky sap when their bark is cut?')],
          [
            o(
              'It seals the cut and helps keep insects out.',
              [
                N('Yes. Sap works like a plaster for a tree.'),
                N('It covers the wound, hardens, and keeps out insects and germs.'),
              ],
              true,
            ),
            o('To make the tree taste bad to people.', [
              N('It might taste bitter, but that is not the main job.'),
              N('Sap seals the cut and helps keep insects out.'),
            ]),
            o('To glue its leaves on.', [
              N('Leaves grow on stalks. They do not need glue.'),
              N('Sap seals the cut and helps keep insects out.'),
            ]),
          ],
          'Learned that tree sap seals a wound and protects the tree.',
        ),
      ],
    ),
    sc(
      'a28-06-fairy',
      [
        N(
          'You hide behind a root until dusk. Something small and quick comes down out of the odum tree.',
        ),
        N(
          'Mmoatia is no taller than your knee. She has a sharp, clever face and moves like a bird making up its mind.',
        ),
        MM('Oh. Yam. Little one, may I have some of your yam?'),
        N('The doll says nothing. Mmoatia takes this for yes, and eats, neatly, every last bit.'),
        MM('Thank you. That was very good. I said thank you.'),
        N('The doll says nothing.'),
        MM('When somebody thanks you, you answer them. Were you never taught?', 'angry'),
        N(
          'She slaps the doll with one hand, and the hand sticks. She slaps it with the other, and that sticks too.',
        ),
        MM('Let go of me! Let go!', 'shock'),
        N('Ananse is out from behind his root and halfway up the path already.'),
        AN('Rope! Stay there, both of you. I will fetch rope!', 'happy'),
      ],
      [
        ask(
          6,
          'sel',
          'why an answer to thanks matters',
          'CASEL: Social awareness',
          [
            N(
              'The doll does not answer Mmoatia’s thank-you. Why might that hurt someone’s feelings?',
            ),
          ],
          [
            o(
              'It feels like being ignored, and an answer shows we heard.',
              [
                N('Yes. A reply, even a small one, says, “I noticed you.”'),
                N('That is why people say “you are welcome”.'),
              ],
              true,
            ),
            o('Thank-yous do not matter much.', [
              N('A thank-you is a small gift. Not answering it can feel unkind.'),
              N('An answer shows we heard.'),
            ]),
            o('The doll was being rude on purpose.', [
              N('It is only a doll, with no feelings or plans.'),
              N(
                'But for Mmoatia, being ignored feels rude, and an answer would have shown she was heard.',
              ),
            ]),
          ],
          'Thought about why answering a thank-you matters to the person who gave it.',
        ),
      ],
    ),
    sc(
      'a28-06-fairy-done',
      [
        N('Then he is gone. The fairy pulls, and the doll leans, and nothing comes apart.'),
        N(
          'It is ten past six, and the light is going. Ananse is gone for thirty-five minutes, looking for rope in no hurry at all.',
        ),
        N(
          'She stops, and breathes. She looks straight at your root, as if she has known you were there all along.',
        ),
      ],
      [
        ask(
          1,
          'maths',
          'time intervals: 6:10 plus 35 minutes',
          '3.MD.A.1',
          [
            N(
              'Ananse leaves at ten past six and is gone for 35 minutes. What time does he come back?',
            ),
          ],
          [
            o('6:45', [N('Yes. 6:10 plus 30 minutes is 6:40, and 5 more minutes is 6:45.')], true),
            o('6:35', [
              N('That adds 35 to the minutes, but it forgets the 10 already on the clock.'),
              N('6:10 + 35 minutes = 6:45.'),
            ]),
            o('7:05', [
              N('That is too much. 35 minutes is less than an hour.'),
              N('6:10 + 35 minutes = 6:45.'),
            ]),
          ],
          'Added a time interval of 35 minutes to a start time of 6:10.',
        ),
      ],
    ),
    sc(
      'a28-06-wait',
      [
        N(
          'It is nearly dark under the odum tree. Far off, a spider is looking for rope and not hurrying.',
        ),
        MM('You. You are with him.', 'angry'),
        N(
          'She is not crying. She has gone very still, the way small wild things go still when they are caught and thinking.',
        ),
        MM('He will take me up to the Sky-god. That is what this is.'),
        N('Her hands are fixed to the doll’s chest, side by side. The gum shines.'),
        N('Gum is tree sap, which a tree makes to seal its cuts.'),
        N(
          'Your Nubbin looks at her, and at you, and at its own paw, which has been stuck to things all day.',
        ),
      ],
      [
        ask(
          6,
          'science',
          'why a tree makes sticky sap: it seals cuts',
          undefined,
          [N('The gum on the doll is tree sap. Why does a tree make sticky sap?')],
          [
            o(
              'To seal a cut in its bark, like a plaster.',
              [
                N('Yes. Sticky sap seals a cut, so the tree can heal.'),
                N('A hard crust of sap keeps the cut clean.'),
              ],
              true,
            ),
            o('To catch passing travellers.', [
              N('Sap is not a trap. It only sticks to whatever walks into it.'),
              N('A tree makes sap to seal its cuts.'),
            ]),
            o('To hold its leaves on.', [
              N('Leaves hang on by their stalks.'),
              N('A tree makes sap to seal its cuts.'),
            ]),
          ],
          'Learned that a tree makes sticky sap to seal cuts in its bark.',
        ),
      ],
      [
        ch(
          'freed',
          'Work one of her hands free.',
          [
            N(
              'You work the gum loose with your thumbs, slowly. One small hand comes free; the other stays fast.',
            ),
            MM('One? Only one?', 'think'),
            Y('The other has to stay. It is his story. But you can have that one back.'),
            N(
              'She flexes her free hand, opening and closing it, and looks at you for a long time.',
            ),
          ],
          { 'a28-fairy': 'freed' },
        ),
        ch(
          'left',
          'Leave her be.',
          [
            N('You stay by your root. It is not your story to change, and you know it.'),
            MM('Of course. He has helpers.', 'sad'),
            N('She turns her face away and waits for the rope, with her chin up.'),
          ],
          { 'a28-fairy': 'left' },
        ),
        ch(
          'sat',
          'Sit down beside her, say nothing, and wait.',
          [
            N(
              'You sit down beside her in the leaves, and say nothing. Your Nubbin sits on her other side.',
            ),
            N('She glares at you both. After a while she stops glaring.'),
            N('When the frogs start up, she leans, very slightly, against your arm.'),
          ],
          { 'a28-fairy': 'sat' },
        ),
      ],
    ),
    sc(
      'a28-06-wait-done',
      [
        N(
          'Ananse comes back at last with an armful of rope, puffing and very pleased with himself.',
        ),
        AN('Four! Four, and my mother makes five! Who has ever done such a thing?', 'happy'),
        N(
          'Each trap used the weakness of the one it caught: the python’s pride, the hornets’ need for shelter, the leopard’s hope for help, and the fairy’s temper.',
        ),
      ],
      [
        ask(
          2,
          'literacy',
          'a character’s weakness: motive and traits',
          'RL.3.3',
          [N('Each of Ananse’s traps used a weakness. What was Mmoatia’s?')],
          [
            o(
              'Her temper when the doll did not answer her.',
              [
                N('Yes. She slapped the doll in anger, and that is what stuck her.'),
                N('A character’s traits often decide what happens to them.'),
              ],
              true,
            ),
            o('Her love of rope.', [
              N('Mmoatia never wanted rope. Rope was Ananse’s idea.'),
              N('Her temper, when the doll did not answer, was her weakness.'),
            ]),
            o('Her fear of yam.', [
              N('She loved the yam, and ate every bit.'),
              N('Her temper, when the doll did not answer, was her weakness.'),
            ]),
          ],
          'Identified how a character’s temper led to the trap, and linked traits to events.',
        ),
        ask(
          2,
          'sel',
          'helping, leaving or sitting: a think question',
          'CASEL: Responsible decision-making',
          [
            N(
              'You chose how to treat Mmoatia while she was caught. Which help was kindest?',
            ),
          ],
          [
            o('Helping her, because kindness should not wait for permission from the story.', [
              N('That is a fair answer. Many people would feel the same.'),
              N('Notice, though, that her story still holds. Help can be partial.'),
            ]),
            o('Leaving her be, because it is not your story to change.', [
              N('That is a fair answer. Some people think a story belongs to those inside it.'),
              N('You might ask Mmoatia whether she agrees.'),
            ]),
            o('Sitting with her. You cannot fix it, but you can keep her company.', [
              N('That is a fair answer. Being there can matter even when you cannot fix a thing.'),
              N('It is a quieter kind of help.'),
            ]),
          ],
          'Thought about what kindness looks like when you cannot change what happens, and weighed three choices.',
        ),
      ],
    ),
    sc(
      'a28-06-complete',
      [
        N('Ananse ties the fairy, doll and all, and even he is careful about it.'),
        N(
          'She goes up the thread with her chin high. A fairy can be caught; she does not have to be humble about it.',
        ),
        AN('Tomorrow, the court. Wash. You are covered in gum.'),
        N(
          'Your Nubbin, specifically, is stuck to the yam bowl. You carry them both home, and it seems perfectly content.',
        ),
        N('Yam is a staple food across West Africa. It grows underground.'),
      ],
      [
        ask(
          4,
          'science',
          'a tuber stores food underground',
          '4-LS1-1',
          [N('A yam is a tuber. What is a tuber?')],
          [
            o(
              'A thick underground stem that stores food for the plant.',
              [
                N('Yes. The plant stores food in the tuber, and people eat it too.'),
                N('Potatoes are tubers too, storing food underground in the same way.'),
              ],
              true,
            ),
            o('A kind of seed.', [
              N('Seeds grow in flowers or fruit. A tuber is a swollen underground part.'),
              N('It stores food for the plant.'),
            ]),
            o('The highest branch of a tree.', [
              N('Branches grow up in the air. A tuber is underground.'),
              N('It stores food for the plant.'),
            ]),
          ],
          'Learned that a yam is a tuber, an underground store of food for a plant.',
        ),
      ],
    ),
  ],
  [
    gl('symmetry', 'When one side of a shape is a mirror image of the other.', 'a28-06-doll'),
    gl('sap', 'The sticky liquid inside a tree that carries water and food.', 'a28-06-doll-done'),
    gl('tuber', 'A thick underground part of a plant that stores food.', 'a28-06-complete'),
  ],
);

// ================================================================== A28-7 Spider Stories
const A7: EduQuest = quest(
  'a28-07',
  'Spider Stories',
  {
    'a28-07-s1': {
      goal: 'Walk with Ananse’s mother to the Sky-god’s court.',
      hint: 'Find Ya Nsia at Ananse’s door and go up the thread with her.',
    },
    'a28-07-s2': {
      goal: 'Stand in the Sky-god’s court while Ananse pays the price.',
      hint: 'Take your place among the elders, a step behind Ananse.',
    },
  },
  [
    sc(
      'a28-07-mother',
      [
        N(
          'Ananse’s mother is waiting at his door, small and upright, in her good cloth, with a bundle on her knee.',
        ),
        YA('Kwaku. You told them I was included.', 'think'),
        AN('As an honoured guest, Mother! The best stools in the sky!', 'happy'),
        YA('Mm. Your father used to promise me stools.'),
        N(
          'She gets up, and takes your arm, not his. Your Nubbin carries her bundle, which is mostly snacks.',
        ),
        YA('He was always like this. Even in the egg. He would have sold the shell.'),
      ],
      [
        ask(
          5,
          'sel',
          'reading a character from how she reacts: a think question',
          'CASEL: Social awareness',
          [
            N(
              'Ananse offered his own mother as part of the price, though as a guest of honour. Ya Nsia takes it calmly. What does her calm tell you about her, and about Ananse?',
            ),
          ],
          [
            o('She knows him well and has stopped being surprised.', [
              N('That is a fair answer. Her dry jokes suggest a lifetime of practice.'),
              N('It tells us Ananse has always been like this.'),
            ]),
            o('She trusts the Sky-god to treat her well.', [
              N('That is a fair answer. The court is known for keeping its word.'),
              N('It also tells us how serious Nyame’s honour is.'),
            ]),
            o('She loves him, even though he can be awful.', [
              N('That is a fair answer. People can love someone and still see their faults.'),
              N('She teases him, but she walks beside him.'),
            ]),
          ],
          'Thought about what a character’s calm reaction tells us about her and about the one who offended her.',
        ),
      ],
      [
        ch('proud', 'Tell her she must be proud of him.', [
          YA('Proud. Tired. It is the same face, with a spider.', 'happy'),
        ]),
        ch('arm', 'Just give her your arm, and walk.', [
          N('She pats your hand twice, the way you pat a horse that has been sensible.'),
        ]),
      ],
    ),
    sc(
      'a28-07-mother-done',
      [
        N(
          'Up you go, all of you, the old lady first, the bundle second, and Ananse last, rehearsing.',
        ),
        N(
          'Ya Nsia climbs four metres every minute. The thread to the court is a hundred metres tall.',
        ),
      ],
      [
        ask(
          1,
          'maths',
          'division: 100 metres at 4 metres a minute',
          '3.OA.A.3',
          [
            N(
              'Ya Nsia climbs 4 metres each minute, up a thread 100 metres tall. How many minutes does it take?',
            ),
          ],
          [
            o(
              '25',
              [N('Yes. 100 ÷ 4 = 25 minutes.'), N('You can check it backwards: 25 × 4 = 100.')],
              true,
            ),
            o('20', [N('20 × 4 is only 80. We need 100.'), N('100 ÷ 4 = 25 minutes.')]),
            o('40', [N('That is far too many. 40 × 4 would be 160.'), N('100 ÷ 4 = 25 minutes.')]),
          ],
          'Divided a distance by a speed to find a time, and checked with multiplication.',
        ),
      ],
    ),
    sc(
      'a28-07-court',
      [
        N(
          'The elders are all there, on their carved stools, and the light at the end of the court is very bright today.',
        ),
        N(
          'In Akan culture a carved stool is more than a seat. It is a place of honour, and a chief’s stool stands for his people.',
        ),
        N(
          'Ananse lays the price on the cloud, one piece at a time: the python, the gourd of hornets, the leopard, the fairy.',
        ),
        ON('I am still longer than that branch.', 'angry'),
        OS('Spider. I have not forgotten.', 'angry'),
        AN('And my mother, Ya Nsia, great one.', 'happy'),
        YA('Good afternoon. These are very good stools.', 'happy'),
        N('Nobody says anything for a while. One of the elders is smiling at the floor.'),
        NY('Kings came to buy my stories, and great towns. They could not pay.'),
        NY(
          'Kwaku Ananse has paid. From today the stories are his, and they will be called by his name.',
        ),
        N(
          'The elders stand. Ananse takes his hat off and holds it to his chest, and for once he does not say anything at all.',
        ),
      ],
      [
        ask(
          1,
          'social-studies',
          'why stools matter in Akan culture',
          'D2.His.2.3-5',
          [N('Why is a carved stool so important in Akan culture?')],
          [
            o(
              'It is a seat of honour, and a chief’s stool stands for his people.',
              [
                N(
                  'Yes. In Asante, the Golden Stool is the most sacred symbol of the whole nation.',
                ),
                N('A stool is kept with care, and not sat on by just anybody.'),
              ],
              true,
            ),
            o('It is the cheapest kind of chair.', [
              N('Stools can be carved beautifully, and some are priceless.'),
              N(
                'They matter because they are a seat of honour for a chief and a symbol of his people.',
              ),
            ]),
            o('It is only used for storytelling.', [
              N('Storytellers do sit on stools, but stools matter far beyond that.'),
              N('They are a seat of honour for a chief and a symbol of his people.'),
            ]),
          ],
          'Learned that in Akan culture a carved stool is a seat of honour and a symbol of a chief and his people.',
        ),
      ],
      [
        ch('bow', 'Bow, as the elders do.', [
          N('You bow. Your Nubbin bows too, too low, and has to be helped up off the cloud.'),
        ]),
        ch('clap', 'Clap, before you can stop yourself.', [
          N('You are the only one. Then an elder claps, and another, and the court fills with it.'),
        ]),
      ],
    ),
    sc(
      'a28-07-court-done',
      [
        NY('Ya Nsia will stay with us, as our guest. She will want for nothing.'),
        YA('I will want for the snacks, if the small one gives them back.', 'happy'),
        N(
          'The tales get a name: Anansesem. “Ananse” is the spider, and “sem” is the Twi word for a story or a matter.',
        ),
      ],
      [
        ask(
          2,
          'literacy',
          'a compound word: Anansesem',
          'L.3.4',
          [N('Anansesem joins “Ananse” and “sem”, which means story. What does Anansesem mean?')],
          [
            o(
              'Spider stories.',
              [
                N('Yes. Ananse is the spider, sem is story, and together they are spider stories.'),
                N('Anansesem are still told today, whether or not the spider is in them.'),
              ],
              true,
            ),
            o('Spider’s house.', [
              N('The first part is the spider. But “sem” is not house.'),
              N('It means story, so Anansesem are spider stories.'),
            ]),
            o('A very long thread.', [
              N('That would be a good name for the silk, but no.'),
              N('Anansesem means spider stories.'),
            ]),
          ],
          'Worked out the meaning of a compound word from its two parts: Ananse + sem, spider stories.',
        ),
      ],
    ),
    sc(
      'a28-07-complete',
      [
        N(
          'At the edge of the court the elders hand Ananse a carved box. It is heavy, and something inside it is talking.',
        ),
        N(
          'The python is given a long warm shelf, the leopard a shady corner. The hornets are let out into a garden in the sky.',
        ),
        N(
          'Mmoatia, you notice, does not stay at court long. Fairies are hard to keep, even for a Sky-god who keeps his word.',
        ),
        YA('Here. For the small one. It got stuck to more of this business than anybody.', 'soft'),
        N(
          'She drapes something over your Nubbin: a shawl of spider silk, soft as breath, and only a very little sticky.',
        ),
        N(
          'By the time you reach the thread, your Nubbin is wearing three leaves, a feather and somebody’s bean. Ya Nsia looks pleased with her work.',
        ),
      ],
      [
        ask(
          1,
          'science',
          'reptiles need outside warmth',
          '4-LS1-1',
          [N('The python gets a warm shelf. Why do pythons and other reptiles need warm places?')],
          [
            o(
              'They cannot make their own body heat, so they warm up from the sun or warm surfaces.',
              [
                N('Yes. Reptiles take their warmth from their surroundings.'),
                N('That is why you often see lizards and snakes basking in the sun.'),
              ],
              true,
            ),
            o('They are afraid of the dark.', [
              N('It is not about fear. It is about body heat.'),
              N('Reptiles cannot make their own, so they warm up from the sun or warm surfaces.'),
            ]),
            o('They prefer soft beds.', [
              N('Comfort is nice, but heat is what matters.'),
              N('Reptiles cannot make their own body heat, so they need a warm place.'),
            ]),
          ],
          'Learned that reptiles warm up from their surroundings because they cannot make their own body heat.',
        ),
      ],
    ),
  ],
  [
    gl(
      'Anansesem',
      'The spider stories of the Akan people, still told today.',
      'a28-07-court-done',
    ),
  ],
);

// ================================================================== A28-8 The Box Opens
const A8: EduQuest = quest(
  'a28-08',
  'The Box Opens',
  {
    'a28-08-s1': {
      goal: 'Help Ananse carry the box of stories home.',
      hint: 'Take one end of the box and go down the thread with Ananse.',
    },
    'a28-08-s2': {
      goal: 'Watch what happens when Ananse lifts the lid, just a little.',
      hint: 'Stay on the step with Ananse.',
    },
    'a28-08-s3': {
      goal: 'See whether Ananse pays what he owes.',
      hint: 'Stay by the empty box on Ananse’s step.',
    },
  },
  [
    sc(
      'a28-08-carry',
      [
        N(
          'The box is heavier than it looks. It is warm, like bread, and it hums with a hundred small voices.',
        ),
        AN('Careful. Careful! That is every story in the world you are holding by the corner.'),
        N(
          'The box weighs twelve kilograms. You take one end and Ananse takes the other, and you share the load equally.',
        ),
        N('Your Nubbin presses its ear to the lid and goes cross-eyed with listening.'),
        AN(
          'Mine. All of them. Spider stories, the Sky-god said. My name on every single one.',
          'happy',
        ),
      ],
      [
        ask(
          2,
          'maths',
          'sharing equally: 12 ÷ 2',
          '3.OA.A.3',
          [
            N(
              'The box weighs 12 kilograms, and two carriers share it equally. How many kilograms does each carry?',
            ),
          ],
          [
            o('6', [N('Yes. 12 ÷ 2 = 6 kilograms each.')], true),
            o('12', [
              N('That is the whole weight. Two carriers share it.'),
              N('12 ÷ 2 = 6 kilograms each.'),
            ]),
            o('24', [
              N('That would be double. Sharing makes each share smaller, not bigger.'),
              N('12 ÷ 2 = 6 kilograms each.'),
            ]),
          ],
          'Divided a weight equally between two carriers.',
        ),
      ],
    ),
    sc(
      'a28-08-carry-done',
      [
        N(
          'At his door he sets it down on the step and sits beside it, with his hat pushed back, looking at it.',
        ),
        AN('I am not going to open it. I just want to look at it.'),
        N(
          'He looks at it for a long time. Then he looks at you, as if you might have opinions about lids.',
        ),
      ],
      [
        ask(
          2,
          'sel',
          'waiting when you want something badly',
          'CASEL: Self-management',
          [
            N(
              'Ananse says he will only look, but he badly wants to open the box. What helps when you want something and need to wait?',
            ),
          ],
          [
            o(
              'Take a breath, do something else, and remember why you are waiting.',
              [
                N('Yes. Slow breaths and a distraction give your brain time to catch up.'),
                N('Remembering the reason helps you stay patient.'),
              ],
              true,
            ),
            o('Open it quickly, before you change your mind.', [
              N('That is how many things get spilled. Waiting needs a plan.'),
              N('Breathing and doing something else can help.'),
            ]),
            o('Pretend you do not want it.', [
              N('Pretending may work for a moment, but the wanting is still there.'),
              N('It is better to breathe, distract yourself, and remember why you wait.'),
            ]),
          ],
          'Talked about strategies for waiting: breathing, distraction and remembering the reason.',
        ),
      ],
    ),
    sc(
      'a28-08-open',
      [
        AN('Just a peep. One story. A little one, to see they are all there.'),
        N('He lifts the lid a finger’s width.'),
        N(
          'Out comes a story, bright as a bird, and then another, and then all of them at once, in a rush of wings.',
        ),
        AN('No! No, no, come back! You are mine!', 'shock'),
        N(
          'They go over the trees and over the hills and away over the sea, every way at once, to every place there is.',
        ),
        N(
          'For a moment your Nubbin has one by the tail, very small and wriggly. It lets go, and the story flies off.',
        ),
      ],
      [
        ask(
          5,
          'literacy',
          'how stories change as they travel: a think question',
          'RL.4.2',
          [
            N(
              'Stories that travel by voice change a little with each teller. If a story passes through a thousand mouths, how much of it do you think stays the same?',
            ),
          ],
          [
            o('The main idea stays, and the details change.', [
              N('That is a fair answer. A hero, a trick and a lesson can last for centuries.'),
              N('The details bend to suit each teller and each audience.'),
            ]),
            o('Very little. It would be a different story.', [
              N('That is a fair answer. A story can change so much that it becomes new.'),
              N('You might ask whether it is still the same story if it keeps its name.'),
            ]),
            o('It stays the same, because tellers try to be careful.', [
              N('That is a fair answer. Many tellers work hard to keep a story as they heard it.'),
              N('Even so, small changes tend to creep in.'),
            ]),
          ],
          'Thought about how stories change as they are passed from one teller to the next.',
        ),
      ],
      [
        ch('sorry', 'Tell Ananse you’re sorry.', [
          AN('Sorry? Why? They are still mine. Whoever tells them. That was the deal.', 'think'),
        ]),
        ch('watch', 'Watch them go, all the way to the edge of the sky.', [
          N(
            'You watch until the last one is only a glint. It seems the right thing to do with stories.',
          ),
        ]),
      ],
    ),
    sc(
      'a28-08-open-done',
      [
        AN('Everywhere. Everyone will be telling them now. Badly, mostly.', 'happy'),
        N(
          'Some of the stories cross all of Africa and then the Atlantic Ocean, to the islands of the Caribbean, where Jamaica lies.',
        ),
      ],
      [
        ask(
          1,
          'social-studies',
          'the Atlantic lies between Ghana and the Caribbean',
          'D2.Geo.2.3-5',
          [N('To reach Jamaica from Ghana, the stories have to cross which ocean?')],
          [
            o(
              'The Atlantic.',
              [
                N('Yes. Ghana is on the Atlantic coast of Africa.'),
                N('Jamaica is an island in the Caribbean Sea, which is part of the Atlantic.'),
              ],
              true,
            ),
            o('The Pacific.', [
              N('The Pacific is on the other side of the Americas.'),
              N('The Atlantic lies between Africa and the Caribbean.'),
            ]),
            o('The Indian Ocean.', [
              N('The Indian Ocean is to the east of Africa.'),
              N('The Atlantic lies between Africa and the Caribbean.'),
            ]),
          ],
          'Identified the Atlantic as the ocean between Ghana and the Caribbean island of Jamaica.',
        ),
      ],
    ),
    sc(
      'a28-08-debt',
      [
        N(
          'Ananse sits by the empty box. Your Nubbin sits by Ananse, holding a buttercup it picked on the way down.',
        ),
        AN('What have you got there?', 'think'),
        N('Your Nubbin holds it out, to show him. It is a very good buttercup.'),
        AN(
          'I will trade you. One story, for that. An excellent price. Stories are scarce round here, suddenly.',
        ),
        N('Your Nubbin thinks about it with its whole face, and then hands it over.'),
        AN('Ahem. Here is your story.'),
        AN('“Ananse.”', 'happy'),
        N('That is the whole story. Your Nubbin waits for more, and there is not any.'),
        AN(
          'Well, they are all about me now, are they not? That is every story, really. Very concentrated.',
        ),
      ],
      [
        ask(
          7,
          'literacy',
          'what a story needs',
          'RL.3.3',
          [N('One word is not usually a story. What does a story usually need?')],
          [
            o(
              'A character, something that happens, and an ending.',
              [
                N('Yes. Characters, events and an ending are the bones of a story.'),
                N('Ananse’s one word has a character, but nothing happens.'),
              ],
              true,
            ),
            o('Only a title.', [
              N('A title is a name for a story, but it is not the story itself.'),
              N('A story needs a character, something that happens, and an ending.'),
            ]),
            o('A rhyme in every line.', [
              N('Some stories rhyme, but many do not.'),
              N('A story needs a character, something that happens, and an ending.'),
            ]),
          ],
          'Thought about what makes a story, using a one-word “story” as an example.',
        ),
      ],
      [
        ch('fair', 'Tell him that is not a story.', [
          AN(
            'It has a beginning, a middle and an end. They just happen to be the same word.',
            'happy',
          ),
        ]),
        ch('let', 'Let your Nubbin decide if it was fair.', [
          N(
            'Your Nubbin thinks, and nods. It seems to have enjoyed the story very much, because it was about someone.',
          ),
        ]),
      ],
    ),
    sc(
      'a28-08-debt-done',
      [
        N(
          'Ananse sits back against his door, looking very pleased with his side of the bargain. So, oddly, does everyone else.',
        ),
        N(
          'Buttercups grow thick round his step, with five bright yellow petals each. Flowers are bright and scented to attract insects.',
        ),
      ],
      [
        ask(
          1,
          'science',
          'why flowers are bright: pollination',
          undefined,
          [N('Why are flowers like buttercups so brightly coloured?')],
          [
            o(
              'To attract insects that carry pollen from flower to flower.',
              [
                N('Yes. Insects visit for food and carry pollen as they go.'),
                N('That pollen helps flowers make seeds. It is called pollination.'),
              ],
              true,
            ),
            o('To hide from bees.', [
              N('It is the opposite. Flowers want to be noticed by bees and other insects.'),
              N('Bright colours attract insects that carry pollen.'),
            ]),
            o('To look pretty for people.', [
              N('Flowers were bright long before people noticed them.'),
              N('Bright colours attract insects that carry pollen.'),
            ]),
          ],
          'Learned that flowers are bright to attract insects that carry pollen.',
        ),
      ],
    ),
    sc(
      'a28-08-complete',
      [
        N(
          'Evening comes down on Ananse’s house. The box sits on the step, empty, with its lid open.',
        ),
        AN(
          'You know what the best part is? I do not have to keep them now. Somebody else does the carrying.',
          'happy',
        ),
        N(
          'Very far off, through the trees, you hear the courtyard fire, and the old woman laughing at something.',
        ),
        AN('There. She is telling one. Mine.', 'soft'),
      ],
      [
        ask(
          3,
          'social-studies',
          'oral tradition',
          'D2.His.2.3-5',
          [
            N(
              'Before most people could read and write, how did stories pass from one generation to the next?',
            ),
          ],
          [
            o(
              'By being told aloud, over and over.',
              [
                N('Yes. This is called an oral tradition: stories kept alive by being told.'),
                N('Anansesem has travelled this way for hundreds of years.'),
              ],
              true,
            ),
            o('By being posted in letters.', [
              N('Letters need people who can read and write, and paper.'),
              N('Stories were passed on by being told aloud, in an oral tradition.'),
            ]),
            o('They did not pass on.', [
              N('Many have lasted for centuries, and are still told today.'),
              N('They were passed on by being told aloud, an oral tradition.'),
            ]),
          ],
          'Learned that oral traditions pass stories from generation to generation by telling them aloud.',
        ),
      ],
    ),
  ],
  [
    gl('pollen', 'A fine yellow dust made by flowers, needed to make seeds.', 'a28-08-debt-done'),
    gl(
      'oral tradition',
      'Stories, songs and history that are passed on by telling them aloud.',
      'a28-08-complete',
    ),
  ],
);

// ================================================================== A28-9 The Pot of Wisdom
const A9: EduQuest = quest(
  'a28-09',
  'The Pot of Wisdom',
  {
    'a28-09-s1': {
      goal: 'Hold the gourd pot while Ananse sweeps up all the wisdom in the world.',
      hint: 'Follow Ananse with the pot and keep it upright.',
    },
    'a28-09-s2': {
      goal: 'Watch Ananse try to climb with the pot.',
      hint: 'Stand at the foot of the tall tree.',
    },
    'a28-09-s3': {
      goal: 'See what Ananse does with all that wisdom now.',
      hint: 'Stay under the tall tree, and hold out your hands.',
    },
  },
  [
    sc(
      'a28-09-sweep',
      [
        N(
          'The forest flickers, and for a moment you are back in the courtyard: the fire, the faces, the old woman leaning forward.',
        ),
        ST('Long ago, they say, there was a spider called Kwaku Ananse,'),
        ST(
          'and one day he swept up all the wisdom in the world, every scrap of it, and put it in a pot.',
        ),
        N(
          'The courtyard fades. You are in the forest again, holding a gourd pot, and Ananse is sweeping.',
        ),
        N(
          'He sweeps under stones, out of birds’ nests and off the tops of sleeping heads. Wisdom looks like bright dust.',
        ),
        AN(
          'Mine. All of it. Nobody else will ever know anything again, unless they ask me very nicely.',
          'happy',
        ),
        N('Your Nubbin gets swept up with a pile of it. Ananse tips it back out.'),
        AN('Not you. You are not wisdom. You are luggage.'),
      ],
      [
        ask(
          2,
          'literacy',
          'the job of a traditional story opening',
          undefined,
          [
            N(
              'Storytellers often begin with a set phrase, like “Long ago, they say…”. What does an opening like that do?',
            ),
          ],
          [
            o(
              'It tells listeners a story is starting, and that it has been passed down.',
              [
                N('Yes. It is like a doorway into the tale.'),
                N('“They say” reminds us that the story belongs to many tellers, not just one.'),
              ],
              true,
            ),
            o('It tells listeners that the story is true news.', [
              N('The opposite. A story opening says, “this is a tale”, not “this is news”.'),
              N('It tells listeners a story is starting, and that it has been passed down.'),
            ]),
            o('It tells them when to go home.', [
              N('It does the reverse. It says, “settle in, the story is starting”.'),
            ]),
          ],
          'Noticed how a traditional opening phrase signals the start of a story handed down by many tellers.',
        ),
      ],
    ),
    sc(
      'a28-09-sweep-done',
      [
        AN(
          'Seven handfuls from the stones, nine from the nests, and ten off the sleeping heads. Mine!',
          'happy',
        ),
        AN(
          'Now I will hang it all at the top of the tallest tree, where nobody can reach it but me.',
        ),
      ],
      [
        ask(
          0,
          'maths',
          'adding three numbers within 100',
          '3.OA.D.8',
          [
            N(
              'Ananse swept 7 handfuls from stones, 9 from nests and 10 off sleeping heads. How many in all?',
            ),
          ],
          [
            o(
              '26',
              [
                N('Yes. 7 + 9 = 16, and 16 + 10 = 26 handfuls.'),
                N('Adding in two steps makes it easier.'),
              ],
              true,
            ),
            o('16', [
              N('That is 7 + 9, and it leaves out the ten from the sleeping heads.'),
              N('7 + 9 + 10 = 26.'),
            ]),
            o('36', [N('That is ten too many. 7 + 9 = 16, and 16 + 10 = 26.')]),
          ],
          'Added three numbers within 100 in two steps.',
        ),
      ],
    ),
    sc(
      'a28-09-tree',
      [
        N('He ties the pot in front of him, under his chin, and starts up the trunk.'),
        N(
          'The pot bumps the bark, and he slides down. He tries again, and it bumps again, and he slides again.',
        ),
        AN('This tree is very badly made.', 'angry'),
        N(
          'A small spider has come out of the bushes to watch. He has his father’s face, without the trouble in it.',
        ),
        N('It is Ntikuma, Ananse’s son. He watches three more tries, and then he speaks up.'),
        NT('Father, tie the pot to your back, not your front.'),
        NT('Then your legs will be free, and you can climb.'),
        N('Ananse stops, halfway up the trunk.'),
        AN('Be quiet, boy. Take your clever ideas somewhere else!', 'angry'),
        N('But he looks down at the pot, and at his own back, and at his son.'),
      ],
      [
        ask(
          9,
          'sel',
          'taking advice from someone younger: a think question',
          'CASEL: Self-awareness',
          [
            N(
              'Ananse is cross when his small son corrects him, but then he looks at the pot and at his back. Why can it be hard to take advice from someone younger? What would you do?',
            ),
          ],
          [
            o('It hurts our pride to be wrong, so we get cross first.', [
              N('That is a fair answer. Pride often speaks before thinking does.'),
              N('Ananse’s next look shows that thinking arrives a moment later.'),
            ]),
            o('We expect wisdom to come from bigger or older people.', [
              N('That is a fair answer. But good ideas have no age.'),
              N('Ntikuma saw something because he was watching, not because he was grown.'),
            ]),
            o('I would listen at once and say thank you.', [
              N('That is a fair answer. It is a hard thing to do, and a kind one.'),
              N('Ananse takes longer, but he gets there.'),
            ]),
          ],
          'Thought about why it is hard to take advice from someone younger, and how to respond well.',
        ),
      ],
      [
        ch('laugh', 'Try very hard not to laugh.', [
          N(
            'You succeed, just. Your Nubbin has its paws over its mouth, which is nearly the same thing.',
          ),
        ]),
        ch('nod', 'Give Ntikuma a small nod.', [
          N('Ntikuma nods back, very seriously. Two people who have each been right about a pot.'),
        ]),
      ],
    ),
    sc(
      'a28-09-scatter',
      [
        N('Ananse sits in a fork of the tree for a long while, with the pot in his lap.'),
        AN(
          'A small boy. A small boy knew a thing I did not. With all of it right here in my arms.',
          'sad',
        ),
        N(
          'He pulls the pot free of its cords and throws it down. Through the leaves comes the old woman’s voice, far away by the fire.',
        ),
        ST('The pot smashed, and the wisdom scattered, pitter-patter, everywhere!'),
        N(
          'Wisdom bursts across the forest like seed off a dandelion clock. It lands on everybody, some more and some less.',
        ),
        ST('And that is why there is a little wisdom everywhere, and nobody has all of it.'),
      ],
      [
        ask(
          4,
          'science',
          'how seeds travel',
          undefined,
          [N('Which of these is NOT a way that seeds travel?')],
          [
            o(
              'Walking on their own legs.',
              [
                N('Right. Seeds have no legs. They need help to travel.'),
                N(
                  'They ride the wind, like a dandelion’s fluffy parachute, or the water, or animals.',
                ),
              ],
              true,
            ),
            o('Carried by the wind.', [
              N(
                'That one is real. Dandelion seeds have a fluffy parachute that catches the breeze.',
              ),
              N('The one that does not happen is walking on their own legs.'),
            ]),
            o('Stuck in an animal’s fur, or eaten and dropped.', [
              N(
                'That one is real too. Burrs hitch a ride on fur, and eaten seeds are dropped elsewhere.',
              ),
              N('The one that does not happen is walking on their own legs.'),
            ]),
          ],
          'Learned that seeds travel by wind, water and animals, and cannot move by themselves.',
        ),
      ],
    ),
    sc(
      'a28-09-scatter-done',
      [
        N(
          'The pieces come down on the far side of the clearing, on the ants, the frogs and a very surprised goat.',
        ),
        N('None come your way. Your Nubbin holds out its paws anyway, just in case.'),
        N('They stay empty. It is not sorry it tried.'),
      ],
      [
        ask(
          2,
          'sel',
          'trying is worthwhile even without a prize',
          'CASEL: Self-management',
          [
            N(
              'Your Nubbin tried and got nothing, but it is not sorry it tried. What does that show?',
            ),
          ],
          [
            o(
              'Trying can be worth it even if you get no prize.',
              [
                N('Yes. Having a go is a good thing in itself.'),
                N('You can feel disappointed and still be glad you tried.'),
              ],
              true,
            ),
            o('It should never try again.', [
              N('Not at all. It is glad it tried.'),
              N('Trying can be worth it, even without a prize.'),
            ]),
            o('It did not really want any.', [
              N('Look at how hard it held out its paws. It wanted some.'),
              N('Trying can be worth it, even without a prize.'),
            ]),
          ],
          'Talked about how trying is worthwhile even when it does not bring a reward.',
        ),
      ],
    ),
    sc(
      'a28-09-complete',
      [
        N(
          'Ananse climbs down. Ntikuma is waiting at the bottom with the broken pot, and gives it back to him.',
        ),
        AN('I would have thought of the back. Eventually.', 'think'),
        N(
          'They walk home together, the big spider and the small one. Ananse keeps a leg on his son’s shoulder all the way.',
        ),
        N(
          'The pot lies in three pieces of the same size. You keep them. It still sparkles a little when it tips.',
        ),
      ],
      [
        ask(
          3,
          'maths',
          'unit fractions: one of three equal parts',
          '3.NF.A.1',
          [N('The pot is in three equal pieces. What fraction of the whole pot is each piece?')],
          [
            o(
              '1/3',
              [
                N('Yes. One of three equal parts is one third, written 1/3.'),
                N('Three of them together make the whole pot.'),
              ],
              true,
            ),
            o('1/2', [
              N('One half would mean two equal pieces.'),
              N('There are three, so each is one third, 1/3.'),
            ]),
            o('3/1', [
              N('That would be three whole pots.'),
              N('Each piece is one of three equal parts, 1/3.'),
            ]),
          ],
          'Named one of three equal parts as the fraction 1/3.',
        ),
      ],
    ),
  ],
  [
    gl(
      'dandelion clock',
      'The round, fluffy seed head of a dandelion that blows away in the wind.',
      'a28-09-scatter',
    ),
  ],
);

// ================================================================== A28-10 The Bald Head
const A10: EduQuest = quest(
  'a28-10',
  'The Bald Head',
  {
    'a28-10-s1': {
      goal: 'Go with Ananse and Aso to the funeral of Aso’s mother.',
      hint: 'Walk with them to the family house, where the drums are.',
    },
    'a28-10-s2': {
      goal: 'Keep an eye on Ananse. He is up to something.',
      hint: 'Follow Ananse when he slips round the back of the cooking fires.',
    },
    'a28-10-s3': {
      goal: 'Help Ananse look dignified.',
      hint: 'Stay close to Ananse in the crowd. It will not work, but try.',
    },
  },
  [
    sc(
      'a28-10-funeral',
      [
        N(
          'Aso’s mother has died, old and well loved, and the whole family has come to see her off.',
        ),
        N(
          'The yard is full: drums, cooking, cousins, children underfoot, and everybody talking about her at once.',
        ),
        AS('She would have hated the fuss. She would have counted every chair.', 'soft'),
        MO('Kwaku! Will you eat? There is enough here for the whole village.'),
        AN(
          'Eat? At my mother-in-law’s funeral? Never! I shall fast, out of respect, until it is all over.',
          'sad',
        ),
        N(
          'Aso looks at him, and so does everybody who knows him. The cousin shrugs and takes the bowl away.',
        ),
        AS('He has never fasted for anything in his life.'),
      ],
      [
        ask(
          1,
          'social-studies',
          'how communities gather to remember someone who has died',
          'D2.His.2.3-5',
          [
            N(
              'In Ghana, a funeral is often a big gathering of family and friends, with food, music and drumming. Why do communities gather this way?',
            ),
          ],
          [
            o(
              'To honour the person’s life and support the family together.',
              [
                N('Yes. Being together helps people grieve.'),
                N(
                  'The food, music and stories keep the person remembered, and sad feelings are shared.',
                ),
              ],
              true,
            ),
            o('Because they have nothing else to do.', [
              N('People often travel a long way to come. It matters a great deal to them.'),
              N('They gather to honour the person’s life and support the family.'),
            ]),
            o('To keep the news secret.', [
              N('It is the opposite. Everybody is told, and everybody comes.'),
              N('They gather to honour the person’s life and support the family.'),
            ]),
          ],
          'Learned that funerals in Ghana are often large gatherings that honour a life and support the family.',
        ),
      ],
      [
        ch('aso', 'Tell Aso you’re sorry about her mother.', [
          AS('Thank you. She was a hard woman, and fair. She would have liked you.', 'soft'),
        ]),
        ch('help', 'Help carry chairs for the guests.', [
          N(
            'You carry chairs. Your Nubbin carries a stool on its head and gets cheered by several aunties.',
          ),
        ]),
      ],
    ),
    sc(
      'a28-10-funeral-done',
      [
        N(
          'By noon the drums have been going for hours, deep and steady, and you can feel them in your chest.',
        ),
        N('Ananse is looking at every pot in the yard the way a dog looks at a gate.'),
      ],
      [
        ask(
          0,
          'science',
          'sound is made by vibration',
          '4-PS3-2',
          [N('Why does a drum make a sound when it is hit?')],
          [
            o(
              'The skin vibrates, and the vibration travels through the air to our ears.',
              [
                N('Yes. Hit it harder and the skin shakes more, so the sound is louder.'),
                N('That is why you can feel a big drum in your chest.'),
              ],
              true,
            ),
            o('The air inside it is hissing.', [
              N('The air inside helps the sound grow, but the shaking skin starts it.'),
              N('The skin vibrates, and the vibration travels through the air.'),
            ]),
            o('The wood is singing.', [
              N('The wood does vibrate a little, but the main source is the skin.'),
              N('The skin vibrates, and the vibration travels through the air.'),
            ]),
          ],
          'Learned that a drum makes sound when its skin vibrates, and that the vibration travels through the air.',
        ),
      ],
    ),
    sc(
      'a28-10-beans',
      [
        N(
          'Ananse slips round behind the cooking fires, where a pot of beans is bubbling, and looks both ways.',
        ),
        N('He does not see you. Or he does, and thinks you are furniture.'),
        N('He scoops a pawful of beans, hot from the pot, and has nowhere to put them.'),
        N('So he takes off his hat, drops them in, and puts his hat back on.'),
        AN('Ow. Ow. Ow ow ow.', 'shock'),
        N(
          'Just then a cousin comes round the corner, and Ananse stands up very straight, smiling, with steam coming out from under his hat.',
        ),
      ],
      [
        ask(
          5,
          'sel',
          'promises and trust: a think question',
          'CASEL: Responsible decision-making',
          [
            N(
              'Ananse swore to fast, then hid beans in his hat. Why do people break promises they made out loud? What happens to trust when they do?',
            ),
          ],
          [
            o('They want something so badly that the promise stops feeling real.', [
              N('That is a fair answer. Wanting can shout louder than a promise.'),
              N('The question is what you do when it does.'),
            ]),
            o('They forget that other people were listening.', [
              N('That is a fair answer. A promise says something to everyone who heard it.'),
              N('Aso heard it too, and she knows him well.'),
            ]),
            o('Trust gets smaller each time, and takes longer to grow back.', [
              N('That is a fair answer. Trust is easier to break than to mend.'),
              N('That is why people who keep small promises are trusted with big ones.'),
            ]),
          ],
          'Thought about why people break promises and how a broken promise affects trust.',
        ),
      ],
      [
        ch('warn', 'Whisper to Ananse to take the hat off.', [
          AN('Take it off? In front of people? With my dignity?', 'shock'),
        ]),
        ch('cover', 'Step in front of him, so the cousin can’t see.', [
          N('You try. Ananse is short, but the steam is tall.'),
        ]),
      ],
    ),
    sc(
      'a28-10-dance',
      [
        N(
          'The beans are very hot. Ananse begins to shake his head, gently at first, then not gently at all.',
        ),
        MO('Kwaku, what are you doing?', 'think'),
        AN(
          'A dance! A hat-shaking dance. It is done in my village at funerals. Very old. Very respectful.',
        ),
        N(
          'He shakes his head harder, and the hat shakes harder. The first round is two shakes, the second is four, and the third is six.',
        ),
        N(
          'Several small children join in, delighted. You fan him with a plantain leaf, which helps nobody.',
        ),
        AS('Kwaku. Stop.', 'angry'),
      ],
      [
        ask(
          3,
          'maths',
          'a number pattern with a rule',
          '4.OA.C.5',
          [
            N(
              'Ananse shakes his head 2 times, then 4, then 6. If the pattern keeps going, how many shakes in the fifth round?',
            ),
          ],
          [
            o(
              '10',
              [
                N('Yes. The rule is add 2 each round: 2, 4, 6, 8, 10.'),
                N('Finding the rule lets you jump ahead without counting every round.'),
              ],
              true,
            ),
            o('8', [
              N('That is the fourth round. 2, 4, 6, 8 are rounds one to four.'),
              N('The fifth round is 10.'),
            ]),
            o('12', [
              N('That is the sixth round. The rule is add 2: 2, 4, 6, 8, 10.'),
              N('So the fifth round is 10.'),
            ]),
          ],
          'Continued a number pattern by finding its rule (add 2 each time).',
        ),
      ],
    ),
    sc(
      'a28-10-dance-done',
      [
        N(
          'Then the hat comes off on its own, sailing up into the air, and the beans come down all over the yard.',
        ),
        N(
          'Every hair on Ananse’s head has been scorched clean away. There is a short silence, and then a very long laugh.',
        ),
        N('A few hairs are still drifting down, smoking politely.'),
        N('The hot beans heated his hat, and the hat heated his head.'),
      ],
      [
        ask(
          3,
          'science',
          'heat moves from hot to cooler',
          '4-PS3-2',
          [N('The hot beans made Ananse’s head hot. In which direction does heat move?')],
          [
            o(
              'From hotter things to cooler things.',
              [
                N('Yes. Heat always flows from a hotter thing to a cooler thing.'),
                N('That is why a hot drink cools down in a cold room.'),
              ],
              true,
            ),
            o('From cooler things to hotter things.', [
              N('Heat does not go that way by itself.'),
              N('It flows from hotter things to cooler things.'),
            ]),
            o('It stays where it is.', [
              N('Heat spreads out until things are the same warmth.'),
              N('It flows from hotter things to cooler things.'),
            ]),
          ],
          'Learned that heat flows from hotter things to cooler things.',
        ),
      ],
    ),
    sc(
      'a28-10-complete',
      [
        N(
          'Ananse runs into the long grass and hides there, hat in hand, for the rest of the afternoon.',
        ),
        AS('Serves him right. Mother would have laughed till she cried.', 'happy'),
        N(
          'The funeral goes on, warmer than before, and somebody tells the story of the beans before the drums have even stopped.',
        ),
        N(
          'And that is why the spider is bald to this day, and keeps to the grass when people look at him.',
        ),
      ],
      [
        ask(
          3,
          'literacy',
          'a “why” story: the pourquoi tale',
          'RL.4.2',
          [
            N(
              'This kind of story explains why something is the way it is. Which of these is a “why” story, a pourquoi tale?',
            ),
          ],
          [
            o(
              'Why the spider is bald.',
              [
                N('Yes. It explains how something came to be the way it is.'),
                N('Many cultures have stories that explain animals, weather and the stars.'),
              ],
              true,
            ),
            o('How to tie a knot.', [
              N('That is a set of instructions, not a story.'),
              N('A why story explains why something is the way it is.'),
            ]),
            o('A list of market prices.', [
              N('That is a list of facts.'),
              N('A why story explains why something is the way it is.'),
            ]),
          ],
          'Recognised a pourquoi tale as a story that explains why something is the way it is.',
        ),
      ],
    ),
  ],
  [
    gl(
      'fast',
      'To go without food, often for a reason such as respect or religion.',
      'a28-10-funeral',
    ),
    gl(
      'pourquoi tale',
      'A “why” story that explains how something in nature came to be as it is.',
      'a28-10-complete',
    ),
  ],
);

// ================================================================== A28-11 Across the Water
const A11: EduQuest = quest(
  'a28-11',
  'Across the Water',
  {
    'a28-11-s1': {
      goal: 'Follow the page as it turns, and see where the spider has gone.',
      hint: 'Turn the corner of the page when it lifts by itself.',
    },
    'a28-11-s2': {
      goal: 'Sit on the step and listen to the elder.',
      hint: 'Take the space the children have made for you.',
    },
    'a28-11-s3': {
      goal: 'Hear Miss Ivy’s way of telling the gum story.',
      hint: 'Stay on the step until the story is done.',
    },
  },
  [
    sc(
      'a28-11-yard',
      [
        N('The page lifts on its own, as if a wind has got under it, and turns.'),
        N(
          'It is night again, but a different night: warmer, louder with frogs, and the air tastes of the sea.',
        ),
        N(
          'A yard in Jamaica, with a breadfruit tree and a lamp on a nail. The house door is open, and a radio is talking quietly inside.',
        ),
        N(
          'On the front step sits an old woman with a cup of tea, and on the steps below her, a handful of children.',
        ),
        N(
          'It is years later, and a long way across the water. You can tell, the way you can tell in dreams.',
        ),
        N('Your Nubbin, without being asked, goes and sits on the bottom step with the children.'),
      ],
      [
        ask(
          2,
          'social-studies',
          'locating Jamaica',
          'D2.Geo.2.3-5',
          [N('Nova’s atlas says this yard is in Jamaica. Where is Jamaica?')],
          [
            o(
              'An island in the Caribbean Sea, south of Cuba.',
              [
                N('Yes. Jamaica is an island, and its capital is Kingston.'),
                N('It has warm weather all year, which fits the frogs and the breadfruit tree.'),
              ],
              true,
            ),
            o('A city in Ghana.', [
              N('Jamaica is far from Ghana, across the Atlantic Ocean.'),
              N('It is an island in the Caribbean Sea, south of Cuba.'),
            ]),
            o('A country in northern Europe.', [
              N('That would be much colder. Jamaica is warm.'),
              N('It is an island in the Caribbean Sea, south of Cuba.'),
            ]),
          ],
          'Located Jamaica as an island in the Caribbean Sea, and learned that Kingston is its capital.',
        ),
      ],
    ),
    sc(
      'a28-11-yard-done',
      [
        N(
          'One of the children budges up to make room for you, too. Nobody asks where you have come from.',
        ),
        N('The step is crowded and warm, and you fit.'),
      ],
      [
        ask(
          0,
          'sel',
          'making a stranger welcome',
          'CASEL: Social awareness',
          [
            N(
              'The children make room for you and do not ask questions. What does that tell you about them?',
            ),
          ],
          [
            o(
              'They are welcoming.',
              [
                N('Yes. Making room is a quiet way of saying, “You belong here.”'),
                N('You can do this too, with someone new at school.'),
              ],
              true,
            ),
            o('They have not noticed you.', [
              N('One child budged up on purpose. They noticed.'),
              N('They are being welcoming.'),
            ]),
            o('They are bored.', [
              N('They are eager for a story.'),
              N('They are being welcoming.'),
            ]),
          ],
          'Talked about how making room for someone new shows welcome.',
        ),
      ],
    ),
    sc(
      'a28-11-step',
      [
        YC('Miss Ivy. Tell an Anancy one. Please.'),
        EL('An Anancy one. Hm. Which one have I not told you yet?', 'think'),
        YC('You have told us all of them.'),
        EL('Then I will tell one again. That is what they are for.', 'happy'),
        N(
          'She puts her cup down. Before she starts, she says where he comes from, the way you would say where a cousin lives.',
        ),
        EL('Here we call him Anancy. Same spider. He came with people who were enslaved.'),
        EL(
          'They were taken by force from the Gold Coast, where Ghana is today, and brought across the sea.',
        ),
        EL('They kept him, because he was small and clever and never stayed caught.', 'soft'),
        N(
          'The children nod; they know. It is not a secret, and it is not the story: it is where the story stands.',
        ),
      ],
      [
        ask(
          7,
          'social-studies',
          'why stories mattered to people who were enslaved',
          'D2.His.2.3-5',
          [
            N(
              'Storytellers often say that enslaved people held on to Anancy because he was small but outwitted the strong. Why might that story matter so much to them?',
            ),
          ],
          [
            o(
              'It gave hope, and it kept their memories and culture alive.',
              [
                N('Yes. Stories are one thing nobody can take away.'),
                N('Keeping them alive kept a people’s memory and courage alive too.'),
              ],
              true,
            ),
            o('It was only for fun.', [
              N('It was often funny, and that mattered too.'),
              N('But it also gave hope, and kept their memories and culture alive.'),
            ]),
            o('It was the only story they knew.', [
              N('They knew a great many stories, songs and sayings.'),
              N('Anancy gave hope, and kept their memories and culture alive.'),
            ]),
          ],
          'Learned that stories such as Anancy’s gave hope to enslaved people and kept their culture alive.',
        ),
      ],
    ),
    sc(
      'a28-11-step-done',
      [
        EL('Now. Anancy, and the gum.', 'happy'),
        N('Out in the dark, the frogs have started up, one answering another across the yard.'),
      ],
      [
        ask(
          1,
          'science',
          'why frogs call at night',
          '4-LS1-2',
          [N('Why do frogs call out at night?')],
          [
            o(
              'Males call to attract mates and to warn other males away.',
              [
                N('Yes. Calling is how frogs communicate, and each kind has its own song.'),
                N('Frogs hear well, and a female listens for the right song.'),
              ],
              true,
            ),
            o('They are practising for school.', [
              N('Ha! Frogs do not go to school.'),
              N('The males call to attract mates and warn other males away.'),
            ]),
            o('They are afraid of the dark.', [
              N('Many frogs are active at night, and the dark suits them.'),
              N('The males call to attract mates and warn other males away.'),
            ]),
          ],
          'Learned that male frogs call at night to attract mates and keep rivals away.',
        ),
      ],
    ),
    sc(
      'a28-11-gum',
      [
        EL(
          'Anancy was stealing peas from a farmer’s field. Every night, a few more peas, and never a sound.',
        ),
        EL(
          'So the farmer made a little man out of wood, and covered him in gum, and stood him in the middle of the peas.',
        ),
        EL(
          'And Anancy came along in the dark, and said good evening, and the little man said nothing at all.',
        ),
        N(
          'The children are mouthing the next part along with her. Your Nubbin is mouthing too, without knowing the words.',
        ),
        EL(
          'So Anancy slapped him. And stuck. And slapped him with the other hand, and stuck again.',
        ),
        N('In her story it is the spider who gets caught. In yours, he did the catching.'),
      ],
      [
        ask(
          5,
          'literacy',
          'comparing two versions of a story',
          'RL.4.2',
          [N('Miss Ivy’s version and yours are different. What do the two versions share?')],
          [
            o(
              'A silent sticky figure, and a slap that leaves someone stuck.',
              [
                N('Yes. The shape of the tale is the same, even though the details are not.'),
                N('That is how a story can change as it travels and still be itself.'),
              ],
              true,
            ),
            o('The same hero and the same ending.', [
              N('In one the spider is caught, and in the other he does the catching.'),
              N('What they share is a silent sticky figure and a slap that leaves someone stuck.'),
            ]),
            o('Nothing at all.', [
              N('Look closer. A lot is the same.'),
              N('Both have a silent sticky figure and a slap that leaves someone stuck.'),
            ]),
          ],
          'Compared two tellings of one tale and named what they have in common.',
        ),
      ],
      [
        ch('tell', 'Tell her you heard it the other way round.', [
          EL('Did you now? Where?', 'think'),
          Y('A long way off. The spider made the doll, and a fairy got stuck.'),
          EL('Well. That one is right too. He gets about, that spider.', 'happy'),
        ]),
        ch('listen', 'Just listen to the end.', [
          EL('And how did he get loose? Same way as always. He talked.', 'happy'),
          N('The children cheer.'),
        ]),
      ],
    ),
    sc(
      'a28-11-gum-done',
      [
        N(
          'Your Nubbin looks at its paw, which has been stuck to something all the way through this story, and seems comforted.',
        ),
        N(
          'You count up its sticky moments today: silk three times, sap twice, gum four times, and the web once.',
        ),
      ],
      [
        ask(
          1,
          'maths',
          'adding four numbers within 100',
          '3.OA.D.8',
          [N('Silk 3, sap 2, gum 4, web 1. How many sticky moments altogether?')],
          [
            o('10', [N('Yes. 3 + 2 = 5, 5 + 4 = 9, and 9 + 1 = 10.')], true),
            o('9', [N('That leaves out the web. 3 + 2 + 4 = 9, and 9 + 1 = 10.')]),
            o('11', [N('That is one too many. 3 + 2 + 4 + 1 = 10.')]),
          ],
          'Added four numbers to find a total.',
        ),
      ],
    ),
    sc(
      'a28-11-complete',
      [
        N('The lamp on the nail hums. Somebody inside turns the radio off.'),
        EL(
          'There are a hundred ways to tell him. Every one of them is right, as long as he gets away at the end.',
          'soft',
        ),
        N('Two tellings of one story, on two sides of an ocean, and neither one is wrong.'),
        N('The page lifts again, and you feel it begin to turn back.'),
      ],
      [
        ask(
          2,
          'sel',
          'respecting different tellings: a think question',
          'CASEL: Social awareness',
          [
            N(
              'Two tellings of one story, an ocean apart, and neither is wrong. Can two different versions both be right? What would make one version wrong?',
            ),
          ],
          [
            o('Yes. A story belongs to every teller who keeps it alive.', [
              N('That is a fair answer. Tellers shape a story to fit their audience.'),
              N('Notice that Miss Ivy does not say yours is wrong.'),
            ]),
            o('Both can be right, but a version that hurts people would be wrong.', [
              N('That is a fair answer. A story can be changed, but there are limits.'),
              N('Who gets to decide where those limits are?'),
            ]),
            o('Only the oldest version can be right.', [
              N('That is a fair answer, and some people hold it.'),
              N('But tellers have always changed stories a little as they passed them on.'),
            ]),
          ],
          'Thought about whether two different versions of a story can both be right.',
        ),
      ],
    ),
  ],
  [
    gl(
      'breadfruit',
      'A tropical tree with large, round, starchy fruit that is cooked before eating.',
      'a28-11-yard',
    ),
    gl(
      'enslaved',
      'Made to work without pay or freedom, and treated as someone else’s property.',
      'a28-11-step',
    ),
    gl(
      'Gold Coast',
      'The name the British gave to the part of West Africa that is now Ghana.',
      'a28-11-step',
    ),
  ],
);

// ================================================================== A28-12 Take Some Elsewhere
const A12: EduQuest = quest(
  'a28-12',
  'Take Some Elsewhere',
  {
    'a28-12-s1': {
      goal: 'Come back to the courtyard fire.',
      hint: 'Let the page turn back, and find your mat by the fire.',
    },
    'a28-12-s2': {
      goal: 'Tell the courtyard a story of your own.',
      hint: 'Stand by the stool. You know which story it is.',
    },
    'a28-12-s3': {
      goal: 'Hear the storyteller’s last story of the night.',
      hint: 'Sit back down on your mat.',
    },
  },
  [
    sc(
      'a28-12-return',
      [
        N(
          'The page turns back. It is the courtyard again: the fire lower now, the children sleepier, the moths still at the wall.',
        ),
        N(
          'You are sitting on your mat, as if you never left it. Your Nubbin is beside you, sticky in three places.',
        ),
        ST('Again? You want another? It is late.', 'think'),
        ST(
          'Long ago, they say, there was a spider, and… no. No, I have told enough. Somebody else tells one now.',
          'happy',
        ),
        N('She turns on the stool and looks straight at you.'),
        ST('You. The one who has been away. Your turn.'),
        N('Your Nubbin climbs up on to the stool beside her, as if it has been invited too.'),
        N(
          'It sticks to the stool, and stays stuck for the rest of the night. Nana Ama tells the stories around it.',
        ),
      ],
      [
        ask(
          1,
          'science',
          'burning is a change that cannot be undone',
          undefined,
          [
            N(
              'Most of the logs have burned down to grey ash and glowing embers. Could the ash ever turn back into wood?',
            ),
          ],
          [
            o(
              'No. Burning changes wood into ash, smoke and heat, and it cannot be undone.',
              [
                N('Yes. Some changes, like melting ice, can be reversed. Burning cannot.'),
                N('The wood is gone for good, which is why the fire needs new logs.'),
              ],
              true,
            ),
            o('Yes, if you let the ash cool down.', [
              N('Cooling the ash leaves cold ash. It does not bring the wood back.'),
              N('Burning is a change that cannot be undone.'),
            ]),
            o('Yes, if you pour water on it.', [
              N('Water puts out the embers, but the ash stays ash.'),
              N('Burning is a change that cannot be undone.'),
            ]),
          ],
          'Learned that burning is a change that cannot be reversed, unlike melting or freezing.',
        ),
      ],
    ),
    sc(
      'a28-12-return-done',
      [
        N(
          'The children turn round on their mats to look at you. There are twenty-four of them, and every one of them is waiting.',
        ),
        N('Half of them are nearly asleep. The other half are wide awake.'),
        N('A boy at the front has fallen asleep with one hand still up, as if he knows the answer.'),
      ],
      [
        ask(
          2,
          'maths',
          'division: half of 24',
          '3.OA.A.3',
          [N('There are 24 children, and half are nearly asleep. How many are wide awake?')],
          [
            o(
              '12',
              [
                N('Yes. Half of 24 is 24 ÷ 2 = 12.'),
                N('There were six mats of four children at the start, and that is still 24.'),
              ],
              true,
            ),
            o('8', [N('That is a third of 24, not a half.'), N('24 ÷ 2 = 12.')]),
            o('24', [
              N('That is all of them. Half of them are asleep.'),
              N('24 ÷ 2 = 12 are awake.'),
            ]),
          ],
          'Found half of 24 by dividing by 2, and recalled the earlier total of 24 children.',
        ),
      ],
    ),
    sc(
      'a28-12-tell',
      [
        Y('This one is about a fairy, and a doll covered in gum.'),
        N(
          'You tell them about the odum tree, and the yam, and the thank-you that nobody answered.',
        ),
        N('You tell them how she stuck, both hands, and how the spider ran for rope.'),
        Y(
          'And while he was gone, somebody stayed by a root and did not help her. It was not their story to change.',
        ),
        Y(
          'So she waited for the rope with her chin up, and she went up to the sky caught. But she went up proud.',
        ),
        N(
          'The courtyard is quiet. A small boy at the front is frowning, which is the best sign there is.',
        ),
        ST('Hm. That one is a true one.', 'soft'),
        ST('Things get caught. That is how it is. I will keep a piece of that. The chin.'),
      ],
      [
        ask(
          5,
          'literacy',
          'the theme of a story',
          'RL.4.2',
          [N('What is the theme, the big idea, of the story you told?')],
          [
            o(
              'Being caught does not mean losing your dignity.',
              [
                N('Yes. The fairy goes up caught, but proud.'),
                N('A theme is the big idea underneath a story, not just what happens in it.'),
              ],
              true,
            ),
            o('Never eat yam.', [
              N('The yam is a detail, not the big idea.'),
              N('The theme is that being caught does not mean losing your dignity.'),
            ]),
            o('Spiders always win.', [
              N('In your story, the spider only ties the rope. The fairy keeps her chin up.'),
              N('The theme is that being caught does not mean losing your dignity.'),
            ]),
          ],
          'Identified the theme of a story as its big idea, not just its events.',
        ),
      ],
    ),
    sc(
      'a28-12-tell-done',
      [
        N('The storyteller tucks a piece of your story away to keep.'),
        N('The children whisper it to each other, changing it a little as they go.'),
      ],
      [
        ask(
          1,
          'sel',
          'what kind of story you would like to tell: a think question',
          'CASEL: Self-awareness',
          [
            N(
              'The storyteller calls a story “a clever one”, “a true one” or “a kind one”. Which kind would you most like to tell, and why?',
            ),
          ],
          [
            o('A clever one, because I like surprises and tricks.', [
              N('That is a fair answer. Clever stories keep listeners on their toes.'),
              N('Ananse would approve.'),
            ]),
            o('A true one, because it helps people understand.', [
              N('That is a fair answer. A true story can be the hardest to tell.'),
              N('Nana kept a piece of the true one.'),
            ]),
            o('A kind one, because it makes people feel safe.', [
              N('That is a fair answer. Kind stories can heal.'),
              N('Many of the best tales are all three at once.'),
            ]),
          ],
          'Reflected on what sort of story they would most like to tell, and why.',
        ),
      ],
    ),
    sc(
      'a28-12-last',
      [
        ST('One more. A short one. Mine, this time. I heard it from a spider.', 'happy'),
        ST('There was a small round one, who once paid a whole buttercup for a story.'),
        ST('And the story was one word long, and the word was the spider’s own name.'),
        N('Your Nubbin sits up very straight on the stool.'),
        ST('And the small round one thought it fair. And do you know? It was right.', 'soft'),
        ST('Because it was a story about someone. And that is all any of them are.'),
      ],
      [
        ask(
          5,
          'literacy',
          'why characters matter in a story',
          'RL.3.3',
          [
            N(
              'The storyteller says every story is about someone. Why are characters so important?',
            ),
          ],
          [
            o(
              'They give us someone to care about and follow.',
              [
                N('Yes. We keep reading to find out what happens to the people in it.'),
                N('Even a one-word story has someone to wonder about.'),
              ],
              true,
            ),
            o('They are the only part that rhymes.', [
              N('Many stories do not rhyme at all.'),
              N('Characters matter because they give us someone to care about.'),
            ]),
            o('They are not important.', [
              N('Try imagining a story with nobody in it.'),
              N('Characters give us someone to care about and follow.'),
            ]),
          ],
          'Thought about why characters are central to a story.',
        ),
      ],
    ),
    sc(
      'a28-12-last-done',
      [
        N(
          'For a moment nobody says anything. Then the children stretch, and yawn, and shuffle closer to the fire.',
        ),
        N('The fire crackles, and a handful of sparks rises into the dark, higher and higher.'),
      ],
      [
        ask(
          1,
          'science',
          'hot air rises',
          '4-PS3-2',
          [N('Why do sparks float up from a fire?')],
          [
            o(
              'Hot air is lighter, so it rises and carries the sparks.',
              [
                N('Yes. Warm air is less dense than cool air, so it floats upwards.'),
                N('That is why smoke rises too.'),
              ],
              true,
            ),
            o('The sparks are alive.', [
              N('They are tiny bits of burning wood.'),
              N('Hot air is lighter, so it rises and carries them.'),
            ]),
            o('The sky pulls them.', [
              N('The sky does not pull. Hot air pushes up.'),
              N('Hot air is lighter, so it rises and carries the sparks.'),
            ]),
          ],
          'Learned that hot air rises, which carries sparks and smoke upwards.',
        ),
      ],
    ),
    sc(
      'a28-12-complete',
      [
        N(
          'The old woman stands up from the stool, slowly, because she can. She says the last words, the ones that close the story.',
        ),
        ST(
          'That is my story. If you liked it, or if you did not, take a bit of it with you, and bring a bit back to me.',
        ),
        CH('Some come back!', 'happy'),
        N(
          'The fire sinks and the walls thin. The courtyard folds itself up into a page, warm under your hands.',
        ),
        N(
          'You are sitting in the Grove with Nova’s atlas open on your knees, and you have brought some of it away.',
        ),
        N(
          'By the cottage hearth sits a carved box you have never seen before. Its lid is closed, and something inside is humming.',
        ),
      ],
      [
        ask(
          2,
          'social-studies',
          'how a living tradition survives',
          'D2.His.2.3-5',
          [
            N(
              'Anansesem are still told in Ghana today, and Anancy stories in Jamaica. Why does a tradition like this survive?',
            ),
          ],
          [
            o(
              'Because people keep telling it to each new listener.',
              [
                N('Yes. A tradition is a custom handed down from person to person.'),
                N(
                  'It lives as long as somebody is willing to tell it and somebody is willing to listen.',
                ),
              ],
              true,
            ),
            o('Because it is locked in a museum.', [
              N('A museum can preserve an object, but a story needs voices.'),
              N('It survives because people keep telling it to new listeners.'),
            ]),
            o('Because nobody has ever changed it.', [
              N('Tellers have always changed it a little, and it has survived.'),
              N('It survives because people keep telling it to new listeners.'),
            ]),
          ],
          'Learned that a living tradition survives because people keep passing it on to new listeners.',
        ),
      ],
    ),
  ],
  [
    gl(
      'tradition',
      'A custom or story handed down from one generation to the next.',
      'a28-12-complete',
    ),
  ],
);

// ================================================================== Variant scenes
/**
 * One EduScene per ATLAS_A28_VARIANTS entry. Each has the same lesson domain as the scene it
 * replaces (the margin note is a feelings lesson), so the order of domains holds on every path.
 */
export const EDU_A28_READER_VARIANTS: EduScene[] = [
  // Hazel’s margin note (s24Done): plays straight after a28-01-complete
  sc(
    'a28-margin-hazel',
    [
      N(
        'In the margin beside the courtyard, in soft pencil you have never noticed before, there is a note. You know the hand.',
      ),
      N(
        '“Nova says here they tell you it isn’t true before they start. Best manners I ever heard of.”',
      ),
      N('Underneath, smaller, is a spider drawn in four quick lines, wearing a hat.'),
    ],
    [
      ask(
        1,
        'sel',
        'mixed feelings: a think question',
        'CASEL: Self-awareness',
        [
          N(
            'Finding a note in the handwriting of someone you love can bring more than one feeling. What might you feel?',
          ),
        ],
        [
          o('Warmth, because it feels as if they are near.', [
            N('That is a fair answer. A note can carry someone’s voice.'),
            N('Hazel’s humour is right there in the margin.'),
          ]),
          o('Sadness, because they are not here to say it.', [
            N('That is a fair answer. Missing someone is a way of loving them.'),
            N('It is all right to feel it.'),
          ]),
          o('Both at once.', [
            N('That is a fair answer. Feelings often come in pairs.'),
            N('Naming both can help you understand yourself.'),
          ]),
        ],
        'Thought about the mixed feelings that come from finding a note from someone loved, using Hazel’s margin note.',
      ),
    ],
  ),
  // wisp = spared | sable: replaces a28-02-road
  sc(
    'a28-02-road-wisp',
    [
      N(
        'At the foot of the thread your bag shifts. A grey head comes out of it, torn ear first, and looks at the forest with deep suspicion.',
      ),
      N(
        'It is Wisp, who would not be left at home. Nor would he leave the egg stone, and it is in his paws now.',
      ),
      AN('Hello. What is that?', 'think'),
      W('…mine.', 'soft'),
      AN('Of course it is yours. Lovely thing. Smooth. I would give you a story for it.', 'happy'),
      AN(
        'Not now, obviously. Once I own them, which will be very soon. A story, for the stone. Fair?',
      ),
      N(
        'Wisp hisses, long and low. Then he puts out one paw to shake, and keeps the stone tight in the other.',
      ),
      N('Ananse shakes it with one leg, and keeps three crossed behind his back.'),
      W('deal. …mine still.', 'soft'),
      AN(
        'Of course. Everything in its time. Kwaku is my name, by the way, a Wednesday name. Every Akan child has one.',
        'happy',
      ),
      AN('Friday boys are Kofi. Saturday, Kwame. Sunday, Kwesi. Wednesday is best, obviously.'),
      N('Your Nubbin, meanwhile, has sat down in a puddle of sap and stuck. Nobody is surprised.'),
    ],
    [
      ask(
        10,
        'social-studies',
        'Akan day names',
        'D2.His.2.3-5',
        [N('Kwaku is a Wednesday name. Which day gives a boy the name Kofi?')],
        [
          o(
            'Friday.',
            [
              N('Yes. Kofi is for Friday.'),
              N('Monday boys are Kwadwo, and Sunday boys are Kwesi.'),
            ],
            true,
          ),
          o('Monday.', [N('Monday boys are Kwadwo.'), N('Kofi is for Friday.')]),
          o('Sunday.', [N('Sunday boys are Kwesi.'), N('Kofi is for Friday.')]),
        ],
        'Matched the day name Kofi to Friday, building on the Wednesday name Kwaku.',
      ),
    ],
    [
      ch('warn', 'Tell Wisp he doesn’t have to.', [
        W('Hsss. Deal.', 'angry'),
        N('He has decided. You can see it in his ears.'),
      ]),
      ch('let', 'Let them shake on it.', [
        N('You let it be. A thief and a spider deserve each other, and they both look delighted.'),
      ]),
    ],
  ),
  // a28-wisp = came: replaces a28-08-debt
  sc(
    'a28-08-debt-wisp',
    [
      N(
        'Ananse sits by the empty box. Wisp climbs out of your bag and sits directly in front of him, staring.',
      ),
      W('story. owed.', 'soft'),
      AN('Ah. Yes. The debt. A spider always pays.', 'think'),
      N(
        'He looks at the empty box, and round his doorstep. Then he picks up a small stoppered gourd and holds it out.',
      ),
      AN('A story. In a gourd. Very rare. Do not open it till you are home.'),
      N(
        'Wisp opens it at once. Out comes one hornet, the last of the swarm, very annoyed, and stings him on the nose.',
      ),
      N('Your Nubbin, nose still lumpy, watches this with deep and private satisfaction.'),
      N(
        'Wisp sneezes. Then he reaches into the bag behind him and puts something on the step: Fern’s old left glove.',
      ),
      W('warm. was warm.', 'soft'),
      AN('A glove! One glove. I have eight hands. This is… thank you.', 'shock'),
      N('Ananse puts the glove on one foot, and looks for a long moment at the other seven.'),
      AN('Seven cold feet. Aso will hear about this.', 'think'),
      N('Wisp puts the gourd in your bag next to the stone.'),
      N('Each of them is quite sure he has won. You decide not to tell either of them.'),
    ],
    [
      ask(
        5,
        'literacy',
        'a “sting in the tail”: multiple-meaning words',
        'L.3.4',
        [
          N(
            'An ending that surprises you is sometimes called a “sting in the tail”. What do you think that phrase means?',
          ),
        ],
        [
          o(
            'A surprise at the end.',
            [
              N('Yes. The word “sting” is doing double duty.'),
              N('Here the hornet really does sting, and the ending really does surprise.'),
            ],
            true,
          ),
          o('A scorpion character.', [
            N('A scorpion does have a sting in its tail, but this is a figure of speech.'),
            N('It means a surprise at the end.'),
          ]),
          o('A very long ending.', [
            N('A sting is sharp and quick, not long.'),
            N('It means a surprise at the end.'),
          ]),
        ],
        'Worked out the meaning of the phrase “sting in the tail” as a surprise ending.',
      ),
    ],
    [
      ch('nose', 'Check Wisp’s nose.', [
        N(
          'He lets you look, for once: a small bump. Your Nubbin pats it, gently, as one veteran to another.',
        ),
      ]),
      ch('glove', 'Ask Ananse where the story is, then.', [
        AN(
          'It is in the gourd. It was the hornet. A short story with a sting in it. All the best ones have.',
          'happy',
        ),
      ]),
    ],
  ),
  // a28-fairy = freed: replaces a28-09-scatter-done
  sc(
    'a28-09-scatter-done-freed',
    [
      N(
        'The pieces come down on the far side of the clearing, on the ants, the frogs and a very surprised goat.',
      ),
      N(
        'Then something small and quick darts out of the trees: Mmoatia, home from the sky and nobody’s prisoner.',
      ),
      N(
        'She catches one bright piece in her free hand, the hand you gave back, before it can touch the ground.',
      ),
      MM('Here. A hand for a hand.', 'soft'),
      N(
        'She drops it into your Nubbin’s paws and is gone again before anyone can thank her. Your Nubbin holds it very still.',
      ),
    ],
    [
      ask(
        4,
        'sel',
        'kindness comes back',
        'CASEL: Relationship skills',
        [N('Mmoatia says, “A hand for a hand.” Why did she help your Nubbin?')],
        [
          o(
            'Because you helped her earlier, and kindness often comes back.',
            [
              N('Yes. She is returning a favour.'),
              N('Small kindnesses can be remembered a long time.'),
            ],
            true,
          ),
          o('She was just showing off.', [
            N('She did it quietly, and left before being thanked.'),
            N('She was returning your kindness.'),
          ]),
          o('She wanted something in return.', [
            N('She asks for nothing. She is giving, not trading.'),
            N('She was returning your kindness.'),
          ]),
        ],
        'Talked about how kindness is remembered and returned.',
      ),
    ],
  ),
  // a28-fairy = sat: replaces a28-09-scatter-done
  sc(
    'a28-09-scatter-done-sat',
    [
      N(
        'Somebody sits down next to you under the tree. It is Mmoatia, home from the sky, and she says nothing at all.',
      ),
      N(
        'The wisdom comes down on the clearing like warm rain, and on the two of you, and on your Nubbin between you.',
      ),
      N('None of you move to catch any. You sit, and get rained on, together.'),
      N('When it stops, she leans, very slightly, against your arm. Then she is gone.'),
    ],
    [
      ask(
        3,
        'sel',
        'quiet company',
        'CASEL: Social awareness',
        [N('Why can sitting quietly beside someone be a kind thing to do?')],
        [
          o(
            'It shows you are there without needing to fix anything.',
            [
              N('Yes. Sometimes company is the kindest help.'),
              N('Mmoatia remembers who sat with her under the odum tree.'),
            ],
            true,
          ),
          o('It means you do not care.', [
            N('The opposite. Staying close shows you care.'),
            N('It shows you are there without needing to fix anything.'),
          ]),
          o('It stops them from talking.', [
            N('A quiet friend leaves room for talking when you are ready.'),
            N('It shows you are there without needing to fix anything.'),
          ]),
        ],
        'Talked about how quiet company can be a kind way to help.',
      ),
    ],
  ),
  // a28-fairy = freed: replaces a28-10-dance-done
  sc(
    'a28-10-dance-done-freed',
    [
      N(
        'Behind Ananse, half hidden in the crowd, a small figure is laughing into her free hand. It is Mmoatia.',
      ),
      N('She reaches up with that hand and tips his hat clean off.'),
      N(
        'The beans come down all over the yard. Every hair on Ananse’s head has been scorched clean away.',
      ),
      MM('A spider caught me once. Fair is fair.', 'happy'),
      N('There is a short silence, and then a very long laugh, and hers is the loudest.'),
      N('The hot beans heated his hat, and the hat heated his head.'),
    ],
    [
      ask(
        4,
        'science',
        'heat moves from hot to cooler',
        '4-PS3-2',
        [N('The hot beans made Ananse’s head hot. In which direction does heat move?')],
        [
          o(
            'From hotter things to cooler things.',
            [
              N('Yes. Heat always flows from a hotter thing to a cooler thing.'),
              N('That is why a hot drink cools down in a cold room.'),
            ],
            true,
          ),
          o('From cooler things to hotter things.', [
            N('Heat does not go that way by itself.'),
            N('It flows from hotter things to cooler things.'),
          ]),
          o('It stays where it is.', [
            N('Heat spreads out until things are the same warmth.'),
            N('It flows from hotter things to cooler things.'),
          ]),
        ],
        'Learned that heat flows from hotter things to cooler things.',
      ),
    ],
  ),
  // a28-fairy = sat: replaces a28-10-dance-done
  sc(
    'a28-10-dance-done-sat',
    [
      N(
        'Then the hat comes off on its own, sailing up into the air, and the beans come down all over the yard.',
      ),
      N(
        'Every hair on Ananse’s head has been scorched clean away. There is a short silence, and then a very long laugh.',
      ),
      N(
        'Later, when he is hiding in the long grass, someone small sits down beside him. It is Mmoatia.',
      ),
      N('She says nothing. She lays a cool, wet leaf on his poor bald head, and stays a while.'),
      N('Ananse, for once in his life, says nothing either.'),
    ],
    [
      ask(
        3,
        'science',
        'heat moves into a cooler thing',
        '4-PS3-2',
        [N('Why does a cool, wet leaf make Ananse’s hot head feel better?')],
        [
          o(
            'Heat moves from his hot head into the cool leaf.',
            [
              N('Yes. Heat flows from the hotter thing to the cooler thing.'),
              N('The wet leaf also cools as the water dries, which takes away more heat.'),
            ],
            true,
          ),
          o('The leaf makes cold and puts it in his head.', [
            N('There is no “cold” that moves. Only heat moves.'),
            N('Heat leaves his head and goes into the cool leaf.'),
          ]),
          o('Leaves are magic.', [
            N('A lovely idea, but the real reason is just as clever.'),
            N('Heat leaves his head and goes into the cool leaf.'),
          ]),
        ],
        'Learned that a cool object cools a hot one because heat moves from the hotter to the cooler.',
      ),
    ],
  ),
  // a28-fairy = freed: replaces a28-12-tell
  sc(
    'a28-12-tell-freed',
    [
      Y('This one is about a fairy, and a doll covered in gum.'),
      N('You tell them about the odum tree, and the yam, and the thank-you that nobody answered.'),
      N('You tell them how she stuck, both hands, and how the spider ran for rope.'),
      Y(
        'And while he was gone, somebody worked one of her hands loose. Only one. The other had to stay.',
      ),
      Y(
        'So she went up to the sky caught, but with a hand of her own. And she used it, later. Mostly on hats.',
      ),
      N('The children laugh, and one of them claps with one hand on his knee.'),
      ST('Ha! That one is a clever one.', 'happy'),
      ST('One hand free, and the story still holds. I will keep a piece of that. The hand.'),
    ],
    [
      ask(
        5,
        'literacy',
        'the theme of a story',
        'RL.4.2',
        [N('What is the theme, the big idea, of the story you told?')],
        [
          o(
            'A small act of help can matter, even when it cannot undo everything.',
            [
              N('Yes. One hand free did not undo the capture, but it mattered.'),
              N('A theme is the big idea underneath a story, not just what happens in it.'),
            ],
            true,
          ),
          o('Never trust a fairy.', [
            N('The fairy is the one who was caught, not the trickster.'),
            N('The theme is that a small act of help can matter.'),
          ]),
          o('Hats are important.', [
            N('The hats are a joke, not the big idea.'),
            N('The theme is that a small act of help can matter.'),
          ]),
        ],
        'Identified a theme: a small act of help can matter even when it cannot undo everything.',
      ),
    ],
  ),
  // a28-fairy = sat: replaces a28-12-tell
  sc(
    'a28-12-tell-sat',
    [
      Y('This one is about a fairy, and a doll covered in gum.'),
      N('You tell them about the odum tree, and the yam, and the thank-you that nobody answered.'),
      N('You tell them how she stuck, both hands, and how the spider ran for rope.'),
      Y(
        'And while he was gone, somebody sat down next to her. They did not say anything. They just waited with her.',
      ),
      Y('She was still caught when the rope came. But she was not on her own.'),
      N(
        'The courtyard is very quiet. A girl at the back leans against her brother, and he lets her.',
      ),
      ST('Mm. That one is a kind one.', 'soft'),
      ST(
        'Nothing got fixed in it, and it is better anyway. I will keep a piece of that. The sitting.',
      ),
    ],
    [
      ask(
        5,
        'literacy',
        'the theme of a story',
        'RL.4.2',
        [N('What is the theme, the big idea, of the story you told?')],
        [
          o(
            'Sometimes being there matters more than fixing things.',
            [
              N('Yes. Nothing got fixed, but the fairy was not alone.'),
              N('A theme is the big idea underneath a story, not just what happens in it.'),
            ],
            true,
          ),
          o('Never be late with rope.', [
            N('Rope is part of the plot, not the big idea.'),
            N('The theme is that being there can matter more than fixing.'),
          ]),
          o('Fairies are always sad.', [
            N('Mmoatia is sharp and proud, not always sad.'),
            N('The theme is that being there can matter more than fixing.'),
          ]),
        ],
        'Identified a theme: being present for someone can matter more than fixing their problem.',
      ),
    ],
  ),
  // a28-wisp = came: replaces a28-12-last
  sc(
    'a28-12-last-wisp',
    [
      ST('One more. A short one. Mine, this time. Nobody asked for it, so listen properly.'),
      N(
        'Wisp has come out of your bag. He sits at the edge of the firelight with the egg stone in his paws.',
      ),
      ST('There was a grey thief with a torn ear, who wanted every warm thing in the world.'),
      ST('And he kept a stone that had gone cold. He kept it long after it was any use to anyone.'),
      ST(
        'He traded with a spider once, and both of them were cheated, and both of them went home pleased.',
      ),
      ST('But the spider threw something in for nothing, and never knew. He put the thief in a story.'),
      ST(
        'Nobody had ever told a story about the thief before. That was the best thing in the whole bargain.',
      ),
      N('Wisp’s ears have come up. He has stopped looking at the fire, and is looking at her.'),
      ST('A story. Not the one in the gourd. This one. The one about him.', 'soft'),
      N(
        'Wisp listens to the very end, without moving. Then he gets up, carefully, the way you get up holding something full.',
      ),
    ],
    [
      ask(
        8,
        'literacy',
        'how it feels to hear a story about yourself: a think question',
        'RL.3.6',
        [
          N(
            'The storyteller tells a story about Wisp, and Wisp is listening. How is hearing a story about yourself different from hearing one about a stranger?',
          ),
        ],
        [
          o('You listen more closely, because you want to know how you are seen.', [
            N('That is a fair answer. A story about you carries a kind of mirror.'),
            N('Wisp’s ears come up, and he stops watching the fire.'),
          ]),
          o('It can feel uncomfortable, and also like being understood.', [
            N('That is a fair answer. Being seen kindly can be both.'),
            N('Notice that the storyteller tells it gently.'),
          ]),
          o('It makes the story feel more real.', [
            N('That is a fair answer. The point of view changes, and so does how much it matters.'),
            N('Wisp listens to the very end.'),
          ]),
        ],
        'Thought about how hearing a story about yourself differs from hearing a story about someone else.',
      ),
    ],
  ),
  // Grove wisp = driven: replaces a28-12-last
  sc(
    'a28-12-last-driven',
    [
      ST(
        'One more. A short one. Mine. But I do not know the end, so you will have to help me.',
        'think',
      ),
      ST(
        'There was a grey one who was sent away from a garden. A thief, they said, and they were right.',
      ),
      ST(
        'And still, some evenings, he comes down the lane, and looks at the gate, and does not try it.',
      ),
      N('The children have gone very quiet. Your Nubbin is looking at you.'),
      ST('How does it end?'),
    ],
    [
      ask(
        3,
        'literacy',
        'open endings: a think question',
        'RL.4.2',
        [
          N(
            'The storyteller leaves the ending open and asks you to finish it. Why might she do that?',
          ),
        ],
        [
          o('So the listener can imagine a hopeful ending.', [
            N('That is a fair answer. An open ending can be a kind of invitation.'),
            N('Saying an ending aloud can make it more likely.'),
          ]),
          o('Because some true stories are not finished yet.', [
            N('That is a fair answer. Life does not always tie things up.'),
            N('The storyteller says so herself.'),
          ]),
          o('Because she forgot how it ends.', [
            N('That is a fair answer, but she says she does not know, not that she forgot.'),
            N('An unfinished story is still a story.'),
          ]),
        ],
        'Thought about why a storyteller might leave a story’s ending open.',
      ),
    ],
    [
      ch(
        'unknown',
        'Say, “I don’t know.”',
        [
          ST(
            'No. Neither do I. That is a good answer. Most true stories end that way, for a long while.',
            'soft',
          ),
          ST('Keep it open, then. Somebody will finish it.'),
        ],
        { 'a28-gate': 'unknown' },
      ),
      ch(
        'back',
        'Say, “He comes back.”',
        [
          ST('Does he? Good. Then that is how I will tell it.', 'happy'),
          ST('Saying it is half of it. The rest is somebody opening the gate.', 'soft'),
        ],
        { 'a28-gate': 'back' },
      ),
    ],
  ),
];

// ================================================================== exports
export const EDU_A28_READER: EduQuest[] = [A1, A2, A3, A4, A5, A6, A7, A8, A9, A10, A11, A12];

/** Every `edu:` check string used by the lessons above (the reader band has no `do` lessons). */
export const CHECKS: string[] = [];
