/**
 * Pixel's Arcade, cartridge PA4: Mercy (Part M, rank 32). Nineteen quests, PA4-1 to PA4-19.
 *
 * SOURCE. Undertale, written, designed and scored by Toby Fox (USA, released 15 September 2015).
 * Rights: © Toby Fox. Fully in copyright: this cartridge needs Toby Fox’s licence before a
 * commercial build. The cartridge follows the game’s True Pacifist route only, from the fall to
 * the surface. Characters must look as licensed; there are no Grove versions of them.
 *
 * AUDIENCE. 'all' (the main game; the outline gives no Learning Grove version because of the
 * licence, but every lifted line still carries a childLines replacement, as the brief asks).
 *
 * FRAME. Pixel’s Arcade (after chapter 5): the dented cabinet from the Workyard skip, running in
 * the lantern shed. A cartridge with a red heart on its label. You and your Nubbin fall through
 * the dark onto golden flowers beside a child in a striped jumper. Pixel (she/her) stays at the
 * controls as “player two” and talks through the cabinet speaker. If s21Done, Clank sits on top of
 * the cabinet. You are the child’s company, never the child: the child is the hero, never speaks
 * (all narration, they/them), and only says their name, Frisk, at the very end. In every fight
 * you and your Nubbin stand in the box with the child’s red heart, and the only buttons are ACT
 * and MERCY. There is no FIGHT button, anywhere, in any form. The Underground takes your Nubbin
 * for a monster and adores it. Nubbins never speak. The source’s own monsters talk.
 *
 * GROVE FLAGS READ (read-only; a cartridge never writes a Grove flag):
 *   - wisp (S2): spared | sable | driven | unset.
 *       PA4-1: spared or sable plays ARCADE_PA4_VARIANTS pa4-01-vent-warm (a dry hiss from the vent
 *              under the cabinet; Wisp has come in out of the cold to watch the warm screen);
 *              driven or unset plays pa4-01-vent-quiet.
 *       PA4-18: spared or sable plays pa4-18-wisp-warm (Wisp whispers from the vent in both his
 *              voices, “spared… warm”), and pa4-end-wisp-asleep after the cartridge ends (he is
 *              asleep on top of the cabinet). driven plays pa4-18-wisp-driven (Pixel: “We
 *              didn’t, with ours,” and she switches the cabinet off for a minute). unset: nothing.
 *   - s21Done (S21): pa4-01-clank and pa4-end-clank (Clank on the cabinet). Unset: nothing.
 *
 * FLAGS WRITTEN (cartridge save only, all prefixed pa4-):
 *   - pa4-01 … pa4-19 on each quest’s completion; pa4-done for the whole cartridge (PA4-19),
 *     which counts towards High Score Night (any two of PA1–PA5).
 *   - pa4-candy = left | be (PA4-2, the signature choice). Pays off in PA4-17 (pa4-17-candy),
 *     PA4-18 (pa4-18-candy) and the last frame of PA4-19 (pa4-19-flower-turns | -still).
 *   - pa4-blook = lie | joke (PA4-3), pa4-papyrus = puzzles | pasta (PA4-7),
 *     pa4-undyne = hot | low (PA4-10), pa4-mettaton = pose | encore (PA4-12). Each picks that
 *     friend’s line in PA4-17’s crowd and PA4-19’s sunrise. Unset (never in normal play): the first.
 *
 * LIFTED TEXT (copyrighted; two of the three allowed, exactly as the outline lists them):
 *   1. Flowey: “In this world, it’s kill or be killed.” pa4-02-flower#7. Used once.
 *   2. Papyrus’s laugh, “NYEH HEH HEH!”, pa4-06-gauntlet#2 and pa4-07-capture#2. Counted as a
 *      quote though it is a laugh.
 * Both have childLines. Every other line is original; no other Undertale dialogue is quoted or
 * closely paraphrased. No music is used, not even a hum: the soundtrack never comes in.
 *
 * CARE NOTES.
 *   - The route where you kill everyone is not offered in any form, and is never mentioned.
 *   - The neutral ending is skipped: Asgore’s death is never shown. Pixel loads the save from
 *     before the corridor (PA4-14). The credits note must say so.
 *   - The first child and Asriel die in the backstory (PA4-13), told as the monsters tell it:
 *     sad, short, no detail of the illness, no detail of the hurt.
 *   - The True Lab is dim, never frightening: no jump scares, and the melted monsters are always
 *     lost and gentle (PA4-16).
 *   - Asriel’s god form is light and noise, never gore. Flowey’s faces stay cartoon.
 *   - Papyrus’s and Alphys’s “dates” are friendship played for laughs.
 *   - Fire, spears and lasers always curl away or stop short of you. Nobody is hurt on screen.
 *   - The third rule is acted out (PA4-3, PA4-16), never quoted.
 */
import type { Line, Mood, Scene } from '../config/story';
import type { Quest, Speaker } from './types';

// ------------------------------------------------------------------ helpers

const say =
  (who: string) =>
  (text: string, mood?: Mood): Line =>
    mood ? { who, text, mood } : { who, text };
const sp = (id: string, name: string, basedOn: string): Speaker => ({
  id,
  name,
  kind: 'other',
  basedOn,
});

const WHERE = 'Pixel’s arcade cabinet, the lantern shed: Mercy (Pixel’s Arcade)';
const after = (code: string) =>
  `Any time after ${code}, from the Mercy cartridge in Pixel’s arcade cabinet.`;
const SRC = 'Undertale (Toby Fox, 2015)';

// ------------------------------------------------------------------ speakers

const FLOWEY = sp('pa4-flowey', 'Flowey', 'Flowey the Flower (Undertale)');
const TORIEL = sp('pa4-toriel', 'Toriel', 'Toriel, keeper of the Ruins (Undertale)');
const BLOOK = sp('pa4-blook', 'Napstablook', 'Napstablook, the shy ghost (Undertale)');
const SANS = sp('pa4-sans', 'Sans', 'Sans the skeleton (Undertale)');
const PAPYRUS = sp('pa4-papyrus', 'Papyrus', 'Papyrus the skeleton (Undertale)');
const KID = sp('pa4-kid', 'Monster Kid', 'Monster Kid (Undertale)');
const ECHO = sp('pa4-echo', 'Echo flower', 'The echo flowers of Waterfall (Undertale)');
const UNDYNE = sp('pa4-undyne', 'Undyne', 'Undyne, captain of the Royal Guard (Undertale)');
const ALPHYS = sp('pa4-alphys', 'Alphys', 'Dr Alphys, the royal scientist (Undertale)');
const METTATON = sp('pa4-mettaton', 'Mettaton', 'Mettaton, the robot star (Undertale)');
const FOLK = sp(
  'pa4-folk',
  'Townsfolk',
  'The monsters of New Home who tell the history (Undertale)',
);
const ASGORE = sp('pa4-asgore', 'Asgore', 'King Asgore Dreemurr (Undertale)');
const ASRIEL = sp('pa4-asriel', 'Asriel', 'Asriel Dreemurr, the lost prince (Undertale)');
const WISP: Speaker = { id: 'wisp', name: 'Wisp', kind: 'nubbin' };

const N = say('narrator');
const Y = say('you');
const PX = say('pixel');
const FL = say('pa4-flowey');
const TO = say('pa4-toriel');
const BL = say('pa4-blook');
const SA = say('pa4-sans');
const PA = say('pa4-papyrus');
const MK = say('pa4-kid');
const EC = say('pa4-echo');
const UN = say('pa4-undyne');
const AL = say('pa4-alphys');
const MT = say('pa4-mettaton');
const FO = say('pa4-folk');
const AS = say('pa4-asgore');
const AR = say('pa4-asriel');
const WI = say('wisp');

// =================================================================== MERCY

