/**
 * The Learning Grove, reader band (ages 7–10): Atlas page A8, The Twelve Tasks (A8-1 to A8-14).
 * One EduScene per original scene (every step scene, done scene and complete scene), id
 * `reader:<original id>`, plus the three Banquet variants in EDU_A08_READER_VARIANTS.
 * See EDU-STYLE.md and docs/atlas.md (A8, "Learning Grove version").
 *
 * What it teaches, as the outline lists: Roman Gaul on a map and in time (Caesar’s Gallic Wars,
 * about 58 to 50 BC); everyday Latin and the English words that grew from it; Roman numerals I to
 * XII, one per task, with the add-and-subtract rule (IV, IX); the Olympic Games’ Greek origins;
 * and what a bureaucracy is (a place with many rules and forms; rules help when they serve people).
 * Around those: measuring and units, simple sums with money, patterns, fractions, floating and
 * forces, light and the eye, caves, sound, mountains and temperature, similes, advertising, fairness.
 *
 * - Every choice keeps its original id and `set` (a08-form still works). The reader band keeps
 *   every choice; none is cruel, so none needs framing beyond the think questions.
 * - Think questions (`ask` with no `best`, every reply honouring the child’s reasoning) in every
 *   quest: who should referee, rules that help or hinder, whether comfort is always good, and so on.
 * - Care notes kept: the champions are proud, kind and good losers; nothing about anyone’s looks,
 *   faith or history; Roman Gaul is told honestly (Rome conquered, and the page is a comedy); the
 *   Isle is cakes and cushions; the Beast is only scared; Obelix fells no living tree; no song is sung.
 * - Accuracy notes: the real Circus Maximus was mainly a chariot-racing ground that sometimes held
 *   wild-animal shows; the Colosseum, later famous for them, was built after Caesar’s time. The
 *   reader scene says so.
 * - No lines are taken from the film or the books. Everything is original.
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
const A = say('a08-asterix');
const O = say('a08-obelix');
const G = say('a08-getafix');
const V = say('a08-chief');
const BD = say('a08-bard');
const CS = say('a08-caesar');
const P = say('a08-pupus');
const AS = say('a08-asbestos');
const VE = say('a08-verses');
const CI = say('a08-cilindric');
const H = say('a08-hostess');
const IR = say('a08-iris');
const MK = say('a08-chef');
const PO = say('a08-porter');
const CL = say('a08-clerk');
const PF = say('a08-prefect');
const OM = say('a08-oldman');
const GH = say('a08-ghost');

// ---------------------------------------------------------------- builders
type Beat = Omit<Lesson, 'id'>;
type Opt = NonNullable<Lesson['options']>[number];

/** One answer option. `best` marks the answer the lesson teaches; think questions have none. */
const opt = (label: string, reply: Line[], best = false): Opt =>
  best ? { label, best, reply } : { label, reply };

const std = (standard?: string) => (standard ? { standard } : {});

/** A notice: a character shares something true. */
const nt = (
  domain: EduDomain,
  skill: string,
  after: number,
  lines: Line[],
  parentNote: string,
  standard?: string,
): Beat => ({ domain, skill, ...std(standard), kind: 'notice', after, lines, parentNote });

/** An ask: a question with options. With no `best` option it is a think question. */
const ak = (
  domain: EduDomain,
  skill: string,
  after: number,
  prompt: Line[],
  options: Opt[],
  parentNote: string,
  standard?: string,
): Beat => ({ domain, skill, ...std(standard), kind: 'ask', after, prompt, options, parentNote });

/** A do: the child does something in the Grove. */
const dd = (
  domain: EduDomain,
  skill: string,
  after: number,
  check: string,
  lines: Line[],
  parentNote: string,
  standard?: string,
): Beat => ({ domain, skill, ...std(standard), kind: 'do', after, check, lines, parentNote });

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

const quest = (
  of: string,
  title: string,
  goals: EduQuest['goals'],
  scenes: EduScene[],
  glossary: GlossaryEntry[] = [],
): EduQuest => ({ id: `reader:${of}`, of, band: 'reader', title, goals, scenes, glossary });

const gloss = (word: string, meaning: string, of: string): GlossaryEntry => ({
  word,
  meaning,
  scene: `reader:${of}`,
});

// ================================================================== A8-1 Caesar’s Challenge
const Q1 = quest(
  'a08-01',
  'Caesar’s Challenge',
  {
    'a08-01-s1': {
      goal: 'Step into the small green dot on the map of Gaul.',
      hint: 'Everything else is Roman red. Look by the sea, top left.',
    },
    'a08-01-s2': {
      goal: 'Go to the village and hear what the Romans want.',
      hint: 'Follow Obelix and the boars. Everyone is in the village square.',
    },
  },
  [
    sc(
      'a08-01-map',
      [
        N(
          'Nova’s atlas falls open at a map of Gaul, around 50 BC. It is painted Roman red from the mountains to the sea.',
        ),
        N(
          'Not quite all of it. Up by the sea, one small green dot sits untouched, with the red curving carefully round it.',
        ),
        N('Four tiny Roman camps ring the dot like cats round a hedgehog, unsure where to start.'),
        N(
          'You touch the green dot, and it is warm and smells faintly of roast boar. Then you are standing in a beech wood.',
        ),
        N(
          'Something small and white shoots out of the bracken, stops nose to nose with your Nubbin, and wags so hard it nearly falls over.',
        ),
        N(
          'It is a very small dog with a black-tipped ear. He and your Nubbin look at each other, very serious, for a long moment.',
        ),
      ],
      [
        nt(
          'social-studies',
          'where Gaul was, and when Caesar’s wars happened',
          2,
          [
            N(
              'Gaul was the Roman name for a big region, roughly where France is today, plus parts of Belgium and nearby lands.',
            ),
            N(
              'Julius Caesar’s army fought the peoples of Gaul in the Gallic Wars, from about 58 to 50 BC. “BC” counts years backwards to the year 1.',
            ),
            N(
              'So on this map, nearly all of Gaul is Roman red. The map’s green dot is the story’s joke.',
            ),
          ],
          'Learned that Gaul was roughly modern France, that Caesar’s Gallic Wars ran about 58 to 50 BC, and read a map key by colour.',
          'D2.Geo.2.K-2',
        ),
      ],
      [
        {
          id: 'sniff',
          label: 'Let them work it out.',
          then: [
            N(
              'They work it out in two seconds: some circling, one sneeze, and then they are best friends.',
              'happy',
            ),
          ],
        },
        {
          id: 'crouch',
          label: 'Crouch down and hold out a hand.',
          then: [
            N(
              'The dog licks your hand once, politely, then goes straight back to your Nubbin. You know your place.',
              'happy',
            ),
          ],
        },
      ],
    ),
    sc(
      'a08-01-map-done',
      [
        N(
          'Two men come crashing through the trees after the dog: one small, with a winged helmet, and one enormous, with a boar under each arm.',
        ),
        O('Dogmatix! Oh. He has found a friend. Look, Asterix, a little round friend.', 'happy'),
        N(
          'For someone big enough to carry two boars at once, Obelix crouches very slowly, so as not to frighten your Nubbin.',
        ),
      ],
      [
        ak(
          'sel',
          'being gentle with someone smaller',
          2,
          [
            N(
              'Obelix is huge and strong, but he crouches slowly beside your Nubbin. Why might a big person move gently near someone small?',
            ),
          ],
          [
            opt(
              'So the small one feels safe',
              [
                N(
                  'Yes. Being big means taking care. Moving slowly tells a small creature, “I will not hurt you.”',
                ),
              ],
              true,
            ),
            opt('Because he is afraid of it', [
              N(
                'He is careful, not afraid. He does it so he will not frighten the Nubbin, which is kind.',
              ),
            ]),
            opt('It makes no difference', [
              N('It does to the Nubbin. A sudden, big movement can be scary, even from a friend.'),
            ]),
          ],
          'Thought about how a bigger, stronger person can help a smaller one feel safe.',
          'CASEL: Social awareness',
        ),
      ],
    ),
    sc(
      'a08-01-square',
      [
        N(
          'The village is round, fenced and loud. A chief stands on a shield held up by two men who are clearly tired of holding it.',
        ),
        P(
          'Salve! That is Latin for hello, and I am Caius Pupus. I bring the words of Julius Caesar.',
        ),
        P(
          'Caesar hears that you Gauls are gods. He does not believe it. He proposes twelve tasks, like the labours of Hercules.',
        ),
        P(
          'Pass them all, and you are gods. Fail one, and you will kindly become Roman, like everybody else.',
        ),
        V('Twelve tasks! Ha! We will do thirteen, fourteen if there is lunch.', 'happy'),
        A('Who decides if we pass? Not a Roman. You would fail us for breathing.'),
        P('And not a Gaul. You would pass yourselves for sneezing.', 'think'),
        N(
          'Every head slowly turns to the one person who is neither: you, at the back, with a Nubbin and a dog.',
        ),
      ],
      [
        nt(
          'literacy',
          'Latin: salve, and where English gets its words',
          1,
          [
            P(
              'The Romans spoke Latin. “Salve” means hello, and there is “vale” for goodbye. You will hear both on this journey.',
            ),
            P('English is full of Latin words. “Vocabulary” and “audience” both come from Latin.'),
          ],
          'Learned the Latin greeting “salve” and that English borrows many words from Latin.',
          'L.3.4',
        ),
        ak(
          'social-studies',
          'fairness: who should referee, and why',
          7,
          [
            N(
              'The village wants a referee who is neither Roman nor Gaul. Why does that matter? Is a stranger always fair?',
            ),
          ],
          [
            opt('A referee must not favour either side', [
              N(
                'That is a good reason. Being on neither side makes it easier to be fair. Whether it is enough is a good thing to keep thinking about.',
              ),
            ]),
            opt('A stranger might still have a bias', [
              N(
                'A fair answer. Even a stranger can have hidden favourites. The best referees notice their own bias, and say so.',
              ),
            ]),
            opt('Rules matter more than the referee', [
              N(
                'A fair answer. Clear rules help any referee. But somebody still has to apply them fairly, and that is your job.',
              ),
            ]),
          ],
          'Thought about what makes a referee fair, and whether being outside the sides is enough.',
          'D2.Civ.8.K-2',
        ),
      ],
      [
        {
          id: 'yes',
          label: '“All right. I’ll referee.”',
          then: [
            V(
              'Splendid! A referee from the land of books. Nobody can say fairer than that.',
              'happy',
            ),
          ],
        },
        {
          id: 'who',
          label: '“Me? I only came in through a map.”',
          then: [
            A('Exactly. You do not owe anybody anything. That is what makes you fair.'),
            N('You find you cannot argue with that.'),
          ],
        },
      ],
    ),
    sc(
      'a08-01-square-done',
      [
        P(
          'Here is your wax tablet. A tablet is a flat board with wax on it, and you scratch letters in the wax with a stick.',
        ),
        N('Down its side, in neat Roman numerals, it counts from I to XII. Every line is blank.'),
        N(
          'The Romans wrote numbers with letters: I is one, V is five and X is ten. You make other numbers by adding them up.',
        ),
      ],
      [
        nt(
          'maths',
          'Roman numerals: I, V, X and adding them',
          2,
          [
            P(
              'Look: II is one and one, so two. III is three. VI is five and one, so six. XII is ten and one and one, so twelve.',
            ),
            P('You will tick them off one at a time. I to XII, one for every task.'),
          ],
          'Learned that Roman numerals use letters I, V and X, and that the numbers are made by adding them.',
        ),
      ],
    ),
    sc(
      'a08-01-complete',
      [
        N(
          'Getafix the druid, white-bearded and unhurried, stirs a cauldron by his hut. He ladles a flask full for Asterix.',
        ),
        G('The potion, for the tasks. Strength for a while, and not one drop for Obelix.'),
        O('I only want a little bit. A taste.', 'sad'),
        G(
          'You fell in when you were a baby. It is permanent. You are the reason I keep a lid on it.',
        ),
        N(
          'Obelix sulks for exactly as long as it takes to remember the boars. Dogmatix and your Nubbin are asleep in a heap by the fire.',
        ),
        P(
          'We leave at dawn for task one. I should warn you, I have a very good eye for cheating.',
          'think',
        ),
      ],
      [
        ak(
          'sel',
          'saying no kindly, with a reason',
          2,
          [N('Getafix says no to Obelix. How could he say no in a way that still shows he cares?')],
          [
            opt(
              'Explain why, and say it gently',
              [N('Yes. A reason, a kind voice and a little humour help a no feel like care.')],
              true,
            ),
            opt('Say no and walk away', [
              N('That is quick, but it can leave a friend feeling shut out. A short reason helps.'),
            ]),
            opt('Give in, to avoid a fuss', [
              N(
                'It is tempting, but if a no matters for someone’s sake, kindness means keeping it, gently.',
              ),
            ]),
          ],
          'Practised saying no kindly with a reason.',
          'CASEL: Relationship skills',
        ),
      ],
    ),
  ],
  [
    gloss(
      'tablet',
      'A flat board covered in wax, which people scratched writing into.',
      'a08-01-square-done',
    ),
    gloss('numeral', 'A symbol that stands for a number.', 'a08-01-square-done'),
  ],
);

