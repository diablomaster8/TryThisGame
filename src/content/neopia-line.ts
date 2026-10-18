/**
 * The Neopia line: NP1–NP13, the thirteen classic Neopets site plots (2000–2008),
 * replayed once each by the Keeper and their Nubbins. Dr. Sloth is the running
 * thread: planted in NP1–NP4 (a robot, a voice, a portrait and a butler, a spy fly)
 * and trapped for good in NP13.
 *
 * Plots follow the brief's summaries of the original site plots. Every line of
 * dialogue is new. Character names are the Neopets names the brief gives; minor
 * characters the brief doesn't name are given role names (The Cook, The Archivist).
 *
 * Audience: 'all' for NP1, NP3, NP4, NP6, NP11, NP12, NP13. 'main' (the main game only,
 * never the Learning Grove; nothing crude) for the war and dark plots NP2, NP5, NP7, NP8,
 * NP9 and the Haunted Woods plot NP10. Nothing in Neopia is 'teen' or 'adult'.
 *
 * Order: `requires` holds only what each plot's story needs, so the Learning Grove can
 * reach every 'all' plot: NP1 → NP3 → NP4 → NP6 → NP11 → NP12 → NP13. In the main game
 * the plots still play in number order: each plot also waits for the previous plot that
 * is available in that mode (an engine rule), so NP2 comes before NP3, NP5 before NP6, and
 * NP7–NP10 before NP11. Lines that recap a 'main' plot have childLines.
 *
 * Flags: every plot sets `np-<nn>-done`; choices set `np-<nn>-*` flags. NP13 sets
 * `np-line-complete` and `np-lutari-gate`.
 *
 * Signature choice: `np-05-stance` (defend | parley | villagers, set at the Meri Acres
 * fence in NP5). It pays off in NEOPIA_LINE_VARIANTS, chosen the way the Atlas picks its
 * variants (sim/atlas.ts variantFor: `<scene id>-<flag value>`): np09-nabile-<stance>,
 * np11-diary-<stance> and np13-broadcast-<stance>. NP5 is main-only, so the flag is never
 * set in the Learning Grove and the variants need no childLines.
 */
import type { Line, Mood, Scene } from '../config/story';
import type { Quest, Speaker } from './types';

const l = (who: string, text: string, mood?: Mood): Line =>
  mood ? { who, text, mood } : { who, text };
const n = (text: string, mood?: Mood): Line => l('narrator', text, mood);

// ------------------------------------------------------------------ speakers
const SLOTH: Speaker = { id: 'sloth', name: 'Dr. Sloth', kind: 'other', basedOn: 'Dr. Sloth (Neopets)' };
const KELPBEARD: Speaker = { id: 'kelpbeard', name: 'King Kelpbeard', kind: 'other', basedOn: 'King Kelpbeard (Neopets)' };
const TAELIA: Speaker = { id: 'taelia', name: 'Taelia', kind: 'other', basedOn: 'Taelia the Snow Faerie (Neopets)' };
const LISHA: Speaker = { id: 'lisha', name: 'Lisha', kind: 'other', basedOn: 'Lisha (Neopets, Meridell plots)' };
const JERAN: Speaker = { id: 'jeran', name: 'Jeran', kind: 'other', basedOn: 'Jeran (Neopets, Meridell plots)' };
const SKARL: Speaker = { id: 'skarl', name: 'King Skarl', kind: 'other', basedOn: 'King Skarl (Neopets)' };
const DARIGAN: Speaker = { id: 'darigan', name: 'Lord Darigan', kind: 'other', basedOn: 'Lord Darigan (Neopets)' };

