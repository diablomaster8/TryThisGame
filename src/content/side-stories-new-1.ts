/**
 * New side stories for "Hazel’s Grove" (briefs/new-stories.md), part 1 of the for-fun set:
 *   S11 The Blight      chapter 5 → before ch8   Fern’s plum orchard, Ember’s torch, a beetle on the wind
 *   S15 Lucky Eggs      chapter 5 → before ch8   Dashwood Prance’s Mystery Eggs and a parrot who can’t lie
 *   S16 The Workyard    chapter 6 → before ch9   Brisk Hollins’s sawmill, Lug, and the Fair Roster
 *
 * None of these changes the campaign. Each sets only its own `sNNDone` flag on completion,
 * plus harmless local flags prefixed `s11-` / `s15-` / `s16-` from choices. They never read or
 * write campaign flags, never move Moss’s chapter 10 threshold, and add nothing to chapter 9.
 *
 * Timing: a step’s `scene` plays when the step starts, which is the moment the previous step’s
 * `check` is met; its `done` scene plays when its own `check` is met.
 *
 * What the player knows: all three stories sit in chapters 5–8. They may mention the Circuit,
 * Ember’s loss of Ash (chapter 5), the Tale of the Four and “cinder-love” (chapter 4). They never
 * explain the shard, the theft or the Stillness (chapters 7–9). S15’s Circuit sticker and
 * S16’s Circuit mention are hints only.
 *
 * Audience 'all'. All words are original; no outside quotes, so no childLines are needed.
 */
import type { Line, Mood } from '../config/story';
import type { Quest, Speaker } from './types';

const say =
  (who: string) =>
  (text: string, mood?: Mood): Line =>
    mood ? { who, text, mood } : { who, text };

// ---------------------------------------------------------------- campaign speakers
const N = say('narrator');
const Y = say('you');
const FE = say('fern');
const SP = say('sparks');
const CL = say('clover');
const EM = say('ember');
const BY = say('byte');

// ---------------------------------------------------------------- new speakers
const DASHWOOD: Speaker = {
  id: 'dashwood',
  name: 'Dashwood Prance',
  kind: 'other',
  basedOn: 'Borderlands’ grinning villain who is sure he’s the hero; Diablo’s gambling vendor (themes only)',
};
const JACKPOT: Speaker = { id: 'jackpot', name: 'Jackpot', kind: 'other' };
const PIP: Speaker = { id: 'pip', name: 'Pip', kind: 'other' };
const KIDS: Speaker = { id: 'kids', name: 'The children', kind: 'other' };
const BRISK: Speaker = {
  id: 'brisk',
  name: 'Brisk Hollins',
  kind: 'other',
  basedOn: 'Palworld’s cheerful base-owner (theme only; an original character)',
};

const DA = say('dashwood');
const JP = say('jackpot');
const PI = say('pip');
const KD = say('kids');
const BK = say('brisk');

