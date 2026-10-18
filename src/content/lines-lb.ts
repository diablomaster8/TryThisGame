/**
 * Learning Grove line LB1–LB12: Play.
 *
 * Source: inspired by *Bluey* (Ludo Studio, 2018, Australia; commissioned by ABC Kids and
 * BBC Studios, which hold the rights). Only the spirit is borrowed: play is how children work
 * things out, and a tired parent who says yes to one more go is doing something important.
 * Nothing else is taken: no lines, characters, names, episode plots, designs, places or music.
 * The Larkins are an original human family; the games are old playground games (shops, dens,
 * grandmother’s footsteps, shadow puppets, treasure maps) given new rules. The game’s notes say
 * "inspired by Bluey" and nothing more.
 *
 * Audience: 'all'. A Learning Grove line: it plays only with the Learning Grove on, and the
 * Learning Grove versions (both bands, LINE_LB_EDU) are the real text. The main scenes below
 * are the base script the edu scenes replace by id, in simple warm language.
 *
 * Frame: none. LB is not an Atlas page or an Arcade cartridge; it happens in the valley.
 * The Larkins move into the empty cottage past Fern’s in late spring, after chapter 1, and the
 * line runs through summer into early autumn, one game at a time, each needing the one before.
 * In the Free Grove it runs in order at any season. It pauses for chapters 9–11, never repeats,
 * and never writes a Grove flag. Pixel, Pixel’s Arcade and the Atlas play no part in it.
 *
 * Family: Ama Larkin (Mum, drives the post van, draws the best maps); Sam Larkin (Dad, grew up in
 * Brisbane, makes chairs in the shed, always tired, always says yes to one more go); Maisie (six,
 * makes up the rules); Ned (four, breaks them, mostly by accident). The Keeper is the grown-up next
 * door but one who gets roped in. The Larkins have no Nubbin, so they borrow yours, and they always
 * ask, and they always give it back. Nubbins and animals do not speak (canon 17).
 *
 * Grove flags read: none.
 * Flags written (all the line’s own, prefixed `lb-`; none is a Grove flag):
 *   lb-moved-in  true when LB1 completes (Tier 2: the cottage past Fern’s is lived in).
 *   lb-box       big | long | tall, LB1’s signature choice (Ned’s box). Read by the LB6 den-door
 *                variant and the LB12 payoff variant: big = house, long = boat, tall = rocket.
 *   lb-race      proper | let-win | hand, LB11’s choice (reader only; sprout defaults to hand).
 *                Read by the LB12 arrival variant: proud and loud, too pleased with himself, or
 *                holding Maisie’s hand.
 *   lb-done      true when LB12 completes (Tier 2 ambient, see LB12 notes).
 *   lb-star-wish = wish | hum | nubbin (LB12, lb12-waiting): read once more in LB12's complete scene
 *                (lb12-complete-wish for wish).
 *   lb-ned-shop, lb-den-story, lb-shadow, lb-map-fair, lb-cafe-reply, lb-boat:
 *                harmless choice flags: recorded for the journal, read by nothing.
 *
 * Variants (LINE_LB_VARIANTS): lb06-door-big | -long | -tall (play straight after lb06-built);
 * then lb12-ned-proper | -let-win | -hand and then lb12-box-big | -long | -tall (both play straight
 * after lb12-arrive, in that order, before the step-2 scene lb12-waiting).
 *
 * Lifted text: none. Bluey is copyrighted and nothing is quoted from it, so there are no
 * childLines: every line is original.
 *
 * Care notes:
 * - Ages 3–10, gentle throughout. Every choice is kind; Ned is never laughed at.
 * - Sam’s tiredness is ordinary tiredness, never illness, and never a problem a child must fix.
 * - Ama is a working mum and Sam is the parent at home. Neither is the joke.
 * - The Larkins never appear in the campaign’s scenes and hold no lantern at the Long Night.
 * - Nothing about the Larkins or their games may look like Bluey’s designs: they are people,
 *   their cottage is a Grove stone cottage, and no Queenslander house appears anywhere.
 * - No real Shells change hands in Ned’s shop or the café: change is always given back in full.
 * - Name note: S31 also has a valley boy called Ned (nine). Ned Larkin is four; ids differ
 *   (`lb-ned`, `s31-ned`). Flagged for Maor in docs/logs/script-lb.md.
 */
import type {
  EduBand,
  EduDomain,
  EduQuest,
  EduScene,
  GlossaryEntry,
  Lesson,
  LessonOption,
  Quest,
  Speaker,
} from './types';
import type { Choice, Line, Mood, Scene } from '../config/story';

const say =
  (who: string) =>
  (text: string, mood?: Mood): Line =>
    mood ? { who, text, mood } : { who, text };

/** Narrator. */
const N = say('narrator');
/** The player. */
const Y = say('you');

// ---------------------------------------------------------------- speakers

const AMA_S: Speaker = { id: 'lb-ama', name: 'Ama Larkin', kind: 'other' };
const SAM_S: Speaker = { id: 'lb-sam', name: 'Sam Larkin', kind: 'other' };
const MAISIE_S: Speaker = { id: 'lb-maisie', name: 'Maisie', kind: 'other' };
const NED_S: Speaker = { id: 'lb-ned', name: 'Ned', kind: 'other' };
const FAMILY: Speaker[] = [AMA_S, SAM_S, MAISIE_S, NED_S];

const AMA = say('lb-ama');
const SAM = say('lb-sam');
const MAI = say('lb-maisie');
const NED = say('lb-ned');

const WHERE = 'Learning Grove only: the Larkins’ cottage, past Fern’s';
const SOURCE = 'Inspired by Bluey (Ludo Studio, 2018): an original family and old playground games';
const after = (code: string, extra: string): string =>
  `After ${code} is complete: ${extra} Pauses during chapters 9–11; never repeats.`;

// ================================================================ the quests

