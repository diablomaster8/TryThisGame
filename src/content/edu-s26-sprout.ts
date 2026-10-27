/**
 * The Learning Grove, sprout band (ages 3–6, read aloud by a grown-up): S26 The Walled Garden.
 *
 * Source: side-stories-s26.ts (SIDE_STORY_S26 and SIDE_STORY_S26_VARIANTS). One EduScene per
 * original scene, id `sprout:<original id>`: the 26 step and done scenes and s26-complete live in
 * the quest; the 15 variants (the Thrums door, the six ramp and lift preludes, Tobin’s cellar
 * bench, the lifted snow scene, the two other complete scenes and the four campaign hooks) live in
 * EDU_S26_SPROUT_VARIANTS and replace scenes exactly as the main quest’s notes say. See EDU-STYLE.md.
 *
 * - Every choice keeps its original id and `set`, so the flags still work. Every choice is kind
 *   and safe for this age, so none is dropped and no scene needs a `defaultChoice`.
 * - Learning angle (outline): bulbs and the seasons, how robins live, how pruning helps roses,
 *   and ramps and gardens built so everyone can use them. Also counting, shapes, first sounds,
 *   feelings, snow and melting, seeds that travel, and lamplighters long ago.
 * - Care notes kept: Linnet is never cured, pitied or called “brave”, and never made a lesson for
 *   anyone. Her chair is hers; nobody lifts her without asking. In the snow the steps are the
 *   problem, and the scene says so. The robin never speaks; your Nubbin never speaks. The Thrums
 *   (S12’s hive) speak as one chorus, as in the main game. Moss speaks (chapter 6 onwards).
 * - Hard things: the still Nubbin, Hush and Moss fade, and fading is said plainly as dying, with
 *   comfort straight after. Hush “letting herself fade” becomes “Later, Hush faded too.”
 * - No lines from the novel and none of the main lines the quest swaps out with childLines.
 *   The phrase about a patch of earth, the still garden and the valley word for alive are
 *   rewritten from scratch. Hazel is silent in c12-wall-garden.
 */
import type { EduQuest, EduScene, Lesson } from './types';
import type { Line, Choice } from '../config/story';

type Mood = Line['mood'];
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
type Beat = Omit<Lesson, 'id'>;
type Opt = NonNullable<Lesson['options']>[number];

/** One answer option. `best` marks the answer the lesson teaches. */
const opt = (label: string, reply: Line[], best = false): Opt =>
  best ? { label, best, reply } : { label, reply };

/** One sprout scene. Lesson ids are `sprout:<of>-l<n>`, numbered in play order. */
const sc = (
  of: string,
  lines: Line[],
  beats: Beat[],
  extra: { choices?: Choice[]; defaultChoice?: string } = {},
): EduScene => ({
  id: `sprout:${of}`,
  of,
  band: 'sprout',
  lines,
  ...extra,
  lessons: [...beats]
    .sort((a, b) => a.after - b.after)
    .map((b, i) => ({ id: `sprout:${of}-l${i + 1}`, ...b })),
});

// ---------------------------------------------------------------- shared pieces
/** Tobin’s way out, shared by s26-tobin-bench and s26-tobin-bench-cellar. */
const TOBIN_WAY_OUT: Line[] = [
  N('On the way out, Tobin pats the old wall.'),
  T('My old boss used to say: plant a rose where your worry sits.', 'soft'),
  T('Then the worry has to stand up and find another seat!', 'happy'),
];

/** The complete scene: shared start and end. The middle line follows s26-key. */
const COMPLETE_START: Line[] = [
  N('Winter sun shines over the wall. The garden isn’t grey any more.'),
  N('Dusty hangs the ivy up like a curtain. The robin watches.'),
];
const COMPLETE_END: Line[] = [
  DU('I’m making a bench from the old steps. For your Grove.', 'happy'),
  DU('And this is my digging apron. It’s yours now.', 'soft'),
  N('Linnet makes you a crown of snowdrops.'),
  L('No taking it off until teatime!', 'happy'),
  N('The robin lives with you now. It bosses the Nubbins about.'),
  N('The door stays open.'),
];

