/**
 * The Learning Grove, reader band (ages 7–10): Atlas A7, The Marigold Bridge.
 *
 * Source: atlas-a07.ts (ATLAS_A07 and ATLAS_A07_VARIANTS). One EduScene per original scene, id
 * `reader:<original id>`: every step scene, every done scene, every complete scene and all 8
 * variants. Every choice keeps its original id and `set` (a7-name, a7-plea). See EDU-STYLE.md.
 *
 *   Learning angles (from the outline): Día de Muertos traditions (the ofrenda, cempasúchil
 *   marigolds, pan de muerto, papel picado, calaveras, vigils), alebrijes (Pedro Linares and the
 *   carved Oaxacan craft), and Spanish family words. Around them: geography of Mexico and cenotes
 *   (D2.Geo.2.K-2, 4-ESS2-1), oral history (D2.His.2.K-2), sound and vibration (4-PS3-2), forces
 *   (3-PS2-1), animals’ senses (4-LS1-2), pollination (2-LS2-2), symmetry (4.G.A.3), patterns
 *   (4.OA.C.5), multiplication and two-step sums (3.OA.A.1, 3.OA.A.3, 3.OA.D.8), time intervals
 *   (3.MD.A.1), fractions (3.NF.A.1), similes and metaphors (L.4.5), multiple-meaning words
 *   (L.3.4), motive, point of view and theme (RL.3.3, RL.3.6, RL.4.2).
 *   Think questions (no best answer): why Mamá Imelda banned music; whether borrowing from a tomb
 *   is fair; whether a blessing with a rule is a blessing; why Miguel shook Héctor’s hand; how a
 *   name stitched in cloth compares with a promise; whether Imelda helping Héctor is forgiving him;
 *   whether being found out is the same as being sorry; which blessing to plead for.
 *
 * Care notes kept: Día de Muertos is a living tradition kept by millions of families today, shown
 * with joy; never “Mexican Halloween”. Alebrijes are the film’s spirit-guide idea here; the
 * lessons name their real craft history and say the page’s idea is a story. Mamá Coco’s failing
 * memory is handled with dignity. Hard things follow EDU-STYLE.md: Chicharrón’s fade and Héctor’s
 * death are said plainly and once, with comfort straight after (Ernesto “did something to him”;
 * the poisoning is never named); Mamá Coco’s death is said plainly with comfort. Ernesto’s
 * fall is a comic bell pratfall. Nothing is quoted from the film and no song is given.
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
const M = say('a7-miguel');
const H = say('a7-hector');
const I = say('a7-imelda');
const AB = say('a7-abuelita');
const CO = say('a7-coco');
const EN = say('a7-enrique');
const ER = say('a7-ernesto');
const RO = say('a7-rosita');
const JU = say('a7-julio');
const TW = say('a7-twins');
const OF = say('a7-officer');
const CL = say('a7-clerk');
const CH = say('a7-chicharron');
const EM = say('a7-emcee');
const PA = say('a7-painter');

// ---------------------------------------------------------------- builders
type LessonIn = Omit<Lesson, 'id'>;
type Opt = NonNullable<Lesson['options']>[number];

const opt = (label: string, reply: Line[], best = false): Opt =>
  best ? { label, best, reply } : { label, reply };

const ask = (
  after: number,
  domain: EduDomain,
  skill: string,
  standard: string | null,
  prompt: Line[],
  options: Opt[],
  parentNote: string,
): LessonIn => ({
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
): LessonIn => ({
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
): LessonIn => ({
  domain,
  skill,
  ...(standard ? { standard } : {}),
  kind: 'do',
  after,
  check,
  lines,
  parentNote,
});

const ch = (id: string, label: string, then: Line[], set?: Choice['set']): Choice => ({
  id,
  label,
  ...(set ? { set } : {}),
  then,
});

/** Builds `reader:<of>` and numbers its lessons `reader:<of>-l1`, `-l2`, in play order. */
const scene = (of: string, lines: Line[], lessons: LessonIn[], choices?: Choice[]): EduScene => {
  const id = `reader:${of}`;
  const s: EduScene = {
    id,
    of,
    band: 'reader',
    lines,
    lessons: [...lessons]
      .sort((a, b) => a.after - b.after)
      .map((l, i) => ({ id: `${id}-l${i + 1}`, ...l })),
  };
  if (choices) s.choices = choices;
  return s;
};

const quest = (
  of: string,
  title: string,
  goals: EduQuest['goals'],
  scenes: EduScene[],
  notes?: string,
): EduQuest => ({
  id: `reader:${of}`,
  of,
  band: 'reader',
  title,
  goals,
  scenes,
  ...(notes ? { notes } : {}),
});

const gloss = (word: string, meaning: string, of: string): GlossaryEntry => ({
  word,
  meaning,
  scene: `reader:${of}`,
});

// ================================================================== A7-1 The Ofrenda
const Q01: EduQuest = quest(
  'a7-01',
  'The Ofrenda',
  {
    'a7-01-s1': {
      goal: 'Step into the marigold page and find your way into the town square.',
      hint: 'Touch the page, then follow the cut-paper flags down to the square.',
    },
    'a7-01-s2': {
      goal: 'Help carry the marigolds into the Riveras’ house.',
      hint: 'Take the flowers from the cart by the gate and bring them to Abuelita.',
    },
    'a7-01-s3': {
      goal: 'Look at the family ofrenda, and meet Mamá Coco.',
      hint: 'Go up to the altar at the end of the room and look at the photos.',
    },
  },
  [
    scene(
      'a7-01-plaza',
      [
        N(
          'Nova’s atlas falls open at a page of orange flowers and little paper flags, cut into birds and skulls and stars.',
        ),
        N(
          'A warm wind blows, with a smell of baking in it. You and your Nubbin are standing in a town square in Mexico.',
        ),
        N(
          'Strings of papel picado flutter overhead. Everybody carries armfuls of marigolds, as orange as tiny lamps.',
        ),
        N(
          'Under a statue of a man with a guitar, a boy is polishing a shoe and talking much faster than he is polishing.',
        ),
        M(
          '…and he started with nothing, just a kid from Santa Cecilia like me, and he became the greatest musician in the world!',
        ),
        N(
          'The customer leaves. The boy notices you, and then your Nubbin, and his eyes go very wide.',
        ),
        M('Whoa. Are you here for Día de Muertos? Everyone comes home for Día de Muertos.'),
      ],
      [
        notice(
          1,
          'social-studies',
          'where Mexico is, its capital and its languages',
          'D2.Geo.2.K-2',
          [
            N(
              'Santa Cecilia is a made-up town, but Mexico is a real country. It lies south of the United States and north of Guatemala and Belize.',
            ),
            N(
              'Its capital is Mexico City. Most people speak Spanish, and many also speak one of more than sixty Indigenous languages.',
            ),
          ],
          'Learned where Mexico is, that Mexico City is its capital, and that Spanish and many Indigenous languages are spoken there.',
        ),
        ask(
          2,
          'literacy',
          'understand a simile (as orange as tiny lamps)',
          'L.4.5',
          [N('“As orange as tiny lamps.” What is being compared to what?')],
          [
            opt(
              'The marigolds are compared to lamps',
              [
                N(
                  'Yes. A simile uses “as” or “like” to compare. Marigolds glow with colour, the way lamps glow with light.',
                ),
              ],
              true,
            ),
            opt('The lamps are compared to the town', [
              N(
                'Not quite. The marigolds are the thing described, and lamps are what they are compared to.',
              ),
            ]),
            opt('The flags are compared to birds', [
              N(
                'The flags are cut into birds, but this simile is about the flowers. They are compared to lamps.',
              ),
            ]),
          ],
          'Identified the two things compared in a simile.',
        ),
      ],
      [
        ch('visitor', '“We’re visitors. From very far away.”', [
          M(
            'Then you have to see our ofrenda. My abuelita’s is the best in town. Don’t tell anyone I said that, they’ll all want to fight her.',
          ),
        ]),
        ch('statue', 'Ask who the man on the statue is.', [
          M(
            'Who is… that’s Ernesto de la Cruz! The most famous musician who ever lived. He was born right here.',
            'shock',
          ),
          M('Come on. If you don’t know that, you don’t know anything. I’ll show you around.'),
        ]),
        ch('nubbin', 'Let your Nubbin say hello.', [
          N(
            'Your Nubbin climbs onto the shoe-shine box and sits in it. Miguel laughs so hard he has to sit down too.',
          ),
        ]),
      ],
    ),
    scene(
      'a7-01-plaza-done',
      [
        M('I’m Miguel. Miguel Rivera. Mucho gusto. That means “pleased to meet you”.'),
        N(
          'A skinny, hairless dog with his tongue hanging out falls in behind you. He looks very pleased about everything.',
        ),
        M('That’s Dante. He’s not my dog. He just thinks he is.'),
        M('Come on, before Abuelita sends out a search party.'),
      ],
      [
        ask(
          3,
          'literacy',
          'Spanish greeting: mucho gusto',
          'L.3.4',
          [N('Miguel says “mucho gusto”. When would you say it?')],
          [
            opt(
              'When you meet someone new',
              [M('Exactly. Mucho gusto: pleased to meet you.')],
              true,
            ),
            opt('When you say goodbye', [
              M('Close, but no. Goodbye is “adiós”. Mucho gusto is for meeting someone.'),
            ]),
            opt('When you say thank you', [
              M('Thank you is “gracias”. Mucho gusto is for meeting someone.'),
            ]),
          ],
          'Learned that mucho gusto is a polite Spanish phrase for meeting someone.',
        ),
        notice(
          1,
          'science',
          'some dog breeds are born hairless: an inherited trait',
          '3-LS3-1',
          [
            N('Dante is a Xoloitzcuintli, a breed of hairless dog that comes from Mexico.'),
            N(
              'Being hairless is an inherited trait. It is passed down from parents to puppies, the way eye colour is in people.',
            ),
          ],
          'Learned that being hairless is an inherited trait in some dogs.',
        ),
      ],
    ),
    scene(
      'a7-01-petals',
      [
        N(
          'The Riveras’ house is a workshop as much as a house. There are shoes everywhere, on racks and in neat paper parcels.',
        ),
        N('A small, sturdy woman in a shawl puts a basket of marigolds in your arms.'),
        AB(
          'Visitors? Good. Visitors can carry. You, take these in. Miguel, where have you been all afternoon?',
        ),
        N(
          'She looks at your Nubbin for a long moment. Then she ties a strip of orange ribbon gently round its neck.',
        ),
        AB('There. Now that dog won’t think it’s a toy.'),
        AB(
          'Cempasúchil. Marigolds. The petals are bright and they smell strong, so the family can find their way home tonight.',
        ),
        AB(
          'You put the flowers on the ofrenda, and the photos, and the food they liked. And they come.',
        ),
        N('Your Nubbin carries one marigold all by itself, very solemnly, with both arms.'),
      ],
      [
        notice(
          5,
          'science',
          'bright petals attract pollinators',
          '2-LS2-2',
          [
            Y('Why are marigolds so bright?'),
            N(
              'Bright petals help attract bees and butterflies. They carry pollen from flower to flower, so the plants can make seeds.',
            ),
          ],
          'Learned that bright petals attract pollinating insects, which help plants make seeds.',
        ),
        doIt(
          5,
          'literacy',
          'clap the four syllables of cempasúchil',
          'RF.K.2',
          'edu:clap:syllables:cempasuchil',
          [
            N(
              'Cempasúchil comes from the Nahuatl language. Clap it out: cem, pa, sú, chil. Four syllables!',
            ),
          ],
          'Clapped out the syllables of cempasúchil, a word from the Nahuatl language.',
        ),
      ],
    ),
    scene(
      'a7-01-petals-done',
      [
        N('The basket is empty. Your arms smell of marigolds, and so does your Nubbin.'),
        AB('Good. Now you’ve worked, you can eat.', 'happy'),
        N(
          'She brings out a loaf of pan de muerto, a sweet round bread with strips of dough on top shaped like bones.',
        ),
        AB('Eight pieces. Three of you. Everybody takes two.'),
      ],
      [
        ask(
          3,
          'maths',
          'two-step word problem',
          '3.OA.D.8',
          [
            N(
              'There are eight pieces. You, Miguel and Nubbin each take two. How many pieces are left?',
            ),
          ],
          [
            opt(
              'Two',
              [N('Yes. Three people take 3 × 2 = 6 pieces, and 8 − 6 = 2 are left.')],
              true,
            ),
            opt('Six', [
              N('Six is how many were taken: 3 × 2 = 6. Now take that from 8, and 2 are left.'),
            ]),
            opt('Five', [
              N('Try it in two steps. Three people take 3 × 2 = 6. Then 8 − 6 = 2 left.'),
            ]),
          ],
          'Solved a two-step problem with multiplication and subtraction.',
        ),
      ],
    ),
    scene(
      'a7-01-photo',
      [
        N(
          'The ofrenda rises in steps against the wall: candles, marigolds, sugar skulls with names iced on, bread, water, and a little dish of salt.',
        ),
        N('And photographs. Dozens of them, some so old the faces are the colour of tea.'),
        M(
          'That’s Papá Julio. Tía Rosita. Tío Óscar and Tío Felipe, the twins. And that’s Mamá Imelda. She started the shoemaking.',
        ),
        N(
          'In the oldest photo, a stern woman stands beside a little girl. Beside them is a man holding a guitar.',
        ),
        N(
          'The man’s face has been torn away. Someone has folded the edge under, so you can hardly see that anything is missing.',
        ),
        M(
          'Her husband was a musician. He left to play for the world, and he never came back.',
          'sad',
        ),
        M('So Mamá Imelda threw music out of the house. We make shoes instead.'),
        N(
          'In a wheelchair beside the ofrenda sits a woman so old and so small she looks like a folded letter.',
        ),
        M('This is Mamá Coco. My great-grandmother. The little girl in the photo is her.', 'soft'),
        CO('Who are you? Are you new?', 'think'),
      ],
      [
        notice(
          1,
          'social-studies',
          'an ofrenda is a family altar, and a living tradition',
          'D2.His.2.K-2',
          [
            N(
              'An ofrenda is a family altar for remembering people who have died. Some have two levels, some three, some seven.',
            ),
            N(
              'Families add photos, marigolds, candles, water, salt and favourite foods. It is a living tradition, kept by millions of families today.',
            ),
          ],
          'Learned what an ofrenda holds and why Mexican families make one.',
        ),
        ask(
          6,
          'literacy',
          'think about a character’s motive',
          'RL.3.3',
          [
            N(
              'Why might Mamá Imelda have thrown music out of the house? (There is no one right answer.)',
            ),
          ],
          [
            opt('Music reminded her of being left', [
              N(
                'That is a thoughtful answer. When something hurts, we sometimes push away whatever reminds us of it.',
              ),
            ]),
            opt('She wanted to keep her family safe', [
              N(
                'That is a fair answer. Rules are sometimes made out of fear, even when they hurt other people.',
              ),
            ]),
            opt('She just didn’t like noise', [
              N(
                'That is possible. But the story says she loved music once, so there may be a deeper reason.',
              ),
            ]),
          ],
          'Thought about why a character made a rule, using clues from the story.',
        ),
      ],
      [
        ch('hand', 'Take her hand and tell her your name.', [
          CO('That’s a good name. I’ll try to keep it.', 'soft'),
          N('She holds your hand a while longer than people usually do.'),
        ]),
        ch('sit', 'Sit down beside her and say nothing.', [
          N(
            'You sit, and she watches the candles with you. After a while she pats your knee, as if you’ve both agreed on something.',
          ),
        ]),
        ch('nubbin', 'Lift your Nubbin up so she can see it.', [
          CO('Oh! You’re a funny one. Papá would have made a song about you.', 'happy'),
          N('Miguel goes very still at that.'),
        ]),
      ],
    ),
    scene(
      'a7-01-photo-done',
      [
        CO('Is Papá home? Is he coming home?', 'think'),
        M('Not today, Mamá Coco.', 'soft'),
        N('Miguel says it as if he’s said it a hundred times, and as if it hurts every time.'),
      ],
      [
        ask(
          2,
          'sel',
          'being patient and kind when someone asks the same question again',
          'CASEL: Social awareness',
          [N('Mamá Coco asks about her papá again. What is the kindest way to answer?')],
          [
            opt(
              'Answer gently, and stay close',
              [N('Yes. Gentle answers and a steady presence tell her she is safe and loved.')],
              true,
            ),
            opt('Tell her she already asked', [
              N(
                'That might make her feel worse. A gentle answer works better, even the hundredth time.',
              ),
            ]),
            opt('Change the subject quickly', [
              N(
                'Sometimes that helps, but she asked a real question. A gentle, honest answer shows respect.',
              ),
            ]),
          ],
          'Talked about answering patiently and kindly when someone repeats a question.',
        ),
      ],
    ),
    scene(
      'a7-01-complete',
      [
        N(
          'Supper is loud. Abuelita feeds everyone twice, including your Nubbin, and Dante, who isn’t allowed in.',
        ),
        N(
          'It starts at twenty to seven and lasts fifty minutes. Nobody hums, and nobody taps a spoon.',
        ),
        M(
          'Hey. After supper. I want to show you something. Something nobody knows about.',
          'think',
        ),
        N('Your Nubbin’s new ribbon flutters in the draught from the door, bright as a marigold.'),
      ],
      [
        ask(
          1,
          'maths',
          'time intervals to the minute',
          '3.MD.A.1',
          [N('Supper starts at 6:40 and lasts 50 minutes. What time does it end?')],
          [
            opt(
              '7:30',
              [N('Yes. 6:40 plus 20 minutes is 7:00, and 30 more minutes makes 7:30.')],
              true,
            ),
            opt('7:00', [
              N('That is only 20 minutes after 6:40. Add 30 more minutes to reach 7:30.'),
            ]),
            opt('7:40', [N('That would be 60 minutes. Supper lasts 50, so it ends at 7:30.')]),
          ],
          'Worked out a time interval across the hour: 6:40 plus 50 minutes.',
        ),
      ],
    ),
  ],
  'Every scene of A7-1 has a reader version. All choices are kept with their original ids.',
);

