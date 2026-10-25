/**
 * Atlas campaign, page A29: The Honmoon (Part M, rank 34). Sixteen quests, A29-1 to A29-16.
 *
 * SOURCE. KPop Demon Hunters, the 2025 animated film (Sony Pictures Animation, released by
 * Netflix; dir. Maggie Kang and Chris Appelhans). Rights: © Sony Pictures Animation / Netflix.
 * A LICENCE IS NEEDED TO SHIP THIS PAGE. The character names (Rumi, Mira, Zoey, Jinu, Celine,
 * Bobby, Gwi-Ma, Derpy, Sussie), Huntrix, the Saja Boys and the Honmoon are the film's. Nothing
 * else is taken: no dialogue, NO LYRICS, NO MELODIES AND NO SONG TITLES, anywhere, on screen or
 * in data. Every song on the page is original wordless music written for the game, and it is
 * described, never quoted. The film's sealed, perfected barrier is called "the gold seal" or
 * "the Honmoon made gold" here, never by the film's own adjective, because that word is also
 * one of the film's song titles. The harsh song (A29-9, A29-11) and Rumi's own song (A29-14)
 * have no names at all. All art is the atlas's own: a painted page, not the film's designs.
 *
 * AUDIENCE. 'all'. There is no lifted text, so there are no childLines. The peril is the film's:
 * demons who feed on people's souls, shown as a dimming of the light in people's faces and a
 * shimmer leaving them like breath on a cold day. Nobody is hurt on screen. The Learning Grove's
 * reader-band version (softened: the demons "steal people's cheer") is a separate edu file,
 * still to do.
 *
 * FRAME. Nova's atlas opens at a page painted bright: a stage, a city at night and a tiger in a
 * hat. Under it is an older picture, a long ink scroll. You step in through the scroll (A29-1)
 * and come out in Seoul, where Bobby, Huntrix's manager, mistakes you for the new runner. You
 * fetch, carry, hold the noodles and make tea. Rumi, Mira and Zoey keep their story; Jinu keeps
 * his. Your Nubbin rides in the merchandise bag, and befriends Derpy the tiger before anyone
 * else does. Your Nubbin never speaks. Derpy and Sussie never speak (the film's don't). Sable,
 * if she comes, never speaks: narration only.
 *
 * GROVE STATE READ (read-only; the Atlas never writes a Grove flag):
 *   - SABLE'S TRUST STAGE, read once, when A29-1 starts (as A16 reads it):
 *       none or t20 (no Sable, or trust under 45, not bonded): she doesn't come. Nothing plays.
 *       t45 (trust 45 or more, not bonded): play a29-01-sable-hid straight after a29-01-scroll.
 *         It sets a29-sable = hid. She hides the whole page.
 *       bonded: play a29-01-sable-heel straight after a29-01-scroll. It sets a29-sable = heel.
 *     The stage is fixed for the page by a29-sable; trust gained later doesn't change it.
 *     a29-sable = hid: a29-02-stage-hid (under the stage), a29-03-pans-hid (behind the noodle
 *       pans), a29-11-store-hid (in the store room), a29-16-street-hid (the wall's shade).
 *     a29-sable = heel: a29-14-crowd-heel (by you in the crowd, ears up), a29-16-street-heel
 *       (in the sun, mid-pavement). Wherever she has come, the art shows her in every scene.
 *     After A29-16, in the Grove: a29-grove-luna-heel or a29-grove-luna-hid, the next time you
 *     talk to Luna (it reads the Atlas flag a29-sable, read-only, like A16's Luna scene).
 *   - s24Done (Hazel's margin note): play a29-01-margin-hazel straight after a29-01-complete if
 *     s24Done is set; if S24 finishes later, play it the next time the atlas opens at this page.
 *
 * FLAGS WRITTEN (Atlas save only, all prefixed a29-):
 *   - a29-01 … a29-16 on each quest; a29-done on A29-16 (atlasDone('A29')).
 *   - a29-sable = hid | heel (the Sable variants of A29-1).
 *   - a29-sleeve = jacket | saw | away (A29-6, a29-06-sleeve): the signature choice. Pays off in
 *     A29-12 (a29-12-find), A29-14 (a29-14-song-done) and A29-16 (a29-16-complete).
 *
 * VARIANTS (ATLAS_A29_VARIANTS): see the block above the array.
 *
 * LIFTED TEXT. None. All dialogue is original. No lyrics, melodies or song titles.
 *
 * CARE NOTES.
 *   - KOREAN ADVISERS for dress, food, places, words and folk elements before ship, and a Korean
 *     artist for the minhwa screen. Korean words are kept few and are glossed by context:
 *     ramyun (the film's spelling), gat, hanok, boricha, gimbap, jeoseung saja, minhwa.
 *   - JEOSEUNG SAJA. In Korean folk belief the jeoseung saja are the messengers who walk the dead
 *     to the next world: grave, dutiful, not evil. The Saja Boys borrow their look (black coats
 *     and wide black gat). The page says so plainly (A29-5): the boys are demons wearing a
 *     messenger's costume, and the messengers themselves are not the villains here.
 *   - THE GAT is a real Joseon-era hat, a horsehair-and-bamboo heirloom craft. Draw it accurately
 *     and with dignity. Nobody mocks it, and the villains' wearing of it is not a joke about it.
 *   - THE TIGER AND THE MAGPIE (kkachi horangi) come from Korean folk painting (minhwa): the
 *     magpie brings good news, the tiger is often comic and a bit foolish. Derpy and Sussie are
 *     drawn in that spirit, never as menacing. The reward screen must be painted by a Korean
 *     artist in the minhwa style, not imitated.
 *   - RUMI'S MARKS are never framed as ugly, a disease or a thing to be fixed. The page's arc is
 *     that she doesn't have to hide them. No one is "cured". Celine is not a villain: she is
 *     afraid for Rumi, and the page leaves her with tea and company, not blame (A29-13).
 *   - JINU's end (A29-15) is light, not death imagery: he is gone in a rush of brightness, and
 *     his soul, whole again, goes to Rumi. Gwi-Ma is a voice in a fire and a great shadow; keep
 *     him huge and slow rather than frightening in detail.
 *   - SOULS. The word appears, as in the film, but the taking is shown only as dimming eyes and a
 *     faint shimmer drifting off the crowd. Nobody falls down; everybody wakes.
 *   - Hazel's third rule is acted (A29-13, sitting by Celine), never quoted.
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

const WHERE = 'Nova’s atlas: the Honmoon page (Atlas campaign)';
const after = (code: string) => `Any time after ${code}, from Nova’s atlas.`;
const SRC = 'KPop Demon Hunters (Sony Pictures Animation and Netflix, 2025)';

// ------------------------------------------------------------------ speakers

const FILM = 'KPop Demon Hunters (Sony Pictures Animation and Netflix, 2025); original design and dialogue';
const RUMI = sp('a29-rumi', 'Rumi', `Rumi, Huntrix's leader, half-demon, in ${FILM}`);
const MIRA = sp('a29-mira', 'Mira', `Mira, of Huntrix, in ${FILM}`);
const ZOEY = sp('a29-zoey', 'Zoey', `Zoey, of Huntrix, in ${FILM}`);
const JINU = sp('a29-jinu', 'Jinu', `Jinu, leader of the Saja Boys, in ${FILM}`);
const CELINE = sp('a29-celine', 'Celine', `Celine, the former hunter who raised Rumi, in ${FILM}`);
const BOBBY = sp('a29-bobby', 'Bobby', `Bobby, Huntrix's manager, in ${FILM}`);
const GWIMA = sp('a29-gwima', 'Gwi-Ma', `Gwi-Ma, the demon king, a voice in the fire, in ${FILM}`);
const FAN = sp('a29-fan', 'A girl in a Huntrix T-shirt', 'An original fan; no source character');

const N = say('narrator');
const Y = say('you');
const R = say('a29-rumi');
const M = say('a29-mira');
const Z = say('a29-zoey');
const J = say('a29-jinu');
const C = say('a29-celine');
const B = say('a29-bobby');
const G = say('a29-gwima');
const F = say('a29-fan');
const LU = say('luna');

// ------------------------------------------------------------------ shared pieces

/** A29-12, step 2: the opening shared by all three sleeve paths. */
const FIND_OPEN: Line[] = [
  N('The car park under the awards hall smells of exhaust and spilt fizzy drink. The noise upstairs has gone thin and strange.'),
  N('You are sitting on the gear case, because nobody told you where else to sit. Your Nubbin is in the merchandise bag, very quiet.'),
];

/** A29-14, step 2 done: the end shared by all three sleeve paths. */
const SONG_END: Line[] = [
  N('Mira, halfway down the aisle, blinks, and so does Zoey, two rows behind. They look at each other.'),
  N('Then they are running for the stage, and you are running after them with the gear case banging your knees.'),
];

/** A29-16 complete: the opening shared by every ending. */
const C16_OPEN: Line[] = [
  N('The fans thin out at last. Bobby counts phones, counts girls, and counts you, and seems happy with all the numbers.'),
  B('Runner. Good work. Strange work, but good. If you ever want a job that’s only a job, call me.', 'happy'),
  N('Bobby holds up a mug. On it, in pink, is your Nubbin in its noodle hat, waving.'),
  B('Don’t look at me like that. It’s outselling the lightsticks.', 'shock'),
  M('I did say he’d put it on a mug.'),
  N('Your Nubbin takes the mug, looks inside for the real one, and climbs in.'),
];
/** A29-16 complete: the gifts and the way home, shared by every ending. */
const C16_HOME: Line[] = [
  N('Sussie drops a folded leaf into your hand from the wall, and then hops onto your shoulder and stays there.'),
  N('Zoey hands you a flat parcel tied with string. Inside is a small folding screen, from Celine: a silly tiger and a bright magpie.', 'soft'),
  N('Under the screen is one pear in its foam jumper. The label, in Celine’s tidy hand, says: Bobby. Don’t get ideas.'),
  B('She sent me a pear. Mira. She sent me a pear.', 'soft'),
  N('The street goes flat, and bright, and smells of paint. You are in the Grove, with a magpie on your shoulder and a thread of light round your wrist.'),
];

// =================================================================== THE HONMOON

