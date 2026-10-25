/**
 * The Learning Grove, reader band (ages 7–10): Atlas page A25, The Nothing (a lonely boy, a stolen
 * book and a land being eaten by a nothing). Part One only: quests A25-1 to A25-14, ending at
 * “Moon Child”. Part Two (A25-15 to A25-20) has no Learning Grove version, by the outline.
 *
 * Source: atlas-a25.ts (ATLAS_A25 and ATLAS_A25_VARIANTS). One EduScene per original scene of the
 * fourteen quests (every step scene, every done scene and every complete scene) plus the one
 * variant that falls inside Part One (a25-13-empress-ash). Ids are `reader:<original id>`. Part One
 * has no scene with a `set` flag, so no flags are carried. Reader keeps every choice under its
 * original id. See EDU-STYLE.md. British spelling.
 *
 * Learning angles, from the outline: a book printed in two colours to tell two stories; tortoises
 * and turtles can live a very long time; sphinxes in Egyptian and Greek stories; a few German
 * words (Buch, Mond, Kind) and how German sticks words together; and that a name can be a gift.
 * Around them: maps and compass directions, sound and pitch, light and reflection, forces, habitats,
 * sums with time, distance and groups, rhyme and metaphor, and feelings (fear, guilt, grief, asking
 * for help, courage).
 *
 * Think questions (`ask` with no `best`) in every quest and a `sel` lesson in nearly every quest.
 * Domains never repeat back to back, across scenes, quests or the variant path.
 *
 * Care notes kept: Bastian is drawn with affection and is never a joke; the Nothing is missing
 * pieces of the picture, never a monster; Artax’s death is one quiet scene, said plainly with
 * comfort straight after, and is never recapped; Gmork’s end is offscreen and Atreyu’s face is
 * what we see; Ygramul’s sting is a jolt of light; Atreyu’s people are a hunting people of the
 * grassland, and no lesson touches them beyond a grassland habitat and community; no line is
 * lifted from Michael Ende’s book or from any film or translation.
 *
 * Facts used (all well established): a tortoise’s shell is part of its skeleton, and some giant
 * tortoises live well over a hundred years; the Great Sphinx at Giza is about 4,500 years old, has
 * a lion’s body and a human head, and Greek stories told of a sphinx that set riddles; the snake
 * that bites its tail is called the ouroboros, a Greek name, and drawings of it go back over 3,000
 * years to Egypt; in German Buch is book, Mond is moon and Kind is child, and German can join
 * words into one long word (Mondenkind, moon child); printing in two colours needs the paper to
 * pass through the press once for each colour; each eye has a blind spot that the brain fills in;
 * light from the Sun takes about eight minutes to reach Earth; the Sun rises in the east; a west
 * wind blows from the west; fast vibrations make high sounds; gold is much denser than water;
 * real mountains change very slowly; sand is tiny bits of rock worn down grain by grain.
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
const BA = say('a25-bastian');
const CO = say('a25-coreander');
const AT = say('a25-atreyu');
const CA = say('a25-cairon');
const EM = say('a25-empress');
const AR = say('a25-artax');
const MO = say('a25-morla');
const YG = say('a25-ygramul');
const FA = say('a25-falkor');
const EN = say('a25-engywook');
const UR = say('a25-urgl');
const UY = say('a25-uyulala');
const GM = say('a25-gmork');
const OM = say('a25-oldman');
const RC = say('a25-rockchewer');
const BL = say('a25-blubb');
const HO = say('a25-nighthob');
const TI = say('a25-tiny');
const HU = say('a25-hunter');

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
const ch = (id: string, label: string, then: Line[]): Choice => ({ id, label, then: sp(then) });

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

// ================================================================== A25-1 The Bookshop
const A1: EduQuest = quest(
  'a25-01',
  'The Bookshop',
  {
    'a25-01-s1': {
      goal: 'Step through the page, behind the shop bell.',
      hint: 'Touch the little bell on the page. Stay behind it, where nobody in the shop can see you.',
    },
    'a25-01-s2': {
      goal: 'Follow the boy through the rain to his school.',
      hint: 'Keep him in sight. He is slow on his feet, but he knows the short cuts.',
    },
    'a25-01-s3': {
      goal: 'Sit in the attic with Bastian while he opens the book.',
      hint: 'Find a corner on the old gym mats and keep quiet. He thinks he is alone.',
    },
  },
  [
    sc(
      'a25-01-shop',
      [
        N('Nova’s atlas opens at a page that is mostly a glass door, with a little bell above it.'),
        N('It is raining on the page. Real rain, running off the edge and on to your table.'),
        N(
          'You touch the bell. It rings, and you are standing behind it in a dim antiquarian bookshop, full of old and rare books.',
        ),
        N(
          'Books climb to the ceiling. In an armchair between the towers, an old man in a black suit is reading.',
        ),
        N('Nobody looks at you. Your Nubbin waves at the old man, and he turns a page.'),
        N('The door bangs open. A boy tumbles in, soaked, with a school bag on his back.'),
        N(
          'He is about ten, round, with wet hair in his eyes. He shuts the door and leans on it, panting.',
        ),
        CO(
          'Out. I don’t sell to children. They sneeze on books and ask whether there are pictures.',
          'angry',
        ),
        BA(
          'I’m not buying anything. There are boys outside. Just until they’ve gone past. Please.',
        ),
        CO('Hm. What’s your name?'),
        BA('Bastian Balthazar Bux.', 'sad'),
        CO('That’s a lot of b’s for one name. Sit down, then. Don’t touch anything.'),
      ],
      [
        ask(
          8,
          'sel',
          'what to do when other children are unkind: go somewhere safe and tell a trusted grown-up',
          'CASEL: Responsible decision-making',
          [
            N('Bastian is hiding from boys who were unkind to him.'),
            N('What is a good thing to do when that happens to you?'),
          ],
          [
            o(
              'Get somewhere safe, and tell a grown-up you trust.',
              [
                N('Yes. Being unkind to someone is never their fault. It is never yours, either.'),
                N('A grown-up you trust can help it stop, and you don’t have to carry it alone.'),
              ],
              true,
            ),
            o('Hit them back.', [
              N('It’s very hard to feel so cross. But hitting tends to make more trouble.'),
              N('Getting safe and telling a trusted grown-up can really make it stop.'),
            ]),
            o('Keep it a secret.', [
              N(
                'Keeping it secret is understandable. But there is nothing to be ashamed of.',
              ),
              N('Telling a trusted person is the braver thing, and it lets help find you.'),
            ]),
          ],
          'Thought about what to do when other children are unkind: get safe and tell a trusted adult.',
        ),
      ],
      [
        ch('still', 'Keep very still behind the bell.', [
          N('You keep still. The bell, which is right by your ear, decides to keep still too.'),
        ]),
        ch('notebook', 'Take out your notebook and write down the shop’s name.', [
          N(
            'You copy the letters from the glass, backwards first and then the right way round. Your pencil sounds very loud.',
          ),
        ]),
        ch('nubbin', 'Let your Nubbin sniff the nearest pile of books.', [
          N(
            'Your Nubbin sniffs the nearest pile, and sneezes on a book. That proves the old man right about something.',
          ),
        ]),
      ],
    ),
    sc(
      'a25-01-shop-done',
      [
        N(
          'A telephone rings in the back room. The old man grumbles his way out and leaves his book on the armchair.',
        ),
        N(
          'It is bound in copper-coloured silk. On the cover, one light snake and one dark snake bite each other’s tails.',
        ),
      ],
      [
        notice(
          1,
          'social-studies',
          'an ancient symbol: the snake that bites its tail (the ouroboros)',
          'D2.His.2.3-5',
          [
            N('A note in Nova’s small writing has appeared in the margin of the page.'),
            N(
              '“A snake biting its own tail is one of the oldest signs there is. Artists in ancient Egypt drew it over three thousand years ago.”',
            ),
            N(
              '“Later, the ancient Greeks gave it the name we still use: ouroboros. It stands for something that goes round and round.”',
            ),
          ],
          'Learned that the snake biting its tail is a very old symbol from ancient Egypt, with a Greek name, meaning something that goes round and round.',
        ),
      ],
    ),
    sc(
      'a25-01-run',
      [
        N(
          'Bastian looks at the book. Then he looks at the back room, where the old man is shouting at the telephone about an invoice.',
        ),
        N(
          'Then he slips the book under his coat and runs, leaving the door open and the bell still ringing.',
        ),
        N(
          'You hurry after him. Your Nubbin follows, running very fast and very flat, the way it runs in thunderstorms.',
        ),
        BA('I’m a thief now. I have never taken anything before in my whole life.', 'sad'),
        N(
          'He can’t go home, he tells a lamp-post. His father doesn’t shout. He hardly says anything any more.',
        ),
        N(
          'The clock over the school gate says twenty-five past nine. School began at nine, and there is a maths test today.',
        ),
        BA('Can’t go in there either.'),
        N(
          'He goes in by the back door instead, up the back stairs and past the caretaker’s cupboard, all the way to the top.',
        ),
      ],
      [
        ask(
          5,
          'maths',
          'time intervals: from 9:00 to 9:25 is 25 minutes',
          '3.MD.A.1',
          [
            N('School began at nine o’clock. The clock over the gate says twenty-five past nine.'),
            N('How many minutes late is Bastian?'),
          ],
          [
            o(
              '25 minutes',
              [
                N(
                  'Yes. From 9:00 to 9:25 is 25 minutes. “Twenty-five past” means 25 minutes after the hour.',
                ),
              ],
              true,
            ),
            o('35 minutes', [
              N('Let’s count it on the clock. From nine to half past is 30 minutes.'),
              N('Twenty-five past is a bit before half past, so it is 25 minutes.'),
            ]),
            o('5 minutes', [
              N('That is the 5 in “twenty-five”, but it is not the answer.'),
              N('“Twenty-five past nine” means 25 minutes after nine, so he is 25 minutes late.'),
            ]),
          ],
          'Worked out a time interval on a clock: from 9:00 to 9:25 is 25 minutes.',
        ),
      ],
    ),
    sc(
      'a25-01-run-done',
      [
        N(
          'At the top of the stairs there is a door nobody uses. It isn’t locked, because it has never needed to be.',
        ),
        N('Bastian stops with his hand on the cold handle. His heart is going very fast.'),
      ],
      [
        ask(
          1,
          'sel',
          'making things right after a mistake: honesty, saying sorry, giving back',
          'CASEL: Responsible decision-making',
          [
            N('Bastian knows he took the book without asking.'),
            N('If you were him, what would you do next?'),
          ],
          [
            o('Take it back straight away.', [
              N('That’s a fair answer. Giving something back quickly keeps a mistake small.'),
              N('Bastian is thinking about it too.'),
            ]),
            o('Tell the bookseller the truth and say sorry.', [
              N(
                'That is an honest and a brave answer. A sorry works best when it is said to the person.',
              ),
            ]),
            o('Read a little first, and decide after.', [
              N(
                'That’s what Bastian says he will do. Many people feel that way when they are scared.',
              ),
              N('But the longer a mistake waits, the heavier it feels.'),
            ]),
          ],
          'Thought about how to make things right after taking something without asking.',
        ),
      ],
    ),
    sc(
      'a25-01-attic',
      [
        N(
          'The school attic is long and low, full of broken desks, rolled-up maps and a heap of old gym mats.',
        ),
        N('Rain drums on the roof slates. It is grey up here, and it smells of dust and chalk.'),
        N(
          'Bastian finds some grey army blankets, wraps himself in two, and sits on the mats like a parcel.',
        ),
        N('He takes out his sandwich and his apple, looks at them, and puts them away again.'),
        BA('Just the first page. Then I’ll take it back. Probably.'),
        N(
          'He opens the book. Over his shoulder, unseen, you notice that its words are printed in two colours.',
        ),
        N(
          'The words about the attic are rust-red. As he turns the page, words about a forest begin, and they are green.',
        ),
        N(
          'Your Nubbin burrows into the blankets and settles against his side, because it is warm there.',
        ),
        N('Bastian doesn’t notice. He has already started reading.'),
      ],
      [
        ask(
          6,
          'literacy',
          'how an author can use two colours to show two places (setting)',
          'RL.4.3',
          [
            N(
              'In this book, the attic is printed in red and the forest in green. Why would an author do that?',
            ),
          ],
          [
            o(
              'So readers always know which world they are in.',
              [
                N('Yes. The colour is a clue: red is the attic, green is the faraway land.'),
                N('On a simple press, each colour needs its own run through the machine.'),
              ],
              true,
            ),
            o('Those were the only two inks the printer had.', [
              N('A printer can use any colour. Using two was a choice, and it took extra work.'),
              N('The choice does a job: it shows where we are.'),
            ]),
            o('Just to look pretty.', [
              N('It does look pretty. But it also tells you which world you are reading about.'),
            ]),
          ],
          'Thought about why an author might print two settings in two colours.',
        ),
      ],
      [
        ch('beside', 'Sit beside him on the mats.', [
          N(
            'You sit down beside him. He shifts over without looking up, the way people do for someone they can’t see.',
          ),
        ]),
        ch('window', 'Sit by the skylight and read your own copy.', [
          N('Your atlas page shows exactly the same words. You read along.'),
        ]),
      ],
    ),
    sc(
      'a25-01-complete',
      [
        N(
          'The attic is drawn in rust-red ink. As Bastian reads, the edges of the page begin to turn green.',
        ),
        N(
          'A forest grows in from the corners, and the rain on the slates turns into wind in leaves.',
        ),
        N(
          'You are not in the attic any more. You are on a forest path at night, beside a campfire, where someone is singing badly.',
        ),
        N('Very faintly, if you listen, you can still hear a boy turning a page.'),
      ],
      [
        notice(
          1,
          'science',
          'sounds are vibrations: rain on slates and wind in leaves',
          '4-PS3-2',
          [
            N('Listen to the page. Rain pats the slates, and wind rustles the leaves.'),
            N('Both sounds are made the same way: by something shaking, very quickly.'),
            N(
              'Raindrops make slates ring, and wind makes leaves flutter. Every sound you have ever heard began with a shake.',
            ),
          ],
          'Learned that every sound is made by vibrations, using rain on slates and wind in leaves.',
        ),
      ],
    ),
  ],
  [
    gl(
      'antiquarian',
      'Having to do with old and rare things. An antiquarian bookshop sells old and rare books.',
      'a25-01-shop',
    ),
    gl('invoice', 'A bill that says how much money is owed.', 'a25-01-run'),
  ],
);

// ================================================================== A25-2 The Messengers
const A2: EduQuest = quest(
  'a25-02',
  'The Messengers',
  {
    'a25-02-s1': {
      goal: 'Join the messengers at the campfire in the forest.',
      hint: 'Follow the bad singing. It comes from the clearing with the fire.',
    },
    'a25-02-s2': {
      goal: 'Hear what the messengers have seen, and go with them to look.',
      hint: 'Walk with Ückück to the edge of the wood. You don’t have to go close.',
    },
  },
  [
    sc(
      'a25-02-fire',
      [
        N(
          'In the clearing sits a will-o’-the-wisp, a little ball of light, singing to keep its courage up. It isn’t working.',
        ),
        N(
          'A rockchewer comes crunching out of the trees. He is the size of a hill, and he is eating a small piece of it.',
        ),
        N(
          'Then a night-hob arrives riding a bat, and a tiny, no bigger than your thumb, on a snail that has run all the way.',
        ),
        BL('Strangers! Friendly ones? Say friendly. I’m Blubb, and I’m very nervous.', 'shock'),
        N('The rockchewer says, “My name has fourteen letters. You may call me Rockchewer. Sit. Pebble?”'),
        N(
          'The night-hob says, “We are all going the same way, it seems: to the Ivory Tower, with bad news.”',
        ),
        N(
          'The tiny one says, “My snail is the fastest in my whole country. Please don’t step on him.”',
        ),
        N(
          'Your Nubbin sits down next to the snail, very carefully, and the two of them look at each other for a long time.',
        ),
      ],
      [
        ask(
          4,
          'social-studies',
          'respect for other people’s customs: accepting a gift politely',
          'D2.Civ.8.3-5',
          [
            N('A rockchewer holds out a pebble. To him, it is a kind and tasty gift.'),
            N('What is the polite thing to do?'),
          ],
          [
            o(
              'Take it kindly and say thank you.',
              [
                N('Yes. People have different customs, and a gift is a gift.'),
                N('You don’t have to eat it. Thanking him is how you show respect.'),
              ],
              true,
            ),
            o('Say “Yuck!”', [
              N(
                'A pebble is a strange snack to us. But to him it is a present, and “yuck” would hurt.',
              ),
              N('Saying thank you shows respect for how other people do things.'),
            ]),
            o('Walk away.', [
              N('That might feel safe. But it would also say that his kindness didn’t count.'),
              N('Saying thank you is the respectful way.'),
            ]),
          ],
          'Practised respecting a different custom by accepting a gift politely.',
        ),
      ],
      [
        ch('pebble', 'Accept the pebble, politely.', [
          N('You hold it as if you might eat it later. The rockchewer nods, pleased.'),
          N('Good manners matter, whatever size you are.'),
        ]),
        ch('news', 'Ask what the bad news is.', [
          HO('The same as everyone’s, I expect. That is what frightens me.', 'sad'),
        ]),
      ],
    ),
    sc(
      'a25-02-fire-done',
      [
        N(
          'Each came from a different corner of Fantastica to the same fire, carrying the same news.',
        ),
        N('The rockchewer lays his pebbles on a flat stone, ready to share. There are eighteen.'),
      ],
      [
        ask(
          1,
          'maths',
          'sharing equally: 18 ÷ 6 = 3',
          '3.OA.A.3',
          [
            N('There are six of you: four messengers, you, and your Nubbin.'),
            N('Share the eighteen pebbles fairly. How many does each one get?'),
          ],
          [
            o('3 each', [N('Yes. 6 groups of 3 make 18, so 18 ÷ 6 = 3.')], true),
            o('4 each', [
              N('Let’s check. Six friends with 4 each would need 6 × 4 = 24 pebbles.'),
              N('We only have 18. Six lots of 3 is 18.'),
            ]),
            o('2 each', [
              N('Six friends with 2 each is 6 × 2 = 12. That leaves 6 pebbles over.'),
              N('Share those as well, and everyone has 3.'),
            ]),
          ],
          'Shared 18 things equally between 6 (18 ÷ 6 = 3).',
        ),
      ],
    ),
    sc(
      'a25-02-gap',
      [
        BL(
          'In my marsh, a piece of the bank went. Not burnt. Not flooded. Just not there any more.',
        ),
        RC('Mountain too. Bit missing. Didn’t eat it. Honest.', 'sad'),
        TI(
          'At home, a lake with a hole in the middle where nothing was. Not water. Not dry. Nothing.',
        ),
        HO('Come. I am Ückück, and I saw it from the air. It’s here too now.'),
        N(
          'At the edge of the wood, the trees just stop. It isn’t a cliff or a clearing: the picture simply isn’t there.',
        ),
        N(
          'When you look at the gap, your eyes feel as if they have gone blind on that side. The singing birds fall quiet.',
        ),
        N(
          'Your Nubbin won’t go a step closer. It sits down hard in the leaves and takes hold of your boot.',
        ),
        HO('It’s growing. Every land says so. The Empress must know what it is.'),
      ],
      [
        notice(
          5,
          'science',
          'the blind spot: each eye has a spot that cannot see, and the brain fills it in',
          '4-LS1-2',
          [
            N('Here is something odd and true about your own eyes.'),
            N(
              'In each eye there is one tiny spot, where the nerve leaves, that cannot see anything.',
            ),
            N('You never notice. Your brain quietly fills the gap with whatever is around it.'),
          ],
          'Learned that each eye has a blind spot that the brain fills in, so we do not notice it.',
        ),
      ],
      [
        ch('back', 'Step back with your Nubbin.', [
          N(
            'You step back. The birds start singing again a little way off, as if nothing happened.',
          ),
        ]),
        ch('look', 'Look away from the gap, deliberately.', [
          N(
            'You make yourself look at a real leaf instead, with a hole a caterpillar made. It helps.',
          ),
        ]),
      ],
    ),
    sc(
      'a25-02-gap-done',
      [
        N('In the end Blubb gives it a name, in a very small voice: “the Nothing”.'),
        N('Everyone wishes he hadn’t. Everyone feels a little better anyway.'),
      ],
      [
        ask(
          1,
          'sel',
          'naming a scary thing makes it easier to talk about',
          'CASEL: Self-awareness',
          [N('Why might giving a frightening thing a name make it feel a little smaller?')],
          [
            o(
              'Once it has a name, we can talk about it together.',
              [
                N('Yes. A name gives you something to hold on to, and something to share.'),
                N('The Nothing is still there. But talking about it is a first step.'),
              ],
              true,
            ),
            o('A name makes it go away.', [
              N('If only! A name doesn’t make a thing vanish, and the Nothing is still growing.'),
              N('What a name does is let us talk about it, and talking helps.'),
            ]),
            o('It doesn’t help at all.', [
              N('Blubb might agree with you. Everyone wished he hadn’t said it.'),
              N('But naming a worry is how friends begin to face it together.'),
            ]),
          ],
          'Thought about why naming a fear can make it easier to face.',
        ),
      ],
    ),
    sc(
      'a25-02-complete',
      [
        N(
          'The four messengers set off together at dawn, at the speed of the snail, which turns out to be very fast.',
        ),
        N(
          'For a moment the green fades, and you see the attic in red. Bastian has pulled the blanket round his ears.',
        ),
        BA('I’d have gone with them. I think I would. If I could.', 'think'),
        N('He breaks off a corner of his sandwich and goes on reading.'),
      ],
      [
        ask(
          2,
          'literacy',
          'what a character’s words tell us about his feelings and wishes',
          'RL.3.3',
          [
            N(
              'Bastian says he would have gone with the messengers, if he could. What does that tell us about him?',
            ),
          ],
          [
            o('He wishes he were braver than he thinks he is.', [
              N('That’s a fair answer. He says “if I could”, as if he doesn’t believe he can.'),
            ]),
            o('He is lonely and would like friends to travel with.', [
              N('That’s a fair answer. The messengers are a gang, and he is alone in an attic.'),
            ]),
            o('He just loves adventure stories.', [
              N('That’s a fair answer. He is reading as fast as he can, so he surely does.'),
              N('And a story can also show us what we wish for.'),
            ]),
          ],
          'Thought about what Bastian’s words show about his wishes (a think question).',
        ),
      ],
    ),
  ],
  [
    gl('messenger', 'A person who carries news from one place to another.', 'a25-02-fire-done'),
    gl(
      'customs',
      'Ways of doing things that a group of people has followed for a long time.',
      'a25-02-fire',
    ),
  ],
);

// ================================================================== A25-3 The Ivory Tower
const A3: EduQuest = quest(
  'a25-03',
  'The Ivory Tower',
  {
    'a25-03-s1': {
      goal: 'Go with the messengers into the Ivory Tower.',
      hint: 'Climb the white spiral road through the gardens to the hall of physicians.',
    },
    'a25-03-s2': {
      goal: 'Help Cairon find the road to the Grassy Sea.',
      hint: 'Unroll the maps in the physicians’ library and find the long road east.',
    },
  },
  [
    sc(
      'a25-03-tower',
      [
        N(
          'The Ivory Tower rises out of a maze of flowers, white and tall, like a spiral shell standing on its end.',
        ),
        N(
          'The halls are full of messengers from everywhere. Each one carries the same news, and each thinks theirs is new.',
        ),
        HO('So many. I thought I was important.', 'sad'),
        N(
          'In a high room the Empress’s physicians are arguing. In the middle stands a black centaur with a white beard.',
        ),
        CA('Enough! None of you knows what is wrong with her, and neither do I.', 'angry'),
        CA(
          'She is ill in just the way the land is ill. It is one illness. If it reaches her, there is no more Fantastica.',
        ),
        N(
          'The room goes silent. Your Nubbin hides behind a pillar, which is the most sensible thing anyone has done all day.',
        ),
      ],
      [
        ask(
          2,
          'sel',
          'noticing how someone else feels, and saying something kind',
          'CASEL: Social awareness',
          [N('Ückück feels small, one messenger among hundreds. What could you say to him?')],
          [
            o(
              'Your news matters. You came all this way.',
              [
                N('Yes. A kind word that is true can make someone feel seen.'),
                N('Ückück really did fly a long way, and that counts.'),
              ],
              true,
            ),
            o('Don’t worry, you’ll feel better soon.', [
              N(
                'That is kindly meant. But it can make someone feel that their feeling doesn’t count.',
              ),
              N('It helps more to say what is true about them: you came a long way.'),
            ]),
            o('You’re right, there are a lot of messengers.', [
              N('That is true about the numbers. But it would make Ückück feel even smaller.'),
              N('A good friend finds the true thing that helps.'),
            ]),
          ],
          'Practised noticing how someone feels and choosing a kind, true thing to say.',
        ),
      ],
    ),
    sc(
      'a25-03-tower-done',
      [
        N(
          'Cairon stamps a hoof. Then he looks very old, and sits down on the floor like a tired horse.',
        ),
        CA(
          'A physician finds the cause first, and then the cure. I have the problem, at least: one illness, in two places.',
        ),
      ],
      [
        ask(
          1,
          'science',
          'defining a problem clearly before looking for a solution',
          '3-5-ETS1-2',
          [
            N(
              'Cairon says the Empress’s illness and the Nothing are one problem. Why does that help?',
            ),
          ],
          [
            o(
              'Then one cure might mend both.',
              [N('Yes. Naming the problem clearly is the first step to solving it.')],
              true,
            ),
            o('It doesn’t help. Two problems would be easier.', [
              N('It can feel that way! But two separate cures would be twice the work.'),
              N('If the problem is really one, one cure might mend both.'),
            ]),
            o('It means nothing can be done.', [
              N(
                'It sounds gloomy, and Cairon feels gloomy. But a problem we understand is a problem we can try to solve.',
              ),
            ]),
          ],
          'Learned that solving a problem begins with saying clearly what the problem is.',
        ),
      ],
    ),
    sc(
      'a25-03-maps',
      [
        CA('She has chosen a hero to find the cure, and I must carry this to him.'),
        N(
          'Round his neck hangs an amulet: two snakes, one light, one dark, each biting the other’s tail.',
        ),
        N('It is the same sign that you saw on the cover of the book.'),
        CA(
          'AURYN. Whoever wears it acts for her. The hero is in the Grassy Sea. His name is Atreyu.',
        ),
        CA(
          'I don’t know the way. I am a physician. I know the way to the kitchen, and to people’s insides.',
        ),
        N(
          'The maps are huge and out of date. Half of them have gaps now, where the Nothing has been.',
        ),
        CA('You, traveller, with the sharp eyes. Help an old horse.'),
      ],
      [
        ask(
          6,
          'social-studies',
          'compass directions: the Sun rises in the east',
          'D2.Geo.2.3-5',
          [
            N('The Grassy Sea lies far to the east.'),
            N('On a clear morning, which way do you face to look at the Sun rising?'),
          ],
          [
            o(
              'East',
              [
                N('Yes. The Sun rises in the east and sets in the west.'),
                N('Face the rising Sun, and east is in front of you.'),
              ],
              true,
            ),
            o('West', [
              N('West is where the Sun sets in the evening.'),
              N('Face the Sun as it rises in the morning, and you are looking east.'),
            ]),
            o('South', [
              N('South is at your back when you face north, and the Sun does not rise there.'),
              N('The rising Sun is in the east.'),
            ]),
          ],
          'Learned that the Sun rises in the east and used it to find a direction on a map.',
        ),
      ],
      [
        ch('river', 'Follow the river on the map.', [
          N(
            'The river goes east for a thousand miles and ends in grass. Cairon puts his finger on it and grunts, pleased.',
          ),
        ]),
        ch('ask', 'Ask Ückück, who has seen it from the air.', [
          HO(
            'East. Keep going east until there’s nothing but grass, and then go on. You can’t miss it.',
          ),
        ]),
      ],
    ),
    sc(
      'a25-03-maps-done',
      [
        CA('Good. Then I gallop. Will you come? On long roads I talk to myself, and I’m dull.'),
        N(
          'Your Nubbin climbs on to his back without asking. Cairon pretends not to notice, which is kind.',
        ),
      ],
      [
        ask(
          1,
          'maths',
          'multiplying to find a distance: 4 × 100 miles',
          '4.MD.A.2',
          [
            N('Say Cairon gallops 100 miles every day.'),
            N('How far will he have gone after 4 days?'),
          ],
          [
            o(
              '400 miles',
              [N('Yes. Four lots of 100 is 100 + 100 + 100 + 100 = 400 miles.')],
              true,
            ),
            o('104 miles', [
              N('That is 100 + 4, but there are four whole days, each of 100 miles.'),
              N('4 × 100 = 400.'),
            ]),
            o('300 miles', [
              N('That is three days: 3 × 100 = 300. We need one more day.'),
              N('4 × 100 = 400.'),
            ]),
          ],
          'Multiplied a daily distance by a number of days (4 × 100 = 400 miles).',
        ),
      ],
    ),
    sc(
      'a25-03-complete',
      [
        N(
          'The road east goes on for days. Cairon gallops until his legs shake, then walks, then gallops again.',
        ),
        CA(
          'A great warrior. Strong. Wise. Grey at the temples, I should think. I shall know him at once.',
        ),
        N(
          'In the red attic, Bastian has put an old candle in his pocket for later. It is getting dark up there.',
        ),
      ],
      [
        ask(
          1,
          'literacy',
          'comparing what a character expects with what you would picture',
          'RL.3.6',
          [
            N('Cairon is sure he knows what the hero will look like.'),
            N('Is there only one way a hero can look?'),
          ],
          [
            o('Heroes can be anyone.', [
              N(
                'That’s a fair answer. Heroes in stories, and in life, come in every shape and size.',
              ),
              N('Cairon’s picture is only his picture.'),
            ]),
            o('Heroes are strong, like Cairon says.', [
              N('That’s a fair answer. Strength is one thing a hero might have.'),
              N('But bravery and kindness don’t come in any particular size.'),
            ]),
            o('I am not sure yet. Let’s see who it is.', [
              N('That’s a wise answer. Cairon will find out soon, and so will we.'),
            ]),
          ],
          'Compared a character’s picture of a hero with their own (a think question).',
        ),
      ],
    ),
  ],
  [
    gl('physician', 'A doctor.', 'a25-03-tower'),
    gl('amulet', 'A small charm that is worn or carried to protect someone.', 'a25-03-maps'),
  ],
);

// ================================================================== A25-4 Atreyu
const A4: EduQuest = quest(
  'a25-04',
  'Atreyu',
  {
    'a25-04-s1': {
      goal: 'Bring Cairon to the hunters’ camp in the Grassy Sea.',
      hint: 'Walk ahead of him through the tall grass. The tents are by the stream.',
    },
    'a25-04-s2': {
      goal: 'Watch Atreyu take the amulet.',
      hint: 'Stand at the edge of the ring and let Cairon speak. It is not your message.',
    },
    'a25-04-s3': {
      goal: 'Get your Nubbin down off Artax’s saddle. Or don’t.',
      hint: 'Talk to Artax. He has opinions.',
    },
  },
  [
    sc(
      'a25-04-camp',
      [
        N(
          'The Grassy Sea is grass as far as you can see, moving in long waves like water. In places it is purple, where the buffalo graze.',
        ),
        N(
          'The hunters’ camp is a ring of hide tents by a stream. The people are green-skinned, quiet and very good at spotting visitors.',
        ),
        HU('A centaur, a stranger and a… whatever that is. You’re a long way from anywhere.'),
        CA('I bring a message for Atreyu, from the Empress. Take me to him.'),
        HU(
          'Atreyu? He’s out with the herd. He’s meant to begin learning to hunt tomorrow.',
          'think',
        ),
        N('Cairon’s eyebrows go up. He says nothing, but his tail swishes once, impatiently.'),
      ],
      [
        notice(
          0,
          'science',
          'grassland as a habitat, and its different names around the world',
          '3-LS4-3',
          [
            N('A grassland is a habitat with lots of grass and very few trees.'),
            N(
              'On our Earth, grasslands have different names in different places: prairie, steppe, savanna and pampas.',
            ),
            N('Grazing animals live there, and many small creatures hide in the tall grass.'),
          ],
          'Learned what a grassland habitat is and four of its names (prairie, steppe, savanna, pampas).',
        ),
      ],
    ),
    sc(
      'a25-04-camp-done',
      [
        N(
          'Someone runs to fetch him. Cairon combs his beard with his fingers, to look his best for a hero.',
        ),
        N(
          'While you wait, you count the tents around the ring. There are twelve, with three people living in each.',
        ),
      ],
      [
        ask(
          1,
          'maths',
          'equal groups: 12 groups of 3 make 36',
          '3.OA.A.1',
          [N('Twelve tents, with three people living in each. How many people live in the ring?')],
          [
            o('36 people', [N('Yes. 12 groups of 3 make 36, because 12 × 3 = 36.')], true),
            o('15 people', [
              N('That is 12 + 3. But each of the twelve tents has its own three people.'),
              N('12 × 3 = 36.'),
            ]),
            o('24 people', [
              N('That is 12 × 2, which would be two people in each tent.'),
              N('With three in each, 12 × 3 = 36.'),
            ]),
          ],
          'Used equal groups to multiply 12 × 3 = 36.',
        ),
      ],
    ),
    sc(
      'a25-04-amulet',
      [
        N(
          'A boy comes through the grass. He is about ten years old, with green skin and dark hair, in a purple-red cloak.',
        ),
        AT('You asked for me?'),
        CA('No. I asked for Atreyu, the hunter.'),
        AT('That’s me. I’m not a hunter yet. I was going to be, tomorrow.'),
        N(
          'Cairon looks at him for a long time. Then he laughs a short, tired laugh, and takes the amulet off his own neck.',
        ),
        CA(
          'She chose you. She never chooses wrongly, so I must have been wrong about heroes. It wouldn’t be the first time.',
          'soft',
        ),
        CA(
          'Go without weapons. Find out what is wrong with her, and find the cure. Don’t ask me how. Nobody knows.',
        ),
        N(
          'Atreyu puts on AURYN. He lays his bow down in the grass, very carefully, and doesn’t look at it again.',
        ),
        AT(
          'My name means “Son of All”. My mother and father died when I was small, so everyone brought me up.',
        ),
        AT('So I’m going for everyone.'),
      ],
      [
        ask(
          3,
          'sel',
          'a growth mindset: “not yet” means still learning',
          'CASEL: Self-awareness',
          [
            N('Atreyu says he is “not a hunter yet”.'),
            N('What does the little word “yet” tell us?'),
          ],
          [
            o(
              'He is still learning, and he can get there.',
              [
                N('Yes. “Not yet” means “not so far”. It leaves the door open.'),
                N('Everybody starts as a beginner.'),
              ],
              true,
            ),
            o('He will never be a hunter.', [
              N('“Yet” says the opposite. It means he hasn’t learned it so far, but he can.'),
            ]),
            o('He is only pretending.', [
              N('Atreyu is being honest. He is telling Cairon where he is right now.'),
              N('“Yet” means he is still on the way.'),
            ]),
          ],
          'Learned that “not yet” means still learning, and thought about a growth mindset.',
        ),
        notice(
          9,
          'literacy',
          'names are words with meanings, and a name can carry a story or a wish',
          'L.3.4',
          [
            N(
              'Many names began as ordinary words. In this story, Atreyu’s name means “Son of All”.',
            ),
            N('In our world, Hazel is a kind of tree, and Rose and Lily are flowers.'),
            N('A name can carry a wish, a place or a family story. Does yours?'),
          ],
          'Learned that many names began as words with meanings, using Atreyu’s name as an example.',
        ),
      ],
      [
        ch('bow', 'Pick up the bow and give it to a hunter to keep.', [
          HU('I’ll keep it for him. He’ll want it when he’s back.', 'soft'),
          N('She says “when”, not “if”. Everyone hears it.'),
        ]),
        ch('quiet', 'Say nothing. It is his moment.', [
          N('You say nothing. The grass says it for you, a long sigh across the whole plain.'),
        ]),
      ],
    ),
    sc(
      'a25-04-saddle',
      [
        N(
          'Atreyu whistles, and a small horse comes trotting out of the grass: brown, shaggy and sure-footed.',
        ),
        N('By the time he arrives, your Nubbin is sitting on his saddle. Nobody saw it climb up.'),
        AR('There is a thing on my back. It is soft, and it has made itself comfortable.'),
        AT('Artax, this is… I don’t know what it is.'),
        AR('Neither do I. It won’t get off. I have asked it twice.', 'think'),
        AT('Will you come too, then? It looks as if you’re coming anyway.'),
      ],
      [
        notice(
          2,
          'science',
          'animals’ senses: a horse’s skin is so sensitive it can feel a fly land',
          '4-LS1-2',
          [
            N('Artax felt your Nubbin on his back without turning round.'),
            N(
              'A horse’s skin is so sensitive that it can feel a fly landing, and twitch to shake it off.',
            ),
            N('Animals have senses we hardly think about. Touch is one of them.'),
          ],
          'Learned that animals’ senses, like a horse’s sense of touch, are very sensitive.',
        ),
      ],
      [
        ch('yes', 'Say, “Yes, if you’ll have us.”', [
          AT('I’ll have anyone. I don’t know where I’m going.', 'happy'),
        ]),
        ch('sorry', 'Apologise to Artax for your Nubbin.', [
          AR(
            'It is light, and it is warm. There are worse things to carry across the world.',
            'soft',
          ),
        ]),
      ],
    ),
    sc(
      'a25-04-complete',
      [
        N(
          'You set out at sunset: a boy, a horse, a traveller, and a Nubbin riding where the boy should be.',
        ),
        N('Atreyu walks beside Artax for the first mile, so as not to disturb it.'),
        N(
          'Up in the attic, Bastian is grinning to himself in the half-dark. He likes Atreyu already, and he would like to be like him.',
        ),
      ],
      [
        ask(
          1,
          'sel',
          'belonging: what people in a community give one another',
          'CASEL: Social awareness',
          [
            N('Atreyu was brought up by the whole camp, and now he sets out for all of them.'),
            N('What do you think people in a community give to one another?'),
          ],
          [
            o('Food, shelter and safety.', [
              N('That’s a fair answer. Those are the first things a community shares.'),
            ]),
            o('Care, and teaching each other things.', [
              N(
                'That’s a fair answer. Atreyu learned to be himself because many people helped him.',
              ),
            ]),
            o('Company, stories and belonging.', [
              N('That’s a fair answer. Knowing you belong somewhere can be the strongest gift.'),
            ]),
          ],
          'Thought about what the people in a community give to one another (a think question).',
        ),
      ],
    ),
  ],
  [
    gl('habitat', 'The natural home of a plant or an animal.', 'a25-04-camp'),
    gl('grazing', 'Eating grass and other low plants, as cows and horses do.', 'a25-04-camp'),
  ],
);

// ================================================================== A25-5 The Swamps of Sadness
const A5: EduQuest = quest(
  'a25-05',
  'The Swamps of Sadness',
  {
    'a25-05-s1': {
      goal: 'Cross the Swamps of Sadness with Atreyu and Artax.',
      hint: 'Keep walking. When you feel like stopping, walk anyway.',
    },
    'a25-05-s2': {
      goal: 'Stay with Atreyu while Artax stops.',
      hint: 'Don’t look away. You don’t have to do anything.',
    },
    'a25-05-s3': {
      goal: 'Sit beside your Nubbin in the reeds until it gets up.',
      hint: 'Sit down next to it and wait. There is no hurry, and nothing to press.',
    },
  },
  [
    sc(
      'a25-05-swamp',
      [
        N(
          'The swamp is grey and still. Dead trees stand in it, and the air is cold and smells of nothing much.',
        ),
        N(
          'Sadness comes up out of the mud like damp. It gets into your boots first, and then into everything.',
        ),
        AT('Don’t listen to it. It’s only the swamp. It isn’t you.'),
        N(
          'AURYN glints on his chest. Atreyu feels the sadness too, but it can’t quite get hold of him.',
        ),
        N('Artax is slowing down. Each step is a little shorter than the last one.'),
        AR('Master. I can’t go on.', 'sad'),
        AT('You can. You have to. Look, there’s higher ground just there.'),
        AR(
          'I know. It doesn’t matter. Nothing matters. I’m sorry. Take the little one off my back.',
          'sad',
        ),
      ],
      [
        notice(
          0,
          'science',
          'a swamp is a wetland habitat, usually full of life',
          '3-LS4-3',
          [
            N('A real swamp is a wetland: ground soaked with water, with trees growing in it.'),
            N('Real swamps are full of life: frogs, herons, fish and dragonflies.'),
            N('This swamp is different. All its colour and life has been taken out.'),
          ],
          'Learned that a swamp is a wetland habitat, and that real swamps are full of life.',
        ),
        ask(
          2,
          'sel',
          'a feeling can pass through us; it is not all of who we are',
          'CASEL: Self-awareness',
          [
            N('Atreyu says the sadness is “only the swamp. It isn’t you.”'),
            N('What might he mean?'),
          ],
          [
            o(
              'A feeling can pass through you, and it is not all of who you are.',
              [N('Yes. Feelings come and go, like weather. You are still you underneath.')],
              true,
            ),
            o('He means you should never feel sad.', [
              N('Feeling sad is allowed. Atreyu isn’t telling anyone not to.'),
              N('He means the sadness is a visitor, and it will not stay.'),
            ]),
            o('He means the swamp is to blame for everything.', [
              N(
                'The swamp is making it stronger. But he is mostly saying that a feeling is not the whole of you.',
              ),
            ]),
          ],
          'Thought about how a feeling can pass through us without being all of who we are.',
        ),
      ],
      [
        ch('head', 'Walk by Artax’s head and talk to him.', [
          N(
            'You talk to him about nothing: grass, and stables, and apples. His ears move once, to listen.',
          ),
        ]),
        ch('hold', 'Hold your Nubbin tight on the saddle.', [
          N('You keep a hand on your Nubbin. It is very cold, and it doesn’t purr.'),
        ]),
      ],
    ),
    sc(
      'a25-05-swamp-done',
      [
        N(
          'You lift your Nubbin down. It is heavy and limp in your hands, as if the sadness has got into it as well.',
        ),
      ],
      [
        notice(
          0,
          'health',
          'strong sadness is felt in the body, and rest and company help',
          'CASEL: Self-awareness',
          [
            N(
              'When we are very sad, our bodies feel it too. Arms and legs can feel heavy, and starting anything is hard.',
            ),
            N('That is normal. It does not mean something is wrong with you.'),
            N(
              'A rest, a drink of water, a hug and someone to sit with can help a heavy body begin to lighten.',
            ),
          ],
          'Learned that strong sadness can make the body feel heavy, and that rest and company help.',
        ),
      ],
    ),
    sc(
      'a25-05-artax',
      [
        N(
          'Artax stands still. The mud comes up over his hooves, very slowly, and he does not pull against it.',
        ),
        N(
          'Atreyu puts both arms round his neck and holds his head, and talks to him quietly. You can’t hear what he says.',
        ),
        AR('Go on without me, and don’t look back. If you stay, it will get you too.', 'soft'),
        AT('I won’t forget you. Not one bit of you. Not ever.', 'sad'),
        N(
          'The swamp closes over Artax, gently. Artax has died. His body has stopped, and it will not start again.',
        ),
        N('Atreyu will remember him. That is how Artax stays.'),
        N(
          'Atreyu stands alone for a long time. When he walks on, he doesn’t look back, because Artax asked him not to.',
        ),
      ],
      [
        ask(
          6,
          'sel',
          'grief: it is allowed to be sad, and some things help',
          'CASEL: Social awareness',
          [
            N('It is very sad when a friend dies, and it is all right to feel that.'),
            N('What do you think can help someone who has lost a friend?'),
          ],
          [
            o('Crying, if they need to.', [
              N(
                'That’s a fair answer. Tears are a way of carrying a big feeling, and they help many people.',
              ),
            ]),
            o('Remembering the friend, and telling stories about them.', [
              N(
                'That’s a fair answer. Atreyu promised not to forget Artax, and remembering keeps a friend close.',
              ),
            ]),
            o('Having someone sit nearby.', [
              N(
                'That’s a fair answer. You don’t always need words. Someone beside you can be enough.',
              ),
            ]),
          ],
          'Thought about what helps when a friend has died (a think question), with plain words and comfort.',
        ),
      ],
    ),
    sc(
      'a25-05-artax-done',
      [
        N(
          'In the red attic, Bastian is crying, and he doesn’t mind. Nobody can see him, and it was Artax.',
        ),
      ],
      [
        ask(
          0,
          'literacy',
          'how readers feel real feelings for characters in a story',
          'RL.3.3',
          [N('Bastian cries for a horse in a book. Why do stories make us feel so much?')],
          [
            o(
              'A good story makes a character feel real, and we care about them.',
              [N('Yes. Crying at a story is a sign that you care. Bastian cares about Artax.')],
              true,
            ),
            o('Because Bastian is being silly.', [
              N(
                'There is nothing silly about it. Readers have wept at stories for as long as there have been stories.',
              ),
              N('It shows how much we can care.'),
            ]),
            o('Because Bastian is tired.', [
              N(
                'He may be tired. But the main reason is that Artax felt real to him, and he loved him.',
              ),
            ]),
          ],
          'Thought about why we can feel real sadness for a character in a story.',
        ),
      ],
    ),
    sc(
      'a25-05-reeds',
      [
        N(
          'A little way on, your Nubbin lies down in the reeds and won’t get up. Its eyes are open, but it isn’t looking at anything.',
        ),
        AT('The swamp got into it. It’s so small.'),
        N(
          'You don’t pick it up and you don’t pull. You sit down in the reeds beside it, close enough that it knows.',
        ),
        N('Atreyu sits down too, on its other side, though he has every reason not to.'),
        N(
          'The reeds rustle. A long time goes by, or a short one; in the swamp it is hard to tell.',
        ),
        N('Then your Nubbin sits up, and leans against your arm, and then gets up on its own.'),
      ],
      [
        ask(
          3,
          'sel',
          'helping someone who is very sad: stay close and wait, without trying to fix it',
          'CASEL: Relationship skills',
          [N('Your Nubbin is very sad and won’t get up.'), N('What helps most?')],
          [
            o(
              'Sit close beside it, and wait kindly.',
              [
                N('Yes. You can’t always fix a sad feeling, but you can stay.'),
                N('Staying close tells someone: you’re not alone.'),
              ],
              true,
            ),
            o('Pull it up quickly.', [
              N(
                'Wanting to fix it is a loving wish. But pulling can frighten someone who is very sad.',
              ),
              N('Staying close and waiting lets them know you’re there.'),
            ]),
            o('Tell it to cheer up.', [
              N(
                'It is kindly meant. But “cheer up” can make someone feel they are doing sadness wrong.',
              ),
              N('Sitting beside them says that all their feelings are welcome.'),
            ]),
          ],
          'Learned that staying close and waiting kindly can help someone who is very sad.',
        ),
      ],
    ),
    sc(
      'a25-05-complete',
      [
        AT('Thank you for waiting. I didn’t know you could just… wait like that.', 'soft'),
        N(
          'You walk on, the two of you, with your Nubbin between you. At the edge of the swamp there is a mountain.',
        ),
        N('It is a strange mountain, smooth and round, with moss on its top. It sneezes.'),
      ],
      [
        ask(
          0,
          'literacy',
          'theme: what a part of a story is really about',
          'RL.4.2',
          [N('What might this part of the story be telling us?')],
          [
            o(
              'Sometimes the best help is staying close, even when you can’t fix things.',
              [
                N(
                  'Yes. That’s the heart of it. Atreyu learned that simply waiting beside someone can be a way to help.',
                ),
              ],
              true,
            ),
            o('Never walk into a swamp.', [
              N(
                'That is good advice in real life! But the story is about something else: how to help someone who is sad.',
              ),
            ]),
            o('Horses are the best friends.', [
              N(
                'Artax was a very good friend. But the story is mostly about what Atreyu learned from waiting with you.',
              ),
            ]),
          ],
          'Found the theme of the swamp quest: staying close can help even when you cannot fix things.',
        ),
      ],
    ),
  ],
  [
    gl('swamp', 'A wet place with soggy ground and trees growing in the water.', 'a25-05-swamp'),
    gl(
      'wetland',
      'Land that is covered with water, or soaked with it, for much of the year.',
      'a25-05-swamp',
    ),
  ],
);

// ================================================================== A25-6 Morla the Aged One
const A6: EduQuest = quest(
  'a25-06',
  'Morla the Aged One',
  {
    'a25-06-s1': {
      goal: 'Climb the strange round mountain at the swamp’s edge.',
      hint: 'Climb up the mossy side. Mind the cave at the front; it breathes.',
    },
    'a25-06-s2': {
      goal: 'Ask Morla about the Empress’s illness.',
      hint: 'Choose how to ask. She will answer, eventually, if only to be left alone.',
    },
  },
  [
    sc(
      'a25-06-shell',
      [
        N(
          'The mountain is warm under your hands. Its slopes are covered in plates, like roof tiles, with moss between.',
        ),
        N(
          'Atreyu climbs up beside you. Halfway up, the whole mountain sneezes, and you both hang on.',
        ),
        AT('It’s alive. The mountain is alive.'),
        N(
          'At the front, a huge old head comes slowly out of a cave in the rock. Its eyes are wet and black and very tired.',
        ),
        MO('Somebody’s there, old one. Somebody small. We heard them.'),
        MO('We don’t care, though. Do we? We don’t care about anything any more.'),
      ],
      [
        notice(
          3,
          'science',
          'a turtle’s or tortoise’s shell is part of its skeleton, and some live over a hundred years',
          '4-LS1-1',
          [
            N(
              'The mountain is a giant turtle’s shell. A real turtle or tortoise can’t step out of its shell like a house.',
            ),
            N('It is part of its skeleton: its ribs and backbone have grown into it.'),
            N(
              'Turtles and tortoises are among the longest-lived animals. Some giant tortoises live well over a hundred years.',
            ),
          ],
          'Learned that a turtle’s or tortoise’s shell is part of its skeleton, and that some giant tortoises live over a hundred years.',
        ),
      ],
    ),
    sc(
      'a25-06-shell-done',
      [
        N(
          'She talks to herself as “we”, and answers herself too. She has had nobody else to talk to for a very long time.',
        ),
      ],
      [
        ask(
          0,
          'sel',
          'loneliness: noticing a lonely person and reaching out kindly',
          'CASEL: Social awareness',
          [
            N(
              'Morla has had nobody to talk to for a very long time. What could you do for a very lonely person?',
            ),
          ],
          [
            o(
              'Say hello, and keep them company for a while.',
              [
                N(
                  'Yes. A little company, and a kind hello, can mean a great deal to someone lonely.',
                ),
              ],
              true,
            ),
            o('Walk past quickly.', [
              N(
                'That can feel easier when we don’t know what to say. But a lonely person often wants most of all to be noticed.',
              ),
              N('Even a small hello helps.'),
            ]),
            o('Tell them to stop talking to themselves.', [
              N(
                'People who are alone a lot often do talk to themselves. It is how they keep company.',
              ),
              N('Kind company works better than a telling-off.'),
            ]),
          ],
          'Thought about how to be kind to someone who is very lonely.',
        ),
      ],
    ),
    sc(
      'a25-06-ask',
      [
        AT('Morla the Aged One. The Empress is ill. Do you know what the cure is?'),
        MO(
          'The Empress. Ill. We knew her when she was young. She was young then too. She is always young.',
        ),
        MO(
          'Old one, shall we tell him? What for? Everything ends. We’ve been old so long we can’t remember not.',
        ),
        N(
          'She sneezes. A wind goes across the swamp, and your Nubbin falls over and gets up again, offended.',
        ),
        MO(
          'We’re all there is of us. Being old is the whole of us. You wouldn’t understand. You’re a boy.',
        ),
        AT('Then help me anyway. You don’t have to care. Just tell me.'),
      ],
      [
        ask(
          1,
          'social-studies',
          'oral history: people who remember long ago can tell us about the past',
          'D2.His.2.3-5',
          [
            N('Morla remembers the Empress from long, long ago.'),
            N(
              'What can we learn from someone who remembers things from a long time ago? What might be lost if nobody asks?',
            ),
          ],
          [
            o('How life used to be, and what has changed.', [
              N(
                'That’s a fair answer. Older people can tell us things no book has, because they were there.',
              ),
            ]),
            o('Stories and old skills that were never written down.', [
              N(
                'That’s a fair answer. Many skills and songs are only passed on by being told and shown.',
              ),
            ]),
            o('Maybe it’s best to ask while we still can.', [
              N(
                'That’s a thoughtful answer. Memories belong to people, and when a person is gone, so is their way of telling it.',
              ),
            ]),
          ],
          'Thought about what we can learn from people who remember the past (a think question).',
        ),
      ],
      [
        ch('sit', 'Sit by her head and say nothing for a while.', [
          MO('Hm. Quiet ones. We like quiet ones. They don’t ask things.', 'soft'),
        ]),
        ch('old', 'Ask her what it is like, being so old.', [
          MO(
            'Long. Long, old one, isn’t it. Like waiting for a sneeze that doesn’t come.',
            'think',
          ),
        ]),
        ch('blessing', 'Say “Bless you” when she sneezes again.', [
          MO(
            'Bless us? Nobody’s said that in ten thousand years. Ha. Old one, it said bless us.',
            'happy',
          ),
        ]),
      ],
    ),
    sc(
      'a25-06-ask-done',
      [
        MO('The Southern Oracle. Uyulala. She might know. We don’t. We don’t mind.'),
        MO(
          'Ten thousand miles away, south. You’d be old as us before you got there. Go and find out yourself.',
        ),
      ],
      [
        ask(
          1,
          'maths',
          'a distance and a speed: 10,000 ÷ 10 = 1,000 days',
          '4.MD.A.2',
          [
            N('The Oracle is ten thousand miles away. Say Atreyu walks 10 miles every day.'),
            N('How many days will the walk take?'),
          ],
          [
            o(
              '1,000 days',
              [
                N('Yes. 10,000 ÷ 10 = 1,000 days.'),
                N('A year has 365 days, so that is nearly three years of walking.'),
              ],
              true,
            ),
            o('100 days', [
              N(
                'In 100 days he would walk 100 × 10 = 1,000 miles. That is only a tenth of the way.',
              ),
              N('For 10,000 miles he needs 1,000 days.'),
            ]),
            o('10,000 days', [
              N(
                'That would be one mile each day. He walks 10 miles a day, so he needs ten times fewer days.',
              ),
              N('10,000 ÷ 10 = 1,000.'),
            ]),
          ],
          'Divided a distance by a daily distance (10,000 ÷ 10 = 1,000 days).',
        ),
      ],
    ),
    sc(
      'a25-06-complete',
      [
        N(
          'Morla draws her head back into her cave. She is already asleep, or near enough not to matter.',
        ),
        AT(
          'Ten thousand miles. That is years of walking, and the Empress hasn’t got years.',
          'sad',
        ),
        AT('So I’ll start walking. That’s all I can do, isn’t it.'),
        N(
          'He doesn’t say it like a hero. He says it the way you might tie a bootlace: plainly, and then getting on with it.',
        ),
      ],
      [
        ask(
          3,
          'literacy',
          'a simile: what comparing two things tells us about a character',
          'L.4.5',
          [
            N('The story says Atreyu spoke “the way you might tie a bootlace”.'),
            N('What does that comparison tell us about him?'),
          ],
          [
            o(
              'He is plain and determined, with no showing off.',
              [
                N(
                  'Yes. Tying a bootlace is ordinary and necessary, with no fuss.',
                ),
                N('A comparison like this, using “like” or “as”, is called a simile.'),
              ],
              true,
            ),
            o('He is talking about boots.', [
              N('Boots are in the comparison, but the story isn’t really about boots.'),
              N(
                'It shows how he speaks: plainly, without fuss. That kind of comparison is a simile.',
              ),
            ]),
            o('He is angry.', [
              N('He is worried, but he doesn’t sound angry. A bootlace is tied calmly.'),
              N('The simile shows he is calm and ready to start.'),
            ]),
          ],
          'Read a simile closely to learn what it shows about a character’s manner.',
        ),
      ],
    ),
  ],
  [
    gl('tortoise', 'A slow, land-living reptile with a hard shell on its back.', 'a25-06-shell'),
    gl('skeleton', 'The bones that hold up and protect an animal’s body.', 'a25-06-shell'),
    gl(
      'oracle',
      'A person or voice in old stories that is asked for answers and advice.',
      'a25-06-ask-done',
    ),
  ],
);

// ================================================================== A25-7 Ygramul the Many
const A7: EduQuest = quest(
  'a25-07',
  'Ygramul the Many',
  {
    'a25-07-s1': {
      goal: 'Cross the Dead Mountains to the great chasm.',
      hint: 'Keep to the stony path. The chasm is where the wind goes quiet.',
    },
    'a25-07-s2': {
      goal: 'Stand with Atreyu while he bargains with Ygramul.',
      hint: 'Stay close. Hold his sleeve when he says the name.',
    },
  },
  [
    sc(
      'a25-07-chasm',
      [
        N(
          'Weeks pass in a few turns of the page. The Dead Mountains are black rock and no birds, and the wind tastes of iron.',
        ),
        N(
          'At the bottom of a deep chasm, stretched from side to side, there is a web. Its threads are as thick as ropes.',
        ),
        N(
          'Caught in the middle is a long white creature with pearly scales, a lion’s mane and the kindest face you have ever seen.',
        ),
        FA(
          'Hello up there! Don’t come any closer. I’m quite stuck. Luckily I’m a luckdragon.',
          'happy',
        ),
        N(
          'Across the web, something stirs. It is not one creature but a cloud of steel-blue insects, moving together.',
        ),
        N(
          'They make a shape: a great face, then a hand, then a face again. Thousands of voices speak at once.',
        ),
        YG('We are Ygramul. We are many. What is it that crawls on our edge?'),
      ],
      [
        notice(
          5,
          'science',
          'insects living in groups work together to survive',
          '3-LS2-1',
          [
            N('Ygramul is a swarm. Real ants and bees do something like it.'),
            N(
              'Each insect is tiny, but a whole colony together can build, find food and keep safe.',
            ),
            N('Many animals live in groups because together they survive better than alone.'),
          ],
          'Learned that animals living in groups, like ants and bees, help each other survive.',
        ),
      ],
    ),
    sc(
      'a25-07-chasm-done',
      [
        N('In the red attic, Bastian gives a small, frightened cry out loud.'),
        N(
          'Ygramul stops, all the thousands of it at once. Atreyu looks up, as if a voice had come out of the sky.',
        ),
      ],
      [
        ask(
          0,
          'sel',
          'it is all right to feel scared by a story',
          'CASEL: Self-awareness',
          [
            N(
              'Bastian cries out because the story frightens him. Is it all right to feel scared when we read?',
            ),
          ],
          [
            o(
              'Yes. The feeling is real, and we can keep going or take a break.',
              [
                N('Yes. A story can give us real feelings. Feeling scared is normal.'),
                N('You can read on with someone beside you, or stop and come back.'),
              ],
              true,
            ),
            o('No. It’s only a story.', [
              N(
                'It is only a story, but your feelings about it are real. That’s what stories can do.',
              ),
            ]),
            o('Only little children feel scared.', [
              N(
                'Everyone feels scared sometimes, including grown-ups and brave hunters like Atreyu.',
              ),
            ]),
          ],
          'Thought about why it is all right to feel scared by a story.',
        ),
      ],
    ),
    sc(
      'a25-07-bargain',
      [
        YG('What was that cry? Nobody cries here but those we have caught.'),
        AT('I wear the Glory. You know what that means. Let the dragon go.'),
        N('The swarm shivers. It knows AURYN, and does not like it, and cannot quite say no.'),
        YG(
          'We cannot harm the Glory. But we will give you something, small hunter, as a gift. You came for the Oracle?',
        ),
        YG('Our sting sends you anywhere you name. After it, you will need a long, long rest.'),
        AT('The Southern Oracle. Then sting me.', 'angry'),
        FA(
          'No, no. Take me too, little hunter. I have been stung already. We’ll go together, and I’ll be lucky for both of us.',
        ),
      ],
      [
        ask(
          3,
          'social-studies',
          'fairness in a bargain: what each side gives and gets',
          'D2.Civ.8.3-5',
          [
            N(
              'Ygramul calls its sting a “gift”. It sends you where you need to go, then leaves you needing a long rest.',
            ),
            N('Is that a fair bargain? What would make a bargain fair?'),
          ],
          [
            o('Fair means both sides know what they give and get.', [
              N('That’s a fair answer. A bargain is fairer when nobody is tricked.'),
            ]),
            o('It isn’t fair: a real gift shouldn’t come with a price.', [
              N(
                'That’s a fair answer. It’s hard to call something a gift when the price is so high.',
              ),
            ]),
            o('It’s fair enough: Atreyu chose, and he knew what would happen.', [
              N('That’s a fair answer. Choosing with open eyes counts for a lot.'),
            ]),
          ],
          'Thought about what makes a bargain fair (a think question).',
        ),
      ],
      [
        ch('sleeve', 'Hold Atreyu’s sleeve tight, and your Nubbin with the other hand.', [
          N('You hold on, and your Nubbin holds on to you. AURYN glints.'),
          AT('The Southern Oracle!'),
        ]),
        ch('falkor', 'Put your hand on Falkor’s mane as well.', [
          FA('That’s it. All hands on the luckdragon.', 'happy'),
          AT('The Southern Oracle!'),
        ]),
      ],
    ),
    sc(
      'a25-07-bargain-done',
      [
        N(
          'There is a jolt, like missing a stair in the dark. Then you are falling through light, all of you together, very fast.',
        ),
        N(
          'It doesn’t hurt. It is more like being sneezed across the world by something very large.',
        ),
      ],
      [
        notice(
          1,
          'science',
          'light is the fastest thing we know; sunlight takes about eight minutes to reach Earth',
          undefined,
          [
            N(
              'Light is the fastest thing we know. Sunlight takes about eight minutes to cross the huge gap between the Sun and Earth.',
            ),
            N('Falling through light is much slower than light itself.'),
          ],
          'Learned that light is the fastest thing we know, and that sunlight takes about eight minutes to reach Earth.',
        ),
      ],
    ),
    sc(
      'a25-07-complete',
      [
        N(
          'You land in soft sand, in a heap: a boy, a luckdragon, a traveller and a Nubbin on top.',
        ),
        N('Atreyu has been counting. It took three weeks of walking to reach the Dead Mountains.'),
        FA(
          'There. Told you. Lucky. Now I think I shall lie very still for a bit, because I feel extremely odd.',
        ),
        N(
          'Atreyu is pale, and his arm is cold where the sting caught him. Falkor’s eyes are closing.',
        ),
        N(
          'Nearby, a thin plume of smoke rises from a little round house with a telescope on the roof.',
        ),
      ],
      [
        ask(
          1,
          'maths',
          'weeks and days: 3 × 7 = 21',
          '3.OA.A.3',
          [
            N('Atreyu says it took three weeks to reach the Dead Mountains.'),
            N('There are 7 days in a week. How many days is that?'),
          ],
          [
            o('21 days', [N('Yes. 3 weeks of 7 days make 3 × 7 = 21 days.')], true),
            o('10 days', [
              N('That is 3 + 7. But each of the three weeks has 7 days in it.'),
              N('3 × 7 = 21.'),
            ]),
            o('14 days', [
              N('That is two weeks: 2 × 7 = 14. We need one more week.'),
              N('3 × 7 = 21.'),
            ]),
          ],
          'Multiplied weeks by 7 to find days (3 × 7 = 21).',
        ),
      ],
    ),
  ],
  [
    gl('chasm', 'A very deep, narrow crack in the ground.', 'a25-07-chasm'),
    gl('swarm', 'A large group of insects moving together.', 'a25-07-chasm'),
  ],
);

// ================================================================== A25-8 Engywook and Urgl
const A8: EduQuest = quest(
  'a25-08',
  'Engywook and Urgl',
  {
    'a25-08-s1': {
      goal: 'Fetch herbs for Urgl’s cure.',
      hint: 'The herbs grow among the rocks: one silver, one bitter, one that smells of rain.',
    },
    'a25-08-s2': {
      goal: 'Listen to Engywook’s theory about the sphinxes.',
      hint: 'Sit by his telescope. Nod in the right places.',
    },
  },
  [
    sc(
      'a25-08-herbs',
      [
        N('Two gnomes come out of the round house, both very small and both talking at once.'),
        UR('Out of the way, Engywook. They’re poisoned. Can’t you see? Some scientist.', 'angry'),
        UR('You. The big one with the soft thing. Can you tell one herb from another?'),
        Y('Mostly.'),
        UR(
          'Mostly will have to do. Silver leaf, bitter root, and the one that smells of rain. Quick.',
        ),
        N(
          'Your Nubbin finds the one that smells of rain first. It brings it back in its mouth, which Urgl allows.',
        ),
      ],
      [
        ask(
          4,
          'science',
          'describing materials by their properties and the senses we use',
          undefined,
          [
            N('Urgl describes her herbs by what they look like, taste like and smell like.'),
            N('Which sense found the herb that smells of rain?'),
          ],
          [
            o(
              'Smell',
              [
                N(
                  'Yes. The nose found it. Plants, like all materials, can be told apart by their properties.',
                ),
              ],
              true,
            ),
            o('Hearing', [
              N(
                'Ears are very useful, but herbs are quiet. A herb that “smells of rain” is found by the nose.',
              ),
            ]),
            o('Taste', [
              N(
                'The bitter root might have a bitter taste. But never taste a plant unless a grown-up who knows says it is safe.',
              ),
              N('This herb was found by smell.'),
            ]),
          ],
          'Used properties and the senses to tell materials apart, and learned never to taste unknown plants.',
        ),
      ],
      [
        ch('quick', 'Run for the herbs.', [
          UR(
            'Good. Now the kettle. No, the other kettle. Engywook, that one has your socks in it.',
          ),
        ]),
        ch('careful', 'Pick them carefully, roots and all.', [
          UR('Roots and all. Somebody brought you up properly.', 'soft'),
        ]),
      ],
    ),
    sc(
      'a25-08-herbs-done',
      [
        N(
          'Urgl brews all night. By morning Atreyu’s arm is warm again, and Falkor is asking what there is for breakfast.',
        ),
        FA('I feel tremendous. Lucky, lucky. Is there soup?', 'happy'),
      ],
      [
        ask(
          1,
          'literacy',
          'working out a word’s meaning from how it is used, including words with more than one meaning',
          'L.3.4',
          [N('Falkor says he feels “tremendous”. Which word means almost the same thing here?')],
          [
            o(
              'Wonderful',
              [
                N('Yes. Here “tremendous” means very good indeed.'),
                N(
                  'It can also mean “enormous”, as in a tremendous crash. A word can mean more than one thing.',
                ),
              ],
              true,
            ),
            o('Tiny', [
              N('Falkor isn’t feeling tiny. He is hungry for soup and full of energy.'),
              N('“Tremendous” means great, here.'),
            ]),
            o('Terrible', [
              N('He was ill, but he has been cured. He is asking for soup, so he feels good.'),
              N('“Tremendous” means wonderful here.'),
            ]),
          ],
          'Worked out the meaning of “tremendous” from how Falkor uses it.',
        ),
      ],
    ),
    sc(
      'a25-08-theory',
      [
        EN(
          'Now. The gates. I have studied them my entire life. Nobody alive knows more about them than I do.',
        ),
        EN(
          'The first gate has two sphinxes. If they open their eyes on you, you freeze. For ever.',
        ),
        EN(
          'Most people they freeze. A few they let through. Why? Nobody knows! Except, very nearly, me.',
        ),
        UR('He has never been through himself.'),
        EN(
          'A scientist doesn’t need to go through. A scientist watches. My theory is nearly finished.',
          'angry',
        ),
        EN('It’s to do with the weather. Or the alphabet. Or the moon. Possibly all three.'),
        EN(
          'My tally. Windy days: five. Calm days: three. Days Urgl wouldn’t let me out: all the rest.',
        ),
      ],
      [
        ask(
          6,
          'maths',
          'reading a tally chart and finding a difference',
          '3.MD.B.3',
          [
            N('Engywook has been tallying the weather on the days he watched the gate.'),
            N('Windy days: 5. Calm days: 3. How many more windy days were there than calm days?'),
          ],
          [
            o('2 more', [N('Yes. 5 − 3 = 2. A tally lets you compare at a glance.')], true),
            o('8 more', [
              N('8 is how many days there were altogether: 5 + 3.'),
              N('To find how many more, take away: 5 − 3 = 2.'),
            ]),
            o('3 more', [
              N('3 is the number of calm days. We want the difference between windy and calm.'),
              N('5 − 3 = 2.'),
            ]),
          ],
          'Read a tally of windy and calm days and found the difference (5 − 3 = 2).',
        ),
      ],
      [
        ch('right', 'Tell him it sounds very likely.', [
          EN('You see, Urgl? Science! Somebody appreciates it.', 'happy'),
          UR('Somebody’s being polite.'),
        ]),
        ch('gone', 'Ask why he has never gone through.', [
          EN('Because then I’d know, wouldn’t I. And then what would I study?', 'think'),
        ]),
      ],
    ),
    sc(
      'a25-08-complete',
      [
        UR('There. Cured, fed and lectured. Go on, then, if you’re going.'),
        EN('Watch the sphinxes. Note which way the wind blows. Report back. If you’re not frozen.'),
        N(
          'Urgl packs you bread for the road, and a bottle of cure, in case of more swarms. She fusses Falkor’s mane straight.',
        ),
      ],
      [
        ask(
          1,
          'sel',
          'choosing between wondering and finding out',
          'CASEL: Responsible decision-making',
          [
            N('Engywook has studied the gates all his life, but he never goes through.'),
            N('Is it better to keep wondering, or to find out? What do you think?'),
          ],
          [
            o('Find out. Wondering is better when you answer it.', [
              N(
                'That’s a fair answer. Finding out is how we learn, even when it is a little scary.',
              ),
            ]),
            o('Keep wondering. Not knowing can be a pleasure.', [
              N(
                'That’s a fair answer. Wondering can be a joy. But Engywook might miss something wonderful.',
              ),
            ]),
            o('It depends on what it is.', [
              N(
                'That’s a wise answer. Some things are best discovered, and some are best left for later.',
              ),
            ]),
          ],
          'Thought about whether to keep wondering or to find out (a think question).',
        ),
      ],
    ),
  ],
  [
    gl('herb', 'A plant used to flavour food or to make medicine.', 'a25-08-herbs'),
    gl('theory', 'An idea that tries to explain something and has to be tested.', 'a25-08-theory'),
  ],
);

// ================================================================== A25-9 The Three Gates
const A9: EduQuest = quest(
  'a25-09',
  'The Three Gates',
  {
    'a25-09-s1': {
      goal: 'Watch Atreyu pass the Great Riddle Gate.',
      hint: 'You stay on the near side. Don’t meet the sphinxes’ eyes.',
    },
    'a25-09-s2': {
      goal: 'Look into the Magic Mirror Gate.',
      hint: 'Stand in front of it. It shows what you really are, not what you look like.',
    },
    'a25-09-s3': {
      goal: 'Wait at the No-Key Gate until it opens.',
      hint: 'It only opens for someone who doesn’t want to go in. Sit down, and stop wanting.',
    },
  },
  [
    sc(
      'a25-09-sphinx',
      [
        N(
          'Two enormous sphinxes face each other across a gap in the rocks, eyes shut. Between them stand frozen travellers, still as statues.',
        ),
        EN('Remember the wind! Note the wind!', 'shock'),
        N(
          'Atreyu walks forward. Halfway between them, the sphinxes open their eyes and look right at him.',
        ),
        N(
          'He doesn’t freeze. He walks on, through, and out the other side, and stands there blinking.',
        ),
        AT('They looked at me. They just looked.'),
        EN('Which way was the wind? Oh, there wasn’t any. That ruins everything.', 'sad'),
      ],
      [
        notice(
          0,
          'social-studies',
          'sphinxes in ancient Egyptian and Greek stories',
          'D2.His.2.3-5',
          [
            N('A note in Nova’s writing appears. “Sphinxes come from real stories.”'),
            N(
              '“In ancient Egypt, a sphinx was a stone guardian with a lion’s body and a human head.”',
            ),
            N('“The Great Sphinx at Giza is about 4,500 years old.”'),
            N(
              '“In ancient Greek stories, a sphinx set riddles for travellers, and only those who answered could pass.”',
            ),
          ],
          'Learned how sphinxes appear in ancient Egyptian and Greek stories.',
        ),
      ],
      [
        ch('follow', 'Follow while their eyes are still on him.', [
          N(
            'You walk through in his shadow, with your Nubbin tucked under your coat. The sphinxes don’t look round: you were never theirs to ask.',
          ),
        ]),
        ch('engywook', 'Tell Engywook it was nothing to do with the wind.', [
          EN('Then I start again. Good. I was getting bored.', 'happy'),
          N('Then you walk through in Atreyu’s shadow, and nobody looks at you at all.'),
        ]),
      ],
    ),
    sc(
      'a25-09-sphinx-done',
      [
        N(
          'On the far side, a smooth wall of silver stands across the path, like a still lake set on its edge.',
        ),
      ],
      [
        notice(
          0,
          'science',
          'a smooth shiny surface reflects light, so we see a picture of ourselves',
          '4-PS3-2',
          [
            N(
              'A smooth, shiny surface, like a mirror or still water, bounces light straight back, so you see a picture of yourself.',
            ),
            N(
              'A rough surface scatters light every which way, so it can’t show you a picture at all.',
            ),
          ],
          'Learned that a smooth, shiny surface reflects light and shows an image.',
        ),
      ],
    ),
    sc(
      'a25-09-mirror',
      [
        N(
          'The Magic Mirror Gate shows you what you really are, and most people run from it. Atreyu stands still.',
        ),
        N(
          'In the silver there is no green boy at all. There is a round boy, wrapped in a grey blanket, reading in an attic.',
        ),
        AT('Who is that?', 'shock'),
        N(
          'You look too. In your own part of the mirror, you see the same thing: the round boy, the blanket, the gym mats.',
        ),
        N('Your Nubbin sees a round boy as well, and waves at him.'),
        N(
          'Up in the attic, Bastian has stopped reading. He is staring at the page where he has just been described.',
        ),
        BA('That’s me. That’s me in there. It can’t be.', 'shock'),
        N(
          'Atreyu walks into the picture of the boy, as if into water, and comes out the other side.',
        ),
      ],
      [
        ask(
          4,
          'sel',
          'seeing a person with kindness: worth liking as they are',
          'CASEL: Social awareness',
          [
            N(
              'The mirror shows Bastian as he is: a round boy in a blanket, reading in the half-dark.',
            ),
            N('How would a good friend see that boy?'),
          ],
          [
            o(
              'As a real person worth liking: someone who loves stories and cares.',
              [
                N(
                  'Yes. Bastian loves stories, and he cried for Artax. He cares a great deal.',
                ),
                N('How a person looks never tells you how much they are worth.'),
              ],
              true,
            ),
            o('As someone to feel embarrassed about.', [
              N(
                'There is nothing about him to be embarrassed about. Being round, or in a blanket, or reading, is just who he is.',
              ),
              N('A good friend sees the person.'),
            ]),
            o('As nobody special.', [
              N('Atreyu stopped and stared at him, and so did you. He is somebody.'),
            ]),
          ],
          'Thought about seeing a person with kindness, as worth liking just as they are.',
        ),
      ],
    ),
    sc(
      'a25-09-mirror-done',
      [
        N(
          'On the far side, you take out your notebook and write: “Round boy, blanket, attic. Saw him.”',
        ),
        N('You don’t know why. It seems like the sort of thing somebody ought to write down.'),
      ],
      [
        ask(
          1,
          'literacy',
          'choosing the details that describe a person or place well',
          'RL.4.3',
          [
            N('A good note picks out the details that matter.'),
            N('Which note tells you most about what you saw?'),
          ],
          [
            o('“A boy.”', [N('That is true, but it could be anybody. A good note gives details.')]),
            o(
              '“Round boy, grey blanket, gym mats, attic, reading.”',
              [N('Yes. Each detail helps you picture exactly what was there.')],
              true,
            ),
            o('“Sad.”', [
              N(
                'That tells us a feeling, but not who or where. Details help us picture the scene.',
              ),
            ]),
          ],
          'Chose the note that gives the best details about a character and place.',
        ),
      ],
    ),
    sc(
      'a25-09-nokey',
      [
        N(
          'The third gate is a plain door in a plain wall. It has no handle, no lock and no keyhole.',
        ),
        AT('It opens only for someone who doesn’t want to go in. How can I not want to?', 'angry'),
        N('He pushes it, and thumps it, and sits down with his back to it, furious.'),
        N('Your Nubbin, who has no opinions about doors at all, leans on it and yawns.'),
        AT('Fine. Fine. I don’t care. Let it stay shut.'),
        N(
          'He means it, for one second. The door swings quietly open, and your Nubbin falls inside.',
        ),
      ],
      [
        ask(
          4,
          'sel',
          'letting go of trying too hard',
          'CASEL: Self-management',
          [
            N('The door opens when Atreyu stops forcing it, even for a second.'),
            N('Have you ever found something got easier when you stopped trying so hard?'),
          ],
          [
            o('Yes, that has happened to me.', [
              N(
                'That’s a fair answer. Sometimes stopping, breathing and letting go helps more than pushing.',
              ),
            ]),
            o('No, trying harder always works for me.', [
              N(
                'That’s a fair answer. Trying hard is a good thing. And now and then, a rest helps too.',
              ),
            ]),
            o('I’m not sure. I’ll watch for it.', [
              N('That’s a thoughtful answer. Noticing when a rest helps is a good skill.'),
            ]),
          ],
          'Thought about whether things sometimes get easier when we stop trying so hard (a think question).',
        ),
      ],
    ),
    sc(
      'a25-09-complete',
      [
        N(
          'Beyond the last gate there is a palace of silver columns, open to the sky, and no one in it.',
        ),
        N('The columns stand in three long rows, with eight in each row.'),
        N(
          'There is only a voice, a long way off and very close by, singing, but in a way that is almost talking.',
        ),
        AT('The Oracle. We made it.', 'happy'),
        N(
          'In the attic, Bastian has pulled the blanket over his head. He isn’t sure he wants to be in a book that knows him.',
        ),
      ],
      [
        ask(
          1,
          'maths',
          'arrays: 3 rows of 8 make 24',
          '3.OA.A.1',
          [
            N(
              'There are three rows of columns, with eight in each row. How many columns are there?',
            ),
          ],
          [
            o('24 columns', [N('Yes. 3 rows of 8 make 3 × 8 = 24 columns.')], true),
            o('11 columns', [
              N('That is 3 + 8. But there are 8 columns in each of the 3 rows.'),
              N('3 × 8 = 24.'),
            ]),
            o('16 columns', [
              N('That is two rows of 8. There is a third row too.'),
              N('3 × 8 = 24.'),
            ]),
          ],
          'Counted an array of 3 rows of 8 and multiplied (3 × 8 = 24).',
        ),
      ],
    ),
  ],
  [
    gl(
      'sphinx',
      'A creature from old stories with a lion’s body and a human head.',
      'a25-09-sphinx',
    ),
    gl(
      'symmetry',
      'When one half of a shape is a mirror picture of the other half.',
      'a25-09-mirror',
    ),
  ],
);

// ================================================================== A25-10 Uyulala
const A10: EduQuest = quest(
  'a25-10',
  'Uyulala',
  {
    'a25-10-s1': {
      goal: 'Find the voice in the silver palace.',
      hint: 'Follow the singing between the columns. It is nearest where it seems furthest away.',
    },
    'a25-10-s2': {
      goal: 'Help Atreyu ask his question in rhyme.',
      hint: 'Pick the answer that rhymes. A wrong one costs nothing; she just waits.',
    },
  },
  [
    sc(
      'a25-10-voice',
      [
        N(
          'There is nobody in the palace. Only the voice, moving between the columns like a breeze that has learned to sing.',
        ),
        AT('Uyulala? I’ve come from the Empress. She’s ill. I need to ask you why.'),
        N('Nothing answers. The voice goes on singing, to itself, about the colour of the sky.'),
        AT('Why won’t she talk to me?', 'angry'),
        N(
          'Your Nubbin cocks its head. Then it hums two notes, a high one and a low one that matches it, like a rhyme.',
        ),
        UY('Who sings to me in matching sound? Speak in pairs, and I’ll be found.', 'soft'),
        AT('Rhyme. You have to rhyme. Of course you do.'),
      ],
      [
        notice(
          4,
          'science',
          'pitch: fast vibrations make high sounds and slow vibrations make low sounds',
          '4-PS3-2',
          [
            N('Your Nubbin hummed a high note and a low note. What is the difference?'),
            N(
              'Sound is made by vibrations. Fast vibrations make a high sound, and slow ones make a low sound.',
            ),
            N(
              'A short, tight guitar string shakes fast and sounds high. A long, loose one shakes slowly and sounds low.',
            ),
          ],
          'Learned that fast vibrations make high sounds and slow vibrations make low sounds.',
        ),
      ],
    ),
    sc(
      'a25-10-voice-done',
      [
        N('Atreyu clears his throat and has a go on his own.'),
        AT('O Voice, who sings so very high! I have a question. It is: why?'),
        N('The voice sings on as if nobody had spoken. Your Nubbin covers its face with both hands.'),
        AT('It rhymed. I checked. It just wasn’t any good.', 'think'),
        N('He looks at you hopefully.'),
      ],
      [
        ask(
          4,
          'sel',
          'asking for help: saying what you need',
          'CASEL: Relationship skills',
          [
            N('Atreyu isn’t good at rhyming, and he looks at you for help.'),
            N('What can someone say when they need a hand?'),
          ],
          [
            o(
              '“I’m not good at this. Can you help me?”',
              [
                N('Yes. Saying what you need, plainly and kindly, is a real skill.'),
                N('It isn’t giving up. It’s how friends work together.'),
              ],
              true,
            ),
            o('Nothing, and hope somebody notices.', [
              N(
                'Sometimes friends do notice. But it’s much easier for them when you say it out loud.',
              ),
            ]),
            o('“It’s not fair, you do it.”', [
              N('That sounds like frustration, and frustration is allowed.'),
              N('Asking nicely, “Can you help me?”, makes it easier for a friend to say yes.'),
            ]),
          ],
          'Practised asking for help in a clear and kind way.',
        ),
      ],
    ),
    sc(
      'a25-10-rhyme',
      [
        AT(
          'The Empress is ill and the land’s going grey. Please tell us the cure, and we’ll be on our way.',
        ),
        UY(
          'She needs a new name, for the old one wore thin. She fades like a lantern with no flame within.',
        ),
        AT(
          'A name? Then who gives it? Just tell me his name, and I’ll fetch him myself, by whatever road he came.',
        ),
        UY(
          'No child of this country can name her anew. It must be a child from outside. Not you.',
          'sad',
        ),
        UY(
          'A child of the humans, from over the rim. It’s years since one came. We are waiting for him.',
        ),
        N('Atreyu turns to you. His face lights up all at once.'),
        AT('You. You’re from outside. You came in through a page!', 'happy'),
      ],
      [
        ask(
          1,
          'literacy',
          'rhyme: words that end with the same sound',
          undefined,
          [
            N('Atreyu’s first two lines end in “grey” and “way”.'),
            N('Which of these words also rhymes with “grey”?'),
          ],
          [
            o('Day', [N('Yes. Grey, way and day all end in the same “ay” sound.')], true),
            o('Grass', [
              N('“Grass” starts with a similar sound, but it ends differently.'),
              N('Rhymes match at the end: grey, way, day.'),
            ]),
            o('Gate', [
              N('“Gate” has an “ay” sound in the middle but ends with a “t”.'),
              N('A rhyme matches at the end: grey, way, day.'),
            ]),
          ],
          'Found a word that rhymes with “grey” by matching the ending sound.',
        ),
        ask(
          6,
          'sel',
          'telling a friend kindly that you can’t do what they hope',
          'CASEL: Social awareness',
          [
            N('Atreyu hopes that you can give the Empress her name.'),
            N('What if you can’t? How would you tell a friend that, kindly?'),
          ],
          [
            o('Say it plainly and gently, and say what you can do instead.', [
              N(
                'That’s a fair answer. Being clear and kind together is hard, and a good thing to practise.',
              ),
            ]),
            o('Try anyway, in case it works.', [
              N(
                'That’s a fair answer. Wanting to help is a warm feeling. But a false hope can hurt more later.',
              ),
            ]),
            o('Ask the voice what she thinks first.', [
              N('That’s a fair answer. Asking for more information before you answer can be wise.'),
            ]),
          ],
          'Thought about how to tell a friend kindly that you cannot do what they hope (a think question).',
        ),
      ],
      [
        ch(
          'rhyme',
          'Answer in rhyme: “I came by a page and I’m only a guest. Is that the same as the child you’d like best?”',
          [
            UY(
              'You came through a page, as did all of us here. A guest cannot give it. The giver is near.',
              'soft',
            ),
            N('Atreyu’s face falls. He nods slowly, as if he had known.'),
          ],
        ),
        ch('prose', 'Just ask her, in plain words.', [
          N(
            'The voice goes on singing about the sky. It isn’t being rude; it simply can’t hear plain words.',
          ),
          AT('In rhyme. Try in rhyme.'),
        ]),
      ],
    ),
    sc(
      'a25-10-rhyme-done',
      [
        UY(
          'The Nothing has come to the edge of my hall. I’ll go when it reaches me. That isn’t all.',
          'soft',
        ),
        UY(
          'I’m only a song, and a song can be sung again. Find him. And when he comes, tell him: begin.',
        ),
      ],
      [
        ask(
          1,
          'literacy',
          'a metaphor: calling something by another thing’s name to say how it is',
          'L.4.5',
          [N('Uyulala says she is “only a song”.'), N('What might she mean?')],
          [
            o(
              'She may fade away, but what she gave can be taken up again by someone else.',
              [
                N('Yes. A song can be sung again by anyone who remembers it.'),
                N('Calling herself a song is a metaphor: she isn’t a song, but she is like one.'),
              ],
              true,
            ),
            o('She is really made of music.', [
              N(
                'In this story, she might be! But she is also using a picture to say something about herself.',
              ),
              N('A metaphor says one thing is another to show how it is.'),
            ]),
            o('She likes to sing.', [
              N(
                'She certainly does. But “only a song” says something deeper: songs can be sung again.',
              ),
            ]),
          ],
          'Read a metaphor (“I’m only a song”) and worked out what it says about the speaker.',
        ),
      ],
    ),
    sc(
      'a25-10-complete',
      [
        N('The singing grows quiet, and then it stops. The columns stand in silence.'),
        AT('A human child. From outside. Then I’ll go to the border and find one.', 'think'),
        AT('Fantastica has no border. Everyone says so. Well, I’ll find it anyway.'),
        N(
          'In the attic, Bastian has gone very quiet. He looks at his own hands, holding the book.',
        ),
      ],
      [
        notice(
          2,
          'social-studies',
          'a border is a line between two lands; some follow rivers or mountains',
          'D2.Geo.2.3-5',
          [
            N('A border is an agreed line between two countries or lands.'),
            N('Some borders follow a river or a mountain range. Others are lines drawn on a map.'),
            N('Most real countries have one. Fantastica is a land with no border at all.'),
          ],
          'Learned what a border is and that some borders follow rivers or mountains.',
        ),
      ],
    ),
  ],
  [
    gl(
      'metaphor',
      'A way of describing something by saying it is something else.',
      'a25-10-rhyme-done',
    ),
  ],
);

// ================================================================== A25-11 The Wind Giants
const A11: EduQuest = quest(
  'a25-11',
  'The Wind Giants',
  {
    'a25-11-s1': {
      goal: 'Fly for the border on Falkor’s back.',
      hint: 'Climb up behind Atreyu. Your Nubbin goes in the fur behind Falkor’s ears.',
    },
    'a25-11-s2': {
      goal: 'Hold on through the storm of the four winds.',
      hint: 'Keep low in Falkor’s fur. You can’t catch Atreyu, so don’t try.',
    },
    'a25-11-s3': {
      goal: 'Search the sea with Falkor.',
      hint: 'Watch the water for anything gold or anyone green. Falkor won’t stop, so neither will you.',
    },
  },
  [
    sc(
      'a25-11-flight',
      [
        N(
          'Falkor flies the way water runs downhill: easily, as if the sky had been waiting for him.',
        ),
        N(
          'Your Nubbin rides in the long white fur behind his ears, where the wind can’t get at it, and sings.',
        ),
        FA(
          'There is no border. Everybody knows that. So we’ll fly until we find it. That’s how luck works.',
          'happy',
        ),
        AT('Is it?'),
        FA('Oh yes. You never find anything lucky by looking where it ought to be.'),
        N(
          'Below you the land goes by: forests, and seas, and here and there a blank place where something used to be.',
        ),
      ],
      [
        notice(
          0,
          'science',
          'flight: lift and gravity are forces that push in opposite directions',
          '3-PS2-1',
          [
            N('A flying thing is pushed two ways. Gravity pulls it down, and lift pushes it up.'),
            N('A wing pushes air downwards as it moves, and the air pushes the wing up.'),
            N(
              'When lift is bigger than gravity, the flyer rises. When they are equal, it flies along level.',
            ),
          ],
          'Learned that flight is a balance of forces: lift pushes up and gravity pulls down.',
        ),
      ],
    ),
    sc(
      'a25-11-flight-done',
      [
        N(
          'Then the sky turns dark ahead, and the wind changes, and changes again, from four sides at once.',
        ),
      ],
      [
        ask(
          0,
          'social-studies',
          'compass directions: winds are named for where they come from',
          'D2.Geo.2.3-5',
          [
            N(
              'A wind is named for the direction it comes from. A north wind blows from the north.',
            ),
            N('Which way does a north wind push you?'),
          ],
          [
            o(
              'South',
              [N('Yes. A north wind comes from the north, so it pushes you towards the south.')],
              true,
            ),
            o('North', [
              N('That is where the wind comes from. It blows away from there.'),
              N('A north wind pushes you towards the south.'),
            ]),
            o('East', [
              N('That would be a west wind, which comes from the west.'),
              N('A north wind pushes you south.'),
            ]),
          ],
          'Learned that winds are named for where they come from, and which way each one pushes.',
        ),
      ],
    ),
    sc(
      'a25-11-storm',
      [
        N(
          'Four Wind Giants are fighting in the sky: one from each corner of the world, huge and grey and made of weather.',
        ),
        N(
          'They don’t notice you. They’re too busy shoving each other, as they have been since the world began.',
        ),
        FA('Hold on! Hold on to anything! Hold on to each other!', 'shock'),
        N('The storm turns Falkor over. You hold on to his fur, and your Nubbin holds on to you.'),
        N(
          'Atreyu doesn’t. One moment he is there, and the next he is a small dark shape falling towards the sea.',
        ),
        N('Something gold drops after him, catches the light once, and is gone.'),
      ],
      [
        ask(
          2,
          'sel',
          'staying steady when something scary is happening: breathe and hold on to something safe',
          'CASEL: Self-management',
          [N('When something scary is happening, what can help your body stay steady?')],
          [
            o(
              'Take a slow breath, and hold on to something or someone safe.',
              [
                N(
                  'Yes. A slow breath tells your body it can calm down, and holding on helps you feel steady.',
                ),
                N('That is just what Falkor is telling you to do.'),
              ],
              true,
            ),
            o('Hold your breath tight.', [
              N('That can make your heart pound faster. A slow breath out is better.'),
              N('Slow breaths and a safe hold help us feel steadier.'),
            ]),
            o('Close your eyes and wish it away.', [
              N(
                'Closing your eyes can feel safe for a moment. But a slow breath and a firm hold help your body more.',
              ),
            ]),
          ],
          'Practised a calming skill for scary moments: a slow breath and holding on to something safe.',
        ),
      ],
    ),
    sc(
      'a25-11-storm-done',
      [
        N(
          'The Wind Giants blow away over the horizon, still quarrelling. They never knew you were there.',
        ),
      ],
      [
        ask(
          0,
          'literacy',
          'personification: describing weather as if it were alive',
          'L.4.5',
          [
            N('The storm is described as four giants shoving one another.'),
            N('Why might an author describe wind that way?'),
          ],
          [
            o(
              'It makes the weather feel alive, so we can picture it.',
              [
                N('Yes. Giving the wind a personality helps us see and feel the storm.'),
                N('Writing that treats weather like a person is called personification.'),
              ],
              true,
            ),
            o('Because wind really is made of giants.', [
              N('In this story, it might be! But in our world wind is moving air.'),
              N('The author gives it a personality so that we can picture it.'),
            ]),
            o('No reason.', [
              N(
                'Authors choose their pictures carefully. Giants shoving each other show how rough the storm is.',
              ),
            ]),
          ],
          'Learned that personification describes weather or things as if alive, and why authors use it.',
        ),
      ],
    ),
    sc(
      'a25-11-search',
      [
        N(
          'The sea is huge and grey, and goes on in every direction. Falkor flies low over it, back and forth.',
        ),
        FA(
          'He’ll be somewhere. People always are. Luck is just not giving up for longer than the bad luck lasts.',
        ),
        N(
          'He says it brightly. But he doesn’t stop to rest, not once, and you notice he isn’t singing any more.',
        ),
        N('Your Nubbin leans out over his ear, as far as it dares, and stares at the waves.'),
        FA(
          'He’s small and green and stubborn. That’s easy to spot. That’s practically lucky already.',
        ),
        N(
          'The sun goes down behind you. The sea turns from grey to black, and still there is nothing in it.',
        ),
      ],
      [
        ask(
          1,
          'sel',
          'perseverance: what it means to keep trying, and when it works',
          'CASEL: Self-management',
          [
            N('Falkor says luck is not giving up for longer than the bad luck lasts.'),
            N('Do you think he is right? Does not giving up always work?'),
          ],
          [
            o('Yes. Keep trying and you’ll get there.', [
              N('That’s a fair answer. Many good things come to those who keep going.'),
            ]),
            o('Not always, but it gives you the best chance.', [
              N(
                'That’s a wise answer. Not giving up can’t promise success, but quitting rules it out.',
              ),
            ]),
            o('Sometimes it’s better to rest and try another way.', [
              N(
                'That’s a wise answer. Even a luckdragon gets tired. Resting can be part of not giving up.',
              ),
            ]),
          ],
          'Thought about perseverance and whether not giving up always works (a think question).',
        ),
      ],
      [
        ch('look', 'Lean down and watch the water.', [
          N(
            'You watch until your eyes ache. Your Nubbin watches with you, pointing at every wave that looks like anything.',
          ),
        ]),
        ch('sing', 'Ask Falkor to sing, so it isn’t so quiet.', [
          FA(
            'Sing? Yes. Yes, why not. Luckdragons ought to sing. It helps the luck find us.',
            'soft',
          ),
        ]),
      ],
    ),
    sc(
      'a25-11-complete',
      [
        N('Night falls on the sea. Falkor keeps flying.'),
        N('The sun set at seven in the evening. It will not rise again until five in the morning.'),
        N(
          'Far off, on a dark shore, a boy without an amulet is waking up alone, in a ruined city.',
        ),
        N(
          'In the attic, Bastian has lit his candle. It throws his shadow up the sloping roof, very big.',
        ),
      ],
      [
        ask(
          1,
          'maths',
          'time intervals: from 7 in the evening to 5 in the morning is 10 hours',
          '3.MD.A.1',
          [
            N('The sun sets at seven in the evening and rises at five in the morning.'),
            N('How many hours of night will Falkor fly?'),
          ],
          [
            o(
              '10 hours',
              [
                N(
                  'Yes. From 7 to midnight is 5 hours, and from midnight to 5 is 5 more. That makes 10 hours.',
                ),
              ],
              true,
            ),
            o('12 hours', [
              N('That would be seven in the evening to seven in the morning. We stop at five.'),
              N('5 hours to midnight plus 5 hours after is 10.'),
            ]),
            o('2 hours', [
              N(
                'That is the gap between 7 and 5 on the clock face. But night runs past midnight.',
              ),
              N('From 7 in the evening to 5 in the morning is 10 hours.'),
            ]),
          ],
          'Worked out a time interval across midnight: 7 in the evening to 5 in the morning is 10 hours.',
        ),
      ],
    ),
  ],
  [
    gl('lift', 'The upward push that keeps a wing, a bird or a plane in the air.', 'a25-11-flight'),
    gl(
      'horizon',
      'The line in the distance where the sky meets the land or the sea.',
      'a25-11-storm-done',
    ),
  ],
);

// ================================================================== A25-12 Spook City
const A12: EduQuest = quest(
  'a25-12',
  'Spook City',
  {
    'a25-12-s1': {
      goal: 'Help Falkor find the amulet in the sea.',
      hint: 'Watch for the gold glint under the waves, then hold on while he dives.',
    },
    'a25-12-s2': {
      goal: 'Listen from the ruined wall while Atreyu faces Gmork.',
      hint: 'Stay hidden on the wall with Falkor. Don’t go down till it is over.',
    },
    'a25-12-s3': {
      goal: 'Pull Atreyu free with Falkor.',
      hint: 'Get down into the courtyard. Falkor holds the jaws; you pull.',
    },
  },
  [
    sc(
      'a25-12-dive',
      [
        N('At dawn, a long way out, something winks under the water. Gold, the size of a palm.'),
        FA(
          'There! I knew it. Didn’t I say? Hold on tight, and shut your mouth. Seawater’s horrid.',
        ),
        N(
          'He folds himself up and dives. The sea goes green and cold all round you for one long breath.',
        ),
        N(
          'When you come up, Falkor has the amulet in his mouth, very gently, like a dog with an egg.',
        ),
        FA('Mmf. Now for the boy. The Glory knows where its bearer is. Can you feel it pull?'),
        N('You can. The amulet tugs, ever so slightly, towards a dark shore and a broken skyline.'),
      ],
      [
        ask(
          3,
          'science',
          'sinking and floating depend on a material’s properties: gold is dense and sinks',
          undefined,
          [
            N('The amulet is made of gold, and it sank. Gold is very heavy for its size.'),
            N('Which of these would sink in the sea: a cork, a gold ring or a wooden spoon?'),
          ],
          [
            o(
              'A gold ring',
              [
                N('Yes. Gold is much heavier than the same amount of water, so it sinks.'),
                N('Cork and wood are lighter than water, so they float.'),
              ],
              true,
            ),
            o('A cork', [
              N('A cork is very light for its size, and it floats on water.'),
              N('The gold ring is the one that sinks.'),
            ]),
            o('A wooden spoon', [
              N('Most wood is lighter than water, so a wooden spoon floats.'),
              N('Gold is heavier, so the gold ring sinks.'),
            ]),
          ],
          'Learned that heavy, dense materials like gold sink, while cork and wood float.',
        ),
      ],
    ),
    sc(
      'a25-12-gmork',
      [
        N(
          'Spook City is all broken towers and empty windows. In a courtyard, chained to the wall, lies a great grey wolf.',
        ),
        N(
          'He is very thin. He has been chained there a long time, and Atreyu is sitting just out of his reach.',
        ),
        GM('You want to know what the Nothing is, boy? I serve the power behind it. I know.'),
        GM(
          'When you Fantasticans jump into the Nothing, you don’t vanish. You cross to the humans, and there you become lies.',
        ),
        GM(
          'Little fears. Bad ideas. Reasons not to hope. The humans stop believing anything can be different, and the Nothing grows.',
        ),
        GM(
          'I was sent to find the one hunter who might stop it. Some green boy. I never found him.',
        ),
        AT('I’m Atreyu.', 'angry'),
        N(
          'The wolf goes very still. Then he begins to laugh, a long, dry laugh that goes on and on.',
        ),
      ],
      [
        ask(
          4,
          'sel',
          'weighing a hopeless story: asking who says so and what the evidence is',
          'CASEL: Responsible decision-making',
          [
            N(
              'Gmork says that when people stop believing anything can be different, the Nothing grows.',
            ),
            N('How can you tell whether a hopeless story is really true?'),
          ],
          [
            o('Ask someone I trust what they think.', [
              N(
                'That’s a fair answer. A trusted friend or grown-up can see what we can’t when we are scared.',
              ),
            ]),
            o('Look for evidence: has it always been true?', [
              N(
                'That’s a fair answer. Asking “how do I know?” is a strong habit for sorting true from only scary.',
              ),
            ]),
            o('Notice who is telling it, and who it helps.', [
              N(
                'That’s a thoughtful answer. Gmork serves the Nothing, so a hopeless story helps him.',
              ),
            ]),
          ],
          'Thought about how to tell whether a hopeless story is true (a think question).',
        ),
      ],
    ),
    sc(
      'a25-12-gmork-done',
      [
        N(
          'You don’t see the wolf. You see Atreyu’s face, as the laughing stops, and the quiet after it.',
        ),
        N('Gmork has died. His body has stopped, and it will not start again.'),
        N('Gmork can’t hurt anyone now. But his teeth still hold Atreyu’s leg, and Atreyu cries out.'),
        N('Then, far above, something white comes down out of the dark.'),
      ],
      [
        ask(
          3,
          'literacy',
          'working out feelings from clues, even when nobody says them',
          'RL.3.3',
          [
            N('Nobody says how Atreyu feels. We only see his face, the quiet, and his cry.'),
            N('How can we tell what a character feels?'),
          ],
          [
            o(
              'From clues: his face, the silence and his cry.',
              [
                N(
                  'Yes. Good readers use clues, like faces, actions and sounds, to work out what a character feels.',
                ),
              ],
              true,
            ),
            o('We can’t. Nobody said.', [
              N('Authors often leave the feeling unsaid and let the clues do the work.'),
              N('Atreyu’s face and his cry are clues.'),
            ]),
            o('He feels happy.', [
              N('A cry and a silent face don’t fit with happy. They fit with shock and hurt.'),
            ]),
          ],
          'Used clues in a scene to work out a character’s feelings.',
        ),
      ],
    ),
    sc(
      'a25-12-free',
      [
        N(
          'Falkor comes down out of the dark like a falling cloud, with the amulet still in his mouth.',
        ),
        FA('Mmf! Pull! I’ve got this end!'),
        N(
          'He gets his great paws into the jaws and heaves. You take Atreyu under the arms and pull.',
        ),
        N('Your Nubbin pulls on your coat, which doesn’t help, but it is clearly doing its bit.'),
        N(
          'The jaws give. Atreyu tumbles back on top of you both, and Falkor drops AURYN into his lap.',
        ),
        AT('You found it. You found me. How?', 'shock'),
        FA('Luck. And not stopping. Mostly the not stopping.', 'happy'),
      ],
      [
        ask(
          4,
          'science',
          'forces: an object moves when one force is bigger than the other',
          '3-PS2-1',
          [
            N('Falkor and you pull one way, and the jaws hold the other way.'),
            N('When does something start to move?'),
          ],
          [
            o(
              'When one pull is bigger than the other.',
              [
                N(
                  'Yes. If the forces are balanced, nothing moves. When one is bigger, the object moves.',
                ),
              ],
              true,
            ),
            o('When the two pulls are exactly equal.', [
              N(
                'Equal pulls are balanced, so nothing moves. It is like a tug of war that stays level.',
              ),
              N('To move, one pull has to be bigger.'),
            ]),
            o('Only when something is very heavy.', [
              N('Heavy things are harder to move, but weight isn’t the whole story.'),
              N('It moves when one force is bigger than the other.'),
            ]),
          ],
          'Learned that balanced forces mean no movement and unbalanced forces make things move.',
        ),
      ],
      [
        ch('lean', 'Let Atreyu lean on you while he stands.', [
          AT('Just for a minute. Then I can do it myself.', 'soft'),
          N('It is a good deal more than a minute. Nobody minds.'),
        ]),
        ch('falkor', 'Thank Falkor.', [
          FA('Thank the luck. Well, no, thank me. I did most of it.', 'happy'),
        ]),
      ],
    ),
    sc(
      'a25-12-complete',
      [
        N(
          'Falkor flies you all out of Spook City before the sun is properly up. Nobody looks back.',
        ),
        AT(
          'He said people stop hoping, and that’s what makes the Nothing grow. Out there. In the human world.',
          'think',
        ),
        FA('Then somebody out there had better start again.'),
        N(
          'Your Nubbin is fast asleep behind his ear. A scrap of pearly scale has come loose in the fur, and it is wrapped in it like a cape.',
        ),
        FA('Keep it. Luckdragons shed. It’s lucky, obviously.', 'happy'),
      ],
      [
        ask(
          3,
          'sel',
          'looking after yourself after a hard time: rest, food and kind company',
          'CASEL: Self-management',
          [
            N('Your Nubbin falls fast asleep after a very hard day.'),
            N('What helps us after something scary or tiring?'),
          ],
          [
            o(
              'Rest, food and someone kind nearby.',
              [N('Yes. Our bodies and our feelings both need looking after after a hard time.')],
              true,
            ),
            o('Carry on as if nothing happened.', [
              N(
                'That can feel easier in the moment. But bodies and feelings that have had a shock need a little time.',
              ),
              N('Rest, food and kind company help.'),
            ]),
            o('Be alone, and never talk about it.', [
              N(
                'Some quiet time can help. But talking to someone kind about it usually helps more.',
              ),
            ]),
          ],
          'Thought about how to look after yourself after something scary or tiring.',
        ),
      ],
    ),
  ],
  [
    gl('courtyard', 'An open space with walls or buildings all round it.', 'a25-12-gmork'),
    gl('dense', 'Having a lot of weight packed into a small space.', 'a25-12-dive'),
  ],
);

// ================================================================== A25-13 The Old Man of Wandering Mountain
const A13: EduQuest = quest(
  'a25-13',
  'The Old Man of Wandering Mountain',
  {
    'a25-13-s1': {
      goal: 'Go with Atreyu to the Empress at the top of the Ivory Tower.',
      hint: 'Climb to the magnolia pavilion. Wait at the edge of the room.',
    },
    'a25-13-s2': {
      goal: 'Go with the Empress to Wandering Mountain.',
      hint: 'Climb the mountain path behind her. She goes slowly; she has never been here.',
    },
    'a25-13-s3': {
      goal: 'Sit and listen while the Old Man reads the story from the beginning.',
      hint: 'Sit on the floor by the Empress. It is a long story. Listen to how it starts.',
    },
  },
  [
    sc(
      'a25-13-empress',
      [
        N(
          'The Ivory Tower is a white spiral, and at its top a magnolia flower stands open. On cushions inside sits a girl who looks about ten.',
        ),
        N('She is very pale and very calm, and she is older than anything in Fantastica.'),
        AT(
          'I failed. I went everywhere. Nobody here can give you a name, and nobody from outside has come.',
          'sad',
        ),
        EM(
          'You didn’t fail. You brought him. Everything you did, someone was listening to. He is listening now.',
          'soft',
        ),
        N(
          'Atreyu stares at her. Behind your eyes, very faintly, you can see a red-ink attic, and a boy who has gone quite still.',
        ),
        N('Then she looks past Atreyu, at your Nubbin, who is half-hidden behind your knee.'),
        EM('Hello. I know you. I know everyone here.'),
        N(
          'She says your Nubbin’s name, very softly. It is the right name, the one you gave it on the first night.',
        ),
        N(
          'Your Nubbin comes out from behind your knee all at once, as if it had been called across the Grove.',
        ),
        EM(
          'You came in through a book, traveller. So did everyone here, in a way. That’s why it can’t be you.',
        ),
        EM('It has to be him: a child from out there who opened this book and kept reading.'),
        Y('He’s frightened.'),
        EM('I know. I can wait. I am very good at waiting.', 'soft'),
      ],
      [
        ask(
          8,
          'social-studies',
          'names often come from a family story, a place or a hope',
          'D2.His.2.3-5',
          [
            N('When the Empress says your Nubbin’s name, it comes out at once.'),
            N(
              'Names often carry a family story: a grandparent, a place, a hope. What might a name tell us about the people who chose it?',
            ),
          ],
          [
            o('That they were thinking of someone they loved.', [
              N('That’s a fair answer. Many people are named after someone dear to their family.'),
            ]),
            o('That they hoped something for the child.', [
              N('That’s a fair answer. A name can hold a wish, like “brave” or “bright”.'),
            ]),
            o('I’d like to ask my family how mine was chosen.', [
              N('That’s a good idea. Asking is a way of keeping a family story alive.'),
            ]),
          ],
          'Thought about how names often carry a family story (a think question).',
        ),
      ],
    ),
    sc(
      'a25-13-empress-done',
      [
        EM(
          'Sleep now, Atreyu. You have done more than anyone. I have one more thing to try.',
          'soft',
        ),
        N('Atreyu is asleep before he can argue. The Empress turns to you.'),
      ],
      [
        ask(
          0,
          'sel',
          'being kind to yourself after a setback: trying hard is not failing',
          'CASEL: Self-awareness',
          [
            N('Atreyu thinks he failed. The Empress says he has done more than anyone.'),
            N('When you think you have failed at something, what could you say to yourself?'),
          ],
          [
            o(
              'I tried my hardest, and that counts.',
              [
                N(
                  'Yes. Trying hard is never wasted, even when things don’t turn out as you planned.',
                ),
                N('Atreyu’s journey brought Bastian to the story, though he didn’t know it.'),
              ],
              true,
            ),
            o('I’m no good at anything.', [
              N('That is a heavy thing to say to yourself, and it isn’t true.'),
              N(
                'Talk to yourself as you would to a friend: you tried hard, and that counts.',
              ),
            ]),
            o('Nothing. I’d just feel bad.', [
              N('Feeling bad for a while is allowed. Then a kind word to yourself can help.'),
              N('You could say: I tried my hardest, and that counts.'),
            ]),
          ],
          'Thought about speaking kindly to yourself after a setback.',
        ),
        notice(
          1,
          'science',
          'sleep is a need for animals: bodies rest and repair',
          'K-LS1-1',
          [
            N('Sleep is not wasted time. While we sleep, our bodies rest and mend.'),
            N('Our brains also sort through what we learnt that day, and tuck it away.'),
            N('That is why everyone feels better after a good night’s sleep, even brave hunters.'),
          ],
          'Learned that sleep lets animals rest and repair, and is one of the things they need to live.',
        ),
      ],
    ),
    sc(
      'a25-13-climb',
      [
        EM('Come, if you like. You aren’t part of this story, so it won’t mind you.'),
        N(
          'Wandering Mountain is never in the same place twice. Today it is right outside the tower, as if it had been expecting her.',
        ),
        EM(
          'There is one person in Fantastica I must never meet. If I meet him, everything that has happened happens again.',
        ),
        EM('He is the Old Man. He writes it all down, as it happens. He writes me.'),
        N(
          'At the top there is a house shaped like an egg. Inside, by blue light, an old man is writing in a book with a pen of light.',
        ),
        N(
          'It is the same book, copper silk with two snakes. Your Nubbin knows it at once and tugs your sleeve.',
        ),
      ],
      [
        ask(
          5,
          'literacy',
          'who tells a story: a narrator outside it or a character inside it',
          'RL.3.6',
          [
            N(
              'The Old Man writes everything as it happens. If you bow, he writes “the traveller bows”, not “I bow”.',
            ),
            N('Who is telling that part of the story?'),
          ],
          [
            o(
              'Someone outside it, watching and writing it down.',
              [N('Yes. A story told as “he”, “she” or “the traveller” has a narrator outside it.')],
              true,
            ),
            o('The traveller, about themself.', [
              N('If the traveller told it, it would say “I bow”.'),
              N('Using “the traveller” shows someone else is telling it.'),
            ]),
            o('Nobody. It just happens.', [
              N(
                'Every story has someone telling it. Here, the Old Man writes the story as it happens.',
              ),
            ]),
          ],
          'Told a narrator outside the story (“the traveller”) from a character telling it (“I”).',
        ),
      ],
      [
        ch('bow', 'Bow to the Old Man.', [
          N(
            'He doesn’t look up, but his pen writes: the traveller bows. You see the words appear.',
          ),
        ]),
        ch('stay', 'Stay by the door, out of the light.', [
          N('You keep to the door. The pen writes that too: the traveller keeps to the door.'),
        ]),
      ],
    ),
    sc(
      'a25-13-climb-done',
      [
        OM('You came. You shouldn’t have. But you came.', 'sad'),
        EM('Then read it. From the start. Read it out loud.'),
      ],
      [
        notice(
          1,
          'science',
          'real mountains change very slowly over a very long time',
          '4-ESS2-1',
          [
            N('Wandering Mountain wanders, which no real mountain does.'),
            N(
              'Real mountains do change, but very slowly. Wind, rain and ice wear them down over millions of years.',
            ),
            N(
              'A landslide or a volcano can change a mountain quickly, but a mountain never walks.',
            ),
          ],
          'Learned that real mountains change very slowly, with a few fast events like landslides.',
        ),
      ],
    ),
    sc(
      'a25-13-reading',
      [
        OM('Very well. From the first page.'),
        OM(
          'Rain on a shop door with a little bell. An old bookseller in an armchair. A round boy, running from other boys.',
        ),
        N('In the attic, Bastian’s mouth falls open. That is him, and that is his morning.'),
        OM(
          'He takes a book. He runs. He goes up to a school attic and wraps himself in blankets, and opens it.',
        ),
        OM('A forest. Four messengers by a fire. A centaur. A boy in the Grassy Sea…'),
        N(
          'You hear yourself in it: a traveller behind a bell, with a small soft creature that sneezed on a book.',
        ),
        OM(
          'And at the top of the tower, the Empress goes to the Old Man of Wandering Mountain. And he begins to read the story from the start…',
        ),
        N(
          'It is going round again. It will go round for ever, the boy reading and the old man reading him, unless someone breaks in.',
        ),
        BA(
          'It’s me. She’s waiting for me. She’ll wait for ever, and I’ll be reading this for ever, unless…',
          'shock',
        ),
      ],
      [
        ask(
          7,
          'maths',
          'a repeating pattern: finding the 10th step in a cycle of four',
          '4.OA.C.5',
          [
            N(
              'The story goes round and round: shop, attic, forest, tower. Then shop, attic, forest, tower again.',
            ),
            N('Which place comes at the 10th step?'),
          ],
          [
            o(
              'The attic',
              [
                N(
                  'Yes. The pattern repeats every four. Steps 9 and 10 are the shop, then the attic.',
                ),
                N('Or: 10 is 2 after 8, and 8 ends a full cycle.'),
              ],
              true,
            ),
            o('The shop', [
              N('The shop is step 9. Count on once more: shop is 1, 5 and 9.'),
              N('Step 10 is the attic.'),
            ]),
            o('The tower', [
              N('The tower is step 4 and step 8. Step 12 would be next.'),
              N('Step 10 is the attic.'),
            ]),
          ],
          'Found the 10th item in a repeating pattern of four (the attic).',
        ),
      ],
    ),
    sc(
      'a25-13-complete',
      [
        N(
          'The Empress doesn’t look at the Old Man. She looks up, at the ceiling of the egg, as if there were a skylight there.',
        ),
        EM(
          'Bastian. I know you’re there. I’ve known all along. It’s all right that you were frightened.',
          'soft',
        ),
        N(
          'In the attic the candle is nearly burnt down. Bastian stands up, with the blanket falling off his shoulders.',
        ),
      ],
      [
        ask(
          1,
          'literacy',
          'what a character’s words show about her kindness and calm',
          'RL.3.3',
          [
            N('The Empress tells Bastian it is all right that he was frightened.'),
            N('What does that tell us about her?'),
          ],
          [
            o('She is kind, and she doesn’t judge him.', [
              N('That’s a fair answer. She welcomes the frightened boy as he is.'),
            ]),
            o('She is patient. She has waited a long time.', [
              N(
                'That’s a fair answer. “I can wait” and “I’ve known all along” show she is very patient.',
              ),
            ]),
            o('She understands that being scared and brave can go together.', [
              N('That’s a thoughtful answer. Many brave people are frightened too.'),
            ]),
          ],
          'Thought about what the Empress’s words show about her (a think question).',
        ),
      ],
    ),
  ],
  [gl('magnolia', 'A tree or bush with large, waxy flowers.', 'a25-13-empress')],
);

// ================================================================== A25-14 Moon Child
const A14: EduQuest = quest(
  'a25-14',
  'Moon Child',
  {
    'a25-14-s1': {
      goal: 'Be in the attic when Bastian says her name.',
      hint: 'Stand by him in the red light. Don’t help. It has to be him.',
    },
    'a25-14-s2': {
      goal: 'Wait in the dark.',
      hint: 'There is nothing to see. Stay close to your Nubbin and listen.',
    },
  },
  [
    sc(
      'a25-14-name',
      [
        N(
          'You are back in the attic all at once, in the red ink, and the candle is a stub. Outside it is dark and still raining.',
        ),
        BA(
          'I’m not right for it. I’m not brave. I’m not anything. Somebody better should do it.',
          'sad',
        ),
        N(
          'He looks at the book. Atreyu went into the swamp for her, and Falkor went into the sea.',
        ),
        BA('There isn’t anybody better. There’s only me. There’s only ever been me up here.'),
        N(
          'Your Nubbin sits on the gym mat in front of him and looks up at him, waiting, the way it waits for breakfast.',
        ),
        N(
          'Bastian takes a deep breath. He thought of the name pages ago, and was too shy to say it.',
        ),
        BA('Moon Child! Your name is Moon Child! I’m coming!', 'shock'),
      ],
      [
        ask(
          3,
          'sel',
          'courage: being brave means acting even when you are scared',
          'CASEL: Self-management',
          [
            N('Bastian says he isn’t brave. But he is about to speak anyway.'),
            N('What does being brave really mean?'),
          ],
          [
            o(
              'Doing the right thing even though you are scared.',
              [
                N('Yes. Brave people feel afraid too. Bravery is what you do next.'),
                N('Bastian is frightened, and he is about to do something very brave.'),
              ],
              true,
            ),
            o('Not feeling scared at all.', [
              N('Someone who feels no fear isn’t being brave, because nothing is hard for them.'),
              N('Bravery is acting while you feel the fear.'),
            ]),
            o('Being the strongest person in the room.', [
              N(
                'Strength can help. But Bastian isn’t strong in that way, and he is about to be brave.',
              ),
              N('Bravery is doing the right thing while scared.'),
            ]),
          ],
          'Learned that being brave means acting even when you feel scared.',
        ),
        ask(
          6,
          'literacy',
          'a few German words (Mond, Kind, Buch) and how German joins words together',
          'L.3.4',
          [
            N(
              'A note in Nova’s writing: “Mond is German for moon, and Kind is German for child. German often joins words into one long word.”',
            ),
            N(
              'Joined, with a little “en” in the middle, they make Mondenkind. What name does that give in English?',
            ),
          ],
          [
            o(
              'Moon Child',
              [
                N('Yes. Moon Child. Mond sounds a bit like “mohnt”, and Kind a bit like “kint”.'),
              ],
              true,
            ),
            o('Child Moon', [
              N(
                'Close! German puts the describing word first, like English: a moon child is a child of the moon.',
              ),
              N('So Mondenkind means Moon Child.'),
            ]),
            o('Moon Kind', [
              N('“Kind” is a German word. In English, it means “child”.'),
              N('So Mondenkind means Moon Child.'),
            ]),
          ],
          'Learned three German words (Mond, Kind, Buch) and how German joins words into one: Mondenkind, Moon Child.',
        ),
      ],
    ),
    sc(
      'a25-14-name-done',
      [
        N(
          'The candle goes out, and the attic, and everything. It goes all at once, very gently, like someone drawing a curtain.',
        ),
      ],
      [
        notice(
          0,
          'literacy',
          'a story needs a reader',
          undefined,
          [N('A story needs a reader. Bastian read, and then he called out, and the story answered.')],
          'Noticed that a story needs a reader, and that Bastian’s call is what the story answered.',
        ),
      ],
    ),
    sc(
      'a25-14-dark',
      [
        N(
          'It is completely dark. Not frightening dark: the dark behind your eyes, just before you sleep.',
        ),
        BA('Hello? Is anyone there? Did I do it wrong?'),
        EM(
          'You did it right. Moon Child. Nobody has ever given me a better one. Thank you, Bastian.',
          'soft',
        ),
        BA('Where is everything? Where’s Fantastica?'),
        EM('Here. This is all that’s left of it.'),
        N(
          'In the dark, a small cool hand opens his, and puts something into it. A single grain of sand, glowing like an ember.',
        ),
        EM(
          'Everything starts again with you. It will grow from your wishes. Go carefully. Wishes are hungrier than they look.',
        ),
      ],
      [
        ask(
          6,
          'sel',
          'thinking about the cost of wishes and choices',
          'CASEL: Responsible decision-making',
          [
            N('The Empress says wishes are “hungrier than they look”.'),
            N('What might she mean? Can getting what you want ever cost something?'),
          ],
          [
            o('Maybe a wish can cost something you didn’t expect.', [
              N('That’s a fair answer. Choices have prices that are hard to see in advance.'),
            ]),
            o('Maybe getting everything makes you want even more.', [
              N(
                'That’s a fair answer. Wanting can grow, and it can be hard to feel you have enough.',
              ),
            ]),
            o('I don’t know. I’d like to see what happens.', [
              N(
                'That’s an honest answer. The Empress says “go carefully”, so careful watching is a good start.',
              ),
            ]),
          ],
          'Thought about whether getting what you wish for can have a hidden cost (a think question).',
        ),
      ],
      [
        ch('nubbin', 'Find your Nubbin in the dark.', [
          N(
            'You feel about until you find a warm, soft ear. Your Nubbin finds your thumb and holds it.',
          ),
        ]),
        ch('still', 'Keep still and listen.', [
          N(
            'You keep still. In the dark you can hear a boy breathing fast, and a girl’s voice, very calm.',
          ),
        ]),
      ],
    ),
    sc(
      'a25-14-dark-done',
      [
        N(
          'Something brushes your own hand in the dark. When you look, there is a single grain of sand stuck to your Nubbin’s paw.',
        ),
        N(
          'It glows, very faintly. Your Nubbin holds its paw out flat, as if it knew it mustn’t drop it.',
        ),
      ],
      [
        notice(
          1,
          'science',
          'sand is tiny bits of rock worn down grain by grain by wind and water',
          '4-ESS2-1',
          [
            N(
              'Real sand is made of tiny pieces of rock, shell and other things, worn down by wind and water.',
            ),
            N(
              'It happens one grain at a time, over thousands of years. One grain is very small, and a beach has a very great many.',
            ),
          ],
          'Learned that sand is tiny pieces of rock worn down by weathering over a very long time.',
        ),
      ],
    ),
    sc(
      'a25-14-complete',
      [
        N(
          'The page goes still. Across the bottom there is a long space and a single line of green.',
        ),
        N(
          'This is where your page ends. A boy has given the Empress her new name, and from one grain of sand a whole land can begin again.',
        ),
        N(
          'You tip your Nubbin’s grain into an empty glass vial from your pocket, and stopper it. It glows in your hand like a tiny moon.',
        ),
        N('You close Nova’s atlas, and the rain on the glass goes quiet.'),
      ],
      [
        ask(
          2,
          'literacy',
          'theme: why a name can be a gift',
          'RL.4.2',
          [
            N('Bastian gave the Empress a name, and it helped to save her.'),
            N('Why can a name be a gift?'),
          ],
          [
            o(
              'It says “I know who you are, and you matter.”',
              [
                N('Yes. To be named is to be known. That is a very big gift to give.'),
                N('It is a gift you can only give by paying attention to someone.'),
              ],
              true,
            ),
            o('Because names cost a lot of money.', [
              N('Names don’t cost anything. The gift is the care in choosing and saying them.'),
              N('A name says “you matter”.'),
            ]),
            o('A name isn’t really a gift.', [
              N(
                'That’s an interesting view. But think about how it feels when someone remembers your name.',
              ),
              N('A name can say “you matter”.'),
            ]),
          ],
          'Found the theme that a name can be a gift: it says you are known and you matter.',
        ),
      ],
    ),
  ],
  [
    gl(
      'stub',
      'A short piece that is left over after most of something has been used up.',
      'a25-14-name',
    ),
    gl('weathering', 'The slow breaking down of rock by wind, water and ice.', 'a25-14-dark-done'),
  ],
);

// ================================================================== Variant scene (inside Part One)
/**
 * One EduScene for the one ATLAS_A25_VARIANTS entry inside Part One: a25-13-empress-ash (played in
 * place of a25-13-empress when s6Done is set). Same domain as the scene it replaces (social
 * studies), so the order of domains holds on both paths. The other eleven variants belong to
 * Part Two (A25-16 to A25-20 and the margin and Grove notes) and have no Learning Grove version.
 */