export const LINE_LB: Quest[] = [
  // ------------------------------------------------------------------ LB1
  {
    id: 'lb01',
    code: 'LB1',
    title: 'Boxes',
    source: SOURCE,
    audience: 'all',
    trigger: {
      where: WHERE,
      when: 'Late spring, any day after chapter 1 (Free Grove: any season) with the Learning Grove on. Pauses during chapters 9–11; never repeats.',
    },
    speakers: FAMILY,
    steps: [
      {
        id: 'lb01-s1',
        goal: 'Help the Larkins carry their boxes from the post van into the cottage past Fern’s.',
        hint: 'Pick up a box at the van’s back doors and carry it into the front room. Your Nubbin will help, sort of.',
        check: 'carry:lb-boxes:larkin-cottage',
        scene: {
          id: 'lb01-van',
          lines: [
            N(
              'A red post van is parked crooked in the lane past Fern’s. Its back doors are open and it is full of somebody’s whole life.',
            ),
            N('The empty cottage has its windows open. You have never seen them open before.'),
            AMA('Oh, hello! You must be next door. Well, next door but one. I’m Ama.', 'happy'),
            AMA(
              'I drive the post van. It isn’t usually full of our own socks. Usually it’s everyone else’s parcels.',
            ),
            SAM('Sam. Hello. Sorry. We’ve been up since four.', 'soft'),
            N(
              'A girl in a paper crown marches past with a lampshade. A small boy follows her, carrying nothing, very carefully.',
            ),
            MAI('I’m Maisie. I’m six, so I do the rules. That’s Ned. He’s four.'),
            NED('I’m in charge of not dropping things.'),
            N('Your Nubbin trots up to Ned. They stare at each other, both delighted.'),
            SAM('If you’ve got a spare pair of arms, we’ve got about forty boxes.'),
          ],
        },
        done: {
          id: 'lb01-unpacked',
          lines: [
            N(
              'By lunchtime the van is empty and the front room is full of boxes. Most of the boxes are empty too.',
            ),
            AMA(
              'That’s the lot. The kettle was in the box marked SHOES, so that’s a mystery solved.',
            ),
            N(
              'Maisie and Ned are not looking at the kettle. They are looking at the empty boxes, the way other children look at cake.',
            ),
          ],
        },
      },
      {
        id: 'lb01-s2',
        goal: 'Help Ned choose one empty box to keep.',
        hint: 'Talk to Ned in the front room and pick a box with him.',
        check: 'choose:lb-ned-box',
        scene: {
          id: 'lb01-boxes',
          lines: [
            N(
              'Ama folds the empty boxes flat for the recycling. Ned watches each one fold up as if it were a small, sad animal.',
            ),
            NED('Not that one! Or that one!', 'shock'),
            AMA('Ned, love, we can’t keep forty boxes. We’d have to live in the garden.'),
            SAM('One box, then. One box for keeps.'),
            N(
              'Ned walks along the row and knocks on each box, the way you knock on a door. Then he climbs into one and goes quiet.',
            ),
            MAI(
              'He’s sad about his old bedroom. It had glow-in-the-dark stars on the ceiling.',
              'soft',
            ),
            NED('They wouldn’t come off. I tried.', 'sad'),
            SAM(
              'They’re still up there, mate. Glowing away for whoever sleeps there next.',
              'soft',
            ),
            N(
              'Ned thinks about that for a long time. Then he climbs out, points at three boxes in turn, and looks at you.',
            ),
            NED('You pick. You’re the grown-up next door.'),
          ],
          choices: [
            {
              id: 'big',
              label: 'The big one. You could live in it.',
              set: { 'lb-box': 'big' },
              then: [
                N('Ned climbs into the big box and pulls the flaps shut over his head.'),
                NED('It’s got a ROOF.', 'happy'),
              ],
            },
            {
              id: 'long',
              label: 'The long one. It’s the shape of a boat.',
              set: { 'lb-box': 'long' },
              then: [
                N(
                  'Ned lies down in the long box. It fits him exactly, with room at the end for your Nubbin.',
                ),
                NED('We’re lying down. Shh.', 'happy'),
              ],
            },
            {
              id: 'tall',
              label: 'The tall one. It’s nearly as tall as Ned.',
              set: { 'lb-box': 'tall' },
              then: [
                N('Ned stands up inside the tall box. Only his eyes show over the top.'),
                NED('It goes UP.', 'happy'),
              ],
            },
          ],
        },
      },
    ],
    complete: {
      id: 'lb01-complete',
      lines: [
        N('Ama writes NED on the box in marker pen, in letters as big as Ned’s hand.'),
        AMA(
          'There. Officially his. Thank you for today. I’d have been making tea in a shoe box till August.',
          'happy',
        ),
        SAM(
          'Come round whenever you like. They’ll need a customer for something soon. They always do.',
        ),
        MAI(
          'We need grown-ups for nearly every game. And Nubbins. Can we borrow yours sometimes? We’ll always ask.',
        ),
        N(
          'Your Nubbin is the last to leave. Ned waves at it from inside his box until you reach the lane.',
        ),
      ],
    },
    rewards: [
      {
        id: 'lb-larkins-moved-in',
        kind: 'flag',
        label: 'New Neighbours',
        description:
          'The cottage past Fern’s is lived in: the Larkins have moved in, and their games begin. Learning Grove only.',
      },
    ],
    sets: { 'lb-moved-in': true },
    notes:
      'Moving day. Props: the red post van in the lane past Fern’s, about forty boxes (a carry loop of 6 trips is plenty; ' +
      'the rest are already in), Maisie’s paper crown. The box choice is the line’s signature choice: big (pays off as a house), ' +
      'long (a boat) or tall (a rocket), in LB6 (the den door) and LB12 (the last night). After completion the chosen box, with ' +
      'NED on it, sits in the Larkins’ front room until LB6. Ama is in her post-office uniform; Sam has sawdust on his jumper.',
  },

  // ------------------------------------------------------------------ LB2
  {
    id: 'lb02',
    code: 'LB2',
    title: 'Shops',
    source: SOURCE,
    audience: 'all',
    trigger: {
      where: WHERE,
      when: after('LB1', 'the next morning there is a SHOP sign on the Larkins’ step.'),
    },
    requires: ['LB1'],
    speakers: FAMILY,
    steps: [
      {
        id: 'lb02-s1',
        goal: 'Buy a leaf from Ned’s shop on the Larkins’ step.',
        hint: 'Talk to Ned at his shop and count out 5 Shells. You will get them back.',
        check: 'give:shells:lb-ned',
        scene: {
          id: 'lb02-shop',
          lines: [
            N(
              'A cardboard sign on the Larkins’ step says SHOP, with the S backwards. The shop is open.',
            ),
            N(
              'Leaves are laid out in rows on a tea towel: big ones, small ones, and one with a hole that Ned says is a window.',
            ),
            NED('Welcome to the shop. Everything is leaves.', 'happy'),
            Y('How much is this one?'),
            NED('Five Shells.'),
            Y('And this one?'),
            NED('Five Shells. No. A hundred. No. Two.', 'think'),
            N(
              'Prices in Ned’s shop change about as often as the wind does. Your Nubbin sits by the till, a biscuit tin, as security.',
            ),
            NED('The window leaf is five. It’s the best one. You can look through it.'),
          ],
          choices: [
            { id: 'pay', label: 'Five Shells it is.', then: [NED('Good. Count them in my hand.')] },
            {
              id: 'discount',
              label: 'Do you do discounts?',
              then: [NED('Yes. It’s six.', 'happy'), N('You decide five was a bargain.')],
            },
            {
              id: 'nubbin',
              label: 'Could my Nubbin buy one too?',
              then: [
                NED('Nubbins are free. Nubbins get a leaf for nothing.'),
                N('Ned gives your Nubbin a leaf. It holds it like a flag.'),
              ],
            },
          ],
        },
        done: {
          id: 'lb02-bought',
          lines: [
            N(
              'You count five Shells into Ned’s hand. He counts them again, nearly right, and drops them in the biscuit tin.',
            ),
            NED('And here’s your change.'),
            N(
              'He gives you all five back. In Ned’s shop the change is the best bit, so you always get everything back.',
            ),
          ],
        },
      },
      {
        id: 'lb02-s2',
        goal: 'Help Maisie and Ned share the shop.',
        hint: 'Talk to Maisie and Ned at the step and help them find a way to take turns.',
        check: 'talk:lb-maisie:turns',
        scene: {
          id: 'lb02-turns',
          lines: [
            N(
              'Maisie comes out with a second tea towel and a sign of her own. Hers says SHOP TOO.',
            ),
            MAI('I’m the shopkeeper now. Ned’s had ages.'),
            NED('It’s MY shop. I made the S.', 'angry'),
            N(
              'Ned holds the biscuit tin to his chest and Maisie folds her arms. The leaves blow about a bit, unsupervised.',
            ),
            SAM('Is there a way two shopkeepers could work this out?'),
            N(
              'Sam is leaning out of the shed window, holding a chair leg he has been sanding all morning.',
            ),
            MAI('He could be the customer. Customers are important too.'),
            NED('Customers don’t get the tin.', 'sad'),
          ],
          choices: [
            {
              id: 'swap-sale',
              label: 'Ned sells one thing, then you swap.',
              set: { 'lb-ned-shop': 'swap' },
              then: [MAI('One each. Fine. But I’m having the window leaf.')],
            },
            {
              id: 'two-shops',
              label: 'Two shops, side by side. I’ll shop at both.',
              set: { 'lb-ned-shop': 'two' },
              then: [
                N('Maisie sets up her tea towel next to Ned’s. Now the step has a high street.'),
              ],
            },
            {
              id: 'tin-turns',
              label: 'Whoever’s selling holds the tin.',
              set: { 'lb-ned-shop': 'tin' },
              then: [NED('And then I get it back?'), MAI('Then you get it back.')],
            },
          ],
        },
      },
    ],
    complete: {
      id: 'lb02-complete',
      lines: [
        N(
          'Maisie runs the shop for a while. Ned is a customer, and finds out something surprising.',
        ),
        NED('Buying is ALSO good.', 'happy'),
        N(
          'He buys the window leaf six times. Maisie gives him change every time, because that is how this shop works now.',
        ),
        SAM('Two shopkeepers, one tin, nobody crying. That’s a good day’s trading.'),
        N(
          'When you go, Ned presses a leaf into your hand. It is free, he says, because you are a regular.',
        ),
      ],
    },
    rewards: [],
    notes:
      'Ned’s leaf shop on the Larkins’ step: tea towel, leaves, a biscuit-tin till, the backwards S. No real Shells are spent: ' +
      'the check counts 5 Shells out of the inventory and the shop gives them straight back as change. Sam sands a chair leg in ' +
      'the shed (his work), visible through the window. Maisie’s SHOP TOO sign stays on the step until LB12 as set dressing.',
  },

  // ------------------------------------------------------------------ LB3
  {
    id: 'lb03',
    code: 'LB3',
    title: 'Don’t Touch the Grass',
    source: SOURCE,
    audience: 'all',
    trigger: {
      where: WHERE,
      when: after(
        'LB2',
        'a dry afternoon, with every cushion in the Larkins’ house out on the lawn.',
      ),
    },
    requires: ['LB2'],
    speakers: FAMILY,
    steps: [
      {
        id: 'lb03-s1',
        goal: 'Help lay the cushions across the Larkins’ lawn.',
        hint: 'Carry cushions from the pile by the back door and drop them in a line to the fence.',
        check: 'place:lb-cushions:larkin-lawn',
        scene: {
          id: 'lb03-rules',
          lines: [
            N(
              'Every cushion in the Larkins’ house is out on the lawn in a heap, and so is Sam, flat on his back in the long grass.',
            ),
            MAI('The rules. The grass is the pond. You can only stand on cushions.'),
            MAI('And something lives in the pond. It has tickly fingers.'),
            N('Somewhere in the long grass, a hand waves slowly, like weed.'),
            SAM('Bloop.'),
            NED('That’s Dad. But it’s also NOT Dad.', 'shock'),
            MAI('We need a path of cushions from the back door to the fence. That’s the island.'),
          ],
        },
        done: {
          id: 'lb03-laid',
          lines: [
            N(
              'The cushions wobble across the lawn in a crooked line. Some are close together and one is a very long way from the next.',
            ),
            MAI('That gap is the hard bit. It’s meant to be hard.'),
          ],
        },
      },
      {
        id: 'lb03-s2',
        goal: 'Cross the lawn to the fence without touching the grass.',
        hint: 'Hop from cushion to cushion. If the tickly fingers get you, you start again, laughing.',
        check: 'minigame:lb-cushion-crossing',
        scene: {
          id: 'lb03-crossing',
          lines: [
            N('Maisie crosses first, fast and certain, arms out like a tightrope walker.'),
            N(
              'Ned goes second. He stops on a cushion with his toes over the edge, looking at the long gap.',
            ),
            NED('It’s too far.', 'sad'),
            N(
              'The grass between the cushions rustles. Two fingers appear, wiggling, and go away again.',
            ),
            MAI('You can do it, Ned. Big jump.'),
            NED('My legs are only small.'),
          ],
          choices: [
            {
              id: 'extra-cushion',
              label: 'Put down one more cushion, halfway.',
              then: [
                N('You slide a cushion into the gap. Ned looks at it, then at Maisie.'),
                MAI('That’s allowed. Islands can grow.'),
              ],
            },
            {
              id: 'hold-hand',
              label: 'Hold out a hand from the next cushion.',
              then: [
                N('You lean out from the far cushion. Ned grabs your fingers and jumps.'),
                NED('I did a huge one!', 'happy'),
              ],
            },
            {
              id: 'nubbin-first',
              label: 'Let your Nubbin show him how.',
              then: [
                N(
                  'Your Nubbin flaps its small wings and bounces across the gap. Ned copies it exactly, flaps and all.',
                ),
              ],
            },
          ],
        },
      },
    ],
    complete: {
      id: 'lb03-complete',
      lines: [
        N(
          'Everyone reaches the fence. Then everyone goes back, because that is how this game works.',
        ),
        N(
          'On the third crossing the tickly fingers get Ned’s ankle. He shrieks and falls into the pond, which is grass, and laughs till he hiccups.',
        ),
        SAM(
          'Got one. The pond monster is satisfied. The pond monster would also like a cup of tea.',
        ),
        MAI('Pond monsters don’t drink tea.'),
        SAM('This one does. It’s been a long week in the pond.', 'soft'),
        N('Ned brings his dad a pretend tea in a flowerpot. Sam drinks every pretend drop.'),
      ],
    },
    rewards: [],
    notes:
      'A cushion-path minigame across the Larkins’ lawn: the player hops between cushions with forgiving timing. Touching grass ' +
      'only restarts the crossing with a giggle; there is no fail state. Sam lies in the long grass as the tickly-fingered pond ' +
      'monster, his hand and a "bloop" are all you see. Ned is never laughed at: everyone, Ned included, laughs at the pond monster.',
  },

  // ------------------------------------------------------------------ LB4
  {
    id: 'lb04',
    code: 'LB4',
    title: 'Sleeping Giant',
    source: SOURCE,
    audience: 'all',
    trigger: {
      where: WHERE,
      when: after('LB3', 'a hot Saturday, when Sam’s deckchair is out in the garden.'),
    },
    requires: ['LB3'],
    speakers: FAMILY,
    steps: [
      {
        id: 'lb04-s1',
        goal: 'Find the sleeping giant in the Larkins’ garden.',
        hint: 'Go round to the Larkins’ garden. The giant is in the deckchair under the apple tree.',
        check: 'visit:lb-deckchair',
        scene: {
          id: 'lb04-giant',
          lines: [
            N(
              'Sam is asleep in a deckchair under the apple tree, with a newspaper over his face. It goes up and down when he breathes.',
            ),
            MAI('Shh. He’s the giant. He’s guarding the treasure.'),
            N('The treasure is a biscuit, on the arm of the deckchair, next to his hand.'),
            NED('He made two chairs this week. Giants get very tired.', 'soft'),
            MAI(
              'The rules. You creep up. When the giant turns his head, you freeze like a statue.',
            ),
            MAI('If he sees you move, you go back to the start. First to the biscuit wins.'),
          ],
        },
        done: {
          id: 'lb04-start',
          lines: [
            N(
              'You line up by the gate: you, Maisie, Ned and your Nubbin, who does not really understand the rules but loves a line.',
            ),
            SAM('Fee. Fi. Hmm. Fo.', 'soft'),
            MAI('That means go.'),
          ],
        },
      },
      {
        id: 'lb04-s2',
        goal: 'Creep up on the giant, and freeze whenever he turns.',
        hint: 'Move slowly. When the newspaper twitches, stop and hold still.',
        check: 'minigame:lb-sleeping-giant',
        scene: {
          id: 'lb04-creep',
          lines: [
            N(
              'Maisie runs, and the newspaper twitches. Sam turns his head, and Maisie is still wobbling.',
            ),
            SAM('I see a Maisie. Back to the gate, Maisie.'),
            MAI('I was nearly STILL!', 'angry'),
            N(
              'Ned goes so slowly that a bee lands on his shoulder and leaves again. When Sam turns, Ned is a perfect statue.',
            ),
            SAM('Hmm. Just a garden ornament. A very small one.'),
            N('Ned beams, and then remembers that statues can’t beam, and stops.'),
          ],
          choices: [
            {
              id: 'slow',
              label: 'Go slow, like Ned.',
              then: [N('You take tiny steps. The grass hardly moves.')],
            },
            {
              id: 'fast',
              label: 'Try a quick dash.',
              then: [
                N('You dash. The newspaper lifts.'),
                SAM('I see a grown-up. Back you go.'),
                MAI('Told you. Slow wins.'),
              ],
            },
            {
              id: 'nubbin-creep',
              label: 'Send your Nubbin in first.',
              then: [
                N(
                  'Your Nubbin waddles straight up to the deckchair and sits by Sam’s feet. Nobody can tell if it’s cheating.',
                ),
              ],
            },
          ],
        },
      },
    ],
    complete: {
      id: 'lb04-complete',
      lines: [
        N(
          'In the end it is Ned. One slow foot at a time, he reaches the deckchair and puts one finger on the biscuit.',
        ),
        NED('Got it.', 'happy'),
        N(
          'Sam lifts the newspaper. He has been awake for most of it, and asleep for some of it, and he is not telling which bits.',
        ),
        SAM('Beaten by the smallest statue in the valley. One more go?'),
        MAI('One more go!'),
        N(
          'Ned breaks the biscuit into four pieces, one for each player. Your Nubbin’s is the biggest, because Ned says it was the quietest.',
        ),
      ],
    },
    rewards: [],
    notes:
      'Grandmother’s footsteps in the Larkins’ garden. The minigame: move while the giant faces away; freeze when the newspaper ' +
      'twitches (a clear, slow tell, never a reaction test). Being seen sends you back to the gate with no penalty. Sam really is ' +
      'tired (he made two chairs this week): ordinary tiredness, never illness. The "one more go" is his, and it is a yes.',
  },

  // ------------------------------------------------------------------ LB5
  {
    id: 'lb05',
    code: 'LB5',
    title: 'Nubbin Doctor',
    source: SOURCE,
    audience: 'all',
    trigger: {
      where: WHERE,
      when: after('LB4', 'Maisie hangs a sign on the shed door: DOCTOR. OPEN.'),
    },
    requires: ['LB4'],
    speakers: FAMILY,
    steps: [
      {
        id: 'lb05-s1',
        goal: 'Take your Nubbin to Maisie’s clinic in the Larkins’ shed.',
        hint: 'Walk your Nubbin to the shed. It is not ill. It is very good at lying still.',
        check: 'escort:nubbin:lb-clinic',
        scene: {
          id: 'lb05-clinic',
          lines: [
            N(
              'The shed has been cleared for the clinic. The workbench is a bed, with a tea towel for a sheet.',
            ),
            MAI('Next patient, please. Ah. A Nubbin. What seems to be the trouble?'),
            Y('Nothing, really. It’s very well.'),
            MAI('That’s what they all say. Up on the bed, please.'),
            N(
              'Your Nubbin climbs onto the workbench and lies flat on its back. It is not ill, just very good at lying still.',
            ),
            NED('I’m the nurse. I’ve got the bandages.'),
            N('Ned holds up a whole roll of toilet paper, like a trophy.'),
          ],
        },
        done: {
          id: 'lb05-checkup',
          lines: [
            N(
              'Maisie listens to your Nubbin’s tummy through a funnel. Your Nubbin does its best to have a tummy worth listening to.',
            ),
            MAI('Good heart. Good ears. Wings a bit small, but that’s normal.'),
            MAI('Has it been eating? Drinking? Sleeping? Getting cuddles?'),
            Y('All four. Lots of the last one.'),
          ],
        },
      },
      {
        id: 'lb05-s2',
        goal: 'Help Ned bandage your Nubbin, kindly.',
        hint: 'Talk to Ned at the workbench. He has the wrong leg.',
        check: 'talk:lb-ned:bandage',
        scene: {
          id: 'lb05-bandage',
          lines: [
            MAI('The patient has a sore left foot. Nurse, bandage please.'),
            N(
              'Ned starts winding the toilet paper round your Nubbin’s right foot, with his tongue out, very carefully.',
            ),
            N(
              'Maisie opens her mouth to say something. Then she looks at Ned’s face and closes it again.',
            ),
            MAI(
              'How do you tell somebody they’ve done it wrong, without making them sad?',
              'think',
            ),
            N(
              'Your Nubbin lies quite still, wrapped up to the knee, looking pleased with the attention.',
            ),
          ],
          choices: [
            {
              id: 'other-foot',
              label: '“That’s brilliant. Could this foot have one too?”',
              then: [
                NED('Two bandages! It’s VERY poorly.', 'happy'),
                N('Now both feet are bandaged, which covers it either way.'),
              ],
            },
            {
              id: 'ask-ned',
              label: '“Which foot did the doctor say, Ned?”',
              then: [
                NED('The… other one?', 'think'),
                N(
                  'Ned looks at his own feet and works it out. He starts again on the left, proudly.',
                ),
              ],
            },
            {
              id: 'nubbin-points',
              label: 'Let your Nubbin wiggle the left foot.',
              then: [
                N(
                  'Your Nubbin wiggles its left foot, gently. Ned gasps: the patient has told him.',
                ),
              ],
            },
          ],
        },
      },
    ],
    complete: {
      id: 'lb05-complete',
      lines: [
        N(
          'Your Nubbin walks home with both feet in toilet paper, like small white boots. It will not let you take them off for an hour.',
        ),
        MAI('Bring it back if it gets any worse. Or any better.'),
        NED('It was a very brave patient.', 'soft'),
        N(
          'Sam, coming in for a pencil, gets a check-up too. Maisie says he needs more sleep and prescribes a nap.',
        ),
        SAM('Best medicine I’ve heard of all week.', 'happy'),
      ],
    },
    rewards: [],
    notes:
      'The clinic is the Larkins’ shed with the workbench cleared. Props: a funnel stethoscope, a toilet-roll bandage. The Nubbin ' +
      'is never ill: it is playing a patient, and its needs meters are not touched. Afterwards it wears toilet-paper "boots" for ' +
      'an hour of game time as a cosmetic idle (removable, never forced). Ned’s mistake is met with kindness in every choice.',
  },

  // ------------------------------------------------------------------ LB6
  {
    id: 'lb06',
    code: 'LB6',
    title: 'Den Day',
    source: SOURCE,
    audience: 'all',
    trigger: {
      where: WHERE,
      when: after('LB5', 'the first properly rainy day, when the children cannot go out.'),
    },
    requires: ['LB5'],
    speakers: FAMILY,
    steps: [
      {
        id: 'lb06-s1',
        goal: 'Gather chairs and blankets for a den in the Larkins’ front room.',
        hint: 'Bring blankets from the cupboard and chairs from Sam’s shed. Ned’s box is already there.',
        check: 'collect:lb-den-blankets',
        scene: {
          id: 'lb06-rain',
          lines: [
            N(
              'Rain all day. The lane is a stream and the Larkins’ windows are fogged with small fingerprints.',
            ),
            MAI('It was sunny yesterday. It’s not fair. Weather should take turns properly.'),
            AMA('It’s Saturday and I’m not driving anywhere. So. Den?'),
            NED('DEN.', 'happy'),
            N(
              'Ama takes every blanket out of the cupboard. Sam brings in four chairs from the shed, all his own work, all slightly different.',
            ),
            SAM('Mind that one, it’s not finished. It wobbles. So it’s perfect for a den.'),
          ],
        },
        done: {
          id: 'lb06-built',
          lines: [
            N(
              'The den goes up: four chairs, three blankets, a sheet for the roof, and pegs from the washing line to hold it all.',
            ),
            AMA('Every den needs a door.'),
            N('Ned is already dragging his box across the rug, the one with NED on the side.'),
          ],
        },
      },
      {
        id: 'lb06-s2',
        goal: 'Sit in the den with the Larkins while the rain goes on.',
        hint: 'Crawl in through Ned’s box and sit down. There is nothing to do but listen.',
        check: 'sit:lb-den',
        scene: {
          id: 'lb06-inside',
          lines: [
            N(
              'Inside the den the light is blue and soft. Everyone’s knees touch, and nobody minds.',
            ),
            N(
              'Rain taps on the window. It sounds different from in here, further away and friendlier.',
            ),
            MAI('What shapes can you see? The roof is a triangle. The cushion is a square.'),
            NED('And Mum’s head is a circle.'),
            AMA('Thank you, Ned.', 'happy'),
            N('Your Nubbin curls up on Ned’s feet. Ned holds very still, so as not to wake it up.'),
          ],
          choices: [
            {
              id: 'story',
              label: 'Tell a story about a den in the rain.',
              set: { 'lb-den-story': 'story' },
              then: [
                N(
                  'You tell a story about a den that floats away down the lane and comes back in time for tea. Ned makes you tell it twice.',
                ),
              ],
            },
            {
              id: 'listen',
              label: 'Just listen to the rain.',
              set: { 'lb-den-story': 'listen' },
              then: [
                N('Nobody says anything for a while. The rain does the talking.'),
                MAI('This is the quietest Ned has ever been.', 'soft'),
              ],
            },
            {
              id: 'drips',
              label: 'Count the drips from the gutter.',
              set: { 'lb-den-story': 'drips' },
              then: [
                N(
                  'You count drips out loud together. You get to forty-one, and then the drips go too fast and you all give up laughing.',
                ),
              ],
            },
          ],
        },
      },
    ],
    complete: {
      id: 'lb06-complete',
      lines: [
        N('The rain stops at teatime. Nobody wants to come out.'),
        AMA('Tell you what. The den can stay up. It can stay up as long as it likes.'),
        MAI('Forever?'),
        AMA('Till we need the chairs. Which, given your dad, could be a while.'),
        SAM('I’ll make more chairs.', 'soft'),
        N(
          'Ama folds a spare blanket and gives it to you. A den for your own Grove, she says, for the next rainy day.',
        ),
      ],
    },
    rewards: [
      {
        id: 'lb-blanket-den',
        kind: 'decor',
        label: 'Blanket Den',
        description:
          'Two chairs, a patchwork blanket and a peg on top. Your Nubbin naps in it when it rains.',
      },
    ],
    notes:
      'The Larkins’ front room on a rainy day. After lb06-built, play the den-door variant chosen by lb-box: lb06-door-big, ' +
      '-long or -tall (Ned’s box from LB1 becomes the den’s door; if lb-box is somehow unset, use -big). Ama is home (Saturday). ' +
      'Reward: a blanket den decor for the Grove; Nubbins prefer to nap in it during rain (ambient behaviour, no stat effect).',
  },

  // ------------------------------------------------------------------ LB7
  {
    id: 'lb07',
    code: 'LB7',
    title: 'Shadow Show',
    source: SOURCE,
    audience: 'all',
    trigger: {
      where: WHERE,
      when: after('LB6', 'an evening, after dark, when Maisie posts a ticket through your door.'),
    },
    requires: ['LB6'],
    speakers: FAMILY,
    steps: [
      {
        id: 'lb07-s1',
        goal: 'Find a torch for the shadow show.',
        hint: 'Ama thinks it is in one of the boxes from moving day. Try the box marked SHOES.',
        check: 'find:lb-torch',
        scene: {
          id: 'lb07-sheet',
          lines: [
            N(
              'Ama pegs a white bedsheet across the Larkins’ front room, from the curtain rail to the top of the bookcase.',
            ),
            MAI('It’s a theatre. Tonight only. Tickets are free, but you have to clap.'),
            NED('I’m doing a rabbit.'),
            N('Ned makes a rabbit with his fingers. It looks a lot like a hand.'),
            AMA('A shadow show needs a light. There’s a torch in one of the boxes.'),
            MAI('Which box?'),
            AMA('If I know us, the one marked SHOES.'),
          ],
        },
        done: {
          id: 'lb07-lights',
          lines: [
            N(
              'The torch is in the box marked SHOES, under the bread bin. Sam switches off the big light.',
            ),
            N(
              'The torch makes a bright circle on the sheet. Everything else in the room goes soft and dark.',
            ),
          ],
        },
      },
      {
        id: 'lb07-s2',
        goal: 'Watch the shadow show, and put on a shadow of your own.',
        hint: 'Sit on the rug in front of the sheet. When it is your turn, step into the light.',
        check: 'watch:lb-shadow-show',
        scene: {
          id: 'lb07-show',
          lines: [
            N(
              'Ned stands between the torch and the sheet and holds up his rabbit. On the sheet it is enormous, taller than the bookcase.',
            ),
            NED('A GIANT rabbit!', 'shock'),
            MAI('Go nearer the sheet, Ned.'),
            N(
              'Ned steps back towards the sheet. The rabbit shrinks and shrinks, until it is the size of a real one.',
            ),
            NED('Now it’s a baby. Where did the big one go?', 'think'),
            SAM('Walk back towards the torch, mate, and see what happens.'),
            N(
              'Ned walks to and fro, and the rabbit grows and shrinks. He could do this all night.',
            ),
            MAI('Your turn. What are you making?'),
          ],
          choices: [
            {
              id: 'bird',
              label: 'A bird, flapping.',
              set: { 'lb-shadow': 'bird' },
              then: [
                N(
                  'Your two hands flap across the sheet. Ned tries to catch the bird, and it flies over his head.',
                ),
              ],
            },
            {
              id: 'nubbin',
              label: 'Put your Nubbin in the light.',
              set: { 'lb-shadow': 'nubbin' },
              then: [
                N(
                  'Your Nubbin sees its own shape on the sheet and waves a wing. So does the shadow.',
                ),
              ],
            },
            {
              id: 'monster',
              label: 'A friendly monster.',
              set: { 'lb-shadow': 'monster' },
              then: [
                N('You make a big shadow with claws. It waves, very politely.'),
                NED('Hello, monster.', 'happy'),
              ],
            },
          ],
        },
      },
    ],
    complete: {
      id: 'lb07-complete',
      lines: [
        N(
          'The show ends with the whole family in the light at once: one big shadow with far too many arms.',
        ),
        MAI('That was the best show ever made. Clap now.'),
        N('Everyone claps. On the sheet, so do the shadows.'),
        AMA('Keep the sheet. We’ve got more sheets than beds, it turns out.', 'happy'),
        N(
          'You take home the sheet on two poles and the torch on a stand, for shows in your own Grove.',
        ),
      ],
    },
    rewards: [
      {
        id: 'lb-shadow-screen',
        kind: 'decor',
        label: 'Shadow Screen',
        description:
          'A white sheet on two poles with a torch on a stand. After dark, Nubbins that pass in front of it cast big shadows.',
      },
    ],
    notes:
      'An evening in the Larkins’ front room. The shadow on the sheet should really scale with distance from the torch (a simple ' +
      'projection of the sprite silhouette), so the child sees the size change. The torch is in the box marked SHOES, a callback ' +
      'to LB1’s kettle. Reward: a shadow-screen decor whose torch lights at dusk.',
  },

  // ------------------------------------------------------------------ LB8
  {
    id: 'lb08',
    code: 'LB8',
    title: 'Treasure Map',
    source: SOURCE,
    audience: 'all',
    trigger: {
      where: WHERE,
      when: after('LB7', 'a fine morning, when Ama has the day off and a new pen.'),
    },
    requires: ['LB7'],
    speakers: FAMILY,
    steps: [
      {
        id: 'lb08-s1',
        goal: 'Follow Ama’s map down the lane to the X.',
        hint: 'Go in order: the pond, your gate, the big oak, then six big steps to the X.',
        check: 'explore:lb-lane-map',
        scene: {
          id: 'lb08-map',
          lines: [
            N(
              'Ama spreads a sheet of paper on the kitchen table. It is a map of the lane, drawn in post-van detail.',
            ),
            AMA(
              'Every house, every gate, every pothole. I know this lane better than my own feet.',
            ),
            N(
              'There is your pond, your gate that sticks, the big oak, and a red X past the oak, by the old wall.',
            ),
            N('In one corner Ama has drawn a compass, with a fancy N at the top.'),
            AMA('Maisie hid some treasure this morning. I drew it where she told me.'),
            MAI('Follow the map. The pond first, then the gate, then the tree, then the X.'),
            NED('What’s the treasure?'),
            MAI('A secret. It’s raisins.'),
          ],
        },
        done: {
          id: 'lb08-x',
          lines: [
            N('Pond, gate, tree, then six big steps past the oak to the X. Ned digs with a spoon.'),
            N('There is nothing there but soil and one surprised worm.'),
            NED('The treasure’s gone!', 'shock'),
          ],
        },
      },
      {
        id: 'lb08-s2',
        goal: 'Find where Maisie really hid the treasure.',
        hint: 'Use the compass on Ama’s map. Maisie says it went north, along the wall.',
        check: 'find:lb-raisin-tin',
        scene: {
          id: 'lb08-moved',
          lines: [
            MAI('It’s not gone. I moved it, after Mum drew the map.', 'happy'),
            MAI('Treasure that’s exactly where the map says is too easy.'),
            NED('That’s not FAIR.', 'angry'),
            N('Ned sits down in the lane with his spoon. The worm, sensibly, leaves.'),
            MAI('It’s still close. It went north. North is the way the river comes from.'),
            N('Ned looks at you. He wants to know whose side you are on.'),
          ],
          choices: [
            {
              id: 'fair',
              label: '“Treasure hunts are meant to be a bit tricky.”',
              set: { 'lb-map-fair': 'fair' },
              then: [MAI('See? Tricky is the fun bit.'), NED('Tricky is the CROSS bit.', 'angry')],
            },
            {
              id: 'not-fair',
              label: '“A map’s a kind of promise, Maisie.”',
              set: { 'lb-map-fair': 'promise' },
              then: [
                MAI('…I suppose.', 'think'),
                N(
                  'Maisie borrows her mum’s pen and draws a small, honest X further along the wall.',
                ),
              ],
            },
            {
              id: 'ask-why',
              label: 'Ask Maisie why she moved it.',
              set: { 'lb-map-fair': 'asked' },
              then: [
                MAI(
                  'I wanted to be the one who knew something. Ned always finds things first.',
                  'soft',
                ),
              ],
            },
          ],
        },
      },
    ],
    complete: {
      id: 'lb08-complete',
      lines: [
        N(
          'The tin is under a flat stone at the foot of the wall, a few steps north. Ned finds it first, of course.',
        ),
        NED('Raisins!', 'happy'),
        N(
          'He shares them out in fours: four for Maisie, four for you, four for your Nubbin and four for him.',
        ),
        MAI('Next time I’ll tell Mum where I really put it. Probably.'),
        AMA('A map is for keeping, once you’ve used it.', 'happy'),
        N(
          'Ama puts the map in an old frame from the boxes and gives it to you. It has a second X now, in a six-year-old’s hand.',
        ),
      ],
    },
    rewards: [
      {
        id: 'lb-lane-map',
        kind: 'decor',
        label: 'Ama’s Lane Map',
        description:
          'Ama’s hand-drawn map of the lane in an old frame, with a compass in the corner and two Xs: one hers, one Maisie’s.',
      },
    ],
    notes:
      'A short walk down the lane in map order: pond, your gate (the one that sticks), the big oak, the X by the old wall. ' +
      'Show a compass rose on the map overlay with N at the top; north points up the valley, where the river comes from. ' +
      'The real tin is a few steps north of the X. Reward: the framed map as wall decor for the cottage.',
  },

  // ------------------------------------------------------------------ LB9
  {
    id: 'lb09',
    code: 'LB9',
    title: 'Café Larkin',
    source: SOURCE,
    audience: 'all',
    trigger: {
      where: WHERE,
      when: after(
        'LB8',
        'a warm afternoon, when there is a sign chalked on a tea tray at the Larkins’ gate.',
      ),
    },
    requires: ['LB8'],
    speakers: FAMILY,
    steps: [
      {
        id: 'lb09-s1',
        goal: 'Lay the café table: one plate for each person.',
        hint: 'Four people are eating: you, Sam, your Nubbin, and Ama when she gets home. Put a plate at each chair.',
        check: 'place:lb-plates:4',
        scene: {
          id: 'lb09-cafe',
          lines: [
            N('A sign is chalked on the back of a tea tray: CAFÉ LARKIN, OPEN, NUBBINS WELCOME.'),
            N(
              'The café is the garden table, with the good tablecloth on it. Ama does not know about the tablecloth yet.',
            ),
            MAI('I’m the chef. Ned’s the waiter. You’re a customer, and Dad’s a customer.'),
            SAM('I’ll be the customer who sits down. I’m very good at that.'),
            MAI('Your Nubbin’s a customer. And Mum, when she gets back from her round.'),
            MAI('We need the table laid. One plate for each person.'),
            NED('How many persons is that?', 'think'),
          ],
        },
        done: {
          id: 'lb09-laid',
          lines: [
            N(
              'Four plates, from the toy box and the kitchen: a blue one, a chipped one, a tin one, and one that is really a frisbee.',
            ),
            N(
              'Your Nubbin sits on a cushion on the fourth chair. It has been given the frisbee, and it approves.',
            ),
          ],
        },
      },
      {
        id: 'lb09-s2',
        goal: 'Order lunch at Café Larkin, and be a kind customer.',
        hint: 'Talk to Ned, the waiter. Whatever arrives, say something kind.',
        check: 'talk:lb-ned:order',
        scene: {
          id: 'lb09-order',
          lines: [
            N(
              'Ned brings a menu. It is a drawing of a cake, a drawing of a sandwich, and a drawing of something nobody can identify.',
            ),
            NED('What would you like?'),
            Y('The sandwich, please.'),
            NED('One sandwich.', 'happy'),
            N(
              'He goes into the kitchen, which is the shed, and comes back with great ceremony. On your plate is a pine cone.',
            ),
            NED('Here is your cake.'),
            N(
              'Sam ordered tea and got a stick. Your Nubbin ordered nothing and got three leaves, which it seems to like best of all.',
            ),
          ],
          choices: [
            {
              id: 'thank-and-ask',
              label: '“Thank you! Could I have the sandwich as well?”',
              set: { 'lb-cafe-reply': 'ask' },
              then: [
                NED('Oh! The sandwich! Coming right up.', 'shock'),
                N('He comes back with a second pine cone. This one, he says, is the sandwich.'),
              ],
            },
            {
              id: 'enjoy',
              label: 'Eat the pine cone with great pleasure.',
              set: { 'lb-cafe-reply': 'enjoy' },
              then: [
                N(
                  'You pretend to eat the pine cone, slowly, with your eyes closed. Ned watches every bite.',
                ),
                NED('Is it nice?'),
                Y('Best cake I’ve ever had.'),
              ],
            },
            {
              id: 'mix-up',
              label: '“Excuse me. I think there’s been a little mix-up.”',
              set: { 'lb-cafe-reply': 'mix-up' },
              then: [
                NED('Is it the wrong one?', 'sad'),
                Y('It’s a lovely cake. I ordered the sandwich, that’s all.'),
                NED('I’ll tell the chef. She’ll be cross with the kitchen, not me.'),
              ],
            },
          ],
        },
      },
    ],
    complete: {
      id: 'lb09-complete',
      lines: [
        N('Ama comes home and sits down in her post-office jacket at the fourth plate.'),
        AMA('Table for one, please. Anything that comes with tea.'),
        N(
          'Ned brings her a real cup of tea, which Sam made, and a pine cone, which Ned made. She is delighted with both.',
        ),
        AMA('Is that my good tablecloth?'),
        MAI('Café Larkin is closed now. The chef has to go.', 'shock'),
        N(
          'Later, Ama rubs the chalk off the tea tray and paints the sign properly, and gives it to you for your gate.',
        ),
      ],
    },
    rewards: [
      {
        id: 'lb-cafe-sign',
        kind: 'decor',
        label: 'Café Larkin Sign',
        description:
          'A tea tray painted CAFÉ LARKIN. NUBBINS WELCOME. Hang it by your gate or over the picnic table.',
      },
    ],
    notes:
      'The garden table at the Larkins’. Four places: you, Sam, your Nubbin, and Ama (who arrives in the complete scene). ' +
      'No real Shells or food change hands; the pine cone and stick are props. All three choices are polite ways to handle a ' +
      'wrong order; Ned is never laughed at. Reward: the painted tea-tray sign, decor.',
  },

  // ------------------------------------------------------------------ LB10
  {
    id: 'lb10',
    code: 'LB10',
    title: 'Boats',
    source: SOURCE,
    audience: 'all',
    trigger: {
      where: 'Learning Grove only: your Grove pond',
      when: after('LB9', 'a still, warm day: the Larkins come to your Grove for the first time.'),
    },
    requires: ['LB9'],
    speakers: FAMILY,
    steps: [
      {
        id: 'lb10-s1',
        goal: 'Test which of Ned’s things float in the pond.',
        hint: 'Put the cork, the leaf, the pebble and the teaspoon in the shallows one at a time.',
        check: 'collect:lb-boat-things',
        scene: {
          id: 'lb10-pond',
          lines: [
            N(
              'The Larkins come through your gate for the first time, in a line, all lifting and pushing at once.',
            ),
            MAI('We’re making boats. For your pond. We brought things.'),
            N(
              'Ned empties his pockets onto the bank: a cork, a big leaf, a pebble, and a teaspoon from the kitchen drawer.',
            ),
            SAM('That’s my good teaspoon.'),
            NED('It’s a boat now.'),
            AMA('Which ones will float, do you think? Let’s test them before we build anything.'),
          ],
        },
        done: {
          id: 'lb10-test',
          lines: [
            N(
              'One at a time, the things go in the shallows. The cork bobs, and the leaf spins and floats.',
            ),
            N('The pebble goes plop and sits on the bottom. The teaspoon goes plip and joins it.'),
            NED('The spoon’s a submarine.', 'happy'),
            SAM('The spoon is coming out, thank you.'),
          ],
        },
      },
      {
        id: 'lb10-s2',
        goal: 'Sail the boats across the Grove pond.',
        hint: 'Pick a boat and set it on the water at the reeds. The breeze does the rest.',
        check: 'place:lb-boats:pond',
        scene: {
          id: 'lb10-sail',
          lines: [
            N(
              'The boats are built on the bank: a cork with a leaf sail, a bark raft with a twig mast, and a walnut shell with a petal.',
            ),
            MAI('A race! First one across the pond wins.'),
            N('Your Nubbin wades in up to its middle, ready to help. Nubbins love the pond.'),
            AMA('Which one are you sailing?'),
          ],
          choices: [
            {
              id: 'cork',
              label: 'The cork, with the leaf sail.',
              set: { 'lb-boat': 'cork' },
              then: [N('The cork boat leans into the breeze and sets off, steady as a duck.')],
            },
            {
              id: 'raft',
              label: 'The bark raft.',
              set: { 'lb-boat': 'raft' },
              then: [
                N(
                  'The raft is slow and flat and sensible. It goes exactly where the breeze tells it.',
                ),
              ],
            },
            {
              id: 'walnut',
              label: 'The walnut shell, with Ned.',
              set: { 'lb-boat': 'walnut' },
              then: [
                N(
                  'The walnut spins in slow circles and goes nowhere at all. Ned thinks it is the best boat of the lot.',
                ),
              ],
            },
          ],
        },
      },
    ],
    complete: {
      id: 'lb10-complete',
      lines: [
        N(
          'The raft wins, in the end, by drifting. Nobody minds, because the walnut is still spinning and Ned is still cheering it.',
        ),
        N('Your Nubbin tows the walnut home, very gently, with its nose.'),
        AMA('What a pond. You’re lucky, having this on your doorstep.', 'soft'),
        SAM('My good teaspoon is still in it.'),
        N(
          'Your Nubbin dives for the teaspoon and brings it back. Sam shakes its wing, very solemnly.',
        ),
      ],
    },
    rewards: [],
    notes:
      'The Larkins visit the Grove pond (they lift and push the sticking gate, as everyone does). Sorting beat: cork and leaf ' +
      'float; pebble and a metal teaspoon sink. The boat race is cosmetic: the boats drift on the breeze; your Nubbin swims to ' +
      'help (uses the swim animation). The raft always wins. The family leave by dusk.',
  },

  // ------------------------------------------------------------------ LB11
  {
    id: 'lb11',
    code: 'LB11',
    title: 'The Big Race',
    source: SOURCE,
    audience: 'all',
    trigger: {
      where: WHERE,
      when: after('LB10', 'a breezy afternoon in the field behind the Larkins’ cottage.'),
    },
    requires: ['LB10'],
    speakers: FAMILY,
    steps: [
      {
        id: 'lb11-s1',
        goal: 'Judge five races in the field behind the Larkins’ cottage.',
        hint: 'Stand at the skipping-rope finish and watch who crosses first. Keep a tally.',
        check: 'watch:lb-five-races',
        scene: {
          id: 'lb11-course',
          lines: [
            N(
              'Maisie marks out a racecourse in the field: flowerpots for the start and a skipping rope for the finish.',
            ),
            MAI('Five races. Me, Ned and your Nubbin. You’re the judge. Dad’s the crowd.'),
            SAM('Hooray.', 'soft'),
            N(
              'Sam is lying down beside the finish line, which Maisie says still counts as a crowd.',
            ),
            MAI('Judges keep a tally. One line for every win.'),
            MAI('Ready, steady…'),
          ],
        },
        done: {
          id: 'lb11-five',
          lines: [
            N(
              'Maisie wins the first race, and the second. Your Nubbin wins the third by flapping, and the fourth by accident.',
            ),
            N('Maisie wins the fifth. Ned comes last in every one.'),
            N('After the fifth race, Ned lies face down on the grass and does not get up.'),
          ],
        },
      },
      {
        id: 'lb11-s2',
        goal: 'Help with the last race.',
        hint: 'Talk to Ned, face down in the grass, and decide how to run the last race.',
        check: 'race:lb-last-race',
        scene: {
          id: 'lb11-facedown',
          lines: [
            MAI('Come on, Ned. One more race.'),
            NED('No. I’m never racing again. I’m staying here.', 'sad'),
            N('His voice comes out muffled, straight into the grass.'),
            MAI('It’s only a game.', 'think'),
            NED('It’s only a game for WINNERS.', 'sad'),
            N(
              'Maisie looks at you. She is six, and she has won every race she has ever run, and she does not know what to do.',
            ),
            SAM('Nobody likes losing, mate. Even in a game.', 'soft'),
          ],
          choices: [
            {
              id: 'proper',
              label: 'Race properly. Ned can finish, even if he’s last.',
              set: { 'lb-race': 'proper' },
              then: [
                N(
                  'Ned gets up, slowly. He runs the whole race and comes last, but this time he runs all the way, and you cheer him over the rope.',
                ),
                NED('I came last, but I came ALL the way!', 'happy'),
              ],
            },
            {
              id: 'let-win',
              label: 'Everyone slows down so Ned wins.',
              set: { 'lb-race': 'let-win' },
              then: [
                N('Everyone jogs, Maisie very slowly and with a face. Ned wins by a mile.'),
                NED('I WON! I’m the fastest in the valley!', 'happy'),
                MAI('It wasn’t a real race.', 'angry'),
                N(
                  'Maisie says it quietly, so Ned won’t hear. Then she decides to let him have it.',
                ),
              ],
            },
            {
              id: 'hand',
              label: 'Race holding hands, all together.',
              set: { 'lb-race': 'hand' },
              then: [
                N(
                  'Maisie holds out her hand to Ned, and he takes it. You all run the last race in a line, holding hands.',
                ),
                N('Nobody wins. Everybody crosses the rope at once.'),
                MAI('That’s a draw. Draws are allowed.', 'happy'),
              ],
            },
          ],
        },
      },
    ],
    complete: {
      id: 'lb11-complete',
      lines: [
        SAM('Right. The crowd needs a sit-down.'),
        N('Sam sits up in the grass. Ned climbs into his lap with grass stuck to his face.'),
        SAM(
          'You know what I like about racing with you lot? Somebody always gets up again.',
          'soft',
        ),
        MAI('Next time I’m inventing a game where losing is the winning.', 'think'),
        N(
          'Ned picks the grass off his face one bit at a time, and gives every bit to your Nubbin.',
        ),
      ],
    },
    rewards: [],
    notes:
      'The field behind the Larkins’ cottage. Step 1 plays the five races as a short watched sequence (Maisie 3 wins, your ' +
      'Nubbin 2, Ned 0) with the tally shown on a card. Step 2 holds the line’s second big choice: in the reader band all three ' +
      'options show; the sprout band drops the choice and defaults to "hand" (see LINE_LB_EDU). lb-race is read in LB12. ' +
      'Ned’s sadness is taken seriously by everyone; nobody laughs at it.',
  },

  // ------------------------------------------------------------------ LB12
  {
    id: 'lb12',
    code: 'LB12',
    title: 'The Long Grass Campout',
    source: SOURCE,
    audience: 'all',
    trigger: {
      where: WHERE,
      when: after('LB11', 'a clear evening in late summer (Free Grove: any clear evening).'),
    },
    requires: ['LB11'],
    speakers: FAMILY,
    steps: [
      {
        id: 'lb12-s1',
        goal: 'Bring a sleeping bag to the Larkins’ long grass at dusk.',
        hint: 'Carry a sleeping bag from your cottage through the Larkins’ gate before dark.',
        check: 'carry:lb-sleeping-bag',
        scene: {
          id: 'lb12-tired',
          lines: [
            N(
              'Late summer. The evenings are long and gold, and the swallows fly low over the Larkins’ field.',
            ),
            AMA('Sam’s asleep. Before tea. On the sofa, with one shoe on.', 'soft'),
            AMA('He finished a whole table this week. He’s allowed.'),
            MAI('We need a game where Dad has to lie down.', 'think'),
            NED('Dad already lies down.'),
            MAI('A game where lying down IS the game.', 'happy'),
            N(
              'Maisie explains it at speed: sleeping bags, the long grass, everyone very still, and the first to see a star wins.',
            ),
            AMA('Camping in the garden? Go on, then. Bring your Nubbin, and a sleeping bag.'),
          ],
        },
        done: {
          id: 'lb12-arrive',
          lines: [
            N(
              'At dusk you carry your sleeping bag through the Larkins’ gate. Sam is awake now, in pyjamas, holding a torch.',
            ),
            SAM(
              'I hear there’s a game where I have to lie down. I’ve been practising all day.',
              'happy',
            ),
          ],
        },
      },
      {
        id: 'lb12-s2',
        goal: 'Lie still in the long grass and wait for the first star.',
        hint: 'Lie down with the Larkins and keep still. The stars come when they come.',
        check: 'wait:lb-first-star',
        scene: {
          id: 'lb12-waiting',
          lines: [
            N(
              'Everyone lies in a row in the long grass: Ama, Sam, Maisie, Ned, you, and your Nubbin, who is already half asleep.',
            ),
            N(
              'The sky goes from gold to pink to a deep, slow blue. A bat flickers over the hedge.',
            ),
            MAI('The rules. Nobody talks. Nobody wriggles. The first to see a star says STAR.'),
            N(
              'For a long time nobody does anything. It is the stillest the Larkins have ever been.',
            ),
            SAM('It’s winter in Brisbane now. My mum’s wearing a jumper.', 'soft'),
            NED('Why?'),
            SAM(
              'The world’s tipped a bit. While our half leans towards the sun, her half leans away. Then they swap.',
            ),
          ],
          choices: [
            {
              id: 'wish',
              label: 'Make a quiet wish for the Larkins.',
              set: { 'lb-star-wish': 'wish' },
              then: [
                N(
                  'You make a wish. You don’t say it out loud, because that is the rule with wishes.',
                ),
              ],
            },
            {
              id: 'hum',
              label: 'Hum something very quietly.',
              set: { 'lb-star-wish': 'hum' },
              then: [
                N(
                  'You hum a tune you half remember. After a while Ama hums it too, and gets the end right.',
                ),
              ],
            },
            {
              id: 'watch-nubbin',
              label: 'Watch your Nubbin fall asleep.',
              set: { 'lb-star-wish': 'nubbin' },
              then: [
                N('Your Nubbin’s emote ball dims to a soft glow, and then goes out. It is asleep.'),
              ],
            },
          ],
        },
        done: {
          id: 'lb12-star',
          lines: [
            N('Ned sees it first: one bright point over the hedge, low in the west.'),
            NED('STAR!', 'happy'),
            AMA('That might be a planet, actually. Never mind. It counts.'),
            N(
              'Then another star, and another, until there are too many to say STAR about, so everyone just looks.',
            ),
          ],
        },
      },
    ],
    complete: {
      id: 'lb12-complete',
      lines: [
        N(
          'Sam is asleep again in the long grass, with Ned asleep on his arm. Maisie is trying very hard not to be.',
        ),
        MAI('That was the best game we ever made up.', 'soft'),
        AMA('It was. Lying still together. It’s hard, and you all did it.', 'soft'),
        N('Your Nubbin is asleep in Ned’s box. Ama looks at it, and then at you.'),
        AMA('That box should stay out here for good, I think. It’s earned its place.'),
        N(
          'In the morning there is a small painted box on your doorstep with a note: FOR YOUR NUBBIN FROM NED (HE DID THE N).',
        ),
      ],
    },
    rewards: [
      {
        id: 'lb-cardboard-box',
        kind: 'decor',
        label: 'Ned’s Box (house, boat or rocket)',
        description:
          'A small painted cardboard box from Ned: a house if you chose the big box, a boat if the long one, a rocket if the tall one.',
      },
    ],
    sets: { 'lb-done': true },
    notes:
      'A clear late-summer evening in the field behind the Larkins’ cottage; the sky fades gold → pink → blue and stars appear ' +
      'one by one (the first, low in the west, may be Venus). After lb12-arrive, play lb12-ned-<lb-race> (proper | let-win | ' +
      'hand; default hand) and then lb12-box-<lb-box> (big = house, long = boat, tall = rocket; default big). If lb-star-wish = wish, ' +
      'play lb12-complete-wish in place of lb12-complete (Maisie asks whether the wish came true). Reward: the small ' +
      'decor box in the form matching lb-box. Tier 2, Learning Grove only, after lb-done: washing flaps on the Larkins’ line, ' +
      'Ned waves from their gate as you pass, and Ned’s big box sits in their garden for good as a house, boat or rocket ' +
      '(ambient art only, no dialogue). The Larkins never appear in campaign scenes and hold no lantern at the Long Night.',
  },
];

