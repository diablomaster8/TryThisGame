/**
 * The Learning Grove, reader band (ages 7–10): Atlas page A13, The Wooden Boy (Collodi’s
 * Pinocchio, Tuscany).
 *
 * Source: atlas-a13.ts (ATLAS_A13 and A13_VARIANTS). One EduScene per original scene (every step
 * scene, every done scene, every complete scene and every variant), id `reader:<original id>`,
 * with every choice kept under its original id and `set` flag (`a13-cricket`, `a13-crust`). Reader
 * keeps all choices, so no `defaultChoice` is needed. See EDU-STYLE.md. British spelling.
 *
 * Learning angles, from the outline: geography (Italy, Tuscany, the coast, compass directions),
 * history (Collodi, the 1881 newspaper serial, Italy becoming one country), science (tree rings,
 * floating and buoyancy, sound and echoes, light, bees, senses, seasons), maths (time intervals,
 * unit fractions, multiplication and division, patterns, bar graphs), language (babbo, burattino,
 * pescecane, ciao, grazie, similes and idioms), culture (commedia dell’arte masks, an Italian
 * supper, vineyards, public fountains) and feelings (honesty, fairness, promises, grief, love).
 *
 * Think questions (`ask` with no `best`) in every quest: fairness, honesty, whether a kind
 * not-quite-truth is ever right, whether safe is the same as well, and what love is.
 *
 * Care notes kept: Collodi, not Disney (no film names). The Talking-cricket is alive on both
 * routes; the stone says she went away grieving; Candlewick’s death is said plainly (he died) and
 * gently; the Italian words are real (babbo, burattino, pescecane, ciao, grazie, pinocchio); the
 * Commedia masks are described as traditional. Nothing is quoted from the book or any translation.
 * Facts used: pinocchio is an old Tuscan word for a pine nut; Collodi’s real name was Lorenzini
 * and his pen-name came from a Tuscan town; the story first ran in a children’s paper from 1881;
 * Italy became one kingdom in 1861; trees grow one ring a year; wood floats; sea water holds about
 * 35 g of salt in every litre; thunder is about 3 seconds per kilometre; a normal body temperature
 * is about 37°C (98.6°F); dogs hear higher notes than we do; pescecane is Italian for a shark.
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
const CK = say('clank');
const P = say('a13-pin');
const G = say('a13-geppetto');
const MC = say('a13-cherry');
const LG = say('a13-log');
const CR = say('a13-cricket');
const CB = say('a13-carabineer');
const CH = say('a13-chick');
const NC = say('a13-nightcap');
const HQ = say('a13-harlequin');
const PU = say('a13-punch');
const FE = say('a13-fireeater');
const FX = say('a13-fox');
const CT = say('a13-cat');
const IK = say('a13-innkeeper');
const ST = say('a13-sack-tall');
const SS = say('a13-sack-short');
const FY = say('a13-fairy');
const MD = say('a13-medoro');
const CW = say('a13-crow');
const OW = say('a13-owl');
const RB = say('a13-rabbit');
const PR = say('a13-parrot');
const JG = say('a13-judge');
const JL = say('a13-jailer');
const FM = say('a13-farmer');
const MT = say('a13-marten');
const PG = say('a13-pigeon');
const CO = say('a13-coalman');
const WO = say('a13-woman');
const SB = say('a13-schoolboy');
const EU = say('a13-eugene');
const AL = say('a13-alidoro');
const GF = say('a13-fisher');
const CW2 = say('a13-candlewick');
const LM = say('a13-littleman');
const MA = say('a13-marmot');
const BU = say('a13-buyer');
const TU = say('a13-tunny');
const SN = say('a13-snail');
const GI = say('a13-giangio');
const PX = say('pixel');

// ---------------------------------------------------------------- builders
type Beat = Omit<Lesson, 'id'>;
type Opt = NonNullable<Lesson['options']>[number];

const words = (t: string) => t.trim().split(/\s+/).length;
const fits = (t: string) => words(t) <= 26 && t.length <= 150;

/**
 * Keeps every line within the reader caps (30 words, 160 characters): a long line is cut at
 * sentence ends into several lines by the same speaker (the mood stays on the first). `map[i]`
 * is the index of the last piece of original line i, so a lesson’s `after` can follow.
 */
