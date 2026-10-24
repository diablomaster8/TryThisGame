/**
 * Atlas campaign, page A4: The Waterfall Prince (Part L). Sixteen quests, A4-1 to A4-16.
 *
 * SOURCE. Baahubali: The Beginning (2015) and Baahubali 2: The Conclusion (2017), directed by S. S.
 * Rajamouli, story by K. V. Vijayendra Prasad, made in Telugu and Tamil (Arka Media Works). All
 * rights with the rights holders. Copyrighted: no text is lifted. Every line here is our own, and
 * the plot is retold in outline, as the films tell it.
 *
 * AUDIENCE. 'teen' (13+): main game only, behind the Mature content setting (Off by default). No
 * childLines are needed, and there is no Learning Grove version.
 *
 * FRAME. Nova's atlas opens at the foot of a great waterfall at night, in rain. You are a stranger
 * in the story; your Nubbin becomes the boy Shivudu's first friend and climbs the falls beside him
 * (A4-2, A4-3). In A4-6 the old warrior Kattappa knows the boy's face, and in A4-7 his telling
 * pulls you back twenty-five years, into the Mahishmati of Amarendra Baahubali, as a stranger there
 * too. A4-14 ends at the river where A4-1 began; A4-15 brings you back to Kattappa's fire, where
 * the old man knows you at once: you have not aged a day. The films' heroes keep their story. You
 * carry, hold, guide and speak to people at the edges. Your Nubbin never talks; nor do the animals.
 *
 * GROVE STATE READ: none in this file. The outline asks for no Grove reads, and the Atlas never
 * writes a Grove flag. Engine data elsewhere: once s24Done is set, S24 (side-stories-s24.ts, Hazel's
 * margin notes) shows Hazel's pencil note beside A4-2 The Climb ("Fell off that waterfall forty
 * times…"); A4-2's villager gives the same count. This page has no margin variant of its own.
 *
 * FLAGS WRITTEN (Atlas save only, all prefixed a4-):
 *   - a4-01 … a4-16 on each quest; a4-done on A4-16 (the Price of Power festival reads it through
 *     atlasDone('A4')).
 *   - a4-words = hands | forgave | stay (A4-13, scene a4-13-rain): THE SIGNATURE CHOICE. You cannot
 *     change what Kattappa does; you choose what you say to him afterwards. Paid off three quests
 *     later, in A4-16 (a4-16-words, base = hands; ATLAS_A04_VARIANTS a4-16-words-forgave and
 *     a4-16-words-stay): the words the old man says to the returning son are the ones you gave him.
 *     A smaller echo plays in A4-15 (a4-15-fire-done is the same for all three; Kattappa says he has
 *     kept "what you told me" and does not say it yet).
 *
 * LIFTED TEXT: none. The films' famous lines (Sivagami's oath on her word, the question everyone
 * asked about Kattappa, the battle cries) are not quoted; their sense is carried by new lines. The
 * crowd calls the name "Baahubali" and the city's name; that is all.
 *
 * CARE NOTES.
 *   - ADVISERS. Indian (Telugu and Tamil) advisers for names, dress, the court, the gesture of the
 *     foot on the head (A4-6), and how both language versions name things. Names here follow the
 *     Telugu cut. The Tamil version names the tyrant Palvaal Thevan and spells some others
 *     differently; the advisers decide whether the Tamil-language build of the game uses those.
 *   - FICTION, NOT HISTORY. Mahishmati, Kuntala and the Kalakeyas are presented as the films'
 *     invented kingdoms. No line says or suggests they were real.
 *   - THE KALAKEYAS. Never caricatured: no invented gibberish language, no darkened skin, no
 *     "savage" framing. They are a large, disciplined army with a proud chief. Their chief does not
 *     speak in this script.
 *   - RELIGION. The films' scenes of worship (the boy carrying the shrine stone to the falls, the
 *     temple rites) are left out rather than staged in a game. Sanga's prayer at the river is one
 *     line, respectful and plain. Nothing sacred is a prop or a puzzle.
 *   - VIOLENCE is heroic, not graphic. No blood, no wounds shown. Amarendra's death (A4-13) happens
 *     as the screen goes to rain; the line after says plainly that he is gone. Bhallaladeva's end
 *     (A4-16) is offscreen: the camera stays on Devasena's face, and you turn your Nubbin away.
 *     Bhadra's death in the first film is not shown or mentioned.
 *   - THE ROMANCES. The first film's courtship of Avanthika (marking her hand while she sleeps,
 *     undressing her armour) is not reproduced. Here they meet as equals: she holds a sword to his
 *     throat, he gives her back her mask, and they choose each other's cause. The court assault in
 *     A4-12 is one line ("lays hands on a woman of her household"), never shown.
 *   - KATTAPPA'S OATH. He is bound to serve the throne for life, as the films have it. Said plainly
 *     and with dignity (A4-7), never played for comedy.
 *   - DEVASENA'S PYRE is the pyre she swore for the tyrant, not for herself. No line may read as
 *     self-immolation.
 *   - Art is original: no film stills, posters or costume copies.
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

const WHERE = 'Nova’s atlas: the Waterfall Prince page (Atlas campaign)';
const after = (code: string) => `Any time after ${code}, from Nova’s atlas. Mature content at 13+ or 18+.`;
const FILMS = 'Baahubali: The Beginning (2015) and Baahubali 2: The Conclusion (2017), S. S. Rajamouli, Telugu and Tamil';

// ------------------------------------------------------------------ speakers

const SANGA = sp('a4-sanga', 'Sanga', 'Sanga, the woman of the falls who raises the boy (Baahubali); original design');
const SHIVUDU = sp('a4-shivudu', 'Shivudu', 'Shivudu, later Mahendra Baahubali (Baahubali); original design');
const MAHENDRA = sp('a4-mahendra', 'Mahendra Baahubali', 'Shivudu once he knows his name (Baahubali); same character as a4-shivudu');
const AVANTHIKA = sp('a4-avanthika', 'Avanthika', 'Avanthika, a rebel warrior (Baahubali); original design');
const DEVASENA = sp('a4-devasena', 'Devasena', 'Devasena, princess of Kuntala, later the chained queen (Baahubali); original design');
const KATTAPPA = sp('a4-kattappa', 'Kattappa', 'Kattappa, the sworn warrior of the throne (Baahubali); original design');
const BHALLA = sp('a4-bhalla', 'Bhallaladeva', 'Bhallaladeva, the tyrant cousin (Baahubali; Palvaal Thevan in Tamil); original design');
const AMARENDRA = sp('a4-amarendra', 'Amarendra Baahubali', 'Amarendra Baahubali, the boy’s father (Baahubali); original design');
const SIVAGAMI = sp('a4-sivagami', 'Sivagami', 'Sivagami, the queen mother of Mahishmati (Baahubali); original design');
const BIJJALA = sp('a4-bijjala', 'Bijjaladeva', 'Bijjaladeva, Bhallaladeva’s scheming father (Baahubali); original design');
const KUMARA = sp('a4-kumara', 'Kumara Varma', 'Kumara Varma, Devasena’s timid cousin (Baahubali 2); original design');
const VILLAGER = sp('a4-villager', 'A Villager', 'a villager of the falls (Baahubali); original');
const WORKER = sp('a4-worker', 'An Old Labourer', 'a labourer at the statue (Baahubali); original');
const REBEL = sp('a4-rebel', 'A Rebel', 'one of Avanthika’s band (Baahubali); original');
const CROWD = sp('a4-crowd', 'The Crowd', 'the people of Mahishmati (Baahubali)');
const GUARD = sp('a4-guard', 'A Guard', 'a soldier of Mahishmati (Baahubali); original');

const N = say('narrator');
const Y = say('you');
const SA = say('a4-sanga');
const SH = say('a4-shivudu');
const MA = say('a4-mahendra');
const AV = say('a4-avanthika');
const DE = say('a4-devasena');
const KA = say('a4-kattappa');
const BH = say('a4-bhalla');
const AM = say('a4-amarendra');
const SI = say('a4-sivagami');
const BI = say('a4-bijjala');
const KU = say('a4-kumara');
const VI = say('a4-villager');
const WO = say('a4-worker');
const RE = say('a4-rebel');
const CR = say('a4-crowd');
const GU = say('a4-guard');

// =================================================================== quests

export const ATLAS_A04: Quest[] = [
  // ---------------------------------------------------------------- A4-1
  {
    id: 'a4-01',
    code: 'A4-1',
    title: 'The River’s Gift',
    source: `${FILMS}: the opening at the river`,
    audience: 'teen',
    trigger: {
      where: WHERE,
      when: 'Any time once Nova’s atlas is in the Grove and Mature content is at 13+ or 18+; the first quest on the page.',
    },
    speakers: [SANGA, VILLAGER],
    steps: [
      {
        id: 'a4-01-s1',
        goal: 'Step into the atlas page and find your feet by the river.',
        hint: 'Touch the painted waterfall on the page, then follow the torchlight along the bank.',
        check: 'visit:a4-river:night',
        scene: {
          id: 'a4-01-river',
          lines: [
            N('Nova’s atlas falls open at a page that is mostly water: a waterfall so tall the top of it is off the paper.'),
            N('You touch the spray. It is cold, and then it is on your face, and the noise arrives all at once.'),
            N('Night, and rain. A river runs fast and brown between black rocks, and somewhere above it the falls are roaring.'),
            N('Torches move on the far bank, a long way off. Men are shouting a name you can’t make out.'),
            N('Your Nubbin grabs your sleeve and points at the river.'),
            N('A woman is in the water, up to her chest, and she is holding something above her head with both hands.'),
            N('It is a baby, wrapped in red cloth. She is keeping him out of the river, and nothing else.'),
          ],
          choices: [
            {
              id: 'wade',
              label: 'Wade in towards her.',
              then: [
                N('The current takes your legs at the second step. You grab a rock and hold on, and the river goes past you like a crowd.'),
              ],
            },
            {
              id: 'shout',
              label: 'Shout for help along the bank.',
              then: [N('Your voice goes nowhere in the noise. Then, downstream, a lamp comes on in a hut, and another.')],
            },
          ],
        },
        done: {
          id: 'a4-01-river-done',
          lines: [
            N('She is past you now, and the falls are close behind her. She doesn’t look at them.'),
            N('Her arms stay up. The river rises to her chin, and then over it, and her arms stay up.'),
          ],
        },
      },
      {
        id: 'a4-01-s2',
        goal: 'Help the villagers bring the baby safely to the bank.',
        hint: 'Run downstream to the shallows by the huts.',
        check: 'carry:a4-baby:bank',
        scene: {
          id: 'a4-01-shallows',
          lines: [
            N('Downstream the river spreads out and slows. People from the huts are already in it to their knees, with lamps.'),
            N('The red cloth comes round the bend, held up out of the water. Just a hand and an arm now, still holding.'),
            VI('There! Get him, get him!', 'shock'),
            N('A woman wades out further than anyone else, and takes the baby from the hand.'),
            N('The hand lets go. The river closes over it, gently, as if it had been asked to.'),
            N('The woman stands in the water with the baby against her shoulder, and for a moment nobody says anything.'),
            N('Your Nubbin holds the lamp out over them, as high as it can reach, which isn’t very high.'),
          ],
          choices: [
            {
              id: 'cloth',
              label: 'Give her your coat for the baby.',
              then: [N('She takes it without looking at you and wraps him in it, red cloth and all. He is furious about the whole night.')],
            },
            {
              id: 'river',
              label: 'Look back at the river.',
              then: [N('There’s nothing to see. Just the water going on, and the falls, and the torches on the far bank turning back.')],
            },
          ],
        },
        done: {
          id: 'a4-01-shallows-done',
          lines: [
            N('The baby yells. The woman laughs, once, a wet laugh that is almost crying.'),
            SA('Listen to him. He’s got the whole river’s voice.', 'soft'),
          ],
        },
      },
    ],
    complete: {
      id: 'a4-01-complete',
      lines: [
        N('In the hut, the woman dries him by the fire. The villagers call her Sanga, and tell you she has asked the river for a child for years.'),
        SA('I prayed for a son. I didn’t say what sort of road he should come by.', 'soft'),
        SA('She held him up till the end. Whoever she was, he’s mine to hold now.'),
        N('Your Nubbin sits by the baby’s basket and doesn’t move from it all night.'),
        N('Outside, the falls go on roaring. The page turns, slowly, by itself, and years go by in the turning.'),
      ],
    },
    rewards: [],
    sets: { 'a4-01': true },
    notes:
      'OPENING: night, rain, the falls drawn huge and going off the top of the page. The woman in the river is Sivagami (A4-14 ' +
      'reveals it); here she is never named and her face is never shown close. Her end is the river closing over a hand, no ' +
      'more. Sanga’s prayer is one line and plain (RELIGION in the header). The page-turn at the end is a time skip of ' +
      'twenty-five years; the art ages the village a little.',
  },

  // ---------------------------------------------------------------- A4-2
  {
    id: 'a4-02',
    code: 'A4-2',
    title: 'The Climb',
    source: `${FILMS}: the boy and the waterfall`,
    audience: 'teen',
    trigger: { where: WHERE, when: after('A4-1') },
    requires: ['A4-1'],
    speakers: [SANGA, SHIVUDU, VILLAGER],
    steps: [
      {
        id: 'a4-02-s1',
        goal: 'Watch the young man who keeps trying to climb the falls.',
        hint: 'Go to the deep pool at the foot of the waterfall.',
        check: 'watch:a4-shivudu:climb',
        scene: {
          id: 'a4-02-pool',
          lines: [
            N('Morning, years on: the village is the same village, a little more patched. The falls are exactly the same.'),
            N('Halfway up the cliff, a young man is clinging to the rock in the spray, grinning like he’s already won.'),
            N('He reaches for the next hold, and it isn’t there. He falls a very long way into the pool, with a shout of pure delight.'),
            VI('That’s Shivudu. That’s forty times he’s come off it, by my count, and he goes straight back up every time.'),
            N('Sanga is on the bank with a basket of washing, not looking, in the way of someone who can’t bear to look.'),
            SA('One day he’ll get to the top, and then where will I be?', 'sad'),
            N('Shivudu comes up out of the pool, shaking his hair, and sees your Nubbin on the rocks. Your Nubbin is already climbing.'),
          ],
        },
        done: {
          id: 'a4-02-pool-done',
          lines: [
            SH('Oh, you’re good. Look at you. You’ve got no fingers and you’re better at it than me.', 'happy'),
            N('Your Nubbin slides down a wet rock on its bottom and lands in his lap. They are friends at once.'),
          ],
        },
      },
      {
        id: 'a4-02-s2',
        goal: 'Help Shivudu find the handholds up the lower cliff.',
        hint: 'Your Nubbin is small enough to find the cracks in the spray. Follow where it goes.',
        check: 'climb:a4-falls:handholds',
        scene: {
          id: 'a4-02-holds',
          lines: [
            SH('There’s a ledge up there, past the green rock. I’ve touched it twice. I’ve never stood on it.'),
            N('The rock is black and slick. The water comes down beside you so loud that you feel it in your teeth.'),
            N('Your Nubbin goes ahead, into cracks too small for a hand, and pokes its head out of each one like a chick in a wall.'),
            SH('There! Where it is! There’s a hold where it is!', 'happy'),
            N('You learn the trick of it: watch where your Nubbin stops, and put your fingers there.'),
            N('Shivudu climbs beside you, faster, taking holds you wouldn’t have trusted, laughing when they hold.'),
          ],
          choices: [
            {
              id: 'left',
              label: 'Take the dry line, away from the water.',
              then: [N('Slower, and safer. Shivudu waits for you on every ledge, and pretends that he isn’t.')],
            },
            {
              id: 'spray',
              label: 'Go straight up through the spray, with him.',
              then: [N('You can’t see a thing. You climb by feel and by the small warm weight of your Nubbin pressing your hand to each hold.')],
            },
          ],
        },
        done: {
          id: 'a4-02-holds-done',
          lines: [
            N('The green-rock ledge. Shivudu stands on it, both feet, and spreads his arms out into the spray.'),
            SH('I’m standing on it! Amma! I’m standing on it!', 'happy'),
            N('Far below, Sanga does not look up from her washing, very hard.'),
          ],
        },
      },
      {
        id: 'a4-02-s3',
        goal: 'See what comes down the falls.',
        hint: 'Stay on the ledge and look up into the water.',
        check: 'watch:a4-mask:falls',
        scene: {
          id: 'a4-02-mask',
          lines: [
            N('Something comes down the falls, turning over and over in the white water. It hits the ledge and stops at Shivudu’s foot.'),
            N('A wooden mask. A woman’s face, carved and painted, with a crack across one cheek.'),
            SH('That’s come from the top. That’s come from up there.', 'think'),
            N('He holds it up against the sky. It looks back at him with its painted eyes.'),
            SH('Somebody lives up there. Somebody dropped this.'),
            N('Your Nubbin looks at the mask, then up at the top of the falls, which nobody has ever seen.'),
          ],
        },
      },
    ],
    complete: {
      id: 'a4-02-complete',
      lines: [
        N('That evening, Shivudu sits by the pool with the mask in his lap and doesn’t eat.'),
        SA('Don’t. Please don’t. Whatever is up there, it didn’t want you, or it would have come down.', 'sad'),
        SH('It came down, Amma. It just came down slowly.', 'soft'),
        N('Sanga looks at you, as if you might stop him. You both know you won’t.'),
        N('Your Nubbin falls asleep with one hand on the mask’s chin, as if keeping it from going anywhere without them.'),
      ],
    },
    rewards: [],
    sets: { 'a4-02': true },
    notes:
      'A climbing step with the Nubbin as the guide: it scrambles to the next safe hold and the player follows. Two routes ' +
      '(dry or spray), flavour only. "Amma" is mother (Telugu and Tamil both use it; advisers to confirm). The shrine-stone ' +
      'scene of the first film is left out (RELIGION). The mask is an original carving, not a copy of the film prop.',
  },

  // ---------------------------------------------------------------- A4-3
  {
    id: 'a4-03',
    code: 'A4-3',
    title: 'The Mask',
    source: `${FILMS}: the top of the falls and Avanthika`,
    audience: 'teen',
    trigger: { where: WHERE, when: after('A4-2') },
    requires: ['A4-2'],
    speakers: [SHIVUDU, AVANTHIKA, REBEL, GUARD],
    steps: [
      {
        id: 'a4-03-s1',
        goal: 'Climb the rest of the falls with Shivudu and your Nubbin.',
        hint: 'Keep to your Nubbin’s line. Rest on the ledges.',
        check: 'climb:a4-falls:top',
        scene: {
          id: 'a4-03-top',
          lines: [
            N('You go before dawn, so Sanga won’t have to watch. Shivudu has the mask tied at his back.'),
            N('Past the green rock the cliff leans out. Your Nubbin finds a crack and you all go into it, inch by inch.'),
            SH('If I fall from here, don’t tell her. Say I went to the market.'),
            N('Above the crack there is cloud, and then above the cloud there is a lip of rock, and then there is grass.'),
            N('Shivudu hauls himself over the edge and lies on his back in it, laughing at the sky.'),
            N('Up here it is snowing, just a little. Your Nubbin catches a flake and looks at it, outraged.'),
          ],
        },
        done: {
          id: 'a4-03-top-done',
          lines: [
            N('Below you, the whole valley is a green bowl with a white thread running down it. You came up that.'),
            SH('A whole world. There was a whole world up here the whole time.', 'soft'),
          ],
        },
      },
      {
        id: 'a4-03-s2',
        goal: 'Find whoever wore the mask.',
        hint: 'Follow the footprints in the snow into the forest.',
        check: 'find:a4-avanthika:forest',
        scene: {
          id: 'a4-03-forest',
          lines: [
            N('There are footprints in the light snow, and then there are a great many footprints, and broken branches.'),
            N('In a clearing, a woman in dark leathers is fighting four soldiers at once, and she is winning.'),
            GU('That’s one of the rebels! Take her alive!', 'angry'),
            N('Shivudu goes in without a word. He doesn’t carry a sword, and doesn’t seem to think he needs one.'),
            N('It is over fast. The soldiers run back into the trees, and the woman turns, and her sword is at Shivudu’s throat.'),
            AV('Who are you? Whose are you?', 'angry'),
            N('Your Nubbin steps between them with both hands up. It barely reaches her knee.'),
          ],
          choices: [
            {
              id: 'mask',
              label: 'Tell Shivudu to give her the mask.',
              set: { 'a4-mask': 'returned' },
              then: [
                N('He unties it and holds it out. She sees it, and the sword comes down an inch, which is the most anyone gets from her.'),
              ],
            },
            {
              id: 'speak',
              label: 'Tell her you came up the waterfall.',
              set: { 'a4-mask': 'told' },
              then: [
                AV('Nobody comes up the waterfall.', 'think'),
                N('Shivudu holds up the mask as proof. She looks at it a long time, and the sword comes down an inch.'),
              ],
            },
          ],
        },
        done: {
          id: 'a4-03-forest-done',
          lines: [
            AV('I dropped that in the river a month ago. I thought it was gone.'),
            SH('It wasn’t gone. It came to me.', 'soft'),
            AV('Don’t make it into a poem. I haven’t time for poems.'),
          ],
        },
      },
      {
        id: 'a4-03-s3',
        goal: 'Hear what Avanthika and her band are fighting for.',
        hint: 'Go with her to the rebels’ camp under the cliffs.',
        check: 'talk:a4-avanthika:mission',
        scene: {
          id: 'a4-03-camp',
          lines: [
            N('The rebels’ camp is cold and small. Nobody in it is older than thirty, and nobody laughs much.'),
            AV('There’s a woman in Mahishmati. A queen. She’s been chained in the palace courtyard for twenty-five years.'),
            AV('The king, Bhallaladeva, put her there. She gathers sticks every day for a fire. She says it’s his.'),
            RE('Our fathers swore to bring her out. Then we swore it. We’re not very good at it yet.', 'sad'),
            AV('The mask was how I’d get past the palace guards. Without it, the plan is me, shouting.', 'sad'),
            RE('We tried shouting last year. The gate didn’t notice.'),
            N('Shivudu looks at her, and then at the snow, and you can see him decide.'),
            SH('Then it’s my turn. I’ll bring her out. You can owe me.'),
          ],
          choices: [
            {
              id: 'help',
              label: 'Say you’ll come too.',
              then: [AV('A stranger and a… what is that?', 'think'), N('Your Nubbin sits down on her foot, as an answer.')],
            },
            {
              id: 'ask',
              label: 'Ask Avanthika why it matters to her.',
              then: [AV('Because she hasn’t stopped waiting. Somebody should be worth it.', 'soft')],
            },
          ],
        },
      },
    ],
    complete: {
      id: 'a4-03-complete',
      lines: [
        N('Avanthika gives Shivudu the mask back. He ties it to his belt.'),
        AV('Keep it. You brought it up. It’s yours now.', 'soft'),
        N('That night he sends a pebble down the falls with a strip of cloth tied round it: for Sanga, so she’ll know.'),
        N('Your Nubbin adds a leaf. It is the best leaf it could find in the snow.'),
      ],
    },
    rewards: [],
    sets: { 'a4-03': true },
    notes:
      'THE ROMANCE (care notes): the film’s secret marking of her hand and the armour scene are not used. They meet as equals: ' +
      'her sword, his mask, her cause. a4-mask = returned | told is flavour, read nowhere else; it is written so the art can ' +
      'show the mask on Shivudu’s belt or on hers in A4-4 to A4-6 (returned: his belt; told: hers). Snow at the top of a ' +
      'waterfall is the film’s; keep it light.',
  },

  // ---------------------------------------------------------------- A4-4
  {
    id: 'a4-04',
    code: 'A4-4',
    title: 'The Chained Queen',
    source: `${FILMS}: Devasena in the courtyard`,
    audience: 'teen',
    trigger: { where: WHERE, when: after('A4-3') },
    requires: ['A4-3'],
    speakers: [SHIVUDU, DEVASENA, GUARD, CROWD],
    steps: [
      {
        id: 'a4-04-s1',
        goal: 'Get into Mahishmati with Shivudu, disguised as labourers.',
        hint: 'Join the line of workers carrying stone through the great gate.',
        check: 'explore:a4-mahishmati:gate',
        scene: {
          id: 'a4-04-gate',
          lines: [
            N('Mahishmati sits in a ring of cliffs, white and gold, with walls you could lose a town behind.'),
            N('Thousands of workers stream through the gate carrying stone. Overseers walk beside them with whips they mostly don’t use.'),
            GU('Faster. The statue doesn’t raise itself.', 'angry'),
            N('Inside, half the sky is filled with scaffolding. Something enormous is under it, wrapped in cloth and ropes.'),
            SH('What’s that?'),
            N('A woman next to you, with stone dust in her hair, doesn’t look up.'),
            CR('The king. Him. Made out of gold, so we can look at him more.', 'sad'),
          ],
          choices: [
            {
              id: 'stone',
              label: 'Pick up a stone and carry it.',
              then: [N('It is heavier than it looks. Your Nubbin carries a pebble, very seriously, all the way in.')],
            },
            {
              id: 'look',
              label: 'Look up at the statue.',
              then: [N('It goes up and up. A guard sees you staring and shoves you along: staring is for the day it’s finished.')],
            },
          ],
        },
        done: {
          id: 'a4-04-gate-done',
          lines: [
            N('Shivudu keeps his head down, which you can see costs him something.'),
            SH('Twenty-five years she’s been in here. Where’s the courtyard?'),
          ],
        },
      },
      {
        id: 'a4-04-s2',
        goal: 'Find the chained queen in the palace courtyard.',
        hint: 'Slip away from the work line towards the old courtyard below the palace.',
        check: 'visit:a4-courtyard:chains',
        scene: {
          id: 'a4-04-chains',
          lines: [
            N('The courtyard is bare stone, open to the sun. In the middle of it a woman sits in chains, among a heap of dry sticks.'),
            N('Her hair is long and grey and wild. She is picking up one stick at a time, and laying it on the heap, very carefully.'),
            N('Nobody looks at her. People walk round the edge of the courtyard the way you walk round a grave.'),
            GU('She does it every day. Every day for twenty-five years. Says it’s for his fire.'),
            GU('The king lets her. He likes to watch.'),
            N('She looks up, straight at your Nubbin. Her eyes are clear, and not wild at all.'),
            DE('A new face. And a very small one.', 'think'),
          ],
        },
        done: {
          id: 'a4-04-chains-done',
          lines: [
            N('Shivudu has stopped walking. He stands at the edge of the courtyard and doesn’t know why he can’t move.'),
            SH('I know her. I don’t know her. Why do I know her?', 'shock'),
          ],
        },
      },
      {
        id: 'a4-04-s3',
        goal: 'Bring the queen water without being seen.',
        hint: 'Fill a cup at the trough while the guards change.',
        check: 'give:a4-devasena:water',
        scene: {
          id: 'a4-04-water',
          lines: [
            N('The guards change at noon. For the count of thirty, nobody is watching the middle of the courtyard.'),
            N('You fill a cup at the trough and walk out to her. Your Nubbin walks in front, so you look like you’re following it.'),
            DE('Water. Thank you. Nobody brings me water; it’s not allowed. I suppose you didn’t know.', 'soft'),
            N('She drinks half, and gives the rest to your Nubbin, who drinks it like medicine.'),
            DE('I’m Devasena. Once of Kuntala. I am waiting for my son.'),
            DE('Everyone says he’s dead. Everyone has said so for twenty-five years. Everyone is wrong.'),
            N('She lays another stick on the heap, without looking, like a stitch.'),
          ],
          choices: [
            {
              id: 'son',
              label: 'Ask her how she knows her son is alive.',
              then: [
                DE('The fire is for Bhallaladeva. Only my son can bring him to it.', 'soft'),
                DE('So when it’s ready, my son will come. That’s the whole of it.', 'soft'),
              ],
            },
            {
              id: 'help',
              label: 'Tell her someone is coming for her.',
              then: [DE('Someone always says so. You’re kind. Go before the guards come back.'), N('She means it. She also doesn’t believe you.')],
            },
          ],
        },
      },
    ],
    complete: {
      id: 'a4-04-complete',
      lines: [
        N('You get back to the work line as the new guards come out. Nobody saw.'),
        SH('Tomorrow they raise the statue. Every soldier in the city will be on the ropes.'),
        SH('Avanthika said it was my turn. Tomorrow’s my turn.'),
        N('Behind you, in the empty courtyard, you can hear one stick at a time going on to a heap.'),
      ],
    },
    rewards: [],
    sets: { 'a4-04': true },
    notes:
      'Devasena is dignified and sharp, never mad: her hair is wild and her mind isn’t. The heap of sticks is drawn growing ' +
      'over the page (A4-16 lights it). The overseers’ whips are carried, never used on screen. The statue is wrapped and ' +
      'faceless until A4-5.',
  },

  // ---------------------------------------------------------------- A4-5
  {
    id: 'a4-05',
    code: 'A4-5',
    title: 'The Statue',
    source: `${FILMS}: the raising of the statue and the rescue`,
    audience: 'teen',
    trigger: { where: WHERE, when: after('A4-4') },
    requires: ['A4-4'],
    speakers: [SHIVUDU, DEVASENA, BHALLA, WORKER, CROWD, GUARD],
    steps: [
      {
        id: 'a4-05-s1',
        goal: 'Take a place on the ropes for the raising of the statue.',
        hint: 'Find Shivudu by the great pulley, and take hold.',
        check: 'carry:a4-rope:statue',
        scene: {
          id: 'a4-05-ropes',
          lines: [
            N('Drums. The whole city is on the square, and a thousand workers are on the ropes, and the statue is coming up.'),
            N('It is gold and huge and it is the king, sword raised, looking down on everyone at once.'),
            N('On a high balcony, the man himself watches. He’s broad, and still, and he doesn’t blink much.'),
            BH('Higher. I want them to see it from the river.'),
            N('The rope you’re holding jerks. Somewhere up the line, a peg has snapped, and the statue leans.'),
            N('An old labourer has fallen under it, right in its shadow. Nobody is moving to him; everybody is holding on.'),
            WO('Leave me! Hold the rope, hold it, or it comes down on all of you!', 'shock'),
          ],
          choices: [
            {
              id: 'hold',
              label: 'Hold the rope with everything you’ve got.',
              then: [N('You lean back on it till your arms shake. Your Nubbin wraps itself round the rope in front of your hands.')],
            },
            {
              id: 'old',
              label: 'Let go and run to the old man.',
              then: [N('You get as far as his shoulders before you see you can’t lift him. Then a shadow falls over you both that isn’t the statue’s.')],
            },
          ],
        },
        done: {
          id: 'a4-05-ropes-done',
          lines: [
            N('Shivudu has the snapped rope. Just him, and the rope over his shoulder, and his feet dug into the stone.'),
            N('The statue stops leaning. It stands, slowly, back up into the sky.'),
            N('The old labourer crawls out from under the shadow. He looks up at Shivudu’s face, and his mouth opens.'),
          ],
        },
      },
      {
        id: 'a4-05-s2',
        goal: 'Hear what the crowd starts to call.',
        hint: 'Stay by Shivudu. Don’t let the guards pull him off the rope.',
        check: 'watch:a4-crowd:name',
        scene: {
          id: 'a4-05-name',
          lines: [
            WO('Baahubali.', 'shock'),
            N('He says it quietly, the way you say a word you haven’t been allowed to say for a long time.'),
            N('The woman beside him says it, then the men on the next rope. It goes across the square like a crack in ice.'),
            CR('Baahubali! Baahubali!', 'happy'),
            N('Shivudu looks round, baffled, with the rope still on his shoulder. He has no idea what they’re shouting.'),
            N('On the balcony, the king has gone white. He isn’t looking at the statue any more.'),
            BH('Who is that? Who is that man?', 'angry'),
          ],
        },
        done: {
          id: 'a4-05-name-done',
          lines: [
            N('Guards start pushing into the crowd. The crowd, for once, doesn’t move out of their way.'),
            N('Your Nubbin tugs your sleeve and points across the square, towards the courtyard. Nobody is guarding it.'),
          ],
        },
      },
      {
        id: 'a4-05-s3',
        goal: 'Get Devasena out of the courtyard in the confusion.',
        hint: 'Go now, while every guard is on the square. Your Nubbin knows the way.',
        check: 'escort:a4-devasena:gate',
        scene: {
          id: 'a4-05-rescue',
          lines: [
            N('Smoke from the festival fires drifts across the courtyard. You can hardly see the chains.'),
            N('Shivudu is there before you, with a hammer from the works. He breaks the chain at her ankle with one blow.'),
            DE('Who are you?', 'shock'),
            SH('Nobody. Somebody owed somebody a turn. Can you walk?'),
            DE('I’ve been walking round that heap for twenty-five years. I can walk.'),
            N('She stops at the edge of the courtyard and looks back at her sticks.'),
            DE('I’ll be back for those.', 'angry'),
            N('Your Nubbin takes her hand. You go out through the smoke, the four of you, and the city doesn’t see.'),
          ],
        },
      },
    ],
    complete: {
      id: 'a4-05-complete',
      lines: [
        N('Outside the walls, the drums have stopped. Behind you the shouting has turned into horns.'),
        N('Devasena keeps looking at Shivudu, sideways, as if he were a word she almost remembered.'),
        DE('You have a face I’ve seen before. Twice.', 'think'),
        SH('I’ve got a face that falls off waterfalls. That’s the only face I’ve got.', 'happy'),
        N('Behind you, on the road from the city, riders are coming. At the front is an old man on a grey horse.'),
      ],
    },
    rewards: [],
    sets: { 'a4-05': true },
    notes:
      'The statue is the king’s face in gold (original design). The chant is the name only (LIFTED TEXT: none). The rope-hold ' +
      'is a short tug minigame: hold to keep the meter up while Shivudu takes the snapped rope. The rescue is stealth in smoke, ' +
      'not a fight; no soldiers are hurt on screen. Bhadra is not in this page.',
  },

  // ---------------------------------------------------------------- A4-6
  {
    id: 'a4-06',
    code: 'A4-6',
    title: 'The Revelation',
    source: `${FILMS}: Kattappa knows the boy`,
    audience: 'teen',
    trigger: { where: WHERE, when: after('A4-5') },
    requires: ['A4-5'],
    speakers: [SHIVUDU, DEVASENA, KATTAPPA, AVANTHIKA],
    steps: [
      {
        id: 'a4-06-s1',
        goal: 'Get Devasena through the forest ahead of the riders.',
        hint: 'Keep to the trees. When the old warrior catches up, stay behind Devasena.',
        check: 'walk:a4-forest:pursuit',
        scene: {
          id: 'a4-06-chase',
          lines: [
            N('You run until the road is a long way behind. Then the riders come through the trees anyway.'),
            N('The old man on the grey horse is first. He is very old, with a shaved head and a sword that has seen everything.'),
            KA('Stand aside, boy. I am Kattappa. I serve the throne of Mahishmati, and she belongs to the throne.'),
            SH('She doesn’t belong to anyone.'),
            N('Shivudu puts himself between them, empty-handed. Kattappa gets down from his horse, slowly, as if it hurts.'),
            N('They fight. The old man is better than anyone you have ever seen, and Shivudu is better than that, and neither falls.'),
          ],
          choices: [
            {
              id: 'devasena',
              label: 'Stand in front of Devasena.',
              then: [DE('Child, I have been guarded enough for one lifetime.', 'soft'), N('She moves you gently aside, and watches.')],
            },
            {
              id: 'call',
              label: 'Shout at them both to stop.',
              then: [N('Neither of them hears. Your Nubbin covers its eyes, then uncovers one, because it has to see.')],
            },
          ],
        },
        done: {
          id: 'a4-06-chase-done',
          lines: [
            N('A blade cuts the cloth from round the boy’s head. His face is in the light of a torch.'),
            N('Kattappa stops, mid-swing. The sword drops out of his hand on to the leaves.'),
          ],
        },
      },
      {
        id: 'a4-06-s2',
        goal: 'See why the old warrior stops.',
        hint: 'Stay where you are. Let him come to the boy.',
        check: 'watch:a4-kattappa:kneel',
        scene: {
          id: 'a4-06-kneel',
          lines: [
            N('Kattappa looks at Shivudu’s face for a long time. His own face is doing something it hasn’t done in years.'),
            KA('Baahubali.', 'shock'),
            N('He goes down on his knees in the leaves. Then he takes the boy’s foot in both hands, and sets it on his own head.'),
            N('Shivudu stands there, with an old man’s head under his foot, and doesn’t understand any of it.'),
            SH('Get up. Please. Get up, sir. What are you doing?', 'shock'),
            KA('What I did for your father. The last time I did it, he was alive.', 'sad'),
            N('Devasena has stopped breathing. Then she sits down, very suddenly, on a root.'),
            DE('The fire. I said. I said when it was ready.', 'soft'),
          ],
        },
        done: {
          id: 'a4-06-kneel-done',
          lines: [
            N('Avanthika and the rebels come out of the trees, swords up, and stop dead at the sight.'),
            AV('Why is Kattappa on his knees?', 'shock'),
            N('Nobody answers. Your Nubbin climbs on to the old man’s shoulder, because somebody should.'),
          ],
        },
      },
    ],
    complete: {
      id: 'a4-06-complete',
      lines: [
        N('That night, in the rebels’ cave, Kattappa sits by the fire. Everybody else sits round him.'),
        SH('Who was my father? Who am I?'),
        KA('Your name is Mahendra. Your father was Amarendra. The people called him Baahubali: strong arms.', 'sad'),
        KA('You were king before you could walk. And your father was the best man I ever served.', 'sad'),
        KA('I’ll tell it from the beginning. It’s long, and the end is mine to carry.'),
        N('He looks at you, the stranger, briefly. Then he looks into the fire, and the page begins to turn back.'),
      ],
    },
    rewards: [],
    sets: { 'a4-06': true },
    notes:
      'THE FOOT ON THE HEAD is the film’s gesture of total devotion: advisers to confirm how it is drawn and that it reads as ' +
      'honour, not humiliation. The fight is fast and bloodless; the reveal is the cloth slipping and the torchlight. The ' +
      'page-turn back is the move into the flashback: A4-7 to A4-14 are twenty-five years earlier.',
  },

  // ---------------------------------------------------------------- A4-7
  {
    id: 'a4-07',
    code: 'A4-7',
    title: 'The Story Begins',
    source: `${FILMS}: Sivagami and the two princes`,
    audience: 'teen',
    trigger: { where: WHERE, when: after('A4-6') },
    requires: ['A4-6'],
    speakers: [KATTAPPA, SIVAGAMI, AMARENDRA, BHALLA, BIJJALA, AVANTHIKA],
    steps: [
      {
        id: 'a4-07-s1',
        goal: 'Fall into Kattappa’s story, and find yourself in old Mahishmati.',
        hint: 'Listen to the old man’s voice. When the cave fades, look for the throne room.',
        check: 'explore:a4-past:throne',
        scene: {
          id: 'a4-07-throne',
          lines: [
            KA('The king had died. His elder brother wanted the throne, but the court gave it to that brother’s wife, Sivagami, to hold.', 'think'),
            N('The cave fire stretches, and its walls go up and up into pillars. You are standing in a throne room, years ago.'),
            N('A woman sits on the throne with a baby on each arm, and a sword across her knees. A man in the crowd wants her dead.'),
            N('He comes out from behind a pillar with a knife. She doesn’t put down either baby.'),
            N('It is over before you understand it, and she hasn’t stood up. The man is on the floor, and the guards are taking him away.'),
            SI('This one is my son. This one is the dead king’s son, whose mother died the day he was born. Both are mine.', 'think'),
            SI('One of them will be king. Until then, I am. Is there anything else?'),
            N('Nobody says anything else. A man with a withered arm, at the side of the hall, looks at her with his whole face.'),
          ],
        },
        done: {
          id: 'a4-07-throne-done',
          lines: [
            KA('That man was Bijjaladeva, her husband. The throne should have been his, he thought. He thought it every day after.'),
            N('Your Nubbin has gone straight to the babies. One of them grabs its ear and laughs.'),
          ],
        },
      },
      {
        id: 'a4-07-s2',
        goal: 'Watch the two princes grow up in the training yard.',
        hint: 'Go down to the yard where a young Kattappa is teaching.',
        check: 'watch:a4-princes:training',
        scene: {
          id: 'a4-07-yard',
          lines: [
            N('The page flickers. The babies are young men now, in the dust of a training yard, and a younger Kattappa is shouting at them.'),
            KA('Bhalla, your strength is a wall. Walls fall. Amarendra, stop smiling at him and hit him.'),
            N('Bhallaladeva is a bull: huge, patient, unstoppable. He wins every bout he can win by force.'),
            N('Amarendra loses that kind, cheerfully. Then he wins the next three another way, and helps his cousin up.'),
            AM('Again? Again. You nearly had me.', 'happy'),
            BH('I did have you.', 'angry'),
            N('Your Nubbin sits on the fence by Amarendra’s water jug. He gives it a drink between bouts without being asked.'),
            BI('Look at him. Smiling at the servants. A king doesn’t smile at servants, my son.', 'angry'),
          ],
        },
        done: {
          id: 'a4-07-yard-done',
          lines: [
            N('Bhallaladeva doesn’t answer his father. He watches Amarendra laughing with the stable boys, and doesn’t answer.'),
          ],
        },
      },
      {
        id: 'a4-07-s3',
        goal: 'Talk to young Kattappa about the oath he keeps.',
        hint: 'He sits on the wall by the armoury when the princes have gone.',
        check: 'talk:a4-kattappa:oath',
        scene: {
          id: 'a4-07-oath',
          lines: [
            N('Young Kattappa sits on the armoury wall, oiling a blade. He has the same eyes as the old man in the cave.'),
            KA('You’re new. You stare at everything. Ask, then.'),
            KA('My family are sworn to the throne of Mahishmati. My father was, and his. Whoever sits there, I serve.'),
            KA('I don’t choose. That’s the point of an oath. If you choose, it isn’t one.', 'think'),
            N('He looks down at the yard, at Amarendra helping his cousin brush the dust off.'),
            KA('But I can love who I like. Nobody swore that out of me.', 'soft'),
          ],
          choices: [
            {
              id: 'heavy',
              label: 'Say that sounds heavy to carry.',
              then: [KA('It’s light, as long as the throne is good. I’ve never had it otherwise. Pray I never do.', 'think')],
            },
            {
              id: 'which',
              label: 'Ask which prince he loves.',
              then: [KA('I teach them both the same.'), N('He doesn’t take his eyes off Amarendra while he says it.')],
            },
          ],
        },
      },
    ],
    complete: {
      id: 'a4-07-complete',
      lines: [
        N('Back in the cave, for a moment, the old Kattappa stops and rubs his eyes.'),
        KA('They grew up. Both of them strong, both of them brave. The country loved one more than the other.', 'sad'),
        KA('Then the Kalakeyas came.'),
        AV('Could you skip to the bit with the sword?'),
        KA('No.'),
        AV('Fine. Carry on.'),
        N('She carries on listening, harder than anyone.'),
        N('The fire leaps, and you are in the past again, on a hill, at dawn, looking at an army.'),
      ],
    },
    rewards: [],
    sets: { 'a4-07': true },
    notes:
      'THE OATH (care notes): Kattappa is bound to the throne for life, as the films have it; he says so plainly and with ' +
      'dignity. The film uses the word "slave"; we use "sworn", and advisers may decide whether the plainer word is truer. ' +
      'The throne-room scene is staged without blood: the attacker is down and taken away. Sivagami holds both babies ' +
      'throughout (the film’s image, drawn originally).',
  },

  // ---------------------------------------------------------------- A4-8
  {
    id: 'a4-08',
    code: 'A4-8',
    title: 'The Kalakeya War',
    source: `${FILMS}: the war with the Kalakeyas`,
    audience: 'teen',
    trigger: { where: WHERE, when: after('A4-7') },
    requires: ['A4-7'],
    speakers: [KATTAPPA, SIVAGAMI, AMARENDRA, BHALLA, BIJJALA, VILLAGER, CROWD],
    steps: [
      {
        id: 'a4-08-s1',
        goal: 'Hear the queen mother’s terms for the war.',
        hint: 'Climb the hill where the royal tents look over the plain.',
        check: 'watch:a4-kalakeya:army',
        scene: {
          id: 'a4-08-hill',
          lines: [
            N('The plain below is dark with an army: many times bigger than Mahishmati’s, drawn up in rings round its chief’s banner.'),
            N('In front of their lines, roped together, are prisoners from the border villages: farmers, and children.'),
            SI('Whichever of my sons wins this war best will be king. I will judge what best is. That is my word.', 'think'),
            BI('Then it’s settled. My son is the strongest man alive.', 'happy'),
            BH('I’ll ride straight through them.'),
            AM('Through the prisoners, Bhalla? They’re in front for a reason.', 'think'),
            N('Your Nubbin looks at the roped people on the plain, and then at you, and doesn’t understand why anyone would do that.'),
          ],
          choices: [
            {
              id: 'ask-am',
              label: 'Ask Amarendra what he’ll do.',
              then: [AM('Win, if I can. Get those people out first, either way. There’s no throne worth standing on them.')],
            },
            {
              id: 'ask-ka',
              label: 'Ask Kattappa what he thinks.',
              then: [KA('I think there are three times more of them, and I think one of those boys has noticed something.', 'think')],
            },
          ],
        },
        done: {
          id: 'a4-08-hill-done',
          lines: [
            N('Amarendra is looking at the wind, and at the long grass of the plain, and at the carts of cloth and oil behind his lines.'),
            AM('I need everyone who can carry. Now. Before the sun’s high.'),
          ],
        },
      },
      {
        id: 'a4-08-s2',
        goal: 'Help carry the cloth and oil for Amarendra’s plan.',
        hint: 'Load the cloth from the carts and take it to the front line of Amarendra’s men.',
        check: 'carry:a4-cloth:front',
        scene: {
          id: 'a4-08-cloth',
          lines: [
            N('His plan is cloth. Long bolts of it, soaked in oil, stretched between pairs of horsemen.'),
            AM('We set the field between us and them alight. They can’t come through fire, and their prisoners are behind the line, not in it.'),
            KA('And how do you get the prisoners behind the line, my prince?', 'think'),
            AM('I go and fetch them.', 'happy'),
            N('You carry bolts of cloth till your arms ache. Your Nubbin carries the end of each one, which helps nobody, very bravely.'),
            N('The sun climbs. On the plain, the Kalakeya drums begin, slow and huge.'),
          ],
        },
        done: {
          id: 'a4-08-cloth-done',
          lines: [
            N('The riders go out with the cloth. Fire runs across the plain in a long bright line, and the Kalakeya ranks stop dead behind it.'),
            N('Amarendra goes the other way, round the end of the fire, towards the prisoners. Kattappa curses and goes after him.'),
          ],
        },
      },
      {
        id: 'a4-08-s3',
        goal: 'Lead the freed prisoners to safety behind the lines.',
        hint: 'Meet them at the gap in the fire and bring them up the hill.',
        check: 'escort:a4-prisoners:hill',
        scene: {
          id: 'a4-08-gap',
          lines: [
            N('They come through the gap in the smoke: farmers with cut ropes on their wrists, carrying children.'),
            VI('He cut us loose. The prince. He got down off his horse and cut us loose himself.', 'shock'),
            N('An old woman can’t keep up, so you give her your arm. Your Nubbin holds the hand of a boy who has stopped crying to stare at it.'),
            N('Behind you the battle is all noise and dust. You keep your eyes on the hill, and walk.'),
            VI('What’s his name? The one who came for us?'),
            N('You tell her. She says it over to herself, like something to keep in a pocket.'),
          ],
        },
      },
    ],
    complete: {
      id: 'a4-08-complete',
      lines: [
        N('By evening it is over. Mahishmati holds the field, and across it a great banner is down.'),
        KA('Bhallaladeva brought down the chief. Fairly. I watched it.', 'think'),
        N('Bhallaladeva stands on the plain with the chief’s banner at his feet, waiting for the kingdom.'),
        N('But the people coming up the hill aren’t calling his name. They’re calling the other one.'),
        CR('Amarendra! Baahubali! Baahubali!', 'happy'),
      ],
    },
    rewards: [],
    sets: { 'a4-08': true },
    notes:
      'THE KALAKEYAS (care notes): a large, proud, disciplined army; no gibberish language, no darkened skin, no "savage" ' +
      'framing. Their chief never speaks. Battle is heroic and offscreen in its detail: fire, dust, banners, the chief’s ' +
      'banner falling. No blood, no bodies. The fire line is the film’s tactic, staged as a carrying task.',
  },

  // ---------------------------------------------------------------- A4-9
  {
    id: 'a4-09',
    code: 'A4-9',
    title: 'The Queen Mother’s Word',
    source: `${FILMS}: Sivagami chooses the king`,
    audience: 'teen',
    trigger: { where: WHERE, when: after('A4-8') },
    requires: ['A4-8'],
    speakers: [KATTAPPA, SIVAGAMI, AMARENDRA, BHALLA, BIJJALA, CROWD],
    steps: [
      {
        id: 'a4-09-s1',
        goal: 'Stand in the great hall when Sivagami names the king.',
        hint: 'Find a place at the back of the hall, by the pillars.',
        check: 'visit:a4-court:naming',
        scene: {
          id: 'a4-09-naming',
          lines: [
            N('The great hall is packed to the doors. Bhallaladeva stands at the foot of the throne, the chief’s banner folded in his arms.'),
            SI('I said I would judge who won this war best. Bhallaladeva brought down the chief. Nobody here doubts his strength.'),
            BI('Then say it. Say his name.', 'happy'),
            SI('But a king does not only win. A king chooses whom he will save, when he can’t save everyone.', 'think'),
            SI('One of my sons rode straight at the prize. The other rode round, to fetch the people first.'),
            SI('Amarendra Baahubali will be king.'),
            N('The hall goes up in a roar, and Bijjaladeva shouts something nobody can hear. Bhallaladeva says nothing at all.'),
            CR('Baahubali! Baahubali!', 'happy'),
          ],
          choices: [
            {
              id: 'watch-am',
              label: 'Watch Amarendra.',
              then: [N('He goes to his cousin first, before the throne, and holds out his hand. Bhallaladeva shakes it, and smiles.')],
            },
            {
              id: 'watch-bh',
              label: 'Watch Bhallaladeva.',
              then: [N('He smiles and shakes his cousin’s hand. His eyes stay exactly as they were, like a lake with the lid on.')],
            },
          ],
        },
        done: {
          id: 'a4-09-naming-done',
          lines: [
            KA('Bhallaladeva was given command of the army. A great honour. He thanked his mother very nicely.', 'think'),
            KA('I should have listened to how nicely.', 'sad'),
          ],
        },
      },
      {
        id: 'a4-09-s2',
        goal: 'Speak with the queen mother on her terrace.',
        hint: 'A servant asks for “the stranger with the little one”. Follow her up to the terrace.',
        check: 'talk:a4-sivagami:word',
        scene: {
          id: 'a4-09-terrace',
          lines: [
            N('Sivagami is alone on a terrace above the city. Up close she is tired, and much more frightening.'),
            SI('You were on the hill. You brought the old women up. Thank you.'),
            SI('People think I enjoy it. Saying a thing, and it being so. I don’t. It just has to be someone.', 'think'),
            SI('A kingdom can’t run on maybe. When I give my word, the river can flood and the sky can fall. It holds.'),
            N('Your Nubbin climbs on to the terrace wall beside her. She doesn’t send it away.'),
            SI('What if I’m wrong one day? That’s what you’re thinking. I can see it.'),
          ],
          choices: [
            {
              id: 'wrong',
              label: '“What if you are?”',
              then: [SI('Then I’ll be wrong with my whole heart, and I’ll pay for it with my whole heart. That’s the bargain.', 'sad')],
            },
            {
              id: 'quiet',
              label: 'Say nothing.',
              then: [SI('Hm. You’re cleverer than my husband.'), N('She almost smiles. It’s gone before it lands.')],
            },
          ],
        },
      },
    ],
    complete: {
      id: 'a4-09-complete',
      lines: [
        SI('Before he’s crowned, Amarendra will travel the country as nobody. A king should see what he’s king of.'),
        SI('Kattappa goes with him. And you, stranger, since you’re so good at walking about.'),
        N('Below, in the courtyard, Amarendra is trying on a peasant’s cloth and looking very pleased with it.'),
        N('Your Nubbin runs down the stairs to him. It has decided, firmly, whose side it is on.'),
      ],
    },
    rewards: [],
    sets: { 'a4-09': true },
    notes:
      'Sivagami’s famous oath on her word is NOT quoted (LIFTED TEXT: none); her sense of it is in our own lines. She is ' +
      'formidable and sympathetic: she believes in her word because the kingdom needs one fixed thing. Her line "What if I’m ' +
      'wrong one day?" is set up here for A4-11 and A4-14.',
  },

  // ---------------------------------------------------------------- A4-10
  {
    id: 'a4-10',
    code: 'A4-10',
    title: 'Kuntala',
    source: `${FILMS}: Amarendra and Devasena in Kuntala`,
    audience: 'teen',
    trigger: { where: WHERE, when: after('A4-9') },
    requires: ['A4-9'],
    speakers: [KATTAPPA, AMARENDRA, DEVASENA, KUMARA],
    steps: [
      {
        id: 'a4-10-s1',
        goal: 'Travel the roads with Amarendra and Kattappa in disguise.',
        hint: 'Take the river road to the small kingdom of Kuntala.',
        check: 'walk:a4-kuntala:road',
        scene: {
          id: 'a4-10-road',
          lines: [
            N('On the road, Amarendra is a simple wandering man called nobody, and Kattappa is his long-suffering uncle.'),
            KA('Stop waving at everyone. Simple men don’t wave like princes.', 'angry'),
            AM('How do they wave, uncle?', 'happy'),
            N('He waves like a simple man, which turns out to be exactly the same, but with his mouth open. Kattappa groans.'),
            N('Kuntala is small and green and full of orchards, with a hill fort on top like a hat.'),
            KU('Strangers! Ah. Good morning. I am the commander of the guard. Please don’t be bandits.', 'shock'),
            N('The commander of the guard is a thin young man, Kumara Varma, holding his sword as if it might go off.'),
          ],
          choices: [
            {
              id: 'kind',
              label: 'Tell him you’re only travellers.',
              then: [KU('Oh, thank goodness. I’m the princess’s cousin. Mostly I’m in charge of the gate. Mostly the gate is fine.', 'happy')],
            },
            {
              id: 'tease',
              label: 'Ask whether he’s ever used the sword.',
              then: [KU('On a melon. Quite a big melon.', 'sad'), AM('That’s one more melon than most.', 'happy')],
            },
          ],
        },
        done: {
          id: 'a4-10-road-done',
          lines: [
            N('Your Nubbin offers Kumara Varma a windfall plum from the orchard. He takes it very formally, as tribute.'),
          ],
        },
      },
      {
        id: 'a4-10-s2',
        goal: 'See the princess of Kuntala at her archery.',
        hint: 'Go up to the fort’s yard, where everyone has stopped to watch something.',
        check: 'watch:a4-devasena:archery',
        scene: {
          id: 'a4-10-archery',
          lines: [
            N('In the fort yard, a young woman is shooting at a target at the far end of the orchard, one arrow at a time.'),
            N('Every arrow lands in the one before. It isn’t showing off; she looks bored with it.'),
            N('This is Devasena, before the chains. She is quick and proud, and laughs with her whole face.'),
            DE('Who’s the simple man staring at me? Kumara, why have you let a simple man in to stare at me?'),
            AM('I wasn’t staring. I was admiring the orchard.', 'happy'),
            DE('You were admiring the orchard with your mouth open.'),
            N('Kattappa puts his face in his hands. Your Nubbin stares at Devasena too, openly, with its mouth open.'),
          ],
        },
        done: {
          id: 'a4-10-archery-done',
          lines: [
            N('The young woman you met in chains is laughing at a prince in a peasant’s cloth. You keep that, carefully.'),
          ],
        },
      },
      {
        id: 'a4-10-s3',
        goal: 'Help bring in the arrows when raiders attack the orchard villages.',
        hint: 'Gather spent arrows from the orchard and run them up to Devasena’s wall.',
        check: 'collect:a4-arrows:orchard',
        scene: {
          id: 'a4-10-raid',
          lines: [
            N('A horn from the valley. Raiders, a big band of them, riding at the villages under the fort.'),
            DE('Kumara, the gate! Archers to the wall! Simple man, go and hide somewhere simple.'),
            N('Amarendra doesn’t hide. He climbs up beside her on the wall and takes a bow from the rack.'),
            AM('Three at once. Like this. Your fingers here, and here, and you don’t aim at all. You trust them.', 'think'),
            N('She looks at him sharply, and then she does it. Three arrows, three marks, at once.'),
            N('You run the orchard below the wall gathering spent arrows. Your Nubbin brings them back one at a time, like puppies.'),
            KU('I’m at the gate! I’m holding the gate! Is anyone else coming to the gate?', 'shock'),
          ],
          choices: [
            {
              id: 'gate',
              label: 'Run to help Kumara at the gate.',
              then: [N('He is holding it, alone, shaking all over and not moving an inch. You put your shoulder next to his.')],
            },
            {
              id: 'wall',
              label: 'Keep running arrows to the wall.',
              then: [N('Devasena takes them out of your hands without looking, three at a time. Not one of them misses.')],
            },
          ],
        },
        done: {
          id: 'a4-10-raid-done',
          lines: [
            N('The raiders turn and go, the way raiders do when a place turns out to have teeth.'),
            KU('I held the gate. Did everybody see? I held it.', 'happy'),
            N('Everybody saw. Kumara Varma stands a little differently from then on.'),
          ],
        },
      },
    ],
    complete: {
      id: 'a4-10-complete',
      lines: [
        N('That evening Devasena finds you in the orchard. She has a bow in her hands, not her best one, a plainer one.'),
        DE('You ran arrows in the open while they were shooting. That was stupid, and brave. Have this.'),
        DE('It’s the one I learnt on. It’s a good bow for somebody who isn’t very good yet.', 'happy'),
        N('Up on the wall, a simple man is talking to Kattappa very fast, and Kattappa is shaking his head, slowly.'),
        KA('He’s in love. On a secret journey. In disguise. With a princess. I’m too old for this.', 'sad'),
      ],
    },
    rewards: [
      {
        id: 'a4-bow',
        kind: 'cosmetic',
        label: 'Devasena’s Bow',
        description: 'A plain, well-worn practice bow from Kuntala, given for running arrows under fire. Your Keeper can carry it on their back in the Grove.',
      },
    ],
    sets: { 'a4-10': true },
    notes:
      'Amarendra’s "simple man" disguise is gentle comedy; nobody is mocked for being simple. The raiders are bandits, ' +
      'unnamed (the film’s Pindaris are left unnamed here). The three-arrow trick is the film’s; staged as an arrow-running ' +
      'task under the wall. No raider is shown hit. The reward is Devasena’s practice bow, which the outline lists as ' +
      '"Devasena’s bow".',
  },

  // ---------------------------------------------------------------- A4-11
  {
    id: 'a4-11',
    code: 'A4-11',
    title: 'The Promise',
    source: `${FILMS}: Sivagami’s promise and Amarendra’s choice`,
    audience: 'teen',
    trigger: { where: WHERE, when: after('A4-10') },
    requires: ['A4-10'],
    speakers: [KATTAPPA, AMARENDRA, DEVASENA, SIVAGAMI, BHALLA, BIJJALA],
    steps: [
      {
        id: 'a4-11-s1',
        goal: 'See what arrives in Kuntala from Mahishmati.',
        hint: 'Go down to the fort gate when the trumpets sound.',
        check: 'watch:a4-gifts:kuntala',
        scene: {
          id: 'a4-11-gifts',
          lines: [
            KA('Back home, Bhallaladeva had heard about the princess of Kuntala. He told his mother he wanted her.', 'sad'),
            KA('Sivagami promised her to him. She didn’t ask the princess. She didn’t think she needed to.'),
            N('In Kuntala, a train of carts arrives at the gate, heaped with gold and silk, and a letter with Mahishmati’s seal.'),
            DE('“The queen mother is pleased to accept the princess of Kuntala as a bride for her son.” Accept. Me. Like a parcel.', 'angry'),
            N('She doesn’t shout. She takes the letter to the gate, and hands it back to the messenger, with every chest of gold still shut.'),
            DE('Tell your queen I choose my own husband. I’ll choose with my own eyes, and so far they haven’t chosen hers.', 'angry'),
            N('The messenger turns very pale. Amarendra, behind her in his peasant cloth, has gone pale too, for different reasons.'),
          ],
          choices: [
            {
              id: 'tell',
              label: 'Tell Amarendra he should tell her who he is.',
              then: [AM('I know. I know. Tomorrow. Today she’s angry with Mahishmati, and I am Mahishmati.', 'sad')],
            },
            {
              id: 'ka',
              label: 'Look at Kattappa.',
              then: [KA('That letter will be in the queen mother’s hands in three days. This was not how anyone wanted this to go.', 'sad')],
            },
          ],
        },
        done: {
          id: 'a4-11-gifts-done',
          lines: [
            N('Three days later, soldiers of Mahishmati are on the road to Kuntala. The queen mother doesn’t take refusals.'),
            N('Amarendra walks down to meet them alone. Every man of them kneels to him in the road, and Devasena sees it from the wall.'),
            AM('I’m Amarendra Baahubali. I should have said. Come to Mahishmati as my guest, not anyone’s prize. I promise you that.', 'soft'),
            DE('You should have said. I’ll come, simple man. I want to hear that promise again in front of your mother.', 'think'),
          ],
        },
      },
      {
        id: 'a4-11-s2',
        goal: 'Stand in the great hall when two promises meet.',
        hint: 'Travel back to Mahishmati with Amarendra and Devasena.',
        check: 'visit:a4-court:promise',
        scene: {
          id: 'a4-11-hall',
          lines: [
            N('The great hall again. Devasena walks into it beside Amarendra, not a prisoner, with her chin up.'),
            SI('My son. You’ve brought the bride. Good. Bhallaladeva, come and greet her.'),
            AM('Mother. I promised to protect her. I promised her she’d choose. She’s chosen me.', 'think'),
            N('The hall goes so quiet you can hear the lamps. Two promises are standing in the room, facing each other.'),
            SI('I gave my word. You know what my word is.', 'angry'),
            SI('Choose, then. The throne, or the girl. You can’t have both, and I won’t take my word back.'),
            N('Bhallaladeva doesn’t move. He looks as if he has been waiting for this moment his whole life.'),
            N('Amarendra doesn’t take long. He takes Devasena’s hand.'),
            AM('Then give the throne to my brother. I won’t break my word to make yours whole.'),
          ],
        },
        done: {
          id: 'a4-11-hall-done',
          lines: [
            N('Bhallaladeva is crowned king. Amarendra is made commander of the army, and he bows to his cousin, and means it.'),
            KA('One promise. One promise, broken in the right place, and none of it happens.', 'sad'),
          ],
        },
      },
    ],
    complete: {
      id: 'a4-11-complete',
      lines: [
        N('At the coronation, the new king sits on the throne, and the crowd cheers, politely.'),
        N('Then Amarendra comes in, and the cheering doubles without anybody deciding to do it.'),
        BI('Hear that, my son? They’re cheering a commander louder than their king.', 'angry'),
        BH('I hear it, Father. I’ve always heard it.'),
        N('Your Nubbin, on Devasena’s shoulder, looks at the new king and climbs down, very quietly, behind her.'),
      ],
    },
    rewards: [],
    sets: { 'a4-11': true },
    notes:
      'The quotation marks in a4-11-gifts#3 are Devasena reading our own invented letter aloud; not lifted text. Sivagami is ' +
      'proud, not cruel: she believes her word is the kingdom’s spine, and this is where she is wrong (set up in A4-9). The ' +
      'Kuntala war of the film is folded into the soldiers on the road, which is also where Devasena learns who Amarendra ' +
      'is (a4-11-gifts-done), to keep the page at sixteen quests.',
  },

  // ---------------------------------------------------------------- A4-12
  {
    id: 'a4-12',
    code: 'A4-12',
    title: 'Exile of a King',
    source: `${FILMS}: Amarendra chooses honour, and lives among the people`,
    audience: 'teen',
    trigger: { where: WHERE, when: after('A4-11') },
    requires: ['A4-11'],
    speakers: [KATTAPPA, AMARENDRA, DEVASENA, SIVAGAMI, BHALLA, BIJJALA, CROWD],
    steps: [
      {
        id: 'a4-12-s1',
        goal: 'Witness the trial in the great hall.',
        hint: 'Devasena has been called before the throne. Go with her.',
        check: 'watch:a4-court:trial',
        scene: {
          id: 'a4-12-trial',
          lines: [
            KA('There was a captain of the palace guard who thought the palace women were his to bother. He laid hands on one of Devasena’s.', 'angry'),
            KA('Devasena drew her sword in the hall and struck his hand away. In Mahishmati, to draw in that hall is a crime.'),
            N('Now she stands before the throne. Bhallaladeva sits on it, looking calm and pleased, like a cat that has been handed a mouse.'),
            BH('A sword, drawn in my hall. The law is very clear.'),
            DE('So was he. Ask him what he did. Ask the women. Ask anybody.', 'angry'),
            N('Amarendra walks into the hall with the captain by the collar. He puts him down in front of the throne, not gently.'),
            AM('Ask him yourself, brother. In front of everyone. Then tell me which of them broke the law.', 'angry'),
          ],
          choices: [
            {
              id: 'stand',
              label: 'Stand beside Devasena.',
              then: [N('She doesn’t look at you, but her shoulder moves an inch towards yours. Your Nubbin stands on her other side.')],
            },
            {
              id: 'women',
              label: 'Look at the women of her household.',
              then: [N('They stand at the back, holding each other’s hands. None of them looks down, and none of them has to.')],
            },
          ],
        },
        done: {
          id: 'a4-12-trial-done',
          lines: [
            N('The captain confesses, in front of the hall. Nobody shows what happens to him next, and nobody asks.'),
            SI('You put your hands on a man in this hall. The commander of the army doesn’t do that. Your rank is gone, Amarendra.', 'angry'),
            SI('Leave the palace. Both of you. Live where you like.'),
          ],
        },
      },
      {
        id: 'a4-12-s2',
        goal: 'Walk the city with Amarendra and Devasena in their new life.',
        hint: 'Go down into the streets below the palace.',
        check: 'walk:a4-city:people',
        scene: {
          id: 'a4-12-streets',
          lines: [
            N('They move into a small house in the lower city, with a well in the yard and a fig tree that drops figs on the roof.'),
            N('Amarendra fixes things: gates, carts, a neighbour’s roof. People bring him their quarrels and he settles them sitting on a step.'),
            CR('Commander! Commander, the bridge has gone again!', 'happy'),
            AM('I’m not commander. I’m Amarendra. Bring a rope.', 'happy'),
            DE('That’s the third time this month.'),
            AM('It’s a popular bridge.'),
            DE('It’s a terrible bridge. You keep mending it with the same rope.', 'think'),
            AM('It’s good rope. We’ve been through a lot together.', 'happy'),
            N('Devasena shoots a fig off the roof without looking. It drops into his hand, and he eats it as if that was the plan.'),
            N('Devasena teaches the girls of the street to shoot. Her targets are the figs, and the figs are losing.'),
            DE('Look at him. He lost a throne and he’s never once looked happier.', 'soft'),
            N('She puts a hand on her middle, and you understand, and she sees you understand, and smiles.'),
            DE('Don’t tell him yet. I want to tell him under the fig tree.', 'happy'),
          ],
        },
        done: {
          id: 'a4-12-streets-done',
          lines: [
            N('That evening, under the fig tree, there is a shout of joy loud enough to bring the whole street out with lamps.'),
            N('Your Nubbin is so excited that it falls into the well, and has to be fished out with a bucket.'),
          ],
        },
      },
    ],
    complete: {
      id: 'a4-12-complete',
      lines: [
        N('Up in the palace, on a high balcony, two men watch the lamps in the lower city.'),
        BI('They love him more in the gutter than they love you on the throne.', 'angry'),
        BH('Then he can’t stay in the gutter. Or anywhere.'),
        N('Kattappa’s voice comes back, low, from the cave fire, years away.'),
        KA('This is the part I tell slowly. I’ve told it to myself every night for twenty-five years.', 'sad'),
      ],
    },
    rewards: [],
    sets: { 'a4-12': true },
    notes:
      'THE ASSAULT (care notes) is one line, said by Kattappa, never shown: "laid hands on". The film’s finger-cutting and ' +
      'beheading are replaced: Devasena strikes the hand away; the captain’s fate is offscreen and unsaid. The street life ' +
      'is warm and busy, and the pregnancy is told under the fig tree, offscreen.',
  },

  // ---------------------------------------------------------------- A4-13
  {
    id: 'a4-13',
    code: 'A4-13',
    title: 'The Order',
    source: `${FILMS}: Sivagami’s order and Kattappa’s duty`,
    audience: 'teen',
    trigger: { where: WHERE, when: after('A4-12') },
    requires: ['A4-12'],
    speakers: [KATTAPPA, AMARENDRA, SIVAGAMI, BHALLA, BIJJALA],
    steps: [
      {
        id: 'a4-13-s1',
        goal: 'See how the queen mother is deceived.',
        hint: 'Follow the voices to the queen mother’s rooms at night.',
        check: 'watch:a4-plot:queen',
        scene: {
          id: 'a4-13-plot',
          lines: [
            N('Night in the palace. Bhallaladeva kneels before his mother with his head bowed, and his voice shakes, beautifully.'),
            BH('He means to kill me, Mother. He has the army’s love. Tonight, or tomorrow. And after me, you.', 'sad'),
            BI('I’ve seen his men meeting. In the lower city. With swords.', 'angry'),
            N('It isn’t true, and you know it. You were in the lower city: his men were carrying rope, for a bridge.'),
            N('Sivagami looks from one face to the other. She has always been able to read men, but she can’t read her own son.'),
            SI('Kattappa.', 'think'),
            N('Kattappa comes in from the door, where he has been standing all along, and kneels.'),
            SI('Amarendra Baahubali is a traitor to this throne. You are sworn to this throne. Bring me his life.', 'angry'),
          ],
          choices: [
            {
              id: 'speak',
              label: 'Step forward and say it isn’t true.',
              then: [
                N('Nobody looks at you. Here, in the past, you are a stranger at the edge of a story that has already happened.'),
                N('Your words go into the room and don’t land anywhere. You still said them.'),
              ],
            },
            {
              id: 'ka',
              label: 'Watch Kattappa.',
              then: [N('He doesn’t move at all for a long time. Then his hands, on his knees, close into fists, and open.')],
            },
          ],
        },
        done: {
          id: 'a4-13-plot-done',
          lines: [
            KA('My queen. I beg you. Not him. Ask me for anything else.', 'sad'),
            SI('If you won’t, I’ll send someone who will. Or go myself.', 'angry'),
            N('He bows his head to the floor. When he gets up, he is a much older man.'),
          ],
        },
      },
      {
        id: 'a4-13-s2',
        goal: 'Follow Kattappa through the night.',
        hint: 'He leaves by the south gate in the rain. Keep him in sight.',
        check: 'wait:a4-kattappa:rain',
        scene: {
          id: 'a4-13-night',
          lines: [
            N('Rain. Kattappa walks to the lower city and knocks at the little house with the fig tree.'),
            KA('My prince. There’s trouble at the border camp. Your mother asks for you. Come with me.'),
            AM('Uncle. In this weather? Then of course.', 'happy'),
            N('Amarendra goes with him without a single question, and kisses Devasena at the door. She is very round now, and laughing.'),
            N('Out at the camp, men come at Amarendra out of the dark, many of them, sent by the king. He fights them off with Kattappa at his back.'),
            AM('Uncle, behind you! Stay behind me!', 'shock'),
            N('He turns his back on Kattappa to face the last of them, the way you turn your back on the one man in the world you trust.'),
          ],
        },
        done: {
          id: 'a4-13-night-done',
          lines: [
            N('The screen goes to rain. Only rain, falling on dark stone, for a long moment.'),
            N('When it comes back, Amarendra Baahubali is lying on the stone, and Kattappa is holding him, and he is gone.'),
            KA('His last words were for his mother, not himself. He was afraid they would come for her next.', 'sad'),
          ],
        },
      },
      {
        id: 'a4-13-s3',
        goal: 'Go to Kattappa in the rain.',
        hint: 'You can’t change what has happened. Choose what you say to him.',
        check: 'sit:a4-kattappa:rain',
        scene: {
          id: 'a4-13-rain',
          lines: [
            N('Kattappa kneels in the rain, holding the man he taught to fight. He doesn’t seem to know you’re there.'),
            N('Your Nubbin goes to him first. It sits against his knee, soaked, and doesn’t move.'),
            KA('I gave my oath before he was born. I kept it. Tonight I kept it.', 'sad'),
            KA('What sort of man keeps that?', 'sad'),
            N('He looks up at you. You are the only other living person here, and he is asking.'),
            N('Whatever you say, he will carry it. You can see that he will carry it a very long time.'),
          ],
          choices: [
            {
              id: 'hands',
              label: '“Your hands did it. Your heart never agreed.”',
              set: { 'a4-words': 'hands' },
              then: [
                Y('Your hands did it. Your heart never agreed to it.', 'soft'),
                N('He looks at his hands for a long time. Then he closes them, gently, round Amarendra’s.'),
              ],
            },
            {
              id: 'forgave',
              label: '“He forgave you. I saw his face.”',
              set: { 'a4-words': 'forgave' },
              then: [
                Y('He forgave you before he fell. I saw his face. He wasn’t angry. He was worried for his mother.', 'soft'),
                N('Kattappa makes a sound you will not forget. Then he nods, once, as if he has been told an order.'),
              ],
            },
            {
              id: 'stay',
              label: '“Stay alive. His son will need you.”',
              set: { 'a4-words': 'stay' },
              then: [
                Y('Then stay alive. Somebody has to tell his son who he was.', 'soft'),
                N('He looks towards the lower city, where a woman is waiting under a fig tree. Then he stands up, because there is a reason to.'),
              ],
            },
          ],
        },
      },
    ],
    complete: {
      id: 'a4-13-complete',
      lines: [
        N('Kattappa carries Amarendra back through the rain himself. He doesn’t let anyone help.'),
        N('You walk behind him all the way. Your Nubbin walks beside him, and he lets it.'),
        KA('I’ll keep what you said. I’ve nothing else left to keep.', 'sad'),
        N('In the cave, twenty-five years later, the old man stops talking. Nobody round the fire breathes.'),
        N('Shivudu is staring into the flames. You can’t see his face, and you are glad of it.'),
      ],
    },
    rewards: [],
    sets: { 'a4-13': true },
    notes:
      'THE SIGNATURE CHOICE (a4-13-rain) sets a4-words = hands | forgave | stay. You cannot change Kattappa’s deed; the ' +
      'choice is only what you say afterwards. Paid off in A4-16 (a4-16-words, base = hands; variants -forgave and -stay), ' +
      'three quests later; A4-15 echoes it without repeating the words. VIOLENCE (care notes): the deed happens while the ' +
      'screen shows only rain, then the plain line that he is gone. No blood, no blade shown in him. Amarendra’s last words ' +
      'are reported by Kattappa and paraphrased, not quoted. The famous question about why Kattappa did it is not quoted.',
  },

  // ---------------------------------------------------------------- A4-14
  {
    id: 'a4-14',
    code: 'A4-14',
    title: 'The Truth',
    source: `${FILMS}: Sivagami learns the truth and lifts the baby`,
    audience: 'teen',
    trigger: { where: WHERE, when: after('A4-13') },
    requires: ['A4-13'],
    speakers: [KATTAPPA, SIVAGAMI, DEVASENA, BHALLA, BIJJALA, CROWD],
    steps: [
      {
        id: 'a4-14-s1',
        goal: 'Be there when the queen mother learns the truth.',
        hint: 'Go up to the palace with Kattappa. Devasena is there, under guard.',
        check: 'visit:a4-palace:truth',
        scene: {
          id: 'a4-14-truth',
          lines: [
            N('The palace, a few days later. Devasena has been brought in under guard, with a newborn son in her arms.'),
            N('She looks at Sivagami across the hall with no fear at all. She has nothing left to be afraid of.'),
            DE('He loved you. He went out in the rain because he thought you’d called him. Did you call him?', 'angry'),
            N('In the doorway, Bijjaladeva is laughing with a courtier, too loudly, too sure, the way men laugh when they’ve won.'),
            BI('Meetings in the lower city! Swords! She swallowed it whole. My son can cry better than any actor.', 'happy'),
            N('He sees the queen mother looking at him, and stops laughing. It is much too late to stop.'),
            SI('Kattappa. What did I make you do?', 'shock'),
            KA('What you told me to, my queen.', 'sad'),
          ],
        },
        done: {
          id: 'a4-14-truth-done',
          lines: [
            N('Sivagami walks across the hall to Devasena. She looks at the baby for a long time.'),
            SI('I was wrong with my whole heart. Now I’ll pay with it.', 'sad'),
          ],
        },
      },
      {
        id: 'a4-14-s2',
        goal: 'Stand below the balcony when Sivagami names the new king.',
        hint: 'Go down into the square. Everyone is running to it.',
        check: 'watch:a4-sivagami:balcony',
        scene: {
          id: 'a4-14-balcony',
          lines: [
            N('Sivagami comes out on to the high balcony above the square with the baby in her arms. The city goes silent below her.'),
            N('She lifts him up, high, over her head, in both hands. The way you have seen someone hold him before.'),
            SI('This is Mahendra Baahubali, son of Amarendra. He is your king. That is my word.', 'angry'),
            CR('Baahubali! Baahubali!'),
            N('Behind her, in the doorway, Bhallaladeva has drawn his sword. Kattappa stands in front of him, unarmed.'),
            KA('Go, my queen. Go now. I’ll keep him here as long as I can.', 'angry'),
            N('Sivagami runs, with the baby, down the back stairs into the rain. Your Nubbin runs after her, and you run after it.'),
          ],
          choices: [
            {
              id: 'devasena',
              label: 'Look back for Devasena.',
              then: [
                N('Guards have her arms, and she doesn’t fight them. She is watching the baby go, and she looks almost happy.'),
                DE('Go! I’ll wait. I’m good at waiting!', 'angry'),
              ],
            },
            {
              id: 'run',
              label: 'Keep running.',
              then: [N('Down the stairs, through a gate, out on to the hills, and the rain gets heavier. The falls are somewhere ahead, roaring.')],
            },
          ],
        },
        done: {
          id: 'a4-14-balcony-done',
          lines: [
            N('Soldiers’ torches on the hill behind. A river ahead, fast and brown, and the noise of a great waterfall.'),
            N('Sivagami doesn’t stop at the bank. She walks into the river, holding the baby up above her head.'),
          ],
        },
      },
    ],
    complete: {
      id: 'a4-14-complete',
      lines: [
        N('You know this river. You have stood on this bank before, in this rain, with that red cloth going past.'),
        N('This time you know her name. This time, you know what she is paying.'),
        N('You don’t look away. Somebody should see her do it, all the way to the end.'),
        N('Downstream, lamps come on in the huts by the falls. A woman wades out further than anyone else.'),
        N('Then the river noise fills everything, and the page turns forward, and you are back in a cave by a fire.'),
      ],
    },
    rewards: [],
    sets: { 'a4-14': true },
    notes:
      'A4-14 closes the loop to A4-1: same river, same rain, same red cloth; the art reuses A4-1’s backgrounds, seen from the ' +
      'other bank. Sivagami’s end is the river (no more shown than in A4-1). The balcony lift is the film’s image, drawn ' +
      'originally, and her line is our own, not the film’s oath. Kattappa holding the door is a stand-off, not a fight.',
  },

  // ---------------------------------------------------------------- A4-15
  {
    id: 'a4-15',
    code: 'A4-15',
    title: 'Return to Mahishmati',
    source: `${FILMS}: the son comes home`,
    audience: 'teen',
    trigger: { where: WHERE, when: after('A4-14') },
    requires: ['A4-14'],
    speakers: [KATTAPPA, MAHENDRA, AVANTHIKA, DEVASENA, KUMARA, REBEL, CROWD],
    steps: [
      {
        id: 'a4-15-s1',
        goal: 'Sit by Kattappa’s fire as the story ends.',
        hint: 'Stay in the cave. The old man has one more thing to say, to you.',
        check: 'talk:a4-kattappa:fire',
        scene: {
          id: 'a4-15-fire',
          lines: [
            N('In the cave, the fire has burned down to red. Everyone round it is very quiet, and some of them have been crying.'),
            N('One place by the fire is empty. Devasena lived this story once, and couldn’t sit through hearing it told.'),
            RE('The queen went out alone to the forest edge. The king’s riders were waiting. They’re taking her back to the courtyard.', 'shock'),
            N('The young man who was Shivudu stands up. He looks taller than he did, which isn’t possible, and is.'),
            MA('Mahendra. My name is Mahendra Baahubali. My mother has waited twenty-five years, and she won’t wait in chains again.', 'angry'),
            AV('Then we go tomorrow. All of us.'),
            N('Kattappa doesn’t look at him. He is looking at you, across the fire, and his face is very strange.'),
            KA('You. You were there. In the rain, that night. You were there.', 'shock'),
            KA('Twenty-five years, and you haven’t aged a day. Your little one hasn’t either.', 'think'),
            N('Your Nubbin goes and sits against his knee, exactly as it did in the rain.'),
          ],
        },
        done: {
          id: 'a4-15-fire-done',
          lines: [
            KA('I don’t know what you are. I don’t need to. I kept what you told me. I kept it every night.', 'soft'),
            KA('I’ll give it to him when it’s time. Not yet.'),
          ],
        },
      },
      {
        id: 'a4-15-s2',
        goal: 'March on Mahishmati with Mahendra’s army.',
        hint: 'Walk with the rebels down from the hills. Others are joining on the road.',
        check: 'walk:a4-army:mahishmati',
        scene: {
          id: 'a4-15-march',
          lines: [
            N('It isn’t much of an army when it starts: Avanthika’s band, a few dozen, and an old man on a grey horse.'),
            N('Then the villages come out to the road: farmers, and their children, grown up now, whom a prince once cut loose.'),
            CR('We heard. His son. Is it true? Is it his son?', 'shock'),
            N('An old woman you once gave your arm to on a hill looks at you, puzzled, as if she can’t place your face.'),
            KU('Kuntala! Kuntala is here! Kuntala has… mostly me. And these men. But Kuntala is here!', 'happy'),
            N('It is Kumara Varma, grey at the temples now, with the same sword and much steadier hands.'),
            RE('Every mile, more of them. Every single mile.', 'happy'),
          ],
          choices: [
            {
              id: 'kumara',
              label: 'Greet Kumara Varma.',
              then: [KU('Do I know you? You look like someone who held a gate with me, once. That can’t be right.', 'think')],
            },
            {
              id: 'mahendra',
              label: 'Walk beside Mahendra.',
              then: [MA('I keep thinking I should be frightened. I keep being something else instead.'), N('Your Nubbin rides on his shoulder, as it did up the falls.')],
            },
          ],
        },
        done: {
          id: 'a4-15-march-done',
          lines: [
            N('By evening, the army is a river of torches, and the white walls of Mahishmati are in front of it.'),
          ],
        },
      },
      {
        id: 'a4-15-s3',
        goal: 'Raise the old banner of Mahishmati before the gate.',
        hint: 'Kattappa has kept the banner of Amarendra’s day. Help him set it up where the city can see.',
        check: 'place:a4-banner:gate',
        scene: {
          id: 'a4-15-banner',
          lines: [
            N('Kattappa unrolls a banner from his saddle bag. It is old and faded and carefully mended, many times.'),
            KA('The banner of the day Amarendra was named. I took it down from the hall the night I… I’ve kept it.', 'sad'),
            N('You and the rebels dig the pole in on the hill opposite the gate. Your Nubbin holds the rope, and is lifted off its feet.'),
            N('The banner goes up, and the wind takes it. On the walls of Mahishmati, people stop and look.'),
            N('Then, very faintly, from inside the city, a sound you know: the name, said the way people say a word they’ve been forbidden.'),
            MA('They remember him.', 'soft'),
            KA('They never stopped. They only stopped saying it.'),
          ],
        },
      },
    ],
    complete: {
      id: 'a4-15-complete',
      lines: [
        N('Late that night, someone in the city leaves the small north gate unbarred. Nobody ever finds out who.'),
        AV('Tomorrow, then. The courtyard first. Her first.', 'angry'),
        MA('Her first. Then him.'),
        N('Kattappa gives you the corner of the banner that tore off in the wind. It is gold and red and very soft with age.'),
        KA('For wherever you go back to. So someone there knows his name.'),
      ],
    },
    rewards: [
      {
        id: 'a4-banner',
        kind: 'decor',
        label: 'Mahishmati Banner',
        description: 'A tall red-and-gold banner on a pole, mended many times, from the hill before Mahishmati’s gate. It stirs in the Grove wind even when there isn’t any.',
      },
    ],
    sets: { 'a4-15': true },
    notes:
      'Back in the present. Devasena is retaken by the king’s riders while Kattappa tells the story (a4-15-fire), as in ' +
      'the second film, so A4-16 finds her in the courtyard again; it is reported, never shown. Kattappa recognising the unaged stranger is the Atlas’s magic, played straight and never ' +
      'explained. a4-15-fire-done is the same for all three a4-words values: he says he kept it and does not repeat it (the ' +
      'payoff is A4-16). The old woman and Kumara half-recognise you; that is all. The banner is an original design.',
  },

  // ---------------------------------------------------------------- A4-16
  {
    id: 'a4-16',
    code: 'A4-16',
    title: 'The Fire',
    source: `${FILMS}: the final battle and Devasena’s pyre`,
    audience: 'teen',
    trigger: { where: WHERE, when: after('A4-15') },
    requires: ['A4-15'],
    speakers: [KATTAPPA, MAHENDRA, DEVASENA, BHALLA, AVANTHIKA, CROWD],
    steps: [
      {
        id: 'a4-16-s1',
        goal: 'Get to Devasena in the courtyard while the battle is at the gates.',
        hint: 'Go in by the north gate with Avanthika. Keep low.',
        check: 'escort:a4-devasena:courtyard',
        scene: {
          id: 'a4-16-courtyard',
          lines: [
            N('Dawn, and horns, and the whole city shaking with it. Mahendra’s army is at the main gate, and you are not.'),
            N('You come in by the north gate with Avanthika, and run through empty streets to the courtyard.'),
            N('Devasena is there, in new chains, by her heap of sticks. She has heard the horns, and she is standing.'),
            DE('You. You came back. And the little one.', 'soft'),
            AV('Your son’s at the gate. He sent us for you.', 'happy'),
            DE('My son is at the gate.', 'soft'),
            N('She says it like the end of a very long sentence. Avanthika breaks the chain at her ankle.'),
            N('Devasena doesn’t run. She stands by her heap and waits, with her hand on it.'),
          ],
          choices: [
            {
              id: 'go',
              label: 'Ask her to come away to safety.',
              then: [DE('I’ve waited here twenty-five years. I can wait one more morning in the same spot.', 'soft')],
            },
            {
              id: 'stay',
              label: 'Stay beside her.',
              then: [N('She nods, as if you’d been expected. Your Nubbin sits on the edge of the heap, guarding it, very fiercely.')],
            },
          ],
        },
        done: {
          id: 'a4-16-courtyard-done',
          lines: [
            N('The gate goes. You hear it from here: a crack like the world’s biggest branch, and a roar.'),
          ],
        },
      },
      {
        id: 'a4-16-s2',
        goal: 'Stand with Devasena while her son and the king meet.',
        hint: 'Stay in the courtyard. Keep your Nubbin close.',
        check: 'watch:a4-duel:courtyard',
        scene: {
          id: 'a4-16-duel',
          lines: [
            N('They come into the courtyard fighting: the king, old now and still enormous, and the young man from the waterfall.'),
            BH('You have his face. I hated that face for twenty-five years. I can hate it for a few more minutes.', 'angry'),
            MA('You’ll have to. That’s all the time you’ve got.', 'angry'),
            N('It is a fight out of the old stories. They break a pillar, and the statue’s shadow swings over them as the sun climbs.'),
            N('Kattappa stands at the edge with his sword lowered. This fight isn’t his, and he knows it, and he watches every blow.'),
            N('In the end, Bhallaladeva is down on the stones of the courtyard, beside the heap of sticks, and does not get up.'),
            MA('Mother. It’s yours. You said it was yours.', 'soft'),
          ],
        },
        done: {
          id: 'a4-16-duel-done',
          lines: [
            N('Devasena picks up a torch from the wall. Her hand doesn’t shake at all.'),
            DE('Twenty-five years I told him this fire was his. I keep my word.', 'angry'),
          ],
        },
      },
      {
        id: 'a4-16-s3',
        goal: 'Stay with Devasena while she keeps her promise.',
        hint: 'Turn your Nubbin away from the fire. Keep your eyes on Devasena.',
        check: 'watch:a4-pyre:fire',
        scene: {
          id: 'a4-16-pyre',
          lines: [
            N('The courtyard empties of everyone but the few of you. Mahendra steps back, and Kattappa bows his head.'),
            N('Devasena walks to her heap of sticks, twenty-five years high, and puts the torch to it.'),
            N('The fire takes all at once, with a sound like a breath let out. You turn your Nubbin’s face into your coat.'),
            N('You keep your own eyes on Devasena. She doesn’t look away, so you don’t look away from her.'),
            N('Her face, in the firelight, isn’t angry any more, or anything. It is a woman putting something down.'),
            N('When the fire burns low, it is over, and Mahishmati is very quiet.'),
            DE('There. Done. I said I would.', 'soft'),
          ],
        },
        done: {
          id: 'a4-16-pyre-done',
          lines: [
            N('Devasena turns to her son, and opens her arms, and he walks into them like a boy coming in from a waterfall.'),
          ],
        },
      },
      {
        id: 'a4-16-s4',
        goal: 'Hear what Kattappa says to the son.',
        hint: 'Go with Kattappa to Mahendra in the courtyard.',
        check: 'talk:a4-kattappa:son',
        scene: {
          id: 'a4-16-words',
          lines: [
            N('Kattappa comes across the courtyard to Mahendra, very slowly. He kneels, the way he did in the forest.'),
            KA('My king. I owe you the truth, and I’ve given you it. Now I owe you this.', 'sad'),
            KA('Somebody told me something, the night your father died. A stranger. I’ve said it to myself every night since.', 'soft'),
            KA('My hands did it, son. My heart never agreed. Not for one moment. Not in twenty-five years.', 'sad'),
            N('Mahendra looks down at him for a long time. Then he takes the old man’s hands, both of them, and holds them.'),
            MA('Then your heart can stop carrying it. Get up, uncle. Please.', 'soft'),
            N('Kattappa gets up. He looks at you over Mahendra’s shoulder, and nods, once.'),
          ],
        },
      },
    ],
    complete: {
      id: 'a4-16-complete',
      lines: [
        N('Mahendra Baahubali is crowned in the great hall, with his mother on one side and Avanthika on the other.'),
        CR('Baahubali! Baahubali!', 'happy'),
        N('You don’t stay for the feast. Your Nubbin has gone to the courtyard window, and is looking towards the falls.'),
        N('You go home the long way: down the waterfall, hold by hold, the way you came up it, with your Nubbin showing you where.'),
        N('At the bottom, the page goes thin, and you step out on to the Grove grass, wet to the knees. The Grove falls look different now.'),
        N('There are handholds in them. Your Nubbin is already climbing.'),
      ],
    },
    rewards: [
      {
        id: 'a4-falls-climb',
        kind: 'feature',
        label: 'The Waterfall Climb',
        description: 'A new climbing route up the Grove falls, with handholds your Nubbin finds first. Unlimited: climb it as often as you like.',
      },
    ],
    sets: { 'a4-16': true, 'a4-done': true },
    notes:
      'THE SIGNATURE PAYOFF: a4-16-words is the base for a4-words = hands. With forgave, play ATLAS_A04_VARIANTS ' +
      'a4-16-words-forgave in its place; with stay, a4-16-words-stay. If a4-words is somehow unset (an old save), play the ' +
      'base. BHALLALADEVA’S END (care notes) is offscreen: he is down and does not get up; the pyre is lit and the camera ' +
      'holds on Devasena’s face while you turn your Nubbin away. Nothing on the pyre is described. No line may read as ' +
      'Devasena harming herself. The climb feature is an unlimited Grove activity (SIM): a climbing section on the Grove ' +
      'falls, unlocked by atlasDone(\'A4\'). a4-done is read by the Price of Power festival.',
  },
];

// =================================================================== variants

/**
 * Variant scenes chosen by flags. Each replaces the named base scene.
 * A4-16, step 4: a4-16-words is the base (a4-words = hands); these replace it.
 */
