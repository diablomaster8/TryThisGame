/**
 * Atlas campaign, page A24: The Law of the Jungle (Part M, rank 27). Eighteen quests, A24-1 to
 * A24-18: sixteen in the Seeonee hills, and a two-quest coda on the Bering Sea.
 *
 * SOURCE. Rudyard Kipling, The Jungle Book (Macmillan, London, 1894) and The Second Jungle Book
 * (Macmillan, 1895): the Mowgli stories in order ("Mowgli’s Brothers", "Kaa’s Hunting",
 * "Tiger! Tiger!", "How Fear Came", "Letting in the Jungle", "Red Dog", "The Spring Running"),
 * with "The White Seal" (The Jungle Book, 1894) as the coda. Rights: public domain worldwide
 * (Kipling died in 1936). Disney holds its own films, songs and designs: nothing from any Disney
 * version (no ape king, no songs, no Disney designs or catchphrases; Kaa is a friend, Baloo a
 * strict teacher, as Kipling wrote them). All art is original.
 *
 * AUDIENCE. 'all', rated All with care (see the care notes). Every lifted line has a `childLines`
 * replacement for the Learning Grove. The Learning Grove's own softened version (geography,
 * animals, the monsoon, fur seals, Steller’s sea cow) is a separate task and is not in this file.
 *
 * FRAME. Nova’s atlas falls open at the Seeonee hills at dusk: a cave mouth, and a flat rock
 * above. You and your Nubbin step in alone; nobody else from the valley comes. You are guests of
 * the Free People. Baloo teaches you the Master Words beside Mowgli, so the jungle lets you be.
 * Mowgli keeps his story: you carry messages, keep watch, feed a fire and sit at the edge of the
 * Council. Kipling’s animals talk (canon 31); your Nubbin never does. Running beat: Mother Wolf
 * lets your Nubbin sleep among her cubs from the first night, and it never quite stops thinking
 * it is a wolf (it howls at the moon, badly, from A24-2 on). For the coda the page turns, and you
 * stand on a beach in the Bering Sea; the seals talk too.
 *
 * GROVE FLAGS READ (read-only; the Atlas never writes a Grove flag):
 *   - s8Reunited (S8: Fern has found Bramble). ATLAS_A24_VARIANTS 'a24-02-council-done-fern'
 *     replaces a24-02-council-done: Fern’s voice comes from the page’s edge as a memory, one line,
 *     when Bagheera pays for the cub. Otherwise the default scene plays.
 *   - s24Done (S24). ATLAS_A24_VARIANTS 'a24-17-margin-hazel' plays once, straight after
 *     a24-17-complete, if s24Done is set then; if S24 finishes later, the first time the atlas
 *     is next open at this page. From then on Hazel’s pencil note is drawn beside Kotick.
 *
 * FLAGS WRITTEN (Atlas save only, all prefixed a24-):
 *   - a24-01 … a24-18: each quest on completion. a24-done: the whole page (A24-18); festivals and
 *     the Grove keepsakes read it through atlasDone('A24').
 *   - a24-stones = mowgli | messua (A24-10, a24-10-road): THE SIGNATURE CHOICE. It picks variants
 *     in A24-10 (its close), A24-13 (the hut and the road), A24-15 (the lamp), and A24-16 (what
 *     Mowgli asks of you, and the last image: the trail north, or the lit hut with the baby
 *     asleep). Mowgli goes to men on both paths, as Kipling wrote it.
 *
 * LIFTED TEXT (verbatim; only the eight passages Part M marks as verified, against The Jungle
 * Book, 1894, Project Gutenberg #236, and The Second Jungle Book, 1895, and "The White Seal",
 * checked against the Kipling Society’s copies; set with the game’s curly quotes):
 *   1. "O thou Mowgli—for Mowgli the Frog I will call thee—" (Mother Wolf) a24-01-door#9.
 *   2. "Now to Baloo’s word I will add one bull, and a fat one, newly killed, not half a mile
 *      from here" (Bagheera; a fragment, closed with a full stop) a24-02-council#10.
 *   3. "We be of one blood, ye and I" (the Master Words) a24-03-words#5 (Baloo), a24-05-cistern#5
 *      (Mowgli, to the cobras), a24-16-bagheera#11 (you, at the goodbye). The outline allows it
 *      wherever the Keeper uses the Words; it is used three times, each with a childLine.
 *   4. "Let them fall, Mowgli. They are only tears." (Bagheera) a24-07-tears#7.
 *   5. "Man goes to Man at the last, though the Jungle does not cast him out." (Kaa)
 *      a24-16-rock#5.
 *   6. "Good hunting on a new trail, Master of the Jungle! Remember, Bagheera loved thee."
 *      (Bagheera) a24-16-bagheera#7.
 *   7. "Sea Catch, our baby’s going to be white!" (Matkah; the spoken words are exact, the tag
 *      "she said at last" is dropped) a24-17-beach#8.
 *   8. "in that sea where no man comes." (the last words of the prose story, set at the end of
 *      our own sentence) a24-18-complete#5.
 * Every other line is original. Kipling’s set phrases ("look well", the Strangers’ Hunting
 * Call, the Water Truce, the Red Flower, the Free People) are used as names or paraphrased. No
 * verse from the poems is quoted; the poem "The Law of the Jungle" gives the page its name only.
 * Nobody sings.
 *
 * CARE NOTES.
 *   - Kipling and empire. The intro card (a24-01-page#1–3, Nova’s card in the page) says plainly
 *     that Kipling was born in Bombay and supported British rule in India. The villagers are
 *     frightened people, not stupid ones; Buldeo exaggerates because he is afraid, and the
 *     narration never mocks him; Messua is the village’s heart. Messua is sent to a town to be
 *     safe, not to "the English". "In the Rukh" (Mowgli in the colonial forest service) and
 *     "The King’s Ankus" are left out. Commission Indian advisers for names, dress, the village
 *     and the land before ship.
 *   - The Bandar-log are monkeys only: monkey bodies, monkey chatter, no human-coded design.
 *   - The White Seal’s hunters are Unangax̂ (Aleut) men working the seal harvest, which their
 *     people on the Pribilofs were forced into for generations. They are never villains here:
 *     workers seen from a seal’s eye, unnamed, and the scene cuts away (a24-17-drove). The intro
 *     line for the coda (a24-17-beach#1) says whose islands these are. Ask an Unangax̂ adviser to
 *     check A24-17 before ship.
 *   - Softened for All: Shere Khan’s death is dust and silence (no body), and the hide is shown
 *     only spread on the Council Rock; the Cold Lairs and Red Dog fights have no wounds; Akela’s
 *     death is gentle, like Fossil’s; Kotick’s fights are shoving matches; the stoning misses;
 *     the villagers who tie up Messua are scared, and nobody is hurt when the jungle comes in.
 *   - Hazel’s third rule is acted out (you sit with Akela in A24-14, and with Mowgli on the rock
 *     in A24-7) and never quoted.
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

const WHERE = 'Nova’s atlas: the Law of the Jungle page (Atlas campaign)';
const after = (code: string) => `Any time after ${code}, from Nova’s atlas.`;
const JB = (story: string) => `The Jungle Book (Rudyard Kipling, 1894): “${story}”`;
const SJB = (story: string) => `The Second Jungle Book (Rudyard Kipling, 1895): “${story}”`;
const KIP = 'Kipling’s text; original design, nothing from any Disney film';

// ------------------------------------------------------------------ speakers

const MOWGLI = sp('a24-mowgli', 'Mowgli', `Mowgli, the man’s cub (The Jungle Books); ${KIP}`);
const MOTHERWOLF = sp('a24-mother-wolf', 'Mother Wolf', `Raksha, Mother Wolf (The Jungle Books); ${KIP}`);
const FATHERWOLF = sp('a24-father-wolf', 'Father Wolf', `Father Wolf (The Jungle Books); ${KIP}`);
const TABAQUI = sp('a24-tabaqui', 'Tabaqui', `Tabaqui the jackal, the Dish-licker (The Jungle Books); ${KIP}`);
const SHEREKHAN = sp('a24-shere-khan', 'Shere Khan', `Shere Khan, the lame tiger (The Jungle Books); ${KIP}`);
const AKELA = sp('a24-akela', 'Akela', `Akela, the great grey Lone Wolf (The Jungle Books); ${KIP}`);
const BALOO = sp('a24-baloo', 'Baloo', `Baloo, the brown bear who teaches the Law (The Jungle Books); ${KIP}`);
const BAGHEERA = sp('a24-bagheera', 'Bagheera', `Bagheera, the black panther (The Jungle Books); ${KIP}`);
const KAA = sp('a24-kaa', 'Kaa', `Kaa, the rock python (The Jungle Books); ${KIP}`);
const CHIL = sp('a24-chil', 'Chil', `Chil the kite (The Jungle Books); ${KIP}`);
const BANDAR = sp('a24-bandar', 'Bandar-log', `The Bandar-log, the Monkey-People (The Jungle Books); monkeys only, no human-coded design`);
const MESSUA = sp('a24-messua', 'Messua', `Messua, the village woman who takes Mowgli in (The Jungle Books); design with Indian advisers`);
const BULDEO = sp('a24-buldeo', 'Buldeo', `Buldeo, the village hunter (The Jungle Books); never a figure of fun here`);
const VILLAGER = sp('a24-villager', 'Villager', 'Frightened villagers (The Jungle Books); design with Indian advisers');
const GREYBROTHER = sp('a24-grey-brother', 'Grey Brother', `Grey Brother, Mother Wolf’s eldest cub (The Jungle Books); ${KIP}`);
const YOUNGWOLF = sp('a24-young-wolf', 'Young Wolf', `The young wolves of the Seeonee pack (The Jungle Books); ${KIP}`);
const HATHI = sp('a24-hathi', 'Hathi', `Hathi, the wild elephant (The Jungle Books); ${KIP}`);
const KOTICK = sp('a24-kotick', 'Kotick', `Kotick, the white seal (“The White Seal”, The Jungle Book); ${KIP}`);
const MATKAH = sp('a24-matkah', 'Matkah', `Matkah, Kotick’s mother (“The White Seal”, The Jungle Book); ${KIP}`);
const SEACATCH = sp('a24-sea-catch', 'Sea Catch', `Sea Catch, Kotick’s father (“The White Seal”, The Jungle Book); ${KIP}`);
const SEALION = sp('a24-sea-lion', 'Sea Lion', `The old sea lion (“The White Seal”, The Jungle Book); ${KIP}`);
const SEAVITCH = sp('a24-sea-vitch', 'Sea Vitch', `Sea Vitch, the walrus (“The White Seal”, The Jungle Book); ${KIP}`);
const GULL = sp('a24-gull', 'Gull', `The gulls of the northern islands (“The White Seal”, The Jungle Book); ${KIP}`);
const SEAL = sp('a24-seal', 'Old Seal', `The holluschickie and old bulls of Novastoshnah (“The White Seal”, The Jungle Book); ${KIP}`);

const N = say('narrator');
const Y = say('you');
const MG = say('a24-mowgli');
const MW = say('a24-mother-wolf');
const FW = say('a24-father-wolf');
const TB = say('a24-tabaqui');
const SK = say('a24-shere-khan');
const AK = say('a24-akela');
const BL = say('a24-baloo');
const BG = say('a24-bagheera');
const KA = say('a24-kaa');
const CH = say('a24-chil');
const BD = say('a24-bandar');
const ME = say('a24-messua');
const BU = say('a24-buldeo');
const VI = say('a24-villager');
const GB = say('a24-grey-brother');
const YW = say('a24-young-wolf');
const HA = say('a24-hathi');
const KO = say('a24-kotick');
const MK = say('a24-matkah');
const SC = say('a24-sea-catch');
const SL = say('a24-sea-lion');
const SV = say('a24-sea-vitch');
const GU = say('a24-gull');
const SE = say('a24-seal');
const FE = say('fern');

// ------------------------------------------------------------------ lifted text (public domain; outline-verified only)

/** Mother Wolf names the cub. The Jungle Book, 1894, "Mowgli’s Brothers" (PG #236). */
const LIFT_FROG = 'O thou Mowgli—for Mowgli the Frog I will call thee—';
/** Bagheera buys the cub (a fragment). The Jungle Book, 1894, "Mowgli’s Brothers" (PG #236). */
const LIFT_BULL = 'Now to Baloo’s word I will add one bull, and a fat one, newly killed, not half a mile from here.';
/** The Master Words. The Jungle Book, 1894, "Kaa’s Hunting" (PG #236). */
const LIFT_BLOOD = 'We be of one blood, ye and I.';
/** Bagheera at the Council of Fire. The Jungle Book, 1894, "Mowgli’s Brothers" (PG #236). */
const LIFT_TEARS = 'Let them fall, Mowgli. They are only tears.';
/** Kaa at the last council. The Second Jungle Book, 1895, "The Spring Running" (Kipling Society copy). */
const LIFT_MAN = 'Man goes to Man at the last, though the Jungle does not cast him out.';
/** Bagheera’s goodbye. The Second Jungle Book, 1895, "The Spring Running" (Kipling Society copy). */
const LIFT_TRAIL = 'Good hunting on a new trail, Master of the Jungle! Remember, Bagheera loved thee.';
/** Matkah. The Jungle Book, 1894, "The White Seal" (Kipling Society copy); the tag is dropped. */
const LIFT_WHITE = 'Sea Catch, our baby’s going to be white!';
/** The last words of "The White Seal" (a fragment), The Jungle Book, 1894 (Kipling Society copy). */
const LIFT_SEA = 'in that sea where no man comes.';

/** Learning Grove replacements for the Master Words (one per use, all original). */
const CHILD_BLOOD = 'You and I are family, all of us, under the same sky.';

// ------------------------------------------------------------------ shared pieces

/** A24-16: the ending images, by a24-stones. */
const A16_LEAVE: Line[] = [
  N('Far behind you the Council Rock sits in the morning sun, empty, and it doesn’t mind.'),
  N('Your Nubbin looks back at it once, the way a wolf does, and then trots on.'),
];

// =================================================================== THE LAW OF THE JUNGLE

