/**
 * The Learning Grove, reader band (ages 7–10): S30 What Sad Is For.
 *
 *   S30 What Sad Is For   a face and a feeling can be different; sadness shows the people who love
 *                         you where to find you; sitting with a sad friend without fixing them;
 *                         worries that keep us too safe; naming feelings. Woven in: similes and
 *                         metaphors (L.4.5), bar charts (2.MD.D.10), unit fractions, time intervals,
 *                         measuring, frost and the water cycle, seed spreading, light and sound,
 *                         rock layers, forces, oral history. Think question: s30-path.
 *
 * One EduScene per original scene (every step scene, every done scene, the complete scene), and
 * every variant (the -s1, -s5, -youngest and -helped branches and the four afterwards talk scenes)
 * in EDU_S30_READER_VARIANTS. Every choice keeps its original id and `set`; the reader band keeps
 * every choice. See EDU-STYLE.md. British spelling.
 *
 * Care: Dimple is never fixed and nobody tells her to cheer up; Sparks's party is kind. Fossil's
 * fading is explained once as dying, with comfort. No clinical words. Nubbins never speak: Dimple,
 * Drizzle and Fidget have “…” lines only. Hazel's third rule is shown, never quoted or named. The
 * two quoted film lines are replaced by original lines; nothing from the films is quoted.
 */
import type { EduQuest, EduScene, Lesson, GlossaryEntry } from './types';
import type { Line, Choice } from '../config/story';

type Mood = NonNullable<Line['mood']>;

const say =
  (who: string) =>
  (text: string, mood?: Mood): Line =>
    mood ? { who, text, mood } : { who, text };

// ---------------------------------------------------------------- speakers
const N = say('narrator');
const Y = say('you');
const M = say('moss');
const CL = say('clover');
const SP = say('sparks');
const BY = say('byte');
const EM = say('ember');
const LU = say('luna');
const DU = say('dusty');
// new speakers (declared in the source quest; Nubbins, “…” only)
const DI = say('s30-dimple');
const DR = say('s30-drizzle');
const FI = say('s30-fidget');

// ---------------------------------------------------------------- builders
type LessonIn = Omit<Lesson, 'id'>;
type Opt = NonNullable<Lesson['options']>[number];

/** One answer option. `best` marks the answer the lesson teaches; think questions have none. */
const opt = (label: string, reply: Line[], best = false): Opt =>
  best ? { label, best, reply } : { label, reply };

/** Builds `reader:<of>` and numbers its lessons `reader:<of>-l1`, `-l2` in play order. */
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

const gloss = (word: string, meaning: string, of: string): GlossaryEntry => ({
  word,
  meaning,
  scene: `reader:${of}`,
});