export const EDU_A25_READER_VARIANTS: EduScene[] = [
  sc(
    'a25-13-empress-ash',
    [
      N(
        'The Ivory Tower is a white spiral, and at its top a magnolia flower stands open. On cushions inside sits a girl who looks about ten.',
      ),
      N('She is very pale and very calm, and she is older than anything in Fantastica.'),
      AT(
        'I failed. I went everywhere. Nobody here can give you a name, and nobody from outside has come.',
        'sad',
      ),
      EM(
        'You didn’t fail. You brought him. Everything you did, someone was listening to. He is listening now.',
        'soft',
      ),
      N(
        'Atreyu stares at her. Behind your eyes, very faintly, you can see a red-ink attic, and a boy who has gone quite still.',
      ),
      N(
        'Then she looks past Atreyu, at your Nubbin, who is half-hidden behind your knee, and then at you, for a long moment.',
      ),
      EM(
        'You know about names. A girl whistled one back to someone, in a kitchen, with one lamp lit.',
        'soft',
      ),
      EM(
        'Three notes. Low, high, and a little one. I heard it from here. Everyone here hears a name when it is given back.',
      ),
      N(
        'Your Nubbin comes out from behind your knee and stands up very straight, as if it has been introduced.',
      ),
      EM(
        'You came in through a book, traveller. So did everyone here, in a way. That’s why it can’t be you.',
      ),
      EM('It has to be him: a child from out there who opened this book and kept reading.'),
      Y('He’s frightened.'),
      EM('I know. I can wait. I am very good at waiting.', 'soft'),
    ],
    [
      ask(
        8,
        'social-studies',
        'a name can be kept for someone and given back; remembering matters',
        'D2.His.2.3-5',
        [
          N('A name was whistled back to someone, and the Empress heard it from far away.'),
          N(
            'Why might it matter that someone remembers a name for you, until you can have it back?',
          ),
        ],
        [
          o('It means you are not forgotten while you are away.', [
            N(
              'That’s a fair answer. Being remembered is a way of belonging, even when you are far away.',
            ),
          ]),
          o('It keeps the family story safe.', [
            N('That’s a fair answer. Names carry stories, and someone has to keep them.'),
          ]),
          o('It shows someone cares enough to keep it.', [
            N('That’s a fair answer. Keeping something for a friend is a very caring thing to do.'),
          ]),
        ],
        'Thought about why remembering a name for someone matters (a think question).',
      ),
    ],
  ),
];

// ================================================================== exports
export const EDU_A25_READER: EduQuest[] = [
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
];

/** Every `edu:` check string used by the lessons above (no `do` lessons in this file). */
export const CHECKS: string[] = [];