export const ARCADE_PA4: Quest[] = [
  // ---------------------------------------------------------------- PA4-1
  {
    id: 'pa4-01',
    code: 'PA4-1',
    title: 'The Cabinet',
    source: `${SRC}: the title screen and the fall`,
    audience: 'all',
    trigger: {
      where: WHERE,
      when: 'Any time once Pixel’s arcade cabinet runs in the lantern shed (after chapter 5).',
    },
    speakers: [],
    steps: [
      {
        id: 'pa4-01-s1',
        goal: 'Help Pixel get the heart cartridge running.',
        hint: 'Look in the shoebox of cartridges by the cabinet; it’s the one with the red heart.',
        check: 'inspect:pa4-cartridge',
        scene: {
          id: 'pa4-01-shed',
          lines: [
            N(
              'The lantern shed smells of sawdust and solder. Pixel’s cabinet stands in the corner, dented, humming to itself.',
            ),
            PX('New one. Found it wedged behind the coin box, under what used to be a mouse nest.'),
            N(
              'She holds up a cartridge. The label is plain black, with a small red heart in the middle.',
            ),
            PX('No title. No picture on the back. Just the heart.', 'think'),
            N(
              'She blows into the slot, hard. A cloud of sawdust comes out, and something that might have been a seed.',
            ),
            PX('That is not how you clean contacts. It is, however, how everyone cleans contacts.'),
            N(
              'Your Nubbin sniffs the cartridge, then pats the heart, gently, as if it might be sore.',
            ),
            PX('Right. Player two is me. I’ve got the stick and the buttons. You two go in.'),
          ],
          choices: [
            {
              id: 'ready',
              label: 'What kind of game is it?',
              then: [
                PX(
                  'Don’t know. The board has fewer buttons than it should. I counted twice.',
                  'think',
                ),
                PX('Maybe it’s a quiet one.'),
              ],
            },
            {
              id: 'brave',
              label: 'Push it in. We’re ready.',
              then: [PX('Nobody’s ever ready. That’s what the first level is for.', 'happy')],
            },
          ],
        },
        done: {
          id: 'pa4-01-shed-done',
          lines: [
            N(
              'The cartridge clicks home. The screen goes black, then shows one red heart, beating slowly.',
            ),
            PX('Huh. It’s waiting for something.'),
          ],
        },
      },
      {
        id: 'pa4-01-s2',
        goal: 'Fall into the game and find out where you’ve landed.',
        hint: 'Touch the screen with your Nubbin beside you.',
        check: 'explore:pa4-ruins:flowerbed',
        scene: {
          id: 'pa4-01-fall',
          lines: [
            N('You touch the glass.'),
            N('It’s warm. Then the floor of the shed isn’t there.'),
            N(
              'You fall through the dark for a long time, slowly, like a leaf. Your Nubbin holds on to your sleeve.',
            ),
            N(
              'You land on something soft: a bed of golden flowers, in a pool of light from a hole far above.',
            ),
            N(
              'Beside you, a child sits up and rubs their head. They wear a striped jumper, blue and pink.',
            ),
            N(
              'The child looks at you, and at your Nubbin, for a long moment. They don’t say anything.',
            ),
            PX(
              'Can you hear me? The speaker works both ways, apparently. Good. That’s eerie, but good.',
            ),
            PX('The child’s the hero. You’re not. You’re their company. I’ll keep the lights on.'),
            N('The child holds out a hand to your Nubbin. Your Nubbin takes it at once.'),
            N(
              'On the screen, somewhere above you, a small red heart beats in a box. It belongs to the child.',
            ),
          ],
        },
      },
    ],
    complete: {
      id: 'pa4-01-complete',
      lines: [
        N(
          'The child stands, brushes the petals off, and walks towards the only doorway. You follow.',
        ),
        PX('Their heart’s on my screen. When anything happens, you two stand in the box with it.'),
        PX('I’ve looked at the buttons. There’s ACT. There’s MERCY. That’s the lot.', 'think'),
        PX('Somebody made a game with no way to hit anyone. I want to shake their hand.', 'happy'),
      ],
    },
    rewards: [],
    sets: { 'pa4-01': true },
    notes:
      'OPENING: the cartridge plays in Pixel’s cabinet; its progress lives in the cartridge’s own save. ' +
      'WISP (reads wisp, Grove, read-only): after pa4-01-shed’s choice, before pa4-01-shed-done, play ARCADE_PA4_VARIANTS ' +
      'pa4-01-vent-warm if wisp is spared or sable; pa4-01-vent-quiet if driven or unset. ' +
      'CLANK (reads s21Done): if set, play ARCADE_PA4_VARIANTS pa4-01-clank straight after pa4-01-shed. ' +
      'STAGING: from here on Pixel speaks from the cabinet speaker, drawn as a small portrait in a frame of scan lines. ' +
      'The fight box UI has exactly two buttons, ACT and MERCY. Never draw a FIGHT button, even greyed out. ' +
      'No music from the source, ever, not even as a hum: use our own soft ambient sound.',
  },
  // ---------------------------------------------------------------- PA4-2
  {
    id: 'pa4-02',
    code: 'PA4-2',
    title: 'The Flower',
    source: `${SRC}: Flowey and Toriel, the first room`,
    audience: 'all',
    trigger: { where: WHERE, when: after('PA4-1') },
    requires: ['PA4-1'],
    speakers: [FLOWEY, TORIEL],
    steps: [
      {
        id: 'pa4-02-s1',
        goal: 'Meet the smiling flower in the next room.',
        hint: 'Follow the child into the dark room; the flower is in the middle of it.',
        check: 'talk:pa4-flowey',
        scene: {
          id: 'pa4-02-flower',
          lines: [
            N(
              'In the next room a single golden flower grows out of the stone. It has a face, and the face is smiling.',
            ),
            FL(
              'Well, hello! New here, aren’t you? All three of you. And one of you is very small and blue.',
              'happy',
            ),
            FL(
              'You must be so confused. Somebody ought to teach you how things work down here. Lucky me!',
            ),
            N(
              'A box closes round the child’s red heart. You and your Nubbin are standing in it too.',
            ),
            FL(
              'Down here we share love through little white friendliness pellets. Catch as many as you can!',
              'happy',
            ),
            N(
              'Small white seeds spin in the air around him. Your Nubbin’s crown goes flat against its head.',
            ),
            PX('I don’t like those. My screen doesn’t like those. Don’t touch them.', 'think'),
            FL('In this world, it’s kill or be killed.', 'angry'),
            N('His smile is a different smile now. The seeds close in like a ring of teeth.'),
            N(
              'A ball of fire comes out of the dark and knocks the flower clean out of the ground. He’s gone, and the seeds go with him.',
            ),
            TO('Shoo! Back into the dirt with you, you nasty little weed.', 'angry'),
            N(
              'A tall woman with a goat’s soft face and long ears steps out of the shadow, in a purple robe.',
            ),
            TO(
              'There, now. You are all quite safe. My name is Toriel, and these old Ruins are mine to look after.',
              'soft',
            ),
            N('She takes the child’s hand without asking, the way you’d take a hand at a road.'),
          ],
        },
        done: {
          id: 'pa4-02-flower-done',
          lines: [
            N('Your Nubbin keeps looking back at the hole in the ground where the flower was.'),
            PX(
              'That flower’s line came up in red on my side. Some part of this cartridge is very sure of itself.',
              'think',
            ),
          ],
        },
      },
      {
        id: 'pa4-02-s2',
        goal: 'Decide what to do about the flower.',
        hint: 'The candy bowl is just inside the next room. Your Nubbin is pulling back towards the flowerbed.',
        check: 'choose:pa4-candy:flowerbed',
        scene: {
          id: 'pa4-02-candy',
          lines: [
            N(
              'In the next room, by the door, a bowl of wrapped sweets sits on a little stand. A sign says TAKE ONE.',
            ),
            TO(
              'Monster candy. It tastes of… well, of liquorice that isn’t liquorice. Have one, all of you.',
            ),
            N(
              'The child takes exactly one. Your Nubbin takes one too, and then, very slowly, doesn’t eat it.',
            ),
            N(
              'It looks back through the doorway, towards the bare patch of earth where the flower was.',
            ),
            PX(
              'It wants to go back. To the thing that just tried to have us. Of course it does.',
              'soft',
            ),
            PX('Your Nubbin, your call.'),
          ],
          choices: [
            {
              id: 'left',
              label: 'Leave him the candy, on the spot where he was.',
              set: { 'pa4-candy': 'left' },
              then: [
                N(
                  'Your Nubbin runs back alone and sets the sweet down on the earth, wrapper and all, very neatly.',
                ),
                N(
                  'Nothing comes up out of the ground. Your Nubbin trots back anyway, looking pleased.',
                ),
                PX(
                  'For the record, that’s a sweet for something that called us food. I’d have done the same.',
                  'soft',
                ),
              ],
            },
            {
              id: 'be',
              label: 'Leave him be. He made his feelings clear.',
              set: { 'pa4-candy': 'be' },
              then: [
                N(
                  'Your Nubbin looks at the doorway a while longer. Then it eats the sweet, slowly, and comes on.',
                ),
                PX(
                  'Fair. Some things want leaving alone. Doesn’t mean they want leaving.',
                  'think',
                ),
              ],
            },
          ],
        },
      },
    ],
    complete: {
      id: 'pa4-02-complete',
      lines: [
        TO(
          'Come along. These Ruins are full of puzzles. I will teach you, and you will be cleverer than they are.',
        ),
        N(
          'She walks ahead with the child’s hand in hers. The purple walls are covered in old writing nobody reads.',
        ),
        PX(
          'Note for later: the flower knew about saving. I don’t know how. I don’t like it.',
          'think',
        ),
      ],
    },
    rewards: [],
    sets: { 'pa4-02': true },
    childLines: {
      'pa4-02-flower#7': 'Down here, you either get the other one first, or they get you!',
    },
    notes:
      'SIGNATURE CHOICE: pa4-candy = left | be (pa4-02-candy). It pays off in PA4-17 (pa4-17-candy), PA4-18 (pa4-18-candy) ' +
      'and the last frame of PA4-19 (pa4-19-flower-turns | pa4-19-flower-still). LIFTED TEXT: pa4-02-flower#7 is the ' +
      'outline’s first quote (Flowey, Undertale, © Toby Fox), used once; the childLine replaces it. ' +
      'CARE: the pellets never touch anyone; Flowey’s second face is a cartoon grin with no teeth shown in detail; ' +
      'Toriel’s fireball knocks him away with a puff of petals, nothing more.',
  },
  // ---------------------------------------------------------------- PA4-3
  {
    id: 'pa4-03',
    code: 'PA4-3',
    title: 'The Ruins',
    source: `${SRC}: the Ruins, the training dummy and Napstablook`,
    audience: 'all',
    trigger: { where: WHERE, when: after('PA4-2') },
    requires: ['PA4-2'],
    speakers: [TORIEL, BLOOK],
    steps: [
      {
        id: 'pa4-03-s1',
        goal: 'Cross the spike floor with Toriel.',
        hint: 'Hold the child’s other hand and step only where Toriel steps.',
        check: 'puzzle:pa4-ruins:spikes',
        scene: {
          id: 'pa4-03-spikes',
          lines: [
            N(
              'The Ruins are full of switches, some labelled, some lying. Toriel explains each one as if it were a pet.',
            ),
            TO(
              'This switch is honest. That one tells fibs. You must never pull a switch just because it asks nicely.',
            ),
            N(
              'A floor of spikes lies across the next room. The safe path through it is a puzzle with no clues at all.',
            ),
            TO('This one is a little advanced for a first day. Take my hand.', 'soft'),
            N('She holds the child’s hand.'),
            N('The child holds yours. Your Nubbin holds the hem of your coat.'),
            PX('Four of you in a line. Like ducks. Very nervous ducks.'),
            N(
              'Toriel walks the twisting path without looking down once. She has done this many times, for no one.',
            ),
          ],
        },
        done: {
          id: 'pa4-03-spikes-done',
          lines: [
            TO(
              'There. Was that so bad? Puzzles are only frightening until you have a friend on the other end.',
              'happy',
            ),
            N('Your Nubbin looks back at the spikes and pulls a face at them.'),
          ],
        },
      },
      {
        id: 'pa4-03-s2',
        goal: 'Practise on the training dummy, Toriel’s way.',
        hint: 'Stand in the box with the child and press ACT, then Talk.',
        check: 'minigame:clear:pa4-dummy',
        scene: {
          id: 'pa4-03-dummy',
          lines: [
            N(
              'A cloth dummy stands in the middle of a room. Its stitched face gives nothing away.',
            ),
            TO(
              'Monsters may try to fight you. Practise on this one. Do not worry: it is only cloth.',
            ),
            N(
              'The box closes round the child’s heart, and round you and your Nubbin. Two buttons light up.',
            ),
            PX('ACT, or MERCY. There’s no third one. I’ve checked under the board.'),
            TO(
              'When someone stands in your way, you can talk to them. Try it. Say anything kind.',
              'soft',
            ),
            N('The child looks at the dummy.'),
            N('You look at the dummy. The dummy looks at a point just past all of you.'),
          ],
          choices: [
            {
              id: 'weather',
              label: 'Ask the dummy about its day.',
              then: [
                N('The dummy says nothing. It seems, somehow, glad to have been asked.'),
                TO(
                  'Splendid! That is the whole lesson. Most people only want to be asked.',
                  'happy',
                ),
              ],
            },
            {
              id: 'hat',
              label: 'Tell the dummy you like its stitching.',
              then: [
                N('The dummy says nothing, very warmly.'),
                TO(
                  'Splendid! You see? Talking is braver than it looks, and cheaper than bandages.',
                  'happy',
                ),
              ],
            },
          ],
        },
      },
      {
        id: 'pa4-03-s3',
        goal: 'Cheer up the ghost lying across the path.',
        hint: 'Talk to the ghost, or lie down beside them like your Nubbin does.',
        check: 'sit:pa4-blook',
        scene: {
          id: 'pa4-03-blook',
          lines: [
            N(
              'Something white lies across the path, pale and see-through, like a sheet that has given up.',
            ),
            BL('z… z… z…'),
            N(
              'It isn’t snoring. It’s saying the letter z out loud, very quietly, hoping you’ll go round.',
            ),
            PX(
              'It’s pretending to sleep. By saying sleep. That is the saddest thing I’ve ever seen on a screen.',
              'sad',
            ),
            N(
              'A box closes round the child’s heart. The ghost begins to cry, and the tears fall upwards, slowly, and miss you.',
            ),
            BL(
              'oh… sorry… i only came down to the ruins because there’s never anybody here…',
              'sad',
            ),
            N(
              'Your Nubbin walks over, lies flat on the cold floor next to the ghost, and looks up at the ceiling too.',
            ),
            BL('oh. you’re… lying here. with me.', 'shock'),
          ],
          choices: [
            {
              id: 'lie',
              label: 'Lie down on the floor next to them as well.',
              set: { 'pa4-blook': 'lie' },
              then: [
                N('You lie down.'),
                N(
                  'The child lies down. Four of you, flat on your backs, looking at a purple ceiling.',
                ),
                BL('…this is nice. i usually do this on my own. it’s nicer with people.', 'soft'),
                N('Nobody says anything for a while. Nobody needs to.'),
              ],
            },
            {
              id: 'joke',
              label: 'Tell them a terrible joke.',
              set: { 'pa4-blook': 'joke' },
              then: [
                Y('What do you call a ghost with no friends? Nothing yet. But give it a minute.'),
                N(
                  'Silence. Then a very small, very wobbly sound, which is a ghost trying not to laugh.',
                ),
                BL('…that was awful. i liked it. can i keep it?', 'happy'),
              ],
            },
          ],
        },
        done: {
          id: 'pa4-03-blook-done',
          lines: [
            BL(
              'i came here so nobody would see me be sad… and then everybody did… and it was fine…',
              'soft',
            ),
            BL('i’ll float along now. thanks for lying in the way with me.'),
            N(
              'The ghost fades out of the path, slowly, and you hear a very quiet thank you from the wall.',
            ),
          ],
        },
      },
    ],
    complete: {
      id: 'pa4-03-complete',
      lines: [
        TO(
          'A ghost! Oh, the poor dear. That one has been lying there on and off for a year.',
          'sad',
        ),
        TO('You did very well. You did not push past them. Pushing past is the easy thing.'),
        N('Your Nubbin is still looking back at the spot where the ghost was, its crown tilted.'),
        PX('One friend. I’m keeping a list on the back of a receipt. Don’t tell anyone.', 'happy'),
      ],
    },
    rewards: [],
    sets: { 'pa4-03': true },
    notes:
      'FRIEND FLAG: pa4-blook = lie | joke (pa4-03-blook). It picks Napstablook’s line in PA4-17 (pa4-17-blook-lie | -joke) ' +
      'and PA4-19 (pa4-19-blook-lie | -joke). Napstablook speaks in lower case on purpose (their voice; our own words). ' +
      'The upward tears never touch the box. The dummy fight cannot be lost: any ACT or MERCY ends it.',
  },
  // ---------------------------------------------------------------- PA4-4
  {
    id: 'pa4-04',
    code: 'PA4-4',
    title: 'Toriel’s House',
    source: `${SRC}: Toriel’s home in the Ruins`,
    audience: 'all',
    trigger: { where: WHERE, when: after('PA4-3') },
    requires: ['PA4-3'],
    speakers: [TORIEL],
    steps: [
      {
        id: 'pa4-04-s1',
        goal: 'Settle in at Toriel’s house: pie, a bed and a book.',
        hint: 'Sit by the fire while Toriel reads; your Nubbin will fall asleep first.',
        check: 'sit:pa4-toriel:fireside',
        scene: {
          id: 'pa4-04-house',
          lines: [
            N(
              'At the end of the Ruins stands a small house under a black tree with no leaves. The windows are lit.',
            ),
            TO(
              'I baked while you were busy with the switches. Butterscotch and cinnamon. A pie for a first day.',
              'happy',
            ),
            N(
              'There is a little bedroom with a little bed, a box of shoes in every size and a toy box that has been dusted.',
            ),
            TO(
              'I made it ready a long time ago. It is yours now. And there is a blanket for the small blue one.',
              'soft',
            ),
            N(
              'By the fire stands a big reading chair. Toriel takes a book from the shelf: A Small Book of Large Snail Facts.',
            ),
            TO(
              'Did you know that a snail can sleep for three years? I find that very relaxing to know.',
            ),
            TO('And they have thousands of teeth. Tiny ones. Do not tell them I said so.'),
            N('Your Nubbin falls asleep against the child’s arm before snail fact four.'),
            PX('The pie looks good. The pixels look good. I hate that I can’t smell it.', 'sad'),
          ],
          choices: [
            {
              id: 'more',
              label: 'Ask for another snail fact.',
              then: [
                TO(
                  'Oh, gladly! Snails can climb straight up a wall, upside down, without any fuss at all.',
                  'happy',
                ),
                N(
                  'The child laughs, without a sound. Toriel sees it, and looks happier than any snail fact.',
                ),
              ],
            },
            {
              id: 'pie',
              label: 'Ask for more pie.',
              then: [
                TO('There is always more pie. That is the first rule of this house.', 'happy'),
                N(
                  'She cuts a slice for your sleeping Nubbin too, and sets it by its nose, for when it wakes.',
                ),
              ],
            },
          ],
        },
        done: {
          id: 'pa4-04-house-done',
          lines: [
            N('The fire ticks. The book closes on a snail-shaped bookmark.'),
            PX(
              'This is the safest place I’ve seen in any game. I’m not sure that’s good news.',
              'think',
            ),
          ],
        },
      },
      {
        id: 'pa4-04-s2',
        goal: 'Follow Toriel downstairs after the child asks how to get home.',
        hint: 'Take the stairs past the front door; the corridor goes a long way.',
        check: 'walk:pa4-toriel:basement',
        scene: {
          id: 'pa4-04-home',
          lines: [
            N(
              'In the morning the child goes and stands by Toriel’s chair. They tug her sleeve, and point up.',
            ),
            N('Then they point at you, and at your Nubbin, and up again.'),
            N('Home. How do we get home?'),
            TO(
              'Home? But… there was a very interesting snail on the step this morning. Shall I tell you about it?',
            ),
            N('The child doesn’t move. Toriel closes her book.'),
            TO('Stay by the fire, little ones. I have a small job to see to downstairs.', 'sad'),
            N('She goes down the stairs by the front door, very calm, not quick at all.'),
            PX('Something’s wrong. Her walk changed. I can see it in the animation.', 'think'),
            N(
              'You go after her, with the child and your Nubbin. The corridor below is long and purple and cold.',
            ),
            TO(
              'This hall ends at the only way out of the Ruins. I am going to make sure nobody can use it.',
            ),
            TO(
              'They all leave. Every one who ever fell. And none of them ever… I will not see it again.',
              'sad',
            ),
          ],
        },
        done: {
          id: 'pa4-04-home-done',
          lines: [
            TO('Your room is ready. The pie is warm. Please. Let this be enough.', 'sad'),
            N('Nobody goes upstairs.'),
          ],
        },
      },
    ],
    complete: {
      id: 'pa4-04-complete',
      lines: [
        N(
          'At the end of the corridor is a great door with an emblem of wings on it. Toriel stands in front of it.',
        ),
        TO(
          'Then show me. Show me you could last one day beyond this door, and I will stand aside.',
        ),
        PX('She’s going to fight. She doesn’t want to. You can see both at once. Hold on.', 'sad'),
      ],
    },
    rewards: [],
    sets: { 'pa4-04': true },
    notes:
      'STAGING: warm light in the house, cooler purple in the corridor. Toriel’s fear is never explained here; PA4-13 tells ' +
      'it. Snail facts are true and harmless.',
  },
  // ---------------------------------------------------------------- PA4-5
  {
    id: 'pa4-05',
    code: 'PA4-5',
    title: 'The Door',
    source: `${SRC}: Toriel’s fight and farewell`,
    audience: 'all',
    trigger: { where: WHERE, when: after('PA4-4') },
    requires: ['PA4-4'],
    speakers: [TORIEL],
    steps: [
      {
        id: 'pa4-05-s1',
        goal: 'Spare Toriel until she understands.',
        hint: 'Press MERCY, and keep pressing it. The fire always curls away from the child.',
        check: 'minigame:mercy:pa4-toriel',
        scene: {
          id: 'pa4-05-fight',
          lines: [
            N('The box closes round the child’s heart. You and your Nubbin stand in it, close.'),
            N(
              'Toriel lifts her hands and fire comes, little white-hot leaves of it, drifting. They curl away before they reach you.',
            ),
            PX(
              'She’s missing on purpose. Every shot bends off. She’s not trying to hit. She’s trying to scare.',
              'think',
            ),
            N('The child presses MERCY.'),
            N('The fire comes again. The child presses MERCY.'),
            TO('Lift your hands! Do something! Do not just stand there being kind at me!', 'angry'),
            N(
              'Your Nubbin sits down in the middle of the box. It looks up at her and doesn’t move at all.',
            ),
          ],
          choices: [
            {
              id: 'mercy',
              label: 'MERCY. Again.',
              then: [
                N('The fire flickers. It gets smaller every time, until it’s barely a candle.'),
                TO(
                  'Why do you keep pressing that? It is not a plan. It is not a plan at all…',
                  'sad',
                ),
              ],
            },
            {
              id: 'act',
              label: 'ACT: tell her you’ll be careful out there.',
              then: [
                Y('We’ll look after each other. We will. We promise.'),
                N('The fire stops in the air, and goes out, like a held breath let go.'),
              ],
            },
          ],
        },
        done: {
          id: 'pa4-05-fight-done',
          lines: [
            TO(
              'You will not even try to win. You are making this very hard for an old woman.',
              'sad',
            ),
            N('The child presses MERCY one more time.'),
            TO(
              'All this fire, and I cannot even frighten one small person into staying safe.',
              'sad',
            ),
          ],
        },
      },
      {
        id: 'pa4-05-s2',
        goal: 'Say goodbye to Toriel at the door.',
        hint: 'Stay with the child while Toriel speaks; walk on when she has gone.',
        check: 'walk:pa4-ruins:corridor',
        scene: {
          id: 'pa4-05-goodbye',
          lines: [
            N('Toriel kneels and takes the child into a hug. She holds them a long time.'),
            TO(
              'A house is a poor thing to keep someone in. I think I have known that for a long time.',
            ),
            TO('Eat properly, all of you. Wear something warm. Be kind to snails.', 'soft'),
            TO(
              'Now go, before I change my mind. And do not come back this way. It would be too hard, the second time.',
              'sad',
            ),
            N(
              'She lets go, turns, and walks back up the long corridor. She does not look round once.',
            ),
            N(
              'Your Nubbin looks round the whole way. Every few steps it stops, and looks back, and has to be waited for.',
            ),
            PX('I’m fine. There’s dust in the cabinet. It’s an old cabinet.', 'sad'),
          ],
        },
      },
    ],
    complete: {
      id: 'pa4-05-complete',
      lines: [
        N(
          'The great door opens on cold air and a grey light. Somewhere ahead, snow is falling under the mountain.',
        ),
        N(
          'There is a small golden flower in the doorway, which wasn’t there a moment ago. Then it isn’t there again.',
        ),
        PX('Did you see that? I saw that.', 'shock'),
        N('The child takes your Nubbin’s hand again, and goes on.'),
      ],
    },
    rewards: [],
    sets: { 'pa4-05': true },
    notes:
      'FIGHT: the ACT/MERCY minigame. Toriel’s fire is white leaves of flame that visibly curl away; the child’s heart never ' +
      'loses anything. The fight ends after any mix of six MERCY or ACT presses. CARE: never show the child hurt. ' +
      'Flowey’s glimpse in the complete scene is one frame of a cartoon flower, no words.',
  },
  // ---------------------------------------------------------------- PA4-6
  {
    id: 'pa4-06',
    code: 'PA4-6',
    title: 'Snowdin Forest',
    source: `${SRC}: Snowdin Forest, Sans, Papyrus and the dogs`,
    audience: 'all',
    trigger: { where: WHERE, when: after('PA4-5') },
    requires: ['PA4-5'],
    speakers: [SANS, PAPYRUS],
    steps: [
      {
        id: 'pa4-06-s1',
        goal: 'Meet the short skeleton on the forest path.',
        hint: 'Walk on through the snow until someone follows you; then turn round and shake hands.',
        check: 'talk:pa4-sans',
        scene: {
          id: 'pa4-06-sans',
          lines: [
            N(
              'Snow, deep and blue, and tall dark pines. A branch cracks behind you, much too loud.',
            ),
            N(
              'Footsteps follow you to a little wooden bridge with a gate across it, built too wide to stop anyone.',
            ),
            N(
              'A short skeleton in a blue hoodie and pink slippers holds out his hand to the child.',
            ),
            N('The child shakes it.'),
            N('It makes a long, rude noise. There’s a whoopee cushion in his palm.'),
            SA(
              'heh. gets ’em every time. the old cushion-in-the-hand. it never gets old. it’s very old.',
              'happy',
            ),
            SA('you’re a human, right? and you brought a… what’s that. a dumpling with a crown?'),
            N('Your Nubbin offers its hand to be shaken.'),
            N('Sans shakes it, solemnly. No noise this time.'),
            SA(
              'nice. firm grip. anyway, my brother’s a human-catcher. he’s not great at it. play along, yeah?',
            ),
            PX('I like him. I don’t trust his slippers, but I like him.', 'happy'),
          ],
          choices: [
            {
              id: 'joke',
              label: 'Ask him if he’s got any more jokes.',
              then: [
                SA('only skele-ton of ’em. sorry. that one came free with the cushion.', 'happy'),
              ],
            },
            {
              id: 'cold',
              label: 'Ask if he’s cold in slippers.',
              then: [
                SA('nah. nothing gets through to me. i’ve got no body to get through to.', 'happy'),
              ],
            },
          ],
        },
        done: {
          id: 'pa4-06-sans-done',
          lines: [
            SA(
              'quick, hide behind that lamp. it’s shaped like you. sort of. nobody’ll look twice.',
            ),
            N('The lamp is not shaped like any of you. You all hide behind it anyway.'),
          ],
        },
      },
      {
        id: 'pa4-06-s2',
        goal: 'Get through Papyrus’s puzzles in the snow.',
        hint: 'Every puzzle has a way through; Papyrus will explain it if you look confused enough.',
        check: 'puzzle:pa4-papyrus:gauntlet',
        scene: {
          id: 'pa4-06-gauntlet',
          lines: [
            N(
              'A tall skeleton in a home-made battle costume strikes a pose on the bridge, with his red scarf flying.',
            ),
            PA(
              'A HUMAN! AT LAST! I, PAPYRUS, WILL CAPTURE YOU AND JOIN THE ROYAL GUARD! EVERYONE WILL ADMIRE ME!',
              'happy',
            ),
            PA('NYEH HEH HEH!', 'happy'),
            N('He has built puzzles all the way through the forest.'),
            N('Some are very clever. One is a word search with no words.'),
            PA(
              'THIS ONE IS AN ELECTRIC MAZE! IT IS INVISIBLE! THE ORB IS FOR… OH. I SHOULD BE HOLDING THE ORB.',
              'think',
            ),
            N(
              'At the last bridge he unveils his most dangerous trap: cannons, spears, fire and a dog on a rope, all hanging over the gap.',
            ),
            PA('BEHOLD! WHEN I SAY GO, IT WILL ALL ACTIVATE AT ONCE! THEN YOU WILL SEE!'),
            N(
              'He doesn’t say go. He looks at the child, and at your Nubbin, small and blue on the bridge.',
            ),
            PA(
              '…ON SECOND THOUGHT, THIS TRAP IS MUCH TOO DANGEROUS. I AM PUTTING IT AWAY. FOR NOW. ON PRINCIPLE.',
              'soft',
            ),
            N('The whole thing winches up out of sight. The dog on the rope looks relieved.'),
          ],
        },
        done: {
          id: 'pa4-06-gauntlet-done',
          lines: [
            PX(
              'He switched off his own trap because you might get hurt. He’s a terrible villain. He’s my favourite.',
              'happy',
            ),
          ],
        },
      },
      {
        id: 'pa4-06-s3',
        goal: 'Win over the guard dogs of Snowdin.',
        hint: 'In the box, press ACT and pet. Then keep petting.',
        check: 'minigame:clear:pa4-dogs',
        scene: {
          id: 'pa4-06-dogs',
          lines: [
            N(
              'Snowdin is guarded by dogs in armour. They can smell a human from a long way off, and they love being petted.',
            ),
            N('A little white dog in a helmet comes up with a sword.'),
            N('The box closes. The child pets it.'),
            N('Its neck gets longer.'),
            N('The child pets it again. Its neck gets longer still, up past the trees.'),
            PX(
              'Is that… is that in the rules? Keep going. I need to know how high this goes.',
              'shock',
            ),
            N(
              'Your Nubbin climbs on your shoulders to reach. The dog’s head is now somewhere in the clouds, wagging.',
            ),
            N(
              'Two hooded dogs sniff your Nubbin, puzzled, and then decide it is a very good pup. It is petted thoroughly.',
            ),
          ],
          choices: [
            {
              id: 'more',
              label: 'Keep petting. Never stop.',
              then: [
                N('The neck goes on past the top of the screen.'),
                N('Pixel scrolls up to follow it. It goes on.'),
                PX('I’ve stopped scrolling. Some things should stay a mystery.', 'think'),
              ],
            },
            {
              id: 'stick',
              label: 'Throw a stick instead.',
              then: [
                N(
                  'Every dog in Snowdin forgets every human in the world and runs after the stick.',
                ),
                N('Your Nubbin goes too, and comes back with it, proud, before any of them.'),
              ],
            },
          ],
        },
      },
    ],
    complete: {
      id: 'pa4-06-complete',
      lines: [
        N(
          'Snowdin town: warm windows, a shop, an inn, a tree with presents under it for nobody in particular.',
        ),
        N('Everyone wants to meet your Nubbin.'),
        N('A bunny shopkeeper asks if it’s from out of town. It’s from very out of town.'),
        SA(
          'popular, your little guy. most monsters down here have never seen a monster that shape.',
        ),
        PX('It’s a monster here. Fine. It’s a monster with fans.', 'happy'),
      ],
    },
    rewards: [],
    sets: { 'pa4-06': true },
    childLines: {
      'pa4-06-gauntlet#2': 'HA HA HAAA! WHAT A TRIUMPHANT DAY FOR ME!',
    },
    notes:
      'LIFTED TEXT: pa4-06-gauntlet#2 is Papyrus’s laugh, the outline’s second quote (Undertale, © Toby Fox), counted ' +
      'as one quote with its use in pa4-07-capture#2; the childLine replaces it. Papyrus speaks in capitals on purpose ' +
      '(his voice; our own words). Sans in lower case. The puzzles and the trap are our own versions; nothing is ' +
      'named after the source’s puzzles. The dog-petting is the ACT/MERCY minigame and cannot be lost.',
  },
  // ---------------------------------------------------------------- PA4-7
  {
    id: 'pa4-07',
    code: 'PA4-7',
    title: 'Papyrus',
    source: `${SRC}: the fight with Papyrus and the date`,
    audience: 'all',
    trigger: { where: WHERE, when: after('PA4-6') },
    requires: ['PA4-6'],
    speakers: [PAPYRUS, SANS],
    steps: [
      {
        id: 'pa4-07-s1',
        goal: 'Spare Papyrus when he finally tries to capture the child.',
        hint: 'Press MERCY every turn. His bones are slow; you can step over every one.',
        check: 'minigame:mercy:pa4-papyrus',
        scene: {
          id: 'pa4-07-capture',
          lines: [
            N(
              'At the edge of Snowdin the snow is thick and the mist is thicker. Papyrus is waiting in it, very still, for effect.',
            ),
            PA('HUMAN! THE MOMENT HAS COME! I MUST CAPTURE YOU! FOR MY DREAMS! AND ALSO FOR FAME!'),
            PA('NYEH HEH HEH!', 'happy'),
            N('The box closes.'),
            N(
              'Little white bones come sliding along the ground at walking pace. You all step over them.',
            ),
            N('One bone is so slow that your Nubbin sits on it and rides it to the other side.'),
            PA('YOU ARE NOT EVEN TRYING TO FIGHT! THAT IS VERY DIFFICULT TO CAPTURE!', 'shock'),
            PX('MERCY. Every turn. He’s hoping you’ll make it easy for him not to win.', 'think'),
            N(
              'The child presses MERCY. Papyrus throws one enormous bone, with a tiny dog sitting on it, eating it.',
            ),
            PA('…WELL. THAT DOG HAS RUINED MY BIG FINISH.', 'sad'),
          ],
          choices: [
            {
              id: 'mercy',
              label: 'MERCY.',
              then: [
                PA(
                  'YOU DO NOT WANT TO FIGHT? NOT EVEN A LITTLE? THEN I SUPPOSE I CANNOT WIN. OR LOSE. HMM.',
                  'think',
                ),
              ],
            },
            {
              id: 'act',
              label: 'ACT: tell him he’d make a great Royal Guard.',
              then: [
                PA(
                  'YOU THINK SO? OF COURSE YOU DO. EVERYONE THINKS SO. EXCEPT THE ROYAL GUARD.',
                  'happy',
                ),
              ],
            },
          ],
        },
        done: {
          id: 'pa4-07-capture-done',
          lines: [
            PA(
              'I HAVE DECIDED. WE WILL NOT BE ENEMIES. WE WILL BE… FRIENDS! IT IS FAR MORE EFFICIENT!',
              'happy',
            ),
            N(
              'He shakes the child’s hand, then yours, then your Nubbin’s, then the child’s again in case it didn’t count.',
            ),
          ],
        },
      },
      {
        id: 'pa4-07-s2',
        goal: 'Go to Papyrus’s house for the “date”.',
        hint: 'Papyrus’s house is the one with the flag and the doghouse. Say something nice when he asks.',
        check: 'visit:pa4-papyrus:house',
        scene: {
          id: 'pa4-07-date',
          lines: [
            PA(
              'NOW, HUMAN. I HAVE READ ABOUT THIS. WHEN TWO PEOPLE BECOME FRIENDS, ONE OF THEM ASKS THE OTHER ON A DATE.',
            ),
            PA(
              'I AM ASKING. YOU MAY BRING THE SMALL BLUE ONE AND THE TALL ONE. IT WILL BE A GROUP DATE. A VERY GOOD ONE.',
            ),
            N(
              'The house is tidy except for one sock on the floor, which has notes stuck to it, asking Sans to pick it up.',
            ),
            N(
              'Papyrus puts on his best clothes, which is a T-shirt that says COOL DUDE in bubble letters.',
            ),
            N('He flexes.'),
            N('He flexes again. He stops flexing, a little out of breath.'),
            PA(
              'FOR OUR DINNER, I HAVE MADE MY SPECIALITY: SPAGHETTI! I MADE IT YESTERDAY! IT IS STILL VERY GOOD!',
            ),
            N(
              'Your Nubbin is given the best chair, with a cushion on it, and a napkin tucked in round its neck.',
            ),
            PA('GUEST OF HONOUR! BECAUSE YOU ARE THE SMALLEST AND BLUEST.', 'happy'),
            N(
              'The spaghetti is stuck together in one solid lump. Your Nubbin eats it anyway, with great dignity.',
            ),
            PA(
              'WELL? WHAT DO YOU THINK? OF ME? OF THIS? OF EVERYTHING? BE HONEST. BUT ALSO NICE.',
              'think',
            ),
          ],
          choices: [
            {
              id: 'puzzles',
              label: 'Tell him his puzzles were the best part of your day.',
              set: { 'pa4-papyrus': 'puzzles' },
              then: [
                PA(
                  'THE BEST PART? EVEN THE ONE WITH NO WORDS IN IT? I KNEW IT! I KNEW IT WAS AVANT-GARDE!',
                  'happy',
                ),
              ],
            },
            {
              id: 'pasta',
              label: 'Tell him it’s the best spaghetti you’ve ever had.',
              set: { 'pa4-papyrus': 'pasta' },
              then: [
                PA(
                  'IT IS ONLY THE BEST SO FAR! WAIT UNTIL I AM TAUGHT BY A PROFESSIONAL! IT WILL BE TERRIFYING!',
                  'happy',
                ),
              ],
            },
          ],
        },
        done: {
          id: 'pa4-07-date-done',
          lines: [
            PA(
              'I HAVE THOUGHT ABOUT IT, AND I LIKE YOU ALL VERY MUCH. AS FRIENDS. THE BEST KIND OF LIKING.',
              'soft',
            ),
            N('The child nods, very seriously. That settles it.'),
          ],
        },
      },
    ],
    complete: {
      id: 'pa4-07-complete',
      lines: [
        PA(
          'IF YOU EVER NEED ANYTHING, CALL ME. HERE. I HAVE WRITTEN MY NUMBER ON A BONE.',
          'happy',
        ),
        SA('he’s been practising that date for two years. thanks for being his first.', 'soft'),
        N('Your Nubbin keeps its napkin on all the way out of Snowdin.'),
        PX(
          'Two friends on the receipt. Three if you count the dog on the bone. I’m counting the dog.',
          'happy',
        ),
      ],
    },
    rewards: [],
    sets: { 'pa4-07': true },
    childLines: {
      'pa4-07-capture#2': 'HA HA HAAA! PREPARE TO BE CAPTURED, VERY POLITELY!',
    },
    notes:
      'FRIEND FLAG: pa4-papyrus = puzzles | pasta (pa4-07-date). It picks Papyrus’s line in PA4-17 and PA4-19. ' +
      'LIFTED TEXT: pa4-07-capture#2, Papyrus’s laugh (counted with pa4-06-gauntlet#2 as one quote); childLine given. ' +
      'CARE: the “date” is pure friendship, played for laughs, and says so. The bones are slow and soft-edged.',
  },
  // ---------------------------------------------------------------- PA4-8
  {
    id: 'pa4-08',
    code: 'PA4-8',
    title: 'Waterfall',
    source: `${SRC}: Waterfall, the echo flowers, the wishing room and Monster Kid`,
    audience: 'all',
    trigger: { where: WHERE, when: after('PA4-7') },
    requires: ['PA4-7'],
    speakers: [KID, ECHO],
    steps: [
      {
        id: 'pa4-08-s1',
        goal: 'Walk through Waterfall and listen to the echo flowers.',
        hint: 'Stand by each blue flower; it repeats the last thing said near it.',
        check: 'explore:pa4-waterfall:echo-flowers',
        scene: {
          id: 'pa4-08-echo',
          lines: [
            N(
              'Blue grass, dark water and the sound of falling water everywhere, even where you can’t see any.',
            ),
            N(
              'Tall blue flowers grow by the path. When you pass, one of them speaks in a voice that isn’t yours.',
            ),
            EC('…I hope my brother likes the scarf. I knitted it backwards…', 'soft'),
            PX(
              'Echo flowers. They repeat the last thing said near them. Even years ago. Even if nobody’s listening.',
              'think',
            ),
            N('A young monster runs up, yellow and striped, with no arms and an enormous grin.'),
            MK(
              'Yo! Are you going to see Undyne? Everyone wants to see Undyne! She’s the coolest! Can I come?',
              'happy',
            ),
            N(
              'He doesn’t wait for an answer. He falls over, gets up and follows you everywhere after that.',
            ),
            MK(
              'Is that your monster? What’s it do? Can it do a flip? I can’t do a flip. I’ve got no arms. I’ve tried.',
            ),
            N('Your Nubbin tries a flip, for him.'),
            N('It lands on its bottom. He thinks it’s the best flip he has ever seen.'),
          ],
          choices: [
            {
              id: 'say',
              label: 'Say something kind into an echo flower.',
              then: [
                Y('Whoever finds this: you’re doing better than you think.'),
                EC('…you’re doing better than you think…', 'soft'),
                N('It will say that to the next person who passes. And the next.'),
              ],
            },
            {
              id: 'listen',
              label: 'Just listen to them all.',
              then: [
                EC('…don’t forget to water the tomatoes…'),
                EC('…I’m not scared. I’m not. I’m only a little bit scared…'),
              ],
            },
          ],
        },
      },
      {
        id: 'pa4-08-s2',
        goal: 'Find the room where monsters made wishes on stones.',
        hint: 'Go up the side passage where the ceiling glitters.',
        check: 'visit:pa4-waterfall:wishing-room',
        scene: {
          id: 'pa4-08-wish',
          lines: [
            N(
              'A wide cave. Its ceiling is full of small shining stones, scattered like a night sky.',
            ),
            N(
              'A sign says that long ago, monsters came here to wish, because under the mountain they couldn’t see the stars.',
            ),
            N('They wished on the stones instead.'),
            N('They knew they weren’t stars. It didn’t stop anybody.'),
            MK(
              'My mum says if you whisper it, it counts double. I don’t know if that’s true. I always whisper anyway.',
            ),
            N(
              'An echo flower grows under the brightest stone. Your Nubbin goes up to it and leans in close.',
            ),
            N('It doesn’t speak.'),
            N('Nubbins don’t. But it makes a tiny sound, a sort of hum, very close to the petals.'),
          ],
          choices: [
            {
              id: 'home',
              label: 'Wonder what it wished for, and let it keep it.',
              then: [
                N('The flower plays the hum back, very quietly.'),
                N('You still don’t know what it means. That’s fine.'),
                PX('Wishes don’t work if you tell. It knows the rules. Good Nubbin.', 'soft'),
              ],
            },
            {
              id: 'too',
              label: 'Whisper a wish of your own beside it.',
              then: [
                N(
                  'You lean in and whisper. The flower plays back your wish and the Nubbin’s hum, together.',
                ),
                N('The child closes their eyes and wishes too, without a sound.'),
              ],
            },
          ],
        },
        done: {
          id: 'pa4-08-wish-done',
          lines: [
            MK(
              'Yo, that was really nice. I wished for arms. Every time. One day it’s gonna work.',
              'happy',
            ),
          ],
        },
      },
    ],
    complete: {
      id: 'pa4-08-complete',
      lines: [
        N(
          'Further on, the grass is tall and dark. Something in armour moves through it, slow and heavy.',
        ),
        MK('That’s her. That’s Undyne. She’s hunting a human. Isn’t that the coolest?', 'happy'),
        N('The child goes very still.'),
        N('Your Nubbin goes very still. Monster Kid does not notice either.'),
        PX('Stay in the grass. Don’t breathe loud. I’m not breathing at all.', 'shock'),
      ],
    },
    rewards: [],
    sets: { 'pa4-08': true },
    notes:
      'STAGING: Waterfall is blue and dim with sparkle in the ceiling. The echo-flower lines are all our own. ' +
      'The wishing stones are a quiet moment; no music, just water. The Nubbin hums (a sound, not speech).',
  },
  // ---------------------------------------------------------------- PA4-9
  {
    id: 'pa4-09',
    code: 'PA4-9',
    title: 'Undyne',
    source: `${SRC}: Undyne’s hunt and the water cooler`,
    audience: 'all',
    trigger: { where: WHERE, when: after('PA4-8') },
    requires: ['PA4-8'],
    speakers: [KID, UNDYNE],
    steps: [
      {
        id: 'pa4-09-s1',
        goal: 'Cross the bridge over the chasm with Monster Kid.',
        hint: 'Walk slowly; when Monster Kid slips, stay with him until help comes.',
        check: 'walk:pa4-waterfall:bridge',
        scene: {
          id: 'pa4-09-bridge',
          lines: [
            N(
              'A narrow bridge over a long drop. Monster Kid runs ahead, as he does everywhere, and trips, as he does everywhere.',
            ),
            N('He goes over the edge and catches the planks with his teeth, hanging by his chin.'),
            MK('I’m fine! I’m totally fine! I’m holding on with my face!', 'shock'),
            N('At the far end, Undyne stands in her armour.'),
            N('She sees the kid. She sees all of you.'),
            N('She runs, not at you. She drops to her knees and hauls him up by his stripes.'),
            MK(
              'Undyne… um. Can you not hurt them? They’re my friends. Even the little blue one. Especially that one.',
              'sad',
            ),
            UN('…Kid. Go home. Your parents are worried.', 'soft'),
          ],
          choices: [
            {
              id: 'thanks',
              label: 'Thank Monster Kid.',
              then: [
                MK(
                  'Course! That’s what friends do! I think. I’ve never had any before. Is that what they do?',
                  'happy',
                ),
              ],
            },
            {
              id: 'undyne',
              label: 'Thank Undyne for saving him.',
              then: [UN('Don’t. Don’t thank me. That makes this harder.', 'angry')],
            },
          ],
        },
      },
      {
        id: 'pa4-09-s2',
        goal: 'Run from Undyne, all the way to Hotland.',
        hint: 'Keep running; the spears always land behind you.',
        check: 'walk:pa4-hotland:run',
        scene: {
          id: 'pa4-09-run',
          lines: [
            UN(
              'No more running. Seven humans, and this barrier comes down. I’m sorry. You seem nice.',
              'angry',
            ),
            N('Spears of blue light come down like rain, always a step behind you. You run.'),
            PX('Run. I’m holding right. I’m holding right so hard the stick might break.', 'shock'),
            N(
              'Through the grass, over the boardwalks, down a long dark slope. Your Nubbin rides on your shoulders and looks back.',
            ),
            N('The air gets hotter.'),
            N('The ground goes red. Hotland is a land of rock and steam and orange light.'),
            N(
              'Behind you, the clanking slows. Undyne staggers out of Waterfall in full armour, into the heat.',
            ),
            N('She takes three steps and falls flat on her face, cooked inside her own armour.'),
          ],
        },
        done: {
          id: 'pa4-09-run-done',
          lines: [
            PX('She’s overheating. She’s a fish. Fish and lava. Somebody do something.', 'shock'),
          ],
        },
      },
      {
        id: 'pa4-09-s3',
        goal: 'Bring Undyne water from the cooler.',
        hint: 'There’s a water cooler by the lift. Fill a cup and pour it over her.',
        check: 'carry:pa4-water-cup:undyne',
        scene: {
          id: 'pa4-09-water',
          lines: [
            N(
              'By the lift stands a water cooler, all by itself, as if it had been waiting for this its whole life.',
            ),
            N(
              'The child fills a paper cup. Your Nubbin carries it, both hands, not spilling a drop.',
            ),
            N('Undyne lies face down, steaming. She doesn’t move when you all walk up to her.'),
            N('Her armour ticks as it cools, like a kettle that has been taken off the stove.'),
            PX(
              'Is she all right? Tell me she’s all right. I don’t have a health bar for her.',
              'shock',
            ),
            N(
              'Your Nubbin looks up at you, then at the cup, then at the fish in the armour. It has a plan.',
            ),
          ],
          choices: [
            {
              id: 'pour',
              label: 'Pour it gently over her helmet.',
              then: [
                N(
                  'The water runs into her armour with a hiss. She sits up, dripping, and stares at all three of you.',
                ),
              ],
            },
            {
              id: 'second',
              label: 'Go back for a second cup. And a third.',
              then: [
                N(
                  'Three cups later she sits up, dripping, with a small puddle in each boot. She stares at you.',
                ),
              ],
            },
          ],
        },
        done: {
          id: 'pa4-09-water-done',
          lines: [
            UN('…', 'shock'),
            N('She gets up. She opens her mouth.'),
            N('She shuts it. She stomps back into Waterfall without a word.'),
            PX(
              'That’s the most confused anyone has ever looked. I’ve been confused. That was more.',
              'happy',
            ),
          ],
        },
      },
    ],
    complete: {
      id: 'pa4-09-complete',
      lines: [
        N(
          'Your Nubbin throws the empty cup in the bin by the cooler. It’s very particular about bins.',
        ),
        N('The child’s heart beats on Pixel’s screen, steady and red.'),
        PX('Nobody hurt. Nobody. I keep checking, like it might change. It doesn’t.', 'soft'),
      ],
    },
    rewards: [],
    sets: { 'pa4-09': true },
    notes:
      'CARE: Monster Kid’s fall is brief and comic; he is never in real danger on screen for more than two seconds. ' +
      'The spears always land behind. Undyne collapses from heat, comic, not hurt.',
  },
  // ---------------------------------------------------------------- PA4-10
  {
    id: 'pa4-10',
    code: 'PA4-10',
    title: 'The Cooking Lesson',
    source: `${SRC}: Undyne’s house`,
    audience: 'all',
    trigger: { where: WHERE, when: after('PA4-9') },
    requires: ['PA4-9'],
    speakers: [PAPYRUS, UNDYNE],
    steps: [
      {
        id: 'pa4-10-s1',
        goal: 'Go with Papyrus to Undyne’s house.',
        hint: 'It’s the house shaped like a fish, in Waterfall. Papyrus will knock.',
        check: 'visit:pa4-undyne:house',
        scene: {
          id: 'pa4-10-door',
          lines: [
            N(
              'Papyrus catches up with you in Waterfall, waving. Behind him stands a house shaped like a big blue fish.',
            ),
            PA('I HAVE A PLAN! YOU AND UNDYNE WILL BE FRIENDS! I WILL SIMPLY INSIST!', 'happy'),
            PA(
              'SHE IS MY BEST FRIEND. SHE TEACHES ME COOKING. SHE IS VERY STRONG AND VERY LOUD AND VERY GOOD.',
            ),
            N(
              'He knocks. Undyne opens the door in a vest and a ponytail, sees the child, and sees your Nubbin.',
            ),
            UN('…', 'angry'),
            PA(
              'HELLO, UNDYNE! I HAVE BROUGHT YOU SOME HUMANS! FOR FRIENDSHIP! I WILL BE GOING NOW! GOODBYE!',
            ),
            N(
              'He shoves you all inside, jumps out of the window and runs back in through the door.',
            ),
            PA('I FORGOT I WAS STAYING.', 'happy'),
          ],
        },
        done: {
          id: 'pa4-10-door-done',
          lines: [
            UN(
              'Fine. FINE. If we’re going to be friends, we’re going to be the BEST friends. Right now. By force.',
              'angry',
            ),
          ],
        },
      },
      {
        id: 'pa4-10-s2',
        goal: 'Learn to make spaghetti, Undyne’s way.',
        hint: 'Pound the vegetables, stir the pot, and choose how high to turn the stove.',
        check: 'craft:pa4-spaghetti',
        scene: {
          id: 'pa4-10-cook',
          lines: [
            UN(
              'Papyrus wanted cooking lessons. So I give him cooking lessons. Today, you’re in class too.',
              'happy',
            ),
            UN('Step one. The vegetables. They are your enemy. Show them who’s boss!'),
            N('The child pats the tomato.'),
            N('Undyne punches it to pulp on the board. The child pats the next one, more firmly.'),
            N('Your Nubbin sits on a carrot until it gives up.'),
            UN(
              'Step two. The noodles. Throw them in the pot! Not in the bag! Stop being polite to the noodles!',
              'angry',
            ),
            N(
              'The pasta goes in, bag and all. Then the pot gets stirred so hard it starts to wear through the bottom.',
            ),
            PA('THIS IS EXACTLY HOW IT ALWAYS GOES. IT IS WONDERFUL. I AM TAKING NOTES.', 'happy'),
            UN('Step three. The heat. How hot do we go?', 'think'),
          ],
          choices: [
            {
              id: 'hot',
              label: 'All the way up. Hotter than that.',
              set: { 'pa4-undyne': 'hot' },
              then: [
                UN('YES! I like you! NOBODY ever says hotter!', 'happy'),
                N(
                  'She turns the knob past the last number, and then a bit further, with a spanner.',
                ),
              ],
            },
            {
              id: 'low',
              label: 'Maybe turn it down a bit?',
              set: { 'pa4-undyne': 'low' },
              then: [
                UN(
                  'Down? DOWN? …Huh. Nobody’s ever said that. I’m going to think about it. Later.',
                  'think',
                ),
                N('She turns it down by one. Then, out of habit, she turns it up by six.'),
              ],
            },
          ],
        },
        done: {
          id: 'pa4-10-cook-done',
          lines: [
            N('The pot glows.'),
            N('The stove glows. The curtains, quite suddenly, are on fire.'),
            PX('That’s fire. That’s real fire. Everyone out. Out out out.', 'shock'),
          ],
        },
      },
    ],
    complete: {
      id: 'pa4-10-complete',
      lines: [
        N(
          'You all stand outside and watch the fish-shaped house burn, quite cheerfully, from the tail to the nose.',
        ),
        N('Everyone is fine.'),
        N('Your Nubbin is holding the saucepan, which it rescued. It is black all over.'),
        UN(
          '…Well. Guess we’re friends now. Nobody burns down a house with somebody they don’t like.',
          'happy',
        ),
        UN('Here. My number. Call me if you need anybody suplexed. Or saved. Or both.'),
        PA(
          'I SHALL BE STAYING AT MY HOUSE, AS USUAL. UNDYNE IS STAYING AT MY HOUSE TOO, AS A SURPRISE TO ME.',
          'happy',
        ),
        PX(
          'Three. Three friends. And a burnt pan. Can I have the pan? Bring the pan out with you.',
          'happy',
        ),
      ],
    },
    rewards: [
      {
        id: 'pa4-burnt-saucepan',
        kind: 'decor',
        label: 'Burnt Saucepan',
        description:
          'Black from rim to handle. Your Nubbin saved it from a fish-shaped house on fire, where nobody was hurt.',
      },
    ],
    sets: { 'pa4-10': true },
    notes:
      'FRIEND FLAG: pa4-undyne = hot | low (pa4-10-cook). It picks Undyne’s line in PA4-17 and PA4-19; the house burns ' +
      'either way. REWARD: the Burnt Saucepan decoration, one-time, delivered to the Grove inventory at pa4-10-complete ' +
      '(cosmetic only; the cartridge writes no Grove flag). CARE: the fire is cartoon flames; nobody is inside; it is played ' +
      'for laughs and everyone says they’re fine.',
  },
  // ---------------------------------------------------------------- PA4-11
  {
    id: 'pa4-11',
    code: 'PA4-11',
    title: 'Hotland',
    source: `${SRC}: Hotland, Alphys’s lab and Mettaton’s shows`,
    audience: 'all',
    trigger: { where: WHERE, when: after('PA4-10') },
    requires: ['PA4-10'],
    speakers: [ALPHYS, METTATON],
    steps: [
      {
        id: 'pa4-11-s1',
        goal: 'Meet Alphys, the royal scientist, in her lab.',
        hint: 'The lab is the big white building at the top of the slope.',
        check: 'talk:pa4-alphys',
        scene: {
          id: 'pa4-11-lab',
          lines: [
            N(
              'A big white lab sits on top of the red rock, humming. Inside, it’s dark, full of screens and noodle cups.',
            ),
            N(
              'A small yellow lizard in a lab coat spins round on her chair and nearly falls off it.',
            ),
            AL(
              'Oh! Oh no. I mean hi! I mean, I’ve been watching you on the cameras. Not in a strange way. In a science way.',
              'shock',
            ),
            AL(
              'I’m Alphys. I’m the royal scientist. I’m supposed to be very good at things. I’m… mostly good at some things.',
            ),
            AL(
              'Your little blue friend is fascinating. Is it a monster? Is it a human? Is it soup? Sorry. Sorry.',
            ),
            N(
              'Your Nubbin looks at her screen, which is playing a cartoon. It sits down to watch.',
            ),
            AL(
              'Oh, you like it too! Okay. Okay okay okay. I can help you through Hotland. I’ll be on your phone. Guiding.',
              'happy',
            ),
            PX(
              'Another voice in your ear. Fine. I was here first. I’m player two. She can be player two-and-a-half.',
              'think',
            ),
          ],
        },
        done: {
          id: 'pa4-11-lab-done',
          lines: [
            AL(
              'Oh, and, um, there’s a robot. He’s mine. I built him. Sort of. He hosts shows. He’s… about to be a problem.',
            ),
          ],
        },
      },
      {
        id: 'pa4-11-s2',
        goal: 'Play along with Mettaton’s quiz show.',
        hint: 'Answer the questions; Alphys signals the right one from off-stage.',
        check: 'minigame:clear:pa4-quiz-show',
        scene: {
          id: 'pa4-11-quiz',
          lines: [
            N(
              'The lights snap on. A boxy robot with a single wheel and a lot of sparkle rolls into the middle of the floor.',
            ),
            MT(
              'Ohhh YES! Welcome, beauties, to the show where the only prize is surviving! Our contestants!',
              'happy',
            ),
            N('Confetti falls.'),
            N('The child blinks at it. Your Nubbin tries to catch it all.'),
            MT('Question one! What is the capital of my heart? You have five seconds, darlings!'),
            N('Behind the camera, Alphys holds up a sign. It says B, with a smiley face.'),
            PX('She’s helping. Badly. Lovingly. Press B.', 'think'),
            MT(
              'Correct! Question two! What does the royal scientist have a big crush on? Ha! Just kidding. Unless…',
              'happy',
            ),
            N('Alphys drops her sign and hides behind a pillar.'),
          ],
          choices: [
            {
              id: 'b',
              label: 'B, for whatever it is.',
              then: [
                MT('A brave guess! Wrong! Splendid television! The audience LOVES you!', 'happy'),
              ],
            },
            {
              id: 'nubbin',
              label: 'Let your Nubbin press a button.',
              then: [
                N('Your Nubbin presses every button at once. All the lights go green.'),
                MT('Is that… allowed? It is now! Ratings are UP!', 'shock'),
              ],
            },
          ],
        },
      },
      {
        id: 'pa4-11-s3',
        goal: 'Get through Hotland’s lifts, lasers and cooking show.',
        hint: 'Every trap is part of the show; play along and Alphys will open the next door.',
        check: 'puzzle:pa4-hotland:lasers',
        scene: {
          id: 'pa4-11-show',
          lines: [
            N(
              'Hotland goes on: steam vents, conveyor belts, lifts that only go to the wrong floor, and lasers, blue and orange.',
            ),
            AL(
              'Blue lasers, stand still! Orange lasers, keep moving! I made a rhyme for it! It doesn’t rhyme yet!',
            ),
            N(
              'In a kitchen built for television, Mettaton challenges you to bake a cake in one minute, live.',
            ),
            MT(
              'Darlings, we need milk, sugar and eggs! The eggs are, unfortunately, on top of that tower.',
              'happy',
            ),
            N(
              'Your Nubbin is the smallest and lightest. It is lifted up by a jet pack Alphys calls “nearly finished”.',
            ),
            N(
              'It comes back down with a carton of milk and an expression of deep personal betrayal.',
            ),
            PX('That’s my Nubbin. I mean, your Nubbin. Our Nubbin. That was brilliant.', 'happy'),
            N('Mettaton’s next show is a news report. Then a musical with no music.'),
            N('Then a quiz again. It’s all one show.'),
            AL(
              'He just… keeps going. I think he wants someone to tell him he’s a star. I should tell him. I never tell anyone anything.',
              'sad',
            ),
          ],
        },
        done: {
          id: 'pa4-11-show-done',
          lines: [
            N(
              'At the end of a long corridor stands a tall building of pipes and light: the Core, Hotland’s great engine.',
            ),
            AL('He’s in there. His last show. Be careful. Be… dramatic. That’s what he likes.'),
          ],
        },
      },
    ],
    complete: {
      id: 'pa4-11-complete',
      lines: [
        N(
          'You stop in front of the Core and look up. It hums like a hive, so big you can feel it in your teeth.',
        ),
        PX(
          'Something about Alphys is off. She keeps glancing at a door at the back of her lab. Noting it.',
          'think',
        ),
        N('Your Nubbin straightens its crown with both hands. It knows a stage when it sees one.'),
      ],
    },
    rewards: [],
    sets: { 'pa4-11': true },
    notes:
      'STAGING: Hotland is a run of short shows, each a small minigame; none can be failed, only played. The laser rule ' +
      '(blue: stand still, orange: move) is shown, not lectured. No music from the source.',
  },
  // ---------------------------------------------------------------- PA4-12
  {
    id: 'pa4-12',
    code: 'PA4-12',
    title: 'Mettaton',
    source: `${SRC}: Mettaton’s final show in the Core`,
    audience: 'all',
    trigger: { where: WHERE, when: after('PA4-11') },
    requires: ['PA4-11'],
    speakers: [METTATON, BLOOK, ALPHYS],
    steps: [
      {
        id: 'pa4-12-s1',
        goal: 'Spare Mettaton by giving his audience the show they want.',
        hint: 'Press ACT and play to the crowd until the ratings bar is full.',
        check: 'minigame:mercy:pa4-mettaton',
        scene: {
          id: 'pa4-12-show',
          lines: [
            N('A stage in the middle of the Core.'),
            N('Lights. A crowd somewhere, cheering, though you can’t see them.'),
            N(
              'Mettaton steps out, new: tall and sleek, with legs that go on for a very long time.',
            ),
            MT(
              'Ohhh YES. Darlings, it’s the grand finale! Live to every screen in the Underground! Let’s make it beautiful!',
              'happy',
            ),
            N('The box closes round the child’s heart. Above it, a bar fills slowly: the ratings.'),
            PX(
              'There’s a ratings bar. You don’t beat him. You give him a good show. That’s the whole fight.',
              'think',
            ),
            MT('Show them what you’ve got! Pose! Dance! Do something with that little blue face!'),
          ],
          choices: [
            {
              id: 'pose',
              label: 'ACT: strike a pose. Get your Nubbin to strike one too.',
              set: { 'pa4-mettaton': 'pose' },
              then: [
                N('You pose.'),
                N(
                  'The child poses. Your Nubbin poses with one arm in the air and holds it, trembling, for ages.',
                ),
                MT('YES! The ratings! Look at the ratings! The little one is a NATURAL!', 'happy'),
              ],
            },
            {
              id: 'encore',
              label: 'ACT: shout “Encore!” before he’s even finished.',
              set: { 'pa4-mettaton': 'encore' },
              then: [
                N('Your Nubbin claps, both hands, very fast.'),
                N('The child joins in. The invisible crowd goes wild.'),
                MT('An encore? In the middle? Darlings, you’re rewriting television!', 'happy'),
              ],
            },
          ],
        },
        done: {
          id: 'pa4-12-show-done',
          lines: [
            N(
              'The ratings bar fills and goes on filling, off the end, past the edge of Pixel’s screen.',
            ),
            MT('Oh my. We have a call coming in. Live. On my show. Who is—'),
          ],
        },
      },
      {
        id: 'pa4-12-s2',
        goal: 'Hear the call that comes in at the end of the show.',
        hint: 'Stay on stage while the caller speaks.',
        check: 'watch:pa4-mettaton:call',
        scene: {
          id: 'pa4-12-call',
          lines: [
            BL('oh… hi… it’s me… um, hi, cousin…', 'soft'),
            N('It’s the ghost from the Ruins. The one who lay on the floor.'),
            BL(
              'i just wanted to say… i watch every show… they’re the only thing that makes me feel… like i’m somewhere…',
              'soft',
            ),
            BL(
              'and i saw my friends on there. the ones who were nice to me. so… thank you. that’s all. bye…',
              'happy',
            ),
            N('Mettaton stands very still. For a moment he isn’t a show at all.'),
            MT(
              '…Blooky. I left home to be a star. I didn’t know anyone at home was watching.',
              'soft',
            ),
            MT(
              'If I went up to the surface, who would they watch? No. The show stays down here. So do I.',
              'soft',
            ),
            AL('He’s… staying. Oh. Oh, good. I mean, scientifically good.', 'happy'),
          ],
        },
      },
    ],
    complete: {
      id: 'pa4-12-complete',
      lines: [
        MT(
          'Darlings. That was the best episode of my career. Now go on. Somebody up ahead needs an audience too.',
          'soft',
        ),
        N('He blows your Nubbin a kiss.'),
        N('Your Nubbin catches it and puts it in its pocket. It doesn’t have a pocket.'),
        PX('Four friends. I’m going to need a second receipt.', 'happy'),
      ],
    },
    rewards: [],
    sets: { 'pa4-12': true },
    notes:
      'FRIEND FLAG: pa4-mettaton = pose | encore (pa4-12-show). It picks Mettaton’s line in PA4-17 and PA4-19. ' +
      'The fight cannot be lost: the ratings bar only rises. The call is Napstablook (same lower-case voice as PA4-3). ' +
      'If pa4-blook is “joke”, the call may add the line “i told my friends your joke…” (optional, not required).',
  },
  // ---------------------------------------------------------------- PA4-13
  {
    id: 'pa4-13',
    code: 'PA4-13',
    title: 'New Home',
    source: `${SRC}: New Home, the history and the golden corridor`,
    audience: 'all',
    trigger: { where: WHERE, when: after('PA4-12') },
    requires: ['PA4-12'],
    speakers: [FOLK, SANS],
    steps: [
      {
        id: 'pa4-13-s1',
        goal: 'Walk through New Home and hear the monsters’ story.',
        hint: 'Walk slowly through the grey town; a monster steps out at each corner with one part of it.',
        check: 'walk:pa4-new-home:story',
        scene: {
          id: 'pa4-13-story',
          lines: [
            N(
              'New Home is grey: grey houses, grey streets, grey light. A monster steps out of a doorway as you pass.',
            ),
            FO(
              'Long ago, a human child fell down here. The king’s son found them, and brought them home.',
            ),
            FO(
              'The prince and the human grew up like brother and sister. Everyone was happy. Every street was hopeful.',
            ),
            FO(
              'Then one day the human child got very ill. They didn’t get better. That was how it went.',
              'sad',
            ),
            N('Your Nubbin takes the child’s hand. The child holds on tightly.'),
            FO(
              'The prince carried them up to the surface, to the village of flowers they came from. He only wanted to bring them home.',
            ),
            FO(
              'The humans saw a monster holding their child, and they were frightened. He wouldn’t fight back, and they hurt him.',
              'sad',
            ),
            FO(
              'He came home and lay down in the castle garden, among the golden flowers, and faded into dust.',
              'sad',
            ),
            FO(
              'The king and queen lost both their children in a night. After that, the king closed his heart. The queen left.',
            ),
            PX(
              'Toriel. The queen was Toriel. That’s why the little room. That’s why the shoes in every size.',
              'sad',
            ),
          ],
        },
        done: {
          id: 'pa4-13-story-done',
          lines: [
            N('The last monster nods and goes back inside. The street is quiet.'),
            N(
              'The golden flowers in the castle garden ahead are the same ones you landed on. You notice that, and say nothing.',
            ),
          ],
        },
      },
      {
        id: 'pa4-13-s2',
        goal: 'Walk the long golden corridor.',
        hint: 'Walk to the middle of the corridor; someone is waiting there.',
        check: 'walk:pa4-corridor:golden',
        scene: {
          id: 'pa4-13-corridor',
          lines: [
            N(
              'A long corridor of gold, with tall windows and pillars, and the light coming through like late afternoon.',
            ),
            N('Sans is standing in the middle of it. He isn’t smiling quite the usual way.'),
            SA('so. you’ve come a long way. long enough to work out what this place counts.'),
            SA(
              'down here we measure what you’ve been doing. how much you’ve hurt. how much you’ve learned by hurting.',
            ),
            SA(
              'and you. you’ve hurt nobody. not one. not the dummy, not the dogs, not the robot. nobody.',
              'soft',
            ),
            SA('that counts, kid. that’s the only thing that ever really counts.', 'soft'),
            N(
              'He looks at you, and at your Nubbin, as if he is seeing you properly for the first time.',
            ),
            SA('and you two. you stuck with ’em. that counts as well.'),
          ],
          choices: [
            {
              id: 'easy',
              label: 'It wasn’t hard. Everyone was kind back.',
              then: [SA('heh. that’s the trick, isn’t it. most people never go first.', 'soft')],
            },
            {
              id: 'nubbin',
              label: 'It was the Nubbin’s idea, mostly.',
              then: [SA('figures. small ones know stuff. i should know. i’m one of ’em.', 'happy')],
            },
          ],
        },
      },
    ],
    complete: {
      id: 'pa4-13-complete',
      lines: [
        SA(
          'go on. the king’s through there. he’s a big softie. he’s also gonna fight you. both are true.',
        ),
        N('Your Nubbin hugs Sans’s leg. He pats its crown, once.'),
        PX(
          'I don’t like where this is going. I’m going to make a save. Just in case. Just because I can.',
          'think',
        ),
      ],
    },
    rewards: [],
    sets: { 'pa4-13': true },
    notes:
      'CARE: the backstory is told as the monsters tell it, in short lines, one per monster: sad, short, no detail of the ' +
      'illness and none of the hurt. Never show the first child or Asriel in pain; the monsters only tell it. ' +
      'SAVE: Pixel’s save in pa4-13-complete is the save she loads in PA4-14. The corridor is our own wording; Sans’s ' +
      'judgement speech is not quoted.',
  },
  // ---------------------------------------------------------------- PA4-14
  {
    id: 'pa4-14',
    code: 'PA4-14',
    title: 'The King',
    source: `${SRC}: Asgore (the neutral ending is skipped)`,
    audience: 'all',
    trigger: { where: WHERE, when: after('PA4-13') },
    requires: ['PA4-13'],
    speakers: [ASGORE],
    steps: [
      {
        id: 'pa4-14-s1',
        goal: 'Have tea with the king in his garden.',
        hint: 'Go through the throne room; the king is watering his flowers.',
        check: 'talk:pa4-asgore:tea',
        scene: {
          id: 'pa4-14-tea',
          lines: [
            N('The throne room is a garden.'),
            N(
              'Golden flowers cover the floor. A huge man with horns and a beard is watering them.',
            ),
            AS(
              'Oh! Visitors. I am sorry, I did not hear you. Will you have some tea first? It is golden flower tea.',
              'soft',
            ),
            N(
              'He pours tea for the child, for you, and a very small cup for your Nubbin, with a saucer.',
            ),
            AS(
              'I always wonder what the weather is doing, up there. Down here we cannot tell. I like to guess sunny.',
            ),
            AS(
              'I am sorry. I am so sorry. I have done a terrible thing for a long time, and I do not know how to stop.',
              'sad',
            ),
            N(
              'He doesn’t say what it is. He looks past you, at the pale light of the barrier through the far door.',
            ),
            AS(
              'When you are ready, come through. Do not hurry. Finish your tea. There is no rush at all.',
              'soft',
            ),
          ],
          choices: [
            {
              id: 'stop',
              label: 'You don’t have to fight.',
              then: [
                AS(
                  'I wish that were true. I have promised so many people. I am so tired of promises.',
                  'sad',
                ),
              ],
            },
            {
              id: 'tea',
              label: 'Thank him for the tea.',
              then: [
                AS('You are welcome. It is a good tea. My wife used to make it better.', 'soft'),
              ],
            },
          ],
        },
      },
      {
        id: 'pa4-14-s2',
        goal: 'Stand in the box with the child when the king fights.',
        hint: 'There is nothing to press. Pixel will act.',
        check: 'watch:pa4-mercy-button',
        scene: {
          id: 'pa4-14-break',
          lines: [
            N(
              'Beyond the garden is a white room, and beyond it the barrier: a wall of pale light that keeps every monster in.',
            ),
            N('The box closes round the child’s heart. You and your Nubbin stand beside it.'),
            N(
              'Asgore lifts a great red trident. Then he swings it down, not at you, but at the MERCY button.',
            ),
            N('It breaks in two.'),
            N('The pieces fall out of the box and fade. Only ACT is left, and ACT is greyed out.'),
            AS('I am sorry. I have to. Please understand.', 'sad'),
            N(
              'In the lantern shed, there is a sharp crack. Pixel’s own MERCY button has split clean down the middle.',
            ),
            PX('No.', 'angry'),
            PX('No. Not like this.', 'sad'),
            N(
              'Her hands move fast. She goes into the menu, past the options, to the save she made in the golden corridor.',
            ),
            PX(
              'Loading. We’re not having that ending. We’ll find the one with everybody in it.',
              'angry',
            ),
          ],
        },
      },
    ],
    complete: {
      id: 'pa4-14-complete',
      lines: [
        N('The screen goes black.'),
        N(
          'Then gold. You are back in the long corridor, and Sans is gone, and the light is the same.',
        ),
        N(
          'In the shed, Pixel is taping her MERCY button back together with a bit of black tape from her pocket.',
        ),
        PX('It doesn’t do anything now. It still goes click. That’ll do.', 'soft'),
        PX(
          'There’s a better ending. I can feel it in the board. We just haven’t made enough friends yet.',
          'think',
        ),
        N(
          'Your Nubbin pats the taped button, gently, the way it patted the heart on the cartridge.',
        ),
      ],
    },
    rewards: [
      {
        id: 'pa4-taped-mercy',
        kind: 'decor',
        label: 'Taped MERCY Button',
        description:
          'Snapped in two and mended with black tape. It does nothing when pressed. It still goes click.',
      },
    ],
    sets: { 'pa4-14': true },
    notes:
      'CARE: the neutral ending is skipped. Asgore’s fight stops the moment the button breaks; Flowey never appears and ' +
      'Asgore is never hurt or killed on screen. Pixel loads the save from pa4-13-complete. The credits note must say: ' +
      '“The neutral ending is not shown in this cartridge.” The six coffins are seen as closed, plain shapes, ' +
      'one line only. Pixel’s lines “No.” and “No. Not like this.” are the outline’s own words. ' +
      'REWARD: the Taped MERCY Button decoration, one-time, at pa4-14-complete.',
  },
  // ---------------------------------------------------------------- PA4-15
  {
    id: 'pa4-15',
    code: 'PA4-15',
    title: 'The Letter',
    source: `${SRC}: Undyne’s letter and Alphys at the dump`,
    audience: 'all',
    trigger: { where: WHERE, when: after('PA4-14') },
    requires: ['PA4-14'],
    speakers: [UNDYNE, ALPHYS, PAPYRUS],
    steps: [
      {
        id: 'pa4-15-s1',
        goal: 'Carry Undyne’s letter to Alphys.',
        hint: 'Go back to Snowdin, where Undyne is staying with Papyrus, then down to Alphys’s lab.',
        check: 'deliver:pa4-letter:alphys',
        scene: {
          id: 'pa4-15-letter',
          lines: [
            PX(
              'Before the king, there’s something we missed. Go back. Talk to everyone. Trust me.',
              'think',
            ),
            N(
              'Back through the Underground. In Snowdin, Undyne is in Papyrus’s kitchen, eating his spaghetti with grim loyalty.',
            ),
            UN(
              'You! I need a favour. A big one. I can’t do it myself, because I’ll mess it up.',
              'shock',
            ),
            N('She holds out a letter.'),
            N('It is pink. It has a heart drawn on it, then crossed out, then drawn again.'),
            UN(
              'Give this to Alphys. Don’t read it. Don’t look at it. Don’t let the small blue one look at it!',
              'angry',
            ),
            N('Your Nubbin immediately covers its eyes with both hands, and walks into a wall.'),
            PA(
              'A LETTER! A ROMANTIC LETTER! I HAVE NEVER BEEN SO EXCITED ABOUT SOMEONE ELSE’S POST!',
              'happy',
            ),
          ],
          choices: [
            {
              id: 'sealed',
              label: 'Promise to deliver it sealed.',
              then: [UN('Good. Great. Thanks. Now go before I take it back.', 'happy')],
            },
            {
              id: 'help',
              label: 'Ask what you should say when you hand it over.',
              then: [
                UN(
                  'Say… nothing! Say it’s from Undyne! Say it’s not a big deal! It’s a huge deal!',
                  'shock',
                ),
              ],
            },
          ],
        },
        done: {
          id: 'pa4-15-letter-done',
          lines: [
            N(
              'In the lab, Alphys looks at the pink envelope as if it might explode. She takes it with two fingers.',
            ),
            AL(
              'Oh. Oh. Is this… do you want to go somewhere? With me? Now? To talk? I need… somewhere to talk.',
              'shock',
            ),
          ],
        },
      },
      {
        id: 'pa4-15-s2',
        goal: 'Go to the rubbish dump with Alphys and listen.',
        hint: 'Sit with her by the water and wait; she’ll say it when she’s ready.',
        check: 'sit:pa4-alphys:dump',
        scene: {
          id: 'pa4-15-dump',
          lines: [
            N(
              'Alphys takes you to the rubbish dump in Waterfall. Things from the surface wash down here: old toys, a fridge, a chair.',
            ),
            AL(
              'This is a date. I think. Or practice for a date. Or a friend… thing. Sorry. I’ve never done any of them.',
              'think',
            ),
            AL(
              'I come here to find stuff from the surface. Cartoons. They make people look so brave. Braver than people are.',
            ),
            N(
              'Your Nubbin finds a rubber duck and gives it to her. She holds it tightly with both hands.',
            ),
            N('She reads the letter. She goes very red.'),
            N('Then very pale. She doesn’t look happy at all.'),
            AL(
              'She… she likes me. She really likes me. And she doesn’t know what I did. Nobody knows what I did.',
              'sad',
            ),
            AL(
              'I’ve been hiding something. A big something. I lied to everyone because I was scared. I’m still scared.',
              'sad',
            ),
            N('Nobody says anything.'),
            N('You sit down beside her on the old chair. Your Nubbin sits on your knee.'),
            N('Alphys stands up very fast, says sorry four times, and runs off with the duck.'),
          ],
        },
      },
    ],
    complete: {
      id: 'pa4-15-complete',
      lines: [
        PX(
          'Back to her lab. The door at the back. The one she kept looking at. That’s where it is.',
          'think',
        ),
        N('The child nods. Somewhere far below you, a lift is waiting in the dark.'),
        N('Your Nubbin is already walking.'),
        N('It knows the way. It always seems to know the way to someone sad.'),
      ],
    },
    rewards: [],
    sets: { 'pa4-15': true },
    notes:
      'CARE: the “date” is friendship played for laughs and Alphys’s nerves; Undyne’s letter is a crush, kept sweet and ' +
      'never shown in full. Pixel’s first line sends you back: in the source the friends are made before the king; here ' +
      'the reload in PA4-14 puts you back before the corridor, and the letter is the one thing left.',
  },
  // ---------------------------------------------------------------- PA4-16
  {
    id: 'pa4-16',
    code: 'PA4-16',
    title: 'The True Lab',
    source: `${SRC}: the True Lab and the Amalgamates`,
    audience: 'all',
    trigger: { where: WHERE, when: after('PA4-15') },
    requires: ['PA4-15'],
    speakers: [ALPHYS],
    steps: [
      {
        id: 'pa4-16-s1',
        goal: 'Go down beneath Alphys’s lab.',
        hint: 'The lift behind the door at the back of the lab goes down. Take a light.',
        check: 'explore:pa4-true-lab',
        scene: {
          id: 'pa4-16-down',
          lines: [
            N(
              'The door at the back of Alphys’s lab is open. A lift goes down, slowly, into a dim green light.',
            ),
            N('Below is a long, quiet lab, older than the one above.'),
            N('The lights flicker. Water drips somewhere.'),
            PX(
              'Turn the brightness up. There. It’s just a dark room. Dark rooms are just rooms.',
              'think',
            ),
            N('On the walls are notes in Alphys’s handwriting. You read one.'),
            N('Then another. The child reads them too.'),
            N(
              'Monsters who were very ill, who were about to fade. Alphys tried to help them stay, and something went wrong.',
            ),
            N(
              'They didn’t fade. They woke up, all together, melted into each other: kind and lost and very confused.',
            ),
            N(
              'She couldn’t face their families. So she kept them down here, and told nobody, and they waited.',
            ),
            N('Your Nubbin holds your hand very tightly, and doesn’t let go.'),
          ],
        },
        done: {
          id: 'pa4-16-down-done',
          lines: [
            N('Something soft and white comes slowly round a corner.'),
            N('It has too many faces, all of them gentle. It wants to be patted.'),
          ],
        },
      },
      {
        id: 'pa4-16-s2',
        goal: 'Comfort the lost monsters, one at a time.',
        hint: 'In the box, press ACT: pet one, play with one, sit still with one. MERCY when each is calm.',
        check: 'minigame:mercy:pa4-lost-ones',
        scene: {
          id: 'pa4-16-comfort',
          lines: [
            N('The box closes round the child’s heart.'),
            N('The lost ones come slowly, one by one. None of them means harm.'),
            N('The first is like a great soft dog made of many dogs.'),
            N('It wants to be petted. It wants to be petted a lot.'),
            N(
              'The second is all smiles and confusion, and wants something to chase. Your Nubbin throws a stick for it.',
            ),
            N(
              'The third only stands there, very sad, with a long murmur like a radio between stations.',
            ),
            N(
              'Behind them, a fourth one hides its faces in its hands, as if it has been shy for a very long time.',
            ),
            PX('No fighting. No running. Just… be with them. Like the ghost on the floor.', 'soft'),
          ],
          choices: [
            {
              id: 'pet',
              label: 'Pet the big soft one first.',
              then: [
                N('It rolls over.'),
                N('All of its many noses wag. The child pets every single one.'),
                N('Then the next one. Then the next.'),
              ],
            },
            {
              id: 'sit',
              label: 'Sit still beside the sad one first.',
              then: [
                N('You sit down on the cold floor.'),
                N('Your Nubbin sits next to you. The sad one sits too, slowly.'),
                N(
                  'Its murmur goes quiet. After a while it rests its head on your shoulder, and the others come closer.',
                ),
              ],
            },
          ],
        },
        done: {
          id: 'pa4-16-comfort-done',
          lines: [
            N(
              'One by one the lost ones settle, and grow quiet, and follow you about like big gentle shadows.',
            ),
          ],
        },
      },
      {
        id: 'pa4-16-s3',
        goal: 'Stay with Alphys while she tells the truth.',
        hint: 'Find Alphys at the end of the lab and stand with her.',
        check: 'watch:pa4-families',
        scene: {
          id: 'pa4-16-truth',
          lines: [
            N('Alphys is at the end of the lab, holding the rubber duck. She has seen all of it.'),
            AL(
              'You were kind to them. I wasn’t. I was scared, and I hid them, and I let everyone wait.',
              'sad',
            ),
            AL(
              'I thought keeping them down here was keeping them. It wasn’t. It was just keeping them away.',
              'sad',
            ),
            N('She picks up the old phone on the wall.'),
            N('Her hand shakes. She dials anyway.'),
            AL(
              'Hello? It’s Alphys. I have to tell you something. Something I should have told you a long time ago.',
            ),
            N('Later the families come, down the lift, in twos and threes.'),
            N('They aren’t angry. They’re just glad.'),
            N('Each lost one is led home by someone who knew them all along.'),
          ],
        },
      },
    ],
    complete: {
      id: 'pa4-16-complete',
      lines: [
        N('Undyne comes down last.'),
        N('She doesn’t shout. She puts her arms round Alphys and doesn’t let go for a long time.'),
        AL(
          'I told the truth. I actually told it. I didn’t know it would feel like this. Like I can breathe.',
          'soft',
        ),
        PX(
          'Keeping them hidden wasn’t keeping them. Somebody in the Grove said that once. About a stone.',
          'soft',
        ),
        N('Your Nubbin climbs into your arms and stays there all the way back up the lift.'),
      ],
    },
    rewards: [],
    sets: { 'pa4-16': true },
    notes:
      'CARE: the True Lab is dim, never frightening. No jump scares, no sudden sounds, no lights going out with a bang. ' +
      'The lost ones are drawn soft, pale and gentle, with sad kind faces; they never chase. The comfort fight cannot be lost. ' +
      'The third rule is acted out in pa4-16-comfort’s “sit” choice, never quoted. Pixel’s closing line echoes the shard’s ' +
      'lesson in the Grove without naming it.',
  },
  // ---------------------------------------------------------------- PA4-17
  {
    id: 'pa4-17',
    code: 'PA4-17',
    title: 'Everyone',
    source: `${SRC}: the barrier, the friends and Flowey’s rise`,
    audience: 'all',
    trigger: { where: WHERE, when: after('PA4-16') },
    requires: ['PA4-16'],
    speakers: [ASGORE, TORIEL, SANS, PAPYRUS, UNDYNE, ALPHYS, FLOWEY, ASRIEL],
    steps: [
      {
        id: 'pa4-17-s1',
        goal: 'Go back to the king, and see who comes after you.',
        hint: 'Walk through the corridor to the barrier room. Don’t press anything yet.',
        check: 'walk:pa4-barrier',
        scene: {
          id: 'pa4-17-barrier',
          lines: [
            N('The barrier room again. Asgore again, with his trident, sad as a closed shop.'),
            AS('You came back. I hoped you wouldn’t. I am sorry. Here we are again.', 'sad'),
            N(
              'The box closes. Then a ball of fire flies in from the doorway and knocks the trident clean out of his hands.',
            ),
            TO(
              'Asgore. Put that down. You will not touch a hair on that child’s head. Or any of their heads.',
              'angry',
            ),
            N(
              'Toriel walks in, tall and furious, in the same purple robe. She stands between him and the child.',
            ),
            AS('Tori? You… you came back.', 'shock'),
            TO('I did not come back for you, Asgore. I came for them.', 'angry'),
          ],
          choices: [
            {
              id: 'stand',
              label: 'Stand beside Toriel.',
              then: [
                N('You stand beside her. So does your Nubbin.'),
                N('So does the child. She doesn’t look down, but she smiles.'),
              ],
            },
            {
              id: 'between',
              label: 'Step between them both.',
              then: [
                N(
                  'You step into the middle. Two very large, very sad people look down at you, and neither of them moves.',
                ),
              ],
            },
          ],
        },
      },
      {
        id: 'pa4-17-s2',
        goal: 'Watch your friends arrive, one after another.',
        hint: 'Nothing to press. Everyone you made friends with is coming.',
        check: 'watch:pa4-friends',
        scene: {
          id: 'pa4-17-friends',
          lines: [
            N('Footsteps in the corridor.'),
            N('A lot of footsteps. The door bangs open.'),
            PA('STOP! NOBODY FIGHT! I HAVE ORGANISED A FRIENDSHIP INTERVENTION!', 'happy'),
            N(
              'In they come: Papyrus, and Undyne behind him with a spear she isn’t holding up, and Alphys behind her.',
            ),
            N(
              'Then a little cloud of tears falling upwards: the ghost from the Ruins. Then a lot of sparkle: Mettaton.',
            ),
            N(
              'Sans comes last, with his hands in his pockets, as if he just happened to be passing.',
            ),
            SA('heya. thought you might want a crowd. you’ve got one.'),
            N('Everyone talks at once. Toriel tells Asgore off.'),
            N('Undyne tells Toriel she’s amazing. Alphys tells nobody anything.'),
            PX(
              'Every single one. I didn’t think they’d all come. I should have. Look at them.',
              'soft',
            ),
          ],
        },
      },
      {
        id: 'pa4-17-s3',
        goal: 'See what the flower does.',
        hint: 'Stay together. Whatever happens, stay by the child.',
        check: 'watch:pa4-flowey:rise',
        scene: {
          id: 'pa4-17-rise',
          lines: [
            N(
              'Vines come up through the floor. In a moment everyone you love down here is caught fast and lifted off the ground.',
            ),
            N(
              'A golden flower rises out of the stone in the middle of them all. He is smiling his first smile.',
            ),
            FL(
              'Look at you all. Together. Holding hands. It’s sweet. It’s really, truly sweet.',
              'happy',
            ),
            FL(
              'You know what I learned, from watching you? That a crowd of friends is a very big pile of power.',
              'angry',
            ),
            N(
              'He draws something out of the room: six small human lights, and every monster’s light, all at once.',
            ),
            N('The flower grows into a tall, terrible child with horns and a long black coat.'),
            N('He is laughing.'),
            AR('Do you know who I am now? Look at me. Look. Don’t you remember?'),
            PX('That’s the prince. That’s Asriel. Oh no. Oh, no, you poor thing.', 'sad'),
          ],
        },
      },
    ],
    complete: {
      id: 'pa4-17-complete',
      lines: [
        AR(
          'I’m going to keep you here. All of you. Forever. And we’ll play, and play, and nobody will ever leave again.',
        ),
        N(
          'The child doesn’t run. They stand in the box and look up at him, and your Nubbin stands right beside them.',
        ),
        PX(
          'There’s no MERCY button now. There’s only… there’s a new button. It says SAVE. I don’t think it means the game.',
          'think',
        ),
      ],
    },
    rewards: [],
    sets: { 'pa4-17': true },
    notes:
      'FRIENDS (Tier 3): after pa4-17-friends line 6 (Sans), before line 7, play one ARCADE_PA4_VARIANTS scene per friend in this order: ' +
      'pa4-17-blook-lie | -joke (pa4-blook), pa4-17-papyrus-puzzles | -pasta (pa4-papyrus), pa4-17-undyne-hot | -low ' +
      '(pa4-undyne), pa4-17-mettaton-pose | -encore (pa4-mettaton). Unset (never in normal play): the first value. ' +
      'CANDY (signature, Tier 3): if pa4-candy = left, play ARCADE_PA4_VARIANTS pa4-17-candy after pa4-17-rise line 7 (“Don’t you ' +
      'remember?”), before line 8; if be, nothing. CARE: Asriel’s form is light, wings of colour and noise, never gore; ' +
      'the vines hold, never hurt. Flowey’s grin stays cartoon. Flowey never repeats his PA4-2 line.',
  },
  // ---------------------------------------------------------------- PA4-18
  {
    id: 'pa4-18',
    code: 'PA4-18',
    title: 'Asriel',
    source: `${SRC}: the last fight with Asriel`,
    audience: 'all',
    trigger: { where: WHERE, when: after('PA4-17') },
    requires: ['PA4-17'],
    speakers: [ASRIEL, TORIEL, PAPYRUS, UNDYNE, SANS, WISP],
    steps: [
      {
        id: 'pa4-18-s1',
        goal: 'Call back your friends, and your Nubbin, through the dark.',
        hint: 'Press SAVE on each friend in turn. When your Nubbin goes quiet, keep calling its name.',
        check: 'minigame:mercy:pa4-asriel',
        scene: {
          id: 'pa4-18-dark',
          lines: [
            N(
              'The world goes dark, then bright with stars and colours, all of them coming at you and none of them landing.',
            ),
            AR(
              'Come on! Fight me! I’ve got everyone’s power! I’ve got everything! Why won’t you even try?',
              'angry',
            ),
            N(
              'The child reaches into the dark and finds something: Toriel, faintly, as if from far away. She doesn’t know them.',
            ),
            N('The child holds on. Pie.'),
            N('Snails. The long corridor.'),
            N('Toriel’s eyes clear, and she smiles.'),
            TO('…My child. Of course. Of course I know you.', 'soft'),
            N('Then Papyrus.'),
            N('Then Undyne. Then Sans, who pretends he knew all along.'),
            N(
              'Then your Nubbin stops. It stands beside you in the box with blank eyes, and doesn’t know you either.',
            ),
            PX(
              'Call it. Its name. Call it till it hears you. I’m calling too, from out here.',
              'shock',
            ),
          ],
          choices: [
            {
              id: 'name',
              label: 'Call its name. Over and over.',
              then: [
                N('You call.'),
                N('You call again. On the fifth time, its crown twitches.'),
                N(
                  'Then its eyes are its eyes, and it throws itself at your knees so hard you both sit down.',
                ),
              ],
            },
            {
              id: 'sit',
              label: 'Sit down beside it, and say its name quietly.',
              then: [
                N(
                  'You sit down in the middle of the noise and the stars. You say its name, softly, again and again.',
                ),
                N('It looks down at you. Then it climbs into your lap, and stays.'),
              ],
            },
          ],
        },
        done: {
          id: 'pa4-18-dark-done',
          lines: [
            UN('HA! I knew it! Nobody forgets this lot for long!', 'happy'),
            PA('I REMEMBER EVERYTHING! ESPECIALLY THE SPAGHETTI!', 'happy'),
          ],
        },
      },
      {
        id: 'pa4-18-s2',
        goal: 'Stay with Asriel while he stops.',
        hint: 'Don’t press anything. Let him say it.',
        check: 'talk:pa4-asriel:sorry',
        scene: {
          id: 'pa4-18-sorry',
          lines: [
            N(
              'The stars go out one by one. Asriel gets smaller and smaller, until he’s just a boy, kneeling on the floor.',
            ),
            AR(
              'I’m… I’m so sorry. I didn’t want to be alone. I didn’t want you to leave. Everyone always leaves.',
              'sad',
            ),
            AR(
              'When I was a flower I couldn’t feel anything. Not even sorry. I’m sorry now. That’s the worst part.',
              'sad',
            ),
            N('The child hugs him. He cries into their striped shoulder for a long time.'),
            AR(
              'I’m going to open the barrier. And then I have to go back. When I’m a flower again, I’ll forget how to care.',
            ),
            AR('So don’t come and find me. Please. Just… let me have been good, once.', 'sad'),
            N(
              'He breaks the barrier. It goes up like sunlight through a window, and then it isn’t there.',
            ),
          ],
          choices: [
            {
              id: 'stay',
              label: 'You could come with us.',
              then: [AR('I can’t. But thank you for asking. Nobody ever asked.', 'soft')],
            },
            {
              id: 'remember',
              label: 'We’ll remember you, even if you don’t.',
              then: [AR('Then that’s enough. That’s more than I had.', 'soft')],
            },
          ],
        },
      },
    ],
    complete: {
      id: 'pa4-18-complete',
      lines: [
        N('Asriel walks away into the dark beyond the barrier room.'),
        N('He doesn’t look back. That’s the only kind thing he can do.'),
        N('Your Nubbin watches him go until there is nothing left to watch.'),
        PX('Spare the wretched one. Even if he’ll forget it. Especially then.', 'soft'),
      ],
    },
    rewards: [],
    sets: { 'pa4-18': true },
    notes:
      'CANDY (signature, pays off sixteen quests after PA4-2): if pa4-candy = left, play ARCADE_PA4_VARIANTS pa4-18-candy after ' +
      'pa4-18-sorry’s choice, before pa4-18-complete. WISP (reads wisp, Grove, read-only): after pa4-18-complete, if wisp is ' +
      'spared or sable play pa4-18-wisp-warm; if driven play pa4-18-wisp-driven (the cabinet goes dark for a minute, then ' +
      'resumes); if unset, nothing. CARE: the god form is light, noise and colour, never gore; nobody is hurt; the forgetting ' +
      'is shown as blank eyes, briefly, never as fear.',
  },
  // ---------------------------------------------------------------- PA4-19
  {
    id: 'pa4-19',
    code: 'PA4-19',
    title: 'The Surface',
    source: `${SRC}: the walk out of the mountain`,
    audience: 'all',
    trigger: { where: WHERE, when: after('PA4-18') },
    requires: ['PA4-18'],
    speakers: [TORIEL, SANS, PAPYRUS, UNDYNE, ALPHYS, ASGORE],
    steps: [
      {
        id: 'pa4-19-s1',
        goal: 'Walk out of the mountain with everyone.',
        hint: 'Go up through the place the barrier used to be. Everyone will follow.',
        check: 'walk:pa4-mountain:sunrise',
        scene: {
          id: 'pa4-19-sunrise',
          lines: [
            N('You all walk out of the mountain together, into the open air. It is morning.'),
            N(
              'The sun is coming up over a valley full of trees. None of the monsters has ever seen it.',
            ),
            AS(
              'Oh. Oh, look at that. I guessed sunny. All those years, and I guessed right.',
              'soft',
            ),
            N('Your Nubbin runs out into the sunlight and spins round, crown up, arms out.'),
            N(
              'The child stands beside Toriel, squinting. Undyne shades her eyes, and Sans takes his hands out of his pockets.',
            ),
            PX(
              'That’s just the sky. It’s not even a very good sky, pixel-wise. I’m crying anyway.',
              'sad',
            ),
          ],
        },
        done: {
          id: 'pa4-19-sunrise-done',
          lines: [
            N(
              'Everyone stands in a row on the hillside and watches the sun come up, and nobody says anything for a while.',
            ),
          ],
        },
      },
      {
        id: 'pa4-19-s2',
        goal: 'Stay with the child while Toriel asks them something.',
        hint: 'Stand by the child; when they answer, say goodbye to everyone.',
        check: 'talk:pa4-toriel:home',
        scene: {
          id: 'pa4-19-home',
          lines: [
            TO(
              'Child. I know you have a home somewhere. But if you would like… you could come and live with me.',
              'soft',
            ),
            N('The child looks at her for a long moment. Then they nod, and take her hand.'),
            N('Then they look up at everyone, and for the first time, they speak.'),
            N('They tell everyone their name. It’s Frisk.'),
            TO('Frisk. What a lovely name. Thank you for telling us.', 'happy'),
            PA('FRISK! I SHALL NEVER FORGET IT! I MAY WRITE IT ON A BONE!', 'happy'),
            N(
              'Frisk turns to you and your Nubbin, and holds out their hand. Your Nubbin shakes it, very solemnly.',
            ),
            PX(
              'Time to come home, you two. The cartridge is done. The good ending. The one with everybody.',
              'soft',
            ),
          ],
          choices: [
            {
              id: 'goodbye',
              label: 'Say goodbye to Frisk.',
              then: [N('Frisk hugs you, quickly, and then hugs your Nubbin for much longer.')],
            },
            {
              id: 'thanks',
              label: 'Thank Frisk for letting you come along.',
              then: [
                N(
                  'Frisk smiles, and points at your Nubbin, and then at their own heart. You understand.',
                ),
              ],
            },
          ],
        },
      },
    ],
    complete: {
      id: 'pa4-19-complete',
      lines: [
        N(
          'The screen fades to gold. You are standing in the lantern shed, with your Nubbin, in a striped jumper that wasn’t there before.',
        ),
        N(
          'Pixel leans back from the cabinet. Her taped MERCY button sits beside her, and a pot with one golden flower in it.',
        ),
        PX(
          'I typed our names on the high score. There wasn’t a score. I typed them anyway.',
          'happy',
        ),
        PX('Nobody got hurt. Not one. That’s the high score.', 'soft'),
      ],
    },
    rewards: [
      {
        id: 'pa4-striped-jumper',
        kind: 'cosmetic',
        label: 'Striped Jumper',
        description:
          'Blue and pink stripes, in Nubbin size. From a friend who never needed to hurt anyone.',
      },
      {
        id: 'pa4-golden-flower-pot',
        kind: 'decor',
        label: 'Golden Flower Pot',
        description:
          'One golden flower in a clay pot, for beside the cottage door. It never says a word.',
      },
      {
        id: 'pa4-high-score-plate',
        kind: 'item',
        label: 'Mercy High-Score Plate',
        description: 'A brass plate for High Score Night. Score: nobody hurt.',
      },
    ],
    sets: { 'pa4-19': true, 'pa4-done': true },
    notes:
      'FRIENDS (Tier 3): after pa4-19-sunrise line 2 (Asgore), before line 3, play one ARCADE_PA4_VARIANTS scene per friend in this ' +
      'order: pa4-19-blook-lie | -joke, pa4-19-papyrus-puzzles | -pasta, pa4-19-undyne-hot | -low, pa4-19-mettaton-pose | ' +
      '-encore. LAST FRAME (signature): after pa4-19-home’s choice, before pa4-19-complete, play pa4-19-flower-turns if ' +
      'pa4-candy = left, pa4-19-flower-still if be. AFTER THE CARTRIDGE: once pa4-19-complete ends, if wisp is spared or ' +
      'sable play pa4-end-wisp-asleep; if s21Done play pa4-end-clank. REWARDS (one-time): the Striped Jumper cosmetic, the ' +
      'Golden Flower Pot decoration (by the cottage door) and the high-score plate. SIM: pa4-done counts towards High Score ' +
      'Night (any two of PA1–PA5 done). CREDITS NOTE: “The neutral ending is not shown in this cartridge.”',
  },
];

