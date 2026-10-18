/**
 * Multiverse campaign, Captain America line: CA1–CA10 (Steve Rogers).
 *
 * The rift above the waterfall opens on Steve Rogers’ world. The Keeper and up to two
 * Nubbins go through; each storyline follows its source’s plot beats with the Nubbins as
 * companions. Every line of dialogue is original. Audience 'adult' throughout, so no
 * childLines. The line’s thread is the Cosmic Cube: it sinks in CA4, is rebuilt and
 * shattered in CA9, and its fragments become Kobik in CA10.
 *
 * “Your Rebirth Nubbin” is the all-E-grade Nubbin that went through CA1. The game should
 * remember which Nubbin it was (flag `mv-ca-rebirth-nubbin` = its id); CA10 calls it back.
 *
 * Flags are prefixed `mv-ca`. Each storyline sets `mv-ca01`…`mv-ca10` on completion;
 * `mv-ca09` is required for Civil War (E1), and `mv-ca-complete` marks the whole line.
 */
import type { Quest, Speaker } from './types';
import type { Line, Mood, Scene } from '../config/story';

const say =
  (who: string) =>
  (text: string, mood?: Mood): Line =>
    mood ? { who, text, mood } : { who, text };

const N = say('narrator');
const Y = say('you');

// ---------------------------------------------------------------- speakers
const STEVE: Speaker = { id: 'steve', name: 'Steve Rogers', kind: 'other', basedOn: 'Steve Rogers / Captain America (Marvel)' };
const ERSKINE: Speaker = { id: 'erskine', name: 'Dr Erskine', kind: 'other', basedOn: 'Dr. Abraham Erskine (Marvel)' };
const COLONEL: Speaker = { id: 'colonel', name: 'The Colonel', kind: 'other', basedOn: 'The army officer over Project Rebirth (later Chester Phillips)' };
const SPY: Speaker = { id: 'spy', name: 'The Man in Grey', kind: 'other', basedOn: 'The Nazi agent who shoots Erskine (later named Heinz Kruger)' };
const BUCKY: Speaker = { id: 'bucky', name: 'Bucky Barnes', kind: 'other', basedOn: 'James “Bucky” Barnes (Marvel)' };
const SKULL: Speaker = { id: 'skull', name: 'The Red Skull', kind: 'other', basedOn: 'Johann Schmidt, the Red Skull (Marvel)' };
const ZEMO: Speaker = { id: 'zemo', name: 'Baron Zemo', kind: 'other', basedOn: 'Baron Heinrich Zemo (Marvel)' };
const WASP: Speaker = { id: 'wasp', name: 'The Wasp', kind: 'other', basedOn: 'Janet van Dyne, the Wasp (Marvel)' };
const AIM: Speaker = { id: 'aim-scientist', name: 'A.I.M. Scientist', kind: 'other', basedOn: 'An Advanced Idea Mechanics scientist (Tales of Suspense #79)' };
const SAM: Speaker = { id: 'sam', name: 'Sam Wilson', kind: 'other', basedOn: 'Sam Wilson, the Falcon (Marvel)' };
const NUMBER_ONE: Speaker = { id: 'number-one', name: 'Number One', kind: 'other', basedOn: 'Number One of the Secret Empire (Captain America #175)' };
const TAUREY: Speaker = { id: 'taurey', name: 'William Taurey', kind: 'other', basedOn: 'William Taurey of the Royalist Forces of America (Captain America #193–200)' };
const ROCKWELL: Speaker = { id: 'rockwell', name: 'Douglas Rockwell', kind: 'other', basedOn: 'Douglas Rockwell, Commission on Superhuman Activities (Marvel)' };
const WALKER: Speaker = { id: 'walker', name: 'John Walker', kind: 'other', basedOn: 'John Walker, later U.S.Agent (Marvel)' };
const KINGPIN: Speaker = { id: 'kingpin', name: 'The Kingpin', kind: 'other', basedOn: 'Wilson Fisk, the Kingpin (Marvel)' };
const BULLSEYE: Speaker = { id: 'bullseye', name: 'Bullseye', kind: 'other', basedOn: 'Bullseye (Marvel)' };
const SHARON: Speaker = { id: 'sharon', name: 'Sharon Carter', kind: 'other', basedOn: 'Sharon Carter, Agent 13 (Marvel)' };
const LUKIN: Speaker = { id: 'lukin', name: 'General Lukin', kind: 'other', basedOn: 'General Aleksander Lukin (Marvel)' };
const WINTER: Speaker = { id: 'winter', name: 'The Winter Soldier', kind: 'other', basedOn: 'Bucky Barnes as the Winter Soldier (Marvel)' };
const KOBIK: Speaker = { id: 'kobik', name: 'Kobik', kind: 'other', basedOn: 'Kobik, the Cosmic Cube as a child (Marvel)' };
const HYDRA_STEVE: Speaker = { id: 'hydra-steve', name: 'Supreme Leader Rogers', kind: 'other', basedOn: 'Steve Rogers rewritten as a Hydra agent (Secret Empire, 2017)' };

const S = say('steve');
const E = say('erskine');
const COL = say('colonel');
const SPYL = say('spy');
const B = say('bucky');
const SK = say('skull');
const Z = say('zemo');
const WA = say('wasp');
const AI = say('aim-scientist');
const SW = say('sam');
const ONE = say('number-one');
const TA = say('taurey');
const RO = say('rockwell');
const JW = say('walker');
const KP = say('kingpin');
const BE = say('bullseye');
const SC = say('sharon');
const LK = say('lukin');
const WS = say('winter');
const KO = say('kobik');
const HS = say('hydra-steve');

const GATE = 'The rift above the waterfall (Multiverse save slot)';