// ================================================================ variants

/** Scenes picked by the line’s own flags (lb-box, lb-race). Where each plays is in the quest notes. */
export const LINE_LB_VARIANTS: Scene[] = [
  // ---------------------------------------------------------------- LB12, in place of lb12-complete, when lb-star-wish = wish
  {
    id: 'lb12-complete-wish',
    lines: [
      N(
        'Sam is asleep again in the long grass, with Ned asleep on his arm. Maisie is trying very hard not to be.',
      ),
      MAI('That was the best game we ever made up.', 'soft'),
      MAI('Did your wish come true yet?', 'soft'),
      N('You say you can’t tell her, because that is the rule. She nods, very seriously, and falls asleep in the middle of the nod.'),
      AMA('Lying still together. It’s hard, and you all did it.', 'soft'),
      N('Your Nubbin is asleep in Ned’s box. Ama looks at it, and then at you.'),
      AMA('That box should stay out here for good, I think. It’s earned its place.'),
      N(
        'In the morning there is a small painted box on your doorstep with a note: FOR YOUR NUBBIN FROM NED (HE DID THE N).',
      ),
    ],
  },
  // ---------------------------------------------------------------- LB6, after lb06-built, by lb-box
  {
    id: 'lb06-door-big',
    lines: [
      N(
        'The big box goes on its side at the front of the den, flaps open. You can crawl through it without bending your neck.',
      ),
      NED('It’s a front door. With a roof on the door.', 'happy'),
      MAI('You have to knock first. That’s the rule.'),
    ],
  },
  {
    id: 'lb06-door-long',
    lines: [
      N(
        'The long box lies flat at the front of the den, open at both ends. You have to crawl through it like a tunnel.',
      ),
      NED('It’s a tunnel door. You have to wriggle.', 'happy'),
      N('Your Nubbin wriggles through first, gets stuck halfway, and then gets unstuck.'),
    ],
  },
  {
    id: 'lb06-door-tall',
    lines: [
      N(
        'The tall box stands at the front of the den with a hole cut low in one side. You step in, then duck down into the den.',
      ),
      NED('It’s a lift. It goes DOWN to the den.', 'happy'),
      MAI('Lifts don’t… Fine. It’s a lift.'),
    ],
  },
  // ---------------------------------------------------------------- LB12, after lb12-arrive, by lb-race
  {
    id: 'lb12-ned-proper',
    lines: [
      N('Ned arrives at a run, in his pyjamas, shouting. He has been proud of himself all week.'),
      NED('I’m here! I’m the one who came last ALL the way!', 'happy'),
      SAM('Loudest camper in the valley. Love it. Shh now.', 'soft'),
    ],
  },
  {
    id: 'lb12-ned-let-win',
    lines: [
      N(
        'Ned strolls in with his sleeping bag over his shoulder like a cape, a bit too pleased with himself.',
      ),
      NED('Make way for the fastest boy in the valley.', 'happy'),
      MAI('He’s been saying that for a week.'),
      N('Maisie lets him say it once more. Then she gives him a look, and he stops, mostly.'),
    ],
  },
  {
    id: 'lb12-ned-hand',
    lines: [
      N('Ned arrives holding Maisie’s hand. He has hardly let go of it since the race, Ama says.'),
      NED('We’re a team. Teams hold hands.', 'soft'),
      MAI('Only sometimes. But tonight, yes.'),
    ],
  },
  // ---------------------------------------------------------------- LB12, after the Ned variant, by lb-box
  {
    id: 'lb12-box-big',
    lines: [
      N(
        'Ned’s box is out in the long grass, on its side, with a tea towel for a curtain. Tonight it is a house.',
      ),
      NED('It’s our house. You can sleep in it if you’re small.'),
      N('Your Nubbin is small. It goes straight in.'),
    ],
  },
  {
    id: 'lb12-box-long',
    lines: [
      N(
        'Ned’s box lies in the long grass with a broom-handle mast and a pillowcase sail. Tonight it is a boat.',
      ),
      NED('We’re sailing to the stars. Everybody get in.'),
      N('Nobody fits but Ned and your Nubbin. Everyone else sails alongside, lying very still.'),
    ],
  },
  {
    id: 'lb12-box-tall',
    lines: [
      N(
        'Ned’s box stands in the long grass with a paper cone on top and NED ROCKET down the side. Tonight it is a rocket.',
      ),
      NED('Ten, nine… seven… one. Blast off!', 'happy'),
      N(
        'Ned lies down next to it. The rocket stays exactly where it is, which is how the best rockets work.',
      ),
    ],
  },
];

// ================================================================ checks and flags

export const LINE_LB_CHECKS: string[] = [
  'carry:lb-boxes:larkin-cottage',
  'choose:lb-ned-box',
  'give:shells:lb-ned',
  'talk:lb-maisie:turns',
  'place:lb-cushions:larkin-lawn',
  'minigame:lb-cushion-crossing',
  'visit:lb-deckchair',
  'minigame:lb-sleeping-giant',
  'escort:nubbin:lb-clinic',
  'talk:lb-ned:bandage',
  'collect:lb-den-blankets',
  'sit:lb-den',
  'find:lb-torch',
  'watch:lb-shadow-show',
  'explore:lb-lane-map',
  'find:lb-raisin-tin',
  'place:lb-plates:4',
  'talk:lb-ned:order',
  'collect:lb-boat-things',
  'place:lb-boats:pond',
  'watch:lb-five-races',
  'race:lb-last-race',
  'carry:lb-sleeping-bag',
  'wait:lb-first-star',
];

/** Every flag LB sets. None is a Grove flag; the line reads no Grove flags. */
export const LINE_LB_FLAGS: string[] = [
  'lb-moved-in', // true, LB1 complete
  'lb-box', // big | long | tall (lb01-boxes); read by lb06-door-* and lb12-box-*
  'lb-ned-shop', // swap | two | tin (lb02-turns)
  'lb-den-story', // story | listen | drips (lb06-inside)
  'lb-shadow', // bird | nubbin | monster (lb07-show)
  'lb-map-fair', // fair | promise | asked (lb08-moved)
  'lb-cafe-reply', // ask | enjoy | mix-up (lb09-order)
  'lb-boat', // cork | raft | walnut (lb10-sail)
  'lb-race', // proper | let-win | hand (lb11-facedown); read by lb12-ned-*
  'lb-star-wish', // wish | hum | nubbin (lb12-waiting)
  'lb-done', // true, LB12 complete (Tier 2 ambient)
];

// ================================================================ Learning Grove versions
//
// LB is a Learning Grove line: these are its real text. One EduScene per original scene, in
// each band (every step scene, done scene, complete scene and variant). Lessons come out of
// the game being played, never a quiz. No Bluey text appears anywhere (there are no quotes to
// replace). Sprout keeps every choice except LB11’s race choice, which is reader only
// (defaultChoice 'hand'). Reader keeps every choice. See EDU-STYLE.md.

interface Meta {
  domain: EduDomain;
  skill: string;
  standard?: string;
  parentNote: string;
}
type LessonIn = Omit<Lesson, 'id'>;

/** Lesson metadata: domain, plain skill, grown-up note, and an approved standard if one fits. */
const m = (domain: EduDomain, skill: string, parentNote: string, standard?: string): Meta =>
  standard ? { domain, skill, standard, parentNote } : { domain, skill, parentNote };

const ask = (afterLine: number, meta: Meta, prompt: Line[], options: LessonOption[]): LessonIn => ({
  ...meta,
  kind: 'ask',
  after: afterLine,
  prompt,
  options,
});
const notice = (afterLine: number, meta: Meta, lines: Line[]): LessonIn => ({
  ...meta,
  kind: 'notice',
  after: afterLine,
  lines,
});
const act = (afterLine: number, meta: Meta, check: string, lines: Line[]): LessonIn => ({
  ...meta,
  kind: 'do',
  after: afterLine,
  check,
  lines,
});
/** The answer the lesson teaches. */
const best = (label: string, ...reply: Line[]): LessonOption => ({ label, best: true, reply });
/** Any other answer, or any answer to a think question: the reply honours it or kindly teaches. */
const opt = (label: string, ...reply: Line[]): LessonOption => ({ label, reply });

const ch = (id: string, label: string, then: Line[], set?: Choice['set']): Choice =>
  set ? { id, label, set, then } : { id, label, then };

const eduScene =
  (band: EduBand) =>
  (
    of: string,
    lines: Line[],
    lessons: LessonIn[],
    choices?: Choice[],
    defaultChoice?: string,
  ): EduScene => {
    const s: EduScene = {
      id: `${band}:${of}`,
      of,
      band,
      lines,
      lessons: lessons.map((l, i) => ({ id: `${band}:${of}-l${i + 1}`, ...l })),
    };
    if (choices) s.choices = choices;
    if (defaultChoice) s.defaultChoice = defaultChoice;
    return s;
  };
const sS = eduScene('sprout');
const sR = eduScene('reader');

const eduQuest =
  (band: EduBand) =>
  (
    of: string,
    title: string,
    goals: EduQuest['goals'],
    scenes: EduScene[],
    glossary?: GlossaryEntry[],
    notes?: string,
  ): EduQuest => ({
    id: `${band}:${of}`,
    of,
    band,
    title,
    goals,
    scenes,
    ...(glossary ? { glossary } : {}),
    ...(notes ? { notes } : {}),
  });
const qS = eduQuest('sprout');
const qR = eduQuest('reader');

/** A reader glossary word, first used in the reader version of scene `of`. */
const g = (word: string, meaning: string, of: string): GlossaryEntry => ({
  word,
  meaning,
  scene: `reader:${of}`,
});

// ================================================================ sprout (ages 3–6, read aloud)

