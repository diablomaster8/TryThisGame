/**
 * Fun quests Q46–Q65: the Avatar pack (based on Avatar: The Last Airbender, 2005–2008).
 *
 * Optional, one time only, audience 'all'. They never set campaign flags; choices set only
 * harmless `q<nn>-` flags. All dialogue is original except the approved quotes
 * ("My cabbages!", "Flameo, hotman!", "It's the quenchiest!"), each swapped in childLines.
 * Q64 adapts the fourth quote to "Hello, Kaito here." (no swap needed, per the brief).
 * Uncle Tenzo's proverbs are all new. The Q47 nomad song is original.
 * Q58 unlocks Aunt Wen's bone reading: reader id `aunt-wen` in readers.ts.
 * Order: Q46 opens the line; Q56 introduces Bao; Q64 brings Kaito into the group. Every quest
 * after Q46 requires it; Q55 and Q64 require Q56; Q49, Q50, Q55 and Q65 require Q64.
 * Never during Chapters 9–11 (`WHEN_SUFFIX` on every trigger).
 */
import type { Quest, Speaker } from './types';
import type { Line, Mood } from '../config/story';

const say =
  (who: string) =>
  (text: string, mood?: Mood): Line =>
    mood ? { who, text, mood } : { who, text };

const sp = (id: string, name: string, basedOn?: string): Speaker =>
  basedOn ? { id, name, kind: 'other', basedOn } : { id, name, kind: 'other' };

// ---------------------------------------------------------------- main cast
const PEMBA = sp('pemba', 'Pemba', 'Aang');
const NALU = sp('nalu', 'Nalu', 'Katara');
const TUK = sp('tuk', 'Tuk', 'Sokka');
const BAO = sp('bao', 'Bao', 'Toph Beifong');
const KAITO = sp('kaito', 'Kaito', 'Zuko');
const TENZO = sp('tenzo', 'Uncle Tenzo', 'Iroh');
const PUFFIN = sp('puffin', 'Puffin', 'Appa');
const LUMI = sp('lumi', 'Lumi', 'Momo');
const CABBAGE = sp('cabbage-merchant', 'The cabbage merchant', 'Cabbage merchant');
const RUMBOLD = sp('rumbold', 'King Rumbold', 'Bumi');
const SUMI = sp('sumi', 'Sumi', 'Suki');
const PIAN = sp('pian', 'Master Pian', 'Piandao');
const WEN = sp('aunt-wen', 'Aunt Wen', 'Aunt Wu');
const PLAYERS = sp('ember-bay-players', 'The Ember Bay Players', 'Ember Island Players');

// ---------------------------------------------------------------- one-quest cast
const JUNO = sp('juno', 'Wandering Juno', 'Chong');
const MAUD = sp('maud', 'Elder Maud', 'Gan Jin tribe leader');
const BRACK = sp('brack', 'Chief Brack', 'Zhang tribe leader');
const HEADMASTER = sp('headmaster', 'The Headmaster', 'Fire Nation school headmaster');
const RIN = sp('rin', 'Rin', 'On Ji');
const PELL = sp('mr-pell', 'Old Mr Pell');
const GORRO = sp('gorro', 'Rumble Master Gorro', 'Xin Fu');
const SLAB = sp('big-slab', 'The Big Slab', 'The Boulder');
const REEDY = sp('ma-reedy', 'Ma Reedy', 'Jang Hui villager');
const HAKE = sp('captain-hake', 'Captain Hake', 'Pirate captain');
const TIBBS = sp('mayor-tibbs', 'Mayor Tibbs', 'Mayor of Chin Village');
const MRSTIBBS = sp('mrs-tibbs', 'Mrs Tibbs');

const N = say('narrator');
const Y = say('you');
const P = say('pemba');
const K = say('nalu');
const T = say('tuk');
const B = say('bao');
const Z = say('kaito');
const I = say('tenzo');
const A = say('puffin');
const M = say('lumi');
const C = say('cabbage-merchant');
const BU = say('rumbold');
const S = say('sumi');
const PI = say('pian');
const W = say('aunt-wen');
const PL = say('ember-bay-players');
const J = say('juno');
const MA = say('maud');
const BR = say('brack');
const H = say('headmaster');
const R = say('rin');
const PE = say('mr-pell');
const G = say('gorro');
const SL = say('big-slab');
const RE = say('ma-reedy');
const CH = say('captain-hake');
const TI = say('mayor-tibbs');
const MT = say('mrs-tibbs');

const SOURCE = 'Avatar: The Last Airbender';

/** Fun quests never trigger during Chapters 9–11 (the Long Night chapters). */
const WHEN_SUFFIX = ' (never during Chapters 9–11)';