export const ATLAS_A24: Quest[] = [
  // ---------------------------------------------------------------- A24-1
  {
    id: 'a24-01',
    code: 'A24-1',
    title: 'The Cave',
    source: JB('Mowgli’s Brothers'),
    audience: 'all',
    trigger: { where: WHERE, when: 'Any time once Nova’s atlas is in the Grove; the first quest on the page.' },
    speakers: [FATHERWOLF, MOTHERWOLF, TABAQUI, SHEREKHAN, MOWGLI],
    steps: [
      {
        id: 'a24-01-s1',
        goal: 'Step into the Seeonee hills and find the wolves’ cave.',
        hint: 'Touch the page where the cave mouth is, then climb the slope towards it.',
        check: 'explore:a24-seeonee:cave-mouth',
        scene: {
          id: 'a24-01-page',
          lines: [
            N('Nova’s atlas falls open at hills the colour of a warm brick, going blue at the edges with dusk.'),
            N('Tucked into the page is one of Nova’s cards, written small. “Kipling was born in Bombay, and he loved India.”'),
            N('“He also believed Britain had the right to rule it, and he wrote that too. He was wrong about that.”'),
            N('“Read him knowing both. N.”'),
            N('You put the card back. The dusk comes up off the paper like warm breath, and there is dry grass under your boots.'),
            N('A slope of rocks, and a cave mouth. Above it, against the first stars, is a long flat rock with nobody on it yet.'),
            N('In the cave a big grey wolf is waking up and scratching. A she-wolf lies with her nose across four tumbling cubs.'),
            FW('Hrrm. Dusk already, and hunting to do. Who’s that at the door? It smells like a guest. A very small one, and a strange one.', 'think'),
            MW('Let them in, if they’ve come politely. Nothing that walks in politely gets eaten in this house.'),
          ],
          choices: [
            {
              id: 'bow',
              label: 'Bow at the cave mouth and wait to be asked.',
              then: [MW('Good manners. Come in, then, and mind the cubs’ tails. They leave them everywhere.', 'happy')],
            },
            {
              id: 'nubbin',
              label: 'Let your Nubbin go in first.',
              then: [N('Your Nubbin trots in, sniffs the nearest cub, and is sniffed back, thoroughly, from both ends.')],
            },
            {
              id: 'sit',
              label: 'Sit down outside and let them look at you.',
              then: [FW('Hm. It sits like it means no harm. Come in out of the dew.')],
            },
          ],
        },
        done: {
          id: 'a24-01-page-done',
          lines: [
            N('The cave smells of warm fur and old bones. Mother Wolf watches you with eyes like two green lamps.'),
            MW('Guests of the Free People sit by the wall. That’s you. And your little one sits wherever it likes, apparently.'),
          ],
        },
      },
      {
        id: 'a24-01-s2',
        goal: 'Keep still in the cave while Tabaqui and the tiger’s roar go by.',
        hint: 'Stay by the wall. Watch the cave mouth, not the jackal.',
        check: 'watch:a24-cub:cave',
        scene: {
          id: 'a24-01-cub',
          lines: [
            N('A thin shadow slides into the cave mouth on its belly: a jackal, smiling with all its teeth.'),
            TB('Oh, chief of the wolves, what a cave! What a fine family! Such teeth on them already!'),
            TB('And a guest. How grand. Is there a bone, for poor Tabaqui? Even a dry one. I am not proud.', 'happy'),
            FW('There’s a bone by the wall. Take it and go.'),
            TB('I only mention, in passing, that Shere Khan has come to hunt in these hills. Lame Shere Khan. Thought you’d like to know.'),
            N('He crunches the bone, says something unkind about the cubs’ ears, and is gone.'),
            N('Below in the valley a tiger’s whine rises, long and angry. Father Wolf’s fur stands up.'),
            FW('The fool. He’s hunting Man. A woodcutter’s fire; he’s missed, and burnt his feet on it, by the sound.', 'angry'),
            N('Something rustles in the bushes. Father Wolf crouches to spring, and stops himself in mid-air.'),
            FW('Man! A man’s cub. Look!', 'shock'),
            N('In the cave mouth, holding on to a low branch, stands a brown baby who has only just learned to walk.'),
            N('He isn’t frightened in the least. He toddles in, pushes in among the cubs, and settles down to get warm.'),
          ],
          choices: [
            {
              id: 'room',
              label: 'Nudge your Nubbin to make room for him.',
              then: [N('Your Nubbin shuffles over. The baby leans on it as if it were a cushion, which, to be fair, it nearly is.')],
            },
            {
              id: 'still',
              label: 'Keep perfectly still.',
              then: [N('You don’t move. Mother Wolf notices that, and something in her eyes softens towards you.')],
            },
          ],
        },
        done: {
          id: 'a24-01-cub-done',
          lines: [
            MW('A man’s cub. So that’s what they look like. No fur at all, and not a bit afraid of us.', 'soft'),
            N('The baby has found her warm side and gone to sleep against it, as if he had always lived here.'),
          ],
        },
      },
      {
        id: 'a24-01-s3',
        goal: 'Stand behind Mother Wolf while Shere Khan comes to the door.',
        hint: 'Stay behind her. The cave mouth is too narrow for a tiger, and she knows it.',
        check: 'sit:a24-mother-wolf:cave',
        scene: {
          id: 'a24-01-door',
          lines: [
            N('The moonlight in the cave mouth goes dark. A tiger’s huge striped head is pushed into the gap, and his shoulders after it.'),
            N('He can’t get further in. The cave is too narrow, and he knows it, and it makes him angrier.'),
            SK('A man’s cub went this way. Its parents have run off. Give it to me.', 'angry'),
            FW('We are the Free People. We answer to our own leader, not to a tiger who hunts cows and woodcutters.'),
            SK('Free? Must Shere Khan stand in a wolf’s doorway and ask twice? Give me what is mine!', 'angry'),
            N('Mother Wolf comes forward over her cubs. In the dark her eyes and the tiger’s meet, and hers don’t move.'),
            MW('You’ll have my answer, then. The cub is mine. He will not be killed. He will live to run with the pack.', 'angry'),
            MW('Go back to your woodcutters with your burnt feet, lame one. Go!'),
            N('Shere Khan backs out of the cave mouth, growling. From outside he shouts that this isn’t the end of it.'),
            MW(LIFT_FROG, 'soft'),
            MW('One day you will hunt the one who hunted you. Lie still, little frog.', 'soft'),
          ],
          choices: [
            {
              id: 'brave',
              label: 'Tell her that was the bravest thing you’ve seen.',
              then: [MW('Brave? I was being a mother. It looks the same from outside.', 'happy')],
            },
            {
              id: 'quiet',
              label: 'Say nothing. Breathe out.',
              then: [N('You breathe out. So does Father Wolf, rather louder, and he pretends he didn’t.')],
            },
          ],
        },
        done: {
          id: 'a24-01-door-done',
          lines: [
            FW('He’ll go to the pack, you know. The Law says the cubs must be shown at the Council.', 'think'),
            MW('Then we’ll show him. At the full moon. Let them look.'),
          ],
        },
      },
    ],
    complete: {
      id: 'a24-01-complete',
      lines: [
        N('Night settles. Mother Wolf licks the man’s cub clean, then the wolf cubs, then, after some thought, your Nubbin.'),
        N('Your Nubbin is so surprised it falls over. Then it curls up among the cubs, between Mowgli and the smallest wolf, and sleeps.'),
        MW('It can stay there. A thing that sleeps in a wolf’s den is a wolf, more or less. Mostly less.', 'happy'),
        N('You lie by the wall and listen to six things breathing in the dark. One of them is yours.'),
      ],
    },
    rewards: [],
    sets: { 'a24-01': true },
    childLines: {
      'a24-01-door#9': 'You are mine now, little one. I will call you Mowgli, the Frog.',
    },
    notes:
      'OPENING: the atlas page is drawn in warm brick and dusk blue, and colours in as you step through (a slow wash, ' +
      'two seconds). a24-01-page#1–3 is NOVA’S CARD (care note on Kipling and empire): draw it as a small card tucked ' +
      'in the page, voiced as narration, before the page comes alive. Shere Khan’s head and shoulders fill the cave ' +
      'mouth; he never gets in. Tabaqui is a scruffy jackal. The baby is a toddler in silhouette at night, simply drawn. ' +
      'From here on your Nubbin sleeps among the wolf cubs on this page (Atlas save; no Grove effect).',
  },

  // ---------------------------------------------------------------- A24-2
  {
    id: 'a24-02',
    code: 'A24-2',
    title: 'The Council Rock',
    source: JB('Mowgli’s Brothers'),
    audience: 'all',
    trigger: { where: WHERE, when: after('A24-1') },
    requires: ['A24-1'],
    speakers: [AKELA, SHEREKHAN, BALOO, BAGHEERA, MOTHERWOLF, FATHERWOLF, YOUNGWOLF],
    steps: [
      {
        id: 'a24-02-s1',
        goal: 'Go up to the Council Rock with the wolves at the full moon.',
        hint: 'Walk behind Mother Wolf. Stop at the edge of the circle; guests don’t go in.',
        check: 'walk:a24-council-rock:full-moon',
        scene: {
          id: 'a24-02-climb',
          lines: [
            N('At the full moon the wolves climb to the Council Rock. Its hilltop is so heaped with boulders that a whole pack can sit hidden there.'),
            N('Mowgli toddles beside Mother Wolf with a fist in her fur, and the cubs tumble round him.'),
            FW('The Law says every cub is shown to the pack, so that any wolf will know it again. Then it may run where it likes.'),
            FW('And no grown wolf may lift a tooth against it until it has made its first kill. That’s the Law.'),
            N('On the flat rock lies a great grey wolf, old and strong, stretched out at his full length in the moonlight.'),
            FW('Akela. The Lone Wolf. He leads because he is strong, and cunning, and fair.'),
            N('Your Nubbin looks at the moon, takes a deep breath, and lets out a howl. It comes out like a kettle.'),
            YW('What was that?', 'shock'),
            MW('A guest. Don’t stare. It’s rude.', 'happy'),
          ],
          choices: [
            {
              id: 'hush',
              label: 'Hush your Nubbin gently.',
              then: [N('It hushes. Then, very quietly, it practises the howl again under its breath.')],
            },
            {
              id: 'proud',
              label: 'Tell it that was a fine howl.',
              then: [N('It sits up very straight. For the rest of the night it looks at the moon as if they had an understanding.')],
            },
          ],
        },
        done: {
          id: 'a24-02-climb-done',
          lines: [
            N('You stop at the edge of the circle, among the rocks, where the guests and the old ones sit.'),
            N('Mother Wolf pushes Mowgli into the moonlight. He sits there laughing and playing with some pebbles.'),
          ],
        },
      },
      {
        id: 'a24-02-s2',
        goal: 'Watch the Council decide whether the man’s cub may stay.',
        hint: 'Stay at the edge and keep quiet. Only the Council speaks.',
        check: 'watch:a24-council:rock',
        scene: {
          id: 'a24-02-council',
          lines: [
            AK('You know the Law. Look, wolves. Look well at each cub.'),
            N('A muffled roar comes up from behind the rocks. Shere Khan has followed.'),
            SK('The cub is mine. Give him to me. What have the Free People to do with a man’s cub?', 'angry'),
            AK('Who speaks for this cub? The Law says two who are not his father and mother must speak for him.'),
            N('Nobody answers. Mother Wolf gets ready for what she knows would be her last fight, if it comes to fighting.'),
            N('Then a big brown bear heaves himself up on his hind legs and grunts. He has sat so still you took him for a rock.'),
            BL('I’ll speak for him. A man’s cub never hurt anyone. I’m a poor hand at speeches, but that’s true. Let him run with you.', 'think'),
            BL('I’ll teach him myself.'),
            AK('We need another. Who speaks besides Baloo?'),
            N('A black shadow drops down into the circle: Bagheera the panther, the colour of a moonless night, with a voice like warm milk.'),
            BG(LIFT_BULL),
            BG('Accept the man’s cub under the Law, and the bull is the pack’s. A fair trade, I think.'),
            N('The young wolves’ ears go up, because they are always hungry. A whole bull, for one small cub who can’t do anyone harm?'),
          ],
          choices: [
            {
              id: 'edge',
              label: 'Stay where you are and keep very still.',
              then: [N('You keep still. Beside you, your Nubbin keeps so still it forgets to blink.')],
            },
            {
              id: 'hand',
              label: 'Put your hand on your Nubbin’s back.',
              then: [N('Your Nubbin leans into your hand. Across the circle, Mother Wolf sees, and nods once.')],
            },
          ],
        },
        done: {
          id: 'a24-02-council-done',
          lines: [
            N('The wolves come one by one to look at Mowgli, and then they go down the hill after the bull.'),
            AK('He is the pack’s now. Take him home, and bring him up properly.'),
          ],
        },
      },
    ],
    complete: {
      id: 'a24-02-complete',
      lines: [
        N('Shere Khan roars into the night, furious. Nobody answers him.'),
        BG('Shout all you like. That little cub will grow, and one day you’ll wish you’d been quieter.', 'think'),
        N('Bagheera passes you on the way down, and gives you a long yellow look.'),
        BG('And you, guest. You stood still, and said nothing you didn’t know. That’s rarer than a bull.'),
        BL('Lessons start when the cub can stand without falling over. You too. And that.', 'happy'),
        N('“That” is your Nubbin, which is trying to howl at the moon again, very small.'),
      ],
    },
    rewards: [],
    sets: { 'a24-02': true },
    childLines: {
      'a24-02-council#10': 'I will add my own gift to Baloo’s word: a whole bull, not far from here, for the pack to share.',
    },
    notes:
      'The Council Rock is a hilltop of stones; the wolves sit in a ring in the moonlight, guests among the rocks at the ' +
      'edge. Bagheera is pure black with a sheen like watered silk; Baloo is a big brown bear, heavy and sleepy. The ' +
      'bull is mentioned, never shown. ' +
      'FERN’S MEMORY (s8Reunited, read-only): if s8Reunited is set, play ATLAS_A24_VARIANTS a24-02-council-done-fern ' +
      'in place of a24-02-council-done. Fern is not on the page: her voice comes from the page’s edge as a memory, ' +
      'drawn as a faint pencil speech mark, one line. Running beat from here: your Nubbin howls at the moon on this page.',
  },

  // ---------------------------------------------------------------- A24-3
  {
    id: 'a24-03',
    code: 'A24-3',
    title: 'Baloo’s Lessons',
    source: JB('Kaa’s Hunting'),
    audience: 'all',
    trigger: { where: WHERE, when: after('A24-2') },
    requires: ['A24-2'],
    speakers: [BALOO, MOWGLI, BAGHEERA],
    steps: [
      {
        id: 'a24-03-s1',
        goal: 'Join Mowgli at Baloo’s lessons in the glade.',
        hint: 'The glade is below the Council Rock, by the fallen tree. Bring your Nubbin.',
        check: 'visit:a24-baloo:glade',
        scene: {
          id: 'a24-03-glade',
          lines: [
            N('Seasons go by, as they do on this page. Mowgli is a boy of seven now, brown and quick and full of opinions.'),
            N('Baloo sits on a fallen tree in a glade with his eyes half shut, like a schoolmaster who has seen everything twice.'),
            BL('Sit. Both of you. All three of you. The Law of the Jungle is old, and long, and it doesn’t care if you’re bored.'),
            MG('I’m always bored. You’ve been teaching me for ever.', 'angry'),
            BL('Wolves only need a little of the Law. A man’s cub must learn all of it. So must a guest.'),
            BL('Every branch that will hold you, and every rotten one that won’t. How to speak politely to the wild bees.'),
            BL('How to beg pardon of a bat you’ve woken. How to call out to the water-snakes before you jump into their pool.'),
            N('Your Nubbin is trying to look at Baloo, the bees and the bat all at once. It has gone slightly cross-eyed.'),
          ],
          choices: [
            {
              id: 'listen',
              label: 'Listen hard and say each one back.',
              then: [BL('Good. A guest who listens. You can teach the cub manners while I teach him the Law.', 'happy'), MG('Hmph.')],
            },
            {
              id: 'mowgli',
              label: 'Whisper to Mowgli that you’re bored too.',
              then: [MG('Really? I thought guests liked everything.', 'happy'), BL('I heard that. I hear everything. Bears do.')],
            },
          ],
        },
        done: {
          id: 'a24-03-glade-done',
          lines: [
            BL('First, the Strangers’ Hunting Call. You give it when you hunt outside your own ground, until you’re answered.'),
            BL('It asks leave, because you’re hungry. The answer gives it, as long as you eat what you catch and never kill for sport.'),
          ],
        },
      },
      {
        id: 'a24-03-s2',
        goal: 'Learn the Master Words of the jungle from Baloo.',
        hint: 'Say the Words back exactly, with the right voice for each people.',
        check: 'talk:a24-baloo:master-words',
        scene: {
          id: 'a24-03-words',
          lines: [
            BL('Now the Master Words. They matter more than anything else I teach. Say them right, and the jungle will let you be.'),
            BL('There is a word for the Hunting People, and a word for the Birds, and a word for the Snakes.'),
            MG('Yes, yes, I know them. I know them better than you do. Listen.', 'happy'),
            N('Mowgli gabbles the Words the way a child says a poem for a grown-up, to get it over with.'),
            BL('Again. Slowly. For the Hunting People.'),
            BL(LIFT_BLOOD),
            BL('Use the hunters’ voice for that, deep in the chest. For the Birds, you whistle it, like Chil the kite.'),
            BL('For the Snakes you say it with a hiss that can’t be written down. You’ll learn it from them.'),
            N('Mowgli yawns in the middle of the hiss. Baloo cuffs him, not hard, but hard enough to sit him down.'),
            MG('Ow! You always hit me! I hate you!', 'angry'),
            BG('He cuffs you because he loves you, little brother. Better a bear’s cuff now than a snake’s bite later.', 'soft'),
          ],
          choices: [
            {
              id: 'repeat',
              label: 'Say the Words for the Hunting People, slowly.',
              then: [N('You say them slowly, in the deepest voice you have. Baloo’s little eyes close all the way, which is praise.')],
            },
            {
              id: 'why',
              label: 'Ask Baloo why the Words work.',
              then: [BL('Because everyone in the jungle has said them, for longer than the hills. A thing everyone keeps is a law.', 'think')],
            },
            {
              id: 'sit',
              label: 'Sit down next to Mowgli while he sulks.',
              then: [N('You sit beside him and say nothing. After a while he stops sulking, mostly so he can show you the bird whistle.')],
            },
          ],
        },
        done: {
          id: 'a24-03-words-done',
          lines: [
            N('Your Nubbin, at the back, has been listening. It puffs itself up and gives a small, determined hiss.'),
            BL('That’s… not wrong, actually. Huh. The snakes might take that.', 'shock'),
          ],
        },
      },
      {
        id: 'a24-03-s3',
        goal: 'Practise the calls in the glade until Baloo is satisfied.',
        hint: 'Match each call to its people: the hunters, the birds, the snakes. Baloo answers when you get it right.',
        check: 'puzzle:a24-calls:glade',
        scene: {
          id: 'a24-03-calls',
          lines: [
            BL('Now we practise. I’ll be the jungle. You come into my ground and you say the right thing to the right one.'),
            N('Baloo goes behind a bush and becomes, in turn, a very bad bird, a very bad snake and a passable bear.'),
            BL('Tweet. I am a kite. Very fierce. Speak.', 'happy'),
            MG('He’s the worst bird in the world.', 'happy'),
            BL('I heard that too.'),
            N('Mowgli whistles the Birds’ word without thinking. He is good at this, when he stops pretending he isn’t.'),
            N('Your Nubbin hisses at the bear and growls at the bird. Baloo patiently explains it the right way round, twice.'),
          ],
        },
        done: {
          id: 'a24-03-calls-done',
          lines: [
            BL('Enough. The cub knows it and won’t say it, and the guest says it and is still learning it.', 'think'),
            BL('And the small one has its own law, which is a mystery to bears.'),
          ],
        },
      },
    ],
    complete: {
      id: 'a24-03-complete',
      lines: [
        N('Baloo lies back on his tree with a huge, satisfied grunt, as if he had done all the work himself.'),
        BL('The Law is like the creeper on a tree trunk. It holds everything up, and you only see it when it’s gone.'),
        MG('Can I go now?'),
        BL('Go. And don’t go near the Monkey-People. I mean it.', 'think'),
        N('Mowgli looks away very quickly, the way a boy looks away who has been somewhere he shouldn’t.'),
      ],
    },
    rewards: [],
    sets: { 'a24-03': true },
    childLines: {
      'a24-03-words#5': CHILD_BLOOD,
    },
    notes:
      'Baloo’s glade has a fallen tree for a desk. The puzzle (puzzle:a24-calls:glade) is a gentle three-card match: ' +
      'three calls (a growl, a whistle, a hiss) to three peoples (hunter, bird, snake); a wrong answer gets a funny ' +
      'Baloo line and you try again, and nothing fails. The bird and snake forms of the Words are drawn as a whistle ' +
      'and a wavy line, never written out. The cuff is a soft paw, played as comedy, and Mowgli is fine. LESSON BOARD: ' +
      'the outline offers the poem’s first line as a heading for this lesson in place of LIFT_BULL if Maor prefers; it ' +
      'is NOT used here.',
  },

  // ---------------------------------------------------------------- A24-4
  {
    id: 'a24-04',
    code: 'A24-4',
    title: 'The Monkey-People',
    source: JB('Kaa’s Hunting'),
    audience: 'all',
    trigger: { where: WHERE, when: after('A24-3') },
    requires: ['A24-3'],
    speakers: [MOWGLI, BANDAR, CHIL, BALOO, BAGHEERA, KAA],
    steps: [
      {
        id: 'a24-04-s1',
        goal: 'Look for Mowgli, who has gone off sulking under the trees.',
        hint: 'Follow the chattering. The Monkey-People are never quiet for long.',
        check: 'watch:a24-bandar-log:treetops',
        scene: {
          id: 'a24-04-trees',
          lines: [
            N('Mowgli lies on Bagheera’s back in the noon heat, telling a secret to anyone who’ll listen.'),
            MG('The Bandar-log are nice to me. They give me nuts. They say I’ll be their leader one day. Baloo never says that.', 'happy'),
            BL('The Monkey-People have no law. They have no leader. They have no memory.', 'angry'),
            BL('They boast and chatter and pretend to be great, and then a nut falls and they forget it all and laugh.'),
            N('Mowgli goes red and stalks off to sulk under a tree. Above him, the leaves start to whisper with a hundred grey hands.'),
            BD('Hoo! Look at us! Look how clever we are! Nobody in the jungle is as clever as us!', 'happy'),
            BD('Everybody agrees! We just agreed! What were we agreeing about? Ooh, a nut!'),
            N('A hundred monkeys drop through the branches like falling fruit. When they swing back up, Mowgli is with them.'),
            MG('Baloo! Bagheera!', 'shock'),
          ],
          choices: [
            {
              id: 'shout',
              label: 'Shout for Baloo and Bagheera.',
              then: [N('They are already running. Baloo runs like a landslide, and Bagheera like a shadow that is late for something.')],
            },
            {
              id: 'follow',
              label: 'Run underneath and keep the monkeys in sight.',
              then: [N('You run. Your Nubbin keeps its eyes on the treetops so well that it walks into a tree.')],
            },
          ],
        },
        done: {
          id: 'a24-04-trees-done',
          lines: [
            N('The monkeys travel the treetops along their own roads, high and fast. Below them, nobody can keep up for long.'),
            N('Mowgli, swung from hand to hand, sees a kite circling high above. He takes a breath.'),
          ],
        },
      },
      {
        id: 'a24-04-s2',
        goal: 'Watch for Chil the kite, and see where he goes.',
        hint: 'Look up. Chil circles over the monkeys, and then he turns back.',
        check: 'watch:a24-chil:sky',
        scene: {
          id: 'a24-04-chil',
          lines: [
            N('Mowgli whistles the Master Word of the Birds, the way he did in the glade when he forgot to pretend he couldn’t.'),
            N('High above, Chil the kite tips one wing, and drops lower to see who has called him by the proper word.'),
            CH('You’re no bird, little one. And yet you have the Word.'),
            MG('Watch where they take me! Tell Baloo, and Bagheera! The bear and the panther of the Seeonee wolves!', 'shock'),
            CH('Whose trail? Who calls?'),
            MG('Mowgli! The Frog, the wolves’ man-child! Please! Watch where I go!'),
            N('Chil swings away, higher and higher, until he is a dot against the blue, keeping the treetops in sight.'),
            N('You and Baloo and Bagheera are still far behind on the ground when a shadow crosses the path.'),
            CH('They’ve taken him to the Cold Lairs. The Monkey-People stay there a night, a month. Who knows? They don’t.'),
          ],
          choices: [
            {
              id: 'thanks',
              label: 'Thank Chil properly, with the Birds’ word.',
              then: [CH('Good hunting, guest. You whistle like a duck. But you whistle. That’s more than most.', 'happy')],
            },
            {
              id: 'baloo',
              label: 'Turn to Baloo. What now?',
              then: [BL('Now I think. Bears don’t think fast. But they think all the way down.', 'think')],
            },
          ],
        },
        done: {
          id: 'a24-04-chil-done',
          lines: [
            BG('The Cold Lairs. They’re not afraid of us there. They know we can’t climb the way they do.', 'angry'),
            BL('They’re afraid of one thing. Kaa. He can climb as well as they can, and they know it in their bones.'),
          ],
        },
      },
      {
        id: 'a24-04-s3',
        goal: 'Go with Baloo and Bagheera to ask Kaa for help.',
        hint: 'He’s sunning himself on a warm ledge. Speak politely, and don’t mention that he looks hungry.',
        check: 'walk:a24-kaa:ledge',
        scene: {
          id: 'a24-04-kaa',
          lines: [
            N('Kaa lies on a warm ledge in the afternoon sun, admiring himself. He has just changed his skin.'),
            N('He is thirty feet of rock python, and every foot of him is beautifully patterned in brown and yellow.'),
            KA('Good hunting. A bear, and a panther, and a small strange guest, and a smaller, stranger one. What brings you?', 'think'),
            BG('Good hunting, Kaa. We are hunting. The Bandar-log have taken our man’s cub.'),
            BL('They call you names, Kaa. Old rope, they call you. Bootlace. Wriggler.', 'think'),
            KA('Do they.', 'angry'),
            N('Kaa’s head goes very still. That stillness is worse than any roar, and every monkey in the jungle knows it.'),
            KA('The Monkey-People have been very foolish. Where is this cub of yours?'),
          ],
          choices: [
            {
              id: 'polite',
              label: 'Bow to Kaa and tell him his new skin suits him.',
              then: [KA('It does. Thank you for noticing. Nobody notices.', 'happy'), N('Bagheera rolls his eyes at you, but he looks impressed.')],
            },
            {
              id: 'nubbin',
              label: 'Keep your Nubbin behind you.',
              then: [KA('Wise little guest. I don’t eat guests. But I have been known to forget things.', 'think')],
            },
          ],
        },
        done: {
          id: 'a24-04-kaa-done',
          lines: [
            KA('The Cold Lairs, by moonlight. I’ll go by my own road. Don’t wait for me. I’ll be there when I’m there.'),
            N('He pours himself off the ledge and is gone into the grass, and the grass doesn’t even move.'),
          ],
        },
      },
    ],
    complete: {
      id: 'a24-04-complete',
      lines: [
        N('You run with Baloo and Bagheera all afternoon. Baloo is soon out of breath, and keeps going anyway.'),
        BL('I should have watched him better. I cuffed him, and then I didn’t watch him.', 'sad'),
        BG('You taught him the Words, and he used them. That was you, old bear.'),
        N('Your Nubbin rides on Baloo’s back for the last mile, because its legs are short. Baloo lets it.'),
      ],
    },
    rewards: [],
    sets: { 'a24-04': true },
    notes:
      'The Bandar-log are grey langur-like monkeys, monkeys only: no clothes, no human gestures, no human-coded speech ' +
      '(care note). Their lines are bright, silly boasts that forget themselves. Chil is a black kite, high and small. ' +
      'Mowgli whistles the Birds’ word: show it as a whistle shape in his speech bubble, never written out. Kaa is ' +
      'thirty feet of brown-and-yellow rock python, drawn friendly and vain; he is on our side, as in Kipling.',
  },

  // ---------------------------------------------------------------- A24-5
  {
    id: 'a24-05',
    code: 'A24-5',
    title: 'The Cold Lairs',
    source: JB('Kaa’s Hunting'),
    audience: 'all',
    trigger: { where: WHERE, when: after('A24-4') },
    requires: ['A24-4'],
    speakers: [MOWGLI, BANDAR, BAGHEERA, BALOO, KAA],
    steps: [
      {
        id: 'a24-05-s1',
        goal: 'Creep into the Cold Lairs by moonlight and find Mowgli.',
        hint: 'Keep to the shadow of the broken walls. The summer-house is in the middle of the terrace.',
        check: 'explore:a24-cold-lairs:terrace',
        scene: {
          id: 'a24-05-cistern',
          lines: [
            N('The Cold Lairs are a lost city on a hill: roofless palaces, dry fountains, and trees pushing up through the floors.'),
            N('Kings built it once. Nobody remembers which ones, least of all the monkeys, who think they built it themselves.'),
            BD('We are great! We are clever! We have a man’s cub, and he will show us how to weave sticks!', 'happy'),
            BD('Weave, man’s cub! Weave! No, wait, we’re bored of that. Let’s have a council about it. What were we doing?'),
            N('They drop Mowgli through the broken roof of a little summer-house. Inside, the floor is alive with cobras.'),
            MG(LIFT_BLOOD),
            N('He says it with the Snakes’ hiss, the one Baloo said couldn’t be written down. The cobras lower their hoods.'),
            N('Your Nubbin, at the doorway beside you, gives its small hiss too. One old cobra turns its head and seems to approve.'),
          ],
          choices: [
            {
              id: 'signal',
              label: 'Wave to Mowgli through the broken lattice.',
              then: [MG('You came! Is Baloo here? Is he cross?', 'happy'), Y('Very. He’s also running.')],
            },
            {
              id: 'stay',
              label: 'Stay hidden, and watch the terrace for Bagheera.',
              then: [N('A black shape is already moving along the far wall, very slow, the way a cloud moves across the moon.')],
            },
          ],
        },
        done: {
          id: 'a24-05-cistern-done',
          lines: [
            MG('Stay where the snakes are, they say. The snakes are fine. I said the Words. It’s the monkeys that aren’t fine.', 'think'),
            N('Outside, the moon goes behind a cloud.'),
          ],
        },
      },
      {
        id: 'a24-05-s2',
        goal: 'Watch from the summer-house wall while Bagheera and Baloo fight their way in.',
        hint: 'Keep your Nubbin close. You’re here to watch, not to wrestle monkeys.',
        check: 'watch:a24-terrace:fight',
        scene: {
          id: 'a24-05-fight',
          lines: [
            N('Bagheera comes up the terrace at a run, knocking monkeys left and right like skittles.'),
            N('Then a hundred more pour over him. He disappears under grey fur and noise, which is not the same as being beaten.'),
            BG('Get to the water! To the tank! They won’t follow into water!', 'angry'),
            N('Baloo arrives at the bottom of the wall, puffing like a kettle on the boil, and wades into the crowd.'),
            BL('I’m coming! I’m coming, Bagheera! Ouf! There’s too many of them!', 'angry'),
            N('Then a heavy, patient knocking comes from the far wall: one blow, and another, as if the hill itself wants in.'),
            N('A section of old stone falls inward. Through the gap, head first, comes Kaa.'),
            BD('Kaa! It is Kaa! Run! Run!', 'shock'),
            N('Every monkey in the Cold Lairs scatters up the walls and into the trees at once. Nobody has to tell them twice.'),
          ],
          choices: [
            {
              id: 'cheer',
              label: 'Cheer, quietly, behind your hand.',
              then: [N('You cheer behind your hand. Your Nubbin cheers behind both of its, which mostly covers its eyes.')],
            },
            {
              id: 'help',
              label: 'Kick open the summer-house door for Mowgli.',
              then: [N('The door is rotten, and gives at the first kick. Mowgli climbs out, dusty, and checks you over the way Baloo would.')],
            },
          ],
        },
        done: {
          id: 'a24-05-fight-done',
          lines: [
            N('Bagheera climbs out of the water tank, soaked and furious, and shakes himself. Baloo sits down very suddenly.'),
            BL('I’m not hurt. I’m old. It’s different.', 'think'),
          ],
        },
      },
      {
        id: 'a24-05-s3',
        goal: 'Get your Nubbin out of the Cold Lairs while Kaa dances.',
        hint: 'Don’t watch Kaa. Cover your Nubbin’s eyes and follow Mowgli out.',
        check: 'carry:a24-nubbin:hunger-dance',
        scene: {
          id: 'a24-05-dance',
          lines: [
            KA('Is that the man’s cub? Good. Now stay, all of you. I am going to dance. The Dance of the Hunger of Kaa.'),
            N('Kaa begins to move in slow loops, coil over coil, round and round. The moonlight runs along his back like water.'),
            N('Up on the walls the monkeys stop chattering. One by one, they begin to climb down towards him.'),
            N('So do Baloo and Bagheera. They take a step forward, and then another, with their eyes fixed and strange.'),
            MG('Bagheera! Baloo! Don’t look! Come away!', 'shock'),
            N('Your Nubbin is leaning forward too, its eyes wide and round. You feel your own feet want to step.'),
            N('Mowgli grabs Bagheera’s neck and Baloo’s ear and pulls, hard. They come out of it, shuddering, like waking.'),
            BG('Hold on to me, little brother. Don’t let go. My feet want to go back to him.', 'shock'),
          ],
          choices: [
            {
              id: 'eyes',
              label: 'Put your hand over your Nubbin’s eyes and pick it up.',
              then: [N('You lift it, with your palm over its eyes. It goes limp and trusting, and you walk out without looking back.')],
            },
            {
              id: 'turn',
              label: 'Turn your Nubbin round to face you, and carry it out.',
              then: [N('It stares at your face instead of Kaa. You walk out of the Cold Lairs backwards, which is harder than it sounds.')],
            },
          ],
        },
        done: {
          id: 'a24-05-dance-done',
          lines: [
            N('Outside the walls, in the clean moonlight, everyone breathes again. Behind you the city has gone very quiet.'),
            N('Your Nubbin rubs its eyes when you put it down, as if it has had a long and confusing dream.'),
          ],
        },
      },
    ],
    complete: {
      id: 'a24-05-complete',
      lines: [
        BG('You went off with the Monkey-People, and we had to come and get you. That costs something, under the Law.', 'think'),
        MG('I know. I’m sorry. I was wrong. Baloo was right.', 'sad'),
        N('Bagheera gives him a few soft cuffs, the panther way of settling a debt. Mowgli picks himself up and says nothing.'),
        BG('Now jump on my back, little brother. We’re going home. It’s finished, and the Law forgets what’s paid.', 'soft'),
        N('Kaa is still coiled on the moonlit terrace when you look back. He nods to you, slowly, and doesn’t follow.'),
        KA('Come and see me, guest. Sleep in my coils, on a cold night. They keep the warmth very well.'),
      ],
    },
    rewards: [
      {
        id: 'a24-kaa-coil',
        kind: 'decor',
        label: 'Kaa-Coil Cushion',
        description:
          'A long round cushion, brown and yellow, that coils three times round your Nubbin’s bed. It holds the warmth very well.',
      },
    ],
    sets: { 'a24-05': true },
    childLines: {
      'a24-05-cistern#5': CHILD_BLOOD,
    },
    notes:
      'The Cold Lairs: a ruined hilltop city, drawn with care (Indian architecture via the advisers; a ruin overgrown, ' +
      'not "savage"). The cobras lower their hoods and stay calm. The fight has no wounds (care note): monkeys bundle and ' +
      'bounce off, Bagheera ends up soaked, Baloo sits down tired. KAA’S HUNGER DANCE: slow coils, soft hypnotic swirl; ' +
      'respect prefers-reduced-motion (swap the swirl for a slow dim). The monkeys walk towards Kaa; the screen dims on ' +
      'them as you leave, and nothing is shown. The love-taps are panther cuffs, played softly; Mowgli is fine.',
  },

  // ---------------------------------------------------------------- A24-6
  {
    id: 'a24-06',
    code: 'A24-6',
    title: 'The Red Flower',
    source: JB('Mowgli’s Brothers'),
    audience: 'all',
    trigger: { where: WHERE, when: after('A24-5') },
    requires: ['A24-5'],
    speakers: [MOWGLI, BAGHEERA, AKELA, VILLAGER],
    steps: [
      {
        id: 'a24-06-s1',
        goal: 'Find Bagheera and Mowgli under the trees at night.',
        hint: 'Bagheera lies along a branch over the path, where the shade is deepest.',
        check: 'talk:a24-bagheera:night',
        scene: {
          id: 'a24-06-branch',
          lines: [
            N('Years go by on the page. Mowgli is ten or eleven now, long-legged, and he has never once lived in a house.'),
            N('Akela grows old. Shere Khan, who never gave up, has made friends with the young wolves, and feeds them scraps.'),
            BG('Little brother. Shere Khan has not forgotten you. I’ve said it before, and I’m saying it again.', 'think'),
            MG('You say it every night. I’m sleepy, Bagheera. Say it tomorrow.'),
            BG('The young wolves listen to him now. They say a man’s cub has no place with the pack. Akela is old.'),
            BG('One day he will miss his kill. Then there will be no Lone Wolf, and no one to speak for you.'),
            N('Bagheera shows you both a bald patch of skin under his chin, hidden by the black fur. It looks like an old collar mark.'),
            BG('I was born among men, in cages. I broke the lock and came away. Men are clever. So are you, little brother.'),
          ],
          choices: [
            {
              id: 'ask',
              label: 'Ask Bagheera what Mowgli should do.',
              then: [BG('Men keep a thing in their huts that every beast is afraid of. The Red Flower. Fire. Fetch some.')],
            },
            {
              id: 'mowgli',
              label: 'Look at Mowgli. He’s gone very quiet.',
              then: [MG('They’re my brothers. I grew up in their cave. Why would they want me gone?', 'sad'), BG('Then be ready for them, little brother. Fetch the Red Flower.')],
            },
          ],
        },
        done: {
          id: 'a24-06-branch-done',
          lines: [
            MG('The Red Flower. I know where. They keep it by the doors at night. I’ll go now.'),
            BG('Take the guest. Guests are good at carrying things. And they don’t smell of wolf.'),
          ],
        },
      },
      {
        id: 'a24-06-s2',
        goal: 'Go down to the village at dawn with Mowgli for the Red Flower.',
        hint: 'Wait in the ditch by the first hut. Mowgli goes in alone.',
        check: 'carry:a24-fire-pot:village',
        scene: {
          id: 'a24-06-pot',
          lines: [
            N('You lie in a ditch at the edge of the village, in the cold before dawn. Your Nubbin lies in the ditch too, very damp.'),
            N('A farmer’s wife comes out of the nearest hut with a clay pot of glowing coals, to light the fire in the field.'),
            N('She sets it down by the door and goes back for her shawl. Mowgli is out of the ditch before she reaches the step.'),
            N('He comes back with the pot held in both hands, breathing on it the way he saw her do.'),
            MG('She looks like me. They all look like me. I thought they’d be different.', 'think'),
            VI('My fire-pot! Where has it gone? Who took my fire?', 'shock'),
            N('The woman stares at the empty place on her step. She doesn’t look like a monster; she looks like someone with a cold breakfast.'),
          ],
          choices: [
            {
              id: 'coin',
              label: 'Leave something on the step for her before you go.',
              then: [N('You leave a smooth river stone with a hole in it, the best thing in your pocket. It isn’t enough, but it’s something.')],
            },
            {
              id: 'go',
              label: 'Run after Mowgli with the pot.',
              then: [N('You run. Behind you a neighbour’s door opens, and she gets her fire from there, because it’s a village and they share.')],
            },
          ],
        },
        done: {
          id: 'a24-06-pot-done',
          lines: [
            N('Back in the jungle, Mowgli sets the pot down on a flat stone and looks at it for a long time.'),
            MG('If I don’t feed it, it will die. The woman fed it with sticks and dry stuff. I saw her.'),
          ],
        },
      },
      {
        id: 'a24-06-s3',
        goal: 'Help Mowgli keep the fire alive all day.',
        hint: 'Bring dry twigs, not green ones. Feed it a little at a time.',
        check: 'feed:a24-fire-pot:dry-sticks',
        scene: {
          id: 'a24-06-feed',
          lines: [
            N('All day you and Mowgli feed the Red Flower with dry twigs and bark, and keep it in the shade, out of the wind.'),
            N('Your Nubbin brings twigs too, mostly dry ones. One is a beetle, which it thinks better of and puts back.'),
            MG('It eats like a wolf cub. Always hungry. And if you stop, it goes grey and sulks, like Baloo.', 'happy'),
            N('Once the coals go dull and you both blow on them, cheeks puffed, until they glow red again.'),
            N('A wolf comes past in the afternoon. He sees the pot and goes the long way round, with his fur on end.'),
            MG('He’s afraid of it. They all are. I’m not. Is that what it means, being a man?', 'think'),
          ],
          choices: [
            {
              id: 'answer',
              label: 'Tell him you don’t know. You’re still working it out too.',
              then: [MG('Good. I don’t like people who know everything. Except Baloo. He has to.', 'happy')],
            },
            {
              id: 'blow',
              label: 'Show him how to blow gently, not hard.',
              then: [N('He copies you, and the coals glow like a cat’s eyes in the dark. He laughs out loud.')],
            },
          ],
        },
        done: {
          id: 'a24-06-feed-done',
          lines: [
            N('By evening the fire-pot is glowing steadily, and Mowgli has a dead branch beside it, ready.'),
            N('Tabaqui slinks into the clearing, grinning. The young wolves want Mowgli at the Council Rock tonight, he says, all of them.'),
          ],
        },
      },
    ],
    complete: {
      id: 'a24-06-complete',
      lines: [
        BG('Akela missed his kill tonight. They say the young wolves tricked the buck into knocking him down.', 'sad'),
        MG('Then I’ll go to the Council. With this.'),
        N('He lifts the fire-pot in both hands. It lights his face from below, and for a moment he looks older than he is.'),
        BG('Stay near, guest. Stay near him. He doesn’t know yet how heavy that pot is going to be.', 'soft'),
      ],
    },
    rewards: [],
    sets: { 'a24-06': true },
    notes:
      'The village woman is a farmer’s wife at dawn with a shawl and a clay fire-pot, drawn with care (Indian advisers ' +
      'for dress and the hut). She is a person with a cold breakfast, not a figure of fun (care note). The fire-pot is a ' +
      'small round clay pot of glowing coals. feed:a24-fire-pot:dry-sticks is a gentle feeding minigame: tap dry twigs ' +
      'into the pot as the glow dims; green twigs make it smoke and sulk; it never goes out for good, and there is no timer.',
  },

  // ---------------------------------------------------------------- A24-7
  {
    id: 'a24-07',
    code: 'A24-7',
    title: 'The Council of Fire',
    source: JB('Mowgli’s Brothers'),
    audience: 'all',
    trigger: { where: WHERE, when: after('A24-6') },
    requires: ['A24-6'],
    speakers: [AKELA, SHEREKHAN, MOWGLI, BAGHEERA, YOUNGWOLF, MOTHERWOLF],
    steps: [
      {
        id: 'a24-07-s1',
        goal: 'Go up to the Council Rock with Mowgli and the fire-pot.',
        hint: 'Keep the pot steady. Stand at the edge, as before.',
        check: 'watch:a24-council:fire',
        scene: {
          id: 'a24-07-council',
          lines: [
            N('Akela lies beside his rock tonight, not on top of it. Everyone knows what that means.'),
            N('Shere Khan walks up and down in front of the young wolves, being flattered. He is not even supposed to be here.'),
            SK('The man’s cub is mine. Give him to me, and I will trouble you no more.', 'angry'),
            YW('A man’s cub. What has a man’s cub to do with us? Let him go back to his own kind!'),
            AK('He has eaten our food. He has slept with us. He has driven game for us, and broken no word of the Law.', 'think'),
            AK('I missed my kill. I know what follows. But take my life, not his. I will not fight you for it. That is my offer.'),
            N('Mowgli stands up with the fire-pot in his hands. He stretches out his arms and yawns, very rude, very slow.'),
            MG('Stop it! You keep telling me I’m a man. All right. Men carry this, so I brought some.'),
            N('He tips the pot onto the ground. The coals catch a tuft of dry moss, and it flares up bright.'),
            N('Every wolf on the hill scrambles back from the light, ears flat.'),
          ],
          choices: [
            {
              id: 'back',
              label: 'Step back with your Nubbin, out of the light.',
              then: [N('You step back. Your Nubbin hides its face in your knees, and peeks.')],
            },
            {
              id: 'stand',
              label: 'Stand where you are, behind Mowgli.',
              then: [N('You stand where you are. Across the firelight Mother Wolf sees you there, at his back, and her eyes thank you.')],
            },
          ],
        },
        done: {
          id: 'a24-07-council-done',
          lines: [
            N('Mowgli thrusts the dead branch into the fire, and swings it round his head among the cowering wolves.'),
            N('He goes straight at Shere Khan with the flame. The tiger’s whiskers crackle, and he turns and runs for the dark.'),
          ],
        },
      },
      {
        id: 'a24-07-s2',
        goal: 'Stay with Mowgli on the rock after the Council breaks.',
        hint: 'Sit with him. You don’t need to say anything.',
        check: 'sit:a24-mowgli:council-rock',
        scene: {
          id: 'a24-07-tears',
          lines: [
            MG('Go! All of you! Akela goes free, to live as he pleases. You won’t kill him, because I don’t want you to.', 'angry'),
            MG('And I am going to my own people. If they are my own people. The jungle is shut to me.', 'sad'),
            N('Shere Khan and the young wolves have fled. Only Akela and Bagheera and the four cubs stay, and you.'),
            N('Then something hurts inside him, somewhere no thorn or tooth has ever reached. He catches his breath.'),
            N('Water runs out of his eyes and down his face, and he can’t stop it.'),
            MG('What is it? What is it? I don’t want to leave the jungle. Am I dying, Bagheera?', 'shock'),
            BG('No, little brother. Wolves can’t do that. Men can. You’re a man now; that’s all it means.', 'soft'),
            BG(LIFT_TEARS, 'soft'),
            N('So he cries, hard, with his whole body, the way you only can the first time.'),
          ],
          choices: [
            {
              id: 'sit',
              label: 'Sit down beside him on the rock, and wait.',
              then: [N('You sit beside him. Your Nubbin climbs into his lap, uninvited, and stays there until he has finished.')],
            },
            {
              id: 'arm',
              label: 'Put your arm round his shoulders.',
              then: [N('He leans into you the way a cub leans into its mother’s side. It goes on a long time, and you don’t mind.')],
            },
          ],
        },
        done: {
          id: 'a24-07-tears-done',
          lines: [
            MG('Now I’ll go to men. But first I must say goodbye to my mother.', 'sad'),
            N('He goes down to the cave and puts his face in Mother Wolf’s fur. The cubs, who are grown now, howl.'),
          ],
        },
      },
    ],
    complete: {
      id: 'a24-07-complete',
      lines: [
        MW('Come back to us, my bare little frog. Come often. Your brothers will watch the road for you.', 'sad'),
        MG('I’ll come back. And I’ll bring the tiger’s coat with me, to show the pack I meant it. Don’t forget me.', 'soft'),
        N('Dawn is coming. Mowgli goes down the hill alone, towards the smoke of the villages.'),
        N('The fire-pot is cold on the Council Rock. Bagheera pushes it towards you with his nose.'),
        BG('Keep it, guest. You fed it. That makes it partly yours, under any law I know.'),
      ],
    },
    rewards: [
      {
        id: 'a24-fire-pot',
        kind: 'decor',
        label: 'Fire-Pot Lantern',
        description:
          'A small clay pot with a warm glow inside, like coals breathed on at dawn. It sits by the cottage step and never needs feeding.',
      },
    ],
    sets: { 'a24-07': true },
    childLines: {
      'a24-07-tears#7': 'It’s all right to let them fall, Mowgli. Crying is how sadness comes out.',
    },
    notes:
      'The Council of Fire: night, the rock lit from below by the fire. The fire is a tuft of moss and a branch, never ' +
      'a spreading blaze; Shere Khan is singed (his chin fur), not burned. Akela lies BESIDE the rock. The third rule is ' +
      'acted out in step 2 (sit beside him and wait) and never quoted. The tears scene should run slowly; no music cue ' +
      'telling the player what to feel. The Fire-Pot Lantern is a Grove decor (a warm point light, no fuel, no timer).',
  },

  // ---------------------------------------------------------------- A24-8
  {
    id: 'a24-08',
    code: 'A24-8',
    title: 'Messua',
    source: JB('Tiger! Tiger!'),
    audience: 'all',
    trigger: { where: WHERE, when: after('A24-7') },
    requires: ['A24-7'],
    speakers: [MOWGLI, MESSUA, VILLAGER, BULDEO, GREYBROTHER],
    steps: [
      {
        id: 'a24-08-s1',
        goal: 'Walk into the village with Mowgli.',
        hint: 'Walk slowly, and keep your Nubbin in your arms. The village dogs are nervous.',
        check: 'walk:a24-village:gate',
        scene: {
          id: 'a24-08-gate',
          lines: [
            N('Mowgli walks down the hills to the plain, far from the Seeonee. He has never seen so many people in one place.'),
            N('The village dogs bark, and the children run indoors. A crowd gathers at the gate to stare at a boy with twigs in his hair.'),
            VI('A wolf-child! Look at his arms, the bites on them. He’s run with wolves since he was small.', 'shock'),
            VI('Poor thing. Poor lost thing. Someone ought to take him in.'),
            N('A woman comes forward with heavy copper rings on her arms. She looks at Mowgli’s face for a long time.'),
            ME('My Nathoo. The tiger took my Nathoo, years ago. He had eyes like that. He’d be this age now.', 'soft'),
            N('Half of her believes this is her son come home. The other half doesn’t mind either way.'),
            ME('Come home, son. Whoever you are, come home. And bring your friend. You both look hungry.'),
          ],
          choices: [
            {
              id: 'thank',
              label: 'Thank her, and bow.',
              then: [ME('Bowing! Such manners. Where did you two learn manners in a forest?', 'happy'), Y('From a bear.')],
            },
            {
              id: 'mowgli',
              label: 'Let Mowgli go in first.',
              then: [N('He goes in first, slowly, like a wild thing into a trap. Messua holds the door and doesn’t hurry him.')],
            },
          ],
        },
        done: {
          id: 'a24-08-gate-done',
          lines: [
            N('Messua gives him milk and bread, and looks into his eyes, and he looks back at her. It is almost enough.'),
            ME('My Nathoo had a little red cap. He wouldn’t take it off, even to sleep. Do you remember?', 'sad'),
          ],
        },
      },
      {
        id: 'a24-08-s2',
        goal: 'Go out with Mowgli to herd the village buffalo.',
        hint: 'Sit on a buffalo’s back and let it graze. Mowgli knows which ones bite.',
        check: 'watch:a24-buffalo:grazing',
        scene: {
          id: 'a24-08-herd',
          lines: [
            N('Mowgli learns to speak, and to wear a cloth. He sleeps badly under a roof, and sometimes he sleeps in the field.'),
            N('Then they give him the buffalo to herd, because nobody else can make them mind. He rides them like boats.'),
            MG('Men. They make noise all day. They gossip like monkeys. But Messua is good.', 'think'),
            N('At the edge of the grazing ground a grey shape is waiting by the river. Grey Brother, Mother Wolf’s eldest.'),
            GB('Little brother. I come to tell you that Shere Khan has gone away to the far side of the hills, to heal his coat.', 'happy'),
            GB('When his coat grows back, he says, he’ll come for you. I came to warn you.'),
            MG('I’m not afraid of him. Watch for him for me, brother. Sit on the rock by the river, if he comes.'),
          ],
          choices: [
            {
              id: 'pet',
              label: 'Scratch Grey Brother behind the ears.',
              then: [GB('You’re still here, guest. And the little one. Good. Does it still howl like a kettle?', 'happy'), N('It does. It demonstrates.')],
            },
            {
              id: 'nubbin',
              label: 'Let your Nubbin go and say hello.',
              then: [N('Your Nubbin trots to Grey Brother and tumbles against his legs like the cub it thinks it is.')],
            },
          ],
        },
        done: {
          id: 'a24-08-herd-done',
          lines: [
            N('Days pass, in the heat, with the buffalo up to their noses in the mud.'),
            N('Your Nubbin learns to ride a buffalo too. It falls off twice, into the mud, and gets back on, very dignified.'),
          ],
        },
      },
      {
        id: 'a24-08-s3',
        goal: 'Go with Mowgli to the village tree in the evening.',
        hint: 'Sit at the back. The men tell tales under the great fig tree after dark.',
        check: 'visit:a24-village-tree:evening',
        scene: {
          id: 'a24-08-tree',
          lines: [
            N('In the evenings the men sit on a stone platform under a great fig tree, and talk.'),
            N('Buldeo the hunter tells the best stories. He has an old musket and a voice that goes down when he wants you to lean in.'),
            BU('The tiger that took Messua’s boy is no tiger at all. He’s a ghost. The ghost of a mean old man from over the river.', 'think'),
            BU('I know it, because the old man limped, and this tiger limps. You see? It stands to reason.'),
            VI('Don’t talk about ghosts after dark, Buldeo. The children are listening.', 'shock'),
            N('Mowgli laughs out loud. Everyone turns to look.'),
            MG('He limps because he was born lame. Everyone knows that. And he’s no ghost; he’s just old and bad-tempered.', 'happy'),
            N('Buldeo’s face goes hot. But under it, for a moment, you see that he is afraid, of the tiger and of the dark.'),
          ],
          choices: [
            {
              id: 'buldeo',
              label: 'Ask Buldeo to tell you more about the forest.',
              then: [BU('Hmph. At least someone here knows how to listen.', 'happy'), N('He tells you about a peacock as big as a cart. You nod, politely, all the way through.')],
            },
            {
              id: 'mowgli',
              label: 'Nudge Mowgli. He has made Buldeo look foolish in front of everyone.',
              then: [MG('He is foolish. Oh. You mean I shouldn’t say so. Wolves just say so.', 'think'), N('He thinks about that for a whole minute, which is a long time for him.')],
            },
          ],
        },
        done: {
          id: 'a24-08-tree-done',
          lines: [
            N('Buldeo goes home early. Next morning the headman tells Mowgli to graze the buffalo far out on the plain, well away from the village tree.'),
            ME('Come home, son. Come home, and sleep. Leave old men to their stories.', 'soft'),
          ],
        },
      },
    ],
    complete: {
      id: 'a24-08-complete',
      lines: [
        N('Messua makes you a bed by the hearth. She makes your Nubbin one too, in a basket with a folded blanket.'),
        ME('Two strays and a boy. I always wanted a full house. It’s just I thought there’d be fewer feathers.', 'happy'),
        N('Your Nubbin is moulting a little, from all the excitement. She sweeps up after it without a word.'),
        N('That night you hear Mowgli get up and go out to sleep in the field, under the sky. Messua hears it too, and doesn’t stop him.'),
      ],
    },
    rewards: [],
    sets: { 'a24-08': true },
    notes:
      'CARE: the village is drawn and written with Indian advisers (names, dress, the platform and the fig tree, the ' +
      'houses). The villagers are frightened people, not stupid ones; Buldeo exaggerates because he is afraid, and the ' +
      'narration never mocks him (step 3’s last line). Messua is the village’s heart. The headman sends Mowgli to graze the ' +
      'buffalo far out on the plain; no priest scene. Buldeo’s musket is shown slung and never fired. Nathoo is spoken of, ' +
      'never shown.',
  },

  // ---------------------------------------------------------------- A24-9
  {
    id: 'a24-09',
    code: 'A24-9',
    title: 'Tiger! Tiger!',
    source: JB('Tiger! Tiger!'),
    audience: 'all',
    trigger: { where: WHERE, when: after('A24-8') },
    requires: ['A24-8'],
    speakers: [GREYBROTHER, MOWGLI, AKELA, BULDEO],
    steps: [
      {
        id: 'a24-09-s1',
        goal: 'Meet Grey Brother at the ford with Mowgli.',
        hint: 'The ford is where the river widens. Watch for a grey back in the grass.',
        check: 'talk:a24-grey-brother:ford',
        scene: {
          id: 'a24-09-ford',
          lines: [
            N('One morning there is a grey shape on the rock by the river. Grey Brother has come back, as he promised.'),
            GB('He’s back. He ate well last night, and now he’s sleeping it off down in the dry ravine by the river.', 'think'),
            GB('Full and slow, in the heat of the day. Tonight he means to wait for you at the village gate.'),
            MG('Then he’s full, and he’s slow. And he’s lying in a ravine with a mouth at each end. Akela! Is Akela here?'),
            N('From the long grass rises the great grey Lone Wolf, gaunt now, but with his eyes as clear as ever.'),
            AK('I’m here, little brother. I’ve been waiting since the Council of Fire for you to need me.', 'happy'),
            MG('Split the herd for me. Cows and calves at one end. Bulls and plough-buffalo at the other. And then drive.', 'angry'),
          ],
          choices: [
            {
              id: 'help',
              label: 'Ask what you and your Nubbin can do.',
              then: [MG('Stand at the top of the ravine and wave when the herd is in. Don’t go down. Whatever you hear.')],
            },
            {
              id: 'akela',
              label: 'Greet Akela, who you last saw by the fire.',
              then: [AK('Good hunting, guest. You stood at his back. The pack noticed, after. Some of them were ashamed.', 'soft')],
            },
          ],
        },
        done: {
          id: 'a24-09-ford-done',
          lines: [
            N('Akela and Grey Brother run in among the buffalo. In a few minutes the herd is split, and grumbling, in two.'),
            N('You climb to the top of the ravine with your Nubbin, where you can see both ends, and lie flat in the hot grass.'),
          ],
        },
      },
      {
        id: 'a24-09-s2',
        goal: 'Watch from the top of the ravine while the herd comes through.',
        hint: 'Stay flat, and wave when both halves are in. Then cover your ears.',
        check: 'escort:a24-herd:ravine',
        scene: {
          id: 'a24-09-ravine',
          lines: [
            N('Mowgli rides the lead bull of the herd, Rama, round the head of the ravine. Akela drives the other half in from below.'),
            N('Both halves are in, and you wave. Mowgli puts his hands to his mouth and shouts down into the ravine.'),
            MG('Shere Khan! Wake up! It’s Mowgli! I’ve come with the buffalo!', 'angry'),
            N('Then the herd pours in from both ends at once.'),
            N('A roar of hooves. A cloud of red dust that rises up the walls of the ravine like smoke, and hides everything.'),
            N('Your Nubbin buries its face in your side. You put your hands over its ears, and then over your own.'),
            N('Then it is quiet. A long quiet, with only the dust settling, and a buffalo blowing through its nose.'),
          ],
          choices: [
            {
              id: 'wait',
              label: 'Wait at the top until the dust clears.',
              then: [N('You wait. Below, Mowgli climbs down off Rama, and walks into the settling dust, and doesn’t come out for a while.')],
            },
            {
              id: 'hold',
              label: 'Hold your Nubbin and count your breaths.',
              then: [N('You count to forty. On forty-one, Akela trots up the side of the ravine and sits down next to you, panting.')],
            },
          ],
        },
        done: {
          id: 'a24-09-ravine-done',
          lines: [
            AK('It is finished. He won’t trouble the jungle again, nor the village. He never woke up all the way.', 'think'),
            N('The buffalo spread out across the plain and start eating grass as if nothing has happened. To them, nothing has.'),
          ],
        },
      },
      {
        id: 'a24-09-s3',
        goal: 'Watch at the ravine mouth while Buldeo comes for the bounty.',
        hint: 'Keep your Nubbin back. Akela will handle Buldeo; nobody gets hurt.',
        check: 'watch:a24-buldeo:ravine',
        scene: {
          id: 'a24-09-bounty',
          lines: [
            N('Down at the ravine mouth Mowgli kneels with his back to you, busy. He means to take the hide to the Council Rock.'),
            N('Buldeo comes running from the village with his musket, red-faced and out of breath, having heard the noise.'),
            BU('Ho! That tiger has a hundred rupees on its head. A hunter’s bounty. Mine, by rights. Leave it to me, boy.', 'angry'),
            MG('It’s my kill. I’m taking the hide. Go away, old man.'),
            BU('You? A herd-boy? I’ll have the headman beat you for this!', 'angry'),
            MG('Akela. This man is bothering me.'),
            N('Akela stands up out of the grass, and Buldeo finds himself flat on his back with a grey wolf standing over him.'),
            N('Akela doesn’t bite. He only stands there, very large and very calm, like a heavy rug that has opinions.'),
          ],
          choices: [
            {
              id: 'help',
              label: 'Help Buldeo up when Akela lets him go.',
              then: [N('He takes your hand, shaking. He tries to say something brave and can’t, and nods instead.')],
            },
            {
              id: 'mowgli',
              label: 'Ask Mowgli to let him go now.',
              then: [MG('Let him up, brother. He’s frightened. He’s just a frightened old man.', 'think'), N('Akela steps off. Buldeo runs, and you’re glad.')],
            },
          ],
        },
        done: {
          id: 'a24-09-bounty-done',
          lines: [
            N('Buldeo runs back to the village as fast as his legs will go. He will tell a story about this, a very large one.'),
            MG('He’ll tell them I’m a sorcerer. Let him. I’ve kept my word to Mother Wolf.', 'think'),
          ],
        },
      },
    ],
    complete: {
      id: 'a24-09-complete',
      lines: [
        N('By evening the hide is rolled and tied, and Mowgli carries it on his shoulder like a bundle of washing.'),
        AK('You did what you said you’d do, little brother. Not many do.'),
        MG('I said it on the Council Rock. In front of everyone. So now it has to go there.'),
        N('Behind you, in the dusk, the lights of the village come on one by one, and voices are rising.'),
      ],
    },
    rewards: [],
    sets: { 'a24-09': true },
    notes:
      'SOFTENED FOR ALL (care note): Shere Khan is never seen alive or dead. The stampede is a rolling wall of red dust ' +
      'and noise, then silence; no body, no blood. Mowgli works out of sight at the ravine mouth (show only his back and ' +
      'the dust). The hide is next seen rolled and tied (complete), and shown only when it is spread on the Council Rock ' +
      'in A24-11. Buldeo is knocked down by Akela standing over him, unhurt. Rama is the lead buffalo bull.',
  },

  // ---------------------------------------------------------------- A24-10
  {
    id: 'a24-10',
    code: 'A24-10',
    title: 'Stones',
    source: JB('Tiger! Tiger!'),
    audience: 'all',
    trigger: { where: WHERE, when: after('A24-9') },
    requires: ['A24-9'],
    speakers: [MOWGLI, MESSUA, VILLAGER, BULDEO, AKELA, GREYBROTHER],
    steps: [
      {
        id: 'a24-10-s1',
        goal: 'Walk back to the village with Mowgli at dusk.',
        hint: 'Walk at his side. Keep your Nubbin in your arms when the voices start.',
        check: 'walk:a24-village:dusk',
        scene: {
          id: 'a24-10-dusk',
          lines: [
            N('At the edge of the village the whole place is waiting for you, with torches, and with Buldeo in front.'),
            BU('That’s him. He talks to wolves. They do what he tells them. I saw it with my own eyes, and so did my back.', 'angry'),
            VI('Wolf-boy! Sorcerer! He turned himself into a wolf and back again. He’ll do the same to our cattle!', 'shock'),
            VI('Go away! Go back to the jungle, and take your demons with you!', 'angry'),
            N('Somebody throws a stone, and it goes wide. Then another, and another, clattering on the road round your feet.'),
            N('They aren’t aiming well; their hands are shaking. They are not cruel people, but very frightened ones.'),
            MG('Again? First the wolves throw me out because I’m a man. Now men throw me out because I’m a wolf.', 'sad'),
            N('Then a woman pushes through the crowd, running, with her arms out. It’s Messua, and she is crying.'),
            ME('Oh, my son, my son! They say you’re a sorcerer. I don’t believe it. Go, go quickly. They’ll hurt you.', 'sad'),
          ],
          choices: [
            {
              id: 'shield',
              label: 'Stand between Messua and the stones.',
              then: [N('You stand in the road with your Nubbin behind you. Nobody throws anything at you; nobody quite dares.')],
            },
            {
              id: 'nubbin',
              label: 'Hold your Nubbin tight and keep your head down.',
              then: [N('Your Nubbin trembles against you. A stone lands near your boot, and rolls, and stops.')],
            },
          ],
        },
        done: {
          id: 'a24-10-dusk-done',
          lines: [
            MG('Go back, Messua. It isn’t your fault. You were good to me. Go home before they turn on you.', 'soft'),
            ME('Goodbye, my son. Goodbye. I don’t know if you’re Nathoo. I loved you anyway.', 'sad'),
          ],
        },
      },
      {
        id: 'a24-10-s2',
        goal: 'Choose: go with Mowgli into the jungle, or stay a little with Messua.',
        hint: 'Either road is a good one. Mowgli will understand both.',
        check: 'choose:a24-stones:road',
        scene: {
          id: 'a24-10-road',
          lines: [
            N('Mowgli turns and walks away up the road, towards the dark line of the trees. Akela and Grey Brother come out of the grass to meet him.'),
            N('Messua stands in the road behind you, with her hands pressed to her mouth. The crowd has gone quiet now, and a little ashamed.'),
            N('She has lost a son twice now. Once to a tiger, and once to her own neighbours.'),
            MG('Guest? Are you coming? The jungle is home. You know the Words. You can come.', 'think'),
            N('Your Nubbin looks at Mowgli, then back at Messua, then up at you. It is waiting to see what you do.'),
            ME('Go on, both of you. Don’t worry about me. I have my house, and my husband. I’ll be well enough.', 'sad'),
          ],
          choices: [
            {
              id: 'mowgli',
              label: 'Go with Mowgli into the jungle.',
              set: { 'a24-stones': 'mowgli' },
              then: [MG('Good. The wolves will be glad. The little one has been howling for them all week.', 'happy')],
            },
            {
              id: 'messua',
              label: 'Stay a little with Messua, and follow later.',
              set: { 'a24-stones': 'messua' },
              then: [MG('Yes. Stay with her. Someone should. I’ll know where to find you.', 'soft')],
            },
          ],
        },
        done: {
          id: 'a24-10-road-done',
          lines: [
            N('You catch up with Mowgli at the edge of the trees. Behind you the torches stand in the road, getting smaller.'),
            N('Your Nubbin trots between Akela and Grey Brother, nose up, a wolf among wolves. It has never been so pleased with itself.'),
          ],
        },
      },
    ],
    complete: {
      id: 'a24-10-complete',
      lines: [
        MG('Tonight the hide goes to the Council Rock. I promised. And after that, you hunt with us. A whole season.'),
        N('So you do, after. You hunt with the four wolves through the turning year, and learn the jungle from inside.'),
        N('You learn where the deer drink, and which trees hum with bees. You learn how quiet a whole hillside can be at noon.'),
        GB('You’re still terrible at it, guest. But you’re terrible in the right direction.', 'happy'),
        N('Your Nubbin catches its first beetle. It brings it to you, very proud, and you let it go again when it isn’t looking.'),
      ],
    },
    rewards: [],
    sets: { 'a24-10': true },
    notes:
      'THE SIGNATURE CHOICE (a24-10-road): a24-stones = mowgli | messua. It pays off in A24-13 (three quests later), ' +
      'A24-15 and A24-16. With messua, play ATLAS_A24_VARIANTS a24-10-road-done-messua in place of a24-10-road-done, ' +
      'and a24-10-complete-messua in place of a24-10-complete. ' +
      'CARE: the villagers are frightened, not cruel (a24-10-dusk#5); the stones miss, and nobody is hit. Nobody is ' +
      'shown as foolish. The torches are carried, never thrown.',
  },

  // ---------------------------------------------------------------- A24-11
  {
    id: 'a24-11',
    code: 'A24-11',
    title: 'Look Well',
    source: JB('Tiger! Tiger!'),
    audience: 'all',
    trigger: { where: WHERE, when: after('A24-10') },
    requires: ['A24-10'],
    speakers: [MOWGLI, AKELA, YOUNGWOLF, BAGHEERA, GREYBROTHER],
    steps: [
      {
        id: 'a24-11-s1',
        goal: 'Climb to the Council Rock as the moon comes up.',
        hint: 'Follow the path up the hill. Mowgli is already there.',
        check: 'walk:a24-council-rock:moonrise',
        scene: {
          id: 'a24-11-climb',
          lines: [
            N('By whichever road you came, you reach the Council Rock as the moon clears the hills.'),
            N('Mowgli is already there. He has spread the great striped hide flat across the stone, and pinned it with four bamboo pegs.'),
            N('Your Nubbin looks at the stripes for a long time. Then it sits down on the very corner, carefully, like a cushion it isn’t sure of.'),
            MG('I said I’d bring it here. I keep my word. Not everyone does, on this hill.'),
            N('Akela climbs up slowly and lies down on the hide, at full length, in the place where he used to lie.'),
            AK('There. That’s where I lay, before. It feels the same. My bones are older. That’s all.', 'soft'),
          ],
          choices: [
            {
              id: 'sit',
              label: 'Sit at the edge, where the guests sit.',
              then: [N('You sit in your old place among the rocks. It fits you better than it did.')],
            },
            {
              id: 'akela',
              label: 'Go and sit near Akela.',
              then: [AK('Sit, guest. You’ve earned a closer seat. Not too close. I still have fleas.', 'happy')],
            },
          ],
        },
        done: {
          id: 'a24-11-climb-done',
          lines: [
            N('Akela lifts his head and gives the old call, the Council call, out over the hills.'),
            N('Your Nubbin answers it. It still sounds like a kettle, but a kettle that means it.'),
          ],
        },
      },
      {
        id: 'a24-11-s2',
        goal: 'Watch the pack come to the Council Rock.',
        hint: 'Stay still. This is the pack’s business.',
        check: 'watch:a24-pack:council-rock',
        scene: {
          id: 'a24-11-pack',
          lines: [
            N('They come up the hill in ones and twos, thin, and some of them limping. Many have been in traps, or fought with each other.'),
            N('Without a leader the pack has fallen apart: no law, no hunting together, everybody for himself.'),
            AK('Look. Look well, wolves. Have I kept my word? Has the man’s cub kept his?', 'think'),
            N('The wolves look at the hide, and then at Mowgli. A long murmur goes round the rock.'),
            YW('Lead us again, Akela. We’ve had enough of being without a law. And you, man’s cub, lead us too.', 'sad'),
            YW('We’re sick of the tiger’s ways. We want to be the Free People again.'),
            BG('Not so fast. You only want him back because you’re hungry and lame. You threw him out when you were fat.', 'angry'),
            MG('No. Man threw me out, and wolf threw me out. Now I’ll hunt alone. With my four brothers, if they’ll come.', 'think'),
          ],
          choices: [
            {
              id: 'proud',
              label: 'Look at Mowgli and nod.',
              then: [N('He sees it. He doesn’t nod back, but he stands a little straighter.')],
            },
            {
              id: 'pack',
              label: 'Look at the thin young wolves instead.',
              then: [N('They’re ashamed, and hungry, and young. One of them sees you looking, and looks at his own paws.')],
            },
          ],
        },
        done: {
          id: 'a24-11-pack-done',
          lines: [
            GB('We’ll come. All four of us. Where you hunt, we hunt.', 'happy'),
            N('Akela lies on the hide and looks out over the hills. He doesn’t say yes to the pack, and he doesn’t say no.'),
          ],
        },
      },
    ],
    complete: {
      id: 'a24-11-complete',
      lines: [
        N('When the pack has gone, the Council Rock is empty again. The flat stone is warm from the day.'),
        BG('Good. He’ll do. He didn’t need them in the end. That’s how you know a cub has grown.', 'think'),
        N('Your Nubbin climbs onto the flat stone where Akela lay, turns round three times, and settles down to watch the moon.'),
        BG('Look at that. It’s calling a Council of one. Take the rock home with you, guest. You’ll find a place for it.', 'happy'),
      ],
    },
    rewards: [
      {
        id: 'a24-council-rock',
        kind: 'decor',
        label: 'The Council Rock',
        description:
          'A flat grey rock for the edge of the long grass. Your Nubbins sit on it in a ring when they feel like it, and look at the moon.',
      },
    ],
    sets: { 'a24-11': true },
    notes:
      'The hide is shown only spread on the rock (care note), drawn as a striped rug pegged flat; no head is shown. ' +
      '"Look well" is Kipling’s Council phrase, paraphrased (a24-11-pack#2). Step 1’s first line works for both ' +
      'a24-stones paths (“by whichever road you came”). The Council Rock is a Grove decor placed by the long grass: ' +
      'Nubbins choose to sit on it in a ring when idle and the moon is up; it has no timer and gives no stats.',
  },

  // ---------------------------------------------------------------- A24-12
  {
    id: 'a24-12',
    code: 'A24-12',
    title: 'The Water Truce',
    source: SJB('How Fear Came'),
    audience: 'all',
    trigger: { where: WHERE, when: after('A24-11') },
    requires: ['A24-11'],
    speakers: [HATHI, MOWGLI, BALOO, BAGHEERA],
    steps: [
      {
        id: 'a24-12-s1',
        goal: 'Walk down the dry river with Mowgli and Baloo.',
        hint: 'Follow the riverbed down. The only water left is at the Peace Rock.',
        check: 'walk:a24-waingunga:drought',
        scene: {
          id: 'a24-12-dry',
          lines: [
            N('A year comes when the rains don’t. The jungle goes brown, then grey, then crackles underfoot like paper.'),
            N('The streams dry up one after another. Then even the Waingunga shrinks to a trickle between hot white stones.'),
            BL('Fifty years I’ve lived in these hills, and I’ve never seen it this bad. Look at me, cub. I’m half the bear I was.', 'sad'),
            MG('You’re still bigger than me. Look at my ribs. I can count them.'),
            BL('Count them later. Down there, the Peace Rock. There’s still water round it, and while there is, there’s a truce.'),
            N('In the middle of the river a long blue rock stands up out of the water. You can see it now that the water has dropped.'),
            N('Hathi the wild elephant stands beside it with his three sons. When he saw the rock, he called the Water Truce.'),
          ],
          choices: [
            {
              id: 'carry',
              label: 'Carry your Nubbin over the hot stones.',
              then: [N('The stones burn through your boots. Your Nubbin rides in your arms, panting, and you both feel the cool coming off the pool.')],
            },
            {
              id: 'baloo',
              label: 'Walk beside Baloo, who is going slowly.',
              then: [BL('Thank you. Don’t make a fuss of it. A bear has his pride, even when it’s thin.', 'soft')],
            },
          ],
        },
        done: {
          id: 'a24-12-dry-done',
          lines: [
            N('At the Peace Rock the whole jungle has come to drink. Deer stand beside wolves, and pigs beside panthers.'),
            N('Nobody hunts while the Truce holds. Nobody even looks at anybody else that way.'),
          ],
        },
      },
      {
        id: 'a24-12-s2',
        goal: 'Sit by the pool while Hathi tells the old story.',
        hint: 'Sit on the bank near Hathi. When the old elephant talks, the jungle listens.',
        check: 'sit:a24-peace-rock:pool',
        scene: {
          id: 'a24-12-tale',
          lines: [
            HA('You young ones always ask why we keep the Truce. Listen, then. This is how fear came.', 'think'),
            HA('In the beginning, nobody in the jungle was afraid of anybody. We ate grass and leaves, all of us, even the tigers.'),
            HA('The First of the Elephants made the jungle, and he chose a judge to keep the peace: the First Tiger, who was very fair.'),
            HA('One day two bucks fought, and the First Tiger, judging them, struck out and killed one. He didn’t mean it.'),
            HA('That was the first death. And the jungle didn’t know what death was, and so it learned fear.'),
            HA('The First Tiger ran away into the marshes, and the reeds marked his coat with stripes. Tigers have worn them ever since.'),
            HA('So once a year, the tigers remember. And when the water is low, we all remember, and we drink together.'),
            N('Nobody says anything for a while. A deer drinks, and lifts its head, and drinks again.'),
            MG('Is that true, Hathi?', 'think'),
            HA('It’s old. That’s a different thing from true, and sometimes a better one.'),
          ],
          choices: [
            {
              id: 'thank',
              label: 'Thank Hathi for the story.',
              then: [HA('Thank me by keeping the Truce. It’s easy to keep when you’re full. It counts when you’re thirsty.')],
            },
            {
              id: 'quiet',
              label: 'Say nothing, and look at the water.',
              then: [N('You look at the water. It is very low, and very still, and everyone in the jungle is drinking from it.')],
            },
          ],
        },
        done: {
          id: 'a24-12-tale-done',
          lines: [
            BG('Good story. I’ve heard it a hundred times. It’s better when you’re thirsty.', 'think'),
            BL('Everything’s better when you’re thirsty. Except being thirsty.'),
          ],
        },
      },
      {
        id: 'a24-12-s3',
        goal: 'Let your Nubbin drink at the pool with everyone else.',
        hint: 'Set it down on the bank. It will find its own place.',
        check: 'watch:a24-nubbin:peace-rock',
        scene: {
          id: 'a24-12-drink',
          lines: [
            N('You set your Nubbin down on the bank. It looks at the water, and at all the animals, and at you.'),
            N('Then it walks down to the edge between two deer, and bends, and drinks.'),
            N('The deer beside it is a young one, a fawn with white spots. It looks at your Nubbin, and goes on drinking.'),
            N('They drink side by side, the fawn and your Nubbin, as if they had done it every evening of their lives.'),
            MG('There. The Truce. That’s what Baloo was teaching me, all those years. I thought it was just words.', 'soft'),
            BL('It is just words. Words that everyone keeps. That’s all a law is, cub.'),
          ],
          choices: [
            {
              id: 'watch',
              label: 'Watch them drink.',
              then: [N('You watch. It is one of the quietest things you have ever seen.')],
            },
            {
              id: 'join',
              label: 'Kneel and drink too.',
              then: [N('You kneel at the edge and cup the water in your hands. It tastes of stone, and of rain that hasn’t come yet.')],
            },
          ],
        },
        done: {
          id: 'a24-12-drink-done',
          lines: [
            N('That night, far off, there is a rumble of thunder from the hills. Everybody lifts their head at once.'),
            N('The first drops fall on the hot stones and hiss. Then the rain comes, and the Truce is over, and no one minds.'),
          ],
        },
      },
    ],
    complete: {
      id: 'a24-12-complete',
      lines: [
        N('The rain comes in sheets. The river comes back, brown and loud, and covers the Peace Rock by morning.'),
        N('The fawn and its mother are gone into the grass. Your Nubbin looks for them for a while, then gives up.'),
        HA('Good. Now everyone goes back to being afraid of each other. It’s the natural way. But we remember.', 'think'),
        N('Your Nubbin stands in the rain with its face up and its mouth open, drinking the sky.'),
      ],
    },
    rewards: [],
    sets: { 'a24-12': true },
    notes:
      'Hathi’s tale is told in our own words, shortened and softened (no tiger kills a man here; the First Tiger’s ' +
      'striking out is an accident). The stripes come from the reeds. The Peace Rock is a long blue rock in the river ' +
      'bed. Animals at the pool drink side by side: deer, wolves, pigs, a panther, a bear, elephants; nobody hunts. ' +
      'The rain at the end respects prefers-reduced-motion (a slow fade to rain-grey instead of flashing).',
  },

  // ---------------------------------------------------------------- A24-13
  {
    id: 'a24-13',
    code: 'A24-13',
    title: 'Letting in the Jungle',
    source: SJB('Letting in the Jungle'),
    audience: 'all',
    trigger: { where: WHERE, when: after('A24-12') },
    requires: ['A24-12'],
    speakers: [MOWGLI, MESSUA, HATHI, VILLAGER, BAGHEERA],
    steps: [
      {
        id: 'a24-13-s1',
        goal: 'Wait by Messua’s hut in the dark.',
        hint: 'Stay out of the torchlight. Mowgli will come when the village is asleep.',
        check: 'wait:a24-hut:night',
        scene: {
          id: 'a24-13-hut',
          lines: [
            N('Word comes through the jungle, from wolf to wolf: the village has tied up Messua and her husband in their own hut.'),
            N('Buldeo has told the village that they took in a sorcerer. Now the village means to punish them for it, in the morning.'),
            N('You wait with Mowgli in the trees above the village. Down below, torches move about, and men argue in loud voices.'),
            VI('A wolf-demon, under our own roofs. We could all have been eaten in our beds. They’ll answer for it.', 'angry'),
            N('When the village is asleep, Mowgli slides down out of the trees and in at the back of the hut.'),
            N('From the branches you watch the little window. Inside, a shadow bends over two other shadows, and works at the ropes.'),
            MG('Messua. It’s me. Hush. I’ve come to take you away.', 'soft'),
          ],
          choices: [
            {
              id: 'watch',
              label: 'Keep watch on the street.',
              then: [N('You keep your eyes on the street. One dog barks, once, and then thinks better of it.')],
            },
            {
              id: 'nubbin',
              label: 'Hold your Nubbin still on the branch.',
              then: [N('Your Nubbin is trembling with wanting to go down to Messua. You hold it, and it lets you.')],
            },
          ],
        },
        done: {
          id: 'a24-13-hut-done',
          lines: [
            N('The back door opens. Mowgli comes out with Messua on one arm and her husband on the other, both stiff from the ropes.'),
            ME('My son, my son. I knew you would come. I didn’t believe it, but I knew.', 'sad'),
          ],
        },
      },
      {
        id: 'a24-13-s2',
        goal: 'Go with Messua and her husband to the road.',
        hint: 'Keep to the dark under the trees. The wolves run alongside, out of sight.',
        check: 'escort:a24-messua:road',
        scene: {
          id: 'a24-13-road',
          lines: [
            N('Mowgli leads them through the dark, the long way round the fields. Grey Brother and the others run unseen beside the path.'),
            MG('There’s a town that way, a long day’s walk. Nobody there knows you, and the law there will keep you safe. Go.', 'think'),
            ME('Come with us. Please. Come and be my son in a place where nobody throws stones.', 'sad'),
            MG('I can’t. Not yet. But I’ll know where you are. The jungle tells me things.'),
            MG('Guest. Go up to the hill where Hathi feeds, and give him my word. Say: the fields. He’ll know.'),
            N('You run up into the dark with your Nubbin, while Mowgli walks Messua to the road.'),
            N('Hathi is where Mowgli said, pulling down branches. He hears the message, and stands very still, with his ears out.'),
            HA('The fields. Yes. I remember those fields, and what was done there to my legs, long ago. Tell him yes.', 'think'),
          ],
          choices: [
            {
              id: 'ask',
              label: 'Ask Hathi what he will do.',
              then: [HA('Nothing quick. Nothing cruel. We will only let the jungle in. It was there first.')],
            },
            {
              id: 'nod',
              label: 'Bow to Hathi, and go back down.',
              then: [N('Hathi lifts his trunk to you, very slowly, the way you would raise a hat.')],
            },
          ],
        },
        done: {
          id: 'a24-13-road-done',
          lines: [
            N('When you get back, Messua and her husband are only two small shapes on the road, walking away into the grey of dawn.'),
            N('She turns once, at the bend, and lifts her hand. You lift yours.'),
          ],
        },
      },
      {
        id: 'a24-13-s3',
        goal: 'Watch the jungle come into the village.',
        hint: 'Climb to the ridge and watch. It takes a whole season, and nobody is hurt.',
        check: 'watch:a24-village:overgrown',
        scene: {
          id: 'a24-13-jungle',
          lines: [
            N('It isn’t one night. It takes the whole of the rains.'),
            N('Hathi and his three sons walk through the fields at night and trample them flat. The deer and the pigs eat what is left.'),
            N('The wild things come closer every evening, and the cattle are frightened. The well goes green.'),
            N('The creepers climb the walls, and the roofs fall in under the rain. Trees push up through the floors.'),
            N('In the end the villagers pack their carts, and go down the valley to their relations, and don’t come back.'),
            N('Nobody is hurt, and nobody is killed. The jungle simply comes in, slowly, the way it does when people stop holding it out.'),
            BG('It was a hard thing to do, little brother. Harder than the tiger.', 'think'),
            MG('They threw stones at Messua. They were going to hurt her. And now there’s no village to hurt anyone in.', 'angry'),
          ],
          choices: [
            {
              id: 'sad',
              label: 'Tell him it’s sad all the same.',
              then: [MG('It is. I know. I don’t feel like I thought I would.', 'sad')],
            },
            {
              id: 'quiet',
              label: 'Say nothing, and look at the green roofs.',
              then: [N('You look at the place where the village was. A peacock is standing on what used to be the well.')],
            },
          ],
        },
        done: {
          id: 'a24-13-jungle-done',
          lines: [
            N('By the next dry season you can hardly tell a village was ever there. Just humps under the creepers, and one stone platform.'),
            N('A fig tree grows out of the platform now. The same tree Buldeo told his stories under.'),
          ],
        },
      },
    ],
    complete: {
      id: 'a24-13-complete',
      lines: [
        N('You sit on the ridge with Mowgli, looking down at the green humps where the houses were.'),
        MG('Messua got to the town. Chil saw her there, in a house with a blue door. She has a garden.', 'soft'),
        N('Your Nubbin is asleep against your side, with its paws twitching. In its dream, you think, it is running with wolves.'),
      ],
    },
    rewards: [],
    sets: { 'a24-13': true },
    notes:
      'STONES PAYOFF (a24-stones, three quests after A24-10). The scenes shown are for mowgli: you watch from the trees ' +
      'as Mowgli unties Messua, and carry word to Hathi. With messua, play ATLAS_A24_VARIANTS a24-13-hut-messua in ' +
      'place of a24-13-hut and a24-13-hut-done-messua in place of a24-13-hut-done (you are in the hut when the villagers ' +
      'come, and loosen the ropes before Mowgli arrives), and a24-13-road-messua in place of a24-13-road (you walk ' +
      'Messua and her husband to the road yourself; Mowgli carries word to Hathi). ' +
      'CARE: Messua is sent to a town where the law will keep her safe (a24-13-road#1), not to "the English" (care ' +
      'note); advisers to confirm the wording. Nobody is hurt; the ' +
      'villagers leave with their carts. Hathi’s fields memory (he was once caught in a pit there) is mentioned, not shown.',
  },

  // ---------------------------------------------------------------- A24-14
  {
    id: 'a24-14',
    code: 'A24-14',
    title: 'Red Dog',
    source: SJB('Red Dog'),
    audience: 'all',
    trigger: { where: WHERE, when: after('A24-13') },
    requires: ['A24-13'],
    speakers: [MOWGLI, KAA, AKELA, GREYBROTHER],
    steps: [
      {
        id: 'a24-14-s1',
        goal: 'Go with Mowgli to Kaa, to make a plan against the red dogs.',
        hint: 'Kaa is lying on the river bank. He thinks slowly, and then he’s right.',
        check: 'talk:a24-kaa:river',
        scene: {
          id: 'a24-14-plan',
          lines: [
            N('A lone wolf comes into the Seeonee hills at dusk, limping on one foreleg, with bad news.'),
            GB('He’s come from the south. The red dogs are coming, he says: the dhole, up the river, two hundred of them. Maybe more.', 'shock'),
            GB('They don’t stop. They don’t sleep. They eat everything in front of them, and wolves run from them.'),
            MG('The Free People don’t run. Not from anyone. Kaa will know what to do. Kaa always knows.', 'angry'),
            N('Kaa lies along the bank of the Waingunga, very old now, and very wise, and very large.'),
            KA('Dhole. Hmm. They run in a pack, and they don’t think. That’s their strength. It’s also their weakness.', 'think'),
            KA('I’ll show you a place. The Bee Rocks, the gorge where the Little People live. Millions of wild bees, in the cliffs.'),
            KA('Lead the dogs past the Bee Rocks, and into the river. The river does the rest. And your wolves wait downstream.'),
          ],
          choices: [
            {
              id: 'clever',
              label: 'Tell Kaa that’s very clever.',
              then: [KA('Of course it is. I’m old. Being old is mostly being clever, and stiff in the mornings.', 'happy')],
            },
            {
              id: 'bees',
              label: 'Ask what the bees will do.',
              then: [KA('What bees always do, when somebody runs through their house. Nothing gentle. But nothing they can’t outrun.')],
            },
          ],
        },
        done: {
          id: 'a24-14-plan-done',
          lines: [
            MG('I’ll lead them. I’m faster than any wolf through the trees. I’ll jump into the river at the bottom of the gorge.'),
            KA('And I’ll be waiting in the water, to pull you out. Don’t make me wait long. I get bored.'),
          ],
        },
      },
      {
        id: 'a24-14-s2',
        goal: 'Watch the red dogs come up the river from the bank.',
        hint: 'Stay on the high bank with your Nubbin. You’re here to watch and to wait.',
        check: 'watch:a24-bee-rocks:river',
        scene: {
          id: 'a24-14-river',
          lines: [
            N('You stand on the high bank of the river, downstream of the gorge, with the wolves of the Seeonee pack.'),
            N('Far up the gorge there is a sound like the whole world humming. Then a roar of barking, and a long brown rush.'),
            N('The red dogs pour down the gorge after Mowgli, and the bees pour out of the cliffs after the red dogs.'),
            N('Mowgli comes off the cliff edge in a long jump, straight into the river. A great brown coil rises under him: Kaa.'),
            N('The dogs come after him into the deep water, howling. The current takes them down, fast, straight to the waiting wolves.'),
            N('Then it is all noise and spray. You can’t see anything but white water, and grey backs, and red ones.'),
            AK('Stay back, guest. Keep the little one back. This is the pack’s fight, and it’s the last one I’ll fight.', 'think'),
          ],
          choices: [
            {
              id: 'hold',
              label: 'Hold your Nubbin close and keep watching.',
              then: [N('Your Nubbin trembles but keeps watching too. Neither of you looks away.')],
            },
            {
              id: 'cover',
              label: 'Turn your Nubbin away from the river.',
              then: [N('You turn it to face the trees. It lets you, and leans into your knees, and you watch for both of you.')],
            },
          ],
        },
        done: {
          id: 'a24-14-river-done',
          lines: [
            N('It goes on a long time. Then the noise of the river is only the river again, and the red dogs are gone.'),
            N('Some ran, and some went down with the water. The pack holds the river, and it is morning.'),
          ],
        },
      },
      {
        id: 'a24-14-s3',
        goal: 'Sit with Akela and Mowgli on the river bank.',
        hint: 'Go down to the bank. Sit beside them. You don’t need to say anything.',
        check: 'sit:a24-akela:bank',
        scene: {
          id: 'a24-14-akela',
          lines: [
            N('Akela lies very still on the shingle, with Mowgli kneeling beside him. He is not hurt; he is only very, very old.'),
            AK('It was a good fight. I always wanted the last one to be a good one. And it was.', 'soft'),
            MG('Don’t talk. Rest. You can rest now.', 'sad'),
            AK('I’ve been resting all my life, between hunts. This is different. Little brother, lift me. Let me see the hills.', 'soft'),
            N('Mowgli lifts the old grey head onto his knee, so that Akela can see the Seeonee hills in the morning light.'),
            AK('I said I’d look after you. A long time ago, at the Council Rock. Have I kept my word?', 'think'),
            MG('Always. Every time.', 'sad'),
            AK('Good. Then go to your own people, when it’s time. Not yet. But when it’s time. Promise me.', 'soft'),
            N('Mowgli promises, and Akela closes his eyes. His breath goes out, long and slow, and doesn’t come back.'),
          ],
          choices: [
            {
              id: 'sit',
              label: 'Sit down beside them, and wait.',
              then: [N('You sit on the shingle beside them, and nobody says anything for a long time. That is the right thing to say.')],
            },
            {
              id: 'hand',
              label: 'Put your hand on Mowgli’s back.',
              then: [N('He doesn’t look round. But he leans back against your hand a little, and stays there.')],
            },
          ],
        },
        done: {
          id: 'a24-14-akela-done',
          lines: [
            N('Your Nubbin creeps up and lies down against Akela’s grey side, the way it used to lie with the cubs in the cave.'),
            N('It stays there until the sun is high. Nobody moves it.'),
          ],
        },
      },
    ],
    complete: {
      id: 'a24-14-complete',
      lines: [
        N('That evening the pack howls for Akela from the Council Rock. Mowgli howls with them, and so do you.'),
        N('Your Nubbin howls too. For once it doesn’t sound like a kettle; it sounds like a wolf.'),
        GB('He waited all those years. For you to need him. And then he got to be needed.', 'sad'),
        MG('He was the best of us. He was the Lone Wolf. He led us for a hundred years.'),
        GB('Not a hundred, little brother.', 'soft'),
        MG('It felt like a hundred.', 'sad'),
      ],
    },
    rewards: [],
    sets: { 'a24-14': true },
    notes:
      'SOFTENED FOR ALL (care note): the battle is told from the bank, in noise and spray, with no wounds and no bodies; ' +
      'the bees chase and are outrun. AKELA’S DEATH is gentle, like Fossil’s farewell in chapter 6: he is not wounded, ' +
      'only very old; his breath goes out and doesn’t come back; the screen holds on the three of them in morning light. ' +
      'The third rule is acted out (sit beside them and wait) and never quoted. No music cue telling the player what ' +
      'to feel. The lone wolf with the news (Won-tolla in Kipling) is unnamed and has no lines.',
  },

  // ---------------------------------------------------------------- A24-15
  {
    id: 'a24-15',
    code: 'A24-15',
    title: 'The Spring Running',
    source: SJB('The Spring Running'),
    audience: 'all',
    trigger: { where: WHERE, when: after('A24-14') },
    requires: ['A24-14'],
    speakers: [MOWGLI, BAGHEERA, GREYBROTHER, MESSUA],
    steps: [
      {
        id: 'a24-15-s1',
        goal: 'Find Mowgli, who has been unhappy all day.',
        hint: 'He’s by the river, throwing stones in. Nobody else has time for him; it’s spring.',
        check: 'watch:a24-spring:jungle',
        scene: {
          id: 'a24-15-spring',
          lines: [
            N('Mowgli is nearly seventeen. He is tall and strong, and he is the Master of the Jungle, and everyone knows it.'),
            N('Then spring comes, and all the jungle is busy with it, singing, nesting, running. Nobody has time for him.'),
            MG('I call and nobody comes. Even Bagheera’s gone off somewhere. I feel sick. Not hungry sick. Just… sick.', 'sad'),
            BG('It’s the spring, little brother. It does this. I’ll be back in a few days. I don’t know why. I just will.', 'think'),
            N('He’s gone. Mowgli throws a stone into the river, and another, and another.'),
            MG('I’ve eaten good food. I’ve drunk good water. Why do I feel like this, guest? What’s wrong with me?', 'sad'),
          ],
          choices: [
            {
              id: 'dunno',
              label: 'Tell him you don’t know. But it happens to people.',
              then: [MG('People. Not wolves. That’s the answer, isn’t it? That’s always the answer.', 'sad')],
            },
            {
              id: 'sit',
              label: 'Sit next to him and throw stones too.',
              then: [N('You throw stones with him, and your Nubbin throws one backwards over its own head. Mowgli almost laughs.')],
            },
          ],
        },
        done: {
          id: 'a24-15-spring-done',
          lines: [
            MG('I’m going to run. All night, as far as I can. Maybe it’ll go away if I run.', 'angry'),
            GB('I’ll come with you, little brother. Somebody has to.', 'soft'),
          ],
        },
      },
      {
        id: 'a24-15-s2',
        goal: 'Run north through the night with Mowgli and Grey Brother.',
        hint: 'Keep up as best you can. Watch for a light ahead.',
        check: 'walk:a24-north:night',
        scene: {
          id: 'a24-15-lamp',
          lines: [
            N('You run all night, north, through jungle you’ve never seen, with Mowgli out in front and Grey Brother at your heel.'),
            N('Your Nubbin rides on Grey Brother’s back for the last part, holding on with both paws.'),
            N('Near dawn there is a light ahead, low down: a lamp in the window of a little hut at the edge of some fields.'),
            N('A woman comes to the door holding the lamp, with a little grey in her hair now. It is Messua.'),
            ME('Who’s there? Who is it? There’s nothing to steal here. Only me, and my baby.', 'shock'),
            MG('It’s me. Messua. It’s me.', 'soft'),
            ME('Nathoo? No. Mowgli. Oh, my son, my son, how tall you are. Come in, come in, you’re half starved.', 'happy'),
          ],
          choices: [
            {
              id: 'follow',
              label: 'Follow Mowgli in.',
              then: [N('You follow him in. The hut smells of smoke and milk and baby.')],
            },
            {
              id: 'wait',
              label: 'Stay in the doorway and let them have this.',
              then: [N('You stay in the doorway. Grey Brother lies down at your feet, and puts his chin on your boot.')],
            },
          ],
        },
        done: {
          id: 'a24-15-lamp-done',
          lines: [
            N('Messua gives Mowgli milk and bread. Her husband died last year; she says it plainly, and doesn’t cry.'),
            N('On a mat in the corner a baby sleeps, fat and brown, with one fist in the air.'),
          ],
        },
      },
    ],
    complete: {
      id: 'a24-15-complete',
      lines: [
        N('Mowgli eats everything Messua gives him, and then, without meaning to, he falls asleep on her floor.'),
        N('She covers him with a blanket. She sits on a stool beside him all morning, mending, and doesn’t wake him.'),
        N('Grey Brother lies outside the door, and your Nubbin lies down with him. You sit on the step in the sun.'),
      ],
    },
    rewards: [],
    sets: { 'a24-15': true },
    notes:
      'STONES PAYOFF (a24-stones). The scene shown in step 2’s done is the shared part; after it, for mowgli, play ' +
      'ATLAS_A24_VARIANTS a24-15-lamp-mowgli (Messua doesn’t know you; you were never in her hut long); for messua, ' +
      'a24-15-lamp-messua (she knows you at once, and puts the baby in your arms while she feeds Mowgli). Both ' +
      'variants play between a24-15-lamp-done and a24-15-complete. ' +
      'The new village is a different, kinder place; Messua’s husband is spoken of, not shown. The hut, Messua’s dress ' +
      'and the baby are drawn with Indian advisers.',
  },

  // ---------------------------------------------------------------- A24-16
  {
    id: 'a24-16',
    code: 'A24-16',
    title: 'Man Goes to Man',
    source: SJB('The Spring Running'),
    audience: 'all',
    trigger: { where: WHERE, when: after('A24-15') },
    requires: ['A24-15'],
    speakers: [MOWGLI, BALOO, KAA, BAGHEERA, GREYBROTHER, MESSUA],
    steps: [
      {
        id: 'a24-16-s1',
        goal: 'Go back with Mowgli to the Council Rock.',
        hint: 'Baloo and Kaa are waiting. They know already.',
        check: 'visit:a24-council-rock:dawn',
        scene: {
          id: 'a24-16-rock',
          lines: [
            N('You come back to the Council Rock in the grey before dawn. Baloo is there, very old now and almost blind.'),
            N('Kaa is coiled round the rock, three times, the way he lies when he means to stay a while.'),
            BL('Cub. You’ve come to tell us something. Don’t bother. We know. We’ve known since spring.', 'soft'),
            MG('I don’t want to go. But I want to go. Both. I don’t understand it.', 'sad'),
            KA('Changing your skin. I do it every year, and it never gets easier. It itches, and then it fits.', 'think'),
            KA(LIFT_MAN),
            BL('Make your own trail, cub. Make your own lair. Find your own people. We’ll still be here. In a way.', 'soft'),
          ],
          choices: [
            {
              id: 'baloo',
              label: 'Go and sit by Baloo.',
              then: [BL('Is that the guest? Your voice has changed. You used to say the Words like a frightened bird.', 'happy')],
            },
            {
              id: 'kaa',
              label: 'Thank Kaa for the Cold Lairs.',
              then: [KA('It was nothing. A dance. A wall. I enjoyed the wall.', 'happy')],
            },
          ],
        },
        done: {
          id: 'a24-16-rock-done',
          lines: [
            MG('Where’s Bagheera? I can’t go without Bagheera.', 'sad'),
            N('Far off down the hill, something heavy is crashing through the bushes. Then it stops.'),
          ],
        },
      },
      {
        id: 'a24-16-s2',
        goal: 'Wait at the Council Rock for Bagheera.',
        hint: 'He’ll come. Panthers are always last, and always on purpose.',
        check: 'wait:a24-bagheera:council-rock',
        scene: {
          id: 'a24-16-bagheera',
          lines: [
            N('Bagheera comes up the hill at a trot, breathing hard, with the morning sun on his black coat.'),
            BG('I’ve killed a bull. Down in the valley. Young and fat. I paid for you with a bull, cub, at the beginning.', 'think'),
            BG('Now I’ve paid it again. The debt’s all square. So you go free. Owing nobody. That’s how it should be.'),
            MG('Bagheera. I’ll come back. I’ll come and see you.', 'sad'),
            BG('Don’t. Don’t come back for us. Come back for you, if you ever need to. We’ll know.', 'soft'),
            N('He licks Mowgli’s feet, once, the way the panthers do it. Then he turns away down the hill.'),
            N('At the bottom he looks back.'),
            BG(LIFT_TRAIL, 'soft'),
            N('And he’s gone into the trees. Mowgli stands with his hands open, the way you do when you’ve dropped something.'),
            MG('Guest. You came at the start. You were in the cave, the first night. Say the Words with me. One more time.', 'sad'),
            N('So you say them, the two of you, standing on the Council Rock in the early sun.'),
            Y(LIFT_BLOOD),
          ],
        },
        done: {
          id: 'a24-16-bagheera-done',
          lines: [
            N('Mowgli looks at you for a long time. Then he puts his hand on your Nubbin’s head.'),
            MG('Will you walk the first mile with me? Just the first. Then you go home, and I go on.', 'soft'),
          ],
        },
      },
      {
        id: 'a24-16-s3',
        goal: 'Do what Mowgli asked of you.',
        hint: 'He asked you one thing. Do that.',
        check: 'walk:a24-trail:north',
        scene: {
          id: 'a24-16-trail',
          lines: [
            N('You walk the first mile with Mowgli, down off the hills, north, towards the villages where men live.'),
            N('Grey Brother and the three other wolves run beside you, very quiet, ears down. They’re going with him.'),
            GB('The jungle isn’t shut. We’ll be his four brothers, wherever he lives. There’s no law that says we can’t.', 'happy'),
            N('Your Nubbin trots in the middle of the four wolves, as if it were going too. It has never doubted it’s a wolf.'),
            MG('Here. This is the mile. The stone with the moss on.', 'soft'),
            N('You stop at the mossy stone. Mowgli doesn’t make a speech; he just looks at you, and at your Nubbin, and nods.'),
          ],
          choices: [
            {
              id: 'hunting',
              label: 'Tell him: good hunting.',
              then: [MG('Good hunting, guest. Good hunting, little wolf.', 'happy')],
            },
            {
              id: 'hug',
              label: 'Hug him.',
              then: [N('He doesn’t know what to do with a hug, so he does it the wolf way, and pushes his head against your shoulder.')],
            },
          ],
        },
        done: {
          id: 'a24-16-trail-done',
          lines: [
            N('He walks on up the trail with the four wolves round him, and doesn’t look back. That’s how you know he’ll be all right.'),
            N('Your Nubbin watches them go until they’re dots. Then it sits down on the mossy stone, and you sit with it.'),
          ],
        },
      },
    ],
    complete: {
      id: 'a24-16-complete',
      lines: [
        N('The last thing you see is the trail going north in the sun, and four grey shapes and a boy going up it.'),
        ...A16_LEAVE,
        N('The page goes soft at the edges, like a cave mouth at dusk. Then it is your own kitchen, and the atlas open on the table.'),
        N('Tucked into the back of the page is a plank, carved by somebody with a knife and a lot of patience.'),
      ],
    },
    rewards: [
      {
        id: 'a24-one-blood-plank',
        kind: 'decor',
        label: 'The One Blood Plank',
        description:
          'A plank for the gate, carved with the Master Words of the jungle. Anyone who reads it is welcome, whoever they are.',
      },
    ],
    sets: { 'a24-16': true },
    childLines: {
      'a24-16-rock#5': 'People belong with people in the end. But the jungle will always be your home too.',
      'a24-16-bagheera#7': 'Good luck on your new road. Never forget that Bagheera loved you.',
      'a24-16-bagheera#11': CHILD_BLOOD,
    },
    notes:
      'STONES PAYOFF (a24-stones). The scenes shown are for mowgli: Mowgli asks you to walk the first mile with him; the ' +
      'last image is the trail north with four wolves. With messua, play ATLAS_A24_VARIANTS a24-16-bagheera-done-messua ' +
      'in place of a24-16-bagheera-done (he asks you to look in on Messua), a24-16-trail-messua and ' +
      'a24-16-trail-done-messua in place of a24-16-trail and a24-16-trail-done (you go to the lit hut), and ' +
      'a24-16-complete-messua in place of a24-16-complete (the last image: the lit hut, with the baby asleep). ' +
      'Mowgli goes to men on both paths, as Kipling wrote it. ' +
      'The One Blood Plank carries the Master Words as a carving (LIFT_BLOOD); in the Learning Grove it shows a paw print ' +
      'and a hand print instead of words. It hangs on the Grove gate as decor only; it doesn’t change the gate.',
  },

  // ---------------------------------------------------------------- A24-17 (coda)
  {
    id: 'a24-17',
    code: 'A24-17',
    title: 'The White Seal',
    source: JB('The White Seal'),
    audience: 'all',
    trigger: { where: WHERE, when: after('A24-16') },
    requires: ['A24-16'],
    speakers: [SEACATCH, MATKAH, KOTICK, SEAL],
    steps: [
      {
        id: 'a24-17-s1',
        goal: 'Turn the page, and step onto the seals’ beach in the north.',
        hint: 'Keep to the rocks at the top of the beach. The bulls are busy, and very large.',
        check: 'explore:a24-novastoshnah:beach',
        scene: {
          id: 'a24-17-beach',
          lines: [
            N('The jungle page has a last leaf folded into it. You open it, and the air goes cold and smells of salt and fish.'),
            N('These are the Pribilof Islands in the Bering Sea. Unangax̂ families were brought here long ago to work the seal harvest, and made the islands home.'),
            N('Below you is a beach called Novastoshnah, roaring from end to end with seals: thousands and thousands of them.'),
            N('The big bulls are shoving each other for places on the rocks, chest to chest, bellowing. Nobody gets hurt; everybody gets loud.'),
            SC('Out of my place! Out! I was here last year, and the year before! This is my rock, and I’m keeping it!', 'angry'),
            N('A big grey bull with a scarred neck wins his rock, and flops down on it, very pleased with himself. That’s Sea Catch.'),
            MK('You’re late. You’re always late. And you’ve been fighting again. Look at your neck.', 'think'),
            N('That’s Matkah, his wife: smaller, soft-eyed, sensible. Beside her, in the shelter of the rock, is something new.'),
            MK(LIFT_WHITE, 'shock'),
            SC('Nonsense. There’s never been such a thing as a white seal.', 'think'),
            MK('I can’t help that. There’s going to be one now.'),
          ],
          choices: [
            {
              id: 'look',
              label: 'Creep closer to look at the pup.',
              then: [N('He is pale as sea-foam, all over, with soft blue eyes. Everyone else on the beach is dark grey.')],
            },
            {
              id: 'nubbin',
              label: 'Keep your Nubbin back from the shoving bulls.',
              then: [N('A bull the size of a wardrobe flops past. Your Nubbin hides behind your legs and peeks round them.')],
            },
          ],
        },
        done: {
          id: 'a24-17-beach-done',
          lines: [
            N('They name the pup Kotick. He crawls up to your Nubbin, nose to nose, and they look at each other for a long while.'),
            N('Then your Nubbin, who believes it is a wolf, decides on the spot that it is a seal as well.'),
          ],
        },
      },
      {
        id: 'a24-17-s2',
        goal: 'Paddle in the surf while Kotick learns to swim.',
        hint: 'Stay in the shallows. The big waves are for seals, not for guests.',
        check: 'swim:a24-surf:novastoshnah',
        scene: {
          id: 'a24-17-surf',
          lines: [
            N('Seal pups can’t swim when they’re born. They have to learn, and it’s a struggle, and Kotick is no different.'),
            MK('In you go. The waves will lift you. Don’t fight them. Ride them. That’s all swimming is.', 'happy'),
            N('Kotick goes in, and a wave picks him up and puts him back on the beach upside down. He tries again.'),
            N('You wade in up to your knees with your Nubbin in your arms. The water is so cold it makes your teeth ache.'),
            N('Your Nubbin wriggles out of your arms and paddles beside Kotick, doggedly, the way it does everything.'),
            KO('I did it! I’m swimming! Look, Mother! Look at the little round one, it’s swimming too!', 'happy'),
            N('By autumn Kotick swims like a seal born to it, which he is. Then the whole herd turns south, out to the open sea.'),
            N('When they come back the next summer, Kotick is a year older, and still as white as foam.'),
          ],
          choices: [
            {
              id: 'cheer',
              label: 'Cheer for Kotick from the shallows.',
              then: [N('Kotick does a roll in the water, showing off, and swallows a mouthful of sea. He comes up spluttering and pleased.')],
            },
            {
              id: 'warm',
              label: 'Wrap your Nubbin in your coat after.',
              then: [N('It shivers inside your coat for a while, and then falls asleep, smelling strongly of seaweed.')],
            },
          ],
        },
        done: {
          id: 'a24-17-surf-done',
          lines: [
            KO('There are the young ones going inland. The bachelors. Where do they go? I’m going to see.', 'think'),
            N('You follow him up the beach. You wish, already, that you hadn’t.'),
          ],
        },
      },
      {
        id: 'a24-17-s3',
        goal: 'Follow Kotick inland, and turn back with him.',
        hint: 'Stay with Kotick. When he turns away, turn with him.',
        check: 'watch:a24-drove:inland',
        scene: {
          id: 'a24-17-drove',
          lines: [
            N('Men from the village are walking a herd of young seals slowly inland, away from the sea, with long sticks.'),
            N('The men work quietly, at a job they were made to do for a company far away that owns it.'),
            N('Kotick follows at the back, curious. Then he understands what happens to the young seals at the end of the walk.'),
            N('He turns away. You turn with him, and put your hand over your Nubbin’s eyes, and the page turns too.'),
            KO('They don’t come back. None of them come back. Every summer. Mother, every summer?', 'shock'),
            MK('Every summer. It’s been so since before your grandfather’s grandfather. There’s nothing to be done.', 'sad'),
            KO('Then I’ll find somewhere else. A beach where men can’t come. There must be one, somewhere in the sea.', 'angry'),
            SE('Find a beach where men can’t come? Listen to the white one. Go and catch the moon while you’re at it.', 'happy'),
          ],
          choices: [
            {
              id: 'believe',
              label: 'Tell Kotick you believe him.',
              then: [KO('Do you? You’re the first. Well, second. Your little round one looked like it did.', 'soft')],
            },
            {
              id: 'sit',
              label: 'Sit down next to him on the cold beach, and wait.',
              then: [N('You sit beside him. After a while he stops shaking, and looks out at the sea instead of inland.')],
            },
          ],
        },
        done: {
          id: 'a24-17-drove-done',
          lines: [
            KO('I’m going to look. Every summer, every winter, until I find it. And then I’ll bring them all.', 'angry'),
            N('Your Nubbin sits up beside him on the beach and looks out to sea too, as if it means to help.'),
          ],
        },
      },
    ],
    complete: {
      id: 'a24-17-complete',
      lines: [
        N('That night Kotick swims out past the end of the beach and keeps going, a white speck in the dark water.'),
        MK('He won’t find it. There isn’t one. But he’s white, and different, and he won’t be told.', 'sad'),
        SC('He gets that from me.'),
        MK('He gets it from both of us. Go to sleep.', 'soft'),
      ],
    },
    rewards: [],
    sets: { 'a24-17': true },
    childLines: {
      'a24-17-beach#8': 'Oh, look! Our baby is white! White as sea-foam!',
    },
    notes:
      'CARE (Unangax̂ seal hunters): a24-17-beach#1 says whose islands these are; a24-17-drove#0–3 shows the men as ' +
      'workers made to do the job by a distant company, never as villains, unnamed (Kipling’s names are not used), seen ' +
      'from the seals’ side and only at a distance, walking the herd. The scene cuts away (the page turns) before the ' +
      'killing grounds; nothing is shown or described. Ask an Unangax̂ adviser to check this quest before ship, ' +
      'including the islands line and the men’s design and dress. The bulls’ fights are shoving and bellowing only. ' +
      'HAZEL’S MARGIN NOTE (s24Done, read-only): if s24Done is set when a24-17-complete ends, play ATLAS_A24_VARIANTS ' +
      'a24-17-margin-hazel straight after it; if S24 finishes later, play it the first time the atlas is next opened at ' +
      'this page. It plays once. From then on the note is drawn in pencil beside Kotick.',
  },

  // ---------------------------------------------------------------- A24-18 (coda)
  {
    id: 'a24-18',
    code: 'A24-18',
    title: 'Where No Man Comes',
    source: JB('The White Seal'),
    audience: 'all',
    trigger: { where: WHERE, when: after('A24-17') },
    requires: ['A24-17'],
    speakers: [KOTICK, SEALION, SEAVITCH, GULL, SEACATCH, MATKAH, SEAL],
    steps: [
      {
        id: 'a24-18-s1',
        goal: 'Search the northern sea with Kotick for a safe beach.',
        hint: 'Ask everyone. The old sea lion first. Mind the walrus; he’s grumpy.',
        check: 'swim:a24-search:islands',
        scene: {
          id: 'a24-18-search',
          lines: [
            N('Kotick searches for five seasons. The page carries you along with him, from island to island, through fog and ice.'),
            KO('Old sea lion! You know everything. Is there a beach in the sea where men never come?', 'think'),
            SL('Never heard of one. Men come everywhere, sooner or later. Ask Sea Vitch. He’s older than me, and ruder.'),
            N('Sea Vitch the walrus is asleep on a rock, enormous, whiskery, with tusks like two old yellow candles.'),
            SV('What? Who? Go away. I was asleep. I’m always asleep. What kind of a seal is white, anyway? Shoo.', 'angry'),
            KO('You fat old clam-cracker! I only asked you a question!', 'angry'),
            N('The gulls on the rocks above hear that, and love it. They have never liked Sea Vitch.'),
            GU('Clam-cracker! Clam-cracker! Sea Vitch is a clam-cracker! Clam-crack-crack!', 'happy'),
            SV('Hrrmph. Ask the Sea Cows, then, and leave me in peace. If they’re still alive. Nobody’s seen them for years.'),
          ],
          choices: [
            {
              id: 'sorry',
              label: 'Apologise to Sea Vitch for the noise.',
              then: [SV('Hm. Manners. From a land-thing. The world is full of surprises. Still go away.', 'think')],
            },
            {
              id: 'gulls',
              label: 'Shoo the gulls away.',
              then: [N('The gulls rise up shrieking, and settle again two feet away, and start again. Gulls are like that.')],
            },
          ],
        },
        done: {
          id: 'a24-18-search-done',
          lines: [
            KO('The Sea Cows. I’ve never even seen one. Nobody has. Everyone says they’re a story.', 'think'),
            N('Five summers and five winters go by. Kotick grows big and strong, and stays as white as the first day.'),
          ],
        },
      },
      {
        id: 'a24-18-s2',
        goal: 'Follow the Sea Cows through the dark water with Kotick.',
        hint: 'Stay close behind Kotick. The page lets you breathe; it’s that kind of page.',
        check: 'swim:a24-sea-cows:tunnel',
        scene: {
          id: 'a24-18-cows',
          lines: [
            N('At the end of the fifth winter, far to the west, Kotick finds them: huge, slow, dark shapes grazing on the kelp.'),
            N('Sea Cows. Bigger than walruses, quieter than fish, with small heads and soft lips, moving very slowly.'),
            KO('Hello? Excuse me? I’m looking for a beach. A safe one. Where men don’t come. Please.', 'think'),
            N('The Sea Cows say nothing; they can’t, or they won’t. They only chew the kelp, and look at him.'),
            N('Then, very slowly, they begin to move north, along the coast. Kotick follows, and you follow Kotick.'),
            N('At last they dive, and swim into a black opening in the cliff, deep under the water. A tunnel.'),
            N('You hold your breath and your Nubbin and go in after them. The atlas is a kind page here; your breath lasts.'),
            N('Then light ahead, green and gold. You come up into a quiet bay, with long smooth beaches all round it.'),
          ],
          choices: [
            {
              id: 'look',
              label: 'Look round the bay.',
              then: [N('There are beaches sheltered from the wind, with cliffs on every side and no paths down. Nobody has ever walked here.')],
            },
            {
              id: 'thank',
              label: 'Turn and thank the Sea Cows.',
              then: [N('They are already going, slow and silent, back into the dark of the tunnel. One of them looks back, once.')],
            },
          ],
        },
        done: {
          id: 'a24-18-cows-done',
          lines: [
            KO('This is it. This is it. Men can’t come here. Nobody can, unless they’re a seal, and swim under the cliffs.', 'happy'),
            N('Kotick hauls out on the beach and lies there, breathing, in the sun. Your Nubbin lies down beside him.'),
          ],
        },
      },
      {
        id: 'a24-18-s3',
        goal: 'Go home with Kotick, and watch him bring the seals.',
        hint: 'Stay at the top of the beach. This is shoving, not fighting, and nobody gets hurt.',
        check: 'watch:a24-fight:novastoshnah',
        scene: {
          id: 'a24-18-home',
          lines: [
            N('Kotick swims all the way home to Novastoshnah and tells the seals about the hidden beaches.'),
            N('They laugh at him, of course: a white seal, with his head full of stories.'),
            SE('Hidden beaches! Go and lie in the sun, white one, and stop bothering your elders.', 'happy'),
            N('So Kotick, who has grown big and strong in five years of searching, puts his chest against the biggest bull’s chest.'),
            N('And he shoves, and roars, and shoves again, all along the beach, until every bull who laughed has been pushed into the sea.'),
            SC('That’s my son! That’s my son! Come on, then, who’s next? Who else says there are no beaches?', 'happy'),
            N('Sea Catch joins in, shoving with his scarred old neck and shouting for joy. Nobody bleeds, but everybody is very wet.'),
            KO('I’m going to the new beaches! Who’s coming with me?', 'angry'),
          ],
          choices: [
            {
              id: 'cheer',
              label: 'Cheer from the top of the beach.',
              then: [N('Your Nubbin cheers too, like a kettle: a wolf kettle, or a seal kettle. It doesn’t mind which.')],
            },
            {
              id: 'matkah',
              label: 'Look for Matkah.',
              then: [MK('He was always going to do it. I told his father so. His father didn’t believe me either.', 'happy')],
            },
          ],
        },
        done: {
          id: 'a24-18-home-done',
          lines: [
            N('The seals stop laughing. They look at the white seal, and they look at each other.'),
            N('And then, a few at a time, then more, then nearly ten thousand, they follow him out to sea.'),
          ],
        },
      },
    ],
    complete: {
      id: 'a24-18-complete',
      lines: [
        N('You stand on the empty beach at Novastoshnah and watch the herd go, a long dark line with one white seal at the front.'),
        N('Every summer after, more of them go. The men who come to the beach find fewer seals, and then none.'),
        N('Your Nubbin watches until the white speck is gone. Then it turns round and looks at you, as if it has been somewhere.'),
        N('The page goes soft, like sea-fog. You are back at your own kitchen table, with the atlas open at the end of the book.'),
        N('There is a small white seal sitting by the pond outside, flopping, looking pleased with itself. It seems to know the way.'),
        N('Kotick took them to the hidden beaches, and the seals live there still, safe, ' + LIFT_SEA),
      ],
    },
    rewards: [
      {
        id: 'a24-white-seal',
        kind: 'item',
        label: 'White Seal Petpet',
        description:
          'A small white seal who flops around the Grove pond, sunbathes on the bank, and chases the ducks very slowly.',
      },
    ],
    sets: { 'a24-18': true, 'a24-done': true },
    childLines: {
      'a24-18-complete#5': 'Kotick took them to the hidden beaches, far across the sea, and the seals are safe there still.',
    },
    notes:
      'The Sea Cows are Steller’s sea cows: drawn huge, slow and gentle, with small heads; they never speak. (The ' +
      'Learning Grove version teaches that they died out in the 1700s because they were hunted; not said here.) The ' +
      'tunnel is short and calm, with light ahead the whole way; respect prefers-reduced-motion. Kotick’s fight is ' +
      'shoving and roaring only (care note): no wounds. LIFT_SEA closes a24-18-complete#5 as the last words of Kipling’s ' +
      'story, set at the end of our own sentence. The white seal petpet lives at the Grove pond; no timer, no feeding.',
  },
];

