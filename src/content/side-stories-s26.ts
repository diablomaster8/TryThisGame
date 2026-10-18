/**
 * S26 The Walled Garden: a Grove side story for "Hazel’s Grove" (Part M outline, S26).
 *
 *   S26 The Walled Garden   chapter 6 → chapter 11 (late summer, autumn, winter)   CHANGES THE CAMPAIGN (Tier 1)
 *       hushGarden (bool), s26Done
 *       local: s26-hello, s26-steps (ramp | lift), s26-plot, s26-bulbs, s26-tobin, s26-key (linnet | post | door)
 *
 * SOURCE. After *The Secret Garden* by Frances Hodgson Burnett (1911). The novel is in the public
 * domain; the reference text is Project Gutenberg eBook #113. No rights holder.
 *
 * AUDIENCE. 'all' (the main game and the Learning Grove).
 *
 * FRAME. Behind Hush’s Old Wall lantern, on the north side of the Grove, an ivy-hidden door opens on
 * a garden Hush planted for the still ones after the White Year, and locked when the last of them
 * faded. A robin finds the buried key. Linnet, Old Tobin’s granddaughter (eleven, a wheelchair user,
 * here while her mum works the coast boats), asks for a bit of earth. Dusty takes Dickon’s part,
 * Moss takes both Ben Weatherstaff’s and the grieving master’s, and Tobin is the frightened household
 * that keeps the child indoors. The Grove’s one deliberate change to Burnett: nobody is cured. The
 * child stays exactly as she is, and the garden is changed to fit her (a ramp, beds at chair height).
 * You are the helper, with a spade and patience; your Nubbin befriends the robin and carries bulbs
 * in its cheeks. Linnet is the heroine.
 *
 * GROVE FLAGS READ, AND WHAT CHANGES (all through SIDE_STORY_S26_VARIANTS; see the quest notes):
 *   - s12Done (S12): at the ivy door the Thrums speak; s26-door-thrums replaces s26-door.
 *   - s13Done (S13): Tobin tells the mill-cellar story, worse; s26-tobin-bench-cellar replaces s26-tobin-bench.
 *   - s26-steps (this story): ramp or lift preludes before steps 6–8, and the snow payoff in step 11.
 *   - s26-key (this story): which of the three complete scenes plays.
 *   - hushGarden, in the campaign: c12-wall-garden (chapter 12), end-moss-sleeps-garden, end-epi-garden,
 *     end-epi-garden-cold (the ending id picks between the last two).
 *   Moss is always present in the steps that need him (steps 6–8 play in chapters 6–8; he speaks from
 *   chapter 4 and cannot fade before chapter 10). The chapter 11 steps (11–13) never use Moss, so they
 *   work on every route: Moss here, kept on the hill, or gone.
 *
 * FLAGS WRITTEN. hushGarden (true) and s26Done (true), both when the quest completes (step 13,
 * chapter 11). Local, prefixed: s26-hello, s26-steps, s26-plot, s26-bulbs, s26-tobin, s26-key.
 *
 * LIFTED TEXT. None. All eight passages the outline lists from the Gutenberg #113 text are marked
 * [unverified], so every one is paraphrased in our own words, never quoted:
 *   (Line numbers are 0-based, as childLines keys are.)
 *   1, 5  “a bit of earth” and what it is for → Linnet in s26-earth-ask (lines 4 and 6)
 *   2–4   Moss’s answer and “take it, child” → Moss in s26-earth-ask (lines 8–10)
 *   6     “How still it is” / the first voice in years → Linnet in s26-inside (lines 3–4)
 *   7     “as wick as you or me” → Dusty in s26-wick (line 4); only the valley word “wick” survives
 *   8     the rose and thistle couplet → replaced by an original gardener’s saying (Tobin, s26-tobin-bench)
 * As a precaution, the closest echoes (s26-earth-ask, s26-inside, s26-wick) still carry childLines
 * that move further from the source. No song lyrics.
 *
 * CARE NOTES.
 *   - Linnet is never cured, never “inspiring”, never pitied, and never a lesson for anyone else.
 *     Her sourness comes from being kept, not from her body. She is funny, bossy and right. Her chair
 *     is part of her: nobody pushes it or lifts her without asking, and she is asked (step 5). Every
 *     fix is access (a ramp, raised beds), never a change in her.
 *   - The snow beat (s26-snowdrops-lifted) is the steps’ fault and says so. She is not helpless at the
 *     top; she is furious, and she directs the digging.
 *   - Nobody says “brave”. Linnet is never linked to the Stillness or to sitting still.
 *   - Work with disabled advisers and wheelchair users on her movement, chair, the ramp gradient and
 *     the garden layout, and especially on the snow beat.
 *   - No colonial India opening, no cholera deaths, no Yorkshire dialect (only the valley word “wick”).
 *   - The robin never speaks. It only turns up where it is needed. Your Nubbin never speaks either.
 *   - Hazel is silent in c12-wall-garden: she still speaks only at Cinder’s post in chapter 12.
 */
import type { Line, Mood, Scene } from '../config/story';
import type { Quest, Speaker } from './types';

const say =
  (who: string) =>
  (text: string, mood?: Mood): Line =>
    mood ? { who, text, mood } : { who, text };

// ---------------------------------------------------------------- campaign speakers
const N = say('narrator');
const Y = say('you');
const M = say('moss');
const DU = say('dusty');
const SP = say('sparks');
const FE = say('fern');

