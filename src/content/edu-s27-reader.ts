/**
 * The Learning Grove, reader band (ages 7–10): S27 “Some Nubbin”.
 *
 *   Spiders (eight legs, two body parts, silk from spinnerets, fresh webs and recycled silk, egg sacs, spiderlings
 *   ballooning, the life cycle and life span: 3-LS1-1, 4-LS1-1); frost forming straight from water vapour on cold
 *   surfaces, and melting (2-ESS2-3, 2-PS1-4); shade and sunlight (K-PS3-1); light and seeing (1-PS4-2); shorter
 *   autumn days (1-ESS1-2); copper wire and circuits (4-PS3-2); a ladder’s balanced forces (3-PS2-1).
 *   Maths: letters on a rail (2.OA.A.1), doubling a crowd (3.OA.A.3), places in a race, hours through the night
 *   (3.MD.A.1), rungs and centimetres (4.MD.A.1), two hundred Shells in tens (3.OA.A.1).
 *   Language: multiple meanings (place, spindle; L.3.4), homophones, compound words and the apostrophe (L.2.4),
 *   feeling words (RL.1.4), a simile (L.4.5), character and motive (RL.3.3), theme (RL.4.2).
 *   Think questions (no best answer): s27-was-it-you (is a kind fib ever right?) and s27-midnight (why did Corvin
 *   lower his hand?).
 *
 * One EduScene per original scene (14 step scenes, 14 done scenes, the complete scene and the 9 variants), id
 * `reader:<original id>`. Every choice keeps its original id and `set`. See EDU-STYLE.md. British spelling.
 * No quotes from the book: the Keeper’s line in s27-last-evening and the spring scenes’ closing narration are new.
 * Spindle dies of old age, offscreen; s27-empty-web says so plainly, with comfort straight after.
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
const C = say('corvin');
const SP = say('sparks');
const FE = say('fern');
const CL = say('clover');
const LU = say('luna');
const BY = say('byte');
const TA = say('s27-tam');
const TU = say('s27-tull');
const W = say('wisp');
const CK = say('clank');

// ---------------------------------------------------------------- builders
type LessonIn = Omit<Lesson, 'id'>;

/** Builds `reader:<of>` and numbers its lessons `reader:<of>-l1`, `-l2`. */
const scene = (of: string, lines: Line[], lessons: LessonIn[], choices?: Choice[]): EduScene => {
  const id = `reader:${of}`;
  const s: EduScene = {
    id,
    of,
    band: 'reader',
    lines,
    lessons: lessons.map((l, i) => ({ id: `${id}-l${i + 1}`, ...l })),
  };
  if (choices) s.choices = choices;
  return s;
};

const gloss = (word: string, meaning: string, of: string): GlossaryEntry => ({
  word,
  meaning,
  scene: `reader:${of}`,
});

// ---------------------------------------------------------------- shared pieces
/** The four words, gathered (s27-words and s27-words-sold). 12 lines; line 8 is Byte’s. */
const WORD_HUNT: Line[] = [
  N('Fern is up a ladder in her orchard, losing an argument with a plum tree.'),
  FE('A word? For a spider? Easy. Somebody’s. As in, this one belongs to somebody.'),
  FE('When Bramble went, people said she was only a Nubbin. She wasn’t only. She was mine.', 'sad'),
  N('Clover listens with her head on one side, the way she listens to the shy ones.'),
  CL('Warm. You can’t make a grey one stop being grey. But you can make it warm.', 'soft'),
  N(
    'Luna is asleep in a deckchair in her night garden at noon. She answers without opening her eyes.',
  ),
  LU('Home. Everything in my garden grows towards it in the dark.', 'soft'),
  N('Byte goes away to think, and comes back with a sheet of paper.'),
  BY(
    '“Statistically above average.” It’s accurate. It’s kind. It’s the nicest thing I know how to say.',
    'think',
  ),
  N('You read the four words to the shed window. Spindle listens to each one, like a judge.'),
  N('At Byte’s, she points one leg, very politely, along the whole length of the rail.'),
  SP('She’s saying it won’t fit. Break it to Byte gently. He loves his long words.', 'happy'),
];

/** The morning after the Show (s27-letgo and s27-home). 8 lines; line 1 is HOME on the rail. */
const MORNING: Line[] = [
  N('By breakfast, half the valley is at the Circuit fence. Nobody arranged it. People just came.'),
  N('All along the finishing straight, in letters as tall as a Nubbin, the frost says: HOME.'),
  FE('HOME! Look at the size of it. She must have run out of rail!', 'happy'),
  N('Mr Tull is at the gate with his cart. He reads the rail, then the faces along the fence.'),
  TU('Morning, Mr Vale. I’ve come for whatever didn’t place. But I won’t take that one.', 'think'),
  TU('Its name has been on your rails all summer. Half this valley would come asking after it.'),
  TU('I sell runners. I don’t sell the ones people ask after. Good day to you.'),
  N('He tips his hat to the fence, quite politely, and drives away over the pass.'),
];

/** Your sold Nubbin walks out (both s27-home choices). */
const HOME_TAIL: Line[] = [
  N('Tam opens the pen. Your Nubbin steps out, and stops, and looks at you across the sand.'),
  N('Then it comes, the whole way, not hurrying, the 9 still white on its side.'),
  N('It leans against your leg, the way it did the week it hatched. It is cold, and it is yours.'),
];

/** The egg sac comes down (s27-carry and s27-carry-clank). */
const LADDER: Line[] = [
  N('Sparks carries her long ladder in sideways, muttering at the door frame.'),
  SP('Rafters are your job. I’ve got the knees of an eighty-year-old and the opinions to match.'),
  N(
    'Your Nubbin looks at the ladder, then at the sac, then at you. Then it climbs, one rung at a time.',
  ),
];
const LADDER_DOWN: Line[] = [
  N(
    'It comes down backwards, holding the sac against its chest like an egg that might hatch today.',
  ),
  N('Spindle watches every rung, and doesn’t relax until it is on the floor. You don’t either.'),
  SP('Grove lantern shed. Top shelf, over the warm pipe. Nothing up there ever freezes.'),
  N('You carry it home down the valley in your cupped hands. Spindle stays in her window.'),
];