export const SIDE_STORIES_NEW_1: Quest[] = [
  // ================================================================== S11
  {
    id: 's11',
    code: 'S11',
    title: 'The Blight',
    source: 'Warcraft III: the culling of Stratholme (theme only: a good person about to do a terrible thing to stop a plague)',
    audience: 'all',
    trigger: {
      where: 'The Grove gate, then Fern’s south orchard next door',
      when:
        'Chapter 5, any morning after c5-open (once Ember has told her story of Ash), but not the morning S5 opens. ' +
        'Closes before chapter 8 begins.',
    },
    speakers: [],
    steps: [
      {
        id: 's11-step1',
        goal: 'Go next door and look at the sick plum trees in Fern’s south orchard.',
        hint: 'Go through the gap in the hedge past Fern’s water butt. The sick trees are at the bottom of the slope.',
        check: 'inspect:tree:s11-sick-plums',
        scene: {
          id: 's11-fern',
          lines: [
            N('Fern is at your gate before breakfast, holding a plum out on her flat palm as if it might bite.'),
            FE('Don’t touch it. Just look at it. Then tell me I’m imagining it.', 'sad'),
            N('The skin is freckled black. When she tilts her hand, the plum caves in and pours out a soft grey dust.'),
            FE('Three trees at the bottom of the south orchard. Fine yesterday. Today they’re… that.'),
            FE('I know. “Keeping the trees alive, badly.” Yes. I said it first. I’ve said it for years.', 'think'),
            N('Through the hedge, the orchard hums with wasps drunk on windfalls. The whole slope smells of hot jam.'),
            FE('Hazel grafted half those trees for me, the year I moved in. She whitewashed every trunk herself, every spring.', 'soft'),
            FE('I haven’t told anyone. If I tell someone, it’s real.', 'sad'),
          ],
          choices: [
            {
              id: 'look',
              label: 'Go and look now.',
              set: { 's11-first': 'look' },
              then: [N('You go through the hedge. Fern follows two steps behind, as if the trees might hear her coming.')],
            },
            {
              id: 'comfort',
              label: 'Put an arm round her first.',
              set: { 's11-first': 'comfort' },
              then: [
                FE('Oh, don’t. I’ll go soggy. I’ve got a whole orchard to be soggy about.', 'sad'),
                N('She leans on you for exactly one second, then marches off through the hedge.'),
              ],
            },
            {
              id: 'byte',
              label: 'Say you’ll fetch Byte.',
              set: { 's11-first': 'byte' },
              then: [FE('Byte. Yes. Byte will put it in a chart, and then it’s a problem instead of a tragedy.', 'think')],
            },
          ],
        },
        done: {
          id: 's11-ember',
          lines: [
            N('Three trees at the bottom of the slope.'),
            N('Their leaves have curled into little black fists. Dust lies under them like spilt flour.'),
            N('Someone else has seen. Ember stands at the orchard wall with her arms folded so tight her knuckles are white.'),
            EM('Burn it. All of it. Tonight, before it spreads.', 'angry'),
            FE('All of it? Ember, there are forty trees.', 'shock'),
            EM('There’ll be none if you wait. I know how waiting goes. You’re polite, you wait, and then it’s too late.', 'angry'),
            N('Clover has come up behind you with a basket of bandages, which is what Clover brings to everything.'),
            CL('You can’t burn forty trees for three. You don’t even know what it is yet.', 'sad'),
            EM('I didn’t know what Corvin was either, till he had Ash. Ask me how that went.', 'angry'),
            N('Fern sits down on an upturned crate between them. It says PLUMS on the side, which nobody mentions.'),
            CL('That’s cinder-love, like the skipping rhyme. Holding on so tight you’d burn the lot. Don’t tell Ember I said so.', 'soft'),
          ],
        },
      },
      {
        id: 's11-step2',
        goal: 'Map the orchard with Byte’s hand lens: check every tree and label it.',
        hint: 'Look at a leaf, the bark and the fruit of each tree under the lens, then pick a label. Note the wind as you go.',
        check: 'minigame:clear:s11-orchard-map',
        scene: {
          id: 's11-lens',
          lines: [
            N('Byte arrives at a jog with a hand lens on a string, a roll of luggage labels and a pencil behind each ear.'),
            BY('Nobody burns anything until it’s been looked at. That isn’t a rule. That’s just being a person.', 'think'),
            EM('You’ve got till dusk. Then I’m doing it, with or without your little labels.', 'angry'),
            BY('They’re standard labels. They’re not little. They’re regular.', 'angry'),
            N('He ties the first label to the first sick tree. In capitals: NOT FINE.'),
            N('The next gets PROBABLY FINE. The next gets FINE (ACCORDING TO FERN). The water butt gets DO NOT DRINK.'),
            BY('Forty trees, one lens. You look, I write. Clover, stop bandaging that branch. It isn’t injured. It’s a branch.'),
            CL('It looked lonely.', 'soft'),
            BY('Leaves for spots, bark for holes, fruit for dust. And don’t lick anything. I have to say that. I’ve met people.', 'think'),
            N('On his way past the wall he labels Ember, very small and very fast: VOLATILE. She doesn’t notice. Yet.'),
          ],
        },
        done: {
          id: 's11-map',
          lines: [
            N('By mid-afternoon the orchard flutters with labels like a washing line. You spread the map on Fern’s crate.'),
            N('Three trees NOT FINE, in a crooked row at the bottom. Six INCONCLUSIVE, SMELLS. The rest are fine.'),
            BY('It isn’t random. Look. Every sick one is in the line of the wind that comes up off the falls.', 'think'),
            BY('A thing you catch by touching goes tree to tree. This one skipped trees. It came through the air.'),
            Y('So what’s in the air?'),
            BY('Good question. I have a jar.', 'happy'),
          ],
        },
      },
      {
        id: 's11-step3',
        goal: 'Catch one of whatever is riding the wind into the bottom row.',
        hint: 'Keep your shadow behind you. Whatever it is drops off the leaf the moment a shadow touches it.',
        check: 'catch:bug:s11-carrier',
        scene: {
          id: 's11-jar',
          lines: [
            N('Byte hands you a jam jar with a muslin lid. Clover hands you a second one, in case the first gets lonely.'),
            BY('Something is landing on the sick side. If we catch it, we can stop guessing.'),
            N('You crouch in the long grass by the bottom row.'),
            N('The sun is hot on your neck. Dust lifts off the black plums like smoke.'),
            N('Something small and grey lands on a leaf. The moment your shadow touches the leaf, it folds its legs and drops.'),
            CL('Keep the sun in your face, so your shadow’s behind you. Shy things hide from shadows. I would.', 'soft'),
            EM('Or we could burn the lot and not crawl about in the grass.', 'angry'),
            N('She says it, but she doesn’t leave. She stands at the wall and watches every catch you miss.'),
          ],
        },
        done: {
          id: 's11-beetle',
          lines: [
            N('In the jar: a beetle no bigger than a lentil, grey as pencil dust, wings folded like a paper fan.'),
            BY('Under the lens it’s covered in spores. Black ones. It isn’t the disease. It’s the postman.', 'shock'),
            N('Byte follows the wind upslope with his pencil, past the three sick trees, to a dead wild plum in the hedge by the stream.'),
            N('The dead tree is grey and crawling with them. Each breath of wind off the falls lifts a few and carries them down the row.'),
            BY('They can’t fly into the wind. Only the trees downwind of that stump get them. The rest are safe. It can be contained.', 'happy'),
            CL('Ladybirds eat beetle eggs. I’ve a jar of them at home. They’re very rude about it.', 'happy'),
            CL('That tree’s clean. Right in the middle of the sick row, and not a beetle on it. Look.', 'shock'),
            FE('Grudge. Hazel’s old damson. Sourest fruit in the valley. I’ve been meaning to cut it down for years.', 'think'),
            N('Byte ties a new label to the jar. It says: GUILTY.'),
          ],
        },
      },
      {
        id: 's11-step4',
        goal: 'Help Clover let her ladybirds go in the hedge where the beetles breed.',
        hint: 'Open Clover’s jar by the dead wild plum, or where it stood, then step back and keep still.',
        check: 'release:ladybirds:s11-orchard',
        scene: {
          id: 's11-dusk',
          lines: [
            N('The sun goes down behind the western hill. Bats come out over the stream.'),
            N('Then a light comes through the hedge, low and orange.'),
            N('Ember, with a pitch torch. In the firelight her face isn’t angry. It is very, very frightened.'),
            EM('I’m sorry, Fern. I’m not waiting. I waited once.', 'sad'),
            FE('Ember…', 'sad'),
            EM('When Ash went, I kept thinking: tomorrow. I’ll go and get her back tomorrow. Then tomorrow was years.', 'sad'),
            EM('Fast is the only thing I’ve got. Don’t take it off me.', 'angry'),
            N('Byte holds the map. Clover holds Fern’s hand. Everybody looks at you.'),
          ],
          choices: [
            {
              id: 'stand',
              label: 'Stand between her and the trees.',
              set: { 's11-dusk': 'stood' },
              then: [
                N('You step in front of the first healthy tree. The torch is close enough to warm your face.'),
                EM('Move.', 'angry'),
                Y('No.'),
                N('For a long moment nobody breathes. Then the torch drops, slowly, until it points at the grass.'),
                EM('You’d better be right. You’d better be right, or I’ll never forgive you.', 'sad'),
                N('She doesn’t leave. She helps Fern fell the three sick trees and the dead stump by hand, in the dark, without a word.'),
              ],
            },
            {
              id: 'map',
              label: 'Hand her the map. Let the evidence speak.',
              set: { 's11-dusk': 'map' },
              then: [
                N('You hold out Byte’s map. She doesn’t want to take it. She takes it.'),
                N('She reads it by her own torchlight: the line of the wind, the dead plum, the jar marked GUILTY.'),
                EM('Three. Not forty.', 'think'),
                EM('Three.', 'soft'),
                N('She pushes the torch into the water butt. It goes out with a long hiss, like a held breath.'),
                EM('Show me the stump. I’ll do the stump.', 'think'),
              ],
            },
            {
              id: 'together',
              label: 'Take the torch with her. Burn only the three sick trees, together.',
              set: { 's11-dusk': 'together' },
              then: [
                N('You put your hand on the torch, next to hers. She looks at you. Then she lets you hold it too.'),
                N('You burn the three sick trees and the dead wild plum, and nothing else.'),
                N('It takes a long time. Neither of you lets go.'),
                CL('Goodbye, trees. You were very good plums.', 'sad'),
                EM('That’s how it should’ve gone. With Ash. Not on my own. Not in a rush.', 'soft'),
                N('Fern brings out tea. Ember drinks hers standing up, watching the fire, until it’s only warm.'),
              ],
            },
          ],
        },
        done: {
          id: 's11-ladybirds',
          lines: [
            N('Clover unscrews her jar. Out pour ladybirds, hundreds of them, red as rosehips, and settle along the hedge.'),
            CL('Off you go. Every egg you can find. Be as rude as you like.', 'happy'),
            N('One lands on your thumb and won’t get off. Then three more. After a while they are, more or less, yours.'),
            BY('I tried to label them. It isn’t possible. They’re all called LADYBIRD now.', 'think'),
          ],
        },
      },
    ],
    complete: {
      id: 's11-complete',
      lines: [
        N('A week later the orchard is quiet. Three black stumps at the bottom of the slope; thirty-seven green trees above them.'),
        N('In the middle of the bare row one tree stands untouched: Grudge, the old damson, heavy with sour purple fruit.'),
        FE('Byte says the beetles hate the bark. Too bitter. Hazel used to say Grudge was too stubborn to die.', 'happy'),
        FE('She always told me to graft off it. I never did. Who wants sour plums? Here. She left this at mine.', 'soft'),
        N('A short curved knife with a plum-wood handle wound in green twine. The edge is still good.'),
        FE('Bind a cutting of Grudge to a young tree, and the young tree grows up stubborn too. Her trick. Yours now.'),
        FE('You saved my orchard. That makes you its warden, whether you like it or not.', 'happy'),
        N('Ember comes past the wall. She has found Byte’s label in her pocket. She reads VOLATILE, and looks at him.'),
        N('Byte takes it, crosses it out, and writes something else: FRIGHTENED. Then, underneath: (FAIR).'),
        EM('…Fair.', 'soft'),
      ],
    },
    rewards: [
      {
        id: 's11-grafting-knife',
        kind: 'feature',
        label: 'Hazel’s grafting knife',
        description:
          'Take a cutting from Grudge, the old damson in Fern’s orchard, and graft it onto a young fruit tree. Grafted trees never catch the blight.',
      },
      {
        id: 's11-orchard-warden',
        kind: 'title',
        label: 'Orchard Warden',
        description: 'Given by Fern for saving her orchard. Shown under your name.',
      },
      {
        id: 's11-ladybirds-reward',
        kind: 'cosmetic',
        label: 'Ladybird petpets',
        description: 'A small, rude cloud of Clover’s ladybirds that rides on your Keeper’s hat and shoulders. They are all called LADYBIRD.',
      },
    ],
    sets: { s11Done: true },
    notes:
      'FOR FUN. Sets only s11Done and the s11- choice flags (s11-first, s11-dusk). No campaign flags; no Keeper friendship ' +
      'changes are required (an implementer may add a small Ember/Fern bump if the house style allows, but nothing reads it). ' +
      'TIMING: opens any morning in chapter 5 after c5-open, so Ember’s story of Ash is known. Steps 1–3 run in one day; ' +
      's11-dusk plays straight after s11-beetle, as the light goes (fade to dusk). Step 4’s check and s11-complete can be on ' +
      'a later day (s11-complete is “a week later”: play it on the next visit to the orchard after 3+ days). If chapter 8 ' +
      'begins first, the story closes unfinished with no rewards, and the orchard is left as it was. ' +
      'ORCHARD: a new small section next door to the Grove, through the hedge gap: ~40 plum trees on a slope, a dead wild ' +
      'plum in the hedge by the stream, Grudge (a damson with purple fruit) in the bottom row, Fern’s water butt and crate. ' +
      'Wind blows upslope from the falls; show it with drifting dust and a few leaves. ' +
      'MINI-GAME s11-orchard-map: the player taps each of the 40 trees, sees a zoomed lens view (leaf, bark, fruit) and picks a ' +
      'label: FINE / PROBABLY FINE / NOT FINE / INCONCLUSIVE, SMELLS. Three trees are truly sick; six are “inconclusive” ' +
      '(wasp-bitten fruit, not blight). Wrong labels get a Byte quip, never a fail; the step clears when every tree is ' +
      'labelled. Labels stay on the trees (paper tags that flutter) until s11-complete. ' +
      'CATCH s11-carrier: a stealth catch. Grey beetles land on leaves in the bottom row; any beetle touched by the player’s ' +
      'shadow drops into the grass. The sun is fixed in the west; approach with the sun in front. One catch completes it. ' +
      'CHOICE (s11-dusk): all three routes end with the three sick trees and the dead stump gone and the rest saved. ' +
      '“stood”: felled by hand (no fire). “map”: Ember douses the torch; trees felled later. “together”: burned, with a ' +
      'small controlled fire. Show three stumps in s11-complete for every route (charred for “together”, sawn otherwise). ' +
      'GAGS: Byte’s labels (NOT FINE, PROBABLY FINE, FINE (ACCORDING TO FERN), DO NOT DRINK, INCONCLUSIVE, SMELLS, GUILTY, ' +
      'LADYBIRD, VOLATILE → FRIGHTENED (FAIR)). The VOLATILE tag is a tiny paper tag on Ember’s sleeve from s11-lens on. ' +
      'REWARDS at s11-complete. Grafting: use the knife on Grudge to take a cutting (as many as you like; no daily limit), then on any young fruit ' +
      'tree in the Grove; that tree is blight-proof. Blight itself need not exist as a system; the feature can be cosmetic ' +
      '(a small ribbon on grafted trees) unless a plant-disease system is added later.',
  },

  // ================================================================== S15
  {
    id: 's15',
    code: 'S15',
    title: 'Lucky Eggs',
    source:
      'Borderlands: the grinning villain who is sure he’s the hero, and the love of loot; Diablo: the gambling vendor (themes only)',
    audience: 'all',
    trigger: {
      where: 'The lane below the Grove gate, by the stream bridge',
      when: 'Chapter 5, a market morning after c5-open, but not the morning S5 or S11 opens. Closes before chapter 8 begins.',
    },
    speakers: [DASHWOOD, JACKPOT, PIP, KIDS],
    steps: [
      {
        id: 's15-step1',
        goal: 'Help Byte keep a tally of what comes out of thirty Mystery Eggs.',
        hint: 'Stand by the wagon. Each time a child opens an egg, mark it plain or sparkly on Byte’s card.',
        check: 'tally:eggs:s15-wagon:30',
        scene: {
          id: 's15-wagon',
          lines: [
            N('A wagon comes down the lane, striped red and cream, with a hundred little bells on the roof that ring at every pothole.'),
            N('On the box sits a man in a mustard waistcoat. On his shoulder sits a brass parrot that ticks.'),
            DA('Children of the valley! Gather! Dashwood Prance has come, and Dashwood Prance has brought you luck!', 'happy'),
            DA('Mystery Eggs! Ten Shells each! Every egg a winner! Some eggs more winner than others!', 'happy'),
            JP('MOST EGGS ARE PLAIN.'),
            DA('Thank you, Jackpot.', 'happy'),
            N('A poster unrolls down the side of the wagon in gold letters: 1 IN 3 SPARKLY! Underneath, much smaller: (approx.)'),
            N('In the window, on a velvet cushion, an egg glitters like frost on a web.'),
            N('Its card says LEGENDARY. NOT FOR SALE (YET).'),
            KD('Sparkly! Sparkly! Sparkly!', 'happy'),
            PI('I’ve got forty Shells. I’ve saved since my birthday. That’s four eggs. That’s one and a third sparkly!', 'happy'),
            N('Byte appears at your elbow with a clipboard and the face of someone who has just heard maths done wrong.'),
            BY('One in three. Says who? I want to see it happen. Thirty eggs. We count every single one.', 'think'),
          ],
          choices: [
            {
              id: 'buy',
              label: 'Buy an egg yourself. For science.',
              set: { 's15-bought': true },
              then: [
                DA('A Keeper! A person of taste! Choose with your heart!', 'happy'),
                N('You choose with your heart. It’s plain. Jackpot looks at it and says nothing, very loudly.'),
                BY('That’s one. Twenty-nine to go. Don’t look like that. It’s data.'),
              ],
            },
            {
              id: 'pip',
              label: 'Ask Pip to wait before she spends it all.',
              set: { 's15-pip': 'asked' },
              then: [
                PI('Wait? The sparkly ones might run out!', 'shock'),
                DA('They might! They very well might! That’s the magic of a limited time!', 'happy'),
                JP('THEY WILL NOT RUN OUT.'),
              ],
            },
            {
              id: 'odds',
              label: 'Ask Dashwood where his odds come from.',
              set: { 's15-asked': true },
              then: [
                DA('From the heart, friend! From the very bottom of the heart, where the best numbers live!', 'happy'),
                BY('That is not where numbers live.', 'angry'),
              ],
            },
          ],
        },
        done: {
          id: 's15-tally',
          lines: [
            N('By noon Byte’s card is full. Thirty eggs. Thirty faces, mostly falling.'),
            BY('Twenty-seven plain. Three sparkly. That isn’t one in three. That’s one in ten.', 'think'),
            BY('The poster is out by a factor of three point three recurring. I’ve underlined “recurring”. Twice.', 'angry'),
            N('Pip sits on the bridge with four plain eggs in her lap.'),
            N('She isn’t crying. She is being extremely brave at the water.'),
            PI('The plain ones are nice too. They’re warm.', 'sad'),
          ],
        },
      },
      {
        id: 's15-step2',
        goal: 'Get Jackpot on his own and ask him some questions.',
        hint: 'Dashwood naps after lunch. Creep along the stream side of the wagon, where a bell has fallen off, and don’t touch the wheels.',
        check: 'sneak:wagon:s15-jackpot',
        scene: {
          id: 's15-sneak',
          lines: [
            BY('We need a witness. Someone who’s seen the books.', 'think'),
            BY('That parrot. Every time Dashwood says something, it corrects him. I don’t think it can help it.'),
            N('After lunch the wagon goes quiet. The mustard waistcoat hangs over the step. Inside, a snore like a slow saw.'),
            N('Jackpot sits on a perch at the open window, ticking. His eyes are brass buttons; one is sewn back on with red thread.'),
            BY('The bells. Touch the wagon and they all go. Come round the stream side. There’s a gap where one fell off.', 'think'),
            N('Stepping stones lead along the stream. One wobbles. One is a frog.'),
          ],
        },
        done: {
          id: 's15-jackpot',
          lines: [
            JP('GOOD AFTERNOON. I CANNOT LIE. IT IS A FAULT IN MY SPRINGS.'),
            Y('How many eggs are sparkly, Jackpot?'),
            JP('ONE IN TEN. HE KNOWS. HE WROTE IT IN THE LEDGER IN VERY SMALL WRITING.'),
            BY('And the poster?', 'think'),
            JP('HE SAYS THE POSTER IS A POEM. I CANNOT LIE. A POEM IS NOT A NUMBER.'),
            Y('What happens to the eggs nobody buys?'),
            JP('THEY GO UP THE VALLEY. TO A MAN WHO BUYS IN BULK. HE NEVER HAGGLES. HE NEVER SMILES.'),
            N('Among the stickers on the tailboard you notice one small, neat silver square: the Circuit’s mark.'),
            JP('ALSO THE LEGENDARY EGG IS NOT LEGENDARY. I HAVE TRIED NOT TO SAY THAT. IT IS VERY UNCOMFORTABLE.'),
            N('The snoring stops. You both freeze. It starts again.'),
          ],
        },
      },
      {
        id: 's15-step3',
        goal: 'Hold the Legendary egg up to a lantern and see what’s really inside.',
        hint: 'Candling: in a dim place, a light behind an egg shows what’s growing. Try under the bridge.',
        check: 'candle:egg:s15-legendary',
        scene: {
          id: 's15-legendary',
          lines: [
            N('Dashwood wakes up exactly as charming as he went to sleep. He polishes the Legendary egg on his sleeve.'),
            DA('Admiring her? Course you are. Hold her if you like. One Shell a minute. Feel the luck soak in.', 'happy'),
            BY('Here’s three Shells. We’ll need exactly three minutes.', 'think'),
            N('Under the bridge it is dim and green and smells of watercress. Byte lights the stub of a lantern.'),
            BY('Candling. Hazel showed everybody. Light behind the egg, and you can see what’s growing.', 'think'),
            BY('A sparkly egg glows all through, like a pearl. A plain one shows a little curled shadow. This one… we’ll see.'),
          ],
        },
        done: {
          id: 's15-painted',
          lines: [
            N('The light comes through the shell, and the glitter on it throws stars all over the underside of the bridge.'),
            N('Under the glitter, the egg glows plain pink. Inside is a small curled shadow, and it’s moving.'),
            BY('Plain. It’s a plain egg, painted. There’s a thumbprint in the varnish. A big one.', 'shock'),
            BY('A healthy plain egg, mind. It’ll hatch in about a week. It just won’t be legendary. It’ll be a Nubbin.', 'soft'),
            N('Glitter comes off on your fingers. It doesn’t come off for days.'),
          ],
        },
      },
      {
        id: 's15-step4',
        goal: 'Set up an honest egg stall with Byte, and chalk up the real odds.',
        hint: 'Byte has a slate and chalk. Put the stall by the bridge (or at your gate) and write the true numbers on the board.',
        check: 'build:decor:s15-odds-board',
        scene: {
          id: 's15-verdict',
          lines: [
            N('You come back up the bank with glitter on your hands. Dashwood sees it, and his smile stays exactly where it is.'),
            N('He steers you round the back of the wagon, where the children can’t see, and sits down on the step.'),
            DA('When I was eight, a man came through my village with a wagon. Not as nice as mine.', 'soft'),
            DA('He sold me a golden egg for every Shell I had. I carried it home in my hat. I slept curled round it like a cat.', 'soft'),
            DA('It hatched brown. Brown as a boot. It had been painted.', 'think'),
            DA('And I loved that brown thing more than anything since. Best week of my life was the week before it hatched.', 'happy'),
            DA('That’s what I sell, friend. Not eggs. The week before.', 'soft'),
            JP('HE BELIEVES THIS. I CANNOT LIE. HE DOES.'),
            N('Round the front of the wagon, the children are waiting. Pip holds her four plain eggs. Byte holds the tally.'),
          ],
          choices: [
            {
              id: 'expose',
              label: 'Show everyone the tally and the painted egg.',
              set: { 's15-verdict': 'exposed' },
              then: [
                N('You climb on the wagon step and hold up the painted egg. Byte reads the tally aloud, slowly, including the recurring.'),
                KD('ONE IN TEN?', 'angry'),
                N('The roof bells ring as children kick the wheels. Dashwood’s smile finally goes, and something small looks out from behind it.'),
                DA('It was a poem. It was only ever a poem.', 'sad'),
                N('He drives off before dark. He leaves his spare trestle, a crate of eggs and the parrot, who refuses to get on.'),
                JP('I CANNOT LIE. I DID NOT WANT TO GO.'),
              ],
            },
            {
              id: 'refund',
              label: 'Make him post the true odds and give the children their Shells back.',
              set: { 's15-verdict': 'refunded' },
              then: [
                DA('Refunds? Refunds! Do you know what that does to a man’s margins?', 'shock'),
                JP('HIS MARGINS ARE ENORMOUS.'),
                N('Dashwood counts Shells back into small hands, one by one. He does it with a flourish, because he can’t help that either.'),
                N('He paints out the 3 on his poster and paints in a 10. Then, after a long look, he adds: STILL WORTH IT.'),
                PI('I’m keeping one egg. I want to see what comes out. I don’t mind if it’s plain.', 'happy'),
                N('He leaves the valley the next morning with a lighter crate. The parrot stays, by mutual and very honest agreement.'),
              ],
            },
            {
              id: 'buy',
              label: 'Buy his wagon, and run an honest stall yourself.',
              set: { 's15-verdict': 'bought' },
              then: [
                DA('Buy her? Buy Marigold? You don’t buy a wagon, friend. You marry it.', 'shock'),
                DA('…How much were you thinking?', 'think'),
                N('It takes most of an afternoon and most of your Shells. Byte negotiates. Byte enjoys it far too much.'),
                DA('Paint the stripes once a year. She likes a polish. And never, ever let her near a goat.', 'sad'),
                N('He walks off down the lane with his hands in his pockets, whistling, lighter than he came.'),
              ],
            },
          ],
        },
        done: {
          id: 's15-odds-board',
          lines: [
            N('Byte nails up a slate and chalks it in big, honest numbers: PLAIN 9 IN 10. SPARKLY 1 IN 10. LEGENDARY: NO.'),
            N('Underneath, smaller: ALL OF THEM ARE WARM.'),
            PI('Those are worse odds. Why do I like it better?', 'think'),
            BY('Because you know where you are. Knowing where you are is the second-best feeling there is. After winning.', 'happy'),
            N('The children queue anyway. Some buy. Some just come to read the board.'),
          ],
        },
      },
    ],
    complete: {
      id: 's15-complete',
      lines: [
        N('The last egg in the crate is wrapped in a red spotted handkerchief.'),
        N('You unwrap it. It glows all through, like a pearl in a lamp.'),
        JP('THAT ONE IS REAL. I CANNOT LIE. I CHECKED. I CHECKED TWICE.'),
        N('Tucked in the knot is a card in loopy gold handwriting.'),
        N('“For the Keeper. Every egg a winner. This one actually. —D.P.”'),
        BY('Statistically, that’s the only certain thing he ever sold.', 'soft'),
        N('Jackpot hops onto your shoulder. He ticks. He weighs about as much as a teapot.'),
        JP('I WOULD LIKE TO LIVE WITH YOU. I CANNOT LIE. I HAVE WANTED TO SAY THAT FOR A WHILE.'),
        N('Dashwood pressed the painted egg into Pip’s hands on his way out.'),
        N('Pip carries the painted egg home in her hat. A week later it hatches, brown as a boot.'),
        N('She loves it beyond all reason.'),
      ],
    },
    rewards: [
      {
        id: 's15-honest-stall',
        kind: 'feature',
        label: 'Honest egg stall with an Odds Board',
        description:
          'An egg stall at your gate that sells at fair prices. Its Odds Board shows the real chance of every kind of egg, worked out by Byte and updated as the stock changes.',
      },
      {
        id: 's15-sparkly-egg',
        kind: 'item',
        label: 'A real sparkly egg',
        description: 'The last egg in Dashwood’s crate, wrapped in his red spotted handkerchief. It glows all through. Jackpot checked twice.',
      },
      {
        id: 's15-jackpot-reward',
        kind: 'cosmetic',
        label: 'Jackpot',
        description: 'A ticking brass parrot petpet who rides on your shoulder and cannot lie. Now and then he corrects your Keeper.',
      },
    ],
    sets: { s15Done: true },
    notes:
      'FOR FUN. Sets only s15Done and the s15- choice flags (s15-bought, s15-pip, s15-asked, s15-verdict). No campaign flags. ' +
      'TIMING: opens on a market morning in chapter 5 after c5-open; steps 1–3 run in one day (morning, after lunch, afternoon). ' +
      's15-verdict plays straight after s15-painted. Step 4 and s15-complete follow the same evening or the next day. If ' +
      'chapter 8 begins first, the story closes unfinished with no rewards and the wagon is gone. ' +
      'STAGING: a striped red-and-cream wagon (“Marigold”) by the stream bridge on the lane below the Grove gate, roof lined ' +
      'with little bells (bell SFX on movement and contact), a gold “1 IN 3 SPARKLY! (approx.)” poster, the Legendary egg on ' +
      'a velvet cushion in the window, and a small silver Circuit sticker on the tailboard (a hint only; nobody comments on it). ' +
      'Jackpot is a brass parrot (ticking SFX); his lines are always in capitals. Pip is about seven; “kids” is a chorus of ' +
      'the valley’s children. Dashwood is never cruel and never a cartoon villain: he believes what he says. ' +
      'TALLY tally:eggs:s15-wagon:30: a light collect mini-game. Children open eggs one at a time; the player taps PLAIN or ' +
      'SPARKLY on Byte’s card. The sequence is fixed: 27 plain, 3 sparkly (eggs 8, 19 and 27). Misses are re-shown. If the ' +
      'player chose “buy”, deduct 10 Shells and count their egg as #1 (plain). ' +
      'SNEAK sneak:wagon:s15-jackpot: approach the sleeping wagon along the stream stepping stones (one wobbles, one is a ' +
      'frog that hops away); touching the wagon rings the bells, Dashwood snorts, and the player is reset to the bridge. ' +
      'CANDLE candle:egg:s15-legendary: costs 3 Shells (Byte pays if the player has none). Under the bridge, hold the egg ' +
      'between the lantern and the camera; slowly turn it to reveal the plain glow and the moving shadow. ' +
      'CHOICE s15-verdict: “exposed” and “refunded” are always shown. “bought” is shown only if the player has 150+ Shells, ' +
      'and costs 150. In every route the stall ends up the player’s: “exposed” → Dashwood’s spare trestle; “refunded” → ' +
      'Byte builds a plain trestle; “bought” → the striped wagon itself is the stall (cosmetic variant). Jackpot stays in ' +
      'every route, and Dashwood leaves the real sparkly egg in every route. Pip ends up with the painted egg in every ' +
      'route: Dashwood presses it into her hands on his way out, as s15-complete says (it hatches off-screen into an ' +
      'ordinary brown Nubbin; she is a valley child, not a Keeper). ' +
      'REWARDS at s15-complete. The Odds Board shows true per-egg odds for the stall’s stock (e.g. plain 90%, sparkly 10%).',
  },

  // ================================================================== S16
  {
    id: 's16',
    code: 'S16',
    title: 'The Workyard',
    source: 'Palworld: cheerful creature labour, base-building and the uncomfortable question underneath (themes only)',
    audience: 'all',
    trigger: {
      where: 'The Grove gate, then Brisk Hollins’s sawmill upriver',
      when: 'Chapter 6, any day after c6-close, once the rain has passed. Closes before chapter 9 begins.',
    },
    speakers: [BRISK],
    steps: [
      {
        id: 's16-step1',
        goal: 'Go upriver with Sparks and Clover and see the Workyard.',
        hint: 'Follow the river path north past the stepping stones. You’ll hear the saws long before you see the sheds.',
        check: 'visit:place:s16-workyard',
        scene: {
          id: 's16-sparks',
          lines: [
            N('Sparks turns up with a coil of wire over each shoulder, like a very small, very loud pirate electrician.'),
            SP('Job upriver! A big one! A sawmill wants lights in every shed, and I need someone to hold the ladder and say “wow”.', 'happy'),
            SP('Owner’s called Brisk Hollins. Nice man. Very nice. Suspiciously cheerful. I’ve brought Clover. She’s good with ladders.'),
            CL('I’m not good with ladders. I’m good at not falling off them. It’s different.', 'think'),
            N('The river path is soft after the rain. Somewhere ahead the saws are going: a bright, busy whine, like wasps in a jar.'),
            SP('He says his Nubbins love it there. Love it! He wrote it in his letter twice and underlined it both times.'),
            CL('Twice is a lot of underlining.', 'think'),
          ],
        },
        done: {
          id: 's16-yard',
          lines: [
            N('The Workyard opens out at a bend in the river: sheds, log piles, a waterwheel that isn’t turning, and Nubbins. Dozens.'),
            N('Each one wears a tiny hard hat made from half a walnut shell, painted yellow. They chop, they stack, they haul.'),
            N('Over the gate a banner says WORK IS PLAY! In the middle of the yard, three Nubbins run inside a big wooden wheel.'),
            N('Wires run from the wheel to every shed. Every bulb in the yard flickers in time with their feet.'),
            BK('Welcome! Brisk Hollins. Pleased as punch. Output’s up nine per cent this month. I’m no Circuit man, mind. Mine get Sundays.', 'happy'),
            N('A big Power Nubbin trundles past with a log three times his size on his back, humming. His hat says LUG in pencil.'),
            BK('That’s Lug. Best worker I’ve got. Can’t stop him. Tried once. He sulked for a week.', 'happy'),
            N('Behind the log pile, out of the sun, sit five Nubbins whose colours have worn grey at the edges, like a flag left out all summer.'),
            CL('Those ones are tired. Not lazy. Tired.', 'soft'),
          ],
        },
      },
      {
        id: 's16-step2',
        goal: 'Shadow the Workyard’s Nubbins for a day. Write down what each one does when nobody’s asking.',
        hint: 'Stay out of sight behind the log piles and sheds. If a Nubbin sees you, it starts working to be polite, and that note doesn’t count.',
        check: 'minigame:clear:s16-shadow-day',
        scene: {
          id: 's16-shadow',
          lines: [
            BK('Tired? Nonsense! Look at the chart!', 'happy'),
            N('He unrolls a chart. A red line climbs so steeply it runs off the paper and carries on, in pencil, across the table.'),
            CL('That chart is about logs. I’m asking about them.', 'think'),
            BK('Same thing! Happy Nubbins, happy logs. The logs are very happy.', 'happy'),
            SP('Brisk. When nobody’s telling them what to do, what do they do?', 'think'),
            N('Brisk opens his mouth to answer. He shuts it again. He has clearly never once wondered.'),
            BK('…Well. Good question. Splendid question. Find out! Have a clipboard. I’ve got forty.', 'think'),
            CL('Watch from where they can’t see you. If they know they’re watched, they’ll work to be polite. Nubbins are like that.', 'soft'),
          ],
          choices: [
            {
              id: 'lug',
              label: 'Start with Lug.',
              set: { 's16-first': 'lug' },
              then: [N('Lug puts down a log, sees you, and at once picks up a bigger one, to show you. You will need to be sneakier.')],
            },
            {
              id: 'tired',
              label: 'Start with the tired ones behind the log pile.',
              set: { 's16-first': 'tired' },
              then: [CL('Good. Start with the ones nobody’s counting.', 'soft')],
            },
            {
              id: 'wheel',
              label: 'Start with the wheel.',
              set: { 's16-first': 'wheel' },
              then: [SP('The wheel. Yeah. That thing’s bothered me since we walked in. It’s wired backwards, for a start.', 'angry')],
            },
          ],
        },
        done: {
          id: 's16-notes',
          lines: [
            N('By sundown your clipboard is full of small handwriting and one large sawdust thumbprint.'),
            N('The choppers chop on their breaks too. They like the thunk.'),
            N('One chops the same stump all day, very happily, for no reason.'),
            N('The wheel runners step out the moment Brisk turns his back, and sit under the bench with their eyes shut.'),
            N('The five tired ones never once choose work. They lie in a patch of sun and watch the river go by.'),
            N('And Lug, on his breaks, carries offcuts. Not to the stack. Out to the bank, behind the reeds, one at a time.'),
            N('You follow him. In the reeds stands a little lean-to of planks and bark, roofed with moss.'),
            N('The five tired ones are asleep inside.'),
            CL('He built them a house.', 'shock'),
            SP('Nobody asked him to. He just… did.', 'soft'),
          ],
        },
      },
      {
        id: 's16-step3',
        goal: 'Build a Fair Roster with Brisk: jobs by liking, rests, fruit breaks, a bell, and no more wheel.',
        hint: 'Put each Nubbin’s card under the job it chose when nobody was asking. Hold Sparks’s ladder while she moves the lights to the waterwheel.',
        check: 'build:decor:s16-fair-roster',
        scene: {
          id: 's16-roster',
          lines: [
            N('You show Brisk the clipboard, and then the lean-to in the reeds. He stands in the wet grass a long time.'),
            BK('I thought they loved it. They looked like they loved it. They were always so busy.', 'sad'),
            BK('…Busy isn’t the same thing, is it.', 'think'),
            N('He takes down WORK IS PLAY! and puts up a new banner: WORK IS… OFTEN PLAY!'),
            SP('That’s worse.', 'think'),
            BK('I know. I’m working on it.', 'sad'),
            SP('Right. That wheel’s coming off the wires. Your lights go on the waterwheel. Like a normal person’s.', 'happy'),
            CL('And every Nubbin gets a card, under the job it picked. And breaks. With fruit.', 'soft'),
            BK('And the ones who don’t want a job at all? What then? What’s a yard for?', 'shock'),
            N('Nobody answers. Brisk puts up another banner. REST IS A KIND OF WORK?? It has two question marks.'),
          ],
        },
        done: {
          id: 's16-bell',
          lines: [
            N('By evening the Fair Roster hangs by the gate: a board of little painted cards, one for every Nubbin, under the job it chose.'),
            N('Beside it hangs a small brass bell, low enough for the smallest Nubbin to reach. Clover has painted on it: NO THANK YOU.'),
            N('The big wheel stands still. Sparks has hung a sign on it: RETIRED. A Nubbin is already asleep inside it.'),
            N('A wheel runner waddles to the bell, looks round at everyone, and rings it. Once. Very softly.'),
            N('Then it goes and sits in the sun. Nobody stops it. It looks astonished.'),
            BK('Well, I’ll be. I’ll be. Output’s going to be awful.', 'happy'),
          ],
        },
      },
      {
        id: 's16-step4',
        goal: 'Go back to the Workyard in a week and see how the Fair Roster is holding up.',
        hint: 'Any day from a week on. Follow the river path north; Brisk will have the kettle on.',
        check: 'visit:place:s16-workyard-week',
        scene: {
          id: 's16-question',
          lines: [
            N('Brisk walks you to the river path.'),
            N('His hands are in his pockets, and he has a new slogan in his head. You can tell.'),
            BK('Can I ask you something, Keeper? Honestly? Your lot at the Grove. They fetch you things, don’t they?', 'think'),
            BK('Apples. Sticks. Do you ask them? Or do they just do it, because you’re the one who feeds them?', 'think'),
            N('You think of your Nubbins dragging fallen apples to your door, and how pleased they look, and how pleased you look back.'),
            Y('I don’t know.'),
            BK('No. Me neither. That’s the trouble with being liked. You never find out what they’d do if they didn’t.', 'sad'),
            BK('Now. The five in the reeds. They don’t want to work. Not a bit. What do I do with them?', 'think'),
          ],
          choices: [
            {
              id: 'grove',
              label: 'Send them to the Grove. They can rest with you.',
              set: { 's16-tired': 'grove' },
              then: [
                BK('…Yes. Yes, that’s kind. Lug will want to visit. Lug will want to carry them there.', 'soft'),
                N('Lug, who has been listening, is already lifting the whole lean-to off the ground, with them inside it.'),
              ],
            },
            {
              id: 'morale',
              label: 'Keep them on, as “morale officers”.',
              set: { 's16-tired': 'morale' },
              then: [
                BK('Morale officers! Officially in charge of sitting in the sun and being lovely. Yes!', 'happy'),
                CL('They’ll be the best in the yard at it. Leave them where Lug can see them.', 'soft'),
                SP('Are we sure that isn’t just a job with a nicer hat?', 'think'),
              ],
            },
            {
              id: 'wild',
              label: 'Let them go wild, up the river.',
              set: { 's16-tired': 'wild' },
              then: [
                BK('Wild? Out there? Who’ll feed them? Who’ll—', 'shock'),
                CL('Themselves, maybe. Some Nubbins are happiest belonging to nobody.', 'soft'),
                N('Brisk looks up the river a long while. He doesn’t like it. He doesn’t say no.'),
              ],
            },
          ],
        },
        done: {
          id: 's16-week',
          lines: [
            N('A week later the Workyard is louder, and slower.'),
            N('The saws stop for fruit at eleven and at three. Somebody has hung a hammock.'),
            N('Brisk’s banner has been through several drafts. You can read them all, crossed out, one under the other:'),
            N('WORK IS PLAY! · WORK IS… OFTEN PLAY! · REST IS A KIND OF WORK?? · ASK FIRST.'),
            BK('Output’s down eleven per cent. Lights stay on, mind. The waterwheel’s steadier than three tired Nubbins. Who knew?', 'happy'),
            SP('I knew. I said. I said it loudly.', 'happy'),
            N('Lug trundles past with a log on his back, humming. Nobody asked him. He just likes it.'),
          ],
        },
      },
    ],
    complete: {
      id: 's16-complete',
      lines: [
        BK('Here. Can’t have a Keeper on my yard without a hat. Regulations. My regulations. New ones.', 'happy'),
        N('A yellow hard hat in your size, painted to match the walnut-shell ones. Lug’s pencil writing on the brim says KEEPER.'),
        BK('And take a copy of the roster. Try it at the Grove. Let them pick their jobs, and see what they pick.', 'soft'),
        CL('And see what they don’t. That’s just as worth knowing.', 'soft'),
        N('Back home you nail the Fair Roster by the cottage door. By morning, three Nubbins have pushed their cards under jobs.'),
        N('One has chosen watering. One has chosen fetching apples.'),
        N('One has pushed its card under “sitting with Moss”, and won’t be moved.'),
        SP('That last one isn’t a job.', 'think'),
        CL('It is to Moss.', 'happy'),
      ],
    },
    rewards: [
      {
        id: 's16-nubbin-jobs',
        kind: 'feature',
        label: 'Nubbin Jobs',
        description:
          'Your Nubbins volunteer for the garden jobs they enjoy (watering, fetching, digging, keeping someone company) and only those. A Nubbin never does a job it didn’t pick.',
      },
      {
        id: 's16-hard-hat',
        kind: 'cosmetic',
        label: 'Workyard hard hat',
        description: 'A yellow hard hat with KEEPER on the brim in Lug’s pencil. Your Nubbins can wear walnut-shell ones to match.',
      },
      {
        id: 's16-fair-roster',
        kind: 'decor',
        label: 'The Fair Roster board',
        description: 'A board of painted job cards with a little brass NO THANK YOU bell. Your Nubbins put their own cards under the jobs they like.',
      },
    ],
    sets: { s16Done: true },
    notes:
      'FOR FUN. Sets only s16Done and the s16- choice flags (s16-first, s16-tired). No campaign flags. Mirrors Corvin’s ' +
      'Circuit only lightly (Brisk’s “I’m no Circuit man” line); nothing about the shard or the Stillness. The “grey at the ' +
      'edges” Nubbins are tired, not Shadow: draw them as faded, not grey-scarred, and never call them “greys”. ' +
      'TIMING: opens after c6-close (after Fossil’s farewell, so the tone isn’t trampled). Steps 1–3 can run on one or two ' +
      'days; s16-question plays straight after s16-bell. Step 4 needs 7+ in-game days after s16-question. If chapter 9 begins ' +
      'first, the story closes unfinished with no rewards. ' +
      'WORKYARD: a new small map section upriver (river path north past the stepping stones): sheds, log piles, a waterwheel, ' +
      'a big wooden treadwheel, a gate with a banner (the banner text changes by step: WORK IS PLAY! → WORK IS… OFTEN PLAY! → ' +
      'REST IS A KIND OF WORK?? → ASK FIRST.), and reeds on the bank where Lug’s lean-to stands. Lug is a Power Nubbin and ' +
      'never speaks; he hums (SFX). Workyard Nubbins wear walnut-shell hard hats painted yellow. ' +
      'MINI-GAME s16-shadow-day: a stealth observation game over one compressed day (about 4 minutes). Eight Nubbins wander ' +
      'between jobs and rest spots. Stay out of their sight cones behind cover; a Nubbin observed unseen for 5 seconds ' +
      'logs its free choice on the clipboard (chopper ×2: chops; stacker: stacks; wheel runner ×2: hides under the bench; ' +
      'tired ×2: sun patch; Lug: carries offcuts to the reeds). Being seen makes that Nubbin “work politely” and restarts its ' +
      'timer; no fail state. Once all eight are logged, Lug walks to the reeds and the player follows (the lean-to reveal). ' +
      'BUILD s16-fair-roster: drag each card under a job (CHOP, STACK, HAUL, FRUIT RUN, REST); any placement that matches the ' +
      'clipboard is accepted; then hold the ladder (a tap-and-hold) while Sparks rewires the lights to the waterwheel. ' +
      'CHOICE s16-tired: “grove” adds the five tired Nubbins to the Grove as strays who never take jobs (they nap by the pond); ' +
      '“morale” leaves them at the Workyard in hammocks; “wild” sends them up the river (seen once more, far off, in the ' +
      'week-later visit). None of these touches campaign flags. ' +
      'REWARDS at s16-complete. Nubbin Jobs: from then on, each Grove Nubbin may pick one job card on the Fair Roster by its ' +
      'personality and likes; it does only that job, on its own schedule, and never one it didn’t pick. “Keeping someone ' +
      'company” is a valid job (a Nubbin sits near Moss or a chosen Keeper).',
  },
];

export const CHECKS: string[] = [
  // S11
  'inspect:tree:s11-sick-plums',
  'minigame:clear:s11-orchard-map',
  'catch:bug:s11-carrier',
  'release:ladybirds:s11-orchard',
  // S15
  'tally:eggs:s15-wagon:30',
  'sneak:wagon:s15-jackpot',
  'candle:egg:s15-legendary',
  'build:decor:s15-odds-board',
  // S16
  'visit:place:s16-workyard',
  'minigame:clear:s16-shadow-day',
  'build:decor:s16-fair-roster',
  'visit:place:s16-workyard-week',
];