export const NEOPIA_LINE: Quest[] = [
  // ================================================================== NP1
  {
    id: 'np01',
    code: 'NP1',
    title: 'The Hunt for the Battledome',
    source: 'Neopets site plot: The Hunt for the Battledome (October 2000)',
    audience: 'all',
    trigger: { where: 'Neopia Central, just inside the rainbow gate', when: 'On your first visit to Neopia.' },
    speakers: [
      { id: 'sarkis', name: 'Sarkis', kind: 'other', basedOn: 'Sarkis (Neopets, Hunt for the Battledome)' },
      { id: 'ursulla', name: 'Ursulla', kind: 'other', basedOn: 'Ursulla (Neopets, Hunt for the Battledome)' },
      { id: 'buckley', name: 'Buckley', kind: 'other', basedOn: 'Buckley (Neopets, Hunt for the Battledome)' },
      { id: 'chesterpot', name: 'Professor Chesterpot', kind: 'other', basedOn: 'Professor Chesterpot (Neopets)' },
      KELPBEARD,
      SLOTH,
    ],
    steps: [
      {
        id: 'np01-step1',
        goal: 'Follow the brochure to Mystery Island and look for the next clue.',
        hint: 'Take the boat from Neopia Central’s harbour to Mystery Island and search the beach.',
        check: 'visit:neopia:mystery-island',
        scene: {
          id: 'np01-brochure',
          lines: [
            n('Past the rainbow gate, Neopia Central is all bunting and shop bells. Someone is waving a leaflet at you like a flag.'),
            l('sarkis', 'You! Keeper! You look brave, or at least awake. Have you seen this?', 'happy'),
            n('The leaflet says THE BATTLEDOME in gold letters. Underneath, smaller: Location secret. Bring a friend.'),
            n('Underneath that, smaller still: Terms and conditions apply. Conditions may be damp.'),
            l('ursulla', 'Sarkis found it in a soup bowl at the Soup Kitchen. We’re choosing to believe that’s a sign.'),
            l('buckley', 'I’m choosing to believe it’s litter. But I’ve packed sandwiches, so I’m coming.'),
            l('sarkis', 'There’s a palm tree printed on the back. Palm trees mean Mystery Island. Everyone knows that.', 'think'),
            l('ursulla', 'Everyone does not know that.'),
            n('Your Nubbin sniffs the leaflet, sneezes, and looks at the harbour with great interest.'),
            l('sarkis', 'Your little one’s in. So are you, yes? Say yes.', 'happy'),
          ],
          choices: [
            {
              id: 'np01-yes',
              label: 'Say yes. Obviously.',
              set: { 'np-01-eager': true },
              then: [
                l('sarkis', 'That’s the spirit. Buckley, give them a sandwich.', 'happy'),
                l('buckley', 'It’s cheese. Don’t get excited.'),
              ],
            },
            {
              id: 'np01-what',
              label: 'Ask what a Battledome actually is.',
              then: [
                l('ursulla', 'A place where pets test their skill. Fairly, with rules. Supposedly.'),
                l('sarkis', 'Supposedly the best place in the world!', 'happy'),
              ],
            },
            {
              id: 'np01-map',
              label: 'Point out there’s no map.',
              then: [
                l('buckley', 'Thank you. Finally. Someone with sense.', 'happy'),
                l('sarkis', 'Maps are for people who already know where they’re going.'),
              ],
            },
          ],
        },
        done: {
          id: 'np01-brochure-done',
          lines: [
            n('On the beach, half buried, is a bottle with a rolled-up note inside.'),
            l('ursulla', 'It says: The dome is under the waves. Ask for the professor. Trust nobody in a lab coat.', 'think'),
            l('buckley', 'Under the waves. Wonderful. I packed sandwiches, not gills.'),
            l('sarkis', 'Trust nobody in a lab coat. I’m in a cardigan. We’re fine.', 'happy'),
            n('Your Swim Nubbin is already wading in, delighted.', 'happy'),
          ],
        },
      },
      {
        id: 'np01-step2',
        goal: 'Dive to Maraqua with a Swim Nubbin and find Professor Chesterpot’s hidden house.',
        hint: 'Only Swim Nubbins can enter Maraqua. Look for a brass door among the coral.',
        check: 'find:place:chesterpots-house',
        scene: {
          id: 'np01-dive',
          lines: [
            n('A Maraquan guard hands you a bubble helmet. It smells of seaweed and other people’s breath.'),
            n('Only Swim Nubbins can follow you down. The others wait on the sand with Buckley and the sandwiches.'),
            n('Maraqua glows below: coral towers, lantern fish, a palace shaped like a giant shell.'),
            n('A sign at the city gate reads: WELCOME TO MARAQUA. PLEASE DO NOT TAP ON THE GLASS. There is no glass.'),
            l('ursulla', 'Ask for the professor, the note said. Quietly. He’s hiding for a reason.'),
            l('sarkis', 'Quietly. Right. Got it.'),
            l('sarkis', 'PROFESSOR? ANYONE? WE’VE GOT A BROCHURE!', 'shock'),
            l('ursulla', 'That was the opposite of quietly.'),
            n('Somewhere in the coral, a brass door snaps shut. A shutter rattles.'),
            l('sarkis', 'Well. Now we know somebody’s home.', 'happy'),
          ],
        },
        done: {
          id: 'np01-dive-done',
          lines: [
            l('chesterpot', 'If you’re selling sponges, I have plenty. If you’re a robot, I have a mop.', 'shock'),
            n('Your Nubbin pokes its head through the letterbox and blinks at him.'),
            l('chesterpot', 'Oh. You’re not a robot. Robots don’t blink like that. Come in, quickly.', 'soft'),
          ],
        },
      },
      {
        id: 'np01-step3',
        goal: 'Hold off Mechachiazilla for three rounds until Kelpbeard’s friend arrives.',
        hint: 'You only have to survive this bout. Swim Nubbins move fastest underwater.',
        check: 'karate:survive:mechachiazilla:3',
        scene: {
          id: 'np01-sloth',
          lines: [
            l('chesterpot', 'Yes, I built the Battledome. A place where pets test themselves safely, with rules.'),
            l('chesterpot', 'I hid it because someone wants it for armies, not sport. He writes to me. Green ink. Very neat.', 'think'),
            l('sarkis', 'Who does?'),
            n('Every lantern fish in the room goes dark at once.'),
            l('sloth', 'Professor. You never answer my letters. So I have come for the reply in person.'),
            n('Green light floods the window. A metal claw the size of a boat closes around the house.'),
            l('chesterpot', 'Keep the dome safe! The key is in the…', 'shock'),
            n('The claw lifts him away. Up from the trench rises a giant mechanical Chia, eyes like headlamps.'),
            l('sloth', 'Mechachiazilla, flatten the city. Slowly. I want them to watch.'),
            l('kelpbeard', 'Not in my kingdom. Keeper! Hold that machine back while I call an old friend.', 'angry'),
          ],
          choices: [
            {
              id: 'np01-front',
              label: 'Put your bravest Nubbin in front.',
              set: { 'np-01-tactic': 'front' },
              then: [n('Your Nubbin plants its feet and puffs itself up to twice its size. It is not twice as big. It is very brave.')],
            },
            {
              id: 'np01-noise',
              label: 'Make lots of noise to draw it away from the houses.',
              set: { 'np-01-tactic': 'noise' },
              then: [l('sarkis', 'Noise! I can do noise!', 'happy'), n('Sarkis does noise.')],
            },
            {
              id: 'np01-evacuate',
              label: 'Get the townsfolk into the palace first.',
              set: { 'np-01-tactic': 'evacuate' },
              then: [l('ursulla', 'Good. Buildings mend. People take longer.')],
            },
          ],
        },
        done: {
          id: 'np01-sloth-done',
          lines: [
            n('The seabed shudders. Something enormous and leafy climbs out of the trench.'),
            l('kelpbeard', 'Chiazilla! Thank you for coming, old friend.', 'happy'),
            n('Chiazilla wraps the machine in a hug it cannot escape. Bolts ping off in every direction.'),
            l('sloth', 'Keep your little dome, Kelpbeard. I have bigger plans, better robots and a far superior collar.', 'angry'),
            n('A green pod shoots toward the surface. The claw lets go, and the professor drifts down like a sycamore seed.'),
          ],
        },
      },
    ],
    complete: {
      id: 'np01-complete',
      lines: [
        l('chesterpot', 'Well. A secret isn’t much use once a robot has stood on it.', 'happy'),
        l('chesterpot', 'The Battledome is open. To everyone. Fair bouts, real rules, no armies.'),
        l('ursulla', 'Everyone? Even people like him?', 'think'),
        l('chesterpot', 'Especially people like him. A rule that only binds your friends isn’t a rule. It’s a favour.'),
        l('sarkis', 'We found it! Technically the robot found it. But we were there!', 'happy'),
        n('Back on the beach, Buckley hands round the sandwiches. They are slightly damp. Conditions, as promised, apply.'),
        n('The Neopian Times runs it as DOME SWEET DOME. Sarkis buys eleven copies and frames the crossword.'),
        n('By the rainbow gate, a new door appears, painted like a dome. Above it, a sign: Battledome. Play fair.'),
        n('Far above the sea, a green light blinks once and goes out.'),
      ],
    },
    rewards: [
      {
        id: 'np01-battledome',
        kind: 'feature',
        label: 'Battledome mode',
        description: 'Opens the Battledome in Neopia: battle items, weapons and challengers from every land, kept in the Neopia save.',
      },
      {
        id: 'np01-times',
        kind: 'item',
        label: 'Neopian Times: DOME SWEET DOME',
        description: 'This plot’s Neopian Times front page, kept in your Neopia scrapbook.',
      },
      {
        id: 'np01-avatar',
        kind: 'title',
        label: 'Avatar: Friend of Chiazilla',
        description: 'A trophy avatar for finding the Battledome.',
      },
    ],
    sets: { 'np-01-done': true },
    childLines: {
      'np01-sloth#8': 'Mechachiazilla, find that Battledome. Anything in the way, step over it. Loudly.',
    },
    notes:
      'Audience all. Steps 2–3 are underwater: only Swim Nubbins may be in the party (the Maraqua rule); the Keeper wears a bubble helmet. ' +
      'Sloth thread: first appearance, as a voice over the claw and a green escape pod; the closing green light is him watching. ' +
      'Step 3 is a survive-only karate bout (no win needed); Chiazilla arrives on a cutscene at round 3. Art: Mechachiazilla (giant robot Chia), Chiazilla (leafy giant Chia), Chesterpot’s brass door. ' +
      'Battledome is the only unlock the brief lists; the Neopian Times page and avatar follow the brief’s Features section and repeat for every plot.',
  },

  // ================================================================== NP2
  {
    id: 'np02',
    code: 'NP2',
    title: 'The Tyrannian Invasion',
    source: 'Neopets site plot: The Tyrannian Invasion (March–May 2001)',
    audience: 'main',
    trigger: { where: 'Terror Mountain, the Ice Caves', when: 'The first time you enter the Ice Caves after NP1.' },
    requires: ['NP1'],
    speakers: [
      TAELIA,
      { id: 'np02-lupe', name: 'The Lupe', kind: 'other', basedOn: 'The Lupe who defeated the Monoceraptor (Neopets)' },
      { id: 'np02-voice', name: 'A Voice', kind: 'other', basedOn: 'Dr. Sloth, unseen (Neopets)' },
    ],
    steps: [
      {
        id: 'np02-step1',
        goal: 'Hold the Ice Caves against the first wave: Korbat scouts.',
        hint: 'Wave bouts run back to back. Put Fly Nubbins up front against fliers.',
        check: 'karate:wave:tyrannian-invasion:1',
        scene: {
          id: 'np02-quake',
          lines: [
            n('The Ice Caves are blue and silent. Then they aren’t.'),
            n('The floor bucks. Icicles fall like dropped cutlery. A crack splits the far wall, and warm air pours out.'),
            n('It smells of moss, smoke, and something big that hasn’t washed.'),
            l('taelia', 'That crack goes down to Tyrannia. It has been sealed since before the mountain had a name.', 'shock'),
            l('np02-lupe', 'It isn’t sealed now. Listen.', 'think'),
            n('Wings. Hundreds of leathery wings, coming up out of the dark.'),
            l('np02-lupe', 'Korbat scouts. They’re here to count us. Let’s give them a small number to take home.'),
            l('taelia', 'Keeper, your Nubbins are quick. Hold the cave mouth while I warn Happy Valley.'),
            n('Your Nubbins line up at the cave mouth. One has an icicle stuck to its head and refuses to mention it.'),
          ],
        },
        done: {
          id: 'np02-quake-done',
          lines: [
            l('np02-lupe', 'Scouts are running home. That means the real thing is next.'),
            n('One Korbat circles back, counts your Nubbins on its claws, gets a different number twice, and gives up.', 'happy'),
            n('Far below, drums. Slow ones.'),
          ],
        },
      },
      {
        id: 'np02-step2',
        goal: 'Beat the second and third waves: Grarrl troopers, then Skeith invaders.',
        hint: 'Grarrls hit hard but slowly. Skeiths are slow to start, so strike early.',
        check: 'karate:wave:tyrannian-invasion:3',
        scene: {
          id: 'np02-troopers',
          lines: [
            n('By dawn the mountain road is full of armour: Grarrl troopers, shields up, stamping in time.'),
            n('Behind them, too lazy to march, Skeith invaders ride on carts pulled by other Skeiths.'),
            l('np02-lupe', 'They want the pass. If they get it, they get Happy Valley, and then the whole mountain.'),
            l('taelia', 'The toy workshop is still full of children finishing orders. We need time.'),
            n('A Grarrl captain bangs his shield and roars something that is mostly teeth.'),
            l('np02-lupe', 'Two waves. Troopers first, Skeiths after. Don’t chase them down the hill.'),
            n('Your Nubbins crouch, ready. The snow creaks under a great many feet.'),
            l('np02-lupe', 'So. Where do we stand?', 'think'),
          ],
          choices: [
            {
              id: 'np02-pass',
              label: 'Hold the narrow pass.',
              set: { 'np-02-tactic': 'pass' },
              then: [l('np02-lupe', 'Good. Narrow means one at a time. Even Grarrls only fit one at a time.')],
            },
            {
              id: 'np02-lodge',
              label: 'Fall back to the Ski Lodge walls.',
              set: { 'np-02-tactic': 'lodge' },
              then: [l('taelia', 'The walls are thick and the cocoa is hot. I approve of both.', 'happy')],
            },
            {
              id: 'np02-scout',
              label: 'Send a Fly Nubbin up to watch their flanks.',
              set: { 'np-02-tactic': 'scout' },
              then: [
                n('Your Fly Nubbin circles high and comes back chirping. There’s a goat track the Skeiths are too lazy to climb.'),
                l('np02-lupe', 'Then that’s our door.'),
              ],
            },
          ],
        },
        done: {
          id: 'np02-troopers-done',
          lines: [
            n('The Skeiths decide this is all too much effort and sit down in the snow. Several fall asleep.'),
            l('np02-lupe', 'I’d call it a weakness, but honestly they look comfortable.'),
          ],
        },
      },
      {
        id: 'np02-step3',
        goal: 'Beat the fourth wave: Chia bombers over Happy Valley.',
        hint: 'Bombers drop sticky patches that slow you. Keep moving and let Taelia freeze the ground.',
        check: 'karate:wave:tyrannian-invasion:4',
        scene: {
          id: 'np02-bombers',
          lines: [
            n('A whistle overhead. Then another. Then the sky is full of round shapes, falling.'),
            l('taelia', 'Chia bombers! They’re dropping something from the clouds!', 'shock'),
            n('A pod bursts on the toy workshop roof. It’s full of extremely sticky sap.'),
            l('np02-lupe', 'Tar-fruit. Get stuck in that and you stay stuck.'),
            n('One of your Nubbins steps in a puddle of it and now has very firm opinions about the floor.'),
            l('taelia', 'I can freeze the tar so it cracks. But only if someone keeps the bombers busy.'),
            l('np02-lupe', 'The Keeper’s Nubbins. They’re faster than my lot, and they don’t complain.'),
            n('Your Nubbins look at each other. One complains a little.'),
          ],
        },
        done: {
          id: 'np02-bombers-done',
          lines: [
            l('taelia', 'Frozen. Crack it and walk on.', 'happy'),
            n('The tar shatters like toffee. The workshop windows are saved, mostly.'),
            l('np02-lupe', 'Tar-fruit brittle. If we live through this, I’m selling it in Happy Valley.', 'happy'),
          ],
        },
      },
      {
        id: 'np02-step4',
        goal: 'Keep the Monoceraptor busy for three rounds so the Lupe can strike.',
        hint: 'You can’t win this bout on damage. Dodge, and stay close to draw its eye.',
        check: 'karate:survive:monoceraptor:3',
        scene: {
          id: 'np02-monoceraptor',
          lines: [
            n('The mountain goes quiet. Even the wind waits.'),
            n('Up from the crack climbs a beast with one great horn and a jaw like a castle gate.'),
            l('taelia', 'The Monoceraptor. The old stories said it was the last thing Tyrannia would ever send.', 'shock'),
            l('np02-lupe', 'Then it’s the last thing we have to beat.'),
            l('np02-lupe', 'I need it to look away from me for one breath. One. That’s all.', 'think'),
            n('Your Nubbins press against your legs. One is shaking. It doesn’t step back.'),
            n('The Monoceraptor lowers its horn and paws the ice.'),
            l('np02-lupe', 'Keeper. Your call.'),
          ],
          choices: [
            {
              id: 'np02-circles',
              label: 'Have your Nubbins run circles round its feet.',
              set: { 'np-02-lure': 'circles' },
              then: [n('Your Nubbins scatter five ways at once. The Monoceraptor tries to watch them all and cricks its neck.')],
            },
            {
              id: 'np02-shout',
              label: 'Stand in the open and shout at it yourself.',
              set: { 'np-02-lure': 'shout' },
              then: [l('you', 'Oi! Horn-face! Over here!'), l('np02-lupe', 'That will definitely work. Run now.')],
            },
            {
              id: 'np02-snowball',
              label: 'Throw a snowball at its eye.',
              set: { 'np-02-lure': 'snowball' },
              then: [n('It is a good snowball. It is not a big snowball. It is enough.')],
            },
          ],
        },
        done: {
          id: 'np02-monoceraptor-done',
          lines: [
            n('One leap. One blow, right under the horn. The Monoceraptor sways, sits, and topples back into the crack.'),
            l('np02-lupe', 'Done. Someone write that down. I won’t remember how.', 'happy'),
          ],
        },
      },
    ],
    complete: {
      id: 'np02-complete',
      lines: [
        n('The crack groans. Far below, something answers.'),
        l('np02-voice', 'A useful test. Thank you. I learned a great deal about your mountain.'),
        l('np02-voice', 'Tyrannia was only the first door. Next time, Keeper, I bring an army of my own.'),
        l('taelia', 'Who was that?', 'think'),
        l('np02-lupe', 'Nobody from Tyrannia. Tyrannians don’t say thank you.', 'think'),
        l('np02-lupe', 'Half the Grarrls we fought had farm mud on their boots. Somebody marched them up here.'),
        l('taelia', 'So what do we do with the hole? Wall it up for good, or leave a door?', 'think'),
        n('Your Nubbins look down the crack, then at each other. One drops a snowball in, to see how deep it goes. It is still falling.'),
      ],
      choices: [
        {
          id: 'np02-seal',
          label: 'Wall it up. Nobody gets marched up here again.',
          set: { 'np-02-crack': 'sealed' },
          then: [
            n('Taelia raises a wall of ice a hundred feet thick. Your Nubbins add a snowball each, to be safe.'),
            l('np02-lupe', 'Safe. Cold, but safe. Most good things up here are both.'),
            n('The Neopian Times prints it: MOUNTAIN HOLDS. The photo is mostly snow and one Nubbin’s blurry tail.'),
          ],
        },
        {
          id: 'np02-door',
          label: 'Leave a door with a bell. Neighbours should be able to knock.',
          set: { 'np-02-crack': 'door' },
          then: [
            n('Taelia shapes an ice door with a brass bell. A sign beside it, in three languages: KNOCK. NO ARMIES.'),
            l('np02-lupe', 'If those farmers ever come up on their own, they’ll want somewhere to knock.', 'soft'),
            n('The Neopian Times prints it: MOUNTAIN HOLDS (PLEASE KNOCK). The photo is mostly snow and one Nubbin’s blurry tail.'),
          ],
        },
      ],
    },
    rewards: [
      {
        id: 'np02-times',
        kind: 'item',
        label: 'Neopian Times: MOUNTAIN HOLDS',
        description: 'This plot’s Neopian Times front page, kept in your Neopia scrapbook.',
      },
      {
        id: 'np02-avatar',
        kind: 'title',
        label: 'Avatar: Defender of Terror Mountain',
        description: 'A trophy avatar for turning back the Tyrannian Invasion.',
      },
    ],
    sets: { 'np-02-done': true },
    notes:
      'Audience main: a war plot, so it stays out of the Learning Grove. Nothing crude; the rating is only about the battle theme. ' +
      'Plays as a run of karate bouts in waves (karate:wave:tyrannian-invasion:<n> counts waves cleared): 1 Korbat scouts (fliers), 2 Grarrl troopers (heavy, slow), ' +
      '3 Skeith invaders (slow starters), 4 Chia bombers (drop sap patches that slow movement; Taelia freezes them on a timer), then the Monoceraptor as a 3-round survive bout; the Lupe lands the finishing blow in a cutscene. ' +
      'No healing between waves inside a step; full heal between steps. ' +
      'Sloth thread: the Voice in the closing scene is Sloth, never named here. NP13 calls back to it. Sound: distant drums under step 1 done. ' +
      'Closing choice sets `np-02-crack` (sealed | door): an ice wall or an ice door with a bell in the Ice Caves art. Flavour only; Tyrannia is still reached by its usual route either way. ' +
      'The brief lists no unlock for NP2: rewards are the standard Times page and avatar.',
  },

  // ================================================================== NP3
  {
    id: 'np03',
    code: 'NP3',
    title: 'The Ski Lodge Mystery',
    source: 'Neopets site plot: The Ski Lodge Murder Mystery (February–May 2001), all-ages version',
    audience: 'all',
    trigger: { where: 'Terror Mountain, the Ski Lodge', when: 'After NP1 (in the main game, after NP2), a letter from the Lodge Manager arrives by snow-post.' },
    requires: ['NP1'],
    speakers: [
      { id: 'np03-manager', name: 'The Lodge Manager', kind: 'other' },
      { id: 'np03-guest', name: 'A Kacheek Guest', kind: 'other' },
      { id: 'maverick', name: 'Maverick', kind: 'other', basedOn: 'Maverick, the robot culprit of the Ski Lodge plot (Neopets)' },
      TAELIA,
    ],
    steps: [
      {
        id: 'np03-step1',
        goal: 'Question the four guests and staff still at the lodge.',
        hint: 'They are in the lounge, the kitchen, the ski shed and the hot tub. Tap each to talk.',
        check: 'talk:ski-lodge:guests:4',
        scene: {
          id: 'np03-arrive',
          lines: [
            n('The Ski Lodge is warm, pine-panelled, and far too quiet for a holiday.'),
            l('np03-manager', 'Welcome, welcome. Please don’t leave. I mean, enjoy your stay. I mean, please don’t leave.', 'shock'),
            l('np03-manager', 'Three guests have gone missing this week. Their skis are still in the rack. Their cocoa was still warm.', 'sad'),
            n('Over the fireplace hangs a portrait of the old owner: a thin green face, a high collar, a smile that reaches nothing.'),
            l('np03-manager', 'Him? He owned the place before me. Sold it cheap and left in a hurry.', 'think'),
            l('np03-manager', 'I’ve never managed to take that painting down. The nails are bolted to something.'),
            n('A new bellhop glides past with a tray. It doesn’t bounce when it walks. It doesn’t blink.'),
            l('maverick', 'Good evening. I am Maverick. Your room is ready. Your room is always ready.'),
            n('Your Nubbin hides behind your boot and watches Maverick all the way down the corridor.'),
          ],
          choices: [
            {
              id: 'np03-portrait',
              label: 'Look closer at the portrait.',
              then: [n('In one corner, painted very small, is a fly. Up close, its wings are real metal.', 'think')],
            },
            {
              id: 'np03-bellhop',
              label: 'Ask about the new bellhop.',
              then: [l('np03-manager', 'Maverick? He came with the building. Never sleeps. Never eats. Never gets my name right.')],
            },
            {
              id: 'np03-cocoa',
              label: 'Order a cocoa and keep your eyes open.',
              then: [n('The cocoa is excellent. Your eyes stay open. Your Nubbin’s do not.', 'happy')],
            },
          ],
        },
        done: {
          id: 'np03-arrive-done',
          lines: [
            n('Everyone saw something cold in the night. Nobody saw who.'),
            l('np03-guest', 'I heard whirring. Then a polite cough. Then I hid in a wardrobe until it was light.', 'shock'),
            l('np03-manager', 'And now the cook’s gone too.', 'shock'),
            l('maverick', 'Breakfast is cancelled. Breakfast is always cancelled.'),
          ],
        },
      },
      {
        id: 'np03-step2',
        goal: 'Follow the frosty trail and find three clues.',
        hint: 'Look for oil drops, frost marks and anything metal. Your Nubbin will sniff out ones you miss.',
        check: 'find:clue:ski-lodge:3',
        scene: {
          id: 'np03-trail',
          lines: [
            n('Morning. The cook’s apron lies on the kitchen floor, stiff with frost.'),
            n('A trail crosses the tiles: little drops of oil, and square footprints that steam slightly.'),
            l('np03-guest', 'Square feet! Who has square feet? I have normal feet. Look.', 'shock'),
            l('np03-manager', 'Please keep your feet on.'),
            n('Your Nubbin follows the trail with its nose, then sneezes. Oil. Definitely oil.'),
            l('np03-manager', 'It goes toward the cellar. Nobody goes in the cellar. It came with the building too.'),
            n('The cellar door is locked from the inside.'),
            l('np03-guest', 'Well, I’m not saying who I suspect. But I suspect someone.', 'think'),
          ],
          choices: [
            {
              id: 'np03-sus-manager',
              label: 'Suspect the manager. He bought the place cheap.',
              set: { 'np-03-suspect': 'manager' },
              then: [l('np03-manager', 'Me? I’m far too tired to kidnap anyone. Look at my eyes.', 'sad')],
            },
            {
              id: 'np03-sus-guest',
              label: 'Suspect the guest with the very normal feet.',
              set: { 'np-03-suspect': 'guest' },
              then: [l('np03-guest', 'I came here to ski! I can’t even ski! That’s my alibi!', 'angry')],
            },
            {
              id: 'np03-sus-maverick',
              label: 'Suspect Maverick.',
              set: { 'np-03-suspect': 'maverick' },
              then: [n('Upstairs, very softly, something whirrs.')],
            },
          ],
        },
        done: {
          id: 'np03-trail-done',
          lines: [
            n('The third clue is a metal button, warm to the touch, stamped with a small green V.'),
            l('np03-manager', 'V. V for… vacuum? Vacation? Very Suspicious?', 'think'),
            l('np03-guest', 'That’s two letters.'),
            n('You pocket it. It hums faintly, as if it is still listening.'),
          ],
        },
      },
      {
        id: 'np03-step3',
        goal: 'Switch Maverick off in a karate bout without cracking the ice blocks.',
        hint: 'Maverick is slow to turn. Circle him and hit the switch on his back.',
        check: 'karate:win:maverick',
        scene: {
          id: 'np03-cellar',
          lines: [
            n('The cellar is colder than outside. Ice blocks stand along the walls like a library of frozen books.'),
            n('In each block, a guest: eyes shut, cheeks pink, perfectly still. The cook is still holding a whisk.'),
            l('np03-manager', 'They’re frozen. Not hurt. Just… frozen.', 'shock'),
            l('maverick', 'Correct. Frozen guests do not complain, check out, or ask for extra towels.'),
            l('maverick', 'My orders are to keep the lodge empty until the owner returns. He has not returned. So I keep it empty.'),
            l('you', 'Who gave you those orders?'),
            l('maverick', 'The owner. His voice is in my memory. Would you like to hear it?'),
            n('A crackle, then a thin, pleased voice: “Keep it empty, Maverick. I’ll be back for it.”'),
            l('maverick', 'Please step into the freezer. Your room is ready. Your room is always ready.'),
          ],
        },
        done: {
          id: 'np03-cellar-done',
          lines: [
            n('Your Nubbin hops onto Maverick’s back and sits squarely on the big red switch.'),
            l('maverick', 'Your room is… ready…'),
            n('His eyes go dark. The whirring stops.'),
            l('np03-manager', 'What do we do with him? He froze my cook. He also polished every spoon in the building.', 'think'),
          ],
          choices: [
            {
              id: 'np03-scrap',
              label: 'Melt him down. Orders or not, he froze people.',
              set: { 'np-03-maverick': 'scrapped' },
              then: [l('np03-manager', 'Fair. I’ll keep his bow tie, though. It’s a very good bow tie.', 'sad')],
            },
            {
              id: 'np03-rehire',
              label: 'Wipe his orders and give him an honest job.',
              set: { 'np-03-maverick': 'rehired' },
              then: [
                n('Later, wiped clean and rebooted, Maverick bows to the first guest down the stairs.'),
                l('maverick', 'Your room is ready. You may leave it whenever you like. That part is new.', 'soft'),
              ],
            },
          ],
        },
      },
    ],
    complete: {
      id: 'np03-complete',
      lines: [
        l('taelia', 'Somebody called for a Snow Faerie? Oh my. That is a lot of very cold people.', 'shock'),
        n('Taelia breathes on each block gently, the way you’d breathe on a window.'),
        n('The guests thaw one by one, sneeze, and ask what time breakfast is.'),
        l('np03-guest', 'I had the strangest dream. I was an ice lolly.', 'think'),
        l('np03-manager', 'Free cocoa for life. For you, your Nubbins and anyone you bring. I mean it.', 'happy'),
        l('taelia', 'Whoever built that robot built it to wait. That kind of patience doesn’t give up.', 'think'),
        n('Upstairs, the portrait has been taken down. Behind it is a bare patch of wall and four bolts, already unscrewed.'),
        n('The Neopian Times runs it as COLD CASE CLOSED, with a cartoon of Maverick in a bobble hat. It sells out.'),
      ],
    },
    rewards: [
      {
        id: 'np03-times',
        kind: 'item',
        label: 'Neopian Times: COLD CASE CLOSED',
        description: 'This plot’s Neopian Times front page, kept in your Neopia scrapbook.',
      },
      {
        id: 'np03-avatar',
        kind: 'title',
        label: 'Avatar: Lodge Detective',
        description: 'A trophy avatar for unmasking Maverick.',
      },
    ],
    sets: { 'np-03-done': true },
    notes:
      'Requires NP1 only, so the Learning Grove can reach it; the main game still plays it after NP2 (see the header). ' +
      'Audience all. The original was a murder mystery; here the guests are frozen in ice, never hurt, and Taelia thaws them all at the end, as the brief requires. ' +
      'The suspect choice in step 2 is flavour only; Maverick is always the culprit. ' +
      'The step 3 done choice sets `np-03-maverick` (scrapped | rehired): if rehired, Maverick stands at the lodge desk on later visits as a harmless bellhop. ' +
      'Sloth thread: the portrait of the old owner (Sloth, never named), the metal fly painted in its corner (it reappears for real in NP4), the button stamped V (Virtupets), and the recorded voice. The portrait vanishing at the end means he has been back. ' +
      'Step 3 bout has a fail state if a fighter is knocked into an ice block (block cracks, bout restarts; no harm to the guest). ' +
      'Art: Maverick as a tall butler-robot with a red switch on his back; square steaming footprints. No unlock listed in the brief; standard Times page and avatar.',
  },

  // ================================================================== NP4
  {
    id: 'np04',
    code: 'NP4',
    title: 'The Usurper',
    source: 'Neopets site plot: The Usurper (July 2001)',
    audience: 'all',
    trigger: { where: 'Lost Desert, Sakhmet palace', when: 'After NP3, an invitation to the palace feast.' },
    requires: ['NP3'],
    speakers: [
      { id: 'coltzan', name: 'King Coltzan III', kind: 'other', basedOn: 'King Coltzan III (Neopets)' },
      { id: 'sankara', name: 'Princess Sankara', kind: 'other', basedOn: 'Princess Sankara (Neopets)' },
      { id: 'vyssa', name: 'Vyssa', kind: 'other', basedOn: 'Vyssa (Neopets)' },
      { id: 'np04-cook', name: 'The Royal Cook', kind: 'other' },
      { id: 'np04-captain', name: 'The Captain of the Guard', kind: 'other' },
      { id: 'np04-scribe', name: 'The Court Scribe', kind: 'other' },
    ],
    steps: [
      {
        id: 'np04-step1',
        goal: 'Question the five people who served the high table.',
        hint: 'Sankara, Vyssa, the Cook, the Captain and the Scribe are all still in the hall. Tap each one.',
        check: 'talk:usurper:suspects:5',
        scene: {
          id: 'np04-feast',
          lines: [
            n('Sakhmet glows gold at sunset. The palace is feasting: Tyrannia was beaten back, and the voice in the dark has gone quiet.'),
            l('coltzan', 'Keeper! The friend of Terror Mountain. Sit, sit. Your Nubbins too. Nobody stands at my table.', 'happy'),
            n('The centrepiece is a cake shaped like a sulking green villain in a high collar. Guests cheer each time it’s cut.'),
            l('coltzan', 'To the villain who never came back! May he stay lost.', 'happy'),
            n('Five people carry the courses to the high table: Princess Sankara, Vyssa, the Royal Cook, the Captain of the Guard and the Court Scribe.'),
            n('Halfway through, the king lifts his tea, drinks, and sets the cup down too hard.'),
            l('coltzan', 'That tea… tastes of… sand.', 'shock'),
            n('He slumps in his chair. The music stops. Somebody screams, and a fig rolls off the table.'),
            l('sankara', 'Guards! Nobody leaves this hall!', 'angry'),
          ],
          choices: [
            {
              id: 'np04-help',
              label: 'Run to the king.',
              then: [n('His breathing is slow. The physicians move you gently aside.', 'sad')],
            },
            {
              id: 'np04-watch',
              label: 'Watch who looks at what.',
              set: { 'np-04-watchful': true },
              then: [n('Nobody runs. But the Scribe has ink to the elbows, and Vyssa won’t look anywhere near the tea tray.', 'think')],
            },
            {
              id: 'np04-nubbin',
              label: 'Get your Nubbin away from the food.',
              then: [n('Your Nubbin, who was reaching for a fig, is lifted up and away. It sulks.')],
            },
          ],
        },
        done: {
          id: 'np04-feast-done',
          lines: [
            n('Five stories. Five people who all say they carried only one dish. Your clue log opens a new page.'),
            l('np04-scribe', 'I’d like it noted that I have never tampered with anything. I’ve barely even misspelled anything.', 'sad'),
            l('np04-captain', 'The physicians are with the king. Nobody leaves until we know who did this.'),
            n('Somebody quietly removes the villain cake. It was looking far too pleased with itself.'),
          ],
        },
      },
      {
        id: 'np04-step2',
        goal: 'Find all eight clues and add them to your clue log.',
        hint: 'Some clues come from people, some from places: the stairs, the teapot, the oven and the garden.',
        check: 'find:clue:usurper:8',
        scene: {
          id: 'np04-clues',
          lines: [
            n('The hall is locked. Your clue log shows a blank grid: five servers, five dishes, one cup that was tampered with.'),
            l('np04-cook', 'I made everything, but I only carried one dish up myself. You eat mine with a spoon, and it was perfect.', 'angry'),
            l('np04-scribe', 'I had a small accident on the stairs. Please don’t look at the stairs.', 'sad'),
            l('np04-captain', 'I carried what came out of the oven. Hot. I burnt my thumb. Write that down too.'),
            l('vyssa', 'Don’t ask me about the tea. I can’t bear spice. I stayed well away from that pot.'),
            l('sankara', 'I served the king’s guests with my own hands, as a princess should. Is that a crime now?', 'angry'),
            n('Your Nubbin sniffs the tipped-over teapot, sneezes, and backs away with its ears flat.'),
            l('np04-captain', 'That pot went over right after the king drank. Clumsy, someone said. Very clumsy.', 'think'),
            n('Out in the garden, a gardener is muttering about something he overheard last night.'),
          ],
        },
        done: {
          id: 'np04-clues-done',
          lines: [
            n('Eight clues. The grid in your log is waiting.'),
            n('Your Nubbin curls up on the clue log, which is unhelpful, and warm.'),
          ],
        },
      },
      {
        id: 'np04-step3',
        goal: 'Fill in the clue log grid: who carried each dish, and which dish was tampered with.',
        hint: 'Start with the pudding: it never reached the table, so it can’t be the one, and neither can its carrier.',
        check: 'puzzle:solve:usurper',
        scene: {
          id: 'np04-solve',
          lines: [
            n('You sit by the window with the grid. Ticks, crosses, a lot of crossing out.'),
            l('np04-captain', 'Take your time. Actually, don’t. The princess wants to go to bed.'),
            l('np04-scribe', 'If it helps, I didn’t do it. I can’t even carry a pudding.', 'sad'),
            n('Five rows, five columns. Every clue rules something out.'),
            n('Something taps the window glass: a fly made of metal, with a tiny lens for a face and a green light on its back.'),
            n('You look again and it has gone. Or it has moved. Hard to say.'),
            n('Your Nubbin pats one square of the grid with its paw, then another, as if it already knows.'),
            l('np04-captain', 'When you’re sure, call everyone back into the hall.'),
          ],
          choices: [
            {
              id: 'np04-fly-chase',
              label: 'Chase the metal fly.',
              set: { 'np-04-fly': 'chased' },
              then: [n('It zips up the chimney. You get soot on your nose. It gets away.')],
            },
            {
              id: 'np04-fly-ignore',
              label: 'Ignore it. The answer is in the grid.',
              set: { 'np-04-fly': 'ignored' },
              then: [n('You draw the curtain. Whoever is watching can watch a curtain.')],
            },
            {
              id: 'np04-fly-sloth',
              label: 'Wonder aloud if this is the green villain’s doing.',
              set: { 'np-04-fly': 'suspected' },
              then: [l('np04-captain', 'Him? He likes robots and speeches. This was quieter. This was someone close.', 'think')],
            },
          ],
        },
        done: {
          id: 'np04-solve-done',
          lines: [
            n('The last square fills in. There is only one way the grid can work.'),
            n('Your Nubbin taps the answer twice, smugly, as if it had known since the soup.'),
            n('You close the log and send for everyone.'),
          ],
        },
      },
    ],
    complete: {
      id: 'np04-complete',
      lines: [
        n('Five suspects in a row, the whole court watching. Your Nubbin sits at your feet like a very small judge.'),
        l('you', 'The pudding never arrived. The soup, the bread and the figs went to everyone. Only the tea went to the king alone.'),
        l('you', 'And the tea was poured by Princess Sankara.'),
        l('sankara', 'You can’t prove that.', 'angry'),
        l('np04-captain', 'The garden heard you, Highness. “Vyssa would wear the crown better than any of them.”'),
        l('vyssa', 'I never asked for this. Not like this.', 'sad'),
        n('The guards lead Sankara out. Vyssa sits at the empty end of the table and doesn’t move.'),
        n('At dawn, by the old shrine at the edge of town, a warm light hovers and will not go out. People say it is Coltzan, still keeping watch.'),
        l('coltzan', 'You did well, Keeper. Come and visit me. I’ll have blessings to spare.', 'soft'),
        n('The Neopian Times prints your grid in full, with one square left blank for readers. Half of Sakhmet gets it wrong.'),
      ],
    },
    rewards: [
      {
        id: 'np04-times',
        kind: 'item',
        label: 'Neopian Times: THE USURPER UNMASKED',
        description: 'This plot’s Neopian Times front page, kept in your Neopia scrapbook.',
      },
      {
        id: 'np04-avatar',
        kind: 'title',
        label: 'Avatar: Royal Sleuth',
        description: 'A trophy avatar for solving the Usurper.',
      },
    ],
    sets: { 'np-04-done': true, 'np-coltzan-shrine': true },
    childLines: {
      'np04-feast#0': 'Sakhmet glows gold at sunset. The palace is feasting, and the green villain hasn’t been seen for months.',
      'np04-feast#6': 'That tea… is very… sleepy…',
      'np04-feast#7': 'His eyes close and he starts to snore. Nobody can wake him. A fig rolls off the table.',
      'np04-complete#7': 'At dawn, the physicians bring water from the Healing Springs. The king opens one eye and asks who ate his cake.',
      'np04-complete#8': 'You did well, Keeper. Come to my shrine any time. I’ll have blessings to spare.',
    },
    notes:
      'Audience all. In the main version Coltzan is poisoned and dies, and his spirit stays at Coltzan’s Shrine (which gives the shrine its blessing); goals and hints say “tampered with” rather than poisoned. ' +
      'Learning Grove version (childLines): a sleeping draught, cured with Healing Springs water; the shrine is simply his. ' +
      'LOGIC PUZZLE (clue log grid, 5 servers x 5 dishes, plus which dish was tampered with). Clues, as they should appear in the log: ' +
      '1. The Cook carried a dish you eat with a spoon. ' +
      '2. The rose pudding was dropped on the stairs and never reached the table. ' +
      '3. There was ink smeared in the spilt pudding. Only the Scribe has inky sleeves. ' +
      '4. The Captain carried something that came out of the oven. ' +
      '5. Vyssa cannot bear the smell of spice and would not touch the spiced tea. ' +
      '6. Everyone at the high table ate the lentil soup, the date bread and the honeyed figs, and only the king fell ill. ' +
      '7. Only the king drank the spiced tea. The pot was knocked over straight afterwards. ' +
      '8. The gardener overheard Sankara the night before: “Vyssa would wear the crown better than any of them.” ' +
      'Solution: Scribe = rose pudding (2, 3); Cook = lentil soup (1, pudding taken); Captain = date bread (4: the only baked dish left); Vyssa = honeyed figs (5); Sankara = spiced tea. ' +
      'The tea is the tampered dish (6, 7; the pudding never arrived). Motive from clue 8. Wrong guesses just leave the grid unsolved; no penalty. ' +
      'Clue sources for step 2: Cook, Scribe, stairs, Captain, oven, Vyssa, teapot, garden. ' +
      'Sloth thread: the villain cake, Coltzan’s toast, and the metal fly at the window (the one painted on the NP3 portrait). Sloth is not the culprit; the fly is only watching. ' +
      'Unlock: sets np-coltzan-shrine so Coltzan’s Shrine shows his light. Standard Times page and avatar.',
  },

  // ================================================================== NP5
  {
    id: 'np05',
    code: 'NP5',
    title: 'Champions of Meridell',
    source: 'Neopets site plot: Champions of Meridell (July 2002–April 2003)',
    audience: 'main',
    trigger: { where: 'Neopia Central, the west road', when: 'After NP4.' },
    requires: ['NP4'],
    speakers: [LISHA, JERAN, SKARL, DARIGAN],
    steps: [
      {
        id: 'np05-step1',
        goal: 'Travel with Lisha to Meridell.',
        hint: 'The road to Meridell leaves from the west side of Neopia Central.',
        check: 'visit:neopia:meridell',
        scene: {
          id: 'np05-road',
          lines: [
            n('On the west road, a girl with a heavy pack is asking every traveller the same question.'),
            l('lisha', 'Excuse me. Have you seen a Lupe in a borrowed helmet? About this tall, all ears, talks too much?'),
            l('lisha', 'My brother, Jeran. He went to Meridell to be a knight. He stopped writing two months ago.', 'sad'),
            l('lisha', 'I’m Lisha. I’m going to find him, and then I’m going to shout at him. In that order.', 'angry'),
            n('She has a map, a sword she clearly doesn’t like, and three friends who look as tired as she does.'),
            n('Your Nubbins fall into step beside her. One takes a corner of her map in its mouth, helpfully.'),
            l('lisha', 'Meridell is three days west. Let’s make it two.'),
            l('lisha', 'Are you coming? You don’t have to. But you look like you’re coming.', 'think'),
          ],
          choices: [
            {
              id: 'np05-join',
              label: 'Offer to walk with her.',
              set: { 'np-05-with-lisha': true },
              then: [l('lisha', 'Thank you. My friends are lovely, but they keep stopping for pies.', 'happy')],
            },
            {
              id: 'np05-letters',
              label: 'Ask what his last letter said.',
              then: [l('lisha', 'That Meridell had something it shouldn’t. Something that glowed. Then nothing.', 'think')],
            },
            {
              id: 'np05-sword',
              label: 'Ask why she carries a sword she doesn’t like.',
              then: [l('lisha', 'Because Jeran took the good one.')],
            },
          ],
        },
        done: {
          id: 'np05-road-done',
          lines: [
            n('Two days later, Meridell: green hills, fat turnips, and a signpost that just says MERIDELL, proudly, three times.'),
            n('Then a shadow slides over all of it.'),
            l('lisha', 'What is that?', 'shock'),
          ],
        },
      },
      {
        id: 'np05-step2',
        goal: 'Hold Meri Acres Farm through three waves of Darigan soldiers.',
        hint: 'Darigan soldiers drop in from above. Fly Nubbins meet them in the air; Power Nubbins hold the fence.',
        check: 'karate:wave:champions-of-meridell:3',
        scene: {
          id: 'np05-citadel',
          lines: [
            n('A fortress floats over the hills, dark and jagged, trailing mist like smoke.'),
            l('skarl', 'The Darigan Citadel. I knew they’d come. I didn’t know they’d come today.', 'angry'),
            n('A herald calls down from the Citadel’s gate: Meridell took their Orb long ago, and they have come to take it back.'),
            l('lisha', 'Is that true?'),
            l('skarl', 'It is… complicated. My grandfather borrowed it. Permanently.', 'think'),
            n('The first Darigan soldiers land on Meri Acres on leathery wings. The farm’s Babaas bolt for the barn.'),
            l('jeran', 'Hold the fence line! Don’t let them reach the castle road!'),
            l('lisha', 'JERAN!', 'shock'),
            l('jeran', 'Lisha? What are you… not now! Help me hold the fence!', 'shock'),
          ],
          choices: [
            {
              id: 'np05-defend',
              label: 'Defend the farm with Jeran.',
              set: { 'np-05-stance': 'defend' },
              then: [l('jeran', 'Good. Shoulder to shoulder. You and your little ones take the left.')],
            },
            {
              id: 'np05-parley',
              label: 'Shout up to the herald: why not talk?',
              set: { 'np-05-stance': 'parley' },
              then: [
                n('The herald hesitates for one heartbeat. Then the drums start again.'),
                l('lisha', 'Worth a try. Somebody had to try.', 'sad'),
              ],
            },
            {
              id: 'np05-villagers',
              label: 'Get the farmers into the castle first.',
              set: { 'np-05-stance': 'villagers' },
              then: [n('You and your Nubbins herd farmers, Babaas and one very cross Kau up the castle road.')],
            },
          ],
        },
        done: {
          id: 'np05-citadel-done',
          lines: [
            l('jeran', 'They’re pulling back. Why are they pulling back?', 'think'),
            n('On the Citadel’s edge, something starts to glow, green and terrible.'),
          ],
        },
      },
      {
        id: 'np05-step3',
        goal: 'Fight beside both armies to break Lord Darigan’s grip on the Orb.',
        hint: 'A team bout: knights and Darigan soldiers fight with you. Aim for the Orb, not for Darigan.',
        check: 'karate:win:orb-darigan',
        scene: {
          id: 'np05-orb',
          lines: [
            n('Lord Darigan stands on the hilltop with the Orb raised high. His eyes have turned the colour of its light.'),
            l('darigan', 'Meridell will give back what it stole. Every field. Every stone. Every breath.', 'angry'),
            n('The Orb pulses. Crops wither in a ring around the castle. Darigan’s own soldiers stagger away from him.'),
            l('lisha', 'He isn’t himself. Look at his soldiers. They’re scared of him.', 'shock'),
            l('skarl', 'Then it’s not their fight any more. And it isn’t only mine.'),
            n('Meridell knights and Darigan soldiers stand side by side on the hill. Nobody planned it. Nobody stops it.'),
            l('jeran', 'The Orb is doing this. Get it out of his hands and it stops. I hope.'),
            n('Your Nubbins look up at the glow. Then they look at you, and wait for a plan.'),
          ],
        },
        done: {
          id: 'np05-orb-done',
          lines: [
            n('Your fastest Nubbin leaps, catches the Orb’s strap in its teeth, and pulls.'),
            n('The Orb tears free, spins in the air, and cracks clean in two.'),
          ],
        },
      },
    ],
    complete: {
      id: 'np05-complete',
      lines: [
        n('Two halves of the Orb land in the grass. One glows a soft green. The other gives no light at all.'),
        l('darigan', 'What… what have I done?', 'sad'),
        l('skarl', 'Something you’ll have to live with. Same as me, if I’m honest.'),
        n('Lisha marches up to Jeran and shouts at him, exactly as promised. Then she hugs him.'),
        n('Jeran hands back the good sword. Lisha hands him the one she doesn’t like. Both of them look happier.'),
        l('jeran', 'Champions of Meridell. That’s what they’ll call us. Your Nubbins too. Especially your Nubbins.', 'happy'),
        n('At the back of the Darigan ranks, a sharp-faced general named Kass watches the broken Orb and does not cheer.'),
        l('skarl', 'Now. Two halves of a thing my grandfather borrowed. Keeper, you broke it. You decide.', 'think'),
      ],
      choices: [
        {
          id: 'np05-orb-return',
          label: 'Give both halves back to the Citadel. It was theirs.',
          set: { 'np-05-orb': 'returned' },
          then: [
            l('darigan', 'Both? Even now? After what I did with it?', 'shock'),
            l('skarl', 'Especially now. “Borrowed” is just a longer word for stolen. Take them.'),
            n('Darigan’s soldiers carry their lord and both halves home. The Citadel drifts away, smaller and slower.'),
          ],
        },
        {
          id: 'np05-orb-split',
          label: 'One half each. Both kingdoms keep a piece, and a reason to talk.',
          set: { 'np-05-orb': 'split' },
          then: [
            l('skarl', 'A piece each, and an excuse to visit. Grandfather would have hated it. Good.'),
            n('Darigan’s soldiers carry their lord home with the glowing half. The Citadel drifts away, smaller and slower.'),
          ],
        },
        {
          id: 'np05-orb-keep',
          label: 'Lock both in Meridell’s vault until Darigan is well.',
          set: { 'np-05-orb': 'kept' },
          then: [
            l('darigan', 'Keep them. I don’t trust my own hands with it yet.', 'sad'),
            l('lisha', 'That’s twice Meridell has kept it. Let’s make sure nobody needs a third time.'),
            n('Darigan’s soldiers lift their lord gently and carry him home. The Citadel drifts away, smaller and slower.'),
          ],
        },
      ],
    },
    rewards: [
      {
        id: 'np05-times',
        kind: 'item',
        label: 'Neopian Times: THE ORB IS BROKEN',
        description: 'This plot’s Neopian Times front page, kept in your Neopia scrapbook.',
      },
      {
        id: 'np05-avatar',
        kind: 'title',
        label: 'Avatar: Champion of Meridell',
        description: 'A trophy avatar for fighting in the Champions of Meridell.',
      },
    ],
    sets: { 'np-05-done': true },
    notes:
      'Signature choice of the Neopia line: `np-05-stance` (defend | parley | villagers, the fence at Meri Acres). ' +
      'It pays off in NEOPIA_LINE_VARIANTS np09-nabile-<stance> (how Nabile asks for your word), np11-diary-<stance> (who on the Unlikely Gull has heard of you) ' +
      'and np13-broadcast-<stance> (how Gorix recruits you). ' +
      'Audience main: a war plot, kept out of the Learning Grove (no gore; it is the war theme). ' +
      'Step 2 is three karate waves on the Meri Acres farm map; step 3 is a team bout where allied NPC fighters (a knight and a Darigan soldier) join the player’s Nubbins against the Orb-possessed Darigan, whose hit box is the Orb. ' +
      'Kass is planted at the end for NP7. Sloth is absent from this plot by design (he returns in NP13). ' +
      'The closing choice sets `np-05-orb` (returned | split | kept); all three are defensible and none changes NP7’s plot. If kept, the two halves sit in a glass case in Skarl’s throne room in NP7. ' +
      'Art: Darigan Citadel floating fortress, the Orb (whole, then two halves). No unlock in the brief; standard Times page and avatar.',
  },

  // ================================================================== NP6
  {
    id: 'np06',
    code: 'NP6',
    title: 'The Volcano Mystery',
    source: 'Neopets site plot: The Volcano Mystery (September–October 2003)',
    audience: 'all',
    trigger: { where: 'Mystery Island, the village', when: 'After NP4 (in the main game, after NP5), on your next visit to Mystery Island.' },
    requires: ['NP4'],
    speakers: [
      { id: 'np06-mystic', name: 'The Island Mystic', kind: 'other', basedOn: 'The Island Mystic (Neopets)' },
      { id: 'np06-shaman', name: 'The Shaman', kind: 'other', basedOn: 'The shaman controlling Moltenus (Neopets, Volcano Mystery)' },
    ],
    steps: [
      {
        id: 'np06-step1',
        goal: 'Find the first two secret words around the island.',
        hint: 'The words are carved where islanders gather. Try the Tombola stall and the Training School.',
        check: 'find:secret-word:volcano-mystery:2',
        scene: {
          id: 'np06-empty',
          lines: [
            n('Mystery Island is never quiet. Today it is. No drums, no sellers, no Tombola man yelling about booby prizes.'),
            n('Half-eaten breakfasts sit on the tables. A hammock is still swinging.'),
            l('np06-mystic', 'Ah. Keeper. I saw you coming. Also, I heard the boat.'),
            l('np06-mystic', 'Everyone vanished at sunrise. Everyone but me. I was asleep up a tree, which I shall call wisdom.', 'think'),
            l('np06-mystic', 'Old words hold this island together. Five of them, hidden where the islanders would always find them.'),
            l('np06-mystic', 'Find all five and read them out, and whatever took our people must give them back.'),
            n('Your Nubbin finds a carved shell in the empty Tombola drum and brings it to you like a dog with a stick.', 'happy'),
            l('np06-mystic', 'There. Your first word. Read it.'),
          ],
          choices: [
            {
              id: 'np06-where',
              label: 'Ask where to look next.',
              then: [l('np06-mystic', 'Where people gather. A raffle stall. A school. A kitchen.')],
            },
            {
              id: 'np06-who',
              label: 'Ask who would do this.',
              then: [l('np06-mystic', 'The mountain has been grumbling. Mountains don’t grumble on their own.', 'think')],
            },
            {
              id: 'np06-tree',
              label: 'Ask why the Mystic wasn’t taken.',
              then: [l('np06-mystic', 'Nobody ever looks up. You’d be amazed what you can avoid from a tree.', 'happy')],
            },
          ],
        },
        done: {
          id: 'np06-empty-done',
          lines: [
            n('The shell says ROOT. A codestone at the Training School says WAVE.'),
            l('np06-mystic', 'Two. The mountain just coughed. I don’t like that.', 'think'),
            n('Your Nubbin coughs back at the mountain, to be polite.'),
            l('np06-mystic', 'Don’t encourage it.'),
          ],
        },
      },
      {
        id: 'np06-step2',
        goal: 'Find the last three secret words, then read all five at Techo Mountain.',
        hint: 'The Kitchen, Geraptiku and the mountain path each hold one word. Then stand at the crater door and read.',
        check: 'find:secret-word:volcano-mystery:5',
        scene: {
          id: 'np06-words',
          lines: [
            n('Smoke curls from the top of Techo Mountain. The birds have gone quiet.'),
            l('np06-mystic', 'Three more. The Kitchen, the old ruins at Geraptiku, and the path up the mountain.'),
            l('np06-mystic', 'Geraptiku is cursed, they say. I say it is mostly sticky. Don’t touch the statues.'),
            n('In the Kitchen, a wooden spoon hangs over a cold stove. Carved on the handle: ASH.'),
            n('At Geraptiku, your Nubbin refuses to go near the statues and finds SHELL scratched under a stair instead.'),
            n('The last word is up the mountain path, where the ground is warm under your feet.'),
            l('np06-mystic', 'When you have all five, read them to the mountain. Out loud. Mountains are a bit deaf.'),
            n('One of the statues seems to be looking at your hand.'),
          ],
          choices: [
            {
              id: 'np06-statue',
              label: 'Touch a statue anyway.',
              set: { 'np-06-touched-statue': true },
              then: [
                n('Your hand comes away sticky. Very sticky. For the rest of the day.'),
                l('np06-mystic', 'Mostly sticky. I did say.'),
              ],
            },
            {
              id: 'np06-careful',
              label: 'Leave the statues alone.',
              then: [n('The statues seem to approve. It’s hard to tell with statues.')],
            },
          ],
        },
        done: {
          id: 'np06-words-done',
          lines: [
            n('The last word is HOME, pressed into warm stone. You read all five, out loud.'),
            n('A seal of black rock splits down the middle. The islanders tumble out, dusty, blinking, all talking at once.'),
            l('np06-mystic', 'You found them! And you also opened the volcano. Small mistake. Very understandable.', 'shock'),
          ],
        },
      },
      {
        id: 'np06-step3',
        goal: 'Lead the island’s chant to break the shaman’s hold on Moltenus.',
        hint: 'Tap the five words in the order the chant shows, in time with the drums. Dodge the lava between beats.',
        check: 'minigame:chant:volcano-mystery',
        scene: {
          id: 'np06-moltenus',
          lines: [
            n('Something climbs out of the crater after the islanders. It is made of lava, and it is in a bad mood.'),
            l('np06-mystic', 'Moltenus. The mountain’s fire, given a body. And somebody has it on a leash.'),
            n('On a ledge behind it stands a figure in a mask of bone and feathers, holding a staff that glows like a coal.'),
            l('np06-shaman', 'Thank you for the words, Keeper. The islanders were only bait. I needed someone to open the door.'),
            l('np06-shaman', 'Now the island is mine, and the mountain does what I say.', 'angry'),
            l('np06-mystic', 'Words that open can also close. Say them together, all of you, and his hold breaks.'),
            n('The islanders look at each other. Then at you. Somebody has to start.'),
            n('Your Nubbin clears its throat. It is a very small sound.'),
          ],
          choices: [
            {
              id: 'np06-lead',
              label: 'Start the chant yourself.',
              set: { 'np-06-chant': 'you' },
              then: [l('you', 'Root to wave, ash to shell…')],
            },
            {
              id: 'np06-nubbin',
              label: 'Let your Nubbin start.',
              set: { 'np-06-chant': 'nubbin' },
              then: [n('Your Nubbin hums the first word, completely out of tune. The islanders join in anyway.', 'happy')],
            },
            {
              id: 'np06-islanders',
              label: 'Ask the islanders to start. It’s their island.',
              set: { 'np-06-chant': 'islanders' },
              then: [l('np06-mystic', 'Well said. Go on, then. All of you.', 'soft')],
            },
          ],
        },
        done: {
          id: 'np06-moltenus-done',
          lines: [
            n('“Root to wave, ash to shell, everyone home.” A hundred voices, one rhythm.'),
            n('The shaman’s staff cracks like a dropped plate.'),
          ],
        },
      },
    ],
    complete: {
      id: 'np06-complete',
      lines: [
        n('Moltenus stops. It looks down at its own glowing hands. Then it sighs, and sinks back into the crater like a bath.'),
        l('np06-shaman', 'No. No, no, no…', 'angry'),
        n('Without the staff he is just a man in a feathery mask. The islanders argue about him for an hour.'),
        n('In the end they put him on the next boat to anywhere, with a packed lunch. Island manners.'),
        l('np06-mystic', 'The mountain’s asleep again. Properly asleep. The snoring kind.', 'happy'),
        l('np06-mystic', 'Keep the five words. Not because you’ll need them. Because they’re yours now too.', 'soft'),
        n('The Tombola man is back at his drum within the hour, yelling about booby prizes as if nothing happened.'),
        n('The Neopian Times prints the chant on its front page. By dinner, every child on the island is singing it.'),
      ],
    },
    rewards: [
      {
        id: 'np06-times',
        kind: 'item',
        label: 'Neopian Times: EVERYONE HOME',
        description: 'This plot’s Neopian Times front page, kept in your Neopia scrapbook.',
      },
      {
        id: 'np06-avatar',
        kind: 'title',
        label: 'Avatar: Keeper of the Five Words',
        description: 'A trophy avatar for solving the Volcano Mystery.',
      },
    ],
    sets: { 'np-06-done': true },
    notes:
      'Requires NP4 only, so the Learning Grove can reach it; the main game still plays it after NP5 (see the header). ' +
      'Audience all. FIVE SECRET WORDS, in chant order, with where each is found: ROOT (shell in the Tombola drum), WAVE (codestone at the Training School), ' +
      'ASH (spoon handle in the Kitchen), SHELL (under a stair at Geraptiku), HOME (warm stone on the Techo Mountain path). ' +
      'The chant (original): “Root to wave, ash to shell, everyone home.” Step 3 minigame: a rhythm tap of the five words over island drums, three verses, with Moltenus lobbing lava between beats; missing beats only restarts the verse. ' +
      'The islanders were held in stone sleep inside the mountain, unharmed. Sound: drums, a hundred-voice chant (wordless hum is fine). ' +
      'No unlock in the brief; standard Times page and avatar.',
  },

  // ================================================================== NP7
  {
    id: 'np07',
    code: 'NP7',
    title: 'The Battle for Meridell',
    source: 'Neopets site plot: The Battle for Meridell (February–May 2004)',
    audience: 'main',
    trigger: { where: 'Meridell, Meri Acres Farm', when: 'After NP6, the Citadel reappears over Meridell.' },
    requires: ['NP6'],
    speakers: [
      LISHA,
      JERAN,
      SKARL,
      DARIGAN,
      { id: 'kass', name: 'Kass', kind: 'other', basedOn: 'Kass (Neopets)' },
      { id: 'sally', name: 'Sally', kind: 'other', basedOn: 'Sally of Meri Acres Farm (Neopets)' },
      { id: 'np07-creature', name: 'The Creature', kind: 'other', basedOn: 'Lord Darigan in his changed form (Neopets)' },
      { id: 'np07-dancer', name: 'The Dancer', kind: 'other', basedOn: 'The enchanting dancer at King Skarl’s court (Neopets)' },
      { id: 'np07-airfaerie', name: 'The Air Faerie', kind: 'other', basedOn: 'The Air Faerie (Neopets)' },
    ],
    steps: [
      {
        id: 'np07-step1',
        goal: 'Hold Meri Acres against three waves of Kass’s troops.',
        hint: 'Kass’s troops are tougher than last time. Rest your Nubbins in the barn between steps.',
        check: 'karate:wave:battle-for-meridell:3',
        scene: {
          id: 'np07-invasion',
          lines: [
            n('Meridell again. The Citadel is back in the sky, and it has grown spikes.'),
            l('jeran', 'Kass. Darigan’s old general. He took the Citadel while its lord was missing, and now he wants everything.', 'angry'),
            l('lisha', 'Missing? Lords don’t go missing. They have staff for that.'),
            l('skarl', 'Ride out, all of you! Defend the farms!', 'angry'),
            n('Darigan troops pour onto the fields. At the castle gate, Meridell’s Unis stamp and snort.'),
            l('jeran', 'Keeper, you held the fence last time. Hold it again.'),
            n('Kass watches from the Citadel’s balcony, arms folded, already bored of the people he’s fighting.'),
            n('Your Nubbins take their places along the fence. They remember it.'),
          ],
          choices: [
            {
              id: 'np07-uni',
              label: 'Ride out on a Uni with the cavalry.',
              set: { 'np-07-mount': 'uni' },
              then: [n('The Uni sniffs your Nubbin, decides it is a passenger, and lets it ride between its ears.', 'happy')],
            },
            {
              id: 'np07-foot',
              label: 'Stay on foot with the farmers.',
              set: { 'np-07-mount': 'foot' },
              then: [
                l('sally', 'Here, take a pitchfork. No, on second thoughts, take a bucket.'),
                n('It turns out to be a very good bucket.'),
              ],
            },
          ],
        },
        done: {
          id: 'np07-invasion-done',
          lines: [
            l('sally', 'Thank you. Now all of you, out of my barn. Nobody goes in my barn.', 'shock'),
            n('Something in the barn shuffles. Then goes very still.'),
          ],
        },
      },
      {
        id: 'np07-step2',
        goal: 'Bring the barn creature food without anyone seeing.',
        hint: 'Pick turnips at Meri Acres after dark. Stay out of the guards’ lantern light.',
        check: 'give:food:barn-creature',
        scene: {
          id: 'np07-barn',
          lines: [
            n('That night you hear it again: a shuffle, a cough, a wing knocking over a bucket.'),
            l('sally', 'Fine. FINE. You found it. Don’t tell the king.'),
            n('In the hay sits a creature with ragged bat wings, thin arms and huge, sad eyes. It flinches from the lantern.'),
            l('np07-creature', 'Please. I won’t hurt anyone. I can’t. Not any more.', 'sad'),
            l('sally', 'Turned up the day the Citadel came back. Eats turnips. Hates loud noises. Doesn’t know its own name, it says.'),
            n('Your Nubbin walks straight up to it and sits down in its lap, uninvited.'),
            l('np07-creature', '…Oh. Hello.', 'soft'),
            l('sally', 'Well? What are you going to do about it?'),
          ],
          choices: [
            {
              id: 'np07-hide',
              label: 'Promise to keep it secret.',
              set: { 'np-07-creature': 'hidden' },
              then: [l('sally', 'Good. Secrets are cheaper than trouble.')],
            },
            {
              id: 'np07-tell',
              label: 'Say the king ought to know.',
              set: { 'np-07-creature': 'told' },
              then: [
                l('np07-creature', 'Please, not yet. I don’t know what I am yet.', 'sad'),
                n('You agree to wait. For now.'),
              ],
            },
            {
              id: 'np07-feed',
              label: 'Fetch it a proper meal first.',
              set: { 'np-07-creature': 'fed' },
              then: [n('It eats like it hasn’t in weeks, and says thank you after every mouthful.', 'soft')],
            },
          ],
        },
        done: {
          id: 'np07-barn-done',
          lines: [
            l('np07-creature', 'Thank you. I keep dreaming of a castle in the sky. Isn’t that silly?', 'think'),
            l('sally', 'Very silly. Eat your turnip. That’s nine, by the way. I’m keeping a tally.'),
          ],
        },
      },
      {
        id: 'np07-step3',
        goal: 'Help Lisha get the charm off the dancer’s wrist.',
        hint: 'Time it with the music: move when she spins away from the throne. A rolled-up rug helps.',
        check: 'find:item:dancers-charm',
        scene: {
          id: 'np07-court',
          lines: [
            n('In the castle, King Skarl isn’t giving orders. He is watching a dancer twirl across the throne room, smiling foolishly.'),
            l('skarl', 'Lovely. Lovely. Let the war wait. Let everything wait.', 'soft'),
            l('lisha', 'He’s been like this for three days. The knights are riding out with no plans at all.', 'angry'),
            n('A charm on the dancer’s wrist flashes every time she turns. Skarl’s eyes follow it.'),
            l('np07-dancer', 'Another dance, Majesty? And another. And another.', 'happy'),
            l('lisha', 'That charm. If we get it off her, he wakes up.'),
            l('jeran', 'I’ll distract the guards. Lisha’s quicker with her hands.'),
            n('Your Nubbins glance at each other, then at the dancer’s swirling skirts. They have an idea. It is a bad idea.'),
          ],
        },
        done: {
          id: 'np07-court-done',
          lines: [
            n('Your Nubbins roll a rug under her feet. She stumbles. Lisha snatches the charm and snaps it in two.'),
            l('skarl', 'What… why is there a war? Why didn’t anyone tell me there’s a war?', 'shock'),
            l('lisha', 'We did.'),
          ],
        },
      },
      {
        id: 'np07-step4',
        goal: 'Clear Kass’s guards from the Citadel courtyard.',
        hint: 'The guards fight in a ring. Break it on one side and the rest scatter.',
        check: 'karate:win:citadel-guard',
        scene: {
          id: 'np07-citadel',
          lines: [
            n('Meridell storms the Citadel at dawn, on Unis and on foot, up a ramp of rope and stubbornness.'),
            l('jeran', 'Kass is at the top. Follow me!'),
            n('Halfway up, a blast from the Citadel rocks the ramp. Jeran loses his footing and falls.'),
            l('lisha', 'JERAN!', 'shock'),
            n('A blur of wind and pale light. An Air Faerie catches him an arm’s length from the ground.'),
            l('np07-airfaerie', 'Not today, young knight. Back up you go.'),
            n('Behind you, a shriek. The barn creature is flying straight at the Citadel, faster than anything you’ve seen.'),
            l('np07-creature', 'I remember now. That is my castle.', 'angry'),
            n('Kass’s guards fill the courtyard. Somebody has to clear the way.'),
          ],
        },
        done: {
          id: 'np07-citadel-done',
          lines: [
            n('The courtyard clears. In the throne room, the creature lands, and grows, and changes.'),
            l('lisha', 'Sally’s barn guest. Taller. A lot taller. Still got hay in his hair.', 'shock'),
          ],
        },
      },
    ],
    complete: {
      id: 'np07-complete',
      lines: [
        n('It is Lord Darigan: unbewitched, unbowed, his eyes clear and very angry.'),
        l('kass', 'You? You should be dead in a ditch.', 'shock'),
        l('darigan', 'I was in a barn. It was better company.'),
        n('It is a short fight. Kass falls, and his army throws down its weapons.'),
        l('darigan', 'Meridell, I owe you my life and my home. I will not forget whose barn I slept in.', 'soft'),
        l('skarl', 'Peace, then. Real peace. Somebody pass the turnips.', 'happy'),
        l('sally', 'He owes me twelve turnips, actually.'),
        n('The Neopian Times runs a drawing of the battle. Your Nubbins are in it, very small, holding a rug.'),
      ],
    },
    rewards: [
      {
        id: 'np07-times',
        kind: 'item',
        label: 'Neopian Times: KASS FALLS',
        description: 'This plot’s Neopian Times front page, kept in your Neopia scrapbook.',
      },
      {
        id: 'np07-avatar',
        kind: 'title',
        label: 'Avatar: Hero of the Battle for Meridell',
        description: 'A trophy avatar for the Battle for Meridell.',
      },
    ],
    sets: { 'np-07-done': true },
    notes:
      'Audience main: a war plot, kept out of the Learning Grove. ' +
      'Order follows the brief: Kass invades; the bat-like creature in Sally’s barn; Lisha breaks the dancer’s spell on Skarl; Jeran falls and the Air Faerie catches him; the creature is revealed as Darigan and defeats Kass. ' +
      'Step 1 is three karate waves; step 2 a night stealth fetch (carry turnips past lantern cones); step 3 a timing grab during the dance loop; step 4 a ring bout. Kass’s defeat is a cutscene, not a player fight. ' +
      'Uni mounts: if np-07-mount is uni, step 4 staging shows the player arriving on a Uni. Art: creature form and full Darigan form share a palette so the reveal reads. ' +
      'No unlock in the brief; standard Times page and avatar.',
  },

  // ================================================================== NP8
  {
    id: 'np08',
    code: 'NP8',
    title: 'The Curse of Maraqua',
    source: 'Neopets site plot: The Curse of Maraqua (March–June 2005)',
    audience: 'main',
    trigger: { where: 'Maraqua, New Maraqua’s square', when: 'After NP7, on your next dive to Maraqua.' },
    requires: ['NP7'],
    speakers: [
      KELPBEARD,
      { id: 'caylis', name: 'Caylis', kind: 'other', basedOn: 'Caylis (Neopets)' },
      { id: 'isca', name: 'Isca', kind: 'other', basedOn: 'Isca (Neopets)' },
      { id: 'garin', name: 'Captain Garin', kind: 'other', basedOn: 'Captain Garin (Neopets)' },
      { id: 'scarblade', name: 'Captain Scarblade', kind: 'other', basedOn: 'Captain Scarblade (Neopets)' },
    ],
    steps: [
      {
        id: 'np08-step1',
        goal: 'Swim past the reef and find Caylis in the old Maraquan ruins.',
        hint: 'Swim Nubbins only. Follow the cold currents marked by pale fish.',
        check: 'talk:caylis',
        scene: {
          id: 'np08-cast',
          lines: [
            n('New Maraqua shines under the sea: new coral, fresh paint. Your Swim Nubbins love it.'),
            l('kelpbeard', 'Keeper! Back in Maraqua. You’ve come to the right place at the wrong time.', 'sad'),
            l('kelpbeard', 'Our seer, Caylis, has been sending warnings of ruin. The people say she brings the ruin herself.'),
            l('kelpbeard', 'The council voted. She’s been sent out past the reef. I didn’t vote for it. I didn’t stop it either.', 'sad'),
            n('The square is full of people who won’t look at the gate she left through.'),
            n('Your Swim Nubbin is already nosing at that gate. It doesn’t care about votes.'),
            l('kelpbeard', 'Past the reef, follow the cold water. She’ll be in the old ruins.'),
            l('kelpbeard', 'Will you go? She won’t come back for me.'),
          ],
          choices: [
            {
              id: 'np08-find',
              label: 'Say you’ll bring her back.',
              set: { 'np-08-caylis': 'sought' },
              then: [l('kelpbeard', 'Take her this cloak. The reef gets cold.', 'soft')],
            },
            {
              id: 'np08-warnings',
              label: 'Ask what her warnings said.',
              set: { 'np-08-caylis': 'asked' },
              then: [l('kelpbeard', 'Dark sails over the city. And a sister she has never met.', 'think')],
            },
            {
              id: 'np08-king',
              label: 'Ask why the king didn’t stop it.',
              set: { 'np-08-caylis': 'questioned' },
              then: [
                l('kelpbeard', 'A king who overrules every vote soon has no council. Just an echo wearing seaweed.', 'think'),
                l('kelpbeard', 'And a king who never does… Well. You can see where that got her.', 'sad'),
              ],
            },
          ],
        },
        done: {
          id: 'np08-cast-done',
          lines: [
            l('caylis', 'You came. That wasn’t in my visions. I like it.', 'soft'),
            l('caylis', 'Look up. The sails are already here.', 'shock'),
          ],
        },
      },
      {
        id: 'np08-step2',
        goal: 'Bring Garin, Isca and Caylis to King Kelpbeard.',
        hint: 'The palace is at the centre of New Maraqua. Keep Caylis in your party to pass the gate guards.',
        check: 'talk:king-kelpbeard',
        scene: {
          id: 'np08-garin',
          lines: [
            n('A hull blocks the light above. Not dark sails, though: patched ones, cheerful ones.'),
            n('A rope ladder drops. Down it climbs a pirate captain with a broad grin and a broader hat.'),
            l('garin', 'Captain Garin, at your service. Mostly at my own service, but I make exceptions.', 'happy'),
            n('Behind him comes a girl with Caylis’s face, exactly, down to the frown.'),
            l('isca', 'Isca. I was raised on deck. Garin says he found me in a basket in the reef.'),
            l('caylis', 'A sister. I saw you. I saw you for years.', 'soft'),
            l('garin', 'And I’ve seen Scarblade’s fleet two days behind me. That’s why I came. Somebody tell the king.', 'think'),
            n('Your Nubbin swims a slow circle round the twins, looking from one face to the other, baffled.'),
          ],
          choices: [
            {
              id: 'np08-trust',
              label: 'Trust Garin and take him to the king.',
              set: { 'np-08-garin': 'trusted' },
              then: [l('garin', 'Splendid. Do kings serve lunch?', 'happy')],
            },
            {
              id: 'np08-doubt',
              label: 'Ask why a pirate cares about Maraqua.',
              set: { 'np-08-garin': 'doubted' },
              then: [l('garin', 'Scarblade sank my first ship. That’s caring enough.', 'angry')],
            },
            {
              id: 'np08-isca',
              label: 'Ask Isca if she trusts him.',
              set: { 'np-08-garin': 'vouched' },
              then: [l('isca', 'He raised me. Badly, but properly.')],
            },
          ],
        },
        done: {
          id: 'np08-garin-done',
          lines: [
            l('kelpbeard', 'Caylis. I’m sorry. You were right, and we didn’t want you to be.', 'sad'),
            l('caylis', 'Being right is lonely. Being home is better.', 'soft'),
          ],
        },
      },
      {
        id: 'np08-step3',
        goal: 'Drive off three waves of Scarblade’s raiders.',
        hint: 'Raiders sink slowly on ropes. Hit them before they land and they float back up.',
        check: 'karate:wave:curse-of-maraqua:3',
        scene: {
          id: 'np08-scarblade',
          lines: [
            n('Two days later, the dark sails come. Captain Scarblade’s fleet blots out the sun.'),
            l('scarblade', 'Maraqua! Your gold, your coral and your king. In any order you like.', 'angry'),
            n('His parrot, perched on his hat, repeats the demand slightly wrong: “Gold! Coral! Cake!”'),
            l('scarblade', 'Not cake. We’ve discussed this.', 'angry'),
            n('Raiders drop through the water on weighted ropes, blades between their teeth.'),
            l('kelpbeard', 'Defend the palace! Defend each other!', 'angry'),
            l('garin', 'My crew’s above, boarding his flagship. Keep the raiders busy down here!'),
            l('isca', 'Caylis, what do you see?'),
            l('caylis', 'Him running. If we hold long enough, I see him running.', 'think'),
            n('Your Swim Nubbins dart between the coral spires, faster than any raider with a sword in his mouth.'),
          ],
        },
        done: {
          id: 'np08-scarblade-done',
          lines: [
            n('The ropes go slack. Above, Scarblade’s flagship is burning and leaving.'),
            l('scarblade', 'This isn’t over, Kelpbeard!', 'angry'),
            n('Faintly, from the burning ship: “Cake!”'),
            l('garin', 'It is today, though.', 'happy'),
          ],
        },
      },
    ],
    complete: {
      id: 'np08-complete',
      lines: [
        n('New Maraqua is dented but standing. The people clear a path for Caylis, and this time they mean it.'),
        l('kelpbeard', 'Caylis. Isca. There are two rooms in the palace with your names on them, if you want them.', 'soft'),
        l('isca', 'Garin?'),
        l('garin', 'I’m a pirate, love. Pirates don’t do rooms. Come and find me on the water.', 'soft'),
        n('The patched sails pull away north. Isca watches until they’re gone, then swims back to her sister.'),
        l('caylis', 'I don’t see any more ruin. I see dinner. A great deal of dinner.', 'happy'),
        n('The Neopian Times prints the twins side by side on the front page. Nobody can tell which is which.'),
      ],
    },
    rewards: [
      {
        id: 'np08-times',
        kind: 'item',
        label: 'Neopian Times: THE SISTERS COME HOME',
        description: 'This plot’s Neopian Times front page, kept in your Neopia scrapbook.',
      },
      {
        id: 'np08-avatar',
        kind: 'title',
        label: 'Avatar: Friend of New Maraqua',
        description: 'A trophy avatar for breaking the Curse of Maraqua.',
      },
    ],
    sets: { 'np-08-done': true },
    notes:
      'Audience main: an invasion plot, kept out of the Learning Grove. ' +
      'Underwater throughout: Swim Nubbins only in the party, as in NP1. Step 3 is three karate waves; raiders arrive on ropes from above (hit them mid-descent to send them back up). ' +
      'Garin’s ship is above the water, so he never fights in the bouts; his boarding happens off screen. ' +
      '`np-08-caylis` can be sought | asked | questioned (flavour only). Scarblade’s parrot is a small sprite on his hat; its “Cake!” is a running gag. ' +
      'Art: Caylis and Isca must be identical sprites apart from clothing (Isca in a deckhand’s coat). No unlock in the brief; standard Times page and avatar.',
  },

  // ================================================================== NP9
  {
    id: 'np09',
    code: 'NP9',
    title: 'The Lost Desert Plot',
    source: 'Neopets site plot: The Lost Desert Plot (August–November 2005)',
    audience: 'main',
    trigger: { where: 'Lost Desert, Sakhmet palace', when: 'After NP8, an invitation to Prince Jazan’s audience with Princess Amira.' },
    requires: ['NP8'],
    speakers: [
      { id: 'jazan', name: 'Prince Jazan', kind: 'other', basedOn: 'Prince Jazan (Neopets)' },
      { id: 'amira', name: 'Princess Amira', kind: 'other', basedOn: 'Princess Amira (Neopets)' },
      { id: 'nabile', name: 'Nabile', kind: 'other', basedOn: 'Nabile (Neopets)' },
      { id: 'razul', name: 'Razul', kind: 'other', basedOn: 'Razul (Neopets)' },
    ],
    steps: [
      {
        id: 'np09-step1',
        goal: 'Find a way through the shadow streets of cursed Sakhmet.',
        hint: 'Shadows freeze when looked at. Move when they turn away, and keep your Nubbins close.',
        check: 'explore:sakhmet-shadow:market',
        scene: {
          id: 'np09-refused',
          lines: [
            n('The palace hall is full of flowers and nerves. Prince Jazan of Qasala has come to ask for Princess Amira’s hand.'),
            l('jazan', 'Princess. Our cities were one, once. Let them be one again.'),
            l('amira', 'You don’t love me, Jazan. You love the throne I’m sitting on. The answer is no.', 'angry'),
            n('Jazan doesn’t argue. A dark stone on his ring flares, and he looks as surprised as anyone.'),
            l('jazan', 'That isn’t mine. Father?', 'shock'),
            n('The sky turns violet. The colour drains out of the city. Every shadow stands up and walks.'),
            l('amira', 'What have you done?', 'shock'),
            n('Then Jazan is gone, pulled through a door that wasn’t there a moment ago.'),
          ],
          choices: [
            {
              id: 'np09-amira',
              label: 'Get the princess to safety.',
              set: { 'np-09-first': 'amira' },
              then: [l('amira', 'I can look after myself. But thank you. Now run!')],
            },
            {
              id: 'np09-door',
              label: 'Try the door Jazan left by.',
              set: { 'np-09-first': 'door' },
              then: [n('It closes on your fingertips and fades into the wall, like a bad idea.')],
            },
            {
              id: 'np09-nubbins',
              label: 'Gather your Nubbins first.',
              set: { 'np-09-first': 'nubbins' },
              then: [n('They come running, all of them, tails low. In the violet light they all look grey.', 'sad')],
            },
          ],
        },
        done: {
          id: 'np09-refused-done',
          lines: [
            n('In the empty market, someone is stealing apples from a shadow’s stall.'),
            l('nabile', 'What? It’s not as if it’s going to notice.'),
            n('The shadow stallholder holds out its hand for payment, very slowly. Nabile puts an apple core in it.'),
          ],
        },
      },
      {
        id: 'np09-step2',
        goal: 'Stand guard at the wedding in the Qasala ruins.',
        hint: 'Shadows will try to crash the ceremony. Keep them out of the courtyard until the vows are done.',
        check: 'karate:wave:qasala-wedding:2',
        scene: {
          id: 'np09-nabile',
          lines: [
            l('nabile', 'Nabile. Thief, mostly. You look like you plan to fix this, so I’ll follow you. For the loot.'),
            n('Round her neck hangs an amulet she keeps tucking out of sight: a royal crest, very old.'),
            l('nabile', 'Found it. Don’t ask. Everyone asks.'),
            n('In a ruined courtyard, an old servant sees the amulet and drops to her knees. Nabile is of Qasala’s royal blood.'),
            l('nabile', 'I’m a what? No. I’m a thief. Thieves don’t have bloodlines. They have hiding places.', 'shock'),
            l('amira', 'The old curse on Qasala breaks with a royal marriage. That’s why he came to me.', 'think'),
            n('Jazan hears. Of course he hears. He arrives with a smile and a ring and a very short speech.'),
            l('jazan', 'A bride from Qasala’s own line. The curse wanted a royal marriage. Here is one.', 'think'),
            l('nabile', 'Keeper. Tell me honestly. Do I do this?'),
          ],
          choices: [
            {
              id: 'np09-yes',
              label: 'Say it might save the city.',
              set: { 'np-09-wedding': 'encouraged' },
              then: [l('nabile', 'Fine. But I’m keeping the apples.')],
            },
            {
              id: 'np09-careful',
              label: 'Say she doesn’t owe anyone this.',
              set: { 'np-09-wedding': 'cautioned' },
              then: [l('nabile', 'I know. That’s why I’m choosing it.', 'soft')],
            },
          ],
        },
        done: {
          id: 'np09-nabile-done',
          lines: [
            n('The vows are said in the violet light. Everyone looks up at the sky.'),
            n('It stays violet.'),
            l('jazan', 'Then it was never the marriage. It was always him.', 'sad'),
          ],
        },
      },
      {
        id: 'np09-step3',
        goal: 'Gather the four pieces and build the ancient weapon.',
        hint: 'Collect the lens, the hilt, the coil and the sun-stone around Sakhmet, then combine them at the palace workbench.',
        check: 'craft:ancient-weapon',
        scene: {
          id: 'np09-weapon',
          lines: [
            n('Below the Qasala ruins is a tomb, and in it something that should have stayed dead: Razul, Jazan’s father.'),
            l('jazan', 'He made the curse. He keeps it alive. As long as he walks, so do the shadows.', 'sad'),
            l('nabile', 'So we stop him walking. How?'),
            l('amira', 'The old scrolls describe a weapon, built in pieces and kept in pieces, so no single king could ever use it.', 'think'),
            l('amira', 'Put together, it holds daylight. Razul cannot stand daylight.'),
            n('Four pieces: a lens by Coltzan’s Shrine, a hilt in the Deserted Tomb, a coil inside the Fruit Machine, a sun-stone on the palace roof.'),
            l('nabile', 'I can steal two of those. You do the other two.'),
            n('Your Nubbins are good at small spaces. Two of those places are nothing but small spaces.'),
          ],
        },
        done: {
          id: 'np09-weapon-done',
          lines: [
            n('The pieces fit together with a sound like a bell. The weapon hums, warm, full of stored sunrise.'),
            l('nabile', 'I said I’d steal two. I stole three. Habit. I put the third one back. Mostly.', 'happy'),
          ],
        },
      },
      {
        id: 'np09-step4',
        goal: 'Hold off the shadows for three rounds while Jazan charges the weapon.',
        hint: 'Shadows can’t cross light. Fight inside the weapon’s glow.',
        check: 'karate:survive:razul-shadows:3',
        scene: {
          id: 'np09-razul',
          lines: [
            n('Razul’s tomb is a hall of bones and gold. He sits on a throne too big even for him.'),
            l('razul', 'My son. My useless son. You married a thief and brought me a toy.', 'angry'),
            l('jazan', 'I brought you an ending, Father.'),
            l('razul', 'Nobody in our family has ever done anything brave. Don’t start now.'),
            n('Razul stands. The shadows of Sakhmet pour into the tomb to guard him.'),
            l('nabile', 'Keeper. Keep them off him. He gets one shot.'),
            n('Jazan raises the weapon. It begins, slowly, to glow.'),
            n('Your Nubbins look at the shadows, then at you.'),
          ],
          choices: [
            {
              id: 'np09-ring',
              label: 'Put your Nubbins in a ring round Jazan.',
              set: { 'np-09-guard': 'ring' },
              then: [n('They make a ring, tails in, facing the dark. Nothing gets through.')],
            },
            {
              id: 'np09-lure',
              label: 'Draw the shadows toward you instead.',
              set: { 'np-09-guard': 'lure' },
              then: [n('You run left, shouting. The shadows follow, which is flattering and terrifying.')],
            },
          ],
        },
        done: {
          id: 'np09-razul-done',
          lines: [
            n('Daylight bursts from the weapon. Razul doesn’t scream. He just fades, like a stain in the sun.'),
            l('jazan', 'Goodbye, Father. I’ll do the brave things now. Somebody has to start.', 'sad'),
          ],
        },
      },
    ],
    complete: {
      id: 'np09-complete',
      lines: [
        n('The violet drains out of the sky. Sakhmet is gold again, and loud, and smells of bread.'),
        l('amira', 'Jazan. You did the right thing at the end. That counts.', 'soft'),
        l('jazan', 'It doesn’t undo the beginning.', 'sad'),
        l('nabile', 'No. But I married you anyway, so try harder.'),
        n('Jazan and Nabile go home to Qasala to rebuild it. Nabile keeps her lockpicks in the crown.'),
        l('amira', 'Keeper, Sakhmet’s gates are always open to you and yours.', 'happy'),
        n('The Neopian Times prints the wedding portrait. Nabile is clearly picking the photographer’s pocket.'),
      ],
    },
    rewards: [
      {
        id: 'np09-times',
        kind: 'item',
        label: 'Neopian Times: SAKHMET IN DAYLIGHT',
        description: 'This plot’s Neopian Times front page, kept in your Neopia scrapbook.',
      },
      {
        id: 'np09-avatar',
        kind: 'title',
        label: 'Avatar: Breaker of the Qasalan Curse',
        description: 'A trophy avatar for the Lost Desert Plot.',
      },
    ],
    sets: { 'np-09-done': true },
    notes:
      'Payoff of `np-05-stance`: step 2 plays NEOPIA_LINE_VARIANTS np09-nabile-defend / -parley / -villagers in place of np09-nabile (Nabile has heard what you did at Meri Acres, and asks for your word accordingly). ' +
      'Audience main: undead dimension, a cursed city and Razul’s tomb, kept out of the Learning Grove. ' +
      'Sakhmet in the undead dimension: violet sky, greyscale palette, shadow people who freeze when looked at (step 1 is a light stealth crossing of the market). ' +
      'Step 2: two karate waves of shadows during the wedding. Step 3: the players build the ancient weapon from four parts placed at existing Lost Desert spots (Coltzan’s Shrine, the Deserted Tomb, the Fruit Machine, the palace roof); the parts are one-time pickups. ' +
      'Step 4: survive bout inside a moving circle of light. Jazan destroys Razul in the cutscene, as in the brief. No unlock in the brief; standard Times page and avatar.',
  },

  // ================================================================== NP10
  {
    id: 'np10',
    code: 'NP10',
    title: 'The Tale of Woe',
    source: 'Neopets site plot: The Tale of Woe (October–November 2006)',
    audience: 'main',
    trigger: { where: 'Haunted Woods, the town of Neovia', when: 'After NP9, on your first visit to Neovia.' },
    requires: ['NP9'],
    speakers: [
      { id: 'bruno', name: 'Bruno', kind: 'other', basedOn: 'Bruno the Gelert (Neopets)' },
      { id: 'lily', name: 'Lily', kind: 'other', basedOn: 'Lily (Neopets, Tale of Woe)' },
      { id: 'krawley', name: 'Mr Krawley', kind: 'other', basedOn: 'Mr. Krawley (Neopets)' },
      { id: 'gilly', name: 'Gilly', kind: 'other', basedOn: 'Gilly (Neopets, Tale of Woe)' },
      { id: 'sophie', name: 'Sophie', kind: 'other', basedOn: 'Sophie the Swamp Witch (Neopets)' },
    ],
    steps: [
      {
        id: 'np10-step1',
        goal: 'Keep an eye on Bruno and see what the Hissi Oil does.',
        hint: 'Follow Bruno through Neovia over the evening, and stay out of Mr Krawley’s sight.',
        check: 'follow:bruno:neovia',
        scene: {
          id: 'np10-neovia',
          lines: [
            n('Neovia sits in the Haunted Woods under a permanent dusk. The lamps are always lit, and always flickering.'),
            l('bruno', 'Lily walked past me again today. She smiled. At the lamppost behind me, I think.', 'sad'),
            l('bruno', 'If I were handsomer. Braver. Anything-er.', 'sad'),
            n('Across the square stands a new shop: MR. KRAWLEY’S TONICS. The window is full of little green bottles.'),
            l('krawley', 'Roll up! The lovelorn, the plain, the overlooked! Hissi Oil! One drop and you’re irresistible!', 'happy'),
            l('krawley', 'Two drops and you’re unforgettable! Three drops and, well, results vary. Results always vary!'),
            l('bruno', 'Irresistible…', 'think'),
            n('Your Nubbins won’t go near the shop. One hisses at its own reflection in the window.'),
            l('krawley', 'Spread the word. Spread the oil. No refunds, no returns, no questions, no forwarding address.'),
          ],
          choices: [
            {
              id: 'np10-warn',
              label: 'Tell Bruno he doesn’t need a bottle.',
              set: { 'np-10-warned': true },
              then: [l('bruno', 'Easy for you to say. Your pets adore you.', 'sad'), n('He buys it anyway.')],
            },
            {
              id: 'np10-sniff',
              label: 'Sniff the oil.',
              set: { 'np-10-sniffed': true },
              then: [
                n('It smells of swamp, old pennies and something with too many legs.'),
                n('Bruno buys a bottle while you’re coughing.'),
              ],
            },
            {
              id: 'np10-ask',
              label: 'Ask Mr Krawley what’s in it.',
              then: [
                l('krawley', 'A secret blend. Secret from you, secret from the law, secret from my own mother.', 'happy'),
                n('Bruno buys a bottle while he’s talking.'),
              ],
            },
          ],
        },
        done: {
          id: 'np10-neovia-done',
          lines: [
            n('By midnight, everyone who bought the oil is changing. Fur where there shouldn’t be fur. Teeth where there shouldn’t be teeth.'),
            n('Bruno howls from a rooftop. It is not a happy sound.', 'sad'),
            n('Mr Krawley’s shop is dark and empty. The sign on the door says CLOSED FOREVER.'),
          ],
        },
      },
      {
        id: 'np10-step2',
        goal: 'Get Gilly safely through Neovia to the swamp.',
        hint: 'Changed townsfolk follow noise. Walk, don’t run, and keep to the lamplit paths.',
        check: 'escort:gilly:swamp',
        scene: {
          id: 'np10-gilly',
          lines: [
            n('The streets are full of shapes that used to be your neighbours. Most are just confused. A few are hungry.'),
            l('gilly', 'In here! Quick, before they smell you!', 'shock'),
            n('A small girl yanks you into a cellar. Your Nubbins tumble in after you.'),
            l('gilly', 'Gilly. I didn’t buy the oil. My mum said it smelled like a liar.'),
            l('gilly', 'There’s a witch in the swamp. Sophie. Everyone says she’s mean. I think she’s just honest.'),
            l('gilly', 'If anyone can make a cure, she can. But I can’t get through town on my own.'),
            n('Outside, something big and furry snuffles at the cellar door, then wanders off.'),
            l('gilly', 'That was Mr Henley, the baker. He’s a lot hairier than usual.', 'sad'),
          ],
          choices: [
            {
              id: 'np10-carry',
              label: 'Offer to carry Gilly on your back.',
              set: { 'np-10-gilly': 'carried' },
              then: [l('gilly', 'I’m not a baby. …Fine. But only because my shoes are wet.')],
            },
            {
              id: 'np10-lead',
              label: 'Let Gilly lead. She knows the streets.',
              set: { 'np-10-gilly': 'led' },
              then: [l('gilly', 'Left at the bakery. Don’t look at the bakery.')],
            },
          ],
        },
        done: {
          id: 'np10-gilly-done',
          lines: [
            l('sophie', 'Who’s stomping on my swamp? Oh. Gilly. And a stranger with a lot of small pets.'),
            l('gilly', 'We need a cure, Miss Sophie. Everyone’s monsters.'),
            l('sophie', 'Everyone always is. This time it shows.', 'think'),
            n('Her hut is built on stilts over the bog. The doormat says GO AWAY. Underneath, smaller: unless it’s important.'),
          ],
        },
      },
      {
        id: 'np10-step3',
        goal: 'Gather the moonmoss, the feather and the tear, and help Sophie brew the cure.',
        hint: 'Moonmoss grows on the north graveyard wall. Changed birds roost on the chapel roof.',
        check: 'craft:cure:hissi-oil',
        scene: {
          id: 'np10-cure',
          lines: [
            l('sophie', 'Hissi Oil. Krawley sells that rot in every town lonely enough to buy it.', 'angry'),
            l('sophie', 'I can brew an answer to it. I need three things, and I need them fast.'),
            l('sophie', 'Moonmoss from the graveyard wall. A feather from a changed bird. And a tear, given freely.', 'think'),
            l('gilly', 'A tear? From who?'),
            l('sophie', 'Someone who still loves somebody in that town. That’s the hard part.'),
            n('Your Nubbins look at Gilly. Gilly looks at the ground.'),
            n('The cauldron starts to bubble on its own, impatient.'),
            l('sophie', 'Off you go. Don’t touch anything in the graveyard that waves.'),
          ],
          choices: [
            {
              id: 'np10-tear-lily',
              label: 'Ask Lily for the tear.',
              set: { 'np-10-tear': 'lily' },
              then: [n('Lily, still herself because she never needed any oil, cries for Bruno without being asked.', 'sad')],
            },
            {
              id: 'np10-tear-gilly',
              label: 'Let Gilly decide.',
              set: { 'np-10-tear': 'gilly' },
              then: [l('gilly', 'It’s for my mum. That’s easy to cry about.', 'sad')],
            },
          ],
        },
        done: {
          id: 'np10-cure-done',
          lines: [
            n('The cure is the colour of morning. It smells of mint and wet stone.'),
            l('sophie', 'Rain it over the town. Every drop counts.'),
          ],
        },
      },
    ],
    complete: {
      id: 'np10-complete',
      lines: [
        n('Sophie’s cauldron boils over into a cloud. The cloud drifts over Neovia and rains.'),
        n('One by one, the townsfolk shrink back into themselves, sneeze, and ask why they’re on the roof.'),
        l('gilly', 'Mum!', 'happy'),
        n('Bruno doesn’t change back. The fur stays. The teeth stay. He sits in the square and stares at his hands.', 'sad'),
        l('bruno', 'It didn’t work on me. I took too much. I wanted it too much.', 'sad'),
        l('lily', 'Bruno. You were only ever too shy. You were never ugly.', 'soft'),
        l('bruno', 'Then I suppose I’ll be shy and furry. People have been worse.'),
        n('The Neopian Times prints a small notice: Mr Krawley, wanted, by everyone.'),
      ],
    },
    rewards: [
      {
        id: 'np10-times',
        kind: 'item',
        label: 'Neopian Times: NEOVIA CURED (MOSTLY)',
        description: 'This plot’s Neopian Times front page, kept in your Neopia scrapbook.',
      },
      {
        id: 'np10-avatar',
        kind: 'title',
        label: 'Avatar: Friend of Neovia',
        description: 'A trophy avatar for the Tale of Woe.',
      },
    ],
    sets: { 'np-10-done': true },
    notes:
      'Audience main: the brief says the Tale of Woe is not in the Learning Grove (a darker Haunted Woods story of townsfolk turned into monsters). No gore: the changed townsfolk are furry, toothy and confused, never shown hurting anyone. ' +
      'Step 1 is a follow-at-a-distance walk; step 2 an escort with noise stealth (running makes noise rings); step 3 a three-ingredient fetch and a cauldron craft. ' +
      'Bruno stays changed and accepts it, as in the brief; keep his changed sprite gentle. Krawley escapes (he is in the brief’s villain list for later use). ' +
      'No unlock in the brief; standard Times page and avatar.',
  },

  // ================================================================== NP11
  {
    id: 'np11',
    code: 'NP11',
    title: 'Journey to the Lost Isle',
    source: 'Neopets site plot: Journey to the Lost Isle (May–June 2007)',
    audience: 'all',
    trigger: { where: 'Krawk Island, the harbour', when: 'After NP6 (in the main game, after NP10).' },
    requires: ['NP6'],
    speakers: [
      { id: 'fairweather', name: 'Professor Fairweather', kind: 'other', basedOn: 'Professor Fairweather (Neopets)' },
      { id: 'roxton', name: 'Roxton Colchester', kind: 'other', basedOn: 'Roxton Colchester (Neopets)' },
      { id: 'lilian', name: 'Lilian', kind: 'other', basedOn: 'Lilian (Neopets, Journey to the Lost Isle)' },
      { id: 'werther', name: 'Werther', kind: 'other', basedOn: 'Werther (Neopets, Journey to the Lost Isle)' },
      { id: 'scrap', name: 'Scrap', kind: 'other', basedOn: 'Scrap the stowaway (Neopets)' },
    ],
    steps: [
      {
        id: 'np11-step1',
        goal: 'Join the expedition and set sail from Krawk Island.',
        hint: 'Talk to Roxton on the dock to board. Bring Nubbins who don’t mind boats.',
        check: 'talk:roxton-colchester',
        scene: {
          id: 'np11-diary',
          lines: [
            n('Krawk Island harbour. A ship called the Unlikely Gull is loading biscuits and an alarming amount of rope.'),
            l('fairweather', 'You must be the Keeper! Professor Fairweather. Natural history. Mostly beetles.', 'happy'),
            l('fairweather', 'I have a pirate’s diary describing an island on no chart at all. Giant creatures. Impossible fruit.'),
            l('roxton', 'Roxton Colchester. I’ve explored every island on the map, which is exactly why I want one that isn’t.', 'happy'),
            l('lilian', 'Lilian. I do the maps, and the medicine, and most of the thinking.'),
            l('werther', 'Werther. I carry things.'),
            n('A crate of biscuits sneezes.'),
            n('Inside is a small, grubby, defiant stowaway with cheeks full of biscuit.'),
            l('scrap', 'I’m Scrap. I’m coming. You can’t stop me. Can I have another biscuit?'),
          ],
          choices: [
            {
              id: 'np11-stay',
              label: 'Let Scrap come along.',
              set: { 'np-11-scrap': 'welcomed' },
              then: [l('roxton', 'Fine. You’re cabin crew. Cabin crew don’t eat the cargo.')],
            },
            {
              id: 'np11-ashore',
              label: 'Say Scrap should stay ashore.',
              set: { 'np-11-scrap': 'refused' },
              then: [n('Scrap nods solemnly. An hour out to sea, the biscuit crate sneezes again.', 'happy')],
            },
            {
              id: 'np11-lookout',
              label: 'Give Scrap a job: lookout.',
              set: { 'np-11-scrap': 'lookout' },
              then: [l('scrap', 'Lookout! The best job! I can see a seagull already!', 'happy')],
            },
          ],
        },
        done: {
          id: 'np11-diary-done',
          lines: [
            n('Five days at sea. On the sixth, Scrap shouts from the mast: fog, and in the fog, green cliffs.'),
            l('lilian', 'That isn’t on my map. That isn’t on anyone’s map.', 'shock'),
          ],
        },
      },
      {
        id: 'np11-step2',
        goal: 'Find three landmarks so Lilian can map the island.',
        hint: 'Look for the waterfall, the stone arch and the tallest tree. Fly Nubbins can spot them from above.',
        check: 'explore:lost-isle:landmarks:3',
        scene: {
          id: 'np11-island',
          lines: [
            n('The jungle is enormous. Not the trees. The insects.'),
            n('A Petpetpet, a creature that should fit on a fingernail, ambles past at the height of a pony.'),
            l('fairweather', 'Remarkable! Look at its antennae! Look at its… it’s looking at me.', 'shock'),
            l('roxton', 'Everyone stay calm. Big doesn’t mean angry.'),
            l('werther', 'Big means big, though.'),
            l('lilian', 'I need three landmarks to fix this island on the map. Then we have proof.'),
            n('Your Nubbins are thrilled and terrified in equal measure. One has befriended a beetle the size of a sofa.'),
            l('fairweather', 'Don’t move. I need to draw this. Nobody will ever believe me.'),
          ],
          choices: [
            {
              id: 'np11-ride',
              label: 'Let your Nubbin ride the big beetle.',
              set: { 'np-11-beetle': 'rode' },
              then: [n('It rides. The beetle doesn’t mind. Fairweather takes notes so fast his pencil smokes.', 'happy')],
            },
            {
              id: 'np11-sketch',
              label: 'Help Fairweather sketch the beetle.',
              set: { 'np-11-beetle': 'sketched' },
              then: [l('fairweather', 'Yours is better than mine. That’s fine. I’m not jealous. I’m a little jealous.')],
            },
          ],
        },
        done: {
          id: 'np11-island-done',
          lines: [
            l('lilian', 'Waterfall, arch, tree. Mapped. It’s real now. Nobody can say it isn’t.', 'happy'),
            l('scrap', 'Er. What’s that big nest on top of the tree?'),
          ],
        },
      },
      {
        id: 'np11-step3',
        goal: 'Bring back one glowing fruit without waking the Moach.',
        hint: 'Move only while the Moach’s shadow crosses the sun. One fruit, no more.',
        check: 'find:item:lost-isle-fruit',
        scene: {
          id: 'np11-nest',
          lines: [
            n('On top of the tallest tree sits a nest made of whole branches. In it, three eggs the size of rowing boats.'),
            l('roxton', 'A Moach nest. The diary says they guard the fruit vine beside it. Fiercely.', 'think'),
            n('Beside the nest hangs a vine heavy with fruit that glows faintly, like a lamp turned low.'),
            l('fairweather', 'One fruit. Just one, as proof. Then home, quietly, before anything hatches.'),
            l('scrap', 'I’m small. I could get it.'),
            l('lilian', 'Absolutely not.'),
            l('werther', 'I’ll hold the rope. That’s what I do.'),
            n('High above, a shadow circles. A very large, very protective shadow.'),
          ],
          choices: [
            {
              id: 'np11-scrap-climbs',
              label: 'Let Scrap climb with your smallest Nubbin.',
              set: { 'np-11-fruit': 'scrap' },
              then: [l('scrap', 'I won’t let you down! I’ll let me down. Carefully. On a rope.', 'happy')],
            },
            {
              id: 'np11-you-climb',
              label: 'Climb up yourself.',
              set: { 'np-11-fruit': 'you' },
              then: [n('You climb. The branches creak. Your Nubbin climbs past you, faster, and looks back with pity.')],
            },
          ],
        },
        done: {
          id: 'np11-nest-done',
          lines: [
            n('One fruit, safe in the bag. Then, from the nest: a crack. A beak. A very loud, very hungry chirp.'),
            l('roxton', 'RUN!', 'shock'),
          ],
        },
      },
    ],
    complete: {
      id: 'np11-complete',
      lines: [
        n('Everyone runs. The Moach’s cry chases you all the way to the beach.'),
        n('The Unlikely Gull pulls away with its sails half up and Werther still climbing the anchor chain.'),
        l('fairweather', 'Proof! One fruit, one map and one extremely cross bird!', 'happy'),
        l('scrap', 'Can I keep my job? I was a good lookout. I looked out loads.'),
        l('roxton', 'You were a terrible lookout, Scrap. You can stay.', 'happy'),
        l('lilian', 'I’ve copied the map for you, Keeper. There’s a corner of that island with your name on it.', 'soft'),
        l('lilian', 'One question left. If I print this map, everyone believes us. And everyone comes.', 'think'),
        l('roxton', 'Collectors. Hunters. People with nets and no manners.'),
        l('fairweather', 'And if we don’t, nobody believes a word. We’re three cranks, a porter and a boy full of biscuit.', 'sad'),
      ],
      choices: [
        {
          id: 'np11-publish',
          label: 'Print the map. The world should know the island is real.',
          set: { 'np-11-map': 'published' },
          then: [
            l('lilian', 'Then it goes out with rules on the back. Look. Don’t take. Mind the birds.'),
            n('The Neopian Times prints Lilian’s map on its front page under THE ISLAND IS REAL, with a tiny sketch of your Nubbins in one corner.'),
          ],
        },
        {
          id: 'np11-secret',
          label: 'Keep the way there secret. Print the fruit, not the route.',
          set: { 'np-11-map': 'secret' },
          then: [
            l('lilian', 'A picture of the fruit and no coordinates. Let them argue about it.', 'soft'),
            n('The Neopian Times prints the glowing fruit under the headline IS IT REAL? Letters pour in. Lilian answers none of them.'),
          ],
        },
      ],
    },
    rewards: [
      {
        id: 'np11-lost-isle',
        kind: 'feature',
        label: 'Lost Isle section',
        description: 'Unlocks a Lost Isle section for your Neopia sandbox: giant-insect jungle, a waterfall, a stone arch and a (quiet, empty) Moach nest.',
      },
      {
        id: 'np11-times',
        kind: 'item',
        label: 'Neopian Times: THE ISLAND IS REAL',
        description: 'This plot’s Neopian Times front page, kept in your Neopia scrapbook. If you kept the route secret, the headline reads IS IT REAL?',
      },
      {
        id: 'np11-avatar',
        kind: 'title',
        label: 'Avatar: Lost Isle Explorer',
        description: 'A trophy avatar for the Journey to the Lost Isle.',
      },
    ],
    sets: { 'np-11-done': true },
    notes:
      'Requires NP6 only, so the Learning Grove can reach it; the main game still plays it after NP10 (see the header). ' +
      'Payoff of `np-05-stance` (main game only; NP5 never plays in the Learning Grove): step 1 plays NEOPIA_LINE_VARIANTS np11-diary-defend / -parley / -villagers in place of np11-diary (Roxton or Lilian knows you from Meridell, and the Scrap choice answers to it). ' +
      'Reward label: THE ISLAND IS REAL when np-11-map = published, IS IT REAL? when it is secret, matching the scene. ' +
      'Audience all. The brief names the crew: Professor Fairweather, Roxton Colchester, Lilian, Werther and the stowaway Scrap. The ship name (the Unlikely Gull) is ours. ' +
      'Step 2 is free exploration of a small island map with three landmarks; step 3 a timing climb (move while the Moach’s shadow blocks the sun; caught means you slide back down, no harm). ' +
      'The escape is a cutscene chase. The closing choice sets `np-11-map` (published | secret); either way the player keeps Lilian’s copy and the section unlocks. Unlock: the Lost Isle section, as the brief lists. Art: giant Petpetpets, a sofa-sized beetle, glowing fruit, a hatchling Moach for the final beat.',
  },

  // ================================================================== NP12
  {
    id: 'np12',
    code: 'NP12',
    title: 'Altador',
    source: 'Neopets site plot: Altador (2007)',
    audience: 'all',
    trigger: { where: 'Neopia world map, a new mountain road', when: 'After NP11, the road appears on the map.' },
    requires: ['NP11'],
    speakers: [
      { id: 'np12-archivist', name: 'The Archivist', kind: 'other', basedOn: 'The Archivist of Altador (Neopets)' },
      { id: 'altador', name: 'King Altador', kind: 'other', basedOn: 'King Altador (Neopets)' },
    ],
    steps: [
      {
        id: 'np12-step1',
        goal: 'Follow the Archivist to the Archives of Altador.',
        hint: 'Keep to the white road. Anything blurry is safe to walk through, just slow.',
        check: 'visit:neopia:altador',
        scene: {
          id: 'np12-road',
          lines: [
            n('A road appears on the Neopia map where there was never a road. It leads into mountains, and the mountains are humming.'),
            n('At the end stands a city of white stone, beautiful and blurry, like a photo someone breathed on.'),
            l('np12-archivist', 'Visitors! Real ones! Nobody has come up that road in… I’ve forgotten. That’s the problem.', 'happy'),
            l('np12-archivist', 'This is Altador. We’ve been slipping out of the world’s memory, a little more every year.', 'sad'),
            l('np12-archivist', 'Even I forget things. Your name, for instance. Did you say it? Say it again later.', 'think'),
            n('Your Nubbin touches a wall. Its paw sinks a little way into the stone, as if into fog.'),
            l('np12-archivist', 'Come to the Archives. There’s a map there. A map of the sky.'),
            n('Behind you, the road you walked up is already fading.'),
          ],
          choices: [
            {
              id: 'np12-why',
              label: 'Ask why the sky matters.',
              then: [l('np12-archivist', 'Our twelve heroes are written up there. If their stars scatter, the city forgets them, and then itself.')],
            },
            {
              id: 'np12-name',
              label: 'Tell the Archivist your name, slowly.',
              set: { 'np-12-named': true },
              then: [l('np12-archivist', 'There. I’ll write it on my hand. I write everything on my hand now.', 'soft')],
            },
            {
              id: 'np12-paw',
              label: 'Pull your Nubbin back from the wall.',
              then: [n('Its paw comes out fine. It looks very pleased with itself.', 'happy')],
            },
          ],
        },
        done: {
          id: 'np12-road-done',
          lines: [
            n('The Archives are a round room with no roof. Above is the night sky, and it’s wrong.'),
            l('np12-archivist', 'Twelve constellations. All scrambled, as if someone shook the box.'),
            l('np12-archivist', 'Sorry, who are you again? …No, wait. It’s on my hand. Under “buy milk”.', 'happy'),
          ],
        },
      },
      {
        id: 'np12-step2',
        goal: 'Restore the first six constellations on the star map.',
        hint: 'Match the outlines carved in the floor. Drag stars until every line of an outline glows.',
        check: 'puzzle:constellation:altador:6',
        scene: {
          id: 'np12-stars',
          lines: [
            l('np12-archivist', 'Each hero has a shape. The Archer, the Scholar, the Farmer, the Thief, the Dreamer, the Knight.'),
            l('np12-archivist', 'Then the Builder, the Seer, the Healer, the Bard and the Wanderer. And the King, last of all.'),
            n('Loose stars drift overhead. With the star-staff you can reach them and nudge them into place.'),
            l('np12-archivist', 'Every shape has its stars and its story. Put the right stars together and the story comes back.'),
            n('The floor is carved with faint outlines: a bow, a book, a plough, a key…'),
            n('Your Fly Nubbin flaps up and nudges a star with its head. It clicks into the bow. A light comes on in the city below.'),
            l('np12-archivist', 'Oh! The archery field. I remember the archery field!', 'happy'),
            l('np12-archivist', 'Six tonight, if you can. The rest tomorrow.'),
          ],
        },
        done: {
          id: 'np12-stars-done',
          lines: [
            n('Six shapes burn in the sky. Below, half the city is solid again. Somebody is singing in a bakery.'),
            n('The other half is still blurry. A man in it is trying to open a door that has not decided to exist yet.'),
            l('np12-archivist', 'Half. Half is the most I’ve had in years.', 'happy'),
          ],
        },
      },
      {
        id: 'np12-step3',
        goal: 'Find the missing stars and restore the last six constellations.',
        hint: 'Missing stars are hidden around the Archives. Your Nubbins can sniff them out.',
        check: 'puzzle:constellation:altador:12',
        scene: {
          id: 'np12-stars2',
          lines: [
            n('The second night. The last six shapes are harder: their stars are faint, and some are missing altogether.'),
            l('np12-archivist', 'The Bard’s stars went first. Nobody ever writes down the musicians.', 'sad'),
            n('Your Nubbins scatter through the Archives and come back with stars: one under a desk, one in a teacup, one in a Nubbin’s mouth.'),
            l('np12-archivist', 'I don’t know how they got down here. I’m not going to ask.'),
            n('High above, the finished shapes wait for the rest.'),
            l('np12-archivist', 'When the last star goes in, the city will remember. Stand back. I don’t know what it does when it remembers.'),
            n('Your Nubbin is holding the last star very carefully in both paws.'),
            l('np12-archivist', 'That one’s the King’s. Now, or last?'),
          ],
          choices: [
            {
              id: 'np12-king-last',
              label: 'Save the King’s star for last.',
              set: { 'np-12-order': 'king-last' },
              then: [l('np12-archivist', 'Yes. A king should come last. It keeps them humble.')],
            },
            {
              id: 'np12-king-first',
              label: 'Put the King’s star in now.',
              set: { 'np-12-order': 'king-first' },
              then: [l('np12-archivist', 'Bold. The heroes won’t mind. They were always pushing him to the front.', 'happy')],
            },
          ],
        },
        done: {
          id: 'np12-stars2-done',
          lines: [
            n('The twelfth shape lights. The whole sky rings, like a glass tapped with a spoon.'),
            n('Below, Altador comes into focus all at once: sharp, white, and very loud.'),
          ],
        },
      },
    ],
    complete: {
      id: 'np12-complete',
      lines: [
        l('np12-archivist', 'The Hall of Heroes. He’s been in here the whole time. Asleep. Forgotten, even by himself.'),
        n('Twelve statues. Eleven are stone. The one in the middle wears a crown, and is breathing.'),
        l('altador', 'Who…? I had a city. I had friends. I had a dog, I think. Did I have a dog?', 'think'),
        l('np12-archivist', 'You had a city, Majesty. You still have it. This Keeper put it back in the sky.'),
        l('altador', 'Then thank you, Keeper. Altador is open to you: its gates, its Colosseum, and its terrible coffee.', 'happy'),
        l('altador', 'We used to hold a cup in the Colosseum. Races, cheering, far too many flags. Bring your Nubbins, for old times’ sake.'),
        n('Your Nubbin licks his hand. He laughs, surprised, as if he’d forgotten that too.'),
        n('The Neopian Times prints a star chart on its front page. For the first time in years, somebody remembers to.'),
      ],
    },
    rewards: [
      {
        id: 'np12-altador',
        kind: 'feature',
        label: 'Altador section',
        description: 'Unlocks the Altador section for your Neopia sandbox: white stone, the Hall of Heroes and the star-roofed Archives.',
      },
      {
        id: 'np12-cup',
        kind: 'feature',
        label: 'Colosseum race cup',
        description: 'A one-time race cup in Altador’s Colosseum, run in Neopia with your Nubbins as guests (not a yearly event). The cup stays in Neopia.',
      },
      {
        id: 'np12-times',
        kind: 'item',
        label: 'Neopian Times: ALTADOR REMEMBERED',
        description: 'This plot’s Neopian Times front page, kept in your Neopia scrapbook.',
      },
      {
        id: 'np12-avatar',
        kind: 'title',
        label: 'Avatar: Stargazer of Altador',
        description: 'A trophy avatar for restoring Altador’s constellations.',
      },
    ],
    sets: { 'np-12-done': true },
    notes:
      'Audience all. CONSTELLATION PUZZLE: twelve shapes on a star map, matched to outlines on the Archives floor. The Grove’s own names for the twelve council heroes: ' +
      'the Archer (bow), the Scholar (book), the Farmer (plough), the Thief (key), the Dreamer (crescent), the Knight (shield), the Builder (hammer), the Seer (eye), ' +
      'the Healer (leaf), the Bard (harp), the Wanderer (boot) and the King (crown). These are deliberately generic; the brief’s NP12 summary is from memory, so check against the source if matching the original heroes matters. ' +
      'Step 2: drag stars into six outlines (each placed star lights a district of the city). Step 3: find the missing stars (Bard, Healer, Wanderer each have one hidden: under a desk, in a teacup, carried by a Nubbin), then place the last six. ' +
      'The city sprite is blurred and goes sharp in stages. Unlocks the Altador section and the one-time Colosseum race cup, as the brief lists.',
  },

  // ================================================================== NP13
  {
    id: 'np13',
    code: 'NP13',
    title: 'The Return of Dr. Sloth',
    source: 'Neopets site plot: The Return of Dr. Sloth (January–March 2008)',
    audience: 'all',
    trigger: { where: 'Neopia Central', when: 'After NP12, every screen in Neopia Central turns green.' },
    requires: ['NP12'],
    speakers: [
      SLOTH,
      { id: 'gorix', name: 'Gorix', kind: 'other', basedOn: 'Gorix of the Resistance (Neopets)' },
      { id: 'cylara', name: 'Cylara', kind: 'other', basedOn: 'Cylara (Neopets)' },
      { id: 'np13-spacefaerie', name: 'The Space Faerie', kind: 'other', basedOn: 'The Space Faerie (Neopets)' },
      { id: 'np13-orange', name: 'An Orange Grundo', kind: 'other' },
      { id: 'np13-purple', name: 'A Purple Grundo', kind: 'other' },
    ],
    steps: [
      {
        id: 'np13-step1',
        goal: 'Meet the Resistance at the hidden shuttle dock.',
        hint: 'Gorix’s shuttle is behind the Neopia Central Food Shop. Tap the stacked crates.',
        check: 'talk:gorix',
        scene: {
          id: 'np13-broadcast',
          lines: [
            n('Every screen in Neopia Central flickers green at once: shop signs, the bank clock, the Rainbow Pool’s fountain lights.'),
            l('sloth', 'Greetings, Neopia. Do stop screaming; it’s unbecoming. I have taken back the Virtupets Space Station. It was always mine.', 'happy'),
            l('sloth', 'You may remember my robot in Maraqua. My voice in the ice. My butler at the lodge. My little fly at the feast.'),
            l('sloth', 'Practice, all of it. Now I have the real thing: a station, a fleet, and a moon full of workers.'),
            n('Your Nubbin growls at the screen. It has never growled before. It looks surprised at itself.', 'angry'),
            l('gorix', 'Psst. Keeper. Don’t turn round. Look at the shop window.'),
            n('In the reflection, a stocky Grundo in a patched flight suit is pretending to read a menu.'),
            l('gorix', 'Gorix. The Resistance. We’ve watched you knock his toys over for years. Fancy finishing the job?'),
          ],
          choices: [
            {
              id: 'np13-yes',
              label: 'Yes. Let’s finish it.',
              set: { 'np-13-joined': 'eager' },
              then: [l('gorix', 'Good. Shuttle leaves in ten minutes. It’s held together with tape, so don’t lean on anything.', 'happy')],
            },
            {
              id: 'np13-plan',
              label: 'Ask what the plan is first.',
              set: { 'np-13-joined': 'cautious' },
              then: [l('gorix', 'Kreludor first. He’s got the Grundos fighting each other. Can’t beat him while they do.', 'think')],
            },
            {
              id: 'np13-bring',
              label: 'Ask if your Nubbins can come.',
              set: { 'np-13-joined': 'nubbins' },
              then: [l('gorix', 'Can they come? They’re half the plan. His robots can’t aim at anything that small.')],
            },
          ],
        },
        done: {
          id: 'np13-broadcast-done',
          lines: [
            n('The shuttle rattles, roars and climbs. Below, Neopia shrinks to a green and blue marble.'),
            n('Something falls off the shuttle with a clang. Gorix tapes over the hole without looking up.'),
            n('Ahead, grey and pitted and close: Kreludor, the moon.'),
          ],
        },
      },
      {
        id: 'np13-step2',
        goal: 'Talk both Grundo camps into peace at the Kreludite mine.',
        hint: 'Speak to the orange and the purple camp leaders, then bring them to the middle of the crater.',
        check: 'talk:kreludor:grundo-camps:2',
        scene: {
          id: 'np13-kreludor',
          lines: [
            n('Kreludor’s mines glitter with Kreludite. Two camps of Grundos face each other across a crater, orange on one side, purple on the other.'),
            l('gorix', 'He told the orange lot the purple lot were stealing. Then told the purple lot the same. Then sold them both shovels.', 'angry'),
            l('np13-orange', 'They took our seam! Everyone knows they took our seam!', 'angry'),
            l('np13-purple', 'We never touched your seam! You took our seam!', 'angry'),
            n('Between the camps, a young Grundo girl sits on a rock, swinging her legs, bored of everyone.'),
            l('cylara', 'They’ve been shouting for a week. Nobody’s mined a thing. He wins either way.'),
            l('cylara', 'I’m Cylara. Gorix says you’re useful. Are you?', 'think'),
            n('Your Nubbins bounce in the low gravity, very slowly, and very happily.', 'happy'),
          ],
          choices: [
            {
              id: 'np13-maps',
              label: 'Lay both camps’ mine maps side by side.',
              set: { 'np-13-peace': 'maps' },
              then: [n('The maps match. The seam runs under both camps, and his pipes are draining it from below.', 'think')],
            },
            {
              id: 'np13-picnic',
              label: 'Get both camps to sit down and eat together.',
              set: { 'np-13-peace': 'picnic' },
              then: [n('Nobody can shout with their mouth full. By the second sandwich they’re comparing notes on Sloth.', 'happy')],
            },
            {
              id: 'np13-play',
              label: 'Let your Nubbins play in the middle of the crater.',
              set: { 'np-13-peace': 'play' },
              then: [n('Your Nubbins play tag between the camps. Grundos of both colours start cheering for the same one.', 'happy')],
            },
          ],
        },
        done: {
          id: 'np13-kreludor-done',
          lines: [
            l('np13-orange', 'He played us.', 'think'),
            l('np13-purple', 'He played all of us.', 'angry'),
            l('cylara', 'Good. Now we play him back.', 'happy'),
          ],
        },
      },
      {
        id: 'np13-step3',
        goal: 'Fight through the flagship’s robot guards to reach Dr. Sloth.',
        hint: 'Robots are tall and slow to aim down. Small Nubbins get under their guard.',
        check: 'karate:wave:return-of-dr-sloth:3',
        scene: {
          id: 'np13-token',
          lines: [
            n('At the crater’s edge the dark sky shimmers, and a faerie made of starlight steps down onto the moon dust.'),
            l('np13-spacefaerie', 'Cylara. You have been very patient. Here.', 'soft'),
            n('She gives Cylara a token: a small silver disc, warm, with a single star set in the middle.'),
            l('np13-spacefaerie', 'Use it close to him. Very close. It works only once.'),
            l('cylara', 'Once is plenty.'),
            l('gorix', 'His flagship is docked above the mine. Guarded by every robot he ever built, and some he never finished.', 'think'),
            n('Your Nubbins line up beside the Grundos, orange and purple together. Nobody needed to ask them.'),
            l('np13-spacefaerie', 'Keeper, get her to him. That is all you have to do.'),
          ],
        },
        done: {
          id: 'np13-token-done',
          lines: [
            n('The last robot topples. It is a half-built Mechachiazilla, and it falls with a sad clank.'),
            l('gorix', 'He never could finish anything.'),
          ],
        },
      },
      {
        id: 'np13-step4',
        goal: 'Keep Dr. Sloth busy for three rounds while Cylara gets close.',
        hint: 'His claws strike where you were, not where you are. Keep moving, and stay between him and Cylara.',
        check: 'karate:survive:dr-sloth:3',
        scene: {
          id: 'np13-sloth',
          lines: [
            n('The flagship’s bridge is green light and humming screens. Dr. Sloth turns his chair round slowly, as if he has practised.'),
            l('sloth', 'The Keeper. A child. And a great many very small pets. Is this your army?'),
            l('sloth', 'I have beaten you a hundred times in my head. I shall enjoy doing it in person.', 'happy'),
            l('cylara', 'You haven’t beaten anyone. You’ve just kept coming back.'),
            l('sloth', 'Persistence, girl, is the highest form of genius. I should know. I have persisted magnificently.', 'angry'),
            n('He pulls a lever. The floor bristles with claws. Every screen shows your face, twelve times, unflatteringly.'),
            l('gorix', 'Keep him busy! She has to get close!'),
            n('Cylara slips behind a console. Your Nubbins spread out across the bridge.'),
          ],
          choices: [
            {
              id: 'np13-talk',
              label: 'Keep him talking about himself.',
              set: { 'np-13-distract': 'talk' },
              then: [
                l('you', 'The fly at the feast. Was that your idea?'),
                l('sloth', 'Of course it was. Shall I tell you how I built it? It began with a single wing…', 'happy'),
              ],
            },
            {
              id: 'np13-chase',
              label: 'Lead the claws on a chase round the bridge.',
              set: { 'np-13-distract': 'chase' },
              then: [n('Your Nubbins run rings. The claws chase them, tangle, and tie themselves in a knot.', 'happy')],
            },
            {
              id: 'np13-screens',
              label: 'Unplug the screens.',
              set: { 'np-13-distract': 'screens' },
              then: [l('sloth', 'NOT THE SCREENS. Those are for my face!', 'shock')],
            },
          ],
        },
        done: {
          id: 'np13-sloth-done',
          lines: [
            n('Cylara steps out right beside his chair and holds up the silver token.'),
            l('sloth', 'What is that? Put that down. Put that—', 'shock'),
          ],
        },
      },
    ],
    complete: {
      id: 'np13-complete',
      lines: [
        n('Light pours out of the token, cold and clear. It folds around Dr. Sloth like a shell closing.'),
        l('sloth', 'No. No! I will come b—', 'angry'),
        n('And he is gone, sealed inside a small, bright, silent star no bigger than a marble.'),
        l('cylara', 'Once was plenty.', 'happy'),
        l('gorix', 'The station’s ours. The Grundos are free. And nobody has to watch another green broadcast.', 'happy'),
        n('Cylara opens the airlock. The token drifts out, spinning, smaller and smaller, until it is just another star.'),
        l('np13-spacefaerie', 'Let it drift. Space is very big, and he is very small now.', 'soft'),
        n('Back home, the rainbow gate shimmers a colour you have never seen. For one visit, it opens on an island no map has ever shown.'),
        n('Lutari Island. Your Nubbins are already running for the gate.', 'happy'),
      ],
    },
    rewards: [
      {
        id: 'np13-line',
        kind: 'flag',
        label: 'The Neopia line, complete',
        description: 'Completes the Neopia line: every plot played, and Dr. Sloth trapped for good.',
      },
      {
        id: 'np13-lutari',
        kind: 'feature',
        label: 'Lutari Island, once',
        description: 'The rainbow gate opens once onto Lutari Island, the island nobody can find. One visit only.',
      },
      {
        id: 'np13-times',
        kind: 'item',
        label: 'Neopian Times: SLOTH SEALED IN A STAR',
        description: 'This plot’s Neopian Times front page, kept in your Neopia scrapbook.',
      },
      {
        id: 'np13-avatar',
        kind: 'title',
        label: 'Avatar: Hero of the Resistance',
        description: 'A trophy avatar for ending the Return of Dr. Sloth.',
      },
    ],
    sets: { 'np-13-done': true, 'np-line-complete': true, 'np-lutari-gate': 'open-once' },
    childLines: {
      'np13-broadcast#2': 'You may remember my robot in Maraqua. My butler at the lodge. My little fly at the feast.',
    },
    notes:
      'Learning Grove: the broadcast skips the Voice in the ice (NP2 is main only) via childLines. ' +
      'Payoff of `np-05-stance` (main game only): step 1 plays NEOPIA_LINE_VARIANTS np13-broadcast-defend / -parley / -villagers in place of np13-broadcast (Gorix recruits the Keeper he heard about at Meri Acres; the yes / plan / bring replies change with it). ' +
      'Audience all. Sloth is trapped, not killed: sealed in the Space Faerie’s token, which drifts off into space, as in the brief. ' +
      'Sloth thread payoff: his broadcast lists every plant by name, in order (Mechachiazilla in NP1, the Voice in NP2, Maverick in NP3, the metal fly in NP4), and the last robot guard is a half-built Mechachiazilla. ' +
      'Step 2 is a talk-and-bring puzzle (both camp leaders to the crater centre); any choice works. Step 3 is three robot waves on the flagship; step 4 a 3-round survive bout with Sloth’s floor claws, ending in Cylara’s token cutscene. ' +
      'Kreludor has low gravity: Nubbins jump higher there. Epilogue: the rainbow gate turns an unknown colour and opens once to Lutari Island (np-lutari-gate: open-once; the sim closes it after one visit). Completes the Neopia line.',
  },
];