// ================================================================== S27 Some Nubbin
const S27_SCENES: EduScene[] = [
  // ------------------------------------------------ step 1: the wire
  scene(
    's27-wire',
    [
      N('High summer at the Circuit. The sand is hot enough to fry an egg on.'),
      N('And yet the white railings are furred with frost.'),
      N('Sparks is on her back under the start lamp, with a screwdriver in her teeth.'),
      SP('Start lamp’s gone again. I need wire. Thin copper wire, a coil about this big.', 'angry'),
      SP('There’s a cabinet of mine in the old lantern shed, behind the straight. Bottom drawer.'),
      SP(
        'He doesn’t like people in there. He’s never been in himself. Not once in eleven years.',
        'think',
      ),
      SP('It’s the only place up here with dust in it. I love it. Don’t tell him.'),
      N(
        'Your Nubbin climbs into your coat pocket for the walk. It doesn’t like the cold rails either.',
      ),
    ],
    [
      {
        domain: 'science',
        skill: 'frost forms when surfaces are below freezing',
        standard: '2-ESS2-3',
        kind: 'notice',
        after: 1,
        lines: [
          N(
            'Frost forms when a surface is colder than 0°C (32°F), the temperature at which water freezes.',
          ),
          N(
            'Water vapour in the air touches the cold surface and turns straight into tiny ice crystals.',
          ),
          N(
            'That usually happens on clear winter nights. Frost on a hot August day is very strange indeed.',
          ),
        ],
        parentNote:
          'Learned that frost forms on surfaces below freezing, and that summer frost is unusual.',
      },
      {
        domain: 'science',
        skill: 'copper wire carries electricity',
        standard: '4-PS3-2',
        kind: 'notice',
        after: 3,
        lines: [
          SP(
            'Copper’s my favourite. Electricity flows through it easily, so the lamp gets all the power it needs.',
          ),
          SP('No wire, no circuit. No circuit, no light. Simple.', 'happy'),
        ],
        parentNote: 'Learned that copper wire carries electricity to complete a circuit.',
      },
    ],
  ),
  // ------------------------------------------------ step 1 done: EVENING
  scene(
    's27-evening',
    [
      N(
        'The lantern shed smells of paraffin and warm wood. Dust turns slowly in the light from one small window.',
      ),
      N(
        'Under the window is Sparks’s cabinet, every drawer labelled in square capitals: FUSES, WICKS, SPARE.',
      ),
      N('You find the wire. When you stand up, there is a web across the corner of the window.'),
      N('It isn’t a new web. You just hadn’t looked. In the middle of it, very small, is a word.'),
      N('EVENING.'),
      N(
        'A grey-brown spider no bigger than a fingernail sits beside it. She lifts two front legs at you, politely.',
      ),
      N('It is eleven in the morning. To your own surprise, you lift a hand back.'),
    ],
    [
      {
        domain: 'science',
        skill: 'spiders have eight legs and two body parts, so they are not insects',
        standard: '4-LS1-1',
        kind: 'ask',
        after: 5,
        prompt: [N('Is the spider an insect? Count her legs before you decide.')],
        options: [
          {
            label: 'No. She has eight legs.',
            best: true,
            reply: [
              N(
                'Right. Insects have six legs and three body parts. Spiders have eight legs and two body parts.',
              ),
              N(
                'Spiders belong to a different group, the arachnids, along with scorpions and mites.',
              ),
            ],
          },
          {
            label: 'Yes. She’s small and creepy-crawly.',
            reply: [
              N('Lots of people think so! But count again: eight legs. Insects only have six.'),
              N('Spiders are arachnids, with eight legs and two body parts, not three.'),
            ],
          },
        ],
        parentNote: 'Learned how to tell a spider from an insect: eight legs and two body parts.',
      },
    ],
  ),
  // ------------------------------------------------ step 2: the row
  scene(
    's27-row',
    [
      N('Through the shed window, past the spider and her word, you can see the runners’ pens.'),
      N('One pen to each runner, in a straight row, every rail white with frost.'),
      N('Every runner is grey, and none of them is moving.'),
      N('At the very end of the row is the smallest. It is the only one facing the wrong way.'),
      N('It is just looking out, down the valley, the way you might watch weather coming.'),
      N('There is a number painted on its side in neat white paint. 9.'),
      N(
        'Outside, a lad with two buckets goes along the pens, whistling. He stops whistling at the end of the row.',
      ),
    ],
    [
      {
        domain: 'literacy',
        skill: 'reading how a character feels from what they do',
        standard: 'RL.3.3',
        kind: 'ask',
        after: 4,
        prompt: [N('The runner never makes a sound. What clues tell you how it might feel?')],
        options: [
          {
            label: 'It faces away from the others and stares towards somewhere else.',
            best: true,
            reply: [
              N(
                'Good reading. Facing away and staring into the distance often means lonely, or longing to be elsewhere.',
              ),
            ],
          },
          {
            label: 'Nothing. It hasn’t said anything.',
            reply: [
              N('It hasn’t said a word, true. But bodies talk too.'),
              N(
                'It faces the wrong way, alone, looking down the valley. That’s a clue it feels lonely.',
              ),
            ],
          },
        ],
        parentNote: 'Used actions and body language as clues to a character’s feelings.',
      },
    ],
  ),
  // ------------------------------------------------ step 2 done: Tam
  scene(
    's27-tam',
    [
      TA(
        'That’s Nine. Smallest we’ve got. Last every time. Not slow, exactly. It just doesn’t see the point.',
        'think',
      ),
      TA('I’m Tam. I do the buckets. I’m not meant to whistle. I forget.'),
      N(
        'He fills Nine’s trough. Nine doesn’t look round. Tam stands there a moment longer than the trough needs.',
      ),
      TA(
        'The Autumn Show’s at the first frost that isn’t his. Anything that doesn’t place goes over the pass.',
        'sad',
      ),
      TA(
        'A dealer comes for them. Mr Tull. He’s all right, as dealers go. They don’t come back, is all.',
      ),
      TA('Nine’s never placed. Not once.', 'sad'),
      N('In the shed window behind you, the spider has gone very still in the middle of her web.'),
    ],
    [
      {
        domain: 'literacy',
        skill: 'words with more than one meaning: place',
        standard: 'L.3.4',
        kind: 'ask',
        after: 3,
        prompt: [N('Tam says “anything that doesn’t place.” What does “place” mean here?')],
        options: [
          {
            label: 'Finish in the top places of a race, like first, second or third.',
            best: true,
            reply: [
              N('Yes. In racing, to “place” means to finish near the front and win a prize.'),
            ],
          },
          {
            label: 'Put something down somewhere.',
            reply: [
              N('That’s another true meaning: “place the cup on the table.”'),
              N(
                'But in a race, to “place” means to finish near the front. Same word, different job.',
              ),
            ],
          },
        ],
        parentNote: 'Used context to work out the racing meaning of “place”.',
      },
      {
        domain: 'sel',
        skill: 'noticing care in small actions',
        standard: 'CASEL: Social awareness',
        kind: 'notice',
        after: 5,
        lines: [
          N(
            'Tam lingers at the trough, and his whistle stops. He never says he cares. His actions say it for him.',
          ),
        ],
        parentNote: 'Noticed how small actions can show that someone cares.',
      },
    ],
  ),
  // ------------------------------------------------ step 3: WAIT
  scene(
    's27-wait',
    [
      N(
        'The next time you come up to the Circuit, you go to the shed first. You didn’t decide to.',
      ),
      N('EVENING has gone. In its place, in the middle of the web, is a new word.'),
      N('WAIT.'),
      N(
        'The spider sits at the edge of the web with her legs drawn in. She isn’t looking at you. She is thinking.',
      ),
      N(
        'You know that kind of thinking. You’ve watched someone in your family do it on a cottage step for hours.',
      ),
      N(
        'There is an upturned crate under the window. It is exactly the right height for sitting next to someone.',
      ),
    ],
    [
      {
        domain: 'literacy',
        skill: 'homophones: wait and weight',
        standard: 'L.3.4',
        kind: 'ask',
        after: 2,
        prompt: [N('Which word sounds exactly like WAIT, but means something different?')],
        options: [
          {
            label: 'Weight',
            best: true,
            reply: [
              N(
                'Yes. WAIT means stay a while. WEIGHT means how heavy something is. Same sound, different spelling.',
              ),
            ],
          },
          {
            label: 'Water',
            reply: [
              N(
                'Close in sound, but not the same. WEIGHT is the one: it sounds just like WAIT, but means how heavy.',
              ),
            ],
          },
          {
            label: 'White',
            reply: [
              N(
                'Listen: wait, white. Different middles! WEIGHT sounds exactly like WAIT. Words like that are homophones.',
              ),
            ],
          },
        ],
        parentNote: 'Found a homophone for “wait”.',
      },
      {
        domain: 'sel',
        skill: 'keeping someone company while they think',
        standard: 'CASEL: Relationship skills',
        kind: 'notice',
        after: 5,
        lines: [
          N(
            'Sometimes the most helpful thing isn’t a question or advice. It’s just sitting nearby, quietly, until they’re ready.',
          ),
        ],
        parentNote:
          'Thought about how quiet company can help someone who is thinking something through.',
      },
    ],
  ),
  // ------------------------------------------------ step 3 done: Spindle
  scene(
    's27-spindle',
    [
      N(
        'You sit, and the spider thinks, and the dust turns in the light. Your Nubbin falls asleep in your pocket.',
      ),
      N(
        'After a long time the door bangs open, and Sparks comes in to find out where her wire went.',
      ),
      SP('There you are. I’ve been holding a lamp together with my— oh.', 'shock'),
      N(
        'She looks at you, and the crate, and the web, and the word. She sits down on the floor without being asked.',
      ),
      SP(
        'She writes. Course she writes. She’s been learning off my drawer labels for years. Look at her, the little clerk.',
        'soft',
      ),
      SP(
        'She wants a name. Anyone who can spell wants a name. Spindle. All legs, and she winds things.',
      ),
      N(
        'The spider considers this. Then she lifts two legs, politely, once at Sparks and once at you.',
      ),
      SP('That’s a yes. I’m going to cry, and then I’m going to fix the start lamp.', 'happy'),
    ],
    [
      {
        domain: 'literacy',
        skill: 'where a name comes from: a spindle spins thread',
        standard: 'L.3.4',
        kind: 'notice',
        after: 5,
        lines: [
          SP(
            'A spindle’s a stick for spinning wool into thread. You twist it, and the thread winds round it.',
          ),
          SP('Thin, all legs, and spins thread. It fits her perfectly.', 'happy'),
        ],
        parentNote: 'Learned what a spindle is, and why it suits a spider.',
      },
      {
        domain: 'science',
        skill: 'spiders make silk in their bodies and spin it from spinnerets',
        standard: '4-LS1-1',
        kind: 'notice',
        after: 7,
        lines: [
          N(
            'A spider makes silk inside her body. It comes out of tiny nozzles at the back, called spinnerets.',
          ),
          N('It starts as a liquid and turns into a strong, stretchy thread as she pulls it out.'),
        ],
        parentNote:
          'Learned that spiders make silk inside their bodies and spin it from spinnerets.',
      },
    ],
  ),
  // ------------------------------------------------ step 4: labels
  scene(
    's27-labels',
    [
      N(
        'Over the next few days Spindle practises. FUSES appears in the web, and then WICKS, and then SPARE.',
      ),
      N('They are very good, and the S’s are beautiful. They are also no use to anybody.'),
      SP(
        'That’s the trouble with learning off a cabinet. She can tell you where everything is, but not how anyone feels.',
      ),
      N(
        'Spindle spins a short line, cuts it, then sits looking at the gap where a word ought to go.',
      ),
      N('She looks through the window at the end of the row, then back at you, and lifts one leg.'),
      SP('She wants words. Proper ones. And she can’t exactly go down the valley asking.', 'think'),
      SP('Ask around. Everyone’s got one word they’d save for something that mattered.'),
    ],
    [
      {
        domain: 'literacy',
        skill: 'words that show feelings',
        standard: 'RL.1.4',
        kind: 'ask',
        after: 2,
        prompt: [
          N('Which of these words tells you how someone feels, not where something is kept?'),
        ],
        options: [
          {
            label: 'FUSES',
            reply: [
              N(
                'FUSES is a label for a drawer. It names a thing. Try LONELY: that one names a feeling.',
              ),
            ],
          },
          {
            label: 'WICKS',
            reply: [N('WICKS names a thing in a drawer. LONELY is the feeling word.')],
          },
          {
            label: 'LONELY',
            best: true,
            reply: [
              N(
                'Yes. LONELY names a feeling. Labels tell you where things are. Feeling words tell you about people.',
              ),
            ],
          },
        ],
        parentNote: 'Told the difference between naming words and feeling words.',
      },
    ],
  ),
  // ------------------------------------------------ step 4 done: the words, and a name for Nine
  scene(
    's27-words',
    [
      ...WORD_HUNT,
      N('Then she does something new. She points at you, and then at the end of the row.'),
      SP(
        'She’s asking what it’s called. Nine isn’t a name. Nine’s a number. You can’t save a number.',
        'think',
      ),
      N(
        'The little grey runner is still looking down the valley. It has never had a name to look up at.',
      ),
    ],
    [
      {
        domain: 'maths',
        skill: 'subtract to compare word lengths',
        standard: '2.OA.A.1',
        kind: 'ask',
        after: 10,
        prompt: [
          N(
            '“Statistically above average” has 25 letters. SOMEBODY’S has 9 letters, plus its apostrophe.',
          ),
          N('How many more letters is Byte’s word?'),
        ],
        options: [
          {
            label: '16',
            best: true,
            reply: [N('Yes: 25 − 9 = 16. Sixteen extra letters is a lot of extra rail.')],
          },
          { label: '14', reply: [N('Nearly. Count up from 9 to 25: that’s 16. So 25 − 9 = 16.')] },
          {
            label: '34',
            reply: [N('That’s 25 + 9. We want the difference: 25 − 9 = 16 more letters.')],
          },
        ],
        parentNote: 'Subtracted to find the difference between two word lengths.',
      },
    ],
    [
      {
        id: 'tansy',
        label: '“Tansy.” Small, yellow, and very hard to get rid of.',
        set: { 's27-nine-name': 'Tansy' },
        then: [
          SP(
            'Tansy. Grows in the cracks where nobody planted it. Oh, that’s good. That’s really good.',
            'happy',
          ),
          N(
            'Spindle writes it once, small, in the corner of the window, to practise. She gets it right first time.',
          ),
        ],
      },
      {
        id: 'button',
        label: '“Button.” Because it’s small, and it holds things together.',
        set: { 's27-nine-name': 'Button' },
        then: [
          SP('Button. You’re soft. I like that. Never let anyone up here find out.', 'happy'),
          N(
            'Spindle writes it once, small, in the corner of the window, to practise. She gets it right first time.',
          ),
        ],
      },
      {
        id: 'own',
        label: 'Give it a name of your own.',
        set: { 's27-nine-name': '' },
        then: [
          N(
            'You think about it properly, the way you’d name anything you meant to keep. Then you say it out loud.',
          ),
          SP('…Yeah. That’s its name. It sounds like it was always waiting there.', 'soft'),
          N(
            'Spindle writes it once, small, in the corner of the window, to practise. She gets it right first time.',
          ),
        ],
      },
    ],
  ),
  // ------------------------------------------------ step 5: the first night
  scene(
    's27-first-night',
    [
      N('At dusk Spindle comes to the edge of the web and waits, quite plainly, to be carried.'),
      N('You hold out a matchbox. She walks into it the way a duchess steps into a carriage.'),
      N(
        'You carry her across the yard in the blue light to the last pen, and open the box on the rail.',
      ),
      N('The rail is so cold it smokes. Spindle steps out onto it without any fuss.'),
      N(
        'Inside the pen, the little grey runner watches the spider. It is the first thing you’ve seen it watch.',
      ),
      N(
        'You go home. It turns out to be the hardest part: going home and leaving someone to work.',
      ),
    ],
    [
      {
        domain: 'literacy',
        skill: 'similes compare using “like” or “as”',
        standard: 'L.4.5',
        kind: 'ask',
        after: 1,
        prompt: [
          N(
            '“She walks into it the way a duchess steps into a carriage.” What does that comparison tell you?',
          ),
        ],
        options: [
          {
            label: 'She is calm and dignified, as if she expects it.',
            best: true,
            reply: [
              N(
                'Yes. A duchess steps in grandly, as if the carriage were made for her. That’s Spindle exactly.',
              ),
            ],
          },
          {
            label: 'She is a real duchess.',
            reply: [
              N(
                'Ha! She isn’t really. The comparison tells us how she moves: grandly, calmly, as if it’s her right.',
              ),
            ],
          },
        ],
        parentNote: 'Worked out what a comparison tells us about a character.',
      },
      {
        domain: 'science',
        skill: 'garden spiders spin fresh webs and recycle silk',
        standard: '4-LS1-1',
        kind: 'notice',
        after: 3,
        lines: [
          N(
            'Many garden spiders build a fresh web often, sometimes every night. Some even eat the old silk, to reuse it.',
          ),
        ],
        parentNote:
          'Learned that many garden spiders rebuild their webs often and recycle the silk.',
      },
    ],
  ),
  // ------------------------------------------------ step 5 done: the first word
  scene(
    's27-first-word',
    [
      N(
        'First light. Your Nubbin keeps watch with you from your pocket, nose out. Your breath hangs in the air.',
      ),
      N(
        'The Circuit’s summer frost has come down in the night, as it always does. Every rail is white.',
      ),
      N(
        'On the rail of the last pen, every thread of Spindle’s web has caught the frost. It stands out white as chalk.',
      ),
      N('It isn’t a number. It’s a name, in letters the height of your hand: its name.'),
      N(
        'Fern has come up the valley with you. She reads it out first, loudly, then again, louder.',
      ),
      FE('That’s its NAME. Look. It’s got a NAME. Everybody, it’s got a—', 'happy'),
      N(
        'Inside the pen, the little grey runner turns round. For the first time, it is facing the right way.',
      ),
      N('Corvin’s runners have numbers. This one has a name, and now everybody knows it.'),
    ],
    [
      {
        domain: 'science',
        skill: 'why frost shows up on thin threads',
        standard: '2-ESS2-3',
        kind: 'notice',
        after: 2,
        lines: [
          N('Thin things like silk threads lose their heat quickly, so they get cold fast.'),
          N(
            'Ice crystals grow along each thread. The web, nearly invisible yesterday, is suddenly as bright as a chalk drawing.',
          ),
        ],
        parentNote: 'Learned why frost gathers on thin threads and makes a web easy to see.',
      },
      {
        domain: 'social-studies',
        skill: 'a name is a sign of respect',
        standard: 'D2.Civ.8.K-2',
        kind: 'notice',
        after: 7,
        lines: [
          N(
            'A number tells you which one. A name tells you who. That’s why people get names, and parcels get numbers.',
          ),
        ],
        parentNote: 'Thought about the difference between a number and a name.',
      },
    ],
  ),
  // ------------------------------------------------ step 6: frost does odd things
  scene(
    's27-odd-things',
    [
      N(
        'Corvin comes out of the house at seven, as he always does, with his ledger under his arm.',
      ),
      N('He stops at the end of the row. He looks at the rail for a long time.'),
      C('Frost does odd things.', 'think'),
      N('He writes something in the ledger, and goes in.'),
      N(
        'By noon there are twelve people at the Circuit fence who have never come up the valley before.',
      ),
      N(
        'By three o’clock, there are twice as many. A man with a bicycle says he was only passing, and stays all afternoon.',
      ),
      N(
        'The frost is long gone from the rail. They have come to look at a small grey runner whose name they know.',
      ),
      N('Corvin comes out again and looks at the fence. Then he looks across the yard, at you.'),
    ],
    [
      {
        domain: 'literacy',
        skill: 'what a character says versus what he means',
        standard: 'RL.3.3',
        kind: 'notice',
        after: 2,
        lines: [
          N(
            'Frost can’t write names. Corvin knows that. So why say it? Sometimes people say something easy so they don’t have to say something hard.',
          ),
        ],
        parentNote: 'Thought about why a character might say something he doesn’t really believe.',
      },
      {
        domain: 'maths',
        skill: 'doubling: multiply by 2',
        standard: '3.OA.A.3',
        kind: 'ask',
        after: 5,
        prompt: [
          N('Twelve people at noon. Twice as many by three o’clock. How many people is that?'),
        ],
        options: [
          {
            label: '24',
            best: true,
            reply: [N('Yes: 12 × 2 = 24. That’s a lot of people for a quiet Circuit.')],
          },
          {
            label: '14',
            reply: [N('That’s 12 + 2. “Twice as many” means two lots of 12: 12 × 2 = 24.')],
          },
          { label: '22', reply: [N('Close! Two lots of 12: 12 + 12 = 24.')] },
        ],
        parentNote: 'Doubled 12 to get 24.',
      },
    ],
  ),
  // ------------------------------------------------ step 6 done: was it you? (think question)
  scene(
    's27-was-it-you',
    [
      N('He walks over without hurrying. His hands are bare, and blue at the knuckles.'),
      C(
        'Hazel’s heir. A straight question, and I’d like a straight answer. She always gave me one.',
      ),
      C(
        'Somebody wrote on my rail in the night. I don’t care for things written on my rails. Was it you?',
      ),
      N(
        'Behind you, through the shed window, you can feel a very small person holding very still.',
      ),
      N('Corvin waits. He is the kind of man who can wait a long time for an answer.'),
      N(
        'You could protect her with a fib. You could tell the truth, sideways. Or you could say nothing at all.',
      ),
    ],
    [
      {
        domain: 'sel',
        skill: 'thinking about honesty and protecting a friend',
        standard: 'CASEL: Responsible decision-making',
        kind: 'ask',
        after: 5,
        prompt: [
          N('Is it ever right to say something untrue to protect a friend? What do you think?'),
        ],
        options: [
          {
            label: 'Yes, if it keeps someone safe from harm.',
            reply: [
              N('That’s a fair answer. Lots of people believe protecting someone matters most.'),
              N(
                'The cost is that a fib can grow, and the person you fibbed to may stop trusting you.',
              ),
            ],
          },
          {
            label: 'No. The truth is always best.',
            reply: [
              N('That’s a fair answer too. Honesty builds trust.'),
              N(
                'But the truth can sometimes put someone at risk. That’s why this is a hard choice.',
              ),
            ],
          },
          {
            label: 'It depends who is asking, and why.',
            reply: [
              N('A thoughtful answer. Wise people ask: who could get hurt? What will happen next?'),
              N('Corvin is asking. What do you think he would do?'),
            ],
          },
        ],
        parentNote:
          'Thought about whether a kind fib is ever right, and what honesty costs and gives.',
      },
    ],
    [
      {
        id: 'shield',
        label: '“Yes. It was me.”',
        set: { 's27-truth': 'shield' },
        then: [
          Y('Yes. It was me.'),
          C(
            'In frost. At four in the morning. In letters a hand high, in a spider’s silk.',
            'think',
          ),
          Y('I’ve got very steady hands.'),
          N(
            'Corvin looks at you for a long moment, the way he looks at a runner that started late.',
          ),
          C(
            'Hazel used to lie like that. Badly, and always for somebody else. I’ll be watching my rails, then.',
          ),
          N(
            'You kept Spindle safe. But Corvin will be watching you now, and he knows you didn’t tell the truth.',
          ),
        ],
      },
      {
        id: 'frost',
        label: '“Ask the frost.”',
        set: { 's27-truth': 'frost' },
        then: [
          Y('Ask the frost. It’s yours, isn’t it? It’s been on your rails all summer.'),
          N('Corvin’s hand goes to his breast pocket, stops halfway, and comes down again.'),
          C('…Frost doesn’t spell.', 'think'),
          Y('This frost does.'),
          N(
            'He looks past you, at the shed he has never once been into. He doesn’t say anything else.',
          ),
        ],
      },
      {
        id: 'silent',
        label: 'Say nothing. Just wait.',
        set: { 's27-truth': 'silent' },
        then: [
          N(
            'You say nothing, and Corvin waits. You learned waiting from better people than him, and he can tell.',
          ),
          N(
            'After a while he stops looking at you, and looks past you, at the shed window, for a long time.',
          ),
          C('Hm.', 'think'),
          N('He goes back to the house. This time he doesn’t write anything in the ledger.'),
        ],
      },
    ],
  ),
  // ------------------------------------------------ step 7: the second night
  scene(
    's27-second-night',
    [
      N(
        'Spindle has been working on the second word all day. You can tell from the web: well used, a little ragged.',
      ),
      N('She points one leg, quite firmly, past the pens and out at the finishing straight.'),
      SP(
        'The main rail? With the stands right there? She’s not shy, is she. I love her. I’m terrified.',
        'shock',
      ),
      N('In the house, a lamp is lit in an upstairs window. It stays lit.'),
      N(
        'At dusk, Spindle walks into her matchbox. You put it in your inside pocket, against your shirt, where it’s warm.',
      ),
      N(
        'You cross the yard to the straight in the last of the light, as if you were only going for a walk.',
      ),
    ],
    [
      {
        domain: 'science',
        skill: 'spiders take on the temperature around them',
        standard: '4-LS1-1',
        kind: 'notice',
        after: 4,
        lines: [
          N(
            'A spider can’t make its own body heat the way you do. It warms up or cools down with the air around it.',
          ),
          N('That’s why Spindle rides next to you. Your body heat keeps her moving.'),
        ],
        parentNote: 'Learned that spiders take their temperature from their surroundings.',
      },
    ],
  ),
  // ------------------------------------------------ step 7 done: SOMEBODY’S
  scene(
    's27-somebodys',
    [
      N('Dawn. All along the main rail, opposite the empty stands, in white: SOMEBODY’S.'),
      N('Fern’s word. Fern, at the fence, has both hands over her mouth.'),
      N(
        'That morning a cart comes over the pass a week early. Mr Tull gets down and walks along the rail, reading it.',
      ),
      TU(
        'Mr Vale. I heard you had a runner with a name. I didn’t think you held with names.',
        'think',
      ),
      C('I don’t. It’s the frost. It does odd things up here.'),
      TU('So I see. It’s a lot of odd, for one rail.'),
      N(
        'He doesn’t stay. He climbs back onto his cart and frowns all the way up the pass. He looks uneasy.',
      ),
      N(
        'By noon, the little grey runner has been moved to a pen behind the house, where the public can’t see.',
      ),
    ],
    [
      {
        domain: 'literacy',
        skill: 'compound words and the apostrophe for belonging',
        standard: 'L.2.4',
        kind: 'notice',
        after: 1,
        lines: [
          N('SOMEBODY is a compound word: SOME + BODY, two words joined to make a new one.'),
          N(
            'The apostrophe and S in SOMEBODY’S show belonging. It means “this one belongs to somebody”.',
          ),
        ],
        parentNote:
          'Found the two words inside a compound word, and learned how an apostrophe shows belonging.',
      },
    ],
  ),
  // ------------------------------------------------ step 8: the toolbox
  scene(
    's27-toolbox',
    [
      SP(
        'Behind the house? That’s the coldest pen up here. The tap’s frozen in August. He’s hiding it.',
        'angry',
      ),
      SP('Right. Nobody looks twice at a toolbox. I’ve walked into the judges’ tent with one.'),
      N(
        'She empties the top tray and lines it with a clean rag, the first clean rag you’ve ever seen her own.',
      ),
      N('Spindle walks in and settles between a spool of fuse wire and a very small spanner.'),
      N(
        'You go past the house at dusk with the toolbox swinging. The lamp in the upstairs window is still lit.',
      ),
      N('Nobody stops you. Sparks was right: nobody looks twice at a toolbox.'),
    ],
    [
      {
        domain: 'science',
        skill: 'sunlight warms the ground; shade stays cold',
        standard: 'K-PS3-1',
        kind: 'ask',
        after: 0,
        prompt: [N('Why is the pen behind the house the coldest place at the Circuit?')],
        options: [
          {
            label: 'The house shades it, so sunlight can’t warm it.',
            best: true,
            reply: [
              N(
                'Yes. Sunlight warms whatever it lands on. A spot in the shade all day stays cold.',
              ),
            ],
          },
          {
            label: 'Because it’s further from the stands.',
            reply: [
              N(
                'Distance from the stands doesn’t matter. It’s the shade: the house blocks the sunlight that would warm it.',
              ),
            ],
          },
        ],
        parentNote: 'Explained why shaded places stay colder than sunny ones.',
      },
    ],
  ),
  // ------------------------------------------------ step 8 done: WARM
  scene(
    's27-warm',
    [
      N(
        'Behind the house, the frost is thickest. The inside pen’s rail is so cold your breath crackles on it.',
      ),
      N('At first light, across it, the third word: WARM.'),
      N(
        'Corvin comes round the corner of the house in his shirtsleeves, as if he had been waiting up.',
      ),
      N('He stands at the rail. Then he lays his bare hand flat on the word.'),
      N('You wait for the frost to melt under his palm. It doesn’t. Not a single letter.'),
      N(
        'He takes his hand away and looks at it. Then he touches his breast pocket, once, and goes back inside.',
      ),
    ],
    [
      {
        domain: 'science',
        skill: 'heat melts ice, and cold freezes water again',
        standard: '2-PS1-4',
        kind: 'ask',
        after: 3,
        prompt: [
          N(
            'A person’s hand is much warmer than 0°C (32°F). What should happen to frost under a warm hand?',
          ),
        ],
        options: [
          {
            label: 'It should melt into water.',
            best: true,
            reply: [
              N(
                'Yes. Heat melts ice into water, and cold can freeze it again. That change can go both ways.',
              ),
              N(
                'So why doesn’t this frost melt? The story doesn’t say. Keep watching Corvin’s hands.',
              ),
            ],
          },
          {
            label: 'It should grow thicker.',
            reply: [
              N('Only cold makes frost grow. Warmth melts it into water.'),
              N('So it should melt. It doesn’t. The story is giving you a clue about Corvin.'),
            ],
          },
        ],
        parentNote: 'Predicted that warmth melts ice, and noticed a story clue when it didn’t.',
      },
    ],
  ),
  // ------------------------------------------------ step 9: getting ready
  scene(
    's27-ready',
    [
      N(
        'The first autumn dawn. The frost in the Grove is real frost now, and the leaves have started to let go.',
      ),
      N(
        'Clover comes up the valley with you and helps you brush the little grey runner through the rail.',
      ),
      CL(
        'Gently. Grey ones are thin-skinned. Long strokes, and stop when it leans in. That means more.',
        'soft',
      ),
      N('It leans in. Clover stops brushing and lets it.'),
      N(
        'Byte is at the rail. His newest stopwatch has a tiny web across the strap, and in it, one word: ABOVE.',
      ),
      BY('It isn’t accurate. There’s no data. I’m keeping it.', 'think'),
      BY(
        'I’ve worked out its chances of placing. To three decimal places. I’m not going to tell you the number.',
        'sad',
      ),
      N(
        'Spindle will not be left in the shed. She makes this very clear by walking up your sleeve.',
      ),
      N(
        'In the end she rides in the brim of your hat, which is the best seat at the Circuit, and she knows it.',
      ),
    ],
    [
      {
        domain: 'science',
        skill: 'in autumn the days get shorter and leaves fall',
        standard: '1-ESS1-2',
        kind: 'notice',
        after: 0,
        lines: [
          N(
            'After midsummer, each day has a little less daylight. By autumn the nights are noticeably longer.',
          ),
          N(
            'Many trees respond by dropping their leaves to rest through winter. Those trees are called deciduous.',
          ),
        ],
        parentNote: 'Learned that days shorten in autumn and deciduous trees drop their leaves.',
      },
      {
        domain: 'sel',
        skill: 'reading an animal’s signals: stopping when it wants more or less',
        standard: 'CASEL: Social awareness',
        kind: 'notice',
        after: 3,
        lines: [
          CL(
            'Animals can’t say yes or no in words. So we watch. Leaning in means yes. Pulling away means stop.',
            'soft',
          ),
        ],
        parentNote: 'Learned to read an animal’s body language and respect it.',
      },
    ],
  ),
  // ------------------------------------------------ step 9 done: the Autumn Show
  scene(
    's27-show',
    [
      N(
        'The Autumn Show. Flags, a brass band of three, and more people at the fence than the Circuit has ever had.',
      ),
      N(
        'Most of them aren’t here for the racing. They are here to see a small grey runner with a name.',
      ),
      N(
        'Eight runners line up. Corvin’s champion, the big grey Number One, wins as it always does.',
      ),
      N(
        'The little grey runner comes last. It spends the whole race looking at the people who came.',
      ),
      N(
        'It doesn’t place. The judge pins three rosettes on three grey runners who don’t look down at them.',
      ),
      N(
        'Mr Tull’s cart waits by the gate. He is eating a sandwich, and looks as if he wishes he weren’t there.',
      ),
      N(
        'In your hat brim, Spindle sits very still. Then she taps the brim twice, which you’ve learned means: tonight.',
      ),
    ],
    [
      {
        domain: 'maths',
        skill: 'subtraction within 20',
        standard: '1.OA.A.1',
        kind: 'ask',
        after: 4,
        prompt: [N('Eight runners raced. Three won rosettes. How many runners didn’t place?')],
        options: [
          {
            label: '5',
            best: true,
            reply: [N('Yes: 8 − 3 = 5. Five runners, and Mr Tull is waiting for all of them.')],
          },
          { label: '11', reply: [N('That’s 8 + 3. We take the winners away: 8 − 3 = 5.')] },
          { label: '4', reply: [N('Count down from 8: seven, six, five. 8 − 3 = 5.')] },
        ],
        parentNote: 'Subtracted to find how many runners did not place.',
      },
    ],
  ),
  // ------------------------------------------------ step 10: HOME, written all night
  scene(
    's27-home-word',
    [
      N(
        'That night Spindle doesn’t walk into the matchbox. She walks onto your hand, and stays there.',
      ),
      N(
        'You carry her to the very start of the finishing straight. She looks down the whole length of the rail.',
      ),
      N(
        'Then she starts: not one letter, but one stroke of one letter, from the top rail to the bottom.',
      ),
      N(
        'Your watch says nine o’clock. It is going to be the biggest word she has ever written. It will take all night.',
      ),
      N(
        'You hold the lantern low, so she can see, and walk beside her down the rail, a step at a time.',
      ),
      N('Your Nubbin falls asleep in your pocket, wakes, and sleeps again. The lantern hisses.'),
    ],
    [
      {
        domain: 'science',
        skill: 'we see things when light bounces off them into our eyes',
        standard: '1-PS4-2',
        kind: 'notice',
        after: 4,
        lines: [
          N(
            'In total darkness, nobody can see anything. Light has to hit an object and bounce into your eyes.',
          ),
          N('Holding the lantern low puts the light right on the rail, where the work is.'),
        ],
        parentNote: 'Learned that we see objects when light reflects off them into our eyes.',
      },
    ],
  ),
  // ------------------------------------------------ step 10 done: midnight (think question)
  scene(
    's27-midnight',
    [
      N(
        'At midnight the house door opens. You shutter the lantern and step back into the shed doorway, out of sight.',
      ),
      N(
        'Corvin comes down the straight in his coat, with a lamp. He is looking for something, and he finds it.',
      ),
      N(
        'Halfway along the rail, in the lamplight, a grey-brown spider is halfway through a letter.',
      ),
      N('He stands over her for a long time. Then he lifts his hand, the cold one, over the web.'),
      N(
        'He holds it there, and you don’t breathe. Spindle doesn’t stop working, not for a single thread.',
      ),
      N('He lowers his hand.'),
      C('Spell it right, then.', 'soft'),
      N(
        'He goes back to the house, and the door shuts quietly. It is the first right thing you have seen him do.',
      ),
      N(
        'You come out, open the lantern, and hold it low again. She works on until nearly dawn, about five o’clock.',
      ),
    ],
    [
      {
        domain: 'literacy',
        skill: 'thinking about a character’s motive',
        standard: 'RL.3.3',
        kind: 'ask',
        after: 7,
        prompt: [N('Corvin could have wiped the web away. Why do you think he lowered his hand?')],
        options: [
          {
            label: 'He was moved that she kept working, even with him there.',
            reply: [N('That’s a fair reading. Brave, patient work can change how people feel.')],
          },
          {
            label: 'He was embarrassed. The whole valley was watching.',
            reply: [
              N(
                'That’s fair too. Sometimes people do right because others are watching, and then find it was right anyway.',
              ),
            ],
          },
          {
            label: 'Part of him wanted the runner to have a name.',
            reply: [
              N(
                'Interesting. People can be lonely and grumpy outside, and still want good things inside.',
              ),
            ],
          },
        ],
        parentNote: 'Thought about the reasons behind a character’s change of heart.',
      },
      {
        domain: 'maths',
        skill: 'time intervals in hours',
        standard: '3.MD.A.1',
        kind: 'ask',
        after: 8,
        prompt: [
          N(
            'Spindle started at nine o’clock and finished at about five in the morning. How long did she work?',
          ),
        ],
        options: [
          {
            label: '8 hours',
            best: true,
            reply: [N('Yes. Nine to midnight is 3 hours, midnight to five is 5 more. 3 + 5 = 8.')],
          },
          {
            label: '4 hours',
            reply: [
              N(
                'That’s 9 − 5, but clocks go round! Nine to midnight is 3, midnight to five is 5. 8 hours.',
              ),
            ],
          },
          {
            label: '14 hours',
            reply: [
              N('That’s 9 + 5. Count round the clock: 3 hours to midnight, then 5 more. 8 hours.'),
            ],
          },
        ],
        parentNote: 'Worked out a time interval across midnight.',
      },
    ],
  ),
  // ------------------------------------------------ step 11: let go (runner path)
  scene(
    's27-letgo',
    [
      ...MORNING,
      N(
        'Tam is at the pen behind the house. He opens his mouth to say “Nine”, stops, and says its name instead.',
      ),
      N('He says it carefully, like a word in another language. Corvin pretends not to hear.'),
      C('Take it. It’s no use to me famous.'),
      N('He says it to the rail, not to you, and goes back to the house without looking round.'),
      N(
        'The little grey runner looks at the open pen for a long time. Then it follows you, three steps behind.',
      ),
    ],
    [
      {
        domain: 'literacy',
        skill: 'finding a story’s theme',
        standard: 'RL.4.2',
        kind: 'ask',
        after: 6,
        prompt: [
          N('Mr Tull won’t take a runner people ask after. What is the story saying about names?'),
        ],
        options: [
          {
            label: 'When people know your name, they look out for you.',
            best: true,
            reply: [
              N(
                'Yes. That’s a theme: being known and remembered keeps us safe. Four words saved a runner.',
              ),
            ],
          },
          {
            label: 'Names don’t matter. Only winning does.',
            reply: [
              N(
                'The runner never won anything. It was saved anyway, because people knew its name.',
              ),
              N(
                'So the story seems to say the opposite: names, and being remembered, matter a great deal.',
              ),
            ],
          },
        ],
        parentNote: 'Worked out a theme: being known and remembered matters.',
      },
    ],
  ),
  // ------------------------------------------------ step 11 done: the Grove gate
  scene(
    's27-gate',
    [
      N('At the Grove gate you lift and push. The little grey runner stops on the threshold.'),
      N('It looks at the gate as if a gate is a thing that might shut on it.'),
      N('Your Nubbin hops out of your pocket, goes through, and sits on the far side, waiting.'),
      N('You don’t pull. You don’t call. You just wait too.'),
      N(
        'After a long while, the runner comes through. It sits down by the gatepost and looks at everything.',
      ),
      N('Nothing at the Circuit was ever its own. Here, slowly, something might be.'),
    ],
    [
      {
        domain: 'sel',
        skill: 'patience with someone who is frightened of a new place',
        standard: 'CASEL: Social awareness',
        kind: 'notice',
        after: 3,
        lines: [
          N(
            'Pulling someone through a door they fear can make the fear bigger. Waiting lets them choose to be brave.',
          ),
        ],
        parentNote: 'Learned how patience helps someone face something new.',
      },
    ],
  ),
  // ------------------------------------------------ step 12: the egg sac
  scene(
    's27-egg-sac',
    [
      N(
        'Autumn comes on properly. At the Circuit, the shed window has fogged at the corners, and the swallows have gone.',
      ),
      N('Spindle is slower now. She sits in the sun on the sill more than she sits in her web.'),
      N(
        'High in the rafters, where the roof meets the wall, is something new: a little round sac of silk, the colour of straw.',
      ),
      N('It is the best thing she has ever made. You can see that from the floor.'),
      SP(
        'Her eggs. Hundreds, likely. They sleep in there all winter and come out in the spring.',
        'soft',
      ),
      SP('But it’ll freeze up there, come winter. And she can’t carry it. Not now.'),
      N('In the web, very small, a new word: PLEASE.'),
    ],
    [
      {
        domain: 'science',
        skill: 'the life cycle of a garden spider',
        standard: '3-LS1-1',
        kind: 'notice',
        after: 4,
        lines: [
          N(
            'A garden spider’s life cycle: egg, then spiderling, then adult. Spiderlings shed their skin several times as they grow.',
          ),
          N(
            'In autumn, the mother lays hundreds of eggs and wraps them in a silk egg sac to protect them through the winter.',
          ),
        ],
        parentNote: 'Learned the stages of a spider’s life cycle and what an egg sac is for.',
      },
    ],
  ),
  // ------------------------------------------------ step 12 done: your Nubbin climbs
  scene(
    's27-carry',
    [
      ...LADDER,
      N(
        'There are twelve rungs, each 25 centimetres apart. Your Nubbin counts every one with its feet.',
      ),
      ...LADDER_DOWN,
    ],
    [
      {
        domain: 'maths',
        skill: 'multiply and convert centimetres to metres',
        standard: '4.MD.A.1',
        kind: 'ask',
        after: 3,
        prompt: [N('Twelve rungs, 25 centimetres apart. About how high does your Nubbin climb?')],
        options: [
          {
            label: '3 metres',
            best: true,
            reply: [
              N('Yes: 12 × 25 = 300 centimetres, and 100 centimetres make a metre. 300 cm = 3 m.'),
            ],
          },
          {
            label: '37 centimetres',
            reply: [
              N('That’s 12 + 25. We need twelve lots of 25: 300 centimetres, which is 3 metres.'),
            ],
          },
          {
            label: '30 metres',
            reply: [
              N('That would be taller than a house! 12 × 25 = 300 centimetres, which is 3 metres.'),
            ],
          },
        ],
        parentNote: 'Multiplied to find a height, then converted centimetres to metres.',
      },
    ],
  ),
  // ------------------------------------------------ step 13: the last evening
  scene(
    's27-last-evening',
    [
      N('The next evening you go up to the shed with nothing to fetch and nowhere to be.'),
      N(
        'Spindle is on the sill in the last of the sun, with her legs drawn in. She lifts one to say hello.',
      ),
      N(
        'You sit on the crate. The light goes orange, then gold, then the colour of the inside of a shell.',
      ),
      N(
        'You want to say something. You think of everything she did with words, and how few you have.',
      ),
      N(
        'Hazel would know what to say. She would also tell you: say the true thing, and say it plainly.',
      ),
      Y('I’m so glad it was you in the window, Spindle.', 'soft'),
      N(
        'Spindle is quiet for a long time. Then she climbs, very slowly, to the corner of her web.',
      ),
      N('She writes one more word, the smallest she has ever written. It is just for you.'),
      N('WELL.'),
    ],
    [
      {
        domain: 'sel',
        skill: 'saying important feelings plainly',
        standard: 'CASEL: Relationship skills',
        kind: 'notice',
        after: 5,
        lines: [
          N(
            'When something matters, simple words are often the strongest. You don’t need a speech. One true sentence will do.',
          ),
        ],
        parentNote: 'Thought about telling someone plainly what they mean to us.',
      },
      {
        domain: 'literacy',
        skill: 'a word with more than one meaning: well',
        standard: 'L.3.4',
        kind: 'notice',
        after: 8,
        lines: [
          N('WELL can mean healthy. It can mean “done properly”. It can also mean “all is good”.'),
          N('Spindle chose a word that means all three at once.'),
        ],
        parentNote: 'Explored the different meanings of “well”.',
      },
    ],
  ),
  // ------------------------------------------------ step 13 done: walking home
  scene(
    's27-walk-home',
    [
      N('You walk home in the dark with your Nubbin asleep in your pocket.'),
      N(
        'You don’t look back at the window. You think she would prefer it that way. She was always very polite.',
      ),
      N('The lane is cold. The first stars are out over the valley.'),
      N('You feel full and empty at the same time, which you didn’t know a person could.'),
      N('Your Nubbin shifts in its sleep and presses against your side. It helps, a bit.'),
      N('You keep walking until you see the Grove gate.'),
    ],
    [
      {
        domain: 'sel',
        skill: 'recognising mixed feelings',
        standard: 'CASEL: Self-awareness',
        kind: 'notice',
        after: 3,
        lines: [
          N(
            'It’s normal to feel two opposite things at once: grateful and sad, happy and worried. Naming both helps.',
          ),
        ],
        parentNote: 'Learned that mixed feelings are normal, and that naming them helps.',
      },
    ],
  ),
  // ------------------------------------------------ step 14: the empty web (Spindle has died)
  scene(
    's27-empty-web',
    [
      N('In the morning, the frost is on the rails as usual. You go to the shed first.'),
      N(
        'The web in the window is still there. The sun comes through it and lays a pattern on the bench.',
      ),
      N('It is empty. The last word is still in the corner, very small: WELL.'),
      N(
        'Spindle has died. She was old, for a spider, and her body stopped working. It won’t start again.',
      ),
      N(
        'Your Nubbin climbs out of your pocket, sits on the bench under the web, and looks up at it.',
      ),
      N('It doesn’t do anything. It just sits next to it, the way you sat next to her.'),
      N('You stand in the doorway for a while. Then you go to find Sparks.'),
    ],
    [
      {
        domain: 'science',
        skill: 'living things have a life span; garden spiders live about a year',
        standard: '3-LS1-1',
        kind: 'notice',
        after: 3,
        lines: [
          N(
            'Garden spiders usually live about a year. They hatch in spring, grow all summer, and lay eggs in autumn.',
          ),
          N(
            'Spindle lived a whole spider life, and finished her best work first. Her eggs are safe for the winter.',
          ),
        ],
        parentNote:
          'Learned, gently, about a garden spider’s life span, and that Spindle’s eggs carry her life on.',
      },
    ],
  ),
  // ------------------------------------------------ step 14 done: leave it
  scene(
    's27-leave-it',
    [
      N('Sparks doesn’t say anything for a long time, which for Sparks is a very long time.'),
      SP('Leave it.', 'sad'),
      SP('The web. Leave it up. Nobody sweeps that window. Nobody touches it. Not ever.', 'sad'),
      N(
        'She puts an arm round you. Neither of you says anything for a while, and that is all right.',
      ),
      SP('We’ll tell people about her. Every word. That’s how she stays.', 'soft'),
      N(
        'Nobody does sweep it. It stays in the corner of the shed window, empty, catching the light.',
      ),
      N('Corvin never has it swept.'),
    ],
    [
      {
        domain: 'sel',
        skill: 'grief: what helps when someone dies',
        standard: 'CASEL: Self-awareness',
        kind: 'ask',
        after: 4,
        prompt: [N('Sparks wants to keep the web and tell Spindle’s story. Why might that help?')],
        options: [
          {
            label: 'Remembering together keeps her part of our lives.',
            best: true,
            reply: [
              N('Yes. Grief is love with nowhere to go. Remembering together gives it somewhere.'),
            ],
          },
          {
            label: 'It doesn’t help. It’s better to forget.',
            reply: [
              N('Some people try to forget, because remembering hurts.'),
              N(
                'But many find that sharing memories helps the hurt soften. Spindle is remembered, so part of her stays.',
              ),
            ],
          },
        ],
        parentNote: 'Talked about grief and how remembering together helps.',
      },
    ],
  ),
];

