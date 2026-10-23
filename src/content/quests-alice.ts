/**
 * Fun quests Q66–Q75: Down the Rabbit-Hole (based on Lewis Carroll's
 * "Alice's Adventures in Wonderland", 1865, and "Through the Looking-Glass", 1871).
 *
 * Source and rights: both novels are public domain (Carroll, d. 1898). Only the short passages
 * the outline lists are quoted, from the Project Gutenberg texts (Wonderland #11, Looking-Glass
 * #12). Every quoted line was checked word for word against those editions on 2026-10-18
 * (#11 as updated 2025-06-26, #12 as updated 2026-06-11): Carroll's italics are set in
 * capitals, and a quote his narration splits ("said the Hatter") is joined into one line.
 * Two were corrected to his words: the Queen's "Off with their heads!" and the Red Queen's
 * "Now, HERE, you see". Everything else is new prose. Characters keep their Carroll names.
 * Audience: all. Every quoted line has a `childLines` replacement for the Learning Grove.
 * Frame: two dreams. Wonderland is Q66-Q71 (a hot summer afternoon by the stream, after
 * chapter 2); Looking-Glass is Q72-Q75 (a rainy autumn evening by the cottage fire, after Q71).
 * Your Nubbin never speaks. You are a second dreamer a step behind Alice.
 * Grove flags read: none. Grove flags written: none. The pack's one choice (Q70) is
 * remembered by three pack-local flags (q70-coat, q70-garden, q70-mirror), read by
 * Q71 and Q75 through _VARIANTS. Nothing is daily; nothing repeats; never during Chapters 9-11.
 * Care notes: no one is hurt on screen; the crash in Q74 is heard, not seen.
 */
import type { Quest, Speaker } from './types';
import type { Line, Mood, Scene } from '../config/story';

const say =
  (who: string) =>
  (text: string, mood?: Mood): Line =>
    mood ? { who, text, mood } : { who, text };

const N = say('narrator');
const Y = say('you');

const WHEN_W = 'A hot summer afternoon, any time after chapter 2 (never during Chapters 9–11)';
const WHEN_L = 'A rainy autumn evening, after Q71 (never during Chapters 9–11)';
const WHEN_NEXT = (q: string) => `Straight after ${q} (never during Chapters 9–11)`;
const WHERE_STREAM = 'The stream bank, in the shade of the hedge';
const WHERE_FIRE = 'By the cottage fire, in front of the mantelpiece mirror';

const spk = (id: string, name: string, basedOn: string): Speaker => ({ id, name, kind: 'other', basedOn });
const ALICE = spk('alice', 'Alice', 'Alice (Alice’s Adventures in Wonderland)');
const RABBIT = spk('white-rabbit', 'The White Rabbit', 'The White Rabbit (Wonderland)');
const DODO = spk('dodo', 'The Dodo', 'The Dodo (Wonderland)');
const MOUSE = spk('mouse', 'The Mouse', 'The Mouse (Wonderland)');
const CATERPILLAR = spk('caterpillar', 'The Caterpillar', 'The Caterpillar (Wonderland)');
const CAT = spk('cheshire-cat', 'The Cheshire Cat', 'The Cheshire Cat (Wonderland)');
const HATTER = spk('hatter', 'The Hatter', 'The Hatter (Wonderland)');
const HARE = spk('march-hare', 'The March Hare', 'The March Hare (Wonderland)');
const QUEEN = spk('queen-of-hearts', 'The Queen of Hearts', 'The Queen of Hearts (Wonderland)');
const KINGH = spk('king-of-hearts', 'The King of Hearts', 'The King of Hearts (Wonderland)');
const CARD2 = spk('card-two', 'Two', 'The card-gardeners (Wonderland)');
const CARD5 = spk('card-five', 'Five', 'The card-gardeners (Wonderland)');
const CARD7 = spk('card-seven', 'Seven', 'The card-gardeners (Wonderland)');
const GRYPHON = spk('gryphon', 'The Gryphon', 'The Gryphon (Wonderland)');
const TURTLE = spk('mock-turtle', 'The Mock Turtle', 'The Mock Turtle (Wonderland)');
const REDQ = spk('red-queen', 'The Red Queen', 'The Red Queen (Through the Looking-Glass)');
const WHITEQ = spk('white-queen', 'The White Queen', 'The White Queen (Through the Looking-Glass)');
const DEE = spk('tweedledee', 'Tweedledee', 'Tweedledee (Through the Looking-Glass)');
const DUM = spk('tweedledum', 'Tweedledum', 'Tweedledum (Through the Looking-Glass)');
const HUMPTY = spk('humpty', 'Humpty Dumpty', 'Humpty Dumpty (Through the Looking-Glass)');
const KNIGHT = spk('white-knight', 'The White Knight', 'The White Knight (Through the Looking-Glass)');

const AL = say('alice');
const RB = say('white-rabbit');
const DO = say('dodo');
const MO = say('mouse');
const CP = say('caterpillar');
const CC = say('cheshire-cat');
const HT = say('hatter');
const MH = say('march-hare');
const QH = say('queen-of-hearts');
const KH = say('king-of-hearts');
const C2 = say('card-two');
const C5 = say('card-five');
const C7 = say('card-seven');
const GR = say('gryphon');
const MT = say('mock-turtle');
const RQ = say('red-queen');
const WQ = say('white-queen');
const TD = say('tweedledee');
const TM = say('tweedledum');
const HD = say('humpty');
const WK = say('white-knight');

