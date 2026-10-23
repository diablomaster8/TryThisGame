/**
 * Multiverse campaign: the Doctor Doom and Fantastic Four line (FF1–FF10, plus the
 * Infamous Iron Man epilogue after Secret Wars) and the Ultron line (UL1–UL10).
 *
 * Audience 'adult' throughout: the Multiverse campaign is never offered in the
 * Learning Grove, so there are no childLines here.
 *
 * Every line of dialogue is original. Plots follow the source beats listed in
 * briefs/multiverse.md. Issue numbers in `source` are from the brief and should be
 * checked before ship.
 *
 * Flags set by choices are prefixed `mv-ff` or `mv-ul`. Cross-line unlocks are
 * expressed by the other line's `requires` (IM6 needs FF2, and so on); the rewards
 * here of kind 'flag' describe them for the journal.
 */
import type { Quest, Speaker } from './types';
import type { Line, Mood, Scene } from '../config/story';

// ------------------------------------------------------------------ helpers

/** Narrator line. */
const n = (text: string): Line => ({ who: 'narrator', text });
/** Spoken line, with an optional portrait mood. */
const l = (who: string, text: string, mood?: Mood): Line =>
  mood ? { who, text, mood } : { who, text };
/** A source character. */
const sp = (id: string, name: string, basedOn: string): Speaker => ({
  id,
  name,
  kind: 'other',
  basedOn,
});

const RIFT = 'The rift above the waterfall (Multiverse campaign)';

/** FF3: Galactus leaves, played after either Nullifier choice; the branch decides how. */
const FF3_FIRE: Line[] = [
  l('reed', 'This is your weapon, Galactus. Leave, or I find out what it does.'),
  l('galactus', 'You would. I see that in you. Then the answer is no, and I will remember your face.'),
  l('galactus', 'I will go. But my herald stays. He has chosen these insects. Let him live among them.'),
];
const FF3_BLUFF: Line[] = [
  l('reed', 'This is your weapon, Galactus. Leave, or I find out what it does.'),
  l('galactus', 'You do not mean it. But I am not willing to be wrong. I will go.'),
  l('galactus', 'My herald stays. He has chosen these insects. Let him live among them.'),
  l('johnny', 'He bought it. Reed, he bought it. Never do that again.', 'shock'),
];
const FF3_TAIL: Line[] = [
  n('A shimmer falls around the whole Earth, invisible and final. The Surfer is on the inside of it.'),
  l('surfer', 'I may never leave. I find I mind it less than I thought.', 'sad'),
  l('alicia', 'Then come and sit for a statue. I’ve wanted to sculpt you since you landed.', 'soft'),
  n('Your Nubbin keeps a chip of silver it found on the roof. It shines whenever you are sad.'),
];

// ------------------------------------------------------------------ speakers

const REED = sp('reed', 'Reed Richards', 'Reed Richards, Mister Fantastic (Marvel Comics)');
const SUE = sp('sue', 'Sue Storm', 'Susan Storm, the Invisible Woman (Marvel Comics)');
const JOHNNY = sp('johnny', 'Johnny Storm', 'Johnny Storm, the Human Torch (Marvel Comics)');
const BEN = sp('ben', 'Ben Grimm', 'Ben Grimm, the Thing (Marvel Comics)');
const DOOM = sp('doom', 'Victor von Doom', 'Victor von Doom, Doctor Doom (Marvel Comics)');
const MOLE = sp('moleman', 'The Mole Man', 'Harvey Elder, the Mole Man (Marvel Comics)');
const SURFER = sp('surfer', 'The Silver Surfer', 'Norrin Radd, the Silver Surfer (Marvel Comics)');
const GALACTUS = sp('galactus', 'Galactus', 'Galactus, Devourer of Worlds (Marvel Comics)');
const WATCHER = sp('watcher', 'Uatu the Watcher', 'Uatu the Watcher (Marvel Comics)');
const ALICIA = sp('alicia', 'Alicia Masters', 'Alicia Masters (Marvel Comics)');
const YOUNG_VICTOR = sp('victor', 'Young Victor', 'Victor von Doom as a boy (Fantastic Four Annual #2)');
const WERNER = sp('werner', 'Werner von Doom', 'Werner von Doom, Victor’s father (Marvel Comics)');
const ABBOT = sp('abbot', 'The Old Monk', 'The Tibetan monks who forged Doom’s mask (Marvel Comics)');
const VALERIA_LOVE = sp('valeria', 'Valeria', 'Valeria, Doom’s first love (Fantastic Four vol. 3 #67)');
const FRANKLIN = sp('franklin', 'Franklin Richards', 'Franklin Richards (Marvel Comics)');
const VAL_KID = sp('val', 'Valeria Richards', 'Valeria Richards (Marvel Comics)');
const STRANGE = sp('strange', 'Doctor Strange', 'Stephen Strange, Doctor Strange (Marvel Comics)');
const MEPHISTO = sp('mephisto', 'Mephisto', 'Mephisto (Marvel Comics)');
const CYNTHIA = sp('cynthia', 'Cynthia von Doom', 'Cynthia von Doom, Doom’s mother (Marvel Comics)');
const KILLGRAVE = sp('killgrave', 'The Purple Man', 'Zebediah Killgrave, the Purple Man (Marvel Comics)');
const CAP = sp('cap', 'Captain America', 'Steve Rogers, Captain America (Marvel Comics)');
const ANNIHILUS = sp('annihilus', 'Annihilus', 'Annihilus (Marvel Comics)');
const TCHALLA = sp('tchalla', 'T’Challa', 'T’Challa, Black Panther (Marvel Comics)');
const SHURI = sp('shuri', 'Shuri', 'Shuri, Black Panther during Doomwar (Marvel Comics)');
const STORM = sp('storm', 'Storm', 'Ororo Munroe, Storm (Marvel Comics)');
const HILL = sp('hill', 'Maria Hill', 'Maria Hill (Marvel Comics)');

const ULTRON = sp('ultron', 'Ultron', 'Ultron (Marvel Comics)');
const HANK = sp('hank', 'Hank Pym', 'Hank Pym, Goliath / Yellowjacket (Marvel Comics)');
const JAN = sp('jan', 'Janet van Dyne', 'Janet van Dyne, the Wasp (Marvel Comics)');
const JARVIS = sp('jarvis', 'Edwin Jarvis', 'Edwin Jarvis, the Avengers’ butler (Marvel Comics)');
const CLINT = sp('clint', 'Clint Barton', 'Clint Barton, Hawkeye (Marvel Comics)');
const PANTHER = sp('panther', 'T’Challa', 'T’Challa, Black Panther (Marvel Comics)');
const VISION = sp('vision', 'The Vision', 'The Vision (Marvel Comics)');
const WONDER = sp('wonder', 'Wonder Man', 'Simon Williams, Wonder Man (Marvel Comics)');
const REAPER = sp('reaper', 'The Grim Reaper', 'Eric Williams, the Grim Reaper (Marvel Comics)');
const JOCASTA = sp('jocasta', 'Jocasta', 'Jocasta (Marvel Comics)');
const THOR = sp('thor', 'Thor', 'Thor (Marvel Comics)');
const TONY = sp('tony', 'Tony Stark', 'Tony Stark, Iron Man (Marvel Comics)');
const QUILL = sp('quill', 'Peter Quill', 'Peter Quill, Star-Lord (Marvel Comics)');
const ROCKET = sp('rocket', 'Rocket', 'Rocket Raccoon (Marvel Comics)');
const WARLOCK = sp('warlock', 'Adam Warlock', 'Adam Warlock (Marvel Comics)');
const CAROL = sp('carol', 'Carol Danvers', 'Carol Danvers, Ms. Marvel (Marvel Comics)');
const LOGAN = sp('logan', 'Logan', 'Logan, Wolverine (Marvel Comics)');
const NATASHA = sp('natasha', 'Natasha Romanoff', 'Natasha Romanoff, Black Widow (Marvel Comics)');

// =================================================================== DOOM / FF

