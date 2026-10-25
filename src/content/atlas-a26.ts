/**
 * Atlas campaign, page A26: The Wall of Uruk (Part M, rank 29). Eighteen quests, A26-1 to A26-18.
 *
 * SOURCE. The Epic of Gilgamesh, the Standard Babylonian version (the eleven tablets attributed to
 * Sin-leqi-unninni), with the Old Babylonian tablets where they fill gaps. Mesopotamia, now Iraq. No
 * rights holder: the epic belongs to Iraq and to everyone. Not any later novel, film or retelling.
 * The one translation quoted is R. Campbell Thompson’s verse rendering, The Epic of Gilgamish (1928);
 * see LIFTED TEXT for its copyright caveat.
 *
 * AUDIENCE. 'all'. The fights are staged gently and offscreen (see CARE NOTES); every lifted line
 * has a `childLines` entry. If Maor wants Humbaba and the Bull played straight, rate it 'teen'.
 *
 * FRAME. Nova’s atlas falls open at a great brick wall in the sun, with date palms and a river. You
 * step in with your Nubbin. An old brickmaker (our own) walks you along the wall and shows you the
 * tablet box, and the story takes you in. You are a stranger in Uruk who becomes the two friends’
 * water-carrier: you fetch water, carry cups, pack bread, keep the fire and the watch, and sit with
 * Enkidu at the end. Gilgamesh and Enkidu keep their story; you never fight. Your Nubbin runs with
 * the gazelles in A26-3 and has to be coaxed back to people in A26-4, like Enkidu. Nubbins never
 * speak, and nothing in this world is a talking animal. Gods appear as the epic shows them, and
 * Shamash speaks only as a voice out of the sun.
 *
 * MOSS. He comes with you, riding on your shoulder, only if all of these hold when a quest begins:
 * the campaign is past chapter 4 (c4-out seen, so he has come down), mossFaded is false, and the
 * ending is not moss-sleeps. Otherwise the scenes as written play: your Nubbin takes his beats and
 * sits where he would have sat. With Moss, play these A26_VARIANTS in place of the named scene:
 *   a26-01-page-moss (for a26-01-page), a26-03-herd-done-moss (a26-03-herd-done),
 *   a26-14-death-done-moss (a26-14-death-done), a26-16-siduri-done-moss (a26-16-siduri-done),
 *   a26-18-complete-moss or, with a26-humbaba = spoke, a26-18-complete-moss-spoke (a26-18-complete).
 *
 * GROVE FLAGS READ (read-only; the Atlas never writes a Grove flag):
 *   - The campaign chapter, mossFaded and the ending id (CampaignState.ending): for Moss, as above,
 *     and for the Grove keepsake scene (a26-grove-brick, or a26-grove-brick-flower if Moss has faded
 *     or the ending is moss-sleeps).
 *   - s24Done (S24: the atlas was Hazel’s). With it, a26-17-snake-done-hazel replaces
 *     a26-17-snake-done: Hazel’s margin note beside the snake.
 *
 * FLAGS WRITTEN (Atlas save only, all prefixed a26-):
 *   - a26-01 … a26-18: each quest on completion. a26-done: the whole page (A26-18).
 *   - a26-humbaba = spoke | silent | agreed (A26-10, a26-10-plea). The signature choice. The scenes as
 *     written are the silent path; spoke and agreed play their variants in A26-13
 *     (a26-13-dream-done-*), A26-14 (a26-14-sickbed-done-*) and A26-18 (a26-18-foot-*, and Moss’s
 *     extra line in a26-18-complete-moss-spoke).
 *
 * LIFTED TEXT. R. Campbell Thompson, The Epic of Gilgamish (London: Luzac, 1928), verse translation,
 * as Part M took it from the sacred-texts copy. Exactly the eight passages the outline lists, each
 * used once, each with a `childLines` entry; Part M lists all eight without an [unverified] mark.
 * On screen “Gilgamish” is Gilgamesh and “Erech” is Uruk.
 * Verse lines the outline joins with “/” are set as two consecutive lines of the same speaker.
 *   1. Tablet I, Enkidu: a26-03-herd#3 and #4.
 *   2. Tablet I, the prologue, a fragment: a26-01-tablet#4.
 *   3. Tablet X, Gilgamesh remembering: a26-14-death#9 (brackets dropped, words kept, as the outline says).
 *   4. Tablet X, Siduri: a26-16-siduri#6 (the bracketed words dropped, as the outline says).
 *   5. Tablet X, Siduri: a26-16-siduri#8.
 *   6. Tablet X, Uta-Napishtim: a26-17-tale#3 (brackets dropped, words kept).
 *   7. Tablet XI, the plant, a fragment: a26-17-plant-done#1.
 *   8. Tablet XI, Gilgamesh to Ur-Shanabi: a26-18-wall#7 and #8.
 * COPYRIGHT CAVEAT (from the outline): Thompson died in 1941. The 1928 text is public domain in the UK
 * and EU (life plus 70) and in the US (1928 works entered the public domain on 1 January 2024), but may
 * still be in copyright where terms are longer (Mexico, life plus 100, to the end of 2041). Get a legal
 * check. If needed, swap these lines for Jastrow and Clay’s Old Babylonian Version (1920, Project
 * Gutenberg #11000) for the early tablets, or for our own words: the childLines already are.
 *
 * CARE NOTES.
 *   - Iraq’s heritage. No war imagery and no modern politics. Tablets are never treasure to take: the
 *     brickmaker puts the tablet back in its box (A26-1) and says plainly that many were taken from
 *     their places in living memory, and some have come home (A26-18). Commission an Iraqi adviser and
 *     an Assyriologist before ship.
 *   - Sex. Shamhat’s week with Enkidu is cut: she is a teacher of the temple who sits with him at the
 *     water hole until he understands her speech, and is always treated with respect. Gilgamesh’s claim
 *     on brides is cut: in A26-2 he gives the city no rest with games and building, and in A26-7 the door
 *     is simply the one he means to go through. Ishtar’s lovers are one plain list, kid-safe ones
 *     only (A26-11).
 *   - Softened for All, and we say so: Humbaba’s death is offscreen (the wind drops and the forest goes
 *     quiet); the Bull of Heaven is brought down in a cloud of dust with no wound and no thrown thigh,
 *     and Enkidu only shouts at Ishtar. Enkidu’s death is gentle and grave, like Fossil’s; the worm at
 *     his nose is cut. The ale in A26-5 is the source’s; nobody is shown drunk, he sings and is glad.
 *   - The flood is Uta-Napishtim’s own story, told as his. No claims about which flood story came first.
 *   - Lions in A26-5 and A26-15 are driven off or never seen; the lion skins are just skins he wears.
 *   - The third rule (sit down next to them and wait) is acted in A26-4 and A26-14, never quoted.
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

const WHERE = 'Nova’s atlas: the Wall of Uruk page (Atlas campaign)';
const after = (code: string) => `Any time after ${code}, from Nova’s atlas.`;
const EPIC = 'The Epic of Gilgamesh, Standard Babylonian version';
const src = (beat: string) => `${EPIC}: ${beat}`;

// ------------------------------------------------------------------ speakers

const BRICKMAKER = sp('a26-brickmaker', 'Old Brickmaker', 'Our own: a brickmaker of Uruk who walks the wall with you (not in the epic)');
const GILGAMESH = sp('a26-gilgamesh', 'Gilgamesh', `Gilgamesh, king of Uruk, two parts god and one part man (${EPIC})`);
const ENKIDU = sp('a26-enkidu', 'Enkidu', `Enkidu, the wild man made from clay, Gilgamesh’s friend (${EPIC})`);
const NINSUN = sp('a26-ninsun', 'Ninsun', `Ninsun, the wise goddess, Gilgamesh’s mother (${EPIC})`);
const SHAMHAT = sp('a26-shamhat', 'Shamhat', `Shamhat, a woman of Ishtar’s temple in Uruk, who teaches Enkidu (${EPIC})`);
const TRAPPER = sp('a26-trapper', 'Trapper', `The trapper whose snares Enkidu tears up (${EPIC})`);
const SHEPHERD = sp('a26-shepherd', 'Shepherd', `The shepherds who give Enkidu bread (${EPIC})`);
const TOWNSWOMAN = sp('a26-townswoman', 'Woman of Uruk', `The people of Uruk (${EPIC}); this one is our own`);
const ELDER = sp('a26-elder', 'Elder of Uruk', `The elders of Uruk who warn against the Cedar Forest (${EPIC})`);
const HUMBABA = sp('a26-humbaba', 'Humbaba', `Humbaba, guardian of the Cedar Forest, set there by Enlil (${EPIC})`);
const ISHTAR = sp('a26-ishtar', 'Ishtar', `Ishtar, goddess of Uruk (${EPIC})`);
const SHAMASH = sp('a26-shamash', 'Shamash', `Shamash, the sun god, heard as a voice out of the sun (${EPIC})`);
const SCORPION = sp('a26-scorpion', 'Scorpion-man', `The scorpion-man who guards the gate of the mountains of Mashu (${EPIC})`);
const SIDURI = sp('a26-siduri', 'Siduri', `Siduri, the ale-wife by the sea (${EPIC})`);
const URSHANABI = sp('a26-urshanabi', 'Ur-Shanabi', `Ur-Shanabi, Uta-Napishtim’s boatman (${EPIC})`);
const UTA = sp('a26-uta', 'Uta-Napishtim', `Uta-Napishtim, the man the gods let live for ever (${EPIC})`);
const UTAWIFE = sp('a26-utawife', 'Uta-Napishtim’s Wife', `Uta-Napishtim’s wife, who bakes the loaves (${EPIC})`);

const N = say('narrator');
const Y = say('you');
const MO = say('moss');
const BR = say('a26-brickmaker');
const GI = say('a26-gilgamesh');
const EN = say('a26-enkidu');
const NI = say('a26-ninsun');
const SH = say('a26-shamhat');
const TR = say('a26-trapper');
const SP = say('a26-shepherd');
const TW = say('a26-townswoman');
const EL = say('a26-elder');
const HU = say('a26-humbaba');
const IS = say('a26-ishtar');
const SS = say('a26-shamash');
const SC = say('a26-scorpion');
const SI = say('a26-siduri');
const UR = say('a26-urshanabi');
const UT = say('a26-uta');
const UW = say('a26-utawife');

// ------------------------------------------------------------------ shared pieces

/** A26-1: the step into the page, after the opening lines (with or without Moss). */
const A1_STEP_IN: Line[] = [
  N('The bricks are warm under your hand. Then they are warm under your feet, and the sun is very high, and very white.'),
  N('You are standing on top of a wall so wide that two carts could pass on it. Below, a city of flat roofs runs down to a river.'),
  N('An old woman with clay to her elbows sits on a stack of bricks, eating a date. She looks at you without any surprise at all.'),
  BR('New, are you? Everyone’s new once. Come and walk the wall with me. It’s the best way to meet a city.'),
];

/** A26-18: the way home (every path). */
const A18_HOME: Line[] = [
  N('The sun on the bricks gets warmer and yellower, until it is lamplight on a page, and your own table, and the Grove.'),
  N('In your hands there is a brick, still warm from the kiln. Your handprint is in it, and a small round pawprint beside.'),
];

// =================================================================== THE WALL OF URUK