export const QUESTS_AVATAR: Quest[] = [
  // ------------------------------------------------------------------ Q46
  {
    id: 'q46',
    code: 'Q46',
    title: 'My Cabbages!',
    source: `${SOURCE}: the cabbage merchant (running gag)`,
    audience: 'all',
    trigger: { where: 'The main path through the Grove, by the race track', when: 'Any dry afternoon' + WHEN_SUFFIX },
    speakers: [CABBAGE, PEMBA, TUK],
    steps: [
      {
        id: 'q46-s1',
        goal: 'Gather the cabbages scattered across the meadow and help put the cart’s wheel back on.',
        hint: 'Cabbages roll downhill. Check the stream bank and under the bushes.',
        check: 'collect:cabbage:8',
        scene: {
          id: 'q46-crash',
          lines: [
            N('A wooden cart creaks up the main path, piled high with cabbages. A man in a straw hat pushes it like it is made of glass.'),
            C('Afternoon! Fine cabbages, crisp cabbages, cabbages for every occasion. Weddings. Birthdays. Snacks.', 'happy'),
            C('I’ve pushed this cart all over the world, and I have a very good feeling about this Grove.'),
            N('Behind you, a Nubbin in full racing stride rounds the bend. It is not looking where it is going. It never is.'),
            N('There is a thud, a wobble, and a long, slow tip. Cabbages roll in every direction.'),
            C('My cabbages!', 'shock'),
            N('Your Nubbin sits up in the wreckage wearing a cabbage leaf like a hat, very pleased with itself.'),
            C('The wheel’s come off. And they’re all over the meadow. Some of them are in the stream.', 'sad'),
          ],
          choices: [
            {
              id: 'sorry',
              label: 'Apologise for your Nubbin',
              then: [
                Y('Sorry. It’s still learning about corners.'),
                C('Corners. Yes. A lot of people are still learning about corners.'),
              ],
            },
            {
              id: 'buy',
              label: 'Offer to buy the dented ones',
              set: { 'q46-bought-dented': true },
              then: [C('Dented cabbages are still cabbages! That is my whole philosophy.', 'happy')],
            },
            {
              id: 'track',
              label: 'Point out that this is the race track',
              then: [
                Y('In fairness, this is the race track.'),
                C('In fairness, I didn’t see a sign.'),
                N('There is a sign. It is very large. He is standing on it.'),
              ],
            },
          ],
        },
        done: {
          id: 'q46-crash-done',
          lines: [
            N('You slot the wheel back on the axle. The cart stands up straight, and so does the merchant.'),
            C('All eight! Only slightly muddy. You have a gift.', 'happy'),
          ],
        },
      },
      {
        id: 'q46-s2',
        goal: 'Shake the big fruit tree bare, then repair the cabbage cart with planks and rope.',
        hint: 'Tap the tree until nothing else falls. Planks and rope are in the shed by the gate.',
        check: 'repair:cabbage-cart',
        scene: {
          id: 'q46-fruit',
          lines: [
            N('The merchant parks his cart under the big fruit tree, well away from the race track.'),
            C('Shade, peace and quiet. Nothing can go wrong in the shade.'),
            N('A breeze stirs the branches. High above the cart, something round and heavy wobbles on its stalk.'),
            C('Is that tree looking at me?', 'think'),
            N('The fruit drops. It is very large. It lands squarely on the cart, which folds neatly in half.'),
            C('…I’m not going to say it. I’m saving it for something worse.', 'sad'),
            N('He picks the fruit out of the wreckage, sniffs it, and hands it to your Nubbin, who eats it at once.'),
            C('Right. Planks, rope, and someone to shake that tree empty before I park under it again.'),
          ],
        },
        done: {
          id: 'q46-fruit-done',
          lines: [
            C('Good as new. Better than new. New had a squeak.', 'happy'),
            C('From now on I park in the middle of the meadow. Nothing falls on you in the middle of a meadow.', 'think'),
            N('Somewhere very high above the meadow, a bird considers this.'),
            N('Your Nubbins share the fallen fruit and watch him polish a cabbage on his sleeve.'),
          ],
        },
      },
      {
        id: 'q46-s3',
        goal: 'Build the merchant a cabbage cart that cannot tip over.',
        hint: 'You need four planks, two wheels and a sack of stones for weight. Tuk’s diagram is in your journal.',
        check: 'craft:cabbage-cart:untippable',
        scene: {
          id: 'q46-glider',
          lines: [
            N('Overhead, a shadow swoops in a wide, happy circle. A boy in orange and yellow is riding the wind on a wooden glider.'),
            P('Hi! Hello! Nice Grove! Is that a vegetable stall? I love vegetables!', 'happy'),
            N('He banks to wave. The glider dips. You can see exactly where this is going, and so can the merchant.'),
            C('No, no, no, no—', 'shock'),
            N('Pemba lands, rolls, and bounces off the cart. The cart does not bounce. It bursts into cabbages.'),
            C('My cabbages!', 'angry'),
            P('Oh no. That was me, wasn’t it? I’m Pemba. I’m really sorry. Can I help? I’m good at helping.', 'sad'),
            N('A boy with a boomerang on his back jogs up, out of breath, and takes in the scene.'),
            T('Let me guess. You saw a cart and thought, “That looks soft.”'),
            C('Three times in one afternoon. What I need is a cart that cannot tip. Not for Nubbins, not for fruit, not for flying boys.', 'think'),
            T('Now that is a problem I can plan for. I’ve got diagrams. I’ve always got diagrams.', 'happy'),
            C('Thirty-one carts, I’ve lost. Every one taught me something. The first taught me wheels. The ninth taught me rope.', 'think'),
          ],
          choices: [
            {
              id: 'wide',
              label: 'Make it wide',
              set: { 'q46-cart': 'wide' },
              then: [T('Wide. Good. Like a duck sitting down. Ducks never tip over.')],
            },
            {
              id: 'low',
              label: 'Make it low',
              set: { 'q46-cart': 'low' },
              then: [T('Low wheels, heavy bottom. You can’t knock over something that’s already nearly lying down.')],
            },
            {
              id: 'bell',
              label: 'Give it a warning bell',
              set: { 'q46-cart': 'bell' },
              then: [
                C('A bell! So they hear me coming!', 'happy'),
                T('Fine. A bell. But it’s also going to be wide and low, because I have standards.'),
              ],
            },
          ],
        },
        done: {
          id: 'q46-glider-done',
          lines: [
            N('The new cart sits low and wide, like a sensible duck.'),
            P('Can I test it? I want to test it. Please let me test it.', 'happy'),
          ],
        },
      },
    ],
    complete: {
      id: 'q46-complete',
      lines: [
        N('Pemba takes a run-up and throws himself at the cart with all his might.'),
        N('He bounces off. The cart doesn’t move. Not one cabbage stirs.'),
        C('It holds! It holds! Oh, it’s beautiful. I could weep. I might weep.', 'happy'),
        P('Doesn’t it make you want to give up? Losing everything, over and over?'),
        C('Every time I lose the lot, somebody stops to help me pick it up. I’ve met half the world that way.', 'soft'),
        T('Everybody laughs at diagrams until the diagrams work.'),
        C('Keep the old cart, friend. Put cabbages in it. It deserves a quiet retirement after the day it’s had.'),
        N('The old cart is yours now, a planter on wheels. Somehow, you’ve also picked up his favourite cry of despair.'),
        P('Do the cry! Do it at something small! Like a dropped spoon!', 'happy'),
      ],
    },
    rewards: [
      {
        id: 'q46-cabbage-cart',
        kind: 'decor',
        label: 'Cabbage cart',
        description: 'The merchant’s old cart, patched up and planted with cabbages. Nubbins like to sit in it.',
      },
      {
        id: 'q46-cabbage-emote',
        kind: 'cosmetic',
        label: '“My cabbages!” emote',
        description: 'Your Keeper throws both arms at the sky and wails over a lost cabbage. In the Learning Grove the wail is “Not the cabbages!”',
      },
    ],
    childLines: {
      'q46-crash#5': 'Not the cabbages! Not again!',
      'q46-glider#5': 'Oh, my poor leafy darlings!',
    },
    notes:
      'Three wrecks in one afternoon: keep the steps back to back. Cart wreck needs a tip-over animation and a cabbage scatter (8 pickups, some in the stream). Step 2 crash: one oversized fruit sprite. Step 3: Pemba glides in from off-screen. The cart-style choice (q46-cart) pays off in q46-complete: with “bell” the bell goes TING after the bounce (a line inserted by flag; wide and low share the base lines). The emote’s voice line uses the childLines text in the Learning Grove.',
  },

  // ------------------------------------------------------------------ Q47
  {
    id: 'q47',
    code: 'Q47',
    title: 'The Secret Tunnel',
    source: `${SOURCE}: The Cave of Two Lovers`,
    audience: 'all',
    trigger: { where: 'The foot of the ridge, by the waterfall', when: 'Any evening' + WHEN_SUFFIX },
    requires: ['Q46'],
    speakers: [JUNO, NALU, TUK, PEMBA],
    steps: [
      {
        id: 'q47-s1',
        goal: 'Follow the singing nomads into the tunnel under the ridge.',
        hint: 'The tunnel mouth is behind the waterfall at the foot of the ridge. Bring at least one Nubbin.',
        check: 'visit:ridge-tunnel',
        scene: {
          id: 'q47-nomads',
          lines: [
            N('A painted wagon rolls up to the foot of the ridge, jingling with bells. Three nomads lounge on top, one tuning a lute.'),
            J('Greetings, travellers! I’m Juno. We go where the wind goes. Today the wind is going under that hill.', 'happy'),
            T('There’s a perfectly good path over the hill.'),
            J('Over is for people in a hurry. Under is for people with stories. Also, the path has a goat on it. A mean one.'),
            K('Is the tunnel safe?'),
            J('Safe as a song, friend. Here, I’ll sing you the one about it.', 'soft'),
            J('♪ Under the hill, under the hill,'),
            J('♪ The rocks are cold and the bats keep still.'),
            J('♪ Bring a snack and bring a mate,'),
            J('♪ Don’t let go or you’ll be late—'),
            J('♪ Doo-be-doo, the moss is blue, under the hill with you!', 'happy'),
            T('That song has no useful information in it.'),
            N('Pemba is already humming it. So is your Nubbin. You suspect you will be humming it for a week.'),
          ],
          choices: [
            {
              id: 'sing',
              label: 'Join in on the doo-be-doo',
              set: { 'q47-sang': true },
              then: [J('A natural! The moss approves.', 'happy')],
            },
            {
              id: 'long',
              label: 'Ask how long the tunnel is',
              then: [
                J('Long enough to have a good time. Short enough to come out the other side. Probably.'),
                T('“Probably” is my least favourite word.'),
              ],
            },
            {
              id: 'goat',
              label: 'Ask about the goat',
              then: [J('He bit my lute once. We don’t talk about it.', 'sad')],
            },
          ],
        },
        done: {
          id: 'q47-nomads-done',
          lines: [
            N('The tunnel swallows the last of the daylight. Tuk’s torch flickers, sputters, and goes out.'),
            T('Of course. Of course it does.', 'angry'),
            J('Ah. This is the part of the song we haven’t written yet.'),
          ],
        },
      },
      {
        id: 'q47-s2',
        goal: 'Find the way out of the crystal maze, keeping a Nubbin beside you so the crystals stay lit.',
        hint: 'If your Nubbin wanders more than a step away, the light goes out. Stop and call it back.',
        check: 'minigame:complete:crystal-maze',
        scene: {
          id: 'q47-crystals',
          lines: [
            N('It is very dark. Somewhere ahead, water drips, and something with too many wings flaps away.'),
            K('Everyone stay close. Pemba, stop humming.'),
            P('I’m not humming. That’s Tuk.'),
            T('It’s a stress hum. It’s different.'),
            N('Your Nubbin presses against your leg. Where it touches you, the wall beside you starts to glow a soft green.'),
            N('You step apart. The glow fades. You step together. It comes back, brighter.'),
            K('The crystals. They only light up when two friends are close together.', 'shock'),
            J('So that’s why we always come down here in pairs. I thought it was for the snacks.', 'happy'),
            T('So the plan is “stay together and walk”. That’s… a good plan. I’m annoyed I didn’t think of it.', 'think'),
            T('Also. For the record. I hum when I’m scared. Of the dark. There. Now everybody knows.'),
            J('Brave thing, saying that in the dark. Nobody can even see you blush.', 'soft'),
          ],
          choices: [
            {
              id: 'carry',
              label: 'Pick your Nubbin up and carry it',
              then: [N('Your Nubbin settles into your arms. The whole wall lights up like a lantern.')],
            },
            {
              id: 'paw',
              label: 'Hold its paw and walk side by side',
              then: [N('Your Nubbin grips your finger tightly. The crystals glow a steady green.')],
            },
            {
              id: 'tuk',
              label: 'Make Tuk hold Pemba’s hand',
              set: { 'q47-tuk-pemba': true },
              then: [
                T('Fine. Fine! But nobody tells anyone about this.'),
                P('I’m going to tell everyone.', 'happy'),
              ],
            },
          ],
        },
        done: {
          id: 'q47-crystals-done',
          lines: [
            N('A crack of daylight. You squeeze through into warm air, blinking. Your Nubbin doesn’t let go.'),
            J('See? Out the other side. I said probably.', 'happy'),
          ],
        },
      },
    ],
    complete: {
      id: 'q47-complete',
      lines: [
        N('The nomads wave goodbye from the far side of the ridge, singing their song again, slightly wrong.'),
        K('Take some of these. They broke off on the way out.', 'soft'),
        N('She hands you a pouch of crystal shards. They glow faintly whenever two friends sit near them.'),
        T('And now there’s a tunnel between two of your sections. You can thank me for not getting us lost.'),
        P('You were humming the whole time.'),
        T('Strategically.'),
        J('Remember, friends: the dark’s only scary when you’re alone in it. Doo-be-doo!', 'happy'),
      ],
    },
    rewards: [
      {
        id: 'q47-glow-crystals',
        kind: 'decor',
        label: 'Glowing crystals',
        description: 'Crystal shards that glow green when two Nubbins (or a Nubbin and you) are close by.',
      },
      {
        id: 'q47-cave-path',
        kind: 'feature',
        label: 'Crystal cave path',
        description: 'A short tunnel under the ridge linking two sections of the Grove. Its crystals light up as friends pass in pairs.',
      },
    ],
    notes:
      'The song is ORIGINAL (q47-nomads lines 6–10): sing to a simple lute loop, one line per box. Maze: darkness with a small light radius that only shows while the nearest Nubbin is within one tile of the Keeper. Implementer chooses which two sections the cave path joins. No real song lyrics anywhere in this quest.',
  },

  // ------------------------------------------------------------------ Q48
  {
    id: 'q48',
    code: 'Q48',
    title: 'The Great Divide',
    source: `${SOURCE}: The Great Divide`,
    audience: 'all',
    trigger: { where: 'The canyon at the edge of the rocky section', when: 'Any day' + WHEN_SUFFIX },
    requires: ['Q46'],
    speakers: [PEMBA, TUK, NALU, MAUD, BRACK],
    steps: [
      {
        id: 'q48-s1',
        goal: 'Lead both clans down the canyon path without a fight breaking out.',
        hint: 'Walk between the two groups. When tempers rise, stop for a rest.',
        check: 'escort:canyon-clans',
        scene: {
          id: 'q48-canyon',
          lines: [
            N('Two groups of travellers stand at the top of the canyon, glaring at each other across a pile of luggage.'),
            MA('The Hollins will go first. We are clean, orderly, and we fold our socks.'),
            BR('The Drays will go first. We are honest, hardy, and we don’t own socks.', 'angry'),
            MA('That is not the boast you think it is.'),
            T('The canyon guide quit this morning. Something about a sprained everything. So, who wants to guide?'),
            P('Me! How hard can it be? It’s just walking downhill with people who hate each other.', 'happy'),
            K('Pemba, please don’t say that part out loud.'),
            BR('Fine. But no Hollin food in the canyon. They cook with too much… tidiness.'),
            MA('And no Dray food. It smells of grudge.'),
          ],
          choices: [
            {
              id: 'hollins',
              label: 'Let the Hollins go first',
              set: { 'q48-first': 'hollins' },
              then: [BR('Typical.'), N('The Drays follow, loudly, two steps behind.')],
            },
            {
              id: 'drays',
              label: 'Let the Drays go first',
              set: { 'q48-first': 'drays' },
              then: [MA('Of course.'), N('The Hollins follow, sniffing, two steps behind.')],
            },
            {
              id: 'together',
              label: 'Make them walk side by side',
              set: { 'q48-first': 'together' },
              then: [
                MA('Absolutely not.'),
                BR('Absolutely not.'),
                N('They walk side by side anyway, because the path is narrow. Neither speaks.'),
              ],
            },
          ],
        },
        done: {
          id: 'q48-canyon-done',
          lines: [
            N('You reach the canyon floor at dusk. Nobody has pushed anybody off anything. It feels like a miracle.'),
            T('Day one. Zero shoves. I’m putting that on a sign.'),
            MA('The Hollins will camp on the left.'),
            BR('Then the Drays will camp on the left of the left.', 'angry'),
            K('That’s… the same place. You’re all camping in the same place.'),
          ],
        },
      },
      {
        id: 'q48-s2',
        goal: 'Keep a straight face while Pemba finishes his story about the clans’ ancestors.',
        hint: 'Tap only when the laugh meter is in the green. Looking at your Nubbin makes it worse.',
        check: 'minigame:complete:straight-face',
        scene: {
          id: 'q48-story',
          lines: [
            N('Around the campfire, a Hollin child and a Dray child both reach for the last dumpling.'),
            N('Within seconds it is a food fight. Rice flies. Somebody throws a sandal. Your Nubbin catches it, thrilled.'),
            MA('Your ancestor stole our ancestor’s ball! Two hundred years ago! It was a very good ball!', 'angry'),
            BR('Your ancestor kicked it into the river first!', 'angry'),
            P('WAIT. I… knew them. Your ancestors. Personally. Sort of. Through, um, spirit ways.'),
            T('He did not know them.', 'think'),
            P('They weren’t enemies. They were twins! The ball wasn’t stolen. It was a game. Whoever caught it chose dinner.'),
            P('And when one fell in the river, the other jumped in after. They laughed so hard the canyon cracked open.', 'happy'),
            N('Every face in the firelight turns to you, the only other witness. Pemba gives you a desperate look.'),
          ],
          choices: [
            {
              id: 'detail',
              label: 'Add a detail: “They both sang terribly.”',
              set: { 'q48-story': 'detail' },
              then: [
                BR('The Drays sing terribly!', 'shock'),
                MA('So do the Hollins!', 'shock'),
              ],
            },
            {
              id: 'nod',
              label: 'Nod slowly and solemnly',
              set: { 'q48-story': 'nod' },
              then: [N('You nod like someone who has seen the truth. It is the hardest thing you have ever done.')],
            },
            {
              id: 'cough',
              label: 'Cover a laugh with a cough',
              set: { 'q48-story': 'cough' },
              then: [N('You cough. Pemba coughs louder, to cover your cough. Somehow, it works.')],
            },
          ],
        },
        done: {
          id: 'q48-story-done',
          lines: [
            MA('Twins. All this time.', 'soft'),
            BR('Pass the dumplings, cousin.', 'soft'),
            K('(whispering) Pemba, this is wrong. It isn’t true. They deserve to know it isn’t true.'),
            P('(whispering) But look at them. They’re sharing a blanket.'),
          ],
          choices: [
            {
              id: 'q48-tell',
              label: 'Tell the clans the story was made up',
              set: { 'q48-truth': 'told' },
              then: [
                MA('Of course it was made up, guide. Twins don’t argue about socks for two hundred years.'),
                BR('But it’s a better story than the one we had. We’re keeping it.', 'soft'),
                K('…Oh. I didn’t think of that.', 'think'),
              ],
            },
            {
              id: 'q48-keep',
              label: 'Keep Pemba’s secret',
              set: { 'q48-truth': 'kept' },
              then: [
                K('Fine. But if it falls apart, it falls on you, Pemba.'),
                P('Then I’ll be the one who tells them. Promise. Just not during dumplings.', 'soft'),
              ],
            },
          ],
        },
      },
    ],
    complete: {
      id: 'q48-complete',
      lines: [
        N('In the morning the two clans climb out of the canyon together, arguing happily about which twin was taller.'),
        T('Did you make all of that up?'),
        P('Every single word.', 'happy'),
        K('Pemba!'),
        P('What? They’re sharing socks now. Look.'),
        N('Chief Brack is, in fact, wearing socks. He seems confused, but open to it.'),
        MA('Take this, guide. And we’ll build a bridge, so nobody has to argue down there ever again.'),
        N('She presses a wide-brimmed canyon guide’s hat into your hands. By evening, a rope bridge spans the gap.'),
      ],
    },
    rewards: [
      {
        id: 'q48-guide-hat',
        kind: 'cosmetic',
        label: 'Canyon guide’s hat',
        description: 'A wide-brimmed, sun-faded hat for your Keeper. Comes with an air of knowing the way.',
      },
      {
        id: 'q48-rope-bridge',
        kind: 'feature',
        label: 'Rope bridge',
        description: 'A swaying rope bridge across the canyon, joining the rocky section to its neighbour.',
      },
    ],
    notes:
      'Escort: two NPC groups that drift apart and grumble; standing between them calms a “tension” bar. Straight-face minigame: a laugh meter that rises with each of Pemba’s lines; tap in the green to hold it. Pemba’s ancestor story is invented in-world (he admits it); keep the tone light. q48-truth (told / kept) is the quest’s real question: is a kind invention ever fine? It is paid off in q48-complete (a Nalu line inserted by flag: kept, “You promised to tell them”; told, “They knew all along”). If told, the clans reveal they guessed, and keep the story anyway.',
  },

  // ------------------------------------------------------------------ Q49
  {
    id: 'q49',
    code: 'Q49',
    title: 'Flameo, Hotman',
    source: `${SOURCE}: The Headband`,
    audience: 'all',
    trigger: { where: 'The schoolhouse at the edge of the Grove', when: 'Any weekday morning' + WHEN_SUFFIX },
    requires: ['Q46', 'Q64'],
    speakers: [PEMBA, KAITO, HEADMASTER, RIN],
    steps: [
      {
        id: 'q49-s1',
        goal: 'Hand out five secret party invitations without the headmaster noticing.',
        hint: 'Wait until his back is turned at the board. Students by the window are easiest to reach.',
        check: 'deliver:party-invite:5',
        scene: {
          id: 'q49-school',
          lines: [
            N('The schoolhouse bell rings. Rows of children sit very straight, hands folded, faces blank.'),
            Z('I went here. For a term. Before… you know. Everything.'),
            Z('The rules haven’t changed. No running. No humming. No unauthorised enthusiasm.', 'think'),
            N('A boy slips into the back row in a red headband pulled low over a blue arrow tattoo. It is not a good disguise.'),
            P('Hi! I’m new! I’m, er, Kuzo! From… the big town! Where the things are!', 'happy'),
            H('New boy. In this school we do not dance, we do not sing, and we do not say “hi”.', 'angry'),
            P('Not even a little dance? With your shoulders?'),
            H('Especially not with your shoulders.'),
            R('(whispering) What’s a dance?', 'soft'),
            P('Oh, that’s it. We’re throwing a party.', 'shock'),
          ],
          choices: [
            {
              id: 'lunch',
              label: 'Hide invitations in lunch boxes',
              set: { 'q49-invite': 'lunch' },
              then: [Z('Sneaky. I approve. I think. Is approving allowed?')],
            },
            {
              id: 'birds',
              label: 'Fold them into paper birds',
              set: { 'q49-invite': 'birds' },
              then: [N('The paper birds sail over the headmaster’s head. He swats at one and misses.')],
            },
            {
              id: 'kaito',
              label: 'Let Kaito deliver them',
              set: { 'q49-invite': 'kaito' },
              then: [
                Z('Hi. You. Party. Cave. Tonight. Don’t… tell. Okay. Bye.'),
                N('Somehow, everyone still says yes.'),
              ],
            },
          ],
        },
        done: {
          id: 'q49-school-done',
          lines: [R('A cave? At night? Is that allowed?', 'happy'), P('Nope!', 'happy')],
        },
      },
      {
        id: 'q49-s2',
        goal: 'Keep the party going: hit the beats in time to get everyone dancing.',
        hint: 'Tap when the drum ring closes. Missed beats make shy dancers drift back to the wall.',
        check: 'minigame:score:cave-dance:300',
        scene: {
          id: 'q49-party',
          lines: [
            N('The cave behind the waterfall is full of nervous children standing flat against the walls.'),
            N('Your Nubbins have brought drums. Well, buckets. They are hitting the buckets.'),
            P('Okay! Dancing is easy. You feel the beat and let your body tell you what to do.'),
            R('My body is telling me to leave.', 'shock'),
            Z('Mine too. Pemba, I don’t dance. I don’t think I physically can.'),
            P('Everybody can dance! It’s just moving on purpose. Watch the Nubbins.', 'happy'),
            N('Your Nubbins wiggle, stomp and spin in time with the buckets. One by one, the children start copying them.'),
            Z('…Is this right? Am I doing it? My arms feel like someone else’s.', 'think'),
          ],
        },
        done: {
          id: 'q49-party-done',
          lines: [
            N('Then the headmaster bursts into the cave with a lantern.'),
            H('WHAT is going ON in here?', 'angry'),
            N('The buckets stop. Every child freezes mid-wiggle. Kaito, very slowly, lowers his arms.'),
          ],
          choices: [
            {
              id: 'q49-cover',
              label: 'Get everyone dancing in front of Pemba',
              set: { 'q49-escape': 'cover' },
              then: [N('Every child dances at once, a wall of whirling arms, and Pemba slips out the back.')],
            },
            {
              id: 'q49-kaito-speaks',
              label: 'Let Kaito speak',
              set: { 'q49-escape': 'kaito' },
              then: [
                Z('Sir. I sat in your front row for a whole term. I followed every rule. I was miserable.'),
                Z('Rules are fine. I like some rules. But they should be for us. Not instead of us.', 'soft'),
                H('…Ten minutes. Then everybody goes home.'),
                N('He stays for twelve. Nobody sees his foot tapping, except you. Pemba slips out the back anyway, out of habit.'),
              ],
            },
            {
              id: 'q49-ask-head',
              label: 'Ask the headmaster to dance',
              set: { 'q49-escape': 'invite' },
              then: [
                H('I most certainly will not.', 'angry'),
                N('His shoulders, very slightly, do. In the confusion, Pemba slips out the back.'),
              ],
            },
          ],
        },
      },
    ],
    complete: {
      id: 'q49-complete',
      lines: [
        N('Outside, under the stars, the children spill out laughing. Nobody is in trouble. Nobody has ever had this much fun.'),
        R('We danced! Kuzo, we actually danced!', 'happy'),
        P('You were amazing. All of you.', 'happy'),
        P('Flameo, hotman!', 'happy'),
        Z('I don’t know what that means, and I’m not going to ask.', 'think'),
        N('Pemba pulls off the red headband and ties it round your wrist. Your Nubbins are still wiggling.'),
      ],
    },
    rewards: [
      {
        id: 'q49-red-headband',
        kind: 'cosmetic',
        label: 'Red headband',
        description: 'A plain red headband, worn low. A terrible disguise, a great look.',
      },
      {
        id: 'q49-flameo-dance',
        kind: 'cosmetic',
        label: 'Flameo dance emote',
        description: 'Your Keeper does Pemba’s little shoulder dance. Nearby Nubbins join in.',
      },
    ],
    childLines: {
      'q49-complete#3': 'You were all on fire tonight! The good kind!',
    },
    notes:
      'Rhythm minigame: buckets as drums, closing ring timing, dancers peel off the cave wall as the combo grows. In the Learning Grove consider labelling the emote “Shoulder dance” so the quote stays out of child mode. q49-escape (cover / kaito / invite) is flavour; “kaito” is Kaito’s growth beat, so give his two lines a soft portrait.',
  },

  // ------------------------------------------------------------------ Q50
  {
    id: 'q50',
    code: 'Q50',
    title: 'The Jasmine Dragon',
    source: `${SOURCE}: Iroh’s tea shop in Ba Sing Se`,
    audience: 'all',
    trigger: { where: 'The meadow by the pond', when: 'Any morning' + WHEN_SUFFIX },
    requires: ['Q46', 'Q64'],
    speakers: [TENZO, KAITO, PELL],
    steps: [
      {
        id: 'q50-s1',
        goal: 'Brew three perfect cups of tea for Uncle Tenzo’s opening morning.',
        hint: 'Lift the kettle when the steam curls, not when it roars. Pull the leaves as the colour turns gold.',
        check: 'minigame:perfect:tea-brewing:3',
        scene: {
          id: 'q50-open',
          lines: [
            N('A little wooden stall has appeared by the pond overnight, with a hand-painted sign and a kettle already singing.'),
            I('Ah, the Keeper! Welcome to my tea shop. I have retired from generalling, you see. Now I only command leaves.', 'happy'),
            Z('He’s been up since four. He painted the sign twice. The dragon looked “too fierce”.'),
            I('A tea shop should not frighten its customers. That is the job of the prices.'),
            I('Good tea is simple. The water must be hot, but not angry. The leaves must steep, but not sulk.', 'soft'),
            Z('That makes no sense.'),
            I('It will, nephew. After the third cup, everything does.'),
            N('Your Nubbin climbs onto a stool and sniffs the tea tins one by one, sneezing at the ginger.'),
          ],
          choices: [
            {
              id: 'jasmine',
              label: 'Start with jasmine',
              set: { 'q50-first': 'jasmine' },
              then: [I('A fine choice. Jasmine forgives most mistakes, like a good friend.', 'happy')],
            },
            {
              id: 'ginger',
              label: 'Start with ginger',
              set: { 'q50-first': 'ginger' },
              then: [I('Bold! Ginger is a tea that tells you exactly what it thinks of you.')],
            },
            {
              id: 'kaito',
              label: 'Ask Kaito which tea he likes',
              then: [
                Z('I… don’t really like tea.', 'think'),
                N('Uncle Tenzo staggers and clutches the counter, as if struck.'),
              ],
            },
          ],
        },
        done: {
          id: 'q50-open-done',
          lines: [
            I('Three perfect cups. My heart is warm, and so is my tongue.', 'happy'),
            Z('You burnt your tongue again.'),
            I('For art.'),
          ],
        },
      },
      {
        id: 'q50-s2',
        goal: 'Serve Old Mr Pell a cup of tea and keep him in his seat until he’s finished.',
        hint: 'Watch his face. A grumble means the tea is too hot; a sigh means it is just right.',
        check: 'serve:tea:mr-pell',
        scene: {
          id: 'q50-grump',
          lines: [
            N('The stall’s first customer arrives: an old man with a walking stick and a face like a closed door.'),
            PE('Tea. Not fancy tea. Not flowery tea. And not with a speech, either.', 'angry'),
            I('Of course, of course. Please sit. The Keeper will serve you personally.', 'happy'),
            PE('Last place I went, the tea tasted of boiled sock.'),
            Z('Then go back to the sock place.', 'angry'),
            I('Nephew. A bitter guest is only a sweet guest who has not been served yet.'),
            Z('…Is that a real saying?', 'think'),
            I('It is now.'),
          ],
          choices: [
            {
              id: 'jasmine',
              label: 'Serve him jasmine',
              set: { 'q50-pell': 'jasmine' },
              then: [
                PE('Flowery. I said no flowery.'),
                N('He drinks it all anyway, and holds out the cup for more.'),
              ],
            },
            {
              id: 'black',
              label: 'Serve him strong black tea',
              set: { 'q50-pell': 'black' },
              then: [PE('Hm. Finally, a tea with a spine.')],
            },
            {
              id: 'ask',
              label: 'Ask what tea he drank as a boy',
              set: { 'q50-pell': 'barley' },
              then: [
                PE('My mother made barley tea. Nobody makes barley tea any more.', 'soft'),
                I('I have barley! I have everything!', 'happy'),
              ],
            },
          ],
        },
        done: {
          id: 'q50-grump-done',
          lines: [
            PE('…Not bad.'),
            N('From Old Mr Pell, this is a standing ovation.'),
            N('He counts coins onto the counter. He is two short, and he pretends very hard not to notice.'),
            I('(quietly) Your stall today, Keeper. Your call.'),
          ],
          choices: [
            {
              id: 'q50-free',
              label: 'Tell him this one is on the house',
              set: { 'q50-pay': 'free' },
              then: [
                PE('I don’t take charity.', 'angry'),
                I('It is not charity. It is a deposit on tomorrow.', 'soft'),
                PE('…Hm. Tomorrow, then.'),
              ],
            },
            {
              id: 'q50-full',
              label: 'Kindly ask him for the rest tomorrow',
              set: { 'q50-pay': 'later' },
              then: [
                PE('Fair. A shop that gives everything away doesn’t stay a shop.'),
                I('And a fair price, gently asked, is its own kind of kindness.', 'soft'),
              ],
            },
            {
              id: 'q50-trade',
              label: 'Ask him to fix the wobbly stool instead',
              set: { 'q50-pay': 'trade' },
              then: [
                PE('That stool has been wobbling since you opened. I noticed. I notice everything.'),
                N('He fixes it with a folded leaf and the end of his walking stick. It never wobbles again.'),
              ],
            },
          ],
        },
      },
    ],
    complete: {
      id: 'q50-complete',
      lines: [
        N('By noon the stall is full. Your Nubbins doze in a row under the counter, warm as buns.'),
        I('You have a gift, Keeper. Tea is only leaves and water. The rest is paying attention.', 'soft'),
        I('The stall is yours to keep. I will visit often. I will also drink a great deal of the stock.'),
        Z('He means all of the stock.'),
        N('Kaito refills Mr Pell’s cup without being asked. Uncle Tenzo pretends not to see, and glows like a lantern.'),
        N('He hands you a tin of jasmine tea with a dragon on the lid. The dragon is not fierce at all.'),
        PE('Same time tomorrow. Don’t be late.'),
      ],
    },
    rewards: [
      {
        id: 'q50-tea-stall',
        kind: 'decor',
        label: 'Tea stall',
        description: 'Uncle Tenzo’s little wooden tea stall, with a kettle that steams on cold mornings.',
      },
      {
        id: 'q50-jasmine-tea',
        kind: 'item',
        label: 'Jasmine tea',
        description: 'Give it to a Nubbin: a calm Nubbin curls up and naps on the spot.',
      },
    ],
    notes:
      'Tea minigame: three timing bars (heat, steep, pour); “perfect” = all three in the gold band. Mr Pell can visit the stall again afterwards as an ambient NPC. All of Uncle Tenzo’s sayings here are new. q50-pay (free / later / trade): if “trade”, the stall’s stool stops wobbling.',
  },

  // ------------------------------------------------------------------ Q51
  {
    id: 'q51',
    code: 'Q51',
    title: 'Cactus Juice',
    source: `${SOURCE}: The Desert`,
    audience: 'all',
    trigger: { where: 'The desert section', when: 'Any hot afternoon' + WHEN_SUFFIX },
    requires: ['Q46'],
    speakers: [TUK, NALU, PEMBA],
    steps: [
      {
        id: 'q51-s1',
        goal: 'Keep Tuk in the shade of the big rock until Nalu comes back.',
        hint: 'Stand between Tuk and the open sand. Shiny things distract him; your Nubbin is shiny enough.',
        check: 'minigame:complete:herd-tuk',
        scene: {
          id: 'q51-desert',
          lines: [
            N('The desert stretches flat and gold in every direction. Your water skins are empty.'),
            K('Right. I’m going to find water. Rule one, which Tuk wrote and made us sign: nobody eats anything strange. Tuk, that means you.'),
            T('Me? I’m the responsible one. I have a schedule.'),
            N('Nalu leaves. Tuk eyes a fat green cactus. Thirty seconds pass.'),
            T('You know what cacti are full of? Juice. Survival juice. It would be irresponsible not to.'),
            N('He cracks one open with his boomerang and drinks deeply. His eyes go very wide.'),
            T("It's the quenchiest!", 'happy'),
            P('Tuk, why are you smiling at that rock?'),
            T('Because it’s smiling at me, Pemba. It started it.', 'happy'),
            N('Tuk sets off across the sand, waving at a cloud. Your Nubbin trots after him, delighted.'),
          ],
          choices: [
            {
              id: 'cloud',
              label: 'Agree the cloud looks friendly',
              set: { 'q51-cloud': true },
              then: [T('Thank you. Finally, someone who listens.')],
            },
            {
              id: 'cup',
              label: 'Take the cactus away from him',
              then: [T('You can take the cactus. You can’t take the feeling.', 'sad')],
            },
            {
              id: 'sip',
              label: 'Have a tiny sip yourself',
              set: { 'q51-sip': true },
              then: [N('You lift the cup, smell it, and think better of it. Your Nubbin licks the rim and sneezes.')],
            },
          ],
        },
        done: {
          id: 'q51-desert-done',
          lines: [
            N('Nalu comes back with full water skins and stops dead.'),
            K('I was gone ten minutes.', 'angry'),
            T('Nalu! You look like a giant talking fish!', 'happy'),
            K('You made the rule, Tuk! You wrote it on a list! You made me sign the list!', 'angry'),
          ],
          choices: [
            {
              id: 'q51-defend',
              label: 'Stick up for Tuk: he was really thirsty',
              set: { 'q51-side': 'tuk' },
              then: [
                K('So was I. So was everyone. That’s why we had a rule.'),
                T('Thank you, friend. Your face is a melon. A kind melon.', 'happy'),
              ],
            },
            {
              id: 'q51-back-nalu',
              label: 'Back Nalu: he broke his own rule',
              set: { 'q51-side': 'nalu' },
              then: [T('…She’s right. I hate it when the giant fish is right.', 'sad')],
            },
          ],
        },
      },
      {
        id: 'q51-s2',
        goal: 'Collect three cactus cuttings to plant back at the Grove.',
        hint: 'Cut the small side pads, not the big trunk. Gloves help; so does a patient Nubbin.',
        check: 'collect:cactus-cutting:3',
        scene: {
          id: 'q51-cuttings',
          lines: [
            K('Drink this. All of it. Slowly.'),
            T('This water’s not quenchy. It’s just wet.', 'sad'),
            P('To be fair, he did seem really happy.', 'think'),
            K('He tried to arm-wrestle a cactus, Pemba.'),
            T('And I was winning.'),
            N('The cactus, it turns out, is easy to grow. Small cuttings root anywhere the sun is hot.'),
            K('Take some home. Grow them. Just keep them away from anyone with a boomerang.', 'soft'),
          ],
        },
        done: {
          id: 'q51-cuttings-done',
          lines: [N('Three cuttings, wrapped in cloth. Your Nubbin carries one very carefully, like treasure.')],
        },
      },
    ],
    complete: {
      id: 'q51-complete',
      lines: [
        N('Back at the Grove, the cuttings take root in the sunniest corner. By morning they have little pink flowers.'),
        T('For the record, I don’t remember anything about yesterday.'),
        P('You asked a rock to be your best friend.', 'happy'),
        T('I don’t remember that.'),
        P("It's the quenchiest!", 'happy'),
        T('Nobody says that ever again.', 'angry'),
        T('Also. Turns out rules are for when you’re thirsty. Who knew.', 'think'),
        N('The cactus juice is yours to share. One small cup makes a Nubbin wobble happily for a minute, then sit down, a bit puzzled.'),
      ],
    },
    rewards: [
      {
        id: 'q51-cactus-crop',
        kind: 'feature',
        label: 'Cactus crop',
        description: 'Cactus plants that grow in hot, dry spots of the Grove and flower pink.',
      },
      {
        id: 'q51-cactus-juice',
        kind: 'item',
        label: 'Cactus juice',
        description: 'Give it to a Nubbin: it wobbles happily for a minute, then sits down. Harmless, and very silly.',
      },
    ],
    childLines: {
      'q51-desert#6': 'Best. Drink. EVER!',
      'q51-complete#4': '“Best drink ever!” You said it about forty times.',
    },
    notes:
      'Herd minigame: Tuk wanders towards mirages (a “friendly” cloud, a talking rock); stand in his path or call your Nubbin to lure him back; 60–90 seconds. Cactus juice wobble is a gentle sway animation only, never sickness. The quote appears twice; both have childLines swaps. q51-side (tuk / nalu) is flavour; the lesson lands in Tuk’s last line either way.',
  },

  // ------------------------------------------------------------------ Q52
  {
    id: 'q52',
    code: 'Q52',
    title: 'Puffin’s Lost Days',
    source: `${SOURCE}: Appa’s Lost Days`,
    audience: 'all',
    trigger: { where: 'The Grove gate', when: 'The morning after a storm' + WHEN_SUFFIX },
    requires: ['Q46'],
    speakers: [PEMBA, TUK, PUFFIN],
    steps: [
      {
        id: 'q52-s1',
        goal: 'Follow Puffin’s trail across three sections of the Grove.',
        hint: 'Look for white fur, huge footprints and flattened bushes. Your Nubbin notices clues before you do.',
        check: 'track:puffin:3',
        scene: {
          id: 'q52-gone',
          lines: [
            N('Pemba sits on a stump by the gate, holding a huge saddle with nothing in it.'),
            P('Puffin’s gone. The storm spooked him and he just… flew. I called and called.', 'sad'),
            T('Hey. He’s a giant six-legged sky bison. He’s not exactly hard to spot.', 'soft'),
            P('He gets scared on his own. He’s never been on his own.', 'sad'),
            N('Your Nubbin finds a tuft of white fur caught on the fence and brings it to you, very seriously.'),
            T('Okay. That’s a clue. Fur here means he went that way. Let’s look for more.'),
            P('You’ll help? Really?'),
          ],
          choices: [
            {
              id: 'promise',
              label: 'Promise you’ll find him',
              then: [P('Thank you. He likes people who keep promises. So do I.', 'soft')],
            },
            {
              id: 'joke',
              label: 'Ask how you lose something that big',
              then: [
                T('Thank you. I asked the same thing. I got a look.'),
                P('I didn’t lose him. He got lost. It’s different.', 'sad'),
              ],
            },
            {
              id: 'nubbin',
              label: 'Let your Nubbin lead the way',
              set: { 'q52-nubbin-leads': true },
              then: [N('Your Nubbin sniffs the fur, sneezes, and marches off confidently in the wrong direction. Then it turns round.')],
            },
          ],
        },
        done: {
          id: 'q52-gone-done',
          lines: [
            N('The last clue is a hill with a bison-shaped dent in it. Beyond it, in a cave, two big eyes blink in the dark.'),
            A('Mrrrrrooooh.', 'sad'),
          ],
        },
      },
      {
        id: 'q52-s2',
        goal: 'Win Puffin’s trust: feed him five round fruits by hand.',
        hint: 'Move slowly and don’t run. If he backs off, sit still until he comes forward again.',
        check: 'feed:puffin:5',
        scene: {
          id: 'q52-trust',
          lines: [
            N('Puffin is wedged in the cave mouth, trembling. When you take a step forward, he shrinks back.'),
            P('Puffin! Buddy, it’s me! It’s—', 'shock'),
            N('Puffin flinches at the loud voice and backs further in. Pemba stops, and his face falls.'),
            T('He’s still scared. Storms, strange places. Give him a minute.', 'soft'),
            P('He’s never been scared of me before.', 'sad'),
            T(
              'He’s not scared of you. He’s scared of everything, and right now you’re part of everything.',
            ),
            N(
              'Your Nubbin sits down quietly at the cave mouth, holding up a fruit. Puffin’s nose twitches.',
            ),
            N('Your Nubbin, still holding the fruit up, has been leaning slowly backwards.'),
            N('It is now lying flat. The fruit has not moved.'),
            T('That Nubbin has never been so committed to anything.', 'happy'),
            P('He loves fruit. The big round ones. He eats them whole.', 'soft'),
          ],
          choices: [
            {
              id: 'wait',
              label: 'Sit down and wait',
              then: [N('You sit. You wait. A big wet nose edges closer.')],
            },
            {
              id: 'whistle',
              label: 'Whistle the tune Pemba always whistles',
              set: { 'q52-whistle': true },
              then: [P('That’s his bedtime whistle! How did you know?'), N('Puffin’s ears flick forward.')],
            },
            {
              id: 'roll',
              label: 'Roll a fruit gently towards him',
              then: [N('The fruit rolls. A huge tongue swipes it up. Puffin looks at you as if you are suddenly very interesting.')],
            },
          ],
        },
        done: {
          id: 'q52-trust-done',
          lines: [
            A('Mrrrrrf!', 'happy'),
            N('Puffin pushes out of the cave and flattens Pemba under an enormous, slobbery lick.'),
            P('I missed you too! I missed you too! Ow, my ribs!', 'happy'),
          ],
        },
      },
      {
        id: 'q52-s3',
        goal: 'Ride Puffin home to the Grove.',
        hint: 'Hold the reins steady and say “hup-hup”. Tilt to steer; Puffin lands on his own at the gate.',
        check: 'ride:puffin:grove',
        scene: {
          id: 'q52-home',
          lines: [
            P('He wants to go home. He wants you to come too. Look, he’s crouching for you.'),
            T('Sure. Just climb up a nervous animal the size of a house. Totally normal day.'),
            N('Puffin rumbles beneath you like a warm mountain. Your Nubbin clings to the saddle, eyes huge.'),
            P('The word is “hup-hup”. Say it like you mean it.', 'happy'),
            T('Or just scream. Screaming also works.'),
            N('Puffin shifts his six legs, ready. The whole saddle sways.'),
          ],
        },
        done: {
          id: 'q52-home-done',
          lines: [
            N('The Grove spreads out below you, tiny and green. Every Nubbin in it looks up.'),
            N('Puffin lands at the gate with a thump that shakes fruit from every tree.'),
            N('Pemba’s eyes are wet. He says it is the wind. Tuk, very kindly, agrees that it was windy.'),
          ],
        },
      },
    ],
    complete: {
      id: 'q52-complete',
      lines: [
        P('Thank you. Really. I don’t know what I’d do without him.', 'soft'),
        P('I keep thinking it was my fault. If I’d held on tighter in the storm…', 'sad'),
        T('You can’t hold on to a storm, Pemba. You can only be the one who comes looking afterwards. You did that.', 'soft'),
        N('Puffin lowers his huge head and rests it on your shoulder. It weighs about as much as a cart.'),
        P('He likes you now. That means he’ll come when you call. Anywhere in the Grove.', 'happy'),
        T('He means you get a giant flying taxi. Congratulations. Mind the fur, it gets everywhere.'),
        N('A white tuft drifts down onto your Nubbin’s head. Your Nubbin refuses to let you remove it.'),
      ],
    },
    rewards: [
      {
        id: 'q52-sky-bison',
        kind: 'feature',
        label: 'Sky bison travel',
        description: 'Call Puffin from any section and fly to any other in seconds.',
      },
    ],
    notes:
      'Puffin is a giant six-legged flying bison (large sprite, sky-bison groan SFX). Trail: three clue spots in three different sections, picked by the implementer. Trust: Puffin backs off if the Keeper runs or a Nubbin is thrown nearby. The ride is a short on-rails flight back to the gate, unlocking fast travel.',
  },

  // ------------------------------------------------------------------ Q53
  {
    id: 'q53',
    code: 'Q53',
    title: 'The Fan Warriors',
    source: `${SOURCE}: The Warriors of Kyoshi`,
    audience: 'all',
    trigger: { where: 'The karate dojo yard', when: 'Any morning' + WHEN_SUFFIX },
    requires: ['Q46'],
    speakers: [TUK, SUMI],
    steps: [
      {
        id: 'q53-s1',
        goal: 'Join the fan-warriors’ morning drill and finish it without dropping your fan.',
        hint: 'Copy the warrior at the front. Open, sweep, close: the rhythm is slower than it looks.',
        check: 'train:fan-drill',
        scene: {
          id: 'q53-flattened',
          lines: [
            N('In the dojo yard, warriors in green with painted faces move through a drill in perfect time, steel fans flashing.'),
            T('Oh, that’s adorable. Fan dancing! Do you also do a ribbon routine?', 'happy'),
            S('We’re the fan-warriors. I’m Sumi. And that’s the last joke you get.'),
            T('Okay, okay. But come on. Fans. Like it’s hot. I’m the one with the boomerang.'),
            S('Would you like to try me?'),
            T('I don’t want to hurt you.'),
            N('Three seconds later, Tuk is flat on his back in the sand, a closed fan resting gently on his nose.'),
            T('…What just happened.', 'shock'),
            S('You fought me. Briefly.'),
          ],
          choices: [
            {
              id: 'laugh',
              label: 'Laugh',
              set: { 'q53-laughed': true },
              then: [T('Thanks. Really feeling the support.', 'angry')],
            },
            {
              id: 'help',
              label: 'Help Tuk up',
              then: [T('Thanks. My pride is still down there. Leave it.')],
            },
            {
              id: 'learn',
              label: 'Ask Sumi to teach you',
              then: [
                S('You I like. Him, we’ll see.', 'happy'),
                T('“Him” is lying right here.'),
              ],
            },
          ],
        },
        done: {
          id: 'q53-flattened-done',
          lines: [
            S('Not bad. You’ve got patience.'),
            T('I want to train too. Properly.'),
            S('Then you wear the uniform. All of it.'),
            T('…All of it?', 'shock'),
          ],
        },
      },
      {
        id: 'q53-s2',
        goal: 'Win a sparring bout against Sumi using fan-blocks.',
        hint: 'Block just as her strike lands to turn it aside. Don’t attack first; let her come to you.',
        check: 'karate:win:sumi-spar',
        scene: {
          id: 'q53-uniform',
          lines: [
            N('Tuk steps out of the hut in a green robe, a headpiece and full white-and-red face paint. He looks magnificent.'),
            N('He knows it, and he hates that he knows it.'),
            T('Not. One. Word.'),
            S('The uniform isn’t a costume. The paint says you won’t hide who you are.'),
            T('What does the headpiece say?', 'think'),
            S('It says you need a haircut.'),
            N('Your Nubbin has also been painted. Someone gave it a tiny fan. It is taking this extremely seriously.'),
            S('Last lesson. Don’t stop the punch. Move it somewhere else.'),
            S('Spar with me, and find out.', 'happy'),
          ],
          choices: [
            {
              id: 'tuk',
              label: 'Let Tuk go first',
              then: [N('Tuk charges. Sumi steps aside. Tuk keeps going for quite a while.')],
            },
            {
              id: 'you',
              label: 'Step up yourself',
              then: [S('Good. Breathe. Watch my shoulder, not my fan.')],
            },
            {
              id: 'nubbin',
              label: 'Send in your painted Nubbin',
              set: { 'q53-nubbin-spar': true },
              then: [S('Ha! Fearless. Come on then, little warrior.', 'happy')],
            },
          ],
        },
        done: {
          id: 'q53-uniform-done',
          lines: [
            S('Well. Look at you. You’d pass for a fan-warrior. Almost.', 'happy'),
            T('Almost? I’m wearing face paint.'),
            S('The paint isn’t for scaring anyone. It’s so the warrior beside you always knows it’s you. That part you’ve got.', 'soft'),
          ],
        },
      },
    ],
    complete: {
      id: 'q53-complete',
      lines: [
        T('Sumi. I was wrong. About fans. About girls. Mostly about me.'),
        S('That’s the best apology I’ve heard all year. And I’ve flattened a lot of boys.', 'soft'),
        T('…How many is a lot?'),
        S('Keep the fan, Keeper. And the paint. You’ve earned a place in our drill any morning you like.', 'happy'),
        N('She tucks a folded steel fan into your belt. Your Nubbin refuses to wash its face for three days.'),
      ],
    },
    rewards: [
      {
        id: 'q53-fan-paint',
        kind: 'cosmetic',
        label: 'Fan and face paint',
        description: 'A folded steel fan and white-and-red fan-warrior face paint for your Keeper.',
      },
      {
        id: 'q53-fan-block',
        kind: 'feature',
        label: 'Fan-block karate move',
        description: 'A new karate move: a well-timed block that turns an attack aside and leaves the attacker off balance.',
      },
    ],
    notes:
      'Drill: follow-the-leader input sequence. Spar: karate bout where perfect-timed blocks deal the damage. If the Nubbin spar choice was picked, the player’s Nubbin wears face paint during the bout. Tuk’s apology is the heart of the quest: no mocking of the warriors after it.',
  },

  // ------------------------------------------------------------------ Q54
  {
    id: 'q54',
    code: 'Q54',
    title: 'The Sword Master',
    source: `${SOURCE}: Sokka’s Master`,
    audience: 'all',
    trigger: { where: 'Master Pian’s house on the hill', when: 'Any day after a shooting star' + WHEN_SUFFIX },
    requires: ['Q46'],
    speakers: [TUK, PIAN],
    steps: [
      {
        id: 'q54-s1',
        goal: 'Complete Master Pian’s three lessons: the brush, the stillness and the garden.',
        hint: 'Each lesson is a short timing game. Slow, steady inputs score better than fast ones.',
        check: 'train:pian-lessons:3',
        scene: {
          id: 'q54-lessons',
          lines: [
            N('Master Pian’s house sits at the top of the hill, the courtyard swept so clean it seems to glow.'),
            T('Master Pian. I want to learn the sword. I’ve got a boomerang, but that’s a coming-back sort of weapon.'),
            PI('Many people want swords. Few want to learn. Why do you?'),
            T('Honestly? Everyone else has a special thing. Pemba flies. Nalu does water. I have… plans.', 'think'),
            PI('Plans are not nothing. A blade without a plan is only a heavy stick.', 'soft'),
            PI('First, you will learn to write your name with a brush. Then to sit still. Then to look at a garden.'),
            T('That’s not sword. None of that is sword.', 'shock'),
            PI('All of it is sword.'),
            N('Your Nubbin is already sitting very still, gazing at the garden. Master Pian nods at it.'),
          ],
          choices: [
            {
              id: 'brush',
              label: 'Start with the brush',
              then: [PI('Good. A sword stroke and a brush stroke are cousins. Neither can be taken back.')],
            },
            {
              id: 'sit',
              label: 'Start with sitting still',
              then: [T('I can sit still. Watch.'), N('Tuk lasts nine seconds.')],
            },
            {
              id: 'garden',
              label: 'Start with the garden',
              then: [PI('Tell me what you see.', 'soft'), T('Rocks. Some more rocks.'), PI('Look longer.')],
            },
          ],
        },
        done: {
          id: 'q54-lessons-done',
          lines: [
            PI('You have learned three things today. Your hand, your breath and your eyes.'),
            T('And my knees. My knees learned a lot.'),
          ],
        },
      },
      {
        id: 'q54-s2',
        goal: 'Haul the fallen star to Master Pian’s forge and help Tuk shape it into a blade.',
        hint: 'Strike when the metal glows orange, not white. Let it rest between rounds.',
        check: 'craft:meteor-sword',
        scene: {
          id: 'q54-meteor',
          lines: [
            N('That night, a streak of white fire falls behind the hill. The ground shivers.'),
            T('Did you see that? A shooting star! It landed! It actually landed!', 'shock'),
            PI('Sky-iron. A sword from a falling star is rare. It would be yours, and no one else’s.', 'think'),
            T('Then let’s go dig up a star.', 'happy'),
            N('The crater is still warm. In its centre lies a black rock, heavy as a sleeping Nubbin and twice as stubborn.'),
            PI('You will forge it yourselves. I will only hold the tongs and say “no” occasionally.'),
            T('How occasionally?'),
            PI('Often.'),
            T('What if I get it wrong? It’s a star. You only get one star.', 'think'),
            PI('Then you will own a badly made star, and know more than you did. Every master keeps one. Mine is a spoon.', 'soft'),
          ],
        },
        done: {
          id: 'q54-meteor-done',
          lines: [
            N('The blade comes out of the water as dark as night, with tiny silver flecks like stars.'),
            T('Whoa.', 'soft'),
          ],
        },
      },
    ],
    complete: {
      id: 'q54-complete',
      lines: [
        PI('A sword is not a thing you carry. In time, it becomes how you stand, how you breathe, how you choose.', 'soft'),
        PI('The same is true of friends. And of the little ones who follow you about. You will see.'),
        T('So… can I name it?'),
        PI('You may.'),
        T('Star Stabber.', 'happy'),
        PI('…You may also think about it for longer.'),
        N('Master Pian forges a smaller twin from the leftover sky-iron and lays it in your hands. It is lighter than it looks.'),
      ],
    },
    rewards: [
      {
        id: 'q54-meteor-sword',
        kind: 'cosmetic',
        label: 'Meteor sword',
        description: 'A small black sword flecked with silver, forged from a fallen star. Purely for looks; it is never used on Nubbins.',
      },
    ],
    notes:
      'Lessons: three short timing games (brush stroke hold-and-release, a stillness meter, spot-the-difference in the rock garden). Forge: hammer timing on glow colour. The shooting star can be a scripted night sky event when the quest starts.',
  },

  // ------------------------------------------------------------------ Q55
  {
    id: 'q55',
    code: 'Q55',
    title: 'The Ember Bay Players',
    source: `${SOURCE}: The Ember Island Players`,
    audience: 'all',
    trigger: { where: 'The beach stage at Ember Bay', when: 'Any summer evening' + WHEN_SUFFIX },
    requires: ['Q46', 'Q56', 'Q64'],
    speakers: [TUK, BAO, PEMBA, KAITO, PLAYERS],
    steps: [
      {
        id: 'q55-s1',
        goal: 'Watch the first act of the Ember Bay Players’ show.',
        hint: 'Just sit through it. Tap to throw a peanut at the stage, if you must.',
        check: 'watch:ember-bay-play:act-1',
        scene: {
          id: 'q55-act1',
          lines: [
            N('A painted curtain flaps on the beach stage. The sign reads: THE AMAZING ADVENTURES OF THE KEEPER AND FRIENDS.'),
            T('A play about us! Finally, the recognition I deserve.', 'happy'),
            B('I can’t see the stage. I’m going to enjoy this more than any of you.'),
            N('The curtain rises. An actor in an orange robe cartwheels three times and falls into the band.'),
            PL('I am Pemba! I love fun! And also… fun!', 'happy'),
            P('Is that what I’m like?', 'sad'),
            N('An actor playing Tuk enters. Every single line is a joke about meat. The audience roars.'),
            T('I have depth! I have range! I once made a whole plan with diagrams!', 'angry'),
            N('Then a huge, sweaty actor playing Bao strides out, flexing. He has a beard.'),
            B('Oh, I love him. Ten out of ten. No notes.', 'happy'),
          ],
        },
        done: {
          id: 'q55-act1-done',
          lines: [
            N('The interval bell rings. Kaito hasn’t blinked in twenty minutes.'),
            Z('They gave me a ponytail made of a mop.', 'shock'),
            Z('And I was the villain. They had me shouting at the sea for a whole scene.'),
            Z('…It’s fair. That is how I was. It just isn’t how I am.', 'think'),
            B('Look at that. Growth. Gross. Pass the peanuts.', 'happy'),
          ],
        },
      },
      {
        id: 'q55-s2',
        goal: 'Watch the finale, and show the Players what you think of it.',
        hint: 'Your choice changes how the Players greet you the next time you visit the beach.',
        check: 'watch:ember-bay-play:finale',
        scene: {
          id: 'q55-finale',
          lines: [
            N('In the second act, an actor in a very shiny cape appears with a sign that says THE KEEPER. That’s you.'),
            PL('Fear not, friends! The Keeper is here, and I have brought… my eight hundred Nubbins!'),
            N('The eight hundred Nubbins are socks on sticks. One falls off and rolls into the sand.'),
            Z('That’s… honestly how you look when you walk in with the Nubbins. Bit less socky.'),
            N('The finale begins. The Keeper slips on a banana skin and the villain wins. The curtain starts to fall.'),
            T('THEY CAN’T END IT LIKE THAT.', 'shock'),
            B('Your move, Keeper.'),
          ],
          choices: [
            {
              id: 'boo',
              label: 'Boo loudly',
              set: { 'q55-reaction': 'boo' },
              then: [
                N('You boo. The whole audience joins in, then starts booing each other. The Players bow anyway.'),
                PL('Thank you! The passion! We feed on it!', 'happy'),
              ],
            },
            {
              id: 'cheer',
              label: 'Cheer anyway',
              set: { 'q55-reaction': 'cheer' },
              then: [
                N('You cheer. The actors look stunned, then delighted. The sock Nubbins take a bow.'),
                PL('A fan! We have a fan!', 'happy'),
              ],
            },
            {
              id: 'storm',
              label: 'Storm the stage and fix the ending',
              set: { 'q55-reaction': 'storm' },
              then: [
                N('You climb up, rescue the fallen sock Nubbin and help the Keeper actor to his feet. The crowd goes wild.'),
                PL('This is improvised theatre now! Everybody, improvise!', 'shock'),
              ],
            },
          ],
        },
        done: {
          id: 'q55-finale-done',
          lines: [
            Z('You know what? I’m glad we came.', 'soft'),
            T('I’m not. I’m writing a letter.'),
            B('I’m writing a fan letter. To the big guy with the beard. He gets me.', 'happy'),
          ],
        },
      },
    ],
    complete: {
      id: 'q55-complete',
      lines: [
        N('Afterwards, the lead player hands out programmes at the stage door, still in his shiny cape.'),
        PL('Take a mask or two! For the memories! We do the same show next week, only longer.', 'happy'),
        B('Longer. Wonderful. I’m coming every week.'),
        P('Do you think they’ll ever do one where we win?'),
        Z('If they did, I don’t think anyone would believe it.', 'think'),
        N('You go home with two theatre masks and a playbill with your name spelt wrong.'),
      ],
    },
    rewards: [
      {
        id: 'q55-theatre-masks',
        kind: 'cosmetic',
        label: 'Theatre masks',
        description: 'A happy mask and a sad mask on a ribbon. Your Keeper can wear either.',
      },
      {
        id: 'q55-playbill-frame',
        kind: 'feature',
        label: 'Playbill photo frame',
        description: 'A new Photo mode frame styled as an Ember Bay playbill, with your name (spelt wrong).',
      },
    ],
    notes:
      'The Ember Bay Players speak as one speaker (the troupe); whichever actor is on stage gets the box. The play is a cheap pastiche of the player’s own adventures: sock-puppet Nubbins, a mop ponytail, a bearded “Bao”. q55-reaction (boo / cheer / storm) is paid off in q55-complete: the lead player greets the player by that choice (one line inserted by flag after “Take a mask or two!”).',
  },

  // ------------------------------------------------------------------ Q56
  {
    id: 'q56',
    code: 'Q56',
    title: 'Earth Rumble',
    source: `${SOURCE}: The Blind Bandit`,
    audience: 'all',
    trigger: { where: 'The big boulder in the rocky section', when: 'Any night' + WHEN_SUFFIX },
    requires: ['Q46'],
    speakers: [BAO, TUK, PEMBA, GORRO, SLAB],
    steps: [
      {
        id: 'q56-s1',
        goal: 'Follow the flyer to the hidden arena under the big boulder.',
        hint: 'The big boulder in the rocky section has a crack in it. Knock twice.',
        check: 'visit:rumble-arena',
        scene: {
          id: 'q56-flyer',
          lines: [
            N('A crumpled flyer blows across the Grove and sticks to your Nubbin’s face.'),
            T('“Rumble Night. Underground wrestling. Under the big boulder. Bring snacks.” Huh.'),
            T('Secret wrestling under a boulder. Of course. Why would anything around here happen above ground?', 'think'),
            P('We have to go! I’ve never seen wrestling. Is it like hugging, but angrier?', 'happy'),
            T('That’s… actually a perfect description.'),
            N('Your strongest Nubbin flexes its tiny arms at the flyer. It seems to think it has been invited.'),
          ],
          choices: [
            {
              id: 'snacks',
              label: 'Pack snacks, as the flyer says',
              set: { 'q56-snacks': true },
              then: [T('Finally, someone who reads the instructions.')],
            },
            {
              id: 'nubbin',
              label: 'Bring your Power Nubbin',
              then: [N('Your Power Nubbin marches ahead of you, stomping on purpose.')],
            },
            {
              id: 'unsure',
              label: 'Ask whether this is a good idea',
              then: [T('It’s not. But I want to see it. Those are different things.')],
            },
          ],
        },
        done: {
          id: 'q56-flyer-done',
          lines: [
            N('You knock twice. The boulder slides aside. Below, a crowd roars by torchlight.'),
            T('Okay. That’s a cool door. I’ll give them the door.'),
          ],
        },
      },
      {
        id: 'q56-s2',
        goal: 'Enter your Power Nubbin in a bout against the Little Landslide. Win, or lose with dignity.',
        hint: 'She feels your footsteps through the ground. Stand still to confuse her, then push.',
        check: 'karate:fight:little-landslide',
        scene: {
          id: 'q56-bout',
          lines: [
            G('WELCOME TO RUMBLE NIGHT! Tonight our champion defends the belt against the mighty Big Slab!', 'happy'),
            SL('The Big Slab is feeling confident! The Big Slab is feeling enormous!', 'angry'),
            T('Why is he talking about himself like that?'),
            N('The champion walks into the ring barefoot. She is tiny, dressed in green, with a fringe over her pale eyes. She yawns.'),
            G('THE LITTLE LANDSLIDE!'),
            B('Let’s get this over with. I have a bedtime.'),
            N('The Big Slab charges. The ground under him lifts like a trapdoor, and he sails out of the ring into the noodle stand.'),
            B('Next! Anybody? Come on, I can feel you all shuffling.', 'happy'),
            N('Your Power Nubbin steps forward. The whole arena goes quiet.'),
            B('Huh. Small, heavy, walks like it means it. I like it already.', 'think'),
          ],
          choices: [
            {
              id: 'easy',
              label: 'Ask her to go easy on it',
              then: [B('Nope. Going easy is an insult. It deserves a real fight.')],
            },
            {
              id: 'all',
              label: 'Tell her not to hold back',
              then: [B('Oh, I won’t. But I like that you asked.', 'happy')],
            },
            {
              id: 'bow',
              label: 'Bow to her',
              set: { 'q56-bowed': true },
              then: [B('You know I can’t see that, right?'), N('She grins anyway. She felt the floorboards creak.')],
            },
          ],
        },
        done: {
          id: 'q56-bout-done',
          lines: [
            B('Not bad! Not bad at all. Hardly anyone lasts that long.', 'happy'),
            N('Your Nubbin is either covered in glory or covered in sand. Possibly both.'),
            B('And you didn’t run. Most people run. Running’s loud.', 'soft'),
          ],
        },
      },
    ],
    complete: {
      id: 'q56-complete',
      lines: [
        N('After the show, the Little Landslide finds you by the noodle stand, which has been rebuilt.'),
        B('The name’s Bao. Don’t tell anyone. Up there I’m a nice quiet girl who has to wear shoes.'),
        B('Up there, everybody helps me across the road whether I want it or not. Down here, nobody helps me. It’s the best.', 'soft'),
        T('You were incredible. How do you know where they’re going?'),
        B('I feel it through my feet. Your feet are louder than your mouth, Ponytail. Which is saying something.', 'happy'),
        B('Here. A spare belt. I’ve got a cupboard full. Your Nubbin earned it, win or lose.'),
        N('The belt is far too big. Your Nubbin wears it anyway, dragging it proudly behind like a tail.'),
        G('And take a ring post! Every great champion needs an arena!', 'happy'),
      ],
    },
    rewards: [
      {
        id: 'q56-championship-belt',
        kind: 'cosmetic',
        label: 'Championship belt',
        description: 'A big, shiny Rumble Night belt. Fits a Nubbin if you don’t mind it dragging.',
      },
      {
        id: 'q56-arena',
        kind: 'decor',
        label: 'Rumble arena',
        description: 'A small roped wrestling ring with torch posts. Power Nubbins like to practise in it.',
      },
    ],
    notes:
      'Step 2 completes win or lose (karate:fight, not karate:win). Bao is blind and senses movement through the ground: in the bout, standing still hides you from her briefly. Bao jokes about it herself; nobody else does. The Big Slab lands in the noodle stand unhurt, covered in noodles. q56-bowed is flavour: bowing to someone who can’t see it is the whole joke.',
  },

  // ------------------------------------------------------------------ Q57
  {
    id: 'q57',
    code: 'Q57',
    title: 'The Painted Lady',
    source: `${SOURCE}: The Painted Lady`,
    audience: 'all',
    trigger: { where: 'The stilt village downstream of the Grove', when: 'When the stream runs murky' + WHEN_SUFFIX },
    requires: ['Q46'],
    speakers: [NALU, TUK, PEMBA, REEDY],
    steps: [
      {
        id: 'q57-s1',
        goal: 'Deliver food and medicine to five houses in the river village.',
        hint: 'Fruit from the Grove and herbs from the healer’s shelf will both do. Knock gently; people are poorly.',
        check: 'deliver:river-village-supplies:5',
        scene: {
          id: 'q57-sick',
          lines: [
            N('Downstream, the river turns a sickly brown. A little village of stilt houses sits in the murk, quiet and grey.'),
            RE('The fish are all gone. Half the village is coughing. It’s the works upstream. They pour their sludge in and call it progress.', 'sad'),
            K('That’s awful. Someone has to do something.', 'angry'),
            T('Someone will. Probably not us. We have a schedule.'),
            K('Tuk.'),
            T('…I’m just saying the schedule exists.'),
            RE('The old folk say a river spirit used to watch over us. A lady in white with a painted face. She hasn’t come in years.', 'soft'),
            N('A little girl in a doorway holds up an empty fish basket, upside down, as if it might be hiding one.'),
            N('Nalu goes very quiet. You can see an idea forming. Tuk can see it too, and he sighs.'),
          ],
          choices: [
            {
              id: 'help',
              label: 'Promise to help',
              then: [RE('You’re kind. Kind won’t clean a river, though.', 'soft'), K('Watch us.')],
            },
            {
              id: 'fruit',
              label: 'Offer fruit from the Grove',
              set: { 'q57-gave-fruit': true },
              then: [RE('Real fruit! The children haven’t had any in weeks.', 'happy')],
            },
            {
              id: 'spirit',
              label: 'Ask about the river spirit',
              then: [RE('She came at night. Mist on the water, a lantern on a boat. In the morning, the sick were well.')],
            },
          ],
        },
        done: {
          id: 'q57-sick-done',
          lines: [
            N('At the last house, a little boy gives you a drawing of a lady with a painted face.'),
            K('That settles it.', 'soft'),
          ],
        },
      },
      {
        id: 'q57-s2',
        goal: 'Clean the river by moonlight without being seen by the villagers.',
        hint: 'Steer the boat through the brown patches. If a lantern turns your way, drift into the mist and wait.',
        check: 'minigame:complete:river-clean',
        scene: {
          id: 'q57-night',
          lines: [
            N('Midnight. Mist on the water. Nalu steps into a boat wearing a white veil, a wide straw hat and red painted marks.'),
            K('Well? Do I look like a river spirit?'),
            T('You look like Nalu in a hat. But a really mysterious hat.'),
            P('I think you look amazing. And spooky. Amazing-spooky.', 'happy'),
            K('Here’s the plan. I lift the sludge out of the water. You and the Nubbins scoop it into barrels. Nobody gets seen.'),
            N('Your Swim Nubbin slips silently into the river, then pops up holding a rusty can like a trophy.'),
            T('And tomorrow, when the works start pouring again?', 'think'),
            K('Then the Painted Lady pays them a visit too.', 'angry'),
          ],
          choices: [
            {
              id: 'clean',
              label: 'Clean the river first',
              set: { 'q57-plan': 'clean' },
              then: [K('Right. Rescue first. The rest can wait till morning.')],
            },
            {
              id: 'pipe',
              label: 'Block the sludge pipe',
              set: { 'q57-plan': 'pipe' },
              then: [T('Now that I can help with. I brought a very large cork.', 'happy')],
            },
            {
              id: 'note',
              label: 'Leave a stern note at the works',
              set: { 'q57-plan': 'note' },
              then: [K('“Stop it. Love, the river.” Perfect.', 'happy')],
            },
          ],
        },
        done: {
          id: 'q57-night-done',
          lines: [
            N('By dawn the water runs clear enough to see the stones. A fish flips up into the light, and someone on the bank gasps.'),
            RE('The Painted Lady came back!', 'shock'),
            N('Ma Reedy turns towards your boat, half hidden in the mist. Nalu, still painted, freezes.'),
            K('(whispering) Do we tell her?'),
          ],
          choices: [
            {
              id: 'q57-tell',
              label: 'Step out of the mist and tell her the truth',
              set: { 'q57-legend': 'told' },
              then: [
                RE('I know, dear. I knew the first night. Spirits don’t sneeze.', 'soft'),
                RE('The Painted Lady was always just somebody who decided to be her. Now it’s you.'),
              ],
            },
            {
              id: 'q57-mist',
              label: 'Drift back into the mist',
              set: { 'q57-legend': 'kept' },
              then: [
                N('You drift away. Behind you, the village is already telling the story, and it gets better every time.'),
                K('Maybe they need her more than they need to know who she is.', 'soft'),
              ],
            },
          ],
        },
      },
    ],
    complete: {
      id: 'q57-complete',
      lines: [
        N('The village wakes to clear water and full fish baskets. The works upstream has hung a nervous sign: PIPE CLOSED. SORRY.'),
        RE('She came back. After all these years, she came back.', 'happy'),
        K('I bet she was happy to help.', 'soft'),
        T('She was very happy. And very wet. And she owes me new trousers.'),
        N('Ma Reedy gives you a wide straw hat, still faintly marked with river spirit paint.'),
        RE('And these little fish. Put them in your stream. They nibble the muck and keep the water clear for good.'),
      ],
    },
    rewards: [
      {
        id: 'q57-painted-lady-hat',
        kind: 'cosmetic',
        label: 'Painted Lady hat',
        description: 'A wide straw hat with a white veil and faint red river-spirit marks.',
      },
      {
        id: 'q57-river-fish',
        kind: 'feature',
        label: 'River-cleaning fish',
        description: 'Little fish that live in the Grove stream and eat the muck: the stream stays clear in all weather.',
      },
    ],
    notes:
      'Night stealth boat minigame: clear brown patches while villagers’ lanterns sweep the water; mist banks hide you. Swim Nubbins speed up scooping. Keep the illness mild (coughs, tiredness); nobody is in danger on screen. The factory is never shown inside. q57-legend (told / kept): Ma Reedy already knew if told.',
  },

  // ------------------------------------------------------------------ Q58
  {
    id: 'q58',
    code: 'Q58',
    title: 'The Fortuneteller',
    source: `${SOURCE}: The Fortuneteller`,
    audience: 'all',
    trigger: { where: 'Hillstead, the village under Mount Grumble', when: 'Any day' + WHEN_SUFFIX },
    requires: ['Q46'],
    speakers: [WEN, TUK, PEMBA, NALU],
    steps: [
      {
        id: 'q58-s1',
        goal: 'Have Aunt Wen read the bones for you and your Nubbin.',
        hint: 'Join the queue at the house with stars on the door. Bring a fruit; it’s polite.',
        check: 'talk:aunt-wen',
        scene: {
          id: 'q58-reading',
          lines: [
            N('In the village of Hillstead, everyone queues outside a little house with stars painted on the door.'),
            W('Come in, come in! Aunt Wen sees all. Or most. Some of it is blurry.', 'happy'),
            N('She drops a bone into the fire. It cracks with a pop. She peers at the cracks and gasps happily.'),
            W('Your Nubbin will find something lovely today. Possibly a snack. Probably a snack.'),
            T('That’s not a fortune. That’s just odds. Nubbins always find snacks.'),
            W('And you, young man, will have a very bad day if you keep saying things like that.'),
            N('Outside, a villager carries an umbrella on a cloudless day. Another refuses to walk on the left of the road.'),
            P('She’s amazing! She said I’ll have a great adventure! Do you think it’s today?', 'happy'),
            K('She says that to everyone, Pemba.'),
          ],
          choices: [
            {
              id: 'believe',
              label: 'Believe her',
              set: { 'q58-belief': 'believe' },
              then: [
                W('A wise Keeper. Your Nubbin agrees. Look, it’s nodding.', 'happy'),
                N('Your Nubbin is nodding off.'),
              ],
            },
            {
              id: 'doubt',
              label: 'Side with Tuk',
              set: { 'q58-belief': 'doubt' },
              then: [T('Finally. Someone with a brain. Hello, brain.', 'happy')],
            },
            {
              id: 'wait',
              label: 'Say you’ll wait and see',
              set: { 'q58-belief': 'wait' },
              then: [W('Fair. The bones are patient. So am I. Mostly.')],
            },
          ],
        },
        done: {
          id: 'q58-reading-done',
          lines: [
            W('Oh, and the mountain won’t erupt this year. I read the clouds this morning. Nice and fluffy.'),
            T('…The mountain can erupt?', 'think'),
          ],
        },
      },
      {
        id: 'q58-s2',
        goal: 'Climb Mount Grumble and look inside the crater.',
        hint: 'Take the zigzag path, or call Puffin if you’ve found him. Keep your Nubbin away from the edge.',
        check: 'visit:mount-grumble-crater',
        scene: {
          id: 'q58-mountain',
          lines: [
            N('Above Hillstead, Mount Grumble sends up a thin grey thread of smoke. Tuk stares at it.'),
            T('Everyone here trusts clouds over common sense. I’m going up there. I want to see with my own eyes.'),
            P('I’ll come! Puffin, my sky bison, can fly us most of the way. Or my glider, if he’s sulking.'),
            K('I’ll stay and talk to the villagers. Just in case.'),
            N('At the top, the air is hot and smells of boiled eggs. Inside the crater, red rock bubbles and hisses.'),
            T('That is not “nice and fluffy”. That is “very much about to go off”.', 'shock'),
            P('We have to tell everyone! Today!', 'shock'),
            T('They won’t listen to us. They only listen to Aunt Wen. And Aunt Wen only listens to clouds.', 'think'),
          ],
        },
        done: {
          id: 'q58-mountain-done',
          lines: [
            P('Wait. If they only listen to clouds…', 'happy'),
            T('…then we give them a cloud. Pemba, you wonderful little weather machine.', 'happy'),
          ],
        },
      },
      {
        id: 'q58-s3',
        goal: 'Help Pemba push the clouds into a giant angry-volcano shape over the village.',
        hint: 'Drag the cloud puffs into the outline. The wind drifts east, so start on the west side.',
        check: 'minigame:complete:cloud-shaping',
        scene: {
          id: 'q58-clouds',
          lines: [
            N('The whole village has gathered in the square for Aunt Wen’s evening cloud reading.'),
            W('The clouds will now speak! Let us see. Yes. Ah. Hmm. That one looks like a duck.'),
            N('High above, Pemba and Puffin swoop through the clouds, pushing great gusts of wind. Your Nubbins flap along behind.'),
            T('Okay. Steady. We need one shape. The village sign for “danger”. Big, clear, impossible to argue with.'),
            K('And what is the village sign for danger?'),
            T('A big angry mountain with a frowny face.'),
            K('…That’s not a real sign.'),
            T('It will be in five minutes.'),
            K('Tuk. We’re tricking them. Is that really any better than what Aunt Wen does?', 'think'),
            T('…Hm. I hate it when you ask the good questions while I’m busy.'),
          ],
          choices: [
            {
              id: 'q58-warning',
              label: 'Shape the frowning volcano. Get them moving.',
              set: { 'q58-cloud': 'warning' },
              then: [
                T('Tonight we trick them out of danger. Tomorrow we walk them up and show them the crater.'),
                K('Promise?'),
                T('Promise. With diagrams.'),
              ],
            },
            {
              id: 'q58-arrow',
              label: 'Shape a giant arrow pointing at the mountain',
              set: { 'q58-cloud': 'arrow' },
              then: [
                K('Yes. Don’t tell them what to think. Tell them where to look.', 'happy'),
                N('Below, a hundred heads turn from the sky to the smoking mountain, for the first time in years.'),
              ],
            },
          ],
        },
        done: {
          id: 'q58-clouds-done',
          lines: [
            N('A huge cloud hangs over Hillstead, impossible to argue with. Your Nubbins drift down out of it, damp and proud.'),
            W('Oh dear. Oh dear oh dear. The clouds have NEVER been this clear. Everyone, get your shovels!', 'shock'),
          ],
        },
      },
    ],
    complete: {
      id: 'q58-complete',
      lines: [
        N('The villagers dig a trench all night. When Mount Grumble finally pops, the lava runs down the trench and away from the houses.'),
        W('I owe you, young man. Even if you don’t believe a word I say.', 'soft'),
        T('I believe one word. “Shovels.” That was a great call.'),
        W('Then let me give the Keeper something. Bring your Nubbins to me whenever you like. I’ll read the bones for them.', 'happy'),
        W('I’m right more often than not. And much more often about Nubbins than about mountains.'),
        N('Next morning Tuk, who likes to have the last word, walks a hundred villagers up to the crater rim. With diagrams.'),
        N('Nobody says anything for a long time.'),
        W('I did say it was nice and fluffy.', 'happy'),
        N(
          'Aunt Wen now reads bones at the Grove’s fortune tent. Tuk says he will never go. He goes twice a week, in a hat.',
        ),
      ],
    },
    rewards: [
      {
        id: 'aunt-wen',
        kind: 'feature',
        label: 'Aunt Wen’s bone reading',
        description: 'A new service at the fortune tent: Aunt Wen cracks a bone in the fire and reads your Nubbin’s future (reader id aunt-wen).',
      },
    ],
    notes:
      'Unlocks reader `aunt-wen` (already written in readers.ts) at the fortune tent; her speaker id here matches. Eruption is slow and safe: no one is hurt, the trench works. Cloud minigame: drag cloud puffs into a volcano-with-a-frown outline while wind drifts them east. If Puffin is not yet rescued (Q52), Pemba still flies on his glider; the line about Puffin can stay. q58-cloud picks the outline: “warning” = frowning volcano, “arrow” = a giant arrow at the mountain.',
  },

  // ------------------------------------------------------------------ Q59
  {
    id: 'q59',
    code: 'Q59',
    title: 'The Waterbending Scroll',
    source: `${SOURCE}: The Waterbending Scroll`,
    audience: 'all',
    trigger: { where: 'The river market', when: 'Any market day' + WHEN_SUFFIX },
    requires: ['Q46'],
    speakers: [NALU, TUK, PEMBA, HAKE],
    steps: [
      {
        id: 'q59-s1',
        goal: 'Keep Captain Hake talking while Nalu takes a closer look at the scroll.',
        hint: 'Ask about every item on the deck. The bison whistle is good for at least a minute.',
        check: 'distract:captain-hake',
        scene: {
          id: 'q59-market',
          lines: [
            N('A battered pirate ship is moored at the river market, its deck piled with “treasures” of every kind.'),
            CH('Step up! Rare goods, fair prices, absolutely no questions answered!', 'happy'),
            P('Look! A whistle shaped like a bison! I’m buying it!', 'happy'),
            T('It’s a stick with a hole in it. You’re buying a stick.'),
            N('Nalu has gone very still. In a glass case lies an old scroll covered in drawings of moving water.'),
            K('That’s a waterbending scroll. A real one. It could teach me everything my village couldn’t.', 'soft'),
            CH('Ah, the lady has taste. Two hundred gold pieces. Or your bison, your Nubbin and the boy with the boomerang.'),
            T('That’s a lot of value for one scroll. I’m flattered, in a horrible way.'),
          ],
          choices: [
            {
              id: 'haggle',
              label: 'Haggle',
              set: { 'q59-haggled': true },
              then: [
                CH('Two hundred! My final offer! Two hundred and ten!'),
                T('That’s not how haggling works.'),
              ],
            },
            {
              id: 'walk',
              label: 'Pretend to walk away',
              then: [CH('Fine! Nobody wanted it anyway! …Two hundred!', 'angry')],
            },
            {
              id: 'where',
              label: 'Ask where he got it',
              then: [CH('I found it. In a… temple. On a… shelf. That was open. Partly.', 'think')],
            },
          ],
        },
        done: {
          id: 'q59-market-done',
          lines: [
            N('You turn round. Nalu is walking briskly towards your boat. The glass case is empty.'),
            T('Did you just—', 'shock'),
            K('Walk. Normally. Now.'),
            CH('THIEVES! After them, lads!', 'angry'),
          ],
        },
      },
      {
        id: 'q59-s2',
        goal: 'Escape the pirates down the river rapids.',
        hint: 'Steer between the rocks, and let your Swim Nubbins push on the straights.',
        check: 'minigame:complete:river-chase',
        scene: {
          id: 'q59-chase',
          lines: [
            N('You tumble into your boat and push off. Behind you, the pirate ship swings round, sails cracking.'),
            T('You STOLE it? You lecture me about picking fruit off other people’s trees!', 'angry'),
            K('It was already stolen! I’m borrowing it from the thieves. That’s practically returning it.'),
            P('This is so exciting! Are we pirates now? Can I have a hat?', 'happy'),
            CH('Bring back my scroll! And my whistle! He never paid for the whistle!', 'angry'),
            P('Oh. Oops.', 'shock'),
            N('Your Swim Nubbins leap into the water and paddle hard, pushing the boat along like little furry engines.'),
          ],
          choices: [
            {
              id: 'wrong',
              label: 'Tell Nalu it was wrong',
              set: { 'q59-told-off': true },
              then: [K('I know. I’ll make it right. After we don’t get caught.', 'sad')],
            },
            {
              id: 'cause',
              label: 'Tell Nalu it’s for a good cause',
              then: [
                K('Thank you. See, Tuk? The Keeper understands.'),
                T('The Keeper is now part of a crime.'),
              ],
            },
            {
              id: 'whistle',
              label: 'Make Pemba blow the whistle',
              set: { 'q59-whistle': true },
              then: [N('Pemba blows. Somewhere far upriver, a very confused sky bison turns his head.')],
            },
          ],
        },
        done: {
          id: 'q59-chase-done',
          lines: [
            N('The pirate ship wedges itself between two rocks with a sad crunch. You sail on.'),
            CH('THIS ISN’T OVER! Also, does anyone have a long pole?', 'angry'),
          ],
        },
      },
    ],
    complete: {
      id: 'q59-complete',
      lines: [
        N('That night by the fire, Nalu unrolls the scroll and practises one move over and over: a whip of water, snapping out and back.'),
        K('Look! I did it! I actually did it!', 'happy'),
        T('Great. Now do the move where we don’t steal things.'),
        K('I’ll take it to the water villages once I’ve learned it. It belongs to them. I promise.', 'soft'),
        K('And I’ll remember how my stomach felt when I lifted the case.', 'think'),
        N('Your Swim Nubbins have been watching closely. One flicks its tail at the stream, and a ribbon of water snaps through the air.'),
        P('Your Nubbin can do it too! Your Nubbin learned waterbending!', 'happy'),
        N(
          'Days later, a long pole drifts downriver to the rocks. A note is tied to it: “For Captain Hake. From the borrowers.”',
        ),
        T('That is the nicest crime I’ve ever been part of.', 'happy'),
      ],
    },
    rewards: [
      {
        id: 'q59-water-whip',
        kind: 'feature',
        label: 'Water-whip karate move',
        description: 'A new karate move for Swim Nubbins: a quick lash of water that reaches further than a punch.',
      },
    ],
    notes:
      'River chase: side-scrolling rapids, rocks to dodge, Swim Nubbins boost on straight water. Nalu’s “borrowing” is shown as wrong-but-understandable, and she promises to return the scroll. Water whip is limited to Swim-type Nubbins. q59-haggled is flavour: Hake haggling against himself is the joke.',
  },

  // ------------------------------------------------------------------ Q60
  {
    id: 'q60',
    code: 'Q60',
    title: 'The Winged Lemur',
    source: `${SOURCE}: The Southern Air Temple`,
    audience: 'all',
    trigger: { where: 'Your fruit basket', when: 'Any morning after fruit has gone missing overnight' + WHEN_SUFFIX },
    requires: ['Q46'],
    speakers: [PEMBA, LUMI],
    steps: [
      {
        id: 'q60-s1',
        goal: 'Follow the winged lemur through the old temple ruins.',
        hint: 'It glides from high ledge to high ledge. Climb where it lands, and don’t lose sight of its tail.',
        check: 'chase:winged-lemur:temple-ruins',
        scene: {
          id: 'q60-thief',
          lines: [
            N('Your fruit basket is empty. Again. There are tiny footprints in the dew, and a peach stone on the fence.'),
            P('Third time this week? That’s no bird. Birds don’t leave the stones in a neat little pile.', 'think'),
            N('Above you, something with huge ears and leathery wings sits on a branch, eating your last peach.'),
            M('Chirrup!', 'happy'),
            P('A winged lemur! I haven’t seen one since I was little. They used to live at the old temple.', 'happy'),
            N('The lemur stuffs the peach in its cheek, launches off the branch and glides away towards the hills.'),
            P('Come on, let’s follow it! Gently! Wingy little things scare easily.'),
          ],
          choices: [
            {
              id: 'chase',
              label: 'Run after it',
              then: [N('You run. The lemur looks back, and seems to decide this is a game.')],
            },
            {
              id: 'bait',
              label: 'Leave a fruit out as bait',
              set: { 'q60-bait': true },
              then: [P('Smart! It’ll come back for more. Then we follow it home.')],
            },
            {
              id: 'name',
              label: 'Ask what you should call it',
              then: [
                P('Hmm. Let’s get to know it first. A name should fit.', 'think'),
                N('The lemur chirrups from the hill. It sounds like it agrees.'),
              ],
            },
          ],
        },
        done: {
          id: 'q60-thief-done',
          lines: [
            N('Under the broken roof of an old temple, you find its nest: fruit stones, buttons, and one of your spoons.'),
            P('Oh. It lives up here all alone.', 'soft'),
          ],
        },
      },
      {
        id: 'q60-s2',
        goal: 'Win the lemur over: feed it three fruits by hand.',
        hint: 'Hold the fruit out and stay still. It comes closer each time, as long as you don’t grab.',
        check: 'feed:winged-lemur:3',
        scene: {
          id: 'q60-friends',
          lines: [
            N('The temple is quiet and cold. Faded murals show monks laughing with lemurs on their shoulders.'),
            P('This is where I learned to fly. It used to be full of people. Now it’s just… this.', 'sad'),
            N('The lemur peeks down from a beam. It watches Pemba, then you, then your Nubbin.'),
            P('It’s been on its own for ages. It isn’t really stealing. It’s just hungry and lonely. Like me, a bit.', 'soft'),
            N('Your Nubbin takes a fruit from your bag, walks to the middle of the floor and sits holding it up high.'),
            M('…Chirr?', 'think'),
          ],
        },
        done: {
          id: 'q60-friends-done',
          lines: [
            N('The lemur lands on your shoulder, wraps its tail round your neck and falls asleep.'),
            P('It likes you! Ha, it really likes you!', 'happy'),
            P('So… do we take it home? Or is this its home? It’s the only one it’s ever had.', 'think'),
          ],
          choices: [
            {
              id: 'q60-carry',
              label: 'Carry it home to the Grove',
              set: { 'q60-home': 'carried' },
              then: [P('The Grove has fruit and friends. That’s a good kind of home to be carried to.', 'soft')],
            },
            {
              id: 'q60-choose',
              label: 'Set it down, leave the door open and let it choose',
              set: { 'q60-home': 'chose' },
              then: [
                N('You set it on a beam and walk away slowly. Halfway down the hill, there is a flap of wings, and a weight on your shoulder.'),
                P('It chose you! It chose us!', 'happy'),
              ],
            },
          ],
        },
      },
    ],
    complete: {
      id: 'q60-complete',
      lines: [
        P('It needs a name. It likes shiny things and stealing… Lumi!', 'happy'),
        P('Welcome home, Lumi. The Grove has fruit and friends, and nobody’s alone there.', 'soft'),
        M('Chirrup chirrup!', 'happy'),
        N('Lumi rides home on your shoulder, nibbling your hair. That night it sleeps in the fruit basket, which explains a lot.'),
        P('Every Grove needs a little thief. Just… count your spoons.', 'happy'),
      ],
    },
    rewards: [
      {
        id: 'q60-winged-lemur',
        kind: 'cosmetic',
        label: 'Lumi the winged lemur',
        description: 'A winged lemur petpet that rides on your Keeper’s shoulder and occasionally steals fruit.',
      },
    ],
    notes:
      'Lumi’s speaker name shows from his first chirp; that is fine (Pemba names him in the complete scene). Chase: platform hops between high ledges in the temple ruins. Petpet: idle animations include ear twitches, gliding short hops, pocketing a fruit. q60-home (carried / chose): if “chose”, play Lumi landing on the Keeper’s shoulder on the walk home.',
  },

  // ------------------------------------------------------------------ Q61
  {
    id: 'q61',
    code: 'Q61',
    title: 'Avatar Day',
    source: `${SOURCE}: Avatar Day`,
    audience: 'all',
    trigger: { where: 'The coastal village of Kettleby', when: 'Its festival day' + WHEN_SUFFIX },
    requires: ['Q46'],
    speakers: [PEMBA, TUK, NALU, TIBBS, MRSTIBBS],
    steps: [
      {
        id: 'q61-s1',
        goal: 'Search the Kettleby records hall for the true story of Marshal Brag.',
        hint: 'Records are filed by year, oldest at the back. Your Nubbin can squeeze behind the dusty shelves.',
        check: 'search:kettleby-records',
        scene: {
          id: 'q61-trial',
          lines: [
            N('Kettleby is having a festival. There is bunting, there are sweets, and there is a straw statue of a past Avatar.'),
            N('People are hitting the statue with sticks.'),
            P('Hey! That’s Avatar Kesh! She was me, a long time ago. Sort of. It’s complicated.', 'shock'),
            TI('He admits it! Four hundred years ago, Avatar Kesh ruined our founder, the Great Marshal Brag!', 'angry'),
            P('Wait, what? What did she do?'),
            TI('She split the land in two, and Marshal Brag fell into the sea! Now you shall stand trial for it!'),
            T('Hold on. He’s twelve. Four hundred years ago he wasn’t even a thought.'),
            TI('Under Kettleby law, every past life counts. It’s in the rules. We wrote the rules.'),
            N('Two guards walk Pemba to a cage. It has bunting on it. Pemba waves at you sadly through the bars.'),
            K('We need proof that Kesh wasn’t the villain. Where do they keep the old records?', 'angry'),
          ],
          choices: [
            {
              id: 'fair',
              label: 'Ask for a fair trial',
              then: [TI('Of course! Fair, quick, and finished by lunch.')],
            },
            {
              id: 'tuk',
              label: 'Let Tuk do the talking',
              set: { 'q61-tuk-lawyer': true },
              then: [
                T('Mr Mayor. Your Honour. Sir. I represent the defence.'),
                TI('Do you have any experience?'),
                T('I’ve read a book.'),
              ],
            },
            {
              id: 'sweet',
              label: 'Buy a festival sweet',
              set: { 'q61-sweet': true },
              then: [N('It is shaped like a smashed statue. It tastes of peppermint and guilt.')],
            },
          ],
        },
        done: {
          id: 'q61-trial-done',
          lines: [
            N('Behind the oldest shelf, your Nubbin finds a scroll sealed with Marshal Brag’s own stamp, and an old map it has been using as a blanket.'),
            K('It’s his diary. Look at this entry. And this one.', 'shock'),
          ],
        },
      },
      {
        id: 'q61-s2',
        goal: 'Present the evidence at Pemba’s trial.',
        hint: 'Choose your strongest piece. Any of them will do; some get a bigger cheer.',
        check: 'present:evidence:kettleby-trial',
        scene: {
          id: 'q61-evidence',
          lines: [
            N(
              'The trial is held in the village square. The judge is Mayor Tibbs. The jury is also Mayor Tibbs.',
            ),
            N('A woman in the front row, in a matching Tibbs hat, puts up her hand.'),
            MT('Dear. You can’t be the judge. You can’t find your own socks.'),
            TI('I can find them perfectly well when I’m in a position of authority.'),
            TI('The prisoner may speak, but briefly. We have a parade at four.'),
            T('Your Honour. We have found Marshal Brag’s diary, written in his own hand.'),
            K('“Today I shall march onto Avatar Kesh’s island and take it. Then the next island. Then all the islands.”'),
            T('“Note to self: build a bigger hat.”'),
            N('The crowd murmurs. Someone at the back takes off a Marshal Brag hat and quietly puts it in a bin.'),
            TI('That… does sound a bit like a bully.', 'shock'),
            K('Kesh didn’t attack anyone. She protected her home. Brag fell in because he wouldn’t step back when the cliff cracked.'),
            TI('One more piece of evidence and I’ll be convinced. Keeper? What else did you find?', 'think'),
          ],
          choices: [
            {
              id: 'stone',
              label: 'Point at the founding stone under the statue',
              set: { 'q61-evidence': 'stone' },
              then: [TI('“Thank you, Kesh, for our peace.” It was under the statue all along!', 'shock')],
            },
            {
              id: 'map',
              label: 'Show the old map with Kettleby on Kesh’s side',
              set: { 'q61-evidence': 'map' },
              then: [TI('We were… on her island. Oh dear. She was protecting us.')],
            },
            {
              id: 'kind',
              label: 'Point out that Pemba has been nice to everyone all day',
              set: { 'q61-evidence': 'kind' },
              then: [TI('That is not evidence. That is, however, very true.', 'soft')],
            },
          ],
        },
        done: {
          id: 'q61-evidence-done',
          lines: [
            TI('The court finds the prisoner… not guilty! Release the Avatar!'),
            P('Yay! Can I keep the bunting?', 'happy'),
            P('Keeper? Even if Kesh had done something bad… should I say sorry for it? It wasn’t me. But it sort of was.', 'think'),
          ],
          choices: [
            {
              id: 'q61-not-yours',
              label: '“You’re not to blame for what she did.”',
              set: { 'q61-past': 'not-yours' },
              then: [P('Okay. Then I’ll just try to be someone who deserves a nicer statue.', 'soft')],
            },
            {
              id: 'q61-make-right',
              label: '“It isn’t your fault. But you can still help fix things.”',
              set: { 'q61-past': 'make-right' },
              then: [
                P('Oh. I like that better than blame. Blame just sits there. Fixing gets to do things.', 'happy'),
                T('Write that down. That’s going on a sign.'),
              ],
            },
          ],
        },
      },
    ],
    complete: {
      id: 'q61-complete',
      lines: [
        N('That evening the straw statue comes down. In its place the villagers build a new one. It looks a lot like Pemba.'),
        TI('From now on, Avatar Day will be Pemba Day! With fewer sticks and more sweets.', 'happy'),
        P('That’s the best day I’ve ever heard of!', 'happy'),
        T('You realise you’re a holiday now. That’s going to go straight to your head.'),
        P('It’s already in my head. It’s having a party.'),
        TI('And from now on, we read our own records before anyone picks up a stick. We should have done that years ago.', 'soft'),
        N('The mayor hands you a painted festival mask, and an invitation: Pemba Day will come once to the Grove.'),
      ],
    },
    rewards: [
      {
        id: 'q61-festival-mask',
        kind: 'cosmetic',
        label: 'Festival mask',
        description: 'A painted Kettleby festival mask with a cheerful blue arrow on the forehead.',
      },
      {
        id: 'q61-pemba-day',
        kind: 'feature',
        label: 'Pemba Day',
        description: 'A one-time festival in the Grove: lanterns, bunting, and a sweet for every Nubbin.',
      },
    ],
    notes:
      'Avatar Kesh (based on Avatar Kyoshi) and Marshal Brag (based on Chin the Conqueror) are mentioned only, never on screen. Brag “fell into the sea” and nothing more is said; keep it that way. The cage is comic (bunting). Pemba Day: schedule a single festival day in the Grove a few days after completion. q61-past (not-yours / make-right) is flavour; both answers are treated as right.',
  },

  // ------------------------------------------------------------------ Q62
  {
    id: 'q62',
    code: 'Q62',
    title: 'Penguin Sledding',
    source: `${SOURCE}: The Boy in the Iceberg`,
    audience: 'all',
    trigger: { where: 'The frozen pond', when: 'Any snow day' + WHEN_SUFFIX },
    requires: ['Q46'],
    speakers: [NALU, TUK, PEMBA],
    steps: [
      {
        id: 'q62-s1',
        goal: 'Break Pemba out of the ice.',
        hint: 'Tap the glowing cracks. Your Nubbins warm the ice when they huddle close.',
        check: 'break:iceberg',
        scene: {
          id: 'q62-iceberg',
          lines: [
            N('Snow covers the Grove. On the bank of the frozen pond, Nalu and Tuk are poking at a huge block of ice that wasn’t there yesterday.'),
            T('For the record, I said leave it. Mysterious glowing ice is never good news.'),
            K('Pemba’s inside! He was meditating by the pond last night and… kept going.', 'shock'),
            T('Or, hear me out, we fetch a grown-up. Someone with a chisel and a very long ladder.'),
            N('Your Nubbin presses its paws to the ice and looks up at you. Under the surface, a blue arrow glows faintly.'),
            K('Please. He could be freezing in there.'),
            T('He’s in an iceberg, Nalu. I think that ship has sailed.'),
          ],
          choices: [
            {
              id: 'crack',
              label: 'Crack it with a stone',
              then: [N('You strike. A thin crack zigzags across the ice.')],
            },
            {
              id: 'huddle',
              label: 'Get your Nubbins to huddle round it',
              set: { 'q62-huddle': true },
              then: [N('Your Nubbins press together against the ice. It starts to drip, then trickle.')],
            },
            {
              id: 'tuk',
              label: 'Hand Tuk his boomerang',
              then: [T('Fine. FINE. But when he thaws out, I’m telling him whose fault this was.')],
            },
          ],
        },
        done: {
          id: 'q62-iceberg-done',
          lines: [
            N('The ice splits with a crack and a whoosh of air. Pemba sits up, blinking, with frost on his eyebrows.'),
            P('Hi! Did I miss breakfast? Do you have any penguins?'),
          ],
        },
      },
      {
        id: 'q62-s2',
        goal: 'Make friends with a penguin and race Pemba down the snowy hill.',
        hint: 'Offer a fish first, then lean left and right to steer. Belly-flat is fastest.',
        check: 'race:finish:penguin-sled',
        scene: {
          id: 'q62-sled',
          lines: [
            K('Do we have… what?'),
            P('Penguins! I could swear I saw some go past while I was meditating. Big ones. Slidey ones.', 'happy'),
            T('He’s been frozen solid all night, and his first question is about penguins.'),
            P('What would your first question be?'),
            T('…Probably “where’s the food”. Okay, fair.', 'think'),
            K('Pemba… how long were you in there?', 'soft'),
            P('Since last night. It was very peaceful. Then it was very cold.'),
            P('Can I warm up on a penguin? Penguins are warm. Probably.', 'happy'),
            N('On the snowy hill, a line of penguins waddles past, sleek and round and not at all in the mood.'),
            P('The trick is fish. You give them a fish, they give you a ride. Everyone knows that.'),
            N('Your Nubbin is already holding out a fish to the smallest penguin. The penguin considers it carefully.'),
            P('Race you to the bottom! Loser carries the fish!', 'happy'),
            N('The smallest penguin takes the fish, looks at Pemba, and waddles over to your Nubbin instead. It has chosen.'),
            T('That penguin has better judgement than most of us.'),
          ],
        },
        done: {
          id: 'q62-sled-done',
          lines: [
            N('You fly down the hill, across a frozen puddle and into a snowdrift. Pemba lands beside you, laughing too hard to stand.'),
            P('Again! Again! AGAIN!', 'happy'),
          ],
        },
      },
    ],
    complete: {
      id: 'q62-complete',
      lines: [
        K('I haven’t seen anyone laugh like that in a long time.', 'soft'),
        T('I haven’t seen anyone eat that much snow in a long time.'),
        P('The penguins say you can come back any snow day. Well, they didn’t say it. But they looked it.', 'happy'),
        P('Thanks for getting me out. And for the penguin. Mostly the penguin.', 'soft'),
        N('The penguins waddle home over the hill. The smallest one turns back to stare at your Nubbin, who waves.'),
      ],
    },
    rewards: [
      {
        id: 'q62-penguin-sledding',
        kind: 'feature',
        label: 'Penguin sledding',
        description: 'On snow days, a penguin sledding race opens on the snowy hill. Bring fish.',
      },
    ],
    notes:
      'Needs weather snow. A mishap, not Pemba’s origin: he is already a friend from Q46, meditated by the pond overnight and froze in. The iceberg is a large glowing ice block on the bank of the frozen pond. Race: belly-sled downhill, lean to steer, Pemba as the rival racer; any finish completes the step. Penguins: waddle and belly-slide animations.',
  },

  // ------------------------------------------------------------------ Q63
  {
    id: 'q63',
    code: 'Q63',
    title: 'King Rumbold’s Challenges',
    source: `${SOURCE}: The King of Omashu`,
    audience: 'all',
    trigger: { where: 'The cliff city of Stonereach', when: 'Any day' + WHEN_SUFFIX },
    requires: ['Q46'],
    speakers: [RUMBOLD, PEMBA, TUK, CABBAGE],
    steps: [
      {
        id: 'q63-s1',
        goal: 'Fetch the king’s key from the bottom of the waterfall.',
        hint: 'A Swim Nubbin can dive the pool. Otherwise, wait for the water to drop at noon.',
        check: 'fetch:rumbold-key',
        scene: {
          id: 'q63-throne',
          lines: [
            N('In the city of Stonereach, carved into the cliffs, the king sits on a stone throne. He is very old, very wrinkled, and grinning.'),
            BU('Visitors! I love visitors. You will face three challenges. If you fail, you will be… hmm… sent home without pudding.', 'happy'),
            T('That’s… actually a pretty scary punishment.'),
            N('King Rumbold throws his head back and laughs: a loud, honking bray, like a donkey that has heard a very good joke.'),
            BU('Challenge one! I have dropped the key to my snack cupboard to the bottom of the waterfall. Fetch it!'),
            P('How did it get down there?'),
            BU('I threw it. I wanted to see if it could fly. It could not.', 'happy'),
          ],
          choices: [
            {
              id: 'accept',
              label: 'Accept the challenge',
              then: [BU('Wonderful! Off you go! Mind the fish, they nibble.')],
            },
            {
              id: 'why',
              label: 'Ask why he needs the key',
              then: [BU('Because I am hungry, child. Why does anyone want anything?', 'think')],
            },
            {
              id: 'laugh',
              label: 'Laugh along with him',
              set: { 'q63-laughed': true },
              then: [N('You laugh. He laughs harder. Your Nubbin brays. The guards look very tired.')],
            },
          ],
        },
        done: {
          id: 'q63-throne-done',
          lines: [
            BU('My key! My snacks are safe! Challenge one complete!', 'happy'),
            N('He unlocks the cupboard and eats a whole cake in one bite, without breaking eye contact.'),
          ],
        },
      },
      {
        id: 'q63-s2',
        goal: 'Find Biscuit the goat-yak somewhere in the city of Stonereach.',
        hint: 'Follow the bleating. Goat-yaks love high places and anything that looks like a cabbage.',
        check: 'find:biscuit-goat-yak',
        scene: {
          id: 'q63-pet',
          lines: [
            BU('Challenge two! My pet, Biscuit, has run away again. He is somewhere in the city. Find him!'),
            T('What kind of animal is Biscuit?'),
            BU('He is a goat-yak. You will know him because he looks like a goat, and also like a yak.', 'happy'),
            N('A stone mail chute rattles past your head. Somewhere in the city, something bleats.'),
            T('Stone city. Narrow streets. One goat-yak. Okay, we sweep from the top down. Pemba, you take the roofs.', 'think'),
            P('I love roofs!', 'happy'),
            BU('Or! Instead of looking for Biscuit, you could think like Biscuit.', 'happy'),
            T('I am not going to think like a goat-yak.'),
            N('Your Nubbin is already climbing the highest wall in sight, chewing a leaf thoughtfully.'),
          ],
        },
        done: {
          id: 'q63-pet-done',
          lines: [
            N('You find Biscuit on a rooftop, eating a cabbage from a familiar-looking cart.'),
            C('My cabbages! Not UP there!'),
            BU('Biscuit! You found him! That’s two!', 'happy'),
          ],
        },
      },
      {
        id: 'q63-s3',
        goal: 'Ride the mail chutes to the bottom of Stonereach with King Rumbold.',
        hint: 'Lean into the bends and duck under the letter slots. The king will not slow down.',
        check: 'minigame:complete:mail-chute',
        scene: {
          id: 'q63-opponent',
          lines: [
            BU('Challenge three. The last, and the most dangerous. You must face an opponent. And you may choose who!'),
            N('He points to a huge guard with a hammer, to a hulking rock beast in a cage, and to himself.'),
            T('Okay. Easy. Don’t pick the beast. Don’t pick the hammer. Pick the very old man.'),
            P('Tuk, I think the very old man is the scary one.', 'think'),
            BU('Choose wisely! Or unwisely! I enjoy both!', 'happy'),
            N('Your Nubbin points at the guard, then the beast, then shakes its head firmly at both.'),
          ],
          choices: [
            {
              id: 'guard',
              label: 'Choose the guard',
              set: { 'q63-opponent': 'guard' },
              then: [BU('Wrong! Your true opponent is… the MAIL CHUTES! Nobody beats the mail chutes!', 'happy')],
            },
            {
              id: 'beast',
              label: 'Choose the rock beast',
              set: { 'q63-opponent': 'beast' },
              then: [BU('Wrong! Your true opponent is… the MAIL CHUTES! Nobody beats the mail chutes!', 'happy')],
            },
            {
              id: 'king',
              label: 'Choose King Rumbold himself',
              set: { 'q63-opponent': 'king' },
              then: [
                BU('Ooh, closer! But still wrong!', 'happy'),
                BU('Your true opponent is… the MAIL CHUTES! And I am coming with you!'),
              ],
            },
          ],
        },
        done: {
          id: 'q63-opponent-done',
          lines: [
            N('You shoot out of the last chute into a pile of letters. The king lands on top of you, honking with laughter.'),
            BU('Again! Oh, wait. I’m the king. I can do this whenever I like.', 'happy'),
          ],
        },
      },
    ],
    complete: {
      id: 'q63-complete',
      lines: [
        BU('You passed. All three. Do you know why I set them?', 'soft'),
        P('To see if we were brave?'),
        BU('No. To see if you’d have fun. Most people forget how to play. I wanted to see if you remembered.'),
        T('That’s… surprisingly wise.'),
        BU('I know! Now take a bit of my mail chute. And my laugh. I have plenty.', 'happy'),
        BU('Biscuit also says thank you. He is saying it by eating your hat.'),
        N('You go home with a short stone slide for the Grove, and a laugh that makes everyone nearby turn round.'),
      ],
    },
    rewards: [
      {
        id: 'q63-mail-chute-slide',
        kind: 'decor',
        label: 'Mail-chute slide',
        description: 'A short, twisty stone slide. Nubbins climb up and whizz down it all day.',
      },
      {
        id: 'q63-rumbold-laugh',
        kind: 'cosmetic',
        label: 'King Rumbold’s laugh emote',
        description: 'Your Keeper throws their head back and gives a loud, honking bray of a laugh.',
      },
    ],
    childLines: {
      'q63-pet-done#1': 'Not the cabbages! Not up there!',
    },
    notes:
      'King Rumbold’s laugh is a donkey-like honk (needs a dedicated SFX, reused by the emote). Waterfall pool: Swim Nubbins can fetch the key at any time; otherwise the water level drops at noon. The cabbage merchant’s cry in q63-pet-done (swapped in childLines) is heard from off screen (a voice only; he is not seen). Mail chute: downhill track minigame with the king riding alongside. q63-opponent is flavour: every pick is wrong, and that is the joke.',
  },

  // ------------------------------------------------------------------ Q64
  {
    id: 'q64',
    code: 'Q64',
    title: 'Hello, Kaito Here',
    source: `${SOURCE}: The Western Air Temple`,
    audience: 'all',
    trigger: { where: 'The old temple ruins at the edge of the Grove', when: 'Any evening' + WHEN_SUFFIX },
    requires: ['Q46', 'Q56'],
    speakers: [KAITO, PEMBA, NALU, TUK, BAO],
    steps: [
      {
        id: 'q64-s1',
        goal: 'Help Kaito rehearse his speech three times.',
        hint: 'Pick the advice you think helps. Each try, he gets a little less awful.',
        check: 'talk:kaito:rehearse:3',
        scene: {
          id: 'q64-rehearse',
          lines: [
            N('Behind a broken pillar, you find Kaito pacing in circles, muttering to a rock.'),
            Z('Oh! Keeper. I wasn’t… I’m not talking to a rock. Why would I be talking to a rock.', 'shock'),
            Z('Fine. I was talking to the rock. I’m practising. I want to ask Pemba if I can join his group.'),
            Z('The problem is, I keep getting it wrong. Last time I said “I have changed” and then just stood there for a full minute.', 'sad'),
            Z('I chased them right round the world in a very loud boat. All summer. At night.'),
            Z('In my defence, I was very tired. In nobody’s defence, I was very loud.', 'sad'),
            N('Your Nubbin climbs onto the rock and sits on it, as if it were the audience.'),
            Z('Can you listen? Tell me if it’s bad. It’s going to be bad. Okay. Here goes.', 'think'),
            Z('Pemba. Greetings. I am… a person. Who used to be… the bad kind of person. But now I’m the good kind. Probably. Thanks.'),
          ],
          choices: [
            {
              id: 'honest',
              label: 'Tell him it’s a bit stiff',
              set: { 'q64-advice': 'honest' },
              then: [Z('Stiff. Right. I can do less stiff. I think.', 'sad')],
            },
            {
              id: 'kind',
              label: 'Tell him it’s a good start',
              set: { 'q64-advice': 'kind' },
              then: [Z('Really? You’re not just saying that?', 'happy'), N('You are just saying that, a little.')],
            },
            {
              id: 'smile',
              label: 'Suggest he smiles',
              set: { 'q64-advice': 'smile' },
              then: [
                N('Kaito smiles. It looks like it hurts. Your Nubbin hides behind the rock.'),
                Z('Too much?'),
              ],
            },
          ],
        },
        done: {
          id: 'q64-rehearse-done',
          lines: [
            Z('Attempt two. “Pemba. I have brought you a gift. The gift is me.”'),
            Z('No. Awful. Attempt three. “I’m sorry. I want to help.”', 'think'),
            N('It is the shortest one. It is also, by far, the best.'),
            Z('Okay. Okay. I think that’s it. Short and friendly. Short and friendly.'),
            Z('What if I just wave? Waving is friendly. Isn’t it?', 'think'),
          ],
        },
      },
      {
        id: 'q64-s2',
        goal: 'Stand by Kaito while he asks to join the group.',
        hint: 'Stay close to the campfire. Kaito does better with someone friendly beside him.',
        check: 'talk:pemba:kaito-joins',
        scene: {
          id: 'q64-ask',
          lines: [
            N('Pemba, Nalu, Tuk and Bao sit round a campfire in the ruins. Kaito steps out of the shadows. Everyone jumps.'),
            T('Oh good. A surprise prince. Exactly what this evening needed.', 'shock'),
            B('Relax. His heart’s going like a rabbit’s. He’s more scared than you are.'),
            N('Kaito raises one hand in a stiff little wave. Then forgets to lower it.'),
            Z('Hello, Kaito here.'),
            Z('…That was not the speech. That was not any of the speeches.', 'think'),
            K('What do you want, Kaito?', 'angry'),
            N('Kaito looks at you. Your Nubbin looks at you. Everyone, suddenly, is looking at you.'),
          ],
          choices: [
            {
              id: 'vouch',
              label: 'Tell them he’s been practising for hours',
              set: { 'q64-help': 'vouch' },
              then: [P('Practising? For us? Kaito, that’s the nicest thing anyone’s ever done badly.', 'happy')],
            },
            {
              id: 'nudge',
              label: 'Nudge him to try again',
              set: { 'q64-help': 'nudge' },
              then: [Z('I want to help. I was wrong about a lot of things. I want to be on your side, if you’ll let me.', 'soft')],
            },
            {
              id: 'wave',
              label: 'Wave back',
              set: { 'q64-help': 'wave' },
              then: [N('You wave back. Pemba waves too. Bao waves in entirely the wrong direction, on purpose.')],
            },
          ],
        },
        done: {
          id: 'q64-ask-done',
          lines: [
            P('Okay. You can join. Welcome to the team!', 'happy'),
            Z('Really? Just like that?', 'shock'),
            T('No. Not just like that. There will be a trial period. With paperwork.'),
            K('I haven’t forgotten what you did, Kaito.'),
            Z('Good. You shouldn’t. I don’t want you to forget it. I want the chance to be more than it.', 'soft'),
            K('…One chance.'),
          ],
        },
      },
    ],
    complete: {
      id: 'q64-complete',
      lines: [
        N('Later, Kaito finds you by the pillar. His hand is still slightly raised, as if it got stuck.'),
        Z('Thank you. For listening. And for the rock.', 'soft'),
        Z('I’m still not good at this. Talking. People. Waving.', 'think'),
        Z('But I think I got a bit better today.', 'happy'),
        N('He waves at you. It is stiff, awkward and slightly too long. Your Nubbin copies it perfectly.'),
      ],
    },
    rewards: [
      {
        id: 'q64-awkward-wave',
        kind: 'cosmetic',
        label: 'Awkward wave emote',
        description: 'Your Keeper raises one hand in a stiff little wave and forgets to put it down.',
      },
    ],
    notes:
      'Uses the brief’s adapted line “Hello, Kaito here.” (q64-ask line 4), which needs no childLines swap. Rehearsal: three passes through Kaito’s speech; each pass improves whatever advice you pick (all choices count). Comic timing: hold on Kaito’s raised hand for a beat.',
  },

  // ------------------------------------------------------------------ Q65
  {
    id: 'q65',
    code: 'Q65',
    title: 'The White Lotus',
    source: `${SOURCE}: Pai Sho with Iroh`,
    audience: 'all',
    trigger: { where: 'Under the big tree by the pond', when: 'Any rainy afternoon' + WHEN_SUFFIX },
    requires: ['Q46', 'Q64'],
    speakers: [TENZO, KAITO],
    steps: [
      {
        id: 'q65-s1',
        goal: 'Learn the tile game: finish Uncle Tenzo’s practice round.',
        hint: 'Grow flowers in the middle and block with rocks at the edge. Uncle Tenzo will point out mistakes, kindly.',
        check: 'minigame:complete:lotus-tiles-practice',
        scene: {
          id: 'q65-tiles',
          lines: [
            N('Rain patters on the leaves. Under the big tree, Uncle Tenzo has laid out a round wooden board and a box of painted tiles.'),
            I('Ah, Keeper. Will you keep an old man company? This game is no fun alone. I always win, and then I feel bad.', 'happy'),
            N('The tiles show flowers, rocks and wind. One tile, set apart from the rest, shows a single white lotus.'),
            I('The rules are simple. Flowers grow. Rocks block. Wind moves things. The lotus does nothing at all.'),
            I('Which is, of course, why it is the most important tile.', 'think'),
            Z('Uncle, every time you explain this game, it gets more confusing.'),
            I('That is how you know it is a good game, nephew. The rules are easy. The game is not.', 'soft'),
            N('Your Nubbin picks up a flower tile and sniffs it hopefully. It is wood. It is disappointed.'),
          ],
          choices: [
            {
              id: 'teach',
              label: 'Ask him to teach you properly',
              then: [I('With pleasure. First lesson: a tile placed in a hurry is a tile you will stare at all game.', 'happy')],
            },
            {
              id: 'lotus',
              label: 'Ask what the lotus tile does',
              then: [I('Patience. In this game, and perhaps outside it, the quiet ones matter most.', 'soft')],
            },
            {
              id: 'snacks',
              label: 'Ask if there are snacks',
              set: { 'q65-snacks': true },
              then: [I('There are always snacks. A board game without snacks is a punishment.', 'happy')],
            },
          ],
        },
        done: {
          id: 'q65-tiles-done',
          lines: [
            I('Good. You don’t rush. You look at the whole board, not just your own tile. That is rare.'),
            Z('He says that to everyone.'),
            I('I have never said it to you, nephew.'),
          ],
        },
      },
      {
        id: 'q65-s2',
        goal: 'Win a game of tiles against Uncle Tenzo.',
        hint: 'Save your lotus tile for last. It can’t be blocked, and it changes the whole board.',
        check: 'minigame:win:lotus-tiles',
        scene: {
          id: 'q65-game',
          lines: [
            I('Now, a real game. I will not go easy on you. I will go medium.'),
            N('The rain grows heavier. The tea grows cold. Kaito falls asleep against the tree trunk, snoring gently.'),
            I('Do you know why I love this game? Because every tile matters, but no tile wins alone.', 'soft'),
            I('A general learns that slowly. A gardener learns it quickly. Be a gardener, Keeper.'),
            I('And if you lose, do not sulk. A lost game is a lesson the board gives you free of charge.'),
            N('Your Nubbins sit in a row along the edge of the board, watching each move like it is the most exciting thing in the world.'),
            I('Hmm. That was a clever move. Did you mean it, or was it luck?', 'think'),
          ],
          choices: [
            {
              id: 'meant',
              label: 'Say you meant it',
              then: [I('Then I am in trouble.', 'happy')],
            },
            {
              id: 'luck',
              label: 'Admit it was luck',
              then: [I('Honest! Luck is kinder to honest players than you would think.', 'soft')],
            },
            {
              id: 'nubbin',
              label: 'Point at your Nubbin',
              set: { 'q65-credit': 'nubbin' },
              then: [I('Ah! A Nubbin with a strategic mind! I should have known.', 'happy')],
            },
          ],
        },
        done: {
          id: 'q65-game-done',
          lines: [
            N('You place your last tile. Flowers bloom across the board. Uncle Tenzo sits back and smiles, very wide.'),
            I('Beaten! Fair and square! What a happy afternoon!', 'happy'),
            N('Kaito wakes and blinks at a board full of flowers.'),
            Z('Did I miss it?'),
            I('You snored in three keys. It was the best part.', 'happy'),
          ],
        },
      },
    ],
    complete: {
      id: 'q65-complete',
      lines: [
        I('Keep this. The white lotus tile. It belongs with someone who has learned patience.', 'soft'),
        N('He presses the little tile into your palm. It is old, smooth, and warmer than wood should be.'),
        I('And now a secret. In any town, any market, if you see this tile on a stall or a door, you are among friends.'),
        I('There are more of us than you would think. Old people who play slow games and keep an eye on things.', 'soft'),
        Z('…Uncle. Are you in a secret society?'),
        I('I am in a tea society. Mostly. Go back to sleep, nephew.', 'happy'),
        N('Your Nubbin carries the board home on its head. The lotus tile hangs from your belt, quietly mattering.'),
      ],
    },
    rewards: [
      {
        id: 'q65-tile-board',
        kind: 'decor',
        label: 'Lotus tile board',
        description: 'A round wooden board game table with painted tiles. Nubbins sometimes sit and push the tiles about.',
      },
      {
        id: 'q65-white-lotus-badge',
        kind: 'cosmetic',
        label: 'White Lotus tile badge',
        description: 'Uncle Tenzo’s white lotus tile, worn on the belt. A sign that you are among friends.',
      },
    ],
    notes:
      'Tile game is an original simple board game (flowers grow, rocks block, wind shifts, lotus unblockable); not a recreation of Pai Sho rules. Practice round cannot be lost. Uncle Tenzo plays at “medium” difficulty. All proverbs are new. Rainy-afternoon trigger needs weather rain or any afternoon if rain is rare. q65-snacks is flavour: Tenzo’s reply is the joke.',
  },
];

