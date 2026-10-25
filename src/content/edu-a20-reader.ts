/**
 * The Learning Grove, reader band (ages 7–10): Atlas page A20, The Weeping (Baldr and the
 * Fimbulwinter, Snorri Sturluson’s Prose Edda, Iceland).
 *
 * Source: atlas-a20.ts (ATLAS_A20 and ATLAS_A20_VARIANTS). One EduScene per original scene (every
 * step scene, done scene, complete scene and variant), id `reader:<original id>`, with every choice
 * kept under its original id and `set` flag (`a20-thokk`). Reader keeps all choices, so no
 * `defaultChoice` is needed. See EDU-STYLE.md. British spelling.
 *
 * The scene lines are the main game’s own words, kept in its voice. The five lines that quoted
 * Brodeur’s 1916 translation are replaced by the script’s own `childLines`, and the line that
 * introduced them is reworded. One plain line is added after Baldr’s fall: he is dead, his body
 * has stopped working, and it will not start again. Nothing is quoted from Snorri or Brodeur.
 *
 * Learning angles, from the outline: geography (Iceland and its place in the North Atlantic,
 * compass directions, Iceland’s volcanoes, glaciers and plates), history (Snorri and his
 * vellum book about 800 years ago, the Thing and Iceland’s Althing, ship burials, weekday names,
 * horses as transport), science (why frost “weeps”: melting against condensation, why mistletoe
 * grows on other trees, why winter days are short in the far north, dew, sound and vibration,
 * friction, gravity, light and reflection, salmon, lava tubes and plates), maths (fractions,
 * division and multiplication, area, time intervals, temperature, units of volume), language
 * (simile, metaphor, personification, motif, theme, vocabulary), and feelings (grief, anger,
 * loyalty, honesty, pity, safe against well).
 *
 * Think questions (`ask` with no `best`) in every quest, and a `sel` lesson in every quest.
 *
 * Care notes kept: the Norse gods are shown with dignity as Snorri’s book is “one telling”, and
 * Heathenry is named as a living religion today. No runes or other symbols. Baldr and Nanna die
 * plainly and gently, with comfort straight after. Loki’s binding is the same softened scene as in
 * the main game. Ragnarok is seen only from far off. The mistletoe is a real plant, with no
 * kissing story.
 * Facts used: Iceland lies north-west of Scotland, just south of the Arctic Circle; Snorri wrote
 * the Prose Edda in the 1220s, on vellum; Iceland’s Althing began in 930; Earth’s tilt causes
 * short winter days (the winter solstice is about 21 December, and Reykjavík then has about four
 * hours of daylight); 0°C is 32°F; 1 litre is 1000 millilitres; mistletoe is a partial parasite;
 * Iceland sits where two tectonic plates pull apart; Atlantic salmon return to their birth river
 * to breed; fresh snow absorbs sound; linen comes from flax stems; the Oseberg ship burial is in
 * Norway, about 1,200 years old; Tuesday to Friday are named for Tiw, Woden, Thor and Frige, the
 * early English forms of Týr, Odin, Thor and Frigg.
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
const FR = say('a20-frigg');
const FU = say('a20-fulla');
const BA = say('a20-baldr');
const HO = say('a20-hodr');
const TH = say('a20-thor');
const OD = say('a20-odin');
const CR = say('a20-crone');
const VO = say('a20-voice');
const HE = say('a20-hermodr');
const NA = say('a20-nanna');
const MO = say('a20-modgudr');
const HL = say('a20-hel');
const MS = say('a20-messenger');
const TK = say('a20-thokk');
const SI = say('a20-sigyn');
const LI = say('a20-lif');
const LT = say('a20-lifthrasir');
const VI = say('a20-vidarr');

// ---------------------------------------------------------------- builders
type Beat = Omit<Lesson, 'id'>;
type Opt = NonNullable<Lesson['options']>[number];

const MAX_WORDS = 30;
const MAX_CHARS = 160;
const wc = (t: string) => t.trim().split(/\s+/).length;
const fits = (t: string) => wc(t) <= MAX_WORDS && t.length <= MAX_CHARS;

/**
 * Cuts lines at sentence ends so that every line keeps to the reader caps (30 words and 160
 * characters; narration at most two sentences). A cut line keeps its speaker, and its mood stays
 * on the first piece. `map[i]` is the index of the last piece of original line i, so a lesson’s
 * `after` can follow.
 */