// ================================================================== A7-2 The Ban
const Q02: EduQuest = quest(
  'a7-02',
  'The Ban',
  {
    'a7-02-s1': {
      goal: 'Follow Miguel up to his secret hideout.',
      hint: 'Climb the ladder at the back of the workshop and squeeze in behind the loose boards.',
    },
    'a7-02-s2': {
      goal: 'Walk with Miguel through the square to the talent-show sign.',
      hint: 'Keep close to Miguel and keep an eye out for Abuelita.',
    },
    'a7-02-s3': {
      goal: 'Go after Miguel when he runs out of the house.',
      hint: 'Follow him out of the gate. When you find him, sit down with him.',
    },
  },
  [
    scene(
      'a7-02-hideout',
      [
        N(
          'Up a ladder, behind a loose board, there is a little room in the roof that smells of dust and candle wax.',
        ),
        N(
          'It is a shrine to Ernesto de la Cruz: posters, records, old film reels, and candles all round his picture.',
        ),
        N(
          'Miguel lifts a guitar out from under a blanket. It is homemade, the body a wooden box, the frets marked in pen.',
        ),
        M(
          'I learned off his old films. I play along with the tape, and I stop it, and I go back and play it again.',
        ),
        N('He plucks a string, and a note hangs in the air. Your Nubbin sways from side to side.'),
        M(
          'There’s a talent show tonight. In the square. If I win, my family has to see I’m a musician.',
        ),
      ],
      [
        notice(
          4,
          'science',
          'plucked strings vibrate and make sound; shorter strings sound higher',
          '4-PS3-2',
          [
            N(
              'When a string is plucked, it vibrates, which means it shakes back and forth very fast. The shaking passes through the air as sound.',
            ),
            N(
              'A shorter or tighter string shakes faster and sounds higher. That is why a guitarist presses a string down to change the note.',
            ),
          ],
          'Learned that vibrating strings make sound, and that shorter strings sound higher.',
        ),
        ask(
          5,
          'sel',
          'think about whether to tell a family a hard truth',
          'CASEL: Responsible decision-making',
          [
            N(
              'Miguel hasn’t told his family about his music. What might happen if he tells them, and what if he doesn’t?',
            ),
          ],
          [
            opt('They might be angry, but at least it is honest', [
              N(
                'A fair answer. Honesty can be uncomfortable, but it lets people know the real you.',
              ),
            ]),
            opt('Hiding it will keep the peace for now', [
              N('A fair answer too. But secrets can grow heavy, and he may have to face it later.'),
            ]),
            opt('He could tell one person he trusts first', [
              N(
                'That is a thoughtful middle path. Practising with someone safe can make a hard talk easier.',
              ),
            ]),
          ],
          'Thought about the costs of telling or hiding something important from family.',
        ),
      ],
      [
        ch('tell', '“You should tell them.”', [
          M(
            'Tell them? Abuelita would… you don’t understand. You’ve never seen her with a shoe in her hand.',
            'shock',
          ),
        ]),
        ch('play', '“Play it again.”', [
          N(
            'He does, grinning, a little faster. Your Nubbin tries to clap along and claps exactly between the beats.',
          ),
        ]),
        ch('why', 'Ask why music is banned, really.', [
          M(
            'Because of him. The man in the photo. That’s all anyone says. Nobody ever says the rest.',
            'sad',
          ),
        ]),
      ],
    ),
    scene(
      'a7-02-hideout-done',
      [
        M(
          'Come on. I need to see where they’re putting up the stage. Don’t say anything. Act like a tourist.',
        ),
        N('You already are one, so this is easy.'),
        N('Miguel says he will “play” tonight. You wonder how many things that one word can mean.'),
      ],
      [
        ask(
          2,
          'literacy',
          'multiple-meaning words: play',
          'L.3.4',
          [N('Which of these uses “play” in a different way from “play a guitar”?')],
          [
            opt(
              'We went to see a play at the theatre',
              [
                N(
                  'Yes. Here “play” is a noun, a story acted on a stage. “Play a guitar” is a verb.',
                ),
              ],
              true,
            ),
            opt('Play the song again', [
              N('That is the same meaning as “play a guitar”: to make music with it.'),
            ]),
            opt('Play it on the record player', [
              N('That also means to make music, so it matches “play a guitar”.'),
            ]),
          ],
          'Noticed that one word, play, can be a verb or a noun with different meanings.',
        ),
      ],
    ),
    scene(
      'a7-02-square',
      [
        N(
          'In the square, a man is pinning up a sign: a talent show, tonight, in honour of Ernesto de la Cruz.',
        ),
        M('I just need a guitar. A real one. I can’t walk out there with a box.'),
        N('A mariachi with a kind face lets Miguel try his guitar on a bench.'),
        AB('MIGUEL!', 'angry'),
        N(
          'Abuelita crosses the square like weather. The mariachi suddenly remembers he has somewhere to be.',
        ),
        AB(
          'Music? In the square? On Día de Muertos, with your whole family watching from the ofrenda?',
          'angry',
        ),
        N('She marches him home by the ear. You follow, and your Nubbin follows you.'),
        N(
          'At the ofrenda, Miguel’s elbow knocks the oldest photo from its frame. The folded part falls open.',
        ),
        M('Look at the guitar. That’s Ernesto de la Cruz’s guitar. The man with no face!', 'shock'),
      ],
      [
        ask(
          5,
          'sel',
          'managing big feelings before speaking',
          'CASEL: Self-management',
          [N('Abuelita is furious. What could help her handle that feeling before she speaks?')],
          [
            opt(
              'Pause and breathe, then speak',
              [
                N(
                  'Yes. A pause lets the big feeling settle, so the words come out how we mean them.',
                ),
              ],
              true,
            ),
            opt('Say whatever comes first', [
              N('That is natural, but words said in a rush can hurt more than we intend.'),
            ]),
            opt('Walk away without a word', [
              N('That can help for a moment. But going back to talk once calm is what solves it.'),
            ]),
          ],
          'Talked about pausing and breathing to manage a big feeling before speaking.',
        ),
      ],
    ),
    scene(
      'a7-02-square-done',
      [
        N(
          'The guitar in the old photo has a skull carved on its head, with a gold tooth set in the skull. You saw the same one on the statue.',
        ),
        M('He’s my great-great-grandfather. Ernesto de la Cruz. It’s in my family!', 'happy'),
      ],
      [
        ask(
          1,
          'maths',
          'counting generations: great-great means four steps back',
          null,
          [
            N(
              'Count back from Miguel: parent (1), grandparent (2), great-grandparent (3). How many steps back is a great-great-grandfather?',
            ),
          ],
          [
            opt(
              'Four steps',
              [
                N(
                  'Yes. Each “great” adds one step: parent, grandparent, great-grandparent, great-great-grandparent.',
                ),
              ],
              true,
            ),
            opt('Two steps', [
              N(
                'Two steps back is a grandparent. Each “great” adds a step, so great-great is four.',
              ),
            ]),
            opt('Three steps', [
              N('Three steps is a great-grandparent. Add one more “great” for four.'),
            ]),
          ],
          'Counted generations back to a great-great-grandfather.',
        ),
      ],
    ),
    scene(
      'a7-02-guitar',
      [
        N(
          'Miguel runs up to the attic and back with his homemade guitar, and holds it up in front of everyone.',
        ),
        M('I’m going to play in the talent show. I’m going to be a musician like him.'),
        EN('Mijo. No. You’re part of this family. Family comes first.', 'sad'),
        AB('There. One guitar. No more guitar.', 'angry'),
        N(
          'She takes it from him and brings it down on the edge of the table. It breaks with a sound like a word nobody meant to say.',
        ),
        N('Nobody moves. Even Abuelita looks as if she has hurt her own hand.'),
        M('I don’t want to be in this family!', 'angry'),
        N('Miguel is gone through the gate before anyone can stop him. Dante goes too.'),
        N(
          'You find him on the church steps, his face in his knees, with Dante lying across his feet like a warm, bony blanket.',
        ),
      ],
      [
        ask(
          5,
          'literacy',
          'think about a character’s motive and regret',
          'RL.3.3',
          [
            N(
              'Abuelita looks as if she hurt her own hand. Why might she do something she seems to regret? (There is no one right answer.)',
            ),
          ],
          [
            opt('Big feelings can come faster than thoughts', [
              N('A thoughtful answer. Anger and fear can make us act before we think.'),
            ]),
            opt('They believe they are protecting someone', [
              N('A fair answer. Sometimes we hurt people while trying to keep them safe.'),
            ]),
            opt('They don’t know another way to help', [
              N(
                'That is wise. Learning other ways to cope takes practice, for children and grown-ups alike.',
              ),
            ]),
          ],
          'Reflected on why people act in ways they later regret.',
        ),
      ],
    ),
    scene(
      'a7-02-guitar-done',
      [
        N(
          'You don’t say anything. You sit down next to him and wait, and your Nubbin leans against his arm.',
        ),
        N('After a long time, Miguel wipes his face on his sleeve.'),
        M('Thanks.', 'soft'),
      ],
      [
        ask(
          1,
          'sel',
          'what helps a friend who is very upset',
          'CASEL: Relationship skills',
          [N('Miguel is very upset. Which of these helps most, right now?')],
          [
            opt(
              'Sit beside him and wait',
              [N('Yes. Being there, without fixing or rushing, tells him he is not alone.')],
              true,
            ),
            opt('Tell him it’s not a big deal', [
              N('That might make him feel unheard. Sitting with him respects how big it feels.'),
            ]),
            opt('Give him advice straight away', [
              N('Advice can come later. First he needs company and a little quiet.'),
            ]),
          ],
          'Talked about sitting with an upset friend instead of rushing to fix things.',
        ),
        notice(
          2,
          'literacy',
          'Spanish: gracias and de nada',
          'L.3.4',
          [
            N('Miguel says “thanks”. In Spanish that is “gracias”.'),
            N('The reply is “de nada”, which means “it’s nothing” or “you’re welcome”.'),
          ],
          'Learned gracias and de nada.',
        ),
      ],
    ),
    scene(
      'a7-02-complete',
      [
        M('I still need a guitar. A real one. For tonight.'),
        N(
          'Beyond the church, the cemetery is filling up with candles, set out in neat rows of eight, six rows to a family plot.',
        ),
        M('His guitar is in his tomb. On the wall. In the cemetery.', 'think'),
        M('He wouldn’t mind. He’d want me to play. I’m family. I’d just borrow it.'),
        N('Dante sneezes. It sounds a lot like an opinion.'),
      ],
      [
        ask(
          1,
          'maths',
          'multiplication as equal groups',
          '3.OA.A.1',
          [N('Each family plot has 6 rows of 8 candles. How many candles is that?')],
          [
            opt('48', [N('Yes. 6 groups of 8 is 6 × 8 = 48.')], true),
            opt('14', [N('That is 6 + 8. Equal groups mean multiplying: 6 × 8 = 48.')]),
            opt('56', [N('Close, but 7 × 8 is 56. For 6 rows, 6 × 8 = 48.')]),
          ],
          'Multiplied 6 × 8 to count candles in equal rows.',
        ),
      ],
    ),
  ],
  'Every scene of A7-2 has a reader version. The broken guitar is one quiet crack; nobody is hurt.',
);

// ================================================================== A7-3 The Guitar
const Q03: EduQuest = quest(
  'a7-03',
  'The Guitar',
  {
    'a7-03-s1': {
      goal: 'Walk through the cemetery with Miguel and Dante.',
      hint: 'Follow the candlelit path between the graves to the big tomb at the top.',
    },
    'a7-03-s2': {
      goal: 'Hold the window steady while Miguel climbs into the tomb.',
      hint: 'Keep your hands on the window frame until Miguel is down inside.',
    },
    'a7-03-s3': {
      goal: 'Find Miguel among the graves, and meet the visitors.',
      hint: 'Follow the glow down the hill. Look for the people nobody else can see.',
    },
  },
  [
    scene(
      'a7-03-cemetery',
      [
        N('The cemetery at dusk is the busiest place in town. Every grave has a family round it.'),
        N(
          'People are scrubbing headstones, laying marigold petals, setting out candles and unpacking suppers.',
        ),
        N(
          'An old man tells a story to a grave, and laughs at his own jokes. Two children are asleep on a blanket.',
        ),
        M(
          'Everybody stays all night. It’s called a vigil. You bring their favourite food, and you talk to them, and you remember.',
        ),
        Y('It isn’t sad.'),
        M('It’s sad a bit. Mostly it’s a party. They’re visiting, so you have to make it nice.'),
        N(
          'At the top of the hill there is a tomb as big as a chapel, with ERNESTO DE LA CRUZ over the door in stone.',
        ),
        N('It is locked. There is a window, high up, and it is open a crack.'),
      ],
      [
        notice(
          3,
          'social-studies',
          'some families keep a night vigil at the cemetery on Día de Muertos',
          'D2.His.2.K-2',
          [
            N(
              'Many families in Mexico really do spend Día de Muertos at the cemetery. They clean the graves, share food and tell stories.',
            ),
            N(
              'The festival is a time to celebrate people’s lives, not only to mourn. Customs differ from town to town.',
            ),
          ],
          'Learned that Día de Muertos is a celebration of lives, and that customs differ between places.',
        ),
        ask(
          5,
          'sel',
          'an occasion can be sad and happy at once',
          'CASEL: Self-awareness',
          [N('Miguel says it’s “sad a bit” and “mostly a party”. Can one evening feel both?')],
          [
            opt(
              'Yes, feelings can mix',
              [N('Yes. Missing someone and being glad to remember them can sit side by side.')],
              true,
            ),
            opt('No, it has to be one or the other', [
              N(
                'Many people find the feelings do mix. Remembering can make us smile and ache at once.',
              ),
            ]),
          ],
          'Reflected on feeling sad and happy at the same time.',
        ),
      ],
    ),
    scene(
      'a7-03-cemetery-done',
      [
        M('Give me a boost. And hold the window. Don’t let it bang.'),
        N(
          'You make a step with your hands. Your Nubbin holds Dante, or Dante holds your Nubbin; it’s hard to say which.',
        ),
      ],
      [
        ask(
          1,
          'science',
          'balanced and unbalanced forces',
          '3-PS2-1',
          [
            N(
              'Miguel stands on your hands. Gravity pulls him down. What must your push do to lift him?',
            ),
          ],
          [
            opt(
              'Be bigger than gravity’s pull',
              [N('Yes. An unbalanced force changes motion: your push up must beat the pull down.')],
              true,
            ),
            opt('Be the same as gravity’s pull', [
              N(
                'Equal forces are balanced, and he would stay where he is. To lift him, your push must be bigger.',
              ),
            ]),
            opt('Be smaller than gravity’s pull', [
              N('Then gravity would win and he would stay down. To lift him, push harder.'),
            ]),
          ],
          'Explained that lifting needs an upward force bigger than gravity’s pull.',
        ),
      ],
    ),
    scene(
      'a7-03-window',
      [
        N(
          'Miguel wriggles through the window and drops down inside with a thump and a small, brave noise.',
        ),
        N('You lean in after him, holding the frame. Moonlight comes in with you.'),
        N(
          'Inside the mausoleum, high on the wall in a glass case, is a white guitar with a skull on its head.',
        ),
        M('Señor de la Cruz. Please don’t be mad. I’m Miguel. Your great-great-grandson. I think.'),
        M('I need to borrow this. Just for tonight. I’ll bring it straight back. I promise.'),
        N('He lifts the case. He takes out the guitar as if it might wake up.'),
      ],
      [
        ask(
          4,
          'sel',
          'borrowing and permission',
          'CASEL: Responsible decision-making',
          [
            N(
              'Miguel promises to give the guitar straight back. Is it fair to borrow something without asking, if you promise? (There is no one right answer.)',
            ),
          ],
          [
            opt('No. You should ask the owner first', [
              N('A fair view. Asking shows respect, and the owner might say yes.'),
            ]),
            opt('Maybe, if nobody could ask', [
              N(
                'That is a real puzzle. When you can’t ask, you have to think hard about what the owner would want.',
              ),
            ]),
            opt('Yes, a promise is enough', [
              N('A promise matters. But the owner never agreed, and that is worth thinking about.'),
            ]),
          ],
          'Thought about whether a promise is enough when you cannot ask permission.',
        ),
      ],
      [
        ch('careful', '“Careful.”', [
          M('I’m always careful.'),
          N('He isn’t, quite. But he’s very careful now.'),
        ]),
        ch('sure', '“Are you sure about this?”', [
          M('No. Yes. If I don’t play tonight, I’ll never play.', 'think'),
        ]),
        ch('quiet', 'Say nothing, and hold the window.', [
          N('You hold the window, and your Nubbin holds your sleeve. Everyone holds their breath.'),
        ]),
      ],
    ),
    scene(
      'a7-03-window-done',
      [
        N('Miguel strums once. One chord, loud in the stone room, with an echo after it.'),
        N(
          'A gust comes from nowhere. Every marigold petal on the floor of the tomb lifts at once and glows.',
        ),
        N(
          'The atlas in your pocket goes warm. Your hands are still on the window frame, and the frame is suddenly very far away.',
        ),
      ],
      [
        notice(
          0,
          'science',
          'echoes: sound bounces off hard surfaces',
          '4-PS3-2',
          [
            N(
              'Why did the chord echo? Sound travels in waves. When the waves hit hard, smooth stone, they bounce back, and you hear the sound twice.',
            ),
            N('Soft things like curtains and carpets soak sound up, so there is much less echo.'),
          ],
          'Learned that echoes happen when sound waves bounce off hard surfaces.',
        ),
      ],
    ),
    scene(
      'a7-03-visitors',
      [
        N(
          'A man with a torch comes running up to the tomb, shouting about a thief. He runs straight past Miguel.',
        ),
        N(
          'Miguel waves at him, and the man doesn’t see. Then he walks straight through Miguel, and doesn’t even shiver.',
        ),
        M('What… what’s happening to me?', 'shock'),
        N(
          'Down the path come people who weren’t there before: skeletons, bright and smiling, in hats and shawls and good shoes.',
        ),
        N(
          'They glow faintly, like a lamp behind a curtain. They stop to smell the marigolds on their own graves.',
        ),
        N('They can see you, and your Nubbin. They can certainly see Miguel.'),
        RO('Miguel? Is that our Miguel?', 'shock'),
        JU('It can’t be. He’s alive. Isn’t he alive? Mijo, are you alive?', 'shock'),
        TW('He looks very alive.'),
        N(
          'They are the faces from the ofrenda photographs: Tía Rosita, round and sweet; Papá Julio, with his great moustache; the twins.',
        ),
      ],
      [
        notice(
          4,
          'health',
          'the skeleton: 206 bones in an adult body',
          null,
          [
            N('You have a skeleton too, hidden inside you. An adult’s skeleton has 206 bones.'),
            N(
              'Bones hold your body up, protect soft parts like your brain and heart, and give your muscles something to pull on.',
            ),
            N(
              'Skeletons in this story are painted bright and friendly, as they are in Mexican art.',
            ),
          ],
          'Learned that an adult human skeleton has 206 bones, and what bones do.',
        ),
      ],
    ),
    scene(
      'a7-03-visitors-done',
      [
        RO('And who’s this? A friend? A friend with a little… what is it? Is it a dog?'),
        N(
          'Your Nubbin hides behind your leg. Then it peeks out and waves, which settles the matter.',
        ),
      ],
      [
        ask(
          0,
          'literacy',
          'Spanish family words: tía and tío',
          'L.3.4',
          [N('The ofrenda photos show Tía Rosita and Tío Óscar. In Spanish, who are they?')],
          [
            opt(
              'An aunt and an uncle',
              [
                N(
                  'Yes. Tía is aunt and tío is uncle. The plural, tíos, can mean uncles, or aunts and uncles together.',
                ),
              ],
              true,
            ),
            opt('A grandmother and a cousin', [
              N(
                'Not quite. Grandmother is abuela, and cousin is prima or primo. Tía is aunt and tío is uncle.',
              ),
            ]),
            opt('A mother and a father', [
              N('Those are mamá and papá. Tía is aunt and tío is uncle.'),
            ]),
          ],
          'Matched the Spanish words tía and tío with aunt and uncle.',
        ),
      ],
    ),
    scene(
      'a7-03-complete',
      [
        JU('We have to take him to Mamá Imelda. She’ll know what to do.'),
        TW('She always knows what to do. And then she does it to you.'),
        RO('You’ll come too, won’t you? You came in with him. You must be meant to.', 'soft'),
        N('It is 11:15 at night. Sunrise is at 6:45 in the morning.'),
        N(
          'The atlas in your pocket is warm and patient. You don’t think it is going to let you go home without him.',
        ),
      ],
      [
        ask(
          3,
          'maths',
          'time intervals across midnight',
          '3.MD.A.1',
          [
            N(
              'It is 11:15 at night and sunrise is at 6:45 in the morning. How long is it until sunrise?',
            ),
          ],
          [
            opt(
              '7 hours 30 minutes',
              [
                N(
                  'Yes. 11:15 to midnight is 45 minutes, and midnight to 6:45 is 6 hours 45 minutes. Together that makes 7 hours 30 minutes.',
                ),
              ],
              true,
            ),
            opt('6 hours 30 minutes', [
              N(
                'Check the first part: 11:15 to midnight is 45 minutes, then 6 h 45 min more. That makes 7 h 30 min.',
              ),
            ]),
            opt('8 hours 30 minutes', [
              N(
                'Try it in two parts: 45 minutes to midnight, then 6 h 45 min. That makes 7 h 30 min.',
              ),
            ]),
          ],
          'Found a time interval across midnight in two parts.',
        ),
      ],
    ),
  ],
  'Every scene of A7-3 has a reader version. All choices are kept.',
);