const SPROUT: EduQuest[] = [
  // ------------------------------------------------------------------ LB1
  qS(
    'lb01',
    'Boxes',
    {
      'lb01-s1': {
        goal: 'Help the new family carry their boxes inside.',
        hint: 'Pick up a box at the red van. Carry it in.',
      },
      'lb01-s2': {
        goal: 'Help Ned pick one box to keep.',
        hint: 'Talk to Ned. Choose a box together.',
      },
    },
    [
      sS(
        'lb01-van',
        [
          N('A red van stops in the lane. Beep beep!'),
          N('A new family is moving in, next door but one.'),
          AMA('Hello! I’m Ama. I drive the post van.', 'happy'),
          SAM('I’m Sam. We’re very sleepy. We got up so early!', 'soft'),
          MAI('I’m Maisie. I’m six. I make the rules.'),
          NED('I’m Ned. I’m four.'),
          N('Your Nubbin looks at Ned. Ned looks at your Nubbin. They both smile.'),
          SAM('Can you help? We have lots and lots of boxes.'),
        ],
        [
          ask(
            5,
            m(
              'literacy',
              'first sounds',
              'Your child listened for the first sound in a name: n-n-Ned, n-n-Nubbin.',
              'RF.K.2',
            ),
            [
              N('Listen. N-n-Ned. N-n-Nubbin. (Say the n sound together.)'),
              N('Which word starts the same way?'),
            ],
            [
              best('Nose', N('Yes! N-n-nose. Ned, Nubbin, nose!')),
              opt('Cat', N('C-c-cat starts with c. Listen: n-n-nose. Nose starts like Ned!')),
              opt('Sun', N('S-s-sun starts with s. N-n-nose starts like Ned!')),
            ],
          ),
        ],
      ),
      sS(
        'lb01-unpacked',
        [
          N('All the boxes are inside now. Phew!'),
          AMA('The kettle was in the shoe box. Silly us!'),
          N('Maisie and Ned look at the empty boxes. Empty boxes are the best!'),
          N('Some boxes are big. Some are middle. Some are small.'),
        ],
        [
          act(
            3,
            m(
              'maths',
              'big, middle and small',
              'Your child sorted boxes by size: big, middle and small.',
              'K.MD.A.2',
            ),
            'edu:sort:boxes:size',
            [
              N('Help Maisie line them up. Big, middle, small. (Point to each.)'),
              MAI('Big box. Middle box. Small box. Perfect!', 'happy'),
            ],
          ),
        ],
      ),
      sS(
        'lb01-boxes',
        [
          N('Ama folds the boxes flat. Fold, fold, fold.'),
          NED('Not that one!', 'shock'),
          SAM('Ned can keep one box. Just one.'),
          N('Ned climbs into a box. He is very quiet.'),
          MAI('Ned misses his old bedroom. It had stars on the ceiling.', 'soft'),
          SAM('The stars are still there, Ned. Shining for the next child.', 'soft'),
          NED('You pick a box. You’re the grown-up next door.'),
        ],
        [
          ask(
            4,
            m(
              'sel',
              'naming a feeling',
              'Your child named a feeling (sad) from what Ned did and said.',
              'CASEL: Self-awareness',
            ),
            [N('Ned is quiet. He misses his old room.'), N('How does Ned feel?')],
            [
              best(
                'Sad',
                N('Yes. Ned feels sad. A new house can feel sad at first.'),
                N('A hug, and a new box, can help.'),
              ),
              opt(
                'Happy',
                N('He likes the boxes. But his face is sad, and he is quiet.'),
                N('Ned feels a bit sad today.'),
              ),
              opt(
                'Cross',
                N('He isn’t shouting or stamping. He is quiet and missing his room.'),
                N('That is sad.'),
              ),
            ],
          ),
        ],
        [
          ch(
            'big',
            'The big box. It’s like a house!',
            [N('Ned climbs in and shuts the top.'), NED('It has a ROOF!', 'happy')],
            { 'lb-box': 'big' },
          ),
          ch(
            'long',
            'The long box. It’s like a boat!',
            [N('Ned lies down in it. He fits just right.'), NED('Shh. I’m lying down.', 'happy')],
            { 'lb-box': 'long' },
          ),
          ch(
            'tall',
            'The tall box. It goes up high!',
            [N('Ned stands in it. Only his eyes peep out.'), NED('It goes UP!', 'happy')],
            { 'lb-box': 'tall' },
          ),
        ],
      ),
      sS(
        'lb01-complete',
        [
          N('Ama writes on the box with a big pen.'),
          N('N. E. D. Ned!'),
          AMA('There. It’s Ned’s box now. Thank you for helping!', 'happy'),
          MAI('Can we borrow your Nubbin for games? We will always ask.'),
          N('Ned waves goodbye from his box. Wave, wave, wave!'),
        ],
        [
          notice(
            1,
            m(
              'literacy',
              'letters in a name',
              'Your child saw that a name is made of letters: N, E, D.',
              'ELOF: Literacy',
            ),
            [
              N('Ned has three letters. N, E, D. (Draw them in the air together.)'),
              N('What letter does your name start with?'),
            ],
          ),
        ],
      ),
    ],
  ),

  // ------------------------------------------------------------------ LB2
  qS(
    'lb02',
    'Shops',
    {
      'lb02-s1': { goal: 'Buy a leaf from Ned’s shop.', hint: 'Count 5 Shells into Ned’s hand.' },
      'lb02-s2': { goal: 'Help Maisie and Ned take turns.', hint: 'Talk to them at the shop.' },
    },
    [
      sS(
        'lb02-shop',
        [
          N('Ned has a shop on the step. It sells leaves!'),
          NED('Welcome to my shop. Everything is leaves.', 'happy'),
          Y('How much is this leaf?'),
          NED('Five Shells. No, a hundred. No, two!', 'think'),
          NED('The window leaf is five. It has a hole to look through.'),
          N('Your Nubbin sits by the till. It is a biscuit tin.'),
        ],
        [
          act(
            4,
            m(
              'maths',
              'count to 5',
              'Your child counted out 5 Shells, one at a time, to pay for a leaf.',
              'K.CC.B.5',
            ),
            'edu:count:shells:5',
            [
              N('Count five Shells into Ned’s hand. One, two, three, four, five!'),
              NED('Five! Thank you!', 'happy'),
            ],
          ),
        ],
        [
          ch('pay', 'Five Shells it is.', [NED('Put them in my hand, please.')]),
          ch('discount', 'Is it cheaper today?', [
            NED('Yes. It’s six!', 'happy'),
            N('Six is more than five. Silly Ned!'),
          ]),
          ch('nubbin', 'Can my Nubbin have one too?', [
            NED('Nubbins get leaves for free.'),
            N('Your Nubbin holds its leaf up like a flag.'),
          ]),
        ],
      ),
      sS(
        'lb02-bought',
        [
          N('Ned puts the Shells in the tin. Clink, clink, clink.'),
          NED('And here is your change!'),
          N('He gives you all five back. Ned loves giving change.'),
          N('So in Ned’s shop, you always get your Shells back.'),
        ],
        [
          ask(
            0,
            m(
              'literacy',
              'rhyming words',
              'Your child heard words that rhyme with shop.',
              'RF.K.2',
            ),
            [N('Shop. Shop. What rhymes with shop?')],
            [
              best('Hop', N('Yes! Shop, hop! Can you hop? Hop, hop, hop!')),
              opt('Leaf', N('Leaf doesn’t rhyme with shop. Listen: shop, hop. Hop rhymes!')),
            ],
          ),
        ],
      ),
      sS(
        'lb02-turns',
        [
          N('Maisie comes out with a sign. It says SHOP TOO.'),
          MAI('My turn to be the shopkeeper!'),
          NED('It’s MY shop!', 'angry'),
          N('Ned holds the tin tight. Maisie folds her arms.'),
          SAM('Can two shopkeepers work this out?'),
          MAI('Ned could be the customer. Customers are important too.'),
        ],
        [
          notice(
            3,
            m(
              'sel',
              'taking turns',
              'Your child heard how taking turns lets two people share one thing.',
              'ELOF: Social and Emotional Development',
            ),
            [
              N('Both children want the shop. That’s hard!'),
              N('Taking turns helps. First Ned, then Maisie. Then Ned again!'),
            ],
          ),
        ],
        [
          ch('swap-sale', 'Ned sells one thing, then swap.', [MAI('One each. Fine!')], {
            'lb-ned-shop': 'swap',
          }),
          ch(
            'two-shops',
            'Two shops, side by side!',
            [N('Now there are two shops. You can buy from both!')],
            { 'lb-ned-shop': 'two' },
          ),
          ch(
            'tin-turns',
            'Whoever sells holds the tin.',
            [NED('And then I get it back?'), MAI('Then you get it back.')],
            { 'lb-ned-shop': 'tin' },
          ),
        ],
      ),
      sS(
        'lb02-complete',
        [
          N('Maisie sells. Ned buys. Guess what?'),
          NED('Buying is ALSO fun!', 'happy'),
          N('He buys the window leaf six times!'),
          SAM('Two shopkeepers, one tin, and everyone happy. Hooray!'),
          N('Ned gives you a leaf for free. You are his best customer.'),
        ],
        [
          ask(
            1,
            m(
              'sel',
              'asking for a turn',
              'Your child practised a kind way to ask for a turn.',
              'CASEL: Relationship skills',
            ),
            [N('What can you say when you want a turn?')],
            [
              best('“Can I have a turn, please?”', MAI('That’s how I’ll ask next time!', 'happy')),
              opt(
                '“Give it to me!”',
                N('That might make Ned sad.'),
                N('Try: “Can I have a turn, please?”'),
              ),
            ],
          ),
        ],
      ),
    ],
  ),

  // ------------------------------------------------------------------ LB3
  qS(
    'lb03',
    'Don’t Touch the Grass',
    {
      'lb03-s1': {
        goal: 'Put the cushions in a line on the grass.',
        hint: 'Carry the cushions to the lawn.',
      },
      'lb03-s2': { goal: 'Cross the grass on the cushions.', hint: 'Hop from cushion to cushion!' },
    },
    [
      sS(
        'lb03-rules',
        [
          N('All the cushions are on the lawn. So is Sam!'),
          N('Sam is lying in the long grass.'),
          MAI('The grass is a pond. Only stand on cushions!'),
          MAI('A tickly monster lives in the pond.'),
          N('A hand waves in the grass. Wiggle, wiggle.'),
          SAM('Bloop!'),
          NED('That’s Dad! But he’s pretending.', 'happy'),
        ],
        [
          ask(
            1,
            m(
              'maths',
              'position words',
              'Your child used a position word (beside) to say where Sam is.',
              'K.G.A.1',
            ),
            [N('Look! Where is Sam? (Point to the cushion and the grass.)')],
            [
              best('Beside the cushion', N('Yes! Sam is beside the cushion, in the grass.')),
              opt(
                'On the cushion',
                N('Look again. He isn’t on it. He is beside it, in the grass.'),
              ),
            ],
          ),
        ],
      ),
      sS(
        'lb03-laid',
        [
          N('The cushions make a wobbly path. Plop, plop, plop.'),
          N('One gap is very big!'),
          MAI('The big gap is the hard bit.'),
        ],
        [
          act(
            0,
            m(
              'literacy',
              'clapping syllables',
              'Your child clapped the two beats in “cushion”.',
              'RF.K.2',
            ),
            'edu:clap:syllables:cushion',
            [N('Clap it with me. Cush-ion. Two claps!'), N('Now pil-low. Two claps again!')],
          ),
        ],
      ),
      sS(
        'lb03-crossing',
        [
          N('Maisie hops across. Hop, hop, hop!'),
          N('Ned stops at the big gap.'),
          NED('It’s too far. My legs are small.', 'sad'),
          N('Two tickly fingers wiggle in the grass.'),
          MAI('You can do it, Ned!'),
        ],
        [
          act(
            0,
            m(
              'health',
              'hopping and tiptoeing',
              'Your child moved like the game: hopping, then tiptoeing.',
              'ELOF: Perceptual, Motor, and Physical Development',
            ),
            'edu:move:hop:tiptoe',
            [
              N('Stand up! Hop like Maisie. Hop, hop, hop!'),
              N('Now tiptoe, very quietly, so the monster doesn’t hear.'),
            ],
          ),
        ],
        [
          ch('extra-cushion', 'Put one more cushion in the gap.', [
            MAI('That’s allowed! Islands can grow.'),
          ]),
          ch('hold-hand', 'Hold out a hand for Ned.', [
            N('Ned holds your hand and jumps.'),
            NED('I did a huge one!', 'happy'),
          ]),
          ch('nubbin-first', 'Let your Nubbin show him.', [
            N('Your Nubbin flaps and bounces over. Ned copies, flaps and all!'),
          ]),
        ],
      ),
      sS(
        'lb03-complete',
        [
          N('Everyone gets to the fence. Then everyone goes back!'),
          N('The tickly fingers catch Ned’s foot. He falls in the grass, laughing.'),
          SAM('Got one! Now the pond monster wants a cup of tea.'),
          N('Ned makes pretend tea in a flowerpot.'),
          N('Sam drinks every pretend drop. Slurp!'),
        ],
        [
          ask(
            3,
            m(
              'literacy',
              'pretend play',
              'Your child joined the pretend game by imagining a drink for the pond monster.',
              'ELOF: Approaches to Learning',
            ),
            [N('What pretend drink would you make for the pond monster?')],
            [
              opt('Pond tea', SAM('Lovely and green. Slurp!', 'happy')),
              opt('Puddle juice', SAM('My favourite! Slurp!', 'happy')),
              opt('Something else', N('Tell Sam what it is. He will drink it all up!')),
            ],
          ),
        ],
      ),
    ],
  ),

  // ------------------------------------------------------------------ LB4
  qS(
    'lb04',
    'Sleeping Giant',
    {
      'lb04-s1': {
        goal: 'Find the sleeping giant.',
        hint: 'Look in the deckchair under the apple tree.',
      },
      'lb04-s2': {
        goal: 'Creep up on the giant. Freeze when he looks!',
        hint: 'Slow feet, quiet feet.',
      },
    },
    [
      sS(
        'lb04-giant',
        [
          N('Sam is asleep in a deckchair. Snore, snore.'),
          MAI('Shh! He’s the giant. He guards the treasure.'),
          N('The treasure is one biscuit, next to his hand.'),
          NED('He made two chairs this week. Giants get tired.', 'soft'),
          MAI('Creep up. If he looks, freeze like a statue!'),
        ],
        [
          notice(
            3,
            m(
              'health',
              'why we need sleep',
              'Your child heard that everyone, grown-ups too, needs rest to stay well.',
              'K-LS1-1',
            ),
            [
              N('Sam worked hard, so he is tired.'),
              N('Everybody needs sleep. Children, grown-ups and Nubbins too!'),
            ],
          ),
        ],
      ),
      sS(
        'lb04-start',
        [
          N('Everyone lines up by the gate.'),
          N('Your Nubbin lines up too. It loves a line!'),
          SAM('Fee. Fi. Hmm. Fo.', 'soft'),
          MAI('That means go!'),
        ],
        [
          notice(
            2,
            m(
              'literacy',
              'first sounds',
              'Your child heard that fee, fi and fo all start with the same sound, f.',
              'RF.K.2',
            ),
            [
              N('Fee, fi, fo. They all start with f-f-f!'),
              N('Blow a little f sound. Fffff. Like wind.'),
            ],
          ),
        ],
      ),
      sS(
        'lb04-creep',
        [
          N('Maisie runs fast. Sam turns his head!'),
          SAM('I see a Maisie! Back you go.'),
          N('Ned goes slowly. Slow feet, quiet feet.'),
          N('Sam turns. Ned freezes. He is a statue!'),
          SAM('Hmm. Just a little garden statue.'),
        ],
        [
          act(
            2,
            m(
              'sel',
              'slowing down',
              'Your child practised moving slowly and stopping still: calm control of the body.',
              'CASEL: Self-management',
            ),
            'edu:order:steps:slow',
            [
              N('Your turn! Slow feet, quiet feet. Now FREEZE!'),
              N('Great statue! Slow and careful wins this game.'),
            ],
          ),
        ],
        [
          ch('slow', 'Go slow, like Ned.', [N('Tiny steps. The grass hardly moves.')]),
          ch('fast', 'Try a quick dash.', [SAM('I see you! Back you go.'), MAI('Slow is best!')]),
          ch('nubbin-creep', 'Send your Nubbin first.', [
            N('Your Nubbin walks right up and sits by Sam’s feet. Ha!'),
          ]),
        ],
      ),
      sS(
        'lb04-complete',
        [
          N('Step by step, Ned reaches the chair.'),
          N('He puts one finger on the biscuit.'),
          NED('Got it!', 'happy'),
          SAM('Beaten by the smallest statue. One more go?'),
          N('Ned breaks the biscuit. One piece for each player.'),
        ],
        [
          act(
            4,
            m(
              'maths',
              'one for each',
              'Your child matched one biscuit piece to each of four players.',
              'K.CC.B.4',
            ),
            'edu:count:biscuit:4',
            [
              N('Ned, Maisie, you and your Nubbin. Count the players. One, two, three, four!'),
              N('Four players, four pieces. One each!'),
            ],
          ),
        ],
      ),
    ],
  ),

  // ------------------------------------------------------------------ LB5
  qS(
    'lb05',
    'Nubbin Doctor',
    {
      'lb05-s1': {
        goal: 'Take your Nubbin to Maisie’s pretend clinic.',
        hint: 'Walk to the shed. Your Nubbin is not ill. It is playing!',
      },
      'lb05-s2': { goal: 'Help Ned with the bandage, kindly.', hint: 'Talk to Ned at the bed.' },
    },
    [
      sS(
        'lb05-clinic',
        [
          N('Maisie has a pretend doctor’s in the shed.'),
          MAI('Next patient, please!'),
          N('Your Nubbin lies on the bed. It is not ill. It is playing!'),
          NED('I’m the nurse. Here are the bandages.'),
          N('Ned holds up a roll of toilet paper. Ta-da!'),
        ],
        [
          notice(
            2,
            m(
              'science',
              'what living things need',
              'Your child heard what a Nubbin, like any animal, needs: food, water, rest and love.',
              'K-LS1-1',
            ),
            [
              MAI('Doctors ask: are you eating? Drinking? Sleeping? Getting cuddles?'),
              N('Food, water, rest, cuddles. Count them on your fingers: four!'),
            ],
          ),
        ],
      ),
      sS(
        'lb05-checkup',
        [
          N('Maisie listens to your Nubbin’s tummy with a funnel.'),
          MAI('Good heart. Good ears. Small wings, but that’s normal.'),
          Y('It’s very well, doctor.'),
        ],
        [
          act(
            0,
            m(
              'science',
              'feeling a heartbeat',
              'Your child felt their own heartbeat, like a doctor listening.',
              'ELOF: Scientific Reasoning',
            ),
            'edu:feel:heartbeat',
            [
              N('Put your hand on your chest. Can you feel thump, thump?'),
              N('That’s your heart. It works all day and all night.'),
            ],
          ),
        ],
      ),
      sS(
        'lb05-bandage',
        [
          MAI('The patient has a sore left foot. Bandage, please!'),
          N('Ned wraps the other foot. Oops!'),
          N('Maisie wants to say “wrong!” Then she sees Ned’s face.'),
          MAI('How can we tell Ned kindly?', 'think'),
        ],
        [
          ask(
            3,
            m(
              'sel',
              'kind words',
              'Your child thought about telling a friend about a mistake kindly.',
              'CASEL: Social awareness',
            ),
            [N('Ned is trying very hard. What could we say?')],
            [
              best(
                '“Great bandage! Can this foot have one too?”',
                NED('Two bandages!', 'happy'),
                N('Kind words help Ned feel good.'),
              ),
              opt(
                '“Wrong foot, silly!”',
                N('That might make Ned sad.'),
                N('We can be kind: “Great bandage! This foot too?”'),
              ),
            ],
          ),
        ],
        [
          ch('other-foot', '“Lovely! Can this foot have one too?”', [
            NED('Two bandages!', 'happy'),
          ]),
          ch('ask-ned', '“Which foot did the doctor say?”', [
            N('Ned looks at his own feet. He works it out!'),
          ]),
          ch('nubbin-points', 'Let your Nubbin wiggle the sore foot.', [
            N('Wiggle, wiggle. Ned gasps. The patient told him!'),
          ]),
        ],
      ),
      sS(
        'lb05-complete',
        [
          N('Your Nubbin walks home in two toilet-paper boots!'),
          NED('It was a very brave patient.', 'soft'),
          MAI('Dad, you need more sleep. Have a nap!'),
          SAM('The best medicine!', 'happy'),
        ],
        [
          notice(
            1,
            m(
              'literacy',
              'the word brave',
              'Your child learned a feeling word: brave.',
              'ELOF: Language and Communication',
            ),
            [
              N('Brave means you keep going, even when it’s a bit scary.'),
              N('When were you brave?'),
            ],
          ),
        ],
      ),
    ],
  ),

  // ------------------------------------------------------------------ LB6
  qS(
    'lb06',
    'Den Day',
    {
      'lb06-s1': {
        goal: 'Find chairs and blankets for a den.',
        hint: 'Blankets are in the cupboard. Chairs are in the shed.',
      },
      'lb06-s2': { goal: 'Sit in the den and listen to the rain.', hint: 'Crawl in and sit down.' },
    },
    [
      sS(
        'lb06-rain',
        [
          N('Rain, rain, all day long. Pitter-patter!'),
          MAI('Yesterday was sunny. Today is rainy. Not fair!'),
          AMA('No work today. Shall we make a den?'),
          NED('DEN!', 'happy'),
        ],
        [
          ask(
            1,
            m(
              'science',
              'weather changes',
              'Your child compared yesterday’s weather with today’s.',
              'K-ESS2-1',
            ),
            [N('Yesterday was sunny. What is the weather today?')],
            [
              best('Rainy', N('Yes! Rainy today. Weather can change from day to day.')),
              opt('Sunny', N('That was yesterday. Look out of the window. Today is rainy!')),
            ],
          ),
        ],
      ),
      sS(
        'lb06-built',
        [
          N('Chairs, blankets, a sheet on top. Pegs hold it.'),
          N('Everyone helps. The den goes up!'),
          AMA('Every den needs a door.'),
          N('Ned pulls his box across the rug.'),
        ],
        [
          notice(
            1,
            m(
              'sel',
              'working together',
              'Your child heard how everyone helping makes a big job easy.',
              'ELOF: Social and Emotional Development',
            ),
            [
              N('Ama holds. Maisie pegs. Sam brings chairs.'),
              N('When everyone helps, big jobs get easy!'),
            ],
          ),
        ],
      ),
      sS(
        'lb06-inside',
        [
          N('Inside the den it is blue and cosy.'),
          N('The rain goes tap, tap, tap.'),
          MAI('The roof is a triangle. The cushion is a square.'),
          NED('And Mum’s head is a circle!'),
          N('Your Nubbin curls up on Ned’s feet.'),
        ],
        [
          act(
            3,
            m(
              'maths',
              'naming shapes',
              'Your child found a triangle, a square and a circle in the den.',
              'K.G.A.2',
            ),
            'edu:tap:shape:triangle',
            [
              N('Find the triangle. Now the square. Now the circle! (Point together.)'),
              MAI('Shapes everywhere!', 'happy'),
            ],
          ),
        ],
        [
          ch(
            'story',
            'Tell a story about a den.',
            [N('A den floats down the lane, then comes home for tea!')],
            { 'lb-den-story': 'story' },
          ),
          ch('listen', 'Listen to the rain.', [N('Shh. Tap, tap, tap. The rain is talking.')], {
            'lb-den-story': 'listen',
          }),
          ch(
            'drips',
            'Count the drips.',
            [N('One drip, two drips, three drips… too many! Everyone laughs.')],
            { 'lb-den-story': 'drips' },
          ),
        ],
      ),
      sS(
        'lb06-complete',
        [
          N('The rain stops. Nobody wants to come out!'),
          AMA('The den can stay up.'),
          N('Ama gives you a blanket. Now you can make a den too!'),
          Y('Thank you, Ama!'),
        ],
        [
          notice(
            2,
            m(
              'sel',
              'saying thank you',
              'Your child noticed saying thank you when someone shares.',
              'CASEL: Relationship skills',
            ),
            [
              N('Ama shared a blanket. What do we say?'),
              N('Thank you! Saying thank you makes people feel good.'),
            ],
          ),
        ],
      ),
    ],
  ),

  // ------------------------------------------------------------------ LB7
  qS(
    'lb07',
    'Shadow Show',
    {
      'lb07-s1': {
        goal: 'Find a torch for the shadow show.',
        hint: 'Look in the box that says SHOES.',
      },
      'lb07-s2': {
        goal: 'Watch the shadow show. Make a shadow too!',
        hint: 'Step into the light.',
      },
    },
    [
      sS(
        'lb07-sheet',
        [
          N('Ama hangs a big white sheet in the front room.'),
          MAI('It’s a show! You have to clap at the end.'),
          NED('I’m making a rabbit.'),
          N('Ned makes a rabbit with his fingers.'),
          AMA('We need a torch. It’s in a box somewhere.'),
        ],
        [
          act(
            3,
            m(
              'literacy',
              'clapping syllables',
              'Your child clapped the two beats in “rabbit”.',
              'RF.K.2',
            ),
            'edu:clap:syllables:rabbit',
            [N('Clap it. Rab-bit. Two claps!'), N('Now torch. Just one clap!')],
          ),
        ],
      ),
      sS(
        'lb07-lights',
        [
          N('The torch is in the SHOES box! Silly place.'),
          N('Sam turns off the big light. Click.'),
          N('The room goes dark. The torch makes a bright circle.'),
        ],
        [
          notice(
            2,
            m(
              'science',
              'light helps us see',
              'Your child noticed that we need light to see things.',
              '1-PS4-2',
            ),
            [N('In the dark, it’s hard to see.'), N('Light helps us see. The torch makes light!')],
          ),
        ],
      ),
      sS(
        'lb07-show',
        [
          N('Ned holds his rabbit near the torch.'),
          N('On the sheet, the rabbit is HUGE!'),
          NED('A giant rabbit!', 'shock'),
          N('Ned walks to the sheet. The rabbit gets small.'),
          NED('Now it’s a baby rabbit!', 'happy'),
          MAI('Your turn! What shadow will you make?'),
        ],
        [
          act(
            4,
            m(
              'science',
              'shadow size',
              'Your child saw that a shadow is bigger when the hand is closer to the torch.',
              '1-PS4-2',
            ),
            'edu:order:shadows:size',
            [
              N('Close to the torch: big shadow. Close to the sheet: small shadow.'),
              N('Try it with your hand and a torch at home!'),
            ],
          ),
        ],
        [
          ch('bird', 'A flapping bird.', [N('Flap, flap! Ned tries to catch it.')], {
            'lb-shadow': 'bird',
          }),
          ch('nubbin', 'Your Nubbin!', [N('Your Nubbin waves a wing. The shadow waves too!')], {
            'lb-shadow': 'nubbin',
          }),
          ch(
            'monster',
            'A friendly monster.',
            [N('A big shadow monster waves hello.'), NED('Hello, monster!', 'happy')],
            { 'lb-shadow': 'monster' },
          ),
        ],
      ),
      sS(
        'lb07-complete',
        [
          N('Everyone steps into the light at once.'),
          N('One big shadow with lots and lots of arms!'),
          MAI('Best show ever. Clap now!'),
          N('Clap, clap, clap!'),
          AMA('Take the sheet home. Make shows in your Grove!', 'happy'),
        ],
        [
          act(
            3,
            m(
              'sel',
              'showing you enjoyed something',
              'Your child clapped to show Maisie and Ned they enjoyed the show.',
              'CASEL: Relationship skills',
            ),
            'edu:clap:show',
            [
              N('Clap for Maisie and Ned! Clapping says “I liked it!”'),
              MAI('Thank you, thank you!', 'happy'),
            ],
          ),
        ],
      ),
    ],
  ),

  // ------------------------------------------------------------------ LB8
  qS(
    'lb08',
    'Treasure Map',
    {
      'lb08-s1': { goal: 'Follow Ama’s map to the X.', hint: 'Pond, gate, tree, X.' },
      'lb08-s2': {
        goal: 'Find where Maisie really hid the treasure.',
        hint: 'Look a little way along the wall.',
      },
    },
    [
      sS(
        'lb08-map',
        [
          N('Ama draws a map of the lane.'),
          N('There is the pond, the gate, the big tree, and an X!'),
          AMA('Maisie hid some treasure. X marks the spot.'),
          MAI('Pond first. Then gate. Then tree. Then X!'),
          NED('What’s the treasure?'),
          MAI('A secret. It’s raisins!'),
        ],
        [
          act(
            3,
            m(
              'social-studies',
              'following a map',
              'Your child followed the map in order: pond, gate, tree, X.',
              'D2.Geo.2.K-2',
            ),
            'edu:order:map:lane',
            [
              N('Point on the map. Pond. Gate. Tree. X!'),
              N('A map shows a place from up high, like a bird sees it.'),
            ],
          ),
        ],
      ),
      sS(
        'lb08-x',
        [
          N('Six big steps past the tree. Here’s the X!'),
          N('Ned digs with a spoon. Dig, dig, dig.'),
          N('Nothing! Just soil and a wiggly worm.'),
          NED('The treasure’s gone!', 'shock'),
        ],
        [
          act(
            0,
            m('maths', 'count to 6', 'Your child counted six big steps.', 'K.CC.B.5'),
            'edu:count:steps:6',
            [N('Take six big steps with Ned. One, two, three, four, five, six!')],
          ),
        ],
      ),
      sS(
        'lb08-moved',
        [
          MAI('I moved it! Treasure should be tricky.', 'happy'),
          NED('That’s not FAIR!', 'angry'),
          N('Ned sits down in the lane. He feels cross.'),
          MAI('It’s close by. Look along the wall.'),
        ],
        [
          ask(
            2,
            m(
              'literacy',
              'thinking about fairness in a story',
              'Your child thought about whether Maisie’s trick was fair, and why.',
              'RL.K.3',
            ),
            [N('Maisie moved the treasure. Was that fair?')],
            [
              opt('Fair. It’s a fun trick.', MAI('Tricky is the fun bit!')),
              opt(
                'Not fair. The map said X.',
                NED('Yes! The map said X!'),
                N('A map is like a promise.'),
              ),
              opt(
                'Let’s ask Maisie why.',
                MAI('I wanted to know a secret. Ned always finds things first.', 'soft'),
              ),
            ],
          ),
        ],
        [
          ch('fair', '“Treasure hunts can be tricky.”', [MAI('See? Tricky is fun!')], {
            'lb-map-fair': 'fair',
          }),
          ch(
            'not-fair',
            '“A map is a promise, Maisie.”',
            [N('Maisie draws a new X. A true one.')],
            { 'lb-map-fair': 'promise' },
          ),
          ch('ask-why', 'Ask Maisie why.', [MAI('Ned always finds things first.', 'soft')], {
            'lb-map-fair': 'asked',
          }),
        ],
      ),
      sS(
        'lb08-complete',
        [
          N('There’s the tin, under a flat stone!'),
          NED('Raisins!', 'happy'),
          N('Ned shares them out. Four for each.'),
          AMA('Keep the map. Maps are for keeping!', 'happy'),
        ],
        [
          act(
            2,
            m(
              'maths',
              'count to 4',
              'Your child counted four raisins for each person.',
              'K.CC.B.5',
            ),
            'edu:count:raisins:4',
            [N('Count four raisins. One, two, three, four. Yum!')],
          ),
        ],
      ),
    ],
  ),

  // ------------------------------------------------------------------ LB9
  qS(
    'lb09',
    'Café Larkin',
    {
      'lb09-s1': {
        goal: 'Put one plate for each person.',
        hint: 'Four people are eating. Four plates!',
      },
      'lb09-s2': { goal: 'Order lunch from Ned the waiter.', hint: 'Be kind, whatever comes!' },
    },
    [
      sS(
        'lb09-cafe',
        [
          N('There’s a café in the garden. Café Larkin!'),
          MAI('I’m the cook. Ned is the waiter.'),
          MAI('You and Dad and your Nubbin are eating. And Mum, later.'),
          MAI('One plate for each person, please.'),
          NED('How many persons?', 'think'),
        ],
        [
          act(
            4,
            m(
              'maths',
              'one for each',
              'Your child set one plate for each of four people, matching one to one.',
              'K.CC.B.4',
            ),
            'edu:count:plates:4',
            [N('You, Sam, your Nubbin, Ama. One plate each. Count: one, two, three, four!')],
          ),
        ],
      ),
      sS(
        'lb09-laid',
        [
          N('Four plates! A blue one, a white one, a shiny one…'),
          N('…and one that is really a frisbee!'),
          N('Your Nubbin gets the frisbee. It likes it.'),
        ],
        [
          ask(
            0,
            m('art', 'naming colours', 'Your child named a colour on the café table.'),
            [N('One plate is blue. Can you find something blue near you?')],
            [
              opt('I found one!', N('Well spotted! Blue like the sky.')),
              opt('Not yet', N('Look for the sky, a cup, or a sock!')),
            ],
          ),
        ],
      ),
      sS(
        'lb09-order',
        [
          NED('What would you like?'),
          Y('A sandwich, please.'),
          N('Ned brings you… a pine cone!'),
          NED('Here is your cake.'),
          N('Oops! Ned got it wrong. But he tried very hard.'),
        ],
        [
          ask(
            4,
            m(
              'literacy',
              'kind words in a talk',
              'Your child chose kind words for when someone gets something wrong.',
              'SL.K.1',
            ),
            [N('What could you say to Ned?')],
            [
              best('“Thank you! Could I have the sandwich too?”', NED('Coming right up!', 'happy')),
              opt(
                '“That’s wrong!”',
                N('Ned might feel sad.'),
                N('Try “Thank you! Could I have the sandwich too?”'),
              ),
            ],
          ),
        ],
        [
          ch(
            'thank-and-ask',
            '“Thank you! And the sandwich too?”',
            [NED('The sandwich! Coming up!', 'shock')],
            { 'lb-cafe-reply': 'ask' },
          ),
          ch(
            'enjoy',
            'Pretend to eat the pine cone.',
            [N('Munch, munch. You smile.'), Y('Best cake ever!')],
            { 'lb-cafe-reply': 'enjoy' },
          ),
          ch(
            'mix-up',
            '“I think there’s a little mix-up.”',
            [Y('It’s a lovely cake. I asked for a sandwich.'), NED('I’ll tell the cook!')],
            {
              'lb-cafe-reply': 'mix-up',
            },
          ),
        ],
      ),
      sS(
        'lb09-complete',
        [
          N('Ama comes home. She sits at the fourth plate.'),
          N('Ned brings her tea and a pine cone.'),
          AMA('Thank you! How lovely!', 'happy'),
          N('Ama gives you the café sign for your gate.'),
        ],
        [
          notice(
            2,
            m(
              'sel',
              'being a kind customer',
              'Your child saw how saying thank you made Ned proud.',
              'CASEL: Relationship skills',
            ),
            [
              N('Ama said thank you. Look at Ned’s big smile!'),
              N('Kind words make people feel proud.'),
            ],
          ),
        ],
      ),
    ],
  ),

  // ------------------------------------------------------------------ LB10
  qS(
    'lb10',
    'Boats',
    {
      'lb10-s1': {
        goal: 'Find out which things float.',
        hint: 'Put each thing in the pond. Float or sink?',
      },
      'lb10-s2': {
        goal: 'Sail the boats on your pond.',
        hint: 'Pick a boat. Put it on the water.',
      },
    },
    [
      sS(
        'lb10-pond',
        [
          N('The Larkins come to your pond!'),
          MAI('We’re making boats!'),
          N('Ned has a cork, a leaf, a pebble and a spoon.'),
          SAM('That’s my spoon!'),
          AMA('Which ones will float? Let’s guess first.'),
        ],
        [
          ask(
            4,
            m(
              'science',
              'guessing before testing',
              'Your child made a guess before testing, like a scientist.',
              'ELOF: Scientific Reasoning',
            ),
            [N('Will the pebble float or sink? What do you think?')],
            [
              opt('Float', N('Good guess! Let’s test it and see.')),
              opt('Sink', N('Good guess! Let’s test it and see.')),
            ],
          ),
        ],
      ),
      sS(
        'lb10-test',
        [
          N('The cork bobs. It floats!'),
          N('The leaf spins. It floats!'),
          N('The pebble goes plop. It sinks.'),
          N('The spoon goes plip. It sinks too.'),
          NED('The spoon’s a submarine!', 'happy'),
        ],
        [
          act(
            3,
            m(
              'maths',
              'sort and count',
              'Your child sorted things into floats and sinks, then counted each group.',
              'K.MD.B.3',
            ),
            'edu:sort:boats:float',
            [
              N('Floats: cork, leaf. That’s two. Sinks: pebble, spoon. Two again!'),
              N('Two float. Two sink.'),
            ],
          ),
        ],
      ),
      sS(
        'lb10-sail',
        [
          N('Now there are three boats.'),
          N('A cork boat, a bark raft, and a walnut boat.'),
          MAI('A race across the pond!'),
          N('Your Nubbin wades in to help. Splash!'),
          AMA('Which boat will you sail?'),
        ],
        [
          notice(
            2,
            m(
              'science',
              'wind pushes',
              'Your child noticed that the wind pushes the boats along.',
              'ELOF: Scientific Reasoning',
            ),
            [
              N('Blow on your hand. Feel that? That’s a push.'),
              N('The wind pushes the sails, just like that!'),
            ],
          ),
        ],
        [
          ch('cork', 'The cork boat.', [N('Off it goes, like a little duck!')], {
            'lb-boat': 'cork',
          }),
          ch('raft', 'The bark raft.', [N('Slow and steady. Off it goes.')], { 'lb-boat': 'raft' }),
          ch('walnut', 'The walnut, with Ned.', [N('Round and round it spins! Ned loves it.')], {
            'lb-boat': 'walnut',
          }),
        ],
      ),
      sS(
        'lb10-complete',
        [
          N('The raft wins! Slow and steady.'),
          N('The walnut is still spinning. Ned still cheers.'),
          N('Your Nubbin dives for Sam’s spoon. Splash!'),
          SAM('My spoon! Thank you, Nubbin.', 'happy'),
        ],
        [
          ask(
            1,
            m(
              'sel',
              'enjoying a game, win or lose',
              'Your child thought about having fun even when your boat doesn’t win.',
              'CASEL: Self-management',
            ),
            [N('Ned’s boat didn’t win. Is Ned sad?')],
            [
              best('No, he’s having fun!', N('Yes! Ned is cheering. Games are fun, win or lose.')),
              opt('Yes', N('Look, he’s cheering! He’s having fun anyway.')),
            ],
          ),
        ],
      ),
    ],
  ),

  // ------------------------------------------------------------------ LB11
  qS(
    'lb11',
    'The Big Race',
    {
      'lb11-s1': { goal: 'Watch five races. Who wins?', hint: 'Stand at the finish rope.' },
      'lb11-s2': { goal: 'Help Ned with the last race.', hint: 'Talk to Ned in the grass.' },
    },
    [
      sS(
        'lb11-course',
        [
          N('Maisie makes a racetrack in the field.'),
          MAI('Five races! You’re the judge.'),
          SAM('And I’m the crowd. Hooray!', 'soft'),
          N('Sam is lying down. Maisie says that counts.'),
          MAI('Ready, steady…'),
        ],
        [
          act(
            1,
            m(
              'maths',
              'count to 5',
              'Your child showed five on their fingers for five races.',
              'K.CC.B.5',
            ),
            'edu:count:races:5',
            [N('Five races! Hold up five fingers. One, two, three, four, five!')],
          ),
        ],
      ),
      sS(
        'lb11-five',
        [
          N('Maisie wins. Then Maisie wins again.'),
          N('Your Nubbin wins two races, flap flap!'),
          N('Ned comes last every time.'),
          N('Ned lies face down in the grass.'),
        ],
        [
          notice(
            3,
            m(
              'sel',
              'naming big feelings',
              'Your child named how Ned feels after losing.',
              'CASEL: Self-awareness',
            ),
            [N('Ned feels sad and cross. Losing is hard.'), N('It’s OK to feel sad and cross.')],
          ),
        ],
      ),
      sS(
        'lb11-facedown',
        [
          MAI('Come on, Ned. One more race!'),
          NED('No. I’m staying here.', 'sad'),
          SAM('Nobody likes losing, mate.', 'soft'),
          N('Maisie holds out her hand. Ned takes it.'),
          N('Everyone runs the last race holding hands.'),
          N('Everybody crosses the rope together!'),
          MAI('A draw! Draws are allowed!', 'happy'),
        ],
        [
          ask(
            2,
            m(
              'sel',
              'what helps big feelings',
              'Your child named things that help when they feel cross: a breath, a hug, a sit-down.',
              'CASEL: Self-management',
            ),
            [N('What helps when you feel cross?')],
            [
              opt('A big breath', N('Yes! Breathe in… and out. Ahh.')),
              opt('A hug', N('Yes! Hugs help lots.')),
              opt('A sit-down', N('Yes! Sitting quietly helps too.')),
            ],
          ),
        ],
        undefined,
        'hand',
      ),
      sS(
        'lb11-complete',
        [
          N('Sam sits up. Ned climbs into his lap.'),
          SAM('I like racing with you. Somebody always gets up again.', 'soft'),
          N('Ned picks grass off his face.'),
          N('He gives each bit to your Nubbin.'),
        ],
        [
          ask(
            1,
            m(
              'literacy',
              'characters in a story',
              'Your child remembered who got up again after losing.',
              'RL.K.3',
            ),
            [N('Who got up again after losing?')],
            [
              best('Ned!', N('Yes! Ned got up. That was brave.')),
              opt('Maisie', N('Maisie won. Ned was the one who got up again!')),
            ],
          ),
        ],
      ),
    ],
    undefined,
    'Sprout drops the race choice (reader only) and plays the hand-holding race, defaultChoice "hand"; so LB12 plays lb12-ned-hand.',
  ),

  // ------------------------------------------------------------------ LB12
  qS(
    'lb12',
    'The Long Grass Campout',
    {
      'lb12-s1': { goal: 'Bring a sleeping bag to the Larkins’ grass.', hint: 'Go at sunset.' },
      'lb12-s2': { goal: 'Lie still and wait for the first star.', hint: 'Shh. Keep very still.' },
    },
    [
      sS(
        'lb12-tired',
        [
          N('Summer evening. The sky is gold.'),
          AMA('Sam’s asleep already. He worked very hard.', 'soft'),
          MAI('Let’s play a game where Dad lies down!', 'happy'),
          N('Sleeping bags. Long grass. Lie very still.'),
          MAI('First to see a star wins!'),
        ],
        [
          notice(
            1,
            m(
              'sel',
              'tired is OK',
              'Your child heard that being tired after hard work is normal, and rest helps.',
              'CASEL: Self-awareness',
            ),
            [N('Sam is tired. That’s OK. He worked hard.'), N('When we’re tired, rest helps.')],
          ),
        ],
      ),
      sS(
        'lb12-arrive',
        [
          N('You bring your sleeping bag at sunset.'),
          N('Sam is awake now, in his pyjamas!'),
          SAM('A game where I lie down? I’ve been practising!', 'happy'),
          N('Look! Ama, Sam, Maisie, Ned, and you. Five sleeping bags.'),
        ],
        [
          act(
            3,
            m('maths', 'count to 5', 'Your child counted five sleeping bags in a row.', 'K.CC.B.5'),
            'edu:count:sleeping-bags:5',
            [N('Count the sleeping bags. One, two, three, four, five!')],
          ),
        ],
      ),
      sS(
        'lb12-waiting',
        [
          N('Everyone lies down in a row.'),
          N('The sky goes gold, then pink, then blue.'),
          MAI('No talking. No wriggling. Shh!'),
          N('Everyone is very, very still.'),
          SAM('In Brisbane, where I grew up, it’s winter now.', 'soft'),
        ],
        [
          notice(
            1,
            m(
              'science',
              'the Sun sets, the stars come out',
              'Your child noticed the pattern of evening: the Sun goes down, then stars appear.',
              '1-ESS1-1',
            ),
            [
              N('The Sun goes down. The sky gets dark.'),
              N('Then the stars come out. Every night!'),
            ],
          ),
        ],
        [
          ch('wish', 'Make a quiet wish.', [N('You make a wish. Shh, it’s a secret.')], {
            'lb-star-wish': 'wish',
          }),
          ch('hum', 'Hum very quietly.', [N('Hmm, hmm, hmm. Ama hums too.')], {
            'lb-star-wish': 'hum',
          }),
          ch(
            'watch-nubbin',
            'Watch your Nubbin fall asleep.',
            [N('Your Nubbin’s eyes close. Night night.')],
            { 'lb-star-wish': 'nubbin' },
          ),
        ],
      ),
      sS(
        'lb12-star',
        [
          N('Ned sees it first. One bright light!'),
          NED('STAR!', 'happy'),
          N('Then another. And another. And another!'),
          N('Too many to count. Everyone just looks.'),
        ],
        [
          ask(
            1,
            m(
              'sel',
              'how waiting feels',
              'Your child talked about how waiting feels, and what makes it easier.',
              'CASEL: Self-awareness',
            ),
            [N('Everyone waited a long time. How does waiting feel?')],
            [
              opt('Hard', N('Yes, waiting can be hard. Waiting together makes it easier.')),
              opt('Nice', N('Yes! Waiting with people you love can feel cosy.')),
              opt('Wriggly', N('Me too! Ned felt wriggly. He still waited.')),
            ],
          ),
        ],
      ),
      sS(
        'lb12-complete',
        [
          N('Sam is asleep. Ned is asleep on Sam’s arm.'),
          MAI('That was the best game ever.', 'soft'),
          AMA('Lying still together. You all did it!', 'soft'),
          N('Your Nubbin is asleep in Ned’s box.'),
          N('Next morning, a little box is on your step. From Ned!'),
        ],
        [
          notice(
            2,
            m(
              'sel',
              'being together',
              'Your child heard that quiet time together can be the best game of all.',
              'ELOF: Social and Emotional Development',
            ),
            [
              N('No running. No winning. Just being together.'),
              N('Sometimes that’s the best game of all.'),
            ],
          ),
        ],
      ),
    ],
  ),
];