export const ATLAS_A04_VARIANTS: Scene[] = [
  // ---------------------------------------------------------------- A4-16, a4-words = forgave: replaces a4-16-words
  {
    id: 'a4-16-words-forgave',
    lines: [
      N('Kattappa comes across the courtyard to Mahendra, very slowly. He kneels, the way he did in the forest.'),
      KA('My king. I owe you the truth, and I’ve given you it. Now I owe you this.', 'sad'),
      KA('Somebody told me something, the night your father died. A stranger. I didn’t believe it for twenty-five years.', 'soft'),
      KA('Your father forgave me before he fell. He wasn’t angry. He was only worried for his mother.', 'sad'),
      KA('I believe it now. I’ve seen his son’s face, and it isn’t angry either.', 'soft'),
      N('Mahendra looks down at him for a long time. Then he kneels too, so they are face to face on the stones.'),
      MA('Then he and I agree. Get up, uncle. Please.', 'soft'),
      N('Kattappa gets up. He looks at you over Mahendra’s shoulder, and nods, once.'),
    ],
  },

  // ---------------------------------------------------------------- A4-16, a4-words = stay: replaces a4-16-words
  {
    id: 'a4-16-words-stay',
    lines: [
      N('Kattappa comes across the courtyard to Mahendra, very slowly. He kneels, the way he did in the forest.'),
      KA('My king. Somebody told me, the night your father died, to stay alive. A stranger.', 'soft'),
      KA('Somebody has to tell his son who he was, they said. So I stayed. Twenty-five years, I stayed.', 'sad'),
      KA('I’ve told you now. That was the whole of my reason. I don’t know what I’m for, after it.', 'sad'),
      N('Mahendra looks down at him for a long time. Then he takes the old man’s hands, both of them, and holds them.'),
      MA('Then stay a bit longer. I’ve got a lot to learn about him, and you’re the only one who can teach me.', 'soft'),
      N('Kattappa gets up. He looks at you over Mahendra’s shoulder, and nods, once.'),
    ],
  },
];

