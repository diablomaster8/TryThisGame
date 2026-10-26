/**
 * Pixel's Arcade, cartridge PA1: The Chao Altar (Part M, rank 14). Eighteen quests, PA1-1 to PA1-18.
 *
 * SOURCE. Sonic Adventure (Sonic Team; Sega Dreamcast, Japan, 23 December 1998): the Chao Garden at
 * Station Square, Chaos, Tikal and Pachacamac, the Egg Carrier, Gamma, Big and Froggy, Perfect Chaos.
 * RIGHTS. Sonic Adventure, its characters, places and the Chao are (c) and TM Sega. Every line here is
 * new: the two prayer lines once lifted are paraphrased (LIFTED TEXT). The Sega licence is approved (Maor,
 * 2026-10-17). Speaker names are Sega's, recorded in `basedOn`.
 *
 * AUDIENCE. 'all' (canon 29: Arcade cartridges are for all ages; Maor, 2026-10-17). Each lifted line
 * has a `childLines` replacement, and the Learning Grove versions are edu-pa1-sprout.ts and
 * edu-pa1-reader.ts.
 *
 * FRAME. Pixel's Arcade (docs/more-stories.md, "Pixel's Arcade (the frame)"). After chapter 5 Pixel
 * has the Workyard cabinet running in the lantern shed. You slot the cartridge in and step through
 * with your Nubbin; Pixel (she/her) stays at the controls as player two and talks through the
 * speaker. Tikal's rosy light carries you between the present and the past. You are a visitor, never
 * Sonic: you carry Chao, hand Tails a spanner, hunt shards with Knuckles, hide a bird with Amy, fish
 * with Big and watch the old days with Tikal. Sonic and his friends keep their story. Your Nubbin
 * gets on with the Chao at once, like a cousin. Nubbins, Chao, Chaos, Froggy and the birds never
 * speak; Gamma is a robot and speaks as Sega wrote him, in our words.
 *
 * GROVE FLAGS READ (read-only; a cartridge never writes a Grove flag):
 *   - s21Done: Clank sits on top of the cabinet. PA1_VARIANTS 'pa1-01-shed-done-clank' replaces
 *     pa1-01-shed-done (its lines, then Clank's), and 'pa1-11-garden-done-clank' replaces pa1-11-garden-done (the face parachute).
 *   - cinder (S19: 'forgiven' | 'remembered'; unset otherwise). PA1-18, step 2's done scene:
 *       unset: pa1-18-rhyme (Pixel hums the tune of Cinder's rhyme without the words, and stops
 *         before the last line).
 *       forgiven: PA1_VARIANTS 'pa1-18-cinder-forgiven' replaces pa1-18-rhyme. You tell Tikal about
 *         a fierce one at home who was forgiven, and she smiles.
 *       remembered: 'pa1-18-cinder-remembered' replaces pa1-18-rhyme. "We remember ours", and your
 *         Nubbin gives a Chao a red petal.
 *
 * FLAGS WRITTEN (the cartridge's own save only, all prefixed pa1-):
 *   - pa1-01 … pa1-18: each quest on completion. pa1-done: the whole cartridge (PA1-18), counted by
 *     the frame for High Score Night (any two of PA1–PA5).
 *   - pa1-gate = locked | open (PA1-2, pa1-02-gate): the signature choice. It pays off fifteen
 *     quests later in PA1-17 (open: base pa1-17-chao; locked: PA1_VARIANTS pa1-17-chao-locked, with
 *     Pixel's "Safe isn't the same as well, is it.") and in the last image of PA1-18.
 *   - pa1-stood = true | false (PA1-10, pa1-10-stand): standing beside Tikal. It changes nothing in
 *     PA1-10. True plays PA1_VARIANTS pa1-18-stood (her one more line) and picks the last image.
 *   - Last image: after pa1-18-complete play exactly one of pa1-18-last-open-stood,
 *     pa1-18-last-open, pa1-18-last-locked-stood, pa1-18-last-locked.
 *
 * LIFTED TEXT. None. Part M listed two lines of Tikal's prayer to quote; they could not be
 * checked against the game's English script (the only wording to hand was a fan wiki's), so on
 * 2026-10-18 both became paraphrases in our own words: pa1-07-prayer#3 ("all seven serve") and
 * pa1-13-charge#6 ("a kind heart makes them stronger"). No prayer line, game dialogue,
 * catchphrase or song is quoted.
 *
 * CARE NOTES.
 *   - Chaos is never called evil, in any line: it is grief. Tikal says so in PA1-14.
 *   - The clan's destruction (PA1-13) is offscreen: the light carries you out, and it is heard and
 *     not seen, as firelight and silence. Gamma's end (PA1-12) is offscreen: the last thing is a
 *     bird flying free. Perfect Chaos's flood (PA1-15) is spectacle; nobody is shown drowning, and
 *     every rooftop count comes out whole.
 *   - "Tikal" is a real Maya city and "Pachacamac" a real Andean deity and site. They are used only
 *     as Sega uses them, as names. No further real sacred material: the prayer is the game's, the
 *     clan's dress is the game's, and the murals show only the game's own story.
 *   - The police never shoot on screen (PA1-3): warnings, and things thrown that pass through.
 *   - Pixel is she/her throughout, and never comes in. Clank is he/him (S21).
 */
import type { Line, Mood, Scene } from '../config/story';
import type { Quest, Speaker } from './types';

// ------------------------------------------------------------------ helpers

const say =
  (who: string) =>
  (text: string, mood?: Mood): Line =>
    mood ? { who, text, mood } : { who, text };

/** A source character. */
const sp = (id: string, name: string, basedOn: string): Speaker => ({ id, name, kind: 'other', basedOn });

const WHERE = 'Pixel’s arcade cabinet, the lantern shed: The Chao Altar (Pixel’s Arcade)';
const after = (code: string) => `Any time after ${code}, from Pixel’s cabinet.`;
const SRC = 'Sonic Adventure (Sonic Team, Sega, 1998)';

// ------------------------------------------------------------------ speakers

const sTikal = sp('pa1-tikal', 'Tikal', 'Tikal the echidna (Sonic Adventure, Sega, 1998)');
const sSonic = sp('pa1-sonic', 'Sonic', 'Sonic the Hedgehog (Sonic Adventure, Sega, 1998)');
const sTails = sp('pa1-tails', 'Tails', 'Miles “Tails” Prower (Sonic Adventure, Sega, 1998)');
const sKnuckles = sp('pa1-knuckles', 'Knuckles', 'Knuckles the Echidna (Sonic Adventure, Sega, 1998)');
const sAmy = sp('pa1-amy', 'Amy', 'Amy Rose (Sonic Adventure, Sega, 1998)');
const sBig = sp('pa1-big', 'Big', 'Big the Cat (Sonic Adventure, Sega, 1998)');
const sGamma = sp('pa1-gamma', 'E-102 Gamma', 'E-102 Gamma (Sonic Adventure, Sega, 1998)');
const sEggman = sp('pa1-eggman', 'Dr. Eggman', 'Dr. Eggman, Dr. Ivo Robotnik (Sonic Adventure, Sega, 1998)');
const sPacha = sp('pa1-pachacamac', 'Pachacamac', 'Pachacamac, chief of the echidna clan (Sonic Adventure, Sega, 1998)');
const sOfficer = sp('pa1-officer', 'Police Officer', 'The Station Square police (Sonic Adventure, Sega, 1998)');
const sRadio = sp('pa1-radio', 'Radio', 'A news broadcast at the hotel front desk; original');
/** The same Clank as S21 (side-stories-new-4.ts); shared id. Only with s21Done. */
const sClank = sp('clank', 'Clank', 'Claptrap, the CL4P-TP unit (Borderlands), reference only');

const N = say('narrator');
const Y = say('you');
const PX = say('pixel');
const CK = say('clank');
const TI = say('pa1-tikal');
const SO = say('pa1-sonic');
const TA = say('pa1-tails');
const KN = say('pa1-knuckles');
const AM = say('pa1-amy');
const BI = say('pa1-big');
const GA = say('pa1-gamma');
const EG = say('pa1-eggman');
const PA = say('pa1-pachacamac');
const OF = say('pa1-officer');
const RA = say('pa1-radio');

// ================================================================== THE CHAO ALTAR