export const ATLAS_A26: Quest[] = [
  // ---------------------------------------------------------------- A26-1
  {
    id: 'a26-01',
    code: 'A26-1',
    title: 'The Wall',
    source: src('Tablet I, the prologue: the wall, the copper tablet box and the lapis tablet'),
    audience: 'all',
    trigger: { where: WHERE, when: 'Any time once Nova’s atlas is in the Grove; the first quest on the page.' },
    speakers: [BRICKMAKER],
    steps: [
      {
        id: 'a26-01-s1',
        goal: 'Step into the page and walk the wall of Uruk.',
        hint: 'Touch the sunlit wall on the page, then follow the old brickmaker along the top.',
        check: 'explore:a26-wall:rampart',
        scene: {
          id: 'a26-01-page',
          lines: [
            N('Nova’s atlas falls open at a page so bright it warms your face. A great brick wall stands in the sun, with date palms and a river.'),
            N('Your Nubbin puts both paws flat on the paper, as if to test whether it is hot. It is, a little.'),
            ...A1_STEP_IN,
            N('She walks you along the top. Below, people are carrying baskets, and nobody looks up, as if a wall were nothing.'),
            BR('A square mile of town, a square mile of orchards, a square mile of clay-pits, and half a mile for the temple. All held in by bricks.'),
            BR('My mother made bricks, and hers did. Some of these are older than anyone’s grandmother.'),
          ],
          choices: [
            {
              id: 'bricks',
              label: 'Ask her how you tell a good brick.',
              then: [BR('You knock it. A good one rings. A bad one says “thud” and lets you down when it rains.', 'happy')],
            },
            {
              id: 'king',
              label: 'Ask who built the wall.',
              then: [BR('The king says he did. The king says a lot of things. Come down and I’ll show you something better.', 'think')],
            },
          ],
        },
        done: {
          id: 'a26-01-page-done',
          lines: [
            N('Your Nubbin knocks on the parapet with one paw, and listens. It seems satisfied.'),
            BR('That’s the way. Now, down the stairs. Mind the third one. It’s been mended since my grandmother’s day.'),
          ],
        },
      },
      {
        id: 'a26-01-s2',
        goal: 'Find the copper tablet box at the foot of the wall and read the lapis tablet.',
        hint: 'The box is set into the wall’s foundation, by the stair. The brickmaker will show you.',
        check: 'find:a26-tablet-box:foundation',
        scene: {
          id: 'a26-01-tablet',
          lines: [
            N('At the foot of the stair, set into the oldest bricks, there is a box of copper, green with years. Its lock is a bronze bolt.'),
            BR('Slide the bolt. Go on. It’s meant to be opened. That’s the whole point of it.'),
            N('Inside lies a tablet of blue stone, lapis lazuli, flecked with gold like a night sky. Little wedge-shaped marks run across it.'),
            N('You can’t read them. Then, the longer you look, you can.'),
            BR('“Of Uruk, the high-wall’d,” it starts. That’s us. Then it’s all about a king who saw everything, and what it cost him.'),
            BR('It’s his story. He had it written down and put here, so anyone at all could open the box and read it.'),
            N('The marks on the tablet begin to move like ants in a line. The air smells of hot dust and river water.'),
          ],
          choices: [
            {
              id: 'read',
              label: 'Read on.',
              then: [N('You read on. The wedges become words, and the words become a street, and you are standing in it.')],
            },
            {
              id: 'nubbin',
              label: 'Let your Nubbin turn the tablet over.',
              then: [N('Your Nubbin turns the tablet over with great care. On the back, the story keeps going, and so do you.')],
            },
          ],
        },
        done: {
          id: 'a26-01-tablet-done',
          lines: [
            N('When you look up, the brickmaker has put the tablet back in its box and slid the bolt home.'),
            BR('It stays here. That’s what it’s for. Go on, then. I’ll be on the wall when you’re done.'),
          ],
        },
      },
    ],
    complete: {
      id: 'a26-01-complete',
      lines: [
        N('The street is full of people, all of them tired. Somewhere above them, a drum is beating, and it doesn’t stop.'),
        N('Your Nubbin takes hold of your trouser leg. You are in the story now, a stranger in Uruk, and the king is awake.'),
      ],
    },
    rewards: [],
    sets: { 'a26-01': true },
    childLines: {
      'a26-01-tablet#4': 'It starts with our city, the one with the great high wall. Then it’s all about a king who saw everything, and what it cost him.',
    },
    notes:
      'Opening page. The atlas page art is a sunlit wall of mud-brick and kiln-fired brick, date palms and the river. MOSS: if he ' +
      'comes (see the header), play A26_VARIANTS a26-01-page-moss in place of a26-01-page; it keeps the same choices. The tablet ' +
      'box is copper with a bronze bolt and the tablet is lapis, as the prologue says. The cuneiform on it is decorative wedges, ' +
      'not real text. The tablet is never taken: the brickmaker puts it back (care note). Lifted line 2 (a fragment) at ' +
      'a26-01-tablet#4.',
  },

  // ---------------------------------------------------------------- A26-2
  {
    id: 'a26-02',
    code: 'A26-2',
    title: 'The King Who Never Rests',
    source: src('Tablet I: Gilgamesh gives his city no rest; the people cry out; Aruru makes Enkidu'),
    audience: 'all',
    trigger: { where: WHERE, when: after('A26-1') },
    requires: ['A26-1'],
    speakers: [GILGAMESH, TOWNSWOMAN],
    steps: [
      {
        id: 'a26-02-s1',
        goal: 'Watch the king’s games in the square.',
        hint: 'Follow the drum to the great square, and find a place by the well.',
        check: 'watch:a26-games:square',
        scene: {
          id: 'a26-02-games',
          lines: [
            N('In the great square, young men are running races, and carrying stones, and running races again. Nobody looks as if they want to.'),
            N('In the middle, taller than anyone, stands a man with a curled black beard and arms like roof beams.'),
            GI('Again! Faster! Who’s tired? Nobody’s tired. Uruk doesn’t get tired!', 'happy'),
            N('That is Gilgamesh, king of Uruk. Two parts of him are god, and one part is man, and you can’t tell which part is talking.'),
            TW('He’s been at it since the new moon. Games all day, building all night. Nobody may go home.', 'sad'),
            TW('My son hasn’t slept in his own bed for a month. The king means no harm. He just never stops.'),
            N('A boy in the race stumbles and sits down in the dust. He doesn’t get up.'),
          ],
          choices: [
            {
              id: 'water',
              label: 'Take the boy some water from the well.',
              then: [N('You draw a bucket and carry the boy a cup. He drinks it all, and looks at you as if you had brought him the sea.')],
            },
            {
              id: 'sit',
              label: 'Sit down in the dust beside him.',
              then: [N('You sit down beside him. After a moment your Nubbin sits too, and so, quietly, does the boy’s mother.')],
            },
          ],
        },
        done: {
          id: 'a26-02-games-done',
          lines: [
            N('The king sees none of it. He has already started another race.'),
            TW('Thank you. It’s the first kind thing anyone’s done in this square since the new moon.', 'soft'),
          ],
        },
      },
      {
        id: 'a26-02-s2',
        goal: 'Go up to the temple with the people of Uruk.',
        hint: 'At dusk the crowd climbs the temple steps. Go with the woman from the square.',
        check: 'watch:a26-clay:temple',
        scene: {
          id: 'a26-02-clay',
          lines: [
            N('At dusk the people climb the temple steps with lamps. They don’t shout; they are too tired to shout.'),
            TW('Gods of the city, he’s too strong for us. Give him someone his own size. Someone to wear him out.', 'sad'),
            N('The lamps flicker, though there is no wind. And for a moment, high over the temple, you see something no one else seems to.'),
            N('A great woman, made of starlight, washes her hands in the evening sky. She pinches off a little clay and rolls it between her palms.'),
            N('That is the goddess Aruru, who made people in the first place. She drops the clay, gently, far away in the wild.'),
            N('Your Nubbin watches it fall all the way, with its mouth open.'),
          ],
          choices: [
            {
              id: 'tell',
              label: 'Tell the woman what you saw.',
              then: [TW('Clay? In the wild? Well. I asked for help. I didn’t say what shape.', 'think')],
            },
            {
              id: 'keep',
              label: 'Keep it to yourself for now.',
              then: [N('You keep it to yourself. The woman pats your arm, as if you had prayed hardest of anyone.')],
            },
          ],
        },
        done: {
          id: 'a26-02-clay-done',
          lines: [N('Far off, beyond the river and the fields, something new opens its eyes in the long grass.')],
        },
      },
    ],
    complete: {
      id: 'a26-02-complete',
      lines: [
        N('Down in the square, the drum keeps going. Gilgamesh is still awake, still building, still certain nothing can stop him.'),
        N('Your Nubbin has turned to face the wild, where the clay fell. Its ears are up.'),
      ],
    },
    rewards: [],
    sets: { 'a26-02': true },
    notes:
      'CARE: the king’s oppression is games and building only; his claim on brides is cut (header). Aruru is seen only by you and ' +
      'your Nubbin, drawn as a figure of light in the evening sky, never a statue or a cult image. The temple is Uruk’s, shown with ' +
      'respect; you stand at the back of the crowd and no reward hangs on the prayer.',
  },

  // ---------------------------------------------------------------- A26-3
  {
    id: 'a26-03',
    code: 'A26-3',
    title: 'The Wild Man',
    source: src('Tablet I: Enkidu with the gazelles at the water hole; the trapper'),
    audience: 'all',
    trigger: { where: WHERE, when: after('A26-2') },
    requires: ['A26-2'],
    speakers: [ENKIDU, TRAPPER],
    steps: [
      {
        id: 'a26-03-s1',
        goal: 'Go out to the water hole on the steppe.',
        hint: 'Leave Uruk by the river gate and follow the gazelle tracks to the water.',
        check: 'walk:a26-steppe:water-hole',
        scene: {
          id: 'a26-03-herd',
          lines: [
            N('Three days out from the wall, the fields give way to steppe: dry grass, thorn trees, and a sky that goes on for ever.'),
            N('At the water hole there are gazelles, drinking with their knees bent. In among them, on all fours, drinks a man.'),
            N('He is hairy all over, like a goat, and his hair is long as a woman’s. He has never worn a stitch.'),
            N('E’en with gazelles did he pasture on herbage, along with the cattle'),
            N('Drank he his fill, with the beasts did his heart delight at the water.'),
            N('That is Enkidu. He doesn’t know he has a name yet.'),
            N('Your Nubbin trots straight past you, down to the water, and drinks beside the smallest gazelle.'),
            EN('Hhh?', 'think'),
            N('Enkidu lifts his dripping face and looks at your Nubbin. Then he goes back to drinking, as if it had always been there.'),
          ],
          choices: [
            {
              id: 'let',
              label: 'Let your Nubbin stay with the herd.',
              then: [N('You let it stay. It lies down in the cool mud with the gazelles, more content than you have ever seen it.')],
            },
            {
              id: 'call',
              label: 'Call your Nubbin back.',
              then: [N('You call. Your Nubbin looks at you, and flicks an ear, and stays exactly where it is.')],
            },
          ],
        },
        done: {
          id: 'a26-03-herd-done',
          lines: [
            N('You sit under a thorn tree and watch them. Your Nubbin is in the middle of the herd, nose to nose with a fawn.'),
            N('Enkidu grooms a gazelle’s ear with great care. There is nothing wild about the way he does it.'),
          ],
        },
      },
      {
        id: 'a26-03-s2',
        goal: 'Find out who set the pits and snares, and what happened to them.',
        hint: 'Walk the edge of the steppe and look for filled-in pits and torn snares.',
        check: 'inspect:a26-pits:steppe',
        scene: {
          id: 'a26-03-pits',
          lines: [
            N('At the edge of the steppe there are pits dug to catch game. Every one of them has been filled in, with care, by hand.'),
            N('The snares have been torn up and laid in a tidy pile. Somebody has been very busy on the herd’s behalf.'),
            N('A man with a net over his shoulder comes over the rise. He stops dead at the pits, and goes pale.'),
            TR('Again! Every pit, every snare. Three days I worked on those.', 'angry'),
            TR('It’s a man. A wild man, strong as a star from heaven. I saw him. He runs with them. He sets them free.', 'shock'),
            TR('I can’t feed my family on empty nets. I’m going home to my father. He’ll know what to do.'),
          ],
          choices: [
            {
              id: 'sorry',
              label: 'Tell him you’re sorry about his work.',
              then: [TR('So am I. And I’m sorry I’m frightened of him. I don’t think he means harm. He just doesn’t know about nets.', 'sad')],
            },
            {
              id: 'herd',
              label: 'Say the herd seemed happy, at least.',
              then: [TR('Happy! The gazelles are happy. I’m the one with the empty pot.', 'angry'), N('Then he laughs, once, despite himself.')],
            },
          ],
        },
        done: {
          id: 'a26-03-pits-done',
          lines: [N('He runs off towards the river, net flapping. Behind you, at the water, the wild man is filling in another pit.')],
        },
      },
    ],
    complete: {
      id: 'a26-03-complete',
      lines: [
        N('By evening the trapper is far away on the road to his father, and then on the road to Uruk.'),
        N('Your Nubbin is still with the herd. It doesn’t look round when you say its name.'),
      ],
    },
    rewards: [],
    sets: { 'a26-03': true },
    childLines: {
      'a26-03-herd#3': 'He ate the grass with the gazelles, and he was happy among them.',
      'a26-03-herd#4': 'He drank with the animals at the water, and his heart was glad.',
    },
    notes:
      'Lifted line 1 (two verse lines, Thompson Tablet I) at a26-03-herd#3 and #4, narration. Your Nubbin joins the gazelles here and ' +
      'stays with them until A26-4 step 3: draw it in the herd through A26-4. MOSS: if he comes, play A26_VARIANTS ' +
      'a26-03-herd-done-moss in place of a26-03-herd-done (his line, from the outline). Enkidu is drawn hairy and unclothed but ' +
      'never shown below the shoulders except behind grass and gazelles; no nudity is drawn.',
  },

  // ---------------------------------------------------------------- A26-4
  {
    id: 'a26-04',
    code: 'A26-4',
    title: 'Shamhat',
    source: src('Tablet I and the Old Babylonian Pennsylvania tablet: Shamhat teaches Enkidu; the gazelles run'),
    audience: 'all',
    trigger: { where: WHERE, when: after('A26-3') },
    requires: ['A26-3'],
    speakers: [TRAPPER, SHAMHAT, ENKIDU],
    steps: [
      {
        id: 'a26-04-s1',
        goal: 'Walk Shamhat out to the water hole with the trapper.',
        hint: 'Meet the trapper at Uruk’s river gate and carry Shamhat’s bundle.',
        check: 'escort:a26-shamhat:water-hole',
        scene: {
          id: 'a26-04-road',
          lines: [
            N('The trapper comes back from Uruk with a woman from the temple of Ishtar. She walks quickly, and carries her own bundle until you take it.'),
            SH('I’m Shamhat. The king sent me. He says the wild man needs someone to talk to. I think he’s right, for once.'),
            TR('He doesn’t talk. He grunts. He drinks out of the pond on his knees.'),
            SH('So did you, once. Somebody sat with you until you didn’t.', 'soft'),
            N('The bundle smells of bread and sweet oil. There is a clean robe in it, folded small.'),
            SH('Most people want to tame him. I don’t. I want to be the first person he understands.'),
          ],
          choices: [
            {
              id: 'how',
              label: 'Ask her how she’ll do it.',
              then: [SH('Patience. I’ll sit where he can see me, and talk, and not need anything. Then one day he’ll answer.', 'think')],
            },
            {
              id: 'nubbin',
              label: 'Tell her your Nubbin ran off with the herd.',
              then: [SH('Then we have the same job, you and I. Let’s see who finishes first.', 'happy')],
            },
          ],
        },
      },
      {
        id: 'a26-04-s2',
        goal: 'Sit at the water hole with Shamhat until Enkidu understands her.',
        hint: 'Sit by the water. Don’t chase. It takes days.',
        check: 'sit:a26-water-hole:days',
        scene: {
          id: 'a26-04-sit',
          lines: [
            N('Shamhat sits on a flat rock by the water hole, and you sit a little way off. The trapper hides in a bush and is no help.'),
            N('The first day, Enkidu watches her from behind a gazelle. The second day, he comes and sniffs her bundle.'),
            SH('That’s bread. You don’t know bread yet. You will. This is my hand. That’s yours.'),
            N('By the fourth day he sits across the rock from her, the way your Nubbin sits across from you on the hill at home.'),
            N('She talks about the city, and the river, and the man who never sleeps. Enkidu listens with his whole face.'),
            EN('Hand.', 'think'),
            N('Shamhat goes very still. Then she smiles as if the sun had come up twice.'),
            SH('Hand. Yes. And what do you call yourself?'),
            EN('…Enkidu.'),
          ],
        },
        done: {
          id: 'a26-04-sit-done',
          lines: [
            N('He says it again, louder, as if trying the word for size. Then he laughs, a big surprised human laugh.'),
            SH('There you are. I knew there was someone in there.', 'happy'),
            N('The bush behind you rustles. A thumb comes up through the leaves.'),
            TR('Is this the bit where I come out?', 'think'),
            SH('No.'),
          ],
        },
      },
      {
        id: 'a26-04-s3',
        goal: 'Coax your Nubbin back from the herd.',
        hint: 'The gazelles are skittish now. Go slowly, and let your Nubbin come to you.',
        check: 'find:a26-nubbin:herd',
        scene: {
          id: 'a26-04-coax',
          lines: [
            N('Enkidu walks back down to the gazelles, the way he has every evening of his life.'),
            N('They lift their heads, and look at him, and run, every one. They don’t know him any more.'),
            EN('Wait! It’s me!', 'sad'),
            N('He tries to run after them, and can’t keep up: his legs are a man’s now. He stands in the dust and watches them go.'),
            N('Your Nubbin has been left behind by the herd, too. It sits alone in the grass, looking after them.'),
            SH('Go to yours. I’ll go to mine.', 'soft'),
          ],
          choices: [
            {
              id: 'call',
              label: 'Call its name.',
              then: [N('You call its name. It hears you, and thinks about it for a long moment, and then it comes, slowly, then all at once.')],
            },
            {
              id: 'wait',
              label: 'Sit down in the grass and wait.',
              then: [
                N('You sit down in the grass and wait. The sun goes down a finger’s width.'),
                N('Then there is a weight against your side, warm and a bit muddy, as if it had been there all along.'),
              ],
            },
            {
              id: 'date',
              label: 'Hold out a date from Shamhat’s bundle.',
              then: [N('You hold out a date. Your Nubbin comes for the date, and stays for you, and gets very sticky.')],
            },
          ],
        },
        done: {
          id: 'a26-04-coax-done',
          lines: [
            N('Across the water, Enkidu is sitting with his head in his hands, and Shamhat is sitting beside him, saying nothing.'),
            N('After a while he leans against her shoulder, the way your Nubbin leans against yours.'),
          ],
        },
      },
    ],
    complete: {
      id: 'a26-04-complete',
      lines: [
        SH('You’re not less, you know. You’re more. You lost the herd and found the whole world. Come and see it.'),
        EN('Will it run away from me too?', 'sad'),
        SH('Some of it. Not the best of it.'),
        N('She gives him half of her robe to wear, and takes his hand, and leads him away like a child towards the shepherds’ camp.'),
      ],
    },
    rewards: [],
    sets: { 'a26-04': true },
    notes:
      'CARE: Shamhat is a teacher and is treated with respect (header). Her seven days with Enkidu are cut; on the page she sits with ' +
      'him until he understands her speech. Draw the days passing with the sun and moon over the water hole. The third rule is ' +
      'acted at a26-04-coax (the wait choice) and never quoted. Your Nubbin is back at your side from here on.',
  },

  // ---------------------------------------------------------------- A26-5
  {
    id: 'a26-05',
    code: 'A26-5',
    title: 'Bread and Ale',
    source: src('the Old Babylonian Pennsylvania tablet: the shepherds’ camp; bread and ale; Enkidu guards the flocks'),
    audience: 'all',
    trigger: { where: WHERE, when: after('A26-4') },
    requires: ['A26-4'],
    speakers: [ENKIDU, SHAMHAT, SHEPHERD],
    steps: [
      {
        id: 'a26-05-s1',
        goal: 'Help the shepherds feed Enkidu his first supper.',
        hint: 'Carry the bread and the jugs from the shepherds’ fire to Enkidu.',
        check: 'feed:a26-enkidu:bread',
        scene: {
          id: 'a26-05-bread',
          lines: [
            N('The shepherds’ camp is a ring of tents round a fire, and a lot of sheep with opinions. The shepherds crowd round to look at Enkidu.'),
            SP('He’s as tall as the king. Taller. Look at those arms. Sit down, friend, sit down. You must be hungry.'),
            N('You set a round loaf in front of him, and a jug. Enkidu looks at them as if they might bite.'),
            EN('What is this?', 'think'),
            SH('That’s bread. People eat it. And that’s ale. People drink it. Go on. It’s what we do.'),
            N('He sniffs the bread, and licks it. He takes a very small bite, and his eyebrows go up into his hair.'),
            N('Then he eats until he is full, and drinks seven jugs, and his face shines like a lamp.'),
            N('And then, to everyone’s surprise, including his own, he sings. It has no words, and sounds like the steppe at evening.'),
          ],
          choices: [
            {
              id: 'clap',
              label: 'Clap along.',
              then: [N('You clap along, and so do the shepherds. Your Nubbin hops in time, mostly.')],
            },
            {
              id: 'bread',
              label: 'Break your own loaf with your Nubbin.',
              then: [N('You break your loaf in two. Enkidu watches, and breaks his, and holds out half to the shepherd beside him.')],
            },
          ],
        },
        done: {
          id: 'a26-05-bread-done',
          lines: [
            N('Afterwards the shepherds trim his hair, and he washes in the stream and rubs oil into his skin. Shamhat gives him clothes.'),
            SP('Look at him. He looks like a bridegroom. Or a king.', 'happy'),
            EN('Is that good?'),
            SH('It depends on the king.'),
          ],
        },
      },
      {
        id: 'a26-05-s2',
        goal: 'Keep watch over the flocks with Enkidu at night.',
        hint: 'Take a lamp to the sheepfold and stay up with Enkidu.',
        check: 'watch:a26-flocks:night',
        scene: {
          id: 'a26-05-night',
          lines: [
            N('That night the shepherds sleep, properly, for the first time in a long while. Enkidu keeps watch, and you keep him company.'),
            N('He sits on the fold wall with a big stick across his knees. He doesn’t need a lamp; he sees in the dark like the herd did.'),
            EN('The wolves come from there. The lions from over there. I know them. I used to drink with them.', 'think'),
            N('Something moves out in the dark. A low grey shape slides along the edge of the grass, then another.'),
            N('Enkidu stands up on the wall and says something to them, not in words. The shapes stop, then turn and slip away.'),
            EN('They know me too. They know whose side I’m on now.', 'sad'),
          ],
          choices: [
            {
              id: 'lamp',
              label: 'Hold the lamp up anyway.',
              then: [N('You hold up the lamp. He looks at it, and at you, and smiles.'), EN('That’s for the sheep. So they know someone’s here. Good.')],
            },
            {
              id: 'sit',
              label: 'Sit beside him on the wall.',
              then: [N('You sit beside him on the wall. Your Nubbin climbs into the gap between you, and falls asleep at once.')],
            },
          ],
        },
        done: {
          id: 'a26-05-night-done',
          lines: [N('Every night after that, the shepherds sleep, and no lamb is lost. They start calling him “the watchman”.')],
        },
      },
    ],
    complete: {
      id: 'a26-05-complete',
      lines: [
        N('One morning a traveller passes the camp on his way to Uruk, and grumbles about the king who never rests.'),
        EN('Someone should stand up to him.', 'angry'),
        SH('Someone should. Shall we go to the city, then, you and I?'),
        N('Enkidu looks at the steppe, and at the flocks, and at you. Then he nods.'),
      ],
    },
    rewards: [],
    sets: { 'a26-05': true },
    notes:
      'From the Old Babylonian tablet, where the Standard Babylonian has a gap. CARE: the ale is the source’s, and kept to one ' +
      'line; nobody is shown drunk. His song has no words and is a music cue (a low, wandering tune), never lyrics. Wolves are ' +
      'grey shapes in the dark that turn away; no fight. The traveller’s complaint in the source is about the king’s claim on ' +
      'brides; it is cut to “the king who never rests”.',
  },

  // ---------------------------------------------------------------- A26-6
  {
    id: 'a26-06',
    code: 'A26-6',
    title: 'Ninsun’s Dreams',
    source: src('Tablet I: Gilgamesh’s two dreams, of the star and the axe; Ninsun reads them'),
    audience: 'all',
    trigger: { where: WHERE, when: after('A26-5') },
    requires: ['A26-5'],
    speakers: [GILGAMESH, NINSUN],
    steps: [
      {
        id: 'a26-06-s1',
        goal: 'Carry the cups to Ninsun’s hall in the palace.',
        hint: 'The steward at the palace kitchens needs a cup-bearer. Take the tray to the queen mother’s hall.',
        check: 'carry:a26-cups:ninsun-hall',
        scene: {
          id: 'a26-06-cups',
          lines: [
            N('Back in Uruk, the palace steward is short of hands. He looks at you, and at your Nubbin, and gives you a tray of silver cups.'),
            N('Ninsun’s hall is cool and quiet, with a fountain. The goddess sits by it, wise and grey-eyed and in no hurry about anything.'),
            N('Gilgamesh is pacing in front of her, and for once he isn’t shouting. He looks like a boy who has had a bad night.'),
            GI('Mother. I dreamed again. A star fell out of the sky and landed beside me, like a rock.', 'think'),
            GI('I tried to lift it, and I couldn’t. Me! I couldn’t even shift it. The whole city came out to stare at it.'),
            GI('And I loved it. I don’t know why. I put my arms round it as if it were a person, and carried it to you.'),
            N('You hold out the tray. He takes a cup without looking, and drinks, and forgets to give it back.'),
          ],
          choices: [
            {
              id: 'wait',
              label: 'Wait with the tray until he’s finished.',
              then: [N('You wait. Ninsun catches your eye over his shoulder, and the corner of her mouth goes up.')],
            },
            {
              id: 'ninsun',
              label: 'Offer Ninsun a cup too.',
              then: [NI('Thank you. Somebody in this palace remembers the rest of us drink as well.', 'happy')],
            },
          ],
        },
        done: {
          id: 'a26-06-cups-done',
          lines: [NI('Sit down, my son. You’re wearing a hole in my floor. Tell me the other one too.')],
        },
      },
      {
        id: 'a26-06-s2',
        goal: 'Stay and hear what Ninsun makes of the dreams.',
        hint: 'Stand by the fountain with the tray while Ninsun talks to her son.',
        check: 'talk:a26-ninsun:ninsun-hall',
        scene: {
          id: 'a26-06-meaning',
          lines: [
            GI('There was an axe, lying in the street. A strange one. People were all round it.', 'think'),
            GI('I loved that too. I picked it up and wore it at my side, like part of me.'),
            NI('The star that fell, the axe in the street. They are the same thing, my son. They are a person.'),
            NI('A friend is coming to you. Strong as a star from heaven. He will stand beside you and save you, again and again.'),
            GI('A friend? I’ve got a whole city.'),
            NI('You have a city that is tired of you. That isn’t the same.', 'soft'),
            N('Gilgamesh opens his mouth to argue, and shuts it again. He looks out of the window, towards the steppe.'),
          ],
          choices: [
            {
              id: 'true',
              label: 'Tell him you think she’s right.',
              then: [GI('Do you? You’ve been in my city a week. Hm. You’ve probably seen more of it than I have.', 'think')],
            },
            {
              id: 'quiet',
              label: 'Say nothing, and refill his cup.',
              then: [N('You refill his cup. He looks at it, then at you, as if he had just noticed someone was holding the tray.')],
            },
          ],
        },
      },
    ],
    complete: {
      id: 'a26-06-complete',
      lines: [
        GI('Who are you, anyway? Whose are you?'),
        Y('Nobody’s. I’m new here.'),
        GI('Well, stay new. Carry my cups. There aren’t many people who stand still long enough to hear my dreams.'),
        N('That night, for the first time since the new moon, the drum in the square stops before midnight.'),
      ],
    },
    rewards: [],
    sets: { 'a26-06': true },
    notes:
      'In the epic, Shamhat tells Enkidu about these dreams; here you hear them in Ninsun’s hall itself. This is where you become ' +
      'the king’s cup-bearer and water-carrier, the role you keep for the rest of the page.',
  },

  // ---------------------------------------------------------------- A26-7
  {
    id: 'a26-07',
    code: 'A26-7',
    title: 'The Door',
    source: src('Tablet II: Enkidu comes to Uruk; the wrestling at the door; friendship; Ninsun adopts Enkidu'),
    audience: 'all',
    trigger: { where: WHERE, when: after('A26-6') },
    requires: ['A26-6'],
    speakers: [ENKIDU, GILGAMESH, SHAMHAT, TOWNSWOMAN, NINSUN],
    steps: [
      {
        id: 'a26-07-s1',
        goal: 'Meet Enkidu and Shamhat at the gate and bring them into the city.',
        hint: 'They are coming up the river road. Wait at the great gate.',
        check: 'escort:a26-enkidu:uruk-gate',
        scene: {
          id: 'a26-07-gate',
          lines: [
            N('Enkidu comes up the river road in his borrowed clothes, with Shamhat beside him. People leave their work to stare.'),
            TW('Look at him! He’s the king’s size exactly. He’s like the king’s own shadow, only hairier.'),
            TW('He was raised on milk from the wild. They say he can wrestle a lion.'),
            N('Enkidu sees you by the gate. His face breaks into a grin.'),
            EN('The water-carrier! With the little one that ran with my gazelles.', 'happy'),
            N('Your Nubbin, embarrassed, hides behind your leg.'),
            SH('He wants to meet your king. I’ve told him what to expect. He doesn’t believe me.'),
          ],
          choices: [
            {
              id: 'warn',
              label: 'Warn him the king is very strong.',
              then: [EN('Good. So am I. Somebody should tell him so.', 'happy')],
            },
            {
              id: 'gentle',
              label: 'Tell him the king is lonely.',
              then: [EN('Lonely?', 'think'), N('He thinks about that for a long time. He knows the word from the steppe, when the herd ran.')],
            },
          ],
        },
        done: {
          id: 'a26-07-gate-done',
          lines: [N('The crowd follows you through the streets, getting bigger, all the way to the great square.')],
        },
      },
      {
        id: 'a26-07-s2',
        goal: 'Watch the two of them meet at the door.',
        hint: 'Stand back in the crowd. Keep your Nubbin out of the way.',
        check: 'watch:a26-wrestle:door',
        scene: {
          id: 'a26-07-door',
          lines: [
            N('Gilgamesh comes striding across the square towards a great door. Enkidu steps into the doorway and plants his feet.'),
            GI('Out of my way.'),
            EN('No.'),
            N('Gilgamesh stops. Nobody has said that word to him in his whole life, and he doesn’t seem to know what to do with it.'),
            N('Then they grab each other like two bulls, and wrestle in the street.'),
            N('The doorposts shake and the wall trembles. Dust drifts down from the roofs, and the crowd scatters back.'),
            N('They wrestle up the street and down it, and neither will give way, and neither will let go.'),
            N('At last Gilgamesh’s knee touches the ground, and everyone gasps. It has never touched the ground before.'),
          ],
          choices: [
            {
              id: 'hold',
              label: 'Hold your Nubbin back from the fight.',
              then: [N('You scoop up your Nubbin before it can join in. It wriggles in your arms, cheering on both sides at once.')],
            },
            {
              id: 'cover',
              label: 'Pull the woman from the square out of the dust.',
              then: [N('You pull her back under an awning. She coughs, and grips your arm, and doesn’t take her eyes off the door.')],
            },
          ],
        },
        done: {
          id: 'a26-07-door-done',
          lines: [
            N('Gilgamesh kneels in the dust, breathing hard, with Enkidu over him. For a moment the whole square holds its breath.'),
            N('Then Gilgamesh starts to laugh, and Enkidu laughs too. He holds out a hand, and the king takes it.'),
          ],
        },
      },
    ],
    complete: {
      id: 'a26-07-complete',
      lines: [
        GI('Where have you been all my life?', 'happy'),
        EN('Eating grass, mostly.'),
        N('That evening Ninsun takes Enkidu’s face in her hands and looks at it for a long time.'),
        NI('You were the star. You were the axe. From today you are my son, and his brother.', 'soft'),
        N('Enkidu, who has never had a mother, doesn’t know where to put his hands. Your Nubbin shows him by climbing into her lap.'),
      ],
    },
    rewards: [],
    sets: { 'a26-07': true },
    notes:
      'CARE: in the source the door is a bride’s house and Gilgamesh is going in to claim her; that is cut. The door is just the ' +
      'one he means to go through. The wrestle is shown as two big figures in a dust cloud with the doorposts shaking; no blows ' +
      'land, nobody is hurt, and it ends in laughter.',
  },

  // ---------------------------------------------------------------- A26-8
  {
    id: 'a26-08',
    code: 'A26-8',
    title: 'The Cedar Forest',
    source: src('Tablets II and III: the plan to kill Humbaba; Enkidu’s fear; the elders; Ninsun prays to Shamash; the axes'),
    audience: 'all',
    trigger: { where: WHERE, when: after('A26-7') },
    requires: ['A26-7'],
    speakers: [GILGAMESH, ENKIDU, ELDER, NINSUN],
    steps: [
      {
        id: 'a26-08-s1',
        goal: 'Bring water to the friends on the palace roof.',
        hint: 'Fill the jar at the palace well and climb to the roof.',
        check: 'carry:a26-water:palace-roof',
        scene: {
          id: 'a26-08-plan',
          lines: [
            N('You carry a water jar up to the palace roof. The two friends are lying on their backs, looking at the sky.'),
            GI('Enkidu. Nobody lives for ever. Only the gods. Men’s days are numbered, and whatever we do is wind.'),
            GI('So let’s do something they’ll remember. The Cedar Forest. Humbaba, who guards it. Let’s go and kill him.', 'happy'),
            N('Enkidu sits up so fast he knocks the jar. You catch it.'),
            EN('I know that forest. I ran in its edges, when I was wild. Humbaba’s voice is the flood. His breath is fire.', 'shock'),
            EN('The god Enlil set him there to guard the cedars. He hears a heifer stir sixty leagues away.'),
            GI('Then he’ll hear us coming, and we won’t have to knock. Are you frightened? You? I’ll go first.'),
          ],
          choices: [
            {
              id: 'why',
              label: 'Ask why he wants to go.',
              then: [GI('To make a name. A name that lasts longer than I do. What else is there?'), N('Enkidu looks at you, as if hoping you might know.')],
            },
            {
              id: 'water',
              label: 'Pour them both a cup and say nothing.',
              then: [N('You pour them both a cup. Enkidu holds his without drinking, the way people hold something to stop their hands shaking.')],
            },
          ],
        },
        done: {
          id: 'a26-08-plan-done',
          lines: [EN('If you go, I’ll go. Somebody has to bring you back.', 'sad')],
        },
      },
      {
        id: 'a26-08-s2',
        goal: 'Go with the friends to the elders, then up to Ninsun’s roof.',
        hint: 'The elders meet at the city gate. Ninsun prays on the roof at sunrise.',
        check: 'watch:a26-ninsun:roof',
        scene: {
          id: 'a26-08-elders',
          lines: [
            N('The elders of Uruk sit on their benches by the gate. They hear Gilgamesh out, and shake their heads, all together.'),
            EL('You’re young, Gilgamesh. Your heart runs ahead of you. You don’t know what you’re talking about.'),
            EL('Let Enkidu go first. He knows the road. And come back to us. We have got used to you.', 'soft'),
            N('At sunrise Ninsun climbs her roof in her best robe and crown. She lifts incense to the sun god Shamash.'),
            NI('Why did you give my son a heart that never rests? Now he’s going a long way, to a fight he doesn’t know.', 'sad'),
            NI('Watch over him. Let the long days go fast for him. And bring him home.'),
            N('The sun climbs a little higher, and is very bright. You decide that is a yes.'),
          ],
          choices: [
            {
              id: 'bow',
              label: 'Bow your head while she prays.',
              then: [N('You bow your head. Beside you your Nubbin does too, and peeks.')],
            },
            {
              id: 'watch',
              label: 'Watch the sun come up.',
              then: [N('You watch the sun. It is enormous, and gold, and seems to be looking straight back at the roof.')],
            },
          ],
        },
        done: {
          id: 'a26-08-elders-done',
          lines: [NI('Enkidu. You’re not my son by birth, but I’m giving him to you to look after. Bring him home.', 'soft')],
        },
      },
      {
        id: 'a26-08-s3',
        goal: 'Pack the bread for the road while the smiths forge the axes.',
        hint: 'Go to the bakehouse, then carry the packs to the gate.',
        check: 'carry:a26-bread:gate',
        scene: {
          id: 'a26-08-pack',
          lines: [
            N('All morning the smiths’ hammers ring. They cast axes for the friends, and swords, so heavy two men groan to lift each.'),
            N('Your job is bread. You pack the flat loaves in cloth, with dates and onions and a pot of oil.'),
            N('You pack them the way your Nubbin likes its fruit: the soft things on top, so nothing gets squashed.'),
            GI('Bread? I’m going to fight a monster. I don’t need bread.'),
            EN('You’ll need bread. You always need bread. That’s the first thing I learned about people.'),
            N('Enkidu takes the pack from you, and checks it, and nods.'),
          ],
          choices: [
            {
              id: 'extra',
              label: 'Pack an extra loaf, just in case.',
              then: [EN('Good. That one’s for coming home.', 'soft')],
            },
            {
              id: 'water',
              label: 'Fill the waterskins too.',
              then: [N('You fill the waterskins at the well. Water-carrier: it is your job now, and you are good at it.')],
            },
          ],
        },
      },
    ],
    complete: {
      id: 'a26-08-complete',
      lines: [
        N('The whole city comes out to the gate to see them off. The elders give their blessings, and a lot of advice.'),
        EL('Let Enkidu go ahead. Trust him. And take the water-carrier. Somebody sensible ought to go.'),
        N('So you go too, with your Nubbin on the pack. The wall of Uruk gets smaller behind you, and then is gone.'),
      ],
    },
    rewards: [],
    sets: { 'a26-08': true },
    notes:
      'CARE: the axes and swords are carried, never swung on screen. Ninsun’s prayer is shown with respect: incense, her crown, the ' +
      'sun; the player is never asked to perform a rite, and the bow is only a choice of where to look.',
  },

  // ---------------------------------------------------------------- A26-9
  {
    id: 'a26-09',
    code: 'A26-9',
    title: 'Dreams on the Mountain',
    source: src('Tablet IV: the journey, the dreams each night, and Enkidu’s good readings'),
    audience: 'all',
    trigger: { where: WHERE, when: after('A26-8') },
    requires: ['A26-8'],
    speakers: [GILGAMESH, ENKIDU],
    steps: [
      {
        id: 'a26-09-s1',
        goal: 'Make camp on the mountain and keep the fire.',
        hint: 'Gather brush on the slope, then build the fire in the hollow by the well.',
        check: 'build:a26-fire:mountain',
        scene: {
          id: 'a26-09-fire',
          lines: [
            N('They walk fifty leagues a day: what would take anyone else a month and a half. You and your Nubbin trot to keep up.'),
            N('Each evening, Gilgamesh climbs a mountain and pours out flour as a gift, and asks for a dream. Then you make camp.'),
            N('You dig a well, and build the fire, and Enkidu builds a little shelter of brush so the king can sleep out of the wind.'),
            N('Gilgamesh sleeps with his chin on his knees, like a boy. In the night he sits bolt upright.'),
            GI('Enkidu. Did you call me? Why am I awake? Did a god pass by? I’m cold all over.', 'shock'),
            GI('I dreamed a mountain fell on me. It pinned me down like a fly.'),
            EN('A good dream! A very good dream. The mountain is Humbaba, and he’ll fall. We’ll stand on him.', 'happy'),
          ],
          choices: [
            {
              id: 'fire',
              label: 'Build the fire up higher.',
              then: [N('You pile on more brush. The fire jumps up, and the dark backs off a little, and Gilgamesh lies down again.')],
            },
            {
              id: 'blanket',
              label: 'Put your blanket over the king.',
              then: [N('You put your blanket over him, and he doesn’t notice. In the morning he will think he dreamed that too.')],
            },
          ],
        },
        done: {
          id: 'a26-09-fire-done',
          lines: [N('Enkidu waits until the king is snoring. Then he looks at you across the fire, and his face is not happy at all.')],
        },
      },
      {
        id: 'a26-09-s2',
        goal: 'Keep the watch through the nights on the road.',
        hint: 'Sit up by the fire while the friends sleep.',
        check: 'wait:a26-watch:mountain',
        scene: {
          id: 'a26-09-watch',
          lines: [
            N('Every night it is the same. A mountain, a dream, a cold wake in the dark.'),
            N('Gilgamesh dreams of a wild bull, of thunder, of a sky that rains down fire and ash.'),
            N('And every morning Enkidu says, cheerfully, it’s a good dream, the best dream yet.'),
            EN('A wild bull? That’s Shamash, looking after you.', 'happy'),
            EN('Thunder? That’s our luck, shouting for us.', 'happy'),
            GI('And the fire raining out of the sky?'),
            EN('Warm hands!', 'happy'),
            N('Your Nubbin looks at you. You look at the scorch marks on the hillside, and say nothing.'),
            N('On the fifth night, while the king sleeps, Enkidu sits down beside you at the fire.'),
            EN('They were bad dreams. All of them. You know that.', 'sad'),
            EN('But you can’t send a man to a fight with a bad dream on him. So I tell him it was good. That’s what friends are for.'),
          ],
          choices: [
            {
              id: 'right',
              label: 'Tell him he did the right thing.',
              then: [EN('Did I? I hope so. I’m new at friends.', 'soft')],
            },
            {
              id: 'you',
              label: 'Ask him who tells him the dreams are good.',
              then: [EN('Nobody. That’s all right. I’ve got you up, keeping the fire.', 'soft')],
            },
          ],
        },
        done: {
          id: 'a26-09-watch-done',
          lines: [
            N('He falls asleep sitting up, with his head on his knees. You keep the fire till dawn.'),
            N('In the morning, on the skyline, there is a dark green line, and a smell like a sawmill. The Cedar Forest.'),
          ],
        },
      },
    ],
    complete: {
      id: 'a26-09-complete',
      lines: [
        N('The cedars are taller than the wall of Uruk. Their shade is so cool and deep it looks like water.'),
        GI('There. Didn’t I say? Good dreams, every one.', 'happy'),
        N('Enkidu says nothing. He puts his hand flat on the first cedar, as if to say sorry to it.'),
      ],
    },
    rewards: [],
    sets: { 'a26-09': true },
    notes:
      'Tablet IV’s five dreams are told as one first dream in full (the mountain) and a montage of the others. Fifty leagues a day is ' +
      'the epic’s; the walk is a short travel scene, not a minigame. The well, the flour and the brush shelter are the epic’s.',
  },

  // ---------------------------------------------------------------- A26-10
  {
    id: 'a26-10',
    code: 'A26-10',
    title: 'Humbaba',
    source: src('Tablet V: the first cedar; Humbaba; Shamash’s winds; the plea; the great cedar sent down the Euphrates'),
    audience: 'all',
    trigger: { where: WHERE, when: after('A26-9') },
    requires: ['A26-9'],
    speakers: [GILGAMESH, ENKIDU, HUMBABA, SHAMASH],
    steps: [
      {
        id: 'a26-10-s1',
        goal: 'Follow the friends into the Cedar Forest.',
        hint: 'Keep to Humbaba’s path between the cedars, and stay behind Enkidu.',
        check: 'explore:a26-forest:cedar-mountain',
        scene: {
          id: 'a26-10-forest',
          lines: [
            N('Humbaba’s path runs straight into the forest, wide and clean, as if someone swept it every morning. Somebody does.'),
            N('The cedars smell of resin and old shade, and no birds sing here. Your Nubbin walks so close to your heels it treads on them.'),
            GI('This one. The tallest we’ve passed. Let’s see if he comes.'),
            N('Gilgamesh lifts his axe and cuts into a cedar. The sound goes off through the forest like a dropped plate.'),
            N('Far away, something roars. It is not loud, exactly; it is everywhere, like weather.'),
            HU('Who has come into my forest? Who has cut my tree?', 'angry'),
            N('Then he is there between the trees: huge, and ancient, with a face like a coil of wool and seven bright glories round him like cloaks.'),
          ],
          choices: [
            {
              id: 'still',
              label: 'Stand very still.',
              then: [N('You stand very still. His eyes pass over you and your Nubbin and move on: you were never the ones he wanted.')],
            },
            {
              id: 'hide',
              label: 'Pull your Nubbin behind a cedar.',
              then: [N('You pull your Nubbin behind a cedar. The bark is warm, and you feel the tree breathe, or you think you do.')],
            },
          ],
        },
        done: {
          id: 'a26-10-forest-done',
          lines: [GI('Shamash! Now! You promised my mother!', 'shock')],
        },
      },
      {
        id: 'a26-10-s2',
        goal: 'Stand by while Humbaba begs, and decide what you will say.',
        hint: 'Stay close to the friends. Choose what to say when Gilgamesh looks round.',
        check: 'choose:a26-humbaba:forest',
        scene: {
          id: 'a26-10-plea',
          lines: [
            SS('I hear.'),
            N('The voice comes out of the sun. Then the winds come: thirteen great winds from every side, roaring through the cedars.'),
            N('They pin Humbaba where he stands, like a hand holding down a leaf. He can’t go forward, and he can’t go back.'),
            HU('Gilgamesh. Let me live. I will be your servant. I will cut the cedars for you myself, as many as you want.', 'sad'),
            HU('This forest is all I have. Enlil gave it to me to keep. I have kept it since before your city had a wall.'),
            N('Gilgamesh lowers his axe a little and looks at Humbaba for a long time. Something in his face is changing.'),
            EN('Don’t listen to him, my friend. Finish it. Before the great gods hear and stop you. Make your name.', 'angry'),
            N('Gilgamesh turns his head, and looks at you. Of everyone in the forest, it’s you he looks at.'),
          ],
          choices: [
            {
              id: 'spoke',
              label: 'Speak for Humbaba: let him go.',
              set: { 'a26-humbaba': 'spoke' },
              then: [
                Y('Let him go. He’s only doing what he was told. He’s keeping his trees, like you keep your wall.'),
                N('Enkidu stares at you, and Gilgamesh’s axe drops lower. For a long breath, nobody moves.'),
              ],
            },
            {
              id: 'silent',
              label: 'Say nothing.',
              set: { 'a26-humbaba': 'silent' },
              then: [N('You say nothing; you don’t know what is right. You hold on to your Nubbin, and the wind roars, and Gilgamesh looks away.')],
            },
            {
              id: 'agreed',
              label: 'Agree with Enkidu.',
              set: { 'a26-humbaba': 'agreed' },
              then: [
                Y('Enkidu’s right. He knows this forest. If he says finish it, finish it.'),
                N('Enkidu nods at you, grim. Gilgamesh lifts his axe again.'),
              ],
            },
          ],
        },
        done: {
          id: 'a26-10-plea-done',
          lines: [
            N('Whatever anyone says, Gilgamesh has already decided. He steps forward into the wind, and Enkidu goes with him.'),
            N('You turn your face away, into your Nubbin’s fur.'),
            N('The wind drops: all thirteen winds, all at once. And the Cedar Forest goes quiet, the deep quiet of a held breath let go.'),
          ],
        },
      },
      {
        id: 'a26-10-s3',
        goal: 'Help send the great cedar down the river to Uruk.',
        hint: 'Carry the ropes to the riverbank and help lash the raft.',
        check: 'carry:a26-cedar:river',
        scene: {
          id: 'a26-10-river',
          lines: [
            N('Afterwards nobody talks much. The friends cut cedars, and Enkidu cuts the tallest of all, whose top scraped the sky.'),
            EN('We’ll make a door of it. Seventy-two cubits high. For Enlil’s temple. So he isn’t angry with us.', 'sad'),
            N('You carry ropes and lash logs. Your Nubbin carries one twig at a time, very solemnly, to the raft.'),
            N('Gilgamesh says nothing at all. He keeps looking back at the forest, which doesn’t look back.'),
            N('At last the raft is lashed, and the friends push it out into the Euphrates. It turns once, slowly, and sets off home.'),
            N('Gilgamesh rides on the raft with the great log, and Enkidu poles. You sit at the back with your feet in the water.'),
          ],
          choices: [
            {
              id: 'cone',
              label: 'Keep a cedar cone in your pocket.',
              then: [N('You pick up a cedar cone and keep it in your pocket. It smells of the forest the whole way home.')],
            },
            {
              id: 'look',
              label: 'Look back at the forest until it’s gone.',
              then: [N('You look back until the forest is only a dark line, and then not even that. Somebody should.')],
            },
          ],
        },
      },
    ],
    complete: {
      id: 'a26-10-complete',
      lines: [
        N('The river carries you home through the reeds. Herons stand on one leg and watch the raft go by.'),
        N('Gilgamesh has made his name. He doesn’t look as if it fits him quite as he expected.'),
      ],
    },
    rewards: [],
    sets: { 'a26-10': true },
    notes:
      'THE SIGNATURE CHOICE: a26-10-plea sets a26-humbaba = spoke | silent | agreed. It pays off in A26-13 (a26-13-dream-done), A26-14 ' +
      '(a26-14-sickbed-done) and A26-18 (a26-18-foot, and Moss’s extra line). Gilgamesh kills Humbaba on every path. CARE: his ' +
      'death is offscreen: the camera holds on your Nubbin’s fur, then on the trees as the wind drops and the forest goes quiet. No ' +
      'axe stroke, no head, no body. Humbaba is drawn huge and strange but not gory: a face like coiled wool, seven glories like ' +
      'pale cloaks of light. The thirteen winds are the epic’s. Shamash speaks two words (“I hear.”), out of the sun.',
  },

  // ---------------------------------------------------------------- A26-11
  {
    id: 'a26-11',
    code: 'A26-11',
    title: 'Ishtar',
    source: src('Tablet VI: Gilgamesh in his crown; Ishtar’s offer; his refusal; Ishtar goes to Anu'),
    audience: 'all',
    trigger: { where: WHERE, when: after('A26-10') },
    requires: ['A26-10'],
    speakers: [GILGAMESH, ISHTAR, ENKIDU],
    steps: [
      {
        id: 'a26-11-s1',
        goal: 'Fetch warm water for the king to wash.',
        hint: 'Heat water in the palace kitchen and carry it to the king’s rooms.',
        check: 'carry:a26-water:palace',
        scene: {
          id: 'a26-11-wash',
          lines: [
            N('Home in Uruk, Gilgamesh asks for warm water. You carry it up, jar after jar, until the king’s rooms are full of steam.'),
            N('He washes the forest out of his long hair and shakes it down his back. He puts on clean clothes and his crown.'),
            GI('There. Do I look like a king who has made a name?'),
            EN('You look like a king who has had a bath. That’s a start.'),
            N('Gilgamesh throws a wet cloth at him. It is the first time either of them has laughed since the forest.'),
            N('Then the light in the room goes gold and strange, as if the sun had come indoors. Your Nubbin’s fur stands up.'),
          ],
          choices: [
            {
              id: 'cloth',
              label: 'Hand Enkidu a dry cloth.',
              then: [N('You hand Enkidu a dry cloth. He holds it like a shield, and peers at the gold light.')],
            },
            {
              id: 'jar',
              label: 'Put down the jar and stand by the door.',
              then: [N('You put the jar down and stand by the door. Whoever is coming, you would like to be near the way out.')],
            },
          ],
        },
      },
      {
        id: 'a26-11-s2',
        goal: 'Stand by while the goddess Ishtar makes her offer.',
        hint: 'Stay by the door with your Nubbin. Don’t get between a goddess and a king.',
        check: 'watch:a26-ishtar:palace',
        scene: {
          id: 'a26-11-offer',
          lines: [
            N('The goddess Ishtar stands in the doorway, bright as the evening star. Her eyes are fixed on Gilgamesh, and nobody else.'),
            IS('Gilgamesh. You’re beautiful. Marry me. Be my husband, and I’ll give you a chariot of lapis and gold.', 'happy'),
            IS('Kings will kneel to you. Your goats will have triplets. Your ewes, twins. You’ll want for nothing.'),
            N('Gilgamesh looks at her for a long moment. Then he shakes his head.'),
            GI('Marry you? Everyone you’ve loved has come to grief. The shepherd you made into a wolf. The gardener you turned into a frog.', 'think'),
            GI('The little bird you loved, whose wing you broke. He sits in the woods crying “my wing”. Why would I be different?'),
            N('Ishtar’s face goes very still. The gold light in the room turns the colour of a storm.'),
            IS('You will be sorry, king of Uruk.', 'angry'),
          ],
          choices: [
            {
              id: 'bow',
              label: 'Bow low as she passes.',
              then: [N('You bow low as she sweeps past. You feel her look at you, briefly, as if at a fly on a wall.')],
            },
            {
              id: 'nubbin',
              label: 'Keep your Nubbin out of her way.',
              then: [N('You scoop your Nubbin out of her path. The hem of her robe crackles past it like summer lightning.')],
            },
          ],
        },
        done: {
          id: 'a26-11-offer-done',
          lines: [EN('That was not clever, brother.', 'shock'), GI('No. But it was true.')],
        },
      },
    ],
    complete: {
      id: 'a26-11-complete',
      lines: [
        N('High above the city, in a place you can only half see, Ishtar weeps in front of her father Anu, king of the gods.'),
        N('She asks him for the Bull of Heaven. When he says no, she says she will break open the gates of the dead.'),
        N('Anu gives her the Bull.'),
      ],
    },
    rewards: [],
    sets: { 'a26-11': true },
    notes:
      'CARE: Ishtar’s lovers get one plain line, and only the kid-safe ones from the list in Tablet VI (the shepherd made a wolf, ' +
      'the gardener Ishullanu made a frog, the allallu bird with the broken wing). Her offer is marriage and gifts only. The ' +
      'scene with Anu is seen as if through clouds; her threat stays “the gates of the dead”, with no picture of them.',
  },

  // ---------------------------------------------------------------- A26-12
  {
    id: 'a26-12',
    code: 'A26-12',
    title: 'The Bull of Heaven',
    source: src('Tablet VI: the Bull of Heaven; the friends bring it down; Enkidu and Ishtar on the wall; the ride through Uruk'),
    audience: 'all',
    trigger: { where: WHERE, when: after('A26-11') },
    requires: ['A26-11'],
    speakers: [GILGAMESH, ENKIDU, TOWNSWOMAN],
    steps: [
      {
        id: 'a26-12-s1',
        goal: 'Get the children in the market away from the cracks.',
        hint: 'Lead them up the wall stairs, away from the river side of the market.',
        check: 'escort:a26-children:market',
        scene: {
          id: 'a26-12-bull',
          lines: [
            N('It comes down out of the sky on the river side of town: a bull the size of a temple, the colour of thunderclouds.'),
            N('It snorts, and the ground cracks open, and a hundred market stalls tip into the hole.'),
            N('It snorts again, and the river leaps its banks, and everyone is shouting. A crowd of children is stuck by the fruit stalls.'),
            TW('The children! Somebody get the children!', 'shock'),
            N('You know the way: up the wall stairs, minding the third one. You hold out both hands.'),
            N('Your Nubbin runs ahead and stops on every step to look back, so the smallest ones have something to follow.'),
          ],
          choices: [
            {
              id: 'lead',
              label: 'Lead the children up the stairs.',
              then: [N('You lead them up, two at a time, holding hands in a long chain. Nobody lets go.')],
            },
            {
              id: 'carry',
              label: 'Carry the smallest one.',
              then: [N('You lift the smallest child on to your hip. She grips your collar with both fists and doesn’t cry once.')],
            },
          ],
        },
        done: {
          id: 'a26-12-bull-done',
          lines: [
            N('From the top of the wall you can see it all: the Bull, the cracks, and two small figures running straight at it.'),
            TW('That’s the king. And his brother. They’re mad. They’re both completely mad.', 'shock'),
          ],
        },
      },
      {
        id: 'a26-12-s2',
        goal: 'Watch from the wall as the friends face the Bull together.',
        hint: 'Stay on the wall with the children. Keep them back from the edge.',
        check: 'watch:a26-bull:wall',
        scene: {
          id: 'a26-12-fight',
          lines: [
            N('Enkidu grabs the Bull by its horns. It throws froth in his face and lashes its great tail, and he holds on.'),
            EN('Now, brother! Together!'),
            N('Gilgamesh comes in from the side, and the dust goes up like a wall of its own, and you can’t see anything at all.'),
            N('The children hold their breath. Your Nubbin covers its eyes, then uncovers one.'),
            N('When the dust settles, the Bull of Heaven lies on its side in the square, quite still, like a hill that has lain down.'),
            N('Ishtar appears on the wall of Uruk, in a storm of gold. Enkidu glares up at her from the square.'),
            EN('If I could reach you, I’d do the same to you! Go home! Leave our city alone!', 'angry'),
            N('Ishtar turns away with her women, and weeps for the Bull. Then she is gone.'),
          ],
          choices: [
            {
              id: 'cheer',
              label: 'Cheer with the children.',
              then: [N('You cheer, the children cheer, and somebody bangs a pot. The whole wall shakes with it.')],
            },
            {
              id: 'quiet',
              label: 'Look at the Bull for a while.',
              then: [N('You look at the Bull for a while. It came because someone was angry; it never chose to come at all.')],
            },
          ],
        },
      },
    ],
    complete: {
      id: 'a26-12-complete',
      lines: [
        N('That night the friends ride through the streets of Uruk in a chariot. The people line the way, shouting their names.'),
        GI('Who is the finest of men? Who is the bravest?', 'happy'),
        TW('Gilgamesh! And Enkidu!'),
        N('Enkidu holds the chariot rail with both hands and his eyes shut. He waves with one elbow.'),
        EN('Is it meant to go this fast?'),
        GI('Hold on to something.'),
        EN('I am. It’s you.'),
        N('He sees you in the crowd and lets go to wave, which is a mistake. Your Nubbin waves back with both arms.'),
      ],
    },
    rewards: [],
    sets: { 'a26-12': true },
    notes:
      'CARE: softened for All, as the outline says: no wound, no heart cut out, no thrown thigh. The fight happens inside a dust ' +
      'cloud; when it clears the Bull lies still, like a hill lying down. Enkidu only shouts at Ishtar. The cracks swallow stalls, ' +
      'never people; the children are all safe. Ishtar’s mourning is kept to one line.',
  },

  // ---------------------------------------------------------------- A26-13
  {
    id: 'a26-13',
    code: 'A26-13',
    title: 'The Gods’ Council',
    source: src('Tablet VII: Enkidu’s dream of the gods’ judgement; his curses; Shamash’s reply; his blessing of Shamhat'),
    audience: 'all',
    trigger: { where: WHERE, when: after('A26-12') },
    requires: ['A26-12'],
    speakers: [ENKIDU, GILGAMESH, SHAMASH],
    steps: [
      {
        id: 'a26-13-s1',
        goal: 'Sit with Enkidu when he wakes from his dream.',
        hint: 'He has called for you before dawn. Go to his room.',
        check: 'sit:a26-enkidu:dawn',
        scene: {
          id: 'a26-13-dream',
          lines: [
            N('Before dawn a servant shakes you awake. Enkidu is asking for you, and for the king.'),
            N('He is sitting on the edge of his bed with the blanket round his shoulders. He is very pale.'),
            EN('I dreamed. The great gods sat in council: Anu, and Enlil, and Shamash. They were talking about us.', 'sad'),
            EN('Because we killed Humbaba, and the Bull of Heaven, one of us has to die. Enlil said so.'),
            EN('And it won’t be Gilgamesh. It will be me.'),
            GI('No. No. It was a dream. I’ll tell you it was a good one, the way you did for me.', 'shock'),
            N('Enkidu tries to smile at that. He doesn’t quite manage it.'),
          ],
          choices: [
            {
              id: 'sit',
              label: 'Sit down on the bed beside him.',
              then: [N('You sit down beside him, and the bed creaks. Your Nubbin climbs up on his other side.')],
            },
            {
              id: 'water',
              label: 'Bring him a cup of water.',
              then: [N('You bring him water. His hands shake, so you hold the cup with him until he has drunk.')],
            },
          ],
        },
        done: {
          id: 'a26-13-dream-done',
          lines: [
            N('Enkidu turns to look at you. He doesn’t say anything at all.'),
            N('He takes your hand, and holds it, quite hard, while the window goes from black to grey.'),
          ],
        },
      },
      {
        id: 'a26-13-s2',
        goal: 'Go with Enkidu to the cedar door.',
        hint: 'He wants to see the great door at the temple. Walk him there.',
        check: 'talk:a26-enkidu:cedar-door',
        scene: {
          id: 'a26-13-door',
          lines: [
            N('He wants to see the cedar door, so you walk him to the temple, slowly. It stands there, huge and fragrant and new.'),
            EN('Door. If I’d known what you would cost me, I’d have left you standing in your forest.', 'angry'),
            EN('And the trapper. If he’d left me alone at the water. And Shamhat, who taught me to talk. I curse them all.', 'angry'),
            N('The sun comes up over the wall. It shines straight into the doorway, and a voice comes out of it.'),
            SS('Enkidu. Why curse Shamhat? She gave you bread fit for a god. She gave you clothes to wear.'),
            SS('She gave you Gilgamesh for a friend. And when you go, he will weep for you, and the whole city will.'),
            N('Enkidu stands very still in the sunlight. His face crumples, and then, slowly, it clears.'),
          ],
          choices: [
            {
              id: 'bread',
              label: 'Tell him she gave him bread, too, the first day.',
              then: [EN('She did. I licked it first. You were there.', 'soft')],
            },
            {
              id: 'quiet',
              label: 'Stay quiet, and let him think.',
              then: [N('You stay quiet. The sun is warm on the three of you: Enkidu, you, and your Nubbin, leaning on his leg.')],
            },
          ],
        },
        done: {
          id: 'a26-13-door-done',
          lines: [
            EN('Shamhat. I take it back. Let kings love you, and princes. Let people bring you gold and lapis and oil.', 'soft'),
            EN('Let nobody ever leave you. You found me in the grass and brought me home. I bless you.'),
          ],
        },
      },
    ],
    complete: {
      id: 'a26-13-complete',
      lines: [
        N('By noon he is too tired to stand. Gilgamesh carries him back to bed, as easily as he once carried a star in a dream.'),
        GI('Rest. Then you’ll be better. You always get better. You’re the strongest man in the world, after me.'),
        EN('After you. Of course.', 'soft'),
      ],
    },
    rewards: [],
    sets: { 'a26-13': true },
    notes:
      'HUMBABA PAYOFF (a26-humbaba): a26-13-dream-done as written is the silent path (he holds your hand). For spoke, play ' +
      'A26_VARIANTS a26-13-dream-done-spoke; for agreed, a26-13-dream-done-agreed. Shamhat is not present: Enkidu blesses her by ' +
      'name, as in the epic. Shamash is a voice out of the sun only, and is kind.',
  },

  // ---------------------------------------------------------------- A26-14
  {
    id: 'a26-14',
    code: 'A26-14',
    title: 'Twelve Days',
    source: src('Tablets VII and VIII: Enkidu’s illness and death; Gilgamesh’s grief; the statue'),
    audience: 'all',
    trigger: { where: WHERE, when: after('A26-13') },
    requires: ['A26-13'],
    speakers: [ENKIDU, GILGAMESH],
    steps: [
      {
        id: 'a26-14-s1',
        goal: 'Sit with Enkidu while he is ill.',
        hint: 'Take water to his room, and stay.',
        check: 'sit:a26-enkidu:sickbed',
        scene: {
          id: 'a26-14-sickbed',
          lines: [
            N('Enkidu lies ill for twelve days. Each day he is a little more tired, and a little further away.'),
            N('You fetch water and cool cloths. Mostly you just sit, on the stool by the bed, because he likes someone there.'),
            N('Gilgamesh sits on the other side, and doesn’t sleep. You have never seen him sit still so long.'),
            EN('Tell me about where you come from. Is it big, like Uruk?', 'soft'),
            Y('No. It’s small. There’s a garden, and a pond, and a hill.'),
            EN('A hill. Good. I like hills. You can see what’s coming.'),
            N('Your Nubbin lies on the end of the bed, across his feet, to keep them warm. Enkidu says it is the best blanket he has ever had.'),
          ],
          choices: [
            {
              id: 'grove',
              label: 'Tell him about the Grove.',
              then: [N('You tell him about the Grove: the Nubbins, the fruit trees, the lanterns. He listens with his eyes shut, smiling.')],
            },
            {
              id: 'hum',
              label: 'Hum the tune he sang at the shepherds’ fire.',
              then: [N('You hum the tune he sang at the shepherds’ fire, and get it a bit wrong. He hums it back right, very quietly.')],
            },
            {
              id: 'hand',
              label: 'Just hold his hand.',
              then: [N('You hold his hand. It is very big, and very warm, and it holds yours back.')],
            },
          ],
        },
        done: {
          id: 'a26-14-sickbed-done',
          lines: [
            EN('Water-carrier. Will you do something for me, after?'),
            EN('Look after the gazelles. Not the city ones. The wild ones, at the water hole. Make sure nobody digs pits there.', 'soft'),
            Y('I will.'),
          ],
        },
      },
      {
        id: 'a26-14-s2',
        goal: 'Stay with Enkidu and Gilgamesh on the twelfth day.',
        hint: 'Stay in the room. There is nothing to do but be there.',
        check: 'wait:a26-enkidu:twelfth-day',
        scene: {
          id: 'a26-14-death',
          lines: [
            N('On the twelfth day the house is very quiet. Even the street outside seems to walk on tiptoe.'),
            N('Gilgamesh hasn’t left the bedside for days. You keep bringing water, and he keeps not drinking it.'),
            EN('Brother. Do you remember the door? Your knee in the dust?', 'soft'),
            GI('I let you win.'),
            EN('You did not.', 'happy'),
            N('He laughs, a little, and closes his eyes. Your Nubbin is curled against his hand, and it doesn’t move, and neither do you.'),
            N('Some time in the afternoon his breathing goes slower, and softer. Then it stops, as gently as a door being closed.'),
            N('Gilgamesh doesn’t move for a long time. Then he draws the cloth over his friend’s face, carefully, like a bride’s veil.'),
            N('He gets up and walks the room, up and down, up and down, like a lioness whose cubs are gone.'),
            GI('O Enkidu, he was my comrade, who ran with me through the mountains and the cedar forest, and never once let go.', 'sad'),
            GI('Who will I tell my dreams to now?', 'sad'),
            N('You don’t have an answer; nobody has. You sit on the floor by the bed, and wait, and the light goes.'),
          ],
        },
        done: {
          id: 'a26-14-death-done',
          lines: [
            N('Your Nubbin climbs down off the bed, and into Gilgamesh’s lap when at last he sits, and stays there.'),
            N('It doesn’t do anything or make a sound all night. It is the kindest thing anyone does.'),
          ],
        },
      },
      {
        id: 'a26-14-s3',
        goal: 'Go with Gilgamesh when he has a statue made of his friend.',
        hint: 'Find the king in the smiths’ quarter, with the gold and the lapis.',
        check: 'watch:a26-statue:palace',
        scene: {
          id: 'a26-14-statue',
          lines: [
            N('Gilgamesh calls every smith and jeweller in Uruk. He wants a statue of his friend, and it must be perfect.'),
            N('They make it of gold and lapis, and polish it until it shines. It has Enkidu’s big hands, and his grin.'),
            N('The whole city weeps for him: the elders, the shepherds, the woman from the square. Even the river seems to.'),
            GI('He’s not in it. Look at it. It’s beautiful, and he’s not in it.', 'sad'),
            N('Gilgamesh stands in front of the statue for a long time. Then he looks at his own hands, as if they belonged to someone else.'),
            GI('I’m going to die too. Like him. I’ll lie down, and not get up, for ever. I can’t bear it.', 'shock'),
          ],
          choices: [
            {
              id: 'date',
              label: 'Put a date by the statue, for Enkidu.',
              then: [N('You put a date at the statue’s feet. It is the first thing he ever ate from a person’s hand.')],
            },
            {
              id: 'stand',
              label: 'Stand next to Gilgamesh.',
              then: [N('You stand next to him. He doesn’t look at you, but he doesn’t send you away either.')],
            },
          ],
        },
      },
    ],
    complete: {
      id: 'a26-14-complete',
      lines: [
        GI('There is one man the gods let live for ever. Uta-Napishtim, at the end of the world. I’ll find him. I’ll ask him how.'),
        N('He tears off his fine clothes, and pulls on rough lion skins, and walks out of the city gate without saying goodbye.'),
        N('You fill the waterskins, and your Nubbin climbs on to the pack. Somebody has to carry the water.'),
      ],
    },
    rewards: [],
    sets: { 'a26-14': true },
    childLines: {
      'a26-14-death#9': 'Enkidu was my friend, my brother. He ran with me through the mountains and the cedar forest, and never once let go.',
    },
    notes:
      'HUMBABA PAYOFF (a26-humbaba): a26-14-sickbed-done as written is the silent path (the gazelles). For spoke, play A26_VARIANTS ' +
      'a26-14-sickbed-done-spoke (a cedar seed); for agreed, a26-14-sickbed-done-agreed (the shepherds). MOSS: if he comes, play ' +
      'a26-14-death-done-moss in place of a26-14-death-done; he says nothing at all, which is his kindest thing. CARE: gentle and ' +
      'grave, like Fossil’s fading: the breath slows and stops; the cloth goes over his face; no decay, no worm (cut). Music drops ' +
      'out at a26-14-death#6. Lifted line 3 at a26-14-death#9 (Thompson, Tablet X: the opening words only, then our own). The ' +
      'third rule is acted (you sit and wait), never quoted.',
  },

  // ---------------------------------------------------------------- A26-15
  {
    id: 'a26-15',
    code: 'A26-15',
    title: 'Lion Skins',
    source: src('Tablet IX: Gilgamesh in lion skins; the mountains of Mashu; the scorpion-people; the road of the sun; the jewelled garden'),
    audience: 'all',
    trigger: { where: WHERE, when: after('A26-14') },
    requires: ['A26-14'],
    speakers: [GILGAMESH, SCORPION],
    steps: [
      {
        id: 'a26-15-s1',
        goal: 'Follow Gilgamesh to the twin mountains of Mashu.',
        hint: 'Keep up with him across the wilderness. Carry the water.',
        check: 'walk:a26-gilgamesh:mashu',
        scene: {
          id: 'a26-15-road',
          lines: [
            N('Gilgamesh walks the wild places in his lion skins. His beard grows ragged and his face grows thin.'),
            N('He doesn’t talk. At night he lies awake and looks at the stars as if they owed him money.'),
            GI('I used to be afraid of nothing. Now I’m afraid of everything. Of lying down. Of not getting up.', 'sad'),
            N('You give him water. He drinks it now, at least, a little, which you count as a good day.'),
            N('At last two mountains rise ahead, so tall they hold up the sky, with a gate between them where the sun goes in and out.'),
            N('Your Nubbin, on the pack, has gone very small and quiet. It puts its paws over its eyes, then uncovers one.'),
          ],
          choices: [
            {
              id: 'eat',
              label: 'Make him eat some bread.',
              then: [GI('You sound like him.', 'sad'), N('But he eats it.')],
            },
            {
              id: 'stars',
              label: 'Lie down and look at the stars with him.',
              then: [N('You lie down beside him and look. After a while, without meaning to, he points out a star Enkidu liked.')],
            },
          ],
        },
        done: {
          id: 'a26-15-road-done',
          lines: [N('By the gate there are two figures, keeping watch. They are people down to the waist, and scorpions below.')],
        },
      },
      {
        id: 'a26-15-s2',
        goal: 'Wait while the scorpion-man and his wife decide whether to let you through.',
        hint: 'Stand back behind Gilgamesh, and let him do the talking.',
        check: 'talk:a26-scorpion:mashu-gate',
        scene: {
          id: 'a26-15-gate',
          lines: [
            N('The scorpion-man is terrible to look at, with a glare that could bring down a mountain. His wife stands at his side.'),
            SC('Look, wife. Two parts god, one part man. Terrible combination. Stand behind me.'),
            N('His wife does not stand behind him. She is already crouching to look at your Nubbin.'),
            SC('…And who is the small one with the water?', 'think'),
            N('His wife looks at you, and at your Nubbin, and tilts her head. You think, from her face, that she rather likes small ones.'),
            SC('We are not keeping it, wife.'),
            N('She looks at him. He looks at the gate. It is clearly an old argument.'),
            GI('I’m looking for Uta-Napishtim, who lives for ever. I want to ask him about life, and death.'),
            SC('No one has ever gone this way. Twelve double-hours of dark, with no light at all. Nobody comes out the other side.', 'think'),
            GI('I’ll go anyway. In grief, and in pain, in cold and in heat. Open the gate.'),
            SC('Then go, and come back safe. The gate is open.', 'soft'),
          ],
          choices: [
            {
              id: 'thank',
              label: 'Thank the scorpion-people.',
              then: [N('You thank them, and the scorpion-man doesn’t answer. His wife lifts one claw, very slightly, like a wave.')],
            },
            {
              id: 'belt',
              label: 'Take hold of Gilgamesh’s belt before the dark.',
              then: [N('You take hold of his belt. He looks down at your hand, and then lets you.')],
            },
          ],
        },
      },
      {
        id: 'a26-15-s3',
        goal: 'Walk the dark road of the sun holding on to Gilgamesh’s belt.',
        hint: 'Don’t let go. Count the double-hours as you go.',
        check: 'walk:a26-dark:mashu',
        scene: {
          id: 'a26-15-dark',
          lines: [
            N('The dark inside the mountain is thicker than any night. You can’t see your hand, or Gilgamesh.'),
            N('You can feel his belt, though, and the rough lion skin, and your Nubbin’s breath on your neck. You hold on.'),
            GI('One double-hour. Thick dark. Nothing.'),
            GI('Four. Five. Still nothing.', 'sad'),
            N('He counts aloud, so you know he’s there. You count with him, so he knows you are.'),
            GI('Nine. I feel the north wind on my face.', 'think'),
            GI('Eleven. There’s light. Look. Look!', 'shock'),
            N('At the twelfth double-hour you step out into the sun, blinking, into a garden where the trees bear jewels.'),
            N('Carnelian hangs in bunches like grapes, and the leaves are lapis. Your Nubbin reaches up to touch one, very gently.'),
          ],
        },
        done: {
          id: 'a26-15-dark-done',
          lines: [
            N('Your Nubbin is shivering, from the cold of the dark. Gilgamesh looks at it for a moment.'),
            N('Then he cuts a strip off the edge of his lion skin with his knife, and wraps it round the Nubbin’s shoulders like a cloak.'),
          ],
        },
      },
    ],
    complete: {
      id: 'a26-15-complete',
      lines: [
        GI('There. Now you look like a hero too. Don’t let it go to your head.'),
        N('It is the first joke he has made since the twelve days. Your Nubbin wears the cloak with enormous pride.'),
        N('Beyond the jewelled garden there is a sea, and a little house beside it, with smoke coming from the chimney.'),
      ],
    },
    rewards: [
      {
        id: 'a26-lion-cloak',
        kind: 'cosmetic',
        label: 'Lion-skin cloak',
        description: 'A little cloak of plain tawny fur for your Nubbin, cut from the edge of Gilgamesh’s lion skins. No head, no claws: just warm.',
      },
    ],
    sets: { 'a26-15': true },
    notes:
      'The cloak is plain fur, no head or paws (outline). No lion is seen alive or killed; the skins are only what he wears. The ' +
      'scorpion-people are drawn awe-inspiring but not horror: human above, scorpion below, with a glare like heat haze. The ' +
      'twelve double-hours are a dark walk with only voices and a faint outline of your hand on the belt; the count in the epic ' +
      'is kept in short. Reduced motion: no flicker in the dark.',
  },

  // ---------------------------------------------------------------- A26-16
  {
    id: 'a26-16',
    code: 'A26-16',
    title: 'Siduri',
    source: src('Tablet X: Siduri the ale-wife; Ur-Shanabi and the Stone Things; the punting poles; the Waters of Death'),
    audience: 'all',
    trigger: { where: WHERE, when: after('A26-15') },
    requires: ['A26-15'],
    speakers: [SIDURI, GILGAMESH, URSHANABI],
    steps: [
      {
        id: 'a26-16-s1',
        goal: 'Sit in Siduri’s tavern by the sea and hear what she says.',
        hint: 'Siduri has barred her door. Wait until she opens it.',
        check: 'talk:a26-siduri:tavern',
        scene: {
          id: 'a26-16-siduri',
          lines: [
            N('By the sea at the edge of the world there is a little tavern with a vine over the door. Siduri keeps it.'),
            N('She sees a wild man in lion skins coming up the beach, and bars her door, and climbs up on her roof to look.'),
            SI('Who are you, looking like that? Your cheeks are hollow. You look like someone who has walked a very long way.', 'shock'),
            GI('I’m Gilgamesh. My friend died. I can’t bear it. I’m looking for the man who never dies.', 'sad'),
            N('Siduri looks at him for a long time. Then she climbs down, and opens the door, and gives you each a stool and a cup.'),
            GI('Tell me the way across the sea. Please.'),
            SI('Gilgamesh, why runnest thou? The life which thou seekest, thou canst not find.'),
            SI('When the gods made people, they kept life for themselves. So eat. Wash your hair. Dance, if you like.', 'soft'),
            SI('Cherish the little one holding thy hand. Let thy wife be glad in thy bosom.'),
            SI('Plainly: hold the hand that holds yours. Ale, a bath, a laugh. That’s what people are for.', 'soft'),
            N('Gilgamesh turns his cup round and round. He isn’t listening, and he doesn’t want to.'),
          ],
          choices: [
            {
              id: 'listen',
              label: 'Tell Siduri you were listening.',
              then: [SI('I know. You’ve got the face of someone who listens. It’s rarer than you’d think, in my trade.', 'happy')],
            },
            {
              id: 'paw',
              label: 'Hold your Nubbin’s paw.',
              then: [N('You hold your Nubbin’s paw under the table. Siduri sees, and doesn’t say anything, and refills your cup.')],
            },
          ],
        },
        done: {
          id: 'a26-16-siduri-done',
          lines: [
            N('Your Nubbin climbs into your lap and goes to sleep there, warm and heavy. It doesn’t need telling.'),
            GI('Where is the boatman? The one who crosses the sea.', 'angry'),
            SI('Ur-Shanabi. In the woods, by the shore. Be gentle with him. Be gentle with something, for once.'),
          ],
        },
      },
      {
        id: 'a26-16-s2',
        goal: 'Find Ur-Shanabi the boatman in the woods.',
        hint: 'Follow Gilgamesh into the woods by the shore. He has gone ahead.',
        check: 'find:a26-urshanabi:shore',
        scene: {
          id: 'a26-16-stones',
          lines: [
            N('Gilgamesh runs ahead into the woods. By the time you catch up, there is a crash, and another, and then a silence.'),
            N('In a clearing, among broken pieces of stone, stands a boatman with a pole, staring at the king.'),
            UR('Those were the Stone Things. They crewed my boat. They could cross the Waters of Death without touching them.', 'shock'),
            UR('And you smashed them. Because you were sad, and they were there.'),
            N('Gilgamesh looks at the pieces as if he has just woken up. His hands are grey with stone dust.'),
            GI('I didn’t… I didn’t think.', 'sad'),
            UR('No. People don’t, when they’re grieving. I’ve ferried enough of them.', 'soft'),
          ],
          choices: [
            {
              id: 'pieces',
              label: 'Help gather the pieces into a pile.',
              then: [N('You gather the pieces, carefully, into a neat pile. Ur-Shanabi watches, and nods, as if that was the right thing to do.')],
            },
            {
              id: 'ask',
              label: 'Ask Ur-Shanabi if there’s another way.',
              then: [UR('There is. It’s harder. Everything’s harder now. Can you hold an axe, little one?', 'think')],
            },
          ],
        },
      },
      {
        id: 'a26-16-s3',
        goal: 'Help cut punting poles for the crossing.',
        hint: 'Gather the straight poles Gilgamesh cuts, and stack them by the boat.',
        check: 'collect:a26-poles:forest',
        scene: {
          id: 'a26-16-poles',
          lines: [
            UR('Cut poles. Long ones, straight, and a great many. Each pole may touch the water once, and then you let it go.'),
            UR('If your hand touches the Waters of Death, you won’t need to find Uta-Napishtim. Understand?'),
            N('So Gilgamesh cuts, and you carry, and Ur-Shanabi trims, until there is a stack of poles taller than the boat.'),
            N('Your Nubbin, in its lion cloak, drags a small branch to the pile as its share. Ur-Shanabi trims that too, gravely.'),
            N('The work seems to do Gilgamesh good. By the end of the day he is sweating, and tired, and less wild in the eyes.'),
            GI('Enkidu would have been better at this. He could fell a tree with a look.', 'soft'),
          ],
          choices: [
            {
              id: 'ask',
              label: 'Ask him to tell you about Enkidu.',
              then: [N('He tells you, while he works: the steppe, the door, the forest. He laughs twice, and it surprises him both times.')],
            },
            {
              id: 'work',
              label: 'Just keep carrying.',
              then: [N('You keep carrying, and he keeps cutting, side by side, in a rhythm. Some work is a kind of talking.')],
            },
          ],
        },
      },
    ],
    complete: {
      id: 'a26-16-complete',
      lines: [
        N('At dawn you push off. The Waters of Death are black and flat and smell of nothing at all.'),
        N('Gilgamesh punts: each pole touches once, he lets it go, and you hand him the next. One by one, the stack shrinks.'),
        N('When the last pole is gone, he holds his lion skins up for a sail, and the wind takes you the rest of the way.'),
        UR('There. The far shore. He’s been waiting a long time for someone to come.'),
      ],
    },
    rewards: [],
    sets: { 'a26-16': true },
    childLines: {
      'a26-16-siduri#6': 'Gilgamesh, why are you running so far? You won’t find the life you are looking for.',
      'a26-16-siduri#8': 'Love the little one who holds your hand, and hug the people who love you.',
    },
    notes:
      'Lifted lines 4 (two verse lines, the bracketed words dropped as the outline says) and 5 at a26-16-siduri#6 and #8 (the first two verse lines joined into one speech) ' +
      '(Thompson, Tablet X). Siduri’s advice is from the Old Babylonian Meissner tablet, as Thompson gives it. MOSS: if he comes, ' +
      'play A26_VARIANTS a26-16-siduri-done-moss in place of a26-16-siduri-done; he agrees with her. CARE: the Stone Things are ' +
      'smashed offscreen (two crashes, then the pieces); Gilgamesh hurts nobody. The number of poles is left vague on purpose (the ' +
      'versions differ). Nobody touches the Waters of Death; no pole sinks on screen.',
  },

  // ---------------------------------------------------------------- A26-17
  {
    id: 'a26-17',
    code: 'A26-17',
    title: 'Uta-Napishtim',
    source: src('Tablets X and XI: Uta-Napishtim and his flood; the test of sleep; the loaves; the plant; the snake'),
    audience: 'all',
    trigger: { where: WHERE, when: after('A26-16') },
    requires: ['A26-16'],
    speakers: [UTA, GILGAMESH, UTAWIFE, URSHANABI],
    steps: [
      {
        id: 'a26-17-s1',
        goal: 'Hear Uta-Napishtim’s story on the far shore.',
        hint: 'Sit by his door with Gilgamesh and listen.',
        check: 'talk:a26-uta:far-shore',
        scene: {
          id: 'a26-17-tale',
          lines: [
            N('On the far shore an old man sits on a bench by his door, watching you come. He doesn’t look like a god; he looks like a grandfather.'),
            UT('Who is this, with his cheeks so hollow, in a lion skin, with a child carrying his water?', 'think'),
            GI('I want what you have. I want not to die. My friend died, and I can’t stop thinking about it.', 'sad'),
            UT('Shall we for ever build houses? For ever set signet to contract?'),
            UT('No. The river rises and goes down. The dragonfly floats on it and sees the sun for a day. Nothing stays.', 'soft'),
            GI('But you stayed. Tell me how.'),
            UT('Then sit. It’s a long story, and it’s mine.'),
            N('He tells how the god Ea whispered through the reed wall of his house: tear it down, and build a boat.'),
            N('How he took on board his family, and craftsmen, and every kind of animal, and the seed of every living thing.'),
            UW('And me. He always leaves me out of the boat.'),
            UT('And my wife. Who was there. As she likes to say.'),
            N('The storm came for six days and seven nights. Then it was still, and there was water everywhere, flat as a roof.'),
            N('He sent out a dove, and it came back; a swallow, and it came back. Then a raven, which didn’t, because it had found land.'),
            UW('The raven was my idea.'),
            UT('The raven was her idea.', 'think'),
            UT('And the gods, who were sorry, made my wife and me like them. That’s all. It happened once. It won’t happen again.'),
          ],
          choices: [
            {
              id: 'animals',
              label: 'Ask what happened to the animals.',
              then: [UT('They walked off down the gangplank and never thanked me, not one. I didn’t mind. That’s animals.', 'happy')],
            },
            {
              id: 'wife',
              label: 'Ask his wife if she minds living for ever.',
              then: [UW('Some days. The bread’s good, though. And he still tells that story as if I wasn’t there.', 'happy')],
            },
          ],
        },
        done: {
          id: 'a26-17-tale-done',
          lines: [
            GI('Then the gods could do it again. For me.'),
            UT('Could they? Let’s see if you can do something smaller first.'),
          ],
        },
      },
      {
        id: 'a26-17-s2',
        goal: 'Watch over Gilgamesh while he tries to stay awake.',
        hint: 'Stay by him through the test. Help Uta-Napishtim’s wife with the loaves.',
        check: 'wait:a26-loaves:seven',
        scene: {
          id: 'a26-17-test',
          lines: [
            UT('Stay awake for seven days and seven nights. If you can’t beat sleep, how will you beat death?'),
            GI('Easily. I’ve hardly slept since…', 'angry'),
            N('He sits down on the sand with his back against the house. And sleep breathes over him like a mist, at once.'),
            UT('Look at him. The strong man who wants to live for ever.', 'think'),
            UW('Wake him. Let him go home the way he came.', 'soft'),
            UT('He’ll only say he never slept. Bake him a loaf every day, and put it by his head, and mark the wall. Then he’ll know.'),
            N('So every day she bakes a loaf, and every day you set it by his head. Your Nubbin guards them, mostly.'),
          ],
          choices: [
            {
              id: 'wake',
              label: 'Try to wake him on the first day.',
              then: [N('You shake his shoulder, and he snores. You have woken him from bad dreams before, but this is something else.')],
            },
            {
              id: 'count',
              label: 'Help her count the loaves.',
              then: [N('You count the loaves with her: one, two, three, all in a row. She teaches you how to tell how old bread is by tapping it.')],
            },
            {
              id: 'sleep',
              label: 'Let him sleep. He needs it.',
              then: [N('You let him sleep: he hasn’t slept properly since the twelve days. Uta-Napishtim’s wife looks at you, and nods.')],
            },
          ],
        },
        done: {
          id: 'a26-17-test-done',
          lines: [
            N('On the seventh day Uta-Napishtim touches him, and he wakes. The first loaf by his head is dry as a brick.'),
            GI('I only just shut my eyes.'),
            N('Then he sees the loaves: hard, leathery, soggy, furry, grey, fresh, and one still warm. He puts his face in his hands.'),
            UW('Seven. I counted. He’d have said one.', 'soft'),
            UT('Ur-Shanabi. Take him to wash. Give him clean clothes. Clothes that will stay clean till he gets home.'),
          ],
        },
      },
      {
        id: 'a26-17-s3',
        goal: 'Watch Gilgamesh dive for the plant at the bottom of the sea.',
        hint: 'Stay in the boat with Ur-Shanabi and hold the rope.',
        check: 'watch:a26-plant:sea',
        scene: {
          id: 'a26-17-plant',
          lines: [
            N('He is washed, and his hair is clean, and he wears new clothes. He looks like a king again, a tired one.'),
            UW('You can’t send him home with nothing. He walked all that way.', 'soft'),
            UT('Gilgamesh. I’ll tell you a secret of the gods. There is a plant, down at the bottom of the sea. It has thorns, like a rose.'),
            UT('Eat it, and you’re young again.'),
            N('Gilgamesh ties heavy stones to his feet. You hold the rope in the boat, and he drops into the deep, and is gone.'),
            N('You count, and your Nubbin peers over the side at the green water. The rope goes slack, then tight.'),
            N('He comes up gasping, with his hands torn by the thorns, holding a plant with a pale flower like a star.'),
          ],
          choices: [
            {
              id: 'pull',
              label: 'Haul him into the boat.',
              then: [N('You haul with Ur-Shanabi until he flops over the side, laughing, dripping, alive.')],
            },
            {
              id: 'hands',
              label: 'Look at his hands.',
              then: [N('You look at his hands, and Ur-Shanabi wraps them in a strip of your spare cloth. Gilgamesh doesn’t even notice.')],
            },
          ],
        },
        done: {
          id: 'a26-17-plant-done',
          lines: [
            GI('Look at it, Ur-Shanabi. Look!', 'happy'),
            GI('“Greybeard-who-turneth-to-man-in-his-prime” is its name. I’ll take it home and try it on an old man first.'),
            GI('And then I’ll eat it, and be young again. And everyone I love can have a leaf.'),
          ],
        },
      },
      {
        id: 'a26-17-s4',
        goal: 'Walk home with Gilgamesh and Ur-Shanabi.',
        hint: 'Stop with them at the pool on the road home.',
        check: 'inspect:a26-pool:road-home',
        scene: {
          id: 'a26-17-snake',
          lines: [
            N('You walk home, and Gilgamesh carries the plant in both hands, like a lamp.'),
            N('After many leagues you come to a cool pool. Gilgamesh lays the plant on the bank and goes down to bathe.'),
            N('Your Nubbin goes to splash in the shallows. You sit on the bank, between the plant and the road.'),
            N('Something moves in the grass. A snake, long and quiet, slides out, smells the flower, and takes it in its mouth.'),
            N('Before anyone can move, it is gone. On the bank where the plant lay there is only a skin, empty and new-shed.'),
            GI('No. No, no.', 'shock'),
            N('Gilgamesh comes up out of the water, and looks at the skin, and sits down on the bank. And he weeps.'),
          ],
          choices: [
            {
              id: 'sit',
              label: 'Sit down beside him.',
              then: [N('You sit down beside him. He weeps like a child, with his whole body, and you stay.')],
            },
            {
              id: 'skin',
              label: 'Pick up the snake’s old skin.',
              then: [N('You pick up the skin, light as paper. The snake is young again somewhere, which is something.')],
            },
          ],
        },
        done: {
          id: 'a26-17-snake-done',
          lines: [
            GI('For whom did I tear my hands? For whom did I walk all that way? For a snake. I’ve given it to a snake.', 'sad'),
            UR('Yes. And now we go home anyway. Come on.'),
          ],
        },
      },
    ],
    complete: {
      id: 'a26-17-complete',
      lines: [
        N('You walk on, the three of you, with your Nubbin dripping on the pack. It is a quiet walk.'),
        N('In your pocket you find a little reed boat, plaited tight. Uta-Napishtim’s wife must have made it while the loaves baked.'),
        N('It is his boat in little: a reed wall, pulled down and plaited into a way through the flood.'),
      ],
    },
    rewards: [
      {
        id: 'a26-reed-boat',
        kind: 'decor',
        label: 'Little reed boat',
        description: 'A small boat of plaited reeds from Uta-Napishtim’s wife. It floats on the Grove pond, and Nubbins like to push it about.',
      },
    ],
    sets: { 'a26-17': true },
    childLines: {
      'a26-17-tale#3': 'Do we build houses that stand for ever? Do we make promises that last for ever?',
      'a26-17-plant-done#1': 'Its name is “Old Man Grows Young Again”. I’ll take it home and try it on an old man first.',
    },
    notes:
      'Lifted line 6 at a26-17-tale#3 (Thompson, Tablet X, brackets dropped, words kept: “houses”, “to contract”); lifted line 7, a ' +
      'fragment, at a26-17-plant-done#1 (Tablet XI). The flood is Uta-Napishtim’s own story, told as his, with no comparisons ' +
      '(care note). Mankind “turned to clay” is cut; the water is “flat as a roof”, which is the epic’s. The loaves’ states are ' +
      'the epic’s (dry, leathery, soggy, mouldy here “furry”, grey, fresh, on the coals). s24Done: with it, play A26_VARIANTS ' +
      'a26-17-snake-done-hazel in place of a26-17-snake-done (Hazel’s margin note). The reed boat floats on the Grove pond.',
  },

  // ---------------------------------------------------------------- A26-18
  {
    id: 'a26-18',
    code: 'A26-18',
    title: 'The Wall of Uruk',
    source: src('Tablet XI, the close: Gilgamesh shows Ur-Shanabi the wall of Uruk'),
    audience: 'all',
    trigger: { where: WHERE, when: after('A26-17') },
    requires: ['A26-17'],
    speakers: [GILGAMESH, URSHANABI, BRICKMAKER],
    steps: [
      {
        id: 'a26-18-s1',
        goal: 'Walk the wall of Uruk with Gilgamesh and Ur-Shanabi.',
        hint: 'Climb the wall stair. Mind the third step.',
        check: 'walk:a26-wall:rampart',
        scene: {
          id: 'a26-18-wall',
          lines: [
            N('You come home across the plain at evening. The wall of Uruk is gold in the low sun, and the river runs beside it.'),
            N('Gilgamesh stops. He looks at the wall for a long while, as if he had never properly seen it.'),
            UR('So that’s your city. It’s big.'),
            GI('It is. Come up. I’ll show you.'),
            N('You climb the wall stair together. Your Nubbin knows the way, and waits on the third step for you, which wobbles.'),
            N('On top, the wind is warm. The whole city is laid out below, roofs and orchards and smoke from supper fires.'),
            N('Gilgamesh holds out his arm, the way a host shows a guest the best room in the house.'),
            GI('Do thou, Ur-Shanabi, go up and walk on the ramparts of Uruk,'),
            GI('Look on its base, and take heed of its bricks, if its bricks be not kiln-burnt,'),
            GI('A square mile of city, a square mile of orchards, a square mile of clay-pits. And the temple. That’s mine. That’s what I—'),
            N('He looks down at a brick by his foot. Somebody’s thumbprint is baked into it. And the next one, and the next.'),
            GI('That’s what we made. I mostly did the shouting.'),
          ],
          choices: [
            {
              id: 'knock',
              label: 'Knock on a brick.',
              then: [N('You knock on a brick, and it rings. Gilgamesh hears it, and for the first time in a long time, he smiles.')],
            },
            {
              id: 'look',
              label: 'Look at the city with them.',
              then: [N('Somebody is calling children in for supper, and somebody is singing. It all goes on, and on.')],
            },
          ],
        },
        done: {
          id: 'a26-18-wall-done',
          lines: [GI('I went to the end of the world. And here it is. It was here the whole time.', 'soft')],
        },
      },
      {
        id: 'a26-18-s2',
        goal: 'Go down to the foot of the wall, where the story started.',
        hint: 'The old brickmaker is waiting by the copper tablet box.',
        check: 'visit:a26-wall:foundation',
        scene: {
          id: 'a26-18-foot',
          lines: [
            N('At the foot of the wall, by the copper box, the old brickmaker is sitting on her stack of bricks, eating a date.'),
            BR('There you are. Long story, was it? They always are, his.'),
            N('Below the wall, on the patch of rough grass by the river, a gazelle is grazing. It lifts its head, and looks at you, and doesn’t run.'),
            N('Gilgamesh sees it too. He stands quite still, so as not to frighten it.'),
            GI('He asked you to look after them. You did.', 'soft'),
            BR('Now then. Every brick in this wall has someone’s hand in it. Want yours in?'),
            N('She lays a fresh clay brick in front of you. You press your hand into it, and your Nubbin, after some thought, presses a paw.'),
            BR('Kiln-fired, this one. Sun-dried bricks crumble in the rain. Kiln-fired, they last for thousands of years.'),
          ],
          choices: [
            {
              id: 'tablet',
              label: 'Ask her if the tablet is still in the box.',
              then: [BR('It is. Always will be, if people leave it be. That one, nobody takes.')],
            },
            {
              id: 'name',
              label: 'Ask if she’ll put her own mark on it too.',
              then: [BR('Me? No. I’m on all the others.', 'happy')],
            },
          ],
        },
        done: {
          id: 'a26-18-foot-done',
          lines: [
            BR('Not every tablet stays put. Plenty were taken from their places, in living memory.', 'sad'),
            BR('Some have come home since. Every one that comes home is a little bit of a city put back.'),
            N('Gilgamesh gives you a small box made of cedarwood, smelling of the forest. It was cut from the offcuts of the great door.'),
            GI('For your own tablets. Put your story in it, whatever it is. And leave it where people can open it.'),
          ],
        },
      },
    ],
    complete: {
      id: 'a26-18-complete',
      lines: [
        N('Your Nubbin climbs up to your shoulder, and sits there, looking at the wall, the way someone older might.'),
        GI('Go home, water-carrier. Walk on your own wall. Look at its bricks.'),
        ...A18_HOME,
      ],
    },
    rewards: [
      {
        id: 'a26-brick',
        kind: 'decor',
        label: 'The handprint brick',
        description: 'A kiln-fired brick with your handprint and your Nubbin’s pawprint, laid in the Grove by Moss’s flat stone (by his flower, if he has faded).',
      },
      {
        id: 'a26-tablet-box',
        kind: 'decor',
        label: 'Cedar tablet box',
        description: 'A little box of cedar from the offcuts of the temple door, for the cottage shelf. It smells of the forest when you open it.',
      },
    ],
    sets: { 'a26-18': true, 'a26-done': true },
    childLines: {
      'a26-18-wall#7': 'Ur-Shanabi, go up and walk along the top of Uruk’s wall.',
      'a26-18-wall#8': 'Look at how it stands, and at its bricks. See how they were baked hard in the fire.',
    },
    notes:
      'Lifted line 8 (two verse lines, Thompson Tablet XI, “Erech” as Uruk) at a26-18-wall#7 and #8; line #9 finishes the passage ' +
      'in our own words. HUMBABA PAYOFF (a26-humbaba): a26-18-foot as written is the silent path (a gazelle grazes below the wall). ' +
      'For spoke, play A26_VARIANTS a26-18-foot-spoke (a cedar sapling); for agreed, a26-18-foot-agreed (Gilgamesh’s long look). ' +
      'The wall is the same on every path. MOSS: if he comes, play a26-18-complete-moss, or a26-18-complete-moss-spoke on the spoke ' +
      'path, in place of a26-18-complete. CARE: the brickmaker’s line on taken and returned tablets is the outline’s heritage ' +
      'note, said plainly, without naming any war. GROVE KEEPSAKE: on the first return to the Grove after A26-18, play ' +
      'A26_VARIANTS a26-grove-brick, or a26-grove-brick-flower if Moss has faded or the ending is moss-sleeps.',
  },
];

