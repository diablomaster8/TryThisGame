/**
 * Multiverse campaign, Toy Story line: TS1–TS12 (Woody and Buzz, Andy’s room to the
 * antique store). Feeds So Long, Partner (E5), which needs every storyline here.
 *
 * On this side of the rift the Keeper and the party Nubbins are toys: stitched, jointed,
 * the height of a pencil. The one rule every toy keeps applies to you too: humans must
 * never see a toy move. Stealth checks fail if a human sees you move.
 *
 * The plush Nubbin. If the player owns the plush Nubbin from fun quest Q12 (Just
 * Resting) and did not take the refund (`q12-refund`), it lives in Andy’s toy box and
 * follows the toys from house to house. It never moved in the Grove; here it does.
 * Plush rule: when the player does NOT own it, skip every line spoken by `ts-plush` and
 * every line whose text contains the word “plush”. Every scene here is written to read
 * cleanly with those lines removed, and no choice depends on the plush. TS11 leaves it
 * in Bonnie’s room, which is where E5 finds it for the `plush` choice.
 *
 * Tone: Pixar’s. Funny and warm, and played completely straight at the incinerator
 * (TS10) and Andy’s goodbye (TS11). Audience 'adult' (campaign rating), so no childLines.
 * Every line of dialogue is original: no film lines, no catchphrases, no song lyrics.
 *
 * Flags are prefixed `mv-ts`. Each storyline sets `mv-ts01`…`mv-ts12` on completion;
 * `mv-ts-complete` marks the whole line and opens E5 (with `mv-ts01`…`mv-ts12`).
 */
import type { Quest, Speaker } from './types';
import type { Line, Mood, Scene } from '../config/story';

const say =
  (who: string) =>
  (text: string, mood?: Mood): Line =>
    mood ? { who, text, mood } : { who, text };

const N = say('narrator');
const Y = say('you');

const sp = (id: string, name: string, basedOn: string, kind: Speaker['kind'] = 'other'): Speaker => ({
  id,
  name,
  kind,
  basedOn,
});

// ---------------------------------------------------------------- speakers
const WOODY = sp('ts-woody', 'Woody', 'Sheriff Woody (Pixar, Toy Story 1–4)');
const BUZZ = sp('ts-buzz', 'Buzz Lightyear', 'Buzz Lightyear (Pixar, Toy Story 1–4)');
const HAMM = sp('ts-hamm', 'Hamm', 'Hamm the piggy bank (Pixar, Toy Story)');
const REX = sp('ts-rex', 'Rex', 'Rex the dinosaur (Pixar, Toy Story)');
const SLINKY = sp('ts-slinky', 'Slinky', 'Slinky Dog (Pixar, Toy Story)');
const POTATO = sp('ts-potato', 'Mr. Potato Head', 'Mr. Potato Head (Pixar, Toy Story)');
const MRSP = sp('ts-mrs-potato', 'Mrs. Potato Head', 'Mrs. Potato Head (Pixar, Toy Story 2–3)');
const BO = sp('ts-bo', 'Bo Peep', 'Bo Peep (Pixar, Toy Story 1, 2 and 4)');
const SARGE = sp('ts-sarge', 'Sarge', 'Sarge of the green army men (Pixar, Toy Story)');
const ALIENS = sp('ts-aliens', 'The Aliens', 'The three-eyed claw-machine aliens (Pixar, Toy Story)');
const ANDY = sp('ts-andy', 'Andy', 'Andy Davis (Pixar, Toy Story 1–3)');
const MUM = sp('ts-andys-mum', 'Andy’s Mum', 'Andy’s mother (Pixar, Toy Story 1–3)');
const SID = sp('ts-sid', 'Sid', 'Sid Phillips (Pixar, Toy Story)');
const WHEEZY = sp('ts-wheezy', 'Wheezy', 'Wheezy the penguin (Pixar, Toy Story 2)');
const AL = sp('ts-al', 'Al', 'Al McWhiggin of Al’s Toy Barn (Pixar, Toy Story 2)');
const UBUZZ = sp('ts-utility-buzz', 'Utility Belt Buzz', 'The newer Buzz Lightyear with a utility belt (Pixar, Toy Story 2)');
const BARBIE = sp('ts-barbie', 'Barbie', 'Barbie (Mattel; as in Pixar, Toy Story 2–3)');
const JESSIE = sp('ts-jessie', 'Jessie', 'Jessie the Yodelling Cowgirl (Pixar, Toy Story 2–4)');
const PETE = sp('ts-prospector', 'Stinky Pete', 'Stinky Pete the Prospector (Pixar, Toy Story 2)');
const LOTSO = sp('ts-lotso', 'Lotso', 'Lots-o’-Huggin’ Bear (Pixar, Toy Story 3)');
const KEN = sp('ts-ken', 'Ken', 'Ken (Mattel; as in Pixar, Toy Story 3)');
const CHATTER = sp('ts-chatter', 'Chatter Telephone', 'Chatter Telephone (Pixar, Toy Story 3)');
const BONNIE = sp('ts-bonnie', 'Bonnie', 'Bonnie Anderson (Pixar, Toy Story 3–4)');
const DOLLY = sp('ts-dolly', 'Dolly', 'Dolly, the rag doll in Bonnie’s room (Pixar, Toy Story 3–4)');
const FORKY = sp('ts-forky', 'Forky', 'Forky (Pixar, Toy Story 4)');
const GABBY = sp('ts-gabby', 'Gabby Gabby', 'Gabby Gabby (Pixar, Toy Story 4)');
const GIGGLE = sp('ts-giggle', 'Giggle McDimples', 'Giggle McDimples (Pixar, Toy Story 4)');
const PLUSH = sp('ts-plush', 'Plush Nubbin', 'The plush Nubbin from fun quest Q12, Just Resting (original)', 'nubbin');

const W = say('ts-woody');
const B = say('ts-buzz');
const HA = say('ts-hamm');
const RX = say('ts-rex');
const SL = say('ts-slinky');
const PH = say('ts-potato');
const MP = say('ts-mrs-potato');
const BP = say('ts-bo');
const SG = say('ts-sarge');
const AX = say('ts-aliens');
const AN = say('ts-andy');
const MU = say('ts-andys-mum');
const SI = say('ts-sid');
const WZ = say('ts-wheezy');
const AL_ = say('ts-al');
const UB = say('ts-utility-buzz');
const BA = say('ts-barbie');
const JE = say('ts-jessie');
const PE = say('ts-prospector');
const LO = say('ts-lotso');
const KE = say('ts-ken');
const CH = say('ts-chatter');
const BN = say('ts-bonnie');
const DO = say('ts-dolly');
const FO = say('ts-forky');
const GA = say('ts-gabby');
const GI = say('ts-giggle');
const PL = say('ts-plush');

const GATE = 'The rift above the waterfall (Multiverse save slot)';