// ================================================================== step scenes
const SCENES: EduScene[] = [
  // ------------------------------------------------ step 1: the smile
  scene(
    's30-smile',
    [
      N(
        'The morning after the rain, the whole valley drips. Somebody is rattling your gate, pushing without lifting.',
      ),
      N(
        'It’s Clover. A small gold Nubbin is bouncing on her shoulder like a kettle just before it boils.',
      ),
      CL(
        'I know, I know. Lift and push. I never remember till I’m standing here pushing.',
        'happy',
      ),
      CL('This is Dimple. One of mine. She’s smiled ever since the hill. Since Dusty’s Fossil.'),
      N(
        'Fossil has faded. That means she died: her body stopped working, and it won’t start again.',
      ),
      N('Her flower grows on the hill now, and everybody who loved her remembers her.'),
      N(
        'Dimple beams at you. She beams at the gatepost, and at a slug on the gatepost, with exactly the same beam.',
      ),
      CL('At least somebody’s cheerful.', 'happy'),
      N(
        'Behind Clover, four more Nubbins sit in a damp heap on the path, as if somebody had dropped them there.',
      ),
      CL(
        'Drizzle, Bristle, Flinch, and her ladyship, who only eats red things. They’ve taken it hard.',
        'sad',
      ),
      CL('Come down for tea. I want somebody to look at Dimple who isn’t me.', 'think'),
      N('Your Nubbin studies Dimple’s smile for a long moment. Then, carefully, it puts one on.'),
    ],
    [
      {
        domain: 'literacy',
        skill: 'similes',
        standard: 'L.4.5',
        kind: 'ask',
        after: 1,
        prompt: [
          N('“Like a kettle just before it boils.” What does that simile tell you about Dimple?'),
        ],
        options: [
          opt(
            'She is full of fizz and can’t keep still',
            [N('Yes. A kettle about to boil rattles and steams. Dimple is all jiggle and fizz.')],
            true,
          ),
          opt('She is hot and wet', [
            N(
              'Ha! Not really. A simile borrows one feeling, not every fact: the rattling, about-to-burst fizz.',
            ),
          ]),
          opt('She is made of metal', [
            N(
              'No. Similes compare one quality. Here it’s the rattle and fizz of a kettle about to boil.',
            ),
          ]),
        ],
        parentNote: 'Worked out what a simile tells us about a character.',
      },
    ],
  ),
  // ------------------------------------------------ step 1 done: the windowsill
  scene(
    's30-sill',
    [
      N(
        'Clover’s kitchen is warm and loud and full of steam. Bristle is stamping on a saucepan lid; Flinch has jumped into the bread bin.',
      ),
      CL(
        'Hazel said my kitchen was like the inside of somebody’s head. Everybody shouting, nobody in charge.',
        'happy',
      ),
      N(
        'On the deep windowsill is a flat old cushion with a dent in it, the shape of somebody small and round.',
      ),
      CL(
        'Fossil’s. She sat there every digging day for years. I can’t bring myself to plump it.',
        'soft',
      ),
      N(
        'Dimple has filled the dent with every toy she owns: a cotton reel, a pine cone, a sock and half a wooden peg.',
      ),
      N('Drizzle climbs the curtain, very slowly, and lays one pale-blue hand in the last gap.'),
      N(
        'Dimple is there at once. She takes Drizzle by the wrist and pulls her off the sill, still smiling.',
      ),
      DI('…', 'happy'),
      N(
        'Then you see the ball above Dimple’s head. It has gone pale and thin, like a soap bubble that has been out too long.',
      ),
      CL('See? Not a cloud on her. She’s my good one, this week.', 'happy'),
      N('Clover is looking at the smile. She isn’t looking up.'),
    ],
    [
      {
        domain: 'sel',
        skill: 'a face and a feeling can be different',
        standard: 'CASEL: Social awareness',
        kind: 'ask',
        after: 8,
        prompt: [
          N(
            'Dimple’s face and Dimple’s ball are saying different things. Which one would you trust more, and why?',
          ),
        ],
        options: [
          opt(
            'The ball: you can’t put it on like a smile',
            [
              N(
                'Good thinking. A face can be put on for other people. The ball shows what’s inside.',
              ),
            ],
            true,
          ),
          opt('The face: she’s smiling, so she’s fine', [
            N(
              'Most of the time a smile means happy. But a smile can be put on, and the ball can’t.',
            ),
          ]),
        ],
        parentNote: 'Discussed how a smile can hide a different feeling inside.',
      },
    ],
    [
      {
        id: 'tell',
        label: 'Point out Dimple’s ball to Clover.',
        then: [
          CL(
            'Balls flicker. It’s been a big week for everybody. Look at that face, though.',
            'happy',
          ),
          N('She means it kindly. She goes on looking at the face.'),
        ],
      },
      {
        id: 'watch',
        label: 'Say nothing yet. Keep watching.',
        then: [
          N('You drink your tea and watch the ball, and the ball doesn’t change.'),
          N('Dimple sees you looking, and smiles harder.'),
        ],
      },
    ],
  ),
  // ------------------------------------------------ step 2 scene: acorns
  scene(
    's30-acorns',
    [
      N(
        'Next afternoon you’re back at Clover’s, holding a skein of wool while she winds it. It is drizzling, which Drizzle would love.',
      ),
      CL(
        'Sparks came by. Sparks says what Dimple needs is a party. Sparks says that about most things.',
        'think',
      ),
      CL('She might be right, mind. She’s got streamers. She’s got a cake tin shaped like a cake.'),
      N('Through the window, something is happening in the yard, by the rain butt.'),
      N(
        'Dimple is herding Drizzle into the corner, arms wide, a lot of bouncing, the way you herd a hen.',
      ),
      N('The yard is scattered with acorns from the big oak over the wall.'),
      CL('Look at them, playing. Go and see, if you like. I’ll wind.', 'happy'),
    ],
    [
      {
        domain: 'science',
        skill: 'animals spread seeds',
        standard: '2-LS2-2',
        kind: 'notice',
        after: 5,
        lines: [
          N(
            'An acorn is an oak’s seed. Squirrels and jays carry acorns off and bury them to eat in winter.',
          ),
          N(
            'They never find them all. The forgotten ones can sprout, so animals help plant new oak trees.',
          ),
        ],
        parentNote: 'Learned how squirrels and jays spread acorns and help new oaks grow.',
      },
    ],
  ),
  // ------------------------------------------------ step 2 done: the ring of acorns (THE CHOICE)
  scene(
    's30-ring',
    [
      N(
        'Drizzle sits in the corner under the drip from the rain butt. Round her, Dimple has laid a neat ring of acorns.',
      ),
      N(
        'Drizzle puts one foot over the acorns. Dimple bounces over and nudges her back in, smiling, quick and kind and firm.',
      ),
      N(
        'Drizzle tries again, and again: nudge, nudge. Each time, Dimple adds another acorn to the ring.',
      ),
      N('Your Nubbin starts fetching acorns too, to help. It doesn’t know what for.'),
      N(
        'Drizzle looks at you over the ring. She looks like someone waiting to be let out of a room.',
      ),
      DR('…', 'soft'),
    ],
    [
      {
        domain: 'literacy',
        skill: 'a character’s motive',
        standard: 'RL.3.3',
        kind: 'ask',
        after: 2,
        prompt: [N('Why do you think Dimple keeps Drizzle inside the ring?')],
        options: [
          opt(
            'To keep sad Drizzle away from everyone',
            [
              N(
                'That’s a strong guess. Drizzle is the sad one. Maybe Dimple wants sad kept in a corner.',
              ),
            ],
            true,
          ),
          opt('Because she’s being mean', [
            N(
              'She doesn’t seem mean: she’s gentle and smiling. Maybe she wants sad kept in a corner.',
            ),
          ]),
          opt('It’s just a game', [
            N(
              'It might look like one. But Drizzle wants out. Maybe Dimple wants sad kept in a corner.',
            ),
          ]),
        ],
        parentNote: 'Used clues to work out why a character acts as she does.',
      },
    ],
    [
      {
        id: 'broke',
        label: 'Step over the acorns and lift Drizzle out.',
        set: { 's30-ring': 'broke' },
        then: [
          N('You lift her out. She is cool and heavy, like a stone from a stream.'),
          N(
            'She goes straight back to the drip and sits under it, outside the ring, with her face turned up.',
          ),
          N(
            'Dimple stares at the gap. Then she fills it, very fast, with nobody inside, and bounces off indoors.',
          ),
        ],
      },
      {
        id: 'sat',
        label: 'Sit down on the wet grass outside the ring, next to Drizzle.',
        set: { 's30-ring': 'sat' },
        then: [
          N(
            'You sit down outside the acorns. Drizzle shuffles to the edge of the ring and leans towards you.',
          ),
          N('Dimple builds a second ring round the two of you, and smiles the whole while.'),
          N(
            'Then she looks at it as if she can’t remember what it was for, and bounces off indoors.',
          ),
        ],
      },
      {
        id: 'helped',
        label: 'Leave it. She’s trying so hard. Go and help with Sparks’s party plan.',
        set: { 's30-ring': 'helped' },
        then: [
          N('You leave the ring be. Dimple is trying so hard; it seems unkind to spoil it.'),
          N(
            'Sparks is at the gate with a crate of streamers. You go and hold the other end of things.',
          ),
          N('Behind you, Drizzle watches you go. She doesn’t try the acorns again.'),
        ],
      },
    ],
  ),
  // ------------------------------------------------ step 3 scene: the party plan
  scene(
    's30-party-ask',
    [
      SP(
        'PARTY. Saturday. Clover’s yard. Dimple’s the guest of honour and attendance is compulsory and fun.',
        'happy',
      ),
      SP(
        'Streamers. Races. Bunting. A cake shaped like a cake. It’s a sponge. It looks like a sponge.',
      ),
      SP(
        'Nothing cheers a Nubbin up like being cheered at. That’s science. Byte, tell them it’s science.',
        'happy',
      ),
      BY(
        'It isn’t science. Science is when you test it. I’m coming, though. I’m bringing a chart.',
        'think',
      ),
      EM('I got dragged. I’m here under protest. Where’s the cake?'),
      N(
        'By Saturday, bunting runs from the shed to the rain butt: two metres of it, each flag twenty centimetres wide, edge to edge.',
      ),
      N(
        'Dimple is in the middle of it in a paper hat, bouncing so high that her hat keeps landing on other people.',
      ),
    ],
    [
      {
        domain: 'maths',
        skill: 'measurement word problems',
        standard: '4.MD.A.2',
        kind: 'ask',
        after: 5,
        prompt: [
          SP(
            'Two metres of bunting, each flag twenty centimetres wide, edge to edge. How many flags did I sew?',
            'think',
          ),
        ],
        options: [
          opt(
            '10',
            [SP('Ten! Two metres is 200 centimetres, and 200 ÷ 20 = 10. Ten flags!', 'happy')],
            true,
          ),
          opt('40', [
            SP(
              'That’s 2 × 20. Change metres to centimetres first: 200 cm, then 200 ÷ 20 = 10.',
              'think',
            ),
          ]),
          opt('20', [
            SP('Close. Two metres is 200 centimetres, and 200 ÷ 20 = 10. Ten flags!', 'happy'),
          ]),
        ],
        parentNote:
          'Changed metres to centimetres and divided to count the flags (2 m = 200 cm; 200 ÷ 20 = 10).',
      },
    ],
  ),
  // ------------------------------------------------ step 3 done: the party
  scene(
    's30-party',
    [
      N(
        'Dimple wins the streamer race and the hat toss. She bounces round the cake eleven times before anyone can cut it.',
      ),
      N(
        'Your Nubbin copies every bounce, a beat behind. By the end it is worn out, and Dimple is not.',
      ),
      SP('LOOK AT HER GO. That’s a happy Nubbin. That’s a party working.', 'happy'),
      EM('That’s not happy. That’s busy.', 'angry'),
      SP('…What?', 'shock'),
      EM(
        'I know busy. I was busy for a whole year after I lost Ash. Cleaned the house twice a day. Nobody could get a word in.',
        'soft',
      ),
      BY(
        'Two hundred and twelve smiles an hour. I counted. And her ball hasn’t gone above a two all afternoon.',
        'think',
      ),
      BY('Out of ten. On my scale. I made a scale.'),
      BY(
        'The face and the ball disagree. And balls can’t be wrong. They haven’t got the muscles for it.',
        'angry',
      ),
      N(
        'He seems very annoyed about this, as if Dimple has done it on purpose to spoil his numbers.',
      ),
    ],
    [
      {
        domain: 'literacy',
        skill: 'how characters respond to the same event',
        standard: 'RL.2.3',
        kind: 'notice',
        after: 5,
        lines: [
          N(
            'Three Keepers, one party, three ways of seeing it. Sparks sees fun. Ember sees busy. Byte sees numbers.',
          ),
          N(
            'Each one notices what they already know best. Ember knows busy from her own hard year.',
          ),
        ],
        parentNote: 'Compared how three characters respond to the same event.',
      },
      {
        domain: 'maths',
        skill: 'read a bar chart',
        standard: '2.MD.D.10',
        kind: 'do',
        after: 8,
        check: 'edu:chart:bar:dimple-ball',
        lines: [
          BY(
            'My chart. Dimple’s ball, out of ten: streamer race 2, hat toss 2, cake 1. Draw the bars.',
            'think',
          ),
          BY('Highest bar? Two. A happy ball would be up near eight. The bars don’t lie.'),
        ],
        parentNote: 'Drew and read a bar chart of Byte’s mood-ball scores.',
      },
    ],
  ),
  // ------------------------------------------------ step 4 scene: Clover's list
  scene(
    's30-list',
    [
      N(
        'Next morning Clover is on your step with a list, written on the back of a seed packet and underlined in three places.',
      ),
      CL(
        'Ember’s wrong. She’s fine. But I’ve written down her favourite things, so we can check. Just to show Ember.',
        'think',
      ),
      CL(
        'One, the windowsill. Two, stamping puddles with Drizzle. Three, chasing Sparks’s fast ones round the pond.',
      ),
      CL('Four, Byte’s shoelaces. She pulls them undone. He pretends to mind.', 'happy'),
      CL('Five, the hum at bedtime. I hum, she sways. Every night since she hatched.', 'soft'),
      CL('If she’s doing those, she’s fine. Five out of five. That’s fine, isn’t it?'),
    ],
    [
      {
        domain: 'maths',
        skill: 'unit fractions',
        standard: '3.NF.A.1',
        kind: 'ask',
        after: 4,
        prompt: [
          CL(
            'Five things on my list. What fraction of the list is the bedtime hum, all on its own?',
            'think',
          ),
        ],
        options: [
          opt(
            'One fifth (1/5)',
            [
              CL(
                'One fifth. One thing out of five equal parts. I like fractions; they sit still.',
                'happy',
              ),
            ],
            true,
          ),
          opt('One half (1/2)', [
            CL(
              'A half would mean two things on the list. There are five, so it’s one fifth.',
              'think',
            ),
          ]),
          opt('Five (5)', [
            CL('Five is the whole list. One thing out of five is one fifth: 1/5.', 'think'),
          ]),
        ],
        parentNote: 'Named one item out of five as the unit fraction 1/5.',
      },
    ],
  ),
  // ------------------------------------------------ step 4 done: nought out of five
  scene(
    's30-five',
    [
      N(
        'The sill: Dimple won’t climb up. She sits underneath it and smiles at the skirting board.',
      ),
      N(
        'The puddles: Drizzle stamps one, hopefully. Dimple smiles at the splash and doesn’t move.',
      ),
      N(
        'Sparks’s fast ones go tearing round the pond, slowing down each time they pass her. She doesn’t chase.',
      ),
      N(
        'At bedtime Clover hums. Dimple lies in her basket and smiles at the ceiling, quite still.',
      ),
      N(
        'Last, Byte, on Clover’s step with his boots stuck out. Dimple looks at his laces for a long time.',
      ),
      N('Then she smiles at them, and goes back indoors.'),
      BY('…She didn’t pull them.', 'sad'),
      BY(
        'I’ve been tying them in single knots. For weeks. So she could get them undone. I didn’t tell anyone that.',
        'sad',
      ),
      CL('Nought out of five.', 'sad'),
      N(
        'Clover sits down next to Byte on the step, and neither of them says anything for a while.',
      ),
    ],
    [
      {
        domain: 'literacy',
        skill: 'character motives',
        standard: 'RL.3.3',
        kind: 'notice',
        after: 7,
        lines: [
          N('Byte acts grumpy about his laces, but he was secretly making them easier to pull.'),
          N('What a character does in secret can tell you more than what they say out loud.'),
        ],
        parentNote: 'Inferred a character’s real feelings from what he did in secret.',
      },
      {
        domain: 'maths',
        skill: 'tally chart',
        standard: '3.MD.B.3',
        kind: 'do',
        after: 8,
        check: 'edu:tally:five-things:0-of-5',
        lines: [
          N(
            '(Make Clover’s tally: a column for “did it”, a column for “didn’t”. One mark for each observation.)',
          ),
          N(
            'Did it: no marks. Didn’t: five, the gate of four with one across. Nought out of five.',
          ),
        ],
        parentNote: 'Recorded five observations in a tally chart.',
      },
    ],
  ),
  // ------------------------------------------------ step 5 scene: Dusty's hole
  scene(
    's30-hole',
    [
      N(
        'By the stream there is a hole that wasn’t there yesterday. It is very deep, it is getting deeper, and it is singing.',
      ),
      N('That’s Dusty, at the bottom of it, singing a digging song with a lot of extra verses.'),
      DU(
        'Morning! Lovely morning. Grand day for a hole. I’m not digging for anything. That’s what makes it relaxing.',
        'happy',
      ),
      DU('Look at that soil. Look at that worm. Hello, worm. Everything’s fine, worm.', 'happy'),
      N(
        'Dimple has followed you. She takes one look at the hole, dives in, and starts scooping earth out with both hands.',
      ),
      N(
        'Dusty digs faster, so Dimple digs faster. They grin at each other across the hole like two people winning an argument.',
      ),
      N('Your Nubbin flings soil about on the bank, to be part of it. Most of it lands on you.'),
      DU('See? She gets it. Keep your hands busy and the rest of you can’t catch up.', 'happy'),
    ],
    [
      {
        domain: 'literacy',
        skill: 'figurative language',
        standard: 'L.4.5',
        kind: 'ask',
        after: 7,
        prompt: [
          N(
            '“Keep your hands busy and the rest of you can’t catch up.” What is Dusty really saying?',
          ),
        ],
        options: [
          opt(
            'If I stay busy, I won’t have to feel sad',
            [
              N(
                'Yes. The “rest of you” is Dusty’s feelings. Busy hands keep the sadness behind them, for now.',
              ),
            ],
            true,
          ),
          opt('Digging makes your legs slower', [
            N(
              'Not quite. It isn’t about legs. The “rest of you” means Dusty’s feelings, kept behind by busy hands.',
            ),
          ]),
        ],
        parentNote: 'Explained the hidden meaning in a figure of speech.',
      },
    ],
  ),
  // ------------------------------------------------ step 5 done: Drizzle sits
  scene(
    's30-drizzle',
    [
      N(
        'Then Drizzle comes down the bank, slowly, the way she does everything. She sits at the edge of the hole and says nothing.',
      ),
      N(
        'Dusty’s spade stops. Dimple goes on scooping for a while on her own, and then she stops too.',
      ),
      DU('…She used to sit like that. Fossil. On the edge, while I dug. Just there.', 'sad'),
      DU(
        'I dug her out with a spoon, you know. Two days. Twenty years and a bit. I was still counting the bit.',
        'sad',
      ),
      N(
        'Dusty sits down in the bottom of the hole, spade across their knees, and cries properly for the first time since the hill.',
      ),
      N(
        'Drizzle climbs down and leans on them, without patting or fussing. She leans with her whole weight, like a sandbag.',
      ),
      N('…'),
      N(
        'After a long time Dusty wipes their face with the back of a muddy wrist, which makes it worse.',
      ),
      DU('There. That’s a bit better. Not mended. Better.', 'soft'),
      N(
        'Up on the bank, Dimple is watching. Her smile slips at one corner; she puts it back, and it slips again.',
      ),
    ],
    [
      {
        domain: 'sel',
        skill: 'sitting with a sad friend without fixing',
        standard: 'CASEL: Relationship skills',
        kind: 'notice',
        after: 5,
        lines: [
          N(
            'Drizzle doesn’t say “cheer up” or try to fix anything. She stays, and lets Dusty be sad.',
          ),
          N('Sometimes the kindest help is just keeping someone company while the feeling passes.'),
        ],
        parentNote: 'Saw how to support a grieving friend by staying with them, not fixing.',
      },
    ],
  ),
  // ------------------------------------------------ step 6 scene: Luna at dawn
  scene(
    's30-luna',
    [
      N('Dawn. Somebody knocks very quietly, which in this valley means Luna, on her way to bed.'),
      LU('Sorry. My evening, your morning. I wouldn’t, only it’s three nights now.', 'think'),
      LU(
        'I start on the hill at eleven at night. At three in the morning, three nights running, Clover’s gold one has been on the path.',
      ),
      LU(
        'She goes up towards Fossil’s flower. Halfway, she stops, and turns round, and goes home.',
      ),
      LU('She doesn’t bounce up there. That’s what got me. I didn’t know she could walk.', 'sad'),
      LU(
        'Things look like what they are, at night. Nobody’s watching, so nobody bothers. Come up with me tonight.',
        'soft',
      ),
    ],
    [
      {
        domain: 'maths',
        skill: 'time intervals',
        standard: '3.MD.A.1',
        kind: 'ask',
        after: 2,
        prompt: [
          LU('I start at 11 p.m. I see Dimple at 3 a.m. How many hours in between?', 'think'),
        ],
        options: [
          opt(
            '4 hours',
            [
              LU(
                'Four. Eleven to midnight is one hour, then three more to 3 a.m. Count across midnight.',
                'happy',
              ),
            ],
            true,
          ),
          opt('8 hours', [
            LU(
              'That’s 11 take away 3. But the clock goes round: 11 to 12 is one hour, 12 to 3 is three more. Four.',
            ),
          ]),
          opt('3 hours', [
            LU('Don’t forget the hour from eleven to midnight. One plus three makes four hours.'),
          ]),
        ],
        parentNote: 'Worked out a time interval across midnight (11 p.m. to 3 a.m. = 4 hours).',
      },
    ],
  ),
  // ------------------------------------------------ step 6 done: the night path (THINK QUESTION)
  scene(
    's30-path',
    [
      N(
        'Three in the morning. The hill is grey and silver: wet grass, a thin crescent of moon, the smell of Luna’s night stocks.',
      ),
      N('Halfway up the path, there she is. Dimple, walking slowly uphill, on her own.'),
      N(
        'She isn’t smiling. Her face is just a face, and the ball above it is darker than any ball you have seen except Sable’s.',
      ),
      LU('That’s where she stops. Every night.', 'soft'),
      N(
        'Dimple stops and looks up the hill towards the flower. Then she turns round, and sees you.',
      ),
      N('For a second her face does nothing at all.'),
      N('Then the smile goes on like a lamp, and she bolts down the hill past you, and home.'),
      LU('Did you see her face? Before?', 'soft'),
      LU('That’s her. That’s the one who needs finding. The other one’s for us.', 'sad'),
    ],
    [
      {
        domain: 'science',
        skill: 'moon phases',
        standard: '1-ESS1-1',
        kind: 'notice',
        after: 0,
        lines: [
          LU(
            'A crescent tonight. The Moon doesn’t change shape; we see a different slice of its sunlit side as it goes round us.',
          ),
          LU('From new moon to full and back takes about a month.'),
        ],
        parentNote: 'Learned why the Moon seems to change shape over about a month.',
      },
      {
        domain: 'sel',
        skill: 'why people hide feelings',
        standard: 'CASEL: Social awareness',
        kind: 'ask',
        after: 8,
        prompt: [
          LU(
            'Here’s what I keep wondering. Why do you think Dimple smiles all day, but not up here on her own?',
            'think',
          ),
        ],
        options: [
          opt('She doesn’t want to worry Clover', [
            LU(
              'That’s kind of her, and sad. Hiding to protect someone. People do that too.',
              'soft',
            ),
          ]),
          opt('She thinks sad is bad and must be hidden', [
            LU('I think that might be it. Nobody told her sad is allowed.', 'soft'),
          ]),
          opt('Up here nobody needs her to be cheerful', [
            LU('Yes. At night there’s no one to perform for. You get to be just you.', 'soft'),
          ]),
          opt('She is scared of how big the sad is', [
            LU(
              'That makes sense. Big feelings can be scary. Maybe walking halfway is all she can do yet.',
              'soft',
            ),
          ]),
        ],
        parentNote:
          'Thought about why someone might hide sadness from the people around them (a think question with no single answer).',
      },
    ],
  ),
  // ------------------------------------------------ step 7 scene: Moss at the wall
  scene(
    's30-wall',
    [
      N('The frosts have come, and the Grove is white at dawn round the fourth post.'),
      N(
        'You find Moss at the old wall, by Hush’s lantern post, with frost on his back that he hasn’t bothered to shake off.',
      ),
      M(
        'Clover’s gold one. Luna told me. Luna tells me things at dawn, when I am too tired to argue.',
        'think',
      ),
      M(
        'Hush. The quiet one. You may have heard she kept the griefs. Nobody told you how. She sat.',
      ),
      M(
        'When the White Year stilled half the valley, the rest of us dug. Hush went and sat where the still ones, the ones who had died, could see her.',
        'sad',
      ),
      M(
        'She never tried to wake one. If one shivered, she took it for a conversation. That was her job, and nobody gave it her.',
      ),
      M(
        'People thought that made her a sad thing. They were wrong about which part was sad.',
        'soft',
      ),
      M(
        'Low in the wall. The flat stone, by your foot. Look at it properly. She meant it to be looked at.',
      ),
    ],
    [
      {
        domain: 'science',
        skill: 'frost: water vapour freezing',
        standard: '2-ESS2-3',
        kind: 'notice',
        after: 0,
        lines: [
          N(
            'Air always holds some invisible water, called water vapour. On a clear, freezing night it turns straight to ice on cold surfaces.',
          ),
          N(
            'That’s frost. When the sun warms it above 0 °C (32 °F), it melts back into liquid water.',
          ),
        ],
        parentNote:
          'Learned that frost is water vapour frozen onto cold surfaces, and melts above 0 °C.',
      },
    ],
  ),
  // ------------------------------------------------ step 7 done: Hush's stone
  scene(
    's30-stone',
    [
      N(
        'You brush the frost off. The stone is covered in marks scratched fine as hair: rings and lines, hundreds of them.',
      ),
      M('A ring for a joy kept. A line for a grief kept. That was her way of counting.', 'soft'),
      N(
        'There are a few plain rings, and a few plain lines. Nearly all the rest are both: a ring with a line through it.',
      ),
      M('Most things are both. She knew that before any of us.'),
      M(
        'Briar thought Hush was gloomy. Hush thought Briar was loud. They were never more than a field apart, those two.',
        'happy',
      ),
      Y('What did she think sad was for?'),
      M('Sad is a lantern, she said. It shows people where you are.', 'soft'),
      M(
        'A Nubbin smiling on the outside is a Nubbin in the dark with its lantern out. Nobody can find it. It thinks that is a kindness.',
        'sad',
      ),
      N(
        'Moss lays one small hand flat on the stone, over the marks, the way you would warm your hand on a mug.',
      ),
    ],
    [
      {
        domain: 'social-studies',
        skill: 'records from the past',
        standard: 'D2.His.2.K-2',
        kind: 'notice',
        after: 3,
        lines: [
          N(
            'Long before notebooks, people kept records by scratching marks into bone, wood and stone, a bit like a tally.',
          ),
          N(
            'Hush’s stone is a record like that. Reading it tells you what mattered to someone long ago.',
          ),
        ],
        parentNote: 'Learned how people recorded events with marks before writing was common.',
      },
      {
        domain: 'literacy',
        skill: 'metaphors',
        standard: 'L.4.5',
        kind: 'ask',
        after: 7,
        prompt: [N('“Sad is a lantern.” That’s a metaphor. What does Hush mean?')],
        options: [
          opt(
            'Showing you’re sad helps people find you and help',
            [M('Yes. A lantern in the dark says “here I am”. So does sad.', 'soft')],
            true,
          ),
          opt('Being sad makes you glow', [
            M(
              'Not glow. A lantern shows people where you are. So does letting your sad show.',
              'soft',
            ),
          ]),
          opt('You should carry a lantern when sad', [
            M(
              'Ha. Only if it’s dark. She meant sad works like a lantern: it shows people where you are.',
              'happy',
            ),
          ]),
        ],
        parentNote: 'Explained a metaphor: sadness, like a lantern, helps others find you.',
      },
    ],
  ),
  // ------------------------------------------------ step 8 scene: Fidget hatches
  scene(
    's30-fidget',
    [
      N(
        'The first frost week. Clover sends Bristle up the lane to fetch you, which Bristle does by stamping on your doormat.',
      ),
      N(
        'In Clover’s kitchen, in a nest of tea towels by the range, an egg is rocking. Then it is in pieces, and something orange is running.',
      ),
      CL('Oh! Oh, look at her. She hasn’t stopped since she cracked. Not once.', 'happy'),
      N(
        'The new one is very small and very orange. She runs to the door, then the window, then under the table, then the door again.',
      ),
      N(
        'She checks every Nubbin in the kitchen, one by one, as if she were counting them. Then she checks them all again.',
      ),
      CL('Fidget. That’s her name. She named herself, really.'),
      CL('Finally, someone who fusses more than me.', 'happy'),
      N('Dimple bounces over to welcome her, beaming. Fidget counts Dimple twice.'),
    ],
    [
      {
        domain: 'science',
        skill: 'life cycles',
        standard: '3-LS1-1',
        kind: 'notice',
        after: 1,
        lines: [
          N(
            'Every living thing has a life cycle. A Nubbin goes egg, child, cocoon, adult, a bit like a butterfly.',
          ),
          N(
            'Birds and most reptiles start as eggs too, warmed until they hatch. That’s why the egg was by the range.',
          ),
        ],
        parentNote: 'Compared a Nubbin’s life cycle with real animals that hatch from eggs.',
      },
    ],
  ),
  // ------------------------------------------------ step 8 done: safe in the shed
  scene(
    's30-shed',
    [
      N(
        'At dusk the frost comes down over the yard like a cloth over a cage. Fidget goes very still for one second, then gets to work.',
      ),
      N(
        'She herds the whole household into the shed: Bristle, Flinch, the fussy one, Drizzle, Dimple. She pushes from behind with her head.',
      ),
      N(
        'Then she drags the slop bucket across the yard, an inch at a time, and shoves it hard against the shed door.',
      ),
      FI('…', 'shock'),
      CL('Every night since the frost. In they go, and the bucket.', 'sad'),
      N(
        'From inside the shed comes Dimple, louder than ever: bounce, bounce, bounce off the walls.',
      ),
      N('Nothing else. The others have gone quiet in there, the way pot plants go in a cupboard.'),
      CL(
        'She just wants them safe. I know how she feels. I’ve felt it every night of my life.',
        'soft',
      ),
      CL('Safe is not the same as well.', 'think'),
      N('Clover hears herself say it. She sits down, quite suddenly, on the bucket.'),
      CL('That’s Moss’s. And I said it like it was mine. Well. It is now.', 'sad'),
    ],
    [
      {
        domain: 'sel',
        skill: 'worry tries to keep us safe',
        standard: 'CASEL: Self-awareness',
        kind: 'ask',
        after: 8,
        prompt: [N('“Safe is not the same as well.” What does Clover mean?')],
        options: [
          opt(
            'You can be kept safe and still not be happy or healthy',
            [
              N(
                'Yes. The shed is safe from frost, but the Nubbins inside are wilting. Worry can try too hard.',
              ),
            ],
            true,
          ),
          opt('Being safe is bad', [
            N(
              'Not bad. Safe matters. But too much safe, like a shut shed, can stop you living well.',
            ),
          ]),
        ],
        parentNote:
          'Talked about how worry protects us, and how too much protecting can stop us doing well.',
      },
      {
        domain: 'literacy',
        skill: 'similes',
        standard: 'L.4.5',
        kind: 'notice',
        after: 6,
        lines: [
          N(
            '“The way pot plants go in a cupboard.” Plants in the dark go pale and droop. The simile shows the Nubbins wilting without light.',
          ),
        ],
        parentNote: 'Explained a simile using what plants need to grow.',
      },
    ],
  ),
  // ------------------------------------------------ step 9 scene: the blanket plan
  scene(
    's30-blanket-ask',
    [
      CL(
        'I can’t just kick the bucket over. She’d go to pieces. She’s a week old and she’s doing her best.',
        'sad',
      ),
      CL('And I can’t leave them in there. Listen to Dimple. Listen to the others not.'),
      N(
        'Fidget sits by the bucket, guarding it. Her ball is whirling so fast it looks like a little orange wheel.',
      ),
      N('Your Nubbin sits down beside her and looks hard at the bucket too, to be helpful.'),
      CL(
        'Help me open it without her knowing it’s open. Hazel was good at that sort of thing.',
        'think',
      ),
      N(
        'There’s a blanket frozen stiff on the washing line. There’s the bucket, and the shed door, which opens outwards.',
      ),
    ],
    [
      {
        domain: 'science',
        skill: 'compare solutions to a problem',
        standard: '3-5-ETS1-2',
        kind: 'ask',
        after: 5,
        prompt: [
          CL(
            'Three ideas. Which one solves both problems: Fidget needs “shut”, the others need “open”?',
            'think',
          ),
        ],
        options: [
          opt(
            'Hang the blanket in the doorway with a gap under it',
            [
              CL(
                'Yes. Fidget sees it shut; the others can slip underneath. Both problems, one fix.',
                'happy',
              ),
            ],
            true,
          ),
          opt('Kick the bucket away', [
            CL('That opens it, but Fidget would panic. It only solves half the problem.', 'sad'),
          ]),
          opt('Leave the door shut', [
            CL('That keeps Fidget calm, but the others stay stuck. Half again.', 'sad'),
          ]),
        ],
        parentNote: 'Compared three solutions against two needs and chose the one that met both.',
      },
    ],
  ),
  // ------------------------------------------------ step 9 done: shut and open
  scene(
    's30-blanket',
    [
      N(
        'You open the door while Fidget is counting something else, and hang the stiff blanket across the doorway like a curtain.',
      ),
      N(
        'You stand the bucket on one corner of the hem. Underneath, there is a gap a Nubbin could push through.',
      ),
      N(
        'Fidget comes back, inspects the blanket and the bucket, and pushes the bucket one inch further. Shut. She sits down.',
      ),
      N(
        'A minute later Drizzle’s nose comes out under the hem. Then the fussy one, then Flinch, who jumps at the blanket, and then doesn’t.',
      ),
      N(
        'They go in and out as they please all evening. Fidget counts them every time, and seems to find the number acceptable.',
      ),
      CL('Look at that. Shut, and open. Both. Hazel would have called that a fudge.', 'happy'),
      CL('She liked a fudge. She said most of the good things are fudges.', 'soft'),
      N(
        'Dimple doesn’t come out. When you look under the hem, she is sitting at the back of the dark shed, smiling at nobody.',
      ),
    ],
    [
      {
        domain: 'literacy',
        skill: 'multiple-meaning words',
        standard: 'L.3.4',
        kind: 'ask',
        after: 6,
        prompt: [N('“Fudge” can be a soft sweet. What does Hazel’s “fudge” mean here?')],
        options: [
          opt(
            'A clever in-between answer that suits everyone',
            [
              N(
                'Yes. A fudge is a compromise, a bit of both: shut enough for Fidget, open enough for the others.',
              ),
            ],
            true,
          ),
          opt('A sweet you eat', [
            N(
              'That’s the other meaning! Here it means an in-between answer: shut and open at once.',
            ),
          ]),
        ],
        parentNote: 'Used context to choose the right meaning of a word with two meanings.',
      },
    ],
  ),
  // ------------------------------------------------ step 10 scene: Dimple is gone
  scene(
    's30-gone',
    [
      N(
        'Early autumn. Clover is at your gate before it is light, in her dressing gown and wellies, with Drizzle under one arm.',
      ),
      CL('She’s gone. Dimple. Her basket was cold when I got up.', 'shock'),
      CL(
        'She’s taken nothing but the cushion off the sill. Fossil’s cushion, toys and all.',
        'sad',
      ),
      N(
        'Drizzle wriggles out from under Clover’s arm, drops to the path, and sets off down the lane on her own, slow and certain.',
      ),
      CL('Drizzle? Drizzle! She never goes anywhere on her own. She hates hurrying.', 'shock'),
      N(
        'Dusty is coming up the lane with a spade on one shoulder. One look at Clover, and they put the spade down.',
      ),
      DU(
        'She’s going back to where the happy was. I would. I’ve been trying to all summer.',
        'soft',
      ),
      N('You go after Drizzle, all three of you, down the lane in the half dark.'),
    ],
    [
      {
        domain: 'science',
        skill: 'daylight changes through the year',
        standard: '1-ESS1-2',
        kind: 'notice',
        after: 0,
        lines: [
          N(
            'In summer, it was light long before breakfast. Now, in early autumn, the sun rises later every day.',
          ),
          N(
            'The days shorten until midwinter, then lengthen again towards midsummer. It’s the Earth’s tilt as it goes round the Sun.',
          ),
        ],
        parentNote: 'Noticed that daylight shrinks in autumn and grows again after midwinter.',
      },
    ],
  ),
  // ------------------------------------------------ step 10 done: the trail
  scene(
    's30-trail',
    [
      N(
        'Under Clover’s window there is a cotton reel in the frost. At the end of the lane, a pine cone; at the stile, half a wooden peg.',
      ),
      N(
        'One toy at a time, the trail runs out of the lane and east along the stream, towards the striped cliff.',
      ),
      DU(
        'The cliff. She came with us once or twice. Rode on Fossil, mostly, which Fossil allowed. Nobody else ever got to.',
        'sad',
      ),
      N(
        'At the foot of the cliff the rock is striped like a cake. Where it meets the ground, there is a hollow, dug down and in.',
      ),
      DU('That’s it. The spoon hole. Where I dug her out. Two days, with a spoon.', 'soft'),
      N(
        'Dimple is down in it, on Fossil’s cushion, scraping at the back of the hollow as if there might be another egg.',
      ),
      N(
        'The hollow is only waist-deep on you, but on a Nubbin the lip is a cliff. She can’t climb out, and she hasn’t tried.',
      ),
      DI('…'),
    ],
    [
      {
        domain: 'science',
        skill: 'compass directions',
        standard: '2-ESS2-2',
        kind: 'ask',
        after: 1,
        prompt: [
          N('The trail runs east, and it’s just after dawn. Where would you look to see the sun?'),
        ],
        options: [
          opt(
            'Straight ahead, along the trail',
            [N('Yes. The sun rises in the east, so you’re walking towards the sunrise.')],
            true,
          ),
          opt('Behind you', [
            N('Behind you is west. The sun rises in the east, straight ahead along the trail.'),
          ]),
        ],
        parentNote: 'Used the sunrise in the east to find a direction.',
      },
      {
        domain: 'science',
        skill: 'rock layers and fossils',
        standard: '4-ESS1-1',
        kind: 'notice',
        after: 3,
        lines: [
          N(
            'Stripes in a cliff are rock layers, laid down one on top of another over a very long time.',
          ),
          N(
            'Lower layers are usually older. Fossils in them show what lived long ago; Fossil’s egg came from one.',
          ),
        ],
        parentNote: 'Learned that rock layers stack up over time, oldest at the bottom.',
      },
    ],
  ),
  // ------------------------------------------------ step 11 scene: Drizzle climbs down
  scene(
    's30-hollow',
    [
      N(
        'Before anybody else can move, Drizzle walks to the lip of the hollow and slides down into it, slowly, unasked.',
      ),
      N('She sits close to Dimple: not touching, but close. She says nothing at all.'),
      N(
        'Dimple turns, and the smile goes on like a lamp. She bounces, and offers Drizzle a pebble, a root, a handful of dust.',
      ),
      N('Drizzle doesn’t take any of it. She stays.'),
      CL('Shall I go down? I should go down. I’m her… I should…', 'shock'),
      DU('Leave them a minute. That one knows what she’s doing. Look at her.', 'soft'),
      N(
        'Up at the rim you sit down in the frosty grass, because standing feels like hurrying somebody.',
      ),
    ],
    [
      {
        domain: 'sel',
        skill: 'patience and presence',
        standard: 'CASEL: Relationship skills',
        kind: 'ask',
        after: 3,
        prompt: [N('Dimple keeps offering things. Why do you think Drizzle doesn’t take them?')],
        options: [
          opt(
            'Taking them would join in the pretending',
            [N('Yes. Drizzle won’t play “everything’s fine”. She just stays, so Dimple can stop.')],
            true,
          ),
          opt('She doesn’t like pebbles', [
            N('Maybe! But mostly, taking them would join the act. She stays, so Dimple can stop.'),
          ]),
        ],
        parentNote: 'Thought about how staying calm and present helps a friend stop pretending.',
      },
    ],
  ),
  // ------------------------------------------------ step 11 done: the smile stops
  scene(
    's30-stopped',
    [
      N(
        'And then Dimple stops, in the middle of a bounce, almost. She sits down hard on Fossil’s cushion, and the smile goes.',
      ),
      N(
        'Not off, like a lamp. It goes the way frost goes off a window, from the edges in, until there is only her face.',
      ),
      DI('…', 'sad'),
      N('Up at the rim, Clover puts both hands over her mouth.'),
      N('Dimple’s face and her feeling match now. It looks like sad, because it is sad.'),
      N('Nobody tells her to cheer up. Everybody stays.'),
    ],
    [
      {
        domain: 'literacy',
        skill: 'similes that show change',
        standard: 'L.4.5',
        kind: 'ask',
        after: 1,
        prompt: [
          N(
            'The smile goes “the way frost goes off a window, from the edges in”. So does it go fast or slowly?',
          ),
        ],
        options: [
          opt(
            'Slowly, a little at a time',
            [
              N(
                'Yes. Frost melts gradually from the edges. The smile fades bit by bit, not all at once.',
              ),
            ],
            true,
          ),
          opt('All at once', [
            N(
              'That would be “like a lamp”, and the line says “not like a lamp”. Frost melts slowly, edge by edge.',
            ),
          ]),
        ],
        parentNote: 'Used a simile to work out how fast something happens.',
      },
    ],
  ),
  // ------------------------------------------------ step 12 scene: the thunder day
  scene(
    's30-thunder',
    [
      N('Clover sits down at the rim. She doesn’t take her eyes off the hollow.'),
      CL(
        'Do you know how they met? Dimple and Fossil? I never told anyone. It didn’t seem like a story.',
        'soft',
      ),
      CL(
        'Dimple hatched in a thunderstorm, under my kitchen table. First night of her life, and the sky fell in.',
      ),
      CL('She wailed. Hours. I tried everything. Milk, humming, the lot. Nothing.', 'sad'),
      CL(
        'And Fossil came down off the sill. She never came down off the sill. She walked across my kitchen and sat beside her.',
      ),
      CL(
        'Didn’t lick her. Didn’t fuss. Just sat, the whole storm, till it blew over. I made three pots of tea and drank none.',
      ),
      CL(
        'After that they shared the sill every digging day, for years. Gold one and sand one in the window, like two loaves.',
        'happy',
      ),
      DU('I never knew that. Twenty years, and I never knew that.', 'soft'),
      CL('Her best thing started on her worst day.', 'soft'),
    ],
    [
      {
        domain: 'science',
        skill: 'light travels faster than sound',
        standard: '4-PS3-2',
        kind: 'notice',
        after: 2,
        lines: [
          N(
            'In a storm you see the lightning before you hear the thunder, because light travels far faster than sound.',
          ),
          N(
            'Count the seconds between flash and boom: about three seconds for every kilometre away the storm is.',
          ),
        ],
        parentNote: 'Learned that light outruns sound, and how to estimate a storm’s distance.',
      },
      {
        domain: 'literacy',
        skill: 'theme',
        standard: 'RL.4.2',
        kind: 'notice',
        after: 8,
        lines: [
          N(
            '“Her best thing started on her worst day.” Good things and hard things are often tangled together. That’s a theme of this whole story.',
          ),
        ],
        parentNote: 'Identified a theme: joy and sorrow are often bound together.',
      },
    ],
  ),
  // ------------------------------------------------ step 12 done: blue and gold
  scene(
    's30-blue-gold',
    [
      N(
        'Down in the hollow, Dimple’s ball goes blue. Not pale: deep blue, like the sky an hour after sunset.',
      ),
      N(
        'Then she cries the way Nubbins cry. A thin, high whistle like wind across a bottle, and a shaking from her ears to her feet.',
      ),
      N('She leans sideways until she is leaning on somebody, and stays there, and whistles.'),
      N(
        'Nobody moves. Up at the rim Clover is crying too, without a sound, and Dusty has a hand on her back.',
      ),
      N('…'),
      N(
        'When it stops, Dimple’s ball is still blue. And it is gold as well, the two colours turning slowly round each other.',
      ),
      DU('I’ve never seen that. Twenty years, and I have never once seen a ball do that.', 'shock'),
      CL('Neither have I.', 'soft'),
      N(
        'Dimple looks up at the rim, and doesn’t smile. She looks at you all like somebody who has been found.',
      ),
    ],
    [
      {
        domain: 'science',
        skill: 'vibrations make sound',
        standard: '1-PS4-1',
        kind: 'notice',
        after: 1,
        lines: [
          N(
            'Blow across the top of a bottle and the air inside shakes very fast. That shaking, or vibration, is the whistle you hear.',
          ),
        ],
        parentNote: 'Learned that a whistle is air vibrating.',
      },
      {
        domain: 'sel',
        skill: 'mixed feelings',
        standard: 'CASEL: Self-awareness',
        kind: 'notice',
        after: 5,
        lines: [
          N(
            'Blue and gold at once: missing Fossil and loving her, both together. Feelings like that are called bittersweet.',
          ),
          N('Feeling two things at the same time is normal. Neither one cancels the other.'),
        ],
        parentNote: 'Learned the word “bittersweet” and that mixed feelings are normal.',
      },
    ],
  ),
  // ------------------------------------------------ step 13 scene: the rope
  scene(
    's30-rope',
    [
      DU('Right. Basket.', 'happy'),
      N(
        'Dusty has a coil of rope over one shoulder and a log basket on the end. Nobody knows where Dusty keeps rope, but they always have some.',
      ),
      DU(
        'Never go near a hole without a rope. First thing Hazel ever told me. Second thing was, give that spoon back.',
      ),
      N(
        'Anybody with long enough legs climbs out. The rest go in the basket: Dimple with Fossil’s cushion, and anyone small.',
      ),
      CL('Gently. Gently! She’s had a morning.', 'shock'),
      DU('Two on the rope. You pull, I’ll count. I’m good at counting. I count bits.', 'soft'),
    ],
    [
      {
        domain: 'science',
        skill: 'balanced and unbalanced forces',
        standard: '3-PS2-1',
        kind: 'ask',
        after: 5,
        prompt: [
          DU('The basket’s weight pulls down. We pull up. When does it start to rise?', 'think'),
        ],
        options: [
          opt(
            'When our pull is stronger than its weight',
            [DU('Spot on. Unbalanced forces: up wins, up it goes. Pull steady.', 'happy')],
            true,
          ),
          opt('When our pull equals its weight', [
            DU(
              'Equal pulls are balanced: it just hangs there. Pull a bit harder than its weight, and up it comes.',
              'soft',
            ),
          ]),
        ],
        parentNote: 'Learned that an object moves when the forces on it are unbalanced.',
      },
    ],
  ),
  // ------------------------------------------------ step 13 done: the rim
  scene(
    's30-rim',
    [
      N(
        'The basket comes up over the lip. Clover has Dimple out of it before it has stopped swinging.',
      ),
      N(
        'She cries all over her: into her fur, on the cushion, on her ears. Dimple lets her, ball blue and gold, quite still for once.',
      ),
      CL('Look at me. I’m worse than she is. I’m a disgrace. Somebody give me a hanky.', 'sad'),
      N('Dusty gives Clover a sock. It’s clean, mostly.'),
      CL(
        'Crying slows me right down, so I can feel it properly. I think that’s what it’s for.',
        'happy',
      ),
      N(
        'She laughs at herself, and blows her nose on the sock, and laughs harder. Dimple watches her face the whole time.',
      ),
      DU('You can keep the sock.', 'soft'),
    ],
    [
      {
        domain: 'health',
        skill: 'crying is a healthy way to let feelings out',
        kind: 'notice',
        after: 4,
        lines: [
          N(
            'Crying is something every human body can do. Many people feel calmer after a good cry.',
          ),
          N(
            'Laughing and crying at once, like Clover, is normal too. Afterwards, a drink of water and a rest help.',
          ),
        ],
        parentNote: 'Talked about crying as a normal, healthy response to big feelings.',
      },
    ],
  ),
  // ------------------------------------------------ step 14 scene: up the hill
  scene(
    's30-hill',
    [
      N(
        'That afternoon Dimple walks up the hill. Not on anyone’s shoulder: up the path, past the halfway place, on her own feet.',
      ),
      N(
        'Drizzle walks beside her, slower still. Dusty walks behind with Fossil’s cushion under one arm, and doesn’t hurry anybody.',
      ),
      N(
        'At the top is Fossil’s flower, sandstone-coloured, a little bent by the frost. Dimple sits down in front of it.',
      ),
      N(
        'Drizzle sits on one side of her. Dusty sits on the other, cross-legged, and sets the cushion in the grass, dent up.',
      ),
      N(
        'Nobody does anything. The wind goes over, and down in the valley somebody is burning leaves.',
      ),
      N(
        'Your Nubbin, who has copied Dimple all autumn, comes and sits down too. It copies the sitting perfectly.',
      ),
    ],
    [
      {
        domain: 'sel',
        skill: 'grief and remembering',
        standard: 'CASEL: Self-awareness',
        kind: 'notice',
        after: 4,
        lines: [
          N(
            'Going to a special place to remember someone is one way people grieve. It doesn’t make the missing stop.',
          ),
          N('But it gives the missing somewhere to sit, with friends beside you.'),
        ],
        parentNote:
          'Talked about visiting a special place as one way to remember someone who has died.',
      },
    ],
  ),
  // ------------------------------------------------ step 14 done: Fidget on the hill
  scene(
    's30-fidget-hill',
    [
      N(
        'Then a noise comes up the path: small feet, very fast, and a thin worried squeak. Fidget.',
      ),
      N(
        'She has woken in the kitchen and found everybody gone. She has come all the way up the hill alone, checking every bush.',
      ),
      N(
        'At the top she spins round and round in the grass, looking for everybody at once. Her ball is whirling like a top.',
      ),
      FI('…', 'shock'),
      N('Clover comes puffing up the path behind her, too late, in one welly.'),
      N(
        'Before anybody else can move, Dimple gets up. She goes to Fidget and sits down right beside her, and stays.',
      ),
      N('She doesn’t smile at her, or bounce. She sits, the way she was sat with.'),
      N(
        'Fidget spins slower, and slower. Then she stops, and leans on Dimple, and her ball settles to a small warm orange.',
      ),
      CL('Where did she learn that?', 'soft'),
      DU('Under your kitchen table. In a thunderstorm.', 'soft'),
    ],
    [
      {
        domain: 'literacy',
        skill: 'making inferences',
        standard: 'RL.3.3',
        kind: 'ask',
        after: 9,
        prompt: [
          N(
            'Dusty says Dimple learned it “under your kitchen table, in a thunderstorm”. What does Dusty mean?',
          ),
        ],
        options: [
          opt(
            'Fossil sat with her then, so now she knows how',
            [
              N(
                'Yes, that’s a good inference. Kindness passes on. Fossil sat with baby Dimple; now Dimple sits with Fidget.',
              ),
            ],
            true,
          ),
          opt('Dimple took lessons under the table', [
            N('Not lessons. Fossil sat with her in the storm, and she learned by being sat with.'),
          ]),
        ],
        parentNote: 'Inferred how a kindness received was passed on to someone else.',
      },
      {
        domain: 'health',
        skill: 'calming down',
        kind: 'do',
        after: 7,
        check: 'edu:breathe:slow:4-in-4-out',
        lines: [
          N(
            '(Help Fidget slow down. Breathe in for four, out for four, three times, as her ball slows.)',
          ),
        ],
        parentNote: 'Practised slow breathing as a way to calm big feelings.',
      },
    ],
  ),
  // ------------------------------------------------ complete: the rubbing
  scene(
    's30-complete',
    [
      N(
        'On the way home you stop at the old wall. Clover holds the paper flat; you rub over Hush’s stone with a stub of charcoal.',
      ),
      N(
        'The marks come up black and fine under your hand: rings, and lines, and rings with lines through them.',
      ),
      CL('Dimple ought to have a mark of her own. On her page. A proper one.', 'soft'),
      N('In the clean corner of the paper, you draw it for her: a ring with a line through it.'),
      N('Beside it, small and close, you draw Drizzle’s: a plain ring, just touching.'),
      CL('That’s the both one. That’s her now.', 'soft'),
      N(
        'That night you write it up: Hush’s stone, and a page for each of your Nubbins, ringed and lined from what you remember.',
      ),
      N(
        'In the morning there is a parcel on your step: a pale-blue rain hat, and Fossil’s cushion, plumped for the first time in years.',
      ),
      N(
        'The note says Fossil would want it sat on, not kept. Sparks has added a blue-and-gold ribbon, dyed twice.',
      ),
    ],
    [
      {
        domain: 'art',
        skill: 'texture rubbing',
        kind: 'do',
        after: 1,
        check: 'edu:rub:texture:hush-stone',
        lines: [
          N('(Rub the charcoal over the paper on the stone.)'),
          N(
            'A rubbing copies texture: the raised parts catch the charcoal, the scratches stay pale. Try it on a leaf or a coin at home.',
          ),
        ],
        parentNote: 'Learned how a rubbing records the texture of a surface.',
      },
      {
        domain: 'sel',
        skill: 'reflecting on feelings',
        standard: 'CASEL: Self-awareness',
        kind: 'ask',
        after: 6,
        prompt: [N('If you made a mark for today, which would it be?')],
        options: [
          opt('A ring: a joy kept', [
            N('A good day to keep. Hush would have scratched it carefully.'),
          ]),
          opt('A line: a grief kept', [
            N('That’s allowed. A line kept is a lantern lit. Someone will find you.'),
          ]),
          opt('Both: a ring with a line through it', [
            N('Like Dimple. Like most things, Moss would say.'),
          ]),
        ],
        parentNote: 'Reflected on their own feelings using Hush’s marks (no single right answer).',
      },
    ],
  ),
];

