/**
 * The Learning Grove, reader band (ages 7–10): Pixel’s Arcade cartridge PA1, The Chao Altar.
 *
 * Source: arcade-pa1.ts (ARCADE_PA1 and PA1_VARIANTS). One EduScene per original scene, id
 * `reader:<original id>`: every step scene, every done scene, every complete scene and all nine
 * variants. Every choice keeps its original id and `set`, including the gate’s “lock” choice,
 * framed so the child can see its cost in PA1-17. See EDU-STYLE.md.
 *
 *   Learning angles: water as a liquid and the water cycle (2-ESS2-3, 2-PS1-4), floating and
 *   forces (3-PS2-1), parachutes and air, sound and vibration (1-PS4-1), light and shadow
 *   (1-PS4-2), frogs’ life cycles (3-LS1-1), what birds need (K-LS1-1, 4-LS1-1), murals as a
 *   record of the past (D2.His.2.K-2, 3-LS4-1 for the idea of evidence), maps and port/starboard
 *   (2-ESS2-2), fairness and rules (D2.Civ.8.K-2), scarcity and choices (D2.Eco.1.K-2); maths in
 *   the story’s own numbers (seven spanners, seven Emeralds, a hundred shards, two decks up,
 *   twelve Chao in lifeboats, nine seconds); reading for motive and theme (RL.3.3, RL.4.2),
 *   similes and metaphors (L.4.5), vocabulary (L.3.4).
 *   Think questions (one per quest, no best answer): whether a game world is real; locking the
 *   gate; whether Chaos was lost or angry; worrying as a kind of love; asking “why”; a job that
 *   is all you have; what the prayer serves; a robot changing its mind; whether waiting is doing
 *   nothing; whether Pachacamac is wrong; brave versus sensible; whether Gamma was good; staying
 *   to watch a hard thing; whether grief can be put down; what to save first; using “the good”;
 *   safe versus well; what we keep of someone.
 *
 * - Neither lifted prayer line appears. The prayer is spoken of, never given.
 * - Hard things said plainly, with comfort straight after: Tikal lived thousands of years ago and
 *   died; her light stayed to look after Chaos. Some Chao died when the warriors came; Tikal stayed
 *   with Chaos so it was not alone. Knuckles’s people died long ago. Gamma’s end is not shown.
 * - Chaos is never called evil: it is grief, said plainly in PA1-14.
 * - Pixel (she/her) hums Cinder’s tune without the words. The Keeper is a guest; Sonic and his
 *   friends keep their story, and your Nubbin acts but never speaks.
 */
import type { EduDomain, EduQuest, EduScene, GlossaryEntry, Lesson } from './types';
import type { Choice, Line, Mood } from '../config/story';

const say =
  (who: string) =>
  (text: string, mood?: Mood): Line =>
    mood ? { who, text, mood } : { who, text };

// ---------------------------------------------------------------- speakers
const N = say('narrator');
const Y = say('you');
const PX = say('pixel');
const CK = say('clank');
const TI = say('pa1-tikal');
const SO = say('pa1-sonic');
const TA = say('pa1-tails');
const KN = say('pa1-knuckles');
const AM = say('pa1-amy');
const BI = say('pa1-big');
const GA = say('pa1-gamma');
const EG = say('pa1-eggman');
const PA = say('pa1-pachacamac');
const OF = say('pa1-officer');
const RA = say('pa1-radio');

// ---------------------------------------------------------------- builders
type Beat = Omit<Lesson, 'id'>;
type Opt = NonNullable<Lesson['options']>[number];

/** One answer option. `best` marks the answer the lesson teaches; a think question has none. */
const o = (label: string, reply: Line[], best = false): Opt =>
  best ? { label, best, reply } : { label, reply };