// ================================================================== A8-2 Asbestos
const Q2 = quest(
  'a08-02',
  'Asbestos',
  {
    'a08-02-s1': {
      goal: 'Pace out the course and meet the runner.',
      hint: 'Walk from the start stone to the finish post, then talk to Asbestos.',
    },
    'a08-02-s2': {
      goal: 'Start the race and see who reaches the post.',
      hint: 'Drop your hand to start. Then watch the road, not Asterix.',
    },
  },
  [
    sc(
      'a08-02-track',
      [
        N(
          'Task one is a race along a straight dirt road, from a stone to a post far off. You pace it out, and stop counting.',
        ),
        N(
          'At the start, a young man in a short white tunic is stretching. He stretches parts of himself you did not know stretched.',
        ),
        AS(
          'Asbestos, of Greece. I have won at Olympia, where the Games began. Gods and people came to watch us run.',
          'happy',
        ),
        AS('You will not see me after the start. That is not boasting. It is a description.'),
        P(
          'The referee will start the race. Please be impartial. I mean, please be quick.',
          'think',
        ),
        N(
          'Your Nubbin and Dogmatix crouch at the start stone with their bottoms in the air, very serious.',
        ),
      ],
      [
        nt(
          'social-studies',
          'the Olympic Games began in Greece',
          2,
          [
            AS(
              'The ancient Games were held at Olympia, in Greece. Tradition says the first was in 776 BC. After that they came every four years.',
            ),
            AS(
              'Athletes ran, wrestled and threw. Today’s Olympic Games were started again in Athens in 1896, and they still come every four years.',
            ),
          ],
          'Learned that the Olympic Games began in ancient Greece, at Olympia, every four years, and were revived in 1896.',
          'D2.His.2.K-2',
        ),
      ],
      [
        {
          id: 'let',
          label: 'Let them race too.',
          then: [
            P('Animals are not in the rules.'),
            N(
              'You point out that animals are not out of the rules either. Pupus writes that down, crossly.',
            ),
          ],
        },
        {
          id: 'hold',
          label: 'Scoop them up out of the way.',
          then: [
            N('You lift your Nubbin. Dogmatix sits down on your foot, as if that settles it.'),
          ],
        },
      ],
    ),
    sc(
      'a08-02-track-done',
      [
        N('You lift your hand. Asbestos goes still as a statue, and Asterix yawns.'),
        N(
          'The road is one stade long: the length of a Greek running track, nearly two football pitches end to end.',
        ),
        N(
          'The Greeks called the track a “stadion”, and the Romans said “stadium”. That is where our word comes from.',
        ),
      ],
      [
        nt(
          'maths',
          'units of length: the stade and the metre',
          2,
          [
            N(
              'The stade at Olympia was about 192 metres. Five stades would be 960 metres, nearly a kilometre.',
            ),
            N(
              'Old units like the stade changed from place to place. Today’s races use metres, so any two tracks can be compared.',
            ),
          ],
          'Learned that a stade was about 192 metres, and compared it with metres and kilometres.',
          '4.MD.A.1',
        ),
      ],
    ),
    sc(
      'a08-02-race',
      [
        N('Your hand drops. Asbestos is a white blur, then a cloud of dust, then a dot.'),
        N(
          'Asterix ambles off the line with his hands behind his back, like a man going to look at the weather.',
        ),
        P('Is he trying?', 'shock'),
        N(
          'Halfway along the road he has one sip from his flask. Then the road is empty where he was.',
        ),
        N(
          'Down at the far end two dots become one, and that dot is Asterix, sitting on the finish post, waving, with an apple.',
        ),
        N(
          'Asbestos reaches the post at a speed nobody has ever reached anything, sees Asterix, and keeps going out of pure surprise.',
        ),
      ],
      [
        ak(
          'literacy',
          'similes',
          1,
          [
            N(
              '“Like a man going to look at the weather” compares Asterix’s walk to something. What is it called when you compare with “like” or “as”?',
            ),
          ],
          [
            opt(
              'A simile',
              [
                N(
                  'Yes. A simile compares two things using “like” or “as”. It paints a picture quickly.',
                ),
              ],
              true,
            ),
            opt('A metaphor', [
              N(
                'Close. A metaphor says one thing is another. A simile says it is like another thing, using “like” or “as”.',
              ),
            ]),
            opt('A rhyme', [
              N(
                'Rhymes repeat sounds. Here the words compare two things with “like”, which is a simile.',
              ),
            ]),
          ],
          'Identified a simile (a comparison using “like” or “as”).',
          'L.4.5',
        ),
        ak(
          'maths',
          'multiplying to find a distance',
          5,
          [N('Say Asbestos runs 8 metres every second. How far has he run after 5 seconds?')],
          [
            opt(
              '40 metres',
              [N('Yes. 8 metres a second for 5 seconds is 5 times 8, which is 40 metres.')],
              true,
            ),
            opt('13 metres', [
              N(
                'That adds 8 and 5. Each second he runs 8 metres, so it is 5 groups of 8: 5 times 8 is 40 metres.',
              ),
            ]),
            opt('85 metres', [
              N('Not quite. Five groups of eight is five times eight, which is 40 metres.'),
            ]),
          ],
          'Used multiplication to find distance: 5 seconds at 8 metres a second.',
          '3.OA.A.3',
        ),
      ],
    ),
    sc(
      'a08-02-race-done',
      [
        N(
          'Far away, over the hills, a small white figure is still running. Obelix shades his eyes and watches him go, a little enviously.',
        ),
        O('Is he all right? He looked a bit surprised.'),
        A('He will be fine. He just needs somebody to tell him he ran well, because he did.'),
      ],
      [
        ak(
          'sel',
          'losing well and being kind to someone who lost',
          2,
          [
            N(
              'Asbestos is the fastest runner in the world, and he has just lost. What could help him feel better?',
            ),
          ],
          [
            opt('Telling him honestly that he ran well', [
              N('A fair answer. Honest, specific praise helps, and it is true. He did run well.'),
            ]),
            opt('Pretending he won', [
              N('A kind wish. But he would know it was not true, and honest praise lasts longer.'),
            ]),
            opt('Leaving him alone', [
              N(
                'A fair answer. Some people want space after losing. A kind word can still help later.',
              ),
            ]),
          ],
          'Thought about how to be kind and honest to someone who lost.',
          'CASEL: Social awareness',
        ),
      ],
    ),
    sc(
      'a08-02-complete',
      [
        N(
          'You scratch a mark beside I on the wax tablet. Pupus looks at it, sighs, and initials it.',
        ),
        O('I could have done that, if there had been a boar at the end.'),
        A('He was very fast. He just was not first.'),
        P('One task. Eleven to go. I have brought a great many spare tablets.', 'think'),
      ],
      [
        nt(
          'maths',
          'I is one, and the numerals read left to right',
          1,
          [
            P('I is a single stroke, like one finger held up. It is the smallest Roman numeral.'),
            P('Notice that the Romans had no symbol for zero. Counting began at I.'),
          ],
          'Learned that the Roman numeral I is one, and that Roman numerals had no zero.',
        ),
      ],
    ),
  ],
  [
    gloss('impartial', 'Fair to everyone, and not taking anyone’s side.', 'a08-02-track'),
    gloss(
      'stade',
      'An ancient Greek measure of length, the length of a running track.',
      'a08-02-track-done',
    ),
  ],
);

// ================================================================== A8-3 Verses
const Q3 = quest(
  'a08-03',
  'Verses',
  {
    'a08-03-s1': {
      goal: 'Carry the javelins out to the throwing field.',
      hint: 'There are three javelins on the cart. Carry them one at a time.',
    },
    'a08-03-s2': {
      goal: 'Watch both throws and measure them.',
      hint: 'Stand by the far marker. Count your steps from the line to where each javelin lands.',
    },
  },
  [
    sc(
      'a08-03-field',
      [
        N(
          'Task two is a wide field of short grass with a white line at one end. A tall man in an embroidered coat waits beside it.',
        ),
        VE(
          'Verses, of Persia, at your service. Forgive me if I do not shake hands. These hands are working today.',
        ),
        N(
          'He has three javelins on a cart, each wrapped in silk. He unwraps them like a man introducing his children.',
        ),
        VE(
          'This one is Swift. This one is Patient. And this one I have never thrown. I am saving her for an occasion.',
        ),
        A('Is this an occasion?'),
        VE('It is beginning to feel like one.', 'happy'),
      ],
      [
        nt(
          'social-studies',
          'ancient Persia, and throwing as an ancient sport',
          1,
          [
            VE(
              'Persia was a great empire, in the lands that today include Iran. It was famous for its long roads, fast messengers and fine gardens.',
            ),
            VE(
              'Javelins began as hunting spears. Throwing them for distance became a sport in the ancient Olympics.',
            ),
          ],
          'Heard that Persia was a great empire in the region of modern Iran, and that javelin throwing began as hunting and became a sport.',
          'D2.His.2.K-2',
        ),
      ],
      [
        {
          id: 'careful',
          label: 'Carry them very carefully, like Verses would.',
          then: [VE('You carry them like friends. Thank you.', 'happy')],
        },
        {
          id: 'obelix',
          label: 'Ask Obelix to help.',
          then: [
            N(
              'Obelix carries all three in one hand and the cart in the other, and asks where you would like the cart.',
            ),
          ],
        },
      ],
    ),
    sc(
      'a08-03-field-done',
      [
        N(
          'You lay the javelins on the grass by the line. Your Nubbin sits beside the one called Patient, which seems right.',
        ),
        N(
          'You decide to measure the throws. You could count your paces, but your Nubbin’s paces are very small.',
        ),
      ],
      [
        ak(
          'maths',
          'why we use standard units',
          1,
          [
            N(
              'Your paces are longer than your Nubbin’s. Why is a measuring rope, marked in metres, better than counting paces?',
            ),
          ],
          [
            opt(
              'Metres are the same for everyone',
              [
                N(
                  'Yes. A standard unit means everyone gets the same answer, however long their legs are.',
                ),
              ],
              true,
            ),
            opt('Paces are always shorter', [
              N(
                'Not always. The point is that paces change from person to person, and a metre never does.',
              ),
            ]),
            opt('It makes no difference', [
              N(
                'It does. If you measure in paces and your Nubbin measures in paces, you will get different numbers for the same throw.',
              ),
            ]),
          ],
          'Understood why standard units of length matter: paces vary, metres do not.',
          '4.MD.A.1',
        ),
      ],
    ),
    sc(
      'a08-03-throws',
      [
        N(
          'Verses takes Swift, steps up, and throws. It goes up like a bird and comes down at the end of the field, quivering.',
        ),
        P('A record, surely. Referee, measure it.'),
        N(
          'You measure it. It takes a long time, and you start again twice, because Dogmatix keeps bringing you sticks.',
        ),
        N(
          'Asterix takes a sip from his flask and borrows a plain javelin. He throws it underarm, almost lazily.',
        ),
        N(
          'It goes over Verses’ javelin, over the trees and over the hill. The whistle of it fades away.',
        ),
        VE('Where is it going?', 'shock'),
        A('I could not tell you. I just threw it.'),
      ],
      [
        ak(
          'sel',
          'fairness when a result cannot be measured',
          6,
          [
            N(
              'Verses says you cannot measure a throw that has not finished. Is it fair to give Asterix the win without a number? What would you do?',
            ),
          ],
          [
            opt('Give him the win, because it clearly went further', [
              N(
                'A fair answer. When the evidence is clear, a number may not be needed. Pupus might want it in writing, though.',
              ),
            ]),
            opt('Wait until it lands, then measure', [
              N(
                'A fair answer. Fairness sometimes means being patient and waiting for the facts, even when it takes a week.',
              ),
            ]),
            opt('Say neither wins, and try again', [
              N(
                'A fair answer. Starting again with equal rules is one way to be sure. It might also be a long afternoon.',
              ),
            ]),
          ],
          'Thought about fairness when a result cannot be measured.',
          'D2.Civ.8.K-2',
        ),
      ],
      [
        {
          id: 'measure',
          label: 'Start walking after it with your tablet.',
          then: [
            P('Come back. Come back! We will be here for a week.'),
            N(
              'You come back. You give it the win on what you are calling “visible evidence of leaving”.',
            ),
          ],
        },
        {
          id: 'call',
          label: 'Call it: the javelin is still going.',
          then: [VE('A fair ruling. One cannot measure a throw that has not finished.', 'happy')],
        },
      ],
    ),
    sc(
      'a08-03-complete',
      [
        N(
          'You scratch two strokes on the wax tablet and Pupus initials them. Verses wraps Swift in silk again and bows to Asterix.',
        ),
        VE(
          'A good throw is a good throw, whoever makes it. I am going to find out where yours lands.',
          'happy',
        ),
        N(
          'He sets off over the hill with the cart, and the javelin he was saving still in its silk.',
        ),
        O('He is nice. Are all the champions going to be nice?'),
        P('No.', 'think'),
      ],
      [
        nt(
          'maths',
          'II is two, and what the numerals add up to',
          1,
          [
            P(
              'Two strokes: I and I. The Romans wrote II for two, and III for three. Up to three, you just keep adding strokes.',
            ),
            P('After that it gets tidier. Four is IV, as you will see.'),
          ],
          'Learned that Roman II and III are made by repeating the stroke I, and that four is written differently.',
        ),
      ],
    ),
  ],
  [
    gloss('javelin', 'A light spear that is thrown, often as a sport.', 'a08-03-field'),
    gloss('embroidered', 'Decorated with patterns sewn in thread.', 'a08-03-field'),
  ],
);

