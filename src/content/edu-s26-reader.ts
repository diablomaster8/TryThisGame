/**
 * The Learning Grove, reader band (ages 7–10): S26 The Walled Garden.
 *
 * Source: side-stories-s26.ts (SIDE_STORY_S26 and SIDE_STORY_S26_VARIANTS). One EduScene per
 * original scene, id `reader:<original id>`: the 26 step and done scenes and s26-complete live in
 * the quest; the 15 variants (the Thrums door, the six ramp and lift preludes, Tobin’s cellar
 * bench, the lifted snow scene, the two other complete scenes and the four campaign hooks) live in
 * EDU_S26_READER_VARIANTS and replace scenes exactly as the main quest’s notes say. See EDU-STYLE.md.
 *
 *   Learning angle (outline): bulbs and the seasons (3-LS1-1), how robins live (food, territory),
 *   how pruning helps roses (K-ESS3-3), and ramps and gardens built so everyone can use them
 *   (3-5-ETS1-2, K-2-ETS1-1, D2.Civ.8.K-2, the ramp maths: 3 × 15 cm = 45 cm, and the one-in-twelve
 *   rule, 45 × 12 = 540 cm). Also molehills, walled gardens and the sun’s warmth, perimeter, the
 *   south wall and the Sun’s path, fractions, seeds carried by animals, short winter days, family
 *   likeness, slopes and gravity, ivy, vibration, rosehips; multiple-meaning words, metaphor,
 *   exaggeration, character and theme. Think questions (no best answer): s26-steps (now, or on
 *   your own every day?), s26-moss-wall, s26-hush, s26-tobin-finds (safe or well?),
 *   s26-key-choice and end-epi-garden-cold.
 *
 * - Every choice keeps its original id and `set`; the reader band keeps every choice.
 * - Care notes kept: Linnet is never cured, pitied or called “brave”, and never made a lesson for
 *   anyone; every fix is to the place (a ramp, raised beds), never to her. Nobody touches her chair
 *   or lifts her without asking. In the snow the steps are at fault, and she directs the digging.
 *   The robin never speaks; your Nubbin never speaks. The Thrums (S12’s hive) speak as one chorus.
 *   Moss speaks (chapter 6 onwards). Hazel is silent in c12-wall-garden.
 * - Hard things: the last still Nubbin, Hush and Moss fade; fading is said plainly as dying, with
 *   comfort straight after. Hush “letting herself fade” becomes “she faded too”.
 * - No lines from the novel and none of the main lines the quest swaps out with childLines; the
 *   patch-of-earth request, the still garden and the valley word for alive are written fresh.
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
const DU = say('dusty');
const SP = say('sparks');
const FE = say('fern');
const L = say('linnet');
const T = say('tobin');
const MU = say('s26-mum');
const TH = say('thrums');

// ---------------------------------------------------------------- builders
type LessonIn = Omit<Lesson, 'id'>;
type Opt = NonNullable<Lesson['options']>[number];

const opt = (label: string, reply: Line[], best = false): Opt =>
  best ? { label, best, reply } : { label, reply };

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
/** Tobin’s way out, shared by s26-tobin-bench and s26-tobin-bench-cellar. */
const TOBIN_WAY_OUT: Line[] = [
  N('On the way out, at the door, he puts his hand flat on the old wall.'),
  T(
    'My old gaffer used to say: put a rose where your worry sits, and the worry has to go and sit somewhere else.',
    'soft',
  ),
  T('He was a terrible gardener. He was right about that, though.'),
];

/** The metaphor lesson that goes with TOBIN_WAY_OUT (played after its middle line). */
const roseWorry = (after: number): LessonIn => ({
  domain: 'literacy',
  skill: 'understand a metaphor',
  standard: 'L.4.5',
  kind: 'ask',
  after,
  prompt: [N('Worries don’t really sit on chairs. What does Tobin’s old saying mean?')],
  options: [
    opt(
      'Fill your mind with something good to look after, and there’s less room for worrying.',
      [
        N('Yes. It’s a metaphor: it talks about worry as if it were a person needing a seat.'),
        N('Tobin has just done it. He watched Linnet garden, and his worry had nowhere to sit.'),
      ],
      true,
    ),
    opt('Roses scare worries away with their thorns.', [
      N('Ha. Nice picture, but it’s a metaphor, not a fact about thorns.'),
      N('It means: give your mind something good to tend, and the worry has less room.'),
    ]),
  ],
  parentNote:
    'Explained what a metaphor about worry means, using what had just happened in the story.',
});

/** The complete scene: shared opening and close; the middle line follows s26-key. */
const COMPLETE_START: Line[] = [
  N(
    'Winter sun comes over the old wall and lies along the beds. The garden is still mostly bare, but it is not grey.',
  ),
  N(
    'Dusty is hanging the ivy on a rail over the door, so it swings like a curtain. The robin is supervising.',
  ),
];
const COMPLETE_END: Line[] = [
  DU(
    'The stone from the old steps is still in a heap. I’m making you a bench out of it, like Hush’s. For the Grove.',
    'happy',
  ),
  DU(
    'And this. I wore it every day Fossil and I went digging. It’s yours now. You dig like you mean it.',
    'soft',
  ),
  N(
    'It is a gardener’s apron, with earth worked into every seam. Linnet crowns you with snowdrops.',
  ),
  L('You can’t take them off until tea. I’ll be checking.', 'happy'),
  N(
    'Linnet’s mum sits on Hush’s bench with Tobin. They argue about which of them she gets her chin from.',
  ),
  L('Me. I get it from me.', 'happy'),
  N(
    'The robin has decided it lives with you now, in a general sort of way. The door stays open behind you.',
  ),
];