const ask = (
  after: number,
  domain: EduDomain,
  skill: string,
  standard: string | null,
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
  skill: string,
  standard: string | null,
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

const doIt = (
  after: number,
  domain: EduDomain,
  skill: string,
  standard: string | null,
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

/** One reader scene. Lesson ids are `reader:<of>-l<n>`, numbered in play order. */
const sc = (of: string, lines: Line[], beats: Beat[], choices?: Choice[]): EduScene => ({
  id: `reader:${of}`,
  of,
  band: 'reader',
  lines,
  ...(choices ? { choices } : {}),
  lessons: [...beats]
    .sort((a, b) => a.after - b.after)
    .map((b, i) => ({ id: `reader:${of}-l${i + 1}`, ...b })),
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
  set ? { id, label, set, then } : { id, label, then };

const G = (goal: string, hint: string) => ({ goal, hint });
const gloss = (word: string, meaning: string, of: string): GlossaryEntry => ({
  word,
  meaning,
  scene: `reader:${of}`,
});

// ================================================================== PA1-1 The Cabinet
const Q01: EduQuest = quest(
  'pa1-01',
  'The Cabinet',
  {
    'pa1-01-s1': G(
      'Look over the old cabinet Pixel has set up in the lantern shed.',
      'It is against the back wall. Mind the coin slot.',
    ),
    'pa1-01-s2': G(
      'Slot the cartridge into the cabinet and step through.',
      'Push the cartridge into the slot, then step onto the footplate.',
    ),
  },
  [
    sc(
      'pa1-01-shed',
      [
        N(
          'The lantern shed smells of sawdust and warm dust. The old cabinet from the Workyard skip hums against the back wall.',
        ),
        N(
          'It has a dent the shape of a boot in one side. Someone has painted over the name, badly.',
        ),
        PX(
          'Don’t touch the coin slot. There was a mouse family in it. They’ve moved to the bottom drawer and they’re very happy.',
          'happy',
        ),
        PX(
          'Three days. One new fuse, four wires, and a part I traded Byte for a jar of Clover’s honey.',
        ),
        PX('He thinks he got the better deal. He didn’t.', 'think'),
        N(
          'Pixel lifts a flap under the screen. Inside sit five chunky cartridges in a row, each in a faded sleeve.',
        ),
        PX(
          'Each one’s a whole world. Not a picture of one. A world. You go in, and I stay out here and play player two.',
        ),
        N(
          'The sleeve shows a garden: a pool, a palm tree, and small round creatures with a ball floating over each head.',
        ),
        N('Your Nubbin presses its face to the sleeve and goes very still.'),
      ],
      [
        ask(
          3,
          'social-studies',
          'trading: a fair swap',
          'D2.Eco.1.K-2',
          [PX('I swapped a jar of honey for a part. Byte thinks he won. What makes a swap fair?')],
          [
            o(
              'Both people get something they wanted',
              [
                PX(
                  'Exactly. Byte wanted honey, I wanted the part. Both happy means fair. Even if I did win.',
                ),
              ],
              true,
            ),
            o('The bigger thing always wins', [
              PX(
                'Size isn’t the point. A swap is fair when both people get something they wanted.',
              ),
            ]),
          ],
          'Thought about what makes a trade fair.',
        ),
        ask(
          8,
          'literacy',
          'think: is a game world real?',
          null,
          [
            PX(
              'A whole world in a cartridge. Here’s one to think about: is a world inside a game real?',
            ),
          ],
          [
            o('Yes, if you can go there', [
              PX('Fair. If you can get your feet wet in it, that counts for something.'),
            ]),
            o('No, it’s only pictures', [
              PX(
                'Could be. Though the Chao on that sleeve don’t look like they know they’re pictures.',
              ),
            ]),
            o('A bit of both', [PX('That’s where I’ve landed too. Real enough to be careful in.')]),
          ],
          'A think question: what makes a place real.',
        ),
      ],
      [
        ch('cousins', 'They look like our Nubbins.', [
          PX(
            'Don’t they? Like cousins. Like somebody else’s family photos, with your nose in them.',
            'soft',
          ),
        ]),
        ch('safe', 'Is it safe in there?', [
          PX('Safe as a game. You can’t get hurt. You can get your feet wet.'),
          PX('And I’ll be right here. I’ll talk to you through the speaker the whole time.'),
        ]),
        ch('old', 'How old is this thing?', [
          PX(
            'The label’s too faded to read the year. Old, anyway. Older than the sawmill roof.',
            'think',
          ),
        ]),
      ],
    ),
    sc(
      'pa1-01-shed-done',
      [
        N(
          'Pixel blows the dust off the cartridge in one long puff and wipes the metal contacts on her sleeve.',
        ),
        PX('Clean contacts, happy cartridge. Everyone knows that. Nobody knows why.'),
        N('Your Nubbin blows on the sleeve too, with no dust left to move.'),
      ],
      [
        notice(
          1,
          'science',
          'why clean contacts matter',
          '4-PS3-2',
          [
            PX(
              'Actually, I do know why. Electricity runs through the metal contacts, like water through a pipe.',
            ),
            PX(
              'Dust gets in the way, so the signal can’t flow. Wipe it clean, and the world loads.',
            ),
          ],
          'Learned that electricity needs a clean path to flow.',
        ),
      ],
    ),
    sc(
      'pa1-01-slot',
      [
        N(
          'The cartridge goes in with a clunk you feel in your teeth. The screen flickers blue, then white.',
        ),
        N('A sound like a whole sea breathing in comes out of the speaker.'),
        PX('Okay. Okay okay okay. Player two, ready.', 'happy'),
        PX(
          'Rules. One: I can see what you see, more or less. Two: I can’t come in. Three: if you want out, say so, and I pull the plug.',
        ),
        PX('Gently. I pull it gently.'),
        N(
          'The screen is a window now. Through it comes warm air, and the smell of cut grass and pool water.',
        ),
        N('Your Nubbin looks at you, then at the window, then at you again.'),
        Y('Together, then.'),
        N(
          'You step up onto the footplate, take your Nubbin under one arm, and lean into the light.',
        ),
      ],
      [
        ask(
          4,
          'sel',
          'agreeing a way to stop',
          'CASEL: Responsible decision-making',
          [
            PX(
              'Rule three: say the word and I pull the plug. Why agree a way to stop before we start?',
            ),
          ],
          [
            o(
              'So you can stop without arguing',
              [PX('Yes. Agree it first, and nobody has to argue in the middle of a scary bit.')],
              true,
            ),
            o('Because games need rules', [
              PX(
                'Games do need rules, but this one is about you. Agree it first, and stopping is easy.',
              ),
            ]),
          ],
          'Learned why to agree a stop signal before starting something new.',
        ),
      ],
    ),
    sc(
      'pa1-01-slot-done',
      [
        N('Behind you the shed goes small and far, like a room seen through a keyhole.'),
        PX(
          'See you on the other side. I mean, I’ll see you. You won’t see me. You know what I mean.',
        ),
        N('The keyhole closes to a dot, and the dot goes out.'),
      ],
      [
        ask(
          0,
          'literacy',
          'similes',
          'L.4.5',
          [
            N(
              '“Like a room seen through a keyhole.” That’s a simile: it compares one thing to another with “like”. What does it tell you?',
            ),
          ],
          [
            o(
              'The shed looks small and far away',
              [
                N(
                  'Yes. A keyhole makes a whole room look tiny. The simile shows the shed shrinking as you leave it.',
                ),
              ],
              true,
            ),
            o('The shed has a keyhole', [
              N(
                'There’s no real keyhole. The simile compares the view to one, to show how small the shed looks.',
              ),
            ]),
          ],
          'Read a simile and explained what it shows.',
        ),
      ],
    ),
    sc(
      'pa1-01-complete',
      [
        N('You land on soft grass with the gentlest bump, as if the world was expecting you.'),
        N('There’s a pool, a palm tree, a path of stepping stones. Somewhere, a fountain.'),
        PX(
          'You’re in! You’re in. Your hair’s gone a bit square at the edges. It suits you.',
          'happy',
        ),
        N(
          'Your Nubbin rolls off your arm and lands sitting up, already staring at something past your knee.',
        ),
      ],
      [
        notice(
          2,
          'art',
          'pixels',
          null,
          [
            PX(
              'Square at the edges, because this world is drawn in pixels: tiny squares of colour, in a grid.',
            ),
            PX(
              'Stand far enough back and the squares turn into grass and water. Close up, it’s all little tiles.',
            ),
          ],
          'Learned that pixel art is made of small squares of colour.',
        ),
      ],
    ),
  ],
  [
    gloss(
      'cartridge',
      'A small box that holds a game, which you push into a machine to play it.',
      'pa1-01-shed',
    ),
    gloss(
      'contacts',
      'The metal strips where two parts touch so electricity can pass between them.',
      'pa1-01-shed-done',
    ),
  ],
);

// ================================================================== PA1-2 A Garden Like Ours
const Q02: EduQuest = quest(
  'pa1-02',
  'A Garden Like Ours',
  {
    'pa1-02-s1': G(
      'Explore the Chao Garden and meet the Chao.',
      'Walk round the pool and the fruit tree. Your Nubbin will find the Chao first.',
    ),
    'pa1-02-s2': G(
      'Decide what to do about the garden gate.',
      'The little wooden gate is between the grass and the hotel corridor.',
    ),
  },
  [
    sc(
      'pa1-02-garden',
      [
        N(
          'It’s a garden behind glass, tucked into the back of a big city hotel. Through the glass roof you can see towers and blue sky.',
        ),
        N('Eggs sit in the grass like dropped sweets. Small round creatures wobble between them.'),
        N(
          'Each one has a little ball floating over its head. When one bumps into the palm tree, its ball turns into a spiral.',
        ),
        PX('Those are Chao. It says so on the sleeve. CHAO. One word, lots of them.'),
        N(
          'Your Nubbin waddles straight into the middle of them, sits down, and is instantly sat on.',
        ),
        N(
          'The Chao that sat on it gets up, looks at it, and pats it on the head. Its ball turns into a heart.',
        ),
        PX('Oh, they’re cousins. They are absolutely cousins.', 'happy'),
        N(
          'A Chao offers your Nubbin half a fruit. Your Nubbin offers back a pebble, and both of them seem to think this is fair.',
        ),
        Y('It’s like the Grove, only smaller.'),
        PX('And with a glass roof. Byte would love a glass roof. Don’t tell him I said so.'),
      ],
      [
        ask(
          2,
          'literacy',
          'reading signs for feelings',
          'RL.1.4',
          [
            N(
              'A spiral when it bumps the tree, a heart when it makes a friend. What is the floating ball for?',
            ),
          ],
          [
            o(
              'It shows how the Chao feels',
              [
                N(
                  'Yes. The ball is a feeling made visible: dizzy is a spiral, happy is a heart. Nubbins do the same.',
                ),
              ],
              true,
            ),
            o('It’s a hat', [
              N(
                'Not a hat. It changes with the Chao’s mood: a spiral for dizzy, a heart for happy.',
              ),
            ]),
          ],
          'Read a character’s feelings from a visual sign.',
        ),
        notice(
          7,
          'science',
          'glass lets light in',
          '2-LS2-1',
          [
            PX(
              'A glass roof is clever. It lets sunlight through, so the grass and the fruit tree can grow indoors.',
            ),
            PX(
              'Plants need light and water to live. Take the glass away and put a wooden roof on, and the garden would go yellow.',
            ),
          ],
          'Learned that plants need light, and glass lets it through.',
        ),
      ],
    ),
    sc(
      'pa1-02-garden-done',
      [
        N('You find a watering can by the pool and fill the trough under the fruit tree.'),
        N('Three Chao come to watch you do it, very seriously, like inspectors.'),
        N('One of them taps the trough when you finish, as if to say: passed.'),
      ],
      [
        ask(
          0,
          'maths',
          'capacity: how many cans',
          '4.MD.A.2',
          [PX('The trough holds 6 litres and the can holds 2. How many cans fill the trough?')],
          [
            o(
              '3',
              [PX('Yes. 2 and 2 and 2 is 6: three trips to the pool. The inspectors approve.')],
              true,
            ),
            o('4', [
              PX('Four cans would be 8 litres: it would overflow. 6 shared into 2s is 3 trips.'),
            ]),
            o('2', [
              PX('Two cans is only 4 litres. One more: 2 and 2 and 2 makes 6. Three trips.'),
            ]),
          ],
          'Divided a capacity into equal cans.',
        ),
      ],
    ),
    sc(
      'pa1-02-gate',
      [
        N(
          'The garden door opens onto the hotel. Through it comes the sound of a radio at the front desk, turned up loud.',
        ),
        RA(
          '…police have closed the square. Witnesses describe a creature made of water. Please stay indoors…',
        ),
        N('Sirens, far off. The Chao don’t mind, because they don’t know what sirens are.'),
        PX('Hmm. That’s new. The sleeve didn’t say anything about water creatures.', 'think'),
        N(
          'The garden has a gate of its own, a low wooden one with a latch and a key, between the grass and the hotel corridor.',
        ),
        PX(
          'You could lock it. Nothing gets in, nothing gets out. Or leave it, and they can wander, like ours do.',
        ),
        PX('I don’t know which. I’m player two. You’re the one standing there.'),
        N('A Chao is sitting on the latch, swinging its feet.'),
      ],
      [
        ask(
          6,
          'sel',
          'think: safe or free?',
          null,
          [
            PX(
              'Here’s the real question, and I don’t know the answer. Lock them in safe, or let them wander? What would you do?',
            ),
          ],
          [
            o('Lock it. Strange things are out there.', [
              PX('That’s careful, and careful isn’t wrong. Something is out there.'),
            ]),
            o('Leave it. They should be able to choose.', [
              PX('That’s how we do it at home. Though home doesn’t have a water creature.'),
            ]),
            o('I can’t decide.', [
              PX(
                'Then you’re where I am. Whatever you pick, we’ll find out together what it meant.',
              ),
            ]),
          ],
          'A think question: weighing safety against freedom.',
        ),
      ],
      [
        ch(
          'lock',
          'Lock the gate. Keep them safe inside.',
          [
            N('You lift the Chao off the latch and turn the key. It clicks, small and firm.'),
            PX('Safe and sound. Good. That’s one thing sorted.'),
          ],
          { 'pa1-gate': 'locked' },
        ),
        ch(
          'open',
          'Leave it open. Let them come and go.',
          [
            N(
              'You prop the gate with a stone. The Chao on the latch rides it all the way open, delighted.',
            ),
            PX('Free-range Chao. Like ours. All right.'),
          ],
          { 'pa1-gate': 'open' },
        ),
      ],
    ),
    sc(
      'pa1-02-gate-done',
      [
        N(
          'The sirens move off toward the square. Your Nubbin is the last to leave the pool, and it looks back twice.',
        ),
        N('Each time it looks back, a Chao waves. Each time, your Nubbin nearly goes back.'),
      ],
      [
        notice(
          0,
          'science',
          'why sirens change pitch',
          '1-PS4-1',
          [
            PX(
              'Did you hear the siren drop lower as it drove away? That’s not the siren changing. It’s the sound waves stretching out as it moves off.',
            ),
            PX(
              'Coming toward you, the waves bunch up and sound higher. Going away, they spread out and sound lower.',
            ),
          ],
          'Learned why a moving siren seems to change pitch.',
        ),
      ],
    ),
    sc(
      'pa1-02-complete',
      [
        N(
          'The radio at the front desk is still talking. The man behind the desk turns it up, then down, then up again.',
        ),
        PX('Let’s go and look. Just look. From a sensible distance.'),
        PX('I’m saying “sensible” now so that later I can say I said it.', 'think'),
        N('Your Nubbin is already at the lobby doors, nose to the glass.'),
      ],
      [
        ask(
          2,
          'literacy',
          'reading a character’s motive',
          'RL.3.3',
          [
            N(
              'Pixel says “sensible” so she can say she said it later. What does that tell you about Pixel?',
            ),
          ],
          [
            o(
              'She expects you won’t be sensible, and she’s half joking',
              [
                N(
                  'Yes. She knows curiosity will win, and she’s covering herself with a joke. That’s Pixel: careful and funny at once.',
                ),
              ],
              true,
            ),
            o('She is very strict', [
              N(
                'Not strict: she’s coming with you. The joke shows she expects curiosity to win, and she’s teasing both of you about it.',
              ),
            ]),
          ],
          'Read a character’s motive from a joke.',
        ),
      ],
    ),
  ],
  [
    gloss(
      'inspector',
      'Someone whose job is to check that things have been done properly.',
      'pa1-02-garden-done',
    ),
    gloss('witness', 'A person who saw something happen and can say what they saw.', 'pa1-02-gate'),
  ],
);

// ================================================================== PA1-3 The Water Creature
const Q03: EduQuest = quest(
  'pa1-03',
  'The Water Creature',
  {
    'pa1-03-s1': G(
      'Go to Station Square and see what the police are surrounding.',
      'Out through the hotel lobby and across the plaza to the tape.',
    ),
    'pa1-03-s2': G(
      'Watch from behind the bench while Sonic deals with the creature.',
      'Keep your Nubbin behind the bench by the fountain.',
    ),
  },
  [
    sc(
      'pa1-03-square',
      [
        N(
          'Station Square is all bright glass and fountains. Today it is also police tape, and a crowd held back behind it.',
        ),
        N(
          'Officers crouch behind their cars. In the middle of the square something stands in a puddle that wasn’t there this morning.',
        ),
        N(
          'It’s made of water, clear water, roughly the shape of a person. There’s a green glow where a heart should be.',
        ),
        OF(
          'Stay back, please. Back behind the line. That means you too, and your… whatever that is.',
        ),
        N('Your Nubbin stays back. It is holding the hem of your shirt in both hands.'),
        PX('Oh. Look at its head. Look at the shape of its head.', 'shock'),
        N(
          'The top of the creature’s head curls up and over, just like the Chao’s heads. Just like your Nubbin’s.',
        ),
        N(
          'The officers shout warnings. Whatever they throw at it goes straight through, like pebbles into a pond.',
        ),
      ],
      [
        ask(
          7,
          'science',
          'liquids and solids',
          '2-PS1-1',
          [
            PX(
              'Things thrown at it go straight through. Why can’t you knock over something made of water?',
            ),
          ],
          [
            o(
              'Water is a liquid: it flows round things instead of breaking',
              [
                PX(
                  'Right. A solid holds its shape and can crack. A liquid just moves aside and closes up again.',
                ),
              ],
              true,
            ),
            o('Water is too heavy', [
              PX(
                'Water’s heavy, but that’s not it. It’s a liquid: it flows round the pebble and closes up behind it.',
              ),
            ]),
          ],
          'Learned how liquids behave differently from solids.',
        ),
      ],
    ),
    sc(
      'pa1-03-square-done',
      [
        N('Then a blue blur comes down the street so fast that the whole crowd’s hair stands up.'),
        N('Your Nubbin’s crown-curl flattens, then springs back.'),
      ],
      [
        notice(
          0,
          'science',
          'moving air',
          '3-PS2-1',
          [
            PX(
              'Something going that fast shoves the air out of its way, and the air shoves your hair. That’s a force you can feel without being touched.',
            ),
          ],
          'Learned that fast-moving things push air, and air pushes back.',
        ),
      ],
    ),
    sc(
      'pa1-03-sonic',
      [
        SO('Hey, hey! Everybody back! I’ve got this one.', 'happy'),
        N(
          'A blue hedgehog skids to a stop between the police and the creature. He’s grinning, which seems to be his resting face.',
        ),
        N(
          'It’s a short fight, mostly Sonic bouncing and the creature splashing. You keep your Nubbin behind a bench.',
        ),
        N(
          'Then the creature folds. It doesn’t fall; it pours, all at once, into a drain in the road.',
        ),
        SO('Huh. Slippery. Didn’t even say goodbye.', 'think'),
        N(
          'Just before it goes, for half a second, it looks across the square. It looks at your Nubbin.',
        ),
        N(
          'Its face doesn’t look cruel. It looks like someone who has woken up in the wrong house.',
        ),
        PX('Did you see that? It wasn’t angry. It was lost.', 'soft'),
      ],
      [
        ask(
          7,
          'literacy',
          'think: lost or angry?',
          null,
          [PX('Everyone else saw a monster. I saw something lost. What did you see?')],
          [
            o('Lost, like Pixel says', [
              PX(
                'I’m glad it wasn’t just me. Something that looks at a Nubbin like that isn’t trying to hurt anyone.',
              ),
            ]),
            o('Angry. It smashed a square.', [
              PX(
                'It did do that. Maybe you can be lost and angry at the same time. Most of us can.',
              ),
            ]),
            o('Scared', [
              PX('Scared. Hm. Scared things splash a lot too. That might be the closest yet.'),
            ]),
          ],
          'A think question: reading a face two ways.',
        ),
      ],
      [
        ch('tell', 'Tell Sonic it looked lost.', [
          SO('Lost things still splash. Thanks, though. I’ll keep an eye out.'),
        ]),
        ch('drain', 'Look down the drain.', [
          N(
            'Under the grate, water runs away fast and very clear. It glows faintly green, all the way down.',
          ),
        ]),
        ch('quiet', 'Say nothing.', []),
      ],
    ),
    sc(
      'pa1-03-sonic-done',
      [
        N('Sonic is gone as fast as he came. The police start rolling up their tape.'),
        PX('So that’s the water creature. I think we’re going to see it again.'),
        N('Your Nubbin lets go of your shirt one hand at a time.'),
      ],
      [
        ask(
          2,
          'sel',
          'noticing when fear eases',
          'CASEL: Self-awareness',
          [N('Your Nubbin lets go of your shirt one hand at a time. What does that show?')],
          [
            o(
              'It is calming down slowly, not all at once',
              [N('Yes. Fear doesn’t switch off; it loosens bit by bit. One hand, then the other.')],
              true,
            ),
            o('It is bored', [
              N(
                'Not bored. It was holding on tight because it was scared, and now the fear is loosening, one hand at a time.',
              ),
            ]),
          ],
          'Noticed that calming down happens gradually.',
        ),
      ],
    ),
    sc(
      'pa1-03-complete',
      [
        N('A small rosy light is bobbing above the drain, about the size of a plum.'),
        N(
          'It wasn’t there a moment ago. It comes up to your face, circles your Nubbin once, and waits.',
        ),
        PX('That’s not on the sleeve either.', 'think'),
      ],
      [
        ask(
          1,
          'maths',
          'estimating size',
          '2.MD.A.1',
          [
            PX(
              'Plum-sized. If a plum is about 5 cm across, and your Nubbin is 30 cm tall, how many lights tall is your Nubbin?',
            ),
          ],
          [
            o(
              '6',
              [
                PX(
                  'Six lights, stacked. 30 shared into 5s is 6. Don’t stack the real one, it looks like it has opinions.',
                ),
              ],
              true,
            ),
            o('5', [PX('Close. Count up in 5s: 5, 10, 15, 20, 25, 30. That’s six.')]),
          ],
          'Used a known length to estimate another.',
        ),
      ],
    ),
  ],
  [
    gloss(
      'plaza',
      'A wide open space in a town, usually paved, with buildings round it.',
      'pa1-03-square',
    ),
    gloss(
      'liquid',
      'Something that flows and takes the shape of whatever holds it, like water or milk.',
      'pa1-03-square',
    ),
  ],
);

// ================================================================== PA1-4 The Light
const Q04: EduQuest = quest(
  'pa1-04',
  'The Light',
  {
    'pa1-04-s1': G(
      'Follow the rosy light.',
      'It waits for you down the quiet back street off the square.',
    ),
    'pa1-04-s2': G(
      'Sit by the shrine pool with the girl and the Chao.',
      'Sit on the warm stone at the edge of the pool, quietly.',
    ),
  },
  [
    sc(
      'pa1-04-follow',
      [
        N(
          'The rosy light drifts down a quiet back street, away from the crowd. Every few steps it stops to let you catch up.',
        ),
        N('It’s warm: not hot like a lamp, but warm like a hand.'),
        PX(
          'I’ve checked the controls. There’s no button for this. Whatever it is, it isn’t me.',
          'think',
        ),
        N(
          'Your Nubbin reaches up for it. The light dips, lets itself be touched, and bobs away again.',
        ),
        PX(
          'It likes your Nubbin. That’s a good sign, isn’t it? Things that like Nubbins are usually all right.',
        ),
        N(
          'At the end of the street the light stops in front of a blank wall. Then it grows, very gently, until there is nothing else.',
        ),
      ],
      [
        ask(
          1,
          'science',
          'heat moves from warm to cool',
          '4-PS3-2',
          [N('Warm like a hand. When you hold a warm thing, which way does the heat go?')],
          [
            o(
              'From the warm thing into your cooler hand',
              [
                N(
                  'Yes. Heat always moves from warmer to cooler. That’s why a warm hand feels warm, and snow feels cold: your heat is leaving.',
                ),
              ],
              true,
            ),
            o('From your hand into the warm thing', [
              N(
                'The other way. Heat moves from warmer to cooler, so the warm light gives heat to your hand.',
              ),
            ]),
          ],
          'Learned that heat moves from warmer to cooler things.',
        ),
      ],
    ),
    sc(
      'pa1-04-follow-done',
      [
        N(
          'The city sounds go out like a candle. Birdsong comes in instead, and the smell of warm stone.',
        ),
        PX('Keeper? The screen’s gone all gold. Where are you?', 'shock'),
        N('You can still hear her, faint and tinny, as if she were calling down a long pipe.'),
      ],
      [
        ask(
          0,
          'literacy',
          'metaphor: sounds going out like a candle',
          'L.4.5',
          [N('“The city sounds go out like a candle.” Why compare sounds to a candle?')],
          [
            o(
              'Because they stop suddenly, with a puff, and leave quiet behind',
              [
                N(
                  'Yes. A candle goes out in an instant and the room goes dark. Here the sounds stop and the street goes silent.',
                ),
              ],
              true,
            ),
            o('Because the city is on fire', [
              N(
                'No fire! The comparison is about how suddenly things stop: a puff, and then quiet, like a blown-out candle.',
              ),
            ]),
          ],
          'Explained a simile about sound.',
        ),
      ],
    ),
    sc(
      'pa1-04-shrine',
      [
        N(
          'You are standing on old stone steps at the edge of a jungle. It is morning, very long ago; you can feel that the way you feel weather.',
        ),
        N(
          'Ahead is a shrine. On a stone altar in the middle of it sits an enormous green jewel, glowing softly.',
        ),
        N(
          'Around it are pools of clear water, and in the water and on the steps and everywhere, there are Chao.',
        ),
        N(
          'A girl sits among them with her feet in the pool. She has long braids, a gentle face, and a Chao asleep in her lap.',
        ),
        TI(
          'Oh! A visitor. And a little one too. Come and sit down, quietly. This one’s only just gone off to sleep.',
          'happy',
        ),
        TI(
          'I’m Tikal. You’re from a long way off, aren’t you? Your little one doesn’t look like ours. It looks like a cousin.',
        ),
        N(
          'You sit on the warm stone. Your Nubbin climbs down into the shallows and is surrounded at once.',
        ),
        N(
          'Then the water in the middle pool moves. It rises, slowly, into the shape you saw in the square.',
        ),
        N(
          'It isn’t lost now. It stands tall over the Chao, quiet and watchful, with the green glow steady in its chest.',
        ),
        TI(
          'Don’t be afraid. That’s Chaos. It looks after them. It looks after all of us, really.',
          'soft',
        ),
        TI('Some of the clan say it’s a monster. It isn’t. It’s just the one who worries most.'),
      ],
      [
        notice(
          1,
          'social-studies',
          'shrines and altars',
          'D2.His.2.K-2',
          [
            N(
              'A shrine is a place people keep for something they treasure or honour. An altar is the raised stone at its heart where that thing is set.',
            ),
            N(
              'People long ago built them from the stone around them. This one has lasted because stone does.',
            ),
          ],
          'Learned what a shrine and an altar are.',
        ),
        ask(
          10,
          'sel',
          'think: is worrying a kind of love?',
          null,
          [
            TI(
              'They call Chaos a monster because it worries so much. Can worrying be a kind of love?',
            ),
          ],
          [
            o('Yes. You only worry about what you care for.', [
              TI('That’s what I think too. Though I wish it would worry a little less.'),
            ]),
            o('No. Worry just makes everyone nervous.', [
              TI(
                'It does do that. The Chao sometimes hide from it. Maybe love needs to be gentle as well as watchful.',
              ),
            ]),
            o('It depends how much.', [
              TI('It depends how much. Yes. That might be the wisest answer anyone has given me.'),
            ]),
          ],
          'A think question: worry and love.',
        ),
      ],
      [
        ch('bow', 'Bow to Chaos.', [
          N(
            'You bow, a little awkwardly, sitting down. Chaos looks at you for a long moment, then lowers its head, just slightly.',
          ),
        ]),
        ch('ask', 'Ask Tikal what it is.', [
          TI(
            'Grandmother says it was a Chao once, long ago, and the Emerald’s light changed it. Now it guards the rest.',
          ),
        ]),
        ch('watch', 'Watch your Nubbin.', [
          N(
            'Your Nubbin has floated on its back right to Chaos’s feet. Chaos dips one watery finger and turns it gently the right way up.',
          ),
        ]),
      ],
    ),
    sc(
      'pa1-04-shrine-done',
      [
        N(
          'The gold comes back, and the birdsong goes, and you are in the back street with your hand on a blank wall.',
        ),
        PX(
          'You were gone for nine seconds. Nine. You look like you were gone all afternoon.',
          'shock',
        ),
        N('Your Nubbin’s feet are still wet.'),
      ],
      [
        ask(
          1,
          'maths',
          'time intervals',
          '3.MD.A.1',
          [
            PX(
              'Nine seconds out here. Say the pool visit felt like 3 hours in there. How many seconds is 3 hours?',
            ),
          ],
          [
            o(
              '10,800',
              [
                PX(
                  'Yes. 60 seconds in a minute, 60 minutes in an hour: 3,600 an hour, times 3. That’s 10,800 seconds squeezed into nine.',
                ),
              ],
              true,
            ),
            o('180', [PX('180 is 3 minutes. An hour is 3,600 seconds, so 3 hours is 10,800.')]),
            o('3,600', [PX('3,600 is one hour. Three of those: 10,800 seconds.')]),
          ],
          'Converted hours to seconds.',
        ),
      ],
    ),
    sc(
      'pa1-04-complete',
      [
        PX(
          'The water creature. That was the water creature, wasn’t it? From the square. But kind.',
          'think',
        ),
        Y('It was looking after them.'),
        PX('Then what happened to it?'),
        N(
          'The rosy light bobs once at your shoulder and goes quiet, like someone who isn’t ready to say yet.',
        ),
      ],
      [
        ask(
          2,
          'literacy',
          'predicting from clues',
          'RL.2.3',
          [PX('Kind long ago, lost today. What kind of thing could have happened in between?')],
          [
            o(
              'Something was done to the Chao it looked after',
              [
                PX(
                  'That’s my guess too. You don’t go from watchful to lost unless something you were watching is gone.',
                ),
              ],
              true,
            ),
            o('It got bored of the garden', [
              PX(
                'Bored things wander off. This one looks like it’s searching. Something it cared about is missing.',
              ),
            ]),
          ],
          'Made a prediction from story clues.',
        ),
      ],
    ),
  ],
  [
    gloss(
      'shrine',
      'A special place kept for something people honour or treasure.',
      'pa1-04-shrine',
    ),
    gloss(
      'altar',
      'A raised stone or table at the heart of a shrine, where the treasured thing is set.',
      'pa1-04-shrine',
    ),
  ],
);

// ================================================================== PA1-5 Tails’s Workshop
const Q05: EduQuest = quest(
  'pa1-05',
  'Tails’s Workshop',
  {
    'pa1-05-s1': G(
      'Take the train out to the Mystic Ruins and find the workshop.',
      'The station is across the square. The workshop is on the hill above the stop.',
    ),
    'pa1-05-s2': G(
      'Hand Tails the spanner he needs.',
      'It’s one of the seven on the bench. Your Nubbin may already know which.',
    ),
    'pa1-05-s3': G(
      'Keep your head down when Eggman comes.',
      'Get behind the workbench with your Nubbin and stay there.',
    ),
  },
  [
    sc(
      'pa1-05-train',
      [
        N(
          'A train runs from Station Square out to the Mystic Ruins, a green valley full of old stones and older trees.',
        ),
        N(
          'On the hill above the station is a workshop with a runway and a bright little plane outside. Someone is muttering at an engine.',
        ),
        TA('Hand me the… no, that’s the… thank you, that’s the one I meant, actually.'),
        N(
          'A young fox with two tails is up to his elbows in the plane’s nose. There is oil on his face and more on one tail.',
        ),
        TA(
          'Hi! Sorry. I’m Tails. You’re not from round here, are you? Your friend’s got the same head as a Chao.',
        ),
        TA(
          'Sonic’s inside. We found a Chaos Emerald, and it’s doing something weird to the instruments.',
        ),
        PX('A fox. With two tails. Who fixes planes. I want to live in this game.', 'happy'),
      ],
      [
        ask(
          0,
          'social-studies',
          'reading a route',
          '2-ESS2-2',
          [
            PX(
              'City to valley by train. On the map the line runs from the square, out past the coast, into the hills. Which comes first after the square?',
            ),
          ],
          [
            o(
              'The coast',
              [
                PX(
                  'Yes: square, coast, hills. Following a line on a map in order is most of reading one.',
                ),
              ],
              true,
            ),
            o('The hills', [
              PX(
                'The hills are the end of the line. Square first, then the coast, then the hills.',
              ),
            ]),
          ],
          'Followed a route on a map in order.',
        ),
      ],
    ),
    sc(
      'pa1-05-train-done',
      [
        N(
          'Tails hooks a spare stool out from under the bench with his foot. He doesn’t stop working once.',
        ),
        N('Your Nubbin climbs onto the stool, sits on its hands, and watches like a student.'),
      ],
      [
        notice(
          1,
          'sel',
          'watching before helping',
          'CASEL: Social awareness',
          [
            N(
              'Your Nubbin watches before it helps. That’s a good trick with busy people: see what they are doing first, and then you can tell what they need.',
            ),
          ],
          'Learned to watch first when someone is busy.',
        ),
      ],
    ),
    sc(
      'pa1-05-spanner',
      [
        TA('Could you pass the spanner? The silver one.'),
        N('The bench has seven silver things on it. All of them are spanners.'),
        TA('The other silver one.'),
        N(
          'Your Nubbin climbs onto the bench, picks one up in both arms, and stands there beaming.',
        ),
        PX(
          'Tell him it’s a ten. It looks like a ten. Through the screen, everything looks like a ten.',
        ),
        TA(
          'Nearly there. If I’m reading this right, the Emerald’s giving off a signal, and something’s following it.',
          'think',
        ),
      ],
      [
        ask(
          4,
          'maths',
          'measurement: spanner sizes in millimetres',
          '4.MD.A.1',
          [
            PX(
              'A “ten” means 10 millimetres across the jaws. There are 10 millimetres in a centimetre. So how wide is the ten, in centimetres?',
            ),
          ],
          [
            o(
              '1 cm',
              [
                PX(
                  'Yes. 10 mm is 1 cm, about the width of your little fingernail. Tiny bolt, tiny spanner.',
                ),
              ],
              true,
            ),
            o('10 cm', [PX('10 cm would be a huge bolt. 10 mm is 1 cm, about a fingernail wide.')]),
          ],
          'Converted millimetres to centimetres.',
        ),
      ],
      [
        ch('nubbin', 'Take the one your Nubbin is holding.', [
          TA('That’s it! How did it… never mind. Thank you, both of you.', 'happy'),
        ]),
        ch('small', 'Hand him the smallest.', [
          TA('Close! One up. Thanks.'),
          N('Your Nubbin hands him the one up. It’s the one it was holding.'),
        ]),
        ch('ask', 'Ask which one he means.', [
          TA('The ten. Sorry. I always forget other people can’t see inside my head.'),
          N('Your Nubbin is already holding the ten.'),
        ]),
      ],
    ),
    sc(
      'pa1-05-spanner-done',
      [
        N(
          'The engine coughs, catches and purrs. Tails punches the air and bangs his head on the propeller.',
        ),
        N('He says it doesn’t hurt. He says it three times.'),
      ],
      [
        ask(
          1,
          'literacy',
          'what repetition tells you',
          'RL.3.3',
          [
            N(
              'Tails says it doesn’t hurt, three times. What does saying it three times really tell you?',
            ),
          ],
          [
            o(
              'It does hurt, a bit, and he doesn’t want a fuss',
              [
                N(
                  'Yes. When someone insists too much, the insisting gives them away. Tails is fine, and also bumped.',
                ),
              ],
              true,
            ),
            o('It really doesn’t hurt', [
              N(
                'If it truly didn’t, once would do. Three times means: it stings, and he’d rather not make a fuss.',
              ),
            ]),
          ],
          'Read what a character means from how often they say it.',
        ),
      ],
    ),
    sc(
      'pa1-05-ambush',
      [
        N(
          'A shadow falls over the runway. A round flying machine hums down out of the sky, and in it sits a round man with a huge moustache.',
        ),
        EG(
          'Good afternoon, vermin! I’ll be taking that Emerald. No, don’t get up. I’ll show myself in.',
          'happy',
        ),
        TA('It’s Eggman! Sonic, he’s here!', 'shock'),
        SO('Already on it. Oh, hi again. You’re everywhere today.'),
        N('You get down behind the workbench with your Nubbin, as small as the two of you can be.'),
        N(
          'A metal claw shoots out of the machine. In a clatter and a flash, the Emerald is gone from the bench.',
        ),
        EG('Chaos, my dear! Supper!'),
        N(
          'Out of a puddle by the runway rises the water creature, taller than before. Eggman tosses it the Emerald, and it swallows the light.',
        ),
        N(
          'It grows: its arms lengthen and its head curls higher. Its eyes don’t look at Eggman at all, but past him, at nothing.',
        ),
        EG(
          'Two Emeralds, two sizes! At seven, my friend, nobody will be able to stop us. Toodle-oo!',
        ),
      ],
      [
        ask(
          9,
          'maths',
          'counting on to a target',
          '2.OA.A.1',
          [
            PX(
              'Two Emeralds down. He wants all seven. How many more does he need, and how many are still out there for someone else to find?',
            ),
          ],
          [
            o(
              '5 more, and the same 5 are out there',
              [
                PX(
                  'Yes. 7 take away 2 is 5. Five chances for someone other than Eggman to get there first.',
                ),
              ],
              true,
            ),
            o('4 more', [PX('Count on from 2: three, four, five, six, seven. That’s five more.')]),
          ],
          'Counted on from a part to a whole.',
        ),
      ],
    ),
    sc(
      'pa1-05-ambush-done',
      [
        N(
          'Sonic chases Chaos off into the valley. Eggman’s machine hums away over the trees, chuckling to itself.',
        ),
        TA('Are you two all right? He doesn’t usually bother with bystanders.'),
        PX('Nobody look at the claw marks on the bench. Nobody.', 'shock'),
      ],
      [
        ask(
          2,
          'sel',
          'think: why do we look away from damage?',
          null,
          [
            PX(
              'I said don’t look at the claw marks. Why do you think people look away from the scary bit once it’s over?',
            ),
          ],
          [
            o('Looking makes it feel real again', [
              PX(
                'That’s it, for me. The marks are proof it happened. I’d rather look at the plane.',
              ),
            ]),
            o('There’s nothing to do about it now', [
              PX('True. You can’t un-claw a bench. Tails will sand it, and that’ll be that.'),
            ]),
            o('I’d look. I want to know what happened.', [
              PX(
                'Fair. Some people feel better knowing exactly. I’ll zoom in for you. Ugh. There.',
              ),
            ]),
          ],
          'A think question: how people handle something frightening after it ends.',
        ),
      ],
    ),
    sc(
      'pa1-05-complete',
      [
        N('Tails fishes a second spanner out of the plane’s nose, where it has been all along.'),
        TA('Thanks for the help. Really. Most people just ask about the tails.'),
        PX('I was going to ask about the tails.', 'sad'),
        N(
          'Tails tells your Nubbin to keep the spanner it was holding. It carries it for the rest of the cartridge.',
        ),
      ],
      [
        notice(
          1,
          'science',
          'what two tails are for',
          '4-LS1-1',
          [
            TA(
              'Since nobody asked: two tails, spun together, push air down, like a propeller. That’s how I fly.',
            ),
            TA(
              'Animals’ bodies are shaped for what they do. Mine is shaped for being a very small helicopter.',
            ),
          ],
          'Learned that body parts suit what an animal does.',
        ),
      ],
    ),
  ],
  [
    gloss(
      'bystander',
      'Someone who is there when something happens but is not part of it.',
      'pa1-05-ambush-done',
    ),
    gloss('runway', 'The long flat strip that planes use to take off and land.', 'pa1-05-train'),
  ],
);

// ================================================================== PA1-6 The Shattered Emerald
const Q06: EduQuest = quest(
  'pa1-06',
  'The Shattered Emerald',
  {
    'pa1-06-s1': G(
      'Visit the floating island and its guardian.',
      'Tails will drop you on the island. Climb the shrine steps.',
    ),
    'pa1-06-s2': G(
      'Help Knuckles find the shards of the Master Emerald.',
      'Your Nubbin is good at finding green things. Search the ferns on the left.',
    ),
  },
  [
    sc(
      'pa1-06-island',
      [
        N(
          'High above the Mystic Ruins floats a whole island. Tails swings the plane past it and lets you down on the grass.',
        ),
        N(
          'At its heart is a shrine of stone steps. At the top sits a green Emerald, huge, glowing; the same one you saw on Tikal’s altar.',
        ),
        N(
          'Someone is sitting on the steps below it, arms folded, glaring at the sky as if it owes him money.',
        ),
        KN('Who let you up here? Nobody comes up here.', 'angry'),
        KN(
          'I’m Knuckles. I guard the Master Emerald. You don’t touch it, you don’t lean on it, and that thing doesn’t lick it.',
        ),
        N('Your Nubbin, who was about to lick it, sits down.'),
        KN(
          '…It can stay. It looks like a Chao. Chao used to live up here, way back. Before my people were gone.',
          'soft',
        ),
        N('Then the sky goes dark, and the Emerald flashes, and the steps shake under your feet.'),
        N(
          'Something rises out of the Emerald itself: water, clear, with a green glow. It strikes the stone once, very hard.',
        ),
        N(
          'The Master Emerald splits into a hundred green shards. They fly out in every direction, like seeds from a pod.',
        ),
        EG('Splendid work, Chaos! Knuckles, always a pleasure. Do enjoy your swim!', 'happy'),
        N('The island tips, slowly, like a great ship. Then it falls.'),
      ],
      [
        ask(
          2,
          'literacy',
          'figurative language: “as if it owes him money”',
          'L.4.5',
          [
            N(
              'Knuckles glares at the sky “as if it owes him money”. What does that tell you about his mood?',
            ),
          ],
          [
            o(
              'He is grumpy and suspicious, as if everything is against him',
              [
                N(
                  'Yes. You glare at someone who owes you money. The phrase makes his bad mood funny without saying “grumpy”.',
                ),
              ],
              true,
            ),
            o('The sky really owes him money', [
              N(
                'Skies don’t carry wallets. It’s a comparison: he glares the way you’d glare at someone who owed you. Grumpy.',
              ),
            ]),
          ],
          'Read a character’s mood from a figure of speech.',
        ),
        notice(
          9,
          'science',
          'seeds scattering',
          '2-LS2-2',
          [
            N(
              '“Like seeds from a pod.” Some plants fling their seeds: the pod dries, twists and bursts, scattering them far from the parent so they don’t all grow in one spot.',
            ),
          ],
          'Learned that some plants scatter seeds by bursting pods.',
        ),
      ],
    ),
    sc(
      'pa1-06-island-done',
      [
        N(
          'You hold on to the steps and to your Nubbin, and the island comes down into the sea with a long, deep, sighing splash.',
        ),
        N(
          'When the spray settles, it is floating off the Mystic Ruins, as if it had always meant to.',
        ),
        PX(
          'Is everyone… you’re all right? Good. My hands are shaking, and I’m not even in there.',
          'shock',
        ),
      ],
      [
        ask(
          1,
          'science',
          'floating and forces',
          '3-PS2-1',
          [PX('An island floating on the sea. What holds a floating thing up?')],
          [
            o(
              'The water pushes up on it as hard as its weight pulls down',
              [
                PX(
                  'Yes. The water’s push up and the island’s weight down are balanced, so it sits still. Unbalance them and it sinks or bobs.',
                ),
              ],
              true,
            ),
            o('Nothing: it’s magic', [
              PX(
                'In this world, a bit. But real floating is a balance: the water pushes up as hard as the weight pulls down.',
              ),
            ]),
          ],
          'Learned that floating is a balance of forces.',
        ),
      ],
    ),
    sc(
      'pa1-06-shards',
      [
        KN('Great. Great. A hundred pieces, all over the place.', 'angry'),
        KN(
          'Without the Master Emerald this island stays down. And it’s my job. It’s the only job I’ve got.',
          'sad',
        ),
        N('He kicks a stone, stares at the jungle, and doesn’t move.'),
        PX('He’s going to be ages. Look how much jungle there is.'),
        N(
          'Your Nubbin trots off into the ferns. A minute later it comes back with a green shard as long as its arm, very pleased.',
        ),
        KN('…How did it do that?', 'shock'),
        PX(
          'Nubbins are good at finding green things. Ask anyone who’s ever dropped a pea.',
          'happy',
        ),
        KN('Fine. You. Small one. You’re with me. Keeper, keep up.'),
      ],
      [
        ask(
          1,
          'sel',
          'think: a job that is all you have',
          null,
          [
            PX(
              '“It’s the only job I’ve got.” Why do you think Knuckles sounds so sad about that, when guarding a jewel sounds grand?',
            ),
          ],
          [
            o('Because if the job is everything, losing it means losing himself', [
              PX(
                'That’s how I hear it. When one thing is your whole life, a hundred pieces of it on the floor is a lot.',
              ),
            ]),
            o('Because he’s lonely up here', [
              PX(
                'A guard with nobody to guard for. Yes. I think the sad bit is less the job and more the empty island.',
              ),
            ]),
            o('Because it’s a lot of pieces', [
              PX(
                'A hundred is a lot. Though I think if there were ten he’d be nearly as sad. It’s his home, in bits.',
              ),
            ]),
          ],
          'A think question: when a job is someone’s whole life.',
        ),
      ],
      [
        ch('search', 'Search with Knuckles.', [
          KN(
            'You take the left side. I’ll take the right. Shout if you find anything. Don’t shout if you don’t.',
          ),
        ]),
        ch('people', 'Ask about his people.', [
          KN('Echidnas. There was a whole clan once. Now there’s me.', 'sad'),
          N(
            'His people died long ago, before he was born. He never knew them, and misses them anyway. Now he has Sonic and Tails, and a Nubbin in his ferns.',
          ),
          KN('Anyway. Shards. Left side.'),
        ]),
      ],
    ),
    sc(
      'pa1-06-shards-done',
      [
        N(
          'By sunset you have a sack of shards between you. Knuckles counts them twice and scowls, which seems to be how he says thank you.',
        ),
        KN('Not all of them. Not yet. But it’s a start.'),
        N('Your Nubbin counts them too, in its own way, by patting each one.'),
      ],
      [
        ask(
          1,
          'maths',
          'subtraction from 100',
          '2.OA.A.1',
          [KN('A hundred pieces. Thirty-six in the sack. How many still out there?')],
          [
            o('64', [KN('Sixty-four. Yeah. That’s what I got. Twice.')], true),
            o('74', [KN('Count again. 100 take 30 is 70, take 6 more is 64.')]),
            o('54', [KN('Too few. 100 take 36: 70, then 64.')]),
          ],
          'Subtracted a two-digit number from 100.',
        ),
      ],
    ),
    sc(
      'pa1-06-complete',
      [
        N(
          'Knuckles gives your Nubbin the smallest shard to hold, takes it back at once, then hands it over again.',
        ),
        KN('Just for tonight. Don’t lose it. That piece is a bit of my home.'),
        N(
          'Your Nubbin sleeps with it in both hands. In the morning it gives it back without being asked.',
        ),
        N('Knuckles looks at it for a while before he puts it in the sack.'),
      ],
      [
        ask(
          2,
          'sel',
          'trust is built by small things',
          'CASEL: Relationship skills',
          [
            N(
              'Your Nubbin gives the shard back without being asked. Why does that matter to Knuckles more than a big favour would?',
            ),
          ],
          [
            o(
              'It shows it can be trusted with what he cares about most',
              [
                N(
                  'Yes. Trust is built in small, kept promises. He lent it a piece of his home, and the piece came back.',
                ),
              ],
              true,
            ),
            o('Because the shard is worth a lot', [
              N(
                'It is, but that’s not the heart of it. He lent what he cares about most, and it came back. That is trust, built small.',
              ),
            ]),
          ],
          'Learned that trust grows from small kept promises.',
        ),
      ],
    ),
  ],
  [
    gloss('shard', 'A sharp broken piece of something hard, like glass or stone.', 'pa1-06-island'),
    gloss('guardian', 'Someone whose job is to protect a person, place or thing.', 'pa1-06-island'),
  ],
);

// ================================================================== PA1-7 The Prayer
const Q07: EduQuest = quest(
  'pa1-07',
  'The Prayer',
  {
    'pa1-07-s1': G(
      'Go to the rosy light above the broken altar.',
      'It is circling the empty altar at the top of the shrine steps.',
    ),
    'pa1-07-s2': G(
      'Sit with Tikal while she learns the prayer.',
      'Sit beside her on the top step, below the Emerald.',
    ),
  },
  [
    sc(
      'pa1-07-light',
      [
        N(
          'In the morning the rosy light is hovering over the empty altar where the Master Emerald was.',
        ),
        N(
          'It turns slow circles above the broken stone, as if it’s looking for something it put down.',
        ),
        KN(
          'That light’s been round here since I was a kid. It never does anything. It just hangs about.',
          'think',
        ),
        KN('Go on, then. If it wants you, it wants you.'),
        PX('Hang on, I’m getting the gold screen again. Hold your Nubbin’s hand.'),
        N(
          'Your Nubbin takes your finger. The light comes down over the two of you like a warm hat.',
        ),
      ],
      [
        ask(
          2,
          'literacy',
          'point of view',
          'RL.3.6',
          [
            N(
              'Knuckles says the light “never does anything”. You know it took you to the past. Why do you and Knuckles see it so differently?',
            ),
          ],
          [
            o(
              'He has only watched it; you have followed it',
              [
                N(
                  'Yes. Same light, different experience. He’s seen it hang about for years; you went where it goes. Point of view changes what a thing is.',
                ),
              ],
              true,
            ),
            o('Knuckles is wrong about everything', [
              N(
                'Not everything. From where he stands, it does just hang about. You know more because you followed it. That’s point of view.',
              ),
            ]),
          ],
          'Compared two characters’ points of view.',
        ),
      ],
    ),
    sc(
      'pa1-07-light-done',
      [
        N(
          'Birdsong and warm stone. The Master Emerald is whole again, glowing on its altar at the top of the steps.',
        ),
        N('Not a crack in it. Not yet.'),
      ],
      [
        notice(
          0,
          'social-studies',
          'before and after',
          'D2.His.2.K-2',
          [
            N(
              'You are standing in a “before”. Everything whole here is in pieces in Knuckles’s time. That is how history works: the stones stay, and what happens to them changes.',
            ),
          ],
          'Compared a place in the past and the present.',
        ),
      ],
    ),
    sc(
      'pa1-07-prayer',
      [
        N(
          'Tikal kneels at the top of the steps with her hands together. She is saying the same words again and again, under her breath.',
        ),
        N(
          'Around the great Emerald stand seven smaller jewels, each a different colour, each in its own hollow of stone.',
        ),
        TI(
          'Oh, it’s you again! Sit with me. Grandmother taught me the prayer. She said learn it, not just say it.',
          'happy',
        ),
        TI(
          'It begins with the seven jewels, and what they serve. I can say it. I don’t know what it means yet.',
          'think',
        ),
        N(
          'In the pools below, the Chao are splashing. Chaos stands among them, very still, the way a heron stands.',
        ),
        TI(
          'Father says it means the Emeralds serve whoever holds them. That’s what he wants it to mean.',
        ),
        TI('I think it means something else. Something I haven’t grown into yet.', 'soft'),
      ],
      [
        ask(
          2,
          'literacy',
          'learn it, not just say it',
          'L.3.4',
          [
            TI(
              'Grandmother said: learn it, not just say it. What’s the difference between saying words and learning them?',
            ),
          ],
          [
            o(
              'Saying is sounds; learning is knowing what they mean',
              [
                TI(
                  'Yes. I can say it perfectly and still not have learned it. Learning is when the words start to mean something.',
                ),
              ],
              true,
            ),
            o('There isn’t one', [
              TI(
                'I thought so too, until she said it. Saying is the sounds. Learning is when the sounds start to mean something.',
              ),
            ]),
          ],
          'Thought about the difference between repeating and understanding.',
        ),
        ask(
          6,
          'literacy',
          'think: who do the Emeralds serve?',
          null,
          [
            TI(
              'Father says the jewels serve whoever holds them. I think it’s something else. What do you think they serve?',
            ),
          ],
          [
            o('The Chao, the smallest ones', [
              TI('The Chao. I like that. Grandmother would have liked it too.'),
            ]),
            o('Whoever needs them most', [
              TI(
                'Whoever needs them. Then they wouldn’t be a prize at all. That would annoy Father very much.',
              ),
            ]),
            o('Nobody. They’re just stones.', [
              TI(
                'Maybe. But then why does the water stand so still beside them? I don’t think they’re only stones.',
              ),
            ]),
          ],
          'A think question: what power is for.',
        ),
      ],
      [
        ch('chao', 'Maybe they serve the Chao.', [
          TI('The Chao? The smallest ones?', 'think'),
          TI('Oh. I like that. Grandmother would like that.', 'happy'),
        ]),
        ch('who', 'Maybe it depends who’s asking.', [
          TI('Like a gate that opens for some and not for others. Yes. Maybe.', 'think'),
        ]),
        ch('listen', 'Just listen to her say it.', [
          N(
            'You sit and listen. She says it again, slower, and this time she isn’t trying to understand it, only saying it.',
          ),
          TI('Thank you. It goes easier with someone listening.', 'soft'),
        ]),
      ],
    ),
    sc(
      'pa1-07-prayer-done',
      [
        N(
          'The light comes back for you mid-sentence. Tikal smiles and lifts a hand, as if she knows you’ll be back.',
        ),
        PX('She’s nice. Is it weird that I’m worried about her?', 'soft'),
        N('Your Nubbin is still waving at a wall.'),
      ],
      [
        ask(
          1,
          'sel',
          'caring about people in stories',
          'CASEL: Social awareness',
          [PX('I’m worried about a girl in a cartridge. Is that weird?')],
          [
            o(
              'No. Caring about people in stories is practice for caring about real ones.',
              [PX('I’ll take that. Practice. I’m very good at practice.')],
              true,
            ),
            o('Yes, she isn’t real', [
              PX(
                'Maybe not. But the worry is. And worrying about someone, real or not, is the same muscle you use for real people.',
              ),
            ]),
          ],
          'Thought about empathy for characters.',
        ),
      ],
    ),
    sc(
      'pa1-07-complete',
      [
        KN('Well? What did it want?'),
        Y('To show me someone praying.'),
        KN(
          'Huh. My people used to pray here. I don’t know any of it. There was nobody left to teach me.',
          'sad',
        ),
        N(
          'He sits down on the broken altar with his back to you, and for a while nobody says anything.',
        ),
        N('Your Nubbin goes and sits with its back against his, which he allows.'),
      ],
      [
        notice(
          3,
          'social-studies',
          'oral history: what is lost when nobody teaches it',
          'D2.His.2.K-2',
          [
            N(
              'Knuckles’s people passed their prayers down by teaching, voice to voice. When the last teacher died, the words went with them.',
            ),
            N(
              'That is why people write things down, and why grandparents tell the same stories twice. A story only lasts as long as someone is telling it.',
            ),
          ],
          'Learned how spoken history is passed on and lost.',
        ),
      ],
    ),
  ],
  [
    gloss('hollow', 'A dip or small hole in a surface, where something can sit.', 'pa1-07-prayer'),
    gloss(
      'heron',
      'A tall, thin water bird that stands very still while it waits for fish.',
      'pa1-07-prayer',
    ),
  ],
);

// ================================================================== PA1-8 Amy and the Bird
const Q08: EduQuest = quest(
  'pa1-08',
  'Amy and the Bird',
  {
    'pa1-08-s1': G(
      'Meet the girl running across Station Square.',
      'She’s heading for the fountain, with a robot behind her.',
    ),
    'pa1-08-s2': G(
      'Hide the bird in the Chao Garden.',
      'Set the bird down on the grass among the Chao.',
    ),
    'pa1-08-s3': G(
      'Stay still while the robot looks.',
      'Stay in the ring with the Chao. Don’t move.',
    ),
  },
  [
    sc(
      'pa1-08-amy',
      [
        N(
          'Back in Station Square, a girl in a red dress is running across the plaza with her arms round something small.',
        ),
        N('Behind her a blocky red robot thumps along, beeping.'),
        AM('Excuse me, sorry, coming through, very important, out of the way!'),
        N(
          'She skids round the fountain and nearly falls over your Nubbin. She stops, looks at it, and melts a little.',
        ),
        AM('Oh, you’re lovely. Hi. I’m Amy. I can’t stop.', 'happy'),
        N('In her arms is a little blue bird with a tiny pendant round its neck. It’s trembling.'),
        AM(
          'He fell out of the sky right into my arms. The robots keep chasing him, and he hasn’t done anything!',
          'angry',
        ),
        PX('The pendant. Look at the pendant. It’s glowing green.'),
        AM('Please. Have you got anywhere we could hide?'),
      ],
      [
        ask(
          7,
          'literacy',
          'inference from clues',
          'RL.2.3',
          [
            PX(
              'A green glow. Where have we seen that glow before, and what might the robots really be chasing?',
            ),
          ],
          [
            o(
              'The Emeralds. The robots want the pendant, not the bird.',
              [
                PX(
                  'Yes. Green glow means Emerald. The bird is just the one wearing it. That makes the chase make sense, and makes it worse.',
                ),
              ],
              true,
            ),
            o('The robots are afraid of birds', [
              PX(
                'Robots don’t scare easy. Green glow, every time, has meant an Emerald. They want what’s round his neck.',
              ),
            ]),
          ],
          'Inferred a motive from a repeated clue.',
        ),
      ],
      [
        ch('garden', 'The Chao Garden, behind the hotel.', [
          AM('A garden? With a door? Perfect. Lead the way.'),
        ]),
        ch('think', 'Let me think.', [
          AM('Think fast!'),
          N('The beeping gets closer. You think of the only place you know.'),
        ]),
      ],
    ),
    sc(
      'pa1-08-amy-done',
      [
        N(
          'You run for the hotel, with Amy at your shoulder and your Nubbin bouncing along behind like a dropped ball.',
        ),
        N('The robot takes the long way round the fountain, because it cannot corner.'),
      ],
      [
        ask(
          1,
          'maths',
          'perimeter: the long way round',
          '3.MD.D.8',
          [
            PX(
              'The fountain is a square, 8 metres a side. You cut straight across the middle. The robot goes round two sides. How much further does it go than 8 metres?',
            ),
          ],
          [
            o(
              '8 metres further',
              [
                PX(
                  'Yes. Two sides is 16 metres; your short cut across is about 8. It loses 8 metres, and you gain a head start.',
                ),
              ],
              true,
            ),
            o('16 metres further', [
              PX(
                '16 is the whole distance it travels. You went about 8, so it went 8 more than you.',
              ),
            ]),
          ],
          'Compared distances round a shape and across it.',
        ),
      ],
    ),
    sc(
      'pa1-08-hide',
      [
        N(
          'In the Chao Garden it’s quiet, with fruit hanging from the tree. A Chao is asleep in the watering can.',
        ),
        AM('Here? Is he going to be safe here?'),
        N(
          'The little bird hops off her hands onto the grass. A Chao waddles up, looks at it, and its ball turns into a question mark.',
        ),
        N(
          'Then the Chao sits down next to the bird. Another sits down next to that one, and soon the bird is in the middle of a ring of them.',
        ),
        PX('They’re hiding him. They’re hiding him with themselves.', 'soft'),
        N('Your Nubbin sits down in the ring too. The bird stops trembling.'),
        AM('Oh, you darlings. You absolute darlings.', 'happy'),
      ],
      [
        notice(
          4,
          'science',
          'animals in groups',
          '3-LS2-1',
          [
            N(
              'Real animals do this too. Musk oxen stand in a ring with the calves in the middle; small birds mob a hawk together. A group protects what one alone can’t.',
            ),
          ],
          'Learned that animals in groups protect each other.',
        ),
      ],
    ),
    sc(
      'pa1-08-hide-done',
      [
        N('Footsteps in the corridor. Heavy ones, slow, with a hum of machinery under them.'),
        N('Twelve Chao go still at once. Your Nubbin copies them.'),
      ],
      [
        ask(
          1,
          'maths',
          'counting the ring',
          '3.OA.A.1',
          [N('Twelve Chao in a ring, in four little clumps of friends. How many in each clump?')],
          [
            o(
              '3',
              [
                N(
                  'Yes. 12 shared into 4 equal groups is 3 each. Four clumps of three, and a bird in the middle.',
                ),
              ],
              true,
            ),
            o('4', [N('Four clumps of 4 would be 16. It’s 12 shared into 4: three each.')]),
          ],
          'Divided twelve into equal groups.',
        ),
      ],
    ),
    sc(
      'pa1-08-gamma',
      [
        N(
          'A tall robot steps into the doorway: red and black, one long arm ending in a blaster, and a round, patient face.',
        ),
        GA('Target: small blue bird. Location: confirmed.'),
        AM('Don’t you dare. Don’t you DARE.', 'angry'),
        N(
          'The robot raises its arm and looks down at the ring of Chao. Twelve small faces look back, and twelve balls turn into exclamation marks.',
        ),
        N('The arm stops halfway.'),
        GA('…Query.', 'think'),
        N(
          'Nobody answers it. The robot stands still for so long that a Chao wanders over and touches its foot.',
        ),
        GA('E-102 Gamma. This unit… will report the target not found.'),
        N(
          'It lowers its arm and goes. At the door it stops, as if it’s about to say something more, and doesn’t.',
        ),
        PX('Did a robot just change its mind?', 'shock'),
      ],
      [
        ask(
          9,
          'sel',
          'think: can a robot choose?',
          null,
          [
            PX(
              'Gamma was built to follow orders, and it just didn’t. Here’s one to think about: did it choose, or did something go wrong in its wiring?',
            ),
          ],
          [
            o('It chose. It saw the Chao and decided.', [
              PX(
                'That’s how it looked from here. Twelve faces, and it stopped. If that isn’t choosing, I don’t know what is.',
              ),
            ]),
            o('It malfunctioned. Robots can’t choose.', [
              PX(
                'Maybe. Though if a malfunction makes you kinder, I’m not sure it counts as broken.',
              ),
            ]),
            o('Both. Something new happened to it.', [
              PX(
                'Both. Something it wasn’t built for happened, and it did a new thing with it. That might just be what choosing is.',
              ),
            ]),
          ],
          'A think question: choice and what makes it.',
        ),
      ],
    ),
    sc(
      'pa1-08-gamma-done',
      [
        N('Amy lets out a breath she seems to have been holding since the fountain.'),
        AM('Did you see its face? It didn’t want to. It really didn’t want to.', 'think'),
        N('The Chao’s balls go back to plain, one at a time, like lights going off down a street.'),
      ],
      [
        ask(
          2,
          'literacy',
          'simile: like lights going off down a street',
          'L.4.5',
          [
            N(
              '“Like lights going off down a street.” What does that comparison show you about the Chao?',
            ),
          ],
          [
            o(
              'They calm down one after another, in order, not all at once',
              [
                N(
                  'Yes. Streetlights go off in a line. The simile shows the fear leaving the ring one Chao at a time.',
                ),
              ],
              true,
            ),
            o('The garden has gone dark', [
              N(
                'The garden is still bright. The comparison is about order: one after another, like a row of lights, the Chao calm down.',
              ),
            ]),
          ],
          'Explained what a simile shows.',
        ),
      ],
    ),
    sc(
      'pa1-08-complete',
      [
        AM(
          'I’m going to find Sonic. He’ll know what to do. He always knows, even when he’s pretending.',
        ),
        N(
          'She scoops up the bird and kisses each Chao on the head in turn, which takes a while. Then she goes.',
        ),
        PX(
          'Bad feeling. I’ve got a bad feeling. I’ve been mostly right about bad feelings this week.',
          'think',
        ),
      ],
      [
        ask(
          1,
          'maths',
          'time: repeated short actions',
          '3.MD.A.1',
          [
            PX(
              'Twelve Chao, and each kiss-and-pat takes about 5 seconds. How long is Amy’s goodbye?',
            ),
          ],
          [
            o(
              'About a minute',
              [
                PX(
                  'Yes: 12 times 5 is 60 seconds, which is one minute. A long goodbye for a girl in a hurry.',
                ),
              ],
              true,
            ),
            o('About 5 minutes', [PX('12 times 5 is 60 seconds. That’s one minute, not five.')]),
          ],
          'Multiplied to find a total time.',
        ),
      ],
    ),
  ],
  [
    gloss('pendant', 'A small ornament that hangs from a chain round the neck.', 'pa1-08-amy'),
    gloss(
      'query',
      'A question, especially one asked because something is unclear.',
      'pa1-08-gamma',
    ),
  ],
);

// ================================================================== PA1-9 Big and Froggy
const Q09: EduQuest = quest(
  'pa1-09',
  'Big and Froggy',
  {
    'pa1-09-s1': G(
      'Find out who is calling for Froggy in the jungle.',
      'Follow the river into the Mystic Ruins jungle to the plank hut.',
    ),
    'pa1-09-s2': G(
      'Fish with Big, quietly, and wait for Froggy.',
      'Sit on the bank and keep still. Froggy comes to whoever is still.',
    ),
  },
  [
    sc(
      'pa1-09-big',
      [
        N(
          'Deep in the Mystic Ruins jungle, beside a hut made of planks and good intentions, a very large cat sits by a river looking sad.',
        ),
        BI('Froggy? Froggyyy.', 'sad'),
        N(
          'He has a fishing rod over one shoulder and a tackle box the size of a suitcase. He is the gentlest-looking thing you have ever seen this big.',
        ),
        BI(
          'Oh. Hello. I’m Big. Have you seen my friend? He’s a frog. He’s green. He’s called Froggy.',
        ),
        BI(
          'He went funny this morning. He swallowed a shiny green stone, and then he grew a tail. Frogs don’t have tails.',
          'think',
        ),
        PX(
          'A green stone. Another Emerald. And a tail like… oh no. Like the water creature’s?',
          'shock',
        ),
        BI(
          'He jumped in the river. I’ve been fishing for him all day. Not with a hook. With a lure. I wouldn’t hook Froggy.',
        ),
        N(
          'Your Nubbin sits down beside him. Big looks at it for a long time, then pats its head with one enormous, careful finger.',
        ),
        BI('You can help, if you want. You have to be quiet, though.'),
      ],
      [
        ask(
          4,
          'science',
          'frog life cycle',
          '3-LS1-1',
          [
            BI(
              'Frogs don’t have tails. But Froggy did once, when he was little. Do you know when?',
            ),
          ],
          [
            o(
              'When he was a tadpole',
              [
                BI(
                  'That’s right. Egg, then tadpole with a tail, then legs grow and the tail shrinks away, then frog. He shouldn’t have one now.',
                ),
              ],
              true,
            ),
            o('Frogs never have tails', [
              BI(
                'They do when they’re tadpoles! Egg, tadpole with a tail, then the tail goes and the legs come. Then frog.',
              ),
            ]),
          ],
          'Learned the stages of a frog’s life cycle.',
        ),
      ],
    ),
    sc(
      'pa1-09-big-done',
      [
        N(
          'Big hands you a spare rod. The lure on the end is a little rubber bug with a bell on it.',
        ),
        N('Your Nubbin flicks the bell with one finger, and Big says “shh” very kindly.'),
      ],
      [
        notice(
          0,
          'sel',
          'fairness to animals: no hook',
          'CASEL: Responsible decision-making',
          [
            N(
              'Big fishes with a lure and no hook, so Froggy can come to him unhurt. Being gentle with an animal means choosing the slower way that doesn’t hurt it.',
            ),
          ],
          'Noticed a choice made to avoid hurting an animal.',
        ),
      ],
    ),
    sc(
      'pa1-09-fish',
      [
        N('You sit on the bank beside Big. The river slides by, brown and green and slow.'),
        BI(
          'Froggy likes it when you’re still. If you wiggle, he hides. If you’re still, he comes and sits on your foot.',
        ),
        N(
          'Big is very good at being still, and you are less good at it. Your Nubbin is excellent.',
        ),
        PX(
          'This is the slowest game I have ever played. I love it. I’m going to make a cup of tea.',
          'happy',
        ),
        N('An hour passes, or the game’s idea of an hour. Dragonflies come and go.'),
        N('The bell on your lure rings once, and then doesn’t.'),
      ],
      [
        ask(
          4,
          'sel',
          'think: is waiting doing nothing?',
          null,
          [
            PX(
              'An hour of sitting still. Is waiting like this doing nothing, or is it doing something?',
            ),
          ],
          [
            o('Doing something. Being still is the job.', [
              PX(
                'Big would agree. The stillness is what brings Froggy. It only looks like nothing from outside.',
              ),
            ]),
            o('Doing nothing, but nice', [
              PX(
                'Nice nothing. I could use more of that. Though I notice the dragonflies only land on the still ones.',
              ),
            ]),
            o('It depends what you’re waiting for', [
              PX(
                'For a friend, then. That changes it, doesn’t it. Waiting for a friend is never quite nothing.',
              ),
            ]),
          ],
          'A think question: what waiting is.',
        ),
      ],
      [
        ch('wait', 'Keep waiting.', [
          N(
            'You keep still, and the river keeps moving. After a while you stop noticing that you’re waiting at all.',
          ),
        ]),
        ch('move', 'Reel in and try another spot.', [
          BI('Nope. This is the spot. Froggy always comes back to the spot.'),
          N('You put the rod back down. Big is right, as it turns out.'),
        ]),
      ],
    ),
    sc(
      'pa1-09-fish-done',
      [
        N(
          'Something small and green climbs out of the water and sits on your Nubbin’s foot. It has a long, wavering tail, clear as water.',
        ),
        BI('FROGGY!', 'happy'),
        N(
          'Froggy jumps from your Nubbin’s foot straight back into the river. Big is still beaming.',
        ),
        BI('He’s all right. He’s just being silly. I’ll find him. I always find him.'),
      ],
      [
        ask(
          0,
          'science',
          'dragonflies and rivers',
          '2-LS4-1',
          [
            N(
              'Dragonflies, a frog, a slow brown river. Why do so many creatures live right by the water?',
            ),
          ],
          [
            o(
              'They need it to drink, lay eggs in, or hunt over',
              [
                N(
                  'Yes. Frogs lay eggs in it, dragonfly young grow up under it, and everything drinks it. A river is a habitat: a home that meets needs.',
                ),
              ],
              true,
            ),
            o('They like the view', [
              N(
                'Nice as it is, it’s about needs: eggs laid in the water, young that grow in it, and something to drink. That makes the river a habitat.',
              ),
            ]),
          ],
          'Learned why a river is a habitat for many animals.',
        ),
      ],
    ),
    sc(
      'pa1-09-complete',
      [
        PX(
          'A frog with a tail like the water creature’s. So the water creature’s been near here. Hasn’t it?',
          'think',
        ),
        BI('That big water fella? I saw him. He looked like he was looking for something.'),
        BI('Same as me. I know that look.', 'soft'),
        N(
          'Big goes back to his rod. You leave him there, perfectly still, waiting for his friend.',
        ),
      ],
      [
        ask(
          2,
          'literacy',
          'theme: searching',
          'RL.4.2',
          [
            N(
              'Big is looking for Froggy. Chaos is looking for something too. What idea keeps coming back in this story?',
            ),
          ],
          [
            o(
              'Looking for someone you love and have lost',
              [
                N(
                  'Yes. Big and Froggy, Chaos and its Chao, Knuckles and his people. The story keeps circling the same thing: missing someone. That’s its theme.',
                ),
              ],
              true,
            ),
            o('Fishing', [
              N(
                'Fishing is just Big’s way of doing it. The bigger idea underneath, in Big and in Chaos, is missing someone you love. That’s the theme.',
              ),
            ]),
          ],
          'Found a theme that repeats across scenes.',
        ),
      ],
    ),
  ],
  [
    gloss(
      'lure',
      'A pretend bug or fish on a line, used to tempt a real fish to come close.',
      'pa1-09-big',
    ),
    gloss(
      'habitat',
      'The kind of place where an animal or plant naturally lives and finds what it needs.',
      'pa1-09-fish-done',
    ),
  ],
);

// ================================================================== PA1-10 Pachacamac
const Q10: EduQuest = quest(
  'pa1-10',
  'Pachacamac',
  {
    'pa1-10-s1': G(
      'Go back with the light and see who has come to the shrine.',
      'The light finds you on the riverbank. Stand at the bottom of the shrine steps.',
    ),
    'pa1-10-s2': G(
      'Decide where to stand while Tikal pleads with her father.',
      'Up the steps beside Tikal, or down by the pools with the Chao.',
    ),
  },
  [
    sc(
      'pa1-10-council',
      [
        N(
          'The rosy light finds you on the riverbank and takes you back without asking. It seems to be in a hurry.',
        ),
        N(
          'At the shrine it is evening. Torches burn on the steps, and a crowd of echidnas in feathers and beads stands below the altar.',
        ),
        N(
          'At their head is a big, grizzled echidna in a heavy headdress. He talks the way a hammer talks.',
        ),
        PA('Our neighbours have stone walls and bronze spears. We have prayers.', 'angry'),
        PA(
          'Seven Emeralds sit in this shrine doing nothing but glowing. With their power, no one would ever threaten this clan again.',
        ),
        N(
          'The warriors behind him strike their spears on the stone. In the pools, the Chao stop playing and look up.',
        ),
        N(
          'Chaos rises a little in the water, watching. Tikal stands in front of the altar, very small and very still.',
        ),
        TI('Father. Please. The Emeralds aren’t for that. Grandmother said…', 'sad'),
        PA('Your grandmother is gone, Tikal. Our enemies are not.'),
      ],
      [
        ask(
          2,
          'literacy',
          'metaphor: talks the way a hammer talks',
          'L.4.5',
          [
            N(
              '“He talks the way a hammer talks.” Hammers don’t talk. What is the writer telling you about Pachacamac?',
            ),
          ],
          [
            o(
              'His words hit hard and don’t listen back',
              [
                N(
                  'Yes. A hammer only strikes; it never hears. In one line you know he is forceful and not listening.',
                ),
              ],
              true,
            ),
            o('He is a builder', [
              N(
                'He might be, but that’s not the point. A hammer strikes and never listens. The line is about how he speaks.',
              ),
            ]),
          ],
          'Explained a metaphor about a character.',
        ),
        notice(
          8,
          'sel',
          'grief said plainly',
          'CASEL: Self-awareness',
          [
            N(
              'Tikal’s grandmother has died; “gone” is her father’s word for it. Tikal still carries what her grandmother taught her, which is one of the ways people stay with us.',
            ),
          ],
          'Heard a death named plainly and what remains.',
        ),
      ],
    ),
    sc(
      'pa1-10-council-done',
      [
        N('The warriors go quiet. Tikal looks round, and sees you at the bottom of the steps.'),
        N('Nobody else does. To the clan you are a trick of the torchlight.'),
      ],
      [
        ask(
          1,
          'science',
          'light and shadows',
          '1-PS4-2',
          [
            N(
              'Torches throw moving shadows up the steps. Why do shadows move when the torch flame flickers?',
            ),
          ],
          [
            o(
              'Shadows are where light is blocked, so when the light moves the shadow moves',
              [
                N(
                  'Yes. A shadow is the dark patch behind something that blocks light. Move the light and the dark patch shifts.',
                ),
              ],
              true,
            ),
            o('Shadows are alive', [
              N(
                'Not alive. A shadow is just where light can’t reach past something. Move the flame, and the dark patch moves with it.',
              ),
            ]),
          ],
          'Learned why shadows move with the light.',
        ),
      ],
    ),
    sc(
      'pa1-10-stand',
      [
        TI(
          'The Emeralds are the heart of this place. The Chao live here because it’s peaceful. Take the power, and it won’t be.',
        ),
        PA('Peace is a word for people who haven’t been attacked yet.'),
        TI('Then let us be those people for as long as we can.', 'soft'),
        N(
          'Pachacamac’s face doesn’t change. He has already decided, and he decided a long time ago.',
        ),
        PX('He’s not going to listen, is he? He isn’t even really hearing her.', 'sad'),
        N('Tikal is shaking. She doesn’t step back.'),
      ],
      [
        ask(
          3,
          'social-studies',
          'think: is Pachacamac wrong?',
          null,
          [
            PX(
              'He wants to keep his people safe. She wants to keep the peace. Is Pachacamac simply wrong, do you think?',
            ),
          ],
          [
            o('Yes. Taking power to feel safe makes everyone less safe.', [
              PX(
                'That’s where I am. Though I notice he’s scared, under the shouting. Scared people make bad plans.',
              ),
            ]),
            o('No. He has to protect the clan somehow.', [
              PX(
                'He does. That’s the hard bit. The question is whether this way protects them, or just arms them.',
              ),
            ]),
            o('He’s not wrong to worry, but wrong about what to do.', [
              PX(
                'Right to worry, wrong about what to do. Yes. I think that’s most of the grown-ups I know, some days.',
              ),
            ]),
          ],
          'A think question: safety, fear and choices.',
        ),
      ],
      [
        ch(
          'stand',
          'Climb the steps and stand beside her.',
          [
            N(
              'You climb the steps and stand next to her, so that she isn’t standing alone in front of all of them.',
            ),
            N(
              'Pachacamac looks at you as if you were a fly, then looks away. Nothing changes at all.',
            ),
            TI('Thank you.', 'soft'),
          ],
          { 'pa1-stood': true },
        ),
        ch(
          'chao',
          'Stay down by the pools, with the Chao.',
          [
            N(
              'You stay below with the Chao. Your Nubbin climbs into your lap, and a few Chao climb in after it.',
            ),
            N(
              'From the top of the steps Tikal glances down at them, and at you, and her shoulders come down a little.',
            ),
          ],
          { 'pa1-stood': false },
        ),
      ],
    ),
    sc(
      'pa1-10-stand-done',
      [
        PA(
          'We march on the shrine at dawn, and take what the Emeralds can give. Tikal, you will stand aside, as a chief’s daughter should.',
        ),
        N(
          'He turns and goes, and his warriors go after him, and the torches go with them. The shrine is very dark.',
        ),
        N('Chaos’s green glow is the only light left, moving slowly under the water.'),
      ],
      [
        ask(
          0,
          'social-studies',
          'rules and fairness: “as a chief’s daughter should”',
          'D2.Civ.8.K-2',
          [
            N(
              'Pachacamac says Tikal must stand aside because of who her father is. Is that a fair rule?',
            ),
          ],
          [
            o(
              'No. A fair rule applies to what you do, not who you were born to.',
              [
                N(
                  'Yes. Rules are fair when they treat people by their actions, not their family. He is using his title to end an argument he can’t win.',
                ),
              ],
              true,
            ),
            o('Yes, he’s the chief', [
              N(
                'Being chief gives him power, but power isn’t the same as fair. A fair rule is about what people do, not who their parents are.',
              ),
            ]),
          ],
          'Thought about what makes a rule fair.',
        ),
      ],
    ),
    sc(
      'pa1-10-complete',
      [
        TI(
          'He wasn’t always like this. When I was small he carried me on his shoulders to see the Chao.',
          'sad',
        ),
        TI('Your being here doesn’t change anything. I know that.'),
        TI('I’m still glad. Isn’t that strange?', 'soft'),
        N(
          'Chaos sinks back into the pool, slowly. Its glow lights the water from underneath, green and troubled.',
        ),
        PX('Keeper. I don’t want to watch the next part.', 'soft'),
        Y('Neither do I.'),
      ],
      [
        ask(
          0,
          'literacy',
          'a character who changed',
          'RL.3.3',
          [
            TI(
              'He carried me on his shoulders once. Now he talks like a hammer. What do you think changed him?',
            ),
          ],
          [
            o(
              'Fear of the neighbours grew until it was all he could see',
              [
                TI(
                  'I think so too. Fear takes up room. There used to be space in him for the Chao, and now there is only room for walls.',
                ),
              ],
              true,
            ),
            o('He stopped loving her', [
              TI(
                'No. He still loves me; that is what makes it hard. He is afraid, and the fear has crowded everything else out.',
              ),
            ]),
          ],
          'Explained how a character changed and why.',
        ),
      ],
    ),
  ],
  [
    gloss(
      'clan',
      'A large group of families who share the same ancestors and live together.',
      'pa1-10-council',
    ),
    gloss('grizzled', 'Having grey or grey-streaked hair, usually from age.', 'pa1-10-council'),
  ],
);

// ================================================================== PA1-11 The Egg Carrier
const Q11: EduQuest = quest(
  'pa1-11',
  'The Egg Carrier',
  {
    'pa1-11-s1': G(
      'Board the Egg Carrier with Sonic and Tails.',
      'Tails’s plane will drop you on the deck. Stay close.',
    ),
    'pa1-11-s2': G(
      'Get the Egg Carrier’s Chao to the lifeboats.',
      'The lifeboats are two decks up, on the left. Bring every Chao.',
    ),
    'pa1-11-s3': G(
      'Keep back by the hatch while Sonic faces Chaos.',
      'Stay by the open hatch on the back deck.',
    ),
  },
  [
    sc(
      'pa1-11-board',
      [
        N(
          'Back in the present, the sky over Station Square is full of a shape: a flying fortress as big as a town, red and gold, humming.',
        ),
        TA(
          'That’s Eggman’s ship, the Egg Carrier. One of his robots grabbed Amy and the bird off the street. We’re going in.',
          'angry',
        ),
        SO('In, find Amy, out. Easy. You two coming? Stay close, and don’t press any red buttons.'),
        N(
          'Tails’s plane drops you on the deck in a roar of wind. Sonic is gone the moment his feet touch metal.',
        ),
        PX('Okay. A flying fortress. Brilliant. I love that. I hate that. Both.', 'shock'),
        N(
          'Klaxons, corridors, and signs that all say EGG something. Your Nubbin stays tucked inside your jacket.',
        ),
      ],
      [
        ask(
          4,
          'sel',
          'mixed feelings',
          'CASEL: Self-awareness',
          [
            PX(
              'I love that and I hate that, both. Is it possible to feel two opposite things at once?',
            ),
          ],
          [
            o(
              'Yes: excited and scared can come together',
              [
                PX(
                  'They can, and they do. Naming both is better than pretending one isn’t there. Hello, fortress.',
                ),
              ],
              true,
            ),
            o('No, you have to pick one', [
              PX(
                'I’ve tried. Excited and scared turn up together whether I pick or not. Naming both helps.',
              ),
            ]),
          ],
          'Learned that mixed feelings are normal and can be named.',
        ),
      ],
    ),
    sc(
      'pa1-11-board-done',
      [
        N(
          'Down a ladder, past a door marked EGG STORAGE, you hear something you don’t expect up here: Chao.',
        ),
        N('Small, cheerful, and somewhere below you.'),
      ],
      [
        notice(
          1,
          'science',
          'sound travels through metal',
          '1-PS4-1',
          [
            PX(
              'You can hear them through the floor because sound is a vibration, and metal passes vibrations along well. Put your ear to a railing sometime; you’ll hear the whole ship.',
            ),
          ],
          'Learned that sound travels as vibration through solids.',
        ),
      ],
    ),
    sc(
      'pa1-11-garden',
      [
        N(
          'There’s a Chao Garden inside the ship: plastic grass, a plastic tree, a pool of recycled water, and a dozen frightened Chao.',
        ),
        N('Eggman keeps one, it seems, for the reason he keeps everything: because he can.'),
        N('The floor shudders. Somewhere far below, something large has been hit.'),
        PX(
          'There are lifeboats. On the map. Two decks up, port side. Port is left. I looked it up.',
        ),
        N(
          'You pick up two Chao. Your Nubbin, without being told, gets three more to follow it in a wobbly line.',
        ),
        PX('Every one of them, Keeper. Not one stays behind in a plastic garden.'),
      ],
      [
        notice(
          3,
          'social-studies',
          'port and starboard',
          '2-ESS2-2',
          [
            PX(
              'Ships don’t say left and right, because left depends which way you’re facing. Port is always the ship’s left when you face the front, starboard its right.',
            ),
            PX('Trick to remember: “port” and “left” both have four letters.'),
          ],
          'Learned port and starboard.',
        ),
        ask(
          4,
          'maths',
          'how many trips',
          '3.OA.A.3',
          [
            PX(
              'A dozen Chao. You carry two, your Nubbin leads three. If every trip moves five, how many trips?',
            ),
          ],
          [
            o(
              '3 trips, with the last one lighter',
              [
                PX(
                  'Yes. Five, five, two: three trips. 12 shared into 5s is two full trips with two left over, so three.',
                ),
              ],
              true,
            ),
            o('2 trips', [
              PX('Two trips moves ten. There are twelve. You need a third trip for the last two.'),
            ]),
          ],
          'Divided with a remainder to find the number of trips.',
        ),
      ],
      [
        ch('carry', 'Carry them two at a time.', [
          N(
            'Two at a time, up the ladder and back down, over and over. Your arms ache, and nobody gets left.',
          ),
        ]),
        ch('line', 'Let your Nubbin lead them in a line.', [
          N(
            'Your Nubbin walks to the ladder, and every Chao follows it, one after another, like ducklings. You bring up the rear.',
          ),
        ]),
      ],
    ),
    sc(
      'pa1-11-garden-done',
      [
        N(
          'The last Chao is in the last lifeboat. You pull the lever, and it drops away under a parachute with Eggman’s face on it.',
        ),
        PX(
          'I can’t believe the parachutes have his face on them. No, I can. I can’t. I can.',
          'happy',
        ),
      ],
      [
        ask(
          0,
          'science',
          'how parachutes work',
          '3-PS2-1',
          [PX('Why does a parachute slow the lifeboat down?')],
          [
            o(
              'The big canopy pushes against the air, and the air pushes back',
              [
                PX(
                  'Yes. Weight pulls down; the air pushing up on all that cloth nearly balances it. Nearly balanced means slow.',
                ),
              ],
              true,
            ),
            o('It makes the lifeboat lighter', [
              PX(
                'Same weight. The cloth catches air, and the air pushes up against it. Two forces nearly balanced means a slow fall.',
              ),
            ]),
          ],
          'Learned that air resistance slows a parachute.',
        ),
      ],
    ),
    sc(
      'pa1-11-chaos',
      [
        N('Out on the back deck, Eggman stands at a rail with a fistful of glowing Emeralds.'),
        EG('Four, Chaos! Four Emeralds, my lovely puddle. Show them what you’ve become!', 'happy'),
        N(
          'Chaos rises out of a tank on the deck. It’s huge now, with great clawed arms, and the glow inside it flickers from green toward red.',
        ),
        N(
          'It isn’t looking at Eggman. It’s looking through the open hatch behind you, at the empty Chao Garden.',
        ),
        PX('It’s looking for them. It doesn’t know they got out.', 'soft'),
        N(
          'Sonic is already there, with Amy behind him holding the bird. You keep back by the hatch.',
        ),
      ],
      [
        ask(
          4,
          'literacy',
          'think: what does Chaos know?',
          null,
          [
            PX(
              'Chaos thinks the Chao are gone, and we know they’re floating down safe. If you could tell it one thing, what would you say?',
            ),
          ],
          [
            o('“They’re safe. They got out.”', [
              PX('Short and true. I’d say that. I don’t know if it would hear, but I’d say it.'),
            ]),
            o('“Stop. You’re scaring everyone.”', [
              PX(
                'Fair. It is. Though I think it’s too far inside its own fright to hear a telling-off.',
              ),
            ]),
            o('Nothing. It wouldn’t listen.', [
              PX(
                'Maybe not. Then I’d want to show it instead. Hold that thought; we might need it.',
              ),
            ]),
          ],
          'A think question: what a frightened character can hear.',
        ),
      ],
    ),
    sc(
      'pa1-11-chaos-done',
      [
        N(
          'There is a long, crashing fight that you mostly see through your fingers. At the end Chaos pours away over the side, still looking back.',
        ),
        AM('Keeper! You’re here too? Sonic saved us! Well. Sort of. I saved the bird.', 'happy'),
        N('The bird, in her hands, looks like it agrees.'),
      ],
      [
        ask(
          1,
          'sel',
          'sharing credit honestly',
          'CASEL: Self-awareness',
          [
            AM(
              'Sonic saved us. Well, sort of. I saved the bird. Is it all right to say what you did yourself?',
            ),
          ],
          [
            o(
              'Yes, if it’s true and you give others their share too',
              [
                AM(
                  'Exactly. He did the fighting, I did the bird. Both true. Saying both is honest, not showing off.',
                ),
              ],
              true,
            ),
            o('No, it sounds like boasting', [
              AM(
                'It would if I left Sonic out. But I didn’t. Saying what you did, and what others did, is just honest.',
              ),
            ]),
          ],
          'Learned to share credit honestly.',
        ),
      ],
    ),
    sc(
      'pa1-11-complete',
      [
        N(
          'From the rail you can see the lifeboats drifting down toward the sea: a dozen little parachutes, a dozen Chao.',
        ),
        N('Your Nubbin waves at them with both arms until the last one is out of sight.'),
        PX('That’s the Chao safe. Now everybody else.'),
      ],
      [
        doIt(
          0,
          'maths',
          'tally the parachutes',
          '2.MD.D.10',
          'edu:tally:parachutes:12',
          [
            PX(
              'Count the parachutes as they go and keep a tally: four strokes, then a line through for five. How many groups of five, and how many over?',
            ),
          ],
          'Kept a tally of twelve and read it in fives.',
        ),
      ],
    ),
  ],
  [
    gloss('fortress', 'A large, strong building or ship made to keep enemies out.', 'pa1-11-board'),
    gloss('klaxon', 'A very loud warning horn.', 'pa1-11-board'),
  ],
);

// ================================================================== PA1-12 Gamma
const Q12: EduQuest = quest(
  'pa1-12',
  'Gamma',
  {
    'pa1-12-s1': G(
      'See what happens to the robot from the garden.',
      'He’s in the hangar near the stern of the Egg Carrier.',
    ),
    'pa1-12-s2': G('Watch Gamma open the first of his brothers.', 'Stay with Amy by the cradles.'),
    'pa1-12-s3': G('Watch the sky from the plane.', 'Look back toward the clouds.'),
  },
  [
    sc(
      'pa1-12-gamma',
      [
        N(
          'In a hangar near the stern, the tall robot from the garden stands in front of Eggman, very straight.',
        ),
        EG(
          'Gamma! You let the bird go. You let the girl go. I built you, you ungrateful toaster!',
          'angry',
        ),
        GA('Query. Why was the bird the target?'),
        EG('Because I SAID so! Report to the scrap room. You’re obsolete.'),
        N(
          'Eggman stamps off, and Gamma stands alone in the hangar. Then it turns, and walks the other way.',
        ),
        AM(
          'He didn’t give me up, back in the garden. I think he’s trying to be good and doesn’t know how.',
          'soft',
        ),
        PX('Follow him? I want to follow him.'),
      ],
      [
        ask(
          3,
          'sel',
          '“because I said so”',
          'CASEL: Responsible decision-making',
          [N('Gamma asks why. Eggman answers “because I said so”. Is that a reason?')],
          [
            o(
              'No. It’s an order, not a reason.',
              [
                N(
                  'Right. A reason explains; an order just pushes. Gamma noticed the difference, and that is the moment it starts to choose for itself.',
                ),
              ],
              true,
            ),
            o('Yes, he’s the boss', [
              N(
                'Being the boss lets him give orders. It doesn’t make an order a reason. Gamma asked for a reason and got a push instead.',
              ),
            ]),
          ],
          'Told the difference between a reason and an order.',
        ),
      ],
    ),
    sc(
      'pa1-12-gamma-done',
      [
        N(
          'Gamma walks to a row of robots in their charging cradles. Its brothers: the same shape, in different colours.',
        ),
        N('Red, blue, green, yellow, and one in a colour you don’t have a name for.'),
      ],
      [
        notice(
          1,
          'literacy',
          'vocabulary: obsolete',
          'L.3.4',
          [
            PX(
              'Eggman called Gamma “obsolete”: out of date, replaced by something newer, no longer wanted. It’s a word for machines. He used it on someone who had just asked a question.',
            ),
          ],
          'Learned the word obsolete from context.',
        ),
      ],
    ),
    sc(
      'pa1-12-birds',
      [
        N(
          'Gamma opens a panel on the first robot’s back. Inside, where an engine might be, there is a small bird in a little cage, alive.',
        ),
        GA('Power source: living creature. Discovery logged.'),
        GA('This unit… also contains one.', 'think'),
        N(
          'It opens the cage. The bird hops onto Gamma’s hand, blinks, and flies up into the rafters.',
        ),
        AM('They run on birds? All of them? Oh, that’s horrible. Oh, poor Gamma.', 'sad'),
        N(
          'Gamma turns to you. It looks at your Nubbin for a long moment, the way it looked at the ring of Chao.',
        ),
        GA('You and the small one. Leave this ship. This unit has work to do.'),
      ],
      [
        ask(
          3,
          'science',
          'what a caged bird is missing',
          'K-LS1-1',
          [
            AM(
              'A bird in a cage the size of a tin. What does a bird need that a cage like that can’t give?',
            ),
          ],
          [
            o(
              'Room to fly, daylight, food and water it chooses',
              [
                AM(
                  'All of that. Animals need the things their bodies are built for. Wings need sky.',
                ),
              ],
              true,
            ),
            o('A smaller cage', [
              AM(
                'Smaller! No. Wings are built for flying. A bird needs room, daylight, and food and water it can choose.',
              ),
            ]),
          ],
          'Named what an animal needs to live well.',
        ),
      ],
      [
        ch('thank', 'Thank him.', [GA('Acknowledged.'), N('It turns back to its brothers.')]),
        ch('come', 'Ask him to come with you.', [
          GA('Negative. There are more of them. Go.'),
          N('It says it kindly. You hadn’t known a robot could.'),
        ]),
      ],
    ),
    sc(
      'pa1-12-birds-done',
      [
        N(
          'Tails comes back for you in the plane. You climb aboard with Amy, and the Egg Carrier falls away behind you into cloud.',
        ),
        N('Gamma stays. You don’t see what it does next, and nobody tells you.'),
      ],
      [
        ask(
          1,
          'sel',
          'think: was Gamma good?',
          null,
          [
            AM(
              'Gamma was built to do bad things, and then it set the birds free. Was Gamma good, do you think?',
            ),
          ],
          [
            o('Yes. What you do counts more than what you were made for.', [
              AM(
                'That’s what I think. It wasn’t built to be kind. It was kind anyway. That counts double.',
              ),
            ]),
            o('It was trying. Trying is most of it.', [
              AM(
                'Trying is most of it. I like that. Trying to be good when nobody showed you how is hard.',
              ),
            ]),
            o('I don’t know. It did chase the bird first.', [
              AM(
                'It did. I haven’t forgotten. Maybe good isn’t something you are. Maybe it’s something you start doing.',
              ),
            ]),
          ],
          'A think question: what makes someone good.',
        ),
      ],
    ),
    sc(
      'pa1-12-sky',
      [
        N('Nobody says much on the flight back. Tails flies low over the sea, and the plane hums.'),
        AM('He’ll be all right. Won’t he? He’s very big. Big things are usually all right.', 'sad'),
        PX('Amy. I don’t know.', 'soft'),
        N(
          'Your Nubbin is kneeling on the seat, looking back at the clouds, with both hands on the glass.',
        ),
        N(
          'Then, out of the cloud, very small, comes one bird. Then another, and another, scattering into the blue.',
        ),
        N('They fly free over the water, toward the land.'),
      ],
      [
        ask(
          2,
          'sel',
          'honest answers to hard questions',
          'CASEL: Relationship skills',
          [
            N(
              'Amy asks if Gamma will be all right. Pixel says “I don’t know.” Why not just say yes?',
            ),
          ],
          [
            o(
              'Because a kind lie can hurt more later than a true “I don’t know”',
              [
                N(
                  'Yes. Pixel could have said yes. She said the true thing gently instead. That is a harder kind of kindness, and a better one.',
                ),
              ],
              true,
            ),
            o('Because Pixel doesn’t care', [
              N(
                'She cares a lot; that is why she won’t pretend. A gentle “I don’t know” respects Amy more than a comforting fib.',
              ),
            ]),
          ],
          'Learned that honesty can be a form of kindness.',
        ),
      ],
    ),
    sc(
      'pa1-12-sky-done',
      [
        AM('That’s from him. I know it is.', 'soft'),
        PX('I’m fine. I’m not crying. The screen’s just very bright.', 'sad'),
        N('Tails flies a slow circle so everyone can watch the birds a little longer.'),
      ],
      [
        notice(
          2,
          'science',
          'birds flying toward land',
          '4-LS1-2',
          [
            TA(
              'They’re heading for the coast. Birds find land by sight, by the wind, and some by the Earth’s magnetism. Freed over the sea, they still know the way home.',
            ),
          ],
          'Learned how birds find their way.',
        ),
      ],
    ),
    sc(
      'pa1-12-complete',
      [
        N('Amy holds her own little bird up to the window, so it can see the others go.'),
        AM('Thank you, Gamma.', 'soft'),
        N('Your Nubbin stays at the glass until the last bird is out of sight.'),
      ],
      [
        ask(
          1,
          'literacy',
          'a last image',
          'RL.4.2',
          [
            N(
              'The story never shows what happens to Gamma. The last thing you see is birds flying free. Why end his part that way?',
            ),
          ],
          [
            o(
              'So what you remember is what he did, not what happened to him',
              [
                N(
                  'Yes. Writers choose the last image. Birds in the blue says: this is what Gamma made, and it is enough.',
                ),
              ],
              true,
            ),
            o('Because the writer forgot', [
              N(
                'Not forgotten: chosen. Ending on the birds puts what Gamma did at the centre, instead of what became of him.',
              ),
            ]),
          ],
          'Thought about why a writer chooses a last image.',
        ),
      ],
    ),
  ],
  [
    gloss('hangar', 'A large shed where aircraft are kept.', 'pa1-12-gamma'),
    gloss(
      'obsolete',
      'Out of date and no longer used, because something newer has replaced it.',
      'pa1-12-gamma-done',
    ),
  ],
);

// ================================================================== PA1-13 The Charge
const Q13: EduQuest = quest(
  'pa1-13',
  'The Charge',
  {
    'pa1-13-s1': G(
      'Go back with the light to the shrine at dawn.',
      'The light is waiting for you. Stand with Tikal on the top step.',
    ),
    'pa1-13-s2': G(
      'Stay in the light, and hold on to your Nubbin.',
      'You can’t change what happened here. Hold on.',
    ),
  },
  [
    sc(
      'pa1-13-dawn',
      [
        N('The rosy light comes for you, and this time it isn’t warm. It’s trembling.'),
        N(
          'The shrine at dawn, with mist on the pools. The Chao are still asleep in heaps on the warm steps.',
        ),
        N(
          'Tikal is awake. She sits on the top step in front of the altar, the way you sit when you’ve decided something.',
        ),
        TI('You came. You don’t have to stay for this. I wouldn’t, if I were you.', 'sad'),
        N('Chaos stands in the middle pool, tall and watchful, its glow steady and green.'),
        N('Far off, in the trees, drums start.'),
        PX('Keeper. I could pull the plug. Gently. Say the word.', 'sad'),
      ],
      [
        notice(
          1,
          'science',
          'morning mist',
          '2-ESS2-3',
          [
            N(
              'Mist at dawn: night air cooled until the water in it became tiny droplets you can see. Sun warms the air, droplets turn back to vapour, and the mist goes.',
            ),
          ],
          'Learned why mist forms at dawn and clears.',
        ),
        ask(
          6,
          'sel',
          'think: staying to watch a hard thing',
          null,
          [
            PX(
              'Tikal says you don’t have to stay. I could pull the plug. What do you want to do, and why?',
            ),
          ],
          [
            o('Stay. She shouldn’t be alone.', [
              PX('All right. I’ll stay too, then. On this side of the glass, but I’ll stay.'),
            ]),
            o('Go. I don’t want to see it.', [
              PX(
                'That’s allowed. Not wanting to watch something sad isn’t weak. We’ll stay just long enough to be with her, and then I’ll bring you out.',
              ),
            ]),
            o('Stay, but hold my Nubbin tight.', [
              PX(
                'Hold it tight. That’s what she said. Some things you can only get through holding on to someone.',
              ),
            ]),
          ],
          'A think question: choosing whether to witness something hard.',
        ),
      ],
      [
        ch('stay', 'Stay with Tikal.', [
          Y('I’ll stay.'),
          TI('Then hold your little one. Hold it close.', 'soft'),
        ]),
        ch('wake', 'Wake the Chao on the steps.', [
          N('You try, but they roll over, sleepy, and settle again. The drums are getting closer.'),
          TI('Let them sleep. Let them sleep as long as they can.', 'soft'),
        ]),
      ],
    ),
    sc(
      'pa1-13-dawn-done',
      [
        N(
          'Tikal goes down the steps and stands in front of the pools with her arms wide. The Chao wake one by one, and gather behind her.',
        ),
        N('She is smaller than any of the warriors, and she does not move.'),
      ],
      [
        ask(
          1,
          'literacy',
          'character trait: courage',
          'RL.3.3',
          [
            N(
              'Tikal stands in front of the pools, small, shaking, and not moving. What word would you use for her?',
            ),
          ],
          [
            o(
              'Brave',
              [
                N(
                  'Brave. Courage isn’t not being scared; it is being scared and standing there anyway. She is as scared as anyone, and she stays.',
                ),
              ],
              true,
            ),
            o('Foolish', [
              N(
                'Some might say so. But she isn’t pretending the danger isn’t there. She is scared and she stands anyway. The word for that is brave.',
              ),
            ]),
          ],
          'Described a character trait with evidence.',
        ),
      ],
    ),
    sc(
      'pa1-13-charge',
      [
        N('Pachacamac’s warriors come out of the trees in a line, and do not stop.'),
        TI('Father! Stop! Please, the Chao!', 'shock'),
        N(
          'They do not stop. The rosy light closes round you, and the shrine goes dim and far away, the way a dream goes when you wake.',
        ),
        N(
          'You hear it through the light rather than see it: the trampling, and small voices, and then a sound like the sea standing up.',
        ),
        N('Then firelight, orange through the gold. Then nothing, for a long while.'),
        N(
          'Here is what happened, plainly. The warriors ran through the pools to reach the altar, and they did not look where they stepped.',
        ),
        N(
          'Some of the Chao were hurt, and some of them died. Chaos saw it. Its grief and anger rose together as a flood, and the flood took the clan.',
        ),
        N(
          'Through it all, very clearly, you hear Tikal, talking to Chaos as you would to a frightened child.',
        ),
        TI('Please. Hold it. Hold it, and I’ll stay with it. I’ll stay.', 'sad'),
        N(
          'A great green light. Then silence. Tikal and Chaos go into the Emerald together, so that neither of them is alone.',
        ),
        N(
          'Your Nubbin is pressed against your chest, perfectly still, with both hands over its eyes.',
        ),
      ],
      [
        ask(
          9,
          'sel',
          'grief and comfort',
          'CASEL: Social awareness',
          [
            N(
              'Tikal could not stop what happened. She could stay with Chaos. When something terrible can’t be undone, what is left to do?',
            ),
          ],
          [
            o(
              'Stay with the one who is hurting, so they are not alone',
              [
                N(
                  'Yes. Not fixing. Staying. It is what Tikal does, and it is what people do for each other after a loss. Being there is not nothing.',
                ),
              ],
              true,
            ),
            o('Nothing. It’s over.', [
              N(
                'The event is over; the hurt isn’t. Staying beside someone who is grieving is the one thing that is always left to do, and it matters.',
              ),
            ]),
          ],
          'Heard a loss named plainly and what comfort remains.',
        ),
      ],
    ),
    sc(
      'pa1-13-charge-done',
      [
        N(
          'When the light lets go, you are back on the floating island in the present, and it is raining, very softly.',
        ),
        PX('I’m here. I’m just being quiet for a bit.', 'soft'),
        N('The rain on the broken altar makes a sound like someone breathing out.'),
      ],
      [
        notice(
          1,
          'sel',
          'being quiet after something sad',
          'CASEL: Self-management',
          [
            N(
              'Pixel goes quiet. That is a way of looking after a big feeling: not rushing to talk, letting it settle. Quiet together is still together.',
            ),
          ],
          'Learned that quiet is a way to handle a big feeling.',
        ),
      ],
    ),
    sc(
      'pa1-13-complete',
      [
        N(
          'Knuckles finds you sitting by the broken altar. He doesn’t ask anything; he sits down on the other side of it.',
        ),
        KN('Bad dream?'),
        Y('An old one.'),
        KN('Yeah. This place has a lot of those.', 'sad'),
        N(
          'After a while he gets up, comes back with a big leaf to keep the rain off your Nubbin, and sits down again.',
        ),
      ],
      [
        ask(
          4,
          'literacy',
          'showing, not telling',
          'RL.2.3',
          [
            N(
              'Knuckles doesn’t say “I’m sorry you’re sad”. He fetches a leaf. What is the story showing you about him?',
            ),
          ],
          [
            o(
              'He is kind, and shows it in actions, not words',
              [
                N(
                  'Yes. Writers often show a feeling through what a character does. The leaf says more than a speech would, and it’s more Knuckles.',
                ),
              ],
              true,
            ),
            o('He likes leaves', [
              N(
                'He might, but the leaf is for the Nubbin, in the rain. It shows his kindness without a single word about it.',
              ),
            ]),
          ],
          'Read a character’s feeling from an action.',
        ),
      ],
    ),
  ],
  [
    gloss(
      'grief',
      'The deep sadness you feel when someone or something you love is gone.',
      'pa1-13-charge',
    ),
    gloss('trampling', 'Treading heavily on something and crushing it underfoot.', 'pa1-13-charge'),
  ],
);

// ================================================================== PA1-14 The Ruins
const Q14: EduQuest = quest(
  'pa1-14',
  'The Ruins',
  {
    'pa1-14-s1': G(
      'Look at the murals in the old temple.',
      'The temple is in the jungle below the Mystic Ruins. Walk along the painted wall.',
    ),
    'pa1-14-s2': G(
      'Listen to what the light has to say.',
      'Stand with Sonic in front of the murals.',
    ),
  },
  [
    sc(
      'pa1-14-murals',
      [
        N(
          'In the jungle below the Mystic Ruins stands an old stepped temple, its stones the same as Tikal’s shrine. Older now, by thousands of years.',
        ),
        N('Inside, the walls are covered in murals, carved and painted, faded but still clear.'),
        N(
          'A pool with small round shapes in it, and a girl with braids. A tall shape made of water stands over them.',
        ),
        N(
          'Further along: a line of warriors. Then fire, painted in a red that has gone brown with age.',
        ),
        N(
          'Then a great green stone with the water-shape inside it, and the girl curled up beside it like someone asleep.',
        ),
        PX(
          'That’s her. That’s Tikal. They painted it all. Somebody stayed behind and painted it.',
          'sad',
        ),
        N(
          'Your Nubbin puts its hand flat on a painted Chao, very gently, the way you’d touch something sleeping.',
        ),
      ],
      [
        ask(
          3,
          'science',
          'why old paint changes colour',
          '2-PS1-4',
          [PX('Red gone brown with age. What happens to colours over thousands of years?')],
          [
            o(
              'Light and air slowly change the paint, and it fades or darkens',
              [
                PX(
                  'Yes. Sunlight and air react with the colours bit by bit. Some changes, like this one, can’t be undone; the red isn’t coming back.',
                ),
              ],
              true,
            ),
            o('Someone repainted it brown', [
              PX(
                'Nobody’s been here with a brush in a long time. Light and air changed the red slowly, and that change doesn’t reverse.',
              ),
            ]),
          ],
          'Learned that some changes caused by light and air do not reverse.',
        ),
        notice(
          5,
          'social-studies',
          'murals as a record',
          'D2.His.2.K-2',
          [
            N(
              'Before writing was common, people painted what happened so it was remembered. A mural is evidence: you can’t ask the painter, but you can read what they chose to show.',
            ),
          ],
          'Learned how pictures can record history.',
        ),
      ],
      [
        ch('touch', 'Touch the painted girl.', [
          N('The stone is cool. Under your hand, for a moment, it feels a little warmer.'),
        ]),
        ch('read', 'Look for writing.', [
          N(
            'There are marks under each panel in a script you can’t read. Pixel tries to zoom in and gets a lot of moss.',
          ),
          PX('Sorry. Moss. Very high-resolution moss.'),
        ]),
      ],
    ),
    sc(
      'pa1-14-murals-done',
      [
        N('Footsteps behind you. Sonic comes in out of the rain, shaking himself like a dog.'),
        SO('Hey. Following me again? Or am I following you? It’s getting hard to tell.'),
        N('Your Nubbin shakes itself too, in sympathy, though it is perfectly dry.'),
      ],
      [
        ask(
          2,
          'sel',
          'copying as friendliness',
          'CASEL: Social awareness',
          [
            N(
              'Your Nubbin shakes itself like Sonic, though it isn’t wet. Why do friends copy each other?',
            ),
          ],
          [
            o(
              'Copying says “I’m with you” without words',
              [
                N(
                  'Yes. People and animals mirror the ones they like. It is one of the oldest ways of saying: I’m on your side.',
                ),
              ],
              true,
            ),
            o('It thought it was wet', [
              N(
                'Bone dry. It copied Sonic because it likes him. Mirroring someone is a wordless way of saying you’re on their side.',
              ),
            ]),
          ],
          'Noticed mirroring as a sign of friendliness.',
        ),
      ],
    ),
    sc(
      'pa1-14-tikal',
      [
        N('The rosy light drifts out from behind a pillar and hangs in front of the murals.'),
        N(
          'Then, for a moment, it isn’t a light. It’s a girl with braids, made of soft pink glow, standing in the temple.',
        ),
        SO('Whoa. Uh. Hi?', 'shock'),
        N(
          'Tikal lived thousands of years ago, and she died long ago. What stands here is what she left behind: her light, which stayed to keep watch over Chaos.',
        ),
        TI('You’ve been fighting Chaos. I’ve watched you.', 'soft'),
        TI(
          'It isn’t angry at you. It never really was. It’s carrying something too heavy, and it doesn’t know how to put it down.',
        ),
        TI(
          'When the ones it loved were hurt, it took all that grief and turned it into the only thing it knew. Power. A flood.',
        ),
        TI(
          'The man who calls himself Eggman is feeding it the Emeralds. Each one makes the grief bigger. Not the creature. The grief.',
          'sad',
        ),
        SO('So how do I stop it?'),
        TI('I don’t know that you can stop it. I couldn’t. I could only hold it.'),
        TI('Maybe someone could help it put it down.', 'think'),
        N(
          'She looks at you as she says it, and at your Nubbin. Then she is only a light again, and then not even that.',
        ),
      ],
      [
        ask(
          7,
          'literacy',
          'metaphor: carrying something too heavy',
          'L.4.5',
          [
            N(
              '“Carrying something too heavy.” Chaos isn’t holding anything. What is the heavy thing?',
            ),
          ],
          [
            o(
              'Its grief',
              [
                N(
                  'Yes. Grief is the weight. The metaphor lets you feel how heavy a feeling can be, and why Tikal talks about putting it down.',
                ),
              ],
              true,
            ),
            o('The Emeralds', [
              N(
                'The Emeralds make it bigger, but they aren’t the load. The heavy thing is grief, and the metaphor is about feelings having weight.',
              ),
            ]),
          ],
          'Explained a metaphor for a feeling.',
        ),
        ask(
          10,
          'sel',
          'think: can grief be put down?',
          null,
          [
            TI(
              'I could only hold it. Maybe someone could help it put it down. Do you think a feeling that big can ever be put down?',
            ),
          ],
          [
            o('Yes, slowly, with help', [
              TI(
                'Slowly, with help. I think that is right. I had no one to help me, only the holding.',
              ),
            ]),
            o('No, but it can get lighter', [
              TI(
                'Lighter. Perhaps that is what putting it down means. Not gone. Carried differently.',
              ),
            ]),
            o('I don’t know', [
              TI(
                'Nor do I, yet. Thank you for not pretending. That is more than most people give me.',
              ),
            ]),
          ],
          'A think question: living with a big feeling.',
        ),
      ],
    ),
    sc(
      'pa1-14-tikal-done',
      [
        SO('Well. That was new.'),
        SO('Grief, huh. Can’t outrun that one.', 'think'),
        N('He goes anyway, very fast, out into the rain.'),
      ],
      [
        ask(
          1,
          'literacy',
          'irony',
          'RL.3.6',
          [
            N(
              'Sonic says you can’t outrun grief, and then runs off at top speed. What’s funny-sad about that?',
            ),
          ],
          [
            o(
              'He knows running won’t help, and runs anyway, because it’s what he does',
              [
                N(
                  'Yes. That gap between what he knows and what he does is irony, and it tells you he is a bit scared too.',
                ),
              ],
              true,
            ),
            o('Nothing, he’s just fast', [
              N(
                'He is fast. But he’s just said speed won’t help, and then uses it. The gap between knowing and doing is the funny-sad bit.',
              ),
            ]),
          ],
          'Noticed irony in a character’s words and actions.',
        ),
      ],
    ),
    sc(
      'pa1-14-complete',
      [
        PX('Keeper. I’ve got something to say, and it’s probably nothing.'),
        PX('Back home. The old story, about the fierce one who loved them too hard.', 'think'),
        PX('It’s probably nothing. It just feels like the same shape.', 'soft'),
        N(
          'Your Nubbin looks up at the painted water-shape for a long time before it will come away.',
        ),
      ],
      [
        ask(
          2,
          'literacy',
          'comparing stories',
          'RL.4.2',
          [
            PX(
              'Two stories, the same shape. What do Chaos and the fierce one from home have in common?',
            ),
          ],
          [
            o(
              'Both loved the small ones so much that holding on became harm',
              [
                PX(
                  'That’s the shape. Love that grips too tight. Stories from different places keep finding it, which makes me think it’s true.',
                ),
              ],
              true,
            ),
            o('Both are made of water', [
              PX(
                'Only one is. The shape I mean is underneath: love that held on too tight and did harm. Both stories have that.',
              ),
            ]),
          ],
          'Compared the theme of two stories.',
        ),
      ],
    ),
  ],
  [
    gloss('mural', 'A large picture painted straight onto a wall.', 'pa1-14-murals'),
    gloss(
      'irony',
      'When what someone says or does is the opposite of what you’d expect, often in a way that is funny or sad.',
      'pa1-14-tikal-done',
    ),
  ],
);

// ================================================================== PA1-15 Perfect Chaos
const Q15: EduQuest = quest(
  'pa1-15',
  'Perfect Chaos',
  {
    'pa1-15-s1': G(
      'Get high when the water comes.',
      'Head for the fire escape on the side of the bank.',
    ),
    'pa1-15-s2': G(
      'Carry Chao and people up to the rooftops.',
      'Up the bank’s fire escape and back down. Pixel will count the floors.',
    ),
  },
  [
    sc(
      'pa1-15-flood',
      [
        N(
          'By morning the last Emeralds are gone from Eggman’s ship. You find out where when the sky over Station Square turns dark green.',
        ),
        N(
          'Out of the bay rises Chaos, and it keeps rising: a great serpent of clear water with a green-white glow, taller than the hotel.',
        ),
        N(
          'Eggman’s new ship roars in toward it, all guns and confidence. Chaos lifts one coil and swats it out of the sky like a fly.',
        ),
        EG('That… was not in the plan!', 'shock'),
        N(
          'Then the water comes. Not a wave, but a rising: a whole sea standing up and walking into the city.',
        ),
        PX('Get up high. Keeper, get up high, now. Find a roof.', 'shock'),
        N(
          'The streets are full of people running, some of them carrying Chao. Some of the Chao are carrying each other.',
        ),
      ],
      [
        ask(
          5,
          'health',
          'flood safety',
          'K-2-ETS1-1',
          [
            PX(
              'Water in the streets. The problem is: how do we stay out of it? What’s the first thing to do?',
            ),
          ],
          [
            o(
              'Get to high ground and stay there',
              [
                PX(
                  'Yes. Water goes to the lowest place, so you go to the highest. Roofs, hills, upstairs. Then you help from there.',
                ),
              ],
              true,
            ),
            o('Try to swim through it', [
              PX(
                'Moving floodwater is stronger than it looks. Highest place first, every time. Then help from there.',
              ),
            ]),
          ],
          'Learned the first rule of flood safety.',
        ),
      ],
    ),
    sc(
      'pa1-15-flood-done',
      [
        N('Water pours down the station steps like a waterfall going the wrong way.'),
        N('Your Nubbin watches it with its mouth open.'),
      ],
      [
        notice(
          0,
          'science',
          'water always runs downhill',
          '4-ESS2-1',
          [
            PX(
              'Water always runs downhill: that’s why it’s on the steps and not the roofs. Over ages, running water wears rock away and carves valleys. One morning just rearranges the benches.',
            ),
          ],
          'Learned that water flows downhill and shapes the land.',
        ),
      ],
    ),
    sc(
      'pa1-15-roofs',
      [
        N(
          'There’s a fire escape on the side of the bank. At the bottom of it, the water is already over your knees.',
        ),
        N(
          'A man with a pushchair, and a boy holding two Chao he found in a fountain. An old woman who won’t leave without her cat.',
        ),
        PX(
          'Pushchair first. Then the boy. I’ll count the floors for you; I can see the whole street from here.',
        ),
        N(
          'Up and down the iron stairs, over and over. Your Nubbin swims as it has never swum before, strong and steady, with a Chao on its back.',
        ),
        N('From here you can’t see the hotel, or the garden behind it.'),
        PX('Two more down there. Go on. I’ve got the count.'),
      ],
      [
        ask(
          2,
          'social-studies',
          'think: who first?',
          null,
          [
            PX(
              'Pushchair first, then the boy, then the lady and her cat. That’s my order. Would you choose the same?',
            ),
          ],
          [
            o('Yes: the ones who can’t climb go first', [
              PX(
                'That’s my reasoning. The baby can’t climb at all; the boy is slowed by Chao; the lady can wait with us. It’s not about who matters most.',
              ),
            ]),
            o('The old lady first; she’s slowest', [
              PX(
                'That’s fair too. Slowest first is a good rule. I went by who couldn’t climb at all, but there isn’t one right answer here.',
              ),
            ]),
            o('Whoever is closest', [
              PX(
                'Closest is quick, and quick counts in water. I’d still look for the ones who can’t move themselves. Different rules, all trying to be fair.',
              ),
            ]),
          ],
          'A think question: deciding an order when everyone needs help.',
        ),
        ask(
          3,
          'maths',
          'counting floors: climbing and descending',
          '2.OA.A.1',
          [
            PX(
              'Five floors up to the roof. Four trips up and down. How many floors have you climbed, going up only?',
            ),
          ],
          [
            o(
              '20',
              [
                PX(
                  'Twenty floors up, and twenty down. That’s why your legs feel like that. 5 times 4 is 20.',
                ),
              ],
              true,
            ),
            o('9', [
              PX(
                'Nine would be five plus four. It’s five floors each trip, four times: 5, 10, 15, 20.',
              ),
            ]),
          ],
          'Multiplied to find a total.',
        ),
      ],
      [
        ch('cat', 'Go back for the old woman’s cat.', [
          N(
            'The cat is on top of a postbox, furious and dry. It lets you carry it the way a queen lets you carry her luggage.',
          ),
        ]),
        ch('raft', 'Go back for the Chao on a floating bin lid.', [
          N(
            'The Chao is riding the bin lid like a raft, quite calm. It holds out its arms to your Nubbin as if it ordered a lift.',
          ),
        ]),
      ],
    ),
    sc(
      'pa1-15-roofs-done',
      [
        N(
          'The roof of the bank is crowded and wet, and nobody is missing. The old woman’s cat sits on the air vent, judging everyone.',
        ),
        PX('Everyone’s up. Everyone I can see is up. Good. Good.', 'soft'),
        N('The boy counts his two Chao, then counts them again.'),
      ],
      [
        ask(
          2,
          'maths',
          'checking a count',
          'K.CC.B.4',
          [
            N(
              'The boy counts his two Chao twice. Knuckles counted his shards twice. Why count something precious twice?',
            ),
          ],
          [
            o(
              'Because a count can be wrong, and checking costs nothing',
              [
                N(
                  'Yes. Counting again is how you make sure. Every careful person does it, from shards to Chao to the people on a roof.',
                ),
              ],
              true,
            ),
            o('Because they forgot the first number', [
              N(
                'Not forgetting: checking. A second count catches a mistake the first one missed. Careful people count twice.',
              ),
            ]),
          ],
          'Learned why a count is checked.',
        ),
      ],
    ),
    sc(
      'pa1-15-complete',
      [
        N(
          'From the rooftop, the city is a lake. Chaos coils through it, huge and slow, roaring like the sea.',
        ),
        N(
          'It doesn’t seem to see the people on the roofs at all. It’s looking for something under the water, and not finding it.',
        ),
        PX(
          'It’s still looking for them. After all this time. It’s still looking for its Chao.',
          'sad',
        ),
      ],
      [
        ask(
          1,
          'literacy',
          'motive',
          'RL.3.3',
          [
            N(
              'Chaos has flooded a city, and it isn’t looking at the people at all. What does that tell you about what it wants?',
            ),
          ],
          [
            o(
              'It isn’t trying to hurt anyone. It is searching for its Chao.',
              [
                N(
                  'Yes. Watching what a character looks at tells you its motive. Chaos looks under the water, for the small ones. The flood is grief, not hate.',
                ),
              ],
              true,
            ),
            o('It wants to rule the city', [
              N(
                'A ruler would look at the people. Chaos looks under the water, for the Chao. Its motive is searching, not ruling.',
              ),
            ]),
          ],
          'Found a character’s motive from what it pays attention to.',
        ),
      ],
    ),
  ],
  [
    gloss('serpent', 'A snake, especially a very large one in stories.', 'pa1-15-flood'),
    gloss(
      'coil',
      'A loop of something long and bendy, like rope or a snake’s body.',
      'pa1-15-flood',
    ),
  ],
);

// ================================================================== PA1-16 Positive Energy
const Q16: EduQuest = quest(
  'pa1-16',
  'Positive Energy',
  {
    'pa1-16-s1': G(
      'Watch Sonic’s friends bring him the Emeralds.',
      'Stay on the bank roof. They are coming to you.',
    ),
    'pa1-16-s2': G(
      'Hold the Chao close and watch.',
      'Stay on the roof with the Chao in your arms.',
    ),
  },
  [
    sc(
      'pa1-16-friends',
      [
        N(
          'Sonic lands on your roof, soaked and, for once, out of breath. He stares at the thing in the water.',
        ),
        SO('Okay. That’s big. That’s really, really big.', 'shock'),
        N(
          'One by one they come: Tails in his plane, Knuckles up the drainpipe, Amy with the blue bird. Big, with Froggy back in his hat.',
        ),
        N(
          'Each of them is holding an Emerald. All seven, dull now and grey-green, with the light drained out of them.',
        ),
        KN('Chaos used them up. They’re empty.', 'angry'),
        TA('Not empty. Not all the way.', 'think'),
        TA(
          'Chaos took the bad side of them, the anger, all that grief. But there’s still something left in them. The good.',
        ),
        TA('Use what’s left, Sonic. Use the good.'),
      ],
      [
        ask(
          3,
          'maths',
          'who holds what',
          '1.OA.A.1',
          [PX('Seven Emeralds. Sonic’s five friends hold one each. Who’s holding the other two?')],
          [
            o(
              'Sonic must have two',
              [
                PX(
                  'Yes: 7 take away 5 leaves 2, and Sonic is the only one left. He had two in his pockets all along, the show-off.',
                ),
              ],
              true,
            ),
            o('Nobody', [
              PX('All seven are here. 7 take 5 is 2, and the only one left to hold them is Sonic.'),
            ]),
          ],
          'Subtracted to find what was unaccounted for.',
        ),
        ask(
          7,
          'sel',
          'think: using the good that’s left',
          null,
          [
            TA(
              'Chaos took the anger out of them, and the good is still there. Do you think that’s true of people too: something good left, even after a lot of bad?',
            ),
          ],
          [
            o('Yes. Nobody is all used up.', [
              TA(
                'That’s what I hope. Even an empty-looking Emerald has a glow if you know how to look.',
              ),
            ]),
            o('Sometimes. It depends how much was taken.', [
              TA(
                'Sometimes. That’s honest. Some things get drained a long way down. But I’ve not met one with nothing left.',
              ),
            ]),
            o('I don’t know. Chaos took a lot.', [
              TA('It did. We’re about to find out. If this works, I think the answer is yes.'),
            ]),
          ],
          'A think question: what remains after harm.',
        ),
      ],
    ),
    sc(
      'pa1-16-friends-done',
      [
        N('Sonic looks round at all of them, and then, for some reason, at you and your Nubbin.'),
        SO('The good, huh. Okay. Let’s see what we’ve got.'),
        N('Your Nubbin holds up its spanner, in case that helps.'),
      ],
      [
        notice(
          0,
          'sel',
          'looking at your friends before a hard thing',
          'CASEL: Relationship skills',
          [
            N(
              'Before the hardest thing he has ever done, Sonic looks at every friend on the roof. Courage borrows from the people around you. That isn’t cheating; it’s how courage works.',
            ),
          ],
          'Noticed how friends give courage.',
        ),
      ],
    ),
    sc(
      'pa1-16-super',
      [
        N(
          'The Emeralds rise out of everybody’s hands and circle Sonic, slowly at first, then faster.',
        ),
        N(
          'They don’t blaze. They glow, soft and warm and gold, like seven lamps being lit in a dark house.',
        ),
        N(
          'A Chao from the fire escape climbs into your arms, then another. You hold them both, and your Nubbin holds on to your sleeve.',
        ),
        N(
          'Sonic goes gold all over, bright as a summer morning. Then he’s gone, up into the sky, flying.',
        ),
        PX('He’s flying. He can fly now. Oh, I wish you could see your own face.', 'happy'),
        N(
          'Out over the flooded city, a gold spark circles a great coil of water, round and round, like a bee round a bear.',
        ),
      ],
      [
        ask(
          1,
          'literacy',
          'simile: like seven lamps being lit in a dark house',
          'L.4.5',
          [
            N(
              '“Like seven lamps being lit in a dark house.” Why lamps in a house, and not fireworks?',
            ),
          ],
          [
            o(
              'Lamps are gentle and homely: the Emeralds are warming, not exploding',
              [
                N(
                  'Yes. Fireworks would mean danger and noise. Lamps in a house mean comfort coming back room by room. The simile sets the mood.',
                ),
              ],
              true,
            ),
            o('Because it is night', [
              N(
                'It’s morning, actually. The point is the feeling: lamps in a house are gentle and safe, and so is this light.',
              ),
            ]),
          ],
          'Explained why a writer chose a particular simile.',
        ),
        notice(
          5,
          'science',
          'energy changes form',
          '4-PS3-4',
          [
            PX(
              'Light from the Emeralds becomes speed and flight in Sonic: energy changing form. Machines do the same. A torch turns battery energy into light; a windmill turns wind into turning.',
            ),
          ],
          'Learned that energy can change from one form to another.',
        ),
      ],
      [
        ch('hold', 'Hold the Chao and watch.', [
          N(
            'You hold them and watch. One of them falls asleep, which seems like the bravest thing anyone has done all day.',
          ),
        ]),
        ch('cheer', 'Cheer.', [
          N('You cheer, and Amy cheers louder. Big cheers so loud that Froggy hides in his hat.'),
        ]),
      ],
    ),
    sc(
      'pa1-16-super-done',
      [
        N(
          'The gold spark strikes, and strikes again. Chaos roars and shrinks, and roars and shrinks.',
        ),
        N(
          'Then the water goes down all at once, the way a bath drains when someone pulls the plug.',
        ),
      ],
      [
        ask(
          1,
          'science',
          'where floodwater goes',
          '2-ESS2-3',
          [
            PX(
              'The water goes down like a bath draining. In a real flood, where does the water go when it goes?',
            ),
          ],
          [
            o(
              'Back to the sea and rivers, into the ground, and some into the air',
              [
                PX(
                  'Yes. Downhill to rivers and sea, soaking into soil, and slowly evaporating. It all stays in the water cycle; it just moves.',
                ),
              ],
              true,
            ),
            o('It disappears', [
              PX(
                'Water doesn’t vanish. It drains to the sea, soaks into the ground, or evaporates into the air, and comes round again as rain.',
              ),
            ]),
          ],
          'Learned where floodwater goes in the water cycle.',
        ),
      ],
    ),
    sc(
      'pa1-16-complete',
      [
        N(
          'The sea pulls back out of the streets. Cars, benches and lamp posts come up out of it, dripping and surprised.',
        ),
        N(
          'In the middle of the square, in a puddle no bigger than a pond, something small is left.',
        ),
        PX('Is that…?', 'think'),
      ],
      [
        ask(
          1,
          'maths',
          'comparing sizes',
          'K.MD.A.2',
          [
            PX(
              'Taller than a hotel an hour ago. A pond-sized puddle now. If the hotel is 40 metres and the puddle is 4 metres across, how many times smaller is it?',
            ),
          ],
          [
            o(
              '10 times',
              [
                PX(
                  'Ten times. 40 shared into 4 is 10. From the biggest thing in the city to something you could step over.',
                ),
              ],
              true,
            ),
            o('36 times', [
              PX(
                '36 is the difference, not the “how many times”. 40 shared into 4 is 10 times smaller.',
              ),
            ]),
          ],
          'Compared two sizes as a multiple.',
        ),
      ],
    ),
  ],
  [
    gloss('drained', 'Emptied out, with the energy or liquid gone.', 'pa1-16-friends'),
    gloss(
      'evaporate',
      'To turn from liquid into vapour and disappear into the air.',
      'pa1-16-super-done',
    ),
  ],
);

// ================================================================== PA1-17 The Chao
const Q17: EduQuest = quest(
  'pa1-17',
  'The Chao',
  {
    'pa1-17-s1': G(
      'Wade out to the small shape in the puddle.',
      'Down the fire escape and across the square to the fountain.',
    ),
    'pa1-17-s2': G(
      'Let Chaos see the garden Chao.',
      'Look up at the hotel roof. (If you locked the gate, wade back to the garden and open it.)',
    ),
  },
  [
    sc(
      'pa1-17-small',
      [
        N('You climb down the fire escape into ankle-deep water and wade across the square.'),
        N(
          'In the puddle by the fountain is Chaos, the way you first saw it. Small now, person-sized, clear and quiet.',
        ),
        N(
          'The glow in its chest is faint and green. It isn’t trying to rise; it’s only looking around.',
        ),
        SO('Easy. Easy, everybody. I don’t think it wants to fight anymore.'),
        N('Your Nubbin goes and sits at the edge of the puddle. Chaos looks down at it.'),
        PX('It thinks they’re gone, doesn’t it? It thinks it’s all happened again.', 'sad'),
      ],
      [
        ask(
          5,
          'sel',
          'old fear in a new place',
          'CASEL: Social awareness',
          [
            PX(
              'It thinks it has all happened again. Why would Chaos feel the old loss right now, when nothing has happened to these Chao?',
            ),
          ],
          [
            o(
              'A big loss leaves a mark, and anything like it brings the feeling back',
              [
                PX(
                  'Yes. That’s how grief works. It doesn’t need a new reason; it only needs a reminder. An empty square is a reminder.',
                ),
              ],
              true,
            ),
            o('It forgot what happened', [
              PX(
                'The opposite: it remembers too well. The empty square looks like the old day, and the old feeling comes back with it.',
              ),
            ]),
          ],
          'Learned that old grief can be stirred by a reminder.',
        ),
      ],
      [
        ch('sit', 'Sit down at the edge of the puddle, beside your Nubbin.', [
          N(
            'You sit in the wet. Chaos looks at you, then back at your Nubbin, and doesn’t move away.',
          ),
        ]),
        ch('back', 'Keep back and let it look.', [
          N(
            'You stay where you are. Everyone in the square seems to have decided the same thing at once.',
          ),
        ]),
      ],
    ),
    sc(
      'pa1-17-small-done',
      [
        N(
          'Chaos looks round the empty square: at the dripping buildings, at all the people, and at none of the small ones.',
        ),
        N('Its glow flickers once, lower.'),
      ],
      [
        notice(
          0,
          'literacy',
          'repetition for effect',
          'RL.2.4',
          [
            N(
              '“At the buildings, at all the people, and at none of the small ones.” The list builds up, then drops to nothing, so the missing thing lands hardest.',
            ),
          ],
          'Noticed how a list is built to make the last item land.',
        ),
      ],
    ),
    sc(
      'pa1-17-chao',
      [
        N('Then a sound comes from above: small, cheerful, unmistakable.'),
        N(
          'Along the edge of the hotel roof, a whole row of Chao is sitting with their legs dangling over the gutter. The garden Chao.',
        ),
        N(
          'They went out through the open gate when the water came. They went where everyone went: up.',
        ),
        N(
          'Now, one by one, they come down: by the drainpipe, by the fire escape, by sliding down awnings with their arms out.',
        ),
        N('They walk right up to the edge of the puddle. They aren’t afraid of it at all.'),
        N('Chaos looks at them. The glow in its chest goes still, and soft, and warm.'),
        PX('They’re all right. Oh, they’re all right. And it can see.', 'soft'),
        N('A Chao reaches up and touches the water. Chaos bends, slowly, and lets it.'),
      ],
      [
        ask(
          2,
          'social-studies',
          'the gate choice pays off',
          'D2.Civ.8.K-2',
          [
            PX(
              'You left the gate open, fifteen quests ago. Look what it meant. Why did an open gate keep them safe?',
            ),
          ],
          [
            o(
              'Because they could choose to leave when the danger came',
              [
                PX(
                  'Yes. Safe wasn’t a locked door; it was being free to move. The rule that let them wander was the rule that saved them.',
                ),
              ],
              true,
            ),
            o('Because the water couldn’t get through a gate', [
              PX(
                'Water goes through anything. They were safe because they could leave when they needed to. Freedom to move was the protection.',
              ),
            ]),
          ],
          'Saw an early choice pay off, and why.',
        ),
      ],
    ),
    sc(
      'pa1-17-chao-done',
      [
        N(
          'Chaos sinks down, smaller and smaller, until it is only a little taller than the Chao themselves.',
        ),
        N(
          'It sits down in the puddle among them. For the first time since you’ve known it, it looks to be at rest.',
        ),
      ],
      [
        ask(
          1,
          'sel',
          'think: safe or well?',
          null,
          [
            PX(
              'The Chao were always going to be alive somewhere. But Chaos needed to see them well, not just safe. Is there a difference between safe and well?',
            ),
          ],
          [
            o('Yes. Safe is not being hurt. Well is being happy and free.', [
              PX(
                'That’s how I’d put it. Locked in a cupboard is safe. It isn’t well. Chaos needed the second one.',
              ),
            ]),
            o('Not much. If you’re safe, you’re fine.', [
              PX(
                'I used to think so. Then I looked at a row of Chao with their legs dangling off a gutter, and I thought: that’s well. Safe was the cupboard.',
              ),
            ]),
            o('It depends on the day', [
              PX(
                'Some days safe is all you can manage, and that’s all right. But it’s worth knowing it isn’t the whole of it.',
              ),
            ]),
          ],
          'A think question: safe versus well.',
        ),
      ],
    ),
    sc(
      'pa1-17-complete',
      [
        SO('Huh. So that’s all it wanted.', 'soft'),
        AM('Of course that’s all it wanted. That’s all anybody wants.'),
        N(
          'Knuckles doesn’t say anything. He wipes his eyes with the back of his glove and says it’s the rain.',
        ),
      ],
      [
        ask(
          2,
          'sel',
          'tears and “it’s the rain”',
          'CASEL: Self-awareness',
          [
            N(
              'Knuckles says it’s the rain. It isn’t raining. Why do people pretend they aren’t crying?',
            ),
          ],
          [
            o(
              'They think tears look weak, though they aren’t',
              [
                N(
                  'Yes. He’s moved, and he thinks he shouldn’t show it. Everybody on that roof knows, and nobody minds. Tears after something kind are not weakness.',
                ),
              ],
              true,
            ),
            o('Because it really is raining', [
              N(
                'Dry as a bone. He’s moved, and he’d rather blame the weather. Crying at something kind is normal, even for a guardian.',
              ),
            ]),
          ],
          'Talked about why people hide tears, and that they needn’t.',
        ),
      ],
    ),
  ],
  [
    gloss(
      'awning',
      'A cloth roof that sticks out over a shop or doorway to keep off sun and rain.',
      'pa1-17-chao',
    ),
    gloss('unmistakable', 'So clear that it couldn’t be anything else.', 'pa1-17-chao'),
  ],
);

// ================================================================== PA1-18 Tikal and Chaos
const Q18: EduQuest = quest(
  'pa1-18',
  'Tikal and Chaos',
  {
    'pa1-18-s1': G('Watch the light come down to Chaos.', 'Stay by the puddle, with the Chao.'),
    'pa1-18-s2': G('Answer Tikal’s question.', 'Talk to Tikal before she goes.'),
  },
  [
    sc(
      'pa1-18-return',
      [
        N(
          'The rosy light comes down out of the clouds, slow as a falling petal, and stops above the puddle.',
        ),
        N(
          'It opens, and it is Tikal, standing barefoot in the water with the Chao round her ankles.',
        ),
        TI('There you are. I’ve been looking for you for such a long time.', 'soft'),
        N(
          'Chaos looks up at her. It doesn’t rise; it only looks, the way your Nubbin looks at you when you come home late.',
        ),
        TI('It’s all right now. They’re all right. Look at them. It’s over.'),
        TI('You don’t have to hold it anymore. We can put it down together.'),
        N('She holds out her hand. Chaos lifts one watery hand and puts it in hers.'),
        SO('So… you two are going?'),
        TI('We’ve waited a long while to go. Thank you, Sonic. Thank you, all of you.', 'happy'),
      ],
      [
        ask(
          3,
          'literacy',
          'simile: the way your Nubbin looks at you when you come home late',
          'L.4.5',
          [
            N(
              'Chaos looks at Tikal “the way your Nubbin looks at you when you come home late”. What feeling is that?',
            ),
          ],
          [
            o(
              'Relief and love, with a bit of “where were you?”',
              [
                N(
                  'Yes. The simile reaches for something you know from home, so you feel Chaos’s feeling instead of being told it.',
                ),
              ],
              true,
            ),
            o('Anger', [
              N(
                'Not anger. Think of a Nubbin at the gate when you’re late: relief, love, and a little reproach. The simile borrows that feeling for Chaos.',
              ),
            ]),
          ],
          'Explained a simile that uses the reader’s own experience.',
        ),
      ],
      [
        ch('bow', 'Bow to Chaos, as you did at the shrine.', [
          N('You bow. This time Chaos bows back, all the way, the way you would to an old friend.'),
        ]),
        ch('nubbin', 'Lift your Nubbin up so Chaos can see it.', [
          N(
            'Chaos looks at your Nubbin for a long moment. Then it touches its head, very lightly, where the curl is.',
          ),
        ]),
      ],
    ),
    sc(
      'pa1-18-return-done',
      [
        N(
          'Tikal turns to you last. The Chao round her feet turn too, as if they know whose turn it is.',
        ),
        N(
          'Twelve Chao, a water creature, a hedgehog, and a girl made of light, all looking at you.',
        ),
      ],
      [
        notice(
          1,
          'sel',
          'being looked at',
          'CASEL: Self-management',
          [
            N(
              'Everyone is looking at you. That can make your face go hot. A slow breath out helps, and so does remembering they look because they’re glad you’re here.',
            ),
          ],
          'Learned a way to handle being the centre of attention.',
        ),
      ],
    ),
    sc(
      'pa1-18-farewell',
      [
        TI(
          'Before we go, I want to ask you something. Where you come from, do you have one like Chaos?',
          'think',
        ),
        TI('Someone who loved the little ones too much, and didn’t know what to do with it?'),
        N('Your Nubbin is sitting in the water by Chaos, holding one of its fingers.'),
        PX('Keeper. She means…', 'soft'),
        Y('We had one. A long time ago.'),
        TI('What happened to her?'),
      ],
      [
        ask(
          1,
          'literacy',
          'loving too much',
          'RL.4.2',
          [
            TI(
              'Loved them too much. Can you love someone too much? What do you think I mean by it?',
            ),
          ],
          [
            o(
              'Loving so hard that you hold on too tight and hurt them',
              [
                TI(
                  'Yes. The love itself is not the problem. It is what you do with it: the gripping. Chaos gripped the whole world.',
                ),
              ],
              true,
            ),
            o('There’s no such thing as too much love', [
              TI(
                'Perhaps the love is never too much. But holding on can be. That is what I mean: love that grips instead of letting go.',
              ),
            ]),
          ],
          'Thought about the theme of love that holds too tight.',
        ),
      ],
    ),
    sc(
      'pa1-18-rhyme',
      [
        N(
          'You open your mouth, and find you don’t know how the story ends. Nobody back home does yet.',
        ),
        N(
          'Pixel hums something under her breath: four lines, the skipping tune from the lane. She stops before the last one.',
        ),
        N('She doesn’t hum the rest, as if she’s just remembered what the last line says.'),
        TI('That sounds like an old one. The old ones are always a little sad.', 'soft'),
        TI('I hope somebody finds her. I hope she gets to put it down.'),
      ],
      [
        ask(
          2,
          'music',
          'a tune carries a story',
          'RL.2.4',
          [
            N(
              'Pixel hums the tune and stops before the last line. Why can a tune with no words still feel sad?',
            ),
          ],
          [
            o(
              'The tune carries the feeling of the words you already know',
              [
                N(
                  'Yes. Once you know a song, the tune brings the words back on its own. Stopping early is a way of not saying the sad part.',
                ),
              ],
              true,
            ),
            o('Tunes can’t be sad', [
              N(
                'Hum a lullaby and a march and see. Tunes carry feelings, and once you know the words, the tune brings them back.',
              ),
            ]),
          ],
          'Thought about how melody carries meaning.',
        ),
      ],
    ),
    sc(
      'pa1-18-complete',
      [
        TI('Here. For you. I made it a long while ago, and it kept.', 'happy'),
        N(
          'She lifts a crown of small pink and white flowers from her own hair and sets it on yours. It weighs nothing, and smells of warm stone.',
        ),
        N(
          'Then she takes Chaos’s hand again. The two of them turn to light together, pink and green, and rise, and the Chao wave until they’re gone.',
        ),
        N(
          'Tikal died long ago, and Chaos has carried its grief since then. Now neither of them is alone, and neither is holding on. That is what at peace means.',
        ),
        N(
          'The world folds up gently round you, like a letter, and you are standing in the lantern shed with your Nubbin under your arm.',
        ),
        PX(
          'You’re back! You’ve got flowers in your hair. They came out with you. How did they come out with you?',
          'shock',
        ),
        N(
          'On the side of the cabinet, where the dent was, a small brass plate has appeared, blank, waiting for a name.',
        ),
        PX(
          'A high-score plate. For High Score Night. When we’ve done another cartridge, we’ll do it properly.',
          'happy',
        ),
      ],
      [
        ask(
          3,
          'sel',
          'think: what do we keep of someone?',
          null,
          [
            PX(
              'A flower crown that came out of a game. The murals. Grandmother’s prayer. What do you think we really keep of someone, after they’re gone?',
            ),
          ],
          [
            o('The things they taught us', [
              PX(
                'Tikal kept her grandmother’s prayer. I’d say that’s most of it. What they taught you is yours now.',
              ),
            ]),
            o('The things they made', [
              PX(
                'A crown that kept for thousands of years. Made things last a surprisingly long time. So do dents, mind.',
              ),
            ]),
            o('The way they made us feel', [
              PX(
                'That’s the one I can’t argue with. I don’t remember half of what Hazel said. I remember exactly how the shed felt with her in it.',
              ),
            ]),
          ],
          'A think question: what remains of someone.',
        ),
      ],
    ),
  ],
  [
    gloss('barefoot', 'Without shoes or socks on.', 'pa1-18-return'),
    gloss(
      'reproach',
      'A look or words that gently tell someone off, without being angry.',
      'pa1-18-return',
    ),
  ],
);

// ================================================================== VARIANTS
/** Reader versions of every scene in PA1_VARIANTS. */
export const EDU_PA1_READER_VARIANTS: EduScene[] = [
  // ---------------------------------------------------------------- after pa1-01-shed-done (s21Done)
  sc(
    'pa1-01-clank',
    [
      N(
        'Clank is sitting on top of the cabinet with his legs dangling over the edge of the screen.',
      ),
      CK('Announcement: I am the lookout. Pixel said lookouts sit on top. I am on top.', 'happy'),
      PX('I said lookouts sit still.'),
      CK('I am sitting very still. Look how still. This is the stillest I have ever been.'),
      N('His legs go on swinging. Every few seconds one heel bonks the screen.'),
      N('Your Nubbin counts the bonks on its fingers and runs out of fingers.'),
    ],
    [
      ask(
        4,
        'maths',
        'rate: bonks per minute',
        '3.MD.A.1',
        [PX('One bonk every 5 seconds. How many bonks in a minute?')],
        [
          o(
            '12',
            [
              PX(
                'Twelve. 60 shared into 5s is 12. Twelve bonks a minute, for the whole cartridge. Wonderful.',
              ),
            ],
            true,
          ),
          o('5', [
            PX('Count up in 5s to 60: 5, 10, 15… you get there after 12 counts. Twelve bonks.'),
          ]),
        ],
        'Worked out how many times something happens in a minute.',
      ),
    ],
  ),
  // ---------------------------------------------------------------- replaces pa1-17-chao (pa1-gate locked)
  sc(
    'pa1-17-chao-locked',
    [
      N('Chaos looks round for them, and there are none. Not on the roofs, not in the streets.'),
      N('Your stomach drops. The garden, the gate, the little key you turned.'),
      Y('They’re still in there.'),
      N(
        'You wade back across the square and through the hotel lobby, where the water is up to your waist and full of floating menus.',
      ),
      N(
        'The garden gate is still locked. Behind it, on top of the palm tree and the fruit tree and each other, the Chao are huddled, wet and very quiet.',
      ),
      N('They’re all alive. Not one of them is moving.'),
      PX('Safe isn’t the same as well, is it.', 'soft'),
      N(
        'You turn the key. Your Nubbin goes in first, and one by one they come down out of the trees and follow it.',
      ),
      N('You lead them out through the lobby, across the square, to the edge of the puddle.'),
      N('Chaos looks at them. The glow in its chest goes still, and soft, and warm.'),
    ],
    [
      ask(
        6,
        'social-studies',
        'the gate choice pays off',
        'D2.Civ.8.K-2',
        [
          PX(
            'You locked the gate, fifteen quests ago, to keep them safe. They lived, and they couldn’t leave. What did the lock cost?',
          ),
        ],
        [
          o(
            'Their freedom to get away from the danger themselves',
            [
              PX(
                'Yes. Locking wasn’t cruel; it was careful. But a rule meant to protect can trap, and the ones it traps don’t get a say. That’s the cost.',
              ),
            ],
            true,
          ),
          o('Nothing: they’re alive', [
            PX(
              'They are alive, and that matters most. But look at them: wet, silent, stuck. The lock cost them the chance to save themselves. Safe isn’t the whole of well.',
            ),
          ]),
        ],
        'Saw the cost of an early choice, without being scolded for it.',
      ),
    ],
  ),
  // ---------------------------------------------------------------- after pa1-18-return-done (pa1-stood true)
  sc(
    'pa1-18-stood',
    [
      TI('You stood beside me, on the steps. In front of all of them.', 'soft'),
      TI(
        'It didn’t change anything. I’ve had a very long time to think about that, and it still mattered.',
      ),
      N('She squeezes your hand once. Her hand is warm, though it’s made of light.'),
    ],
    [
      ask(
        1,
        'sel',
        'it changed nothing and it still mattered',
        'CASEL: Relationship skills',
        [TI('It changed nothing, and it still mattered. How can both be true?')],
        [
          o(
            'Because being with someone matters on its own, not only when it fixes things',
            [
              TI(
                'Yes. I did not need the ending changed. I needed not to be alone in it. You gave me that, and it kept.',
              ),
            ],
            true,
          ),
          o('It can’t; if it changed nothing it didn’t matter', [
            TI(
              'I thought that once. Then I had a long time to remember who stood next to me. Company is its own thing, apart from fixing.',
            ),
          ]),
        ],
        'Learned that presence matters apart from results.',
      ),
    ],
  ),
  // ---------------------------------------------------------------- replaces pa1-18-rhyme (cinder forgiven)
  sc(
    'pa1-18-cinder-forgiven',
    [
      Y(
        'She was called Cinder. She loved them fiercely, and she held on too tight, and they went still.',
      ),
      Y('At the end, somebody went up the mountain and found her. And she was forgiven.'),
      N('Tikal smiles, slowly, the way the sun comes out after rain.'),
      TI('Forgiven. Oh, I’m glad. I’m so glad.', 'happy'),
      TI(
        'Then she can rest. That’s all the fierce ones want, in the end, even if they don’t know it.',
        'soft',
      ),
    ],
    [
      ask(
        2,
        'sel',
        'what forgiving is',
        'CASEL: Relationship skills',
        [N('Cinder was forgiven. Does forgiving someone mean saying what they did was all right?')],
        [
          o(
            'No. It means letting go of the anger, while still knowing it was wrong.',
            [
              N(
                'Yes. Forgiving doesn’t rewrite the past. It puts down the anger so that both people can rest. The hurt is still true; it just stops being carried.',
              ),
            ],
            true,
          ),
          o('Yes, it means it didn’t matter', [
            N(
              'It mattered; that’s why forgiving is hard. Forgiving means setting down the anger, not pretending there was nothing to be angry about.',
            ),
          ]),
        ],
        'Thought about what forgiveness is and isn’t.',
      ),
    ],
  ),
  // ---------------------------------------------------------------- replaces pa1-18-rhyme (cinder remembered)
  sc(
    'pa1-18-cinder-remembered',
    [
      Y('She was called Cinder. She held on too tight, and the ones she loved went still.'),
      Y('We don’t forgive all of it. But we remember ours.'),
      TI('Remember. Yes. That’s a kind of keeping too.', 'soft'),
      N(
        'Your Nubbin feels about in its fur and brings out a red petal from the hill at home, a bit crumpled. It gives it to the nearest Chao.',
      ),
      N('The Chao holds the petal up to the light, and its ball turns into a heart.'),
    ],
    [
      ask(
        2,
        'social-studies',
        'remembering as keeping',
        'D2.His.2.K-2',
        [
          TI(
            'Remembering is a kind of keeping. What does your valley keep, to remember the ones who are gone?',
          ),
        ],
        [
          o(
            'Flowers on the hill, and the stories people tell',
            [
              TI(
                'Flowers and stories. Here we had murals and a prayer. Every people finds a way to keep its dead close without holding on.',
              ),
            ],
            true,
          ),
          o('Nothing; they just forget', [
            TI(
              'Your Nubbin carried a petal all this way. That is not forgetting. Flowers and stories are how a valley remembers.',
            ),
          ]),
        ],
        'Compared how different people remember their dead.',
      ),
    ],
  ),
  // ---------------------------------------------------------------- after pa1-18-complete: the last image
  sc(
    'pa1-18-last-open-stood',
    [
      N(
        'The screen holds one last picture before it goes dark: the hotel roof at sunset, a row of Chao along the gutter with their legs dangling.',
      ),
      N(
        'Up in one corner, very small, are two lights, pink and green, and a little square figure beside them who looks a lot like you.',
      ),
      PX('That’s you. It put you in the ending. You’re in the ending!', 'happy'),
    ],
    [
      notice(
        1,
        'science',
        'why sunsets are red and gold',
        '5-ESS1-2',
        [
          PX(
            'Sunset colours: at day’s end the sun’s light comes in low through more air, which scatters the blue away and leaves the reds and golds. Same sun, longer path.',
          ),
        ],
        'Learned why the sky colours at sunset.',
      ),
    ],
  ),
  sc(
    'pa1-18-last-open',
    [
      N(
        'The screen holds one last picture before it goes dark: the hotel roof at sunset, a row of Chao along the gutter with their legs dangling.',
      ),
      N(
        'Up in one corner, very small, two lights, pink and green, drift over the city and away, side by side.',
      ),
      PX('Every one of them out, and up. Good.', 'soft'),
    ],
    [
      ask(
        1,
        'literacy',
        'reading a last image',
        'RL.4.2',
        [
          N(
            'The ending shows the Chao on a roof and two lights going away together. What does the picture say without words?',
          ),
        ],
        [
          o(
            'The small ones are safe and free, and the two who held on have let go',
            [
              N(
                'Yes. A last image is a summary in pictures: safe Chao, open sky, two lights not holding anything any more.',
              ),
            ],
            true,
          ),
          o('It’s getting dark', [
            N(
              'It is sunset, but the picture is chosen to mean more: free Chao, and two lights that have finally let go. That is the story in one frame.',
            ),
          ]),
        ],
        'Read the meaning of a closing image.',
      ),
    ],
  ),
  sc(
    'pa1-18-last-locked-stood',
    [
      N(
        'The screen holds one last picture before it goes dark: the garden behind the hotel, its little gate standing wide open.',
      ),
      N(
        'A Chao is swinging on the gate. Above the palm tree hang two lights, pink and green, with a little square figure beside them who looks a lot like you.',
      ),
      PX('Open. They’ve drawn it open. And you’re in it, look.', 'soft'),
    ],
    [
      ask(
        2,
        'literacy',
        'the ending answers the beginning',
        'RL.4.2',
        [
          PX(
            'You locked the gate at the start. The ending draws it open. What is the game telling you, gently?',
          ),
        ],
        [
          o(
            'That the open gate was the better way, without blaming you for the lock',
            [
              PX(
                'That’s how I read it. It doesn’t scold. It just shows the gate open, with a Chao swinging on it, and lets you decide what you think.',
              ),
            ],
            true,
          ),
          o('That someone broke the lock', [
            PX(
              'Nobody broke anything. The picture is an answer to your first choice: here is what open looks like. It’s a kind way of saying it.',
            ),
          ]),
        ],
        'Connected an ending image to an early choice.',
      ),
    ],
  ),
  sc(
    'pa1-18-last-locked',
    [
      N(
        'The screen holds one last picture before it goes dark: the garden behind the hotel, its little gate standing wide open.',
      ),
      N(
        'A Chao is swinging on the gate, back and forth. Above the palm tree, two lights, pink and green, drift up through the glass roof and away.',
      ),
      PX('Open. Next time, we leave it open from the start. Deal?', 'soft'),
    ],
    [
      ask(
        2,
        'sel',
        'learning from a choice',
        'CASEL: Responsible decision-making',
        [
          PX(
            'Next time, we leave it open. Is it all right to look back at a choice and decide you’d do it differently?',
          ),
        ],
        [
          o(
            'Yes. That is what learning from a choice means.',
            [
              PX(
                'Yes. You weren’t wrong to be careful. You know more now than you did then. Changing your mind with new knowledge is the whole point of having a mind.',
              ),
            ],
            true,
          ),
          o('No, you should stand by what you chose', [
            PX(
              'Standing by a choice when you know better isn’t loyalty; it’s stubbornness. You chose carefully then. You’d choose differently now. Both are fine.',
            ),
          ]),
        ],
        'Learned that revisiting a choice with new knowledge is good.',
      ),
    ],
  ),
];

// ================================================================== exports
export const EDU_PA1_READER: EduQuest[] = [
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
  Q18,
];

/** Every `edu:` check used by a `do` lesson in this file. */
export const CHECKS: string[] = ['edu:tally:parachutes:12'];