export const QUESTS_ALICE: Quest[] = [
  // ------------------------------------------------------------------ Q66
  {
    id: 'q66',
    code: 'Q66',
    title: 'Down the Rabbit-Hole',
    source: 'Alice’s Adventures in Wonderland: the rabbit-hole and the pool of tears',
    audience: 'all',
    trigger: { where: WHERE_STREAM, when: WHEN_W },
    speakers: [RABBIT, ALICE],
    steps: [
      {
        id: 'q66-s1',
        goal: 'Follow the White Rabbit under the hedge.',
        hint: 'Walk to the hedge where the Rabbit vanished. Your Nubbin is already trotting after it.',
        check: 'walk:q66-rabbit-hole',
        scene: {
          id: 'q66-intro',
          lines: [
            N('It is a hot afternoon, the kind that makes the stream sound sleepy. Your Nubbin is a warm weight on your chest.'),
            N('A rabbit trots past in a waistcoat. It takes a watch out of its pocket and looks at it.'),
            RB('Oh dear! Oh dear! I shall be late!', 'shock'),
            N('It dives under the hedge. A girl in a blue pinafore dives in after it, without stopping to think.'),
            N('Your Nubbin opens one eye, considers the hedge, and decides that it is interested.'),
            Y('Well. If it is going to be a dream, I may as well see it properly.'),
          ],
        },
        done: {
          id: 'q66-fall',
          lines: [
            N('The hole runs straight on like a tunnel, then dips, and then you are falling.'),
            N('You fall slowly, so slowly that you have time to look at the cupboards and bookshelves on the walls.'),
            N('A jar goes by, labelled ORANGE MARMALADE, and empty. Alice puts it back on a shelf as she passes, politely.'),
            AL('I shall never grumble about stairs again. Not after this.'),
            N('Your Nubbin turns gently, with its arms out. It would like this to go on for a while.'),
          ],
        },
      },
      {
        id: 'q66-s2',
        goal: 'Swim your Nubbin out of the pool of tears.',
        hint: 'Drink from the bottle, then swim across the pool to the dry edge. Your Nubbin paddles beside you.',
        check: 'swim:q66-tear-pool',
        scene: {
          id: 'q66-hall',
          lines: [
            N('You land in a long, low hall full of doors, every one of them locked.'),
            N('On a glass table lie a tiny golden key and a bottle with a paper label: DRINK ME.'),
            AL('It does not say POISON. I suppose that is something.'),
            N('Alice drinks, and your Nubbin takes a very small sip, and so do you. The hall seems to lift up around you.'),
            N('Everyone is ten inches high. The key on the table is now a mile above your head.'),
            AL('Curiouser and curiouser!', 'shock'),
            N('Alice sits down and cries, a great deal, for a girl that size. The tears gather in a pool round your boots.'),
            N('Your Nubbin is already paddling in it, with its chin up.'),
          ],
          choices: [
            {
              id: 'carry',
              label: 'Lift your Nubbin onto your shoulders and wade.',
              then: [N('Your Nubbin hangs on to your hair. It is still very wet.')],
            },
            {
              id: 'swim',
              label: 'Swim beside your Nubbin and let it set the pace.',
              then: [N('It sets a brisk paddle, ears up. You follow.')],
            },
          ],
        },
        done: {
          id: 'q66-bank',
          lines: [
            N('You drag yourselves out on the far side. A crowd of dripping creatures is already there.'),
            N('Your Nubbin shakes itself like a dog. Everyone near it gets wetter.'),
            AL('I am sorry. I did not mean to cry so much. I shall try to be a little less enormous.'),
          ],
        },
      },
    ],
    complete: {
      id: 'q66-complete',
      lines: [
        N('The bottle is still in your pocket, with its label and its cork. When you shake it, nothing at all moves inside.'),
        N('Alice looks at it with great respect. She says it is the most honest bottle she has ever seen.'),
        Y('It says DRINK ME. It does not say why.'),
        AL('That is very Wonderland of it.', 'happy'),
        N('The wet creatures are muttering about getting dry. Someone is bound to have an idea.'),
        N('Your Nubbin is already running toward them. You follow, as usual, a step behind.'),
      ],
    },
    rewards: [
      {
        id: 'drink-me-bottle',
        kind: 'decor',
        label: 'DRINK ME Bottle',
        description: 'A small glass bottle with a paper label. It does nothing at all.',
      },
    ],
    childLines: {
      'q66-intro#2': 'Late, late, late! And my watch has stopped at teatime again!',
      'q66-hall#5': 'Stranger and stranger! Is that the right word? It is now.',
    },
    notes:
      'The dream opens with a soft dissolve into green (stream, dappled light). The fall is a slow vertical scroll with shelves ' +
      'passing; no hard landing. Step 2 uses the Grove swim animation in a shallow pool of tears (the Nubbin swims even if it is ' +
      'not a Swim type). Everyone is shrunk by a camera zoom, not a model change. The bottle decor does nothing when used. ' +
      '"Oh dear! Oh dear! I shall be late!" and "Curiouser and curiouser!" are each used once, both swapped in childLines. ' +
      'Alice is the heroine; the player only follows.',
  },

  // ------------------------------------------------------------------ Q67
  {
    id: 'q67',
    code: 'Q67',
    title: 'A Caucus-Race',
    source: 'Alice’s Adventures in Wonderland: the Caucus-race',
    audience: 'all',
    trigger: { where: WHERE_STREAM, when: WHEN_NEXT('Q66') },
    requires: ['Q66'],
    speakers: [DODO, MOUSE, ALICE],
    steps: [
      {
        id: 'q67-s1',
        goal: 'Run your Nubbin round the Dodo’s caucus-course.',
        hint: 'The course is a loose circle on the bank. Run your Nubbin round it with the Mouse, the Duck and the Lory, any speed, any direction.',
        check: 'race:caucus:finish',
        scene: {
          id: 'q67-intro',
          lines: [
            N('The creatures on the bank are soaked, cross and cold. A large bird with a very upright manner is addressing them.'),
            DO('The best way to get dry is a Caucus-Race. I propose it at once.', 'think'),
            N('The Dodo marks out a course in a sort of circle, using its beak and some hard looks.'),
            DO('Nobody starts when I say. Everybody starts when they like. Everybody stops when they like.'),
            MO('How will we know when it is over?', 'sad'),
            DO('That is a very good question. Nobody has ever asked it before. Off you go.', 'shock'),
            N('Your Nubbin is already running, the Duck is running the other way, and the Lory has gone round twice.'),
          ],
        },
        done: {
          id: 'q67-over',
          lines: [
            N('After half an hour, everyone is quite dry. The Dodo ends the race by announcing that it has ended.'),
            DO('The race is over!', 'happy'),
            MO('But who won?', 'think'),
            N('The Dodo sits and thinks for a long time, with one claw on its forehead.'),
          ],
        },
      },
      {
        id: 'q67-s2',
        goal: 'Hand out Alice’s comfits as prizes.',
        hint: 'Alice has a box of comfits in her pocket. Give one to every racer, then one to the Dodo.',
        check: 'give:item:comfit:caucus-racers',
        scene: {
          id: 'q67-prizes',
          lines: [
            DO('EVERYBODY has won, and all must have prizes.', 'happy'),
            AL('Then who is going to give them out?'),
            DO('Why, you are, of course.', 'neutral'),
            N('Alice finds a box of comfits in her pocket, rather squashed, and hands them round with great care.'),
            N('There is exactly one each, for every creature. You hold the box while Alice does the counting.'),
            N('Your Nubbin takes its comfit and puts it on top of its head, for later.'),
            MO('And what about you? You must have a prize too.'),
            AL('I have only a thimble in my pocket.', 'soft'),
            N('The Dodo solemnly presents Alice with her own thimble. Everyone cheers, politely.'),
          ],
        },
      },
    ],
    complete: {
      id: 'q67-complete',
      lines: [
        N('The Dodo gives a short speech, which is mostly the word “elegant”.'),
        DO('Splendid! Quite splendid! I could not have arranged it better myself.', 'happy'),
        N('Your Nubbin has fallen asleep with its comfit on its head, and no one wishes to disturb it.'),
        Y('That is the best race I have ever run.'),
        AL('You did not win it, though. Nobody did.', 'happy'),
        Y('That is why.'),
        N('Alice laughs. The Dodo says “Hear, hear!” without knowing why.'),
      ],
    },
    rewards: [
      {
        id: 'thimble-hat',
        kind: 'cosmetic',
        label: 'Thimble Hat',
        description: 'A silver thimble that fits a Nubbin like a very small helmet.',
      },
      {
        id: 'caucus-mode',
        kind: 'feature',
        label: 'Caucus Mode',
        description: 'A fun race on the race track with no placings. Run it whenever you like; everybody gets a prize.',
      },
    ],
    childLines: {
      'q67-prizes#0': 'The race is over! Who won? All of you. Who lost? Nobody. Splendid.',
    },
    notes:
      'The caucus course is an unmarked ring; use the race scene with a flat circle, no lanes. The Duck and Lory are background ' +
      'critters (they do not speak). The check passes when the player Nubbin has circled at least once and stopped. Caucus mode ' +
      'unlocks as a race option with no placings and no timer, with a prize screen that always lists everyone. The approved quote ' +
      '"EVERYBODY has won, and all must have prizes." is used once; swapped in childLines with the Learning Grove Dodo line.',
  },

  // ------------------------------------------------------------------ Q68
  {
    id: 'q68',
    code: 'Q68',
    title: 'Advice from a Caterpillar',
    source: 'Alice’s Adventures in Wonderland: Advice from a Caterpillar',
    audience: 'all',
    trigger: { where: 'A toadstool in the long grass, near the Rabbit’s house', when: WHEN_NEXT('Q67') },
    requires: ['Q67'],
    speakers: [CATERPILLAR, ALICE],
    steps: [
      {
        id: 'q68-s1',
        goal: 'Answer the Caterpillar, if you can.',
        hint: 'Sit on the grass in front of the mushroom. Speak when the Caterpillar asks.',
        check: 'talk:caterpillar',
        scene: {
          id: 'q68-intro',
          lines: [
            N('Alice is too big for the Rabbit’s house, and then too small for everything else. She has stopped keeping track.'),
            N('On top of a mushroom sits a blue Caterpillar, blowing bubbles from a long pipe and looking at the sky.'),
            CP('Who are YOU?', 'neutral'),
            AL('I am not sure. I have been so many different sizes since breakfast.'),
            CP('That is not an answer. Explain yourself.', 'angry'),
            N('Your Nubbin hides behind your leg. The Caterpillar turns its sleepy eyes on you.'),
            Y('I am… the one holding the Nubbin.'),
            CP('That is as good an answer as any.', 'think'),
          ],
          choices: [
            {
              id: 'quiet',
              label: 'Say nothing else. Wait.',
              then: [N('The Caterpillar waits with you. It is better at waiting than anyone you have ever met.')],
            },
            {
              id: 'sizes',
              label: 'Ask what size is best.',
              then: [CP('Three inches. It is a very good height.', 'neutral')],
            },
          ],
        },
        done: {
          id: 'q68-mushroom',
          lines: [
            CP('One side of the mushroom makes you tall. The other side makes you small.', 'think'),
            AL('One side of what? The other side of what?'),
            CP('Of the mushroom.', 'soft'),
            N('It slides off its seat and creeps away through the grass. It leaves the mushroom behind, as a favour.'),
          ],
        },
      },
      {
        id: 'q68-s2',
        goal: 'Feed your Nubbin the other side of the mushroom until it is the right size again.',
        hint: 'Break a piece off each side. Feed your Nubbin small bites of the shrinking side until it is back to its own size.',
        check: 'feed:q68-nubbin:mushroom-shrink',
        scene: {
          id: 'q68-nibble',
          lines: [
            N('Your Nubbin has nibbled the wrong side already. Its head is level with the treetops, and it looks surprised.'),
            N('It waves a hand the size of a cartwheel. Birds scatter.'),
            AL('Quick! The other side! Small bites, mind. A very small bite.', 'shock'),
            N('You climb up its arm with a piece of mushroom. It bends down, politely, and opens its mouth.'),
            N('One crumb makes it a house tall. Another brings it to the size of a cow, and then a dog.'),
            N('It stops at a perfect Nubbin size, and sits on a toadstool to think about things.'),
          ],
        },
      },
    ],
    complete: {
      id: 'q68-complete',
      lines: [
        N('Alice keeps the two halves in separate pockets, and marks them with her handkerchief.'),
        AL('I do not feel any different. But I suppose I should not feel different. I should only be different.'),
        Y('That sounds like the Caterpillar’s advice.'),
        AL('It is the only kind of advice he has.', 'happy'),
        N('Your Nubbin is at its own size at last. It pats itself all over to be sure.'),
      ],
    },
    rewards: [
      {
        id: 'mushroom-stool',
        kind: 'decor',
        label: 'Two-Tone Mushroom Stool',
        description: 'A mushroom, red on one side and blue on the other, that makes an excellent stool.',
      },
    ],
    childLines: {
      'q68-intro#2': 'And who might you be? Take your time. I have all afternoon.',
    },
    notes:
      'The Caterpillar is blue, and its pipe produces only soap bubbles in this version. Step 2: the Nubbin model is scaled by ' +
      'feed bites (five tiers); it recovers its size whichever bites you give, but the right side is faster. No stat change. ' +
      '"Who are YOU?" used once; swapped in childLines.',
  },

  // ------------------------------------------------------------------ Q69
  {
    id: 'q69',
    code: 'Q69',
    title: 'A Mad Tea-Party',
    source: 'Alice’s Adventures in Wonderland: A Mad Tea-Party',
    audience: 'all',
    trigger: { where: 'A fork in the path under a tree', when: WHEN_NEXT('Q68') },
    requires: ['Q68'],
    speakers: [CAT, HATTER, HARE, ALICE],
    steps: [
      {
        id: 'q69-s1',
        goal: 'Ask the Cheshire Cat the way.',
        hint: 'Stand under the tree where the grin is. Speak to the Cat.',
        check: 'talk:cheshire-cat',
        scene: {
          id: 'q69-cat',
          lines: [
            N('A grin is hanging in a tree. It is soon followed by a cat, and then, more slowly, by the rest of the cat.'),
            AL('Which way should we go from here, please?'),
            CC('That way lives a Hatter. That way lives a March Hare. Visit whichever you like.', 'soft'),
            AL('But I do not want to go among mad people.'),
            CC('We’re all mad here. I’m mad. You’re mad.', 'happy'),
            N('Your Nubbin sits at the foot of the tree, looking up. The Cat looks down at it for a long time.'),
            N('Your Nubbin says nothing. The Cat nods, as if it were the sensible answer.'),
          ],
        },
        done: {
          id: 'q69-cat-gone',
          lines: [
            CC('It hardly matters which, you see. They will both be at tea.', 'soft'),
            N('It fades from the tail forward. The grin stays a moment after, then follows.'),
          ],
        },
      },
      {
        id: 'q69-s2',
        goal: 'Sit down at the long table and take tea with the Hatter and the Hare.',
        hint: 'Take a seat at the long tea-table. Pass the cups when asked.',
        check: 'sit:q69-tea-table',
        scene: {
          id: 'q69-table',
          lines: [
            N('A table is laid under a tree, for twelve at least, though only three sit at one end.'),
            HT('Full up! Not a seat to spare!', 'angry'),
            AL('There are dozens of empty seats.'),
            N('The Dormouse is asleep in the teapot, with only its nose showing. Your Nubbin tries to climb in beside it.'),
            HT('Why is a raven like a writing-desk?', 'think'),
            AL('I believe I can guess that.'),
            HT('You mean you think you can find the answer?'),
            MH('Take some more tea,', 'happy'),
            AL('I’ve had nothing yet,', 'neutral'),
            HT('You mean you can’t take LESS. It’s very easy to take MORE than nothing.', 'happy'),
          ],
          choices: [
            {
              id: 'pour',
              label: 'Pour tea for the Hare, to be polite.',
              then: [MH('Wrong cup! Everybody move down one place!', 'happy')],
            },
            {
              id: 'riddle',
              label: 'Take a guess at the riddle.',
              then: [HT('Splendid! I have not the slightest idea either.', 'happy')],
            },
          ],
        },
        done: {
          id: 'q69-move-down',
          lines: [
            N('Everyone moves one place round the table. The table does not get any cleaner.'),
            N('Your Nubbin ends up in a different chair every ten seconds. It is having a wonderful time.'),
          ],
        },
      },
      {
        id: 'q69-s3',
        goal: 'Help Alice leave the tea-party without being rude.',
        hint: 'Thank the Hatter, the Hare and the Dormouse, in whatever order feels politest. It is harder than it sounds.',
        check: 'choose:q69-leave',
        scene: {
          id: 'q69-leave',
          lines: [
            AL('Thank you for the tea. I am afraid I must go.', 'soft'),
            HT('Move along! Clean cups! Nobody has used these, but move along!', 'angry'),
            N('The Hare is offering Alice the butter. It is not clear whether it is meant as an apology.'),
            AL('I do not wish to be rude. But I do wish to leave.'),
            N('She looks at you. You look at your Nubbin, which is wearing the Dormouse as a hat.'),
          ],
          choices: [
            {
              id: 'bow',
              label: 'Bow to each of them in turn, and take Alice’s arm.',
              then: [HT('How very formal. We shall have to be formal back.', 'think')],
            },
            {
              id: 'cup',
              label: 'Leave a clean cup at your place.',
              then: [HT('Ah. You are one of those who put things back. How rare.', 'soft')],
            },
          ],
        },
      },
    ],
    complete: {
      id: 'q69-complete',
      lines: [
        N('You leave the table the way you came, with only a little tea on your boots.'),
        N('Behind you the Hatter is still arguing about the time. It is always six o’clock there.'),
        AL('That was the silliest tea-party I have ever been to.', 'happy'),
        Y('Did you like it?'),
        AL('Very much. I shall never say so.', 'happy'),
        N('The Hatter runs after you with his hat, which has a paper ticket in the band. He presses it into your hands.'),
      ],
    },
    rewards: [
      {
        id: 'hatters-hat',
        kind: 'cosmetic',
        label: 'The Hatter’s Hat',
        description: 'A tall hat with a paper ticket in the band that reads “In this Style 10/6”.',
      },
      {
        id: 'long-tea-table',
        kind: 'decor',
        label: 'Long Tea-Table',
        description: 'A very long table laid for twelve, with every cup a different cup.',
      },
    ],
    childLines: {
      'q69-cat#4': 'We are all a bit silly here. I am. You are.',
      'q69-table#4': 'Why is a raven like a writing-desk? Nobody knows!',
      'q69-table#7': 'Have some more tea.',
      'q69-table#8': 'I have not had any yet, so I cannot have more.',
      'q69-table#9': 'You mean you cannot have LESS. It is very easy to have MORE than none.',
    },
    notes:
      'The Hatter’s table has rotating seats; each move-down shifts the cups. The Dormouse speaks rarely and drowsily (as a ' +
      'sound only). Your Nubbin tries to climb into the teapot twice. The hat reward carries the paper ticket as a texture detail. ' +
      '"we’re all mad here. I’m mad. You’re mad.", "Why is a raven like a writing-desk?" and the "Take some more tea" exchange ' +
      '(lines 7 to 9, each speaker finishing the last’s sentence) are each used once; all swapped in childLines.',
  },

  // ------------------------------------------------------------------ Q70
  {
    id: 'q70',
    code: 'Q70',
    title: 'The Queen’s Croquet-Ground',
    source: 'Alice’s Adventures in Wonderland: The Queen’s Croquet-Ground',
    audience: 'all',
    trigger: { where: 'A garden of rose-trees behind high hedges', when: WHEN_NEXT('Q69') },
    requires: ['Q69'],
    speakers: [QUEEN, KINGH, CARD2, CARD5, CARD7, GRYPHON, ALICE],
    steps: [
      {
        id: 'q70-s1',
        goal: 'Help the three card-gardeners hide the white roses.',
        hint: 'Carry a paint pot to each white rose and brush it red before the Queen arrives.',
        check: 'place:q70-rose:painted',
        scene: {
          id: 'q70-roses',
          lines: [
            N('Three playing cards are on their knees by a rose-tree, painting its white roses red as fast as they can.'),
            N('One of them whispers that they planted a white rose-tree by mistake. The others do not whisper for long.'),
            C2('It was Five’s fault. He planted the white one.'),
            C5('Seven jogged my elbow!'),
            C7('Nobody jogged anything. Keep painting.'),
            AL('Why are you painting them?'),
            N('The cards go quiet, and then start painting faster. A trumpet sounds close by.'),
            N('Your Nubbin picks up a brush in its mouth and takes a long red stripe off the lowest rose.'),
          ],
        },
        done: {
          id: 'q70-painted',
          lines: [
            N('The last rose is red just as the procession arrives: cards, a King, and a Queen with an extremely small crown.'),
            N('The Queen looks at the roses, and then at you, for slightly too long.'),
          ],
        },
      },
      {
        id: 'q70-s2',
        goal: 'Say no to the Queen of Hearts.',
        hint: 'The Queen is holding out a small round Nubbin. Choose what you do with it.',
        check: 'choose:q70-croquet',
        scene: {
          id: 'q70-game',
          lines: [
            N('The game starts at once. The mallets are flamingos and the balls are curled-up hedgehogs.'),
            N('The hedgehogs keep unrolling and walking off, which is rather against the rules.'),
            QH('Where is my other ball? Somebody has lost a ball!', 'angry'),
            N('She lifts a small round Nubbin out from under a rose-bush, by the scruff, and puts it in your hands.'),
            QH('You. Use this. Hit it with the flamingo.', 'angry'),
            N('It is the size of a hedgehog, and it is shivering.'),
            N('You think of Hazel’s second rule. You think of it quite clearly.'),
            Y('No.', 'angry'),
            QH('NO?', 'shock'),
          ],
          choices: [
            {
              id: 'coat',
              label: 'Tuck it inside your coat, against your chest.',
              set: { 'q70-coat': true },
              then: [N('You button your coat over it. It is as warm as a loaf from the oven, and it stops shivering.')],
            },
            {
              id: 'garden',
              label: 'Set it down and let it run off under the hedge.',
              set: { 'q70-garden': true },
              then: [N('You put it on the grass. It looks at you for one second and bolts under the hedge, small as a leaf.')],
            },
            {
              id: 'pocket',
              label: 'Give it to Alice, who pockets it beside your own.',
              set: { 'q70-mirror': true },
              then: [N('Alice does not ask a single question. She drops it into her apron with your Nubbin, and the two of them stare out.')],
            },
          ],
        },
        done: {
          id: 'q70-off-with',
          lines: [
            QH('Off with their heads!', 'angry'),
            N('The cards come forward, looking unhappy about it. Alice takes a step back and stands in front of you both.'),
            AL('Nonsense!', 'angry'),
            N('The King lays a timid hand on the Queen’s arm.'),
            KH('Consider, my dear. She is only a child.'),
            N('The Queen goes the colour of a beetroot, and says nothing at all.'),
          ],
        },
      },
    ],
    complete: {
      id: 'q70-complete',
      lines: [
        N('The cards have lowered their spears and drifted away, one at a time, so as not to be noticed.'),
        N('The Gryphon appears beside you, with a large, tired smile.'),
        GR('It’s all her fancy, that: they never executes nobody, you know.', 'happy'),
        Y('Nobody?'),
        GR('Not so you would notice. Come along!', 'happy'),
        N('The croquet ground is still in a muddle. The flamingos have gone off to look for a quieter game.'),
      ],
    },
    rewards: [
      {
        id: 'croquet-lawn',
        kind: 'decor',
        label: 'Croquet Lawn',
        description: 'A neat lawn with hoops. Nubbins push a wooden ball round it. Nobody hits anything.',
      },
    ],
    childLines: {
      'q70-off-with#0': 'Take them away! Take them all away! …Where did everyone go?',
      'q70-complete#2': 'Oh, nobody is ever really sent away here. The Queen only shouts.',
    },
    notes:
      'THE PACK’S ONE CHOICE. The three options set pack-local flags q70-coat, q70-garden or q70-mirror (the third is the ' +
      'give-it-to-Alice option). Q71 step 2 plays the matching witness scene (base q71-witness is the coat version; variants ' +
      'q71-witness-garden and q71-witness-mirror). Q75 plays the matching waking scene (base q75-wake is the coat version; ' +
      'variants q75-wake-garden and q75-wake-mirror). All three are warm. The Queen’s cry is Carroll’s "Off with their ' +
      'heads!" (Wonderland ch. VIII), aimed at the Keeper. The small Nubbin is a seeded child-type Nubbin with no name; it is NEVER added to the player’s ' +
      'roster. "they never executes nobody, you know" (Gryphon) and "Off with their heads!" each used once; both swapped in childLines.',
  },

  // ------------------------------------------------------------------ Q71
  {
    id: 'q71',
    code: 'Q71',
    title: 'Who Stole the Tarts?',
    source: 'Alice’s Adventures in Wonderland: The Mock Turtle’s Story; Who Stole the Tarts?; Alice’s Evidence',
    audience: 'all',
    trigger: { where: 'A court-room under a great painted ceiling', when: WHEN_NEXT('Q70') },
    requires: ['Q70'],
    speakers: [GRYPHON, TURTLE, QUEEN, KINGH, HATTER, ALICE],
    steps: [
      {
        id: 'q71-s1',
        goal: 'Sit with the Mock Turtle and hear his lessons.',
        hint: 'Sit on the shingle beside the Mock Turtle, and listen to the Gryphon’s story.',
        check: 'sit:q71-mock-turtle',
        scene: {
          id: 'q71-turtle',
          lines: [
            N('The Gryphon takes you to a sad old Mock Turtle on a rock, sighing so deeply that the sea moves.'),
            MT('Once I was a real Turtle.', 'sad'),
            MT('We went to school in the sea. Our master was an old Turtle, and we called him Tortoise.', 'think'),
            AL('Why did you call him Tortoise, if he was a Turtle?'),
            MT('Because he taught us, of course.', 'angry'),
            AL('And how many hours of lessons did you have?'),
            MT('Ten hours the first day, nine the next, and so on.', 'think'),
            AL('What a curious plan!'),
            GR('That’s the reason they’re called lessons, because they lessen from day to day.', 'happy'),
          ],
        },
        done: {
          id: 'q71-trumpet',
          lines: [
            N('A trumpet sounds from a long way off. “The trial’s beginning!” cries the Gryphon, and drags you away by the hand.'),
          ],
        },
      },
      {
        id: 'q71-s2',
        goal: 'Stand as a witness at the trial of the Knave of Hearts.',
        hint: 'Climb up into the witness box beside the Hatter, with your Nubbin.',
        check: 'visit:q71-court',
        scene: {
          id: 'q71-witness',
          lines: [
            N('The Knave of Hearts stands in chains, with the stolen tarts on a dish. The King is the judge, and the Queen is, as ever, louder.'),
            N('The Hatter is first on the stand, with a teacup in one hand and a piece of bread in the other.'),
            N('The Hatter, trembling, takes a large bite out of his teacup.'),
            KH('Write that down.'),
            N('The jury writes it down twelve different ways. One of them spells “teacup” with a K.'),
            N('Alice feels a strange feeling. She is growing, a little at a time, and has not yet decided to mind.'),
            QH('Call the next witness!', 'angry'),
            N('The little Nubbin from the croquet ground is called. It climbs out of your coat and sits, solemnly, on your foot.'),
            N('Nobody can think of any question to put to it. The King says “Hmm,” and writes something down.'),
          ],
        },
        done: {
          id: 'q71-grows',
          lines: [
            QH('Sentence first--verdict afterwards.', 'angry'),
            AL('That is the wrong way round!', 'angry'),
            N('She is full size now, and her elbow knocks the jury-box. Twelve small creatures slide into the aisle.'),
          ],
        },
      },
      {
        id: 'q71-s3',
        goal: 'Stand beside Alice while she says what everyone is thinking.',
        hint: 'Stand with Alice in the middle of the court and say nothing. It is a silence with a great deal in it.',
        check: 'talk:q71-alice-full-size',
        scene: {
          id: 'q71-alice',
          lines: [
            QH('Silence! Seize her!', 'angry'),
            AL('Who cares for you? You’re nothing but a pack of cards!', 'angry'),
            N('The whole pack rises up in the air and comes flying down upon her. She gives a little scream, half of fright, half of anger.'),
            N('You hold your Nubbin tightly. Leaves fall across your face, brushing it like small hands.'),
          ],
        },
      },
    ],
    complete: {
      id: 'q71-complete',
      lines: [
        N('You wake on the stream bank, with dry leaves on your face. Your Nubbin is asleep on your chest, breathing in small puffs.'),
        N('The hot afternoon is exactly where you left it. Somewhere beyond the hedge, a rabbit looks at a watch.'),
        Y('That was a curious dream.'),
        N('Your Nubbin snores in agreement.'),
        N('You lie a while and think about a pack of cards, and a queen who always shouts. The sun is a little lower now.'),
        N('Whatever you did in the dream is still, in some way, a little bit true.'),
      ],
    },
    rewards: [
      {
        id: 'pack-of-cards-emote',
        kind: 'cosmetic',
        label: 'Pack of Cards Emote',
        description: 'A burst of playing cards that fly up and flutter down around your Nubbin.',
      },
    ],
    childLines: {
      'q71-turtle#8': 'Lessons get shorter every day, you see. That is why they are called lessons.',
      'q71-grows#0': 'The punishment first, and the story after? That is the wrong way round!',
      'q71-alice#1': 'You can’t frighten me. You’re only playing cards, and I’m awake!',
    },
    notes:
      'PAYOFF OF Q70. Base scene q71-witness is the COAT version. If q70-garden is set, play variant q71-witness-garden instead; ' +
      'if q70-mirror is set, play q71-witness-mirror. All three end identically. Quotes used once each: "That’s the reason ' +
      'they’re called lessons…", "Sentence first--verdict afterwards.", "Who cares for you? … You’re nothing but a pack of ' +
      'cards!". All swapped in childLines. The trial ends with the cards flying up and no one hurt; the waking is on the stream bank.',
  },

  // ------------------------------------------------------------------ Q72
  {
    id: 'q72',
    code: 'Q72',
    title: 'Through the Looking-Glass',
    source: 'Through the Looking-Glass: Looking-Glass House; The Garden of Live Flowers',
    audience: 'all',
    trigger: { where: WHERE_FIRE, when: WHEN_L },
    requires: ['Q71'],
    speakers: [ALICE, REDQ],
    steps: [
      {
        id: 'q72-s1',
        goal: 'Climb through the mantelpiece mirror after Alice.',
        hint: 'Free your Nubbin from the ball of wool, then step up onto the mantelpiece and touch the glass.',
        check: 'walk:q72-mirror',
        scene: {
          id: 'q72-intro',
          lines: [
            N('It is raining on the windows. The fire is low and your Nubbin has tangled itself in a ball of wool, up to the ears.'),
            N('You unwind it. When you look up, the mirror over the mantelpiece has gone soft, like silver mist.'),
            AL('Look! It is turning into mist. It will be easy to get through.', 'happy'),
            N('Alice has been staying since the trial, and is quite at home. She is already on the mantelpiece, one knee through.'),
            N('Your Nubbin follows, trailing wool.'),
            Y('You go first. I am only the one holding the Nubbin.'),
          ],
        },
        done: {
          id: 'q72-room',
          lines: [
            N('On the other side is a room much like your own, except that the chessmen are walking about on the hearth.'),
            N('A White King is stuck in the ashes, and a White Queen is trying to pick him up and put him on the mantelpiece.'),
            N('A book lies open on the table. The letters are all the wrong way round.'),
          ],
        },
      },
      {
        id: 'q72-s2',
        goal: 'Hold the poem up to the looking-glass to read it.',
        hint: 'Pick up the book and hold it up to the mirror on the wall. The words will turn the right way round.',
        check: 'inspect:q72-mirror-poem',
        scene: {
          id: 'q72-poem',
          lines: [
            AL('It is all in mirror-writing! I can only read it if I hold it up to a glass.', 'shock'),
            N('You hold the book up to the glass. Your Nubbin reads over your shoulder, with its lips moving.'),
            N('The first lines come the right way round: “’Twas brillig, and the slithy toves / Did gyre and gimble in the wabe;”'),
            AL('It seems very pretty, but it is rather hard to understand.'),
            N('Your Nubbin nods wisely. It understands about as much as you do.'),
          ],
        },
      },
      {
        id: 'q72-s3',
        goal: 'Run with the Red Queen across the chessboard garden.',
        hint: 'Run as fast as you can beside Alice. The ground slides along with you, so it will not look as if you have moved.',
        check: 'race:q72-red-queen',
        scene: {
          id: 'q72-garden',
          lines: [
            N('In the garden the flowers talk. A Tiger-lily tells Alice she is slow, and a Rose tells her to mind her petals.'),
            RQ('Faster! Faster! No time for chatting!', 'angry'),
            N('The Red Queen has Alice by the hand, and Alice has you by the hand, and you have your Nubbin under one arm.'),
            N('You run until your legs burn, and the trees run with you. Nothing is any nearer, and nothing is any further.'),
            AL('We have been under this tree the whole time! Everything is exactly as it was!', 'shock'),
            RQ('Of course. Now, HERE, you see, it takes all the running YOU can do, to keep in the same place.', 'happy'),
          ],
        },
      },
    ],
    complete: {
      id: 'q72-complete',
      lines: [
        RQ('Faster! Faster! Now look, we haven’t moved an inch. Excellent.', 'happy'),
        N('The Red Queen pats Alice on the head, then pats you, then pats your Nubbin for exactly the same length of time.'),
        Y('Is that what you call a good run?'),
        RQ('It is the best sort. Nobody could ever do better.', 'soft'),
        N('Your Nubbin sits on the grass, panting. It has run further than ever in its life, and nowhere at all.'),
        N('Over the next hedge you can see the squares of a great green chessboard, all the way to the sky.'),
      ],
    },
    rewards: [
      {
        id: 'looking-glass-decor',
        kind: 'decor',
        label: 'Looking-Glass',
        description: 'A tall glass that shows your Grove the wrong way round. Sometimes your Nubbin’s reflection is a beat late.',
      },
      {
        id: 'looking-glass-filter',
        kind: 'feature',
        label: 'Looking-Glass Photo Filter',
        description: 'A Photo mode filter that flips the picture left to right.',
      },
    ],
    childLines: {
      'q72-poem#2': 'The first lines swim the right way round, all about odd little creatures dancing on a hill.',
      'q72-garden#5': 'Of course. Here you have to run as fast as you can just to stay in the same place.',
    },
    notes:
      'The looking-glass decor shows the Grove mirrored; on one idle frame in five a Nubbin’s reflection lags a beat. The filter ' +
      'flips the Photo mode image. The race step is a treadmill: the ground scrolls with the player and the check passes after ten ' +
      'seconds of running, however fast. The Learning Grove poem line summarises the first lines, never quotes them. "’Twas ' +
      'brillig…" and "it takes all the running YOU can do, to keep in the same place" are each used once; both swapped in childLines. ' +
      'q72-complete#0 is the brief’s Learning Grove Red Queen line used as ordinary text. The Tiger-lily and Rose are background ' +
      'voices, not named speakers.',
  },

  // ------------------------------------------------------------------ Q73
  {
    id: 'q73',
    code: 'Q73',
    title: 'Contrariwise',
    source: 'Through the Looking-Glass: Tweedledum and Tweedledee',
    audience: 'all',
    trigger: { where: 'A wood on the second file of the great chessboard', when: WHEN_NEXT('Q72') },
    requires: ['Q72'],
    speakers: [DEE, DUM, ALICE],
    steps: [
      {
        id: 'q73-s1',
        goal: 'Walk to the wood where two small men stand under a tree.',
        hint: 'Walk along the file next to Alice’s. You will hear them before you see them.',
        check: 'walk:q73-wood',
        scene: {
          id: 'q73-intro',
          lines: [
            N('The whole country is a chessboard, with brooks for the lines and hedges for the walls.'),
            AL('I should like to be a Queen, best of all. I only have to reach the Eighth Square.', 'happy'),
            N('You walk the next file along, one square behind her. Your Nubbin steps carefully, never on the lines.'),
            N('Under a tree stand two fat little men, side by side, with their arms round each other’s necks. They wear schoolboy collars.'),
          ],
        },
      },
      {
        id: 'q73-s2',
        goal: 'Help Tweedledum and Tweedledee into their armour, very slowly.',
        hint: 'Hand each of them a bolster, a saucepan, a coal-scuttle and a few other things, one at a time.',
        check: 'give:item:q73-armour:tweedles',
        scene: {
          id: 'q73-argue',
          lines: [
            TD('If you think we are waxworks, you should pay to look.', 'angry'),
            TM('And if you think we are alive, you should say hello.', 'angry'),
            N('They argue about the rattle next. It is a very old rattle, and it is quite broken.'),
            TD('Contrariwise, if it was so, it might be; and if it were so, it would be; but as it isn’t, it ain’t. That’s logic.', 'think'),
            N('They go off to fight, in a sort of order, and ask Alice to help them put on their armour.'),
            N('It takes a long time. The bolsters are meant to go round the neck, and the saucepans on the head.'),
            N('Your Nubbin hands each of them the next thing in turn, with great care, and then a spare in case.'),
            TM('We shall need more bolsters.', 'shock'),
            TD('We shall need a great deal more bolsters.', 'shock'),
          ],
        },
        done: {
          id: 'q73-armoured',
          lines: [
            N('At last they stand in the middle of the wood, wrapped up like parcels, and out of breath.'),
            TD('Now we will fight until six, and then have dinner.', 'angry'),
          ],
        },
      },
      {
        id: 'q73-s3',
        goal: 'Stay with Alice until the huge black crow arrives.',
        hint: 'Wait by the tree. It will not be long.',
        check: 'wait:q73-crow',
        scene: {
          id: 'q73-crow',
          lines: [
            N('A shadow crosses the wood, as black as a tar-barrel.'),
            TD('It is the crow! A monstrous crow!', 'shock'),
            TM('A monstrous crow!', 'shock'),
            N('The two of them run, as fast as their bolsters will let them, which is not very fast. The saucepans rattle all the way.'),
            N('Your Nubbin watches them go. Then it picks up the dropped rattle, shakes it twice, and decides to keep it.'),
          ],
        },
      },
    ],
    complete: {
      id: 'q73-complete',
      lines: [
        N('The wood is quiet again. A few feathers drift down, and Alice catches one and puts it behind her ear.'),
        AL('They were very funny. But I think they were both a little afraid of everything, all the time.'),
        Y('I think they were afraid of being wrong.'),
        TD('Wrong! Unless you’re right. In which case, also wrong.', 'happy'),
        N('Their voices come back faintly through the trees, still arguing. You are not sure which of them said it.'),
        N('You find a saucepan under a bush, and a bolster, and a small broken rattle. They have been left behind, for you.'),
      ],
    },
    rewards: [
      {
        id: 'saucepan-helmet',
        kind: 'cosmetic',
        label: 'Saucepan Helmet',
        description: 'A battered saucepan that makes a very serious helmet.',
      },
      {
        id: 'nubbin-rattle',
        kind: 'cosmetic',
        label: 'Little Rattle',
        description: 'A rattle for your Nubbin. It is quite broken, which is why it is so good.',
      },
    ],
    childLines: {
      'q73-argue#3': 'If it was so, it might be. If it were so, it would be. But it isn’t, so it’s not. That’s logic.',
    },
    notes:
      'Tweedledum and Tweedledee are identical but for their collars, which spell DUM and DEE. Step 2 is a gentle dressing ' +
      'minigame: the Nubbin hands over items in any order; nothing can go wrong. The fight never happens. "Contrariwise, if it ' +
      'was so…That’s logic." is used once; swapped in childLines. q73-complete#3 is the brief’s Learning Grove Tweedledee line ' +
      'used as ordinary text. The crow’s shadow is the only crow; it never lands. Alice is a White Pawn and walks the next file over.',
  },

  // ------------------------------------------------------------------ Q74
  {
    id: 'q74',
    code: 'Q74',
    title: 'Six Impossible Things',
    source: 'Through the Looking-Glass: Wool and Water; Humpty Dumpty',
    audience: 'all',
    trigger: { where: 'A high wall at the end of a wood', when: WHEN_NEXT('Q73') },
    requires: ['Q73'],
    speakers: [WHITEQ, HUMPTY, ALICE],
    steps: [
      {
        id: 'q74-s1',
        goal: 'Pin the White Queen’s shawl back on.',
        hint: 'Catch the shawl in the wind, then pin it on the White Queen, one pin at a time.',
        check: 'give:item:q74-pin:white-queen',
        scene: {
          id: 'q74-shawl',
          lines: [
            N('A shawl blows past, and then the White Queen, running after it with her hair all down one side.'),
            WQ('Oh, my shawl! Pin it on, please. I cannot do it myself, and I have not had any pins.', 'shock'),
            N('You catch the shawl and a few pins. The Queen holds still, if you can call it that.'),
            WQ('The rule is, jam to-morrow and jam yesterday--but never jam to-day.', 'think'),
            AL('But sooner or later it must come to “jam to-day”.'),
            WQ('No, it cannot. To-day is never to-morrow or yesterday, so there is never any.', 'neutral'),
            N('Your Nubbin finishes the last pin and gives it a pat. The Queen cries out about her finger, and then she cries for her finger.'),
          ],
        },
        done: {
          id: 'q74-six',
          lines: [
            WQ('Why, sometimes I’ve believed as many as six impossible things before breakfast.', 'happy'),
            N('She counts them on her fingers, losing track at four, and goes away happier than she came.'),
          ],
        },
      },
      {
        id: 'q74-s2',
        goal: 'Meet Humpty Dumpty on his wall.',
        hint: 'Walk to the high wall. Do not climb it. Alice will do the talking.',
        check: 'talk:humpty',
        scene: {
          id: 'q74-wall',
          lines: [
            N('On top of a wall, with his legs crossed like a tailor, sits a large egg with a face and a tiny cravat.'),
            HD('Stop muttering to yourself and tell me your name and business.', 'angry'),
            AL('My name is Alice.'),
            HD('What a silly name! What does it mean?', 'angry'),
            N('He explains about un-birthdays, and how there are three hundred and sixty-four days a year for presents.'),
            HD('When I use a word, it means just what I choose it to mean--neither more nor less.', 'happy'),
            AL('The question is whether you can make words mean so many different things.'),
            HD('The question is who is in charge. That is all.', 'happy'),
            N('Your Nubbin looks up at him with great respect. He gives it a small cravat, which is his un-birthday present.'),
          ],
        },
      },
      {
        id: 'q74-s3',
        goal: 'Hurry on when you hear the crash.',
        hint: 'Walk away from the wall, towards the trees. Keep close to Alice.',
        check: 'walk:q74-crash',
        scene: {
          id: 'q74-crash',
          lines: [
            N('You are leaving when the wood shakes. It is a heavy crash, as of something very large coming down.'),
            N('Soldiers come running, hundreds of them, tramping through the trees in rows.'),
            N('Nobody on screen is hurt. You hear the sound, and you hurry on.'),
            AL('I think we should leave him to the King’s men. They will know what to do.', 'soft'),
            N('Your Nubbin takes your hand. It does not look back.'),
          ],
        },
      },
    ],
    complete: {
      id: 'q74-complete',
      lines: [
        N('Alice walks a little more quietly for a while. You walk beside her, a step behind.'),
        N('You remember what Humpty said at the wall.'),
        Y('He told me “breakfast” means a nap.'),
        AL('Then I hope he is having a very long breakfast.', 'soft'),
        N('Your Nubbin touches its new cravat and looks up the road. There is a knight in the distance, in armour, falling off a horse.'),
      ],
    },
    rewards: [
      {
        id: 'humpty-cravat',
        kind: 'cosmetic',
        label: 'Humpty’s Cravat',
        description: 'An un-birthday present for your Keeper: a wide cravat that is not quite the right way round.',
      },
    ],
    childLines: {
      'q74-shawl#3': 'The rule is jam tomorrow and jam yesterday, but never jam today.',
      'q74-six#0': 'Sometimes I have believed as many as six impossible things before breakfast.',
      'q74-wall#5': 'When I use a word, it means just what I choose it to mean. No more, no less.',
    },
    notes:
      'The fall is heard, never shown: only the crash sound and the soldiers. No egg, no pieces. The wall stays empty afterwards. ' +
      'Keep the White Queen kind; her jam rule is a joke, not a threat. Quotes used once each: the jam rule, "six impossible things ' +
      'before breakfast", Humpty’s "When I use a word…". All swapped in childLines. q74-complete#1 is the brief’s Learning Grove ' +
      'Humpty line used as ordinary text.',
  },

  // ------------------------------------------------------------------ Q75
  {
    id: 'q75',
    code: 'Q75',
    title: 'It’s My Own Invention',
    source: 'Through the Looking-Glass: “It’s my own invention”; Queen Alice; Which Dreamed It?',
    audience: 'all',
    trigger: { where: 'The last brook, where the great chessboard ends', when: WHEN_NEXT('Q74') },
    requires: ['Q74'],
    speakers: [KNIGHT, ALICE],
    steps: [
      {
        id: 'q75-s1',
        goal: 'Walk the White Knight to the last brook.',
        hint: 'Walk beside him, and help him up each time he falls. He falls rather often.',
        check: 'escort:white-knight:q75-brook',
        scene: {
          id: 'q75-knight',
          lines: [
            N('The Red Knight has been trying to take Alice prisoner. A White Knight arrives, and the two of them fight, and fall off, and fall off again.'),
            N('Afterwards the White Knight takes Alice under his wing. He falls off his horse every few steps.'),
            N('His saddle is hung with things: a box carried upside down, a beehive, a mousetrap.'),
            WK('The box is for keeping the rain out. It’s my own invention.', 'happy'),
            AL('But the lid is open, and everything will fall out.'),
            WK('I never thought of that. It’s my own invention.', 'think'),
            N('He means it both times. Your Nubbin picks up everything he drops and puts it back, in no kind of order.'),
          ],
        },
        done: {
          id: 'q75-brook',
          lines: [
            N('He stops at the last brook, and asks Alice to wave her handkerchief when he reaches the turn in the road.'),
            WK('It might encourage me, you see.', 'soft'),
            N('He rides away, falling off twice before the bend. Alice waves until he is gone.'),
          ],
        },
      },
      {
        id: 'q75-s2',
        goal: 'Cross the brook and join the feast.',
        hint: 'Step over the brook and follow Alice to the long table. Mind the puddings.',
        check: 'walk:q75-feast',
        scene: {
          id: 'q75-feast',
          lines: [
            N('One step over the brook, and Alice puts her hand to her head. There is a golden crown on it.'),
            N('A great feast is laid, with the Red and White Queens in the middle. The puddings speak, and the candles grow up to the ceiling.'),
            N('Alice grows cross, and then cross again, and then she has had quite enough.'),
            AL('I can’t stand this any longer!', 'angry'),
            N('She seizes the Red Queen and shakes her. It gets smaller, and rounder, and softer, and turns into a kitten.'),
          ],
        },
      },
    ],
    complete: {
      id: 'q75-wake',
      lines: [
        N('You wake by the fire, and the rain has stopped. The coals are red and low, and the mantelpiece mirror is only a mirror.'),
        N('Your Nubbin is curled up inside your coat. Beside it is a second warm dent, small and round, and already cooling.'),
        Y('Did you see that?'),
        N('Your Nubbin makes a noise like a very small sigh.'),
        N('You do not know whether you dreamed of Alice, or whether Alice dreamed of you.'),
        N('Which do YOU think it was?'),
      ],
    },
    rewards: [
      {
        id: 'knight-box',
        kind: 'cosmetic',
        label: 'The White Knight’s Box',
        description: 'A box worn upside down as a backpack. It keeps the rain out, but nothing else.',
      },
      {
        id: 'paper-crown',
        kind: 'cosmetic',
        label: 'Small Paper Crown',
        description: 'A paper crown, slightly crumpled, that a Nubbin can wear.',
      },
    ],
    childLines: {
      'q75-knight#3': 'I made it myself! It doesn’t work. That’s how you know it’s new.',
      'q75-knight#5': 'I made this one myself, too. It doesn’t work either. That is how you know it is new.',
      'q75-wake#5': 'Which do you think it was?',
    },
    notes:
      'PAYOFF OF Q70 (five quests later). Base scene q75-wake (the quest’s complete scene) is the COAT version. If q70-garden is ' +
      'set, play variant q75-wake-garden; if q70-mirror is set, play q75-wake-mirror. All three end on the same last line. ' +
      'The Knight’s "It’s my own invention." is used twice (q75-knight#3 and #5; both swapped in childLines); the narration ' +
      'closer "Which do YOU think it was?" is used once (swapped in q75-wake#5, and the same line ends each variant, so apply the ' +
      'same replacement there). The kitten is a plain kitten; no Nubbin transforms.',
  },
];