// ------------------------------------------------------------------ variants
/** The scene with id `sceneId` in the line above (a step scene, a done scene or a complete). */
function baseScene(sceneId: string): Scene {
  for (const q of NEOPIA_LINE) {
    for (const s of q.steps) {
      if (s.scene.id === sceneId) return s.scene;
      if (s.done?.id === sceneId) return s.done;
    }
    if (q.complete.id === sceneId) return q.complete;
  }
  throw new Error(`neopia-line: no scene ${sceneId}`);
}

/**
 * A variant of `sceneId` for `np-05-stance` = `stance`, built from the base scene so the
 * rest of the scene (and every choice id and flag) stays identical. `replace` swaps lines
 * by index, `insert` adds a line at an index, `thens` swaps a choice's reply by choice id.
 */
function stanceVariant(
  sceneId: string,
  stance: 'defend' | 'parley' | 'villagers',
  opts: { replace?: Record<number, Line>; insert?: { at: number; line: Line }; thens?: Record<string, Line[]> },
): Scene {
  const base = baseScene(sceneId);
  const lines = base.lines.map((ln, i) => opts.replace?.[i] ?? ln);
  if (opts.insert) lines.splice(opts.insert.at, 0, opts.insert.line);
  const choices = base.choices?.map((c) => {
    const then = opts.thens?.[c.id];
    return then ? { ...c, then } : c;
  });
  return { id: `${sceneId}-${stance}`, lines, ...(choices ? { choices } : {}) };
}