export const ARCADE_PA1: Quest[] = [
  // ---------------------------------------------------------------- PA1-1
  {
    id: 'pa1-01',
    code: 'PA1-1',
    title: 'The Cabinet',
    source: `${SRC}: the frame`,
    audience: 'all',
    trigger: {
      where: WHERE,
      when: 'After chapter 5, once Pixel has the Workyard cabinet running in the lantern shed. With s21Done, Clank sits on top.',
    },
    speakers: [sClank],
    steps: [
      {
        id: 'pa1-01-s1',
        goal: 'Look over the old cabinet Pixel has set up in the lantern shed.',
        hint: 'It’s against the back wall of the lantern shed. Mind the coin slot.',
        check: 'inspect:pa1-cabinet:lantern-shed',
        scene: {
          id: 'pa1-01-shed',
          lines: [
            N('The lantern shed smells of sawdust and warm dust. The old cabinet from the Workyard skip stands against the back wall, humming.'),
            N('It has a dent the shape of a boot in one side. Someone has painted over the name, badly.'),
            PX('Don’t touch the coin slot. There was a mouse family in it. They’ve moved to the bottom drawer and they’re very happy.', 'happy'),
            PX('Three days. One new fuse, four wires, and a part I traded Byte for a jar of Clover’s honey.'),
            PX('He thinks he got the better deal. He didn’t.', 'think'),
            N('Pixel lifts a flap under the screen. Inside sit five chunky cartridges in a row, each in a faded sleeve.'),
            PX('Each one’s a whole world. Not a picture of one. A world. You go in, and I stay out here and play player two.'),
            PX('This one first. Look at the label.'),
            N('The sleeve shows a garden: a pool, a palm tree, and small round creatures with a ball floating over each head.'),
            N('Your Nubbin presses its face to the sleeve and goes very still.'),
          ],
          choices: [
            {
              id: 'cousins',
              label: 'They look like our Nubbins.',
              then: [PX('Don’t they? Like cousins. Like somebody else’s family photos, with your nose in them.', 'soft')],
            },
            {
              id: 'safe',
              label: 'Is it safe in there?',
              then: [
                PX('Safe as a game. You can’t get hurt. You can get your feet wet.'),
                PX('And I’ll be right here. I’ll talk to you through the speaker the whole time.'),
              ],
            },
            {
              id: 'old',
              label: 'How old is this thing?',
              then: [PX('The label’s too faded to read the year. Old, anyway. Older than the sawmill roof.', 'think')],
            },
          ],
        },
        done: {
          id: 'pa1-01-shed-done',
          lines: [
            N('Pixel blows the dust off the cartridge in one long puff and wipes the contacts on her sleeve.'),
            PX('Clean contacts, happy cartridge. Everyone knows that. Nobody knows why.'),
          ],
        },
      },
      {
        id: 'pa1-01-s2',
        goal: 'Slot the cartridge into the cabinet and step through.',
        hint: 'Push the cartridge into the slot under the screen, then step up onto the footplate.',
        check: 'place:pa1-cartridge:cabinet',
        scene: {
          id: 'pa1-01-slot',
          lines: [
            N('The cartridge goes in with a clunk you feel in your teeth. The screen flickers blue, then white.'),
            N('A sound like a whole sea breathing in comes out of the speaker.'),
            PX('Okay. Okay okay okay. Player two, ready.', 'happy'),
            PX('Rules. One: I can see what you see, more or less. Two: I can’t come in. Three: if you want out, say so, and I pull the plug.'),
            PX('Gently. I pull it gently.'),
            N('The screen is a window now. Through it comes warm air, and the smell of cut grass and pool water.'),
            N('Your Nubbin looks at you, then at the window, then at you again.'),
            Y('Together, then.'),
            N('You step up onto the footplate, take your Nubbin under one arm, and lean into the light.'),
          ],
        },
        done: {
          id: 'pa1-01-slot-done',
          lines: [
            N('Behind you the shed goes small and far, like a room seen through a keyhole.'),
            PX('See you on the other side. I mean, I’ll see you. You won’t see me. You know what I mean.'),
          ],
        },
      },
    ],
    complete: {
      id: 'pa1-01-complete',
      lines: [
        N('You land on soft grass with the gentlest bump, as if the world was expecting you.'),
        N('There’s a pool, a palm tree, a path of stepping stones. Somewhere, a fountain.'),
        PX('You’re in! You’re in. Your hair’s gone a bit square at the edges. It suits you.', 'happy'),
        N('Your Nubbin rolls off your arm and lands sitting up, already staring at something past your knee.'),
      ],
    },
    rewards: [],
    sets: { 'pa1-01': true },
    notes:
      'FRAME: the cabinet stands in the lantern shed from the moment Pixel’s Arcade unlocks (after chapter 5). Pixel never ' +
      'enters a cartridge: every Pixel line in PA1 is through the speaker (tinny filter, a small speaker badge on her ' +
      'portrait). Stepping through: a two-second pixel-dissolve; inside, the Keeper and Nubbin get a faint square edge, the ' +
      'cartridge’s own look. CLANK (s21Done): play PA1_VARIANTS pa1-01-shed-done-clank in place of pa1-01-shed-done; from then on ' +
      'Clank is drawn sitting on top of the cabinet in every PA1 frame scene. The cartridge has its own save (canon 29).',
  },

  // ---------------------------------------------------------------- PA1-2
  {
    id: 'pa1-02',
    code: 'PA1-2',
    title: 'A Garden Like Ours',
    source: `${SRC}: the Station Square Chao Garden`,
    audience: 'all',
    trigger: { where: WHERE, when: after('PA1-1') },
    requires: ['PA1-1'],
    speakers: [sRadio],
    steps: [
      {
        id: 'pa1-02-s1',
        goal: 'Explore the Chao Garden and meet the Chao.',
        hint: 'Walk round the pool and the fruit tree. Your Nubbin will find the Chao before you do.',
        check: 'explore:pa1-chao-garden:station-square',
        scene: {
          id: 'pa1-02-garden',
          lines: [
            N('It’s a garden behind glass, tucked into the back of a big city hotel. Through the glass roof you can see towers and blue sky.'),
            N('Eggs sit in the grass like dropped sweets. Small round creatures wobble between them.'),
            N('Each one has a little ball floating over its head. When one bumps into the palm tree, its ball turns into a spiral.'),
            PX('Those are Chao. It says so on the sleeve. CHAO. One word, lots of them.'),
            N('Your Nubbin waddles straight into the middle of them, sits down, and is instantly sat on.'),
            N('The Chao that sat on it gets up, looks at it, and pats it on the head. Its ball turns into a heart.'),
            PX('Oh, they’re cousins. They are absolutely cousins.', 'happy'),
            N('A Chao offers your Nubbin half a fruit. Your Nubbin offers back a pebble, and both of them seem to think this is fair.'),
            Y('It’s like the Grove, only smaller.'),
            PX('And with a glass roof. Byte would love a glass roof. Don’t tell him I said so.'),
          ],
        },
        done: {
          id: 'pa1-02-garden-done',
          lines: [
            N('You find a watering can by the pool and fill the trough under the fruit tree.'),
            N('Three Chao come to watch you do it, very seriously, like inspectors.'),
          ],
        },
      },
      {
        id: 'pa1-02-s2',
        goal: 'Decide what to do about the garden gate.',
        hint: 'The little wooden gate is between the grass and the hotel corridor.',
        check: 'choose:pa1-gate:garden',
        scene: {
          id: 'pa1-02-gate',
          lines: [
            N('The garden door opens onto the hotel. Through it comes the sound of a radio at the front desk, turned up loud.'),
            RA('…police have closed the square. Witnesses describe a creature made of water. Please stay indoors…'),
            N('Sirens, far off. The Chao don’t mind, because they don’t know what sirens are.'),
            PX('Hmm. That’s new. The sleeve didn’t say anything about water creatures.', 'think'),
            N('The garden has a gate of its own, a low wooden one with a latch and a key, between the grass and the hotel corridor.'),
            PX('You could lock it. Nothing gets in, nothing gets out. Or leave it, and they can wander, like ours do.'),
            PX('I don’t know which. I’m player two. You’re the one standing there.'),
            N('A Chao is sitting on the latch, swinging its feet.'),
          ],
          choices: [
            {
              id: 'lock',
              label: 'Lock the gate. Keep them safe inside.',
              set: { 'pa1-gate': 'locked' },
              then: [
                N('You lift the Chao off the latch and turn the key. It clicks, small and firm.'),
                PX('Safe and sound. Good. That’s one thing sorted.'),
              ],
            },
            {
              id: 'open',
              label: 'Leave it open. Let them come and go.',
              set: { 'pa1-gate': 'open' },
              then: [
                N('You prop the gate with a stone. The Chao on the latch rides it all the way open, delighted.'),
                PX('Free-range Chao. Like ours. All right.'),
              ],
            },
          ],
        },
        done: {
          id: 'pa1-02-gate-done',
          lines: [N('The sirens move off toward the square. Your Nubbin is the last to leave the pool, and it looks back twice.')],
        },
      },
    ],
    complete: {
      id: 'pa1-02-complete',
      lines: [
        N('The radio at the front desk is still talking. The man behind the desk turns it up, then down, then up again.'),
        PX('Let’s go and look. Just look. From a sensible distance.'),
        PX('I’m saying “sensible” now so that later I can say I said it.', 'think'),
      ],
    },
    rewards: [],
    sets: { 'pa1-02': true },
    notes:
      'SIGNATURE CHOICE: pa1-gate = locked | open (pa1-02-gate). It pays off fifteen quests later, in PA1-17 (locked plays ' +
      'PA1_VARIANTS pa1-17-chao-locked) and in PA1-18’s last image. The gate stays as chosen in the garden art until PA1-17. ' +
      'Neither option is wrong on its face; locking is the careful choice, and the line never scolds it. ' +
      'The Chao use emote balls exactly like the Grove’s (plain, heart, spiral, exclamation, question), drawn in the ' +
      'cartridge’s own palette. The radio is a voice only (speaker pa1-radio).',
  },

  // ---------------------------------------------------------------- PA1-3
  {
    id: 'pa1-03',
    code: 'PA1-3',
    title: 'The Water Creature',
    source: `${SRC}: Chaos 0 in Station Square`,
    audience: 'all',
    trigger: { where: WHERE, when: after('PA1-2') },
    requires: ['PA1-2'],
    speakers: [sOfficer, sSonic],
    steps: [
      {
        id: 'pa1-03-s1',
        goal: 'Go to Station Square and see what the police are surrounding.',
        hint: 'Out through the hotel lobby and across the plaza to the police tape.',
        check: 'walk:pa1-square:police-line',
        scene: {
          id: 'pa1-03-square',
          lines: [
            N('Station Square is all bright glass and fountains. Today it is also police tape, and a crowd held back behind it.'),
            N('Officers crouch behind their cars. In the middle of the square something stands in a puddle that wasn’t there this morning.'),
            N('It’s made of water, clear water, roughly the shape of a person. There’s a green glow where a heart should be.'),
            OF('Stay back, please. Back behind the line. That means you too, and your… whatever that is.'),
            N('Your Nubbin stays back. It is holding the hem of your shirt in both hands.'),
            PX('Oh. Look at its head. Look at the shape of its head.', 'shock'),
            N('The top of the creature’s head curls up and over, just like the Chao’s heads. Just like your Nubbin’s.'),
            N('The officers shout warnings. Whatever they throw at it goes straight through, like pebbles into a pond.'),
          ],
        },
        done: {
          id: 'pa1-03-square-done',
          lines: [N('Then a blue blur comes down the street so fast that the whole crowd’s hair stands up.')],
        },
      },
      {
        id: 'pa1-03-s2',
        goal: 'Watch from behind the bench while Sonic deals with the creature.',
        hint: 'Keep your Nubbin behind the bench by the fountain.',
        check: 'watch:pa1-chaos:drain',
        scene: {
          id: 'pa1-03-sonic',
          lines: [
            SO('Hey, hey! Everybody back! I’ve got this one.', 'happy'),
            N('A blue hedgehog skids to a stop between the police and the creature. He’s grinning, which seems to be his resting face.'),
            N('It’s a short fight, mostly Sonic bouncing and the creature splashing. You keep your Nubbin behind a bench.'),
            N('Then the creature folds. It doesn’t fall; it pours, all at once, into a drain in the road.'),
            SO('Huh. Slippery. Didn’t even say goodbye.', 'think'),
            N('Just before it goes, for half a second, it looks across the square. It looks at your Nubbin.'),
            N('Its face doesn’t look cruel. It looks like someone who has woken up in the wrong house.'),
            PX('Did you see that? It wasn’t angry. It was lost.', 'soft'),
          ],
          choices: [
            {
              id: 'tell',
              label: 'Tell Sonic it looked lost.',
              then: [SO('Lost things still splash. Thanks, though. I’ll keep an eye out.')],
            },
            {
              id: 'drain',
              label: 'Look down the drain.',
              then: [N('Under the grate, water runs away fast and very clear. It glows faintly green, all the way down.')],
            },
            { id: 'quiet', label: 'Say nothing.' },
          ],
        },
        done: {
          id: 'pa1-03-sonic-done',
          lines: [
            N('Sonic is gone as fast as he came. The police start rolling up their tape.'),
            PX('So that’s the water creature. I think we’re going to see it again.'),
          ],
        },
      },
    ],
    complete: {
      id: 'pa1-03-complete',
      lines: [
        N('A small rosy light is bobbing above the drain, about the size of a plum.'),
        N('It wasn’t there a moment ago. It comes up to your face, circles your Nubbin once, and waits.'),
        PX('That’s not on the sleeve either.', 'think'),
      ],
    },
    rewards: [],
    sets: { 'pa1-03': true },
    notes:
      'CARE: the police never fire on screen. They shout, and “whatever they throw” passes through Chaos like pebbles. ' +
      'Chaos 0 here is person-sized; its eyes are drawn lost, not cruel. The rosy light (Tikal) first appears in the ' +
      'complete scene and stays near the Keeper from now on, between visits to the past.',
  },

  // ---------------------------------------------------------------- PA1-4
  {
    id: 'pa1-04',
    code: 'PA1-4',
    title: 'The Light',
    source: `${SRC}: Tikal’s first memory, the shrine and the Chao`,
    audience: 'all',
    trigger: { where: WHERE, when: after('PA1-3') },
    requires: ['PA1-3'],
    speakers: [sTikal],
    steps: [
      {
        id: 'pa1-04-s1',
        goal: 'Follow the rosy light.',
        hint: 'It waits for you down the quiet back street off the square.',
        check: 'walk:pa1-light:back-street',
        scene: {
          id: 'pa1-04-follow',
          lines: [
            N('The rosy light drifts down a quiet back street, away from the crowd. Every few steps it stops to let you catch up.'),
            N('It’s warm: not hot like a lamp, but warm like a hand.'),
            PX('I’ve checked the controls. There’s no button for this. Whatever it is, it isn’t me.', 'think'),
            N('Your Nubbin reaches up for it. The light dips, lets itself be touched, and bobs away again.'),
            PX('It likes your Nubbin. That’s a good sign, isn’t it? Things that like Nubbins are usually all right.'),
            N('At the end of the street the light stops in front of a blank wall. Then it grows, very gently, until there is nothing else.'),
          ],
        },
        done: {
          id: 'pa1-04-follow-done',
          lines: [
            N('The city sounds go out like a candle. Birdsong comes in instead, and the smell of warm stone.'),
            PX('Keeper? The screen’s gone all gold. Where are you?', 'shock'),
          ],
        },
      },
      {
        id: 'pa1-04-s2',
        goal: 'Sit by the shrine pool with the girl and the Chao.',
        hint: 'Sit on the warm stone at the edge of the pool, quietly.',
        check: 'sit:pa1-shrine:pool',
        scene: {
          id: 'pa1-04-shrine',
          lines: [
            N('You are standing on old stone steps at the edge of a jungle. It is morning, very long ago; you can feel that the way you feel weather.'),
            N('Ahead is a shrine. On a stone altar in the middle of it sits an enormous green jewel, glowing softly.'),
            N('Around it are pools of clear water, and in the water and on the steps and everywhere, there are Chao.'),
            N('A girl sits among them with her feet in the pool. She has long braids, a gentle face, and a Chao asleep in her lap.'),
            TI('Oh! A visitor. And a little one too. Come and sit down, quietly. This one’s only just gone off to sleep.', 'happy'),
            TI('I’m Tikal. You’re from a long way off, aren’t you? Your little one doesn’t look like ours. It looks like a cousin.'),
            N('You sit on the warm stone. Your Nubbin climbs down into the shallows and is surrounded at once.'),
            N('Then the water in the middle pool moves. It rises, slowly, into the shape you saw in the square.'),
            N('It isn’t lost now. It stands tall over the Chao, quiet and watchful, with the green glow steady in its chest.'),
            TI('Don’t be afraid. That’s Chaos. It looks after them. It looks after all of us, really.', 'soft'),
            TI('Some of the clan say it’s a monster. It isn’t. It’s just the one who worries most.'),
          ],
          choices: [
            {
              id: 'bow',
              label: 'Bow to Chaos.',
              then: [N('You bow, a little awkwardly, sitting down. Chaos looks at you for a long moment, then lowers its head, just slightly.')],
            },
            {
              id: 'ask',
              label: 'Ask Tikal what it is.',
              then: [TI('Grandmother says it was a Chao once, long ago, and the Emerald’s light changed it. Now it guards the rest.')],
            },
            {
              id: 'watch',
              label: 'Watch your Nubbin.',
              then: [
                N('Your Nubbin has floated on its back right to Chaos’s feet. Chaos dips one watery finger and turns it gently the right way up.'),
              ],
            },
          ],
        },
        done: {
          id: 'pa1-04-shrine-done',
          lines: [
            N('The gold comes back, and the birdsong goes, and you are in the back street with your hand on a blank wall.'),
            PX('You were gone for nine seconds. Nine. You look like you were gone all afternoon.', 'shock'),
          ],
        },
      },
    ],
    complete: {
      id: 'pa1-04-complete',
      lines: [
        PX('The water creature. That was the water creature, wasn’t it? From the square. But kind.', 'think'),
        Y('It was looking after them.'),
        PX('Then what happened to it?'),
        N('The rosy light bobs once at your shoulder and goes quiet, like someone who isn’t ready to say yet.'),
      ],
    },
    rewards: [],
    sets: { 'pa1-04': true },
    notes:
      'THE PAST: every trip back is a gold dissolve and the same shrine, drawn warmer and softer than the present. Tikal can ' +
      'see and talk to the Keeper; nobody else in the past notices you. Chaos never speaks. The Chao in the past are the ' +
      'same design as the garden Chao.',
  },

  // ---------------------------------------------------------------- PA1-5
  {
    id: 'pa1-05',
    code: 'PA1-5',
    title: 'Tails’s Workshop',
    source: `${SRC}: the Mystic Ruins, Tails’s workshop and Chaos 2`,
    audience: 'all',
    trigger: { where: WHERE, when: after('PA1-4') },
    requires: ['PA1-4'],
    speakers: [sTails, sSonic, sEggman],
    steps: [
      {
        id: 'pa1-05-s1',
        goal: 'Take the train out to the Mystic Ruins and find the workshop.',
        hint: 'The station is on the far side of the square. The workshop is on the hill above the Mystic Ruins stop.',
        check: 'visit:pa1-mystic-ruins:workshop',
        scene: {
          id: 'pa1-05-train',
          lines: [
            N('A train runs from Station Square out to the Mystic Ruins, a green valley full of old stones and older trees.'),
            N('On the hill above the station is a workshop with a runway and a bright little plane outside. Someone is muttering at an engine.'),
            TA('Hand me the… no, that’s the… thank you, that’s the one I meant, actually.'),
            N('A young fox with two tails is up to his elbows in the plane’s nose. There is oil on his face and more on one tail.'),
            TA('Hi! Sorry. I’m Tails. You’re not from round here, are you? Your friend’s got the same head as a Chao.'),
            TA('Sonic’s inside. We found a Chaos Emerald, and it’s doing something weird to the instruments.'),
            PX('A fox. With two tails. Who fixes planes. I want to live in this game.', 'happy'),
          ],
        },
        done: {
          id: 'pa1-05-train-done',
          lines: [N('Tails hooks a spare stool out from under the bench with his foot. He doesn’t stop working once.')],
        },
      },
      {
        id: 'pa1-05-s2',
        goal: 'Hand Tails the spanner he needs.',
        hint: 'It’s one of the seven on the bench. Your Nubbin may already know which.',
        check: 'give:pa1-spanner:tails',
        scene: {
          id: 'pa1-05-spanner',
          lines: [
            TA('Could you pass the spanner? The silver one.'),
            N('The bench has seven silver things on it. All of them are spanners.'),
            TA('The other silver one.'),
            N('Your Nubbin climbs onto the bench, picks one up in both arms, and stands there beaming.'),
            PX('Tails has seven spanners and knows every one. Byte has one spanner and a theory.'),
            PX('Tell him it’s a ten. It looks like a ten. Through the screen, everything looks like a ten.'),
            TA('Nearly there. If I’m reading this right, the Emerald’s giving off a signal, and something’s following it.', 'think'),
          ],
          choices: [
            {
              id: 'nubbin',
              label: 'Take the one your Nubbin is holding.',
              then: [TA('That’s it! How did it… never mind. Thank you, both of you.', 'happy')],
            },
            {
              id: 'small',
              label: 'Hand him the smallest.',
              then: [TA('Close! One up. Thanks.'), N('Your Nubbin hands him the one up. It’s the one it was holding.')],
            },
            {
              id: 'ask',
              label: 'Ask which one he means.',
              then: [
                TA('The ten. Sorry. I always forget other people can’t see inside my head.'),
                N('Your Nubbin is already holding the ten.'),
              ],
            },
          ],
        },
        done: {
          id: 'pa1-05-spanner-done',
          lines: [N('The engine coughs, catches and purrs. Tails punches the air and bangs his head on the propeller.')],
        },
      },
      {
        id: 'pa1-05-s3',
        goal: 'Keep your head down when Eggman comes.',
        hint: 'Get behind the workbench with your Nubbin and stay there.',
        check: 'watch:pa1-eggman:workshop',
        scene: {
          id: 'pa1-05-ambush',
          lines: [
            N('A shadow falls over the runway. A round flying machine hums down out of the sky, and in it sits a round man with a huge moustache.'),
            EG('Good afternoon, vermin! I’ll be taking that Emerald. No, don’t get up. I’ll show myself in.', 'happy'),
            TA('It’s Eggman! Sonic, he’s here!', 'shock'),
            SO('Already on it. Oh, hi again. You’re everywhere today.'),
            N('You get down behind the workbench with your Nubbin, as small as the two of you can be.'),
            N('A metal claw shoots out of the machine. In a clatter and a flash, the Emerald is gone from the bench.'),
            EG('Chaos, my dear! Supper!'),
            N('Out of a puddle by the runway rises the water creature, taller than before. Eggman tosses it the Emerald, and it swallows the light.'),
            N('It grows: its arms lengthen and its head curls higher. Its eyes don’t look at Eggman at all, but past him, at nothing.'),
            EG('Two Emeralds, two sizes! At seven, my friend, nobody will be able to stop us. Toodle-oo!'),
          ],
        },
        done: {
          id: 'pa1-05-ambush-done',
          lines: [
            N('Sonic chases Chaos off into the valley. Eggman’s machine hums away over the trees, chuckling to itself.'),
            TA('Are you two all right? He doesn’t usually bother with bystanders.'),
            PX('Nobody look at the claw marks on the bench. Nobody.', 'shock'),
          ],
        },
      },
    ],
    complete: {
      id: 'pa1-05-complete',
      lines: [
        N('Tails fishes a second spanner out of the plane’s nose, where it has been all along.'),
        TA('Thanks for the help. Really. Most people just ask about the tails.'),
        PX('I was going to ask about the tails.', 'sad'),
        N('Tails tells your Nubbin to keep the spanner it was holding. It carries it for the rest of the cartridge.'),
      ],
    },
    rewards: [],
    sets: { 'pa1-05': true },
    notes:
      'Sonic’s fight with Chaos 2 happens offscreen, in the valley. The spanner is a carried prop on the Nubbin until ' +
      'PA1-18 (art only, no inventory item). Eggman is comic and pompous; he never threatens the Keeper directly.',
  },

  // ---------------------------------------------------------------- PA1-6
  {
    id: 'pa1-06',
    code: 'PA1-6',
    title: 'The Shattered Emerald',
    source: `${SRC}: Knuckles, the Master Emerald and the fall of Angel Island`,
    audience: 'all',
    trigger: { where: WHERE, when: after('PA1-5') },
    requires: ['PA1-5'],
    speakers: [sKnuckles, sEggman],
    steps: [
      {
        id: 'pa1-06-s1',
        goal: 'Visit the floating island and its guardian.',
        hint: 'Tails will drop you on the island on his next flight. Climb the shrine steps.',
        check: 'climb:pa1-shrine:angel-island',
        scene: {
          id: 'pa1-06-island',
          lines: [
            N('High above the Mystic Ruins floats a whole island. Tails swings the plane past it and lets you down on the grass.'),
            N('At its heart is a shrine of stone steps. At the top sits a green Emerald, huge, glowing; the same one you saw on Tikal’s altar.'),
            N('Someone is sitting on the steps below it, arms folded, glaring at the sky as if it owes him money.'),
            KN('Who let you up here? Nobody comes up here.', 'angry'),
            KN('I’m Knuckles. I guard the Master Emerald. You don’t touch it, you don’t lean on it, and that thing doesn’t lick it.'),
            N('Your Nubbin, who was about to lick it, sits down.'),
            KN('…It can stay. It looks like a Chao. Chao used to live up here, way back. Before my people were gone.', 'soft'),
            N('Then the sky goes dark, and the Emerald flashes, and the steps shake under your feet.'),
            N('Something rises out of the Emerald itself: water, clear, with a green glow. It strikes the stone once, very hard.'),
            N('The Master Emerald splits into a hundred green shards. They fly out in every direction, like seeds from a pod.'),
            EG('Splendid work, Chaos! Knuckles, always a pleasure. Do enjoy your swim!', 'happy'),
            N('The island tips, slowly, like a great ship. Then it falls.'),
          ],
        },
        done: {
          id: 'pa1-06-island-done',
          lines: [
            N('You hold on to the steps and to your Nubbin, and the island comes down into the sea with a long, deep, sighing splash.'),
            N('When the spray settles, it is floating off the Mystic Ruins, as if it had always meant to.'),
            PX('Is everyone… you’re all right? Good. My hands are shaking, and I’m not even in there.', 'shock'),
          ],
        },
      },
      {
        id: 'pa1-06-s2',
        goal: 'Help Knuckles find the shards of the Master Emerald.',
        hint: 'Your Nubbin is good at finding green things. Search the ferns on the left side.',
        check: 'find:pa1-shard:jungle',
        scene: {
          id: 'pa1-06-shards',
          lines: [
            KN('Great. Great. A hundred pieces, all over the place.', 'angry'),
            KN('Without the Master Emerald this island stays down. And it’s my job. It’s the only job I’ve got.', 'sad'),
            N('He kicks a stone, stares at the jungle, and doesn’t move.'),
            PX('He’s going to be ages. Look how much jungle there is.'),
            N('Your Nubbin trots off into the ferns. A minute later it comes back with a green shard as long as its arm, very pleased.'),
            KN('…How did it do that?', 'shock'),
            PX('Nubbins are good at finding green things. Ask anyone who’s ever dropped a pea.', 'happy'),
            KN('Fine. You. Small one. You’re with me. Keeper, keep up.'),
          ],
          choices: [
            {
              id: 'search',
              label: 'Search with Knuckles.',
              then: [KN('You take the left side. I’ll take the right. Shout if you find anything. Don’t shout if you don’t.')],
            },
            {
              id: 'people',
              label: 'Ask about his people.',
              then: [KN('Echidnas. There was a whole clan once. Now there’s me.', 'sad'), KN('Anyway. Shards. Left side.')],
            },
          ],
        },
        done: {
          id: 'pa1-06-shards-done',
          lines: [
            N('By sunset you have a sack of shards between you. Knuckles counts them twice and scowls, which seems to be how he says thank you.'),
            KN('Not all of them. Not yet. But it’s a start.'),
          ],
        },
      },
    ],
    complete: {
      id: 'pa1-06-complete',
      lines: [
        N('Knuckles gives your Nubbin the smallest shard to hold, takes it back at once, then hands it over again.'),
        KN('Just for tonight. Don’t lose it. That piece is a bit of my home.'),
        N('Your Nubbin sleeps with it in both hands. In the morning it gives it back without being asked.'),
      ],
    },
    rewards: [],
    sets: { 'pa1-06': true },
    notes:
      'Knuckles’s own opening (the island falling) is moved to after the workshop, as the outline orders it. Nobody is hurt ' +
      'in the fall: a long splash, then calm. The shard hunt is a short find, not a collection grind: the check completes ' +
      'on the first shard after the scene; the sack is narration.',
  },

  // ---------------------------------------------------------------- PA1-7
  {
    id: 'pa1-07',
    code: 'PA1-7',
    title: 'The Prayer',
    source: `${SRC}: Tikal at the Master Emerald`,
    audience: 'all',
    trigger: { where: WHERE, when: after('PA1-6') },
    requires: ['PA1-6'],
    speakers: [sKnuckles, sTikal],
    steps: [
      {
        id: 'pa1-07-s1',
        goal: 'Go to the rosy light above the broken altar.',
        hint: 'It’s circling the empty altar at the top of the shrine steps.',
        check: 'find:pa1-light:altar',
        scene: {
          id: 'pa1-07-light',
          lines: [
            N('In the morning the rosy light is hovering over the empty altar where the Master Emerald was.'),
            N('It turns slow circles above the broken stone, as if it’s looking for something it put down.'),
            KN('That light’s been round here since I was a kid. It never does anything. It just hangs about.', 'think'),
            KN('Go on, then. If it wants you, it wants you.'),
            PX('Hang on, I’m getting the gold screen again. Hold your Nubbin’s hand.'),
            N('Your Nubbin takes your finger. The light comes down over the two of you like a warm hat.'),
          ],
        },
        done: {
          id: 'pa1-07-light-done',
          lines: [N('Birdsong and warm stone. The Master Emerald is whole again, glowing on its altar at the top of the steps.')],
        },
      },
      {
        id: 'pa1-07-s2',
        goal: 'Sit with Tikal while she learns the prayer.',
        hint: 'Sit beside her on the top step, below the Emerald.',
        check: 'sit:pa1-tikal:altar',
        scene: {
          id: 'pa1-07-prayer',
          lines: [
            N('Tikal kneels at the top of the steps with her hands together. She is saying the same words again and again, under her breath.'),
            N('Around the great Emerald stand seven smaller jewels, each a different colour, each in its own hollow of stone.'),
            TI('Oh, it’s you again! Sit with me. Grandmother taught me the prayer. She said learn it, not just say it.', 'happy'),
            TI('Seven jewels around the great one, and all seven serve.', 'think'),
            TI('That’s how it begins. Seven Emeralds, serving. But I don’t know what they serve, or who.'),
            N('In the pools below, the Chao are splashing. Chaos stands among them, very still, the way a heron stands.'),
            TI('Father says it means the Emeralds serve whoever holds them. That’s what he wants it to mean.'),
            TI('I think it means something else. Something I haven’t grown into yet.', 'soft'),
          ],
          choices: [
            {
              id: 'chao',
              label: 'Maybe they serve the Chao.',
              then: [TI('The Chao? The smallest ones?', 'think'), TI('Oh. I like that. Grandmother would like that.', 'happy')],
            },
            {
              id: 'who',
              label: 'Maybe it depends who’s asking.',
              then: [TI('Like a gate that opens for some and not for others. Yes. Maybe.', 'think')],
            },
            {
              id: 'listen',
              label: 'Just listen to her say it.',
              then: [
                N('You sit and listen. She says it again, slower, and this time she isn’t trying to understand it, only saying it.'),
                TI('Thank you. It goes easier with someone listening.', 'soft'),
              ],
            },
          ],
        },
        done: {
          id: 'pa1-07-prayer-done',
          lines: [
            N('The light comes back for you mid-sentence. Tikal smiles and lifts a hand, as if she knows you’ll be back.'),
            PX('She’s nice. Is it weird that I’m worried about her?', 'soft'),
          ],
        },
      },
    ],
    complete: {
      id: 'pa1-07-complete',
      lines: [
        KN('Well? What did it want?'),
        Y('To show me someone praying.'),
        KN('Huh. My people used to pray here. I don’t know any of it. There was nobody left to teach me.', 'sad'),
        N('He sits down on the broken altar with his back to you, and for a while nobody says anything.'),
      ],
    },
    rewards: [],
    sets: { 'pa1-07': true },
    childLines: {
      'pa1-07-prayer#3': 'Seven jewels, seven keepers of the light.',
    },
    notes:
      'QUOTE CHECK (2026-10-18): pa1-07-prayer#3 was lifted text 1 from Part M; it could not be checked against the ' +
      'game’s English script, so it is now our own paraphrase. No prayer line is quoted, and nothing else in the prayer ' +
      'is given in words. Sega rights: see the file header.',
  },

  // ---------------------------------------------------------------- PA1-8
  {
    id: 'pa1-08',
    code: 'PA1-8',
    title: 'Amy and the Bird',
    source: `${SRC}: Amy, the little bird and E-102 Gamma`,
    audience: 'all',
    trigger: { where: WHERE, when: after('PA1-7') },
    requires: ['PA1-7'],
    speakers: [sAmy, sGamma],
    steps: [
      {
        id: 'pa1-08-s1',
        goal: 'Meet the girl running across Station Square.',
        hint: 'She’s heading for the fountain, with a robot behind her.',
        check: 'talk:pa1-amy:square',
        scene: {
          id: 'pa1-08-amy',
          lines: [
            N('Back in Station Square, a girl in a red dress is running across the plaza with her arms round something small.'),
            N('Behind her a blocky red robot thumps along, beeping.'),
            AM('Excuse me, sorry, coming through, very important, out of the way!'),
            N('She skids round the fountain and nearly falls over your Nubbin. She stops, looks at it, and melts a little.'),
            AM('Oh, you’re lovely. Hi. I’m Amy. I can’t stop.', 'happy'),
            N('In her arms is a little blue bird with a tiny pendant round its neck. It’s trembling.'),
            AM('He fell out of the sky right into my arms. The robots keep chasing him, and he hasn’t done anything!', 'angry'),
            PX('The pendant. Look at the pendant. It’s glowing green.'),
            AM('Please. Have you got anywhere we could hide?'),
          ],
          choices: [
            {
              id: 'garden',
              label: 'The Chao Garden, behind the hotel.',
              then: [AM('A garden? With a door? Perfect. Lead the way.')],
            },
            {
              id: 'think',
              label: 'Let me think.',
              then: [AM('Think fast!'), N('The beeping gets closer. You think of the only place you know.')],
            },
          ],
        },
        done: {
          id: 'pa1-08-amy-done',
          lines: [N('You run for the hotel, with Amy at your shoulder and your Nubbin bouncing along behind like a dropped ball.')],
        },
      },
      {
        id: 'pa1-08-s2',
        goal: 'Hide the bird in the Chao Garden.',
        hint: 'Set the bird down on the grass among the Chao.',
        check: 'carry:pa1-bird:chao-garden',
        scene: {
          id: 'pa1-08-hide',
          lines: [
            N('In the Chao Garden it’s quiet, with fruit hanging from the tree. A Chao is asleep in the watering can.'),
            AM('Here? Is he going to be safe here?'),
            N('The little bird hops off her hands onto the grass. A Chao waddles up, looks at it, and its ball turns into a question mark.'),
            N('Then the Chao sits down next to the bird. Another sits down next to that one, and soon the bird is in the middle of a ring of them.'),
            PX('They’re hiding him. They’re hiding him with themselves.', 'soft'),
            N('Your Nubbin sits down in the ring too. The bird stops trembling.'),
            AM('Oh, you darlings. You absolute darlings.', 'happy'),
          ],
        },
        done: {
          id: 'pa1-08-hide-done',
          lines: [N('Footsteps in the corridor. Heavy ones, slow, with a hum of machinery under them.')],
        },
      },
      {
        id: 'pa1-08-s3',
        goal: 'Stay still while the robot looks.',
        hint: 'Stay in the ring with the Chao. Don’t move.',
        check: 'watch:pa1-gamma:chao-garden',
        scene: {
          id: 'pa1-08-gamma',
          lines: [
            N('A tall robot steps into the doorway: red and black, one long arm ending in a blaster, and a round, patient face.'),
            GA('Target: small blue bird. Location: confirmed.'),
            AM('Don’t you dare. Don’t you DARE.', 'angry'),
            N('The robot raises its arm and looks down at the ring of Chao. Twelve small faces look back, and twelve balls turn into exclamation marks.'),
            N('The arm stops halfway.'),
            GA('…Query.', 'think'),
            N('Nobody answers it. The robot stands still for so long that a Chao wanders over and touches its foot.'),
            GA('E-102 Gamma. This unit… will report the target not found.'),
            N('It lowers its arm and goes. At the door it stops, as if it’s about to say something more, and doesn’t.'),
            PX('Did a robot just change its mind?', 'shock'),
          ],
        },
        done: {
          id: 'pa1-08-gamma-done',
          lines: [
            N('Amy lets out a breath she seems to have been holding since the fountain.'),
            AM('Did you see its face? It didn’t want to. It really didn’t want to.', 'think'),
          ],
        },
      },
    ],
    complete: {
      id: 'pa1-08-complete',
      lines: [
        AM('I’m going to find Sonic. He’ll know what to do. He always knows, even when he’s pretending.'),
        N('She scoops up the bird and kisses each Chao on the head in turn, which takes a while. Then she goes.'),
        PX('Bad feeling. I’ve got a bad feeling. I’ve been mostly right about bad feelings this week.', 'think'),
      ],
    },
    rewards: [],
    sets: { 'pa1-08': true },
    notes:
      'Gamma’s weapon is a blaster arm; it is raised and lowered, never fired. Whatever pa1-gate is, the Keeper has the ' +
      'key, so the hiding plays the same; the gate art shows its state. Amy is taken onto the Egg Carrier offscreen ' +
      'between PA1-8 and PA1-11 (Tails tells you in pa1-11-board).',
  },

  // ---------------------------------------------------------------- PA1-9
  {
    id: 'pa1-09',
    code: 'PA1-9',
    title: 'Big and Froggy',
    source: `${SRC}: Big the Cat and Froggy`,
    audience: 'all',
    trigger: { where: WHERE, when: after('PA1-8') },
    requires: ['PA1-8'],
    speakers: [sBig],
    steps: [
      {
        id: 'pa1-09-s1',
        goal: 'Find out who is calling for Froggy in the jungle.',
        hint: 'Follow the river into the Mystic Ruins jungle to the plank hut.',
        check: 'talk:pa1-big:jungle',
        scene: {
          id: 'pa1-09-big',
          lines: [
            N('Deep in the Mystic Ruins jungle, beside a hut made of planks and good intentions, a very large cat sits by a river looking sad.'),
            BI('Froggy? Froggyyy.', 'sad'),
            N('He has a fishing rod over one shoulder and a tackle box the size of a suitcase. He is the gentlest-looking thing you have ever seen this big.'),
            BI('Oh. Hello. I’m Big. Have you seen my friend? He’s a frog. He’s green. He’s called Froggy.'),
            BI('He went funny this morning. He swallowed a shiny green stone, and then he grew a tail. Frogs don’t have tails.', 'think'),
            PX('A green stone. Another Emerald. And a tail like… oh no. Like the water creature’s?', 'shock'),
            BI('He jumped in the river. I’ve been fishing for him all day. Not with a hook. With a lure. I wouldn’t hook Froggy.'),
            N('Your Nubbin sits down beside him. Big looks at it for a long time, then pats its head with one enormous, careful finger.'),
            BI('You can help, if you want. You have to be quiet, though.'),
          ],
        },
        done: {
          id: 'pa1-09-big-done',
          lines: [N('Big hands you a spare rod. The lure on the end is a little rubber bug with a bell on it.')],
        },
      },
      {
        id: 'pa1-09-s2',
        goal: 'Fish with Big, quietly, and wait for Froggy.',
        hint: 'Sit on the bank and keep still. Froggy comes to whoever is still.',
        check: 'sit:pa1-big:river',
        scene: {
          id: 'pa1-09-fish',
          lines: [
            N('You sit on the bank beside Big. The river slides by, brown and green and slow.'),
            BI('Froggy likes it when you’re still. If you wiggle, he hides. If you’re still, he comes and sits on your foot.'),
            N('Big is very good at being still, and you are less good at it. Your Nubbin is excellent.'),
            PX('This is the slowest game I have ever played. I love it. I’m going to make a cup of tea.', 'happy'),
            N('An hour passes, or the game’s idea of an hour. Dragonflies come and go.'),
            N('The bell on your lure rings once, and then doesn’t.'),
          ],
          choices: [
            {
              id: 'wait',
              label: 'Keep waiting.',
              then: [N('You keep still, and the river keeps moving. After a while you stop noticing that you’re waiting at all.')],
            },
            {
              id: 'move',
              label: 'Reel in and try another spot.',
              then: [
                BI('Nope. This is the spot. Froggy always comes back to the spot.'),
                N('You put the rod back down. Big is right, as it turns out.'),
              ],
            },
          ],
        },
        done: {
          id: 'pa1-09-fish-done',
          lines: [
            N('Something small and green climbs out of the water and sits on your Nubbin’s foot. It has a long, wavering tail, clear as water.'),
            BI('FROGGY!', 'happy'),
            N('Froggy jumps from your Nubbin’s foot straight back into the river. Big is still beaming.'),
            BI('He’s all right. He’s just being silly. I’ll find him. I always find him.'),
            PX('Froggy! Brilliant! Hang on. My tea’s gone cold. I made it before the dragonflies.', 'happy'),
            PX('Don’t tell Big. He looks so happy about the waiting.'),
          ],
        },
      },
    ],
    complete: {
      id: 'pa1-09-complete',
      lines: [
        PX('A frog with a tail like the water creature’s. So the water creature’s been near here. Hasn’t it?', 'think'),
        BI('That big water fella? I saw him. He looked like he was looking for something.'),
        BI('Same as me. I know that look.', 'soft'),
        N('Big goes back to his rod. You leave him there, perfectly still, waiting for his friend.'),
      ],
    },
    rewards: [],
    sets: { 'pa1-09': true },
    notes:
      'No hook, no catch: the fishing is a sit-still beat (the check is sitting, not a fishing minigame), and nothing is ' +
      'hurt. Froggy never speaks. Big keeps Froggy in his hat by PA1-16.',
  },

  // ---------------------------------------------------------------- PA1-10
  {
    id: 'pa1-10',
    code: 'PA1-10',
    title: 'Pachacamac',
    source: `${SRC}: Tikal and her father, chief of the echidna clan`,
    audience: 'all',
    trigger: { where: WHERE, when: after('PA1-9') },
    requires: ['PA1-9'],
    speakers: [sTikal, sPacha],
    steps: [
      {
        id: 'pa1-10-s1',
        goal: 'Go back with the light and see who has come to the shrine.',
        hint: 'The light finds you on the riverbank. Stand at the bottom of the shrine steps.',
        check: 'watch:pa1-clan:altar',
        scene: {
          id: 'pa1-10-council',
          lines: [
            N('The rosy light finds you on the riverbank and takes you back without asking. It seems to be in a hurry.'),
            N('At the shrine it is evening. Torches burn on the steps, and a crowd of echidnas in feathers and beads stands below the altar.'),
            N('At their head is a big, grizzled echidna in a heavy headdress. He talks the way a hammer talks.'),
            PA('Our neighbours have stone walls and bronze spears. We have prayers.', 'angry'),
            PA('Seven Emeralds sit in this shrine doing nothing but glowing. With their power, no one would ever threaten this clan again.'),
            N('The warriors behind him strike their spears on the stone. In the pools, the Chao stop playing and look up.'),
            N('Chaos rises a little in the water, watching. Tikal stands in front of the altar, very small and very still.'),
            TI('Father. Please. The Emeralds aren’t for that. Grandmother said…', 'sad'),
            PA('Your grandmother is gone, Tikal. Our enemies are not.'),
          ],
        },
        done: {
          id: 'pa1-10-council-done',
          lines: [N('The warriors go quiet. Tikal looks round, and sees you at the bottom of the steps.')],
        },
      },
      {
        id: 'pa1-10-s2',
        goal: 'Decide where to stand while Tikal pleads with her father.',
        hint: 'Up the steps beside Tikal, or down by the pools with the Chao.',
        check: 'choose:pa1-tikal:altar',
        scene: {
          id: 'pa1-10-stand',
          lines: [
            TI('The Emeralds are the heart of this place. The Chao live here because it’s peaceful. Take the power, and it won’t be.'),
            PA('Peace is a word for people who haven’t been attacked yet.'),
            TI('Then let us be those people for as long as we can.', 'soft'),
            N('Pachacamac’s face doesn’t change. He has already decided, and he decided a long time ago.'),
            PX('He’s not going to listen, is he? He isn’t even really hearing her.', 'sad'),
            N('Tikal is shaking. She doesn’t step back.'),
          ],
          choices: [
            {
              id: 'stand',
              label: 'Climb the steps and stand beside her.',
              set: { 'pa1-stood': true },
              then: [
                N('You climb the steps and stand next to her, so that she isn’t standing alone in front of all of them.'),
                N('Pachacamac looks at you as if you were a fly, then looks away. Nothing changes at all.'),
                TI('Thank you.', 'soft'),
              ],
            },
            {
              id: 'chao',
              label: 'Stay down by the pools, with the Chao.',
              set: { 'pa1-stood': false },
              then: [
                N('You stay below with the Chao. Your Nubbin climbs into your lap, and a few Chao climb in after it.'),
                N('From the top of the steps Tikal glances down at them, and at you, and her shoulders come down a little.'),
              ],
            },
          ],
        },
        done: {
          id: 'pa1-10-stand-done',
          lines: [
            PA('We march on the shrine at dawn, and take what the Emeralds can give. Tikal, you will stand aside, as a chief’s daughter should.'),
            N('He turns and goes, and his warriors go after him, and the torches go with them. The shrine is very dark.'),
          ],
        },
      },
    ],
    complete: {
      id: 'pa1-10-complete',
      lines: [
        TI('He wasn’t always like this. When I was small he carried me on his shoulders to see the Chao.', 'sad'),
        TI('Your being here doesn’t change anything. I know that.'),
        TI('I’m still glad. Isn’t that strange?', 'soft'),
        N('Chaos sinks back into the pool, slowly. Its glow lights the water from underneath, green and troubled.'),
        PX('Keeper. I don’t want to watch the next part.', 'soft'),
        Y('Neither do I.'),
      ],
    },
    rewards: [],
    sets: { 'pa1-10': true },
    notes:
      'SECOND CHOICE: pa1-stood = true | false (pa1-10-stand). It changes nothing here, by design (“It changes nothing, and ' +
      'it still matters”). True plays PA1_VARIANTS pa1-18-stood in PA1-18 (Tikal’s one more line) and both flags pick the ' +
      'last image of PA1-18. CARE: Pachacamac is a hard, proud father, not a cartoon; the name is Sega’s and is used only ' +
      'as a name. The clan’s dress and the shrine are the game’s own designs; add no real Maya or Andean sacred detail.',
  },

  // ---------------------------------------------------------------- PA1-11
  {
    id: 'pa1-11',
    code: 'PA1-11',
    title: 'The Egg Carrier',
    source: `${SRC}: the Egg Carrier and its Chao Garden`,
    audience: 'all',
    trigger: { where: WHERE, when: after('PA1-10') },
    requires: ['PA1-10'],
    speakers: [sTails, sSonic, sEggman, sAmy, sClank],
    steps: [
      {
        id: 'pa1-11-s1',
        goal: 'Board the Egg Carrier with Sonic and Tails.',
        hint: 'Tails’s plane will drop you on the deck. Stay close.',
        check: 'climb:pa1-egg-carrier:deck',
        scene: {
          id: 'pa1-11-board',
          lines: [
            N('Back in the present, the sky over Station Square is full of a shape: a flying fortress as big as a town, red and gold, humming.'),
            TA('That’s Eggman’s ship, the Egg Carrier. One of his robots grabbed Amy and the bird off the street. We’re going in.', 'angry'),
            SO('In, find Amy, out. Easy. You two coming? Stay close, and don’t press any red buttons.'),
            N('Tails’s plane drops you on the deck in a roar of wind. Sonic is gone the moment his feet touch metal.'),
            PX('Okay. A flying fortress. Brilliant. I love that. I hate that. Both.', 'shock'),
            PX('Also, Tails is right there. Two tails. Still not asking. I’m a professional.'),
            N('Klaxons, corridors, and signs that all say EGG something. Your Nubbin stays tucked inside your jacket.'),
          ],
        },
        done: {
          id: 'pa1-11-board-done',
          lines: [N('Down a ladder, past a door marked EGG STORAGE, you hear something you don’t expect up here: Chao.')],
        },
      },
      {
        id: 'pa1-11-s2',
        goal: 'Get the Egg Carrier’s Chao to the lifeboats.',
        hint: 'The lifeboats are two decks up, on the left. Bring every Chao.',
        check: 'carry:pa1-chao:lifeboats',
        scene: {
          id: 'pa1-11-garden',
          lines: [
            N('There’s a Chao Garden inside the ship: plastic grass, a plastic tree, a pool of recycled water, and a dozen frightened Chao.'),
            N('Eggman keeps one, it seems, for the reason he keeps everything: because he can.'),
            N('The floor shudders. Somewhere far below, something large has been hit.'),
            PX('There are lifeboats. On the map. Two decks up, port side. Port is left. I looked it up.'),
            N('You pick up two Chao. Your Nubbin, without being told, gets three more to follow it in a wobbly line.'),
            PX('Every one of them, Keeper. Not one stays behind in a plastic garden.'),
          ],
          choices: [
            {
              id: 'carry',
              label: 'Carry them two at a time.',
              then: [N('Two at a time, up the ladder and back down, over and over. Your arms ache, and nobody gets left.')],
            },
            {
              id: 'line',
              label: 'Let your Nubbin lead them in a line.',
              then: [N('Your Nubbin walks to the ladder, and every Chao follows it, one after another, like ducklings. You bring up the rear.')],
            },
          ],
        },
        done: {
          id: 'pa1-11-garden-done',
          lines: [
            N('The last Chao is in the last lifeboat. You pull the lever, and it drops away under a parachute with Eggman’s face on it.'),
            PX('I can’t believe the parachutes have his face on them. No, I can. I can’t. I can.', 'happy'),
          ],
        },
      },
      {
        id: 'pa1-11-s3',
        goal: 'Keep back by the hatch while Sonic faces Chaos.',
        hint: 'Stay by the open hatch on the back deck.',
        check: 'watch:pa1-chaos:egg-carrier',
        scene: {
          id: 'pa1-11-chaos',
          lines: [
            N('Out on the back deck, Eggman stands at a rail with a fistful of glowing Emeralds.'),
            EG('Four, Chaos! Four Emeralds, my lovely puddle. Show them what you’ve become!', 'happy'),
            N('Chaos rises out of a tank on the deck. It’s huge now, with great clawed arms, and the glow inside it flickers from green toward red.'),
            N('It isn’t looking at Eggman. It’s looking through the open hatch behind you, at the empty Chao Garden.'),
            PX('It’s looking for them. It doesn’t know they got out.', 'soft'),
            N('Sonic is already there, with Amy behind him holding the bird. You keep back by the hatch.'),
          ],
        },
        done: {
          id: 'pa1-11-chaos-done',
          lines: [
            N('There is a long, crashing fight that you mostly see through your fingers. At the end Chaos pours away over the side, still looking back.'),
            AM('Keeper! You’re here too? Sonic saved us! Well. Sort of. I saved the bird.', 'happy'),
          ],
        },
      },
    ],
    complete: {
      id: 'pa1-11-complete',
      lines: [
        N('From the rail you can see the lifeboats drifting down toward the sea: a dozen little parachutes, a dozen Chao.'),
        N('Your Nubbin waves at them with both arms until the last one is out of sight.'),
        PX('That’s the Chao safe. Now everybody else.'),
      ],
    },
    rewards: [],
    sets: { 'pa1-11': true },
    notes:
      'Chaos 4 and Chaos 6 are folded into one growth here (“Four Emeralds”). The lifeboat carry is a short escort: one ' +
      'trip on screen, the rest narrated in the choice. The Egg Carrier’s Chao land safely by parachute; the Grove never ' +
      'sees them again (they are this world’s).' +
      ' CLANK (s21Done): play PA1_VARIANTS pa1-11-garden-done-clank in place of pa1-11-garden-done.',
  },

  // ---------------------------------------------------------------- PA1-12
  {
    id: 'pa1-12',
    code: 'PA1-12',
    title: 'Gamma',
    source: `${SRC}: E-102 Gamma turns from Eggman`,
    audience: 'all',
    trigger: { where: WHERE, when: after('PA1-11') },
    requires: ['PA1-11'],
    speakers: [sEggman, sGamma, sAmy],
    steps: [
      {
        id: 'pa1-12-s1',
        goal: 'See what happens to the robot from the garden.',
        hint: 'He’s in the hangar near the stern of the Egg Carrier.',
        check: 'watch:pa1-gamma:hangar',
        scene: {
          id: 'pa1-12-gamma',
          lines: [
            N('In a hangar near the stern, the tall robot from the garden stands in front of Eggman, very straight.'),
            EG('Gamma! You let the bird go. You let the girl go. I built you, you ungrateful toaster!', 'angry'),
            GA('Query. Why was the bird the target?'),
            EG('Because I SAID so! Report to the scrap room. You’re obsolete.'),
            N('Eggman stamps off, and Gamma stands alone in the hangar. Then it turns, and walks the other way.'),
            AM('He didn’t give me up, back in the garden. I think he’s trying to be good and doesn’t know how.', 'soft'),
            PX('Follow him? I want to follow him.'),
          ],
        },
        done: {
          id: 'pa1-12-gamma-done',
          lines: [N('Gamma walks to a row of robots in their charging cradles. Its brothers: the same shape, in different colours.')],
        },
      },
      {
        id: 'pa1-12-s2',
        goal: 'Watch Gamma open the first of his brothers.',
        hint: 'Stay with Amy by the cradles.',
        check: 'watch:pa1-gamma:cradles',
        scene: {
          id: 'pa1-12-birds',
          lines: [
            N('Gamma opens a panel on the first robot’s back. Inside, where an engine might be, there is a small bird in a little cage, alive.'),
            GA('Power source: living creature. Discovery logged.'),
            GA('This unit… also contains one.', 'think'),
            N('It opens the cage. The bird hops onto Gamma’s hand, blinks, and flies up into the rafters.'),
            AM('They run on birds? All of them? Oh, that’s horrible. Oh, poor Gamma.', 'sad'),
            N('Gamma turns to you. It looks at your Nubbin for a long moment, the way it looked at the ring of Chao.'),
            GA('You and the small one. Leave this ship. This unit has work to do.'),
          ],
          choices: [
            {
              id: 'thank',
              label: 'Thank him.',
              then: [GA('Acknowledged.'), N('It turns back to its brothers.')],
            },
            {
              id: 'come',
              label: 'Ask him to come with you.',
              then: [GA('Negative. There are more of them. Go.'), N('It says it kindly. You hadn’t known a robot could.')],
            },
          ],
        },
        done: {
          id: 'pa1-12-birds-done',
          lines: [N('Tails comes back for you in the plane. You climb aboard with Amy, and the Egg Carrier falls away behind you into cloud.')],
        },
      },
      {
        id: 'pa1-12-s3',
        goal: 'Watch the sky from the plane.',
        hint: 'Look back toward the clouds.',
        check: 'watch:pa1-bird:sky',
        scene: {
          id: 'pa1-12-sky',
          lines: [
            N('Nobody says much on the flight back. Tails flies low over the sea, and the plane hums.'),
            AM('He’ll be all right. Won’t he? He’s very big. Big things are usually all right.', 'sad'),
            PX('Amy. I don’t know.', 'soft'),
            N('Your Nubbin is kneeling on the seat, looking back at the clouds, with both hands on the glass.'),
            N('Then, out of the cloud, very small, comes one bird. Then another, and another, scattering into the blue.'),
            N('They fly free over the water, toward the land.'),
          ],
        },
        done: {
          id: 'pa1-12-sky-done',
          lines: [
            AM('That’s from him. I know it is.', 'soft'),
            PX('I’m fine. I’m not crying. The screen’s just very bright.', 'sad'),
          ],
        },
      },
    ],
    complete: {
      id: 'pa1-12-complete',
      lines: [
        N('Amy holds her own little bird up to the window, so it can see the others go.'),
        AM('Thank you, Gamma.', 'soft'),
        N('Your Nubbin stays at the glass until the last bird is out of sight.'),
      ],
    },
    rewards: [],
    sets: { 'pa1-12': true },
    notes:
      'CARE: Gamma’s end is offscreen. The Keeper leaves the ship before Gamma frees his brothers; nothing about what happens ' +
      'to Gamma is said or shown. The last image is the birds flying free. Gamma never fires on screen.',
  },

  // ---------------------------------------------------------------- PA1-13
  {
    id: 'pa1-13',
    code: 'PA1-13',
    title: 'The Charge',
    source: `${SRC}: the attack on the shrine and the sealing of Chaos`,
    audience: 'all',
    trigger: { where: WHERE, when: after('PA1-12') },
    requires: ['PA1-12'],
    speakers: [sTikal, sKnuckles],
    steps: [
      {
        id: 'pa1-13-s1',
        goal: 'Go back with the light to the shrine at dawn.',
        hint: 'The light is waiting for you. Stand with Tikal on the top step.',
        check: 'watch:pa1-shrine:dawn',
        scene: {
          id: 'pa1-13-dawn',
          lines: [
            N('The rosy light comes for you, and this time it isn’t warm. It’s trembling.'),
            N('The shrine at dawn, with mist on the pools. The Chao are still asleep in heaps on the warm steps.'),
            N('Tikal is awake. She sits on the top step in front of the altar, the way you sit when you’ve decided something.'),
            TI('You came. You don’t have to stay for this. I wouldn’t, if I were you.', 'sad'),
            N('Chaos stands in the middle pool, tall and watchful, its glow steady and green.'),
            N('Far off, in the trees, drums start.'),
            PX('Keeper. I could pull the plug. Gently. Say the word.', 'sad'),
          ],
          choices: [
            {
              id: 'stay',
              label: 'Stay with Tikal.',
              then: [Y('I’ll stay.'), TI('Then hold your little one. Hold it close.', 'soft')],
            },
            {
              id: 'wake',
              label: 'Wake the Chao on the steps.',
              then: [
                N('You try, but they roll over, sleepy, and settle again. The drums are getting closer.'),
                TI('Let them sleep. Let them sleep as long as they can.', 'soft'),
              ],
            },
          ],
        },
        done: {
          id: 'pa1-13-dawn-done',
          lines: [N('Tikal goes down the steps and stands in front of the pools with her arms wide. The Chao wake one by one, and gather behind her.')],
        },
      },
      {
        id: 'pa1-13-s2',
        goal: 'Stay in the light, and hold on to your Nubbin.',
        hint: 'You can’t change what happened here. Hold on.',
        check: 'wait:pa1-light:shrine',
        scene: {
          id: 'pa1-13-charge',
          lines: [
            N('Pachacamac’s warriors come out of the trees in a line, and do not stop.'),
            TI('Father! Stop! Please, the Chao!', 'shock'),
            N('They do not stop. The rosy light closes round you, and the shrine goes dim and far away, the way a dream goes when you wake.'),
            N('You hear it through the light rather than see it: the trampling, and small voices, and then a sound like the sea standing up.'),
            N('Then firelight, orange through the gold. Then nothing, for a long while.'),
            N('Through it all, very clearly, you hear Tikal.'),
            TI('The jewels are strength, and a kind heart makes them stronger.', 'sad'),
            TI('Please. Hold it. Hold it, and I’ll stay with it. I’ll stay.', 'sad'),
            N('A great green light. Then silence.'),
            N('Your Nubbin is pressed against your chest, perfectly still, with both hands over its eyes.'),
          ],
        },
        done: {
          id: 'pa1-13-charge-done',
          lines: [
            N('When the light lets go, you are back on the floating island in the present, and it is raining, very softly.'),
            PX('I’m here. I’m just being quiet for a bit.', 'soft'),
          ],
        },
      },
    ],
    complete: {
      id: 'pa1-13-complete',
      lines: [
        N('Knuckles finds you sitting by the broken altar. He doesn’t ask anything; he sits down on the other side of it.'),
        KN('Bad dream?'),
        Y('An old one.'),
        KN('Yeah. This place has a lot of those.', 'sad'),
        N('After a while he gets up, comes back with a big leaf to keep the rain off your Nubbin, and sits down again.'),
      ],
    },
    rewards: [],
    sets: { 'pa1-13': true },
    childLines: {
      'pa1-13-charge#6': 'The light is strong. It is strongest when the heart is kind.',
    },
    notes:
      'CARE: everything in pa1-13-charge after line 2 is offscreen. The screen is the rosy light’s gold, with firelight ' +
      'showing orange through it, then dark, then one green flash. Sound only: footsteps, small Chao cries (not words), a ' +
      'deep rush of water, crackle, silence. No bodies, no blood, no attackers shown hurt. Chaos is never called evil. ' +
      'QUOTE CHECK (2026-10-18): pa1-13-charge#6 was lifted text 2 from Part M; it could not be checked against the ' +
      'game’s English script, so it is now our own paraphrase. Sega rights: see the file header. The sealing line ' +
      'after it (#7) is our own too.',
  },

  // ---------------------------------------------------------------- PA1-14
  {
    id: 'pa1-14',
    code: 'PA1-14',
    title: 'The Ruins',
    source: `${SRC}: the Lost World temple and Tikal’s warning`,
    audience: 'all',
    trigger: { where: WHERE, when: after('PA1-13') },
    requires: ['PA1-13'],
    speakers: [sSonic, sTikal],
    steps: [
      {
        id: 'pa1-14-s1',
        goal: 'Look at the murals in the old temple.',
        hint: 'The temple is in the jungle below the Mystic Ruins. Walk along the painted wall.',
        check: 'inspect:pa1-murals:temple',
        scene: {
          id: 'pa1-14-murals',
          lines: [
            N('In the jungle below the Mystic Ruins stands an old stepped temple, its stones the same as Tikal’s shrine. Older now, by thousands of years.'),
            N('Inside, the walls are covered in murals, carved and painted, faded but still clear.'),
            N('A pool with small round shapes in it, and a girl with braids. A tall shape made of water stands over them.'),
            N('Further along: a line of warriors. Then fire, painted in a red that has gone brown with age.'),
            N('Then a great green stone with the water-shape inside it, and the girl curled up beside it like someone asleep.'),
            PX('That’s her. That’s Tikal. They painted it all. Somebody stayed behind and painted it.', 'sad'),
            N('Your Nubbin puts its hand flat on a painted Chao, very gently, the way you’d touch something sleeping.'),
          ],
          choices: [
            {
              id: 'touch',
              label: 'Touch the painted girl.',
              then: [N('The stone is cool. Under your hand, for a moment, it feels a little warmer.')],
            },
            {
              id: 'read',
              label: 'Look for writing.',
              then: [
                N('There are marks under each panel in a script you can’t read. Pixel tries to zoom in and gets a lot of moss.'),
                PX('Sorry. Moss. Very high-resolution moss.'),
              ],
            },
          ],
        },
        done: {
          id: 'pa1-14-murals-done',
          lines: [
            N('Footsteps behind you. Sonic comes in out of the rain, shaking himself like a dog.'),
            SO('Hey. Following me again? Or am I following you? It’s getting hard to tell.'),
          ],
        },
      },
      {
        id: 'pa1-14-s2',
        goal: 'Listen to what the light has to say.',
        hint: 'Stand with Sonic in front of the murals.',
        check: 'watch:pa1-tikal:temple',
        scene: {
          id: 'pa1-14-tikal',
          lines: [
            N('The rosy light drifts out from behind a pillar and hangs in front of the murals.'),
            N('Then, for a moment, it isn’t a light. It’s a girl with braids, made of soft pink glow, standing in the temple.'),
            SO('Whoa. Uh. Hi?', 'shock'),
            TI('You’ve been fighting Chaos. I’ve watched you.', 'soft'),
            TI('It isn’t angry at you. It never really was. It’s carrying something too heavy, and it doesn’t know how to put it down.'),
            TI('When the ones it loved were hurt, it took all that grief and turned it into the only thing it knew. Power. A flood.'),
            TI('The man who calls himself Eggman is feeding it the Emeralds. Each one makes the grief bigger. Not the creature. The grief.', 'sad'),
            SO('So how do I stop it?'),
            TI('I don’t know that you can stop it. I couldn’t. I could only hold it.'),
            TI('Maybe someone could help it put it down.', 'think'),
            N('She looks at you as she says it, and at your Nubbin. Then she is only a light again, and then not even that.'),
          ],
        },
        done: {
          id: 'pa1-14-tikal-done',
          lines: [
            SO('Well. That was new.'),
            SO('Grief, huh. Can’t outrun that one.', 'think'),
            N('He goes anyway, very fast, out into the rain.'),
          ],
        },
      },
    ],
    complete: {
      id: 'pa1-14-complete',
      lines: [
        PX('Keeper. I’ve got something to say, and it’s probably nothing.'),
        PX('Back home. Cinder. The old story, about the fierce one who loved the little ones too hard.', 'think'),
        PX('It’s probably nothing. It just feels like the same shape.', 'soft'),
        N('Your Nubbin looks up at the painted water-shape for a long time before it will come away.'),
      ],
    },
    rewards: [],
    sets: { 'pa1-14': true },
    notes:
      'The murals show only Sonic Adventure’s own story, in the game’s own art style; no real Maya glyphs or iconography ' +
      '(the script under the panels is invented and unreadable). Pixel’s nod to Cinder works whether or not cinder is set: ' +
      'by chapter 5 the valley knows the tale of the Four. Chaos is grief, said plainly here.',
  },

  // ---------------------------------------------------------------- PA1-15
  {
    id: 'pa1-15',
    code: 'PA1-15',
    title: 'Perfect Chaos',
    source: `${SRC}: Perfect Chaos floods Station Square`,
    audience: 'all',
    trigger: { where: WHERE, when: after('PA1-14') },
    requires: ['PA1-14'],
    speakers: [sEggman],
    steps: [
      {
        id: 'pa1-15-s1',
        goal: 'Get high when the water comes.',
        hint: 'Head for the fire escape on the side of the bank.',
        check: 'watch:pa1-flood:station-square',
        scene: {
          id: 'pa1-15-flood',
          lines: [
            N('By morning the last Emeralds are gone from Eggman’s ship. You find out where when the sky over Station Square turns dark green.'),
            N('Out of the bay rises Chaos, and it keeps rising: a great serpent of clear water with a green-white glow, taller than the hotel.'),
            N('Eggman’s new ship roars in toward it, all guns and confidence. Chaos lifts one coil and swats it out of the sky like a fly.'),
            EG('That… was not in the plan!', 'shock'),
            N('Then the water comes. Not a wave, but a rising: a whole sea standing up and walking into the city.'),
            PX('Get up high. Keeper, get up high, now. Find a roof.', 'shock'),
            N('The streets are full of people running, some of them carrying Chao. Some of the Chao are carrying each other.'),
          ],
        },
        done: {
          id: 'pa1-15-flood-done',
          lines: [N('Water pours down the station steps like a waterfall going the wrong way.')],
        },
      },
      {
        id: 'pa1-15-s2',
        goal: 'Carry Chao and people up to the rooftops.',
        hint: 'Up the bank’s fire escape and back down. Pixel will count the floors.',
        check: 'carry:pa1-chao:rooftops',
        scene: {
          id: 'pa1-15-roofs',
          lines: [
            N('There’s a fire escape on the side of the bank. At the bottom of it, the water is already over your knees.'),
            N('A man with a pushchair, and a boy holding two Chao he found in a fountain. An old woman who won’t leave without her cat.'),
            PX('Pushchair first. Then the boy. I’ll count the floors for you; I can see the whole street from here.'),
            N('Up and down the iron stairs, over and over. Your Nubbin swims as it has never swum before, strong and steady, with a Chao on its back.'),
            N('From here you can’t see the hotel, or the garden behind it.'),
            PX('Two more down there. Go on. I’ve got the count.'),
          ],
          choices: [
            {
              id: 'cat',
              label: 'Go back for the old woman’s cat.',
              then: [N('The cat is on top of a postbox, furious and dry. It lets you carry it the way a queen lets you carry her luggage.')],
            },
            {
              id: 'raft',
              label: 'Go back for the Chao on a floating bin lid.',
              then: [N('The Chao is riding the bin lid like a raft, quite calm. It holds out its arms to your Nubbin as if it ordered a lift.')],
            },
          ],
        },
        done: {
          id: 'pa1-15-roofs-done',
          lines: [
            N('The roof of the bank is crowded and wet, and nobody is missing. The old woman’s cat sits on the air vent, judging everyone.'),
            PX('Everyone’s up. Everyone I can see is up. Good. Good.', 'soft'),
          ],
        },
      },
    ],
    complete: {
      id: 'pa1-15-complete',
      lines: [
        N('From the rooftop, the city is a lake. Chaos coils through it, huge and slow, roaring like the sea.'),
        N('It doesn’t seem to see the people on the roofs at all. It’s looking for something under the water, and not finding it.'),
        PX('It’s still looking for them. After all this time. It’s still looking for its Chao.', 'sad'),
      ],
    },
    rewards: [],
    sets: { 'pa1-15': true },
    notes:
      'CARE: the flood is spectacle. Nobody is shown in danger in the water; every carry ends on a roof, and “nobody is ' +
      'missing” is said outright. Eggman’s ship is swatted away and he is fine (he is heard complaining, offscreen, in ' +
      'PA1-16’s art if wanted). pa1-15-roofs#4 says nothing of the garden on purpose: the gate choice is paid in PA1-17. ' +
      'SIM: the Nubbin swims here whatever its Swim stat (cartridge world).',
  },

  // ---------------------------------------------------------------- PA1-16
  {
    id: 'pa1-16',
    code: 'PA1-16',
    title: 'Positive Energy',
    source: `${SRC}: the drained Emeralds and Super Sonic`,
    audience: 'all',
    trigger: { where: WHERE, when: after('PA1-15') },
    requires: ['PA1-15'],
    speakers: [sSonic, sKnuckles, sTails, sAmy, sBig, sEggman],
    steps: [
      {
        id: 'pa1-16-s1',
        goal: 'Watch Sonic’s friends bring him the Emeralds.',
        hint: 'Stay on the bank roof. They are coming to you.',
        check: 'watch:pa1-emeralds:rooftop',
        scene: {
          id: 'pa1-16-friends',
          lines: [
            N('Sonic lands on your roof, soaked and, for once, out of breath. He stares at the thing in the water.'),
            SO('Okay. That’s big. That’s really, really big.', 'shock'),
            N('One by one they come: Tails in his plane, Knuckles up the drainpipe, Amy with the blue bird. Big, with Froggy back in his hat.'),
            N('Each of them is holding an Emerald. All seven, dull now and grey-green, with the light drained out of them.'),
            KN('Chaos used them up. They’re empty. And nobody lick one to check.', 'angry'),
            N('Your Nubbin puts its tongue back in.'),
            KN('I saw that.'),
            TA('Not empty. Not all the way.', 'think'),
            TA('Chaos took the bad side of them, the anger, all that grief. But there’s still something left in them. The good.'),
            TA('Use what’s left, Sonic. Use the good.'),
          ],
        },
        done: {
          id: 'pa1-16-friends-done',
          lines: [
            N('Sonic looks round at all of them, and then, for some reason, at you and your Nubbin.'),
            SO('The good, huh. Okay. Let’s see what we’ve got.'),
          ],
        },
      },
      {
        id: 'pa1-16-s2',
        goal: 'Hold the Chao close and watch.',
        hint: 'Stay on the roof with the Chao in your arms.',
        check: 'watch:pa1-super:sky',
        scene: {
          id: 'pa1-16-super',
          lines: [
            N('The Emeralds rise out of everybody’s hands and circle Sonic, slowly at first, then faster.'),
            N('They don’t blaze. They glow, soft and warm and gold, like seven lamps being lit in a dark house.'),
            N('A Chao from the fire escape climbs into your arms, then another. You hold them both, and your Nubbin holds on to your sleeve.'),
            N('Sonic goes gold all over, bright as a summer morning. Then he’s gone, up into the sky, flying.'),
            PX('He’s flying. He can fly now. Oh, I wish you could see your own face.', 'happy'),
            N('Out over the flooded city, a gold spark circles a great coil of water, round and round, like a bee round a bear.'),
          ],
          choices: [
            {
              id: 'hold',
              label: 'Hold the Chao and watch.',
              then: [N('You hold them and watch. One of them falls asleep, which seems like the bravest thing anyone has done all day.')],
            },
            {
              id: 'cheer',
              label: 'Cheer.',
              then: [N('You cheer, and Amy cheers louder. Big cheers so loud that Froggy hides in his hat.')],
            },
          ],
        },
        done: {
          id: 'pa1-16-super-done',
          lines: [
            N('The gold spark strikes, and strikes again. Chaos roars and shrinks, and roars and shrinks.'),
            N('Then the water goes down all at once, the way a bath drains when someone pulls the plug.'),
          ],
        },
      },
    ],
    complete: {
      id: 'pa1-16-complete',
      lines: [
        N('The sea pulls back out of the streets. Cars, benches and lamp posts come up out of it, dripping and surprised.'),
        N('Far out in the bay, something round bobs under a parachute with its own face on it.'),
        EG('I’m fine! Nobody asked, but I’m FINE!', 'angry'),
        PX('Nobody asked.'),
        N('In the middle of the square, in a puddle no bigger than a pond, something small is left.'),
        PX('Is that…?', 'think'),
      ],
    },
    rewards: [],
    sets: { 'pa1-16': true },
    notes:
      'The Keeper holds the Chao and watches; Sonic’s fight is seen as a gold spark round the coil, never close up. Tails ' +
      'says the outline’s idea (use what’s left in them, the good) in our own words; no game line is used.',
  },

  // ---------------------------------------------------------------- PA1-17
  {
    id: 'pa1-17',
    code: 'PA1-17',
    title: 'The Chao',
    source: `${SRC}: Chaos sees the Chao at peace`,
    audience: 'all',
    trigger: { where: WHERE, when: after('PA1-16') },
    requires: ['PA1-16'],
    speakers: [sSonic, sAmy, sKnuckles],
    steps: [
      {
        id: 'pa1-17-s1',
        goal: 'Wade out to the small shape in the puddle.',
        hint: 'Down the fire escape and across the square to the fountain.',
        check: 'walk:pa1-square:puddle',
        scene: {
          id: 'pa1-17-small',
          lines: [
            N('You climb down the fire escape into ankle-deep water and wade across the square.'),
            N('In the puddle by the fountain is Chaos, the way you first saw it. Small now, person-sized, clear and quiet.'),
            N('The glow in its chest is faint and green. It isn’t trying to rise; it’s only looking around.'),
            SO('Easy. Easy, everybody. I don’t think it wants to fight anymore.'),
            N('Your Nubbin goes and sits at the edge of the puddle. Chaos looks down at it.'),
            PX('It thinks they’re gone, doesn’t it? It thinks it’s all happened again.', 'sad'),
          ],
          choices: [
            {
              id: 'sit',
              label: 'Sit down at the edge of the puddle, beside your Nubbin.',
              then: [N('You sit in the wet. Chaos looks at you, then back at your Nubbin, and doesn’t move away.')],
            },
            {
              id: 'back',
              label: 'Keep back and let it look.',
              then: [N('You stay where you are. Everyone in the square seems to have decided the same thing at once.')],
            },
          ],
        },
        done: {
          id: 'pa1-17-small-done',
          lines: [N('Chaos looks round the empty square: at the dripping buildings, at all the people, and at none of the small ones.')],
        },
      },
      {
        id: 'pa1-17-s2',
        goal: 'Let Chaos see the garden Chao.',
        hint: 'Look up at the hotel roof. (If you locked the gate, wade back to the garden and open it.)',
        check: 'watch:pa1-chao:puddle',
        scene: {
          id: 'pa1-17-chao',
          lines: [
            N('Then a sound comes from above: small, cheerful, unmistakable.'),
            N('Along the edge of the hotel roof, a whole row of Chao is sitting with their legs dangling over the gutter. The garden Chao.'),
            N('They went out through the open gate when the water came. They went where everyone went: up.'),
            N('Now, one by one, they come down: by the drainpipe, by the fire escape, by sliding down awnings with their arms out.'),
            N('They walk right up to the edge of the puddle. They aren’t afraid of it at all.'),
            N('Chaos looks at them. The glow in its chest goes still, and soft, and warm.'),
            PX('They’re all right. Oh, they’re all right. And it can see.', 'soft'),
            N('A Chao reaches up and touches the water. Chaos bends, slowly, and lets it.'),
          ],
        },
        done: {
          id: 'pa1-17-chao-done',
          lines: [
            N('Chaos sinks down, smaller and smaller, until it is only a little taller than the Chao themselves.'),
            N('It sits down in the puddle among them. For the first time since you’ve known it, it looks as if it’s resting.'),
          ],
        },
      },
    ],
    complete: {
      id: 'pa1-17-complete',
      lines: [
        SO('Huh. So that’s all it wanted.', 'soft'),
        AM('Of course that’s all it wanted. That’s all anybody wants.'),
        N('Knuckles doesn’t say anything. He wipes his eyes with the back of his glove and says it’s the rain.'),
      ],
    },
    rewards: [],
    sets: { 'pa1-17': true },
    notes:
      'PAYOFF of pa1-gate (PA1-2, fifteen quests back). open (or unset): play pa1-17-chao as written, check ' +
      'watch:pa1-chao:puddle. locked: play PA1_VARIANTS pa1-17-chao-locked in place of pa1-17-chao. SIM: with locked, ' +
      'step pa1-17-s2 uses the check escort:pa1-chao:puddle instead (wade back through the hotel lobby, unlock the gate, ' +
      'lead the Chao out to the puddle); the journal hint’s bracketed half shows only then. pa1-17-chao-done and the ' +
      'complete scene are shared. Pixel’s line “Safe isn’t the same as well, is it.” is in the locked variant only, said ' +
      'very quietly (lower speaker volume, no music under it).',
  },

  // ---------------------------------------------------------------- PA1-18
  {
    id: 'pa1-18',
    code: 'PA1-18',
    title: 'Tikal and Chaos',
    source: `${SRC}: Tikal and Chaos go together, at peace`,
    audience: 'all',
    trigger: { where: WHERE, when: after('PA1-17') },
    requires: ['PA1-17'],
    speakers: [sTikal, sSonic],
    steps: [
      {
        id: 'pa1-18-s1',
        goal: 'Watch the light come down to Chaos.',
        hint: 'Stay by the puddle, with the Chao.',
        check: 'watch:pa1-tikal:square',
        scene: {
          id: 'pa1-18-return',
          lines: [
            N('The rosy light comes down out of the clouds, slow as a falling petal, and stops above the puddle.'),
            N('It opens, and it is Tikal, standing barefoot in the water with the Chao round her ankles.'),
            TI('There you are. I’ve been looking for you for such a long time.', 'soft'),
            N('Chaos looks up at her. It doesn’t rise; it only looks, the way your Nubbin looks at you when you come home late.'),
            TI('It’s all right now. They’re all right. Look at them. It’s over.'),
            TI('You don’t have to hold it anymore. We can put it down together.'),
            N('She holds out her hand. Chaos lifts one watery hand and puts it in hers.'),
            SO('So… you two are going?'),
            TI('We’ve waited a long while to go. Thank you, Sonic. Thank you, all of you.', 'happy'),
          ],
          choices: [
            {
              id: 'bow',
              label: 'Bow to Chaos, as you did at the shrine.',
              then: [N('You bow. This time Chaos bows back, all the way, the way you would to an old friend.')],
            },
            {
              id: 'nubbin',
              label: 'Lift your Nubbin up so Chaos can see it.',
              then: [N('Chaos looks at your Nubbin for a long moment. Then it touches its head, very lightly, where the curl is.')],
            },
          ],
        },
        done: {
          id: 'pa1-18-return-done',
          lines: [N('Tikal turns to you last. The Chao round her feet turn too, as if they know whose turn it is.')],
        },
      },
      {
        id: 'pa1-18-s2',
        goal: 'Answer Tikal’s question.',
        hint: 'Talk to Tikal before she goes.',
        check: 'talk:pa1-tikal:square',
        scene: {
          id: 'pa1-18-farewell',
          lines: [
            TI('Before we go, I want to ask you something. Where you come from, do you have one like Chaos?', 'think'),
            TI('Someone who loved the little ones too much, and didn’t know what to do with it?'),
            N('Your Nubbin is sitting in the water by Chaos, holding one of its fingers.'),
            PX('Keeper. She means…', 'soft'),
            Y('We had one. A long time ago.'),
            TI('What happened to her?'),
          ],
        },
        done: {
          id: 'pa1-18-rhyme',
          lines: [
            N('You open your mouth, and find you don’t know how the story ends. Nobody back home does yet.'),
            N('Pixel hums something under her breath: four lines, the skipping tune from the lane. She stops before the last one.'),
            N('She doesn’t hum the rest, as if she’s just remembered what the last line says.'),
            TI('That sounds like an old one. The old ones are always a little sad.', 'soft'),
            TI('I hope somebody finds her. I hope she gets to put it down.'),
          ],
        },
      },
    ],
    complete: {
      id: 'pa1-18-complete',
      lines: [
        TI('Here. For you. I made it a long while ago, and it kept.', 'happy'),
        N('She lifts a crown of small pink and white flowers from her own hair and sets it on yours. It weighs nothing, and smells of warm stone.'),
        N('Then she takes Chaos’s hand again. The two of them turn to light together, pink and green, and rise, and the Chao wave until they’re gone.'),
        N('The world folds up gently round you, like a letter, and you are standing in the lantern shed with your Nubbin under your arm.'),
        PX('You’re back! You’ve got flowers in your hair. They came out with you. How did they come out with you?', 'shock'),
        PX('And your hair’s round again. I’ll be honest. I miss the square.'),
        PX('I never did ask about the tails. Ruling: some things stay a mystery. Two of them.'),
        N('On the side of the cabinet, where the dent was, a small brass plate has appeared, blank, waiting for a name.'),
        PX('A high-score plate. For High Score Night. When we’ve done another cartridge, we’ll do it properly.', 'happy'),
      ],
    },
    rewards: [
      {
        id: 'pa1-tikal-crown',
        kind: 'cosmetic',
        label: 'Tikal’s flower crown',
        description: 'A crown of small pink and white flowers that came out of the cartridge with you. It smells faintly of warm stone.',
      },
      {
        id: 'pa1-shrine-pool',
        kind: 'decor',
        label: 'Little shrine pool',
        description: 'A small stone pool for the Grove with seven coloured pebbles set round its rim. Nubbins like to sit in it.',
      },
      {
        id: 'pa1-score-plate',
        kind: 'feature',
        label: 'The cabinet’s high-score plate',
        description: 'A brass plate on Pixel’s cabinet with your name on it, ready for High Score Night.',
      },
    ],
    sets: { 'pa1-18': true, 'pa1-done': true },
    notes:
      'STOOD (pa1-stood true): play PA1_VARIANTS pa1-18-stood straight after pa1-18-return-done (Tikal’s one more line). ' +
      'CINDER (Grove, read-only): the step 2 done scene is pa1-18-rhyme when cinder is unset; with cinder = forgiven play ' +
      'pa1-18-cinder-forgiven in its place, with remembered play pa1-18-cinder-remembered. Pixel hums the tune of the ' +
      'Story Bible’s skipping rhyme without any of its words (a short, flat four-line hum on the speaker channel, cut ' +
      'off before the fourth line). LAST IMAGE: straight after ' +
      'pa1-18-complete play exactly one of pa1-18-last-open-stood, pa1-18-last-open, pa1-18-last-locked-stood, ' +
      'pa1-18-last-locked (pa1-gate unset counts as open; pa1-stood unset counts as false). REWARDS are one-time. The crown ' +
      'is a Grove hat cosmetic; the pool is Grove decor (art suggestion: a round stone basin, pebbles red, blue, yellow, ' +
      'green, purple, cyan and white). The plate is the frame’s: it carries your name once High Score Night unlocks (any ' +
      'two of PA1–PA5 done). None of these is a Grove flag; the cartridge writes pa1-done in its own save only.',
  },
];