// ================================================================== the quest
const S26: EduQuest = {
  id: 'reader:s26',
  of: 's26',
  band: 'reader',
  title: 'The Walled Garden',
  goals: {
    's26-step1': {
      goal: 'Find out what the robin on the old wall post wants from you.',
      hint: 'It wants feeding, obviously. Hold out a crumb by the old wall post and keep still.',
    },
    's26-step2': {
      goal: 'Say hello to the girl at Old Tobin’s gate.',
      hint: 'Tobin’s cottage is at the bottom of the lane, by the shiny lamp post. Let her set the pace.',
    },
    's26-step3': {
      goal: 'Follow the robin along the old wall with Linnet.',
      hint: 'Watch where the robin scratches. Leave the ground round the lantern post alone; you know why.',
    },
    's26-step4': {
      goal: 'Fetch Dusty to the hidden garden. Dusty will know if anything in it is alive.',
      hint: 'Dusty is up on the cliff. Bring them along the old wall to the ivy door.',
    },
    's26-step5': {
      goal: 'Decide, with Linnet, how she gets down the three steps.',
      hint: 'Ask her first. It’s her garden as much as anyone’s.',
    },
    's26-step6': {
      goal: 'Wait in the garden at dusk and catch whoever has been pruning the roses.',
      hint: 'Sit on the stone bench as the light goes, and keep still. Watch the top of the far wall.',
    },
    's26-step7': {
      goal: 'Help Linnet choose a patch of the garden for her own.',
      hint: 'Stop at each corner so she can see it. She’ll know it when she sees it.',
    },
    's26-step8': {
      goal: 'Sit on the stone bench with Moss and hear the garden’s story.',
      hint: 'The bench is in the middle of the garden. Sit down, and let him take his time.',
    },
    's26-step9': {
      goal: 'Plant the autumn bulbs in Linnet’s raised beds.',
      hint: 'The bulb sack is inside the door. Your Nubbin will carry some. Some.',
    },
    's26-step10': {
      goal: 'Bring Tobin into the garden instead of hiding it from him.',
      hint: 'Don’t send him away. Get him onto Hush’s bench, and let the garden do the rest.',
    },
    's26-step11': {
      goal: 'Find Linnet in the walled garden.',
      hint: 'Follow her wheel tracks in the snow, along the old wall to the ivy door.',
    },
    's26-step12': {
      goal: 'Walk Linnet’s mum up to the walled garden.',
      hint: 'Along the old wall to the ivy door. Don’t tell her anything on the way. Let her hear it.',
    },
    's26-step13': {
      goal: 'Decide what happens to the garden key.',
      hint: 'There’s no wrong answer. The door stays open whichever you choose.',
    },
  },
  scenes: [
    // ------------------------------------------------ 1. The Robin
    scene(
      's26-robin',
      [
        N(
          'Late summer. The rain has stopped at last, and Fossil’s flower is a few days old on the hill.',
        ),
        N('Dusty hasn’t come down from the cliff since.'),
        N('A robin has taken over the old wall lantern post. It sits on top like a lid.'),
        N(
          'Wherever you go, it goes: the pond, the woodpile, the cottage step. It never comes closer than a spade’s length.',
        ),
        N('It looks at you the way a landlord looks at a tenant who owes the rent.'),
        FE(
          'It’s decided you owe it something. Robins do that. One followed me for a whole spring over a raisin.',
          'think',
        ),
        FE('I never found out which raisin.'),
        N(
          'Your Nubbin sits under the post and stares up at it. The robin stares back. Neither of them blinks first.',
        ),
      ],
      [
        {
          domain: 'science',
          skill: 'robins follow diggers to find food',
          standard: 'K-LS1-1',
          kind: 'notice',
          after: 3,
          lines: [
            FE(
              'Robins follow gardeners on purpose, you know. A spade turns up worms and grubs.',
              'think',
            ),
            FE(
              'So a robin stays near anyone who looks as if they might dig. It’s not friendship. It’s lunch.',
            ),
          ],
          parentNote:
            'Learned that robins follow people who dig because digging turns up worms and grubs to eat.',
        },
      ],
    ),
    scene(
      's26-robin-fed',
      [
        N(
          'You hold out a crumb of one of Fern’s lantern buns. The robin considers it, and you, and the crumb again.',
        ),
        N('Then it takes it off your palm, quick as a pinch, and goes back to the post.'),
        N('It hops from the post onto the ivy, and looks at you over its shoulder.'),
        N('Then it sets off down the lane. Your Nubbin follows it. You follow your Nubbin.'),
        Y('I think I’ve just been hired.'),
        N('The robin doesn’t look back to check. It knows.'),
      ],
      [
        {
          domain: 'science',
          skill: 'what robins eat',
          standard: 'K-LS1-1',
          kind: 'ask',
          after: 1,
          prompt: [N('A bun crumb is a treat. What do robins mostly eat in the wild?')],
          options: [
            opt(
              'Worms, insects, spiders, berries and seeds',
              [
                N(
                  'Right. Robins eat small creatures most of the year, and berries and seeds in winter.',
                ),
              ],
              true,
            ),
            opt('Mostly bread', [
              N(
                'Bread is only a snack, and not a very good one. Robins mostly eat worms, insects, spiders, berries and seeds.',
              ),
            ]),
            opt('Grass', [
              N(
                'Robins don’t graze like sheep. They eat worms, insects and spiders, plus berries and seeds.',
              ),
            ]),
          ],
          parentNote:
            'Learned what wild robins eat: small creatures, berries and seeds, with bread only a snack.',
        },
      ],
    ),
    // ------------------------------------------------ 2. Linnet
    scene(
      's26-linnet',
      [
        N(
          'The robin leads you down the lane to a cottage with a lamp post outside it, polished like a medal.',
        ),
        N(
          'An old man in a lamplighter’s coat is getting a wheelchair over the doorstep. The girl in it is telling him how, very loudly.',
        ),
        L('No. Back wheels first. Grandad. Back. Wheels. First.', 'angry'),
        T('I know which wheels, love, I’ve been doing wheels since before—', 'think'),
        N(
          'He gets it over the step. She takes the rims herself the moment it lands, and spins round to look at you.',
        ),
        T(
          'Hazel’s grandchild! You’ve her chin. I’m Tobin. I lit the lamps in this valley for fifty-one years.',
          'happy',
        ),
        T(
          'This is Linnet. My granddaughter. Here till winter, while her mum works the coast boats.',
        ),
        L('He means I’m kept here till winter.', 'angry'),
        T('She’s eleven. She’s very— she’s eleven.', 'soft'),
        L('Nothing in this valley is flat. Did you know that? Nothing. Somebody should be told.'),
        T('Mind yourself on the lane, love.', 'soft'),
        L('There. That. That’s the other thing everybody says.'),
      ],
      [
        {
          domain: 'social-studies',
          skill: 'life in the past: the lamplighter’s job',
          standard: 'D2.His.2.K-2',
          kind: 'notice',
          after: 5,
          lines: [
            T(
              'Before the lamps were wired up, every one had a real flame. Someone had to light it, every single evening.',
            ),
            T(
              'That was me. A long pole, a ladder for the stubborn ones, and out again at dawn. Fifty-one years of it.',
              'happy',
            ),
          ],
          parentNote:
            'Learned how street lamps were once lit and put out by hand by a lamplighter.',
        },
        {
          domain: 'literacy',
          skill: 'character motives: why Linnet is sour',
          standard: 'RL.3.3',
          kind: 'ask',
          after: 11,
          prompt: [N('Why does “mind yourself” make Linnet so cross?')],
          options: [
            opt(
              'Everyone treats her as if she might break, so nobody lets her do anything.',
              [
                N('Yes. Her sourness comes from being kept, not from her chair.'),
                N('Being told to be careful all day can feel like being told you can’t.'),
              ],
              true,
            ),
            opt('She doesn’t love her grandad.', [
              N(
                'She does. Look how she bosses him. Her crossness is about being kept in, not about him.',
              ),
            ]),
            opt('She just likes being rude.', [
              N('She is rude, a bit. But listen to her: she’s cross about being kept, not let.'),
            ]),
          ],
          parentNote:
            'Explained a character’s feelings and motives using clues from what she says.',
        },
      ],
      [
        {
          id: 'agree',
          label: 'Agree. Whoever built this valley did it badly.',
          set: { 's26-hello': 'agree' },
          then: [
            L('Thank you. Finally. Somebody with eyes.', 'happy'),
            N(
              'It is very nearly a smile. She puts it away quickly, before anyone can use it against her.',
            ),
          ],
        },
        {
          id: 'asked',
          label: 'Ask if she’d like a push up the lane.',
          set: { 's26-hello': 'asked' },
          then: [
            L('No.'),
            Y('All right.'),
            N('She looks at you, surprised that “no” was allowed to be the end of it.'),
            L('…You asked, though. Nobody asks. They just grab the handles.', 'think'),
          ],
        },
        {
          id: 'walk',
          label: 'Say nothing. Wait and see which way she goes.',
          set: { 's26-hello': 'walk' },
          then: [
            N(
              'She goes up the lane, hard, the rims slapping her palms. You walk beside her at her pace, which is faster than yours.',
            ),
            L('You’re not going to tell me to mind myself?'),
            Y('Do you need telling?'),
            L('No.', 'think'),
          ],
        },
      ],
    ),
    scene(
      's26-linnet-robin',
      [
        N('The robin lands on the lamp post, right above Linnet’s head.'),
        L('That’s following you. Is it yours?'),
        Y('I think I’m its.'),
        L('Where does it live?'),
        Y('On the old wall, at the top of the Grove. In the ivy, mostly.'),
        L('Is the lane flat? To the old wall?', 'think'),
        N('You think about it. It is, almost: the only lane in the valley that is.'),
        L('Then show me. Tomorrow. Before Grandad thinks of a reason.'),
      ],
      [
        {
          domain: 'science',
          skill: 'robins keep a territory',
          standard: 'K-ESS3-1',
          kind: 'notice',
          after: 4,
          lines: [
            N(
              'A robin keeps a patch of its own, called a territory, with enough food and cover to live on.',
            ),
            N(
              'It sings to say “mine”, and chases other robins out. This one has decided its patch includes you.',
            ),
          ],
          parentNote:
            'Learned that a robin keeps a territory where its needs are met, and defends it.',
        },
      ],
    ),
    // ------------------------------------------------ 3. The Key, and the Door
    scene(
      's26-key',
      [
        N(
          'Next morning Linnet is waiting at the top of the lane: early, cross, and slightly out of breath. Tobin is not with her.',
        ),
        L('He thinks I’m reading. I am. I’m reading the valley.'),
        N(
          'The old wall runs along the north side of the Grove, tumbled and deep in ivy. The robin goes ahead, post to bush to stone.',
        ),
        N(
          'Near the lantern post it drops onto a fresh molehill and scratches, as if it has lost something and is cross about it.',
        ),
        N('Something in the earth goes clink.'),
        L('Dig. Go on. It’s pointing.'),
        N(
          'You kneel, and lift out an iron key, black with age. Its bow, the round part you hold, is as wide as your palm.',
        ),
        N(
          'The lantern post beside you is warm under your hand, the way the three good posts always are.',
        ),
        N(
          'You know from Moss’s tale what sleeps under this one. You put the earth back with your hands, and press it flat.',
        ),
        L('What? What was that face?'),
        Y('Nothing. Something old. It’s asleep.'),
        L('Everything here is old and asleep.', 'think'),
      ],
      [
        {
          domain: 'science',
          skill: 'moles change the ground they live in',
          standard: 'K-ESS2-2',
          kind: 'notice',
          after: 3,
          lines: [
            N(
              'A molehill is the spoil heap from a mole’s tunnel. Moles dig with big, spade-shaped front paws and push the loose earth up.',
            ),
            N(
              'So a mole can bring up things that have been buried for years. Today it brought up a key.',
            ),
          ],
          parentNote:
            'Learned that moles dig tunnels and push soil up into molehills, changing the ground.',
        },
        {
          domain: 'literacy',
          skill: 'multiple-meaning words: bow',
          standard: 'L.3.4',
          kind: 'ask',
          after: 6,
          prompt: [N('“Bow” has several meanings. Which one fits here, on a key?')],
          options: [
            opt(
              'The round handle you hold',
              [N('Yes. On a key, the bow is the loop or ring at the top.')],
              true,
            ),
            opt('A ribbon tied in loops', [
              N('That’s another bow! Here, the bow is the round handle at the top of the key.'),
            ]),
            opt('Bending forward to say hello', [
              N('That’s a bow too, said differently. On a key, it’s the round handle you hold.'),
            ]),
          ],
          parentNote: 'Used context to choose the right meaning of a word with several meanings.',
        },
      ],
    ),
    scene(
      's26-door',
      [
        N('Then the wind comes along the wall, and lifts the ivy like a curtain.'),
        N('Under it, exactly at the height of Linnet’s eyes, is a round iron knob.'),
        L('There. There! You lot stand too tall to see anything.', 'happy'),
        N('You hold back the ivy and find the edge of a door, and under the knob, a keyhole.'),
        N(
          'The key goes in as if it has been waiting. It takes both your hands to turn it, and then Linnet’s as well.',
        ),
        N('Something inside the lock gives a deep, rusty clunk.'),
      ],
      [
        {
          domain: 'sel',
          skill: 'different points of view notice different things',
          standard: 'CASEL: Social awareness',
          kind: 'ask',
          after: 2,
          prompt: [N('Why did Linnet spot the knob when nobody else had, for years?')],
          options: [
            opt(
              'Her eyes were at exactly the right height, and she was looking.',
              [
                N('Yes. From where she sits, she sees things taller people walk past.'),
                N(
                  'Different people notice different things. That’s why it helps to have everyone.',
                ),
              ],
              true,
            ),
            opt('Pure luck.', [
              N(
                'Partly the wind. But her eyes were at the knob’s height, and she was looking hard. Different views spot different things.',
              ),
            ]),
          ],
          parentNote:
            'Talked about how people’s different points of view help them notice different things.',
        },
      ],
    ),
    // ------------------------------------------------ 4. Inside, and the green
    scene(
      's26-inside',
      [
        N('The door opens inwards, slowly, scraping a fan in a hundred years of leaves.'),
        N('Three stone steps lead down from the doorway into a garden walled on all four sides.'),
        N(
          'Everything is grey: grey tangles, grey canes, bare roses climbing the walls and falling off them again. In the middle, a stone bench.',
        ),
        L('Listen. There isn’t one single sound in here. Not a bee.', 'soft'),
        L('I bet these walls haven’t heard a voice since before Grandad was born.', 'soft'),
        N('Nothing moves. Even the robin lands without a sound.'),
        L('…Is it dead? All of it?'),
        Y('I don’t know. I know someone who would.'),
        L('Then fetch them. I’ll wait here. I’m very good at the tops of things.', 'think'),
        N(
          'She folds her arms in the doorway at the top of the three steps, and guards a garden nobody has wanted for a hundred years.',
        ),
      ],
      [
        {
          domain: 'science',
          skill: 'walls soak up the sun’s warmth',
          standard: 'K-PS3-1',
          kind: 'notice',
          after: 2,
          lines: [
            N(
              'Gardeners have built walled gardens for hundreds of years. The walls keep the wind off.',
            ),
            N(
              'Stone soaks up the sun’s warmth by day and gives it back at night, so fruit and flowers grow well beside it.',
            ),
          ],
          parentNote:
            'Learned that walls block wind and that stone warmed by the sun keeps a garden warmer.',
        },
      ],
    ),
    scene(
      's26-wick',
      [
        N(
          'Dusty comes with a spade over one shoulder, stops in the doorway, and doesn’t say anything for a while.',
        ),
        DU(
          'After Fossil, I said I’d go and dig something up. I went. I stood on the cliff with the spade for an hour.',
          'soft',
        ),
        DU('First time it hasn’t worked.'),
        N(
          'They go down the steps, take a grey cane, and scratch it gently with a thumbnail. Under the grey it is green: wet, bright green.',
        ),
        DU('There. That one’s living. It’s been dormant, that’s all.', 'happy'),
        DU(
          'This one’s good. That one. Not that one, that’s firewood. But most of this lot has only been resting.',
        ),
        L('Then wake it up.'),
        DU('…Yeah.', 'soft'),
        DU('Yeah. I want to dig this. I didn’t think I’d want to dig anything for a bit.', 'soft'),
      ],
      [
        {
          domain: 'science',
          skill: 'the scratch test for a living stem',
          standard: 'K-LS1-1',
          kind: 'notice',
          after: 4,
          lines: [
            DU('Scratch the bark, gently. Green and damp underneath means the stem is alive.'),
            DU('Brown and dry right through means dead wood. Dead wood snaps; living wood bends.'),
          ],
          parentNote:
            'Learned the gardener’s scratch test: green and damp under the bark means a stem is alive.',
        },
        {
          domain: 'sel',
          skill: 'grief comes and goes, and doing something you love can help',
          standard: 'CASEL: Self-awareness',
          kind: 'notice',
          after: 8,
          lines: [
            N(
              'When someone you love dies, sadness doesn’t stop on a timetable. Some days nothing helps.',
            ),
            N(
              'Then one day, something does: a job you love, a friend, a green stem. It doesn’t mean you’ve stopped missing them.',
            ),
          ],
          parentNote:
            'Talked about how grief changes over time, and how a loved activity can help without replacing the person.',
        },
      ],
    ),
    // ------------------------------------------------ 5. Three Steps (signature choice)
    scene(
      's26-steps',
      [
        N(
          'Dusty comes back up, earth to the elbow. Linnet is still at the top of the three steps.',
        ),
        N(
          'Three steps: steep, worn in the middle, a little slippery with moss. Built by somebody who walked.',
        ),
        L('Well. That’s that, then. Somebody built three stupid steps and walked off.', 'angry'),
        N(
          'Sparks comes along the wall with a coil of wire for the old wall lantern. She sees the open door, and stops.',
        ),
        SP('Ooh. I didn’t know that was there. NOBODY knew that was there!', 'happy'),
        SP(
          'Want me to lift you down? Chair and all. I lift generators. You’re lighter than a generator.',
          'happy',
        ),
        N('Dusty looks at the steps, and then at the spade, measuring something.'),
        DU('Or we dig them out into a slope. You and me. A few evenings’ work.'),
        N('Everyone looks at you. You look at Linnet.'),
        Y('What do you want?'),
        L('I don’t mind being lifted.'),
        N('Her face minds. Her face minds very much.'),
      ],
      [
        {
          domain: 'sel',
          skill: 'notice when words and faces disagree',
          standard: 'CASEL: Social awareness',
          kind: 'notice',
          after: 11,
          lines: [
            N(
              'People sometimes say “I don’t mind” to be polite, or because they’re tired of asking.',
            ),
            N('Asking first is good. Watching the answer, not just hearing it, is better.'),
          ],
          parentNote:
            'Noticed that what someone says and what their face shows can differ, and talked about asking well.',
        },
        {
          domain: 'science',
          skill: 'compare two solutions to a problem',
          standard: '3-5-ETS1-2',
          kind: 'ask',
          after: 11,
          prompt: [
            N(
              'Two answers to one problem. A lift is quick, but needs a lifter every time. A ramp is slow to build, but always there.',
            ),
            N(
              'Which matters more here? There’s no wrong answer. Think about it from Linnet’s side.',
            ),
          ],
          options: [
            opt('Getting into the garden today.', [
              N(
                'Fair. Today matters, and the garden is right there. A quick fix can be a kind fix.',
              ),
              N('Keep an eye on what happens when the lifter is busy, though.'),
            ]),
            opt('Getting in and out on her own, any day she likes.', [
              N('Fair. A fix that works without anyone else gives her the say over her own days.'),
              N('It does mean waiting. Slow hands take time.'),
            ]),
            opt('Whatever Linnet decides.', [
              N(
                'That’s a strong answer: it’s her garden and her body. She’s told you a bit, and her face has told you more.',
              ),
            ]),
          ],
          parentNote:
            'Compared two solutions (quick but dependent, slow but lasting) and explained which mattered more, and why.',
        },
      ],
      [
        {
          id: 'ramp',
          label: 'Dig the steps into a ramp. Dusty and you, three evenings.',
          set: { 's26-steps': 'ramp' },
          then: [
            L('Three evenings. Of watching you two dig.', 'angry'),
            L('…Fine. Somebody has to tell you where.', 'think'),
            SP('Shout if you change your mind. I’m only ever a shout away. A loud shout.', 'happy'),
            N(
              'Sparks leaves her coil of wire at the top, just in case. Linnet sits beside it and looks down at the garden.',
            ),
          ],
        },
        {
          id: 'lift',
          label: 'Ask Sparks to lift Linnet and her chair down. Now.',
          set: { 's26-steps': 'lift' },
          then: [
            SP('Right! How do you want it? Tell me everything. I break things when I guess.'),
            L('Front and back, not the sides. Don’t tip me back. I’m not a wheelbarrow.'),
            N(
              'Sparks does exactly as she’s told, which nobody has ever seen before. Linnet’s wheels touch the garden path.',
            ),
            L('Thank you.', 'soft'),
            N(
              'She says it carefully, like a coin she has had to count out. Then she is off among the roses.',
            ),
          ],
        },
      ],
    ),
    // ------------------------------------------------ 6. The Top of the Wall
    scene(
      's26-pruned',
      [
        N('The garden wakes slowly, the way a cat does: one leg at a time, and complaining.'),
        N(
          'Dusty clears the dead wood, and you cart it out. Your Nubbin and the robin supervise from the stone bench.',
        ),
        N(
          'Then Linnet spots a rose by the far wall that has been cut back. Badly, but not long ago.',
        ),
        L(
          'Look. Somebody’s been in here. That cut’s from this summer. The wood’s still pale.',
          'think',
        ),
        DU('Right. And whoever did it held the shears upside down.', 'think'),
        L('So somebody’s got another key. Or somebody comes over the top.'),
        N(
          'All three of you look up at the top of the wall at the same moment, the way people do in plays.',
        ),
        N(
          'Nobody is there. On the coping, the flat top of the wall, there is a snapped rose twig and a flattened patch of moss.',
        ),
        L('Dusk, then. Nobody prunes in daylight unless they want to be caught.'),
      ],
      [
        {
          domain: 'science',
          skill: 'how pruning helps a rose',
          standard: 'K-ESS3-3',
          kind: 'notice',
          after: 1,
          lines: [
            DU(
              'Pruning means cutting bits off a plant to help it. First the dead wood, then anything crossing or crowded.',
            ),
            DU(
              'That lets light and air into the middle, and the rose puts its strength into new shoots. Cut just above a bud.',
            ),
          ],
          parentNote:
            'Learned what pruning is and why it helps a rose: more light and air, and strength for new growth.',
        },
        {
          domain: 'literacy',
          skill: 'use evidence to reach a conclusion',
          standard: 'RL.3.3',
          kind: 'ask',
          after: 3,
          prompt: [N('How does Linnet know somebody was here this summer?')],
          options: [
            opt(
              'The cut wood is still pale, not weathered grey.',
              [
                N(
                  'Yes. Fresh cuts are pale; old ones go grey. She read the evidence like a detective.',
                ),
              ],
              true,
            ),
            opt('She guessed.', [
              N('She didn’t need to. The cut wood was still pale: fresh. Old cuts weather grey.'),
            ]),
          ],
          parentNote: 'Used a clue in the text to explain how a character worked something out.',
        },
      ],
    ),
    scene(
      's26-moss-wall',
      [
        N('Dusk. A blackbird says its last word.'),
        N('Then something small and green and very slow comes over the top of the far wall.'),
        N('It has a rose twig in its mouth, held crossways, like a dog with a stick. It is Moss.'),
        M('…', 'shock'),
        N(
          'He takes the twig out of his mouth with great dignity, as if he had meant to be seen with it.',
        ),
        M('Good evening. I was pruning.', 'think'),
        L('You were doing it upside down.', 'angry'),
        M('I have hands the size of buttons, child. With shears, everything is upside down.'),
        L('…You talk.', 'shock'),
        M('When there is something worth the wear.'),
        DU('Moss. How long have you been coming in here?', 'shock'),
        M(
          'Once a year. On this day, as it happens. For longer than any of you have been alive. Put together.',
          'soft',
        ),
        L('So I wasn’t the first to say anything in here.', 'angry'),
        M(
          'You were the first who expected an answer. I only talk to the roses. They never keep up their end.',
        ),
      ],
      [
        {
          domain: 'literacy',
          skill: 'think about a character’s motive',
          standard: 'RL.3.3',
          kind: 'ask',
          after: 11,
          prompt: [
            N(
              'Moss comes once a year, on one particular day, and tells nobody. Why do you think he does that?',
            ),
          ],
          options: [
            opt('It’s a day to remember someone.', [
              N('That’s a good reading. Some people keep one day a year for someone they miss.'),
            ]),
            opt('He likes having a secret.', [
              N('Maybe a little. Some feelings are easier kept quiet. Moss is not a talker.'),
            ]),
            opt('He doesn’t want anyone to fuss.', [
              N('That fits Moss. He would hate a fuss. Keep it in mind for later.'),
            ]),
          ],
          parentNote:
            'Suggested reasons for a character’s private habit, using what they know about him.',
        },
      ],
    ),
    // ------------------------------------------------ 7. A patch of her own
    scene(
      's26-earth-ask',
      [
        N('Moss is on the wall again before anyone else, pretending he has always been there.'),
        N(
          'Linnet watches him for a long time. She is not used to wanting things out loud, and it shows.',
        ),
        L('Moss. It’s your garden, isn’t it? Or it’s somebody’s, and you look after it.', 'think'),
        M('It was somebody’s. I cut the roses once a year. That isn’t the same as looking after.'),
        L('Can I have a piece of it? A patch, with edges. Mine.', 'soft'),
        M('A patch. What for?', 'think'),
        L(
          'Growing. Sowing things and seeing which ones come up. Because I looked after them.',
          'soft',
        ),
        N('Moss is quiet for so long that Dusty stops digging to look.'),
        M(
          'Have whatever patch you choose. There has been nobody to ask for one in a very long while.',
          'soft',
        ),
        M(
          'There was another who loved growing things, once. You’d have argued with each other beautifully.',
          'soft',
        ),
        M('Choose your patch. Then wake it up.', 'soft'),
      ],
      [
        {
          domain: 'sel',
          skill: 'asking out loud for what you want',
          standard: 'CASEL: Self-awareness',
          kind: 'notice',
          after: 6,
          lines: [
            N(
              'Asking for something you really want can feel risky. If they say no, it stings more.',
            ),
            N('Linnet asked anyway, plainly. That’s a skill, and it gets easier with practice.'),
          ],
          parentNote:
            'Talked about how hard, and how useful, it is to ask plainly for something you want.',
        },
        {
          domain: 'science',
          skill: 'plants need light and water',
          standard: '2-LS2-1',
          kind: 'ask',
          after: 10,
          prompt: [
            M('Before you choose, what will a patch need, for seeds to grow well?', 'think'),
          ],
          options: [
            opt(
              'Light and water, and good soil',
              [M('Yes. Light to make food, water to drink, and soil to root in.', 'soft')],
              true,
            ),
            opt('Nothing; seeds do it all themselves', [
              M(
                'Seeds carry a little food to start. After that, plants need light, water and soil.',
              ),
            ]),
            opt('As much shade as possible', [
              M('Some plants like shade, but most need light to make their food. Find some sun.'),
            ]),
          ],
          parentNote: 'Explained that plants need light, water and soil to grow well.',
        },
      ],
    ),
    scene(
      's26-earth-pick',
      [
        N(
          'You walk the garden for her twice, wall to wall, stopping at every corner so she can see it.',
        ),
        N('She turns most of it down on sight.'),
        L(
          'Too shady. Too stony. Too near the door; people would tread on it. Too— what do you think?',
          'think',
        ),
        N('The sun is low in the south. Its light lies longest along the foot of the south wall.'),
        N('Under the oldest rose, the cane Dusty scratched is still showing its green.'),
        Y('Let me think.'),
      ],
      [
        {
          domain: 'science',
          skill: 'the Sun is in the south at midday, so south walls get most sun',
          standard: '5-ESS1-2',
          kind: 'notice',
          after: 3,
          lines: [
            N(
              'In our half of the world, the Sun crosses the southern part of the sky. At midday it is due south.',
            ),
            N(
              'So the ground in front of a south-facing wall gets the most sunshine. Gardeners love it.',
            ),
          ],
          parentNote:
            'Learned that the Sun is due south at midday in the northern half of the world, so south-facing spots get the most sun.',
        },
        {
          domain: 'maths',
          skill: 'perimeter',
          standard: '3.MD.D.8',
          kind: 'ask',
          after: 5,
          prompt: [
            L('My patch will be 3 metres long and 2 metres wide. String goes all the way round.'),
            L('How much string do I need?', 'think'),
          ],
          options: [
            opt(
              '10 metres',
              [L('Yes. 3 + 2 + 3 + 2 = 10. All the way round is called the perimeter.', 'happy')],
              true,
            ),
            opt('6 metres', [
              L(
                'That’s 3 × 2, which gives the area in square metres. String goes round the edges: 3 + 2 + 3 + 2 = 10 metres.',
              ),
            ]),
            opt('5 metres', [
              L(
                'That’s only one long side and one short side. Go all the way round: 3 + 2 + 3 + 2 = 10.',
              ),
            ]),
          ],
          parentNote: 'Found the perimeter of a 3 m by 2 m rectangle by adding all four sides.',
        },
      ],
      [
        {
          id: 'sun',
          label: 'The corner by the south wall. The sun stays there longest.',
          set: { 's26-plot': 'sun' },
          then: [
            L('Obviously. I was testing you.', 'happy'),
            N('She marks it out with four sticks and a length of string, perfectly straight.'),
          ],
        },
        {
          id: 'rose',
          label: 'Under the oldest rose, where Dusty found the green.',
          set: { 's26-plot': 'rose' },
          then: [
            L('Next to the living one. Yes. Then it’s got company.', 'soft'),
            N('She marks it out with four sticks and a length of string, perfectly straight.'),
          ],
        },
        {
          id: 'hers',
          label: 'Wherever you like. It’s your patch.',
          set: { 's26-plot': 'hers' },
          then: [
            L('…Nobody’s ever said that. About anything.', 'think'),
            N(
              'She takes the sunny corner by the south wall, and marks it out with four sticks and string, perfectly straight.',
            ),
          ],
        },
      ],
    ),
    // ------------------------------------------------ 8. Hush’s Bench
    scene(
      's26-bench',
      [
        N(
          'That evening the light goes long and gold across the garden. Moss comes down off the wall at last, the slow way.',
        ),
        N('He climbs onto the stone bench and sits, as if he has sat there before. He has.'),
        M('It was Hush’s. The bench, the roses, the wall. All of it.', 'soft'),
        L('Who’s Hush?'),
        M('A friend of mine. The quiet one. She kept the griefs nobody else had room for.', 'soft'),
        N(
          'Linnet puts her brake on, and Dusty sits down on the path. You sit on the end of the bench, and wait.',
        ),
      ],
      [
        {
          domain: 'science',
          skill: 'evening light and long shadows',
          standard: '5-ESS1-2',
          kind: 'notice',
          after: 0,
          lines: [
            N(
              'In the evening the Sun is low, so its light comes in sideways and shadows stretch out long.',
            ),
            N(
              'The light looks gold because it travels through more air to reach you, which scatters away much of the blue.',
            ),
          ],
          parentNote:
            'Learned why shadows are long and light looks golden in the evening, when the Sun is low.',
        },
      ],
    ),
    scene(
      's26-hush',
      [
        M(
          'After the White Year, some of the stilled ones never moved again. Hush brought them in here, out of the wind.',
          'sad',
        ),
        M(
          'She planted roses up every wall, so they would have something to look at. So it wasn’t only grey.',
        ),
        M('Every day she sat with them. She didn’t try to wake them. She kept them company.'),
        M('The last of them faded on a winter morning, by this wall, with Hush beside it.', 'soft'),
        N(
          'Faded is the Grove’s word. It means died: the body stops working, and it doesn’t start again.',
        ),
        M(
          'She locked the door and put the key in the ground. Later, when she had carried it as far as she could, she faded too.',
          'soft',
        ),
        N(
          'Nobody says anything. The robin turns round twice on the back of the bench, and settles.',
        ),
        L('Not even Hazel knew? About in here?', 'soft'),
        M('Hazel had enough doors.', 'soft'),
        N(
          'Then Moss looks at the patch of bare earth beside the bench, the way he looks at the hill where the memorial flowers grow.',
        ),
        M('If I ever have a flower, I’d like a bit of it here.', 'soft'),
        M('Don’t go telling people. They’d make a speech.', 'think'),
        N(
          'Linnet sets a white pebble on the bare patch to mark it, and says nothing at all. For Linnet, that is a speech.',
        ),
      ],
      [
        {
          domain: 'sel',
          skill: 'grief, said plainly, and what comforts',
          standard: 'CASEL: Self-awareness',
          kind: 'notice',
          after: 5,
          lines: [
            N('This is a sad part. Feeling sad, or quiet, while you read it is all right.'),
            N(
              'What helps: the roses Hush planted are still alive, and Moss still comes. Remembering someone keeps them close.',
            ),
          ],
          parentNote: 'Heard about death said plainly, and talked about remembering as a comfort.',
        },
        {
          domain: 'literacy',
          skill: 'theme: keeping someone company',
          standard: 'RL.4.2',
          kind: 'ask',
          after: 12,
          prompt: [
            N(
              'Hush couldn’t make the still ones better. She sat with them anyway. Was that helping? Think about it; there’s no wrong answer.',
            ),
          ],
          options: [
            opt('Yes. Being with someone matters even when you can’t fix things.', [
              N('Many people would agree. Company can be the help, when nothing else will work.'),
            ]),
            opt('Not really. Helping means fixing.', [
              N(
                'That’s an honest answer. Fixing is one kind of help. Ask yourself what the still ones would have felt, alone.',
              ),
            ]),
            opt('It helped Hush, as well as them.', [
              N('That’s a thoughtful answer. Keeping someone company can comfort both people.'),
            ]),
          ],
          parentNote:
            'Thought about a story’s theme: whether staying with someone is a way of helping.',
        },
      ],
    ),
    // ------------------------------------------------ 9. Autumn Bulbs
    scene(
      's26-beds',
      [
        N(
          'Autumn: the valley goes gold, then brown. For the first time in a hundred years, the garden has people in it most days.',
        ),
        N(
          'Dusty builds raised beds along the south wall: deep wooden boxes at exactly the height of Linnet’s hands.',
        ),
        DU(
          'Measured twice. Measured you, I mean. Your arms. Tell me if it’s wrong. It won’t be.',
          'happy',
        ),
        L('It’s not wrong.', 'soft'),
        L(
          'Right. Dusty: compost. You: bulbs. The Nubbin: carry. The robin: look important. Moss: stop helping.',
        ),
        M('I haven’t touched anything.'),
        L('You were about to.'),
        N(
          'Linnet runs the garden like a ship. Nobody minds: she is good at it, and nearly always right.',
        ),
        N(
          'Tobin thinks she spends her afternoons at the library van. The library van comes on Thursdays.',
        ),
        L('What goes in my bed first? You choose. I’ll overrule you if it’s wrong.', 'think'),
      ],
      [
        {
          domain: 'social-studies',
          skill: 'designing places so everyone can use them',
          standard: 'D2.Civ.8.K-2',
          kind: 'notice',
          after: 3,
          lines: [
            N('Dusty didn’t change Linnet. Dusty changed the beds, to fit Linnet.'),
            N(
              'Good designers do this everywhere: ramps, wide doors, low counters. A place built for everyone is fairer, and often better for all.',
            ),
          ],
          parentNote:
            'Talked about accessible design: changing places so that everyone can use them.',
        },
        {
          domain: 'science',
          skill: 'bulbs in the life cycle of a plant',
          standard: '3-LS1-1',
          kind: 'notice',
          after: 9,
          lines: [
            DU(
              'A bulb is a plant’s packed lunch: a store of food underground, wrapped in fleshy leaves.',
              'happy',
            ),
            DU(
              'Plant them in autumn, pointy end up, two or three times as deep as the bulb is tall. Most need a cold winter.',
            ),
            DU(
              'Come late winter and spring, they spend that store on leaves and flowers. Then they fill up again for next year.',
            ),
          ],
          parentNote:
            'Learned how bulbs store food, are planted in autumn and flower after a cold winter.',
        },
      ],
      [
        {
          id: 'snowdrops',
          label: 'Snowdrops. They come up first, before anyone thinks it’s worth it.',
          set: { 's26-bulbs': 'snowdrops' },
          then: [L('First. Yes. Before anybody’s ready for them.', 'happy')],
        },
        {
          id: 'crocus',
          label: 'Crocuses. Purple ones. Loud.',
          set: { 's26-bulbs': 'crocus' },
          then: [L('Loud. Good. This garden’s been quiet long enough.', 'happy')],
        },
        {
          id: 'mix',
          label: 'Some of everything, and see what wins.',
          set: { 's26-bulbs': 'mix' },
          then: [L('A race. I’ll win, obviously. My bulbs will, I mean.', 'happy')],
        },
      ],
    ),
    scene(
      's26-cheeks',
      [
        N('Your Nubbin carries the bulbs very seriously, two at a time, one in each cheek.'),
        N(
          'It plants about half of them. The other half it hides all over the garden, in places it seems to choose by feel.',
        ),
        L('Your Nubbin has no sense of order whatsoever.', 'think'),
        N(
          'She watches it bury one under the bench, pat it flat, and look round to see if anyone noticed.',
        ),
        L('…I like it.', 'soft'),
        DU(
          'Squirrels do that with nuts. Plenty of the oaks in this valley started as acorns a squirrel forgot.',
          'happy',
        ),
      ],
      [
        {
          domain: 'maths',
          skill: 'unit fractions: one half',
          standard: '3.NF.A.1',
          kind: 'ask',
          after: 1,
          prompt: [
            N('Your Nubbin carried 20 bulbs and planted half of them. How many did it plant?'),
          ],
          options: [
            opt(
              '10',
              [N('Yes. Half of 20 is 10: two equal groups of 10. The other 10 are hidden.')],
              true,
            ),
            opt('2', [
              N('Two is how many it carries at once. Half of 20 is 10, two equal groups.'),
            ]),
            opt('20', [N('That’s all of them. Half means two equal parts: 10 and 10.')]),
          ],
          parentNote: 'Found one half of 20 by splitting it into two equal groups.',
        },
        {
          domain: 'science',
          skill: 'animals that bury seeds help plants spread',
          standard: '2-LS2-2',
          kind: 'notice',
          after: 5,
          lines: [
            N(
              'Squirrels and jays bury nuts and acorns to eat in winter. They never find them all.',
            ),
            N(
              'The forgotten ones can sprout, far from the parent tree. So a forgetful animal plants a wood.',
            ),
          ],
          parentNote:
            'Learned that animals that bury seeds and forget some of them help plants spread.',
        },
      ],
    ),
    // ------------------------------------------------ 10. Mind Yourself
    scene(
      's26-tobin-finds',
      [
        N('It ends on a Thursday, when the library van comes and Linnet isn’t at it.'),
        N(
          'Tobin finds the ivy door by following her wheel tracks. He comes through it the way you would come into a burning house.',
        ),
        T('Linnet! Away from that— off that— is that a SPADE?', 'shock'),
        T(
          'She’ll catch her death out here. She’ll tip. That wall could come down on her!',
          'angry',
        ),
        N(
          'Linnet goes sour all at once, like milk in thunder. The whole busy, bossy afternoon goes out of her face.',
        ),
        L('Everybody keeps me. Nobody lets me.', 'angry'),
        L(
          'I’ve been kept in every room in this valley. This is the first place anyone’s let me do anything.',
          'sad',
        ),
        T('I only want you safe, love.', 'sad'),
        N(
          'Up on the wall, Moss shifts, as if a word he knows very well has been said in front of him.',
        ),
        N(
          'You could send Tobin home and hide the door again. Linnet looks at you as if she thinks you might.',
        ),
      ],
      [
        {
          domain: 'sel',
          skill: 'think question: is safe the same as well?',
          standard: 'CASEL: Responsible decision-making',
          kind: 'ask',
          after: 7,
          prompt: [
            N(
              'Tobin wants Linnet safe. Linnet wants to do things. Is keeping someone safe the same as letting them be well?',
            ),
            N('There is no wrong answer. Think about both of them.'),
          ],
          options: [
            opt('No. You can be safe and still unhappy.', [
              N('That’s fair. A kept bird is safe in a cage. Is it well?'),
            ]),
            opt('Mostly yes. Safety comes first.', [
              N(
                'That’s fair too. Tobin loves her, and some dangers are real. The question is how much keeping is too much.',
              ),
            ]),
            opt('They need each other: safe enough, and free enough.', [
              N('That’s a thoughtful answer. Most families spend years finding that balance.'),
            ]),
          ],
          parentNote:
            'Thought about whether keeping someone safe is the same as letting them live well.',
        },
      ],
      [
        {
          id: 'asked',
          label: 'Ask Tobin to sit on Hush’s bench. Just for a minute.',
          set: { 's26-tobin': 'asked' },
          then: [
            T('Sit? I— well. A minute. One.', 'think'),
            N(
              'He sits. The stone is warm from the afternoon, and he looks very surprised by that.',
            ),
          ],
        },
        {
          id: 'shown',
          label: 'Tell Linnet to show him round. It’s her garden too.',
          set: { 's26-tobin': 'shown' },
          then: [
            L('…Fine. Grandad. Come here. No, here. Look at this.', 'angry'),
            N(
              'She shows him everything: the living canes, the raised beds, the pebble by the bench. She is cross the whole way round, and very thorough.',
            ),
            N('At the end he sits down on Hush’s bench, because his legs have decided for him.'),
          ],
        },
      ],
    ),
    scene(
      's26-tobin-bench',
      [
        T(
          'This puts me in mind of a story. There was a winter, the year of the Three Hats, when—',
          'happy',
        ),
        T(
          '…when the snow came up to the lamp posts, and I went round lighting them from underneath, and…',
          'think',
        ),
        N(
          'He stops, and looks at the roses. Then he looks at Linnet, up to her elbows in a raised bed, and not tipping.',
        ),
        T('Where was I.', 'soft'),
        N(
          'He doesn’t find his place. He sits on, and stops arguing, and watches her work until it’s dark.',
        ),
        ...TOBIN_WAY_OUT,
      ],
      [roseWorry(6)],
    ),
    // ------------------------------------------------ 11. Snowed In
    scene(
      's26-snow',
      [
        N(
          'The Long Night is over. The days after it are short and white, and the valley is snowed in to the hedge tops.',
        ),
        N('Tobin comes up the lane at a sort of run, in two scarves and the wrong boots.'),
        T(
          'She’s gone out. First light. The chair tracks go up the lane and I can’t keep up with them.',
          'shock',
        ),
        T('I know where. I know exactly where. It’s my knees, in this.', 'sad'),
        T('Will you go and find her? Not fetch her. Find her.', 'soft'),
        N('You notice the difference. So, from his face, does he.'),
      ],
      [
        {
          domain: 'science',
          skill: 'winter days are short',
          standard: '1-ESS1-2',
          kind: 'notice',
          after: 0,
          lines: [
            N(
              'In winter the Sun rises late, stays low, and sets early, so the days are short and the nights are long.',
            ),
            N('Linnet went out at first light, which in deep winter isn’t very early at all.'),
          ],
          parentNote: 'Learned that winter days have fewer hours of daylight.',
        },
        {
          domain: 'literacy',
          skill: 'how a character changes: find, not fetch',
          standard: 'RL.3.3',
          kind: 'ask',
          after: 5,
          prompt: [N('Tobin says “find her”, not “fetch her”. What has changed in him?')],
          options: [
            opt(
              'He trusts her to be out on her own now.',
              [
                N(
                  'Yes. “Fetch” means bring her back. “Find” means check she’s all right, and leave her be.',
                ),
              ],
              true,
            ),
            opt('Nothing; the words mean the same.', [
              N(
                'Look closer. “Fetch” means bring her home. “Find” means see she’s fine. He’s learning to let her.',
              ),
            ]),
          ],
          parentNote: 'Used one word choice to explain how a character had changed.',
        },
      ],
    ),
    scene(
      's26-snowdrops',
      [
        N(
          'Her tracks go along the old wall, through the open door and straight down the ramp: two neat lines in the snow.',
        ),
        N(
          'Linnet is by Hush’s bench in three blankets, with the robin on her knee like a hot coal.',
        ),
        L('You took your time. Look. LOOK.', 'happy'),
        N('Snowdrops. All round Hush’s bench, white heads bowed, as if they came up to listen.'),
        N(
          'Some are in Linnet’s bed, in a dead straight row. The rest are everywhere: under the bench, in the path, one right in the middle of the ramp.',
        ),
        L(
          'Your Nubbin’s. It can’t count and it can’t plant, and they all came up anyway.',
          'happy',
        ),
        L('I came in on my own. Nearly in the dark. Nobody had to come and do anything.', 'soft'),
        N('She says it lightly, like a fact about the weather.'),
      ],
      [
        {
          domain: 'science',
          skill: 'snowdrops flower in late winter',
          standard: '3-LS1-1',
          kind: 'notice',
          after: 3,
          lines: [
            N(
              'Snowdrops are among the first flowers of the year, often out in January and February, even through snow.',
            ),
            N(
              'Their bulbs stored food all autumn, so they can flower before the trees have leaves to shade them.',
            ),
          ],
          parentNote:
            'Learned that snowdrops flower in late winter, using food stored in their bulbs.',
        },
        {
          domain: 'sel',
          skill: 'quiet pride in doing something yourself',
          standard: 'CASEL: Self-awareness',
          kind: 'notice',
          after: 7,
          lines: [
            N('Linnet doesn’t want a fuss. She wants it noticed, once, and then left alone.'),
            N(
              'That’s what pride can feel like when something finally fits: ordinary, in the best way.',
            ),
          ],
          parentNote: 'Talked about the quiet pride of doing something on your own.',
        },
      ],
    ),
    // ------------------------------------------------ 12. In the Garden!
    scene(
      's26-mum',
      [
        N(
          'A few days later, a woman comes up the valley road with a kitbag and a coat that smells of the sea.',
        ),
        N(
          'She has Linnet’s chin exactly, and Linnet’s way of looking at a hill as if it owes her money.',
        ),
        MU(
          'I’m Linnet’s mum. The boats are laid up for the winter. Dad says she’s never at home. Dad says she’s up here.',
          'think',
        ),
        MU(
          'Dad also says she’s been gardening. My Linnet once posted a houseplant out of a window because it was looking at her.',
          'shock',
        ),
        MU('Is she all right? Really?', 'soft'),
        Y('Come and see.'),
      ],
      [
        {
          domain: 'science',
          skill: 'children are like their parents, but not the same',
          standard: '1-LS3-1',
          kind: 'ask',
          after: 1,
          prompt: [
            N('Linnet has her mum’s chin. Why do children often look a bit like their parents?'),
          ],
          options: [
            opt(
              'They inherit features from their parents.',
              [
                N(
                  'Yes. Some features are passed down in families, like a chin. But each child is still their own mix.',
                ),
              ],
              true,
            ),
            opt('They copy their parents’ faces on purpose.', [
              N(
                'Ha. You can copy a frown, but not a chin! Features like that are inherited from parents.',
              ),
            ]),
          ],
          parentNote:
            'Learned that children inherit some features from their parents but are not identical to them.',
        },
      ],
    ),
    scene(
      's26-race',
      [
        N(
          'Halfway along the old wall she stops. From behind the ivy comes a noise like a kettle boiling over.',
        ),
        N(
          'Laughing. Linnet, and Dusty, and somebody shrieking “NOT the snowdrops”, which is also Linnet.',
        ),
        MU('…That’s her.', 'soft'),
        N(
          'She lifts the ivy. Linnet is just inside, at the top of the ramp, and when she sees her mum her face does something enormous.',
        ),
        L('Mum! Race you. To the bench. GO.', 'happy'),
        N(
          'Her mum drops the kitbag and runs. Linnet goes down the ramp and along the path like a hare, the rims singing.',
        ),
        N('Linnet wins by a length. It would have been two if she hadn’t looked back to gloat.'),
        N('Nobody makes a speech about it. Dusty has been warned.'),
        L('It fits me now. The garden. It didn’t, and now it does.', 'happy'),
      ],
      [
        {
          domain: 'science',
          skill: 'gravity speeds you up on a slope',
          standard: '3-PS2-1',
          kind: 'notice',
          after: 5,
          lines: [
            N(
              'On a slope, gravity pulls downhill more than friction holds you back. The forces are unbalanced, so you speed up.',
            ),
            N(
              'That’s why the ramp is long and gentle: fast enough to be fun, slow enough to stop.',
            ),
          ],
          parentNote: 'Learned that unbalanced forces on a slope make things speed up.',
        },
        {
          domain: 'literacy',
          skill: 'theme: what changed',
          standard: 'RL.4.2',
          kind: 'ask',
          after: 8,
          prompt: [N('“It fits me now.” What changed in this story: Linnet, or the garden?')],
          options: [
            opt(
              'The garden. Linnet is the same as she always was.',
              [
                N(
                  'Yes. Nobody changed Linnet. The steps became a ramp, the beds came up to her hands. The place was made to fit.',
                ),
              ],
              true,
            ),
            opt('Linnet. She got better.', [
              N(
                'Look again. Linnet is exactly as she was: bossy, funny, right. It’s the garden that changed to fit her.',
              ),
            ]),
          ],
          parentNote:
            'Identified the story’s theme: the place changed to fit the person, not the other way round.',
        },
      ],
    ),
    // ------------------------------------------------ 13. The Key
    scene(
      's26-key-choice',
      [
        N(
          'That evening, when the others have gone in for tea, there is only you and Linnet and the robin, and the key.',
        ),
        N('It hangs on a nail inside the door, where it has hung since the morning you dug it up.'),
        L(
          'Mum says we’ll come every summer. Grandad says every summer and Christmas. Grandad’s outnumbered.',
          'happy',
        ),
        L(
          'So. The key. It was Hush’s, and then the ground’s, and then the robin’s, and then yours.',
        ),
        L('Somebody has to decide. Not me. I’d only make it about me.', 'think'),
        N('She holds it out on her open palm. It is black and heavy and older than anybody.'),
      ],
      [
        {
          domain: 'social-studies',
          skill: 'think question: who is a special place for?',
          standard: 'D2.Civ.8.K-2',
          kind: 'ask',
          after: 5,
          prompt: [
            N(
              'Should a special place be kept by the person who loves it most, shared with anyone, or never locked at all? No wrong answer.',
            ),
          ],
          options: [
            opt('Kept by the person who loves it most.', [
              N(
                'Fair. Someone who cares will look after it. The question is whether they’ll let others in.',
              ),
            ]),
            opt('Shared with anyone who wants to come.', [
              N(
                'Fair. Shared places, like parks and libraries, belong to everyone. They need everyone to be careful.',
              ),
            ]),
            opt('Never locked at all.', [
              N('Fair. An open door says “welcome” without anyone having to decide each time.'),
            ]),
          ],
          parentNote:
            'Weighed different ways of looking after a special place, and explained their choice.',
        },
      ],
      [
        {
          id: 'linnet',
          label: 'Give it to Linnet. She asked for her patch first.',
          set: { 's26-key': 'linnet' },
          then: [
            L('Me? I just said— oh, you’re impossible.', 'angry'),
            N('She closes her hand round it. Then she goes very quiet.'),
            L('Then I’m keeping it so nobody can ever lock it. That’s what it’s for now.', 'soft'),
          ],
        },
        {
          id: 'post',
          label: 'Hang it on the old wall post, for anyone who wants to come in.',
          set: { 's26-key': 'post' },
          then: [
            N(
              'You hang it on the hook under the old wall lantern. The post is warm against your knuckles.',
            ),
            L('Anyone? Even people who are rubbish at gardening?', 'think'),
            L('…Good. They can be taught.', 'happy'),
          ],
        },
        {
          id: 'door',
          label: 'Leave it in the door. It’s never going to be locked again.',
          set: { 's26-key': 'door' },
          then: [
            N('You put it in the keyhole, turn it once to open, and leave it there.'),
            L('Somebody will steal it.', 'think'),
            Y('Then they’ll have the key to a door that doesn’t lock.'),
            L('…Ha.', 'happy'),
          ],
        },
      ],
    ),
    // ------------------------------------------------ complete (s26-key = linnet)
    scene(
      's26-complete',
      [
        ...COMPLETE_START,
        N(
          'Linnet wears the key on a bootlace round her neck. It is far too big and bangs on her chest when she races, and she races anyway.',
        ),
        ...COMPLETE_END,
        N(
          'On the way out you look back: the bench, the beds, the white pebble by the bare patch, and the snowdrops in the path.',
        ),
      ],
      [
        {
          domain: 'science',
          skill: 'reusing materials',
          standard: 'K-ESS3-3',
          kind: 'notice',
          after: 3,
          lines: [
            N(
              'The old steps become a new bench. Reusing stone saves digging new stone out of the ground and carting it in.',
            ),
            N('Reusing what you have is one of the simplest ways to look after the land.'),
          ],
          parentNote: 'Talked about reusing materials as a way of caring for the environment.',
        },
      ],
    ),
  ],
  glossary: [
    gloss(
      'landlord',
      'Someone who owns a house or room and rents it to other people.',
      's26-robin',
    ),
    gloss('tenant', 'Someone who pays rent to live in a place they don’t own.', 's26-robin'),
    gloss(
      'lamplighter',
      'Someone whose job was to light the street lamps every evening and put them out at dawn.',
      's26-linnet',
    ),
    gloss(
      'territory',
      'The area an animal lives in and defends from others of its kind.',
      's26-linnet-robin',
    ),
    gloss('molehill', 'A small heap of earth pushed up by a mole digging its tunnels.', 's26-key'),
    gloss('canes', 'The long, woody stems of a rose or a raspberry bush.', 's26-inside'),
    gloss('dormant', 'Alive but resting, not growing for now, like a plant in winter.', 's26-wick'),
    gloss('coping', 'The flat top layer of stones along a wall.', 's26-pruned'),
    gloss('pruning', 'Cutting bits off a plant on purpose, to help it grow well.', 's26-pruned'),
    gloss('dignity', 'Behaving in a calm, serious way that earns respect.', 's26-moss-wall'),
    gloss(
      'perimeter',
      'The total distance all the way round the edge of a shape.',
      's26-earth-pick',
    ),
    gloss('memorial', 'Something that helps people remember someone who has died.', 's26-hush'),
    gloss('compost', 'Rotted-down plant waste that makes soil rich for growing.', 's26-beds'),
    gloss(
      'raised bed',
      'A garden bed built up in a box, so the soil is higher than the ground.',
      's26-beds',
    ),
    gloss('catch your death', 'An old saying for catching a very bad cold.', 's26-tobin-finds'),
    gloss('gaffer', 'An old word for a boss, or for an old man.', 's26-tobin-bench'),
    gloss('laid up', 'Taken out of use for a while, like boats over winter.', 's26-mum'),
    gloss('gloat', 'To show off unkindly about winning.', 's26-race'),
    gloss(
      'exaggerate',
      'To make something sound bigger or more exciting than it really was.',
      's26-tobin-bench-cellar',
    ),
    gloss('generator', 'A machine that makes electricity.', 's26-lift-1'),
    gloss('evergreen', 'Keeping its green leaves all year round.', 's26-lift-2'),
    gloss(
      'rosehip',
      'The round red fruit a rose grows after its flower, with seeds inside.',
      'c12-wall-garden',
    ),
    gloss(
      'buttonhole',
      'The slit for a button; a flower worn there is also called a buttonhole.',
      'c12-wall-garden',
    ),
    gloss('vibration', 'A very fast shaking movement, back and forth.', 's26-door-thrums'),
  ],
  notes:
    'Lessons: robins following diggers and what they eat (K-LS1-1), territory (K-ESS3-1), lamplighters (D2.His.2.K-2), ' +
    'Linnet’s motive (RL.3.3), molehills (K-ESS2-2), the bow of a key (L.3.4), points of view, walled gardens and the ' +
    'sun’s warmth (K-PS3-1), the scratch test, grief, reading a face, ramp or lift as compared solutions (3-5-ETS1-2, ' +
    'think question), pruning (K-ESS3-3), evidence, Moss’s motive (think), asking for what you want, plants’ needs ' +
    '(2-LS2-1), the Sun in the south (5-ESS1-2), perimeter 3 + 2 + 3 + 2 = 10 m (3.MD.D.8), evening light, grief and ' +
    'keeping company (RL.4.2, think), accessible design (D2.Civ.8.K-2), bulbs (3-LS1-1), half of 20 (3.NF.A.1), seeds ' +
    'buried by animals (2-LS2-2), safe vs well (think), metaphor (L.4.5), short winter days (1-ESS1-2), find not fetch, ' +
    'snowdrops, family likeness (1-LS3-1), gravity on a slope (3-PS2-1), theme: the garden changed, not Linnet (RL.4.2), ' +
    'who a special place is for (think), reuse. Variants: vibration (1-PS4-1), 3 × 15 = 45 cm (3.OA.A.3), the ' +
    'one-in-twelve ramp rule 45 × 12 = 540 cm (3.OA.D.8), independence, ivy (4-LS1-1), exaggeration, the steps as the ' +
    'problem (K-2-ETS1-1), shared places, rosehips (3-LS1-1), seeds carried by birds, safe vs well again. ' +
    '“Wick” is not used: the main game’s childLines replace it, so the reader band says “living” and “dormant”.',
};