/**
 * Payoffs of the line's signature choice, `np-05-stance`. Chosen as the Atlas chooses its
 * variants: the sim plays `<scene id>-<stance>` in place of the scene when the flag holds
 * that value (sim/atlas.ts variantFor). Main game only: NP5 is never in the Learning Grove.
 */
export const NEOPIA_LINE_VARIANTS: Scene[] = [
  // ---------------------------------------------------------------- NP9, step 2: Nabile asks for your word
  stanceVariant('np09-nabile', 'defend', {
    replace: {
      0: l('nabile', 'Nabile. Thief, mostly. They say you held the fence at Meri Acres when a fortress came over the hill. I’ll follow that. For the loot.'),
      8: l('nabile', 'Keeper. When it came to it in Meridell, you stood and fought. Tell me honestly. Do I do this?'),
    },
    thens: {
      'np09-yes': [l('nabile', 'Fine. Shoulder to shoulder, like your fence. But I’m keeping the apples.')],
      'np09-careful': [l('nabile', 'A fence-holder telling me I don’t owe anyone a fight. I know. That’s why I’m choosing it.', 'soft')],
    },
  }),
  stanceVariant('np09-nabile', 'parley', {
    replace: {
      0: l('nabile', 'Nabile. Thief, mostly. They say you shouted up at a flying fortress and asked it to talk. I’ll follow that. Mostly for the loot.'),
      8: l('nabile', 'Keeper. You tried talking before fighting, once. Is a wedding talking, or fighting? Do I do this?'),
    },
    thens: {
      'np09-yes': [l('nabile', 'Talking, then. Fine. But I’m keeping the apples.')],
      'np09-careful': [l('nabile', 'I know. That’s why I’m choosing it. If it goes wrong, you can shout up at the sky. You’ve had practice.', 'soft')],
    },
  }),
  stanceVariant('np09-nabile', 'villagers', {
    replace: {
      0: l('nabile', 'Nabile. Thief, mostly. They say you got a whole farm behind a wall before the first blow fell in Meridell. I’ll follow that. For the loot.'),
      8: l('nabile', 'Keeper. In Meridell you got the small people out first. Am I a small person today, or a princess? Do I do this?'),
    },
    thens: {
      'np09-yes': [l('nabile', 'Princess, then. For one afternoon. But I’m keeping the apples.')],
      'np09-careful': [l('nabile', 'I know. That’s why I’m choosing it. Nobody is herding me up a hill.', 'soft')],
    },
  }),
  // ---------------------------------------------------------------- NP11, step 1: the Unlikely Gull has heard of you
  stanceVariant('np11-diary', 'defend', {
    insert: { at: 5, line: l('roxton', 'Champion of Meridell, aren’t you? Held a fence against a flying fortress. Good. Islands are mostly fences, in my experience.', 'happy') },
    thens: {
      'np11-stay': [l('roxton', 'Fine. Cabin crew. The Keeper held a fence; you can hold a mop. Cabin crew don’t eat the cargo.')],
    },
  }),
  stanceVariant('np11-diary', 'parley', {
    insert: { at: 5, line: l('lilian', 'You’re the Keeper who tried to talk a fortress down. Good. Most explorers go straight to the shouting.', 'soft') },
    thens: {
      'np11-stay': [l('lilian', 'Cabin crew. And when Roxton starts shouting at the jungle, you do the talking. That’s why you’re here.')],
    },
  }),
  stanceVariant('np11-diary', 'villagers', {
    insert: { at: 5, line: l('lilian', 'You got Meridell’s farmers behind a wall before the first arrow. On this ship the small ones are my job. I’d like help.') },
    thens: {
      'np11-stay': [l('lilian', 'Cabin crew, then. And if anything with teeth turns up, Scrap goes behind you. You’ve the habit.')],
    },
  }),
  // ---------------------------------------------------------------- NP13, step 1: Gorix recruits the Keeper he heard about
  stanceVariant('np13-broadcast', 'defend', {
    replace: {
      7: l('gorix', 'Gorix. The Resistance. One of ours held the fence beside you at Meri Acres. Says you never stepped back. We need that on a moon.'),
    },
    thens: {
      'np13-yes': [l('gorix', 'Good. Fence-holders on the shuttle first. It’s held together with tape, so don’t lean on anything.', 'happy')],
      'np13-plan': [l('gorix', 'Kreludor first. Two Grundo camps fighting each other. No fence to hold this time; you’ll have to talk.', 'think')],
    },
  }),
  stanceVariant('np13-broadcast', 'parley', {
    replace: {
      7: l('gorix', 'Gorix. The Resistance. You shouted up at a fortress once and asked it to talk. On Kreludor there are two camps who won’t. Fancy trying again?'),
    },
    thens: {
      'np13-plan': [l('gorix', 'Kreludor first. Orange camp, purple camp, each sure the other started it. Somebody has to shout up at both.', 'think')],
    },
  }),
  stanceVariant('np13-broadcast', 'villagers', {
    replace: {
      7: l('gorix', 'Gorix. The Resistance. We heard about Meri Acres: farmers behind the wall before the fighting. Half my people are miners’ kids. Fancy a moon?'),
    },
    thens: {
      'np13-bring': [l('gorix', 'Can they come? They’re half the plan. Small enough to get the mine children out, if it goes bad.')],
    },
  }),
];