export const MV_CAP: Quest[] = [
  // ------------------------------------------------------------------ CA1
  {
    id: 'mv-ca01',
    code: 'CA1',
    title: 'Project Rebirth',
    source: 'Captain America Comics #1 (1941)',
    audience: 'adult',
    trigger: { where: GATE, when: 'Any time once the Multiverse rift is open and the Keeper owns an all-E-grade Nubbin' },
    speakers: [STEVE, ERSKINE, COLONEL, SPY],
    steps: [
      {
        id: 'mv-ca01-s1',
        goal: 'Take your weakest Nubbin through the rift and follow Dr Erskine.',
        hint: 'Put an all-E-grade Nubbin in your Multiverse party. If you have none, your lowest-graded Nubbin will do.',
        check: 'party:nubbin:all-e-grade',
        scene: {
          id: 'mv-ca01-recruit',
          lines: [
            N('The rift sets you down on a wet pavement outside an army recruiting office. The posters are new. The cars are not.'),
            N('Your weakest Nubbin is tucked under your arm. Every grade on its sheet is an E. It wanted to come anyway.'),
            N('A thin young man comes down the steps with a stamped card. He folds it in half so nobody can read it.'),
            S('Turned down. Again. Asthma, a bad heart, flat feet, and today they found something wrong with my ears.', 'sad'),
            S('That’s five offices. I keep changing the address and they keep reading the same body.'),
            N('He notices your Nubbin, which is trying very hard to look taller than it is.'),
            S('Is that one signing up too? Good luck. They measure your chest. Breathe in.', 'happy'),
            N('Across the street an old man in a heavy coat has been watching the steps for an hour. He isn’t watching the soldiers.'),
            E('Excuse me. You, the young man who keeps coming back. And you, with the small one. Walk with me a little?'),
            S('Who’s asking?', 'think'),
            E('A doctor who is tired of choosing the wrong people. My name is Erskine.'),
          ],
          choices: [
            {
              id: 'vouch',
              label: 'He keeps coming back. That has to count.',
              set: { 'mv-ca-rebirth': 'vouched' },
              then: [
                E('It counts for nearly everything. Hold on to that thought.', 'happy'),
                N('Steve looks at you as if nobody has said a kind word on these steps in weeks.'),
              ],
            },
            {
              id: 'wary',
              label: 'Careful, Steve. Old men in coats offer odd deals.',
              set: { 'mv-ca-rebirth': 'wary' },
              then: [
                E('Very wise. And I am offering a very odd deal.', 'happy'),
                S('I’ve been offered worse. Mostly I’ve been offered nothing.'),
              ],
            },
          ],
        },
        done: {
          id: 'mv-ca01-recruit-done',
          lines: [
            E('And that one. The little one. Every grade an E, yes?', 'think'),
            E('Then it has never once been handed anything. Good. It will know what to do if it ever is.'),
          ],
        },
      },
      {
        id: 'mv-ca01-s2',
        goal: 'Run the boot-camp course with Steve Rogers and your Rebirth Nubbin.',
        hint: 'Finishing is enough. The timer is there to annoy the Colonel, not to judge you.',
        check: 'race:finish:mv-boot-camp',
        scene: {
          id: 'mv-ca01-camp',
          lines: [
            N('Erskine’s project borrows a corner of an army camp: forty volunteers, one obstacle course, and a colonel who hates it all.'),
            N('The others run the course in four minutes. Steve takes nine. Your Nubbin takes eleven and falls off the wall twice.'),
            COL('Doctor, your boy and his pet came in dead last. I could find you a mule with better numbers.', 'angry'),
            E('Numbers. You measure what a man can lift. I am about to give him more to lift than anyone alive.'),
            E('So I must know what he does when he is strong and nobody is looking. That is not on your clipboard.'),
            N('On the second lap a big recruit catches his boot at the wall and goes down hard. The pack runs past him.'),
            N('Steve stops. So does your Nubbin. Neither of them can lift him, so they both try anyway.'),
            COL('Wasting his time on a man who’ll wash out tomorrow.'),
            COL('In a war, Doctor, the man who stops loses the hill. I need soldiers who keep running.', 'angry'),
            E('And I need one who knows what the hill was for.', 'think'),
            E('Yes. Exactly that. Write it down, Colonel.', 'happy'),
            E('Run it once more with them, Keeper. Not to win. I want to see whether the little one waits for him again.', 'think'),
          ],
        },
        done: {
          id: 'mv-ca01-camp-done',
          lines: [
            N('Last again. Your Nubbin crosses the line holding the strap of Steve’s pack in its mouth.'),
            E('Him. And, if the army took such things, it. Tomorrow we begin.', 'happy'),
          ],
        },
      },
      {
        id: 'mv-ca01-s3',
        goal: 'Stop the man in grey before he gets out of the laboratory.',
        hint: 'A short karate bout: your Nubbin only has to stay on its feet until Steve reaches the door.',
        check: 'karate:win:mv-rebirth-spy',
        scene: {
          id: 'mv-ca01-rebirth',
          lines: [
            N('The laboratory hides behind a curio shop. A bell rings as you go in. The old woman at the counter is not an old woman.'),
            N('Inside: a steel couch, a rack of glass ampoules, generals in good coats, and a man in grey at the back, taking notes.'),
            E('One injection. Then the rays. The body will become what it was always able to become.'),
            S('Will it hurt?', 'think'),
            E('Yes. I am sorry. I have never lied to a volunteer, and I will not start with the most important one.'),
            N('Your Nubbin climbs onto the couch beside Steve and holds very still. Nobody has the heart to move it.'),
            N('The serum goes in. The lamps come on. Under the sheet, Steve’s shape changes like weather coming over a hill.'),
            N('When it is done he sits up, broad and astonished, and looks at his hands as if they belong to somebody else.'),
            E('It works. Gentlemen, it works! With this, a whole army of—', 'happy'),
            N('The man in grey stands up. You see the pistol a heartbeat before anyone else. So does your Nubbin.'),
            N('Shots. Glass. Erskine falls among his own ampoules, and every one of them breaks.'),
            SPYL('Your miracle ends tonight, Doctor. Nobody else gets one.', 'angry'),
          ],
        },
        done: {
          id: 'mv-ca01-rebirth-done',
          lines: [
            N('Your Nubbin clings to the spy’s trouser leg like a burr. It slows him by one step.'),
            N('One step is enough. Steve crosses the room in two strides, and the spy reels back into the ray machine. A flash. Then quiet.'),
          ],
        },
      },
    ],
    complete: {
      id: 'mv-ca01-complete',
      lines: [
        N('The formula was never written down. It lived in Erskine’s head, and his head is going quiet.'),
        E('One, then. Only one. It will have to be enough.', 'sad'),
        E('Little one. I would have picked you too. The strong forget what it was like. You never will.', 'soft'),
        N('His hand goes still on your Nubbin’s head.'),
        S('I didn’t even get to thank him.', 'sad'),
        Y('Thank him by being worth it.'),
        S('…Yeah. All right. Yeah.'),
        N('Before you go back through the rift, Steve ties a strip of striped cloth around your Nubbin’s neck. It is a little too long.'),
      ],
    },
    rewards: [
      { id: 'mv-ca01-title', kind: 'title', label: 'Erskine’s Pick', description: 'Title for the Nubbin that went through Project Rebirth. Shown on its stat sheet. Its grades stay exactly as they are.' },
      { id: 'mv-ca01-scarf', kind: 'cosmetic', label: 'Rebirth Scarf', description: 'A striped scarf, a little too long, tied on by Steve Rogers. Wearable by any Nubbin.' },
    ],
    sets: { 'mv-ca01': true },
    notes:
      'Opens the Captain America line; no prerequisite beyond the Multiverse rift. Check `party:nubbin:all-e-grade`: if the player has no all-E Nubbin, accept the lowest total-grade Nubbin and swap the done line “Every grade an E, yes?” for “Not a grade on it above a D, yes?”. Store that Nubbin’s id in `mv-ca-rebirth-nubbin`; CA10 calls it back, and the title goes to it. If it later leaves the Grove, CA10 uses any all-E Nubbin. Staging: 1940s street, army camp course (race track reskin), curio-shop lab with a humming ray lamp. Erskine’s shooting is off-panel: cut to white on the shots, back on broken glass. No blood. Issue checked: Captain America Comics #1 (March 1941); Erskine is “Prof. Reinstein” there, named Erskine in later retellings.',
  },

  // ------------------------------------------------------------------ CA2
  {
    id: 'mv-ca02',
    code: 'CA2',
    title: 'Bucky and the Red Skull',
    source: 'Captain America Comics #1–7 (1941)',
    audience: 'adult',
    trigger: { where: GATE, when: 'After CA1, Project Rebirth' },
    requires: ['CA1'],
    speakers: [STEVE, BUCKY, SKULL],
    steps: [
      {
        id: 'mv-ca02-s1',
        goal: 'Talk to Bucky Barnes in Steve’s tent at Camp Lehigh.',
        hint: 'Bring your Run Nubbin. Bucky only talks shop with somebody faster than him.',
        check: 'talk:bucky-barnes',
        scene: {
          id: 'mv-ca02-tent',
          lines: [
            N('Camp Lehigh, 1941. Private Steve Rogers is the clumsiest soldier in his company, on purpose. He drops his rifle on a schedule.'),
            N('Your Run Nubbin has been adopted by the camp mascot, a quick-talking kid in a borrowed cap.'),
            B('Bucky Barnes. Regimental mascot, unofficial, unpaid. Your little guy beat me to the mess hall three times. Nobody beats me.'),
            N('After lights-out, the kid and your Nubbin race to Steve’s tent with a stolen pie. The flap is open.'),
            N('Steve is halfway into a blue costume with a white star on the chest. A round shield leans on his cot.'),
            B('No. No! The flag fella from the newsreels is the private who trips over tent pegs?', 'shock'),
            S('Close the flap. Close it! Bucky, listen to me—'),
            B('Oh, I’ll keep it quiet. Course I will. For a price.', 'happy'),
            S('Kid, I’m not paying you.'),
            B('Not money. Take me along. I can run, I can climb, I can box, and I’ve never told on anybody in my life.'),
            N('Steve looks at you. The kid looks at you. Your Nubbin, still holding the pie, also looks at you.'),
          ],
          choices: [
            {
              id: 'back',
              label: 'He kept up with my Nubbin. Let him come.',
              set: { 'mv-ca-bucky': 'backed' },
              then: [
                S('You realise you’ve just made yourself responsible for him.', 'think'),
                N('Bucky salutes you with the pie. Most of it stays on the plate.'),
              ],
            },
            {
              id: 'cautious',
              label: 'He’s a kid, Steve. If he comes, he stays behind you.',
              set: { 'mv-ca-bucky': 'cautious' },
              then: [
                B('Behind him. Fine. I’ll be the fastest thing behind anybody.', 'happy'),
                S('Behind me, and next to the Nubbin. That’s the deal.'),
              ],
            },
          ],
        },
        done: {
          id: 'mv-ca02-tent-done',
          lines: [
            N('By morning Bucky has a domino mask cut from a blue sock. He has cut a tiny one for your Nubbin.'),
            B('Partners. All three of us. Four, with the pie.', 'happy'),
          ],
        },
      },
      {
        id: 'mv-ca02-s2',
        goal: 'Beat the Red Skull’s saboteurs on the aircraft-plant floor.',
        hint: 'Three karate bouts in a row. Run Nubbins dodge best on the gantry.',
        check: 'karate:win:mv-skull-saboteurs',
        scene: {
          id: 'mv-ca02-plant',
          lines: [
            N('Weeks of night raids. Bucky goes over every fence first, and your Run Nubbin goes over just behind him, like his shadow.'),
            B('Three bombers down this month, straight out of the factory. Every pilot radioed the same thing before he crashed.'),
            S('A face in the cockpit glass. Red, and grinning.', 'think'),
            N('The aircraft plant at midnight. Rows of half-built bombers. One office light, high up on the gantry.'),
            N('A figure steps into it. Its head is a red skull, polished and awful, and the voice behind it is perfectly calm.'),
            SK('Captain America. And the boy. And, I see, some sort of rodent. Americans will make a pet of anything.'),
            SK('Every bomber in this hall will fall before it reaches the war. Fear flies faster than aeroplanes, Captain.'),
            S('Then let’s see how fast you can run.'),
            N('Men in overalls put down their spanners and pick up crowbars. Half the night shift is on the Skull’s payroll.'),
            B('I’ll take the left. Little one, you take the ladder. Go!', 'angry'),
          ],
        },
        done: {
          id: 'mv-ca02-plant-done',
          lines: [
            N('The saboteurs are tied up with their own cable. The gantry is empty. A red mask lies on the steps.'),
            S('That isn’t the last of him. A man like that always has a spare face.', 'think'),
            B('Then we keep knocking them off.', 'happy'),
            N('One saboteur is barely older than Bucky, crying into his collar. The Skull paid him twenty dollars a bomber.'),
            B('Twenty bucks. My old man worked a month for twenty bucks. Cap, his family’s probably eating off it.', 'sad'),
            S('Three pilots didn’t come home because of him, Bucky.'),
          ],
          choices: [
            {
              id: 'mp',
              label: 'Hand him to the military police. Three pilots are owed that.',
              set: { 'mv-ca02-saboteur': 'arrested' },
              then: [
                S('He’ll get a fair hearing. That’s the difference between us and the Skull. It has to be.'),
                B('Yeah. I know. I just hate knowing it.', 'sad'),
              ],
            },
            {
              id: 'chance',
              label: 'He’s a scared kid. Make him tell you everything, then let him run.',
              set: { 'mv-ca02-saboteur': 'released' },
              then: [
                N('He talks for an hour: names, drop points, a farmhouse the Skull uses. Then he runs and doesn’t look back.'),
                S('If he does it again, that’s on us. I’ll carry it. You too, Keeper.', 'think'),
              ],
            },
          ],
        },
      },
    ],
    complete: {
      id: 'mv-ca02-complete',
      lines: [
        N('Dawn at Camp Lehigh. Private Rogers trips over a tent peg in front of the sergeant, right on time.'),
        N('The sergeant shouts himself purple. Your Run Nubbin trips over the same peg in sympathy, and the sergeant gives up.'),
        S('I keep telling myself he’s too young for this. Then he’s first over every fence, and I let him.', 'think'),
        B('You’re coming back, right? The little one’s the only one who ever beat me to breakfast.'),
        S('It’ll be back. So will we.', 'soft'),
        N('Your Run Nubbin wears its sock mask all the way home through the rift and will not take it off at bedtime.'),
      ],
    },
    rewards: [
      { id: 'mv-ca02-mask', kind: 'cosmetic', label: 'Sock Mask', description: 'A tiny blue domino mask Bucky cut for your Run Nubbin. Wearable by any Nubbin.' },
      { id: 'mv-ca02-tin', kind: 'decor', label: 'Camp Lehigh Pie Tin', description: 'A dented army pie plate for the Grove. Nubbins sometimes sit in it.' },
    ],
    sets: { 'mv-ca02': true },
    notes:
      'Needs a Run Nubbin in the party for step 1 (check `talk:bucky-barnes` should only fire with one present; otherwise Bucky says he’s busy). Store the Run Nubbin’s id in `mv-ca-bucky-nubbin`; CA9 prefers it. The Red Skull escapes, as he recurs. The step 2 done choice (mv-ca02-saboteur: arrested / released) is the Keeper’s call on mercy; it changes nothing mechanical. Staging: Camp Lehigh tents at night, aircraft-plant hall with gantry for the karate arena. The Skull of 1941 #1 was an impostor (George Maxon); Johann Schmidt arrives in #7. We play them as one Skull. ' +
      'SIGNATURE CHOICE: mv-ca02-saboteur (arrested | released) pays off through MV_CAP_VARIANTS at mv-ca05-smear (who the witnesses are, or who brings Steve names), mv-ca07-shield (what Steve offers Walker) and mv-ca10-memory (what the real Steve remembers that Hydra’s Steve cannot).',
  },

  // ------------------------------------------------------------------ CA3
  {
    id: 'mv-ca03',
    code: 'CA3',
    title: 'Frozen',
    source: 'The Avengers #4 (1964)',
    audience: 'adult',
    trigger: { where: GATE, when: 'After CA2, Bucky and the Red Skull' },
    requires: ['CA2'],
    speakers: [STEVE, BUCKY, ZEMO, WASP],
    steps: [
      {
        id: 'mv-ca03-s1',
        goal: 'Chase Baron Zemo’s drone plane down the runway.',
        hint: 'An Expedition: send your fastest Nubbin along the runway and your Swim Nubbin to the water’s edge.',
        check: 'expedition:complete:mv-drone-plane',
        scene: {
          id: 'mv-ca03-plane',
          lines: [
            N('The last spring of the war. A grey airfield on the English coast, and a drone plane packed nose to tail with explosives.'),
            Z('Baron Zemo sends his compliments, Captain. The plane flies itself to London. You may watch it go.', 'happy'),
            Z('Forgive the hood. Thanks to your last visit to my laboratory, it no longer comes off. I have had it lined.', 'angry'),
            B('He’s still sore about the glue. Cap, he’s still sore about the glue.', 'happy'),
            N('The engines catch. The plane rolls. Steve and Bucky are running before anyone gives an order.'),
            S('Bucky, the wing strut! I’ll take the tail!'),
            N('Bucky gets aboard. Steve doesn’t. He hangs from the wheel for a hundred yards and drops into the sea.'),
            B('There’s a wire on this bomb. Two wires. I think I can— yeah, I think I’ve got it, Cap!', 'think'),
            N('Above the water the plane climbs. In its belly, a boy is holding two wires and a torch.'),
            N('Your Nubbins have their own choice to make. One of them is still on the plane. The other is in the water near Steve.'),
          ],
          choices: [
            {
              id: 'with-bucky',
              label: 'Stay with Bucky. Help him with the wires.',
              set: { 'mv-ca-plane': 'with-bucky' },
              then: [
                N('Your Nubbin holds the torch steady over the bomb. Bucky’s hands are not shaking. Its paws are.'),
                B('Off, little one. Jump. Now. Go!', 'angry'),
                N('It jumps. It is the last thing he says to anyone.'),
              ],
            },
            {
              id: 'with-steve',
              label: 'Dive after Steve.',
              set: { 'mv-ca-plane': 'with-steve' },
              then: [
                N('Your Nubbin finds Steve’s collar in the grey water. He is trying to swim back towards the plane.'),
                S('Bucky! Bucky, get out of there!', 'shock'),
              ],
            },
          ],
        },
        done: {
          id: 'mv-ca03-plane-done',
          lines: [
            N('The sky turns white. When it clears, there is no plane, only pieces falling.'),
            N('Steve goes under. The sea is so cold it stops feeling like water. Your Nubbins come up. He doesn’t.'),
          ],
        },
      },
      {
        id: 'mv-ca03-s2',
        goal: 'Dive under the Arctic ice with your Swim Nubbin.',
        hint: 'An Expedition dive. Your Swim Nubbin leads; the others keep the hole in the ice open.',
        check: 'expedition:complete:mv-arctic-dive:swim',
        scene: {
          id: 'mv-ca03-ice',
          lines: [
            N('The rift drops you somewhere else in time: sea ice, a white sun that never sets, and a submarine nosing through the floes.'),
            WA('Don’t mind us, we’re the Avengers on a very cold detour. Is that yours? It’s been swimming under the ice for an hour.', 'happy'),
            N('Your Swim Nubbin surfaces, dives, surfaces again. Each time it comes up it squeaks the same note and points down.'),
            WA('It’s found something. Or it’s found a fish and wants us to be proud.'),
            N('You follow its bubbles. Under the ice a man in a blue uniform hangs in a clear block, arms out, as if he fell a moment ago.'),
            N('The star on his chest has gone pale. The shield is still on his arm. He never let go of it.'),
            WA('Is that a museum costume? That’s a man. That’s— oh.', 'shock'),
            N('Your Swim Nubbin presses its face to the ice and stays there, very still, the way it waits beside an egg.'),
            WA('Thaw him slowly. Slowly! If anybody’s still in there, I want him back in one piece.'),
          ],
        },
        done: {
          id: 'mv-ca03-ice-done',
          lines: [
            N('In the submarine’s warm room the ice runs off him in streams. Steve opens his eyes and sits up swinging.'),
            S('Bucky! The plane— where’s Bucky?', 'shock'),
            N('Your Swim Nubbin climbs onto his chest and holds on with both paws, as if to keep him in this year.'),
          ],
        },
      },
    ],
    complete: {
      id: 'mv-ca03-complete',
      lines: [
        S('How long? Tell me straight.'),
        WA('A long time, Captain. Years and years. Most of the people you knew are old, or gone.', 'sad'),
        S('And the kid? Bucky?'),
        N('Nobody answers. Your Swim Nubbin pushes its head under his hand.'),
        S('He was a kid. I told him to stay behind me.', 'sad'),
        S('Everything I know is twenty years out of date. The money. The songs. Who’s on which side.', 'think'),
        WA('The coffee’s better. The rest we’ll catch you up on. You can be slow for a bit, you know. We’ll wait.', 'soft'),
        N('At the rift he turns around.'),
        S('Look after that one. It found me when nobody else could.'),
      ],
    },
    rewards: [
      { id: 'mv-ca03-title', kind: 'title', label: 'Found Him First', description: 'Title for the Swim Nubbin that found Steve Rogers in the ice.' },
      { id: 'mv-ca03-ice', kind: 'decor', label: 'Block of Arctic Ice', description: 'A clear ice block for the pond’s edge. It never quite melts. Swim Nubbins like to lean on it.' },
    ],
    sets: { 'mv-ca03': true },
    notes:
      'Two time periods: April 1945 (English airfield, Channel) and the 1960s Arctic. Fade to white on the explosion; no bodies. The `mv-ca-plane` flag colours CA9’s rooftop scene. In Avengers #4 Namor throws the ice block into the sea and the Avengers’ submarine picks Cap up; here the Swim Nubbin finds him first, as the brief asks. Needs a Swim Nubbin in the party for step 2. The Wasp stands in for the whole Avengers team to keep the speaker count down.',
  },

  // ------------------------------------------------------------------ CA4
  {
    id: 'mv-ca04',
    code: 'CA4',
    title: 'The Cosmic Cube',
    source: 'Tales of Suspense #79–81 (1966)',
    audience: 'adult',
    trigger: { where: GATE, when: 'After CA3, Frozen' },
    requires: ['CA3'],
    speakers: [STEVE, SKULL, AIM],
    steps: [
      {
        id: 'mv-ca04-s1',
        goal: 'Cross the Red Skull’s rewritten island to reach his palace.',
        hint: 'An Expedition through a world the Cube keeps rewriting. Paths shift every few turns, so carry extra fruit.',
        check: 'expedition:complete:mv-skull-island',
        scene: {
          id: 'mv-ca04-cube',
          lines: [
            N('A.I.M. built it in a lab under an island: a small cube that does whatever its holder wants.'),
            N('The Red Skull was supposed to have died in the war. He walks into the lab in a fresh mask and takes it from them.'),
            AI('He just asked for it, and we gave it to him. Why did we give it to him?', 'shock'),
            SK('Because the Cube likes a firm hand.', 'happy'),
            N('The Skull turns it once. The island grows a palace. He turns it twice, and the A.I.M. men kneel and forget why.'),
            N('He turns it at you, and your Nubbins’ colours drain to grey, the grey of a Nubbin nobody has ever loved.'),
            S('Leave them out of it, Skull. You want me. You always have.'),
            SK('I want everything, Captain. You are merely the first thing I shall frame and hang on the wall.'),
            N('Your Nubbins are grey, but not gone. One of them is still breathing on your hand, warm.'),
          ],
          choices: [
            {
              id: 'hold',
              label: 'Hold them close. Don’t look at the Cube.',
              set: { 'mv-ca-cube-gaze': 'refused' },
              then: [
                N('You keep your eyes on your Nubbins. Colour creeps back into one cheek, then the other.'),
                SK('Stubborn. Your whole species is stubborn.', 'angry'),
              ],
            },
            {
              id: 'stare',
              label: 'Stare the Skull down.',
              set: { 'mv-ca-cube-gaze': 'stared' },
              then: [
                N('You look straight at him. The Cube hums, as if amused. Your Nubbins stay grey, but they press closer.'),
                S('Good. Let him see we’re not scared.'),
              ],
            },
          ],
        },
        done: {
          id: 'mv-ca04-cube-done',
          lines: [
            N('The palace stairs keep changing their number. Your Nubbins count them out loud, and that seems to help.'),
            N('At the top, a throne room with no ceiling.'),
          ],
        },
      },
      {
        id: 'mv-ca04-s2',
        goal: 'Keep the Red Skull’s hands busy until Steve can knock the Cube away.',
        hint: 'A karate bout. You don’t need to win on points, only to last three rounds against the Skull.',
        check: 'karate:win:mv-red-skull',
        scene: {
          id: 'mv-ca04-throne',
          lines: [
            N('The Skull sits under a sky he has painted himself, the Cube in his lap.'),
            SK('Kneel, Captain. Kneel, and your Keeper may keep their pets.'),
            N('He turns the Cube. Beside the throne, a boy in a borrowed cap flickers into being, grinning, a pie in his hands.'),
            SK('Kneel, and I will make him real. Your partner, back from the sea. Is one bent knee too much for the boy?', 'happy'),
            N('Steve’s shield arm drops an inch. Your Nubbin takes one step towards the boy, then stops: it smells nothing.'),
            S('He isn’t there. Your toy can draw him, Skull. It can’t make him. That’s the difference.', 'sad'),
            S('You need a cube to make one man kneel. Doesn’t that tell you something?', 'think'),
            SK('It tells me I have a cube.'),
            S('I was a skinny kid from Brooklyn with nothing, and I still stood up. You’ve got the universe in your lap and you’re scared of me.'),
            N('The Skull’s grip tightens. A cube can remake the world, but it can’t settle a grudge. Only hands do that.'),
            SK('I need no toy to break you.', 'angry'),
            N('He sets the Cube on the arm of the throne and comes down the steps himself. Pride, it turns out, outweighs the universe.'),
            S('Keep him busy. I only need one throw.'),
          ],
        },
        done: {
          id: 'mv-ca04-throne-done',
          lines: [
            N('Steve’s shield clips the throne. The Cube bounces once, twice, off the palace wall and over the edge.'),
            N('It falls a long way and goes into the sea without a splash, like a coin into a well.'),
            SK('No!', 'shock'),
          ],
        },
      },
    ],
    complete: {
      id: 'mv-ca04-complete',
      lines: [
        N('The palace fades. The island is a rock again, and the Skull is gone in the confusion, as he always is.'),
        N('Your Nubbins’ colours come back all at once, like a held breath let out.'),
        S('It’s down there now. Somebody will go looking for it. Somebody always does.', 'think'),
      ],
      choices: [
        {
          id: 'mark',
          label: 'Send your Swim Nubbin to mark the spot.',
          set: { 'mv-ca-cube': 'marked' },
          then: [
            N('Your Swim Nubbin dives and comes back with a pebble from the place it sank. You aren’t sure why you keep it.'),
            S('Smart. If it ever comes back up, we’ll want to know where from.'),
          ],
        },
        {
          id: 'let-sink',
          label: 'Let the sea keep it.',
          set: { 'mv-ca-cube': 'let-sink' },
          then: [
            S('Good. Let the fish have the universe for a while. They’ll do less with it.', 'happy'),
            N('On the beach, your Nubbin finds a smooth pebble anyway, and gives it to you.'),
          ],
        },
      ],
    },
    rewards: [
      { id: 'mv-ca04-thread', kind: 'flag', label: 'The Cosmic Cube Thread', description: 'The Cube lies under the sea. Opens the thread that CA9 and CA10 follow, and counts towards Secret Wars (E2).' },
      { id: 'mv-ca04-pebble', kind: 'decor', label: 'Sea Pebble', description: 'A smooth grey pebble from the Skull’s island. It is very slightly warm.' },
    ],
    sets: { 'mv-ca04': true, 'mv-ca-cube-thread': true },
    notes:
      'Unlocks CA9 and CA10’s thread (both require CA4), and is required for Secret Wars (E2). The grey effect on the party Nubbins is the Shadow-Nubbin palette applied temporarily; it must revert at the end of step 2 whatever the player chose, and must never touch real Shadow state or trust. Throne room: palace with a painted sky, no roof. Pebble description can say “from the spot where the Cube sank” when `mv-ca-cube` is `marked`. Issues checked: Tales of Suspense #79–81 (1966).',
  },

  // ------------------------------------------------------------------ CA5
  {
    id: 'mv-ca05',
    code: 'CA5',
    title: 'Secret Empire',
    source: 'Captain America #169–180 (1974–75)',
    audience: 'adult',
    trigger: { where: GATE, when: 'After CA4, The Cosmic Cube' },
    requires: ['CA4'],
    speakers: [STEVE, SAM, NUMBER_ONE],
    steps: [
      {
        id: 'mv-ca05-s1',
        goal: 'Follow the committee’s trail from the smear adverts to whoever is paying for them.',
        hint: 'An Expedition with a Fly Nubbin scouting the rooftops. Sam’s falcon marks the safe streets.',
        check: 'expedition:complete:mv-committee-trail',
        scene: {
          id: 'mv-ca05-smear',
          lines: [
            N('Every television in every shop window is running the same advert: a calm voice and a slow zoom on Captain America’s face.'),
            N('Can we really trust him? asks the voice. A committee with a patriotic name has paid a fortune to ask it.'),
            SW('Sam Wilson. The Falcon, when I’m working. The bird is Redwing, and he’s decided your Nubbins are family. Lucky you.', 'happy'),
            SW('Three weeks of adverts. Then this morning a man turns up dead, and the witnesses swear Cap did it.'),
            S('It wasn’t me. Somebody wore my face. They want the country to go looking for a new hero.', 'angry'),
            SW('And look who just landed on the news. Moonstone, the hero the committee likes. Funny timing.'),
            N('A rally fills the park. Moonstone lands on the stage, and the crowd cheers like it was told to.'),
            S('Follow the adverts. Follow the money. Somebody always signs the cheques.'),
          ],
          choices: [
            {
              id: 'loud',
              label: 'Go to the rally and call Moonstone out.',
              set: { 'mv-ca-secret-empire': 'loud' },
              then: [
                N('You shout from the crowd. Heads turn. Moonstone’s smile slips for exactly one second, and the cameras catch it.'),
                SW('Okay. Bold. I respect it. We are now running.'),
              ],
            },
            {
              id: 'quiet',
              label: 'Follow the committee’s money quietly.',
              set: { 'mv-ca-secret-empire': 'quiet' },
              then: [
                N('The donations run through four banks and a florist. Your Nubbins find the florist suspicious. They are right.'),
                S('Patient. Good. They’re counting on us being angry.'),
              ],
            },
          ],
        },
        done: {
          id: 'mv-ca05-smear-done',
          lines: [
            N('The trail ends in a bunker under the desert: rows of men in hoods, and a throne nobody sits on yet.'),
            SW('Hoods. Of course it’s hoods.'),
          ],
        },
      },
      {
        id: 'mv-ca05-s2',
        goal: 'Follow Number One to Washington and stand with Steve when the hood comes off.',
        hint: 'Walk Steve out through the halls afterwards. Tap him when he stops on the steps.',
        check: 'talk:steve-rogers:after-number-one',
        scene: {
          id: 'mv-ca05-number-one',
          lines: [
            N('The Secret Empire’s leader calls himself Number One. His plan was to wipe the minds of Washington and run it himself.'),
            N('The plan fails. He runs. He runs straight to Washington, into a white house you’d know from any postcard.'),
            SW('He went in there? Cap, he went in there?', 'shock'),
            S('Then that’s where we’re going.'),
            N('The guards let Captain America through out of habit. Your Nubbins follow, because nobody thinks to stop them.'),
            N('In a quiet room Steve corners him and pulls the hood back. You can’t see the face from where you stand. Steve can.'),
            S('You. Of all people. You already had everything.', 'shock'),
            ONE('I had a job. I wanted the country. You never understood the difference.'),
            N('He steps back through a side door and shuts it. A single shot follows. Then nothing at all.'),
            N('Your Nubbins press against your ankles and do not make a sound.'),
          ],
        },
        done: {
          id: 'mv-ca05-steps',
          lines: [
            N('On the steps outside, an aide in a grey suit catches Steve’s sleeve. He has a statement ready, already typed.'),
            N('It says a lone madman was stopped in the grounds. It does not say who he was, or whose office he died in.'),
            SW('If the country hears the truth tonight, Cap, it might not get up in the morning.', 'think'),
            S('And if it never hears it, the next Number One gets the same quiet room.', 'angry'),
          ],
          choices: [
            {
              id: 'tell',
              label: 'The country deserves the truth, even if it hurts.',
              set: { 'mv-ca05-truth': 'told' },
              then: [
                N('Steve tears the statement in half, and the aide goes white. Somewhere a telephone starts ringing and does not stop.'),
                S('People can carry the truth. It’s the lies that break their backs.'),
              ],
            },
            {
              id: 'bury',
              label: 'Let it lie. A frightened country makes worse choices than a sad one.',
              set: { 'mv-ca05-truth': 'buried' },
              then: [
                N('Steve folds the statement into his pocket and says nothing to the cameras.'),
                S('Maybe you’re right. I’ll never know if you are. That’s what I can’t stand.', 'sad'),
              ],
            },
          ],
        },
      },
    ],
    complete: {
      id: 'mv-ca05-complete',
      lines: [
        N('That night Steve puts the shield down on a hotel bed and looks at it like a stranger’s.'),
        S('I always thought the flag and the people behind that door were the same thing. Tonight they weren’t.', 'sad'),
        S('I can’t wear their colours while I don’t trust them. I’ll find a name that belongs to nobody.'),
        SW('Nomad. The man without a country. Little dramatic. Suits you.', 'soft'),
        N('He holds the shield out to you.'),
      ],
      choices: [
        {
          id: 'keep',
          label: 'I’ll keep it safe till you want it back.',
          set: { 'mv-ca-shield': 'kept' },
          then: [
            N('It is heavier than it looks. Your Nubbins help you carry it to the rift, one at each edge.'),
            S('Thanks. Don’t let them use it as a sledge.', 'happy'),
          ],
        },
        {
          id: 'refuse',
          label: 'It’s yours. Put it in a cupboard, not in my hands.',
          set: { 'mv-ca-shield': 'cupboard' },
          then: [
            S('Fair. It goes in a cupboard. I’ll know where it is.', 'think'),
            N('He shuts the wardrobe door on it very gently, like a man closing a door on a sleeping child.'),
          ],
        },
      ],
    },
    rewards: [
      { id: 'mv-ca05-cape', kind: 'cosmetic', label: 'Nomad Cape', description: 'A dark blue-and-gold cape cut for a Nubbin, after Steve’s Nomad costume. It trails behind them.' },
      { id: 'mv-ca05-title', kind: 'title', label: 'Without a Country', description: 'Title for a Nubbin that stood with Steve the night he gave up the shield.' },
    ],
    sets: { 'mv-ca05': true },
    notes:
      'Number One’s face is never shown and never named; the White House is “a white house you’d know from any postcard”. His death is a closed door and one sound, no visuals; fade to black and hold a beat before the complete scene. If `mv-ca-shield` is `kept`, the shield sits in the Grove (decor slot, not usable) until CA6 opens, when Steve collects it; if `cupboard`, CA6 opens with him taking it out. Moonstone appears on screen only, no lines. The new step 2 done scene (mv-ca05-steps) sets mv-ca05-truth (told / buried); either way Steve still gives up the shield in the complete scene. Issues checked: Captain America #169–176 (1974); Steve gives up the shield in #176 and becomes Nomad in #180, so the source cites #169–180.',
  },

  // ------------------------------------------------------------------ CA6
  {
    id: 'mv-ca06',
    code: 'CA6',
    title: 'The Madbomb',
    source: 'Captain America #193–200 (1976)',
    audience: 'adult',
    trigger: { where: GATE, when: 'After CA5, Secret Empire' },
    requires: ['CA5'],
    speakers: [STEVE, SAM, TAUREY],
    steps: [
      {
        id: 'mv-ca06-s1',
        goal: 'Find the source of the riot with your Fly Nubbin.',
        hint: 'An Expedition. Your Fly Nubbin hears the bomb’s whine before anyone else; go where its ears point.',
        check: 'expedition:complete:mv-madbomb-test:fly',
        scene: {
          id: 'mv-ca06-riot',
          lines: [
            N('A small town, a summer street, a brass band practising for the Bicentennial. Then everyone starts shouting at once.'),
            N('Neighbours throw chairs. The barber goes after the baker. Nobody knows why, and nobody can stop.'),
            N('Your Fly Nubbin hears it first: a whine too high for people, from a van parked on the corner. Its ears go flat.'),
            S('Back in the stars and stripes, back in trouble. What’s your Nubbin pointing at?'),
            SW('The van. Everybody near it goes wild. Everybody further off just goes sort of mean.'),
            S('Then the closer we get, the worse it gets. Cover your ears and keep moving.'),
            N('Your Fly Nubbin circles the van and dives at a grille on its roof. Under it sits a humming metal box the size of a trunk.'),
            SW('Madbomb. That’s what the notes in the cab call it. A small one. A test.', 'think'),
            S('A test for what?'),
          ],
          choices: [
            {
              id: 'smash',
              label: 'Rip the wires out before anyone else gets hurt.',
              set: { 'mv-ca-madbomb': 'smashed' },
              then: [
                N('Your Nubbin yanks a fistful of cable. The whine stops. All down the street, people put down chairs and look embarrassed.'),
                SW('Crude. Effective. We learn nothing from the wreck, but nobody dies today.'),
              ],
            },
            {
              id: 'study',
              label: 'Muffle it and keep it whole. We need to know who built it.',
              set: { 'mv-ca-madbomb': 'studied' },
              then: [
                N('You stuff the grille with your jacket and the whine drops. Your Nubbins sit on the lid to keep it shut.'),
                SW('There’s a crest on the casing. A crown. Somebody round here really misses the king.', 'think'),
              ],
            },
          ],
        },
        done: {
          id: 'mv-ca06-riot-done',
          lines: [
            N('The notes name the real target. The big bomb is set for the country’s two-hundredth birthday.'),
            S('Then we’ve got until the fireworks.'),
          ],
        },
      },
      {
        id: 'mv-ca06-s2',
        goal: 'Race the Madbomb train and cut the bomb car loose before the anniversary.',
        hint: 'A race along the tracks. Any Nubbin that keeps pace with the train can pull the coupling pin.',
        check: 'race:win:mv-madbomb-train',
        scene: {
          id: 'mv-ca06-estate',
          lines: [
            N('A country estate in old-money hills. Men in powdered wigs, a royal crest over the fireplace, and a deep hum under the floor.'),
            TA('William Taurey. My family lost this country in 1776, Captain. On its birthday I intend to take it back.', 'happy'),
            TA('Two hundred years of mob rule. The bomb only lets the mob be what it already is. Then the better sort steps in.'),
            S('You’ll drive a whole country to tear itself apart, so you can sit at the head of the table?', 'angry'),
            TA('Somebody must. I already have the chair.'),
            TA('You of all men should agree, Captain. Your mob trusted the man who died behind that door.', 'happy'),
            S('And it’ll get the next one wrong too, sometimes. It still gets to choose. You don’t get to choose for it.', 'angry'),
            SW('Also, and I can’t stress this enough, you are wearing a wig.'),
            N('Through the window you see it: the big Madbomb on a flatcar, on a siding, already rolling towards the cities.'),
            SW('Train’s picking up speed. I can catch it in the air. Can your Nubbins?'),
            N('Your Nubbins are already running. Your Fly Nubbin is already overhead.'),
            S('Sam, the engine. Nubbins, the coupling. I’ll take the bomb car. On my mark!', 'angry'),
          ],
        },
        done: {
          id: 'mv-ca06-estate-done',
          lines: [
            N('The coupling parts. The bomb car slows on a hill and stops in a field of cows, who are unimpressed.'),
            SW('The whole country, saved by a coupling pin and a rodent with wings.', 'happy'),
            S('Nubbin. They’re called Nubbins.'),
          ],
        },
      },
    ],
    complete: {
      id: 'mv-ca06-complete',
      lines: [
        N('The fireworks go up over the capital that night. Two hundred years, and not one riot.'),
        S('Taurey thought people are only decent because nobody’s pushing them.', 'think'),
        SW('Some folks push harder than others. People stay mostly decent. Mostly.'),
        SW('Same goes for rodents with wings. Sorry. Nubbins. Redwing’s been correcting me all afternoon.', 'happy'),
        N('Your Fly Nubbin sleeps through the fireworks with its ears folded down, the most sensible thing anyone does all night.'),
      ],
    },
    rewards: [
      { id: 'mv-ca06-bunting', kind: 'decor', label: 'Bicentennial Bunting', description: 'Red, white and blue bunting for the Grove fences. It flutters even when there’s no wind.' },
      { id: 'mv-ca06-earplugs', kind: 'cosmetic', label: 'Wax Earplugs', description: 'Tiny earplugs for a Fly Nubbin. They do nothing in the Grove except make it look very content.' },
    ],
    sets: { 'mv-ca06': true },
    notes:
      'Opens with Steve back as Captain America (he collects the shield as CA5’s `mv-ca-shield` flag says). Needs a Fly Nubbin in the party for step 1. The madbomb’s whine: a thin, rising sine tone the player should barely hear; duck the music while it plays and stop it dead when the bomb is muffled or smashed. Riot staging is comic, not violent: thrown chairs, shouting, no injuries shown. Taurey’s plot in the comic is for 4 July 1976; we keep the date. Issues checked: Captain America #193–200 (1976).',
  },

  // ------------------------------------------------------------------ CA7
  {
    id: 'mv-ca07',
    code: 'CA7',
    title: 'The Captain',
    source: 'Captain America #332–350 (1987–1989)',
    audience: 'adult',
    trigger: { where: GATE, when: 'After CA6, The Madbomb, and IM8, Armor Wars' },
    requires: ['CA6', 'IM8'],
    speakers: [STEVE, ROCKWELL, WALKER, SKULL],
    steps: [
      {
        id: 'mv-ca07-s1',
        goal: 'Sit in on the Commission’s hearing with Steve Rogers.',
        hint: 'Bring at least one Nubbin. The Commission takes it as a sign that you are a serious person.',
        check: 'talk:douglas-rockwell',
        scene: {
          id: 'mv-ca07-commission',
          lines: [
            N('A committee room in Washington. A long table, short tempers, and Douglas Rockwell, who chairs the Commission on Superhuman Activities.'),
            RO('Your recent conduct worries us, Captain. You fought Iron Man over armour that belonged to this government.'),
            N('You remember. You were there, through the other door of the rift, when Tony shut down the Guardsmen and Steve tried to stop him.'),
            RO('The suit, the shield and the name were made by this government. From now on you answer to this Commission. Directly.'),
            S('I serve the country. I’ve never served an office.', 'angry'),
            RO('Nobody elected you, Captain. You have a soldier’s body and a god’s reputation, and you answer to your own conscience.'),
            RO('In any other country, we would call that a warlord. Here we call it a hero, and hope.'),
            S('…That’s a fair point. I hate that it’s a fair point.', 'think'),
            RO('Then you have until tomorrow to change your mind.'),
            N('Steve doesn’t take until tomorrow. He takes off his gloves, sets the shield on the table, and walks out.'),
            N('Within a week there is a new Captain America. John Walker: tall, loud, loyal, and very eager to please.'),
            JW('Commission says I’m the man for it. Your little guys want a photo? I’m told I’m good with kids.', 'happy'),
          ],
          choices: [
            {
              id: 'luck',
              label: 'Wish Walker luck. He’ll need it.',
              set: { 'mv-ca-walker': 'luck' },
              then: [
                JW('Luck. Yeah. Thanks. Nobody else has said that.'),
                N('For a moment he looks younger than the uniform.'),
              ],
            },
            {
              id: 'cold',
              label: 'Tell him the shield isn’t his.',
              set: { 'mv-ca-walker': 'cold' },
              then: [
                JW('It is now. Signed paperwork and everything.', 'angry'),
                N('He holds the shield a little too tightly, as if somebody might take it back.'),
              ],
            },
          ],
        },
      },
      {
        id: 'mv-ca07-s2',
        goal: 'Trace the Commission’s orders to whoever is really giving them.',
        hint: 'An Expedition through government corridors. Run Nubbins open doors; Fly Nubbins listen at the vents.',
        check: 'expedition:complete:mv-commission-corridors',
        scene: {
          id: 'mv-ca07-black',
          lines: [
            N('Months on. Steve wears black now, with a red-and-white star, and calls himself the Captain. Old friends keep finding him.'),
            S('The Commission gets the shield. It doesn’t get the work.', 'think'),
            N('Then the news breaks. Somebody leaked John Walker’s real name, and the Watchdogs went to his parents’ house. Both are dead.'),
            N('Walker hunts the gang down in a single night. What he does with the shield is not what the shield was made for.'),
            S('They broke him. They handed him a weight and nobody showed him how to carry it.', 'sad'),
            S('Rockwell takes his orders from somewhere. Your Nubbins are good at getting through doors. Can they find out where?'),
            N('Behind a door marked Private, and a second door marked nothing at all, a man in an expensive suit sits with his back to you.'),
            N('He turns. He has Steve’s face. Exactly Steve’s face, down to the nick on the chin, with a stranger’s smile on it.'),
            SK('Do you like it? Grown from your Captain’s own cells. A thing of beauty, wasted on him.', 'happy'),
          ],
        },
      },
      {
        id: 'mv-ca07-s3',
        goal: 'Fight the Red Skull with Steve until the shield is back where it belongs.',
        hint: 'A karate bout. The Skull copies Steve’s moves, so vary yours.',
        check: 'karate:win:mv-skull-in-steves-body',
        scene: {
          id: 'mv-ca07-shield',
          lines: [
            N('Steve comes through the door a second after you. He sees his own face looking back and goes very still.'),
            S('Skull.', 'angry'),
            SK('Rogers. I had your Commission dismiss you in your own voice, on the telephone. They thanked me for my time.', 'happy'),
            SK('And Walker. I chose him myself. I wanted to watch your shield bent out of shape.'),
            N('Walker is in the doorway behind you, shield on his arm, breathing hard. He has heard every word.'),
            JW('You set me up. My mom and dad. You set the whole thing up.', 'angry'),
            S('John. Give me the shield. Not to keep. Just for this.'),
            N('Walker looks at the shield. Then at you, and at your Nubbins, as if somebody small might tell him what to do.'),
          ],
          choices: [
            {
              id: 'handed',
              label: 'Tell Walker he’s done enough. Let Steve take it.',
              set: { 'mv-ca-walker-end': 'handed' },
              then: [
                JW('Take it. I never knew what I was doing with it anyway.', 'sad'),
                N('The shield crosses the room. It settles on Steve’s arm as if it has been waiting.'),
              ],
            },
            {
              id: 'together',
              label: 'Tell them to fight him together.',
              set: { 'mv-ca-walker-end': 'together' },
              then: [
                JW('Together. Fine. You go high.', 'angry'),
                N('Walker keeps the shield for one round, then passes it to Steve on the backswing, as if he planned it all along.'),
              ],
            },
          ],
        },
        done: {
          id: 'mv-ca07-shield-done',
          lines: [
            N('In the struggle a capsule of the Skull’s own red dust breaks across his face.'),
            N('When it clears, Steve’s borrowed features have shrunk to a red skull again.'),
            SK('You have ruined a perfectly good face.', 'angry'),
          ],
        },
      },
    ],
    complete: {
      id: 'mv-ca07-complete',
      lines: [
        N('Weeks later, a small ceremony. Steve in blue again, the shield on his arm, the Commission studying its shoes.'),
        S('I don’t work for you. I’ll work with you, when we agree. That’s the only deal I take.', 'think'),
        RO('And when we don’t agree, Captain? Who decides then?', 'think'),
        S('Then I tell you to your face, in public, and I take the consequences. That’s the part I won’t give up.'),
        N('Walker takes the black suit Steve left behind, and a new name with it. He nods to your Nubbins on his way out.'),
        S('Tony and I still don’t see eye to eye about armour. But he called. He asked if I was all right.', 'soft'),
        N('Your Nubbins sniff the black suit as it goes past, the way they sniff a Keeper they’ve decided to forgive.'),
      ],
    },
    rewards: [
      { id: 'mv-ca07-suit', kind: 'cosmetic', label: 'Black-Star Suit', description: 'A black Nubbin suit with a red-and-white star, after Steve’s costume as the Captain.' },
      { id: 'mv-ca07-title', kind: 'title', label: 'The Captain', description: 'Title for the Nubbin that tracked the Red Skull through the Commission’s corridors.' },
    ],
    sets: { 'mv-ca07': true },
    notes:
      'Needs IM8 (Armor Wars): the hearing cites Steve’s clash with Tony over the Guardsmen, and the second rift line recalls the player being there. Walker’s parents’ deaths are reported, never shown. Walker’s rampage is one line of narration over a dark still, no violence shown. The Skull wears a clone of Steve’s body (Captain America #350); use Steve’s sprite with a red eye-glint and a different idle. The red dust is his “dust of death” from the comic, played here as a visual transformation only. Issues checked: Captain America #332–350 (1987–89).',
  },

  // ------------------------------------------------------------------ CA8
  {
    id: 'mv-ca08',
    code: 'CA8',
    title: 'Streets of Poison',
    source: 'Captain America #372–378 (1990)',
    audience: 'adult',
    trigger: { where: GATE, when: 'After CA7, The Captain' },
    requires: ['CA7'],
    speakers: [STEVE, KINGPIN, BULLSEYE],
    steps: [
      {
        id: 'mv-ca08-s1',
        goal: 'Raid the waterfront warehouse with Steve Rogers.',
        hint: 'An Expedition. Keep one Nubbin near Steve at all times; it will tell you if he starts to lose control.',
        check: 'expedition:complete:mv-waterfront-raid',
        scene: {
          id: 'mv-ca08-ice',
          lines: [
            N('A new drug is on the streets. The dealers call it Ice. It turns quiet people violent and violent people fearless.'),
            S('I’ve walked this street a hundred times. I’ve never seen it like this. They’re kids. All of them, kids.', 'sad'),
            N('A raid on a waterfront warehouse: crates of Ice, guards with machine pistols, and Steve going in first, as always.'),
            N('A crate splits. The powder goes up in a cloud. Steve breathes it in, coughs once, and keeps going.'),
            N('Your Nubbins notice before he does. He hits harder than he needs to. He hits again, after a man is already down.'),
            S('Next floor. Move. Faster!', 'angry'),
            N('Your Run Nubbin stops in front of him and does not move. Steve nearly treads on it, and stares, and breathes.'),
            S('What did I just do?', 'shock'),
          ],
          choices: [
            {
              id: 'tell',
              label: 'Tell him straight: it’s in his blood.',
              set: { 'mv-ca-ice': 'told' },
              then: [
                S('The serum. It’s holding on to the stuff instead of burning it off. Of course it is.', 'think'),
                S('Then I have to be careful. And you have to tell me when I’m not.'),
              ],
            },
            {
              id: 'cover',
              label: 'Say nothing. Just get him out of there.',
              set: { 'mv-ca-ice': 'covered' },
              then: [
                N('You steer him out by the elbow. He lets you. That frightens you more than anything that happened inside.'),
                S('I’m fine. I’m fine. Just keep the little one away from me for a minute.'),
              ],
            },
          ],
        },
        done: {
          id: 'mv-ca08-ice-done',
          lines: [
            N('The crates are stamped with a shipping line that belongs, three companies deep, to Wilson Fisk.'),
            N('The Kingpin of Crime, who sells Ice and invests the proceeds very sensibly.'),
          ],
        },
      },
      {
        id: 'mv-ca08-s2',
        goal: 'Fight Bullseye in Fisk Tower while Steve fights the Ice in his blood.',
        hint: 'A karate bout. Bullseye throws from range, so close the distance fast and keep moving.',
        check: 'karate:win:mv-bullseye',
        scene: {
          id: 'mv-ca08-tower',
          lines: [
            N('Fisk Tower. The Kingpin doesn’t get up when you come in. He rarely gets up for anyone.'),
            KP('Captain. A pleasure. And small guests. I keep cakes for small guests.', 'happy'),
            KP('You think I made this drug? I only sell it. The demand was here long before I was, Captain.'),
            S('You sell it to children.', 'angry'),
            KP('I sell it to customers. Their age is their own affair.'),
            KP('Close me, and a hungrier man opens tomorrow with dirtier stock. I keep the street orderly. Ask the police.', 'think'),
            S('I don’t doubt you’re orderly. Orderly is how you sleep at night.', 'angry'),
            KP('Bullseye, would you show our guests out?'),
            N('A man in the window seat flicks a playing card. On the far side of the room, a lamp cord parts neatly in two.'),
            BE('I can hit anything I can see. I can see a Captain, a Keeper and a set of Nubbins. Let’s count down.', 'happy'),
            N('Steve’s hands are shaking. The Ice is still in him. Every move he makes is a little too big.'),
            S('Keep him off my blind side. I can’t trust my own aim tonight.'),
          ],
          choices: [
            {
              id: 'fight',
              label: 'Fight beside him. It’s his call to make.',
              set: { 'mv-ca08-bench': 'fought' },
              then: [
                S('Thank you. If I go too far, you stop me. Not the Kingpin’s men. You.'),
                N('Your Nubbins take his left side, the blind one, and stay there.'),
              ],
            },
            {
              id: 'bench',
              label: 'Tell him to stand down. The Nubbins take Bullseye.',
              set: { 'mv-ca08-bench': 'benched' },
              then: [
                S('You don’t get to bench me. Nobody benches me.', 'angry'),
                S('…Nobody but people who are right. Fine. I’ll guard the door.', 'sad'),
                BE('Oh, the little ones. Good. I like a challenge with a smaller target.', 'happy'),
              ],
            },
          ],
        },
        done: {
          id: 'mv-ca08-tower-done',
          lines: [
            N('Bullseye leaves through the window, laughing, the way he always leaves. The Kingpin finishes his cake.'),
            KP('Do come again. Everyone does.'),
          ],
        },
      },
    ],
    complete: {
      id: 'mv-ca08-complete',
      lines: [
        N('In an Avengers infirmary, the doctors run a full blood transfusion to wash the Ice out of Steve. It takes all night.'),
        N('Your Nubbins sit on the end of the bed the whole time. The nurses stop asking them to move.'),
        S('The serum’s weaker now. Maybe it won’t come all the way back.', 'think'),
        S('Funny. I spent years wanting to be strong. Now I’d settle for being myself, at whatever size that is.'),
        Y('That was always the bigger thing.'),
        S('Erskine would’ve said the same. Probably with a longer word.', 'soft'),
      ],
    },
    rewards: [
      { id: 'mv-ca08-title', kind: 'title', label: 'Blind-Side Guard', description: 'Title for the Nubbin that kept Bullseye off Steve’s blind side.' },
      { id: 'mv-ca08-lamp', kind: 'decor', label: 'Infirmary Night-Light', description: 'A small green night-light for the Grove. Nubbins sleep closer to it after a bad day.' },
    ],
    sets: { 'mv-ca08': true },
    notes:
      'The drug is never shown being used; we see crates and a single cloud of powder. No dealers or users are children on screen; the kids are mentioned, not drawn. Bullseye’s card throw cuts a cord, never a person. Step 2’s choice sets mv-ca08-bench (fought / benched): if benched, the bout is the Nubbins alone and Steve appears only at the door. Steve’s tainted state: during the step 1 Expedition, give him a red edge-glow and occasional over-hits; the Run Nubbin’s blocking line triggers on the first over-hit. Daredevil, Crossbones and the Skull also appear in the comic arc; omitted for scope. Issues checked: Captain America #372–378 (1990).',
  },

  // ------------------------------------------------------------------ CA9
  {
    id: 'mv-ca09',
    code: 'CA9',
    title: 'The Winter Soldier',
    source: 'Captain America vol. 5 #1–14 (2005–2006)',
    audience: 'adult',
    trigger: { where: GATE, when: 'After CA8, Streets of Poison, with CA3 and CA4 complete' },
    requires: ['CA8', 'CA3', 'CA4'],
    speakers: [STEVE, SHARON, LUKIN, WINTER, BUCKY],
    steps: [
      {
        id: 'mv-ca09-s1',
        goal: 'Go through Sharon Carter’s file on the Winter Soldier.',
        hint: 'Bring the Run Nubbin from Camp Lehigh if you can. It notices things the file doesn’t.',
        check: 'talk:sharon-carter',
        scene: {
          id: 'mv-ca09-file',
          lines: [
            N('The Red Skull is dead. Somebody shot him in his own office, from a long way off, and left with his plans for a new Cosmic Cube.'),
            SC('Sharon Carter, S.H.I.E.L.D. The Skull was in business with a Russian general, Aleksander Lukin. Lukin wants a Cube of his own.'),
            SC('So did the Skull. Now the Skull is dead. I’d say Lukin got tired of sharing.'),
            S('Who pulled the trigger?', 'think'),
            SC('A ghost story. The Cold War called him the Winter Soldier. Fifty years of killings, and in every photo he looks the same age.'),
            N('She lays a photograph on the table: a long coat, a mask, a metal arm, a red star on the shoulder.'),
            N('Your Run Nubbin climbs onto the table and sits on the photograph. It will not get off.'),
            SC('Is it always like this?'),
            S('It only does that with people it’s met before.', 'shock'),
            SC('Steve. Whoever he used to be, he’s killed dozens of people since. Remember that before you remember him.', 'sad'),
            S('I’ll remember both. I just don’t know yet which one I’ll be talking to.'),
          ],
        },
        done: {
          id: 'mv-ca09-file-done',
          lines: [
            N('On the evening news, General Lukin opens a factory for the Kronas Corporation, smiling, shaking hands.'),
            SC('He smiles like a man who has never once been told no.'),
          ],
        },
      },
      {
        id: 'mv-ca09-s2',
        goal: 'Chase the Winter Soldier across the rooftops with your Run Nubbin.',
        hint: 'A rooftop race. Only a Run Nubbin can keep up, so put it in front.',
        check: 'race:win:mv-rooftops:run',
        scene: {
          id: 'mv-ca09-roofs',
          lines: [
            N('Philadelphia. A bomb in a station, a crowd running, and on a roof across the street a man with a metal arm, watching.'),
            N('Your Run Nubbin is up the fire escape before anyone says go. It always did take the ladder.'),
            S('Wait— wait for me!'),
            N('The roofs are wet. The Winter Soldier runs like a man who has done this a thousand times, and your Nubbin runs like his shadow.'),
            N('On the last roof he turns. The mask is down. The face is older and harder, and it is a face you last saw on a burning plane.'),
            S('Bucky?', 'shock'),
            WS('I don’t know that name.', 'angry'),
            N('Your Run Nubbin stops a pace from him, the exact distance it kept on the night raids, and waits.'),
            WS('Get your animal out of my way.'),
            N('He doesn’t kick it. He could. He steps around it, very carefully, and drops off the roof into the dark.'),
          ],
          choices: [
            {
              id: 'tell',
              label: 'Tell Steve what happened on the plane.',
              set: { 'mv-ca-winter-plane': 'told' },
              then: [
                N('You tell him about the wires and the torch, and the last thing Bucky said before the light.'),
                S('He got the others off. He got everybody off but himself. Of course he did.', 'sad'),
              ],
            },
            {
              id: 'chase',
              label: 'Don’t talk. Get after him.',
              set: { 'mv-ca-winter-plane': 'chased' },
              then: [
                S('Right. Talk later. Move now.'),
                N('The alley is empty when you reach it. On the gutter, a torn scrap of a red star.'),
              ],
            },
          ],
        },
        done: {
          id: 'mv-ca09-roofs-done',
          lines: [
            S('That was him, Sharon. Whatever they did to him, that was Bucky.', 'sad'),
            SC('Then he’s the most dangerous man alive, and he doesn’t know you. Let’s find out what they did.'),
          ],
        },
      },
      {
        id: 'mv-ca09-s3',
        goal: 'Get the new Cube out of Lukin’s vault and into Steve’s hands.',
        hint: 'An Expedition into the Kronas vault. Your Power Nubbin pulls the Cube loose; your Run Nubbin carries it.',
        check: 'expedition:complete:mv-kronas-vault',
        scene: {
          id: 'mv-ca09-vault',
          lines: [
            N('Deep under the Kronas building, the new Cosmic Cube hums in a cradle of cables: smaller than the first one, and brighter.'),
            LK('General Lukin. I have a soldier who never says no, and a cube that says yes to anything. You see my position.'),
            N('The Winter Soldier stands at Lukin’s shoulder. His eyes are on your Run Nubbin. They have been since you walked in.'),
            LK('Kill the Captain. Leave the animals; I may want them.'),
            N('The fight is fast and terrible. Bucky knows every move Steve has, because Bucky helped invent half of them.'),
            N('Your Nubbins go for the cradle. One wrenches the Cube loose; the other rolls it across the floor to Steve.'),
            S('I don’t want the universe. I want one thing.', 'soft'),
            N('He holds the Cube up in front of Bucky’s face. It goes warm and gold.'),
            LK('Fool! With that you could end every war on Earth, and you spend it on one soldier?', 'shock'),
            S('Every war starts with somebody deciding one soldier doesn’t matter.'),
            S('Give him back everything they took. All of it. The good and the bad.'),
            N('Bucky staggers. You watch fifty years arrive on his face at once.'),
          ],
          choices: [
            {
              id: 'stay',
              label: 'Keep your Run Nubbin at his side.',
              set: { 'mv-ca-bucky-return': 'stayed' },
              then: [
                N('Your Run Nubbin presses against his boot. He looks down at it and says the silly name he gave it at Camp Lehigh.'),
                B('You’re still fast. Course you are.', 'sad'),
              ],
            },
            {
              id: 'space',
              label: 'Pull your Nubbins back. Give him room.',
              set: { 'mv-ca-bucky-return': 'space' },
              then: [
                N('You call your Nubbins back. Bucky stands alone in the middle of the vault and shakes, and nobody touches him.'),
                B('Don’t. Not yet. I need to work out which of these hands are mine.', 'sad'),
              ],
            },
          ],
        },
        done: {
          id: 'mv-ca09-vault-done',
          lines: [
            B('Steve. The things I did, Steve.', 'sad'),
            N('He takes the Cube from Steve’s hands and says one word to it. It bursts in a shower of gold.'),
            N('When the light clears, Bucky is gone.'),
          ],
        },
      },
    ],
    complete: {
      id: 'mv-ca09-complete',
      lines: [
        N('Lukin is under arrest. The Cube is dust, or most of it. S.H.I.E.L.D. sweeps the fragments into a sealed box and won’t say why.'),
        SC('He’ll come back when he can look at you. Give him that.', 'soft'),
        S('Sixty years I thought I left him on that plane. He’s alive. Whatever he’s done, he’s alive.', 'sad'),
        N('Your Run Nubbin sits at the rift a long time before it will come home. It keeps looking back into the dark.'),
        Y('He knows where to find us.'),
      ],
    },
    rewards: [
      { id: 'mv-ca09-flag', kind: 'flag', label: 'The Winter Soldier Remembers', description: 'Bucky is alive and himself again. Required for the Civil War endgame (E1).' },
      { id: 'mv-ca09-coat', kind: 'cosmetic', label: 'Winter Coat', description: 'A long dark coat cut down for a Nubbin. Your Run Nubbin wears it as if it were made to.' },
    ],
    sets: { 'mv-ca09': true, 'mv-ca-winter': 'remembered' },
    notes:
      'Required for Civil War (E1). Prefer the Run Nubbin stored in `mv-ca-bucky-nubbin` from CA2; if it is not in the party, any Run Nubbin works and the step 3 “silly name” line becomes “calls it kid, like he used to call everybody”. The first choice in step 2 reads best after CA3’s `mv-ca-plane` = `with-bucky`; if it was `with-steve`, change “the last thing Bucky said before the light” to “how he was still holding the wires when the plane climbed”. The Skull’s death and the station bomb are off screen (sound and smoke only). The shattered Cube’s fragments are the seed of Kobik in CA10; show the sealed S.H.I.E.L.D. box clearly. Issues checked: Captain America vol. 5 #1–14 (2005–06); Steve uses the Cube on Bucky in #14.',
  },

  // ------------------------------------------------------------------ CA10
  {
    id: 'mv-ca10',
    code: 'CA10',
    title: 'Hail Hydra',
    source: 'Steve Rogers: Captain America #1–19 (2016–2017) and Secret Empire #0–10 (2017)',
    audience: 'adult',
    trigger: { where: GATE, when: 'After CA9, The Winter Soldier, with CA4 complete' },
    requires: ['CA9', 'CA4'],
    speakers: [STEVE, HYDRA_STEVE, KOBIK, SKULL, SAM, SHARON],
    steps: [
      {
        id: 'mv-ca10-s1',
        goal: 'Visit Kobik in Pleasant Hill.',
        hint: 'Bring your Rebirth Nubbin from CA1. Kobik likes it best.',
        check: 'talk:kobik',
        scene: {
          id: 'mv-ca10-kobik',
          lines: [
            N('Pleasant Hill: a neat little town with neat little lawns, built by S.H.I.E.L.D. on the Cube’s leftover fragments.'),
            N('The fragments woke up. They became a girl who calls herself Kobik. She looks about four, and she can rewrite the world.'),
            KO('Oh! Little animals! Can they be purple? I can make them purple. I can make them anything.', 'happy'),
            N('Your Nubbins let her pat them. They aren’t afraid of her. That is the frightening part.'),
            KO('The man with the red face is my friend. He tells me stories. Hydra is a big nice family and everybody gets a job.', 'happy'),
            N('In a corner of the playroom, a clone of the Red Skull looks up from a picture book and smiles.'),
            SK('She is very impressionable. All children are. That is what childhood is for.', 'happy'),
            N('Steve had grown old when the serum finally let go of him. Last month Kobik made him young again, as a present.'),
            KO('And I fixed Steve’s whole life too! Now he was always on the right side.', 'happy'),
            N('Your Rebirth Nubbin goes very still, the way it went still under Erskine’s hand.'),
          ],
          choices: [
            {
              id: 'warn',
              label: 'Tell Kobik the red man is lying to her.',
              set: { 'mv-ca-kobik': 'warned' },
              then: [
                KO('He isn’t! He’s my friend! …Is he?', 'sad'),
                N('She doesn’t undo anything. But she remembers that you said it, and the Skull notices that she does.'),
              ],
            },
            {
              id: 'play',
              label: 'Sit and play with her. Let her trust you first.',
              set: { 'mv-ca-kobik': 'befriended' },
              then: [
                N('You sit on the floor and draw a Nubbin. She draws one beside it: purple, with stars.'),
                KO('That one’s yours. I’ll keep it. I keep things.', 'happy'),
              ],
            },
          ],
        },
      },
      {
        id: 'mv-ca10-s2',
        goal: 'Run supplies for the resistance under Hydra’s patrols.',
        hint: 'A stealth Expedition. Small Nubbins pass patrols unnoticed, so leave the big ones at camp.',
        check: 'expedition:complete:mv-resistance-run',
        scene: {
          id: 'mv-ca10-empire',
          lines: [
            N('It happens in a single day. Hydra rises everywhere at once, and the man leading it is Steve Rogers.'),
            HS('You trusted me with the shield for seventy years. Trust me with the rest. I’ll make it safe.', 'soft'),
            N('Cities sit under glowing domes. Heroes are trapped in space or underground. The shield is carried under a green flag now.'),
            SW('Sam Wilson. I carried the shield for a while. Now I carry a radio, a bag of tinned peaches and a grudge.', 'angry'),
            SC('He isn’t mind-controlled. We checked. He remembers growing up Hydra. Every birthday, every lie. To him it’s all true.', 'sad'),
            SW('So we fight a man who believes it. That’s worse.'),
            SC('Half the country’s cheering him. Trains on time, streets swept. People like being told it’s safe.', 'think'),
            SW('Safe and free were never the same word. He used to be the one who told me that.', 'sad'),
            N('Your Nubbins guard the resistance camp at night. Hydra patrols never look twice at small creatures. That is useful.'),
            N('Supreme Leader Rogers comes to a captured town to speak. Your Rebirth Nubbin slips through the crowd to the foot of the stage.'),
            HS('Hello, little one. Have we met? I feel as though we have.', 'think'),
            N('Your Nubbin looks up at him for a long time. Then it turns its back and walks away.'),
          ],
        },
        done: {
          id: 'mv-ca10-empire-done',
          lines: [
            SC('Kobik’s gone quiet. She’s hiding. She’s scared of what she did.', 'sad'),
            SW('Then we find her before the Skull does.'),
          ],
        },
      },
      {
        id: 'mv-ca10-s3',
        goal: 'Bring the real Steve out of the Cube’s memory and stand with him against his double.',
        hint: 'A karate bout against the Supreme Leader. He knows every one of Steve’s moves, so let your Nubbins do what Steve never would.',
        check: 'karate:win:mv-supreme-leader',
        scene: {
          id: 'mv-ca10-memory',
          lines: [
            N('Kobik is hiding inside the Cube’s memory, a place made of everything she has ever touched. Your Nubbins find the way in holding paws.'),
            KO('I’m sorry. I’m sorry. I wanted him to be happy. I kept the old Steve. I didn’t throw him away.', 'sad'),
            N('In the memory, a skinny young man sits on the steps of a recruiting office, a stamped card folded in his hands.'),
            N('Your Rebirth Nubbin runs to him. He knows it at once.'),
            S('Hey. I know you. You came last on the obstacle course.', 'happy'),
            S('I’ve been sitting here a while. Everything’s fuzzy at the edges. I knew somebody would come.'),
            KO('If he goes out, the other Steve doesn’t go away. There’ll be two. One has to beat the other.', 'think'),
            S('Then let’s go do that.'),
            N('Outside, in Washington, the Supreme Leader stands before Hydra’s army. Then a second Steve Rogers walks out of the light.'),
            HS('That’s impossible. I’m the real one. I remember.', 'angry'),
            S('You remember what she was told. I remember what happened.'),
          ],
          choices: [
            {
              id: 'rebirth-nubbin',
              label: 'Send your Rebirth Nubbin in with him.',
              set: { 'mv-ca-hydra-end': 'rebirth-nubbin' },
              then: [
                N('Your Nubbin walks at his heel, exactly where it walked on the camp course.'),
                S('Same as before. Last over the line, together.', 'soft'),
              ],
            },
            {
              id: 'crowd',
              label: 'Turn to the crowd. Remind them who he was.',
              set: { 'mv-ca-hydra-end': 'crowd' },
              then: [
                N('You climb onto a car roof and shout. Not a speech, just names. Erskine. Bucky. Sam. People begin to listen.'),
                SW('Okay. Okay! The Keeper’s got the crowd. Cap, you’ve got the rest.'),
              ],
            },
          ],
        },
        done: {
          id: 'mv-ca10-memory-done',
          lines: [
            N('Mid-fight, Steve reaches for a hammer lying in the rubble, an old friend’s hammer. It lifts for him as easily as a cup.'),
            N('One blow. The Supreme Leader goes down, and the domes over the cities flicker and go out.'),
            HS('I was loyal. I was loyal.', 'sad'),
            S('You were. To the wrong thing. That was never your fault.', 'soft'),
          ],
        },
      },
    ],
    complete: {
      id: 'mv-ca10-complete',
      lines: [
        N('The country takes a long time to clean up. Plenty of people will never trust the shield again, and they have their reasons.'),
        S('They shouldn’t trust it. They should trust each other, and keep an eye on me. That’s healthier.', 'think'),
        N('Kobik is in S.H.I.E.L.D.’s care now, with a great many crayons and a strict rule about stories from strangers.'),
        KO('Can I come and see the little animals? I won’t make them purple. Maybe a tiny bit purple.', 'happy'),
        S('Erskine picked the weakest kid in the line. You picked the weakest one in your Grove. You were both right.', 'soft'),
        KO('I could fix it all, you know. Make it so it never happened. Nobody would remember the domes. Nobody would be sad.', 'think'),
        S('Kid, that’s how this started. Somebody deciding they knew better what everybody should remember.', 'soft'),
        KO('But people got hurt. Lots. I could make them not hurt.', 'sad'),
        N('She looks at you, and so does Steve. Neither of them is sure.'),
      ],
      choices: [
        {
          id: 'keep',
          label: 'Leave it, Kobik. People need to remember what they lived through.',
          set: { 'mv-ca10-rewrite': 'refused' },
          then: [
            KO('Even the sad bits?', 'sad'),
            S('Especially those. That’s how you know not to do it again.'),
            N('At the rift, Steve salutes your Rebirth Nubbin. It doesn’t know how to salute, so it falls over, and that does fine.'),
          ],
        },
        {
          id: 'small',
          label: 'Not the world. But could you mend the people who were hurt, and leave their memories alone?',
          set: { 'mv-ca10-rewrite': 'healed' },
          then: [
            KO('Mend, not change. Bodies, not stories. I can try that. I’ll go very slowly.', 'think'),
            S('That’s… actually wise. Nobody tell her I said so. She’ll want a medal.', 'happy'),
            N('At the rift, Steve salutes your Rebirth Nubbin. It doesn’t know how to salute, so it falls over, and that does fine.'),
          ],
        },
      ],
    },
    rewards: [
      { id: 'mv-ca10-title', kind: 'title', label: 'Sentinel of the Grove', description: 'Title for your Rebirth Nubbin, marking the end of the Captain America line.' },
      { id: 'mv-ca10-shield', kind: 'decor', label: 'Replica Shield', description: 'A round striped shield for the Grove wall. Nubbins take it down and use it as a sledge.' },
      { id: 'mv-ca10-line', kind: 'flag', label: 'Captain America Line Complete', description: 'Completes the Captain America line (CA1–CA10). With the Iron Man line also done, Civil War (E1) opens.' },
    ],
    sets: { 'mv-ca10': true, 'mv-ca-complete': true },
    notes:
      'Completes the line. The Rebirth Nubbin is the one stored in `mv-ca-rebirth-nubbin` (CA1); if it has left the Grove, any all-E-grade Nubbin stands in and the “obstacle course” line becomes “You look like a friend of mine. Came last on the obstacle course.”. Hydra’s symbol and salute are never shown in full: green banners, no salute animation, and the title is the only place the phrase appears. Two Steves on screen: the Supreme Leader has a darker palette and a high collar. The hammer is Mjolnir (Secret Empire #10); show it lifting, no name needed. The closing choice sets mv-ca10-rewrite (refused / healed): Kobik never rewrites history either way; "healed" only mends injuries. Kobik’s scenes are bright and toy-like; the Skull clone sits in the background, never close-up. Issues checked: Steve Rogers: Captain America #1–19 (2016–17), Secret Empire #0–10 (2017). This storyline and IM15 are the last prerequisites for Civil War, whose epilogue returns Steve through this Cube thread.',
  },
];