// ================================================================== variants (SIDE_STORY_S26_VARIANTS)
const S26_VARIANTS: EduScene[] = [
  // ---------------------------------------------------------------- step 3 done, if s12Done
  scene(
    's26-door-thrums',
    [
      N('Then the wind comes along the wall, and lifts the ivy like a curtain.'),
      N('Under it, exactly at the height of Linnet’s eyes, is a round iron knob.'),
      L('There. There! You lot stand too tall to see anything.', 'happy'),
      N(
        'The hum in the old wall is loudest here. Every little round door in the mortar has a face in it, watching.',
      ),
      TH('Good morning, Keeper. Yes. That is a door. We have lived beside it for ever.'),
      TH(
        'Nobody asked us about it. We did not like to mention it. We are now checking whether we should have.',
        'think',
      ),
      L('Is the wall talking?', 'shock'),
      Y('Mostly it’s agreeing with itself.'),
      N(
        'The key goes in as if it has been waiting. It takes both your hands to turn it, and then Linnet’s as well.',
      ),
    ],
    [
      {
        domain: 'science',
        skill: 'sound is vibration, and travels through solids',
        standard: '1-PS4-1',
        kind: 'notice',
        after: 3,
        lines: [
          N(
            'A hum is a vibration: something shaking back and forth very fast. Put your hand on your throat and hum to feel it.',
          ),
          N(
            'Sound travels through solid stone as well as air. That’s why the whole wall seems to hum.',
          ),
        ],
        parentNote:
          'Learned that sound is made by vibrations and can travel through solids like stone.',
      },
    ],
  ),
  // ---------------------------------------------------------------- preludes, s26-steps = ramp
  scene(
    's26-ramp-1',
    [
      N(
        'First evening of the ramp. Dusty takes the top step out in one go, and stands back, pleased.',
      ),
      L('That’s not a ramp. That’s a hole with ambitions.', 'think'),
      DU('Give it time.'),
      N(
        'Linnet sits at the top, beside Sparks’s coil of wire, and tells you where every barrow of earth goes.',
      ),
      N('She is right about all of it.'),
      DU('Each step’s fifteen centimetres high. I measured. Twice.'),
    ],
    [
      {
        domain: 'maths',
        skill: 'multiply to find a total height',
        standard: '3.OA.A.3',
        kind: 'ask',
        after: 5,
        prompt: [
          L(
            'Three steps, fifteen centimetres each. So how high does the ramp have to drop, top to bottom?',
            'think',
          ),
        ],
        options: [
          opt(
            '45 cm',
            [L('Yes. 3 × 15 = 45. Forty-five centimetres. Write it down, Dusty.', 'happy')],
            true,
          ),
          opt('18 cm', [L('That’s 15 + 3. It’s three lots of 15: 15 + 15 + 15 = 45 centimetres.')]),
          opt('30 cm', [L('That’s only two steps. Three lots of 15 is 45 centimetres.')]),
        ],
        parentNote: 'Multiplied 3 × 15 to find the total height of three steps.',
      },
    ],
  ),
  scene(
    's26-ramp-2',
    [
      N('Second evening. It is nearly a ramp now, and Dusty wants to call it done.'),
      L('It’s too steep. I’d go down that in one second flat, straight into the rose.', 'angry'),
      DU('It’s fine. I walked down it.'),
      L('You walked down it. Dig it longer.'),
      N('Dusty digs it longer. It takes the rest of the evening.'),
      N('Afterwards Dusty admits that Linnet was right.'),
    ],
    [
      {
        domain: 'maths',
        skill: 'two-step multiplication with a ramp rule',
        standard: '3.OA.D.8',
        kind: 'ask',
        after: 3,
        prompt: [
          N(
            'Builders often use a rule for wheelchair ramps: at least 12 centimetres along for every 1 centimetre down.',
          ),
          L(
            'The drop is 45 centimetres. How long does my ramp need to be? Hint: 45 × 10, then add 45 × 2.',
            'think',
          ),
        ],
        options: [
          opt(
            '540 cm',
            [
              L(
                'Yes. 450 + 90 = 540 centimetres. That’s five metres forty. Told you. Dig it longer.',
                'happy',
              ),
            ],
            true,
          ),
          opt('57 cm', [N('That’s 45 + 12. We need 12 lots of 45: 450 + 90 = 540 centimetres.')]),
          opt('450 cm', [N('That’s 45 × 10. Add 45 × 2 = 90 as well: 540 centimetres.')]),
        ],
        parentNote:
          'Used a two-step multiplication (45 × 10 + 45 × 2) to find the length a ramp needs.',
      },
    ],
  ),
  scene(
    's26-ramp-3',
    [
      N(
        'Third evening, and the last barrow goes in. The ramp runs from the door to the path, long and shallow and tamped hard.',
      ),
      N('Linnet goes down it before anyone can offer anything.'),
      N(
        'At the bottom she doesn’t say a word. She goes straight to the living rose and puts her hand on it.',
      ),
      N('Dusty leans on the spade and looks at nothing in particular, for quite a long time.'),
      Y('All right, Dusty?'),
      DU('Fine. Dust in the eye. Big garden. Lot of dust.', 'soft'),
    ],
    [
      {
        domain: 'sel',
        skill: 'read feelings people don’t say out loud',
        standard: 'CASEL: Social awareness',
        kind: 'ask',
        after: 5,
        prompt: [N('Neither Linnet nor Dusty says how they feel. What do you think is going on?')],
        options: [
          opt(
            'They’re both moved, and don’t want a fuss.',
            [
              N(
                'That’s how it reads. Sometimes the biggest feelings come out as silence, or a joke about dust.',
              ),
            ],
            true,
          ),
          opt('They’re bored.', [
            N(
              'Look again: Linnet’s hand on the rose, Dusty staring at nothing. That’s a big feeling kept quiet.',
            ),
          ]),
        ],
        parentNote:
          'Read characters’ feelings from their actions when they didn’t say them out loud.',
      },
    ],
  ),
  // ---------------------------------------------------------------- preludes, s26-steps = lift
  scene(
    's26-lift-1',
    [
      N(
        'Next evening Sparks lifts Linnet down again: front and back, never the sides, exactly as instructed.',
      ),
      SP('Smooth! Like a generator. A small, rude generator.', 'happy'),
      L('Thank you.'),
      N('She says it every time. It seems to cost her a little more every time.'),
      N('Down in the garden she works hard and fast, as if the minutes are counted.'),
      N('In a way, they are. Somebody else decides when she goes home.'),
    ],
    [
      {
        domain: 'sel',
        skill: 'having a say over your own day',
        standard: 'CASEL: Social awareness',
        kind: 'notice',
        after: 5,
        lines: [
          N('Thank you is good manners. But needing to ask, every single time, wears people down.'),
          N('Most of us like deciding for ourselves when we come and go. Linnet is no different.'),
        ],
        parentNote:
          'Talked about how it feels to depend on others for everyday things, and why independence matters.',
      },
    ],
  ),
  scene(
    's26-lift-2',
    [
      N('Second evening. Sparks is late: a fuse at the pond lantern.'),
      N(
        'Linnet waits at the top of the steps for half an hour, watching you and Dusty work below.',
      ),
      L('I don’t mind.', 'think'),
      N(
        'She minds. She has pulled every ivy leaf within reach off the wall, and laid them out in order of size.',
      ),
      SP('Sorry! Sorry! Right. Front and back.', 'shock'),
      N('Linnet leaves the row of leaves behind her, smallest to biggest, perfectly straight.'),
    ],
    [
      {
        domain: 'science',
        skill: 'how ivy climbs and stays green',
        standard: '4-LS1-1',
        kind: 'notice',
        after: 3,
        lines: [
          N(
            'Ivy is evergreen: it keeps its leaves all year, even in winter. That’s why the door stayed hidden in every season.',
          ),
          N(
            'It climbs with tiny roots along its stems that grip the stone, so it can reach the light without a trunk.',
          ),
        ],
        parentNote: 'Learned how ivy climbs with tiny gripping roots and stays green all winter.',
      },
    ],
  ),
  scene(
    's26-lift-3',
    [
      N(
        'Third evening. Sparks lifts her down, and then has to go, and says she’ll be back to lift her up again.',
      ),
      L('What if you’re not?', 'think'),
      SP('Then I’ll be back later!', 'happy'),
      N('Linnet doesn’t answer that.'),
      N('She goes to the living rose and stays there, as far from the steps as the garden allows.'),
      N('Every so often she looks up at the door.'),
    ],
    [
      {
        domain: 'sel',
        skill: 'name a “what if” worry',
        standard: 'CASEL: Self-awareness',
        kind: 'ask',
        after: 5,
        prompt: [N('Linnet’s “what if you’re not?” is a worry. What is she really worried about?')],
        options: [
          opt(
            'Being stuck in the garden until someone comes.',
            [
              N(
                'Yes. Her way out depends on someone else turning up. “What if” worries are normal, and worth saying aloud.',
              ),
            ],
            true,
          ),
          opt('That Sparks will drop her.', [
            N(
              'Sparks lifts carefully, as told. The worry is about getting back up the steps if nobody comes.',
            ),
          ]),
        ],
        parentNote:
          'Identified a character’s “what if” worry and talked about saying worries aloud.',
      },
    ],
  ),
  // ---------------------------------------------------------------- step 10 done, if s13Done
  scene(
    's26-tobin-bench-cellar',
    [
      T(
        'This puts me in mind of a story. Hazel’s grandchild here came down the mill cellar with me. Five levels.',
        'happy',
      ),
      T(
        'Six. Eels as long as your arm. Rats in hats. A wheel the size of the moon. Go on, tell her.',
        'happy',
      ),
      Y('Four levels. The eels were annoyed. Nobody had a hat.'),
      T('That’s the dull version. Where was I.', 'think'),
      N(
        'He stops. He looks at the roses, and at Linnet, up to her elbows in a raised bed, and not tipping.',
      ),
      T(
        'I kept a door shut once, for twenty years. I thought I was sparing people. It got heavy.',
        'soft',
      ),
      N('He sits on, and stops arguing, and watches her work until it’s dark.'),
      ...TOBIN_WAY_OUT,
    ],
    [
      {
        domain: 'literacy',
        skill: 'spot exaggeration',
        standard: 'RL.3.3',
        kind: 'ask',
        after: 2,
        prompt: [
          N(
            'Tobin says six levels and rats in hats. You say four levels and no hats. What is Tobin doing?',
          ),
        ],
        options: [
          opt(
            'Exaggerating, to make a better story.',
            [
              N(
                'Yes. Storytellers often stretch the truth for fun. Listeners learn to tell a tall tale from a true one.',
              ),
            ],
            true,
          ),
          opt('Telling the exact truth.', [
            N('You were there: four levels, no hats. He’s exaggerating, the way storytellers do.'),
          ]),
        ],
        parentNote: 'Recognised exaggeration in a character’s storytelling.',
      },
      roseWorry(9),
    ],
  ),
  // ---------------------------------------------------------------- step 11 done, if s26-steps = lift
  scene(
    's26-snowdrops-lifted',
    [
      N('Her tracks go along the old wall to the open door, and stop.'),
      N(
        'Linnet is at the top of the three steps. They are under a foot of snow. Nobody cleared them; nobody thought anyone would come.',
      ),
      L('An HOUR. I’ve been here an hour. I can see them from here. Look at them.', 'angry'),
      N(
        'Down by Hush’s bench, through the snow, there are snowdrops. She has been looking at them for an hour.',
      ),
      L(
        'Sparks is at the falls. Dusty’s up the cliff. Grandad can’t. Everyone who lifts is somewhere else.',
        'angry',
      ),
      L('It isn’t me that’s stuck. It’s these stupid steps.', 'angry'),
      Y('Then let’s get rid of them.'),
      L('Now? In this?', 'shock'),
      Y('Now. You tell me where.'),
      N(
        'So you dig, in the snow, with frozen hands and Dusty’s spare spade, while Linnet directs from the top like an admiral.',
      ),
      L(
        'Shallower. Shallower! I’ll go over backwards on that. Make it longer, not steeper. LONGER.',
        'think',
      ),
      N(
        'It takes all morning, and it isn’t pretty. When it’s done she goes down it before you can offer, and doesn’t look back.',
      ),
      N(
        'Snowdrops, all round Hush’s bench. Some in Linnet’s straight row, the rest wherever your Nubbin hid them.',
      ),
      L('I’d have got in on my own. If anybody had built it so I could.', 'soft'),
    ],
    [
      {
        domain: 'science',
        skill: 'define the real problem',
        standard: 'K-2-ETS1-1',
        kind: 'ask',
        after: 5,
        prompt: [
          N(
            'Linnet says it isn’t her that’s stuck, it’s the steps. Is she right about where the problem is?',
          ),
        ],
        options: [
          opt(
            'Yes. The steps are the problem. Change them.',
            [
              N(
                'Yes. Engineers start by defining the problem properly. Here it’s the steps, not a person.',
              ),
            ],
            true,
          ),
          opt('No. The real problem is the snow.', [
            N(
              'The snow makes it worse. But even in summer, the steps need a lifter every time. The steps are the problem, so that’s what gets fixed.',
            ),
          ]),
        ],
        parentNote: 'Defined a problem correctly: the barrier, not the person.',
      },
      {
        domain: 'sel',
        skill: 'anger at an unfair barrier is fair',
        standard: 'CASEL: Self-management',
        kind: 'notice',
        after: 10,
        lines: [
          N(
            'Linnet is furious, and she has a right to be. She doesn’t just stew: she puts it to work and directs the dig.',
          ),
          N('Big feelings can be used well. Hers built a ramp.'),
        ],
        parentNote: 'Talked about anger at something unfair, and turning it into useful action.',
      },
    ],
  ),
  // ---------------------------------------------------------------- complete, if s26-key = post
  scene(
    's26-complete-post',
    [
      ...COMPLETE_START,
      N(
        'The key hangs on the old wall post, under the lantern. By the end of the week, three people you have never met have been in to look.',
      ),
      ...COMPLETE_END,
    ],
    [
      {
        domain: 'social-studies',
        skill: 'shared places and their unwritten rules',
        standard: 'D2.Civ.8.K-2',
        kind: 'notice',
        after: 2,
        lines: [
          N(
            'A garden anyone can open is a shared place, like a park or a library. It belongs to all, so everyone looks after it.',
          ),
          N(
            'Shared places run on simple rules: close the gate, don’t pick what isn’t yours, and let others have a turn.',
          ),
        ],
        parentNote:
          'Talked about shared public places and the rules that keep them fair for everyone.',
      },
    ],
  ),
  // ---------------------------------------------------------------- complete, if s26-key = door
  scene(
    's26-complete-door',
    [
      ...COMPLETE_START,
      N(
        'The key sits in the door, turned to open. Snow settles on its bow, and nobody brushes it off, and nobody turns it.',
      ),
      ...COMPLETE_END,
    ],
    [
      {
        domain: 'literacy',
        skill: 'an object as a symbol',
        standard: 'RL.4.2',
        kind: 'notice',
        after: 2,
        lines: [
          N(
            'A key that never turns is not much use as a key any more. It has become a symbol: a sign that means something.',
          ),
          N('This one means: this place is open, and it’s staying that way.'),
        ],
        parentNote: 'Noticed how an object in a story can become a symbol of an idea.',
      },
    ],
  ),
  // ---------------------------------------------------------------- campaign: chapter 12, inside c12-open
  scene(
    'c12-wall-garden',
    [
      N('At the old wall, Hazel stops.'),
      N(
        'The door in the wall stands open. She has walked past this wall for forty years, and never once seen a door in it.',
      ),
      N(
        'She goes in, slowly, one hand on the stone, and down the ramp without thinking about it, the way you do with a good one.',
      ),
      N(
        'Bare roses, pruned. Snowdrops round the bench, and a few in odd places, where somebody lost count.',
      ),
      N(
        'The robin comes down onto the back of Hush’s bench, and looks at her as if she owes it something.',
      ),
      N(
        'She stands among the roses for a long while, and says nothing. It is a different nothing from the pond.',
      ),
      N('Then she picks one rosehip off a cane, and puts it in her buttonhole.'),
      N(
        'On the way out she touches the old wall post, and keeps her hand there a little longer than at the others.',
      ),
    ],
    [
      {
        domain: 'science',
        skill: 'the rose’s life cycle: flower, hip, seed',
        standard: '3-LS1-1',
        kind: 'notice',
        after: 6,
        lines: [
          N(
            'A rosehip is a rose’s fruit. After the flower fades, the hip swells and ripens red, with seeds inside.',
          ),
          N(
            'Birds eat the hips in winter and spread the seeds. Flower, fruit, seed, new plant: a whole life cycle on one cane.',
          ),
        ],
        parentNote: 'Learned the life cycle of a rose, from flower to rosehip to seed.',
      },
      {
        domain: 'literacy',
        skill: 'reading a silence',
        standard: 'RL.1.4',
        kind: 'ask',
        after: 7,
        prompt: [
          N(
            '“A different nothing from the pond.” Hazel says nothing both times. How could two silences be different?',
          ),
        ],
        options: [
          opt(
            'One can be sad or worried, the other peaceful.',
            [
              N(
                'Yes. Silence can carry different feelings. Here, among the roses, it reads as peaceful.',
              ),
            ],
            true,
          ),
          opt('They can’t. Silence is just silence.', [
            N(
              'Think of a quiet hug and a quiet sulk. Both are silent; they feel very different. This one is a peaceful one.',
            ),
          ]),
        ],
        parentNote: 'Explained how a silence can show different feelings in a story.',
      },
    ],
  ),
  // ---------------------------------------------------------------- campaign: Moss Sleeps, after end-moss-sleeps
  scene(
    'end-moss-sleeps-garden',
    [
      N('Moss faded. That means he died: his body stopped working, and it won’t start again.'),
      N('His flower came up on the hill, by the flat stone where he always sat.'),
      N(
        'Linnet says that by midsummer its seed will be over the old wall, the way he went once a year.',
      ),
      N('Into the patch by Hush’s bench, the one he chose, where her white pebble still is.'),
      N('She says the robin will see to it. Nobody argues, and nobody makes a speech.'),
      N('He would have liked that. Both of his places, growing.'),
    ],
    [
      {
        domain: 'science',
        skill: 'seeds are spread by wind and animals',
        standard: '2-LS2-2',
        kind: 'notice',
        after: 4,
        lines: [
          N(
            'Plants can’t walk, so their seeds travel. Some float on the wind; some ride inside birds that eat fruit and drop the seeds far away.',
          ),
          N('Linnet might be right about the robin. Seeds cross walls all the time.'),
        ],
        parentNote: 'Learned how seeds are carried to new places by wind and animals.',
      },
    ],
  ),
  // ---------------------------------------------------------------- campaign: epilogue, every ending but The Collector
  scene(
    'end-epi-garden',
    [
      N(
        'The door in the old wall isn’t locked any more. Linnet comes every summer and tells everyone where to dig.',
      ),
      N('Hush’s roses come out in June, all at once, as if somebody told them to. Somebody did.'),
      N('Some years the robin nests in the ivy. Some years it just supervises.'),
      N('The ramp is still there. Nobody remembers the steps.'),
      N(
        'Hush grew roses for the ones who could only sit and look. Now it is a garden for anyone who comes.',
      ),
      N('It took one key, one ramp, and a lot of patience.'),
    ],
    [
      {
        domain: 'literacy',
        skill: 'reflect on a story’s ending',
        standard: 'RL.4.2',
        kind: 'ask',
        after: 5,
        prompt: [N('“Somebody did.” Who told the roses to come out, do you think?')],
        options: [
          opt('Linnet, the boss of the garden.', [
            N('That’s the joke, and it’s a good one. Linnet tells everything where to go.'),
          ]),
          opt('Everyone who looked after the garden.', [
            N(
              'A lovely reading. The pruning, the digging and the waiting all told the roses it was time.',
            ),
          ]),
          opt('Nobody. Roses flower in summer anyway.', [
            N(
              'True: roses flower in early summer by themselves. The line is half a joke, half a thank you.',
            ),
          ]),
        ],
        parentNote: 'Gave their own interpretation of a playful line in the ending.',
      },
    ],
  ),
  // ---------------------------------------------------------------- campaign: epilogue, The Collector
  scene(
    'end-epi-garden-cold',
    [
      N(
        'The door in the old wall stands open, and none of yours go in. They sit outside it in the sun, quite still.',
      ),
      N(
        'Linnet came the first summer. She looked at them for a long time, and asked what was wrong with them.',
      ),
      N('You said they were safe. She went home a week early, and didn’t come again.'),
      N('The roses come out in June anyway, for nobody.'),
      N('Safe is not the same as well. Linnet knew that better than anyone.'),
      N('The door is still open. It always will be.'),
    ],
    [
      {
        domain: 'literacy',
        skill: 'theme: safe is not the same as well',
        standard: 'RL.4.2',
        kind: 'ask',
        after: 4,
        prompt: [
          N(
            'Why do you think Linnet went home early? Think about what happened to her in the garden. No wrong answer.',
          ),
        ],
        options: [
          opt('It reminded her of being kept.', [
            N(
              'That’s a strong reading. She knew what it felt like to be safe but not allowed to live.',
            ),
          ]),
          opt('She was sad for the Nubbins.', [
            N('That’s kind, and likely true. Still and safe isn’t the same as happy.'),
          ]),
          opt('There was nobody to garden with.', [
            N('Fair. A garden is better with company. Hers had always been full.'),
          ]),
        ],
        parentNote:
          'Thought about a story’s theme, safety versus wellbeing, through a character’s choice.',
      },
    ],
  ),
];

// ================================================================== exports
export const EDU_S26_READER: EduQuest[] = [S26];

/** Reader versions of every scene in SIDE_STORY_S26_VARIANTS. */
export const EDU_S26_READER_VARIANTS: EduScene[] = S26_VARIANTS;

/** Every `edu:` check used by a `do` lesson in this file (the reader band uses none). */
export const CHECKS: string[] = [];
