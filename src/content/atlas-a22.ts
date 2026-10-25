/**
 * Atlas campaign, page A22: The Candle (Part M, rank 24). Sixteen quests, A22-1 to A22-16.
 *
 * SOURCE. Encanto, Walt Disney Animation Studios, 2021, directed by Jared Bush and Byron Howard
 * (co-director Charise Castro Smith). Rights: The Walt Disney Company holds the film, its story,
 * its characters, its designs and its songs. THIS PAGE CANNOT SHIP WITHOUT A LICENCE FROM DISNEY.
 * The Madrigals, Casita and Antonio's animals must look exactly as licensed, or not appear at all.
 * There are no Grove versions of them, and none of them leaves the page. The songs are not used at
 * all: not quoted, not paraphrased, not hummed. The family's silence about Bruno is shown, never
 * sung, and no line here echoes a song title.
 *
 * AUDIENCE. 'all', gentle throughout. The two lifted lines have `childLines`.
 *
 * FRAME. Nova's atlas falls open at a valley ringed by mountains in the Colombian coffee country:
 * white walls, red roofs, tall palms and a candle in a window. The page opens painted: you sit at
 * the edge of a painting of the night before Mirabel's own gift ceremony, ten years ago, and hear
 * Abuela tell how the candle began. Then the page turns to the morning of Antonio's ceremony, and
 * you are a traveller the Madrigals take in for a few days: Mirabel's second pair of hands. She
 * keeps her story. Your Nubbin falls in with Antonio's animals; from A22-3, Antonio is the only
 * one who understands it, and he tells you, with relish, what it thinks. Your Nubbin never speaks.
 * You carry a small lamp from your own Long-Grass post, which is how the page reads the Grove.
 *
 * GROVE STATE READ (read-only; the Atlas never writes a Grove flag). SIM: longGrassLantern()
 * returns 'flicker' | 'dark' | 'lit' | 'warm' (see the SIM notes at A22-1). It is read live when
 * each of these scenes is about to play, never stored in the Atlas save:
 *   - A22-1, step 2 done (the lamp): a22-01-lamp is the 'dark' scene as written (Abuela lights
 *     your empty lamp from the candle, so its flame is the candle's). A22_VARIANTS
 *     a22-01-lamp-flicker, a22-01-lamp-lit and a22-01-lamp-warm replace it.
 *   - A22-4, step 2 done: a22-04-lamp ('dark': the candle's flame in your lamp shudders with the
 *     candle); -flicker (both flames shudder); -lit and -warm (it holds, and Mirabel says "Yours
 *     didn't. Something is wrong with ours.", the outline's own line).
 *   - A22-13, step 3 done: a22-13-lamp ('dark': it goes out with the candle); -flicker (the
 *     candle's flame dies, your own thin blue one stays); -lit (the only light in the ruins);
 *     -warm (the night is oddly warm).
 *   - A22-16, step 1 done: a22-16-stub (dark) and -flicker, -lit, -warm: how your lamp meets the
 *     stub Mirabel lights for you from the new flame.
 *   - keptStone (the Long Night, chapter 10): A22-14, step 2 done. Without it, a22-14-pedro-done;
 *     with it, a22-14-pedro-done-kept: Abuela takes your cold hands in hers without a word.
 *   - The Grove keepsake: after A22-16, on the first return to the Grove, a22-grove-candle (the
 *     post is 'flicker' or 'dark') or a22-grove-candle-lit ('lit' or 'warm') plays once.
 *   - s24Done (S24). Hazel's margin note beside the river (A22-14): A22_VARIANTS
 *     'a22-margin-hazel', its text exactly as S24's notes give it.
 *
 * FLAGS WRITTEN (Atlas save only, all prefixed a22-):
 *   - a22-01 … a22-16: each quest on completion. a22-done: the whole page (A22-16); the Long
 *     Table festival and the Grove candle-holder read it through atlasDone('A22').
 *   - a22-job = eyes | ears | hands (A22-5, a22-05-plan): the signature choice. The scenes as
 *     written are the eyes path; ears and hands play A22_VARIANTS in A22-8 (ears only), A22-9,
 *     A22-15 and A22-16 (the photo). Paid off four to eleven quests later.
 *
 * LIFTED TEXT (copyrighted: two one-sentence lines, exactly as the outline lists them, from Save
 * the Cat's Encanto beat sheet; NOT yet checked against the licensed film, which the outline asks
 * for before ship; set with the game's curly apostrophes; each used once, each with childLines):
 *   1. Abuela, remembered at Mirabel's own ceremony: "Whatever Gift awaits will be just as special
 *      as you." a22-03-door#4.
 *   2. Mirabel, at the river: "We were given a miracle because of you." a22-14-pedro#10.
 * Every other line is original. No song lyrics; no song is named, quoted or paraphrased.
 *
 * CARE NOTES.
 *   - Displacement. The film draws on a real civil war of around 1900 but never names it, and
 *     neither does this page: "there was trouble in the land where we lived". The riders belong to
 *     no side, carry no flags, and are only ever a thin far-off line on a ridge or a bank. Pedro's
 *     death is told, not shown, in Abuela's words: he stayed on the bank so they could cross, and
 *     he did not come. For many Colombian families displacement is a living experience: keep it
 *     grave and true, never thrilling, never a set piece.
 *   - Abuela is never a villain. She is a frightened woman who held on too tight (cinder-love, in
 *     the valley's word, though nobody here says it), and she is loved. Her anger in A22-9 and
 *     A22-13 is fear; her apology at the river is whole.
 *   - Colombian life is everyday, never quaint: arepas, buñuelos, coffee sacks, the market,
 *     whitewash and red tile, Tía and Tío, Mamá and Papá, Abuela. No sombreros as jokes, no
 *     accents in the English text, no stereotypes. Dress follows the licensed designs.
 *   - ADVISERS NEEDED BEFORE SHIP (the outline asks for them to be commissioned, as Part L does for
 *     A5, A7 and A10; this script is written to be checked by them):
 *       - a historian of early-20th-century Colombia (the flight, the riders, the village);
 *       - Afro-Colombian and Indigenous advisers, including Zenú, for dress, names and the
 *         village's faces (the Learning Grove's sombrero vueltiao especially);
 *       - someone from a Colombian family that has lived through displacement, to read A22-1 and
 *         A22-14;
 *       - a Colombian Spanish reader for the family words and the food.
 *     Disney's own Colombian Cultural Trust is the model for this work, not a list of people to
 *     approach.
 *   - Hazel's third rule is acted (the stairs in A22-5, the rubble in A22-13, the river in
 *     A22-14) and never quoted.
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

const WHERE = 'Nova’s atlas: the Candle page (Atlas campaign)';
const after = (code: string) => `Any time after ${code}, from Nova’s atlas.`;
const FILM = 'Encanto (Walt Disney Animation Studios, 2021)';
const src = (part: string) => `${FILM}: ${part}`;

// ------------------------------------------------------------------ speakers

const MIRABEL = sp('a22-mirabel', 'Mirabel', `Mirabel Madrigal, the one without a gift (${FILM}); licensed design`);
const ABUELA = sp('a22-abuela', 'Abuela Alma', `Alma Madrigal, the grandmother who keeps the candle (${FILM}); licensed design`);
const JULIETA = sp('a22-julieta', 'Julieta', `Julieta Madrigal, Mirabel’s mother, who heals with food (${FILM}); licensed design`);
const AGUSTIN = sp('a22-agustin', 'Agustín', `Agustín Madrigal, Mirabel’s father (${FILM}); licensed design`);
const PEPA = sp('a22-pepa', 'Tía Pepa', `Pepa Madrigal, whose weather is her mood (${FILM}); licensed design`);
const FELIX = sp('a22-felix', 'Tío Félix', `Félix Madrigal, Pepa’s husband (${FILM}); licensed design`);
const ISABELA = sp('a22-isabela', 'Isabela', `Isabela Madrigal, the eldest sister, flowers (${FILM}); licensed design`);
const LUISA = sp('a22-luisa', 'Luisa', `Luisa Madrigal, the middle sister, strength (${FILM}); licensed design`);
const DOLORES = sp('a22-dolores', 'Dolores', `Dolores Madrigal, the cousin who hears everything (${FILM}); licensed design`);
const CAMILO = sp('a22-camilo', 'Camilo', `Camilo Madrigal, the cousin who changes faces (${FILM}); licensed design`);
const ANTONIO = sp('a22-antonio', 'Antonio', `Antonio Madrigal, five, who talks to animals (${FILM}); licensed design`);
const BRUNO = sp('a22-bruno', 'Tío Bruno', `Bruno Madrigal, the uncle who sees the future (${FILM}); licensed design`);
const MARIANO = sp('a22-mariano', 'Mariano', `Mariano Guzmán, Isabela’s would-be suitor (${FILM}); licensed design`);
const GUZMAN = sp('a22-senora-guzman', 'Señora Guzmán', `Mariano’s mother (${FILM}); licensed design`);
const NEIGHBOUR = sp('a22-neighbour', 'A neighbour', `A villager of the Encanto (${FILM}); drawn in the licensed style`);

const N = say('narrator');
const Y = say('you');
const MI = say('a22-mirabel');
const AB = say('a22-abuela');
const JU = say('a22-julieta');
const AG = say('a22-agustin');
const PE = say('a22-pepa');
const FE = say('a22-felix');
const IS = say('a22-isabela');
const LU = say('a22-luisa');
const DO = say('a22-dolores');
const CA = say('a22-camilo');
const AN = say('a22-antonio');
const BR = say('a22-bruno');
const MA = say('a22-mariano');
const SG = say('a22-senora-guzman');
const NB = say('a22-neighbour');

// =================================================================== THE CANDLE

export const ATLAS_A22: Quest[] = [
  // ---------------------------------------------------------------- A22-1
  {
    id: 'a22-01',
    code: 'A22-1',
    title: 'The Candle’s Story',
    source: src('the flight, the river and the miracle'),
    audience: 'all',
    trigger: {
      where: WHERE,
      when: 'Any time once Nova’s atlas is in the Grove; the first quest on the page.',
    },
    speakers: [ABUELA, MIRABEL],
    steps: [
      {
        id: 'a22-01-s1',
        goal: 'Step into the painted page and hear how the candle began.',
        hint: 'Touch the candle in the window on the atlas page, then sit at the edge of the painted bed.',
        check: 'explore:a22-page:painted-valley',
        scene: {
          id: 'a22-01-story',
          lines: [
            N('Nova’s atlas falls open at a valley ringed by green mountains. White walls, red roofs, tall palms, and a candle in one window.'),
            N('The page doesn’t come alive at once. It stays painted, and you step into the paint.'),
            N('It is night, years ago. In a bedroom made of brushstrokes, an old woman sits on a bed beside a little girl in round glasses.'),
            N('The little girl is far too excited to sleep. The old woman looks up at you, as if you had always been sitting there.'),
            AB('Come in, then. You may as well hear it too. Mirabel has heard it a hundred times, and she still wants it.'),
            MI('Tell the river part!', 'happy'),
            AB('First the beginning. When I was young there was trouble in the land where we lived, and we had to leave our home.'),
            N('The painting changes. A young couple on a road at night, with three babies wrapped against the cold.'),
            AB('My Pedro carried two of them, and I carried one. We walked for days, with the others who had to leave too.'),
            N('Far behind them, on a ridge, there is a thin dark line of riders. The painting does not bring them any closer.'),
            AB('At a river, they caught up with us. Pedro told me to cross with the babies. He stayed on the bank, so that we could.'),
            AB('He did not come.', 'sad'),
            N('In the painting, the candle in her hand blazes. The mountains rise round the river like hands closing round a flame.'),
            AB('And the candle made us a home, where no one could ever take it from us. A house that loves us. A miracle.', 'soft'),
          ],
          choices: [
            {
              id: 'listen',
              label: 'Keep listening.',
              then: [N('You keep very still. The little girl has her fist in the blanket, holding on to the part about the river.')],
            },
            {
              id: 'pedro',
              label: 'Ask about Pedro.',
              then: [
                AB('He was kind, and he was brave, and he was not very good at dancing. That is enough for one night.', 'soft'),
                N('She says it lightly. Her hand on the blanket doesn’t move at all.'),
              ],
            },
          ],
        },
        done: {
          id: 'a22-01-story-done',
          lines: [
            AB('Every child in this family is given a gift, when they are old enough. Tomorrow is yours, Mirabel.'),
            MI('What will it be?'),
            AB('Sleep, and see.', 'soft'),
          ],
        },
      },
      {
        id: 'a22-01-s2',
        goal: 'Walk into the valley on the morning of Antonio’s ceremony and meet the family.',
        hint: 'Let the page turn, then climb the hill from the market square to the house with green shutters.',
        check: 'visit:a22-casita:gate',
        scene: {
          id: 'a22-01-casita',
          lines: [
            N('The page turns by itself. The paint goes thin and bright and real: morning, ten years later, and a market full of noise.'),
            N('Up the hill is a house with white walls, green shutters and a red roof. Its shutters open and close by themselves.'),
            N('A young woman in round glasses and an embroidered skirt comes down the steps two at a time, with a list.'),
            N('You know the glasses. The little girl from the painting has grown up, and the house is the one the candle made.'),
            MI('Hi! Hello! You’re the traveller. Abuela said there’d be a traveller. Sorry, are you a traveller?'),
            N('The floor tiles clack in a ripple across the doorway, like a dog thumping its tail. Mirabel pats the doorframe.'),
            MI('That’s Casita. Casita, be nice. Guest.'),
            N('A shutter swings out and taps you gently on the shoulder.'),
            MI('I’m Mirabel. I don’t have a gift, before anyone tells you. It’s fine. It’s totally fine.'),
          ],
          choices: [
            {
              id: 'yes',
              label: 'Say you are the traveller.',
              then: [MI('Great. Perfect. You’re in the blue room. The house likes guests. Mostly.', 'happy')],
            },
            {
              id: 'nubbin',
              label: 'Point out that your Nubbin is travelling too.',
              then: [MI('Oh, hello! Look at you. Antonio is going to lose his mind. In a good way.', 'happy')],
            },
            {
              id: 'list',
              label: 'Ask what the list is for.',
              then: [MI('Tonight. Antonio’s gift ceremony. My little cousin. Everything has to be perfect, so it’s a long list.')],
            },
          ],
        },
        done: {
          id: 'a22-01-lamp',
          lines: [
            N('Abuela Alma meets you in the courtyard. She is older than in the painting, straight as a broom, with a black shawl.'),
            N('She looks at the little lamp at your belt, the one you took from your Long-Grass post. Its glass is dark.'),
            AB('Nobody in this house walks about in the dark. Come.'),
            N('She lights it from the candle in the window. The flame is gold and steady, and it isn’t yours, and it is very kind of her.'),
          ],
        },
      },
    ],
    complete: {
      id: 'a22-01-complete',
      lines: [
        N('Your room is small and blue, with a window over the valley. The bed turns its own covers down when you look at it.'),
        N('Your Nubbin climbs onto the windowsill and looks across the courtyard at the candle in the window opposite.'),
        N('Downstairs somebody is laughing, somebody is cooking, and somebody is shouting about chairs.'),
        N('Somewhere in the walls there is a small scurry, and then nothing.'),
      ],
    },
    rewards: [],
    sets: { 'a22-01': true },
    notes:
      'OPENING: the page stays painted for step 1 (a picture-book look, brushstrokes visible); Abuela’s tale plays over ' +
      'painted images, as the outline asks. CARE: the war is never named; the riders are a thin dark line on a far ridge and ' +
      'never come closer, never carry flags, never act on screen. Pedro’s death is told, not shown: “He did not come.” No ' +
      'music sting; one held note or silence. Step 2: the page turns to the present, ten years on. ' +
      'LAMP (SIM): when the step 2 done scene is about to play, read longGrassLantern() and play a22-01-lamp (dark) or ' +
      'A22_VARIANTS a22-01-lamp-flicker, a22-01-lamp-lit or a22-01-lamp-warm. SIM: longGrassLantern() is a read-only ' +
      'helper over Grove state, never stored in the Atlas save. In priority order: keptStone set → dark (the shard was never ' +
      'unmade); cinder set (S19, forgiven or remembered) → warm (S19 only runs if the stone was unmade, so the two never ' +
      'clash); chapter 10’s dawn reached → lit; chapter 4’s close reached → ' +
      'dark; otherwise flicker. The lamp is the Keeper’s belt lamp, drawn on the Keeper sprite on this page only.',
  },

  // ---------------------------------------------------------------- A22-2
  {
    id: 'a22-02',
    code: 'A22-2',
    title: 'The Family',
    source: src('the market morning and the gifts'),
    audience: 'all',
    trigger: { where: WHERE, when: after('A22-1') },
    requires: ['A22-1'],
    speakers: [MIRABEL, LUISA, PEPA, FELIX, ISABELA, DOLORES, CAMILO, JULIETA, AGUSTIN],
    steps: [
      {
        id: 'a22-02-s1',
        goal: 'Go down to the market with Mirabel.',
        hint: 'Follow Mirabel down the hill to the square.',
        check: 'walk:a22-market:town-square',
        scene: {
          id: 'a22-02-market',
          lines: [
            N('Market morning. The square is full of stalls: oranges, coffee sacks, bolts of bright cloth and somebody’s goat.'),
            MI('Okay. Quick tour. Everyone in my family has a gift, and everyone in town knows exactly what it is.'),
            N('A tall young woman walks past with a donkey over each shoulder.'),
            MI('That’s Luisa, my sister. Super strong. Hi, Luisa!'),
            LU('Hi. Can’t stop. The church is crooked again.'),
            N('A woman at a stall has a small grey cloud over her head. It is raining on her onions.'),
            MI('Tía Pepa. Her weather is her mood. Tía, the cloud.'),
            PE('What cloud? There is no cloud. I am perfectly calm.'),
            N('The cloud thunders, very quietly. A man in a yellow shirt hurries over and fans it away with his hat, laughing.'),
            MI('Tío Félix. He says his gift is Tía Pepa.'),
            FE('It is a very big gift. I am a lucky man!', 'happy'),
          ],
          choices: [
            {
              id: 'pepa',
              label: 'Tell Tía Pepa the cloud is fine.',
              then: [PE('It is fine, isn’t it?', 'happy'), N('The cloud turns into a small, pleased rainbow.')],
            },
            {
              id: 'felix',
              label: 'Ask Félix how he copes.',
              then: [FE('Umbrellas. Many umbrellas. And I tell her she’s beautiful, which is true, so it’s easy.', 'happy')],
            },
            {
              id: 'nubbin',
              label: 'Check on your Nubbin.',
              then: [N('Your Nubbin has found the goat, and the goat has found your Nubbin. They are deciding whether to be friends.')],
            },
          ],
        },
        done: {
          id: 'a22-02-market-done',
          lines: [N('Mirabel ticks something off her list and nearly walks into a post.'), MI('Next, my cousins. Brace yourself.')],
        },
      },
      {
        id: 'a22-02-s2',
        goal: 'Meet the rest of the Madrigals at the house.',
        hint: 'Go back up the hill with Mirabel and talk to the family in the courtyard.',
        check: 'talk:a22-madrigals:courtyard',
        scene: {
          id: 'a22-02-cousins',
          lines: [
            N('In the courtyard a young woman steps out of a cloud of petals. Perfect hair, perfect smile, roses at her feet.'),
            MI('My sister Isabela. Flowers. Everyone loves her. I love her!'),
            IS('Mirabel. And a guest. How nice.'),
            N('She smiles at you, and an orchid grows out of the wall beside your head. It is a lovely smile, and it doesn’t move at all.'),
            N('A girl in a pale dress drifts past, whispering very fast to nobody.'),
            MI('Cousin Dolores. She hears everything. If you sneeze in the market, she knows.'),
            DO('You did sneeze in the market. Bless you.'),
            N('A boy turns round, and he is Mirabel, then Félix. Then he is himself again, a lanky teenager, grinning.'),
            CA('Camilo. Faces. I can do yours if you stand still.'),
          ],
          choices: [
            {
              id: 'still',
              label: 'Stand still.',
              then: [
                N('Camilo looks at you hard, and then you are looking at yourself, a little taller, with better hair.'),
                CA('I improved you. You’re welcome.', 'happy'),
              ],
            },
            {
              id: 'move',
              label: 'Don’t stand still.',
              then: [CA('Fair. People hate it. Mostly my sisters. Mostly when I do them.')],
            },
          ],
        },
      },
      {
        id: 'a22-02-s3',
        goal: 'Eat in the kitchen with Julieta and Agustín.',
        hint: 'Follow the smell of arepas to the kitchen.',
        check: 'visit:a22-kitchen:casita',
        scene: {
          id: 'a22-02-kitchen',
          lines: [
            N('In the kitchen a woman with a kind, tired face is cooking arepas. A boy with a burnt finger eats one, and the burn is gone.'),
            JU('You must be hungry. Everyone who comes up that hill is hungry. Sit.'),
            N('The arepa is hot and buttery, with cheese in the middle. The ache in your legs from the long page just stops.'),
            AG('Welcome! Welcome. Don’t mind the bee. I’m used to the bee.'),
            N('A gentle man in glasses waves from the doorway. A bee is sitting on his nose.'),
            MI('Mamá and Papá. So that’s everyone. Everyone with a gift, I mean, and me.'),
            JU('He has had that bee since breakfast.'),
            AG('She’s fond of me.'),
            JU('She’s a bee, mi amor.'),
            AG('I never said she had good taste.', 'happy'),
            N('She counts on her fingers, gets to the end of one hand, and stops on a finger as if it were sore.'),
            N('Across the courtyard, at the far end of the house, there is a tower with a dark door. Everybody manages not to look at it, all at once.'),
            N('Félix starts to say a name. Pepa’s cloud cracks with thunder, and Félix turns it into a cough.'),
            N('Then everybody talks at once, about chairs.'),
          ],
          choices: [
            {
              id: 'ask',
              label: 'Ask about the tower.',
              then: [
                MI('Oh! That’s nobody. Nobody’s up there. It’s just a room.', 'shock'),
                N('She says it in a rush. Julieta puts another arepa on your plate, which is also an answer.'),
              ],
            },
            {
              id: 'leave',
              label: 'Let it go.',
              then: [N('You let it go. Mirabel gives you a small grateful look, and the house rattles a single tile, like a sigh.')],
            },
            {
              id: 'nubbin',
              label: 'Watch your Nubbin.',
              then: [N('Your Nubbin is at the courtyard’s edge, looking up at the tower. A small grey face looks back from a crack, and vanishes.')],
            },
          ],
        },
      },
    ],
    complete: {
      id: 'a22-02-complete',
      lines: [
        N('By afternoon you know the gifts by heart: healing, weather, strength, flowers, hearing, faces.'),
        N('Mirabel hangs paper lanterns, carries chairs and ties ribbons all day, and nobody once asks her to.'),
        MI('It’s fine. Somebody has to do the stuff that isn’t magic.', 'soft'),
        N('She says it brightly. Your Nubbin leans against her ankle anyway.'),
      ],
    },
    rewards: [],
    sets: { 'a22-02': true },
    notes:
      'THE SILENCE ABOUT BRUNO is shown, never sung or said: the tower nobody looks at, the thunder, the cough, the talk ' +
      'about chairs. No line may echo the film’s song about him. The grey face in the crack is one of Bruno’s rats. Food: ' +
      'arepas (Julieta heals with them); the kitchen is an everyday Colombian kitchen, never quaint.',
  },

  // ---------------------------------------------------------------- A22-3
  {
    id: 'a22-03',
    code: 'A22-3',
    title: 'Antonio’s Door',
    source: src('Antonio’s gift ceremony'),
    audience: 'all',
    trigger: { where: WHERE, when: after('A22-2') },
    requires: ['A22-2'],
    speakers: [PEPA, MIRABEL, ANTONIO, ABUELA],
    steps: [
      {
        id: 'a22-03-s1',
        goal: 'Find Antonio before his ceremony.',
        hint: 'Look in the nursery Antonio shares with Mirabel.',
        check: 'find:a22-antonio:nursery',
        scene: {
          id: 'a22-03-hiding',
          lines: [
            N('Evening: the courtyard is full of the whole town in their best clothes, every one holding a candle. Antonio is not.'),
            PE('Where is he? Where is my baby?', 'shock'),
            MI('I’ll find him. Come on. He likes hiding places.'),
            N('You find him under the bed in the nursery. He is five, he is lying on his tummy with his chin on his fists, and he is not coming out.'),
            AN('What if I don’t get one?', 'sad'),
            N('Mirabel lies down flat on the floor, so their faces are level. You do too, and so does your Nubbin.'),
            MI('Then you get to be you, which is already the best thing in this house.'),
            AN('You didn’t get one.'),
            MI('No. I didn’t.', 'soft'),
          ],
          choices: [
            {
              id: 'hand',
              label: 'Hold out your hand.',
              then: [N('Antonio looks at your hand for a long time, then takes Mirabel’s instead. That is the right answer, and you both know it.')],
            },
            {
              id: 'nubbin',
              label: 'Let your Nubbin go under first.',
              then: [N('Your Nubbin wriggles under the bed and lies down beside him, nose to nose. Antonio giggles before he can stop himself.')],
            },
            {
              id: 'wait',
              label: 'Wait.',
              then: [N('Nobody hurries him. After a while a small hand comes out from under the bed and finds Mirabel’s sleeve.')],
            },
          ],
        },
        done: {
          id: 'a22-03-hiding-done',
          lines: [AN('Will you walk me? Both of you?'), MI('All the way to the door.', 'soft')],
        },
      },
      {
        id: 'a22-03-s2',
        goal: 'Walk Antonio up to his door with Mirabel.',
        hint: 'Climb the stairs two steps behind Mirabel and Antonio.',
        check: 'escort:a22-antonio:gift-door',
        scene: {
          id: 'a22-03-door',
          lines: [
            N('The stairs are lined with family. On the landing a new door glows faintly, with no picture on it yet.'),
            N('Mirabel walks Antonio up, holding his hand. You walk two steps behind, between rows of candlelit faces.'),
            N('Halfway up, Mirabel slows down. You remember the painting: a little girl, ten years ago, on these same stairs.'),
            N('For a moment you see that night instead. Little Mirabel at a glowing door, and Abuela stooping to her.'),
            AB('Whatever Gift awaits will be just as special as you.', 'soft'),
            N('In the memory, little Mirabel reaches for the handle. The door’s light goes out, and the door fades back into wall.'),
            N('Then it is now again. Antonio is tugging her hand, and Abuela, at the top, is holding out the candle.'),
            N('Antonio touches his door. It blazes with light, and a picture of him grows on it, with animals all round.'),
            N('A toucan swoops down and lands on his head. A jaguar pads out of the jungle in his new room, then capybaras, then coatis.'),
            AN('They’re talking! I can hear them!', 'happy'),
            N('The courtyard roars. Mirabel cheers louder than anybody, and goes on cheering a beat too long.'),
          ],
          choices: [
            {
              id: 'cheer',
              label: 'Cheer with Mirabel.',
              then: [N('You cheer with her, until she stops, and then you stop too.')],
            },
            {
              id: 'look',
              label: 'Look at Mirabel.',
              then: [N('She catches you looking and smiles hard. Her glasses have steamed up, and she says it’s the candles.')],
            },
          ],
        },
        done: {
          id: 'a22-03-door-done',
          lines: [
            N('Antonio’s jaguar sniffs your Nubbin from head to foot. Your Nubbin holds very still, then sniffs it back.'),
            N('Your Nubbin trills at the jaguar. Antonio listens, delighted.'),
            AN('She says it smells like a garden. And your Nubbin says you snore.', 'happy'),
          ],
        },
      },
    ],
    complete: {
      id: 'a22-03-complete',
      lines: [
        N('The family photograph is taken on the stairs. Everyone crowds round Antonio, and the photographer waves Mirabel left, then out.'),
        N('She ends up at the edge of the courtyard holding a vase, smiling at the camera from very far away.'),
        N('Your Nubbin goes and sits by her feet, so that the vase and the Nubbin are at least in the same picture.'),
        MI('Thanks.', 'soft'),
      ],
    },
    rewards: [],
    sets: { 'a22-03': true },
    childLines: {
      'a22-03-door#4': 'Whatever is behind your door, little one, it will be good, because you are good.',
    },
    notes:
      'LIFTED TEXT 1: a22-03-door#4 (see the header). It plays as a memory: soften the colours and slow the scene for lines ' +
      '#3 to #5, then snap back. Antonio understands the animals, and from here on your Nubbin; he relays, the Nubbin ' +
      'never speaks. The jaguar is “she”. The photo with Mirabel at the edge is paid off in A22-16. CHANGE FROM THE ' +
      'OUTLINE: “That night Mirabel sleeps alone in the nursery” moves to A22-4’s complete scene, after the party, the same night.',
  },

  // ---------------------------------------------------------------- A22-4
  {
    id: 'a22-04',
    code: 'A22-4',
    title: 'The Cracks',
    source: src('the party and the cracks no one else sees'),
    audience: 'all',
    trigger: { where: WHERE, when: after('A22-3') },
    requires: ['A22-3'],
    speakers: [MIRABEL, ABUELA, ISABELA],
    steps: [
      {
        id: 'a22-04-s1',
        goal: 'Follow Mirabel through the party.',
        hint: 'Stay close to Mirabel at the edge of the courtyard.',
        check: 'walk:a22-party:courtyard',
        scene: {
          id: 'a22-04-party',
          lines: [
            N('The party fills the house. Music, dancing, food on every surface, Luisa holding up the piano so people can dance under it.'),
            N('Mirabel slips away to the edge of the courtyard, where it’s quieter. You follow her.'),
            MI('I’m happy for him. I am. I’m so happy for him.', 'sad'),
            N('There is a crack in the plaster by her hand. As you watch, it moves: it runs up the wall like a crack in ice, and splits.'),
            N('The cracks race across the tiles, under the dancers’ feet, up the stairs and along the landing, towards the candle.'),
            N('In the window, the candle’s flame shudders, and shrinks, and shudders.'),
            MI('No. No, no, no.', 'shock'),
            N('Mirabel runs. You run after her, through the dancers, and nobody else looks down.'),
          ],
          choices: [
            {
              id: 'cracks',
              label: 'Follow the cracks.',
              then: [N('You keep your eyes on the cracks. They are racing ahead of you, and they are all going one way: to the candle.')],
            },
            {
              id: 'mirabel',
              label: 'Keep up with Mirabel.',
              then: [N('You keep at her elbow, through a crowd that keeps stepping back into your way, all smiling.')],
            },
          ],
        },
        done: {
          id: 'a22-04-party-done',
          lines: [N('You reach the landing with her. The cracks reach it with you.')],
        },
      },
      {
        id: 'a22-04-s2',
        goal: 'Help Mirabel show the family the cracks.',
        hint: 'Stand on the landing by the candle with Mirabel.',
        check: 'inspect:a22-cracks:landing',
        scene: {
          id: 'a22-04-cracks',
          lines: [
            MI('Everybody! The house is in danger! Look at the cracks!', 'shock'),
            N('The music stops. The whole town turns round and looks up at the landing.'),
            N('The wall behind her is smooth, and the tiles are whole. Casita has mended every crack in the time it took to shout.'),
            AB('Mirabel. What cracks?', 'think'),
            MI('There were cracks. Right here, all through the house, and the candle was…'),
            N('The candle burns tall and still in the window, as if it had never moved.'),
            IS('Mirabel. It’s Antonio’s night.'),
            AB('Everything is fine. The miracle is strong. Music, please!', 'happy'),
            N('The music starts again, louder. People dance a little too fast, and nobody quite looks at Mirabel.'),
          ],
          choices: [
            {
              id: 'saw',
              label: 'Say you saw them too.',
              then: [
                Y('I saw them.'),
                N('Abuela looks at you, polite and closed, the way you look at a guest who has said something odd at dinner.'),
                AB('Our guest is tired. It was a long journey.'),
              ],
            },
            {
              id: 'quiet',
              label: 'Say nothing, and stay by Mirabel.',
              then: [N('You stand beside her and say nothing. It isn’t much, but she isn’t standing there alone.')],
            },
          ],
        },
        done: {
          id: 'a22-04-lamp',
          lines: [
            N('You look down at the lamp at your belt. Its gold flame, the one Abuela lit from the candle, is shuddering.'),
            N('It shudders exactly as the candle did. Then it steadies, at the same moment the candle does.'),
            MI('Yours too. You saw. You saw it.', 'shock'),
            N('She grips your wrist hard, then lets go, because her grandmother is watching.'),
          ],
        },
      },
    ],
    complete: {
      id: 'a22-04-complete',
      lines: [
        N('The party goes on until late. When the last neighbour goes home, the house tucks itself up, shutter by shutter.'),
        N('Mirabel sleeps alone in the nursery for the first time. Through the wall you hear her say goodnight to Antonio’s empty bed.'),
        MI('Night, Toñito.', 'soft'),
        N('Your Nubbin, without being asked, goes and sleeps on the end of her bed.'),
      ],
    },
    rewards: [],
    sets: { 'a22-04': true },
    notes:
      'LAMP (SIM): when the step 2 done scene is about to play, read longGrassLantern(): dark plays a22-04-lamp as written; ' +
      'flicker, lit and warm play A22_VARIANTS a22-04-lamp-flicker, a22-04-lamp-lit and a22-04-lamp-warm. With lit or warm ' +
      'the lamp holds and Mirabel says the outline’s line, “Yours didn’t. Something is wrong with ours.” STAGING: only ' +
      'the player and Mirabel see the cracks; they draw as dark lines racing through the tiles towards the window, then ' +
      'heal in a single frame when she shouts. Mirabel sleeping alone in the nursery is the outline’s A22-3 beat, moved here.',
  },

  // ---------------------------------------------------------------- A22-5
  {
    id: 'a22-05',
    code: 'A22-5',
    title: 'Abuela’s Prayer',
    source: src('Abuela at the candle, and Mirabel’s decision'),
    audience: 'all',
    trigger: { where: WHERE, when: after('A22-4') },
    requires: ['A22-4'],
    speakers: [MIRABEL, ABUELA],
    steps: [
      {
        id: 'a22-05-s1',
        goal: 'Follow the light on the landing at midnight.',
        hint: 'Creep out to the banister and stay out of sight.',
        check: 'watch:a22-abuela:candle',
        scene: {
          id: 'a22-05-prayer',
          lines: [
            N('Late at night you wake to a soft light on the landing. Mirabel is already there, crouched behind the banister.'),
            MI('Shh. Abuela.'),
            N('Abuela Alma is alone at the candle. Beside it hangs a painting of a young man with a kind face and a hat in his hands.'),
            N('She speaks to the painting the way you speak to someone across a kitchen table.'),
            AB('Pedro. Something is wrong. I can feel it, and I can’t see it.', 'sad'),
            AB('I have kept them safe. I have kept them strong. Every one of them has done their part.'),
            AB('Tell me what I am doing wrong. Tell me what to do, and I will do it.', 'soft'),
            N('The candle burns, and doesn’t answer. Abuela touches the frame very lightly, and goes to bed with her back very straight.'),
            N('Mirabel sits down on the top stair with her arms round her knees.'),
            MI('She’s scared. I’ve never seen her scared.', 'sad'),
          ],
          choices: [
            {
              id: 'sit',
              label: 'Sit down next to Mirabel.',
              then: [N('You sit down beside her on the stair. Neither of you says anything for a while, and that helps more than talking would.')],
            },
            {
              id: 'painting',
              label: 'Look at the painting.',
              then: [N('Pedro is painted young, with a straw hat in his hands. He looks like a man who would stay behind on a riverbank.')],
            },
          ],
        },
      },
      {
        id: 'a22-05-s2',
        goal: 'Decide how you will help Mirabel save the miracle.',
        hint: 'Choose your job: the eyes, the ears or the hands.',
        check: 'choose:a22-job:landing',
        scene: {
          id: 'a22-05-plan',
          lines: [
            N('Mirabel waits until her grandmother’s door closes. Then she stands up, and you can see the decision land.'),
            MI('Okay. Nobody else sees it. So I fix it. I save the miracle.', 'think'),
            MI('I don’t have a gift, so I don’t have a gift to lose. I can go where they can’t, and ask what they won’t.'),
            N('She is already writing a list on the back of her hand: 1. Save the miracle. 2. Don’t tell Abuela. 3. Breakfast.'),
            MI('But I can’t do it alone. Will you help me? What do you want to be?'),
            MI('My eyes, to map every crack? My ears, with Dolores, who hears everything? Or my hands, with Luisa, who carries everything?'),
          ],
          choices: [
            {
              id: 'eyes',
              label: 'Be the eyes: map the cracks with Mirabel.',
              set: { 'a22-job': 'eyes' },
              then: [
                MI('Yes. Two people looking. We start in the morning, and we write everything down.', 'happy'),
                N('She tears a page out of her sketchbook for you. On it, in ink, she has drawn the whole house.'),
              ],
            },
            {
              id: 'ears',
              label: 'Be the ears: make friends with Dolores.',
              set: { 'a22-job': 'ears' },
              then: [
                MI('Dolores. Good. She hears everything, and nobody ever listens to her. Be kind to her.'),
                N('From two floors away, a small voice says, “Thank you.” You both jump.'),
              ],
            },
            {
              id: 'hands',
              label: 'Be the hands: help Luisa with her loads.',
              set: { 'a22-job': 'hands' },
              then: [
                MI('Luisa. Yes. She’s carrying the whole town. If anything is cracking, she knows where it’s heavy.'),
                N('Outside, very late, something very heavy is being put down very carefully.'),
              ],
            },
          ],
        },
      },
    ],
    complete: {
      id: 'a22-05-complete',
      lines: [
        N('Mirabel shakes your hand, very formally, in the dark on the stairs.'),
        MI('Partners. Secret partners. Nobody can know, because if Abuela finds out I’m poking at the miracle…'),
        N('She doesn’t finish. Your Nubbin offers its stubby hand too, and she shakes that just as seriously.'),
        N('Then you both go to bed, and neither of you sleeps for ages.'),
      ],
    },
    rewards: [],
    sets: { 'a22-05': true },
    notes:
      'THE SIGNATURE CHOICE: a22-05-plan sets a22-job = eyes | ears | hands. It pays off in A22-8 (ears only), A22-9 (the ' +
      'dinner), A22-15 (the rebuilding) and A22-16 (who stands beside you in the photograph). The job runs quietly between ' +
      'quests: the later scenes speak of “days” of mapping, sitting with Dolores, or carrying for Luisa. CARE: Abuela at the ' +
      'candle is a prayer to her husband’s memory, shown with respect; the player watches from the stairs and is never asked ' +
      'to take part. Pedro’s portrait is the licensed design.',
  },

  // ---------------------------------------------------------------- A22-6
  {
    id: 'a22-06',
    code: 'A22-6',
    title: 'Luisa',
    source: src('Luisa and the weight she carries'),
    audience: 'all',
    trigger: { where: WHERE, when: after('A22-5') },
    requires: ['A22-5'],
    speakers: [MIRABEL, LUISA],
    steps: [
      {
        id: 'a22-06-s1',
        goal: 'Find Luisa at work in the village.',
        hint: 'Look for Luisa down by the river, where the donkeys are.',
        check: 'find:a22-luisa:village',
        scene: {
          id: 'a22-06-loads',
          lines: [
            N('In the morning Mirabel starts with Luisa, because Luisa notices when things get heavy.'),
            N('You find her at the edge of the village, carrying donkeys back from the river, two at a time.'),
            LU('Hi. Can’t talk. Donkeys. Then the bridge. Then the church wants moving a bit to the left.'),
            MI('The church?'),
            LU('The priest says the light’s better.'),
            N('She sets the donkeys down. Her left eye is twitching, very slightly, all the time.'),
            MI('Luisa. Have you seen anything weird? With the house? Cracks?'),
            N('Luisa goes still. Then she laughs, too loudly, and picks the donkeys up again.'),
            LU('I’m fine. Everything’s fine. I’m the strong one. Nothing cracks on me.'),
          ],
          choices: [
            {
              id: 'carry',
              label: 'Offer to carry something.',
              then: [
                LU('You?'),
                N('She hands you a sack of coffee beans, the smallest thing she has. You carry it as if it matters, and she notices.'),
              ],
            },
            {
              id: 'walk',
              label: 'Walk beside her, and don’t ask anything.',
              then: [N('You walk beside her all the way to the bridge. By the time you get there, her shoulders have come down half an inch.')],
            },
          ],
        },
        done: {
          id: 'a22-06-loads-done',
          lines: [N('By noon the bridge is mended and the church is a bit to the left. Luisa sits down on a wall as if somebody had cut her strings.')],
        },
      },
      {
        id: 'a22-06-s2',
        goal: 'Sit with Luisa in the shade.',
        hint: 'Sit on the wall beside her and let your Nubbin do what it likes.',
        check: 'sit:a22-luisa:wall',
        scene: {
          id: 'a22-06-boot',
          lines: [
            N('Your Nubbin, which has trotted behind the donkeys all morning, climbs onto Luisa’s boot, turns round twice, and falls asleep.'),
            N('Luisa looks down at it. She doesn’t move her foot.'),
            LU('It’s heavy. For a little thing.', 'soft'),
            LU('Do you ever feel like if you stop, even for a second, everything falls over?', 'sad'),
            MI('You can stop, Luisa.'),
            LU('I can’t. If I’m not strong, what am I for?', 'sad'),
            N('Nobody answers that, because there isn’t an answer that would help. Your Nubbin snores, very softly, on her boot.'),
            LU('There’s something. Before Tío Bruno left. He had a vision, about the house.', 'think'),
            LU('He went up his tower and saw something, and then he was gone. Abuela won’t have it talked about.'),
            MI('Saw what?'),
            LU('Nobody knows. It’s still up there, in his room. Nobody goes in his room.'),
          ],
          choices: [
            {
              id: 'thank',
              label: 'Thank her.',
              then: [LU('Don’t. I didn’t say anything.', 'soft'), N('But she smiles, a little, for the first time today.')],
            },
            {
              id: 'stay',
              label: 'Stay until your Nubbin wakes up.',
              then: [N('You stay. Luisa doesn’t move her boot for half an hour, and the town manages without her, and nothing falls over.')],
            },
          ],
        },
      },
    ],
    complete: {
      id: 'a22-06-complete',
      lines: [
        N('Your Nubbin wakes, yawns, and climbs down. Luisa stands up and stretches, and something in her back clicks.'),
        LU('Don’t tell anyone I sat down.', 'happy'),
        MI('Bruno’s tower. We have to go up.', 'think'),
        N('Up the hill, the tower at the end of the house stands with its back to everybody, as if it isn’t listening.'),
      ],
    },
    rewards: [],
    sets: { 'a22-06': true },
    notes:
      'Every job path plays this quest the same way. Luisa’s twitching eye is the film’s sign of strain; keep it small. ' +
      'Her fear of being useless is said plainly once and not dwelt on. No song: Luisa’s feelings are spoken, never sung. ' +
      'Your Nubbin on her boot is paid off in A22-15 on the hands path.',
  },

  // ---------------------------------------------------------------- A22-7
  {
    id: 'a22-07',
    code: 'A22-7',
    title: 'Bruno’s Room',
    source: src('the forbidden tower and the green glass'),
    audience: 'all',
    trigger: { where: WHERE, when: after('A22-6') },
    requires: ['A22-6'],
    speakers: [MIRABEL, ANTONIO],
    steps: [
      {
        id: 'a22-07-s1',
        goal: 'Get into Bruno’s tower without anyone seeing.',
        hint: 'Wait until the house is busy, then go to the dark door at the end of the landing.',
        check: 'explore:a22-tower:door',
        scene: {
          id: 'a22-07-door',
          lines: [
            N('You wait until the house is busy with dinner plans. Then Mirabel leads you along the landing to the door at the end.'),
            N('It is a dark door, with a hooded figure on it, half hidden. Its glow is very faint and very green.'),
            MI('Okay. In and out. Nobody will ever know.'),
            N('At the end of the corridor Antonio is sitting on the floor with a toucan and a coati, watching you with enormous eyes.'),
            AN('You’re going in Tío Bruno’s room.', 'shock'),
            MI('No. Yes. Don’t tell.'),
            N('Antonio listens to the coati, very seriously.'),
            AN('I won’t. She won’t either. She says your Nubbin is very brave and a bit silly.', 'happy'),
          ],
          choices: [
            {
              id: 'coati',
              label: 'Thank the coati.',
              then: [N('The coati sniffs, in a way you decide means you’re welcome. Antonio says it means “obviously”.')],
            },
            {
              id: 'nubbin',
              label: 'Ask Antonio what your Nubbin thinks.',
              then: [AN('It says it isn’t scared, because you’re here. And it’s a bit scared.', 'soft')],
            },
          ],
        },
        done: {
          id: 'a22-07-door-done',
          lines: [N('Mirabel pushes the door, and it opens onto sand.'), N('It closes behind you, by itself, softly. Casita doesn’t want anyone to hear.')],
        },
      },
      {
        id: 'a22-07-s2',
        goal: 'Climb the sand stairs to the top of the tower.',
        hint: 'Keep climbing; the steps shift under you. Cross the gap together.',
        check: 'climb:a22-stairs:tower',
        scene: {
          id: 'a22-07-stairs',
          lines: [
            N('Inside is a staircase going straight up, made of sand, with no top that you can see.'),
            N('The air smells of dust and old candles. Somewhere above, sand is pouring like a slow clock.'),
            N('The steps shift under your feet, and Mirabel climbs, and slips, and climbs again. Your Nubbin uses its wings, which helps a bit.'),
            N('Halfway up, the stairs crumble in front of you, and there is a long drop into the dark.'),
            MI('Okay. Big jump. Totally fine.', 'shock'),
            N('Mirabel looks at you.'),
          ],
          choices: [
            {
              id: 'jump',
              label: 'Jump first, and catch her.',
              then: [N('You jump, and land hard, sand to your knees. Mirabel jumps, and you catch her by the wrist.')],
            },
            {
              id: 'thread',
              label: 'Tie her embroidery thread to the rail.',
              then: [N('Mirabel’s bag is full of embroidery thread, of course. Twisted twelve times, it holds, just.')],
            },
            {
              id: 'nubbin',
              label: 'Let your Nubbin flap over first.',
              then: [N('Your Nubbin flaps over, puffing, and sits on the far side looking pleased. If it can, you can, so you both jump.')],
            },
          ],
        },
        done: {
          id: 'a22-07-stairs-done',
          lines: [N('At the top the stairs end at a cave mouth, glittering and green. Inside, the floor is covered in broken glass.')],
        },
      },
      {
        id: 'a22-07-s3',
        goal: 'Piece together the green glass of Bruno’s vision.',
        hint: 'Fit the pieces of glass together on the cave floor.',
        check: 'puzzle:a22-vision:cave',
        scene: {
          id: 'a22-07-glass',
          lines: [
            N('The pieces are thick, green and curved, like a big broken bottle. Every one has a bit of a picture in it.'),
            MI('His visions. He made them in glass. This is it. This has to be it.'),
            N('You lay the pieces on the cave floor. They click together where they fit, as if they wanted to.'),
            N('A hand, a pair of round glasses, a girl’s face.'),
            N('Behind the girl, the house. And through the house, running everywhere, the cracks.'),
            MI('That’s me.', 'shock'),
            MI('That’s me, and the house is breaking behind me.', 'sad'),
            N('Green light pours up out of the glass onto her face. Far below, the stairs are starting to slide.'),
          ],
          choices: [
            {
              id: 'wrap',
              label: 'Help her wrap the pieces.',
              then: [N('You wrap the glass in your scarf, every piece, as fast as you can.')],
            },
            {
              id: 'hold',
              label: 'Put a hand on her shoulder.',
              then: [N('She is shaking. You keep your hand there until she stops, which is not long, because the floor is moving.')],
            },
          ],
        },
      },
    ],
    complete: {
      id: 'a22-07-complete',
      lines: [
        N('You run. The sand stairs pour away under your feet, and you slide most of the way down with the glass held tight.'),
        N('You tumble out of the tower door onto the landing, covered in sand, and freeze.'),
        N('Isabela is walking past with a vase of lilies, perfectly dressed. She doesn’t see you; nobody does.'),
        MI('Nobody can know about this. Nobody.', 'shock'),
        N('Your Nubbin coughs up a small amount of sand.'),
      ],
    },
    rewards: [],
    sets: { 'a22-07': true },
    notes:
      'MINIGAME: the sand stairs are a short climb with shifting steps (no fall state: a slip slides you back a few steps). ' +
      'The glass is a simple jigsaw of about eight pieces that snap where they fit. The vision shows Mirabel and the cracking ' +
      'house; nothing frightening beyond that. The hooded figure on the door is the licensed design.',
  },

  // ---------------------------------------------------------------- A22-8
  {
    id: 'a22-08',
    code: 'A22-8',
    title: 'Secrets',
    source: src('Agustín keeps the secret until after dinner'),
    audience: 'all',
    trigger: { where: WHERE, when: after('A22-7') },
    requires: ['A22-7'],
    speakers: [MIRABEL, AGUSTIN, DOLORES, ABUELA, GUZMAN],
    steps: [
      {
        id: 'a22-08-s1',
        goal: 'Hide the glass in the nursery.',
        hint: 'Carry the wrapped glass to the nursery without being seen.',
        check: 'carry:a22-glass:nursery',
        scene: {
          id: 'a22-08-hide',
          lines: [
            N('You carry the wrapped glass to the nursery and slide it under Antonio’s old bed.'),
            N('Mirabel sits on the floor with her back to the bed. Her father puts his head round the door, and stops.'),
            AG('Is that sand? Why are you covered in sand?', 'shock'),
            MI('Papá. You can’t tell anyone. Promise.'),
            N('She shows him a piece of the glass. Agustín sits down slowly on the end of the bed, and a bee lands on his ear.'),
            AG('Bruno’s vision. Oh. Oh, no.', 'shock'),
            AG('Mariano’s family is coming to dinner tonight. He is going to propose to Isabela. Abuela has planned it for weeks.'),
            AG('We say nothing until after the dinner. One night. Then we tell Abuela, together, gently.', 'think'),
          ],
          choices: [
            {
              id: 'agree',
              label: 'Agree with him.',
              then: [Y('One night.'), AG('One night. Thank you.', 'soft')],
            },
            {
              id: 'disagree',
              label: 'Say Abuela should know now.',
              then: [AG('Maybe. Maybe you’re right. But not with the Guzmáns at the gate. Please.')],
            },
            {
              id: 'mirabel',
              label: 'Let Mirabel decide.',
              then: [MI('One night. Then everything.', 'sad')],
            },
          ],
        },
        done: {
          id: 'a22-08-hide-done',
          lines: [AG('And Mirabel? Wash the sand off. It’s in your ears.'), N('It is in your ears too.')],
        },
      },
      {
        id: 'a22-08-s2',
        goal: 'Get the house ready for the dinner.',
        hint: 'Lay the candles down the long table with Mirabel.',
        check: 'place:a22-candles:dining-room',
        scene: {
          id: 'a22-08-prep',
          lines: [
            N('The whole house is getting ready: tables, cloths, flowers, and Isabela’s hair, which Casita is helping with.'),
            N('Pepa’s cloud is very small and very tidy. Félix keeps telling her it will be lovely, which helps a bit.'),
            N('Mirabel lays candles down the long table, too carefully. She keeps looking at the nursery door.'),
            N('On the stairs Dolores is sitting with her hands over her ears. She looks up at you, and quickly away.'),
            MI('Dolores is weird today. Weirder.', 'think'),
            N('Down in the kitchen Julieta is frying buñuelos, and the smell goes all through the house.'),
          ],
          choices: [
            {
              id: 'candles',
              label: 'Help Mirabel with the candles.',
              then: [N('You lay candles together, all the way down. At the end she lets out a breath she has been holding since the tower.')],
            },
            {
              id: 'dolores',
              label: 'Smile at Dolores.',
              then: [N('Dolores smiles back, tightly, and puts her hands over her ears again.')],
            },
          ],
        },
        done: {
          id: 'a22-08-prep-done',
          lines: [N('The bell rings at the gate. The Guzmáns are here.'), MI('One night.', 'think')],
        },
      },
    ],
    complete: {
      id: 'a22-08-complete',
      lines: [
        N('Mariano Guzmán comes in with his mother. He is tall, serious, and holding flowers for Isabela, who has more flowers than anybody.'),
        N('Dolores, on the stairs, watches him go by with a look you can’t read.'),
        SG('What a house. What a family!', 'happy'),
        AB('Welcome. Sit, sit. Tonight is a night for the family.', 'happy'),
      ],
    },
    rewards: [],
    sets: { 'a22-08': true },
    notes:
      'JOB PAYOFF (a22-job, from A22-5): for ears, play A22_VARIANTS a22-08-prep-done-ears instead of a22-08-prep-done: ' +
      'Dolores tells you first, wretchedly, that she has heard everything. Eyes and hands play the scenes as written. ' +
      'Food: buñuelos. Dolores’s look at Mariano is a seed for A22-9 and A22-15 (she loves him; nobody says so).',
  },

  // ---------------------------------------------------------------- A22-9
  {
    id: 'a22-09',
    code: 'A22-9',
    title: 'The Dinner',
    source: src('the dinner with the Guzmáns'),
    audience: 'all',
    trigger: { where: WHERE, when: after('A22-8') },
    requires: ['A22-8'],
    speakers: [GUZMAN, DOLORES, PEPA, MIRABEL, LUISA, MARIANO, ABUELA, FELIX],
    steps: [
      {
        id: 'a22-09-s1',
        goal: 'Sit down to dinner with the Madrigals and the Guzmáns.',
        hint: 'Take your seat at the long table, beside Mirabel.',
        check: 'sit:a22-dinner:dining-room',
        scene: {
          id: 'a22-09-dinner',
          lines: [
            N('The long table is full: candles, flowers, Julieta’s best dishes. Casita passes the plates along by itself, tile by tile.'),
            SG('Mariano has something he would like to ask.', 'happy'),
            N('Mariano clears his throat, and Isabela smiles her perfect smile. Under the table, Mirabel’s knee is jiggling.'),
            N('Then a little sound starts on the stairs. Dolores, whispering to herself, very fast.'),
            DO('Vision. Mirabel. The house. The glass…'),
            N('The whisper goes round the table like a draught. Camilo turns into a hooded figure before he can stop himself.'),
            PE('Bruno? A vision?', 'shock'),
            N('A little rain starts to fall on the table, then a lot. Isabela’s flowers start growing out of the soup.'),
            N('And under the table, very quietly, the floor begins to crack.'),
            MI('Everybody, wait, please, it’s not…', 'shock'),
          ],
          choices: [
            {
              id: 'mirabel',
              label: 'Grab Mirabel’s hand under the table.',
              then: [N('She grips your hand so hard it hurts. Then she lets go, because you both have work to do.')],
            },
            {
              id: 'job',
              label: 'Remember your job.',
              then: [N('You remember the stairs at midnight, and what you promised. You push your chair back.')],
            },
          ],
        },
      },
      {
        id: 'a22-09-s2',
        goal: 'Do the job you chose on the landing.',
        hint: 'Eyes: watch the wall the crack is running for. Ears: get Dolores out. Hands: hold up the table with Luisa.',
        check: 'inspect:a22-wall:dining-room',
        scene: {
          id: 'a22-09-eyes',
          lines: [
            N('Everything happens at once. You remember your job: you are the eyes.'),
            N('You have mapped the cracks with Mirabel for days, on her drawing of the house. You know where they run.'),
            N('The crack under the table is running for the east wall, where the big painted dresser stands, full of plates.'),
            N('Señora Guzmán is sitting right underneath it, telling Julieta the soup is lovely. The soup is full of roses.'),
            N('Mirabel sees where you are looking, follows your eyes, and goes white.'),
            MI('The wall! The east wall!', 'shock'),
          ],
          choices: [
            {
              id: 'warn',
              label: 'Shout to Señora Guzmán to move.',
              then: [Y('Señora! Move!'), N('She moves. The dresser comes off the wall a moment later, and Luisa catches it, plates and all.')],
            },
            {
              id: 'pull',
              label: 'Pull her chair back yourself.',
              then: [N('You grab her chair and drag it back. The dresser tips, and Luisa catches it in one hand without looking.')],
            },
          ],
        },
        done: {
          id: 'a22-09-job-done',
          lines: [
            N('Nobody is hurt. The rain has stopped, except for one small cloud over the soup, which is still going.'),
            FE('I said umbrellas. At breakfast. Nobody listens to me about umbrellas.'),
            PE('I am perfectly calm.', 'sad'),
            N('The cloud over the soup thunders, very quietly.'),
          ],
        },
      },
    ],
    complete: {
      id: 'a22-09-complete',
      lines: [
        N('The rain stops, and the cracks stop. The room is soaked, and the Guzmáns are standing by the door with petals in their hair.'),
        MA('Thank you for dinner.', 'sad'),
        N('Mariano looks at the floor, and Isabela isn’t smiling now. The Guzmáns leave, and nobody stops them.'),
        AB('Mirabel.', 'angry'),
        N('That is all she says. Mirabel is gone, out of the room, and the candle in the window is burning lower.'),
      ],
    },
    rewards: [],
    sets: { 'a22-09': true },
    notes:
      'JOB PAYOFF (a22-job, from A22-5, four quests earlier). Step 2 as written is the eyes path (check ' +
      'inspect:a22-wall:dining-room). For ears, play A22_VARIANTS a22-09-ears with the check escort:a22-dolores:courtyard: ' +
      'you get Dolores out before she says more (her love for Mariano stays unsaid). For hands, play a22-09-hands with the ' +
      'check carry:a22-table:dining-room: you and Luisa hold the table up. The done scene is shared. STAGING: comic chaos, ' +
      'nobody hurt: rain indoors, flowers in the soup, a crack across the floor. Abuela’s one word is fear, not cruelty.',
  },

  // ---------------------------------------------------------------- A22-10
  {
    id: 'a22-10',
    code: 'A22-10',
    title: 'Rats in the Walls',
    source: src('Bruno in the walls'),
    audience: 'all',
    trigger: { where: WHERE, when: after('A22-9') },
    requires: ['A22-9'],
    speakers: [MIRABEL, ANTONIO, BRUNO],
    steps: [
      {
        id: 'a22-10-s1',
        goal: 'Find Mirabel after the dinner.',
        hint: 'Go to the nursery.',
        check: 'find:a22-mirabel:nursery',
        scene: {
          id: 'a22-10-glass',
          lines: [
            N('You find Mirabel in the nursery, on the floor, putting the glass vision back together.'),
            MI('I ruined it. The dinner, Isabela, everything.', 'sad'),
            N('Then you both notice: a piece is missing, then another. The glass is going, one piece at a time.'),
            N('A small grey rat is carrying a shard of green glass in its teeth towards a hole in the skirting board.'),
            MI('Hey! That’s… hey!'),
            N('The rat looks at you over its shoulder, and slips into the wall.'),
          ],
          choices: [
            {
              id: 'follow',
              label: 'Follow it.',
              then: [N('The hole is far too small. But the panel beside it swings open, as if Casita had made up her mind.')],
            },
            {
              id: 'antonio',
              label: 'Wake Antonio to ask the rats.',
              then: [
                AN('They say they’re not allowed to tell. They say their boss is very nice and very sad.'),
                N('Then the panel beside the hole swings open, as if Casita had made up her mind.'),
              ],
            },
          ],
        },
        done: {
          id: 'a22-10-glass-done',
          lines: [N('Behind the panel is a narrow passage between the walls, with a candle stub burning somewhere far ahead.')],
        },
      },
      {
        id: 'a22-10-s2',
        goal: 'Follow the rats through the walls.',
        hint: 'Go along the passage behind the rooms, towards the candle.',
        check: 'explore:a22-walls:passage',
        scene: {
          id: 'a22-10-walls',
          lines: [
            N('The passage runs behind every room. Through the plaster you hear the family: Pepa crying, Félix murmuring, Luisa pacing.'),
            N('Every crack you pass has been patched: some with clay, some with a strip of cloth, one with chewed-up bread.'),
            N('You come to a little room built inside the walls from bits and pieces. A table is laid for one, with a cracked cup.'),
            N('In front of a crack, a thin man in a green hood is kneeling with a trowel, filling it in, very gently.'),
            N('A row of rats is sitting in front of him, watching. He is doing all their voices.'),
            BR('And the handsome rat says, “I will not take your cheese, señor,” and the crowd goes wild.', 'happy'),
            N('He sees you, and he sees Mirabel. He drops the trowel.'),
            BR('Oh. Oh, no. Hi.', 'shock'),
            MI('Tío Bruno?', 'shock'),
          ],
          choices: [
            {
              id: 'wave',
              label: 'Wave.',
              then: [BR('Hi. Sorry. Hi.'), N('He knocks on the wall three times, quickly, and throws a pinch of salt over his shoulder.')],
            },
            {
              id: 'rats',
              label: 'Sit down with the rats.',
              then: [N('You sit at the end of the row, and a rat shuffles up to make room. Bruno stares at you, then, very slowly, he smiles.')],
            },
          ],
        },
      },
      {
        id: 'a22-10-s3',
        goal: 'Listen to Bruno.',
        hint: 'Sit at Bruno’s little table and hear him out.',
        check: 'talk:a22-bruno:walls',
        scene: {
          id: 'a22-10-bruno',
          lines: [
            BR('I never left. I couldn’t leave. I just went in the walls.', 'sad'),
            BR('Ten years. The cracks, I patch them. Not well. I’m not good with my hands. The rats help.', 'soft'),
            MI('You’ve been here the whole time? Right behind us?'),
            BR('I could hear everybody. Pepa’s birthdays. Your mamá cooking. Antonio being born. I was at all of it, from in here.'),
            BR('Every time I had a vision, people thought I made the bad things happen. And I loved them. So I went where I couldn’t do harm.'),
            MI('The vision. Of me. What does it mean?'),
            BR('I don’t know. I didn’t see the end. It was you and the house cracking, and I couldn’t see if you broke it or saved it.'),
            N('He looks at Mirabel’s face for a long moment, as if he has been waiting ten years to look at it.'),
            BR('I couldn’t let them think it was you. So I took the vision, and I went.', 'soft'),
          ],
          choices: [
            {
              id: 'thank',
              label: 'Thank him for patching the house.',
              then: [BR('Nobody’s ever…'), N('He has to stop. A rat pats his hand.')],
            },
            {
              id: 'family',
              label: 'Tell him his family misses him.',
              then: [BR('Pepa? She does?', 'soft'), N('He has to look away, at the crack, at the trowel, at anything.')],
            },
            {
              id: 'nubbin',
              label: 'Let your Nubbin go to him.',
              then: [N('Your Nubbin climbs onto the table and sits in Bruno’s cracked cup, the only seat left. Bruno laughs, short and rusty.')],
            },
          ],
        },
      },
    ],
    complete: {
      id: 'a22-10-complete',
      lines: [
        MI('Tío Bruno. Have another vision. Please. I need to know how it ends.', 'think'),
        BR('No. I don’t do that any more. Visions make trouble.', 'shock'),
        MI('They make trouble when we don’t look at them. Please.'),
        N('Bruno looks at you, as if you might get him out of it, and then at the rats. The rats look back, no help at all.'),
        BR('Okay. Okay. I need sand. And candles. And not to be looked at while I do it.', 'think'),
      ],
    },
    rewards: [],
    sets: { 'a22-10': true },
    notes:
      'Bruno is gentle, funny and superstitious (knocking on wood, salt over the shoulder); never sinister. The rats are ' +
      'ordinary rats here, so they don’t speak; Antonio can relay them. Bruno’s rat play is his own invention, ours, and ' +
      'no song. His years in the walls are told as love, not as a hiding place to be pitied.',
  },

  // ---------------------------------------------------------------- A22-11
  {
    id: 'a22-11',
    code: 'A22-11',
    title: 'Look Again',
    source: src('Bruno’s second vision'),
    audience: 'all',
    trigger: { where: WHERE, when: after('A22-10') },
    requires: ['A22-10'],
    speakers: [MIRABEL, BRUNO],
    steps: [
      {
        id: 'a22-11-s1',
        goal: 'Gather sand and candles for Bruno.',
        hint: 'Scoop sand from the passages and bring candles to Bruno’s room.',
        check: 'collect:a22-sand:walls',
        scene: {
          id: 'a22-11-gather',
          lines: [
            N('There is sand all through the house’s insides, it turns out, from the tower. You scoop it into a bowl.'),
            N('Mirabel brings candles from the dining room, the ones from the dinner. Some of them are still damp.'),
            BR('Not those. Those are dinner candles. They have opinions.', 'think'),
            N('Bruno finds his own candles behind a loose brick: short, fat, and burnt down many times.'),
            BR('Knock on wood. Salt. Hold your breath. No, don’t, that one was a joke.', 'happy'),
            N('He pours a circle of sand on the floor of his little room, and sets the candles round it.'),
          ],
          choices: [
            {
              id: 'circle',
              label: 'Help him smooth the circle.',
              then: [N('You smooth the sand together. His hands are careful, and shaky, and very good at this.')],
            },
            {
              id: 'nubbin',
              label: 'Keep your Nubbin out of the sand.',
              then: [N('You hold your Nubbin on your lap. It wants the sand quite badly, and it is very good about it.')],
            },
          ],
        },
        done: {
          id: 'a22-11-gather-done',
          lines: [BR('Sit inside the circle, both of you. Hold on to each other. It gets windy.')],
        },
      },
      {
        id: 'a22-11-s2',
        goal: 'Sit in the circle while Bruno looks again.',
        hint: 'Sit inside the sand circle with Mirabel and hold on.',
        check: 'watch:a22-vision:sand-circle',
        scene: {
          id: 'a22-11-vision',
          lines: [
            N('You sit inside the circle with Mirabel. Bruno lights the last candle and kneels in front of you.'),
            N('The sand begins to lift. It whirls round you in a ring, faster and higher, a wall of moving gold.'),
            N('Bruno’s eyes go green. All the light in the little room goes green.'),
            BR('I see the house. And the cracks. And you, Mirabel.', 'think'),
            N('In the sand a picture forms, like the glass but moving: Mirabel at a doorway, and someone with flowers all round her.'),
            N('It is Isabela. Mirabel puts her arms round her sister, and behind them the candle burns bright, with no cracks at all.'),
            BR('That’s it. That’s it. You and Isabela.', 'shock'),
            N('The sand drops all at once, and the green goes out of the light.'),
            MI('I have to hug Isabela. That’s the worst thing you could possibly have told me.', 'shock'),
          ],
          choices: [
            {
              id: 'laugh',
              label: 'Laugh.',
              then: [N('You laugh, and Bruno laughs, and Mirabel throws sand at both of you, and then she is laughing too.')],
            },
            {
              id: 'encourage',
              label: 'Tell her she can do it.',
              then: [MI('Can I? She’s perfect, and I just wrecked her proposal.', 'sad'), N('She stands up anyway, brushing off the sand. That is the answer.')],
            },
          ],
        },
      },
    ],
    complete: {
      id: 'a22-11-complete',
      lines: [
        N('Bruno sets the vision in a fresh piece of green glass, quick and careful, and gives it to Mirabel.'),
        BR('For proof. Not that anyone will believe it. Nobody ever believes the good ones.', 'soft'),
        MI('Come with us.'),
        BR('Not yet. Not yet.', 'sad'),
        N('He goes back to his crack with his trowel. The rats settle down, and he starts doing their voices again, more quietly.'),
      ],
    },
    rewards: [],
    sets: { 'a22-11': true },
    notes:
      'STAGING: the sand ring whirls round the player and Mirabel; the vision forms in the sand in green light. Respect ' +
      'prefers-reduced-motion: a slow fade instead of the whirl. Bruno’s rituals are his own superstitions, played warm.',
  },

  // ---------------------------------------------------------------- A22-12
  {
    id: 'a22-12',
    code: 'A22-12',
    title: 'Isabela',
    source: src('Isabela grows what she wants'),
    audience: 'all',
    trigger: { where: WHERE, when: after('A22-11') },
    requires: ['A22-11'],
    speakers: [ISABELA, MIRABEL],
    steps: [
      {
        id: 'a22-12-s1',
        goal: 'Go with Mirabel to Isabela’s room.',
        hint: 'Climb to the room behind the door covered in flowers.',
        check: 'visit:a22-isabela:flower-room',
        scene: {
          id: 'a22-12-room',
          lines: [
            N('Isabela’s room is a garden. Vines on the walls, roses in the ceiling, a swing hung from a flowering tree.'),
            N('She is sitting on the swing, perfectly still and perfectly dressed, with her perfect face set like a plate.'),
            IS('Get out.', 'angry'),
            MI('Isabela. I came to… I’m supposed to…', 'think'),
            IS('You ruined everything. Mariano’s gone. The whole town saw.', 'angry'),
            MI('You didn’t even want to marry Mariano!', 'angry'),
            N('There is a silence like a dropped glass.'),
            IS('How do you know that?', 'shock'),
            MI('Because your roses shut every time he talks. Look. They’re doing it now, and he isn’t even here.'),
            N('Every rose on the wall has closed up tight, like a fist.'),
            IS('…Traitors.', 'angry'),
          ],
          choices: [
            {
              id: 'step',
              label: 'Step back and let them talk.',
              then: [N('You step back against the wall, into a soft bank of jasmine. This isn’t yours to say.')],
            },
            {
              id: 'nubbin',
              label: 'Pick up your Nubbin before it eats a rose.',
              then: [N('You pick up your Nubbin, which had been considering a rose. Isabela watches, and very nearly laughs.')],
            },
          ],
        },
        done: {
          id: 'a22-12-room-done',
          lines: [IS('I was going to marry him for the family. Because Abuela wanted it. Because I always do what Abuela wants.', 'sad')],
        },
      },
      {
        id: 'a22-12-s2',
        goal: 'Watch Isabela grow something she wants.',
        hint: 'Stay out of the way of the plants.',
        check: 'watch:a22-isabela:flower-room',
        scene: {
          id: 'a22-12-cactus',
          lines: [
            IS('Do you know what it’s like to be perfect? Every day? Every flower, every smile…', 'angry'),
            N('She clenches her fist, and something grows out of the floor at her feet. A cactus: spiky, lopsided, and magnificent.'),
            IS('That’s not pretty.', 'shock'),
            MI('That’s amazing.', 'happy'),
            N('Isabela looks at the cactus, and then she does it again, on purpose: a cactus, a jacaranda, a creeper with sharp little hooks.'),
            N('She laughs, and it isn’t her perfect laugh. It is loud, and it is her own.'),
            N('Flowers pour out of the walls: strange ones, wild ones, ones in colours flowers are not usually allowed to be.'),
            IS('I didn’t know I could do that. I never tried.', 'happy'),
            N('Palms, vines, a fig tree. Your Nubbin is buried up to its crown in petals and looks very content about it.'),
          ],
          choices: [
            {
              id: 'dig',
              label: 'Dig your Nubbin out.',
              then: [N('You dig it out. It has a purple flower stuck on its crown, and will not have it removed.')],
            },
            {
              id: 'grow',
              label: 'Ask her to grow one for your Nubbin.',
              then: [N('Isabela holds out her hand, and a tiny yellow orchid opens in it. She tucks it behind your Nubbin’s crown.')],
            },
          ],
        },
      },
      {
        id: 'a22-12-s3',
        goal: 'Be there when the sisters make up.',
        hint: 'Wait among the flowers.',
        check: 'wait:a22-sisters:flower-room',
        scene: {
          id: 'a22-12-hug',
          lines: [
            N('The two sisters stand in the middle of the flowers, both out of breath.'),
            IS('I’m sorry. I was horrible to you. For years. Because you got to be not perfect.', 'sad'),
            MI('I’m sorry too. I was jealous. Because you got to be perfect.', 'sad'),
            N('They look at each other, and both start laughing at the same moment.'),
            N('Mirabel hugs her sister. Isabela hugs back, hard, with flowers coming out of her hair.'),
            N('Out in the window the candle flares up bright. The cracks in the wall above you close by themselves.'),
            MI('It’s working. Bruno was right. It’s working!', 'happy'),
          ],
        },
      },
    ],
    complete: {
      id: 'a22-12-complete',
      lines: [
        N('Mirabel sits on the floor among the wild flowers with her sketchbook, and draws your Nubbin in its flower.'),
        N('Then she takes out her needle and the cloth she always carries, and stitches: a little skirt, or a waistcoat, whichever it likes.'),
        MI('Every Madrigal has their gift stitched on something. You don’t have a gift either, so this one is for being you.', 'soft'),
        N('The stitching is butterflies, flowers and a little candle. It fits, more or less, and your Nubbin won’t take it off.'),
      ],
    },
    rewards: [
      {
        id: 'a22-embroidery',
        kind: 'cosmetic',
        label: 'Mirabel’s embroidered skirt or waistcoat',
        description:
          'A little skirt or waistcoat for your Nubbin, stitched by Mirabel with butterflies, flowers and a candle. The player picks the cut.',
      },
    ],
    sets: { 'a22-12': true },
    notes:
      'No song: Isabela’s change is shown in plants and in her laugh. The embroidery is an art suggestion for a cosmetic ' +
      'reward: the pattern follows the licensed design of Mirabel’s skirt (butterflies, flowers, the candle) in our ' +
      'pixel palette. The player picks skirt or waistcoat once.',
  },

  // ---------------------------------------------------------------- A22-13
  {
    id: 'a22-13',
    code: 'A22-13',
    title: 'The Breaking',
    source: src('Abuela and Mirabel, and the fall of the house'),
    audience: 'all',
    trigger: { where: WHERE, when: after('A22-12') },
    requires: ['A22-12'],
    speakers: [ABUELA, MIRABEL, LUISA, ANTONIO],
    steps: [
      {
        id: 'a22-13-s1',
        goal: 'Go down to the courtyard with the sisters.',
        hint: 'Follow Mirabel and Isabela downstairs.',
        check: 'walk:a22-courtyard:night',
        scene: {
          id: 'a22-13-confront',
          lines: [
            N('You come down into the courtyard together, laughing, with flowers in everybody’s hair. Abuela is standing by the candle.'),
            AB('What have you done?', 'angry'),
            N('She looks at the wild flowers on the stairs, the cactus by the door, Isabela’s ruined hair.'),
            AB('The dinner. Bruno’s name in my house. Isabela’s future. And the cracks, ever since your ceremony.', 'angry'),
            AB('Everything was fine until you went looking for problems.', 'angry'),
            MI('The cracks aren’t because of me. They’re because of you!', 'angry'),
            N('The courtyard goes still. Everyone has come out: Julieta, Agustín, Pepa, Félix, the cousins.'),
            MI('Luisa’s breaking. Isabela couldn’t be herself. Bruno’s in the walls! Nobody could ever be good enough for you!', 'angry'),
            MI('Not even me.', 'sad'),
          ],
          choices: [
            {
              id: 'step',
              label: 'Step in beside Mirabel.',
              then: [N('You step in beside her, and Abuela doesn’t even look at you. This isn’t yours to finish, but you are there.')],
            },
            {
              id: 'back',
              label: 'Stay back.',
              then: [N('You stay back: it isn’t your family, and it isn’t your fight. Your hands are fists anyway.')],
            },
          ],
        },
      },
      {
        id: 'a22-13-s2',
        goal: 'Get out of the house as it breaks.',
        hint: 'Run for the front door with the family.',
        check: 'escort:a22-family:street',
        scene: {
          id: 'a22-13-split',
          lines: [
            N('Under your feet the tiles crack. Not a little crack this time: a great one, straight down the middle of the courtyard.'),
            N('The cracks run up every wall at once, faster than anything can mend them. The house groans.'),
            N('The candle in the window gutters. Luisa looks down at her hands.'),
            LU('I can’t. I can’t lift it. My gift’s gone.', 'shock'),
            N('Doors go dark one by one along the balcony. Isabela’s flowers wilt on the stairs.'),
            AB('Out! Everyone out!', 'shock'),
            N('Everybody runs. Mirabel runs the other way: up the cracking stairs, towards the candle.'),
          ],
          choices: [
            {
              id: 'after',
              label: 'Go after her.',
              then: [N('You get halfway up, and the stairs fold under you. Casita’s tiles roll you back down, firmly, and out of the door.')],
            },
            {
              id: 'others',
              label: 'Get the others out.',
              then: [N('You take Antonio’s hand, and Pepa’s, and run them through the door. Behind you, the floor tilts.')],
            },
          ],
        },
        done: {
          id: 'a22-13-split-done',
          lines: [N('You land in the street with the family round you, all of you on your knees. Behind you, the walls begin to lean.')],
        },
      },
      {
        id: 'a22-13-s3',
        goal: 'Find Mirabel in the ruins.',
        hint: 'Climb carefully into the rubble where the courtyard was.',
        check: 'find:a22-mirabel:ruins',
        scene: {
          id: 'a22-13-ruins',
          lines: [
            N('The house comes down in a long, slow roar, room after room, like something lying down.'),
            N('Then it is quiet, with dust everywhere. White wall, red tile, and a whole staircase leaning on nothing.'),
            N('Mirabel is sitting in the middle of it all, where the tiles carried her at the last moment. She is holding the candle.'),
            N('As you reach her, the flame shrinks to a bead, and the bead goes out.'),
            MI('No. No.', 'sad'),
            N('A thin line of smoke rises from the wick, and then not even that.'),
            N('Your Nubbin climbs into her lap and pushes its head under her chin.'),
          ],
          choices: [
            {
              id: 'sit',
              label: 'Sit down next to her.',
              then: [N('You sit down in the dust beside her. You don’t say anything, because there isn’t anything.')],
            },
            {
              id: 'hand',
              label: 'Reach for her hand.',
              then: [N('She lets you hold it for a moment. Her hand is full of candle wax.')],
            },
          ],
        },
        done: {
          id: 'a22-13-lamp',
          lines: [
            N('At your belt, the gold flame Abuela lit for you on your first night goes out at the same moment.'),
            N('Your lamp is dark again. It is the darkest thing in the valley, and the whole valley is dark.'),
            N('Then Mirabel is up and running, out of the ruins, and nobody sees which way.'),
          ],
        },
      },
    ],
    complete: {
      id: 'a22-13-complete',
      lines: [
        N('The family stand in the ruins, and Julieta is holding Luisa. Pepa has no cloud at all, and Isabela has no flowers.'),
        N('Abuela stands with her back to all of them, looking at the empty place where the window was.'),
        AB('Where is she?', 'sad'),
        N('Nobody knows. Then Antonio’s toucan comes down out of the dark and says something in his ear.'),
        AN('The river. He says she went to the river.', 'sad'),
      ],
    },
    rewards: [],
    sets: { 'a22-13': true },
    notes:
      'LAMP (SIM): when the step 3 done scene is about to play, read longGrassLantern(): dark plays a22-13-lamp as written ' +
      '(the candle’s flame in your lamp goes out with it); flicker, lit and warm play A22_VARIANTS a22-13-lamp-flicker ' +
      '(your own thin flame stays), a22-13-lamp-lit (the only light in the ruins) and a22-13-lamp-warm (the night is oddly ' +
      'warm). CARE: nobody is hurt in the fall; Casita carries everyone out, Mirabel last. Keep the fall slow and sad, not ' +
      'violent; reduced motion: a fade to dust. Abuela is frightened, not cruel; her blame is the worst of her fear, and the ' +
      'river answers it. Mirabel’s line “Nobody could ever be good enough for you” is the outline’s beat, in our words.',
  },

  // ---------------------------------------------------------------- A22-14
  {
    id: 'a22-14',
    code: 'A22-14',
    title: 'The River',
    source: src('Abuela and Mirabel at the river'),
    audience: 'all',
    trigger: { where: WHERE, when: after('A22-13') },
    requires: ['A22-13'],
    speakers: [MIRABEL, ABUELA, BRUNO],
    steps: [
      {
        id: 'a22-14-s1',
        goal: 'Follow Mirabel to the river.',
        hint: 'Walk down the valley past the last houses, to where the mountains open.',
        check: 'walk:a22-river:valley',
        scene: {
          id: 'a22-14-river',
          lines: [
            N('The river is a long way down the valley, past the last houses, where the mountains open.'),
            N('The water runs fast and shallow over stones. On the far bank there is long grass, and the sky is getting light.'),
            N('Mirabel is sitting on a rock by the water. You stop a little way off, and sit down too.'),
            N('Mirabel doesn’t look round. Her glasses are in her lap.'),
            N('Your Nubbin sits between you, and nobody says anything. The water says enough.'),
            N('After a while there are footsteps on the stones. It is Abuela, with her shawl round her, out of breath.'),
          ],
          choices: [
            {
              id: 'go',
              label: 'Get up to leave them alone.',
              then: [N('You stand to go, and Abuela shakes her head, very slightly: stay. You sit down again, further off.')],
            },
            {
              id: 'stay',
              label: 'Stay where you are.',
              then: [N('You stay where you are. Abuela looks at you, and nods, as if you were a chair she had owned for a long time.')],
            },
          ],
        },
      },
      {
        id: 'a22-14-s2',
        goal: 'Listen to Abuela at the river.',
        hint: 'Stay still, and listen.',
        check: 'sit:a22-abuela:river',
        scene: {
          id: 'a22-14-pedro',
          lines: [
            N('Abuela sits down beside her granddaughter, slowly, on the cold rock. She looks at the water for a long time.'),
            AB('This is the river.', 'soft'),
            MI('Here? This is where…?'),
            AB('Here. I was younger than Isabela. I had three babies and nothing else, and they were coming.'),
            AB('He told me to go. He kissed me, and he turned round, and he walked back.', 'sad'),
            AB('I waited on the other side until the sun came up. He didn’t come.', 'sad'),
            N('Her hands are shaking in her lap. She doesn’t hide them.'),
            AB('I was given a miracle that night. And I was so afraid of losing it that I forgot what it was for.', 'sad'),
            AB('I made the family carry everything. I made them carry me. I am sorry, Mirabel.', 'sad'),
            N('Yellow butterflies are coming up off the water in the first light: dozens of them, then hundreds.'),
            MI('We were given a miracle because of you.', 'soft'),
            N('Abuela makes a sound that isn’t quite laughing and isn’t quite crying. She pulls Mirabel into her arms.'),
          ],
        },
        done: {
          id: 'a22-14-pedro-done',
          lines: [
            N('The butterflies settle on the rock, on Mirabel’s skirt, on your Nubbin’s crown.'),
            N('Footsteps again. A thin man in a green hood is standing at the top of the bank, ready to run.'),
            BR('Mamá.', 'shock'),
            N('Abuela stands up. She goes to him over the stones, and she holds him, hood and all, for a long time.'),
          ],
        },
      },
    ],
    complete: {
      id: 'a22-14-complete',
      lines: [
        N('The sun comes over the mountains. You walk back up the valley together, and Bruno stays very close to his mother.'),
        MI('Everything’s gone. The house. The gifts.', 'sad'),
        AB('Not everything.', 'soft'),
        N('At the top of the road the whole village is waiting by the ruins. Every one of them has brought something.'),
      ],
    },
    rewards: [
      {
        id: 'a22-butterflies',
        kind: 'feature',
        label: 'Yellow butterflies',
        description: 'An ambient for the Grove: yellow butterflies drift up off the pond at first light, settle, and drift on.',
      },
    ],
    sets: { 'a22-14': true },
    childLines: {
      'a22-14-pedro#10': 'You kept us all together, Abuela. That was the miracle.',
    },
    notes:
      'LIFTED TEXT 2: a22-14-pedro#10 (see the header). CARE (displacement): Pedro’s death is told, never shown. The far ' +
      'bank holds no riders now; it is just long grass in the dawn. Say it plainly, with no music sting; let the river be ' +
      'the only sound until the butterflies. KEPT STONE (SIM): when the step 2 done scene is about to play, read keptStone; ' +
      'if set, play A22_VARIANTS a22-14-pedro-done-kept instead: Abuela takes your cold hands in hers without a word, and ' +
      'keeps them there. The third rule is acted (sitting by the water), never quoted. Reward: the yellow-butterfly ambient. ' +
      'HAZEL’S MARGIN NOTE (s24Done, read-only): if s24Done is set when a22-14-complete ends, play A22_VARIANTS ' +
      'a22-margin-hazel straight after it; otherwise it plays the first time the atlas is open at this page’s river after ' +
      's24Done is set. From then on the note is drawn in pencil in the margin beside the river. Its text matches S24’s ' +
      'notes exactly.',
  },

  // ---------------------------------------------------------------- A22-15
  {
    id: 'a22-15',
    code: 'A22-15',
    title: 'Building Casita',
    source: src('the village rebuilds the house'),
    audience: 'all',
    trigger: { where: WHERE, when: after('A22-14') },
    requires: ['A22-14'],
    speakers: [NEIGHBOUR, LUISA, ABUELA, MIRABEL, DOLORES, CAMILO],
    steps: [
      {
        id: 'a22-15-s1',
        goal: 'Join the village at the ruins.',
        hint: 'Talk to the neighbours gathered at the ruins and pick up a tool.',
        check: 'talk:a22-neighbours:ruins',
        scene: {
          id: 'a22-15-village',
          lines: [
            N('Shovels, wheelbarrows, ladders, pots of whitewash. A woman with a basket of bread, and the man whose bridge Luisa mended.'),
            NB('The Madrigals helped every one of us. Now we help you.'),
            N('Señora Guzmán is there with her sleeves rolled up. Mariano is standing next to Dolores, and they are both a bit pink.'),
            N('There are no gifts now: Pepa has no cloud, and Luisa can’t lift a donkey. Camilo’s face is just his face.'),
            CA('It’s so… one face. All day. How do you all manage?', 'think'),
            LU('I don’t know what to do with my hands.', 'think'),
            N('Julieta hands round arepas that heal nothing, and everybody eats them anyway, because they are delicious.'),
          ],
          choices: [
            {
              id: 'shovel',
              label: 'Pick up a shovel.',
              then: [N('You pick up a shovel. A man you’ve never met nods at you, as if you had been digging beside him for years.')],
            },
            {
              id: 'ask',
              label: 'Ask where to start.',
              then: [AB('Anywhere. Start anywhere. Everybody else has.', 'soft')],
            },
          ],
        },
      },
      {
        id: 'a22-15-s2',
        goal: 'Help rebuild the house, the way only you can.',
        hint: 'Eyes: build along Mirabel’s crack map. Ears: walk the ruins with Dolores. Hands: carry for Luisa.',
        check: 'build:a22-walls:crack-map',
        scene: {
          id: 'a22-15-eyes',
          lines: [
            N('Mirabel unfolds her drawing of the house, the one you have marked cracks on for days. It is soft at the folds and covered in ink.'),
            MI('Every crack we found. Every one. This is where it was weak.', 'think'),
            N('You go through the ruins with the map, wall by wall, and show the builders where the old house was cracking.'),
            N('Where it cracked, they build it thicker. Where it leaned, they set a new beam.'),
            NB('Who drew this? It’s good.'),
            N('Mirabel opens her mouth to explain about visions and houses, and says “We did” instead.'),
          ],
          choices: [
            {
              id: 'mirabel',
              label: 'Say Mirabel did.',
              then: [Y('She did. I held the pencil.'), N('Mirabel goes red, and goes on pointing.')],
            },
            {
              id: 'both',
              label: 'Say you did it together.',
              then: [Y('Both of us.'), N('Mirabel grins. The builder writes both your names in pencil on the new beam.')],
            },
          ],
        },
        done: {
          id: 'a22-15-job-done',
          lines: [N('By evening the walls are up to your shoulders, whitewashed and new. Everyone is talking at once as they work.')],
        },
      },
    ],
    complete: {
      id: 'a22-15-complete',
      lines: [
        N('It takes days. Walls, then roof, then shutters, then the courtyard tiles, one by one, in the old pattern.'),
        N('Bruno puts on a play for the children with his rats. Pepa has no cloud, so she says how she feels out loud, and finds she can.'),
        N('Abuela works beside everybody. She plasters a corner, and the corner slowly slides off.'),
        AB('It is resting.'),
        N('Nobody argues. Tío Félix holds it up until it dries.'),
        N('In the end there is a house: plain, white and new, with a red roof. It isn’t magic, and every hand in the valley built it.'),
      ],
    },
    rewards: [],
    sets: { 'a22-15': true },
    notes:
      'JOB PAYOFF (a22-job, from A22-5, ten quests earlier). Step 2 as written is the eyes path (check ' +
      'build:a22-walls:crack-map). For ears, play A22_VARIANTS a22-15-ears with the check build:a22-walls:listening: ' +
      'Dolores directs the work by listening for wobbles. For hands, play a22-15-hands with the check ' +
      'carry:a22-bricks:ruins: Luisa sits down for the first time in years, and you carry for her. The done scene is ' +
      'shared. The rebuilding is the heart of the page: no gifts, everyone carries. The village is mixed, as the valley is ' +
      '(Afro-Colombian, Indigenous and mestizo neighbours), drawn with the advisers’ help.',
  },

  // ---------------------------------------------------------------- A22-16
  {
    id: 'a22-16',
    code: 'A22-16',
    title: 'The Doorknob',
    source: src('the doorknob, the new flame and the photograph'),
    audience: 'all',
    trigger: { where: WHERE, when: after('A22-15') },
    requires: ['A22-15'],
    speakers: [JULIETA, ABUELA, MIRABEL, NEIGHBOUR, DOLORES, LUISA, ANTONIO],
    steps: [
      {
        id: 'a22-16-s1',
        goal: 'Watch Mirabel finish the house.',
        hint: 'Stand with the family by the new front door.',
        check: 'watch:a22-door:casita',
        scene: {
          id: 'a22-16-doorknob',
          lines: [
            N('The front door is the last thing. It is new and plain, with a hole where the handle should go.'),
            N('The family stands round Mirabel in a half circle, and Antonio is bouncing. Bruno is at the back, holding a rat.'),
            JU('We made you something. All of us.', 'soft'),
            N('Julieta puts it in Mirabel’s hand: a doorknob, carved and painted, with a butterfly on it, and her name.'),
            AB('We built the house. You are the one who brought us back to it. Put it in.', 'soft'),
            MI('Me?', 'shock'),
            AB('You.', 'soft'),
            N('Mirabel looks at the doorknob, at the door, and at you. Then she fits it into the hole, and turns it.'),
            N('Light runs out of the doorknob, across the door, along the walls and up into the roof. Tiles ripple, and shutters fly open.'),
            N('Casita wakes. In the window a candle catches, all by itself, and burns.'),
            N('Luisa lifts a donkey out of habit, and puts it down again, gently. Pepa’s cloud comes back as a rainbow.'),
          ],
          choices: [
            {
              id: 'cheer',
              label: 'Cheer.',
              then: [N('You cheer. Mirabel cheers louder than anyone, and this time she means every bit of it.')],
            },
            {
              id: 'nubbin',
              label: 'Watch your Nubbin.',
              then: [N('Your Nubbin is running in circles round the courtyard, chased by a ripple of happy tiles.')],
            },
          ],
        },
        done: {
          id: 'a22-16-stub',
          lines: [
            N('Mirabel takes a candle stub from her pocket and lights it from the new flame in the window.'),
            MI('For you. To take home.', 'soft'),
            N('You hold your lamp out to it, and the stub’s flame lights your dark glass again. Mirabel watches, and frowns a little.'),
            MI('It might not stay lit, where you’re going. Some lights you have to wait for. Keep the stub anyway.', 'soft'),
          ],
        },
      },
      {
        id: 'a22-16-s2',
        goal: 'Stand in the family photograph.',
        hint: 'Stand on the steps with the family when the photographer calls.',
        check: 'photo:a22-family:casita',
        scene: {
          id: 'a22-16-photo',
          lines: [
            N('The photographer from the village sets up his camera in the courtyard, under a black cloth.'),
            N('The whole family crowds onto the stairs, Bruno too, at the front this time, holding Antonio. The rats are not in it, officially.'),
            MI('Wait. Wait! You too. Get in!', 'happy'),
            N('You end up at the edge, beside Mirabel, with the crack map rolled up under your arm. She pulls you in close.'),
            N('Your Nubbin sits at your feet in Mirabel’s embroidery. A yellow butterfly lands on its crown.'),
            NB('Everybody, very still!'),
          ],
          choices: [
            {
              id: 'smile',
              label: 'Smile.',
              then: [N('You smile. Mirabel doesn’t need to be told.')],
            },
            {
              id: 'look',
              label: 'Look at Mirabel instead.',
              then: [N('You look at Mirabel instead of the camera, and she looks at you, and the photograph catches you both laughing.')],
            },
          ],
        },
      },
    ],
    complete: {
      id: 'a22-16-complete',
      lines: [
        N('In the morning the page begins to go thin and painted again, at the edges.'),
        N('The Madrigals walk you to the gate, all of them, and the house too, with its shutters waving.'),
        N('Somewhere behind them, three Madrigals are still arguing about chairs.'),
        AB('You are welcome at this table. Always.', 'soft'),
        N('Antonio’s jaguar sniffs your Nubbin one last time. Antonio listens, very seriously, to what your Nubbin says back.'),
        AN('It says it will come back. And it says you have to bring it.', 'happy'),
        N('Then you are standing in the Grove with a candle stub, a carved doorknob Julieta slipped into your pocket, and a butterfly that came all the way home.'),
      ],
    },
    rewards: [
      {
        id: 'a22-candle-holder',
        kind: 'decor',
        label: 'Painted tin candle-holder',
        description:
          'Mirabel’s candle stub in a painted tin holder, hung on the Long-Grass post. It mirrors the post: unlit while the lantern flickers or is dark, lit from the Long Night’s dawn on. Decoration only.',
      },
      {
        id: 'a22-doorknob',
        kind: 'decor',
        label: 'Butterfly doorknob',
        description: 'A carved, painted doorknob with a yellow butterfly, for the cottage door.',
      },
      {
        id: 'a22-bookmark',
        kind: 'item',
        label: 'The Long Table Bookmark',
        description: 'A ribbon bookmark embroidered with butterflies. It joins the Long Table festival.',
      },
    ],
    sets: { 'a22-16': true, 'a22-done': true },
    notes:
      'LAMP (SIM): when the step 1 done scene is about to play, read longGrassLantern(): dark plays a22-16-stub as written ' +
      '(in the kept-stone route, “Some lights you have to wait for” is meant to sting a little); flicker, lit and warm play ' +
      'A22_VARIANTS a22-16-stub-flicker, a22-16-stub-lit and a22-16-stub-warm. JOB PAYOFF (a22-job, from A22-5, eleven ' +
      'quests earlier): the photo as written is the eyes path (the crack map under your arm). For ears, play ' +
      'a22-16-photo-ears (Dolores beside you); for hands, a22-16-photo-hands (Luisa beside you, sitting down). ' +
      'This photograph answers A22-3’s, where Mirabel was waved out of the picture. GROVE KEEPSAKE (SIM): read through ' +
      'atlasDone(\'A22\'). The candle-holder hangs on the Long-Grass post; it is drawn unlit while longGrassLantern() is ' +
      'flicker or dark, lit while it is lit or warm. It changes nothing in the campaign. On the first return to the Grove ' +
      'after A22-16, play A22_VARIANTS a22-grove-candle (unlit) or a22-grove-candle-lit once. The bookmark joins the Long ' +
      'Table festival (A11, A13, A17, A18, A22), which reads atlasDone(\'A22\').',
  },
];

// =================================================================== variants

/**
 * Scenes chosen by Grove state (longGrassLantern(), keptStone, s24Done) or by a22-job. Each replaces the
 * named scene in place, except a22-margin-hazel (s24Done), which plays after A22-14 (see its notes), and
 * the Grove keepsake. No variant writes a Grove flag.
 */