const S27_COMPLETE: EduScene = scene(
  's27-complete',
  [
    N(
      'A week later Sparks comes down the valley with something in her fist. She opens it on your kitchen table.',
    ),
    N('It is a drawer label off her old cabinet, in her square capitals: SPARE.'),
    SP('She learned her S’s off that one. Every S she ever wrote. Somebody’s. That one.', 'soft'),
    N(
      'Fern has sewn SOMEBODY’S onto strips of ribbon, a bit crooked, and given one to everybody who stood at the fence.',
    ),
    N(
      'Pixel has made a pane for the Grove lantern shed window. On frosty mornings, a name comes up on it in white.',
    ),
    N(
      'Up at the Circuit, Tam has started calling the runners by names. He makes them up, and some are terrible.',
    ),
    N(
      'Corvin pretends not to notice. Once, passing the pens, he is heard to say “Morning, Gravel” to the third from the end.',
    ),
  ],
  [
    {
      domain: 'social-studies',
      skill: 'how one small act can change the rules of a place',
      standard: 'D2.Civ.8.K-2',
      kind: 'ask',
      after: 6,
      prompt: [N('Nobody made a new rule at the Circuit. So why does Tam now use names?')],
      options: [
        {
          label: 'Spindle’s words showed everyone the runners mattered.',
          best: true,
          reply: [
            N(
              'Yes. Sometimes a place changes because people’s hearts change first, and the habits follow.',
            ),
          ],
        },
        {
          label: 'Corvin ordered him to.',
          reply: [
            N('Corvin only pretends not to notice! Nobody ordered it.'),
            N(
              'Spindle’s words changed how people saw the runners, and the habit of names followed.',
            ),
          ],
        },
      ],
      parentNote: 'Thought about how respect can spread and change the way a place works.',
    },
  ],
);