export const CHECKS: string[] = [
  'visit:neopia:mystery-island',
  'find:place:chesterpots-house',
  'karate:survive:mechachiazilla:3',
  'karate:wave:tyrannian-invasion:1',
  'karate:wave:tyrannian-invasion:3',
  'karate:wave:tyrannian-invasion:4',
  'karate:survive:monoceraptor:3',
  'talk:ski-lodge:guests:4',
  'find:clue:ski-lodge:3',
  'karate:win:maverick',
  'talk:usurper:suspects:5',
  'find:clue:usurper:8',
  'puzzle:solve:usurper',
  'visit:neopia:meridell',
  'karate:wave:champions-of-meridell:3',
  'karate:win:orb-darigan',
  'find:secret-word:volcano-mystery:2',
  'find:secret-word:volcano-mystery:5',
  'minigame:chant:volcano-mystery',
  'karate:wave:battle-for-meridell:3',
  'give:food:barn-creature',
  'find:item:dancers-charm',
  'karate:win:citadel-guard',
  'talk:caylis',
  'talk:king-kelpbeard',
  'karate:wave:curse-of-maraqua:3',
  'explore:sakhmet-shadow:market',
  'karate:wave:qasala-wedding:2',
  'craft:ancient-weapon',
  'karate:survive:razul-shadows:3',
  'follow:bruno:neovia',
  'escort:gilly:swamp',
  'craft:cure:hissi-oil',
  'talk:roxton-colchester',
  'explore:lost-isle:landmarks:3',
  'find:item:lost-isle-fruit',
  'visit:neopia:altador',
  'puzzle:constellation:altador:6',
  'puzzle:constellation:altador:12',
  'talk:gorix',
  'talk:kreludor:grundo-camps:2',
  'karate:wave:return-of-dr-sloth:3',
  'karate:survive:dr-sloth:3',
];