const SPROUT_VARIANTS: EduScene[] = [
  sS(
    'lb12-complete-wish',
    [
      N('Sam is asleep. Ned is asleep on Sam’s arm.'),
      MAI('That was the best game ever.', 'soft'),
      MAI('Did your wish come true?', 'soft'),
      N('Shh. Wishes are secret. Maisie nods, and falls asleep.'),
      N('Your Nubbin is asleep in Ned’s box.'),
      N('Next morning, a little box is on your step. From Ned!'),
    ],
    [
      notice(
        3,
        m(
          'sel',
          'keeping a kind secret',
          'Your child heard that some secrets, like wishes, are nice ones to keep.',
          'ELOF: Social and Emotional Development',
        ),
        [N('A wish is a nice secret. You can keep it all to yourself.')],
      ),
    ],
  ),
  sS(
    'lb06-door-big',
    [
      N('The big box is the den door.'),
      NED('A front door! With a roof!', 'happy'),
      MAI('Knock first. That’s the rule.'),
      N('Knock, knock!'),
    ],
    [
      notice(
        2,
        m(
          'literacy',
          'first sounds',
          'Your child heard that door and den start with the same d sound.',
          'RF.K.2',
        ),
        [N('D-d-door. D-d-den. Same first sound!')],
      ),
    ],
  ),
  sS(
    'lb06-door-long',
    [
      N('The long box is a tunnel door.'),
      NED('You have to wriggle!', 'happy'),
      N('Your Nubbin wriggles in. Stuck! Then unstuck.'),
      N('Wriggle, wriggle, pop!'),
    ],
    [
      act(
        2,
        m(
          'literacy',
          'movement words',
          'Your child acted out a movement word: wriggle.',
          'ELOF: Language and Communication',
        ),
        'edu:move:wriggle',
        [N('Can you wriggle like the Nubbin? Wriggle, wriggle!')],
      ),
    ],
  ),
  sS(
    'lb06-door-tall',
    [
      N('The tall box is the den door.'),
      NED('It’s a lift. It goes DOWN!', 'happy'),
      N('You step in. Then you duck down. Down, down!'),
    ],
    [
      ask(
        1,
        m(
          'literacy',
          'opposite words',
          'Your child found the opposite of down.',
          'ELOF: Language and Communication',
        ),
        [N('The lift goes down. What is the opposite of down?')],
        [
          best('Up', N('Yes! Up and down. Stand up tall, then crouch down low!')),
          opt('Sideways', N('Down’s opposite is up! Up, down, up, down!')),
        ],
      ),
    ],
  ),
  sS(
    'lb12-ned-proper',
    [
      N('Ned runs in, shouting.'),
      NED('I came last ALL the way!', 'happy'),
      SAM('Shh now. Proud boy.', 'soft'),
    ],
    [
      notice(
        1,
        m(
          'sel',
          'feeling proud',
          'Your child heard that you can feel proud of trying, not just winning.',
          'CASEL: Self-awareness',
        ),
        [N('Ned didn’t win. But he feels proud. He tried his best!')],
      ),
    ],
  ),
  sS(
    'lb12-ned-let-win',
    [
      N('Ned walks in like a king.'),
      NED('I’m the fastest in the valley!', 'happy'),
      MAI('He keeps saying that.'),
      N('Maisie lets him. That’s kind.'),
    ],
    [
      notice(
        3,
        m(
          'sel',
          'kindness',
          'Your child noticed Maisie being kind to her brother.',
          'CASEL: Social awareness',
        ),
        [N('Maisie let Ned have his happy moment. That’s a kind sister.')],
      ),
    ],
  ),
  sS(
    'lb12-ned-hand',
    [
      N('Ned comes in holding Maisie’s hand.'),
      NED('We’re a team. Teams hold hands.', 'soft'),
      MAI('Tonight, yes.'),
    ],
    [
      notice(
        1,
        m(
          'sel',
          'friendship and teams',
          'Your child heard that a team helps each other.',
          'CASEL: Relationship skills',
        ),
        [N('A team helps each other. Who is on your team?')],
      ),
    ],
  ),
  sS(
    'lb12-box-big',
    [
      N('Ned’s box is in the grass. Tonight it’s a house!'),
      NED('Only small ones can sleep in it.'),
      N('Your Nubbin is small. In it goes!'),
    ],
    [
      ask(
        0,
        m(
          'literacy',
          'pretend play',
          'Your child imagined what else a cardboard box could be.',
          'ELOF: Approaches to Learning',
        ),
        [N('A box can be a house. What else could a box be?')],
        [
          opt('A car', N('Brrm brrm! Great idea.')),
          opt('A bed', N('Snore! Great idea.')),
          opt('Something else', N('Tell me! Boxes can be anything.')),
        ],
      ),
    ],
  ),
  sS(
    'lb12-box-long',
    [
      N('Ned’s box has a sail. Tonight it’s a boat!'),
      NED('We’re sailing to the stars!'),
      N('Only Ned and your Nubbin fit. Everyone else pretends.'),
    ],
    [
      ask(
        0,
        m(
          'literacy',
          'pretend play',
          'Your child imagined what else a cardboard box could be.',
          'ELOF: Approaches to Learning',
        ),
        [N('A box can be a boat. What else could a box be?')],
        [
          opt('A car', N('Brrm brrm! Great idea.')),
          opt('A bed', N('Snore! Great idea.')),
          opt('Something else', N('Tell me! Boxes can be anything.')),
        ],
      ),
    ],
  ),
  sS(
    'lb12-box-tall',
    [
      N('Ned’s box has a pointy top. Tonight it’s a rocket!'),
      NED('Three, two, one… blast off!', 'happy'),
      N('The rocket stays still. Best rocket ever.'),
    ],
    [
      act(
        1,
        m(
          'maths',
          'counting down',
          'Your child counted backwards from ten to one, like a rocket launch.',
        ),
        'edu:count:down:10',
        [
          N('Count down with Ned! Ten, nine, eight, seven, six, five, four, three, two, one!'),
          N('Blast off!'),
        ],
      ),
    ],
  ),
];

// ================================================================ reader (ages 7–10)