// ================================================================== A7-4 The Marigold Bridge
const Q04: EduQuest = quest(
  'a7-04',
  'The Marigold Bridge',
  {
    'a7-04-s1': {
      goal: 'Cross the Marigold Bridge with the Rivera family.',
      hint: 'Walk out onto the bridge of petals and keep going, even when it glows.',
    },
    'a7-04-s2': {
      goal: 'Go through the departures gate on the far side of the bridge.',
      hint: 'Join the queue by the gate and wait your turn with the family.',
    },
  },
  [
    scene(
      'a7-04-bridge',
      [
        N(
          'Beyond the cemetery wall, where the field should be, there is a bridge made of marigold petals, all the way across.',
        ),
        N(
          'It arches out into a blue dark. On the far side there is a city of lights, stacked up like a cake with too many tiers.',
        ),
        RO(
          'Where we stay. Tonight we visit. Tomorrow we go home. Come on, it holds. It’s only flowers, but it holds.',
        ),
        N(
          'With every step, the petals under your feet flare gold and orange, and then settle, like embers being kind.',
        ),
        N(
          'Halfway over, your Nubbin stops. Its body is changing colour, slowly, like paint soaking into paper.',
        ),
        N(
          'A row of dots runs down its tail: yellow, yellow, pink, yellow, yellow, pink, and on and on.',
        ),
      ],
      [
        notice(
          2,
          'social-studies',
          'marigold petal paths are a real Día de Muertos custom',
          'D2.His.2.K-2',
          [
            N(
              'In Mexico, families really do scatter marigold petals in a path from the street to the ofrenda.',
            ),
            N(
              'The bright colour and strong scent are meant to guide their loved ones home. On this page, the idea becomes a bridge.',
            ),
          ],
          'Learned that families scatter marigold petals as a path for loved ones.',
        ),
        ask(
          5,
          'maths',
          'number patterns that follow a rule',
          '4.OA.C.5',
          [
            N(
              'The pattern is yellow, yellow, pink, repeating. In the first 12 dots, how many are pink?',
            ),
          ],
          [
            opt(
              '4',
              [N('Yes. Each group is 3 dots with 1 pink, and 12 ÷ 3 = 4 groups, so 4 pink dots.')],
              true,
            ),
            opt('3', [N('Check the rule: every third dot is pink. 12 ÷ 3 = 4, so 4 are pink.')]),
            opt('6', [
              N('That would be every second dot. The rule is every third dot, so 12 ÷ 3 = 4 pink.'),
            ]),
          ],
          'Used a repeating pattern rule to count how many dots are pink.',
        ),
      ],
      [
        ch('pick', 'Pick your Nubbin up.', [
          N('It is warm, and it smells of marigolds, and it is very pleased with itself.'),
        ]),
        ch('look', 'Let it look at itself in a puddle of light.', [
          N(
            'It turns round and round to see its own tail. Then it does a little hop, which leaves a pink pawprint glowing on the bridge.',
          ),
        ]),
      ],
    ),
    scene(
      'a7-04-bridge-done',
      [
        TW('An alebrije! Look! The little one’s turning into a spirit guide.', 'happy'),
        JU(
          'They find you, the alebrijes. Bright creatures, all painted. They help the dead find their way.',
        ),
        M('I thought they were just carvings. My cousin sells them to tourists.', 'think'),
      ],
      [
        notice(
          1,
          'art',
          'alebrijes: real painted creatures from Mexico, and the page’s story idea',
          null,
          [
            N(
              'Alebrijes are real. Pedro Linares, an artist in Mexico City, began making them in the 1930s, and carvers in Oaxaca now carve them from copal wood.',
            ),
            N(
              'Each one is painted by hand in bright patterns. Spirit guides are this story’s idea, not an alebrije belief.',
            ),
          ],
          'Learned that alebrijes are real painted creatures from Mexico, and that spirit guides are this story’s idea.',
        ),
      ],
    ),
    scene(
      'a7-04-gate',
      [
        N(
          'At the far end, the dead are coming back and going out through a great hall, like a railway station with a lot more flowers.',
        ),
        N(
          'At the far desks, a queue of skeletons in their best clothes waits to cross into the living world for the night.',
        ),
        OF('Next. Look into the camera, please. Is your photo up on an ofrenda tonight?'),
        N(
          'Each skeleton steps up to a screen. Their photo appears on it, on some family’s altar, and the officer waves them through.',
        ),
        N(
          'Then a woman steps up who is all straight back and folded arms. You know her from the photo at once.',
        ),
        OF('I’m sorry, señora. No photo. No ofrenda. You can’t cross tonight.'),
        I('That’s impossible. My photo is up every year. Every year.', 'angry'),
        RO('Mamá Imelda! Mamá Imelda, look who we found!'),
        N(
          'Mamá Imelda turns round. Her eyes go to Miguel, then to the photo sticking out of his pocket, then back to Miguel.',
        ),
      ],
      [
        ask(
          5,
          'social-studies',
          'think about fair rules',
          'D2.Civ.8.K-2',
          [
            N(
              'The officer follows a rule: no photo, no crossing. Is that rule fair? (There is no one right answer.)',
            ),
          ],
          [
            opt('No. It punishes people for what others forgot', [
              N(
                'A strong point. Imelda didn’t choose to be left off. A fair rule shouldn’t blame her for that.',
              ),
            ]),
            opt('Yes. Rules apply to everyone equally', [
              N(
                'Equal rules matter. But a fair rule should also make sense for the people it affects.',
              ),
            ]),
            opt('It depends on why the rule exists', [
              N(
                'A wise answer. Good rules have a purpose, and we can ask whether a rule still serves it.',
              ),
            ]),
          ],
          'Thought about whether a rule that applies to everyone can still be unfair.',
        ),
      ],
    ),
    scene(
      'a7-04-gate-done',
      [
        I('Miguel?', 'shock'),
        M('Hola, Mamá Imelda…', 'sad'),
        N('Your Nubbin, glowing pink and green, tries very hard to look like a decoration.'),
      ],
      [
        ask(
          0,
          'sel',
          'read how someone feels from how little they say',
          'CASEL: Social awareness',
          [
            N(
              'Mamá Imelda says only one word: “Miguel?” What does that tell us about how she feels?',
            ),
          ],
          [
            opt(
              'She is too shocked to say more',
              [N('Yes. One short word and a question can show how stunned a character is.')],
              true,
            ),
            opt('She is bored', [
              N('Not likely. Her eyes went straight to Miguel, so she is surprised, not bored.'),
            ]),
            opt('She is delighted and chatty', [
              N('Chatty people say more. One word suggests shock rather than delight.'),
            ]),
          ],
          'Used a character’s few words to understand how she feels.',
        ),
      ],
    ),
    scene(
      'a7-04-complete',
      [
        N(
          'Behind you, the bridge glows on and on into the dark, carrying the dead home to their families, one petal at a time.',
        ),
        N('You find a marigold petal stuck to your shoe, still glowing a little. You keep it.'),
        OF('Family business? Department of Family Reunions. Second floor. Take a number.'),
        I(
          'Come. All of you. We will sort this out, and then somebody will explain to me exactly what is going on.',
        ),
      ],
      [
        ask(
          2,
          'literacy',
          'word parts: re- and union',
          'L.3.4',
          [N('A “reunion” is when people come together again. What does the prefix “re-” mean?')],
          [
            opt(
              'Again',
              [
                N(
                  'Yes. Re- means again: re-read, redo, reunion. A reunion is a union, or joining, again.',
                ),
              ],
              true,
            ),
            opt('Before', [
              N('That is “pre-”. Re- means again, so reunion is coming together again.'),
            ]),
            opt('Not', [N('That is “un-”. Re- means again, so a reunion is a joining again.')]),
          ],
          'Worked out that the prefix re- means again, as in reunion.',
        ),
      ],
    ),
  ],
  'Every scene of A7-4 has a reader version. The bridge is a long walk with no puzzle.',
);

// ================================================================== A7-5 The Department of Family Reunions
const Q05: EduQuest = quest(
  'a7-05',
  'The Department of Family Reunions',
  {
    'a7-05-s1': {
      goal: 'Take a number and wait your turn at the Department of Family Reunions.',
      hint: 'Take a ticket from the machine and sit with the family until your number is called.',
    },
    'a7-05-s2': {
      goal: 'Hear what the clerk has to say about Miguel.',
      hint: 'Sit at the desk with Miguel and Mamá Imelda and listen.',
    },
    'a7-05-s3': {
      goal: 'Stay with Miguel when he runs from the Department.',
      hint: 'Follow Miguel out through the crowds. Don’t let him go alone.',
    },
  },
  [
    scene(
      'a7-05-queue',
      [
        N(
          'The Department of Family Reunions is a long room of desks, rubber stamps and filing cabinets. It is bureaucracy at its finest: lots of forms and lots of rules.',
        ),
        N('You take a ticket that says 2,409. The board says 2,377.'),
        TW('It’s quick tonight. Last year we waited four years.'),
        N(
          'At the next desk, a tall, thin skeleton in a borrowed dress and a painted-on monobrow is arguing with a clerk.',
        ),
        PA(
          'I am the most famous painter in Mexico. Look. My eyebrows. Who else has eyebrows like this?',
        ),
        N('The clerk looks at his screen. There is no photo of him anywhere, and there never is.'),
        PA(
          'Please. It’s just one night. There’s someone I need to see before she forgets me.',
          'sad',
        ),
        N(
          'Two guards walk him out. On the way past, he winks at your Nubbin, and almost loses an eyebrow.',
        ),
      ],
      [
        ask(
          1,
          'maths',
          'subtract within 100 to find the gap',
          '2.OA.A.1',
          [N('Your ticket is 2,409 and the board says 2,377. How many numbers until yours?')],
          [
            opt(
              '32',
              [
                N(
                  'Yes. 2,409 − 2,377 = 32. The thousands and hundreds match, so you only need 409 − 377.',
                ),
              ],
              true,
            ),
            opt('42', [
              N('Check the tens: 409 − 377 = 32, not 42. Take away 300, then 70, then 7.'),
            ]),
            opt('132', [
              N(
                'The hundreds are the same in both numbers, so they cancel out. The difference is 32.',
              ),
            ]),
          ],
          'Subtracted to find how many numbers are left in a queue.',
        ),
        notice(
          2,
          'social-studies',
          'numbered tickets make queues fair',
          'D2.Civ.8.K-2',
          [
            N(
              'Why do offices use numbered tickets? So everyone is served in the order they arrived.',
            ),
            N(
              'A queue is a simple kind of fairness: first come, first served, and nobody gets to jump ahead.',
            ),
          ],
          'Learned that numbered tickets and queues are a way to share turns fairly.',
        ),
      ],
      [
        ch('wave', 'Wave him goodbye.', [
          N(
            'He waves back with a flourish. The guards take the other eyebrow off him at the door.',
          ),
        ]),
        ch('ask', 'Ask the family who he is.', [
          JU(
            'Nobody. Somebody nobody remembers. There are a lot of them, over on the far side of town.',
            'sad',
          ),
        ]),
      ],
    ),
    scene(
      'a7-05-queue-done',
      [
        CL('Two-four-oh-nine?'),
        N('Somehow it’s your number already. The atlas, you suspect, is helping.'),
      ],
      [
        ask(
          1,
          'literacy',
          'think about what a character’s words suggest',
          'RL.3.3',
          [
            N(
              'The painter said, “someone I need to see before she forgets me.” What do you think he means? (There is no one right answer.)',
            ),
          ],
          [
            opt('Someone he loves is growing forgetful', [
              N(
                'A thoughtful guess. Her forgetting him seems to matter more to him than the rules.',
              ),
            ]),
            opt('He is playing a trick on the clerk', [
              N('He might be. But his voice went sad, so it sounds like more than a trick.'),
            ]),
            opt('He wants to be remembered by many people', [
              N('Perhaps. He says “she”, though, which points to one special person.'),
            ]),
          ],
          'Made an inference about a character from what he said.',
        ),
      ],
    ),
    scene(
      'a7-05-curse',
      [
        CL(
          'Hmm. Living boy. In the Land of the Dead. Took something from a grave on Día de Muertos. That’s a curse, that is.',
        ),
        M('A curse?!', 'shock'),
        CL(
          'Don’t worry. Paperwork. You need a blessing from your family to go back. Before sunrise.',
        ),
        N('Miguel looks down at his hand. The tips of his fingers have gone pale and see-through.'),
        CL('Any member of the family can give it. A marigold petal. Say the blessing. Done. Next!'),
        N('Mamá Imelda takes a petal from her shawl. Then she stops.'),
        I('Miguel. I give you my blessing to go home. And to put my photo back on the ofrenda.'),
        I('And never to play music again.', 'angry'),
        M('What? No! That’s not fair!', 'angry'),
        I(
          'That’s the blessing. That’s the only blessing. I will not lose another one to a guitar.',
        ),
      ],
      [
        ask(
          9,
          'social-studies',
          'think about a blessing with a rule attached',
          'D2.Civ.8.K-2',
          [
            N(
              'A blessing is a kind wish. Is a blessing with a rule attached still a blessing? (There is no one right answer.)',
            ),
          ],
          [
            opt('No. A real blessing has no conditions', [
              N(
                'A strong view. Many people feel a gift with strings attached is more like a trade.',
              ),
            ]),
            opt('Yes, if the rule comes from love', [
              N(
                'A fair view. Love can ask for things. The question is whether the rule helps or hurts.',
              ),
            ]),
            opt('It depends on whose rule it is', [
              N('A thoughtful answer. A rule you chose differs from one handed to you.'),
            ]),
          ],
          'Thought about whether a blessing with conditions is still a blessing.',
        ),
      ],
    ),
    scene(
      'a7-05-curse-done',
      [
        N(
          'Miguel takes the petal, and it flares, and he is gone, back into the living world. For one breath.',
        ),
        N(
          'Then he is back, standing in the same place, very sheepish, with his hand still reaching out for something.',
        ),
        M('I… reached for the guitar. I wasn’t even thinking. I just picked it up.', 'sad'),
        I('So. You heard me.', 'angry'),
      ],
      [
        ask(
          2,
          'sel',
          'noticing an automatic habit and pausing',
          'CASEL: Self-management',
          [
            N(
              'Miguel reached for the guitar without thinking. How can we notice an automatic habit?',
            ),
          ],
          [
            opt(
              'Pause and ask what I am about to do',
              [N('Yes. A tiny pause gives us a chance to choose instead of just reacting.')],
              true,
            ),
            opt('Hurry up so there is no time to think', [
              N('Hurrying makes habits stronger. A pause gives us room to choose.'),
            ]),
            opt('Ignore it and hope it stops', [
              N('Habits need noticing before they can change. A pause helps us notice.'),
            ]),
          ],
          'Talked about pausing to notice an automatic habit.',
        ),
      ],
    ),
    scene(
      'a7-05-run',
      [
        M(
          'I don’t need your blessing. I have another family. A musician. He’ll understand.',
          'angry',
        ),
        M(
          'Ernesto de la Cruz. He’s my great-great-grandfather. And he’ll give me his blessing without any rules!',
        ),
        I('That man is not…', 'angry'),
        N(
          'But Miguel is already running, down the stairs and out into the streets of the Land of the Dead.',
        ),
        N(
          'Dante bounds after him, delighted, as if this is the best game anyone has ever invented.',
        ),
        N('Mamá Imelda looks at you. Her face is fierce, and frightened under the fierce.'),
      ],
      [
        ask(
          5,
          'literacy',
          'explain a character’s motive from the clues',
          'RL.3.3',
          [
            N(
              'Mamá Imelda’s face is “fierce, and frightened under the fierce”. What might the fear be about?',
            ),
          ],
          [
            opt(
              'Losing Miguel, as she lost her husband',
              [N('Yes. Her fear of losing another family member sits under her anger.')],
              true,
            ),
            opt('Missing the talent show', [
              N('Not likely. Her fear is about Miguel’s safety, not the show.'),
            ]),
            opt('Being late for supper', [
              N('That doesn’t fit the clues. Her fear seems to be about someone she loves.'),
            ]),
          ],
          'Used clues to explain that a character’s anger covers a deeper fear.',
        ),
      ],
      [
        ch('keep', '“I’ll stay with him. I’ll keep him safe.”', [
          I('Keep him safe, then. And bring him back to me.', 'sad'),
        ]),
        ch('why', '“Why do you hate music so much?”', [
          I('I don’t hate it. I loved it. That’s the trouble.', 'sad'),
          I('Go on. Go after him. Quickly.'),
        ]),
      ],
    ),
    scene(
      'a7-05-run-done',
      [
        N(
          'You catch up with Miguel in a back street, out of breath, his see-through fingers stuffed in his pockets.',
        ),
        M('I just need to find Ernesto. That’s all. How hard can it be?'),
        N('Above you, on every wall, his smiling face is on a poster. All of them say SOLD OUT.'),
      ],
      [
        ask(
          2,
          'maths',
          'multiplication word problem: equal rows',
          '3.OA.A.3',
          [N('One wall has 4 rows of posters, with 7 in each row. How many posters is that?')],
          [
            opt('28', [N('Yes. 4 rows of 7 is 4 × 7 = 28 smiling Ernestos.')], true),
            opt('11', [N('That is 4 + 7. Equal rows mean multiplying: 4 × 7 = 28.')]),
            opt('21', [N('That is 3 rows of 7. With 4 rows, 4 × 7 = 28.')]),
          ],
          'Multiplied 4 × 7 to count posters in equal rows.',
        ),
      ],
    ),
    scene(
      'a7-05-complete',
      [
        N(
          'Behind you, in the Department, Mamá Imelda is filling out a form for a missing boy. She presses so hard the pen goes through.',
        ),
        N(
          'Somewhere in the city, a tall thin skeleton picks the last bit of eyebrow off his face and looks thoughtfully at the poster too.',
        ),
      ],
      [
        ask(
          0,
          'literacy',
          'understand a metaphor about feelings',
          'L.4.5',
          [
            N('Imelda is angry and frightened at once. Sometimes anger is fear wearing a coat.'),
            N('What does “anger is fear wearing a coat” mean?'),
          ],
          [
            opt(
              'Anger can hide a feeling underneath, like fear',
              [
                N(
                  'Yes. It is a metaphor: the coat is the anger we show, and the fear is what it covers.',
                ),
              ],
              true,
            ),
            opt('Angry people wear coats', [
              N('Not really. It is a metaphor, not about clothes. The anger covers a hidden fear.'),
            ]),
            opt('Fear keeps you warm', [
              N('A funny picture! But the coat stands for anger, covering the fear underneath.'),
            ]),
          ],
          'Explained a metaphor, and that anger can cover other feelings, such as fear.',
        ),
      ],
    ),
  ],
  'Every scene of A7-5 has a reader version. The clerk is a comic bureaucrat. The sunrise deadline is a story beat, never a timer.',
);