// ================================================================== the quest
const S26: EduQuest = {
  id: 'sprout:s26',
  of: 's26',
  band: 'sprout',
  title: 'The Walled Garden',
  goals: {
    's26-step1': {
      goal: 'Give the robin on the old wall post a crumb.',
      hint: 'Hold out a crumb on a flat hand. Keep very still.',
    },
    's26-step2': {
      goal: 'Say hello to the girl at Old Tobin’s gate.',
      hint: 'Tobin’s cottage is at the bottom of the lane. Let Linnet go at her own speed.',
    },
    's26-step3': {
      goal: 'Follow the robin along the old wall with Linnet.',
      hint: 'Watch where the robin scratches. Leave the lantern post’s earth alone.',
    },
    's26-step4': {
      goal: 'Fetch Dusty to the hidden garden.',
      hint: 'Dusty is up on the cliff. Bring Dusty to the ivy door.',
    },
    's26-step5': {
      goal: 'Ask Linnet how she wants to get down the three steps.',
      hint: 'Ask her first. It’s her garden too.',
    },
    's26-step6': {
      goal: 'Wait in the garden at sunset. Who has been cutting the roses?',
      hint: 'Sit on the stone bench. Keep still. Watch the top of the far wall.',
    },
    's26-step7': {
      goal: 'Help Linnet choose her own patch of garden.',
      hint: 'Show her every corner. She will know her patch when she sees it.',
    },
    's26-step8': {
      goal: 'Sit on the stone bench with Moss. Listen to his story.',
      hint: 'The bench is in the middle of the garden. Sit down and wait.',
    },
    's26-step9': {
      goal: 'Plant the flower bulbs in Linnet’s new beds.',
      hint: 'The bag of bulbs is inside the door. Your Nubbin will help carry.',
    },
    's26-step10': {
      goal: 'Bring Tobin into the garden. Don’t hide it from him.',
      hint: 'Help Tobin onto Hush’s bench. Let the garden do the rest.',
    },
    's26-step11': {
      goal: 'Find Linnet in the snowy garden.',
      hint: 'Follow her wheel tracks in the snow, along the old wall.',
    },
    's26-step12': {
      goal: 'Walk Linnet’s mum up to the garden.',
      hint: 'Go along the old wall to the ivy door. Listen!',
    },
    's26-step13': {
      goal: 'Decide what happens to the old key.',
      hint: 'There is no wrong answer. The door stays open.',
    },
  },
  scenes: [
    // ------------------------------------------------ 1. The Robin
    sc(
      's26-robin',
      [
        N('It is the end of summer. The rain has stopped.'),
        N('Fossil’s flower is new on the hill. Dusty misses Fossil very much.'),
        N('A robin sits on top of the old wall post. Like a hat!'),
        N('Wherever you go, the robin goes too. Hop, hop, hop.'),
        FE('That robin thinks you owe it something!', 'think'),
        FE('A robin followed me all spring once. For one raisin!'),
        N('Your Nubbin stares up at the robin. The robin stares back.'),
      ],
      [
        {
          domain: 'science',
          skill: 'name the colours of a robin',
          standard: 'ELOF: Scientific Reasoning',
          kind: 'ask',
          after: 2,
          prompt: [N('Look at the robin. What colour is its front?')],
          options: [
            opt(
              'Red-orange',
              [N('Yes! A red-orange front and a brown back. A robin redbreast!')],
              true,
            ),
            opt('Blue', [N('Look again. Its front is red-orange. Its back is brown.')]),
            opt('Green', [N('Green is the ivy! The robin’s front is red-orange.')]),
          ],
          parentNote: 'Looked closely at a robin and named its red-orange front and brown back.',
        },
      ],
    ),
    sc(
      's26-robin-fed',
      [
        N('You hold out a crumb of bun on your flat hand.'),
        N('You keep very still. Still, still, still.'),
        N('Peck! The robin takes the crumb. Back it goes to the post.'),
        N('It hops onto the ivy. It looks back at you.'),
        N('Off it goes, down the lane. Your Nubbin follows it.'),
        N('And you follow your Nubbin!'),
      ],
      [
        {
          domain: 'sel',
          skill: 'keep still and wait patiently',
          standard: 'ELOF: Approaches to Learning',
          kind: 'do',
          after: 1,
          check: 'edu:hold:palm:still',
          lines: [
            N('(Hold your hand out flat, like a little table.)'),
            N('(Now keep it still while we count to five together.)'),
            N('Robins like slow, quiet people. You did it!'),
          ],
          parentNote:
            'Practised keeping their body still and waiting, the way you do near a wild bird.',
        },
      ],
    ),
    // ------------------------------------------------ 2. Linnet
    sc(
      's26-linnet',
      [
        N('The robin leads you down the lane to Old Tobin’s cottage.'),
        N('A girl in her wheelchair is by the door. Her name is Linnet.'),
        L('Back wheels first, Grandad! Back. Wheels. First.', 'angry'),
        T('Hello! I’m Tobin. I lit the lamps in this valley for years.', 'happy'),
        T('Linnet is staying with me till winter.'),
        L('He says staying. I say KEPT. Like a hamster!', 'angry'),
        L('Nothing in this valley is flat! Not one thing.'),
        T('Be careful, love.', 'soft'),
        L('There! Everybody says “be careful”. All day long!', 'angry'),
      ],
      [
        {
          domain: 'social-studies',
          skill: 'life long ago: lamps lit by hand',
          standard: 'D2.His.2.K-2',
          kind: 'notice',
          after: 3,
          lines: [
            T('Long ago, the lamps had real little flames.'),
            T('Every evening I climbed up and lit them. One by one!'),
            N('(Can you reach up high and pretend to light a lamp?)'),
          ],
          parentNote:
            'Heard how street lamps were once lit by hand each evening, and acted it out.',
        },
        {
          domain: 'sel',
          skill: 'name a feeling: cross',
          standard: 'ELOF: Social and Emotional Development',
          kind: 'ask',
          after: 8,
          prompt: [N('Everyone tells Linnet to be careful. How does she feel?')],
          options: [
            opt(
              'Cross',
              [
                N('Yes. She feels cross. Everybody fusses, and nobody lets her do things.'),
                N('Cross is fine to feel. Saying it out loud helps.'),
              ],
              true,
            ),
            opt('Sleepy', [N('Look at her face. She is cross! Everybody fusses at her.')]),
          ],
          parentNote: 'Named the feeling “cross” and talked about why someone might feel it.',
        },
      ],
      {
        choices: [
          {
            id: 'agree',
            label: 'Say: “You’re right. It’s very hilly!”',
            set: { 's26-hello': 'agree' },
            then: [L('Thank you! Somebody with eyes.', 'happy'), N('She nearly smiles. Nearly.')],
          },
          {
            id: 'asked',
            label: 'Ask: “Would you like a push up the lane?”',
            set: { 's26-hello': 'asked' },
            then: [
              L('No.'),
              Y('All right.'),
              N('Linnet looks surprised. You listened to her “no”.'),
              L('You asked, though. Most people just grab the handles.', 'think'),
            ],
          },
          {
            id: 'walk',
            label: 'Say nothing. Walk beside her.',
            set: { 's26-hello': 'walk' },
            then: [
              N('Linnet zooms up the lane. She is fast!'),
              N('You walk beside her, at her speed.'),
              L('You’re not going to tell me to be careful?'),
              Y('Do you need telling?'),
              L('No.', 'think'),
            ],
          },
        ],
      },
    ),
    sc(
      's26-linnet-robin',
      [
        N('The robin lands on the lamp post. Right above Linnet’s head!'),
        L('Is that bird yours?'),
        Y('I think I’m its!'),
        L('Where does it live?'),
        Y('On the old wall. In the ivy.'),
        L('Is the lane flat, all the way there?', 'think'),
        N('It is! The only flat lane in the whole valley.'),
        L('Then show me. Tomorrow!', 'happy'),
      ],
      [
        {
          domain: 'maths',
          skill: 'position words: above and below',
          standard: 'K.G.A.1',
          kind: 'ask',
          after: 0,
          prompt: [N('Where is the robin?')],
          options: [
            opt('Above Linnet’s head', [N('Yes! Up on the lamp post, above her head.')], true),
            opt('Under her chair', [N('Look up! The robin is above her head, on the lamp post.')]),
          ],
          parentNote: 'Used the position word “above” to say where the robin was.',
        },
      ],
    ),
    // ------------------------------------------------ 3. The Key, and the Door
    sc(
      's26-key',
      [
        N('Next morning, Linnet is waiting at the top of the lane.'),
        L('Grandad thinks I’m reading. I am. I’m reading the valley!'),
        N('The robin hops along the old wall. Hop, stop. Hop, stop.'),
        N('It scratches at a little heap of earth. Scratch, scratch!'),
        N('Clink! Something hard is in the earth.'),
        N('You dig with your fingers. It’s a big old key!'),
        N('The lantern post feels warm. Something very old sleeps deep under it.'),
        N('You pat the earth back down. Let it sleep.', 'soft'),
        L('Everything here is old and asleep!', 'think'),
      ],
      [
        {
          domain: 'science',
          skill: 'moles dig tunnels and make molehills',
          standard: 'K-ESS2-2',
          kind: 'notice',
          after: 3,
          lines: [
            N('That little heap is a molehill.'),
            N('A mole made it. Moles dig tunnels under the ground.'),
            N('They push the extra earth up. Pop! A molehill.'),
          ],
          parentNote:
            'Learned that moles dig tunnels and push up molehills, changing the ground around them.',
        },
      ],
    ),
    sc(
      's26-door',
      [
        N('Whoosh! The wind lifts the ivy like a curtain.'),
        N('Under the ivy is a round iron knob.'),
        L('There! You’re all too tall to see anything.', 'happy'),
        N('You walk past this wall every day. Your Nubbin stares at you. Oops!'),
        N('There is a door! And a keyhole.'),
        N('The key fits. You turn it with both hands.'),
        N('It’s stiff. Linnet puts her hands on too. Click!'),
      ],
      [
        {
          domain: 'maths',
          skill: 'count to 4',
          standard: 'K.CC.B.5',
          kind: 'do',
          after: 6,
          check: 'edu:count:hands:4',
          lines: [
            N('(How many hands turned the key? Your two, and Linnet’s two.)'),
            N('(Count them with me: one, two, three, four!)'),
            L('Four hands. That’s teamwork.', 'happy'),
          ],
          parentNote: 'Counted four hands working together to turn the key.',
        },
      ],
    ),
    // ------------------------------------------------ 4. Inside, and the green
    sc(
      's26-inside',
      [
        N('The door creaks open. Creeeak!'),
        N('Three stone steps go down into a garden.'),
        N('It has walls all the way round. Like a big box.'),
        N('Everything is grey. Grey sticks. Grey roses. A stone bench.'),
        L('Nobody has been in here for ages and ages.', 'soft'),
        L('Is it all dead?', 'sad'),
        Y('I don’t know. But I know who would know!'),
        L('Go and fetch them. I’ll wait up here.'),
      ],
      [
        {
          domain: 'sel',
          skill: 'listen carefully',
          standard: 'ELOF: Approaches to Learning',
          kind: 'do',
          after: 4,
          check: 'edu:listen:sounds:garden',
          lines: [
            N('(Let’s listen to the garden. Close your eyes.)'),
            N('(What can you hear? A bird? The wind? Your own breathing?)'),
          ],
          parentNote: 'Closed their eyes and listened carefully for quiet sounds.',
        },
      ],
    ),
    sc(
      's26-wick',
      [
        N('Dusty comes with a spade.'),
        DU('Since Fossil died, I haven’t wanted to dig anything.', 'sad'),
        N('Dusty scratches a grey stick with a thumbnail. Scritch.'),
        N('Under the grey, it is green! Bright, wet green.'),
        DU('Green inside means this one is alive.', 'happy'),
        DU('Most of this garden is just resting. Waiting for spring.'),
        L('Then wake it up!'),
        DU('Yes. I want to dig this one.', 'soft'),
      ],
      [
        {
          domain: 'science',
          skill: 'tell a living stem from a dead one',
          standard: 'ELOF: Scientific Reasoning',
          kind: 'ask',
          after: 4,
          prompt: [
            N('One stick is green inside. One is brown and dry.'),
            N('Which stick is alive?'),
          ],
          options: [
            opt('The green one', [DU('Yes! Green and wet inside means alive.', 'happy')], true),
            opt('The brown one', [
              DU('That one is dry and brown. It’s dead wood. The green one is alive.'),
            ]),
          ],
          parentNote: 'Learned that a living stem is green inside and a dead one is brown and dry.',
        },
      ],
    ),
    // ------------------------------------------------ 5. Three Steps
    sc(
      's26-steps',
      [
        N('Linnet is still at the top of the three steps.'),
        L('Three steps! Somebody built them and walked off.', 'angry'),
        N('Sparks comes along with a coil of wire.'),
        SP('Ooh, a hidden garden! Want me to lift you down?', 'happy'),
        DU('Or we could dig the steps into a slope. A ramp.'),
        Y('Linnet, what would you like?'),
        L('I don’t mind being lifted.'),
        N('But her face looks like she minds. A lot.'),
      ],
      [
        {
          domain: 'sel',
          skill: 'notice what a face says',
          standard: 'CASEL: Social awareness',
          kind: 'ask',
          after: 7,
          prompt: [N('Linnet says, “I don’t mind.” Look at her face. How does she feel?')],
          options: [
            opt(
              'Not happy about it',
              [
                N('Yes. Her words say one thing. Her face says another.'),
                N('Asking, and really looking, helps us know.'),
              ],
              true,
            ),
            opt('Very happy', [N('Look again. Her face is cross. She minds.')]),
          ],
          parentNote: 'Noticed that a face can show a feeling that words don’t say.',
        },
      ],
      {
        choices: [
          {
            id: 'ramp',
            label: 'Dig a ramp. Dusty and you. Three evenings.',
            set: { 's26-steps': 'ramp' },
            then: [
              L('Three evenings of watching you two dig!', 'angry'),
              L('Fine. Somebody has to tell you where.', 'think'),
              N('Sparks leaves her wire at the top. Linnet sits beside it.'),
            ],
          },
          {
            id: 'lift',
            label: 'Ask Sparks to lift Linnet down now.',
            set: { 's26-steps': 'lift' },
            then: [
              SP('How do you want it? Tell me. I’ll do it your way.'),
              L('Front and back. Not the sides. Don’t tip me.'),
              N('Sparks does it exactly right. Linnet’s wheels touch the path.'),
              L('Thank you.', 'soft'),
            ],
          },
        ],
      },
    ),
    // ------------------------------------------------ 6. The Top of the Wall
    sc(
      's26-pruned',
      [
        N('The garden wakes up slowly. Like a sleepy cat.'),
        N('Dusty cuts away the dead wood. You carry it out.'),
        N('Linnet spots a rose that somebody has cut. Snip!'),
        L('Somebody’s been in here! That cut is new.', 'think'),
        DU('And they held the shears upside down!', 'think'),
        N('Everybody looks up at the top of the wall.'),
        N('Nobody is there. Just one little broken twig.'),
        L('We’ll watch at sunset. Then we’ll catch them!'),
      ],
      [
        {
          domain: 'science',
          skill: 'cutting off dead wood helps a rose grow',
          standard: 'K-ESS3-3',
          kind: 'do',
          after: 1,
          check: 'edu:sort:sticks:dead-alive',
          lines: [
            N('(Help Dusty sort. Dry, brown sticks go in the pile.)'),
            N('(Green, living stems stay on the rose.)'),
            DU('Cutting off the dead bits helps the rose grow new ones.'),
          ],
          parentNote:
            'Sorted dead sticks from living stems and heard that pruning helps a rose grow.',
        },
      ],
    ),
    sc(
      's26-moss-wall',
      [
        N('Sunset. The sky goes orange, then dark blue.'),
        N('Something small and green climbs over the wall. Slowly.'),
        N('It has a rose twig in its mouth. It’s Moss!'),
        M('Good evening. I was cutting the roses.', 'think'),
        L('You did it upside down!', 'angry'),
        M('My hands are tiny, child. Everything is upside down for me.'),
        L('You can talk!', 'shock'),
        M('When there is something worth saying.'),
        M('I come here once a year. To remember a friend.', 'soft'),
      ],
      [
        {
          domain: 'science',
          skill: 'sunset comes before night',
          standard: '1-ESS1-1',
          kind: 'ask',
          after: 0,
          prompt: [N('The sun is going down. What comes next?')],
          options: [
            opt('Night', [N('Yes! After sunset comes night. Then morning again.')], true),
            opt('Breakfast', [N('Not yet! First comes night. Breakfast is in the morning.')]),
          ],
          parentNote: 'Talked about the pattern of sunset, night and morning.',
        },
      ],
    ),
    // ------------------------------------------------ 7. A patch of her own
    sc(
      's26-earth-ask',
      [
        N('Moss sits on the wall again.'),
        M('I’m not here. I’m part of the wall.'),
        L('Moss? Could I have a little patch of garden?', 'soft'),
        M('What would you do with it?', 'think'),
        L('Grow things. Seeds and flowers. All by myself.', 'soft'),
        M('Then you shall have one. Any patch you like.', 'soft'),
        M('You make me think of Hush. She loved growing things too.', 'soft'),
        L('Who’s Hush?'),
        M('A friend. I will tell you, on the bench.'),
      ],
      [
        {
          domain: 'science',
          skill: 'what plants need to grow',
          standard: 'K-LS1-1',
          kind: 'ask',
          after: 4,
          prompt: [M('What does a little plant need, to grow?', 'think')],
          options: [
            opt(
              'Earth, water and sunshine',
              [M('Yes. Earth, water and sun. And somebody patient.', 'soft')],
              true,
            ),
            opt('Sweets', [M('Ha. Plants don’t eat sweets. They need earth, water and sun.')]),
            opt('A dark cupboard', [M('Too dark! Plants need earth, water and sunshine.')]),
          ],
          parentNote: 'Talked about what plants need: earth, water and sunlight.',
        },
      ],
    ),
    sc(
      's26-earth-pick',
      [
        N('You show Linnet every corner of the garden.'),
        N('Linnet looks and looks. She is very fussy.'),
        L('Too shady. Too stony. Too near the door.'),
        L('What do you think?', 'think'),
      ],
      [
        {
          domain: 'maths',
          skill: 'name a rectangle: four sides, four corners',
          standard: 'K.G.A.2',
          kind: 'do',
          after: 3,
          check: 'edu:draw:shape:rectangle',
          lines: [
            N('(Linnet will put a stick at each corner. Four sticks!)'),
            N('(Four corners, four straight sides. That’s a rectangle.)'),
            N('(Draw a rectangle in the air with your finger.)'),
          ],
          parentNote: 'Drew a rectangle in the air and counted its four sides and four corners.',
        },
      ],
      {
        choices: [
          {
            id: 'sun',
            label: 'The sunny corner by the wall.',
            set: { 's26-plot': 'sun' },
            then: [
              L('Obviously. I was testing you!', 'happy'),
              N('She marks it out with four sticks and string.'),
            ],
          },
          {
            id: 'rose',
            label: 'Under the old rose, by the green.',
            set: { 's26-plot': 'rose' },
            then: [
              L('Next to the living one. Yes!', 'soft'),
              N('She marks it out with four sticks and string.'),
            ],
          },
          {
            id: 'hers',
            label: 'Wherever you like. It’s yours.',
            set: { 's26-plot': 'hers' },
            then: [
              L('Nobody’s ever said that to me.', 'think'),
              N('She picks the sunny corner. Four sticks. One string.'),
            ],
          },
        ],
      },
    ),
    // ------------------------------------------------ 8. Hush’s Bench
    sc(
      's26-bench',
      [
        N('The evening light is golden.'),
        N('Moss climbs down off the wall, slowly.'),
        N('He sits on the stone bench. He has sat here before.'),
        M('This was Hush’s bench. Her roses. Her garden.', 'soft'),
        L('Go on, then. Tell us about her.'),
        M('My friend. The quiet one. She looked after sad hearts.', 'soft'),
        N('Linnet puts her brake on. Dusty sits on the path.'),
        N('You sit on the bench too. And you wait.'),
      ],
      [
        {
          domain: 'sel',
          skill: 'sit quietly with someone who is about to share something hard',
          standard: 'CASEL: Relationship skills',
          kind: 'ask',
          after: 7,
          prompt: [N('Moss is getting ready to tell a sad story. What can we do?')],
          options: [
            opt('Sit quietly and listen', [N('Yes. Sitting close and listening helps.')], true),
            opt('Run around and shout', [N('Maybe later! Right now, quiet listening helps Moss.')]),
          ],
          parentNote:
            'Talked about sitting quietly and listening when a friend has something sad to say.',
        },
      ],
    ),
    sc(
      's26-hush',
      [
        M('Long ago, some Nubbins got very old and tired. They lay still.', 'sad'),
        M('Briar, my friend who laughed at everything, wanted them on the sunny hill.', 'sad'),
        M('Hush said no. The wind up there was too cold.'),
        M('So she carried them in here, one by one, all winter.'),
        M('Then she planted roses, so they had something pretty.'),
        M('One winter morning, the last still Nubbin faded.', 'sad'),
        N('Faded means it died. Its body stopped working, and won’t start again.'),
        M('Hush was right beside it. It wasn’t alone.', 'soft'),
        M('Later, Hush faded too. Her door stayed locked for a long time.', 'soft'),
        M('One day, if I have a flower, I’d like it here.', 'soft'),
        N('Linnet puts a white pebble on that spot. She doesn’t say a word.'),
      ],
      [
        {
          domain: 'sel',
          skill: 'it is all right to feel sad, and remembering helps',
          standard: 'CASEL: Self-awareness',
          kind: 'notice',
          after: 7,
          lines: [
            N('This is a sad story. It’s all right to feel sad.'),
            N('(What helps when you feel sad? A hug? A friend?)'),
            M('Remembering helps me. That is why I come here.', 'soft'),
          ],
          parentNote:
            'Heard a sad story told plainly, and talked about what helps when you feel sad.',
        },
      ],
    ),
    // ------------------------------------------------ 9. Autumn Bulbs
    sc(
      's26-beds',
      [
        N('Autumn now. The leaves turn gold, then brown.'),
        N('Dusty builds wooden beds just the right height for Linnet’s hands.'),
        DU('I measured your arms. Is it right?', 'happy'),
        L('It’s right.', 'soft'),
        L('Dusty: earth. You: bulbs. Nubbin: carry. Robin: look important!'),
        N('Linnet is the boss. She is very good at it.'),
        L('What goes in first? You choose.', 'think'),
      ],
      [
        {
          domain: 'social-studies',
          skill: 'making places everyone can use',
          standard: 'D2.Civ.8.K-2',
          kind: 'ask',
          after: 1,
          prompt: [N('Why did Dusty make the beds this high?')],
          options: [
            opt('So Linnet can reach', [N('Yes! Now Linnet can dig right from her chair.')], true),
            opt('To keep the robin out', [
              N('Ha! Robins can fly. The height is so Linnet can reach.'),
            ]),
          ],
          parentNote: 'Talked about building things so that everyone can reach and use them.',
        },
        {
          domain: 'science',
          skill: 'bulbs are planted in autumn and flower later',
          standard: 'ELOF: Scientific Reasoning',
          kind: 'notice',
          after: 3,
          lines: [
            DU('A bulb is like a little lunchbox for a plant.'),
            DU('We plant it in autumn. It rests in the cold earth.'),
            DU('Then, when it’s ready, up comes a flower!', 'happy'),
          ],
          parentNote: 'Learned that bulbs store food, are planted in autumn and flower later.',
        },
      ],
      {
        choices: [
          {
            id: 'snowdrops',
            label: 'Snowdrops. They come up first!',
            set: { 's26-bulbs': 'snowdrops' },
            then: [L('First! Before anybody’s ready.', 'happy')],
          },
          {
            id: 'crocus',
            label: 'Purple crocuses. Bright and loud!',
            set: { 's26-bulbs': 'crocus' },
            then: [L('Loud. Good. This garden’s been quiet too long.', 'happy')],
          },
          {
            id: 'mix',
            label: 'A bit of everything!',
            set: { 's26-bulbs': 'mix' },
            then: [L('A race! My flowers will win, obviously.', 'happy')],
          },
        ],
      },
    ),
    sc(
      's26-cheeks',
      [
        N('Your Nubbin carries bulbs. One in each cheek!'),
        N('Puff, puff. Two bulbs at a time.'),
        N('Your Nubbin sniffs a bulb. Not supper. It plants it, very crossly.'),
        N('It plants more. It hides some all over the garden!'),
        L('Your Nubbin has no sense of order at all.', 'think'),
        N('It hides one under the bench. Pat, pat.'),
        L('…I like it.', 'soft'),
      ],
      [
        {
          domain: 'maths',
          skill: 'add 2 and 2',
          standard: 'K.OA.A.1',
          kind: 'do',
          after: 1,
          check: 'edu:add:bulbs:2-and-2',
          lines: [
            N('(Your Nubbin carries two bulbs. Then two more.)'),
            N('(Show two fingers, then two more. How many now?)'),
            N('(Four bulbs!)'),
          ],
          parentNote: 'Added two and two on their fingers to make four.',
        },
      ],
    ),
    // ------------------------------------------------ 10. Mind Yourself
    sc(
      's26-tobin-finds',
      [
        N('One day, Tobin follows Linnet’s wheel tracks to the door.'),
        T('Linnet! Is that a SPADE?', 'shock'),
        T('You’ll catch cold! You’ll tip over! Come away!', 'angry'),
        N('Linnet’s happy face goes cross, all at once.'),
        L('Everybody keeps me in. Nobody lets me do anything!', 'angry'),
        L('This is the first place I get to DO things.', 'sad'),
        T('I only want you safe, love.', 'sad'),
        N('Linnet looks at you. Will you send Tobin away?'),
      ],
      [
        {
          domain: 'sel',
          skill: 'two people can feel different things at once',
          standard: 'CASEL: Social awareness',
          kind: 'ask',
          after: 6,
          prompt: [N('Tobin feels scared for Linnet. How does Linnet feel?')],
          options: [
            opt(
              'Cross. She wants to do things.',
              [
                N('Yes. Tobin wants her safe. Linnet wants to do things.'),
                N('Both feelings are real. Talking helps.'),
              ],
              true,
            ),
            opt('Sleepy', [N('Look at her face. She is cross! She wants to do things herself.')]),
          ],
          parentNote: 'Noticed that two people can feel different things about the same moment.',
        },
      ],
      {
        choices: [
          {
            id: 'asked',
            label: 'Ask Tobin to sit on the bench. Just for a minute.',
            set: { 's26-tobin': 'asked' },
            then: [
              T('Sit? Well. One minute.', 'think'),
              N('He sits. The stone is warm. He looks surprised.'),
            ],
          },
          {
            id: 'shown',
            label: 'Ask Linnet to show him round. It’s her garden too.',
            set: { 's26-tobin': 'shown' },
            then: [
              L('Fine. Grandad, come here. Look at this.', 'angry'),
              N('She shows him everything. The beds, the roses, the pebble.'),
              N('Then Tobin sits down on the bench.'),
            ],
          },
        ],
      },
    ),
    sc(
      's26-tobin-bench',
      [
        T('This reminds me of a story! One snowy winter…', 'happy'),
        T('The snow came right up to the lamp posts! And I…', 'think'),
        N('Tobin stops. He watches Linnet dig. She doesn’t tip.'),
        T('Where was I?', 'soft'),
        N('He sits and watches her until it’s dark.'),
        ...TOBIN_WAY_OUT,
      ],
      [
        {
          domain: 'sel',
          skill: 'seeing for yourself can make a worry smaller',
          standard: 'CASEL: Self-management',
          kind: 'ask',
          after: 4,
          prompt: [N('Tobin was worried. What made his worry smaller?')],
          options: [
            opt(
              'Watching Linnet garden',
              [N('Yes. He saw for himself. Linnet was doing just fine.')],
              true,
            ),
            opt('Shouting louder', [N('Shouting didn’t help. Sitting and watching did.')]),
          ],
          parentNote: 'Talked about how sitting and looking calmly can make a worry smaller.',
        },
      ],
    ),
    // ------------------------------------------------ 11. Snowed In
    sc(
      's26-snow',
      [
        N('The Long Night is over. Now there is snow everywhere.'),
        N('Tobin hurries up the lane. Two scarves! Wrong boots!'),
        T('Linnet went out early! Her tracks go up the lane.', 'shock'),
        T('My knees can’t manage the snow.', 'sad'),
        T('Will you go and find her? Not bring her back. Just find her.', 'soft'),
        N('Tobin trusts Linnet a bit more now.', 'soft'),
      ],
      [
        {
          domain: 'science',
          skill: 'snow is frozen water and melts when warm',
          standard: '2-ESS2-3',
          kind: 'ask',
          after: 0,
          prompt: [N('Snow is cold and white. What happens when snow gets warm?')],
          options: [
            opt(
              'It melts into water',
              [N('Yes! Snow is frozen water. Warm it up, and drip, drip!')],
              true,
            ),
            opt('It turns into sand', [N('No sand! Snow melts into water when it gets warm.')]),
          ],
          parentNote: 'Learned that snow is frozen water that melts when it warms up.',
        },
      ],
    ),
    sc(
      's26-snowdrops',
      [
        N('Linnet’s tracks go through the door and down the ramp.'),
        N('Linnet is by the bench. The robin sits on her knee.'),
        L('You took ages! Look! LOOK!', 'happy'),
        N('Snowdrops! Little white flowers, all round the bench.'),
        N('Some are in very silly places!'),
        L('Your Nubbin hid those. And they all came up!', 'happy'),
        L('I came in all by myself. Nobody had to help.', 'soft'),
      ],
      [
        {
          domain: 'maths',
          skill: 'count to 6',
          standard: 'K.CC.B.5',
          kind: 'do',
          after: 4,
          check: 'edu:count:snowdrops:6',
          lines: [
            N('(Count the snowdrops by the bench with me.)'),
            N('(One, two, three, four, five, six!)'),
            L('Six. And lots more hiding in silly places.', 'happy'),
          ],
          parentNote: 'Counted six snowdrops by the bench.',
        },
      ],
    ),
    // ------------------------------------------------ 12. In the Garden!
    sc(
      's26-mum',
      [
        N('A few days later, a lady walks up the valley road.'),
        N('Her coat smells of the sea. She has a big bag.'),
        MU('Hello! I’m Linnet’s mum. I work on the boats.', 'happy'),
        MU('Grandad says Linnet is gardening! My Linnet?', 'shock'),
        MU('She once put a plant out of the window. It was looking at her!'),
        MU('Is she happy? Really?', 'soft'),
        Y('Come and see!'),
      ],
      [
        {
          domain: 'literacy',
          skill: 'first sounds: L',
          standard: 'RF.K.2',
          kind: 'do',
          after: 2,
          check: 'edu:say:first-sound:l',
          lines: [
            N('(Linnet starts with L. Say it with me: lll, lll, Linnet!)'),
            N('(Can you think of another lll word? Leaf? Lamp? Lane?)'),
          ],
          parentNote:
            'Practised the first sound of “Linnet” and found other words that start with L.',
        },
      ],
    ),
    sc(
      's26-race',
      [
        N('You hear laughing behind the ivy. Ha ha ha!'),
        MU('That’s my Linnet!', 'soft'),
        N('Linnet is at the top of the ramp. She sees her mum.'),
        L('Mum! Race you to the bench! GO!', 'happy'),
        N('Zoom! Down the ramp and along the path.'),
        N('Linnet wins! Her mum comes second, still holding her big bag.'),
        L('The garden fits me now.', 'happy'),
      ],
      [
        {
          domain: 'science',
          skill: 'things speed up going down a slope',
          standard: 'ELOF: Scientific Reasoning',
          kind: 'ask',
          after: 4,
          prompt: [N('Is it faster to go down a slope, or up one?')],
          options: [
            opt('Down', [N('Yes! Going down a slope, you speed up. Whee!')], true),
            opt('Up', [N('Up is slow and hard. Down is fast. Whee!')]),
          ],
          parentNote: 'Talked about how things speed up going down a slope.',
        },
      ],
    ),
    // ------------------------------------------------ 13. The Key
    sc(
      's26-key-choice',
      [
        N('That evening, it’s just you, Linnet, the robin and the key.'),
        L('Mum says we’ll come back every summer!', 'happy'),
        L('This key was Hush’s. Then the ground had it.'),
        L('Then the robin found it. Then you had it.'),
        L('You decide what happens to it.', 'think'),
        N('The key is big and black and heavy.'),
      ],
      [
        {
          domain: 'maths',
          skill: 'count to 4, one name for each finger',
          standard: 'K.CC.B.4',
          kind: 'do',
          after: 3,
          check: 'edu:count:key-keepers:4',
          lines: [
            N('(Who had the key? Hush, the ground, the robin, you.)'),
            N('(Count them on your fingers. One, two, three, four!)'),
          ],
          parentNote: 'Counted four keepers of the key, one finger for each.',
        },
      ],
      {
        choices: [
          {
            id: 'linnet',
            label: 'Give the key to Linnet.',
            set: { 's26-key': 'linnet' },
            then: [
              L('Me? Oh, you’re impossible!', 'angry'),
              L('Then I’ll keep it, so nobody can ever lock the door.', 'soft'),
            ],
          },
          {
            id: 'post',
            label: 'Hang it on the old wall post, for anyone.',
            set: { 's26-key': 'post' },
            then: [
              N('You hang the key under the old wall lantern.'),
              L('Anyone can come in? Good. I’ll teach them.', 'happy'),
            ],
          },
          {
            id: 'door',
            label: 'Leave it in the door. Never lock it again.',
            set: { 's26-key': 'door' },
            then: [
              N('You turn the key to open. You leave it there.'),
              L('Somebody might take it!', 'think'),
              Y('Then they’ll have a key to a door that’s always open.'),
              L('Ha!', 'happy'),
            ],
          },
        ],
      },
    ),
    // ------------------------------------------------ complete (s26-key = linnet)
    sc(
      's26-complete',
      [
        ...COMPLETE_START,
        N('Linnet wears the key on a string. It bangs when she races!'),
        ...COMPLETE_END,
      ],
      [
        {
          domain: 'science',
          skill: 'old things can be used again',
          standard: 'K-ESS3-3',
          kind: 'notice',
          after: 3,
          lines: [
            DU('Old stones can make something new. Nothing wasted.'),
            N('(What could you make from an old box?)'),
          ],
          parentNote: 'Talked about using old things again instead of throwing them away.',
        },
      ],
    ),
  ],
  notes:
    'One lesson per scene, two in the big ones (s26-linnet, s26-beds). Domains: science (robins, moles, living ' +
    'and dead stems, pruning, what plants need, bulbs, snow, slopes, reuse, rosehips, seeds carried by birds, ' +
    'seasons), maths (above, counting, adding, rectangles, more and fewer, steep and gentle, ordering by size), ' +
    'sel (stillness, feelings, faces, listening, grief, worry), social studies (lamplighters, places for ' +
    'everyone, shared places) and literacy (the first sound of Linnet). Every choice is kept. The ramp and lift ' +
    'preludes, the Thrums door, the cellar bench, the lifted snow scene, the other two complete scenes and the ' +
    'four campaign hooks are in EDU_S26_SPROUT_VARIANTS.',
};