// ================================================================== A8-4 Cilindric
const Q4 = quest(
  'a08-04',
  'Cilindric',
  {
    'a08-04-s1': {
      goal: 'Read Cilindric’s rulebook before the bout.',
      hint: 'You are the referee: the rules are your job. Open the book on the bench.',
    },
    'a08-04-s2': {
      goal: 'Referee the bout.',
      hint: 'Stand by the rope. Asterix has an idea; let it play out.',
    },
  },
  [
    sc(
      'a08-04-rules',
      [
        N(
          'Task three is a ring of rope in a meadow. Inside it a short, square man in a white wrap is folding a towel into perfect quarters.',
        ),
        CI('Cilindric. Good morning. Before we begin, the referee will please read the rules.'),
        N('He hands you a book as thick as a loaf, every page ruled into neat columns.'),
        CI(
          'My art is about using your opponent’s strength. But also about doing it correctly. In the right order. With the right bow.',
        ),
        N(
          'Rules one to forty are about bowing. Rule forty-one says what to do if the bow is returned too low.',
        ),
        A('Is there a rule for what happens if the other man does not want to wrestle?'),
        CI('Rule three hundred and twelve. It is very firm.', 'think'),
      ],
      [
        ak(
          'social-studies',
          'what makes a rule a good rule',
          6,
          [
            N(
              'Cilindric has hundreds of rules, mostly about bowing. Which of these is the best kind of rule?',
            ),
          ],
          [
            opt(
              'A short rule that keeps people safe and is the same for everyone',
              [
                N(
                  'Yes. Good rules are clear, fair and have a reason. Rules about safety are the first you want.',
                ),
              ],
              true,
            ),
            opt('A rule nobody can remember, but which is very detailed', [
              N(
                'A rule nobody can remember cannot help anyone. Good rules are simple enough to follow.',
              ),
            ]),
            opt('A rule that only helps the person who wrote it', [
              N(
                'That is not fair. A good rule should be fair to everyone it covers, not just its author.',
              ),
            ]),
          ],
          'Compared good and bad rules: clear, fair and for a reason.',
          'D2.Civ.8.K-2',
        ),
      ],
      [
        {
          id: 'read',
          label: 'Read every rule, properly.',
          then: [
            CI('Ah. A referee who reads. You have my respect.', 'happy'),
            N('It takes until lunch. Pupus brings sandwiches, and seems to understand completely.'),
          ],
        },
        {
          id: 'skim',
          label: 'Skim it and nod wisely.',
          then: [CI('Hm. You have skipped the section on nodding.', 'think')],
        },
      ],
    ),
    sc(
      'a08-04-rules-done',
      [
        N(
          'You close the book. Cilindric bows to it, then to you, then to Asterix, then, after a moment’s thought, to the meadow.',
        ),
        P('Vale, book. That is Latin for goodbye. It comes from a word meaning “be well”.'),
        N(
          'Pupus looks pleased with himself. He has been waiting all day for someone to ask about Latin.',
        ),
      ],
      [
        nt(
          'literacy',
          'everyday Latin: salve, vale, gratias',
          1,
          [
            P('Three words to keep: salve for hello, vale for goodbye and gratias for thank you.'),
            P(
              '“Vale” began as “be well”, like our “farewell”. Many words begin as a wish for someone.',
            ),
          ],
          'Learned the Latin words salve, vale and gratias, and that “vale” meant “be well”.',
          'L.3.4',
        ),
      ],
    ),
    sc(
      'a08-04-bout',
      [
        N(
          'They face each other and bow. Cilindric moves like water, and suddenly Asterix is upside down and then the right way up.',
        ),
        A(
          'Wonderful. Could you show me that again, slowly? I want to be sure I have the rules right.',
        ),
        CI('Of course. Rule eighty. First the hand, here. Then the foot, here. Then the turn, so.'),
        CI(
          'Rule eighty-one follows rule eighty, with the elbow under, so, and then the knee comes through, so…',
        ),
        N(
          'Cilindric, demonstrating on nobody but himself, turns, tucks, turns again, and ties himself into a tidy, polite knot.',
        ),
        CI(
          'I appear to have won, against myself. Which, under rule three hundred and twelve, means I have lost.',
          'shock',
        ),
      ],
      [
        ak(
          'sel',
          'when rules get in your own way',
          5,
          [
            N(
              'Cilindric was undone by his own rules. Is that his fault? Can there be too many rules?',
            ),
          ],
          [
            opt('Yes. Too many rules can trip you up', [
              N(
                'A fair answer. Rules should help us, and a rulebook as thick as a loaf is hard to follow even for the person who wrote it.',
              ),
            ]),
            opt('No. He just made a mistake', [
              N(
                'A fair answer. Even with good rules, people slip. What matters is how kindly he and everyone else handle it.',
              ),
            ]),
            opt('The rules are fine; the knot was bad luck', [
              N(
                'A fair answer. Sometimes things go wrong without anyone to blame. A kind reaction still helps.',
              ),
            ]),
          ],
          'Thought about whether having too many rules can trip people up.',
          'CASEL: Responsible decision-making',
        ),
      ],
      [
        {
          id: 'untie',
          label: 'Help untie him.',
          then: [
            N(
              'It takes you, Obelix and both animals. Cilindric thanks each of you by name, including the dog.',
              'happy',
            ),
          ],
        },
        {
          id: 'rule',
          label: 'Look up rule three hundred and twelve to be sure.',
          then: [
            CI('Correct. A referee who checks. I would wrestle under you again any time.', 'happy'),
          ],
        },
      ],
    ),
    sc(
      'a08-04-complete',
      [
        N(
          'You scratch a third stroke on the wax tablet. Cilindric folds his towel again, perfectly.',
        ),
        CI(
          'A clean result. Unusual, but clean. Please keep the book. I have three more at home.',
          'happy',
        ),
        O('He was nice too.'),
        P(
          'They are all nice. That is the trouble. Nobody nice ever wins anything for Rome.',
          'sad',
        ),
      ],
      [
        dd(
          'maths',
          'III is three; counting the tablet',
          1,
          'edu:count:tablet-marks:3',
          [
            N('(Count the strokes on your tablet: I, II and now III.)'),
            P('Three strokes for three tasks. Count what is left: nine more.'),
          ],
          'Counted three Roman strokes on the tablet and worked out nine remain.',
          '2.OA.A.1',
        ),
      ],
    ),
  ],
  [gloss('demonstrating', 'Showing how something is done.', 'a08-04-bout')],
);

// ================================================================== A8-5 The Isle of Pleasure
const Q5 = quest(
  'a08-05',
  'The Isle of Pleasure',
  {
    'a08-05-s1': {
      goal: 'Row across to the island.',
      hint: 'Take the oars. Do not let Obelix row alone, or you will go in circles.',
    },
    'a08-05-s2': {
      goal: 'Get everybody back to the boat.',
      hint: 'Find your Nubbin and Dogmatix first. Obelix will take care of Asterix.',
    },
  },
  [
    sc(
      'a08-05-boat',
      [
        N(
          'Task four is an island in a blue lake, with soft music coming over the water and a smell of honey cakes.',
        ),
        P(
          'The task is simple. Cross the island and leave it. Nobody ever has. They all stay.',
          'think',
        ),
        A('Why?'),
        P('Because it is lovely. That is the whole difficulty.'),
        N(
          'Obelix rows with one oar and you row with the other. The boat goes forward, mostly, and sideways the rest of the time.',
        ),
        N(
          'Dogmatix stands at the front like a figurehead. Your Nubbin leans beside him into a wind it is not really getting.',
        ),
      ],
      [
        nt(
          'science',
          'why boats float: balanced forces',
          4,
          [
            N(
              'The boat floats because water pushes up on it. Gravity pulls down, and the water’s push balances it.',
            ),
            N('A boat is shaped to push aside a lot of water, which gives a big upward push.'),
          ],
          'Learned that a floating boat is held up by water’s upward push, balanced against gravity.',
          '3-PS2-1',
        ),
      ],
    ),
    sc(
      'a08-05-boat-done',
      [
        N(
          'The boat bumps onto white sand. There are cushions on the beach, left there on purpose.',
        ),
        N(
          'A ripple laps at the boat. “Aqua” is the Latin for water, Pupus says, and it is why you have an aquarium.',
        ),
      ],
      [
        ak(
          'literacy',
          'English words from the Latin “aqua”',
          1,
          [N('“Aqua” is Latin for water. Which of these English words has “aqua” in it?')],
          [
            opt(
              'Aquarium',
              [
                N(
                  'Yes. An aquarium is a place for water animals. “Aquatic” also comes from “aqua”.',
                ),
              ],
              true,
            ),
            opt('Aeroplane', [
              N('“Aero” means air, not water. “Aquarium” is the one that starts with “aqua”.'),
            ]),
            opt('Acorn', [
              N('An acorn is a nut from an oak tree. “Aquarium” is the word with “aqua”, water.'),
            ]),
          ],
          'Identified an English word built from the Latin “aqua”.',
          'L.3.4',
        ),
      ],
    ),
    sc(
      'a08-05-isle',
      [
        N(
          'Kind women in pale robes come down to the shore with plates of cakes and jugs of cool fruit juice.',
        ),
        H(
          'Welcome, travellers. You look so tired. Sit down. Rest. There is a bath, and a sofa, and nobody will ever ask you to do anything again.',
        ),
        N(
          'Asterix sits down on a cushion. He looks surprised, as if his legs did it without asking him.',
        ),
        A('Only for a moment.', 'soft'),
        H('Of course. Only for ever.'),
        N(
          'Your Nubbin and Dogmatix have found a garden of butterflies and are rolling in the clover with their eyes half shut.',
        ),
        O('Excuse me. Is there any boar?'),
        H('We have honey, and figs, and peaches, and little cakes with…'),
        O('So no boar.', 'angry'),
      ],
      [
        ak(
          'sel',
          'safe and comfortable is not the same as well',
          8,
          [
            N(
              'Everything on the island is soft and kind. Is a life with nothing to do, and no effort, good for us? Why is it so hard to leave?',
            ),
          ],
          [
            opt('Rest is good, but we also need purpose', [
              N(
                'A fair answer. Rest is important. Many people feel better when they have something to do and people to do it with.',
              ),
            ]),
            opt('It would be wonderful, so staying is fine', [
              N(
                'A fair answer. Rest and comfort are lovely, and nothing is wrong with enjoying them. The question is whether you would miss the things you left.',
              ),
            ]),
            opt('It is only hard to leave because we are tired', [
              N(
                'A fair answer. Tiredness is part of it. So is the feeling that nothing will ever be asked of us again, which is both pleasant and a little sad.',
              ),
            ]),
          ],
          'Thought about whether a comfortable life with nothing to do is the same as a good life.',
          'CASEL: Self-awareness',
        ),
      ],
      [
        {
          id: 'fetch',
          label: 'Go and fetch the Nubbin and the dog.',
          then: [
            N(
              'You lift them out of the clover, one under each arm. They are warm and floppy and very sleepy, and they let you.',
            ),
          ],
        },
        {
          id: 'cake',
          label: 'Have just one cake first.',
          then: [
            N(
              'It is the best cake you have ever eaten. You notice that you have sat down, and get up again, quickly.',
              'shock',
            ),
          ],
        },
      ],
    ),
    sc(
      'a08-05-isle-done',
      [
        N(
          'Obelix picks Asterix up off the cushion, tucks him under one arm, and walks back to the boat without stopping.',
        ),
        O('Sorry. Thank you. Lovely island. No boar.'),
        N(
          'It is not that Obelix is not tempted. It is that, for him, nothing on earth compares to a good boar.',
        ),
      ],
      [
        ak(
          'literacy',
          'character traits and motives',
          2,
          [
            N(
              'Obelix walked away from the island because he wanted boar. What trait does that show, and is it a strength here?',
            ),
          ],
          [
            opt(
              'Determination: knowing what you want',
              [
                N(
                  'Yes. Knowing what he wants keeps him from drifting. It is a strength here, even if it is also a little funny.',
                ),
              ],
              true,
            ),
            opt('Greed: he only wants food', [
              N(
                'Food is what he wants, but the trait here is that he keeps his focus. That saved everyone.',
              ),
            ]),
            opt('Shyness: he was scared of the women', [
              N(
                'Nothing in the story says he is shy. He is focused on boar, and that is what saves them.',
              ),
            ]),
          ],
          'Identified a character’s trait (determination) and its effect in the story.',
          'RL.3.3',
        ),
      ],
    ),
    sc(
      'a08-05-complete',
      [
        N(
          'Halfway home across the lake, Asterix sits up and shakes his head, like someone coming out of a warm bath.',
        ),
        A('I was going to stay. I really was going to stay.', 'shock'),
        O('You were not. There was no boar.'),
        N('You scratch a fourth mark on the tablet: IV. Pupus nods.'),
        P(
          'In all the records, nobody has ever rowed away from that island. And nobody has ever left it in a sulk.',
          'think',
        ),
      ],
      [
        nt(
          'maths',
          'IV is four: subtracting by writing a smaller numeral first',
          3,
          [
            P(
              'Here is the Roman trick. When a smaller numeral comes before a bigger one, you take it away. I before V is five minus one: four.',
            ),
            P(
              'When it comes after, you add: VI is five plus one, six. Romans sometimes wrote IIII too, but IV is the usual way today.',
            ),
          ],
          'Learned that Roman IV means five minus one, while VI means five plus one, so order matters.',
          '2.OA.A.1',
        ),
      ],
    ),
  ],
  [
    gloss('aqua', 'The Latin word for water.', 'a08-05-boat-done'),
    gloss(
      'figurehead',
      'A carved figure at the front of a ship; here, a dog standing in its place.',
      'a08-05-boat',
    ),
  ],
);

// ================================================================== A8-6 Iris
const Q6 = quest(
  'a08-06',
  'Iris',
  {
    'a08-06-s1': {
      goal: 'Find the hypnotist’s tent.',
      hint: 'Follow the painted eyes on the trees to a tent with a moon on it.',
    },
    'a08-06-s2': {
      goal: 'Referee the staring contest.',
      hint: 'Sit between them, and look at the sand timer, not at either of them.',
    },
  },
  [
    sc(
      'a08-06-tent',
      [
        N(
          'Task five waits at the end of a path lined with painted eyes. They seem to follow you, which is probably the point.',
        ),
        N(
          'The tent is dark inside and smells of incense. A man in a tall headdress sits very still on a cushion.',
        ),
        IR(
          'I am Iris, from Egypt, where we have been looking at things for a very long time. Look into my eyes.',
        ),
        N(
          'His eyes are enormous and dark, with a faint glow in them, like coals. You find you have already looked.',
        ),
        IR(
          'Your task is to hold my gaze. Whoever looks away first, loses. And whoever loses will believe whatever I say they are.',
        ),
        P('He is very good. Last week he convinced a centurion he was a teapot.', 'think'),
      ],
      [
        nt(
          'science',
          'how your eyes handle dim light',
          1,
          [
            N(
              'Inside the dark tent, the black circle in the middle of your eye, the pupil, grows bigger. That lets in more light.',
            ),
            N(
              'In bright sunshine, the pupil shrinks again. Your eyes adjust all the time, without you thinking about it.',
            ),
          ],
          'Learned that the pupil widens in dim light and shrinks in bright light.',
          '4-LS1-2',
        ),
      ],
      [
        {
          id: 'brave',
          label: 'Try a practice stare yourself.',
          then: [
            N(
              'You last about two seconds. When you come round, you are holding your Nubbin and humming like a beehive.',
              'shock',
            ),
          ],
        },
        {
          id: 'away',
          label: 'Look at the floor, sensibly.',
          then: [IR('A wise referee. The floor is safe. Mostly.')],
        },
      ],
    ),
    sc(
      'a08-06-stare',
      [
        N(
          'Asterix sits down opposite Iris. You turn the sand timer over, and keep your eyes firmly on the sand.',
        ),
        IR('You are growing sleepy. You are a small, soft creature. You are… a dormouse.'),
        A('No, I am not.'),
        N(
          'Iris leans closer, and the glow in his eyes brightens. The glow in Asterix’s, after a sip from his flask, brightens further.',
        ),
        A('Actually, I think you are the one who is sleepy.'),
        N(
          'Something in Iris’s face goes uncertain. His nose twitches, his shoulders go round, and he snuffles at the cushion.',
        ),
        N(
          'He is quite sure, now, that he is a wild boar, and trots out of the tent on all fours, grunting happily.',
        ),
        A('Obelix, no. He is a person. He will be a person again by supper.'),
      ],
      [
        ak(
          'maths',
          'time with a sand timer',
          1,
          [
            N(
              'The sand timer takes 3 minutes to run through. If you turn it over twice, how many minutes have gone by?',
            ),
          ],
          [
            opt('6 minutes', [N('Yes. 3 minutes twice is 3 times 2, which is 6 minutes.')], true),
            opt('5 minutes', [
              N(
                'That adds 3 and 2. Each turn is 3 minutes, and there are 2 turns, so 3 times 2 is 6.',
              ),
            ]),
            opt('32 minutes', [
              N(
                'That writes the numbers side by side. It is 2 lots of 3 minutes, which is 6 minutes.',
              ),
            ]),
          ],
          'Found a time interval by multiplying: two 3-minute turns make 6 minutes.',
          '3.MD.A.1',
        ),
        ak(
          'sel',
          'honesty, tricks and who gets to say who you are',
          6,
          [
            N(
              'Iris tries to convince people they are something they are not. Is that a harmless trick, or something that could hurt? When is it okay?',
            ),
          ],
          [
            opt('It is harmless if everybody agrees to play', [
              N(
                'A fair answer. Agreement matters. A trick everyone has chosen to play is different from one played on someone who did not choose.',
              ),
            ]),
            opt('It is not okay to make people believe false things', [
              N(
                'A fair answer. Being tricked can feel awful, because it takes away our choice about what to believe.',
              ),
            ]),
            opt('It depends how much it matters to them', [
              N(
                'A fair answer. A teapot joke is not the same as a trick that makes someone give up something they care about.',
              ),
            ]),
          ],
          'Thought about when a trick is harmless and when it takes away someone’s choice.',
          'CASEL: Responsible decision-making',
        ),
      ],
    ),
    sc(
      'a08-06-stare-done',
      [
        N(
          'The last grain of sand falls. Dogmatix is barking at the tent door, and your Nubbin has hidden behind your boots.',
        ),
        N(
          'When Iris’s eyes were at their brightest, they glowed like embers in a banked-up fire. Now they are just a man’s eyes, soft and a little puzzled.',
        ),
      ],
      [
        ak(
          'literacy',
          'similes and metaphors',
          1,
          [
            N(
              'Iris’s eyes “glowed like embers”. That uses “like”, so it is a simile. Which of these is a metaphor instead?',
            ),
          ],
          [
            opt(
              '“His eyes were two coals”',
              [N('Yes. A metaphor says one thing is another, without “like” or “as”.')],
              true,
            ),
            opt('“His eyes glowed like coals”', [
              N('That uses “like”, so it is a simile. A metaphor says his eyes were coals.'),
            ]),
            opt('“His eyes were big”', [
              N(
                'That is a plain description, not a comparison. A metaphor compares two different things.',
              ),
            ]),
          ],
          'Told a metaphor from a simile.',
          'L.4.5',
        ),
      ],
    ),
    sc(
      'a08-06-complete',
      [
        N(
          'You scratch a fifth mark on the tablet: a V. Pupus looks at it, sighs, and initials it.',
        ),
        N(
          'Outside, Iris is rooting cheerfully among the acorns. Pupus watches him with deep sympathy.',
        ),
        P('It wears off. Usually. I will make sure somebody brings him a cushion.', 'soft'),
        O('He looks happy.'),
        A('He does, a bit. Come on. Seven to go.'),
      ],
      [
        nt(
          'maths',
          'V is five',
          1,
          [
            P(
              'V is the symbol for five. Some people think it looks like an open hand, with the thumb on one side and four fingers on the other.',
            ),
            P(
              'Whether or not that is true, the V is the main milestone. Everything up to ten is built from I, V and X.',
            ),
          ],
          'Learned that V stands for five, and that Roman numerals up to ten use I, V and X.',
        ),
      ],
    ),
  ],
  [
    gloss('headdress', 'A decorated covering or hat worn on the head.', 'a08-06-tent'),
    gloss('incense', 'A material burned for its sweet smell.', 'a08-06-tent'),
  ],
);