export const MV_TOYSTORY: Quest[] = [
  // ------------------------------------------------------------------ TS1
  {
    id: 'mv-ts01',
    code: 'TS1',
    title: 'The New Toy',
    source: 'Toy Story (Pixar, 1995): Andy’s birthday',
    audience: 'adult',
    trigger: { where: GATE, when: 'Any time once the Multiverse rift is open; first storyline of the Toy Story line' },
    speakers: [WOODY, BUZZ, REX, HAMM, SARGE, BO, PLUSH],
    steps: [
      {
        id: 'mv-ts01-s1',
        goal: 'Get the army men downstairs and report Andy’s birthday presents over the baby monitor.',
        hint: 'A stealth expedition. Freeze whenever a grown-up looks your way: humans must never see a toy move.',
        check: 'expedition:complete:mv-ts-birthday-recon:stealth',
        scene: {
          id: 'mv-ts01-meeting',
          lines: [
            N('The rift drops you onto a bedspread printed with cowboys. Everything is enormous, and you are about the height of a pencil.'),
            N('Your joints click, there’s a seam down your side, and a little painted lantern is moulded into your hand. You have turned into a toy.'),
            N('Your Nubbins are toys too: soft, stitched, with fabric tags on their bottoms. They seem delighted about it.'),
            W('Whoa, hold it. New faces. Nobody panic. Name’s Woody. I run things up here, more or less.', 'happy'),
            W('You came out of that shimmery thing by the window, so you’re either a birthday present or a fire hazard.', 'think'),
            N('The toy box lid lifts. Your plush Nubbin, the one from the shop that never once moved, climbs out and stretches.'),
            PL('Oh. Hello. Please don’t tell the shopkeeper.', 'happy'),
            W('That plush has been in the box a month and never said boo. Figured it was shy.'),
            W('Okay, staff meeting. Andy’s birthday party got moved up to today, because the family moves house next week.'),
            RX('Today? Nobody warned me! What if he gets a dinosaur? A bigger, meaner dinosaur?', 'shock'),
            HA('Then you’ll finally have someone to look up to, Rex.'),
            W('Sarge, take your men down. Baby monitor on channel one. I want every present reported before it’s unwrapped.'),
          ],
          choices: [
            {
              id: 'with-sarge',
              label: 'Send your Nubbins down with the army men.',
              set: { 'mv-ts-recon': 'nubbins' },
              then: [
                SG('Fuzzy recruits. They’ll do. A soft landing is a tactical asset.'),
                N('Your Nubbins fall in at the back of the platoon, marching on feet that don’t really bend.'),
              ],
            },
            {
              id: 'monitor',
              label: 'Stay up here and hold the monitor with Woody.',
              set: { 'mv-ts-recon': 'monitor' },
              then: [
                W('Good. Keep it steady. Rex shakes it when he gets nervous, and Rex is always nervous.'),
                RX('That was one time! Several times. A normal number of times.', 'sad'),
              ],
            },
          ],
        },
        done: {
          id: 'mv-ts01-meeting-done',
          lines: [
            SG('Final package. Large. Shape unknown. The birthday boy is screaming. Repeat, screaming.'),
            N('The monitor cuts out. Feet thunder on the stairs, and every toy on the bed drops where it stands.'),
            N('Something new lands on the bedspread. Andy runs back out for cake, and the room holds its breath.'),
          ],
        },
      },
      {
        id: 'mv-ts01-s2',
        goal: 'Help Buzz “fly” around Andy’s room without anyone seeing how.',
        hint: 'A short race course: ball, car ramp, ceiling plane. Your Nubbins nudge each bounce so Buzz lands back on the bed.',
        check: 'race:finish:mv-ts-bedroom-flight',
        scene: {
          id: 'mv-ts01-ranger',
          lines: [
            N('The new toy sits up in the spot where Woody always sits. White armour, purple trim, a dome helmet, and a jaw like a shelf bracket.'),
            B('Status report. Hull intact. Wings intact. Local life forms primitive, but curious.', 'think'),
            B('Lightyear. Buzz Lightyear. Space Ranger, Kellen Belt patrol. My ship came down hard. I’ll need a moment.'),
            W('Your ship is a cardboard box. You came down from the kitchen table.', 'angry'),
            N('Buzz presses a button on his wrist, and it beeps and glows red. Rex gasps loud enough to rattle the shelf.'),
            B('Careful, cowboy. This arm is rated for asteroid work.'),
            W('That is a red bead with a battery behind it. I’ve seen scarier fridge magnets.', 'angry'),
            BP('He’s got wings, Woody. Can you blame a girl for asking where they go?', 'happy'),
            B('Ma’am, they go up. Stand back, everyone. I’ll show you.'),
            N('He climbs the bedpost. Your Nubbins look at each other, then at the bouncy ball, the toy car and the plane hanging from the ceiling.'),
          ],
          choices: [
            {
              id: 'tell',
              label: 'Tell Buzz the truth before he jumps: he’s a toy, like you.',
              set: { 'mv-ts-ranger': 'told' },
              then: [
                Y('Buzz. You were in a box this morning. So was I, more or less.'),
                B('Classic space dementia. The rookie’s been in hypersleep too long. Someone get them a blanket.', 'think'),
                W('Thank you! Finally! Somebody in this room with eyes!', 'happy'),
              ],
            },
            {
              id: 'let',
              label: 'Say nothing. Let him have his moment, and help him land it.',
              set: { 'mv-ts-ranger': 'let' },
              then: [
                N('You nod to your Nubbins, and they quietly take up positions by the ball, the ramp and the plane string.'),
                W('You’re helping him? You’re helping the cardboard astronaut?', 'angry'),
              ],
            },
          ],
        },
        done: {
          id: 'mv-ts01-ranger-done',
          lines: [
            N('Ball, ramp, plane, one long loop, and Buzz lands back on the bed on one knee. Nobody looks at your Nubbins, who did all of it.'),
            HA('Well, I’ll be. Somebody give that man a pension.'),
            W('He bounced. He bounced off a ball and got lucky three times in a row. That’s not a skill.', 'angry'),
            N('Bo hooks her crook round Buzz’s arm to congratulate him. Woody watches the crook for a long time.'),
          ],
        },
      },
    ],
    complete: {
      id: 'mv-ts01-complete',
      lines: [
        N('Days go by, and the cowboy curtains come down. Rockets go up on the walls, and Andy runs round the house making engine noises.'),
        N('One night Andy lifts Woody off the bed and drops him into the toy box. Buzz stays on the pillow.'),
        N('Your plush Nubbin is at the bottom of the box, between a puzzle piece and a sock. It moves over to make room.'),
        W('So. This is down here.', 'sad'),
        PL('It’s not so bad. It’s quiet. A man in a shop spent a whole year telling people I was resting.'),
        W('It doesn’t matter. I’m his favourite. This is a phase. Phases end.', 'think'),
        N('Woody says it three more times before he falls asleep. Your plush Nubbin pats his hat each time.'),
        N('In the morning Woody hands you a tin star from his drawer of spare parts. He says it’s for the recon, and won’t say more.'),
      ],
    },
    rewards: [
      { id: 'mv-ts01-star', kind: 'cosmetic', label: 'Tin Sheriff Star', description: 'A small tin star badge that pins onto any Nubbin. Woody had a spare. He insists it is not a consolation prize.' },
      { id: 'mv-ts01-mobile', kind: 'decor', label: 'Ceiling Plane Mobile', description: 'The toy plane Buzz looped around, for the Grove nursery. Nubbins swing on it.' },
    ],
    sets: { 'mv-ts01': true },
    notes:
      'Opens the Toy Story line; needs only the Multiverse rift. Art: on this side of the gate the Keeper is a jointed toy figure holding a painted lantern, and party Nubbins get a plush texture with a fabric tag. Toy scale throughout (a bed is a mountain). Freeze rule: in stealth checks a human seeing a toy move fails the attempt; whenever a human enters a scene, every toy (Keeper included) drops limp mid-pose. Plush rule (see file header; line numbers 0-based): mv-ts01-meeting lines 5–7 and mv-ts01-complete lines 2, 4 and 6 drop when the player has no Q12 plush. Recon: Andy’s living room party, baby monitor static as UI. Bedroom flight course is a race-track reskin with three bounce gates. `mv-ts-ranger` (told/let, added in review) records whether the Keeper told Buzz the truth on day one; it only changes the then-lines, but TS3 lands harder if he was told and laughed it off. Bo hooking Buzz’s arm with her crook is the first sting of Woody’s jealousy; keep it a glance, not a scene. ' +
      'SIGNATURE CHOICE: mv-ts-recon (nubbins | monitor: whether the Nubbins marched with Sarge or you kept the baby monitor) pays off through MV_TOYSTORY_VARIANTS at mv-ts04-crate (how the Nubbins step up for the rule-break), mv-ts08-truck (how they work the horn in the chase) and mv-ts09-plan (which job Woody gives you in the break-out).',
  },

  // ------------------------------------------------------------------ TS2
  {
    id: 'mv-ts02',
    code: 'TS2',
    title: 'Pizza Planet',
    source: 'Toy Story (Pixar, 1995): the window, the gas station and Pizza Planet',
    audience: 'adult',
    trigger: { where: GATE, when: 'After TS1, The New Toy' },
    requires: ['TS1'],
    speakers: [WOODY, BUZZ, SLINKY, POTATO, REX, HAMM, ALIENS, SID],
    steps: [
      {
        id: 'mv-ts02-s1',
        goal: 'Slip into Andy’s backpack with Woody before the car leaves for Pizza Planet.',
        hint: 'Cross the landing while Andy hunts for his shoes. Freeze whenever anyone turns round.',
        check: 'expedition:complete:mv-ts-backpack-dash:stealth',
        scene: {
          id: 'mv-ts02-window',
          lines: [
            N('Andy’s mum calls up the stairs: dinner at Pizza Planet, and he can bring one toy. Just one.'),
            W('One toy. It’s me or the spaceman, and he’s standing right by the desk.', 'think'),
            W('If he just happened to fall down behind it, nobody would find him for a day or two. Nobody gets hurt.'),
            N('He winds up RC, the remote-control car, and aims it at the desk. Your Nubbins look at the angle and wince.'),
            N('RC bumps the bin, the bin swings the lamp, the lamp catches Buzz, and Buzz sails straight out of the open window.'),
            N('There is a very long silence.'),
            SL('Woody. Woody, what did you do?', 'shock'),
            PH('He couldn’t stand the competition, so he shoved him out. Textbook.', 'angry'),
            RX('In the bedroom! In front of everybody! I’ll never unsee it!', 'shock'),
            W('It was an accident! Tell ’em. You saw it. Tell ’em it was an accident!', 'shock'),
          ],
          choices: [
            {
              id: 'truth',
              label: 'Tell them what you saw: it was an accident.',
              set: { 'mv-ts-window': 'accident' },
              then: [
                SL('Okay. I believe the little fella. But you owe Buzz an apology the size of a house, Woody.', 'sad'),
                HA('Accident or not, he’s still out of the window.'),
              ],
            },
            {
              id: 'silent',
              label: 'Say nothing. Woody made this mess.',
              set: { 'mv-ts-window': 'silent' },
              then: [
                N('Woody looks at you as if you’ve pushed him out of a window too.'),
                PH('See? Even the new kid won’t back you up.'),
              ],
            },
          ],
        },
        done: {
          id: 'mv-ts02-window-done',
          lines: [
            N('Andy grabs Woody and runs. You and your Nubbins tumble into the side pocket of his backpack.'),
            N('Nobody sees the bush under the window shake, or the spaceman leap for the car’s back bumper.'),
          ],
        },
      },
      {
        id: 'mv-ts02-s2',
        goal: 'Catch the Pizza Planet delivery truck before it pulls out of the gas station.',
        hint: 'A sprint across the forecourt. Put your fastest Nubbin in front to grab the bumper strap.',
        check: 'race:win:mv-ts-pizza-truck',
        scene: {
          id: 'mv-ts02-gas',
          lines: [
            N('A gas station at dusk, and Andy’s mum goes in to pay. Through the backpack zip you watch a white helmet rise in the back window.'),
            B('Sheriff. You tried to terminate a fellow officer.', 'angry'),
            W('I tried to put you behind a desk! That’s not a crime, that’s furniture!'),
            N('Buzz tackles him, and they roll out of the door, under the car and across an oil stain, still swinging. Your Nubbins go after them.'),
            N('The car starts, and the car pulls away. Woody and Buzz stop fighting at exactly the same moment.'),
            W('No. No, no, no. He’s gone. Andy’s gone.', 'sad'),
            B('Don’t worry. Star Command will triangulate my position within the hour.', 'think'),
            W('There is no Star Command! There’s a pizza truck, though.', 'angry'),
            N('A delivery truck pulls in: a rocket on the roof, a planet on the side, PIZZA PLANET in green neon. It’s going exactly where Andy is.'),
            W('Truck leaves in a minute, spaceman. If you want to see your “base”, you run.'),
          ],
        },
        done: {
          id: 'mv-ts02-gas-done',
          lines: [
            N('Your fastest Nubbin reaches the truck first and hangs on to the bumper strap until everyone is aboard.'),
            B('Fine work, small one. Remind me to put in a word with your commanding officer.'),
            Y('That’s me.'),
          ],
        },
      },
      {
        id: 'mv-ts02-s3',
        goal: 'Keep hold of Buzz when the Claw lifts him out of the machine.',
        hint: 'An expedition inside the claw machine: grab Woody, grab Buzz, and don’t let the Claw split the party.',
        check: 'expedition:complete:mv-ts-claw-machine',
        scene: {
          id: 'mv-ts02-claw',
          lines: [
            N('Pizza Planet is loud, dark and blinking. Woody spots Andy’s family across the room and starts planning a route.'),
            N('Buzz spots a giant glass spaceship with a crane on top, and climbs inside before anyone can stop him.'),
            N('Inside, a crowd of little green aliens with three eyes each turn, all together, to face him.'),
            AX('A stranger. From outside the glass. Has the great hand sent him?', 'shock'),
            B('I need a ship and a pilot. Who’s in command here?'),
            AX('The hand above commands. When it descends, one of us rises into the light, and goes beyond.', 'soft'),
            W('Beyond where? Into some kid’s pocket! Buzz, get out of there!', 'angry'),
            N('A face fills the glass: skull T-shirt, braces, a grin like a broken fence. Woody goes pale under his paint.'),
            W('Sid. Sid from next door. He blows toys up. For fun.', 'shock'),
            N('Sid feeds in his coins. The Claw comes down and closes on Buzz’s helmet, and the aliens sigh like a congregation.'),
            AX('The hand has taken him. Blessed is the stranger.', 'happy'),
          ],
          choices: [
            {
              id: 'grab',
              label: 'Grab Buzz’s boots and hang on.',
              set: { 'mv-ts-claw': 'grabbed' },
              then: [
                N('You catch a boot, Woody catches you, and your Nubbins catch Woody. The Claw lifts all of you like a bunch of grapes.'),
              ],
            },
            {
              id: 'aliens',
              label: 'Ask the aliens to help pull him back.',
              set: { 'mv-ts-claw': 'asked' },
              then: [
                AX('We do not resist the hand. But we may lean.', 'think'),
                N('Forty aliens lean the same way at once. The Claw swings wide, and you all go up together.'),
              ],
            },
          ],
        },
        done: {
          id: 'mv-ts02-claw-done',
          lines: [
            N('Sid unhooks the whole bundle from the Claw and laughs at his luck.'),
            SI('A spaceman, a cowboy and a load of fluff for one go. Oh, we are going to have a good night.', 'happy'),
            N('He stuffs everything in his backpack. From somewhere inside it, a squeaky voice says that the hand is wise.'),
          ],
        },
      },
    ],
    complete: {
      id: 'mv-ts02-complete',
      lines: [
        N('The backpack bumps along Sid’s street. Through a gap in the zip you can see Andy’s house next door, with every light on.'),
        W('So close I could spit on the porch.', 'sad'),
        B('Sheriff, I think I owe you a… no. I think you owe me an apology.', 'think'),
        W('I do. I’m sorry. I am. Six years of being picked first, and I couldn’t stand one week of second.', 'sad'),
        W('That’s the whole ugly truth of it. Now help me think of a way out of here.'),
        N('Then a growl. Sid’s dog, Scud, sniffs the backpack all the way to the front door.'),
        N('In your pocket is a little alien squeeze-charm that came out of the machine with you. It squeaks reverently.'),
      ],
    },
    rewards: [
      { id: 'mv-ts02-antennae', kind: 'cosmetic', label: 'Little Green Antennae', description: 'A three-eyed alien headband for any Nubbin. It squeaks reverently when squeezed.' },
      { id: 'mv-ts02-claw', kind: 'decor', label: 'Claw Machine', description: 'A toy-sized claw machine for the Grove. Nubbins take turns being the prize.' },
    ],
    sets: { 'mv-ts02': true },
    notes:
      'Staging: Andy’s bedroom window (the RC accident plays as a fast chain reaction, slow on the final fall); gas station forecourt at dusk (race reskin, the truck pulls away on a timer); Pizza Planet interior, dark with neon. The aliens always speak together: three portraits side by side, one text. They call the claw “the hand” in dialogue; “the Claw” is fine in narration. Sid is never menacing to the player directly here, only gleeful; his menace lands in TS3. Choice flag `mv-ts-window` is cosmetic (Slinky’s attitude in TS3).',
  },

  // ------------------------------------------------------------------ TS3
  {
    id: 'mv-ts03',
    code: 'TS3',
    title: 'Sid’s House',
    source: 'Toy Story (Pixar, 1995): Sid’s room and the commercial',
    audience: 'adult',
    trigger: { where: GATE, when: 'After TS2, Pizza Planet' },
    requires: ['TS2'],
    speakers: [WOODY, BUZZ, SID],
    steps: [
      {
        id: 'mv-ts03-s1',
        goal: 'Sneak through Sid’s house to the front door while Scud sleeps.',
        hint: 'Stealth. Scud wakes at noise, so move on the rugs and freeze on the floorboards.',
        check: 'expedition:complete:mv-ts-sids-hallway:stealth',
        scene: {
          id: 'mv-ts03-sid',
          lines: [
            N('Sid’s room is dark, sticky and full of tools. The bed is unmade, and the bin is full of toy parts.'),
            N('He has a doll pinned to his desk and a pterodactyl head in his hand. He is humming, and it is not a nice tune.'),
            SI('Dr Sid will now begin the procedure. Nurse, the pliers. Thank you, nurse.', 'happy'),
            N('When he’s done, the doll has dinosaur jaws, and Sid’s little sister Hannah is screaming for her mum.'),
            N('Sid runs out to chase her. Under his bed, something clicks and starts to crawl.'),
            N('A baby doll’s head on a frame of construction-set legs, a fishing rod with doll’s legs, a duck with a wheel for a body.'),
            W('They eat toys. They must eat toys. Look at them! Stay behind me, everybody stay behind me!', 'shock'),
            B('Steady, cowboy. Let me try a universal greeting.'),
            N('Your Nubbins, who are also stitched together out of odds and ends, just walk over to them.'),
            N('The spider-baby lowers its head to your smallest Nubbin, and lets it pat the bald patch.'),
          ],
          choices: [
            {
              id: 'trust',
              label: 'Trust the strange toys. Ask them the way out.',
              set: { 'mv-ts-mutants': 'trusted' },
              then: [
                N('The fishing-rod toy points down the hall, then down the stairs, then at the dog, very firmly.'),
                W('Fine. Fine! But if they eat anybody, I called it.'),
              ],
            },
            {
              id: 'wary',
              label: 'Stick with Woody’s plan and keep clear of them.',
              set: { 'mv-ts-mutants': 'wary' },
              then: [
                N('The strange toys watch you go, and nobody follows. If anything, they look a little hurt.'),
                B('They meant no harm, Sheriff. My sensors are rarely wrong.'),
              ],
            },
          ],
        },
        done: {
          id: 'mv-ts03-sid-done',
          lines: [
            N('Halfway along the landing, Buzz hears a voice from the television downstairs. His own voice.'),
            N('He stops, and you stop with him. Woody keeps going, and doesn’t notice for a long time.'),
          ],
        },
      },
      {
        id: 'mv-ts03-s2',
        goal: 'Get to Buzz after his fall, before Hannah finds him.',
        hint: 'The stairwell is open ground. Go down the banister, not the stairs.',
        check: 'expedition:complete:mv-ts-stairwell',
        scene: {
          id: 'mv-ts03-advert',
          lines: [
            N('On the living-room television, a boy swoops a Buzz Lightyear round a shop aisle while an announcer bellows.'),
            N('Then rows of identical Buzzes on a shelf. The voice that says his words was recorded in a factory, and the wings open on a spring.'),
            N('Last comes a line of tiny print along the bottom of the screen. Your Nubbins can’t read it, but Buzz can.'),
            B('…That isn’t right. That says I can’t fly.', 'shock'),
            B('It’s a misprint. It’s propaganda. Someone at Star Command is going to hear about this.', 'angry'),
            N('He climbs the banister to the landing window. The stairwell drops away under him, two whole storeys, a long way for a toy.'),
            B('Hold on to something. This is it.', 'think'),
            N('He spreads his wings and jumps. For one heartbeat you honestly don’t know.'),
            N('Then he drops straight down the stairwell and hits the floor, and his left arm comes off and skids under a table.'),
            N('He lies there looking at the arm. He doesn’t get up.'),
          ],
        },
        done: {
          id: 'mv-ts03-advert-done',
          lines: [
            N('Hannah gets there first. When you find him, he is in a frilled bonnet at her tea table, between two headless dolls.'),
            B('Sheriff! Join us. I’m Lady Featherbottom now. I’ve had six cups. They were all empty. It was wonderful.', 'happy'),
            W('Oh, he’s gone. He’s completely gone.', 'shock'),
          ],
        },
      },
      {
        id: 'mv-ts03-s3',
        goal: 'Help the strange toys put Buzz’s arm back on.',
        hint: 'A crafting job with tape, a screw and patience. Your steadiest Nubbin holds the shoulder still.',
        check: 'craft:mv-ts-buzz-arm',
        scene: {
          id: 'mv-ts03-arm',
          lines: [
            N('Back in Sid’s room, Buzz sits on the floor with his loose arm in his good hand. The bonnet is still on.'),
            B('Years of training. A galaxy to defend. And I’m a… a stocking filler.', 'sad'),
            B('Batteries sold separately. Wings sold separately. Purpose, apparently, sold separately.'),
            W('Buzz, come on. Look at me. You’re a…', 'sad'),
            N('Woody stops. He doesn’t know how that sentence ends either.'),
            N('The strange toys come out of the shadows. They look at the arm, and at Buzz, and then at your Nubbins, who are already holding tape.'),
            W('Wait, what are they doing? Get away from him!', 'angry'),
            N('Nobody pays him any attention. The fishing-rod toy brings a screwdriver bigger than she is.'),
            N('The spider-baby lays the arm against the shoulder, and waits for somebody to help hold the pieces.'),
          ],
          choices: [
            {
              id: 'straight',
              label: 'Tell him straight: being a toy isn’t nothing.',
              set: { 'mv-ts-buzz-truth': 'straight' },
              then: [
                Y('Somebody wrote his name on your boot. You were wanted before you ever tried to fly.'),
                B('…Andy did, didn’t he. In marker. It tickled.', 'soft'),
              ],
            },
            {
              id: 'bonnet',
              label: 'Point out that he looks great in a bonnet.',
              set: { 'mv-ts-buzz-truth': 'joke' },
              then: [
                B('…It is a very good bonnet.', 'sad'),
                N('He almost smiles. Almost is a start.'),
              ],
            },
          ],
        },
        done: {
          id: 'mv-ts03-arm-done',
          lines: [
            N('The arm clicks home, and Buzz tests the laser: it still glows red. It never did anything, and it never needed to.'),
            W('They fixed him. The scary ones fixed him.', 'shock'),
            N('The spider-baby taps your Nubbin on the head, twice, like a thank-you.'),
          ],
        },
      },
    ],
    complete: {
      id: 'mv-ts03-complete',
      lines: [
        N('Sid bursts in holding a parcel. Inside is a firework rocket as long as his arm, with a comet on the box.'),
        SI('Mail order! I always wanted to know what a spaceman looks like in space.', 'happy'),
        N('He tapes the rocket to Buzz’s back with a whole roll of tape, for launch at dawn. Then thunder rolls in, and it rains.'),
        N('Sid goes to bed, with Woody shut under a milk crate and a toolbox on top. Buzz sits beside it, strapped to his rocket, watching the rain.'),
        W('That window over there is Andy’s. You should be in there, not me. He picked you.', 'sad'),
        B('I keep looking at my boot. His name’s still there. It’s the only thing tonight that makes any sense.', 'soft'),
        N('Before dawn, one of the strange toys leaves a little wrench by your pack. It is the only gift it has.'),
      ],
    },
    rewards: [
      { id: 'mv-ts03-wrench', kind: 'item', label: 'Mended-Toy Wrench', description: 'A tiny wrench from Sid’s strange toys. Use it in the Grove to repair a broken toy or decor item for free.' },
      { id: 'mv-ts03-title', kind: 'title', label: 'Patched Up', description: 'Title for the Nubbin that held Buzz’s shoulder still. Shown on its stat sheet.' },
    ],
    sets: { 'mv-ts03': true },
    notes:
      'Sid’s mutated toys must read as unsettling for one scene and gentle ever after: low-key light on first sight, warm light once they fix Buzz. Never show anything tearing; Buzz’s arm pops off with a plastic click. The commercial is shown as a toy-scale TV with original art and a silent caption; the “can’t fly” small print is drawn, not voiced. Hannah is off-screen except her voice through the wall (no line). The tea party bonnet stays on Buzz for the rest of the storyline as a cosmetic swap.',
  },

  // ------------------------------------------------------------------ TS4
  {
    id: 'mv-ts04',
    code: 'TS4',
    title: 'The Rocket',
    source: 'Toy Story (Pixar, 1995): the ambush and the moving van',
    audience: 'adult',
    trigger: { where: GATE, when: 'After TS3, Sid’s House' },
    requires: ['TS3'],
    speakers: [WOODY, BUZZ, POTATO, SARGE, PLUSH],
    steps: [
      {
        id: 'mv-ts04-s1',
        goal: 'Spring the backyard ambush on Sid before the rocket goes up.',
        hint: 'An expedition with timing. Each strange toy takes a position, and your Nubbins rise from the sandpit on Woody’s cue.',
        check: 'expedition:complete:mv-ts-backyard-ambush',
        scene: {
          id: 'mv-ts04-crate',
          lines: [
            N('Morning. Through Sid’s window you can see a moving van in Andy’s drive, and boxes going in: Andy’s family leaves today.'),
            W('Buzz. Buzz! Get this toolbox off me. We can still make it, both of us.', 'shock'),
            B('Go without me. A toy that can’t fly is a toy nobody will miss.', 'sad'),
            W('I’d miss you! I mean it! Andy put his name on you. Get off your rocket and push!', 'angry'),
            N('Buzz looks at his boot, then leans his rocket on the toolbox and pushes, and your Nubbins push too. It shifts an inch, then a foot.'),
            N('Woody slides out just as Sid thunders back in, grabs Buzz and runs downstairs to the yard. Launch time.'),
            W('All right. There’s a rule, and every toy knows it. We don’t move in front of them. Not ever.'),
            W('Today I’m breaking it. Who’s with me?'),
            N('The spider-baby clicks and the fishing-rod toy reels in. Your Nubbins step forward before you can say a word.'),
          ],
          choices: [
            {
              id: 'break',
              label: 'Break the rule with him. Let Sid see you move.',
              set: { 'mv-ts-rule': 'broken' },
              then: [
                W('Then we do it together. Count of three, and we give him the fright of his life.', 'happy'),
              ],
            },
            {
              id: 'hidden',
              label: 'Stay hidden and work the trap from the drain.',
              set: { 'mv-ts-rule': 'kept' },
              then: [
                W('Smart. Somebody ought to keep their nose clean. You pull the strings, I’ll do the talking.'),
              ],
            },
          ],
        },
        done: {
          id: 'mv-ts04-crate-done',
          lines: [
            N('Sid strikes a match. Then Woody’s voice box says Sid’s name, which it was never built to do.'),
            W('Sid. We see what you do in that room. Every toy you’ve broken, we remember.', 'angry'),
            N('Toys rise out of the sandpit, the mud and the drain. Sid screams, drops everything and runs inside to hide behind his sister.'),
          ],
        },
      },
      {
        id: 'mv-ts04-s2',
        goal: 'Steer RC after the moving van, then ride the rocket into Andy’s car.',
        hint: 'A race on a draining battery. Hug the kerb, and let the rocket do the rest once the fuse catches.',
        check: 'race:win:mv-ts-moving-van',
        scene: {
          id: 'mv-ts04-van',
          lines: [
            N('No time to celebrate. The van is pulling out, and Andy’s family car is already round the corner.'),
            N('Woody, Buzz and your Nubbins run. Buzz makes the van’s bumper; Woody doesn’t, until Buzz reaches back and hauls him on.'),
            N('Then Scud comes over the fence at full gallop and gets Woody by the boot.'),
            N('Buzz lets go of the van, lands on the dog’s head and saves him. The van drives off with Woody on it and Buzz in the road.'),
            W('I’m not leaving him again. Not ever again. RC!', 'angry'),
            N('Woody digs RC out of a box marked ANDY’S ROOM. The other toys only see Woody throwing their friend out of a moving van.'),
            PH('He’s doing it again! Now he’s getting rid of RC!', 'angry'),
            N('They throw Woody out after RC. He lands on RC’s roof, and RC swerves back for Buzz.'),
            N('Buzz and your Nubbins pile on, and RC’s battery light flickers and goes red. The van keeps pulling away.'),
            B('The rocket! Woody, I’m still wearing the rocket!', 'shock'),
            W('And Sid’s match! It’s in my holster! Hold still!'),
            N('The match goes out in the wind. Buzz turns his helmet to the sun, and the bright spot settles on the fuse.'),
          ],
        },
        done: {
          id: 'mv-ts04-van-done',
          lines: [
            N('The rocket kicks and RC drops away. The van’s back doors flash past below you, and you keep going up.'),
            N('Buzz pops his wings and the tape snaps. The rocket goes on alone and bursts like a dandelion high over the street.'),
            N('You glide, more or less, and drop through the open sunroof of Andy’s car into a box beside his seat.'),
            W('Buzz! Look at you! Look at you go!', 'happy'),
            B('This is a glide with ambitions. I’ll take it.', 'happy'),
          ],
        },
      },
    ],
    complete: {
      id: 'mv-ts04-complete',
      lines: [
        N('Andy finds two toys in the box and yells for joy. He doesn’t ask how they got there; children never do.'),
        N('Christmas, in the new house. The toys gather on the stairs with the baby monitor again while Sarge’s men report.'),
        SG('Present one is… stand by. It’s barking. Repeat, the present is barking.'),
        W('A puppy. Well. Can’t be worse than a spaceman.', 'happy'),
        B('I’ll take that as a compliment, Sheriff.', 'happy'),
        N('Your plush Nubbin has kept Woody’s spot on the new bed warm. It mentions this, twice.'),
        PL('He’s back on the pillow. I’m back in the box. It’s a good box.', 'happy'),
        N('Buzz gives you one of his wing-tips, which snapped off in the flight. Woody pins it to your pack like a medal.'),
      ],
    },
    rewards: [
      { id: 'mv-ts04-wing', kind: 'cosmetic', label: 'Rocket Wing-Tip', description: 'A snapped-off space-ranger wing-tip, pinned to the pack of any Nubbin like a medal.' },
      { id: 'mv-ts04-title', kind: 'title', label: 'Moving Day', description: 'Keeper title for surviving the van chase and the rocket. Shown on the Keeper card.' },
    ],
    sets: { 'mv-ts04': true },
    notes:
      '`mv-ts-rule` (broken/kept) only changes the ambush: if broken, the Keeper sprite rises in plain sight with the strange toys; if kept, the Keeper works the sprinkler valve unseen. Woody’s voice box line in the ambush is his own voice, not a recording; play it with a slight crackle. The rocket ride is the race finale: no time limit, just stay on the road until the fuse catches. Plush rule (0-based): mv-ts04-complete lines 5 and 6 drop without the Q12 plush. Ends the first film.',
  },

  // ------------------------------------------------------------------ TS5
  {
    id: 'mv-ts05',
    code: 'TS5',
    title: 'The Yard Sale',
    source: 'Toy Story 2 (Pixar, 1999): the torn arm and the yard sale',
    audience: 'adult',
    trigger: { where: GATE, when: 'After TS4, The Rocket' },
    requires: ['TS4'],
    speakers: [WOODY, BUZZ, ANDY, MUM, WHEEZY, HAMM, REX, SLINKY, AL],
    steps: [
      {
        id: 'mv-ts05-s1',
        goal: 'Climb to the high shelf and talk to Wheezy.',
        hint: 'Bring a Nubbin that climbs well. The bookcase is dusty, so go slowly.',
        check: 'talk:ts-wheezy',
        scene: {
          id: 'mv-ts05-arm',
          lines: [
            N('Time has gone by in the new house. Andy is off to cowboy camp, and Woody has been waiting all year for it.'),
            N('Then Andy plays rough before breakfast, and Woody’s arm tears open at the shoulder. Stuffing shows.'),
            AN('Aw, no. Mum? Woody’s ripped.', 'sad'),
            N('Andy goes to camp without him. His mum puts Woody on the high shelf, which is where toys go when nobody is sure.'),
            W('It’s fine. He’ll fix me when he gets back. That’s what the shelf is for. Waiting.', 'sad'),
            N('That night Woody dreams that Andy drops him in a bin bag full of other arms and legs. He wakes up shaking.'),
            N('Behind a book on the shelf, something squeaks very faintly. A penguin, flat and furred over with dust.'),
            WZ('Oh, hello. Sorry. Don’t get up. My squeaker went months ago, so now I just sort of… wheeze.', 'sad'),
            WZ('Somebody was going to take me to be mended. I think they forgot. Then I forgot to remind them.'),
            N('Your Nubbins sit either side of him. The penguin leans on one of them, very gently, as if it might break.'),
          ],
        },
        done: {
          id: 'mv-ts05-arm-done',
          lines: [
            N('Outside, someone is setting up trestle tables on the lawn. Andy’s mum is pricing things with little coloured stickers.'),
            N('She reaches up to the shelf and takes Wheezy. You watch him go out of the door in a box marked 25¢.'),
          ],
        },
      },
      {
        id: 'mv-ts05-s2',
        goal: 'Ride Buster through the yard sale and bring Wheezy home.',
        hint: 'Stealth on dogback: Buster is allowed in the yard. Toys are not.',
        check: 'expedition:complete:mv-ts-yard-sale:stealth',
        scene: {
          id: 'mv-ts05-sale',
          lines: [
            W('A yard sale. She’s selling him. For a quarter! He’s worth at least a dollar!', 'shock'),
            W('Somebody whistle for Buster. I’m going out there.'),
            N('Buster is Andy’s dog, grown up now and almost exactly the size of a sofa.'),
            HA('Woody, your arm is hanging by a thread. An actual thread. I can see it.'),
            W('Then I’ll use the other one.'),
            N('Woody climbs onto Buster’s back. Your Nubbins climb on behind him and hold on to the collar.'),
            RX('Be careful! There are people out there! There are tables! There are prices!', 'shock'),
            N('Down the stairs, out of the door, across the lawn, through a forest of grown-up legs towards the 25¢ box.'),
          ],
          choices: [
            {
              id: 'keeper',
              label: 'Grab Wheezy yourself and let Woody steer the dog.',
              set: { 'mv-ts-wheezy': 'keeper' },
              then: [
                N('You pull Wheezy out of the box by his flipper. He weighs nothing at all.'),
                WZ('Oh! Hello again! Am I being stolen? How exciting.', 'happy'),
              ],
            },
            {
              id: 'woody',
              label: 'Steer Buster yourself so Woody can make the grab.',
              set: { 'mv-ts-wheezy': 'woody' },
              then: [
                N('You steer with both hands in Buster’s fur. Woody leans down and scoops Wheezy up with his good arm.'),
                W('Got him! Home, Buster, home!', 'happy'),
              ],
            },
            {
              id: 'stay',
              label: 'Tell Woody to stay inside. One torn arm is enough risk for one day.',
              set: { 'mv-ts-wheezy': 'warned' },
              then: [
                W('If I stay up here, I’m just another toy on a shelf deciding who’s worth saving. Hold the collar.', 'angry'),
                N('He goes anyway, of course. You hold the collar, and your Nubbins hold you.'),
              ],
            },
          ],
        },
        done: {
          id: 'mv-ts05-sale-done',
          lines: [
            N('Buster trots back in with Wheezy and your Nubbins. But Woody slips off halfway across the lawn and lands face-up in the grass.'),
            N('A man in a chicken-print shirt bends down, picks Woody up, and his whole face changes.'),
            AL_('No. No way. An original Woody, lying in the grass. At a yard sale.', 'shock'),
          ],
        },
      },
      {
        id: 'mv-ts05-s3',
        goal: 'Chase Al’s car down the street with Buzz.',
        hint: 'A run on toy legs against a car. You can’t win it; get close enough to read the number plate.',
        check: 'race:finish:mv-ts-chase-al:run',
        scene: {
          id: 'mv-ts05-al',
          lines: [
            AL_('Ma’am! What do you want for this? I’ll give you fifty. Cash. Right now.'),
            MU('Sorry, that one’s my son’s. It got into the wrong box.', 'think'),
            AL_('Ma’am, I collect. I will give you real money.'),
            MU('Then you’ll understand why it isn’t going anywhere.'),
            N('She drops Woody in the cashbox to keep him safe, and turns away to help a woman with a lamp.'),
            N('Al looks left, and right. He lifts Woody out of the cashbox, slips him into his bag and walks to his car.'),
            N('From Andy’s bedroom window, Buzz sees all of it.'),
            B('He’s been taken. We’re going down there.', 'angry'),
            SL('Buzz, you can’t go down there in daylight. There’s a whole yard sale!'),
            B('Watch me.'),
          ],
        },
        done: {
          id: 'mv-ts05-al-done',
          lines: [
            N('The car pulls away. Buzz stops in the road, panting inside his helmet, and your Nubbins stop with him.'),
            N('A few chicken-print feathers drift where the car was. On its number plate, in big letters: TOYBRN 1.'),
          ],
        },
      },
    ],
    complete: {
      id: 'mv-ts05-complete',
      lines: [
        N('That night the whole room watches local TV, while Buzz paces in front of the set with a crayon.'),
        N('An advert comes on: a man in a chicken suit, flapping in front of a warehouse full of toys. It’s the man from the lawn.'),
        AL_('If you can’t find it at Al’s Toy Barn, kids, it was never made! Bawk!', 'happy'),
        HA('Al’s Toy Barn. Toy B-R-N. It was right there on his bumper.'),
        B('Then that’s where we go. Who’s with me?'),
        N('Buzz, Hamm, Rex, Slinky, Mr. Potato Head and your Nubbins step forward. Wheezy gives a thin, hopeful wheeze.'),
        WZ('Bring him back. He came for me. Nobody comes for you on a shelf.', 'soft'),
        N('Before you go, Wheezy gives you the little bow tie from his own neck, for luck. He’s had no use for it lately.'),
      ],
    },
    rewards: [
      { id: 'mv-ts05-bowtie', kind: 'cosmetic', label: 'Wheezy’s Bow Tie', description: 'A small red bow tie from a penguin who was finally rescued. Wearable by any Nubbin.' },
      { id: 'mv-ts05-sign', kind: 'decor', label: 'Yard Sale Sign', description: 'A hand-lettered YARD SALE sign for the Grove. Anything Nubbins leave beside it is not for sale.' },
    ],
    sets: { 'mv-ts05': true },
    notes:
      'Opens the second film. Woody’s nightmare is a short dim cutaway (bin bag of loose toy limbs, played eerie, not gory). Yard sale: stealth on a big dog; humans ignore Buster but notice toys riding him if Buster stops in their line of sight. The number plate “TOYBRN 1” and Al’s ad are original; the ad uses a bright jingle (original, no lyrics). Al steals Woody in plain sight of the player but the theft cannot be prevented; the race only needs to be finished. `mv-ts-wheezy` gains a third value, `warned` (added in review): the Keeper argues for caution, Woody goes anyway, and the step plays exactly as `woody`.',
  },

  // ------------------------------------------------------------------ TS6
  {
    id: 'mv-ts06',
    code: 'TS6',
    title: 'Al’s Toy Barn',
    source: 'Toy Story 2 (Pixar, 1999): the road crossing and Al’s Toy Barn',
    audience: 'adult',
    trigger: { where: GATE, when: 'After TS5, The Yard Sale' },
    requires: ['TS5'],
    speakers: [BUZZ, REX, HAMM, SLINKY, POTATO, UBUZZ, BARBIE, AL],
    steps: [
      {
        id: 'mv-ts06-s1',
        goal: 'Cross the highway under the traffic cones.',
        hint: 'A stop-and-go race. Move while the traffic moves; freeze the moment it stops.',
        check: 'race:finish:mv-ts-traffic-cones',
        scene: {
          id: 'mv-ts06-road',
          lines: [
            N('Al’s Toy Barn is across town, which is to say across the world. The rescue party walks all night.'),
            N('By morning you reach a four-lane road. On the far side stands a giant barn sign with a chicken on it.'),
            RX('Do we have to cross it? Can we go round? Is there a round?', 'shock'),
            B('There’s a stack of traffic cones on the verge. Everyone under one. We cross on my word.'),
            HA('Under a cone. Fine. I’ve been under worse. I’ve been under Andy’s bed since spring.'),
            N('Each of you takes a cone. Your Nubbins share one, which waddles.'),
            B('Move only when the cars are moving. Freeze when they stop. Ready… now!', 'angry'),
            N('Behind you, drivers start braking hard and something crunches. Something else honks for a very long time.'),
            SL('Don’t look back. I think we did that. Don’t look back.'),
          ],
          choices: [
            {
              id: 'gaps',
              label: 'Cross in the gaps between cars, one lane at a time.',
              set: { 'mv-ts-cones': 'careful' },
              then: [
                N('You time it gap by gap, and it takes for ever. Fewer things crunch.'),
                B('Textbook, Keeper. Textbook.'),
              ],
            },
            {
              id: 'run',
              label: 'Just run for it.',
              set: { 'mv-ts-cones': 'run' },
              then: [
                N('You run. A lorry swerves round your cone and into a ditch, and a load of watermelons goes everywhere.'),
                PH('Oh, that’s on us. That is definitely on us.'),
              ],
            },
          ],
        },
        done: {
          id: 'mv-ts06-road-done',
          lines: [
            N('The last cone reaches the far kerb, and behind you the road looks like a bad day at the fair. Nobody is hurt; everybody is late.'),
            B('Regroup. Let’s go and find our sheriff.'),
          ],
        },
      },
      {
        id: 'mv-ts06-s2',
        goal: 'Get Buzz out of the box and catch up with the rescue party.',
        hint: 'An expedition through the Barn after closing. Pull the tape from the bottom; that flap gives first.',
        check: 'expedition:complete:mv-ts-toy-barn',
        scene: {
          id: 'mv-ts06-aisle',
          lines: [
            N('The Barn is enormous after closing time. Aisles run off into the dark like streets in a city.'),
            N('Buzz turns a corner and stops dead. An entire aisle of Buzz Lightyears, hundreds of them, boxed and lit like a cathedral.'),
            B('…Huh. So that’s what I look like from the outside.', 'think'),
            B('Hundreds of me, all newer. Is this how Woody felt, the day I landed on his bed?', 'think'),
            N('One of them isn’t in his box. He’s newer and shinier, and he wears a utility belt with a grappling hook.'),
            UB('Halt! Ranger, you’ve broken out of your stasis pod. Who authorised that?', 'angry'),
            B('Listen to me. You’re a toy. I’m a toy. There’s a cowboy across town who needs…', 'think'),
            UB('Your circuits are scrambled, soldier. It happens on long missions. Let’s get you back in your pod.'),
            N('Before Buzz can finish, the new Buzz tips him into an empty box and tapes it shut. He salutes and strides off.'),
            N('Your Nubbins are on the shelf below. They saw everything, and nobody else did.'),
            N('Down the aisle, the rescue party waves the new Buzz over, sure he’s theirs. He goes with them, of course.'),
          ],
          choices: [
            {
              id: 'free',
              label: 'Cut Buzz out of the box first.',
              set: { 'mv-ts-aisle': 'freed' },
              then: [
                N('Your Nubbins chew through the tape. Buzz bursts out like a jack-in-the-box with something to prove.'),
                B('Thank you. Now, where is that impostor taking my friends?', 'angry'),
              ],
            },
            {
              id: 'follow',
              label: 'Follow the others. Buzz can get himself out.',
              set: { 'mv-ts-aisle': 'followed' },
              then: [
                N('You go after the party. Behind you, a box rocks, and rocks, and splits down the side.'),
                B('Fine! I’ll do it myself! I always end up doing it myself!', 'angry'),
              ],
            },
          ],
        },
        done: {
          id: 'mv-ts06-aisle-done',
          lines: [
            N('The rest of the party has borrowed a pink convertible from the doll aisle, with the new Buzz up front and a Barbie at the wheel.'),
            BA('Welcome to the Barn, everybody! On your left, the doll aisle, where nobody has ever had a bad hair day.', 'happy'),
            N('The new Buzz is navigating, very confidently. He is going the wrong way.'),
          ],
        },
      },
    ],
    complete: {
      id: 'mv-ts06-complete',
      lines: [
        N('Al comes out of his office, talking into a phone wedged under his chin.'),
        AL_('The whole Roundup set. All of it. A museum in Tokyo, can you believe that? I fly tomorrow.', 'happy'),
        N('The party, wrong Buzz and all, ducks into Al’s bag as he leaves. The real Buzz and your Nubbins chase him across the car park.'),
        N('Al crosses the street to a tall apartment block and goes up in the lift. The doors close before anyone can reach them.'),
        B('The vents. We go up through the vents. Nubbins, you’re the smallest. You’re point.'),
        N('On a shelf by the door is a spare utility belt, still in its plastic. Buzz looks at it, and then, a little sheepishly, gives it to you.'),
      ],
    },
    rewards: [
      { id: 'mv-ts06-belt', kind: 'cosmetic', label: 'Utility Belt', description: 'A toy space-ranger utility belt with a (non-working) grappling hook. Fits any Nubbin.' },
      { id: 'mv-ts06-cone', kind: 'decor', label: 'Traffic Cone', description: 'An orange traffic cone for the Grove. Nubbins hide under it and waddle about.' },
    ],
    sets: { 'mv-ts06': true },
    notes:
      'Highway crossing: road traffic and crashes are slapstick and bloodless; drivers shout off-screen and nobody is hurt (say so in the done scene). The second Buzz needs a distinct sprite (utility belt, brighter plastic) so the player can follow the swap. Barbie here is the toy-store tour-guide doll, not the TS9 Barbie; same speaker id is fine. Al’s phone call sets up TS7: the museum is Konishi’s in Tokyo, but only “a museum in Tokyo” is said.',
  },

  // ------------------------------------------------------------------ TS7
  {
    id: 'mv-ts07',
    code: 'TS7',
    title: 'The Roundup Gang',
    source: 'Toy Story 2 (Pixar, 1999): Al’s apartment, Jessie’s story',
    audience: 'adult',
    trigger: { where: GATE, when: 'After TS6, Al’s Toy Barn' },
    requires: ['TS6'],
    speakers: [WOODY, BUZZ, JESSIE, PETE, AL],
    steps: [
      {
        id: 'mv-ts07-s1',
        goal: 'Meet the Roundup Gang in Al’s apartment.',
        hint: 'Come out of the heating vent while Al is out. Bullseye will find you first.',
        check: 'talk:ts-roundup-gang',
        scene: {
          id: 'mv-ts07-roundup',
          lines: [
            N('You come out of a heating vent a floor ahead of Buzz. Woody is on a glass table under a lamp, his torn arm dangling.'),
            N('He isn’t alone. A cowgirl in a red hat sits on the table edge, and a toy horse is licking his face.'),
            W('You! Am I glad to see… how did you… never mind. Meet the Roundup Gang. Apparently I’m famous.', 'shock'),
            JE('Famous? Cowboy, you’re the star! Lunchboxes! Yo-yos! A record player shaped like your hat! Bullseye, show him!', 'happy'),
            N('The horse gallops to an old television and noses the play button on a stack of tapes.'),
            N('Black-and-white puppets and banjo music. A little marionette Woody rides across a painted desert with Jessie and Bullseye behind.'),
            N('Your Nubbins sit in front of the screen with their mouths open. So does Woody.'),
            N('A third toy watches from a shelf, sealed in his box: an old prospector with a pickaxe and a beard like a broom.'),
            PE('Still in my box. Never opened, never played with. Fifty years and not one scratch.', 'happy'),
            PE('And now you’re here, Woody, the set’s complete. Al’s selling us to a museum in Tokyo. All of us, together, for good.'),
            W('A museum. In Japan. No, see, I have a kid. I’m only here till my friends come.', 'think'),
            N('Jessie’s face falls. She goes back into her box without another word.'),
          ],
          choices: [
            {
              id: 'fan',
              label: 'Ask for another tape. The show is actually good.',
              set: { 'mv-ts-roundup': 'fan' },
              then: [
                PE('A connoisseur. I knew I’d like you.', 'happy'),
                N('Bullseye hits play again, very fast, before anyone can stop him.'),
              ],
            },
            {
              id: 'home',
              label: 'Back Woody up. He has a kid waiting.',
              set: { 'mv-ts-roundup': 'home' },
              then: [
                N('The Prospector’s smile stays exactly where it is. His painted eyes seem to do something else.'),
                PE('Of course. Of course he does.'),
              ],
            },
          ],
        },
      },
      {
        id: 'mv-ts07-s2',
        goal: 'Hide under the cleaner’s bench and hand back whatever he drops.',
        hint: 'Stealth: little things roll off the bench. Roll them back while his head is down.',
        check: 'expedition:complete:mv-ts-cleaners-bench:stealth',
        scene: {
          id: 'mv-ts07-arm',
          lines: [
            N('That night Woody tries to get his arm loose from Al’s tape and go. He climbs down the table leg in the dark.'),
            N('The television switches itself on, loud static right by the sofa. Al stumbles in and finds Woody on the floor.'),
            AL_('Huh? How’d you get down there?', 'think'),
            N('By morning Woody’s torn arm has come off in Al’s hands, and Al has locked it in a drawer.'),
            W('Somebody switched that TV on. Somebody wanted me caught.', 'angry'),
            JE('Don’t look at me! I was in my box! I’m always in my box!', 'angry'),
            N('The Prospector, sealed in his own box, says nothing at all. He’s good at that.'),
            N('Then the door opens on an old man with a case of tiny brushes, glues and tools. Al calls him the cleaner.'),
            N('He sits Woody under the lamp and works for hours. New stitches at the shoulder, fresh paint on the boots, and even the hat gets brushed.'),
          ],
        },
        done: {
          id: 'mv-ts07-arm-done',
          lines: [
            N('When he’s finished, Woody’s arm is better than the day he was made. The old man pats him once on the head and goes.'),
            W('…I can’t even feel the seam.', 'soft'),
          ],
        },
      },
      {
        id: 'mv-ts07-s3',
        goal: 'Help Woody choose: the museum for ever, or Andy for now.',
        hint: 'Listen to everyone. Your answer changes what Woody says, not where he ends up.',
        check: 'talk:ts-woody:after-emily',
        scene: {
          id: 'mv-ts07-emily',
          lines: [
            N('Woody stands at the vent, ready to go home. Jessie sits on the windowsill and won’t look at him.'),
            JE('Go on, then. Go back to your kid. He’ll love you right up until he doesn’t.', 'angry'),
            W('Andy’s not like that.', 'angry'),
            JE('Mine wasn’t either. Her name was Emily.', 'sad'),
            N('Jessie tells it: Emily took her everywhere, to the creek, in the car, under the covers with a torch. They were best friends for years.'),
            N('Then Emily grew up: make-up on the dresser, records, a phone with a long curly cord. Jessie went under the bed.'),
            JE('One day she found me again. I thought, this is it. She remembered me.', 'sad'),
            JE('She drove me out to a charity box by the road, and put me in it, and drove away.', 'sad'),
            N('Somewhere in the apartment a radio is playing something soft. Nobody turns it off.'),
            PE('That’s what children do, Woody. A museum doesn’t grow up.', 'soft'),
            W('…For ever. Behind glass. Nobody ever leaves you behind glass.', 'think'),
            N('Woody steps back from the vent and sits down by Jessie. Just then the vent cover rattles, and Buzz climbs out.'),
          ],
          choices: [
            {
              id: 'andy',
              label: 'Tell Woody that Andy needs him now, not later.',
              set: { 'mv-ts-choice': 'andy' },
              then: [
                Y('He hasn’t grown up yet, Woody. You’d miss all of it.'),
                B('Listen to them. You taught me this, cowboy. A toy is for a kid, not a glass case.'),
              ],
            },
            {
              id: 'together',
              label: 'Tell Woody not to leave Jessie behind either.',
              set: { 'mv-ts-choice': 'together' },
              then: [
                Y('Then don’t leave her by another road. Bring them.'),
                W('…Bring them. To Andy’s. Why didn’t I think of that?', 'shock'),
              ],
            },
            {
              id: 'his',
              label: 'Tell Woody it’s his choice, and you’ll respect it.',
              set: { 'mv-ts-choice': 'his' },
              then: [
                W('Some help you are.', 'sad'),
                N('But he looks at the TV, at the little puppet of himself waving to a crowd of children, and something in his face changes.'),
              ],
            },
          ],
        },
        done: {
          id: 'mv-ts07-emily-done',
          lines: [
            W('No. I’m going home. And you’re coming with me, all three of you. There’s room in Andy’s room.', 'happy'),
            JE('…You mean it? A kid? A real kid?', 'shock'),
            N('Bullseye spins in a joyful circle. Jessie starts to laugh.'),
          ],
        },
      },
    ],
    complete: {
      id: 'mv-ts07-complete',
      lines: [
        N('Then a clang. The vent cover slams shut, and a screwdriver turns its screws from the inside.'),
        N('The Prospector is out of his box. He stands on the television with the screwdriver in his hand.'),
        PE('Fifty years on a shelf. I watched every other toy in that shop get taken home. Every one.', 'angry'),
        PE('No child ever chose me. I don’t intend to give one the chance now. Nobody leaves.', 'angry'),
        W('It was you. The TV. You let Jessie take the blame.', 'shock'),
        N('In all the noise, the cleaner’s spare touch-up kit is still under the table, where your Nubbins hid it. It comes with you.'),
      ],
    },
    rewards: [
      { id: 'mv-ts07-kit', kind: 'item', label: 'Cleaner’s Touch-Up Kit', description: 'Tiny brushes and paint from Al’s restorer. Use it to restore a faded or scuffed cosmetic to new.' },
      { id: 'mv-ts07-title', kind: 'title', label: 'Roundup Regular', description: 'Keeper title for watching the whole Roundup tape collection. Bullseye insisted.' },
    ],
    sets: { 'mv-ts07': true },
    notes:
      'The Roundup show is a black-and-white puppet show with original banjo music; no theme song lyrics. Jessie’s story about Emily is the line’s first quiet scene: play it as a montage behind her lines, warm colours that fade to grey, with soft original instrumental music (the radio). No lyrics. The cleaner never speaks; keep him gentle and wordless. The museum in Tokyo is named only as such. `mv-ts-choice` changes only the then-lines; Woody always chooses Andy and invites the Gang.',
  },

  // ------------------------------------------------------------------ TS8
  {
    id: 'mv-ts08',
    code: 'TS8',
    title: 'The Airport',
    source: 'Toy Story 2 (Pixar, 1999): the airport and the runway',
    audience: 'adult',
    trigger: { where: GATE, when: 'After TS7, The Roundup Gang' },
    requires: ['TS7'],
    speakers: [WOODY, BUZZ, HAMM, REX, ALIENS, PETE, JESSIE, ANDY, PLUSH],
    steps: [
      {
        id: 'mv-ts08-s1',
        goal: 'Drive the Pizza Planet truck to the airport before Al checks in.',
        hint: 'A race with a whole crew on the pedals. Watch the brake, and don’t let Rex look at the speedometer.',
        check: 'race:win:mv-ts-airport-run',
        scene: {
          id: 'mv-ts08-truck',
          lines: [
            N('Al packs the Roundup Gang into a case with foam cut-outs and leaves for the airport. The Prospector rides along, pleased with himself.'),
            N('Buzz and the rescue party get out of the vents and reach the street with your Nubbins. Al’s car is already turning the corner.'),
            B('We need a vehicle. Big. Fast. Anybody?'),
            N('At the kerb sits a Pizza Planet delivery truck, engine warm, keys in. Hamm whistles.'),
            N('Buzz steers. Rex has the accelerator, Slinky the brake, Mr. Potato Head the indicators, and your Nubbins the horn.'),
            HA('Left at the lights. No, the other left. The left everybody else uses.'),
            RX('I can’t see where I’m going! I’ve only got little arms!', 'shock'),
            B('Faster, Rex. If Al gets on that plane, they go to Tokyo in a box.', 'angry'),
            AX('The great wheel turns. We are going somewhere. Somewhere is glorious.', 'happy'),
          ],
          choices: [
            {
              id: 'shortcut',
              label: 'Take the shortcut through the car park.',
              set: { 'mv-ts-truck': 'shortcut' },
              then: [
                N('Over a kerb, under a barrier, past a man with a trolley who will be telling this story for years.'),
                HA('That counts as legal. I think.'),
              ],
            },
            {
              id: 'road',
              label: 'Stay on the road. Nobody gets hurt.',
              set: { 'mv-ts-truck': 'road' },
              then: [
                N('You keep to the road and, mostly, the speed limit. Rex indicates at every single turn.'),
                B('Slower. But nobody ends up in a ditch of watermelons. Again.'),
              ],
            },
          ],
        },
        done: {
          id: 'mv-ts08-truck-done',
          lines: [
            N('You reach the airport as Al hands his case across a counter. It slides onto a belt and disappears through a rubber curtain.'),
            B('Then we follow the case.'),
          ],
        },
      },
      {
        id: 'mv-ts08-s2',
        goal: 'Stop the Prospector on the baggage belt.',
        hint: 'A karate bout on a moving belt. Keep your footing; he hits hard but slowly.',
        check: 'karate:win:mv-ts-prospector',
        scene: {
          id: 'mv-ts08-bags',
          lines: [
            N('Behind the curtain is a maze. Belts, chutes and ramps, climbing and dropping in every direction, and thousands of bags.'),
            N('The team rides a suitcase in. Your Nubbins ride a duffel bag that is going somewhere else entirely, and have to jump.'),
            N('At last, a green case with Al’s name on the tag. Buzz opens it: Woody is inside, and so is the Prospector, out of his box.'),
            PE('You think you can go back? You’ll end up in a bin when he’s bored. Like her. Like all of them.', 'angry'),
            N('He swings his pickaxe and catches Woody’s new shoulder seam. Then he drags Woody back towards the case.'),
            W('Let go of me!', 'angry'),
            B('You’ve had fifty years in a box to get angry, Pete. You’re not taking it out on him.', 'angry'),
            N('Buzz and the gang haul the Prospector out onto the belt. Your Nubbins block the end, where the chute drops.'),
          ],
          choices: [
            {
              id: 'mercy',
              label: 'Tell the Prospector it isn’t too late. A kid might still choose him.',
              set: { 'mv-ts-pete': 'mercy' },
              then: [
                Y('Fifty years is a long time, Pete. It isn’t for ever. Somebody might still pick you.'),
                PE('Somebody. Somebody would have, by now.', 'angry'),
                N('But for half a second, the hand on the pickaxe goes slack.'),
              ],
            },
            {
              id: 'firm',
              label: 'Tell him he doesn’t get to choose for ever on anyone else’s behalf.',
              set: { 'mv-ts-pete': 'firm' },
              then: [
                Y('You want a glass case, fine. You don’t get to put Jessie in one. Or Woody.'),
                PE('Somebody has to decide for them. Children certainly won’t.', 'angry'),
              ],
            },
          ],
        },
        done: {
          id: 'mv-ts08-bags-done',
          lines: [
            N('The Prospector ends up in a little girl’s backpack, the kind with crayons and glitter in every pocket.'),
            N('She takes one look at him and decides, out loud, that his face needs a lot more colour. He screams, silently, as toys must.'),
            PE('I was in mint condition! Mint!', 'shock'),
            N('After fifty years, a child has picked him. It is not going the way he pictured it, and it is not the worst thing either.'),
          ],
        },
      },
      {
        id: 'mv-ts08-s3',
        goal: 'Keep pace with the plane’s wheels until Woody and Jessie can drop.',
        hint: 'A sprint under a moving plane. Stay right of the wheels and level with Bullseye’s saddle.',
        check: 'race:finish:mv-ts-runway:run',
        scene: {
          id: 'mv-ts08-plane',
          lines: [
            N('Jessie is still in the case, and the case is gone. It’s on a baggage cart heading out to the plane.'),
            N('Woody and Buzz ride Bullseye out across the tarmac. Your Nubbins cling to his tail.'),
            N('The bags go in and the hold door shuts. Woody climbs in through the landing-gear well and finds Jessie behind a crate.'),
            JE('Woody! It’s locked, I can’t get out, it’s…', 'shock'),
            W('Come on. Hold my hand. Don’t let go of it, whatever happens.', 'soft'),
            N('The plane starts to roll. They climb down into the wheel bay, and the runway blurs by below them.'),
            JE('There’s nowhere to go!', 'shock'),
            N('Woody hooks his pull-string over a bolt in the wheel bay. It’s long enough, just.'),
            W('Jessie. Trust me.'),
            N('Down on the runway, Buzz kicks Bullseye on. Your Nubbins run beside the horse as fast as stitched legs go.'),
          ],
        },
        done: {
          id: 'mv-ts08-plane-done',
          lines: [
            N('They swing, let go, and land square in Bullseye’s saddle. The plane lifts off without them and shrinks to a dot.'),
            JE('…Can we do that again?', 'happy'),
            B('Not today, ma’am.', 'happy'),
          ],
        },
      },
    ],
    complete: {
      id: 'mv-ts08-complete',
      lines: [
        N('Andy comes home from camp to find Woody on his bed with a cowgirl, a horse and a penguin who can squeak again.'),
        AN('Whoa. Where did these come from? Mum! Did you get me these?', 'happy'),
        N('That night Andy mends Woody’s shoulder with thick black thread. It isn’t pretty, but Woody thinks it’s the best stitching he ever had.'),
        W('He’ll grow up, Buzz. I know it. Jessie knows it. One day he won’t need us.', 'soft'),
        B('And until then?', 'think'),
        W('Until then I’ve got a job. And you’re going to help me do it.', 'happy'),
        JE('And when he grows up, we’ll have had him. That’s more than a glass case ever gave anybody.', 'soft'),
        N('Your plush Nubbin makes room in the toy box for two more. It has got good at that.'),
        N('Jessie gives you a coil of rope tied as a lasso, and Bullseye gives you a lick. Both are, apparently, gifts.'),
      ],
    },
    rewards: [
      { id: 'mv-ts08-lasso', kind: 'cosmetic', label: 'Roundup Lasso', description: 'A coil of rope tied by Jessie. Nubbins wear it over one shoulder and occasionally lasso fruit.' },
      { id: 'mv-ts08-horse', kind: 'decor', label: 'Bullseye Rocking Horse', description: 'A rocking horse for the Grove in Bullseye’s colours. It sometimes rocks on its own when Nubbins are happy.' },
    ],
    sets: { 'mv-ts08': true },
    notes:
      'Ends the second film. The Prospector’s fate is comic, not cruel: the girl is excited, not mean; cut on his silent scream. The baggage maze is an expedition-style backdrop for the karate bout (the arena scrolls). Runway: night, plane lights, engine roar ducked under music; the race just needs finishing. Plush rule (0-based): mv-ts08-complete line 7 drops without the Q12 plush. `mv-ts-pete` (mercy/firm, added in review) only changes the then-lines; the backpack girl is the same either way, and the last done line lands as irony or as hope depending on it. The aliens rode along in the truck since TS2 (they are Mr. Potato Head’s adopted sons in the source; nothing needs saying).',
  },

  // ------------------------------------------------------------------ TS9
  {
    id: 'mv-ts09',
    code: 'TS9',
    title: 'Sunnyside',
    source: 'Toy Story 3 (Pixar, 2010): college, the donation and Sunnyside Daycare',
    audience: 'adult',
    trigger: { where: GATE, when: 'After TS8, The Airport' },
    requires: ['TS8'],
    speakers: [WOODY, BUZZ, HAMM, JESSIE, MUM, LOTSO, KEN, MRSP, CHATTER, BARBIE, REX, PLUSH],
    steps: [
      {
        id: 'mv-ts09-s1',
        goal: 'Get every toy out of the bin bag before the bin lorry arrives.',
        hint: 'A short expedition: tear, crawl, hide under the recycling crate. Count heads before you move.',
        check: 'expedition:complete:mv-ts-curbside',
        scene: {
          id: 'mv-ts09-college',
          lines: [
            N('Years go by in a few heartbeats. Andy is seventeen, with a car, a phone, a deeper voice and a room full of boxes.'),
            N('Nobody has played with the toys in a long time, and Bo was given away years ago. The army men parachuted out of the window one night, saluting.'),
            W('Andy leaves for college in three days. Worst case, it’s the attic. The attic has rafters. Character. Each other.', 'think'),
            HA('The attic. Where toys go to look at a ceiling for twenty years.'),
            JE('We know how this ends, Woody. Some of us have done it before.', 'sad'),
            N('Andy comes in with a bin bag and a cardboard box. Into the box goes Woody, the one he’s taking; into the bag go all the rest.'),
            N('Your Nubbins go into the bag, and so do you.'),
            N('Your plush Nubbin is already at the bottom, between Rex’s tail and Hamm.'),
            N('Andy leaves the bag on the landing for the attic. His mum, tidying, finds a black bag on the landing.'),
            MU('Oh, good, he’s cleared out the rubbish.', 'happy'),
            N('She carries it out to the kerb. The bin lorry is three doors down.'),
          ],
          choices: [
            {
              id: 'tear',
              label: 'Tear the bag open from the inside.',
              set: { 'mv-ts-curb': 'tore' },
              then: [
                N('Your Nubbins chew and Rex pushes. A hole opens just as the bin lorry’s brakes hiss next door.'),
              ],
            },
            {
              id: 'wait',
              label: 'Stay calm. Andy will come and find you.',
              set: { 'mv-ts-curb': 'waited' },
              then: [
                JE('Nobody comes. Trust me. Nobody comes.', 'angry'),
                N('She starts tearing the plastic with her bare hands, and you help.'),
              ],
            },
          ],
        },
        done: {
          id: 'mv-ts09-college-done',
          lines: [
            N('You get out under a recycling crate as the lorry stops. In the garage, a box sits in the back of the car, marked SUNNYSIDE: DONATE.'),
            JE('He put us out with the rubbish. Like wrappers.', 'angry'),
            N('One by one the toys climb into the donation box. Woody comes down the drive shouting, too late, and climbs in after them.'),
          ],
        },
      },
      {
        id: 'mv-ts09-s2',
        goal: 'Survive playtime in the Caterpillar Room.',
        hint: 'A survival bout against toddlers. Stay soft, roll with it, and protect Rex’s tail.',
        check: 'karate:survive:mv-ts-caterpillar-room',
        scene: {
          id: 'mv-ts09-sunnyside',
          lines: [
            N('Sunnyside Daycare is bright and warm, with rainbows on the windows and a sandpit that smells of crayons.'),
            N('When the children have gone home, the toys come out to greet you. At the front, leaning on a cane, comes a big pink bear.'),
            LO('Well, look at y’all! New friends! Welcome to Sunnyside. Name’s Lotso. Strawberry-scented, and it don’t wash out.', 'happy'),
            N('He smells of strawberries, all of him. It’s strong enough to make your Nubbins sneeze.'),
            LO('Here there’s no one child to let you down. New kids come in every morning, fresh as bread. Nobody ever outgrows you.', 'soft'),
            N('A doll in a perfect shirt sees Barbie and drops his clipboard. It is love, and it is immediate.'),
            KE('Ken. Hi. I have a… I have a house. It has a lift. Do you like… cravats?', 'shock'),
            W('This is nice. It’s very nice. But we have a kid. Andy meant us for the attic, not the kerb. I saw him.', 'angry'),
            JE('Andy put us out with the rubbish, Woody. Go to college. We’re staying.', 'angry'),
            N('Woody looks at you, the only one left who hasn’t picked a side.'),
          ],
          choices: [
            {
              id: 'stay',
              label: 'Stay. Somebody who loves Woody should look after the gang.',
              set: { 'mv-ts-sunnyside': 'stayed' },
              then: [
                W('…Yeah. Yeah, that’s fair. Look after them. Especially Rex. And don’t let anybody near Hamm’s slot.', 'sad'),
              ],
            },
            {
              id: 'argue',
              label: 'Back Woody: Andy meant the attic, and you saw it too.',
              set: { 'mv-ts-sunnyside': 'argued' },
              then: [
                Y('He’s right, Jessie. I was in that bag. Andy was carrying us up to the attic, not out to the kerb.'),
                JE('Then explain why we were on the kerb. Go on. I’m listening.', 'angry'),
                N('You can’t. Not yet. You stay, because the gang is staying, and somebody has to be here when the truth comes out.'),
              ],
            },
          ],
        },
        done: {
          id: 'mv-ts09-sunnyside-done',
          lines: [
            N('Woody goes over the wall alone. The rest of you are carried to the Caterpillar Room, where the toddlers are.'),
            N('The toddlers paint Rex and chew Slinky. They bury Buzz in a sand bucket and try to post Hamm through a slot.'),
            N('It ends at last. Your Nubbins lie flat on the carpet, damp and gluey, staring at the ceiling.'),
            B('This is not what we were promised. I’m going to have a word with that bear.', 'angry'),
          ],
        },
      },
      {
        id: 'mv-ts09-s3',
        goal: 'Pick your part in Woody’s break-out plan.',
        hint: 'Every job gets done; yours is the one you’ll play in the next storyline.',
        check: 'talk:ts-woody:break-out-plan',
        scene: {
          id: 'mv-ts09-plan',
          lines: [
            N('Buzz goes to find Lotso and is gone an hour. When he comes back, he’s different.'),
            B('Prisoners will remain in their cubbies. Lights out at eight.', 'angry'),
            N('Lotso’s gang found the switch in Buzz’s back and set him to demo mode. He doesn’t know you.'),
            N('Mrs. Potato Head has a spare eye still lying in Andy’s room. Through it she can see Andy searching the attic for them.'),
            MP('He’s looking for us. He meant the attic all along. Oh, Andy, I’m sorry.', 'sad'),
            N('That night Woody comes back over the wall. A girl called Bonnie took him home, and one of her toys told him the truth about Lotso.'),
            W('Lotso had a kid once. Daisy. She lost him on a trip, and by the time he walked home, she’d bought another Lotso.', 'sad'),
            W('So he decided every toy gets replaced. He runs this place like a prison. He always has.'),
            JE('Woody. I’m sorry. Get us out of here.', 'sad'),
          ],
          choices: [
            {
              id: 'monkey',
              label: 'Take on the cymbal monkey watching the cameras.',
              set: { 'mv-ts-break': 'monkey' },
              then: [
                W('That monkey sees everything. You and Slinky take him. Quietly.'),
              ],
            },
            {
              id: 'buzz',
              label: 'Get Buzz back. Find his switch.',
              set: { 'mv-ts-break': 'buzz' },
              then: [
                JE('I’ll help. I want to see his face when he remembers who I am.'),
              ],
            },
            {
              id: 'ken',
              label: 'Get the manual for Buzz out of Ken.',
              set: { 'mv-ts-break': 'ken' },
              then: [
                BA('Leave Ken to me. He’d trade his whole wardrobe to keep it. He’ll talk.', 'happy'),
              ],
            },
          ],
        },
        done: {
          id: 'mv-ts09-plan-done',
          lines: [
            W('Tonight, then. Over the playground, down the rubbish chute and out.'),
            N('A plastic phone on wheels rolls up under the door and rings once, very quietly.'),
            CH('Getting out? Then listen. They’ve added things: bolts, guards, the monkey. You’ll need the way they don’t watch.', 'think'),
          ],
        },
      },
    ],
    complete: {
      id: 'mv-ts09-complete',
      lines: [
        N('Night falls on Sunnyside. The toys sit in a circle on the Caterpillar Room floor, whispering who does what.'),
        RX('What if it goes wrong?', 'sad'),
        W('Then it goes wrong together. That’s all I’ve got, Rex. Together.', 'soft'),
        N('Your plush Nubbin sits in the circle too, with a crayon smear across its face like war paint.'),
        N('Barbie comes back from Ken’s dream house with a bag of his clothes and a mysterious smile. She hands you a cravat.'),
        BA('He has forty-two of them. He’ll notice. He’ll be devastated. Good.', 'happy'),
      ],
    },
    rewards: [
      { id: 'mv-ts09-cravat', kind: 'cosmetic', label: 'Ken’s Cravat', description: 'A silk cravat from the forty-two in Ken’s wardrobe. Any Nubbin wears it well.' },
      { id: 'mv-ts09-title', kind: 'title', label: 'Caterpillar Room Survivor', description: 'Title for each Nubbin that lived through toddler playtime at Sunnyside.' },
    ],
    sets: { 'mv-ts09': true },
    notes:
      'Opens the third film. Time skip: show Andy’s room aged up (posters, laptop) and the toys dustier. Woody’s visit to Bonnie’s house happens off-screen between steps 2 and 3; he reports it. Lotso is warm and grandfatherly until the plan scene; give him a slow, friendly drawl and a strawberry-pink particle when he talks. The toddlers are a cheerful, chaotic hazard, never sinister. `mv-ts-break` picks which mini-objective the player runs in TS10 step 1. `mv-ts-sunnyside` (stayed/argued, added in review) is the Keeper’s side in the Woody–Jessie split; either way the Keeper stays at Sunnyside. Plush rule (0-based): mv-ts09-college line 7 and mv-ts09-complete line 3 drop without the Q12 plush.',
  },

  // ------------------------------------------------------------------ TS10
  {
    id: 'mv-ts10',
    code: 'TS10',
    title: 'The Incinerator',
    source: 'Toy Story 3 (Pixar, 2010): the break-out, the landfill and the furnace',
    audience: 'adult',
    trigger: { where: GATE, when: 'After TS9, Sunnyside' },
    requires: ['TS9'],
    speakers: [WOODY, BUZZ, JESSIE, LOTSO, REX, ALIENS, POTATO],
    steps: [
      {
        id: 'mv-ts10-s1',
        goal: 'Break out of Sunnyside past Lotso’s guards.',
        hint: 'Stealth. The monkey’s screens go dark once Woody and Slinky are in; move then, not before.',
        check: 'expedition:complete:mv-ts-sunnyside-breakout:stealth',
        scene: {
          id: 'mv-ts10-break',
          lines: [
            N('The break-out starts at midnight. Woody and Slinky slip into the office, where the cymbal monkey watches the screens.'),
            N('Barbie keeps Ken busy. Buzz gets his switch flipped back, but too far, and wakes up a hero who speaks only Spanish.'),
            B('¡Señorita! ¿Está usted bien? ¡Nadie le hará daño mientras yo esté aquí!', 'happy'),
            JE('…I don’t know what he’s saying. But I like the way he’s saying it.', 'happy'),
            N('Over the playground, down the rubbish chute, into the big dumpster in the yard. Lotso and his gang are waiting on the lid.'),
            LO('Leaving? After everything I gave you? Room, board, children, for ever?', 'angry'),
            W('Daisy didn’t replace you because she stopped loving you. She lost you. That’s different.', 'angry'),
            LO('Replaced is replaced. There’s nothing different about it.', 'angry'),
            N('Big Baby, Lotso’s huge, silent enforcer, looks at Lotso for a long time. Then he lifts him and drops him into the dumpster.'),
            N('A bin lorry’s lights sweep the yard. As the dumpster tips, Lotso grabs Woody’s leg, and everyone goes in.'),
          ],
          choices: [
            {
              id: 'grab',
              label: 'Grab Woody’s hand as he goes over.',
              set: { 'mv-ts-dumpster': 'grabbed' },
              then: [
                N('You catch him, which only means you go into the lorry with him. You don’t let go.'),
              ],
            },
            {
              id: 'clear',
              label: 'Throw your Nubbins clear, then jump in after Woody.',
              set: { 'mv-ts-dumpster': 'nubbins-clear' },
              then: [
                N('You throw them clear. They climb straight back in after you, of course.'),
              ],
            },
          ],
        },
        done: {
          id: 'mv-ts10-break-done',
          lines: [
            N('The lorry’s compactor crunches down. Something heavy lands on Buzz, and when he sits up he speaks English again and knows everyone.'),
            B('Why am I covered in coffee grounds? And why is Jessie holding my hand?', 'think'),
            JE('Don’t worry about it, Space Ranger.', 'happy'),
          ],
        },
      },
      {
        id: 'mv-ts10-s2',
        goal: 'Cross the landfill with the others.',
        hint: 'A race where stuffing helps: the big magnet can’t lift your Nubbins, so let them lead the line.',
        check: 'race:finish:mv-ts-landfill',
        scene: {
          id: 'mv-ts10-landfill',
          lines: [
            N('Dawn at the landfill. Gulls overhead, a smell like every bin in the world, and machines the size of houses grinding the heaps.'),
            N('The toys cross the dump in a line, holding on to each other. Lotso limps along behind, as if he were one of them.'),
            N('A shredder. Then a giant magnet that snatches everything metal, Buzz included, and Woody, holding on to Buzz.'),
            N('Your Nubbins have no metal in them anywhere. For once, being made of stuffing is a superpower.'),
            N('Then everyone tips down a chute onto a long conveyor belt, moving towards a bright orange glow.'),
            N('Beside the belt there is a ladder, and at the top of the ladder a big red emergency stop button.'),
            LO('Help me up! Help me, and I’ll stop it! I swear it on my stitching!', 'shock'),
            N('Woody and Buzz boost him up the ladder. He reaches the button, and stops, and looks down at them.'),
            LO('You lot believe in kids. Let’s see your kids save you now.', 'angry'),
            N('He runs. The belt keeps moving, and everything keeps moving.'),
          ],
        },
        done: {
          id: 'mv-ts10-landfill-done',
          lines: [
            N('There’s no way off the belt. Every toy tries anyway: scrabbling, climbing, sliding back.'),
          ],
        },
      },
      {
        id: 'mv-ts10-s3',
        goal: 'Hold on to them.',
        hint: 'Hold the button and don’t let go. Nothing else you press will help.',
        check: 'hold:mv-ts-hands',
        scene: {
          id: 'mv-ts10-furnace',
          lines: [
            N('The belt drops you into a wide pit. At the bottom the furnace door is open, and inside there is nothing but fire.'),
            N('The toys scramble up the slope of rubbish, and it slides, and they slide. Every handhold comes away.'),
            RX('Buzz? Buzz, what do we do?', 'shock'),
            N('Buzz looks at the fire. Then he looks at Jessie, and holds out his hand.'),
            N('Jessie takes it, and Slinky takes hers. Hamm takes Slinky’s paw, Rex takes Hamm, and the Potato Heads take each other.'),
            N('Woody is the last one still climbing. He looks up at the light at the top of the pit, and then back down at them.'),
            N('He takes Buzz’s hand.'),
            N('Your Nubbins are beside you, and they take your fingers, one on each side.'),
            N('Your plush Nubbin takes Woody’s other hand.'),
            N('Nobody says anything. There is nothing left to say.'),
            N('The heat grows. The light turns everything white.'),
          ],
        },
        done: {
          id: 'mv-ts10-furnace-done',
          lines: [
            N('A shadow falls across the pit. A great metal claw comes down out of the sky and closes round all of you at once.'),
            N('It lifts you up out of the fire, over the edge, into cold grey morning air. You still haven’t let go of anyone.'),
            N('In the crane cab, three little green aliens are pulling the levers together, all nine eyes shining.'),
            AX('We have come. Today, we are the hand.', 'happy'),
          ],
        },
      },
    ],
    complete: {
      id: 'mv-ts10-complete',
      lines: [
        N('The claw sets you down on the edge of the landfill, gently, the way it sets down prizes.'),
        AX('You took us from the machine, long ago. Now we take you. The debt is clean.', 'soft'),
        PH('My boys. My little boys. Who taught you to drive a crane?', 'happy'),
        N('Nobody can stop shaking. Jessie still has Buzz’s hand, and she doesn’t give it back.'),
        N('Woody lets go of your plush Nubbin last, one stitched finger at a time.'),
        W('Okay. Okay. Let’s go home.', 'soft'),
        N('Far behind you, a bin lorry driver finds a pink bear and ties him to the front grille with his other finds. He won’t be getting down.'),
        N('Your Nubbins don’t let go of your hands for the rest of the day. You don’t ask them to.'),
      ],
    },
    rewards: [
      { id: 'mv-ts10-title', kind: 'title', label: 'Held On', description: 'Title for each Nubbin that held your hand at the furnace. It never comes off the stat sheet.' },
      { id: 'mv-ts10-claw', kind: 'decor', label: 'Little Green Claw', description: 'A toy crane the aliens built from landfill scraps. Nubbins use it to lift each other gently onto high places.' },
    ],
    sets: { 'mv-ts10': true },
    notes:
      'The line’s hardest scene; play the furnace completely straight. Staging for mv-ts10-furnace: no music from line 3 (Buzz holding out his hand, 0-based) onward, only furnace roar, slowly rising. Each “takes a hand” line shows the hands joining in close-up. The step check `hold:mv-ts-hands` is a single held input: the player holds the button and keeps holding through the remaining lines and the white-out (about 8 seconds); mashing or the struggle inputs from the previous step do nothing at all. If the player lets go, the Nubbin portraits simply reach for the Keeper again and the hold restarts. No fail state. The white-out cuts straight to the claw’s shadow. Plush rule (0-based): mv-ts10-furnace line 8 and mv-ts10-complete line 4 drop without the Q12 plush. Lotso’s fate is told, not shown. Buzz’s Spanish lines are original; have them checked by a Spanish speaker.',
  },

  // ------------------------------------------------------------------ TS11
  {
    id: 'mv-ts11',
    code: 'TS11',
    title: 'Bonnie',
    source: 'Toy Story 3 (Pixar, 2010): the note and the hand-over',
    audience: 'adult',
    trigger: { where: GATE, when: 'After TS10, The Incinerator' },
    requires: ['TS10'],
    speakers: [WOODY, BUZZ, ANDY, MUM, BONNIE, PLUSH],
    steps: [
      {
        id: 'mv-ts11-s1',
        goal: 'Get the toys and Woody’s note into the attic box before Andy comes back upstairs.',
        hint: 'A short stealth run across the landing. Andy’s mum is in the doorway, so go round behind the laundry basket.',
        check: 'expedition:complete:mv-ts-attic-box:stealth',
        scene: {
          id: 'mv-ts11-note',
          lines: [
            N('A bin lorry brings you home. The driver doesn’t notice a few extra toys on his back step, and the toys don’t mention it.'),
            N('College day, and the car is nearly packed. Andy’s mum stands in his empty bedroom and can’t quite make herself leave it.'),
            MU('It’s so quiet in here already. How is it already quiet?', 'sad'),
            AN('Mum. It’s college. It’s not the moon.', 'soft'),
            N('Woody is in the college box; the others are in the attic box beside it. Woody looks from one to the other for a long time.'),
            W('He wants to take me. He does. And I’ll sit on a shelf in a dorm and watch him have a whole life.', 'think'),
            W('Or…'),
            N('He takes a pen and a sticky note from Andy’s desk, writes an address, and sticks it on the attic box. Bonnie’s address.'),
          ],
          choices: [
            {
              id: 'go',
              label: 'Tell Woody to go with Andy. He earned it.',
              set: { 'mv-ts-note': 'go' },
              then: [
                W('I did. Didn’t I. I earned it.', 'soft'),
                N('He looks at the box with the others in it. He doesn’t take his hand off the note.'),
              ],
            },
            {
              id: 'together',
              label: 'Tell Woody his place is with the others.',
              set: { 'mv-ts-note': 'together' },
              then: [
                W('Yeah. I think so too. I just needed somebody to say it.', 'sad'),
              ],
            },
            {
              id: 'held',
              label: 'Say nothing. Hold his hand.',
              set: { 'mv-ts-note': 'held' },
              then: [
                N('You take his hand, the way you did over the fire. He squeezes once.'),
              ],
            },
          ],
        },
        done: {
          id: 'mv-ts11-note-done',
          lines: [
            N('Andy comes up the stairs, sees the note and frowns. He doesn’t remember writing it, but it’s exactly his kind of idea.'),
            AN('Huh. Yeah. Okay. Yeah.', 'think'),
          ],
        },
      },
      {
        id: 'mv-ts11-s2',
        goal: 'Stay perfectly still while Andy hands you over.',
        hint: 'Humans are watching the whole time. Hold still, even when it’s hard.',
        check: 'freeze:mv-ts-handover',
        scene: {
          id: 'mv-ts11-bonnie',
          lines: [
            N('Andy drives across town to a small house with a porch. A little girl in the front yard is talking to a stuffed unicorn.'),
            AN('Hi. Are you Bonnie? I’ve got some toys. They need somebody who’ll really play with them.', 'soft'),
            N('He takes them out of the box one at a time, and says something about each.'),
            AN('This is Jessie. Bravest cowgirl going. She hates being shut in boxes, so don’t.'),
            AN('This is Rex. Most terrifying dinosaur ever made. Don’t tell him, but he isn’t terrifying at all.'),
            AN('These guys just turned up one day. I never figured out where from. They’re soft. They’re good.'),
            N('That’s your Nubbins. Bonnie takes them both at once and hugs them hard enough to squeak.'),
            AN('And this plush one never moves. Ever. But I always kind of thought it was listening.', 'soft'),
            N('At the bottom of the box, Andy finds Woody, who isn’t supposed to be there. He picks him up and goes completely still.'),
            BN('That’s the sheriff! The sheriff from my bag!', 'happy'),
            N('She reaches for him, and Andy pulls his hand back, just an inch. Then he kneels down and holds Woody out to her.'),
          ],
        },
      },
      {
        id: 'mv-ts11-s3',
        goal: 'Play with Andy and Bonnie one last time.',
        hint: 'Free play. There is no score. Play until the sun goes down.',
        check: 'play:mv-ts-last-afternoon',
        scene: {
          id: 'mv-ts11-play',
          lines: [
            AN('He’s Woody. He’s been mine since before I could say his name. I used to call him Wuh.', 'soft'),
            AN('He looks after everybody. Doesn’t matter what happens, he’s there. So you have to look after him back. Okay?', 'soft'),
            BN('Okay. I promise.', 'soft'),
            N('And then, instead of driving off, Andy sits down on the grass. Bonnie looks at him, and he looks at the toys.'),
            AN('…Okay. Show me how you play cowboys.', 'happy'),
            N('So they play, all afternoon: a bank robbery, a runaway train, a dinosaur rampage, a mission to space, a rodeo.'),
            N('Your Nubbins are the townsfolk, then the aliens, then the gold in the bank. Andy flies Buzz over the porch, and Bonnie makes Woody save everyone.'),
            N('Andy laughs like he hasn’t in years. Woody, flying through the air in Andy’s hand, can’t laugh back, though he wants to more than anything.'),
            N('The sun goes orange, and Bonnie’s mum calls her in for dinner. Andy gets up and brushes the grass off his jeans.'),
          ],
        },
        done: {
          id: 'mv-ts11-play-done',
          lines: [
            N('Bonnie picks Woody up and waves his arm at Andy. Andy waves back, and walks to his car.'),
          ],
        },
      },
    ],
    complete: {
      id: 'mv-ts11-complete',
      lines: [
        N('Andy sits in the car for a moment with both hands on the wheel, looking at the porch.'),
        N('Then he drives away. Down the street, round the corner, gone.'),
        N('Bonnie goes in for dinner and leaves the toys on the porch step in a row, the way children do.'),
        N('When the door shuts, Woody sits up. He watches the corner where the car went, and doesn’t say anything for a long time.'),
        W('…Look after yourself, kid.', 'soft'),
        N('Buzz puts a hand on his shoulder, and Jessie leans on his other side.'),
        N('Your plush Nubbin climbs into his lap and stays there.'),
        N('Nobody tells Woody it will be all right. They just sit on the step with him until the streetlights come on.'),
        N('In the morning Bonnie draws all her new toys, your Nubbins included, and gives you the picture. Everybody is labelled wrong, and it is perfect.'),
      ],
    },
    rewards: [
      { id: 'mv-ts11-drawing', kind: 'decor', label: 'Bonnie’s Drawing', description: 'A crayon drawing of Bonnie’s new toys, your Nubbins included, every name wrong. Hangs on any Grove wall.' },
      { id: 'mv-ts11-title', kind: 'title', label: 'Passed On', description: 'Keeper title for the afternoon on Bonnie’s lawn. Shown on the Keeper card.' },
    ],
    sets: { 'mv-ts11': true },
    notes:
      'The line’s second devastating scene; play it gently and let it breathe. `freeze:mv-ts-handover` is a stillness check: the player must not move or press anything while Andy hands each toy over (about 30 seconds of lines); any input makes the Keeper twitch and the line repeats, no fail state. `play:mv-ts-last-afternoon` is free play in Bonnie’s yard with toy props (bank, train, rodeo barrel); it ends when the sun sets (about 90 seconds) whatever the player does. Andy’s car leaving: hold on the empty corner for 3 seconds before Woody’s line. The plush Nubbin stays in Bonnie’s room from here on (E5 relies on it). Plush rule (0-based): mv-ts11-bonnie line 7 and mv-ts11-complete line 6 drop without the Q12 plush. Ends the third film.',
  },

  // ------------------------------------------------------------------ TS12
  {
    id: 'mv-ts12',
    code: 'TS12',
    title: 'Forky',
    source: 'Toy Story 4 (Pixar, 2019): Forky, the road trip, the antique store and Bo Peep',
    audience: 'adult',
    trigger: { where: GATE, when: 'After TS11, Bonnie' },
    requires: ['TS11'],
    speakers: [WOODY, DOLLY, FORKY, GABBY, BO, GIGGLE],
    steps: [
      {
        id: 'mv-ts12-s1',
        goal: 'Keep Forky out of the bin until morning.',
        hint: 'An escort game. He heads for anything with a lid; your fastest Nubbin intercepts.',
        check: 'escort:mv-ts-forky:no-bin',
        scene: {
          id: 'mv-ts12-forky',
          lines: [
            N('Bonnie’s room, a year later. At playtime Bonnie unpins the star from Woody’s vest and pins it on Jessie. Sheriff Jessie rides out.'),
            N('Woody spends the afternoon in the closet with the other left-out toys. One of them has started a calendar.'),
            W('It’s fine. It’s good. Jessie looks great in it. She does. It’s the right size and everything.', 'sad'),
            DO('Woody, I know how Andy’s room worked, but this isn’t Andy’s room. Bonnie does things her own way.', 'think'),
            N('Kindergarten orientation day. Bonnie is scared to go, so Woody sneaks into her backpack to watch over her.'),
            N('Alone at her table, Bonnie makes a friend out of the bin: a plastic spork, pipe-cleaner arms, googly eyes and lolly-stick feet. She writes her name on the feet.'),
            N('That night, in Bonnie’s room, the spork sits up.'),
            FO('Hello. Hi. What am I? Why am I? Where is the bin?', 'shock'),
            W('You’re a toy. Bonnie made you. She loves you.', 'happy'),
            FO('I’m a spork. I go in a mouth once and then I’m finished. The bin is where finished things go. Excuse me.', 'think'),
            N('He walks straight to the wastepaper basket and dives in headfirst. Woody pulls him out, and he dives in again.'),
            W('Every night. I’m going to be doing this every night, aren’t I?', 'sad'),
          ],
          choices: [
            {
              id: 'guard',
              label: 'Take the first shift guarding the bin.',
              set: { 'mv-ts-forky': 'guard' },
              then: [
                N('Forky tries eleven times. Your Nubbins sit in the bin and politely hand him back each time.'),
                FO('This bin is full of soft things. It’s very confusing.', 'think'),
              ],
            },
            {
              id: 'explain',
              label: 'Try to explain to Forky what a toy is.',
              set: { 'mv-ts-forky': 'explain' },
              then: [
                Y('A toy is for a kid. Bonnie is your kid.'),
                FO('Is a kid like a bin? It sounds like a bin.', 'think'),
              ],
            },
          ],
        },
        done: {
          id: 'mv-ts12-forky-done',
          lines: [
            N('By sunrise Forky is asleep in Bonnie’s hand, and Woody is asleep on the floor beside the bin.'),
            N('Bonnie’s family is going on a road trip in a rented camper van. Forky is coming, and so is everyone.'),
          ],
        },
      },
      {
        id: 'mv-ts12-s2',
        goal: 'Walk Forky back to the town where Bonnie’s family is staying.',
        hint: 'A night expedition along the verge. Stay out of headlights, and watch Forky near bins.',
        check: 'expedition:complete:mv-ts-roadside-night',
        scene: {
          id: 'mv-ts12-road',
          lines: [
            N('The camper van rattles down the highway. Forky spots an open window and jumps out of it, cheerfully, at sixty miles an hour.'),
            W('Tell Buzz to keep everyone together. I’ll get him and meet you at the campsite.', 'angry'),
            N('Woody jumps after him. Before you can think about it, you and your Nubbins have jumped too.'),
            N('A long walk in the dark beside the road. Forky waddles ahead, looking for bins, and finding several.'),
            FO('Why do you keep getting me back? What is a Bonnie, anyway?', 'think'),
            W('She’s… she’s why we’re here. When she’s sad, you’re there. When she’s scared, you hold on. That’s the job.', 'soft'),
            W('I had a kid before. Andy. Best years I ever had. I’d do every one of them again.', 'soft'),
            FO('So it’s like a bin. But warm. And the bin loves you back.', 'think'),
            W('…Yeah. Sure. That’s close enough.', 'happy'),
            N('Forky stops. He looks at the name written on his feet, and something clicks, like a lid going on properly.'),
            FO('I’m Bonnie’s. I’m Bonnie’s! I have to get back to her right now!', 'happy'),
          ],
          choices: [
            {
              id: 'andy',
              label: 'Ask Woody more about Andy.',
              set: { 'mv-ts-walk': 'andy' },
              then: [
                W('He used to send me down the stairs on a tray so I’d go faster. I loved it. Don’t tell Bonnie.', 'happy'),
              ],
            },
            {
              id: 'forky',
              label: 'Ask Forky what he remembers about being a spork.',
              set: { 'mv-ts-walk': 'forky' },
              then: [
                FO('A tray. A light. A lot of beans. I didn’t enjoy it.', 'think'),
              ],
            },
          ],
        },
        done: {
          id: 'mv-ts12-road-done',
          lines: [
            N('By morning you reach the town. A carnival is going up in the square, and beside it is a shop called Second Chance Antiques.'),
            N('In its window stands a lamp. Woody knows it at once: it used to be in Andy’s sister’s room, with a shepherdess on top.'),
            W('Bo.', 'shock'),
          ],
        },
      },
      {
        id: 'mv-ts12-s3',
        goal: 'Get out of Second Chance Antiques before the dummies catch you.',
        hint: 'Stealth among the shelves. The dummies can’t see you behind glass.',
        check: 'expedition:complete:mv-ts-antique-store:stealth',
        scene: {
          id: 'mv-ts12-antique',
          lines: [
            N('Second Chance Antiques is cool and dim and smells of dust and furniture polish. Every shelf is a hiding place.'),
            N('A doll in a yellow dress rolls up in a pram pushed by a ventriloquist’s dummy. Three more dummies stand behind her, perfectly still.'),
            GA('Hello there! Aren’t you a handsome old thing. Gabby Gabby, pleased to meet you. And who’s this little utensil?', 'happy'),
            FO('I’m Forky. I belong to Bonnie. I only recently found out.', 'happy'),
            GA('How lovely. Woody, would you mind awfully if I asked about your pull-string? What’s on the other end of it?', 'think'),
            N('Woody’s pull-string says something bright and Western, the way it always has. Gabby’s eyes go soft and hungry at once.'),
            GA('Mine came broken from the factory. Nobody has ever wanted me. One little part is all it would take.', 'sad'),
            N('The dummies move, and one grabs Forky. The others come for Woody, and your Nubbins get between them.'),
            W('Run! Forky, I’ll come back for you! I promise!', 'shock'),
          ],
          choices: [
            {
              id: 'fight',
              label: 'Stand and fight the dummies so Woody can grab Forky.',
              set: { 'mv-ts-antique': 'fought' },
              then: [
                N('Your Nubbins knock one dummy flat. Two more step up in his place, slowly, without a sound.'),
                W('Too many! Out, out, out!', 'shock'),
              ],
            },
            {
              id: 'flee',
              label: 'Grab Woody and run. Come back with a plan.',
              set: { 'mv-ts-antique': 'fled' },
              then: [
                W('I hate this. I hate this. You’re right.', 'angry'),
              ],
            },
          ],
        },
        done: {
          id: 'mv-ts12-antique-done',
          lines: [
            N('You, Woody and your Nubbins tumble out through the letterbox into the street. Forky stays behind, in Gabby’s cabinet.'),
            W('I told Bonnie I’d look after him. Well, I told nobody, but I meant it. It’s the one job I’ve got left.', 'sad'),
            N('Through the glass, Forky waves cheerfully from between two dummies. He has not yet learned that he ought to be scared.'),
          ],
        },
      },
    ],
    complete: {
      id: 'mv-ts12-complete',
      lines: [
        N('In the playground across the street, Woody sits on a bench, shaking. Then a shepherd’s crook hooks him round the neck.'),
        BP('Well, would you look at that. Sheriff Woody. You lost?', 'happy'),
        N('It’s Bo Peep, with no skirt now: a cape, a crook she swings like a quarterstaff, and one sheep with three heads, all wagging at your Nubbins.'),
        W('Bo! You’re… you’re lost! Are you lost? Do you need help?', 'shock'),
        BP('I’ve been lost for years, Woody. Best thing that ever happened to me. No kid, no shelf. The whole world’s my room.', 'happy'),
        N('A tiny police officer pops out of Bo’s pocket: Giggle McDimples, an inch high and in charge.'),
        GI('Bo’s told me all about you. You’re shorter than she said.', 'happy'),
        BP('There’s a stuntman at the carnival who owes me a favour. Duke Caboom. If you want your spork back, we’ll need him.', 'think'),
        BP('One question first, Sheriff. When did your kid last pick you? Not the spork. You.', 'soft'),
        N('Woody opens his mouth and doesn’t answer. Bo gives you a scrap of her old pink skirt for a scarf. She doesn’t wear it now, but it’s still good.'),
      ],
    },
    rewards: [
      { id: 'mv-ts12-scarf', kind: 'cosmetic', label: 'Shepherdess Scarf', description: 'A scrap of Bo Peep’s old pink skirt, worn as a scarf by any Nubbin.' },
      { id: 'mv-ts12-title', kind: 'title', label: 'Lost and Found', description: 'Keeper title for following Woody from Andy’s room to the antique store.' },
      { id: 'mv-ts12-line', kind: 'flag', label: 'Toy Story Line Complete', description: 'Completes the Toy Story line (TS1–TS12). Opens So Long, Partner (E5).' },
    ],
    sets: { 'mv-ts12': true, 'mv-ts-complete': true },
    notes:
      'Completes the line and hands straight into E5 (the carnival): Forky is still in Gabby’s cabinet, Woody still has his voice box, Duke Caboom is named but not met. Gabby Gabby is not a villain in E5, so keep her lonely rather than evil; the Benson dummies are the scary part (stiff, silent, sudden). Giggle McDimples is tiny: draw her portrait at a smaller scale. Bo’s sheep are one three-headed toy (Billy, Goat and Gruff in the source; no need to name them). Buzz is with Bonnie’s family off-screen in this storyline; his voice-button “inner voice” begins in E5. Bonnie’s closet is where Woody now spends playtime; Dolly leads Bonnie’s toys. Bonnie pinning Woody’s star on Jessie is from the film’s opening; the closet calendar is ours. Bo’s question at the end (when did your kid last pick you?) is deliberately left unanswered: E5 answers it.',
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

/** The TS1 recon choice (mv-ts-recon) paid off in TS4, TS8 and TS9. */
export const MV_TOYSTORY_VARIANTS: Scene[] = [
  // TS4: how the Nubbins step up for the rule-break.
  payoff(MV_TOYSTORY, 'mv-ts04-crate', 'nubbins', 9, 0, [
    N('They do it in step, three abreast, the way Sarge drilled them on the stairs. It is the most military thing a plush has ever done.'),
    W('Sarge trained them? Great. Nobody ever tell Sarge.', 'think'),
  ]),
  payoff(MV_TOYSTORY, 'mv-ts04-crate', 'monitor', 9, 0, [
    W('You kept the monitor steady at the party when Rex couldn’t. Keep this steady too. Nobody moves till I say.', 'soft'),
    N('Your Nubbins freeze mid-step, exactly as told. One of them is still wobbling slightly, but it is trying.'),
  ]),
  // TS8: how they work the horn in the chase.
  payoff(MV_TOYSTORY, 'mv-ts08-truck', 'nubbins', 5, 0, [
    N('Your Nubbins take the horn the way Sarge taught them to take a hill: on the count, all together, no retreat.'),
    HA('Who gave the plushes a drill sergeant? No, don’t tell me. I know exactly who.'),
  ]),
  payoff(MV_TOYSTORY, 'mv-ts08-truck', 'monitor', 5, 0, [
    N('Your Nubbins listen for Al’s car the way they listened at the party, heads tilted, and point before anyone sees it.'),
    HA('The plushes have ears now? Fine. Left at the plushes.'),
  ]),
  // TS9: which job Woody gives you in the break-out, before the choice.
  payoff(MV_TOYSTORY, 'mv-ts09-plan', 'nubbins', 8, 0, [
    W('Keeper. Your Nubbins went over the stairs with Sarge’s men once. The wall here is higher, and there’s a monkey watching it.', 'think'),
    W('I need them to do it anyway. Quietly this time.'),
  ]),
  payoff(MV_TOYSTORY, 'mv-ts09-plan', 'monitor', 8, 0, [
    W('Keeper. You worked a baby monitor at a party once. That monkey in the office has six screens and a cymbal. Same idea, more noise.', 'think'),
    W('If you can keep a channel open, we’ll know every move Lotso makes before he makes it.'),
  ]),
];

// ------------------------------------------------------------------ checks

export const CHECKS: string[] = [
  'expedition:complete:mv-ts-birthday-recon:stealth',
  'race:finish:mv-ts-bedroom-flight',
  'expedition:complete:mv-ts-backpack-dash:stealth',
  'race:win:mv-ts-pizza-truck',
  'expedition:complete:mv-ts-claw-machine',
  'expedition:complete:mv-ts-sids-hallway:stealth',
  'expedition:complete:mv-ts-stairwell',
  'craft:mv-ts-buzz-arm',
  'expedition:complete:mv-ts-backyard-ambush',
  'race:win:mv-ts-moving-van',
  'talk:ts-wheezy',
  'expedition:complete:mv-ts-yard-sale:stealth',
  'race:finish:mv-ts-chase-al:run',
  'race:finish:mv-ts-traffic-cones',
  'expedition:complete:mv-ts-toy-barn',
  'talk:ts-roundup-gang',
  'expedition:complete:mv-ts-cleaners-bench:stealth',
  'talk:ts-woody:after-emily',
  'race:win:mv-ts-airport-run',
  'karate:win:mv-ts-prospector',
  'race:finish:mv-ts-runway:run',
  'expedition:complete:mv-ts-curbside',
  'karate:survive:mv-ts-caterpillar-room',
  'talk:ts-woody:break-out-plan',
  'expedition:complete:mv-ts-sunnyside-breakout:stealth',
  'race:finish:mv-ts-landfill',
  'hold:mv-ts-hands',
  'expedition:complete:mv-ts-attic-box:stealth',
  'freeze:mv-ts-handover',
  'play:mv-ts-last-afternoon',
  'escort:mv-ts-forky:no-bin',
  'expedition:complete:mv-ts-roadside-night',
  'expedition:complete:mv-ts-antique-store:stealth',
];