// ================================================================== VARIANTS

/**
 * Variant scenes picked by flags.
 *   s21Done (Grove, read-only): pa1-01-shed-done-clank; pa1-11-garden-done-clank (replaces pa1-11-garden-done).
 *   pa1-gate (PA1-2): pa1-17-chao-locked; the last images.
 *   pa1-stood (PA1-10): pa1-18-stood; the last images.
 *   cinder (Grove, read-only): pa1-18-cinder-forgiven, pa1-18-cinder-remembered.
 */
export const PA1_VARIANTS: Scene[] = [
  // ---------------------------------------------------------------- PA1-1, replaces pa1-01-shed-done (s21Done)
  {
    id: 'pa1-01-shed-done-clank',
    lines: [
      N('Pixel blows the dust off the cartridge in one long puff and wipes the contacts on her sleeve.'),
      PX('Clean contacts, happy cartridge. Everyone knows that. Nobody knows why.'),
      N('Clank is sitting on top of the cabinet with his legs dangling over the edge of the screen.'),
      CK('Announcement: I am the lookout. Pixel said lookouts sit on top. I am on top.', 'happy'),
      PX('I said lookouts sit still.'),
      CK('I am sitting very still. Look how still. This is the stillest I have ever been.'),
      N('His legs go on swinging. Every few seconds one heel bonks the screen.'),
    ],
  },
  // ---------------------------------------------------------------- PA1-11, replaces pa1-11-garden-done (s21Done)
  {
    id: 'pa1-11-garden-done-clank',
    lines: [
      N('The last Chao is in the last lifeboat. You pull the lever, and it drops away under a parachute with Eggman’s face on it.'),
      PX('I can’t believe the parachutes have his face on them. No, I can. I can’t. I can.', 'happy'),
      CK('Announcement: that parachute has a FACE on it. I would like a parachute with MY face on it.', 'happy'),
      PX('It’s the villain’s face, Clank.'),
      CK('Then I would like a very small villain.'),
    ],
  },
  // ---------------------------------------------------------------- PA1-17, replaces pa1-17-chao (pa1-gate locked)
  {
    id: 'pa1-17-chao-locked',
    lines: [
      N('Chaos looks round for them, and there are none. Not on the roofs, not in the streets.'),
      N('Your stomach drops. The garden, the gate, the little key you turned.'),
      Y('They’re still in there.'),
      N('You wade back across the square and through the hotel lobby, where the water is up to your waist and full of floating menus.'),
      N('The garden gate is still locked. Behind it, on top of the palm tree and the fruit tree and each other, the Chao are huddled, wet and very quiet.'),
      N('They’re all alive. Not one of them is moving.'),
      PX('Safe isn’t the same as well, is it.', 'soft'),
      N('You turn the key. Your Nubbin goes in first, and one by one they come down out of the trees and follow it.'),
      N('You lead them out through the lobby, across the square, to the edge of the puddle.'),
      N('Chaos looks at them. The glow in its chest goes still, and soft, and warm.'),
    ],
  },
  // ---------------------------------------------------------------- PA1-18, after pa1-18-return-done (pa1-stood true)
  {
    id: 'pa1-18-stood',
    lines: [
      TI('You stood beside me, on the steps. In front of all of them.', 'soft'),
      TI('It didn’t change anything. I’ve had a very long time to think about that, and it still mattered.'),
      N('She squeezes your hand once. Her hand is warm, though it’s made of light.'),
    ],
  },
  // ---------------------------------------------------------------- PA1-18, replaces pa1-18-rhyme (cinder forgiven)
  {
    id: 'pa1-18-cinder-forgiven',
    lines: [
      Y('She was called Cinder. She loved them fiercely, and she held on too tight, and they went still.'),
      Y('At the end, somebody went up the mountain and found her. And she was forgiven.'),
      N('Tikal smiles, slowly, the way the sun comes out after rain.'),
      TI('Forgiven. Oh, I’m glad. I’m so glad.', 'happy'),
      TI('Then she can rest. That’s all the fierce ones want, in the end, even if they don’t know it.', 'soft'),
    ],
  },
  // ---------------------------------------------------------------- PA1-18, replaces pa1-18-rhyme (cinder remembered)
  {
    id: 'pa1-18-cinder-remembered',
    lines: [
      Y('She was called Cinder. She held on too tight, and the ones she loved went still.'),
      Y('We don’t forgive all of it. But we remember ours.'),
      TI('Remember. Yes. That’s a kind of keeping too.', 'soft'),
      N('Your Nubbin feels about in its fur and brings out a red petal from the hill at home, a bit crumpled. It gives it to the nearest Chao.'),
      N('The Chao holds the petal up to the light, and its ball turns into a heart.'),
    ],
  },
  // ---------------------------------------------------------------- PA1-18, after pa1-18-complete: the last image
  {
    id: 'pa1-18-last-open-stood',
    lines: [
      N('The screen holds one last picture before it goes dark: the hotel roof at sunset, a row of Chao along the gutter with their legs dangling.'),
      N('Up in one corner, very small, are two lights, pink and green, and a little square figure beside them who looks a lot like you.'),
      PX('That’s you. It put you in the ending. You’re in the ending!', 'happy'),
    ],
  },
  {
    id: 'pa1-18-last-open',
    lines: [
      N('The screen holds one last picture before it goes dark: the hotel roof at sunset, a row of Chao along the gutter with their legs dangling.'),
      N('Up in one corner, very small, two lights, pink and green, drift over the city and away, side by side.'),
      PX('Every one of them out, and up. Good.', 'soft'),
    ],
  },
  {
    id: 'pa1-18-last-locked-stood',
    lines: [
      N('The screen holds one last picture before it goes dark: the garden behind the hotel, its little gate standing wide open.'),
      N('A Chao is swinging on the gate. Above the palm tree hang two lights, pink and green, with a little square figure beside them who looks a lot like you.'),
      PX('Open. They’ve drawn it open. And you’re in it, look.', 'soft'),
    ],
  },
  {
    id: 'pa1-18-last-locked',
    lines: [
      N('The screen holds one last picture before it goes dark: the garden behind the hotel, its little gate standing wide open.'),
      N('A Chao is swinging on the gate, back and forth. Above the palm tree, two lights, pink and green, drift up through the glass roof and away.'),
      PX('Open. Next time, we leave it open from the start. Deal?', 'soft'),
    ],
  },
];