// ================================================================== A8-7 Mannekenpix
const Q7 = quest(
  'a08-07',
  'Mannekenpix',
  {
    'a08-07-s1': {
      goal: 'Help carry the dishes from the kitchen.',
      hint: 'Take them from the hatch to the long table. The big ones need two hands.',
    },
    'a08-07-s2': {
      goal: 'Keep the plates coming and watch Obelix finish.',
      hint: 'Stand by the table with your tablet. Count the courses.',
    },
  },
  [
    sc(
      'a08-07-kitchen',
      [
        N(
          'Task six is a meal. On a long table in a hall with low beams, a single plate is set, and a single, very large chair.',
        ),
        N(
          'In the kitchen behind it, a round, red-faced man in an apron is stirring four pots and tasting a fifth.',
        ),
        MK(
          'Mannekenpix, chef, from the north. The Belgae, if you like. Nobody leaves my table hungry.',
          'happy',
        ),
        MK(
          'The task is to finish. Everything. To the last crumb. Whoever has tried has had to be carried home on a door.',
        ),
        O('Me? Oh, all right then. If I must.', 'happy'),
      ],
      [
        nt(
          'social-studies',
          'the Belgae, and where Belgium gets its name',
          2,
          [
            MK(
              'The Belgae were the peoples of the north of Gaul. Caesar himself wrote that they were the bravest of all the Gauls.',
            ),
            MK(
              'The country of Belgium takes its name from them. Names can stay on a map for two thousand years.',
            ),
          ],
          'Learned that the Belgae lived in northern Gaul and gave their name to modern Belgium.',
          'D2.His.2.K-2',
        ),
      ],
      [
        {
          id: 'taste',
          label: 'Ask what’s in the soup.',
          then: [
            MK(
              'Everything I had, and a bit of love. The love is the secret. The everything helps.',
              'happy',
            ),
          ],
        },
        {
          id: 'carry',
          label: 'Just carry, and carry quickly.',
          then: [MK('Good! Hot food goes out hot. You have the makings of a waiter.', 'happy')],
        },
      ],
    ),
    sc(
      'a08-07-kitchen-done',
      [
        N(
          'Soup, then fish, then three kinds of pie. Then a dish of crisp fried potatoes that Mannekenpix places down as if it were a crown.',
        ),
        MK('Each pie is cut into four equal slices. Count them as they go.'),
        N('The first pie loses one slice at once.'),
      ],
      [
        ak(
          'maths',
          'unit fractions',
          1,
          [
            N(
              'A pie is cut into 4 equal slices, and Obelix eats one. What fraction of the pie has he eaten?',
            ),
          ],
          [
            opt(
              'One quarter, written 1/4',
              [N('Yes. One slice out of four equal slices is one quarter, 1/4.')],
              true,
            ),
            opt('One half, written 1/2', [
              N('One half would be two slices out of four. One slice out of four is one quarter.'),
            ]),
            opt('One third, written 1/3', [
              N(
                'A third needs three equal slices. This pie has four, so one slice is one quarter, 1/4.',
              ),
            ]),
          ],
          'Named one slice of four equal slices as the unit fraction 1/4.',
          '3.NF.A.1',
        ),
      ],
    ),
    sc(
      'a08-07-feast',
      [
        N(
          'Obelix eats steadily, happily, and without hurry. Each dish goes in and the plate comes back so clean it shines.',
        ),
        N(
          'You count courses on your tablet. You run out of room at twenty and start a second tablet.',
        ),
        MK(
          'He has eaten the pies. He has eaten the stew. He has eaten the second stew, which was for me.',
          'shock',
        ),
        N(
          'At last the hatch is empty. Mannekenpix leans in the doorway, floury and astonished, with nothing left to bring.',
        ),
        O('That was a lovely starter. When is the main course?', 'happy'),
        MK('Thirty years I have been waiting for someone to ask me that.', 'happy'),
      ],
      [
        nt(
          'health',
          'food gives energy; listen to your body',
          1,
          [
            N(
              'Food is fuel. Our bodies turn it into energy for moving, thinking and growing, and a mix of foods gives us what we need.',
            ),
            N(
              'Your body tells you when you are hungry and when you are full. Listening to those signals is a good habit. Obelix is… a special case.',
            ),
          ],
          'Learned that food gives energy, and that listening to hunger and fullness is a healthy habit.',
        ),
        ak(
          'sel',
          'generosity, and when too much is not kind',
          5,
          [
            N(
              'A big feast is a generous gift. But is it kind to challenge a guest to eat everything on the table? Where is the line between generous and too much?',
            ),
          ],
          [
            opt('Generous means offering, not forcing', [
              N(
                'A fair answer. A host who offers and lets the guest decide is generous. A challenge that nobody can win can be a trap.',
              ),
            ]),
            opt('It is fine, because Obelix chose it', [
              N(
                'A fair answer. Choosing matters a lot. Obelix is happy, and nobody is being made to do anything.',
              ),
            ]),
            opt('The chef is just proud of his cooking', [
              N(
                'A fair answer. Pride in cooking is a lovely thing, and it can be shown with a smaller table too.',
              ),
            ]),
          ],
          'Thought about the difference between generosity and pressure.',
          'CASEL: Social awareness',
        ),
      ],
      [
        {
          id: 'scraps',
          label: 'Save the scraps for the Nubbin and Dogmatix.',
          then: [
            N(
              'There are no scraps. Obelix gives them each a crust from his own pocket, which seems to be where he keeps them.',
            ),
          ],
        },
        {
          id: 'clap',
          label: 'Applaud the chef.',
          then: [
            N(
              'You clap, and Pupus claps, and Obelix claps with his mouth full. Mannekenpix takes a deep, floury bow.',
              'happy',
            ),
          ],
        },
      ],
    ),
    sc(
      'a08-07-complete',
      [
        MK('Here. For the road. You will be hungry again by the river.', 'happy'),
        N('He gives Obelix a wrapped parcel of fried potatoes. Obelix holds it like a newborn.'),
        N(
          'You scratch a sixth mark: VI. Pupus initials it, and looks as though he would like to sit down.',
        ),
        P('Halfway. Six tasks. Caesar is going to be very quiet when I tell him.', 'sad'),
      ],
      [
        nt(
          'maths',
          'VI is six, and halfway through twelve',
          2,
          [
            P('V and then I: five and one, so VI is six. Six out of twelve is exactly half.'),
            P('You can write that as 6/12, which is the same as 1/2. Half the tasks are done.'),
          ],
          'Learned that VI is five plus one, and that six out of twelve is one half.',
          '3.NF.A.1',
        ),
      ],
    ),
  ],
  [
    gloss('course', 'One dish served at a meal, such as soup or pie.', 'a08-07-feast'),
    gloss('astonished', 'Very, very surprised.', 'a08-07-feast'),
  ],
);

// ================================================================== A8-8 The Cave of the Beast
const Q8 = quest(
  'a08-08',
  'The Cave of the Beast',
  {
    'a08-08-s1': {
      goal: 'Go into the cave with a lantern.',
      hint: 'Light the lantern at the entrance. Keep the wall on your left.',
    },
    'a08-08-s2': {
      goal: 'Find out what lives in the cave.',
      hint: 'Do not lift the lantern too high. Sit down, and let it come to you.',
    },
  },
  [
    sc(
      'a08-08-mouth',
      [
        N(
          'Task seven is a black hole in a hillside, with old bones round the entrance. Pupus stands well back from the bones.',
        ),
        P(
          'The task is to go in, and come out. Something lives in there. Nobody who has gone in has said what.',
        ),
        N(
          'From inside, very deep down, comes a long, rumbling sound, like a cart going over a wooden bridge.',
        ),
        N(
          'Dogmatix’s ears go flat, and your Nubbin presses against your leg. You light the lantern.',
        ),
        N(
          'The first ten steps are only a cave: drips, cold air, and your own breath. Water falls from the roof, drop by drop.',
        ),
      ],
      [
        nt(
          'science',
          'how caves grow stalactites over a very long time',
          4,
          [
            N(
              'Each drip that falls from the roof carries a tiny trace of mineral. Over thousands of years, those traces build into hanging stone spikes called stalactites.',
            ),
            N(
              'Many stalactites grow only about a centimetre in a hundred years. Nature can change a place, but sometimes very slowly.',
            ),
          ],
          'Learned that dripping mineral water slowly builds stalactites, and that some natural change is very slow.',
          '2-ESS1-1',
        ),
      ],
      [
        {
          id: 'first',
          label: 'Go first, with the lantern.',
          then: [A('Brave referee. We are right behind you.'), O('A little behind.')],
        },
        {
          id: 'together',
          label: 'Ask everyone to go in side by side.',
          then: [
            N(
              'It is a tight fit, and Obelix goes sideways. It is much better, side by side.',
              'soft',
            ),
          ],
        },
      ],
    ),
    sc(
      'a08-08-mouth-done',
      [
        N(
          'The passage opens into a chamber so big the lantern light does not reach the roof. The rumble is very near now.',
        ),
        N(
          'Your heart is going fast, and your hands feel cold. Your Nubbin is holding on to your sleeve.',
        ),
      ],
      [
        ak(
          'sel',
          'noticing fear in your body, and what helps',
          1,
          [N('You are scared, and your heart is pounding. What could help you feel steadier?')],
          [
            opt(
              'Slow breaths, and staying close to friends',
              [
                N(
                  'Yes. Slow breaths calm a pounding heart, and friends close by make a scary place feel smaller.',
                ),
              ],
              true,
            ),
            opt('Running back out alone', [
              N(
                'That is a natural wish. But running alone often makes fear grow, and you would leave your friends behind.',
              ),
            ]),
            opt('Pretending you feel nothing', [
              N(
                'Pretending does not make fear go away. Saying “I am scared” and breathing slowly works better.',
              ),
            ]),
          ],
          'Named the signs of fear in the body and chose calming strategies.',
          'CASEL: Self-management',
        ),
      ],
    ),
    sc(
      'a08-08-beast',
      [
        N(
          'At the edge of the light there is a shape, as big as a haystack, curled tight. The rumble is coming from it.',
        ),
        N(
          'It is not growling but shaking. Whatever it is, it is very large, and very frightened of the light.',
        ),
        A('It is scared of us.', 'soft'),
        O('Everybody is scared of me. I do not know why.', 'sad'),
        N('You turn the lantern down low, and sit on the cold floor, and say nothing.'),
        N(
          'Dogmatix sits beside you, then your Nubbin. Then, very carefully, so the floor will not shake, Obelix.',
        ),
        N(
          'After a long time, something huge and soft, with very small eyes, puts its nose out and sniffs your Nubbin.',
        ),
        N('Your Nubbin sniffs back. The rumble stops.', 'soft'),
      ],
      [
        nt(
          'science',
          'animals in the dark use other senses',
          6,
          [
            N(
              'An animal that lives in a dark cave cannot rely on its eyes. Its nose and its ears do much more of the work.',
            ),
            N(
              'That is why the Beast sniffs first. A smell tells it who you are, long before it could see you.',
            ),
          ],
          'Learned that animals in dark places often rely more on smell and hearing.',
          '4-LS1-2',
        ),
        ak(
          'sel',
          'why gentleness works, and why the visitors keep it secret',
          7,
          [
            N(
              'The Beast calmed down when you sat quietly. Why does gentleness work on a scared animal? And why would nobody tell the secret?',
            ),
          ],
          [
            opt('Scared creatures need to feel safe first', [
              N(
                'A fair answer. Safety has to come before trust. Sitting still and small showed you meant no harm.',
              ),
            ]),
            opt('They kept the secret to protect the Beast', [
              N(
                'A fair answer. If everyone knew, people might come to stare or to hurt it. Some kindness is quiet.',
              ),
            ]),
            opt('It is just more fun to leave it a mystery', [
              N(
                'A fair answer. A shared secret can feel like a gift. And in this story, it is also a way of protecting something.',
              ),
            ]),
          ],
          'Thought about why gentleness helps a frightened creature, and about keeping a kind secret.',
          'CASEL: Social awareness',
        ),
      ],
      [
        {
          id: 'lantern',
          label: 'Leave the lantern, turned down low.',
          then: [
            N(
              'You set it on a rock, at its gentlest. The great shape settles beside it like a cat by a stove.',
              'soft',
            ),
          ],
        },
        {
          id: 'quiet',
          label: 'Back out quietly, in the dark.',
          then: [
            N(
              'You go out the way you came, slowly. Behind you, the rumble starts again, but slower now, like snoring.',
              'soft',
            ),
          ],
        },
      ],
    ),
    sc(
      'a08-08-complete',
      [
        N('Outside, the daylight is very loud. Pupus is still standing well back from the bones.'),
        P('Well? What was it?'),
        A('Nothing you need to worry about.'),
        N('You scratch a seventh mark: VII. It is V with two strokes after it, five and two more.'),
        P('You are all the same, you lot. You go in, and you come out kind.', 'think'),
      ],
      [
        nt(
          'maths',
          'VII is seven; reading numerals as a sum',
          3,
          [
            P('Read VII left to right: V is five, then I and I add two. Five and two make seven.'),
            P('Seven is more than half of twelve. Five tasks to go.'),
          ],
          'Read the Roman numeral VII as 5 + 1 + 1 = 7, and found that 5 tasks remain.',
          '2.OA.A.1',
        ),
      ],
    ),
  ],
  [
    gloss('entrance', 'The way in to a place.', 'a08-08-mouth'),
    gloss('chamber', 'A large room, such as one inside a cave.', 'a08-08-mouth-done'),
  ],
);