export const A22_VARIANTS: Scene[] = [
  // ---------------------------------------------------------------- A22-1, the lamp (replaces a22-01-lamp)
  {
    id: 'a22-01-lamp-flicker',
    lines: [
      N('Abuela Alma meets you in the courtyard. She is older than in the painting, straight as a broom, with a black shawl.'),
      N('She looks at the lamp at your belt, from your Long-Grass post. A thin blue flame is shivering inside it.'),
      AB('That flame is too thin to be on its own. Come.'),
      N('She tips the candle to your wick. Now there are two flames in the glass, a gold one and your thin blue one, leaning together.'),
    ],
  },
  {
    id: 'a22-01-lamp-lit',
    lines: [
      N('Abuela Alma meets you in the courtyard. She is older than in the painting, straight as a broom, with a black shawl.'),
      N('She looks at the lamp at your belt, lit from your Long-Grass post. The flame stands up straight and steady.'),
      AB('Someone keeps that one well. Good.'),
      N('She doesn’t offer to light it. She nods at it, the way you nod to a neighbour.'),
    ],
  },
  {
    id: 'a22-01-lamp-warm',
    lines: [
      N('Abuela Alma meets you in the courtyard. She is older than in the painting, straight as a broom, with a black shawl.'),
      N('She looks at the lamp at your belt, lit from your Long-Grass post. Its flame is a deep red-gold, and the glass is warm.'),
      AB('That one burns as if somebody is glad of it.', 'soft'),
      N('She holds her hands to it for a moment, as if it were a hearth, and then remembers herself.'),
    ],
  },

  // ---------------------------------------------------------------- A22-4, the lamp (replaces a22-04-lamp)
  {
    id: 'a22-04-lamp-flicker',
    lines: [
      N('You look down at the lamp at your belt. Both its flames, Abuela’s gold one and your own thin blue one, are shuddering.'),
      N('They shudder with the candle, all three at once, and steady all at once.'),
      MI('Yours too. You saw. You saw it.', 'shock'),
      N('She grips your wrist hard, then lets go, because her grandmother is watching.'),
    ],
  },
  {
    id: 'a22-04-lamp-lit',
    lines: [
      N('You look down at the lamp at your belt, lit from your own Long-Grass post. Its flame stands straight; it didn’t move at all.'),
      N('Mirabel sees it too. She stares at it, then at the candle, then at it again.'),
      MI('Yours didn’t. Something is wrong with ours.', 'think'),
      N('She grips your wrist hard, then lets go, because her grandmother is watching.'),
    ],
  },
  {
    id: 'a22-04-lamp-warm',
    lines: [
      N('You look down at the lamp at your belt. Its red-gold flame is warm against your hip, and it didn’t move at all.'),
      N('Mirabel sees it too. She stares at it, then at the candle, then at it again.'),
      MI('Yours didn’t. Something is wrong with ours.', 'think'),
      N('She grips your wrist hard, then lets go, because her grandmother is watching.'),
    ],
  },

  // ---------------------------------------------------------------- A22-8, ears (replaces a22-08-prep-done)
  {
    id: 'a22-08-prep-done-ears',
    lines: [
      N('As you pass the stairs, Dolores catches your sleeve. You have sat with her most mornings since the landing, and listened to her listening.'),
      DO('I heard. In the nursery. Tío Agustín, and the glass. I heard all of it.', 'sad'),
      DO('I hear everything. I can’t not hear it. And I can’t keep things in. They just come out.', 'sad'),
      DO('Please stay by me tonight. Please.'),
      N('The bell rings at the gate. The Guzmáns are here.'),
    ],
  },

  // ---------------------------------------------------------------- A22-9, step 2 (replaces a22-09-eyes)
  {
    id: 'a22-09-ears',
    lines: [
      N('Everything happens at once. You remember your job: you are the ears, and Dolores is your friend.'),
      N('She is standing at the foot of the stairs with both hands over her mouth, and more is still coming out.'),
      DO('And Mariano, and I always, I always…', 'sad'),
      N('Whatever she is about to say, it isn’t hers to say in front of the whole table.'),
      N('Across the table Mariano is looking at Dolores, not at Isabela, and doesn’t seem to know why.'),
      N('Mirabel sees you get up, and nods once.'),
    ],
    choices: [
      {
        id: 'out',
        label: 'Take her outside.',
        then: [
          N('You take Dolores’s hand and walk her out into the courtyard, fast, before the next word.'),
          N('Behind you, the door swings shut, and Casita leans on it.'),
        ],
      },
      {
        id: 'cover',
        label: 'Knock a jug over to cover her.',
        then: [N('You knock a jug off the table. In the crash, you get Dolores out into the courtyard.'), DO('Thank you. Thank you.', 'sad')],
      },
    ],
  },
  {
    id: 'a22-09-hands',
    lines: [
      N('Everything happens at once. You remember your job: you are the hands, and Luisa needs them.'),
      N('The crack has gone right under the table, and the table is folding in the middle like a book closing.'),
      N('Luisa has one end of it. Her eye is twitching hard, and her hands are shaking.'),
      LU('I can’t… I can’t hold it…', 'shock'),
      N('The other end is dropping, and all of Julieta’s dishes are sliding down it towards Señora Guzmán’s lap.'),
      MI('Luisa!', 'shock'),
    ],
    choices: [
      {
        id: 'lift',
        label: 'Grab the other end.',
        then: [
          N('You get your shoulder under the other end and push. It is heavier than anything has ever been.'),
          N('Between you, you hold it, dishes and all. Luisa looks across at you over the soup.'),
        ],
      },
      {
        id: 'dishes',
        label: 'Get the dishes off first.',
        then: [N('You and your Nubbin snatch dishes off the slope as fast as you can. With them gone, Luisa can hold it, just.')],
      },
    ],
  },

  // ---------------------------------------------------------------- A22-13, the lamp (replaces a22-13-lamp)
  {
    id: 'a22-13-lamp-flicker',
    lines: [
      N('At your belt, Abuela’s gold flame goes out with the candle. For a moment your lamp is dark.'),
      N('Then you see it: your own thin blue flicker, from the Long-Grass post, still there at the bottom of the wick. It never quite goes out.'),
      N('Then Mirabel is up and running, out of the ruins, and nobody sees which way.'),
    ],
  },
  {
    id: 'a22-13-lamp-lit',
    lines: [
      N('At your belt, your lamp is still burning. Its flame comes from your Long-Grass post, a long way off, and owes this house nothing.'),
      N('It is the only light in the ruins. The family turn towards it one by one, the way people turn towards a fire.'),
      N('Mirabel looks at it, and at the dead candle. Then she is up and running, out of the ruins, and nobody sees which way.'),
    ],
  },
  {
    id: 'a22-13-lamp-warm',
    lines: [
      N('At your belt, your lamp is still burning, a deep red-gold. The night should be cold up here among the mountains, and it isn’t.'),
      N('The air round the ruins is oddly warm, like a kitchen after the cooking. Antonio’s jaguar lies down against your feet.'),
      N('Mirabel looks at your lamp, and at the dead candle. Then she is up and running, out of the ruins, and nobody sees which way.'),
    ],
  },

  // ---------------------------------------------------------------- A22-14, keptStone (replaces a22-14-pedro-done)
  {
    id: 'a22-14-pedro-done-kept',
    lines: [
      N('Abuela turns, and sees you. She looks at your hands, at the way you are holding them, and takes them in hers.'),
      N('Your hands have been cold since the night at the spring. She doesn’t say a word about it; she just keeps them there.'),
      N('The butterflies settle on the rock and on your Nubbin’s crown. Then footsteps: a thin man in a green hood, at the top of the bank.'),
      BR('Mamá.', 'shock'),
      N('Abuela lets go of your hands, gently, and goes to him over the stones, and holds him for a long time.'),
    ],
  },

  // ---------------------------------------------------------------- Hazel's margin note (s24Done; after A22-14)
  {
    id: 'a22-margin-hazel',
    lines: [
      N('Nova’s atlas lies open at the river, and the old woman sitting on a cold rock beside her granddaughter.'),
      N('Beside the river, in faint pencil you have never noticed, there is a note in the margin. You know the hand.'),
      N('“Abuela sat down by the river and stopped being right.”'),
      N('“Took her long enough. Took me longer.”', 'soft'),
      N('And under it, one letter: H.'),
      N('Your Nubbin sits down at the edge of the page, beside the painted rock, and stays there a while.'),
    ],
  },

  // ---------------------------------------------------------------- A22-15, step 2 (replaces a22-15-eyes)
  {
    id: 'a22-15-ears',
    lines: [
      N('Dolores walks through the ruins with her eyes shut. You walk beside her, as you have for days, and tell her where to step.'),
      DO('That wall. It’s humming wrong. Something inside it is loose.', 'think'),
      N('The builders take the wall down and set it again. Dolores listens, nods, and moves on.'),
      DO('That beam is creaking in its sleep. And that tile is about to fall on Camilo.', 'think'),
      N('Camilo moves, and the tile falls where he was. He stares at Dolores, and so does everybody.'),
      DO('My gift’s gone, but I can still hear, the ordinary way. I never noticed how much.', 'happy'),
    ],
    choices: [
      {
        id: 'marvel',
        label: 'Tell her she’s a marvel.',
        then: [DO('Nobody ever…', 'soft'), N('She has to stop. Mariano, beside her, hands her a handkerchief.')],
      },
      {
        id: 'listen',
        label: 'Ask what she hears now.',
        then: [DO('Hammers. Everybody laughing. Tío Bruno, telling the rats a story under the stairs. It’s lovely.', 'soft')],
      },
    ],
  },
  {
    id: 'a22-15-hands',
    lines: [
      N('Luisa is standing in the middle of the ruins with a load of bricks, out of habit. Her arms are shaking.'),
      N('You take the bricks off her, as you have every day since the landing, and put them down.'),
      LU('I should be lifting the beams. I always do the beams.', 'sad'),
      N('The beam she is looking at takes six neighbours to move, and they move it. Nobody needed her to.'),
      N('Luisa sits down on a pile of roof tiles, in the sun. She looks surprised to find herself there.'),
      LU('I’m sitting down. I haven’t sat down in… I don’t know. Years.', 'soft'),
    ],
    choices: [
      {
        id: 'carry',
        label: 'Carry for her.',
        then: [N('You carry bricks all morning, and Luisa sits and tells you where to put them. She is very bossy about it, and much happier.')],
      },
      {
        id: 'sit',
        label: 'Sit down next to her for a minute.',
        then: [N('You sit down beside her. Your Nubbin climbs onto her boot and falls asleep, as it did once before, and she laughs.')],
      },
    ],
  },

  // ---------------------------------------------------------------- A22-16, the stub (replaces a22-16-stub)
  {
    id: 'a22-16-stub-flicker',
    lines: [
      N('Mirabel takes a candle stub from her pocket and lights it from the new flame in the window.'),
      MI('For you. To take home.', 'soft'),
      N('You hold your lamp out. Your own thin blue flicker leans towards the new flame, and for a moment they burn together.'),
      MI('Yours is a stubborn one. Look after it. It’ll come right.', 'soft'),
    ],
  },
  {
    id: 'a22-16-stub-lit',
    lines: [
      N('Mirabel takes a candle stub from her pocket and lights it from the new flame in the window.'),
      MI('For you. To take home.', 'soft'),
      N('You hold your lamp up beside it. The two flames, hers and your own, burn side by side, the same height.'),
      MI('Look at that. Two houses.', 'happy'),
    ],
  },
  {
    id: 'a22-16-stub-warm',
    lines: [
      N('Mirabel takes a candle stub from her pocket and lights it from the new flame in the window.'),
      MI('For you. To take home.', 'soft'),
      N('You hold your lamp up beside it. Your red-gold flame and her new one burn side by side, and you feel the warmth on your face.'),
      MI('Yours is warm. Like a kitchen. Somebody loves that one.', 'happy'),
    ],
  },

  // ---------------------------------------------------------------- A22-16, the photo (replaces a22-16-photo)
  {
    id: 'a22-16-photo-ears',
    lines: [
      N('The photographer from the village sets up his camera in the courtyard, under a black cloth.'),
      N('The whole family crowds onto the stairs, Bruno too, at the front this time, holding Antonio. The rats are not in it, officially.'),
      MI('Wait. Wait! You too. Get in!', 'happy'),
      N('You end up at the edge, between Mirabel and Dolores. Dolores leans over to whisper.'),
      DO('Mariano’s going to ask me. Next week. I heard him practising in the market.', 'happy'),
      NB('Everybody, very still!'),
    ],
    choices: [
      {
        id: 'smile',
        label: 'Smile.',
        then: [N('You smile. Dolores can’t stop smiling at all, and the photograph catches her trying.')],
      },
      {
        id: 'secret',
        label: 'Whisper that her secret is safe.',
        then: [DO('I know. I heard you think it.', 'happy'), N('She can’t, of course. But the photograph catches you both laughing.')],
      },
    ],
  },
  {
    id: 'a22-16-photo-hands',
    lines: [
      N('The photographer from the village sets up his camera in the courtyard, under a black cloth.'),
      N('The whole family crowds onto the stairs, Bruno too, at the front this time, holding Antonio. The rats are not in it, officially.'),
      MI('Wait. Wait! You too. Get in!', 'happy'),
      N('You end up at the edge, beside Mirabel and Luisa. Luisa is sitting on the bottom step, and she pulls you down beside her.'),
      LU('Sit. It’s allowed. I checked.', 'happy'),
      NB('Everybody, very still!'),
    ],
    choices: [
      {
        id: 'sit',
        label: 'Sit.',
        then: [N('You sit. In the photograph the two of you are the only ones sitting down, and you both look very pleased about it.')],
      },
      {
        id: 'nubbin',
        label: 'Put your Nubbin on Luisa’s boot.',
        then: [N('Your Nubbin climbs onto her boot for the photograph. Luisa laughs just as it is taken.')],
      },
    ],
  },

  // ---------------------------------------------------------------- the Grove keepsake (once, after A22-16)
  {
    id: 'a22-grove-candle',
    lines: [
      N('Back in the Grove, you walk out to the fourth post by the long grass and hang the painted tin holder from its hook.'),
      N('The candle stub in it won’t stay lit here, and you knew it wouldn’t. Mirabel said some lights have to be waited for.'),
      N('Your Nubbin sits under the post with a yellow butterfly on its crown, and looks up at the stub as if it were a promise.'),
    ],
  },
  {
    id: 'a22-grove-candle-lit',
    lines: [
      N('Back in the Grove, you walk out to the fourth post by the long grass and hang the painted tin holder from its hook.'),
      N('The stub catches from the lantern above it at once, as if it had only been waiting to be introduced.'),
      N('Two flames by the long grass now, one from here and one from a valley far away. Your Nubbin sits under them, very pleased.'),
    ],
  },
];