// ================================================================== A7-6 Héctor
const Q06: EduQuest = quest(
  'a7-06',
  'Héctor',
  {
    'a7-06-s1': {
      goal: 'Hear out the tall skeleton who follows you down the alley.',
      hint: 'He’s waving from behind the bins. Go and talk to him.',
    },
    'a7-06-s2': {
      goal: 'Go with Héctor to Shantytown to borrow a guitar from his friend.',
      hint: 'Follow Héctor down the stairs to the edge of the city, to the hut by the water.',
    },
    'a7-06-s3': {
      goal: 'Héctor asks you to remember his name. Decide how.',
      hint: 'Sit with Héctor on the step outside the hut and answer him.',
    },
  },
  [
    scene(
      'a7-06-alley',
      [
        H('Psst. Psst. Living boy. Over here. And the… friend. And the… very colourful thing.'),
        N(
          'It is the painter from the Department, without the dress. His suit is shabby and his hat has a hole in it.',
        ),
        H(
          'Héctor. A pleasure. I couldn’t help hearing you need Ernesto de la Cruz. And I need a favour.',
        ),
        H(
          'I get you to him. And you, when you go home, put my photo on your ofrenda. Just one year. So I can cross.',
        ),
        M('Why do you need to cross so badly?'),
        H('Somebody up there I want to see. Before she forgets me. Before it’s too late.', 'soft'),
        N('He holds out a bony hand. Miguel looks at you.'),
      ],
      [
        ask(
          6,
          'sel',
          'think about trust',
          'CASEL: Responsible decision-making',
          [
            N(
              'Héctor admits he can’t be trusted completely, and Miguel shakes his hand anyway. Why might Miguel do that? (There is no one right answer.)',
            ),
          ],
          [
            opt('Because honesty about faults is a kind of trust', [
              N(
                'A thoughtful answer. Someone who admits his flaws is easier to judge than someone who hides them.',
              ),
            ]),
            opt('Because Miguel has no other choice', [
              N(
                'A fair point. Sometimes we have to take a chance because there is no better road.',
              ),
            ]),
            opt('Because Miguel liked him', [
              N(
                'A good point. We often trust our feelings about a person, for better or for worse.',
              ),
            ]),
          ],
          'Thought about why a person might trust someone who is honest about being unreliable.',
        ),
      ],
      [
        ch('shake', 'Nod to Miguel: shake on it.', [
          M('Deal.'),
          H('Deal! Ha! You won’t regret this. Probably.', 'happy'),
        ]),
        ch('trust', '“Can we trust you?”', [
          H('Absolutely not. But I’m all you’ve got, amigo.'),
          N('Miguel shakes his hand anyway. You think it’s the honesty that does it.'),
        ]),
      ],
    ),
    scene(
      'a7-06-alley-done',
      [
        N(
          'He tucks a small, creased photo of himself into Miguel’s pocket, beside the old family one.',
        ),
        H('For your ofrenda. Don’t lose it. It’s the only one there is.'),
        H('First, the boy needs a guitar. I know a man who has one.'),
        H(
          'Come on. And don’t touch anything in Shantytown. Some of it’s still holding the rest up.',
        ),
      ],
      [
        ask(
          0,
          'literacy',
          'use context clues to find a meaning',
          'L.3.4',
          [N('The photo is “small” and “creased”. What does creased mean?')],
          [
            opt(
              'Folded or wrinkled',
              [
                N(
                  'Yes. A creased photo has lines where it has been folded. It has been kept close for years.',
                ),
              ],
              true,
            ),
            opt('Brand new and shiny', [
              N('Not quite. “Creased” suggests an old photo that has been handled a lot.'),
            ]),
            opt('Torn in half', [
              N('A crease is a fold or wrinkle. A tear would split the paper.'),
            ]),
          ],
          'Used context to work out the meaning of creased.',
        ),
      ],
    ),
    scene(
      'a7-06-shantytown',
      [
        N(
          'At the bottom of the city, under all the lights, there is a place of tin roofs and string, where the forgotten live.',
        ),
        N(
          'In a hammock in a hut lies an old skeleton with a bad temper and a guitar on his chest.',
        ),
        CH('Héctor. Last time I lent you something, I never saw it again.', 'angry'),
        CH(
          'Fine. Take it. Only play me something first. One of mine. Something I used to like.',
          'soft',
        ),
        N(
          'Héctor plays an old, rude, silly song about a man and his fine moustache. Chicharrón laughs with his eyes shut.',
        ),
        N('As the last note goes, a soft gold light lifts off Chicharrón, like dust in a sunbeam.'),
        CH('Ah. That’s nice. That’s… nice.', 'soft'),
        N(
          'And then the hammock is empty, and still gently swinging. Chicharrón has faded, which in this story means he is gone for good.',
        ),
        H(
          'Nobody up there remembers him any more. When the last one forgets you, you go. That’s all.',
          'sad',
        ),
        N('It is this story’s idea, and a gentle one. He wasn’t hurt, and he went laughing.'),
      ],
      [
        notice(
          8,
          'social-studies',
          'oral history: people are carried by being remembered and talked about',
          'D2.His.2.K-2',
          [
            N(
              'Before most people wrote things down, stories were passed by speaking. This is called oral history.',
            ),
            N(
              'Names, songs and family stories can carry a person across hundreds of years, one retelling at a time.',
            ),
          ],
          'Learned that oral history keeps people and stories alive by telling them aloud.',
        ),
        ask(
          9,
          'sel',
          'what helps when someone we know has died',
          'CASEL: Social awareness',
          [
            N(
              'Héctor is sad that Chicharrón has died. What helps people when someone they know has died?',
            ),
          ],
          [
            opt(
              'Talking, hugging and remembering them',
              [N('Yes. Sharing the feeling and keeping their memory alive both help.')],
              true,
            ),
            opt('Never talking about them', [
              N(
                'Many people find that makes the sadness heavier. Talking and remembering often helps.',
              ),
            ]),
            opt('Pretending nothing happened', [
              N('It is natural to want to, but feelings need room. Hugs and stories help.'),
            ]),
          ],
          'Talked about what helps people cope when someone has died.',
        ),
      ],
    ),
    scene(
      'a7-06-shantytown-done',
      [
        N(
          'Héctor puts the guitar in Miguel’s hands. His own hand is shaking, and it shines, very faintly, gold at the edges.',
        ),
        M('Héctor. Your hand.'),
        H('It’s nothing. It comes and goes. Mostly comes, lately.', 'sad'),
        N('Miguel tunes the guitar. Six strings, thick to thin, low notes to high.'),
      ],
      [
        notice(
          3,
          'science',
          'thicker strings make lower notes',
          '4-PS3-2',
          [
            N(
              'A guitar usually has six strings. The thickest string sounds lowest and the thinnest sounds highest.',
            ),
            N(
              'Thick strings shake more slowly, and slow shaking makes a low note. Thin strings shake fast and make a high one.',
            ),
          ],
          'Learned that thicker strings vibrate more slowly and sound lower.',
        ),
      ],
    ),
    scene(
      'a7-06-name',
      [
        N(
          'Miguel walks a little way off with the guitar, trying chords. You sit on the step with Héctor, and Dante sits on Héctor.',
        ),
        H(
          'There’s one person up there who still remembers me. Only one. And she’s very old.',
          'sad',
        ),
        H(
          'When she forgets, I go the way Chicharrón went. So I’m asking everyone I meet. Even strangers. Even you.',
        ),
        H('Will you remember my name? Héctor. That’s all. Just Héctor.'),
        N(
          'He looks at your Nubbin’s orange ribbon. He pulls a loose thread from the cuff of his old jacket.',
        ),
        H(
          'Or, if it’s not too much, you could put it somewhere it couldn’t fall out of your head.',
        ),
      ],
      [
        notice(
          3,
          'literacy',
          'the accent mark in Héctor shows which part to stress',
          'L.3.4',
          [
            N(
              'In Spanish, an accent mark like the one on the É shows which syllable to say loudest: HÉC-tor.',
            ),
            N(
              'The little mark is part of how the name is spelled. Writing it correctly is a way of respecting the person.',
            ),
          ],
          'Learned that Spanish accent marks show which syllable to stress.',
        ),
        ask(
          4,
          'sel',
          'compare a stitched name with a promise',
          'CASEL: Responsible decision-making',
          [
            N(
              'Which keeps a name safer: stitched in cloth, or promised aloud? (There is no one right answer.)',
            ),
          ],
          [
            opt('Stitched: it stays even if I forget', [
              N('A fair point. Things we make can hold a memory when our own memory slips.'),
            ]),
            opt('Promised: I carry it with me everywhere', [
              N('A fair point. A promise lives in a person and goes wherever they go.'),
            ]),
            opt('Both, and best of all together', [
              N('A wise answer. Written things and spoken promises protect one another.'),
            ]),
          ],
          'Compared stitching a name with promising to remember it.',
        ),
      ],
      [
        ch(
          'ribbon',
          'Stitch his name into your Nubbin’s ribbon.',
          [
            N(
              'Héctor threads his jacket thread onto a fishbone needle. You stitch, slowly, with your Nubbin very still: H, É, C, T, O, R.',
            ),
            N(
              'The letters are crooked, and the accent is a bit big. Héctor holds the ribbon up to the light for a long time.',
            ),
            H(
              'Nobody’s written my name down in a hundred years. It looks good. It looks like somebody.',
              'soft',
            ),
          ],
          { 'a7-name': 'ribbon' },
        ),
        ch(
          'promise',
          'Promise him. Just your word.',
          [
            Y('Héctor. I won’t forget. I promise.'),
            N('He looks at you hard, the way people look at a coin to see if it’s real.'),
            H(
              'A promise. All right. I’ve made a lot of those. Let’s see if one of us can keep one.',
              'soft',
            ),
          ],
          { 'a7-name': 'promise' },
        ),
      ],
    ),
    scene(
      'a7-06-name-done',
      [
        H(
          'Right! Enough sitting. We have a boy to make famous, and a famous man to find.',
          'happy',
        ),
        N('He jumps up, and only wobbles a little.'),
        N(
          'HÉCTOR has six letters. If each letter took eight stitches to sew, that would be a lot of careful work.',
        ),
      ],
      [
        ask(
          2,
          'maths',
          'multiply within 100',
          '3.OA.A.3',
          [N('HÉCTOR has 6 letters. If each letter took 8 stitches, how many stitches is that?')],
          [
            opt('48', [N('Yes. 6 × 8 = 48 stitches.')], true),
            opt('14', [N('That is 6 + 8. For six groups of eight, multiply: 6 × 8 = 48.')]),
            opt('42', [N('Close. 6 × 7 is 42. For eight stitches a letter, 6 × 8 = 48.')]),
          ],
          'Multiplied 6 × 8 to count stitches in a name.',
        ),
      ],
    ),
    scene(
      'a7-06-complete',
      [
        M('Héctor? How do we get to Ernesto? There were posters everywhere. Sold out.'),
        H(
          'There’s a talent show tonight. The winner gets to play at his party. At his mansion. In front of him.',
        ),
        M('A talent show? I was going to play in a talent show tonight!', 'happy'),
        H('Then you’re already practised. Come on. And you’re going to need a better face.'),
      ],
      [
        ask(
          2,
          'literacy',
          'the meaning of talent',
          'L.3.4',
          [N('“A talent show.” What does the word “talent” mean?')],
          [
            opt(
              'A natural skill you can show others',
              [N('Yes. A talent is something you are good at, like music, dancing or juggling.')],
              true,
            ),
            opt('A kind of prize', [N('A prize is what you win. A talent is the skill itself.')]),
            opt('A type of costume', [
              N('A costume is what you wear. A talent is something you can do well.'),
            ]),
          ],
          'Worked out the meaning of talent.',
        ),
      ],
    ),
  ],
  'Every scene of A7-6 has a reader version. Both name choices keep their a7-name flag. Chicharrón’s fade is said plainly and gently, once, and followed by comfort.',
);

