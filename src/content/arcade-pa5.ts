/**
 * Pixel's Arcade, cartridge PA5: The Hundred-Year Sleep (Part M, rank 35). Eighteen quests,
 * PA5-1 to PA5-18.
 *
 * SOURCE. The Legend of Zelda: Breath of the Wild (Nintendo EPD; Nintendo Switch and Wii U, Japan,
 * 3 March 2017). Rights: Nintendo holds the game, its story, its characters, its designs and the
 * names Zelda, Hyrule, Link, Korok, Sheikah and the rest. THIS CARTRIDGE CANNOT SHIP WITHOUT A
 * LICENCE FROM NINTENDO. Every character uses the licensed design or does not appear. No music from
 * the game is used; Kass plays tunes only, described, never sung and never given.
 *
 * AUDIENCE. 'all'. The outline says there is no Learning Grove version of PA5 (licence); the two
 * lifted lines still carry `childLines`, as the house rule asks of every quote in an `all` quest.
 *
 * FRAME. Pixel's Arcade. After chapter 5, Pixel's rescued cabinet runs in the lantern shed. The
 * cartridge has a blue eye on its label. You and your Nubbin wake on a stone floor beside a stone
 * bed; Pixel (she/her) stays at the controls as player two and talks through the speaker. You walk
 * the land beside Link, never as him: he is the hero and hardly speaks (he has no lines at all
 * here). You carry the photographs, cook at campfires and hold the horse. Your Nubbin never speaks
 * and is the best Korok-finder in Hyrule. The source's own talking creatures talk (Hestu, the Great
 * Deku Tree); the Koroks only giggle, in narration.
 *
 * GROVE FLAGS READ (read-only; a cartridge never writes a Grove flag):
 *   - s21Done (S21, CL-4NK). With it, PA5_VARIANTS pa5-01-shed-clank replaces pa5-01-shed (Clank
 *     sits on top of the cabinet), and pa5-17-horse-done-clank replaces pa5-17-horse-done. Nothing
 *     else changes. The cartridge never needs it to play.
 *
 * FLAGS WRITTEN (cartridge save only, all prefixed pa5-):
 *   - pa5-01 … pa5-18: each quest on completion. pa5-done: the whole cartridge (PA5-18); High Score
 *     Night reads it through the Arcade save (any two of PA1–PA5).
 *   - pa5-oldman = ate | left (PA5-3, pa5-03-cold): ate plays pa5-14-complete-ate in PA5-14,
 *     eleven quests later.
 *   - pa5-memories = photohunt | photoroad (PA5-5, pa5-05-photos): THE SIGNATURE CHOICE. photohunt
 *     plays the eight off-road memories as PA5_VARIANTS `<host>-photohunt`, replacing scenes that
 *     always play in PA5-6 to PA5-13; photoroad leaves them out. Pays off in PA5-15 and PA5-18.
 *   - pa5-hunt = hunt (pa5-13-sword-done-photohunt, the eighth off-road memory): with the four
 *     on-road memories, all twelve are seen by PA5-15. Answers pa5-15-*-hunt and pa5-18-complete-hunt.
 *   - pa5-thirteenth = true (pa5-15-complete-hunt): the thirteenth photograph, kept for the journal.
 *   - pa5-14-told = oldman-told | oldman-kept (pa5-14-complete-ate): picks pa5-18-question-oldman-*,
 *     where the old man's message reaches Zelda.
 *   - pa5-jumper = lent-jumper (pa5-02-pool): picks pa5-18-seal-done-lent-jumper.
 *   - pa5-17-hold = steady | gentle, pa5-18-after = look-back | leave-room: small choice flags, read by
 *     nothing outside their own scene.
 *
 * LIFTED TEXT (copyrighted; two one-sentence lines, both exactly as the outline lists them, from
 * the English script as quoted in Nintendo's trailers and by Zelda Dungeon; CHECK BOTH AGAINST THE
 * GAME before ship):
 *   1. "Open your eyes." Zelda's voice, pa5-01-wake#0. childLines: original replacement.
 *   2. "I think I can accept that." Zelda after the credits, pa5-18-complete-hunt#6, only after
 *      every memory. childLines: original replacement.
 *   Every other line is new. No song lyrics; no music cue from the game.
 *
 * CARE NOTES.
 *   - The Champions died a hundred years ago and appear only as spirits (warm, even funny) and in
 *     memories of the time before. Never the moment of death; nobody says how they died.
 *   - Mipha's and Sidon's grief is gentle; Muzu's blame is an old man's sorrow, and it softens.
 *   - The Calamity is a cloud and a beast: big, red-black, never gory. No fighting on screen beyond
 *     Link's own, and that is kept to a sentence. You and your Nubbin never fight.
 *   - Gerudo Town: the game's disguise is left out. You go in with Riju's guard, Buliara.
 *   - The Yiga are comic thieves who love bananas. No real-world ninja clichés: no bowing jokes, no
 *     accents, no stereotyped music.
 *   - Zelda's father is hard, not cruel; he is sorry now. Her fury at seventeen is shown with
 *     respect.
 *   - The Blatchery Plain memory (the thirteenth) shows Link falling as a knee in the mud and her
 *     light; never a wound.
 *   - Hazel's third rule is acted (the cliff edge, the shelter, the field) and never quoted.
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

const GAME = 'The Legend of Zelda: Breath of the Wild (Nintendo, 2017)';
const where = (title: string) => `Pixel’s arcade cabinet, the lantern shed: ${title} (Pixel’s Arcade)`;
const WHERE = where('The Hundred-Year Sleep');
const after = (code: string) => `Any time after ${code}, from Pixel’s cabinet.`;
const straight = (code: string) => `Straight after ${code}, from Pixel’s cabinet.`;

// ------------------------------------------------------------------ speakers

const CLANK = sp('clank', 'Clank', 'Claptrap, the CL4P-TP unit (Borderlands), reference only; the Grove’s own robot from S21');
const VOICE = sp('pa5-voice', 'A voice', `Princess Zelda’s voice, heard before she is seen (${GAME}); licensed`);
const ZELDA = sp('pa5-zelda', 'Zelda', `Princess Zelda (${GAME}); licensed design`);
const OLDMAN = sp('pa5-oldman', 'Old Man', `The Old Man of the Great Plateau, later King Rhoam’s spirit (${GAME}); licensed design`);
const KING = sp('pa5-king', 'King Rhoam', `King Rhoam Bosphoramus Hyrule, as a spirit and in memory (${GAME}); licensed design`);
const IMPA = sp('pa5-impa', 'Impa', `Impa, elder of Kakariko Village (${GAME}); licensed design`);
const PAYA = sp('pa5-paya', 'Paya', `Paya, Impa’s granddaughter (${GAME}); licensed design`);
const PURAH = sp('pa5-purah', 'Purah', `Purah, director of the Hateno Ancient Tech Lab (${GAME}); licensed design`);
const HESTU = sp('pa5-hestu', 'Hestu', `Hestu, the giant Korok with maracas (${GAME}); licensed design`);
const SIDON = sp('pa5-sidon', 'Sidon', `Prince Sidon of the Zora (${GAME}); licensed design`);
const MUZU = sp('pa5-muzu', 'Muzu', `Muzu, elder Zora and Mipha’s old teacher (${GAME}); licensed design`);
const MIPHA = sp('pa5-mipha', 'Mipha', `Mipha, Zora Champion, as a spirit and in memory (${GAME}); licensed design`);
const YUNOBO = sp('pa5-yunobo', 'Yunobo', `Yunobo of Goron City (${GAME}); licensed design`);
const DARUK = sp('pa5-daruk', 'Daruk', `Daruk, Goron Champion, as a spirit and in memory (${GAME}); licensed design`);
const TEBA = sp('pa5-teba', 'Teba', `Teba, Rito warrior (${GAME}); licensed design`);
const REVALI = sp('pa5-revali', 'Revali', `Revali, Rito Champion, as a spirit and in memory (${GAME}); licensed design`);
const KASS = sp('pa5-kass', 'Kass', `Kass, the wandering Rito bard (${GAME}); licensed design; never sings`);
const RIJU = sp('pa5-riju', 'Riju', `Riju, young chief of the Gerudo (${GAME}); licensed design`);
const BULIARA = sp('pa5-buliara', 'Buliara', `Buliara, Riju’s guard (${GAME}); licensed design`);
const YIGA = sp('pa5-yiga', 'Yiga Footsoldier', `A Yiga Clan footsoldier, played comic (${GAME}); licensed design`);
const URBOSA = sp('pa5-urbosa', 'Urbosa', `Urbosa, Gerudo Champion, as a spirit and in memory (${GAME}); licensed design`);
const DEKU = sp('pa5-deku', 'The Great Deku Tree', `The Great Deku Tree (${GAME}); licensed design`);

const N = say('narrator');
const Y = say('you');
const PX = say('pixel');
const CK = say('clank');
const VO = say('pa5-voice');
const ZE = say('pa5-zelda');
const OM = say('pa5-oldman');
const KI = say('pa5-king');
const IM = say('pa5-impa');
const PA = say('pa5-paya');
const PU = say('pa5-purah');
const HE = say('pa5-hestu');
const SI = say('pa5-sidon');
const MU = say('pa5-muzu');
const MI = say('pa5-mipha');
const YU = say('pa5-yunobo');
const DA = say('pa5-daruk');
const TE = say('pa5-teba');
const RE = say('pa5-revali');
const KA = say('pa5-kass');
const RI = say('pa5-riju');
const BU = say('pa5-buliara');
const YI = say('pa5-yiga');
const UR = say('pa5-urbosa');
const DE = say('pa5-deku');

// =================================================================== THE HUNDRED-YEAR SLEEP

export const ARCADE_PA5: Quest[] = [
  // ---------------------------------------------------------------- PA5-1
  {
    id: 'pa5-01',
    code: 'PA5-1',
    title: 'The Cabinet',
    source: `${GAME}: the opening`,
    audience: 'all',
    trigger: {
      where: WHERE,
      when: 'After chapter 5, once Pixel’s cabinet runs in the lantern shed; the first quest on the cartridge.',
    },
    speakers: [VOICE, CLANK],
    steps: [
      {
        id: 'pa5-01-s1',
        goal: 'Meet Pixel at the cabinet in the lantern shed.',
        hint: 'The lantern shed is lit; Pixel has a new cartridge.',
        check: 'visit:pa5-cabinet:lantern-shed',
        scene: {
          id: 'pa5-01-shed',
          lines: [
            N('The lantern shed smells of sawdust and solder. The cabinet hums in the corner like a fridge with ambitions.'),
            PX('New cartridge. Well, old cartridge. New to us.'),
            N('She holds it up. The label is faded to the colour of weak tea, except for one blue eye, which hasn’t faded at all.'),
            PX('Found it in the mouse nest. They’d been using it as a table. I gave them a coaster in exchange.'),
            PX('You go in. I stay out here as player two and talk through the speaker. I’ve fixed the speaker. Mostly.'),
            PX('If it goes wrong, I pull the plug and you’re back on this floor. Ruling: that has never failed.'),
            Y('How many times have you tried it?'),
            PX('Once. It worked once. That’s a hundred per cent.', 'happy'),
            N('Your Nubbin climbs on to the stool and stares into the dark screen, nose almost on the glass.'),
          ],
          choices: [
            {
              id: 'blow',
              label: 'Blow on the cartridge first.',
              then: [
                PX('Ruling: it does nothing. Ruling two: I’m doing it too.'),
                N('You blow on it, and Pixel blows on it harder. Your Nubbin, not to be left out, blows on Pixel.'),
              ],
            },
            {
              id: 'slot',
              label: 'Just put it in.',
              then: [PX('A person of action. Player one, ready.')],
            },
          ],
        },
        done: {
          id: 'pa5-01-shed-done',
          lines: [
            N('The cartridge goes in with a clunk. The screen turns a deep, quiet blue.'),
            N('Then the shed goes away, the way a room goes away when you fall asleep in it.'),
          ],
        },
      },
      {
        id: 'pa5-01-s2',
        goal: 'Wake up, and look about the cave.',
        hint: 'Get up, and look at the stone bed beside you.',
        check: 'inspect:pa5-cave:stone-bed',
        scene: {
          id: 'pa5-01-wake',
          lines: [
            VO('Open your eyes.'),
            N('You do. You are lying on a stone floor, and it is cold through your coat.'),
            N('Your Nubbin is curled against your side. It opens one eye, then the other, then sneezes.'),
            N('Beside you is a stone bed, carved with lines that glow a soft blue. It is wet, as if someone has just got out of it.'),
            PX('Player two. I’ve got the manual this time. It’s in a language. Say something.'),
            Y('I can hear you.'),
            PX('Good. The voice wasn’t me, by the way. I want that on the record.', 'think'),
            N('Somewhere further in, water drips into water. A blue light runs along the wall, towards it.'),
          ],
          choices: [
            {
              id: 'who',
              label: 'Then whose voice was it?',
              then: [PX('Somebody who’s been waiting a long time to say it, I think. It sounded tired.', 'soft')],
            },
            {
              id: 'cold',
              label: 'It’s freezing in here.',
              then: [PX('I’ll put the heater on in the shed. That won’t help you at all. It’ll help me.')],
            },
          ],
        },
        done: {
          id: 'pa5-01-wake-done',
          lines: [
            N('Your Nubbin follows the blue light along the wall with its nose. You follow your Nubbin.'),
            PX('That’s the right way. I don’t know how I know. It’s the way the light goes.'),
          ],
        },
      },
    ],
    complete: {
      id: 'pa5-01-complete',
      lines: [
        N('The cave opens into a round chamber. In the middle is a pool, lit from beneath.'),
        N('Someone is lying in the water, asleep, as if he has been asleep for a very long time.'),
        PX('Oh. It isn’t you who’s waking up. It’s him. You just got here early.'),
        N('Your Nubbin sits down on the edge of the pool to wait. So do you.'),
      ],
    },
    rewards: [],
    sets: { 'pa5-01': true },
    notes:
      'FRAME: the lantern shed, the cabinet (dented, sawdust, the mouse nest now moved to a teacup on the shelf). Pixel ' +
      'stays in the shed for the whole cartridge; every Pixel line in PA5 is heard through the cabinet speaker, with a ' +
      'small crackle. WITH s21Done: play PA5_VARIANTS pa5-01-shed-clank instead of pa5-01-shed (Clank sits on top of the ' +
      'cabinet). LIFTED: pa5-01-wake#0 is quote 1 of 2 (check against the game); childLines gives the original ' +
      'replacement. The voice is Zelda’s, licensed voice only; she is not named here. TRANSITION: the shed fades to blue, ' +
      'then to the cave; no flashing.',
    childLines: {
      'pa5-01-wake#0': 'Wake up now. It’s time.',
    },
  },

  // ---------------------------------------------------------------- PA5-2
  {
    id: 'pa5-02',
    code: 'PA5-2',
    title: 'The Shrine of Resurrection',
    source: `${GAME}: waking in the Shrine of Resurrection`,
    audience: 'all',
    trigger: { where: WHERE, when: straight('PA5-1') },
    requires: ['PA5-1'],
    speakers: [],
    steps: [
      {
        id: 'pa5-02-s1',
        goal: 'Watch over the sleeper in the pool until he wakes.',
        hint: 'Stay by the pool; he will wake on his own.',
        check: 'watch:pa5-link:pool',
        scene: {
          id: 'pa5-02-pool',
          lines: [
            N('The water drains away with a long sigh. The young man in it sits up, blinks, and gets out.'),
            N('He has fair hair, bare feet and a pair of old shorts. He looks at his own hands as if they were new.'),
            N('Then he sees you, and isn’t surprised. Everything is new to him, so you are just one more thing.'),
            PX('That’s Link. The game says so in the corner. He’s the hero. We’re… the people next to the hero.'),
            N('A pedestal rises out of the floor. On it is a flat slate of stone and glass, lit blue.'),
            N('Link picks it up, and it chirps. Your Nubbin chirps back, and Link looks at it for a long moment.'),
            PX('He doesn’t talk much, does he? Fine. I talk enough for a party of four.'),
          ],
          choices: [
            {
              id: 'jumper',
              label: 'Offer him your jumper.',
              set: { 'pa5-jumper': 'lent-jumper' },
              then: [
                N('Link takes it, puts it on back to front, and fixes it without a word. It fits him better than it fits you.'),
                PX('Ruling: that’s his now. Heroes don’t give jumpers back. It’s in the rules.'),
              ],
            },
            {
              id: 'hello',
              label: 'Say hello.',
              then: [N('Link nods once. It is a very polite nod, from somebody who doesn’t yet know any other kind.')],
            },
          ],
        },
        done: {
          id: 'pa5-02-pool-done',
          lines: [
            N('A door slides open. Daylight comes down a long ramp, so bright your Nubbin shuts its eyes.'),
            N('Link goes up towards it. After a few steps he looks back to see if you’re coming.'),
          ],
        },
      },
      {
        id: 'pa5-02-s2',
        goal: 'Follow Link up into the light, to the cliff edge.',
        hint: 'Walk up the ramp and out of the cave mouth.',
        check: 'walk:pa5-link:cliff-edge',
        scene: {
          id: 'pa5-02-cliff',
          lines: [
            N('Outside, the grass is long and the wind is enormous. Link runs to the edge of a cliff and stops.'),
            N('Below you is a whole land, green and gold and empty, with mountains standing round it like old people at a fire.'),
            N('Far off, a castle. Around it turns a slow cloud, red and black, like smoke that has forgotten how to leave.'),
            PX('Oh. Oh, that’s big. They’ve drawn it so you can see it from everywhere, haven’t they.', 'shock'),
            N('Your Nubbin sits down at once, right on the edge, with its feet over the drop.'),
            N('Link doesn’t move. After a while, he sits down next to it.'),
            PX('I’m going to be quiet for a bit. It seems like that sort of view.', 'soft'),
            N('You sit down too. The wind goes on, and the cloud turns, and nobody says anything for a long time.'),
          ],
        },
        done: {
          id: 'pa5-02-cliff-done',
          lines: [
            N('Down the slope, a thread of smoke rises from a campfire. Someone is there.'),
            PX('Right. Quiet over. Somebody’s cooking. Go and be friendly.'),
          ],
        },
      },
    ],
    complete: {
      id: 'pa5-02-complete',
      lines: [
        N('Link stands up first and offers your Nubbin a hand. Your Nubbin takes a finger instead.'),
        N('The three of you go down the slope through the long grass, towards the smoke.'),
        PX('Note for later: he waited for you. Heroes don’t always.'),
      ],
    },
    rewards: [],
    sets: { 'pa5-02': true },
    notes:
      'Link never speaks in this script; his acts are narrated. The Calamity cloud is slow and red-black, never ' +
      'flashing. The cliff view is the cartridge’s big wide shot: hold it, and let the player sit.',
  },

  // ---------------------------------------------------------------- PA5-3
  {
    id: 'pa5-03',
    code: 'PA5-3',
    title: 'The Old Man',
    source: `${GAME}: the Great Plateau`,
    audience: 'all',
    trigger: { where: WHERE, when: straight('PA5-2') },
    requires: ['PA5-2'],
    speakers: [OLDMAN],
    steps: [
      {
        id: 'pa5-03-s1',
        goal: 'Meet the old man at the campfire.',
        hint: 'Follow the smoke down the slope.',
        check: 'talk:pa5-oldman:campfire',
        scene: {
          id: 'pa5-03-fire',
          lines: [
            N('An old man in a hooded cloak sits by a small fire, turning apples on a stick.'),
            OM('Visitors. Three of you, and one of you is very short. Sit, sit.'),
            OM('Have an apple. They’re better roasted. Everything is better roasted, apart from fingers.'),
            N('He gives you an apple. It is hot and sweet and slightly black on one side.'),
            N('He gives your Nubbin one too. Your Nubbin holds it in both hands and blows on it very seriously.'),
            OM('And you. You’ve been asleep, haven’t you? A long time. It shows in how you stand.'),
            N('Link doesn’t answer. The old man nods, as if he did.'),
            PX('I like him. I don’t trust him, but I like him. He’s got a face like a riddle.', 'think'),
          ],
        },
        done: {
          id: 'pa5-03-fire-done',
          lines: [
            OM('There’s a tower on the hill there. Dead for a hundred years. Your slate might wake it.'),
            N('Link is already walking. You eat your apple faster.'),
          ],
        },
      },
      {
        id: 'pa5-03-s2',
        goal: 'Go with Link to the stone tower.',
        hint: 'The tower is on the hill above the ruined temple.',
        check: 'climb:pa5-tower:plateau',
        scene: {
          id: 'pa5-03-tower',
          lines: [
            N('Link puts the slate into a pedestal at the foot of the tower. The ground shakes.'),
            N('The tower shoots up out of the earth with all of you still on its base. Your Nubbin holds on to your boot.'),
            N('At the top, the slate draws a map. All across the land, small orange lights blink on, one after another.'),
            PX('Those are shrines. Little puzzle rooms. He has to do them. We get to stand outside and hold things.'),
            N('Back at the fire, the old man is waiting, as if he has never moved.'),
            OM('You can’t get off this plateau without wings. I have a pair. Well, a cloth pair.'),
            OM('Bring me what’s inside four of those shrines, and the paraglider is yours.'),
            PX('A fetch quest. Classic. Ruling: allowed, because he gave us apples.'),
          ],
        },
        done: {
          id: 'pa5-03-tower-done',
          lines: [
            N('Link sets off for the first shrine. You and your Nubbin carry the pot and the bag of apples behind him.'),
          ],
        },
      },
      {
        id: 'pa5-03-s3',
        goal: 'It’s cold on the mountain. Decide how to spend the evening.',
        hint: 'Talk to the old man at his cabin fire after the third shrine.',
        check: 'choose:pa5-oldman:supper',
        scene: {
          id: 'pa5-03-cold',
          lines: [
            N('The last shrine is up on the snowy shoulder of the plateau. Your breath comes out in clouds.'),
            N('Your Nubbin has gone very small and round, which is what Nubbins do when they’re cold.'),
            N('The old man has a cabin down the slope, with a fire and a big stone pot. He is eating a cold apple.'),
            OM('There’s a recipe in my diary. Spicy peppers and meat, to keep the cold out. I’ve never got round to it.'),
            N('You have peppers in your bag. Link has already gone on up the slope towards the shrine.'),
            PX('Option one: cook. Option two: catch him up. I will not rule on this. It’s your evening.'),
          ],
          choices: [
            {
              id: 'ate',
              label: 'Cook the pepper dish and eat with him.',
              set: { 'pa5-oldman': 'ate' },
              then: [
                N('You chop peppers and the stone pot spits. The cabin fills with a smell that makes your eyes water happily.'),
                N('Your Nubbin eats its share and goes pink to the ears. The old man laughs at it, a real laugh.'),
                OM('I had a daughter. I was hard on her. I told her what she must be, and never asked her what she was.', 'sad'),
                OM('She tried so hard. And I only ever told her to try harder.', 'sad'),
                N('He doesn’t say her name. He looks into the fire for a long time, and then he gives you the last apple.'),
              ],
            },
            {
              id: 'left',
              label: 'Leave him to his apples and press on.',
              set: { 'pa5-oldman': 'left' },
              then: [
                OM('Of course. Young legs. Go on.'),
                N('When you look back from the slope, he is still at his fire, alone, turning the cold apple in his hands.'),
              ],
            },
          ],
        },
        done: {
          id: 'pa5-03-cold-done',
          lines: [
            N('Link comes down from the fourth shrine with the slate glowing. He has done all four.'),
            PX('Four out of four. Your hero is very good at puzzles. Also at not talking about it.'),
          ],
        },
      },
    ],
    complete: {
      id: 'pa5-03-complete',
      lines: [
        N('The old man is gone from his cabin. In the snow by the door, he has left a note.'),
        N('It says only: the temple roof. The writing is old-fashioned, and very straight.'),
        N('By the cabin fire, he has left the stone pot as well, scrubbed clean, with a little stand for the fire.'),
        PX('He left you his pot. That’s a reward. I’ll put one in the Grove for you. Same shape.'),
      ],
    },
    rewards: [
      {
        id: 'pa5-pot',
        kind: 'decor',
        label: 'Stone cooking pot and campfire',
        description: 'A round stone pot on a little campfire, the old man’s, for the Grove. It crackles when you walk past.',
      },
    ],
    sets: { 'pa5-03': true },
    notes:
      'SIGNATURE (old man): pa5-03-cold sets pa5-oldman = ate | left. ate plays PA5_VARIANTS pa5-14-complete-ate in ' +
      'PA5-14. The daughter is Zelda; he never names her. The shrines are Link’s; the player waits outside (no shrine ' +
      'puzzles are ours to stage). The decor pot is cosmetic and lives in the Grove; the cartridge writes no Grove flag ' +
      '(the reward is granted through the Arcade save, like the Atlas keepsakes).',
  },

  // ---------------------------------------------------------------- PA5-4
  {
    id: 'pa5-04',
    code: 'PA5-4',
    title: 'The King’s Ghost',
    source: `${GAME}: the Temple of Time`,
    audience: 'all',
    trigger: { where: WHERE, when: straight('PA5-3') },
    requires: ['PA5-3'],
    speakers: [KING],
    steps: [
      {
        id: 'pa5-04-s1',
        goal: 'Climb to the roof of the ruined Temple of Time.',
        hint: 'The broken stair at the back of the temple goes up.',
        check: 'climb:pa5-temple:roof',
        scene: {
          id: 'pa5-04-temple',
          lines: [
            N('The temple has no roof over its nave, only sky. Grass grows between the floor stones.'),
            N('You climb up the back with Link. Your Nubbin is passed up the last bit like a parcel.'),
            N('The old man is waiting at the top. Then he isn’t an old man any more.'),
            N('He is tall and crowned and faintly blue, and the wind blows through him.'),
            KI('Forgive the cloak. I am, or I was, the king of this land. Rhoam. It has been a hundred years.'),
            KI('The Calamity came out of the earth and took the kingdom. Everyone I had, in a day.', 'sad'),
            KI('My daughter, Zelda, holds it back inside the castle. Alone. Still. She is tiring.', 'sad'),
            KI('Go to her, Link. Please. I have no right to ask, and I am asking.'),
            PX('Oh no. He’s a ghost. I knew it. I said riddle. Riddle was close.', 'shock'),
          ],
          choices: [
            {
              id: 'promise',
              label: 'We’ll walk with him all the way.',
              then: [KI('Thank you. He will need people who walk beside him. He always did.', 'soft')],
            },
            {
              id: 'ask',
              label: 'Why does she have to do it alone?',
              then: [
                KI('Because there was no one left to stand with her. And because of me, partly. Another time.', 'sad'),
              ],
            },
          ],
        },
        done: {
          id: 'pa5-04-temple-done',
          lines: [N('The king reaches behind him and holds out a paraglider: cloth and wood, mended many times.')],
        },
      },
      {
        id: 'pa5-04-s2',
        goal: 'Jump from the plateau and glide down into the land.',
        hint: 'Hold on, lean to steer, and let go over the grass.',
        check: 'minigame:clear:pa5-glide-plateau',
        scene: {
          id: 'pa5-04-glider',
          lines: [
            KI('It will hold you. It held me, once, when I was young and stupid enough to jump off things.'),
            N('He begins to fade, from the feet up. He doesn’t seem afraid of it.'),
            KI('If you see her, tell her… no. Let him tell her. He’ll know when.', 'soft'),
            N('Then there is only the wind on the roof, and the paraglider in Link’s hands.'),
            N('Link walks to the edge, and looks back at you. He holds out his free arm.'),
            PX('Is he asking you to jump off a cliff with him? He is. That’s a friendship thing in this game.'),
          ],
          choices: [
            {
              id: 'hold',
              label: 'Hold on to Link, Nubbin in your other arm.',
              then: [N('You grab his belt, and your Nubbin grabs your collar. Link jumps.')],
            },
            {
              id: 'nubbin',
              label: 'Let your Nubbin go first, in Link’s arms.',
              then: [N('Link tucks your Nubbin in his elbow like a loaf, and you hold on to his back. Link jumps.')],
            },
          ],
        },
        done: {
          id: 'pa5-04-glider-done',
          lines: [
            N('The cloth fills, and the plateau falls away. Below you, the green land tilts slowly, like a page turning.'),
            PX('WHEEEE. Sorry. That was me. I’m player two, I’m allowed to wheee.', 'happy'),
          ],
        },
      },
    ],
    complete: {
      id: 'pa5-04-complete',
      lines: [
        N('You land in a meadow and roll. Your Nubbin lands on top of you, and stays there, delighted.'),
        PX('I’m putting a glider in the Grove. You can go off the top of the hill. Don’t tell Fern I said so.'),
        N('Link points east, to a valley full of lanterns. That’s where you’re going.'),
      ],
    },
    rewards: [
      {
        id: 'pa5-glider',
        kind: 'feature',
        label: 'Paraglider',
        description: 'A mended cloth paraglider. Glide off the Grove’s hill with your Nubbin in your arms.',
      },
    ],
    sets: { 'pa5-04': true },
    notes:
      'The king fades softly from the feet up; no light burst. The glide is a short, unfailable minigame (you cannot ' +
      'fall; you only land sooner or later). The Grove paraglider is the hill-section feature the outline names.',
  },

  // ---------------------------------------------------------------- PA5-5
  {
    id: 'pa5-05',
    code: 'PA5-5',
    title: 'Kakariko',
    source: `${GAME}: Kakariko Village and Impa`,
    audience: 'all',
    trigger: { where: WHERE, when: after('PA5-4') },
    requires: ['PA5-4'],
    speakers: [IMPA, PAYA],
    steps: [
      {
        id: 'pa5-05-s1',
        goal: 'Find the elder’s house in Kakariko Village.',
        hint: 'The biggest house, up the steps; someone is sweeping.',
        check: 'talk:pa5-paya:impa-house',
        scene: {
          id: 'pa5-05-village',
          lines: [
            N('Kakariko sits in a fold of the hills, all wooden roofs and paper lanterns and the smell of rice.'),
            N('A young woman is sweeping the step of the big house. She sees Link and drops the broom.'),
            PA('Oh! Oh. It’s… you. I mean, welcome. I mean, Grandmother is expecting… oh dear.'),
            N('She turns to face the door and talks to it instead of to Link. Her ears have gone red.'),
            PA('I’m Paya. Please go in. I’ll… sweep. Out here. A great deal.'),
            N('Your Nubbin picks up the broom and hands it back to her. She takes it from your Nubbin without blushing at all.'),
            PX('She can talk to your Nubbin. Just not to him. I understand that more than I’d like to.'),
          ],
        },
        done: {
          id: 'pa5-05-village-done',
          lines: [PA('Thank you, little one.'), N('Inside, someone very small is sitting under a very large hat.')],
        },
      },
      {
        id: 'pa5-05-s2',
        goal: 'Hear Impa’s story of the Champions and the Divine Beasts.',
        hint: 'Sit on the cushion in front of Impa.',
        check: 'talk:pa5-impa:kakariko',
        scene: {
          id: 'pa5-05-impa',
          lines: [
            N('Impa is tiny and ancient, and her hat is the size of a cart wheel. Her eyes are very bright under it.'),
            IM('So. You came back. And you brought company, which is more sense than you used to have.'),
            IM('A hundred years ago, the princess had four friends. Champions, one from each people.'),
            IM('Mipha of the Zora. Daruk of the Gorons. Revali of the Rito. Urbosa of the Gerudo.'),
            IM('Each one piloted a Divine Beast, a great old machine, to stand against the Calamity.'),
            IM('The Calamity turned the Beasts on their own people. The four never came home.', 'sad'),
            IM('Their spirits are inside the Beasts still. Waiting, I think, for you.'),
            N('Link looks at his hands again. Your Nubbin leans against his knee.'),
          ],
        },
        done: {
          id: 'pa5-05-impa-done',
          lines: [IM('You don’t remember any of them. I know. That is why I have something for you.')],
        },
      },
      {
        id: 'pa5-05-s3',
        goal: 'Look at Impa’s twelve photographs and decide how to follow them.',
        hint: 'Impa will hand the photographs to you, since you carry things.',
        check: 'inspect:pa5-photos:twelve',
        scene: {
          id: 'pa5-05-photos',
          lines: [
            N('Impa gives you a bundle of twelve photographs, worn soft at the corners.'),
            IM('Places he went with the princess. Stand where each was taken, and he may remember what happened there.'),
            N('A meadow, a rainy tree, a spring, a road, a cliff over the sea. Zelda is in most of them, or at the edge.'),
            IM('You carry them. He has enough to carry.'),
            IM('Some lie on your road. Some are far out of the way, up mountains and down holes. Your choice.'),
            PX('Collectibles. My weakness. But that’s a lot of mountain. I am not ruling on this. It’s your legs.'),
          ],
          choices: [
            {
              id: 'all',
              label: 'We’ll find every one of them.',
              set: { 'pa5-memories': 'photohunt' },
              then: [
                IM('Every one. Good. That is the slow way, and the slow way is often the right one.'),
                N('You lay the twelve photographs out on the floor, and Link looks at each one for a long time.'),
                PX('Marking them all on the slate. Player two: also the map player.', 'happy'),
              ],
            },
            {
              id: 'road',
              label: 'Only the ones on our road. She’s waiting.',
              set: { 'pa5-memories': 'photoroad' },
              then: [
                IM('She is. That is true too. Go on, then.'),
                N('You put the photographs in your coat, close to your chest, where they won’t get rained on.'),
              ],
            },
          ],
        },
        done: {
          id: 'pa5-05-photos-done',
          lines: [IM('My sister Purah, in Hateno, can mend that slate of his. Go and see her. Mind: she’s changed.')],
        },
      },
    ],
    complete: {
      id: 'pa5-05-complete',
      lines: [
        N('Paya is still sweeping when you leave. The step is the cleanest step in the land.'),
        PA('Safe… safe road!'),
        N('She says it to your Nubbin, and your Nubbin waves. Link, very slightly, waves too, and Paya drops the broom again.'),
        PX('Ruling: that was the best thing that’s happened in this cartridge so far.', 'happy'),
      ],
    },
    rewards: [],
    sets: { 'pa5-05': true },
    notes:
      'SIGNATURE CHOICE: pa5-05-photos sets pa5-memories = photohunt | photoroad. photohunt: the eight off-road ' +
      'memories play as PA5_VARIANTS <host>-photohunt (PA5-6 to PA5-13; the eighth sets pa5-hunt = hunt). photoroad: ' +
      'they stay unplayed. The four on-road memories (Mipha, shelter, sword, ' +
      'father) play in PA5-8, 12, 13 and 14 either way. Pays off in PA5-15 and PA5-18. The photo bundle goes in the ' +
      'player’s inventory as one item that fills as memories are seen.',
  },

  // ---------------------------------------------------------------- PA5-6
  {
    id: 'pa5-06',
    code: 'PA5-6',
    title: 'Hateno',
    source: `${GAME}: Hateno Ancient Tech Lab`,
    audience: 'all',
    trigger: { where: WHERE, when: after('PA5-5') },
    requires: ['PA5-5'],
    speakers: [PURAH, ZELDA],
    steps: [
      {
        id: 'pa5-06-s1',
        goal: 'Find Purah’s lab on the hill above Hateno.',
        hint: 'Follow the blue glow at the top of the town.',
        check: 'visit:pa5-lab:hateno',
        scene: {
          id: 'pa5-06-lab',
          lines: [
            N('The lab is a tall house on a hill, with a blue lantern on the roof that hums like Pixel’s cabinet.'),
            N('A little girl in big round glasses opens the door. She looks about six, and she looks you up and down.'),
            PU('Link! It is you! A hundred years and you still have the same hair. And who are these?'),
            PU('I’m Purah. Impa’s big sister. Yes, big. I tried an experiment to make myself younger.'),
            PU('It worked. Too well. I meant to lose twenty years and I lost about eighty.', 'happy'),
            N('Your Nubbin stands up very straight next to her. It is exactly her height.'),
            N('It looks at her, and she looks at it. Your Nubbin sits down in the doorway, overcome with joy.'),
            PX('Someone its own height. It’s never met someone its own height who can also do science.'),
          ],
          choices: [
            {
              id: 'old',
              label: 'So how old are you really?',
              then: [PU('Old enough to know better, young enough to do it anyway! Come in.', 'happy')],
            },
            {
              id: 'try',
              label: 'Could you make my Nubbin taller?',
              then: [
                PU('I could! I could probably make it a lot taller. I couldn’t promise it would stop.', 'think'),
                N('Your Nubbin hides behind your leg. You decide it’s fine the size it is.'),
              ],
            },
          ],
        },
        done: {
          id: 'pa5-06-lab-done',
          lines: [PU('Now. Give me that slate, Link. It’s been asleep as long as you have.')],
        },
      },
      {
        id: 'pa5-06-s2',
        goal: 'Help Purah mend the slate, then pose for its first photograph.',
        hint: 'Hand Purah the parts she asks for; stand in front of the slate when she says.',
        check: 'photo:pa5-purah:lab',
        scene: {
          id: 'pa5-06-slate',
          lines: [
            N('Purah plugs the slate into something that looks like a stove made of teeth.'),
            PU('Spanner. No, the other spanner. No, that’s a fish. Why is there a fish?'),
            N('Your Nubbin hands her things from the bench, one at a time. It is quickly better at this than you.'),
            N('The slate lights up. A new symbol blinks on its face: a little camera.'),
            PU('There! It takes pictures again. Picture of me. Now. While I still look this good.', 'happy'),
            N('Link holds up the slate, and Purah strikes a pose. Your Nubbin strikes the same pose, beside her.'),
            PX('Purah’s got my exact sense of humour. I don’t like it. I love it.'),
          ],
        },
        done: {
          id: 'pa5-06-slate-done',
          lines: [
            N('The slate clicks. The picture is of Purah, your Nubbin and, at the edge, half of your ear.'),
            PU('Perfect. Science!'),
            N('Then the slate chirps at the lab pond, and it is a hundred years ago. Zelda holds out a frog to Link in both hands, very pleased.'),
            ZE('Hot-footed frog. Eating one makes you quicker. Science! Well. Possibly science.', 'happy'),
            N('Link looks at the frog. The frog looks at Link. The memory, mercifully, ends.'),
            PU('That’s not one of Impa’s twelve. That’s a test. The test was a frog.'),
          ],
        },
      },
    ],
    complete: {
      id: 'pa5-06-complete',
      lines: [
        PU('Those photographs of Impa’s. The slate can match them now: hold one up, and it will tell you when you’re close.'),
        PU('Remembering is just finding the right place to stand. Most people never work that out.'),
        N('As you leave, Purah and your Nubbin wave at each other until you are both round the corner.'),
      ],
    },
    rewards: [],
    sets: { 'pa5-06': true },
    notes:
      'Purah looks about six; she is old and brilliant, and every joke is hers, never at her expense. The slate now ' +
      'points to memory sites: with pa5-memories = photohunt, all twelve are marked; with photoroad, only the on-road ' +
      'four. The frog test shot in pa5-06-slate-done plays for everyone and is not one of the twelve; its sequel, the ' +
      'control group, is (pa5-06-complete-photohunt).',
  },

  // ---------------------------------------------------------------- PA5-7
  {
    id: 'pa5-07',
    code: 'PA5-7',
    title: 'Hestu',
    source: `${GAME}: Hestu and the Korok seeds`,
    audience: 'all',
    trigger: { where: WHERE, when: after('PA5-6') },
    requires: ['PA5-6'],
    speakers: [HESTU, ZELDA],
    steps: [
      {
        id: 'pa5-07-s1',
        goal: 'Find out what is troubling the enormous Korok on the road.',
        hint: 'He’s hard to miss. He’s blocking the whole road.',
        check: 'talk:pa5-hestu:road',
        scene: {
          id: 'pa5-07-hestu',
          lines: [
            N('A creature made of wood and leaves is standing in the middle of the road, wringing its twiggy hands.'),
            N('He is as tall as a cottage. His face is a leaf with three holes in it, and all three look worried.'),
            HE('Oh! Oh no, oh dear. Have you seen my maracas? I had them. And now I am a person without maracas.', 'sad'),
            HE('The little Koroks took the seeds out of them to play. Now they’re hiding all over. They love hiding.'),
            HE('When you find one, it giggles. That’s how you know. It giggles, and it gives you a seed.'),
            N('Somewhere in a bush nearby, very quietly, something giggles.'),
            N('Your Nubbin stops dead, and its crown goes up. It giggles back.'),
            PX('Oh, they’re going to get on. That’s a giggling contest. Your Nubbin will win. It’s a professional.'),
          ],
        },
        done: {
          id: 'pa5-07-hestu-done',
          lines: [HE('Twelve seeds, please! The cartridge only has twelve hiding. Very fair of it.')],
        },
      },
      {
        id: 'pa5-07-s2',
        goal: 'Let your Nubbin find all twelve hidden Koroks.',
        hint: 'Follow your Nubbin; when it giggles, look under the rock or in the tree nearest it.',
        check: 'collect:pa5-korok-seeds:12',
        scene: {
          id: 'pa5-07-koroks',
          lines: [
            N('Your Nubbin trots off the road with its nose up, giggling every few steps, and listening.'),
            N('Under a rock: a giggle. A tiny Korok pops up, with a leaf for a face and a seed in its hand.'),
            N('In a ring of flowers, a giggle; on top of a pole, a giggle. At the bottom of a pond, a very wet giggle.'),
            N('Link stands and waits for your Nubbin, holding a rock it asked him to lift.'),
            PX('Seven. Eight! Your Nubbin is the best Korok-finder in this whole game. I want that on its record.', 'happy'),
            N('Every Korok giggles once, gives its seed, and vanishes with a puff of leaves. Each is found once, and stays found.'),
          ],
        },
        done: {
          id: 'pa5-07-koroks-done',
          lines: [N('Twelve seeds. Your Nubbin carries them back in its two cupped hands, and won’t let you help.')],
        },
      },
      {
        id: 'pa5-07-s3',
        goal: 'Bring Hestu his seeds.',
        hint: 'Hestu is still in the road, still worried.',
        check: 'give:pa5-seeds:hestu',
        scene: {
          id: 'pa5-07-dance',
          lines: [
            N('Your Nubbin pours the seeds into Hestu’s maracas. He shakes them, and they rattle.'),
            HE('My maracas! My maracas are whole! I must dance. I am sorry. It isn’t optional.', 'happy'),
            N('Hestu dances. It is a very large dance, all knees and leaves, and the road shakes a little.'),
            N('Koroks pop out of the bushes all along the road to watch. Each one giggles once and ducks back in.'),
            PX('This is the best part of any game. The big wooden man dancing. Science agrees.'),
            HE('Join in! Everyone joins in! It’s the rule! I just made it!', 'happy'),
          ],
          choices: [
            {
              id: 'dance',
              label: 'Dance too.',
              then: [
                N('You dance, and your Nubbin dances. Link, after a long pause, does one small step, and stops, and looks away.'),
                PX('Did he just dance? He did. I saw it. I’m a witness.', 'happy'),
              ],
            },
            {
              id: 'clap',
              label: 'Clap along.',
              then: [N('You clap, and Hestu dances harder. The maracas go faster than seems wise.')],
            },
          ],
        },
        done: {
          id: 'pa5-07-dance-done',
          lines: [HE('For the little one. It finds us better than we find ourselves.')],
        },
      },
    ],
    complete: {
      id: 'pa5-07-complete',
      lines: [
        N('Hestu gives your Nubbin a mask: a round green leaf with three holes in it, just its size.'),
        N('Your Nubbin puts it on and giggles. Somewhere in a bush, very far off, the last Korok giggles back.'),
        PX('The mask goes in the Grove wardrobe. I’m not saying it should wear it to Moss. I’m not not saying it.'),
      ],
    },
    rewards: [
      {
        id: 'pa5-korok-mask',
        kind: 'cosmetic',
        label: 'Leaf-face mask',
        description: 'A round leaf mask with three holes, from Hestu. Your Nubbin giggles when it wears it.',
      },
    ],
    sets: { 'pa5-07': true },
    notes:
      'KOROKS: exactly twelve, placed by hand, found once each, never respawning. They giggle (sound only) and never ' +
      'speak; we do not use the game’s Korok line. Your Nubbin giggles back when within range: that is the finding ' +
      'mechanic. Hestu talks (the source’s own talking creature).',
  },

  // ---------------------------------------------------------------- PA5-8
  {
    id: 'pa5-08',
    code: 'PA5-8',
    title: 'Zora’s Domain',
    source: `${GAME}: Zora’s Domain and Vah Ruta`,
    audience: 'all',
    trigger: { where: WHERE, when: after('PA5-7') },
    requires: ['PA5-7'],
    speakers: [SIDON, MUZU, MIPHA, ZELDA],
    steps: [
      {
        id: 'pa5-08-s1',
        goal: 'Follow the flooded river up to meet the Zora prince.',
        hint: 'Walk upriver in the rain; someone very tall will find you.',
        check: 'talk:pa5-sidon:river',
        scene: {
          id: 'pa5-08-rain',
          lines: [
            N('It won’t stop raining. The river is brown and fat and well over its banks.'),
            N('A shape surges out of the water: a fish-man, red and white and enormous, with a smile like a lighthouse.'),
            SI('There you are! I have been looking for a Hylian for weeks, and you are one, and you brought friends!', 'happy'),
            SI('I am Sidon, prince of the Zora. And I am in a bit of a pickle, though you mustn’t worry.'),
            SI('Vah Ruta, our elephant Beast, is spouting water night and day. If it goes on, the dam breaks.'),
            N('He gives your Nubbin a thumbs up. Your Nubbin, who has no thumbs, does its best.'),
            PX('He’s so cheerful. That’s the kind of cheerful that’s holding something up.', 'think'),
          ],
        },
        done: {
          id: 'pa5-08-rain-done',
          lines: [SI('Come up to the Domain! My father will want to meet you. Some of the elders… less so.')],
        },
      },
      {
        id: 'pa5-08-s2',
        goal: 'Stand where the Domain photograph was taken.',
        hint: 'Look by the statue at the heart of the Domain.',
        check: 'watch:pa5-memory:mipha',
        scene: {
          id: 'pa5-08-domain',
          lines: [
            N('Zora’s Domain glows blue and silver, all luminous stone and running water. In the middle stands a statue.'),
            N('It is a young Zora woman, slender, with a gentle face. Sidon stops talking for once.'),
            MU('You. You have the nerve to walk in here. Our princess gave everything for you.', 'angry'),
            SI('Muzu, please.'),
            MU('He doesn’t even remember her. Look at him.', 'sad'),
            N('Link takes one photograph from your coat: this place. He stands where the camera stood.'),
            N('The rain goes quiet. A memory: Mipha, alive, holding Link’s cut hand in both of hers, and it heals.'),
            MI('There. You’re always getting hurt. Promise me you’ll let me be the one to heal you.', 'soft'),
            N('She wants to say more; you can see it. She doesn’t, and the memory goes.'),
          ],
        },
        done: {
          id: 'pa5-08-domain-done',
          lines: [
            N('Muzu has seen Link’s face while he remembered. The old Zora turns away, and when he turns back he is quieter.'),
            MU('Go on, then. Bring her home.'),
          ],
        },
      },
      {
        id: 'pa5-08-s3',
        goal: 'Go inside Vah Ruta and help free it.',
        hint: 'The Beast’s terminals glow orange; your Nubbin can reach the small ones.',
        check: 'puzzle:pa5-ruta:terminals',
        scene: {
          id: 'pa5-08-ruta',
          lines: [
            N('Sidon swims Link up the waterfalls to the great stone elephant. You and your Nubbin ride on his back fin.'),
            N('Inside, the Beast is all wheels and water and pipes, tilting as its trunk goes up and down.'),
            N('Link opens the big terminals. Your Nubbin squeezes through to the small ones, and pats them till they turn blue.'),
            N('At the last one, a gentle blue light gathers into a girl. It is Mipha.'),
            MI('Link. Oh, you’re here. And look at you, with friends. I’m so glad.', 'happy'),
            MI('I was stuck for a long time. It was lonely, and wet, which I don’t mind. Thank you for coming.'),
            MI('Tell Sidon he’s been very brave. He won’t believe it from anyone else.'),
          ],
          choices: [
            {
              id: 'tell',
              label: 'I’ll tell him myself.',
              then: [MI('Thank you. Say it twice. He needs everything twice.', 'happy')],
            },
            {
              id: 'ask',
              label: 'What did you want to say to Link, in the memory?',
              then: [MI('Oh. That was a hundred years ago. It can wait a bit more.', 'soft')],
            },
          ],
        },
        done: {
          id: 'pa5-08-ruta-done',
          lines: [MI('Now. Let’s turn this great beast round. There’s a castle that needs a word with it.')],
        },
      },
    ],
    complete: {
      id: 'pa5-08-complete',
      lines: [
        N('Vah Ruta turns slowly, all its stone weight, until its trunk points at the far-off castle.'),
        N('The rain stops. The sun comes out over the Domain, and every stone in it lights up.'),
        SI('You did it! She did it! I am going to cry, and it’s going to be very obvious, because I’m quite large.', 'happy'),
        N('He does. You tell him he was very brave, twice.'),
        PX('One Beast. Three to go. One memory. I’m counting. I’m always counting.'),
      ],
    },
    rewards: [],
    sets: { 'pa5-08': true },
    notes:
      'MEMORY (on-road, 1 of 4): Mipha’s Touch plays in pa5-08-domain. Mipha appears only as a spirit and in memory. ' +
      'Muzu’s blame is grief, and it softens on screen within the scene. The Beast is a puzzle with terminals; no fight ' +
      'is ours to stage (Link handles the Blight in one line if at all; here, not at all).',
  },

  // ---------------------------------------------------------------- PA5-9
  {
    id: 'pa5-09',
    code: 'PA5-9',
    title: 'Death Mountain',
    source: `${GAME}: Goron City and Vah Rudania`,
    audience: 'all',
    trigger: { where: WHERE, when: after('PA5-8') },
    requires: ['PA5-8'],
    speakers: [YUNOBO, DARUK],
    steps: [
      {
        id: 'pa5-09-s1',
        goal: 'Ride up Death Mountain with Yunobo.',
        hint: 'Drink the fireproof potion first; your Nubbin goes in the pot.',
        check: 'escort:pa5-yunobo:crater',
        scene: {
          id: 'pa5-09-yunobo',
          lines: [
            N('Death Mountain glows red at the top. The air shimmers, and the rocks crack and spit.'),
            N('You drink a fireproof potion that tastes of cold metal. Your Nubbin won’t drink it.'),
            N('So your Nubbin rides in a cooking pot, with a lid, peeping out under the rim.'),
            YU('Hi. I’m Yunobo. Sorry. I’m shy. Sorry I said sorry.', 'soft'),
            YU('My great-great-grandpa was Daruk. Everyone says I’m like him. I don’t think I’m like him at all.'),
            YU('I can roll, though. And I can’t get hurt by stuff. So, um, I can roll you up there. If you like.'),
            N('Yunobo curls into a ball, and Link climbs into a cannon. You hold your Nubbin’s pot very firmly.'),
            PX('This is the most ridiculous transport I’ve ever seen. I love it. Fire!'),
          ],
        },
        done: {
          id: 'pa5-09-yunobo-done',
          lines: [
            N('Yunobo rolls up the slope like a boulder that has decided to be brave.'),
            YU('Did I do good? I did good! Sorry. I mean: good.', 'happy'),
          ],
        },
      },
      {
        id: 'pa5-09-s2',
        goal: 'Go inside Vah Rudania and help free it.',
        hint: 'The Beast tips over to walk on the wall; the terminals tip with it.',
        check: 'puzzle:pa5-rudania:terminals',
        scene: {
          id: 'pa5-09-rudania',
          lines: [
            N('Vah Rudania is a stone salamander as big as a hill, walking round the crater rim with lava dripping off it.'),
            N('Inside, the whole Beast tips on its side to climb a cliff. The floor becomes the wall.'),
            N('Your Nubbin rolls about in its pot, quite happily, all the way to the far wall and back.'),
            N('At the last terminal, a big warm light gathers into a big warm Goron: Daruk.'),
            DA('HAH! Little brother! You finally made it. And you brought a cook and a pot with a face in it!', 'happy'),
            DA('Yunobo got you up here? My Yunobo? Ha! I knew that kid had it in him.'),
            DA('Tell him something from me. Tell him being scared doesn’t make you not brave. It makes it count.'),
          ],
          choices: [
            {
              id: 'promise',
              label: 'I’ll tell him exactly that.',
              then: [DA('Good. Then I’ll lend Link my shield. Everybody gets a present today!', 'happy')],
            },
            {
              id: 'pot',
              label: 'Let your Nubbin out to say hello.',
              then: [N('Your Nubbin climbs out of the pot. Daruk’s ghost pats its head, very gently, with one huge finger.')],
            },
          ],
        },
        done: {
          id: 'pa5-09-rudania-done',
          lines: [N('Vah Rudania climbs to the top of the crater and turns its great head towards the castle.')],
        },
      },
    ],
    complete: {
      id: 'pa5-09-complete',
      lines: [
        N('Back down the mountain, you tell Yunobo what Daruk said. He listens with his whole face.'),
        YU('He said that? About me?', 'shock'),
        N('He cries a bit, and then he laughs, and then he rolls down the road ahead of you, just because he can.'),
        PX('Two Beasts. I’m running out of fingers for this. I mean I’ve got eight left, but the principle.'),
      ],
    },
    rewards: [],
    sets: { 'pa5-09': true },
    notes:
      'The potion is the fireproof elixir; your Nubbin refuses it and rides in a cooking pot (comic, safe; the pot is ' +
      'cool). Daruk appears only as a spirit. Yunobo’s cannon ride is a cutscene, not a minigame.',
  },

  // ---------------------------------------------------------------- PA5-10
  {
    id: 'pa5-10',
    code: 'PA5-10',
    title: 'Rito Village',
    source: `${GAME}: Rito Village and Vah Medoh`,
    audience: 'all',
    trigger: { where: WHERE, when: after('PA5-9') },
    requires: ['PA5-9'],
    speakers: [KASS, TEBA, REVALI],
    steps: [
      {
        id: 'pa5-10-s1',
        goal: 'Listen to the bard in the square at Rito Village.',
        hint: 'He’s on the landing below the elder’s perch, with an accordion.',
        check: 'sit:pa5-kass:village-square',
        scene: {
          id: 'pa5-10-kass',
          lines: [
            N('Rito Village is built round a stone spire over a lake, all ladders and landings and feathers.'),
            N('In the square a tall blue bird-man is playing an accordion. He doesn’t sing; he only plays.'),
            KA('Ah, travellers. Sit if you like. These are my teacher’s tunes. He wrote them for the princess.'),
            KA('He’s long gone now. I play them so somebody still does.'),
            N('The tune goes up and comes down slowly, like a bird landing.'),
            N('Your Nubbin sits at Kass’s feet and sways. Link stands at the back with his arms folded and doesn’t leave.'),
            PX('No words. Good. Some tunes are better without words. You fill them in yourself.', 'soft'),
          ],
          choices: [
            {
              id: 'coin',
              label: 'Put a coin in his hat.',
              then: [KA('Thank you. My chicks will eat tonight. There are many of them. They eat a lot.', 'happy')],
            },
            {
              id: 'ask',
              label: 'Play the last one again?',
              then: [N('He does. It’s better the second time, the way some things are.')],
            },
          ],
        },
        done: {
          id: 'pa5-10-kass-done',
          lines: [KA('Teba is looking for someone brave enough to fly at the Beast. Up on the flight range.')],
        },
      },
      {
        id: 'pa5-10-s2',
        goal: 'Help at the flight range while Teba trains Link.',
        hint: 'Stand on the windy ledge and call out the targets as they rise.',
        check: 'minigame:clear:pa5-flight-range',
        scene: {
          id: 'pa5-10-range',
          lines: [
            N('The flight range is a hut on a cliff, with warm air rushing up from below. Teba, a white Rito, is waiting.'),
            TE('You’re the Hylian? You glide? Good. Show me. The Beast won’t let anyone near.'),
            TE('Five targets. You call them, he shoots, I fly. Don’t blink.'),
            N('Link jumps off the cliff, and the warm air catches his glider. You shout every target as it rises.'),
            N('Your Nubbin points at each one too, a half-second before you see it.'),
            PX('Your Nubbin is a better spotter than you. No offence. All offence.'),
          ],
        },
        done: {
          id: 'pa5-10-range-done',
          lines: [TE('Not bad. Not bad at all. Tomorrow, we go for the bird.'), N('He nods at your Nubbin, warrior to warrior.')],
        },
      },
      {
        id: 'pa5-10-s3',
        goal: 'Go inside Vah Medoh and help free it.',
        hint: 'The Beast tilts to one side and then the other; walk with the tilt.',
        check: 'puzzle:pa5-medoh:terminals',
        scene: {
          id: 'pa5-10-medoh',
          lines: [
            N('Teba flies Link up through a storm of wind to the great stone bird. You and your Nubbin follow in a basket.'),
            N('Inside Vah Medoh, the floor tilts like a ship’s deck. Your Nubbin slides from one side to the other and back.'),
            N('At the last terminal, a sharp blue light gathers into a slim, proud Rito: Revali.'),
            RE('Well. Look who finally found the time. A century, give or take. I wasn’t counting.'),
            RE('And you’ve brought… a gardener. And a small round thing. Charming.'),
            N('He looks at your Nubbin for a long time. Your Nubbin looks back, quite as proud.'),
            RE('Fine. It has spirit. I’ll give you that. Don’t tell anyone I said so.'),
          ],
        },
        done: {
          id: 'pa5-10-medoh-done',
          lines: [
            RE('Take my gale, then. And use it properly. Go and get her.'),
            N('Vah Medoh tips its great wings and turns its beak towards the castle.'),
          ],
        },
      },
    ],
    complete: {
      id: 'pa5-10-complete',
      lines: [
        N('Back in the square, Kass is still playing. Now the tune sounds a little like a bird that has found its way home.'),
        PX('Three Beasts. Revali’s my favourite. Don’t tell the others. He’d be unbearable.'),
      ],
    },
    rewards: [],
    sets: { 'pa5-10': true },
    notes:
      'KASS: tunes only, described, never sung; no words of his songs anywhere, no music from the game (an original ' +
      'accordion tune in the same mood). The flight range is a light spotting minigame: the player calls targets; ' +
      'Link shoots. Revali appears only as a spirit.',
  },

  // ---------------------------------------------------------------- PA5-11
  {
    id: 'pa5-11',
    code: 'PA5-11',
    title: 'Gerudo Town',
    source: `${GAME}: Gerudo Town, the Yiga hideout and Vah Naboris`,
    audience: 'all',
    trigger: { where: WHERE, when: after('PA5-10') },
    requires: ['PA5-10'],
    speakers: [RIJU, BULIARA, YIGA, URBOSA, ZELDA],
    steps: [
      {
        id: 'pa5-11-s1',
        goal: 'Go into Gerudo Town with Riju’s guard, Buliara.',
        hint: 'Buliara meets you at the oasis outside the gate.',
        check: 'escort:pa5-buliara:gerudo-town',
        scene: {
          id: 'pa5-11-riju',
          lines: [
            N('The desert is white and hot. Gerudo Town shimmers behind its walls, all palms and painted cloth.'),
            BU('You are the travellers the elder of Kakariko wrote about. Walk with me. Speak when spoken to.'),
            N('Buliara is very tall, with a very large sword. Your Nubbin walks very close to your leg.'),
            N('The chief is young, about twelve, with a heavy gold crown and a sand seal asleep at her feet.'),
            RI('I need my Thunder Helm. It was my family’s. The Yiga clan stole it from under our noses.'),
            RI('Without it I can’t go near Vah Naboris. And the sandstorm is getting worse.'),
            BU('The chief should not go into the hideout herself.'),
            RI('The chief knows that, Buliara.', 'angry'),
          ],
          choices: [
            {
              id: 'we',
              label: 'We’ll get it back for you.',
              then: [RI('Thank you. Bring it here, and I’ll lead you to the Beast. Me. Personally.', 'happy')],
            },
            {
              id: 'ask',
              label: 'Who are the Yiga?',
              then: [BU('Thieves. Very sneaky. Very fond of bananas. Too fond of bananas.')],
            },
          ],
        },
        done: {
          id: 'pa5-11-riju-done',
          lines: [N('Buliara gives you a bunch of bananas from the market. She does not explain, and she doesn’t need to.')],
        },
      },
      {
        id: 'pa5-11-s2',
        goal: 'Sneak through the Yiga hideout and get the Thunder Helm.',
        hint: 'Leave bananas where the guards can see them, and slip past while they look.',
        check: 'place:pa5-bananas:yiga-hideout',
        scene: {
          id: 'pa5-11-yiga',
          lines: [
            N('The Yiga hideout is in a cave in the canyon, all red banners and torches and a strong smell of fruit.'),
            N('A Yiga footsoldier in a red suit and a white mask guards a corridor, eating a banana.'),
            YI('Halt! Who goes… is that a banana? No. Focus. Who goes there?'),
            N('Your Nubbin places a banana on the floor, very slowly, and backs away.'),
            YI('That is a trap. I know that is a trap. I am not falling for a trap.'),
            N('He stares at the banana for a long time. Then he leans down to pick it up.'),
            N('You walk past him with Link. Your Nubbin leaves a second banana, just in case.'),
            PX('I’d love to say the villains are cleverer than this. They’re not. They really love bananas.'),
          ],
        },
        done: {
          id: 'pa5-11-yiga-done',
          lines: [
            N('The helm is in a chest at the back, beside a mountain of banana skins.'),
            YI('Oh, come ON.', 'angry'),
            N('Link runs, and you run. Your Nubbin runs fastest, giggling.'),
          ],
        },
      },
      {
        id: 'pa5-11-s3',
        goal: 'Go inside Vah Naboris in the sandstorm and help free it.',
        hint: 'Riju’s lightning drops the Beast’s shield; then you’re inside.',
        check: 'puzzle:pa5-naboris:terminals',
        scene: {
          id: 'pa5-11-naboris',
          lines: [
            N('Riju puts on the helm. Lightning comes down round the stone camel, and its shield fails.'),
            N('Inside Vah Naboris, the Beast turns slowly on great stone gears. Your Nubbin follows the sparks round the walls.'),
            N('At the last terminal, a tall golden light gathers into a woman: Urbosa, the Gerudo chief of a hundred years ago.'),
            UR('There you are. You took your time. You always did, except where she was concerned.', 'happy'),
            UR('I watched the princess grow up. Her mother was my dearest friend. I promised to look after her.'),
            UR('I couldn’t. Not at the end. So you will, won’t you?', 'soft'),
            N('She looks down at your Nubbin, and then at you.'),
            UR('And so will you, I can see. Good. She can’t have too many friends.'),
          ],
        },
        done: {
          id: 'pa5-11-naboris-done',
          lines: [
            UR('Take my fury, then. It’ll be useful.'),
            N('Vah Naboris turns in the sand until it faces the far castle.'),
          ],
        },
      },
    ],
    complete: {
      id: 'pa5-11-complete',
      lines: [
        RI('Four Beasts. All four, aimed at the castle. A hundred years of waiting, and it’s you who came.', 'happy'),
        BU('The chief did very well.'),
        RI('The chief knows that, Buliara.', 'happy'),
        PX('Four Beasts. Four Champions. That’s eight fingers. Two left, and I’m saving them for the castle.'),
      ],
    },
    rewards: [],
    sets: { 'pa5-11': true },
    notes:
      'CARE: the game’s disguise to enter Gerudo Town is left out; you enter with Buliara as escorts of the elder’s ' +
      'letter. The Yiga are comic: masks, red suits, banana weakness; no ninja clichés, no bowing gags, no accents. ' +
      'Banana placement is a light stealth beat that cannot fail. Urbosa appears only as a spirit.',
  },

  // ---------------------------------------------------------------- PA5-12
  {
    id: 'pa5-12',
    code: 'PA5-12',
    title: 'Shelter from the Storm',
    source: `${GAME}: the memory "Shelter from the Storm"`,
    audience: 'all',
    trigger: { where: WHERE, when: after('PA5-11') },
    requires: ['PA5-11'],
    speakers: [ZELDA],
    steps: [
      {
        id: 'pa5-12-s1',
        goal: 'Find the rainy tree from the photograph.',
        hint: 'It’s on your road; hold the photograph up until the slate chirps.',
        check: 'find:pa5-photo:shelter',
        scene: {
          id: 'pa5-12-road',
          lines: [
            N('It starts to rain on the road. Proper rain, the kind that runs down your neck.'),
            N('You take out the photograph with the tree in it. The tree is right there, by the road.'),
            N('Link goes and stands under it, where the camera stood. So do you, and your Nubbin.'),
            PX('This one’s on the road. You didn’t even have to look for it. Some memories wait for you.'),
            N('The slate chirps once, softly. The rain gets quieter, and then it isn’t this rain any more.'),
            N('It is the same rain, a hundred years ago.'),
          ],
        },
      },
      {
        id: 'pa5-12-s2',
        goal: 'Sit at the edge of the memory.',
        hint: 'Stay under the tree with your Nubbin until the memory ends.',
        check: 'sit:pa5-memory:shelter-edge',
        scene: {
          id: 'pa5-12-memory',
          lines: [
            N('Under the tree, a young woman in a hood is sitting with her knees pulled up. Link is beside her, younger.'),
            ZE('I’ve prayed every day since I was little. At the springs, in the cold, until I couldn’t feel my feet.'),
            ZE('Everyone says the power is in my blood. My mother had it. Her mother had it.'),
            ZE('It won’t come. I don’t know what I’m doing wrong. I don’t know what I am, if I’m not that.', 'sad'),
            N('Link doesn’t say anything. He sits beside her in the rain.'),
            N('You and your Nubbin are at the edge of the memory, under the same tree, in the same rain. They can’t see you.'),
            PX('He doesn’t fix it. He just stays. I think that’s the right answer. I think it’s nearly always the right answer.', 'soft'),
          ],
          choices: [
            {
              id: 'closer',
              label: 'Shift a little closer.',
              then: [N('You move up under the branches. The rain drips off the leaves on to all of you the same.')],
            },
            {
              id: 'stay',
              label: 'Stay where you are.',
              then: [N('You stay. Your Nubbin leans against you, and you all listen to the rain.')],
            },
          ],
        },
        done: {
          id: 'pa5-12-memory-done',
          lines: [N('The memory goes, and the rain is now again. Link is still sitting under the tree, with his eyes shut.')],
        },
      },
    ],
    complete: {
      id: 'pa5-12-complete',
      lines: [
        N('After a while, he stands up. He puts the photograph back in your coat himself, carefully, out of the rain.'),
        PX('Memory two. I’ve stopped making jokes about counting. It doesn’t feel like that kind of counting now.'),
      ],
    },
    rewards: [],
    sets: { 'pa5-12': true },
    notes:
      'MEMORY (on-road, 2 of 4): Shelter from the Storm. Zelda is first seen in the PA5-6 frog test shot; licensed design. The ' +
      'memory is staged with you and your Nubbin visible at its edge, slightly greyed, unseen by them. Hazel’s third ' +
      'rule is acted here (Link sits and waits) and never quoted.',
  },

  // ---------------------------------------------------------------- PA5-13
  {
    id: 'pa5-13',
    code: 'PA5-13',
    title: 'The Lost Woods',
    source: `${GAME}: the Lost Woods, Korok Forest and the sword`,
    audience: 'all',
    trigger: { where: WHERE, when: after('PA5-12') },
    requires: ['PA5-12'],
    speakers: [DEKU, ZELDA],
    steps: [
      {
        id: 'pa5-13-s1',
        goal: 'Follow the torch flames through the fog.',
        hint: 'Go the way the flame leans; your Nubbin listens for giggles.',
        check: 'walk:pa5-torches:lost-woods',
        scene: {
          id: 'pa5-13-fog',
          lines: [
            N('The Lost Woods are full of fog, thick and white and still. Anyone who wanders off the path is turned round.'),
            N('Link lights a torch. The flame leans gently one way, as if something were breathing on it.'),
            N('You follow the lean. Your Nubbin follows the giggles, which come from the same direction.'),
            PX('Don’t go the wrong way. I can’t see you in this. You’re a white screen with a torch in it.'),
            N('Once, you turn the wrong way. The fog thickens, and you are back where you started.'),
            N('Your Nubbin giggles, sharply: it wants you to keep up. You do.'),
          ],
        },
        done: {
          id: 'pa5-13-fog-done',
          lines: [N('The fog lifts all at once. In front of you is a green forest full of little leaf-faced Koroks, and a tree.')],
        },
      },
      {
        id: 'pa5-13-s2',
        goal: 'Speak with the Great Deku Tree.',
        hint: 'The tree in the middle of the forest. It has a face.',
        check: 'talk:pa5-deku:korok-forest',
        scene: {
          id: 'pa5-13-deku',
          lines: [
            N('The Great Deku Tree is so old it has a face, with a long mossy moustache. When it talks, the leaves shake.'),
            DE('Ah. Young Link. It has been a long time. I have kept something for you, as I was asked.'),
            DE('And you have brought a gardener. And a small friend that my Koroks have been talking about. Welcome.'),
            N('Koroks come out of every bush to look at your Nubbin. It giggles, they all giggle back, and it goes on a while.'),
            N('In a clearing in front of the tree, a sword is stuck in a stone. Its blade shines through the moss.'),
            DE('The sword has waited a hundred years. It will only come out for one who is strong enough.'),
            PX('This is the bit where you find out if your hero’s been eating his greens.'),
          ],
          choices: [
            {
              id: 'ask',
              label: 'Who asked you to keep it?',
              then: [DE('Ah. Look and see. The young one is about to remember it for himself.')],
            },
            {
              id: 'wait',
              label: 'Wait with the Koroks.',
              then: [N('A Korok sits on your Nubbin’s head. Your Nubbin allows this.')],
            },
          ],
        },
      },
      {
        id: 'pa5-13-s3',
        goal: 'Watch Link at the sword in the stone.',
        hint: 'Stand by the stone; the memory comes when he takes the hilt.',
        check: 'watch:pa5-memory:sword',
        scene: {
          id: 'pa5-13-sword',
          lines: [
            N('Link puts his hands on the hilt. Before he can pull, the forest changes into a memory.'),
            N('Zelda, a hundred years ago, is kneeling by this same stone. She is tired and dirty, as if she has walked a long way.'),
            ZE('He’ll come back for it. He has to. I’m leaving it here, where it’s safe.', 'soft'),
            ZE('And I’m going back. Alone. To hold it off as long as I can.'),
            N('She lays the sword in the stone, stands up, and walks away into the fog. She doesn’t look back.'),
            N('The memory goes, and Link pulls. His arms shake, and the sword comes out, ringing.'),
          ],
        },
        done: {
          id: 'pa5-13-sword-done',
          lines: [
            DE('So. You are strong enough. She knew you would be.'),
            N('Your Nubbin looks up at the sword, and then at Link, and then holds his free hand.'),
          ],
        },
      },
    ],
    complete: {
      id: 'pa5-13-complete',
      lines: [
        N('On the way out of the forest, the Koroks giggle you out, all the way to the edge of the fog.'),
        PX('Three memories. She left that sword there herself and went back. I keep thinking about her walking back.'),
      ],
    },
    rewards: [],
    sets: { 'pa5-13': true },
    notes:
      'MEMORY (on-road, 3 of 4): the sword left at the Deku Tree (our own staging of the game’s memory of Zelda at the ' +
      'Lost Woods). The Great Deku Tree talks (the source’s own talking tree). Pulling the sword is a hold-the-button ' +
      'beat that always succeeds once Link is strong enough (the step requires PA5-12; no stamina gate is ours).',
  },

  // ---------------------------------------------------------------- PA5-14
  {
    id: 'pa5-14',
    code: 'PA5-14',
    title: 'Father and Daughter',
    source: `${GAME}: the memory "Father and Daughter"`,
    audience: 'all',
    trigger: { where: WHERE, when: after('PA5-13') },
    requires: ['PA5-13'],
    speakers: [KING, ZELDA],
    steps: [
      {
        id: 'pa5-14-s1',
        goal: 'Find the courtyard from the photograph, in the ruins near the castle.',
        hint: 'The broken garden by the old town walls; look for the fountain.',
        check: 'explore:pa5-castle-town:courtyard',
        scene: {
          id: 'pa5-14-road',
          lines: [
            N('The ruined town below the castle is quiet. Grass grows in the streets; old machines sleep in the squares.'),
            N('You take out the photograph of a garden with a fountain. You find the fountain, dry and cracked.'),
            PX('This is the closest you’ve been. That cloud’s right overhead. It’s… I don’t like it, so close.', 'think'),
            N('Your Nubbin picks a single blue flower from between the stones and holds it.'),
            N('Link stands where the camera stood, by the fountain.'),
            N('The slate chirps, quietly, the way it does when it has found the place.'),
          ],
          choices: [
            {
              id: 'beside',
              label: 'Stand next to him.',
              then: [N('You stand next to him. The memory comes like a door opening.')],
            },
            {
              id: 'back',
              label: 'Stand back a little.',
              then: [N('You stand back with your Nubbin. The memory comes like a door opening.')],
            },
          ],
        },
      },
      {
        id: 'pa5-14-s2',
        goal: 'Watch the memory by the fountain.',
        hint: 'Stay where you are until it ends.',
        check: 'watch:pa5-memory:father',
        scene: {
          id: 'pa5-14-memory',
          lines: [
            N('The garden is green again. Zelda, seventeen, is walking fast with a notebook, and the king blocks her way.'),
            KI('Where have you been? The springs? Or that laboratory again?'),
            ZE('The ancient machines can help us. I’m close to understanding them, Father. I can be useful.'),
            KI('You are not here to be useful with machines. You are here to wake your power. Pray. That is your duty.'),
            ZE('I have prayed! Every day of my life, I have prayed. Nobody has ever asked what else I could do.', 'angry'),
            KI('Enough. You are not a child. Stop playing with machines and do what only you can do.', 'angry'),
            N('She stands very straight, with her notebook pressed against her chest. She doesn’t cry until he has gone.'),
          ],
        },
        done: {
          id: 'pa5-14-memory-done',
          lines: [N('The memory goes, and the fountain is dry again. Your Nubbin is still holding its blue flower.')],
        },
      },
    ],
    complete: {
      id: 'pa5-14-complete',
      lines: [
        N('The memory just ends. Link stands by the fountain for a while.'),
        N('Your Nubbin puts its blue flower on the edge of the fountain. Then you go on.'),
        PX('Four memories on the road. That’s every one on the road. The rest of the road goes to the castle.'),
      ],
    },
    rewards: [],
    sets: { 'pa5-14': true },
    notes:
      'MEMORY (on-road, 4 of 4): Father and Daughter. The king is hard, not cruel; Zelda’s fury is shown with respect. ' +
      'OLD MAN PAYOFF: with pa5-oldman = ate, play PA5_VARIANTS pa5-14-complete-ate instead of pa5-14-complete (you tell ' +
      'Link the old man is sorry now). With left, the memory just ends, as written. The blue flower is a silent princess ' +
      '(unnamed here).',
  },

  // ---------------------------------------------------------------- PA5-15
  {
    id: 'pa5-15',
    code: 'PA5-15',
    title: 'The Road to the Castle',
    source: `${GAME}: Impa’s last photograph and Blatchery Plain`,
    audience: 'all',
    trigger: { where: WHERE, when: after('PA5-14') },
    requires: ['PA5-14'],
    speakers: [IMPA, PAYA, ZELDA],
    steps: [
      {
        id: 'pa5-15-s1',
        goal: 'Go back to Kakariko and show Impa the photographs.',
        hint: 'Impa is under her hat, as always.',
        check: 'talk:pa5-impa:kakariko-return',
        scene: {
          id: 'pa5-15-impa',
          lines: [
            N('Back in Kakariko, Paya drops the broom again. It has become a sort of greeting.'),
            N('You lay the photographs out on Impa’s floor. Some have a little blue tick in the corner from the slate, and some don’t.'),
            IM('Hm. You found the ones on your road. Good. He remembers her a little now. I can see it in him.'),
            IM('Some memories are still waiting, out in the hills. They’ll keep. Memories are patient. More patient than us.'),
            IM('Go, then. She has waited long enough. Go to the castle.'),
            PX('That’s fine. That’s a fine way to do it. Some people read the whole book. Some go straight to the end.'),
          ],
          choices: [
            {
              id: 'ready',
              label: 'We’re ready.',
              then: [IM('Ready? I have been getting ready for a hundred years. Go anyway.')],
            },
            {
              id: 'sorry',
              label: 'Should we have looked for the rest?',
              then: [IM('You came back. That is what matters most. The rest can be found another day.', 'soft')],
            },
          ],
        },
        done: {
          id: 'pa5-15-impa-done',
          lines: [IM('Paya. Stop dropping things and wish them luck.'), PA('Luck! Good… luck!')],
        },
      },
      {
        id: 'pa5-15-s2',
        goal: 'Cross Blatchery Plain on the road to the castle.',
        hint: 'The road runs straight across the plain to the castle gate.',
        check: 'walk:pa5-blatchery:plain',
        scene: {
          id: 'pa5-15-plain',
          lines: [
            N('The road to the castle crosses a wide flat plain. It is grassy and quiet.'),
            N('All over it lie old machines, great broken spiders of stone and metal, with moss growing on their backs.'),
            N('They’re asleep, or dead. Birds sit on them, and flowers grow from their joints.'),
            N('Link walks past them without slowing. He doesn’t look at them, and he doesn’t look away.'),
            PX('Something happened here. I don’t know what. The game isn’t telling you. Maybe that’s right.', 'think'),
            N('Your Nubbin walks close to your leg until the plain is behind you.'),
          ],
        },
      },
    ],
    complete: {
      id: 'pa5-15-complete',
      lines: [
        N('At the end of the plain the castle rises, dark and huge, with the red-black cloud turning round its top.'),
        N('Link looks at it, then at you and your Nubbin, as if to check you’re still there. You are.'),
        PX('Last stop. Player two’s holding the controls with both hands.'),
      ],
    },
    rewards: [],
    sets: { 'pa5-15': true },
    notes:
      'MEMORY PAYOFF (quest 5, ten quests later). Title: "The Road to the Castle" as written; with the hunt it is shown as ' +
      '"The Thirteenth Photograph". RULE: pa5-hunt = hunt (set by the eighth off-road memory, so all twelve ' +
      'have been seen) plays PA5_VARIANTS pa5-15-impa-hunt, pa5-15-plain-hunt and pa5-15-complete-hunt in ' +
      'place of pa5-15-impa, pa5-15-plain and pa5-15-complete. pa5-15-complete-hunt sets pa5-thirteenth = true. With ' +
      'photoroad, play the scenes as written (Impa: some are still waiting). The hunt variant of ' +
      'step 1 keeps the step’s check. The Blatchery memory shows Link going down on one knee in the mud; never a wound.',
  },

  // ---------------------------------------------------------------- PA5-16
  {
    id: 'pa5-16',
    code: 'PA5-16',
    title: 'Hyrule Castle',
    source: `${GAME}: Hyrule Castle and the sanctum`,
    audience: 'all',
    trigger: { where: WHERE, when: straight('PA5-15') },
    requires: ['PA5-15'],
    speakers: [MIPHA, DARUK, REVALI, URBOSA, ZELDA],
    steps: [
      {
        id: 'pa5-16-s1',
        goal: 'Watch the four Beasts fire on the castle.',
        hint: 'Stand at the castle gate and look up.',
        check: 'watch:pa5-beasts:castle',
        scene: {
          id: 'pa5-16-beams',
          lines: [
            N('The castle is dark and dripping with the Calamity’s ooze, red and black and slow, like old jam.'),
            N('Far away, on the horizon, four great shapes stir. One after another, they glow.'),
            MI('Now, Ruta!'),
            DA('Rudania, let’s go! HAH!'),
            RE('Medoh. Try to keep up.'),
            UR('Naboris. For her.'),
            N('Four beams of blue light cross the sky and strike the castle, one after another. The cloud shrieks and shrinks.'),
            PX('Oh, that’s good. That’s so good. They waited a hundred years to do that.', 'happy'),
          ],
        },
        done: {
          id: 'pa5-16-beams-done',
          lines: [N('The ooze slides back off the castle walls like a tide going out. The way in is open.')],
        },
      },
      {
        id: 'pa5-16-s2',
        goal: 'Climb up through the castle with Link.',
        hint: 'Up the long stair, through the library, to the top.',
        check: 'climb:pa5-castle:sanctum',
        scene: {
          id: 'pa5-16-climb',
          lines: [
            N('Inside, the castle is silent. Dust lies on everything, and the Calamity’s ooze still drips from the ceilings.'),
            N('On the third stair someone has left a banana skin. Your Nubbin steps over it with the air of a veteran.'),
            PX('The Yiga have been. Of course they have.'),
            N('You pass a library with its books still on the shelves, and a girl’s study with drawings of machines on the wall.'),
            N('In the study, on the desk, is a notebook, open. The ink is a hundred years old.'),
            N('Your Nubbin climbs on the chair and looks at it. You don’t read it; it isn’t yours.'),
            N('Link stops at the study door for a long moment. Then he goes on up the stairs, faster.'),
            PX('I wanted to read that. I didn’t. I’m very proud of myself, player one.'),
          ],
          choices: [
            {
              id: 'close',
              label: 'Close the notebook gently.',
              then: [N('You close it, and put a pencil on top, so it stays where she left it.')],
            },
            {
              id: 'leave',
              label: 'Leave it open, as she left it.',
              then: [N('You leave it open. Someone should be able to come back to the page they were on.')],
            },
          ],
        },
      },
      {
        id: 'pa5-16-s3',
        goal: 'Wait at the sanctum door while Link goes in.',
        hint: 'Stand by the door with your Nubbin; it isn’t your fight.',
        check: 'wait:pa5-sanctum:door',
        scene: {
          id: 'pa5-16-sanctum',
          lines: [
            N('At the top is the sanctum, a great hall with a hole in its roof. In the middle hangs a huge cocoon of red and black.'),
            N('Wrapped round the cocoon, holding it shut, is a light: gold, steady, and very faint now.'),
            ZE('Link. You came. I can’t… hold it much longer. Please.', 'sad'),
            N('Link goes in. You stop at the door with your Nubbin, as you have stopped at every door.'),
            N('Then the gold light flickers, and the cocoon bursts, and the Calamity breaks free.'),
            N('It is enormous and spidery and red-black. It goes straight at Link.'),
            PX('Stay at the door. Stay at the door. That’s his. That’s always been his.', 'shock'),
          ],
        },
        done: {
          id: 'pa5-16-sanctum-done',
          lines: [
            N('There is noise and light. You keep your Nubbin behind you and your eyes on Link.'),
            N('He stands, and keeps standing. The Calamity screams and goes up through the hole in the roof.'),
          ],
        },
      },
    ],
    complete: {
      id: 'pa5-16-complete',
      lines: [
        N('It goes out over the field outside, a cloud of red and black. It is getting bigger as it goes.'),
        ZE('It’s fleeing into the field. It’s going to make itself a body. A big one.'),
        PX('Then go to the field. All of you. Go!'),
      ],
    },
    rewards: [],
    sets: { 'pa5-16': true },
    notes:
      'The Champions appear only as voices and beams of light here. The fight in the sanctum is Link’s: staged in two ' +
      'narrated lines, off-centre, with no impact frames. You and your Nubbin are at the door throughout. Zelda is a ' +
      'gold light round the cocoon until PA5-17.',
  },

  // ---------------------------------------------------------------- PA5-17
  {
    id: 'pa5-17',
    code: 'PA5-17',
    title: 'The Field',
    source: `${GAME}: the field before the castle`,
    audience: 'all',
    trigger: { where: WHERE, when: straight('PA5-16') },
    requires: ['PA5-16'],
    speakers: [ZELDA, CLANK],
    steps: [
      {
        id: 'pa5-17-s1',
        goal: 'Watch the Calamity rise in the field.',
        hint: 'Out of the castle gate, and on to the field.',
        check: 'watch:pa5-beast:field',
        scene: {
          id: 'pa5-17-beast',
          lines: [
            N('On the field, the cloud pulls itself together into a beast. It is the size of the field, with eyes like furnaces.'),
            N('It isn’t gory. It’s just very, very big, and angry, and made of smoke that has got ideas.'),
            N('A gold light comes down out of the sky and stands in front of Link. It speaks with Zelda’s voice.'),
            ZE('Link. The bow. Take it. Its arrows are light. Aim for the eyes. I’ll hold it as long as I can.'),
            N('A bow of light is in his hands. A horse comes galloping out of the grass and stops in front of you.'),
            PX('Wait. Are we the horse people? We’re the horse people.', 'shock'),
          ],
        },
        done: {
          id: 'pa5-17-beast-done',
          lines: [N('You take the horse’s reins, and Link climbs on. Your Nubbin climbs on behind him, then thinks again and climbs on you.')],
        },
      },
      {
        id: 'pa5-17-s2',
        goal: 'Hold the horse steady while Link rides and aims.',
        hint: 'Keep the reins steady and ride where the light points.',
        check: 'minigame:clear:pa5-hold-horse',
        scene: {
          id: 'pa5-17-horse',
          lines: [
            N('The horse gallops. You run beside it with the reins, then the horse goes faster than you can run.'),
            N('You climb up behind Link somehow, holding the reins round him. Your Nubbin is wedged between you, squeaking.'),
            N('Link rises in the saddle and draws the bow of light. The arrows go up like falling stars, the wrong way.'),
            PX('GO ON! GO ON! LEFT! LEFT! WHAT A SHOT! He’s through! He’s through!', 'happy'),
            PX('One more! ONE MORE! YES! THE CROWD GOES WILD! The crowd is me! I’m the crowd!', 'happy'),
            N('The beast swings its great head round to follow you. The horse’s ears go flat.'),
          ],
          choices: [
            {
              id: 'steady',
              label: 'Hold the reins steady and straight.',
              set: { 'pa5-17-hold': 'steady' },
              then: [N('You keep the horse straight. The last arrow goes clean and true.')],
            },
            {
              id: 'gentle',
              label: 'Talk to the horse, soft and low.',
              set: { 'pa5-17-hold': 'gentle' },
              then: [N('The horse’s ears turn back to you, and it stops being frightened. The last arrow goes clean and true.')],
            },
          ],
        },
        done: {
          id: 'pa5-17-horse-done',
          lines: [
            N('The beast’s eyes go dark, one and then the other. It sags into the field like a tent coming down.'),
            PX('That’s the whole stadium on its feet. In a shed. Just me. Standing on a stool.', 'happy'),
          ],
        },
      },
    ],
    complete: {
      id: 'pa5-17-complete',
      lines: [
        N('The horse slows to a walk, and you pat its neck. Your Nubbin pats it too, on its ear, which it allows.'),
        N('In front of you, where the beast was, the gold light is standing up, and growing brighter.'),
      ],
    },
    rewards: [],
    sets: { 'pa5-17': true },
    notes:
      'HOLD THE HORSE: an unfailable rhythm minigame (keep the reins in the band); Link does all the shooting. The beast ' +
      'is red-black smoke and stone, never gory; its defeat is a sag, not a death. Pixel cheers like a football crowd ' +
      '(original crowd lines, no chants). WITH s21Done: play PA5_VARIANTS pa5-17-horse-done-clank instead of ' +
      'pa5-17-horse-done (Clank cheers too). pa5-17-hold is read by nothing.',
  },

  // ---------------------------------------------------------------- PA5-18
  {
    id: 'pa5-18',
    code: 'PA5-18',
    title: 'A Hundred Years',
    source: `${GAME}: the sealing and the ending`,
    audience: 'all',
    trigger: { where: WHERE, when: straight('PA5-17') },
    requires: ['PA5-17'],
    speakers: [ZELDA, KING, MIPHA, DARUK, REVALI, URBOSA],
    steps: [
      {
        id: 'pa5-18-s1',
        goal: 'Watch Zelda seal the Calamity.',
        hint: 'Stay with the horse; the light does the rest.',
        check: 'watch:pa5-zelda:seal',
        scene: {
          id: 'pa5-18-seal',
          lines: [
            N('The gold light holds up its hands. The last of the beast is pulled into it, smoke and all, and is gone.'),
            N('The red-black cloud over the castle thins, and thins, and is blue sky.'),
            N('On the castle wall, faint and blue, stand five figures: the old king and the four Champions.'),
            DA('HAH!', 'happy'),
            RE('Well. That was adequate.'),
            N('Mipha waves, small and shy. Urbosa puts her hand on the king’s shoulder, and he nods, and keeps nodding.'),
            KI('Thank you. All of you. Even the little one.', 'soft'),
            N('Then the five figures fade, one after another, the way the king did on the temple roof: unafraid.'),
          ],
        },
        done: {
          id: 'pa5-18-seal-done',
          lines: [
            N('Where the gold light stood, there is a young woman in a white dress. She is very tired, and smiling.'),
            PX('That’s the voice. The one in the cave, at the start. I said it wasn’t me. It’s on the record.', 'soft'),
            PX('She said it to one sleepy boy, for a hundred years. That’s love. Or stubbornness. Usually both.', 'soft'),
          ],
        },
      },
      {
        id: 'pa5-18-s2',
        goal: 'Stay with them in the field.',
        hint: 'Stand back a little with your Nubbin.',
        check: 'wait:pa5-field:credits',
        scene: {
          id: 'pa5-18-question',
          lines: [
            N('Zelda walks across the grass to Link. You stand back a little with your Nubbin and the horse.'),
            ZE('Link. You did it. Thank you. I mean it: thank you, for coming back.'),
            ZE('And thank you, both of you. I don’t know you, but I think you’ve been carrying him a little.', 'soft'),
            N('She turns back to Link. She looks at him for a long time, as if she’s afraid of the answer.'),
            ZE('Do you… really remember me?'),
            N('Link opens his mouth, for the first time since the pool. The screen goes white before you hear what he says.'),
            PX('Oh, you’re joking. You are JOKING. They cut it there?', 'shock'),
          ],
        },
      },
    ],
    complete: {
      id: 'pa5-18-complete',
      lines: [
        N('The credits roll over the field, the castle and the sky. Then the screen shows the field again, and the question.'),
        N('The shed comes back around you: sawdust, the heater, Pixel on her stool. Your Nubbin is asleep in your lap.'),
        PX('That was good. That was really good. The end’s a question. I don’t mind a question.'),
        PX('There are memories you didn’t find, you know. The slate kept the ones you did, though. It’s got an album.'),
      ],
      choices: [
        {
          id: 'look',
          label: 'Look through the ones we found.',
          set: { 'pa5-18-after': 'look-back' },
          then: [
            N('Pixel scrolls the slate’s album on the cabinet screen, one photograph at a time, with great ceremony.'),
            PX('The frog. The test shot. Not one of the twelve. Purah made it her lock screen.'),
            PX('Mipha, fixing his hand. Gently. Pointedly gently.'),
            PX('The tree in the rain. Two people being quiet at each other. Ten out of ten.'),
            PX('The sword in the stone. She parked it there herself. Very organised.'),
            PX('The fountain, and her dad. We don’t scroll fast past that one. But we do scroll.', 'soft'),
            PX('That’s the album. Four and a frog. The rest are out in the hills, being patient. Like the tiny lady said.', 'soft'),
          ],
        },
        {
          id: 'leave',
          label: 'Let the question stay a question.',
          set: { 'pa5-18-after': 'leave-room' },
          then: [PX('Fair. Some endings are better with a bit of room in them.')],
        },
      ],
    },
    rewards: [
      {
        id: 'pa5-photo-frame',
        kind: 'decor',
        label: 'The twelve photographs',
        description: 'Impa’s twelve photographs in a frame on the cottage wall, filled in as you found each one.',
      },
      {
        id: 'pa5-score-plate',
        kind: 'decor',
        label: 'High-score plate: The Hundred-Year Sleep',
        description: 'A brass plate for Pixel’s cabinet with your name on it, for High Score Night.',
      },
    ],
    sets: { 'pa5-18': true, 'pa5-done': true },
    notes:
      'ENDINGS (quest 5 payoff, thirteen quests later). AS WRITTEN: the field and the question (pa5-hunt unset). ' +
      'WITH pa5-hunt = hunt: PA5_VARIANTS pa5-18-complete-hunt replaces pa5-18-complete (the after-credits ' +
      'field: her power gone, they ride out to mend; lifted quote 2 at #6, with childLines). pa5-14-told picks ' +
      'pa5-18-question-oldman-told | -oldman-kept (the father’s message reaches Zelda); pa5-jumper picks ' +
      'pa5-18-seal-done-lent-jumper. LOOK: Pixel scrolls the slate album in the look choice, one line per memory found ' +
      '(four and the frog as written; all thirteen in the hunt variant, which keeps the same choice ids). Nothing ' +
      'replays. The photo frame shows only ' +
      'the memories seen; the high-score plate counts towards High Score Night (any two of PA1–PA5). No Grove flag is ' +
      'written. Pixel’s "tiny lady" is Impa.',
    childLines: {
      'pa5-18-complete-hunt#6': 'I don’t mind. I really don’t.',
    },
  },
];

// =================================================================== VARIANTS

export const PA5_VARIANTS: Scene[] = [
  // ---------------------------------------------------------------- s21Done: Clank on the cabinet (PA5-1 step 1)
  {
    id: 'pa5-01-shed-clank',
    lines: [
      N('The lantern shed smells of sawdust and solder. The cabinet hums in the corner, and Clank is sitting on top of it.'),
      CK('Announcement! I am on the cabinet! It is warm! It is my best friend!', 'happy'),
      PX('He’s been up there since breakfast. He says it’s a lookout. It’s not a lookout. It’s a radiator.'),
      N('She holds up a cartridge. The label is faded to the colour of weak tea, except for one blue eye.'),
      PX('Found it in the mouse nest. I gave them a coaster for it. You go in; I’m player two, on the speaker.'),
      CK('And I am player three! I will announce things!', 'happy'),
      PX('There is no player three. Fine. Player three. Announce quietly.'),
      N('Your Nubbin climbs on to the stool and stares into the dark screen, nose almost on the glass.'),
    ],
    choices: [
      {
        id: 'blow',
        label: 'Blow on the cartridge first.',
        then: [
          PX('Ruling: it does nothing. Ruling two: I’m doing it too.'),
          CK('Announcement: I have also blown on it!'),
          N('Your Nubbin, not to be left out, blows on Clank. Clank announces nothing, for once.'),
        ],
      },
      {
        id: 'slot',
        label: 'Just put it in.',
        then: [PX('A person of action. Player one, ready.')],
      },
    ],
  },

  // ---------------------------------------------------------------- off-road memories (pa5-memories = photohunt)
  // Each replaces a scene the cartridge always plays (same lines, then the memory). The eighth,
  // pa5-13-sword-done-photohunt, sets pa5-hunt = hunt: with the four on-road memories (PA5-8, 12,
  // 13, 14 all come before PA5-15), every one of the twelve has been seen by PA5-15.
  {
    id: 'pa5-06-complete-photohunt',
    lines: [
      PU('Those photographs of Impa’s. The slate can match them now: hold one up, and it will tell you when you’re close.'),
      PU('Remembering is just finding the right place to stand. Most people never work that out.'),
      N('The slate chirps at the same pond, and it is a week later, a hundred years ago. Zelda has a jar with six frogs in it.'),
      ZE('Control group.', 'happy'),
      N('All six frogs look at Link. The memory ends before anyone has to eat anything.'),
      PU('That one is one of the twelve! The princess ran a proper trial. I could cry.', 'happy'),
      N('As you leave, Purah and your Nubbin wave at each other until you are both round the corner.'),
    ],
  },
  {
    id: 'pa5-07-koroks-done-photohunt',
    lines: [
      N('Twelve seeds. Your Nubbin carries them back in its two cupped hands, and won’t let you help.'),
      N('On the way the slate chirps over a field of small blue flowers. A hundred years ago, Zelda kneels there with a notebook.'),
      ZE('They only grow wild. Nobody can grow them in a garden. Isn’t that wonderful? They choose where they live.', 'happy'),
      N('She looks up at Link, and for a moment forgets to be cross with him.'),
      N('The memory goes. Your Nubbin sits among the same flowers, a hundred years later, still not letting go of the seeds.'),
    ],
  },
  {
    id: 'pa5-08-rain-done-photohunt',
    lines: [
      SI('Come up to the Domain! My father will want to meet you. Some of the elders… less so.'),
      N('Halfway up, the slate chirps at a cold spring. A hundred years ago, Zelda stands in it up to her waist, praying.'),
      N('Her lips are blue, and nothing comes. Link waits on the bank with a blanket, because there is nothing else to do.'),
      ZE('Nothing. Again.', 'sad'),
      N('He holds the blanket out. After a long moment, she takes it.'),
      SI('Friends? You went quiet. Come in out of the wet! Well. Into a different wet.', 'happy'),
    ],
  },
  {
    id: 'pa5-09-yunobo-done-photohunt',
    lines: [
      N('Yunobo rolls up the slope like a boulder that has decided to be brave.'),
      YU('Did I do good? I did good! Sorry. I mean: good.', 'happy'),
      N('At the crater edge the slate chirps. A hundred years ago, Daruk claps Link on the back so hard Link nearly goes over.'),
      DA('Little guy, you’re all right! Come back up and we’ll eat rocks. The good ones. Not the gravel.', 'happy'),
      N('The memory goes. Your Nubbin is standing on the crater edge, looking at a rock, as if it might be a good one.'),
      YU('That one’s good. Sorry. I mean: I’d eat that one.', 'soft'),
    ],
  },
  {
    id: 'pa5-10-range-done-photohunt',
    lines: [
      TE('Not bad. Not bad at all. Tomorrow, we go for the bird.'),
      N('He nods at your Nubbin, warrior to warrior.'),
      N('On the landing below, the slate chirps. A hundred years ago, Revali hovers above Link on a gust of his own making.'),
      RE('So you’re the chosen knight. I’m sure the sword knows best. I’m sure it’s not just luck.'),
      N('He shoots up out of sight. Link doesn’t rise to it; he nods to the empty air where Revali was.'),
      PX('He’s so rude. He’s brilliant. Both. That’s allowed.'),
    ],
  },
  {
    id: 'pa5-11-riju-done-photohunt',
    lines: [
      N('Buliara gives you a bunch of bananas from the market. She does not explain, and she doesn’t need to.'),
      N('By the town fountain the slate chirps. A hundred years ago, Urbosa is laughing with Zelda, who has had to sit down.'),
      UR('And then your father fell straight into the fountain. In the crown. In front of everyone.', 'happy'),
      ZE('Don’t. Don’t. I can’t breathe.', 'happy'),
      N('Link stands guard behind them, very straight. One corner of his mouth is trying to move.'),
    ],
  },
  {
    id: 'pa5-12-road-photohunt',
    lines: [
      N('The road crosses a bridge over a gorge, and the slate chirps. A hundred years ago, Zelda turns round sharply on Link.'),
      ZE('Stop following me. I know you’re ordered to. I don’t need a reminder of everything I can’t do.', 'angry'),
      N('He stops, but he doesn’t go away. She walks on, and after a while, he follows at the same distance.'),
      PX('Oof. She didn’t like him at first. That makes the rest better, somehow.'),
      N('It starts to rain on the road. Proper rain, the kind that runs down your neck.'),
      N('You take out the photograph with the tree in it. The tree is right there, by the road.'),
      N('Link goes and stands under it, where the camera stood. So do you, and your Nubbin.'),
      PX('This one’s on the road. You didn’t even have to look for it. Some memories wait for you.'),
      N('The slate chirps once, softly. The rain gets quieter, and then it isn’t this rain any more.'),
      N('It is the same rain, a hundred years ago.'),
    ],
  },
  {
    id: 'pa5-13-sword-done-photohunt',
    lines: [
      DE('So. You are strong enough. She knew you would be.'),
      N('Your Nubbin looks up at the sword, and then at Link, and then holds his free hand.'),
      N('The sword rings, and the slate chirps with it. A hundred years ago, by a shrine in a meadow, Link kneels before Zelda.'),
      ZE('I name you my knight. The sword chose you. I didn’t. Please understand that.', 'sad'),
      N('Behind her, four Champions stand in a row, very straight. Daruk is trying not to grin, and failing.'),
      N('The memory goes. Your Nubbin is kneeling in the moss too, very solemnly, with its crown bowed.'),
      PX('Eleven ticks on the slate. The last one’s on our road. I’m not counting out loud. I am counting.', 'soft'),
    ],
    set: { 'pa5-hunt': 'hunt' },
  },

  // ---------------------------------------------------------------- PA5-14 complete (pa5-oldman = ate)
  {
    id: 'pa5-14-complete-ate',
    lines: [
      N('The memory ends. Link stands by the dry fountain, very still.'),
      N('You remember a cabin on a cold mountain, a stone pot, and an old man who didn’t say his daughter’s name.'),
      N('He said he was hard on her. He said he only ever told her to try harder.'),
    ],
    choices: [
      {
        id: 'told',
        label: 'Tell Link the old man is sorry now.',
        set: { 'pa5-14-told': 'oldman-told' },
        then: [
          Y('He’s sorry. Her father. He told me, on the mountain. He’d have told her, if he could.'),
          N('Link turns and looks at the castle for a long time. The red-black cloud turns over it, slow.'),
          N('Then he nods, once, as if he has been given something to carry to someone.'),
          N('You give Link the old man’s last apple to carry, too. It has gone very wrinkled in your coat.'),
          PX('That’s a message now. He’s got a message to deliver. Ruling: that’s the most important thing in his bag.', 'soft'),
        ],
      },
      {
        id: 'kept',
        label: 'Keep it for her, if you ever meet her.',
        set: { 'pa5-14-told': 'oldman-kept' },
        then: [
          N('You keep it, in your coat with the photographs. Your Nubbin puts its blue flower on the fountain edge.'),
          PX('Some things you say to the person themselves. Good call.', 'soft'),
        ],
      },
    ],
  },

  // ---------------------------------------------------------------- PA5-15, hunted every memory (title: The Thirteenth Photograph)
  {
    id: 'pa5-15-impa-hunt',
    lines: [
      N('Back in Kakariko, you lay all twelve photographs out on Impa’s floor. Every one has a blue tick in its corner.'),
      IM('All twelve. You went up the mountains and down the holes. You took the slow way.'),
      IM('Then you’ve earned the last one. I never gave it out. I hung it on my wall instead.'),
      N('She takes down a thirteenth photograph from beside the shrine in her house. A wide plain, and old machines.'),
      IM('Blatchery Plain. You walked across it in your sleep, I think. Go and stand there with him.'),
      PX('There’s a thirteenth. Of course there’s a thirteenth. I knew it. I’d have hung it on my wall too.', 'soft'),
    ],
    choices: [
      {
        id: 'ready',
        label: 'We’ll go now.',
        then: [IM('Go gently. It’s the hardest one. It’s the one that matters.')],
      },
      {
        id: 'sorry',
        label: 'What happened there?',
        then: [IM('He should remember it himself. You should be there when he does.', 'soft')],
      },
    ],
  },
  {
    id: 'pa5-15-plain-hunt',
    lines: [
      N('You stand with Link where the thirteenth photograph was taken. The slate chirps, and it is a hundred years ago.'),
      N('The plain is full of rain and running machines. Link is with Zelda, and he is so tired he can barely stand.'),
      N('He goes down on one knee in the mud. A machine turns its eye on him.'),
      N('Zelda throws herself in front of him with her hand up, and the power that never came, comes.'),
      N('Gold light pours from her hand over the whole plain. Every machine stops, all at once, and stays stopped.'),
      ZE('Oh. Oh, there it is. Now. Of course it was now.', 'shock'),
      ZE('Sleep. Heal. They’ll keep you safe. I’ll hold it till you come back. However long that is.', 'soft'),
      N('She walks away towards the castle, alone, as you’ve seen her walk away before. This time you know where she’s going.'),
    ],
  },
  {
    id: 'pa5-15-complete-hunt',
    lines: [
      N('The memory goes. Link is kneeling in the grass where he knelt then, and your Nubbin is kneeling beside him.'),
      N('He stands, and looks at the castle, and this time he looks at it the way you look at a house where someone is waiting.'),
      PX('Thirteen. She held a castle shut for a hundred years because of a promise on this field. Let’s go and get her.', 'soft'),
    ],
    set: { 'pa5-thirteenth': true },
  },

  // ---------------------------------------------------------------- PA5-17, s21Done: Clank cheers too
  {
    id: 'pa5-17-horse-done-clank',
    lines: [
      N('The beast’s eyes go dark, one and then the other. It sags into the field like a tent coming down.'),
      PX('That’s the whole stadium on its feet. In a shed. Me and a robot. Standing on a stool.', 'happy'),
      CK('ANNOUNCEMENT! WE HAVE WON! Announcement: I have fallen off the cabinet!', 'happy'),
    ],
  },

  // ---------------------------------------------------------------- PA5-18 seal done (pa5-jumper = lent-jumper)
  {
    id: 'pa5-18-seal-done-lent-jumper',
    lines: [
      N('Where the gold light stood, there is a young woman in a white dress. She is very tired, and smiling.'),
      PX('That’s the voice. The one in the cave, at the start. I said it wasn’t me. It’s on the record.', 'soft'),
      PX('She said it to one sleepy boy, for a hundred years. That’s love. Or stubbornness. Usually both.', 'soft'),
      N('Link is still wearing your jumper under his tunic. Zelda looks at it, then at you, and decides not to ask.'),
    ],
  },

  // ---------------------------------------------------------------- PA5-18 question (pa5-14-told): the father's message arrives
  {
    id: 'pa5-18-question-oldman-told',
    lines: [
      N('Zelda walks across the grass to Link. You stand back a little with your Nubbin and the horse.'),
      ZE('Link. You did it. Thank you. I mean it: thank you, for coming back.'),
      ZE('And thank you, both of you. I don’t know you, but I think you’ve been carrying him a little.', 'soft'),
      N('Link puts a small, wrinkled apple in her hand.'),
      ZE('This is from Father’s cabin. He never let anyone eat them cold.', 'shock'),
      N('She holds it in both hands, like something warm. Then she laughs, and wipes her eyes with the heel of her hand.'),
      N('She turns back to Link. She looks at him for a long time, as if she’s afraid of the answer.'),
      ZE('Do you… really remember me?'),
      N('Link opens his mouth, for the first time since the pool. The screen goes white before you hear what he says.'),
      PX('Oh, you’re joking. You are JOKING. They cut it there?', 'shock'),
    ],
  },
  {
    id: 'pa5-18-question-oldman-kept',
    lines: [
      N('Zelda walks across the grass to Link. You stand back a little with your Nubbin and the horse.'),
      ZE('Link. You did it. Thank you. I mean it: thank you, for coming back.'),
      ZE('And thank you, both of you. I don’t know you, but I think you’ve been carrying him a little.', 'soft'),
      Y('Your father cooked for me once. He said everything is better roasted, apart from fingers.'),
      ZE('Father? Cooked? He once sent back a soup for being too round.', 'shock'),
      Y('He said he was hard on you. He’s sorry.'),
      N('Zelda looks at the castle for a long moment. Then she laughs, and wipes her eyes with the heel of her hand.'),
      N('She turns back to Link. She looks at him for a long time, as if she’s afraid of the answer.'),
      ZE('Do you… really remember me?'),
      N('Link opens his mouth, for the first time since the pool. The screen goes white before you hear what he says.'),
      PX('Oh, you’re joking. You are JOKING. They cut it there?', 'shock'),
    ],
  },

  // ---------------------------------------------------------------- PA5-18 complete (pa5-hunt = hunt)
  {
    id: 'pa5-18-complete-hunt',
    lines: [
      N('The credits roll over the field, the castle and the sky. Then, after the credits, there is a little more.'),
      N('A field outside the castle, in spring. Zelda and Link are there in plain clothes, with two horses.'),
      ZE('I can’t feel it any more. The power. It went when the Calamity went. The Beasts have gone quiet too.'),
      N('She doesn’t sound sad about it. She sounds like someone who has put down something very heavy.'),
      ZE('I spent my whole life trying to wake it. And now it’s gone, and I’m still here.'),
      ZE('I’ll have to be useful with machines instead. Father would hate that.', 'happy'),
      ZE('I think I can accept that.', 'soft'),
      N('They get on their horses and ride out across the field, to start mending. Your Nubbin trots behind them.'),
      N('The shed comes back around you: sawdust, the heater, Pixel on her stool, very quiet.'),
      PX('Every memory. That’s what it was for. That’s the whole ending. I’m not crying. The heater’s too high.', 'soft'),
    ],
    choices: [
      {
        id: 'look',
        label: 'Look through the whole album.',
        set: { 'pa5-18-after': 'look-back' },
        then: [
          N('Pixel scrolls the slate’s album on the cabinet screen, one photograph at a time, with great ceremony.'),
          PX('The frog. The test shot. Purah made it her lock screen.'),
          PX('Six frogs in a jar. The control group. Peer review.'),
          PX('The blue flowers. She forgot to be cross with him for one whole frame.'),
          PX('The cold spring. He held the blanket. That’s the whole picture, and it’s enough.', 'soft'),
          PX('Mipha, fixing his hand. Gently. Pointedly gently.'),
          PX('Daruk, and a rock that was apparently delicious.'),
          PX('Revali, being rude upwards.'),
          PX('Urbosa, and the king in the fountain. I’ve zoomed in on the crown. Twice.', 'happy'),
          PX('The bridge. She told him to stop following her. He didn’t. Good.'),
          PX('The tree in the rain. Two people being quiet at each other. Ten out of ten.'),
          PX('The knighting. Daruk, losing a fight with his own grin.'),
          PX('The sword in the stone. She parked it there herself. Very organised.'),
          PX('The fountain, and her dad. We don’t scroll fast past that one. But we do scroll.', 'soft'),
          PX('And the plain. Thirteen. I’ll just leave the album open on that one.', 'soft'),
        ],
      },
      {
        id: 'leave',
        label: 'Let it end there.',
        set: { 'pa5-18-after': 'leave-room' },
        then: [PX('Fair. Best ending in the cartridge. Still the heater, by the way.')],
      },
    ],
  },
];

// =================================================================== FLAGS AND CHECKS

export const ARCADE_PA5_FLAGS: string[] = [
  'pa5-01',
  'pa5-02',
  'pa5-03',
  'pa5-04',
  'pa5-05',
  'pa5-06',
  'pa5-07',
  'pa5-08',
  'pa5-09',
  'pa5-10',
  'pa5-11',
  'pa5-12',
  'pa5-13',
  'pa5-14',
  'pa5-15',
  'pa5-16',
  'pa5-17',
  'pa5-18',
  'pa5-done', // PA5-18: the whole cartridge; High Score Night reads the Arcade save
  'pa5-oldman', // ate | left (pa5-03-cold): pa5-14-complete-ate
  'pa5-memories', // photohunt | photoroad (pa5-05-photos): THE SIGNATURE CHOICE; the -photohunt memories
  'pa5-hunt', // hunt (pa5-13-sword-done-photohunt): pa5-15-*-hunt and pa5-18-complete-hunt
  'pa5-thirteenth', // true (pa5-15-complete-hunt): the thirteenth photograph, for the journal
  'pa5-14-told', // oldman-told | oldman-kept (pa5-14-complete-ate): pa5-18-question-oldman-*
  'pa5-jumper', // lent-jumper (pa5-02-pool): pa5-18-seal-done-lent-jumper
  'pa5-17-hold', // steady | gentle (pa5-17-horse): read by nothing
  'pa5-18-after', // look-back | leave-room (pa5-18-complete): read by nothing
];

export const ARCADE_PA5_CHECKS: string[] = [
  'visit:pa5-cabinet:lantern-shed',
  'inspect:pa5-cave:stone-bed',
  'watch:pa5-link:pool',
  'walk:pa5-link:cliff-edge',
  'talk:pa5-oldman:campfire',
  'climb:pa5-tower:plateau',
  'choose:pa5-oldman:supper',
  'climb:pa5-temple:roof',
  'minigame:clear:pa5-glide-plateau',
  'talk:pa5-paya:impa-house',
  'talk:pa5-impa:kakariko',
  'inspect:pa5-photos:twelve',
  'visit:pa5-lab:hateno',
  'photo:pa5-purah:lab',
  'talk:pa5-hestu:road',
  'collect:pa5-korok-seeds:12',
  'give:pa5-seeds:hestu',
  'talk:pa5-sidon:river',
  'watch:pa5-memory:mipha',
  'puzzle:pa5-ruta:terminals',
  'escort:pa5-yunobo:crater',
  'puzzle:pa5-rudania:terminals',
  'sit:pa5-kass:village-square',
  'minigame:clear:pa5-flight-range',
  'puzzle:pa5-medoh:terminals',
  'escort:pa5-buliara:gerudo-town',
  'place:pa5-bananas:yiga-hideout',
  'puzzle:pa5-naboris:terminals',
  'find:pa5-photo:shelter',
  'sit:pa5-memory:shelter-edge',
  'walk:pa5-torches:lost-woods',
  'talk:pa5-deku:korok-forest',
  'watch:pa5-memory:sword',
  'explore:pa5-castle-town:courtyard',
  'watch:pa5-memory:father',
  'talk:pa5-impa:kakariko-return',
  'walk:pa5-blatchery:plain',
  'watch:pa5-beasts:castle',
  'climb:pa5-castle:sanctum',
  'wait:pa5-sanctum:door',
  'watch:pa5-beast:field',
  'minigame:clear:pa5-hold-horse',
  'watch:pa5-zelda:seal',
  'wait:pa5-field:credits',
];