// ---------------------------------------------------------------- new speakers
const LINNET: Speaker = {
  id: 'linnet',
  name: 'Linnet',
  kind: 'other',
  basedOn: 'Mary Lennox and Colin Craven, The Secret Garden (Frances Hodgson Burnett, 1911)',
};
/** Shared id with S13 (side-stories-new-3.ts): the same Old Tobin. */
const TOBIN: Speaker = {
  id: 'tobin',
  name: 'Old Tobin',
  kind: 'other',
  basedOn:
    'The Secret Garden’s household that keeps Colin indoors for his own good (theme only); the Grove’s own Old Tobin from S13',
};
const MUM: Speaker = { id: 's26-mum', name: 'Linnet’s mum', kind: 'other' };
/** Shared id with S12 (side-stories-new-2.ts): the hive in Hush’s old wall, who speak as one chorus. */
const THRUMS: Speaker = { id: 'thrums', name: 'The Thrums', kind: 'nubbin' };

const L = say('linnet');
const T = say('tobin');
const MU = say('s26-mum');
const TH = say('thrums');

// ================================================================== shared pieces
/** Step 6 to 8 preludes. One set plays, chosen by s26-steps; see the quest notes. */
const RAMP_1: Line[] = [
  N('First evening of the ramp. Dusty takes the top step out in one go, and stands back, pleased.'),
  L('That’s not a ramp. That’s a hole with ambitions.', 'think'),
  DU('Give it time.'),
  N(
    'Linnet sits at the top, beside Sparks’s coil of wire, and tells you where every barrow of earth goes. She is right about all of it.',
  ),
];
const RAMP_2: Line[] = [
  N('Second evening. It is nearly a ramp now, and Dusty wants to call it done.'),
  L('It’s too steep. I’d go down that in one second flat, straight into the rose.', 'angry'),
  DU('It’s fine. I walked down it.'),
  L('You walked down it. Dig it longer.'),
  N(
    'Dusty digs it longer. It takes the rest of the evening, and afterwards Dusty admits that Linnet was right.',
  ),
];
const RAMP_3: Line[] = [
  N(
    'Third evening, and the last barrow goes in. The ramp runs from the door to the path, long and shallow and tamped hard.',
  ),
  N('Linnet goes down it before anyone can offer anything.'),
  N(
    'At the bottom she doesn’t say a word. She goes straight to the wick rose and puts her hand on it.',
  ),
  N('Dusty leans on the spade and looks at nothing in particular, for quite a long time.'),
];
const LIFT_1: Line[] = [
  N(
    'Next evening Sparks lifts Linnet down again: front and back, never the sides, exactly as instructed.',
  ),
  SP('Smooth! Like a generator. A small, rude generator.', 'happy'),
  L('Thank you.'),
  N('She says it every time. It seems to cost her a little more every time.'),
];
const LIFT_2: Line[] = [
  N('Second evening. Sparks is late: a fuse at the pond lantern.'),
  N('Linnet waits at the top of the steps for half an hour, watching you and Dusty work below.'),
  L('I don’t mind.', 'think'),
  N(
    'She minds. She has pulled every ivy leaf within reach off the wall, and laid them out in order of size.',
  ),
  SP('Sorry! Sorry! Right. Front and back.', 'shock'),
];
const LIFT_3: Line[] = [
  N(
    'Third evening. Sparks lifts her down, and then has to go, and says she’ll be back to lift her up again.',
  ),
  L('What if you’re not?', 'think'),
  SP('Then I’ll be back later!', 'happy'),
  N(
    'Linnet doesn’t answer that. She goes to the wick rose and stays there, as far from the steps as the garden allows.',
  ),
];

/** Step 10 close, shared by s26-tobin-bench and s26-tobin-bench-cellar. */
const TOBIN_WAY_OUT: Line[] = [
  N('On the way out, at the door, he puts his hand flat on the old wall.'),
  T(
    'My old gaffer used to say: put a rose where your worry sits, and the worry has to go and sit somewhere else.',
    'soft',
  ),
  T('He was a terrible gardener. He was right about that, though.'),
];

/** Step 11 close, shared by both snow scenes. */
const SNOWDROPS: Line[] = [
  N('Snowdrops. All round Hush’s bench, white heads bowed, as if they came up to listen.'),
  N(
    'Some are in Linnet’s bed, in a dead straight row. The rest are everywhere: under the bench, in the path, one right in the middle of the ramp.',
  ),
  L('Your Nubbin’s. It can’t count and it can’t plant, and they all came up anyway.', 'happy'),
];

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
    'And this. I wore it every day Fossil and I went digging. It’s yours now. You dig like someone who means it.',
    'soft',
  ),
  N(
    'It is a gardener’s apron, earth worked into every seam. Linnet crowns you with snowdrops, and says you can’t take them off until tea.',
  ),
  N(
    'Linnet’s mum sits on Hush’s bench with Tobin, and they argue about which of them she gets her chin from.',
  ),
  L('Me. I get it from me.', 'happy'),
  N(
    'On the way out you look back: the bench, the beds, the white pebble by the bare patch, and the snowdrops in the path.',
  ),
  N(
    'The robin has decided it lives with you now, in a general sort of way. The door stays open behind you.',
  ),
];

