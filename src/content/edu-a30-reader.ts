/**
 * The Learning Grove, reader band (ages 7–10): Atlas page A30, The Word on the Brow (the Golem of
 * Prague, a Jewish legend from the Czech lands). Led by Ori from the Hebrew questline, who reads
 * the atlas over your shoulder.
 *
 * Source: atlas-a30.ts (ATLAS_A30 and ATLAS_A30_VARIANTS). One EduScene per original scene (every
 * step scene, every done scene, every complete scene and every variant), id `reader:<original id>`,
 * with every choice kept under its original id and `set` flag (`a30-order`). Reader keeps all
 * choices, so no `defaultChoice` is needed. See EDU-STYLE.md. British spelling.
 *
 * Learning angles, from the outline: three Hebrew letters (alef, mem, tav) and that Hebrew is
 * written right to left; אֱמֶת (emet, truth) and, in this band, that taking away the silent alef
 * makes מֵת (met, dead); that alef, mem and tav are the first, near-middle and last letters of the
 * 22-letter alef-bet (mem is the 13th); Prague and the Vltava on a map, and Chełm to the east; the
 * Sabbath as a day of rest. Around them: maths (area, perimeter, multiplying, dividing, time,
 * litres), science (clay, light and shadow, heat and energy, drying, stars and daylight, fossils,
 * the heart), language (similes, metaphors, vocabulary, theme), history (oral tradition, life
 * then and now) and feelings.
 *
 * Think questions (`ask` with no `best`) in every quest: what makes us feel welcome, what makes a
 * person, why lies travel, what a fifth thing might be, whether to follow when told not to, why a
 * child’s name is worth more, whether a helper who only obeys is the best helper, whether a guard
 * who does nothing protects, why rest matters, whether forgetting deserves blame, whether rest
 * is work, why company helps, and who should hold the brakes.
 *
 * Care notes kept: the Divine Name is never written or hinted at; the older tellings are said to
 * differ and the rabbi says so. The fear outside the walls is “a story about us that is not true”
 * and some talk beyond the gate, never named or shown. Nobody is hurt; the clay falls like sand
 * (said twice). The rabbi is real, warm and human, and the golem is called a legend. No word of
 * the psalm is printed. No lifted text: the childLines of the original are the guide, and every
 * line is original. The two new words (emet, met) are for the vetted list and a native speaker
 * (see the log). Hebrew runs sit apart from English words so the box can isolate them.
 * Facts used: Prague is on the Vltava, in the Czech lands; the Vltava flows north to join the
 * Elbe; Hebrew has 22 letters, is written right to left, alef is first, mem the 13th and tav the
 * 22nd (22 − 13 = 9 come after mem); the Sabbath runs from Friday sunset to Saturday after dark,
 * when three stars come out; Rabbi Loew lived about 1520 to 1609; Chełm is in eastern Poland, east
 * of Prague; the Maharal is made from the first letters of “our teacher, Rabbi Loew”; a genizah is
 * a store for worn-out holy books; wet clay is soft and dries hard; a soft print can set; foals
 * stand within hours of birth, human babies take much longer; children need nine to twelve hours
 * of sleep; the heart beats faster in exercise to carry more oxygen to the muscles.
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
const OR = say('ori');
const LO = say('a30-loew');
const AV = say('a30-avram');
const DV = say('a30-dvora');
const RI = say('a30-rivka');
const SH = say('a30-shmuel');
const MI = say('a30-mirele');
const HA = say('a30-hannah');
const IS = say('a30-isaac');
const JA = say('a30-jacob');
const BO = say('a30-boy');
const ST = say('a30-student');
const S2 = say('a30-student-2');
const M = say('moss');

// ---------------------------------------------------------------- builders
type Beat = Omit<Lesson, 'id'>;
type Opt = NonNullable<Lesson['options']>[number];

const words = (t: string) => t.trim().split(/\s+/).length;
const fits = (t: string) => words(t) <= 26 && t.length <= 150;

/**
 * Keeps narration to two sentences a line and within the reader caps (30 words, 160 characters):
 * a long narrator line is cut at sentence ends into several lines (the mood stays on the first).
 * Brackets and the characters’ own lines are left as written. `map[i]` is the index of the last
 * piece of original line i, so a lesson’s `after` can follow.
 */