// ================================================================== A7-7 The Talent Show
const Q07: EduQuest = quest(
  'a7-07',
  'The Talent Show',
  {
    'a7-07-s1': {
      goal: 'Help paint Miguel’s face so he looks like one of the dead.',
      hint: 'Hand Héctor the white paint and the black, and hold the mirror steady.',
    },
    'a7-07-s2': {
      goal: 'Go on stage with Miguel and Héctor.',
      hint: 'Keep time with the music: tap with the beat to get the crowd clapping.',
    },
    'a7-07-s3': {
      goal: 'Get away through the back streets, and then stay with Miguel.',
      hint: 'Run out behind the stage. When you stop, stand by Miguel.',
    },
  },
  [
    scene(
      'a7-07-paint',
      [
        H(
          'Hold still. A living boy at a talent show for the dead. They’ll have you out of there by your ear.',
        ),
        N(
          'Héctor paints Miguel’s face white with a brush, then black round his eyes, then a row of skull teeth across his lips.',
        ),
        M('Do I look dead?'),
        H('You look like a boy who fell in some paint. But it’s dark in there.'),
        N(
          'Your Nubbin, all pink and green and yellow, holds up a little mirror. Miguel grins, and the painted teeth grin too.',
        ),
        H('Now. Stage fright. You have stage fright?'),
      ],
      [
        notice(
          1,
          'social-studies',
          'calaveras: painted skulls are a cheerful part of Día de Muertos art',
          'D2.His.2.K-2',
          [
            N(
              'Calavera is Spanish for skull. In Mexico, people paint calavera faces and make sugar skulls with names iced on them.',
            ),
            N(
              'The skulls are bright and smiling, a happy way of showing that death is part of life. Painting a face this way is a respectful art, not a costume party.',
            ),
          ],
          'Learned that calaveras are bright, friendly skulls used in Día de Muertos art.',
        ),
      ],
      [
        ch('mirror', 'Paint a small skull on your own cheek too.', [
          H('Look at that! A natural. You’ve been dead for years.', 'happy'),
        ]),
        ch('nubbin', 'Let your Nubbin dab a dot on Miguel’s nose.', [
          M('Hey!'),
          H('No, leave it. It’s good. It’s… artistic.', 'happy'),
        ]),
      ],
    ),
    scene(
      'a7-07-paint-done',
      [
        N(
          'Overhead, the papel picado flags across the square are cut into dancing skeletons. They wave in the warm wind.',
        ),
        N('Each flag was folded, then cut, so the left side matches the right.'),
        EM('Next! The… boy with the paint. And the tall one. And the little bright thing.'),
      ],
      [
        ask(
          1,
          'maths',
          'lines of symmetry',
          '4.G.A.3',
          [
            N(
              'Papel picado is made by folding paper and cutting. When you unfold it, the design is symmetrical. What does that mean?',
            ),
          ],
          [
            opt(
              'One half is a mirror image of the other',
              [N('Yes. A line of symmetry splits a shape into two matching halves.')],
              true,
            ),
            opt('The paper is very big', [
              N('Size has nothing to do with it. Symmetry means the two sides match.'),
            ]),
            opt('The paper has lots of colours', [
              N('Colours can vary. Symmetry is about matching halves.'),
            ]),
          ],
          'Explained symmetry as matching halves, using folded cut paper.',
        ),
        notice(
          0,
          'art',
          'papel picado is hand-cut paper, a Mexican folk art',
          null,
          [
            N(
              'Papel picado means “punched paper”. Makers stack sheets of tissue paper and cut patterns with tiny chisels, or fold and snip with scissors.',
            ),
            N(
              'It decorates streets, altars and ofrendas, and is a folk art in Mexico, passed from maker to maker.',
            ),
          ],
          'Learned how papel picado is made and used.',
        ),
      ],
    ),
    scene(
      'a7-07-stage',
      [
        N(
          'The stage is a ring of light. Beyond it are hundreds of skeletons in their best clothes, chatting and not listening.',
        ),
        N('Miguel’s hands won’t move. His mouth opens, and nothing comes out.'),
        H(
          'Hey. Hey, chamaco. Forget them. Look at me. Just play. Play like it’s the attic.',
          'soft',
        ),
        N('Miguel looks at Héctor, and at your Nubbin, who is bouncing. He starts to play.'),
        N('It is a quick, silly song, all stamping feet and a singer going dizzy over someone.'),
        N('By the second time round, the crowd is clapping. By the third, they are on their feet.'),
        N(
          'Somewhere in the middle of it, Héctor stops performing, and just watches Miguel play, with a very strange look on his face.',
        ),
      ],
      [
        notice(
          2,
          'sel',
          'stage fright: butterflies are normal, and a friend or a breath helps',
          'CASEL: Self-management',
          [
            N(
              'Stage fright feels like butterflies in the tummy and a dry mouth. Nearly everyone gets it, even famous performers.',
            ),
            N('A slow breath, a friendly face and starting small can help the butterflies settle.'),
          ],
          'Learned that nerves before performing are normal and that breathing and a friendly face help.',
        ),
        doIt(
          5,
          'music',
          'keep a steady beat',
          null,
          'edu:clap:beat:steady',
          [
            N(
              'A beat is the steady pulse under a song. Clap four even beats, then try a faster set.',
            ),
          ],
          'Clapped a steady beat, slow and then faster.',
        ),
      ],
    ),
    scene(
      'a7-07-stage-done',
      [
        N('The crowd roars. Then, behind them, a voice even louder than the crowd.'),
        I('MIGUEL!', 'angry'),
        N(
          'The whole Rivera family is pushing through the crowd. Mamá Imelda has her shoe in her hand.',
        ),
      ],
      [
        ask(
          1,
          'sel',
          'read the mixed feelings in someone’s shout',
          'CASEL: Social awareness',
          [
            N(
              'Mamá Imelda shouts Miguel’s name with her shoe in her hand. Which feelings might be mixed in her shout?',
            ),
          ],
          [
            opt(
              'Anger and worry',
              [
                N(
                  'Yes. She has been looking all night, so relief and fear can be mixed in with the anger.',
                ),
              ],
              true,
            ),
            opt('Pure joy', [
              N('She may feel some joy, but the shout and the shoe suggest worry and anger too.'),
            ]),
            opt('Boredom', [
              N(
                'Boredom doesn’t shout across a crowd. She feels strongly, and worry and anger are likely.',
              ),
            ]),
          ],
          'Inferred that a character’s shout can carry several feelings at once.',
        ),
      ],
    ),
    scene(
      'a7-07-row',
      [
        N(
          'You run, all of you, out of the back of the stage and down an alley, until the shouting is a long way off.',
        ),
        H('Ha! Did you see them? Did you hear them? Chamaco, you’re a musician.', 'happy'),
        H(
          'Now. The party is that way. And my photo, don’t forget, my photo goes up on your ofrenda when…',
        ),
        M('Is that all you care about? Your photo?', 'angry'),
        H('It’s not all I care about! But it’s… it’s important. You don’t understand.', 'sad'),
        M(
          'I understand. You’re just using me. You’re not my family. Ernesto is my family.',
          'angry',
        ),
        H('Fine! Go to your famous family! Go!', 'angry'),
        N(
          'Miguel runs. Héctor stands in the alley with his arms out, as if he’s still holding a guitar.',
        ),
        N('His hand is shining at the edges again. Brighter now.'),
      ],
      [
        ask(
          5,
          'literacy',
          'your point of view versus a character’s',
          'RL.3.6',
          [
            N(
              'Miguel says Héctor is “just using” him. From where you stand, is that fair? (There is no one right answer.)',
            ),
          ],
          [
            opt('No. Héctor cares about Miguel too', [
              N(
                'A fair view. You saw Héctor’s face during the song, so you know more than Miguel does.',
              ),
            ]),
            opt('Partly. Héctor did ask for a favour', [
              N(
                'A fair view. Asking for something in return isn’t using someone, but it can feel that way when you are hurt.',
              ),
            ]),
            opt('Yes. He only talks about his photo', [
              N(
                'That is how it looks to Miguel. You may know something he doesn’t, which is a good thing to notice.',
              ),
            ]),
          ],
          'Compared a character’s view with what the reader knows.',
        ),
        ask(
          8,
          'sel',
          'repairing a quarrel',
          'CASEL: Relationship skills',
          [N('Miguel and Héctor both said hurtful things. What helps repair a quarrel?')],
          [
            opt(
              'Cool down, say sorry, and really listen',
              [N('Yes. Calm, an honest sorry and listening are the three steps of repair.')],
              true,
            ),
            opt('Wait for the other person to apologise first', [
              N('Waiting can leave the hurt in place. Either person can start by saying sorry.'),
            ]),
            opt('Pretend it never happened', [
              N('The hurt usually stays hidden. A sorry and a talk help it heal.'),
            ]),
          ],
          'Talked about how to repair a quarrel: calm, sorry, listening.',
        ),
      ],
      [
        ch('follow', 'Follow Miguel.', [
          N('You go after Miguel, because Mamá Imelda asked you to.'),
        ]),
        ch('stay', 'Stop by Héctor first, just for a moment.', [
          N(
            'You put a hand on his arm, and his sleeve is thin. He looks at you, and then down at your Nubbin.',
          ),
          H('Go. Go on. Keep him safe. Somebody should.', 'sad'),
        ]),
      ],
    ),
    scene(
      'a7-07-complete',
      [
        N(
          'Miguel stops under a long string of papel picado that someone has hung between two houses. The flags repeat: guitar, star, marigold, guitar, star, marigold.',
        ),
        M('I don’t need any of them. I just need him.', 'sad'),
        N(
          'Your Nubbin reaches up and pulls one of the paper flags free, and gives it to Miguel. He smiles a tiny bit, by accident.',
        ),
        N(
          'High above the city, a tower is lit up like a birthday, every window gold. Up there, someone is having a party.',
        ),
      ],
      [
        ask(
          0,
          'maths',
          'repeating patterns',
          '4.OA.C.5',
          [N('The flags go guitar, star, marigold, repeating. What is the 10th flag?')],
          [
            opt(
              'A guitar',
              [
                N(
                  'Yes. The pattern repeats every 3, and flag 9 is a marigold, so flag 10 starts again with a guitar.',
                ),
              ],
              true,
            ),
            opt('A star', [N('Check: flags 1, 4, 7, 10 are guitars. Stars are 2, 5, 8.')]),
            opt('A marigold', [
              N('Marigolds are flags 3, 6, 9. Flag 10 begins the pattern again with a guitar.'),
            ]),
          ],
          'Used a repeating pattern of length 3 to find the 10th item.',
        ),
      ],
    ),
  ],
  'Every scene of A7-7 has a reader version. Both choices in each choice scene are kept.',
);

// ================================================================== A7-8 The Mansion
const Q08: EduQuest = quest(
  'a7-08',
  'The Mansion',
  {
    'a7-08-s1': {
      goal: 'Get into Ernesto de la Cruz’s party with a band of musicians.',
      hint: 'Pick up a guitar case and walk in with the band, as if you belong.',
    },
    'a7-08-s2': {
      goal: 'Help Miguel when he falls in the pool.',
      hint: 'Get to the edge of the pool and help pull Miguel out.',
    },
  },
  [
    scene(
      'a7-08-gate',
      [
        N(
          'The tower at the top of the city is Ernesto’s house. At the gate, a doorman is checking a list.',
        ),
        N(
          'A mariachi band is going in: guitars, trumpets, violins, a harp carried by three of them.',
        ),
        M('I’m with the band. We’re all with the band.'),
        N(
          'You pick up a spare guitar case, which is heavier than it looks. Your Nubbin picks up a maraca, which is lighter than it looks.',
        ),
        N(
          'The doorman looks at Miguel’s painted face, your Nubbin’s stripes, and your case. He sighs and waves you through.',
        ),
        M('There he is. There he is!', 'happy'),
      ],
      [
        notice(
          1,
          'social-studies',
          'mariachi music comes from western Mexico',
          'D2.Geo.2.K-2',
          [
            N(
              'Mariachi is a kind of music that grew up in western Mexico, in the state of Jalisco and nearby.',
            ),
            N(
              'A mariachi band usually has violins, trumpets and several kinds of guitar, including a big bass one called the guitarrón.',
            ),
          ],
          'Learned that mariachi music comes from western Mexico and which instruments it uses.',
        ),
        ask(
          3,
          'science',
          'how different instruments make sound',
          '4-PS3-2',
          [
            N(
              'A trumpet player buzzes their lips into the mouthpiece. What is vibrating to make the sound?',
            ),
          ],
          [
            opt(
              'The player’s lips and the air in the tube',
              [
                N(
                  'Yes. Lips buzz, the column of air inside shakes, and that is the sound. Strings do the same job in a guitar.',
                ),
              ],
              true,
            ),
            opt('The shiny metal on the outside', [
              N(
                'The outside is not what makes the note. It is the buzzing lips and the air inside.',
              ),
            ]),
            opt('Nothing vibrates', [
              N('Every sound comes from a vibration. In a trumpet, it is the lips and air.'),
            ]),
          ],
          'Learned that all instruments make sound by vibration.',
        ),
      ],
    ),
    scene(
      'a7-08-gate-done',
      [
        N(
          'Across the pool, under a spotlight he seems to have brought with him, stands Ernesto de la Cruz.',
        ),
        N(
          'He is exactly like his statue: tall, white suit, big smile. People around him laugh before he’s finished his jokes.',
        ),
      ],
      [
        ask(
          1,
          'sel',
          'think about charm and kindness',
          'CASEL: Social awareness',
          [
            N(
              'Everyone laughs before Ernesto’s jokes are finished. Is being charming the same as being kind? (There is no one right answer.)',
            ),
          ],
          [
            opt('No. A charming person can still be unkind', [
              N('A good point. Charm is how someone makes us feel. Kindness is how they treat us.'),
            ]),
            opt('Often, but not always', [
              N(
                'A fair answer. The two can go together, but watching what someone does tells you more.',
              ),
            ]),
            opt('Yes. If someone is charming, they’re kind', [
              N(
                'That would be nice. But it is worth watching how people act when no one is cheering.',
              ),
            ]),
          ],
          'Thought about the difference between being charming and being kind.',
        ),
      ],
    ),
    scene(
      'a7-08-pool',
      [
        N(
          'Miguel takes the guitar and plays, as loud as he can, trying to be heard over the party. Nobody turns round.',
        ),
        N('He backs up to get a better view. He backs up one step too far.'),
        N(
          'He goes into the pool with a great splash. The guitar floats up beside him, because wood is lighter than the same amount of water.',
        ),
        N(
          'Your Nubbin dives straight in after both. It swims like a little painted fish, round and round Miguel.',
        ),
        N(
          'Then a big white sleeve comes down into the water, and a big hand hauls Miguel up onto the side.',
        ),
        ER('Easy, easy! Are you all right, my boy? Saved, just like in the movies!', 'happy'),
        N(
          'Ernesto laughs, and everyone laughs with him. Then he sees the paint run off Miguel’s face, and stops.',
        ),
        ER('Wait. You’re… you’re alive. A living boy. Here?', 'shock'),
        M('I’m Miguel. I’m your great-great-grandson. I came to ask for your blessing.'),
      ],
      [
        notice(
          2,
          'science',
          'why wood floats: it is less dense than water',
          null,
          [
            N(
              'Wood floats because it is less dense than water. Dense means a lot of material packed into a small space.',
            ),
            N(
              'A solid block of wood has less mass than the same volume of water, so the water pushes it up to the surface.',
            ),
          ],
          'Learned that things float when they are less dense than the liquid.',
        ),
        ask(
          6,
          'health',
          'getting warm after getting wet',
          null,
          [N('Miguel is shivering after the pool. What helps him warm up fastest?')],
          [
            opt(
              'Dry off and put on warm, dry things',
              [
                N(
                  'Yes. Wet clothes pull heat from the body, so drying off and wrapping up keeps warmth in.',
                ),
              ],
              true,
            ),
            opt('Stay in his wet clothes', [
              N('Wet clothes make you colder, because water carries heat away from your skin.'),
            ]),
            opt('Run around until he is dry', [
              N('Moving can warm you a bit, but dry, warm things work faster and better.'),
            ]),
          ],
          'Learned that drying off and wrapping up helps the body keep heat.',
        ),
      ],
      [
        ch('help', 'Wrap Miguel in a towel.', [
          N(
            'You find a towel by a lounger and wrap it round him. He is shivering, and grinning, and shivering.',
          ),
        ]),
        ch('nubbin', 'Help your Nubbin out of the pool.', [
          N(
            'Your Nubbin climbs out on its own and shakes. Ernesto’s white suit is now spotted with pink.',
          ),
        ]),
      ],
    ),
    scene(
      'a7-08-pool-done',
      [
        ER(
          'A great-great-grandson! Everyone! I have a great-great-grandson, and he plays!',
          'happy',
        ),
        N(
          'The crowd cheers, and Ernesto lifts Miguel onto his shoulders. Miguel looks as if every birthday has come at once.',
        ),
      ],
      [
        ask(
          1,
          'sel',
          'think about praise that feels too good',
          'CASEL: Responsible decision-making',
          [
            N(
              'Everyone is cheering, yet your Nubbin isn’t clapping. Can attention that feels wonderful still be worth being careful about? (There is no one right answer.)',
            ),
          ],
          [
            opt('Yes. Watch what people do, not just what they say', [
              N('A wise answer. Actions over time tell us more than a warm welcome.'),
            ]),
            opt('No. If it feels good, it is good', [
              N(
                'Feelings are real, but they are not the whole picture. It is still worth looking a little further.',
              ),
            ]),
            opt('Sometimes, if something feels off', [
              N(
                'Good thinking. A quiet feeling that something is off can be a clue to look closer.',
              ),
            ]),
          ],
          'Thought about being careful with praise and trusting a quiet feeling of doubt.',
        ),
      ],
    ),
    scene(
      'a7-08-complete',
      [
        ER(
          'Stay! Stay the night! It’s the best party in the Land of the Dead. It’s my party, so it would be.',
        ),
        N(
          'Fireworks go up from the roof, and Miguel is laughing. Ernesto has his arm round him, and the cameras are flashing.',
        ),
        N('Your Nubbin, dripping, sits by your feet and watches Ernesto, and doesn’t clap.'),
        N('You find you aren’t clapping either. You couldn’t say why.'),
      ],
      [
        ask(
          3,
          'literacy',
          'notice foreshadowing: a small clue about what comes next',
          'RL.3.3',
          [
            N(
              'Everyone claps for Ernesto except you and your Nubbin. Writers sometimes plant a small clue like this.',
            ),
            N('What might the clue be hinting? (There is no one right answer.)'),
          ],
          [
            opt('Ernesto is not what he seems', [
              N('A sharp guess. Keep watching him, and see if the story proves you right.'),
            ]),
            opt('Your Nubbin is just tired and wet', [
              N('Possible! But a writer rarely mentions it twice for nothing. Keep an eye out.'),
            ]),
            opt('Something is about to go wrong', [
              N('A fair guess. A quiet moment in a loud party often warns of trouble ahead.'),
            ]),
          ],
          'Noticed a clue a writer plants about what comes next (foreshadowing).',
        ),
      ],
    ),
  ],
  'Every scene of A7-8 has a reader version. Nobody is in danger: the pool is shallow at the steps.',
);