// ================================================================== variants
export const EDU_S30_READER_VARIANTS: EduScene[] = [
  // ---- replaces s30-wall when S1's wall memory was seen
  scene(
    's30-wall-s1',
    [
      N('The frosts have come, and the Grove is white at dawn round the fourth post.'),
      N(
        'You find Moss at the old wall, by Hush’s lantern post, with frost on his back that he hasn’t bothered to shake off.',
      ),
      M(
        'Clover’s gold one. Luna told me. Luna tells me things at dawn, when I am too tired to argue.',
        'think',
      ),
      M(
        'You know she sat with the still ones, the ones who had died. You walked here with me, and heard her ask to be kept.',
        'soft',
      ),
      M('I never told you what she thought sad was for.'),
      M(
        'People thought it made her a sad thing, the sitting. They were wrong about which part was sad.',
        'soft',
      ),
      M(
        'Low in the wall. The flat stone, by your foot. Look at it properly. She meant it to be looked at.',
      ),
    ],
    [
      {
        domain: 'social-studies',
        skill: 'oral history',
        standard: 'D2.His.2.K-2',
        kind: 'notice',
        after: 3,
        lines: [
          N(
            'Moss remembers Hush and tells her story aloud. Passing history on by telling it is called oral history.',
          ),
          N('For most of history, that was how families and villages remembered their past.'),
        ],
        parentNote: 'Learned what oral history is and how stories carry the past.',
      },
    ],
  ),
  // ---- plays after s30-drizzle when s5Done
  scene(
    's30-hole-youngest',
    [
      N(
        'Then your youngest Nubbin comes down the bank: the one Fossil sat with until dark. It climbs into the hole and sits on Dusty’s boot.',
      ),
      DU('Oh, not you as well.', 'sad'),
      N('Dusty laughs, wetly, gets mud in their mouth, and laughs at that too.'),
      DU(
        'She trained you both. Didn’t she. The old madam. Sat on a sill for twenty years and trained the lot of you.',
        'happy',
      ),
      N('Fossil never said a word. She taught by doing, and they learned by watching.'),
      N('Dusty wipes their eyes again. This time it doesn’t make it worse.'),
    ],
    [
      {
        domain: 'sel',
        skill: 'learning from example',
        standard: 'CASEL: Social awareness',
        kind: 'notice',
        after: 4,
        lines: [
          N(
            'We often learn kindness the way these Nubbins did: by seeing it done, and having it done to us.',
          ),
        ],
        parentNote: 'Discussed how kindness is learned by example.',
      },
    ],
  ),
  // ---- replaces s30-gone when s30-ring = helped
  scene(
    's30-gone-helped',
    [
      N(
        'Early autumn. Clover is at your gate before it is light, in her dressing gown and wellies.',
      ),
      CL('She’s gone. Dimple. Her basket was cold when I got up.', 'shock'),
      CL(
        'She’s taken nothing but the cushion off the sill. Fossil’s cushion, toys and all.',
        'sad',
      ),
      CL('What does she want with it? She’s done nothing but pile rubbish on it for weeks.'),
      CL(
        'Drizzle’s under the rain butt and won’t budge. The others are in a heap. I didn’t know who else to come to.',
        'sad',
      ),
      N(
        'Dusty is coming up the lane with a spade on one shoulder. One look at Clover, and they put the spade down.',
      ),
      DU(
        'She’s going back to where the happy was. I would. I’ve been trying to all summer.',
        'soft',
      ),
      N('The three of you set off down the lane in the half dark.'),
    ],
    [
      {
        domain: 'literacy',
        skill: 'inference',
        standard: 'RL.3.3',
        kind: 'ask',
        after: 6,
        prompt: [N('“Back to where the happy was.” Where do you think Dimple has gone?')],
        options: [
          opt(
            'Somewhere she was happy with Fossil',
            [
              N(
                'That’s a good inference. She took Fossil’s cushion, so it’s somewhere Fossil belonged.',
              ),
            ],
            true,
          ),
          opt('To a party', [
            N(
              'A fair guess after Sparks! But she took Fossil’s cushion, so it’s somewhere Fossil belonged.',
            ),
          ]),
        ],
        parentNote: 'Made an inference from clues (the cushion, Dusty’s words).',
      },
    ],
  ),
  // ---- replaces s30-trail when s5Done
  scene(
    's30-trail-s5',
    [
      N(
        'On the bank of your pond, where you held Fossil up in the shallows, there is a sock, laid out neatly.',
      ),
      N(
        'Under Hazel’s crooked tree, half a wooden peg, just where the wrinkled fruit once fell into Fossil’s lap.',
      ),
      DU(
        'She’s doing the walk. Fossil’s walk. Backwards. The water, the tree, the cliff.',
        'shock',
      ),
      DU(
        'I told it at Clover’s table every night for a fortnight. I thought she was asleep under the sill.',
        'sad',
      ),
      N(
        'From the tree the trail runs east along the stream, a pine cone, then a cotton reel, towards the striped cliff.',
      ),
      N(
        'At the foot of the cliff the rock is striped like a cake. Where it meets the ground, there is a hollow, dug down and in.',
      ),
      DU('That’s it. The spoon hole. Where I dug her out. Two days, with a spoon.', 'soft'),
      N(
        'Dimple is down in it, on Fossil’s cushion, scraping at the back of the hollow as if there might be another egg.',
      ),
      N(
        'The hollow is only waist-deep on you, but on a Nubbin the lip is a cliff. She can’t climb out, and she hasn’t tried.',
      ),
      DI('…'),
    ],
    [
      {
        domain: 'maths',
        skill: 'reversing a sequence',
        kind: 'ask',
        after: 2,
        prompt: [
          N(
            'Fossil’s walk went cliff, tree, water. Dimple walks it backwards. Which place is second for both of them?',
          ),
        ],
        options: [
          opt(
            'The tree',
            [N('Yes. Reverse a list of three, and the middle stays in the middle.')],
            true,
          ),
          opt('The cliff', [
            N(
              'The cliff was first for Fossil and last for Dimple. The middle one, the tree, stays put.',
            ),
          ]),
        ],
        parentNote: 'Reversed a sequence and noticed the middle stays in place.',
      },
    ],
  ),
  // ---- replaces s30-hollow when s30-ring = helped
  scene(
    's30-hollow-helped',
    [
      N(
        'Drizzle is at home under the rain butt. So it is you who climbs down, carefully, and sits in the dust at the back of the hollow.',
      ),
      N(
        'Dimple turns, and the smile goes on like a lamp. She bounces at you, and offers you a pebble, a root, a handful of dust.',
      ),
      N(
        'She performs. She runs the streamer race on her own in a space the size of a bath, and does the hat toss without a hat.',
      ),
      N('You don’t clap, and you don’t stop her. Your knees go cold, and then numb.'),
      CL('Shall I come down? I should come down. I’m her… I should…', 'shock'),
      DU('Leave them a minute. Look at her. She’s nearly out of tricks.', 'soft'),
      N('It takes a long time. It takes longer than the party did.'),
    ],
    [
      {
        domain: 'sel',
        skill: 'staying without fixing',
        standard: 'CASEL: Relationship skills',
        kind: 'ask',
        after: 3,
        prompt: [N('Why might it help not to clap, and not to stop her either?')],
        options: [
          opt(
            'So she doesn’t have to perform, and doesn’t feel told off',
            [
              N(
                'Yes. Clapping keeps the show going; stopping her feels like a scolding. Staying lets her stop herself.',
              ),
            ],
            true,
          ),
          opt('Because clapping is rude', [
            N(
              'Not rude. But clapping keeps the show going. Staying quietly lets her stop when she’s ready.',
            ),
          ]),
        ],
        parentNote: 'Thought about how to be with a friend without pushing or fixing.',
      },
    ],
  ),
  // ---- plays after s30-stopped when s5Done
  scene(
    's30-hollow-youngest',
    [
      N(
        'Your youngest Nubbin goes over the lip after them, sliding down on its bottom, and sits on Dimple’s other side.',
      ),
      N('Fossil sat with it once, until dark. It seems to remember how.'),
      DU('Course it does.', 'soft'),
      N('Now there is somebody on each side of Dimple, like bookends.'),
      N('Nobody up at the rim says anything. Clover holds Dusty’s sleeve, and Dusty lets her.'),
      N('Down in the hollow, nobody moves, and nobody hurries anybody.'),
    ],
    [
      {
        domain: 'literacy',
        skill: 'similes',
        standard: 'L.4.5',
        kind: 'notice',
        after: 3,
        lines: [
          N(
            'Bookends hold up the books between them from both sides. The simile shows Dimple held up, one friend each side.',
          ),
        ],
        parentNote: 'Explained a simile about support.',
      },
    ],
  ),
  // ---- replaces s30-hill when s30-ring = helped
  scene(
    's30-hill-helped',
    [
      N(
        'That afternoon Dimple walks up the hill. Not on anyone’s shoulder: up the path, past the halfway place, on her own feet.',
      ),
      N(
        'You walk beside her, and every few steps she checks you are still there. Dusty walks behind with Fossil’s cushion.',
      ),
      N(
        'At the top is Fossil’s flower, sandstone-coloured, a little bent by the frost. Dimple sits down in front of it.',
      ),
      N(
        'You sit on one side of her. Dusty sits on the other, cross-legged, and sets the cushion in the grass, dent up.',
      ),
      N(
        'Nobody does anything. The wind goes over, and down in the valley somebody is burning leaves.',
      ),
      N(
        'Your Nubbin, who has copied Dimple all autumn, comes and sits down too. It copies the sitting perfectly.',
      ),
    ],
    [
      {
        domain: 'sel',
        skill: 'grief and remembering',
        standard: 'CASEL: Self-awareness',
        kind: 'notice',
        after: 4,
        lines: [
          N(
            'Going to a special place to remember someone is one way people grieve. It doesn’t make the missing stop.',
          ),
          N('But it gives the missing somewhere to sit, with friends beside you.'),
        ],
        parentNote:
          'Talked about visiting a special place as one way to remember someone who has died.',
      },
    ],
  ),
  // ---- replaces s30-complete when s30-ring = helped
  scene(
    's30-complete-helped',
    [
      N(
        'On the way home you stop at the old wall. Clover holds the paper flat; you rub over Hush’s stone with a stub of charcoal.',
      ),
      N(
        'The marks come up black and fine under your hand: rings, and lines, and rings with lines through them.',
      ),
      CL('Dimple ought to have a mark of her own. On her page. A proper one.', 'soft'),
      N('In the clean corner of the paper, you draw it for her: a ring with a line through it.'),
      N(
        'Clover takes the charcoal and draws one more beside it, small and close: a plain ring, just touching. Yours.',
      ),
      CL('That’s the both one. That’s her now.', 'soft'),
      N(
        'That night you write it up: Hush’s stone, and a page for each of your Nubbins, ringed and lined from what you remember.',
      ),
      N(
        'In the morning there is a parcel on your step: a pale-blue rain hat, and Fossil’s cushion, plumped for the first time in years.',
      ),
      N(
        'The note says Fossil would want it sat on, not kept. Sparks has added a blue-and-gold ribbon, dyed twice.',
      ),
    ],
    [
      {
        domain: 'art',
        skill: 'texture rubbing',
        kind: 'do',
        after: 1,
        check: 'edu:rub:texture:hush-stone',
        lines: [
          N('(Rub the charcoal over the paper on the stone.)'),
          N(
            'A rubbing copies texture: the raised parts catch the charcoal, the scratches stay pale. Try it on a leaf or a coin at home.',
          ),
        ],
        parentNote: 'Learned how a rubbing records the texture of a surface.',
      },
      {
        domain: 'sel',
        skill: 'reflecting on feelings',
        standard: 'CASEL: Self-awareness',
        kind: 'ask',
        after: 6,
        prompt: [N('If you made a mark for today, which would it be?')],
        options: [
          opt('A ring: a joy kept', [
            N('A good day to keep. Hush would have scratched it carefully.'),
          ]),
          opt('A line: a grief kept', [
            N('That’s allowed. A line kept is a lantern lit. Someone will find you.'),
          ]),
          opt('Both: a ring with a line through it', [
            N('Like Dimple. Like most things, Moss would say.'),
          ]),
        ],
        parentNote: 'Reflected on their own feelings using Hush’s marks (no single right answer).',
      },
    ],
  ),
  // ---- afterwards: Keeper talk lines once s30Done
  scene(
    's30-after-clover',
    [
      N(
        'Clover’s shed door stands half shut every dusk now. Fidget sees to it herself; she has decided half is the right amount.',
      ),
      N(
        'On the deep kitchen sill, Dimple and Drizzle sleep in the sun, gold and pale blue, one pressed against the other.',
      ),
      CL(
        'She still smiles most of the day. I wouldn’t change it. And now when she isn’t, I know where to look.',
        'soft',
      ),
      CL('I look at the ball now as well as the face. Took me long enough.', 'happy'),
      N('Fidget trots past with a tea towel, counting. She counts you twice, to be sure.'),
      CL('She’s settling. Half shut. That’s progress, that is.', 'soft'),
    ],
    [
      {
        domain: 'maths',
        skill: 'halves',
        standard: '1.G.A.3',
        kind: 'notice',
        after: 0,
        lines: [
          N(
            'Half shut is also half open: two equal halves make the whole doorway. Fidget’s fudge, in fractions.',
          ),
        ],
        parentNote: 'Saw that two halves make a whole.',
      },
    ],
  ),
  scene(
    's30-after-dusty',
    [
      DU(
        'I go up and sit with Fossil on Thursdays. Dimple comes. Gets there first, some weeks. Waits for me.',
        'soft',
      ),
      DU(
        'We don’t do anything. It’s the best bit of the week. Don’t tell Clover. She’ll bring a flask.',
        'happy',
      ),
      N('Dusty turns a striped pebble over in their fingers, a little piece of the cliff.'),
      DU(
        'I still count the bit, you know. Twenty years and a bit. The bit’s getting longer.',
        'soft',
      ),
      DU('That’s all right. It’s meant to.', 'soft'),
      N('They put the pebble back in their pocket, carefully, like a letter.'),
    ],
    [
      {
        domain: 'sel',
        skill: 'remembering together',
        standard: 'CASEL: Relationship skills',
        kind: 'notice',
        after: 1,
        lines: [
          N(
            'Remembering someone with a friend can make the missing feel lighter. Dusty and Dimple carry it between them.',
          ),
        ],
        parentNote: 'Talked about sharing memories of someone with a friend.',
      },
    ],
  ),
  scene(
    's30-after-byte',
    [
      BY('I’m keeping the chart. For science. Dimple’s ball, every time I see her.', 'think'),
      BY(
        'Mostly gold. Sometimes blue. Sometimes both, which my scale didn’t cover, so I drew a new column. It’s my favourite column.',
        'soft',
      ),
      BY('Also she pulled my laces on Tuesday. Both of them. I’ve logged it as a result.', 'happy'),
      N(
        'He shows you the chart. The “both” column has been drawn in twice, in two colours of pencil.',
      ),
      BY('Single knots, still. Obviously. For science.', 'soft'),
      N('He tucks the chart away before you can say anything about it.'),
    ],
    [
      {
        domain: 'maths',
        skill: 'reading a scaled bar chart',
        standard: '3.MD.B.3',
        kind: 'ask',
        after: 1,
        prompt: [BY('This week: gold 12, blue 4, both 6. How many more gold than both?', 'think')],
        options: [
          opt('6', [BY('Six. 12 − 6 = 6. Logged.', 'happy')], true),
          opt('8', [BY('That’s gold minus blue: 12 − 4. Gold minus both is 12 − 6 = 6.', 'think')]),
          opt('18', [
            BY('That’s gold plus both. “How many more” means subtract: 12 − 6 = 6.', 'think'),
          ]),
        ],
        parentNote: 'Compared two bars on a chart by subtracting (12 − 6 = 6).',
      },
    ],
  ),
  scene(
    's30-after-sparks',
    [
      SP('I sat still! On the hill! With Dimple! For…', 'happy'),
      SP(
        'Fifty-one seconds. Byte timed it. Nearly a minute. That’s a personal best. That’s a valley record.',
        'happy',
      ),
      SP('It was really nice. It was horrible. It was really nice.', 'soft'),
      N('Sparks is bouncing on her toes as she says it, which rather spoils the effect.'),
      SP('Next time, a whole minute. I’m training. I sat through a boiled egg yesterday.', 'happy'),
      SP('Dimple didn’t even need a party. She just needed someone to stay. Who knew?', 'think'),
    ],
    [
      {
        domain: 'maths',
        skill: 'seconds in a minute',
        standard: '4.MD.A.1',
        kind: 'ask',
        after: 1,
        prompt: [
          SP(
            'A minute is sixty seconds. How many more seconds would I need for a whole minute?',
            'think',
          ),
        ],
        options: [
          opt('9', [SP('Nine! 60 − 51 = 9. Next time. Probably. Maybe.', 'happy')], true),
          opt('19', [SP('Count up from 51: 52, 53… 60. That’s nine. 60 − 51 = 9.', 'think')]),
          opt('49', [SP('That’s too many! Count up from 51 to 60: just nine seconds.', 'think')]),
        ],
        parentNote: 'Used 1 minute = 60 seconds to find a difference (60 − 51 = 9).',
      },
    ],
  ),
];