export const ATLAS_A29: Quest[] = [
  // ---------------------------------------------------------------- A29-1
  {
    id: 'a29-01',
    code: 'A29-1',
    title: 'The First Hunters',
    source: `${SRC}: the prologue`,
    audience: 'all',
    trigger: {
      where: WHERE,
      when: 'Any time once Nova’s atlas is in the Grove; the first quest on the page.',
    },
    speakers: [BOBBY],
    steps: [
      {
        id: 'a29-01-s1',
        goal: 'Step into the old ink scroll under the bright page.',
        hint: 'Touch the scroll at the bottom of the page, not the stage.',
        check: 'visit:a29-page:scroll',
        scene: {
          id: 'a29-01-scroll',
          lines: [
            N('Nova’s atlas falls open at a page so bright it hums: a stage, a city at night, and a tiger in a hat grinning out of a corner.'),
            N('Under the bright paint, older, there is a long ink scroll. Mountains, small villages, and a road between them.'),
            N('You touch the scroll, and it is cool, like paper left by a window. Then it is mist, and you are standing in the painting.'),
            N('Everything is ink: the hills, the pines, the roofs, your own sleeve. Your Nubbin is a round grey brushstroke at your feet.'),
            N('Over the far mountains something comes, drawn fast and badly, all teeth. Demons, pouring down the slopes like spilt ink.'),
            N('Where they pass, the people in the villages go pale, as if a brush had wiped the colour off them.'),
            N('A voice in the painting says, or seems to say, that the demons take the light out of people and carry it down to their king.'),
            N('Far below the mountains, in a red smudge that is the only colour in the scroll, something huge is waiting. Its name is Gwi-Ma.', 'think'),
          ],
          choices: [
            {
              id: 'look',
              label: 'Look at the people in the villages.',
              then: [N('A woman in the nearest village is holding a bowl of rice, and has forgotten why. You want very much to give her back her colour.', 'sad')],
            },
            {
              id: 'nubbin',
              label: 'Pick up your Nubbin.',
              then: [N('You lift your Nubbin, and in your arms it goes back to its own colour, and so does your hand. Good: keep hold.')],
            },
            {
              id: 'king',
              label: 'Look at the red smudge.',
              then: [N('You look at it for a moment too long, and it seems to look back. You look away first.', 'shock')],
            },
          ],
        },
        done: {
          id: 'a29-01-scroll-done',
          lines: [N('On a hill above the villages, three small figures in long skirts climb to the top, and turn to face the mountains.')],
        },
      },
      {
        id: 'a29-01-s2',
        goal: 'Walk the scroll, from the three women to the present day.',
        hint: 'Follow the road along the scroll; each painting is a new generation.',
        check: 'walk:a29-scroll:generations',
        scene: {
          id: 'a29-01-hunters',
          lines: [
            N('The three women on the hill open their mouths, and sing. You don’t hear words, only something like a held breath let go.'),
            N('Where the sound goes, the ink brightens into a shining line. It runs along the mountain ridge and closes like a stitch.'),
            N('The demons hit the line and stop, and pace along it, gnashing, and cannot cross. The people in the villages get their colour back.'),
            N('A label in neat brushwork says the line is called the Honmoon. A voice held it up, and only voices can keep it up.'),
            N('You walk on, and the scroll walks with you. Three new hunters on the hill, then three more, generation after generation.'),
            N('Each three are painted holding something: a sword, a long blade, a fan of little knives. Each three are painted singing.'),
            N('And each three hope, the labels say, to sing so well that the line turns to gold and shuts for good, and the demons are gone forever.'),
            N('Nobody ever has. The last painting on the scroll is three girls on a stage, in boots, under lights that are not painted at all.'),
          ],
          choices: [
            {
              id: 'hum',
              label: 'Let your Nubbin hum along.',
              then: [N('Your Nubbin hums, flat and happy. The shining line wobbles very slightly, as if it has been tickled.', 'happy')],
            },
            {
              id: 'quiet',
              label: 'Listen without a sound.',
              then: [N('You listen. It is the kind of music that makes you stand up straighter without deciding to.')],
            },
          ],
        },
        done: {
          id: 'a29-01-hunters-done',
          lines: [N('The ink goes from black to neon pink, then electric blue: car horns, rain on hot pavement. You step off the scroll into a city at night.')],
        },
      },
    ],
    complete: {
      id: 'a29-01-complete',
      lines: [
        N('A man in a good suit and bad trainers is coming at you with two phones, a clipboard and a face that hasn’t slept.'),
        B('You! Are you the new runner? You’re the new runner. You’re late. It doesn’t matter. Hold these.'),
        N('He gives you a plastic bag of instant noodles, a box of light sticks, and a lanyard with your face on it, somehow.'),
        B('I’m Bobby. I manage Huntrix. Huntrix is the biggest group in Korea, and tonight is a sold-out show, and I am very calm.'),
        N('Your Nubbin climbs into the merchandise bag, settles among the T-shirts, and looks out like a passenger on a bus.'),
        B('Don’t touch the girls’ cases. Never touch the girls’ cases. Go, go, go.'),
      ],
    },
    rewards: [],
    sets: { 'a29-01': true },
    notes:
      'OPENING: the bright page is a painted poster; the scroll below it is ink on paper and must read clearly as an ' +
      'old painting (adviser: the scroll style should be Korean ink painting, sumukhwa, not Chinese or Japanese). The ' +
      'three first hunters wear hanbok of an early period; adviser to check. Their song is original wordless music ' +
      '(a sustained three-voice chord that becomes the page’s theme). Gwi-Ma is a red smudge only. ' +
      'SABLE (read when this quest starts): t45 → play ATLAS_A29_VARIANTS a29-01-sable-hid straight after ' +
      'a29-01-scroll; bonded → a29-01-sable-heel. Each sets a29-sable. none or t20: nothing plays. ' +
      'HAZEL (s24Done, read-only): play a29-01-margin-hazel straight after a29-01-complete if s24Done is set.',
  },

  // ---------------------------------------------------------------- A29-2
  {
    id: 'a29-02',
    code: 'A29-2',
    title: 'Huntrix',
    source: `${SRC}: the concert, and after`,
    audience: 'all',
    trigger: { where: WHERE, when: after('A29-1') },
    requires: ['A29-1'],
    speakers: [BOBBY, RUMI, MIRA, ZOEY],
    steps: [
      {
        id: 'a29-02-s1',
        goal: 'Get the merchandise to the stalls before the doors open.',
        hint: 'Carry the boxes through the backstage corridor to the arena foyer.',
        check: 'carry:a29-merch:arena',
        scene: {
          id: 'a29-02-backstage',
          lines: [
            N('Backstage is a corridor of black curtains, gaffer tape and people running with headsets on, all saying “copy” to nobody.'),
            N('Three girls are warming up in a doorway. One is doing scales, one is doing stretches, and one is eating a rice ball very fast.'),
            Z('Ooh, new runner. Hi! I’m Zoey. Is that a creature in the merch bag, or a very round T-shirt?', 'happy'),
            M('Mira. Don’t let Bobby see that. He’ll put it on a mug.'),
            N('The third girl stops her scales and smiles at you properly. She has a long purple plait and long sleeves, though the corridor is roasting.'),
            R('I’m Rumi. Thanks for coming tonight. Bobby forgets to say it, so I say it twice. Thanks.'),
            B('Runner! Merch! Foyer! The doors open in nine minutes!'),
          ],
          choices: [
            {
              id: 'wave',
              label: 'Let your Nubbin wave.',
              then: [Z('It waved. It waved at me. I’m keeping it.', 'happy'), M('You can’t keep the runner’s pet.')],
            },
            {
              id: 'nod',
              label: 'Nod and grab the boxes.',
              then: [R('A runner who runs. Bobby might cry.', 'happy')],
            },
          ],
        },
        done: {
          id: 'a29-02-backstage-done',
          lines: [N('The foyer is already a sea of light sticks, and someone nearly buys a T-shirt off your back. Your Nubbin is offered four snacks.')],
        },
      },
      {
        id: 'a29-02-s2',
        goal: 'Watch the show from the wings, out of everyone’s way.',
        hint: 'Stand by the side curtain, behind the yellow tape.',
        check: 'watch:a29-concert:wings',
        scene: {
          id: 'a29-02-show',
          lines: [
            N('The lights go down. The whole arena breathes in at once, thousands of light sticks held up like a field of little moons.'),
            N('Then Huntrix are on stage, and the sound hits you in the chest. It is loud, and bright, and very good.'),
            N('You don’t catch words. You catch the shape of it: three voices that fit like hands round a cup.'),
            N('Above the stage, above the roof, you see something nobody else is looking at. A faint line of light across the night sky, shimmering.'),
            N('It is the line from the scroll, the Honmoon. Each time the three of them hit a high note together, it brightens.'),
            N('In the third row a man’s face goes pale and blank for a moment. Then the chorus comes round, and he blinks and laughs and waves his light stick.'),
            B('Look at the numbers. Look at those faces. Look at me not crying.', 'soft'),
          ],
        },
        done: {
          id: 'a29-02-show-done',
          lines: [
            N('The last chord ends. The line in the sky hums like a struck glass, and holds.'),
            R('Bobby, tell the car to wait. We’ve got a thing.'),
          ],
        },
      },
      {
        id: 'a29-02-s3',
        goal: 'Carry the girls’ gear case to the car park.',
        hint: 'Bobby said never to touch it. Rumi just said to bring it.',
        check: 'carry:a29-gearcase:car-park',
        scene: {
          id: 'a29-02-fight',
          lines: [
            N('The case is long, black and heavy. Rumi said bring it, and Rumi seems to outrank Bobby in practice.'),
            N('Down in the empty car park, the strip lights flicker. Things are coming out of the shadows between the vans: grinning, too tall, all teeth.'),
            M('Demons. Three, four… six. Open the case, runner, and then stand very far back.'),
            N('Inside the case: a sword, a long-hafted blade taller than Mira, and a belt of small throwing knives, all faintly glowing.'),
            N('Rumi draws the sword, and Zoey catches the knives one-handed. Mira spins the long blade like a baton and looks bored, on purpose.'),
            N('Your Nubbin takes one look at the demons and dives head-first into a stage speaker that is waiting to be loaded.'),
            Z('Same, honestly.'),
            N('Then it is very fast, and very bright. The demons come apart into smoke and sparks, and the car park smells of burnt sugar.'),
          ],
        },
        done: {
          id: 'a29-02-fight-done',
          lines: [
            N('When it is over, your Nubbin climbs out of the speaker, stands on top of it, and puffs out its chest.'),
            Z('Yes. You. You did that. Hero of the car park.', 'happy'),
          ],
        },
      },
    ],
    complete: {
      id: 'a29-02-complete',
      lines: [
        N('Bobby comes down the ramp with three bottles of water and the face of a man who has decided not to ask.'),
        B('Car’s here. Runner, you didn’t see any of this. What did you see?'),
        Y('A really good show.'),
        B('Perfect answer. Here, have this, it’s broken and they’re throwing it out.', 'happy'),
        N('It is an old stage light, the size of a teapot, with a cracked pink filter. When you tap it, it still glows.'),
        R('Thanks for carrying. And for not running away. Most people do, the first time.', 'soft'),
      ],
    },
    rewards: [
      {
        id: 'a29-stage-light',
        kind: 'decor',
        label: 'Stage light',
        description: 'A small retired stage light with a cracked pink filter. Place it in the Grove; tap it to switch it on.',
      },
    ],
    sets: { 'a29-02': true },
    notes:
      'The concert is original wordless music only. NEVER put lyrics, a song title or a set list on screen; the ' +
      'stage’s video wall shows shapes and colours. The weapons: Rumi’s sword, Mira’s long-hafted blade (a ' +
      'woldo-style glaive) and Zoey’s throwing knives; adviser to check the Korean forms. The demons fade into smoke ' +
      'and sparks, nothing more. SABLE: if a29-sable = hid, play ATLAS_A29_VARIANTS a29-02-stage-hid straight after ' +
      'a29-02-show (under the stage).',
  },

  // ---------------------------------------------------------------- A29-3
  {
    id: 'a29-03',
    code: 'A29-3',
    title: 'Ramyun',
    source: `${SRC}: noodles at night`,
    audience: 'all',
    trigger: { where: WHERE, when: after('A29-2') },
    requires: ['A29-2'],
    speakers: [RUMI, MIRA, ZOEY],
    steps: [
      {
        id: 'a29-03-s1',
        goal: 'Fetch more instant noodles from the shop downstairs.',
        hint: 'The convenience store on the corner is open all night.',
        check: 'collect:a29-ramyun:store',
        scene: {
          id: 'a29-03-kitchen',
          lines: [
            N('Huntrix’s flat is high up, with a city view and a tiny kitchen. At two in the morning, every pan in it is full of noodles.'),
            Z('Rule of the house. You fight demons, you eat ramyun. You fight a lot of demons, you eat a lot of ramyun.'),
            M('We’re out. We are, terribly, out.'),
            N('Three faces turn to you, then to your Nubbin, then back to you. Your Nubbin can’t carry money.'),
            R('The shop on the corner. The spicy ones, the mild ones, and whatever is new. Zoey likes whatever is new.'),
            Z('I like whatever is new.', 'happy'),
          ],
          choices: [
            {
              id: 'go',
              label: 'Go at once.',
              then: [M('Look at that. Bobby hired someone with legs.')],
            },
            {
              id: 'list',
              label: 'Ask them to write it down.',
              then: [R('Spicy, mild, new. You’ll remember. It’s the most important list in Seoul.', 'happy')],
            },
          ],
        },
        done: {
          id: 'a29-03-kitchen-done',
          lines: [N('The shop is bright and humming. You come back with a bag of noodle cups, three triangle gimbap and a new flavour that is bright green.')],
        },
      },
      {
        id: 'a29-03-s2',
        goal: 'Eat with them, and pay attention.',
        hint: 'Sit at the low table by the window.',
        check: 'sit:a29-flat:table',
        scene: {
          id: 'a29-03-table',
          lines: [
            N('The four of you eat on the floor round a low table, with the city lights all down the window. Your Nubbin gets the bright green one.'),
            Z('Did you see the man in the third row? Crying, then laughing? That was us. We did that.', 'happy'),
            M('He was crying because a demon was eating him a bit, Zoey.'),
            Z('And then he was laughing. Because of us.'),
            N('Rumi laughs too, and halfway through the laugh her voice catches. A small crack, like a dry twig.'),
            N('She coughs it off and drinks her water. Mira looks at her, and Zoey looks at her noodles, very hard.'),
            R('Long night. That’s all.'),
            N('The flat is hot, the window shut against the traffic, and the fan only turns the warm air round. Rumi is still in long sleeves.'),
            N('She pulls them down over her hands while she eats. You notice it, and then you notice yourself noticing, and look at your bowl.', 'think'),
          ],
          choices: [
            {
              id: 'fan',
              label: 'Turn the fan towards her.',
              then: [R('Thanks. I’m fine. I always run cold.', 'soft'), N('It isn’t true, and she knows you know, and you both eat noodles.')],
            },
            {
              id: 'eat',
              label: 'Say nothing and keep eating.',
              then: [N('You eat, and Rumi eats. After a while she stops pulling at her sleeves, as if she has forgotten to.')],
            },
          ],
        },
        done: {
          id: 'a29-03-table-done',
          lines: [N('By three, Zoey is asleep with her chopsticks still in her hand. Mira takes them out, gently, and puts a cushion under her head.')],
        },
      },
    ],
    complete: {
      id: 'a29-03-complete',
      lines: [
        N('In the morning there is a present on the gear case, with a sticky note in Zoey’s round writing.'),
        N('It is an empty noodle cup, washed, cut down small, with a paper rim and a strap. A hat, exactly your Nubbin’s size.'),
        Z('Every hunter needs a helmet. That one is mostly soup-proof.', 'happy'),
        N('Your Nubbin puts it on and won’t take it off, not even to sleep.'),
      ],
    },
    rewards: [
      {
        id: 'a29-noodle-hat',
        kind: 'cosmetic',
        label: 'Noodle-cup hat',
        description: 'A tiny hat cut from a washed noodle cup, made by Zoey. Any Nubbin can wear it.',
      },
    ],
    sets: { 'a29-03': true },
    notes:
      'Food and the flat: adviser to check (late-night ramyun from a convenience store, triangle gimbap, eating on the ' +
      'floor at a low table). The heat and Rumi’s sleeves are the beat; draw the sleeves clearly. SABLE: if ' +
      'a29-sable = hid, play ATLAS_A29_VARIANTS a29-03-pans-hid straight after a29-03-kitchen-done (behind the pans).',
  },

  // ---------------------------------------------------------------- A29-4
  {
    id: 'a29-04',
    code: 'A29-4',
    title: 'Celine',
    source: `${SRC}: Rumi and the woman who raised her`,
    audience: 'all',
    trigger: { where: WHERE, when: after('A29-3') },
    requires: ['A29-3'],
    speakers: [RUMI, CELINE, BOBBY],
    steps: [
      {
        id: 'a29-04-s1',
        goal: 'Walk Rumi to Celine’s house and carry the fruit.',
        hint: 'Follow Rumi through the old lanes; carry the fruit box carefully.',
        check: 'escort:a29-rumi:celine-house',
        scene: {
          id: 'a29-04-lanes',
          lines: [
            B('Rumi’s visiting Celine. Go with her. Carry the fruit. Celine likes fruit, and doesn’t like me.'),
            N('The fruit is a box of Korean pears, each one wrapped in its own little foam net, like a pear in a jumper.'),
            N('Rumi takes you up through a quarter of old houses: tiled roofs with curling eaves, wooden gates, walls of pale stone.'),
            R('Celine was a hunter. Before us. When I was little she took me in, and trained me, and raised me. All of it.'),
            R('She taught me everything. How to hold a sword. How to hold a note. How to hold…', 'think'),
            N('She doesn’t finish. She tugs her sleeve down, though it is already down.'),
          ],
          choices: [
            {
              id: 'ask',
              label: '“How to hold what?”',
              then: [R('Myself. Together. You know.', 'soft'), N('She walks a bit faster, and you let her.')],
            },
            {
              id: 'pears',
              label: 'Ask about the pears in jumpers.',
              then: [R('So they don’t bruise. Everything in this country is wrapped. Including me, according to Mira.', 'happy')],
            },
          ],
        },
        done: {
          id: 'a29-04-lanes-done',
          lines: [N('Celine’s house is an old hanok round a courtyard, very neat. Rumi takes the pears, and asks you to wait outside the gate.')],
        },
      },
      {
        id: 'a29-04-s2',
        goal: 'Wait outside the gate.',
        hint: 'Sit on the step by the wall. The paper doors aren’t thick.',
        check: 'wait:a29-celine:gate',
        scene: {
          id: 'a29-04-gate',
          lines: [
            N('You sit on the stone step outside. Your Nubbin, in its noodle hat, watches a sparrow on the wall.'),
            N('The old doors are wood and paper. You don’t mean to listen, but you hear enough anyway.'),
            C('Let me see.'),
            N('A pause. A rustle of a sleeve going up.'),
            C('They’ve spread. Up past the elbow now.', 'sad'),
            R('I know. I keep them covered. Nobody’s seen. Nobody will.'),
            C('Good. A hunter can’t be what she hunts. If they saw, they wouldn’t understand. Keep them hidden.'),
            R('When we make the Honmoon gold, they’ll go. You said. When it’s sealed, they’ll go, and then I’ll be… right.'),
            C('Then work harder. Sing better. Don’t let anyone in.', 'soft'),
          ],
          choices: [
            {
              id: 'away',
              label: 'Move further from the gate.',
              then: [N('You get up and walk to the end of the wall, out of earshot. It is too late, but it is something.')],
            },
            {
              id: 'stay',
              label: 'Stay where you are.',
              then: [N('You stay. It seems worse, somehow, to leave her out here alone when she comes out.')],
            },
            {
              id: 'nubbin',
              label: 'Show your Nubbin the sparrow.',
              then: [N('You point out the sparrow. Your Nubbin chirps at it, and the sparrow chirps back, and you listen to that instead.')],
            },
          ],
        },
        done: {
          id: 'a29-04-gate-done',
          lines: [N('Celine’s voice drops low. Then the gate opens and Rumi comes out, smiling, with her sleeves pulled down to her knuckles.')],
        },
      },
    ],
    complete: {
      id: 'a29-04-complete',
      lines: [
        R('She liked the pears.', 'happy'),
        N('She walks back down the lane quickly. You walk beside her and say nothing about anything.'),
        R('We’re close, you know. Huntrix. A few more shows like last night, and the Honmoon will turn to gold.'),
        R('And then it’ll be over. All of it.', 'soft'),
        N('She says it the way people say they’ll be happy when the weather turns.'),
      ],
    },
    rewards: [],
    sets: { 'a29-04': true },
    notes:
      'Celine’s house is a hanok round a courtyard (adviser: a tidy modern-lived hanok, as in Bukchon). We hear the ' +
      'visit through the doors; the marks are never seen here, only described. Celine is strict and frightened for ' +
      'Rumi, not cruel. Gift of fruit: Korean pears in foam nets (adviser).',
  },

  // ---------------------------------------------------------------- A29-5
  {
    id: 'a29-05',
    code: 'A29-5',
    title: 'The Saja Boys',
    source: `${SRC}: the rival band`,
    audience: 'all',
    trigger: { where: WHERE, when: after('A29-4') },
    requires: ['A29-4'],
    speakers: [BOBBY, ZOEY, MIRA, FAN],
    steps: [
      {
        id: 'a29-05-s1',
        goal: 'Watch the new band’s debut on the big screens.',
        hint: 'The giant screen over the crossing shows the debut at eight.',
        check: 'watch:a29-saja:debut',
        scene: {
          id: 'a29-05-debut',
          lines: [
            N('At eight o’clock every big screen in the shopping street goes black at once. Then five boys walk out of the dark.'),
            N('They wear long black coats, and wide-brimmed hats of fine black horsehair, tied under the chin. Gat, the old kind.'),
            N('The leader looks straight down the camera, and half the street stops walking. He is called Jinu, the screen says.'),
            N('Their music is smooth and catchy, and it goes into your ear like warm water. You find your foot is tapping and stop it.'),
            F('Oh. Oh, no. Who are they? Why have I never heard of them? Why do I love them?', 'shock'),
            B('Who are they? Where did they come from? Nobody debuts at the top of the chart. Nobody!', 'angry'),
            N('Bobby is refreshing the charts on both phones. The Saja Boys are climbing, one place a minute.'),
          ],
          choices: [
            {
              id: 'listen',
              label: 'Keep watching.',
              then: [N('You keep watching, and the longer you watch, the harder it is to look away. That is interesting, and not in a good way.', 'think')],
            },
            {
              id: 'bobby',
              label: 'Calm Bobby down.',
              then: [B('I am calm. This is my calm face. This is what my calm face looks like now.', 'angry')],
            },
          ],
        },
        done: {
          id: 'a29-05-debut-done',
          lines: [N('High above the city, where only you seem to look, the line of the Honmoon flickers like a bulb about to go.')],
        },
      },
      {
        id: 'a29-05-s2',
        goal: 'Look closely at the crowd under the screens.',
        hint: 'Walk among the people watching, and look at their faces.',
        check: 'inspect:a29-crowd:crossing',
        scene: {
          id: 'a29-05-crowd',
          lines: [
            N('You walk among the people under the screens. They are smiling, mostly, and some are singing along to words you can’t make out.'),
            N('But their eyes are wrong. A bit blank, a bit far, like people who have stood too long in the sun.'),
            N('A faint shimmer is drifting up off them, like breath on a cold day, towards the screen and the boy on it.'),
            N('Zoey and Mira come through the crowd in caps and masks. Zoey stops by you and looks up at the hats on the screen.'),
            Z('Jeoseung saja. That’s what they’re dressed as. Black coat, black gat. My grandma’s stories.'),
            Z('The saja are the ones who walk you to the other side when it’s your time. They’re not the bad guys. They’re just… doing their job.'),
            M('Which is a strange costume for a boy band.'),
            Z('Unless it isn’t a costume. Unless they’re wearing it because it scares us.', 'think'),
          ],
          choices: [
            {
              id: 'shimmer',
              label: 'Tell them about the shimmer.',
              then: [M('You can see that? Huh. Good eyes, runner.'), N('Mira looks at you a little longer than before, and then at the screen, and her hand goes to her back, where the blade isn’t.')],
            },
            {
              id: 'quiet',
              label: 'Keep it to yourself for now.',
              then: [N('You keep it to yourself. Mira sees it anyway, a moment later, and swears very quietly into her mask.')],
            },
          ],
        },
        done: {
          id: 'a29-05-crowd-done',
          lines: [N('The song ends, the crowd wakes up a bit, and the shimmer stops. The Honmoon flickers, and holds.')],
        },
      },
    ],
    complete: {
      id: 'a29-05-complete',
      lines: [
        Z('I’m telling Rumi.'),
        M('Rumi’s at the studio. Rumi’s been at the studio since six. Rumi’s voice is going, and she won’t say.', 'sad'),
        B('I don’t know what you two are muttering about, but I need a hit, and I need it yesterday.'),
        N('Your Nubbin looks up at the screen, at the boy in the hat, and pulls the noodle cup lower over its eyes.'),
      ],
    },
    rewards: [],
    sets: { 'a29-05': true },
    notes:
      'CARE: Zoey’s explanation of the jeoseung saja is deliberate. In Korean folk belief they escort the dead and are ' +
      'not evil; the demons are wearing their look. Advisers to check her wording. Draw the gat accurately (fine black ' +
      'horsehair and bamboo, chin strings). The Saja Boys’ music is original and wordless in the mix: the fans may be ' +
      'singing, but no words are ever written or subtitled. The shimmer leaving the crowd is soft and faint, never ' +
      'distressing. Bobby’s phone charts must not show any real song title.',
  },

  // ---------------------------------------------------------------- A29-6
  {
    id: 'a29-06',
    code: 'A29-6',
    title: 'The Marks',
    source: `${SRC}: the first fight with the Saja Boys`,
    audience: 'all',
    trigger: { where: WHERE, when: after('A29-5') },
    requires: ['A29-5'],
    speakers: [RUMI, MIRA, ZOEY, JINU],
    steps: [
      {
        id: 'a29-06-s1',
        goal: 'Carry the gear case to the empty television studio.',
        hint: 'The music-show studio is dark after midnight; take the loading door.',
        check: 'carry:a29-gearcase:studio',
        scene: {
          id: 'a29-06-studio',
          lines: [
            N('After the music show’s recording, when the studio is empty, the Saja Boys stay behind. So do Huntrix, in the dark.'),
            M('We followed one of them home. Except “home” was a crack in the air behind a vending machine. They’re demons, Rumi.'),
            R('All five?'),
            Z('All five. Hats and all.'),
            N('Rumi’s face goes very still. Then she nods, once, and holds out her hand to you without looking, and you give her the sword.'),
            R('Runner, stay by the door. If it goes badly, run, and tell Bobby we said sorry about the studio.'),
          ],
          choices: [
            {
              id: 'door',
              label: 'Stay by the door.',
              then: [N('You stay by the door. Your Nubbin, in the merch bag, peeks out with one eye.')],
            },
            {
              id: 'case',
              label: 'Stay by the gear case instead.',
              then: [N('You stay by the open case, where the spare knives are. Zoey sees, and gives you a thumbs up, and doesn’t send you back.')],
            },
          ],
        },
        done: {
          id: 'a29-06-studio-done',
          lines: [N('The studio lights come on all at once, every colour. Five boys in black coats are standing on the set, as if they’ve been waiting.')],
        },
      },
      {
        id: 'a29-06-s2',
        goal: 'Watch the fight from behind the camera crane.',
        hint: 'Keep low behind the crane. Don’t help unless someone needs the case.',
        check: 'watch:a29-fight:studio',
        scene: {
          id: 'a29-06-fight',
          lines: [
            N('It is a fight like a dance number: fast, bright, a lot of spinning. The boys are quick, and they laugh while they fight.'),
            N('Zoey’s knives go thunk into a set wall. Mira’s blade sweeps a whole row of fake flowers off a stand.'),
            N('Rumi and Jinu end up face to face on the stage stairs. Her sword is at his throat, and his hand has caught her wrist.'),
            N('Her sleeve has ridden up. On her wrist and forearm there are marks: curling patterns, violet and silver, like ink in water.'),
            N('Jinu sees them, and his eyes go wide. For a moment neither of them moves at all.', 'shock'),
            N('Then Mira shouts, coming up the stairs. And Jinu, very quickly, pulls Rumi’s sleeve down over the marks, and lets her go.'),
            J('Another time, hunter.'),
            N('He steps back into a shadow, and is not there. The other boys go with him, in a gust of cold air and a smell of old smoke.'),
          ],
        },
        done: {
          id: 'a29-06-fight-done',
          lines: [
            Z('Did he… did he just let you go? Why would he do that?'),
            R('I don’t know.', 'think'),
          ],
        },
      },
      {
        id: 'a29-06-s3',
        goal: 'Take the water bottles to the dressing room.',
        hint: 'The dressing room is down the corridor, past the make-up chairs.',
        check: 'deliver:a29-water:dressing-room',
        scene: {
          id: 'a29-06-sleeve',
          lines: [
            N('In the dressing room, Mira and Zoey are arguing in the shower block about who broke the flower stand.'),
            N('Rumi is at the mirror with her back to the door, catching her breath. She has pushed her sleeve up to cool her arm.'),
            N('The marks go from her wrist almost to her shoulder now. In the mirror light they shimmer, violet and silver.'),
            N('She looks up, and sees you in the mirror, holding three bottles of water. She doesn’t move.', 'shock'),
            N('You are the only one who has seen. Mira and Zoey are still arguing behind the door.'),
            N('Your own jacket is on the chair beside you, where you dropped it to carry the case.'),
          ],
          choices: [
            {
              id: 'jacket',
              label: 'Hand her the jacket, and say nothing.',
              set: { 'a29-sleeve': 'jacket' },
              then: [
                N('You put down the water and hold out the jacket. She takes it and puts it on, fast, and zips it to the chin.'),
                R('Thank you.', 'soft'),
                N('She doesn’t say for what. You don’t ask.'),
              ],
            },
            {
              id: 'saw',
              label: '“I saw. It’s all right.”',
              set: { 'a29-sleeve': 'saw' },
              then: [
                Y('I saw. It’s all right.'),
                N('She looks at you for a long time in the mirror. Then she pulls her sleeve down, slowly, not fast.'),
                R('You don’t know what it is.', 'sad'),
                Y('No. It’s still all right.'),
              ],
            },
            {
              id: 'away',
              label: 'Look away, and let her decide whether you saw.',
              set: { 'a29-sleeve': 'away' },
              then: [
                N('You look down at the bottles in your arms, as if they are very interesting, and put them on the counter one by one.'),
                N('When you look up again her sleeve is down, and she is smiling at the mirror, and neither of you says anything.'),
              ],
            },
          ],
        },
      },
    ],
    complete: {
      id: 'a29-06-complete',
      lines: [
        N('Mira and Zoey come out with wet hair, still arguing. Rumi laughs at them in exactly the right places.'),
        M('Why did he let you go, Rumi? Seriously.'),
        R('Maybe he was scared of you.', 'happy'),
        N('Mira likes that answer so much that she doesn’t notice it isn’t one.'),
      ],
    },
    rewards: [],
    sets: { 'a29-06': true },
    notes:
      'SIGNATURE CHOICE (a29-06-sleeve sets a29-sleeve = jacket | saw | away). It pays off in A29-12 (a29-12-find and ' +
      'its variants), A29-14 (a29-14-song-done and its variants) and A29-16 (a29-16-complete and its variants). ' +
      'The marks: violet and silver patterns like ink in water, beautiful, never sore or ugly (care note). The fight ' +
      'is choreography, not injury: no one is cut. The boys vanish into shadow.',
  },

  // ---------------------------------------------------------------- A29-7
  {
    id: 'a29-07',
    code: 'A29-7',
    title: 'Derpy and Sussie',
    source: `${SRC}: the tiger and the magpie`,
    audience: 'all',
    trigger: { where: WHERE, when: after('A29-6') },
    requires: ['A29-6'],
    speakers: [RUMI],
    steps: [
      {
        id: 'a29-07-s1',
        goal: 'Find out what is knocking over the bins behind the flats.',
        hint: 'Look in the alley behind the building, after dark.',
        check: 'find:a29-derpy:alley',
        scene: {
          id: 'a29-07-alley',
          lines: [
            N('Something is knocking over the bins behind Huntrix’s building, every night, and then looking embarrassed about it.'),
            N('You go down with a torch. In the alley there is a tiger: a big one, blue as a bruise, with a wide silly grin and crossed eyes.'),
            N('On the tiger’s head stands a magpie, black and white, with a long tail and a beady, knowing eye. She looks at you sideways.'),
            N('They are not from here. You can tell by the faint smoky shimmer round their edges, the same as the boys in black coats.'),
            N('Your Nubbin climbs out of the merch bag before you can stop it, walks up to the tiger and holds out the last of its biscuit.'),
            N('The tiger looks at the biscuit, and at your Nubbin. Then he lies down flat on his belly, very carefully, and purrs like a kettle.', 'happy'),
          ],
          choices: [
            {
              id: 'pat',
              label: 'Scratch the tiger behind the ear.',
              then: [N('He leans into your hand so hard he falls over sideways. The magpie hops off his head just in time, and gives you a look.')],
            },
            {
              id: 'bow',
              label: 'Nod politely to the magpie.',
              then: [N('The magpie looks at you, decides you will do, and nods back. Her long tail bobs.')],
            },
          ],
        },
        done: {
          id: 'a29-07-alley-done',
          lines: [N('Your Nubbin climbs up the tiger’s nose and sits on his head where the magpie was. The tiger goes cross-eyed trying to see it, and purrs louder.')],
        },
      },
      {
        id: 'a29-07-s2',
        goal: 'Deliver the note the magpie brought. Don’t read it.',
        hint: 'Rumi is on the roof. Take the note up the fire stairs.',
        check: 'deliver:a29-note:roof',
        scene: {
          id: 'a29-07-note',
          lines: [
            N('The magpie hops onto the bin lid and drops a folded note in front of you. On the outside, in a careful old hand, it says “Rumi”.'),
            N('The tiger, Derpy, as you will learn, has a name tag round his neck. The magpie is called Sussie, by her tag, and she is in charge.'),
            N('You know who they belong to. The note smells faintly of old smoke, like the studio did.'),
            N('Sussie pecks the note towards you, then taps the fire stairs with her beak. Up: Rumi’s on the roof.'),
            N('It is a short walk up nine flights. You are absolutely not going to read the note, because it isn’t yours.'),
            N('It is folded only once.', 'think'),
          ],
          choices: [
            {
              id: 'read',
              label: 'Read it. Just the first line.',
              then: [
                N('“Your friend with the knives pinned my coat to a wall, my best one. Meet me where the old wall goes up the hill.”'),
                N('You fold it back exactly as it was, feeling awful. You also want to know about the coat.'),
              ],
            },
            {
              id: 'dont',
              label: 'Don’t read it.',
              then: [
                N('You don’t read it. You hold it face down all the way up, at arm’s length, like a hot plate.'),
                N('At the top your Nubbin, who can’t read, unfolds it, looks at it upside down with great interest, and folds it back.'),
              ],
            },
          ],
        },
        done: {
          id: 'a29-07-note-done',
          lines: [N('Rumi is alone on the roof, in a hoodie, looking at the line of the Honmoon over the city. It flickers more than it used to.')],
        },
      },
    ],
    complete: {
      id: 'a29-07-complete',
      lines: [
        N('You hand her the note. She sees the writing, and opens it with her back to you.'),
        R('Did you read it?'),
        N('You don’t answer fast enough, and your Nubbin finds its own feet very interesting. She laughs, the first real laugh in days.', 'happy'),
        R('Of course. One of you did. Don’t tell Mira. Don’t tell Zoey. Don’t tell the tiger.'),
        N('Down in the alley, Derpy rolls onto his back, and Sussie sits on his tummy, and they both look up at the roof.'),
      ],
    },
    rewards: [],
    sets: { 'a29-07': true },
    notes:
      'CARE: Derpy and Sussie are drawn in the spirit of the Korean folk painting of the tiger and magpie (kkachi ' +
      'horangi): the tiger comic and a bit foolish, the magpie bright and knowing, bringer of news. Never menacing. ' +
      'They never speak. The note text is our own. The choice is comic either way; it sets no flag.',
  },

  // ---------------------------------------------------------------- A29-8
  {
    id: 'a29-08',
    code: 'A29-8',
    title: 'The Voices',
    source: `${SRC}: Jinu’s story`,
    audience: 'all',
    trigger: { where: WHERE, when: after('A29-7') },
    requires: ['A29-7'],
    speakers: [RUMI, JINU],
    steps: [
      {
        id: 'a29-08-s1',
        goal: 'Keep watch at the bottom of the old city wall.',
        hint: 'Sit at the foot of the steps where the wall climbs the hill.',
        check: 'wait:a29-wall:steps',
        scene: {
          id: 'a29-08-watch',
          lines: [
            R('I need someone to stand at the bottom of the steps and look normal. Can you look normal?'),
            N('You look at your Nubbin, in its noodle hat, and at yourself. You say you can try.'),
            N('The old city wall climbs the hill in big grey stones, with lamps along it, and the whole of the city below like a spilt jewel box.'),
            N('Halfway up, Jinu is sitting on the wall in his black coat, with no hat. Derpy is asleep across his feet.'),
            N('Rumi goes up to him with her hands in her pockets. You stay at the bottom, looking normal.'),
            N('Sussie lands beside you on the bottom step, and looks normal too, in her own way.'),
          ],
          choices: [
            {
              id: 'normal',
              label: 'Look normal.',
              then: [
                N('You look normal so hard that a bus stops for you. You wave it on, and the driver looks hurt.'),
                N('Then a grandmother asks if you are lost, and gives your Nubbin a sweet. Your Nubbin looks normal back at her.'),
              ],
            },
            {
              id: 'up',
              label: 'Edge a few steps up.',
              then: [N('You edge up a few steps. Sussie hops up beside you, step for step, as if this was her idea.')],
            },
          ],
        },
      },
      {
        id: 'a29-08-s2',
        goal: 'Listen to what Jinu tells her.',
        hint: 'You can hear them from the lamp at the bend in the wall.',
        check: 'watch:a29-jinu:wall',
        scene: {
          id: 'a29-08-story',
          lines: [
            J('You have voices too. I can tell. Not the singing kind. The other kind, that talk in your head at night.'),
            R('Everyone has those.'),
            J('His are louder. Gwi-Ma’s. That’s how he works. He finds the thing you’re ashamed of, and he talks to it until it’s all you can hear.', 'sad'),
            R('And you? What’s yours?'),
            J('I was human once. Four hundred years ago. A poor musician with a lute and a hole in his shoe, playing in market squares.'),
            J('My family were hungry, and I was no use to them. And he came, and offered me a voice that everyone would love.'),
            J('So I said yes, to feed them. And then he took me, and I never saw them again.', 'soft'),
            N('Rumi is quiet. Then she reaches out, and nearly touches his sleeve, and doesn’t.'),
            N('From down the wall, you can see Jinu’s face better than she can. When he says “to feed them”, he looks away.', 'think'),
          ],
          choices: [
            {
              id: 'notice',
              label: 'Notice it, and keep it.',
              then: [N('You notice it, and you keep it, because it is not your story to tell. But you remember the way he looked away.')],
            },
            {
              id: 'kind',
              label: 'Decide it doesn’t matter tonight.',
              then: [N('Maybe it doesn’t matter; everyone tells their own story a bit kinder than it was. You hope that’s all it is.')],
            },
          ],
        },
        done: {
          id: 'a29-08-story-done',
          lines: [N('Rumi comes down the steps alone. Her voice, when she says “let’s go”, is rough at the edges, but it’s there.')],
        },
      },
    ],
    complete: {
      id: 'a29-08-complete',
      lines: [
        R('He’s a demon. I know he’s a demon. I’m not stupid.'),
        R('But he knows about the voices. Nobody else knows about the voices.', 'soft'),
        N('Halfway home she stops at a street stall and buys two fish-shaped pastries, and gives one to your Nubbin without asking.'),
        N('Your Nubbin eats the tail first. Rumi watches it and doesn’t say anything else all the way home.'),
      ],
    },
    rewards: [],
    sets: { 'a29-08': true },
    notes:
      'The wall is Seoul’s old city wall at night (Naksan section, with the city below); adviser to check. Jinu’s ' +
      'story here is the kinder, false version (he says he went to feed his family). The truth comes in A29-12. Draw ' +
      'him looking away on “to feed them”. The pastry is bungeoppang (fish-shaped, filled with red bean); adviser.',
  },

  // ---------------------------------------------------------------- A29-9
  {
    id: 'a29-09',
    code: 'A29-9',
    title: 'The Harsh Song',
    source: `${SRC}: the argument`,
    audience: 'all',
    trigger: { where: WHERE, when: after('A29-8') },
    requires: ['A29-8'],
    speakers: [RUMI, MIRA, ZOEY],
    steps: [
      {
        id: 'a29-09-s1',
        goal: 'Make tea while the three of them work.',
        hint: 'Use the kettle in the studio kitchen; barley tea is in the tin.',
        check: 'craft:a29-tea:studio-kitchen',
        scene: {
          id: 'a29-09-studio',
          lines: [
            N('The rehearsal studio has egg-box foam on every wall and a keyboard with a coffee ring on it. Mira and Zoey have been here all night.'),
            N('Taped to the keyboard is a bill from the TV studio. It says FLOWER STAND, underlined twice.'),
            N('Mira and Zoey both pretend not to see it. It is the last thing they agree on all night.'),
            Z('We’ve got it. The thing that brings them down. A new song, all about them. What they really are.'),
            M('We call them out. In front of everyone. Every fan who loves those boys hears exactly what they are.'),
            N('Zoey plays it on the keyboard: a hard, bright, stabbing tune, all corners. It is very catchy, and quite cruel.'),
            N('Rumi listens with her arms folded and her sleeves down. She doesn’t say anything for a long time.', 'think'),
            M('Runner, tea. This is going to be a long one.'),
          ],
          choices: [
            {
              id: 'barley',
              label: 'Make barley tea.',
              then: [N('You make boricha: roasted barley, toasty and mild. The studio starts to smell like a bakery, which helps a bit.')],
            },
            {
              id: 'strong',
              label: 'Make it very strong.',
              then: [N('You make it very strong. Mira looks at the colour of it and nods, as one serious person to another.')],
            },
          ],
        },
        done: {
          id: 'a29-09-studio-done',
          lines: [N('By the time the kettle clicks off, the music has stopped and the voices have started.')],
        },
      },
      {
        id: 'a29-09-s2',
        goal: 'Give out the tea. Take nobody’s side out loud.',
        hint: 'Put a cup by each of them. You don’t have to say anything.',
        check: 'give:a29-tea:three',
        scene: {
          id: 'a29-09-argument',
          lines: [
            R('It’s mean. It’s really mean. It’s not who we are.'),
            Z('They’re demons, Rumi! They’re eating our fans! Who cares if it’s mean?', 'angry'),
            R('I care. Not everything that’s not human is the same. Not everyone who’s wrong is wrong all the way through.'),
            M('Listen to yourself. You sound like you’re on their side.', 'angry'),
            N('That lands. Rumi pulls her sleeves down over her hands, and her voice, when it comes, cracks right in the middle.'),
            R('I’m on our side. I’m always on our side.', 'sad'),
            N('Nobody says anything, and the keyboard hums. You are standing in the middle of the room holding three cups of tea.'),
          ],
          choices: [
            {
              id: 'rumi',
              label: 'Give Rumi hers first.',
              then: [N('You give Rumi her cup first, and Mira’s mouth goes thin. Then you give Mira hers, and Zoey hers, and say nothing.')],
            },
            {
              id: 'order',
              label: 'Put the cups down all at once, in a row.',
              then: [N('You put all three down at once, in a row on the keyboard lid. Zoey snorts, despite herself: it’s very diplomatic.')],
            },
            {
              id: 'zoey',
              label: 'Give Zoey hers first; she’s the youngest.',
              then: [N('You give Zoey hers first. She holds it in both hands and looks at the floor, suddenly young, and the room loosens a little.')],
            },
          ],
        },
      },
    ],
    complete: {
      id: 'a29-09-complete',
      lines: [
        N('They drink the tea. They don’t make up, and they don’t fight any more either.'),
        Z('We’re doing the song. At the Idol Awards. It’s a vote, Rumi, and it’s two against one.', 'sad'),
        R('Then it’s two against one.'),
        N('Rumi takes her cup to the sink, and washes it, and dries it, and puts it away, and leaves.'),
        M('Thanks for the tea, runner. Sorry you had to hear that.', 'soft'),
      ],
    },
    rewards: [],
    sets: { 'a29-09': true },
    notes:
      'THE HARSH SONG has no name, no title card and no words. Zoey plays its tune on a keyboard: original music, ' +
      'hard and catchy. NEVER the film’s song or its title. The tea is boricha (roasted barley tea); adviser. The ' +
      'choice changes only the next line; the Keeper takes no side out loud.',
  },

  // ---------------------------------------------------------------- A29-10
  {
    id: 'a29-10',
    code: 'A29-10',
    title: 'The Deal',
    source: `${SRC}: Rumi’s bargain with Jinu`,
    audience: 'all',
    trigger: { where: WHERE, when: after('A29-9') },
    requires: ['A29-9'],
    speakers: [RUMI, JINU, GWIMA],
    steps: [
      {
        id: 'a29-10-s1',
        goal: 'Hold the umbrella while Rumi waits on the wall.',
        hint: 'It’s raining. Go up the wall steps with the umbrella.',
        check: 'carry:a29-umbrella:city-wall',
        scene: {
          id: 'a29-10-rain',
          lines: [
            N('It is raining over the city, a warm summer rain that makes the lamps along the old wall look like they’re melting.'),
            R('Come with me. If I go alone I’ll talk myself out of it.'),
            N('You hold the umbrella. Your Nubbin sits on your shoulder, in its noodle hat, which the rain drums on like a little roof.'),
            N('Jinu is on the wall already. Derpy is sitting beside him getting soaked, and doesn’t seem to mind.'),
            R('I came to offer you something. A bargain.'),
            J('Hunters don’t bargain with demons.'),
            R('This one does.'),
          ],
          choices: [
            {
              id: 'cover',
              label: 'Hold the umbrella over Rumi.',
              then: [N('You hold it over Rumi, and get wet down one side. She notices, and steps closer so it covers both of you.')],
            },
            {
              id: 'derpy',
              label: 'Hold it over Derpy.',
              then: [N('You hold it over the tiger. He looks up at it, astonished, as if nobody has ever done this, and purrs like a kettle on the boil.', 'happy')],
            },
          ],
        },
      },
      {
        id: 'a29-10-s2',
        goal: 'Hear the bargain.',
        hint: 'Stay by them under the lamp.',
        check: 'watch:a29-deal:wall',
        scene: {
          id: 'a29-10-deal',
          lines: [
            R('The Idol Awards. Help us win. Stop your band, and let us sing, and the Honmoon turns to gold and seals for good.'),
            R('And when it does, you don’t go back down with the others. You stay here. In the world. I’ll make sure.'),
            J('Why would you do that for me?'),
            R('Because you hid my marks. You didn’t have to.', 'soft'),
            N('She says it plainly, and her voice doesn’t crack at all. You hear it, and so does she: clear, the way it was on the first night.'),
            N('Jinu hears it too. He looks at her for a long time, and the rain runs off his hair.'),
            J('All right. A deal.'),
          ],
          choices: [
            {
              id: 'shake',
              label: 'Watch them shake on it.',
              then: [N('They shake hands, carefully, a hunter and a demon. Derpy puts his big wet paw on top of both their hands.')],
            },
            {
              id: 'voice',
              label: 'Notice her voice.',
              then: [N('Her voice is whole, and you want to say so, and don’t. Some things are better noticed than announced.', 'soft')],
            },
          ],
        },
      },
      {
        id: 'a29-10-s3',
        goal: 'Look at what is wrong with Jinu.',
        hint: 'After Rumi goes, go back up to the lamp.',
        check: 'inspect:a29-jinu:lamp',
        scene: {
          id: 'a29-10-call',
          lines: [
            N('Rumi goes down the steps, lighter than she came up. You go back for the umbrella you left leaning on the wall.'),
            N('Jinu is still there. He has a hand pressed flat on the stones, and he is shaking.'),
            N('Under the lamp his shadow is the wrong size. It stretches all the way down the hill, and at the end of it there is a red glow.'),
            G('A deal with a hunter. How sweet.'),
            G('Shall I tell her about your mother? Your little sister? How they waited for you, and you didn’t come?'),
            J('Don’t.', 'sad'),
            G('Then remember who you belong to, little musician. Bring her to me, and you’ll never hear their voices again.'),
            N('The shadow snaps back to its right size. Jinu sees you, and the umbrella, and puts a finger to his lips.'),
          ],
        },
      },
    ],
    complete: {
      id: 'a29-10-complete',
      lines: [
        J('You didn’t hear that.'),
        N('You don’t say anything. You hand him the umbrella, because he hasn’t got one.'),
        N('He holds it like nobody has handed him anything in four hundred years. Then he and Derpy walk off into the rain under one umbrella, Derpy entirely outside it and perfectly content.'),
        N('Your Nubbin watches them go, and pulls its hat down, and sneezes.'),
      ],
    },
    rewards: [],
    sets: { 'a29-10': true },
    notes:
      'Gwi-Ma is a voice in the shadow and a red glow at the end of it. Keep it slow and quiet, not loud or jumpy. ' +
      'The Keeper overhears but has no way to tell Rumi without breaking Jinu’s story; the script never forces the ' +
      'Keeper to keep or tell it, and there is no choice that matters here by design. The deal’s seal is called ' +
      '“gold”; never use the film’s word for it (see header).',
  },

  // ---------------------------------------------------------------- A29-11
  {
    id: 'a29-11',
    code: 'A29-11',
    title: 'The Idol Awards',
    source: `${SRC}: the awards night`,
    audience: 'all',
    trigger: { where: WHERE, when: after('A29-10') },
    requires: ['A29-10'],
    speakers: [BOBBY, MIRA, ZOEY, RUMI],
    steps: [
      {
        id: 'a29-11-s1',
        goal: 'Get the costumes to the dressing room in the backstage chaos.',
        hint: 'Carry the garment bags through the crowded corridors.',
        check: 'carry:a29-costumes:backstage',
        scene: {
          id: 'a29-11-backstage',
          lines: [
            N('Backstage at the Idol Awards is ten times the arena: every band in Korea, every stylist, every runner, in one corridor.'),
            B('Costumes! Dressing room four! If you see a Saja Boy, don’t look at him, don’t speak to him, don’t give him our snacks!'),
            N('You carry three garment bags over your head through the crush. Your Nubbin rides on top of the bags like a lookout.'),
            N('A boy band in silver suits squeezes past, all apologising at once. Somebody’s hairspray goes off like a fog machine.'),
            N('Halfway down the corridor, two stagehands in caps stop Mira and Zoey and say something about a problem with the lights.'),
            N('Mira and Zoey follow them round a corner. Your Nubbin turns right round on the bags to watch them go, and its crown goes stiff.', 'think'),
          ],
          choices: [
            {
              id: 'follow',
              label: 'Try to follow them.',
              then: [N('You try. A man with a rack of sequinned jackets cuts across you, and by the time he’s past, the corner is empty.')],
            },
            {
              id: 'bobby',
              label: 'Tell Bobby.',
              then: [B('Lights? Fine! Lights are important! Costumes are also important! Go!'), N('He isn’t listening. Nobody is listening tonight.')],
            },
          ],
        },
        done: {
          id: 'a29-11-backstage-done',
          lines: [N('Two minutes later, Mira and Zoey come back down the corridor, smiling. They walk past you without a word, and their eyes are too bright.')],
        },
      },
      {
        id: 'a29-11-s2',
        goal: 'Watch Huntrix’s set on the backstage monitor.',
        hint: 'The monitor by the stage door shows the live feed.',
        check: 'watch:a29-monitor:stage-door',
        scene: {
          id: 'a29-11-monitor',
          lines: [
            N('On the monitor, Huntrix walk out to a roar, Rumi in the middle. Mira and Zoey are on either side of her, and they don’t look at her.'),
            N('The opening chords are wrong: it isn’t the song they rehearsed. It’s the harsh one, the cruel one, all corners.'),
            N('Rumi falters, and looks left and right. The two girls beside her are singing it at her, not with her.', 'shock'),
            N('Then one of them grabs Rumi’s arm, and with one long tear of fabric, rips her sleeve away from wrist to shoulder.'),
            N('The cameras swing in. The marks are on every screen in the hall, on every phone in the city, violet and silver and huge.'),
            N('The crowd goes very quiet. Then it starts to mutter, and the mutter has a hard edge.'),
            N('On the monitor, “Mira” turns to the camera and smiles, with too many teeth. It isn’t Mira, and it never was.', 'shock'),
          ],
        },
        done: {
          id: 'a29-11-monitor-done',
          lines: [N('Above the hall, the Honmoon tears like wet paper. The lights all over the city flicker at once.')],
        },
      },
      {
        id: 'a29-11-s3',
        goal: 'Find the real Mira and Zoey.',
        hint: 'Try the doors along the service corridor, where the stagehands took them.',
        check: 'find:a29-girls:store-room',
        scene: {
          id: 'a29-11-store',
          lines: [
            N('You run. Back down the corridor, round the corner, into a service passage that smells of paint and old sandwiches.'),
            N('Door after door: mops, cables, chairs. Your Nubbin jumps off the bags and runs ahead, sniffing at the gaps under the doors.'),
            N('At the last door it stops, and puts both paws on it, and looks back at you.'),
            N('Inside, in the dark among the folded tables, Mira and Zoey are tied back to back with gaffer tape, furious and trying to shout.'),
            M('Get this off. Get it off, get it off. Who’s on stage? Who is on stage?', 'angry'),
            Z('They had our faces. They had our faces, runner!', 'shock'),
          ],
          choices: [
            {
              id: 'tape',
              label: 'Tear the tape off.',
              then: [N('You tear the tape off, and a lot of hair with it. Nobody complains.')],
            },
            {
              id: 'nubbin',
              label: 'Let your Nubbin nibble through it.',
              then: [N('Your Nubbin chews through the tape with great determination and a terrible face. It takes a while, but it works.')],
            },
          ],
        },
      },
    ],
    complete: {
      id: 'a29-11-complete',
      lines: [
        N('The three of you run back to the stage door in time to see the end on the monitor.'),
        N('The two fakes melt into smoke on stage. Rumi is standing alone in the middle, holding her bare arm, with ten thousand people staring at it.'),
        N('Mira and Zoey stand very still in front of the monitor. They’re looking at the marks too.'),
        M('How long?', 'sad'),
        N('Nobody answers. The screen goes to an advert for fizzy drinks.'),
      ],
    },
    rewards: [],
    sets: { 'a29-11': true },
    notes:
      'The impostors’ faces slip only for a moment (too many teeth); keep it a reveal, not a scare. The harsh song is ' +
      'heard only as the hard original tune from A29-9, with no words or title. The sleeve tear is fabric only; ' +
      'Rumi is not hurt. SABLE: if a29-sable = hid, play ATLAS_A29_VARIANTS a29-11-store-hid straight after ' +
      'a29-11-store (she is already in the store room, under the tables).',
  },

  // ---------------------------------------------------------------- A29-12
  {
    id: 'a29-12',
    code: 'A29-12',
    title: 'Seen',
    source: `${SRC}: after the awards`,
    audience: 'all',
    trigger: { where: WHERE, when: after('A29-11') },
    requires: ['A29-11'],
    speakers: [MIRA, ZOEY, RUMI, JINU, GWIMA],
    steps: [
      {
        id: 'a29-12-s1',
        goal: 'Stay with Mira and Zoey when they come off.',
        hint: 'Go to the loading bay behind the stage.',
        check: 'walk:a29-loading-bay:stage',
        scene: {
          id: 'a29-12-after',
          lines: [
            N('Rumi comes off stage with a stagehand’s jacket round her shoulders. Mira and Zoey are waiting in the loading bay.'),
            M('You lied to us. For years. Every day. Every noodle.', 'angry'),
            R('I didn’t lie. I just didn’t say.'),
            Z('That’s the same, Rumi. That’s exactly the same.', 'sad'),
            R('Celine said nobody would understand.'),
            M('You didn’t give us the chance to understand. That’s the bit I can’t get past.'),
            N('Mira turns and walks out of the bay. After a moment, Zoey follows her, and doesn’t look back, and then does.'),
          ],
          choices: [
            {
              id: 'stay',
              label: 'Stay where you are.',
              then: [N('You stay, because somebody should. You don’t know yet that you’re the somebody.')],
            },
            {
              id: 'zoey',
              label: 'Catch Zoey’s eye.',
              then: [N('Zoey catches your eye at the door, and hers are wet. She shakes her head, not at you, at everything, and goes.', 'sad')],
            },
          ],
        },
        done: {
          id: 'a29-12-after-done',
          lines: [N('Rumi walks off too, the other way, down the ramp into the car park, and you lose her in the crowd of cars.')],
        },
      },
      {
        id: 'a29-12-s2',
        goal: 'Wait in the car park with the gear case.',
        hint: 'Sit on the gear case by the van.',
        check: 'wait:a29-car-park:gear-case',
        scene: {
          id: 'a29-12-find',
          lines: [
            ...FIND_OPEN,
            N('Rumi comes down the ramp. She has the jacket over her arm, the one you handed her in the dressing room.'),
            R('Here. You should have it back.'),
            R('You helped me hide. I asked you to. That’s on me.', 'soft'),
            N('She holds it out until you take it. Then she sits down beside you on the case, with her bare arm out in the air.'),
            R('I’ve been hiding them so long I don’t know what my arm feels like in the wind.'),
            N('You fold the jacket on your knee, and leave it there.'),
          ],
        },
        done: {
          id: 'a29-12-find-done',
          lines: [R('I have to go and see someone. Then I have to see what’s left.'), N('She goes up the ramp towards the roof.')],
        },
      },
      {
        id: 'a29-12-s3',
        goal: 'Follow Rumi to the roof.',
        hint: 'Take the fire stairs to the roof of the hall.',
        check: 'climb:a29-hall:roof',
        scene: {
          id: 'a29-12-roof',
          lines: [
            N('Jinu is on the roof, by the big lit letters of the hall’s sign. Rumi walks straight up to him.'),
            R('You knew. You knew they’d take Mira and Zoey. Did you?'),
            J('I didn’t stop it.'),
            R('Tell me the truth. Your family. All of it.'),
            J('I didn’t go to feed them. I went because I wanted the voice. I wanted to be loved by everyone, more than I wanted to be theirs.', 'sad'),
            J('I left my mother and my little sister in a house with no rice, and I never once went back.'),
            N('Rumi steps back from him. She looks as if he’s slapped her, and as if she’s sorry for him, both.'),
          ],
          choices: [
            {
              id: 'stay',
              label: 'Stay by the door.',
              then: [N('You stay by the door. This isn’t yours to stand in the middle of.')],
            },
            {
              id: 'nubbin',
              label: 'Let your Nubbin go to Derpy.',
              then: [N('Derpy is curled by the sign, ears flat. Your Nubbin goes and sits between his paws, and the tiger lowers his chin over it.', 'soft')],
            },
          ],
        },
        done: {
          id: 'a29-12-roof-done',
          lines: [N('Jinu doesn’t try to say anything else. Below you, from the middle of the city, a red light is welling up through the streets.')],
        },
      },
    ],
    complete: {
      id: 'a29-12-complete',
      lines: [
        N('Through the torn Honmoon, something huge is rising out of the ground: a great shadow, with fire at its heart.'),
        G('Thank you, little hunter. You opened the door yourself.'),
        N('The traffic stops, and the music in the shops. All over the city, people put down what they are holding and turn the same way.'),
        N('They start to walk, quietly, with blank faces, towards the stadium on the river.', 'sad'),
        N('Rumi watches them go. Then she turns her back on Jinu and goes down the stairs, alone.'),
      ],
    },
    rewards: [],
    sets: { 'a29-12': true },
    notes:
      'SLEEVE PAYOFF 1 (a29-sleeve). Step 2: the scene shown, a29-12-find, is for jacket (she gives the jacket back: ' +
      '“You helped me hide. I asked you to. That’s on me.”). For saw play ATLAS_A29_VARIANTS a29-12-find-saw (she ' +
      'finds you before she finds anyone else); for away play a29-12-find-away (she asks you outright whether you knew, ' +
      'and you can say yes). The entranced city is quiet and slow, not frightening: people walk, nobody falls, and ' +
      'they all wake in A29-14.',
  },

  // ---------------------------------------------------------------- A29-13
  {
    id: 'a29-13',
    code: 'A29-13',
    title: 'Celine Again',
    source: `${SRC}: Rumi and Celine`,
    audience: 'all',
    trigger: { where: WHERE, when: after('A29-12') },
    requires: ['A29-12'],
    speakers: [RUMI, CELINE],
    steps: [
      {
        id: 'a29-13-s1',
        goal: 'Go with Rumi to Celine’s house.',
        hint: 'Through the old lanes again. The streets are empty now.',
        check: 'escort:a29-rumi:celine-courtyard',
        scene: {
          id: 'a29-13-courtyard',
          lines: [
            N('The city is empty and humming with that red light. Rumi walks through the old lanes with her arm bare, and you walk behind.'),
            N('Celine is in the courtyard, wide awake, as if she has been waiting since the broadcast.'),
            C('Come inside. Quickly. We’ll put this right. We’ll cover them, and you’ll sing, and we’ll mend the Honmoon, the way it was.'),
            R('The way it was is how we got here.'),
            C('Rumi. Inside.'),
            R('You taught me to hide them. You loved me, I know you did. But only the half of me you could look at.', 'sad'),
            R('You never loved me all the way. Not once.'),
            N('Celine opens her mouth, and nothing comes out. Rumi turns and goes out of the gate, and doesn’t run, and doesn’t look back.'),
          ],
        },
        done: {
          id: 'a29-13-courtyard-done',
          lines: [N('The gate swings shut, and Celine stays standing in the middle of the courtyard. You are still on the stone step by the gate, where you sat last time.')],
        },
      },
      {
        id: 'a29-13-s2',
        goal: 'Sit down next to Celine, and wait.',
        hint: 'Sit on the edge of the wooden floor beside her. Don’t say anything.',
        check: 'sit:a29-celine:maru',
        scene: {
          id: 'a29-13-sit',
          lines: [
            N('Celine sits down on the edge of the wooden floor that runs along the house, very straight, with her hands on her knees.'),
            N('She doesn’t look at you. She doesn’t tell you to go.'),
            N('You go and sit down next to her: not close, but close enough.'),
            N('Your Nubbin climbs out of the bag, takes off its noodle hat, and puts it down neatly on the boards between you.'),
            N('The red light glows over the roofs, and a long way off a crowd is walking very quietly. Neither of you says anything.'),
            N('It goes on for a long time. Long enough for the courtyard stones to cool, and for a cat to cross the wall and change its mind.'),
          ],
          choices: [
            {
              id: 'wait',
              label: 'Wait.',
              then: [N('You wait, that’s all. It is harder than fighting demons, and you don’t think anyone will ever thank you for it.')],
            },
            {
              id: 'wait2',
              label: 'Wait a bit longer.',
              then: [N('You wait a bit longer. Celine’s hands, on her knees, slowly stop being fists.')],
            },
          ],
        },
        done: {
          id: 'a29-13-sit-done',
          lines: [N('At last Celine gets up, without a word, and goes inside. You hear a kettle.')],
        },
      },
    ],
    complete: {
      id: 'a29-13-complete',
      lines: [
        N('She comes back with a tray. Two cups of barley tea, and a small saucer of water for your Nubbin.'),
        N('She pours, and doesn’t thank you, and doesn’t say anything about Rumi. She pours you a second cup when the first one’s gone.'),
        C('She was such a small girl. With her sleeves always down. I thought I was keeping her safe.', 'sad'),
        N('That is all she says. You drink the tea, and it’s good tea.'),
        N('When you go, she puts your Nubbin’s noodle hat carefully back in your hand. Then she sits on the step again, looking at the gate.', 'soft'),
      ],
    },
    rewards: [],
    sets: { 'a29-13': true },
    notes:
      'Hazel’s third rule, acted (sit down next to them and wait), never quoted. Celine is grieving, not punished; ' +
      'the scene gives her tea and company, not a lesson. The wooden floor is the hanok’s maru; adviser to check ' +
      'how she sits. Rumi’s line “You never loved me all the way” is original, after the outline.',
  },

  // ---------------------------------------------------------------- A29-14
  {
    id: 'a29-14',
    code: 'A29-14',
    title: 'The Stadium',
    source: `${SRC}: the stadium`,
    audience: 'all',
    trigger: { where: WHERE, when: after('A29-13') },
    requires: ['A29-13'],
    speakers: [RUMI, MIRA, ZOEY, BOBBY],
    steps: [
      {
        id: 'a29-14-s1',
        goal: 'Get into the stadium with the gear case.',
        hint: 'Walk with the crowd. Keep your head down and the case close.',
        check: 'walk:a29-crowd:stadium',
        scene: {
          id: 'a29-14-crowd',
          lines: [
            N('The stadium on the river is full. Tens of thousands of people, standing still, faces lifted, eyes blank.'),
            N('A faint shimmer rises off all of them, like steam off a lake in the morning, and drifts towards the stage.'),
            N('On the stage the Saja Boys are singing, and behind them the great shadow with fire at its heart is drinking it all in.'),
            N('You push through the crowd with the gear case, and nobody stops you or sees you. Bobby is in the third row, smiling at nothing.', 'sad'),
            N('Two rows behind him is Zoey, and in the aisle is Mira. Both of them blank, both of them shimmering.'),
            N('You keep walking. Your Nubbin holds onto your collar with both paws.'),
          ],
          choices: [
            {
              id: 'bobby',
              label: 'Stop by Bobby.',
              then: [N('You touch Bobby’s arm, and he doesn’t notice. You straighten his tie, because he would want it straight, and go on.', 'sad')],
            },
            {
              id: 'on',
              label: 'Keep going.',
              then: [N('You keep going. The quickest way to help is to get the case where it’s needed.')],
            },
          ],
        },
        done: {
          id: 'a29-14-crowd-done',
          lines: [N('Then, at the back of the stadium, the big doors open, and someone walks in alone.')],
        },
      },
      {
        id: 'a29-14-s2',
        goal: 'Watch Rumi.',
        hint: 'Stand at the side of the stage with the case open.',
        check: 'watch:a29-rumi:stage',
        scene: {
          id: 'a29-14-song',
          lines: [
            N('It’s Rumi, with no sleeves at all. Her arms are bare, and her neck, and the marks run all over both, violet and silver.'),
            N('She walks down the middle aisle through the blank crowd, and up onto the stage, past the Saja Boys, to the front.'),
            N('She doesn’t sing the old songs, or the harsh one. She opens her mouth and sings something you have never heard.'),
            N('It has no words you can catch, and it is her own. It is like hearing someone tell the truth about herself, and not dying of it.'),
            N('Under the music the marks glow brighter, not dimmer, and she doesn’t hide them. She holds her arms out so everyone can see.'),
            N('The shimmer stops drifting towards the stage. Here and there in the crowd, someone blinks.', 'soft'),
          ],
        },
        done: {
          id: 'a29-14-song-done',
          lines: [
            N('You are standing at the side of the stage holding Rumi’s long coat. She took it off on her way in, and put it in your hands, and kept walking.'),
            N('You hold it, and don’t put it on her, and don’t put it away.', 'soft'),
            ...SONG_END,
          ],
        },
      },
    ],
    complete: {
      id: 'a29-14-complete',
      lines: [
        N('Mira and Zoey come up the stage steps two at a time. You throw Mira her blade and Zoey her belt of knives.'),
        M('Rumi. We were wrong. We’ll say sorry properly later. Right now, move up.'),
        Z('Room for two more?', 'happy'),
        N('Rumi looks at them, and makes room, and the three of them stand together at the front of the stage.'),
        N('All over the stadium people are waking up, confused, holding their phones. Bobby, in the third row, says “what” very loudly.'),
        N('Then he sees the open case in your arms.'),
        B('Who opened the girls’ case? Nobody touches the girls’ case!', 'shock'),
        Z('Bobby. We’re saving the world.'),
        B('…Carefully, though?'),
      ],
    },
    rewards: [],
    sets: { 'a29-14': true },
    notes:
      'RUMI’S SONG is heard as original music under her face, with no words, no subtitles and no title (Part M). ' +
      'SLEEVE PAYOFF 2 (a29-sleeve). Step 2 done: the scene shown, a29-14-song-done, is for jacket (she hands you her ' +
      'coat on her way in). For saw play ATLAS_A29_VARIANTS a29-14-song-done-saw (she looks at you once from the ' +
      'stage); for away, a29-14-song-done-away (she doesn’t look for anyone). SABLE: if a29-sable = heel, play ' +
      'a29-14-crowd-heel straight after a29-14-crowd (she stays by you in the crowd, ears up, and doesn’t go under ' +
      'anything). The waking crowd is gentle: blinks, confusion, phones.',
  },

  // ---------------------------------------------------------------- A29-15
  {
    id: 'a29-15',
    code: 'A29-15',
    title: 'Jinu',
    source: `${SRC}: Jinu’s choice`,
    audience: 'all',
    trigger: { where: WHERE, when: after('A29-14') },
    requires: ['A29-14'],
    speakers: [RUMI, JINU, GWIMA, ZOEY],
    steps: [
      {
        id: 'a29-15-s1',
        goal: 'Hold on at the side of the stage.',
        hint: 'Keep hold of the stage rail. Keep your Nubbin close.',
        check: 'watch:a29-gwima:stage',
        scene: {
          id: 'a29-15-strike',
          lines: [
            N('The great shadow behind the stage turns. The fire at its heart is the size of a house, and it is looking at Rumi.'),
            G('Half of mine. Half of theirs. You should have been all of mine.'),
            N('It reaches for her: a long arm of shadow and heat, slow, enormous, coming down over the stage like a falling wall.'),
            N('Rumi doesn’t run, and Mira and Zoey don’t run. They stand together and keep singing, with their weapons up.'),
            N('And Jinu steps out from the other boys, and walks across the stage, and stands in front of Rumi with his arms out.', 'shock'),
            N('The shadow hits him instead of her.'),
          ],
          choices: [
            {
              id: 'hold',
              label: 'Hold your Nubbin tight.',
              then: [N('You hold your Nubbin tight. It holds you tight back, its face pressed into your coat.')],
            },
            {
              id: 'look',
              label: 'Don’t look away.',
              then: [N('You don’t look away; someone should see this, all of it. You think he would want somebody to.')],
            },
          ],
        },
      },
      {
        id: 'a29-15-s2',
        goal: 'See it through.',
        hint: 'Stay by the rail until the light settles.',
        check: 'watch:a29-honmoon:sky',
        scene: {
          id: 'a29-15-light',
          lines: [
            N('Jinu is standing in the shadow’s grip, and he is full of light. It is coming out of him, the way the shimmer came out of the crowd.'),
            J('I left them. I’ve been leaving them for four hundred years. Not this time.'),
            N('He turns to Rumi. In his hands the light gathers into one bright whole thing, like a lantern with nothing round it.'),
            J('Here. It was mine before he had it. It’s whole again. Take it.', 'soft'),
            N('He puts it into her hands. Then he is gone: not falling, not hurt, only light, all at once, like a window opening.'),
            N('Rumi stands holding the light. Then she lifts her head and sings, and Mira and Zoey sing with her, and you have never heard three voices fit so well.'),
            N('The shadow with the fire at its heart comes apart like smoke in a wind, and is gone, and the stage is only a stage.'),
            N('Above the stadium the torn Honmoon closes over. It isn’t gold: it is every colour there is, like a ribbon held up to the sun.', 'soft'),
          ],
        },
        done: {
          id: 'a29-15-light-done',
          lines: [N('The crowd is awake, all of it. Somebody starts clapping, not knowing why, and then everybody does.')],
        },
      },
    ],
    complete: {
      id: 'a29-15-complete',
      lines: [
        N('At the edge of the stage, where Jinu stood, there is a little drift of light, like glitter after a party.'),
        N('Derpy comes up the stage steps on his big soft paws and lies down on it, and puts his chin on his paws, and doesn’t purr.', 'sad'),
        N('Sussie lands on his head. Your Nubbin goes and sits between the tiger’s paws and leans on him.'),
        Z('It’s not gold.'),
        R('No. It’s better.', 'soft'),
        N('A thread of that many-coloured light drifts down from the sky, and catches round your wrist, and stays.'),
      ],
    },
    rewards: [],
    sets: { 'a29-15': true },
    notes:
      'CARE: Jinu’s end is light, not death imagery: no body, no wound, no falling. He becomes light “like a window ' +
      'opening”. Gwi-Ma comes apart like smoke. The three voices are original wordless music. The new Honmoon is every ' +
      'colour (never call it by the film’s word for gold). The thread round your wrist is the ribbon reward, granted ' +
      'in A29-16.',
  },

  // ---------------------------------------------------------------- A29-16
  {
    id: 'a29-16',
    code: 'A29-16',
    title: 'In Public',
    source: `${SRC}: days later`,
    audience: 'all',
    trigger: { where: WHERE, when: after('A29-15') },
    requires: ['A29-15'],
    speakers: [RUMI, MIRA, ZOEY, BOBBY, FAN],
    steps: [
      {
        id: 'a29-16-s1',
        goal: 'Help Bobby with the street meet-up.',
        hint: 'Hand out the water and keep the queue moving.',
        check: 'walk:a29-street:daylight',
        scene: {
          id: 'a29-16-street',
          lines: [
            N('Days later, in daylight, Huntrix meet their fans in the street: no stage, no tickets, a folding table and a queue round the block.'),
            B('Water for the queue. Keep it moving. Smile. Not like that. Like a person.'),
            N('Rumi is in short sleeves. The marks are on both arms, violet and silver, in the plain sun.'),
            F('Can I… is it all right if I look at your arm? It’s so pretty. Is that rude?'),
            R('It’s not rude. Look as long as you like.', 'happy'),
            N('Mira signs a cast, and Zoey signs a forehead, with permission. A grandmother gives Rumi a bag of oranges and pats her bare arm.'),
          ],
          choices: [
            {
              id: 'water',
              label: 'Hand out the water.',
              then: [N('You hand out water down the whole queue. Your Nubbin hands out light sticks, one at a time, with great ceremony.')],
            },
            {
              id: 'wall',
              label: 'Look at the wall behind the table.',
              then: [N('On the low wall behind the table, in the sun, a blue tiger and a magpie are sitting very still, as if they were painted there.')],
            },
          ],
        },
        done: {
          id: 'a29-16-street-done',
          lines: [N('Derpy and Sussie are on the wall behind the table. Nobody but you seems to think a blue tiger is odd.')],
        },
      },
      {
        id: 'a29-16-s2',
        goal: 'Take a rest on the wall with Derpy.',
        hint: 'Sit on the wall in the sun when the queue thins.',
        check: 'sit:a29-wall:derpy',
        scene: {
          id: 'a29-16-wall',
          lines: [
            N('When the queue thins, you sit on the wall beside Derpy, with your back to the warm stone.'),
            N('The tiger rolls half over and holds out his big paws, the way you hold out your arms for a child.'),
            N('Your Nubbin climbs into them, turns round three times, and goes to sleep in the tiger’s paws, noodle hat over its eyes.'),
            N('Derpy purrs like a kettle. Sussie stands on his shoulder and keeps watch over both of them.'),
            N('Down the street, over the rooftops, faint in the daylight, the Honmoon shimmers every colour. It looks like it might hold a long time.'),
            N('Rumi looks over from the table, and sees the three of them, and laughs.', 'happy'),
          ],
          choices: [
            {
              id: 'let',
              label: 'Let them sleep.',
              then: [N('You let them sleep. Nobody needs you to do anything for a while, which is the best feeling in the world.', 'soft')],
            },
            {
              id: 'photo',
              label: 'Take a photo.',
              then: [N('You take a photo: a tiger, a magpie, a Nubbin, a noodle hat. It is the best photo anyone has ever taken.', 'happy')],
            },
          ],
        },
      },
    ],
    complete: {
      id: 'a29-16-complete',
      lines: [
        ...C16_OPEN,
        N('Rumi comes over to the wall. She stops in front of you in the sun, and pushes her short sleeve up to the shoulder.'),
        N('She holds her arm out, the marks bright in the daylight, and turns it this way and that, as if she is seeing it for the first time.', 'soft'),
        R('You gave me a jacket once. I don’t need it now. But thanks for knowing when I did.'),
        ...C16_HOME,
      ],
    },
    rewards: [
      {
        id: 'a29-honmoon-ribbon',
        kind: 'decor',
        label: 'Honmoon ribbon',
        description: 'A thread of soft, many-coloured light along the Grove fence after dark. Tap the fence post to switch it on or off.',
      },
      {
        id: 'a29-minhwa-screen',
        kind: 'decor',
        label: 'Tiger-and-magpie screen',
        description: 'A small folding screen in the Korean folk-painting style: a silly tiger and a bright magpie. It goes in the cottage.',
      },
      {
        id: 'a29-magpie-petpet',
        kind: 'cosmetic',
        label: 'Magpie petpet',
        description: 'A little magpie who rides on your Nubbin. When you come back after time away, she brings you a “letter”: a leaf.',
      },
    ],
    sets: { 'a29-16': true, 'a29-done': true },
    notes:
      'SLEEVE PAYOFF 3 (a29-sleeve). Complete: the scene shown, a29-16-complete, is for jacket (she shows you the marks ' +
      'in the sun, as if for the first time). For saw play ATLAS_A29_VARIANTS a29-16-complete-saw (she pulls you into ' +
      'the group photo); for away, a29-16-complete-away (she waves from across the street, and that’s enough). ' +
      'SABLE: a29-sable = hid → play a29-16-street-hid straight after a29-16-street-done (the wall’s shade, with ' +
      'Sussie); heel → a29-16-street-heel (in the sun, mid-pavement, the fans step round her). After the page, if ' +
      'a29-sable is set, play a29-grove-luna-heel or a29-grove-luna-hid the next time you talk to Luna in the Grove. ' +
      'REWARDS (all one-time): the ribbon (Tier 2: a toggleable light along the Grove fence after dark), the minhwa ' +
      'screen (Tier 2: cottage decor; MUST be painted by a Korean artist in the minhwa style), the magpie petpet (it ' +
      'leaves a leaf letter on return after an absence; a welcome, not a timer, and it gives nothing to collect). ' +
      'SIM: the petpet’s leaf appears when the Grove loads after offline catch-up of any length; it is decorative.',
  },
];