const READER: EduQuest[] = [
  // ------------------------------------------------------------------ LB1
  qR(
    'lb01',
    'Boxes',
    {
      'lb01-s1': {
        goal: 'Help the Larkins carry their boxes from the post van into the cottage past Fern’s.',
        hint: 'Pick up a box at the van’s back doors and carry it into the front room.',
      },
      'lb01-s2': {
        goal: 'Help Ned choose one empty box to keep.',
        hint: 'Talk to Ned in the front room and pick a box with him.',
      },
    },
    [
      sR(
        'lb01-van',
        [
          N(
            'A red post van is parked crooked in the lane past Fern’s. Its back doors are open, and it is full of somebody’s whole life.',
          ),
          AMA(
            'Hello! You must be next door. Well, next door but one. I’m Ama. I drive the post van.',
            'happy',
          ),
          AMA('It isn’t usually full of our own socks. Usually it’s everyone else’s parcels.'),
          SAM('Sam. Hello. Sorry. We’ve been up since four.', 'soft'),
          N(
            'A girl in a paper crown marches past with a lampshade. A small boy follows her, carrying nothing, very carefully.',
          ),
          MAI('I’m Maisie. I’m six, so I do the rules. That’s Ned. He’s four.'),
          NED('I’m in charge of not dropping things.'),
          N('Your Nubbin trots up to Ned. They stare at each other, both delighted.'),
          SAM('If you’ve got a spare pair of arms, we’ve got about forty boxes.'),
        ],
        [
          ask(
            1,
            m(
              'literacy',
              'working out a phrase from context',
              'Your child worked out what “next door but one” means from the scene.',
              'L.2.4',
            ),
            [
              N(
                'Ama says you live “next door but one”. Fern’s house is between yours and theirs. What does it mean?',
              ),
            ],
            [
              best(
                'Two houses along',
                AMA('Exactly. Next door is Fern. Next door but one is you.'),
              ),
              opt(
                'Right next door',
                N('Not quite. Fern is right next door. “But one” means skip one more house.'),
              ),
              opt(
                'Very far away',
                N('It’s close! Just one house in between, so two houses along.'),
              ),
            ],
          ),
        ],
      ),
      sR(
        'lb01-unpacked',
        [
          N(
            'By lunchtime the van is empty and the front room is full of boxes. Most of the boxes are empty too.',
          ),
          AMA(
            'That’s the lot. The kettle was in the box marked SHOES, so that’s one mystery solved.',
          ),
          N('Maisie and Ned look at the empty boxes the way other children look at cake.'),
          MAI(
            'Twelve boxes are exactly the same size. We need towers. Equal ones, or it isn’t fair.',
          ),
        ],
        [
          act(
            3,
            m(
              'maths',
              'multiplication as equal groups',
              'Your child stacked 12 boxes into equal piles three different ways.',
              '3.OA.A.1',
            ),
            'edu:sort:boxes:equal-piles',
            [
              N('Stack the 12 boxes into equal towers. Find three different ways.'),
              MAI('2 towers of 6. 3 towers of 4. 4 towers of 3. All twelve!', 'happy'),
              N('2 × 6, 3 × 4 and 4 × 3 all make 12. Multiplying is just counting equal groups.'),
            ],
          ),
        ],
      ),
      sR(
        'lb01-boxes',
        [
          N(
            'Ama folds the empty boxes flat for the recycling. Ned watches each one fold up like a small, sad animal.',
          ),
          NED('Not that one! Or that one!', 'shock'),
          AMA('Ned, love, we can’t keep forty boxes. We’d have to live in the garden.'),
          SAM('One box, then. One box for keeps.'),
          N(
            'Ned knocks on each box, like knocking on a door. Then he climbs into one and goes quiet.',
          ),
          MAI(
            'He’s sad about his old bedroom. It had glow-in-the-dark stars on the ceiling.',
            'soft',
          ),
          NED('They wouldn’t come off. I tried.', 'sad'),
          SAM('They’re still up there, mate. Glowing away for whoever sleeps there next.', 'soft'),
          N(
            'Ned thinks about that for a long time. Then he climbs out, points at three boxes, and looks at you.',
          ),
          NED('You pick. You’re the grown-up next door.'),
        ],
        [
          ask(
            7,
            m(
              'sel',
              'mixed feelings',
              'Your child thought about how a happy day can hold a sad feeling too.',
              'CASEL: Self-awareness',
            ),
            [
              N(
                'Moving day is exciting. Ned has boxes and a new friend. So why can a happy day still feel sad?',
              ),
            ],
            [
              opt(
                'Because new things mean leaving old things',
                N('That’s a wise answer. You can love the new and still miss the old.'),
              ),
              opt(
                'Because he’s tired',
                N('That’s fair. Tired makes every feeling bigger, and he was up at four.'),
              ),
              opt(
                'Feelings can mix',
                N('Yes. Happy and sad can sit side by side, like two people on one bench.'),
              ),
            ],
          ),
        ],
        [
          ch(
            'big',
            'The big one. You could live in it.',
            [
              N('Ned climbs into the big box and pulls the flaps shut over his head.'),
              NED('It’s got a ROOF.', 'happy'),
            ],
            { 'lb-box': 'big' },
          ),
          ch(
            'long',
            'The long one. It’s the shape of a boat.',
            [
              N(
                'Ned lies down in the long box. It fits him exactly, with room at the end for your Nubbin.',
              ),
            ],
            {
              'lb-box': 'long',
            },
          ),
          ch(
            'tall',
            'The tall one. It’s nearly as tall as Ned.',
            [
              N('Ned stands inside the tall box. Only his eyes show over the top.'),
              NED('It goes UP.', 'happy'),
            ],
            {
              'lb-box': 'tall',
            },
          ),
        ],
      ),
      sR(
        'lb01-complete',
        [
          N('Ama writes NED on the box in marker pen, in letters as big as Ned’s hand.'),
          AMA(
            'There. Officially his. Thank you for today. I’d have been making tea in a shoe box till August.',
            'happy',
          ),
          SAM(
            'Come round whenever you like. They’ll need a customer for something soon. They always do.',
          ),
          MAI(
            'Can we borrow your Nubbin for games sometimes? We’ll always ask, and we’ll always give it back.',
          ),
          N('Ned waves at your Nubbin from inside his box until you reach the lane.'),
        ],
        [
          notice(
            0,
            m(
              'science',
              'properties of cardboard',
              'Your child learned what cardboard is made of and what it is good and bad at.',
              '2-PS1-1',
            ),
            [
              AMA(
                'Cardboard is made from wood, mashed up into paper and pressed into layers. Light, stiff, strong enough to stand in.',
              ),
              AMA(
                'Its one weakness is water. Keep Ned’s box out of the rain, or it goes soft and floppy.',
              ),
            ],
          ),
        ],
      ),
    ],
    [
      g(
        'recycling',
        'Collecting used things, like boxes, so they can be made into something new.',
        'lb01-boxes',
      ),
      g(
        'officially',
        'Properly and for real, as if it had been written down and agreed.',
        'lb01-complete',
      ),
    ],
  ),

  // ------------------------------------------------------------------ LB2
  qR(
    'lb02',
    'Shops',
    {
      'lb02-s1': {
        goal: 'Buy a leaf from Ned’s shop on the Larkins’ step.',
        hint: 'Talk to Ned and pay for a leaf. You will get your Shells back.',
      },
      'lb02-s2': {
        goal: 'Help Maisie and Ned share the shop.',
        hint: 'Talk to Maisie and Ned at the step and help them take turns.',
      },
    },
    [
      sR(
        'lb02-shop',
        [
          N(
            'A cardboard sign on the Larkins’ step says SHOP, with the S backwards. The shop is open.',
          ),
          N('Leaves sit in rows on a tea towel. One has a hole in it, which Ned says is a window.'),
          NED('Welcome to the shop. Everything is leaves.', 'happy'),
          Y('How much is this one?'),
          NED('Five Shells. No. A hundred. No. Two.', 'think'),
          N(
            'Prices in Ned’s shop change as often as the wind. Your Nubbin guards the till, which is a biscuit tin.',
          ),
          NED('The window leaf is thirteen. It’s the best one. You can look through it.'),
        ],
        [
          notice(
            5,
            m(
              'social-studies',
              'prices and choices',
              'Your child learned that a price is what something costs, and buyers choose what to spend on.',
              'D2.Eco.1.K-2',
            ),
            [
              N(
                'A price is what something costs. The shopkeeper sets it; the customer decides if it’s worth it.',
              ),
              N('Real shops change prices too, just not every four seconds.'),
            ],
          ),
        ],
        [
          ch('pay', 'Thirteen Shells it is.', [NED('Good. I only have change from twenty.')]),
          ch('discount', 'Do you do discounts?', [
            NED('Yes. It’s fourteen.', 'happy'),
            N('You decide thirteen was a bargain.'),
          ]),
          ch('nubbin', 'Could my Nubbin buy one too?', [
            NED('Nubbins are free. Nubbins get a leaf for nothing.'),
            N('Your Nubbin holds its leaf up like a flag.'),
          ]),
        ],
      ),
      sR(
        'lb02-bought',
        [
          N('You hand Ned twenty Shells for the thirteen-Shell leaf. He looks at them very hard.'),
          NED('Now I give you change. That’s the best bit.'),
          N('Ned counts change out of the biscuit tin, slowly, with his tongue out.'),
          N(
            'Then he gives you all twenty back anyway, because in Ned’s shop change is the best bit and nobody leaves without all of it.',
          ),
        ],
        [
          act(
            2,
            m(
              'maths',
              'working out change',
              'Your child worked out the change from 20 for a 13-Shell leaf (7).',
              '2.OA.A.1',
            ),
            'edu:count:shells:change-7',
            [
              N('You paid 20 for a 13-Shell leaf. How much change? Count up from 13 to 20.'),
              NED('Fourteen, fifteen… twenty! Seven Shells change!', 'happy'),
            ],
          ),
        ],
      ),
      sR(
        'lb02-turns',
        [
          N('Maisie comes out with a second tea towel and a sign of her own. Hers says SHOP TOO.'),
          MAI('I’m the shopkeeper now. Ned’s had ages.'),
          NED('It’s MY shop. I made the S.', 'angry'),
          N(
            'Ned hugs the biscuit tin. Maisie folds her arms. The leaves blow about, unsupervised.',
          ),
          SAM('Is there a way two shopkeepers could work this out?'),
          N(
            'Sam is leaning out of the shed window, holding a chair leg he has been sanding all morning.',
          ),
          MAI('He could be the customer. Customers are important too.'),
          NED('Customers don’t get the tin.', 'sad'),
        ],
        [
          notice(
            7,
            m(
              'sel',
              'sharing and turn-taking',
              'Your child saw how a fair plan for turns can solve a disagreement.',
              'CASEL: Relationship skills',
            ),
            [
              N(
                'When two people want the same thing, a fair plan helps: who goes first, for how long, and what happens next.',
              ),
            ],
          ),
        ],
        [
          ch(
            'swap-sale',
            'Ned sells one thing, then you swap.',
            [MAI('One each. Fine. But I’m having the window leaf.')],
            { 'lb-ned-shop': 'swap' },
          ),
          ch(
            'two-shops',
            'Two shops, side by side. I’ll shop at both.',
            [N('Maisie sets up next to Ned. The step now has a high street.')],
            { 'lb-ned-shop': 'two' },
          ),
          ch(
            'tin-turns',
            'Whoever’s selling holds the tin.',
            [NED('And then I get it back?'), MAI('Then you get it back.')],
            { 'lb-ned-shop': 'tin' },
          ),
        ],
      ),
      sR(
        'lb02-complete',
        [
          N(
            'Maisie runs the shop for a while. Ned is a customer, and finds out something surprising.',
          ),
          NED('Buying is ALSO good.', 'happy'),
          N(
            'He buys the window leaf six times. Maisie gives him change every time, because that is how this shop works now.',
          ),
          SAM('Two shopkeepers, one tin, nobody crying. That’s a good day’s trading.'),
          N(
            'When you go, Ned presses a leaf into your hand. It is free, he says, because you are a regular.',
          ),
        ],
        [
          ask(
            1,
            m(
              'literacy',
              'how a character changes',
              'Your child noticed how Ned’s feelings changed when he tried a new role.',
              'RL.2.3',
            ),
            [N('Ned didn’t want to be the customer. Now he loves it. What changed?')],
            [
              opt(
                'He tried it',
                N('Yes. Sometimes you don’t know you like something until you try it.'),
              ),
              opt(
                'He got change every time',
                N('Ha! That helped. Getting things back is Ned’s favourite.'),
              ),
              opt(
                'He felt included',
                N('That’s thoughtful. Being part of the game mattered more than which part.'),
              ),
            ],
          ),
        ],
      ),
    ],
    [
      g('customer', 'A person who buys something from a shop.', 'lb02-turns'),
      g('change', 'The money you get back when you pay more than something costs.', 'lb02-bought'),
    ],
  ),

  // ------------------------------------------------------------------ LB3
  qR(
    'lb03',
    'Don’t Touch the Grass',
    {
      'lb03-s1': {
        goal: 'Help lay the cushions across the Larkins’ lawn.',
        hint: 'Carry cushions from the back door and drop them in a line to the fence.',
      },
      'lb03-s2': {
        goal: 'Cross the lawn to the fence without touching the grass.',
        hint: 'Hop from cushion to cushion. If you touch grass, start again.',
      },
    },
    [
      sR(
        'lb03-rules',
        [
          N(
            'Every cushion in the Larkins’ house is out on the lawn, and so is Sam, flat on his back in the long grass.',
          ),
          MAI('The rules. The grass is a pond. You can only stand on cushions.'),
          MAI('And something lives in the pond. It has tickly fingers.'),
          N('Somewhere in the long grass, a hand waves slowly, like pondweed.'),
          SAM('Bloop.'),
          NED('That’s Dad. But it’s also NOT Dad.', 'shock'),
          MAI(
            'We need a path of cushions from the back door to the fence. The fence is the island.',
          ),
        ],
        [
          notice(
            1,
            m(
              'literacy',
              'metaphor',
              'Your child learned that saying one thing IS another (the grass is a pond) is a metaphor.',
              'L.4.5',
            ),
            [
              N(
                '“The grass is a pond” isn’t true, but it makes the game. Saying one thing IS another is called a metaphor.',
              ),
            ],
          ),
        ],
      ),
      sR(
        'lb03-laid',
        [
          N(
            'The cushions wobble across the lawn in a crooked line. Most are close together. One gap is enormous.',
          ),
          MAI('That gap is the hard bit. It’s meant to be hard.'),
          NED('How big is it?', 'think'),
          N('Sam’s tape measure is in his shed. Maisie fetches it at a run.'),
        ],
        [
          act(
            3,
            m(
              'maths',
              'measuring with a tape',
              'Your child measured the gap and the biggest jump with a tape measure, in centimetres.',
              '2.MD.A.1',
            ),
            'edu:measure:jump:tape',
            [
              N(
                'Hold the tape at the edge of one cushion and read where the next begins. Start from zero, not from the metal tab.',
              ),
              MAI('The gap is 90 centimetres. My best jump is 110. Ned’s is 60.'),
              N('Ned’s jump is 30 centimetres short. Can that be fixed without changing Ned?'),
            ],
          ),
        ],
      ),
      sR(
        'lb03-crossing',
        [
          N('Maisie crosses first, fast and sure, arms out like a tightrope walker.'),
          N(
            'Ned goes second. He stops on a cushion with his toes over the edge, looking at the long gap.',
          ),
          NED('It’s too far.', 'sad'),
          N('The grass rustles. Two fingers appear, wiggling, and go away again.'),
          MAI('You can do it, Ned. Big jump.'),
          NED('My legs are only small.'),
        ],
        [
          notice(
            5,
            m(
              'science',
              'defining the problem',
              'Your child stated the problem clearly before solving it: the gap is longer than Ned’s jump.',
              'K-2-ETS1-1',
            ),
            [
              N(
                'Engineers start by saying the problem exactly. Here: the gap is 90 cm and Ned can jump 60.',
              ),
              N('So the fix must close 30 cm, or help Ned across it.'),
            ],
          ),
        ],
        [
          ch('extra-cushion', 'Put down one more cushion, halfway.', [
            N('You slide a cushion into the gap. Two small jumps instead of one big one.'),
            MAI('That’s allowed. Islands can grow.'),
          ]),
          ch('hold-hand', 'Hold out a hand from the next cushion.', [
            N('You lean out from the far cushion. Ned grabs your fingers and jumps.'),
            NED('I did a huge one!', 'happy'),
          ]),
          ch('nubbin-first', 'Let your Nubbin show him how.', [
            N(
              'Your Nubbin flaps its small wings and bounces across. Ned copies it exactly, flaps and all.',
            ),
          ]),
        ],
      ),
      sR(
        'lb03-complete',
        [
          N(
            'Everyone reaches the fence. Then everyone goes back, because that is how this game works.',
          ),
          N(
            'On the third crossing the tickly fingers catch Ned’s ankle. He tumbles into the grass and laughs till he hiccups.',
          ),
          SAM(
            'Got one. The pond monster is satisfied. The pond monster would also like a cup of tea.',
          ),
          MAI('Pond monsters don’t drink tea.'),
          SAM('This one does. It’s been a long week in the pond.', 'soft'),
          N('Ned brings his dad a pretend tea in a flowerpot. Sam drinks every pretend drop.'),
        ],
        [
          ask(
            4,
            m(
              'literacy',
              'character motive',
              'Your child thought about why Sam plays the game lying down, and what he gets from it.',
              'RL.3.3',
            ),
            [
              N(
                'Sam has worked all week. Why do you think he chose to be the monster who lies in the grass?',
              ),
            ],
            [
              opt(
                'So he can rest and still play',
                N(
                  'That’s sharp. Lying down is the most restful part going, and he’s still in the game.',
                ),
              ),
              opt('Because it’s funny', N('True. A dad who goes “bloop” is very funny.')),
              opt(
                'Because the children asked',
                N('Yes. He says yes to games, even tired. That matters to them.'),
              ),
            ],
          ),
        ],
      ),
    ],
    [
      g(
        'metaphor',
        'Saying one thing is another to make a picture in your head, like “the grass is a pond”.',
        'lb03-rules',
      ),
      g('centimetre', 'A small unit of length; 100 centimetres make a metre.', 'lb03-laid'),
    ],
  ),

  // ------------------------------------------------------------------ LB4
  qR(
    'lb04',
    'Sleeping Giant',
    {
      'lb04-s1': {
        goal: 'Find the sleeping giant in the Larkins’ garden.',
        hint: 'The giant is in the deckchair under the apple tree.',
      },
      'lb04-s2': {
        goal: 'Creep up on the giant, and freeze whenever he turns.',
        hint: 'Move slowly. When the newspaper twitches, stop and hold still.',
      },
    },
    [
      sR(
        'lb04-giant',
        [
          N(
            'Sam is asleep in a deckchair under the apple tree, a newspaper over his face. It rises and falls as he breathes.',
          ),
          MAI('Shh. He’s the giant. He’s guarding the treasure.'),
          N('The treasure is a biscuit, on the arm of the deckchair, beside his hand.'),
          NED('He made two chairs this week. Giants get very tired.', 'soft'),
          MAI('You creep up. When the giant turns his head, you freeze like a statue.'),
          MAI('If he sees you move, back to the start. First to touch the biscuit wins.'),
        ],
        [
          notice(
            3,
            m(
              'health',
              'sleep and rest',
              'Your child learned that sleep helps bodies recover, for grown-ups as well as children.',
              'K-LS1-1',
            ),
            [
              N(
                'Sleep isn’t lazy. While you sleep, your body repairs itself and your brain sorts out the day.',
              ),
              N('Children need more sleep than grown-ups, but everyone needs it.'),
            ],
          ),
        ],
      ),
      sR(
        'lb04-start',
        [
          N(
            'You line up by the gate: you, Maisie, Ned and your Nubbin, who doesn’t understand the rules but loves a line.',
          ),
          SAM('Fee. Fi. Hmm. Fo.', 'soft'),
          MAI('That means go.'),
          N('Ned giggles, then clamps both hands over his mouth.'),
        ],
        [
          notice(
            1,
            m(
              'literacy',
              'old stories and repeated lines',
              'Your child heard that Sam borrows the giant’s chant from an old fairy tale, Jack and the Beanstalk.',
              'RL.2.4',
            ),
            [
              N(
                'Sam is borrowing from Jack and the Beanstalk, an English fairy tale hundreds of years old. Its giant has a famous chant.',
              ),
              N('Repeated sounds like fee, fi, fo make stories easy to remember and fun to say.'),
            ],
          ),
        ],
      ),
      sR(
        'lb04-creep',
        [
          N(
            'Maisie runs, and the newspaper twitches. Sam turns his head, and Maisie is still wobbling.',
          ),
          SAM('I see a Maisie. Back to the gate, Maisie.'),
          MAI('I was nearly STILL!', 'angry'),
          N(
            'Ned goes so slowly that a bee lands on his shoulder and leaves again. When Sam turns, Ned is a perfect statue.',
          ),
          SAM('Hmm. Just a garden ornament. A very small one.'),
          N('Ned beams, then remembers statues can’t beam, and stops.'),
        ],
        [
          act(
            3,
            m(
              'sel',
              'self-control',
              'Your child practised slow, careful movement and thought about why patience wins this game.',
              'CASEL: Self-management',
            ),
            'edu:order:steps:slow',
            [
              N(
                'Your turn. Tiny steps, then freeze when the paper twitches. Why do slow, careful moves win here?',
              ),
              N('Because fast bodies wobble when they stop. Slow ones are already nearly still.'),
            ],
          ),
          notice(
            5,
            m(
              'science',
              'balanced forces',
              'Your child learned that a still statue has balanced forces, and a push starts movement.',
              '3-PS2-1',
            ),
            [
              N(
                'A statue stays still because the forces on it are balanced: gravity pulls down, the ground pushes up.',
              ),
              N(
                'Running is unbalanced: your feet push, you speed up, and stopping takes another push.',
              ),
            ],
          ),
        ],
        [
          ch('slow', 'Go slow, like Ned.', [N('You take tiny steps. The grass hardly moves.')]),
          ch('fast', 'Try a quick dash.', [
            N('You dash. The newspaper lifts.'),
            SAM('I see a grown-up. Back you go.'),
            MAI('Told you. Slow wins.'),
          ]),
          ch('nubbin-creep', 'Send your Nubbin in first.', [
            N(
              'Your Nubbin waddles straight up and sits by Sam’s feet. Nobody can tell if it’s cheating.',
            ),
          ]),
        ],
      ),
      sR(
        'lb04-complete',
        [
          N(
            'In the end it is Ned. One slow foot at a time, he reaches the deckchair and puts one finger on the biscuit.',
          ),
          NED('Got it.', 'happy'),
          N(
            'Sam lifts the newspaper. He has been awake for some of it and asleep for some of it, and he isn’t saying which.',
          ),
          SAM('Beaten by the smallest statue in the valley. One more go?'),
          N(
            'Ned breaks the biscuit into four pieces, one for each player. Your Nubbin’s is the biggest, because Ned says it was the quietest.',
          ),
        ],
        [
          ask(
            4,
            m(
              'maths',
              'unit fractions need equal parts',
              'Your child learned that quarters must be equal parts, so Ned’s four pieces aren’t quite quarters.',
              '3.NF.A.1',
            ),
            [N('Four pieces, one each. Is each piece a quarter of the biscuit?')],
            [
              best(
                'Not quite: they aren’t equal',
                N(
                  'Right. A quarter means one of four EQUAL parts. Ned’s pieces are four parts, but one is bigger.',
                ),
              ),
              opt(
                'Yes, there are four',
                N(
                  'There are four pieces, but quarters must be equal. The Nubbin’s is bigger, so they aren’t quite quarters.',
                ),
              ),
            ],
          ),
        ],
      ),
    ],
    [
      g(
        'statue',
        'A figure that stands perfectly still, often made of stone or metal.',
        'lb04-giant',
      ),
      g('balanced', 'Even on every side, so nothing moves or tips.', 'lb04-creep'),
    ],
  ),

  // ------------------------------------------------------------------ LB5
  qR(
    'lb05',
    'Nubbin Doctor',
    {
      'lb05-s1': {
        goal: 'Take your Nubbin to Maisie’s pretend clinic in the Larkins’ shed.',
        hint: 'Walk your Nubbin to the shed. It is not ill; it is playing a patient.',
      },
      'lb05-s2': {
        goal: 'Help Ned bandage your Nubbin, kindly.',
        hint: 'Talk to Ned at the workbench. He has the wrong foot.',
      },
    },
    [
      sR(
        'lb05-clinic',
        [
          N(
            'The shed has been cleared for the clinic. The workbench is a bed, with a tea towel for a sheet.',
          ),
          MAI('Next patient, please. Ah. A Nubbin. What seems to be the trouble?'),
          Y('Nothing, really. It’s very well.'),
          MAI('That’s what they all say. Up on the bed, please.'),
          N('Your Nubbin lies flat on its back. It is not ill, just very good at lying still.'),
          NED('I’m the nurse. I’ve got the bandages.'),
          N('Ned holds up a whole roll of toilet paper, like a trophy.'),
        ],
        [
          notice(
            1,
            m(
              'science',
              'what animals need to live',
              'Your child learned the basic needs of every animal: food, water, air and shelter.',
              'K-LS1-1',
            ),
            [
              MAI(
                'First question for every patient: food, water, air, a safe place to rest. Every animal needs those to live.',
              ),
              MAI('Nubbins also need cuddles. That’s not science. That’s just true.'),
            ],
          ),
        ],
      ),
      sR(
        'lb05-checkup',
        [
          N(
            'Maisie listens to your Nubbin’s chest through a funnel. Your Nubbin does its best to have a chest worth listening to.',
          ),
          MAI('Good heart. Good ears. Wings a bit small, but that’s normal.'),
          MAI('Has it been eating? Drinking? Sleeping? Getting cuddles?'),
          Y('All four. Lots of the last one.'),
        ],
        [
          notice(
            1,
            m(
              'science',
              'the heart',
              'Your child learned what the heart does and why a doctor listens to it.',
              '4-LS1-1',
            ),
            [
              N(
                'Your heart is a muscle that pumps blood round your body, carrying air and food to every part.',
              ),
              N(
                'A funnel gathers its quiet thump into your ear. Real stethoscopes work in a similar way.',
              ),
            ],
          ),
        ],
      ),
      sR(
        'lb05-bandage',
        [
          MAI('The patient has a sore left foot. Nurse, bandage please.'),
          N(
            'Ned winds the toilet paper round your Nubbin’s right foot, tongue out, very carefully.',
          ),
          N(
            'Maisie opens her mouth to say something. Then she sees Ned’s face and closes it again.',
          ),
          MAI('How do you tell somebody they’ve done it wrong without making them sad?', 'think'),
          N('Your Nubbin lies quite still, wrapped up to the knee, enjoying the attention.'),
        ],
        [
          ask(
            3,
            m(
              'sel',
              'kind correction',
              'Your child weighed different ways to point out a mistake kindly.',
              'CASEL: Social awareness',
            ),
            [
              N(
                'Think about Ned’s face. Which way of telling him would you want, if you were Ned?',
              ),
            ],
            [
              opt(
                'Praise first, then ask for the other foot',
                N('That keeps his pride and fixes the bandage. Clever.'),
              ),
              opt(
                'Ask him a question so he spots it himself',
                N('Lovely. Finding your own mistake feels much better than being told.'),
              ),
              opt(
                'Just say “wrong foot” gently',
                N('Honest and quick. With a kind voice, that can work too.'),
              ),
            ],
          ),
        ],
        [
          ch('other-foot', '“That’s brilliant. Could this foot have one too?”', [
            NED('Two bandages! It’s VERY poorly.', 'happy'),
            N('Now both feet are bandaged, which covers it either way.'),
          ]),
          ch('ask-ned', '“Which foot did the doctor say, Ned?”', [
            NED('The… other one?', 'think'),
            N('Ned looks at his own feet and works it out. He starts again on the left, proudly.'),
          ]),
          ch('nubbin-points', 'Let your Nubbin wiggle the left foot.', [
            N('Your Nubbin wiggles its left foot, gently. Ned gasps: the patient has told him.'),
          ]),
        ],
      ),
      sR(
        'lb05-complete',
        [
          N(
            'Your Nubbin walks home with both feet in toilet paper, like small white boots. It won’t let you take them off for an hour.',
          ),
          MAI('Bring it back if it gets any worse. Or any better.'),
          NED('It was a very patient patient.', 'soft'),
          N('Sam comes in for a pencil and gets a check-up too. Maisie prescribes a nap.'),
          SAM('Best medicine I’ve heard of all week.', 'happy'),
        ],
        [
          ask(
            2,
            m(
              'literacy',
              'multiple-meaning words',
              'Your child spotted that “patient” has two meanings: someone a doctor treats, and calm while waiting.',
              'L.3.4',
            ),
            [N('Ned says “a very patient patient”. Why is that funny?')],
            [
              best(
                'Patient means two things',
                N(
                  'Yes! A patient is someone a doctor looks after. Patient also means calm and good at waiting.',
                ),
              ),
              opt(
                'It’s just said twice',
                N(
                  'It is, but each one means something different: a doctor’s patient, and calm while waiting.',
                ),
              ),
            ],
          ),
        ],
      ),
    ],
    [
      g('patient', 'Someone a doctor looks after; also, able to wait calmly.', 'lb05-complete'),
      g(
        'prescribe',
        'When a doctor says what medicine or treatment you should have.',
        'lb05-complete',
      ),
    ],
  ),

  // ------------------------------------------------------------------ LB6
  qR(
    'lb06',
    'Den Day',
    {
      'lb06-s1': {
        goal: 'Gather chairs and blankets for a den in the Larkins’ front room.',
        hint: 'Blankets are in the cupboard; chairs are in Sam’s shed. Ned’s box is already there.',
      },
      'lb06-s2': {
        goal: 'Sit in the den with the Larkins while the rain goes on.',
        hint: 'Crawl in and sit down. There is nothing to do but listen.',
      },
    },
    [
      sR(
        'lb06-rain',
        [
          N(
            'Rain all day. The lane is a stream and the Larkins’ windows are fogged with small fingerprints.',
          ),
          MAI('It was sunny yesterday. It’s not fair. Weather should take turns properly.'),
          AMA('It’s Saturday and I’m not driving anywhere. So. Den?'),
          NED('DEN.', 'happy'),
          N(
            'Ama empties the blanket cupboard. Sam brings four chairs from the shed, all his own work, all slightly different.',
          ),
          SAM('Mind that one, it wobbles. So it’s perfect for a den.'),
        ],
        [
          act(
            1,
            m(
              'science',
              'recording weather over time',
              'Your child kept a week’s weather tally and looked for a pattern.',
              '3-ESS2-1',
            ),
            'edu:tally:weather:week',
            [
              N(
                'Maisie wants proof the weather isn’t taking turns. Help her tally the week on the fridge chart.',
              ),
              MAI(
                'Sunny: 3. Cloudy: 2. Rainy: 2. So rain has had two turns and sun has had three!',
              ),
              N(
                'Scientists collect weather data like this for years to find each season’s pattern.',
              ),
            ],
          ),
        ],
      ),
      sR(
        'lb06-built',
        [
          N(
            'The den goes up: four chairs, three blankets, a sheet for a roof, and pegs from the washing line.',
          ),
          N('Twice the roof sheet slides off. Twice everyone groans.'),
          AMA('Every den needs a door.'),
          N('Ned is already dragging his box across the rug, the one with NED on the side.'),
        ],
        [
          ask(
            1,
            m(
              'science',
              'comparing solutions',
              'Your child compared ways to stop the den roof sliding off and chose the best.',
              '3-5-ETS1-2',
            ),
            [N('The sheet keeps sliding off the chairs. Which fix is best?')],
            [
              best(
                'Peg it to the chair backs',
                AMA('Pegs grip the sheet, so it can’t slide. Done.'),
                N('Comparing fixes and testing the best one is how engineers work.'),
              ),
              opt(
                'Pile books on top',
                N(
                  'Books would weigh it down, but the roof would sag onto heads. Pegs work better.',
                ),
              ),
              opt('Hold it up by hand', N('That works till your arms ache. Pegs don’t get tired.')),
            ],
          ),
        ],
      ),
      sR(
        'lb06-inside',
        [
          N('Inside the den the light is blue and soft. Everyone’s knees touch, and nobody minds.'),
          N('Rain taps on the window. From in here it sounds further away and friendlier.'),
          MAI(
            'The rug in here is three metres long and two metres wide. I measured it with Dad’s tape.',
          ),
          NED('And Mum’s head is a circle.'),
          AMA('Thank you, Ned.', 'happy'),
          N('Your Nubbin curls up on Ned’s feet. Ned holds very still, so as not to wake it.'),
        ],
        [
          act(
            2,
            m(
              'maths',
              'perimeter',
              'Your child found the distance round a 3 m by 2 m rug: 10 metres.',
              '3.MD.D.8',
            ),
            'edu:measure:rug:perimeter',
            [
              N('Ned wants to walk all the way round the rug edge. How far is that?'),
              N('3 + 2 + 3 + 2 = 10 metres. The distance round a shape is its perimeter.'),
            ],
          ),
        ],
        [
          ch(
            'story',
            'Tell a story about a den in the rain.',
            [
              N(
                'You tell a story about a den that floats down the lane and comes home for tea. Ned makes you tell it twice.',
              ),
            ],
            { 'lb-den-story': 'story' },
          ),
          ch(
            'listen',
            'Just listen to the rain.',
            [
              N('Nobody says anything for a while. The rain does the talking.'),
              MAI('This is the quietest Ned has ever been.', 'soft'),
            ],
            { 'lb-den-story': 'listen' },
          ),
          ch(
            'drips',
            'Count the drips from the gutter.',
            [
              N(
                'You count drips together. At forty-one they go too fast, and you all give up laughing.',
              ),
            ],
            { 'lb-den-story': 'drips' },
          ),
        ],
      ),
      sR(
        'lb06-complete',
        [
          N('The rain stops at teatime. Nobody wants to come out.'),
          AMA('Tell you what. The den can stay up as long as it likes.'),
          MAI('Forever?'),
          AMA('Till we need the chairs. Which, given your dad, could be a while.'),
          SAM('I’ll make more chairs.', 'soft'),
          N(
            'Ama folds a spare blanket and hands it to you: a den for your own Grove, for the next rainy day.',
          ),
        ],
        [
          notice(
            4,
            m(
              'sel',
              'noticing generosity',
              'Your child noticed how the Larkins share what they have.',
              'CASEL: Social awareness',
            ),
            [
              N(
                'Sam will make more chairs so the den can stay. Ama gives away a blanket. Small gifts say “you matter to us”.',
              ),
            ],
          ),
        ],
      ),
    ],
    [
      g(
        'tally',
        'A quick way of counting with lines, where every fifth line crosses the four before it.',
        'lb06-rain',
      ),
      g('perimeter', 'The total distance all the way round the edge of a shape.', 'lb06-inside'),
    ],
  ),

  // ------------------------------------------------------------------ LB7
  qR(
    'lb07',
    'Shadow Show',
    {
      'lb07-s1': {
        goal: 'Find a torch for the shadow show.',
        hint: 'Try the box marked SHOES from moving day.',
      },
      'lb07-s2': {
        goal: 'Watch the shadow show, and put on a shadow of your own.',
        hint: 'Sit on the rug. When it’s your turn, step into the light.',
      },
    },
    [
      sR(
        'lb07-sheet',
        [
          N(
            'Ama pegs a white bedsheet across the front room, from the curtain rail to the top of the bookcase.',
          ),
          MAI('It’s a theatre. Tonight only. Tickets are free, but you have to clap.'),
          NED('I’m doing a rabbit.'),
          N('Ned makes a rabbit with his fingers. It looks a lot like a hand.'),
          AMA('A shadow show needs a light. There’s a torch in one of the boxes.'),
          AMA('If I know us, it’s in the one marked SHOES.'),
        ],
        [
          notice(
            1,
            m(
              'social-studies',
              'shadow theatre around the world',
              'Your child learned that shadow puppet theatre is an old art in many countries.',
              'D2.His.2.K-2',
            ),
            [
              AMA(
                'People have made shadow plays for hundreds of years. In Indonesia it’s called wayang kulit, with leather puppets.',
              ),
              AMA(
                'China and Turkey have their own old shadow theatres too. We’re in good company.',
              ),
            ],
          ),
        ],
      ),
      sR(
        'lb07-lights',
        [
          N(
            'The torch is in the box marked SHOES, under the bread bin. Sam switches off the big light.',
          ),
          N(
            'The torch makes a bright circle on the sheet. Everything else in the room goes soft and dark.',
          ),
          NED('Where does the light come from?'),
        ],
        [
          notice(
            2,
            m(
              'science',
              'energy changing form',
              'Your child learned that a torch changes the battery’s stored energy into light.',
              '4-PS3-4',
            ),
            [
              SAM(
                'The battery stores energy. Switch on, and electricity flows to the bulb, which turns it into light, and a bit of heat.',
              ),
            ],
          ),
        ],
      ),
      sR(
        'lb07-show',
        [
          N(
            'Ned stands between the torch and the sheet and holds up his rabbit. On the sheet it is taller than the bookcase.',
          ),
          NED('A GIANT rabbit!', 'shock'),
          MAI('Go nearer the sheet, Ned.'),
          N(
            'Ned steps back towards the sheet. The rabbit shrinks and shrinks until it is the size of a real one.',
          ),
          NED('Now it’s a baby. Where did the big one go?', 'think'),
          SAM('Walk back towards the torch, mate, and see what happens.'),
          N('Ned walks to and fro. The rabbit grows and shrinks. He could do this all night.'),
          MAI('Your turn. What are you making?'),
        ],
        [
          act(
            6,
            m(
              'science',
              'how shadows form and change size',
              'Your child explained shadows: light travels in straight lines, and a hand near the torch blocks more of it.',
              '1-PS4-2',
            ),
            'edu:order:shadows:size',
            [
              N(
                'Light travels in straight lines. Ned’s hand blocks some, so a dark patch, a shadow, lands on the sheet.',
              ),
              N(
                'Near the torch, his hand blocks a wide cone of light: big shadow. Near the sheet, only a little: small shadow.',
              ),
            ],
          ),
        ],
        [
          ch(
            'bird',
            'A bird, flapping.',
            [
              N(
                'Your hands flap across the sheet. Ned tries to catch the bird, and it flies over his head.',
              ),
            ],
            { 'lb-shadow': 'bird' },
          ),
          ch(
            'nubbin',
            'Put your Nubbin in the light.',
            [
              N(
                'Your Nubbin sees its shape on the sheet and stares. It waves a wing. So does the shadow.',
              ),
            ],
            { 'lb-shadow': 'nubbin' },
          ),
          ch(
            'monster',
            'A friendly monster.',
            [
              N('You make a big shadow with claws. It waves, very politely.'),
              NED('Hello, monster.', 'happy'),
            ],
            { 'lb-shadow': 'monster' },
          ),
        ],
      ),
      sR(
        'lb07-complete',
        [
          N(
            'The show ends with the whole family in the light at once: one big shadow with far too many arms.',
          ),
          MAI('That was the best show ever made. Clap now.'),
          N('Everyone claps. On the sheet, so do the shadows.'),
          AMA('Keep the sheet. We’ve got more sheets than beds, it turns out.', 'happy'),
          N(
            'You take home the sheet on two poles and the torch on a stand, for shows in your own Grove.',
          ),
        ],
        [
          ask(
            0,
            m(
              'science',
              'opaque and see-through materials',
              'Your child worked out that only light-blocking (opaque) things make dark shadows.',
              '2-PS1-1',
            ),
            [N('Ned tries to make a shadow with a glass of water. It barely shows. Why?')],
            [
              best(
                'Light goes through glass',
                N(
                  'Yes. Glass is transparent: light passes through. Hands are opaque: they block light and make dark shadows.',
                ),
              ),
              opt(
                'The glass is too small',
                N(
                  'Size isn’t it. Light passes straight through glass. Opaque things, like hands, block it.',
                ),
              ),
            ],
          ),
        ],
      ),
    ],
    [
      g('opaque', 'Not letting light through, so you can’t see through it.', 'lb07-complete'),
      g(
        'theatre',
        'A place, or a show, where stories are acted out for an audience.',
        'lb07-sheet',
      ),
    ],
  ),

  // ------------------------------------------------------------------ LB8
  qR(
    'lb08',
    'Treasure Map',
    {
      'lb08-s1': {
        goal: 'Follow Ama’s map down the lane to the X.',
        hint: 'In order: the pond, your gate, the big oak, then six big steps to the X.',
      },
      'lb08-s2': {
        goal: 'Find where Maisie really hid the treasure.',
        hint: 'Use the compass on the map. Maisie says it went north, along the wall.',
      },
    },
    [
      sR(
        'lb08-map',
        [
          N(
            'Ama spreads a sheet of paper on the kitchen table. It is a map of the lane, drawn in post-van detail.',
          ),
          AMA('Every house, every gate, every pothole. I know this lane better than my own feet.'),
          N('There is your pond, your gate that sticks, the big oak, and a red X by the old wall.'),
          N('In one corner Ama has drawn a compass, with a fancy N at the top.'),
          MAI('Follow the map. The pond first, then the gate, then the tree, then the X.'),
          NED('What’s the treasure?'),
          MAI('A secret. It’s raisins.'),
        ],
        [
          act(
            3,
            m(
              'science',
              'maps and compass directions',
              'Your child used the map’s compass: north, east, south and west.',
              '2-ESS2-2',
            ),
            'edu:order:map:lane',
            [
              AMA(
                'The compass shows north at the top. Clockwise round it: north, east, south, west.',
              ),
              AMA(
                'Up the valley, where the river comes from, is north. East is to its right, and west to its left.',
              ),
              N('Put the landmarks in order on the map: pond, gate, oak, X.'),
            ],
          ),
        ],
      ),
      sR(
        'lb08-x',
        [
          N('Pond, gate, tree, then six big steps past the oak to the X. Ned digs with a spoon.'),
          N('There is nothing there but soil and one surprised worm.'),
          NED('The treasure’s gone!', 'shock'),
        ],
        [
          ask(
            0,
            m(
              'maths',
              'converting centimetres to metres',
              'Your child worked out that six 50 cm steps make 300 cm, which is 3 metres.',
              '4.MD.A.1',
            ),
            [N('Each of your big steps is about 50 centimetres. Six steps is how far in metres?')],
            [
              best('3 metres', N('Yes. 6 × 50 = 300 cm, and 100 cm make a metre, so 3 metres.')),
              opt('30 metres', N('Too far! 6 × 50 = 300 cm. Divide by 100 to get metres: 3.')),
              opt(
                '300 metres',
                N('300 is right in centimetres! In metres it’s 3, because 100 cm is 1 metre.'),
              ),
            ],
          ),
        ],
      ),
      sR(
        'lb08-moved',
        [
          MAI('It’s not gone. I moved it, after Mum drew the map.', 'happy'),
          MAI('Treasure that’s exactly where the map says is too easy.'),
          NED('That’s not FAIR.', 'angry'),
          N('Ned sits down in the lane with his spoon. The worm, sensibly, leaves.'),
          MAI('It’s still close. It went north, the way the river comes from.'),
          N('Ned looks at you. He wants to know whose side you are on.'),
        ],
        [
          ask(
            3,
            m(
              'literacy',
              'your view and a character’s view',
              'Your child compared their own view of fairness with Maisie’s and Ned’s.',
              'RL.3.6',
            ),
            [N('Maisie thinks tricky is fun. Ned thinks a map should be true. What do YOU think?')],
            [
              opt(
                'Fair: games should surprise you',
                N('Maisie would agree. Surprises are half the fun of treasure hunts.'),
              ),
              opt(
                'Not fair: Ned trusted the map',
                N('Ned would agree. Trusting something and finding it untrue feels bad.'),
              ),
              opt(
                'Fair only if everyone knows the rule',
                N(
                  'That’s a careful answer. A trick can be fun, if everyone agreed tricks were allowed.',
                ),
              ),
            ],
          ),
        ],
        [
          ch(
            'fair',
            '“Treasure hunts are meant to be a bit tricky.”',
            [MAI('See? Tricky is the fun bit.'), NED('Tricky is the CROSS bit.', 'angry')],
            { 'lb-map-fair': 'fair' },
          ),
          ch(
            'not-fair',
            '“A map’s a kind of promise, Maisie.”',
            [
              MAI('…I suppose.', 'think'),
              N('Maisie borrows her mum’s pen and draws a small, honest X further along the wall.'),
            ],
            {
              'lb-map-fair': 'promise',
            },
          ),
          ch(
            'ask-why',
            'Ask Maisie why she moved it.',
            [
              MAI(
                'I wanted to be the one who knew something. Ned always finds things first.',
                'soft',
              ),
            ],
            { 'lb-map-fair': 'asked' },
          ),
        ],
      ),
      sR(
        'lb08-complete',
        [
          N(
            'The tin is under a flat stone at the foot of the wall, a few steps north. Ned finds it first, of course.',
          ),
          NED('Raisins!', 'happy'),
          N(
            'He shares them out in fours: four for Maisie, four for you, four for your Nubbin and four for him.',
          ),
          MAI('Next time I’ll tell Mum where I really put it. Probably.'),
          AMA('A map is for keeping, once you’ve used it.', 'happy'),
          N(
            'Ama frames the map and gives it to you. It has a second X now, in a six-year-old’s writing.',
          ),
        ],
        [
          act(
            2,
            m(
              'maths',
              'equal groups',
              'Your child worked out that 4 groups of 4 raisins make 16.',
              '3.OA.A.1',
            ),
            'edu:count:raisins:16',
            [
              N('Four people, four raisins each. How many raisins were in the tin?'),
              N('4 × 4 = 16. Ned shared them into four equal groups.'),
            ],
          ),
        ],
      ),
    ],
    [
      g(
        'compass',
        'A tool, or a drawing on a map, that shows north, south, east and west.',
        'lb08-map',
      ),
      g(
        'landmark',
        'Something easy to spot that helps you find your way, like a big oak.',
        'lb08-map',
      ),
    ],
  ),

  // ------------------------------------------------------------------ LB9
  qR(
    'lb09',
    'Café Larkin',
    {
      'lb09-s1': {
        goal: 'Lay the café table: one plate for each person.',
        hint: 'Four are eating: you, Sam, your Nubbin and Ama. One plate at each chair.',
      },
      'lb09-s2': {
        goal: 'Order lunch at Café Larkin, and be a kind customer.',
        hint: 'Talk to Ned, the waiter. Whatever arrives, be kind.',
      },
    },
    [
      sR(
        'lb09-cafe',
        [
          N('A sign is chalked on the back of a tea tray: CAFÉ LARKIN, OPEN, NUBBINS WELCOME.'),
          N(
            'The café is the garden table, with the good tablecloth on it. Ama doesn’t know about the tablecloth yet.',
          ),
          MAI('I’m the chef. Ned’s the waiter. You’re a customer, and so is Dad.'),
          SAM('I’ll be the customer who sits down. I’m very good at that.'),
          MAI(
            'Your Nubbin’s a customer. And Mum, when she’s back from her round. One plate each, please.',
          ),
          NED('How many persons is that?', 'think'),
        ],
        [
          notice(
            0,
            m(
              'literacy',
              'borrowed words',
              'Your child learned that “café” is borrowed from French, and the accent shows how to say it.',
              'L.2.4',
            ),
            [
              N(
                '“Café” is a French word English borrowed. The little mark on the é tells you to say “caff-ay”.',
              ),
            ],
          ),
        ],
      ),
      sR(
        'lb09-laid',
        [
          N(
            'Four plates, from the toy box and the kitchen: a blue one, a chipped china one, a tin one, and one that is really a frisbee.',
          ),
          N(
            'Your Nubbin sits on a cushion on the fourth chair. It has been given the frisbee, and it approves.',
          ),
          NED('Can I drop the tin one? To check?'),
        ],
        [
          ask(
            2,
            m(
              'science',
              'properties of materials',
              'Your child chose materials by property: tin bends, china can break, plastic is light and tough.',
              '2-PS1-1',
            ),
            [N('Which plate is safest for Ned to carry, in case he drops it?')],
            [
              best(
                'The tin one or the frisbee',
                N(
                  'Yes. Tin and plastic are tough and don’t shatter. China is hard but brittle, so it can break.',
                ),
              ),
              opt(
                'The china one',
                N(
                  'China is hard but brittle: it can crack if dropped. Tin or plastic is safer for Ned.',
                ),
              ),
            ],
          ),
        ],
      ),
      sR(
        'lb09-order',
        [
          N(
            'Ned brings a menu: a drawing of a cake, a drawing of a sandwich, and a drawing nobody can identify.',
          ),
          NED('What would you like? Cake is 4 Shells. Sandwich is also 4. The mystery is free.'),
          Y('The sandwich, please. And three cakes to share.'),
          NED('One sandwich.', 'happy'),
          N(
            'He goes into the kitchen, which is the shed, and returns with great ceremony. On your plate is a pine cone.',
          ),
          NED('Here is your cake.'),
          N(
            'Sam ordered tea and got a stick. Your Nubbin ordered nothing and got three leaves, which it likes best of all.',
          ),
        ],
        [
          act(
            2,
            m(
              'maths',
              'multiplication word problem',
              'Your child worked out the bill for three cakes at 4 Shells each (12).',
              '3.OA.A.3',
            ),
            'edu:count:cakes:12',
            [
              N('Three cakes at 4 Shells each. What’s the bill for the cakes?'),
              N('3 × 4 = 12 Shells. Ned will give it all back as change anyway.'),
            ],
          ),
          ask(
            6,
            m(
              'sel',
              'handling a mistake kindly',
              'Your child thought about what to say when someone gets your order wrong.',
              'CASEL: Relationship skills',
            ),
            [N('The waiter got it wrong. What do you say?')],
            [
              opt(
                'Thank him, then ask nicely for the sandwich',
                N('Kind and clear. Ned feels thanked, and you still get your sandwich.'),
              ),
              opt(
                'Enjoy what came',
                N('Generous. Sometimes the mix-up is more fun than the order.'),
              ),
              opt(
                'Explain politely there’s a mix-up',
                N('Honest and gentle. Blaming “a mix-up”, not Ned, keeps it kind.'),
              ),
            ],
          ),
        ],
        [
          ch(
            'thank-and-ask',
            '“Thank you! Could I have the sandwich as well?”',
            [
              NED('Oh! The sandwich! Coming right up.', 'shock'),
              N('He comes back with a second pine cone. This one, he says, is the sandwich.'),
            ],
            {
              'lb-cafe-reply': 'ask',
            },
          ),
          ch(
            'enjoy',
            'Eat the pine cone with great pleasure.',
            [
              N('You pretend to eat the pine cone, slowly, eyes closed. Ned watches every bite.'),
              Y('Best cake I’ve ever had.'),
            ],
            {
              'lb-cafe-reply': 'enjoy',
            },
          ),
          ch(
            'mix-up',
            '“Excuse me. I think there’s been a little mix-up.”',
            [
              NED('Is it the wrong one?', 'sad'),
              Y('It’s a lovely cake. I ordered the sandwich, that’s all.'),
              NED('I’ll tell the chef. She’ll be cross with the kitchen, not me.'),
            ],
            {
              'lb-cafe-reply': 'mix-up',
            },
          ),
        ],
      ),
      sR(
        'lb09-complete',
        [
          N('Ama comes home and sits down at the fourth plate, still in her post-office jacket.'),
          AMA('Table for one, please. Anything that comes with tea.'),
          N(
            'Ned brings her a real cup of tea, which Sam made, and a pine cone, which Ned made. She is delighted with both.',
          ),
          AMA('Is that my good tablecloth?'),
          MAI('Café Larkin is closed now. The chef has to go.', 'shock'),
          N('Later, Ama paints the tea-tray sign properly and gives it to you for your gate.'),
        ],
        [
          ask(
            4,
            m(
              'literacy',
              'character motive',
              'Your child worked out why Maisie suddenly closes the café.',
              'RL.3.3',
            ),
            [N('Why does Maisie close the café so suddenly?')],
            [
              best(
                'She took the good tablecloth without asking',
                N('Yes! She’s escaping before Mum works it out. Ama is smiling, though.'),
              ),
              opt(
                'The chef got tired',
                N('Maybe, but look at the timing: right after Ama spots the tablecloth.'),
              ),
            ],
          ),
        ],
      ),
    ],
    [
      g('menu', 'A list of the food and drink you can order.', 'lb09-order'),
      g('brittle', 'Hard, but likely to crack or snap rather than bend.', 'lb09-laid'),
    ],
  ),

  // ------------------------------------------------------------------ LB10
  qR(
    'lb10',
    'Boats',
    {
      'lb10-s1': {
        goal: 'Test which of Ned’s things float in the pond.',
        hint: 'Put the cork, the leaf, the pebble and the teaspoon in the shallows, one at a time.',
      },
      'lb10-s2': {
        goal: 'Sail the boats across the Grove pond.',
        hint: 'Pick a boat and set it on the water by the reeds.',
      },
    },
    [
      sR(
        'lb10-pond',
        [
          N(
            'The Larkins come through your gate for the first time, in a line, all lifting and pushing at once.',
          ),
          MAI('We’re making boats. For your pond. We brought things.'),
          N(
            'Ned empties his pockets onto the bank: a cork, a big leaf, a pebble, and a metal teaspoon from the kitchen drawer.',
          ),
          SAM('That’s my good teaspoon.'),
          NED('It’s a boat now.'),
          AMA('Which ones will float, do you think? Let’s predict before we test.'),
        ],
        [
          ask(
            5,
            m(
              'science',
              'predicting',
              'Your child made a prediction to test, the way scientists do.',
              '2-PS1-1',
            ),
            [N('Make a prediction. Will the metal teaspoon float or sink?')],
            [
              opt('Float', N('A fair prediction. Testing will tell us.')),
              opt('Sink', N('A fair prediction. Testing will tell us.')),
            ],
          ),
        ],
      ),
      sR(
        'lb10-test',
        [
          N(
            'One at a time, the things go in the shallows. The cork bobs, and the leaf spins and floats.',
          ),
          N('The pebble goes plop and sits on the bottom. The teaspoon goes plip and joins it.'),
          NED('The spoon’s a submarine.', 'happy'),
          SAM('The spoon is coming out, thank you.'),
        ],
        [
          act(
            1,
            m(
              'science',
              'sorting by property',
              'Your child sorted materials into floaters and sinkers and explained why.',
              '2-PS1-1',
            ),
            'edu:sort:boats:float',
            [
              N('Sort them: floats (cork, leaf) and sinks (pebble, teaspoon).'),
              N(
                'Cork is full of tiny air pockets, so it’s lighter than the same amount of water. Stone and metal are heavier, so they sink.',
              ),
            ],
          ),
        ],
      ),
      sR(
        'lb10-sail',
        [
          N(
            'The boats are built on the bank: a cork with a leaf sail, a bark raft with a twig mast, and a walnut shell with a petal.',
          ),
          MAI('A race! First one across the pond wins.'),
          N('Your Nubbin wades in up to its middle, ready to help. Nubbins love the pond.'),
          AMA('Which one are you sailing?'),
        ],
        [
          notice(
            0,
            m(
              'science',
              'forces on a sailing boat',
              'Your child learned that wind pushing on a sail is an unbalanced force that moves the boat.',
              '3-PS2-1',
            ),
            [
              N(
                'The wind pushes on the sail. If that push is bigger than the water’s drag, the force is unbalanced, and the boat moves.',
              ),
            ],
          ),
        ],
        [
          ch(
            'cork',
            'The cork, with the leaf sail.',
            [N('The cork boat leans into the breeze and sets off, steady as a duck.')],
            { 'lb-boat': 'cork' },
          ),
          ch(
            'raft',
            'The bark raft.',
            [
              N(
                'The raft is slow and flat and sensible. It goes exactly where the breeze tells it.',
              ),
            ],
            { 'lb-boat': 'raft' },
          ),
          ch(
            'walnut',
            'The walnut shell, with Ned.',
            [
              N(
                'The walnut spins in slow circles and goes nowhere at all. Ned thinks it is the best boat of the lot.',
              ),
            ],
            { 'lb-boat': 'walnut' },
          ),
        ],
      ),
      sR(
        'lb10-complete',
        [
          N(
            'The raft wins, in the end, by drifting. Nobody minds, because the walnut is still spinning and Ned is still cheering it.',
          ),
          N('Your Nubbin tows the walnut home, very gently, with its nose.'),
          AMA('What a pond. You’re lucky, having this on your doorstep.', 'soft'),
          SAM('My good teaspoon is still in it.'),
          N(
            'Your Nubbin dives for the teaspoon and brings it back. Sam shakes its wing, very solemnly.',
          ),
        ],
        [
          notice(
            0,
            m('literacy', 'simile', 'Your child spotted a simile: “steady as a duck”.', 'L.4.5'),
            [
              N(
                '“Steady as a duck” compares a boat to a duck using “as”. A comparison with “like” or “as” is called a simile.',
              ),
            ],
          ),
        ],
      ),
    ],
    [
      g('predict', 'To say what you think will happen before you find out.', 'lb10-pond'),
      g(
        'simile',
        'A comparison using “like” or “as”, such as “steady as a duck”.',
        'lb10-complete',
      ),
    ],
  ),

  // ------------------------------------------------------------------ LB11
  qR(
    'lb11',
    'The Big Race',
    {
      'lb11-s1': {
        goal: 'Judge five races and keep a tally of the winners.',
        hint: 'Stand at the skipping-rope finish. One line for every win.',
      },
      'lb11-s2': {
        goal: 'Decide how to run the last race.',
        hint: 'Talk to Ned, face down in the grass.',
      },
    },
    [
      sR(
        'lb11-course',
        [
          N(
            'Maisie marks out a racecourse in the field: flowerpots for the start and a skipping rope for the finish.',
          ),
          MAI('Five races. Me, Ned and your Nubbin. You’re the judge. Dad’s the crowd.'),
          SAM('Hooray.', 'soft'),
          N('Sam is lying beside the finish line, which Maisie says still counts as a crowd.'),
          MAI('Judges keep a tally. One line for every win.'),
          MAI('Ready, steady…'),
        ],
        [
          notice(
            4,
            m(
              'sel',
              'fair judging',
              'Your child thought about what a fair judge does.',
              'CASEL: Responsible decision-making',
            ),
            [
              N(
                'A fair judge watches the finish, not the favourite. Even if you like one runner best, you write down what really happened.',
              ),
            ],
          ),
        ],
      ),
      sR(
        'lb11-five',
        [
          N(
            'Maisie wins the first race, and the second. Your Nubbin wins the third by flapping, and the fourth by accident.',
          ),
          N('Maisie wins the fifth. Ned comes last in every one.'),
          N('After the fifth race, Ned lies face down on the grass and does not get up.'),
        ],
        [
          act(
            1,
            m(
              'maths',
              'tally charts and comparing',
              'Your child made a tally chart of five races and compared the totals.',
              '2.MD.D.10',
            ),
            'edu:tally:races:5',
            [
              N('Your tally: Maisie |||, Nubbin ||, Ned none. That’s 3 + 2 + 0 = 5 races.'),
              N(
                'How many more wins has Maisie than your Nubbin? 3 − 2 = 1. And Ned? He hasn’t got a line yet.',
              ),
            ],
          ),
        ],
      ),
      sR(
        'lb11-facedown',
        [
          MAI('Come on, Ned. One more race.'),
          NED('No. I’m never racing again. I’m staying here.', 'sad'),
          N('His voice comes out muffled, straight into the grass.'),
          MAI('It’s only a game.', 'think'),
          NED('It’s only a game for WINNERS.', 'sad'),
          N(
            'Maisie looks at you. She is six, she has won every race she’s ever run, and she doesn’t know what to do.',
          ),
          SAM('Nobody likes losing, mate. Even in a game.', 'soft'),
        ],
        [
          ask(
            5,
            m(
              'literacy',
              'how characters respond to events',
              'Your child compared how Maisie and Ned each respond to winning and losing.',
              'RL.2.3',
            ),
            [N('Maisie and Ned both feel something about the races. How is each one responding?')],
            [
              opt(
                'Ned hides; Maisie is puzzled',
                N(
                  'Well read. Ned shuts out the world. Maisie has never lost, so she can’t imagine it.',
                ),
              ),
              opt(
                'Ned is cross; Maisie is impatient',
                N('Fair. “It’s only a game” is easy to say when you’re winning.'),
              ),
              opt(
                'They both want to fix it',
                N('Kind answer. Maisie keeps asking him back. That’s her way of caring.'),
              ),
            ],
          ),
        ],
        [
          ch(
            'proper',
            'Race properly. Ned can finish, even if he’s last.',
            [
              N(
                'Ned gets up, slowly. He runs the whole race and comes last, but this time he runs all the way, and you cheer him in.',
              ),
              NED('I came last, but I came ALL the way!', 'happy'),
            ],
            { 'lb-race': 'proper' },
          ),
          ch(
            'let-win',
            'Everyone slows down so Ned wins.',
            [
              N('Everyone jogs, Maisie very slowly and with a face. Ned wins by a mile.'),
              NED('I WON! I’m the fastest in the valley!', 'happy'),
              MAI('It wasn’t a real race.', 'angry'),
              N('Maisie says it quietly, so Ned won’t hear. Then she lets him have it.'),
            ],
            { 'lb-race': 'let-win' },
          ),
          ch(
            'hand',
            'Race holding hands, all together.',
            [
              N(
                'Maisie holds out her hand to Ned, and he takes it. You all run the last race in a line, holding hands.',
              ),
              N('Nobody wins. Everybody crosses the rope at once.'),
              MAI('That’s a draw. Draws are allowed.', 'happy'),
            ],
            { 'lb-race': 'hand' },
          ),
        ],
      ),
      sR(
        'lb11-complete',
        [
          SAM('Right. The crowd needs a sit-down.'),
          N('Sam sits up in the grass. Ned climbs into his lap with grass stuck to his face.'),
          SAM(
            'You know what I like about racing with you lot? Somebody always gets up again.',
            'soft',
          ),
          MAI('Next time I’m inventing a game where losing is the winning.', 'think'),
          N(
            'Ned picks the grass off his face one bit at a time, and gives every bit to your Nubbin.',
          ),
        ],
        [
          ask(
            2,
            m(
              'literacy',
              'theme',
              'Your child thought about the big idea of the race story: getting up again matters more than winning.',
              'RL.4.2',
            ),
            [
              N(
                'Sam says somebody always gets up again. What do you think the race story is really about?',
              ),
            ],
            [
              opt(
                'Losing is part of playing',
                N(
                  'Yes. You can’t have races without someone losing, and that someone is still a player.',
                ),
              ),
              opt(
                'Getting up again is brave',
                N('That’s the heart of it. Ned got up. That counts more than the tally.'),
              ),
              opt(
                'Families look after each other',
                N('Lovely. Every choice had someone looking after Ned.'),
              ),
            ],
          ),
        ],
      ),
    ],
    [
      g(
        'tally chart',
        'A table where you count things by drawing a line for each one.',
        'lb11-course',
      ),
      g('judge', 'Someone who watches carefully and decides fairly who won.', 'lb11-course'),
    ],
    'Reader keeps all three race choices. "Let him win" is framed so the child can see its cost (Maisie’s quiet “It wasn’t a real race”).',
  ),

  // ------------------------------------------------------------------ LB12
  qR(
    'lb12',
    'The Long Grass Campout',
    {
      'lb12-s1': {
        goal: 'Bring a sleeping bag to the Larkins’ long grass at dusk.',
        hint: 'Carry a sleeping bag from your cottage through the Larkins’ gate before dark.',
      },
      'lb12-s2': {
        goal: 'Lie still in the long grass and wait for the first star.',
        hint: 'Lie down with the Larkins and keep still. The stars come when they come.',
      },
    },
    [
      sR(
        'lb12-tired',
        [
          N(
            'Late summer. The evenings are long and gold, and the swallows fly low over the Larkins’ field.',
          ),
          AMA('Sam’s asleep. Before tea. On the sofa, with one shoe on.', 'soft'),
          AMA('He finished a whole table this week. He’s allowed.'),
          MAI('We need a game where Dad has to lie down.', 'think'),
          NED('Dad already lies down.'),
          MAI('A game where lying down IS the game.', 'happy'),
          N(
            'Maisie explains it at speed: sleeping bags, the long grass, everyone very still, first to see a star wins.',
          ),
          AMA('Camping in the garden? Go on, then. Bring your Nubbin, and a sleeping bag.'),
        ],
        [
          notice(
            3,
            m(
              'sel',
              'understanding others’ needs',
              'Your child saw Maisie invent a game that fits what her tired dad needs.',
              'CASEL: Social awareness',
            ),
            [
              N(
                'Maisie doesn’t try to fix Dad’s tiredness. She makes a game that fits it. Noticing what someone needs is a kind of love.',
              ),
            ],
          ),
        ],
      ),
      sR(
        'lb12-arrive',
        [
          N(
            'At dusk you carry your sleeping bag through the Larkins’ gate. Sam is awake now, in pyjamas, holding a torch.',
          ),
          SAM(
            'I hear there’s a game where I have to lie down. I’ve been practising all day.',
            'happy',
          ),
          AMA('Sunset was at twenty to nine. Stars by quarter past, if we’re lucky.'),
        ],
        [
          ask(
            2,
            m(
              'maths',
              'time intervals',
              'Your child worked out the time from 8:40 to 9:15 (35 minutes).',
              '3.MD.A.1',
            ),
            [N('From 8:40 to 9:15, how long will everyone have to lie still?')],
            [
              best(
                '35 minutes',
                N('Yes. 8:40 to 9:00 is 20 minutes, and 9:00 to 9:15 is 15 more. 35 minutes.'),
              ),
              opt(
                '25 minutes',
                N('Close. 8:40 to 9:00 is 20, then 15 more to 9:15. That makes 35.'),
              ),
              opt(
                'An hour',
                N('Not quite that long. 20 minutes to nine o’clock, then 15 more: 35 minutes.'),
              ),
            ],
          ),
        ],
      ),
      sR(
        'lb12-waiting',
        [
          N(
            'Everyone lies in a row in the long grass: Ama, Sam, Maisie, Ned, you, and your Nubbin, already half asleep.',
          ),
          N('The sky goes from gold to pink to a deep, slow blue. A bat flickers over the hedge.'),
          MAI('The rules. Nobody talks. Nobody wriggles. The first to see a star says STAR.'),
          N('For a long time nobody does anything. It is the stillest the Larkins have ever been.'),
          SAM('It’s winter in Brisbane now. My mum’s wearing a jumper.', 'soft'),
          NED('Why?'),
          SAM(
            'The Earth is tilted. While our half leans towards the Sun, her half leans away. Then they swap.',
          ),
        ],
        [
          notice(
            6,
            m(
              'science',
              'why the hemispheres have opposite seasons',
              'Your child learned that the Earth’s tilt gives the north and south opposite seasons.',
              '1-ESS1-2',
            ),
            [
              N(
                'Brisbane is in Australia, in the southern hemisphere. The valley is in the northern one.',
              ),
              N(
                'The Earth’s axis is tilted. When the north leans towards the Sun it’s summer here, and winter in the south.',
              ),
            ],
          ),
        ],
        [
          ch(
            'wish',
            'Make a quiet wish for the Larkins.',
            [
              N(
                'You make a wish. You don’t say it out loud, because that is the rule with wishes.',
              ),
            ],
            { 'lb-star-wish': 'wish' },
          ),
          ch(
            'hum',
            'Hum something very quietly.',
            [
              N(
                'You hum a tune you half remember. After a while Ama hums it too, and gets the end right.',
              ),
            ],
            { 'lb-star-wish': 'hum' },
          ),
          ch(
            'watch-nubbin',
            'Watch your Nubbin fall asleep.',
            [N('Your Nubbin’s emote ball dims to a soft glow, then goes out. It is asleep.')],
            { 'lb-star-wish': 'nubbin' },
          ),
        ],
      ),
      sR(
        'lb12-star',
        [
          N('Ned sees it first: one bright point over the hedge, low in the west.'),
          NED('STAR!', 'happy'),
          AMA('That might be a planet, actually. Never mind. It counts.'),
          N(
            'Then another star, and another, until there are too many to say STAR about, so everyone just looks.',
          ),
        ],
        [
          notice(
            2,
            m(
              'science',
              'stars in day and night',
              'Your child learned the stars are always there; the Sun’s brightness hides them by day.',
              '1-ESS1-1',
            ),
            [
              AMA(
                'The first bright “star” is sometimes a planet, like Venus, shining with reflected sunlight.',
              ),
              AMA(
                'And the stars never go away in the daytime. The Sun is just so bright that we can’t see them.',
              ),
            ],
          ),
        ],
      ),
      sR(
        'lb12-complete',
        [
          N(
            'Sam is asleep again in the long grass, with Ned asleep on his arm. Maisie is trying very hard not to be.',
          ),
          MAI('That was the best game we ever made up.', 'soft'),
          AMA('It was. Lying still together. It’s hard, and you all did it.', 'soft'),
          N('Your Nubbin is asleep in Ned’s box. Ama looks at it, and then at you.'),
          AMA('That box should stay out here for good, I think. It’s earned its place.'),
          N(
            'In the morning there is a small painted box on your doorstep, with a note: FOR YOUR NUBBIN FROM NED (HE DID THE N).',
          ),
        ],
        [
          ask(
            2,
            m(
              'sel',
              'what makes time together special',
              'Your child thought about why the stillest game of the summer was the best one.',
              'CASEL: Self-awareness',
            ),
            [
              N(
                'No winners, no prizes, nobody moved. Why was lying still together the best game of the summer?',
              ),
            ],
            [
              opt(
                'Everyone was included, even tired Sam',
                N('Yes. It was the one game the whole family could play at once.'),
              ),
              opt(
                'Waiting made the stars special',
                N('That’s true. Things you wait for can feel bigger when they come.'),
              ),
              opt(
                'It was calm after a busy summer',
                N('Wise. After shops and races and dens, quiet can be the treat.'),
              ),
            ],
          ),
        ],
      ),
    ],
    [
      g(
        'hemisphere',
        'Half of the Earth, such as the northern half or the southern half.',
        'lb12-waiting',
      ),
      g('tilted', 'Leaning to one side instead of standing straight.', 'lb12-waiting'),
    ],
  ),
];