// =================================================================== variants

/**
 * Variant scenes chosen by flags. Each quest’s notes say which scene each replaces.
 *   s8Reunited (Grove, read-only): a24-02-council-done-fern.
 *   a24-stones (A24-10): a24-10-road-done-messua, a24-10-complete-messua, a24-13-hut-messua,
 *     a24-13-hut-done-messua, a24-13-road-messua, a24-13-road-done-messua, a24-15-lamp-mowgli,
 *     a24-15-lamp-messua, a24-16-bagheera-done-messua, a24-16-trail-messua,
 *     a24-16-trail-done-messua, a24-16-complete-messua.
 *   s24Done (Grove, read-only): a24-17-margin-hazel.
 */
export const ATLAS_A24_VARIANTS: Scene[] = [
  // ---------------------------------------------------------------- Fern’s memory (s8Reunited)
  {
    id: 'a24-02-council-done-fern',
    lines: [
      N('The wolves come one by one to look at Mowgli, and then they go down the hill after the bull.'),
      N('From the edge of the page, faint as pencil, comes a voice you know. Fern, remembering.'),
      FE('That’s what Bramble did for the strays.', 'soft'),
      AK('He is the pack’s now. Take him home, and bring him up properly.'),
    ],
  },
  // ---------------------------------------------------------------- A24-10 (messua)
  {
    id: 'a24-10-road-done-messua',
    lines: [
      N('Mowgli goes into the trees with Akela and Grey Brother. Your Nubbin watches him go, and then leans against Messua’s leg.'),
      ME('You stayed. Oh, you foolish, kind thing. Come in. Come in and I’ll make something hot.', 'sad'),
    ],
  },
  {
    id: 'a24-10-complete-messua',
    lines: [
      N('You stay with Messua a while. Her neighbours don’t speak to her now, so you carry her water from the well yourself.'),
      ME('He was my son for a year. That’s more than I thought I’d have again. More than most get twice.', 'soft'),
      N('On the first night, at moonrise, Grey Brother scratches at the back door. Mowgli wants you at the Council Rock.'),
      ME('Go on. Go and see him keep his promise. And come back after. The door’s on the latch.', 'soft'),
      N('Your Nubbin sleeps in her basket by the hearth on the nights you’re there. She has started calling it “the little one”.'),
    ],
  },
  // ---------------------------------------------------------------- A24-13 (messua)
  {
    id: 'a24-13-hut-messua',
    lines: [
      N('It has been a quiet season in Messua’s hut. Then one evening the men come, with torches and with Buldeo.'),
      VI('A wolf-demon, under our own roofs. We could all have been eaten in our beds. They’ll answer for it.', 'angry'),
      N('They tie Messua and her husband with ropes, and leave them in the hut, and set a guard outside. They don’t tie you.'),
      N('Nobody quite looks at you, because nobody knows what a guest is. That turns out to be useful.'),
      ME('Don’t. They’ll tie you too. Stay out of it. Please.', 'shock'),
      N('You wait until the guard falls asleep against the wall. Then you kneel down and start on the knots.'),
      N('Your Nubbin works at the rope round her husband’s ankles with its paws, very seriously, and makes it worse, then better.'),
      N('By the time Mowgli slides in at the back of the hut, the ropes are already loose on the floor.'),
      MG('You did it. You stayed, and you did it. Good. Come on. All of you.', 'happy'),
    ],
    choices: [
      {
        id: 'watch',
        label: 'Keep an eye on the sleeping guard.',
        then: [N('He snores on. One dog barks, once, and then thinks better of it.')],
      },
      {
        id: 'nubbin',
        label: 'Lift your Nubbin before it chews the rope.',
        then: [N('You lift it away. It has a bit of rope in its mouth, and looks proud of it.')],
      },
    ],
  },
  {
    id: 'a24-13-hut-done-messua',
    lines: [
      N('The back door opens without a sound. Messua leans on you, and her husband leans on Mowgli, both stiff from the ropes.'),
      ME('My son. And you. I knew. I didn’t believe it, but I knew.', 'sad'),
    ],
  },
  {
    id: 'a24-13-road-messua',
    lines: [
      MG('Guest, take them to the road. The road to the town, a long day’s walk. I have to go and talk to Hathi.', 'think'),
      MG('Nobody there knows them, and the law there will keep them safe. The wolves will run beside you. You won’t see them.'),
      N('So you walk Messua and her husband through the dark, the long way round the fields, with your Nubbin at your heel.'),
      N('Sometimes, in the grass beside the path, there is a soft sound like something grey keeping pace.'),
      ME('You stayed with me. When he went, you stayed. I won’t forget it.', 'soft'),
      N('At the road she stops, and holds your face in both her hands, the way she used to hold Mowgli’s.'),
      ME('Go and find him. Tell him we’re safe. Tell him to eat properly.', 'soft'),
    ],
    choices: [
      {
        id: 'promise',
        label: 'Promise you will.',
        then: [ME('Good. And you eat properly too. Both of you.', 'happy')],
      },
      {
        id: 'nubbin',
        label: 'Let your Nubbin say goodbye.',
        then: [N('Your Nubbin presses its face against her ankle. She bends and kisses the top of its head.')],
      },
    ],
  },
  {
    id: 'a24-13-road-done-messua',
    lines: [
      N('You watch them go: two small shapes on the road, walking away into the grey of dawn.'),
      N('She turns once, at the bend, and lifts her hand, and you lift yours. Then you go back to find Mowgli and Hathi.'),
    ],
  },
  // ---------------------------------------------------------------- A24-15 (both)
  {
    id: 'a24-15-lamp-mowgli',
    lines: [
      N('Messua looks at you over Mowgli’s head, polite and puzzled. She doesn’t know you.'),
      N('It has been years. A season with the wolves, then more seasons, and you look like something the jungle raised.'),
      ME('And you, friend. Are you hungry too? Sit down. Whoever you are, you came in with my son, and that’s enough.', 'soft'),
      N('You sit by the door and eat her bread, and you don’t remind her. It doesn’t seem to matter tonight.'),
    ],
  },
  {
    id: 'a24-15-lamp-messua',
    lines: [
      N('Messua sees you over Mowgli’s head, and her face lights up as if somebody had turned the lamp higher.'),
      ME('You! It’s you! You stayed with me, that time, when nobody else would. Oh, come here.', 'happy'),
      N('She lifts the baby off the mat and puts him in your arms, warm and heavy and asleep, so she can feed Mowgli.'),
      ME('Hold him. He likes being held. He’s not fussy. Not like his brother.', 'happy'),
      N('The baby opens his eyes and looks at your Nubbin, and your Nubbin looks back. Neither of them blinks for a long time.'),
    ],
  },
  // ---------------------------------------------------------------- A24-16 (messua)
  {
    id: 'a24-16-bagheera-done-messua',
    lines: [
      N('Mowgli looks at you for a long time. Then he puts his hand on your Nubbin’s head.'),
      MG('You stayed with Messua, when I couldn’t. Will you look in on her? On your way home. Just once. Tell her I’m coming.', 'soft'),
    ],
  },
  {
    id: 'a24-16-trail-messua',
    lines: [
      N('You walk with Mowgli as far as the fork in the trail, at the foot of the hills. Grey Brother and his brothers run beside him.'),
      MG('This way for me, the long way round, to say goodbye to the hills. That way for you: the hut with the lamp. You know it.', 'soft'),
      N('He goes off along the ridge with the four wolves round him, and doesn’t look back. That’s how you know he’ll be all right.'),
      N('You take the other path, through the fields, with your Nubbin trotting ahead. It knows the way too.'),
      N('The lamp is lit in the window, though it isn’t dark yet. Messua is in the doorway, shading her eyes.'),
      ME('Is he coming? Did he say? Tell me he’s coming.', 'think'),
    ],
    choices: [
      {
        id: 'yes',
        label: 'Tell her he’s coming.',
        then: [ME('Then I’ll make more bread. I’ll make all the bread.', 'happy')],
      },
      {
        id: 'baby',
        label: 'Ask after the baby first.',
        then: [ME('Asleep, for once. Come and see. Quietly.', 'soft')],
      },
    ],
  },
  {
    id: 'a24-16-trail-done-messua',
    lines: [
      N('Inside, the baby is asleep on his mat, fat and brown, with one fist up by his ear.'),
      N('Your Nubbin creeps over and lies down beside him, carefully, the way it used to lie down with the wolf cubs.'),
    ],
  },
  {
    id: 'a24-16-complete-messua',
    lines: [
      N('The last thing you see is the hut in the evening, the lamp lit in the window, and the baby asleep inside.'),
      N('Somewhere up the trail, Mowgli is walking towards it with four wolves. Messua has put the bread on.'),
      N('The page goes soft at the edges, like lamplight. Then it is your own kitchen, and the atlas open on the table.'),
      N('Tucked into the back of the page is a plank, carved by somebody with a knife and a lot of patience.'),
    ],
  },
  // ---------------------------------------------------------------- Hazel’s margin note (s24Done)
  {
    id: 'a24-17-margin-hazel',
    lines: [
      N('Nova’s atlas lies open at the seals’ beach, and the white pup in the shelter of his mother’s rock.'),
      N('Beside the pup, low in the margin, there is a pencil note you have never noticed. You know the hand.'),
      N('“Safe beach first. Then a well one.”', 'soft'),
      N('“He found both.”', 'soft'),
      N('And under it, one letter: H.'),
      N('Your Nubbin puts its nose on the white seal in the picture, and then on the H, and leaves it there.'),
    ],
  },
];