// ================================================================== variants (SIDE_STORY_S26_VARIANTS)
const S26_VARIANTS: EduScene[] = [
  // ---------------------------------------------------------------- step 3 done, if s12Done
  sc(
    's26-door-thrums',
    [
      N('Whoosh! The wind lifts the ivy like a curtain.'),
      N('Under it is a round iron knob. And a door!'),
      N('The old wall hums. Hmmmm. It’s the Thrums!'),
      TH('Good morning, Keeper. Yes. That is a door.'),
      TH('We have lived next to it forever. Nobody asked us.', 'think'),
      L('Is the wall TALKING?', 'shock'),
      Y('Mostly it agrees with itself.'),
      N('The key fits. You and Linnet turn it together. Click!'),
    ],
    [
      {
        domain: 'science',
        skill: 'sounds are made by vibrations',
        standard: '1-PS4-1',
        kind: 'do',
        after: 2,
        check: 'edu:hum:feel:lips',
        lines: [
          N('(Hum like the Thrums. Hmmmm. Touch your lips. Feel the tickle?)'),
          N('(That tickle is a tiny shake. Sounds are made of tiny shakes.)'),
        ],
        parentNote: 'Hummed and felt the tiny shaking that makes a sound.',
      },
    ],
  ),
  // ---------------------------------------------------------------- preludes, s26-steps = ramp
  sc(
    's26-ramp-1',
    [
      N('First evening. Dusty digs out the top step.'),
      L('That’s not a ramp. That’s a hole!', 'think'),
      DU('Give it time.'),
      N('Linnet sits at the top. She says where each bit of earth goes.'),
      N('She is right every time.'),
    ],
    [
      {
        domain: 'maths',
        skill: 'steps and a slope: two shapes for going down',
        standard: 'ELOF: Mathematics Development',
        kind: 'do',
        after: 0,
        check: 'edu:show:hand:steps-and-slope',
        lines: [
          N('Steps go down in bumps. A ramp is one long, smooth slope.'),
          N('(Make steps with your hand: bump, bump, bump.)'),
          N('(Now make a long, smooth slope. Wheee!)'),
        ],
        parentNote: 'Showed the difference between steps and a smooth slope with their hand.',
      },
    ],
  ),
  sc(
    's26-ramp-2',
    [
      N('Second evening. The ramp is nearly done.'),
      L('Too steep! I’d zoom straight into the rose bush!', 'angry'),
      DU('I walked down it fine.'),
      L('YOU walked. Make it longer.'),
      N('Dusty makes it longer. It takes all evening.'),
      N('Linnet was right.'),
    ],
    [
      {
        domain: 'maths',
        skill: 'compare: steep and gentle',
        standard: 'K.MD.A.2',
        kind: 'ask',
        after: 4,
        prompt: [N('Which ramp is safer: a short steep one, or a long one?')],
        options: [
          opt('The long one', [N('Yes! Longer means less steep. Slow and safe.')], true),
          opt('The short steep one', [N('Steep is too fast! Longer is less steep, and safer.')]),
        ],
        parentNote: 'Compared a steep slope and a gentle one and chose the safer.',
      },
    ],
  ),
  sc(
    's26-ramp-3',
    [
      N('Third evening. The ramp is finished. Long and smooth.'),
      N('Linnet goes down it all by herself. Whoosh!'),
      N('She doesn’t say a word. She touches the green rose.'),
      N('Dusty leans on the spade, smiling.'),
    ],
    [
      {
        domain: 'sel',
        skill: 'quiet can be a happy feeling',
        standard: 'CASEL: Social awareness',
        kind: 'ask',
        after: 2,
        prompt: [N('Linnet doesn’t say anything. How do you think she feels?')],
        options: [
          opt('Happy', [N('Yes. Sometimes happy is very quiet.')], true),
          opt('Cross', [N('Not cross now! Look at her hand on the rose. Quietly happy.')]),
        ],
        parentNote: 'Noticed that someone can be happy without saying anything.',
      },
    ],
  ),
  // ---------------------------------------------------------------- preludes, s26-steps = lift
  sc(
    's26-lift-1',
    [
      N('Next evening, Sparks lifts Linnet down again.'),
      N('Front and back. Never the sides. Just as Linnet said.'),
      SP('Smooth! You’re lighter than my generator. And you don’t buzz!', 'happy'),
      L('Thank you.'),
      N('Linnet says thank you every time. Every single time.'),
    ],
    [
      {
        domain: 'sel',
        skill: 'wanting to do things by yourself',
        standard: 'CASEL: Self-awareness',
        kind: 'notice',
        after: 4,
        lines: [
          N('Saying thank you is kind.'),
          N('But Linnet would like to go down on her own.'),
          N('(Is there something you like to do all by yourself?)'),
        ],
        parentNote: 'Talked about things they like to do by themselves.',
      },
    ],
  ),
  sc(
    's26-lift-2',
    [
      N('Second evening. Sparks is late.'),
      N('Linnet waits at the top of the steps. And waits.'),
      L('I don’t mind.', 'think'),
      N('She minds. She pulls ivy leaves off the wall.'),
      N('She lines them up. Small, bigger, biggest.'),
      SP('Sorry! Sorry! I’m here!', 'shock'),
    ],
    [
      {
        domain: 'maths',
        skill: 'put three things in order of size',
        standard: 'K.MD.A.2',
        kind: 'do',
        after: 4,
        check: 'edu:order:leaves:size',
        lines: [
          N('(Show small with your hands. Now bigger. Now BIGGEST!)'),
          N('Small, bigger, biggest. Just like Linnet’s leaves.'),
        ],
        parentNote: 'Put sizes in order: small, bigger, biggest.',
      },
    ],
  ),
  sc(
    's26-lift-3',
    [
      N('Third evening. Sparks lifts Linnet down, then has to go.'),
      SP('I’ll be back to lift you up!', 'happy'),
      L('What if you’re not?', 'think'),
      SP('Then I’ll be back later!', 'happy'),
      N('Linnet doesn’t answer. She goes to the green rose, far from the steps.'),
    ],
    [
      {
        domain: 'sel',
        skill: 'name a worry',
        standard: 'CASEL: Social awareness',
        kind: 'ask',
        after: 4,
        prompt: [N('Linnet is worried. What is she worried about?')],
        options: [
          opt(
            'Getting stuck down here',
            [
              N('Yes. She has to wait for someone to lift her up.'),
              N('It’s hard when you can’t come and go when you want.'),
            ],
            true,
          ),
          opt('The robin', [N('Not the robin! She’s worried about getting stuck down here.')]),
        ],
        parentNote: 'Worked out what a character was worried about, and why.',
      },
    ],
  ),
  // ---------------------------------------------------------------- step 10 done, if s13Done
  sc(
    's26-tobin-bench-cellar',
    [
      T('This reminds me! Hazel’s grandchild came down the mill cellar with me!', 'happy'),
      T('Six levels deep! Giant eels! Rats in hats!', 'happy'),
      Y('Four levels. The eels were grumpy. Nobody had a hat.'),
      T('That’s the boring version!', 'think'),
      N('Tobin watches Linnet dig. She doesn’t tip.'),
      T('I kept a door shut once, for a long time. It got heavy.', 'soft'),
      N('He sits and watches her until it’s dark.'),
      ...TOBIN_WAY_OUT,
    ],
    [
      {
        domain: 'maths',
        skill: 'more and fewer: six and four',
        standard: 'K.CC.C.6',
        kind: 'ask',
        after: 2,
        prompt: [N('Tobin says six levels. You say four. Which is more?')],
        options: [
          opt('Six', [N('Yes! Six is more than four. Tobin made the story bigger!')], true),
          opt('Four', [N('Count up: four, five, six. Six is more. Tobin made it bigger!')]),
        ],
        parentNote: 'Compared six and four and found which is more.',
      },
    ],
  ),
  // ---------------------------------------------------------------- step 11 done, if s26-steps = lift
  sc(
    's26-snowdrops-lifted',
    [
      N('Linnet’s tracks stop at the door.'),
      N('Linnet is at the top of the steps. They are deep in snow.'),
      L('I’ve been here an HOUR! I can see the snowdrops from here!', 'angry'),
      L('Everyone who lifts is somewhere else.', 'angry'),
      L('I’m not the problem. These silly steps are!', 'angry'),
      Y('Then let’s make a ramp. Now. You tell me where.'),
      N('You dig in the snow. Linnet is the boss.'),
      L('Longer! Not steeper. LONGER!', 'think'),
      N('The ramp is done. Down goes Linnet. Whoosh!'),
      N('Snowdrops! Little white flowers, all round the bench.'),
    ],
    [
      {
        domain: 'science',
        skill: 'find the real problem before fixing it',
        standard: 'K-2-ETS1-1',
        kind: 'ask',
        after: 4,
        prompt: [N('What is the real problem here: the snow, or the steps?')],
        options: [
          opt('The steps', [N('Yes! The steps are the problem. A ramp fixes it.')], true),
          opt('The snow', [
            N('The snow makes it harder.'),
            N('But the steps stop her every day. A ramp fixes it.'),
          ]),
        ],
        parentNote: 'Worked out that the steps, not the person, were the problem to fix.',
      },
    ],
  ),
  // ---------------------------------------------------------------- complete, if s26-key = post
  sc(
    's26-complete-post',
    [
      ...COMPLETE_START,
      N('The key hangs on the old wall post. Anyone can come in!'),
      ...COMPLETE_END,
    ],
    [
      {
        domain: 'social-studies',
        skill: 'shared places belong to everyone',
        standard: 'D2.Civ.8.K-2',
        kind: 'notice',
        after: 2,
        lines: [
          N('A garden for anyone is a shared place.'),
          N('(What shared places do you visit? A park? A library?)'),
        ],
        parentNote: 'Talked about shared places, like parks and libraries, that are for everyone.',
      },
    ],
  ),
  // ---------------------------------------------------------------- complete, if s26-key = door
  sc(
    's26-complete-door',
    [
      ...COMPLETE_START,
      N('The key stays in the door. A little snow sits on top.'),
      ...COMPLETE_END,
    ],
    [
      {
        domain: 'science',
        skill: 'snow comes in winter',
        standard: 'K-ESS2-1',
        kind: 'ask',
        after: 2,
        prompt: [N('There is snow on the key. Which season is it?')],
        options: [
          opt('Winter', [N('Yes! Snow comes in winter, when it’s cold.')], true),
          opt('Summer', [N('Summer is warm. Snow means winter!')]),
        ],
        parentNote: 'Matched snow to winter.',
      },
    ],
  ),
  // ---------------------------------------------------------------- campaign: chapter 12, inside c12-open
  sc(
    'c12-wall-garden',
    [
      N('Gran Hazel walks past the old wall. She stops.'),
      N('The door is open! She has never seen it before.'),
      N('She goes in slowly, down the ramp.'),
      N('Roses. Snowdrops. A bench. A robin!'),
      N('Hazel stands still for a long time. She doesn’t say anything.'),
      N('She picks a little red rosehip. She puts it on her coat.'),
      N('On the way out, she pats the post. Gently.'),
    ],
    [
      {
        domain: 'science',
        skill: 'a rosehip is a rose’s fruit, with seeds inside',
        standard: 'ELOF: Scientific Reasoning',
        kind: 'notice',
        after: 5,
        lines: [
          N('A rosehip is a rose’s fruit. Seeds grow inside it.'),
          N('First a flower. Then a fruit. Then seeds!'),
        ],
        parentNote: 'Learned that a rosehip is the fruit of a rose, with seeds inside.',
      },
    ],
  ),
  // ---------------------------------------------------------------- campaign: Moss Sleeps, after end-moss-sleeps
  sc(
    'end-moss-sleeps-garden',
    [
      N('Moss faded. That means he died. His body stopped, and won’t start again.'),
      N('His flower grew on the hill, by his flat stone.'),
      N('Linnet says its seeds will go over the old wall.'),
      N('Into his patch by Hush’s bench. Where the white pebble is.'),
      N('The robin will help, she says.'),
      N('So Moss’s flowers will grow in both places. He is remembered.', 'soft'),
    ],
    [
      {
        domain: 'science',
        skill: 'birds carry seeds to new places',
        standard: '2-LS2-2',
        kind: 'notice',
        after: 4,
        lines: [
          N('Birds eat seeds and berries. They drop the seeds in new places.'),
          N('That’s how plants travel!'),
        ],
        parentNote: 'Learned that birds help plants spread by carrying their seeds.',
      },
    ],
  ),
  // ---------------------------------------------------------------- campaign: epilogue, every ending but The Collector
  sc(
    'end-epi-garden',
    [
      N('The door in the old wall is never locked now.'),
      N('Linnet comes every summer. She tells everyone where to dig!'),
      N('In June, Hush’s roses all come out at once.'),
      N('Pink and red and white. Like a party!'),
    ],
    [
      {
        domain: 'science',
        skill: 'June is in summer',
        standard: 'K-ESS2-1',
        kind: 'ask',
        after: 2,
        prompt: [N('The roses come out in June. Which season is that?')],
        options: [
          opt('Summer', [N('Yes! Here in the Grove, June is summer. Warm and sunny.')], true),
          opt('Winter', [N('Winter is snowy. June is summer, when roses come out.')]),
        ],
        parentNote: 'Matched the month of June to summer.',
      },
    ],
  ),
  // ---------------------------------------------------------------- campaign: epilogue, The Collector
  sc(
    'end-epi-garden-cold',
    [
      N('The door in the old wall is open.'),
      N('You always kept your Nubbins safe, and close.'),
      N('Now they don’t go in. They sit outside, very still.'),
      N('Linnet came one summer. She looked at them for a long time.'),
      L('Why don’t they play?', 'sad'),
      N('Being safe is not the same as being happy.', 'soft'),
      N('The door is still open. The roses are still waiting.'),
    ],
    [
      {
        domain: 'sel',
        skill: 'safe and happy are not the same',
        standard: 'CASEL: Self-awareness',
        kind: 'notice',
        after: 5,
        lines: [
          N('(What makes you feel happy, not just safe?)'),
          N('(Playing? Friends? Running about outside?)'),
        ],
        parentNote: 'Talked about what makes them happy, as well as safe.',
      },
    ],
  ),
];

// ================================================================== exports
export const EDU_S26_SPROUT: EduQuest[] = [S26];

/** Sprout versions of every scene in SIDE_STORY_S26_VARIANTS. */
export const EDU_S26_SPROUT_VARIANTS: EduScene[] = S26_VARIANTS;

/** Every `edu:` check used by a `do` lesson in this file. */
export const CHECKS: string[] = [
  'edu:hold:palm:still',
  'edu:count:hands:4',
  'edu:listen:sounds:garden',
  'edu:sort:sticks:dead-alive',
  'edu:draw:shape:rectangle',
  'edu:add:bulbs:2-and-2',
  'edu:count:snowdrops:6',
  'edu:say:first-sound:l',
  'edu:count:key-keepers:4',
  'edu:hum:feel:lips',
  'edu:show:hand:steps-and-slope',
  'edu:order:leaves:size',
];