// ================================================================== the quest
export const EDU_S30_READER: EduQuest[] = [
  {
    id: 'reader:s30',
    of: 's30',
    band: 'reader',
    title: 'What Sad Is For',
    goals: {
      's30-step1': {
        goal: 'Go down the lane to Clover’s cottage for tea, and meet her Nubbins.',
        hint: 'Clover’s is past Fern’s, with the deep windowsill and the rain butt by the door.',
      },
      's30-step2': {
        goal: 'Go out to the rain butt and see what Dimple is doing to Drizzle.',
        hint: 'The yard is round the back. Go quietly; Flinch is asleep in the bucket.',
      },
      's30-step3': {
        goal: 'Run Dimple’s Bounce Party: the streamer race, the hat toss and the cake.',
        hint: 'Three party games. Nobody can lose, Sparks says.',
      },
      's30-step4': {
        goal: 'Watch Dimple with each of her five favourite things.',
        hint: 'The sill and the hum at Clover’s, puddles in the yard, Sparks’s racers at the pond, and Byte.',
      },
      's30-step5': {
        goal: 'Wait by Dusty’s hole by the stream and see what happens.',
        hint: 'Don’t dig and don’t call them out. Stand at the edge for a while.',
      },
      's30-step6': {
        goal: 'Go up the hill path with Luna at three in the morning.',
        hint: 'No lantern: Luna says the Moon is enough, and Dimple would see a light.',
      },
      's30-step7': {
        goal: 'Look closely at Hush’s flat stone in the old wall.',
        hint: 'It’s low down by the wall lantern. Brush the frost off with your sleeve.',
      },
      's30-step8': {
        goal: 'Come back to Clover’s at dusk and see how Fidget is settling in.',
        hint: 'Get there before the yard goes white with frost.',
      },
      's30-step9': {
        goal: 'Open the shed without frightening Fidget.',
        hint: 'Hang the blanket across the doorway, stand the bucket on its hem, leave a gap underneath.',
      },
      's30-step10': {
        goal: 'Follow Dimple’s trail and find her.',
        hint: 'She is dropping her toys as she goes. Follow the toys.',
      },
      's30-step11': {
        goal: 'Stay at the spoon hole until Dimple stops.',
        hint: 'Don’t call to her and don’t pull her out. This takes as long as it takes.',
      },
      's30-step12': {
        goal: 'Stay at the rim while Clover tells you how Dimple and Fossil met.',
        hint: 'Just listen.',
      },
      's30-step13': {
        goal: 'Haul the basket up out of the spoon hole.',
        hint: 'Pull steady, hand over hand. Jerk it and the basket spins.',
      },
      's30-step14': {
        goal: 'Sit with Dimple by Fossil’s flower.',
        hint: 'Sit down near her on the hilltop and stay.',
      },
    },
    scenes: SCENES,
    glossary: [
      gloss('beams', 'Smiles a big, wide smile.', 's30-smile'),
      gloss('plump', 'To shake and pat a cushion so it is round and full again.', 's30-sill'),
      gloss('skein', 'A long loose coil of wool or thread.', 's30-acorns'),
      gloss(
        'herding',
        'Moving a group of animals along together, like a sheepdog does.',
        's30-acorns',
      ),
      gloss('compulsory', 'Something you have to do; it is not a choice.', 's30-party-ask'),
      gloss(
        'under protest',
        'Doing something while saying clearly that you don’t want to.',
        's30-party-ask',
      ),
      gloss('scale', 'A row of numbers used to measure something, like 0 to 10.', 's30-party'),
      gloss('observation', 'Watching carefully and noting what you see.', 's30-five'),
      gloss('relaxing', 'Helping you feel calm and loose, not tense.', 's30-hole'),
      gloss('crescent', 'The thin curved shape of the Moon when only a sliver is lit.', 's30-path'),
      gloss('grief', 'The deep sadness you feel when someone you love has died.', 's30-wall'),
      gloss('record', 'Something kept so that people can know later what happened.', 's30-stone'),
      gloss(
        'metaphor',
        'Saying one thing is another, to show how they are alike: “Sad is a lantern.”',
        's30-stone',
      ),
      gloss('range', 'A big old-fashioned kitchen stove that stays warm all day.', 's30-fidget'),
      gloss('wilt', 'To droop and go limp, like a plant without water or light.', 's30-shed'),
      gloss(
        'compromise',
        'An answer where everyone gets some of what they need. Hazel called it a fudge.',
        's30-blanket',
      ),
      gloss('acceptable', 'Good enough; all right.', 's30-blanket'),
      gloss('certain', 'Sure; not doubting at all.', 's30-gone'),
      gloss('hollow', 'A small dip or hole in the ground or in rock.', 's30-trail'),
      gloss('unasked', 'Without anybody asking.', 's30-hollow'),
      gloss('bittersweet', 'Happy and sad at the same time.', 's30-blue-gold'),
      gloss('vibration', 'A very fast shaking movement, which can make sound.', 's30-blue-gold'),
      gloss(
        'unbalanced',
        'When one push or pull is stronger than the other, so something moves.',
        's30-rope',
      ),
      gloss('disgrace', 'Here, a joke: a messy, embarrassing state.', 's30-rim'),
      gloss(
        'inference',
        'Working something out from clues, when nobody says it straight.',
        's30-fidget-hill',
      ),
      gloss(
        'rubbing',
        'A copy of a bumpy surface made by rubbing crayon or charcoal over paper laid on it.',
        's30-complete',
      ),
    ],
    notes:
      'Lessons: similes and metaphors (kettle, soap bubble, pot plants, frost on a window, “sad is a lantern”; L.4.5); a face ' +
      'and a feeling can differ; character motive (the acorn ring, Byte’s single knots); measurement (2 m of bunting, a flag ' +
      '20 cm wide edge to edge = 10 flags; 4.MD.A.2); a bar chart of Byte’s ball scores (2, 2, 1; 2.MD.D.10); one fifth (3.NF.A.1); a ' +
      'tally chart of nought out of five; 11 p.m. to 3 a.m. = 4 hours (3.MD.A.1); moon phases; frost as water vapour freezing ' +
      '(0 °C / 32 °F); records scratched in stone; life cycles; safe is not the same as well; comparing solutions to the shed ' +
      'problem (3-5-ETS1-2); “fudge” as a multiple-meaning word; shortening autumn days; east and sunrise; rock layers; light ' +
      'faster than sound (about 3 seconds per km); bittersweet; forces on the rope (3-PS2-1); crying is normal; grief and ' +
      'remembering; passing kindness on; slow breathing; texture rubbing. Think question (s30-path): why does Dimple smile all ' +
      'day but not alone on the hill? Every reply is honoured. The acorn-ring choice keeps all three ids. Ember’s “after Ash” ' +
      'becomes “after I lost Ash” (canon: Ember lost Ash to Corvin; she did not fade). The two film quotes are replaced by original lines (the childLines).',
  },
];

/** Every `edu:` check used by a `do` lesson in this file. */
export const CHECKS: string[] = [
  'edu:chart:bar:dimple-ball',
  'edu:tally:five-things:0-of-5',
  'edu:breathe:slow:4-in-4-out',
  'edu:rub:texture:hush-stone',
];
