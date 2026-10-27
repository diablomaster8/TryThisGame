/**
 * Fun quests Q21–Q30: the Mr. Tweed pack (based on Mr. Bean).
 *
 * Mr. Tweed is almost wordless. He mumbles, says single words and mimes; the narrator
 * describes the miming. Everyone else talks normally. Audience 'all' throughout.
 * The only quote from the source is "Teddy!" (Q21), swapped in childLines.
 * All quests are optional, one time only, and have no effect on the story.
 * Never during Chapters 9–11 (`WHEN_SUFFIX` on every trigger).
 */
import type { Quest, Speaker } from './types';
import type { Line, Mood, Scene } from '../config/story';

const say =
  (who: string) =>
  (text: string, mood?: Mood): Line =>
    mood ? { who, text, mood } : { who, text };

/** Narrator. */
const N = say('narrator');
/** Mr. Tweed: mumbles and single words only. */
const T = say('mr-tweed');
/** The player. */
const Y = say('you');

/** Fun quests never trigger during Chapters 9–11 (the Long Night chapters). */
const WHEN_SUFFIX = ' (never during Chapters 9–11)';

const TWEED: Speaker = { id: 'mr-tweed', name: 'Mr. Tweed', kind: 'keeper', basedOn: 'Mr. Bean' };

const INKWELL: Speaker = { id: 'mrs-inkwell', name: 'Mrs Inkwell', kind: 'keeper' };
const PRYCE: Speaker = { id: 'warden-pryce', name: 'Warden Pryce', kind: 'keeper' };
const ODETTE: Speaker = { id: 'odette', name: 'Odette Pennant', kind: 'keeper' };
const RUFUS: Speaker = { id: 'rufus', name: 'Rufus Crankshaw', kind: 'keeper' };

const I = say('mrs-inkwell');
const W = say('warden-pryce');
const O = say('odette');
const R = say('rufus');