// =================================================================== flags and checks

/** Every flag this line sets (Atlas save only). It reads s8Reunited and s24Done, and writes no Grove flag. */
export const ATLAS_A24_FLAGS: string[] = [
  'a24-01',
  'a24-02',
  'a24-03',
  'a24-04',
  'a24-05',
  'a24-06',
  'a24-07',
  'a24-08',
  'a24-09',
  'a24-10',
  'a24-11',
  'a24-12',
  'a24-13',
  'a24-14',
  'a24-15',
  'a24-16',
  'a24-17',
  'a24-18',
  'a24-done', // A24-18: the whole page; read by atlasDone('A24') for festivals and the Grove keepsakes
  'a24-stones', // mowgli | messua (a24-10-road): A24-10, A24-13, A24-15, A24-16
];

export const ATLAS_A24_CHECKS: string[] = [
  'explore:a24-seeonee:cave-mouth',
  'watch:a24-cub:cave',
  'sit:a24-mother-wolf:cave',
  'walk:a24-council-rock:full-moon',
  'watch:a24-council:rock',
  'visit:a24-baloo:glade',
  'talk:a24-baloo:master-words',
  'puzzle:a24-calls:glade',
  'watch:a24-bandar-log:treetops',
  'watch:a24-chil:sky',
  'walk:a24-kaa:ledge',
  'explore:a24-cold-lairs:terrace',
  'watch:a24-terrace:fight',
  'carry:a24-nubbin:hunger-dance',
  'talk:a24-bagheera:night',
  'carry:a24-fire-pot:village',
  'feed:a24-fire-pot:dry-sticks',
  'watch:a24-council:fire',
  'sit:a24-mowgli:council-rock',
  'walk:a24-village:gate',
  'watch:a24-buffalo:grazing',
  'visit:a24-village-tree:evening',
  'talk:a24-grey-brother:ford',
  'escort:a24-herd:ravine',
  'watch:a24-buldeo:ravine',
  'walk:a24-village:dusk',
  'choose:a24-stones:road',
  'walk:a24-council-rock:moonrise',
  'watch:a24-pack:council-rock',
  'walk:a24-waingunga:drought',
  'sit:a24-peace-rock:pool',
  'watch:a24-nubbin:peace-rock',
  'wait:a24-hut:night',
  'escort:a24-messua:road',
  'watch:a24-village:overgrown',
  'talk:a24-kaa:river',
  'watch:a24-bee-rocks:river',
  'sit:a24-akela:bank',
  'watch:a24-spring:jungle',
  'walk:a24-north:night',
  'visit:a24-council-rock:dawn',
  'wait:a24-bagheera:council-rock',
  'walk:a24-trail:north',
  'explore:a24-novastoshnah:beach',
  'swim:a24-surf:novastoshnah',
  'watch:a24-drove:inland',
  'swim:a24-search:islands',
  'swim:a24-sea-cows:tunnel',
  'watch:a24-fight:novastoshnah',
];