// ================================================================== A8-9 The Place That Sends You Mad
const Q9 = quest(
  'a08-09',
  'The Place That Sends You Mad',
  {
    'a08-09-s1': {
      goal: 'Go into the Place That Sends You Mad and ask for Permit A38.',
      hint: 'Start with the porter at the front door. Be polite.',
    },
    'a08-09-s2': {
      goal: 'Try to get the permit the proper way.',
      hint: 'Go from counter to counter. Keep track of where each one sends you.',
    },
    'a08-09-s3': {
      goal: 'Design your own impossible form for the clerks.',
      hint: 'Write it on a fresh page of your tablet. The sillier it is, the better.',
    },
    'a08-09-s4': {
      goal: 'Hand in your form while Asterix asks for Permit A39.',
      hint: 'Give the form to the clerk at counter one, then stand back.',
    },
  },
  [
    sc(
      'a08-09-door',
      [
        N(
          'Task eight is a building: tall, white and humming, with more windows than there are days in the year. It is a famous bureaucracy.',
        ),
        P(
          'Inside, you must obtain Permit A38. That is all. Many great warriors have gone in for it.',
          'think',
        ),
        A('And?'),
        P('Some of them still work there.', 'sad'),
        N(
          'The hall is full of counters, and stairs, and people holding papers and looking at the ceiling with a terrible calm.',
        ),
        PO(
          'Good morning. Do you have an appointment? You need counter one, which will send you to counter two.',
        ),
      ],
      [
        nt(
          'social-studies',
          'what a bureaucracy is',
          5,
          [
            P(
              'This is a bureaucracy: an organisation run by officials, with lots of rules, forms and offices. The word comes from “bureau”, meaning a writing desk.',
            ),
            P(
              'Rome needed officials and records to collect taxes and count its people. Rules and forms can be useful. Trouble starts when they stop helping people.',
            ),
          ],
          'Learned that a bureaucracy is an organisation of officials and forms, useful when it serves people.',
          'D2.Civ.8.K-2',
        ),
      ],
    ),
    sc(
      'a08-09-door-done',
      [
        N(
          'Dogmatix lies down by the porter’s desk with your Nubbin, as if they have both decided to wait this one out.',
        ),
        N('You have been waiting for a long time, and you are beginning to feel cross.'),
      ],
      [
        ak(
          'sel',
          'handling frustration while waiting',
          1,
          [N('You have waited ages and you are getting cross. What would help you stay calm?')],
          [
            opt(
              'Breathe, count, or do a quiet activity',
              [N('Yes. Slow breathing and a small, quiet activity give your body time to settle.')],
              true,
            ),
            opt('Shout at the porter', [
              N(
                'It might feel good for a moment, but the porter did not make the rules, and shouting rarely gets help.',
              ),
            ]),
            opt('Give up and go home', [
              N(
                'Sometimes walking away is wise. Here, you have friends and a plan, so a few calm breaths first is better.',
              ),
            ]),
          ],
          'Chose a calming way to handle frustration while waiting.',
          'CASEL: Self-management',
        ),
      ],
    ),
    sc(
      'a08-09-counters',
      [
        CL('Counter one. Permit A38? Not here. You need the blue form, from counter two.'),
        N(
          'Counter two is on the third floor. The clerk is eating lunch, though it is ten in the morning.',
        ),
        CL(
          'The blue form? You need the pink form first, to prove you are allowed to ask for the blue form. Counter three.',
        ),
        N('Counter three sends you back to counter one. You write it all down: 1, 2, 3, 1, 2, 3.'),
        N(
          'A man in a dusty toga drifts past, holding a scroll. He has a long white beard and looks about your age.',
        ),
        N('You look at your tablet. The arrows on it make a perfect circle.'),
      ],
      [
        ak(
          'maths',
          'a repeating pattern, using its rule',
          4,
          [
            N(
              'The counters go 1, 2, 3, 1, 2, 3 without end. If you start at counter 1 and take 10 steps, which counter are you at?',
            ),
          ],
          [
            opt(
              'Counter 2',
              [
                N(
                  'Yes. Every 3 steps you return to counter 1, so 9 steps ends at counter 1, and the tenth step goes to counter 2.',
                ),
              ],
              true,
            ),
            opt('Counter 1', [
              N(
                'Nine steps ends at counter 1, because 9 is a multiple of 3. Step ten goes on to counter 2.',
              ),
            ]),
            opt('Counter 3', [
              N(
                'Count the cycle: after 9 steps you are at counter 1, so the tenth step reaches counter 2.',
              ),
            ]),
          ],
          'Used the rule of a repeating pattern, a cycle of 3, to find the tenth step.',
          '4.OA.C.5',
        ),
      ],
      [
        {
          id: 'queue',
          label: 'Join the longest queue, just to see.',
          then: [
            N(
              'You get to the front just as the clerk puts up a sign: “Closed for reorganisation. Please queue at the back.”',
            ),
          ],
        },
        {
          id: 'map',
          label: 'Draw a map of the counters.',
          then: [
            A('Show me that.'),
            N(
              'Asterix looks at your circle of arrows for a long while. Then he smiles, slowly.',
              'happy',
            ),
          ],
        },
      ],
    ),
    sc(
      'a08-09-counters-done',
      [
        A('They have built a machine for saying no.', 'happy'),
        A('So let us ask it for something it cannot say no to, because it does not exist.'),
      ],
      [
        ak(
          'literacy',
          'metaphor',
          0,
          [
            N(
              'Asterix calls the building “a machine for saying no”. It is not really a machine. What does the metaphor mean?',
            ),
          ],
          [
            opt(
              'It says no again and again, without thinking',
              [
                N(
                  'Yes. A machine repeats the same action without caring. The metaphor shows that the clerks never think about what you need.',
                ),
              ],
              true,
            ),
            opt('It is made of metal and wheels', [
              N(
                'It is not literally made of metal. A metaphor says one thing is another to make a point about it.',
              ),
            ]),
            opt('It is very noisy', [
              N(
                'The building hums, but this metaphor is about how it answers: always the same, always no.',
              ),
            ]),
          ],
          'Explained a metaphor (the building as a machine for saying no).',
          'L.4.5',
        ),
      ],
    ),
    sc(
      'a08-09-form',
      [
        A('Here is the plan. I ask for Permit A39, which nobody has ever heard of.'),
        A(
          'And while they look, the referee hands in a new form, so strange they have to pass it round.',
        ),
        N(
          'You find a fresh page of your tablet. Obelix leans over your shoulder, breathing heavily and helpfully.',
        ),
        O('Make it a good one. Make it the silliest one ever.', 'happy'),
        P('The silliest form only wins if it looks completely serious.', 'think'),
      ],
      [
        ak(
          'social-studies',
          'rules that help people, and rules that only help themselves',
          4,
          [
            N(
              'This building has rules that seem only to protect themselves. How do you tell a rule that helps from one that does not? Which would you keep?',
            ),
          ],
          [
            opt('Keep rules that protect people and are clear', [
              N(
                'A fair answer. A rule that keeps people safe and treats them equally has a good reason behind it.',
              ),
            ]),
            opt('Keep rules only if they can be explained', [
              N(
                'A fair answer. If nobody can say why a rule exists, that is a sign to look at it again.',
              ),
            ]),
            opt('Keep few rules, and check them often', [
              N(
                'A fair answer. Every rule costs people a little time and effort. It helps to look at them often, and ask whether they still serve a purpose.',
              ),
            ]),
          ],
          'Thought about how to tell helpful rules from rules that only serve themselves.',
          'D2.Civ.8.K-2',
        ),
      ],
      [
        {
          id: 'loop',
          label: 'Form 0: Application to Find Out Whether You Need This Form.',
          set: { 'a08-form': 'loop' },
          then: [
            N(
              'It has one box, which says, in small letters: “Please attach a completed copy of this form.”',
            ),
            P(
              'That is… that is beautiful. That could go round this building until the sun burns out.',
              'shock',
            ),
          ],
        },
        {
          id: 'boar',
          label: 'The Pink-and-Blue Form: Proof That You Are Not a Boar, to be signed by a boar.',
          set: { 'a08-form': 'boar' },
          then: [
            N(
              'Obelix signs it on the boar’s behalf, with a hoof print he makes with his knuckle. It looks extremely official.',
            ),
            O('Somebody will have to find a boar who can write.', 'happy'),
          ],
        },
        {
          id: 'plain',
          label: 'A short form: your name, what you need, and a signature.',
          set: { 'a08-form': 'plain' },
          then: [
            N('It fits on one page, and it is clear. A child could fill it in in a minute.'),
            P(
              'They will never accept this. Nobody in here has ever seen anything so sensible.',
              'think',
            ),
          ],
        },
      ],
    ),
    sc(
      'a08-09-form-done',
      [
        N(
          'Pupus, sighing, finds a sheet of papyrus in his toga. You copy the form out fair, and Asterix straightens his helmet.',
        ),
        N(
          '“Fair copy” means a neat, final copy, with no mistakes. It has nothing to do with being fair, or with a fair full of rides.',
        ),
      ],
      [
        ak(
          'literacy',
          'words with more than one meaning: fair',
          1,
          [
            N(
              '“Fair” can mean just and equal, neat and clean, or a funfair. In “fair copy”, which meaning is it?',
            ),
          ],
          [
            opt(
              'Neat and clean',
              [N('Yes. A fair copy is a neat, final version, written out carefully.')],
              true,
            ),
            opt('Just and equal', [
              N(
                'That is one meaning of fair, but here it means neat. The context, “copy out”, is the clue.',
              ),
            ]),
            opt('A funfair', [
              N(
                'That is another meaning, but a funfair does not copy anything out. “Fair copy” is a neat copy.',
              ),
            ]),
          ],
          'Used context to pick the right meaning of a multiple-meaning word.',
          'L.3.4',
        ),
      ],
    ),
    sc(
      'a08-09-a39',
      [
        A('Good morning. I would like Permit A39, please. As set out in the new circular.'),
        CL('A39? There is no A39. There is A38.', 'shock'),
        A('Not since the new circular. Have you not had it? Everybody else has.'),
        N(
          'The clerk goes pale and turns to the clerk behind him, who turns to the clerk behind her. A whisper runs up the stairs.',
        ),
        N(
          'You slide your form across the counter. The clerk stamps it out of habit, and passes it on.',
        ),
        N('Within a minute, every clerk in the building is running, and papers are flying.'),
        N(
          'A bell rings at the top of the building. A door opens on the highest landing, and a man in a purple-edged toga looks down.',
        ),
      ],
      [
        ak(
          'social-studies',
          'honesty, and tricking an unfair system',
          6,
          [
            N(
              'Asterix invents Permit A39 to get past a building that seems unfair. Is it okay to trick a system that is not fair? Where would you draw the line?',
            ),
          ],
          [
            opt('Yes, if nobody is hurt and the system is unfair', [
              N(
                'A fair answer. Many people feel that a harmless trick on an unfair system is different from lying to a friend. You still might think about who else it affects.',
              ),
            ]),
            opt('No, honesty matters whatever the system is', [
              N(
                'A fair answer. Some people keep to honesty always, because trust is hard to repair once it is broken.',
              ),
            ]),
            opt('It depends on the cost, and who pays it', [
              N(
                'A fair answer. If the clerks only lose an afternoon, that is different from if someone loses their home. The cost matters.',
              ),
            ]),
          ],
          'Thought about honesty and fairness when a system seems unfair.',
          'D2.Civ.8.K-2',
        ),
      ],
    ),
    sc(
      'a08-09-a39-done',
      [
        PF(
          'Who is responsible for this? What do you want? Whatever it is, take it, and go, and let us have our building back.',
          'angry',
        ),
        A('Permit A38, please.'),
        N('Asterix says “please”, even to a furious prefect on a stair.'),
      ],
      [
        ak(
          'sel',
          'staying polite when someone else is angry',
          2,
          [N('The prefect is angry, and Asterix stays polite. Why might that be a good idea?')],
          [
            opt(
              'Politeness keeps things calm, so people listen',
              [
                N(
                  'Yes. A calm, polite voice makes it easier for everyone to think. It does not mean giving in.',
                ),
              ],
              true,
            ),
            opt('It means he is afraid', [
              N('Not at all. Staying polite when someone else is angry usually takes strength.'),
            ]),
            opt('It is just a trick', [
              N(
                'It might work as one. But the real reason to be polite is that it helps everyone stay calm and be heard.',
              ),
            ]),
          ],
          'Explained why staying polite helps when someone else is angry.',
          'CASEL: Relationship skills',
        ),
      ],
    ),
    sc(
      'a08-09-complete',
      [
        N(
          'The prefect stamps a small grey square of papyrus without reading it, and lets it flutter down the stairwell to you.',
        ),
        N(
          'It says PERMIT A38 in very large letters. In Roman numerals, it would be XXXVIII: thirty and eight.',
        ),
        P(
          'In the whole history of the building, nobody has ever got one. I did not think it was real.',
          'shock',
        ),
        N('You scratch an eighth mark on the tablet: VIII, which is V and III, five and three.'),
        O('That was the best one. Can we do that one again?', 'happy'),
        A('Never, Obelix. Never, ever again.'),
      ],
      [
        nt(
          'maths',
          'VIII is eight; building bigger numerals like XXXVIII',
          3,
          [
            P(
              'VIII is V and III: five and three make eight. The usual rule is never more than three of a symbol in a row, so next comes IX.',
            ),
            P(
              'For XXXVIII, add up the parts: X and X and X is thirty, then VIII is eight. Thirty and eight make thirty-eight.',
            ),
          ],
          'Read VIII as 5 + 3 = 8 and XXXVIII as 30 + 8 = 38, and learned the three-in-a-row rule.',
          '2.OA.A.1',
        ),
      ],
    ),
  ],
  [
    gloss(
      'bureaucracy',
      'A system run by officials, with many rules, forms and offices.',
      'a08-09-door',
    ),
    gloss('circular', 'An official notice sent round to many people.', 'a08-09-a39'),
  ],
);