const split = (lines: Line[]): { lines: Line[]; map: number[] } => {
  const out: Line[] = [];
  const map: number[] = [];
  for (const l of lines) {
    const sentences = l.text.split(/(?<=[.!?”)])\s+(?=[A-Z“(])/);
    const chunks: string[] = [];
    for (const sentence of sentences) {
      const last = chunks[chunks.length - 1];
      if (last !== undefined && fits(`${last} ${sentence}`))
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
const PAGE: Line[] = [
  N(
    'Nova’s atlas falls open at a page in brown ink: a hill town, a long white road, and along the bottom edge, the sea.',
  ),
  N(
    'The words across the top begin the way stories for children do. Once upon a time there was… a king, you think.',
  ),
  N('No. Once upon a time there was a piece of wood.'),
];
const LOG: Line[] = [
  N(
    'The carpenter’s nose is so round and red and shiny that it looks like a ripe cherry. Everyone calls him Master Cherry.',
  ),
  MC(
    'I’m making a table leg. Out of this. A firewood log, a nothing log. Nothing special about it at all.',
  ),
  N('He spits on his hands and lifts the axe.'),
  LG('Don’t hit me too hard!'),
];
const COAT: Line[] = [
  N(
    'He comes back an hour later with a spelling-book under his arm, in his shirt-sleeves. There is snow on his shoulders.',
  ),
  P('Babbo, where’s your coat?'),
  G('I sold it.'),
  P('Why?'),
  G('It was too warm.', 'happy'),
  N(
    'Pinocchio understands. He throws his arms round the old man’s neck and kisses him all over his face.',
  ),
];
const LEAVE: Line[] = [
  N(
    'The doctors pick up their bags. The Talking-cricket goes last, very slowly, on one stiff leg.',
  ),
];
const SEA: Line[] = [
  N(
    'After an hour the man hauls in his rope. Up out of the sea comes, not a donkey, but a wooden puppet, wriggling like an eel.',
  ),
  BU('Where’s my donkey?', 'shock'),
  P(
    'The sea washed him off. All the little fish had a nibble. It turns out the donkey was only a sort of coat.',
    'happy',
  ),
  N('He wriggles out of the rope, dives, and swims away laughing.'),
];
const THANKS: Line[] = [
  N(
    'On the sand Pinocchio helps his father up, gently, as if Geppetto were made of glass. Then he turns to the Tunny.',
  ),
  N('He opens his mouth, and shuts it, and opens it again.'),
  P(
    'You saved my babbo. I want to thank you properly, and I can’t. I’ve looked, and there isn’t a word big enough.',
    'soft',
  ),
  N(
    'So he kisses the Tunny on the nose instead. The Tunny, who is not used to it, dives at once, so that nobody will see him cry.',
  ),
];
const CANDLE: Line[] = [
  N(
    'Your Nubbin is still holding the green bottle. The candle went out in the sea, but the bottle kept it dry, and it won’t give it up.',
  ),
];
const HUT: Line[] = [
  CR('Oh, my Pinocchio.'),
  P('Oh, my dear little Cricket!', 'happy'),
  CR('My dear little Cricket, now, is it? Do you remember the mallet?'),
  P('You’re right. Throw one at me. I deserve it. Only, please, spare my poor father.', 'sad'),
  CR('I shall spare you both. I only wanted to remind you.', 'soft'),
  CR(
    'In this world, be kind to everyone you can. Then, on your bad day, somebody may be kind to you.',
  ),
  CR(
    'This hut was given to me yesterday by a little goat with blue wool. I don’t know where she went.',
  ),
  P('Blue wool…', 'think'),
];
const WAKE: Line[] = [
  N(
    'He isn’t wood. He jumps out of bed, and his feet are feet, and he is a boy, with chestnut hair and blue eyes and a hole in his sock.',
  ),
  N(
    'The straw hut is a bright little room. There is a new suit on the chair, and in its pocket a purse full of gold coins.',
  ),
  N(
    'Geppetto is at a new bench by the window, well again, carving a picture frame full of leaves and flowers, and whistling.',
  ),
  P('Babbo! Look at me!', 'happy'),
  G('I am looking. I’ve been looking all your life.', 'soft'),
  N(
    'In the corner, leaning against a chair, is the old wooden puppet. Its head is on one side, and its legs are crossed, as if it were very tired.',
  ),
  P(
    'Look at him. Did I really go about like that, all knees and nose? I’m glad that’s over. I’m so glad I’m me.',
    'happy',
  ),
];
const HOME: Line[] = [
  G(
    'And take my old bench, traveller. The little Nubbin on it never got finished. It’s lovely as it is.',
    'soft',
  ),
  N(
    'The page settles under your hand like a door closed quietly. You are back in the Grove, with sawdust in your hair and pine on your sleeve.',
  ),
];
const WORD_A: Line[] = [
  CK('Did they love this one? The wooden one?', 'think'),
  Y('Yes. He sold his coat for that one.'),
  CK('Before it was useful.'),
  G('Before it was anything.', 'soft'),
  N(
    'Clank clicks, and clicks again, the way he did on the shelf in the lantern shed, looking for a word he hasn’t got.',
  ),
  CK('If I stop being useful, will you still love me.', 'soft'),
  N('It isn’t a question. He says it the way you say a thing you have just found in your pocket.'),
  N(
    'Nobody answers. Your Nubbin climbs up onto his hood and sits there, warm, and Geppetto puts down his chisel.',
  ),
  CK('Love. That’s the word.', 'soft'),
];
const WORD_B: Line[] = [
  CK(
    'Pixel didn’t put it in. Nobody puts it in. Somebody does it to you first, and then it’s there.',
  ),
  N(
    'He doesn’t become anything. He is still a kettle on one wheel, with a ramp that says BYTE underneath, and that is the whole point.',
  ),
];

// ================================================================== A13-1 The Piece of Wood
const A1: EduQuest = quest(
  'a13-01',
  'The Piece of Wood',
  {
    'a13-01-s1': {
      goal: 'Step into the brown-ink page, and out of the rain.',
      hint: 'Touch the page. Then find the open door with sawdust on its step.',
    },
    'a13-01-s2': {
      goal: 'Stay in Master Cherry’s shop while he planes the log.',
      hint: 'Stand by the bench. When the old men start, keep your Nubbin out from under their feet.',
    },
  },
  [
    sc(
      'a13-01-page',
      [
        ...PAGE,
        N(
          'The ink goes wet under your fingers, and then it is rain. You and your Nubbin are standing in a steep stone lane, getting wetter.',
        ),
        N(
          'One door is open, with sawdust on the step and a warm smell of pine. You go in, because the rain has decided for you.',
        ),
        MC('Come in, come in, shut the weather out. Mind the shavings. Mind the cat.'),
        MC('There isn’t a cat. Mind it anyway. It saves arguments.'),
        ...LOG,
      ],
      [
        notice(
          2,
          'social-studies',
          'Pinocchio’s author, Carlo Collodi, and the Tuscany he wrote about',
          'D2.His.2.K-2',
          [
            N(
              'This page is a real place: Tuscany, in the middle of Italy, with hill towns, vineyards and a coast far to the west.',
            ),
            N(
              'The writer was Carlo Lorenzini. He called himself Collodi, after a Tuscan town, and his story first ran in a children’s newspaper in 1881.',
            ),
          ],
          'Learned that Pinocchio comes from Tuscany in Italy, and that Collodi first published it in a children’s newspaper in 1881.',
        ),
      ],
    ),
    sc(
      'a13-01-page-done',
      [
        N(
          'Master Cherry looks under the bench, in the cupboard and up the chimney. There is nobody in the shop but you, and you are a stranger.',
        ),
        MC(
          'Did you say that? You didn’t say that. Your little friend didn’t say that. Nobody said that.',
          'shock',
        ),
        MC('I imagined it. Wine and weather. That’s all it was.'),
      ],
      [
        ask(
          2,
          'science',
          'tree rings: one ring for each year of growth',
          '3-LS1-1',
          [
            N(
              'Master Cherry points at the end of the log. Inside it are rings, like a target. How might you tell how old the tree was?',
            ),
          ],
          [
            o(
              'Count the rings. Each one is a year.',
              [
                N(
                  'Yes. Trees add one ring a year. A wide ring means a good year with plenty of rain and sun. A thin ring means a hard one.',
                ),
              ],
              true,
            ),
            o('Measure how tall the log is.', [
              N(
                'A log can be any length. The rings inside tell the age: one ring for every year the tree grew.',
              ),
            ]),
            o('You cannot tell.', [
              N('You can! Count the rings from the middle outwards. Each ring is one year.'),
            ]),
          ],
          'Learned that a tree grows one ring each year and that rings can be counted to find its age.',
        ),
      ],
    ),
    sc(
      'a13-01-plane',
      [
        N('He gives the log a proper whack this time.'),
        LG('Ow! That hurt!'),
        N(
          'Master Cherry sits down on the floor, very suddenly. Then he gets up, very slowly, and picks up his plane instead.',
        ),
        N('He planes. The log giggles.'),
        LG('Stop it! You’re tickling!'),
        N(
          'Master Cherry falls flat like a sack of meal. His red nose goes quite blue with fright.',
        ),
        N(
          'Somebody knocks, and in comes a little old man in a bright yellow wig. The wig is exactly the colour of polenta, so the boys of the town call him Polendina. He hates it more than anything in the world.',
        ),
        G('Good morning, Master Antonio. What are you doing down there?'),
        MC('Teaching the ants their letters. What brings you, Geppetto?'),
        G(
          'An idea. A wooden puppet that dances and fences and turns somersaults. I’ll take him round the world and earn my crust.',
        ),
        LG('Good idea, Polendina!'),
        N('Geppetto turns the colour of a beetroot, and looks straight at Master Cherry.'),
      ],
      [
        ask(
          11,
          'literacy',
          'seeing a scene from two points of view',
          'RL.3.6',
          [
            N(
              'You know the log spoke. Geppetto doesn’t. He thinks his friend called him a rude name. Is it fair to be angry with someone before you know the facts?',
            ),
          ],
          [
            o('No. Find out first, then decide.', [
              N(
                'That’s a fair answer. Geppetto only has half the story, and so he is cross with the wrong person.',
              ),
            ]),
            o('Yes. The name is rude whoever said it.', [
              N(
                'That’s fair too. Being called a name hurts. But the person who said it matters, and he has picked the wrong one.',
              ),
            ]),
            o('You should tell him it was the log.', [
              N(
                'That’s fair. You do know the truth, and a true word can stop a quarrel. Whether he would believe it is another matter.',
              ),
            ]),
          ],
          'Thought about how knowing only half the story changes how we judge someone.',
        ),
      ],
      [
        {
          id: 'log',
          label: 'Tell Geppetto it was the log.',
          then: [
            G(
              'The log. A log called me Polendina. And I suppose the bench calls me Grandad.',
              'angry',
            ),
            N('So that went well.'),
          ],
        },
        {
          id: 'out',
          label: 'Keep out of it. It’s their argument.',
          then: [N('You keep out of it. That lasts about a second and a half.')],
        },
      ],
    ),
    sc(
      'a13-01-plane-done',
      [
        N(
          'The two old men go at each other like cats on a roof. When they come apart, Geppetto is wearing Master Cherry’s grey wig, and Master Cherry the yellow.',
        ),
        N('They swap back, shake hands, and swear to be friends for the rest of their lives.'),
        N(
          'Master Cherry gives him the log very gladly. It jumps out of his hands and cracks Geppetto on the shins, and they start all over again.',
        ),
        N(
          'In the end, peace. Geppetto puts the log on his shoulder and limps off, and the rain has stopped.',
        ),
      ],
      [
        ask(
          3,
          'sel',
          'what helps repair a friendship after a quarrel',
          'CASEL: Relationship skills',
          [
            N(
              'The old men argued, swapped wigs and made peace twice in one morning. What mends a quarrel best?',
            ),
          ],
          [
            o(
              'Listening, saying sorry, and shaking hands.',
              [
                N(
                  'Yes. Listening shows you care what the other person felt, and sorry and a handshake close it.',
                ),
              ],
              true,
            ),
            o('Waiting for the other person to apologise first.', [
              N(
                'That feels fair, but it can leave the quarrel open for a very long time. Someone has to go first.',
              ),
            ]),
            o('Pretending it never happened.', [
              N(
                'That sometimes works for tiny things. For bigger ones, the hurt stays unless somebody talks about it.',
              ),
            ]),
          ],
          'Talked about listening, apologising and shaking hands as ways to mend a quarrel.',
        ),
      ],
    ),
    sc(
      'a13-01-complete',
      [
        G(
          'You. The traveller. You’ve no roof, have you? I can always tell. I’ve hardly a roof myself. Come on.',
        ),
        N(
          'His room is under the stairs, lit by one small window. A chair, a poor sort of bed, and a table that has seen better tables.',
        ),
        N(
          'In the back wall there is a fireplace with a fire in it and a pot on top, merrily steaming. It is painted.',
        ),
        G('It’s a very good painting. It keeps me warm, if I don’t think about it.', 'happy'),
        G('You sleep in the corner. I’d offer you supper, but that’s painted too.'),
        N(
          'He hangs his felt cap on the nail by the door. Your Nubbin climbs into it, turns round twice and settles, like a pip in a pod.',
        ),
        G('Ha. It may stay. It’s the warmest thing in the house.', 'happy'),
      ],
      [
        ask(
          4,
          'literacy',
          'what a setting tells us about a character',
          'RL.4.3',
          [N('Geppetto has a painted fire and painted supper. What does that tell you about him?')],
          [
            o(
              'He is very poor, but cheerful and inventive.',
              [
                N(
                  'Yes. He can’t afford a real fire, so he paints one and makes a joke of it. The room tells us who he is.',
                ),
              ],
              true,
            ),
            o('He is a bad painter.', [
              N(
                'The painting is called “very good” in the story. It is meant to tell us about Geppetto, not about his brushwork.',
              ),
            ]),
            o('He is rich and plays tricks.', [
              N(
                'There’s a poor bed and a tired table. Look at the details: the room says poor, not rich.',
              ),
            ]),
          ],
          'Used details of a setting (a painted fire) to understand a character’s life and spirit.',
        ),
      ],
    ),
  ],
  [
    gl(
      'plane',
      'a tool that shaves thin curls off a piece of wood to make it smooth',
      'a13-01-plane',
    ),
    gl(
      'crust',
      'a living, the money you earn to eat; also the hard outside of bread',
      'a13-01-plane',
    ),
  ],
);

// ================================================================== A13-2 Geppetto Carves a Puppet
const A2: EduQuest = quest(
  'a13-02',
  'Geppetto Carves a Puppet',
  {
    'a13-02-s1': {
      goal: 'Hold the lamp while Geppetto carves.',
      hint: 'Stand at his elbow with the lamp. Watch the nose.',
    },
    'a13-02-s2': {
      goal: 'Help Geppetto teach the puppet to walk.',
      hint: 'Hold one wooden hand; Geppetto holds the other. Mind the door.',
    },
  },
  [
    sc(
      'a13-02-carve',
      [
        N(
          'Geppetto lays the log on his bench, rolls up his sleeves and looks at it for a long time, the way you look at a letter before you open it.',
        ),
        G(
          'What shall I call him? Pinocchio. I knew a whole family of Pinocchios once, and they all did splendidly.',
        ),
        G('The richest of them begged for a living. You see? Lucky.', 'happy'),
        N(
          'A pinocchio is a pine nut. It suits a thing made of pine, with a hard little head on it.',
        ),
        N('He carves the hair, then the forehead, then the eyes. The eyes move, and stare at him.'),
        G('Wooden eyes, why are you looking at me?', 'shock'),
        N('Nobody answers. He carves the nose, and the nose begins to grow.'),
        N(
          'He cuts it shorter, and it grows longer. He cuts it again, and it grows again, until he gives up and leaves it.',
        ),
        N(
          'He carves the mouth. Before he has quite finished, it laughs at him and sticks its tongue out.',
        ),
        G('Stop laughing!', 'angry'),
        N('The mouth stops laughing. It goes on sticking its tongue out.'),
      ],
      [
        notice(
          3,
          'literacy',
          'pinocchio means pine nut, and a name can carry a joke',
          'L.3.4',
          [
            N(
              'Pinocchio is a real Tuscan word for a pine nut, the small seed inside a pine cone. People in Italy put pine nuts in pesto.',
            ),
            N(
              'A pine nut is hard, small and tough. Collodi chose it to name a hard-headed little puppet carved from pine.',
            ),
          ],
          'Learned that pinocchio is a Tuscan word for a pine nut and why the name suits the puppet.',
        ),
      ],
      [
        {
          id: 'nose',
          label: 'Point out that the nose is growing again.',
          then: [G('I know. I’ve decided not to notice. You should try it.', 'think')],
        },
        {
          id: 'quiet',
          label: 'Keep the lamp steady and say nothing.',
          then: [
            N(
              'You keep the lamp steady. Geppetto works faster, the way people do when their work is watching them back.',
            ),
          ],
        },
      ],
    ),
    sc(
      'a13-02-carve-done',
      [
        N(
          'Geppetto carves the hands. The moment they are finished, they snatch the yellow wig off his head and put it on their own.',
        ),
        G('Pinocchio! Give that back this minute!'),
        N('Pinocchio gives it back. His eyes are laughing.'),
      ],
      [
        notice(
          2,
          'literacy',
          'burattino is Italian for a hand puppet; the book’s puppet has no strings',
          'L.3.4',
          [
            N(
              'Collodi’s word for Pinocchio is burattino, an Italian puppet worked by a hand inside it, not by strings.',
            ),
            N(
              'That is why this page never mentions strings. Pinocchio moves on his own, which is the trouble.',
            ),
          ],
          'Learned the Italian word burattino and that Collodi’s puppet is not a string puppet.',
        ),
      ],
    ),
    sc(
      'a13-02-legs',
      [
        G(
          'You young rascal. You’re not even finished, and already you have no respect for your father.',
          'sad',
        ),
        N(
          'He carves the legs and the feet. The first thing the feet do is kick him on the end of the nose.',
        ),
        G('I deserved that. I ought to have thought of it before I made them.', 'think'),
        N(
          'He sets Pinocchio on the floor to teach him to walk. You take one wooden hand, and he takes the other.',
        ),
        N(
          'The legs are stiff, then less stiff. Pinocchio takes one step, and another, and then he is running.',
        ),
        P('Ha! Legs! I’ve got LEGS!', 'happy'),
        N(
          'He is out of the door before either of you can shut it, and away down the street, clack-clack-clack on the cobbles.',
        ),
        G('Catch him! Catch him!'),
        N(
          'People in the street watch him go by, and nobody catches him. They are laughing too hard to catch anything.',
        ),
      ],
      [
        notice(
          6,
          'science',
          'walking works because the foot pushes back on the ground and friction grips',
          '3-PS2-1',
          [
            N(
              'To walk, your foot pushes backwards on the ground. Friction grips, and the ground pushes you forwards. That is an unbalanced force.',
            ),
            N(
              'Pinocchio’s first steps are wobbly because his balance and his grip are brand new. Babies learn it the same way.',
            ),
          ],
          'Learned that walking uses a push against the ground and the grip of friction, which are forces.',
        ),
      ],
    ),
    sc(
      'a13-02-street',
      [
        N(
          'At the bottom of the street a carabineer steps out and catches Pinocchio neatly by the nose. It is a very convenient nose for it.',
        ),
        N(
          'Geppetto arrives out of breath and gives him a good shake. Pinocchio throws himself on the cobbles and refuses to walk another step.',
        ),
        N(
          'A crowd gathers. The crowd decides, as crowds do, that the poor little puppet is frightened of the dreadful old man.',
        ),
        CB('Well. If that’s how he treats them, he can come along with me.'),
      ],
      [
        ask(
          3,
          'sel',
          'judging a situation from only part of what you saw',
          'CASEL: Social awareness',
          [
            N(
              'The crowd saw a puppet on the floor and a shaking old man, and decided who was in the wrong. Have you ever judged a situation from only part of it?',
            ),
          ],
          [
            o('Yes. I got it wrong, and I remember how it felt.', [
              N(
                'That’s a fair answer. Looking back is how we get better at pausing before we decide.',
              ),
            ]),
            o('I try to ask what happened first.', [
              N(
                'That’s a fair answer. Asking questions first is how a crowd could have helped Geppetto.',
              ),
            ]),
            o('I am not sure. It is hard to know what you missed.', [
              N(
                'That’s a fair answer, and it is the heart of the problem. If you cannot tell what you missed, it is wiser to wait and ask.',
              ),
            ]),
          ],
          'Reflected on how seeing only part of an event can lead to the wrong judgement.',
        ),
      ],
    ),
    sc(
      'a13-02-complete',
      [
        N('So it is Geppetto who is marched off to prison, crying all the way.'),
        G(
          'Wretched boy! I worked so hard to make him a good puppet. It serves me right. I should have thought.',
          'sad',
        ),
        N(
          'Your Nubbin, still in the felt cap he snatched up as he ran, jumps out as he goes. The carabineer walks him round the corner, and the street is empty.',
        ),
        N(
          'Pinocchio picks himself up, brushes off his knees and runs home over the fields, as fast as a hare with somewhere to be.',
        ),
        N('You follow. The room under the stairs is very quiet without the old man in it.'),
      ],
      [
        ask(
          3,
          'maths',
          'speed, distance and time',
          '4.MD.A.2',
          [
            N(
              'A hare can run about 60 kilometres every hour, which is 1 kilometre every minute. If Pinocchio could keep up that pace for 5 minutes, how far would he get?',
            ),
          ],
          [
            o(
              '5 kilometres',
              [
                N(
                  'Yes. 1 kilometre a minute for 5 minutes is 5 kilometres. Pinocchio is not quite that quick, but the idea is the same.',
                ),
              ],
              true,
            ),
            o('60 kilometres', [
              N(
                'That is how far in a whole hour. In 5 minutes it is only a small slice of the hour: 5 kilometres.',
              ),
            ]),
            o('15 kilometres', [
              N('Try 1 kilometre a minute: 1, 2, 3, 4, 5. After 5 minutes, 5 kilometres.'),
            ]),
          ],
          'Solved a speed, distance and time problem: 1 km a minute for 5 minutes is 5 km.',
        ),
      ],
    ),
  ],
  [
    gl(
      'carabineer',
      'an Italian police officer; the word comes from the carbine, a short rifle',
      'a13-02-street',
    ),
    gl(
      'burattino',
      'the Italian word for a puppet worked by a hand inside it, not by strings',
      'a13-02-carve-done',
    ),
  ],
);

// ================================================================== A13-3 The Talking-cricket
const A3: EduQuest = quest(
  'a13-03',
  'The Talking-cricket',
  {
    'a13-03-s1': {
      goal: 'Find what is going cri-cri-cri in the dark.',
      hint: 'Listen along the wall by the hearth.',
    },
    'a13-03-s2': {
      goal: 'Listen to the Talking-cricket. Then decide what to do about the hearth.',
      hint: 'Hear him out. When it goes quiet, you’ll know what you can do.',
    },
  },
  [
    sc(
      'a13-03-cri',
      [
        N(
          'Pinocchio bangs the door shut, sits on the floor and lets out a great sigh. A whole room, and nobody in it to tell him anything.',
        ),
        P(
          'Mine. All of it. The chair, the table, the painted fire. You can stay too, if you don’t tell me anything.',
          'happy',
        ),
        N('Then, from somewhere in the room, a small sound: cri-cri-cri.'),
        P('Who’s that?', 'shock'),
        N('Cri-cri-cri, from the wall by the hearth. Your Nubbin’s ears go straight up.'),
        P('It’s you, isn’t it? Doing a voice. Stop doing a voice.'),
      ],
      [
        notice(
          2,
          'science',
          'crickets make sound by rubbing their wings, and chirp faster when it is warmer',
          '1-PS4-1',
          [
            N(
              'A real cricket sings by rubbing one wing against a rough ridge on the other. The rubbing makes the wing vibrate, and a vibration is a sound.',
            ),
            N(
              'It chirps faster on a warm night and slower on a cool one. Some people count the chirps to guess the temperature.',
            ),
          ],
          'Learned that crickets chirp by vibrating their wings and chirp faster when it is warm.',
        ),
      ],
    ),
    sc(
      'a13-03-cri-done',
      [
        N(
          'There on the wall, climbing slowly upwards, is a big cricket. He has the air of somebody who has paid the rent.',
        ),
        CR(
          'It is I. The Talking-cricket. I have lived in this room for more than a hundred years.',
        ),
      ],
      [
        ask(
          0,
          'literacy',
          'figurative language: “the air of somebody who has paid the rent”',
          'L.4.5',
          [
            N(
              'The narrator says the cricket has “the air of somebody who has paid the rent”. What does that tell you about how he behaves?',
            ),
          ],
          [
            o(
              'He acts as if he belongs there and has every right.',
              [
                N(
                  'Yes. Someone who has paid the rent feels at home and expects respect. It is a joke about how grand a small cricket can look.',
                ),
              ],
              true,
            ),
            o('He is carrying coins.', [
              N(
                'The cricket doesn’t carry coins. It is an image, a picture in words, for how he stands and moves.',
              ),
            ]),
            o('He is angry about money.', [
              N(
                'He isn’t cross about money. The phrase is about confidence: he is the oldest resident, and he knows it.',
              ),
            ]),
          ],
          'Worked out the meaning of a figure of speech and how it shows character.',
        ),
      ],
    ),
    sc(
      'a13-03-cricket',
      [
        P('Well, it’s my room now. Off you go. And don’t look back.'),
        CR('I shan’t go until I have told you one great truth.', 'think'),
        CR(
          'Boys who turn their backs on their fathers, and run off from home to please themselves, come to no good. Sooner or later. Usually sooner.',
        ),
        P(
          'Sing away, Cricket. I’m off at first light. If I stay, they’ll send me to school, and I’d rather chase butterflies.',
        ),
        CR('Then you’ll grow up a perfect donkey, and everyone will laugh at you.'),
        CR('At least learn a trade. Something to earn an honest crust.'),
        P(
          'There’s only one trade I fancy. Eating, drinking, sleeping, having fun, and wandering about from morning till night.',
          'happy',
        ),
        CR(
          'Everyone who follows that trade ends up in hospital or in prison. I am sorry for you, Pinocchio.',
          'sad',
        ),
        P('Sorry? Why?'),
        CR('Because you are a puppet. And, worse, because you have a wooden head.'),
        N(
          'Pinocchio grabs the mallet off the bench and throws it, not really aiming. That is the trouble with not really aiming.',
        ),
        N(
          'It catches the cricket and knocks him clean off the wall, down into the cold ash of the hearth. Then nothing.',
        ),
        P('I didn’t… He shouldn’t have said wooden head. He shouldn’t have.', 'shock'),
      ],
      [
        ask(
          12,
          'sel',
          'responsibility for something you did without meaning to',
          'CASEL: Responsible decision-making',
          [
            N(
              'Pinocchio says “not really aiming”. He didn’t mean to hit the cricket. Does that make it not his fault?',
            ),
          ],
          [
            o('It still matters. He threw it, so he should put it right.', [
              N(
                'That’s a fair answer. Not meaning to hurt someone doesn’t take the hurt away, and putting it right is what makes it better.',
              ),
            ]),
            o('Not at all his fault. It was an accident.', [
              N(
                'That’s a fair answer. Accidents happen. But a careless throw while you are angry is not quite the same as a true accident.',
              ),
            ]),
            o('Partly. The cricket provoked him, but he still threw it.', [
              N(
                'That’s a fair answer, and probably the closest to the truth. Both things can be true at once.',
              ),
            ]),
          ],
          'Thought about responsibility when you hurt someone without quite meaning to.',
        ),
      ],
      [
        {
          id: 'search',
          label: 'Search the hearth.',
          set: { 'a13-cricket': 'carried' },
          then: [
            N(
              'You kneel at the hearth and sift the ash with your fingers. Your Nubbin finds him first, and squeaks.',
            ),
            N(
              'He is on his back, grey with ash, one leg going round and round like a little wheel. He is very much alive, and very cross.',
            ),
            CR(
              'I am not hurt. I am insulted. There is a difference, and I am a hundred years old, and I know it.',
              'angry',
            ),
            N(
              'You carry him out in your cupped hands to the hedge by the door, and set him on a leaf. He straightens his feelers with great dignity.',
            ),
            CR('Thank you. Tell him nothing. He wouldn’t listen. He never listens.'),
          ],
        },
        {
          id: 'leave',
          label: 'Leave it. It’s his mess to put right.',
          set: { 'a13-cricket': 'left' },
          then: [
            N(
              'You leave it. Pinocchio looks at the hearth for a long time, and then turns his back on it.',
            ),
            N(
              'Later, when he isn’t looking, you look. There is a tiny track through the ash, all the way to the crack under the door.',
            ),
            N('Whatever made it was walking. Slowly, and in a temper, but walking.'),
          ],
        },
      ],
    ),
    sc(
      'a13-03-cricket-done',
      [
        N(
          'The room is quiet. Pinocchio sits at the table with his chin on his fists and says nothing for a long time, which for him is a minute.',
        ),
        P('Anyway. I’m hungry.'),
      ],
      [
        ask(
          1,
          'literacy',
          'a character’s motive when he changes the subject',
          'RL.3.3',
          [
            N(
              'After a long silence Pinocchio says, “Anyway. I’m hungry.” Why might he change the subject like that?',
            ),
          ],
          [
            o(
              'He feels guilty and does not want to talk about it.',
              [
                N(
                  'Yes. People often change the subject when something is too uncomfortable to face.',
                ),
              ],
              true,
            ),
            o('He has completely forgotten the cricket.', [
              N(
                'He sat in silence for a whole minute, which for him is a long time. He hasn’t forgotten.',
              ),
            ]),
            o('He is just greedy.', [
              N('He is hungry, but the long quiet before it hints at something else underneath.'),
            ]),
          ],
          'Inferred a character’s hidden feeling from how he behaves.',
        ),
      ],
    ),
    sc(
      'a13-03-complete',
      [
        N('Night comes on, and with it a hunger like a small dog barking inside him.'),
        P('Do you think the cricket was right? No. Don’t answer. I’m too hungry for answers.'),
        N(
          'You don’t answer, and your Nubbin curls up against your boot. Outside, the wind is getting up.',
        ),
        P('Is there any supper? There’s always supper. Somewhere.'),
      ],
      [
        notice(
          0,
          'health',
          'tummy rumbles come from the gut moving food and air about',
          '4-LS1-1',
          [
            N(
              'When your stomach rumbles, the muscles in your gut are squeezing air and liquid along. This happens all the time, and you hear it more when your stomach is empty.',
            ),
            N(
              'So a rumble does not mean something is wrong. It means your body is getting ready for the next meal.',
            ),
          ],
          'Learned that a rumbling tummy is the gut’s muscles moving air and liquid, and is normal.',
        ),
      ],
    ),
  ],
  [gl('provoke', 'to make someone angry or upset on purpose or by accident', 'a13-03-cricket')],
);

// ================================================================== A13-4 The Flying Egg
const A4: EduQuest = quest(
  'a13-04',
  'The Flying Egg',
  {
    'a13-04-s1': {
      goal: 'Help Pinocchio look for something to eat.',
      hint: 'Try the cupboard, the drawers, and the heap of sweepings in the corner.',
    },
    'a13-04-s2': {
      goal: 'Watch Pinocchio cook his egg.',
      hint: 'Stand back from the pan. Something is about to happen to it.',
    },
    'a13-04-s3': {
      goal: 'Go with Pinocchio into the storm, to the village.',
      hint: 'Keep your Nubbin under your coat. It’s a long way for very little.',
    },
  },
  [
    sc(
      'a13-04-hungry',
      [
        N(
          'Pinocchio runs to the fire to lift the lid off the pot. His nose goes straight through the canvas, where the pot is painted on it.',
        ),
        P('Painted. Even the soup’s painted. What kind of house is this?', 'sad'),
        N(
          'He tries the drawers: a button, a cork, a bent nail. He tries the cupboard: dust, and a smell of dust.',
        ),
        N('He would eat anything now: a cherry stone, a fish bone, the crust off a crust.'),
        P('The cricket said this would happen. Not this exactly. He didn’t mention soup.'),
        N(
          'Your Nubbin goes to the heap of sweepings in the corner and begins to dig, as if it has an idea.',
        ),
      ],
      [
        doit(
          2,
          'science',
          'sorting materials by their properties: cork floats, a nail sinks',
          '2-PS1-1',
          'edu:sort:drawer-things:float-or-sink',
          [
            N(
              'Sort what is in Geppetto’s drawer by what it is made of: wood and cork on one side, iron on the other.',
            ),
            N(
              'Then guess which will float. Cork and wood are light for their size, so they float. A bent iron nail is heavy for its size, so it sinks.',
            ),
          ],
          'Sorted everyday objects by material and predicted which would float or sink.',
        ),
      ],
      [
        {
          id: 'dig',
          label: 'Dig with your Nubbin.',
          then: [N('You dig too. It isn’t dignified, but it’s company.')],
        },
        {
          id: 'cheer',
          label: 'Tell Pinocchio there’s sure to be something.',
          then: [
            P('There’d better be. I’m wooden all the way through, and all of it is empty.', 'sad'),
          ],
        },
      ],
    ),
    sc(
      'a13-04-hungry-done',
      [
        N('In the sweepings there is something round and white. An egg!'),
        P(
          'An egg! A whole egg! I’ll fry it. No, I’ll poach it. No, I can’t wait to decide. I’ll fry it.',
          'happy',
        ),
      ],
      [
        ask(
          1,
          'science',
          'the life cycle of a chicken',
          '3-LS1-1',
          [
            N(
              'A hen sits on her eggs to keep them warm. About how long does it take for a chick to grow and hatch?',
            ),
          ],
          [
            o(
              'About 3 weeks (21 days).',
              [
                N(
                  'Yes. A chick grows for about 21 days, fed by the yolk, kept warm by its mother. Then it pecks its way out.',
                ),
              ],
              true,
            ),
            o('About 3 hours.', [
              N(
                'Far too quick! A whole chick needs time to grow bones, feathers and a beak. It takes about three weeks.',
              ),
            ]),
            o('About 3 months.', [
              N('A bit too long. Chicks hatch after about three weeks of warmth.'),
            ]),
          ],
          'Learned that a chick takes about 21 days to grow inside its egg.',
        ),
      ],
    ),
    sc(
      'a13-04-egg',
      [
        N(
          'He sets a little pan on the brazier, with a drop of water in it for want of oil. The water begins to steam.',
        ),
        N(
          'He cracks the egg over the pan. Out of it, instead of a yolk, comes a small, fluffy and extremely polite chick.',
        ),
        CH(
          'Many thanks, Master Pinocchio, for saving me the trouble of breaking the shell.',
          'happy',
        ),
        CH('Good evening. Kind regards to all at home.'),
        N('It flies out of the open window and away into the dark.'),
        N('Pinocchio stands with the empty shell in his hands and his mouth wide open.'),
        P(
          'The cricket was right. The cricket was RIGHT. I wish I’d never run off. Babbo would have fed me.',
          'sad',
        ),
      ],
      [
        ask(
          6,
          'sel',
          'regret: wishing something had been different, and what comes next',
          'CASEL: Self-awareness',
          [
            N(
              'Pinocchio says, “I wish I’d never run off.” Is wishing enough to put something right?',
            ),
          ],
          [
            o('No. You have to do something about it as well.', [
              N(
                'That’s a fair answer. A wish can start the change, but a sorry, a repair or a new choice finishes it.',
              ),
            ]),
            o('Yes. Once you truly feel sorry, it is fixed.', [
              N(
                'That’s a fair answer. Truly feeling sorry is the first step, and it matters. But the person you hurt may need to hear it or see it.',
              ),
            ]),
            o('It depends what went wrong.', [
              N(
                'That’s a fair answer. Some things need only a thought, some need an apology, and some need real repair.',
              ),
            ]),
          ],
          'Thought about what regret is and whether wishing is enough to put things right.',
        ),
      ],
    ),
    sc(
      'a13-04-egg-done',
      [
        N('Outside, the wind has turned into a storm. Pinocchio puts his cap on.'),
        P(
          'There’s a village. Somebody in it will give me bread. I’ll ask nicely. I can ask nicely.',
        ),
      ],
      [
        ask(
          1,
          'social-studies',
          'why many Tuscan villages are built on hills',
          'D2.Geo.2.K-2',
          [
            N(
              'Many old Tuscan villages sit on top of hills, with the farm fields below. Why might people have built them there long ago?',
            ),
          ],
          [
            o(
              'To see enemies coming, and to be easy to defend.',
              [
                N(
                  'Yes. A hilltop gives a long view and is harder to attack. The fields and vines stayed down below in the good soil.',
                ),
              ],
              true,
            ),
            o('Because hills are warmer in winter.', [
              N(
                'Sometimes, but the main reason was safety: a hilltop is easier to watch and defend.',
              ),
            ]),
            o('Because nobody wanted the valley.', [
              N(
                'The valleys are the best farmland! People built homes up on the hills to keep safe, and walked down to farm.',
              ),
            ]),
          ],
          'Learned why many old Tuscan villages stand on hilltops: for the view and for defence.',
        ),
      ],
    ),
    sc(
      'a13-04-storm',
      [
        N(
          'The night is black, with thunder rolling over the hills and lightning that turns the road white. The village is shut up tight.',
        ),
        N(
          'Every shutter is closed, and there isn’t even a dog in the street. It is like a village put away in a drawer for the night.',
        ),
        N('Pinocchio finds a doorbell and pulls it, and pulls it again, and goes on pulling it.'),
        NC('What do you want at this hour?', 'angry'),
        N('An old man in a nightcap has put his head out of the window above.'),
        P('Will you be kind enough to give me a bit of bread?'),
        NC('Wait there. I’ll be straight down.'),
        N(
          'He isn’t straight down. He comes back to the window with a basin, and empties the whole of it over Pinocchio’s head.',
        ),
      ],
      [
        ask(
          0,
          'maths',
          'estimating distance from the gap between lightning and thunder',
          '4.MD.A.2',
          [
            N(
              'Light arrives at once, but sound is slow: about 3 seconds for every kilometre. You count 6 seconds between a flash and its thunder. How far away is the lightning?',
            ),
          ],
          [
            o(
              'About 2 kilometres.',
              [
                N(
                  'Yes. 6 seconds at 3 seconds a kilometre is 2 kilometres. A bigger gap means a farther storm.',
                ),
              ],
              true,
            ),
            o('About 6 kilometres.', [N('Divide the 6 seconds by 3: it is 2 kilometres, not 6.')]),
            o('About 18 kilometres.', [
              N('You multiplied. We divide: 6 seconds ÷ 3 seconds per kilometre = 2 kilometres.'),
            ]),
          ],
          'Estimated how far lightning is by dividing the seconds before thunder by 3.',
        ),
      ],
    ),
    sc(
      'a13-04-storm-done',
      [
        N(
          'You walk back together through the rain, Pinocchio dripping and you dripping. Your Nubbin, under your coat, is the only dry thing in the world.',
        ),
        N(
          'At home he puts his wet feet up on the brazier to dry, and falls asleep in the chair. You sleep in the corner.',
        ),
      ],
      [
        ask(
          1,
          'science',
          'burning is a change that cannot be reversed',
          '2-PS1-4',
          [
            N(
              'Pinocchio’s wooden feet are on the glowing brazier all night. Which change could be reversed afterwards: a puddle freezing and thawing, or wood burning to charcoal?',
            ),
          ],
          [
            o(
              'The puddle. Wood cannot be un-burnt.',
              [
                N(
                  'Yes. Water freezes and melts back again, but burnt wood becomes charcoal and ash for good.',
                ),
              ],
              true,
            ),
            o('The wood, with some glue.', [
              N(
                'Glue can join pieces, but it cannot turn charcoal back into wood. Burning changes the material itself.',
              ),
            ]),
            o('Neither can be reversed.', [
              N('Freezing is reversible: thaw the ice and you have water again. Burning is not.'),
            ]),
          ],
          'Learned that melting and freezing can be reversed but burning cannot.',
        ),
      ],
    ),
    sc(
      'a13-04-complete',
      [
        N('In the morning there is a knock at the door. Pinocchio wakes up, yawning.'),
        G('Pinocchio! It’s me. Open the door.'),
        P('Babbo!', 'happy'),
        N('He jumps up to run to the door, and falls flat on his face.'),
        N(
          'In the night his feet have burned away on the brazier, right down to two black stumps. He didn’t feel a thing; he’s wood.',
        ),
        N('Which is a mercy, and also the whole problem.'),
      ],
      [
        notice(
          4,
          'health',
          'pain is a warning signal that protects us',
          '4-LS1-2',
          [
            N(
              'Pinocchio felt nothing, and that is the problem. In people and animals, pain is an alarm: nerves tell the brain “move away, this is harming you”.',
            ),
            N(
              'Without it we would not pull our hands from a hot pan. Pain is unpleasant, but it is one of the senses that keeps us alive.',
            ),
          ],
          'Learned that pain is a protective signal sent by the nerves, so feeling it helps keep us safe.',
        ),
      ],
    ),
  ],
  [
    gl(
      'brazier',
      'a metal pan or stand that holds a fire or hot coals to warm a room',
      'a13-04-egg',
    ),
    gl('sweepings', 'the dust and scraps swept up from a floor', 'a13-04-hungry'),
  ],
);

// ================================================================== A13-5 Three Pears
const A5: EduQuest = quest(
  'a13-05',
  'Three Pears',
  {
    'a13-05-s1': {
      goal: 'Let Geppetto in.',
      hint: 'Pinocchio can’t reach the door now. The window is open; give Geppetto a hand over the sill.',
    },
    'a13-05-s2': {
      goal: 'Help with breakfast: three pears, peeled.',
      hint: 'Pinocchio wants them peeled. Don’t throw the peel away. You’ll see.',
    },
    'a13-05-s3': {
      goal: 'Wait at the window while Geppetto goes out into the snow.',
      hint: 'Keep the room warm for him. Watch the road.',
    },
  },
  [
    sc(
      'a13-05-window',
      [
        P('Babbo, I can’t open the door! My feet have gone!', 'sad'),
        G('Gone? Gone where? Open this door at once.'),
        P('I can’t stand up! I’ll have to walk on my knees for the rest of my life!'),
        N(
          'Geppetto thinks this is another trick, so he climbs in through the window. He tries to; he is not a young man, and it is not a large window.',
        ),
        N('You lean out and take his arm, and he comes over the sill like a sack of meal.'),
        G('Now, you young— Oh. Oh, my boy. Your feet.', 'shock'),
        N(
          'He came in meaning to give Pinocchio the scolding of his life. He looks at the feet, and gathers him up instead, and kisses him.',
        ),
      ],
      [
        ask(
          6,
          'sel',
          'choosing comfort before a scolding when someone is hurt',
          'CASEL: Social awareness',
          [
            N(
              'Geppetto came in to scold, and hugged instead. When should the scolding come, if at all?',
            ),
          ],
          [
            o('After the person is safe and calm, if it is still needed.', [
              N('That’s a fair answer. People hear a lesson much better once they feel safe.'),
            ]),
            o('Straight away, while it is fresh.', [
              N(
                'That’s a fair answer. A quick word can help. But if someone is frightened or hurt, they won’t take it in.',
              ),
            ]),
            o('Never. A hug teaches more.', [
              N(
                'That’s a fair answer. Kindness teaches a lot, though sometimes a lesson needs to be said as well.',
              ),
            ]),
          ],
          'Thought about when to comfort and when to correct someone who is hurt.',
        ),
      ],
    ),
    sc(
      'a13-05-window-done',
      [
        P('I’m so hungry, Babbo. I’ve had nothing but a chick, and the chick left.', 'sad'),
        N(
          'Geppetto takes three pears out of his pocket: his breakfast. He holds them out and says nothing about it.',
        ),
      ],
      [
        ask(
          1,
          'maths',
          'sharing equally: halves',
          '3.NF.A.1',
          [
            N(
              'Imagine Geppetto cut the three pears in half and shared them equally with Pinocchio. How many halves would each of them get?',
            ),
          ],
          [
            o(
              '3 halves each.',
              [
                N(
                  'Yes. Three pears make 6 halves, and 6 shared by 2 is 3 halves each: one and a half pears.',
                ),
              ],
              true,
            ),
            o('6 halves each.', [
              N('There are 6 halves in total. Shared between 2 people, it is 3 each.'),
            ]),
            o('2 halves each.', [
              N('Count them: 3 pears × 2 halves = 6 halves. Split between two, each gets 3.'),
            ]),
          ],
          'Used halves to share three pears equally between two people.',
        ),
      ],
    ),
    sc(
      'a13-05-pears',
      [
        P('Peel them for me, please. I can’t eat skins. I’m very particular.'),
        G('Particular. At your age. With your feet in the fire. Well, well.', 'think'),
        N('He peels them anyway, and lays the peel and the cores in a corner of the table.'),
        N(
          'Pinocchio eats the first pear in two bites and throws the core away. Then the second, then the third.',
        ),
        P('I’m still hungry.', 'sad'),
        G('Well, I’ve nothing else. Except the peel and the cores.'),
        P('I don’t eat peel. I don’t eat cores.'),
        N('He looks at them for quite a long while.'),
      ],
      [
        ask(
          1,
          'science',
          'seeds spread by animals, and a seed inside a fruit',
          '2-LS2-2',
          [
            N(
              'Pinocchio throws away a pear core with the little seeds in it. How might an animal help a fruit’s seeds travel and grow?',
            ),
          ],
          [
            o(
              'It eats the fruit and drops the seeds somewhere new.',
              [
                N(
                  'Yes. Birds and animals eat fruit and carry the seeds away. Many seeds even sprout better after being eaten and dropped.',
                ),
              ],
              true,
            ),
            o('It plants them with its paws.', [
              N(
                'A few animals bury seeds, like squirrels with nuts. But eating and dropping them is the most common way.',
              ),
            ]),
            o('Animals do not help seeds at all.', [
              N(
                'They do a great deal! Birds, mice and foxes carry fruit and spread seeds far from the parent tree.',
              ),
            ]),
          ],
          'Learned that animals spread seeds by eating fruit and dropping or burying the seeds.',
        ),
      ],
      [
        {
          id: 'ask',
          label: 'Ask Geppetto whether he has eaten.',
          then: [
            G('Me? Oh, yes. Ages ago. Hours.', 'happy'),
            N('His stomach rumbles, loudly. He talks over it.'),
          ],
        },
        {
          id: 'save',
          label: 'Put the peel and cores on a plate, for later.',
          then: [
            N(
              'You put them on a plate. Pinocchio says he won’t, and you say nothing, and the plate waits.',
            ),
          ],
        },
      ],
    ),
    sc(
      'a13-05-pears-done',
      [
        N('A minute later the peel is gone, and the cores after it. Pinocchio pats his front.'),
        P('I feel very well now.', 'happy'),
        G('You see? It doesn’t pay to be too fussy, my boy. You never know what’s coming.'),
      ],
      [
        ask(
          2,
          'social-studies',
          'scarcity: when there is not enough, we choose between needs and wants',
          'D2.Eco.1.K-2',
          [
            N(
              'Geppetto has only enough for one breakfast. He gave it all away. In a hard time, how do we decide what to spend on first?',
            ),
          ],
          [
            o(
              'Needs first, like food and warmth, then wants.',
              [
                N(
                  'Yes. A need is something you must have to be well. A want is nice but can wait. Choosing needs first is how families get through hard times.',
                ),
              ],
              true,
            ),
            o('Wants first, because they make us happy.', [
              N('Wants do bring joy. But if the needs go unmet, the joy does not last long.'),
            ]),
            o('Whatever is cheapest.', [
              N(
                'Cheap helps, but it is not the test. Ask first: do I need this to be safe, fed and warm?',
              ),
            ]),
          ],
          'Learned to sort needs from wants when there is not enough to go round.',
        ),
      ],
    ),
    sc(
      'a13-05-snow',
      [
        N(
          'Pinocchio cries for new feet until Geppetto gives in. They take an hour, and they are the best feet he has ever made.',
        ),
        N(
          'From the offcut, while the glue dries, he starts a little wooden Nubbin for you. He gets as far as the ears.',
        ),
        G('I’ll finish it tomorrow. There’s always tomorrow for the small things.', 'happy'),
        P(
          'Babbo, I’ll go to school! I’ll learn a trade, and I’ll look after you when you’re old.',
          'happy',
        ),
        N(
          'Geppetto makes him a suit out of flowered paper, a pair of shoes out of bark, and a cap out of the soft middle of a loaf.',
        ),
        N(
          'Pinocchio admires himself in a basin of water. He looks, he says, exactly like a gentleman.',
        ),
        P('But I haven’t got a spelling-book. You can’t go to school without a spelling-book.'),
        G('No. You can’t.', 'think'),
        N(
          'Geppetto has no money at all. He puts on his old coat, all patches and darns, and goes out, and it is snowing.',
        ),
      ],
      [
        notice(
          8,
          'science',
          'a coat keeps you warm by trapping air and slowing heat loss',
          '4-PS3-2',
          [
            N(
              'Heat flows from warm things to cold ones, so your body is always losing a little to the winter air.',
            ),
            N(
              'A coat does not make heat. It traps a layer of still air and wool, which slows the escape. Geppetto’s patched old coat was doing that job.',
            ),
          ],
          'Learned that a coat slows the loss of body heat by trapping a layer of air.',
        ),
      ],
    ),
    sc(
      'a13-05-coat',
      [...COAT],
      [
        ask(
          4,
          'sel',
          'a kind not-quite-truth: is it ever right?',
          'CASEL: Responsible decision-making',
          [
            N(
              'Geppetto says his coat “was too warm”, in the snow. It is not true. Is it ever right to say something that isn’t quite true, to be kind?',
            ),
          ],
          [
            o('Yes, when the truth would only add to someone’s worry.', [
              N(
                'That’s a fair answer. Geppetto does it out of love, so Pinocchio will not carry the cost. But he also hides something that Pinocchio might want to know.',
              ),
            ]),
            o('No. A better kindness is to be honest.', [
              N(
                'That’s a fair answer. A kindness built on the truth is more lasting. But it is hard to see how Geppetto could have said it gently.',
              ),
            ]),
            o('It depends how much the truth matters.', [
              N(
                'That’s a fair answer. A gift hidden to spare a child’s guilt is not the same as hiding a danger. Where do you draw the line?',
              ),
            ]),
          ],
          'Thought about whether a loving, not-quite-true remark can be right.',
        ),
      ],
    ),
    sc(
      'a13-05-complete',
      [
        N(
          'Next morning the snow has stopped. Pinocchio sets off for school with his book under his arm, talking all the way.',
        ),
        P('Today I learn to read. Tomorrow, to write. The day after, sums.', 'happy'),
        P(
          'Then I’ll earn lots of money, and buy Babbo a new coat. A gold one. With diamonds for buttons.',
        ),
        N(
          'Geppetto watches him go from the doorway, in his shirt-sleeves, and doesn’t feel the cold at all. Or says he doesn’t.',
        ),
        N('The half-carved Nubbin sits on the bench, ears and nothing else, waiting for tomorrow.'),
      ],
      [
        ask(
          2,
          'literacy',
          'predicting what will happen from what a character has already done',
          'RL.3.3',
          [
            N(
              'Pinocchio promises school, work and a gold coat. He has made promises like this before. What do you predict will happen?',
            ),
          ],
          [
            o(
              'He will get distracted again.',
              [
                N(
                  'Probably! His past behaviour, running off and chasing butterflies, is the clue. Good readers use clues like that.',
                ),
              ],
              true,
            ),
            o('He will keep every promise.', [
              N(
                'It is a nice hope. But he has said sweet things and then run off already, so the story gives us reason to doubt.',
              ),
            ]),
            o('He will turn into a boy by lunchtime.', [
              N(
                'That would be quick! Nothing in the story so far suggests it. Look at what he has done instead.',
              ),
            ]),
          ],
          'Made a prediction using clues from a character’s earlier actions.',
        ),
      ],
    ),
  ],
  [gl('particular', 'fussy: hard to please about small details', 'a13-05-pears')],
);

// ================================================================== A13-6 The Puppet Show
const A6: EduQuest = quest(
  'a13-06',
  'The Puppet Show',
  {
    'a13-06-s1': {
      goal: 'Walk Pinocchio to school.',
      hint: 'Keep to the road. Something down by the sea is making a lot of noise.',
    },
    'a13-06-s2': {
      goal: 'Get into the puppet theatre.',
      hint: 'You have no ticket. Your Nubbin knows a gap under the canvas.',
    },
  },
  [
    sc(
      'a13-06-road',
      [
        N(
          'Halfway to school there is music: fifes, and a big drum going boom, boom, from down towards the sea.',
        ),
        P('Do you hear that? Fifes. And a drum.', 'happy'),
        P(
          'School will be there tomorrow. School is always there. That’s the whole point of school.',
        ),
        N(
          'He stands in the middle of the road, one foot pointing to school and one foot pointing to the music.',
        ),
        P('Today, the music. Tomorrow, school. School can’t run away.'),
        N(
          'At the bottom of the hill there is a great painted tent with flags on it. The poster says THE GREAT PUPPET THEATRE.',
        ),
      ],
      [
        ask(
          1,
          'music',
          'pitch: faster vibrations make higher sounds',
          '1-PS4-1',
          [
            N(
              'A fife is a tiny, shrill flute. The big drum goes “boom”. Which one makes the higher note, and why?',
            ),
          ],
          [
            o(
              'The fife: its air column is short and vibrates fast.',
              [
                N(
                  'Yes. A fast vibration gives a high note and a slow one gives a low note. A small fife vibrates quickly; a big drum skin moves slowly.',
                ),
              ],
              true,
            ),
            o('The drum: it is louder.', [
              N(
                'Loud and high are different. Pitch is about how fast something vibrates. A big drum vibrates slowly, so its note is low.',
              ),
            ]),
            o('They make the same note.', [
              N(
                'Listen again: the fife squeaks high, the drum thuds low. Fast vibration is high; slow vibration is low.',
              ),
            ]),
          ],
          'Learned that pitch depends on the speed of a vibration: fast is high, slow is low.',
        ),
      ],
      [
        {
          id: 'coat',
          label: 'Remind him what the spelling-book cost.',
          then: [
            P('I know what it cost! I’ll go tomorrow. I’ll go twice tomorrow.', 'angry'),
            N('He doesn’t look at you while he says it.'),
          ],
        },
        {
          id: 'let',
          label: 'Say nothing. It’s his road.',
          then: [N('You say nothing. He looks at you, as if he’d been hoping you would.')],
        },
      ],
    ),
    sc(
      'a13-06-road-done',
      [
        N(
          'A ticket costs four pennies, and Pinocchio hasn’t got four pennies. He has a spelling-book.',
        ),
        N(
          'He sells it to a man who deals in old clothes, for four pennies exactly, before you can catch his arm.',
        ),
      ],
      [
        ask(
          1,
          'social-studies',
          'what something is worth: cost, value and trade-offs',
          'D2.Eco.1.K-2',
          [
            N(
              'The book cost Geppetto his only coat. Pinocchio sold it for one evening’s ticket. Is something worth only what someone will pay for it?',
            ),
          ],
          [
            o('No. It is worth what it cost the person who gave it.', [
              N(
                'That’s a fair answer. The four pennies were the price, but the coat was the cost, and it was paid in cold and love.',
              ),
            ]),
            o('Yes. A thing is worth what it will sell for.', [
              N(
                'That’s a fair answer for the market. But some things are valued for who gave them, and the market misses that.',
              ),
            ]),
            o('It depends who is asking.', [
              N(
                'That’s a fair answer. To a shopkeeper, four pennies; to Geppetto, a coat. Both are true at once.',
              ),
            ]),
          ],
          'Thought about the difference between what a thing sells for and what it cost to the giver.',
        ),
      ],
    ),
    sc(
      'a13-06-show',
      [
        N(
          'You crawl in under the canvas behind your Nubbin, and find a place at the back among the boots.',
        ),
        N(
          'The curtain is up. On the stage Harlequin and Punchinello are quarrelling, as they always do, and about to hit each other with a stick.',
        ),
        N(
          'The audience is laughing so much it hurts. Then Harlequin stops, and points out over everybody’s heads.',
        ),
        HQ('Look! Look there! Is it? It IS!', 'shock'),
        PU('Our brother! It’s our brother Pinocchio!', 'happy'),
        N(
          'Every puppet on the stage runs to the front. Pinocchio jumps from the cheap seats to the band, and from the band onto the stage.',
        ),
        N('Such hugging, such kissing, such friendly punches on the nose!'),
        N(
          'The audience shouts for the show; they have paid. The puppets don’t care: they have a brother back.',
        ),
      ],
      [
        notice(
          1,
          'social-studies',
          'Harlequin and Punchinello come from the old Italian masked theatre, commedia dell’arte',
          'D2.His.2.K-2',
          [
            N(
              'Harlequin and Punchinello are stock characters from commedia dell’arte, Italian street theatre that began in the 1500s. Actors in masks acted out the same types again and again.',
            ),
            N(
              'Harlequin wears a patchwork of coloured diamonds and is quick and clever. Punchinello, from Naples, wears white and a black mask with a hooked nose. Punch of “Punch and Judy” is his English cousin.',
            ),
          ],
          'Learned that Harlequin and Punchinello are traditional masked characters from Italian commedia dell’arte.',
        ),
        ask(
          7,
          'sel',
          'belonging: how a warm welcome feels',
          'CASEL: Social awareness',
          [
            N(
              'The puppets stop their own show to hug someone they have never met. Why might a welcome like that matter so much to Pinocchio?',
            ),
          ],
          [
            o('He has never belonged anywhere before.', [
              N(
                'That’s a fair answer. He is two days old and has run from everyone. Here, people like him are glad he exists.',
              ),
            ]),
            o('He likes being the centre of attention.', [
              N(
                'That’s a fair answer too. Pinocchio does love a crowd. Being wanted and being watched can feel alike at first.',
              ),
            ]),
            o('It doesn’t matter much; it’s only a show.', [
              N(
                'That’s a fair answer to think about. Notice, though, that the puppets choose their brother over the paying audience.',
              ),
            ]),
          ],
          'Thought about belonging, and how it feels to be welcomed by people like you.',
        ),
      ],
    ),
    sc(
      'a13-06-show-done',
      [
        N(
          'Then the showman comes out. He is a giant of a man, with a black beard that reaches the floor, so that he treads on it when he walks.',
        ),
        N(
          'His mouth is as wide as an oven, and his eyes are like two red lanterns. He cracks a long whip, and every puppet goes still.',
        ),
        FE('What is all this? Who is that?', 'angry'),
      ],
      [
        ask(
          1,
          'literacy',
          'similes: comparing with like or as',
          'L.4.5',
          [
            N(
              '“His eyes are like two red lanterns.” Which of these is also a simile, a comparison using like or as?',
            ),
          ],
          [
            o(
              'His beard was as long as a river.',
              [
                N(
                  'Yes. It compares the beard to a river using “as … as”. Similes make us picture something bigger than the plain words do.',
                ),
              ],
              true,
            ),
            o('His beard was a river of black.', [
              N(
                'That is a metaphor: it says one thing IS another. A simile uses “like” or “as” to compare.',
              ),
            ]),
            o('He had a very long beard.', [
              N(
                'That is a plain description. A simile compares one thing to another, with “like” or “as”.',
              ),
            ]),
          ],
          'Identified a simile and told it apart from a metaphor and a plain description.',
        ),
      ],
    ),
    sc(
      'a13-06-complete',
      [
        N('Nobody answers. Even the drum has stopped.'),
        FE('We’ll see about him after the show. Hang him on the nail.'),
        N(
          'Pinocchio is hung by the back of his paper jacket on a nail in the wings, among the other puppets, kicking his bark heels.',
        ),
        N('The showman is called Fire-eater. You hope it is only a name.'),
      ],
      [
        notice(
          3,
          'health',
          'real fire-eating is a dangerous skill that only trained performers should do',
          'CASEL: Responsible decision-making',
          [
            N(
              'Real fire-eaters are trained performers who have practised for years, with safety crews close by, and even then they are sometimes burned.',
            ),
            N(
              'Fire is never a game. If you ever see a flame that is out of control, move away, and tell a grown-up straight away.',
            ),
          ],
          'Learned that fire is dangerous, that only trained performers handle it, and to tell a grown-up about uncontrolled flame.',
        ),
      ],
    ),
  ],
  [
    gl('fife', 'a small, high-pitched flute, often played with a drum', 'a13-06-road'),
    gl(
      'commedia dell’arte',
      'a kind of Italian theatre with masked stock characters, which began in the 1500s',
      'a13-06-show',
    ),
  ],
);

// ================================================================== A13-7 Fire-eater Sneezes
const A7: EduQuest = quest(
  'a13-07',
  'Fire-eater Sneezes',
  {
    'a13-07-s1': {
      goal: 'Follow the puppets to Fire-eater’s kitchen.',
      hint: 'Keep behind Harlequin. Fire-eater doesn’t look down much.',
    },
    'a13-07-s2': {
      goal: 'Stay close while Pinocchio pleads for Harlequin.',
      hint: 'Stand near. This bit is his.',
    },
  },
  [
    sc(
      'a13-07-kitchen',
      [
        N(
          'After the show Fire-eater sits down to his supper. A whole sheep is turning on a spit before the fire, and the fire is getting low.',
        ),
        FE(
          'Wood. Not enough wood. Bring me that new puppet. He’s good dry pine; he’ll burn beautifully.',
        ),
        N(
          'Harlequin and Punchinello look at each other. Then they go, because when Fire-eater says go, everybody goes.',
        ),
        N('They come back with Pinocchio between them, wriggling like an eel.'),
        P('Babbo! Babbo, save me! I don’t want to burn!', 'shock'),
        N(
          'Fire-eater looks terrible. But he isn’t so very wicked underneath, if you can find underneath.',
        ),
        N(
          'He goes pale, his nose twitches and his eyes water. He holds it, and holds it, and then he sneezes.',
        ),
        HQ(
          'Good news, brother. When he sneezes, it means he’s sorry for you. You’re saved.',
          'happy',
        ),
      ],
      [
        notice(
          7,
          'health',
          'a sneeze is a reflex that clears the nose; sneeze into your elbow to stop germs spreading',
          '4-LS1-1',
          [
            N(
              'A sneeze is a reflex: you cannot decide it. Something tickles the lining of your nose, and the body blasts the tickle out at high speed.',
            ),
            N(
              'Droplets from a sneeze travel metres, so a good habit is to sneeze into your elbow, then wash your hands.',
            ),
          ],
          'Learned that a sneeze is a reflex that clears the nose, and that sneezing into an elbow stops germs spreading.',
        ),
      ],
      [
        {
          id: 'speak',
          label: 'Step forward and speak up for Pinocchio.',
          then: [
            FE('And who are you? A traveller? Sit down, traveller. You’re in my light.'),
            N('You sit. But he looks at you twice after that.'),
          ],
        },
        {
          id: 'hold',
          label: 'Hold your Nubbin tight and keep still.',
          then: [
            N(
              'You keep still. Your Nubbin, held tight, watches the whip the way you’d watch a wasp.',
            ),
          ],
        },
      ],
    ),
    sc(
      'a13-07-kitchen-done',
      [
        FE('Very well. I won’t burn you. But my mutton must be cooked.', 'think'),
        FE('Bring me Harlequin. He’s good dry wood too.'),
      ],
      [
        ask(
          1,
          'literacy',
          'a character who is gruff outside and soft inside',
          'RL.3.3',
          [
            N(
              'Fire-eater roars and threatens, yet he sneezes because he feels sorry. How would you describe his character?',
            ),
          ],
          [
            o(
              'Gruff on the outside, but tender-hearted underneath.',
              [
                N(
                  'Yes. His sneeze gives him away: the body says what the mouth will not. Good writers show a feeling instead of just saying it.',
                ),
              ],
              true,
            ),
            o('Pure villain with no good in him.', [
              N(
                'A pure villain would not sneeze. The sneeze is the writer’s clue that something softer is hidden.',
              ),
            ]),
            o('Completely kind and gentle.', [
              N(
                'He threatens to burn a puppet, so he is not simply gentle. He is both, which makes him interesting.',
              ),
            ]),
          ],
          'Described a character who is rough on the outside but soft inside, using a clue from the text.',
        ),
      ],
    ),
    sc(
      'a13-07-harlequin',
      [
        N(
          'Two wooden guards fetch Harlequin. He is so frightened that his legs have folded up under him like a camp stool.',
        ),
        P('Have pity, Mister Fire-eater!', 'sad'),
        FE('There are no misters here.'),
        P('Have pity, Sir!'),
        FE('No sirs, either.'),
        P('Have pity, Your Excellency!'),
        N('Fire-eater sits up a little straighter. He likes Your Excellency very much.'),
        FE('Well? What do you want?'),
        P(
          'If you have to burn somebody, burn me. It isn’t right that Harlequin should burn because of me.',
        ),
        N('He takes off his breadcrumb cap and holds it to his chest. He means it.'),
        N(
          'Fire-eater’s nose twitches. He sneezes, and sneezes again, and goes on sneezing until the pots rattle on the shelf.',
        ),
      ],
      [
        ask(
          10,
          'sel',
          'courage and self-sacrifice: standing up for a friend',
          'CASEL: Social awareness',
          [
            N(
              'Pinocchio offers himself in Harlequin’s place. Is that brave, foolish, or both? Would you do it?',
            ),
          ],
          [
            o('Brave. He is right to take the blame for his own trouble.', [
              N(
                'That’s a fair answer. It is his visit that caused this, and he faces it. Courage and fairness go together.',
              ),
            ]),
            o('Foolish. He could have been hurt for nothing.', [
              N(
                'That’s a fair answer. Danger is real. A brave person still thinks about the risk, and it is wise to ask for help as well.',
              ),
            ]),
            o('Both. Brave heart, risky choice.', [
              N(
                'That’s a fair answer. Many brave acts have a real risk inside them, and the heart behind them is what we remember.',
              ),
            ]),
          ],
          'Thought about courage and risk when someone speaks up for a friend.',
        ),
      ],
    ),
    sc(
      'a13-07-harlequin-done',
      [
        FE('Oh, very well! Nobody burns tonight. I shall eat my mutton half-raw.', 'sad'),
        FE('But next time, woe betide! Atchoo!'),
        N(
          'The puppets dance till dawn, and so do you. Your Nubbin dances along Fire-eater’s beard, and he doesn’t even notice.',
        ),
      ],
      [
        ask(
          2,
          'maths',
          'time intervals: how long from start to finish',
          '3.MD.A.1',
          [
            N(
              'The puppets start dancing at 9:30 in the evening and stop at 6:00 in the morning. How long did they dance?',
            ),
          ],
          [
            o(
              '8 hours and 30 minutes.',
              [
                N(
                  'Yes. From 9:30 pm to midnight is 2 hours 30 minutes, then 6 more hours to 6:00 am: 8 hours 30 minutes.',
                ),
              ],
              true,
            ),
            o('3 hours and 30 minutes.', [
              N(
                'That would be 9:30 to 1:00 am. Count on: to midnight is 2½ hours, and midnight to 6:00 is 6 hours more.',
              ),
            ]),
            o('9 hours and 30 minutes.', [
              N(
                'Close, but check: 9:30 to 10:00 is half an hour, then 10:00 to 6:00 is 8 hours. That is 8½ in all.',
              ),
            ]),
          ],
          'Worked out a time interval across midnight: 9:30 pm to 6:00 am is 8 hours 30 minutes.',
        ),
      ],
    ),
    sc(
      'a13-07-complete',
      [
        N('In the morning Fire-eater calls Pinocchio over and asks him about his father.'),
        P(
          'He’s very poor. He sold his coat to buy me a spelling-book. And I sold the book.',
          'sad',
        ),
        N(
          'Fire-eater sneezes again. He counts five gold pieces out of his purse into Pinocchio’s hand.',
        ),
        FE('Take these to your father, with my respects. Tell him to buy a coat.', 'soft'),
        N(
          'Pinocchio thanks him a thousand times, hugs every puppet in the company twice, and sets off for home with the gold in his fist.',
        ),
      ],
      [
        ask(
          3,
          'sel',
          'people are more than first impressions',
          'CASEL: Social awareness',
          [
            N(
              'Fire-eater looked frightening, yet he gave away five gold pieces. What does this teach about judging people?',
            ),
          ],
          [
            o(
              'First impressions can be wrong; look at what people do.',
              [
                N(
                  'Yes. How someone looks or sounds is only a start. Their actions tell the better story.',
                ),
              ],
              true,
            ),
            o('Scary people are secretly always kind.', [
              N(
                'Not always. Some people who look scary really are. The lesson is to watch what they do, not to assume.',
              ),
            ]),
            o('Never judge anyone at all.', [
              N(
                'We cannot help forming a first view. The skill is to hold it loosely, and let it change.',
              ),
            ]),
          ],
          'Reflected on how first impressions can be wrong and why actions tell us more.',
        ),
      ],
    ),
  ],
  [
    gl(
      'reflex',
      'something your body does by itself, without you choosing, like a sneeze or a blink',
      'a13-07-kitchen',
    ),
  ],
);

// ================================================================== A13-8 The Fox and the Cat
const A8: EduQuest = quest(
  'a13-08',
  'The Fox and the Cat',
  {
    'a13-08-s1': {
      goal: 'Walk home with Pinocchio and his five gold pieces.',
      hint: 'Keep to the road home. Watch who you meet on it.',
    },
    'a13-08-s2': {
      goal: 'Stop for supper at the Inn of the Red Craw-fish.',
      hint: 'Pinocchio is paying. He doesn’t know that yet.',
    },
  },
  [
    sc(
      'a13-08-road',
      [
        N(
          'Half a mile along the road you meet a Fox who is lame in one leg, and a Cat who is blind in both eyes. They lean on each other as they go.',
        ),
        FX('Good day, Pinocchio.', 'happy'),
        P('How do you know my name?'),
        FX(
          'I know your father well. I saw him yesterday at his door, in his shirt-sleeves, shivering.',
          'sad',
        ),
        P(
          'Poor Babbo. But he won’t shiver any more. Look. Five gold pieces. I’m going to buy him a coat.',
          'happy',
        ),
        N('He holds them up. They catch the sun.'),
        N(
          'The Fox, without meaning to, stretches out the leg that is lame. The Cat opens two great green eyes, and shuts them again at once.',
        ),
        N('Nobody sees it but you.'),
      ],
      [
        ask(
          7,
          'sel',
          'why we sometimes refuse to hear what we do not want to be true',
          'CASEL: Self-awareness',
          [
            N(
              'Even if you warn him, Pinocchio will not listen. Why do people so often ignore a warning that spoils a hope?',
            ),
          ],
          [
            o('Because they want the hope to be true so much.', [
              N(
                'That’s a fair answer. Wanting something strongly can make a warning feel like an attack on the wish itself.',
              ),
            ]),
            o('Because they do not trust the person warning them.', [
              N(
                'That’s a fair answer. A warning from someone we have only just met, or someone who nags us, can be easy to brush away.',
              ),
            ]),
            o('Because they are afraid of being wrong.', [
              N(
                'That’s a fair answer. Admitting a mistake early feels worse than hoping, even when hoping is riskier.',
              ),
            ]),
          ],
          'Thought about why people ignore warnings that clash with something they badly want.',
        ),
      ],
      [
        {
          id: 'warn',
          label: 'Warn him. The Cat opened its eyes.',
          then: [
            P('Shame on you. He’s blind. Poor animals get blamed for everything.', 'angry'),
            CT('We forgive you, traveller. We forgive everybody. It’s our only luxury.'),
          ],
        },
        {
          id: 'quiet',
          label: 'Say nothing yet, and watch the Fox.',
          then: [
            N(
              'You say nothing. The Fox catches you watching, and smiles at you very warmly, with all his teeth.',
            ),
          ],
        },
      ],
    ),
    sc(
      'a13-08-road-done',
      [
        FX('Five gold pieces. Is that all? Would you like to make them a thousand?'),
        FX(
          'Just outside the town of Catchfools there is a field, the Field of Miracles. Plant a gold coin there, and it grows a tree hung with gold.',
        ),
        N(
          'On the hedge a white blackbird calls out to Pinocchio not to listen. The Cat springs at it, and it gets away in a burst of feathers.',
        ),
        CT('Only stretching. My legs. Being blind is very stiff work.'),
      ],
      [
        ask(
          1,
          'science',
          'what a plant needs to start growing',
          '2-LS2-1',
          [
            N(
              'The Fox says a gold coin grows into a tree. What does a real tree grow from, and what does that need?',
            ),
          ],
          [
            o(
              'A seed, with soil, water, warmth and light.',
              [
                N(
                  'Yes. A seed holds a tiny plant and a store of food. With water and warmth it sprouts, and leaves collect light to keep growing. A coin has none of that.',
                ),
              ],
              true,
            ),
            o('Any shiny thing buried in the dirt.', [
              N(
                'Shiny or not, a coin is only metal. Living things grow from living things: seeds.',
              ),
            ]),
            o('Salt and a deep hole.', [
              N(
                'Salt does not help a seed; too much hurts it. A seed wants water, warmth, soil and, soon, light.',
              ),
            ]),
          ],
          'Learned that a plant grows from a seed that needs water, warmth, soil and light.',
        ),
        ask(
          3,
          'literacy',
          'gullible: easily fooled',
          'L.3.4',
          [
            N(
              'The Fox’s offer is too good to be true. A person who believes it at once could be called gullible. What does that word mean?',
            ),
          ],
          [
            o(
              'Easily fooled.',
              [
                N(
                  'Yes. Gullible means ready to believe anything, even when it is unlikely. Checking a claim before you trust it is the cure.',
                ),
              ],
              true,
            ),
            o('Very greedy.', [
              N('Greed and being gullible often go together, but gullible means easily fooled.'),
            ]),
            o('Very brave.', [
              N('Not brave. It means someone who is easily tricked or too trusting.'),
            ]),
          ],
          'Learned the word gullible and the habit of checking claims that sound too good to be true.',
        ),
      ],
    ),
    sc(
      'a13-08-inn',
      [
        N(
          'By evening you reach the Inn of the Red Craw-fish and sit down to supper, because the Fox says no great venture was ever begun hungry.',
        ),
        N(
          'The Cat orders thirty-five red mullet in tomato sauce and four helpings of tripe with cheese. He says he isn’t very hungry.',
        ),
        N(
          'The Fox would like something light: a hare in sauce, six chickens and a few young partridges. His doctor insists.',
        ),
        N(
          'Pinocchio, too excited to eat, has a walnut and a heel of bread, and leaves half the bread.',
        ),
        P('Tonight a seed. Tomorrow a tree. Babbo will have a coat on every branch.', 'happy'),
        N(
          'Then you all go up to bed. Pinocchio dreams out loud of gold coins clinking on branches, like little bells.',
        ),
      ],
      [
        ask(
          1,
          'social-studies',
          'how a traditional Italian supper is served in courses',
          'D2.His.2.K-2',
          [
            N(
              'In an Italian inn, supper comes in courses. What is the usual order, according to tradition?',
            ),
          ],
          [
            o(
              'A starter, then pasta or soup, then meat or fish, then a sweet.',
              [
                N(
                  'Yes. Starter (antipasto), first course (primo), second course (secondo), and a dessert (dolce). The meal is slow and shared; the Cat and Fox are making it very long.',
                ),
              ],
              true,
            ),
            o('One big plate with everything at once.', [
              N(
                'Not at a traditional table. Italian meals come in courses, one after another, and people take their time.',
              ),
            ]),
            o('Dessert first, to be safe.', [
              N('A charming idea, but the tradition puts the sweet last.'),
            ]),
          ],
          'Learned the traditional order of an Italian meal: starter, first course, second course, dessert.',
        ),
      ],
      [
        {
          id: 'bill',
          label: 'Ask who is paying for all this.',
          then: [
            FX('Paying? Among friends? My dear fellow, what a question.', 'happy'),
            N('He changes the subject to the weather, which he says looks golden.'),
          ],
        },
        {
          id: 'pocket',
          label: 'Wrap Pinocchio’s leftover bread for his pocket.',
          then: [
            N(
              'You wrap the heel of bread in a cloth and tuck it in his pocket. He won’t thank you for it tonight.',
            ),
          ],
        },
      ],
    ),
    sc(
      'a13-08-inn-done',
      [
        N(
          'At midnight the innkeeper knocks: your friends have gone ahead. The Cat’s eldest kitten has chilblains, he says, and they had to hurry.',
        ),
        IK('They said you’d settle the bill. One gold piece, and a bargain at that.'),
        N(
          'Pinocchio pays it without a word, and has four gold pieces left. He sets off alone into the dark, and you go after him.',
        ),
      ],
      [
        ask(
          2,
          'maths',
          'a pattern that follows a rule: doubling',
          '4.OA.C.5',
          [
            N(
              'Suppose the Fox’s promise were true and Pinocchio’s four coins doubled every day: 4, 8, 16, … What comes next, and how many coins would there be on day 5?',
            ),
          ],
          [
            o(
              '32, then 64 on day 5.',
              [
                N(
                  'Yes. Each term is the one before times 2: 4, 8, 16, 32, 64. If a promise like that were real, everyone would be rich, and nobody would be selling it for a gold piece.',
                ),
              ],
              true,
            ),
            o('20, then 24.', [
              N('That adds 4 each time. The rule here is doubling: multiply by 2 each day.'),
            ]),
            o('32, then 48.', [N('32 is right. Double it again for the next one: 32 × 2 = 64.')]),
          ],
          'Extended a doubling pattern and saw why a promise of endless doubling is too good to be true.',
        ),
      ],
    ),
    sc(
      'a13-08-complete',
      [
        N(
          'The night is so dark you can’t see your own hand. Something rustles in the hedge beside the road.',
        ),
        N('Very faintly, from somewhere low in the leaves, comes a small sound: cri.'),
        P('Not you. You’re… Not you. I’m not listening.', 'shock'),
        N('He walks faster. You look back once, and there is nothing in the hedge but dark.'),
      ],
      [
        ask(
          2,
          'sel',
          'conscience: the inner voice that tells us what is right',
          'CASEL: Self-awareness',
          [
            N(
              'Pinocchio says “I’m not listening”, but he can still hear it. What do we call the inner voice that tells us when we are doing wrong?',
            ),
          ],
          [
            o(
              'Our conscience.',
              [
                N(
                  'Yes. A conscience is the inner sense of right and wrong. Everyone has one, and it grows stronger the more we listen to it.',
                ),
              ],
              true,
            ),
            o('Our imagination.', [
              N(
                'Imagination invents things. The conscience is the voice that judges whether what we are doing is right.',
              ),
            ]),
            o('Our shadow.', [
              N('A shadow is a shape made by light. The word you want is conscience.'),
            ]),
          ],
          'Learned the word conscience and thought about listening to it.',
        ),
      ],
    ),
  ],
  [
    gl(
      'gullible',
      'easily fooled; ready to believe something without checking',
      'a13-08-road-done',
    ),
    gl('conscience', 'your inner sense of what is right and wrong', 'a13-08-complete'),
  ],
);

// ================================================================== A13-9 The Assassins
const A9: EduQuest = quest(
  'a13-09',
  'The Assassins',
  {
    'a13-09-s1': {
      goal: 'Keep close to Pinocchio on the dark road.',
      hint: 'Stay on the road. Whatever is behind you is quicker than it looks.',
    },
    'a13-09-s2': {
      goal: 'Run after Pinocchio across the fields.',
      hint: 'Follow the clack of his feet. Jump the ditch; don’t land in it.',
    },
  },
  [
    sc(
      'a13-09-sacks',
      [
        N(
          'Behind you, the leaves rustle. Two black shapes are following, wrapped in charcoal sacks, hopping along on tiptoe like ghosts.',
        ),
        P('Here they come. Robbers. Assassins!', 'shock'),
        N('He pops the four gold pieces into his mouth, under his tongue, quick as a squirrel.'),
        ST('Your money or your life!'),
        N(
          'Pinocchio can’t say a word, because of the money. He makes a face instead, which isn’t an answer.',
        ),
        SS('Your money, or you’ll be sorry. And your father too!'),
        N(
          'One of them sounds very like a Fox with a cold. The other sounds like a Cat trying hard to sound like nobody.',
        ),
      ],
      [
        ask(
          1,
          'science',
          'charcoal: wood heated without much air changes for good',
          '2-PS1-4',
          [
            N(
              'The robbers hide in charcoal sacks. Charcoal is made by heating wood with very little air, so it cannot burn away. Can you turn charcoal back into wood?',
            ),
          ],
          [
            o(
              'No. Heating changed it into something new for good.',
              [
                N(
                  'Yes. Some changes cannot be undone. Wood has become charcoal, which is mostly carbon, a new material that burns hot and clean.',
                ),
              ],
              true,
            ),
            o('Yes. Soak it in water.', [
              N(
                'Water won’t help. Charcoal is made of different material now, and it will not turn back.',
              ),
            ]),
            o('Yes. Bury it in the ground.', [
              N('Burying it will not bring wood back. Charcoal is a permanent change.'),
            ]),
          ],
          'Learned that making charcoal from wood is a change that cannot be reversed.',
        ),
      ],
      [
        {
          id: 'stick',
          label: 'Grab a stick and stand with him.',
          then: [
            N(
              'You grab a stick. The taller sack takes it off you, quite politely, and puts you in the ditch.',
            ),
            N('The ditch is full of nettles. Your Nubbin comes in after you, to keep you company.'),
          ],
        },
        {
          id: 'shout',
          label: 'Pick up your Nubbin and shout for help.',
          then: [
            N(
              'You shout until the hills shout back, and nobody comes. On this road, at this hour, nobody ever does.',
            ),
          ],
        },
      ],
    ),
    sc(
      'a13-09-sacks-done',
      [
        N(
          'The shorter sack takes Pinocchio by the jaw, to get his mouth open. Pinocchio bites down hard, and spits out what he bit.',
        ),
        N('It isn’t a hand. It’s a cat’s paw.'),
        N('While they are both staring at that, he is over the hedge and running.'),
      ],
      [
        ask(
          1,
          'literacy',
          'using clues to work out who a character is',
          'RL.3.3',
          [N('Nobody tells us the sacks are the Fox and the Cat. Which clues give them away?')],
          [
            o(
              'A voice like a Fox with a cold, and a cat’s paw in the spit.',
              [
                N(
                  'Yes. The narrator shows us instead of telling us. Good readers pick up clues like these and put them together.',
                ),
              ],
              true,
            ),
            o('The colour of the sacks.', [
              N('Both sacks are black, so that tells us nothing. Look at the voices and the paw.'),
            ]),
            o('Nothing gives them away; it is a surprise.', [
              N(
                'The clues are quite plain: “a Fox with a cold”, and a cat’s paw. The writer wants you to guess.',
              ),
            ]),
          ],
          'Used clues in the text to infer who the disguised characters are.',
        ),
      ],
    ),
    sc(
      'a13-09-chase',
      [
        N('He runs across the fields and you run after him, and the two sacks run after you both.'),
        N(
          'There is a ditch full of muddy water. Pinocchio jumps it, you jump it, and the sacks jump it too, and land in the middle.',
        ),
        N('They climb out dripping, and keep coming.'),
        N(
          'Far off among the trees there is a little house as white as snow. Pinocchio runs to its door and hammers on it.',
        ),
        P('Help! Open up! Please!'),
        N(
          'A window opens, and in it is a girl with blue hair and a face as white as wax. Her eyes are shut, and her hands are folded.',
        ),
        FY('There is nobody in this house. Everybody has gone away.', 'soft'),
        P('Then you open the door!'),
        FY('I am going away too. I am only waiting.', 'soft'),
        N('The window closes, without a sound.'),
      ],
      [
        ask(
          0,
          'maths',
          'comparing distances covered at different speeds',
          '4.MD.A.2',
          [
            N(
              'Pinocchio runs at 6 metres every second and the sacks at 5. After 10 seconds, how much farther has Pinocchio run than the sacks?',
            ),
          ],
          [
            o(
              '10 metres farther.',
              [
                N(
                  'Yes. Pinocchio runs 60 metres and the sacks 50 in 10 seconds. A small difference in speed adds up, so he slowly pulls ahead.',
                ),
              ],
              true,
            ),
            o('1 metre farther.', [
              N(
                'That is the difference every second. Over 10 seconds it adds up: 10 × 1 = 10 metres.',
              ),
            ]),
            o('60 metres farther.', [
              N('60 metres is how far Pinocchio ran. The sacks ran 50, so the gap is 10.'),
            ]),
          ],
          'Compared two speeds over 10 seconds and found a 10-metre gap.',
        ),
      ],
    ),
    sc(
      'a13-09-chase-done',
      [
        N(
          'The sacks catch him at the door. They shake him, and shake him, and the gold won’t come out.',
        ),
        N(
          'So they tie him by the collar of his paper jacket to a branch of the Big Oak, and leave him swinging there.',
        ),
        ST('We’ll be back in the morning. Perhaps you’ll feel like opening your mouth by then.'),
      ],
      [
        ask(
          2,
          'sel',
          'what we hold on to too tightly',
          'CASEL: Responsible decision-making',
          [
            N(
              'Pinocchio keeps the coins in his mouth even while he is shaken and tied up. When is holding on tight to something a mistake?',
            ),
          ],
          [
            o('When keeping it costs us more than it is worth.', [
              N(
                'That’s a fair answer. A coin is worth less than being safe. Knowing what to let go is a hard skill.',
              ),
            ]),
            o('Never. If it is yours, hold on.', [
              N(
                'That’s a fair answer. Things that are ours matter. But some things matter less than our safety and our people.',
              ),
            ]),
            o('When we are too afraid to think.', [
              N(
                'That’s a fair answer. Fear can lock our hands shut. Slow breathing and a moment to think can loosen them.',
              ),
            ]),
          ],
          'Reflected on when it is wiser to let something go than to hold on tight.',
        ),
      ],
    ),
    sc(
      'a13-09-complete',
      [
        N(
          'You can’t reach the branch. You try from your own shoulders, and from a stone, and with your Nubbin standing on your head.',
        ),
        N(
          'The north wind gets up and swings him to and fro, like the clapper of a bell with no bell round it.',
        ),
        P('Oh, Babbo. If you were here.', 'sad'),
        N('He stops kicking. He shuts his eyes, and goes very still, the way wood goes.'),
        N('Behind you, the window of the white house opens again.'),
      ],
      [
        notice(
          1,
          'science',
          'winds are named by the direction they come from',
          '3-ESS2-1',
          [
            N(
              'A north wind is a wind that blows FROM the north, not towards it. Winds are always named for where they start.',
            ),
            N(
              'In Italy a north wind often feels cold in winter, because it has crossed the mountains of the Alps. Sailors and farmers have long watched wind direction to guess the weather.',
            ),
          ],
          'Learned that a wind is named by the direction it blows from.',
        ),
      ],
    ),
  ],
  [
    gl(
      'assassin',
      'someone who attacks to rob or harm; here, a comic danger in a sack',
      'a13-09-sacks',
    ),
  ],
);

// ================================================================== A13-10 The Big Oak
const A10: EduQuest = quest(
  'a13-10',
  'The Big Oak',
  {
    'a13-10-s1': {
      goal: 'Watch the Fairy’s falcon cut Pinocchio down.',
      hint: 'Stand under the oak. Be ready to catch.',
    },
    'a13-10-s2': {
      goal: 'Wait by the bed while the doctors look at Pinocchio.',
      hint: 'Stand at the foot of the bed. Look at the third doctor.',
    },
  },
  [
    sc(
      'a13-10-falcon',
      [
        N(
          'The girl at the window is not just a girl. She is a Fairy, who has lived at the edge of this wood for more than a thousand years.',
        ),
        N(
          'She claps her hands three times. A great Falcon comes down out of the dark and lands on the sill.',
        ),
        FY(
          'Do you see that puppet on the Big Oak? Cut the knot with your beak, and let him down gently.',
        ),
        N(
          'The Falcon goes, and the knot gives. You are under the branch, and you catch Pinocchio, and he is as light as a stick of kindling.',
        ),
        FY('Thank you. Bring him in. Medoro! The coach!'),
        N(
          'A poodle comes out of the house on his hind legs, in a coachman’s coat with gold buttons and a wig of white curls.',
        ),
        N(
          'Behind him comes a little coach the colour of the air, lined with canary feathers and drawn by a hundred pairs of white mice.',
        ),
        MD('Madam. Traveller. Patient. Mind the custard; it’s for the journey.'),
      ],
      [
        notice(
          1,
          'science',
          'a falcon’s beak, claws and eyes are adaptations for hunting',
          '4-LS1-1',
          [
            N(
              'A falcon’s hooked beak tears food, its claws grip, and its eyes are sharper than ours: a peregrine can spot prey from over a kilometre away.',
            ),
            N(
              'Each of these is an adaptation, a body part that helps an animal survive where it lives. A falcon’s dive can top 300 kilometres an hour, the fastest of any animal.',
            ),
          ],
          'Learned how a falcon’s beak, claws, eyes and speed help it hunt, as examples of adaptations.',
        ),
      ],
      [
        {
          id: 'who',
          label: 'Ask the Fairy who she is.',
          then: [
            FY(
              'Someone who lives here, and has been waiting for somebody to knock. Bring him in.',
              'soft',
            ),
          ],
        },
        {
          id: 'lift',
          label: 'Lift Pinocchio into the coach yourself.',
          then: [
            N(
              'You lay him on the canary feathers. Your Nubbin climbs in beside him and sits on his chest, to keep it warm.',
            ),
          ],
        },
      ],
    ),
    sc(
      'a13-10-falcon-done',
      [
        N(
          'The Fairy puts Pinocchio to bed, and sends for the three best doctors in the neighbourhood.',
        ),
      ],
      [
        ask(
          0,
          'sel',
          'sending for help is a strength, not a weakness',
          'CASEL: Relationship skills',
          [
            N(
              'The Fairy could have nursed Pinocchio alone, but she sent for three doctors. When is asking for help the strong thing to do?',
            ),
          ],
          [
            o(
              'When the problem is bigger than what one person knows.',
              [
                N(
                  'Yes. Wise people know what they do not know. Asking others is how they get the right answer.',
                ),
              ],
              true,
            ),
            o('Only when you have already tried everything.', [
              N(
                'Trying first is good. But if it is serious, like an illness, it is wiser to ask straight away.',
              ),
            ]),
            o('Never; strong people do it alone.', [
              N('Strength includes knowing when to share a load. Even the Fairy asks for doctors.'),
            ]),
          ],
          'Talked about asking for help when a problem is bigger than one person can handle.',
        ),
      ],
    ),
    sc(
      'a13-10-doctors',
      [
        N(
          'The doctors arrive one after another: a Crow, an Owl, and, last of all, a Talking-cricket.',
        ),
        N(
          'You look twice. It is him, a little grey at the edges, a little stiff in one leg, in a very bad temper, and alive.',
        ),
        FY('Doctors, tell me. Is this poor puppet alive, or dead?'),
        CW(
          'In my opinion, the puppet is dead. But if by any chance he is not dead, then he is certainly alive.',
          'think',
        ),
        OW(
          'I am sorry to disagree with my learned friend. He is alive. But if by any chance he is not alive, then he is certainly dead.',
        ),
        FY('And you, sir? You say nothing?'),
        CR(
          'A wise doctor, when he doesn’t know, keeps quiet. But I know this puppet. I have known him a little while.',
        ),
        N('Pinocchio, who has been lying as stiff as a plank, gives a small shiver all over.'),
        CR(
          'That puppet is a rascal, and a runaway, and a disobedient son. He will break his poor father’s heart.',
          'angry',
        ),
        N('From under the sheet comes a sound of crying.'),
        CW('When the dead cry, it is a sign they are getting better.'),
        OW('When the dead cry, it is a sign they are sorry to be dead.'),
      ],
      [
        ask(
          6,
          'literacy',
          'honestly saying “I do not know”',
          'RL.3.6',
          [
            N(
              'The cricket says, “A wise doctor, when he doesn’t know, keeps quiet.” The Crow and the Owl guessed. Is it harder to say “I do not know”, or to guess? Why?',
            ),
          ],
          [
            o('Harder to say “I do not know”. People fear looking foolish.', [
              N(
                'That’s a fair answer. Admitting we do not know feels risky, even though it is the honest thing, and it is how we learn.',
              ),
            ]),
            o('Harder to guess; a wrong guess can do harm.', [
              N(
                'That’s a fair answer. A confident guess from a doctor could be dangerous. The honest doctor admits where his knowledge stops.',
              ),
            ]),
            o('They are both hard in different ways.', [
              N(
                'That’s a fair answer. Guessing risks being wrong; admitting risks looking weak. A wise person weighs both.',
              ),
            ]),
          ],
          'Reflected on the honesty of saying “I do not know” instead of guessing.',
        ),
        notice(
          4,
          'science',
          'owls are built for night hunting: forward-facing eyes, sharp hearing, soft silent feathers',
          '4-LS1-2',
          [
            N(
              'An owl’s eyes face forward and gather lots of light. Its feathers have soft fringes that muffle the sound of flapping, so it flies almost silently.',
            ),
            N(
              'Some owls can locate a mouse under snow by sound alone. Good senses are how a night hunter survives.',
            ),
          ],
          'Learned how an owl’s eyes, ears and feathers help it hunt at night.',
        ),
      ],
    ),
    sc(
      'a13-10-doctors-done',
      [
        ...LEAVE,
        N(
          'Under the sheet, Pinocchio stops crying long enough to listen to that slow, uneven step go down the stairs.',
        ),
      ],
      [
        ask(
          1,
          'literacy',
          'theme: helping even those who hurt you',
          'RL.4.2',
          [
            N(
              'The cricket came to help the puppet who threw a mallet at him. What larger idea does the writer seem to be showing us?',
            ),
          ],
          [
            o(
              'Kindness can be given even to someone who has wronged us.',
              [
                N(
                  'Yes. That is a theme: an idea that runs through the whole story. The cricket’s limp is the price of his kindness.',
                ),
              ],
              true,
            ),
            o('Crickets are stubborn creatures.', [
              N(
                'Crickets can be! But a theme is a bigger idea about people and life, not about insects.',
              ),
            ]),
            o('Doctors should always visit puppets.', [
              N(
                'That is a detail. The theme is about what the cricket’s choice says about forgiveness and duty.',
              ),
            ]),
          ],
          'Identified a theme: kindness to someone who has wronged you.',
        ),
      ],
    ),
    sc(
      'a13-10-complete',
      [
        N(
          'When they have all gone, the Fairy sits on the edge of the bed and puts her hand on Pinocchio’s forehead. He is burning hot.',
        ),
        FY('Fever. Silly boy. Silly, silly boy.', 'soft'),
        N('She looks across at you, over the sheet.'),
        FY(
          'You came in with him. Stay, then. He will need somebody to be cross with when he wakes up.',
        ),
      ],
      [
        ask(
          0,
          'maths',
          'reading a thermometer: temperature above normal',
          '2.OA.A.1',
          [
            N(
              'A healthy body is about 37°C (98.6°F). Pinocchio’s temperature is 40°C (104°F). How many degrees Celsius above normal is that?',
            ),
          ],
          [
            o(
              '3 degrees.',
              [
                N(
                  'Yes. 40 − 37 = 3. A fever starts above about 38°C (100.4°F), so 40°C is a high fever, and a grown-up should call a doctor.',
                ),
              ],
              true,
            ),
            o('37 degrees.', [
              N('That is the normal temperature. The difference between 40 and 37 is 3.'),
            ]),
            o('77 degrees.', [
              N('That adds the two numbers. To find how far above, subtract: 40 − 37 = 3.'),
            ]),
          ],
          'Subtracted to find how far a temperature is above normal and learned what a fever is.',
        ),
      ],
    ),
  ],
  [
    gl(
      'adaptation',
      'a body part or habit that helps an animal live where it does',
      'a13-10-falcon',
    ),
  ],
);

// ================================================================== A13-11 The Nose
const A11: EduQuest = quest(
  'a13-11',
  'The Nose',
  {
    'a13-11-s1': {
      goal: 'Get Pinocchio to take his medicine.',
      hint: 'He’ll bargain. Let him. Sugar first, then the glass.',
    },
    'a13-11-s2': {
      goal: 'Stay while the Fairy asks about the gold.',
      hint: 'You can’t stop him lying. You can stand where he can see you.',
    },
  },
  [
    sc(
      'a13-11-medicine',
      [
        FY('Drink this, and you’ll be well in a day or two.'),
        P('Is it sweet or bitter?'),
        FY('Bitter. But it’s good for you.'),
        P(
          'If it’s bitter, I don’t want it. Give me a lump of sugar first. Then I’ll drink it. Probably.',
        ),
        N('The Fairy gives him a lump of sugar. He crunches it up, and pushes the glass away.'),
        P('Another lump. Then I’ll drink it.'),
        N('Another lump, more crunching, more pushing.'),
        P(
          'The pillow’s on my feet. I can’t drink with a pillow on my feet. Also, the door’s open.',
        ),
        N(
          'The door opens wider. In come four rabbits, as black as ink, walking on their hind legs.',
        ),
        RB('We’ve come for you. We were told you weren’t taking your medicine.', 'think'),
        P('Give me the glass! Quick, give it here!', 'shock'),
        N('He drinks the whole thing at one gulp.'),
        RB('Well. That’s a wasted walk.'),
        N('The four black rabbits go out again, grumbling between their teeth.'),
      ],
      [
        notice(
          3,
          'health',
          'only take medicine from a trusted adult, and measure it carefully',
          'CASEL: Responsible decision-making',
          [
            N(
              'Medicine is only safe in the right amount, so a trusted grown-up should always give it, using the measuring spoon or cup that comes with it.',
            ),
            N(
              'Never take medicine by yourself, and never share yours with a friend. Even a sweet-tasting one can be dangerous in a big dose.',
            ),
          ],
          'Learned that medicine should only be given by a trusted adult, in the measured amount.',
        ),
        ask(
          13,
          'maths',
          'units of volume: millilitres in a measuring spoon',
          '4.MD.A.1',
          [
            N(
              'A dose is one 5-millilitre spoon, three times a day. How many millilitres is that in one day?',
            ),
          ],
          [
            o(
              '15 millilitres.',
              [
                N(
                  'Yes. 5 ml × 3 = 15 ml. That is why doses are always measured: a spoon from the kitchen drawer might hold a very different amount.',
                ),
              ],
              true,
            ),
            o('8 millilitres.', [N('That adds 5 and 3. Three doses of 5 is 5 × 3 = 15 ml.')]),
            o('5 millilitres.', [
              N('That is one dose. There are three each day, so 15 ml in all.'),
            ]),
          ],
          'Multiplied a 5 ml dose by three to find the daily amount of medicine.',
        ),
      ],
    ),
    sc(
      'a13-11-medicine-done',
      [
        N(
          'In a few minutes Pinocchio jumps out of bed, quite well. Puppets are lucky that way: ill quickly, and well quickly.',
        ),
      ],
      [
        ask(
          0,
          'science',
          'bitter taste as a warning sense',
          '4-LS1-2',
          [
            N(
              'Medicines often taste bitter. Our tongue has taste buds for sweet, sour, salty, bitter and savoury. Why might it be useful to have a taste for bitter?',
            ),
          ],
          [
            o(
              'Many poisons taste bitter, so it warns us to be careful.',
              [
                N(
                  'Yes. Bitterness is an early-warning sense. But some medicines are bitter and good for us, which is why a trusted adult must decide.',
                ),
              ],
              true,
            ),
            o('To help us find sugar.', [
              N('Sweet taste helps us find sugar. Bitter is the opposite: a “careful!” signal.'),
            ]),
            o('It has no purpose.', [
              N(
                'Every sense has a purpose. Bitter taste evolved to warn animals about harmful plants.',
              ),
            ]),
          ],
          'Learned that the bitter taste can be a warning sense, which is why adults decide about medicine.',
        ),
      ],
    ),
    sc(
      'a13-11-nose',
      [
        FY('Now. Where are the four gold pieces?'),
        P('I lost them.'),
        N(
          'He is lying; they are in his pocket. His nose, which is long already, grows two fingers longer.',
        ),
        FY('Where did you lose them?'),
        P('In the wood. Near here.'),
        N('His nose grows again.'),
        FY('Then we’ll go and look for them. Everything lost in this wood is always found.'),
        P('Ah. No. Now I remember. I didn’t lose them. I swallowed them, with the medicine.'),
        N(
          'At that third lie his nose shoots out so far that he can’t turn round. It knocks the bed, and the window, and the wall.',
        ),
        N('He tries to get out of the door, and can’t, because his nose won’t fit through it.'),
        FY(
          'Lies are found out at once, my boy. Some lies have short legs, and some have long noses. Yours are the long-nosed kind.',
        ),
      ],
      [
        ask(
          3,
          'sel',
          'why lies show, and what it costs to tell them',
          'CASEL: Responsible decision-making',
          [
            N(
              'Pinocchio’s nose shows every lie. In real life lies do not show on our faces. Why might the Fairy still want people to be honest?',
            ),
          ],
          [
            o('Trust: if we lie, nobody can believe us when it matters.', [
              N(
                'That’s a fair answer. Trust is easy to break and slow to mend. One lie makes the next truth harder to believe.',
              ),
            ]),
            o('Lies get us tangled in more lies.', [
              N('That’s a fair answer. Look at his nose: each lie needed another to hide it.'),
            ]),
            o('Because lies hurt the person we tell.', [
              N(
                'That’s a fair answer. A lie takes away a person’s chance to choose well, and that is a real hurt.',
              ),
            ]),
          ],
          'Thought about why honesty matters even when lies do not show.',
        ),
        ask(
          10,
          'literacy',
          'idioms and metaphor: “lies have short legs”',
          'L.4.5',
          [N('The Fairy says, “Some lies have short legs.” What do you think she means?')],
          [
            o(
              'They do not get far before they are found out.',
              [
                N(
                  'Yes. A short-legged lie cannot run far: it is caught up with quickly. It is a metaphor, a picture in words.',
                ),
              ],
              true,
            ),
            o('Lies belong to short people.', [
              N(
                'It has nothing to do with height. It is a picture: a creature with short legs cannot run far.',
              ),
            ]),
            o('Lies are slow to tell.', [
              N('Lies are often quick to tell! The image is about how soon the truth catches up.'),
            ]),
          ],
          'Interpreted a metaphor: a lie with short legs is soon caught.',
        ),
      ],
      [
        {
          id: 'laugh',
          label: 'Laugh, kindly. You can’t help it.',
          then: [
            P('It isn’t funny!', 'angry'),
            N('It is a bit funny. In a minute even he thinks so, though he would never say.'),
          ],
        },
        {
          id: 'truth',
          label: 'Tell him the coins are in his pocket. He knows.',
          then: [
            P('…They’re in my pocket.', 'sad'),
            N('His nose doesn’t shrink. But it stops growing, which is a start.'),
          ],
        },
      ],
    ),
    sc(
      'a13-11-nose-done',
      [
        N(
          'Pinocchio cries for half an hour, because he can’t get out of the room. The Fairy lets him; lessons take half an hour, she says.',
        ),
        N(
          'Then she claps her hands. A thousand woodpeckers fly in at the window and peck the nose back to its proper size in no time at all.',
        ),
      ],
      [
        notice(
          1,
          'science',
          'woodpeckers’ beaks, tongues and skulls are adaptations for pecking',
          '4-LS1-1',
          [
            N(
              'A real woodpecker hammers on a tree many times a second. Its chisel beak digs out insects, and its tongue is so long that it wraps around the back of its skull.',
            ),
            N(
              'Stiff tail feathers prop it up on the trunk, and a tough, cushioned skull keeps the knocks from hurting. Those body parts are all adaptations.',
            ),
          ],
          'Learned how a woodpecker’s body is adapted for pecking wood.',
        ),
      ],
    ),
    sc(
      'a13-11-complete',
      [
        FY(
          'There. I’ll be your sister, if you’ll be a good brother. And your father is on his way; I sent for him. He’ll be here by dark.',
          'soft',
        ),
        P('Babbo? Here? I’ll go and meet him on the road!', 'happy'),
        N('He is gone in a rattle of bark shoes.'),
        FY('Go with him. He has never yet gone anywhere in a straight line.', 'soft'),
      ],
      [
        ask(
          3,
          'sel',
          'chosen family and belonging',
          'CASEL: Social awareness',
          [
            N(
              'The Fairy offers to be Pinocchio’s sister, though they are not related. What might “family” mean beyond being born into one?',
            ),
          ],
          [
            o(
              'People who care for us and show up for us.',
              [
                N(
                  'Yes. Families are often built from love and promises as well as birth. Many people have found family in friends, neighbours and carers.',
                ),
              ],
              true,
            ),
            o('Only people with the same last name.', [
              N('Names help families belong together, but love and care are what make a family.'),
            ]),
            o('Only the people in our house.', [
              N(
                'Family can live apart and still be family. It is about care, not about the address.',
              ),
            ]),
          ],
          'Talked about family as people who care for and show up for one another.',
        ),
      ],
    ),
  ],
  [
    gl(
      'idiom',
      'a phrase whose meaning is not what the words say, like “lies have short legs”',
      'a13-11-nose',
    ),
  ],
);

// ================================================================== A13-12 The Field of Miracles
const A12: EduQuest = quest(
  'a13-12',
  'The Field of Miracles',
  {
    'a13-12-s1': {
      goal: 'Walk with Pinocchio to meet Geppetto on the road.',
      hint: 'The road goes past the Big Oak. Somebody is waiting there.',
    },
    'a13-12-s2': {
      goal: 'Help Pinocchio plant his coins in the Field of Miracles.',
      hint: 'Dig, plant, water, salt. Then the Fox says to go away for twenty minutes.',
    },
  },
  [
    sc(
      'a13-12-oak',
      [
        N(
          'At the Big Oak, sitting in the shade as if nothing had ever happened, are the Fox and the Cat.',
        ),
        FX('Our dear Pinocchio! What are you doing here?', 'happy'),
        N('The Cat keeps one paw tucked inside his coat, like a gentleman with a secret.'),
        P('What happened to his paw?'),
        FX(
          'Charity. We met a poor old wolf, starving on the road, and my friend gave him a hand. Well. A paw.',
          'sad',
        ),
        N(
          'Pinocchio wipes away a tear. You remember whose teeth that paw last met, and say nothing.',
        ),
        P('Fox, I can’t come to the field. I’m going to meet my father. The Fairy said—'),
        FX('With four coins, when you could bring him two thousand? Think how proud he’ll be.'),
        N(
          'Pinocchio thinks of the Fairy, and of Babbo, and for a moment of the cricket. Then he thinks of two thousand.',
        ),
        P('Is it far?'),
      ],
      [
        ask(
          9,
          'sel',
          'keeping a promise when something tempting comes along',
          'CASEL: Responsible decision-making',
          [
            N(
              'Pinocchio promised to meet his father, and now the Fox offers a shortcut to riches. What is a good test for an offer that sounds too good to be true?',
            ),
          ],
          [
            o(
              'Ask: why is a stranger giving me this for nothing?',
              [
                N(
                  'Yes. If it sounds too good to be true, find out who gains. And talk to a trusted adult before you decide.',
                ),
              ],
              true,
            ),
            o('Take it quickly before it vanishes.', [
              N(
                'Pressure to hurry is a classic warning sign. A real good deal can wait while you ask someone you trust.',
              ),
            ]),
            o('Ignore all offers ever.', [
              N(
                'Not all offers are tricks! The skill is to check before agreeing, not to refuse everything.',
              ),
            ]),
          ],
          'Practised testing an offer that sounds too good to be true, and keeping a promise.',
        ),
      ],
      [
        {
          id: 'babbo',
          label: 'Remind him Geppetto is on this very road.',
          then: [
            P('Then he’ll wait! He always waits. He’s good at it.'),
            N('He says it as if it were a reason.'),
          ],
        },
        {
          id: 'go',
          label: 'Go with him. Somebody should.',
          then: [
            N('You go with him. The Fox gives you the look of someone counting heads at a table.'),
          ],
        },
      ],
    ),
    sc(
      'a13-12-oak-done',
      [
        N(
          'The town of Catchfools is full of coatless dogs yawning with hunger, shorn sheep shivering, and hens with no crests begging for a grain.',
        ),
        N(
          'There are butterflies who have sold their wings, and peacocks ashamed of their tails. Now and then a fine coach goes by, with a fox in it, or a magpie.',
        ),
      ],
      [
        ask(
          1,
          'social-studies',
          'needs, wants and selling what you cannot do without',
          'D2.Eco.1.K-2',
          [
            N(
              'The animals of Catchfools sold their coats, wings and tails for money. Is it wise to sell something you need to buy something you want? What does the town show us?',
            ),
          ],
          [
            o('No. The things they sold were what kept them safe and warm.', [
              N(
                'That’s a fair answer. When you sell a need to pay for a want, you can be left worse off than before.',
              ),
            ]),
            o('It depends how much they got and what they needed it for.', [
              N(
                'That’s a fair answer. A trade can be sensible if you truly do not need the thing, but here they were tricked.',
              ),
            ]),
            o('Yes, if the money is a lot.', [
              N(
                'That’s a fair answer for something you can replace. A wing or a tail cannot be bought back, so it is a harder trade.',
              ),
            ]),
          ],
          'Thought about the difference between selling things we want and things we need.',
        ),
      ],
    ),
    sc(
      'a13-12-field',
      [
        N('Just outside the town there is a lonely field that looks like every other field.'),
        FX(
          'This is it. Dig a hole. Plant the coins. Cover them up. Water them from the ditch, and add a pinch of salt.',
        ),
        N(
          'Pinocchio digs with his hands, and you help. He has nothing to carry water in, so he fills his shoe at the ditch and pours it on.',
        ),
        FX('Now go away for twenty minutes. Trees are very shy when you watch them grow.'),
        CT('And we want nothing for it. Nothing at all. Our reward is your happiness.'),
        N('They go off down the road together, very quickly for a lame Fox and a blind Cat.'),
      ],
      [
        ask(
          1,
          'science',
          'what a seed needs to germinate',
          '2-LS2-1',
          [N('A real seed in real soil can sprout. What does it need in order to germinate?')],
          [
            o(
              'Water, warmth and air.',
              [
                N(
                  'Yes. Once a seed is wet and warm, it swells and a tiny root pushes out, then a shoot. Light comes later, once the leaves are up.',
                ),
              ],
              true,
            ),
            o('Salt and a shiny coin.', [
              N(
                'Neither helps. A seed needs water, warmth and air, and it already carries its own food.',
              ),
            ]),
            o('Bright light from the start.', [
              N(
                'Many seeds sprout in the dark, under the soil. Light matters once the shoot reaches the surface.',
              ),
            ]),
          ],
          'Learned that a seed needs water, warmth and air to germinate.',
        ),
        ask(
          3,
          'maths',
          'time intervals: twenty minutes later',
          '3.MD.A.1',
          [
            N(
              'The Fox sends Pinocchio away at 10:15. If they come back exactly twenty minutes later, what time is it?',
            ),
          ],
          [
            o(
              '10:35',
              [
                N(
                  'Yes. 10:15 plus 20 minutes is 10:35. Counting on in fives or tens makes it easy.',
                ),
              ],
              true,
            ),
            o('10:20', [
              N('That is only five minutes later. Add the full 20: 10:15, 10:25, 10:35.'),
            ]),
            o('11:15', [
              N('That is a whole hour. Twenty minutes is a third of an hour, so 10:35.'),
            ]),
          ],
          'Added 20 minutes to 10:15 to find the time 10:35.',
        ),
      ],
      [
        {
          id: 'stay',
          label: 'Offer to stay and watch the hole.',
          then: [
            P('You heard him! Trees are shy! Come on. You’ll spoil everything.'),
            N('He tugs you away by the sleeve.'),
          ],
        },
        {
          id: 'count',
          label: 'Count the twenty minutes with him in town.',
          then: [N('He counts every minute aloud, and some of them twice.')],
        },
      ],
    ),
    sc(
      'a13-12-field-done',
      [
        N(
          'Twenty minutes, and back to the field. There is no tree, only the hole, and it is empty.',
        ),
        N(
          'In a tree nearby, a Parrot is preening his feathers and laughing so much that he nearly falls off his branch.',
        ),
        PR('I laugh at fools who believe every silly thing they’re told.', 'happy'),
        PR(
          'While you were counting, your friends came back, dug up your gold and ran off like the wind. You’ll never catch them now.',
        ),
      ],
      [
        notice(
          2,
          'science',
          'parrots copy sounds, but copying is not the same as understanding',
          '4-LS1-2',
          [
            N(
              'Real parrots can copy human speech, because they have a flexible voice organ called a syrinx and a very good ear for sound.',
            ),
            N(
              'Many just copy, like a recording. A few well-trained parrots may link words to things. So a parrot saying clever things may or may not know what it means.',
            ),
          ],
          'Learned that parrots mimic sounds with a syrinx, and that copying is different from understanding.',
        ),
      ],
    ),
    sc(
      'a13-12-complete',
      [
        N(
          'Pinocchio digs and digs, until the hole is deep enough to stand a haystack in. There is nothing at the bottom but more field.',
        ),
        P(
          'Then I’ll go to the judge. There’s a judge in this town. Judges are for exactly this.',
          'angry',
        ),
        N(
          'The Parrot laughs again. Your Nubbin throws a small clod of earth at him, which is not like it at all.',
        ),
        N('The clod misses. The Parrot laughs at that too.'),
      ],
      [
        ask(
          1,
          'sel',
          'being tricked is not the same as being foolish',
          'CASEL: Self-awareness',
          [
            N(
              'Pinocchio feels foolish and angry. The Parrot laughs. What is a wiser way to think about being tricked?',
            ),
          ],
          [
            o(
              'Tricksters are skilled; anyone can be fooled. Learn, and tell someone you trust.',
              [
                N(
                  'Yes. Being tricked says more about the trickster than about you. The best answer is to learn the warning signs.',
                ),
              ],
              true,
            ),
            o('Never trust anyone again.', [
              N(
                'That would be very lonely, and it lets the tricksters win twice. Learning to check is better than refusing to trust.',
              ),
            ]),
            o('Laugh at others who get tricked.', [
              N(
                'That adds more hurt. The Parrot’s laugh is exactly what makes tricked people hide and not ask for help.',
              ),
            ]),
          ],
          'Learned that anyone can be tricked, and that learning from it is wiser than shame.',
        ),
      ],
    ),
  ],
  [
    gl(
      'germinate',
      'to start to grow: when a seed sprouts its first root and shoot',
      'a13-12-field',
    ),
  ],
);

// ================================================================== A13-13 The Gorilla Judge
const A13: EduQuest = quest(
  'a13-13',
  'The Gorilla Judge',
  {
    'a13-13-s1': {
      goal: 'Go with Pinocchio to the court in Catchfools.',
      hint: 'The courthouse has the biggest door in town. Wipe your feet.',
    },
    'a13-13-s2': {
      goal: 'Wait outside the prison.',
      hint: 'His window is round the back. Your Nubbin fits between the bars.',
    },
  },
  [
    sc(
      'a13-13-court',
      [
        N(
          'The judge of Catchfools is a large old Gorilla, much respected for his age, his white beard and his gold spectacles.',
        ),
        N('The spectacles have no glass in them. He wears them, he says, for his weak eyes.'),
        N(
          'Pinocchio tells him everything: the names, the descriptions, the field, the hole, the Parrot. He asks for justice.',
        ),
        JG('Dear me. Dear me. Poor boy.', 'sad'),
        N(
          'The Judge listens with great kindness, nodding all the way through, and blows his nose. Then he rings a bell.',
        ),
        N('Two mastiffs come in, dressed as policemen.'),
        JG(
          'This poor creature has been robbed of four gold pieces. Take him away, and put him in prison at once.',
        ),
      ],
      [
        ask(
          6,
          'social-studies',
          'what makes a judge fair: listening, evidence and equal rules',
          'D2.Civ.8.K-2',
          [
            N(
              'The Judge listens kindly, then jails the victim. What should a fair judge do instead?',
            ),
          ],
          [
            o(
              'Look at the evidence and punish the one who did the wrong.',
              [
                N(
                  'Yes. Justice means judging what was done, not who is easiest to punish. A fair judge treats everyone by the same rules.',
                ),
              ],
              true,
            ),
            o('Punish whoever is nearest, to keep order.', [
              N(
                'That is what the Gorilla does, and it is unjust. Order built on punishing the wrong person is not order at all.',
              ),
            ]),
            o('Do nothing, in case it is awkward.', [
              N('A judge who does nothing leaves the victim with no help. Fairness takes action.'),
            ]),
          ],
          'Learned that a fair judge weighs evidence and treats everyone by the same rules.',
        ),
      ],
      [
        {
          id: 'object',
          label: 'Object. He’s the one who was robbed!',
          then: [
            JG('Exactly so. And the robbers are not here, so who else am I to lock up?', 'think'),
            N('In Catchfools, it seems, that counts as an answer.'),
          ],
        },
        {
          id: 'quiet',
          label: 'Keep quiet. Nothing here makes sense anyway.',
          then: [
            N(
              'You keep quiet. One of the mastiffs gives you a long, sorry look, as if he would have liked to object too.',
            ),
          ],
        },
      ],
    ),
    sc(
      'a13-13-court-done',
      [
        N(
          'Four months in prison, for the crime of being robbed. Pinocchio is led away with his mouth open, too surprised to cry.',
        ),
      ],
      [
        ask(
          0,
          'maths',
          'units of time: months, days and weeks',
          '4.MD.A.1',
          [N('Four months. If we count each month as 30 days, about how many days is that?')],
          [
            o(
              'About 120 days.',
              [
                N(
                  'Yes. 4 × 30 = 120 days, or a little over 17 weeks. That is a long time to wait for something you did not do.',
                ),
              ],
              true,
            ),
            o('About 34 days.', [
              N('That adds 4 and 30. Four months of 30 days each is 4 × 30 = 120.'),
            ]),
            o('About 12 days.', [
              N('A month is about 30 days, so four months is 4 × 30 = 120 days.'),
            ]),
          ],
          'Multiplied 4 months by 30 days to estimate about 120 days.',
        ),
      ],
    ),
    sc(
      'a13-13-prison',
      [
        N(
          'The atlas turns its own pages, softly, and four months go by. You take a room over the baker’s, round the corner from his window.',
        ),
        N(
          'Your Nubbin climbs in through the bars with crusts, and comes back out with messages, which are mostly “I’m bored”.',
        ),
        N(
          'Then one morning, bells. The young Emperor of Catchfools has won a great victory over somebody, and there are flags everywhere.',
        ),
        N('All the prisons are to be opened. All the rogues are to go free.'),
        N(
          'The jailer lets out the thieves, the cheats and the pickpockets. Then he shuts the door again in Pinocchio’s face.',
        ),
        JL('Not you. You’re not one of them.'),
        P('I beg your pardon. I’m a rogue as well.'),
        JL('Oh. Well, that’s quite different.', 'happy'),
        N('He takes off his cap, bows, and opens the door.'),
      ],
      [
        notice(
          3,
          'social-studies',
          'an amnesty is an official pardon; Collodi’s Italy had only just become one country',
          'D2.His.2.K-2',
          [
            N(
              'An amnesty is when a ruler pardons many people at once, often to celebrate. Collodi’s readers would have known the idea well.',
            ),
            N(
              'Collodi himself fought in the wars that joined the Italian states into one country. Italy became one kingdom in 1861, only twenty years before Pinocchio first appeared in the newspaper.',
            ),
          ],
          'Learned the word amnesty and that Italy became one kingdom in 1861, shortly before Collodi’s story.',
        ),
      ],
    ),
    sc(
      'a13-13-prison-done',
      [
        N(
          'Pinocchio walks out into the sunshine. His nose, you notice, stays exactly where it is.',
        ),
        N('Make of that what you will.'),
      ],
      [
        ask(
          1,
          'sel',
          'fairness: when a system rewards the wrong thing',
          'CASEL: Responsible decision-making',
          [
            N(
              'Pinocchio gets out only by calling himself a rogue, and his nose does not grow. Was it a lie? And what does the scene tell us about a system that frees rogues but jails the robbed?',
            ),
          ],
          [
            o('It is a joke at the system’s expense: the rules reward the wrong thing.', [
              N(
                'That’s a fair answer. Collodi is poking fun at an unfair rule, and the humour makes the unfairness easier to see.',
              ),
            ]),
            o('It is a small lie, but a lie all the same.', [
              N(
                'That’s a fair answer. His nose does not grow, which suggests Collodi thinks the rule is the greater wrong.',
              ),
            ]),
            o('It is the truth in a silly way: he did get tricked into trouble.', [
              N(
                'That’s a fair answer. “Rogue” is a stretch, but he has been foolish. The story keeps both ideas at once.',
              ),
            ]),
          ],
          'Thought about an unfair rule and whether calling yourself a rogue to escape it is honest.',
        ),
      ],
    ),
    sc(
      'a13-13-complete',
      [
        P(
          'Straight home now. Straight to the Fairy, then straight to Babbo. No stopping. Not for anything.',
        ),
        N(
          'You set off at a great pace. After an hour he is walking more slowly, and after two he is looking at the vineyards.',
        ),
        P(
          'Just one bunch of grapes. One. I’m so hungry I could eat my own cap. It is bread, after all.',
          'sad',
        ),
        N('He is over the vineyard wall before you can say anything about whose grapes they are.'),
      ],
      [
        ask(
          2,
          'sel',
          'hunger is a reason to ask, not a licence to take',
          'CASEL: Responsible decision-making',
          [
            N(
              'Pinocchio is truly hungry, but the grapes belong to the farmer. What could he do instead of climbing the wall?',
            ),
          ],
          [
            o(
              'Ask the farmer, or offer to work for some grapes.',
              [
                N(
                  'Yes. Hunger is real, and it is a good reason to ask for help. The farmer may well say yes.',
                ),
              ],
              true,
            ),
            o('Take just one; nobody will notice.', [
              N(
                'The farmer notices, as we are about to see. Taking without asking also takes away his choice to share.',
              ),
            ]),
            o('Wait until it gets dark.', [
              N(
                'Hiding does not change whose grapes they are. Asking in daylight is simpler and kinder.',
              ),
            ]),
          ],
          'Talked about asking or working for food instead of taking what is not yours.',
        ),
        notice(
          1,
          'social-studies',
          'vineyards are a big part of Tuscan farming; grapes are picked in early autumn',
          'D2.Geo.2.K-2',
          [
            N(
              'Tuscany is famous for its vineyards: rows of grapevines trained on wires over the hills. The grapes are harvested by hand in September and October.',
            ),
            N(
              'Some become wine, some are dried as raisins, and the Tuscan farmers have taken great care of them for centuries, which is why Pinocchio’s vineyard has a trap.',
            ),
          ],
          'Learned that vineyards are an important Tuscan crop, harvested in early autumn.',
        ),
      ],
    ),
  ],
  [
    gl(
      'amnesty',
      'an official pardon, when people who broke the law are set free',
      'a13-13-prison',
    ),
    gl('justice', 'fair treatment: what is right, not just what is easy', 'a13-13-court'),
  ],
);

// ================================================================== A13-14 The Guard Dog
const A14: EduQuest = quest(
  'a13-14',
  'The Guard Dog',
  {
    'a13-14-s1': {
      goal: 'Go after Pinocchio into the vineyard.',
      hint: 'Watch where you put your feet. Something under the vines is set for thieves.',
    },
    'a13-14-s2': {
      goal: 'Keep watch with Pinocchio by the hen-house.',
      hint: 'Sit in the dark. Don’t move when the visitors come.',
    },
  },
  [
    sc(
      'a13-14-trap',
      [
        N(
          'Pinocchio reaches for the first bunch. Snap: something under the vines closes on both his ankles, and holds.',
        ),
        N(
          'It is a trap, set by the farmer for the martens that come after his hens. His ankles are wood, so it doesn’t hurt; it just won’t let go.',
        ),
        P('Help! Get it off! Get it OFF!'),
        N(
          'You pull, and your Nubbin pulls on you. The trap does not care how many of you there are.',
        ),
        N(
          'At dark a farmer comes along the rows with a lantern, and holds it up to Pinocchio’s face.',
        ),
        FM('So. You’re the one who’s been at my hens.', 'angry'),
        P('No! I only came for two bunches of grapes!'),
        FM(
          'A grape thief is a hen thief, given time. My dog Melampo kept watch here for me. He died this morning.',
        ),
        FM('So you can be my watchdog tonight.'),
      ],
      [
        ask(
          6,
          'sel',
          'assuming the worst about someone instead of asking',
          'CASEL: Social awareness',
          [
            N(
              'The farmer decides a grape thief must be a hen thief. How could he have found out the truth instead of assuming?',
            ),
          ],
          [
            o('Ask questions and look for evidence before deciding.', [
              N(
                'That’s a fair answer. Questions first, conclusions second, is a habit worth keeping.',
              ),
            ]),
            o('Be stricter, so no thief ever gets away.', [
              N(
                'That’s a fair answer. But strictness without questions can punish the wrong person, as with the Gorilla Judge.',
              ),
            ]),
            o('Trust that thieves are always hungry.', [
              N(
                'That’s a fair answer, and a kind one. Hunger does explain a lot. It does not answer who raided the hens.',
              ),
            ]),
          ],
          'Thought about how assuming the worst can lead to unfair judgements.',
        ),
      ],
      [
        {
          id: 'plead',
          label: 'Tell the farmer he’s only a hungry puppet.',
          then: [
            FM('Then he’ll be a hungry watchdog. It’s one night. The kennel’s dry.'),
            N('He isn’t unkind. He is a man with a great many hens and no dog.'),
          ],
        },
        {
          id: 'straw',
          label: 'Help Pinocchio settle into the kennel straw.',
          then: [
            N(
              'You shake out the straw and pat it flat. Pinocchio climbs in and sits there in his paper suit, the saddest dog in Tuscany.',
            ),
          ],
        },
      ],
    ),
    sc(
      'a13-14-trap-done',
      [
        N(
          'The farmer buckles a brass collar round Pinocchio’s neck, on a long chain, and fastens the chain to the kennel.',
        ),
        FM('If thieves come, bark. Goodnight.'),
        P('The cricket said this would happen. Not the dog part. Everything else.', 'sad'),
      ],
      [
        notice(
          1,
          'science',
          'dogs hear much higher sounds than humans can, which makes them good guards',
          '1-PS4-1',
          [
            N(
              'People hear sounds up to about 20,000 vibrations a second. Dogs can hear more than twice as high, up to around 45,000.',
            ),
            N(
              'So a dog hears faint, high scratchings that we miss, and can swivel its ears to find where a sound comes from. That is why dogs make good guards.',
            ),
          ],
          'Learned that dogs hear much higher pitches than people and can locate sounds with their ears.',
        ),
      ],
    ),
    sc(
      'a13-14-martens',
      [
        N(
          'Around midnight four little shapes come slipping out of the dark. They have long bodies and short legs, and they smell of hens.',
        ),
        N(
          'They are martens. They like eggs, and chickens, and most of all they like not being seen.',
        ),
        MT('Good evening, Melampo.'),
        P('I’m not Melampo.'),
        MT('Then where’s the old dog?'),
        P('He died. This morning.'),
        MT('Died? Poor beast. He was such a reasonable dog.', 'sad'),
        MT(
          'You look reasonable too. Here’s what we had with him. You keep quiet, we take seven hens, and you get one, plucked.',
        ),
        P('Oh, yes. Very reasonable. Go right in.'),
        N(
          'The martens go into the hen-house, one after another. Pinocchio waits until the last tail is through the door.',
        ),
        N(
          'Then he pushes the door shut with his foot and rolls a stone against it. He barks like a proper dog: bow-wow, bow-wow, bow-wow!',
        ),
      ],
      [
        ask(
          7,
          'maths',
          'a two-step word problem with multiplication and subtraction',
          '3.OA.D.8',
          [
            N(
              'Suppose each of the four martens took 7 hens. The farmer has 30 hens. How many would be left?',
            ),
          ],
          [
            o(
              '2 hens.',
              [
                N(
                  'Yes. First 4 × 7 = 28 hens taken, then 30 − 28 = 2 left. Pinocchio’s trick saved the other 28.',
                ),
              ],
              true,
            ),
            o('11 hens.', [
              N('That adds 4 and 7. Multiply first: 4 × 7 = 28, then subtract: 30 − 28 = 2.'),
            ]),
            o('28 hens.', [
              N('28 is how many are taken. The question asks how many are left: 30 − 28 = 2.'),
            ]),
          ],
          'Solved a two-step problem: 4 × 7 = 28, then 30 − 28 = 2.',
        ),
      ],
    ),
    sc(
      'a13-14-martens-done',
      [
        N(
          'The farmer comes running in his nightshirt and nightcap, with his lantern, and catches all four martens in a sack.',
        ),
        FM('Well, I never! Well done, dog. Well done, boy. Whatever you are.', 'happy'),
      ],
      [
        ask(
          1,
          'science',
          'nocturnal animals: how night hunters find their way',
          '4-LS1-2',
          [N('Martens hunt at night. What helps a nocturnal animal find its way in the dark?')],
          [
            o(
              'Sharp hearing and smell, big eyes and whiskers.',
              [
                N(
                  'Yes. Nocturnal animals lean on senses that work without much light: ears, nose, whiskers and large eyes that gather every scrap of light.',
                ),
              ],
              true,
            ),
            o('A built-in torch.', [
              N(
                'A few animals make light, like glow-worms, but most night hunters rely on their senses.',
              ),
            ]),
            o('They cannot see at all and bump around.', [
              N('They see far better than we do in the dark, and use hearing and smell too.'),
            ]),
          ],
          'Learned that nocturnal animals depend on sharp hearing, smell, whiskers and big eyes.',
        ),
      ],
    ),
    sc(
      'a13-14-complete',
      [
        FM('And Melampo, all those years. Did he take hens off them?'),
        N(
          'Pinocchio knows; you can see him knowing it. He looks at the empty kennel for a long moment.',
        ),
        P('Melampo has died. Let him keep his good name. It doesn’t cost anything.', 'soft'),
        N(
          'The farmer takes off the collar and lets him go. He gives you both a handful of grapes for the road, which seems fair.',
        ),
      ],
      [
        ask(
          2,
          'literacy',
          'theme: the choice to speak kindly of someone who is not there',
          'RL.4.2',
          [
            N(
              'Pinocchio knows Melampo took hens, but chooses to let him “keep his good name”. What larger idea is the writer showing?',
            ),
          ],
          [
            o(
              'Kindness and fairness to someone who cannot answer back.',
              [
                N(
                  'Yes. It costs nothing and does no harm, and it shows the grown-up Pinocchio is starting to appear.',
                ),
              ],
              true,
            ),
            o('That dogs should never be trusted.', [
              N('The scene is about Pinocchio’s choice, not about dogs.'),
            ]),
            o('That lying always pays.', [
              N(
                'He is not lying. He is choosing not to say something unkind. That is a different thing.',
              ),
            ]),
          ],
          'Identified a theme: speaking kindly of someone who cannot answer back.',
        ),
      ],
    ),
  ],
  [
    gl(
      'marten',
      'a small, quick, long-bodied hunter of the weasel family that hunts at night',
      'a13-14-martens',
    ),
  ],
);

// ================================================================== A13-15 The Stone and the Pigeon
const A15: EduQuest = quest(
  'a13-15',
  'The Stone and the Pigeon',
  {
    'a13-15-s1': {
      goal: 'Go with Pinocchio to the Fairy’s white house.',
      hint: 'Through the wood, past the Big Oak. Read what you find there.',
    },
    'a13-15-s2': {
      goal: 'Follow the Pigeon to the sea.',
      hint: 'The Pigeon takes Pinocchio. You take the coast road, and you’ll have to hurry.',
    },
  },
  [
    sc(
      'a13-15-stone',
      [
        N(
          'Pinocchio runs all the way to the Big Oak. Past it, where the little white house stood, there is no house.',
        ),
        N(
          'There is grass, and a small white stone. On the stone there are words, cut carefully, in small letters.',
        ),
        P('What does it say? Read it. I can’t read. I was going to learn. I sold the book.', 'sad'),
        N('You kneel down by the stone. Your Nubbin brushes the leaves off it with both paws.'),
        P('Read it. Please.'),
        N(
          'The wind goes through the grass. The Big Oak creaks behind you, the way it did that night.',
        ),
      ],
      [
        ask(
          5,
          'sel',
          'telling hard news: gently, but not dishonestly',
          'CASEL: Relationship skills',
          [
            N(
              'You can read the stone exactly as it is, or gently, in pieces. Which is the kinder way to give someone hard news?',
            ),
          ],
          [
            o('Honestly but gently, so they are not left guessing.', [
              N(
                'That’s a fair answer. A careful voice and the full truth together are hard to beat.',
              ),
            ]),
            o('Softly and in small pieces, so it does not hit all at once.', [
              N(
                'That’s a fair answer. Time to take it in matters. Pinocchio will ask for the rest, and you should give it.',
              ),
            ]),
            o('Leave the sad part out.', [
              N(
                'That’s a fair answer, and it is tempting. But he will find out, and he may trust you less. Look at what the story shows.',
              ),
            ]),
          ],
          'Thought about telling hard news honestly and gently.',
        ),
      ],
      [
        {
          id: 'exact',
          label: 'Read it exactly as it is written.',
          then: [
            Y(
              '“Here the girl with blue hair waited for her little brother Pinocchio. He did not come, and she went away grieving.”',
            ),
            N('Pinocchio sits down on the grass very suddenly, as if his legs had come unglued.'),
          ],
        },
        {
          id: 'gentle',
          label: 'Read it gently, and leave out the grieving.',
          then: [
            Y('It says she waited for you. And then she had to go away.'),
            P('That isn’t all of it. Your mouth stopped. Read the rest.', 'sad'),
            Y('“…and she went away grieving.”'),
            N('Pinocchio sits down on the grass very suddenly, as if his legs had come unglued.'),
          ],
        },
      ],
    ),
    sc(
      'a13-15-stone-done',
      [
        N('He cries all night. The hills hear him and cry back, in echoes, until morning.'),
        P(
          'Little Fairy, come back. Where’s Babbo? Who’s going to give me bread now? Who’s going to tell me off?',
          'sad',
        ),
      ],
      [
        notice(
          0,
          'science',
          'an echo is sound bouncing back from a hard surface',
          '1-PS4-1',
          [
            N(
              'An echo is a sound that reflects, or bounces, off a hard, flat surface such as a hillside or a cliff, and comes back to your ears a moment later.',
            ),
            N(
              'Sound travels about 343 metres each second in the air. If you hear your echo after 2 seconds, the hill is roughly 343 metres away: it went there and back in that time.',
            ),
          ],
          'Learned that an echo is a reflected sound, and that the delay can show how far away the surface is.',
        ),
      ],
    ),
    sc(
      'a13-15-pigeon',
      [
        N('In the morning a great Pigeon, as big as a turkey, comes circling down out of the sky.'),
        PG('Do you happen to know a puppet called Pinocchio?'),
        P('Know him? It’s me!'),
        PG(
          'Then you’ll know Geppetto. Three days ago I left him on the seashore, building himself a little boat.',
        ),
        PG(
          'He has walked the country for four months looking for you. Now he means to cross the sea and look for you on the other side.',
        ),
        P('Babbo! Is it far? Can you take me?', 'shock'),
        PG(
          'Climb on my back, and hold on. Traveller, it’s the coast road for you. I’m strong, but I’m not a cart.',
        ),
        N(
          'Off they go, over the trees. You and your Nubbin take the coast road, and walk all day and half the night.',
        ),
      ],
      [
        ask(
          6,
          'social-studies',
          'compass directions: Tuscany’s sea is to the west',
          '4-ESS2-2',
          [
            N(
              'Tuscany lies in the middle of Italy, and its coast is on the west. If you walk from the hills to the sea, which compass direction are you heading?',
            ),
          ],
          [
            o(
              'West.',
              [
                N(
                  'Yes. The Tyrrhenian Sea lies to the west of Tuscany. Sunset points the way: the sun sets in the west.',
                ),
              ],
              true,
            ),
            o('East.', [
              N(
                'East is where the sun rises, and in Tuscany that is inland, towards the mountains. The sea is west.',
              ),
            ]),
            o('North.', [N('North heads towards the Alps. The sea is on Tuscany’s west side.')]),
          ],
          'Used a compass direction: Tuscany’s sea lies to the west.',
        ),
      ],
    ),
    sc(
      'a13-15-pigeon-done',
      [
        N(
          'At dawn you come out on the shore. There is a crowd on the beach, all pointing out to sea.',
        ),
        N(
          'Far out there is a tiny boat, and an old man in it, rowing. Pinocchio is on a rock at the water’s edge, waving his breadcrumb cap.',
        ),
      ],
      [
        notice(
          1,
          'science',
          'homing pigeons navigate using the sun, Earth’s magnetism and landmarks',
          '4-LS1-2',
          [
            N(
              'Real homing pigeons can find their loft from hundreds of kilometres away. They seem to use the Sun’s position, the Earth’s magnetic field and landmarks they remember.',
            ),
            N(
              'For centuries, people tied small messages to pigeons’ legs. Pinocchio’s Pigeon is carrying a puppet instead, which is a heavier load.',
            ),
          ],
          'Learned that homing pigeons find their way using the Sun, magnetism and landmarks.',
        ),
      ],
    ),
    sc(
      'a13-15-complete',
      [
        P('Babbo! BABBO! It’s me!', 'happy'),
        N('Out on the water the little old man stops rowing, and waves back. He has seen.'),
        N('Then a wave comes, bigger than all the others, and the boat is gone under it.'),
        N(
          'The crowd groans, but Pinocchio doesn’t make a sound. He climbs to the top of the rock, and jumps.',
        ),
        P('I’ll save him!'),
        N(
          'He swims like a fish, because he is wood, and wood floats. He goes out and out through the waves, until you can’t see him at all.',
        ),
      ],
      [
        ask(
          5,
          'science',
          'floating: balanced forces',
          '3-PS2-1',
          [
            N(
              'A floating thing has its weight pulling down and the water pushing up. For a log of wood bobbing on the sea, what do you know about those two forces?',
            ),
          ],
          [
            o(
              'They are balanced: equal and opposite.',
              [
                N(
                  'Yes. When the upward push of the water equals the downward pull of weight, the log neither sinks nor rises: it floats. Wood is light for its size, so a little water is enough to hold it up.',
                ),
              ],
              true,
            ),
            o('The water pushes harder than gravity.', [
              N(
                'If it did, the log would shoot up. At the surface the forces are equal and it sits steady.',
              ),
            ]),
            o('There is no push from the water.', [
              N(
                'Water pushes up on anything in it. That upward push is called buoyancy, and it is what keeps boats afloat.',
              ),
            ]),
          ],
          'Learned that floating happens when the water’s upward push balances an object’s weight.',
        ),
      ],
    ),
  ],
  [gl('inscription', 'words carved or cut into stone or metal', 'a13-15-stone')],
);

// ================================================================== A13-16 The Island of Busy Bees
const A16: EduQuest = quest(
  'a13-16',
  'The Island of Busy Bees',
  {
    'a13-16-s1': {
      goal: 'Cross to the island and find Pinocchio.',
      hint: 'A fishing boat will take you. Look for the puppet asking everybody for a penny.',
    },
    'a13-16-s2': {
      goal: 'Help carry the water home.',
      hint: 'Pinocchio takes one can. Your Nubbin will try to take the other.',
    },
    'a13-16-s3': {
      goal: 'Walk Pinocchio to the island school.',
      hint: 'He has promised. Walk beside him so he keeps it.',
    },
  },
  [
    sc(
      'a13-16-island',
      [
        N(
          'A fishing boat takes you over at first light. On the island there is a town where everybody is busy, which is why it is called the Island of Busy Bees.',
        ),
        N(
          'Pinocchio washed up here in the night, with no Babbo. A Dolphin told him the sea has a Terrible Dog-fish in it, and said no more.',
        ),
        N('Now he is going up and down the street, very hungry, asking everybody for a penny.'),
        CO('A penny? Help me pull this coal cart home, and I’ll give you forty.'),
        P('Pull a cart? I’m not a donkey! I’ve never pulled a cart in my life!', 'angry'),
        CO('Then eat your pride, lad, if you’re hungry. I’m told it’s very filling.'),
        N(
          'He asks a bricklayer next. Carry lime for an hour, says the bricklayer, and there’s a supper in it.',
        ),
        P('Lime is heavy. I’m not built for heavy. Look at my arms.'),
      ],
      [
        notice(
          0,
          'science',
          'honeybees live in a colony where every bee has a job',
          '3-LS2-1',
          [
            N(
              'A honeybee colony can hold tens of thousands of bees. Each has a job: one queen lays eggs, workers gather nectar, feed the young and guard the hive.',
            ),
            N(
              'Alone, a bee would not survive the winter. Together the colony keeps warm and fed. That is why Collodi named an island of hard workers after bees.',
            ),
          ],
          'Learned that honeybees survive as a colony in which each bee has a job.',
        ),
        ask(
          7,
          'sel',
          'whether work is something to avoid',
          'CASEL: Self-management',
          [
            N(
              'Pinocchio says work is for donkeys. Is work something to avoid, or part of a good life? Think about the coalman’s answer.',
            ),
          ],
          [
            o('Work can be tiring, but it also builds pride and independence.', [
              N(
                'That’s a fair answer. Many people find that effort brings its own kind of satisfaction, once they have finished.',
              ),
            ]),
            o('Avoid it if you can. Life is for enjoying.', [
              N(
                'That’s a fair answer. Rest and joy matter greatly. The question is who provides the supper while you rest.',
              ),
            ]),
            o('It depends whether the work is fair and chosen.', [
              N(
                'That’s a fair answer. Work that is fair, paid and chosen feels very different from work forced on someone.',
              ),
            ]),
          ],
          'Reflected on whether work is something to avoid or part of a good life.',
        ),
      ],
      [
        {
          id: 'carry',
          label: 'Carry a hod of lime yourself, to show him.',
          then: [
            N(
              'You carry it, and it is heavy. Your Nubbin carries one brick, very proudly, the whole way.',
            ),
            P('You’re a Keeper. You’re made for that sort of thing.', 'think'),
            N('You don’t think anybody is made for it. You just do it.'),
          ],
        },
        {
          id: 'tell',
          label: 'Tell him work isn’t the end of the world.',
          then: [
            P('It’s the end of the morning, and that’s worse.'),
            N(
              'But he watches the coal cart go off up the hill, and for a moment he looks as if he might go after it.',
            ),
          ],
        },
      ],
    ),
    sc(
      'a13-16-island-done',
      [N('Along the street comes a little woman, carrying two cans of water from the fountain.')],
      [
        ask(
          0,
          'maths',
          'units of mass and volume: a litre of water weighs a kilogram',
          '4.MD.A.1',
          [
            N(
              'Each can holds 10 litres, and a litre of water weighs about 1 kilogram. How much weight is the little woman carrying in two full cans?',
            ),
          ],
          [
            o(
              'About 20 kilograms.',
              [
                N(
                  'Yes. 10 kg × 2 cans = 20 kg. That is about the weight of a six-year-old child, which is why she asks for help.',
                ),
              ],
              true,
            ),
            o('About 12 kilograms.', [
              N('That adds 10 and 2. Each can is 10 kg, and there are two cans: 10 × 2 = 20.'),
            ]),
            o('About 10 kilograms.', [N('That is one can. She is carrying two, so 20 kilograms.')]),
          ],
          'Multiplied to find that two 10-litre cans of water weigh about 20 kilograms.',
        ),
      ],
    ),
    sc(
      'a13-16-water',
      [
        P('Good woman, will you give me a drink?'),
        WO(
          'Drink, child. Then carry one of these home for me, and I’ll give you a good piece of bread.',
        ),
        N(
          'Pinocchio looks at the can, which is nearly the size of him. He thinks about the bread, and picks up the can.',
        ),
        N(
          'Your Nubbin tries to pick up the other one, and very nearly drowns in a puddle of its own making.',
        ),
        N(
          'At her house the little woman gives him bread, a whole cauliflower dressed with oil and vinegar, and a sweet with cream in the middle.',
        ),
        N('He eats like a wolf. Then he looks up at her to say thank you, and stops, and stares.'),
        P('You’ve got blue hair. Like her. Just like her.', 'shock'),
        N('The little woman says nothing. She smiles, and that is enough.'),
        P(
          'It’s you! You were a little girl, and now you’re grown up. You’re almost like a mother.',
          'happy',
        ),
        FY('Then call me mother, if you like.', 'soft'),
      ],
      [
        notice(
          0,
          'social-studies',
          'Italian towns have public fountains, some fed by springs and old Roman water systems',
          'D2.His.2.K-2',
          [
            N(
              'Many Italian towns still have public fountains where people fetch water. Some are fed by springs, and some by channels first built by the Romans two thousand years ago.',
            ),
            N(
              'A fountain is where neighbours meet. That is why the Fairy, grown up, is found at one, carrying water like anyone else.',
            ),
          ],
          'Learned that many Italian towns have public fountains, some fed by ancient Roman water systems.',
        ),
      ],
    ),
    sc(
      'a13-16-water-done',
      [
        P('Why did you grow, and I didn’t? Look at me. I’m the same size as the day I was carved.'),
        FY('Puppets don’t grow. They stay just as they were made.'),
        P(
          'Then I’m tired of being made of wood! I want to be a boy, a proper one, like everybody else!',
          'sad',
        ),
        FY(
          'You can be. But it has to be earned, and nobody in the world can earn it for you.',
          'soft',
        ),
      ],
      [
        ask(
          3,
          'sel',
          'growth takes your own effort, and a helper cannot do it for you',
          'CASEL: Self-management',
          [
            N(
              'The Fairy says nobody can earn it for Pinocchio. What does a helper like the Fairy still do?',
            ),
          ],
          [
            o(
              'Show the way, encourage, and believe in you.',
              [
                N(
                  'Yes. A helper can guide you and cheer you on, but the doing has to be your own.',
                ),
              ],
              true,
            ),
            o('Do the hard parts so you do not have to.', [
              N(
                'That would be a kindness for a day, but you would not grow from it. Growing is the part you do yourself.',
              ),
            ]),
            o('Nothing. Helpers are no use.', [
              N(
                'Helpers matter very much. The Fairy is the reason Pinocchio is alive. They just cannot do the growing for him.',
              ),
            ]),
          ],
          'Talked about what a helper can and cannot do when someone is growing and learning.',
        ),
      ],
    ),
    sc(
      'a13-16-school',
      [
        P(
          'I’ll be good. I’ll go to school. I’ll work. I’ll tell the truth. And Babbo? Will I see Babbo again?',
        ),
        FY('If you are good, I think you will.'),
        N('Next morning he goes to school, the only wooden boy in a class of forty.'),
        N('The other boys try to hang their caps on his nose, and draw a moustache on him in ink.'),
        N(
          'He puts up with it for a morning. Then he kicks a few shins with his bark shoes, and after that they like him very much.',
        ),
        N(
          'The schoolmaster praises him. He is quick, he pays attention, and he is first through the door every morning.',
        ),
      ],
      [
        doit(
          3,
          'maths',
          'reading a bar graph: caps on Pinocchio’s nose each day',
          '3.MD.B.3',
          'edu:read:bar-graph:caps',
          [
            N(
              'Here is the count of caps hung on Pinocchio’s nose that first morning: 8 at nine o’clock, 5 at ten, 2 at eleven, and none at noon.',
            ),
            N(
              'Draw one bar for each hour, and read the story in the shape: the bars shrink as the boys come to like him.',
            ),
          ],
          'Made and read a bar graph showing a falling number of caps over four days.',
        ),
      ],
    ),
    sc(
      'a13-16-school-done',
      [
        N(
          'The atlas turns a page, gently, and a whole school year goes by. Pinocchio comes top in the examinations.',
        ),
      ],
      [
        notice(
          0,
          'science',
          'the four seasons come from the tilt of the Earth as it circles the Sun',
          '5-ESS1-2',
          [
            N(
              'A school year runs through spring, summer, autumn and winter. The seasons happen because the Earth’s axis is tilted about 23 degrees.',
            ),
            N(
              'When Tuscany leans towards the Sun, it gets longer, warmer days: summer. When it leans away, the days are short and cool: winter.',
            ),
          ],
          'Learned that the seasons are caused by the tilt of the Earth as it travels around the Sun.',
        ),
      ],
    ),
    sc(
      'a13-16-complete',
      [
        FY('I am pleased with you. Go on like this.', 'soft'),
        P('I will. I’ll go on and on. You’ll see.', 'happy'),
        N(
          'He means it, at the time. That is the trouble with Pinocchio: he always means it, at the time.',
        ),
        N(
          'Your Nubbin, who has been to school every day too, can now sit still for nearly a minute.',
        ),
      ],
      [
        ask(
          2,
          'sel',
          'good intentions and habits: how a promise becomes real',
          'CASEL: Self-management',
          [
            N(
              'He always means it, “at the time”. What turns a good intention into something you really do?',
            ),
          ],
          [
            o(
              'Small habits repeated each day.',
              [
                N(
                  'Yes. Habits carry us when feeling does not. Tiny actions, done often, turn a wish into who we are.',
                ),
              ],
              true,
            ),
            o('A very strong feeling in the moment.', [
              N('Strong feelings fade. Habits hold when the feeling is gone.'),
            ]),
            o('Telling more people about the promise.', [
              N(
                'It can help, because others can remind us. But it is the daily doing that makes the difference.',
              ),
            ]),
          ],
          'Talked about how habits turn good intentions into real change.',
        ),
      ],
    ),
  ],
  [
    gl(
      'colony',
      'a large group of animals, such as bees, that live and work together',
      'a13-16-island',
    ),
    gl('hod', 'a tray on a pole, used by builders to carry bricks or mortar', 'a13-16-island'),
  ],
);

// ================================================================== A13-17 The Dog-fish Trick
const A17: EduQuest = quest(
  'a13-17',
  'The Dog-fish Trick',
  {
    'a13-17-s1': {
      goal: 'Go down to the beach with Pinocchio and the schoolboys.',
      hint: 'Keep up. They’re running, and they don’t want to be followed.',
    },
    'a13-17-s2': {
      goal: 'Keep clear of the fight on the beach.',
      hint: 'You can’t stop it. Watch the books.',
    },
    'a13-17-s3': {
      goal: 'Get Alidoro out of the sea.',
      hint: 'Pinocchio is in the water. So is the dog, and the dog can’t swim. Wade in from the shallows.',
    },
    'a13-17-s4': {
      goal: 'Find Pinocchio along the shore.',
      hint: 'He swam round the point. Look for smoke coming out of a cave.',
    },
  },
  [
    sc(
      'a13-17-lure',
      [
        SB(
          'Pinocchio! The Terrible Dog-fish has come to the beach! It’s as big as a mountain! Come and see!',
        ),
        P('The Dog-fish? Perhaps it’s the one that… Babbo’s boat…', 'think'),
        P('After school. We’ll go after school.'),
        SB('After school he’ll be gone! Do you think he’ll wait for you? He’s a fish!'),
        N(
          'The schoolboys are already running. Pinocchio looks at the school door, and then at the road to the sea.',
        ),
        N('You know which one he’s going to choose. So does he.'),
      ],
      [
        ask(
          5,
          'sel',
          'saying no to friends who push you to break a promise',
          'CASEL: Relationship skills',
          [
            N(
              'The boys push Pinocchio to skip school with “he won’t wait for you!” What could he say to keep his promise and keep his friends?',
            ),
          ],
          [
            o(
              '“I’ll come after school, and you can tell me all about it.”',
              [N('Yes. A calm no plus a real offer keeps the friendship. A true friend can wait.')],
              true,
            ),
            o('Run off with them and hope for the best.', [
              N('That is what Pinocchio does. It is easy, but it breaks the promise he made.'),
            ]),
            o('Say nothing and stay put.', [
              N(
                'Staying put is brave. Saying why helps your friends understand and may stop them pressing.',
              ),
            ]),
          ],
          'Practised a calm no to friends who pressure you, while keeping the friendship.',
        ),
      ],
      [
        {
          id: 'school',
          label: 'Tell him: school first, the beach after.',
          then: [
            P('After! Everything’s after, with you. With everyone.', 'angry'),
            N('He runs. You follow, because somebody should.'),
          ],
        },
        {
          id: 'go',
          label: 'Go with him. You want to see the Dog-fish too.',
          then: [N('You go. It is a bad idea, and you both know it, and the sun is out.')],
        },
      ],
    ),
    sc(
      'a13-17-lure-done',
      [
        N(
          'At the beach the sea is flat and empty, as smooth as a plate. There is no Dog-fish, and there never was.',
        ),
      ],
      [
        notice(
          0,
          'literacy',
          'pescecane is the Italian word for shark; it means “dog-fish”',
          'L.3.4',
          [
            N(
              'In the Italian book, the monster is a pescecane, literally a “fish-dog”. In modern Italian the word means shark.',
            ),
            N(
              'Real dogfish are small sharks, and shark skeletons are made of cartilage, the bendy stuff in your ears and nose, not bone. The translators called it a Dog-fish and Collodi’s readers thought shark.',
            ),
          ],
          'Learned that pescecane (dog-fish) is Italian for shark, and that sharks have cartilage skeletons.',
        ),
      ],
    ),
    sc(
      'a13-17-fight',
      [
        SB(
          'Ha! You came! Now you’ll be in trouble like the rest of us. You make us look bad, being good all the time.',
          'happy',
        ),
        N(
          'Pinocchio goes red under his paint. Somebody pushes somebody, and in a moment there is a fight.',
        ),
        N(
          'They throw their school books at him. He ducks, and the books sail over his head into the sea.',
        ),
        N(
          'The fish come up to taste them. They nibble a page, spit it out and swim off, as if they get enough of that at home.',
        ),
        N('Then somebody throws the big arithmetic book, the heaviest book in the school.'),
        N(
          'It misses Pinocchio. It hits a boy called Eugene on the head, and he goes down on the sand.',
        ),
        N(
          'Everyone runs. Everyone except Pinocchio, who kneels by Eugene and wets his handkerchief in the sea for his forehead.',
        ),
      ],
      [
        ask(
          1,
          'sel',
          'why people resent someone for doing well',
          'CASEL: Social awareness',
          [
            N(
              'The boys say Pinocchio “makes them look bad” by being good. Why might people feel cross at someone who is doing well?',
            ),
          ],
          [
            o('They feel judged, or worry they are falling behind.', [
              N(
                'That’s a fair answer. Envy is often a hurt feeling in disguise, and it helps to notice it in ourselves.',
              ),
            ]),
            o('They are just bullies.', [
              N(
                'That’s a fair answer. Teasing someone for trying is unkind. Still, asking why can show us how to answer it.',
              ),
            ]),
            o('They feel left out and want company in bad behaviour.', [
              N(
                'That’s a fair answer. Groups sometimes pull their members down to feel the same, which is called peer pressure.',
              ),
            ]),
          ],
          'Thought about why people sometimes resent a friend for doing well.',
        ),
        notice(
          3,
          'science',
          'paper is made of wood fibres, and soaked paper falls apart',
          '2-PS1-1',
          [
            N(
              'Paper is made from wood: the trees are mashed to pulp, washed, pressed and dried into thin sheets of tangled fibres.',
            ),
            N(
              'In water, the fibres soak up water and the sheet loses its strength, so a soaked book turns to mush. That is why the fish nibble and spit.',
            ),
          ],
          'Learned that paper is made of wood fibres and weakens when it gets wet.',
        ),
      ],
    ),
    sc(
      'a13-17-fight-done',
      [
        EU('Ow. Who threw the sums?'),
        N(
          'Eugene sits up, with a bump on his head like half an egg. He is going to be all right, and Pinocchio goes weak with relief.',
        ),
        N(
          'Then two carabineers come down the beach. They see a wooden boy, a boy on the sand and a book, and decide what they’ve seen.',
        ),
        N('Pinocchio runs. They let their dog off the lead after him.'),
      ],
      [
        ask(
          1,
          'health',
          'first aid for a bump on the head: a cold pad, rest and a grown-up',
          'CASEL: Responsible decision-making',
          [
            N(
              'Eugene has a bump on his head. What is the right first aid, and what should always happen next?',
            ),
          ],
          [
            o(
              'A cold pad, a rest, and tell a grown-up straight away.',
              [
                N(
                  'Yes. Cold reduces swelling. A knock on the head can be serious even when it looks small, so an adult must check for dizziness or sleepiness.',
                ),
              ],
              true,
            ),
            o('Rub it hard and carry on playing.', [
              N(
                'Rubbing and playing on is risky. Rest, a cold pad and a grown-up’s eyes are better.',
              ),
            ]),
            o('Say nothing so nobody gets in trouble.', [
              N(
                'A head injury is too important to hide. Tell an adult; being honest is how you keep a friend safe.',
              ),
            ]),
          ],
          'Learned first aid for a bump on the head: cold pad, rest, and tell a grown-up.',
        ),
      ],
    ),
    sc(
      'a13-17-alidoro',
      [
        N(
          'The dog is a great mastiff called Alidoro, and he runs like a train. Pinocchio throws himself into the sea, and Alidoro goes in after him.',
        ),
        N(
          'Alidoro cannot swim. He goes under, comes up, and goes under again, paddling wildly and getting nowhere.',
        ),
        AL('Help! Pinocchio! Save me!', 'shock'),
        N(
          'Pinocchio is already halfway to the horizon. He stops, and treads water, and looks back.',
        ),
        P('If I save you, will you promise not to chase me?'),
        AL('I promise! I promise! Anything!'),
      ],
      [
        ask(
          1,
          'literacy',
          'vocabulary: words for swimming badly',
          'L.3.4',
          [
            N(
              'Alidoro is “paddling wildly and getting nowhere”. Which word best describes struggling clumsily in water?',
            ),
          ],
          [
            o(
              'Floundering.',
              [
                N(
                  'Yes. To flounder is to struggle awkwardly, as in water or mud. It is also what people do when they cannot find the right words.',
                ),
              ],
              true,
            ),
            o('Gliding.', [N('Gliding is smooth and easy. Alidoro is doing the opposite.')]),
            o('Diving.', [N('Diving is a planned plunge. Alidoro is not planning anything.')]),
          ],
          'Learned the word flounder and chose it to describe clumsy struggling.',
        ),
      ],
    ),
    sc(
      'a13-17-alidoro-done',
      [
        N(
          'Pinocchio swims back and gets Alidoro by the tail. You wade in and take the other end, and the dog comes out like a wet carpet.',
        ),
        AL('You saved me. I don’t forget a thing like that.', 'soft'),
        N('He shakes himself all over you, by way of thanks, and trots off home.'),
      ],
      [
        notice(
          2,
          'sel',
          'gratitude turns a good deed into a friendship',
          'CASEL: Social awareness',
          [
            N(
              'Alidoro says he will never forget what Pinocchio did. Being thanked and remembered is a powerful reward, and it makes the next kind act more likely.',
            ),
            N(
              'Researchers who study kindness have found that grateful people tend to help others more. Thank-yous matter more than most of us think.',
            ),
          ],
          'Talked about gratitude and how thanks encourages more kindness.',
        ),
      ],
    ),
    sc(
      'a13-17-fisher',
      [
        N(
          'Round the point there is a cave with smoke coming out of it. You go in carefully, and stop at the back in the dark.',
        ),
        N(
          'A fisherman is frying fish. He is green all over: green skin, green hair, and a beard of long green grass, like a lizard that has stood up.',
        ),
        N(
          'He has a net full of fish, and he is sorting them, very pleased with himself. In the middle of the net is Pinocchio.',
        ),
        GF(
          'Mullet. Into the pan. Bream. Into the pan. Anchovies, into the pan. And what are you?',
          'happy',
        ),
        P('I’m a puppet!'),
        GF(
          'A puppet-fish! I’ve never had a puppet-fish. A talking one, too. I’ll keep you for last, as a treat.',
          'happy',
        ),
        N(
          'He rolls Pinocchio in flour from head to foot, until he looks like a plaster saint, and holds him over the pan by one leg.',
        ),
        P('I’m not a fish! Fish don’t wear shoes!', 'shock'),
      ],
      [
        ask(
          6,
          'maths',
          'division: equal groups and batches',
          '3.OA.A.3',
          [
            N(
              'The pan holds 4 fish at a time. The Green Fisherman has 12 mullet to fry. How many batches will he need?',
            ),
          ],
          [
            o(
              '3 batches.',
              [
                N(
                  'Yes. 12 ÷ 4 = 3. Division asks how many equal groups fit. Three batches of four.',
                ),
              ],
              true,
            ),
            o('8 batches.', [
              N('That subtracts: 12 − 4. Division asks how many groups of 4 fit in 12: 3.'),
            ]),
            o('48 batches.', [
              N(
                'That multiplies. We want to know how many groups of 4 are in 12, so we divide: 12 ÷ 4 = 3.',
              ),
            ]),
          ],
          'Divided 12 fish by a pan size of 4 to find 3 batches.',
        ),
      ],
    ),
    sc(
      'a13-17-fisher-done',
      [
        N(
          'Something big comes bounding past you into the cave: Alidoro, dry now, following his nose, which is a very good nose for flour.',
        ),
        N(
          'He takes Pinocchio out of the fisherman’s hand, gently, in his teeth, and is gone before the green man can say “anchovy”.',
        ),
        AL('Now we’re even.', 'happy'),
      ],
      [
        notice(
          0,
          'science',
          'a dog’s sense of smell is hundreds of times more powerful than ours',
          '4-LS1-2',
          [
            N(
              'A dog has around 300 million smell receptors in its nose. A person has about 5 million. A big part of a dog’s brain is for reading smells.',
            ),
            N(
              'So Alidoro could pick Pinocchio’s scent out of a cave full of fish, smoke and flour, the way you might spot a friend in a crowd.',
            ),
          ],
          'Learned that a dog’s nose has many more smell receptors than ours, which is why dogs track so well.',
        ),
      ],
    ),
    sc(
      'a13-17-complete',
      [
        N(
          'Pinocchio walks home to the Fairy that night, floured like a loaf, and knocks. The Snail who keeps the door looks out of the top window.',
        ),
        N(
          'It takes her nine hours to come down. Pinocchio is asleep on the step when the door opens.',
        ),
        N(
          'The Fairy forgives him, again. He goes back to school, and works, and this time he is good for a whole year.',
        ),
        FY('Tomorrow you will stop being a puppet. Tomorrow, you will be a boy.', 'soft'),
        P(
          'Tomorrow? Really tomorrow? I’ll invite everybody! I’ll go and invite them now!',
          'happy',
        ),
      ],
      [
        ask(
          1,
          'maths',
          'time intervals: when does the Snail arrive',
          '3.MD.A.1',
          [
            N(
              'The Snail sets off from the top window at 4:30 in the morning and takes 9 hours to come down. What time does she open the door?',
            ),
          ],
          [
            o(
              '1:30 in the afternoon.',
              [
                N(
                  'Yes. 4:30 plus 9 hours is 13:30, which is 1:30 pm. Snails move on one muscular foot over a trail of slime, which is why they are not in a hurry.',
                ),
              ],
              true,
            ),
            o('9:30 in the morning.', [
              N(
                'That adds only 5 hours. Count on 9 hours from 4:30: noon is 7½ hours, then 1½ more.',
              ),
            ]),
            o('4:30 in the afternoon.', [
              N('That would be 12 hours. Nine hours from 4:30 am lands at 1:30 pm.'),
            ]),
          ],
          'Added 9 hours to 4:30 am to find 1:30 pm.',
        ),
      ],
    ),
  ],
  [
    gl(
      'floundering',
      'struggling clumsily, as in water or mud, or when you cannot find your words',
      'a13-17-alidoro',
    ),
    gl('mastiff', 'a very large, strong dog with a broad head', 'a13-17-alidoro'),
  ],
);

// ================================================================== A13-18 The Land of Toys
const A18: EduQuest = quest(
  'a13-18',
  'The Land of Toys',
  {
    'a13-18-s1': {
      goal: 'Go with Pinocchio to invite his friends.',
      hint: 'The last one on his list is the hardest to find.',
    },
    'a13-18-s2': {
      goal: 'Find Pinocchio in the Land of Toys.',
      hint: 'Look anywhere there’s noise. That narrows it down to everywhere.',
    },
    'a13-18-s3': {
      goal: 'Stay near Pinocchio in the circus ring.',
      hint: 'He can’t talk any more. Watch the lady in the box above the ring.',
    },
  },
  [
    sc(
      'a13-18-candlewick',
      [
        N(
          'The last friend on Pinocchio’s list is the laziest boy in the school: tall and thin and pale, like the wick of a new candle. Everyone calls him Candlewick.',
        ),
        N('You find him at midnight in a doorway on the road out of town, with a bundle.'),
        CW2('Me? A party? Can’t. I’m going away tonight. To the Land of Toys.', 'happy'),
        CW2(
          'No schools. No teachers. No books. The holidays start on the first of January and end on the last day of December.',
        ),
        CW2('Every week has six Saturdays and a Sunday. Come with me. Why don’t you come?'),
        P('I can’t. I promised the Fairy. Tomorrow I’m going to be a boy.'),
        N(
          'Down the road comes a coach, with no sound at all. It is drawn by twelve pairs of donkeys, and the donkeys are all wearing white leather boots.',
        ),
        N(
          'Driving it is a Little Man, wider than he is tall, soft and shiny like a pat of butter, with a little mouth that never stops smiling.',
        ),
        LM('Climb up, my dears. Plenty of room. There’s always room, for boys.', 'happy'),
      ],
      [
        ask(
          8,
          'sel',
          'safe is not the same as well: what a good life needs besides fun',
          'CASEL: Responsible decision-making',
          [
            N(
              'In the Land of Toys nothing is hard, nobody is cross, and there is no school. What might be missing from a place where it is always play and never effort?',
            ),
          ],
          [
            o('Growing, learning and being useful to others.', [
              N(
                'That’s a fair answer. A place can feel wonderful and still leave you no room to grow. That is the trap the Little Man is selling.',
              ),
            ]),
            o('Nothing is missing. It sounds perfect.', [
              N(
                'That’s a fair answer. It does sound perfect, and that is why the trick works. Ask what the donkey in boots knows that you don’t.',
              ),
            ]),
            o('Rest and play are good; it is only too much that is the trouble.', [
              N('That’s a fair answer. A good life has play, rest and work in the right amounts.'),
            ]),
          ],
          'Thought about the difference between a place that feels good and one that helps you grow.',
        ),
      ],
      [
        {
          id: 'coat',
          label: 'Remind him of the coat Geppetto sold.',
          then: [
            P('That was ages ago! I’ll be back before he… I’ll only stay a day.', 'angry'),
            N('He doesn’t look at you, and he climbs up anyway.'),
          ],
        },
        {
          id: 'hand',
          label: 'Take his hand and turn him towards home.',
          then: [
            N(
              'He lets you, for three steps. Then he pulls his hand away and runs, and climbs up beside Candlewick.',
            ),
          ],
        },
      ],
    ),
    sc(
      'a13-18-candlewick-done',
      [
        N(
          'As he climbs up, the donkey nearest you turns its head and speaks, very low. Poor fool, it says, you’ll be sorry.',
        ),
        N(
          'Nobody else hears. The Little Man flicks his whip, and the coach goes without a sound, and you run after it all night.',
        ),
      ],
      [
        notice(
          0,
          'science',
          'a donkey’s long ears help it lose heat in the hot places its wild relatives come from',
          '4-LS1-1',
          [
            N(
              'The first donkeys were tamed in Africa more than five thousand years ago, from wild asses that lived in dry, hot country.',
            ),
            N(
              'Those long ears are an adaptation. Blood flows close under the thin skin, so the ears shed heat like radiators. Their loud voices carry far across open land.',
            ),
          ],
          'Learned that donkeys were first tamed in Africa and that long ears help them lose heat.',
        ),
      ],
    ),
    sc(
      'a13-18-toys',
      [
        N(
          'The Land of Toys is boys and nothing else. Boys playing ball, boys on stilts, boys dressed as generals, boys shouting just to hear the noise.',
        ),
        N(
          'On the walls, in chalk, it says LONG LIF TOYS and DOWN WITH SKOOL and NO MOR SUMS. The spelling is a matter of taste.',
        ),
        N(
          'Pinocchio is in the middle of it all with Candlewick, laughing so hard that he has to hold on to a lamp-post.',
        ),
        P('Isn’t it wonderful? Admit it! Admit it’s wonderful!', 'happy'),
        N(
          'At a stall your Nubbin finds a pair of paper donkey ears on a band, and wears them about. They are only paper, and they come off.',
        ),
        N(
          'The atlas turns its pages, one after another. Five months go by, and every one of them is a holiday.',
        ),
      ],
      [
        ask(
          1,
          'maths',
          'unit fractions: one day out of seven',
          '3.NF.A.1',
          [
            N(
              'Candlewick says every week has six Saturdays and one Sunday. That is still seven days. What fraction of those days is the Sunday?',
            ),
          ],
          [
            o(
              'One seventh (1/7).',
              [
                N(
                  'Yes. One day out of seven equal days is 1/7. Silly names do not change how many days there are in a week.',
                ),
              ],
              true,
            ),
            o('One sixth (1/6).', [
              N('There are 7 days in the week, so each day is one seventh, not one sixth.'),
            ]),
            o('One half (1/2).', [
              N('A half would need 2 equal parts. A week has 7, so a single day is 1/7.'),
            ]),
          ],
          'Named one day of a seven-day week as the unit fraction 1/7.',
        ),
      ],
    ),
    sc(
      'a13-18-toys-done',
      [
        N(
          'Then one morning Pinocchio wakes up and puts his hand to his head. He has ears: long, hairy ears, like a donkey’s.',
        ),
        N('A little Marmot who lives upstairs looks at them, and shakes her head.'),
        MA(
          'Donkey fever. Boys who do nothing but play all catch it in the end. In an hour or two you won’t be a boy or a puppet. You’ll be a donkey.',
          'sad',
        ),
      ],
      [
        notice(
          2,
          'science',
          'marmots survive winter by hibernating',
          '3-LS4-3',
          [
            N(
              'Real marmots live high in mountains, including the Italian Alps. In winter there is no food, so they hibernate: they curl up underground, and their hearts and breathing slow right down.',
            ),
            N(
              'A hibernating marmot lives off the fat it stored all summer. That is a way of surviving in a place where winter is harsh.',
            ),
          ],
          'Learned that marmots hibernate through the winter, living off stored fat.',
        ),
      ],
    ),
    sc(
      'a13-18-circus',
      [
        N(
          'Candlewick has the ears too. They laugh at each other until the laughing turns to braying, and then they are both donkeys, right down to the tail.',
        ),
        N(
          'The Little Man comes to collect them, smiling his little smile, and sells them at the market. That was always his business.',
        ),
        N(
          'Candlewick goes to a farmer. Pinocchio goes to a circus, where the director teaches him to dance and jump through hoops, and is not gentle about it.',
        ),
        N(
          'On the first night, in a box above the ring, there is a lady with a gold locket. In the locket is a picture of a puppet.',
        ),
        N(
          'Pinocchio sees her and tries to call out to her. What comes out is a bray, so loud that the audience laughs.',
        ),
        N(
          'He jumps for the hoop, catches his back leg on it and comes down hard. After that he is lame.',
        ),
        N('The director sells him for a few pennies to a drum-maker.'),
        N(
          'The man ties a rope to him and lowers him off a rock into the sea. You watch from the cliff, and can’t stop it.',
        ),
      ],
      [
        ask(
          4,
          'literacy',
          'animal sound words: which sound is a bray',
          'L.2.4',
          [
            N(
              'Pinocchio tries to call out and what comes out is a bray. Which animal sound is a bray?',
            ),
          ],
          [
            o(
              'The loud “hee-haw” of a donkey.',
              [
                N(
                  'Yes. Bray is the harsh, loud call of a donkey. Words like bray, neigh, bleat and cluck sound a little like the animal.',
                ),
              ],
              true,
            ),
            o('The soft purr of a cat.', [N('A cat purrs. The word bray is for a donkey’s call.')]),
            o('The quack of a duck.', [N('Ducks quack. A donkey brays.')]),
          ],
          'Learned that bray is the sound a donkey makes.',
        ),
      ],
    ),
    sc(
      'a13-18-sea',
      [...SEA],
      [
        notice(
          0,
          'science',
          'sea water is salty and wood floats in it more easily than in fresh water',
          '2-PS1-1',
          [
            N(
              'Sea water holds about 35 grams of salt in every litre. The salt makes the water denser, so it holds things up better than fresh water does.',
            ),
            N(
              'A wooden puppet floats in a fresh pond. In the sea, he floats even higher, which is how he bobs up out of a rope-and-rock job.',
            ),
          ],
          'Learned that salt makes sea water denser, so things float more easily in it.',
        ),
        ask(
          3,
          'maths',
          'multiplying by ten: salt in a bucket of sea water',
          '3.OA.A.3',
          [
            N(
              'Sea water has about 35 grams of salt in each litre. How much salt is in a 10-litre bucket of it?',
            ),
          ],
          [
            o(
              '350 grams.',
              [
                N(
                  'Yes. 35 × 10 = 350 g. That is about a mugful of salt in one bucket of sea water.',
                ),
              ],
              true,
            ),
            o('45 grams.', [
              N('That adds 35 and 10. Ten litres means ten times as much: 35 × 10 = 350.'),
            ]),
            o('3.5 grams.', [
              N(
                'That divides by 10. A bucket holds ten times as much as one litre, so multiply: 350.',
              ),
            ]),
          ],
          'Multiplied 35 g by 10 litres to find 350 g of salt in a bucket of sea water.',
        ),
      ],
    ),
    sc(
      'a13-18-complete',
      [
        N(
          'The drum man lends you his boat to go after his donkey, grumbling. You row out, with your Nubbin in the bows, still in its paper ears.',
        ),
        N(
          'Ahead, Pinocchio is swimming for a white rock where a little goat stands bleating at him. Her wool is blue.',
        ),
        N(
          'Behind him, the sea rises up out of itself. A head comes out of the water, as big as a house, with a mouth like a cave.',
        ),
        N(
          'It is the Terrible Dog-fish. It breathes in, and in goes Pinocchio, and in goes the sea, and in go you, boat and all.',
        ),
      ],
      [
        notice(
          3,
          'science',
          'the whale shark, the biggest fish, gulps sea water and strains out tiny food',
          '4-LS1-1',
          [
            N(
              'Some real sharks feed a bit like this. The whale shark, the biggest fish in the sea, opens its huge mouth and gulps sea water.',
            ),
            N(
              'The water streams out through its gills, and sieve-like pads catch the plankton: tiny drifting animals and plants.',
            ),
            N(
              'The Dog-fish is imaginary, and much hungrier, but a shark that swallows the sea comes from nature.',
            ),
          ],
          'Learned that the whale shark feeds by gulping sea water and straining out plankton.',
        ),
      ],
    ),
  ],
  [
    gl('hibernate', 'to spend the winter in a deep, slow sleep to save energy', 'a13-18-toys-done'),
    gl(
      'plankton',
      'tiny animals and plants that drift in the sea and are food for many sea creatures',
      'a13-18-complete',
    ),
  ],
);

// ================================================================== A13-19 The Terrible Dog-fish
const A19: EduQuest = quest(
  'a13-19',
  'The Terrible Dog-fish',
  {
    'a13-19-s1': {
      goal: 'Find your way through the dark inside the Dog-fish.',
      hint: 'Follow the faint light, far off. Mind the puddles; they’re mostly sea.',
    },
    'a13-19-s2': {
      goal: 'Go to the old man at the table.',
      hint: 'You know who it is. So does Pinocchio. Let him go first.',
    },
    'a13-19-s3': {
      goal: 'Light the way to the Dog-fish’s mouth.',
      hint: 'Your Nubbin carries the candle. Walk softly; the Dog-fish is asleep.',
    },
  },
  [
    sc(
      'a13-19-belly',
      [
        N(
          'It is dark and wet, and it smells of fried fish, which is not reassuring when you are inside one.',
        ),
        N('Your boat lies on its side in a shallow pool.'),
        P('Help! Help! Isn’t anyone here?', 'shock'),
        TU('Only us unfortunates.'),
        P('Who’s that?'),
        TU('A poor Tunny, swallowed at the same time as you. What sort of fish are you?'),
        P('I’m not any sort of fish! I’m a puppet. And that’s a traveller, and that’s a Nubbin.'),
        TU(
          'Then why let yourselves be swallowed? Never mind. Now we wait to be digested, with dignity.',
          'think',
        ),
        P('I don’t want to be digested!'),
        N('Far away, down the long dark of the Dog-fish, there is a little light.'),
      ],
      [
        ask(
          9,
          'science',
          'we see only when light reaches our eyes',
          '1-PS4-2',
          [
            N(
              'It is completely dark inside the Dog-fish, yet you can spot one tiny candle from far away. Why does a small light show up so well in total darkness?',
            ),
          ],
          [
            o(
              'Because light travels straight to our eyes, and there is no other light to hide it.',
              [
                N(
                  'Yes. Light moves in straight lines, and a dark place has nothing to drown it out. On a dark night, one candle flame can be seen from more than a kilometre away.',
                ),
              ],
              true,
            ),
            o('Because the candle makes a sound.', [
              N(
                'We see light, not sound. Light from the flame reaches your eyes, and that is how you see it.',
              ),
            ]),
            o('Because eyes shine in the dark.', [
              N(
                'Eyes do not make light. They collect it. In a dark place, even a tiny flame is easy to spot.',
              ),
            ]),
          ],
          'Learned that we see when light reaches our eyes, and that a small light shows up in the dark.',
        ),
      ],
      [
        {
          id: 'light',
          label: 'Head for the light.',
          then: [
            N(
              'You start towards it. Your Nubbin goes first, because it is smallest and has the best eyes.',
            ),
          ],
        },
        {
          id: 'how',
          label: 'Ask the Tunny how big the Dog-fish is.',
          then: [
            TU(
              'A mile long, not counting the tail. I have never counted the tail. Nobody comes back from counting the tail.',
            ),
            N('You decide to head for the light.'),
          ],
        },
      ],
    ),
    sc(
      'a13-19-belly-done',
      [
        N('The light is a candle, stuck in the neck of a green glass bottle on a little table.'),
        N('At the table sits an old man, as white as snow, eating a very small fish.'),
      ],
      [
        ask(
          1,
          'maths',
          'time units: two years in weeks',
          '4.MD.A.2',
          [
            N(
              'Geppetto has been inside the Dog-fish for two years. A year has 52 weeks. If he lit one new candle every week, how many candles would he have burned?',
            ),
          ],
          [
            o(
              '104 candles.',
              [
                N(
                  'Yes. 52 × 2 = 104 weeks, so 104 candles. A ship’s whole store of candles could run out in two years.',
                ),
              ],
              true,
            ),
            o('54 candles.', [
              N('That adds 52 and 2. Two years means 52 weeks twice: 52 × 2 = 104.'),
            ]),
            o('52 candles.', [N('That is one year. Geppetto has been here for two: 104 candles.')]),
          ],
          'Multiplied 52 weeks by 2 years to find 104 weeks.',
        ),
      ],
    ),
    sc(
      'a13-19-babbo',
      [
        N('Pinocchio stops, and shakes all over. He tries to speak and can’t, and then he can.'),
        P(
          'Babbo! It’s you! It’s really you! I won’t leave you again. Not ever. Not ever, ever!',
          'happy',
        ),
        G('Pinocchio? Is it you? My Pinocchio?', 'shock'),
        N(
          'Pinocchio is in his arms before he has finished, kissing him, talking, crying, all at once.',
        ),
        P(
          'I sold the book, and Fire-eater sneezed, and the Fox and the Cat, and the oak, and the nose, and I was a donkey, Babbo, a whole donkey—',
        ),
        G('Hush. Hush. You’re here.', 'soft'),
        G(
          'Two years I’ve been in here. A ship was swallowed the same day, full of stores: biscuits, cheese, candles, matches. It lasted, till now.',
        ),
        G('This is the last candle. When it goes out, we’ll be in the dark.', 'sad'),
        P('Then we have to get out. Now. Through the mouth.'),
        G('I can’t swim, my boy.'),
        P('I can. I’m wood. I’ll carry you.'),
      ],
      [
        ask(
          2,
          'sel',
          'how to tell when someone really means a promise',
          'CASEL: Relationship skills',
          [
            N(
              'Pinocchio promises “I won’t leave you again. Not ever.” He has made promises before. How can we tell whether someone really means a promise like that?',
            ),
          ],
          [
            o('By what they do afterwards, not only what they say.', [
              N(
                'That’s a fair answer. A promise is proved over time. And the way he behaves in the next scenes is the real answer.',
              ),
            ]),
            o('By how upset they are when they say it.', [
              N(
                'That’s a fair answer. Real feeling matters. But Pinocchio has been upset and sincere before, and still run off.',
              ),
            ]),
            o('We cannot know. We choose to trust and watch.', [
              N('That’s a fair answer. Trust is a choice, and it grows when promises are kept.'),
            ]),
          ],
          'Reflected on how promises are proved by actions over time.',
        ),
      ],
    ),
    sc(
      'a13-19-babbo-done',
      [
        G('And you. The traveller who slept in my corner. You came all this way.', 'soft'),
        N(
          'Your Nubbin climbs up onto his shoulder, the way it rode in his cap, and he laughs for the first time in two years.',
        ),
      ],
      [
        ask(
          1,
          'science',
          'why dry food keeps and moist food goes mouldy',
          '2-PS1-1',
          [
            N(
              'Geppetto lived on biscuits and cheese for two years. Hard dry biscuits keep for a very long time, while a soft loaf goes mouldy in days. Why?',
            ),
          ],
          [
            o(
              'Mould is a fungus that needs moisture to grow.',
              [
                N(
                  'Yes. Dry biscuits give mould little water, so it cannot spread. People have dried food for thousands of years, and ship’s biscuit was made to last for months.',
                ),
              ],
              true,
            ),
            o('Biscuits are too hard for mould to bite.', [
              N(
                'Mould does not bite. It grows on food from tiny spores, and it needs water to do it.',
              ),
            ]),
            o('Mould only likes the colour of bread.', [
              N('Mould does not care about colour. It cares about water, warmth and food.'),
            ]),
          ],
          'Learned that mould needs moisture, so dry foods like ship’s biscuit keep for a long time.',
        ),
      ],
    ),
    sc(
      'a13-19-mouth',
      [
        N(
          'Your Nubbin carries the candle in its green bottle, held up in both paws, and leads the way up the long throat.',
        ),
        N(
          'The Dog-fish is very old, and has asthma, and sleeps with its mouth open. Past its teeth you can see a piece of sky full of stars.',
        ),
        N(
          'You climb over the tongue, which is as wide as a road and as soft as a bad mattress. Three rows of teeth stand up against the stars.',
        ),
        P(
          'Babbo, climb onto my back, and put your arms round my neck. Hold on as tight as you can. Leave the rest to me.',
        ),
        N(
          'Just as you all reach the teeth, the Dog-fish sneezes, and throws you back down its throat in a great rush of wind.',
        ),
        N('Up again, and over the tongue again. Quietly, this time, with nobody breathing.'),
        N(
          'Then Pinocchio jumps into the sea, with Geppetto on his back. You jump after him, and your Nubbin holds the bottle up high.',
        ),
      ],
      [
        notice(
          2,
          'science',
          'different stars are seen in different seasons because the Earth moves around the Sun',
          '5-ESS1-2',
          [
            N(
              'The stars you see on a summer night are not quite the same ones you see in winter. As the Earth circles the Sun, the night side faces a different part of the sky.',
            ),
            N(
              'Sailors have used that pattern for thousands of years to tell the seasons, and to steer by the stars when the coast was out of sight.',
            ),
          ],
          'Learned that the stars visible at night change with the seasons as the Earth orbits the Sun.',
        ),
      ],
    ),
    sc(
      'a13-19-mouth-done',
      [
        N(
          'Pinocchio swims and swims. The shore is far away, and Geppetto is heavy, and the water is cold.',
        ),
        P('Babbo. I can’t. I’m sorry. I’m going under.', 'sad'),
        TU('Who’s going under?'),
        N(
          'It is the Tunny, who followed your example and swam out after you. He comes up underneath them both, like a boat.',
        ),
      ],
      [
        notice(
          2,
          'science',
          'tuna are fast, powerful swimmers that must keep moving to breathe',
          '4-LS1-1',
          [
            N(
              'Real tunny, or tuna, are among the fastest fish in the sea. Some can sprint at more than 60 kilometres an hour.',
            ),
            N(
              'A tuna breathes by swimming with its mouth open, so water flows over its gills. Most kinds have to keep moving all their lives. This one keeps swimming, with two passengers.',
            ),
          ],
          'Learned that tuna are fast swimmers that keep moving so water flows over their gills.',
        ),
      ],
    ),
    sc(
      'a13-19-complete',
      [
        N(
          'The Tunny carries Pinocchio and Geppetto all the way to the shore, and you swim alongside, holding on to his fin.',
        ),
        ...THANKS,
        ...CANDLE,
      ],
      [
        ask(
          1,
          'literacy',
          'grazie: thank you in Italian',
          'L.3.4',
          [
            N(
              'Pinocchio cannot find a word big enough, and in his own language it would have been grazie. What does it mean, and what is the best way to say thank you when words are too small?',
            ),
          ],
          [
            o(
              'Grazie means thank you; a kind action can say it when words fall short.',
              [
                N(
                  'Yes. Pinocchio gives a kiss on the nose instead. A hug, a gift, or a favour back can say what words cannot.',
                ),
              ],
              true,
            ),
            o('Grazie means goodbye.', [N('Goodbye is arrivederci or ciao. Grazie is thank you.')]),
            o('Grazie means please.', [N('Please is per favore. Grazie is thank you.')]),
          ],
          'Learned grazie (thank you) and talked about saying thanks when words are not enough.',
        ),
      ],
    ),
  ],
  [
    gl('digested', 'broken down in the stomach so the body can use it as food', 'a13-19-belly'),
    gl(
      'unfortunates',
      'people in sad trouble; here, those unlucky enough to be swallowed',
      'a13-19-belly',
    ),
  ],
);

// ================================================================== A13-20 The Wheel and the Chair
const A20: EduQuest = quest(
  'a13-20',
  'The Wheel and the Chair',
  {
    'a13-20-s1': {
      goal: 'Walk with Pinocchio and Geppetto, and find shelter.',
      hint: 'Geppetto is weak, so go slowly. Somebody is begging by the road.',
    },
    'a13-20-s2': {
      goal: 'Stand by Pinocchio while he speaks to the Talking-cricket.',
      hint: 'Let him say it himself. It has taken him the whole book.',
    },
    'a13-20-s3': {
      goal: 'Help Pinocchio earn a glass of milk at the water-wheel.',
      hint: 'A hundred buckets for one glass. Count with him.',
    },
    'a13-20-s4': {
      goal: 'Keep Pinocchio company through the winter.',
      hint: 'He works every day now. The pennies in the jar are for a new coat.',
    },
  },
  [
    sc(
      'a13-20-road',
      [
        N(
          'Geppetto can hardly stand. Pinocchio gives him his arm, you walk on his other side, and the three of you go up the road very slowly.',
        ),
        N('By the road sit two beggars: a Fox, thin and mangy, with no tail, and a Cat.'),
        N('The Cat is blind. Really blind, now.'),
        FX('Oh, Pinocchio! Have pity on two poor sick old creatures!', 'sad'),
        CT('Sick old creatures.', 'sad'),
        FX('We’re so poor I had to sell my tail to a pedlar. He wanted it for a fly-whisk.'),
        P('Goodbye, you cheats. You fooled me once. You won’t fool me twice.', 'angry'),
        P('Money you steal never lasts the week. And a tail you sell doesn’t grow back.'),
        N(
          'He walks on, holding his father up. Behind you, the Cat turns his face to the sound of your feet.',
        ),
      ],
      [
        ask(
          8,
          'sel',
          'kindness and fairness: should we help someone who wronged us',
          'CASEL: Social awareness',
          [
            N(
              'The Fox and the Cat cheated Pinocchio, and now they are hungry. Does being unkind to others take away your right to kindness? Think about what Pinocchio does, and what you might do.',
            ),
          ],
          [
            o('Everyone deserves basic kindness, even people who did wrong.', [
              N(
                'That’s a fair answer. Kindness to a hungry creature does not mean forgetting what they did. You can share a crust and still keep your coins safe.',
              ),
            ]),
            o('They should face the results of what they did.', [
              N(
                'That’s a fair answer. Choices have consequences, and Pinocchio is right not to trust them again. Still, helping is a separate question from trusting.',
              ),
            ]),
            o('It depends whether they are sorry.', [
              N(
                'That’s a fair answer. Sorrow changes things, though the Fox’s whining is not quite the same. Where do you draw the line?',
              ),
            ]),
          ],
          'Reflected on whether to help someone who has treated you badly, and the difference between kindness and trust.',
        ),
      ],
      [
        {
          id: 'crust',
          label: 'Give the Cat a crust from your pocket.',
          set: { 'a13-crust': 'given' },
          then: [
            N('You go back and put a crust into the Cat’s paw. You don’t say anything.'),
            N(
              'He can’t see who it was. He turns his face up the road, to where Pinocchio is walking, and calls after him.',
            ),
            CT('Thank you, Pinocchio. You were always the kind one.', 'soft'),
            N(
              'Pinocchio stops, and his ears go red. He doesn’t say anything either, and neither do you, and that is how the Cat keeps it.',
            ),
          ],
        },
        {
          id: 'walk',
          label: 'Walk on with Pinocchio.',
          set: { 'a13-crust': 'kept' },
          then: [
            N(
              'You walk on. Behind you, the Fox is explaining to the Cat that it was only the wind.',
            ),
          ],
        },
      ],
    ),
    sc(
      'a13-20-road-done',
      [
        N(
          'At the end of a lane there is a little hut of straw with a tiled roof. A sign on the door says PULL THE CORD, so Pinocchio pulls it.',
        ),
        N('Inside, on a beam, sits the Talking-cricket.'),
      ],
      [
        ask(
          0,
          'literacy',
          'imperative verbs: words that give a command',
          'L.3.4',
          [
            N(
              'The sign says PULL THE CORD. Which word tells you what to do, and what kind of word is it?',
            ),
          ],
          [
            o(
              '“Pull”: a command word, called an imperative verb.',
              [
                N(
                  'Yes. Commands like pull, push, stop and wait are imperative verbs. Signs use them because they have to be quick to read.',
                ),
              ],
              true,
            ),
            o('“Cord”: a describing word.', [
              N('Cord is a noun, the thing you pull. The command word is “pull”.'),
            ]),
            o('“The”: the word that gives the order.', [
              N('“The” just points to which cord. The order is in the verb: pull.'),
            ]),
          ],
          'Identified an imperative verb on a sign.',
        ),
      ],
    ),
    sc(
      'a13-20-hut',
      [...HUT],
      [
        ask(
          5,
          'literacy',
          'how a character changes across a story',
          'RL.3.3',
          [
            N(
              'At the start Pinocchio threw a mallet at the cricket. Now he asks for pardon and begs the cricket to spare his father. How has he changed?',
            ),
          ],
          [
            o(
              'He has learned to care about others, and to own his mistakes.',
              [
                N(
                  'Yes. A well-written character changes because of what happens to them. Pinocchio has been hurt, and he has helped, and it shows.',
                ),
              ],
              true,
            ),
            o('He is exactly the same.', [
              N(
                'Compare the mallet scene with this one. The same puppet now asks for forgiveness. That is a real change.',
              ),
            ]),
            o('He is just afraid of the cricket.', [
              N(
                'Fear is possible, but he asks for pardon for his father, not for himself. He has learned something deeper.',
              ),
            ]),
          ],
          'Compared a character at the start and end of a story to describe how he has changed.',
        ),
      ],
    ),
    sc(
      'a13-20-hut-done',
      [
        N('Pinocchio lays his father on the straw. Geppetto is so weak that he can only smile.'),
        P('Milk. He needs milk. I’ll get him milk.'),
      ],
      [
        notice(
          1,
          'health',
          'milk gives calcium, protein and fluid, which help bones and muscles recover',
          '4-LS1-1',
          [
            N(
              'Milk is a good drink for a weak, hungry person. It holds protein for muscles, calcium for strong bones and a lot of water, all in one glass.',
            ),
            N(
              'After two years of dry biscuit and cheese, Geppetto’s body needs gentle food and plenty of fluid. A glass of milk is a good start.',
            ),
          ],
          'Learned that milk offers protein, calcium and fluid that help the body recover.',
        ),
      ],
    ),
    sc(
      'a13-20-wheel',
      [
        N(
          'The gardener up the lane is called Giangio. He has milk, at a penny a glass, and Pinocchio hasn’t got a penny.',
        ),
        GI('Then turn my water-wheel. Draw up a hundred buckets, and you’ll have your glass.'),
        N(
          'Pinocchio turns the wheel, and you count. Your Nubbin counts on its paws, and loses its place at four, every time.',
        ),
        N(
          'He has never worked so hard in his life. At a hundred buckets he is wet through to the grain.',
        ),
        GI('Till now my donkey turned that wheel. He’s dying, poor beast.'),
        N(
          'Pinocchio goes into the stable. On the straw lies a donkey, worn out with hunger and work, as thin as a ladder.',
        ),
        N('Pinocchio kneels down and looks at him. The donkey opens his eyes, and knows him.'),
        CW2('Pinocchio. It’s me. Candlewick.', 'soft'),
        P('Candlewick! Oh, Candlewick.', 'sad'),
        N(
          'Candlewick lays his head in Pinocchio’s lap and closes his eyes. After a little while he stops breathing, very quietly, like a candle at the end of an evening.',
        ),
        N('Candlewick has died. His body has stopped working, and it will not start again.'),
      ],
      [
        ask(
          3,
          'maths',
          'time problems: how long for a hundred buckets',
          '4.MD.A.2',
          [
            N(
              'Each bucket takes Pinocchio 12 seconds to draw up. How many minutes does it take to draw up all 100? (Hint: 60 seconds make a minute.)',
            ),
          ],
          [
            o(
              '20 minutes.',
              [
                N(
                  'Yes. 100 × 12 = 1,200 seconds, and 1,200 ÷ 60 = 20 minutes. A glass of milk was hard-earned.',
                ),
              ],
              true,
            ),
            o('12 minutes.', [
              N(
                'That is 12 seconds written as minutes. Multiply by 100 first: 1,200 seconds. Then divide by 60.',
              ),
            ]),
            o('100 minutes.', [
              N(
                'That takes each bucket as a minute. They are 12 seconds each, so 20 minutes in all.',
              ),
            ]),
          ],
          'Multiplied 100 by 12 seconds and converted 1,200 seconds to 20 minutes.',
        ),
        notice(
          4,
          'science',
          'a water-wheel is a wheel and axle: a simple machine that turns a pull into rotation',
          '4-PS3-4',
          [
            N(
              'Giangio’s water-wheel works like a windlass: a wheel and axle. A long turn of the big wheel winds a rope onto the small axle, so a small push lifts a heavy bucket.',
            ),
            N(
              'The machine does not make the work disappear. You turn a long way for a short lift. It just makes the work possible for a person who is not strong.',
            ),
          ],
          'Learned that a wheel and axle is a simple machine that makes lifting easier by spreading the work over a longer turn.',
        ),
      ],
    ),
    sc(
      'a13-20-wheel-done',
      [
        GI('Why cry over a donkey? He cost you nothing.'),
        P('He was my friend. We sat at the same desk at school.', 'sad'),
        N(
          'Your Nubbin sits down by the donkey’s head and doesn’t move, so you don’t either, for a while.',
        ),
      ],
      [
        ask(
          2,
          'sel',
          'grief: what it is and what helps',
          'CASEL: Self-awareness',
          [
            N(
              'Pinocchio is grieving for his friend. Grief is the feeling after someone dies. What helps a person who is grieving?',
            ),
          ],
          [
            o(
              'Letting the feeling be, talking, sitting together, remembering.',
              [
                N(
                  'Yes. Grief comes in waves. It is not a problem to fix. Company, tears and good memories help, and so does time.',
                ),
              ],
              true,
            ),
            o('Pretending to be fine so no one worries.', [
              N('Hiding it can make it heavier. People who care about you usually want to know.'),
            ]),
            o('Forgetting as quickly as possible.', [
              N(
                'Remembering is how we keep a friend near. The sadness does ease, but memories are worth keeping.',
              ),
            ]),
          ],
          'Learned what grief is and what helps when someone is grieving.',
        ),
      ],
    ),
    sc(
      'a13-20-coat',
      [
        N(
          'The atlas turns its pages slowly now. Pinocchio turns the wheel every morning, and weaves rush baskets every evening, and sells them.',
        ),
        N(
          'He reads by the fire, from a book with no cover. He looks after Geppetto as if Geppetto were the puppet.',
        ),
        N(
          'He saves forty pennies in a jar. Forty pennies is a new coat, and his paper jacket has lost most of its flowers.',
        ),
        N(
          'One morning, on his way to market to buy the coat, he sees a Snail coming across the road towards him. It takes some time.',
        ),
        SN('Pinocchio. Do you remember me? I kept the Fairy’s door.'),
        SN('She is ill, and in hospital. She has nothing left, not even enough for bread.', 'sad'),
        P('The Fairy? Ill? Wait.'),
        N('He tips out the jar. Every penny of the coat money goes into the Snail’s keeping.'),
        P(
          'Take her this. All of it. I’ll make more baskets. I don’t need a coat. It was too warm anyway.',
          'soft',
        ),
        N('Too warm. You know where he got that.'),
        SN('I’ll go as fast as I can.', 'happy'),
        N('And the Snail, for the first time in her long, slow life, hurries.'),
      ],
      [
        ask(
          2,
          'maths',
          'division: how long to save forty pennies',
          '3.OA.A.3',
          [N('Pinocchio saves 2 pennies a day. How many days does it take to save 40 pennies?')],
          [
            o(
              '20 days.',
              [
                N(
                  'Yes. 40 ÷ 2 = 20. That is almost three weeks of weaving baskets, and he gives the lot away in a minute.',
                ),
              ],
              true,
            ),
            o('42 days.', [N('That adds. To find how many 2s are in 40, divide: 40 ÷ 2 = 20.')]),
            o('80 days.', [N('That multiplies. Division asks how many 2-penny days make 40: 20.')]),
          ],
          'Divided 40 pennies by 2 pennies a day to find 20 days.',
        ),
      ],
    ),
    sc(
      'a13-20-coat-done',
      [
        N(
          'That night Pinocchio dreams of the Fairy, smiling and well again. She tells him his good heart has made up for everything.',
        ),
        N('In the morning, he wakes up.'),
      ],
      [
        ask(
          1,
          'literacy',
          'theme: kindness passed on',
          'RL.4.2',
          [
            N(
              'Geppetto gave up his coat for Pinocchio. Pinocchio gives up his coat money for the Fairy. What larger idea does this echo show?',
            ),
          ],
          [
            o(
              'Love gets passed on: what you receive, you learn to give.',
              [
                N(
                  'Yes. That is the theme the whole book builds to. A kindness shown to us tends to be shown to others in turn.',
                ),
              ],
              true,
            ),
            o('Coats are very valuable.', [
              N('The coat is a symbol. It stands for what someone gives up out of love.'),
            ]),
            o('Pinocchio has no use for money.', [
              N('He chooses to give it away, which is different from not needing it.'),
            ]),
          ],
          'Identified a theme: kindness is passed on from one person to the next.',
        ),
      ],
    ),
    sc(
      'a13-20-complete',
      [
        ...WAKE,
        N(
          'Your Nubbin goes over to the old puppet, climbs into its lap and curls up, nose to tail, as if it had waited all day for that lap.',
        ),
        N('Geppetto lets it stay.'),
        G('Leave it. He’d like the company. He always did.', 'soft'),
        ...HOME,
      ],
      [
        ask(
          6,
          'literacy',
          'theme: what makes someone “real”',
          'RL.4.2',
          [
            N(
              'Pinocchio becomes a real boy after he changes how he lives, not by magic alone. What does the story seem to say about becoming “real”?',
            ),
          ],
          [
            o(
              'It comes from honesty, work and kindness, repeated over time.',
              [
                N(
                  'Yes. The Fairy said it had to be earned. The story shows how: day by day, by the choices he makes.',
                ),
              ],
              true,
            ),
            o('It is a prize given for being obedient.', [
              N(
                'Obedience is not quite it. He earns it by caring and acting well, even when no one tells him to.',
              ),
            ]),
            o('It happens by pure luck.', [
              N('The story points to something else: he changes how he acts, and then he changes.'),
            ]),
          ],
          'Identified the book’s theme: becoming “real” through honesty, work and kindness.',
        ),
      ],
    ),
  ],
  [
    gl(
      'windlass',
      'a wheel or drum turned by hand to wind up a rope and lift a bucket',
      'a13-20-wheel',
    ),
    gl('grief', 'the deep sadness we feel when someone we love has died', 'a13-20-wheel-done'),
  ],
);

// ================================================================== variants
/** Reader versions of every scene in A13_VARIANTS. */
export const EDU_A13_READER_VARIANTS: EduScene[] = [
  // ------------------------------------------------ A13-1 step 1 scene, with Clank
  sc(
    'a13-01-page-clank',
    [
      ...PAGE,
      N(
        'The ink goes wet under your fingers, and then it is rain. You, your Nubbin and Clank are standing in a steep stone lane, getting wetter.',
      ),
      CK('Announcement: it’s steps. It’s ALL steps. This whole country is made of steps!', 'shock'),
      N(
        'Clank unfolds the ramp Byte made him for the trip: three hinged boards, sanded smooth, with BYTE pencilled on the underneath.',
      ),
      CK(
        'Unfold, roll, fold up. Byte made me practise forty times. Forty-one. The last one was for luck. Byte doesn’t believe in luck.',
      ),
      N(
        'One door is open, with sawdust on the step and a warm smell of pine. You go in, and Clank comes in after you, down his ramp.',
      ),
      MC(
        'Come in, come in, shut the weather out. Mind the shavings. And bring your… kettle. Is that a kettle?',
      ),
      CK('Announcement: I am Clank! I am a guest! Is this a house? I love it!', 'happy'),
      ...LOG,
    ],
    [
      ask(
        4,
        'science',
        'a ramp is a simple machine (an inclined plane) that trades distance for force',
        '3-5-ETS1-2',
        [
          N(
            'Steps are a problem for Clank’s wheel. Byte’s ramp solves it. Why is it easier to roll up a long gentle slope than to lift over one tall step?',
          ),
        ],
        [
          o(
            'A long slope spreads the lift over a longer distance, so it takes less push at once.',
            [
              N(
                'Yes. A ramp is an inclined plane. You travel farther but push less hard. That is the trade every simple machine makes.',
              ),
            ],
            true,
          ),
          o('A ramp makes Clank lighter.', [
            N(
              'Clank weighs the same on a ramp. It is the push needed at any moment that gets smaller.',
            ),
          ]),
          o('Ramps are only for show.', [
            N(
              'Ramps are used everywhere: wheelchair ramps, loading ramps, even the road up a hill. They really work.',
            ),
          ]),
        ],
        'Learned that a ramp is a simple machine that makes lifting easier by spreading the effort over a longer distance.',
      ),
    ],
  ),
  // ------------------------------------------------ A13-5 step 3 done, with Clank
  sc(
    'a13-05-coat-clank',
    [
      ...COAT,
      CK('He sold his coat. For a thing that kicked him on the nose.', 'think'),
      CK('Is that a job? Is that what a job is?'),
      Y('No. It isn’t a job.'),
      N(
        'Clank’s chimney-light flickers, as if he has put something down somewhere safe, to look at later.',
      ),
    ],
    [
      ask(
        8,
        'sel',
        'what love is, if it is not a job',
        'CASEL: Social awareness',
        [
          N(
            'Clank asks whether it was a job. You said no. If it was not a job, what do you think Geppetto’s act was?',
          ),
        ],
        [
          o('Love: giving without being paid or asked.', [
            N(
              'That’s a fair answer. A job is something you do for pay, or because you are told. Love is something you do because the other person matters.',
            ),
          ]),
          o('Duty: a father looks after his son.', [
            N(
              'That’s a fair answer. Duty is part of it. But few duties ask a person to sell his only coat in the snow.',
            ),
          ]),
          o('Foolishness: a coat is worth more than a book.', [
            N(
              'That’s a fair answer. By the price of things it was a bad trade. By love, it was a very good one.',
            ),
          ]),
        ],
        'Thought about what love is when it is not a job, and why a loving act can look foolish by price.',
      ),
    ],
  ),
  // ------------------------------------------------ A13-10 step 2 done, you carried the cricket
  sc(
    'a13-10-doctors-done-carried',
    [
      ...LEAVE,
      N(
        'At the door he stops, turns round, and nods to you. One small, exact nod, the kind a hundred-year-old cricket doesn’t give to just anybody.',
      ),
      N('Then he goes down the stairs, and doesn’t look back. He doesn’t need to.'),
    ],
    [
      notice(
        2,
        'literacy',
        'showing a feeling through an action instead of saying it',
        'RL.3.3',
        [
          N(
            'The cricket does not say thank you. He nods. Writers call this “showing, not telling”: the nod says it for him.',
          ),
          N(
            'Readers who watch for small actions, like a nod, a glance or a sigh, catch what a character feels without being told.',
          ),
        ],
        'Learned that writers show feelings through small actions instead of saying them outright.',
      ),
    ],
  ),
  // ------------------------------------------------ A13-18 step 3 done, you carried the cricket
  sc(
    'a13-18-sea-carried',
    [
      ...SEA,
      N('He passes under the rock where you are standing, treads water, and looks up at you.'),
      P(
        'Your cricket. The one you carried out to the hedge. He was right. He said I’d grow up a donkey, and I did, all of me.',
        'sad',
      ),
      P('Don’t tell him I said so.'),
    ],
    [
      ask(
        5,
        'sel',
        'admitting “I was wrong”',
        'CASEL: Self-awareness',
        [
          N(
            'Pinocchio finally says the cricket was right, but asks you not to tell him. Why is it so hard to say “I was wrong”, even to ourselves?',
          ),
        ],
        [
          o('We worry it makes us look weak or silly.', [
            N(
              'That’s a fair answer. Pride gets in the way. People who can say it tend to learn faster, and are trusted more.',
            ),
          ]),
          o('We feel ashamed when we remember what we did.', [
            N('That’s a fair answer. Shame is heavy, and a kind friend helps us carry it.'),
          ]),
          o('It is not hard if the other person is kind about it.', [
            N('That’s a fair answer. A kind listener makes honesty much easier.'),
          ]),
        ],
        'Thought about why it is hard to admit being wrong and what helps.',
      ),
    ],
  ),
  // ------------------------------------------------ A13-19 complete, with Clank
  sc(
    'a13-19-complete-clank',
    [
      N(
        'The Tunny carries Pinocchio and Geppetto to the shore. Clank, who would sink like a kettle, rides on his back like a figurehead.',
      ),
      ...THANKS,
      N(
        'Clank is looking at Pinocchio, his chimney-light very steady. Something inside him clicks, and clicks again.',
      ),
      CK('He doesn’t have it either.', 'soft'),
      CK('The word. He looked, and he doesn’t have it either. Nobody put it in him.'),
      ...CANDLE,
    ],
    [
      ask(
        1,
        'science',
        'why a steel kettle sinks but a steel ship floats',
        '3-PS2-1',
        [N('A metal kettle sinks, but a huge steel ship floats. What is the difference?')],
        [
          o(
            'A ship’s shape pushes aside a lot of water, so the water pushes back up hard enough.',
            [
              N(
                'Yes. A floating thing must displace its own weight in water. A hollow, wide ship does; a small solid kettle does not. That is why Clank rides on the Tunny.',
              ),
            ],
            true,
          ),
          o('Ships are made of lighter metal.', [
            N('Both are steel. It is the shape that matters, not the metal.'),
          ]),
          o('Ships have magic engines.', [
            N(
              'No magic: engines drive them, but they float by shape alone, even with the engine off.',
            ),
          ]),
        ],
        'Learned that a ship floats because its shape displaces enough water, unlike a small solid kettle.',
      ),
    ],
  ),
  // ------------------------------------------------ A13-20 step 2 scene, you carried the cricket
  sc(
    'a13-20-hut-carried',
    [
      ...HUT,
      CR('And thank your friend for the hedge.', 'soft'),
      N(
        'He says no more about it. He settles himself on his beam, and looks at you over Pinocchio’s head, and that is plenty.',
      ),
    ],
    [
      ask(
        8,
        'sel',
        'passing on thanks and noticing small kindnesses',
        'CASEL: Relationship skills',
        [
          N(
            'The cricket remembers a small kindness, the hedge, and passes his thanks on. Why do small kindnesses matter?',
          ),
        ],
        [
          o('They show people they are seen and valued.', [
            N(
              'That’s a fair answer. A small kindness can be remembered for years, as the hedge is.',
            ),
          ]),
          o('They build trust over time.', [
            N('That’s a fair answer. Small kindnesses are like deposits in a bank of trust.'),
          ]),
          o('They do not matter much.', [
            N(
              'That’s a fair answer, and you may be right in some cases. But the cricket, a hundred years old, has not forgotten a leaf by a door.',
            ),
          ]),
        ],
        'Reflected on why small kindnesses matter and are remembered.',
      ),
    ],
  ),
  // ------------------------------------------------ A13-20 complete, with Clank
  sc(
    'a13-20-complete-clank',
    [
      ...WAKE,
      N(
        'Clank rolls down his ramp, crosses the room, and parks beside the old puppet. He doesn’t announce it.',
      ),
    ],
    [
      ask(
        7,
        'sel',
        'quiet company: caring without words',
        'CASEL: Social awareness',
        [
          N(
            'Clank parks beside the old puppet and says nothing at all. Why might sitting close to someone be more caring than saying something?',
          ),
        ],
        [
          o('Words can be wrong, but being there is always right.', [
            N(
              'That’s a fair answer. Presence tells someone they are not alone, which is often what they need.',
            ),
          ]),
          o('It depends on the person; some like words.', [
            N('That’s a fair answer. Good friends learn what each person needs.'),
          ]),
          o('Words are better. Silence can be cold.', [
            N(
              'That’s a fair answer. Silence can feel cold if you are not sure the other person is kind. With a friend, it is warm.',
            ),
          ]),
        ],
        'Thought about how quiet company can be a way to care for someone.',
      ),
    ],
  ),
  // ------------------------------------------------ Clank’s word
  sc(
    'a13-20-word',
    [...WORD_A, ...WORD_B, ...HOME],
    [
      ask(
        8,
        'sel',
        'what love is: something that is done to us first, and then is there',
        'CASEL: Self-awareness',
        [
          N(
            'Clank says nobody puts love in us: somebody does it to us first, and then it is there. Do you think that is true? How do people learn what love is?',
          ),
        ],
        [
          o('Yes. We learn love by being loved.', [
            N(
              'That’s a fair answer. Many people think love is learned that way, from the people who look after us when we are small and cannot repay it.',
            ),
          ]),
          o('Partly. We learn it, and we also choose it.', [
            N(
              'That’s a fair answer. Being loved shows us how, and then each of us decides whether to pass it on.',
            ),
          ]),
          o('No. Some people are simply born kind.', [
            N(
              'That’s a fair answer. Kindness may come easier to some, though even they need others to show them how it can be used.',
            ),
          ]),
        ],
        'Reflected on how people learn what love is and whether it is something given before it is understood.',
      ),
    ],
  ),
  // ------------------------------------------------ Clank’s word, after S25
  sc(
    'a13-20-word-next-door',
    [
      ...WORD_A,
      CK('Moss said Real lives next door to it. I went next door. This is the house.', 'happy'),
      ...WORD_B,
      ...HOME,
    ],
    [
      ask(
        8,
        'literacy',
        'metaphor: “Real lives next door”',
        'L.4.5',
        [
          N(
            'Clank says Real “lives next door” to the word. Of course, Real is not a person with a house. What does he mean?',
          ),
        ],
        [
          o(
            'Real and love are close together: you find one near the other.',
            [
              N(
                'Yes. It is a metaphor. A word, a feeling and a state of being are being pictured as neighbours in a street.',
              ),
            ],
            true,
          ),
          o('Real lives in a house on the same road as Clank.', [
            N('Clank speaks in a picture. Real is an idea, and “next door” means close to love.'),
          ]),
          o('He is joking, and it means nothing.', [
            N('He is warm, not joking. The picture makes a hard idea easier to hold.'),
          ]),
        ],
        'Interpreted a metaphor: Real and love as neighbours.',
      ),
    ],
  ),
  // ------------------------------------------------ Grove: one dusk
  sc(
    'a13-grove-clank-dusk',
    [
      N(
        'Dusk in the Grove. The Nubbins come in from the long grass one by one and climb onto Clank, because he is warm.',
      ),
      N(
        'One on his wheel, one on his hood like a hat. He turns his chimney-light down low for them.',
      ),
      CK('Announcement.', 'soft'),
      CK('Love.', 'soft'),
      CK('I’m only saying it once, so it doesn’t wear out.'),
      N('He doesn’t say it again. He doesn’t need to; it’s there.'),
    ],
    [
      notice(
        1,
        'science',
        'sunsets look red and orange because blue light is scattered away',
        '5-ESS1-2',
        [
          N(
            'At dusk the Sun is low, and its light must travel through far more air before it reaches you. The air scatters away the blue light, and the reds and oranges get through.',
          ),
          N(
            'That is why the sky glows warm at the end of the day, and why the Grove looks so gentle when Clank turns his light down.',
          ),
        ],
        'Learned that a sunset is red and orange because the air scatters the blue light.',
      ),
    ],
  ),
  // ------------------------------------------------ Grove: Pixel
  sc(
    'a13-grove-pixel',
    [
      N(
        'Pixel is at the lantern shed with Clank’s wick-winder nose in pieces on a cloth, giving it its spring clean.',
      ),
      CK('Pixel. You didn’t put it in.'),
      PX('Put what in?', 'think'),
      CK('The word. The one I didn’t have.'),
      N('Pixel stops polishing. She knows which word; she has always known which word.'),
      PX('I know. I’m sorry.', 'sad'),
      CK('Don’t be. Geppetto didn’t either.', 'happy'),
      N(
        'Pixel laughs, the way people do when they are let off something they didn’t know they were carrying, and puts Clank’s nose back on.',
      ),
    ],
    [
      ask(
        6,
        'sel',
        'forgiveness: how it feels to be let off',
        'CASEL: Relationship skills',
        [
          N(
            'Pixel says sorry, and Clank answers “Don’t be.” How do you think Pixel feels afterwards, and why?',
          ),
        ],
        [
          o(
            'Lighter: she has been forgiven for something she carried.',
            [
              N(
                'Yes. The story says it exactly: let off something she did not know she was carrying. Forgiveness can lift a weight from both people.',
              ),
            ],
            true,
          ),
          o('Still guilty, because sorry was not enough.', [
            N(
              'She might feel a little guilt. But Clank’s kindness, and the laugh that follows, suggest the weight has gone.',
            ),
          ]),
          o('Embarrassed that she was forgiven so easily.', [
            N('That can happen. In this scene, her laugh shows relief more than embarrassment.'),
          ]),
        ],
        'Reflected on the relief of being forgiven after saying sorry.',
      ),
    ],
  ),
  // ------------------------------------------------ Grove: Clank’s idle lines
  sc(
    'a13-grove-clank-idle',
    [
      CK('Announcement: I am just here.', 'soft'),
      CK('Announcement: still just here.'),
      CK('Not helping. Just here. Both are allowed.', 'happy'),
    ],
    [
      notice(
        2,
        'sel',
        'we are valued for who we are, not only for what we do',
        'CASEL: Relationship skills',
        [
          N(
            'Clank used to announce every time he was useful. Now he is happy to say “just here”. Friends like us because of who we are, not only what we can do for them.',
          ),
          N('Doing nothing together is one of the oldest and kindest ways to be with someone.'),
        ],
        'Heard that friends value us for who we are, and that doing nothing together is a kind way to be friends.',
      ),
    ],
  ),
];

// ================================================================== exports
export const EDU_A13_READER: EduQuest[] = [
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
  A18,
  A19,
  A20,
];

/** Every `edu:` check string used by the lessons above. */
export const CHECKS: string[] = ['edu:read:bar-graph:caps', 'edu:sort:drawer-things:float-or-sink'];