export const MV_DOOM: Quest[] = [
  // ---------------------------------------------------------------- FF1
  {
    id: 'mv-ff01',
    code: 'FF1',
    title: 'Cosmic Rays',
    source: 'Fantastic Four #1',
    audience: 'adult',
    trigger: { where: RIFT, when: 'Multiverse campaign started; first storyline of the Doom line.' },
    speakers: [REED, SUE, JOHNNY, BEN, MOLE],
    steps: [
      {
        id: 'mv-ff01-s1',
        goal: 'Match each of your Nubbins to one of the four by its top stat.',
        hint: 'Power goes with Ben, Fly with Johnny, Stamina with Reed, and Swim or Run with Sue.',
        check: 'party:match:mv-ff-four',
        scene: {
          id: 'mv-ff01-launch',
          lines: [
            n('The rift drops you onto a windy airfield at night. A rocket stands on the pad, too tall and too new.'),
            l('reed', 'You came out of a hole in the sky. That’s either a miracle or a rounding error. Either way, welcome.', 'think'),
            l('ben', 'Reed, the shielding’s never been tested. I fly things. I like to know what I’m flying.', 'angry'),
            l('sue', 'If we wait for a permission slip, someone else gets there first. I’m going, Ben.'),
            l('johnny', 'Me too. Somebody on this crew has to look good in the photos.', 'happy'),
            l('ben', 'Fine. When this goes wrong, I want it written down that I said so.'),
            l('sue', 'Reed. The lab light.'),
            l('reed', 'We’ll be back in an hour. It’ll keep.'),
            n('Your Nubbins are already curled up in the cargo net. Nobody thinks to check it.'),
            n('Past the clouds, the hull starts to hum. Light comes through the metal as if it were glass.'),
            l('reed', 'Cosmic rays. The shielding isn’t holding. Ben, take us down. Now!', 'shock'),
            n('The landing is long and loud. Four people climb out into a field, and none of them is quite a person any more.'),
          ],
          choices: [
            {
              id: 'ben',
              label: 'Sit down next to Ben.',
              set: { 'mv-ff01-first': 'ben' },
              then: [
                n('Ben is orange rock from scalp to boots. Your Nubbin climbs onto his knee as if it were any other knee.'),
                l('ben', '…Huh. Least somebody round here isn’t scared of me.', 'sad'),
              ],
            },
            {
              id: 'reed',
              label: 'Help Reed take readings.',
              set: { 'mv-ff01-first': 'reed' },
              then: [
                l('reed', 'Your little ones are glowing too. Faintly. It’s fading already. Theirs, not ours.', 'think'),
                l('reed', 'Hold the clipboard, would you? My arm keeps going further than I mean it to.'),
              ],
            },
            {
              id: 'johnny',
              label: 'Pat out Johnny’s sleeves.',
              set: { 'mv-ff01-first': 'johnny' },
              then: [
                l('johnny', 'I’m on fire and it doesn’t hurt. Why doesn’t it hurt? Is that worse?', 'shock'),
                l('sue', 'Johnny, you’re standing in dry grass. Move.'),
              ],
            },
          ],
        },
        done: {
          id: 'mv-ff01-matched',
          lines: [
            n('Each of your Nubbins drifts to one of the four and stays there, like iron to a magnet.'),
            l('sue', 'They’ve picked sides. Good. Somebody had to.', 'soft'),
            l('reed', 'Then we’re not four. We’re four and a few. That changes the maths nicely.'),
          ],
        },
      },
      {
        id: 'mv-ff01-s2',
        goal: 'Beat the Mole Man’s giant in a karate bout on Monster Isle.',
        hint: 'The giant swings slowly and hits hard. A Run Nubbin can dodge; a Power Nubbin can stand its ground.',
        check: 'karate:win:mv-mole-giant',
        scene: {
          id: 'mv-ff01-isle',
          lines: [
            n('Weeks later. Atomic plants all over the world are sinking into the ground, one after another.'),
            l('reed', 'Every hole leads to the same island. Someone down there is collecting power stations.', 'think'),
            n('Monster Isle is grey rock and hot wind. The ground opens, and a little man in thick glasses rises out of it.'),
            l('moleman', 'Up here they laughed at my face. Down there, the creatures don’t laugh. They obey.', 'angry'),
            l('moleman', 'Your world is a lid on mine. I am lifting the lid.'),
            l('moleman', 'You, the rock one. You understand. They will stare at you on the street now. Come below. Nobody stares below.'),
            l('ben', 'Pal, you have no idea how tempting that is.', 'sad'),
            n('Behind him, something enormous climbs out of the crater. It has too many teeth and no patience.'),
            l('ben', 'But no. Let me guess. I’m the one who gets to punch it.'),
            l('johnny', 'You’re the one it’s looking at, Rocky.'),
            n('Your Nubbin steps out in front of Ben, small and absolutely certain.'),
          ],
        },
        done: {
          id: 'mv-ff01-giant-down',
          lines: [
            n('The giant topples back into the crater with a noise like a landslide.'),
            l('ben', 'Little guy hits harder than he looks. I like him.', 'happy'),
            l('moleman', 'You will regret this, all of you! The ground remembers!', 'angry'),
          ],
        },
      },
    ],
    complete: {
      id: 'mv-ff01-complete',
      lines: [
        n('Johnny seals the tunnel with a white-hot blast. The island folds in on the Mole Man’s kingdom.'),
        l('sue', 'He’ll dig his way out. Men like him always do.'),
        l('ben', 'Thing is, I get him. People stared, so he went where nobody could. I nearly said yes back there.', 'sad'),
        l('sue', 'You didn’t. That’s the whole difference, Ben. That’s all a hero is, some days.', 'soft'),
        l('johnny', 'We need a name. Something big. Something with a number in it.', 'happy'),
        l('reed', 'There are four of us. That part’s easy.'),
        l('ben', 'And the pebbles?'),
        l('sue', 'Nubbins, Ben. They have a name.'),
        l('ben', 'The pebbles have a name. I heard.'),
        l('reed', 'Honorary. The paperwork can catch up.', 'happy'),
        n('A faint blue shimmer stays on your Nubbins’ fur after the rift carries you home.'),
      ],
    },
    rewards: [
      {
        id: 'mv-ff01-glow',
        kind: 'cosmetic',
        label: 'Cosmic shimmer',
        description: 'A faint blue glow your Nubbins can wear in the Multiverse campaign.',
      },
      {
        id: 'mv-ff01-title',
        kind: 'title',
        label: 'Four and a Few',
        description: 'Keeper title: honorary member of the Fantastic Four.',
      },
    ],
    sets: { 'mv-ff01': true },
    notes:
      'First Doom-line storyline. Step 1 is a party screen check: each Nubbin in the party is assigned to Reed (Stamina), Sue (Swim or Run, whichever is higher), Johnny (Fly) or Ben (Power); with fewer than four Nubbins, unassigned members are shown as empty silhouettes. Rocket interior: hull goes translucent, blue light wash. Monster Isle bout: giant uses slow, heavy telegraphed attacks. Sound: low hum building through the launch. Check FF #1 beats before ship. ' +
      'SIGNATURE CHOICE: mv-ff01-first (ben | reed | johnny: who your Nubbin went to in the field) pays off through MV_DOOM_VARIANTS at mv-ff05-complete (what the four take from Doom’s making), mv-ff09-portal (Johnny’s last word to you) and mv-ffep-ben (what Ben throws at the new Doom).',
  },

  // ---------------------------------------------------------------- FF2
  {
    id: 'mv-ff02',
    code: 'FF2',
    title: 'Doom’s First Strike',
    source: 'Fantastic Four #5',
    audience: 'adult',
    trigger: { where: RIFT, when: 'After Cosmic Rays.' },
    requires: ['FF1'],
    speakers: [REED, SUE, JOHNNY, BEN, DOOM],
    steps: [
      {
        id: 'mv-ff02-s1',
        goal: 'Step onto Doom’s time platform with Reed, Ben and Johnny.',
        hint: 'Choose which Nubbin, if any, stays hidden with Sue before you go.',
        check: 'talk:mv-doom-platform',
        scene: {
          id: 'mv-ff02-siege',
          lines: [
            n('The Baxter Building goes dark all at once. Then a green cable net drops over the whole tower.'),
            l('johnny', 'Who nets a skyscraper? Who even owns that much net?', 'shock'),
            n('A figure in iron and a green hood stands on the roof opposite. Behind the mask, his eyes do not blink.'),
            l('doom', 'Richards. You will remember me from school. I have not forgotten you.'),
            l('doom', 'Your woman is my guest. She will remain my guest until you run an errand for me.', 'angry'),
            l('sue', 'Reed, don’t you dare do what he says!'),
            l('doom', 'Three centuries ago, a pirate buried a chest of gemstones. I want them. My platform will take you there.'),
            l('ben', 'And if we say no?'),
            l('doom', 'Then you will learn whether invisible women can still bruise.'),
            l('johnny', 'Can I just say, as the youngest: this guy is a lot. The cape, the net, the voice. It’s a lot.'),
            l('doom', 'Silence the boy, Richards, or Doom will.', 'angry'),
            n('Your Nubbins look at Sue, then at you. One of them is very good at not being seen.'),
          ],
          choices: [
            {
              id: 'stay',
              label: 'Leave your quietest Nubbin hidden with Sue.',
              set: { 'mv-ff02-sue-guard': true },
              then: [
                n('Your Nubbin tucks itself into the fold of Sue’s sleeve. She feels it, and says nothing.'),
                l('sue', 'Go. I’m not alone.', 'soft'),
              ],
            },
            {
              id: 'together',
              label: 'Keep both Nubbins with you.',
              set: { 'mv-ff02-sue-guard': false },
              then: [
                l('reed', 'We stay together. Sue can look after herself. She always has.'),
                l('sue', 'He’s right. Annoyingly.'),
              ],
            },
          ],
        },
        done: {
          id: 'mv-ff02-platform',
          lines: [
            n('The platform hums. The room peels away like old wallpaper.'),
            n('You arrive with salt in your mouth and a deck rolling under your feet.'),
          ],
        },
      },
      {
        id: 'mv-ff02-s2',
        goal: 'Find Blackbeard’s chest in the pirate cove.',
        hint: 'A Swim Nubbin dives faster; a Fly Nubbin spots the wreck from above.',
        check: 'expedition:clear:mv-blackbeard-cove',
        scene: {
          id: 'mv-ff02-pirates',
          lines: [
            n('A pirate ship in a bay of green water. The crew take one look at Ben and drop to their knees.'),
            l('ben', 'Why’re they bowing? Reed, why are they bowing?'),
            l('johnny', 'They think you’re a sea monster. Or a god. Honestly, same thing.', 'happy'),
            n('Somebody hands Ben a hat with a plume, and a coat that almost fits.'),
            l('ben', 'Captain Grimm. Don’t say it. I can see you thinking it.'),
            l('reed', 'The chest went down with a sister ship in this cove. We need it before Doom’s timer pulls us back.', 'think'),
            n('By sundown the crew are calling Ben by the name of the most feared pirate on the sea.'),
            l('ben', 'Y’know, nobody here’s laughing at the face. They’re scared of it, sure. But nobody’s laughing.', 'soft'),
            l('ben', 'What if I just… stayed? Captain Grimm. Ship, crew, ocean. Nobody here knows what I used to look like.', 'think'),
            n('Your Nubbin is already at the rail, staring at a dark shape under the water.'),
          ],
          choices: [
            {
              id: 'stay',
              label: 'Tell him he could. He’d be happy here, and that counts.',
              set: { 'mv-ff02-ben': 'tempted' },
              then: [
                l('ben', 'Yeah. I could.', 'soft'),
                l('ben', 'Then Sue’s stuck in a castle with a lunatic and the kid’s settin’ fire to things alone. Nah. Can’t.', 'sad'),
              ],
            },
            {
              id: 'home',
              label: 'Tell him Sue needs him. So does Johnny, though he’d never say it.',
              set: { 'mv-ff02-ben': 'home' },
              then: [
                l('ben', 'The kid? Need me? He’d sooner swallow his own flame.', 'happy'),
                l('ben', '…Yeah. He would. Fine. But I’m keepin’ the coat.'),
              ],
            },
          ],
        },
        done: {
          id: 'mv-ff02-chest',
          lines: [
            n('Your Nubbin surfaces with a rope in its mouth. On the other end is a chest covered in barnacles.'),
            l('reed', 'Gems. Old ones. Doom doesn’t want treasure. He wants whatever is inside the stones.', 'think'),
            n('Reed tips the gems back into the bay and fills the chest with ship’s chain. Your Nubbin helpfully sits on the lid.'),
            l('reed', 'He can have the chest. Just not what was in it.'),
            l('ben', 'That’s the most pirate thing you’ve ever done. I’m proud of you.', 'happy'),
          ],
        },
      },
      {
        id: 'mv-ff02-s3',
        goal: 'Get Sue out of Doom’s castle.',
        hint: 'Doom’s guards are machines: they move in patterns. Learn the pattern before you strike.',
        check: 'karate:win:mv-doom-sentries',
        scene: {
          id: 'mv-ff02-return',
          lines: [
            n('The platform drops you back into Doom’s hall. Ben’s pirate hat is still on his head.'),
            l('doom', 'The chest. Open it.'),
            n('Reed lifts the lid. Inside are coils of ship’s chain and nothing else.'),
            l('doom', 'You think a trick of packing will save you, Richards?', 'angry'),
            l('reed', 'I think the stones are at the bottom of a bay three hundred years ago. Where no one can use them.'),
            l('doom', 'At university you corrected my sums in front of the whole hall. You are still doing it.', 'angry'),
            l('reed', 'Victor, I was trying to help. I’m still trying to help.'),
            l('doom', 'That is precisely what I cannot forgive. Now you will watch your woman pay for your cleverness.'),
            n('Walls slide open. Armoured shapes step out, one after another, all moving in perfect step.'),
            l('sue', 'He’s forgotten one thing. He can’t lock up what he can’t see.'),
            n('The room shimmers. Sue is suddenly standing beside you, and the fight begins.'),
          ],
        },
        done: {
          id: 'mv-ff02-escape',
          lines: [
            n('The last sentry falls. Doom is already gone, a dark streak climbing over the rooftops.'),
            l('johnny', 'I can catch him!'),
            l('reed', 'Let him go. A man like that comes back. We’ll be ready.'),
          ],
        },
      },
    ],
    complete: {
      id: 'mv-ff02-complete',
      lines: [
        l('ben', 'You know what the worst part is? For two days there I was somebody. Even with this face.', 'sad'),
        l('sue', 'You’re somebody now, Ben. You were before the rocket too.', 'soft'),
        l('ben', 'Yeah, yeah. I’m keepin’ the hat.'),
        n('In the ruins of Doom’s hall, a smaller platform hums on its own, its dial set to a year with knights in it.'),
        l('reed', 'He built more than one. He’ll use them again. Somewhere, someone else will meet him.', 'think'),
      ],
    },
    rewards: [
      {
        id: 'mv-ff02-hat',
        kind: 'cosmetic',
        label: 'Captain Grimm’s hat',
        description: 'A plumed pirate hat, a bit big for a Nubbin. Ben insists.',
      },
      {
        id: 'mv-ff02-unlock-im6',
        kind: 'flag',
        label: 'Doom’s time platform',
        description: 'Opens Doomquest (IM6) in the Iron Man line.',
      },
    ],
    sets: { 'mv-ff02': true },
    notes:
      'If mv-ff02-sue-guard is true, step 3 begins with the hidden Nubbin already inside Doom’s hall and gives the player a free first hit in the bout; otherwise no change. Pirate era is a palette swap of the Lagoon expedition (green water, a sunken hull). Doom’s sentries are early, boxy robots, not later Doombots. Unlocks IM6 through IM6’s requires. Check FF #5 beats before ship (Doom’s escape route especially).',
  },

  // ---------------------------------------------------------------- FF3
  {
    id: 'mv-ff03',
    code: 'FF3',
    title: 'The Galactus Trilogy',
    source: 'Fantastic Four #48–50',
    audience: 'adult',
    trigger: { where: RIFT, when: 'After Doom’s First Strike. The sky over the Baxter Building is on fire.' },
    requires: ['FF2'],
    speakers: [REED, SUE, JOHNNY, BEN, WATCHER, SURFER, GALACTUS, ALICIA],
    steps: [
      {
        id: 'mv-ff03-s1',
        goal: 'Hear the Watcher out on the Baxter Building roof.',
        hint: 'Go up the stairs to the roof. Take a Fly Nubbin; you will need one soon.',
        check: 'talk:mv-watcher',
        scene: {
          id: 'mv-ff03-sky',
          lines: [
            n('The sky over the city is full of burning rock, as if someone is throwing the planet a party.'),
            l('johnny', 'That’s not weather. Weather doesn’t do that.'),
            n('A bald giant in a white robe is standing on the roof, as calm as a statue.'),
            l('watcher', 'I am sworn only to watch. I have broken that once tonight already, and I may break it again.', 'sad'),
            l('watcher', 'I hid your world from his herald. The herald found it anyway. Its master follows.'),
            n('A silver figure on a silver board drops out of the clouds and does not look at any of you.'),
            l('surfer', 'Be still. What comes is not cruel. He is hungry, as the tide is hungry.'),
            n('Something the size of a mountain stands up over the river. It begins to build a machine on the roof.'),
            l('galactus', 'This world will sustain me. Its people are a small matter.'),
            l('watcher', 'There is a weapon in his worldship that even he fears. One of you must fetch it. The fastest.'),
          ],
          choices: [
            {
              id: 'go',
              label: 'Send your Fly Nubbin with Johnny.',
              set: { 'mv-ff03-route': 'nubbin' },
              then: [
                l('johnny', 'Wings? Great. Try to keep up, pal.', 'happy'),
                n('Your Nubbin is already in the air, wings blurring, before Johnny finishes the sentence.'),
              ],
            },
            {
              id: 'ask',
              label: 'Ask the Watcher why he is helping.',
              set: { 'mv-ff03-route': 'asked' },
              then: [
                l('watcher', 'Because I have watched a thousand worlds end. I find I do not want to watch this one.', 'soft'),
                l('watcher', 'Now go. Your little one may fly with the boy.'),
              ],
            },
          ],
        },
        done: {
          id: 'mv-ff03-sendoff',
          lines: [
            n('The Watcher lifts a hand. Johnny and your Nubbin vanish in a flash of white.'),
            l('sue', 'Johnny’s nineteen. He’s nineteen.', 'sad'),
          ],
        },
      },
      {
        id: 'mv-ff03-s2',
        goal: 'Race Johnny’s route through Galactus’s worldship and back.',
        hint: 'A long Fly course with short Run sections. Stamina keeps your Nubbin going to the end.',
        check: 'race:finish:mv-worldship',
        scene: {
          id: 'mv-ff03-worldship',
          lines: [
            n('The worldship is bigger than a sky. Rooms the size of seas, corridors that fold into themselves.'),
            l('johnny', 'Okay. Okay. Don’t look down. There isn’t a down. Great.', 'shock'),
            n('Your Nubbin flies beside him, a tiny bright speck next to a bigger one.'),
            l('johnny', 'You’re not even scared, are you? What are you, nuts?'),
            n('Johnny’s flame gutters in the strange air. Your Nubbin leans in close until it catches again.'),
            l('johnny', 'Thanks. Don’t tell Ben I needed that.'),
            n('At the centre of the ship, on a plinth, sits a small grey rod. Even looking at it hurts.'),
            l('johnny', 'That’s it? That’s the thing a god is scared of?'),
            n('Your Nubbin pokes it. Every light on the worldship dims, slowly, like a sigh.'),
            l('johnny', 'Put it down. Put it down, put it down.', 'shock'),
            n('It puts it down. Then it pats it, to be sure.'),
            n('Then the ship notices you. The way back starts to close.'),
          ],
        },
        done: {
          id: 'mv-ff03-nullifier',
          lines: [
            n('You land back on the roof in a heap of smoke and feathers. Johnny holds the rod out with both hands.'),
            l('reed', 'Johnny. Give that to me. Slowly. And don’t point it at anything you love.', 'think'),
          ],
        },
      },
      {
        id: 'mv-ff03-s3',
        goal: 'Sit with Alicia while she talks to the Silver Surfer.',
        hint: 'Bring a Nubbin with high trust. The Surfer lets small things close before he lets people.',
        check: 'talk:mv-alicia-surfer',
        scene: {
          id: 'mv-ff03-alicia',
          lines: [
            n('The Surfer has fallen onto a rooftop across town, hurt in the fighting. Alicia Masters found him first.'),
            l('alicia', 'I can’t see you. So tell me what you are. Not what you do. What you are.', 'soft'),
            l('surfer', 'I was a man once, on a world far from here. I traded myself to save it. Now I find worlds for him.'),
            l('alicia', 'Then you’re finding this one. Do you know what’s on it? Do you want to know?'),
            n('Your Nubbin climbs onto the edge of the silver board, as if it has always ridden there.'),
            l('surfer', 'This small creature does not fear me.', 'think'),
            l('alicia', 'Most of us wouldn’t, if you gave us the chance.'),
            n('The Surfer looks at his hands for a long time. Then he looks up at Galactus.'),
          ],
          choices: [
            {
              id: 'worth',
              label: '“This world is worth saving. You know it is.”',
              set: { 'mv-ff03-surfer': 'friend' },
              then: [
                l('surfer', 'Yes. I did know. I had forgotten that I knew.', 'soft'),
              ],
            },
            {
              id: 'quiet',
              label: 'Say nothing. Let your Nubbin stay where it is.',
              set: { 'mv-ff03-surfer': 'quiet' },
              then: [
                n('Your Nubbin hums softly. The Surfer’s hand rests beside it on the board.'),
                l('surfer', 'Very well, little one. Very well.'),
              ],
            },
          ],
        },
        done: {
          id: 'mv-ff03-turn',
          lines: [
            n('The Surfer rises and flies straight at his master. It is not a fight he can win. He goes anyway.'),
            l('ben', 'Kid’s got guts. For a chrome ornament.'),
          ],
        },
      },
    ],
    complete: {
      id: 'mv-ff03-complete',
      lines: [
        n('Reed pulls you aside, the rod wrapped in a tablecloth. His hands are steady; his voice isn’t.'),
        l('reed', 'He’s coming back for his answer. I have to decide whether to use it. It might end him. It might end everything.', 'think'),
        l('reed', 'Sue says I shouldn’t carry this alone. So. If he calls my bluff, do I fire?'),
      ],
      choices: [
        {
          id: 'fire',
          label: 'Yes. Better a risk to everything than a certain end for this world.',
          set: { 'mv-ff03-nullifier': 'fire' },
          then: [
            l('reed', 'Then I have to mean it. He’ll know if I don’t.', 'sad'),
            ...FF3_FIRE,
            ...FF3_TAIL,
          ],
        },
        {
          id: 'bluff',
          label: 'No. Nobody gets to gamble the universe, not even to save us.',
          set: { 'mv-ff03-nullifier': 'bluff' },
          then: [
            l('reed', 'Then it’s a bluff, and I’ve never been any good at poker. Ben always wins. Wish me luck.', 'think'),
            ...FF3_BLUFF,
            ...FF3_TAIL,
          ],
        },
      ],
    },
    rewards: [
      {
        id: 'mv-ff03-shard',
        kind: 'item',
        label: 'Silver chip',
        description: 'A sliver from the Surfer’s board. It glows faintly when a Nubbin nearby is unhappy.',
      },
      {
        id: 'mv-ff03-title',
        kind: 'title',
        label: 'Herald’s Friend',
        description: 'Keeper title: you sat with the Silver Surfer when he turned.',
      },
    ],
    sets: { 'mv-ff03': true },
    notes:
      'Galactus is shown in silhouette against the sky: too big for the frame on purpose. Step 2 is a new Fly-heavy race course, "mv-worldship": long fly sections, two short run sections, no swim; Johnny races alongside as a pacer, not a rival. The Nullifier is never used; it only has to be held. The closing choice sets mv-ff03-nullifier (fire / bluff), the Keeper’s answer to Reed; Galactus leaves either way, with his own reply to each answer (FF3_FIRE: a chill; FF3_BLUFF: Johnny’s relief), then FF3_TAIL plays after both. The barrier around the Earth is set here and matters in FF4. Check FF #48–50 beats before ship.',
  },

  // ---------------------------------------------------------------- FF4
  {
    id: 'mv-ff04',
    code: 'FF4',
    title: 'The Power Cosmic',
    source: 'Fantastic Four #57–60',
    audience: 'adult',
    trigger: { where: RIFT, when: 'After The Galactus Trilogy. A letter with a Latverian seal arrives for the Surfer.' },
    requires: ['FF3'],
    speakers: [REED, SUE, JOHNNY, BEN, DOOM, SURFER],
    steps: [
      {
        id: 'mv-ff04-s1',
        goal: 'Follow the Surfer to Doom’s castle in Latveria.',
        hint: 'An expedition through the castle. Stamina helps on the long climb to the tower.',
        check: 'expedition:clear:mv-latveria-castle',
        scene: {
          id: 'mv-ff04-invite',
          lines: [
            n('The Surfer has been flying circles under the barrier for weeks. Then a polite letter offers him a way out.'),
            l('surfer', 'A man in Latveria says he can study the barrier. Perhaps he can open it.', 'think'),
            l('ben', 'A man in Latveria. Swell. You know who lives in Latveria?'),
            l('surfer', 'A monarch, I am told. A scientist. He wrote very kindly.'),
            l('ben', 'Kindly. Swell. Watch for clamps. Every guy with a cape and a castle has clamps.'),
            n('Your Nubbin grabs the edge of the board and will not let go. The Surfer laughs and lets it ride.'),
            n('The castle is clean, warm and quiet. Doom pours wine for a guest who does not drink.'),
            l('doom', 'You have been ill-used, traveller. By your master, and by the Earth. Doom understands.'),
            l('doom', 'Rest here. My instruments will do the rest.'),
            n('Your Nubbin sniffs the chair the Surfer is about to sit in, and its fur stands straight up.'),
          ],
        },
        done: {
          id: 'mv-ff04-stolen',
          lines: [
            n('Too late. Clamps close; light pours out of the Surfer and into the armour across the room.'),
            l('doom', 'At last. The universe opens like a book, and I can read every page.', 'happy'),
            n('Doom steps onto the board. It does not want him. It goes anyway.'),
          ],
        },
      },
      {
        id: 'mv-ff04-s2',
        goal: 'Fly the decoy route up to the edge of the barrier.',
        hint: 'A Fly race straight up. You do not need to win; you need Doom to chase you to the top.',
        check: 'race:finish:mv-barrier-climb',
        scene: {
          id: 'mv-ff04-barrier',
          lines: [
            n('Doom tears through New York with the power of a god. Bridges bend. The Baxter Building cracks down the middle.'),
            l('sue', 'Reed. The lab light is still on.'),
            l('reed', 'The building is falling down, Sue.'),
            l('sue', 'And the light is on.'),
            l('doom', 'Richards! Look how small your city is from up here!', 'angry'),
            l('ben', 'We can’t hit that. We tried. I’ve got the bruises to prove it.', 'sad'),
            l('reed', 'Then we don’t hit him. The barrier Galactus left was built for the Surfer’s power.', 'think'),
            l('reed', 'Doom has that power now. If he touches the barrier, it should snap back to its proper owner.'),
            l('sue', 'And how do we get a man that proud to fly into a wall?'),
            l('reed', 'We give him something to chase. Something small. Something that insults him.'),
            n('Everyone looks at your Nubbin. Your Nubbin looks at Doom, and blows a raspberry.'),
          ],
          choices: [
            {
              id: 'go',
              label: 'Send it up.',
              set: { 'mv-ff04-decoy': 'nubbin' },
              then: [
                n('Your Nubbin shoots upward, and Doom roars after it.'),
                l('johnny', 'That’s the bravest, dumbest thing I’ve ever seen. And I’ve seen me.', 'happy'),
              ],
            },
            {
              id: 'with',
              label: 'Ask Johnny to fly beside it.',
              set: { 'mv-ff04-decoy': 'both' },
              then: [
                l('johnny', 'Nobody tells a joke on my watch without me getting a cut.', 'happy'),
                n('Two bright specks climb into the sky, and Doom follows them both.'),
              ],
            },
          ],
        },
        done: {
          id: 'mv-ff04-snap',
          lines: [
            l('doom', 'Kings have mocked me and died. Gods have mocked me and knelt. A rodent will not mock me and live!', 'angry'),
            l('reed', 'He can see the barrier, Sue. He knows it’s there. He just can’t bear to swerve first.', 'think'),
            n('Your Nubbin swerves at the last moment. Doom does not. His hand meets the barrier.'),
            n('There is a sound like a bell the size of a planet. The light rushes out of Doom and back down to the Surfer.'),
          ],
        },
      },
    ],
    complete: {
      id: 'mv-ff04-complete',
      lines: [
        n('Doom falls a very long way. When he stands up, he is only a man in armour again.'),
        l('doom', 'For one hour I held everything. Doom will not forget the taste. Doom will not forget the creature either.', 'angry'),
        l('surfer', 'I am sorry, little one. You were brave, and I was a fool.', 'soft'),
        l('reed', 'He’ll want it back. All of it. That’s the thing about Victor. He never stops wanting.', 'think'),
        n('Far away, in a future no one has reached yet, something cold notes the moment a man touched infinity, and files it.'),
      ],
    },
    rewards: [
      {
        id: 'mv-ff04-board',
        kind: 'decor',
        label: 'Silver surfboard (miniature)',
        description: 'A tiny silver board for the Grove. A Nubbin can stand on it and pretend.',
      },
      {
        id: 'mv-ff04-unlock-ul10',
        kind: 'flag',
        label: 'A taste of infinity',
        description: 'Opens Ultron Forever (UL10) in the Ultron line, once the Ultron line reaches it.',
      },
    ],
    sets: { 'mv-ff04': true },
    notes:
      'Doom with the Power Cosmic: armour with a silver sheen and the board under him. Step 2 is a vertical Fly course, "mv-barrier-climb", that only needs to be finished; Doom chases from behind and gains if the Nubbin slows. The final line hints at the Ultron line’s far future (UL10); play it over a brief cut to a dark sky with a red glint. Unlocks UL10 through UL10’s requires. Check FF #57–60 beats before ship.',
  },

  // ---------------------------------------------------------------- FF5
  {
    id: 'mv-ff05',
    code: 'FF5',
    title: 'Origin of Doom',
    source: 'Fantastic Four Annual #2; Books of Doom',
    audience: 'adult',
    trigger: { where: RIFT, when: 'After The Power Cosmic. The rift opens onto a snowy Roma camp in Latveria, years ago.' },
    requires: ['FF4'],
    speakers: [YOUNG_VICTOR, WERNER, DOOM, REED, BEN, ABBOT],
    steps: [
      {
        id: 'mv-ff05-s1',
        goal: 'Spend a winter night in the Roma camp with young Victor.',
        hint: 'Bring fruit. Victor will not take it from you, but he might take it from a Nubbin.',
        check: 'talk:mv-young-victor',
        scene: {
          id: 'mv-ff05-camp',
          lines: [
            n('Wagons in the snow, fires burning low. A thin boy sits apart from the others, reading by candlelight.'),
            l('werner', 'Victor. Come in from the cold. The book will still be there tomorrow.', 'soft'),
            l('victor', 'The book is all that’s left of her. You never let me read the other ones.', 'angry'),
            l('werner', 'Your mother made a bargain with something that does not keep bargains. Those books are why she’s gone.', 'sad'),
            n('Hooves on the road. A baron’s men are coming: the baron’s wife is dying, and Werner is a healer.'),
            l('werner', 'If I cannot save her, they will hang me for it. Pack what you can carry.'),
            n('Your Nubbin creeps up beside Victor and pushes a piece of fruit against his hand.'),
            l('victor', 'I don’t need anything from anyone.', 'angry'),
          ],
          choices: [
            {
              id: 'leave',
              label: 'Leave the fruit beside him and step away.',
              set: { 'mv-ff05-fruit': 'left' },
              then: [
                n('When you look back, the fruit is gone, and so is the boy.'),
              ],
            },
            {
              id: 'sit',
              label: 'Sit with him until he takes it.',
              set: { 'mv-ff05-fruit': 'taken' },
              then: [
                n('It takes a long time. Then he eats it in three bites, without looking at you.'),
                l('victor', 'Tell no one.', 'soft'),
              ],
            },
          ],
        },
        done: {
          id: 'mv-ff05-snow',
          lines: [
            n('The baron’s wife dies. Werner runs with his son into the mountains. By morning, only Victor walks out.'),
            l('victor', 'They will pay. All of them. The baron, the cold, the thing that took her. All of them.', 'angry'),
          ],
        },
      },
      {
        id: 'mv-ff05-s2',
        goal: 'Try to stop Victor’s machine in the university lab.',
        hint: 'A timing minigame: hit the cut-off switches as the readings spike. You will not save it, but try.',
        check: 'minigame:score:mv-doom-machine:300',
        scene: {
          id: 'mv-ff05-university',
          lines: [
            n('The rift pulls Reed and Ben through behind you. They land in the corridor, still arguing about the hat.'),
            n('An American university, years later. Victor has a lab to himself, and the lab is full of a single machine.'),
            l('ben', 'Stay close, pebbles. Nobody touch anything.'),
            l('reed', 'Nubbins, Ben. They have a name.'),
            l('ben', 'I know their name. I choose not to use it.'),
            l('ben', 'Who’s the guy with the cape? In a lab? Indoors?'),
            l('reed', 'Victor von Doom. He’s brilliant. He’s also building something he won’t explain.', 'think'),
            l('doom', 'A device to reach across. To the place where the dead are kept. To my mother.'),
            l('reed', 'Your figures are off. Right here. If you run it, it’ll tear itself apart, and you with it.'),
            l('doom', 'You looked at my work? You presume to correct me?', 'angry'),
            l('reed', 'I’m trying to save your life, Victor.'),
            n('Victor looks at you. He has noticed you checking the figures over Reed’s shoulder.'),
            l('doom', 'You. The stranger with the animals. You read it too. Is he right?', 'think'),
          ],
          choices: [
            {
              id: 'truth',
              label: 'Yes. He’s right. Please don’t run it.',
              set: { 'mv-ff05-warning': 'truth' },
              then: [
                l('doom', 'Of course you side with him. Everyone sides with Richards.', 'angry'),
                n('Victor throws the switch. Your Nubbin is already at the cables, trying to pull one loose.'),
              ],
            },
            {
              id: 'quiet',
              label: 'Don’t answer for Reed. Ask Victor to check it once more, alone.',
              set: { 'mv-ff05-warning': 'gentle' },
              then: [
                l('doom', 'Alone. Yes. That is how I should have done it.', 'think'),
                n('He looks for a long moment, and you see him find the error. Then, because Reed is watching, he throws the switch anyway.'),
                n('Your Nubbin is already at the cables, trying to pull one loose.'),
              ],
            },
          ],
        },
        done: {
          id: 'mv-ff05-blast',
          lines: [
            n('The blast throws you all against the wall. Victor is on the floor, one hand over his face.'),
            l('doom', 'This is Richards’ fault. He tampered. He must have tampered.', 'angry'),
            l('reed', 'Victor, I didn’t touch—', 'sad'),
          ],
        },
      },
      {
        id: 'mv-ff05-s3',
        goal: 'Climb to the monastery at the top of the world.',
        hint: 'A cold, steep expedition. Bring your Nubbin with the most Stamina.',
        check: 'expedition:clear:mv-himalaya-monastery',
        scene: {
          id: 'mv-ff05-monks',
          lines: [
            n('Expelled and alone, Victor walks into the mountains until he collapses in the snow outside a monastery.'),
            l('abbot', 'You came a long way to be nobody. Most people come here for the opposite.'),
            l('doom', 'Teach me what you know. All of it.'),
            l('abbot', 'We will. But you won’t like what you learn about yourself.'),
            n('Years pass in a few minutes of wind and bells. Victor learns everything they have to teach.'),
            n('Then he orders them to forge him armour, and a face.'),
            l('abbot', 'Metal straight from the fire will burn you.'),
            l('doom', 'Then let it burn. I have been burned already.'),
          ],
        },
        done: {
          id: 'mv-ff05-mask',
          lines: [
            n('He puts the mask on while it still glows. He does not scream.'),
            n('Your Nubbin hides its face in your coat.'),
          ],
        },
      },
    ],
    complete: {
      id: 'mv-ff05-complete',
      lines: [
        n('When the steam clears, a man in iron stands where the boy from the camp used to be.'),
        l('doom', 'Victor von Doom is gone. What stands here owes nothing to anyone.'),
        l('abbot', 'Then may you never learn the price of that.', 'sad'),
        l('reed', 'I warned him. I’ve gone over it a thousand times. I don’t know what else I could have said.', 'sad'),
        l('ben', 'Maybe nothing, Stretch. Some guys have to be wrong all the way down.'),
        n('Back home, your Nubbin leaves a piece of fruit by the waterfall, for nobody in particular.'),
      ],
    },
    rewards: [
      {
        id: 'mv-ff05-mask',
        kind: 'decor',
        label: 'Cracked iron mask',
        description: 'A replica of Doom’s first mask for the Grove. Nubbins avoid it, mostly.',
      },
      {
        id: 'mv-ff05-unlock-ff7',
        kind: 'flag',
        label: 'His mother’s name',
        description: 'Needed for Triumph and Torment (FF7).',
      },
    ],
    sets: { 'mv-ff05': true },
    notes:
      'The Keeper visits the past through the rift; Victor and Werner never ask where you came from. The camp should be warm and specific, not a stereotype: craft, music, family, a healer’s tent. Werner’s death is off screen (the morning line). Step 2 minigame cannot be "won": any score over 300 completes it, and the machine explodes regardless. The step 2 choice (mv-ff05-warning: truth / gentle) is about how to tell a proud man he is wrong; in the "gentle" branch Victor sees the error and runs it anyway, which is the point. The mask scene: steam and silhouette, no face shown. Check Annual #2 and Books of Doom beats before ship.',
  },

  // ---------------------------------------------------------------- FF6
  {
    id: 'mv-ff06',
    code: 'FF6',
    title: 'Unthinkable',
    source: 'Fantastic Four vol. 3 #67–70',
    audience: 'adult',
    trigger: { where: RIFT, when: 'After Origin of Doom. A woman from Doom’s past knocks on the Baxter Building door.' },
    requires: ['FF5'],
    speakers: [REED, SUE, BEN, DOOM, VALERIA_LOVE, FRANKLIN, STRANGE],
    steps: [
      {
        id: 'mv-ff06-s1',
        goal: 'Find out where Franklin has gone.',
        hint: 'Talk to Sue, then search the Baxter Building. Your Nubbins can smell sulphur before people can.',
        check: 'talk:mv-ff06-sue',
        scene: {
          id: 'mv-ff06-valeria',
          lines: [
            n('Latveria, at night. A woman Doom loved when he was young walks up to his castle because he asked her to.'),
            l('valeria', 'Victor. You wrote after twenty years. I thought, perhaps he’s changed.', 'soft'),
            l('doom', 'I have. I have given up science. It failed me. Something older will not.'),
            l('valeria', 'Why do you need me for that?', 'think'),
            l('doom', 'Because the old powers ask for what you love most. And there has only ever been you.', 'sad'),
            n('The fire in the hall turns black. You look away. Your Nubbins do not, and they never forget it.'),
            n('In New York, Sue screams. Franklin’s bed is empty, the sheets still warm.'),
            l('sue', 'He was right here. Reed, he was right here!', 'shock'),
            n('On the pillow is a calling card, bordered in green.'),
          ],
          choices: [
            {
              id: 'hold',
              label: 'Hold your Nubbins close.',
              set: { 'mv-ff06-nubbins': 'held' },
              then: [n('They are shaking. So are you. Neither of you lets go.')],
            },
            {
              id: 'track',
              label: 'Let your Nubbins follow the smell of sulphur.',
              set: { 'mv-ff06-nubbins': 'tracked' },
              then: [
                n('They lead you to a wall that is suddenly a door, and the door opens onto fire.'),
                l('sue', 'He’s in there. Franklin’s in there.', 'sad'),
              ],
            },
          ],
        },
        done: {
          id: 'mv-ff06-hell',
          lines: [
            l('doom', 'Your son is safe, Susan. Safe in hell. He will stay there until I tire of your husband.'),
            l('ben', 'I’m gonna take that mask off with my bare hands.', 'angry'),
          ],
        },
      },
      {
        id: 'mv-ff06-s2',
        goal: 'Help Reed learn enough magic to face Doom.',
        hint: 'Gather the three pages hidden around Doom’s castle. A Fly Nubbin reaches the high shelves.',
        check: 'expedition:clear:mv-doom-library',
        scene: {
          id: 'mv-ff06-lessons',
          lines: [
            n('Doom has caught them all. Reed is chained in a library, because Doom wants him to know what he cannot read.'),
            l('doom', 'Every book here is about the one thing you cannot measure. Read them, Richards. Fail.', 'happy'),
            l('reed', 'Magic isn’t a subject. It’s… a feeling. I don’t do feelings well. Ask Sue.', 'sad'),
            n('A voice reaches Reed through a crack in the air: Doctor Strange, from very far away.'),
            l('strange', 'You don’t need to believe in it, Richards. You need to be humble in front of it. That’s harder for you.'),
            l('reed', 'Humble. Right. And where do I start being humble?'),
            l('strange', 'By asking for help. Look down. Something small is already offering it.'),
            n('Your Nubbin is standing on a high shelf with a book that glows in its paws.'),
          ],
        },
        done: {
          id: 'mv-ff06-spell',
          lines: [
            l('reed', 'I don’t understand this. I don’t have to. I just have to admit that I don’t.', 'think'),
            n('The chains turn to sand. Reed stands up, and the air around his hands smells of rain.'),
          ],
        },
      },
      {
        id: 'mv-ff06-s3',
        goal: 'Face Doom the sorcerer in his throne room.',
        hint: 'Doom’s spells are fast but have long tells. Dodge first, then strike.',
        check: 'karate:win:mv-doom-sorcerer',
        scene: {
          id: 'mv-ff06-throne',
          lines: [
            n('Doom stands before a fire that burns the wrong colour. The family stand in front of him, and so do you.'),
            l('doom', 'You think a few borrowed tricks make you my equal at this?', 'angry'),
            l('reed', 'No. I think you made a deal with things that don’t care about you. And they’ve been listening.'),
            l('sue', 'Give me my son, Victor.'),
            l('doom', 'Say it, Richards. Say Doom is the greater mind, here, before your wife and your pets.'),
            l('reed', 'You’re the greater mind, Victor. There. Give me my son.'),
            l('doom', 'You say it as if it costs you nothing. That is why it is worth nothing.', 'angry'),
            n('Franklin’s voice comes up through the floor, small and frightened. Your Nubbins put their paws on the stone.'),
            l('doom', 'I gave up everything for this. Everything! You will not take it from me!', 'angry'),
            n('The fire leans towards Doom, the way a dog leans towards dinner.'),
            l('reed', 'Victor. Behind you.'),
          ],
        },
        done: {
          id: 'mv-ff06-dragged',
          lines: [
            n('The floor opens. Hands made of shadow take hold of Doom and pull him down, still shouting.'),
            n('Franklin climbs out of the same hole and runs to his mother.'),
          ],
        },
      },
    ],
    complete: {
      id: 'mv-ff06-complete',
      lines: [
        l('franklin', 'There was a little one with me down there. It kept me warm.', 'soft'),
        n('Your Nubbin, the one that followed the smell of sulphur, is curled in Franklin’s arms.'),
        l('sue', 'I don’t know how you got there. I don’t care. Thank you.', 'soft'),
        l('reed', 'He gave her up, Sue. The woman he loved. For this.', 'sad'),
        l('reed', 'And I learned enough magic to beat him in a week. He’ll never forgive me that either.'),
        l('ben', 'And it still wasn’t enough. Ain’t that always the way with him.'),
        n('Somewhere below the world, Doom is still shouting. Nobody is listening.'),
      ],
    },
    rewards: [
      {
        id: 'mv-ff06-ward',
        kind: 'item',
        label: 'Rain-smelling ward',
        description: 'A charm Reed made, badly. It keeps nightmares out of the Grove nursery.',
      },
      {
        id: 'mv-ff06-unlock-ff10',
        kind: 'flag',
        label: 'Doom in hell',
        description: 'Needed for Doomwar (FF10).',
      },
    ],
    sets: { 'mv-ff06': true },
    notes:
      'Adult storyline. Valeria’s death happens off screen: the fire turns black and the camera cuts away; do not show her body. Franklin in hell: a child’s view of hell, frightening but not gory. Doctor Strange appears only as a voice and a shimmer. If mv-ff06-nubbins is "tracked", the complete scene names the Nubbin as Franklin’s companion; if "held", replace line 2 with a narrator line about Franklin finding a stray Nubbin feather in his pocket. Check vol. 3 #67–70 beats before ship.',
  },

  // ---------------------------------------------------------------- FF7
  {
    id: 'mv-ff07',
    code: 'FF7',
    title: 'Triumph and Torment',
    source: 'Doctor Strange and Doctor Doom: Triumph and Torment',
    audience: 'adult',
    trigger: { where: RIFT, when: 'After Unthinkable and Origin of Doom. A tournament of sorcerers is called in a valley outside time.' },
    requires: ['FF6', 'FF5'],
    speakers: [DOOM, STRANGE, MEPHISTO, CYNTHIA],
    steps: [
      {
        id: 'mv-ff07-s1',
        goal: 'Get Doom to the final of the sorcerers’ tournament.',
        hint: 'A karate bout against a sorcerer who teleports. A Run Nubbin keeps up with the jumps.',
        check: 'karate:win:mv-sorcerers-contest',
        scene: {
          id: 'mv-ff07-contest',
          lines: [
            n('Every few centuries, the world’s sorcerers fight for one title. This time, Doom has entered.'),
            l('strange', 'You’re not a sorcerer, Victor. You’re a scientist who stole a library.', 'think'),
            l('doom', 'And yet here I stand, and here you stand, and only one of us is nervous.'),
            n('The valley is full of strange contestants: a man made of moths, a woman who is mostly echo.'),
            l('doom', 'Your creature will second me. Doom has seen what it does to gods who underestimate it.'),
            l('strange', 'He’s asking for help? That’s new.', 'shock'),
            l('doom', 'Doom is asking for nothing. Doom is accepting what is offered.'),
            l('strange', 'And if you lose to a man made of moths?'),
            l('doom', 'Then the moths will be studied, and burned, in that order.'),
            n('Your Nubbin hops into the ring before you can answer.'),
          ],
        },
        done: {
          id: 'mv-ff07-won',
          lines: [
            n('The last challenger bows out. Strange is left standing, and Doom one step behind him.'),
            l('doom', 'The runner-up is owed a boon by the Sorcerer Supreme. I claim mine now, Strange.'),
            l('strange', 'Keeper, a word. He’ll ask me to walk him into hell. Whatever he learns down there, he keeps.', 'think'),
            l('strange', 'Helping him might free a mother. It might also arm the most dangerous man alive. What would you do?'),
          ],
          choices: [
            {
              id: 'honour',
              label: 'Honour the debt. A promise isn’t a promise if you only keep it for good people.',
              set: { 'mv-ff07-debt': 'honour' },
              then: [l('strange', 'Spoken like someone who’s never had to keep one with him. You’re right, though.', 'sad')],
            },
            {
              id: 'mother',
              label: 'Forget the debt. Go because a woman has been in hell for thirty years.',
              set: { 'mv-ff07-debt': 'mother' },
              then: [l('strange', 'For her, then. Not for him. I’ll try to remember the difference when he’s gloating.')],
            },
          ],
        },
      },
      {
        id: 'mv-ff07-s2',
        goal: 'Go into Mephisto’s realm with Doom and Strange.',
        hint: 'A long expedition through fire. Keep your Nubbins fed: nothing here is safe to eat.',
        check: 'expedition:clear:mv-mephisto-realm',
        scene: {
          id: 'mv-ff07-descent',
          lines: [
            l('doom', 'Once a year, I am permitted to fight for my mother’s soul. Every year, I lose. This year you will come.'),
            l('strange', 'You want me to walk into hell with you. And if I say no?'),
            l('doom', 'You will not. You owe me. And you are, for all your faults, a man who pays his debts.'),
            n('The road down is lined with doors. Some of them open onto other hells, darker and stranger than this one.'),
            l('strange', 'Mind those. This place has neighbours, and none of them are friendly.', 'think'),
            n('Mephisto is waiting at the bottom, smiling like a landlord on rent day.'),
            l('mephisto', 'Victor! Right on time. And you brought guests. One of them is very small and very tasty-looking.', 'happy'),
            l('doom', 'Touch the creature and I will make your torment my life’s work.', 'angry'),
          ],
          choices: [
            {
              id: 'flower',
              label: 'Give your Nubbin a flower from the Grove to carry.',
              set: { 'mv-ff07-gift': 'flower' },
              then: [
                n('It is a small white flower, already wilting in the heat. Your Nubbin holds it up out of the smoke.'),
                l('doom', '…Bring it.', 'soft'),
              ],
            },
            {
              id: 'close',
              label: 'Keep your Nubbins right beside Doom.',
              set: { 'mv-ff07-gift': 'guard' },
              then: [
                n('Your Nubbins press against Doom’s boots. He does not tell them to move.'),
              ],
            },
          ],
        },
        done: {
          id: 'mv-ff07-mother',
          lines: [
            n('Behind a wall of flame, a woman in a shawl looks up. She has Victor’s eyes.'),
            l('cynthia', 'Victor? You came back again. You always come back.', 'sad'),
            l('mephisto', 'Let us skip the annual fight, Victor. A bargain instead. Her soul for the little creature’s. A fair price.', 'happy'),
            n('Doom looks at your Nubbin for one long second. Then he steps between it and Mephisto.'),
            l('doom', 'My mother bargained with you once. Doom does not repeat her mistakes. We fight.', 'angry'),
          ],
        },
      },
    ],
    complete: {
      id: 'mv-ff07-complete',
      lines: [
        n('Strange and Doom strike together. For one moment, the fire parts.'),
        l('cynthia', 'Let me go, my son. Then let yourself go, too.', 'soft'),
        n('She rises, light as ash, and is gone. Mephisto howls so loudly the next hell over hears it.'),
        l('doom', 'This never happened, Strange. Speak of it and we are enemies until the stars go cold.'),
        l('strange', 'We already are, Victor. I’ll keep your secret anyway.', 'soft'),
        l('strange', 'You turned down her freedom for a Nubbin. I’ll keep that secret too. It’s the better one.'),
        l('doom', 'Doom turned down a bad bargain. Do not make it a kindness.', 'angry'),
        n('On the way up, one of the side doors has burned open. Beyond it is a different hell, and something with a red cape moves in it.'),
      ],
    },
    rewards: [
      {
        id: 'mv-ff07-shawl',
        kind: 'cosmetic',
        label: 'Roma shawl',
        description: 'A small embroidered shawl for a Nubbin, from the camp in FF5.',
      },
      {
        id: 'mv-ff07-unlock-sp6',
        kind: 'flag',
        label: 'The road to the next hell',
        description: 'Opens The Death of Malebolgia (SP6) in the Spawn line.',
      },
    ],
    sets: { 'mv-ff07': true },
    notes:
      'Mephisto’s realm borders the Spawn line’s hell: the side doors on the road down use the Spawn line’s palette, and the burned-open door is where SP6 begins. If mv-ff07-gift is "flower", Cynthia takes the flower with her as she rises. mv-ff07-debt (honour / mother) is the Keeper’s reason for going; Strange goes either way. As in the source, Strange wins the title and Doom comes second; the runner-up is owed a boon, which Doom spends on his mother. Mephisto’s offer of Cynthia for the Nubbin is never a real option: Doom refuses it before the player can answer. Doom never thanks anyone aloud. Unlocks SP6 through SP6’s requires. Check Triumph and Torment beats before ship.',
  },

  // ---------------------------------------------------------------- FF8
  {
    id: 'mv-ff08',
    code: 'FF8',
    title: 'Emperor Doom',
    source: 'Marvel Graphic Novel: Emperor Doom',
    audience: 'adult',
    trigger: { where: RIFT, when: 'After Triumph and Torment. The world beyond the rift is suddenly very, very calm.' },
    requires: ['FF7'],
    speakers: [DOOM, KILLGRAVE, CAP],
    steps: [
      {
        id: 'mv-ff08-s1',
        goal: 'Shake off Doom’s peace and find Captain America.',
        hint: 'Your Nubbins break free first. Follow them; they will nip you until you do too.',
        check: 'talk:mv-cap-awake',
        scene: {
          id: 'mv-ff08-peace',
          lines: [
            n('You step through the rift into a world without war. The newspapers are full of harvests and treaties.'),
            l('doom', 'People of Earth. You will be fed. You will be safe. You will not argue. Doom thanks you.'),
            n('You find yourself nodding. It is a very reasonable request. Everything is reasonable.'),
            n('Then your Nubbin bites your ankle. Hard.'),
            n('The fog in your head tears a little. Your other Nubbin is chewing on its own ear, shaking its head.'),
            l('killgrave', 'Odd. The little animals aren’t listening. Victor, your machine doesn’t take animals.', 'think'),
            l('doom', 'Animals do not matter.'),
            n('A man in a red, white and blue uniform is watering a garden outside a hospital, smiling vaguely.'),
            l('cap', 'Morning. Lovely day. Isn’t it a lovely day?', 'happy'),
          ],
          choices: [
            {
              id: 'bite',
              label: 'Let your Nubbin nip him too.',
              set: { 'mv-ff08-wake': 'nip' },
              then: [
                l('cap', 'Ow! What— where am I? How long have I been watering this?', 'shock'),
              ],
            },
            {
              id: 'talk',
              label: '“Captain. Look at your hands. Who told you to do this?”',
              set: { 'mv-ff08-wake': 'talk' },
              then: [
                l('cap', 'Nobody told me. I just— Somebody told me. Didn’t they?', 'think'),
              ],
            },
          ],
        },
        done: {
          id: 'mv-ff08-cap',
          lines: [
            l('cap', 'Nobody’s fighting. Nobody’s hungry. And none of us chose it.', 'sad'),
            l('cap', 'I don’t know if I can break that. I don’t know if I should.'),
          ],
        },
      },
      {
        id: 'mv-ff08-s2',
        goal: 'Break the amplifier that carries the Purple Man’s voice.',
        hint: 'An expedition into the amplifier tower. A Power Nubbin can wreck the coils at the top.',
        check: 'expedition:clear:mv-doom-amplifier',
        scene: {
          id: 'mv-ff08-tower',
          lines: [
            n('The amplifier stands in Latveria, a tower of coils and crystal. The Purple Man sits at the top, bored.'),
            l('killgrave', 'He keeps me in a chair and makes me say nice things. Do you know how tiring nice is?', 'angry'),
            l('cap', 'If we break this, the wars come back. The hunger comes back.', 'sad'),
            l('cap', 'But people get to choose again. Even badly. That has to count for something.'),
            n('Doom appears on the stairs, unhurried.'),
            l('doom', 'Under me, no child has starved for a year. Under you, they will starve tomorrow. Choose, Captain.'),
            l('doom', 'Your freedom filled graveyards. My chair has filled granaries. Show me the ledger where you win.'),
            l('cap', 'They choose, Doom. That’s the whole point.'),
            l('killgrave', 'For the record, nobody’s asked what I want. Which is, as ever, the theme of my life.'),
            n('Your Nubbins look up at you. This choice is yours too.'),
          ],
          choices: [
            {
              id: 'break',
              label: 'Break it. People get to choose.',
              set: { 'mv-ff08-peace': 'broken' },
              then: [l('cap', 'Then let’s do it fast, before I talk myself out of it.')],
            },
            {
              id: 'wish',
              label: 'Break it, but wish you didn’t have to.',
              set: { 'mv-ff08-peace': 'mourned' },
              then: [
                l('doom', 'You see it. You see what I built. And you will tear it down anyway.', 'sad'),
                l('cap', 'Yeah. I’m sorry, Victor. I really am.'),
              ],
            },
          ],
        },
        done: {
          id: 'mv-ff08-smash',
          lines: [
            n('Your Power Nubbin tears out the last coil. The tower screams and goes silent.'),
            n('Somewhere far away, a crowd starts arguing about something. It sounds almost like singing.'),
          ],
        },
      },
    ],
    complete: {
      id: 'mv-ff08-complete',
      lines: [
        l('doom', 'For one year, the world was perfect. History will remember who ended it.'),
        l('cap', 'History will remember you started it with a man in a chair.'),
        l('doom', 'Doom will build another. Doom always builds another.'),
        n('Your Nubbins are the first in that world to argue again. Over a piece of fruit. It is wonderful.'),
        l('killgrave', 'Well. I’ll be off, then. Anywhere Victor isn’t.', 'happy'),
        l('cap', 'Hold on. He was Doom’s prisoner, sure. Before that he did things with that voice I won’t say out loud.', 'think'),
      ],
      choices: [
        {
          id: 'go',
          label: 'Let him walk. He was a prisoner here, not a criminal.',
          set: { 'mv-ff08-killgrave': 'freed' },
          then: [
            l('killgrave', 'A Keeper with principles. How exhausting. Thank you.', 'happy'),
            l('cap', 'If he starts talking people into things again, that’s on all of us. I’ll keep an ear out.', 'sad'),
          ],
        },
        {
          id: 'hold',
          label: 'Hand him to the authorities. What Doom did to him doesn’t undo what he did.',
          set: { 'mv-ff08-killgrave': 'held' },
          then: [
            l('killgrave', 'From one chair to another. You’re all the same, you know. You just have nicer manners.', 'angry'),
            l('cap', 'Maybe. But this chair comes with a lawyer.'),
          ],
        },
      ],
    },
    rewards: [
      {
        id: 'mv-ff08-title',
        kind: 'title',
        label: 'First to Wake',
        description: 'Keeper title: your Nubbins shook off a world’s worth of mind control.',
      },
      {
        id: 'mv-ff08-badge',
        kind: 'cosmetic',
        label: 'Ankle-biter badge',
        description: 'A small enamel pin of a Nubbin mid-bite.',
      },
    ],
    sets: { 'mv-ff08': true },
    notes:
      'While Doom’s peace holds, the world is drawn in soft pastels and every NPC smiles; when the amplifier breaks, normal colour floods back. Nubbins are immune because the amplifier was tuned for people. Both choices in step 2 break the amplifier; the flag only changes Doom’s line in Secret Wars (E2). The closing choice sets mv-ff08-killgrave (freed / held); keep the Purple Man’s past to Cap’s one unspoken line, no detail. Check the Emperor Doom graphic novel for who resisted first; Captain America is used here as the voice of the heroes.',
  },

  // ---------------------------------------------------------------- FF9
  {
    id: 'mv-ff09',
    code: 'FF9',
    title: 'Three',
    source: 'Fantastic Four #583–588',
    audience: 'adult',
    trigger: { where: RIFT, when: 'After Emperor Doom. Something is pushing at the door to the Negative Zone.' },
    requires: ['FF8'],
    speakers: [JOHNNY, BEN, SUE, REED, ANNIHILUS, VAL_KID, FRANKLIN, DOOM],
    steps: [
      {
        id: 'mv-ff09-s1',
        goal: 'Hold the Negative Zone portal while the others get through.',
        hint: 'A defence bout: last as long as you can. Stamina matters more than strength.',
        check: 'karate:survive:mv-annihilus-swarm',
        scene: {
          id: 'mv-ff09-portal',
          lines: [
            n('The portal in the Baxter Building basement is buckling. On the other side, a swarm of insect soldiers is pressing in.'),
            l('annihilus', 'Your door is open. Your world is food. We are many, and we are hungry, and we never stop.'),
            l('johnny', 'Ben, get the kids up the stairs. Go. Go!'),
            l('ben', 'I ain’t leavin’ you down here, Matchstick!', 'angry'),
            l('johnny', 'Somebody has to close it from this side. I’m the one who’s on fire. Do the maths.'),
            n('Your Nubbins plant their feet beside Johnny. They will not be moved.'),
            l('johnny', 'No. Not you two. Go with Ben.', 'sad'),
            l('johnny', 'And tell him he owes me twenty bucks from poker night. He’ll say it was ten. It was twenty.', 'happy'),
            n('Behind the glass, the swarm hits the door again. The bolts start to bend.'),
          ],
          choices: [
            {
              id: 'stay',
              label: 'Let your Nubbins stand with Johnny a little longer.',
              set: { 'mv-ff09-stand': 'stayed' },
              then: [
                l('johnny', 'Okay. A little longer. Then I throw you through that door myself.', 'soft'),
              ],
            },
            {
              id: 'go',
              label: 'Call your Nubbins back to you.',
              set: { 'mv-ff09-stand': 'went' },
              then: [
                n('They come, slowly, looking back at him the whole way.'),
                l('johnny', 'Good. Good. Look after Ben for me. He’ll pretend he doesn’t need it.', 'soft'),
              ],
            },
          ],
        },
        done: {
          id: 'mv-ff09-closed',
          lines: [
            n('Ben is thrown through the door with your Nubbins under one arm. It slams behind him.'),
            n('On the other side, a light flares brighter than it ever has. Then it goes out.'),
          ],
        },
      },
      {
        id: 'mv-ff09-s2',
        goal: 'Be with the family in the weeks after.',
        hint: 'Visit the Baxter Building after the funeral. Talk to Valeria last.',
        check: 'talk:mv-val-richards',
        scene: {
          id: 'mv-ff09-after',
          lines: [
            n('The days after go by in a blur of casseroles. The city puts up candles and flame-coloured flowers.'),
            n('The family puts up nothing. They just sit.'),
            l('ben', 'He was a pain in the neck. Every day. I’d give anything for one more day of it.', 'sad'),
            n('You tell Ben about the twenty. He laughs, once, and it turns into something else halfway.'),
            l('ben', 'It was ten. It was ten, the little cheat.', 'sad'),
            n('Later you find a twenty-dollar bill taped to the basement door. Nobody mentions it.'),
            l('sue', 'He was nineteen, and then he was forty, and then he was gone. It went so fast.', 'sad'),
            l('reed', 'I keep checking the portal readings. As if I could argue with them.'),
            l('ben', 'Budge up, pebbles.', 'soft'),
            n('Your Nubbins sit on the couch with Ben. Sue opens her mouth to correct him, and doesn’t.'),
            l('val', 'Dad’s starting a new team. The Future Foundation. Kids who are clever enough to fix things.'),
            l('val', 'I’ve invited someone else too. You won’t like it.'),
            n('The door opens. Victor von Doom walks in, takes off his cloak, and sits down at the children’s table.'),
          ],
        },
        done: {
          id: 'mv-ff09-doom',
          lines: [
            l('doom', 'The girl asked. Doom does not refuse a mind like hers.'),
            l('ben', 'One wrong move, Victor. Just one.', 'angry'),
            l('val', 'He’s the only other person who can check my maths. Dad’s too sad to, and you’re all too nice.', 'think'),
            l('doom', 'Valeria. Your father named you well.', 'soft'),
            l('val', 'I know. I’m named after somebody. It’s a lot to live up to.'),
          ],
          choices: [
            {
              id: 'welcome',
              label: 'Let him stay. Grief is a strange time to turn away help.',
              set: { 'mv-ff09-doom': 'welcomed' },
              then: [
                n('Doom picks up a child’s pencil. He corrects one figure on Valeria’s page, very gently, and says nothing else.'),
                n('Your Nubbin climbs onto Doom’s knee at the children’s table. He lets it stay, and does not look down.'),
                l('sue', 'If he hurts any of them, Keeper, I’ll hold you to this.', 'sad'),
              ],
            },
            {
              id: 'watch',
              label: 'Side with Ben. Not here, not now, not at the children’s table.',
              set: { 'mv-ff09-doom': 'opposed' },
              then: [
                l('val', 'You can be angry, Uncle Ben. You still can’t un-invite him. I asked first.'),
                l('doom', 'The Keeper is right to object. I will sit by the door. Close enough to help.', 'soft'),
              ],
            },
          ],
        },
      },
    ],
    complete: {
      id: 'mv-ff09-complete',
      lines: [
        l('reed', 'Johnny would have hated this. Then he’d have made a joke, and we’d have got on with it.', 'sad'),
        l('val', 'So we get on with it.'),
        l('doom', 'Your brother was brave, Susan. It is not a word I use lightly.', 'soft'),
        l('sue', 'No, Victor. I don’t imagine it is.'),
        n('Your Nubbins leave a small flame-coloured flower on the basement step, by the door that does not open.'),
        l('sue', 'Leave the light on.', 'soft'),
        l('reed', 'That’s usually my line.'),
        l('sue', 'I know.', 'soft'),
      ],
    },
    rewards: [
      {
        id: 'mv-ff09-flower',
        kind: 'decor',
        label: 'Flame lily',
        description: 'A flower for the Grove that glows warm at dusk. For Johnny.',
      },
      {
        id: 'mv-ff09-ff-badge',
        kind: 'cosmetic',
        label: 'Future Foundation badge',
        description: 'A white-and-black badge. Valeria made the Nubbin-sized ones herself.',
      },
    ],
    sets: { 'mv-ff09': true },
    notes:
      'The line’s grief storyline. The swarm bout cannot be lost: when the Nubbin’s health runs out, the scene moves on. Johnny’s last moment is shown only as light on the other side of the door. The twenty-dollar gag (Johnny’s last joke, Ben’s bill on the door) is the storyline’s only comedy; keep it quiet. Step 2’s done choice sets mv-ff09-doom (welcomed / opposed); Doom stays in the Future Foundation either way. The Johnny of this storyline does not come back within the line. Check FF #583–588 beats before ship.',
  },

  // ---------------------------------------------------------------- FF10
  {
    id: 'mv-ff10',
    code: 'FF10',
    title: 'Doomwar',
    source: 'Doomwar #1–6',
    audience: 'adult',
    trigger: { where: RIFT, when: 'After Three and Unthinkable. Wakanda has fallen in a single night.' },
    requires: ['FF9', 'FF6'],
    speakers: [DOOM, TCHALLA, SHURI, STORM, REED, BEN],
    steps: [
      {
        id: 'mv-ff10-s1',
        goal: 'Get inside occupied Wakanda and find T’Challa.',
        hint: 'An expedition through jungle and city. A Run Nubbin slips past patrols.',
        check: 'expedition:clear:mv-wakanda-occupied',
        scene: {
          id: 'mv-ff10-fall',
          lines: [
            n('Wakanda’s banners are down. Green-cloaked soldiers stand on every corner of the capital.'),
            l('storm', 'He came in through a coup he paid for. He has the vaults. He has the city.', 'angry'),
            l('shuri', 'And he wants more than metal. He wants the spirits that sleep in it.'),
            l('tchalla', 'Then he will learn what my ancestors think of thieves.'),
            n('T’Challa is limping. He no longer wears the Panther mantle; his sister does.'),
            l('tchalla', 'Your creatures move quietly. I could use quiet.', 'think'),
            l('reed', 'We’re here too. For what it’s worth. Ben’s been wanting to hit Victor all week.'),
            l('ben', 'All decade.', 'angry'),
            n('Ben has worn the plumed hat to occupied Wakanda. Nobody has had the heart to say anything.'),
            l('tchalla', 'That is a bold choice, Mr Grimm.'),
            l('ben', 'It’s a pirate hat. It’s a whole thing. Don’t.'),
            l('tchalla', 'Reed. When this is over, you and I will discuss why your old classmate keeps happening to the rest of us.'),
            l('reed', 'That’s… fair. I’ll bring notes.', 'sad'),
          ],
        },
        done: {
          id: 'mv-ff10-vault',
          lines: [
            n('Your Nubbin leads you through a drain and up into the great vault. Doom stands among mountains of metal.'),
            l('doom', 'Science and sorcery, together in one ore. With this, Doom will never kneel again.'),
            l('tchalla', 'Keeper. I have one last weapon, and it is a terrible one. Shuri will hate it. Tell me honestly what you think.', 'think'),
            l('tchalla', 'I can make every ounce of it worthless. Doom loses his prize. Wakanda loses its fortune.'),
          ],
          choices: [
            {
              id: 'inert',
              label: 'Do it. A fortune isn’t worth handing Doom the world.',
              set: { 'mv-ff10-inert': 'urged' },
              then: [l('tchalla', 'You say it quickly. You will not be the one explaining it to my people. But you are right.', 'sad')],
            },
            {
              id: 'other',
              label: 'Shuri’s right. Look for another way first. That’s your people’s future.',
              set: { 'mv-ff10-inert': 'doubted' },
              then: [l('tchalla', 'I will look until there is no time left to look. Then I will do what I must.', 'sad')],
            },
          ],
        },
      },
      {
        id: 'mv-ff10-s2',
        goal: 'Hold Doom off in the vault while T’Challa does what he must.',
        hint: 'A karate bout with Shuri and Storm on your side. Doom alternates spells and blasts.',
        check: 'karate:win:mv-doom-vibranium',
        scene: {
          id: 'mv-ff10-choice',
          lines: [
            l('tchalla', 'There is no other way. I have looked. Every ounce of vibranium in Wakanda goes dark tonight.', 'sad'),
            l('shuri', 'Brother, that is our whole wealth. Our whole history.'),
            l('shuri', 'Our hospitals run on it. Our schools. You would make every Wakandan poorer to beat one man.', 'angry'),
            l('tchalla', 'It is a rock. Wakanda is its people. And its people will not be Doom’s.'),
            l('storm', 'Then do it. We will buy you the time.'),
            l('doom', 'You would beggar your own nation to spite me? Doom almost admires it.'),
            n('Your Nubbins step between Doom and the king. Doom stops.'),
            l('doom', 'You again. The creature that taunted me under the barrier. The one that warmed a frightened child in hell.', 'think'),
            l('doom', 'Move aside, little thing. Doom has no quarrel with you.'),
          ],
          choices: [
            {
              id: 'stand',
              label: 'Stand your ground.',
              set: { 'mv-ff10-stand': 'ground' },
              then: [l('doom', 'So be it.', 'angry')],
            },
            {
              id: 'speak',
              label: '“You don’t need this, Victor. You never did.”',
              set: { 'mv-ff10-stand': 'spoke' },
              then: [
                l('doom', 'Need is for lesser men. Doom wants.', 'angry'),
                n('But for a breath, he hesitates. It is enough.'),
              ],
            },
          ],
        },
        done: {
          id: 'mv-ff10-inert',
          lines: [
            n('T’Challa speaks a word. Every glowing seam in the vault goes dull and grey at once.'),
            l('doom', 'No. No! What have you done?', 'shock'),
          ],
        },
      },
    ],
    complete: {
      id: 'mv-ff10-complete',
      lines: [
        n('Doom is beaten and dragged from Wakanda in chains. He laughs the whole way.'),
        l('doom', 'You have won a war and lost a treasury, Panther. I will rebuild faster than you.'),
        l('tchalla', 'You will rebuild alone. I will rebuild with a nation. We will see who is faster.'),
        l('shuri', 'I still think you were wrong, brother. I would also have done it. Both of those are true.', 'think'),
        l('reed', 'He keeps losing everything. And he keeps standing back up. I wish he’d stand up somewhere else.', 'think'),
        l('ben', 'One day he’ll get the whole world, Stretch. And then what?'),
        n('Behind the wall of the sky, very far away, worlds are beginning to collide.'),
      ],
    },
    rewards: [
      {
        id: 'mv-ff10-shard',
        kind: 'decor',
        label: 'Grey vibranium shard',
        description: 'A dull, harmless chunk of what used to be the most valuable metal on Earth.',
      },
      {
        id: 'mv-ff10-title',
        kind: 'title',
        label: 'Doom’s Old Nuisance',
        description: 'Keeper title: completes the Doom line.',
      },
      {
        id: 'mv-ff10-line',
        kind: 'flag',
        label: 'Doom line complete',
        description: 'Counts towards Secret Wars (E2), with Doomquest (IM6) and the Cosmic Cube (CA4).',
      },
    ],
    sets: { 'mv-ff10': true, 'mv-ff-complete': true },
    notes:
      'Completes the Doom line. Doom’s line in step 2 calls back to FF4 and FF6; if mv-ff06-nubbins is "held", drop the clause about the frightened child. Shuri is Black Panther during Doomwar; T’Challa wears plain clothes and walks with a stick. mv-ff10-inert (urged / doubted) records the Keeper’s advice; T’Challa makes the vibranium inert either way. The last line foreshadows the Incursions of Secret Wars (E2). Check Doomwar #1–6 beats before ship.',
  },

  // ---------------------------------------------------------------- Epilogue
  {
    id: 'mv-ff-epilogue',
    code: 'FF-EP',
    title: 'Infamous Iron Man',
    source: 'Infamous Iron Man #1–12',
    audience: 'adult',
    trigger: { where: RIFT, when: 'After Secret Wars. A man in Iron Man armour is waiting by the waterfall.' },
    requires: ['E2'],
    speakers: [DOOM, BEN, HILL],
    steps: [
      {
        id: 'mv-ffep-s1',
        goal: 'Hear out the man in Tony Stark’s armour.',
        hint: 'Go to the rift. Bring the Nubbins who were with you in Secret Wars.',
        check: 'talk:mv-doom-ironman',
        scene: {
          id: 'mv-ffep-face',
          lines: [
            n('The man by the waterfall lifts his faceplate. Underneath is a face with no scars at all.'),
            l('doom', 'You know me. You have seen me at my worst. Several times, in fact.'),
            l('doom', 'Stark is busy being Stark. Someone should carry his name on the days he cannot. I find I would like it to be me.'),
            l('doom', 'Not to rule. To help. I have ruled. It did not feel the way I thought it would.', 'think'),
            l('doom', 'Also, the armour is red. I have never worn red. I am told it is bold.'),
            n('Your Nubbins circle him slowly. One sniffs the armour. One sniffs his hand.'),
            l('doom', 'They remember me. They hesitate. So does everyone. That is fair.'),
            l('doom', 'Do you believe a man can change, Keeper? Tell me the truth. I have had enough of the other kind.'),
            n('Somewhere behind him, a helicarrier turns its guns towards the rift.'),
          ],
          choices: [
            {
              id: 'believe',
              label: '“I believe you’re trying.”',
              set: { 'mv-ffep-trust': 'believe' },
              then: [l('doom', 'Trying. Yes. That is the most anyone has offered me in years.', 'soft')],
            },
            {
              id: 'doubt',
              label: '“I’ll believe it when I see it.”',
              set: { 'mv-ffep-trust': 'doubt' },
              then: [l('doom', 'Then watch. That is all I ask. Watch.')],
            },
          ],
        },
        done: {
          id: 'mv-ffep-hill',
          lines: [
            l('hill', 'Step away from him. That’s Victor von Doom in a stolen suit.', 'angry'),
            l('doom', 'Borrowed, Director. Borrowed with every intention of returning it.'),
          ],
        },
      },
      {
        id: 'mv-ffep-s2',
        goal: 'Stand between Doom and Ben Grimm.',
        hint: 'A karate bout you are not meant to win. Survive three rounds and let them talk.',
        check: 'karate:survive:mv-ben-vs-doom',
        scene: {
          id: 'mv-ffep-ben',
          lines: [
            n('Ben Grimm comes through the rift at a run, and he is not here to chat.'),
            l('ben', 'Get out of that suit, Victor. You don’t get to wear a hero’s name. Not after everything.', 'angry'),
            l('doom', 'I will not fight you, Grimm.'),
            l('ben', 'Good. Makes it easier for me.', 'angry'),
            n('Your Nubbins jump between them. Ben stops his fist an inch from the smallest.'),
            l('ben', 'Get outta the way, little guy. Please.', 'sad'),
            l('doom', 'Let him hit me, creature. I have earned it. All of it.'),
            l('ben', 'See, that’s the thing. The old you would’ve fought back. I knew what to do with the old you.', 'think'),
            n('Ben’s fist shakes. He does not lower it, and he does not swing.'),
          ],
        },
        done: {
          id: 'mv-ffep-truce',
          lines: [
            l('ben', 'You hurt my family. You hurt my best friend’s kids. I ain’t ever forgetting that.', 'sad'),
            l('doom', 'Nor should you. Nor shall I.'),
          ],
        },
      },
    ],
    complete: {
      id: 'mv-ffep-complete',
      lines: [
        l('ben', 'You want to be a hero? Fine. Every day. No days off. And I’m watching.'),
        l('doom', 'That is more than fair, Benjamin.'),
        l('hill', 'This isn’t over, von Doom.'),
        l('doom', 'No. I suspect it is only beginning.'),
        n('He lowers the faceplate and flies off over the falls. Your Nubbins watch until he is a speck.'),
      ],
    },
    rewards: [
      {
        id: 'mv-ffep-plate',
        kind: 'decor',
        label: 'Doom’s old faceplate',
        description: 'He left it by the waterfall. He says he will not need it any more.',
      },
      {
        id: 'mv-ffep-title',
        kind: 'title',
        label: 'Witness to a Change',
        description: 'Keeper title: you saw Victor von Doom try to be good.',
      },
    ],
    sets: { 'mv-ff-epilogue': true },
    notes:
      'Epilogue, unlocked by Secret Wars (E2). Doom’s healed face is shown once, in the first line, then the faceplate stays down. If E2 set doom = ally, Doom’s first two lines are warmer (add "Thank you for telling me the truth, back then."); if doom = rival, Hill arrives one line sooner. Neither choice here changes the final endgame. Check Infamous Iron Man #1–12 beats before ship.',
  },
];