/** Variant scenes chosen by the Q70 flags (see the notes on Q70, Q71 and Q75). */
export const QUESTS_ALICE_VARIANTS: Scene[] = [
  {
    id: 'q71-witness-garden',
    lines: [
      N('The Knave of Hearts stands in chains, with the stolen tarts on a dish. The King is the judge, and the Queen is, as ever, louder.'),
      N('The Hatter is first on the stand, with a teacup in one hand and a piece of bread in the other.'),
      N('The Hatter, trembling, takes a large bite out of his teacup.'),
      KH('Write that down.'),
      N('The jury writes it down twelve different ways. One of them spells “teacup” with a K.'),
      N('Alice feels a strange feeling. She is growing, a little at a time, and has not yet decided to mind.'),
      QH('Call the next witness!', 'angry'),
      N('A small round Nubbin peeps out of the hedge by the jury box, and then ducks back. It has come to see how things go.'),
      N('Nobody can think of any question to put to it. The King says “Hmm,” and writes something down.'),
    ],
  },
  {
    id: 'q71-witness-mirror',
    lines: [
      N('The Knave of Hearts stands in chains, with the stolen tarts on a dish. The King is the judge, and the Queen is, as ever, louder.'),
      N('The Hatter is first on the stand, with a teacup in one hand and a piece of bread in the other.'),
      N('The Hatter, trembling, takes a large bite out of his teacup.'),
      KH('Write that down.'),
      N('The jury writes it down twelve different ways. One of them spells “teacup” with a K.'),
      N('Alice feels a strange feeling. She is growing, a little at a time, and has not yet decided to mind.'),
      QH('Call the next witness!', 'angry'),
      N('A small round Nubbin pops its head out of Alice’s pocket, right beside yours. They look at each other with great interest.'),
      N('Nobody can think of any question to put to either. The King says “Hmm,” and writes something down.'),
    ],
  },
  {
    id: 'q75-wake-garden',
    lines: [
      N('You wake by the fire. The rain has stopped, and the garden door is open a crack.'),
      N('Your Nubbin is not in your coat. It is out in the wet garden, chasing a white rabbit across the lawn.'),
      Y('Come back!'),
      N('It does not come back, but it will when it is ready. It always has, so far.'),
      N('You do not know whether you dreamed of Alice, or whether Alice dreamed of you.'),
      N('Which do YOU think it was?'),
    ],
  },
  {
    id: 'q75-wake-mirror',
    lines: [
      N('You wake by the fire, and the rain has stopped. In the dark of the mantelpiece mirror, something is moving.'),
      N('A girl on the far side is waking too, with a kitten on her lap. She looks at you and waves.'),
      N('A small round Nubbin peeps out of her pocket. It waves too, with the wrong hand, because it is a mirror.'),
      Y('Hello.'),
      N('Your Nubbin waves back. Then the glass is only glass, and your own face is looking out of it.'),
      N('You do not know whether you dreamed of Alice, or whether Alice dreamed of you.'),
      N('Which do YOU think it was?'),
    ],
  },
];

export const QUESTS_ALICE_CHECKS: string[] = [
  'walk:q66-rabbit-hole',
  'swim:q66-tear-pool',
  'race:caucus:finish',
  'give:item:comfit:caucus-racers',
  'talk:caterpillar',
  'feed:q68-nubbin:mushroom-shrink',
  'talk:cheshire-cat',
  'sit:q69-tea-table',
  'choose:q69-leave',
  'place:q70-rose:painted',
  'choose:q70-croquet',
  'sit:q71-mock-turtle',
  'visit:q71-court',
  'talk:q71-alice-full-size',
  'walk:q72-mirror',
  'inspect:q72-mirror-poem',
  'race:q72-red-queen',
  'walk:q73-wood',
  'give:item:q73-armour:tweedles',
  'wait:q73-crow',
  'give:item:q74-pin:white-queen',
  'talk:humpty',
  'walk:q74-crash',
  'escort:white-knight:q75-brook',
  'walk:q75-feast',
];

/** Pack-local flags set by the Q70 choice; no Grove flag is ever written. */
export const QUESTS_ALICE_FLAGS: string[] = ['q70-coat', 'q70-garden', 'q70-mirror'];