// ================================================================== A8-10 The Crocodile Ravine
const Q10 = quest(
  'a08-10',
  'The Crocodile Ravine',
  {
    'a08-10-s1': {
      goal: 'Walk to the edge of the ravine and look for the rope.',
      hint: 'Stand at the post on this side. Look carefully across to the other post.',
    },
    'a08-10-s2': {
      goal: 'Find another way across.',
      hint: 'Dogmatix will not let Obelix pull up a living tree. Look along the edge for one that has already fallen.',
    },
  },
  [
    sc(
      'a08-10-edge',
      [
        N(
          'Task nine is a deep, narrow ravine with a river at the bottom. In the river there are a number of crocodiles, all looking up.',
        ),
        N(
          'There is a post on this side, and a post on the far side. Between them, there is nothing at all.',
        ),
        P(
          'The task is to cross on the magic rope. It is invisible. Only the worthy can see it.',
          'think',
        ),
        A('Can you see it?'),
        P('I am an observer. I am not required to see anything.'),
        N(
          'You throw a pebble out from the post. It falls straight down, past where a rope would be, and a crocodile catches it.',
        ),
      ],
      [
        ak(
          'science',
          'gravity pulls things down',
          5,
          [N('The pebble fell straight down, and no rope held it up. What force pulled it down?')],
          [
            opt(
              'Gravity',
              [
                N(
                  'Yes. Gravity pulls everything toward the ground. Without a rope, or anything else holding it up, the pebble falls.',
                ),
              ],
              true,
            ),
            opt('The wind', [
              N(
                'Wind can push light things sideways, but the pebble fell straight down. That is gravity.',
              ),
            ]),
            opt('Magic', [
              N(
                'It is a good story, but the real reason is gravity, which pulls all objects toward the Earth.',
              ),
            ]),
          ],
          'Identified gravity as the force pulling the pebble down.',
          '3-PS2-1',
        ),
      ],
      [
        {
          id: 'pebble',
          label: '“There’s no rope.”',
          then: [
            P('There is a rope. It is simply very, very good at being invisible.'),
            A('So is a hole.'),
          ],
        },
        {
          id: 'pupus',
          label: '“Mr Pupus, would you show us how, first?”',
          then: [
            P('I… The observer must not interfere.', 'shock'),
            N('Pupus takes three firm steps away from the edge, to observe better.'),
          ],
        },
      ],
    ),
    sc(
      'a08-10-log',
      [
        O('I will make a bridge. I will pull up a tree.', 'happy'),
        N(
          'He puts his arms round the nearest oak. Dogmatix gives a howl of real grief, and Obelix lets go at once.',
        ),
        O('Sorry, Dogmatix. I forgot. Not that one.', 'sad'),
        N('Your Nubbin sits beside Dogmatix, leaning on him, until his ears come back up.'),
        N(
          'You walk along the edge, looking. A little way off, a huge old pine lies dead on its side, long since fallen.',
        ),
        Y('This one. It fell on its own.'),
        N(
          'Obelix gives it one punch at the root end. It slides, swings, and drops with a crash across the ravine: a perfect bridge.',
        ),
        N('The crocodiles, below, look at each other with what seems to be disappointment.'),
      ],
      [
        ak(
          'science',
          'comparing solutions to a problem',
          6,
          [
            N(
              'Three ways to cross: an invisible rope, pulling up a living tree, or using a fallen tree. Which is best, and why?',
            ),
          ],
          [
            opt(
              'The fallen tree: it is real, strong and harms nothing',
              [
                N(
                  'Yes. A good solution works, is safe, and does not cost something else. The fallen tree wins on all three.',
                ),
              ],
              true,
            ),
            opt('The invisible rope, because it is free', [
              N(
                'It is free, but it does not exist, so nobody can cross on it. A solution has to actually work.',
              ),
            ]),
            opt('Pulling up a living tree, because it is fastest', [
              N(
                'It is quick, but it harms a living tree, and it upsets Dogmatix. A good solution looks at the cost too.',
              ),
            ]),
          ],
          'Compared three solutions and chose the one that works and does least harm.',
          '3-5-ETS1-2',
        ),
        ak(
          'sel',
          'doing what is easy versus what a friend cares about',
          3,
          [
            N(
              'Obelix forgot Dogmatix cares about trees. When something is easy for you but upsets a friend, how do you decide what to do?',
            ),
          ],
          [
            opt('Stop and ask what matters to the friend', [
              N(
                'A fair answer. Asking first shows respect, and Obelix does stop at once, which was a good start.',
              ),
            ]),
            opt('Do the easy thing, then say sorry', [
              N(
                'A fair answer. Sorry matters. But asking first might spare the hurt, and the sorry.',
              ),
            ]),
            opt('Look for a way that works for both', [
              N(
                'A fair answer. That is what you did, with the fallen pine. Sometimes there is a solution that nobody has to give up anything for.',
              ),
            ]),
          ],
          'Thought about balancing what is easy with what a friend cares about.',
          'CASEL: Social awareness',
        ),
      ],
      [
        {
          id: 'cross',
          label: 'Cross first, carrying the Nubbin.',
          then: [
            N(
              'The trunk is wide as a road. Dogmatix trots across beside you with his tail up, the tree business forgiven.',
              'happy',
            ),
          ],
        },
        {
          id: 'pupus',
          label: 'Offer Pupus your hand.',
          then: [
            P('I do not need… thank you.', 'soft'),
            N(
              'He takes it, all the way across, and does not let go until his sandals are on grass.',
            ),
          ],
        },
      ],
    ),
    sc(
      'a08-10-complete',
      [
        P(
          'That is not the magic rope. Technically, you have not crossed on the magic rope.',
          'think',
        ),
        A('Technically, there is not one.'),
        N(
          'Pupus opens his mouth, closes it, and looks at the empty air between the posts for a long moment.',
        ),
        P('Fine. Fine. Write it down.'),
        N(
          'You scratch a ninth mark: IX, which is X, ten, with an I in front. One less than ten is nine.',
        ),
      ],
      [
        nt(
          'maths',
          'IX is nine: one before ten',
          4,
          [
            P(
              'Here is the subtraction trick again. I before X means ten minus one, so nine. It is the same idea as IV, which is five minus one.',
            ),
            P(
              'Only I, X and C are ever put before a bigger numeral to subtract. So you will never see VX for five. It is just V.',
            ),
          ],
          'Learned that IX is 10 − 1 = 9, and that only some numerals can be subtracted.',
          '2.OA.A.1',
        ),
      ],
    ),
  ],
  [
    gloss('ravine', 'A deep, narrow valley with steep sides.', 'a08-10-edge'),
    gloss('observer', 'Someone who watches without joining in.', 'a08-10-edge'),
  ],
);

// ================================================================== A8-11 The Old Man of the Mountain
const Q11 = quest(
  'a08-11',
  'The Old Man of the Mountain',
  {
    'a08-11-s1': {
      goal: 'Climb to the top of the mountain.',
      hint: 'Take the goat path. It is longer, but the goats know what they are doing.',
    },
    'a08-11-s2': {
      goal: 'Answer the Old Man’s riddle.',
      hint: 'Listen to every clue. Then look around the cave.',
    },
  },
  [
    sc(
      'a08-11-climb',
      [
        N(
          'Task ten is a mountain with its top in the clouds. A narrow path winds up it in loops, and so do some goats.',
        ),
        P(
          'At the top lives the Old Man of the Mountain, who is very wise. He will ask you a riddle. You must answer it.',
        ),
        O('What if we do not know?'),
        P(
          'Then you stay up there until you do. Some people have been up there since they were young.',
          'think',
        ),
        N('The path is steep. Obelix carries Dogmatix, and Pupus, and after a while, the goats.'),
        N(
          'Near the top, the air is thin and cold, and there is a smell of something faintly perfumed, like a fancy bathhouse.',
        ),
      ],
      [
        nt(
          'science',
          'why it is colder high up a mountain, and why paths zigzag',
          5,
          [
            N(
              'Air gets thinner and cooler the higher you go. As a rough guide, it is about 6 degrees Celsius colder for every 1,000 metres you climb.',
            ),
            N(
              'So if the valley is 20 °C (68 °F), a spot 1,000 metres higher is about 14 °C (57 °F). A zigzag path makes a steep slope gentler.',
            ),
          ],
          'Learned that it gets colder with height (about 6 °C per 1,000 m), and that zigzag paths make steep slopes gentler.',
          '4.MD.A.2',
        ),
      ],
      [
        {
          id: 'view',
          label: 'Stop and look at the view.',
          then: [
            N(
              'All Gaul is spread out under the clouds, green and brown and silver with rivers. Somewhere down there is the village.',
              'soft',
            ),
          ],
        },
        {
          id: 'on',
          label: 'Keep going: no stopping on mountains.',
          then: [A('Good thinking. If I stop, I will never start again.')],
        },
      ],
    ),
    sc(
      'a08-11-climb-done',
      [
        N(
          'At the summit, by a cave, an ancient man with a beard down to his knees sits cross-legged on a rock, eyes closed.',
        ),
        N(
          'Your legs are wobbly after the climb, and your Nubbin is panting. Obelix offers it a ride on his shoulder.',
        ),
      ],
      [
        ak(
          'sel',
          'knowing when to ask for help',
          1,
          [
            N(
              'You are very tired, and you still have to answer the riddle. What is a good thing to do?',
            ),
          ],
          [
            opt(
              'Rest a moment, and ask a friend to help carry things',
              [N('Yes. Resting and asking for help are signs of good judgement, not weakness.')],
              true,
            ),
            opt('Pretend you are fine, so nobody worries', [
              N(
                'That is a common feeling. But being honest about being tired lets friends help, and lets you think more clearly.',
              ),
            ]),
            opt('Give up and go back down', [
              N('You have come most of the way. A rest and a bit of help will get you there.'),
            ]),
          ],
          'Chose to rest and ask for help when tired.',
          'CASEL: Self-management',
        ),
      ],
    ),
    sc(
      'a08-11-riddle',
      [
        OM(
          'Travellers. You have climbed far. Hear now the great riddle, and answer, or remain.',
          'think',
        ),
        OM(
          'What is white as the snows, yet melts in your hands? What is soft as a lamb, and smells of the meadows?',
        ),
        OM(
          'What leaves you cleaner than the river, and costs only two copper coins, or three for five?',
        ),
        N(
          'Behind the Old Man, in his cave, are stacks of small white cakes, wrapped in leaves, each stamped with his face.',
        ),
        A('Is it… soap?'),
        OM(
          'It is the Old Man of the Mountain’s Own Mountain Soap! Made with goat’s milk! Gentle on the beard!',
          'happy',
        ),
      ],
      [
        ak(
          'maths',
          'comparing prices to find the better deal',
          2,
          [
            N(
              'One soap costs 2 coins, or 3 cost 5 coins. How many coins do you save by buying 3 for 5?',
            ),
          ],
          [
            opt(
              '1 coin',
              [
                N(
                  'Yes. Three single soaps cost 3 times 2, which is 6 coins. Three for five costs 5, so you save 1 coin.',
                ),
              ],
              true,
            ),
            opt('2 coins', [
              N(
                'Three single soaps cost 6 coins, and the deal costs 5. The difference is 6 minus 5, which is 1 coin.',
              ),
            ]),
            opt('No coins', [
              N(
                'Check the sums. Three at 2 coins each is 6 coins. The deal is 5 coins, so you do save one.',
              ),
            ]),
          ],
          'Compared unit price and bundle price: 3 × 2 = 6, against 5, saves 1.',
          '3.OA.D.8',
        ),
        ak(
          'literacy',
          'adverts and persuasion',
          5,
          [
            N(
              'The “riddle” turned out to be an advert. Is an advert that pretends to be a riddle honest? How could you tell what an advert wants?',
            ),
          ],
          [
            opt('It is clever, but not fully honest', [
              N(
                'A fair answer. Hiding what something is for can feel like a trick. Good adverts say plainly what they are.',
              ),
            ]),
            opt('It is fine, as long as the soap is good', [
              N(
                'A fair answer. If the soap is real and the price is fair, nobody is cheated. It is still worth noticing when someone is selling to you.',
              ),
            ]),
            opt('Check who gains if you believe it', [
              N(
                'A fair answer. Asking who benefits is one of the best questions to ask about any advert.',
              ),
            ]),
          ],
          'Thought about how adverts persuade, and how to spot what they want.',
          'RL.3.6',
        ),
      ],
      [
        {
          id: 'buy',
          label: 'Buy three for five.',
          then: [
            OM(
              'A wise traveller! I shall throw in a fourth, because you have honest eyes.',
              'happy',
            ),
          ],
        },
        {
          id: 'riddle',
          label: '“That wasn’t a riddle. That was an advert.”',
          then: [OM('All the best riddles are, in the end. Have a free sample.', 'happy')],
        },
      ],
    ),
    sc(
      'a08-11-complete',
      [
        N(
          'The way down is quicker. You smell of goat’s milk and meadow flowers, and so, to his great dismay, does Obelix.',
        ),
        O('I smell like a lamb. Asterix, I smell like a lamb.', 'sad'),
        A('You smell lovely.'),
        N('You scratch a tenth mark: a single X, two strokes crossed, the Roman ten.'),
        P('Two more. Only two. I have stopped knowing whether I want you to win.', 'think'),
      ],
      [
        nt(
          'maths',
          'X is ten, and where the symbol may come from',
          3,
          [
            P(
              'X is ten. Nobody is sure where it came from. One idea is tally sticks, where every tenth notch was marked with a cross.',
            ),
            P(
              'Another idea is two Vs joined point to point. V is five, and five and five make ten. A neat sum, if it is true.',
            ),
          ],
          'Learned that X is ten, and two ideas about its origin, one of them two Vs (5 + 5).',
          '2.OA.A.1',
        ),
      ],
    ),
  ],
  [
    gloss('summit', 'The very top of a mountain.', 'a08-11-climb-done'),
    gloss('copper', 'A reddish metal, used long ago for cheap coins.', 'a08-11-riddle'),
  ],
);