const split = (lines: Line[]): { lines: Line[]; map: number[] } => {
  const out: Line[] = [];
  const map: number[] = [];
  for (const l of lines) {
    if (l.who !== 'narrator' || l.text.startsWith('(')) {
      out.push(l);
      map.push(out.length - 1);
      continue;
    }
    const sentences = l.text.split(/(?<=[.!?”])\s+(?=[A-Z“])/);
    const chunks: string[] = [];
    let count = 0;
    for (const sentence of sentences) {
      const last = chunks[chunks.length - 1];
      if (last !== undefined && count < 2 && fits(`${last} ${sentence}`)) {
        chunks[chunks.length - 1] = `${last} ${sentence}`;
        count += 1;
      } else {
        chunks.push(sentence);
        count = 1;
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

/** A choice with the original id (and `set` flag, if it had one). */
const ch = (id: string, label: string, then: Line[], set?: Choice['set']): Choice =>
  set ? { id, label, set, then: sp(then) } : { id, label, then: sp(then) };

const G = (goal: string, hint: string) => ({ goal, hint });

// ================================================================== A30-1 The Jewish Town
const A1: EduQuest = quest(
  'a30-01',
  'The Jewish Town',
  {
    'a30-01-s1': G(
      'Step into the brown-ink page and find the caretaker’s house.',
      'Touch the page, then follow the lane to the door with the ring of keys.',
    ),
    'a30-01-s2': G(
      'Carry water from the well, and learn where things are.',
      'Rivka knows the way. The well is where three lanes meet.',
    ),
    'a30-01-s3': G(
      'Fetch the bread from Hannah’s bakery.',
      'The bakery is the door with the warm step. Your Nubbin has already found it.',
    ),
  },
  [
    sc(
      'a30-01-page',
      [
        N(
          'Nova’s atlas falls open at a page of brown ink: a steep-roofed synagogue, a lane of small houses, a river.',
        ),
        OR(
          'That is Prague, in the Czech lands. The wavy line is the Vltava, the river that runs through the city.',
        ),
        OR(
          'This page is a legend. Rabbi Judah Loew was a real teacher, from more than four hundred years ago. The clay man came into stories long after.',
        ),
        N(
          'The paper goes cool and gritty under your hand, like a doorstep. Then it is a doorstep, and you are sitting on it.',
        ),
        N(
          'A narrow lane, wet cobbles, the smell of bread. A man with a ring of keys looks down at you both.',
        ),
        AV(
          'You’ll be the lodger. Good. I’m Avram. I look after the synagogue, which mostly means I look after its keys.',
        ),
        N('Your Nubbin holds up both arms, to show that it will fit anywhere at all.'),
      ],
      [
        ask(
          1,
          'social-studies',
          'reading a river on a map',
          'D2.Geo.2.K-2',
          [OR('Maps use signs. How is a river like the Vltava usually drawn on a map?')],
          [
            o(
              'As a wavy blue line',
              [
                OR(
                  'Yes. Rivers are usually wavy blue lines, and they often join the sea or another river.',
                ),
              ],
              true,
            ),
            o('As a straight red line', [
              OR('Red lines are often roads or borders. A river is wavy, and blue like water.'),
            ]),
            o('As a black square', [
              OR('Small squares often mean buildings. The river is the long, wavy blue line.'),
            ]),
          ],
          'Read a map: a river is drawn as a wavy blue line. Placed Prague, in the Czech lands, beside the Vltava.',
        ),
      ],
      [
        ch('hand', 'Shake his hand.', [
          AV('A good grip. You’ll carry water.', 'happy'),
          N('He says it as if it were the highest praise he knows.'),
        ]),
        ch('keys', 'Ask which key is which.', [
          AV(
            'This one is the big door. This one is the cupboard. This one, I have no idea. I’ve had it twenty years.',
            'think',
          ),
          AV('One day a door will turn up for it, and I’ll be ready.'),
        ]),
        ch('basket', 'Take the basket he’s carrying.', [
          N(
            'He lets you take it. He looks at you sideways, the way people do when they’ve been helped before they asked.',
          ),
        ]),
      ],
    ),
    sc(
      'a30-01-page-done',
      [
        DV(
          'Avram, bring them in, you’re letting the warm out. Water first, lodger. Then you can be a guest.',
        ),
        RI('I’ll show you the well! I know the well better than anyone.'),
        N('Inside, your Nubbin is already being a guest at the stove.'),
      ],
      [
        ask(
          2,
          'sel',
          'what helps a newcomer feel welcome',
          'CASEL: Social awareness',
          [
            N(
              'You are new in a stranger’s house. What do you think helps a newcomer feel welcome?',
            ),
          ],
          [
            o('Being given a job to do', [
              N(
                'That’s a fair answer. Dvora gave you water to fetch. A job can make you feel you belong.',
              ),
            ]),
            o('Being given food and a bed', [
              N('That’s a fair answer. Being looked after tells you that you are wanted.'),
            ]),
            o('Being asked your name', [
              N(
                'That’s a fair answer. Being noticed as a person, not just a guest, matters a great deal.',
              ),
            ]),
          ],
          'Thought about what helps a newcomer feel welcome. No single right answer.',
        ),
      ],
    ),
    sc(
      'a30-01-water',
      [
        N('Rivka is about nine, and walks backwards the whole way so she can talk to you.'),
        RI(
          'That’s the study house. That’s the bathhouse. That’s Hannah’s bakery. Don’t look at it, you’ll want everything.',
        ),
        N('Your Nubbin looks at it.'),
        RI(
          'Nobody goes in the attic. It’s where the worn-out books go. You don’t throw away a holy book; you put it to rest.',
        ),
        N(
          'At the well two women are talking low, the way people talk about weather that hasn’t arrived yet.',
        ),
        RI('Mama says not to listen at wells. Mama listens at wells all the time.'),
        N(
          'Dvora needs thirty litres of water for the big pot. Your buckets hold six litres each, and you carry two.',
        ),
        N('Your Nubbin carries a cup, spills about half of it, and is very proud of the half.'),
      ],
      [
        ask(
          6,
          'maths',
          'a two-step word problem with litres',
          '3.OA.D.8',
          [
            N(
              'You carry two full buckets of six litres. Dvora needs thirty litres. How many more bucketfuls?',
            ),
          ],
          [
            o(
              '3',
              [
                N(
                  'Yes. Two buckets is 12 litres, and 30 − 12 = 18. Then 18 ÷ 6 = 3 more bucketfuls.',
                ),
              ],
              true,
            ),
            o('4', [
              N('Let’s check: 12 litres carried, so 18 to go. 18 ÷ 6 = 3 bucketfuls, not 4.'),
            ]),
            o('5', [N('12 litres carried, 18 to go. Each trip is 6 litres, so 3 trips.')]),
          ],
          'Solved a two-step problem: 30 − (2 × 6) = 18, then 18 ÷ 6 = 3.',
        ),
      ],
    ),
    sc(
      'a30-01-water-done',
      [
        DV(
          'Good. Now you’re a guest. Rivka, take them to Hannah’s before she shuts, and don’t eat the change.',
        ),
        N('Rivka looks as if the thought had never crossed her mind.'),
      ],
      [
        ask(
          0,
          'literacy',
          'the meaning of lodger',
          'L.3.4',
          [N('Avram called you the lodger. From the way Dvora treats you, what is a lodger?')],
          [
            o(
              'Someone who stays in another family’s house',
              [
                N(
                  'Yes. A lodger lodges, or stays, in someone else’s home, often paying or helping in return.',
                ),
              ],
              true,
            ),
            o('Someone who sells water', [
              N('A lodger doesn’t sell anything. To lodge means to stay in someone else’s home.'),
            ]),
            o('Someone who owns the house', [
              N('The owner is the householder. A lodger is a guest who stays.'),
            ]),
          ],
          'Worked out the meaning of the word lodger from context.',
        ),
      ],
    ),
    sc(
      'a30-01-bakery',
      [
        N(
          'Your Nubbin is already sitting on the bakery step, which is warm from the oven inside, with its eyes shut.',
        ),
        HA('Is this yours? It’s been there since you came round the corner. It hasn’t moved.'),
        N(
          'Hannah is flour to the elbows. Behind her, plaited loaves stand in rows, shining, waiting for Friday.',
        ),
        HA(
          'Those are for the Sabbath. Nobody touches those. This, on the other hand, is a crust I burnt.',
          'happy',
        ),
        N('She holds it out. Your Nubbin takes it in both paws as if it were a medal.'),
        RI('She burns one every day. On purpose. Everyone knows.'),
        HA('Rivka, if you tell everyone, I’ll have to stop.'),
      ],
      [
        ask(
          3,
          'science',
          'some changes cannot be undone',
          '2-PS1-4',
          [
            N(
              'Hannah’s soft dough goes into the hot oven and comes out as bread. Can baked bread be turned back into dough?',
            ),
          ],
          [
            o(
              'No, the heat changed it for good',
              [
                HA(
                  'Right. Some changes, like baking, can’t be undone. Others, like melting butter, can.',
                ),
              ],
              true,
            ),
            o('Yes, if you add water', [
              HA('Water won’t help. The heat has changed the dough into something new.'),
            ]),
            o('Yes, if you let it cool', [HA('Cooling won’t help either. Bread stays bread.')]),
          ],
          'Learned that baking is a change that cannot be reversed.',
        ),
      ],
    ),
    sc(
      'a30-01-complete',
      [
        N(
          'The loft is small and smells of apples. Through its little window you can see across the lane to the study house.',
        ),
        N('There is still a lamp burning there, late, in one window. Someone is reading.'),
        RI(
          'That’s the rabbi. He reads all night sometimes. Papa says it’s because he’s wise. Mama says it’s because he forgets.',
        ),
        N(
          'Your Nubbin falls asleep with flour on its nose and the last of the crust under its arm.',
        ),
      ],
      [
        ask(
          2,
          'sel',
          'seeing that two reasons can both be true',
          'CASEL: Social awareness',
          [
            N(
              'Papa and Mama give different reasons for the rabbi’s late nights. Could both be right?',
            ),
          ],
          [
            o(
              'Yes, people often act for more than one reason',
              [N('Yes. He could be wise and forgetful. Most people are more than one thing.')],
              true,
            ),
            o('No, only one can be right', [
              N(
                'It’s tempting to think so. But people are usually more than one thing, so two reasons can both be true.',
              ),
            ]),
          ],
          'Practised seeing that two different explanations can both be true.',
        ),
      ],
    ),
  ],
  [
    gl(
      'legend',
      'A very old story that many people have told, which may have grown over the years.',
      'a30-01-page',
    ),
    gl('lodger', 'A person who stays in someone else’s home.', 'a30-01-water-done'),
  ],
);

// ================================================================== A30-2 The Rabbi
const A2: EduQuest = quest(
  'a30-02',
  'The Rabbi',
  {
    'a30-02-s1': G(
      'Go to the study house with Avram and sit at the back.',
      'The bench by the door. Sit still, and listen.',
    ),
    'a30-02-s2': G(
      'Answer the rabbi’s question, if you can.',
      'He is looking at the back bench. There is no wrong answer.',
    ),
  },
  [
    sc(
      'a30-02-study',
      [
        N(
          'The study house is one long room full of books and noise. Students sit in pairs, arguing over a page, both talking at once.',
        ),
        AV('It’s meant to be loud. A quiet study house is one where nobody’s thinking.'),
        AV(
          'Sit at the back. That is Rabbi Judah Loew. People call him the Maharal, from the first letters of “our teacher, the rabbi Loew”.',
        ),
        N(
          'At the front sits an old man with a plain grey beard and ink on his fingers. The room goes quiet for him without being asked.',
        ),
        LO(
          'I’m going to tell you a story from the Talmud. Rava made a man, and sent him to Rabbi Zeira.',
        ),
        LO('Rabbi Zeira spoke to him, and the man did not answer.'),
        LO('So Rabbi Zeira said to him: then go back to your dust.'),
        N('Your Nubbin, on the bench beside you, has gone very still.'),
      ],
      [
        ask(
          1,
          'social-studies',
          'how people studied in the past, compared with today',
          'D2.His.2.K-2',
          [
            N(
              'Students here study in pairs and argue over a page. Why might that be a good way to learn?',
            ),
          ],
          [
            o(
              'Your partner spots things you missed',
              [
                AV(
                  'Yes. Two minds catch more than one, and explaining your idea helps you understand it.',
                ),
              ],
              true,
            ),
            o('It keeps the room quiet', [
              AV('The room is anything but quiet! Arguing in pairs is how they test their ideas.'),
            ]),
            o('There are no books', [
              AV('There are books everywhere. The pairs are for thinking, not for sharing.'),
            ]),
          ],
          'Compared learning in pairs in a study house long ago with learning at school today.',
        ),
      ],
    ),
    sc(
      'a30-02-study-done',
      [
        N(
          'The rabbi lets the story sit in the room a while, the way you let bread rest before you cut it.',
        ),
      ],
      [
        ask(
          0,
          'literacy',
          'recognising a simile',
          'L.4.5',
          [
            N(
              'That line compares a story with bread. Which of these is a simile, a comparison using “as” or “like”?',
            ),
          ],
          [
            o(
              'The room was as quiet as snow',
              [N('Yes. “As quiet as snow” compares two things using “as”. That is a simile.')],
              true,
            ),
            o('The room was a snowfield', [
              N(
                'That compares without “as” or “like”. It is a metaphor, a close cousin of the simile.',
              ),
            ]),
            o('The room was silent', [N('That says it plainly, without any comparison.')]),
          ],
          'Told a simile from a metaphor and a plain statement.',
        ),
      ],
    ),
    sc(
      'a30-02-question',
      [
        LO('Now. What is a person, if not that? Someone tell me.'),
        ST('Someone who answers, Rabbi.'),
        S2('Someone who can be spoken to. Which is not quite the same.', 'think'),
        LO(
          'There’s a psalm in the Bible, a kind of prayer, that says: before I was even made, you saw me.',
        ),
        LO(
          'The Hebrew word there is golmi, “my golem”: me, a lump not yet shaped. So every one of us was clay once, and somebody saw it.',
        ),
        LO('What makes the difference?', 'think'),
        N('He is looking past the students, at the back bench. At you.'),
      ],
      [
        ask(
          5,
          'sel',
          'what makes a person a person',
          'CASEL: Self-awareness',
          [
            N(
              'The rabbi asks what makes a person different from a clay figure. What do you think?',
            ),
          ],
          [
            o('Having feelings', [
              LO(
                'That’s a fair answer. Something that can be glad or frightened has an inside, not just an outside.',
              ),
            ]),
            o('Being able to choose', [
              LO(
                'That’s a fair answer. A person can say no, or change their mind. A clay man only waits.',
              ),
            ]),
            o('Being loved by other people', [
              LO('That’s a fair answer. We become who we are among people who know us.'),
            ]),
          ],
          'Thought about what makes a person different from a clay figure. No single right answer.',
        ),
      ],
      [
        ch('answers', '“Someone who can answer.”', [
          LO('The same as the student said, but braver, from the back of the room. Good.', 'happy'),
        ]),
        ch('asks', '“Someone who can ask.”', [
          LO('Then this is a room full of people, and I have been worrying for nothing.', 'happy'),
        ]),
        ch('nubbin', 'Look at your Nubbin, who can’t say a word.', [
          LO(
            'Yes. It doesn’t speak. And it answered me just now: it looked up when I said clay.',
            'soft',
          ),
          LO('Answering is more than words. Remember that. I may need reminding.'),
        ]),
      ],
    ),
    sc(
      'a30-02-complete',
      [
        N(
          'Afterwards, at the door, the rabbi stops beside your Nubbin and looks down at it for a long moment.',
        ),
        LO('I have never seen one of these. Does it do as it’s told?'),
        AV('Never, Rabbi. Not once. It’s a great comfort to the household.'),
        LO('Good. I’d worry about it otherwise.', 'happy'),
        N(
          'He goes out into the lane with a book under each arm, and leaves his coat behind on the peg.',
        ),
      ],
      [
        ask(
          3,
          'literacy',
          'what a character’s words show about what he values',
          'RL.3.3',
          [
            N(
              'The rabbi is glad that the Nubbin never does as it’s told. What does that tell us about him?',
            ),
          ],
          [
            o(
              'He values minds that think for themselves',
              [
                LO(
                  'Yes. He is glad of a creature with a mind of its own. Remember that when the clay man comes.',
                ),
              ],
              true,
            ),
            o('He dislikes obedient children', [
              LO('It isn’t about dislike. He is glad of a mind of its own.'),
            ]),
            o('He is joking and means nothing', [
              LO('There is a joke in it, but it also tells us what he cares about.'),
            ]),
          ],
          'Inferred what a character values from what he says.',
        ),
      ],
    ),
  ],
  [
    gl(
      'simile',
      'A comparison that uses “like” or “as”, such as “as quiet as snow”.',
      'a30-02-study-done',
    ),
    gl('acronym', 'A name or word made from the first letters of other words.', 'a30-02-study'),
  ],
);

// ================================================================== A30-3 Fear
const A3: EduQuest = quest(
  'a30-03',
  'Fear',
  {
    'a30-03-s1': G(
      'Find out why Avram has come home early.',
      'He is in the courtyard, sitting on the woodpile, which he never does.',
    ),
    'a30-03-s2': G(
      'Get through the night.',
      'Choose where to be. Nothing will happen to you. It is only a long night.',
    ),
  },
  [
    sc(
      'a30-03-rumour',
      [
        N(
          'Avram comes home at noon, which he never does, and sits on the woodpile, which he never does either.',
        ),
        AV('There’s a story going round outside the walls. About us. It isn’t true.'),
        AV('I won’t tell you what it is. Saying it again is how it travels.', 'sad'),
        DV('It’s been told before. It’s always been a lie. It always finds people who want it.'),
        N('Dvora puts her hand on his shoulder, and leaves it there.'),
        AV(
          'There were men at the gate last night, talking. Only talking. Tonight there may be more of them.',
        ),
        RI('Will they come in?'),
        DV(
          'The gates are shut at night. And there are a great many of us, and we’re all very good at shouting.',
        ),
      ],
      [
        ask(
          4,
          'sel',
          'why untrue stories travel',
          'CASEL: Social awareness',
          [
            N(
              'Avram won’t repeat the lie, because repeating is how it travels. Why do you think untrue stories spread so easily?',
            ),
          ],
          [
            o('People like exciting news', [
              DV('That’s a fair answer. A thrilling story gets passed on before anyone checks it.'),
            ]),
            o('People are frightened and want someone to blame', [
              DV('That’s a fair answer. Fear looks for a reason, and a lie can offer a false one.'),
            ]),
            o('Nobody stops to check', [
              DV(
                'That’s a fair answer. A question like “how do we know?” can stop a lie in its tracks.',
              ),
            ]),
          ],
          'Thought about why untrue stories spread, and how asking “how do we know?” can slow them. No single right answer.',
        ),
      ],
    ),
    sc(
      'a30-03-rumour-done',
      [
        AV('Bar the shutters at dusk. That’s all. Then we sleep, if we can.'),
        N('There are four shutters on the house, and each one has two bars, one high and one low.'),
      ],
      [
        ask(
          1,
          'maths',
          'equal groups: 4 × 2',
          '3.OA.A.1',
          [N('Four shutters, two bars on each. How many bars does Avram bar in all?')],
          [
            o('8', [N('Yes. Four groups of two is 4 × 2 = 8.')], true),
            o('6', [N('Try it as four twos: 2, 4, 6, 8. Eight bars.')]),
            o('4', [N('Four is the number of shutters. Each has two bars, so 4 × 2 = 8.')]),
          ],
          'Used equal groups to multiply: 4 shutters with 2 bars each make 8.',
        ),
      ],
    ),
    sc(
      'a30-03-night',
      [
        N(
          'After dark there is lantern light at the far end of the street, beyond the gate. Voices, low, and then louder.',
        ),
        N('You can’t hear the words. You don’t want to.'),
        N(
          'The house goes very quiet. Shmuel gets into his sister’s bed without asking, and she lets him.',
        ),
        N('Across the lane, in the rabbi’s window, the lamp is lit. It stays lit.'),
        SH('Is the rabbi scared?'),
        RI('The rabbi is thinking. It looks the same from outside.'),
      ],
      [
        ask(
          3,
          'science',
          'we see a lamp because its light reaches our eyes',
          '1-PS4-2',
          [N('The lane is dark, but you can see the lamp across it. How can you see it?')],
          [
            o(
              'Light from the lamp travels to your eyes',
              [
                N(
                  'Yes. We see a glowing thing when its light reaches our eyes, and in a dark lane there is nothing to hide it.',
                ),
              ],
              true,
            ),
            o('Your eyes send light to the lamp', [
              N('Eyes don’t send out light. They catch light that arrives from the lamp.'),
            ]),
            o('The lamp is warm', [
              N('Warmth isn’t how we see. It is the light that reaches our eyes.'),
            ]),
          ],
          'Learned that we see a lamp because its light travels to our eyes.',
        ),
      ],
      [
        ch('children', 'Sit on the floor by the children’s bed.', [
          N(
            'You sit on the floor with your back to the bed. After a while a small hand comes down and holds your collar.',
          ),
          N(
            'Your Nubbin climbs up between them, and Shmuel goes to sleep with his face in its fur.',
          ),
        ]),
        ch('watch', 'Keep watch at the shutter with Avram.', [
          AV('There’s nothing to see. I know. I look anyway.'),
          N(
            'You look anyway, together, through the crack in the shutter, until the lights at the gate go out one by one.',
          ),
        ]),
        ch('rabbi', 'Watch the rabbi’s window.', [
          N(
            'Once, very late, a shadow crosses the rabbi’s lamp, back and forth, back and forth. Somebody walking, and not sleeping.',
          ),
        ]),
      ],
    ),
    sc(
      'a30-03-complete',
      [
        N(
          'In the morning the men are gone. Nothing happened, this time. Hannah’s oven is lit, and the lane smells of bread.',
        ),
        N(
          'The rabbi passes on his way to the study house, and nods to Avram. He looks as if he has not slept at all.',
        ),
        LO('Good morning. It is a good morning. They all are, until they aren’t.', 'think'),
        DV('He didn’t sleep. You can always tell. He gets philosophical before breakfast.'),
      ],
      [
        ask(
          3,
          'literacy',
          'working out a new word from context',
          'L.3.4',
          [
            N(
              'Dvora says the rabbi “gets philosophical”. From his words, what does philosophical mean?',
            ),
          ],
          [
            o(
              'Asking deep questions about life',
              [
                DV(
                  'Yes. A philosophical person wonders about big things, like good mornings and how long they last.',
                ),
              ],
              true,
            ),
            o('Very hungry', [
              DV('Not hungry. Look at what he said: he is wondering about mornings and time.'),
            ]),
            o('Very cheerful', [
              DV(
                'He sounds thoughtful, not cheerful. Philosophical means wondering about big questions.',
              ),
            ]),
          ],
          'Used context to work out that philosophical means thinking about big questions.',
        ),
      ],
    ),
  ],
  [
    gl(
      'philosophical',
      'Wondering and thinking about big questions, like what is right or what is real.',
      'a30-03-complete',
    ),
  ],
);

// ================================================================== A30-4 The Answer
const A4: EduQuest = quest(
  'a30-04',
  'The Answer',
  {
    'a30-04-s1': G(
      'Take the rabbi his supper in the study house.',
      'Dvora has wrapped it in a cloth. He will forget to eat it.',
    ),
    'a30-04-s2': G(
      'Listen to what the rabbi asks of you.',
      'He is at the study house door with two men.',
    ),
    'a30-04-s3': G(
      'Light the lantern in Avram’s window.',
      'The lantern hangs by the door. The window is in the loft.',
    ),
  },
  [
    sc(
      'a30-04-ask',
      [
        N(
          'Dvora sends you across the lane with bread and a bowl of soup under a cloth. The study house is empty but for him.',
        ),
        N('He is not reading. He is sitting with his hand over his eyes, very still.'),
        LO('Put it there, thank you. I’ll eat it. I may even eat it tonight.'),
        LO(
          'Do you know what I asked for, when I prayed this evening? How to keep them safe. Only that.',
          'think',
        ),
        LO(
          'It’s a very old question. Usually the answer is: be patient, be careful, be kind to your neighbours, and wait.',
        ),
        LO('I have been all four. I’d like a fifth.', 'sad'),
        N(
          'Your Nubbin climbs up on the bench and pushes the soup an inch closer to him, as a suggestion.',
        ),
      ],
      [
        ask(
          5,
          'sel',
          'what a fifth thing might be',
          'CASEL: Responsible decision-making',
          [
            N(
              'The rabbi has been patient, careful and kind, and has waited. What might the fifth thing be?',
            ),
          ],
          [
            o('Courage', [
              LO(
                'That’s a fair answer. Courage can mean doing the hard thing, even when you are afraid.',
              ),
            ]),
            o('A good plan', [
              LO(
                'That’s a fair answer. Kindness and patience are not always enough without a plan.',
              ),
            ]),
            o('Help from other people', [
              LO('That’s a fair answer. Nobody keeps a whole town safe alone.'),
            ]),
          ],
          'Thought about what else might help keep people safe. No single right answer.',
        ),
      ],
    ),
    sc(
      'a30-04-ask-done',
      [
        N(
          'When you go back for the bowl in the morning, it is empty. He is asleep at the table with his cheek on a book.',
        ),
      ],
      [
        notice(
          0,
          'health',
          'children need nine to twelve hours of sleep',
          'CASEL: Self-management',
          [
            OR(
              'Children your age need about nine to twelve hours of sleep every night. Grown-ups need seven or more.',
            ),
            OR('A book makes a hard pillow. Sleep is when our bodies and brains do their mending.'),
          ],
          'Learned that children need about nine to twelve hours of sleep a night.',
        ),
      ],
    ),
    sc(
      'a30-04-helpers',
      [
        N(
          'By noon he is awake, and changed. Something has settled in his face, the way dust settles in a still room.',
        ),
        LO(
          'A question I asked in the night was answered in a dream. That is all I’ll say about it.',
        ),
        N(
          'Two men stand with him: Isaac, his son-in-law, broad and quiet, and Jacob, his pupil, thin and quick.',
        ),
        LO('Isaac, Jacob: be ready tonight, after midnight. Wear old clothes. Bring nothing.'),
        IS('Nothing, Rabbi?'),
        LO('Nothing. Our hands will do.'),
        N('Then he turns to you, and you think he’s going to tell you something. He doesn’t.'),
        LO('Keep a lantern lit in Avram’s window until we come back. And don’t follow us.', 'soft'),
        LO(
          'Not because you aren’t trusted. Because some things are better done without anyone watching.',
        ),
      ],
      [
        ask(
          5,
          'literacy',
          'inferring a plan from what a character says',
          'RL.3.3',
          [N('“Bring nothing. Our hands will do.” What does the rabbi’s plan seem to be?')],
          [
            o(
              'To make or do something with their own hands',
              [LO('Yes. No tools and no fuss: just their own hands. The line quietly says a lot.')],
              true,
            ),
            o('To go to sleep', [
              LO('You don’t bring nothing to go to sleep. “Our hands will do” points to work.'),
            ]),
            o('To run away', [
              LO(
                'They are told to be ready after midnight, with old clothes. That points to a job.',
              ),
            ]),
          ],
          'Inferred a character’s plan from his words.',
        ),
      ],
      [
        ch('promise', '“I’ll keep it lit.”', [
          LO('Thank you. It helps, coming home, to see a light someone kept.', 'soft'),
        ]),
        ch('why', 'Ask where they’re going.', [
          JA('To the river.', 'shock'),
          N('Isaac looks at him. Jacob looks at his shoes.'),
          LO(
            'Well. To the river. You may as well know that much. It’s not a secret where rivers are.',
            'happy',
          ),
        ]),
        ch('nod', 'Just nod.', [
          N('The rabbi nods back, once, as if you have agreed to something larger than a lantern.'),
        ]),
      ],
    ),
    sc(
      'a30-04-lantern',
      [
        N(
          'Dvora lights the lantern, and you carry it up to the loft window. The flame stands up straight in the still air.',
        ),
        N('The lantern has a thin window of horn on each side, to keep the wind off the flame.'),
        RI('Why is it lit? Who’s it for?'),
        N('You tell her it’s for the rabbi. She takes this very seriously.'),
        RI(
          'Then I’ll mind it too. I’m good at minding things. I minded Shmuel for a whole year and he’s still alive.',
        ),
        N(
          'She sits cross-legged beside the lantern, chin in her hands. Your Nubbin sits beside her, and copies her exactly.',
        ),
      ],
      [
        ask(
          1,
          'science',
          'a lantern window lets light out and keeps wind off',
          '4-PS3-2',
          [N('Why does a lantern have thin windows of horn or glass?')],
          [
            o(
              'They let light out and keep the wind off the flame',
              [
                N(
                  'Yes. Light passes through the thin window, but moving air can’t get at the flame to blow it out.',
                ),
              ],
              true,
            ),
            o('They make the flame hotter', [
              N(
                'The window doesn’t add heat. Its job is to protect the flame and let the light through.',
              ),
            ]),
            o('They stop people seeing the light', [
              N('They do the opposite. Light shines out through them.'),
            ]),
          ],
          'Learned that a lantern window lets light through and shields a flame from wind.',
        ),
      ],
    ),
    sc(
      'a30-04-complete',
      [
        N(
          'The lantern was lit at six in the evening. At midnight the study house door opens and shuts softly.',
        ),
        N(
          'Three shapes go down the lane towards the river. Rivka is still awake, and looks at you, and looks at the lantern.',
        ),
        RI('Go on, then. I’ll mind it. You’re not very good at not following, are you?'),
      ],
      [
        ask(
          1,
          'maths',
          'time intervals: 6 pm to midnight',
          '3.MD.A.1',
          [
            N(
              'The lantern was lit at six in the evening, and it is now midnight. For how many hours has it burned?',
            ),
          ],
          [
            o(
              '6 hours',
              [N('Yes. From 6 pm to midnight is six hours: 7, 8, 9, 10, 11, 12.')],
              true,
            ),
            o('5 hours', [N('Count the hours on a clock: 7, 8, 9, 10, 11, 12. That is six.')]),
            o('12 hours', [
              N('Twelve is the clock number at midnight. From six to twelve is six hours.'),
            ]),
          ],
          'Worked out a time interval from 6 pm to midnight.',
        ),
      ],
    ),
  ],
);

// ================================================================== A30-5 Clay from the River
const A5: EduQuest = quest(
  'a30-05',
  'Clay from the River',
  {
    'a30-05-s1': G(
      'Follow the three of them to the river, at a distance.',
      'Keep well back. Stop at the willows above the bank.',
    ),
    'a30-05-s2': G(
      'Let your Nubbin help, if they’ll have it.',
      'Your Nubbin has made up its own mind. Stay on the bank.',
    ),
  },
  [
    sc(
      'a30-05-follow',
      [
        N(
          'You follow at a distance, through the sleeping lanes, out by the little water gate to the river.',
        ),
        N(
          'The Vltava is wide and black and talking to itself. It flows on north, far away, to join the great river Elbe.',
        ),
        N(
          'You stop in the willows above the bank. Your Nubbin stops too, and holds on to your trouser leg.',
        ),
        N('Below you, on the mud, three men are kneeling. They have their sleeves rolled up.'),
        N(
          'They are digging clay out of the bank with their hands, and laying it out on the ground.',
        ),
        N(
          'You can see their mouths move. You can’t hear a word over the river, and you don’t try to.',
        ),
      ],
      [
        ask(
          4,
          'social-studies',
          'why towns grow beside rivers',
          'D2.Geo.2.K-2',
          [
            N(
              'Prague grew up beside the Vltava. What could a town in the 1500s take from a river?',
            ),
          ],
          [
            o(
              'Water, fish, clay for building, and a way to travel',
              [
                N(
                  'Yes. Rivers gave people drink, food, clay and roads of water, so towns grew beside them.',
                ),
              ],
              true,
            ),
            o('Only water for the fountain', [
              N('Water was important. But look at these three men: they are digging clay, too.'),
            ]),
            o('Nothing at all', [
              N('Many places owe their very start to a river: water, food, clay and travel.'),
            ]),
          ],
          'Learned why towns grow beside rivers: water, food, building clay and travel.',
        ),
      ],
      [
        ch('closer', 'Go a little closer.', [
          N(
            'You go one tree closer, and stop. It feels like walking into a room where someone is praying.',
          ),
        ]),
        ch('stay', 'Stay where you are.', [
          N(
            'You stay in the willows. Your Nubbin looks up at you, then back down at the bank, thinking.',
          ),
        ]),
      ],
    ),
    sc(
      'a30-05-clay',
      [
        N(
          'The clay on the ground is taking a shape: a head, shoulders, two long arms. It is as long as a door.',
        ),
        N(
          'The rabbi bends over the head. The other two work at the arms and legs, smoothing, as if they were making bread.',
        ),
        N(
          'The clay is drying in the wind off the water. Isaac keeps going down to the river with cupped hands, and it’s slow.',
        ),
        N('Your Nubbin lets go of your trouser leg. Before you can stop it, it is down the bank.'),
        N(
          'It goes to the water’s edge, fills its cheeks, and trots back up to the clay. Then it wets the clay, very carefully.',
        ),
        N(
          'Isaac looks at it, then up at the willows, straight at you. Then he moves over, and makes room.',
        ),
        N(
          'Your Nubbin goes back to the river, and again, and again. You stay where you are, and the night goes on.',
        ),
      ],
      [
        ask(
          2,
          'science',
          'wet clay is soft and dry clay is hard',
          '2-PS1-1',
          [
            N(
              'Isaac keeps wetting the clay while the wind dries it. Why does the clay need to stay wet?',
            ),
          ],
          [
            o(
              'Dry clay goes hard and can’t be shaped',
              [
                N(
                  'Yes. Wet clay is soft, and dry clay is hard. They must shape it before it sets.',
                ),
              ],
              true,
            ),
            o('Wet clay is warmer', [
              N(
                'Wetness isn’t about warmth. It is about whether the clay is soft enough to shape.',
              ),
            ]),
            o('The river wants its water back', [
              N(
                'A nice thought, but the real reason is that dry clay turns hard and can’t be shaped.',
              ),
            ]),
          ],
          'Learned that clay is soft when wet and hard when dry.',
        ),
      ],
    ),
    sc(
      'a30-05-clay-done',
      [
        N(
          'Near dawn Isaac carries your Nubbin back up the bank himself, and sets it down at your feet, muddy to the ears.',
        ),
        IS('Go home. He knows you’re here. He knew before I did.', 'soft'),
      ],
      [
        ask(
          1,
          'sel',
          'whether to follow when told not to',
          'CASEL: Responsible decision-making',
          [N('The rabbi asked you not to follow, and you did. What do you think about that?')],
          [
            o('It was wrong: he asked you not to', [
              IS('That’s a fair answer. A request deserves respect, even when we are curious.'),
            ]),
            o('It was fine: nothing bad happened, and your Nubbin helped', [
              IS(
                'That’s a fair answer. Though you can’t always know it will turn out well before you go.',
              ),
            ]),
            o('It depends why he asked', [
              IS(
                'That’s a fair answer. “It’s dangerous” and “it’s private” are very different reasons.',
              ),
            ]),
          ],
          'Thought about whether it is right to follow when asked not to. No single right answer.',
        ),
      ],
    ),
    sc(
      'a30-05-complete',
      [
        N('You go home ahead of them. The lantern is still burning in the loft window.'),
        N(
          'Rivka is asleep beside it, sitting up, with one hand still held out towards it, minding.',
        ),
        N(
          'You put a blanket over her. Your Nubbin falls asleep on the end of it, still smelling of river.',
        ),
      ],
      [
        ask(
          1,
          'literacy',
          'multiple meanings of mind',
          'L.3.4',
          [N('Rivka was “minding” the lantern. Which sentence uses mind to mean look after?')],
          [
            o(
              'Please mind the baby',
              [N('Yes. To mind a baby or a lantern is to look after it.')],
              true,
            ),
            o('I changed my mind', [
              N(
                'Here, mind means the thinking part of you. It is the same word with another meaning.',
              ),
            ]),
            o('Never mind', [
              N('Here it means “don’t worry about it”. Rivka’s meaning is to look after.'),
            ]),
          ],
          'Separated three meanings of the word mind.',
        ),
      ],
    ),
  ],
  [gl('minding', 'Looking after something or someone carefully.', 'a30-05-complete')],
);

// ================================================================== A30-6 The Word
const A6: EduQuest = quest(
  'a30-06',
  'The Word',
  {
    'a30-06-s1': G(
      'Go back down to the river when the rabbi sends for you.',
      'Jacob is at the door. Go with him.',
    ),
    'a30-06-s2': G(
      'Watch the rabbi write the three letters.',
      'Stand where he puts you. Your Nubbin will want to be nearer.',
    ),
  },
  [
    sc(
      'a30-06-tellings',
      [
        N(
          'Before sunrise Jacob knocks at the door. The rabbi wants you at the river, and your Nubbin, he says, especially.',
        ),
        LO(
          'You followed. I thought you would. Come and see, then, and don’t say anything for a little while.',
        ),
        N(
          'The clay man lies on the bank under the grey sky. He is plain and smooth and as long as a door.',
        ),
        LO(
          'Some say the word goes in the mouth, some say on the brow. The tellings don’t agree. They rarely do.',
          'think',
        ),
        LO(
          'In some it is a holy Name, written on a slip of paper. We will leave that where it belongs.',
        ),
        LO(
          'Here it will be a plain word on the brow, one that anyone may read: the word for truth. Three letters. Watch which ones.',
        ),
      ],
      [
        ask(
          3,
          'social-studies',
          'why oral stories change over time',
          'D2.His.2.K-2',
          [
            N(
              'The rabbi says the tellings “rarely agree”. Why do stories change when they are told again and again?',
            ),
          ],
          [
            o(
              'People forget bits, add bits, and tell it for their listeners',
              [
                LO(
                  'Yes. Before books were common, every telling was a little different, and so a story grew.',
                ),
              ],
              true,
            ),
            o('Stories stay exactly the same', [
              LO('Not quite. A story passed from mouth to mouth changes a little each time.'),
            ]),
            o('Only liars change stories', [
              LO(
                'Most changes are not lies. They are forgetting, adding and fitting the story to the listener.',
              ),
            ]),
          ],
          'Learned that stories passed on by word of mouth change a little with every telling.',
        ),
      ],
      [
        ch('why', '“Why truth?”', [
          LO(
            'Because a guard should stand on something true. And because anyone in the lane can read it, even Shmuel.',
            'happy',
          ),
        ]),
        ch('quiet', 'Say nothing, as he asked.', [
          LO('Good. You were listening. That is most of it.', 'soft'),
        ]),
      ],
    ),
    sc(
      'a30-06-letters',
      [
        LO('Hebrew is read from the right. So the first letter goes on the right.'),
        LO(
          'Alef, א. It makes no sound of its own. It only holds a vowel, the way a cup holds water.',
        ),
        OR('Alef. The quiet one goes first.'),
        N(
          'He draws it on the clay brow with one finger. The clay is cold and takes the line cleanly.',
        ),
        LO(
          'Mem, מ, from near the middle of the alef-bet. And tav, ת, the very last letter of all.',
        ),
        N('Three letters in a row, right to left: אמת.'),
        LO(
          'Emet. Truth. The first letter, one from the middle, and the last. The old teachers liked that: truth stands on all of it.',
        ),
        OR('With its vowel marks, the word is אֱמֶת. Say it: eh-MET. It means truth.'),
        N(
          'For a moment nothing happens. Then the clay under your feet feels warm, like a step in the sun.',
        ),
        N(
          'The clay man opens his eyes. He sits up, slowly, looks at the rabbi, and waits to be told what to do.',
        ),
        IS('He’s waiting.', 'shock'),
        LO('So he is. Well. Get up, then, my friend. We’ll walk home.', 'soft'),
      ],
      [
        doit(
          7,
          'literacy',
          'the letters of emet, read from right to left',
          'L.3.4',
          'edu:order:letters:alef-mem-tav',
          [
            OR(
              'Put the letters in the order the rabbi wrote them: alef on the right, then mem, then tav on the left.',
            ),
          ],
          'Ordered alef, mem and tav as they are written, right to left, and learned the word emet, truth.',
        ),
      ],
    ),
    sc(
      'a30-06-letters-done',
      [
        N(
          'He gets up, a head taller than Isaac. He stands with his hands open at his sides, and doesn’t speak.',
        ),
        OR(
          'The alef-bet has twenty-two letters. Alef is number 1, mem is number 13, and tav is number 22.',
        ),
        JA('What do we call him?'),
        LO('Josef. A good plain name.'),
      ],
      [
        ask(
          1,
          'maths',
          'subtraction: 22 − 13',
          '2.OA.A.1',
          [N('Tav is the 22nd letter and mem is the 13th. How many letters come after mem?')],
          [
            o('9', [OR('Yes. 22 − 13 = 9 letters come after mem.')], true),
            o('10', [OR('Check it: 22 − 13 = 9. Mem itself is not counted.')]),
            o('8', [OR('Close. 22 − 13 = 9. Count on from 13 to 22 to check.')]),
          ],
          'Subtracted 13 from 22 to find how many letters follow mem in the alef-bet.',
        ),
      ],
    ),
    sc(
      'a30-06-complete',
      [
        N(
          'You walk back to the town in the first light: the rabbi, his two helpers, a tall clay man, you.',
        ),
        N(
          'Your Nubbin walks a step behind the clay man, exactly a step, the way a duckling walks behind something large.',
        ),
        N(
          'By breakfast the children of the lane have met him. By noon nobody calls him Josef: he is Yossele.',
        ),
        LO('There. He has a name the children gave him. That is worth more than mine.', 'happy'),
      ],
      [
        ask(
          3,
          'sel',
          'why a name given with love matters',
          'CASEL: Relationship skills',
          [
            N(
              'The rabbi says a name the children gave is worth more than the one he gave. Why might that be?',
            ),
          ],
          [
            o('It shows the children accepted him', [
              LO('That’s a fair answer. A nickname is a way of saying “you belong to us”.'),
            ]),
            o('A name matters most when it is used with love', [
              LO('That’s a fair answer. A name is only as good as the way people say it.'),
            ]),
            o('Children’s names are the ones that stick', [
              LO('That’s a fair answer. A name that sticks has been chosen by many voices.'),
            ]),
          ],
          'Thought about why a name given by friends can mean more than a formal one. No single right answer.',
        ),
      ],
    ),
  ],
);

// ================================================================== A30-7 Yossele’s Work
const A7: EduQuest = quest(
  'a30-07',
  'Yossele’s Work',
  {
    'a30-07-s1': G(
      'Watch Yossele at his work.',
      'He is in the courtyard. Your Nubbin is already a step behind him.',
    ),
    'a30-07-s2': G(
      'Stop the kitchen flooding.',
      'Bail, mop, and fetch the rabbi. Yossele will not stop on his own.',
    ),
    'a30-07-s3': G(
      'Give Yossele his standing order.',
      'The rabbi asks you. Choose what Yossele does when no one has told him anything.',
    ),
  },
  [
    sc(
      'a30-07-chores',
      [
        N(
          'Yossele lives in the rabbi’s house now, and works wherever he is sent. He fetches water, chops wood and sweeps.',
        ),
        N('He never speaks, and never tires. He never does one thing more than he is told.'),
        AV(
          'Told to sweep the step, he sweeps the step. Not the step next to it. I find it very restful.',
          'happy',
        ),
        N(
          'Everywhere he goes, your Nubbin goes too, a step behind. When he stops, it stops; when he turns, it turns.',
        ),
        N('He has never once looked down at it. But he has never once stepped on it either.'),
        RI('He’s like a big quiet uncle. Without the opinions.'),
      ],
      [
        ask(
          3,
          'social-studies',
          'life in the past and today: getting water',
          'D2.His.2.K-2',
          [
            N(
              'Yossele fetches water every day. In Prague then, where did most families get theirs?',
            ),
          ],
          [
            o(
              'From wells, carried home in buckets',
              [N('Yes. Most homes had no taps, so water was carried, bucket by bucket.')],
              true,
            ),
            o('From a tap in the kitchen', [
              N('Taps came much later. Then, someone had to fetch every drop.'),
            ]),
            o('From the rain only', [
              N('Rain helped, but families also relied on wells and the river.'),
            ]),
          ],
          'Compared how people got water long ago (wells, buckets) with today (taps).',
        ),
      ],
    ),
    sc(
      'a30-07-flood',
      [
        DV('Yossele, fill the barrel for me, there’s a dear. I’ll be back before you know it.'),
        N('The barrel holds sixty litres, and Yossele’s bucket holds five.'),
        N('He fills the barrel. Then he fills it again, because nobody has told him to stop.'),
        N(
          'Water runs over the rim, across the kitchen, under the door, and out into the lane in a bright sheet.',
        ),
        N('Yossele goes on fetching, steady as a mill wheel, through his own flood.'),
        N(
          'You bail with a pan. Your Nubbin bails with its cheeks, which is no help at all, and very sincere.',
        ),
        DV('Oh, no. No, no, no. Yossele! That’s enough! Enough!', 'shock'),
        N('He doesn’t stop. She isn’t the one who made him.'),
        N(
          'Then the rabbi is at the door with his sleeves wet to the elbow, and says, “Stop.” Yossele sets the bucket down.',
        ),
      ],
      [
        ask(
          2,
          'maths',
          'division: 60 ÷ 5',
          '3.OA.A.3',
          [
            N(
              'The barrel holds 60 litres and each bucket holds 5. How many bucketfuls fill it exactly?',
            ),
          ],
          [
            o('12', [N('Yes. 60 ÷ 5 = 12. After the twelfth bucket, the barrel is full.')], true),
            o('10', [
              N('Check: 10 × 5 = 50, which is not yet 60. You need 12 buckets, since 12 × 5 = 60.'),
            ]),
            o('15', [N('15 × 5 = 75, which is too much. 12 × 5 = 60, so twelve.')]),
          ],
          'Divided 60 by 5 to find how many bucketfuls fill a barrel.',
        ),
      ],
    ),
    sc(
      'a30-07-flood-done',
      [
        DV('My kitchen. My good floor. My onions are floating.', 'sad'),
        N(
          'She looks at you, soaked to the knees, and hands you an apron. Too late, but kindly meant.',
        ),
        DV('Keep it. You’ve earned it. You’ll need it again, in this house.'),
      ],
      [
        ask(
          1,
          'literacy',
          'what a character’s actions show about her',
          'RL.3.3',
          [
            N(
              'Dvora gives you an apron after the flood, “too late, but kindly meant”. What does that show about her?',
            ),
          ],
          [
            o(
              'She is kind even when she is upset',
              [
                DV(
                  'Yes. Her kitchen is ruined, and she still thinks of you. That tells us a lot about her.',
                ),
              ],
              true,
            ),
            o('She is angry with you', [
              DV('Look again: she gives you a gift. That is kindness, not anger.'),
            ]),
            o('She wants you to leave', [
              DV(
                'Look again: she has just handed you a gift. People don’t give aprons to guests they want gone.',
              ),
            ]),
          ],
          'Inferred a character’s kindness from what she does while upset.',
        ),
      ],
    ),
    sc(
      'a30-07-order',
      [
        N(
          'That evening the rabbi sits on the study house step with you, and watches Yossele sweeping the lane in the dusk.',
        ),
        LO(
          'He does what he’s told, and only that. So when nobody tells him anything, he stands and waits. For hours.',
        ),
        LO(
          'A thing that only waits is a sad thing to have made. He should have something of his own to do.',
          'think',
        ),
        LO('One standing order. For when no one else has told him anything. You choose it.'),
        LO(
          'You came to the river when you were told not to. I think that makes you the right person to ask.',
          'happy',
        ),
        N(
          'Yossele has stopped sweeping, and your Nubbin, a step behind him, has stopped too. They are both waiting.',
        ),
      ],
      [
        ask(
          3,
          'sel',
          'is a helper who only obeys the best helper',
          'CASEL: Responsible decision-making',
          [
            N(
              'Yossele does exactly what he is told, and only that. Is that the best kind of helper?',
            ),
          ],
          [
            o('Yes, you always know what he will do', [
              LO(
                'That’s a fair answer. It is restful. But what happens when the instructions run out?',
              ),
            ]),
            o('No, a helper should use their own judgement too', [
              LO(
                'That’s a fair answer. Some jobs need someone who can see what is needed and stop in time.',
              ),
            ]),
            o('It depends on the job', [
              LO(
                'That’s a fair answer. Sweeping a step is one thing. Looking after a lane is another.',
              ),
            ]),
          ],
          'Thought about whether a helper who only obeys is the best helper. No single right answer.',
        ),
      ],
      [
        ch(
          'safe',
          '“Keep everyone safe.”',
          [
            LO('Keep everyone safe. That’s what I made him for. Well, then.', 'soft'),
            N(
              'The rabbi says it to Yossele, quietly. Yossele turns and looks down the lane, at every door in it, one by one.',
            ),
          ],
          { 'a30-order': 'safe' },
        ),
        ch(
          'help',
          '“Help where you’re asked.”',
          [
            LO('Help where you’re asked. Modest. Dvora will be glad.', 'happy'),
            N(
              'The rabbi tells him. Yossele picks the broom up again, and holds it, ready, looking from door to door.',
            ),
          ],
          { 'a30-order': 'help' },
        ),
        ch(
          'sit',
          '“Sit with the little ones.”',
          [
            LO('The little ones. You mean the children, and this one. Hm.', 'think'),
            N(
              'The rabbi tells him, and Yossele looks down, for the first time, at your Nubbin. Then he sits on the step beside it.',
            ),
          ],
          { 'a30-order': 'sit' },
        ),
      ],
    ),
    sc(
      'a30-07-complete',
      [
        N(
          'Dvora hangs the onions up to dry from the kitchen beam, all in a row, as if that had been the plan all along.',
        ),
        AV('He fills barrels very well. Nobody can say he doesn’t fill barrels.'),
        N(
          'You go up to the loft in your new apron, still damp at the hem. Your Nubbin is asleep before you are.',
        ),
      ],
      [
        ask(
          0,
          'science',
          'comparing ways to store onions',
          '3-5-ETS1-2',
          [
            N(
              'Dvora hangs the wet onions in a row from the beam, instead of leaving them in a heap. Why is that a better way to dry them?',
            ),
          ],
          [
            o(
              'Air can reach every onion',
              [
                DV(
                  'Yes. Moving air carries the damp away, so the onions dry instead of rotting in a heap.',
                ),
              ],
              true,
            ),
            o('The beam makes them warmer', [
              DV(
                'The beam is just a hook. It is the air all round each onion that does the drying.',
              ),
            ]),
            o('It looks neater', [DV('Neat is nice, but the real reason is the air.')]),
          ],
          'Compared two ways to dry onions, a heap and a hanging row, and chose the one that lets air reach each onion.',
        ),
      ],
    ),
  ],
);

// ================================================================== A30-8 The Night Guard
const A8: EduQuest = quest(
  'a30-08',
  'The Night Guard',
  {
    'a30-08-s1': G(
      'Walk the night round with Yossele.',
      'Every lane, every gate, once. Your Nubbin will try to keep up.',
    ),
    'a30-08-s2': G(
      'Stand with Yossele at the end of the street.',
      'He knows where to stand. Stand behind him.',
    ),
  },
  [
    sc(
      'a30-08-round',
      [
        N(
          'At night Yossele walks the lanes of the Jewish Town, end to end, gate to gate. Tonight you walk with him.',
        ),
        N(
          'The round goes once all the way round a block of lanes, fifty metres long and thirty metres wide.',
        ),
        N(
          'He goes slowly, and never stops. The houses are dark, and the cobbles are wet, and your footsteps are the only ones.',
        ),
        N(
          'At every gate he puts his hand flat on the wood for a moment, as if to feel whether it is cold.',
        ),
        N(
          'Your Nubbin keeps up for three lanes. On the fourth it sits down in the road, and holds up both arms.',
        ),
        N('Yossele stops. Nobody has told him what to do about this.'),
        N(
          'You lift your Nubbin up and set it on his shoulder, and he walks on. It holds on to his ear, and is asleep in a minute.',
        ),
      ],
      [
        ask(
          1,
          'maths',
          'perimeter of a rectangle',
          '3.MD.D.8',
          [
            N(
              'The round goes once all the way round a block that is 50 m long and 30 m wide. How far is that?',
            ),
          ],
          [
            o('160 m', [N('Yes. 50 + 30 + 50 + 30 = 160 metres, or 2 × (50 + 30).')], true),
            o('80 m', [N('That is only two sides, 50 + 30. All four sides make 160 metres.')]),
            o('1,500 m', [
              N(
                'That is 50 × 30, the area in square metres. Perimeter adds the four sides: 50 + 30 + 50 + 30 = 160 m.',
              ),
            ]),
          ],
          'Found the perimeter of a 50 m by 30 m block: 160 metres.',
        ),
      ],
    ),
    sc(
      'a30-08-street-end',
      [
        N(
          'At the street’s end there is lantern light again, beyond the gate. Voices, more than last time.',
        ),
        N(
          'Yossele walks to the middle of the street and stands there, in the light, as tall as a door. He does nothing at all.',
        ),
        N('Your Nubbin is still asleep on his shoulder, with one ear in its mouth.'),
        N('The voices stop. For a long moment nobody on the far side moves.'),
        N(
          'Then the lanterns turn, one by one, and go away up the hill, the way lanterns go when people decide they are tired.',
        ),
        N(
          'Yossele stands there till the last one is gone. Then he turns, and goes on with the round.',
        ),
      ],
      [
        ask(
          5,
          'sel',
          'whether standing there is protecting',
          'CASEL: Social awareness',
          [
            N(
              'Yossele did nothing but stand there, and the men went home. Does a guard who only stands still protect anyone?',
            ),
          ],
          [
            o('Yes, being there is enough to keep people safe', [
              AV(
                'That’s a fair answer. Sometimes the sight of someone calm and strong is all it takes.',
              ),
            ]),
            o('No, a guard must do something', [
              AV('That’s a fair answer. But notice that nobody was hurt, and nobody had to act.'),
            ]),
            o('It depends on who is watching', [
              AV('That’s a fair answer. A guard only protects if people know he is there.'),
            ]),
          ],
          'Thought about whether simply being present can protect. No single right answer.',
        ),
      ],
      [
        ch('behind', 'Stand close behind him.', [
          N(
            'You stand at his back, close enough to touch. He is warm, like a wall at the end of a sunny day.',
          ),
        ]),
        ch('foot', 'Hold your Nubbin’s dangling foot.', [
          N(
            'You reach up and hold your Nubbin’s foot. It curls its toes round your finger in its sleep.',
          ),
        ]),
      ],
    ),
    sc(
      'a30-08-complete',
      [
        N(
          'Word goes round the lanes by breakfast. Nobody says much about it, but everybody says they slept well.',
        ),
        AV('I slept like a stone. First time in a month. I dreamt about keys.', 'happy'),
        LO('He didn’t have to do anything. That’s the best kind of guard there is.', 'soft'),
        N(
          'Avram gives you a small lantern with a horn window, for walking the round. Your Nubbin takes it and won’t give it back.',
        ),
      ],
      [
        ask(
          1,
          'health',
          'what helps us sleep when we are worried',
          'CASEL: Self-management',
          [
            N(
              'Avram hadn’t slept for a month because he was worried. What helps us sleep when we are worried?',
            ),
          ],
          [
            o(
              'Telling someone, slow breaths and a calm bedtime',
              [AV('Yes. Sharing the worry and settling the body both help the mind to rest.')],
              true,
            ),
            o('Staying up and thinking harder', [
              AV('Thinking harder usually keeps us awake. Calm and company work better.'),
            ]),
            o('Eating a big meal late', [
              AV('A heavy meal at night can make sleep harder. Calm and company work better.'),
            ]),
          ],
          'Learned that telling someone, breathing slowly and a calm bedtime help us sleep when worried.',
        ),
      ],
    ),
  ],
);

// ================================================================== A30-9 Fridays
const A9: EduQuest = quest(
  'a30-09',
  'Fridays',
  {
    'a30-09-s1': G(
      'Find Yossele before the Sabbath comes in.',
      'Friday afternoon. Everyone is hurrying. Yossele isn’t.',
    ),
    'a30-09-s2': G('Help the rabbi lay Yossele down to rest.', 'Gently. Support his head.'),
  },
  [
    sc(
      'a30-09-friday',
      [
        N(
          'Friday afternoon. The whole lane is hurrying: floors swept, pots on, children scrubbed whether they like it or not.',
        ),
        N(
          'Hannah’s plaited loaves go past the window in baskets, shining. Everyone is getting ready for the Sabbath.',
        ),
        DV(
          'The rabbi will want Yossele before sunset. Go and find him, will you? I’ve got four things on the fire.',
        ),
        N('Your Nubbin knows exactly where he is. It sets off at a run, and you follow.'),
        N('You find him at the caretaker’s door, where the children are.'),
        N('Behind you, the rabbi is already coming down the lane, wiping ink off his fingers.'),
      ],
      [
        ask(
          1,
          'social-studies',
          'the Sabbath as a day of rest',
          'D2.His.2.K-2',
          [N('Everyone is hurrying to be ready before sunset. What is the Sabbath for?')],
          [
            o(
              'A day to stop working and rest, together',
              [
                DV(
                  'Yes. It starts at sunset on Friday, and everything is ready beforehand so that everyone, even Yossele, can rest.',
                ),
              ],
              true,
            ),
            o('A day for the longest journeys', [
              DV('Quite the opposite. It is a day to stay and rest, not to rush about.'),
            ]),
            o('A day for the hardest work', [
              DV('It is the one day when work stops. That is why Friday is so busy.'),
            ]),
          ],
          'Learned that the Sabbath is a day of rest that begins at sunset on Friday.',
        ),
      ],
    ),
    sc(
      'a30-09-rest',
      [
        LO('Yossele. Come and lie down.'),
        N(
          'He comes, and lies down on a blanket in the rabbi’s back room, as long as a door. You hold his head as it goes down.',
        ),
        LO('Every week, before the Sabbath. Everything rests on the Sabbath. Even this.'),
        N(
          'The rabbi reaches over and rubs out the first letter, the alef. It comes away under his thumb like flour.',
        ),
        N('Two letters are left on the brow: מת, met. Dead.'),
        OR(
          'With its vowel marks, that is מֵת. Take the silent alef from אֱמֶת, “truth”, and the word left means “dead”.',
        ),
        N(
          'Yossele closes his eyes, and the warmth goes out of him slowly, like a stove at night. The clay is only clay.',
        ),
        N('Your Nubbin climbs up beside the clay and puts its paw on the arm, and keeps it there.'),
      ],
      [
        ask(
          5,
          'literacy',
          'one letter can change a word',
          'L.3.4',
          [
            N(
              'Rubbing out one letter changed emet into met. Take the first letter off “plane”. What word is left?',
            ),
          ],
          [
            o(
              'lane',
              [
                OR(
                  'Yes. One letter off the front makes a new word. In Hebrew, losing alef changed “truth” into “dead”.',
                ),
              ],
              true,
            ),
            o('plan', [
              OR(
                'That takes the last letter off. Take away the first letter, p, and “lane” is left.',
              ),
            ]),
            o('pane', [OR('That swaps a letter instead. Take the p away and “lane” is left.')]),
          ],
          'Saw that removing one letter can change a word completely, as alef does to emet.',
        ),
      ],
      [
        ch('blanket', 'Pull the blanket up over him.', [
          LO('Yes. I do that too. I don’t know who it’s for.', 'soft'),
        ]),
        ch('ask', '“Does he know?”', [
          LO('I don’t know. I have never known. I only know that he is clay again.', 'think'),
          LO('It is one letter. That is all there ever is between the two.'),
        ]),
      ],
    ),
    sc(
      'a30-09-rest-done',
      [
        N(
          'On Saturday night, when three stars are out, the rabbi writes the alef again. Yossele opens his eyes and sits up.',
        ),
        N(
          'Your Nubbin is waiting by the door, and falls in a step behind him as if it had never been away.',
        ),
        N(
          'Say the Sabbath began at half past four on Friday, and ended at half past five on Saturday, when the stars came out.',
        ),
      ],
      [
        ask(
          2,
          'maths',
          'time intervals across two days',
          '3.MD.A.1',
          [
            N(
              'The Sabbath began at 4:30 pm on Friday and ended at 5:30 pm on Saturday. How long was it?',
            ),
          ],
          [
            o(
              '25 hours',
              [
                N(
                  'Yes. 4:30 pm Friday to 4:30 pm Saturday is 24 hours, and one more hour makes 25.',
                ),
              ],
              true,
            ),
            o('24 hours', [
              N('Close. 24 hours takes us to 4:30 pm Saturday. One more hour makes 25.'),
            ]),
            o('26 hours', [N('Count again: 24 hours, then one more hour to 5:30 pm. That is 25.')]),
          ],
          'Worked out a time interval from Friday 4:30 pm to Saturday 5:30 pm: 25 hours.',
        ),
      ],
    ),
    sc(
      'a30-09-complete',
      [
        N(
          'It happens every Friday after that. You learn to hold his head, and the rabbi learns to let you.',
        ),
        LO('You have good hands for it. Slow ones. Most people hurry the slow things.', 'soft'),
        N(
          'Dvora lights the candles. The lane goes quiet, the way it only does on Friday night, as if the whole town has sat down.',
        ),
      ],
      [
        ask(
          1,
          'sel',
          'what slow things deserve patience',
          'CASEL: Self-management',
          [
            N(
              'The rabbi says most people hurry the slow things. What slow things do you think deserve our patience?',
            ),
          ],
          [
            o('Learning something hard', [
              LO(
                'That’s a fair answer. Skills grow slowly, and rushing them often means doing them badly.',
              ),
            ]),
            o('Friendships', [LO('That’s a fair answer. Trust is built a little at a time.')]),
            o('Looking after someone who needs us', [
              LO('That’s a fair answer. Care can’t be hurried.'),
            ]),
          ],
          'Thought about which slow things deserve patience. No single right answer.',
        ),
      ],
    ),
  ],
  [
    gl(
      'Sabbath',
      'The Jewish day of rest, from Friday at sunset to Saturday after dark.',
      'a30-09-friday',
    ),
  ],
);

// ================================================================== A30-10 The Forgotten Friday
const A10: EduQuest = quest(
  'a30-10',
  'The Forgotten Friday',
  {
    'a30-10-s1': G(
      'Get through Friday afternoon. The rabbi has been called away.',
      'Help in the house. The rabbi will be back before sunset. He always is.',
    ),
    'a30-10-s2': G(
      'Wait in the synagogue courtyard as the Sabbath comes in.',
      'The rabbi went straight to the synagogue from the far end of town. Watch the lane.',
    ),
    'a30-10-s3': G(
      'Run for the rabbi.',
      'To the synagogue door. Avram is there; he can fetch him.',
    ),
  },
  [
    sc(
      'a30-10-called',
      [
        N(
          'Another Friday. You are helping Dvora when a boy comes running up the lane, out of breath.',
        ),
        BO(
          'Rabbi! Rabbi Loew! At the far end of the town, by the old cemetery. A baby’s coming, and it’s slow.',
        ),
        BO(
          'The family asks will you come and sit with them. They’re frightened. They asked for you.',
        ),
        LO('Of course. Of course I’ll come.'),
        N(
          'He goes at once, as he is, with his coat half on. He doesn’t look back at the rabbi’s house.',
        ),
        N('Yossele is standing in the courtyard, waiting. Nobody has told him anything.'),
      ],
      [
        ask(
          2,
          'science',
          'young need care from parents',
          '1-LS1-2',
          [
            N(
              'A foal can stand within an hour or so of being born. A human baby takes about a year to walk. What does that tell us?',
            ),
          ],
          [
            o(
              'Human babies need care for a long time',
              [
                N(
                  'Yes. Babies are helpless at first, and their families look after them for years.',
                ),
              ],
              true,
            ),
            o('Foals are cleverer than people', [
              N('Not cleverer. Different animals are born ready for different things.'),
            ]),
            o('Babies do not need anything', [
              N('They need a great deal: milk, warmth, safety and love.'),
            ]),
          ],
          'Compared how quickly a foal and a human baby can move, and learned that human babies need long care.',
        ),
      ],
      [
        ch('ask', '“What about Yossele?”', [
          N('But the rabbi is already round the corner, and nobody hears the question but you.'),
        ]),
        ch('pots', 'Help Dvora with the pots.', [
          N(
            'You scrub, and stir, and fetch. The afternoon goes the way Friday afternoons do, all at once.',
          ),
        ]),
      ],
    ),
    sc(
      'a30-10-called-done',
      [DV('He’ll be back. He’s never once been late for the Sabbath. Not once in thirty years.')],
      [
        ask(
          0,
          'sel',
          'how trust is earned',
          'CASEL: Relationship skills',
          [
            N(
              'Dvora trusts the rabbi because he has never once been late. How do people earn trust?',
            ),
          ],
          [
            o(
              'By doing what they said, again and again',
              [DV('Yes. Trust is built from many small promises kept.')],
              true,
            ),
            o('By saying they can be trusted', [
              DV('Words are a start, but it is what we do, week after week, that earns it.'),
            ]),
            o('By being the oldest', [
              DV('Age doesn’t decide it. It is the promises kept that count.'),
            ]),
          ],
          'Learned that trust is earned by keeping our word again and again.',
        ),
      ],
    ),
    sc(
      'a30-10-psalm',
      [
        N(
          'The sun is low over the roofs. The baby came, a girl, and the rabbi has hurried straight to the synagogue.',
        ),
        N(
          'From inside the old synagogue comes the murmur of men praying. Then they begin Psalm 92, the psalm for the Sabbath day.',
        ),
        N(
          'You are in the courtyard with the children. The Sabbath is coming in, the way it does, like a tide.',
        ),
        N('Rivka looks down the lane towards the rabbi’s house. Then she grabs your sleeve.'),
        RI('He didn’t. Did he? He didn’t lay Yossele down.', 'shock'),
        N(
          'The rabbi had forgotten. Yossele had not been put to rest, and the day of rest had come.',
        ),
        N('Down the lane, in the rabbi’s courtyard, something begins to move.'),
      ],
      [
        ask(
          2,
          'literacy',
          'understanding a simile',
          'L.4.5',
          [N('The Sabbath comes in “like a tide”. What do the Sabbath and a tide have in common?')],
          [
            o(
              'Both arrive slowly and steadily and can’t be stopped',
              [
                N(
                  'Yes. A tide creeps in at its own pace, and so does the evening that begins the Sabbath.',
                ),
              ],
              true,
            ),
            o('Both are made of water', [
              N('The Sabbath isn’t water. The comparison is about the way it arrives.'),
            ]),
            o('Both are very loud', [
              N(
                'Tides can be quiet, and the Sabbath comes in softly. It is the slow, steady arrival they share.',
              ),
            ]),
          ],
          'Explained what a simile compares: the slow, steady arrival of the Sabbath and a tide.',
        ),
      ],
    ),
    sc(
      'a30-10-fetch',
      [
        N(
          'You run. Through the courtyard, to the synagogue door, where Avram stands with his keys.',
        ),
        N('Your heart thumps hard in your chest.'),
        AV('What? What is it?'),
        N(
          'You don’t have to say. He looks past you, down the lane, and goes in without another word.',
        ),
        N(
          'The murmur stops. Then the rabbi is in the doorway, without his coat, and running, which you have never seen.',
        ),
        N('He goes down the lane straight to Yossele, and doesn’t slow down, and reaches up.'),
        N(
          'He rubs out the alef, and two letters are left. The great clay man stands still for one breath.',
        ),
        N(
          'Then he falls, all at once, like a wall of sand when the tide goes out, and is only clay in the lane.',
        ),
        N(
          'Nobody is hurt. Things are broken, and the lane is a mess, and nobody, nobody at all, is hurt.',
        ),
      ],
      [
        ask(
          1,
          'health',
          'why the heart beats faster when we run',
          '4-LS1-1',
          [N('Your heart is thumping after the run. Why does a heart beat faster when you run?')],
          [
            o(
              'Working muscles need more oxygen, so it pumps blood faster',
              [
                N(
                  'Yes. Your blood carries oxygen to your muscles. When they work hard, the heart pumps faster to keep up.',
                ),
              ],
              true,
            ),
            o('It is trying to stop', [
              N('Not at all. It speeds up to send more blood to your working muscles.'),
            ]),
            o('It is tired of beating', [
              N(
                'A heart never takes a day off. It beats faster because your muscles need more oxygen.',
              ),
            ]),
          ],
          'Learned that the heart beats faster when we run, to carry more oxygen to working muscles.',
        ),
      ],
    ),
    sc(
      'a30-10-complete',
      [
        N(
          'The lane is very quiet. The clay lies in a long heap across the cobbles, with two letters on what was a brow.',
        ),
        N(
          'The rabbi stands over it, out of breath, with his hand on the cold clay. He doesn’t say anything for a long time.',
        ),
        LO('I forgot. A baby was born, and I was so glad, and I forgot him.', 'sad'),
        LO('Come. They’re waiting. The Sabbath doesn’t wait, and nor should we.', 'soft'),
      ],
      [
        ask(
          2,
          'sel',
          'forgiving a mistake made out of gladness',
          'CASEL: Self-awareness',
          [
            N(
              'The rabbi forgot because he was busy being glad about a baby. Does that make forgetting easier or harder to forgive?',
            ),
          ],
          [
            o('Easier, because his reason was kind', [
              LO(
                'That’s a fair answer. A kind reason doesn’t undo the mistake, but it does matter.',
              ),
            ]),
            o('The same, because the lane still broke', [
              LO('That’s a fair answer. What happened is what happened, whatever the reason.'),
            ]),
            o('It depends on whether he learns from it', [
              LO('That’s a fair answer. Being sorry and doing better is how we mend a mistake.'),
            ]),
          ],
          'Thought about whether a kind reason makes a mistake easier to forgive. No single right answer.',
        ),
      ],
    ),
  ],
  [gl('psalm', 'A song or poem of praise, from the Bible’s book of Psalms.', 'a30-10-psalm')],
);

// ================================================================== A30-11 Twice
const A11: EduQuest = quest(
  'a30-11',
  'Twice',
  {
    'a30-11-s1': G(
      'Wait at the synagogue door while they begin again.',
      'Sit on the step. You don’t need to do anything.',
    ),
    'a30-11-s2': G(
      'Go home to the Sabbath table.',
      'Dvora has kept your places. There is nothing you need to do tonight.',
    ),
  },
  [
    sc(
      'a30-11-again',
      [
        N('The rabbi goes back into the synagogue. The men follow him in, and the door closes.'),
        N(
          'You sit on the step outside with your Nubbin. Inside, there is a pause, and then a single voice begins.',
        ),
        N(
          'They are saying the psalm again, from the very start, as if the first time had not happened.',
        ),
        N(
          'You hear it twice tonight, the same psalm. It comes through the old wall as a murmur, low and steady, like rain.',
        ),
        N(
          'They still do, the legend says. In that synagogue, they say that psalm twice, every Friday, to this day.',
        ),
        N(
          'Your Nubbin leans against your side. It is shivering a little, though the evening is warm.',
        ),
      ],
      [
        ask(
          3,
          'literacy',
          'refrain and repeated lines',
          'RL.2.4',
          [
            N(
              'A line or phrase that comes round again and again in a song or poem has a special name. What is it?',
            ),
          ],
          [
            o(
              'A refrain',
              [
                N(
                  'Yes. A refrain returns, like a chorus. Repeating makes a song easy to remember and gives it a steady beat.',
                ),
              ],
              true,
            ),
            o('A riddle', [N('A riddle is a puzzle. A repeated line is a refrain.')]),
            o('A review', [
              N('A review is an opinion about something. A repeated line is a refrain.'),
            ]),
          ],
          'Learned that a repeated line in a song or poem is a refrain.',
        ),
      ],
    ),
    sc(
      'a30-11-table',
      [
        N(
          'At Avram’s house the candles are lit and the table is laid with a white cloth. Hannah’s loaf sits under its cover.',
        ),
        N(
          'Nobody talks about the lane. Avram blesses the wine, and the bread, and passes it round.',
        ),
        SH('Is Yossele dead?'),
        DV(
          'Tomorrow. We’ll talk about Yossele tomorrow night. Tonight is the Sabbath, and we rest, even from that.',
          'soft',
        ),
        N('Shmuel thinks about this, and nods, and eats his bread.'),
        N(
          'Your Nubbin sits on the bench between Rivka and you, and nobody asks it to do anything at all.',
        ),
      ],
      [
        ask(
          3,
          'social-studies',
          'customs of a Sabbath meal',
          'D2.His.2.K-2',
          [N('Which of these belong to the Sabbath table in Avram’s house?')],
          [
            o(
              'Lit candles, a white cloth, blessings, and a covered plaited loaf',
              [
                DV(
                  'Yes. These are the signs that the Sabbath has begun, and that the family rests together.',
                ),
              ],
              true,
            ),
            o('A loud party with a band', [
              DV(
                'Not a band. The Sabbath table has blessings and shared bread, and families often sing together.',
              ),
            ]),
            o('Everyone cooking at once', [
              DV('The cooking is done before sunset. At the table everyone rests.'),
            ]),
          ],
          'Named customs of a Sabbath meal: candles, a cloth, blessings and plaited bread.',
        ),
      ],
      [
        ch('eat', 'Eat, and say nothing.', [
          N(
            'You eat. The bread is soft and sweet, and better than anything you have eaten all week.',
          ),
        ]),
        ch('share', 'Give your Nubbin half your bread.', [
          N('Your Nubbin eats it very slowly, as if it knows this is not an ordinary loaf.'),
        ]),
      ],
    ),
    sc(
      'a30-11-complete',
      [
        N(
          'Late, the rabbi comes by, but doesn’t come in. He stands at the window a moment, looking at the table, at the candles.',
        ),
        LO('Good. Good. Rest. That’s the whole of it.', 'soft'),
        N(
          'He goes home up the lane, slowly. He walks round the place where the clay is, and doesn’t look at it.',
        ),
      ],
      [
        ask(
          1,
          'sel',
          'whether resting is a way of doing something',
          'CASEL: Self-management',
          [
            N(
              'The rabbi says, “Rest. That’s the whole of it.” Can resting be a way of doing something important?',
            ),
          ],
          [
            o('Yes, it keeps us well and kind', [
              LO('That’s a fair answer. A rested person is gentler and wiser than a tired one.'),
            ]),
            o('No, resting is just stopping', [
              LO(
                'That’s a fair answer. But think: the whole town stops together, and that is a powerful thing.',
              ),
            ]),
            o('Sometimes it is the hardest thing to do', [
              LO('That’s a fair answer. Stopping when there is work to do takes real trust.'),
            ]),
          ],
          'Thought about whether rest is a kind of doing. No single right answer.',
        ),
      ],
    ),
  ],
  [
    gl(
      'refrain',
      'A line or phrase that returns again and again in a song or poem.',
      'a30-11-again',
    ),
  ],
);

// ================================================================== A30-12 The Attic
const A12: EduQuest = quest(
  'a30-12',
  'The Attic',
  {
    'a30-12-s1': G(
      'Hold the lantern at the foot of the attic steps.',
      'Saturday night, once three stars are out. Stand where the light reaches the top.',
    ),
    'a30-12-s2': G(
      'Stay with your Nubbin at the foot of the wall.',
      'It won’t come away yet. Sit down next to it, and wait.',
    ),
  },
  [
    sc(
      'a30-12-stars',
      [
        N('Saturday night. Three stars are out over the steep roof, and the Sabbath is over.'),
        N(
          'The rabbi, Isaac and Jacob carry the clay up the lane on a door, the way you would carry someone home.',
        ),
        AV(
          'The attic. He wants it in the attic. I’ve brought the key I never knew the door for.',
          'soft',
        ),
        N(
          'It fits. Avram looks at it in the lock for a moment, as if it had been waiting twenty years to be useful.',
        ),
        N(
          'You hold the lantern at the foot of the steps. The three of them carry the clay up into the dark.',
        ),
        N(
          'Up there, the old pages are stacked and laid in rows, worn-out books that held holy words, put to rest.',
        ),
        N(
          'They lay the clay among them, gently, and cover it over with pages, the way you’d tuck in a child.',
        ),
        N('People still say that the clay is up there, resting among the old books, to this day.'),
      ],
      [
        ask(
          0,
          'science',
          'why we see stars only when it is dark',
          '5-ESS1-2',
          [N('Three stars are out. Why can we see stars at night, but not at noon?')],
          [
            o(
              'They are there all day, but daylight is too bright to see them',
              [
                N(
                  'Yes. Stars shine all day too. The Sun’s light scattered through the air drowns them out until it is dark.',
                ),
              ],
              true,
            ),
            o('Stars only exist at night', [
              N('They are always there. Daylight is too bright for us to see them.'),
            ]),
            o('The Moon pushes them away', [
              N('The Moon doesn’t move them. It is the brightness of daylight that hides them.'),
            ]),
          ],
          'Learned that stars are always there, but daylight is too bright for us to see them.',
        ),
      ],
    ),
    sc(
      'a30-12-steps',
      [
        N(
          'The rabbi comes down last. At the bottom he turns and speaks to everyone in the courtyard.',
        ),
        LO(
          'Nobody is to go up there. Not for curiosity, not for courage, not for anything. Let him rest.',
        ),
        N(
          'Isaac and Jacob take the steps away, one by one, and carry them off. The attic door is high in the wall now.',
        ),
        N(
          'The attic is a genizah, a place where worn-out holy books are kept with respect, not thrown away.',
        ),
        N('Your Nubbin sits down at the foot of the wall, right under the door, and looks up.'),
        N(
          'It doesn’t move when you call it. It doesn’t move when Avram goes in, or when the lamps go out.',
        ),
        N('So you sit down next to it, on the cold cobbles, and wait.'),
      ],
      [
        ask(
          3,
          'social-studies',
          'treating worn-out holy books with respect',
          'D2.Civ.8.K-2',
          [
            N(
              'Why do people keep worn-out holy books in a genizah, instead of throwing them in the rubbish?',
            ),
          ],
          [
            o(
              'Out of respect for the words they hold',
              [
                N(
                  'Yes. Words that matter deeply to people are treated with care, even when the pages are worn.',
                ),
              ],
              true,
            ),
            o('Because attics have lots of spare room', [
              N('Room isn’t the reason. It is about respect for the words.'),
            ]),
            o('Because books never wear out', [
              N('They do wear out, which is exactly why there is a place to lay them to rest.'),
            ]),
          ],
          'Learned that a genizah keeps worn-out holy books respectfully.',
        ),
      ],
      [
        ch('arm', 'Put your arm round it.', [N('It leans into you, and keeps looking up.')]),
        ch('call', 'Call it once more, softly.', [
          N('It looks at you, and then back up at the door. It isn’t ready, and nor are you.'),
        ]),
      ],
    ),
    sc(
      'a30-12-steps-done',
      [
        N(
          'Near midnight the rabbi comes back out, with a blanket, and sits down on the other side of your Nubbin.',
        ),
        LO('I thought there would be someone here. I hoped so.', 'soft'),
        N(
          'The three of you sit under the wall a long time, saying nothing. Then your Nubbin gets up, and lets you take it home.',
        ),
      ],
      [
        ask(
          1,
          'sel',
          'why company helps when we are sad',
          'CASEL: Relationship skills',
          [
            N(
              'Nobody said anything, and it still helped. Why does it help to have someone sit with us when we are sad?',
            ),
          ],
          [
            o('We don’t feel alone', [
              LO('That’s a fair answer. Sadness is lighter when it is shared.'),
            ]),
            o('They might say the right thing', [
              LO('That’s a fair answer. Though often the right thing is simply to stay.'),
            ]),
            o('It gives us time to feel it', [
              LO('That’s a fair answer. A quiet friend lets us feel what we need to feel.'),
            ]),
          ],
          'Thought about why quiet company helps when we are sad. No single right answer.',
        ),
      ],
    ),
    sc(
      'a30-12-complete',
      [
        N(
          'In the morning there is a little heap of river clay at the foot of the wall, where your Nubbin sat.',
        ),
        N('Nobody sweeps it away. Not Avram, not Dvora, not anyone, all week.'),
      ],
      [
        ask(
          1,
          'literacy',
          'what people’s actions show about their feelings',
          'RL.2.3',
          [
            N(
              'Nobody sweeps the clay away, not for a whole week. What does that show about how they feel?',
            ),
          ],
          [
            o(
              'They want to remember him',
              [N('Yes. Leaving the clay where it is, is their way of keeping Yossele in mind.')],
              true,
            ),
            o('They are all too tired to sweep', [
              N('A week is a long time to be tired. They are choosing to leave it.'),
            ]),
            o('They don’t care', [N('Their care is exactly why it stays there.')]),
          ],
          'Inferred feelings from what characters do and do not do.',
        ),
      ],
    ),
  ],
  [gl('genizah', 'A place where worn-out holy books are kept with respect.', 'a30-12-steps')],
);

// ================================================================== A30-13 What the Rabbi Says
const A13: EduQuest = quest(
  'a30-13',
  'What the Rabbi Says',
  {
    'a30-13-s1': G(
      'Sit with the rabbi on the study house bench.',
      'A week later. He has kept a place for you.',
    ),
    'a30-13-s2': G(
      'Go and see what Rivka has made for you.',
      'She is at the caretaker’s door, holding something behind her back.',
    ),
  },
  [
    sc(
      'a30-13-bench',
      [
        N(
          'A week later. The rabbi sits on the bench outside the study house in the sun, and moves over to make room.',
        ),
        LO(
          'I have been thinking about my clay man. I think about very little else. My students have noticed.',
          'think',
        ),
        LO(
          'He was a good guard. He did what he was told, and only that. I wanted that. I asked for it.',
        ),
        LO(
          'But a thing that only obeys has no brakes of its own. All its brakes are in your hands. And hands forget.',
          'sad',
        ),
        LO(
          'I am not the first, you know. In Chełm, they say, a rabbi made one before me, and it grew, and kept growing.',
        ),
        LO(
          'He was afraid it would fill the world. So he rubbed out the word, very gently, and his clay man lay down and went still for good.',
        ),
        LO('He had more sense than me. He did it before anyone had to run.'),
      ],
      [
        ask(
          4,
          'social-studies',
          'compass directions on a map',
          'D2.Geo.2.K-2',
          [
            N(
              'Chełm is a town in eastern Poland, east of Prague. If you travelled from Prague to Chełm, which way would you head?',
            ),
          ],
          [
            o(
              'East',
              [LO('Yes. Chełm lies to the east of Prague, more than six hundred kilometres away.')],
              true,
            ),
            o('West', [LO('West would take you away from it. Chełm lies to the east of Prague.')]),
            o('South', [LO('Prague to Chełm is mostly eastward. A compass would point east.')]),
          ],
          'Used compass directions: Chełm is east of Prague.',
        ),
        ask(
          6,
          'sel',
          'who should hold the brakes',
          'CASEL: Responsible decision-making',
          [
            N(
              'The rabbi says a thing that only obeys has no brakes of its own, so its maker holds them. Who do you think should hold the brakes?',
            ),
          ],
          [
            o('The maker, always', [LO('That’s a fair answer. But hands forget, as he says.')]),
            o('The one who is made, in time', [
              LO('That’s a fair answer. A being with its own brakes can stop itself.'),
            ]),
            o('Both, together', [
              LO('That’s a fair answer. Two sets of brakes are safer than one.'),
            ]),
          ],
          'Thought about who should hold the brakes on something powerful. No single right answer.',
        ),
      ],
      [
        ch('baby', '“You were glad about the baby.”', [
          LO(
            'I was. I am. I would forget him again, for her. That is the worst of it, and the best.',
            'soft',
          ),
        ]),
        ch('sit', 'Sit with him, and say nothing.', [
          N(
            'So you sit. After a while he pats your knee, twice, and that is the conversation finished.',
          ),
        ]),
      ],
    ),
    sc(
      'a30-13-tile',
      [
        N(
          'Rivka is waiting at the door with both hands behind her back, which means it’s a present.',
        ),
        RI(
          'I took some of the clay from under the wall. Only a little. From the outside, not the attic. Nobody said not to.',
        ),
        N(
          'She holds out a small square tile, six centimetres along each side, pressed flat and dried in the sun.',
        ),
        N('There are three letters on it, a bit wobbly. אמת, emet. Alef first, on the right.'),
        RI('I did the alef first, like the rabbi. So it’s true. So it stays.'),
        N(
          'She has made a little clay bird as well, out of the last scrap. It has a very fat tummy and no feet.',
        ),
        RI(
          'That one’s for your Nubbin. It doesn’t do anything. It just sits there. That’s the point of it.',
        ),
      ],
      [
        ask(
          2,
          'maths',
          'area of a square: 6 × 6',
          '3.MD.C.7',
          [N('The tile is a square, six centimetres along each side. What is its area?')],
          [
            o(
              '36 square centimetres',
              [RI('Yes. 6 × 6 = 36 little squares, each one centimetre by one centimetre.')],
              true,
            ),
            o('24 square centimetres', [RI('That is 4 × 6, the perimeter. Area is 6 × 6 = 36.')]),
            o('12 square centimetres', [RI('That is 6 + 6. Area multiplies: 6 × 6 = 36.')]),
          ],
          'Found the area of a 6 cm square tile: 6 × 6 = 36 square centimetres.',
        ),
      ],
    ),
    sc(
      'a30-13-complete',
      [
        N(
          'Rivka walks you to the end of the lane, where the page begins to go thin and brown at the edges.',
        ),
        N(
          'Behind you the steep roof of the synagogue stands against the evening, and high in its gable, the attic window.',
        ),
        N(
          'The shutter of the attic window has been closed, and barred across from the inside. Nobody remembers doing it.',
        ),
        N(
          'It looks like a door holding itself shut, the way he held the lane. Safe, and nobody in, and nobody out.',
        ),
        N(
          'Your Nubbin looks up at the window for a long time. Then it takes your hand, which it doesn’t often do.',
        ),
        N(
          'You are back in the Grove, the atlas on your knee. Your pocket is heavier by one clay tile, still cool, as if nobody has told it where it is.',
        ),
      ],
      [
        ask(
          3,
          'sel',
          'safe is not the same as well',
          'CASEL: Responsible decision-making',
          [
            N(
              'A barred shutter is very safe, but nobody can come in or out. What does being well need, as well as safety?',
            ),
          ],
          [
            o(
              'Freedom, friends, and a door that opens',
              [N('Yes. Safe keeps harm out. Well also lets in company, play and change.')],
              true,
            ),
            o('Nothing, safe is enough', [
              N(
                'Safe is very important. But a house that is barred from the inside is not a home.',
              ),
            ]),
            o('More locks', [
              N('More locks make it safer, not better. Being well needs the door to open too.'),
            ]),
          ],
          'Thought about the difference between being safe and being well.',
        ),
      ],
    ),
  ],
);

// ================================================================== variants
/**
 * One EduScene per ATLAS_A30_VARIANTS entry (20 in all). Each variant’s domain differs from the
 * scenes either side of it, so the no-two-in-a-row rule holds on every path:
 * - a30-01-ember     between a30-01-page (social studies) and a30-01-page-done (feelings)
 * - a30-09-order-*   between a30-09-friday (social studies) and a30-09-rest (literacy)
 * - a30-10-grow-*    between a30-10-psalm (literacy) and a30-10-ember / a30-10-fetch (science / health)
 * - a30-10-ember     between the grow insert and a30-10-fetch; a30-10-ember-settle after fetch
 * - a30-margin-hazel after a30-12-complete (literacy), before a30-13-bench (social studies first)
 * - a30-13-order-*   after a30-13-bench (which ends on feelings), then kept (feelings) or tile (maths)
 * - a30-13-kept      between the order insert (literacy) and a30-13-tile (maths)
 * - a30-13-tile-paw  after a30-13-tile (maths); the complete scenes (feelings) follow
 * - the Grove keepsake scenes follow the complete scene (feelings), so they are literacy
 */
export const EDU_A30_READER_VARIANTS: EduScene[] = [
  // ---------------------------------------------------------------- A30-1 insert (cinder)
  sc(
    'a30-01-ember',
    [
      N(
        'Your Nubbin is carrying its little lantern, with the red pebble glowing in it. Dvora bends to look.',
      ),
      DV('A coal that needs no fire. Well. Don’t put it near my curtains, whatever it is.'),
      N(
        'Your Nubbin holds the lantern a little closer to itself, the way you hold something lent.',
      ),
    ],
    [
      notice(
        1,
        'science',
        'light and heat are energy moving away from a glowing thing',
        '4-PS3-2',
        [
          OR(
            'Anything that glows gives out light, and often heat too. Both are energy moving away from whatever makes them.',
          ),
          OR(
            'Hold your hand near a lamp and you can feel it. Dvora is right to keep the curtains away.',
          ),
        ],
        'Learned that a glowing object gives out light and heat, which are energy moving away from it.',
      ),
    ],
  ),
  // ---------------------------------------------------------------- A30-9 order inserts
  sc(
    'a30-09-order-safe',
    [
      N(
        'Yossele is standing in the caretaker’s doorway with one arm across it, like a bar on a gate.',
      ),
      N(
        'Behind his arm Shmuel and Mirele are bouncing, trying to get out to the lane. He doesn’t move.',
      ),
      SH('He won’t let us out! We only want to see the bread!', 'angry'),
      N(
        'Gently, completely, he keeps them in. Every time one of them ducks under, he lifts them back with one hand.',
      ),
      DV(
        'He’s started doing that. Every door, all afternoon. They’re safe, I suppose. They’re very safe.',
        'think',
      ),
    ],
    [
      ask(
        4,
        'sel',
        'safe is not the same as well',
        'CASEL: Responsible decision-making',
        [
          N(
            'Yossele keeps the children safe by keeping them in. What else do children need to be well?',
          ),
        ],
        [
          o(
            'Play, fresh air and friends',
            [
              DV(
                'Yes. Safe matters, but a child shut in all day isn’t well. Play and company matter too.',
              ),
            ],
            true,
          ),
          o('Nothing, safe is enough', [
            DV('Safe is very important. But a well child can also run, play and choose.'),
          ]),
          o('More bars on the door', [
            DV('More bars make it safer, but they don’t make anyone happier.'),
          ]),
        ],
        'Thought about the difference between being safe and being well.',
      ),
    ],
  ),
  sc(
    'a30-09-order-help',
    [
      N(
        'Yossele is sweeping the caretaker’s step. It is very clean, as if it has been swept a great many times.',
      ),
      N(
        'Every neighbour who passes says “Yossele, would you…” and he would. He has a basket, two buckets and a broom.',
      ),
      RI(
        'Old Mrs Weiss asked him to carry her chair in, and he carried her in too. She was sitting in it.',
      ),
      N(
        'Behind him, in a neat row, are six chairs nobody asked to be moved. He has started helping before he’s asked.',
      ),
    ],
    [
      ask(
        3,
        'maths',
        'division: 6 ÷ 2',
        '3.OA.A.3',
        [
          N(
            'Yossele carries two chairs at a time, and there are six. How many trips does he make?',
          ),
        ],
        [
          o('3', [RI('Yes. 6 ÷ 2 = 3 trips, with two chairs each time.')], true),
          o('4', [RI('Check it: 4 trips of two would be 8 chairs. 6 ÷ 2 = 3.')]),
          o('2', [RI('2 trips of two is only 4 chairs. He needs 3 trips for 6.')]),
        ],
        'Divided 6 chairs into groups of 2 to find 3 trips.',
      ),
    ],
  ),
  sc(
    'a30-09-order-sit',
    [
      N(
        'Yossele is sitting on the caretaker’s step, as long as the step. Three children are sitting with him.',
      ),
      N(
        'Shmuel is on one knee and Mirele on the other, and Rivka is leaning on his arm, telling him a long story.',
      ),
      N('Your Nubbin is asleep in his lap, on its back, with its paws in the air.'),
      MI('He doesn’t talk. But he listens properly. Not like Papa.', 'happy'),
      N(
        'Yossele doesn’t move. He has been sitting like this since noon, very still, so nobody falls.',
      ),
    ],
    [
      ask(
        3,
        'sel',
        'what makes a good listener',
        'CASEL: Relationship skills',
        [N('Mirele says Yossele “listens properly”. What makes someone a good listener?')],
        [
          o(
            'They stay still, look at you and don’t interrupt',
            [MI('Yes. A good listener gives you their whole attention and lets you finish.')],
            true,
          ),
          o('They talk louder than you', [
            MI('That isn’t listening. A good listener lets you speak.'),
          ]),
          o('They think about something else', [
            MI('Then they are not listening at all. Good listeners pay attention.'),
          ]),
        ],
        'Named what makes a good listener.',
      ),
    ],
  ),
  // ---------------------------------------------------------------- A30-10 grow inserts
  sc(
    'a30-10-grow-safe',
    [
      N(
        'Yossele is going down the lane, door to door, shutting each one with his hand flat on it. Then the next.',
      ),
      N('Every time he moves he is a little taller. The cobbles crack under his feet.'),
      N(
        'He drags Hannah’s cart across the end of the lane, and the gate behind it, and holds them there. Nobody in, nobody out.',
      ),
      N(
        'People call from behind their shutters, and he doesn’t hear them. He is keeping everyone safe, and he is getting bigger.',
      ),
      RI(
        'He’s shut the whole lane in! Mama’s behind one of those doors, and the rabbi doesn’t know!',
        'shock',
      ),
    ],
    [
      ask(
        4,
        'social-studies',
        'fairness: everyone should be free to come and go',
        'D2.Civ.8.K-2',
        [N('Yossele has shut everyone in. Why is that unfair, even though he means well?')],
        [
          o(
            'Everyone should be free to open their own door',
            [
              N(
                'Yes. Fairness means people can come and go from their own homes. Good intentions don’t change that.',
              ),
            ],
            true,
          ),
          o('It is fair, because he is strong', [
            N('Being strong doesn’t make a rule fair. Fair rules are ones people can live with.'),
          ]),
          o('It isn’t unfair, it is only noisy', [
            N('The noise is the sound of people who cannot get out. That is the unfairness.'),
          ]),
        ],
        'Thought about fairness and freedom: shutting people in is not fair, even with kind intentions.',
      ),
    ],
  ),
  sc(
    'a30-10-grow-help',
    [
      N(
        'Yossele is doing everything at once. Sweeping the lane, fetching water, chopping wood, faster and faster.',
      ),
      N(
        'Every time he moves he is a little taller. The broom snaps in his hands; he picks up another, and that snaps too.',
      ),
      N(
        'The woodpile goes to splinters and the water barrel splits. Hannah’s oven door comes off its hinges.',
      ),
      N('Nobody has asked him. He is helping, and helping, and helping, and he is getting bigger.'),
      DV('My pots! He’s scrubbing my pots! He’s scrubbing them into pieces!', 'shock'),
    ],
    [
      ask(
        4,
        'maths',
        'multiplication: 4 × 3',
        '3.OA.A.1',
        [
          N(
            'Say Yossele scrubs four pots, and each one breaks into three pieces. How many pieces are there?',
          ),
        ],
        [
          o(
            '12',
            [DV('Yes. Four groups of three is 4 × 3 = 12 pieces. That is a lot of mending.')],
            true,
          ),
          o('7', [DV('That adds 4 + 3. Four pots with three pieces each is 4 × 3 = 12.')]),
          o('9', [DV('Close, but three threes is 9 and there are four pots. 4 × 3 = 12.')]),
        ],
        'Used equal groups: 4 pots with 3 pieces each make 12 pieces.',
      ),
    ],
  ),
  sc(
    'a30-10-grow-sit',
    [
      N(
        'In the rabbi’s courtyard Yossele is sitting on the step, with your Nubbin in his lap. He is restless.',
      ),
      N('He grows a little as you watch, then a little more. The step cracks under him.'),
      N(
        'He stands up. Very carefully, before anything else, he lifts your Nubbin and sets it down on the step, on its feet.',
      ),
      N(
        'Then he goes. Barrels roll, the fence goes over, the woodpile spills across the cobbles, and he is getting bigger.',
      ),
      RI('He put it down first. Did you see? He put it down first.', 'shock'),
    ],
    [
      ask(
        4,
        'sel',
        'noticing care for someone smaller',
        'CASEL: Social awareness',
        [
          N(
            'Yossele is wild and strong, and still he puts your Nubbin down gently first. What does that show?',
          ),
        ],
        [
          o(
            'He cares about someone smaller than him',
            [
              RI(
                'Yes. Even in the middle of the trouble, he is careful with the one who is little.',
              ),
            ],
            true,
          ),
          o('He doesn’t want to carry it', [
            RI('If he didn’t care, he would simply drop it. He set it down on its feet.'),
          ]),
          o('It was an accident', [
            RI('Nothing about it looks accidental. It was done carefully, and first.'),
          ]),
        ],
        'Noticed that gentle, careful behaviour shows care for someone smaller.',
      ),
    ],
  ),
  sc(
    'a30-10-ember',
    [
      N(
        'In your Nubbin’s little lantern the red pebble flares up, bright and hot, as Yossele grows.',
      ),
      N(
        'Your Nubbin holds the lantern away from itself with both arms, and looks at you. It knows that light.',
      ),
    ],
    [
      ask(
        1,
        'science',
        'light and heat are both forms of energy',
        '4-PS3-2',
        [N('The pebble flares and the lantern grows warm. What are the light and the warmth?')],
        [
          o(
            'Two ways energy moves away from the pebble',
            [N('Yes. The pebble sends out energy as light you can see and heat you can feel.')],
            true,
          ),
          o('Two different pebbles', [
            N('It is one pebble, giving out two kinds of energy: light and heat.'),
          ]),
          o('Nothing, it is only for show', [
            N('A flare is energy leaving the pebble as light and heat.'),
          ]),
        ],
        'Learned that light and heat are both ways energy moves away from a glowing thing.',
      ),
    ],
  ),
  sc(
    'a30-10-ember-settle',
    [
      N(
        'In the little lantern the red pebble dims, slowly, back to its own small glow. It settles, like someone sitting down.',
      ),
      N('Your Nubbin holds it close again.'),
    ],
    [
      ask(
        1,
        'science',
        'a dimmer glow gives out less energy',
        '4-PS3-2',
        [N('The pebble has settled back to a small glow. What has changed?')],
        [
          o(
            'It gives out less light and less heat',
            [N('Yes. A dimmer glow sends out less energy as light and heat.')],
            true,
          ),
          o('It gives out more light', [N('The opposite. A smaller glow sends out less.')]),
          o('It has stopped being a pebble', [
            N('It is still the same pebble. It is only glowing more softly.'),
          ]),
        ],
        'Noticed that a dimmer glow gives out less light and heat.',
      ),
    ],
  ),
  // ---------------------------------------------------------------- A30-12, after complete
  sc(
    'a30-margin-hazel',
    [
      N(
        'Nova’s atlas lies open at the steep roof of the synagogue, and the little window high in its gable.',
      ),
      N(
        'Beside the window, in faint pencil you have never noticed, there is a note in the margin. You know the hand.',
      ),
      N('“Clay, a word, and a man who forgot one Friday. I’d have forgotten every Friday.”'),
      N('Your Nubbin puts one paw on the drawing of the attic window, and leaves it there.'),
    ],
    [
      ask(
        2,
        'sel',
        'being honest about our own faults',
        'CASEL: Self-awareness',
        [N('Hazel says she would have forgotten every Friday. What does that show about her?')],
        [
          o(
            'She can be honest about her own faults, and laugh',
            [N('Yes. Admitting what we are bad at, kindly, is a sign of a settled heart.')],
            true,
          ),
          o('She is boasting', [
            N('Boasting would be saying she is brilliant. She is owning up to a weakness.'),
          ]),
          o('She doesn’t care about the story', [
            N('The note shows she read it closely, and saw herself in it.'),
          ]),
        ],
        'Noticed that admitting our own faults with humour is a sign of self-awareness.',
      ),
    ],
  ),
  // ---------------------------------------------------------------- A30-13 order inserts
  sc(
    'a30-13-order-safe',
    [
      LO(
        'You told him to keep everyone safe. And he did. On that last night he kept the whole lane in.',
        'soft',
      ),
      LO('A guard who keeps everyone in isn’t a guard any more. He’s a wall.'),
      LO('And a wall, however kind, is not a home. A home has a door that opens.', 'think'),
      LO(
        'It was a good order. It was the order I gave him myself, in my heart. That’s why I know.',
      ),
    ],
    [
      ask(
        2,
        'literacy',
        'understanding a metaphor',
        'L.4.5',
        [N('“A wall is not a home” is a metaphor. What does the rabbi mean?')],
        [
          o(
            'Safety without freedom isn’t a home',
            [LO('Yes. A home is safe and open. A wall is only safe.')],
            true,
          ),
          o('Walls are made of bricks, homes of wood', [
            LO('He isn’t talking about building materials. The words stand for something else.'),
          ]),
          o('Homes should have no walls', [
            LO('Homes need walls for shelter. His point is that walls alone aren’t a home.'),
          ]),
        ],
        'Explained a metaphor: a wall without a door stands for safety without freedom.',
      ),
    ],
  ),
  sc(
    'a30-13-order-help',
    [
      LO(
        'You told him to help where he was asked. And at the end he helped where nobody asked at all.',
      ),
      N('He laughs a little, sadly, and shakes his head.'),
      LO('He was a very good servant. That was the trouble.', 'sad'),
      LO(
        'Help with no one asking for it isn’t help. It’s weather. Dvora’s pots would agree with me.',
      ),
    ],
    [
      ask(
        3,
        'literacy',
        'understanding a metaphor',
        'L.4.5',
        [N('“It isn’t help, it’s weather.” What is the rabbi comparing?')],
        [
          o(
            'Unwanted help to weather that just happens to you',
            [
              LO(
                'Yes. You can’t ask the weather to stop. Help nobody asked for just lands on you.',
              ),
            ],
            true,
          ),
          o('Help to the rain, because both are wet', [
            LO('It isn’t about being wet. It is about something you didn’t choose.'),
          ]),
          o('Dvora to the weather', [
            LO('Dvora is only the one whose pots are broken. The comparison is help and weather.'),
          ]),
        ],
        'Explained a metaphor: help nobody asked for is like weather, something that simply happens to you.',
      ),
    ],
  ),
  sc(
    'a30-13-order-sit',
    [
      LO(
        'You told him to sit with the little ones. I’ve been thinking about that most of all.',
        'think',
      ),
      LO(
        'Everything in him, I put there. The clay, the word, the work. Even the order was put there, by you.',
      ),
      LO('But at the end, wild as he was, he put your little one down on the step before he went.'),
      LO(
        'Nobody told him to do that. I didn’t put that there. It is the only thing in him I didn’t.',
        'soft',
      ),
      N('Your Nubbin, at your feet, is looking at the attic window.'),
    ],
    [
      ask(
        3,
        'literacy',
        'finding the theme',
        'RL.4.2',
        [N('What is the rabbi’s big idea here, the theme?')],
        [
          o(
            'The best thing in a person may be what nobody put there',
            [LO('Yes. Kindness he chose for himself was the part no one made.')],
            true,
          ),
          o('Clay is stronger than people', [
            LO(
              'The story isn’t about strength. It is about what the clay man did that nobody told him to do.',
            ),
          ]),
          o('Orders should always be kept', [
            LO('The rabbi says the opposite: the best thing came from outside any order.'),
          ]),
        ],
        'Found a theme: the best thing in a person may be what nobody put there.',
      ),
    ],
  ),
  sc(
    'a30-13-kept',
    [
      N('The rabbi looks at your pocket, where the stone is. You hadn’t thought it showed.'),
      LO('You carry something. Heavy, for its size. What is it?'),
    ],
    [
      ask(
        1,
        'sel',
        'private things and secrets that worry us',
        'CASEL: Responsible decision-making',
        [N('It is fine to keep some things private. If a secret worries you, what should you do?')],
        [
          o(
            'Tell a grown-up I trust',
            [
              LO(
                'Yes. Private is fine, but a worry that grows is best shared with someone we trust.',
              ),
            ],
            true,
          ),
          o('Keep it forever, whatever happens', [
            LO(
              'Private things can stay private. A worrying secret is different: it should be shared.',
            ),
          ]),
          o('Tell everyone I meet', [LO('That isn’t wise either. Choose one person you trust.')]),
        ],
        'Talked about the difference between a private matter and a secret that worries us.',
      ),
    ],
    [
      ch('tell', 'Tell him about the stone.', [
        N(
          'You tell him, and it hums one word, safe, while you talk. He listens to the end, and doesn’t interrupt.',
        ),
        LO('Some things are made to protect. And then they have to be put somewhere high.', 'soft'),
        LO('There’s no shame in carrying them up the steps. I did.'),
      ]),
      ch('keep', 'Keep it to yourself.', [
        LO('Then keep it. You’re allowed.', 'soft'),
        LO(
          'Only, some things are made to protect, and then have to be put somewhere high. There’s no shame in carrying them up the steps.',
        ),
      ]),
    ],
  ),
  sc(
    'a30-13-tile-paw',
    [
      N('Beside the three letters there is a tiny pawprint, pressed into the corner of the tile.'),
      RI(
        'Your Nubbin did that. I was holding it out to show it, and it put its paw on. I didn’t smooth it.',
        'happy',
      ),
    ],
    [
      ask(
        1,
        'science',
        'prints in soft mud and clay become fossils',
        '3-LS4-1',
        [
          N(
            'A print pressed into soft clay stays when the clay dries. Footprints in mud can turn to rock over a very long time. What do such fossils tell us?',
          ),
        ],
        [
          o(
            'How animals lived and moved long ago',
            [
              RI(
                'Yes. A fossil footprint is a record of an animal that walked there, long before us.',
              ),
            ],
            true,
          ),
          o('How much the animal weighed to the gram', [
            RI('Prints can hint at size, but not exact weight. They show how animals moved.'),
          ]),
          o('Nothing, they are only marks', [
            RI('They tell scientists a great deal about how animals lived.'),
          ]),
        ],
        'Learned that fossil footprints in rock tell us how animals lived long ago.',
      ),
    ],
  ),
  sc(
    'a30-13-complete-help',
    [
      ...[
        N(
          'Rivka walks you to the end of the lane, where the page begins to go thin and brown at the edges.',
        ),
        N(
          'Behind you the steep roof of the synagogue stands against the evening, and high in its gable, the attic window.',
        ),
      ],
      N(
        'On the sill outside the attic window, high up where nobody can reach, a broom leans against the wall.',
      ),
      N('Nobody knows how it got there. Nobody has tried to fetch it down.'),
      N(
        'Your Nubbin looks up at the window for a long time. Then it takes your hand, which it doesn’t often do.',
      ),
      N(
        'You are back in the Grove, the atlas on your knee. Your pocket is heavier by one clay tile, still cool, as if nobody has told it where it is.',
      ),
    ],
    [
      ask(
        4,
        'sel',
        'safe is not the same as well',
        'CASEL: Responsible decision-making',
        [
          N(
            'A broom left leaning on a sill: help that has been put down. What does being well need, as well as being helped?',
          ),
        ],
        [
          o(
            'Choice, and someone who listens',
            [N('Yes. Help works best when it is asked for, and when it listens.')],
            true,
          ),
          o('More helpers, faster', [
            N('More and faster helpers is what went wrong. Help needs to be asked for.'),
          ]),
          o('Nobody to help at all', [
            N('Help is good. It simply needs to be wanted, and to stop in time.'),
          ]),
        ],
        'Reflected on what helps well: help that is asked for, and that listens.',
      ),
    ],
  ),
  sc(
    'a30-13-complete-sit',
    [
      N(
        'Rivka walks you to the end of the lane, where the page begins to go thin and brown at the edges.',
      ),
      N(
        'Behind you the steep roof of the synagogue stands against the evening, and high in its gable, the attic window.',
      ),
      N(
        'On the sill of the attic window, high up where nobody can reach, there is a small clay bird. A child’s.',
      ),
      N(
        'Rivka looks up at it, and then at you, and doesn’t say anything. She only had enough clay for one, she said.',
      ),
      N(
        'Your Nubbin looks up at the window for a long time. Then it takes your hand, which it doesn’t often do.',
      ),
      N(
        'You are back in the Grove, the atlas on your knee. Your pocket is heavier by one clay tile, still cool, as if nobody has told it where it is.',
      ),
    ],
    [
      ask(
        4,
        'sel',
        'what a small, kind thing can mean',
        'CASEL: Responsible decision-making',
        [N('A little clay bird on the sill: made to sit, and to do nothing. What might it mean?')],
        [
          o(
            'Being with someone can matter more than doing for them',
            [N('Yes. Sitting with someone, without a job to do, is a kind of care.')],
            true,
          ),
          o('That clay birds can fly', [
            N('It doesn’t fly. That is its point: it is about being there, not doing.'),
          ]),
          o('That Rivka ran out of clay', [
            N('She did, in a way, but the bird stands for something more: being with someone.'),
          ]),
        ],
        'Reflected on how being with someone can matter as much as doing for them.',
      ),
    ],
  ),
  // ---------------------------------------------------------------- Grove keepsake scenes
  sc(
    'a30-grove-tile-cinder',
    [
      N(
        'You set the clay tile on the cottage hearth, beside Hazel’s old clay tablets, the ones about the Heartstone.',
      ),
      N(
        'Moss comes in from the step, and stops beside it. He looks at the three letters for a long time.',
      ),
      M('She’d have liked him. That’s the trouble with her.', 'soft'),
      N(
        'He goes back out to his flat stone. Your Nubbin puts its night-round lantern down beside the tile, and leaves it there.',
      ),
    ],
    [
      ask(
        2,
        'literacy',
        'what two characters have in common',
        'RL.3.3',
        [N('Moss says “she” would have liked Yossele. What do Cinder and Yossele have in common?')],
        [
          o(
            'Both were protectors who grew too strong to be safe',
            [
              M(
                'Yes. Both loved the ones they guarded, and both grew too strong for it to stay safe.',
              ),
            ],
            true,
          ),
          o('Both are made of clay', [
            M('Only Yossele is clay. What they share is how they protected.'),
          ]),
          o('Both live in the Grove', [
            M('Yossele never did. What they share is what they were for.'),
          ]),
        ],
        'Compared two characters by what they have in common.',
      ),
    ],
  ),
  sc(
    'a30-grove-tile',
    [
      N(
        'You set the clay tile on the cottage hearth, beside Hazel’s old clay tablets, the ones about the Heartstone.',
      ),
      N(
        'Moss comes in from the step, and stops beside it. You tell him what the letters say, and what one letter less says.',
      ),
      M('Truth, and then one letter less. That’s how close it always is.', 'soft'),
      N(
        'He goes back out to his flat stone. Your Nubbin sits by the hearth and looks at the tile until it gets dark.',
      ),
    ],
    [
      ask(
        2,
        'literacy',
        'which letter turns emet into met',
        'L.3.4',
        [
          N(
            'You told Moss “what one letter less says”. Which letter do you take away to turn emet into met?',
          ),
        ],
        [
          o(
            'Alef',
            [M('Yes. Take away the silent alef, the first letter, and “truth” becomes “dead”.')],
            true,
          ),
          o('Mem', [
            M(
              'Take mem away and only alef and tav are left. It is alef that goes, leaving mem and tav.',
            ),
          ]),
          o('Tav', [
            M('Tav is the last letter, and it stays. It is the first letter, alef, that goes.'),
          ]),
        ],
        'Remembered that taking away alef turns emet (truth) into met (dead).',
      ),
    ],
  ),
  sc(
    'a30-grove-tile-quiet',
    [
      N(
        'You set the clay tile on the cottage hearth, beside Hazel’s old clay tablets, the ones about the Heartstone.',
      ),
      N(
        'There is nobody in the cottage to tell what the letters say. You say it anyway, out loud: truth, and then one letter less.',
      ),
      N('Your Nubbin sits by the hearth and looks at the tile until it gets dark.'),
    ],
    [
      ask(
        1,
        'literacy',
        'which Hebrew word means truth',
        'L.3.4',
        [N('You said two words aloud: emet and met. Which of them means truth?')],
        [
          o(
            'Emet',
            [N('Yes. Emet is truth. Met is what is left when the first letter goes.')],
            true,
          ),
          o('Met', [N('Met means dead. Emet, the longer word, means truth.')]),
        ],
        'Recalled that emet means truth and met means dead.',
      ),
    ],
  ),
];

// ================================================================== exports
export const EDU_A30_READER: EduQuest[] = [A1, A2, A3, A4, A5, A6, A7, A8, A9, A10, A11, A12, A13];

/** Every `edu:` check string used by the lessons above. */
export const CHECKS: string[] = ['edu:order:letters:alef-mem-tav'];