// =================================================================== variants

/**
 * Variant scenes chosen by flags or Grove state. Each quest's notes say where each plays.
 *   Sable's stage (Grove, read-only, read at A29-1): a29-01-sable-hid (t45), a29-01-sable-heel (bonded).
 *   a29-sable = hid: a29-02-stage-hid, a29-03-pans-hid, a29-11-store-hid, a29-16-street-hid,
 *     a29-grove-luna-hid. Each plays straight after its named scene; none replaces anything.
 *   a29-sable = heel: a29-14-crowd-heel, a29-16-street-heel, a29-grove-luna-heel.
 *   a29-sleeve (A29-6): a29-12-find-saw / -away replace a29-12-find; a29-14-song-done-saw / -away
 *     replace a29-14-song-done; a29-16-complete-saw / -away replace a29-16-complete. The base
 *     scenes are the jacket path.
 *   s24Done (Grove, read-only): a29-01-margin-hazel.
 */
export const ATLAS_A29_VARIANTS: Scene[] = [
  // ---------------------------------------------------------------- Hazel's margin note (s24Done)
  {
    id: 'a29-01-margin-hazel',
    lines: [
      N('When you next look at Nova’s atlas, there is a pencil note under the ink scroll, low in the margin. You know the hand.'),
      N('“Never been. Nova says it’s all singing.”'),
      N('“I’d hum.”', 'soft'),
    ],
  },
  // ---------------------------------------------------------------- A29-1: Sable comes
  {
    id: 'a29-01-sable-hid',
    lines: [
      N('Something brushes your ankle in the ink: Sable has come with you. She is a grey smudge in the grey mist, keeping very low.'),
      N('She doesn’t come to your hand. She finds the deepest shadow on the scroll and goes into it, and watches you from there.'),
    ],
    set: { 'a29-sable': 'hid' },
  },
  {
    id: 'a29-01-sable-heel',
    lines: [
      N('Sable has come with you. She walks at your heel through the ink, grey on grey, and her ears are up.'),
      N('She looks at the demons on the far mountains for a long moment. Then she looks at you, and stays where she is.'),
    ],
    set: { 'a29-sable': 'heel' },
  },
  // ---------------------------------------------------------------- a29-sable = hid
  {
    id: 'a29-02-stage-hid',
    lines: [
      N('In a gap under the stage, between two cases of cables, a pair of eyes catches the light. Sable has found the darkest place in the arena.'),
      N('Every time the bass drops she flattens a little. She doesn’t leave.'),
    ],
  },
  {
    id: 'a29-03-pans-hid',
    lines: [
      N('When you get back, the kitchen has an extra guest. Sable is behind the stack of noodle pans by the cooker, only her ears showing.'),
      N('Rumi sees her, and doesn’t say anything, and puts a few plain noodles on a saucer by the pans, and leaves them there.', 'soft'),
    ],
  },
  {
    id: 'a29-11-store-hid',
    lines: [
      N('Under the folded tables, at the back of the store room, something grey moves. Sable has been in here all along, hiding from the noise.'),
      N('She watches the tape come off Mira’s wrists. When you go, she comes after you, one shadow at a time.'),
    ],
  },
  {
    id: 'a29-16-street-hid',
    lines: [
      N('Sable has found the shade at the foot of the wall, under Sussie. The magpie looks down at her, and hops down, and sits beside her.'),
      N('The two of them watch the queue together from the shade, one grey, one black and white, very still.', 'soft'),
    ],
  },
  // ---------------------------------------------------------------- a29-sable = heel
  {
    id: 'a29-14-crowd-heel',
    lines: [
      N('Sable is at your heel the whole way through the crowd. All those blank faces, all that noise, and she doesn’t go under anything.'),
      N('Her ears are up. She walks right beside you, close enough to touch, and keeps walking.'),
    ],
  },
  {
    id: 'a29-16-street-heel',
    lines: [
      N('Sable walks out into the middle of the pavement, in the full sun, and lies down there, grey and in plain view.'),
      N('The fans in the queue step round her, carefully, the way you step round a cat in a doorway. She stays exactly where she is.', 'soft'),
    ],
  },
  // ---------------------------------------------------------------- after the page, in the Grove (Luna)
  {
    id: 'a29-grove-luna-heel',
    lines: [
      N('Luna looks at Sable, who is lying in the middle of the path in the sun, and then at you.'),
      LU('She went somewhere loud and bright, and didn’t hide? Well. Don’t make a fuss of it. She’ll know.'),
    ],
  },
  {
    id: 'a29-grove-luna-hid',
    lines: [
      N('Luna looks at Sable, who is under the bench, and then at you.'),
      LU('She went somewhere loud and bright, and came home. Hiding still counts as going. Don’t make a fuss of it.'),
    ],
  },
  // ---------------------------------------------------------------- A29-12, step 2 (sleeve = saw)
  {
    id: 'a29-12-find-saw',
    lines: [
      ...FIND_OPEN,
      N('Rumi comes down the ramp fast, looking along the rows of cars. When she sees you, she stops looking.'),
      N('She sits down on the case beside you. She came to you first, before Mira, before Zoey, before Celine.'),
      R('You saw. In the dressing room. And you said it was all right.'),
      R('Was it true? Or were you only being nice?'),
      Y('It was true. It still is.'),
      N('She lets her breath go, all of it, like someone putting down a heavy bag.', 'soft'),
      R('Everyone saw tonight. You saw first. That helps. I don’t know why, but it helps.'),
    ],
  },
  // ---------------------------------------------------------------- A29-12, step 2 (sleeve = away)
  {
    id: 'a29-12-find-away',
    lines: [
      ...FIND_OPEN,
      N('Rumi comes down the ramp and stops in front of you. Her arm is bare, and she doesn’t cover it.'),
      R('In the dressing room. That night. You looked away. Did you see?'),
    ],
    choices: [
      {
        id: 'yes',
        label: '“Yes. I saw.”',
        then: [
          Y('Yes. I saw.'),
          R('And you let me think you hadn’t.'),
          N('She doesn’t sound angry. She sounds as if she is working something out.', 'think'),
          R('That was kind. I think. I don’t know any more which kind of kind I need.'),
        ],
      },
      {
        id: 'quiet',
        label: 'Say nothing.',
        then: [
          N('You don’t say anything. You don’t look away this time, either.'),
          R('Right. Yes. You did.', 'soft'),
          N('She sits down on the end of the case, not quite next to you, and looks at her own arm.'),
        ],
      },
    ],
  },
  // ---------------------------------------------------------------- A29-14, step 2 done (sleeve = saw)
  {
    id: 'a29-14-song-done-saw',
    lines: [
      N('Halfway through, with the marks blazing on her arms, Rumi looks round the stadium once, and finds you at the side of the stage.'),
      N('Only for a moment. Then she looks back out at the crowd, and sings louder.', 'soft'),
      ...SONG_END,
    ],
  },
  // ---------------------------------------------------------------- A29-14, step 2 done (sleeve = away)
  {
    id: 'a29-14-song-done-away',
    lines: [
      N('Rumi doesn’t look for anyone, not Mira, not Zoey, not you. She sings straight out, at all of them.'),
      N('She doesn’t need to look for anyone. That is the whole point.', 'soft'),
      ...SONG_END,
    ],
  },
  // ---------------------------------------------------------------- A29-16 complete (sleeve = saw)
  {
    id: 'a29-16-complete-saw',
    lines: [
      ...C16_OPEN,
      Z('Group photo! Huntrix and staff! Bobby, hold the phone up higher. Higher. Like a tall person.', 'happy'),
      N('You go to step out of the way. Rumi catches you by the sleeve and pulls you into the middle, between her and Mira.'),
      R('You were the first one to say it was all right. You’re in the photo.', 'happy'),
      N('In the photo, her arm is round your shoulders, marks and all. Your Nubbin is a blur in the front, waving.'),
      ...C16_HOME,
    ],
  },
  // ---------------------------------------------------------------- A29-16 complete (sleeve = away)
  {
    id: 'a29-16-complete-away',
    lines: [
      ...C16_OPEN,
      N('You pick up the empty boxes and go across the street to the van. When you turn round, Rumi is looking for you over the crowd.'),
      N('She lifts her bare arm and waves, once, a big wave, from right across the street.'),
      N('You wave back, and neither of you comes any closer. That’s enough.', 'soft'),
      ...C16_HOME,
    ],
  },
];