const READER_VARIANTS: EduScene[] = [
  sR(
    'lb12-complete-wish',
    [
      N(
        'Sam is asleep again in the long grass, with Ned asleep on his arm. Maisie is trying very hard not to be.',
      ),
      MAI('That was the best game we ever made up.', 'soft'),
      MAI('Did your wish come true yet?', 'soft'),
      N('You say you can’t tell her, because that is the rule. She nods, very seriously, and falls asleep in the middle of the nod.'),
      AMA('Lying still together. It’s hard, and you all did it.', 'soft'),
      N('Your Nubbin is asleep in Ned’s box. Ama looks at it, and then at you.'),
      AMA('That box should stay out here for good, I think. It’s earned its place.'),
      N(
        'In the morning there is a small painted box on your doorstep, with a note: FOR YOUR NUBBIN FROM NED (HE DID THE N).',
      ),
    ],
    [
      ask(
        3,
        m(
          'sel',
          'wishes, secrets and surprises',
          'Your child thought about why a wish is kept to yourself, and which secrets are kind ones.',
          'CASEL: Responsible decision-making',
        ),
        [N('Why do people keep a wish to themselves? Is a wish the same kind of secret as a surprise present?')],
        [
          opt('Saying it might spoil it', N('That’s the old rule. A wish kept quiet feels more like your own.')),
          opt('It’s a happy secret, like a present', N('Yes. Some secrets are kind ones, kept so that someone is glad later.')),
        ],
      ),
    ],
  ),
  sR(
    'lb06-door-big',
    [
      N(
        'The big box goes on its side at the front of the den, flaps open. You can crawl through without bending your neck.',
      ),
      NED('It’s a front door. With a roof on the door.', 'happy'),
      MAI('You have to knock first. That’s the rule.'),
    ],
    [
      notice(
        0,
        m(
          'maths',
          'turning a shape',
          'Your child noticed that a box on its side is the same shape, just turned.',
          'K.G.A.2',
        ),
        [
          N(
            'On its side, the box is still a cuboid. Turning a shape doesn’t change what it is, only how it looks.',
          ),
        ],
      ),
    ],
  ),
  sR(
    'lb06-door-long',
    [
      N(
        'The long box lies flat at the front of the den, open at both ends. You crawl through it like a tunnel.',
      ),
      NED('It’s a tunnel door. You have to wriggle.', 'happy'),
      N('Your Nubbin wriggles through first, gets stuck halfway, then gets unstuck.'),
    ],
    [
      notice(
        0,
        m(
          'literacy',
          'simile',
          'Your child spotted a simile: crawling through “like a tunnel”.',
          'L.4.5',
        ),
        [N('“Like a tunnel” is a simile: it compares the box to something else using “like”.')],
      ),
    ],
  ),
  sR(
    'lb06-door-tall',
    [
      N(
        'The tall box stands at the front of the den with a hole cut low in one side. You step in, then duck down into the den.',
      ),
      NED('It’s a lift. It goes DOWN to the den.', 'happy'),
      MAI('Lifts don’t… Fine. It’s a lift.'),
    ],
    [
      notice(
        1,
        m(
          'literacy',
          'multiple-meaning words',
          'Your child noticed that “lift” can mean a machine that carries people, or to raise something.',
          'L.3.4',
        ),
        [
          N(
            '“Lift” has two meanings: a little room that carries people up and down, or to pick something up.',
          ),
        ],
      ),
    ],
  ),
  sR(
    'lb12-ned-proper',
    [
      N('Ned arrives at a run, in his pyjamas, shouting. He has been proud of himself all week.'),
      NED('I’m here! I’m the one who came last ALL the way!', 'happy'),
      SAM('Loudest camper in the valley. Love it. Shh now.', 'soft'),
    ],
    [
      notice(
        1,
        m(
          'literacy',
          'character traits',
          'Your child saw how finishing the race changed Ned: proud of effort, not the result.',
          'RL.3.3',
        ),
        [N('Ned lost, but he finished. Now he is proud of his effort, and loud about it.')],
      ),
    ],
  ),
  sR(
    'lb12-ned-let-win',
    [
      N(
        'Ned strolls in with his sleeping bag over his shoulder like a cape, a bit too pleased with himself.',
      ),
      NED('Make way for the fastest boy in the valley.', 'happy'),
      MAI('He’s been saying that for a week.'),
      N('Maisie lets him say it once more. Then she gives him a look, and he stops, mostly.'),
    ],
    [
      notice(
        3,
        m(
          'literacy',
          'consequences of choices',
          'Your child saw the cost of letting Ned win: he believes something untrue, and Maisie puts up with it.',
          'RL.3.3',
        ),
        [
          N(
            'Letting Ned win made him happy, but now he believes he’s the fastest. Maisie is patient about it. Kindness can have a cost.',
          ),
        ],
      ),
    ],
  ),
  sR(
    'lb12-ned-hand',
    [
      N('Ned arrives holding Maisie’s hand. He has hardly let go of it since the race, Ama says.'),
      NED('We’re a team. Teams hold hands.', 'soft'),
      MAI('Only sometimes. But tonight, yes.'),
    ],
    [
      notice(
        1,
        m(
          'sel',
          'teamwork',
          'Your child saw how racing together turned rivals into a team.',
          'CASEL: Relationship skills',
        ),
        [
          N(
            'Holding hands in the race turned two rivals into a team. Nobody lost, so nobody had to get over it.',
          ),
        ],
      ),
    ],
  ),
  sR(
    'lb12-box-big',
    [
      N(
        'Ned’s box is out in the long grass, on its side, with a tea towel for a curtain. Tonight it is a house.',
      ),
      NED('It’s our house. You can sleep in it if you’re small.'),
      N('Your Nubbin is small. It goes straight in.'),
    ],
    [
      notice(
        0,
        m(
          'literacy',
          'metaphor in play',
          'Your child noticed the box becoming a house: play works like metaphor.',
          'L.4.5',
        ),
        [
          N(
            'In LB1 you chose the big box because you could live in it. “Tonight it is a house” is a metaphor come true.',
          ),
        ],
      ),
    ],
  ),
  sR(
    'lb12-box-long',
    [
      N(
        'Ned’s box lies in the long grass with a broom-handle mast and a pillowcase sail. Tonight it is a boat.',
      ),
      NED('We’re sailing to the stars. Everybody get in.'),
      N('Nobody fits but Ned and your Nubbin. Everyone else sails alongside, lying very still.'),
    ],
    [
      notice(
        0,
        m(
          'literacy',
          'metaphor in play',
          'Your child noticed the box becoming a boat: play works like metaphor.',
          'L.4.5',
        ),
        [
          N(
            'In LB1 you chose the long box, shaped like a boat. “Tonight it is a boat” is a metaphor come true.',
          ),
        ],
      ),
    ],
  ),
  sR(
    'lb12-box-tall',
    [
      N(
        'Ned’s box stands in the long grass with a paper cone on top and NED ROCKET down the side. Tonight it is a rocket.',
      ),
      NED('Ten, nine… seven… one. Blast off!', 'happy'),
      N(
        'Ned lies down next to it. The rocket stays exactly where it is, which is how the best rockets work.',
      ),
    ],
    [
      notice(
        1,
        m(
          'maths',
          'counting backwards',
          'Your child noticed Ned skipped numbers in his countdown and filled in the gaps.',
        ),
        [
          N(
            'Ned skipped eight, three and a few more. A full countdown goes 10, 9, 8, 7, 6, 5, 4, 3, 2, 1.',
          ),
        ],
      ),
    ],
  ),
];