// =================================================================== flags and checks

/** Every flag this line sets (Atlas save only). It reads no Grove flag and writes none. */
export const ATLAS_A04_FLAGS: string[] = [
  'a4-01',
  'a4-02',
  'a4-03',
  'a4-04',
  'a4-05',
  'a4-06',
  'a4-07',
  'a4-08',
  'a4-09',
  'a4-10',
  'a4-11',
  'a4-12',
  'a4-13',
  'a4-14',
  'a4-15',
  'a4-16',
  'a4-done', // A4-16: the whole page; the Price of Power festival reads it through atlasDone('A4')
  'a4-mask', // returned | told (a4-03-forest): art only, which belt the mask hangs on in A4-4 to A4-6
  'a4-words', // hands | forgave | stay (a4-13-rain): THE SIGNATURE CHOICE, paid off in A4-16 (a4-16-words and variants)
];

export const ATLAS_A04_CHECKS: string[] = [
  'visit:a4-river:night',
  'carry:a4-baby:bank',
  'watch:a4-shivudu:climb',
  'climb:a4-falls:handholds',
  'watch:a4-mask:falls',
  'climb:a4-falls:top',
  'find:a4-avanthika:forest',
  'talk:a4-avanthika:mission',
  'explore:a4-mahishmati:gate',
  'visit:a4-courtyard:chains',
  'give:a4-devasena:water',
  'carry:a4-rope:statue',
  'watch:a4-crowd:name',
  'escort:a4-devasena:gate',
  'walk:a4-forest:pursuit',
  'watch:a4-kattappa:kneel',
  'explore:a4-past:throne',
  'watch:a4-princes:training',
  'talk:a4-kattappa:oath',
  'watch:a4-kalakeya:army',
  'carry:a4-cloth:front',
  'escort:a4-prisoners:hill',
  'visit:a4-court:naming',
  'talk:a4-sivagami:word',
  'walk:a4-kuntala:road',
  'watch:a4-devasena:archery',
  'collect:a4-arrows:orchard',
  'watch:a4-gifts:kuntala',
  'visit:a4-court:promise',
  'watch:a4-court:trial',
  'walk:a4-city:people',
  'watch:a4-plot:queen',
  'wait:a4-kattappa:rain',
  'sit:a4-kattappa:rain',
  'visit:a4-palace:truth',
  'watch:a4-sivagami:balcony',
  'talk:a4-kattappa:fire',
  'walk:a4-army:mahishmati',
  'place:a4-banner:gate',
  'escort:a4-devasena:courtyard',
  'watch:a4-duel:courtyard',
  'watch:a4-pyre:fire',
  'talk:a4-kattappa:son',
];