// =================================================================== variants

/**
 * Variant scenes chosen by flags. Each quest’s notes say which scene each replaces.
 *   Moss comes (c4-out seen, mossFaded false, ending not moss-sleeps; read at each quest’s start):
 *     a26-01-page-moss, a26-03-herd-done-moss, a26-14-death-done-moss, a26-16-siduri-done-moss,
 *     a26-18-complete-moss (or a26-18-complete-moss-spoke with a26-humbaba = spoke).
 *   a26-humbaba = spoke | agreed (A26-10; silent plays the scenes as written):
 *     a26-13-dream-done-*, a26-14-sickbed-done-*, a26-18-foot-*.
 *   s24Done (Grove, read-only, at A26-17 step 4): a26-17-snake-done-hazel.
 *   Grove keepsake, on the first return to the Grove after A26-18: a26-grove-brick, or a26-grove-brick-flower
 *     if Moss has faded or the ending is moss-sleeps.
 */
export const A26_VARIANTS: Scene[] = [
  // ---------------------------------------------------------------- A26-1, step 1 scene (Moss comes)
  {
    id: 'a26-01-page-moss',
    lines: [
      N('Nova’s atlas falls open at a page so bright it warms your face. A great brick wall stands in the sun, with date palms and a river.'),
      N('Moss has come to see what you are reading. He climbs your sleeve and settles on your shoulder.'),
      MO('Old, that wall. Older than me, nearly. I’ll come, if it’s all the same to you. I like a wall.'),
      ...A1_STEP_IN,
      N('She looks at Moss on your shoulder, nods to him as to an old neighbour, and walks you along the top.'),
      BR('A square mile of town, a square mile of orchards, a square mile of clay-pits, and half a mile for the temple. All held in by bricks.'),
      BR('My mother made bricks, and hers did. Some of these are older than anyone’s grandmother.'),
      MO('Not anyone’s.'),
    ],
    choices: [
      {
        id: 'bricks',
        label: 'Ask her how you tell a good brick.',
        then: [BR('You knock it. A good one rings. A bad one says “thud” and lets you down when it rains.', 'happy')],
      },
      {
        id: 'king',
        label: 'Ask who built the wall.',
        then: [BR('The king says he did. The king says a lot of things. Come down and I’ll show you something better.', 'think')],
      },
    ],
  },
  // ---------------------------------------------------------------- A26-3, step 1 done (Moss comes)
  {
    id: 'a26-03-herd-done-moss',
    lines: [
      N('You sit under a thorn tree and watch them. Moss climbs down off your shoulder and sits in the shade beside you.'),
      N('Enkidu grooms a gazelle’s ear with great care. There is nothing wild about the way he does it.'),
      MO('Nothing wrong with him. He just hasn’t met anyone yet.'),
    ],
  },
  // ---------------------------------------------------------------- A26-13, step 1 done (spoke)
  {
    id: 'a26-13-dream-done-spoke',
    lines: [
      N('Enkidu turns to look at you. His eyes are wet.'),
      EN('You said to let him go. You were the only one.', 'sad'),
      EN('I told him to finish it. I was frightened, so I was cruel. I wish I’d listened to you.'),
      N('He takes your hand, and holds it, quite hard, while the window goes from black to grey.'),
    ],
  },
  // ---------------------------------------------------------------- A26-13, step 1 done (agreed)
  {
    id: 'a26-13-dream-done-agreed',
    lines: [
      N('Enkidu turns to look at you. He tries to smile.'),
      EN('We did it together. We’ll carry it together.', 'sad'),
      N('He takes your hand, and holds it, quite hard, while the window goes from black to grey.'),
    ],
  },
  // ---------------------------------------------------------------- A26-14, step 1 done (spoke)
  {
    id: 'a26-14-sickbed-done-spoke',
    lines: [
      EN('Water-carrier. Will you do something for me, after?'),
      N('He opens his big hand, and in it is a cedar seed, small and brown, from the forest. He must have carried it all this way.'),
      EN('Plant it. For Humbaba’s forest. One tree back, for all the ones we took. You’ll know where.', 'soft'),
      Y('I will.'),
    ],
  },
  // ---------------------------------------------------------------- A26-14, step 1 done (agreed)
  {
    id: 'a26-14-sickbed-done-agreed',
    lines: [
      EN('Water-carrier. Will you do something for me, after?'),
      EN('Remember me to the shepherds. Tell them their watchman thought of them. Tell them to keep the lamps lit for the sheep.', 'soft'),
      Y('I will.'),
    ],
  },
  // ---------------------------------------------------------------- A26-14, step 2 done (Moss comes)
  {
    id: 'a26-14-death-done-moss',
    lines: [
      N('Moss climbs down from your shoulder, slowly, and sits on the end of the bed, by Enkidu’s feet.'),
      N('He says nothing at all. Not one word, all night.'),
      N('You have known him long enough to know what that means. It is the kindest thing he has.'),
      N('Your Nubbin climbs into Gilgamesh’s lap when at last he sits, and stays there too.'),
    ],
  },
  // ---------------------------------------------------------------- A26-16, step 1 done (Moss comes)
  {
    id: 'a26-16-siduri-done-moss',
    lines: [
      MO('She’s right, you know. I’d have said it shorter. But she’s right.'),
      SI('And who’s this, on your shoulder?', 'think'),
      MO('Someone who has outlived a good many friends, and is still having his supper.', 'soft'),
      SI('Then you’ll have a cup with me.', 'soft'),
      GI('Where is the boatman? The one who crosses the sea.', 'angry'),
      SI('Ur-Shanabi. In the woods, by the shore. Be gentle with him. Be gentle with something, for once.'),
    ],
  },
  // ---------------------------------------------------------------- A26-17, step 4 done (s24Done)
  {
    id: 'a26-17-snake-done-hazel',
    lines: [
      GI('For whom did I tear my hands? For whom did I walk all that way? For a snake. I’ve given it to a snake.', 'sad'),
      UR('Yes. And now we go home anyway. Come on.'),
      N('At the very edge of the sky, where a page would have its margin, there is writing in pencil, small and slanted. You know the hand.'),
      N('“Lost the plant. Kept the wall.”'),
      N('“Good trade.”', 'soft'),
      N('And under it, one letter: H.'),
    ],
  },
  // ---------------------------------------------------------------- A26-18, step 2 scene (spoke)
  {
    id: 'a26-18-foot-spoke',
    lines: [
      N('At the foot of the wall, by the copper box, the old brickmaker is sitting on her stack of bricks, eating a date.'),
      BR('There you are. Long story, was it? They always are, his.'),
      N('Below the wall, by the river, there is a cedar sapling no higher than your knee. You know whose seed it was.'),
      N('Gilgamesh kneels down beside it. He touches one of its little needles, very carefully, with a hand that tore on thorns.'),
      GI('You told me to let him go. I should have listened to you.', 'sad'),
      BR('Now then. Every brick in this wall has someone’s hand in it. Want yours in?'),
      N('She lays a fresh clay brick in front of you. You press your hand into it, and your Nubbin, after some thought, presses a paw.'),
      BR('Kiln-fired, this one. Sun-dried bricks crumble in the rain. Kiln-fired, they last for thousands of years.'),
    ],
    choices: [
      {
        id: 'tablet',
        label: 'Ask her if the tablet is still in the box.',
        then: [BR('It is. Always will be, if people leave it be. That one, nobody takes.')],
      },
      {
        id: 'name',
        label: 'Ask if she’ll put her own mark on it too.',
        then: [BR('Me? No. I’m on all the others.', 'happy')],
      },
    ],
  },
  // ---------------------------------------------------------------- A26-18, step 2 scene (agreed)
  {
    id: 'a26-18-foot-agreed',
    lines: [
      N('At the foot of the wall, by the copper box, the old brickmaker is sitting on her stack of bricks, eating a date.'),
      BR('There you are. Long story, was it? They always are, his.'),
      N('Gilgamesh stops beside you. He looks at you for a long time, without saying anything, the way you look at a well to see how deep it goes.'),
      GI('We both learned it late.', 'soft'),
      N('He doesn’t say what, and he doesn’t need to. Somewhere out on the steppe, the shepherds are lighting their lamps.'),
      BR('Now then. Every brick in this wall has someone’s hand in it. Want yours in?'),
      N('She lays a fresh clay brick in front of you. You press your hand into it, and your Nubbin, after some thought, presses a paw.'),
      BR('Kiln-fired, this one. Sun-dried bricks crumble in the rain. Kiln-fired, they last for thousands of years.'),
    ],
    choices: [
      {
        id: 'tablet',
        label: 'Ask her if the tablet is still in the box.',
        then: [BR('It is. Always will be, if people leave it be. That one, nobody takes.')],
      },
      {
        id: 'name',
        label: 'Ask if she’ll put her own mark on it too.',
        then: [BR('Me? No. I’m on all the others.', 'happy')],
      },
    ],
  },
  // ---------------------------------------------------------------- A26-18 complete (Moss comes)
  {
    id: 'a26-18-complete-moss',
    lines: [
      N('Moss has been quiet all the way home. Now he sits up on your shoulder and looks at the wall, brick by brick.'),
      MO('He went to the end of the world so as not to die, and came home and pointed at a wall.'),
      MO('That’s the right answer. He just took the long way.', 'soft'),
      GI('Go home, water-carrier. Walk on your own wall. Look at its bricks.'),
      ...A18_HOME,
    ],
  },
  // ---------------------------------------------------------------- A26-18 complete (Moss comes, spoke)
  {
    id: 'a26-18-complete-moss-spoke',
    lines: [
      N('Moss has been quiet all the way home. Now he sits up on your shoulder and looks at the wall, brick by brick.'),
      MO('He went to the end of the world so as not to die, and came home and pointed at a wall.'),
      MO('That’s the right answer. He just took the long way.', 'soft'),
      N('He looks down at the cedar sapling by the river for a while.'),
      MO('And somebody let a tree live. That’s the other answer.', 'soft'),
      GI('Go home, water-carrier. Walk on your own wall. Look at its bricks.'),
      ...A18_HOME,
    ],
  },
  // ---------------------------------------------------------------- Grove keepsake: the brick by the flat stone
  {
    id: 'a26-grove-brick',
    lines: [
      N('You carry the brick up the hill to the flat stone where Moss always sits, and lay it in the grass beside it.'),
      N('Your handprint and the pawprint face the sky. Your Nubbin knocks on the brick with one paw, and listens: it rings.'),
      N('You put the cedar box on the cottage shelf. When you open it, the room smells of a forest a very long way off.'),
    ],
  },
  // ---------------------------------------------------------------- Grove keepsake: the brick by his flower (Moss faded or moss-sleeps)
  {
    id: 'a26-grove-brick-flower',
    lines: [
      N('You carry the brick up the hill to Moss’s flower by the flat stone, and lay it in the grass beside it.'),
      N('Your handprint and the pawprint face the sky. Your Nubbin knocks on the brick with one paw, and listens: it rings.'),
      N('You sit for a while by the flower and the brick. It seems the right thing to do here.', 'soft'),
      N('You put the cedar box on the cottage shelf. When you open it, the room smells of a forest a very long way off.'),
    ],
  },
];