export const CHECKS: string[] = [
  'collect:cabbage:8',
  'repair:cabbage-cart',
  'craft:cabbage-cart:untippable',
  'visit:ridge-tunnel',
  'minigame:complete:crystal-maze',
  'escort:canyon-clans',
  'minigame:complete:straight-face',
  'deliver:party-invite:5',
  'minigame:score:cave-dance:300',
  'minigame:perfect:tea-brewing:3',
  'serve:tea:mr-pell',
  'minigame:complete:herd-tuk',
  'collect:cactus-cutting:3',
  'track:puffin:3',
  'feed:puffin:5',
  'ride:puffin:grove',
  'train:fan-drill',
  'karate:win:sumi-spar',
  'train:pian-lessons:3',
  'craft:meteor-sword',
  'watch:ember-bay-play:act-1',
  'watch:ember-bay-play:finale',
  'visit:rumble-arena',
  'karate:fight:little-landslide',
  'deliver:river-village-supplies:5',
  'minigame:complete:river-clean',
  'talk:aunt-wen',
  'visit:mount-grumble-crater',
  'minigame:complete:cloud-shaping',
  'distract:captain-hake',
  'minigame:complete:river-chase',
  'chase:winged-lemur:temple-ruins',
  'feed:winged-lemur:3',
  'search:kettleby-records',
  'present:evidence:kettleby-trial',
  'break:iceberg',
  'race:finish:penguin-sled',
  'fetch:rumbold-key',
  'find:biscuit-goat-yak',
  'minigame:complete:mail-chute',
  'talk:kaito:rehearse:3',
  'talk:pemba:kaito-joins',
  'minigame:complete:lotus-tiles-practice',
  'minigame:win:lotus-tiles',
];