// =================================================================== variants

/**
 * Variant scenes chosen by flags. Each quest’s notes say exactly where each plays.
 *   wisp (Grove, read-only): pa4-01-vent-warm | pa4-01-vent-quiet; pa4-18-wisp-warm | pa4-18-wisp-driven;
 *     pa4-end-wisp-asleep.
 *   s21Done (Grove, read-only): pa4-01-clank, pa4-end-clank.
 *   pa4-candy (PA4-2): pa4-17-candy, pa4-18-candy, pa4-19-flower-turns | pa4-19-flower-still.
 *   pa4-blook, pa4-papyrus, pa4-undyne, pa4-mettaton: the friends’ lines in PA4-17 and PA4-19.
 */
export const ARCADE_PA4_VARIANTS: Scene[] = [
  // ---------------------------------------------------------------- PA4-1 (wisp, s21Done)
  {
    id: 'pa4-01-vent-warm',
    lines: [
      N(
        'From the vent under the cabinet comes a dry little hiss. Two pale eyes, one ear torn, catch the glow of the screen.',
      ),
      PX(
        'Wisp. He’s come in out of the cold. The cabinet’s warm underneath. Let him watch.',
        'soft',
      ),
    ],
  },
  {
    id: 'pa4-01-vent-quiet',
    lines: [N('The vent under the cabinet is quiet. The fan inside turns over, and that’s all.')],
  },
  {
    id: 'pa4-01-clank',
    lines: [
      N(
        'Clank is sitting on top of the cabinet with his legs over the edge, like a gargoyle that’s been told to cheer up.',
      ),
      N('He leans down to look at the heart on the label, and his eye-light goes a little pink.'),
    ],
  },
  // ---------------------------------------------------------------- PA4-17 friends
  {
    id: 'pa4-17-blook-lie',
    lines: [
      BL(
        'i lay down on the floor of the corridor to get here… it seemed polite… i’m standing now…',
        'soft',
      ),
    ],
  },
  {
    id: 'pa4-17-blook-joke',
    lines: [
      BL(
        'i’ve been telling everyone your joke… it’s still awful… they all laughed though…',
        'happy',
      ),
    ],
  },
  {
    id: 'pa4-17-papyrus-puzzles',
    lines: [
      PA(
        'I HAVE BROUGHT A PUZZLE FOR THE KING TO SOLVE INSTEAD OF FIGHTING! IT HAS NO WORDS IN IT! FOR CALM!',
        'happy',
      ),
    ],
  },
  {
    id: 'pa4-17-papyrus-pasta',
    lines: [
      PA(
        'I HAVE BROUGHT SPAGHETTI! NOBODY CAN FIGHT WITH A MOUTH FULL OF SPAGHETTI! THAT IS SCIENCE!',
        'happy',
      ),
    ],
  },
  {
    id: 'pa4-17-undyne-hot',
    lines: [
      UN('Nobody touches my friends! I’ll turn this whole room up to hotter than hot!', 'angry'),
    ],
  },
  {
    id: 'pa4-17-undyne-low',
    lines: [
      UN(
        'Everybody calm down! I’m turning it down! See? Down by one! That’s me being calm!',
        'angry',
      ),
    ],
  },
  {
    id: 'pa4-17-mettaton-pose',
    lines: [
      MT(
        'Darlings, I’m only here for my co-star. The small blue one. Strike a pose, sweetheart.',
        'happy',
      ),
    ],
  },
  {
    id: 'pa4-17-mettaton-encore',
    lines: [MT('Did someone say encore? Darlings, I never miss a cue.', 'happy')],
  },
  // ---------------------------------------------------------------- PA4-17 candy
  {
    id: 'pa4-17-candy',
    lines: [
      AR('You left me a sweet once. On the dirt, where I’d been. I found it.', 'think'),
      AR(
        'I didn’t know what to feel about it. I didn’t know how to feel anything. I kept it anyway.',
        'sad',
      ),
      N('Your Nubbin looks up at him. It isn’t frightened at all.'),
    ],
  },
  // ---------------------------------------------------------------- PA4-18 candy and wisp
  {
    id: 'pa4-18-candy',
    lines: [
      AR('Your little blue one. It left me that candy, didn’t it?', 'soft'),
      AR(
        'Will you give it one from me? From the bowl, in the Ruins. Tell it… tell it I said thank you.',
        'soft',
      ),
      N(
        'Later, on the way out, you take one sweet from the bowl. Your Nubbin eats it very slowly, looking back.',
      ),
    ],
  },
  {
    id: 'pa4-18-wisp-warm',
    lines: [
      N(
        'In the lantern shed, there’s a sound from the vent under the cabinet. Two whispers, one over the other.',
      ),
      WI('spared… warm…', 'soft'),
      N(
        'Pixel doesn’t say anything. She turns the cabinet’s volume down a notch, so as not to wake him.',
      ),
    ],
  },
  {
    id: 'pa4-18-wisp-driven',
    lines: [
      PX('We didn’t, with ours.', 'sad'),
      N('She switches the cabinet off.'),
      N('The shed is dark and quiet for a minute. Then she switches it back on.'),
    ],
  },
  // ---------------------------------------------------------------- PA4-19 friends
  {
    id: 'pa4-19-blook-lie',
    lines: [
      BL(
        'i’m going to lie down in the grass. it’s like the ruins floor, but it’s green. …it’s nice.',
        'happy',
      ),
    ],
  },
  {
    id: 'pa4-19-blook-joke',
    lines: [
      BL(
        'what do you call a ghost in the sunshine? …i don’t know yet. i’ll think of one. for you.',
        'happy',
      ),
    ],
  },
  {
    id: 'pa4-19-papyrus-puzzles',
    lines: [PA('THE SURFACE HAS NO PUZZLES YET! I MUST BUILD SOME AT ONCE! FOR TOURISM!', 'happy')],
  },
  {
    id: 'pa4-19-papyrus-pasta',
    lines: [
      PA(
        'I WILL OPEN A SPAGHETTI RESTAURANT ON THE SURFACE! YOU WILL ALL EAT FOR FREE! PLEASE COME!',
        'happy',
      ),
    ],
  },
  {
    id: 'pa4-19-undyne-hot',
    lines: [
      UN(
        'The sun! It’s HOT! I love it! Alphys, look, it’s the biggest stove in the world!',
        'happy',
      ),
    ],
  },
  {
    id: 'pa4-19-undyne-low',
    lines: [
      UN('…Huh. It’s warm, but it’s not too hot. Somebody turned the sky down. I like it.', 'soft'),
    ],
  },
  {
    id: 'pa4-19-mettaton-pose',
    lines: [
      MT(
        'Perfect light. Perfect angle. Darling blue one, one last pose, for the first sunrise.',
        'happy',
      ),
    ],
  },
  {
    id: 'pa4-19-mettaton-encore',
    lines: [
      MT('A sunrise! Darlings, what an opening. I want an encore of this tomorrow.', 'happy'),
    ],
  },
  // ---------------------------------------------------------------- PA4-19 last frame (pa4-candy)
  {
    id: 'pa4-19-flower-turns',
    lines: [
      N(
        'Last of all, the screen shows the Ruins one more time. A golden flower in the dark lifts its head.',
      ),
      N('It turns, very slowly, towards the light.'),
    ],
  },
  {
    id: 'pa4-19-flower-still',
    lines: [
      N(
        'Last of all, the screen shows the Ruins one more time. A golden flower in the dark doesn’t move.',
      ),
    ],
  },
  // ---------------------------------------------------------------- after the cartridge (wisp, s21Done)
  {
    id: 'pa4-end-wisp-asleep',
    lines: [
      N(
        'Later, when you look back into the shed, Wisp is asleep on top of the cabinet, curled up where it’s warm.',
      ),
      PX('Leave him. He’s earned the warm spot. I’ll turn the screen down.', 'soft'),
    ],
  },
  {
    id: 'pa4-end-clank',
    lines: [
      N(
        'Clank gets down off the cabinet, very carefully, and pats the taped MERCY button once, like your Nubbin did.',
      ),
    ],
  },
];