// =================================================================== flags and checks

/**
 * Every flag this line sets (Atlas save only). It reads Grove facts (the chapter, mossFaded and the ending id, for
 * Moss; s24Done, for Hazel’s margin note) and writes no Grove flag.
 */
export const ATLAS_A26_FLAGS: string[] = [
  'a26-01',
  'a26-02',
  'a26-03',
  'a26-04',
  'a26-05',
  'a26-06',
  'a26-07',
  'a26-08',
  'a26-09',
  'a26-10',
  'a26-11',
  'a26-12',
  'a26-13',
  'a26-14',
  'a26-15',
  'a26-16',
  'a26-17',
  'a26-18',
  'a26-done', // A26-18: the whole page; read through atlasDone('A26') for the Grove keepsake
  'a26-humbaba', // spoke | silent | agreed (a26-10-plea): the variants in A26-13, A26-14 and A26-18
];

export const ATLAS_A26_CHECKS: string[] = [
  'explore:a26-wall:rampart',
  'find:a26-tablet-box:foundation',
  'watch:a26-games:square',
  'watch:a26-clay:temple',
  'walk:a26-steppe:water-hole',
  'inspect:a26-pits:steppe',
  'escort:a26-shamhat:water-hole',
  'sit:a26-water-hole:days',
  'find:a26-nubbin:herd',
  'feed:a26-enkidu:bread',
  'watch:a26-flocks:night',
  'carry:a26-cups:ninsun-hall',
  'talk:a26-ninsun:ninsun-hall',
  'escort:a26-enkidu:uruk-gate',
  'watch:a26-wrestle:door',
  'carry:a26-water:palace-roof',
  'watch:a26-ninsun:roof',
  'carry:a26-bread:gate',
  'build:a26-fire:mountain',
  'wait:a26-watch:mountain',
  'explore:a26-forest:cedar-mountain',
  'choose:a26-humbaba:forest',
  'carry:a26-cedar:river',
  'carry:a26-water:palace',
  'watch:a26-ishtar:palace',
  'escort:a26-children:market',
  'watch:a26-bull:wall',
  'sit:a26-enkidu:dawn',
  'talk:a26-enkidu:cedar-door',
  'sit:a26-enkidu:sickbed',
  'wait:a26-enkidu:twelfth-day',
  'watch:a26-statue:palace',
  'walk:a26-gilgamesh:mashu',
  'talk:a26-scorpion:mashu-gate',
  'walk:a26-dark:mashu',
  'talk:a26-siduri:tavern',
  'find:a26-urshanabi:shore',
  'collect:a26-poles:forest',
  'talk:a26-uta:far-shore',
  'wait:a26-loaves:seven',
  'watch:a26-plant:sea',
  'inspect:a26-pool:road-home',
  'walk:a26-wall:rampart',
  'visit:a26-wall:foundation',
];