const split = (lines: Line[]): { lines: Line[]; map: number[] } => {
  const out: Line[] = [];
  const map: number[] = [];
  for (const l of lines) {
    const sentences = l.text.split(/(?<=[.!?”)…])\s+(?=[\p{Lu}“(‘])/u);
    const chunks: string[] = [];
    let count = 0;
    const limit = l.who === 'narrator' ? 2 : 99;
    for (const sentence of sentences) {
      const last = chunks[chunks.length - 1];
      if (last !== undefined && count < limit && fits(`${last} ${sentence}`)) {
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
const opt = (label: string, reply: Line[], best = false): Opt =>
  best ? { label, best, reply } : { label, reply };

const ask = (
  after: number,
  domain: EduDomain,
  standard: string,
  skill: string,
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

const notice = (
  after: number,
  domain: EduDomain,
  standard: string,
  skill: string,
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

/** One reader scene. Lesson ids are `reader:<of>-l<n>`, numbered in play order. */
const sc = (
  of: string,
  lines: Line[],
  beats: Beat[],
  extra: { choices?: Choice[] } = {},
): EduScene => {
  const cut = split(lines);
  return {
    id: `reader:${of}`,
    of,
    band: 'reader',
    lines: cut.lines,
    ...(extra.choices
      ? { choices: extra.choices.map((c) => (c.then ? { ...c, then: sp(c.then) } : c)) }
      : {}),
    lessons: [...beats]
      .sort((a, b) => a.after - b.after)
      .map((b, i) => ({
        id: `reader:${of}-l${i + 1}`,
        ...b,
        after: cut.map[b.after] ?? b.after,
        ...(b.prompt ? { prompt: sp(b.prompt) } : {}),
        ...(b.lines ? { lines: sp(b.lines) } : {}),
        ...(b.options ? { options: b.options.map((o) => ({ ...o, reply: sp(o.reply) })) } : {}),
      })),
  };
};

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

// ================================================================== A20-1 The Bright One
const Q01 = quest(
  'a20-01',
  'The Bright One',
  {
    'a20-01-s1': {
      goal: 'Step into the grey-and-gold page and find Frigg’s hall.',
      hint: 'Touch the page, then go in at the door where the spindle is turning.',
    },
    'a20-01-s2': {
      goal: 'Carry Frigg’s cloak up to Breidablik, Baldr’s hall.',
      hint: 'Follow the path up the rise to the pale hall; you will see it long before you reach it.',
    },
    'a20-01-s3': {
      goal: 'Sit with Baldr while your Nubbin sleeps.',
      hint: 'Take the bench by the long table; there is no hurry in this hall.',
    },
  },
  [
    sc(
      'a20-01-page',
      [
        N(
          'Nova’s atlas falls open at a page washed in grey and gold: a bright hall, a hall of mists, and a long white plain.',
        ),
        N(
          'Across the top, in plain letters: a story from the Prose Edda, written down in Iceland about eight hundred years ago.',
        ),
        N(
          'Snorri Sturluson wrote it down. He was a Christian, setting out the old stories of his people’s gods.',
        ),
        N(
          'His book is one telling, not scripture. These gods are still honoured today, by people whose faith is called Heathenry.',
        ),
        N(
          'The page goes cool and soft under your hand, like linen off the line. Then it is swept boards, and you are standing on them.',
        ),
        N(
          'A long hall, full of the small sound of a spindle. A woman sits by the fire with her work in her lap, and looks up.',
        ),
        FR('A guest. Come in out of the draught. This is Fensalir, and I am Frigg.'),
        FR(
          'There are more errands in this house than there are hands. Will you run some of them, while you stay?',
          'soft',
        ),
        FU('And the small one? Does it carry things?'),
        N('Your Nubbin holds up both arms, to show it will carry anything at all.'),
      ],
      [
        ask(
          1,
          'social-studies',
          'D2.Geo.2.3-5',
          'where Iceland is: an island in the North Atlantic',
          [
            N(
              'Iceland is an island in the North Atlantic, just south of the Arctic Circle. Imagine sailing there from Scotland.',
            ),
            N('Which direction do you sail?'),
          ],
          [
            opt(
              'North-west',
              [N('Yes. Iceland lies north-west of Scotland, across open sea.')],
              true,
            ),
            opt('South-east', [
              N('That would take you towards France. Iceland is the other way: north-west.'),
            ]),
            opt('Due south', [
              N('South would take you towards Spain. Iceland lies north-west of Scotland.'),
            ]),
          ],
          'Used compass directions to place Iceland: north-west of Scotland.',
        ),
        notice(
          2,
          'literacy',
          'L.3.4',
          'the word vellum, and books made by hand',
          [
            N(
              'Books in Snorri’s day were written by hand, on vellum. Vellum is animal skin, usually calfskin, scraped thin and smooth.',
            ),
            N(
              'A big book could need the skins of many calves. That is one reason books were so precious.',
            ),
          ],
          'Learned the word vellum, and how books were made by hand about 800 years ago.',
        ),
      ],
      {
        choices: [
          {
            id: 'bow',
            label: 'Bow, as you would to someone old and kind.',
            then: [
              N('Frigg inclines her head to you, exactly as low as you bowed to her.'),
              FR(
                'Guests and hosts bow the same distance in this house. It saves a great deal of arguing.',
              ),
            ],
          },
          {
            id: 'name',
            label: 'Say your name, plainly.',
            then: [
              FR('A good name. I’ll remember it.', 'soft'),
              N(
                'She says it back to you once, and you have the odd feeling it has been written down somewhere.',
              ),
            ],
          },
          {
            id: 'carry',
            label: 'Ask what needs carrying first.',
            then: [FU('Oh, I like this one.', 'happy')],
          },
        ],
      },
    ),
    sc(
      'a20-01-page-done',
      [
        FR(
          'Then the first errand is the easiest. Take this cloak up the hill to my son. He gives his away to anyone who looks cold.',
        ),
        FR('I’ve sewn him twelve this winter.', 'think'),
        FU('And he gave all twelve away, to four shepherds on the north road. They’re the warmest men in the world.'),
        FU('Breidablik. The hall on the rise. You can’t miss it. Nobody ever has.'),
      ],
      [
        ask(
          3,
          'maths',
          '3.OA.A.3',
          'division: 12 shared between 4',
          [
            N(
              'Frigg sewed Baldr 12 cloaks, and he shared them equally between 4 shepherds.',
            ),
            N('How many cloaks does each shepherd get?'),
          ],
          [
            opt('3', [N('Yes. 12 ÷ 4 = 3, so each shepherd gets three cloaks.')], true),
            opt('4', [
              N('4 is the number of shepherds. Sharing 12 equally between 4 is 12 ÷ 4 = 3.'),
            ]),
            opt('8', [N('8 is 12 − 4. Sharing equally is division: 12 ÷ 4 = 3.')]),
          ],
          'Solved a sharing (division) problem: 12 ÷ 4 = 3.',
        ),
      ],
    ),
    sc(
      'a20-01-hall',
      [
        N(
          'Breidablik stands on a rise above everything. Its roof is so pale it is hard to say where it stops and the sky begins.',
        ),
        N(
          'Fulla said nothing unclean can be in this hall. You wipe your feet twice, and your Nubbin wipes both of its.',
        ),
        N('Inside there is a long table, and a man at it, mending a strap. He looks up.'),
        N(
          'He is so kind and so glad that he seems to shine, and the whole room is lighter for him.',
        ),
        BA('You’ve come from my mother. I know her cloak. She thinks I’m always cold.', 'happy'),
        BA(
          'I’m never cold. Put it on the bench, and sit. Everyone who climbs this far ought to sit.',
        ),
        N(
          'The light off him is like sun off snow in the morning: everywhere at once, and easy on the eyes.',
        ),
        N('Your Nubbin sits down in it, and blinks, and slowly tips over sideways.'),
        BA(
          'Ah. It does that to the small ones. Leave it be. It will wake when it’s ready.',
          'soft',
        ),
      ],
      [
        ask(
          6,
          'science',
          '4-PS3-2',
          'snow reflects most of the light that falls on it',
          [
            N(
              'The light off Baldr is described as sun off snow in the morning. Snow looks dazzling in sunshine.',
            ),
            N('What makes it so bright?'),
          ],
          [
            opt(
              'It reflects most of the light that falls on it',
              [
                N(
                  'Yes. Fresh snow bounces back most of the sunlight that lands on it. That is why people wear dark glasses on snowy mountains.',
                ),
              ],
              true,
            ),
            opt('It makes its own light', [
              N('Snow cannot make light. It only bounces back what the Sun sends it.'),
            ]),
            opt('It is hot', [
              N('Snow is cold. Brightness is about light bouncing back, not about heat.'),
            ]),
          ],
          'Learned that snow reflects most of the sunlight that hits it.',
        ),
      ],
    ),
    sc(
      'a20-01-hall-done',
      [
        N(
          'Your Nubbin is asleep on the warm boards, in the brightest part of the floor, with one arm over its face.',
        ),
        N(
          'Baldr steps over it every time he passes, like a man crossing a stream. Once, he says sorry to it.',
        ),
        BA('Stay till it wakes. I’d like the company.'),
      ],
      [
        ask(
          2,
          'sel',
          'CASEL: Self-awareness',
          'being loved and still lonely (a think question)',
          [
            N('Baldr is loved by everyone, yet he says he would like the company.'),
            N('Can someone be well loved and still feel lonely?'),
          ],
          [
            opt('Yes: being near people is not the same as feeling understood', [
              N('A thoughtful answer. Company and closeness are not always the same thing.'),
            ]),
            opt('No: if everyone loves you, you cannot be lonely', [
              N('A fair view. But think of Baldr, who is loved by all and still asks you to stay.'),
            ]),
            opt('Maybe: it depends on what that person needs', [
              N('A careful answer. Different people need different kinds of company.'),
            ]),
          ],
          'Reflected on whether being loved always stops loneliness (no single right answer).',
        ),
      ],
    ),
    sc(
      'a20-01-sit',
      [
        N(
          'You sit on the bench. Baldr goes back to his strap, and for a while there is no sound but the needle going through leather.',
        ),
        BA(
          'My mother says you’re running her errands. That’s kind. She has more of them than usual this year.',
        ),
        BA(
          'Everyone climbs up here in the end with a question. Mostly it’s which of two people is right.',
        ),
        BA('I tell them as kindly as I can. It’s the part of the day I like best.', 'happy'),
        N('He looks over at your Nubbin, which is snoring very slightly in the light.'),
        BA('Ask me something, then. You’ve climbed as far as anyone.'),
      ],
      [
        ask(
          3,
          'literacy',
          'RL.3.3',
          'a character’s traits from what he does',
          [
            N(
              'Baldr settles quarrels by telling people the answer “as kindly as I can,” and says it is the part of his day he likes best.',
            ),
            N('What does that tell us about him?'),
          ],
          [
            opt(
              'He cares more about people than about being proved right',
              [
                N(
                  'Yes. Settling a quarrel kindly shows he wants people to feel looked after, not beaten.',
                ),
              ],
              true,
            ),
            opt('He likes bossing people about', [
              N('Nothing he does is bossy. He listens, and he tells people as kindly as he can.'),
            ]),
            opt('He is bored by everything', [
              N('He says it is the part of the day he likes best. He is not bored.'),
            ]),
          ],
          'Worked out a character trait (kindness) from what the character does.',
        ),
      ],
      {
        choices: [
          {
            id: 'bright',
            label: 'Ask him why he is so bright.',
            then: [
              BA(
                'I don’t know. I’ve never been anything else. I’d like to see the dark properly one day, just to know.',
                'think',
              ),
            ],
          },
          {
            id: 'brother',
            label: 'Ask him if he has brothers.',
            then: [
              BA(
                'Hödr. He’s blind, and stronger than any of us, and he laughs at my jokes before I finish them.',
                'happy',
              ),
              BA('You’ll meet him. He’s always just outside where the noise is, listening.'),
            ],
          },
          {
            id: 'sit',
            label: 'Don’t ask anything. Just sit.',
            then: [
              N(
                'So you sit. After a while Baldr puts the strap down and sits too, doing nothing, as if he never gets the chance.',
              ),
              BA('That was a good question.', 'soft'),
            ],
          },
        ],
      },
    ),
    sc(
      'a20-01-complete',
      [
        N(
          'Your Nubbin wakes when the light moves across the floor. It gets up and moves after it.',
        ),
        BA(
          'It’ll follow me about now. The small ones do. I don’t know what they think they’ll find.',
          'soft',
        ),
        N(
          'He folds his mother’s cloak and lays it on the end of the bench, where he will see it every time he passes.',
        ),
        BA('Tell her I’ll wear it. She’ll know I mean it kindly.', 'happy'),
        N('Going down the hill, your Nubbin stops every few steps to look back at the pale hall.'),
      ],
      [
        ask(
          2,
          'maths',
          '3.NF.A.1',
          'unit fractions by folding',
          [
            N('Baldr folds his mother’s cloak in half, then in half again.'),
            N('When it is folded like that, each folded part is what fraction of the whole cloak?'),
          ],
          [
            opt(
              'One quarter',
              [N('Yes. Half of a half is a quarter: 1/4. Four equal parts make the whole cloak.')],
              true,
            ),
            opt('One half', [
              N(
                'One fold makes halves. He folded again, so each part is half of a half: one quarter.',
              ),
            ]),
            opt('One third', [
              N(
                'Thirds need three equal parts. Folding in half twice makes four equal parts, so one quarter.',
              ),
            ]),
          ],
          'Found a unit fraction by folding: half of a half is one quarter.',
        ),
      ],
    ),
  ],
  [
    {
      word: 'vellum',
      meaning:
        'Animal skin, usually calfskin, scraped thin and smooth, which books were once written on.',
      scene: 'a20-01-page',
    },
    {
      word: 'Heathenry',
      meaning: 'A modern religion that honours the old Norse gods.',
      scene: 'a20-01-page',
    },
    {
      word: 'reflect',
      meaning: 'To bounce light back instead of soaking it up.',
      scene: 'a20-01-hall',
    },
  ],
);

// ================================================================== A20-2 Bad Dreams
const Q02 = quest(
  'a20-02',
  'Bad Dreams',
  {
    'a20-02-s1': {
      goal: 'Take lamp oil up to Breidablik, late at night.',
      hint: 'Fulla has the oil jar at Fensalir’s door; carry it up the rise.',
    },
    'a20-02-s2': {
      goal: 'Walk down with Baldr while he tells the gods his dreams.',
      hint: 'Go with Baldr to the great hall where the gods meet, and stay by the door.',
    },
    'a20-02-s3': {
      goal: 'Keep the hall going through the long council.',
      hint: 'Keep the fire fed and the cups filled until the gods have decided.',
    },
  },
  [
    sc(
      'a20-02-oil',
      [
        N(
          'It is late. Fensalir’s fire is down to red, and Fulla is still up, holding a jar of lamp oil.',
        ),
        FU(
          'His lamp’s been burning three nights running. He doesn’t sleep. Take this up to him? Mind the step.',
        ),
        N(
          'Your Nubbin insists on carrying the lid, and holds it up like a shield all the way. Nothing attacks it.',
        ),
        N(
          'Breidablik is never dark, but tonight the lamp is lit as well, as if he wanted more light than his own.',
        ),
        N('Baldr sits at the long table with his hands round a cup that has gone cold.'),
        BA(
          'Oh. It’s you. Come in. I’m glad it’s you, and not somebody who’d ask how I am.',
          'soft',
        ),
        BA(
          'I’ve been dreaming. The same road every night, going down. And at the bottom of it, somebody saying my name.',
          'sad',
        ),
        BA('Not unkindly. Quietly. As if they were setting a place for me.', 'sad'),
        N(
          'Your Nubbin climbs onto the bench beside him and sits as close to his light as it can get.',
        ),
      ],
      [
        ask(
          7,
          'sel',
          'CASEL: Self-management',
          'what makes a worry smaller',
          [
            N('Baldr is glad it is you, and not somebody who would ask how he is.'),
            N('Which of these is most likely to make a worry smaller?'),
          ],
          [
            opt(
              'Telling someone I trust, even a little at a time',
              [
                N(
                  'Yes. A worry shared is usually lighter. In the morning Baldr will tell the gods, and he will feel it ease.',
                ),
              ],
              true,
            ),
            opt('Keeping it to myself', [
              N('Worries kept alone tend to grow in the dark. Baldr has had three nights of that.'),
            ]),
            opt('Pretending it is not there', [
              N('That is tempting. But the worry waits. Baldr tried it, and the dream came back.'),
            ]),
          ],
          'Talked about telling someone you trust as a way to shrink a worry.',
        ),
      ],
      {
        choices: [
          {
            id: 'only',
            label: 'Tell him dreams are only dreams.',
            then: [
              BA(
                'That’s what I keep telling myself. I’m not as good at believing me as I used to be.',
                'think',
              ),
            ],
          },
          {
            id: 'tell',
            label: 'Say he should tell the others.',
            then: [
              BA(
                'Yes. You’re right. I hate to worry them. But it’s worse, keeping it up here alone.',
              ),
            ],
          },
          {
            id: 'wait',
            label: 'Sit, and wait for him to say more.',
            then: [
              N(
                'You sit, and he doesn’t say more. After a while he puts his hand on your Nubbin’s head, and leaves it there.',
              ),
            ],
          },
        ],
      },
    ),
    sc(
      'a20-02-oil-done',
      [
        BA('In the morning I’ll tell them. All of them. Will you walk down with me?'),
        N(
          'He sleeps a little after that, with the lamp still lit. Your Nubbin sleeps in his light, and you keep watch.',
        ),
      ],
      [
        ask(
          1,
          'science',
          '4-PS3-4',
          'a lamp changes stored energy into light and heat',
          [
            N('Baldr’s lamp has burned three nights running, on oil.'),
            N(
              'A burning lamp changes the energy stored in its oil into two things we can sense. Which two?',
            ),
          ],
          [
            opt(
              'Light and heat',
              [N('Yes. That is why you can warm your hands near a lamp flame.')],
              true,
            ),
            opt('Sound and cold', [
              N('A lamp flame gives a little warmth, not cold, and almost no sound.'),
            ]),
            opt('Wind and water', [
              N('Burning makes light and heat. Burning oil does not make wind or water.'),
            ]),
          ],
          'Learned that a lamp changes stored energy in oil into light and heat.',
        ),
      ],
    ),
    sc(
      'a20-02-telling',
      [
        N(
          'In the morning the gods are gathered in their great hall. They stop talking when Baldr comes in, because he never looks like this.',
        ),
        N(
          'He tells them plainly: the road, the going down, his name said quietly at the bottom of it.',
        ),
        N(
          'Odin listens with his one eye on his son and says nothing at all. Thor’s hands close and open on his knees.',
        ),
        TH(
          'A dream. Dreams are smoke. Show me the thing that means him harm, and I’ll deal with it.',
        ),
        OD('Not every harm stands where you can reach it.', 'think'),
        FR('Then we will go where it stands. Whatever it is.'),
        N(
          'They begin to take counsel together, slowly, the way old friends do when a matter is serious.',
        ),
        N(
          'Fulla finds you a stool by the door. Your Nubbin keeps edging along the floor towards Baldr’s light.',
        ),
      ],
      [
        ask(
          3,
          'literacy',
          'L.4.5',
          'metaphor: dreams are smoke',
          [
            N(
              'Thor says, “Dreams are smoke.” That is a metaphor: it says one thing is another, to make a point.',
            ),
            N('What does Thor mean?'),
          ],
          [
            opt(
              'Dreams are thin and drift away, so there is nothing solid to fight',
              [
                N(
                  'Yes. Smoke has no shape to grab. Thor wants something he can hit, so a dream seems like nothing to him.',
                ),
              ],
              true,
            ),
            opt('Dreams cause fires', [
              N(
                'Thor is not saying dreams burn things. He means they are as thin and shapeless as smoke.',
              ),
            ]),
            opt('Dreams smell bad', [
              N(
                'It is not about smell. A metaphor lets one thing stand for the quality of another: thin, drifting, hard to hold.',
              ),
            ]),
          ],
          'Explained a metaphor (dreams are smoke).',
        ),
      ],
    ),
    sc(
      'a20-02-telling-done',
      [
        N(
          'The talk goes on through the morning and into the dark. You fetch, and carry, and listen.',
        ),
        N(
          'The gods sat down at eight in the morning. At eight at night, the fire is low.',
        ),
      ],
      [
        ask(
          1,
          'maths',
          '3.MD.A.1',
          'time intervals',
          [
            N('The gods sat down at 8 in the morning and were still talking at 8 at night.'),
            N('For how many hours did they talk?'),
          ],
          [
            opt(
              '12 hours',
              [
                N(
                  'Yes. From 8 in the morning to 8 in the evening is 12 hours: 4 to noon, then 8 more.',
                ),
              ],
              true,
            ),
            opt('8 hours', [
              N(
                '8 is the clock number, not the gap. Count on: 4 hours to noon, then 8 more, which makes 12.',
              ),
            ]),
            opt('20 hours', [
              N(
                'Careful: we want the gap between the times, not the sum. Count on from 8 to 8: 12 hours.',
              ),
            ]),
          ],
          'Worked out a time interval across the day: 8 am to 8 pm is 12 hours.',
        ),
      ],
    ),
    sc(
      'a20-02-council',
      [
        N('The hall gets dark and the fire gets low. Nobody has noticed but you.'),
        TH('We could ward him. Stand round him day and night.'),
        OD('And he would live in a ring of spears. That is no life for him.', 'sad'),
        BA('I’d rather not, if it’s all the same. I’d miss people.', 'soft'),
        N(
          'Frigg has said nothing for a long time. She is turning something over, the way she turns her spindle.',
        ),
        FR(
          'Then I will ask. Everything in the world, one by one. I will ask each of them to promise not to harm him.',
          'think',
        ),
        TH('Everything? There’s a great deal of everything.'),
        FR('Then I had better start early.'),
      ],
      [
        ask(
          3,
          'sel',
          'CASEL: Responsible decision-making',
          'safe is not always the same as well (a think question)',
          [
            N(
              'Odin says a life inside a ring of spears is no life. Baldr would rather be among people.',
            ),
            N('Is being safe the same as being well?'),
          ],
          [
            opt('No: a safe life can still be lonely or small', [
              N(
                'A thoughtful answer. Safety matters, but so does being able to live. Frigg’s plan tries to keep both.',
              ),
            ]),
            opt('Yes: safety is what matters most', [
              N(
                'A fair view. Safety matters a great deal. Baldr would ask what it costs him to be that safe.',
              ),
            ]),
            opt('It depends on what the safety costs', [
              N(
                'A careful answer. A little safety costs little. A ring of spears costs a whole way of life.',
              ),
            ]),
          ],
          'Reflected on whether being safe is the same as being well (no single right answer).',
        ),
      ],
      {
        choices: [
          {
            id: 'fire',
            label: 'Build the fire up again.',
            then: [
              N(
                'You build the fire up. Odin watches you do it, and nods, once, as if that were a kind of counsel too.',
              ),
            ],
          },
          {
            id: 'cups',
            label: 'Fill the cups.',
            then: [
              N(
                'You fill the cups, and Thor takes his with a nod. His hands are steadier for having something to hold.',
              ),
            ],
          },
          {
            id: 'listen',
            label: 'Sit by the door and listen.',
            then: [
              N(
                'You sit by the door and listen. It is the kind of night somebody should remember all of, start to finish.',
              ),
            ],
          },
        ],
      },
    ),
    sc(
      'a20-02-complete',
      [
        N('By dawn it is settled. The gods go out of the hall into a cold, clear morning.'),
        FR('Tomorrow we walk. You, and I, and Fulla. We will ask the whole world.', 'soft'),
        BA('Mother. You don’t have to.'),
        FR('I know.'),
        N(
          'Your Nubbin falls asleep on the way home, and you carry it. It is facing back up the hill.',
        ),
        FU(
          'Four kilometres an hour, six hours a day, and bread for all of it. I’ll pack tonight.',
        ),
      ],
      [
        ask(
          5,
          'maths',
          '4.MD.A.2',
          'distance, speed and time',
          [
            N(
              'Fulla plans for 4 kilometres each hour (about 2½ miles), for 6 hours.',
            ),
            N('How far will they walk in one day?'),
          ],
          [
            opt(
              '24 km (about 15 miles)',
              [N('Yes: 4 km × 6 hours = 24 km. That is a long walk for one day.')],
              true,
            ),
            opt('10 km', [
              N('10 is 4 + 6. Walking 4 km an hour for 6 hours means 6 groups of 4: 24 km.'),
            ]),
            opt('2 km', [N('Not quite. Each hour adds 4 km, so six hours add 6 × 4 = 24 km.')]),
          ],
          'Solved a distance problem: 4 km an hour for 6 hours is 24 km.',
        ),
      ],
    ),
  ],
  [
    {
      word: 'metaphor',
      meaning: 'A figure of speech that says one thing is another, to make a point.',
      scene: 'a20-02-telling',
    },
  ],
);

// ================================================================== A20-3 The Oaths
const Q03 = quest(
  'a20-03',
  'The Oaths',
  {
    'a20-03-s1': {
      goal: 'Walk with Frigg while she asks the fire, the water, the iron and the stones.',
      hint: 'Keep a step behind Frigg; she stops at each thing she asks.',
    },
    'a20-03-s2': {
      goal: 'Carry Frigg’s asking to the beasts and the birds.',
      hint: 'Go out over the meadows and along the wood edge; anything that runs, flies or creeps should be asked.',
    },
    'a20-03-s3': {
      goal: 'Let your Nubbin make its own promise.',
      hint: 'Bring your Nubbin to Frigg on Fensalir’s step.',
    },
  },
  [
    sc(
      'a20-03-asking',
      [
        N(
          'Frigg walks out at first light with no escort, only Fulla and you, and your Nubbin trotting to keep up.',
        ),
        N(
          'She stops at the hearth first, and kneels, and asks the fire. The flames lie down low along the logs, all at once.',
        ),
        FR('That is yes. Fire never says much.'),
        N(
          'At the spring she asks the water, and it goes still as glass. At the smithy she asks the iron, and every blade on the wall rings.',
        ),
        N(
          'She asks every metal by name, and the earth, and the stones. The stones say nothing, which for a stone is a promise.',
        ),
        N(
          'She asks the trees, every kind, a whole wood of them. They bend their tops to her as if a wind went over.',
        ),
        FU(
          'She asks the sicknesses herself, at night. They take the longest. They always want to argue.',
          'soft',
        ),
        FR(
          'Everything can be asked. It only takes time, and remembering not to leave anything out.',
        ),
        N(
          'West of Valhall you pass an old oak. On one of its branches is a sprig so small and new it has only two leaves.',
        ),
        N('Your Nubbin stops and looks at it. Frigg is already walking on.'),
      ],
      [
        ask(
          2,
          'literacy',
          'L.3.4',
          'the word oath',
          [
            N('Frigg is asking everything in the world for an oath: a solemn promise.'),
            N('Which sentence uses “oath” correctly?'),
          ],
          [
            opt(
              'The knight swore an oath to protect the village.',
              [N('Yes. An oath is a very serious promise, often spoken aloud.')],
              true,
            ),
            opt('She ate an oath for breakfast.', [
              N('An oath is not food. It is a serious promise.'),
            ]),
            opt('The oath rained all morning.', [
              N('Weather is not an oath. An oath is a solemn promise.'),
            ]),
          ],
          'Learned the word oath (a solemn promise).',
        ),
        notice(
          8,
          'science',
          '4-LS1-1',
          'mistletoe grows on another tree',
          [
            N(
              'That little sprig is mistletoe, and it is a real plant. It grows on the branch of another tree, such as an apple or a poplar.',
            ),
            N(
              'Its green leaves make food from sunlight, but it sends root-like threads into the host tree to take water. So it is called a partial parasite.',
            ),
          ],
          'Learned that mistletoe is a green plant that grows on another tree’s branches.',
        ),
      ],
    ),
    sc(
      'a20-03-asking-done',
      [
        FR(
          'The beasts and the birds now. My feet are older than my asking. Will you carry it for me?',
        ),
      ],
      [
        ask(
          0,
          'sel',
          'CASEL: Responsible decision-making',
          'being a trustworthy messenger',
          [
            N('Frigg trusts you to carry her asking exactly as she gave it.'),
            N('What makes someone a good messenger?'),
          ],
          [
            opt(
              'Passing the words on exactly, without changing them',
              [N('Yes. A messenger is trusted because the words arrive just as they were sent.')],
              true,
            ),
            opt('Making the message funnier', [
              N(
                'A joke might be fun, but it changes the message. A good messenger keeps it as it is.',
              ),
            ]),
            opt('Keeping the best parts for yourself', [
              N(
                'Then the one who is waiting would not get the whole message. A good messenger passes on all of it.',
              ),
            ]),
          ],
          'Talked about what makes a messenger trustworthy.',
        ),
      ],
    ),
    sc(
      'a20-03-beasts',
      [
        N(
          'You go out over the meadows with Frigg’s asking. It sits in your mouth like a smooth stone, and you say it the way she said it.',
        ),
        N(
          'The hare listens with both ears and thumps the ground, once. The bear lies down flat, which takes some time.',
        ),
        N(
          'A reindeer lowers her antlers until they touch the grass. A fox looks away, then back, then sits.',
        ),
        N(
          'The birds you ask all together, from the top of a hill. They go up in one great turning cloud and come down again.',
        ),
        N(
          'The ravens come last. They hear you out, and nod, and fly off towards Valhall to tell somebody.',
        ),
        N('Snakes and poisons Frigg asks herself. Some askings, she says, are not for guests.'),
        FU(
          'That’s everything with legs and wings. Everything with neither, too. Is that all?',
          'think',
        ),
        N('Your Nubbin is tugging at your sleeve. Nobody has asked it.'),
      ],
      [
        ask(
          2,
          'science',
          '4-LS1-1',
          'how body parts help animals survive: the reindeer',
          [
            N('A reindeer has wide hooves and a thick coat. Reindeer live in snowy lands.'),
            N('How do those two features help a reindeer survive there?'),
          ],
          [
            opt(
              'Wide hooves spread its weight so it does not sink in snow, and the thick coat keeps in body heat',
              [
                N(
                  'Yes. Wide hooves work a little like snowshoes, and a thick coat keeps the cold out.',
                ),
              ],
              true,
            ),
            opt('Wide hooves help it fly, and the coat helps it swim', [
              N(
                'Reindeer cannot fly, though they are strong swimmers. Their wide hooves and thick coat are for snow and cold.',
              ),
            ]),
            opt('They do not help at all', [
              N(
                'Every feature of a survivor usually has a job. These two have a big one in the snow.',
              ),
            ]),
          ],
          'Linked an animal’s body parts (hooves, coat) to surviving in snow.',
        ),
      ],
    ),
    sc(
      'a20-03-promise',
      [
        N(
          'Frigg is sitting on Fensalir’s step, tired, with her hands open in her lap. Your Nubbin walks straight up to her.',
        ),
        N(
          'It stands in front of her with its feet together and its arms at its sides, as straight as it can stand.',
        ),
        FU('Oh. It wants to be asked.', 'soft'),
        FR('Of course it does. Everything should be. Come here, little one.'),
        FR('Will you promise not to harm my son? Not ever, not by anything you do?'),
        N('Your Nubbin thinks about this for a long time, very seriously.'),
      ],
      [
        ask(
          5,
          'sel',
          'CASEL: Relationship skills',
          'a promise you make yourself (a think question)',
          [
            N(
              'Frigg wants your Nubbin to make its own promise, not to have someone promise for it.',
            ),
            N('Why might a promise mean more when you make it yourself?'),
          ],
          [
            opt('Yes: only the one who promises can choose to keep it', [
              N('A clear reason. A promise is a choice, and only the promiser can make it.'),
            ]),
            opt('Not quite: a promise passed on can still be honest', [
              N(
                'A fair point. A messenger can be faithful. But the one who made the promise still has to keep it.',
              ),
            ]),
            opt('It depends on whether the person really means it', [
              N('A careful answer. A promise is only as strong as the meaning behind it.'),
            ]),
          ],
          'Reflected on what makes a promise mean something (no single right answer).',
        ),
      ],
      {
        choices: [
          {
            id: 'paw',
            label: 'Let it put its paw in Frigg’s hand.',
            then: [
              N(
                'It puts its paw in her hand, flat, and holds it there until she closes her fingers round it.',
              ),
              FR('That will hold.', 'soft'),
            ],
          },
          {
            id: 'bow',
            label: 'Let it bow, the way the hare did.',
            then: [
              N(
                'It bows so low it nearly topples. Then, to be sure, it thumps the step with one foot, like the hare.',
              ),
              FR('Twice promised. I’ll count it twice.', 'happy'),
            ],
          },
          {
            id: 'for',
            label: 'Promise for it.',
            then: [
              FR(
                'No. Let it promise for itself. A promise carried by somebody else is only an errand.',
              ),
              N('Your Nubbin nods at her, hard, three times. Frigg nods back three times.'),
            ],
          },
        ],
      },
    ),
    sc(
      'a20-03-complete',
      [
        N(
          'By evening it is done: fire and water, iron and every metal, stones, earth and trees, sickness, beasts, birds, poison and snakes.',
        ),
        FR('Everything has promised. Everything I could think of.', 'soft'),
        N(
          'She has been spinning as she walked, a twist of thread for every promise. Now the spindle is full, and she cuts the thread.',
        ),
        FR(
          'Keep the spindle. It has done its work. I’d like it to live somewhere far away, where nothing has ever been afraid.',
        ),
        N('Your Nubbin is already asleep on the step, facing up the hill towards the pale hall.'),
      ],
      [
        notice(
          2,
          'social-studies',
          'D2.His.2.3-5',
          'drop spindles: spinning thread by hand',
          [
            N(
              'Frigg’s spindle is a drop spindle, one of the oldest tools for making thread. People used them for thousands of years before spinning wheels or machines.',
            ),
            N(
              'You twist wool or flax into thread by letting the spindle hang and turn. Hand-spinners still use them today.',
            ),
          ],
          'Learned that drop spindles are very old tools for making thread, still used today.',
        ),
      ],
    ),
  ],
  [
    {
      word: 'oath',
      meaning: 'A very serious promise, often spoken aloud.',
      scene: 'a20-03-asking',
    },
    {
      word: 'parasite',
      meaning: 'A living thing that lives on another and takes what it needs from it.',
      scene: 'a20-03-asking',
    },
  ],
);

// ================================================================== A20-4 The Game
const Q04 = quest(
  'a20-04',
  'The Game',
  {
    'a20-04-s1': {
      goal: 'Go with the gods to the Thing-field.',
      hint: 'Follow the crowd out to the gods’ meeting-place and its ring of stones.',
    },
    'a20-04-s2': {
      goal: 'Join the game, or watch it from the edge.',
      hint: 'Thor will offer you something to throw; you don’t have to take it.',
    },
    'a20-04-s3': {
      goal: 'Find Hödr outside the ring, and tell him what is happening.',
      hint: 'Walk round the outside of the stones to the tall man standing apart.',
    },
  },
  [
    sc(
      'a20-04-field',
      [
        N(
          'The Thing-field is the gods’ meeting-place, a wide green with a ring of standing stones. Today it is full of laughing.',
        ),
        N(
          'Baldr stands in the middle of the ring. The gods stand round him, and they throw things at him.',
        ),
        N(
          'A stone bounces off his shoulder and lands softly in the grass. An arrow turns aside as if it had changed its mind.',
        ),
        N(
          'Nothing hurts him, because everything has promised. The game is a way of honouring him, and everyone wants a turn.',
        ),
        TH('Your turn again, brother! Stand still. This one’s heavy.', 'happy'),
        BA('I’m always standing still! It’s the one thing I’m good at today!', 'happy'),
        N(
          'Thor throws a stone the size of a loaf. It stops a hand’s width from Baldr, seems to think about it, and drops.',
        ),
        N('Everyone laughs, and Baldr laughs most of all, with his head back.'),
        TH('Right. That was a small one. Somebody fetch me the millstone.'),
        FU('That’s the mill’s millstone, Thor. They’re using it.'),
        TH('They can have it back. It won’t be hurt. That’s the whole point of today.', 'happy'),
        N(
          'The millstone rolls up to Baldr, stops at his toes, and lies down flat, like a dog that wants its tummy rubbed.',
        ),
      ],
      [
        notice(
          11,
          'social-studies',
          'D2.Civ.8.3-5',
          'the Thing: an assembly where people had a say',
          [
            N(
              'The Norse word “Thing” meant an assembly, where free people met to settle quarrels and make laws.',
            ),
            N(
              'Iceland’s Althing began in the year 930, and still meets today. It is one of the oldest parliaments in the world.',
            ),
          ],
          'Learned that a Thing was an assembly, and that Iceland’s Althing began in 930.',
        ),
        ask(
          2,
          'science',
          '3-PS2-1',
          'gravity pulls thrown things down',
          [
            N('Every stone thrown at Baldr curves down to the grass in the end.'),
            N('Which force pulls thrown things back towards the ground?'),
          ],
          [
            opt(
              'Gravity',
              [
                N(
                  'Yes. Gravity pulls everything towards the ground, and a stone thrown from your hand is no exception.',
                ),
              ],
              true,
            ),
            opt('Magnetism', [
              N('Magnets pull on iron, not on stones. It is gravity that pulls the stone down.'),
            ]),
            opt('Wind', [
              N('Wind can push a stone sideways. It is gravity that always pulls things down.'),
            ]),
          ],
          'Learned that gravity pulls thrown objects down towards the ground.',
        ),
      ],
    ),
    sc(
      'a20-04-field-done',
      [
        N(
          'Your Nubbin has found the edge of Baldr’s light, at the very edge of the ring. It lies down in it like a cat in a sunbeam.',
        ),
      ],
      [
        ask(
          0,
          'literacy',
          'L.4.5',
          'a simile: like a cat in a sunbeam',
          [
            N(
              'Your Nubbin lies down “like a cat in a sunbeam.” That is a simile: it compares two things using “like” or “as.”',
            ),
            N('Which of these is also a simile?'),
          ],
          [
            opt(
              'The hall was as quiet as a mouse.',
              [N('Yes. “As quiet as a mouse” compares the hall to a mouse using “as.”')],
              true,
            ),
            opt('The hall was a mouse.', [
              N('That is a metaphor: it says one thing is another. A simile uses “like” or “as.”'),
            ]),
            opt('The hall was very quiet.', [
              N('That is a plain description. A simile makes a comparison.'),
            ]),
          ],
          'Told a simile (uses like or as) from a metaphor and a plain description.',
        ),
      ],
    ),
    sc(
      'a20-04-turn',
      [
        TH('Guest! A guest’s throw is good luck. Here.'),
        N(
          'He holds out a pebble from the field, smooth and grey, small enough for a child to throw.',
        ),
        BA(
          'Go on. It only tickles. Everything tickles now. I’ve never laughed so much in my life.',
          'happy',
        ),
        N(
          'Outside the ring, a little apart, a tall man is standing with his hands empty. Baldr waves to him whenever something bounces.',
        ),
        N(
          'The tall man can’t see him wave. But he smiles each time the laughing comes, as if he can.',
        ),
        FU('That’s Hödr, Baldr’s brother. He can’t see to throw, so he stands out there.', 'soft'),
      ],
      [
        ask(
          5,
          'sel',
          'CASEL: Social awareness',
          'fair play and being left outside the game (a think question)',
          [
            N('Everyone laughs together, but Hödr stands outside the ring with empty hands.'),
            N(
              'Is a game still a good game if one person cannot take part? What could make it fairer?',
            ),
          ],
          [
            opt('Change the game so he can play in his own way', [
              N('A generous idea. A game that has room for everyone is a better game.'),
            ]),
            opt('It is fine: he enjoys listening', [
              N(
                'He does enjoy the laughing. But notice he stands apart, with nothing in his hands. He might like to be in it.',
              ),
            ]),
            opt('The game is not really kind if he is left out', [
              N(
                'A strong view. Honouring one brother while another stands apart leaves something missing.',
              ),
            ]),
          ],
          'Thought about fairness in a game when one player cannot join (no single right answer).',
        ),
      ],
      {
        choices: [
          {
            id: 'throw',
            label: 'Throw the pebble, gently, underarm.',
            then: [
              N(
                'Your pebble bumps off Baldr’s knee and rolls back to your feet. He bows to it, deeply, and everyone cheers.',
              ),
            ],
          },
          {
            id: 'watch',
            label: 'Give the pebble back. Watch from the edge.',
            then: [
              TH('Fair enough. Somebody ought to keep the score.'),
              N('You go and stand at the edge of the ring, where the laughing is quieter.'),
            ],
          },
          {
            id: 'nubbin',
            label: 'Let your Nubbin have the throw.',
            then: [
              N(
                'Your Nubbin rolls the pebble along the grass. It stops at Baldr’s feet, and he picks it up and hands it back.',
              ),
              BA('A draw.', 'happy'),
            ],
          },
        ],
      },
    ),
    sc(
      'a20-04-hodr',
      [
        N(
          'You walk round the outside of the stones to where Hödr stands. He turns his head before you reach him.',
        ),
        HO(
          'You’re the guest. Frigg’s errand-runner. You walk like someone who’s been carrying things.',
          'happy',
        ),
        HO('Tell me what they’re doing. I can hear them laughing. I like to know what at.'),
        N(
          'So you tell him: Thor’s loaf of a stone, the arrow that changed its mind, your Nubbin asleep at the edge of the ring.',
        ),
        HO('The arrow! I wish I’d seen that.', 'happy'),
        HO(
          'I’d throw something myself, if I could see where he was. But it isn’t a game you play blind.',
          'soft',
        ),
        N('He says it lightly. He has said it to himself a good many times before.'),
      ],
      [
        ask(
          0,
          'science',
          '4-LS1-2',
          'two ears help us tell where a sound comes from',
          [
            N(
              'Hödr turns his head towards you before you reach him. He cannot see, but his hearing is sharp.',
            ),
            N('Having two ears helps us tell where a sound is coming from. Why?'),
          ],
          [
            opt(
              'A sound reaches the nearer ear a moment sooner, and a little louder',
              [
                N(
                  'Yes. Your brain notices that tiny difference between your ears and works out the direction.',
                ),
              ],
              true,
            ),
            opt('Each ear hears a different language', [
              N(
                'Both ears hear the same sounds. The difference is when and how loudly they hear them.',
              ),
            ]),
            opt('One ear is only for show', [
              N('Both ears do real work. Together they let us tell where a sound is coming from.'),
            ]),
          ],
          'Learned that two ears let us tell the direction of a sound.',
        ),
      ],
    ),
    sc(
      'a20-04-hodr-done',
      [
        HO(
          'Come and tell me the next good one. You tell it better than they do. They just laugh and expect me to know.',
          'happy',
        ),
        HO('Eight of them have had three throws each, and nobody has told me about a single one.'),
      ],
      [
        ask(
          1,
          'maths',
          '3.OA.A.3',
          'multiplication: 8 × 3',
          [
            N(
              'Hödr asks you to tell him every good moment. Eight gods have each had three throws at Baldr.',
            ),
            N('How many throws are there to describe?'),
          ],
          [
            opt('24', [N('Yes: 8 × 3 = 24 throws. Hödr will be there all evening.')], true),
            opt('11', [
              N('11 is 8 + 3. Eight gods with three throws each is eight groups of three: 24.'),
            ]),
            opt('16', [N('16 is 8 + 8. Three throws each means 8 × 3 = 24.')]),
          ],
          'Solved a multiplication problem: 8 groups of 3 make 24.',
        ),
      ],
    ),
    sc(
      'a20-04-complete',
      [
        N('The game goes on till the light goes. Nobody is hurt; nobody can be.'),
        N(
          'Baldr comes out of the ring with grass in his hair and puts an arm round his brother’s shoulders.',
        ),
        BA('Did you hear about the arrow? It went round me like a dog round a puddle.', 'happy'),
        HO('I heard everything. The guest told me the rest.'),
        N(
          'Your Nubbin follows them home, walking in Baldr’s light and holding on to Hödr’s bootlace.',
        ),
      ],
      [
        ask(
          2,
          'literacy',
          'RL.3.3',
          'what a joke tells us about a character',
          [
            N(
              'Baldr says the arrow went round him “like a dog round a puddle,” and he tells it to his brother first.',
            ),
            N('What does that tell us about Baldr?'),
          ],
          [
            opt(
              'He wants Hödr to share the fun, even though Hödr could not see it',
              [N('Yes. He turns what he saw into a story, so his brother can laugh too.')],
              true,
            ),
            opt('He only wants to show off', [
              N(
                'He tells it to Hödr, who is the one person who missed it. That looks like kindness, not showing off.',
              ),
            ]),
            opt('He is afraid of the arrow', [
              N('He is laughing, not afraid. The joke is how he shares the moment.'),
            ]),
          ],
          'Worked out what a character’s joke shows about him (kindness and sharing).',
        ),
      ],
    ),
  ],
  [
    {
      word: 'assembly',
      meaning: 'A meeting where people gather to talk and decide things.',
      scene: 'a20-04-field',
    },
    {
      word: 'simile',
      meaning: 'A comparison that uses “like” or “as”.',
      scene: 'a20-04-field-done',
    },
  ],
);

// ================================================================== A20-5 The Old Woman
const Q05 = quest(
  'a20-05',
  'The Old Woman',
  {
    'a20-05-s1': {
      goal: 'Fetch water for Fensalir.',
      hint: 'Take the pails down to the spring and carry them back up.',
    },
    'a20-05-s2': {
      goal: 'Sit by Fensalir’s hearth while Frigg talks with the traveller.',
      hint: 'Wind the wool by the fire, and stay in the room.',
    },
  },
  [
    sc(
      'a20-05-water',
      [
        N(
          'Fensalir needs water, and the spring is down the slope. You take two pails, and your Nubbin takes a thimble.',
        ),
        N(
          'It comes back up the path with one drop in it, carried like a crown, and pours it into your eight-litre pail with great ceremony.',
        ),
        N('When you come back up the path, there is an old woman at the door, leaning on a stick.'),
        N(
          'She is wrapped in so many shawls that you can see nothing of her but her hands, which do not look old at all.',
        ),
        FU(
          'A traveller. Frigg never turns one away. Bring the water in. She’ll want to give her a cup.',
        ),
        N(
          'The old woman looks at your Nubbin. Your Nubbin looks back, and then it goes and stands behind your legs.',
        ),
        N('It has never done that before, with anyone.'),
      ],
      [
        ask(
          1,
          'maths',
          '4.MD.A.1',
          'units of volume: litres and millilitres',
          [
            N(
              'You carry two pails, and your Nubbin carries a thimble. There are 1000 millilitres in a litre.',
            ),
            N('Your pail holds 8 litres. How many millilitres is that?'),
          ],
          [
            opt(
              '8000 millilitres',
              [
                N(
                  'Yes: 8 × 1000 = 8000. The thimble, by comparison, holds only a few millilitres.',
                ),
              ],
              true,
            ),
            opt('800 millilitres', [
              N('Check the zeros. Each litre is 1000 millilitres, so 8 litres is 8000.'),
            ]),
            opt('80 millilitres', [
              N('That is far too small. 8 litres is 8 × 1000 = 8000 millilitres.'),
            ]),
          ],
          'Converted litres to millilitres: 8 litres is 8000 millilitres.',
        ),
      ],
    ),
    sc(
      'a20-05-talk',
      [
        N(
          'Frigg gives the old woman the best seat and a cup of the new water. You sit by the hearth with a skein of wool to wind.',
        ),
        CR('I came by the Thing-field. Such a noise. What are the gods doing there, lady?'),
        FR(
          'Making sport. They throw at my son, and nothing harms him. Everything in the world has promised.',
          'happy',
        ),
        CR('Everything? Every single thing?', 'think'),
        FR('Every thing but one.'),
        FR(
          'There is one little green sprout, growing on an oak to the west. It was so new that I didn’t ask it.',
        ),
        N(
          'The old woman puts her cup down very carefully, as if it had become important not to spill it.',
        ),
        CR('Too young. Yes. Very wise.'),
      ],
      [
        ask(
          6,
          'sel',
          'CASEL: Responsible decision-making',
          'trust and caution (a think question)',
          [
            N(
              'Frigg welcomes the stranger and answers every question. The old woman puts her cup down very carefully.',
            ),
            N('Is it good to trust everyone? When should we be careful?'),
          ],
          [
            opt('Trust is good, but we can be careful about what we share', [
              N('A balanced answer. Kindness and caution can go together.'),
            ]),
            opt('We should trust people until they give us a reason not to', [
              N('A hopeful view. The trouble is that some reasons only show themselves too late.'),
            ]),
            opt('We should be careful with strangers who ask a lot of questions', [
              N(
                'A cautious view. Frigg noticed afterwards that the guest asked a lot, but by then it was told.',
              ),
            ]),
          ],
          'Reflected on when to trust and when to be careful (no single right answer).',
        ),
      ],
      {
        choices: [
          {
            id: 'wind',
            label: 'Keep winding the wool.',
            then: [
              N(
                'You keep winding, round and round your hands, and you don’t look up. Later you will wish you had.',
              ),
            ],
          },
          {
            id: 'look',
            label: 'Look up at the old woman.',
            then: [
              N(
                'You look up. Under the shawls, for a moment, someone is smiling, and then it is only shawls.',
              ),
            ],
          },
          {
            id: 'hold',
            label: 'Pick up your Nubbin.',
            then: [
              N(
                'You pick up your Nubbin. It is trembling very slightly all over, like a cup of water on a table someone has bumped.',
              ),
            ],
          },
        ],
      },
    ),
    sc(
      'a20-05-talk-done',
      [
        N('The old woman thanks Frigg, and gets up, and goes out of the door.'),
        N(
          'You go to the doorway a moment after, and the path runs empty both ways. You didn’t see which way she went.',
        ),
      ],
      [
        ask(
          1,
          'social-studies',
          'D2.Geo.2.3-5',
          'compass directions: opposites',
          [
            N(
              'The path runs north and south past Fensalir’s door, and the old woman could have gone either way.',
            ),
            N('If she walked north, which way would she have to walk to come back?'),
          ],
          [
            opt(
              'South',
              [N('Yes. South is the opposite of north. East and west are opposites too.')],
              true,
            ),
            opt('East', [N('East is at a right angle to north. The opposite of north is south.')]),
            opt('West', [N('West is at a right angle to north. The opposite of north is south.')]),
          ],
          'Used compass directions: south is the opposite of north.',
        ),
      ],
    ),
    sc(
      'a20-05-complete',
      [
        FR(
          'An odd guest. Kind enough. She asked a great many questions for someone so tired.',
          'think',
        ),
        FU('I’ll bolt the door tonight.'),
        FR('Whatever for? Nothing can hurt him.', 'soft'),
        N('She goes back to her work. Your Nubbin sits by the door all evening, facing west.'),
      ],
      [
        ask(
          3,
          'science',
          '5-ESS1-2',
          'the Sun sets in the west',
          [
            N('Your Nubbin sits by the door all evening, facing west, towards the little sprout.'),
            N('In the evening, which direction is the Sun in?'),
          ],
          [
            opt(
              'The west',
              [
                N(
                  'Yes. The Sun rises in the east and sets in the west, because Earth turns towards the east.',
                ),
              ],
              true,
            ),
            opt('The east', [N('The Sun rises in the east. In the evening it sets in the west.')]),
            opt('Straight up', [
              N('That is where it is at midday. In the evening it is low in the west.'),
            ]),
          ],
          'Learned that the Sun sets in the west.',
        ),
      ],
    ),
  ],
  [],
);

// ================================================================== A20-6 Hödr
const Q06 = quest(
  'a20-06',
  'Hödr',
  {
    'a20-06-s1': {
      goal: 'Go back to the Thing-field for the game.',
      hint: 'Walk out to the ring of stones; Hödr will be standing apart again.',
    },
    'a20-06-s2': { goal: 'Run for the ring.', hint: 'There is no reaching it in time. Go anyway.' },
    'a20-06-s3': {
      goal: 'Sit with Hödr.',
      hint: 'Stay beside him outside the ring. Don’t leave him alone in it.',
    },
  },
  [
    sc(
      'a20-06-field',
      [
        N(
          'A quiet word before this part: Baldr dies in it. It is told gently, and no hurt is shown.',
        ),
        N(
          'The next day the game is on again. The Thing-field is full of the gods, and the ring is full of laughing.',
        ),
        N('Hödr stands outside the ring where he always stands, with his hands empty.'),
        N(
          'Somebody comes up beside him. You can’t see a face, only a cloak, and a hand holding something green.',
        ),
        VO('Why aren’t you throwing? Everyone honours your brother but you.'),
        HO('I can’t see where he is. And I’ve nothing to throw.'),
        VO('Then here’s something. A little sprig. I’ll guide your arm. Do as the others do.'),
        N(
          'The sprig is put in his hand: two leaves. You know it, and your Nubbin knows it, and starts to run.',
        ),
        HO('Thank you. I’d like that. I’d like to be in the game, just once.', 'happy'),
      ],
      [
        ask(
          6,
          'literacy',
          'RL.3.3',
          'a character’s motive',
          [
            N('A stranger hides their face, and offers to guide Hödr’s arm.'),
            N('Why might someone hide, and let Hödr do the throwing?'),
          ],
          [
            opt(
              'They want Hödr to do the harm, so they will not be blamed',
              [
                N(
                  'Yes. Someone who hides and lets another do the deed hopes not to be blamed. That is a clue this is a trick, not a kindness.',
                ),
              ],
              true,
            ),
            opt('They want Hödr to win a prize', [
              N(
                'There is no prize in the story. The hidden face is the clue: kind people do not hide.',
              ),
            ]),
            opt('They are only being kind', [
              N('Kindness usually does not hide its face. Notice who is not named.'),
            ]),
          ],
          'Used clues in the text to work out a character’s hidden motive.',
        ),
      ],
    ),
    sc(
      'a20-06-fall',
      [
        N(
          'The hand on Hödr’s arm turns him a little, and lifts it. You are running, and the field is very wide.',
        ),
        N(
          'Hödr throws. The sprig goes through the air with nothing to stop it, because nobody asked it to stop.',
        ),
        N('Baldr falls.'),
        N(
          'He falls the way a tall thing falls when it is not ready: all at once, and then still. There is no wound to see.',
        ),
        N('Baldr is dead. His body has stopped working, and it will not start again.'),
        N('Nobody laughs. The field is so quiet you can hear the grass.'),
        N(
          'The gods try to speak to each other, but they are crying too hard, and nobody can find any words.',
        ),
        N('The cloak at Hödr’s elbow is gone. Nobody saw it go.'),
        N(
          'Your Nubbin doesn’t go to Baldr. It goes past the ring and the weeping gods, straight to Hödr, and sits down by his feet.',
        ),
      ],
      [
        notice(
          6,
          'sel',
          'CASEL: Social awareness',
          'crying together is allowed',
          [
            N(
              'When someone dies, sadness can be too big for words. The gods cry so hard that nobody can speak.',
            ),
            N(
              'Crying together is not weakness. It shows how much someone mattered, and it helps to cry with someone beside you.',
            ),
          ],
          'Heard that crying together is a normal way to show how much someone mattered.',
        ),
      ],
    ),
    sc(
      'a20-06-hodr',
      [
        HO('What happened? Why has it gone quiet?', 'shock'),
        HO('Somebody tell me. Why has everybody stopped?', 'shock'),
        N(
          'Nobody answers him; the gods are weeping, and cannot speak. Your Nubbin leans against his shins.',
        ),
        HO('You’re there. The guest. Tell me. You always tell it right.', 'sad'),
        N('You are the one who has to tell him. There is no way of telling it that is right.'),
        N(
          'So you tell him plainly, and he doesn’t move. Then his hand opens, and lets go of nothing.',
        ),
        HO('I only wanted to be in the game.', 'sad'),
      ],
      [
        ask(
          6,
          'social-studies',
          'D2.Civ.8.3-5',
          'who is to blame? (a think question)',
          [
            N('Hödr threw the sprig, but he could not see, and someone else guided his arm.'),
            N('Is Hödr to blame for what happened? Who is?'),
          ],
          [
            opt('Hödr is not to blame: he was tricked', [
              N(
                'A kind and fair view. He did not know what he was throwing, and he trusted a voice he could not see.',
              ),
            ]),
            opt('Hödr is partly responsible: he threw it', [
              N('A fair point. But blame depends on what a person knew. Hödr did not know.'),
            ]),
            opt('The one who tricked him is responsible', [
              N('A clear view. The one who planned it and hid is the one who carries the blame.'),
            ]),
          ],
          'Reflected on who is responsible when someone is tricked (no single right answer).',
        ),
      ],
      {
        choices: [
          {
            id: 'sit',
            label: 'Sit down next to him, and stay.',
            then: [
              N(
                'You sit down in the grass beside him. After a long time he sits down too, all at once, as if his legs decided.',
              ),
            ],
          },
          {
            id: 'hand',
            label: 'Take his hand.',
            then: [
              N(
                'You take his hand, the hand that threw. He holds on to yours as if the field were tipping.',
              ),
            ],
          },
          {
            id: 'guided',
            label: 'Tell him somebody guided his arm.',
            then: [
              HO('I know. I felt it. It doesn’t help yet. It might one day. Stay anyway.', 'sad'),
            ],
          },
        ],
      },
    ),
    sc(
      'a20-06-complete',
      [
        N(
          'No one may take vengeance on the Thing-field. It is a place of peace, so holy that no hand can be raised there.',
        ),
        N(
          'So the gods stand and weep. Odin weeps hardest, because he understands best how much has been lost.',
        ),
        N(
          'Hödr sits in the grass outside the ring. Nobody comes to him but you, and your Nubbin, which has not moved from his feet.',
        ),
        FU(
          'Bring him to Fensalir. Frigg says so. Nobody should sit out here alone tonight.',
          'sad',
        ),
      ],
      [
        ask(
          3,
          'sel',
          'CASEL: Relationship skills',
          'what helps when someone is grieving',
          [
            N('Fulla says nobody should sit out there alone tonight.'),
            N('What helps most when someone is grieving?'),
          ],
          [
            opt(
              'Staying with them, even when there is nothing to say',
              [N('Yes. Being there says what words cannot: you are not alone.')],
              true,
            ),
            opt('Cheering them up quickly', [
              N('Cheerfulness can feel like being told to stop. Being with them is kinder.'),
            ]),
            opt('Giving them space and never checking in', [
              N('Some space is fine, but nobody should be left entirely alone with it. Check in.'),
            ]),
          ],
          'Talked about how to help someone who is grieving: stay with them.',
        ),
      ],
    ),
  ],
  [],
);

// ================================================================== A20-7 Who Will Ride
const Q07 = quest(
  'a20-07',
  'Who Will Ride',
  {
    'a20-07-s1': {
      goal: 'Be in Fensalir when Frigg speaks to the gods.',
      hint: 'Bring Hödr to Fensalir and stay by the door.',
    },
    'a20-07-s2': {
      goal: 'Bring Sleipnir from Odin’s stable.',
      hint: 'The stable is behind the great hall; the grey horse is the one with too many legs.',
    },
    'a20-07-s3': {
      goal: 'Say goodbye to Frigg before the road.',
      hint: 'Find Frigg at Fensalir’s door; Hermódr will wait.',
    },
  },
  [
    sc(
      'a20-07-asks',
      [
        N(
          'The gods come to Fensalir in the evening, and nobody sits. Hödr sits, because you brought him a stool.',
        ),
        N('Frigg stands by the cold hearth. She has stopped weeping, which is harder to look at.'),
        FR(
          'Which of you will ride the road to Hel for me? Find my son, and offer her a ransom, and have all my thanks.',
          'sad',
        ),
        N('The hall is very quiet. Nobody has ridden the road to Hel and come back to tell it.'),
        HE('I will.'),
        N(
          'It is Hermódr the Bold, Baldr’s brother, a quick, plain man who has never sat still in his life.',
        ),
        HE('I’ll ride. Tell me the way, and I’ll ride it.'),
        FR('Thank you.', 'soft'),
      ],
      [
        ask(
          2,
          'literacy',
          'L.3.4',
          'the word ransom',
          [
            N('Frigg wants someone to ride to Hel and offer a ransom for her son.'),
            N('What is a ransom?'),
          ],
          [
            opt(
              'A payment made to get someone freed or returned',
              [N('Yes. A ransom is what you give to win someone back.')],
              true,
            ),
            opt('A kind of horse', [
              N('Hermódr will take a horse, but a ransom is a payment, not an animal.'),
            ]),
            opt('A letter of thanks', [
              N('A ransom is not a letter. It is a payment made to get someone back.'),
            ]),
          ],
          'Learned the word ransom (a payment to win someone back).',
        ),
      ],
    ),
    sc(
      'a20-07-asks-done',
      [OD('Take my horse. Nothing else could make that road.')],
      [
        notice(
          0,
          'social-studies',
          'D2.His.2.3-5',
          'horses were how people travelled',
          [
            N(
              'Before cars, trains and aeroplanes, a good horse was the fastest way for most people to travel over land.',
            ),
            N(
              'A horse at a steady pace could carry a rider about 30 to 40 kilometres (20 to 25 miles) in a day. Odin’s horse is faster than any.',
            ),
          ],
          'Learned that horses were the main way to travel over land before engines.',
        ),
      ],
    ),
    sc(
      'a20-07-sleipnir',
      [
        N(
          'Odin’s stable is long and warm and smells of hay. At the end of it stands a grey horse, taller than the door.',
        ),
        N(
          'Sleipnir has eight legs. Your Nubbin counts them twice, then counts its own two, and looks at Sleipnir as if he had taken more than his share.',
        ),
        HE('He was born with them. Don’t take it personally.'),
        N(
          'He lets you take the halter without fuss. He has carried Odin over worse roads, and knows a serious errand.',
        ),
        N(
          'You lead him out. All eight hooves go down on the cobbles in an order you can’t follow.',
        ),
        HE('Good lad. Good. We’ll go far, you and I.'),
        HE('Guest. You’ve run Frigg’s errands all this while. Will you run this one?'),
        N('He looks at the horse’s broad grey back, and then at you. There is room for two.'),
      ],
      [
        ask(
          2,
          'maths',
          '3.OA.A.1',
          'multiplication: legs',
          [
            N('Sleipnir has eight legs. An ordinary horse has four.'),
            N('How many legs do two Sleipnirs have between them?'),
          ],
          [
            opt('16', [N('Yes. 2 × 8 = 16 legs: two groups of eight.')], true),
            opt('10', [N('10 is 8 + 2. Two horses with eight legs each is 2 groups of 8: 16.')]),
            opt('12', [N('12 is 8 + 4. Two Sleipnirs is 2 groups of 8: 16 legs.')]),
          ],
          'Used multiplication for equal groups: 2 × 8 = 16.',
        ),
      ],
    ),
    sc(
      'a20-07-door',
      [
        N(
          'Frigg is at the door when you come back leading Sleipnir. She has bread for each of you, and a cloak.',
        ),
        HE('We’ll go after the ship. I’ll see my brother off first, and ride at first light.'),
        FR('Yes. He would want you there.', 'soft'),
        N(
          'She turns to you, puts the cloak round your shoulders herself, and does up the fastening as if you were small.',
        ),
        FR('You don’t have to go so far for my son. You came here as a guest.'),
        N(
          'Your Nubbin is already sitting on Sleipnir’s back, holding his mane in both arms. It has decided.',
        ),
      ],
      [
        ask(
          5,
          'sel',
          'CASEL: Responsible decision-making',
          'honest promises: trying versus a guarantee (a think question)',
          [
            N('You are about to ride a road that nobody has come back from.'),
            N('Is “I will try” a more honest promise than “I will bring him home”? Why?'),
          ],
          [
            opt('Because trying is in your own hands, but the result is not', [
              N(
                'A clear reason. We can promise our effort. We cannot promise how the world will answer.',
              ),
            ]),
            opt('Because trying is easier to promise', [
              N(
                'Often it is. But trying is not always easy. It is an honest promise, which matters more.',
              ),
            ]),
            opt('Because it is more honest about what could go wrong', [
              N('Yes, that is part of it. An honest promise names only what we truly control.'),
            ]),
          ],
          'Reflected on why an honest promise is about trying, not guaranteeing (no single right answer).',
        ),
      ],
      {
        choices: [
          {
            id: 'home',
            label: '“We’ll bring him home.”',
            then: [
              FR(
                'Don’t promise me that. Promise me you’ll try. That one, I can hold you to.',
                'soft',
              ),
            ],
          },
          {
            id: 'try',
            label: '“We’ll try.”',
            then: [FR('Thank you. That’s all I asked of the world. Trying.', 'soft')],
          },
          {
            id: 'hand',
            label: 'Say nothing. Take her hand.',
            then: [
              N(
                'You take her hand. She holds it a moment, then puts it on Sleipnir’s halter, and steps back.',
              ),
            ],
          },
        ],
      },
    ),
    sc(
      'a20-07-complete',
      [
        N(
          'That night you sleep in Fensalir’s hall. Hermódr doesn’t; you hear him outside, talking to the horse in a low voice.',
        ),
        N(
          'Your Nubbin creeps out to the step and sits looking up at the pale hall on the rise. There is no light in it.',
        ),
        N('For the first time since it came here, it doesn’t know which way to face.'),
        FU('Come in, small one. Come in. It’s cold.', 'soft'),
      ],
      [
        ask(
          2,
          'literacy',
          'RL.3.3',
          'how a character responds to an event',
          [
            N('For the first time, your Nubbin does not know which way to face.'),
            N('Why? What has changed for it?'),
          ],
          [
            opt(
              'The light it always turned towards has gone out',
              [
                N(
                  'Yes. It had learned to face Baldr’s light, and now the hall on the rise is dark.',
                ),
              ],
              true,
            ),
            opt('It has forgotten how to turn round', [
              N('It still knows how to turn. What has gone is the thing it was turning towards.'),
            ]),
            opt('It is playing a game', [
              N('Nothing in the scene is playful. It is missing the light.'),
            ]),
          ],
          'Explained how a character reacts to a loss: it has lost the light it faced.',
        ),
      ],
    ),
  ],
  [{ word: 'ransom', meaning: 'A payment made to win someone back.', scene: 'a20-07-asks' }],
);

// ================================================================== A20-8 The Ship
const Q08 = quest(
  'a20-08',
  'The Ship',
  {
    'a20-08-s1': {
      goal: 'Help the gods launch Baldr’s ship.',
      hint: 'Put your shoulder to the hull with the others when Thor calls.',
    },
    'a20-08-s2': {
      goal: 'Watch for the one who comes from Jötunheim.',
      hint: 'Stand back from the hull and watch the road down from the mountains.',
    },
    'a20-08-s3': {
      goal: 'Lay something on the ship for Baldr, or stand back.',
      hint: 'Wade out to the ship’s side, where Fulla will take what you bring.',
    },
  },
  [
    sc(
      'a20-08-shore',
      [
        N(
          'Baldr’s ship is called Hringhorni. It is the greatest of all ships, and it lies on the shore on rollers, its prow to the sea.',
        ),
        N(
          'The gods have carried Baldr down to it, and laid him on board, and covered him. You see nothing but the cloth.',
        ),
        TH('Now. All together. Push.'),
        N(
          'Everyone puts a shoulder to the hull. You find a place low down by a roller, and your Nubbin finds a place under your elbow.',
        ),
        N(
          'The ship does not move, not a finger’s width. It is as if the shore will not let him go.',
        ),
        TH('Again!'),
        N('Again, and nothing. The gods stand back, breathing hard, and look at one another.'),
        OD('Send to Jötunheim. There is one there who could move it.'),
      ],
      [
        ask(
          4,
          'science',
          '3-PS2-1',
          'rollers reduce friction',
          [
            N('Baldr’s ship sits on rollers, but it still will not move.'),
            N('Rollers help move a heavy load. Why are they better than dragging it?'),
          ],
          [
            opt(
              'Rolling has much less friction than sliding',
              [
                N(
                  'Yes. Friction is the rubbing that holds things back. Rolling rubs far less than sliding.',
                ),
              ],
              true,
            ),
            opt('Rollers make the ship lighter', [
              N('The ship weighs the same. Rollers only cut the friction.'),
            ]),
            opt('Rollers push the ship by themselves', [
              N('Rollers do not push. They just let the load roll when something else does.'),
            ]),
          ],
          'Learned that rollers reduce friction, so heavy loads move more easily.',
        ),
      ],
    ),
    sc(
      'a20-08-giantess',
      [
        N(
          'She comes down from the mountains riding a wolf, with snakes for reins. Her name is Hyrrokkin.',
        ),
        N(
          'The wolf is grey as old ice. Four of Odin’s strongest warriors hold it when she gets down, and even they can hardly hold it.',
        ),
        N(
          'She walks to the prow of Hringhorni without a word to anyone, puts her hands on it, and pushes. Once.',
        ),
        N(
          'The ship goes down the rollers with a roar. Sparks jump from the rollers, and the whole shore shakes.',
        ),
        N('Thor’s hand goes to his hammer. He is grieving, and grief looks for somewhere to go.'),
        OD('No. She came to help. Let her be.'),
        N(
          'Thor takes his hand away. Hyrrokkin looks at him a long moment, and nods, and goes back the way she came.',
        ),
      ],
      [
        ask(
          5,
          'sel',
          'CASEL: Self-management',
          'where anger that comes from grief should go (a think question)',
          [
            N('Thor’s hand goes to his hammer, and Odin tells him to let her be.'),
            N(
              'Grief can look for somewhere to go, and sometimes it turns into anger. Where should it go instead?',
            ),
          ],
          [
            opt('Say what it is: “I am angry because I am so sad”', [
              N('A brave answer. Naming the real feeling can take the sting out of it.'),
            ]),
            opt('Do something useful with it, like helping', [
              N(
                'A strong answer. Thor can put his strength to work on the ship instead of on a guest.',
              ),
            ]),
            opt('Wait, breathe, and let someone steady you, as Odin does', [
              N('A wise answer. Odin does not shout. He says one calm sentence, and Thor listens.'),
            ]),
          ],
          'Reflected on what to do with anger that comes from grief (no single right answer).',
        ),
      ],
    ),
    sc(
      'a20-08-pyre',
      [
        N(
          'Baldr’s wife, Nanna, has stood on the shore all morning. When the ship moves, her heart breaks with grief, and she dies there.',
        ),
        N('They lay her on the ship beside him, gently, under the same cloth.'),
        N(
          'Thor stands at the ship’s side and raises his hammer over them, and hallows them both, so that they go well.',
        ),
        N(
          'Odin lays a gold ring on the cloth. It is called Draupnir, and it is the best thing he owns.',
        ),
        N('The ship rocks a little in the shallows, waiting.'),
        FU('Everyone gives something. You don’t have to. But you can.', 'soft'),
      ],
      [
        notice(
          5,
          'social-studies',
          'D2.His.2.3-5',
          'Viking-age ship burials',
          [
            N(
              'Real Viking-age people sometimes buried important people in ships. The Oseberg ship, in Norway, held two women about 1,200 years ago, with beds, cloth and tools.',
            ),
            N(
              'Giving gifts to the dead was a way of honouring them. We still bring flowers, light candles and tell stories.',
            ),
          ],
          'Learned that real Viking-age ship burials existed, and that people still honour the dead with gifts and stories.',
        ),
      ],
      {
        choices: [
          {
            id: 'stone',
            label: 'Lay a pebble from the Thing-field.',
            then: [
              N(
                'You lay a grey pebble from the game beside Draupnir. It looks small there, and exactly right.',
              ),
            ],
          },
          {
            id: 'thread',
            label: 'Lay a twist of thread from Frigg’s spindle.',
            then: [
              N('You lay a twist of the thread on the cloth: one of the promises, going with him.'),
            ],
          },
          {
            id: 'back',
            label: 'Lay nothing. Stand back with Hödr.',
            then: [
              N(
                'You stand back on the stones beside Hödr, who can’t see the ship. You tell him, quietly, where everything is.',
              ),
            ],
          },
        ],
      },
    ),
    sc(
      'a20-08-complete',
      [
        N(
          'Then they light the pyre and push the ship out. You don’t watch the burning; you watch the light go.',
        ),
        N(
          'Out on the water it is one bright thing, then a small bright thing, then a star sitting low on the sea.',
        ),
        N(
          'Your Nubbin stands at the edge of the waves and watches it until it is gone. Then it keeps watching the place.',
        ),
        HE('First light.', 'sad'),
        HE('Eat something. Sleep if you can. We have a long way to go down.'),
      ],
      [
        ask(
          1,
          'science',
          '4-PS3-2',
          'we see things when light reaches our eyes',
          [
            N(
              'The ship becomes one bright thing, then a small bright thing, then a star low on the sea.',
            ),
            N('You can see a lit ship far out at night. What must happen for you to see it?'),
          ],
          [
            opt(
              'Light from the ship travels to your eyes',
              [
                N(
                  'Yes. We see something when light from it reaches our eyes. Our eyes receive light. They do not send it out.',
                ),
              ],
              true,
            ),
            opt('Your eyes send light out to the ship', [
              N(
                'A common idea, but not so. Eyes only receive light. The ship’s light travels to you.',
              ),
            ]),
            opt('The ship must be warm', [
              N('Warmth is not what we see. We see light, and the ship is giving some off.'),
            ]),
          ],
          'Learned that we see things when light from them reaches our eyes.',
        ),
      ],
    ),
  ],
  [
    {
      word: 'friction',
      meaning: 'The rubbing between two surfaces that slows things down.',
      scene: 'a20-08-shore',
    },
  ],
);

// ================================================================== A20-9 Nine Nights
const Q09 = quest(
  'a20-09',
  'Nine Nights',
  {
    'a20-09-s1': {
      goal: 'Ride behind Hermódr down the road to Hel.',
      hint: 'Hold on to Hermódr’s belt; Sleipnir knows the way.',
    },
    'a20-09-s2': {
      goal: 'Cross the gold-roofed bridge over the river Gjöll.',
      hint: 'Ride up to the bridge and answer the woman who keeps it.',
    },
  },
  [
    sc(
      'a20-09-dales',
      [
        N(
          'Sleipnir goes down out of the morning into dales so deep and dark that the light can’t follow.',
        ),
        N(
          'You ride behind Hermódr with your arms round his belt. Your Nubbin rides inside your cloak, with just its eyes out.',
        ),
        N(
          'You ride for nine nights. There is nothing to see: not a star, not your own hand in front of your face.',
        ),
        HE('Still there, guest?'),
        Y('Still here.'),
        HE('Good. Keep saying so. I like to know.'),
        N('All you can hear is eight hooves, and the cold, and Hermódr breathing.'),
      ],
      [
        ask(
          2,
          'maths',
          '3.MD.A.1',
          'days of the week and counting nights',
          [
            N(
              'You ride for nine nights. Say you set off on a Monday morning, and Monday night is the first night.',
            ),
            N('On which day does the ninth night fall?'),
          ],
          [
            opt(
              'Tuesday',
              [
                N(
                  'Yes. Nights one to seven are Monday to Sunday, the eighth is Monday again, and the ninth is Tuesday.',
                ),
              ],
              true,
            ),
            opt('Sunday', [N('Sunday is night seven. Two more nights: Monday, then Tuesday.')]),
            opt('Wednesday', [N('Wednesday is night ten. The ninth is a day earlier: Tuesday.')]),
          ],
          'Counted nine nights through the days of the week.',
        ),
      ],
      {
        choices: [
          {
            id: 'count',
            label: 'Count the nights aloud.',
            then: [N('You count them: one, two. By the sixth, Hermódr is counting with you.')],
          },
          {
            id: 'baldr',
            label: 'Talk about Baldr.',
            then: [
              HE(
                'Yes. Tell me something he did. Anything. I don’t want to forget the sound of him.',
                'sad',
              ),
              N(
                'You tell him about the strap Baldr was mending, and how he said everyone ought to sit. Hermódr laughs, once.',
              ),
            ],
          },
          {
            id: 'quiet',
            label: 'Keep quiet, and hold on.',
            then: [
              N(
                'You say nothing. Every so often Hermódr puts one hand back over yours on his belt, to check.',
              ),
            ],
          },
        ],
      },
    ),
    sc(
      'a20-09-bridge',
      [
        N(
          'On the ninth night there is light ahead: a bridge over a loud river, roofed all over with gold that shines on its own.',
        ),
        N(
          'The river is Gjöll. A woman stands at the near end of the bridge, tall and plain, with her hands folded.',
        ),
        MO(
          'I am Módgudr, and I keep this bridge. Tell me your name and your kin, and why you ride it living.',
        ),
        HE('Hermódr, Odin’s son. I ride for my brother Baldr. Has he come this way?'),
        MO(
          'Yesterday five troops of the dead rode over this bridge, and it hardly made a sound under them.',
        ),
        MO(
          'Tonight it rings under one horse as if an army were crossing. You aren’t dead. None of you. Not even the small one.',
          'think',
        ),
        N('Your Nubbin puts its head out of your cloak to check.'),
        MO('Baldr rode over. Yes. The road to Hel lies down, and to the north.', 'soft'),
      ],
      [
        ask(
          5,
          'science',
          '4-PS3-2',
          'vibrations make sound',
          [
            N(
              'The bridge hardly rang under the dead, but it rings like a bell under your living horse.',
            ),
            N('In real life, what makes any bell, drum or bridge ring?'),
          ],
          [
            opt(
              'It vibrates: it shakes back and forth very fast, and that pushes the air',
              [N('Yes. Sound is vibration. The shaking passes through the air to your ears.')],
              true,
            ),
            opt('It glows', [
              N('Light and sound are different things. A ringing bell is shaking, not glowing.'),
            ]),
            opt('It gets heavier', [
              N('A bell weighs the same ringing or not. What changes is that it vibrates.'),
            ]),
          ],
          'Learned that sound is made by vibration.',
        ),
      ],
    ),
    sc(
      'a20-09-bridge-done',
      [MO('Go gently. Everyone down there was somebody’s.', 'soft')],
      [
        ask(
          0,
          'sel',
          'CASEL: Social awareness',
          'treating grief with respect (a think question)',
          [
            N('Módgudr says, “Go gently. Everyone down there was somebody’s.”'),
            N('What does it mean to treat grief gently? How would you do it?'),
          ],
          [
            opt('Speak softly, and do not rush people', [
              N('A good start. Gentleness is often about pace and tone.'),
            ]),
            opt('Remember that each person who has died mattered to someone', [
              N('That is Módgudr’s point. Behind every loss is someone who is missing a person.'),
            ]),
            opt('Say less, and listen more', [
              N('A wise answer. People who are grieving often need to be heard more than advised.'),
            ]),
          ],
          'Reflected on what it means to be gentle around grief (no single right answer).',
        ),
      ],
    ),
    sc(
      'a20-09-complete',
      [
        N(
          'You ride on, down and to the north. The road grows wider and quieter, as if it were used to people.',
        ),
        N('Ahead there is a gate, very tall, with no one at it.'),
        HE('Hold on. Both of you. Tighter than that.'),
        N('Your Nubbin wraps itself round your middle, under the cloak, and holds on.'),
      ],
      [
        ask(
          0,
          'literacy',
          'L.4.5',
          'personification',
          [
            N('The writer says the road grows wider and quieter “as if it were used to people.”'),
            N(
              'When a writer gives a thing a human habit or feeling, that is personification. What does it do here?',
            ),
          ],
          [
            opt(
              'It makes the road feel like a place that has welcomed many travellers',
              [
                N(
                  'Yes. A road “used to people” feels old, patient and well worn. It is a quiet way to say many have passed here.',
                ),
              ],
              true,
            ),
            opt('It tells us the road can talk', [
              N(
                'The road does not speak. It is a figure of speech, giving the road a human habit.',
              ),
            ]),
            opt('It tells us the road is dangerous', [
              N('The words feel calm, not scary. The road seems to be used to company.'),
            ]),
          ],
          'Explained personification: a road “used to people.”',
        ),
      ],
    ),
  ],
  [
    {
      word: 'personification',
      meaning: 'Giving a thing human feelings or habits, in writing.',
      scene: 'a20-09-complete',
    },
  ],
);

// ================================================================== A20-10 Hel’s Hall
const Q10 = quest(
  'a20-10',
  'Hel’s Hall',
  {
    'a20-10-s1': {
      goal: 'Hold on while Sleipnir leaps Hel’s gate.',
      hint: 'Hold Hermódr’s belt with both hands, and lean when he leans.',
    },
    'a20-10-s2': {
      goal: 'Stand with Hermódr in Hel’s hall while he asks for his brother.',
      hint: 'Follow your Nubbin to the high seat and stay at Hermódr’s side.',
    },
    'a20-10-s3': {
      goal: 'Carry Baldr’s and Nanna’s gifts for home.',
      hint: 'Take what Baldr and Nanna give you, and keep it safe for the road.',
    },
  },
  [
    sc(
      'a20-10-gate',
      [
        N(
          'Hermódr gets down and pulls the girth tight. Then he mounts again and turns Sleipnir back from the gate, a long way back.',
        ),
        HE('He’s jumped worse. Not much worse. Lean when I lean.'),
        N('Sleipnir runs at the gate. Eight hooves, and then none.'),
        N(
          'He goes over so high and so clean that he never touches it. Your stomach stays on the far side for a moment.',
        ),
        N('Then you are down, inside, on a floor like cold stone, and it is very quiet.'),
        N(
          'Your Nubbin puts its head out of your cloak. Then it wriggles free, drops to the floor, and runs.',
        ),
      ],
      [
        ask(
          2,
          'science',
          '3-PS2-1',
          'motion carries things forward',
          [
            N('Hermódr turns Sleipnir back a long way from the gate before they charge it.'),
            N('Why does a run-up help a horse jump higher and further?'),
          ],
          [
            opt(
              'Its speed carries it forward, and its legs can push it upward',
              [
                N(
                  'Yes. A moving body keeps moving, so the run-up gives the jump its forward push.',
                ),
              ],
              true,
            ),
            opt('A run-up makes the gate lower', [
              N('The gate stays as tall as it was. The horse gets more speed.'),
            ]),
            opt('It tires the horse out so it jumps better', [
              N('Tiring a horse would make the jump worse. The speed is what helps.'),
            ]),
          ],
          'Learned that a run-up gives a jump forward motion.',
        ),
      ],
    ),
    sc(
      'a20-10-gate-done',
      [N('It has seen a light, not a bright one. But it would know it anywhere.')],
      [
        ask(
          0,
          'sel',
          'CASEL: Self-awareness',
          'recognising someone we love (a think question)',
          [
            N('Your Nubbin sees a light that is not bright, and would know it anywhere.'),
            N(
              'Why can we know someone we love from far away, even when they look dimmer or different?',
            ),
          ],
          [
            opt('Because we know the small things about them, not just how they look', [
              N(
                'A lovely answer. We learn a person’s walk, voice and ways, and those are hard to hide.',
              ),
            ]),
            opt('Because love gives us a sort of sixth sense', [
              N(
                'A romantic idea. Whatever it is, the Nubbin knows its friend’s light the way you know a voice.',
              ),
            ]),
            opt('Because the Nubbin has been following that light all along', [
              N('True. Habit and attention teach us who to look for.'),
            ]),
          ],
          'Reflected on how we recognise people we love (no single right answer).',
        ),
      ],
    ),
    sc(
      'a20-10-hall',
      [
        N(
          'Baldr is sitting in the high seat of the hall. His light is low, like a lamp turned down, but it is his.',
        ),
        N('Your Nubbin is already asleep on the step below him, curled up in what light there is.'),
        BA('Brother. And the guest. You came all this way.', 'soft'),
        N(
          'Hel comes into her hall. She is tall and grave, half her face the colour of a winter dusk, and she does not hurry.',
        ),
        HE(
          'Lady. Everyone above weeps for my brother. Let him ride home with me, and name your price.',
        ),
        HL('Everyone? People say that. I will see whether he is as loved as they say.', 'think'),
        HL(
          'If everything in the world cries for him, every living thing and every stone, he may go home,',
        ),
        HL(
          'but if one thing will not weep, he stays with me. That is my price, and it is a fair one.',
        ),
        HE('Everything will. You don’t know him.'),
        HL('No. But I will.', 'soft'),
      ],
      [
        ask(
          9,
          'literacy',
          'RL.3.3',
          'is Hel fair or cruel? (a think question)',
          [
            N(
              'Hel says she will see whether Baldr is as loved as people say. She sets a price, but she calls it fair.',
            ),
            N('Is Hel cruel, or fair? What in her words makes you think so?'),
          ],
          [
            opt('Fair: she names her rule openly and keeps to it', [
              N(
                'A reasonable reading. She does not trick anyone. She says plainly what she will do.',
              ),
            ]),
            opt('Cruel: she sets a price she may know cannot be met', [
              N(
                'A strong reading. If even one thing refuses, the price fails. That is a hard rule.',
              ),
            ]),
            opt('Neither: she is grave, and is doing her work', [
              N('A careful reading. She is solemn rather than unkind, and she says, “I will see.”'),
            ]),
          ],
          'Weighed evidence in the text about a character’s fairness (no single right answer).',
        ),
      ],
    ),
    sc(
      'a20-10-gifts',
      [
        N(
          'Baldr comes down from the high seat to walk you to the door. Your Nubbin wakes and walks with him, in his light.',
        ),
        N('He takes the ring Draupnir from his arm and puts it in Hermódr’s hand.'),
        BA(
          'Give this back to Father, for a remembrance. He’ll want something to turn in his hands.',
          'soft',
        ),
        N('Nanna comes behind him with a folded linen smock, and a gold ring.'),
        NA(
          'The linen is for Frigg. The ring is for Fulla. Tell her thank you, for all the times she did my hair.',
          'soft',
        ),
        BA('Guest. What did my mother say, when you left?'),
      ],
      [
        ask(
          4,
          'science',
          '',
          'linen comes from flax',
          [
            N('Nanna gives Frigg a folded linen smock.'),
            N('Linen is made from the fibres inside the stem of a plant. Which plant?'),
          ],
          [
            opt(
              'Flax',
              [
                N(
                  'Yes. Flax stems are soaked, beaten and spun into thread. Linen is cool and strong, which is why it was prized.',
                ),
              ],
              true,
            ),
            opt('Cotton', [
              N('Cotton comes from the soft fluff round the seeds. Linen comes from flax stems.'),
            ]),
            opt('Wool', [N('Wool comes from sheep, not from a plant. Linen comes from flax.')]),
          ],
          'Learned that linen is made from the stems of the flax plant.',
        ),
      ],
      {
        choices: [
          {
            id: 'try',
            label: 'She asked us to try.',
            then: [BA('That’s her. She never asks for more than you can carry.', 'soft')],
          },
          {
            id: 'ask',
            label: 'She asked the whole world once. She’ll ask it again.',
            then: [
              BA(
                'She will. She’ll ask until her voice gives out. Tell her I’m warm here. It’s true.',
                'soft',
              ),
            ],
          },
          {
            id: 'step',
            label: 'She sat on the step, and didn’t say anything.',
            then: [
              N('Baldr is quiet a long while.'),
              BA('Then sit with her, when you get back. She won’t ask that either.', 'soft'),
            ],
          },
        ],
      },
    ),
    sc(
      'a20-10-complete',
      [
        N(
          'Your Nubbin will not leave his light. In the end Baldr picks it up himself and hands it to you at the gate.',
        ),
        BA(
          'Go on. I’ll be here. It isn’t so bad. There’s room, and it’s quiet, and Nanna is with me.',
          'soft',
        ),
        N(
          'Sleipnir takes you back up the road: nine nights, as it was nine nights down, the dark, the gold bridge, and Módgudr lifting one hand.',
        ),
        HE('Everything has to weep. Everything.', 'think'),
        HE('Then we ask everything. Again.'),
      ],
      [
        ask(
          4,
          'maths',
          '3.OA.A.1',
          'equal groups: 2 × 9',
          [
            N('You rode nine nights down the road, and nine nights back.'),
            N('How many nights have you spent on the road?'),
          ],
          [
            opt('18', [N('Yes. Two journeys of nine nights: 2 × 9 = 18 nights on the road.')], true),
            opt('9', [N('9 is just one way. You rode nine nights down and nine nights back.')]),
            opt('81', [N('81 is 9 × 9. There are two journeys of nine: 2 × 9 = 18.')]),
          ],
          'Used equal groups: two journeys of nine nights is 2 × 9 = 18.',
        ),
      ],
    ),
  ],
  [],
);

// ================================================================== A20-11 Everything Weeps
const Q11 = quest(
  'a20-11',
  'Everything Weeps',
  {
    'a20-11-s1': {
      goal: 'Go out with the messengers to ask the whole world to weep.',
      hint: 'Choose a road at Fensalir’s door; every road needs somebody.',
    },
    'a20-11-s2': {
      goal: 'Carry frosted stones from the shade into the sun.',
      hint: 'Pick up the white-rimed stones on the north side and set them down in the sunlight.',
    },
    'a20-11-s3': { goal: 'Stay with your Nubbin.', hint: 'Sit down by your Nubbin in the sun.' },
  },
  [
    sc(
      'a20-11-send',
      [
        N(
          'Hermódr tells it all in Fensalir: the road, the bridge, the high seat, and Hel’s price.',
        ),
        N(
          'Odin turns Draupnir over and over in his hands. Fulla wears her ring on a cord round her neck.',
        ),
        FR('Then we ask again. Everything. Every road. Send out messengers.', 'soft'),
        MS('There are more roads than messengers, lady.'),
        FR('Then take the guest. And the small one. It already knows how to ask.'),
        N(
          'Your Nubbin stands up straight, with its feet together, as it did when it made its own promise.',
        ),
      ],
      [
        ask(
          1,
          'literacy',
          'L.3.4',
          'the word keepsake',
          [
            N(
              'Odin turns Draupnir over and over in his hands, and Fulla wears her ring on a cord round her neck. They are keepsakes: things kept to remember a person.',
            ),
            N('Which of these is a keepsake?'),
          ],
          [
            opt(
              'A ring that a dear friend gave you',
              [N('Yes. A keepsake carries a memory of the one who gave it.')],
              true,
            ),
            opt('A bus ticket you found on the pavement', [
              N(
                'It could be, if it reminds you of a special day, but a found ticket has no person attached. A keepsake is tied to someone.',
              ),
            ]),
            opt('A bill you have to pay', [
              N(
                'A bill is a duty, not a memory. A keepsake is kept because we love what it reminds us of.',
              ),
            ]),
          ],
          'Learned the word keepsake (something kept to remember a person).',
        ),
      ],
      {
        choices: [
          {
            id: 'hills',
            label: 'Take the road to the hills.',
            then: [MS('Stones, then, and old snow. Slow to answer. We’ll go slowly.')],
          },
          {
            id: 'shore',
            label: 'Take the road to the shore.',
            then: [MS('Salt and shingle. The sea will weep. It always looks as if it might.')],
          },
          {
            id: 'woods',
            label: 'Take the road through the woods.',
            then: [MS('Trees. They weep easily. It’s the iron under the ground I worry about.')],
          },
        ],
      },
    ),
    sc(
      'a20-11-stones',
      [
        N(
          'Everywhere you go, things weep: men and women at their doors, beasts in the fields, the earth itself in dark wet patches.',
        ),
        N(
          'In a hollow on the north side there are stones still white with frost. Nobody has asked them yet.',
        ),
        MS('Carry them out, into the sun. You’ll see.'),
        N(
          'You carry the first one out and set it down where the sun is. The frost on it shines, goes clear, and begins to run.',
        ),
        N('Along the bottom of the page, the story goes on in plain print:'),
        N(
          'Everybody wept, and every animal, and the ground, and the stones, and the trees, and every kind of metal.',
        ),
        N(
          'You know how frost turns to drops of water when you bring it in from the cold? That is how they wept.',
        ),
        N('You carry stone after stone into the light, and every one of them weeps.'),
      ],
      [
        ask(
          3,
          'science',
          '4-PS3-2',
          'melting versus condensation',
          [
            N(
              'Frost on a stone runs with water when it comes into the sun. Is this melting or condensation?',
            ),
          ],
          [
            opt(
              'Melting: ice turning to water as it warms above 0°C (32°F)',
              [N('Yes. Frost is ice, and warmth turns it back into liquid water.')],
              true,
            ),
            opt('Condensation', [
              N(
                'Close, but no. Condensation is water vapour turning to drops on something cold, like a cold glass. This frost is ice, so it is melting.',
              ),
            ]),
            opt('Evaporation', [
              N(
                'Evaporation turns liquid water into invisible vapour. Here the frost turns into liquid drops, not vapour.',
              ),
            ]),
          ],
          'Told melting from condensation and evaporation.',
        ),
        ask(
          6,
          'literacy',
          'L.4.5',
          'personification: the weeping stones',
          [
            N('The story says stones and trees and metals weep. Stones cannot really cry.'),
            N('Why might a storyteller say it?'),
          ],
          [
            opt(
              'It shows, through personification, that the whole world mourned',
              [N('Yes. Giving stones tears makes the loss feel as big as the world.')],
              true,
            ),
            opt('Because Snorri did not know that stones are not alive', [
              N('People of Snorri’s time knew what stones were. He chose this picture on purpose.'),
            ]),
            opt('Because stones can really cry', [
              N(
                'Stones cannot cry. But frost melting on them looks like weeping, which is where the picture comes from.',
              ),
            ]),
          ],
          'Explained why a storyteller gives stones human feelings (personification).',
        ),
      ],
    ),
    sc(
      'a20-11-stones-done',
      [
        N(
          'The iron in a gate weeps, and the copper on a roof. Even the gold on a ring weeps a little, in the warm.',
        ),
      ],
      [
        ask(
          0,
          'science',
          '4-PS3-2',
          'metals move heat quickly',
          [
            N(
              'The iron in a gate, the copper on a roof and even a gold ring all weep in the warm.',
            ),
            N(
              'Metal feels colder than wood on a cold day, though both are the same temperature. Why?',
            ),
          ],
          [
            opt(
              'Metal moves heat out of your hand faster, so your skin senses more cold',
              [N('Yes. Metals conduct heat quickly, so they steal it from your hand.')],
              true,
            ),
            opt('Metal makes its own cold', [
              N('Nothing makes cold. Metal just carries heat away from your hand faster.'),
            ]),
            opt('Wood is warmer inside', [
              N(
                'Both are the same temperature. It is the speed at which heat leaves your hand that differs.',
              ),
            ]),
          ],
          'Learned that metals conduct heat quickly, so they feel colder.',
        ),
      ],
    ),
    sc(
      'a20-11-nubbin',
      [
        N(
          'You look round for your Nubbin. It is sitting in the sun beside the last stone, very still.',
        ),
        N(
          'Water is running down its face, and it isn’t frost. It wipes at it with both arms, and looks at its arms, astonished.',
        ),
        N(
          'It has never done this before. It looks up at you, as if to ask whether it is doing it wrong.',
        ),
        MS('Ah. There’s one more thing weeping than we asked.', 'soft'),
        N(
          'You sit down beside it. It climbs into your lap and goes on weeping, more easily now that it knows what it is.',
        ),
        N('Somewhere very far down, you think, Baldr’s light might be a little brighter.'),
      ],
      [
        ask(
          2,
          'sel',
          'CASEL: Self-awareness',
          'feelings that arrive without warning (a think question)',
          [
            N(
              'Water runs down your Nubbin’s face and it looks at its arms, astonished. It has never done this before.',
            ),
            N(
              'Have you ever had a feeling arrive that you did not expect? What did you do with it?',
            ),
          ],
          [
            opt('I let it out: crying or talking helped', [
              N('A sound choice. Feelings tend to soften when they have somewhere to go.'),
            ]),
            opt('I needed someone to sit beside me', [
              N('So does your Nubbin. It climbs into your lap, and that helps.'),
            ]),
            opt('I tried to push it away, and it grew', [
              N('That happens to many people. It helps to know you are allowed to feel it.'),
            ]),
          ],
          'Reflected on feelings that arrive unexpectedly (no single right answer).',
        ),
      ],
    ),
    sc(
      'a20-11-complete',
      [
        N('You started at nine in the morning. By two in the afternoon, the last stone weeps.'),
        N(
          'By evening every road you walked is wet, and the sun is going down red over a weeping world.',
        ),
        MS('That’s ours done. Everything we asked, wept. Time to go home.', 'soft'),
        N('Your Nubbin carries one of the frost-stones home in both arms, and won’t put it down.'),
        N('Whenever the sun touches it, it weeps a little still. It always will.'),
      ],
      [
        ask(
          0,
          'maths',
          '3.MD.A.1',
          'time intervals across noon',
          [N('How long did the weeping take, from nine o’clock to two o’clock?')],
          [
            opt(
              '5 hours',
              [N('Yes. Nine to twelve is 3 hours, and twelve to two is 2 more.')],
              true,
            ),
            opt('7 hours', [N('Count again: nine, ten, eleven, twelve, one, two. That’s 5.')]),
            opt('11 hours', [
              N('That is 9 + 2. We count the hours between, not add the clock numbers.'),
            ]),
          ],
          'Worked out a time interval across noon: nine o’clock to two o’clock is 5 hours.',
        ),
      ],
    ),
  ],
  [
    {
      word: 'condensation',
      meaning:
        'When invisible water vapour touches something cold and turns into tiny drops of water.',
      scene: 'a20-11-stones',
    },
    {
      word: 'keepsake',
      meaning: 'Something kept to remember a person who gave it or who matters to you.',
      scene: 'a20-11-send',
    },
  ],
);

// ================================================================== A20-12 The Cave
const Q12 = quest(
  'a20-12',
  'The Cave',
  {
    'a20-12-s1': {
      goal: 'Walk home with the messengers.',
      hint: 'Follow the road back towards Fensalir, under the cliff.',
    },
    'a20-12-s2': {
      goal: 'Ask the giantess in the cave to weep for Baldr.',
      hint: 'Go into the cave mouth with the messengers.',
    },
  },
  [
    sc(
      'a20-12-road',
      [
        N('The messengers come home along every road at once, wet to the knees and very quiet.'),
        MS('Nothing said no. Not one thing. Not a stone, not a beetle.', 'happy'),
        MS('He’ll be home by morning. Think of her face.', 'happy'),
        N(
          'The road home runs under a cliff. In the cliff there is a cave, and in the mouth of the cave somebody is sitting.',
        ),
        N(
          'A giantess. She has her knees drawn up and her arms round them, and her eyes are perfectly dry.',
        ),
        MS('One more. Just one. Then we’re done.'),
      ],
      [
        ask(
          3,
          'science',
          '',
          'how lava tubes form',
          [
            N(
              'The road runs under a cliff with a cave in it. Iceland has many caves, and some are lava tubes.',
            ),
            N(
              'A lava tube forms when the outside of a lava flow cools and hardens while hot lava keeps running inside. What is left when the lava drains away?',
            ),
          ],
          [
            opt(
              'A hollow tunnel',
              [N('Yes. The hardened shell stays behind, and the empty space is the cave.')],
              true,
            ),
            opt('A solid block of rock', [
              N('The lava inside drains away, so the space it left is empty.'),
            ]),
            opt('A lake', [
              N('No water fills it as it forms. What the lava leaves is an empty tunnel.'),
            ]),
          ],
          'Learned how a lava-tube cave forms.',
        ),
      ],
    ),
    sc(
      'a20-12-cave',
      [
        MS(
          'Mother, everything in the world weeps for Baldr, to bring him home from Hel. Will you weep too?',
        ),
        TK('My name is Thökk. And no.'),
        TK('I’ll weep for him with dry eyes. That’s all he’ll get from me.', 'angry'),
        TK('He was nothing to me living, and he’s nothing to me now. He can stay where he is.'),
        N(
          'The messengers stand very still. They have asked the whole world, and it said yes; they don’t know what to do with no.',
        ),
        N('Your Nubbin looks at you. Its face is still wet from the stones.'),
      ],
      [
        ask(
          4,
          'sel',
          'CASEL: Social awareness',
          'when someone says no (a think question)',
          [
            N(
              'Thökk says no, whatever you ask. The messengers have asked the whole world, and it said yes.',
            ),
            N('When someone says no, is it right to keep asking? What would you do?'),
          ],
          [
            opt('Ask once more, kindly, in case they change their mind', [
              N('A hopeful answer. But a second “no” may just be a stronger one.'),
            ]),
            opt('Accept the no, and stay kind', [
              N('A respectful answer. A no can be heard without being answered with anger.'),
            ]),
            opt('Look for a different way to help', [
              N('A practical answer. Sometimes a door that is shut means looking for another.'),
            ]),
          ],
          'Reflected on how to respond when someone says no (no single right answer).',
        ),
      ],
      {
        choices: [
          {
            id: 'plead',
            label: 'Plead with her.',
            set: { 'a20-thokk': 'plead' },
            then: [
              Y('Please. He was kind to everyone. He was kind to me, and I was a stranger.'),
              Y('Please weep. Just a little. It’s all it would take.'),
              TK('Then it’s a great deal, isn’t it, from me. No.', 'angry'),
            ],
          },
          {
            id: 'sat',
            label: 'Sit down next to her, and say nothing.',
            set: { 'a20-thokk': 'sat' },
            then: [
              N(
                'You sit down in the cave mouth beside her, a little apart. You don’t ask her anything.',
              ),
              N(
                'She looks at you sideways, and lets you stay. For a while, neither of you says a word.',
              ),
              TK('…It won’t make me weep, you know.'),
              N('You nod. You know.'),
            ],
          },
          {
            id: 'walked',
            label: 'Walk away.',
            set: { 'a20-thokk': 'walked' },
            then: [
              N(
                'You turn and walk out of the cave, because you can’t look at her. Behind you the messengers ask again, and again.',
              ),
              N('Her answer is the same each time. You can hear it from the road.'),
            ],
          },
        ],
      },
    ),
    sc(
      'a20-12-cave-done',
      [
        TK('Go home. Tell them Thökk wouldn’t.'),
        N('Whatever you do, she will not weep. The cave stays dry, and so do her eyes.'),
        MS('We knocked at a hundred doors on our road. Every one wept but hers.', 'sad'),
      ],
      [
        ask(
          2,
          'maths',
          '4.NBT.B.4',
          'subtraction: 100 − 1',
          [
            N('The messengers asked at 100 doors on their road, and only Thökk refused.'),
            N('How many wept?'),
          ],
          [
            opt('99', [N('Yes: 100 − 1 = 99 wept. And one did not.')], true),
            opt('100', [N('That would count Thökk too. She did not weep, so take one away: 99.')]),
            opt('1', [N('1 is how many refused. The rest wept: 100 − 1 = 99.')]),
          ],
          'Subtracted one from 100: 99 wept.',
        ),
      ],
    ),
    sc(
      'a20-12-complete',
      [
        N('The messengers go home slowly. Nobody wants to be the one who reaches Fensalir first.'),
        N(
          'They tell Frigg. She doesn’t weep again; she sits down on the step, and Fulla sits beside her.',
        ),
        FR('One. Out of everything.', 'sad'),
        N('Your Nubbin keeps looking back at the cliff the whole way home.'),
        N(
          'People believe the giantess in the cave was Loki, in another shape. That is how the old book tells it.',
        ),
      ],
      [
        notice(
          4,
          'social-studies',
          'D2.His.2.3-5',
          'one telling: how old stories change',
          [
            N(
              'Snorri says people believed the giantess was Loki in another shape. He is passing on what others said, not claiming to know.',
            ),
            N(
              'Stories like this were told aloud for generations before they were written down, and tellers did not always agree. That is why this page is one telling, not the only one.',
            ),
          ],
          'Learned that old stories were passed on by word of mouth, and tellers varied.',
        ),
      ],
    ),
  ],
  [],
);

// ================================================================== A20-13 The Salmon
const Q13 = quest(
  'a20-13',
  'The Salmon',
  {
    'a20-13-s1': {
      goal: 'Climb with the gods to the house with four doors.',
      hint: 'Follow the gods up the mountain path; the house is near the top.',
    },
    'a20-13-s2': {
      goal: 'Help the gods work out what was burned, and make one like it.',
      hint: 'Look closely at the ash by the hearth, then hold the cord while the gods knot.',
    },
    'a20-13-s3': {
      goal: 'Hold the net across Franang’s Falls.',
      hint: 'Take the bank end of the net and keep it low as the gods walk it down the river.',
    },
  },
  [
    sc(
      'a20-13-house',
      [
        N(
          'The gods know now whose hand was at Hödr’s elbow: Loki’s. He is one of them, clever, and able to wear any shape he likes.',
        ),
        N('Now he has run.'),
        N(
          'They hunt for him a long time. In the end they find a house high on a mountain, with a door in every wall.',
        ),
        TH('Four doors. So he could watch every way at once.', 'angry'),
        N(
          'The house is empty, and the fire is still warm. Beside it lies a little heap of grey ash, in a shape like knots.',
        ),
        OD('He was making something. And he burned it when he saw us on the path.', 'think'),
        N(
          'Below the mountain a waterfall comes down white into a deep pool. Your Nubbin goes to the door to look at it.',
        ),
      ],
      [
        ask(
          3,
          'science',
          '5-ESS1-2',
          'the Sun rises in the east',
          [
            N(
              'The house has a door in each of its four walls, so Loki could watch every way at once.',
            ),
            N(
              'If the four doors face north, east, south and west, which door faces the rising Sun?',
            ),
          ],
          [
            opt(
              'The east door',
              [N('Yes. The Sun rises in the east, so the east door catches the first light.')],
              true,
            ),
            opt('The west door', [N('The Sun sets in the west. The east door faces the sunrise.')]),
            opt('The north door', [
              N('The north door faces away from the Sun’s path. The east door faces the sunrise.'),
            ]),
          ],
          'Used compass directions: the Sun rises in the east.',
        ),
      ],
    ),
    sc(
      'a20-13-ash',
      [
        N(
          'The wisest of the gods, Kvasir, kneels by the hearth and looks at the ash a long time without touching it.',
        ),
        N(
          'It is the shape of a net, and nobody has ever made a net before. Loki made the first one, and then he burned it.',
        ),
        OD(
          'Then he is in the water. He knew we would make one too, sooner or later. So we shall.',
          'think',
        ),
        N(
          'The gods sit down and make a net by the shape of the ash. It is slow work, and your Nubbin keeps getting knotted into it.',
        ),
        TH('Hold still, small one. You’re not the fish.', 'happy'),
        N(
          'It is the first time anyone has smiled since the Thing-field. It doesn’t last, but it happens.',
        ),
        N('The ash shows a net ten knots across and six knots down, like a grid.'),
      ],
      [
        ask(
          6,
          'maths',
          '3.OA.A.3',
          'arrays: knots in a net',
          [
            N('The net is 10 knots across and 6 knots down.'),
            N('How many knots must the gods tie in all?'),
          ],
          [
            opt(
              '60',
              [N('Yes: 10 across × 6 down = 60 knots. That is why it was slow work.')],
              true,
            ),
            opt('16', [N('16 is 10 + 6. A grid has rows of knots, so we multiply: 10 × 6 = 60.')]),
            opt('100', [N('100 would be 10 × 10. With 6 rows, it is 10 × 6 = 60.')]),
          ],
          'Used multiplication for a grid: 10 × 6 = 60.',
        ),
      ],
      {
        choices: [
          {
            id: 'cord',
            label: 'Hold the cord steady.',
            then: [
              N('You hold it steady through every knot. Kvasir nods to you once, when it is done.'),
            ],
          },
          {
            id: 'knot',
            label: 'Tie some of the knots yourself.',
            then: [
              N(
                'You tie a row of knots. Thor checks every one and doesn’t undo any of them, which is praise.',
              ),
            ],
          },
          {
            id: 'untangle',
            label: 'Untangle your Nubbin first.',
            then: [
              N(
                'You untangle your Nubbin. It sits on the bench and watches the rest with great interest and both arms folded.',
              ),
            ],
          },
        ],
      },
    ),
    sc(
      'a20-13-falls',
      [
        N(
          'The waterfall is Franang’s Falls. In the pool under it, by day, a salmon lies very still, and it is Loki.',
        ),
        N(
          'Thor wades into the middle of the river with the net. You take one end on the bank, and the gods take the other.',
        ),
        N(
          'You drag it down the river. The salmon slips over the top of the net and is away towards the sea.',
        ),
        N('Again. This time the salmon must choose: the open sea, or a leap back over the net.'),
        N('It leaps. Thor grabs at it in mid-air, and catches it by the tail.'),
        N(
          'It slides through his hand, and his hand closes, and holds. That, the old book says, is why the salmon tapers at the tail.',
        ),
      ],
      [
        ask(
          5,
          'science',
          '3-LS1-1',
          'the salmon life cycle',
          [
            N(
              'The salmon in Franang’s Falls leaps back over the net instead of swimming out to sea.',
            ),
            N('Real salmon also leap up waterfalls. Why do they swim upstream?'),
          ],
          [
            opt(
              'To reach the river where they were born, and lay their eggs',
              [
                N(
                  'Yes. Salmon are born in rivers, live in the sea, and return to their birth river to lay eggs.',
                ),
              ],
              true,
            ),
            opt('To escape from the sea', [
              N('The sea is their feeding home. They go upstream to breed.'),
            ]),
            opt('For fun', [
              N('Leaping is hard work. They do it to reach the place where they can lay eggs.'),
            ]),
          ],
          'Learned part of the salmon life cycle: they swim upstream to breed.',
        ),
      ],
    ),
    sc(
      'a20-13-falls-done',
      [
        N(
          'In Thor’s hand the salmon is a man again, soaked and still. He doesn’t struggle, and he doesn’t say anything at all.',
        ),
      ],
      [
        ask(
          0,
          'sel',
          'CASEL: Responsible decision-making',
          'sorry, or only caught? (a think question)',
          [
            N(
              'In Thor’s hand the salmon is a man again, soaked and still. He does not struggle, and he does not say anything at all.',
            ),
            N('Is Loki sorry, or just beaten? How could we tell?'),
          ],
          [
            opt('We can only tell by what he does next', [
              N('A sound answer. Being sorry shows in what a person does afterwards.'),
            ]),
            opt('Silence could mean either', [
              N('A fair point. A quiet person may be sorry, or may be planning.'),
            ]),
            opt('Being sorry means putting things right', [
              N('A strong answer. Saying sorry matters most when it is followed by repair.'),
            ]),
          ],
          'Reflected on telling real sorrow from being caught (no single right answer).',
        ),
      ],
    ),
    sc(
      'a20-13-complete',
      [
        N('The gods take Loki away with them, down the mountain. Nobody speaks.'),
        N(
          'Your Nubbin stands on the bank looking at the falls. Then it looks at you, as if there is a question it can’t find the shape of.',
        ),
        OD('Go home to Fensalir, guest. What happens next is ours to do.', 'sad'),
        N(
          'The page turns anyway, the way pages do. There is one more place to go before the snow.',
        ),
      ],
      [
        ask(
          1,
          'literacy',
          'L.4.5',
          'figurative language: a question with no shape',
          [
            N('Your Nubbin looks at you “as if there is a question it can’t find the shape of.”'),
            N('What does that phrase tell us?'),
          ],
          [
            opt(
              'It has a feeling or question it cannot put into words yet',
              [
                N(
                  'Yes. Saying a question has a “shape” treats the thought like something you could hold, and it has not found it yet.',
                ),
              ],
              true,
            ),
            opt('The question is shaped like a circle', [
              N(
                'It is figurative language, not a real shape. It says the Nubbin cannot put the thought into words.',
              ),
            ]),
            opt('The Nubbin wants a drawing lesson', [
              N('It is a picture in words: the question is there, but the right words are not.'),
            ]),
          ],
          'Explained a figure of speech about a feeling with no words yet.',
        ),
      ],
    ),
  ],
  [],
);

// ================================================================== A20-14 The Bowl
const Q14 = quest(
  'a20-14',
  'The Bowl',
  {
    'a20-14-s1': {
      goal: 'Follow the stair down under the earth.',
      hint: 'Take the steep stair at the back of the cave, and keep your Nubbin close.',
    },
    'a20-14-s2': {
      goal: 'Stay with Sigyn by the bowl, as near as you can bear.',
      hint: 'Go nearer to Sigyn and the three stones, or stay where you are.',
    },
    'a20-14-s3': {
      goal: 'See what happens when the bowl is full.',
      hint: 'Stay still; it won’t take long.',
    },
  },
  [
    sc(
      'a20-14-cave',
      [
        N(
          'Under the earth there is a cave, and in the cave three flat stones. Loki is bound across them.',
        ),
        N(
          'The page doesn’t show the binding. It shows only that he cannot move, and that he will not be let go.',
        ),
        N('Above his face a snake hangs from the rock. Its venom gathers, slowly, and drips.'),
        N('A woman kneels beside him, holding a bowl up under the drops. It is Sigyn, his wife.'),
        N('She has been holding it a long time. Her arms are shaking.'),
        N('Your Nubbin stops at the bottom of the stair and holds on to your trouser leg.'),
      ],
      [
        ask(
          4,
          'sel',
          'CASEL: Social awareness',
          'loyalty to someone who did wrong (a think question)',
          [
            N(
              'Sigyn kneels beside Loki, holding the bowl, though he did a wrong thing and she could walk away.',
            ),
            N('Is staying loyal to someone who did wrong a good thing? Why?'),
          ],
          [
            opt('Yes: loyalty means staying when it is hard', [
              N('A warm answer. Sigyn’s loyalty is the thing the story admires in her.'),
            ]),
            opt('Not always: loyalty should not mean excusing harm', [
              N('A careful answer. She holds the bowl, but she does not say he was right.'),
            ]),
            opt('It depends on whether staying helps anyone', [
              N('A practical answer. Her staying does help: for a moment, no drops fall on him.'),
            ]),
          ],
          'Reflected on loyalty to someone who has done wrong (no single right answer).',
        ),
      ],
    ),
    sc(
      'a20-14-bowl',
      [
        N(
          'You go nearer. Sigyn knows who you are: the guest who ran Frigg’s errands, and begged at the cave.',
        ),
        N('She doesn’t look at you. She looks at the bowl, and at nothing else.'),
        SI('You asked so nicely, in the cave. Everybody heard about it.', 'sad'),
        SI('I don’t ask anything of you. Don’t ask anything of me.'),
        N('The bowl fills, drop by drop. Sigyn keeps her eyes on it, and her arms up.'),
        N('Your Nubbin sits down at the edge of the lamplight and doesn’t come any closer.'),
      ],
      [
        ask(
          3,
          'literacy',
          'RL.3.6',
          'point of view: Sigyn’s and yours',
          [
            N(
              'Sigyn says, “You asked so nicely, in the cave. Everybody heard about it.” She does not look at you.',
            ),
            N('You pleaded for Baldr. How might Sigyn see it differently from you?'),
          ],
          [
            opt(
              'She is Loki’s wife, so she may hear your plea as aimed at her family',
              [
                N(
                  'Yes. Your point of view was Baldr’s. Hers is the wife of the one being punished.',
                ),
              ],
              true,
            ),
            opt('She did not hear anything', [
              N('She says everybody heard. She knows exactly what you asked.'),
            ]),
            opt('She agrees with everything you said', [
              N('Her tone says otherwise. She would like to be left alone.'),
            ]),
          ],
          'Compared two points of view in the same scene.',
        ),
      ],
    ),
    sc(
      'a20-14-shake',
      [
        N('The bowl is full. Sigyn has to take it away to empty it.'),
        N(
          'While she is gone, the drops fall on him. He shudders, so hard that the whole earth shakes.',
        ),
        N(
          'Far above, people feel the ground move and call it an earthquake. In this story, now you know why.',
        ),
        N('Then Sigyn is back with the bowl, and the drops fall into it, and the shaking stops.'),
        N(
          'The old book says he lies like this until the end of things. And she kneels there with him, all that time.',
        ),
        N('Your Nubbin is holding on to you with both arms.'),
      ],
      [
        ask(
          2,
          'science',
          '4-ESS2-2',
          'plate boundaries and earthquakes in Iceland',
          [
            N(
              'In the story, the earth shakes when Loki shudders. In real life, Iceland has many earthquakes.',
            ),
            N(
              'Iceland sits where two huge tectonic plates of Earth’s crust are slowly pulling apart, about 2 centimetres a year. What happens when they slip?',
            ),
          ],
          [
            opt(
              'The ground shakes: an earthquake',
              [N('Yes. When the plates slip suddenly, energy is released as shaking.')],
              true,
            ),
            opt('The sea turns to ice', [
              N('Moving plates make shaking and sometimes volcanoes, not ice.'),
            ]),
            opt('The Sun gets brighter', [
              N('The Sun has nothing to do with it. This happens deep in the Earth.'),
            ]),
          ],
          'Learned that earthquakes happen where tectonic plates slip, as in Iceland.',
        ),
      ],
      {
        choices: [
          {
            id: 'hold',
            label: 'Hold your Nubbin close.',
            then: [
              N(
                'You hold it close. It is shaking too, a little, like the earth, and then it isn’t.',
              ),
            ],
          },
          {
            id: 'stay',
            label: 'Stay a while longer, for Sigyn.',
            then: [
              N(
                'You stay, and Sigyn doesn’t look round. But when you go, she lifts one hand off the bowl, just for a moment.',
              ),
            ],
          },
          {
            id: 'go',
            label: 'Go back up the stair.',
            then: [
              N(
                'You go up the stair into the cold air. Behind you the earth is quiet again, for now.',
              ),
            ],
          },
        ],
      },
    ),
    sc(
      'a20-14-complete',
      [
        N(
          'You climb up out of the earth into a grey evening. The wind has changed, and it smells of snow.',
        ),
        N('The page turns under your hand. On the other side it is white from edge to edge.'),
        N('There is no road on this side. There is only the plain.'),
        N('Your Nubbin pulls your cloak round both of you, and you step out onto the snow.'),
      ],
      [
        notice(
          1,
          'social-studies',
          'D2.Geo.2.3-5',
          'Iceland: fire and ice',
          [
            N(
              'Iceland is sometimes called the land of fire and ice. Glaciers and active volcanoes lie close together on the same island.',
            ),
            N(
              'The glaciers are there because it is so far north. The volcanoes are there because hot rock rises in the gap between the plates.',
            ),
          ],
          'Learned that Iceland has glaciers and volcanoes side by side.',
        ),
      ],
    ),
  ],
  [
    {
      word: 'tectonic plates',
      meaning: 'The huge slabs of rock that make up Earth’s outer shell.',
      scene: 'a20-14-shake',
    },
  ],
);

// ================================================================== A20-15 The Fimbulwinter
const Q15 = quest(
  'a20-15',
  'The Fimbulwinter',
  {
    'a20-15-s1': {
      goal: 'Cross the long white plain.',
      hint: 'Keep the wind at your back and walk towards the dark line of trees.',
    },
    'a20-15-s2': {
      goal: 'Find the two who are hiding in the wood.',
      hint: 'Walk in under the trees and look for where the snow is trodden.',
    },
    'a20-15-s3': {
      goal: 'Keep Líf and Lífthrasir company through the winter.',
      hint: 'Sit in the hollow with them; there is nowhere else you need to be.',
    },
  },
  [
    sc(
      'a20-15-plain',
      [
        N('Now comes the great winter. The old book calls it the Fimbulwinter.'),
        N(
          'Snow drives in from every side. The frost bites hard, the wind cuts, and the sun hangs pale and gives no heat.',
        ),
        N(
          'Three winters come one after another, with no summer between them. The seasons simply forget to turn.',
        ),
        N(
          'You walk with your head down. Your Nubbin rides inside your cloak, tucked up against your chest.',
        ),
        N(
          'You think of your own valley, and a winter there that would not end. It ended in the end, and so will this one.',
        ),
        N('Ahead, through the white, there is a dark line of trees.'),
      ],
      [
        ask(
          1,
          'science',
          '5-ESS1-2',
          'Earth’s tilt and short winter days',
          [
            N(
              'The sun hangs pale, and the days are short. In real life, northern winters are dark because Earth is tilted.',
            ),
            N(
              'Around 21 December, the winter solstice, Reykjavík gets only about four hours of daylight. Why are northern winter days so short?',
            ),
          ],
          [
            opt(
              'In winter the north leans away from the Sun',
              [N('Yes. Earth’s tilt means the north gets less direct sunlight in winter.')],
              true,
            ),
            opt('The Sun moves further away from Earth in winter', [
              N(
                'Earth is actually a little closer to the Sun in January. It is the tilt that matters.',
              ),
            ]),
            opt('The Sun gets tired in winter', [
              N(
                'The Sun shines the same. It is Earth’s tilt that changes how much light reaches the north.',
              ),
            ]),
          ],
          'Learned that Earth’s tilt makes winter days short in the far north.',
        ),
      ],
    ),
    sc(
      'a20-15-holt',
      [
        N(
          'The wood is called Hoddmímir’s Holt. Under its trees the snow is thinner, and the wind can’t find you.',
        ),
        N(
          'Two people are sitting in a hollow under the roots of a great tree, wrapped in one blanket: a woman and a man.',
        ),
        LI('Oh. Someone. I thought there was nobody left who could walk.', 'shock'),
        LT(
          'We’re Líf and Lífthrasir. We hide here. We live on the dew, every morning, off the leaves.',
        ),
        LI('It isn’t much. But it’s enough, if you don’t want very much.', 'soft'),
        N(
          'Your Nubbin climbs out of your cloak and goes straight to them. It sits down between them, under the blanket.',
        ),
        LT('It’s warm. Can it stay?'),
      ],
      [
        ask(
          4,
          'sel',
          'CASEL: Self-management',
          'contentment: enough, if you do not want much (a think question)',
          [
            N('Líf says it is not much, “but it’s enough, if you don’t want very much.”'),
            N('Can wanting less ever make us safer or happier? When is it not true?'),
          ],
          [
            opt('Yes: when what we need is small, wanting less is a comfort', [
              N('A fair answer. Líf and Lífthrasir have learned to be glad of enough.'),
            ]),
            opt('Not always: some needs, like warmth, cannot be wanted away', [
              N('A careful answer. Wanting less helps, but cold is still cold.'),
            ]),
            opt('It helps for wants, but not for needs', [
              N('A helpful distinction. A want can shrink. A real need cannot.'),
            ]),
          ],
          'Reflected on wants and needs when there is little (no single right answer).',
        ),
      ],
    ),
    sc(
      'a20-15-company',
      [
        N(
          'So you stay in the holt, through the snow. Every morning the four of you lick the dew off the leaves, and it tastes of nothing.',
        ),
        N(
          'Every night you sit close, under one blanket and your cloak, and the winter goes on outside the trees.',
        ),
        N(
          'Your Nubbin shares itself out: a night by Líf, a night by Lífthrasir, a night in your lap.',
        ),
        LI('You’ve licked my leaf.'),
        LT('There’s dew on all of them.'),
        LI('That one was mine. I was saving it for Tuesday.'),
        LT(
          'There aren’t any Tuesdays now. We stopped naming the days. There didn’t seem any point.',
          'soft',
        ),
        N('Outside, the third winter starts without the second one having ended.'),
        LI('Tell us something. Anything that isn’t snow.'),
      ],
      [
        ask(
          0,
          'science',
          '',
          'what dew is',
          [
            N(
              'Every morning you lick dew off the leaves. Dew is tiny drops of water on leaves and grass.',
            ),
            N('Where does the water in dew come from?'),
          ],
          [
            opt(
              'Water vapour in the air turns into drops on cool surfaces',
              [N('Yes. That is condensation again, outdoors, overnight.')],
              true,
            ),
            opt('It falls as very light rain', [
              N('Dew forms on a clear night without rain. It comes from vapour in the air.'),
            ]),
            opt('The leaves make water from nothing', [
              N('Nothing makes water from nothing. The water was in the air as vapour.'),
            ]),
          ],
          'Learned that dew is water vapour from the air condensing on cool surfaces.',
        ),
        notice(
          6,
          'social-studies',
          'D2.His.2.3-5',
          'weekday names from Norse gods',
          [
            N('Names for the days are older than they seem.'),
            N('Four English weekdays are named for gods the early English shared with the Norse.'),
            N(
              'Tuesday is for Tiw (Týr), Wednesday for Woden (Odin), Thursday for Thor, and Friday for Frige (Frigg).',
            ),
            N('So every Thursday you say, without thinking about it, “Thor’s day.”'),
          ],
          'Learned that four English weekday names come from the gods the Norse also knew.',
        ),
      ],
      {
        choices: [
          {
            id: 'valley',
            label: 'Tell them about your valley.',
            then: [
              Y('There’s a pond, and a gate that sticks. You have to lift it and push.'),
              LT('A gate that sticks. That sounds like a good place to live.', 'happy'),
            ],
          },
          {
            id: 'hall',
            label: 'Tell them about the bright hall on the rise.',
            then: [
              N(
                'You tell them about Breidablik, and the light coming off him, and your Nubbin asleep on the boards.',
              ),
              LI('Then there was a light once. Good. I hoped there was.', 'soft'),
            ],
          },
          {
            id: 'close',
            label: 'Say nothing. Just sit close.',
            then: [
              N(
                'You sit close and say nothing. After a while Lífthrasir puts his head on your shoulder, and sleeps.',
              ),
            ],
          },
        ],
      },
    ),
    sc(
      'a20-15-company-done',
      [
        LI('You stayed. Nobody stays anywhere any more. Everybody’s running somewhere.', 'soft'),
        LT('Three winters now, and each one six months long. I still count the months. I can’t help it.'),
      ],
      [
        ask(
          1,
          'maths',
          '3.OA.A.3',
          'multiplication: 3 winters × 6 months',
          [
            N('Lífthrasir counts three winters, each one six months long.'),
            N('How many months of winter is that in all?'),
          ],
          [
            opt('18 months', [N('Yes. 3 × 6 = 18 months of winter, a year and a half.')], true),
            opt('9 months', [N('9 is 3 + 6. Three winters of six months each is 3 × 6 = 18.')]),
            opt('12 months', [
              N('12 would be two winters of six months. Three winters make 3 × 6 = 18.'),
            ]),
          ],
          'Multiplied equal groups: 3 × 6 months is 18 months.',
        ),
      ],
    ),
    sc(
      'a20-15-complete',
      [
        N(
          'One morning the dew tastes different: not warmer, just different, as if something far off had changed its mind.',
        ),
        LT('Something’s coming. I can feel it in the roots.', 'think'),
        LI('Not here, though. It won’t come here. Will it?'),
        N('Your Nubbin climbs the tree roots to the edge of the holt, and looks out.'),
      ],
      [
        ask(
          2,
          'sel',
          'CASEL: Self-management',
          'worry about what is coming (a think question)',
          [
            N(
              'Lífthrasir can feel something coming through the roots, and Líf hopes it will not come here.',
            ),
            N('What helps when we are afraid of something coming that we cannot see or stop?'),
          ],
          [
            opt('Staying close to people, and taking one hour at a time', [
              N(
                'A steady answer. Fear is lighter shared, and smaller when we look at only the next hour.',
              ),
            ]),
            opt('Finding out what we can, then letting go of the rest', [
              N('A wise answer. Some things we can learn, and some we can only wait through.'),
            ]),
            opt('Doing something with our hands to keep busy', [
              N(
                'A practical answer. Busy hands can steady a worried mind, the way Frigg turned her spindle while she thought.',
              ),
            ]),
          ],
          'Reflected on how to cope with fear of something we cannot control (no single right answer).',
        ),
      ],
    ),
  ],
  [
    {
      word: 'solstice',
      meaning:
        'One of the two days a year when the Sun is furthest north or south, giving the longest or shortest day.',
      scene: 'a20-15-plain',
    },
    {
      word: 'flicker',
      meaning: 'To shine unsteadily, brightening and dimming.',
      scene: 'a20-15-ember-remembered',
    },
  ],
);

// ================================================================== A20-16 The Twilight
const Q16 = quest(
  'a20-16',
  'The Twilight',
  {
    'a20-16-s1': {
      goal: 'Look out from the edge of the holt.',
      hint: 'Climb the roots at the wood’s edge, where your Nubbin is.',
    },
    'a20-16-s2': {
      goal: 'Wait at the holt’s edge until it is over.',
      hint: 'Stay with Líf and Lífthrasir; nothing will reach the trees.',
    },
  },
  [
    sc(
      'a20-16-edge',
      [
        N(
          'From the edge of the holt you can see a long way: the white plain, the grey sea beyond it, and the sky.',
        ),
        N(
          'Something is happening at the end of the world. It is very far off, and you see it the way you see weather on the hills.',
        ),
        N(
          'Wolves are running across the sky, after the sun and after the moon. They are small with distance, and fast.',
        ),
        N('A ship is coming over the sea. It is huge and dark, and very slow.'),
        N(
          'There is a figure in its bow. It stands looking ahead at the land, and never turns round.',
        ),
        N(
          'On the far edge of the world there is a line of fire, low down, like a sunset in the wrong place.',
        ),
        N(
          'None of it comes near. The holt is very quiet, and your Nubbin is holding on to a root with both arms.',
        ),
      ],
      [
        ask(
          1,
          'literacy',
          'L.4.5',
          'simile: weather on the hills',
          [
            N('The writer says you see it “the way you see weather on the hills.”'),
            N(
              'That is a simile, made with “the way” instead of “like”. What does it help us feel?',
            ),
          ],
          [
            opt(
              'That it is huge, but distant, and cannot reach the holt',
              [N('Yes. We watch distant weather and know it is not on top of us.')],
              true,
            ),
            opt('That it is a small rain shower', [
              N('The comparison is about distance, not size. The event is vast, but far away.'),
            ]),
            opt('That it will soon arrive', [
              N('A storm on far hills may never come near. The simile lets us watch from safety.'),
            ]),
          ],
          'Explained what a simile adds: the event is huge but far away.',
        ),
      ],
    ),
    sc(
      'a20-16-wait',
      [
        N(
          'Líf and Lífthrasir come up beside you. They don’t look out; they look at you, to see how bad it is.',
        ),
        LI('Tell us. Is it coming here?'),
        N(
          'You watch the fire, and the running wolves, and the sky. None of it comes towards the trees.',
        ),
        Y('No. Not here.'),
        LT('Then we’ll wait. We’re good at waiting.', 'soft'),
        N('The light changes. The noise far off gets less, and less, and is gone.'),
      ],
      [
        ask(
          3,
          'sel',
          'CASEL: Responsible decision-making',
          'honesty with frightened people (a think question)',
          [
            N('Líf asks if it is coming here, and you say, “No. Not here.”'),
            N(
              'If you had not been sure, would it be kinder to say something comforting, or to be honestly uncertain?',
            ),
          ],
          [
            opt('Say something comforting', [
              N('A kind instinct. But a comfort that turns out false can break trust later.'),
            ]),
            opt('Be honestly uncertain, and stay with them', [
              N('A brave answer. It is true, and you are still beside them.'),
            ]),
            opt('Say what you can see, and be clear about what you cannot', [
              N('A balanced answer. You told them what you saw, which is what you honestly knew.'),
            ]),
          ],
          'Reflected on being honest with someone who is frightened (no single right answer).',
        ),
      ],
      {
        choices: [
          {
            id: 'hand',
            label: 'Hold Líf’s hand.',
            then: [N('You hold Líf’s hand. Her fingers are cold, and then they aren’t.')],
          },
          {
            id: 'tuck',
            label: 'Tuck your Nubbin inside your cloak.',
            then: [
              N(
                'You tuck your Nubbin inside your cloak. It puts one eye out, to keep watch with you.',
              ),
            ],
          },
          {
            id: 'watch',
            label: 'Keep watching, so that someone does.',
            then: [
              N(
                'You keep watching. It is a hard thing to see, even far off, and someone should, so that it isn’t only told.',
              ),
            ],
          },
        ],
      },
    ),
    sc(
      'a20-16-complete',
      [
        N(
          'Then it is quiet. Not the quiet of the snow: a new quiet, like a room after everybody has gone home.',
        ),
        N('The snow stops. Nobody notices for a while, because it has been snowing for so long.'),
        LI('Is it over?'),
        N(
          'Your Nubbin sniffs the air, and sneezes. The air smells of salt, and of something green.',
        ),
      ],
      [
        ask(
          0,
          'science',
          '4-PS3-2',
          'fresh snow absorbs sound',
          [
            N(
              'The writer says the quiet is “not the quiet of the snow.” Fresh snow really does make the world seem hushed.',
            ),
            N('Why does a fresh fall of snow muffle sound?'),
          ],
          [
            opt(
              'Its tiny air pockets soak up sound instead of bouncing it back',
              [N('Yes. Fresh snow is full of trapped air, which swallows sound waves.')],
              true,
            ),
            opt('Snow makes sound travel faster', [
              N('Snow does not speed sound up. It soaks it up.'),
            ]),
            opt('Cold air cannot carry any sound', [
              N('Cold air carries sound well. It is the soft snow that muffles it.'),
            ]),
          ],
          'Learned that fresh snow absorbs sound.',
        ),
      ],
    ),
  ],
  [],
);

// ================================================================== A20-17 The Green Earth
const Q17 = quest(
  'a20-17',
  'The Green Earth',
  {
    'a20-17-s1': {
      goal: 'Walk out of the holt into the new land.',
      hint: 'Follow Líf and Lífthrasir out from under the trees.',
    },
    'a20-17-s2': {
      goal: 'Go to the old ground where the gods’ halls stood.',
      hint: 'Walk across the fields to the plain where grass grows over old stones.',
    },
    'a20-17-s3': {
      goal: 'Look in the grass for what the gods once played with.',
      hint: 'Search the long grass round the old stones.',
    },
  },
  [
    sc(
      'a20-17-green',
      [
        N(
          'The sea goes down. Out of it the land comes up again, wet and new, and green as a first leaf.',
        ),
        N('There are fields on it already. Corn is growing in them, and nobody sowed it.'),
        N(
          'Líf and Lífthrasir walk out from under the trees, slowly, holding on to each other. Then faster.',
        ),
        LI('Grass. Feel it. It’s grass.', 'happy'),
        LT('And the sun. Look. It’s warm. It’s warm again.', 'happy'),
        N(
          'The sun had a daughter before the end, the old book says. Now she rides her mother’s road, just as bright.',
        ),
        N(
          'Your Nubbin runs out into the middle of a field and lies down flat in the sun, arms and legs out.',
        ),
      ],
      [
        ask(
          1,
          'maths',
          '3.MD.C.7',
          'area of a rectangle',
          [
            N(
              'Fields of corn are growing on the new land. Say one field is 40 metres long and 25 metres wide.',
            ),
            N('What is its area?'),
          ],
          [
            opt(
              '1000 square metres',
              [N('Yes. Area is length × width: 40 × 25 = 1000 square metres.')],
              true,
            ),
            opt('65 square metres', [
              N('65 is 40 + 25. Area is found by multiplying, not adding.'),
            ]),
            opt('130 square metres', [
              N('130 is the distance round the edge (the perimeter). Area is 40 × 25 = 1000.'),
            ]),
          ],
          'Found the area of a rectangle: 40 × 25 = 1000 square metres.',
        ),
        ask(
          4,
          'science',
          '4-LS1-1',
          'plants need water and light',
          [
            N('Líf says the sun is warm again. Plants need sunlight and water to grow.'),
            N('Which part of a plant mainly catches the sunlight?'),
          ],
          [
            opt(
              'The leaves',
              [
                N(
                  'Yes. Leaves catch sunlight and use it, with water and air, to make food for the plant.',
                ),
              ],
              true,
            ),
            opt('The roots', [
              N('Roots drink water and hold the plant in place. Leaves catch the light.'),
            ]),
            opt('The seeds', [N('Seeds grow into new plants. The leaves catch sunlight.')]),
          ],
          'Learned that leaves catch the sunlight a plant needs.',
        ),
      ],
    ),
    sc(
      'a20-17-old-ground',
      [
        N(
          'Where the gods’ halls stood there is a plain of grass, with old stones showing through it here and there.',
        ),
        N(
          'People are gathering there: the gods’ sons, who came through the end of things, Vídarr and Váli, Módi and Magni.',
        ),
        N(
          'Módi and Magni have their father’s hammer between them. They carry it gently, like something asleep.',
        ),
        VI(
          'Guest. You came through as well. Sit with us. There’s a great deal to talk about, and all the time in the world.',
          'soft',
        ),
        N(
          'Then two more come walking up out of the ground, by the road that goes down. They come from Hel.',
        ),
        N('Baldr comes, and Hödr with him.'),
        N('Baldr’s light is just as it was. Your Nubbin is up and running before you can stand.'),
      ],
      [
        ask(
          0,
          'social-studies',
          'D2.His.2.3-5',
          'ruins and what they show',
          [
            N(
              'Where the gods’ halls stood there is a plain of grass, with old stones showing here and there.',
            ),
            N('How can archaeologists tell what stood at a place like this long ago?'),
          ],
          [
            opt(
              'They dig carefully, study stones and tools, and compare with written records',
              [
                N(
                  'Yes. Stones, post-holes and tools show where walls and floors were, and records help fill the gaps.',
                ),
              ],
              true,
            ),
            opt('They ask the grass', [
              N('Grass cannot answer. It is the ground beneath it that holds the evidence.'),
            ]),
            opt('They cannot ever find out', [
              N('They find out a great deal by careful digging and by comparing evidence.'),
            ]),
          ],
          'Learned how archaeologists work out what once stood on a site.',
        ),
      ],
    ),
    sc(
      'a20-17-old-ground-done',
      [
        N(
          'Your Nubbin runs straight into Baldr’s light and falls asleep in it, at once, in the grass.',
        ),
        N('It has been trying to get back there all this time.', 'soft'),
      ],
      [
        ask(
          1,
          'literacy',
          'RL.4.2',
          'a recurring image: the Nubbin and the light (a think question)',
          [
            N('All through this page your Nubbin has been trying to get back to Baldr’s light.'),
            N(
              'A thing a story keeps returning to is a motif. What do you think this motif says about the story’s message?',
            ),
          ],
          [
            opt('That kindness is something people are drawn to, and will follow', [
              N('A warm reading. The light is not clever or powerful. It is kind.'),
            ]),
            opt('That we keep looking for the people we have lost', [
              N('A tender reading. The Nubbin never stops turning towards him.'),
            ]),
            opt('That hope can be small and still not go out', [
              N('A hopeful reading. The light was low, but it was his.'),
            ]),
          ],
          'Offered readings of a repeated image in the story (no single right answer).',
        ),
      ],
    ),
    sc(
      'a20-17-pieces',
      [
        N(
          'The brothers sit down on the grass, and the others sit round them, and they talk about old things.',
        ),
        BA('Do you remember the Thing-field? The arrow that went round me?', 'happy'),
        HO('I remember the guest telling it. Better than you did, as well.', 'happy'),
        N(
          'In the long grass by the old stones, your hand closes on something small and cold. You pull it out.',
        ),
        N(
          'It is a game piece, made of gold. There are more of them in the grass: the pieces the gods played with in the old days.',
        ),
        VI('They were ours, before. Now they’re anybody’s.', 'soft'),
        N(
          'You find eighteen in all, and lay them out on the grass in six neat rows.',
        ),
      ],
      [
        ask(
          6,
          'maths',
          '3.OA.A.3',
          'division: sharing 18 between 6',
          [
            N('You lay 18 pieces out in 6 equal rows.'),
            N('How many pieces are in each row?'),
          ],
          [
            opt('3', [N('Yes. 18 ÷ 6 = 3, so each row has three pieces.')], true),
            opt('12', [N('12 is 18 − 6. Sharing equally into 6 rows is division: 18 ÷ 6 = 3.')]),
            opt('24', [N('24 is 18 + 6. We are sharing out, so we divide: 18 ÷ 6 = 3.')]),
          ],
          'Solved a sharing problem: 18 ÷ 6 = 3.',
        ),
      ],
      {
        choices: [
          {
            id: 'baldr',
            label: 'Give the first piece to Baldr.',
            then: [
              BA('Ha. I always lost with this one. Every single time.', 'happy'),
              HO('He did. He shouted about it every time.', 'happy'),
            ],
          },
          {
            id: 'hodr',
            label: 'Give the first piece to Hödr.',
            then: [
              N('Hödr turns it over in his fingers, feeling the shape of it.'),
              HO('A little horse. I know this one. I always wanted to be the horse.', 'happy'),
            ],
          },
          {
            id: 'between',
            label: 'Set it on the grass between them.',
            then: [
              N(
                'You set it on the grass between the two brothers. They both reach for it at once, and both laugh.',
              ),
            ],
          },
        ],
      },
    ),
    sc(
      'a20-17-complete',
      [
        N(
          'The sun goes over the new land. The talk goes on, slow and easy, as if there will always be more of it.',
        ),
        N(
          'Hödr turns his face towards you. You find you are sitting beside him, closer than anyone.',
        ),
        HO(
          'You rode down to fetch my brother home, and you begged for him in the cave. I heard about that.',
          'soft',
        ),
        HO('Thank you for trying.', 'soft'),
        N(
          'Before you go, Baldr puts something in your hand: a sprig with two leaves, from a tree at the edge of the old ground.',
        ),
        BA('It was too young to be asked, once. It’s older now. So am I. Keep it for me.', 'soft'),
        N(
          'Your Nubbin wakes in his light and looks at him for a long moment. Then it gets up and comes back to you, on its own.',
        ),
        N(
          'Líf and Lífthrasir walk out together into the morning, across the fields that nobody sowed.',
        ),
        N(
          'You are back in the Grove, the atlas on your knee. Something clinks in your pocket: a golden game piece, and your Nubbin has brought home a sprig to match.',
        ),
      ],
      [
        ask(
          3,
          'sel',
          'CASEL: Responsible decision-making',
          'does trying count? (a think question)',
          [
            N('Hödr thanks you for trying, though you could not bring Baldr home.'),
            N('Does trying count when it does not change the ending?'),
          ],
          [
            opt('Yes: trying shows we care, whatever happens', [
              N(
                'A warm answer. Effort and care are real even when the result is out of our hands.',
              ),
            ]),
            opt('Only a little: the result matters most', [
              N(
                'A fair view. Results matter. But the people you tried for may value the trying too.',
              ),
            ]),
            opt('It depends on whether the trying was honest', [
              N('A thoughtful answer. Honest effort counts more than showing off.'),
            ]),
          ],
          'Reflected on whether effort counts when it does not change the outcome (no single right answer).',
        ),
        ask(
          8,
          'literacy',
          'RL.4.2',
          'theme of the whole page',
          [
            N('The page opened with promises, and ends with a sprig kept for Baldr.'),
            N('Which theme fits the page best?'),
          ],
          [
            opt(
              'Love shows in staying with people when things are hard',
              [N('Yes. Frigg’s asking, Hödr’s company and the sprig all say it.')],
              true,
            ),
            opt('Gods always win in the end', [
              N('The gods lose Baldr, and the page does not say they win everything.'),
            ]),
            opt('Nothing can ever be mended', [
              N('The page ends green and hopeful, so that does not fit.'),
            ]),
          ],
          'Chose the theme of the whole page.',
        ),
      ],
    ),
  ],
  [
    {
      word: 'archaeologist',
      meaning:
        'Someone who learns about the past by carefully digging up and studying what people left behind.',
      scene: 'a20-17-old-ground',
    },
    {
      word: 'motif',
      meaning: 'An image or idea a story keeps coming back to.',
      scene: 'a20-17-old-ground-done',
    },
  ],
);

/** Reader versions of every quest on the Weeping page, A20-1 to A20-17. */
export const EDU_A20_READER: EduQuest[] = [
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
  Q15,
  Q16,
  Q17,
];

/** Reader versions of every flag-chosen variant scene in ATLAS_A20_VARIANTS. */
export const EDU_A20_READER_VARIANTS: EduScene[] = [
  sc(
    'a20-01-ember',
    [
      N(
        'Your Nubbin is carrying its little lantern, as it does everywhere now. Inside it, the red pebble from the high pass glows.',
      ),
      FU('A lamp with no flame. It’s warm, though. My hands are warm just being near it.', 'think'),
      FR(
        'Somebody gave that away who had very little left to give. Keep it close, little one.',
        'soft',
      ),
    ],
    [
      ask(
        2,
        'sel',
        'CASEL: Social awareness',
        'why someone might give away almost the last thing they have (a think question)',
        [
          N('Frigg says someone gave that away who had very little left to give.'),
          N('Why might a person give away almost the last thing they have?'),
        ],
        [
          opt('Because they cared more about someone else than about keeping it', [
            N('A generous answer. Giving can say “you matter more to me than this.”'),
          ]),
          opt('Because they wanted to be rid of it', [
            N(
              'Possible. But Frigg says they had little left to give, which sounds more like love than clearing out.',
            ),
          ]),
          opt('Because they hoped it would help someone who needed it', [
            N(
              'A good reason. A small gift from someone with little can mean more than a big gift from someone with plenty.',
            ),
          ]),
        ],
        'Thought about why someone might give away a precious thing (no single right answer).',
      ),
    ],
  ),
  sc(
    'a20-11-ember',
    [
      N(
        'Your Nubbin holds its little lantern up close to a stone that is slow to weep. The red pebble inside glows.',
      ),
      N(
        'The frost on that stone runs at once, faster than any of the others, as if it had only been waiting to be asked kindly.',
      ),
      N('The other stones each took about thirty minutes to weep. This one takes a third of that.'),
      MS('What’s that you carry?', 'think'),
      Y('Something warm. From a long way off.'),
    ],
    [
      ask(
        2,
        'maths',
        '3.NF.A.1',
        'unit fractions of time',
        [
          N(
            'The other stones took about 30 minutes. The stone beside the ember took one third (1/3) of that time.',
          ),
          N('How many minutes did it take?'),
        ],
        [
          opt('10 minutes', [N('Yes. One third of 30 is 30 ÷ 3 = 10 minutes.')], true),
          opt('3 minutes', [N('3 is one tenth of 30. A third of 30 is 30 ÷ 3 = 10.')]),
          opt('27 minutes', [
            N('27 is 30 − 3. A third of 30 means splitting into three equal parts: 10 each.'),
          ]),
        ],
        'Found a unit fraction of an amount: one third of 30 minutes is 10.',
      ),
    ],
  ),
  sc(
    'a20-12-kept',
    [
      N('Thökk’s eyes go to your pocket, where the stone sits, and stay there.'),
      TK('You understand.', 'think'),
      TK('Keep what you have.'),
      N('Your hand goes to your pocket. The stone is cold through the cloth, as it always is.'),
    ],
    [
      ask(
        2,
        'literacy',
        'RL.3.3',
        'inference: what Thökk means',
        [
          N(
            'Thökk looks at the stone in your pocket and says, “You understand. Keep what you have.”',
          ),
          N('What does she seem to mean?'),
        ],
        [
          opt('She sees you also hold tight to something for safety', [
            N('A fair reading. She thinks you share her wish to keep what is yours.'),
          ]),
          opt('She is warning you that holding on can cost you', [
            N(
              'A thoughtful reading. Her tone is dry, so it may be a warning as much as a welcome.',
            ),
          ]),
          opt('She is trying to get you on her side', [
            N('Possible. Notice how she is pleased to find someone who “understands.”'),
          ]),
        ],
        'Made an inference about what a character means (no single right answer).',
      ),
    ],
  ),
  sc(
    'a20-margin-hazel',
    [
      N(
        'Nova’s atlas lies open at the cave in the cliff, and the giantess with her arms round her knees.',
      ),
      N(
        'Beside the cave, in faint pencil you have never noticed, there is a note in the margin. You know the hand.',
      ),
      N('“Everything wept but one. Don’t hate her for it.”'),
      N('“Feel sorry for her.”', 'soft'),
      N('And under it, one letter: H.'),
      N(
        'Your Nubbin puts one paw on the drawing of the cave, gently, the way it would on somebody’s arm.',
      ),
    ],
    [
      ask(
        3,
        'sel',
        'CASEL: Social awareness',
        'pity or hatred (a think question)',
        [
          N('Hazel’s note says: don’t hate her for it, feel sorry for her.'),
          N('Why might pity be more useful than hatred, even towards someone who refused to help?'),
        ],
        [
          opt('Pity lets us see why she is hurting', [
            N('A kind answer. When we see the hurt, we are better placed to understand.'),
          ]),
          opt('Hatred only adds more hurt to the world', [
            N('A clear answer. Hatred gives the hurt somewhere to grow.'),
          ]),
          opt('It is hard: both can be true at once', [
            N('An honest answer. Pity does not mean forgetting what she did.'),
          ]),
        ],
        'Reflected on pity versus hatred (no single right answer).',
      ),
    ],
  ),
  sc(
    'a20-14-bowl-sat',
    [
      N('You go nearer. Sigyn looks up at you for a long moment; she knows who you are.'),
      SI('You’re the one who sat down, in the cave mouth. I know about that.', 'soft'),
      N('Her bowl is nearly full, and her arms are shaking.'),
      SI('Hold this, under the drops. Just while I empty mine.'),
      N(
        'She gives you a second bowl, a little wooden one. You hold it up under the snake, and she goes to empty hers.',
      ),
      N('For a moment, while you hold it, no drops fall on him at all. His face goes quiet.'),
      N('Then Sigyn is back, and takes her place, and holds her bowl up again.'),
      SI('Thank you.', 'soft'),
    ],
    [
      ask(
        1,
        'literacy',
        'RL.3.3',
        'why Sigyn trusts you now',
        [
          N('Sigyn says, “You’re the one who sat down, in the cave mouth. I know about that.”'),
          N('Why do you think she trusts you with her bowl?'),
        ],
        [
          opt(
            'You gave a hard person quiet company, and asked for nothing',
            [N('Yes. Sitting without demands showed her the kind of guest you are.')],
            true,
          ),
          opt('She has nobody else to ask', [
            N('She could ask others. She chooses you because of what you did.'),
          ]),
          opt('She is tired of holding it', [
            N('She is tired, but that does not explain why she picks you. What you did does.'),
          ]),
        ],
        'Used what a character knows about someone to explain her trust.',
      ),
    ],
  ),
  sc(
    'a20-14-bowl-walked',
    [
      N('You stop at the cave mouth, at the bottom of the stair, and go no further.'),
      N(
        'From there you can see the lamp, and the three stones, and Sigyn kneeling with her bowl held up.',
      ),
      N('She doesn’t know you’re there, or doesn’t look. The bowl fills, drop by drop.'),
      N('Your Nubbin sits down beside you on the bottom step. Neither of you goes in.'),
      N('You watch from the cave mouth. It is as near as you can bear to stand.'),
      N('Above you the earth is quiet, and waiting.'),
    ],
    [
      ask(
        1,
        'literacy',
        'RL.3.6',
        'point of view from far away',
        [
          N(
            'From the foot of the stair you can see the lamp, the three stones and Sigyn with her bowl, but you cannot hear her.',
          ),
          N('What do you know about Sigyn from here, and what can you only guess?'),
        ],
        [
          opt(
            'I can see what she is doing, but only guess what she feels',
            [N('Yes. Seeing an action is not the same as knowing a feeling.')],
            true,
          ),
          opt('I know everything she is thinking', [
            N('Nobody can know that from a distance. We can only guess.'),
          ]),
          opt('I know nothing at all', [
            N('You know a good deal: she kneels, she holds the bowl, her arms are tired.'),
          ]),
        ],
        'Told what can be seen from a distance from what can only be guessed.',
      ),
    ],
  ),
  sc(
    'a20-15-ember-forgiven',
    [
      N(
        'Your Nubbin opens its little lantern and sets it in the hollow, between Líf and Lífthrasir. The red pebble glows.',
      ),
      N(
        'It burns steady all winter long, never hot, always warm. The snow draws back from it in a ring.',
      ),
      LI('Oh. Warm. I’d forgotten.', 'soft'),
      N(
        'Your Nubbin sits with its paws round the lantern, carefully, as if it were something lent.',
      ),
    ],
    [
      ask(
        1,
        'literacy',
        'L.3.4',
        'shades of meaning: steady',
        [
          N('The pebble burns “steady all winter long, never hot, always warm.”'),
          N('Which word means almost the same as “steady” here?'),
        ],
        [
          opt(
            'Constant',
            [N('Yes. Constant means it keeps going, the same, without changing.')],
            true,
          ),
          opt('Wild', [N('Wild means out of control. A steady light stays calm.')]),
          opt('Flickering', [N('Flickering lights go up and down. Steady lights stay the same.')]),
        ],
        'Chose a word with a similar meaning to steady.',
      ),
    ],
  ),
  sc(
    'a20-15-ember-remembered',
    [
      N(
        'Your Nubbin opens its little lantern and sets it in the hollow, between Líf and Lífthrasir. The red pebble glows.',
      ),
      N(
        'It flickers in the wind that gets in under the trees. Some nights it is so low you think it has gone.',
      ),
      N('But it never goes out. In the morning it is always there, small and red and warm.'),
      LT('It keeps trying. Look at it. It just keeps trying.', 'soft'),
    ],
    [
      ask(
        2,
        'literacy',
        'L.3.4',
        'the word flicker',
        [
          N('The pebble flickers in the wind, “but it never goes out.”'),
          N('What does flicker mean?'),
        ],
        [
          opt(
            'To shine unsteadily, brightening and dimming',
            [N('Yes. A flickering flame leaps up and sinks down, but may stay alight.')],
            true,
          ),
          opt('To shine very brightly', [
            N('A flicker is unsteady, not bright. A flame that flickers may even be low.'),
          ]),
          opt('To go out completely', [
            N('If it went out, it would not flicker. The pebble keeps trying.'),
          ]),
        ],
        'Learned the word flicker.',
      ),
    ],
  ),
  sc(
    'a20-15-kept',
    [
      N(
        'In your pocket the stone wakes in the cold. It hums one word, the only word it has: safe.',
      ),
      N(
        'Líf and Lífthrasir hear it, and don’t like it. Without a word they move to the far side of the hollow.',
      ),
      LT('What is that? It sounds like the snow, talking.', 'think'),
      N('Nothing else changes. They still let you stay; they just sit a little further off.'),
    ],
    [
      ask(
        1,
        'sel',
        'CASEL: Responsible decision-making',
        'safe is not the same as well (a think question)',
        [
          N(
            'The stone hums the only word it has: safe. Líf and Lífthrasir hear it, and do not like it.',
          ),
          N('Why might the word “safe” make someone uneasy? Is safe the same as well?'),
        ],
        [
          opt('Safe can mean shut in, which is not the same as thriving', [
            N('A thoughtful answer. A locked room is safe, and not well.'),
          ]),
          opt('They have survived by hiding, so “safe” sounds like a trap', [
            N('A good reading. They know hiding keeps you alive, but it is not a life.'),
          ]),
          opt('The stone says it too often, like it has nothing else to say', [
            N('A sharp observation. A word repeated forever can start to sound like a wall.'),
          ]),
        ],
        'Reflected on whether being safe is the same as being well (no single right answer).',
      ),
    ],
  ),
  sc(
    'a20-16-edge-sat',
    [
      N(
        'From the edge of the holt you can see a long way: the white plain, the grey sea beyond it, and the sky.',
      ),
      N(
        'Something is happening at the end of the world. It is very far off, and you see it the way you see weather on the hills.',
      ),
      N(
        'Wolves are running across the sky, after the sun and after the moon. They are small with distance, and fast.',
      ),
      N('A ship is coming over the sea. It is huge and dark, and very slow.'),
      N(
        'There is a figure in its bow. Once, just once, it turns its head and looks straight across the sea, at the holt.',
      ),
      N('Then it looks ahead again, and does not turn back.'),
      N(
        'On the far edge of the world there is a line of fire, low down, like a sunset in the wrong place.',
      ),
      N(
        'None of it comes near. The holt is very quiet, and your Nubbin is holding on to a root with both arms.',
      ),
    ],
    [
      ask(
        5,
        'literacy',
        'RL.3.3',
        'why the figure looks once (a think question)',
        [
          N('The figure in the ship’s bow turns its head once, and looks straight at the holt.'),
          N('Why might the storyteller let it look, just once?'),
        ],
        [
          opt('To show it noticed the one who sat with Thökk', [
            N('A hopeful reading. The story says a small kindness is noticed, even from far away.'),
          ]),
          opt('To make us feel uneasy about what is coming', [
            N('A fair reading. A single look can feel more threatening than a long stare.'),
          ]),
          opt('To show that even a far-off figure can be curious about us', [
            N('An interesting reading. The look is brief, and the figure then turns away.'),
          ]),
        ],
        'Offered readings of a small story detail (no single right answer).',
      ),
    ],
  ),
  sc(
    'a20-16-edge-walked',
    [
      N(
        'From the edge of the holt you can see a long way: the white plain, the grey sea beyond it, and the sky.',
      ),
      N(
        'Something is happening at the end of the world. It is very far off, and you see it the way you see weather on the hills.',
      ),
      N(
        'Wolves are running across the sky, after the sun and after the moon. They are small with distance, and fast.',
      ),
      N(
        'Something is coming over the sea. You can hear it, a long creak of timbers and slow oars, but you can’t see it.',
      ),
      N('The mist lies low on the water. You look and look, and you never see the ship.'),
      N(
        'On the far edge of the world there is a line of fire, low down, like a sunset in the wrong place.',
      ),
      N(
        'None of it comes near. The holt is very quiet, and your Nubbin is holding on to a root with both arms.',
      ),
    ],
    [
      ask(
        4,
        'literacy',
        'RL.3.3',
        'sound and suspense',
        [
          N('You hear a long creak of timbers and slow oars, but mist hides the ship.'),
          N('How does a writer make us uneasy by letting us hear what we cannot see?'),
        ],
        [
          opt(
            'Our imagination fills the gap, and is often worse than a picture',
            [N('Yes. What we cannot see, we make up, and our minds are good at it.')],
            true,
          ),
          opt('Sound is always scarier than sight', [
            N('Not always. It works here because the mist takes away the picture.'),
          ]),
          opt('It does not make us uneasy at all', [
            N(
              'For many readers it does. The creak without a ship is a classic way to build suspense.',
            ),
          ]),
        ],
        'Explained how hearing without seeing can build suspense.',
      ),
    ],
  ),
  sc(
    'a20-17-ember',
    [
      N(
        'Líf stops by your Nubbin’s little lantern at the edge of the field. The red pebble is still glowing, though the sun is warm now.',
      ),
      LI('That kept us alive, I think. Where did it come from?'),
    ],
    [
      ask(
        1,
        'sel',
        'CASEL: Social awareness',
        'memory carried in objects (a think question)',
        [
          N(
            'Líf asks where the ember came from. The pebble has kept two people warm through the whole winter.',
          ),
          N(
            'Can a small object carry kindness from one person to another? What do we mean when we say it “holds” a memory?',
          ),
        ],
        [
          opt('Yes: when we remember who gave it, the kindness comes with it', [
            N('A tender answer. Objects can be doors to feelings.'),
          ]),
          opt('Not really: the kindness is in people, not in things', [
            N('A careful answer. The object only reminds us of what a person did.'),
          ]),
          opt('Both: the object is a reminder, and the kindness is real', [
            N('A balanced answer. We carry what we are given, in things and in ourselves.'),
          ]),
        ],
        'Reflected on how objects can hold memories and kindness (no single right answer).',
      ),
    ],
    {
      choices: [
        {
          id: 'tight',
          label: '“From someone who held on too tight, once.”',
          then: [
            LI('And let go, in the end?'),
            Y('In the end.'),
            LI('Then it’s a good thing to carry.', 'soft'),
          ],
        },
        {
          id: 'nothing',
          label: 'Say nothing.',
          then: [
            N(
              'You say nothing. Líf looks at the pebble a while longer, and nods, as if that were an answer too.',
            ),
          ],
        },
      ],
    },
  ),
  sc(
    'a20-17-complete-sat',
    [
      N(
        'The sun goes over the new land. The talk goes on, slow and easy, as if there will always be more of it.',
      ),
      N(
        'Baldr sits down beside Hödr, close, shoulder to shoulder, the way they always used to sit.',
      ),
      BA('You sat with the one who wouldn’t weep. Someone should.', 'soft'),
      N('Hödr nods. He doesn’t say anything, and he doesn’t need to.'),
      N(
        'Before you go, Baldr puts something in your hand: a sprig with two leaves, from a tree at the edge of the old ground.',
      ),
      BA('It was too young to be asked, once. It’s older now. So am I. Keep it for me.', 'soft'),
      N(
        'Your Nubbin wakes in his light and looks at him for a long moment. Then it gets up and comes back to you, on its own.',
      ),
      N(
        'Líf and Lífthrasir walk out together into the morning, across the fields that nobody sowed.',
      ),
      N(
        'You are back in the Grove, the atlas on your knee. Something clinks in your pocket: a golden game piece, and your Nubbin has brought home a sprig to match.',
      ),
    ],
    [
      ask(
        2,
        'sel',
        'CASEL: Social awareness',
        'sitting with someone others avoid (a think question)',
        [
          N('Baldr says, “You sat with the one who wouldn’t weep. Someone should.”'),
          N('Why might it matter to sit with a person that others turn away from?'),
        ],
        [
          opt('Because nobody should have to be alone with their worst moments', [
            N('A kind answer. Company can be the first sign of hope.'),
          ]),
          opt('Because it shows we can be kind without agreeing', [
            N('A wise answer. You sat with her without saying she was right.'),
          ]),
          opt('Because it is hard, and someone has to do the hard thing', [
            N('A brave answer. Kindness is often the work nobody else will take.'),
          ]),
        ],
        'Reflected on the value of sitting with someone others turn away from (no single right answer).',
      ),
      ask(
        8,
        'literacy',
        'RL.4.2',
        'theme of the whole page',
        [
          N('The page opened with promises, and ends with a sprig kept for Baldr.'),
          N('Which theme fits the page best?'),
        ],
        [
          opt(
            'Staying beside someone, even someone hard to be near, is a kind of courage',
            [N('Yes. You sat in the cave mouth, and Baldr says that mattered.')],
            true,
          ),
          opt('Gods always win in the end', [
            N('The gods lose Baldr, and the page does not say they win everything.'),
          ]),
          opt('Nothing can ever be mended', [
            N('The page ends green and hopeful, so that does not fit.'),
          ]),
        ],
        'Chose the theme of the whole page.',
      ),
    ],
  ),
  sc(
    'a20-17-complete-walked',
    [
      N(
        'The sun goes over the new land. The talk goes on, slow and easy, as if there will always be more of it.',
      ),
      N(
        'Hödr sits a little apart from the others, at the edge of the grass, with his hands empty.',
      ),
      N('Nobody goes to him at first. You don’t either.'),
      BA('Brother. Come and sit here. There’s room. There was always room.', 'soft'),
      N('Hödr gets up, and comes over, and sits down next to him.'),
      N(
        'Before you go, Baldr puts something in your hand: a sprig with two leaves, from a tree at the edge of the old ground.',
      ),
      BA('It was too young to be asked, once. It’s older now. So am I. Keep it for me.', 'soft'),
      N(
        'Your Nubbin wakes in his light and looks at him for a long moment. Then it gets up and comes back to you, on its own.',
      ),
      N(
        'Líf and Lífthrasir walk out together into the morning, across the fields that nobody sowed.',
      ),
      N(
        'You are back in the Grove, the atlas on your knee. Something clinks in your pocket: a golden game piece, and your Nubbin has brought home a sprig to match.',
      ),
    ],
    [
      ask(
        2,
        'sel',
        'CASEL: Self-awareness',
        'when nobody goes to the one who is alone (a think question)',
        [
          N('Nobody goes to Hödr at first, and you do not either.'),
          N(
            'Why is it sometimes hard to go to someone who is alone? What could make it easier next time?',
          ),
        ],
        [
          opt('We worry we will say the wrong thing, so we say nothing', [
            N('A common reason. Often “I am here” is enough.'),
          ]),
          opt('We wait for someone else to go first', [
            N('That happens in crowds. One person moving can free everyone else.'),
          ]),
          opt('Knowing what to say beforehand would help', [
            N('A practical idea. A simple sentence ready in your pocket can help.'),
          ]),
        ],
        'Reflected on why we sometimes hold back from someone who is alone (no single right answer).',
      ),
      ask(
        9,
        'literacy',
        'RL.4.2',
        'theme of the whole page',
        [
          N('The page opened with promises, and ends with a sprig kept for Baldr.'),
          N('Which theme fits the page best?'),
        ],
        [
          opt(
            'It is never too late to make room for someone',
            [N('Yes. Baldr says there was always room, and Hödr comes and sits.')],
            true,
          ),
          opt('Gods always win in the end', [
            N('The gods lose Baldr, and the page does not say they win everything.'),
          ]),
          opt('Nothing can ever be mended', [
            N('The page ends green and hopeful, so that does not fit.'),
          ]),
        ],
        'Chose the theme of the whole page.',
      ),
    ],
  ),
];

/** No reader lesson is a `do` beat, so there are no `edu:` checks to list. */
export const CHECKS: string[] = [];