// ================================================================== the quest
export const SIDE_STORY_S26: Quest[] = [
  {
    id: 's26',
    code: 'S26',
    title: 'The Walled Garden',
    source:
      'The Secret Garden (Frances Hodgson Burnett, 1911; public domain): the locked garden, the robin and the key, “a bit of earth”, and things coming alive slowly. Adapted so the child is never cured; the garden changes to fit her.',
    audience: 'all',
    trigger: {
      where:
        'The Old Wall lantern post on the north side of the Grove; then Old Tobin’s cottage, and the walled garden behind the ivy',
      when: 'Opens in chapter 6, after c6-close (Fossil’s farewell). Steps 1–8 from then; step 9 from chapter 7; step 10 by the end of chapter 8. Pauses in chapters 9–10. Steps 11–13 in chapter 11, after c11-open. Closes when chapter 12 begins.',
    },
    speakers: [LINNET, TOBIN, MUM, THRUMS],
    steps: [
      // ------------------------------------------------ 1. The Robin (late summer, ch6)
      {
        id: 's26-step1',
        goal: 'Find out what the robin on the old wall post wants from you.',
        hint: 'It wants feeding, obviously. Hold out a crumb by the old wall post and keep still.',
        check: 'feed:s26-robin',
        scene: {
          id: 's26-robin',
          lines: [
            N(
              'Late summer. The rain has stopped at last, and Fossil’s flower is a few days old on the hill.',
            ),
            N('Dusty hasn’t been down from the cliff since.'),
            N('A robin has taken the old wall lantern post. It sits on the top like a lid.'),
            N(
              'After that, wherever you go, it goes: the pond, the woodpile, the cottage step. It never comes closer than a spade’s length.',
            ),
            N('It looks at you the way a landlord looks at a tenant.'),
            FE(
              'It’s decided you owe it something. Robins do that. One followed me for a whole spring over a raisin.',
              'think',
            ),
            FE('I never found out which raisin.'),
            N(
              'Your Nubbin sits down under the post and stares up at it. The robin stares back, and neither of them blinks first.',
            ),
          ],
        },
        done: {
          id: 's26-robin-fed',
          lines: [
            N(
              'You hold out a crumb of one of Fern’s lantern buns, which have never once come out. The robin considers it, and you, and the crumb again.',
            ),
            N('Then it takes it off your palm, quick as a pinch, and goes back to the post.'),
            N('It hops from the post onto the ivy, and looks at you over its shoulder.'),
            N(
              'Then it sets off down the lane, and your Nubbin follows it. You follow your Nubbin.',
            ),
          ],
        },
      },
      // ------------------------------------------------ 2. Linnet
      {
        id: 's26-step2',
        goal: 'Say hello to the girl at Old Tobin’s gate.',
        hint: 'Tobin’s cottage is at the bottom of the lane, by the polished lamp post. Let her set the pace.',
        check: 'talk:s26-linnet',
        scene: {
          id: 's26-linnet',
          lines: [
            N(
              'The robin leads you down the lane to a cottage with a lamp post outside it, polished like a medal.',
            ),
            N(
              'An old man in a lamplighter’s coat is getting a wheelchair over the doorstep. The girl in it is telling him how, very loudly.',
            ),
            L('No. Back wheels first. Grandad. Back. Wheels. First.', 'angry'),
            T('I know which wheels, love. I’ve been doing wheels since before…', 'think'),
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
            T('She’s eleven. She’s very… she’s eleven.', 'soft'),
            N(
              'Linnet looks up the lane, and down it, and at the hill behind, and at the hill behind that.',
            ),
            L(
              'Nothing in this valley is flat. Did you know that? Nothing. Somebody should be told.',
            ),
            T('Mind yourself on the lane, love.', 'soft'),
            L('There. That. That’s the other thing everybody says.'),
          ],
          choices: [
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
        },
        done: {
          id: 's26-linnet-robin',
          lines: [
            N('The robin lands on the lamp post, right above Linnet’s head.'),
            L('That’s following you. Is it yours?'),
            Y('I think I’m its.'),
            L('Where does it live?'),
            Y('On the old wall, at the top of the Grove. In the ivy, mostly.'),
            L('Is the lane flat? To the old wall?', 'think'),
            N('You think about it. It is, almost: the only lane in the valley that is.'),
            L('Then show me. Tomorrow. Before Grandad thinks of a reason.'),
          ],
        },
      },
      // ------------------------------------------------ 3. The Key, and the Door
      {
        id: 's26-step3',
        goal: 'Follow the robin along the old wall with Linnet.',
        hint: 'Watch where the robin scratches. Leave the ground round the lantern post alone; you know why.',
        check: 'find:s26-door',
        scene: {
          id: 's26-key',
          lines: [
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
            N('You kneel, and lift out an iron key, black with age, its bow as wide as your palm.'),
            N(
              'It has been in the ground a very long time. The robin watches you hold it, as if you’d better not drop it.',
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
        },
        done: {
          id: 's26-door',
          lines: [
            N('Then the wind comes along the wall, and lifts the ivy like a curtain.'),
            N('Under it, exactly at the height of Linnet’s eyes, is a round iron knob.'),
            L('There. There! You lot stand too tall to see anything.', 'happy'),
            N('You hold back the ivy and find the edge of a door, and under the knob, a keyhole.'),
            N(
              'The key goes in as if it has been waiting. It takes both your hands to turn it, and then Linnet’s as well.',
            ),
          ],
        },
      },
      // ------------------------------------------------ 4. How Still It Is, and Is It Wick?
      {
        id: 's26-step4',
        goal: 'Fetch Dusty to the hidden garden. They’ll know if anything in it is alive.',
        hint: 'Dusty is up on their cliff. Bring them along the old wall to the ivy door.',
        check: 'escort:dusty:s26-garden',
        scene: {
          id: 's26-inside',
          lines: [
            N('The door opens inwards, slowly, scraping a fan in a hundred years of leaves.'),
            N(
              'Three stone steps lead down from the doorway into a garden walled on all four sides.',
            ),
            N(
              'Everything in it is grey: grey tangles, grey canes, bare roses climbing the walls and falling off them again. In the middle, a stone bench.',
            ),
            L('It’s so quiet in here.', 'soft'),
            L('I bet nobody’s said a single word in here for a hundred years.', 'soft'),
            N('Nothing moves. Even the robin lands without a sound.'),
            L('…Is it dead? All of it?'),
            Y('I don’t know. I know someone who would.'),
            L('Then fetch them. I’ll wait here. I’m very good at the tops of things.', 'think'),
            N(
              'She folds her arms in the doorway at the top of the three steps, and guards a garden nobody has wanted for a hundred years.',
            ),
          ],
        },
        done: {
          id: 's26-wick',
          lines: [
            N(
              'Dusty comes with a spade over one shoulder, stops in the doorway, and doesn’t say anything for a while.',
            ),
            DU(
              'After Fossil, I said I’d go and dig something up. I went. I stood on the cliff with the spade for an hour.',
              'soft',
            ),
            DU('First time it hasn’t worked.'),
            N(
              'They go down the steps, take a grey cane in one hand, and scratch it gently with a thumbnail. Under the grey it is green: wet, bright green.',
            ),
            DU('Wick. Old valley word. It means alive, and meaning it.', 'happy'),
            DU(
              'This one’s wick. That one. Not that one, that’s firewood. But most of this lot has only been asleep.',
            ),
            L('Then wake it up.'),
            DU('…Yeah.', 'soft'),
            DU(
              'Yeah. I want to dig this. I didn’t think I’d want to dig anything for a bit.',
              'soft',
            ),
          ],
        },
      },
      // ------------------------------------------------ 5. Three Steps (the signature choice; paid off in step 11)
      {
        id: 's26-step5',
        goal: 'Decide, with Linnet, how she gets down the three steps.',
        hint: 'Ask her first. It’s her garden as much as anyone’s.',
        check: 'choose:s26-steps',
        scene: {
          id: 's26-steps',
          lines: [
            N(
              'Dusty comes back up, earth to the elbow. Linnet is still at the top of the three steps.',
            ),
            N(
              'Three steps: steep, worn in the middle, a little slippery with moss. Built by somebody who walked.',
            ),
            L(
              'Well. That’s that, then. Somebody built three stupid steps and walked off.',
              'angry',
            ),
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
          choices: [
            {
              id: 'ramp',
              label: 'Dig the steps into a ramp. Dusty and you, three evenings.',
              set: { 's26-steps': 'ramp' },
              then: [
                L('Three evenings. Of watching you two dig.', 'angry'),
                L('…Fine. Somebody has to tell you where.', 'think'),
                SP(
                  'Shout if you change your mind. I’m only ever a shout away. A loud shout.',
                  'happy',
                ),
                N(
                  'Sparks leaves her coil of wire at the top, just in case. Linnet sits beside it and looks down at the garden she can’t get into yet.',
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
        },
      },
      // ------------------------------------------------ 6. The Top of the Wall (prelude: s26-ramp-1 | s26-lift-1)
      {
        id: 's26-step6',
        goal: 'Wait in the garden at dusk and catch whoever has been pruning the roses.',
        hint: 'Sit on the stone bench as the light goes, and keep still. Watch the top of the far wall.',
        check: 'wait:s26-garden:dusk',
        scene: {
          id: 's26-pruned',
          lines: [
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
            DU('She’s right. And whoever did it held the shears upside down.', 'think'),
            L('So somebody’s got another key. Or somebody comes over the top.'),
            N(
              'All three of you look up at the top of the wall at the same moment, the way people do in plays.',
            ),
            N(
              'Nobody is there. On the coping there is a snapped rose twig, and a flattened patch of moss.',
            ),
            L('Dusk, then. Nobody prunes in daylight unless they want to be caught.'),
          ],
        },
        done: {
          id: 's26-moss-wall',
          lines: [
            N('Dusk. A blackbird says its last word.'),
            N('Then something small and green and very slow comes over the top of the far wall.'),
            N(
              'It has a rose twig in its mouth, held crossways, like a dog with a stick. It is Moss.',
            ),
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
        },
      },
      // ------------------------------------------------ 7. A Bit of Earth (prelude: s26-ramp-2 | s26-lift-2)
      {
        id: 's26-step7',
        goal: 'Help Linnet choose her bit of earth.',
        hint: 'Walk the garden and stop at each corner so she can see it. She’ll know it when she sees it; your job is to agree.',
        check: 'explore:s26-garden',
        scene: {
          id: 's26-earth-ask',
          lines: [
            N('Moss is on the wall again before anyone else, pretending he has always been there.'),
            N(
              'Linnet watches him for a long time. She is not used to wanting things out loud, and it shows.',
            ),
            L(
              'Moss. It’s your garden, isn’t it? Or it’s somebody’s, and you look after it.',
              'think',
            ),
            M(
              'It was somebody’s. I cut the roses once a year. That isn’t the same as looking after.',
            ),
            L(
              'Could I have some of it? The earth, I mean. Not much. Just a bit that’s mine.',
              'soft',
            ),
            M('A bit of earth. And what would you want with it?', 'think'),
            L(
              'Put things in it. Seeds. Make them grow. Watch them wake up, and know it was me.',
              'soft',
            ),
            N('Moss is quiet for so long that Dusty stops digging to look.'),
            M(
              'Have all the earth you like. Nobody has wanted any of it for a very long time.',
              'soft',
            ),
            M(
              'You put me in mind of someone. She liked earth too, and anything that came up out of it.',
              'soft',
            ),
            M('Go on, then. Find the bit you want, and have it. Then wake it up.', 'soft'),
          ],
        },
        done: {
          id: 's26-earth-pick',
          lines: [
            N(
              'You walk the garden for her twice, wall to wall, stopping at every corner so she can see it. She turns most of it down on sight.',
            ),
            L(
              'Too shady. Too stony. Too near the door; people would tread on it. What do you think?',
              'think',
            ),
          ],
          choices: [
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
                L('Next to the wick one. Yes. Then it’s got company.', 'soft'),
                N('She marks it out with four sticks and a length of string, perfectly straight.'),
              ],
            },
            {
              id: 'hers',
              label: 'Wherever you like. It’s your bit.',
              set: { 's26-plot': 'hers' },
              then: [
                L('…Nobody’s ever said that. About anything.', 'think'),
                N(
                  'She takes the sunny corner by the south wall, and marks it out with four sticks and a length of string, perfectly straight.',
                ),
              ],
            },
          ],
        },
      },
      // ------------------------------------------------ 8. Hush’s Bench (prelude: s26-ramp-3 | s26-lift-3)
      {
        id: 's26-step8',
        goal: 'Sit on the stone bench with Moss and hear the garden’s story.',
        hint: 'The bench in the middle of the garden. Sit down, and let him take his time.',
        check: 'sit:s26-hush-bench',
        scene: {
          id: 's26-bench',
          lines: [
            N(
              'That evening the light goes long and gold across the garden, and Moss comes down off the wall at last, the slow way.',
            ),
            N('He climbs onto the stone bench and sits, as if he has sat there before. He has.'),
            M('It was Hush’s. The bench, the roses, the wall. All of it.', 'soft'),
            L('Who’s Hush?'),
            M(
              'A friend of mine. The quiet one. She kept the griefs nobody else had room for.',
              'soft',
            ),
            N(
              'Linnet puts her brake on, and Dusty sits down on the path. You sit on the end of the bench, and wait.',
            ),
          ],
        },
        done: {
          id: 's26-hush',
          lines: [
            M(
              'Briar wanted the stilled ones up on the hill, in the light, where the valley could see them. Hush said the wind would have them.',
              'sad',
            ),
            M(
              'So she carried them in here herself, one at a time, all that winter. She was not big. It took her till the thaw.',
            ),
            M(
              'Then she planted roses up every wall. Not for herself. A still thing can still be looked at, she said, and should have something back.',
            ),
            M(
              'The last of them went in the second winter, here, with the roses bare above it. She said bare was still something.',
              'soft',
            ),
            M(
              'You heard the rest at Lantern Night. The door, and the key. I will not tell that twice in one year.',
              'soft',
            ),
            N(
              'Nobody says anything. The robin turns round twice on the back of the bench, and settles.',
            ),
            L('Not even Hazel knew? About in here?', 'soft'),
            M('Hazel had enough doors.', 'soft'),
            N(
              'Then Moss looks down at the patch of bare earth beside the bench. He looks at it for a long time, the way he looks at the hill.',
            ),
            M('If I ever have a flower, I’d like a bit of it here.', 'soft'),
            M('Don’t go telling people. They’d make a speech.', 'think'),
            N(
              'Linnet sets a white pebble on the bare patch to mark it, and says nothing at all. For Linnet, that is a speech.',
            ),
          ],
        },
      },
      // ------------------------------------------------ 9. Autumn Bulbs (ch7–8)
      {
        id: 's26-step9',
        goal: 'Plant the autumn bulbs in Linnet’s raised beds.',
        hint: 'The bulb sack is inside the door. Your Nubbin will carry some. Some.',
        check: 'place:s26-bulbs:raised-beds',
        scene: {
          id: 's26-beds',
          lines: [
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
          choices: [
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
        },
        done: {
          id: 's26-cheeks',
          lines: [
            N('Your Nubbin carries the bulbs very seriously, two at a time, one in each cheek.'),
            N(
              'It plants about half of them. The other half it hides all over the garden, in places it seems to choose by feel.',
            ),
            L('Your Nubbin has no sense of order whatsoever.', 'think'),
            N(
              'She watches it bury one under the bench, pat it flat, and look round to see if anyone noticed.',
            ),
            L('…I like it.', 'soft'),
          ],
        },
      },
      // ------------------------------------------------ 10. Mind Yourself (by the end of ch8)
      {
        id: 's26-step10',
        goal: 'Bring Tobin into the garden instead of hiding it from him.',
        hint: 'Don’t send him away. Get him onto Hush’s bench, and let the garden do the rest.',
        check: 'escort:s26-tobin:hush-bench',
        scene: {
          id: 's26-tobin-finds',
          lines: [
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
          choices: [
            {
              id: 'asked',
              label: 'Ask Tobin to sit on Hush’s bench. Just for a minute.',
              set: { 's26-tobin': 'asked' },
              then: [
                T('Sit? I… well. A minute. One.', 'think'),
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
                  'She shows him everything: the wick canes, the raised beds, the pebble by the bench. She is cross the whole way round, and very thorough.',
                ),
                N(
                  'At the end he sits down on Hush’s bench, because his legs have decided for him.',
                ),
              ],
            },
          ],
        },
        done: {
          id: 's26-tobin-bench',
          lines: [
            T(
              'This puts me in mind of a story. There was a winter, the year of the Three Hats, when…',
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
        },
      },
      // ------------------------------------------------ 11. Snowed In (ch11, early): the payoff of step 5
      {
        id: 's26-step11',
        goal: 'Find Linnet in the walled garden.',
        hint: 'Follow her wheel tracks in the snow, along the old wall to the ivy door.',
        check: 'find:s26-linnet:snow',
        scene: {
          id: 's26-snow',
          lines: [
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
        },
        done: {
          id: 's26-snowdrops',
          lines: [
            N(
              'Her tracks go along the old wall, through the open door and straight down the ramp: two neat lines in the snow.',
            ),
            N(
              'Linnet is by Hush’s bench in three blankets, with the robin on her knee like a hot coal.',
            ),
            L('You took your time. Look. LOOK.', 'happy'),
            ...SNOWDROPS,
            L(
              'I came in on my own. Nearly in the dark. Nobody had to come and do anything.',
              'soft',
            ),
            N('She says it lightly, like a fact about the weather.'),
          ],
        },
      },
      // ------------------------------------------------ 12. In the Garden!
      {
        id: 's26-step12',
        goal: 'Walk Linnet’s mum up to the walled garden.',
        hint: 'Along the old wall to the ivy door. Don’t tell her anything on the way. Let her hear it.',
        check: 'walk:s26-mum:old-wall',
        scene: {
          id: 's26-mum',
          lines: [
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
        },
        done: {
          id: 's26-race',
          lines: [
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
            N(
              'Linnet wins by a length. It would have been two if she hadn’t looked back to gloat.',
            ),
            N('Nobody says “brave”, or anything like it. Dusty has been warned.'),
            L('It fits me now. The garden. It didn’t, and now it does.', 'happy'),
          ],
        },
      },
      // ------------------------------------------------ 13. The Key (sets hushGarden and s26Done on completion)
      {
        id: 's26-step13',
        goal: 'Decide what happens to the garden key.',
        hint: 'There’s no wrong answer. The door stays open whichever you choose.',
        check: 'choose:s26-key',
        scene: {
          id: 's26-key-choice',
          lines: [
            N(
              'That evening, when the others have gone in for tea, there is only you and Linnet and the robin, and the key.',
            ),
            N(
              'It hangs on a nail inside the door, where it has hung since the morning you dug it up.',
            ),
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
          choices: [
            {
              id: 'linnet',
              label: 'Give it to Linnet. She asked for the earth first.',
              set: { 's26-key': 'linnet' },
              then: [
                L('Me? I just said… oh, you’re impossible.', 'angry'),
                N('She closes her hand round it. Then she goes very quiet.'),
                L(
                  'Then I’m keeping it so nobody can ever lock it. That’s what it’s for now.',
                  'soft',
                ),
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
        },
      },
    ],
    complete: {
      id: 's26-complete',
      lines: [
        ...COMPLETE_START,
        N(
          'Linnet wears the key on a bootlace round her neck. It is far too big and bangs on her chest when she races, and she races anyway.',
        ),
        ...COMPLETE_END,
      ],
    },
    rewards: [
      {
        id: 's26-hushgarden',
        kind: 'flag',
        label: 'hushGarden',
        description:
          'Hush’s garden is open again. In chapter 12 Hazel stops at the old wall; in Moss Sleeps his flower’s seed goes over the wall; every ending gains a garden line.',
      },
      {
        id: 's26-garden',
        kind: 'feature',
        label: 'The Walled Garden',
        description:
          'A new section behind the Old Wall lantern: Hush’s roses, Linnet’s raised beds, the ramp and Hush’s bench. Plants grow with the seasons on their own; nothing needs watering. Linnet visits every summer.',
      },
      {
        id: 's26-robin',
        kind: 'cosmetic',
        label: 'The robin',
        description:
          'A robin petpet that follows your Keeper about at a spade’s length, as if you owe it something. It never says a word.',
      },
      {
        id: 's26-apron',
        kind: 'cosmetic',
        label: 'Gardener’s apron',
        description:
          'Dusty’s old digging apron, earth worked into every seam. Nubbins bring you things to plant when you wear it.',
      },
      {
        id: 's26-crown',
        kind: 'cosmetic',
        label: 'Snowdrop crown',
        description:
          'A ring of snowdrops Linnet made for you. It never wilts, and you’re still not allowed to take it off before tea.',
      },
      {
        id: 's26-bench',
        kind: 'decor',
        label: 'Hush’s bench',
        description:
          'A stone bench for your Grove, made by Dusty from the old garden steps. Grey Nubbins like to sit on it in the sun.',
      },
    ],
    sets: { hushGarden: true, s26Done: true },
    childLines: {
      's26-inside#3': 'Shh. Listen. Nothing’s making a sound. Not one thing.',
      's26-inside#4': 'It’s like the whole garden’s holding its breath.',
      's26-wick#4': 'Green under the grey. It’s alive. It’s only been asleep.',
      's26-earth-ask#4': 'Moss. Please could one little corner be mine? Just to look after?',
      's26-earth-ask#6': 'I want to plant things. And look after them. And see them come up.',
      's26-earth-ask#8': 'Take any corner you like. This garden has been waiting for someone.',
      's26-earth-ask#9':
        'You remind me of my friend Hush. She loved digging, and watching things grow.',
      's26-earth-ask#10': 'Pick your corner. Then help it grow.',
    },
    notes:
      'THEME. Safe is not the same as well, told from the child’s side: Linnet is kept, not let. The garden Hush grew for ' +
      'the still ones becomes a garden for someone who will not sit still in it. Slow hands: a ramp is three evenings’ work. ' +
      'BURNETT, CHANGED ON PURPOSE. No cure by willpower. Linnet stays as she is; the garden is changed to fit her. ' +
      'TIMING. Opens after c6-close (late summer). Step scenes play when the previous check is met, as in the other side-story ' +
      'files. Steps 1–8 run from chapter 6; step 9 waits for chapter 7 (autumn); step 10 must be done by the end of chapter ' +
      '8 (the journal hint in chapter 8 says the garden won’t wait for winter). If chapter 9 opens before step 10 is done, ' +
      'the story closes unfinished: no rewards, hushGarden unset. The story pauses through chapters 9–10 (no scenes, no ' +
      'journal nudges). Step 11’s scene plays on the first visit to the Grove after c11-open; steps 12 and 13 follow within ' +
      'the few days of chapter 11. If chapter 12 begins before step 13’s check, the story closes unfinished and hushGarden ' +
      'stays unset. ' +
      'SIGNATURE CHOICE. Step 5 (s26-steps: ramp | lift) is paid off in step 11, six outline quests later. ' +
      'PRELUDES (SIM: play a variant immediately before a step’s own scene). With s26-steps = ramp, play s26-ramp-1 before ' +
      's26-pruned, s26-ramp-2 before s26-earth-ask and s26-ramp-3 before s26-bench. With lift, play s26-lift-1, s26-lift-2 ' +
      'and s26-lift-3 in the same places. These are the outline’s “three evening scenes”: story beats, never a repeating ' +
      'task. Steps 6 and 7 are written to work whether Linnet is at the top of the steps or down in the garden. By step 8 ' +
      'she is down on both routes. ' +
      'OTHER VARIANTS. If s12Done when step 3 completes, play s26-door-thrums in place of s26-door. If s13Done when step 10 ' +
      'completes, play s26-tobin-bench-cellar in place of s26-tobin-bench. With s26-steps = lift, play s26-snowdrops-lifted ' +
      'in place of s26-snowdrops (step 11 done). Complete: s26-complete for s26-key = linnet, s26-complete-post for post, ' +
      's26-complete-door for door. ' +
      'CAMPAIGN HOOKS (hushGarden; all in SIDE_STORY_S26_VARIANTS). (1) c12-wall-garden: in c12-open, after line 8 (“Hazel ' +
      'walks the Grove. Slowly. She touches each lantern post…”) and before line 9 (“At the fourth post, the long grass…”), ' +
      'play c12-wall-garden, then resume c12-open at line 9. Narration only: Hazel never speaks in it. (2) ' +
      'end-moss-sleeps-garden: in the Moss Sleeps ending, straight after end-moss-sleeps and before the epilogue variants. ' +
      '(3) end-epi-garden: in every ending except The Collector, after the other epilogue variants (S2, S9, S10, S13, S19, ' +
      'and S23 if wired) and before end-<id>-last. In The Collector, end-epi-garden-cold plays there instead. ' +
      'MOSS. Steps 6–8 need him, and he is always in the world in chapters 6–8. Steps 11–13 and the complete scene never ' +
      'use him, so they hold on every route. The bare patch by Hush’s bench, marked with Linnet’s white pebble, stays bare ' +
      'in the garden art until end-moss-sleeps-garden (where his seed is promised to it). Moss returns to S1’s Hush ' +
      'memory in s26-hush from a new angle (how the still ones came in, and why the roses); he never tells a tale twice ' +
      'in the same words, and he points to Lantern Night for the door and the key instead of telling that again. It ' +
      'agrees with S1: the last still one faded in winter by this wall. Hush faded before Hazel came; Moss has come over the wall once a year, on ' +
      'the day she faded, and told nobody, Hazel included. ' +
      'TOBIN. This is always the player’s first meeting with Tobin (S13 opens in chapter 7), so he gets his one-line ' +
      'introduction in s26-linnet. ' +
      'LINNET (art and movement). Eleven; her own dark green wheelchair, which she propels herself, fast on the flat. Nobody ' +
      'pushes it or lifts her without asking. Sparks lifts “front and back, never the sides”, as Linnet directs. Animate her ' +
      'racing, spinning to face people, and working the raised beds from her chair. Brake on when she settles (s26-bench). ' +
      'Check every movement, the ramp gradient and the snow beat with wheelchair users. ' +
      'ART. Walled garden behind the ivy door on the north side: ivy that lifts in the wind (later hung on a rail), three ' +
      'worn stone steps that become a long, shallow ramp (ramp state persists), grey canes that green over the seasons, ' +
      'Hush’s stone bench in the middle, raised beds on the south wall, the white pebble, snow in chapter 11, snowdrops ' +
      'scattered where the Nubbin hid bulbs (one on the ramp). Robin: perches on posts, bench and Linnet’s knee; never ' +
      'speaks. Your Nubbin: bulging cheeks in step 9. ' +
      'SIM: new flags hushGarden (bool) and s26Done; the prelude rule above; ramp and snow art states; the walled garden ' +
      'section (seasonal growth, no watering, no timers); the robin petpet; Linnet as a summer visitor in the garden after ' +
      'the campaign (talk only, no chores); Tobin gains garden tales (added to his S13 tale pool if S13 is done, or told at ' +
      'his cottage gate if not). The c12 insertion point and the three ending scenes above.',
  },
];

// ================================================================== variants
export const SIDE_STORY_S26_VARIANTS: Scene[] = [
  // ---------------------------------------------------------------- step 3 done, if s12Done
  {
    id: 's26-door-thrums',
    lines: [
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
  },
  // ---------------------------------------------------------------- preludes, s26-steps = ramp
  { id: 's26-ramp-1', lines: RAMP_1 },
  { id: 's26-ramp-2', lines: RAMP_2 },
  { id: 's26-ramp-3', lines: RAMP_3 },
  // ---------------------------------------------------------------- preludes, s26-steps = lift
  { id: 's26-lift-1', lines: LIFT_1 },
  { id: 's26-lift-2', lines: LIFT_2 },
  { id: 's26-lift-3', lines: LIFT_3 },
  // ---------------------------------------------------------------- step 10 done, if s13Done
  {
    id: 's26-tobin-bench-cellar',
    lines: [
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
  },
  // ---------------------------------------------------------------- step 11 done, if s26-steps = lift
  {
    id: 's26-snowdrops-lifted',
    lines: [
      N('Her tracks go along the old wall to the open door, and stop.'),
      N(
        'Linnet is at the top of the three steps. They are under a foot of snow, and nobody has cleared them, because nobody thought anyone would come.',
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
      ...SNOWDROPS,
      L('I’d have got in on my own. If anybody had built it so I could.', 'soft'),
    ],
  },
  // ---------------------------------------------------------------- complete, if s26-key = post
  {
    id: 's26-complete-post',
    lines: [
      ...COMPLETE_START,
      N(
        'The key hangs on the old wall post, under the lantern. By the end of the week, three people you have never met have been in to look.',
      ),
      ...COMPLETE_END,
    ],
  },
  // ---------------------------------------------------------------- complete, if s26-key = door
  {
    id: 's26-complete-door',
    lines: [
      ...COMPLETE_START,
      N(
        'The key sits in the door, turned to open. Snow settles on its bow, and nobody brushes it off, and nobody turns it.',
      ),
      ...COMPLETE_END,
    ],
  },

  // ---------------------------------------------------------------- campaign: chapter 12, inside c12-open (hushGarden)
  {
    id: 'c12-wall-garden',
    lines: [
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
  },
  // ---------------------------------------------------------------- campaign: Moss Sleeps, after end-moss-sleeps (hushGarden)
  {
    id: 'end-moss-sleeps-garden',
    lines: [
      N('His flower came up on the hill, by the flat stone where he always sat.'),
      N(
        'Linnet says that by midsummer its seed will be over the old wall, the way he went once a year.',
      ),
      N(
        'Into the bit of earth by Hush’s bench, the one he chose, where her white pebble still is.',
      ),
      N('She says the robin will see to it. Nobody argues, and nobody makes a speech.'),
    ],
  },
  // ---------------------------------------------------------------- campaign: epilogue line, every ending but The Collector (hushGarden)
  {
    id: 'end-epi-garden',
    lines: [
      N(
        'The door in the old wall isn’t locked any more. Linnet comes every summer and tells everyone where to dig.',
      ),
      N('Hush’s roses come out in June, all at once, as if somebody told them to. Somebody did.'),
    ],
  },
  // ---------------------------------------------------------------- campaign: epilogue line, The Collector (hushGarden)
  {
    id: 'end-epi-garden-cold',
    lines: [
      N(
        'The door in the old wall stands open, and none of yours go in. They sit outside it in the sun, quite still.',
      ),
      N(
        'Linnet came the first summer. She looked at them for a long time, and asked what was wrong with them.',
      ),
      N('You said they were safe. She went home a week early, and didn’t come again.'),
    ],
  },
];

/** Every flag this story sets. (Reads: s12Done, s13Done, the ending id, and its own s26-steps and s26-key.) */
export const SIDE_STORY_S26_FLAGS: string[] = [
  'hushGarden', // true, on completion (step 13, chapter 11): read by c12-wall-garden, end-moss-sleeps-garden, end-epi-garden(-cold)
  's26Done',
  's26-hello', // agree | asked | walk (flavour)
  's26-steps', // ramp | lift: picks the step 6–8 preludes and the step 11 payoff
  's26-plot', // sun | rose | hers (flavour)
  's26-bulbs', // snowdrops | crocus | mix (flavour)
  's26-tobin', // asked | shown (flavour)
  's26-key', // linnet | post | door: picks the complete scene
];

export const SIDE_STORY_S26_CHECKS: string[] = [
  'feed:s26-robin',
  'talk:s26-linnet',
  'find:s26-door',
  'escort:dusty:s26-garden',
  'choose:s26-steps',
  'wait:s26-garden:dusk',
  'explore:s26-garden',
  'sit:s26-hush-bench',
  'place:s26-bulbs:raised-beds',
  'escort:s26-tobin:hush-bench',
  'find:s26-linnet:snow',
  'walk:s26-mum:old-wall',
  'choose:s26-key',
];