export const QUESTS_BEAN: Quest[] = [
  // ------------------------------------------------------------------ Q21
  {
    id: 'q21',
    code: 'Q21',
    title: 'Bear Comes Too',
    source: 'Mr. Bean: Teddy',
    audience: 'all',
    trigger: { where: 'Mr. Tweed’s gate, at the end of the lane', when: 'Any morning after Chapter 2' + WHEN_SUFFIX },
    speakers: [TWEED],
    steps: [
      {
        id: 'q21-s1',
        goal: 'Follow Mr. Tweed’s pointing down to the pond and look for a clue.',
        hint: 'Search the reeds on the near side of the pond. Clues sparkle faintly when you are close.',
        check: 'find:clue:bear-scarf:pond',
        scene: {
          id: 'q21-intro',
          lines: [
            N('A man in a tweed jacket is standing at his gate, patting every pocket he owns. Some of them twice.'),
            N('He checks inside his hat. He checks under a stone. He lifts a sleeping duck, looks underneath, and puts it back with an apologetic pat.'),
            N('This is Mr. Tweed. He lives at the end of the lane and has never, as far as anyone knows, finished a sentence.'),
            T('Hnn.', 'think'),
            N('He holds his hands apart, about the size of a loaf. Then he hugs the empty air, very tenderly.'),
            N('He points at the empty space in his arms, then at you, then at the empty space again, with feeling.'),
            Y('Something’s missing?'),
            T('Bear.', 'sad'),
            N('He makes two little ears on top of his head with his fingers, in case you were unclear on the bear.'),
            N('Then he points down the lane towards the pond, very firmly, and nods as if that settles everything.'),
          ],
          choices: [
            {
              id: 'help',
              label: 'I’ll help you look.',
              then: [
                T('Mm!', 'happy'),
                N('He shakes your hand with both of his, for slightly too long.'),
              ],
            },
            {
              id: 'describe',
              label: 'What does the bear look like?',
              then: [
                N('He mimes: small, brown, one chewed ear, and an expression of enormous dignity.'),
                N('You are not sure how he mimed the dignity. But he did.'),
              ],
            },
            {
              id: 'sniff',
              label: 'Ask your Nubbin to sniff it out.',
              set: { 'q21-sniffer': true },
              then: [
                N('Your Nubbin sniffs Mr. Tweed’s sleeve, sneezes, and trots off towards the pond.'),
                T('Ah!', 'happy'),
              ],
            },
          ],
        },
        done: {
          id: 'q21-scarf',
          lines: [
            N('In the reeds you find a tiny knitted scarf: bear-sized, slightly damp.'),
            N('Mr. Tweed arrives at a jog, sees the scarf, and clutches it to his chest.'),
            T('Ohh.', 'soft'),
            N('He looks at the empty pond, then at the sky, and sulks so hard his whole face folds in.'),
          ],
        },
      },
      {
        id: 'q21-s2',
        goal: 'Follow the little wild Nubbin up the hill and find where it took the bear.',
        hint: 'Wild Nubbins nest in the long grass near the top of the western hill. Walk slowly, or it will hide.',
        check: 'find:item:tweed-bear',
        scene: {
          id: 'q21-sulk',
          lines: [
            N('Mr. Tweed sits on a rock and sulks. It is a professional sulk, with the bottom lip and everything.'),
            N('Every so often he glances up the western hill, then away, then up again.'),
            Y('Is the bear up there?'),
            N('He shrugs. It is a very small shrug, about the size of a bear.'),
            N('Then he points at a wild Nubbin waddling uphill with something brown in its arms.'),
            T('Hm!', 'angry'),
            N('He stands, marches three steps after it, remembers he is sulking, and sits back down.'),
            N('He folds his arms. The sulk resumes, slightly louder, for the benefit of anyone watching.'),
            N('He waves you on: this is your job now. He has a sulk to finish.'),
          ],
        },
        done: {
          id: 'q21-nest',
          lines: [
            N('In a nest of grass at the top of the hill, a wild Nubbin is fast asleep, cuddling a small brown bear.'),
            N('The bear has one chewed ear and, somehow, an air of great dignity.'),
          ],
          choices: [
            {
              id: 'ease',
              label: 'Ease the bear out gently.',
              then: [N('The Nubbin stirs, sighs, and lets go. You leave it a piece of fruit to cuddle instead.')],
            },
            {
              id: 'swap',
              label: 'Offer the little scarf in trade.',
              set: { 'q21-scarf-swap': true },
              then: [
                N('The Nubbin sniffs the scarf and wraps it round its own neck, looking very smart. Fair trade.'),
                N('Mr. Tweed may have opinions about the scarf.'),
              ],
            },
          ],
        },
      },
      {
        id: 'q21-s3',
        goal: 'Bring Bear back down to Mr. Tweed.',
        hint: 'Mr. Tweed is still on his rock by the pond. Hand him the bear with Give.',
        check: 'give:item:tweed-bear:mr-tweed',
        scene: {
          id: 'q21-carry',
          lines: [
            N('The bear is lighter than it looks, and it looks very light.'),
            N('Your Nubbin wants to carry it. It holds the bear the way Mr. Tweed did, which is to say, very seriously.'),
            N('Down by the pond, a tweed shape is still sulking on its rock.'),
            N('He has not seen you yet. He is pretending very hard not to look up the hill.'),
            N('Your Nubbin hides the bear behind its back. The bear is wider than its back.'),
            Y('Ready? Surprise him.', 'happy'),
          ],
        },
      },
    ],
    complete: {
      id: 'q21-complete',
      lines: [
        N('Mr. Tweed sees the bear. His face unfolds all at once, like a deckchair.'),
        T('Teddy!', 'happy'),
        N('He hugs the bear, checks its ear, checks its other ear, and tucks it into his top pocket so only its head shows.'),
        N('Then he notices your Nubbin, who is gazing at the bear with great longing.'),
        N('Mr. Tweed holds up one finger. He rummages in his jacket, then his trousers, then, briefly, his sock.'),
        N('He produces a second bear, no bigger than a thumb, and places it solemnly on your shoulder.'),
        T('Bear.', 'soft'),
        N('It stays there. It seems to like the view.'),
        N('That evening, through his window, you see him lay the table: two plates, one very small. He pulls out the small chair first.'),
      ],
    },
    rewards: [
      {
        id: 'shoulder-bear',
        kind: 'cosmetic',
        label: 'Shoulder Bear',
        description: 'A tiny plush bear that rides on your Keeper’s shoulder. Toggle it in the wardrobe.',
      },
    ],
    childLines: {
      'q21-complete#1': 'Bear! My bear!',
    },
    notes:
      'Introduces Mr. Tweed (later quests assume the player has met him, but do not require it). ' +
      'He needs a mime-heavy portrait set: think, sad, happy, angry, shock, soft, plus a "sulk" pose on the rock. ' +
      'His voice is a short mumble blip, never real speech. Props: bear-sized scarf (sparkles in the reeds), ' +
      'Mr. Tweed’s bear (brown, one chewed ear), a thumb-sized shoulder bear. The wild Nubbin on the hill flees if ' +
      'the player runs; walking reaches it. "Teddy!" is the one approved source quote, used once; Learning Grove ' +
      'swaps it via childLines. If the player chose "swap", the wild Nubbin keeps wearing the scarf afterwards. ' +
      'The table-for-two beat at the end is a short exterior shot through his lit window at dusk; after this quest his cottage window shows it every evening.',
  },

  // ------------------------------------------------------------------ Q22
  {
    id: 'q22',
    code: 'Q22',
    title: 'The Armchair Drive',
    source: 'Mr. Bean: driving from an armchair tied to the car roof',
    audience: 'all',
    trigger: { where: 'Market stalls by the Grove gate', when: 'Any afternoon' + WHEN_SUFFIX },
    speakers: [TWEED],
    steps: [
      {
        id: 'q22-s1',
        goal: 'Help Mr. Tweed tie the armchair on top of his hand cart.',
        hint: 'Use rope from your bag on the cart, then tap each corner of the chair to tie it down.',
        check: 'tie:decor:armchair:tweed-cart',
        scene: {
          id: 'q22-shop',
          lines: [
            N('At the market, Mr. Tweed has bought an armchair. It is green, deep and enormous.'),
            N('His hand cart is next to it. The hand cart is roughly the size of the armchair’s cushion.'),
            N('He lifts one end of the chair and looks at the cart. He puts it down and lifts the other end, in case that end is smaller.'),
            T('Hnn.', 'think'),
            N('He tries the chair upside down, then on its side. Then he tries sitting in it and pushing the cart with his feet.'),
            N('Then a light comes on behind his eyes. He points at the chair, then at the top of the cart, then mimes a knot.'),
            T('Rope!', 'happy'),
            N('He looks at you the way people look at someone who definitely has rope.'),
          ],
          choices: [
            {
              id: 'rope',
              label: 'Hand over some rope.',
              then: [N('He takes it with a little bow and starts a knot that goes under, over, and somehow through himself.')],
            },
            {
              id: 'doubt',
              label: 'Is this a good idea?',
              set: { 'q22-doubted': true },
              then: [
                T('Mm.'),
                N('He nods firmly, which answers a different question. You fetch some rope.'),
              ],
            },
            {
              id: 'carry',
              label: 'We could just carry it.',
              then: [
                N('He looks at you, at the chair, at the long road home, and gives a tiny, pitying shake of the head.'),
              ],
            },
          ],
        },
        done: {
          id: 'q22-tied',
          lines: [
            N('The chair sits on top of the cart, tied at all four corners and once, by accident, to a lamp post.'),
            N('You untie the lamp post. Mr. Tweed climbs up into the armchair and settles in, very pleased.'),
            N('He takes a long stick, pokes the ground behind him, and the cart begins to roll.'),
          ],
        },
      },
      {
        id: 'q22-s2',
        goal: 'Clear the path to Mr. Tweed’s house before the cart gets there, without anything falling off.',
        hint: 'Lift the branch, carry the sleeping Nubbin to the verge, and unhook the washing line. The cart never stops.',
        check: 'escort:tweed-cart:tweed-cottage:no-drops',
        scene: {
          id: 'q22-road',
          lines: [
            N('The cart wobbles off down the lane. Mr. Tweed steers from the armchair by leaning, and now and then by stick.'),
            N('He cannot see the ground. He can see the sky, the trees and the birds, which he waves at.'),
            T('Ooh.', 'happy'),
            N('Ahead: a fallen branch, a Nubbin asleep in the middle of the path, and a rather low washing line.'),
            N('You will have to run ahead and clear the way. Anything that hits the cart falls off the cart.'),
            N('Including, probably, Mr. Tweed.'),
            N('Then the lane tips downhill. The cart notices at once and speeds up.'),
            N('Mr. Tweed notices much later. He grips the armrests and lifts both feet off the ground, as if that will help.'),
          ],
          choices: [
            {
              id: 'sprint',
              label: 'Sprint ahead.',
              then: [N('You sprint. Behind you, Mr. Tweed hums a little driving tune of his own invention.')],
            },
            {
              id: 'nubbin',
              label: 'Send your Nubbin to wake the sleeper.',
              set: { 'q22-nubbin-help': true },
              then: [
                N('Your Nubbin trots ahead and pokes the sleeping one. It rolls over, which is not the same as moving.'),
              ],
            },
          ],
        },
        done: {
          id: 'q22-arrive',
          lines: [
            N('The cart rolls up to Mr. Tweed’s gate and stops against it with a gentle bonk.'),
            N('His hat flies off. He catches it with one foot, flicks it back onto his head, and looks round to see if anyone saw.'),
            N('Nothing has fallen off, technically. Mr. Tweed checks himself, the chair and the stick, in that order.'),
            T('Ha!', 'happy'),
          ],
        },
      },
    ],
    complete: {
      id: 'q22-complete',
      lines: [
        N('Mr. Tweed climbs down, looks at the chair, looks at his small front door, and goes very quiet.'),
        N('The chair will not fit through the door. He measures both with his hands, three times, hoping.'),
        T('Hnn.', 'sad'),
        N('Then he unties the chair, pushes it towards you and pats it twice. It is yours; he has no room.'),
        N('He pats the cart too. He mimes running, then riding, then points at your legs and shakes his head: much faster.'),
        N('The cart is yours as well. He has, apparently, gone off carts.'),
        N(
          'As you leave, he carries a small kitchen chair out to his front garden and sits in the sun, entirely satisfied.',
        ),
        N(
          'The kitchen chair has one short leg, and it tips. He stays exactly where it tips him, at an angle, still entirely satisfied.',
        ),
        N(
          'He pats the space next to him. There is no space next to him. You sit on the wall, and for a while you both watch the lane.',
        ),
      ],
    },
    rewards: [
      {
        id: 'tweed-armchair',
        kind: 'decor',
        label: 'Tweed’s Armchair',
        description: 'A deep green armchair for the cottage or garden. Nubbins like to nap in it.',
      },
      {
        id: 'hand-cart',
        kind: 'feature',
        label: 'Hand Cart',
        description: 'A rideable cart. Moves faster than Run and carries one extra Nubbin along with you.',
      },
    ],
    notes:
      'Adapts the car-roof armchair gag to a hand cart. Step 2 is an escort run: the cart rolls at a fixed pace along ' +
      'the lane on rails; the player must clear three obstacles (branch, sleeping Nubbin, washing line) before it ' +
      'reaches each. If the cart hits one, the chair wobbles, Mr. Tweed grabs the armrests ("Hnn!"), and the run ' +
      'restarts from the market with no penalty. Sound: rope creak, cart rattle, a hummed tune (original, wordless). ' +
      'The Hand Cart is used again in Q30. ' +
      'The downhill stretch speeds the cart up by about a quarter for the last obstacle; the hat-catch at the gate is a fixed animation, not a fail.',
  },

  // ------------------------------------------------------------------ Q23
  {
    id: 'q23',
    code: 'Q23',
    title: 'Pumpkin Head',
    source: 'Merry Christmas, Mr. Bean: the turkey on his head',
    audience: 'all',
    trigger: { where: 'The pumpkin patch', when: 'Harvest season (autumn), daytime' + WHEN_SUFFIX },
    speakers: [TWEED],
    steps: [
      {
        id: 'q23-s1',
        goal: 'Calm the wandering pumpkin so it stops bumping into things.',
        hint: 'Tap the pumpkin and choose Pet. A calm Nubbin sits still and listens.',
        check: 'pet:nubbin:pumpkin',
        scene: {
          id: 'q23-patch',
          lines: [
            N('It is harvest time, and the pumpkin patch is fat and orange.'),
            N('One pumpkin is moving: left, then right, then gently into a fence post. It goes “mff”.'),
            N('Mr. Tweed is already crouched beside it, studying it with enormous concentration.'),
            N('He knocks on the pumpkin. The pumpkin knocks back.'),
            T('Oh!', 'shock'),
            N('Two little feet stick out of the bottom. A curious Nubbin climbed in to eat the middle and cannot find the way out.'),
            N('Mr. Tweed grabs the stalk and braces one foot against the pumpkin, ready to pull with all his might.'),
          ],
          choices: [
            {
              id: 'stop',
              label: 'Stop! Not like that.',
              then: [
                N('He freezes mid-heave, one foot raised, and slowly lets go of the stalk.'),
                T('Mm.', 'sad'),
              ],
            },
            {
              id: 'pull',
              label: 'Help him pull.',
              set: { 'q23-pulled': true },
              then: [
                N('You both pull, and the pumpkin squeaks. The Nubbin inside squeaks louder.'),
                N('You both let go at once and pretend that did not happen.'),
              ],
            },
            {
              id: 'watch',
              label: 'Watch which way it wriggles.',
              then: [N('The pumpkin rocks left, right, left. There is a rhythm to it. The Nubbin is trying to wiggle out.')],
            },
          ],
        },
        done: {
          id: 'q23-calm',
          lines: [
            N('You pat the pumpkin. It stops wandering and sits down with a soft thump.'),
            N('From inside comes a small, contented hum. Mr. Tweed puts his ear to it and nods, professionally.'),
          ],
        },
      },
      {
        id: 'q23-s2',
        goal: 'Free the Nubbin with three gentle wiggles, in time with the beat.',
        hint: 'Tap when the pumpkin glows: tap, tap, tap. Pulling only makes it squeak.',
        check: 'minigame:wiggle:pumpkin:3-beat',
        scene: {
          id: 'q23-wiggle',
          lines: [
            N('Mr. Tweed holds up three fingers. He mimes a tiny wiggle, wiggle, wiggle, and then a pop.'),
            N('He looks very proud of this plan. It is, to be fair, a good plan.'),
            N('You put both hands on the pumpkin. Inside, the Nubbin goes still and listens.'),
            T('One…', 'think'),
            N('He conducts the air with one finger, like a very small orchestra.'),
            N('He gets carried away. Both arms. A slow, swelling crescendo. Inside the pumpkin, the Nubbin begins to hum along.'),
            Y('Gently. On the beat.', 'soft'),
          ],
        },
        done: {
          id: 'q23-pop',
          lines: [
            N('On the third wiggle there is a soft pop, and the Nubbin slides out in a shower of seeds.'),
            N('It is orange to the elbows and smells wonderful. It looks at the empty pumpkin, and its lip wobbles.'),
          ],
        },
      },
    ],
    complete: {
      id: 'q23-complete',
      lines: [
        N('The Nubbin climbs straight back into the pumpkin. Head first, bottom up.'),
        N('You and Mr. Tweed look at each other.'),
        N('He lifts it off, scoops it clean with a spoon from his top pocket, then cuts two neat eyeholes and a wider neck with a butter knife from his sock.'),
        N('He pops it on the Nubbin like a hat, and it fits perfectly. The Nubbin turns slowly in a circle, delighted.'),
        N('Then he tries one on himself, to show solidarity. It fits less well.'),
        N('He walks into the fence post and apologises to it. He walks into the scarecrow and shakes its hand.'),
        T('Mff.'),
        N('It takes you, the Nubbin, a spoon and a firm tug on each ear to get it off. He emerges orange to the eyebrows, and very dignified.'),
        N('He presents you with a third one: smaller, neater, with a curly stalk on top.'),
        N(
          'The Nubbin wears its pumpkin all afternoon, peering out of the eyeholes. By evening a second Nubbin has queued behind it, with its own pumpkin.',
        ),
        N('Mr. Tweed is pretending to be in a different queue.'),
      ],
    },
    rewards: [
      {
        id: 'pumpkin-hat',
        kind: 'cosmetic',
        label: 'Pumpkin Hat',
        description: 'A hollowed-out pumpkin hat with a curly stalk. Fits Keepers and Nubbins alike.',
      },
    ],
    notes:
      'Only offered in the harvest season. The stuck Nubbin is a wild one, or one of the player’s own if any is ' +
      'nearby and curious-personality. Step 2 is a three-tap rhythm minigame at about 90 BPM: the pumpkin glows on ' +
      'each beat. Mistimed taps or holding to pull play a squeak and restart the count; there is no fail state. ' +
      'Art: walking pumpkin with feet, pumpkin-hat sprite for Keeper and Nubbin, Mr. Tweed with a pumpkin stuck on ' +
      'his head (brief comic beat). Sound: hollow knock, muffled hum, soft pop.',
  },

  // ------------------------------------------------------------------ Q24
  {
    id: 'q24',
    code: 'Q24',
    title: 'The Exam',
    source: 'Mr. Bean: the exam',
    audience: 'all',
    trigger: {
      where: 'The Kindergarten',
      when: 'A weekday morning, once one of your Nubbins has taken a Kindergarten lesson' + WHEN_SUFFIX,
    },
    speakers: [TWEED, INKWELL],
    steps: [
      {
        id: 'q24-s1',
        goal: 'Shuffle your Nubbin’s answers three times to throw Buttons off.',
        hint: 'When Buttons leans over, tap your Nubbin’s paper to slide it somewhere new. Three times does it.',
        check: 'minigame:shuffle:exam-paper:3',
        scene: {
          id: 'q24-desks',
          lines: [
            I('Test day! Two Nubbins, two desks, one paper each. Shapes, colours and counting to five. No talking.', 'happy'),
            N('Your Nubbin takes the left desk. On the right sits Buttons, Mr. Tweed’s Nubbin, in a matching tweed waistcoat.'),
            N('Mr. Tweed stands behind Buttons, pointing at the paper, then at Buttons’ head, then making a small, encouraging fist.'),
            I('Keepers may stay, but quietly. Very quietly. I am looking at you, Mr. Tweed.'),
            N('He mimes zipping his lips shut, locking them, and posting the key into his pocket. Then he checks the pocket.'),
            N('The test begins. Your Nubbin licks its pencil and draws a perfect circle.'),
            N('Buttons draws nothing. Buttons leans very, very slowly to the left.'),
            N('Behind Buttons, Mr. Tweed drops a pencil, bends very slowly to fetch it, and reads your Nubbin’s paper upside down on the way.'),
          ],
          choices: [
            {
              id: 'shield',
              label: 'Nudge your Nubbin to cover its paper.',
              then: [
                N(
                  'Your Nubbin curls an arm round its work. Buttons leans further. Buttons’ chair creaks.',
                ),
              ],
            },
            {
              id: 'share',
              label: 'Let it look. Sharing is nice.',
              set: { 'q24-shared': true },
              then: [
                I('Eyes on your own paper, please, Buttons.'),
                N(
                  'Buttons sits bolt upright and tries to whistle innocently, which Nubbins cannot do.',
                ),
                I(
                  'Sharing your rubber is sharing, dear. Sharing your answers is a shortcut with a nice name.',
                ),
                N(
                  'Mr. Tweed slides his own paper under his elbow, very casually, and looks at the ceiling.',
                ),
              ],
            },
            {
              id: 'glance',
              label: 'Look at Mr. Tweed.',
              then: [
                N('Mr. Tweed is studying the ceiling, hands behind his back, with the face of a man who has never met Buttons.'),
              ],
            },
          ],
        },
        done: {
          id: 'q24-shuffled',
          lines: [
            N(
              'Left, right, under the desk. Buttons follows the paper with Buttons’ whole body, and on the third shuffle falls off its chair.',
            ),
            N(
              'Mr. Tweed, who had been leaning with it, falls over too, and pretends he was inspecting the floor.',
            ),
            I('Buttons? Are you all right?', 'shock'),
            N('Buttons is fine. Buttons’ paper is still completely blank.'),
          ],
        },
      },
      {
        id: 'q24-s2',
        goal: 'At break, help Buttons learn its shapes, then make sure both Nubbins pass.',
        hint: 'Practise shapes with Buttons on the chalkboard, then let both Nubbins finish the test.',
        check: 'pass:kindergarten:test:both',
        scene: {
          id: 'q24-break',
          lines: [
            N(
              'Buttons climbs back onto the chair and looks at the blank paper. Buttons’ ears droop all the way down.',
            ),
            N('Behind it, Mr. Tweed’s ears somehow droop too.'),
            T('Hnn…', 'sad'),
            N('He points at Buttons, then at the paper, then clasps his hands together, pleading.'),
            I('Pencils down, everyone, it’s break. You may help each other at break, by all means. That’s learning, not copying.'),
            Y('Right, Buttons. Circles first.'),
            N('Buttons gazes up at you with the solemn trust of a creature that has never drawn a circle.'),
          ],
        },
        done: {
          id: 'q24-pass',
          lines: [
            I('Two passes! Buttons, that is the roundest circle I have ever seen. It is very nearly a circle.', 'happy'),
            N('Buttons holds its paper up to Mr. Tweed with both arms.'),
          ],
        },
      },
    ],
    complete: {
      id: 'q24-complete',
      lines: [
        N('Mr. Tweed lifts Buttons into the air like a trophy and does a slow, silent lap of the classroom.'),
        I('Mr. Tweed. Please put the Nubbin down.'),
        N('He puts Buttons down and shakes your hand, then your Nubbin’s, then Mrs Inkwell’s, who did not offer it.'),
        I('You know, these two learn better together. Bring them as a pair and I’ll teach them both for one fee.', 'soft'),
        N('Buttons and your Nubbin are already sitting side by side, drawing circles on each other’s papers.'),
        N('Mr. Tweed lingers. He looks at the little desks, then at Mrs Inkwell, and holds up one finger, hopefully.'),
        I('…One paper. Just the one.', 'soft'),
        N('He folds himself into the tiny desk, which takes some time, licks his pencil, and draws a circle with his tongue out.'),
        N('It is not a very good circle. He holds it up to Buttons anyway, both arms, and Buttons claps.'),
      ],
    },
    rewards: [
      {
        id: 'study-buddies',
        kind: 'feature',
        label: 'Study Buddies',
        description: 'Two Nubbins can take a Kindergarten lesson together for the price of one.',
      },
    ],
    notes:
      'Mrs Inkwell is the Kindergarten teacher; if the Kindergarten already has a teacher NPC, give these lines to ' +
      'them instead. Buttons is Mr. Tweed’s Nubbin (round, tweed waistcoat); reuse it in later cameos. Step 1 ' +
      'minigame: Buttons leans on a slow telegraphed timer; tap your Nubbin’s paper to slide it to one of three ' +
      'spots; three successful dodges complete it, a miss just resets Buttons’ lean. Step 2 is a short shapes ' +
      'tutorial, then both Nubbins auto-pass. Cheating is never rewarded; helping at break is the point. ' +
      'Mr. Tweed squeezing into the tiny desk at the end needs a cramped sit pose; his circle is visibly lopsided.',
  },

  // ------------------------------------------------------------------ Q25
  {
    id: 'q25',
    code: 'Q25',
    title: 'The High Dive',
    source: 'Mr. Bean: the high diving board',
    audience: 'all',
    trigger: { where: 'The waterfall pool', when: 'A warm afternoon (summer)' + WHEN_SUFFIX },
    speakers: [TWEED],
    steps: [
      {
        id: 'q25-s1',
        goal: 'Get Mr. Tweed off the ledge: coax him down, or let a brave Swim Nubbin show him how.',
        hint: 'Call up to him with Talk to coax him down a step at a time, or take a strong swimmer to the ledge and tap Dive.',
        check: 'rescue:mr-tweed:waterfall-ledge',
        scene: {
          id: 'q25-ledge',
          lines: [
            N('Mr. Tweed is at the waterfall in a striped bathing suit, doing warm-up stretches that mostly involve his eyebrows.'),
            N('He points up at the high ledge beside the falls, then at himself, then mimes a perfect swallow dive.'),
            T('Hup!', 'happy'),
            N('He climbs, and it takes a while. Halfway up he stops to wave at you, and very nearly does not start again.'),
            N('At the top he walks to the edge, looks down, and becomes a statue.'),
            N('A long time passes, and a small bird lands on his head. He does not move.'),
            N('A queue forms behind him: three small Nubbins, waiting politely for their turn.'),
            N('One by one they squeeze between his ankles and dive. He watches each one go, then looks at the water as if it has betrayed him.'),
            T('Hnn.', 'shock'),
            N('Very carefully, without moving anything else, he mimes two fingers walking backwards. He would like to come down now.'),
          ],
          choices: [
            {
              id: 'coax',
              label: 'Talk him down, one step at a time.',
              set: { 'q25-way': 'coax' },
              then: [
                Y('You’re fine! One foot back. Just one.'),
                T('Mm…', 'think'),
              ],
            },
            {
              id: 'show',
              label: 'Ask a Swim Nubbin to show him how.',
              set: { 'q25-way': 'show' },
              then: [
                N('Your Nubbin looks at the ledge, at the water, and back at you, with dawning delight.'),
              ],
            },
          ],
        },
        done: {
          id: 'q25-down',
          lines: [
            N('Step by step, or splash by splash, Mr. Tweed gets off that ledge. The last bit is mostly sliding.'),
            N('He lands in the shallows with a slap, sits up, and finds the bird is still on his head.'),
            T('Mm!', 'happy'),
          ],
        },
      },
      {
        id: 'q25-s2',
        goal: 'Build a low diving board at the pond with Mr. Tweed.',
        hint: 'Set the plank on the flat rock at the pond’s edge, then hammer it in with three taps.',
        check: 'build:decor:diving-board:pond',
        scene: {
          id: 'q25-board',
          lines: [
            N('Back on dry land, Mr. Tweed dries off with a towel the size of a handkerchief.'),
            N('He looks at the high ledge, then at the low flat rock by the pond. He holds his hands a little apart.'),
            N('He mimes sawing, hammering, and a gentle bounce. A board: a low one.'),
            T('Small.', 'happy'),
            N('Your Nubbin is already bouncing on the spot. It would like to go first.'),
            N('Mr. Tweed produces a plank from somewhere inside the towel and hands it to you.'),
          ],
        },
      },
    ],
    complete: {
      id: 'q25-complete',
      lines: [
        N('The diving board is low, springy and slightly crooked. It is perfect.'),
        N('Your Nubbin goes first: bounce, bounce, splash. It comes up grinning, and paddles back noticeably faster.'),
        N('Then Mr. Tweed walks to the end, looks down at the water, all of one foot below, and freezes.'),
        N('You wait, and your Nubbin waits. The bird comes back and lands on his head again.'),
        N('Then he holds his nose, shuts his eyes, and steps off like a man stepping off a kerb.'),
        T('Ha!', 'happy'),
        N('He climbs out and does it nine more times. The board is yours to keep; he will visit.'),
      ],
    },
    rewards: [
      {
        id: 'diving-board',
        kind: 'decor',
        label: 'Diving Board',
        description: 'A low, springy diving board at the pond.',
      },
      {
        id: 'diving-practice',
        kind: 'feature',
        label: 'Diving Practice',
        description: 'Nubbins who dive from the board gain extra Swim lean.',
      },
    ],
    notes:
      'Two routes through step 1, both completing the same check. "coax": three Talk prompts, each moves him one ' +
      'step down the rocks, last one he slides into the shallows. "show": take a Nubbin with decent Swim to the ' +
      'ledge and tap Dive; it dives neatly, Mr. Tweed copies, belly-flops, comes up fine. Keep it light: nobody is ' +
      'hurt, no real heights advice. Art: striped bathing suit, statue pose with bird on head, tiny towel, crooked ' +
      'board. The board is placed on the home pond regardless of where the waterfall is.',
  },

  // ------------------------------------------------------------------ Q26
  {
    id: 'q26',
    code: 'Q26',
    title: 'The Park Bench Sandwich',
    source: 'Mr. Bean: making a sandwich in the park',
    audience: 'all',
    trigger: { where: 'The bench by the pond', when: 'Midday, fine weather' + WHEN_SUFFIX },
    speakers: [TWEED],
    steps: [
      {
        id: 'q26-s1',
        goal: 'Hand Mr. Tweed the right things, in the right order, as he mimes for them.',
        hint: 'Watch his hands: a sawing mime means bread, a shake means pepper. Wrong items get handed politely back.',
        check: 'minigame:hand-over:picnic:6',
        scene: {
          id: 'q26-bench',
          lines: [
            N('Mr. Tweed sits on the bench by the pond. There is a small brass plate on it with his name. He brought it himself, and screwed it on.'),
            N('He opens his coat and begins unpacking lunch from places lunch should not be.'),
            N('A whole loaf from his left sleeve, a lettuce from his inside pocket, and a jar of jam from somewhere near his knee.'),
            N('A tomato, a pepper pot, a pat of butter from his breast pocket, and a small, warm flask from under his hat.'),
            N('He lines them up along the bench, admires them, and spreads jam on the lettuce.'),
            T('Hm?', 'think'),
            N('He looks at the lettuce, then at the jam. Something has gone wrong and he cannot say what.'),
            N('Your Nubbin climbs up beside him, very interested in the jam.'),
          ],
          choices: [
            {
              id: 'pass',
              label: 'Offer to pass him things.',
              then: [N('He nods gravely and holds out one hand, palm up, like a surgeon.')],
            },
            {
              id: 'taste',
              label: 'Try a bite of the jam lettuce.',
              set: { 'q26-jam-lettuce': true },
              then: [
                N('It is crunchy, sweet and wrong. Mr. Tweed watches your face closely, then nods: wrong, he knew it.'),
              ],
            },
            {
              id: 'jam',
              label: 'Let your Nubbin have the jam.',
              then: [N('Your Nubbin puts its whole face in the jar. Mr. Tweed produces a second jar from his other knee.')],
            },
          ],
        },
        done: {
          id: 'q26-sandwich',
          lines: [
            N('Bread, butter, lettuce, tomato, a shake of pepper, bread on top. Pat, pat.'),
            N('Mr. Tweed holds the finished sandwich up to the light, like a jeweller.'),
            N('A duck lands on the bench. It looks at the sandwich, then at Mr. Tweed. A long, silent negotiation takes place.'),
            N('The duck leaves with the jam lettuce. Mr. Tweed lets it. He never trusted the jam lettuce.'),
            T('Ahh.', 'happy'),
          ],
        },
      },
      {
        id: 'q26-s2',
        goal: 'Spread the picnic blanket and share the sandwich with every Nubbin there.',
        hint: 'Lay the blanket on the grass by the bench, then tap each Nubbin on it and choose Feed.',
        check: 'feed:nubbins:picnic-blanket:all',
        scene: {
          id: 'q26-share',
          lines: [
            N('He is about to take the first bite when he notices: you have no sandwich. Your Nubbin has no sandwich.'),
            N('Several wild Nubbins have gathered quietly behind the bench. They have no sandwich either.'),
            N('Mr. Tweed looks at his sandwich, then at all of them, and sighs a sigh from the bottom of his boots.'),
            N('He takes a ruler from his coat, because of course he has a ruler, and cuts the sandwich into very exact squares.'),
            N('He points at a flat patch of grass, then flaps an imaginary cloth.'),
            T('Picnic.'),
            N('He pulls a checked blanket out of his coat. It is bigger than the coat.'),
          ],
        },
      },
    ],
    complete: {
      id: 'q26-complete',
      lines: [
        N('Everyone gets a square. Mr. Tweed takes the last one, which is mostly crust, and eats it as if it were cake.'),
        N('It is the first time in years he has needed the ruler.'),
        N('The duck comes back for the crust. Mr. Tweed measures it with the ruler, finds it over regulation size, and gives it half anyway.'),
        N('The Nubbins sit in a sleepy pile on the blanket, sticky and full and very happy.'),
        N('Mr. Tweed goes to fold the blanket, looks at the pile of sleeping Nubbins, and quietly leaves it where it is.'),
        N('He tips his hat to you. The blanket is yours now; the Nubbins have decided.'),
      ],
    },
    rewards: [
      {
        id: 'picnic-blanket',
        kind: 'decor',
        label: 'Picnic Blanket',
        description: 'A checked picnic blanket for the garden.',
      },
      {
        id: 'shared-picnics',
        kind: 'feature',
        label: 'Shared Picnics',
        description: 'Nubbins who eat together on the picnic blanket gain extra happiness.',
      },
    ],
    notes:
      'Step 1 hand-over minigame: six rounds; Mr. Tweed mimes an item (sawing = bread, spreading = butter, ' +
      'tearing = lettuce, slicing = tomato, shaking = pepper, sawing again = top slice). The player taps the item on ' +
      'the bench. A wrong item: he looks at it, hands it back, mimes again. No fail state. Props pop out of odd ' +
      'pockets (sleeve, knee, hat) with a little "fwip" sound. Step 2 needs 3–5 wild Nubbins near the bench; any ' +
      'of the player’s Nubbins nearby join in and count. ' +
      'Props: a small brass name plate on the bench (stays after the quest) and a duck that flies off with the jam lettuce in step 1’s done scene.',
  },

  // ------------------------------------------------------------------ Q27
  {
    id: 'q27',
    code: 'Q27',
    title: 'The Ruined Portrait',
    source: 'Bean (1997): the ruined painting',
    audience: 'all',
    trigger: { where: 'The Keepers’ Hall', when: 'A rainy afternoon' + WHEN_SUFFIX },
    speakers: [TWEED, PRYCE],
    steps: [
      {
        id: 'q27-s1',
        goal: 'Bring three Nubbins into the hall and line them up like the Nubbins in the portrait.',
        hint: 'Carry or call Nubbins into the hall. Mr. Tweed’s chalk marks on the floor show where each one sits.',
        check: 'gather:nubbins:keepers-hall:3',
        scene: {
          id: 'q27-hall',
          lines: [
            N('The Keepers’ Hall smells of floor polish. On the far wall hangs the Founders’ Portrait: two stern old Keepers and three Nubbins.'),
            W('Mr. Tweed is cleaning the portrait today. Supervised. I’ll be back within the hour. Touch nothing but the frame.'),
            N('The Warden leaves. Mr. Tweed bows to the portrait, dabs it with a wet cloth, and his nose begins to twitch.'),
            N('He holds the twitch in, then holds it in harder. His face goes through every colour.'),
            T('Hah… hah…', 'shock'),
            N('The sneeze is enormous. The wet cloth flies out of his hand and lands across both founders.'),
            N('When he peels it off, the founders have smudged into one very wide founder with four ears.'),
            N('He dabs at it with his handkerchief. Now there is a nose where one of the ears was.'),
            N('He tries the pencil from behind his ear. The founder now has spectacles, and an expression of total surprise.'),
            T('Oh.', 'shock'),
            N('He looks at the door, then the clock. Then he looks at you, and mimes a small, desperate prayer.'),
          ],
          choices: [
            {
              id: 'fix',
              label: 'We can fix this. Probably.',
              then: [N('He grips your hand gratefully and gets cleaning fluid on it.')],
            },
            {
              id: 'tell',
              label: 'We should tell the Warden.',
              set: { 'q27-wanted-to-tell': true },
              then: [
                N('He nods slowly, then points at the clock, the portrait and you. Try first, then tell.'),
              ],
            },
          ],
        },
        done: {
          id: 'q27-lined',
          lines: [
            N('Three Nubbins in a row, more or less. One is facing the wrong way, and one is asleep.'),
            N('Mr. Tweed has drawn the plan on the floor in chalk: two chairs, three Nubbins, one camera. Yours.'),
          ],
        },
      },
      {
        id: 'q27-s2',
        goal: 'Take a Photo mode shot that matches the Founders’ Portrait.',
        hint: 'Use the self-timer in Photo mode and sit in the empty chair. The outline turns green when the poses line up.',
        check: 'photo:match:founders-portrait',
        scene: {
          id: 'q27-pose',
          lines: [
            N('Mr. Tweed hangs a dark curtain behind the Nubbins and drags two chairs into place, just like the portrait.'),
            N('He sticks on a grey moustache and offers you one. It is the same moustache; he has torn it in half.'),
            N('He sits, rests one hand on his knee, and gazes into the middle distance with the face of a founder.'),
            N('The Nubbins copy him, all three gazing into the middle distance. One falls asleep doing it.'),
            T('Shh.'),
            N('He nods at your camera, then the portrait, then holds up one finger: one go. The clock is ticking.'),
            Y('Everybody hold still…'),
          ],
        },
        done: {
          id: 'q27-shot',
          lines: [
            N('Click. The picture comes out stern, dignified and very nearly right.'),
            N('One Nubbin is yawning, but if you squint, so was one in the original.'),
          ],
        },
      },
      {
        id: 'q27-s3',
        goal: 'Hang the frame back on its hook before the Warden walks in.',
        hint: 'Tap the hook to hang the frame, then tap it again to straighten it. Two quick taps.',
        check: 'place:photo:keepers-hall:founders-frame',
        scene: {
          id: 'q27-swap',
          lines: [
            N('Footsteps in the corridor. The Warden is early.'),
            N('Mr. Tweed lifts the frame down, slides the smudged canvas out, and hides it up the back of his jacket.'),
            N('You slot the photo into the frame, and it is slightly too small. He stuffs the gap with his handkerchief.'),
            N('He hangs it. It is crooked. He straightens it, and the other side drops. He straightens that, and the first side drops.'),
            T('Quick!', 'shock'),
            N('The footsteps stop outside the door.'),
            N('The door handle begins, very slowly, to turn.'),
          ],
        },
      },
    ],
    complete: {
      id: 'q27-complete',
      lines: [
        N('The Warden walks in and looks at the portrait for a long, long time.'),
        W('It looks… brighter. Younger, somehow. That founder has your chin.', 'think'),
        N('Mr. Tweed studies the ceiling. Half a grey moustache is still stuck to his lip.'),
        N('Behind his back, he presses a stack of spare frames into your hands and mimes: your photos, your walls.'),
      ],
      choices: [
        {
          id: 'confess',
          label: 'It’s a photo. There was a sneeze.',
          set: { 'q27-confessed': true },
          then: [
            W('A sneeze. Of course there was.', 'think'),
            N('She looks at the half moustache still stuck to Mr. Tweed’s lip.'),
            W('And the moustache. Did that sneeze too?'),
            W('Honestly? I prefer this one. The old one always looked cross. It stays.', 'happy'),
            N('Mr. Tweed quietly pulls the canvas out of his jacket and hands it over, rolled up like a newspaper.'),
          ],
        },
        {
          id: 'quiet',
          label: 'Say nothing. Admire it.',
          set: { 'q27-confessed': false },
          then: [
            W('Well. Keep up the good work, both of you.'),
            N('As the door closes behind her, Mr. Tweed breathes out for the first time in an hour.'),
          ],
        },
      ],
    },
    rewards: [
      {
        id: 'picture-frames',
        kind: 'feature',
        label: 'Picture Frames',
        description: 'Hang your Photo mode shots in frames on the cottage walls.',
      },
    ],
    notes:
      'Needs Photo mode with a self-timer and a "match the outline" helper for the step 2 check: a translucent ' +
      'overlay of the portrait poses; it turns green when the player and three Nubbins sit close enough. ' +
      'After the quest, the hall portrait permanently shows the player’s actual photo. Art: the original portrait ' +
      'and its smudged version (soft, comic, not grotesque), a torn moustache prop, dark curtain backdrop. ' +
      'Step 3 is a short timed tap (about 4 seconds); missing it just replays the footsteps. The "q27-confessed" ' +
      'flag is cosmetic: if true, the Warden later nods at the portrait when the player passes.',
  },

  // ------------------------------------------------------------------ Q28
  {
    id: 'q28',
    code: 'Q28',
    title: 'Do-It-Yourself',
    source: 'Mr. Bean: painting a room with a firework in the paint tin',
    audience: 'all',
    trigger: { where: 'Mr. Tweed’s cottage', when: 'A dry day, after Q21' + WHEN_SUFFIX },
    requires: ['Q21'],
    speakers: [TWEED],
    steps: [
      {
        id: 'q28-s1',
        goal: 'Carry every Nubbin, and anything precious, out of Mr. Tweed’s cottage.',
        hint: 'Three Nubbins are napping inside and his bear is on the mantelpiece. Carry each one out to the garden.',
        check: 'clear:tweed-cottage:nubbins-and-bear',
        scene: {
          id: 'q28-plan',
          lines: [
            N('Mr. Tweed’s front room is the colour of old porridge. He stands in the middle of it with a tin of yellow paint and a tiny brush.'),
            N('On the mantelpiece stands a card in his best handwriting: TEA. SATURDAY. EVERYONE. It is not addressed to anyone in particular.'),
            N('He paints one stroke and steps back. He looks at four walls, a ceiling, and his one stroke.'),
            N('He tapes the brush to a broom. He paints the ceiling, the lampshade, a sleeping Nubbin (which does not wake) and, briefly, himself.'),
            T('Hnn.', 'sad'),
            N('He puts down the brush and picks up a firework from the mantelpiece. A light comes on behind his eyes.'),
            N('He mimes it: firework in the tin, light it, run. Then a big BOOM with both hands, and paint landing everywhere, beautifully.'),
            T('Boom.', 'happy'),
            N('He looks at you for approval. Your Nubbin is already hiding behind your legs.'),
          ],
          choices: [
            {
              id: 'no',
              label: 'Absolutely not.',
              set: { 'q28-objected': true },
              then: [
                N('He nods sympathetically and keeps unwrapping the firework.'),
                N('Then he mimes carrying Nubbins out of the door. He has heard you: safety first, then boom.'),
              ],
            },
            {
              id: 'outside',
              label: 'Fine. But everyone goes outside first.',
              then: [
                N('He shakes your hand firmly. Then he points at your Nubbin, at the door, and at his eyebrows, which he would also like to keep.'),
              ],
            },
            {
              id: 'light',
              label: 'Can I light it?',
              set: { 'q28-asked-to-light': true },
              then: [
                N('He holds up a small card he has clearly made earlier: GROWN-UPS ONLY.'),
                N('He checks the card, then himself, and stands up a little taller.'),
              ],
            },
          ],
        },
        done: {
          id: 'q28-cleared',
          lines: [
            N('Three sleepy Nubbins on the lawn, one with a yellow stripe, and one plush bear propped on the gate post, supervising.'),
            N('The front room is empty except for Mr. Tweed, the paint, and the firework.'),
            N('He tucks his trousers into his socks. This is his idea of protective clothing.'),
          ],
        },
      },
      {
        id: 'q28-s2',
        goal: 'Stand well back, behind the garden hedge, before the fuse runs out.',
        hint: 'Run to the far side of the hedge. The closer you stand, the yellower you get.',
        check: 'stand:back:tweed-cottage:hedge',
        scene: {
          id: 'q28-fuse',
          lines: [
            N('Mr. Tweed stands the firework in the paint tin, lights the fuse, and gazes at it with pride.'),
            N('The fuse fizzes, and he watches it fizz. He keeps watching it fizz.'),
            N('You wave at him through the window. He waves back.'),
            N('You point at the fuse. He looks at the fuse, then at you, then at the door.'),
            T('Oh!', 'shock'),
            N('He runs, and you run. Your Nubbin is somehow already behind the far hedge.'),
          ],
        },
      },
    ],
    complete: {
      id: 'q28-complete',
      lines: [
        N('FWUMP: every window goes yellow at once. The chimney puffs out a small yellow cloud.'),
        N('You creep back and look inside: walls, ceiling, floor, clock, all yellow. It is, honestly, a good job.'),
        N('There is one perfect porridge-coloured rectangle on the wall, where the picture hung.'),
        N('A single drop falls from the lampshade onto Mr. Tweed’s head. He does not notice; he is far too happy.'),
        T('Ha!', 'happy'),
        N('He hands you a wide, flat brush and mimes one huge swish over the whole garden path. Big jobs, one go.'),
        N('Then he mimes the firework and shakes his head, very firmly. The brush, yes; the boom, no.'),
        N('On Saturday you go for tea. So does half the lane. The yellow room is full, and Mr. Tweed has no idea where to put himself.'),
        N('He ends up in the doorway, holding the teapot, beaming at everyone, and pours nobody any tea for nearly an hour.'),
      ],
    },
    rewards: [
      {
        id: 'splash-paint',
        kind: 'feature',
        label: 'Splash Paint',
        description: 'Paint a whole patch of ground tiles in one go with the wide brush.',
      },
    ],
    notes:
      'Requires Q21 only because his bear appears on the mantelpiece; drop the requirement and the bear if the ' +
      'implementer prefers. Keep the blast cartoonish: a soft "FWUMP", a yellow puff, no fire, smoke or injury. ' +
      'The firework is never shown in detail and the reward is explicitly the brush, not fireworks. Step 2 is a ' +
      '5-second dash: the fuse fizzes on screen; if the player is too close they end up with a yellow tint on ' +
      'their outfit for the rest of the day (harmless) and the step still completes. Mr. Tweed’s cottage interior ' +
      'stays yellow afterwards, with the porridge rectangle. ' +
      'The Nubbin painted by the broom keeps a yellow stripe until its next bath. The Saturday tea is a quick fade to a full, cheerful yellow room; any Keepers the player has met can fill it.',
  },

  // ------------------------------------------------------------------ Q29
  {
    id: 'q29',
    code: 'Q29',
    title: 'Mind the Egg',
    source: 'Mind the Baby, Mr. Bean',
    audience: 'all',
    trigger: { where: 'The lane by your gate', when: 'Any morning when the player has room for an egg' + WHEN_SUFFIX },
    speakers: [TWEED, ODETTE],
    steps: [
      {
        id: 'q29-s1',
        goal: 'Put Odette’s egg down somewhere flat in your garden.',
        hint: 'Set the egg on flat ground near your cottage. Not on the slope. Definitely not on the slope.',
        check: 'place:item:visiting-egg:flat',
        scene: {
          id: 'q29-handover',
          lines: [
            O('Hello! You must be Hazel’s grandchild. I’m Odette, from over the ridge. I hear you’re good with eggs.', 'happy'),
            O('I’ve an appointment in the village this afternoon, and eggs aren’t allowed in the waiting room. Silly rule. Would you mind this one?'),
            N('She puts a speckled egg in your hands. It is warm and slightly round on one side, the way eggs are, but more so.'),
            O('It’s an easy egg. It just likes to roll. Keep it on something flat and it’s no trouble at all. Back by sunset!'),
            N('She waves and goes, and the egg sits in your palm, perfectly still. The moment you look away, it wobbles.'),
            N('Mr. Tweed leans over the fence, looks at the egg, and mimes rocking a baby. Then he mimes it rolling away.'),
            T('Hm.', 'think'),
          ],
          choices: [
            {
              id: 'promise',
              label: 'I’ll guard it with my life.',
              then: [N('Mr. Tweed nods gravely and salutes the egg. The egg wobbles.')],
            },
            {
              id: 'ask',
              label: 'Mr. Tweed, could you help?',
              set: { 'q29-tweed-help': true },
              then: [
                N('He points at himself, startled, then takes off his hat and holds it out like a nest. He is ready.'),
              ],
            },
          ],
        },
        done: {
          id: 'q29-roll',
          lines: [
            N('You set it down. It sits, and it considers.'),
            N('Mr. Tweed lies flat on the grass, shuts one eye, and checks the ground is level. It is level. He gives the egg a thumbs up.'),
            N('Somewhere nearby, a Nubbin sneezes, and the egg sets off.'),
          ],
        },
      },
      {
        id: 'q29-s2',
        goal: 'Catch the runaway egg before it reaches the stream.',
        hint: 'Get ahead of it and wait on the path; tapping it from behind only makes it faster. Mr. Tweed’s hat counts as a catch.',
        check: 'minigame:chase:runaway-egg:before-stream',
        scene: {
          id: 'q29-chase',
          lines: [
            N('The egg rolls down the garden path, gathering speed and looking, somehow, delighted.'),
            N('It bumps off a fence post, takes the left fork, and heads for the bridge.'),
            N('Mr. Tweed vaults the fence, mostly, and sets off after it holding his hat out in front of him.'),
            T('Egg!', 'shock'),
            N('It rattles over the bridge and past the dojo, where three karate Nubbins bow to it as it goes by.'),
            N('Mr. Tweed takes a shortcut through a hedge. He comes out ahead of the egg, wearing most of the hedge.'),
            N('Beyond the dojo is the stream. Eggs float, mostly, but you would rather not find out.'),
          ],
        },
        done: {
          id: 'q29-caught',
          lines: [
            N('You dive, and Mr. Tweed dives. The egg bounces off your hands, off his head, and lands neatly in his hat.'),
            N('He holds the hat up, muddy and triumphant.'),
            T('Ha!', 'happy'),
          ],
        },
      },
      {
        id: 'q29-s3',
        goal: 'Give the egg back to Odette at the gate, safe and sound.',
        hint: 'Odette waits at your gate at sunset. Carry the egg to her and choose Give.',
        check: 'give:item:visiting-egg:odette',
        scene: {
          id: 'q29-afternoon',
          lines: [
            N('For the rest of the afternoon, nobody puts the egg down.'),
            N('Mr. Tweed knits it a little woolly cosy with a hole for the top. It is lumpy, and the egg seems to like it.'),
            N('He keeps his hat off all afternoon, upside down beside the egg, just in case.'),
            N('You line an old fruit box with a blanket and put it on wheels, with a stone wedged at each end for brakes.'),
            N('The egg wobbles once, tries the box, and decides to stay.'),
            N('There is room in the box for two. Your own eggs look at it with interest.'),
            N('As the sun goes down, Odette comes back over the ridge.'),
          ],
        },
      },
    ],
    complete: {
      id: 'q29-complete',
      lines: [
        O('There it is, safe and sound. And wearing a jumper!', 'happy'),
        N('Mr. Tweed bows modestly. The cosy has his initial knitted on it, upside down.'),
        O('Keep the cosy, it suits your eggs. And keep that box. Two eggs side by side, on wheels? That’s a pram, that is.'),
        N('She slips the cosy off and hands it back to you. Mr. Tweed passes her the egg last.'),
        N('He holds on a moment longer than he needs to, pats it twice, and lets go. She tucks it into her basket.'),
        O('So. Was it good?'),
      ],
      choices: [
        {
          id: 'honest',
          label: 'It went for a little roll.',
          set: { 'q29-told': true },
          then: [O('They always do. That’s why I asked a good Keeper and not the waiting room.', 'happy')],
        },
        {
          id: 'angel',
          label: 'A perfect angel.',
          then: [
            N('Behind you, Mr. Tweed slowly picks a twig out of his hair.'),
            N('Odette notices. Odette, kindly, says nothing.'),
          ],
        },
      ],
    },
    rewards: [
      {
        id: 'egg-pram',
        kind: 'feature',
        label: 'Egg Pram',
        description: 'A fruit box on wheels. Carry two eggs at once.',
      },
      {
        id: 'egg-cosy',
        kind: 'cosmetic',
        label: 'Egg Cosy',
        description: 'A lumpy hand-knitted cosy for any egg, with an upside-down initial on it.',
      },
    ],
    notes:
      'Odette is a friendly visiting Keeper from over the ridge; she can reappear later. Her egg is a temporary item ' +
      'that cannot hatch, be sold or be thrown. The chase is a downhill route: garden path, fork, bridge, dojo, ' +
      'stream. The egg rolls faster on slopes and when tapped from behind; the player catches it by standing in ' +
      'its path, or Mr. Tweed’s hat does on the last stretch if the player chose "ask". If it reaches the stream ' +
      'bank it bumps a reed and stops, and the chase restarts from the bridge. Art: speckled egg, lumpy cosy with ' +
      'upside-down "T", fruit-box pram.',
  },

  // ------------------------------------------------------------------ Q30
  {
    id: 'q30',
    code: 'Q30',
    title: 'The Three-Wheeler',
    source: 'Mr. Bean: the rival three-wheeled car he keeps tipping over',
    audience: 'all',
    trigger: { where: 'The ridge track', when: 'A weekend afternoon, after Q22' + WHEN_SUFFIX },
    requires: ['Q22'],
    speakers: [TWEED, RUFUS],
    steps: [
      {
        id: 'q30-s1',
        goal: 'Meet Rufus at the start line and enter the ridge race in your hand cart.',
        hint: 'Ride your hand cart to the start line on the ridge track and talk to Rufus.',
        check: 'enter:race:ridge-track:bluebell',
        scene: {
          id: 'q30-meet',
          lines: [
            N('A bright blue three-wheeled cart rattles up the lane. It has one wheel at the front and a great deal of confidence.'),
            R('Afternoon! Rufus Crankshaw. And this is the Bluebell. Fastest three wheels this side of the ridge.', 'happy'),
            N('Mr. Tweed is riding in the back of your hand cart, the one he gave you. He looks at the Bluebell’s single front wheel.'),
            N('He smiles a very small smile.'),
            R('Is that a race face? That’s a race face. One lap of the ridge track. Winner gets bragging rights.'),
            N('Mr. Tweed points forward like a ship’s captain. Then he holds up three fingers and tips his flat hand gently onto its side.'),
            T('Three.'),
          ],
          choices: [
            {
              id: 'race',
              label: 'You’re on.',
              then: [R('Splendid! Mind your wheels. All four of them, show-off.', 'happy')],
            },
            {
              id: 'warn',
              label: 'Is the Bluebell… stable?',
              set: { 'q30-warned': true },
              then: [
                R('Stable as a table! A three-legged table, which is the steadiest kind. Ask anyone.'),
                N('Behind him, the Bluebell tips gently onto its side, all by itself.'),
                R('…It does that.', 'think'),
              ],
            },
          ],
        },
        done: {
          id: 'q30-grid',
          lines: [
            N('Two carts on the line. Rufus revs the Bluebell by saying “brrm” quite loudly.'),
            N('Mr. Tweed polishes the front of your cart with his sleeve, then the front of the Bluebell, to be fair.'),
          ],
        },
      },
      {
        id: 'q30-s2',
        goal: 'Win the race, overtaking the Bluebell so that it tips over three times.',
        hint: 'Draw level with the Bluebell on a bend and let Mr. Tweed wave. Do it three times, then cross the line first.',
        check: 'race:win:ridge-track:bluebell-tips-3',
        scene: {
          id: 'q30-race',
          lines: [
            N('The flag drops. Rufus shoots off the line, waving.'),
            N('Mr. Tweed, in the back of your cart, points at the Bluebell, then at a gap on the inside of the bend.'),
            N('Every time you draw level, he leans out and gives Rufus a cheerful little wave.'),
            N('Every time, Rufus waves back. The Bluebell leans, and leans, and gently tips over.'),
            R('Not to worry! It does that!', 'happy'),
            N('He rights it with one hand and is off again. He is very, very good at righting it.'),
            T('Ha!', 'happy'),
          ],
          choices: [
            {
              id: 'stop-waving',
              label: 'Tell Mr. Tweed to stop waving. Win it fair.',
              set: { 'q30-fair': true },
              then: [
                N('Mr. Tweed looks wounded, and sits on his hands.'),
                N('On the next bend Rufus draws level, sees you, and waves anyway. The Bluebell tips over.'),
                R('Not to worry! I just like waving!', 'happy'),
                N('Mr. Tweed slowly takes his hands out from under him. It was never his fault. He looks enormously relieved.'),
              ],
            },
            {
              id: 'keep-waving',
              label: 'Let him wave. It’s only friendly.',
              then: [N('Mr. Tweed waves so warmly that a Nubbin on the verge waves back, and also tips over.')],
            },
          ],
        },
      },
    ],
    complete: {
      id: 'q30-complete',
      lines: [
        N('You cross the line first. The Bluebell crosses second, on its side, sliding.'),
        R('Ha! What a race! Three tips! That’s a personal best. Or worst. One of those.', 'happy'),
        N('Mr. Tweed shakes his hand. Rufus shakes back so hard that the Bluebell, parked, tips over again.'),
        R('Tell you what. I’ve an old one at home. Smaller. Tips if you breathe near it. Your Nubbins would love it.'),
        N('Next morning there is a little blue three-wheeler in your garden. A Nubbin bumps it, it tips, and the Nubbin is thrilled.'),
      ],
    },
    rewards: [
      {
        id: 'mini-three-wheeler',
        kind: 'decor',
        label: 'Little Three-Wheeler',
        description: 'A small blue three-wheeled cart for the garden. It tips over when Nubbins bump it, which they love.',
      },
    ],
    notes:
      'Requires Q22 for the Hand Cart; Mr. Tweed rides in its back seat as navigator (he gave the cart away, so he ' +
      'never drives). Rufus is a cheerful rival, never mean, and always rights the Bluebell himself; nobody is hurt. ' +
      'Race: one lap of the ridge track with three marked bends; drawing level on a bend triggers Mr. Tweed’s wave ' +
      'and the Bluebell tip animation (it loses about two seconds). The check needs a first-place finish with at ' +
      'least three tips; finishing without three tips plays Rufus: "Again? Again!" and restarts. Do not model the ' +
      'Bluebell on any real car brand. The garden three-wheeler is a physics prop that tips on bump and rights itself ' +
      'after a few seconds. ' +
      'The step 2 choice is cosmetic: either way Rufus keeps tipping, because he waves at everyone. q30-fair only changes the line he says.',
  },
];