// ================================================================== A8-12 The Haunted Plain
const Q12 = quest(
  'a08-12',
  'The Haunted Plain',
  {
    'a08-12-s1': {
      goal: 'Wait on the plain for midnight.',
      hint: 'Set up camp by the standing stone. Stay awake until the moon is overhead.',
    },
    'a08-12-s2': {
      goal: 'Complain to the ghosts until they leave.',
      hint: 'Talk to the centurion at the front. Be specific. Ghosts hate specifics.',
    },
  },
  [
    sc(
      'a08-12-camp',
      [
        N(
          'Task eleven is a wide, flat plain under a big moon, with one standing stone and a lot of mist.',
        ),
        P(
          'Spend one night on the Haunted Plain. At midnight the ghosts come. Nobody has ever stayed till morning.',
          'think',
        ),
        N(
          'You make a small fire by the stone. Obelix unwraps the last of Mannekenpix’s fried potatoes and shares them, which is love.',
        ),
        N(
          'Dogmatix and your Nubbin curl up in the crook of Obelix’s arm. Asterix sharpens a stick for no reason.',
        ),
        N(
          'The moon climbs and the mist thickens. Very far off, something clanks, like armour being carried by someone who is not there.',
        ),
      ],
      [
        nt(
          'science',
          'what mist is, and why it forms at night',
          4,
          [
            N(
              'Mist is tiny drops of water floating in the air. When damp air cools at night, its invisible vapour turns into tiny drops.',
            ),
            N(
              'That change is called condensation. It is the same reason a cold glass of water gets wet on the outside on a warm day.',
            ),
          ],
          'Learned that mist is tiny water drops formed when damp air cools (condensation).',
        ),
      ],
      [
        {
          id: 'story',
          label: 'Tell a story to pass the time.',
          then: [
            N(
              'You tell them about the Grove, and the hill, and the pond. Obelix asks if there are boar, and you say no, gently.',
              'soft',
            ),
          ],
        },
        {
          id: 'watch',
          label: 'Keep watch in silence.',
          then: [
            N(
              'You watch the mist. Pupus watches it too, sitting very close to you, as if by accident.',
            ),
          ],
        },
      ],
    ),
    sc(
      'a08-12-camp-done',
      [
        N(
          'The mist parts. Out of it, glowing faintly green, march two lines of ghostly legionaries, chains clanking, moaning on the beat.',
        ),
        P('A whole legion, with a centurion at the front. Or what is left of them.', 'shock'),
        P('Quite a lot of ghosts, really. I would count them, but I would rather not.'),
      ],
      [
        nt(
          'social-studies',
          'how a Roman legion was organised',
          1,
          [
            P(
              'Roman armies were very well organised. A legion had thousands of soldiers, split into smaller groups called centuries.',
            ),
            P(
              'Despite the name, a century was only about eighty men, and its leader was a centurion. “Century” and “centurion” both come from the Latin for a hundred.',
            ),
          ],
          'Learned that a Roman legion was divided into centuries led by centurions, and that those words come from the Latin for “hundred”.',
          'D2.His.2.K-2',
        ),
      ],
    ),
    sc(
      'a08-12-ghosts',
      [
        GH('Woooo. We are the lost legion. We march for ever. Fear us. Woooo.', 'angry'),
        O('Excuse me. Some of us are trying to sleep.', 'angry'),
        GH('We… we are ghosts. We are meant to be frightening.', 'shock'),
        A('You are very loud. And your chains need oiling. And you are standing in our potatoes.'),
        GH('We are not standing in anything. We are ghosts.'),
        O('Your sheets are grubby, too. When did you last wash those?'),
        N(
          'The centurion looks down at his robe. It is, it must be said, a bit grey round the hem.',
          'think',
        ),
      ],
      [
        ak(
          'literacy',
          'specific, polite complaints work better',
          6,
          [
            N(
              'Asterix and Obelix name exactly what is wrong: the noise, the chains, the potatoes. Why does being specific work better than just saying “go away”?',
            ),
          ],
          [
            opt(
              'It shows exactly what to fix',
              [
                N(
                  'Yes. A specific complaint tells the other person what to change, and it feels fairer than a general insult.',
                ),
              ],
              true,
            ),
            opt('It makes the ghosts feel bad', [
              N(
                'It can sting a little. But a clear, polite complaint is kinder than a rude one, and more likely to work.',
              ),
            ]),
            opt('It takes longer, so it is annoying', [
              N(
                'It takes a bit longer, but it gets results. “Go away” gives the ghosts nothing to act on.',
              ),
            ]),
          ],
          'Learned that clear, specific, polite complaints work better than vague, rude ones.',
          'RL.4.3',
        ),
      ],
      [
        {
          id: 'noise',
          label: '“And the moaning is out of tune.”',
          then: [
            GH('It is NOT out of tune. Marcus. Marcus, are we out of tune?', 'angry'),
            N('Marcus, at the back, does not answer, which is an answer.'),
          ],
        },
        {
          id: 'permit',
          label: '“Have you got a permit for this?”',
          then: [
            GH('A permit? For haunting? I do not think we ever applied.', 'shock'),
            N('A ripple of worry goes down the ghostly lines.'),
          ],
        },
      ],
    ),
    sc(
      'a08-12-ghosts-done',
      [
        GH(
          'Well. If we are not wanted. We know when we are not wanted. Come on, lads. We will go and haunt somewhere grateful.',
          'sad',
        ),
        N(
          'They shuffle off into the mist, sulking, chains dragging. One of them, at the back, looks round at your tablet as if it were a summons.',
        ),
      ],
      [
        ak(
          'sel',
          'complaining without taking away someone’s dignity',
          1,
          [
            N(
              'The ghosts left feeling unwanted. Could you have complained and still let them keep their dignity? How?',
            ),
          ],
          [
            opt('Ask them to haunt somewhere else, kindly', [
              N(
                'A fair answer. Saying what you need, without insulting them, lets them leave with their heads high.',
              ),
            ]),
            opt('It was their job to be scary, so they should leave', [
              N(
                'A fair answer. They did want to frighten people. It might still have been kind to thank them for trying.',
              ),
            ]),
            opt('Offer them a potato and a seat', [
              N(
                'A fair answer. Making friends of a problem is sometimes the surest way to solve it.',
              ),
            ]),
          ],
          'Thought about complaining kindly, so that others keep their dignity.',
          'CASEL: Relationship skills',
        ),
      ],
    ),
    sc(
      'a08-12-complete',
      [
        N(
          'Dawn comes up pink over the plain. The mist has gone, and so have the ghosts, and the potatoes, which nobody can explain.',
        ),
        N('You scratch an eleventh mark on the tablet: XI, which is X and I, ten and one.'),
        P('One left. The last one is in Rome. Caesar wants to see this himself.', 'think'),
        A('Good. I want to see him see it.'),
        N(
          'Pupus does not argue. You notice that he has, at some point in the night, started walking on your side of the fire.',
          'soft',
        ),
      ],
      [
        nt(
          'maths',
          'XI is eleven',
          1,
          [
            P(
              'X is ten, and I after it adds one. Ten and one make eleven. Eleven out of twelve marks are done.',
            ),
            P('The twelfth will be XII, which is X, I and I. Ten plus one plus one.'),
          ],
          'Read XI as 10 + 1 = 11, and looked ahead to XII as 10 + 1 + 1.',
          '2.OA.A.1',
        ),
      ],
    ),
  ],
  [
    gloss(
      'legion',
      'A big group of Roman soldiers, about five thousand strong.',
      'a08-12-camp-done',
    ),
    gloss(
      'centurion',
      'A Roman officer who led a group of about eighty soldiers.',
      'a08-12-camp-done',
    ),
  ],
);

// ================================================================== A8-13 The Circus Maximus
const Q13 = quest(
  'a08-13',
  'The Circus Maximus',
  {
    'a08-13-s1': {
      goal: 'Go with the village to Rome.',
      hint: 'The whole village is coming. Help the chief onto his shield; mind his feet.',
    },
    'a08-13-s2': {
      goal: 'Referee the last task from the arena’s edge.',
      hint: 'Stand at the gate with your tablet. Watch the lions, and then watch the crowd.',
    },
  },
  [
    sc(
      'a08-13-rome',
      [
        N(
          'For the last task the whole village comes to Rome. Caesar has ordered it: the Gauls, all of them, in the Circus Maximus.',
        ),
        N(
          'Rome is enormous, white and gold and full of steps. The village walks through it in a long, loud, curious line.',
        ),
        N(
          'The chief is carried on his shield. Getafix walks with his hands behind his back, looking at the aqueducts with interest.',
        ),
        BD('Shall I sing something, for the journey? Something to make Rome weep?'),
        V('No.'),
        N(
          'Under the huge arena, the village is shown into a stone room with a gate at one end. Through the gate, you hear the crowd.',
        ),
      ],
      [
        nt(
          'social-studies',
          'history and story: what the real Circus Maximus was',
          5,
          [
            N(
              'A note from Nova’s atlas: the real Circus Maximus in Rome was a huge racing track, mostly for chariot races, long and narrow, with seats for a great crowd.',
            ),
            N(
              'Wild-animal shows were held there sometimes too. Later the Colosseum, built over a hundred years after Caesar, became the famous place for them.',
            ),
          ],
          'Learned that the real Circus Maximus was mainly a chariot-racing track that sometimes held animal shows, and that the Colosseum came later.',
          'D2.His.2.K-2',
        ),
        nt(
          'science',
          'how aqueducts move water',
          2,
          [
            G(
              'Look at those tall arches. They are aqueducts, bridges that carry water into the city from far away.',
            ),
            G(
              'They work with gravity. The channel slopes very slightly downhill, a little at a time, so the water flows all the way.',
            ),
          ],
          'Learned that Roman aqueducts used a gentle downhill slope and gravity to carry water.',
          '3-PS2-1',
        ),
      ],
      [
        {
          id: 'gate',
          label: 'Look through the gate.',
          then: [
            N(
              'Sand, and sun, and tier on tier of faces. On a balcony at the top, a man in purple and a laurel crown.',
            ),
          ],
        },
        {
          id: 'pupus',
          label: 'Ask Pupus if he is all right.',
          then: [
            P(
              'I do not know any more. I have watched you for eleven tasks. I think I would like you to win.',
              'soft',
            ),
          ],
        },
      ],
    ),
    sc(
      'a08-13-arena',
      [
        N(
          'The gate goes up, the village walks out onto the sand, and the crowd roars. Another gate goes up, and the lions come out.',
        ),
        N(
          'The first lion bounds at Asterix, and Asterix catches it under the front legs and dances with it, in a slow, stately circle.',
        ),
        N(
          'Obelix rubs the second lion behind the ears until it rolls on its back. Gladiators run out; the chief invites them to dinner.',
        ),
        N(
          'Someone lights a fire in the middle of the sand, and someone else has brought the boar. Somehow, there is a feast.',
        ),
        N(
          'High in the stands, a white figure is cheering: Asbestos. Beside him are Verses, Cilindric, a floury Mannekenpix, and Iris, a person again.',
        ),
        N(
          'The crowd is not booing the Gauls any more. It is coming down the steps to join the party.',
        ),
      ],
      [
        ak(
          'literacy',
          'Latin numbers and the English words from them',
          1,
          [
            P(
              'Count the lions in Latin: unus, duo, tres, quattuor, quinque. Which English word comes from “tres”, three?',
            ),
          ],
          [
            opt(
              'Triple',
              [N('Yes. “Tri-” and “tres” both mean three: triple, triangle, tricycle.')],
              true,
            ),
            opt('Duet', [
              N('A duet has two players, and “duo” means two. “Triple” comes from “tres”, three.'),
            ]),
            opt('Unit', [
              N('“Unit” comes from “unus”, one. The word from “tres”, three, is “triple”.'),
            ]),
          ],
          'Counted in Latin to five and linked “tres” to English words like triple.',
          'L.3.4',
        ),
        ak(
          'sel',
          'how a shared meal can turn rivals into friends',
          5,
          [
            N(
              'The crowd that came to see a fight ends up at a party. Why does sharing food and laughter change how people feel about each other?',
            ),
          ],
          [
            opt('It makes people feel safe and welcome', [
              N(
                'A fair answer. When people feel safe, they stop defending themselves and start noticing each other.',
              ),
            ]),
            opt('It gives people something to enjoy together', [
              N(
                'A fair answer. A shared good time creates memories, and it is hard to stay angry at someone you have laughed with.',
              ),
            ]),
            opt('It only works in stories', [
              N(
                'A fair answer. Real life is harder. But many peace talks and families do begin with sharing a meal.',
              ),
            ]),
          ],
          'Thought about how sharing a meal and laughter can build friendship.',
          'CASEL: Relationship skills',
        ),
      ],
    ),
    sc(
      'a08-13-arena-done',
      [
        N(
          'Up on the balcony, Caesar stands, and the arena goes quiet. He looks down at the feast in his circus for a long moment.',
        ),
        CS(
          'Well. That is the twelfth. I suppose I had better be a good loser. It will be a new experience.',
          'think',
        ),
      ],
      [
        ak(
          'literacy',
          'what a character’s words reveal',
          1,
          [
            N(
              'Caesar says being a good loser “will be a new experience”. What does that line tell you about him?',
            ),
          ],
          [
            opt(
              'He hardly ever loses, and he knows it',
              [
                N(
                  'Yes. It is a joke at his own expense. Caesar is proud, but he can laugh at himself, and that makes him a good sport.',
                ),
              ],
              true,
            ),
            opt('He has lost many times', [
              N(
                'If he had lost often, it would not be new. The joke is that he almost never loses.',
              ),
            ]),
            opt('He is furious', [
              N(
                'He may be cross inside, but his words are dry and polite. He is choosing to lose well.',
              ),
            ]),
          ],
          'Worked out a character’s traits from a line of dialogue, and saw how he chooses to lose well.',
          'RL.3.3',
        ),
      ],
    ),
    sc(
      'a08-13-complete',
      [
        CS(
          'Gauls, you have done the twelve tasks of Hercules, and a few of your own. Rome declares you gods. Rome hopes you will be quiet ones.',
        ),
        V('Thank you, Caesar! Come to dinner. Bring a boar.', 'happy'),
        CS('I think not. But I shall look at your little dot on the map with… respect.'),
        N(
          'Pupus climbs up beside you, takes the wax tablet, and initials the last mark with a flourish: XII, which is X, I and I.',
        ),
        P(
          'Referee. Your scoring was impartial, generous, and occasionally very strange. I would observe you again.',
          'soft',
        ),
      ],
      [
        ak(
          'maths',
          'reading and adding a Roman numeral',
          3,
          [N('The last mark is XII. Adding its parts, which number does it stand for?')],
          [
            opt(
              'Twelve: 10 + 1 + 1',
              [N('Yes. X is ten, then two I strokes add two. Ten, one and one make twelve.')],
              true,
            ),
            opt('Eleven: 10 + 1', [
              N('That is XI. XII has two strokes after the X, so ten plus one plus one is twelve.'),
            ]),
            opt('Eight: 10 − 2', [
              N(
                'Strokes after a bigger numeral are added, not taken away. Ten plus two is twelve.',
              ),
            ]),
          ],
          'Read XII as 10 + 1 + 1 = 12.',
          '2.OA.A.1',
        ),
      ],
    ),
  ],
  [
    gloss(
      'aqueduct',
      'A bridge-like structure that carries water, often over a long distance.',
      'a08-13-rome',
    ),
    gloss(
      'arena',
      'A big open space with seats all round it, for shows and contests.',
      'a08-13-rome',
    ),
  ],
);