// ================================================================== variants
export const EDU_S27_READER_VARIANTS: EduScene[] = [
  // sold path: replaces s27-row
  scene(
    's27-row-sold',
    [
      N('Through the shed window, past the spider and her word, you can see the runners’ pens.'),
      N(
        'One pen to each runner, in a straight row, every rail white with frost. None of the grey runners is moving.',
      ),
      N(
        'At the very end of the row is one facing the wrong way. It is looking down the valley, towards the Grove.',
      ),
      N('You know the shape of it. You knew it before you knew you were looking.'),
      N(
        'It was yours, and you sold it in the spring for two hundred Shells. There is a number painted on its side: 9.',
      ),
      N(
        'Outside, a lad with two buckets goes along the pens, whistling. He stops whistling at the end of the row.',
      ),
    ],
    [
      {
        domain: 'sel',
        skill: 'regret: feeling sorry about a past choice',
        standard: 'CASEL: Self-awareness',
        kind: 'notice',
        after: 4,
        lines: [
          N(
            'Regret is the heavy feeling of wishing you had chosen differently. It hurts, but it can also show you what matters.',
          ),
          N('You can’t change the spring. You might still be able to change what happens next.'),
        ],
        parentNote: 'Talked about regret, and how it can point us towards putting things right.',
      },
    ],
  ),
  // sold path: replaces s27-words
  scene(
    's27-words-sold',
    [
      ...WORD_HUNT,
      N('Then she points at you, and then at the end of the row, and waits.'),
      SP('She wants to know what it’s called. Its real name. Not the paint.', 'think'),
      N(
        'You tell her the name you gave it the day it hatched. It is strange to say it out loud up here.',
      ),
      N(
        'Spindle writes it once, small, in the corner of the window, to practise. She gets it right first time.',
      ),
    ],
    [
      {
        domain: 'literacy',
        skill: 'alphabetical order by first and second letters',
        kind: 'do',
        after: 11,
        check: 'edu:order:words:alphabet',
        lines: [
          SP(
            'Help me file these words the way I file my drawers: alphabetical order. HOME, SOMEBODY’S, STATISTICALLY, WARM.',
            'think',
          ),
          SP('Two start with S, so you look at the second letter. O comes before T.', 'happy'),
        ],
        parentNote:
          'Put words in alphabetical order, using the second letter when the first matches.',
      },
    ],
  ),
  // truth = shield: replaces s27-midnight
  scene(
    's27-midnight-shield',
    [
      N('At midnight a lamp comes on in the upstairs window of the house, and stays on.'),
      N(
        'Corvin is sitting at the window, watching you: Hazel’s heir, with a lantern, at his rail, in the middle of the night.',
      ),
      N(
        'He watches you all night. He watches your hands, and the lantern, and the way you walk the rail a step at a time.',
      ),
      N(
        'He never once looks at the rail itself. He thinks he knows who is writing on it. He is wrong, and you let him be.',
      ),
      N(
        'Spindle works on below the lantern, a thread at a time, and Corvin never sees her. Up here, she is your secret.',
      ),
      N(
        'At five o’clock the upstairs lamp goes out, and Spindle ties off the last thread. You can’t feel your fingers.',
      ),
    ],
    [
      {
        domain: 'maths',
        skill: 'time intervals in hours',
        standard: '3.MD.A.1',
        kind: 'ask',
        after: 5,
        prompt: [
          N(
            'Corvin’s lamp came on at midnight and went out at five o’clock. How long did he watch?',
          ),
        ],
        options: [
          {
            label: '5 hours',
            best: true,
            reply: [
              N(
                'Yes. From midnight to five o’clock is 5 hours. A long, cold watch for both of you.',
              ),
            ],
          },
          {
            label: '7 hours',
            reply: [N('Count on from midnight: one, two, three, four, five. That’s 5 hours.')],
          },
        ],
        parentNote: 'Worked out a time interval in hours.',
      },
      {
        domain: 'sel',
        skill: 'what a fib costs, even a kind one',
        standard: 'CASEL: Responsible decision-making',
        kind: 'notice',
        after: 5,
        lines: [
          N(
            'Your fib kept Spindle hidden. It also means Corvin never gets the chance to choose kindness towards her. Every choice has a cost.',
          ),
        ],
        parentNote: 'Thought about the trade-offs of protecting someone with an untruth.',
      },
    ],
  ),
  // sold path: replaces s27-letgo (the campaign hook)
  scene(
    's27-home',
    [
      ...MORNING,
      N(
        'Tam is at the pen behind the house. He opens his mouth to say “Nine”, stops, and says its real name instead.',
      ),
      C('It was yours, I believe. Before.', 'think'),
      C(
        'Two hundred Shells. What I gave you for it. Not a Shell more. I won’t make a profit off Hazel’s heir.',
      ),
    ],
    [
      {
        domain: 'maths',
        skill: 'equal groups: counting in tens',
        standard: '3.OA.A.1',
        kind: 'ask',
        after: 10,
        prompt: [
          N('Corvin always counts Shells in piles of ten. How many piles make two hundred?'),
        ],
        options: [
          {
            label: '20 piles',
            best: true,
            reply: [N('Yes: 20 × 10 = 200. Twenty neat piles on the rail.')],
          },
          {
            label: '10 piles',
            reply: [N('Ten piles of ten is only 100. We need twice that: 20 piles.')],
          },
          {
            label: '2 piles',
            reply: [N('Two piles of ten is 20. For 200 we need 20 piles of ten.')],
          },
        ],
        parentNote: 'Used equal groups of ten to make 200.',
      },
      {
        domain: 'social-studies',
        skill: 'fairness in a deal',
        standard: 'D2.Civ.8.K-2',
        kind: 'notice',
        after: 10,
        lines: [
          N(
            'Corvin could charge more, now the runner is famous. He asks only what he paid. That’s his idea of fair.',
          ),
        ],
        parentNote: 'Thought about what makes a price fair.',
      },
    ],
    [
      {
        id: 'pay',
        label: 'Count out two hundred Shells.',
        set: { boughtBack: true, 's27-paid': 'shells' },
        then: [
          N(
            'You count the Shells into his cold palm in piles of ten. He doesn’t close his hand until the last one.',
          ),
          C('Paid in full. It’s yours.'),
          N('It was always yours. Neither of you says so.'),
          ...HOME_TAIL,
        ],
      },
      {
        id: 'hat',
        label: 'Let the Keepers pass a hat.',
        set: { boughtBack: true, 's27-paid': 'hat' },
        then: [
          SP('Hat. HAT. Somebody give me a hat. Mine’s full of fuses.', 'happy'),
          N(
            'Sparks borrows Byte’s and goes along the fence with it, and it comes back heavy. Fern puts in a button.',
          ),
          FE('It’s a good button. It’s off my good coat.'),
          N(
            'Corvin counts the hat out on the rail, in silence. Two hundred Shells exactly, and a button.',
          ),
          C('…There’s a button.', 'think'),
          FE('It’s a very good button.'),
          N(
            'He looks at it. Then he puts it in his coat pocket: not the breast pocket, the other one.',
          ),
          ...HOME_TAIL,
        ],
      },
    ],
  ),
  // sold path: replaces s27-gate
  scene(
    's27-gate-sold',
    [
      N(
        'At the Grove gate, before you can lift and push, your old Nubbin noses at the bottom bar, the way it used to.',
      ),
      N('It remembers the gate sticks. It remembers.'),
      N(
        'It sits down by the gatepost and looks at the Grove for a long time, as if checking it is all still there.',
      ),
      N('You crouch beside it. You don’t say sorry out loud, but you stay, and it lets you.'),
      N('The 9 on its side will wash off by the spring. You don’t hurry it.'),
      N('Some mistakes can be mended. Mending takes time, and staying.'),
    ],
    [
      {
        domain: 'sel',
        skill: 'repairing a relationship after a mistake',
        standard: 'CASEL: Relationship skills',
        kind: 'notice',
        after: 5,
        lines: [
          N(
            'Putting things right isn’t one big moment. It’s lots of small ones: showing up, being patient, staying close.',
          ),
        ],
        parentNote: 'Thought about how relationships are mended through patience and small acts.',
      },
    ],
  ),
  // step 12 done, if s21Done and Wisp is not carrying
  scene(
    's27-carry-clank',
    [
      N(
        'Clank has followed you up the valley, because somebody said the word “ladder” where he could hear.',
      ),
      CK('Announcement! I cannot climb! I have one wheel! But I am VERY good at steady!', 'happy'),
      ...LADDER,
      N('At the bottom, Clank holds the ladder with both arms and does not move one single bolt.'),
      CK('Steady. Steady. Announcement, but quietly: steady.', 'soft'),
      ...LADDER_DOWN,
    ],
    [
      {
        domain: 'science',
        skill: 'balanced forces keep a ladder still',
        standard: '3-PS2-1',
        kind: 'notice',
        after: 5,
        lines: [
          CK(
            'Explanation! The ladder’s foot wants to slide outwards. I push back exactly as hard. Balanced forces. No sliding!',
            'happy',
          ),
        ],
        parentNote: 'Learned how balanced forces keep a ladder from slipping.',
      },
    ],
  ),
  // step 12 done, if wisp = spared or sable
  scene(
    's27-carry-wisp',
    [
      N('Something grey drops from the shed beam beside the sac, so quietly that Sparks yelps.'),
      N(
        'Wisp. He has trailed you up the valley, three hedges behind, the way he follows anything warm.',
      ),
      N('He has his torn ear against the sac. It has been in the sun on that beam all afternoon.'),
      W('warm. sun-warm.', 'soft'),
      W('mine. warm. mine.', 'soft'),
      Y(
        'Not yours. Hers. But you could keep it warm for her. Under your step, all winter. Till spring.',
      ),
      N(
        'Wisp thinks about this with his whole body. It is the kind of bargain he understands: he gets to hold the warm thing.',
      ),
      W('…keep it warm. warm is keeping. yes.', 'soft'),
      N(
        'He carries it down the wall in his mouth, the way you would carry the last warm thing in the world.',
      ),
      N(
        'Spindle watches every step he takes, then lifts two legs at him, politely. Wisp hisses, and is pleased.',
      ),
    ],
    [
      {
        domain: 'sel',
        skill: 'a fair bargain: everyone gets something they need',
        standard: 'CASEL: Relationship skills',
        kind: 'notice',
        after: 7,
        lines: [
          N(
            'A good bargain gives each side what it needs. Wisp gets a warm thing to hold. The eggs get a warm place to sleep.',
          ),
        ],
        parentNote: 'Thought about what makes a bargain fair to both sides.',
      },
      {
        domain: 'science',
        skill: 'a sheltered place protects eggs from hard frost',
        standard: 'K-ESS3-1',
        kind: 'notice',
        after: 9,
        lines: [
          N(
            'Under a step, out of the wind and rain, the cold is gentler. Many animals tuck their eggs into sheltered spots like that.',
          ),
        ],
        parentNote: 'Learned why sheltered places help eggs survive the winter.',
      },
    ],
  ),
  // post-game spring, s27-carrier = nubbin
  scene(
    's27-spring',
    [
      N(
        'The first spring. The snow has gone from the lane, and the wind comes up the valley smelling of wet earth.',
      ),
      N('On the warm shelf in the lantern shed, the little straw-coloured sac has opened.'),
      N(
        'Out come spiders, hundreds of them, each smaller than a crumb and perfectly sure of itself.',
      ),
      N(
        'They climb the shed wall, and the gatepost, and the top bar of the gate that sticks. They line up along it.',
      ),
      N(
        'Then, one by one, each lets out a thread into the wind, and lifts, and floats away over the valley.',
      ),
      N(
        'You stand at the gate and watch them go until they are just glints. It takes all morning, and you don’t mind.',
      ),
      N('Three stay.'),
      N(
        'The next morning, in the corner of the lantern shed window, there is a web no bigger than a thumbnail. It says EVENING.',
      ),
      N('You laugh out loud, on your own, in the shed. Then you say it back: “Evening.”'),
      N(
        'Not many friends can spell. Not many spellers stay up all night for a friend. Spindle did both.',
      ),
    ],
    [
      {
        domain: 'science',
        skill: 'spiderlings disperse by ballooning',
        standard: '3-LS1-1',
        kind: 'notice',
        after: 4,
        lines: [
          N(
            'This is called ballooning. A spiderling lets out silk until the breeze catches it, then floats away.',
          ),
          N(
            'Some travel many kilometres. Spreading out means they don’t all compete for the same food.',
          ),
        ],
        parentNote: 'Learned how spiderlings spread out by ballooning on silk threads.',
      },
      {
        domain: 'literacy',
        skill: 'how a story ends where it began',
        standard: 'RL.4.2',
        kind: 'notice',
        after: 8,
        lines: [
          N(
            'The story began with one word in a window: EVENING. It ends with the same word, written by her children.',
          ),
          N('Ending where you began shows that something goes on. Life cycles do that too.'),
        ],
        parentNote: 'Noticed how a story’s ending echoes its beginning, like a life cycle.',
      },
    ],
  ),
  // post-game spring, s27-carrier = wisp
  scene(
    's27-spring-wisp',
    [
      N(
        'The first spring. The snow has gone from the lane, and the wind comes up the valley smelling of wet earth.',
      ),
      N(
        'Under the cottage step, where Wisp has hoarded it all winter like treasure, the little straw-coloured sac has opened.',
      ),
      N(
        'The first thing the spiders see is a grey head with one torn ear, very close, watching them with enormous care.',
      ),
      N(
        'Wisp lets them climb over his nose, and doesn’t hiss once. Then they climb the gate and line up along the top bar.',
      ),
      N(
        'One by one, each lets out a thread into the wind, and lifts, and floats away over the valley.',
      ),
      N(
        'Wisp watches them go until they are just glints. Then he goes back under the step and sulks, magnificently.',
      ),
      N('Three stay.'),
      N(
        'The next morning, in the corner of the lantern shed window, there is a web no bigger than a thumbnail. It says EVENING.',
      ),
      N('You laugh out loud, on your own, in the shed. Then you say it back: “Evening.”'),
      N(
        'Not many friends can spell. Not many spellers stay up all night for a friend. Spindle did both.',
      ),
    ],
    [
      {
        domain: 'science',
        skill: 'spiderlings disperse by ballooning',
        standard: '3-LS1-1',
        kind: 'notice',
        after: 4,
        lines: [
          N(
            'This is called ballooning. A spiderling lets out silk until the breeze catches it, then floats away.',
          ),
          N('Some travel many kilometres, to find a place of their own.'),
        ],
        parentNote: 'Learned how spiderlings spread out by ballooning on silk threads.',
      },
      {
        domain: 'sel',
        skill: 'letting go of something you love',
        standard: 'CASEL: Self-management',
        kind: 'notice',
        after: 5,
        lines: [
          N(
            'Wisp kept them safe all winter, and still let them go. Caring for something sometimes means letting it leave.',
          ),
        ],
        parentNote: 'Thought about how caring sometimes means letting go.',
      },
    ],
  ),
];