// ================================================================== A7-9 The Truth
const Q09: EduQuest = quest(
  'a7-09',
  'The Truth',
  {
    'a7-09-s1': {
      goal: 'Watch Ernesto’s old films with Miguel, and see who walks in.',
      hint: 'Sit with Miguel in the film room off the party.',
    },
    'a7-09-s2': {
      goal: 'Hear Héctor remember the night he died.',
      hint: 'Stand by Miguel and listen. Keep your Nubbin close.',
    },
  },
  [
    scene(
      'a7-09-films',
      [
        N(
          'In a room of velvet chairs, Ernesto shows Miguel his old films. Miguel knows every line, and Ernesto is delighted.',
        ),
        N(
          'Then the door opens. It is Héctor, soaking, with a torn jacket, and very out of breath.',
        ),
        H('Ernesto. Old friend.'),
        ER('Héctor? What are you doing here? Who let him in?'),
        H(
          'The boy. He has to put my photo up. You promised me, years ago. You said you’d take my songs and my name with you.',
        ),
        H('You took the songs. You left the name.', 'angry'),
        M('Your songs? What does he mean, your songs?', 'think'),
        N(
          'On the screen, one of Ernesto’s old films is playing: a scene of two friends and a farewell toast with two glasses.',
        ),
      ],
      [
        ask(
          6,
          'sel',
          'honesty: giving credit for who made something',
          'CASEL: Responsible decision-making',
          [
            N(
              'Héctor says Ernesto took his songs and called them his own. What is the honest thing to do with someone else’s work?',
            ),
          ],
          [
            opt(
              'Say clearly who made it',
              [N('Yes. Giving credit is honest, and it is fair to the person who did the work.')],
              true,
            ),
            opt('Say it was yours if no one knows', [
              N(
                'Even if no one finds out, it isn’t true. Honesty means telling the truth when nobody is checking.',
              ),
            ]),
            opt('Say nothing and hope people assume', [
              N(
                'Letting a false idea stand is still a kind of dishonesty. Naming the maker is the honest choice.',
              ),
            ]),
          ],
          'Talked about giving honest credit for someone else’s work.',
        ),
      ],
    ),
    scene(
      'a7-09-films-done',
      [
        N('Héctor stops. He stares at the screen, and watches the glasses chink.'),
        H(
          'I know this. I know this. This is how it went. Only that’s not quite how it went.',
          'shock',
        ),
      ],
      [
        ask(
          1,
          'literacy',
          'point of view: why two tellings of one event differ',
          'RL.3.6',
          [
            N(
              'Héctor says the film shows the toast, but not “quite how it went”. Why might two tellings of one event differ? (There is no one right answer.)',
            ),
          ],
          [
            opt('The teller leaves out the parts that look bad', [
              N(
                'A sharp answer. Whoever tells a story chooses what to put in and what to leave out.',
              ),
            ]),
            opt('People remember things differently', [
              N('A fair answer. Memory and viewpoint both shape how an event is told.'),
            ]),
            opt('A film is made to be exciting', [
              N(
                'A good point. Films shape events for the audience, so they may not match what happened.',
              ),
            ]),
          ],
          'Thought about why different tellings of the same event can differ.',
        ),
      ],
    ),
    scene(
      'a7-09-toast',
      [
        H(
          'I was going home. I’d had enough. I missed my little girl. I packed my guitar and my songs, and I told you I was going.',
        ),
        H('You poured us a drink. One for the road, you said. And I never got home.', 'shock'),
        N('Ernesto doesn’t say anything. His face says it for him.'),
        M('You… you did something to him. You stopped him going home.', 'shock'),
        N('Héctor died that night, long ago. That is why he never came back to his family.'),
        H(
          'You took my guitar. You took my songs. You took my whole life and sang it, and you let them forget me.',
          'angry',
        ),
        ER('I did what I had to do. Anyone would have. And look. Look what I made of them.'),
        N(
          'He says it like a man explaining the weather. It is the most unsettling thing you have seen all night.',
        ),
        ER('Guards. Take them away. The boy too. He’s seen too much.'),
      ],
      [
        notice(
          4,
          'sel',
          'hearing something terrible: big feelings are allowed, and telling someone helps',
          'CASEL: Self-awareness',
          [
            N(
              'When you hear something terrible, it is normal to feel shocked, angry or sad, sometimes all at once.',
            ),
            N(
              'Telling a trusted person how you feel helps. Héctor has Miguel now, and the story is still on his side.',
            ),
          ],
          'Talked about big feelings when hearing something terrible, and telling someone you trust.',
        ),
        ask(
          6,
          'literacy',
          'understand a character’s traits from how he speaks',
          'RL.3.3',
          [
            N(
              'Ernesto says it “like a man explaining the weather”. What does his calm tell us about him? (There is no one right answer.)',
            ),
          ],
          [
            opt('He doesn’t feel sorry', [
              N(
                'A strong reading. Saying something terrible calmly suggests he doesn’t feel the weight of it.',
              ),
            ]),
            opt('He has said it to himself many times', [
              N(
                'A thoughtful reading. People can talk themselves into believing their own excuses.',
              ),
            ]),
            opt('He is used to getting away with it', [
              N('A fair reading. His calm suggests he has never been made to answer for it.'),
            ]),
          ],
          'Inferred a character’s traits from the way he speaks.',
        ),
      ],
      [
        ch('stand', 'Stand in front of Miguel.', [
          N(
            'You step in front of Miguel. It doesn’t stop anything, but it means he isn’t alone when the guards come.',
          ),
        ]),
        ch('photo', 'Grab for Héctor’s photo.', [
          N('Ernesto is quicker. He steps back out of reach, pats his jacket, and smiles.'),
        ]),
      ],
    ),
    scene(
      'a7-09-toast-done',
      [
        N(
          'The guards march you all out, through a back door and down a long stair, to a deep round hole in the ground.',
        ),
        N('Dante, out in the gardens, sees you go, and starts to bark and bark and bark.'),
      ],
      [
        ask(
          1,
          'sel',
          'raise the alarm and get help when a friend is in trouble',
          'CASEL: Responsible decision-making',
          [
            N(
              'Dante sees his friends taken away, and barks for help. What could you do if you saw a friend in trouble?',
            ),
          ],
          [
            opt(
              'Tell a grown-up you trust, straight away',
              [N('Yes. Getting help fast is brave and sensible. Dante is doing his own version.')],
              true,
            ),
            opt('Keep quiet so nobody notices you', [
              N(
                'That can feel safer, but your friend needs help. Telling a trusted grown-up is the brave choice.',
              ),
            ]),
            opt('Try to fix it alone, whatever happens', [
              N('Brave, but risky. Getting a grown-up to help is usually the safest way to help.'),
            ]),
          ],
          'Talked about getting help from a trusted grown-up when a friend is in trouble.',
        ),
      ],
    ),
    scene(
      'a7-09-complete',
      [
        N(
          'The guards drop Miguel and Héctor into the hole. You jump after them, because you are not letting Miguel go alone.',
        ),
        N('Your Nubbin jumps after you, glowing all the way down like a dropped lantern.'),
        N(
          'You land in cold water. Far above, the circle of sky closes, and your Nubbin’s glow lights the wet rock in pink and green.',
        ),
      ],
      [
        ask(
          2,
          'science',
          'we see things when light reaches our eyes',
          '1-PS4-2',
          [N('The cave is dark, yet you can see the rock. How is that possible?')],
          [
            opt(
              'Your Nubbin’s light bounces off the rock into your eyes',
              [
                N(
                  'Yes. We see an object when light from a source bounces off it and reaches our eyes.',
                ),
              ],
              true,
            ),
            opt('The rock makes its own light', [
              N('Not this rock. It is lit by your Nubbin, and the light bounces back to you.'),
            ]),
            opt('Eyes shine light out to see', [
              N('Eyes don’t send light out. They catch light that bounces off things.'),
            ]),
          ],
          'Explained that we see because light bounces off objects into our eyes.',
        ),
      ],
    ),
  ],
  'Every scene of A7-9 has a reader version. Héctor’s death is said once, plainly, with no detail, and is followed by a lesson on big feelings. Ernesto’s menace is in his calm.',
);

// ================================================================== A7-10 The Cenote
const Q10: EduQuest = quest(
  'a7-10',
  'The Cenote',
  {
    'a7-10-s1': {
      goal: 'Find a way round the dark cenote, and find Héctor.',
      hint: 'Your Nubbin’s glow lights the way. Follow the rock ledge round the water.',
    },
    'a7-10-s2': {
      goal: 'Sit with Héctor and Miguel by the water.',
      hint: 'Sit down on the ledge with them. There’s no rush now.',
    },
    'a7-10-s3': {
      goal: 'Watch for help from above.',
      hint: 'Look up at the rim of the cenote. Something is coming.',
    },
  },
  [
    scene(
      'a7-10-dark',
      [
        N(
          'The cenote is a deep round well of limestone, with a pool of black water at the bottom. The walls go straight up.',
        ),
        N(
          'The only light is your Nubbin. Its painted stripes glow pink and green on the wet rock.',
        ),
        M('Héctor? Héctor!'),
        N('You find him sitting on a ledge at the edge of the water, his hat in his hands.'),
        H(
          'All this time. I thought I was just unlucky. I thought I’d slipped on the road home or something stupid.',
          'sad',
        ),
        H('He took the songs. Fine. Songs are songs. But I never got home to my girl.'),
        M('Your girl?'),
        H(
          'My daughter. She was this high. She had a laugh like a hiccup. I wrote her songs. One every night, almost.',
          'soft',
        ),
        H('Coco. Her name’s Coco.', 'soft'),
      ],
      [
        notice(
          8,
          'science',
          'how cenotes form: rain dissolves limestone, and the roof collapses',
          '4-ESS2-1',
          [
            N(
              'Cenotes are real, and many are in the Yucatán Peninsula, in south-east Mexico. They form where rainwater slowly dissolves limestone, leaving caves.',
            ),
            N(
              'When a cave roof collapses, it makes a deep, round hole open to the sky. The ancient Maya treated many cenotes as sacred places.',
            ),
          ],
          'Learned that cenotes form when rain wears away limestone and a cave roof collapses.',
        ),
        ask(
          4,
          'literacy',
          'the stories we tell ourselves when we do not know the truth',
          'RL.3.3',
          [
            N(
              'Héctor thought he was “just unlucky”. When we don’t know the real reason for something, what stories do we tell ourselves?',
            ),
            N('(There is no one right answer.)'),
          ],
          [
            opt('Stories where it is our own fault', [
              N(
                'A common one. Our minds sometimes fill gaps with blame, even when we did nothing wrong.',
              ),
            ]),
            opt('Stories that call it bad luck', [
              N('Also common. Luck can feel easier than imagining someone chose to hurt us.'),
            ]),
            opt('We keep asking until we find out', [
              N('A strong answer. Asking questions is how Héctor, and you, find out the truth.'),
            ]),
          ],
          'Reflected on how people explain events to themselves when the truth is hidden.',
        ),
      ],
      [
        ch('look', 'Look at Miguel.', [
          N('Miguel’s face has gone white under the last of the paint. He is holding his breath.'),
        ]),
        ch('ask', 'Ask Héctor about her.', [
          H(
            'She’d be old now. Very old. Nearly as old as me, which is a joke, because I’m dead.',
            'soft',
          ),
        ]),
      ],
    ),
    scene(
      'a7-10-dark-done',
      [
        N(
          'Miguel goes absolutely still. He takes the old family photo out of his pocket: Imelda, the little girl, and a man with no face.',
        ),
        M(
          'Mamá Coco. That’s Mamá Coco. You’re the man in the photo. You’re my great-great-grandfather.',
          'shock',
        ),
        H('I’m your what?', 'shock'),
      ],
      [
        ask(
          1,
          'social-studies',
          'family history: counting generations',
          'D2.His.2.K-2',
          [N('Mamá Coco is Miguel’s great-grandmother. So Coco’s papá, Héctor, is Miguel’s…?')],
          [
            opt(
              'Great-great-grandfather',
              [
                N(
                  'Yes. Coco is three steps back, so her papá is four steps back: great-great-grandfather.',
                ),
              ],
              true,
            ),
            opt('Great-grandfather', [
              N(
                'Not quite. Coco is the great-grandmother, so her father is one step further back.',
              ),
            ]),
            opt('Grandfather', [N('A grandfather is two steps back. Héctor is four.')]),
          ],
          'Worked out a great-great-grandfather by counting generations.',
        ),
      ],
    ),
    scene(
      'a7-10-water',
      [
        N(
          'For a while, nobody says anything. Héctor and Miguel just look at each other, as if they are learning a song by heart.',
        ),
        H(
          'You play like me. I knew it. Tonight on the stage. I knew it, and I didn’t know what it was.',
          'soft',
        ),
        M(
          'She remembers you. Mamá Coco. She still asks for you. She asks if her papá is coming home.',
        ),
        H('She still asks?', 'sad'),
        N(
          'His hand shines gold at the edges, brighter than ever. He holds it up and looks through it at the water.',
        ),
        H(
          'Not for long, though. She’s fading up there. So I’m fading down here. It’s the same thing.',
          'sad',
        ),
        N(
          'Your Nubbin climbs onto Héctor’s knee. Its orange ribbon, with his name stitched crooked on it, catches the glow.',
        ),
        H('Look at that. Still there. Still mine. Somebody wrote me down.', 'soft'),
        N('He touches the letters, one at a time, as if checking the spelling.'),
      ],
      [
        ask(
          7,
          'literacy',
          'theme: how remembering keeps people close',
          'RL.4.2',
          [
            N(
              'Héctor says Coco fading and himself fading are “the same thing”. What do you think the story is saying about remembering? (There is no one right answer.)',
            ),
          ],
          [
            opt('People live on in those who remember them', [
              N('A thoughtful theme. Many stories say that we continue in the memories we leave.'),
            ]),
            opt('Remembering takes effort, from everyone', [
              N(
                'A fair theme. A name stitched in cloth or spoken aloud is something you do, not just something you feel.',
              ),
            ]),
            opt('Being forgotten is a real loss', [
              N(
                'A fair theme. The story takes that loss seriously, and shows what we can do about it.',
              ),
            ]),
          ],
          'Thought about the theme of remembering in the story.',
        ),
      ],
    ),
    scene(
      'a7-10-water-done',
      [
        H(
          'If I go before you get home. Tell her. Tell her her papá was coming home. He was on his way.',
          'sad',
        ),
        M('You tell her. You’re coming too.'),
      ],
      [
        ask(
          0,
          'sel',
          'understand why someone needs to be understood',
          'CASEL: Social awareness',
          [
            N(
              'Héctor asks Miguel to tell Coco he “was coming home”. Why does that matter so much to him?',
            ),
          ],
          [
            opt(
              'He wants her to know he never left her on purpose',
              [
                N(
                  'Yes. Being thought of as someone who abandoned her would hurt far more than being gone.',
                ),
              ],
              true,
            ),
            opt('He wants to look brave', [
              N('Not likely. His voice is sad, and he cares most about Coco’s feelings.'),
            ]),
            opt('He wants the guitar back', [
              N('The guitar isn’t on his mind. His message is about Coco.'),
            ]),
          ],
          'Explained why a character wants a particular message passed on.',
        ),
      ],
    ),
    scene(
      'a7-10-glow',
      [
        N(
          'Far above, there is barking. A long, joyful, ridiculous bark that you would know anywhere.',
        ),
        N('Dante’s face appears at the rim. Then the whole of him starts to shine.'),
        N(
          'Colour sweeps over him like a wave: blue, pink, green, gold, in swirls and dots. Wings open on his back, small and bright.',
        ),
        M('Dante! Dante’s a real alebrije! You were a spirit guide the whole time?', 'happy'),
        N(
          'Your Nubbin answers the light. Its colours flare up all at once, every stripe and spot alight, its little wings glowing.',
        ),
        N(
          'Then a huge shape drops over the rim: a winged jaguar as big as a horse, painted every colour there is, with Mamá Imelda on her back.',
        ),
        I('Pepita. Down. Gently.'),
        N(
          'The great alebrije lands on the ledge. Mamá Imelda looks at Miguel, and then at Héctor, for a long, long time.',
        ),
        I('You.', 'angry'),
        H('Hola, Imelda.', 'soft'),
      ],
      [
        notice(
          5,
          'science',
          'jaguars: the largest cat in the Americas',
          '2-LS4-1',
          [
            N(
              'Jaguars are real. They are the biggest wild cats in the Americas, and they live in forests, wetlands and grasslands from Mexico down to South America.',
            ),
            N(
              'Jaguars are excellent swimmers, which suits a painted jaguar who has just appeared over a well of water.',
            ),
          ],
          'Learned that jaguars are the largest wild cat in the Americas and live in several habitats.',
        ),
      ],
    ),
    scene(
      'a7-10-glow-done',
      [
        M('He didn’t leave you, Mamá Imelda. He was coming home. Ernesto stopped him.'),
        N(
          'Mamá Imelda says nothing. But she holds out her hand, and pulls Héctor up onto Pepita’s back behind her.',
        ),
        I('We are going to get that photo back. And then we will talk, you and I.'),
      ],
      [
        ask(
          1,
          'sel',
          'helping and forgiving are not the same thing',
          'CASEL: Social awareness',
          [
            N(
              'Imelda pulls Héctor up, but says they will “talk”. Is helping someone the same as forgiving them? (There is no one right answer.)',
            ),
          ],
          [
            opt('No. You can help before you forgive', [
              N(
                'A wise answer. Forgiveness can take time, and kindness can begin before it is finished.',
              ),
            ]),
            opt('Yes. If you help, you have forgiven', [
              N(
                'That can be true for some people. For others, forgiving comes later, after talking.',
              ),
            ]),
            opt('It depends on the person', [
              N('A fair answer. Everyone forgives in their own way and at their own speed.'),
            ]),
          ],
          'Thought about whether helping someone is the same as forgiving them.',
        ),
      ],
    ),
    scene(
      'a7-10-complete',
      [
        N('Pepita rises out of the cenote in great slow wingbeats, with all of you clinging on.'),
        N('Each downbeat of her wings pushes air down, and the air pushes back up on her.'),
        N(
          'Your Nubbin rides on Dante’s back, both of them blazing with colour, both of them very pleased with themselves.',
        ),
        N(
          'Below, the city glitters. Ahead, the sky over the Land of the Dead is starting, very faintly, to go grey.',
        ),
      ],
      [
        ask(
          1,
          'science',
          'forces: lift from pushing air down',
          '3-PS2-1',
          [N('Pepita’s wings push air down. What does the air do back to her?')],
          [
            opt(
              'Pushes her up',
              [
                N(
                  'Yes. Every push has an equal push back. Air pushed down pushes the wings, and the animal, up.',
                ),
              ],
              true,
            ),
            opt('Pulls her down', [
              N('That is gravity’s job. The air pushed down by the wings pushes her up.'),
            ]),
            opt('Nothing at all', [
              N('Pushes always have a push back. Pushing the air down pushes the wings up.'),
            ]),
          ],
          'Explained that wings push air down and the air pushes back up.',
        ),
      ],
    ),
  ],
  'Every scene of A7-10 has a reader version. Both name routes use a variant of a7-10-water; the lesson ids differ.',
);