// ------------------------------------------------------------------ payoff variants

/** Every scene of a quest list, flat. */
const scenesOf = (quests: Quest[]): Scene[] =>
  quests.flatMap((q) => [...q.steps.flatMap((s) => [s.scene, ...(s.done ? [s.done] : [])]), q.complete]);

/**
 * A payoff variant: the base scene with `count` lines from index `at` replaced by `extra`.
 * Choices and `set` carry over unchanged. The runner (sim/atlas.ts, variantFor) plays it in
 * place of the base scene when this line's flags hold the value named by `suffix`, so each
 * suffix must be a value only the signature flag ever takes.
 */
function payoff(quests: Quest[], baseId: string, suffix: string, at: number, count: number, extra: Line[]): Scene {
  const base = scenesOf(quests).find((s) => s.id === baseId);
  if (!base) throw new Error(`payoff: no scene ${baseId}`);
  const lines = [...base.lines];
  lines.splice(at, count, ...extra);
  return { ...base, id: `${baseId}-${suffix}`, lines };
}

/** The CA2 gantry choice (mv-ca02-saboteur) paid off in CA5, CA7 and CA10. */
export const MV_CAP_VARIANTS: Scene[] = [
  // CA5: the smear. Arrested: the boy from the gantry is now a witness against Steve.
  // Released: he comes back with names, and the money trail is half walked already.
  payoff(MV_CAP, 'mv-ca05-smear', 'arrested', 5, 0, [
    SW('One of the witnesses did ten years for sabotage. Says you put him in a cell in ’43, and he’s waited a long time to return the favour.'),
    S('The boy from the gantry. He got his fair hearing. It still came to this.', 'sad'),
  ]),
  payoff(MV_CAP, 'mv-ca05-smear', 'released', 5, 0, [
    SW('Something else. A man came to the office at six this morning. Older, nervous. Said he owed you one from a gantry in ’43, and left names.'),
    S('He ran and never looked back. Seems he looked back once.', 'soft'),
    SW('His names match the committee’s donors. You just saved us a week.'),
  ]),
  // CA7: what Steve offers Walker, before Walker decides about the shield.
  payoff(MV_CAP, 'mv-ca07-shield', 'arrested', 8, 0, [
    S('John. In the war I sent a boy to a cell because the rules said so. I never saw what became of him. I’m not sending you anywhere.', 'soft'),
    JW('That supposed to make me feel better?'),
    S('No. It’s supposed to be true.'),
  ]),
  payoff(MV_CAP, 'mv-ca07-shield', 'released', 8, 0, [
    S('John. In the war I let a saboteur go on his word, and he kept it. I’ll take yours.', 'soft'),
    JW('You don’t know what my word’s worth.', 'sad'),
    S('Neither did he.'),
  ]),
  // CA10: what the real Steve remembers that the rewritten one was never told.
  payoff(MV_CAP, 'mv-ca10-memory', 'arrested', 11, 0, [
    S('I remember a boy on a gantry crying into his collar, and the hearing he got because we said we were better. You’d have shot him.'),
    HS('I would have been efficient.', 'angry'),
    S('That’s the word they always use.'),
  ]),
  payoff(MV_CAP, 'mv-ca10-memory', 'released', 11, 0, [
    S('I remember letting a saboteur run because he’d talked, and carrying it ever since. You never carried anything. That’s how I know.'),
    HS('Weakness. I was built without it.', 'angry'),
    S('You were built without the part that made me worth copying.'),
  ]),
];

// ------------------------------------------------------------------ checks

export const CHECKS: string[] = [
  'party:nubbin:all-e-grade',
  'race:finish:mv-boot-camp',
  'karate:win:mv-rebirth-spy',
  'talk:bucky-barnes',
  'karate:win:mv-skull-saboteurs',
  'expedition:complete:mv-drone-plane',
  'expedition:complete:mv-arctic-dive:swim',
  'expedition:complete:mv-skull-island',
  'karate:win:mv-red-skull',
  'expedition:complete:mv-committee-trail',
  'talk:steve-rogers:after-number-one',
  'expedition:complete:mv-madbomb-test:fly',
  'race:win:mv-madbomb-train',
  'talk:douglas-rockwell',
  'expedition:complete:mv-commission-corridors',
  'karate:win:mv-skull-in-steves-body',
  'expedition:complete:mv-waterfront-raid',
  'karate:win:mv-bullseye',
  'talk:sharon-carter',
  'race:win:mv-rooftops:run',
  'expedition:complete:mv-kronas-vault',
  'talk:kobik',
  'expedition:complete:mv-resistance-run',
  'karate:win:mv-supreme-leader',
];