// ================================================================ edu exports

/** The Learning Grove versions of LB1–LB12, by band (the wiring task adds them to EDU_QUESTS). */
export const LINE_LB_EDU: Record<EduBand, EduQuest[]> = { sprout: SPROUT, reader: READER };

/** The Learning Grove versions of LINE_LB_VARIANTS, by band (for EDU_VARIANTS). */
export const LINE_LB_EDU_VARIANTS: Record<EduBand, EduScene[]> = {
  sprout: SPROUT_VARIANTS,
  reader: READER_VARIANTS,
};

/** Every `edu:` check string used by LB’s lessons, both bands. */
export const LINE_LB_EDU_CHECKS: string[] = [
  'edu:sort:boxes:size',
  'edu:sort:boxes:equal-piles',
  'edu:count:shells:5',
  'edu:count:shells:change-7',
  'edu:clap:syllables:cushion',
  'edu:move:hop:tiptoe',
  'edu:measure:jump:tape',
  'edu:order:steps:slow',
  'edu:count:biscuit:4',
  'edu:feel:heartbeat',
  'edu:tap:shape:triangle',
  'edu:tally:weather:week',
  'edu:measure:rug:perimeter',
  'edu:move:wriggle',
  'edu:clap:syllables:rabbit',
  'edu:order:shadows:size',
  'edu:clap:show',
  'edu:order:map:lane',
  'edu:count:steps:6',
  'edu:count:raisins:4',
  'edu:count:raisins:16',
  'edu:count:plates:4',
  'edu:count:cakes:12',
  'edu:sort:boats:float',
  'edu:count:races:5',
  'edu:tally:races:5',
  'edu:count:sleeping-bags:5',
  'edu:count:down:10',
];