// =================================================================== flags and checks

/** Every flag this line sets (Atlas save only). It reads Sable's trust stage and s24Done, and writes no Grove flag. */
export const ATLAS_A29_FLAGS: string[] = [
  'a29-01',
  'a29-02',
  'a29-03',
  'a29-04',
  'a29-05',
  'a29-06',
  'a29-07',
  'a29-08',
  'a29-09',
  'a29-10',
  'a29-11',
  'a29-12',
  'a29-13',
  'a29-14',
  'a29-15',
  'a29-16',
  'a29-done', // A29-16: the whole page; atlasDone('A29')
  'a29-sable', // hid | heel (A29-1 variants): Sable's beats, and the Grove Luna scene reads it
  'a29-sleeve', // jacket | saw | away (a29-06-sleeve): A29-12, A29-14, A29-16
];

export const ATLAS_A29_CHECKS: string[] = [
  'visit:a29-page:scroll',
  'walk:a29-scroll:generations',
  'carry:a29-merch:arena',
  'watch:a29-concert:wings',
  'carry:a29-gearcase:car-park',
  'collect:a29-ramyun:store',
  'sit:a29-flat:table',
  'escort:a29-rumi:celine-house',
  'wait:a29-celine:gate',
  'watch:a29-saja:debut',
  'inspect:a29-crowd:crossing',
  'carry:a29-gearcase:studio',
  'watch:a29-fight:studio',
  'deliver:a29-water:dressing-room',
  'find:a29-derpy:alley',
  'deliver:a29-note:roof',
  'wait:a29-wall:steps',
  'watch:a29-jinu:wall',
  'craft:a29-tea:studio-kitchen',
  'give:a29-tea:three',
  'carry:a29-umbrella:city-wall',
  'watch:a29-deal:wall',
  'inspect:a29-jinu:lamp',
  'carry:a29-costumes:backstage',
  'watch:a29-monitor:stage-door',
  'find:a29-girls:store-room',
  'walk:a29-loading-bay:stage',
  'wait:a29-car-park:gear-case',
  'climb:a29-hall:roof',
  'escort:a29-rumi:celine-courtyard',
  'sit:a29-celine:maru',
  'walk:a29-crowd:stadium',
  'watch:a29-rumi:stage',
  'watch:a29-gwima:stage',
  'watch:a29-honmoon:sky',
  'walk:a29-street:daylight',
  'sit:a29-wall:derpy',
];