// ================================================================== A7-11 The Blessing
const Q11: EduQuest = quest(
  'a7-11',
  'The Blessing',
  {
    'a7-11-s1': {
      goal: 'Sneak backstage at the Sunrise Spectacular with the Rivera family.',
      hint: 'Keep close to the family, behind the stage flats, while Mamá Imelda goes on.',
    },
    'a7-11-s2': {
      goal: 'Watch Ernesto in front of the cameras.',
      hint: 'Stay behind the scenery and watch the big screens.',
    },
    'a7-11-s3': {
      goal: 'Before sunrise, Miguel needs a blessing. Speak up for him.',
      hint: 'Go to Mamá Imelda on the ledge and choose what you plead for.',
    },
  },
  [
    scene(
      'a7-11-backstage',
      [
        N(
          'Ernesto’s great dawn concert, the Sunrise Spectacular, fills a stadium. Thousands of the dead are waiting for him.',
        ),
        N(
          'The whole Rivera family slips in through the back, in borrowed costumes: the twins are both ends of a pantomime horse.',
        ),
        JU('Find the photo. Find Ernesto. Get the photo. Get out. Simple.'),
        TW('We are the back end. We don’t know where we’re going.'),
        N(
          'A stage manager grabs Mamá Imelda by the arm, thinking she is the next act, and pushes her out into the lights.',
        ),
        I('I… I don’t…', 'shock'),
        N('She stands in front of thousands of people. She hasn’t sung in a hundred years.'),
        N(
          'Then Héctor, in the wings, starts to play an old tune they both know. Mamá Imelda closes her eyes, and sings.',
        ),
        N('It is an old song, slow and fierce. The whole stadium goes quiet to hear it.'),
      ],
      [
        notice(
          7,
          'science',
          'how a voice works: vocal folds vibrate',
          '4-PS3-2',
          [
            N(
              'When you sing, two small folds of tissue in your throat, the vocal folds, vibrate as air from your lungs passes over them.',
            ),
            N(
              'Tighter folds vibrate faster and make a higher note. That is the same rule as a guitar string.',
            ),
          ],
          'Learned that the voice is made by vibrating vocal folds, like a string.',
        ),
        ask(
          6,
          'literacy',
          'why might someone stop doing what they love',
          'RL.3.3',
          [
            N(
              'Mamá Imelda hasn’t sung in a hundred years. Why might a person stop doing something they love? (There is no one right answer.)',
            ),
          ],
          [
            opt('It reminds them of something painful', [
              N(
                'A thoughtful answer. Joy and grief can be tied together, so one brings back the other.',
              ),
            ]),
            opt('They think they must give it up for others', [
              N(
                'A fair answer. People sometimes give up a love in order to keep a promise or protect someone.',
              ),
            ]),
            opt('Life gets busy and they stop', [
              N('That is common too. But Imelda’s reason runs deeper, as the story shows.'),
            ]),
          ],
          'Thought about why a character might stop doing something she loves.',
        ),
      ],
    ),
    scene(
      'a7-11-backstage-done',
      [
        N(
          'When the song ends, Mamá Imelda looks into the wings at Héctor. Something in her face has come undone, just a little.',
        ),
        I('Don’t. Don’t say anything. Not yet.', 'soft'),
      ],
      [
        ask(
          1,
          'sel',
          'feeling several feelings at once',
          'CASEL: Self-awareness',
          [
            N(
              'Mamá Imelda feels something “come undone”. Can a person feel anger, love and sadness all at once?',
            ),
          ],
          [
            opt(
              'Yes. Feelings often come in mixtures',
              [
                N(
                  'Yes. Naming each strand helps us understand our feelings, instead of being swept away.',
                ),
              ],
              true,
            ),
            opt('No. You feel one thing at a time', [
              N('Many people feel several at once. It can be confusing, and that is normal.'),
            ]),
          ],
          'Learned that people can feel several feelings at once, and that naming them helps.',
        ),
      ],
    ),
    scene(
      'a7-11-screens',
      [
        N(
          'Ernesto catches Miguel by the stage door. He doesn’t know a camera crew is filming everything for the big screens.',
        ),
        ER(
          'Your great-great-grandfather is nobody. I am somebody. And I’ll do whatever it takes to stay somebody.',
          'angry',
        ),
        ER('I did it to him. I’ll do it to you. Nobody will ever know.'),
        N(
          'Every screen in the stadium is showing his face, and thousands of the dead have heard every word. He has confessed in front of everyone.',
        ),
        N(
          'The crowd starts to boo. Then they start to throw things: shoes, fruit, a whole tray of pan de muerto.',
        ),
        N(
          'Somewhere above, a great bell knocked loose in the scuffle swings once, and comes down. Ernesto is under it, stuck, and very cross.',
        ),
        N(
          'Nobody is hurt. In the scramble, Héctor’s photo slips out of Ernesto’s jacket and flutters down into the water by the stage.',
        ),
        M('No. No! The photo!', 'sad'),
      ],
      [
        ask(
          3,
          'literacy',
          'theme: being caught is not the same as being sorry',
          'RL.4.2',
          [
            N(
              'Ernesto was caught on camera. Is being found out the same as being sorry? (There is no one right answer.)',
            ),
          ],
          [
            opt('No. Sorry is about how you feel and what you change', [
              N(
                'A strong answer. Being sorry means understanding the hurt and wanting to put it right.',
              ),
            ]),
            opt('Sometimes being caught makes people sorry', [
              N(
                'A fair point. Being found out can wake someone up, though real sorry has to go deeper.',
              ),
            ]),
            opt('Yes. If you are caught you are sorry', [
              N(
                'Many people are sorry they got caught. It is worth asking whether they are sorry for the harm.',
              ),
            ]),
          ],
          'Thought about the difference between being caught and being truly sorry.',
        ),
      ],
    ),
    scene(
      'a7-11-screens-done',
      [
        N(
          'Héctor stumbles. The gold light is all over him now, and you can see the stage through his arm.',
        ),
        H('It’s all right, chamaco. It’s all right. It’s my fault for being forgettable.', 'sad'),
      ],
      [
        // The sel beat plays first so it never sits next to the plea's sel beat in a7-11-blessing.
        ask(
          1,
          'sel',
          'being kind to yourself: not everything is your fault',
          'CASEL: Self-awareness',
          [N('Héctor says it’s his fault for being forgettable. Is it his fault?')],
          [
            opt(
              'No. Being forgotten is not his fault',
              [N('Right. Others failed to remember him. He didn’t fail anyone.')],
              true,
            ),
            opt('Yes. He should have been more memorable', [
              N(
                'Nobody earns being forgotten. Blaming himself doesn’t change what happened to him.',
              ),
            ]),
          ],
          'Talked about not taking the blame for things outside your control.',
        ),
        ask(
          1,
          'science',
          'transparent and opaque materials',
          '2-PS1-1',
          [
            N(
              'You can see the stage through Héctor’s arm, as if he were made of glass. Which of these materials lets light pass right through?',
            ),
          ],
          [
            opt(
              'A clear glass window',
              [N('Yes. Glass is transparent: light passes through, so we see clearly through it.')],
              true,
            ),
            opt('A wooden door', [
              N('Wood is opaque: it blocks light, so we can’t see through it.'),
            ]),
            opt('A brick wall', [N('Brick is opaque too. Light can’t pass through it.')]),
          ],
          'Sorted materials by whether light passes through them.',
        ),
      ],
    ),
    scene(
      'a7-11-blessing',
      [
        N(
          'On a ledge above the city, at the edge of the dawn, the family gather round Miguel. His hands are almost all bone now.',
        ),
        N('Héctor is barely there. He is a shape of gold light in a shabby jacket.'),
        M(
          'If I go back and Mamá Coco forgets him, he’s gone. I have to go back. I have to make her remember.',
          'sad',
        ),
        I('Miguel.', 'soft'),
        N(
          'Mamá Imelda takes a marigold petal from her shawl. She looks at it, and at Miguel, and then at you.',
        ),
        I('You came all this way with him. You watched him. Tell me. What blessing should I give?'),
      ],
      [
        ask(
          5,
          'sel',
          'weighing choices by what they value',
          'CASEL: Responsible decision-making',
          [
            N(
              'You can plead for a blessing with no conditions, for one that includes Héctor, or sit with Miguel and let him ask.',
            ),
            N('Which values matter most to you? (There is no one right answer.)'),
          ],
          [
            opt('Freedom, with no strings', [
              N('A fair value. A gift with no conditions treats a person as trusted.'),
            ]),
            opt('Forgiveness, with everyone included', [
              N('A fair value. Bringing everyone back in is brave and generous.'),
            ]),
            opt('Patience, letting him speak for himself', [
              N(
                'A fair value. Sometimes the most helpful thing is to stand beside someone as they speak.',
              ),
            ]),
          ],
          'Reflected on which values guide a hard choice.',
        ),
      ],
      [
        ch(
          'free',
          '“Bless him with no conditions. Let him go home as he is.”',
          [
            I('No conditions. Yes. That’s what a blessing is. I forgot.', 'soft'),
            I('Miguel, I give you my blessing. No conditions. Go home.'),
          ],
          { 'a7-plea': 'free' },
        ),
        ch(
          'both',
          '“Bless him, and bless Héctor too. Let him come home.”',
          [
            I('Héctor. You. I never forgave you.', 'sad'),
            I(
              'Miguel, I give you my blessing. No conditions. Go home, and bring your papá Héctor home with you, in every way you can.',
            ),
            N('Héctor laughs, softly, a sound like someone very surprised to be given a present.'),
          ],
          { 'a7-plea': 'both' },
        ),
        ch(
          'sit',
          'Say nothing. Sit beside Miguel, and let him ask.',
          [
            N(
              'You sit down next to Miguel on the ledge, and wait, and your Nubbin sits too. Mamá Imelda watches you both.',
            ),
            M('Please, Mamá Imelda. Just… let me go. I’ll make her remember. I promise.'),
            I('Then go, mijo. My blessing. No conditions. None.', 'soft'),
          ],
          { 'a7-plea': 'sit' },
        ),
      ],
    ),
    scene(
      'a7-11-blessing-done',
      [
        N(
          'The petal glows in Miguel’s hand. The whole family gives him their blessing then, all together, one after another.',
        ),
        H('Go. Go on, chamaco. Go home.', 'soft'),
        N(
          'The sun comes up over the edge of the world. Gold petals swirl round Miguel, and round you, and round your bright Nubbin.',
        ),
      ],
      [
        notice(
          2,
          'science',
          'the Sun rises in the east, and shadows point west at sunrise',
          '5-ESS1-2',
          [
            N(
              'The Sun always rises in the east. At sunrise your shadow is long and stretches out to the west, away from the Sun.',
            ),
            N(
              'This is because the Earth turns, which makes the Sun appear to move across the sky.',
            ),
          ],
          'Learned that the Sun rises in the east and sunrise shadows point west.',
        ),
      ],
    ),
    scene(
      'a7-11-complete',
      [
        N(
          'The atlas in your pocket goes warm. The Land of the Dead turns to petals, and the petals turn to morning.',
        ),
        N(
          'You are on your knees on the cold floor of Ernesto’s tomb. Miguel is beside you, with the white guitar in his arms.',
        ),
        N(
          'Your Nubbin is beside you too, blue again, mostly. There is still a little pink at the tips of its ears.',
        ),
        M('Mamá Coco. Come on. Come on, quick!'),
      ],
      [
        ask(
          0,
          'literacy',
          'understand a metaphor',
          'L.4.5',
          [
            N(
              '“The Land of the Dead turns to petals, and the petals turn to morning.” Is that a simile or a metaphor?',
            ),
          ],
          [
            opt(
              'A metaphor: it says one thing becomes another',
              [
                N(
                  'Yes. There is no “like” or “as”. The writer says the scene becomes petals, then morning, to show how gently it changes.',
                ),
              ],
              true,
            ),
            opt('A simile: it uses “like” or “as”', [
              N(
                'A simile does use “like” or “as”, but this line doesn’t. It states that one thing becomes another, which makes it a metaphor.',
              ),
            ]),
          ],
          'Told a metaphor from a simile.',
        ),
      ],
    ),
  ],
  'Every scene of A7-11 has a reader version. All three plea choices keep their a7-plea flag. Nobody is hurt by the bell.',
);

// ================================================================== A7-12 Remember
const E_START = N(
  'The atlas turns its own page, gently. It is a year later, and Día de Muertos again.',
);
const E_RIBBON = N(
  'The Riveras’ ofrenda is bigger than ever. Héctor’s photo is on it now, in the middle, the ribbon still tied round the frame.',
);
const E_PROMISE = N(
  'The Riveras’ ofrenda is bigger than ever. Héctor’s photo is on it now, in the middle, where everyone can see him.',
);
const E_COCO: Line[] = [
  N(
    'Mamá Coco’s photo is on it too, beside her papá’s. She died in the spring, in her chair, with her family round her.',
    'soft',
  ),
  N(
    'Tonight she is crossing the marigold bridge, holding her papá’s hand and her mamá’s, coming home to visit.',
    'soft',
  ),
];
const E_HOME = N(
  'The page settles under your hand. You are back in the Grove, with a marigold petal still glowing in your pocket.',
);
const E_REFLECT = N(
  'You think about the ofrenda, and how it is built from small things: a photo, a flower, a name, a song.',
);
const E_BOTH: Line[] = [
  N(
    'This year Miguel put Héctor’s photo up himself, and Mamá Imelda’s right beside it, touching at the frames.',
  ),
  N(
    'On the bridge, Héctor walks between his wife and his daughter, and keeps stopping to wave at people. Mamá Imelda lets him.',
  ),
  N(
    'Miguel plays in the courtyard, and the whole street comes in to listen. Abuelita dances, badly, and doesn’t care who sees.',
  ),
];
const E_SIT: Line[] = [
  N(
    'Miguel plays in the courtyard. Then he stops, and sits down by his little cousin, who is shy of the crowd, and just waits.',
  ),
  N(
    'After a while she leans on him. After a longer while she asks him to play again, and he does.',
    'soft',
  ),
  N(
    'Mamá Imelda, on the bridge, sees it, and says nothing, the way people say nothing when they are very proud.',
  ),
];
const E_FREE: Line[] = [
  N(
    'The whole house is full of music, with Miguel playing in the courtyard. Abuelita is dancing, badly, and doesn’t care who sees.',
  ),
  N(
    'Mamá Imelda listens from the ofrenda, and lets him play as long as he likes. Nobody puts down any rule tonight.',
  ),
];

/** The complete-scene lessons: grief plainly and gently after Coco’s death, then the theme. */
const completeLessons = (): LessonIn[] => [
  notice(
    3,
    'sel',
    'when someone dies it is very sad, and remembering together helps',
    'CASEL: Self-awareness',
    [
      N(
        'When someone dies, their body stops working and cannot start again. It is very sad, and feeling sad is okay.',
      ),
      N('Families also find comfort in remembering together: a photo, a story, a favourite song.'),
    ],
    'Talked plainly about death, that sadness is okay, and that remembering together helps.',
  ),
  ask(
    7,
    'literacy',
    'theme of the whole page',
    'RL.4.2',
    [N('What is the biggest idea this page of the atlas is trying to share?')],
    [
      opt(
        'People live on while we remember them and tell their stories',
        [N('Yes. That is the heart of it, and it is also the heart of Día de Muertos.')],
        true,
      ),
      opt('Music is dangerous', [N('The page shows the opposite. Music helped Coco remember.')]),
      opt('Never talk to strangers', [
        N('The page is about family and remembering, not strangers.'),
      ]),
    ],
    'Identified the theme: people live on while we remember them.',
  ),
];

