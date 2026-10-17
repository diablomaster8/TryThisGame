/**
 * The Learning Grove, reader band (ages 7–10): S25 “Real”.
 *
 *   S25 Real   clockwork springs store energy (4-PS3-4), a fortnight as 2 × 7 (3.OA.A.1), similes
 *              and metaphors (L.4.5), counting the gap between lightning and thunder (3.OA.A.3,
 *              4-PS3-2), dew and condensation (2-PS1-4), units and tally charts (4.MD.A.1,
 *              3.MD.B.3), wool, knitting and darning (2-PS1-1), felting as a change that won’t
 *              undo (2-PS1-4), why bedding is washed after illness, mending versus replacing
 *              (3-5-ETS1-2), warm springs (4-PS3-2), knitting patterns as rules (4.OA.C.5);
 *              think: what makes something Real? Can a made thing become Real? Can love be
 *              measured? What is Moss’s guess?
 *
 * Source: side-stories-s25.ts (SIDE_STORY_S25 and SIDE_STORY_S25_VARIANTS). One EduScene per
 * original scene; variants are in EDU_S25_READER_VARIANTS. Every choice keeps its original id
 * and `set`. See EDU-STYLE.md. British spelling.
 *
 * - No text is lifted from the book: Moss’s old-horse lines, the clockwork-toy page, “He isn’t a
 *   toy”, the shabbiness line and “carefully kept” are all rewritten in new words.
 * - Moss is silent and unnamed in s25-sill (chapter 3), named and silent in s25-sill-late, and
 *   speaks from s25-real on. Only you hear him; you pass his words on.
 * - Nubbins, wild Nubbins and Sable never speak. The toy is “it” until Fern’s, “he” after.
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
const FE = say('fern');
const SP = say('sparks');
const PX = say('pixel');
const CL = say('clover');
const BY = say('byte');
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
const STORM: Line[] = [
  N(
    'Then, at the end of a hot week, a storm. It comes over the hill at bedtime, all at once, like a dropped tray.',
  ),
  N(
    'Your Nubbin won’t settle. It goes from the basket to the hearth to the door and back, ears flat at every bang.',
  ),
  N(
    'You look for the old sock it likes, and can’t find it. You warm a stone by the fire, and it pushes the stone away.',
  ),
  N(
    'A flash, then thunder right overhead. The window seat lights up white, and the knitted toy on its sill with it.',
  ),
];

const stormLessons = (after: number): LessonIn[] => [
  {
    domain: 'science',
    skill: 'light travels faster than sound, so we see lightning before we hear thunder',
    standard: '4-PS3-2',
    kind: 'notice',
    after,
    lines: [
      N(
        'Thunder is the sound a lightning flash makes, so the two start together. You see the flash first because light is far faster than sound.',
      ),
      N(
        'Sound takes about three seconds to travel one kilometre. So you can count the gap to tell how far away the storm is.',
      ),
    ],
    parentNote:
      'Learned that light travels faster than sound, which is why the flash comes before the thunder.',
  },
  {
    domain: 'maths',
    skill: 'divide by 3 in a word problem',
    standard: '3.OA.A.3',
    kind: 'ask',
    after,
    prompt: [
      N(
        'Say you count six seconds between a flash and its thunder. About how far away is the storm?',
      ),
    ],
    options: [
      {
        label: 'About 2 kilometres',
        best: true,
        reply: [N('Yes. Six seconds, three seconds for each kilometre: 6 ÷ 3 = 2.')],
      },
      {
        label: 'About 6 kilometres',
        reply: [
          N(
            'Close thinking, but sound needs about three seconds per kilometre. 6 ÷ 3 = 2 kilometres.',
          ),
        ],
      },
      {
        label: 'About 18 kilometres',
        reply: [
          N(
            'That’s 6 × 3. We need to share the seconds into groups of three: 6 ÷ 3 = 2 kilometres.',
          ),
        ],
      },
    ],
    parentNote: 'Used division to turn the flash-to-thunder gap into a distance.',
  },
];

const sillLesson: LessonIn = {
  domain: 'maths',
  skill: 'a fortnight is two groups of seven days',
  standard: '3.OA.A.1',
  kind: 'ask',
  after: 2,
  prompt: [N('A fortnight is two weeks. How many days is that?')],
  options: [
    {
      label: '14 days',
      best: true,
      reply: [
        N(
          'Yes. Two groups of seven: 2 × 7 = 14. The word comes from an old way of saying “fourteen nights”.',
        ),
      ],
    },
    {
      label: '10 days',
      reply: [N('A week has seven days, so two weeks is 7 + 7. That makes 14.')],
    },
    {
      label: '2 days',
      reply: [N('That would be two days, not two weeks. Two weeks is 2 × 7 = 14 days.')],
    },
  ],
  parentNote: 'Worked out a fortnight as two equal groups of seven days.',
};

const fallsLesson: LessonIn = {
  domain: 'science',
  skill: 'warm springs are heated from deep underground',
  standard: '4-PS3-2',
  kind: 'notice',
  after: 4,
  lines: [
    N(
      'Deep under the ground, the rock is very hot. Rainwater can soak down a long way, get warmed, and rise again.',
    ),
    N(
      'Where it comes out, you get a warm spring. Heat from inside the Earth like this is called geothermal heat.',
    ),
  ],
  parentNote: 'Learned that warm springs are heated by geothermal heat from deep underground.',
};

const guessLesson = (after: number): LessonIn => ({
  domain: 'literacy',
  skill: 'making an inference from clues',
  standard: 'RL.3.3',
  kind: 'ask',
  after,
  prompt: [N('Moss doesn’t say what his guess is. What do you think he is guessing?')],
  options: [
    {
      label: 'That the lights were things that were loved a long time.',
      reply: [
        N(
          'That fits the clues: the toy, the little light, and where Moss is looking. Moss would say you’re a good listener.',
        ),
      ],
    },
    {
      label: 'That the lights came from the warm water itself.',
      reply: [
        N(
          'That’s a fair reading too. The water is warm and strange. Moss leaves room for more than one answer.',
        ),
      ],
    },
    {
      label: 'I don’t know yet.',
      reply: [
        N('That’s an honest answer. Moss doesn’t know either. That’s why it’s only a guess.'),
      ],
    },
  ],
  parentNote: 'Used clues in the story to make a guess about what a character was thinking.',
});

// ---------------------------------------------------------------- the spring coda
type ToyName = 'button' | 'bobble' | 'mister';
const NAMES: Record<ToyName, { said: string; stitched: string }> = {
  button: { said: 'Button?', stitched: 'BUTTON' },
  bobble: { said: 'Bobble?', stitched: 'BOBBLE' },
  mister: { said: 'Mister?', stitched: 'MISTER' },
};

const codaWild = (name: ToyName): EduScene =>
  scene(
    `s25-coda-wild-${name}`,
    [
      N(
        'Spring. The flowers on the hill are open, and the long grass at the edge of the Grove is new and green.',
      ),
      N(
        'A wild Nubbin is sitting right at the edge, where the mown grass stops. You haven’t seen it before.',
      ),
      N(
        'Its coat is grey-brown, soft and a little lumpy, like knitting with a dropped stitch here and there.',
      ),
      N('The tuft on its head is a bit crooked. One of its eyes catches the light like a button.'),
      Y(NAMES[name].said, 'soft'),
      N('It turns its head.'),
      N(
        'It doesn’t come in, and it doesn’t run away. It looks at you the way you look at someone you’re nearly sure you know.',
      ),
      N('Then it hops, twice, high and neat, as if to show you that it can.'),
      N('It goes back into the long grass. After that, in the mornings, it is often at the edge.'),
    ],
    [
      {
        domain: 'science',
        skill: 'daylight grows longer in spring',
        standard: '1-ESS1-2',
        kind: 'notice',
        after: 0,
        lines: [
          N('In spring the days grow longer and the sun climbs higher, so the ground warms up.'),
          N('More light and warmth wake the seeds and buds that waited through the winter.'),
        ],
        parentNote: 'Linked spring growth to longer days and more sunlight.',
      },
    ],
  );

const codaCoat = (name: ToyName): EduScene =>
  scene(
    `s25-coda-coat-${name}`,
    [
      N(
        'Spring. Fern and Clover come up the lane together with a parcel, which is suspicious, because they never agree about wrapping.',
      ),
      FE(
        'We couldn’t decide whose idea it was. So it’s both of ours, and any mistakes are Clover’s.',
        'happy',
      ),
      CL('There aren’t any mistakes. There are three, and they’re on purpose.'),
      N(
        'Inside is a knitted coat, just Nubbin-sized, in grey-brown wool, with a crooked bobble on the hood.',
      ),
      N('It’s the toy’s own pattern. Clover counted his stitches while he was drying on the line.'),
      FE('Inside the collar. Look.'),
      N(`Stitched inside the collar, in Fern’s wobbly red cross-stitch: ${NAMES[name].stitched}.`),
      N(
        'Your Nubbin puts it on, and goes and sits on its bed beside the toy, so everybody can see they match.',
      ),
      CL('Matching. Oh, I could cry. I am crying. Don’t look.', 'soft'),
    ],
    [
      {
        domain: 'maths',
        skill: 'continue a pattern that follows a rule',
        standard: '4.OA.C.5',
        kind: 'ask',
        after: 4,
        prompt: [
          CL(
            'The cuffs are rib: knit two, purl two, over and over. Knit, knit, purl, purl, knit, knit…',
          ),
          CL('What comes next?'),
        ],
        options: [
          {
            label: 'Purl, purl',
            best: true,
            reply: [
              CL(
                'Exactly. Two and two, all the way round. That’s what makes a cuff stretchy.',
                'happy',
              ),
            ],
          },
          {
            label: 'Knit, knit',
            reply: [
              CL(
                'Not quite. The rule is two knits, then two purls. So after knit, knit comes purl, purl.',
              ),
            ],
          },
          {
            label: 'Knit, purl',
            reply: [CL('That’s a different rib. Mine goes two and two, so next is purl, purl.')],
          },
        ],
        parentNote: 'Continued a repeating pattern by finding its rule.',
      },
    ],
  );

// ================================================================== S25 Real
const S25_SCENES: EduScene[] = [
  // ------------------------------------------------ step 1 scene: the loft
  scene(
    's25-loft',
    [
      N(
        'Early-summer rain, steady and warm. The loft lamp has died, and Sparks says it’s the small, fiddly kind of broken.',
      ),
      N('Small and fiddly is Pixel’s department. Pixel is coming after lunch.'),
      N(
        'You go up the ladder first, to clear a space, and because you were never once allowed up there as a child.',
      ),
      N(
        'The loft smells of apples, dust and mothballs. Rain ticks on the roof just above your head.',
      ),
      N(
        'Hazel’s things are up here: seed trays, a broken umbrella labelled STILL GOOD, and forty years of Lantern Night programmes.',
      ),
      N(
        'Your Nubbin climbs up behind you, sneezes at the dust, and sets off to investigate a hatbox.',
      ),
      N(
        'Under the eaves, on a trunk, is a soft parcel in brown paper, faded pale where the sun has reached it for years.',
      ),
      N(
        'On the front, in Hazel’s hand: “For when they come back. (They’ll have grown. It won’t mind.)”',
      ),
      N(
        'The string is tied in her bow: the one that falls open if you pull the right end, and never if you pull the wrong one.',
      ),
    ],
    [
      {
        domain: 'social-studies',
        skill: 'old objects are clues to life in the past',
        standard: 'D2.His.2.K-2',
        kind: 'notice',
        after: 4,
        lines: [
          N(
            'Forty years of programmes is forty years of Lantern Nights. You could read them in order and see what changed.',
          ),
          N(
            'Historians do this too. Old letters, tickets and labels are clues to how people lived.',
          ),
        ],
        parentNote: 'Noticed that everyday old objects are evidence about life in the past.',
      },
    ],
  ),
  // ------------------------------------------------ step 1 done: the name
  scene(
    's25-name',
    [
      N(
        'Inside, in tissue paper: a knitted Nubbin, lumpy, in grey-brown wool. The bobble on top is a little crooked.',
      ),
      N(
        'One button eye is sewn on tight. The other hangs on a long loose thread, as if it were looking at something far off.',
      ),
      N(
        'Under it is a thin book with a rabbit on the cover, its spine mended twice with brown tape.',
      ),
      N(
        'You remember, though not all at once. The smell comes first: wool and peppermint. Then her kitchen, and being three.',
      ),
      N(
        'She made it for you, and you took it everywhere for one summer. Then you went home and grew, and it stayed.',
      ),
      N('You called it something. You’re nearly sure you did.'),
    ],
    [
      {
        domain: 'science',
        skill: 'senses send messages to the brain, and smell can bring back memories',
        standard: '4-LS1-2',
        kind: 'notice',
        after: 3,
        lines: [
          N(
            'Your nose sends messages to your brain, and the brain links smells with places and times.',
          ),
          N(
            'That’s why a smell can bring back a memory before you even know what you’re remembering.',
          ),
        ],
        parentNote:
          'Learned that the senses send information to the brain, and that smells can trigger memories.',
      },
    ],
    [
      {
        id: 'button',
        label: '“Button.” For the eye.',
        set: { 's25-name': 'button' },
        then: [
          N('Button. You said it all that summer, mostly to the eye that was loose.'),
          N(
            'Your Nubbin looks up from the hatbox, considers the toy, and goes back to the hatbox.',
          ),
        ],
      },
      {
        id: 'bobble',
        label: '“Bobble.” For the bobble.',
        set: { 's25-name': 'bobble' },
        then: [
          N('Bobble. You carried it by the bobble everywhere, which is why the bobble is crooked.'),
          N(
            'Your Nubbin looks up from the hatbox, considers the toy, and goes back to the hatbox.',
          ),
        ],
      },
      {
        id: 'mister',
        label: '“Mister.” Just Mister.',
        set: { 's25-name': 'mister' },
        then: [
          N(
            'Mister. Hazel called the postman Mister, and at three you thought it was the most polite word there was.',
          ),
          N(
            'Your Nubbin looks up from the hatbox, considers the toy, and goes back to the hatbox.',
          ),
        ],
      },
    ],
  ),
  // ------------------------------------------------ step 2 scene: the lamp
  scene(
    's25-lamp',
    [
      N(
        'After lunch Pixel comes up the ladder with a toolbox in her teeth and a biscuit tin under each arm.',
      ),
      PX(
        'Afternoon. Don’t touch the tins. Nothing in them is dangerous. Some of it is just enthusiastic.',
      ),
      PX(
        'The lamp’s fine. It’s the winder. It’s lost the will to wind. I’ve brought it some friends.',
        'think',
      ),
      N(
        'Out of the tins come her bits: a clockwork moth, a brass fan the size of a thumbnail, and a little cog.',
      ),
      N('Sparks and Fern come up the ladder too, because three people in a loft is an event.'),
      SP('Ooh. Does any of it explode?', 'happy'),
      PX('Not on purpose.'),
      N(
        'The moth whirrs up off Pixel’s palm, flies one wobbly circle round the rafters, and lands on Fern’s head.',
      ),
      FE('Oh, it’s beautiful. I can’t keep a moth alive and you’ve gone and made one.', 'happy'),
      N(
        'Your Nubbin chases the flashes off the brass fan across the floorboards, squeaking at every one.',
      ),
      N(
        'On the trunk, where you put it down to make room, the knitted toy watches all of it with its one good eye.',
      ),
    ],
    [
      {
        domain: 'science',
        skill: 'a wound spring stores energy and turns it into movement',
        standard: '4-PS3-4',
        kind: 'notice',
        after: 3,
        lines: [
          PX(
            'Clockwork is simple, really. When you turn the key, you coil a spring up tight. The spring stores the energy of your turning.',
          ),
          PX(
            'Let it go, and the spring uncoils, a little at a time, and turns the gears. Your winding becomes the moth’s flying.',
          ),
        ],
        parentNote: 'Learned how a clockwork spring stores energy and changes it into motion.',
      },
    ],
  ),
  // ------------------------------------------------ step 2 done: the sill
  scene(
    's25-sill',
    [
      N('The lamp comes on: a warm ring of light, and a small, satisfied tick every second.'),
      N(
        'Everyone goes down the ladder talking about the moth. You go last, with the toy and the book, and set them on the window seat for now.',
      ),
      N(
        'For now turns into a week, and then a fortnight. The toy sits on the sill and gets the afternoon sun.',
      ),
      N('Nobody looks at it. You don’t either, though you mean to.'),
      N('Out of the window, on top of the western hill, the little grey one is looking this way.'),
    ],
    [sillLesson],
  ),
  // ------------------------------------------------ step 3 scene: what is Real?
  scene(
    's25-real',
    [
      N('One morning the top of the western hill is empty.'),
      N(
        'Moss is on the outside ledge of the window seat, in the sun. The toy is on the inside sill, with the window open between them.',
      ),
      N('It is a long way down from the hill for him. He must have set out before it was light.'),
      M('Don’t mention it. I’m not here.'),
      N(
        'You sit on the window seat and wait, because that is the rule. A bee comes in, considers them both, and leaves.',
      ),
      M(
        'She knitted that in a week, with her feet on the fender. She dropped a stitch every night.',
        'happy',
      ),
      M(
        'You were three. You carried it by the bobble and you wouldn’t let anyone else hold it. Not even her.',
        'soft',
      ),
      M(
        'She read you that book on this seat, every night of one wet August. I sat on this ledge and heard every word.',
      ),
      N('He turns, not to you, but to the toy.'),
      M(
        'Real isn’t in the stitches. It grows on you slowly, the way moss grows on a wall.',
        'soft',
      ),
      M(
        'Somebody has to love you for ages and ages, properly, and not just for games. That’s how it starts.',
        'soft',
      ),
      N('The toy, being knitted, takes this well.'),
    ],
    [
      {
        domain: 'literacy',
        skill: 'theme: thinking about what a story is saying',
        standard: 'RL.4.2',
        kind: 'ask',
        after: 10,
        prompt: [N('Moss has his own idea about what makes something Real. What do you think?')],
        options: [
          {
            label: 'Being loved for a long time.',
            reply: [N('That’s Moss’s answer too. Keep it in mind; the story will test it.')],
          },
          {
            label: 'Being alive.',
            reply: [
              N(
                'That’s a fair answer. But Moss is talking to a knitted toy. Watch whether he changes your mind.',
              ),
            ],
          },
          {
            label: 'Being made very carefully.',
            reply: [N('Good makers matter. Moss thinks the making is only the start, though.')],
          },
          {
            label: 'I’m still deciding.',
            reply: [N('That’s a wise answer. This whole story is about that question.')],
          },
        ],
        parentNote:
          'Thought about the story’s big question, what makes something Real, and gave their own view.',
      },
    ],
    [
      {
        id: 'hurt',
        label: 'Ask him: does it hurt?',
        set: { 's25-ask': 'hurt' },
        then: [Y('Does it hurt?'), N('Moss doesn’t answer you. He answers the toy.')],
      },
      {
        id: 'when',
        label: 'Ask him: does it happen quickly?',
        set: { 's25-ask': 'when' },
        then: [Y('Does it happen quickly?'), N('Moss doesn’t answer you. He answers the toy.')],
      },
      {
        id: 'sit',
        label: 'Say nothing. Sit with them both.',
        set: { 's25-ask': 'sit' },
        then: [
          N(
            'You say nothing. After a while Moss nods, very slightly, and goes on as if somebody had asked.',
          ),
        ],
      },
    ],
  ),
  // ------------------------------------------------ step 3 done: does it hurt?
  scene(
    's25-hurt',
    [
      M(
        'Sometimes it does. But once you’re Real, a little hurt doesn’t frighten you so much.',
        'soft',
      ),
      M('It isn’t quick. It’s slow, like a tree getting tall. You hardly see it happening.'),
      M(
        'It takes longer for anyone with sharp edges, or anyone kept up on a high shelf where nobody can hug them.',
        'think',
      ),
      N(
        'Then he climbs down off the ledge, one careful foot at a time, and sets off back to the hill. It will take him until supper.',
      ),
      M('He has a good face, your toy. Don’t put him on a high shelf.'),
    ],
    [
      {
        domain: 'literacy',
        skill: 'similes and metaphors',
        standard: 'L.4.5',
        kind: 'ask',
        after: 2,
        prompt: [
          N('“Slow, like a tree getting tall” is a simile: it compares two things using “like”.'),
          N('When Moss says “sharp edges”, does he mean real, pointy edges?'),
        ],
        options: [
          {
            label: 'No. He means people who are prickly and hard to get close to.',
            best: true,
            reply: [
              N(
                'Yes. That’s a metaphor: it says one thing is another, without “like”. Nobody is really sharp.',
              ),
            ],
          },
          {
            label: 'Yes. He means things with corners.',
            reply: [
              N(
                'It sounds that way! But Moss is talking about people. “Sharp edges” is a metaphor for being prickly or hard to hug.',
              ),
            ],
          },
        ],
        parentNote: 'Told a simile from a metaphor and worked out what a metaphor meant.',
      },
    ],
  ),
  // ------------------------------------------------ step 4 scene: Sable, then the storm
  scene(
    's25-storm',
    [
      N('Later that week, Sable comes past the window seat on her way to nowhere in particular.'),
      N('She stops. She looks up at the toy on the sill for a long time, with her ears flat.'),
      N('Sharp edges, Moss said. She has them.'),
      N(
        'Then she lies down on the path under the window, a tail’s length from it, and goes to sleep. She doesn’t take it.',
      ),
      N('In the morning there is frost on the path where she lay, and none at all on the toy.'),
      ...STORM,
    ],
    stormLessons(8),
  ),
  // ------------------------------------------------ step 4 done: it sleeps
  scene(
    's25-sleeps',
    [
      N(
        'You put the toy in the basket. Your Nubbin looks at it, then climbs in and curls all the way round it, nose to tail.',
      ),
      N('Thunder. It doesn’t even twitch.'),
      N(
        'In the morning it is still curled round the toy, which is damp at one ear where it was held all night.',
      ),
      N('From then on, the toy is your Nubbin’s.'),
    ],
    [
      {
        domain: 'sel',
        skill: 'comfort objects and calming down',
        standard: 'CASEL: Self-management',
        kind: 'notice',
        after: 1,
        lines: [
          N(
            'Lots of children, and some grown-ups, have a comfort object: a blanket, a toy, a soft jumper.',
          ),
          N(
            'Holding something soft and familiar can slow your breathing and help a scared body feel safe enough to sleep.',
          ),
        ],
        parentNote: 'Learned that comfort objects can help calm big feelings.',
      },
    ],
  ),
  // ------------------------------------------------ step 5 scene: everywhere
  scene(
    's25-everywhere',
    [
      N(
        'From then on the toy goes everywhere. It is carried by one ear, or the bobble, or not at all when it’s been dropped.',
      ),
      N('It goes to the pond, and comes back wet to the knees, if a toy has knees.'),
      N('It goes to Sparks’s picnic and comes home with jam on it, like everybody else.'),
      N(
        'It has its bath when your Nubbin has its bath. It has views about cats, according to your Nubbin.',
      ),
      N(
        'Then one dusk, at bedtime, the basket has your Nubbin in it, standing up, and nothing else.',
      ),
      N('It looks at you, and at the door. It does not lie down.'),
      N('The toy is out in the Grove somewhere. It’s getting dark, and the dew is coming down.'),
    ],
    [
      {
        domain: 'science',
        skill: 'dew forms when water vapour cools and condenses',
        standard: '2-PS1-4',
        kind: 'notice',
        after: 6,
        lines: [
          N('Air holds water you can’t see, called water vapour. At night the grass cools down.'),
          N(
            'When the vapour touches the cold grass, it turns back into tiny drops: dew. This is called condensation.',
          ),
          N(
            'In the morning sun, the dew warms up and turns back into vapour. It’s a change that can go both ways.',
          ),
        ],
        parentNote: 'Learned how dew forms by condensation, and that it can evaporate again.',
      },
    ],
  ),
  // ------------------------------------------------ step 5 done: the lantern
  scene(
    's25-lantern',
    [
      N(
        'You take a lantern. You find the toy face down in the grass by the pond, soaked with dew, its loose eye trailing.',
      ),
      N(
        'Your Nubbin is still standing up in the basket when you get back, as if it never once doubted you.',
      ),
      N(
        'It takes the toy in both arms, lies down, and is asleep before you’ve blown out the lantern.',
      ),
      N('You stand there a moment longer, in the dark, feeling quite important.'),
    ],
    [
      {
        domain: 'sel',
        skill: 'trust is built by keeping promises',
        standard: 'CASEL: Relationship skills',
        kind: 'notice',
        after: 1,
        lines: [
          N('Your Nubbin waited because it trusted you to come back.'),
          N(
            'Trust grows each time someone does what they said they would, especially when it’s dark, wet and inconvenient.',
          ),
        ],
        parentNote: 'Talked about how trust is built by being reliable.',
      },
    ],
  ),
  // ------------------------------------------------ step 6 scene: not only a toy
  scene(
    's25-fern',
    [
      N('You take your Nubbin round to Fern’s, and the toy comes too. The toy always comes too.'),
      N(
        'Your Nubbin climbs onto Fern’s good chair and sets the toy upright beside it, as if it were company.',
      ),
      FE('Oh, not on the cushion, love. It’s only a toy. It can go on the floor with the shoes.'),
      N(
        'She reaches for it. Your Nubbin makes a sound you have never heard it make: a squeak so fierce the cups rattle.',
      ),
      N(
        'Fern takes her hand back. Your Nubbin stands in front of the toy, very small and very large, and looks at you.',
      ),
      Y('He’s not just a toy. He’s Real, to us!'),
      N('There is a short silence. In it, Fern looks at the toy properly for the first time.'),
      FE('…Right. Yes. I see. Then I owe him an apology. Possibly several.', 'think'),
      FE(
        'And I’m going to do it properly, because Hazel would have. Come round tomorrow, and bring him.',
      ),
    ],
    [
      {
        domain: 'literacy',
        skill: 'a character’s motive',
        standard: 'RL.3.3',
        kind: 'ask',
        after: 4,
        prompt: [N('Your Nubbin is usually gentle. Why does it squeak so fiercely at Fern?')],
        options: [
          {
            label: 'It is protecting something it loves.',
            best: true,
            reply: [
              N(
                'Yes. Its motive is love: it doesn’t want its friend put on the floor. Even gentle creatures stand up for what they love.',
              ),
            ],
          },
          {
            label: 'It is cross that it has no biscuit.',
            reply: [
              N(
                'The biscuits come later! Look at where it stands: in front of the toy. It’s protecting him.',
              ),
            ],
          },
          {
            label: 'It doesn’t like Fern.',
            reply: [
              N(
                'It likes Fern well enough. Its squeak is about the toy, which it loves and wants to protect.',
              ),
            ],
          },
        ],
        parentNote: 'Worked out a character’s motive from their actions.',
      },
    ],
  ),
  // ------------------------------------------------ step 6 done: the apology
  scene(
    's25-apology',
    [
      N(
        'Fern has the good cups out, a cushion on the good chair, and a very small cup on the cushion.',
      ),
      FE(
        'Sir. I said you were only a toy. That was wrong, and rude, and in front of your friend. I apologise unreservedly.',
      ),
      FE(
        'I am, as everybody knows, only a neighbour. You are clearly a great deal more than that.',
      ),
      N(
        'Your Nubbin considers this. Then it sets him on the cushion, and accepts a biscuit on his behalf.',
      ),
      FE('Hazel made me do this once. With a cat. I was in the wrong that time too.', 'happy'),
    ],
    [
      {
        domain: 'sel',
        skill: 'the parts of a good apology',
        standard: 'CASEL: Relationship skills',
        kind: 'ask',
        after: 1,
        prompt: [
          N(
            'A good apology has parts: say what you did, say why it was wrong, and make it right. Which part is the cushion?',
          ),
        ],
        options: [
          {
            label: 'Making it right',
            best: true,
            reply: [
              N('Yes. The cushion and the tiny cup show Fern means it. Words, then actions.'),
            ],
          },
          {
            label: 'Saying what she did',
            reply: [
              N(
                'She does that in words: “I said you were only a toy.” The cushion is her making it right.',
              ),
            ],
          },
          {
            label: 'Saying why it was wrong',
            reply: [N('She says that too: “wrong, and rude”. The cushion is her making it right.')],
          },
        ],
        parentNote: 'Identified the parts of a sincere apology.',
      },
    ],
  ),
  // ------------------------------------------------ step 7 scene: the long grass
  scene(
    's25-grass',
    [
      N(
        'A hot, still afternoon. Your Nubbin carries the toy down to the edge of the long grass, where the wild ones live, to show him off.',
      ),
      N(
        'Moss has come as far as the flat stone at the foot of the hill. He looks as though he’s been there for a century.',
      ),
      M('I have not. I came down this morning. It only feels like a century, at my speed.'),
      N('Your Nubbin sets the toy down in the grass, upright, facing outwards, and steps back.'),
      M('Keep still. Let them look. They’ll be rude. They’re young.'),
      N('The grass moves, here and there, with no wind in it.'),
    ],
    [
      {
        domain: 'science',
        skill: 'many animals notice movement, so keeping still helps',
        standard: '4-LS1-2',
        kind: 'notice',
        after: 4,
        lines: [
          N(
            'Many small animals have eyes that are very good at spotting movement. It helps them notice danger quickly.',
          ),
          N(
            'That’s why wildlife watchers keep still. A still shape is easy to ignore; a moving one means “run”.',
          ),
        ],
        parentNote:
          'Learned that many animals’ senses are tuned to movement, so watchers keep still.',
      },
    ],
  ),
  // ------------------------------------------------ step 7 done: the wild ones
  scene(
    's25-wild',
    [
      N(
        'Three wild Nubbins come out of the grass. They sniff the toy, bounce away, come back, and sniff him again.',
      ),
      M('That one thinks he can’t hop. That one thinks he smells of indoors.', 'think'),
      M(
        'That one wants to know what he’s for. It doesn’t mean it unkindly. It really wants to know.',
      ),
      N(
        'They lose interest all at once, the way young ones do, and are gone. Your Nubbin picks the toy up and holds him tighter.',
      ),
      M(
        'They think Real is hopping. I thought so too, at their age. I gave up hopping a long time ago.',
        'happy',
      ),
    ],
    [
      {
        domain: 'science',
        skill: 'body features help animals survive in their habitat',
        standard: '3-LS4-3',
        kind: 'notice',
        after: 4,
        lines: [
          N(
            'For a wild creature in long grass, hopping matters: it gets you out of trouble fast and lets you see over the stems.',
          ),
          N(
            'Animals that suit their habitat survive better in it. No wonder the wild ones judge everything by hops.',
          ),
        ],
        parentNote: 'Linked a body feature (hopping) to surviving in a habitat.',
      },
    ],
  ),
  // ------------------------------------------------ step 8 scene: Clank
  scene(
    's25-clank',
    [
      N(
        'A wet afternoon. Moss is on the window ledge again; he says the hill is too damp for his knees.',
      ),
      N('You were not aware he had knees. You decide not to raise it.'),
      N(
        'Something squeaks up the path, whistling, and stops under the window. It’s Clank, with a watering can, in the rain.',
      ),
      CK('Announcement: I am watering the rain! It is going very well!', 'happy'),
      CK(
        'Announcement: what is THAT? On the sill. Is it a Nubbin? Is it a new best friend?',
        'happy',
      ),
      Y('It’s a toy. Hazel knitted him. He’s a toy, mostly. It’s complicated.'),
      CK('Knitted. Somebody made him. Like Pixel made me.', 'think'),
      N(
        'Clank rolls closer, until his chimney nearly touches the glass. His whistle goes very quiet.',
      ),
      CK('Is there a book? There’s a book. Is there a me in it?', 'soft'),
    ],
    [
      {
        domain: 'sel',
        skill: 'thinking about what makes something alive or Real',
        standard: 'RL.3.6',
        kind: 'ask',
        after: 6,
        prompt: [N('Clank was made, like the toy. Can something that was made become Real?')],
        options: [
          {
            label: 'Yes, if it is loved for long enough.',
            reply: [N('That’s what Moss would say. Clank is hoping so too.')],
          },
          {
            label: 'No, made things stay made things.',
            reply: [
              N('Some people think that. Hold on to your answer, and see what Moss says next.'),
            ],
          },
          {
            label: 'It depends what “Real” means.',
            reply: [
              N('That’s a very careful answer. Clank is about to find out that the words matter.'),
            ],
          },
        ],
        parentNote:
          'Gave their own view on a big question and compared it with the characters’ views.',
      },
    ],
  ),
  // ------------------------------------------------ step 8 done: the page
  scene(
    's25-page',
    [
      N(
        'There is a page about clockwork toys in a nursery, and an old horse who has watched them come and go. You read it to him.',
      ),
      N(
        'It says the clockwork toys were sure they would stay clockwork for ever, and never be anything more.',
      ),
      N('Clank’s whistle drops, all the way down, like a kettle taken off the heat.'),
      M('The horse was wrong about that. I’m older than the horse.'),
      N('You pass it on, word for word. Clank’s chimney-light comes up one notch.'),
      CK('Is Real the word? The one I couldn’t find?', 'soft'),
      M('No. It lives next door to it. Keep looking.'),
      N('You pass that on too. Clank thinks about it for so long that the rain stops.'),
      CK('Next door. Announcement: I am going to look next door.', 'soft'),
    ],
    [
      {
        domain: 'literacy',
        skill: 'you can disagree with what a book says',
        standard: 'RL.3.6',
        kind: 'notice',
        after: 3,
        lines: [
          N('Moss has just disagreed with a book. Readers are allowed to do that.'),
          N(
            'A book shows one point of view. You can compare it with your own, and decide what you think.',
          ),
        ],
        parentNote: 'Learned that a reader can compare their own view with a book’s and disagree.',
      },
    ],
  ),
  // ------------------------------------------------ step 9 scene: loved shabby
  scene(
    's25-shabby',
    [
      N(
        'High summer goes by, carried by one ear. The toy goes grey at the seams, and his bobble is loved clean off.',
      ),
      N('Clover comes by with a basket of wool, sees him, and puts her hand over her mouth.'),
      CL(
        'Oh, look at him. Look at his poor seams. He’s gone right through at the elbow, if that’s an elbow.',
        'sad',
      ),
      CL('I could knit you a new one. Same pattern. I’ve got wool in the exact grey.'),
      N(
        'Your Nubbin looks at the new wool. Then it sits down on the old toy, firmly, and looks at nothing.',
      ),
      N('Up on the window ledge, Moss makes a small dry sound that might be a laugh.'),
      M(
        'Once you’re Real, the worn-out bits stop mattering. They’re just where the love went.',
        'soft',
      ),
      N(
        'Clover can’t hear him, and doesn’t need to. She looks at your Nubbin sitting on its toy, and puts the wool away.',
      ),
      CL(
        'No. You’re right. Nobody’s getting a new one. But I’ll darn his elbow, if he’ll let me. In grey.',
        'soft',
      ),
    ],
    [
      {
        domain: 'science',
        skill: 'wool, knitting and why things wear thin',
        standard: '2-PS1-1',
        kind: 'notice',
        after: 2,
        lines: [
          CL(
            'Wool starts as a sheep’s fleece. It’s spun into yarn: lots of short, curly fibres twisted into one long strand.',
          ),
          CL(
            'Knitting is that one strand looped through itself, row after row. Rub it for a whole summer and the fibres wear away.',
          ),
        ],
        parentNote:
          'Learned where wool comes from, how knitting works, and why worn wool goes thin.',
      },
    ],
  ),
  // ------------------------------------------------ step 9 done: darned
  scene(
    's25-darned',
    [
      N(
        'Clover darns his elbow in grey, weaving new yarn over and under across the hole, with your Nubbin watching every stitch.',
      ),
      N(
        'She knots it, bites the thread, and gives him back. Your Nubbin checks the elbow all over, and decides to allow it.',
      ),
      CL(
        'There. Mended isn’t the same as new. It’s better. Hazel told me that over a teacup. I didn’t believe her either.',
        'happy',
      ),
    ],
    [
      {
        domain: 'science',
        skill: 'comparing two solutions to a problem',
        standard: '3-5-ETS1-2',
        kind: 'ask',
        after: 2,
        prompt: [
          N(
            'The problem: a worn-out toy. Solution one: knit a new one. Solution two: darn the old one. Which solves it better for your Nubbin?',
          ),
        ],
        options: [
          {
            label: 'Darning the old one',
            best: true,
            reply: [
              N(
                'Yes. It fixes the hole and keeps the toy your Nubbin loves. It uses less wool too.',
              ),
            ],
          },
          {
            label: 'Knitting a new one',
            reply: [
              N(
                'A new one would be neat and strong. But your Nubbin sat on the old one. The best solution fits the person who needs it.',
              ),
            ],
          },
        ],
        parentNote: 'Compared two solutions to a problem and judged which met the need best.',
      },
    ],
  ),
  // ------------------------------------------------ step 10 scene: the chill
  scene(
    's25-chill',
    [
      N('A few days after the rain on the hill, your Nubbin sneezes at breakfast. Then again.'),
      N('It is warm to the touch and droopy, and it doesn’t want its plum.'),
      N(
        'You have your boots on to fetch somebody before you know you’re doing it. Clover is already at the gate.',
      ),
      CL('It’s a chill. Only a chill. I’m saying it first, so you don’t have to wonder.', 'soft'),
      CL(
        'After a wet week they all get them. Warm, quiet, water little and often, and somebody to sit up with it.',
      ),
      CL('It’ll be right as rain by morning. Well. Right as the day after rain.', 'happy'),
      N('Your Nubbin climbs into its basket with the toy, curls round him, and shuts its eyes.'),
    ],
    [
      {
        domain: 'health',
        skill: 'caring for someone with a mild illness, and asking for help',
        standard: 'CASEL: Responsible decision-making',
        kind: 'notice',
        after: 5,
        lines: [
          N(
            'A chill is a mild cold. Rest lets the body spend its energy on getting better; sips of water stop it drying out.',
          ),
          N(
            'Going for help straight away was the right call. Telling a grown-up early is always a good idea.',
          ),
        ],
        parentNote: 'Learned how to care for a mild illness and why asking for help early matters.',
      },
    ],
  ),
  // ------------------------------------------------ step 10 done: better
  scene(
    's25-better',
    [
      N(
        'Clover looks in at midnight with a cup of something, and again at two, and at four, passing by each time, she says.',
      ),
      N(
        'By morning your Nubbin is cool and hungry and cross about it. It eats two plums and half of yours.',
      ),
      CL('Told you. Right as the day after rain.', 'happy'),
      CL(
        'Now. Everything it slept on gets boiled. Hazel’s rule, and her mother’s, and frankly mine.',
      ),
    ],
    [
      {
        domain: 'maths',
        skill: 'time intervals',
        standard: '3.MD.A.1',
        kind: 'ask',
        after: 0,
        prompt: [
          N(
            'Clover looked in at midnight, two o’clock and four o’clock. How long between each visit?',
          ),
        ],
        options: [
          {
            label: '2 hours',
            best: true,
            reply: [
              N(
                'Yes. Midnight to two is two hours, and two to four is two more. Very regular, for someone “passing by”.',
              ),
            ],
          },
          {
            label: '4 hours',
            reply: [N('Four hours is midnight to four, the whole time. Each gap is two hours.')],
          },
          {
            label: '1 hour',
            reply: [
              N('Count on from midnight: one o’clock, two o’clock. That’s two hours each time.'),
            ],
          },
        ],
        parentNote: 'Worked out the time interval between events.',
      },
    ],
  ),
  // ------------------------------------------------ step 11 scene: the bundle
  scene(
    's25-bundle',
    [
      N(
        'The copper in the wash-house is lit by ten. In go the blankets, the basket cushion, and the old sock, which turns up at last.',
      ),
      N('Then Clover holds her hand out for the toy, and stops.'),
      CL(
        'Oh. Oh, no. Not him. Old wool in a hot copper comes out the size of a walnut. Felted solid.',
        'sad',
      ),
      CL(
        'What we can’t boil goes out with the rags, by the shed. The rag cart takes it. That’s how Hazel always did it.',
      ),
      CL(
        'Or. Cold water, by hand, a whole evening, and you never wring him. He’d come out smaller. But he’d come out.',
        'think',
      ),
      N(
        'Your Nubbin is better, and asleep in the sun on the step, with nothing in its arms for the first time since the storm.',
      ),
      N(
        'The toy is in your hands. He is grey at the seams, darned at one elbow, and his loose eye turns slowly on its thread.',
      ),
    ],
    [
      {
        domain: 'health',
        skill: 'why bedding is washed hot after illness',
        standard: 'CASEL: Responsible decision-making',
        kind: 'notice',
        after: 0,
        lines: [
          N(
            'Germs from a cold can stay on bedding. Washing it in very hot water gets rid of most of them, so nobody else catches it.',
          ),
        ],
        parentNote: 'Learned why bedding is washed in hot water after someone has been ill.',
      },
      {
        domain: 'science',
        skill: 'some changes from heating cannot be undone',
        standard: '2-PS1-4',
        kind: 'ask',
        after: 2,
        prompt: [
          N(
            'Wool fibres have tiny scales. Heat and rubbing make them tangle and lock tight: that’s felting.',
          ),
          N('If the toy felts, can you un-felt him?'),
        ],
        options: [
          {
            label: 'No. Felting can’t be undone.',
            best: true,
            reply: [N('Right. Like a baked cake, it can’t go back. That’s why Clover stopped.')],
          },
          {
            label: 'Yes. Just stretch him back out.',
            reply: [
              N(
                'Sadly not. Once the fibres lock together, they stay locked. Some changes only go one way.',
              ),
            ],
          },
        ],
        parentNote:
          'Learned that some changes caused by heating, like felting wool, cannot be reversed.',
      },
    ],
    [
      {
        id: 'gone',
        label: 'Let him go with the bundle.',
        set: { 's25-toy': 'gone' },
        then: [
          N(
            'You put him on top of the rag bundle, the right way up, with his good eye to the sky.',
          ),
          CL('That’s a kind way to do it. Hazel always put the soft things on top, too.', 'soft'),
        ],
      },
      {
        id: 'kept',
        label: 'Wash him yourself, by hand, in cold water.',
        set: { 's25-toy': 'kept' },
        then: [
          N(
            'Clover fills the tin bath from the pump, sits on the step, and tells you what not to do, which is most things.',
          ),
          CL('Squeeze. Don’t wring. Don’t rush him. You’ll want to rush him. Don’t.'),
        ],
      },
    ],
  ),
  // ------------------------------------------------ step 11 done: the shed (gone)
  scene(
    's25-shed',
    [
      N('You carry the bundle out and set it by the shed door, the toy on top.'),
      N(
        'The sun goes down behind the hill, and the shadows of the fence posts stretch out long across the lawn.',
      ),
      N('Your Nubbin, asleep on the step, doesn’t wake. You don’t wake it.'),
    ],
    [
      {
        domain: 'science',
        skill: 'sunset happens because the Earth turns',
        standard: '5-ESS1-2',
        kind: 'notice',
        after: 1,
        lines: [
          N(
            'The sun doesn’t really go down. The Earth is turning, and your bit of it is turning away from the sun.',
          ),
          N(
            'As the sun gets lower in the sky, shadows get longer. At noon, when it’s highest, they’re shortest.',
          ),
        ],
        parentNote:
          'Learned that sunset is caused by the Earth turning, and how shadows change length.',
      },
    ],
  ),
  // ------------------------------------------------ step 12 scene: the dew (gone)
  scene(
    's25-dew',
    [
      N(
        'That night you can’t sleep. You sit on the window seat in the dark, where he used to sit, and look out at the shed.',
      ),
      N('The dew comes down. The bundle by the shed door goes silver at the edges.'),
      N('A drop of it runs off his button eye, slowly, and falls into the wet grass.'),
      N(
        'Where it lands, something small and pale lifts out of the grass: a light, no bigger than a thimble.',
      ),
      N(
        'It rises the way Moss says the first ones came up out of the spring: not quickly, as if it had been asked.',
      ),
      N(
        'It goes low across the lawn, past the pond, and into the long grass, and is gone among the wild ones.',
      ),
      N('You don’t go out. It seems like something you aren’t meant to follow.'),
    ],
    [
      {
        domain: 'literacy',
        skill: 'how size comparisons help a reader picture something',
        standard: 'L.4.5',
        kind: 'ask',
        after: 3,
        prompt: [
          N(
            'The light is “no bigger than a thimble”. Why does the writer compare it to a thimble?',
          ),
        ],
        options: [
          {
            label: 'So you can picture exactly how tiny it is.',
            best: true,
            reply: [
              N(
                'Yes. A thimble fits on a fingertip. Comparing it to something real helps you see it in your head.',
              ),
            ],
          },
          {
            label: 'Because the light is made of metal.',
            reply: [
              N('It isn’t metal! The thimble is only there to show its size: fingertip-small.'),
            ],
          },
        ],
        parentNote: 'Explained how a comparison helps the reader picture the size of something.',
      },
    ],
  ),
  // ------------------------------------------------ step 12 done: the gap (gone)
  scene(
    's25-gap',
    [
      N(
        'In the morning there is a gap in the top of the rag bundle, the shape of a small lumpy Nubbin. Nothing else is disturbed.',
      ),
      N(
        'In the wet grass by the shed is a button on a long loose thread. You put it in your pocket.',
      ),
      N(
        'After breakfast your Nubbin goes to the edge of the long grass and sits there a while. Then it comes back and eats its plum.',
      ),
      N('It doesn’t look sad. It looks like somebody who has just waved somebody off.'),
      N('Up on the hill, Moss is looking at the long grass. He doesn’t say anything all day.'),
    ],
    [
      {
        domain: 'sel',
        skill: 'reading feelings, and mixed feelings at goodbyes',
        standard: 'CASEL: Social awareness',
        kind: 'ask',
        after: 3,
        prompt: [N('How do you think your Nubbin feels?')],
        options: [
          {
            label: 'Sad, but all right.',
            reply: [N('That’s a thoughtful answer. You can miss someone and still be all right.')],
          },
          {
            label: 'Happy for the toy.',
            reply: [
              N(
                'That fits too. Sometimes a goodbye is the start of something good for the other person.',
              ),
            ],
          },
          {
            label: 'A bit of both.',
            reply: [N('Lots of goodbyes feel like that: two feelings at once. Both are allowed.')],
          },
        ],
        parentNote:
          'Thought about how a character feels after a goodbye, including mixed feelings.',
      },
    ],
  ),
  // ------------------------------------------------ step 13 scene: the falls (gone)
  scene(
    's25-falls',
    [
      N(
        'You come home from the Hollow with the notebook inside your coat. It’s late, and the cottage smells of cold ashes.',
      ),
      N(
        'Moss is on the window ledge. He doesn’t ask about the notebook, and you don’t tell him yet.',
      ),
      N(
        'On the window seat, where the toy used to sit, there is a patch of faded cushion the shape of a small lumpy Nubbin.',
      ),
      N('There is one thing you do want to tell him.'),
      N(
        'You went along the ledge behind the falls today. You put your hand on the rock, and the rock was warm.',
      ),
    ],
    [fallsLesson],
  ),
  // ------------------------------------------------ step 13 done: twice (gone)
  scene(
    's25-twice',
    [
      Y('There’s a pool behind the falls. Warm. Steaming a bit. Lit from underneath, by nothing.'),
      M('The Wellspring. Yes.', 'soft'),
      M(
        'The first ones came up out of the warm water as small lights. Nobody ever told me where the lights came from.',
        'think',
      ),
      N('He looks out across the dark lawn, past the pond, to the long grass.'),
      M('I’ve a guess.', 'soft'),
      N('He doesn’t say what it is. You think you know where he’s looking.'),
    ],
    [guessLesson(5)],
  ),
];

// ------------------------------------------------ complete
const S25_COMPLETE: EduScene = scene(
  's25-complete',
  [
    N(
      'He asks you to write it down, so you do: a new page in the journal, on the window seat, by the last of the lamplight.',
    ),
    N('At the top, in capitals: HOW TOYS BECOME REAL.'),
    N('Underneath, what Moss said, as near as you can get it.'),
    M('Twice round, and loved the whole way, and settled in itself.', 'soft'),
    Y('What does that mean?'),
    M('It means what it says. I am old, and it is late, and the hill is a long way up.'),
    N(
      'He climbs down off the ledge and sets off into the dark. It will take him until morning, and he says he likes it.',
    ),
    N('The page says nothing more. You leave the next one blank, in case.'),
  ],
  [
    {
      domain: 'literacy',
      skill: 'theme: what a whole story is about',
      standard: 'RL.4.2',
      kind: 'ask',
      after: 7,
      prompt: [
        N('Every story has a theme: a big idea under the events. Which is closest to this one’s?'),
      ],
      options: [
        {
          label: 'Being loved for a long time changes you.',
          best: true,
          reply: [
            N(
              'Yes. The toy, Clank, even Moss: the story keeps showing that love, given slowly, is what makes things Real.',
            ),
          ],
        },
        {
          label: 'Never let toys get dirty.',
          reply: [
            N(
              'The story says the opposite! The toy gets worn because he’s loved. The theme is that love makes things Real.',
            ),
          ],
        },
        {
          label: 'Storms are scary.',
          reply: [
            N(
              'The storm is one event. The big idea under all of them is that being loved for a long time makes things Real.',
            ),
          ],
        },
      ],
      parentNote: 'Identified the theme of a story from its events.',
    },
  ],
);

// ================================================================== variant scenes
export const EDU_S25_READER_VARIANTS: EduScene[] = [
  // step 2 done, if c4-open has played
  scene(
    's25-sill-late',
    [
      N('The lamp comes on: a warm ring of light, and a small, satisfied tick every second.'),
      N(
        'Everyone goes down the ladder talking about the moth. You go last, with the toy and the book, and set them on the window seat for now.',
      ),
      N(
        'For now turns into a week, and then a fortnight. The toy sits on the sill and gets the afternoon sun.',
      ),
      N('Nobody looks at it. You don’t either, though you mean to.'),
      N(
        'Out of the window, on top of the western hill, Moss is looking this way. He would tell you he was looking at the weather.',
      ),
    ],
    [sillLesson],
  ),
  // step 4 scene, no Sable
  scene(
    's25-storm-nosable',
    [
      N(
        'Later that week your Nubbin finds the toy on the sill. It sniffs it, sneezes, and goes off after a moth.',
      ),
      N('Not yet, then.'),
      ...STORM,
    ],
    stormLessons(5),
  ),
  // step 8 done, with s21Done and a13-clank-word
  scene(
    's25-page-found',
    [
      N(
        'There is a page about clockwork toys in a nursery, and an old horse who has watched them come and go. You read it to him.',
      ),
      N(
        'It says the clockwork toys were sure they would stay clockwork for ever, and never be anything more.',
      ),
      N('Clank listens with his chimney-light steady. His whistle doesn’t drop at all.'),
      M('The horse was wrong about that. I’m older than the horse.'),
      N(
        'You pass it on. Clank does a small spin on his one wheel, the way he does when he knew something already.',
      ),
      CK('Announcement: I found my word already. In Nova’s book. Next to a wooden boy.', 'happy'),
      CK('Is Real the same word? I don’t think it is the same word.', 'think'),
      M('No. It lives next door to it. He’s already knocked.'),
      N('You pass that on. Clank’s whistle rises, just a little, and holds.'),
      CK('Next door. Announcement: I have a neighbour.', 'soft'),
    ],
    [
      {
        domain: 'literacy',
        skill: 'words with close but different meanings',
        standard: 'L.3.4',
        kind: 'notice',
        after: 7,
        lines: [
          N(
            'Some words live “next door” to each other: close in meaning, but not the same. Think of “glad” and “joyful”, or “alive” and “Real”.',
          ),
          N(
            'Finding exactly the right word, not just a nearby one, is something good writers work hard at.',
          ),
        ],
        parentNote: 'Explored words with close but different meanings.',
      },
    ],
  ),
  // step 8 scene, without s21Done
  scene(
    's25-byte',
    [
      N(
        'A wet afternoon. Moss is on the window ledge again; he says the hill is too damp for his knees.',
      ),
      N('You were not aware he had knees. You decide not to raise it.'),
      N(
        'Byte comes up the path under an umbrella, with his clipboard in a plastic bag, to return a pencil Hazel lent him nine years ago.',
      ),
      BY(
        'She said bring it back when I’d finished with it. I’ve finished with it. It took longer than projected.',
        'think',
      ),
      N('He sees the toy on the sill, and stops.'),
      BY('Fern says your Nubbin made her apologise to that. Formally. With the good cups.'),
      BY('And that you said it was Real. I’d like to know what you meant. Ideally in a unit.'),
      BY('Hazel had a book for everything. Is there a book?'),
    ],
    [
      {
        domain: 'literacy',
        skill: 'multiple-meaning words: “long”',
        standard: 'L.3.4',
        kind: 'ask',
        after: 6,
        prompt: [
          BY(
            'I want to log how long the toy gets held. But “long” has two meanings. Which one do I mean?',
          ),
        ],
        options: [
          {
            label: 'How much time',
            best: true,
            reply: [BY('Correct. Time: hours and minutes. Noted.')],
          },
          {
            label: 'How many metres',
            reply: [
              BY(
                'That’s the other “long”: length, in metres. I mean time. Confusing word, “long”.',
              ),
            ],
          },
        ],
        parentNote:
          'Worked out which meaning of a multiple-meaning word (“long”) fitted the sentence.',
      },
    ],
  ),
  // step 8 done, without s21Done
  scene(
    's25-page-byte',
    [
      N(
        'You find the page where the old horse explains it, and read it out. Byte writes it all down.',
      ),
      N('Then he reads back what he’s written, and frowns at it.'),
      BY(
        'There isn’t a single number on this page. Not one. How is anybody meant to check it?',
        'think',
      ),
      BY(
        'Can it be measured? Ask him. I know you can hear him. I’ve stopped pretending I think you can’t.',
      ),
      M('Tell him to try.'),
      N(
        'You tell him. Byte looks at the toy for a long time, then at his clipboard, then turns to a clean page.',
      ),
      BY(
        'Fine. A log. Hours held. Times carried. Times dropped, and gone back for in the dark. I’ll let you know.',
      ),
    ],
    [
      {
        domain: 'maths',
        skill: 'reading a tally chart and finding a difference',
        standard: '3.MD.B.3',
        kind: 'do',
        after: 6,
        check: 'edu:read:tally:s25-log',
        lines: [
          BY(
            'A week later, the tally chart: carried 23 times, dropped 7 times, gone back for 7 times out of 7.',
            'happy',
          ),
          BY(
            'Read it with me. How many more times carried than dropped? 23 − 7 = 16. And every drop was gone back for.',
          ),
        ],
        parentNote: 'Read a tally chart and worked out a difference by subtracting.',
      },
      {
        domain: 'sel',
        skill: 'thinking about what can and can’t be measured',
        standard: 'CASEL: Self-awareness',
        kind: 'ask',
        after: 6,
        prompt: [N('Byte’s numbers show something. Can they measure love?')],
        options: [
          {
            label: 'Yes, a bit: they show care.',
            reply: [N('That’s a fair answer. Going back every time is a kind of evidence.')],
          },
          {
            label: 'No. Love is a feeling, not a number.',
            reply: [
              N(
                'Many people agree. Numbers can show what someone does, but not quite how they feel.',
              ),
            ],
          },
          {
            label: 'Some of it, but not all.',
            reply: [N('That’s a careful answer. Byte might even agree, eventually.')],
          },
        ],
        parentNote: 'Thought about what numbers can and can’t tell us about feelings.',
      },
    ],
  ),
  // step 11 done, kept
  scene(
    's25-shed-kept',
    [
      N(
        'You carry the bundle out to the shed without him. He is in the tin bath, under the cold water, waiting for your hands.',
      ),
      N(
        'A whole slow evening: cold water, a sliver of soap, and squeezing, and never wringing. Clover checks, and says “again”.',
      ),
      N('Your hands go numb, and then they go patient.'),
    ],
    [
      {
        domain: 'sel',
        skill: 'patience with slow, careful work',
        standard: 'CASEL: Self-management',
        kind: 'notice',
        after: 2,
        lines: [
          N(
            'Some jobs can’t be hurried. Rushing would felt the wool, and then there’d be no going back.',
          ),
          N(
            'Patience isn’t just waiting. It’s choosing to keep going carefully, even when you’d like to be finished.',
          ),
        ],
        parentNote: 'Talked about patience as choosing to work carefully, not quickly.',
      },
    ],
  ),
  // step 12 scene, kept
  scene(
    's25-line',
    [
      N(
        'It is past dark when Clover says that will do. Your fingers are white and wrinkled, and you can’t feel them.',
      ),
      N(
        'You roll him in a towel and press, and never twist. Clover nods, which from Clover is a medal.',
      ),
      CL(
        'Now you leave him. Overnight, flat, by the range. Not too near. Wool doesn’t like being rushed any more than the rest of us.',
      ),
      N('His loose eye came off in the rinse. Clover holds out her palm for it.'),
      CL('I’ll sew it back tomorrow, with proper thread. It’ll outlast both of us.'),
      N(
        'Your Nubbin wakes on the step, looks round for him, and finds him on the towel by the range.',
      ),
      N('It lies down beside the towel: not on it, beside it.'),
    ],
    [
      {
        domain: 'science',
        skill: 'materials that absorb water',
        standard: '2-PS1-1',
        kind: 'ask',
        after: 1,
        prompt: [N('Why does rolling him in a towel and pressing help?')],
        options: [
          {
            label: 'The towel absorbs the water from the wool.',
            best: true,
            reply: [
              N(
                'Yes. Towels are made of loops that soak up water, so pressing moves the water out of the toy and into the towel.',
              ),
            ],
          },
          {
            label: 'The towel keeps him warm.',
            reply: [
              N(
                'It might, a little. But mostly the towel absorbs the water, pulling it out of the wool.',
              ),
            ],
          },
        ],
        parentNote: 'Explained how an absorbent material soaks up water.',
      },
    ],
  ),
  // step 12 done, kept
  scene(
    's25-line-dry',
    [
      N(
        'In the morning you peg him on the line by his ears. By noon he’s dry: a size smaller, lumpier, and somehow more himself.',
      ),
      N(
        'Clover sews his eye back on, tight, and gives you a spare button from her tin, the same brown, for your Nubbin to wear.',
      ),
      N('He goes back on your Nubbin’s bed, and stays there for good.'),
      N(
        'At teatime Moss comes down to the ledge and looks through the window at him on the bed for a long while.',
      ),
      M(
        'Then he’s Real to you. That’s how it ends for most of them. It’s the better ending, mostly.',
        'soft',
      ),
    ],
    [
      {
        domain: 'science',
        skill: 'sunlight and wind dry wet things by evaporation',
        standard: 'K-PS3-1',
        kind: 'notice',
        after: 0,
        lines: [
          N(
            'Sunlight warms the wet wool, and the water in it turns into vapour and drifts away. That’s evaporation.',
          ),
          N(
            'A breeze helps by carrying the damp air off, so drier air can take its place. Sun plus wind is the best drying day.',
          ),
        ],
        parentNote: 'Learned that sunlight and wind dry wet things by evaporation.',
      },
    ],
  ),
  // step 13 scene, kept
  scene(
    's25-falls-kept',
    [
      N(
        'You come home from the Hollow with the notebook inside your coat. It’s late, and the cottage smells of cold ashes.',
      ),
      N(
        'Moss is on the window ledge. He doesn’t ask about the notebook, and you don’t tell him yet.',
      ),
      N('On your Nubbin’s bed the toy is waiting, a size smaller, with both eyes on tight.'),
      N('There is one thing you do want to tell him.'),
      N(
        'You went along the ledge behind the falls today. You put your hand on the rock, and the rock was warm.',
      ),
    ],
    [fallsLesson],
  ),
  // step 13 done, kept
  scene(
    's25-twice-kept',
    [
      Y('There’s a pool behind the falls. Warm. Steaming a bit. Lit from underneath, by nothing.'),
      M('The Wellspring. Yes.', 'soft'),
      M(
        'The first ones came up out of the warm water as small lights. Nobody ever told me where the lights came from.',
        'think',
      ),
      N(
        'He looks through the window at your Nubbin, asleep on its bed with its arms round the toy.',
      ),
      M('I’ve a guess. It’s only a guess.', 'soft'),
      M('He can stay where he is while I think about it.'),
    ],
    [guessLesson(5)],
  ),
  // the spring coda
  codaWild('button'),
  codaWild('bobble'),
  codaWild('mister'),
  codaCoat('button'),
  codaCoat('bobble'),
  codaCoat('mister'),
  // idle lines
  scene(
    's25-moss-kept',
    [
      N('Moss is watching your Nubbin drag the toy through the daisies by one ear.'),
      M('He’s getting shabbier. Good. Keep it up.', 'happy'),
    ],
    [
      {
        domain: 'science',
        skill: 'a daisy head is many tiny flowers, visited by insects',
        standard: '2-LS2-2',
        kind: 'notice',
        after: 0,
        lines: [
          N(
            'A daisy looks like one flower, but the yellow middle is made of many tiny flowers packed together.',
          ),
          N(
            'Bees and hoverflies visit them, carrying pollen from one to the next, so new daisies can grow.',
          ),
        ],
        parentNote: 'Learned that a daisy head is many small flowers, pollinated by insects.',
      },
    ],
  ),
  scene(
    's25-moss-gone',
    [
      N('Moss is looking at the long grass again.'),
      M(
        'Nothing. I’m only looking. I’m allowed to look at grass. It is most of what I do.',
        'soft',
      ),
    ],
    [
      {
        domain: 'sel',
        skill: 'remembering as a way of missing someone',
        standard: 'CASEL: Self-awareness',
        kind: 'notice',
        after: 1,
        lines: [
          N(
            'Sometimes looking at a place is how we remember someone. It’s a quiet way of missing them, and that’s all right.',
          ),
        ],
        parentNote: 'Noticed a quiet, healthy way of missing someone.',
      },
    ],
  ),
  scene(
    's25-clank-next-door',
    [
      CK('Announcement: I live next door to a word. Moss says so.', 'happy'),
      CK('Next door is a very good place to live. You can wave.', 'soft'),
    ],
    [
      {
        domain: 'social-studies',
        skill: 'neighbours and community',
        standard: 'D2.Civ.8.K-2',
        kind: 'notice',
        after: 1,
        lines: [
          N(
            'Neighbours wave, lend pencils, and return them, eventually. Small kindnesses like that are what make a community.',
          ),
        ],
        parentNote: 'Talked about the small kindnesses that make a community.',
      },
    ],
  ),
];

const S25: EduQuest = {
  id: 'reader:s25',
  of: 's25',
  band: 'reader',
  title: 'Real',
  goals: {
    's25-step1': {
      goal: 'Open the parcel in Hazel’s hand under the loft eaves.',
      hint: 'It’s on the trunk under the little window. Pull the right end of the string.',
    },
    's25-step2': {
      goal: 'Help Pixel get the loft lamp working.',
      hint: 'Hold the lamp steady while Pixel winds. Pass her the small cog, not the shiny one.',
    },
    's25-step3': {
      goal: 'Stay on the window seat until Moss has finished.',
      hint: 'Don’t get up, and don’t tap anything else. He’s slow, and he’s nearly done.',
    },
    's25-step4': {
      goal: 'Give your Nubbin something to hold.',
      hint: 'Take the knitted toy off the window seat and put it in the basket.',
    },
    's25-step5': {
      goal: 'Find the toy before it gets too dark. Your Nubbin won’t sleep without it.',
      hint: 'Take a lantern. Start by the pond.',
    },
    's25-step6': {
      goal: 'Go back to Fern’s for tea, with the toy, so she can apologise properly.',
      hint: 'Let your Nubbin carry him in.',
    },
    's25-step7': {
      goal: 'Let the wild Nubbins have a look at the toy.',
      hint: 'Stand by Moss and keep still. Wild ones notice movement.',
    },
    's25-step8': {
      goal: 'Find the right page in Hazel’s book.',
      hint: 'The book is on the window seat. The page you want has the old horse on it.',
    },
    's25-step9': {
      goal: 'Hold the toy steady while Clover darns his elbow.',
      hint: 'Your Nubbin won’t let go, so hold them both.',
    },
    's25-step10': {
      goal: 'Sit up with your Nubbin through the night.',
      hint: 'Stay by the basket, and give it water when it wakes. Clover will look in.',
    },
    's25-step11': {
      goal: 'Carry the rag bundle out to the shed.',
      hint: 'It goes by the shed door for the rag cart.',
    },
    's25-step12': {
      goal: 'See the night through, and go and look in the morning.',
      hint: 'Stay at the window seat until it’s light.',
    },
    's25-step13': {
      goal: 'Tell Moss about the warm water behind the falls.',
      hint: 'Sit on the window seat beside his ledge.',
    },
  },
  scenes: [...S25_SCENES, S25_COMPLETE],
  glossary: [
    gloss(
      'eaves',
      'The edges of a roof that hang out over the walls; inside a loft, the low corners under them.',
      's25-loft',
    ),
    gloss('clockwork', 'Machinery driven by a spring you wind up with a key.', 's25-lamp'),
    gloss('fortnight', 'Two weeks, or fourteen days.', 's25-sill'),
    gloss(
      'metaphor',
      'Saying one thing is another to describe it, like calling a prickly person “sharp-edged”.',
      's25-hurt',
    ),
    gloss(
      'condensation',
      'When water vapour in the air cools and turns into liquid drops, like dew.',
      's25-everywhere',
    ),
    gloss('unreservedly', 'Completely, with nothing held back.', 's25-apology'),
    gloss(
      'habitat',
      'The natural home of an animal or plant, where it finds what it needs.',
      's25-wild',
    ),
    gloss('darn', 'To mend a hole by weaving new yarn over and under across it.', 's25-shabby'),
    gloss('chill', 'A mild cold that makes you shivery and tired for a short while.', 's25-chill'),
    gloss(
      'felt',
      'To shrink wool into a thick, tight mat with heat and rubbing; it can’t be undone.',
      's25-bundle',
    ),
    gloss(
      'thimble',
      'A small metal cap worn on a fingertip to push a needle when sewing.',
      's25-dew',
    ),
    gloss('geothermal', 'Heat that comes from deep inside the Earth.', 's25-falls'),
  ],
  notes:
    'Reader band. Keeps every choice. No lifted text: the book’s lines are rewritten. Moss is silent and unnamed in ' +
    's25-sill, named and silent in s25-sill-late, and speaks from s25-real on, heard only by you. Think questions in ' +
    's25-real, s25-clank, s25-page-byte, s25-gap and the twice scenes.',
};

export const EDU_S25_READER: EduQuest[] = [S25];

/** Every `edu:` check string used in this file. */
export const CHECKS: string[] = ['edu:read:tally:s25-log'];