// ================================================================== the quest
const S27: EduQuest = {
  id: 'reader:s27',
  of: 's27',
  band: 'reader',
  title: 'Some Nubbin',
  goals: {
    's27-step1': {
      goal: 'Fetch a coil of copper wire for Sparks from the Circuit’s old lantern shed.',
      hint: 'The shed is behind the finishing straight. Bottom drawer of the cabinet under the window.',
    },
    's27-step2': {
      goal: 'Ask the stable lad about the little grey runner at the end of the row.',
      hint: 'Tam does the buckets by the pens. He’s the only one up here who whistles.',
    },
    's27-step3': {
      goal: 'Sit down by the shed window, and wait with the spider.',
      hint: 'Sit on the upturned crate by the window and don’t do anything. It takes as long as it takes.',
    },
    's27-step4': {
      goal: 'Ask Fern, Clover, Luna and Byte for one word each, and bring them back to Spindle.',
      hint: 'Fern is in her orchard, Clover by the pond, Luna in her night garden and Byte wherever there is a clipboard.',
    },
    's27-step5': {
      goal: 'Be at the pens at first light, to see what Spindle wrote in the night.',
      hint: 'Come up the valley before dawn. The frost shows the silk only for the first hour.',
    },
    's27-step6': {
      goal: 'Corvin wants a word with you by the pens.',
      hint: 'He’s at the end of the row, by the rail with the name on it.',
    },
    's27-step7': {
      goal: 'At dusk, carry Spindle to the main railing by the finishing straight.',
      hint: 'Bring the matchbox and keep it in an inside pocket, where it’s warm.',
    },
    's27-step8': {
      goal: 'Carry Spindle in Sparks’s toolbox to the shaded pen behind the house.',
      hint: 'Walk slowly past the house. Nobody stops someone carrying a toolbox.',
    },
    's27-step9': {
      goal: 'Go up to the Circuit for the Autumn Show.',
      hint: 'The Show is on the first autumn morning. Spindle rides in your hat brim. Don’t bend down suddenly.',
    },
    's27-step10': {
      goal: 'Hold the lantern low for Spindle while she writes her last word.',
      hint: 'Stay by the finishing straight and keep the light steady on the rail. She’ll tell you when she’s done.',
    },
    's27-step11': {
      goal: 'Walk the little grey runner home to the Grove.',
      hint: 'Go slowly. It has never walked further than the end of the straight.',
    },
    's27-step12': {
      goal: 'Get Spindle’s egg sac down from the shed rafters, and take it somewhere warm for the winter.',
      hint: 'It’s too high to reach from the crate. Somebody small and careful will have to climb.',
    },
    's27-step13': {
      goal: 'Sit with Spindle in the shed window.',
      hint: 'Take the crate by the window. There’s nothing to do. That’s the point.',
    },
    's27-step14': {
      goal: 'Tell Sparks.',
      hint: 'She’s at the start lamp. She may already know. Tell her anyway.',
    },
  },
  scenes: [...S27_SCENES, S27_COMPLETE],
  glossary: [
    gloss('copper', 'A reddish-brown metal that electricity flows through easily.', 's27-wire'),
    gloss(
      'circuit',
      'A loop that electricity flows round; break the loop and the power stops.',
      's27-wire',
    ),
    gloss('paraffin', 'An oil that is burned in lamps and lanterns to make light.', 's27-evening'),
    gloss(
      'arachnid',
      'An animal with eight legs and two body parts, like a spider or a scorpion.',
      's27-evening',
    ),
    gloss('dealer', 'Someone whose job is buying and selling things, or animals.', 's27-tam'),
    gloss(
      'homophone',
      'A word that sounds the same as another but has a different meaning or spelling.',
      's27-wait',
    ),
    gloss(
      'spinnerets',
      'The tiny nozzles at the back of a spider’s body that silk comes out of.',
      's27-spindle',
    ),
    gloss(
      'clerk',
      'Someone whose job is writing things down and keeping records tidy.',
      's27-spindle',
    ),
    gloss('statistically', 'Measured by counting and comparing numbers.', 's27-words'),
    gloss('duchess', 'A woman of very high rank, like a lady in a grand house.', 's27-first-night'),
    gloss(
      'ledger',
      'A book where someone records money, sales or other numbers.',
      's27-odd-things',
    ),
    gloss(
      'heir',
      'The person who receives what someone leaves behind, like a house or a garden.',
      's27-was-it-you',
    ),
    gloss(
      'compound word',
      'A word made by joining two smaller words, like somebody or toolbox.',
      's27-somebodys',
    ),
    gloss('uneasy', 'Worried, as if something isn’t quite right.', 's27-somebodys'),
    gloss('deciduous', 'Describes trees that drop all their leaves in autumn.', 's27-ready'),
    gloss('rosette', 'A ribbon gathered into a round badge, given as a prize.', 's27-show'),
    gloss('motive', 'The reason a person does something.', 's27-midnight'),
    gloss('theme', 'The big idea a story is about, underneath what happens.', 's27-letgo'),
    gloss(
      'threshold',
      'The strip at the bottom of a doorway or gate that you step over.',
      's27-gate',
    ),
    gloss('rafters', 'The sloping beams that hold up a roof.', 's27-egg-sac'),
    gloss('life span', 'How long a living thing usually lives.', 's27-empty-web'),
    gloss(
      'regret',
      'Feeling sorry about something you did, and wishing you had chosen differently.',
      's27-row-sold',
    ),
    gloss(
      'ballooning',
      'How spiderlings travel: floating on silk threads carried by the wind.',
      's27-spring',
    ),
  ],
  notes:
    'Lessons: frost below 0°C (32°F) and summer frost being odd; copper and circuits; spider vs insect; body language; “place”; ' +
    'Tam’s quiet care; wait/weight; quiet company; spindle; spinnerets; feeling words; 25 − 9 = 16; a simile (the duchess); ' +
    'fresh webs and recycled silk; frost on thin threads; number vs name; 12 × 2 = 24; what Corvin says vs means; the think ' +
    'question on kind fibs; spiders take the temperature around them; SOME + BODY and the apostrophe; shade; heat melting ice; ' +
    'autumn daylight; reading an animal’s yes and no; 8 − 3 = 5; light and seeing; Corvin’s motive (think); 9 pm to 5 am = 8 ' +
    'hours; theme; patience at a threshold; the life cycle; 12 × 25 cm = 3 m; plain words; WELL’s meanings; mixed feelings; ' +
    'life span; grief; how respect spreads. Variants: regret; alphabetical order; midnight to five = 5 hours and the cost of the ' +
    'fib; 20 × 10 = 200 and a fair price; mending; balanced forces; a fair bargain and shelter; ballooning; endings that echo ' +
    'beginnings; letting go. Small additions to the original for checkable maths: twelve people then twice as many ' +
    '(s27-odd-things), eight runners (s27-show), nine o’clock to about five (s27-home-word, s27-midnight, s27-midnight-shield), ' +
    'twelve rungs 25 cm apart (s27-carry only), and ' +
    'Corvin counting in tens (s27-home). The book’s two lifted lines are replaced with new ones (no quotes).',
};

// ================================================================== exports
export const EDU_S27_READER: EduQuest[] = [S27];

/** Every `edu:` check used by a `do` lesson in this file. */
export const CHECKS: string[] = ['edu:order:words:alphabet'];