// =================================================================== flags and checks

/** Every flag this cartridge sets (cartridge save only). It reads wisp and s21Done, and writes no Grove flag. */
export const ARCADE_PA4_FLAGS: string[] = [
  'pa4-01',
  'pa4-02',
  'pa4-03',
  'pa4-04',
  'pa4-05',
  'pa4-06',
  'pa4-07',
  'pa4-08',
  'pa4-09',
  'pa4-10',
  'pa4-11',
  'pa4-12',
  'pa4-13',
  'pa4-14',
  'pa4-15',
  'pa4-16',
  'pa4-17',
  'pa4-18',
  'pa4-19',
  'pa4-done', // PA4-19: the whole cartridge; counts towards High Score Night
  'pa4-candy', // left | be (pa4-02-candy): PA4-17, PA4-18, PA4-19
  'pa4-blook', // lie | joke (pa4-03-blook)
  'pa4-papyrus', // puzzles | pasta (pa4-07-date)
  'pa4-undyne', // hot | low (pa4-10-cook)
  'pa4-mettaton', // pose | encore (pa4-12-show)
];

export const ARCADE_PA4_CHECKS: string[] = [
  'inspect:pa4-cartridge',
  'explore:pa4-ruins:flowerbed',
  'talk:pa4-flowey',
  'choose:pa4-candy:flowerbed',
  'puzzle:pa4-ruins:spikes',
  'minigame:clear:pa4-dummy',
  'sit:pa4-blook',
  'sit:pa4-toriel:fireside',
  'walk:pa4-toriel:basement',
  'minigame:mercy:pa4-toriel',
  'walk:pa4-ruins:corridor',
  'talk:pa4-sans',
  'puzzle:pa4-papyrus:gauntlet',
  'minigame:clear:pa4-dogs',
  'minigame:mercy:pa4-papyrus',
  'visit:pa4-papyrus:house',
  'explore:pa4-waterfall:echo-flowers',
  'visit:pa4-waterfall:wishing-room',
  'walk:pa4-waterfall:bridge',
  'walk:pa4-hotland:run',
  'carry:pa4-water-cup:undyne',
  'visit:pa4-undyne:house',
  'craft:pa4-spaghetti',
  'talk:pa4-alphys',
  'minigame:clear:pa4-quiz-show',
  'puzzle:pa4-hotland:lasers',
  'minigame:mercy:pa4-mettaton',
  'watch:pa4-mettaton:call',
  'walk:pa4-new-home:story',
  'walk:pa4-corridor:golden',
  'talk:pa4-asgore:tea',
  'watch:pa4-mercy-button',
  'deliver:pa4-letter:alphys',
  'sit:pa4-alphys:dump',
  'explore:pa4-true-lab',
  'minigame:mercy:pa4-lost-ones',
  'watch:pa4-families',
  'walk:pa4-barrier',
  'watch:pa4-friends',
  'watch:pa4-flowey:rise',
  'minigame:mercy:pa4-asriel',
  'talk:pa4-asriel:sorry',
  'walk:pa4-mountain:sunrise',
  'talk:pa4-toriel:home',
];