// ================================================================== FLAGS AND CHECKS

/** Every flag this cartridge sets (its own save only). It reads s21Done and cinder and writes no Grove flag. */
export const ARCADE_PA1_FLAGS: string[] = [
  'pa1-01',
  'pa1-02',
  'pa1-03',
  'pa1-04',
  'pa1-05',
  'pa1-06',
  'pa1-07',
  'pa1-08',
  'pa1-09',
  'pa1-10',
  'pa1-11',
  'pa1-12',
  'pa1-13',
  'pa1-14',
  'pa1-15',
  'pa1-16',
  'pa1-17',
  'pa1-18',
  'pa1-done', // PA1-18: the whole cartridge; counted by the frame for High Score Night
  'pa1-gate', // locked | open (pa1-02-gate): PA1-17 and PA1-18's last image
  'pa1-stood', // true | false (pa1-10-stand): pa1-18-stood and PA1-18's last image
];

export const ARCADE_PA1_CHECKS: string[] = [
  'inspect:pa1-cabinet:lantern-shed',
  'place:pa1-cartridge:cabinet',
  'explore:pa1-chao-garden:station-square',
  'choose:pa1-gate:garden',
  'walk:pa1-square:police-line',
  'watch:pa1-chaos:drain',
  'walk:pa1-light:back-street',
  'sit:pa1-shrine:pool',
  'visit:pa1-mystic-ruins:workshop',
  'give:pa1-spanner:tails',
  'watch:pa1-eggman:workshop',
  'climb:pa1-shrine:angel-island',
  'find:pa1-shard:jungle',
  'find:pa1-light:altar',
  'sit:pa1-tikal:altar',
  'talk:pa1-amy:square',
  'carry:pa1-bird:chao-garden',
  'watch:pa1-gamma:chao-garden',
  'talk:pa1-big:jungle',
  'sit:pa1-big:river',
  'watch:pa1-clan:altar',
  'choose:pa1-tikal:altar',
  'climb:pa1-egg-carrier:deck',
  'carry:pa1-chao:lifeboats',
  'watch:pa1-chaos:egg-carrier',
  'watch:pa1-gamma:hangar',
  'watch:pa1-gamma:cradles',
  'watch:pa1-bird:sky',
  'watch:pa1-shrine:dawn',
  'wait:pa1-light:shrine',
  'inspect:pa1-murals:temple',
  'watch:pa1-tikal:temple',
  'watch:pa1-flood:station-square',
  'carry:pa1-chao:rooftops',
  'watch:pa1-emeralds:rooftop',
  'watch:pa1-super:sky',
  'walk:pa1-square:puddle',
  'watch:pa1-chao:puddle',
  'escort:pa1-chao:puddle', // PA1-17 step 2 when pa1-gate is locked (see its notes)
  'watch:pa1-tikal:square',
  'talk:pa1-tikal:square',
];