/**
 * Variant scene for the fun-pack rules (src/sim/fun-pack-rules.ts): q27-complete-told is the
 * complete scene for a player who chose "tell the Warden" in step 1 (flag q27-wanted-to-tell)
 * and then stays quiet; Mr. Tweed holds them to it. The confess branch needs no variant.
 */
const q27Complete = QUESTS_BEAN.find((q) => q.id === 'q27')?.complete;
if (!q27Complete) throw new Error('no quest q27');

export const QUESTS_BEAN_VARIANTS: Scene[] = [
  {
    ...q27Complete,
    id: 'q27-complete-told',
    choices: (q27Complete.choices ?? []).map((c) =>
      c.id === 'quiet'
        ? {
            ...c,
            then: [
              ...(c.then ?? []),
              N('Mr. Tweed taps the clock, then points at you: try first, then tell. He waits. He is very good at waiting.'),
            ],
          }
        : c,
    ),
  },
];

export const CHECKS: string[] = [
  'find:clue:bear-scarf:pond',
  'find:item:tweed-bear',
  'give:item:tweed-bear:mr-tweed',
  'tie:decor:armchair:tweed-cart',
  'escort:tweed-cart:tweed-cottage:no-drops',
  'pet:nubbin:pumpkin',
  'minigame:wiggle:pumpkin:3-beat',
  'minigame:shuffle:exam-paper:3',
  'pass:kindergarten:test:both',
  'rescue:mr-tweed:waterfall-ledge',
  'build:decor:diving-board:pond',
  'minigame:hand-over:picnic:6',
  'feed:nubbins:picnic-blanket:all',
  'gather:nubbins:keepers-hall:3',
  'photo:match:founders-portrait',
  'place:photo:keepers-hall:founders-frame',
  'clear:tweed-cottage:nubbins-and-bear',
  'stand:back:tweed-cottage:hedge',
  'place:item:visiting-egg:flat',
  'minigame:chase:runaway-egg:before-stream',
  'give:item:visiting-egg:odette',
  'enter:race:ridge-track:bluebell',
  'race:win:ridge-track:bluebell-tips-3',
];