const Q12: EduQuest = quest(
  'a7-12',
  'Remember',
  {
    'a7-12-s1': {
      goal: 'Run home with Miguel through the waking town.',
      hint: 'Follow Miguel down from the cemetery to the Riveras’ gate.',
    },
    'a7-12-s2': {
      goal: 'Sit with Mamá Coco by the ofrenda.',
      hint: 'Go to Mamá Coco’s chair and sit down beside her.',
    },
    'a7-12-s3': {
      goal: 'Listen while Miguel sings to Mamá Coco.',
      hint: 'Stay by Mamá Coco and listen. Everyone else will come to the door.',
    },
  },
  [
    scene(
      'a7-12-home',
      [
        N(
          'The cemetery is full of families waking up on their blankets, candles burnt down, marigold petals everywhere.',
        ),
        N(
          'Miguel runs through the square, past the statue, which has a pigeon on its head. Nobody stops to look at it now.',
        ),
        N(
          'At the Riveras’ gate, the whole family is out in the street: his father, his mother, Abuelita, cousins, aunts.',
        ),
        EN('Miguel!', 'shock'),
        N(
          'His father holds him so tight that Miguel’s feet come off the ground. Abuelita holds them both.',
        ),
        AB('Where were you? Where were you? We looked all night.', 'sad'),
        M('I’m sorry. I’m sorry. I have to see Mamá Coco. Right now. Please.'),
        N(
          'Abuelita sees the guitar, and her face goes hard. Then she sees Miguel’s face, and her own face stops being hard.',
        ),
      ],
      [
        ask(
          7,
          'sel',
          'why a character’s feelings change',
          'CASEL: Social awareness',
          [N('Abuelita’s face goes hard, and then stops being hard. What changed her feelings?')],
          [
            opt(
              'She saw how much it mattered to Miguel',
              [N('Yes. Seeing his face made her put her worry about the guitar aside.')],
              true,
            ),
            opt('She forgot about the guitar', [
              N(
                'Not forgot. Her feeling for Miguel was simply bigger than her feeling about the rule.',
              ),
            ]),
            opt('She got tired', [
              N('Tiredness doesn’t explain it. The change comes when she sees Miguel’s face.'),
            ]),
          ],
          'Explained why a character’s feelings change in a scene.',
        ),
      ],
      [
        ch('dante', 'Nod at the door: let him go in.', [
          N(
            'Abuelita follows your look to the door, and to the little room beyond it where Mamá Coco sits.',
          ),
        ]),
        ch('arm', 'Offer Abuelita your arm.', [
          AB('Hm. Visitors. Always carrying something.', 'soft'),
          N('She takes your arm anyway, and holds on tighter than she means to.'),
        ]),
      ],
    ),
    scene(
      'a7-12-home-done',
      [
        AB('Go. Go to her. Quickly.', 'soft'),
        N('Dante gets through the door first, as usual. Nobody tells him off.'),
      ],
      [
        notice(
          0,
          'literacy',
          'Spanish word endings: abuela and abuelita',
          'L.3.4',
          [
            N(
              'Abuela is Spanish for grandmother. Adding -ita turns it into abuelita, which means “dear little grandmother”.',
            ),
            N(
              'The ending -ita can show smallness or love: casa and casita, the house and the little house.',
            ),
          ],
          'Learned that the Spanish ending -ita can show love or smallness, as in abuelita.',
        ),
      ],
    ),
    scene(
      'a7-12-coco',
      [
        N(
          'Mamá Coco is in her chair in her room, with the curtains half drawn. She is looking at nothing at all.',
        ),
        M('Mamá Coco? Mamá Coco, it’s me. It’s Miguel.'),
        N('She doesn’t answer, and her eyes don’t move. Miguel’s face crumples.'),
        M(
          'Please. You have to remember your papá. If you forget him, he’ll be gone. Gone for good.',
          'sad',
        ),
        N(
          'Your Nubbin climbs into Mamá Coco’s lap and settles there. Her hand comes down, very slowly, on its back.',
        ),
        N(
          'Her fingers find the orange ribbon round its neck. They find the crooked letters stitched there, and stop.',
        ),
        CO('H… Hé…', 'think'),
        N(
          'She runs her thumb over the letters again and again, like a person reading in the dark.',
        ),
      ],
      [
        notice(
          3,
          'health',
          'some very old people forget; patience, touch and music can help',
          'CASEL: Social awareness',
          [
            N(
              'Some people find remembering harder as they grow very old. It isn’t their fault, and they are still the same person inside.',
            ),
            N(
              'Patience, gentle touch and familiar songs can help. Families often find that music reaches memories words cannot.',
            ),
          ],
          'Learned that forgetting in old age is not anyone’s fault, and that patience, touch and music can help.',
        ),
        ask(
          5,
          'science',
          'animals’ and people’s senses: touch',
          '4-LS1-2',
          [N('Mamá Coco finds the letters with her thumb, in the dark. Which sense is she using?')],
          [
            opt(
              'Touch',
              [
                N(
                  'Yes. Your fingertips are packed with nerve endings, so they can read shapes, like Braille.',
                ),
              ],
              true,
            ),
            opt('Hearing', [
              N('She is using her thumb, so it is touch. Hearing would use her ears.'),
            ]),
            opt('Smell', [
              N('Smell uses the nose. She is reading with her thumb, which is touch.'),
            ]),
          ],
          'Identified touch as the sense used to read stitched letters.',
        ),
      ],
    ),
    scene(
      'a7-12-coco-done',
      [
        N('Miguel looks at Mamá Coco’s moving lips, and then at you, and he picks up the guitar.'),
        M('Mamá Coco. Your papá wrote you a song. I’m going to sing it for you.', 'soft'),
      ],
      [
        ask(
          0,
          'literacy',
          'use clues to understand how a character is changing',
          'RL.2.3',
          [N('What clue tells us Mamá Coco is starting to remember?')],
          [
            opt(
              'Her lips are moving, as if shaping a word',
              [N('Yes. Small, quiet signs like moving lips are how stories show a change.')],
              true,
            ),
            opt('She stands up from her chair', [
              N('She doesn’t stand. The clue is her lips moving.'),
            ]),
            opt('She sings a whole song', [N('That comes later. For now, it is her moving lips.')]),
          ],
          'Used small details to track a character’s change.',
        ),
      ],
    ),
    scene(
      'a7-12-song',
      [
        N(
          'Miguel sings the lullaby Héctor wrote for his little girl, with the guitar soft underneath. It is slow and simple, a song for a bedside.',
        ),
        N(
          'One by one, the family come to the doorway. Abuelita opens her mouth to say no, and then she doesn’t.',
        ),
        N(
          'Mamá Coco’s eyes move, and find Miguel. They fill with light, the way a window does when someone comes home.',
        ),
        CO('Papá…', 'soft'),
        N('And then, in a thin, cracked, perfectly true voice, she begins to sing along.'),
        N(
          'Abuelita has her hand over her mouth. Miguel’s father is crying without trying to hide it.',
        ),
        N(
          'When the song ends, Mamá Coco opens the drawer of her bedside table, and takes out a folded scrap of paper.',
        ),
        N(
          'It is a corner of an old photograph: a smiling man with a moustache, and a guitar. It fits the torn photo exactly.',
        ),
        CO('I kept him. I kept him all this time. Papá used to sing to me.', 'happy'),
      ],
      [
        notice(
          1,
          'music',
          'lullabies: slow, soft songs found in every culture',
          null,
          [
            N(
              'A lullaby is a gentle song for helping a child fall asleep. Families have sung them in every culture and every language.',
            ),
            N(
              'Lullabies are usually slow and soft, with a rocking rhythm, a bit like a heartbeat or a swing.',
            ),
          ],
          'Learned that lullabies are slow, gentle songs found in every culture.',
        ),
        ask(
          4,
          'literacy',
          'why might music reach a memory that words do not?',
          'RL.3.3',
          [
            N(
              'Coco couldn’t answer Miguel’s words, yet she joined the song. Why might music reach a memory when words don’t? (There is no one right answer.)',
            ),
          ],
          [
            opt('Songs are learned over and over, so they stay deep', [
              N('A good answer. Repetition and rhythm help songs stick in memory for a lifetime.'),
            ]),
            opt('Songs are tied to strong feelings', [
              N('A good answer. Feelings help memory, and songs are full of them.'),
            ]),
            opt('She heard her papá’s voice in it', [
              N('A lovely answer. For her it was the voice of someone she loved.'),
            ]),
          ],
          'Thought about why music can reach memories that words cannot.',
        ),
      ],
    ),
    scene(
      'a7-12-song-done',
      [
        N(
          'Miguel fits the corner back into the old photo. It is mended: a family of three, all their faces showing.',
        ),
        N(
          'Imagine folding the photo in half, and in half again. Coco’s corner would fill exactly one of the equal parts.',
        ),
        N(
          'You untie the orange ribbon from your Nubbin’s neck, with HÉCTOR stitched on it, and tie it round the mended photo.',
        ),
        CO('There. Now he won’t get lost.', 'soft'),
      ],
      [
        ask(
          1,
          'maths',
          'unit fractions',
          '3.NF.A.1',
          [
            N(
              'Folded in half twice, a photo has 4 equal parts. Coco kept 1 of them. What fraction is that?',
            ),
          ],
          [
            opt(
              '1/4',
              [N('Yes. One part out of four equal parts is one quarter, written 1/4.')],
              true,
            ),
            opt('1/2', [N('A half would be 1 out of 2 equal parts. This is 1 out of 4, so 1/4.')]),
            opt('4/1', [
              N(
                'The top number is the parts you have, and the bottom is how many equal parts: 1/4.',
              ),
            ]),
          ],
          'Named a unit fraction: one of four equal parts is 1/4.',
        ),
      ],
    ),
    scene(
      'a7-12-complete',
      [E_START, E_RIBBON, ...E_COCO, ...E_FREE, E_REFLECT, E_HOME],
      completeLessons(),
    ),
  ],
  'Every scene of A7-12 has a reader version. Mamá Coco’s death is said once, plainly, with comfort straight after. Variants use the shared epilogue pieces.',
);

// =================================================================== variants
const VARIANTS: EduScene[] = [
  scene(
    'a7-10-water-promise',
    [
      N(
        'For a while, nobody says anything. Héctor and Miguel just look at each other, as if they are learning a song by heart.',
      ),
      H(
        'You play like me. I knew it. Tonight on the stage. I knew it, and I didn’t know what it was.',
        'soft',
      ),
      M(
        'She remembers you. Mamá Coco. She still asks for you. She asks if her papá is coming home.',
      ),
      H('She still asks?', 'sad'),
      N(
        'His hand shines gold at the edges, brighter than ever. He holds it up and looks through it at the water.',
      ),
      H(
        'Not for long, though. She’s fading up there. So I’m fading down here. It’s the same thing.',
        'sad',
      ),
      N('He looks across at you. You say his name, just once, quietly: Héctor.'),
      H('Still got it, eh? The promise. Still in there.', 'soft'),
      N(
        'The gold at his edges dims, just a little, for just a moment. As if one more person holding on makes a difference.',
      ),
    ],
    [
      ask(
        7,
        'literacy',
        'theme: how remembering keeps people close',
        'RL.4.2',
        [
          N(
            'Héctor says Coco fading and himself fading are “the same thing”. What do you think the story is saying about remembering? (There is no one right answer.)',
          ),
        ],
        [
          opt('People live on in those who remember them', [
            N('A thoughtful theme. Many stories say that we continue in the memories we leave.'),
          ]),
          opt('Remembering takes effort, from everyone', [
            N(
              'A fair theme. A name spoken aloud is something you do, not just something you feel.',
            ),
          ]),
          opt('Being forgotten is a real loss', [
            N(
              'A fair theme. The story takes that loss seriously, and shows what we can do about it.',
            ),
          ]),
        ],
        'Thought about the theme of remembering in the story.',
      ),
    ],
  ),
  scene(
    'a7-12-coco-promise',
    [
      N(
        'Mamá Coco is in her chair in her room, with the curtains half drawn. She is looking at nothing at all.',
      ),
      M('Mamá Coco? Mamá Coco, it’s me. It’s Miguel.'),
      N('She doesn’t answer, and her eyes don’t move. Miguel’s face crumples.'),
      M(
        'Please. You have to remember your papá. If you forget him, he’ll be gone. Gone for good.',
        'sad',
      ),
      N(
        'You promised. So you kneel down by her chair, and take her hand, and say it clearly, so she can hear.',
      ),
      Y('Héctor. Your papá’s name is Héctor. He was on his way home to you.'),
      N(
        'Her fingers tighten on yours. Her lips move, as if trying the shape of a word she hasn’t said in a long time.',
      ),
      CO('H… Hé…', 'think'),
    ],
    [
      notice(
        3,
        'health',
        'some very old people forget; patience, touch and music can help',
        'CASEL: Social awareness',
        [
          N(
            'Some people find remembering harder as they grow very old. It isn’t their fault, and they are still the same person inside.',
          ),
          N(
            'Patience, gentle touch and familiar songs can help. Families often find that music reaches memories words cannot.',
          ),
        ],
        'Learned that forgetting in old age is not anyone’s fault, and that patience, touch and music can help.',
      ),
      ask(
        4,
        'sel',
        'keeping a promise by saying the name aloud',
        'CASEL: Responsible decision-making',
        [
          N(
            'You kept your promise by saying Héctor’s name aloud. Why does keeping a promise matter, even a small one?',
          ),
        ],
        [
          opt(
            'It shows people they can trust you',
            [
              N(
                'Yes. Each kept promise builds trust, and trust is what lets people lean on one another.',
              ),
            ],
            true,
          ),
          opt('It doesn’t matter if no one checks', [
            N('Promises matter most when no one is checking. They show who we are.'),
          ]),
        ],
        'Talked about why keeping promises matters.',
      ),
    ],
  ),
  scene(
    'a7-12-song-done-promise',
    [
      N(
        'Miguel fits the corner back into the old photo. It is mended: a family of three, all their faces showing.',
      ),
      N(
        'Imagine folding the photo in half, and in half again. Coco’s corner would fill exactly one of the equal parts.',
      ),
      N(
        'Mamá Coco touches the man’s face in the photo, and then she looks at you, as if she knows you from somewhere.',
      ),
      CO('You said his name. Before. You said it first. Thank you.', 'soft'),
    ],
    [
      ask(
        1,
        'maths',
        'unit fractions',
        '3.NF.A.1',
        [
          N(
            'Folded in half twice, a photo has 4 equal parts. Coco kept 1 of them. What fraction is that?',
          ),
        ],
        [
          opt(
            '1/4',
            [N('Yes. One part out of four equal parts is one quarter, written 1/4.')],
            true,
          ),
          opt('1/2', [N('A half would be 1 out of 2 equal parts. This is 1 out of 4, so 1/4.')]),
          opt('4/1', [
            N('The top number is the parts you have, and the bottom is how many equal parts: 1/4.'),
          ]),
        ],
        'Named a unit fraction: one of four equal parts is 1/4.',
      ),
    ],
  ),
  scene(
    'a7-12-complete-both',
    [E_START, E_RIBBON, ...E_COCO, ...E_BOTH, E_REFLECT, E_HOME],
    completeLessons(),
  ),
  scene(
    'a7-12-complete-sit',
    [E_START, E_RIBBON, ...E_COCO, ...E_SIT, E_REFLECT, E_HOME],
    completeLessons(),
  ),
  scene(
    'a7-12-complete-promise',
    [E_START, E_PROMISE, ...E_COCO, ...E_FREE, E_REFLECT, E_HOME],
    completeLessons(),
  ),
  scene(
    'a7-12-complete-both-promise',
    [E_START, E_PROMISE, ...E_COCO, ...E_BOTH, E_REFLECT, E_HOME],
    completeLessons(),
  ),
  scene(
    'a7-12-complete-sit-promise',
    [E_START, E_PROMISE, ...E_COCO, ...E_SIT, E_REFLECT, E_HOME],
    completeLessons(),
  ),
];

// ================================================================== glossary
const GLOSSARY: GlossaryEntry[] = [
  gloss(
    'papel picado',
    'Paper with patterns cut into it, hung in strings for celebrations in Mexico.',
    'a7-01-plaza',
  ),
  gloss(
    'cempasúchil',
    'The orange marigold flowers used at Día de Muertos. The word comes from Nahuatl.',
    'a7-01-petals',
  ),
  gloss(
    'pan de muerto',
    'A sweet round bread, with strips on top shaped like bones, baked for Día de Muertos.',
    'a7-01-petals-done',
  ),
  gloss(
    'ofrenda',
    'A family altar for remembering people who have died, with photos, flowers, candles and food.',
    'a7-01-photo',
  ),
  gloss(
    'vigil',
    'Staying awake through the night to watch over or remember someone.',
    'a7-03-cemetery',
  ),
  gloss(
    'mausoleum',
    'A building that holds tombs, like a little house for graves.',
    'a7-03-window',
  ),
  gloss(
    'alebrije',
    'A brightly painted fantasy creature, a Mexican folk art.',
    'a7-04-bridge-done',
  ),
  gloss('reunion', 'When people who have been apart come together again.', 'a7-04-complete'),
  gloss(
    'bureaucracy',
    'A system with a lot of forms, rules and desks, where it is hard to get things done.',
    'a7-05-queue',
  ),
  gloss(
    'blessing',
    'A kind wish, or a gift of permission or good luck, given to someone.',
    'a7-05-curse',
  ),
  gloss('creased', 'Folded or wrinkled, with lines where it has been bent.', 'a7-06-alley-done'),
  gloss(
    'calavera',
    'The Spanish word for skull. Painted or sugar calaveras are cheerful Día de Muertos art.',
    'a7-07-paint',
  ),
  gloss('symmetrical', 'Having two matching halves, like a mirror image.', 'a7-07-paint-done'),
  gloss(
    'mariachi',
    'A kind of Mexican music played on guitars, violins and trumpets, or one of its musicians.',
    'a7-02-square',
  ),
  gloss('confessed', 'Admitted that you did something wrong.', 'a7-11-screens'),
  gloss('limestone', 'A pale rock that rainwater can slowly dissolve.', 'a7-10-dark'),
  gloss('lullaby', 'A slow, soft song to help a child fall asleep.', 'a7-12-song'),
];

// ================================================================== exports
export const EDU_A07_READER: EduQuest[] = [
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
].map((q) => {
  const glossary = GLOSSARY.filter((g) => g.scene.startsWith(`reader:${q.of}-`));
  return glossary.length ? { ...q, glossary } : q;
});

/** Reader versions of every scene in ATLAS_A07_VARIANTS. */
export const EDU_A07_READER_VARIANTS: EduScene[] = VARIANTS;

export const CHECKS: string[] = ['edu:clap:syllables:cempasuchil', 'edu:clap:beat:steady'];