// ================================================================== A8-14 The Banquet
const Q14 = quest(
  'a08-14',
  'The Banquet',
  {
    'a08-14-s1': {
      goal: 'Help set up the banquet in the village square.',
      hint: 'Carry the boar to the spits and the benches to the tables. Then find the bard.',
    },
    'a08-14-s2': {
      goal: 'Watch the village deal with the bard.',
      hint: 'Find your form from task VIII in your satchel, and give it to Asterix.',
    },
  },
  [
    sc(
      'a08-14-square',
      [
        N(
          'Back in the village, under the stars, the square is full of long tables. Every spit has a boar on it, turning.',
        ),
        V(
          'Tonight, we feast! Twelve tasks, twelve boars! Thirteen, for the referee. Fourteen, for Obelix. Well, fifteen.',
          'happy',
        ),
        N(
          'Pupus has come too, in a borrowed tunic, looking pleased and out of place. Nobody seems to mind that he is Roman tonight.',
        ),
        P('Amicus is Latin for friend. I should like to be yours, if a Roman is allowed.'),
        N(
          'Then, from a hut at the edge of the square, comes the sound of somebody tuning a lyre. It goes on for some time.',
        ),
        BD(
          'Friends! To honour our heroes, I have written a new song. Forty-two verses, one for each…',
          'happy',
        ),
        N(
          'Every head in the village turns, and nobody says anything. Asterix looks at Obelix, and Obelix looks at you.',
        ),
      ],
      [
        ak(
          'literacy',
          'Latin roots: amicus',
          3,
          [N('“Amicus” is Latin for friend. Which English word do you think comes from it?')],
          [
            opt(
              'Amicable, meaning friendly',
              [N('Yes. “Amicable” means friendly and peaceful, as in an amicable chat.')],
              true,
            ),
            opt('Amazing', [
              N(
                '“Amazing” has a different history. “Amicable”, meaning friendly, comes from “amicus”.',
              ),
            ]),
            opt('Ambulance', [
              N(
                '“Ambulance” comes from a Latin word for walking. “Amicable” comes from “amicus”, friend.',
              ),
            ]),
          ],
          'Linked the Latin “amicus” (friend) to the English word “amicable”.',
          'L.3.4',
        ),
      ],
      [
        {
          id: 'let',
          label: '“Let him sing one verse.”',
          then: [
            BD('One verse! The first verse is the overture, which is in seven parts…', 'happy'),
            N('The village quietly starts looking round for something to tie him up with.'),
          ],
        },
        {
          id: 'rope',
          label: 'Look round for some rope.',
          then: [
            N(
              'There is no rope; somebody used it on a cart. The village starts looking round for something else to tie him up with.',
            ),
          ],
        },
      ],
    ),
    sc(
      'a08-14-square-done',
      [
        N(
          'The lyre goes on being tuned. Each string, when plucked, wobbles back and forth, and the wobble makes the note.',
        ),
        A('Referee. You have not still got that form from the Place That Sends You Mad, have you?'),
      ],
      [
        nt(
          'science',
          'sound, vibration and pitch: strings',
          0,
          [
            N(
              'A plucked string vibrates, moving to and fro very fast. That vibration shakes the air, and our ears hear it as sound.',
            ),
            N(
              'A shorter, tighter or thinner string vibrates faster and makes a higher note. A long, loose, thick string makes a low one.',
            ),
          ],
          'Learned that plucked strings vibrate to make sound, and that shorter or tighter strings give higher notes.',
          '4-PS3-2',
        ),
      ],
    ),
    sc(
      'a08-14-tie',
      [
        N(
          'You take the form out of your satchel, where it has been since the porter handed it back. It is covered in stamps.',
        ),
        A('That might do nicely.'),
        BD('What? What are you doing? I have not even started the overture!', 'shock'),
        G(
          'Hold still, Cacofonix. If it is long enough, it is an honour. You will be bound in official papers.',
        ),
        N('Getafix reads the form’s heading by the light of the fire, and his eyebrows go up.'),
      ],
      [
        ak(
          'maths',
          'multiplying and converting minutes',
          2,
          [
            N(
              'The bard’s song has forty-two verses. If each verse takes two minutes, how long is the whole song?',
            ),
          ],
          [
            opt(
              '84 minutes, which is 1 hour 24 minutes',
              [
                N(
                  'Yes. 42 times 2 is 84 minutes. 60 of those make an hour, which leaves 24 minutes: 1 hour 24 minutes.',
                ),
              ],
              true,
            ),
            opt('44 minutes', [
              N(
                'That adds instead of multiplying. Forty-two lots of two minutes is 42 times 2, which is 84 minutes.',
              ),
            ]),
            opt('80 minutes', [
              N(
                'Close. 40 times 2 is 80, and the other 2 verses add 4 more minutes: 84 minutes, or 1 hour 24 minutes.',
              ),
            ]),
          ],
          'Multiplied 42 × 2 = 84 minutes and converted it to 1 hour 24 minutes.',
          '3.MD.A.1',
        ),
        ak(
          'sel',
          'teasing, kindness and being heard',
          3,
          [
            N(
              'The village ties up the bard, gently, so he cannot sing. Is that teasing, or unkind? How would you want friends to handle an annoying habit of yours?',
            ),
          ],
          [
            opt('It is gentle teasing, because everyone loves him', [
              N(
                'A fair answer. Teasing can be a way of showing affection, as long as the person is in on it, and is not hurt.',
              ),
            ]),
            opt('It is unkind, because nobody listens to him', [
              N(
                'A fair answer. Feeling unheard hurts. A kinder way might be to listen to one verse, or tell him honestly how long it is.',
              ),
            ]),
            opt('Telling him honestly would be best', [
              N(
                'A fair answer. Honest and kind is hard, and it usually works better than tying anybody up.',
              ),
            ]),
          ],
          'Thought about the line between gentle teasing and unkindness, and about honest kindness.',
          'CASEL: Social awareness',
        ),
      ],
    ),
    sc(
      'a08-14-tie-done',
      [
        N(
          'The whole village gathers round to see what you wrote, back in the building of endless counters.',
        ),
        BD('Bound in official papers? I am a bard, not a book!', 'angry'),
      ],
      [
        ak(
          'literacy',
          'words with more than one meaning: bound',
          1,
          [
            N(
              'Getafix said the bard would be “bound in official papers”. Which meaning of “bound” is the joke using?',
            ),
          ],
          [
            opt(
              'Both: tied up, and made into a book',
              [
                N(
                  'Yes. A book’s pages are “bound” inside its cover, and the bard is about to be bound up in a form. Two meanings, one joke.',
                ),
              ],
              true,
            ),
            opt('Only tied up', [
              N(
                'That is one meaning. But books are “bound” too, which is why the bard says he is not a book.',
              ),
            ]),
            opt('Bound, as in a big jump', [
              N(
                'A bound can be a big leap, like a lion’s. Here, though, it means tied up, and bound like a book.',
              ),
            ]),
          ],
          'Used context to see a joke that uses two meanings of the word “bound”.',
          'L.3.4',
        ),
      ],
    ),
    sc(
      'a08-14-complete',
      [
        N(
          'Then the feast goes on until the stars wheel round. Obelix eats four boars, then asks, hopefully, about the main course.',
        ),
        G('For the referee. You have seen what it does. Use it kindly.', 'soft'),
        N(
          'Getafix gives you a tiny cauldron, no bigger than a cup, with something glimmering inside.',
        ),
        V(
          'And a helmet, with wings! And a menhir! Obelix, give the referee a menhir. A small one.',
          'happy',
        ),
        O(
          'This is my smallest one. I made it specially. It has a little face on it, look.',
          'happy',
        ),
        N(
          'Far overhead, Asterix’s javelin whistles past going east, still going. Somewhere, Verses is still following it.',
        ),
        P('Vale, referee! Will you come back? Caesar is already thinking of something.', 'soft'),
        N(
          'The map closes round you like a hand. You are in the Grove, with a cauldron, a helmet, a very small menhir, and a dog’s hair on your sleeve.',
        ),
      ],
      [
        ak(
          'literacy',
          'the theme of a story',
          7,
          [
            N(
              'Looking back at the twelve tasks: how did the heroes get through them? What do you think the story is saying?',
            ),
          ],
          [
            opt('Cleverness and kindness solve more than strength', [
              N(
                'A fair answer. Most tasks were solved by thinking, patience or being kind, and not by punching.',
              ),
            ]),
            opt('Being yourself, and being good friends, is what matters', [
              N(
                'A fair answer. Asterix and Obelix are different, and need each other. That is a theme too.',
              ),
            ]),
            opt('Silly ideas can beat serious rules', [
              N(
                'A fair answer. A silly form beat a serious building. It might also say something about how rules are made.',
              ),
            ]),
          ],
          'Thought about the theme of the twelve tasks, and gave reasons.',
          'RL.4.2',
        ),
      ],
    ),
  ],
  [
    gloss('amicable', 'Friendly, and without any quarrel.', 'a08-14-square'),
    gloss('lyre', 'A small, stringed musical instrument, like a little harp.', 'a08-14-square'),
  ],
);

// ================================================================== Banquet variants
export const EDU_A08_READER_VARIANTS: EduScene[] = [
  sc(
    'a08-14-bard-loop',
    [
      G(
        'Form 0. Application to Find Out Whether You Need This Form. Please attach a completed copy of this form.',
        'think',
      ),
      N(
        'Every clerk in the building has dutifully attached a completed copy. It unrolls down to your knees, and keeps going.',
      ),
      N(
        'There is a silence. Then the chief laughs so hard he falls off his shield, and the whole village goes with him.',
      ),
      G('It never ends. It cannot be finished. Of course: it is perfect for him.', 'happy'),
      N(
        'They wind it round Cacofonix and the oak tree seven times, and there is still some left over to tie a bow.',
      ),
      BD('This is an outrage. I shall write a song about it. In forty-two verses.', 'angry'),
      O('You cannot. Your arms are inside a form.', 'happy'),
    ],
    [
      ak(
        'maths',
        'logic: why a loop never ends',
        3,
        [
          N(
            'The form says, “Attach a completed copy of this form.” Each copy needs another copy attached. Why can it never be finished?',
          ),
        ],
        [
          opt(
            'Every copy needs another copy first',
            [
              N(
                'Yes. Each form waits for another form, which waits for another, so there is never a first one finished. That is a loop with no way out.',
              ),
            ],
            true,
          ),
          opt('The clerks are too slow', [
            N(
              'Speed is not the problem. Even the fastest clerk would be stuck, because the rule needs a finished copy before it can finish one.',
            ),
          ]),
          opt('The paper runs out', [
            N(
              'It might, but the real problem is the rule itself, which always sends you back to the start.',
            ),
          ]),
        ],
        'Reasoned about why a self-referring rule can never be completed.',
      ),
    ],
  ),
  sc(
    'a08-14-bard-boar',
    [
      G(
        'Proof That You Are Not a Boar. To be signed by a boar. And it has been, by a boar who signs with his knuckle.',
        'think',
      ),
      N(
        'Obelix goes pink with pride. Every clerk has stamped it, and somebody has added a note: “Boar to be found.”',
      ),
      V('Ha! Our referee made it! The silliest form in Gaul!', 'happy'),
      N(
        'The notes run on for pages, each asking politely after the boar. It unrolls to your knees, and keeps going.',
      ),
      N('They wind it round Cacofonix and the oak tree until only his hat shows over the top.'),
      BD('I am not a boar. I wish to state, for the record, that I am not a boar.', 'angry'),
      G('It is all right. You have it in writing now.', 'happy'),
    ],
    [
      nt(
        'social-studies',
        'seals, signatures and trust',
        2,
        [
          G(
            'Long ago, people proved a document was real with a signature or a seal. A seal was a mark pressed into soft wax, often with a ring.',
          ),
          G(
            'The Romans used seals too. A document was only trusted if the right person had marked it. That is why the form needed the boar’s mark.',
          ),
        ],
        'Heard that signatures and wax seals were used to show a document could be trusted.',
        'D2.His.2.K-2',
      ),
    ],
  ),
  sc(
    'a08-14-useful',
    [
      G('Name. What you need. Signature. One page.', 'think'),
      N(
        'Getafix reads it twice, slowly, and then he does not hand it over. He rolls it up and tucks it in his robe.',
      ),
      G(
        'This is far too good for tying up a bard. I shall file this under “Useful”. It is the only thing in that folder.',
        'happy',
      ),
      A('It did not win, though. It was too sensible to win.'),
      G('Sensible things often lose on the day. Then people use them for years.', 'soft'),
      N(
        'In the end they tie Cacofonix up with an old fishing net, which he says, through the holes, is an insult to his art.',
      ),
    ],
    [
      ak(
        'sel',
        'when a good idea does not win',
        4,
        [
          N(
            'Your sensible form did not win, but Getafix is keeping it. How do you feel when a good idea loses on the day?',
          ),
        ],
        [
          opt('A bit disappointed, but proud of it', [
            N(
              'A fair answer. Both feelings can sit together. Being proud of good work does not depend on winning.',
            ),
          ]),
          opt('Fine, because it will be useful for years', [
            N(
              'A fair answer. Getafix thinks so too. Some ideas win slowly, by being used again and again.',
            ),
          ]),
          opt('Annoyed: clear and sensible should win', [
            N(
              'A fair answer. It can feel unfair. Plain, clear writing respects the reader, even when the silly form gets the laughs.',
            ),
          ]),
        ],
        'Thought about handling disappointment and taking pride in a good idea that did not win.',
        'CASEL: Self-awareness',
      ),
    ],
  ),
];

// ================================================================== exports
export const EDU_A08_READER: EduQuest[] = [
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
];

/** Every `edu:` check used by a `do` lesson in this file. */
export const CHECKS: string[] = ['edu:count:tablet-marks:3'];