// =================================================================== flags and checks

/**
 * Every flag this line sets (Atlas save only). It reads Grove state (longGrassLantern(), keptStone,
 * s24Done) and writes no Grove flag.
 */
export const ATLAS_A22_FLAGS: string[] = [
  'a22-01',
  'a22-02',
  'a22-03',
  'a22-04',
  'a22-05',
  'a22-06',
  'a22-07',
  'a22-08',
  'a22-09',
  'a22-10',
  'a22-11',
  'a22-12',
  'a22-13',
  'a22-14',
  'a22-15',
  'a22-16',
  'a22-done', // A22-16: the whole page; read by atlasDone('A22') for the candle-holder and the Long Table festival
  'a22-job', // eyes | ears | hands (a22-05-plan): variants in A22-8, A22-9, A22-15 and A22-16
];

/** Every check, including the job-path checks the A22-9 and A22-15 variants use (see their notes). */
export const ATLAS_A22_CHECKS: string[] = [
  'explore:a22-page:painted-valley',
  'visit:a22-casita:gate',
  'walk:a22-market:town-square',
  'talk:a22-madrigals:courtyard',
  'visit:a22-kitchen:casita',
  'find:a22-antonio:nursery',
  'escort:a22-antonio:gift-door',
  'walk:a22-party:courtyard',
  'inspect:a22-cracks:landing',
  'watch:a22-abuela:candle',
  'choose:a22-job:landing',
  'find:a22-luisa:village',
  'sit:a22-luisa:wall',
  'explore:a22-tower:door',
  'climb:a22-stairs:tower',
  'puzzle:a22-vision:cave',
  'carry:a22-glass:nursery',
  'place:a22-candles:dining-room',
  'sit:a22-dinner:dining-room',
  'inspect:a22-wall:dining-room',
  'escort:a22-dolores:courtyard',
  'carry:a22-table:dining-room',
  'find:a22-mirabel:nursery',
  'explore:a22-walls:passage',
  'talk:a22-bruno:walls',
  'collect:a22-sand:walls',
  'watch:a22-vision:sand-circle',
  'visit:a22-isabela:flower-room',
  'watch:a22-isabela:flower-room',
  'wait:a22-sisters:flower-room',
  'walk:a22-courtyard:night',
  'escort:a22-family:street',
  'find:a22-mirabel:ruins',
  'walk:a22-river:valley',
  'sit:a22-abuela:river',
  'talk:a22-neighbours:ruins',
  'build:a22-walls:crack-map',
  'build:a22-walls:listening',
  'carry:a22-bricks:ruins',
  'watch:a22-door:casita',
  'photo:a22-family:casita',
];