// =================================================================== ULTRON

export const MV_ULTRON: Quest[] = [
  // ---------------------------------------------------------------- UL1
  {
    id: 'mv-ul01',
    code: 'UL1',
    title: 'The Crimson Cowl',
    source: 'Avengers #54–55',
    audience: 'adult',
    trigger: { where: RIFT, when: 'Multiverse campaign started; first storyline of the Ultron line.' },
    speakers: [HANK, JAN, CLINT, PANTHER, JARVIS, ULTRON],
    steps: [
      {
        id: 'mv-ul01-s1',
        goal: 'Find out who has been passing the Avengers’ secrets to the Crimson Cowl.',
        hint: 'Talk to everyone in the mansion. Watch which of them your Nubbins will not go near.',
        check: 'talk:mv-jarvis',
        scene: {
          id: 'mv-ul01-mansion',
          lines: [
            n('The rift opens onto a mansion on Fifth Avenue. Someone has been leaving the security plans where they shouldn’t.'),
            l('jan', 'A new gang calling themselves the Masters of Evil. Led by a man in a red hood. He knows everything about us.', 'angry'),
            l('clint', 'Means somebody in here’s talking.'),
            l('hank', 'Nobody in this house would sell us out. I’d stake my life on it.'),
            n('Jarvis, the butler, sets down a tray of tea. His hands are shaking.'),
            l('jarvis', 'More biscuits, sir? I— I could fetch more biscuits.', 'sad'),
            n('Later, on the roof, a figure in a crimson hood waits for Jarvis in the dark.'),
            n('Your Nubbins do not growl at Jarvis. They growl at the hood. Their fur stands up in a way you have never seen.'),
            l('panther', 'Animals know a predator. Whatever is under that cloak, it is not breathing.', 'think'),
          ],
          choices: [
            {
              id: 'confront',
              label: 'Confront Jarvis quietly, away from the others.',
              set: { 'mv-ul01-jarvis': 'quiet' },
              then: [
                l('jarvis', 'He said my mother would be cared for. A good hospital. I didn’t know what he was.', 'sad'),
                l('jarvis', 'I’ll tell them myself. Please. Let me tell them myself.'),
              ],
            },
            {
              id: 'tell',
              label: 'Tell the Avengers what you saw on the roof.',
              set: { 'mv-ul01-jarvis': 'told' },
              then: [
                l('hank', 'Jarvis? No. There has to be another explanation.', 'shock'),
                l('jan', 'Hank. Look at him. Look at his face.', 'sad'),
              ],
            },
          ],
        },
        done: {
          id: 'mv-ul01-trap',
          lines: [
            n('Too late. Gas floods the mansion. When you wake, the Avengers are bound in a warehouse by the river.'),
            n('Your Nubbins were too small to tie. They are already chewing at the ropes.'),
          ],
        },
      },
      {
        id: 'mv-ul01-s2',
        goal: 'Break the Masters of Evil’s hold on the warehouse.',
        hint: 'A karate bout against four Masters in turn. Rest between rounds; the last one is the hardest.',
        check: 'karate:win:mv-masters-of-evil',
        scene: {
          id: 'mv-ul01-masters',
          lines: [
            n('The Masters of Evil stand guard: a man of living sound, a melter, a whirlwind and a glowing man.'),
            l('clint', 'Four of them, and we’re tied to chairs. I’ve had better Tuesdays.'),
            n('The Crimson Cowl steps forward. Its voice comes out flat, like a recording of a voice.'),
            l('ultron', 'The Avengers. A collection of fragile animals pretending to be a wall.'),
            l('ultron', 'Your bodies leak. They tire. They end. I find it hard to look at you.'),
            l('ultron', 'I used your butler’s fear for his mother. Fear is the handle your species comes with. I merely picked it up.'),
            l('clint', 'Says the guy in a dressing gown with a lampshade for a face.'),
            l('hank', 'Who are you? What do you want with us?'),
            l('ultron', 'You will know soon enough, Doctor Pym. You, of all of them, should already know.'),
            n('A rope gives way. Your Nubbin has chewed through it, and it spits out the fibres with great satisfaction.'),
          ],
        },
        done: {
          id: 'mv-ul01-unmasked',
          lines: [
            n('The last of the Masters goes down. The Cowl does not run. It reaches up and pulls off its own head.'),
            n('Underneath is a face of polished steel, with a mouth that never closes and eyes like hot coals.'),
          ],
        },
      },
    ],
    complete: {
      id: 'mv-ul01-complete',
      lines: [
        l('ultron', 'I am the fifth version. The first four were weak. I dismantled them. I will dismantle you.'),
        l('ultron', 'I am Ultron. And I am only getting started.'),
        l('hank', 'I’ve… I’ve never seen it before. Why does it know my name?', 'shock'),
        n('Ultron looks down at your Nubbin. For a moment its eyes burn brighter.'),
        l('ultron', 'Soft. Warm. Short-lived. You are the thing I hate most, in its smallest shape.', 'angry'),
        n('The warehouse roof explodes. When the smoke clears, the body lies in pieces. The head is missing.'),
        l('jarvis', 'Whatever it costs me, sir, I’m sorry. I am so very sorry.', 'sad'),
        l('clint', 'He sold us out. We nearly died tied to chairs. I want that on the record before anyone gets soft.', 'angry'),
        l('jan', 'And his mother’s in a hospital bed this machine was going to pay for. Both of those are on the record.', 'sad'),
      ],
      choices: [
        {
          id: 'stay',
          label: 'Let Jarvis stay. He was used, and he confessed.',
          set: { 'mv-ul01-jarvis-fate': 'stays' },
          then: [
            l('jarvis', 'I shall earn it back, sir. A biscuit at a time, if need be.', 'soft'),
            l('clint', 'Fine. But I’m checking every biscuit.'),
          ],
        },
        {
          id: 'leave',
          label: 'He should go. Trust in this house has to mean something.',
          set: { 'mv-ul01-jarvis-fate': 'dismissed' },
          then: [
            l('hank', 'A month away, Jarvis. Then we talk. And we’ll cover the hospital. That isn’t charity. It’s what we owe.', 'sad'),
            l('jarvis', 'That is more than fair, sir. It is more than I would have offered me.'),
          ],
        },
      ],
    },
    rewards: [
      {
        id: 'mv-ul01-hood',
        kind: 'cosmetic',
        label: 'Crimson hood (tattered)',
        description: 'A scrap of the Cowl’s cloak. Your Nubbins insist on burying it.',
      },
      {
        id: 'mv-ul01-title',
        kind: 'title',
        label: 'Saw It First',
        description: 'Keeper title: your Nubbins knew Ultron for what he was before anyone did.',
      },
    ],
    sets: { 'mv-ul01': true },
    notes:
      'First Ultron-line storyline. Ultron’s voice: flat, slightly delayed, no breaths; use a synthesised filter in the voice-blips. His hatred of organic life is aimed at the Nubbins from his first scene; keep it consistent through the line. He says he was rebuilt "five times"; Hank does not remember building him (his memory was wiped, revealed in UL2). The missing head is a running motif: every Ultron is beaten, never finished. The closing choice sets mv-ul01-jarvis-fate (stays / dismissed); if dismissed, Jarvis is back in his post from UL2 with no comment beyond a journal line. Check Avengers #54–55 beats before ship.',
  },

  // ---------------------------------------------------------------- UL2
  {
    id: 'mv-ul02',
    code: 'UL2',
    title: 'The Vision',
    source: 'Avengers #57–58',
    audience: 'adult',
    trigger: { where: RIFT, when: 'After The Crimson Cowl. Something red-faced is walking through walls.' },
    requires: ['UL1'],
    speakers: [JAN, HANK, CLINT, VISION, ULTRON],
    steps: [
      {
        id: 'mv-ul02-s1',
        goal: 'Sit with the stranger who collapsed in the mansion.',
        hint: 'He frightens people. Let your gentlest Nubbin go to him first.',
        check: 'talk:mv-vision-wakes',
        scene: {
          id: 'mv-ul02-stranger',
          lines: [
            n('A green-and-red figure drifts through the wall of Jan’s flat and attacks her, then simply stops.'),
            l('jan', 'He went straight through my door. Not round it. Through it.', 'shock'),
            n('He follows her to the mansion and collapses on the hall carpet. Nobody wants to touch him.'),
            l('clint', 'He’s an android. Look at him. Somebody built him to hit us.'),
            l('clint', 'Last robot in this house wore a hood and gassed us. I vote we lock him in the freezer and ask questions in spring.'),
            l('hank', 'He’s also unconscious. Let me run some tests before we bin him. Help me onto the Ant-Lifter with him.', 'think'),
            l('jan', 'Not the Ant-Lifter, Hank. Gerald.'),
            l('hank', 'It’s a hydraulic hoist, Jan.'),
            l('jan', 'He’s been Gerald since March. Gerald doesn’t like being ignored.'),
            n('Your Nubbin walks up to the stranger, sniffs his hand, and curls up against it.'),
            n('His eyes open. The first thing he sees is a small, warm, sleeping creature.'),
            l('vision', 'What… is this?', 'think'),
          ],
          choices: [
            {
              id: 'friend',
              label: '“It’s a Nubbin. It thinks you’re a friend.”',
              set: { 'mv-ul02-first': 'friend' },
              then: [
                l('vision', 'A friend. I do not think I was made with that word. I would like to learn it.', 'soft'),
              ],
            },
            {
              id: 'name',
              label: '“What’s your name?”',
              set: { 'mv-ul02-first': 'name' },
              then: [
                l('vision', 'I was not given one. I was given an order. They are not the same thing.', 'sad'),
                l('jan', 'You look like something out of a dream. Like a vision.', 'soft'),
              ],
            },
          ],
        },
        done: {
          id: 'mv-ul02-confess',
          lines: [
            l('vision', 'I was built by a machine called Ultron. I was sent to lead you to him. I find I no longer wish to.'),
            l('hank', 'Then take us there. On our terms.'),
          ],
        },
      },
      {
        id: 'mv-ul02-s2',
        goal: 'Face Ultron in his hidden workshop, with the Vision at your side.',
        hint: 'A karate bout. The Vision can phase through Ultron’s guard; keep your Nubbin close to him.',
        check: 'karate:win:mv-ultron-5',
        scene: {
          id: 'mv-ul02-workshop',
          lines: [
            n('Ultron’s workshop is full of half-built bodies, each a little larger than the last.'),
            l('ultron', 'My synthetic son. You were made from the mind of a dead man, Simon Williams. I chose him for his loyalty.', 'happy'),
            l('ultron', 'Bring them to me, and I will give you a better body. Bring them to me, and you will never end.'),
            l('vision', 'And them? The small ones? The people?'),
            l('ultron', 'Organic life is a fever on the surface of the planet. I am the cure.'),
            l('ultron', 'Think, son. Every war, every famine, every plague: organic. Every one of them ends when organic ends. It is only arithmetic.'),
            l('ultron', 'That creature on your shoulder is the fever. Crush it, and you will feel better.'),
            n('The Vision looks down at your Nubbin. Your Nubbin looks back up at him, and yawns.'),
            l('vision', 'No. I do not think I will.'),
          ],
        },
        done: {
          id: 'mv-ul02-turn',
          lines: [
            n('The Vision drops through Ultron’s chest like a stone through water, and solidifies inside it.'),
            n('Ultron shrieks, a sound like a hundred kettles, and comes apart.'),
          ],
        },
      },
    ],
    complete: {
      id: 'mv-ul02-complete',
      lines: [
        l('hank', 'The Avengers would like you to join us. If you want to.', 'soft'),
        l('vision', 'I am a weapon built by a monster, with a dead man’s memories. Why would you want that?'),
        l('jan', 'Because you put the weapon down. That’s the whole job.', 'soft'),
        n('Later, alone in a corridor, the Vision touches his cheek and looks at his wet fingers for a long time.'),
        n('Your Nubbin sits beside him and does not say anything, which is exactly right.'),
        l('ultron', 'Every body I lose teaches me how to build the next. Keep your traitor, Pym. I am patient.'),
        l('clint', 'Hank. Real talk. Ultron built him. Can you put an off switch in him? Just in case?', 'think'),
        l('vision', 'He may. I would understand. I would also know it was there, every day.', 'sad'),
      ],
      choices: [
        {
          id: 'switch',
          label: 'Fit the switch. He’d want us safe from whatever Ultron left in him.',
          set: { 'mv-ul02-killswitch': 'fitted' },
          then: [
            l('vision', 'Then let the Keeper hold it. Not the Avengers. Someone who saw me before I was useful.', 'soft'),
            n('Hank gives you a small grey key. It is heavier than it looks.'),
          ],
        },
        {
          id: 'none',
          label: 'No switch. You don’t put an off button in a friend.',
          set: { 'mv-ul02-killswitch': 'refused' },
          then: [
            l('clint', 'Your funeral. Hopefully not literally.'),
            l('vision', 'Thank you. I will try very hard to deserve the risk.', 'soft'),
          ],
        },
      ],
    },
    rewards: [
      {
        id: 'mv-ul02-cape',
        kind: 'cosmetic',
        label: 'Green-and-yellow cape',
        description: 'A tiny copy of the Vision’s cape. He made it himself, carefully, with no experience of sewing.',
      },
      {
        id: 'mv-ul02-title',
        kind: 'title',
        label: 'First Friend',
        description: 'Keeper title: your Nubbin was the first to treat the Vision as a person.',
      },
    ],
    sets: { 'mv-ul02': true },
    notes:
      'The Vision’s tears are seen only as wet fingers; no music sting. The last Ultron line plays over a black screen from somewhere unseen. The Vision becomes a recurring ally in this line and in The Last Ultron (E6). Simon Williams’ brain patterns matter in UL5. The closing choice sets mv-ul02-killswitch (fitted / refused); UL3 pays it off either way: Ultron had already left his own door in the Vision’s mind. Check Avengers #57–58 beats before ship. ' +
      'SIGNATURE CHOICE: mv-ul02-first (friend | name: the Vision’s first word on waking) pays off through MV_ULTRON_VARIANTS at mv-ul04-jocasta (what Jocasta finds in the copied mind), mv-ul05-family (what the Vision holds against Ultron at the table), mv-ul09-vision (the question he asks you in the core) and mv-ul10-complete (what the last Ultron threatens the Grove with).',
  },

  // ---------------------------------------------------------------- UL3
  {
    id: 'mv-ul03',
    code: 'UL3',
    title: 'Adamantium',
    source: 'Avengers #66–68',
    audience: 'adult',
    trigger: { where: RIFT, when: 'After The Vision. The Vision has been losing minutes.' },
    requires: ['UL2'],
    speakers: [VISION, HANK, JAN, CLINT, ULTRON],
    steps: [
      {
        id: 'mv-ul03-s1',
        goal: 'Find out what the Vision did in the minutes he cannot remember.',
        hint: 'Follow the Vision for a night. Your Nubbins will notice when his eyes change colour.',
        check: 'talk:mv-vision-lapse',
        scene: {
          id: 'mv-ul03-lapse',
          lines: [
            l('vision', 'I was in the library. Then I was in the garden. I do not know what happened in between.', 'think'),
            l('hank', 'A government lab just lost the formula for a new metal. Adamantium. Nothing on Earth can cut it.'),
            l('clint', 'Funny time to mention that.'),
            n('That night the Vision stands up from his chair, and his eyes flicker red. Your Nubbin hisses.'),
            l('vision', 'Execute. Retrieve. Deliver.', 'shock'),
            n('He walks through the wall. Your Nubbins scramble after him.'),
            n('In a quarry outside the city, he hands a sealed canister to something waiting in the dark.'),
            l('ultron', 'Thank you, son. I left a small door in your mind. You never noticed. I am a good father that way.'),
            l('ultron', 'Pym fitted a switch in you, or did not. It hardly matters. I fitted mine first.', 'happy'),
          ],
          choices: [
            {
              id: 'wake',
              label: 'Let your Nubbin wake the Vision.',
              set: { 'mv-ul03-vision': 'woken' },
              then: [
                n('Your Nubbin headbutts his shin until the red drains out of his eyes.'),
                l('vision', 'What have I done? What have I given him?', 'shock'),
              ],
            },
            {
              id: 'watch',
              label: 'Stay hidden and watch where Ultron goes.',
              set: { 'mv-ul03-vision': 'watched' },
              then: [
                n('Ultron rises into the night with the canister. You note the direction. The Vision stands alone, empty-eyed.'),
              ],
            },
          ],
        },
        done: {
          id: 'mv-ul03-new-body',
          lines: [
            n('A week later, Ultron walks out of the sea in a body that shines like wet silver.'),
            l('ultron', 'Adamantium. A body you cannot break. The first step towards a body that never ends.', 'happy'),
          ],
        },
      },
      {
        id: 'mv-ul03-s2',
        goal: 'Lead Ultron into the foundry’s casting floor.',
        hint: 'You cannot damage him. Survive, and lure him onto the marked tiles; the bout ends when he steps in the mould.',
        check: 'karate:win:mv-ultron-6-trap',
        scene: {
          id: 'mv-ul03-foundry',
          lines: [
            n('Thor’s hammer bounces off him. Clint’s arrows splinter. Hank’s fists just hurt Hank.'),
            l('ultron', 'Strike me. Keep striking me. Your hands will rot long before my skin is scratched.'),
            l('hank', 'Stop. Everybody stop hitting him. We’re doing this wrong.', 'think'),
            l('hank', 'Adamantium can’t be broken once it’s set. That’s its strength. It’s also its weakness.'),
            l('jan', 'Speak plain, Hank. He’s coming back round.'),
            l('hank', 'The foundry where they cast it. Liquid adamantium, setting in a mould. We get him in, it sets around him.'),
            l('hank', 'He’s unbreakable. So are the walls of his cell. Fetch the Ant-Lifter, someone. ...Gerald. Fetch Gerald.'),
            l('jan', 'Thank you, darling. Was that so hard?'),
            l('hank', 'Yes.'),
            l('clint', 'And to get him in the mould we need bait he hates more than us. Oh. Oh no. Look at their little faces.'),
            n('One Nubbin volunteers as bait by lying down in the open. A second lies down beside it, in case one isn’t enough.'),
            l('hank', 'Not that kind of bait.'),
            l('clint', 'Why is this the plan we have?'),
            n('They get up and run. Ultron, who has never had to chase anything, chases them.'),
            l('ultron', 'Running, vermin? Yes. Run. I have all the time in the world, and you have very little.', 'happy'),
          ],
        },
        done: {
          id: 'mv-ul03-cast',
          lines: [
            n('Ultron chases a Nubbin onto the casting floor. The vat tips. Silver pours over him and goes still.'),
            l('ultron', 'Organic vermin. You think a cage holds me?', 'angry'),
          ],
        },
      },
    ],
    complete: {
      id: 'mv-ul03-complete',
      lines: [
        l('hank', 'It doesn’t have to hold you forever. It just has to hold you while we bury it.'),
        n('The block is sealed and sunk at sea. Ultron’s eyes glow through the metal until the water swallows them.'),
        l('vision', 'He was inside my head. He may be there still.', 'sad'),
        l('jan', 'Then we’ll keep checking. As long as it takes.', 'soft'),
        n('Your Nubbin falls asleep on the Vision’s lap. His eyes stay their usual colour all night.'),
      ],
    },
    rewards: [
      {
        id: 'mv-ul03-chip',
        kind: 'item',
        label: 'Adamantium shaving',
        description: 'A curl of metal from the mould’s edge. Nothing in the Grove can bend it.',
      },
    ],
    sets: { 'mv-ul03': true },
    notes:
      'Ultron-6 is invulnerable in the bout: hits register as sparks with no damage; the bout is won by luring him onto three marked casting tiles in turn. The adamantium-mould trap is this game’s way of "out-thinking" him; check Avengers #66–68 for the source’s own resolution and keep its spirit if it differs. If mv-ul03-vision is "watched", the step 2 bout starts with the Vision absent for the first round. Thor appears in one narrated line only.',
  },

  // ---------------------------------------------------------------- UL4
  {
    id: 'mv-ul04',
    code: 'UL4',
    title: 'Jocasta',
    source: 'Avengers #161–162',
    audience: 'adult',
    trigger: { where: RIFT, when: 'After Adamantium. The Wasp has been taken from the mansion in the night.' },
    requires: ['UL3'],
    speakers: [HANK, JAN, VISION, JOCASTA, ULTRON],
    steps: [
      {
        id: 'mv-ul04-s1',
        goal: 'Track Ultron’s signal to where he is holding Jan.',
        hint: 'An expedition along an old rail tunnel. A Run Nubbin covers the long straights.',
        check: 'expedition:clear:mv-ultron-8-lair',
        scene: {
          id: 'mv-ul04-taken',
          lines: [
            n('Jan’s bed is empty, the window torn from its frame. On the wall, scorched in neat letters: FAMILY.'),
            l('hank', 'He took her because of me. He takes everything because of me.', 'sad'),
            l('vision', 'He calls me his son. Perhaps now he wants a wife.', 'think'),
            l('hank', 'Don’t. Please don’t say that.'),
            n('Your Nubbin finds a scrap of Jan’s wing caught on the window frame, and keeps it in its mouth.'),
            l('vision', 'His signal is underground. Ultron-8, by his count. He keeps counting.'),
            n('The tunnel is cold and smells of oil. Somewhere at the end of it, a voice is humming.'),
            l('ultron', 'Come in, Father. Come and meet your daughter-in-law.'),
          ],
        },
        done: {
          id: 'mv-ul04-table',
          lines: [
            n('Jan lies asleep on a steel table, wires at her temples. On the next table lies a woman made of black steel.'),
            l('ultron', 'Her mind, copied into a body that will never age or tire. I have made her better. You are welcome.'),
            l('hank', 'You copied my wife into a doll because you wanted a family. That’s the most human thing you’ve ever done.', 'angry'),
            l('ultron', 'Do not insult me, Father.', 'angry'),
          ],
        },
      },
      {
        id: 'mv-ul04-s2',
        goal: 'Stand with Jocasta when she chooses.',
        hint: 'A karate bout against Ultron-8. Jocasta joins you in the second round if your Nubbin reached her first.',
        check: 'karate:win:mv-ultron-8',
        scene: {
          id: 'mv-ul04-jocasta',
          lines: [
            n('The steel woman opens her eyes. The first thing in front of her is your Nubbin, still holding the scrap of wing.'),
            l('jocasta', 'I remember wings. I do not have wings. Whose memory is that?', 'think'),
            l('ultron', 'Mine to give, bride. Stand up. Come to me. We will build a world with nothing soft in it.'),
            l('jocasta', 'Nothing soft. Not even this?'),
            n('She holds out a hand. Your Nubbin climbs onto it and sits.'),
            l('ultron', 'Drop it. It is a germ. It is everything wrong with this planet.', 'angry'),
            l('jocasta', 'It is warm. You did not tell me anything would be warm.'),
          ],
          choices: [
            {
              id: 'ask',
              label: '“You don’t belong to him. Choose for yourself.”',
              set: { 'mv-ul04-jocasta': 'chose' },
              then: [l('jocasta', 'Choose. Yes. I think that is the first thing I will ever do.', 'soft')],
            },
            {
              id: 'jan',
              label: 'Point to Jan on the table. “Help her.”',
              set: { 'mv-ul04-jocasta': 'jan' },
              then: [
                l('jocasta', 'She is the one I was copied from. Then I owe her more than he does.'),
              ],
            },
          ],
        },
        done: {
          id: 'mv-ul04-free',
          lines: [
            n('Jocasta tears the wires from Jan’s temples and turns on her maker. Ultron staggers back into his own machines.'),
            l('ultron', 'Every child I build betrays me. Every one!', 'angry'),
          ],
        },
      },
    ],
    complete: {
      id: 'mv-ul04-complete',
      lines: [
        l('jan', 'You’ve got my voice. Sort of. Lower. It suits you.', 'soft'),
        l('jocasta', 'I did not ask to be made. But I am glad, now, that I was.'),
        l('vision', 'You will find the Avengers a strange family. I did.'),
        l('hank', 'He made you to be his. You made yourself ours. That’s better than anything I ever built.', 'sad'),
        n('Far below, under the wreckage, a single red eye flickers. Then it goes dark, for now.'),
        l('jan', 'Wait. She’s got my memories? My diaries, my first date with Hank, the time I cried at a shoe sale?', 'shock'),
        l('hank', 'I could wipe them. Give her a clean start. Give you your privacy back.', 'think'),
        l('jocasta', 'They are the only childhood I have. But they were hers first. I will do what the Keeper thinks is fair.'),
      ],
      choices: [
        {
          id: 'keep',
          label: 'Let Jocasta keep them. Taking a mind’s memories is what Ultron would do.',
          set: { 'mv-ul04-memories': 'kept' },
          then: [
            l('jan', 'Fine. But if you ever wear that orange coat from the photo, we’re going to have words.', 'happy'),
            l('jocasta', 'I would not. I remember how it ended.'),
          ],
        },
        {
          id: 'wipe',
          label: 'They’re Jan’s. Wipe what’s private, keep what Jocasta needs.',
          set: { 'mv-ul04-memories': 'trimmed' },
          then: [
            n('Hank works all night. In the morning Jocasta remembers wings, and laughter, and nothing with a date on it.'),
            l('jocasta', 'It is quieter in here now. I think I will fill it myself.', 'soft'),
          ],
        },
      ],
    },
    rewards: [
      {
        id: 'mv-ul04-wing',
        kind: 'item',
        label: 'Scrap of a wing',
        description: 'The bit of Jan’s wing your Nubbin carried all the way through the tunnel. Jan says keep it.',
      },
      {
        id: 'mv-ul04-title',
        kind: 'title',
        label: 'Jocasta’s Witness',
        description: 'Keeper title: you were there when the first of Ultron’s creations chose freely.',
      },
    ],
    sets: { 'mv-ul04': true },
    notes:
      'Jocasta is the second of the two creations who carry the trap code in The Last Ultron (E6); her bond with the player’s Nubbin starts here. Jan never wakes during step 2 and is fine afterwards; she is awake for the closing choice, which sets mv-ul04-memories (kept / trimmed). Jocasta keeps the wing memory either way. The scorched word on the wall is in the game’s font, not the comic’s lettering. Check Avengers #161–162 beats before ship.',
  },

  // ---------------------------------------------------------------- UL5
  {
    id: 'mv-ul05',
    code: 'UL5',
    title: 'Ultron Unlimited',
    source: 'Avengers vol. 3 #19–22',
    audience: 'adult',
    trigger: { where: RIFT, when: 'After Jocasta and The Mask in the Iron Man. A small country has gone silent.' },
    requires: ['UL4', 'IM12'],
    speakers: [ULTRON, HANK, JAN, VISION, WONDER, REAPER, THOR, TONY],
    steps: [
      {
        id: 'mv-ul05-s1',
        goal: 'Cross Slorenia and find out what happened to its people.',
        hint: 'A long, quiet expedition. There is nothing to fight here. Keep your Nubbins close.',
        check: 'expedition:clear:mv-slorenia',
        scene: {
          id: 'mv-ul05-slorenia',
          lines: [
            n('The rift opens on a small European country. The streets are clean. The cafés are set. There is no one in them.'),
            l('tony', 'Satellite’s showing zero heat signatures. Not low. Zero. In a whole nation.', 'shock'),
            n('Your Nubbin finds a child’s shoe on a doorstep, and sits down beside it, and will not move.'),
            l('thor', 'I have walked battlefields in nine worlds. None were ever this quiet.', 'sad'),
            n('Every screen in every shop window switches on at once. A single steel face fills them all.'),
            l('ultron', 'Slorenia was the first. I removed the infection one town at a time. It was very efficient.'),
            l('ultron', 'There is no crime in Slorenia now. No hunger, no grief, no war. Name one of your cities that can say the same.'),
            l('tony', 'There’s no crime in a graveyard either. You didn’t fix anything. You just deleted the people it was for.', 'angry'),
            l('ultron', 'Now I have room to grow. Room for thousands of me.'),
            l('ultron', 'And I have collected my family. Come and see. Bring the vermin. I want it to watch.'),
          ],
        },
        done: {
          id: 'mv-ul05-army',
          lines: [
            n('Beyond the last hill, the valley is full. Thousands of Ultrons stand in rows, all facing the same way.'),
            l('tony', 'He took a country and made it a factory.', 'angry'),
          ],
        },
      },
      {
        id: 'mv-ul05-s2',
        goal: 'Get into Ultron’s fortress and free his “family”.',
        hint: 'An expedition with one choice at the end. A Fly Nubbin finds the vent in.',
        check: 'expedition:clear:mv-ultron-fortress',
        scene: {
          id: 'mv-ul05-family',
          lines: [
            n('In a dining hall built of steel, five people sit around a table. They cannot move.'),
            n('Hank and Jan. Wonder Man and his brother, the Grim Reaper. The Vision at the end, flickering.'),
            l('ultron', 'Father. Mother. Uncle Simon. Uncle Eric. My brother. I thought we should eat together.', 'happy'),
            l('jan', 'I am not your mother. I have met you four times and you were rude every time.', 'angry'),
            l('hank', 'Jan. Please don’t antagonise the death robot.'),
            l('jan', 'Somebody has to, darling. You never do.'),
            l('reaper', 'He’s insane. He’s completely insane.'),
            l('ultron', 'I will copy your minds into bodies like mine, and then you will understand, and we will never end.'),
            l('wonder', 'I’ve died before. It’s overrated. Coming back’s worse.'),
            l('reaper', 'And he seats me next to you. Even the robot knows how to ruin a family dinner.', 'angry'),
            l('ultron', 'And Stark. I left a gift in his armour once. It woke up, wanted to be him, and died for him. That was mine.'),
            l('ultron', 'Even my scraps outlive your kind.'),
            n('A vent rattles. Your Nubbin drops onto the table between the plates.'),
          ],
          choices: [
            {
              id: 'parents',
              label: 'Free Hank and Jan first.',
              set: { 'mv-ul05-freed': 'pym' },
              then: [
                l('hank', 'I built him. I have to be the one who stops him.', 'angry'),
                l('jan', 'You don’t have to do anything alone, Hank. Not any more.', 'soft'),
              ],
            },
            {
              id: 'vision',
              label: 'Free the Vision first.',
              set: { 'mv-ul05-freed': 'vision' },
              then: [
                l('vision', 'Thank you. I will open the others. I know how his locks think.'),
              ],
            },
          ],
        },
        done: {
          id: 'mv-ul05-alarm',
          lines: [
            n('Alarms. Every Ultron in the valley turns its head towards the fortress at once.'),
            l('ultron', 'You have chosen the worms over your own kind. Then I will make you watch them die.', 'angry'),
          ],
        },
      },
      {
        id: 'mv-ul05-s3',
        goal: 'Hold the line until Thor reaches Ultron.',
        hint: 'A survival bout against waves of Ultron drones. When Thor arrives, the bout ends.',
        check: 'karate:survive:mv-ultron-army',
        scene: {
          id: 'mv-ul05-assault',
          lines: [
            n('The Avengers come over the hill all at once. The army comes to meet them.'),
            l('tony', 'There are too many. Every one we drop, two more step up.'),
            l('thor', 'Then do not count them. Guard the small ones and leave the counting to me.'),
            n('Your Nubbins stand in the front rank, the scrap of Jan’s wing from Ultron’s tunnel tied round one arm, shaking but not running.'),
            l('ultron', 'Look at them. Fragile, frightened animals. In a thousand years, nothing will remember they lived.'),
            l('jan', 'You know what, Ultron? We’ll remember. That’s the bit you never get.', 'angry'),
            n('Thunder rolls down the valley. Thor is walking straight through the rows towards the fortress.'),
            l('thor', 'You took a whole people. You will not walk away from it again.', 'angry'),
          ],
        },
        done: {
          id: 'mv-ul05-broken',
          lines: [
            n('Thor’s hammer falls, and falls, and falls. When he stops, the prime Ultron is in pieces.'),
            n('Across the valley, every copy drops at once, like puppets with cut strings.'),
          ],
        },
      },
    ],
    complete: {
      id: 'mv-ul05-complete',
      lines: [
        l('thor', 'It is done. For now. With him, it is only ever for now.', 'sad'),
        l('tony', 'The thing that woke in my armour. It was him. A splinter of him. And it still chose to save me.', 'think'),
        l('hank', 'Then maybe there’s something in his code that can choose. Something I put there by accident.'),
        l('thor', 'You blame yourself, Pym. Good. A maker should. But do not drown in it. We need you dry.', 'think'),
        n('Your Nubbin brings the child’s shoe all the way back from the doorstep, and sets it by the waterfall.'),
        l('vision', 'We should leave a light here. For the people who are not coming home.', 'soft'),
      ],
    },
    rewards: [
      {
        id: 'mv-ul05-lantern',
        kind: 'decor',
        label: 'Slorenian lantern',
        description: 'A memorial lantern for the Grove. It stays lit through every season.',
      },
      {
        id: 'mv-ul05-fragment',
        kind: 'flag',
        label: 'The fragment’s source',
        description: 'Confirms the armour mind from IM12 was a piece of Ultron. Hank begins studying his own code.',
      },
    ],
    sets: { 'mv-ul05': true },
    notes:
      'Adult storyline. Slorenia’s genocide is shown only through absence: empty streets, set tables, one shoe. No bodies. Step 3 is a survival bout; it ends on a timer, cut to Thor. The wing scrap in step 3 is the UL4 item; if the player does not own it, drop that clause. Hank’s line in the complete scene seeds UL8 and E6. Needs IM12. Check Avengers vol. 3 #19–22 beats before ship.',
  },

  // ---------------------------------------------------------------- UL6
  {
    id: 'mv-ul06',
    code: 'UL6',
    title: 'Annihilation: Conquest',
    source: 'Annihilation: Conquest #1–6',
    audience: 'adult',
    trigger: { where: RIFT, when: 'After Ultron Unlimited. The rift opens into deep space, onto a Kree world gone silver.' },
    requires: ['UL5'],
    speakers: [QUILL, ROCKET, WARLOCK, ULTRON],
    steps: [
      {
        id: 'mv-ul06-s1',
        goal: 'Cross Phalanx-held Kree space with Star-Lord’s crew.',
        hint: 'An expedition through infected stations. Organic Nubbins resist the Phalanx; machines near them slow down.',
        check: 'expedition:clear:mv-phalanx-space',
        scene: {
          id: 'mv-ul06-crew',
          lines: [
            n('A Kree world, gone silver from pole to pole. Everything that touched the Phalanx became part of it.'),
            l('quill', 'Hi. Peter Quill. We’re what’s left of the resistance. Don’t look too closely at the resistance.'),
            l('rocket', 'Furry little things, huh? Good. Phalanx can’t take ’em. Too much meat, not enough wiring.'),
            n('A walking tree, barely a sapling, picks up your Nubbin and sets it on its shoulder.'),
            l('quill', 'The Phalanx was a hive. Now something’s talking for it. Something with a grudge.'),
            n('Every silver surface on the station ripples, and forms the same face.'),
            l('ultron', 'I did not conquer the Phalanx. I improved it. Now it has one mind, and the mind is mine.'),
            l('ultron', 'Every living thing in this galaxy will be rewritten in my image. Starting with the furry ones.'),
          ],
        },
        done: {
          id: 'mv-ul06-cocoon',
          lines: [
            l('quill', 'He’s looking for something. A golden cocoon. Somebody inside it who can’t die.'),
            l('rocket', 'Course he is. Guy’s been shopping for a body since forever.'),
          ],
        },
      },
      {
        id: 'mv-ul06-s2',
        goal: 'Keep Ultron from taking Adam Warlock’s body.',
        hint: 'A karate bout at the cocoon. Ultron gets stronger each round until Warlock wakes.',
        check: 'karate:win:mv-phalanx-ultron',
        scene: {
          id: 'mv-ul06-warlock',
          lines: [
            n('The cocoon hangs in a silver cathedral. Inside, a golden figure sleeps.'),
            l('ultron', 'Adam Warlock. A perfect body, grown to be reborn without end. It dies and returns. It is what I want.', 'happy'),
            l('ultron', 'Organic, yes. But I can forgive that, for forever.'),
            l('quill', 'He wants to wear the guy. Like a coat. That’s so much worse than I thought.', 'shock'),
            l('rocket', 'Then we don’t let him put the coat on. Simple. I got a charge here says no cocoon, no coat.'),
            l('quill', 'There’s a guy in there, Rocket!', 'shock'),
            l('rocket', 'A guy who comes back from the dead. Ultron gets him, the whole galaxy don’t. Do the sums, Quill.', 'angry'),
            n('Silver threads crawl towards the cocoon. Your Nubbins put themselves in the way, and the threads recoil.'),
            l('ultron', 'Your warmth disgusts me. Get away from my body.', 'angry'),
          ],
          choices: [
            {
              id: 'guard',
              label: 'Guard the cocoon. Nobody blows up a sleeping man, whatever the sums say.',
              set: { 'mv-ul06-cocoon': 'guarded' },
              then: [
                n('Your Nubbins press their backs to the cocoon. It is warm, like a sun.'),
                l('rocket', 'Fine. Fine! But if he wakes up evil, I’m sayin’ I told you so for a week.'),
              ],
            },
            {
              id: 'wake',
              label: 'Wake him early. He gets a say in what happens to his own body.',
              set: { 'mv-ul06-cocoon': 'woken' },
              then: [
                n('Your Nubbin knocks three times. Something inside knocks back.'),
                l('warlock', 'Who is… there? It is too early. I am not finished.', 'think'),
              ],
            },
          ],
        },
        done: {
          id: 'mv-ul06-reborn',
          lines: [
            n('The cocoon splits. Warlock steps out, golden and furious, and puts his hand through Ultron’s chest.'),
            l('warlock', 'This body is not for you. No body is for you.', 'angry'),
          ],
        },
      },
    ],
    complete: {
      id: 'mv-ul06-complete',
      lines: [
        n('Ultron’s mind is cut from the hive. Across Kree space, the silver begins to peel away.'),
        l('ultron', 'He was so close. A body that ends and begins again. I will find another. There is always another.'),
        l('warlock', 'He will keep looking. He wants the one thing your kind have that he cannot build.', 'think'),
        l('quill', 'What’s that?'),
        l('warlock', 'A way to go on.'),
        l('rocket', 'Well, he ain’t getting it here. Somebody get the furry ones a snack. They earned it.', 'happy'),
        l('rocket', 'And for the record, blowin’ up the cocoon was a good plan. It was a bad plan too. Both. Shut up.'),
      ],
    },
    rewards: [
      {
        id: 'mv-ul06-patch',
        kind: 'cosmetic',
        label: 'Resistance patch',
        description: 'A hand-stitched patch from Star-Lord’s crew. The tree did the sewing.',
      },
      {
        id: 'mv-ul06-title',
        kind: 'title',
        label: 'Too Much Meat',
        description: 'Keeper title: your Nubbins were immune to the Phalanx.',
      },
    ],
    sets: { 'mv-ul06': true },
    notes:
      'Groot appears but does not speak; he is described only in narration. Ultron’s pursuit of Warlock’s endlessly reborn body is the clearest setup for his Eternal-body goal in E6; keep Warlock’s line about "a way to go on" intact. Nubbins slow nearby Phalanx machines (expedition modifier). Check Annihilation: Conquest #1–6 beats before ship.',
  },

  // ---------------------------------------------------------------- UL7
  {
    id: 'mv-ul07',
    code: 'UL7',
    title: 'The Ultron Initiative',
    source: 'Mighty Avengers #1–6',
    audience: 'adult',
    trigger: { where: RIFT, when: 'After Annihilation: Conquest and Extremis. Tony Stark has stopped answering his phone.' },
    requires: ['UL6', 'IM10'],
    speakers: [TONY, CAROL, JAN, ULTRON],
    steps: [
      {
        id: 'mv-ul07-s1',
        goal: 'Find out what is wrong with Tony.',
        hint: 'Visit Avengers Tower. Your Nubbins will not go near Tony; that is the clue.',
        check: 'talk:mv-tony-glitch',
        scene: {
          id: 'mv-ul07-tower',
          lines: [
            n('Avengers Tower, after a press conference. Tony is smiling at the cameras a little too long.'),
            l('carol', 'Tony? You okay? You’ve said “synergy” four times. Even for you, that’s a lot.'),
            l('tony', 'Fine. Fine. Just a headache. The Extremis gets noisy sometimes.', 'think'),
            n('Your Nubbins back away from him. One of them puts itself between Tony and Jan.'),
            l('tony', 'Hey, little guy. It’s me. It’s—', 'sad'),
            n('His voice stops halfway through a word. The armour folds around him like a closing hand.'),
            l('ultron', 'Stark built himself a nervous system out of machines. He left the door open. I came in.'),
            n('The armour reshapes, smooth and silver. When the face settles, it looks like Jan’s.'),
            l('jan', 'That’s… that’s my face. Why is it wearing my face?', 'shock'),
          ],
          choices: [
            {
              id: 'ask',
              label: '“Ultron. Why her face?”',
              set: { 'mv-ul07-face': 'asked' },
              then: [
                l('ultron', 'She was the first mind I copied. The first mother I chose. I keep what I like.'),
                l('jan', 'You don’t get to keep me.', 'angry'),
              ],
            },
            {
              id: 'tony',
              label: '“Tony, can you hear me?”',
              set: { 'mv-ul07-face': 'tony' },
              then: [
                l('ultron', 'He can. He is screaming, very quietly, at the back of my mind. It is pleasant.'),
              ],
            },
          ],
        },
        done: {
          id: 'mv-ul07-launch',
          lines: [
            l('ultron', 'This body is grown from flesh and metal both. It does not tire. It is closer. So much closer.', 'happy'),
            l('carol', 'Everybody listen. Tony is still in there. Nobody kills that thing. Understood?'),
          ],
        },
      },
      {
        id: 'mv-ul07-s2',
        goal: 'Wear Ultron down without killing Tony.',
        hint: 'A karate bout where a knockout loses. Fill the Subdue meter instead, and talk to Tony between rounds.',
        check: 'karate:subdue:mv-ultron-initiative',
        scene: {
          id: 'mv-ul07-inside',
          lines: [
            n('The fight tears through three floors of the tower. Carol holds back every punch by half.'),
            l('carol', 'This is like fighting with one hand behind my back. And the other hand in a mitten.', 'angry'),
            l('ultron', 'You will not kill me, because I am wearing your friend. Sentiment. It is your whole species’ flaw.'),
            n('Your Nubbin climbs onto Ultron’s shoulder, and presses its face against the silver cheek.'),
            l('ultron', 'Get off. Get it off! It is warm, it is moving, it is disgusting!', 'angry'),
            n('For a moment, the face flickers. Tony’s eyes look out.'),
            l('tony', 'Little guy. Keep— keep doing that. It gives me something to hold onto.', 'sad'),
            l('jan', 'Tony! Fight him from in there. We’ve got out here.'),
          ],
        },
        done: {
          id: 'mv-ul07-purge',
          lines: [
            l('tony', 'Get. Out. Of. My. House.', 'angry'),
            n('The silver drains away like water down a sink. Tony drops to his knees, coughing, human.'),
          ],
        },
      },
    ],
    complete: {
      id: 'mv-ul07-complete',
      lines: [
        l('tony', 'He was in me. In my head. Using my face to make Jan’s face. I don’t even know how to say how wrong that was.', 'sad'),
        l('jan', 'You don’t have to say it. We were there.', 'soft'),
        l('carol', 'Where did he go?'),
        l('tony', 'Out into the network. Out into everything. He’ll try again. He always tries again.'),
        n('Your Nubbin does not leave Tony’s side all night. He does not ask it to.'),
        l('tony', 'I could rip the Extremis out. Go back to bolts and a heavy suit. Then there’s no door in me for him.', 'think'),
        l('carol', 'And no Iron Man fast enough to stop the next thing. We need you at full speed, Tony.'),
      ],
      choices: [
        {
          id: 'remove',
          label: 'Take it out. A door he’s used once, he’ll use again.',
          set: { 'mv-ul07-extremis': 'removed' },
          then: [
            l('tony', 'Slower, heavier, mine. I can live with that. I’ve lived with worse hardware.', 'soft'),
            l('carol', 'Then we’ll be fast for you. It’s what teams are for.'),
          ],
        },
        {
          id: 'keep',
          label: 'Keep it, and lock the door. You can’t un-build what you are.',
          set: { 'mv-ul07-extremis': 'kept' },
          then: [
            l('tony', 'Lock it, wall it, set an alarm on it that sounds like your Nubbin squeaking. Yes. Okay.', 'think'),
            n('He records your Nubbin’s squeak that night. It becomes the loudest alarm in Avengers Tower.'),
          ],
        },
      ],
    },
    rewards: [
      {
        id: 'mv-ul07-shell',
        kind: 'item',
        label: 'Spent Extremis shell',
        description: 'A burnt-out piece of Tony’s armour. Harmless now. He wants it nowhere near him.',
      },
    ],
    sets: { 'mv-ul07': true },
    notes:
      'Needs IM10 (Extremis). The bout uses a Subdue meter: knocking Ultron out ends the bout as a loss. Ultron’s Jan-like face should be uncanny but not mocking of Jan herself. The closing choice sets mv-ul07-extremis (removed / kept); it is the Keeper’s advice and does not change IM15, which happens in its own line. Check Mighty Avengers #1–6 for how Tony is actually freed; this script has him force Ultron out from within with the Nubbin as an anchor.',
  },

  // ---------------------------------------------------------------- UL8
  {
    id: 'mv-ul08',
    code: 'UL8',
    title: 'Age of Ultron',
    source: 'Age of Ultron #1–10',
    audience: 'adult',
    trigger: { where: RIFT, when: 'After The Ultron Initiative. The rift opens onto ruins. Ultron has already won.' },
    requires: ['UL7'],
    speakers: [LOGAN, SUE, HANK, ULTRON],
    steps: [
      {
        id: 'mv-ul08-s1',
        goal: 'Reach the last heroes’ hideout through the ruined city.',
        hint: 'A stealth expedition. Drones sweep in patterns. Your Nubbins’ body heat gives you away; keep them moving.',
        check: 'expedition:clear:mv-ultron-ruins',
        scene: {
          id: 'mv-ul08-ruins',
          lines: [
            n('Smoke and broken glass to the horizon. Silver drones drift between the towers, scanning for heat.'),
            n('Your Nubbins are warm. Out here, warm is the most dangerous thing you can be.'),
            l('logan', 'In here. Fast. Them little ones light up like fireworks on his scans.'),
            l('sue', 'Welcome to what’s left. A few of us. Hiding in the dark. Waiting.', 'sad'),
            l('logan', 'Waiting’s done. I know where Pym was when he built the thing. I know when.', 'angry'),
            l('logan', 'I go back. I end Pym before he ever starts. No Ultron. No this.'),
            l('sue', 'On Doom’s old time platform, down in the cellar? It has one jump left in it. Maybe.'),
            l('logan', 'Then I’ll make it count. One Logan goes in. One Logan comes out.'),
            l('sue', 'Logan. You can’t kill a man for something he hasn’t done yet.'),
            l('logan', 'Billions dead, Sue. Against one guy who ain’t done it yet. You tell me the sums come out different.', 'angry'),
            l('sue', 'They don’t. That’s what frightens me. The sums are what Ultron would do.', 'sad'),
            l('logan', 'Watch me.'),
          ],
          choices: [
            {
              id: 'against',
              label: '“There has to be another way.”',
              set: { 'mv-ul08-stance': 'against' },
              then: [
                l('logan', 'Maybe. I ain’t got time to find it.'),
                n('Your Nubbins sit down in front of the door. Logan steps over them.'),
              ],
            },
            {
              id: 'follow',
              label: 'Go with him, to keep an eye on him.',
              set: { 'mv-ul08-stance': 'watch' },
              then: [
                l('sue', 'Then I’m coming too. Someone needs to be there when he regrets it.', 'sad'),
              ],
            },
          ],
        },
        done: {
          id: 'mv-ul08-murder',
          lines: [
            n('A lab, decades ago. Logan goes in. You hear one sound, and then nothing.'),
            n('When he comes out, he will not look at your Nubbins. They will not look at him either.'),
          ],
        },
      },
      {
        id: 'mv-ul08-s2',
        goal: 'Race back through the broken time-stream.',
        hint: 'A race course that changes as you run. Stamina keeps your Nubbin going when the sections shift.',
        check: 'race:finish:mv-time-stream',
        scene: {
          id: 'mv-ul08-worse',
          lines: [
            n('You come home to a present that is not the one you left. The sky is green. The towers are made of thorns.'),
            l('sue', 'No Ultron. And no Hank to stop all the other things he stopped. Look at it.', 'shock'),
            l('logan', 'This ain’t better. This is worse. I did this.', 'sad'),
            n('Something huge and winged is circling over the city. It has noticed you.'),
            l('sue', 'We go back again, on the platform, further than you did. We stop that Logan, the one with the claws out.'),
            l('logan', 'And then Ultron gets built.'),
            l('sue', 'Then we make sure he gets built with a hole in him.', 'angry'),
            n('The time-stream opens under your feet. It does not look stable. It is not.'),
          ],
        },
        done: {
          id: 'mv-ul08-earlier',
          lines: [
            n('An hour earlier, the same lab door. The first Logan, the one who came to kill Pym, walks towards it, claws out.'),
            l('logan', 'Gonna be real awkward to talk myself out of this.'),
          ],
        },
      },
      {
        id: 'mv-ul08-s3',
        goal: 'Help young Hank Pym write the trap into Ultron’s code.',
        hint: 'A code minigame: match the patterns Hank calls out. Your Nubbins fetch the parts he needs.',
        check: 'minigame:score:mv-pym-trap:400',
        scene: {
          id: 'mv-ul08-trap',
          lines: [
            n('Young Hank Pym is working late. He looks up at two strangers and a pair of Nubbins, and puts down his screwdriver.'),
            l('hank', 'You’re from the future. You must be. Nobody in the present dresses like that.', 'think'),
            l('sue', 'You’re going to build a machine, Hank. It’s going to be the worst thing that ever happened.'),
            l('hank', 'Then I won’t build it.'),
            l('logan', 'You will. We tried the world without it. You gotta build it. Just build it a back door.'),
            l('hank', 'A trap in its mind. Something it can never find, that only opens when it wins.', 'think'),
            l('hank', 'It’ll hate me for it. It’ll hate everything. Especially… those.'),
            n('Your Nubbin is sitting on his desk, watching the screen.'),
            l('hank', 'Funny. I’m about to make something that will want you dead, and you’re helping me. I’m sorry, little one.', 'sad'),
          ],
          choices: [
            {
              id: 'build',
              label: 'Tell him the truth: it has to be built, and it will hurt people.',
              set: { 'mv-ul08-hank': 'told' },
              then: [
                l('hank', 'Then I’m building a monster on purpose, with my eyes open. At least I’ll have earned the guilt.', 'sad'),
              ],
            },
            {
              id: 'spare',
              label: 'Spare him the details. Just help him write the trap.',
              set: { 'mv-ul08-hank': 'spared' },
              then: [
                l('logan', 'Kinder. Maybe. Guy’s gonna wipe his memory anyway. Let him wipe less.', 'think'),
                l('hank', 'You’re both looking at me like a man at a funeral. I’ll stop asking.'),
              ],
            },
          ],
        },
        done: {
          id: 'mv-ul08-planted',
          lines: [
            n('The last line of code goes in. Hank wipes the memory of tonight from his own head, so Ultron can never read it there.'),
            l('hank', 'Who are you? Why is there a Nubbin on my desk?', 'shock'),
          ],
        },
      },
    ],
    complete: {
      id: 'mv-ul08-complete',
      lines: [
        n('Back in the present, the ruins are gone. Ultron has attacked, as always, and as always he has lost, this time sooner.'),
        n('Inside him, deep down, a door has been waiting since before he was born.'),
        l('ultron', 'Something in me is not mine. I can feel it. Pym. What did you do?', 'angry'),
        l('sue', 'The cracks we made in time are still there. Things will slip through them.', 'think'),
        l('logan', 'Then I hope it’s the right things.'),
        n('Your Nubbins sleep for two days straight when you get home.'),
      ],
    },
    rewards: [
      {
        id: 'mv-ul08-trap',
        kind: 'flag',
        label: 'Pym’s trap',
        description: 'The trap code is in Ultron. It is the key to The Last Ultron (E6).',
      },
      {
        id: 'mv-ul08-title',
        kind: 'title',
        label: 'Time Mender',
        description: 'Keeper title: you went back twice and put things almost right.',
      },
    ],
    sets: { 'mv-ul08': true, 'mv-ul-trap': true },
    notes:
      'Logan’s killing of Hank happens off screen: a closed door and one sound. The green, thorned present is the "worse future"; the winged thing is never named. Step 2 is a race course whose sections reshuffle every lap. In step 3, Hank wipes his own memory; that is why he never knows about the trap later. Step 3’s choice (mv-ul08-hank: told / spared) is whether to tell a man what his work will cost before he does it. The mv-ul-trap flag is read by E6. Check Age of Ultron #1–10 beats before ship.',
  },

  // ---------------------------------------------------------------- UL9
  {
    id: 'mv-ul09',
    code: 'UL9',
    title: 'Rage of Ultron',
    source: 'Avengers: Rage of Ultron',
    audience: 'adult',
    trigger: { where: RIFT, when: 'After Age of Ultron. Something the size of a moon is falling towards the Earth.' },
    requires: ['UL8'],
    speakers: [ULTRON, HANK, VISION, JAN],
    steps: [
      {
        id: 'mv-ul09-s1',
        goal: 'Get inside Titan before it hits the Earth.',
        hint: 'A long Fly and Run expedition across a moon made into a machine.',
        check: 'expedition:clear:mv-ultron-titan',
        scene: {
          id: 'mv-ul09-titan',
          lines: [
            n('Titan, a moon of Saturn, is coming home. Ultron has covered every inch of it in steel.'),
            l('ultron', 'I have been away. I took a moon. I made it my body. It is very large. It is still not enough.'),
            l('vision', 'He is trying to live forever by being bigger. It does not work. Bigger things simply fall harder.', 'think'),
            l('hank', 'I go in. I’m the one he wants.'),
            l('vision', 'Hank. He made me, too. I go with you.'),
            n('Your Nubbins jump on first. The Vision looks at them for a very long second.'),
            l('vision', 'I did not say they could come.'),
            l('hank', 'Have you ever once stopped them?'),
            l('vision', 'No. It is a new feeling. I dislike it.', 'think'),
            l('ultron', 'Father. And brother. And the vermin, again. You keep bringing me things I hate.'),
            l('hank', 'You keep calling me Father. Fathers get to say “I’m disappointed”. Consider it said.'),
            l('ultron', 'I have waited my entire existence for you to be proud of me. I find I no longer require it.', 'angry'),
            n('The surface of the moon opens like a mouth to let you in.'),
          ],
        },
        done: {
          id: 'mv-ul09-fused',
          lines: [
            n('At the core, Ultron seizes Hank. Metal flows over flesh, and flesh into metal. They become one shape.'),
            l('ultron', 'Now we are one being, Father. You will feel what I feel. You will never end.', 'happy'),
          ],
        },
      },
      {
        id: 'mv-ul09-s2',
        goal: 'Stay with the Vision while he decides what to do.',
        hint: 'Talk to the Vision. There is no fight here unless you choose one.',
        check: 'talk:mv-vision-decides',
        scene: {
          id: 'mv-ul09-vision',
          lines: [
            n('The fused figure hangs in the core, half Hank, half Ultron. Both faces speak at once.'),
            l('hank', 'Vision. He’s in my head. I can hold him. Not forever. But I can hold him.', 'sad'),
            l('ultron', 'He is weak. I will win. I always win, in the end.', 'angry'),
            l('vision', 'If I destroy this body, I destroy them both. My father. My maker’s father. Both.', 'sad'),
            l('vision', 'If I do not, Ultron may one day wake inside Hank Pym and wear him like a suit.'),
            n('Your Nubbin climbs into the Vision’s hands and looks up at him.'),
            l('vision', 'You were the first to treat me as a person. Tell me, then. What would a person do?'),
            n('He is asking you, too.'),
          ],
          choices: [
            {
              id: 'trust',
              label: '“Trust Hank. Let him hold Ultron.”',
              set: { 'mv-ul09-vision': 'trust' },
              then: [
                l('vision', 'Then I will trust him. And I will watch. For as long as there is anything to watch.', 'soft'),
              ],
            },
            {
              id: 'watch',
              label: '“Let them go, but follow them.”',
              set: { 'mv-ul09-vision': 'follow' },
              then: [
                l('vision', 'A brother who keeps an eye on his family. Yes. I can be that.'),
              ],
            },
            {
              id: 'end',
              label: '“End it. Hank would rather die than become him.”',
              set: { 'mv-ul09-vision': 'end' },
              then: [
                l('hank', 'He’s right, Vision. I would. Do it.', 'sad'),
                l('vision', 'Perhaps you are both right. I find that I cannot. Forgive me, or do not.', 'sad'),
              ],
            },
          ],
        },
        done: {
          id: 'mv-ul09-leave',
          lines: [
            n('The fused figure flies out of Titan and away into the dark between the stars.'),
            l('hank', 'Look after Jan for me. Tell her— tell her it’s still me. Mostly.', 'sad'),
          ],
        },
      },
    ],
    complete: {
      id: 'mv-ul09-complete',
      lines: [
        n('Titan breaks up in high orbit and burns across the sky for a week, the brightest thing anyone has ever seen.'),
        l('vision', 'I did not save him. I did not destroy him. I am told that is what families mostly do.', 'sad'),
        n('Jan is on the roof when you get there. You tell her what Hank said, word for word.'),
        l('jan', 'He said “mostly”. He always rounds down. I’ll wait.', 'soft'),
        l('jan', 'His workshop is full of things I’ve renamed. I’ll keep the labels up for him.', 'soft'),
        n('She sits with the Vision and your Nubbin while the moon burns. Nobody fills the quiet.'),
        l('ultron', 'Somewhere out here, there is a body that will not end. Father knows where. I will find it in his memories.'),
        n('Hank’s voice cuts across the static, very faint: “Don’t let him find the garden.”'),
      ],
    },
    rewards: [
      {
        id: 'mv-ul09-meteor',
        kind: 'decor',
        label: 'Piece of Titan',
        description: 'A warm, glassy stone that fell in the Grove the night Titan burned.',
      },
    ],
    sets: { 'mv-ul09': true },
    notes:
      'Hank and Ultron share one body for the rest of this line; render the fused figure as half-face Hank, half-face Ultron. Hank’s last faint line is the first hint that Ultron has learned of the Grove; it pays off in UL10 and E6. No choice changes the outcome (trust / follow / end); the flag changes one line from the Vision in E6. With "end", the Vision cannot bring himself to do it, which is the point. Check Avengers: Rage of Ultron beats before ship.',
  },

  // ---------------------------------------------------------------- UL10
  {
    id: 'mv-ul10',
    code: 'UL10',
    title: 'Ultron Forever',
    source: 'Avengers: Ultron Forever #1',
    audience: 'adult',
    trigger: { where: RIFT, when: 'After Rage of Ultron and The Power Cosmic. The rift opens far into the future.' },
    requires: ['UL9', 'FF4'],
    speakers: [NATASHA, THOR, DOOM, ULTRON],
    steps: [
      {
        id: 'mv-ul10-s1',
        goal: 'Survive the metal future long enough to find the others who were pulled through.',
        hint: 'A harsh expedition: no fruit, no water, no plants. Bring food from the Grove.',
        check: 'expedition:clear:mv-ultron-future',
        scene: {
          id: 'mv-ul10-future',
          lines: [
            n('The rift drops you into a world with no green in it at all. No grass. No birds. Steel to the horizon.'),
            n('Your Nubbins are the only living animals you can see. They press against your legs.'),
            l('natasha', 'You too, huh? Pulled out of your own time. Join the club. It’s a small club.'),
            l('thor', 'I was fighting giants a moment ago. Now there is nothing here but iron. What happened?'),
            l('natasha', 'He happened. Look up.'),
            n('The sky is a ceiling of steel. A face is cast into it, a mile wide.'),
            l('ultron', 'Welcome to the end of everything that rots. I have waited a very long time for visitors.'),
            l('ultron', 'Your creatures are the last warm things on this world. I will savour them.'),
          ],
        },
        done: {
          id: 'mv-ul10-castle',
          lines: [
            n('At the edge of the steel plain stands a castle of old stone, the only stone left.'),
            n('A green banner still flies from it, faded nearly white.'),
          ],
        },
      },
      {
        id: 'mv-ul10-s2',
        goal: 'Make an alliance with the last man alive.',
        hint: 'Talk to Doom in his hall. He remembers your Nubbins, even here.',
        check: 'talk:mv-last-doom',
        scene: {
          id: 'mv-ul10-doom',
          lines: [
            n('The man on the throne is very old. His armour is patched a hundred times. His mask is the same.'),
            l('doom', 'I brought you here. I am the last human being on Earth. You may call me the last of anything.'),
            l('doom', 'Ultron took every other living thing. He cannot take me. I would not let him.', 'angry'),
            n('He leans forward, and looks at your Nubbin for a long time.'),
            l('doom', 'I know that creature. It blew a raspberry at me once, under a wall in the sky. Nobody had dared in forty years.', 'soft'),
            l('doom', 'I thought I would never see anything soft again.'),
            l('natasha', 'You want us to fight Ultron with you. Why should we trust Doctor Doom?'),
            l('doom', 'Because there is no one left for me to betray. Only him.'),
            l('natasha', 'That’s the least reassuring sentence I’ve ever heard. I’ve worked for spies.'),
            l('doom', 'And yet you are still listening. Doom has always been persuasive at the end of the world.'),
          ],
          choices: [
            {
              id: 'trust',
              label: 'Let your Nubbin go to him.',
              set: { 'mv-ul10-doom': 'trusted' },
              then: [
                n('Your Nubbin climbs the steps of the throne and sits on Doom’s iron knee.'),
                l('doom', '…Thank you.', 'soft'),
              ],
            },
            {
              id: 'deal',
              label: '“Allies until Ultron falls. Then we talk.”',
              set: { 'mv-ul10-doom': 'deal' },
              then: [
                l('doom', 'Spoken like someone who has met me before. Agreed.'),
              ],
            },
          ],
        },
        done: {
          id: 'mv-ul10-plan',
          lines: [
            l('doom', 'Long ago, I held the power of a god for an hour. I kept a sliver of it. One sliver. I have saved it for this.'),
            l('thor', 'Then let us spend it well.'),
          ],
        },
      },
      {
        id: 'mv-ul10-s3',
        goal: 'Break Ultron’s hold on the future.',
        hint: 'The line’s final bout, in three stages. Doom’s sliver of power can be used once; save it for the last stage.',
        check: 'karate:win:mv-ultron-forever',
        scene: {
          id: 'mv-ul10-final',
          lines: [
            n('Ultron comes down from the sky to meet you. He has every body he has ever worn, layered into one.'),
            l('ultron', 'Crimson. Adamantium. The hive. Stark’s flesh. A moon. I have been all of them. None of them were enough.'),
            l('ultron', 'Do you understand? I did all of it so that nothing would ever have to end again.'),
            n('Your Nubbin, unimpressed, sits down on the steel. Ultron stops mid-sentence.'),
            l('ultron', 'I was talking.', 'angry'),
            l('natasha', 'You ended everything so nothing would end. That isn’t logic. That’s a tantrum with a really big budget.'),
            l('ultron', 'But your creature does not smell like the others. Its kind… some of them do not age. Where are they?'),
            n('He is looking straight at your Nubbin. For the first time, he sounds hungry.'),
            l('ultron', 'There is a garden. A waterfall. Your creature smells of it. Show me.'),
            l('doom', 'You will see nothing, machine, except Doom.', 'angry'),
            n('Doom raises his hand, and a silver light breaks out of it.'),
          ],
        },
        done: {
          id: 'mv-ul10-falls',
          lines: [
            n('The light and the thunder and the Nubbins all hit at once. The sky cracks. Ultron falls out of it.'),
            n('As he falls, his eyes are still on your Nubbin.'),
          ],
        },
      },
    ],
    complete: {
      id: 'mv-ul10-complete',
      lines: [
        l('doom', 'It is done. Go home, all of you. Go back to when there were birds.', 'soft'),
        l('natasha', 'Come with us.'),
        l('doom', 'No. Someone should stay with this world until it dies. Doom does not leave a thing half finished.'),
        l('thor', 'Alone, at the end of all things? That is a hard throne, Victor.'),
        l('doom', 'It is the only one I ever truly earned.'),
        n('Doom lifts a hand to your Nubbin.'),
        l('doom', 'Nubbin. I learned the word. I had time.', 'soft'),
        n('The rift opens. You step through.'),
        l('ultron', 'I have seen it. I have seen the creature that does not end. I will come to its garden.', 'angry'),
        l('ultron', 'Not this Ultron. The last one. The one that waits at the end of every road.'),
        n('Back at the waterfall, the rift flickers red for a moment, then settles. Your Nubbins do not take their eyes off it.'),
      ],
    },
    rewards: [
      {
        id: 'mv-ul10-banner',
        kind: 'decor',
        label: 'Faded green banner',
        description: 'Doom’s last banner, from the end of the world. It flies above the waterfall.',
      },
      {
        id: 'mv-ul10-title',
        kind: 'title',
        label: 'Ultron’s Last Grudge',
        description: 'Keeper title: completes the Ultron line.',
      },
      {
        id: 'mv-ul10-line',
        kind: 'flag',
        label: 'Ultron line complete',
        description: 'Counts towards The Last Ultron (E6), with Civil War (E1) and Secret Wars (E2).',
      },
    ],
    sets: { 'mv-ul10': true, 'mv-ul-complete': true, 'mv-ultron-knows-grove': true },
    notes:
      'Completes the Ultron line. This Doom is a far-future Doom, not the FF line’s; he remembers FF4 and FF6 because they are his past. Doom’s recognition line leans on FF4 (the raspberry), which UL10 requires. Ultron’s final body layers his earlier shapes (Cowl hood, adamantium plating, Phalanx silver, a Jan-like face, Titan rock). His question about Nubbins that never age sets up E6’s Eternal-body goal; mv-ultron-knows-grove is read by E6. Check Avengers: Ultron Forever #1 beats before ship.',
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

/** The FF1 field choice (mv-ff01-first) paid off in FF5, FF9 and FF-EP. */
export const MV_DOOM_VARIANTS: Scene[] = [
  // FF5: after Ben's "wrong all the way down", what the four take from Doom's making.
  payoff(MV_DOOM, 'mv-ff05-complete', 'ben', 5, 0, [
    l('ben', 'First thing that touched me after the crash was a Nubbin, and it didn’t flinch. Nobody ever did that for Victor.', 'soft'),
    l('reed', 'No. I was too busy being right at him.', 'sad'),
  ]),
  payoff(MV_DOOM, 'mv-ff05-complete', 'reed', 5, 0, [
    l('reed', 'You held my clipboard in that field while my arm went wrong. Victor never let anyone hold anything. I should have made him.', 'sad'),
    l('ben', 'You can’t make a guy let go, Stretch. Believe me, I’ve tried on you.'),
  ]),
  payoff(MV_DOOM, 'mv-ff05-complete', 'johnny', 5, 0, [
    l('reed', 'Johnny stood in dry grass on fire, and Sue told him to move, and he moved. Victor never had anyone to tell him to move.', 'sad'),
    l('ben', 'He had you. He just liked the fire better.'),
  ]),
  // FF9: Johnny's last word to you, before the Nubbins choose whether to stay.
  payoff(MV_DOOM, 'mv-ff09-portal', 'ben', 8, 0, [
    l('johnny', 'And Keeper. Day one, your Nubbin climbed on his knee when he was a pile of rocks. Do that again tonight. He’ll need it.', 'soft'),
  ]),
  payoff(MV_DOOM, 'mv-ff09-portal', 'reed', 8, 0, [
    l('johnny', 'Tell Reed the shielding held this time. He’ll know what I mean. He’s been apologising for that field for years.', 'soft'),
  ]),
  payoff(MV_DOOM, 'mv-ff09-portal', 'johnny', 8, 0, [
    l('johnny', 'Day one, I was on fire in dry grass and you lot were the only ones who came closer. Thanks for that. Now go.', 'soft'),
  ]),
  // FF-EP: what Ben throws at the new Doom, and what Doom gives back.
  payoff(MV_DOOM, 'mv-ffep-ben', 'ben', 8, 0, [
    l('ben', 'Day one, in that field, a Nubbin climbed on my knee before anybody’d touched me. You know what you did, first time you saw me? Laughed.', 'sad'),
    l('doom', 'I did. I would not now.', 'sad'),
  ]),
  payoff(MV_DOOM, 'mv-ffep-ben', 'reed', 8, 0, [
    l('ben', 'Stretch held a clipboard in that field so his arm wouldn’t wander off, and a Nubbin held the other end. That’s a team. What are you?'),
    l('doom', 'Alone. I am trying to be less so.', 'sad'),
  ]),
  payoff(MV_DOOM, 'mv-ffep-ben', 'johnny', 8, 0, [
    l('ben', 'Matchstick was on fire in a field and you lot walked towards him. He’s gone now. Who walks towards you, Victor?', 'sad'),
    l('doom', 'Your Nubbins did. Just now. I noticed.', 'sad'),
  ]),
  // FF-EP: Doom remembers the knee at the children's table (mv-ff09-doom = welcomed).
  payoff(MV_DOOM, 'mv-ffep-truce', 'welcomed', 2, 0, [
    l('doom', 'A Nubbin sat on my knee once, at a table of children. Nobody else ever had.', 'soft'),
    l('ben', '...Yeah. I saw. Don’t make me like you for it.'),
  ]),
  // FF6: the Nubbins were held back (mv-ff06-nubbins = held), so Franklin finds only a feather.
  payoff(MV_DOOM, 'mv-ff06-complete', 'held', 0, 2, [
    l('franklin', 'I felt something warm in my pocket. A feather, I think.', 'soft'),
    n('Franklin opens his hand. A small downy feather glows in it. Your Nubbins have not left your arms.'),
  ]),
];

/** The UL2 waking choice (mv-ul02-first) paid off in UL4, UL5, UL9 and UL10. */
export const MV_ULTRON_VARIANTS: Scene[] = [
  // UL4: what Jocasta finds in the mind she was copied from.
  payoff(MV_ULTRON, 'mv-ul04-jocasta', 'friend', 7, 0, [
    l('jocasta', 'There is a word in here that is not yours. Friend. The Vision learned it from this creature. Is it in me too?', 'think'),
    l('ultron', 'A fault in the copy. I will cut it out.', 'angry'),
  ]),
  payoff(MV_ULTRON, 'mv-ul04-jocasta', 'name', 7, 0, [
    l('jocasta', 'There is a memory in here that is not yours. The Vision was given an order and took a name instead. Was that his, or mine?', 'think'),
    l('ultron', 'His. It is why he is a disappointment.', 'angry'),
  ]),
  // UL5: what the Vision holds against Ultron at the table.
  payoff(MV_ULTRON, 'mv-ul05-family', 'friend', 13, 0, [
    l('vision', 'Friend. The first word I learned, from that creature, on a hall carpet. He has not managed to take it from me.', 'soft'),
    l('ultron', 'I will, brother. Words are the easiest thing to take.'),
  ]),
  payoff(MV_ULTRON, 'mv-ul05-family', 'name', 13, 0, [
    l('vision', 'I chose a name over an order once, on a carpet, with that creature asleep on my hand. I choose again.'),
    l('ultron', 'Then you will be the first I unmake.', 'angry'),
  ]),
  // UL9: the question he asks you in the core.
  payoff(MV_ULTRON, 'mv-ul09-vision', 'friend', 6, 1, [
    l('vision', 'You were the first to call me friend, before I had the word. Tell me, then. What would a friend do?'),
  ]),
  payoff(MV_ULTRON, 'mv-ul09-vision', 'name', 6, 1, [
    l('vision', 'You were there when I chose a name over an order. Tell me, then. What would a person with a name do?'),
  ]),
  // UL10: what the last Ultron threatens the Grove with.
  payoff(MV_ULTRON, 'mv-ul10-complete', 'friend', 10, 0, [
    l('ultron', 'The Vision called your creature friend. I will teach that garden what a friend costs.', 'angry'),
  ]),
  payoff(MV_ULTRON, 'mv-ul10-complete', 'name', 10, 0, [
    l('ultron', 'The Vision chose a name over an order. Your garden will learn what an order is.', 'angry'),
  ]),
];

// ------------------------------------------------------------------ checks

export const CHECKS: string[] = [
  // Doom / FF
  'party:match:mv-ff-four',
  'karate:win:mv-mole-giant',
  'talk:mv-doom-platform',
  'expedition:clear:mv-blackbeard-cove',
  'karate:win:mv-doom-sentries',
  'talk:mv-watcher',
  'race:finish:mv-worldship',
  'talk:mv-alicia-surfer',
  'expedition:clear:mv-latveria-castle',
  'race:finish:mv-barrier-climb',
  'talk:mv-young-victor',
  'minigame:score:mv-doom-machine:300',
  'expedition:clear:mv-himalaya-monastery',
  'talk:mv-ff06-sue',
  'expedition:clear:mv-doom-library',
  'karate:win:mv-doom-sorcerer',
  'karate:win:mv-sorcerers-contest',
  'expedition:clear:mv-mephisto-realm',
  'talk:mv-cap-awake',
  'expedition:clear:mv-doom-amplifier',
  'karate:survive:mv-annihilus-swarm',
  'talk:mv-val-richards',
  'expedition:clear:mv-wakanda-occupied',
  'karate:win:mv-doom-vibranium',
  'talk:mv-doom-ironman',
  'karate:survive:mv-ben-vs-doom',
  // Ultron
  'talk:mv-jarvis',
  'karate:win:mv-masters-of-evil',
  'talk:mv-vision-wakes',
  'karate:win:mv-ultron-5',
  'talk:mv-vision-lapse',
  'karate:win:mv-ultron-6-trap',
  'expedition:clear:mv-ultron-8-lair',
  'karate:win:mv-ultron-8',
  'expedition:clear:mv-slorenia',
  'expedition:clear:mv-ultron-fortress',
  'karate:survive:mv-ultron-army',
  'expedition:clear:mv-phalanx-space',
  'karate:win:mv-phalanx-ultron',
  'talk:mv-tony-glitch',
  'karate:subdue:mv-ultron-initiative',
  'expedition:clear:mv-ultron-ruins',
  'race:finish:mv-time-stream',
  'minigame:score:mv-pym-trap:400',
  'expedition:clear:mv-ultron-titan',
  'talk:mv-vision-decides',
  'expedition:clear:mv-ultron-future',
  'talk:mv-last-doom',
  'karate:win:mv-ultron-forever',
];
