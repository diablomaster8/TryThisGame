/**
 * Atlas campaign, page A14: Homecoming (Part M, rank 8). Twenty quests, A14-1 to A14-20.
 *
 * SOURCE. Homer, The Odyssey (Greece, c. 8th century BC), followed through Samuel Butler's prose
 * translation (A. C. Fifield, London, 1900; Project Gutenberg #1727). Rights: the poem and Butler's
 * translation (Butler died in 1902) are public domain everywhere. Nothing from any modern
 * translation (Lattimore, Fitzgerald, Fagles, Lombardo, Wilson and the rest are in copyright): no
 * openings, epithets or phrasings lifted from them. Nothing from any film or series, including the
 * 2026 film: the art is Homer's world, drawn in the atlas's own style.
 *
 * AUDIENCE. 'all', with care (see CARE NOTES). The two lifted lines have `childLines` replacements
 * for the Learning Grove.
 *
 * FRAME. Nova's atlas falls open at a page of sea and islands. You and your Nubbin come to Ithaca as
 * strangers at a gate, and stay as guest-friends: the Odyssey's first law is the welcome of
 * strangers. Odysseus is the hero; you hold the torch, sit with him, feed the pigs, wear the wax and
 * sit with Argos. When someone on this page tells a story (Antinous in A14-2, Menelaus in A14-3,
 * Odysseus in the Phaeacian hall, A14-7 to A14-13), the atlas lets you step into it, so you are there
 * for the Cyclops and the Sirens; you come back to the hall in A14-13's complete scene. Gods, the
 * dead and Homer's people speak, as Homer has them speak (canon 31); Argos and your Nubbin never do.
 * Butler's Roman names are given in their Greek forms: Odysseus (Ulysses), Athena (Minerva), Zeus
 * (Jove), Hermes (Mercury), Poseidon (Neptune), and "Nobody" for "Noman".
 *
 * GROVE FLAGS READ (read-only; the Atlas never writes a Grove flag):
 *   - corvinGate (S9; family | guest | shut). It is decided at S9's dawn gate scene, on the morning of
 *     chapter 12, so before then it is unset and the page plays with no Corvin at all.
 *     · family: Corvin joins. A14_VARIANTS 'a14-corvin-joins' plays once, before the first step scene
 *       of the first A14 quest begun while corvinGate = family, and sets the Atlas flag a14-corvin.
 *       From then on he walks with you on the page, silent, except in A14-16 ('a14-16-sit-corvin',
 *       he sits with Argos, his cold hands warm now), A14-19 ('a14-19-aegis-done-corvin') and the
 *       close ('a14-close-family'). If he joins after A14-16 he simply misses Argos.
 *     · guest: he doesn't come. 'a14-close-guest' plays straight after A14-20's complete scene: he is
 *       at the stuck gate when you shut the atlas, and knocks on the gatepost.
 *     · shut: 'a14-close-shut' plays there instead: the lane is empty, and the gate sticks when you
 *       lift and push.
 *     · unset when A14-20 completes: no close scene. Nothing waits for later.
 *   - Campaign finished (CampaignState.ending is set, so chapter 12's finalChoice is done AND Hazel's
 *     walk up the hill, c12-walk-*, has played). Then 'a14-margin-hazel' (or, with corvinGate =
 *     family, 'a14-margin-hazel-family') plays once: straight after a14-16-complete if the campaign is
 *     already finished then, or else the first time the atlas is opened at the Argos page after the
 *     ending. From then on the pencil note (and Corvin's ink line, with family) is drawn in that
 *     page's margin. Never before the walk. S24 adds no second note on this page.
 *
 * FLAGS WRITTEN (Atlas save only, all prefixed a14-):
 *   - a14-01 … a14-20: each quest on completion. a14-done: the whole page (A14-20); the Great Voyage
 *     festival and Penelope's loom read it through atlasDone('A14').
 *   - a14-name = dont | shout | silence (A14-8, a14-08-shout): the line's signature choice. Picks
 *     variants in A14-14 (a14-14-harbour*), A14-16 (a14-16-gate*) and A14-20 (a14-20-bed*,
 *     a14-20-complete-silence). The scenes shown in the quests are the "dont" versions.
 *   - a14-corvin (true): set by 'a14-corvin-joins' (corvinGate = family only).
 *
 * LIFTED TEXT (verbatim; only the two passages Part M marks as verified, rechecked there on
 * 2026-10-14 against Project Gutenberg #1727, Butler's 1900 translation, Book II; set with the
 * game's curly quotes). Both are Antinous's words in the source, and he speaks them here:
 *   1. "She set up a great tambour frame in her room, and began to work on an enormous piece of fine
 *      needlework." Antinous, a14-02-antinous#1.
 *   2. "but at night she would unpick the stitches again by torchlight." A fragment, set inside our
 *      own sentence ("We saw her at her great web all day long, but at night …"). Antinous,
 *      a14-02-loom#0.
 * Each is used once, with a childLines entry. Part M marks six more Butler passages [unverified]
 * (Books IX, XI, XII twice, XVII, XXIII). None is quoted: the beats are told in our own words at
 * a14-08-wine#5 (Nobody), a14-11-shades#10 (his mother), a14-12-advice#3 (the wax), a14-13-strait#2
 * (Scylla), a14-16-gate#6 (Argos) and a14-20-bed#5–6 (the olive). Every other line is original.
 * Demodocus's and the Sirens' songs are described, never given: no song words, no verse.
 *
 * CARE NOTES.
 *   - The suitors' fate is softened for all ages, and we say so. In Homer, Odysseus and Telemachus
 *     kill every suitor, and the disloyal maids and the goatherd Melanthius are put to death. Here
 *     Athena's aegis drives the suitors out, over the wall and down the road, and they don't come
 *     back; Odysseus's first arrow only knocks the cup from Antinous's hand. Nobody is punished on
 *     screen: the maids help clear the hall, and the goatherd is only seen kicking at the beggar on
 *     the road. The families' revenge (Book XXIV) is cut to Athena's peace.
 *   - Other deaths are offscreen and "lost": the two men in the Cyclops's cave, the giants' harbour
 *     (one line, A14-9), Scylla's six and the crew after the Sun's cattle. The blinding is one
 *     offscreen beat (the stake, the fire, a roar). Odysseus's offering at the edge of the world is
 *     his, out of sight, with no blood. His despair on the ship (Book X) is shown as lying down with
 *     his face covered, never as wanting to die.
 *   - Argos and his mother's ghost are gentle and grave, like Fossil. A14-11 opens with a soft content
 *     line, and the player may leave and come back.
 *   - The gods appear as Homer presents them, with dignity: never comic, never a gag, and never doing
 *     anything the poem doesn't give them. Hellenic polytheism is a living, legally recognised
 *     religion in Greece today, so Athena, Hermes, Zeus and Poseidon are treated as someone's gods.
 *     No sacrifice or offering is a player action, and no prayer is ever put in the player's mouth;
 *     when Odysseus prays it is his own, and brief or out of sight. Ask a Greek classicist to read
 *     the script before ship.
 *   - Slavery in Homer's households (Eurycleia, Eumaeus) is not mentioned: they are the nurse and the
 *     swineherd. Hazel's third rule is acted out (Calypso's shore, the willows, Argos) and never
 *     quoted.
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

const WHERE = 'Nova’s atlas: the Homecoming page (Atlas campaign)';
const after = (code: string) => `Any time after ${code}, from Nova’s atlas.`;
const ODY = 'The Odyssey (Homer; Butler’s prose translation, 1900)';

// ------------------------------------------------------------------ speakers

const ODYSSEUS = sp('a14-odysseus', 'Odysseus', 'Odysseus (Butler: Ulysses), son of Laertes, king of Ithaca (Homer, Odyssey)');
const BEGGAR = sp('a14-beggar', 'The Beggar', 'Odysseus, disguised by Athena as an old beggar (Odyssey XIII–XXII)');
const TELEMACHUS = sp('a14-telemachus', 'Telemachus', 'Telemachus, son of Odysseus and Penelope (Odyssey)');
const PENELOPE = sp('a14-penelope', 'Penelope', 'Penelope, wife of Odysseus (Odyssey)');
const EURYCLEIA = sp('a14-eurycleia', 'Eurycleia', 'Eurycleia (Butler: Euryclea), nurse to Odysseus and Telemachus (Odyssey)');
const MENTES = sp('a14-mentes', 'Mentes', 'Athena (Butler: Minerva), daughter of Zeus, in the likeness of Mentes, chief of the Taphians (Odyssey I)');
const MENTOR = sp('a14-mentor', 'Mentor', 'Athena, daughter of Zeus, in the likeness of Mentor, Odysseus’s old friend (Odyssey II–III)');
const SHEPHERD = sp('a14-shepherd', 'A Young Shepherd', 'Athena, daughter of Zeus, in the likeness of a young shepherd (Odyssey XIII)');
const ATHENA = sp('a14-athena', 'Athena', 'Athena (Butler: Minerva), daughter of Zeus (Odyssey)');
const ANTINOUS = sp('a14-antinous', 'Antinous', 'Antinous, the boldest of the suitors (Odyssey)');
const EURYMACHUS = sp('a14-eurymachus', 'Eurymachus', 'Eurymachus, one of the leading suitors (Odyssey)');
const NESTOR = sp('a14-nestor', 'Nestor', 'Nestor, the old king of Pylos (Odyssey III)');
const MENELAUS = sp('a14-menelaus', 'Menelaus', 'Menelaus, king of Sparta (Odyssey IV)');
const HELEN = sp('a14-helen', 'Helen', 'Helen, queen of Sparta (Odyssey IV)');
const HERMES = sp('a14-hermes', 'Hermes', 'Hermes (Butler: Mercury), messenger of the gods (Odyssey V, X)');
const CALYPSO = sp('a14-calypso', 'Calypso', 'Calypso, the goddess-nymph of Ogygia (Odyssey V)');
const INO = sp('a14-ino', 'Ino', 'Ino, called Leucothea, a goddess of the sea (Odyssey V)');
const NAUSICAA = sp('a14-nausicaa', 'Nausicaa', 'Nausicaa, daughter of Alcinous and Arete (Odyssey VI)');
const ALCINOUS = sp('a14-alcinous', 'Alcinous', 'Alcinous, king of the Phaeacians (Odyssey VII–XIII)');
const ARETE = sp('a14-arete', 'Arete', 'Arete, queen of the Phaeacians (Odyssey VII)');
const CYCLOPS = sp('a14-cyclops', 'Polyphemus', 'Polyphemus the Cyclops, son of Poseidon (Odyssey IX)');
const CYCLOPES = sp('a14-cyclopes', 'The Other Cyclopes', 'The neighbouring Cyclopes (Odyssey IX)');
const SAILOR = sp('a14-sailor', 'A Sailor', 'One of Odysseus’s crew (Odyssey IX–X)');
const AEOLUS = sp('a14-aeolus', 'Aeolus', 'Aeolus, keeper of the winds (Odyssey X)');
const EURYLOCHUS = sp('a14-eurylochus', 'Eurylochus', 'Eurylochus, Odysseus’s kinsman and second in command (Odyssey X, XII)');
const CIRCE = sp('a14-circe', 'Circe', 'Circe, the goddess of Aeaea (Odyssey X, XII)');
const TIRESIAS = sp('a14-tiresias', 'Tiresias', 'Tiresias, the blind prophet of Thebes, among the dead (Odyssey XI)');
const ANTICLEA = sp('a14-anticlea', 'Anticlea', 'Anticlea, Odysseus’s mother, among the dead (Odyssey XI)');
const EUMAEUS = sp('a14-eumaeus', 'Eumaeus', 'Eumaeus, the loyal swineherd (Odyssey XIV–XXII)');
const LAERTES = sp('a14-laertes', 'Laertes', 'Laertes, Odysseus’s old father (Odyssey XXIV)');

const N = say('narrator');
const Y = say('you');
const C = say('corvin');
const O = say('a14-odysseus');
const B = say('a14-beggar');
const T = say('a14-telemachus');
const PE = say('a14-penelope');
const EU = say('a14-eurycleia');
const MS = say('a14-mentes');
const MR = say('a14-mentor');
const SH = say('a14-shepherd');
const AT = say('a14-athena');
const AN = say('a14-antinous');
const EM = say('a14-eurymachus');
const NE = say('a14-nestor');
const ME = say('a14-menelaus');
const HE = say('a14-helen');
const HM = say('a14-hermes');
const CA = say('a14-calypso');
const IN = say('a14-ino');
const NA = say('a14-nausicaa');
const AL = say('a14-alcinous');
const AR = say('a14-arete');
const CY = say('a14-cyclops');
const CS = say('a14-cyclopes');
const SA = say('a14-sailor');
const AE = say('a14-aeolus');
const EL = say('a14-eurylochus');
const CI = say('a14-circe');
const TI = say('a14-tiresias');
const AC = say('a14-anticlea');
const EP = say('a14-eumaeus');
const LA = say('a14-laertes');

// ------------------------------------------------------------------ lifted text (verified)

/** Book II, Antinous (Butler, 1900; PG #1727). Verbatim. */
const LIFT_FRAME = 'She set up a great tambour frame in her room, and began to work on an enormous piece of fine needlework.';
/** Book II, Antinous (Butler, 1900; PG #1727). The fragment from "but at night" is verbatim, inside our own sentence. */
const LIFT_UNPICK = 'We saw her at her great web all day long, but at night she would unpick the stitches again by torchlight.';

// ------------------------------------------------------------------ shared pieces (a14-name variants)

/** A14-14 step 2: the harbour, before the route line. */
const A14_HARBOUR: Line[] = [
  N('He wakes. A mist lies over everything, and he doesn’t know where he is.'),
  O('What country is this? They promised me Ithaca, and they’ve put me down on some strange shore and gone.', 'angry'),
  N('A young shepherd comes down the path: fine-boned, like a king’s son, with a good cloak and a spear in his hand.'),
  SH('You must be a long way from home, stranger, not to know this place. This is Ithaca. Even at Troy they’ve heard of Ithaca.'),
  N('Odysseus’s heart leaps. Then, because he is who he is, he tells the shepherd a long, sad lie about being a runaway from Crete.'),
  N('The shepherd smiles, and is a tall woman, grave and beautiful. You have met her before, more than once, in other faces.'),
  AT('Even here, on your own island, you’d spin me a tale. That carefulness is why I have never been able to leave you.', 'soft'),
  AT('I am Athena, daughter of Zeus, who has stood by you in every trouble. Look. Your harbour. Your olive tree. Your mountain.'),
  N('The mist lifts. He knows it all at once, and kneels, and puts his face to the ground.'),
  AT('Your house is full of men who court your wife and eat your bread. Nobody must know you yet. Not one person.'),
  N('She touches him with her wand. His skin wrinkles, his hair thins, and his fine clothes are rags that stink of smoke.'),
  N('He is an old beggar with a staff and a torn bag on a cord. He looks down at himself, and laughs.'),
  B('Well. Nobody will know me now.', 'think'),
];

/** A14-16 step 2: the gate and the heap, before the route lines. */
const A14_GATE: Line[] = [
  N('Outside the gate lies a heap of dung from the mules and cattle, waiting to be carried out to the fields. On it lies an old dog.'),
  N('He is crawling with ticks, and nobody looks after him now. His master is away, and the maids don’t bother.'),
  EP('That’s Argos. The master raised him from a pup, and sailed for Troy before he ever got to hunt with him.', 'sad'),
  EP('Once, no deer in the deep woods could get away from him. The best nose on the island. Look at him now.', 'sad'),
  N('The old dog lifts his head. His nose works at the air.'),
  N('He knows. After twenty years, through the rags and the staff and the old man’s face, he knows.'),
  N('His ears go flat against his head, and his tail thumps once in the dirt, then again. He can’t get up.'),
  N('The beggar can’t go to him. If he kneels to this dog in front of the swineherd, the whole town will know by dinner.'),
];
const A14_GATE_END: Line[] = [
  EP('Come on, old man. They’ll have eaten it all.'),
  N('Eumaeus goes in through the gate, and the beggar follows. He doesn’t look back at the heap, because he can’t.'),
];

/** A14-16 step 3: sitting with Argos. */
const A14_SIT_START: Line[] = [
  N('You sit down beside the heap, in the sun, where it’s warm. Your Nubbin goes up to the old dog slowly, the way it would go up to Moss.'),
  N('Argos sniffs it. Then he lets his head go down, and your Nubbin lies against his side, where the ribs show.'),
  N('From the hall comes the noise of the suitors, and the lyre. Out here there is only the sun, and the flies, and the three of you.'),
  N('He smells of dust and age. Somebody once brushed this coat every day: you can tell from the way it lies.'),
];
const A14_SIT_END: Line[] = [
  N('His tail moves once more in the dust, for no one you can see.'),
  N('His eyes are on the gate, where his master went in. He is very tired, and the waiting is done.'),
];
const A14_SIT_CHOICES = [
  {
    id: 'ears',
    label: 'Scratch behind his ears.',
    then: [N('You scratch behind his ears, where a good dog’s ears always want scratching. His eyes half close.')],
  },
  {
    id: 'sit',
    label: 'Just sit with him.',
    then: [N('You just sit. You don’t need to do anything, and he doesn’t need you to.')],
  },
  {
    id: 'tell',
    label: 'Tell him, quietly, that his master’s home.',
    then: [
      Y('He’s home. You were right. He came back.', 'soft'),
      N('Argos sighs: a long sigh, like a dog lying down at the end of a day in the woods.'),
    ],
  },
];

/** A14-19 step 2 done: the empty hall. */
const A14_EMPTY: Line[] = [
  N('The hall is empty. The swallow on the roof-beam is gone, and there is only the mess, and the sound of your own breathing.'),
  T('They’re gone. They’re really gone.', 'shock'),
];

/** A14-20 step 2: the bed, before the route lines. */
const A14_BED: Line[] = [
  O('Strange woman. The gods made you harder than anyone. Nurse, make me up a bed out here. I’ll sleep alone.', 'sad'),
  PE('I’m not proud, and I’m not cold. I know very well what you looked like when you sailed.', 'soft'),
  PE('Eurycleia, move the great bed out of our room, the one he built himself. Make it up for him out here.', 'think'),
  N('Odysseus goes white. He stands up.'),
  O('Who moved my bed? Nobody could. Nobody living could shift it, however young and strong, unless a god helped him.', 'angry'),
  O('I built it. An olive tree grew in the courtyard, tall and thick and green, and I built our room round it, stone by stone.', 'angry'),
  O('I roofed it and hung the doors. Then I cut away the branches, trimmed the trunk, and made it the bedpost. I bored the holes myself.'),
  O('That was our secret. Has someone cut the trunk? Tell me. Is my bed still there?', 'sad'),
  N('Her knees give way. She runs to him, and puts her arms round his neck, and kisses him.'),
  PE('Don’t be angry with me. So many men have come with stories. I had to be sure it was you.', 'sad'),
  PE('Twenty years, and the first thing you do is shout about carpentry.', 'happy'),
  O('It’s very good carpentry.'),
  PE('It’s a bed, my love. It was never the interesting part of you.'),
  N('Your Nubbin, who has been sitting on the bed, decides it is the interesting part.'),
  N('He holds her and weeps. She is to him what the land is to a swimmer who has been a long time in the sea.'),
  N('Athena holds back the dawn at the edge of the world, and keeps the horses of the morning in their stable, so the night goes on.'),
];

/** A14-20 complete: before and after the silence route's thanks. */
const A14_PEACE: Line[] = [
  N('Before anyone can lift a spear, old Mentor steps between the two sides. When he speaks, it isn’t Mentor’s voice at all.'),
  AT('Men of Ithaca, stop. No more of this. Make peace, and let it hold.'),
  N('Out of a clear sky comes thunder. The spears go down, and the families stand in the road, and then, one by one, go home.'),
  N('Athena, still in Mentor’s shape, makes peace between the house and the town, and both sides swear to keep it.'),
  PE('Take my loom, guest. The big one upstairs. I won’t need a loom that works backwards any more.', 'happy'),
  N('Telemachus brings a cutting from the olive in the bedroom wall, wrapped in wet cloth.'),
  O('Plant it by your water. Build something round it, if you like. That’s what they’re for.', 'soft'),
];
const A14_HOME: Line[] = [
  N('The sea goes blue again under your fingers, and the island goes small, and you are home, with the atlas on your knee.'),
  N('In one hand there is an olive cutting in wet cloth. Your Nubbin is holding the corner of a very large loom.'),
];

// =================================================================== HOMECOMING

export const ATLAS_A14: Quest[] = [
  // ---------------------------------------------------------------- A14-1
  {
    id: 'a14-01',
    code: 'A14-1',
    title: 'The Loom',
    source: `${ODY}, Book I: Athena visits Telemachus`,
    audience: 'all',
    trigger: { where: WHERE, when: 'Any time once Nova’s atlas is in the Grove; the first quest on the page.' },
    speakers: [TELEMACHUS, MENTES, PENELOPE, EURYCLEIA],
    steps: [
      {
        id: 'a14-01-s1',
        goal: 'Step onto Ithaca, and wait at the gate.',
        hint: 'Touch the page, then walk up to the courtyard gate.',
        check: 'visit:a14-ithaca:gate',
        scene: {
          id: 'a14-01-gate',
          lines: [
            N('Nova’s atlas falls open at a page of blue: sea, then islands, then one rough island with goats on it.'),
            N('Under your fingers the blue goes warm and salty. Then you are standing at a courtyard gate, with your Nubbin.'),
            N('Inside, young men lounge about playing counters on the hides of oxen they never paid for. It smells of roast meat and spilt wine.'),
            N('Nobody comes to the gate. Beside you stands an old traveller with a bronze spear, waiting, as you are.'),
            MS('In a good house, a stranger isn’t left standing at the gate. This was a good house once.', 'think'),
            N('A young man is sitting among the noise as if he were somewhere else. He sees the two of you, and goes red to the ears.'),
            T('Strangers, at the gate, and nobody… Forgive us. Come in, both of you. Eat first, then tell me what you need.'),
          ],
          choices: [
            {
              id: 'wait',
              label: 'Wait to be asked in properly.',
              then: [T('You’re asked. Properly. I’m Telemachus. It’s my house, for what that’s worth these days.')],
            },
            {
              id: 'step',
              label: 'Step in. You’re hungry.',
              then: [N('You step in. The old traveller nods at you, as if that was the right answer too.')],
            },
            {
              id: 'nubbin',
              label: 'Let your Nubbin go first.',
              then: [N('Your Nubbin walks in ahead of you and waits by the hearth, as if it knows where guests go. Telemachus laughs, for the first time in a while.')],
            },
          ],
        },
        done: {
          id: 'a14-01-gate-done',
          lines: [
            N('Telemachus takes the old man’s spear and stands it in a rack with other spears, all dusty. They were his father’s.'),
            T('Over here, away from them. You won’t hear yourself think near that lot.'),
          ],
        },
      },
      {
        id: 'a14-01-s2',
        goal: 'Sit with Telemachus and the old traveller, and listen.',
        hint: 'Take the seat by the far pillar, out of the suitors’ way.',
        check: 'sit:a14-mentes:hearth',
        scene: {
          id: 'a14-01-hearth',
          lines: [
            N('A maid pours water over your hands from a gold jug, then brings bread, then meat. The traveller eats like someone who has walked a long way.'),
            MS('I’m Mentes. My father and yours were guest-friends, long ago. I came hoping to find him home.'),
            T('Then you’re twenty years late, like everyone. He went to Troy when I was a baby. Troy fell, and he never came back.'),
            T('Those men are suitors. They want my mother to marry one of them, and until she chooses, they eat here. Every day.', 'angry'),
            T('The pigs, the sheep, the goats, the wine. They’re eating my father’s house one dinner at a time.', 'sad'),
            MS('You have his eyes. I knew them well.', 'soft'),
            T('My mother says I’m his. I never saw him, so I can’t say.', 'sad'),
            N('The traveller looks at him for a long moment. Then at you, as if you were part of the answer.'),
            MS('He is not dead. He is held somewhere on the wide sea, and he is trying. He is a man who finds a way.'),
            MS('Call the men of Ithaca to an assembly. Then take a ship and go asking: old Nestor at Pylos, then Menelaus at Sparta.'),
          ],
          choices: [
            {
              id: 'how',
              label: 'Ask Mentes how he knows.',
              then: [MS('Some things I know because I’ve seen them. Some, because I know him.', 'soft')],
            },
            {
              id: 'go',
              label: 'Tell Telemachus you’ll go with him.',
              then: [
                T('You would? You don’t even know us.'),
                N('Mentes smiles into his cup. Here, it seems, a guest is part of the house for as long as they stay.'),
              ],
            },
            {
              id: 'eat',
              label: 'Eat, and listen.',
              then: [N('You eat, and listen. The bread is good: it’s the last of the good flour, and Telemachus gave it to the strangers.')],
            },
          ],
        },
        done: {
          id: 'a14-01-hearth-done',
          lines: [
            N('Mentes stands and goes out across the yard. Then a bird goes up through the smoke-hole in the roof, and there is no Mentes.'),
            T('That was no traveller.', 'shock'),
            N('He stands up differently after that, as if someone had just told him whose son he was.'),
          ],
        },
      },
      {
        id: 'a14-01-s3',
        goal: 'Watch from the stair as Penelope comes down.',
        hint: 'Stand at the foot of the stair, by the hall door.',
        check: 'watch:a14-penelope:stair',
        scene: {
          id: 'a14-01-stair',
          lines: [
            N('In the hall the bard Phemius is singing for the suitors: the Greeks coming home from Troy, and all the ones who never did.'),
            N('A woman comes down the stair with two maids, and stands in the doorway with a veil drawn across her face.'),
            PE('Phemius, you know a hundred stories. Sing them another one. Not that one. Not in this house.', 'sad'),
            T('Mother. It isn’t his fault what happened at Troy. Let him sing. A lot of men didn’t come home.', 'soft'),
            N('Penelope looks at her son as if he has grown taller in front of her. Then she goes back up the stair.'),
            N('Through her door at the top you see a great loom, and on it a cloth as wide as a sail, the colour of undyed wool.'),
            N('Your Nubbin climbs two stairs to look. A maid gently turns it round and points it back down.'),
          ],
        },
        done: {
          id: 'a14-01-stair-done',
          lines: [T('That cloth has been on that loom as long as the suitors have been in this hall. Ask Antinous about it. He loves telling it.', 'angry')],
        },
      },
    ],
    complete: {
      id: 'a14-01-complete',
      lines: [
        N('Night. The suitors go home to sleep, promising to be back for breakfast, and they always keep that promise.'),
        N('Old Eurycleia, who nursed Telemachus and his father before him, lights him up to bed with a torch.'),
        EU('I had your father on my knee, and then you. I’ll see the two of you in one room before I’m done.', 'soft'),
        T('Tomorrow I’ll call the assembly. Will you stand with me? Just stand. You don’t have to say anything.'),
        N('Eurycleia folds his tunic, hangs it on a peg, and pulls the door shut by its silver ring.'),
        N('You and your Nubbin sleep on fleeces in the porch, as guests do here. Somewhere above, very quietly, a loom is working.'),
        N('It sounds as if it is going backwards.'),
      ],
    },
    rewards: [],
    sets: { 'a14-01': true },
    notes:
      'OPENING: the atlas page is drawn in sea-blue ink and colours in as you step through (a slow wash, two seconds). ' +
      'Mentes is Athena in disguise (Book I); the page never says so until a14-03-pylos-done, and never plays it for a ' +
      'joke. Her exit is a bird up through the smoke-hole, as in Homer: a quiet beat with a soft wing sound, no flash. ' +
      'The suitors are drawn as noisy, idle young men, never as monsters. CORVIN: if corvinGate = family and a14-corvin ' +
      'is not yet set, A14_VARIANTS a14-corvin-joins plays before a14-01-gate (see the file header).',
  },

  // ---------------------------------------------------------------- A14-2
  {
    id: 'a14-02',
    code: 'A14-2',
    title: 'The Assembly',
    source: `${ODY}, Book II: the assembly; Penelope’s web; Telemachus sails`,
    audience: 'all',
    trigger: { where: WHERE, when: after('A14-1') },
    requires: ['A14-1'],
    speakers: [TELEMACHUS, ANTINOUS, PENELOPE, MENTOR, EURYCLEIA],
    steps: [
      {
        id: 'a14-02-s1',
        goal: 'Stand behind Telemachus at the assembly.',
        hint: 'Follow him to the meeting-place and stand behind his father’s seat.',
        check: 'talk:a14-telemachus:assembly',
        scene: {
          id: 'a14-02-assembly',
          lines: [
            N('At dawn the heralds call the men of Ithaca to the meeting-place. Nobody has called them since Odysseus sailed.'),
            N('Telemachus comes in with a spear in his hand and two hounds at his heels. The old men make room for him in his father’s seat.'),
            N('You stand behind the seat with your Nubbin. The suitors sit in a row along the front, and grin.'),
            T('No army is coming. I called you for my own trouble. My father is lost, and my house is being eaten.', 'angry'),
            T('Go home, all of you, and eat your own dinners. Aren’t you ashamed? The gods see a house treated like this.', 'angry'),
            N('He throws the speaker’s staff down on the ground, and his eyes are full of tears. For a moment nobody says anything.'),
            N('Then someone in the front row laughs, and the rest of the row joins in.'),
          ],
          choices: [
            {
              id: 'staff',
              label: 'Pick up the staff and hand it back to him.',
              then: [N('You pick up the staff and give it back to him. He takes it without looking at you, and holds it like a rope.')],
            },
            {
              id: 'stare',
              label: 'Stare at the one who laughed first.',
              then: [N('You look straight at him. He stops laughing, remembers he’s a suitor, and starts again, a bit louder.')],
            },
            {
              id: 'stay',
              label: 'Stay where you are, right behind him.',
              then: [N('You don’t move. Telemachus feels it, and his back straightens a little against the noise.')],
            },
          ],
        },
        done: {
          id: 'a14-02-assembly-done',
          lines: [
            N('A tall man in a bright cloak stands up from the front row: Antinous, the loudest of the suitors.'),
            AN('Blame us? Blame your mother. She’s the cleverest woman in Greece, and she’s led us on for years.', 'angry'),
          ],
        },
      },
      {
        id: 'a14-02-s2',
        goal: 'Listen to Antinous tell the story of the web.',
        hint: 'Stay by Telemachus while Antinous speaks.',
        check: 'watch:a14-antinous:assembly',
        scene: {
          id: 'a14-02-antinous',
          lines: [
            AN('Three years she promised, and three years we waited. Shall I tell you how she did it? Everyone else knows.'),
            AN(LIFT_FRAME),
            AN('“It’s a shroud for old Laertes,” she said. “Wait till it’s done, or the women will say he died with nothing to be wrapped in.”'),
            AN('Reasonable. We’re reasonable men. We waited.'),
            N('As he talks, the edges of the meeting-place go soft, as if the page were listening too.'),
            N('The stone turns to floorboards, and the daylight to torchlight. You are in an upstairs room, holding a torch, and you don’t remember picking it up.'),
          ],
        },
        done: {
          id: 'a14-02-antinous-done',
          lines: [N('In front of you stands the great loom. Penelope sits at it, alone, with a small knife.')],
        },
      },
      {
        id: 'a14-02-s3',
        goal: 'Hold the torch while Penelope works.',
        hint: 'Keep the torch high and steady by the loom.',
        check: 'carry:a14-torch:loom',
        scene: {
          id: 'a14-02-loom',
          lines: [
            AN(LIFT_UNPICK),
            N('Penelope pulls a thread, and a day’s work comes undone in one long, soft sigh. She winds it back on the shuttle for tomorrow.'),
            PE('Hold it a little higher. There. Thank you.', 'soft'),
            PE('Every row I weave is one more day he has to come home. Every row I take out gives the day back.'),
            PE('The long threads stand still and wait. The short one goes back and forth, back and forth. I know which one I am.', 'think'),
            N('Your Nubbin holds the loose end of the thread so it doesn’t tangle. It is very serious about this.'),
            PE('They think I’m slow. I’m the fastest weaver on Ithaca. I have to be, to unpick it all by dawn.', 'think'),
            N('Out in the dark passage, a floorboard creaks. Someone has been listening at the door.'),
          ],
          choices: [
            {
              id: 'look',
              label: 'Go and look in the passage.',
              then: [N('You look, and a maid’s skirt whisks round the corner and is gone. You know where she’s going.')],
            },
            {
              id: 'tell',
              label: 'Tell Penelope someone heard.',
              then: [PE('I know. I’ve known for a week which one it would be. I thought I’d finish tonight’s row anyway.', 'sad')],
            },
            {
              id: 'steady',
              label: 'Hold the torch steady. Keep going.',
              then: [N('You keep the torch steady, and she keeps going. Neither of you looks at the door.')],
            },
          ],
        },
        done: {
          id: 'a14-02-loom-done',
          lines: [
            N('The torchlight goes thin, and it is daylight again. You are standing in the meeting-place with empty hands.'),
            AN('A maid told us. We caught her at it, so she had to finish the thing.', 'angry'),
            AN('Send your mother back to her father’s house, boy, and let him marry her off. Until then, we eat.'),
          ],
        },
      },
    ],
    complete: {
      id: 'a14-02-complete',
      lines: [
        N('The assembly breaks up, and nobody helps Telemachus. One old man, Mentor, tries to, and is shouted down.'),
        N('That evening at the shore, Mentor finds him again: or someone with Mentor’s face, who walks too lightly for an old man.'),
        MR('A ship, and twenty to row it. I have found both. Fetch food for the voyage, and tell no one.'),
        N('Eurycleia fills twelve jars of wine and twenty measures of barley-meal, crying the whole time.'),
        EU('Your father went over the sea and never came back. Now you. Who will I have left to scold?', 'sad'),
        T('Don’t tell my mother. Not for eleven or twelve days, unless she asks.', 'soft'),
        N('At nightfall the ship slides out of the harbour. You sit in the stern with your Nubbin, and a wind comes up behind you from nowhere.'),
        N('Mentor sits by the steering oar and looks up at the sail. The wind is exactly as strong as it needs to be.'),
      ],
    },
    rewards: [],
    sets: { 'a14-02': true },
    childLines: {
      'a14-02-antinous#1': 'She put up a great wooden frame in her room, and started weaving the biggest, finest cloth anyone had ever seen.',
      'a14-02-loom#0': 'Every day we watched her weave, and every night, by the light of a torch, she took the stitches out again.',
    },
    notes:
      'LIFTED TEXT: a14-02-antinous#1 and a14-02-loom#0 (Butler, Book II; see the header). loom#0 is Antinous’s ' +
      'voice-over at the start of the torch scene: he is not in the room, so show him as a voice only. The torch scene ' +
      'is the first time the atlas lets you into a story someone is telling: the meeting-place softens and the room ' +
      'fades in (two seconds), then fades back for the done scene. The maid who tells is never named and is not ' +
      'punished, here or later. Mentor in the complete scene is Athena in disguise (Book II); play it straight.',
  },

  // ---------------------------------------------------------------- A14-3
  {
    id: 'a14-03',
    code: 'A14-3',
    title: 'Nestor and Menelaus',
    source: `${ODY}, Books III–IV: Pylos and Sparta`,
    audience: 'all',
    trigger: { where: WHERE, when: after('A14-2') },
    requires: ['A14-2'],
    speakers: [TELEMACHUS, MENTOR, NESTOR, MENELAUS, HELEN],
    steps: [
      {
        id: 'a14-03-s1',
        goal: 'Land at Pylos and ask old Nestor for news.',
        hint: 'Walk up the beach to the feast and sit where you’re put.',
        check: 'visit:a14-pylos:shore',
        scene: {
          id: 'a14-03-pylos',
          lines: [
            N('Sandy Pylos, at sunrise. The whole town is on the beach, at a great feast in honour of Poseidon, god of the sea.'),
            T('I can’t. I don’t know how to talk to an old king. What if I get it wrong?', 'sad'),
            MR('Some of it you’ll think of yourself. The rest will be given you. Go on.', 'soft'),
            N('Nestor’s son runs to meet the strangers before anyone asks who they are, and sits you all on soft fleeces on the sand.'),
            N('Nestor is so old that he was old at Troy. He has outlived nearly everyone he went there with.'),
            NE('Eat first. Then names. Then, if you like, sorrows. There’s always time for sorrows.', 'soft'),
            T('I’m Odysseus’s son. I’ve come for news of my father. Any news, even bad.'),
            NE('His son! You talk just like him. I’d never have thought a young man could sound so like him.', 'shock'),
            NE('But I know nothing, child. We left Troy together, and quarrelled, and parted at sea. He turned back. I came home.', 'sad'),
          ],
          choices: [
            {
              id: 'who',
              label: 'Ask who might know.',
              then: [NE('Menelaus. He was blown about longer than any of us, and came home last. Go to Sparta. My son will drive you.')],
            },
            {
              id: 'hope',
              label: 'Ask if there’s any hope.',
              then: [NE('With that one? There’s always hope. I never once saw him stuck for long.', 'think')],
            },
            {
              id: 'nubbin',
              label: 'Let your Nubbin sit by the old king.',
              then: [N('Your Nubbin climbs onto the fleece beside Nestor. He rests an old hand on it, as if it were a grandchild, and goes on talking.')],
            },
          ],
        },
        done: {
          id: 'a14-03-pylos-done',
          lines: [
            N('When the feast is over, Mentor rises, and is a sea-eagle, and is gone over the water. Everyone on the beach falls silent.'),
            NE('That was Athena, daughter of Zeus. She stood by your father at Troy. If she walks beside you, you won’t go far wrong.', 'soft'),
            N('Nestor’s people honour her on the shore in the old way. You stand back with your Nubbin and keep quiet, as guests should.'),
          ],
        },
      },
      {
        id: 'a14-03-s2',
        goal: 'Ride to Sparta with Nestor’s son.',
        hint: 'Climb into the chariot behind Telemachus.',
        check: 'escort:a14-telemachus:sparta',
        scene: {
          id: 'a14-03-sparta',
          lines: [
            N('Two days in a chariot over the hills, with Nestor’s son Pisistratus at the reins. Your Nubbin rides up front and leans into the corners.'),
            N('Sparta lies in a hollow among the hills. Menelaus’s house gleams with bronze and gold, amber and silver and ivory.'),
            T('Pisistratus, look at it. Is this what the house of Zeus is like?', 'shock'),
            ME('No mortal’s house is like Zeus’s, boy. And I’d give two-thirds of this to have back the friends who died at Troy.', 'sad'),
            N('He hasn’t asked your names. In Sparta, as in Pylos, a guest is fed first and asked after.'),
            N('Then a woman comes down from a high room with her spindle, and stops, and stares at Telemachus.'),
            HE('I have never seen anyone so like another. This must be Odysseus’s son. He has his father’s feet. His hands.', 'shock'),
            ME('Now that you say it… The hair, the look about the eyes. You’re right, my dear.', 'soft'),
            N('Telemachus holds his cloak up in front of his face. Everyone weeps a little, even Pisistratus, who never met Odysseus at all.'),
          ],
          choices: [
            {
              id: 'yes',
              label: 'Tell them yes, it’s his son.',
              then: [N('You say it for him, because he can’t. Menelaus reaches across the table and grips Telemachus by the arm.')],
            },
            {
              id: 'wait',
              label: 'Let Telemachus answer.',
              then: [T('I am. I’ve come to ask whether my father is alive.', 'soft')],
            },
          ],
        },
        done: {
          id: 'a14-03-sparta-done',
          lines: [ME('Sit. Eat. In the morning I’ll tell you something I’ve told nobody since I came home.')],
        },
      },
      {
        id: 'a14-03-s3',
        goal: 'Hear what the Old Man of the Sea told Menelaus.',
        hint: 'Sit with Menelaus by the fire in the morning.',
        check: 'talk:a14-menelaus:proteus',
        scene: {
          id: 'a14-03-proteus',
          lines: [
            ME('Coming home from Troy, I was stuck twenty days on an island called Pharos. No wind, and the food running out.'),
            ME('A goddess of the sea took pity on us. “Catch my father, Proteus, the Old Man of the Sea,” she said. “He knows everything.”'),
            ME('At noon he comes up out of the waves to sleep among his seals. You must catch him, and hold on, whatever he turns into.'),
            N('As he tells it, the hall smells of seals. You are lying under a sealskin on a hot beach, with Menelaus and three of his men.'),
            N('An old man comes up out of the sea, counts his seals, counts you among them, and lies down to sleep.'),
            ME('Now!'),
            N('He is a lion in your arms, then a snake, a leopard, a boar; then running water, then a tall tree. Your Nubbin holds on to one leg throughout.'),
            N('At last he is an old man again, and tired, and he answers.'),
            ME('Odysseus is on an island, in the house of the nymph Calypso, Proteus said. She keeps him there. He has no ship, and no crew to row one.', 'soft'),
          ],
          choices: [
            {
              id: 'alive',
              label: 'Ask Menelaus: alive?',
              then: [ME('Alive. Weeping, Proteus said. But alive.', 'soft')],
            },
            {
              id: 'look',
              label: 'Look at Telemachus.',
              then: [N('Telemachus is very still. Then he stands up, as if he means to swim there.')],
            },
          ],
        },
        done: {
          id: 'a14-03-proteus-done',
          lines: [
            T('Alive. He’s alive. Then I have to go home, now, and tell her.', 'happy'),
            ME('Stay eleven or twelve days! No? Then take a gift: a silver mixing-bowl with a rim of gold. A guest goes home with something.'),
          ],
        },
      },
    ],
    complete: {
      id: 'a14-03-complete',
      lines: [
        N('You ride back to Pylos and the ship. Behind you, Helen watches from the gate until the chariot is out of sight.'),
        N('On Ithaca the suitors have found out he’s gone. Antinous takes a fast ship and twenty men, to wait for him among the rocks.'),
        N('Telemachus doesn’t know that yet. He stands in the bow all the way, as if that will get him home sooner.'),
        N('Then Nova’s atlas turns its own page, the way a wind turns one, and you are somewhere else entirely.'),
      ],
    },
    rewards: [],
    sets: { 'a14-03': true },
    notes:
      'GODS: the feast for Poseidon at Pylos (Book III) is shown as a crowd on the beach at a feast, with no sacrifice on ' +
      'screen; the player only watches and is never asked to take part. Mentor’s departure is a sea-eagle, as in Homer, ' +
      'and Nestor names her: keep the beat grave. The Proteus story is a second told-story scene (Menelaus tells it; you ' +
      'are in it), staged like A14-2’s torch scene. The ambush line in the complete scene is paid off in A14-15 ' +
      '(Telemachus comes home another way). The page turn at the end is the hand-off to Odysseus’s own story.',
  },

  // ---------------------------------------------------------------- A14-4
  {
    id: 'a14-04',
    code: 'A14-4',
    title: 'Calypso’s Island',
    source: `${ODY}, Book V: Hermes on Ogygia; the raft`,
    audience: 'all',
    trigger: { where: WHERE, when: after('A14-3') },
    requires: ['A14-3'],
    speakers: [HERMES, CALYPSO, ODYSSEUS],
    steps: [
      {
        id: 'a14-04-s1',
        goal: 'Walk with the messenger to Calypso’s cave.',
        hint: 'Follow the young man with the gold sandals up from the beach.',
        check: 'explore:a14-ogygia:cave',
        scene: {
          id: 'a14-04-ogygia',
          lines: [
            N('An island at the navel of the sea, far from anywhere. Alder and poplar and sweet-smelling cypress, with owls and sea-crows nesting in them.'),
            N('A vine heavy with grapes grows over the mouth of a cave. Four springs run out across meadows of violets and wild parsley.'),
            N('Someone lands on the beach beside you as lightly as a gull: a young man with golden sandals and a wand.'),
            HM('You’re far from your own country, guest. So am I, and I don’t love all this salt water. Walk with me.'),
            N('In the cave a cedar fire is burning, and a woman is weaving at a loom with a golden shuttle, and singing. She knows Hermes at once.'),
            CA('Hermes. You don’t often come. Tell me what you want, and then let me give you dinner.'),
            N('She sets the food of the gods in front of him, ambrosia and red nectar. You are given bread and figs, which is food for people.'),
            HM('Zeus sends word. The man who is with you must go home. It is not his fate to die here, far from his own people.'),
            CA('You gods are hard. Whenever one of us loves a mortal, you begrudge it.', 'angry'),
            CA('I found him clinging to a keel. I fed him. I told him I would make him never die and never grow old.', 'sad'),
            CA('But nobody goes against the will of Zeus. Let him go, then, over the sea, if that is what he wants.', 'sad'),
          ],
          choices: [
            {
              id: 'thank',
              label: 'Thank Calypso for the figs.',
              then: [CA('You’re welcome, little guest. You, at least, will go home glad.', 'soft')],
            },
            {
              id: 'where',
              label: 'Ask Hermes where Odysseus is.',
              then: [HM('On the shore. He is always on the shore.', 'soft')],
            },
          ],
        },
        done: {
          id: 'a14-04-ogygia-done',
          lines: [N('Hermes goes away over the sea the way he came. Calypso puts down her shuttle and goes to find Odysseus.')],
        },
      },
      {
        id: 'a14-04-s2',
        goal: 'Find Odysseus on the shore.',
        hint: 'Go down to the rocks above the beach.',
        check: 'find:a14-odysseus:shore',
        scene: {
          id: 'a14-04-shore',
          lines: [
            N('He is sitting on a rock above the beach, looking at the sea, and crying. Not loudly: the way people cry who have been at it for years.'),
            N('He is broad, grey at the temples, in a beautiful cloak that somebody else gave him.'),
            O('Another guest. She’s had none in seven years but me. Sit, if you like. The rock is wide.', 'sad'),
            O('Every morning I come here. Every night I go back to her, because there’s nowhere else to go.', 'sad'),
            O('Ithaca is rough. Goats, mostly. I’d give anything to see the smoke going up from its houses, just once.', 'soft'),
            N('Your Nubbin sits down on the rock beside him and looks at the sea too, in case there is something out there.'),
          ],
          choices: [
            {
              id: 'sit',
              label: 'Sit with him and say nothing.',
              then: [
                N('You sit, and the sea goes in and out. After a while he wipes his face on the beautiful cloak.'),
                O('Thank you. Nobody does that.', 'soft'),
              ],
            },
            {
              id: 'home',
              label: 'Ask him about home.',
              then: [O('My son was a baby. He’ll be a man. My father will be old. My mother, I hope, is well.', 'soft')],
            },
            {
              id: 'son',
              label: 'Tell him you’ve met his son.',
              then: [O('My son? You’ve seen him? How… No. Don’t tell me how. Is he tall? He’d be tall.', 'shock')],
            },
          ],
        },
        done: {
          id: 'a14-04-shore-done',
          lines: [
            N('Calypso comes down the beach. She stands beside him, and doesn’t touch him.'),
            CA('Don’t cry any more. I’ll let you go. Cut trees and build a raft, and I’ll give you bread and water and a fair wind.', 'sad'),
            O('Swear it. Swear you aren’t planning some harm.', 'think'),
            CA('By the earth, and the sky, and the water of the Styx. My heart isn’t iron. I’m sorry for you.', 'soft'),
          ],
        },
      },
      {
        id: 'a14-04-s3',
        goal: 'Help him build the raft.',
        hint: 'Carry the drills and pegs to the shore where he works.',
        check: 'build:a14-raft:shore',
        scene: {
          id: 'a14-04-raft',
          lines: [
            N('She gives him a bronze axe with an olive-wood handle, and an adze, and shows him where the tallest dry trees grow.'),
            N('He fells twenty trees and trims them true to a line. You carry the drills; your Nubbin carries the pegs, one at a time, very proudly.'),
            N('He works four days: a deck, a mast and yard, a steering oar, a fence of willow against the waves. Calypso brings cloth for the sail.'),
            N('On the last night she sets supper in front of him, takes nectar herself, and sits across the fire.'),
            CA('So you’re going. If you knew all that’s waiting out there, you’d stay.'),
            CA('Stay, and you’ll never die. You’ll never grow old. Nothing will ever happen to you again.', 'soft'),
            CA('Is she lovelier than me? She can’t be. A mortal woman can’t compare with a goddess.'),
            O('No, she can’t. She’s smaller, and older, and she will die one day, and so will I.', 'soft'),
            O('And I want to go home. I want it every day. If a god wrecks me on the way, I’ll bear it. I’ve borne worse.'),
            N('Calypso doesn’t argue. Then he looks across the fire at you, as if he wants a witness.'),
            O('Tell me honestly, guest. Would you stay?'),
          ],
          choices: [
            {
              id: 'home',
              label: '“No. Home.”',
              then: [O('Home. Yes. The word does all the work, doesn’t it.', 'soft')],
            },
            {
              id: 'unsure',
              label: '“I don’t know.”',
              then: [O('Good answer. It’s only easy once you’ve lost something.', 'think')],
            },
            {
              id: 'happen',
              label: '“Not if nothing would ever happen again.”',
              then: [O('That’s it. That’s exactly it. She’d keep me safe for ever. Safe isn’t the same as alive.', 'think')],
            },
          ],
        },
        done: {
          id: 'a14-04-raft-done',
          lines: [
            N('On the fifth day he sails. He steers by the stars all night, keeping the Bear on his left hand, as Calypso told him.'),
            N('You sit on the deck with your back against the mast. Your Nubbin watches the island go small, and then go.'),
          ],
        },
      },
    ],
    complete: {
      id: 'a14-04-complete',
      lines: [
        N('Calypso stands on the beach until he is out of sight. Then she goes back into her cave, to her loom.'),
        N('She is weaving something. You don’t see what, and perhaps she doesn’t know yet either.'),
        N('Seventeen days of wind in the sail. On the eighteenth, the shadowy hills of a new land rise out of the sea like a shield laid on the water.'),
        O('Land. Do you see? Whose, I don’t know. But land.', 'happy'),
      ],
    },
    rewards: [],
    sets: { 'a14-04': true },
    notes:
      'GODS: Hermes and Calypso speak as Homer has them (Book V): grave, a little weary, never comic. Calypso’s ' +
      'complaint against the gods is hers in the poem; keep its weight. The player never addresses a god except to ' +
      'thank Calypso as a host. THEME: Calypso’s offer is the line’s "safe is not the same as well" (Moss’s saying is ' +
      'echoed in the "happen" answer and never quoted). Ambrosia and nectar are drawn as a golden dish and a red cup; ' +
      'your plate is plainly ordinary food.',
  },

  // ---------------------------------------------------------------- A14-5
  {
    id: 'a14-05',
    code: 'A14-5',
    title: 'The Raft',
    source: `${ODY}, Book V: Poseidon’s storm; Ino’s veil; Scheria`,
    audience: 'all',
    trigger: { where: WHERE, when: after('A14-4') },
    requires: ['A14-4'],
    speakers: [ODYSSEUS, INO],
    steps: [
      {
        id: 'a14-05-s1',
        goal: 'Hold on through the storm.',
        hint: 'Keep hold of your plank and keep your Nubbin on your head.',
        check: 'watch:a14-storm:raft',
        scene: {
          id: 'a14-05-storm',
          lines: [
            N('Far off, coming home from the edge of the world, Poseidon, the god who shakes the earth, sees the little raft on his sea.'),
            N('He knows the man on it. He has an old anger against him, for a reason you haven’t heard yet.'),
            N('He gathers the clouds, and every wind comes at once. Night comes down out of the sky in the middle of the day.'),
            O('Three and four times lucky, the ones who fell at Troy with their friends round them. Out here there’s nobody.', 'sad'),
            N('A wave as big as a house hits the raft. The mast snaps, and Odysseus goes under, and comes up, and climbs back on.'),
            N('You are holding a plank with both arms. Your Nubbin sits on your head, holding on to your hair, and neither of you lets go.'),
            N('Then a white sea-bird comes skimming through the spray, and lands on the raft, and is a woman.'),
            IN('Poor man. Why is Poseidon so angry with you? He won’t drown you, though he’d like to. Listen to me.'),
            IN('Take off those heavy clothes. Leave the raft to the winds, and swim for the land of the Phaeacians.'),
            IN('Here, tie my veil round your chest. While you wear it, you won’t drown.'),
            IN('When you reach land, untie it and throw it back into the sea. And turn your face away as you throw.'),
            N('She is a bird again, and gone into the dark water. Odysseus holds the veil and looks at it with deep suspicion.'),
            O('Another god’s trick? I’ll stay on the raft while it holds. Then I’ll swim.', 'think'),
          ],
          choices: [
            {
              id: 'trust',
              label: '“She meant it. Take it.”',
              then: [O('Perhaps. I’ve been tricked by kinder faces. I’ll take it, and still hold on to the raft.')],
            },
            {
              id: 'hold',
              label: 'Hold on, and say nothing.',
              then: [N('You hold on, and your Nubbin holds on. The raft holds on too, for now.')],
            },
            {
              id: 'knot',
              label: 'Help him tie the veil.',
              then: [N('Your fingers are numb, but you get the knot tied. He nods once, with water running off his beard.')],
            },
          ],
        },
        done: {
          id: 'a14-05-storm-done',
          lines: [
            N('The biggest wave of all. The raft goes to pieces like a heap of straw in a wind, and he climbs onto one beam as if it were a horse.'),
            N('He strips off his cloak, ties the veil round his chest, and dives in. You let go of your plank and follow.'),
          ],
        },
      },
      {
        id: 'a14-05-s2',
        goal: 'Swim for the shore.',
        hint: 'Stay outside the surf and swim along the coast to the river mouth.',
        check: 'swim:a14-scheria:coast',
        scene: {
          id: 'a14-05-swim',
          lines: [
            N('Two days and two nights in the swell. On the third morning the wind drops, a wave lifts you, and there is land, close.'),
            O('Land! I could cry. I have been crying. I could cry more.', 'happy'),
            N('But the shore is all cliff and reef, and the surf roars against it. A wave throws him onto a rock, and he holds on, and loses skin to it.'),
            N('He swims out again and along the coast, outside the surf, looking for a way in. Athena put that thought in his head, he says later.'),
            N('There: the mouth of a river, clear of rocks and out of the wind.'),
            N('He speaks to the river as a guest speaks at the door of a lord’s house. The current stills, and lets him in.'),
            N('He crawls up the bank into the reeds and kisses the ground. Your Nubbin lies down beside him, flat as a dropped mitten.'),
          ],
        },
        done: {
          id: 'a14-05-swim-done',
          lines: [
            N('When his breath comes back he unties the veil and throws it into the river, and turns his face away. The water carries it back to the sea.'),
            N('You don’t look either. It seems the right thing.'),
          ],
        },
      },
      {
        id: 'a14-05-s3',
        goal: 'Find somewhere dry to sleep.',
        hint: 'Climb the bank to the two olive bushes that grow from one root.',
        check: 'sit:a14-olives:bank',
        scene: {
          id: 'a14-05-olives',
          lines: [
            O('If I sleep by the river, the cold will finish me. If I go up into the woods, the wild animals might. I’ll risk the woods.', 'think'),
            N('Just above the bank, two olive bushes grow from one root, one wild and one tame, so close that no rain or wind or sun gets in.'),
            N('Underneath, the dead leaves lie deep enough to cover two or three people in winter. Odysseus is glad to see them.'),
            N('He lies down in the middle and heaps leaves over himself, the way a farmer far from neighbours buries an ember in the ashes to keep it alive.'),
            N('There is room for you, and for your Nubbin, which burrows down until only its ears show.'),
            O('Two olives from one root. My wife would say that meant something. Goodnight, guest.', 'soft'),
          ],
          choices: [
            {
              id: 'watch',
              label: 'Keep watch for a while.',
              then: [N('You keep watch. Nothing comes but an owl, which looks at your Nubbin’s ears and decides against it.')],
            },
            {
              id: 'leaves',
              label: 'Pile more leaves over him.',
              then: [N('You heap them up to his chin, but he’s already asleep. In his sleep he says a name, and it isn’t Calypso’s.')],
            },
            {
              id: 'sleep',
              label: 'Sleep.',
              then: [N('You sleep. It’s the first sleep anyone has had in three days.')],
            },
          ],
        },
      },
    ],
    complete: {
      id: 'a14-05-complete',
      lines: [
        N('Athena pours sleep over his eyes, to rest him from all his labour.'),
        N('Up the hill there is a walled town, and a palace, and in the palace a girl is having a dream about washing.'),
        N('It isn’t her own idea. It hardly ever is, with dreams.'),
        N('Your Nubbin, in the leaves, sneezes once and goes back to sleep.'),
      ],
    },
    rewards: [],
    sets: { 'a14-05': true },
    notes:
      'GODS: Poseidon is never seen close and never speaks: a vast darkening of the sky and sea, with dignity, no face. ' +
      'Ino (Leucothea) speaks as in Book V. Odysseus’s words to the river are his own and brief; the player only ' +
      'watches. SAFETY: you are never in danger longer than a line: you hold a plank, your Nubbin rides on your head, ' +
      'and the swim is a calm, steady minigame-free stroke across the screen (no fail state). The olive bushes from ' +
      'one root are a deliberate rhyme with A14-20’s olive bed: draw them so the player might notice.',
  },

  // ---------------------------------------------------------------- A14-6
  {
    id: 'a14-06',
    code: 'A14-6',
    title: 'Nausicaa',
    source: `${ODY}, Book VI: Nausicaa at the river`,
    audience: 'all',
    trigger: { where: WHERE, when: after('A14-5') },
    requires: ['A14-5'],
    speakers: [NAUSICAA, ODYSSEUS],
    steps: [
      {
        id: 'a14-06-s1',
        goal: 'Help with the washing at the river.',
        hint: 'Carry the clothes from the cart to the washing-pools.',
        check: 'carry:a14-washing:river',
        scene: {
          id: 'a14-06-river',
          lines: [
            N('Morning. Down the road comes a mule-cart piled with clothes, a girl on top holding the reins, and a crowd of maids walking beside it.'),
            NA('Last night I dreamt my friend came and scolded me. “You could be married any day, and all your clothes are dirty.” So.', 'happy'),
            N('She looks at you, a stranger standing by her river. She seems to decide that strangers are allowed at rivers.'),
            NA('You can help, if you like. We tread the clothes in the pools. It’s a race. The maids always win.'),
            N('You tread the clothes with them. Your Nubbin treads too, in a smaller pool, and is very nearly washed.'),
            N('The clothes are spread on the clean pebbles to dry. The girls eat their lunch on the bank, take off their veils, and play ball.'),
            NA('Catch!'),
          ],
          choices: [
            {
              id: 'catch',
              label: 'Catch it.',
              then: [N('You catch it and throw it back, and she laughs. She is the tallest of them and the best at the game, and knows it.')],
            },
            {
              id: 'nubbin',
              label: 'Let your Nubbin catch it.',
              then: [N('Your Nubbin catches it with its whole body and falls over backwards. It counts.')],
            },
            {
              id: 'drop',
              label: 'Drop it, on purpose.',
              then: [N('You drop it, and everyone shrieks, delighted. Being bad at ball is very popular here.')],
            },
          ],
        },
        done: {
          id: 'a14-06-river-done',
          lines: [
            N('Nausicaa throws the ball to a maid, misses, and it lands in the deep water. Every girl screams at once.'),
            N('Up in the olive bushes, the leaves stir, and something gets up.'),
          ],
        },
      },
      {
        id: 'a14-06-s2',
        goal: 'Stand by Nausicaa as the stranger comes out.',
        hint: 'Don’t run. Stay by the princess.',
        check: 'watch:a14-odysseus:bushes',
        scene: {
          id: 'a14-06-bushes',
          lines: [
            N('A man comes out of the bushes, crusted with salt, holding a leafy branch in front of him because he has nothing else.'),
            N('He looks like a mountain lion coming out of the rain. The maids scatter along the shore.'),
            N('Nausicaa doesn’t run: Athena has put courage into her. She stands and waits, with the ball still in her hand.'),
            O('Lady, are you a goddess, or one of us? If a goddess, you’re Artemis, by your height. If mortal, your parents are lucky people.', 'soft'),
            O('Once, at Delos, I saw a young palm tree growing by Apollo’s altar. I stood and looked at it a long time. You remind me of it.'),
            O('I’ve been twenty days on the sea. Show me the town, and give me a rag to wear, and may the gods give you all your heart’s wish.', 'soft'),
            N('He doesn’t come any closer. He stays exactly where he is, and asks from there.'),
          ],
          choices: [
            {
              id: 'vouch',
              label: 'Tell her he’s a good man.',
              then: [NA('You know him? Then he’s welcome. My father says every stranger at our door is sent by Zeus.')],
            },
            {
              id: 'cloak',
              label: 'Pick up a clean cloak and hold it out.',
              then: [N('You hold out a cloak from the drying stones. He takes it and bows to you, as if you had given him a kingdom.')],
            },
            {
              id: 'wait',
              label: 'Stay back. It’s her choice.',
              then: [NA('You don’t look like a bad man. You look like a man who’s had bad luck.', 'think')],
            },
          ],
        },
        done: {
          id: 'a14-06-bushes-done',
          lines: [
            NA('Come back, all of you! Since when do we run from a man in trouble? Give him oil, and clothes, and something to eat.'),
            N('He washes the salt off in the river, away from everyone. When he comes back up the bank he looks taller and younger, and the maids stare.'),
          ],
        },
      },
      {
        id: 'a14-06-s3',
        goal: 'Follow the cart towards the town.',
        hint: 'Walk with the maids behind the cart, and stop at Athena’s grove.',
        check: 'escort:a14-odysseus:town',
        scene: {
          id: 'a14-06-road',
          lines: [
            NA('Listen. Walk with the maids behind the cart as far as the town fields. Then wait in Athena’s grove, outside the walls.'),
            NA('If people see me come home with a man like you, they’ll talk all winter. Give me time to get home first.'),
            NA('Then ask anyone for the palace of Alcinous. Even a child could show you.'),
            NA('Go past my father. Go straight to my mother. She’ll be sitting by the fire, spinning purple wool. Kneel to her.', 'think'),
            NA('If she likes you, you’ll get home. Don’t ask me why it works like that. It just does.', 'happy'),
            N('Odysseus listens like a man taking notes. He has plainly been given directions before, and lost ships ignoring them.'),
          ],
        },
        done: {
          id: 'a14-06-road-done',
          lines: [N('You wait in the poplar grove with him until sunset. He speaks quietly there to Athena, alone, and you walk off a little to give him room.')],
        },
      },
    ],
    complete: {
      id: 'a14-06-complete',
      lines: [
        N('You go up into the town after dark. High walls, a harbour full of ships, and everyone you pass looks at you, and keeps walking.'),
        N('A girl with a water-jar shows you the way to the palace without being asked. She has grey eyes, and walks very lightly.'),
        N('Odysseus thanks her. When he looks back, the lane is empty.'),
        O('She has been with me since Troy. And sometimes, for years, she hasn’t. I don’t ask why.', 'soft'),
      ],
    },
    rewards: [],
    sets: { 'a14-06': true },
    notes:
      'Nausicaa is a young woman doing a day’s washing; keep her bright, practical and brave, never a love interest. ' +
      'Odysseus’s nakedness (Book VI) is handled by the leafy branch and then the cloak: never shown. Athena’s dream ' +
      'to Nausicaa is told, not seen. The girl with the water-jar is Athena (Book VII); she is not named, and the ' +
      'beat is quiet.',
  },

  // ---------------------------------------------------------------- A14-7
  {
    id: 'a14-07',
    code: 'A14-7',
    title: 'The Phaeacian Hall',
    source: `${ODY}, Books VII–IX: Alcinous and Arete; Demodocus; "I am Odysseus"`,
    audience: 'all',
    trigger: { where: WHERE, when: after('A14-6') },
    requires: ['A14-6'],
    speakers: [ODYSSEUS, ALCINOUS, ARETE],
    steps: [
      {
        id: 'a14-07-s1',
        goal: 'Go into the king’s hall with him.',
        hint: 'Walk between the gold and silver dogs and in through the doors.',
        check: 'visit:a14-alcinous:hall',
        scene: {
          id: 'a14-07-hall',
          lines: [
            N('Walls of bronze with a blue band along the top, and doors of gold. On either side of the door sit dogs of gold and silver.'),
            N('A god made those dogs, so that they would never grow old and never die. They watch you go in.'),
            N('Behind the house is an orchard where the fruit never stops: pears and figs ripen while the next ones are still in flower.'),
            N('Odysseus walks through the hall wrapped in a mist that hides him. Nobody sees him until he is on his knees before the queen.'),
            O('Arete, queen. I’ve come through great hardship to your knees, and your husband’s. Help me home. I’ve been so long away.', 'sad'),
            N('Then he sits down in the ashes by the hearth. The whole hall goes silent.'),
            N('At last an old lord clears his throat and says what everyone is thinking: a stranger in the ashes is not right.'),
            AL('He’s right. Up, friend. Here, take my son’s chair, beside me. Bring water for his hands. Bring him dinner.', 'soft'),
          ],
        },
        done: {
          id: 'a14-07-hall-done',
          lines: [
            AR('Stranger. Who are you? Where did you get those clothes? I know them. I made them.', 'think'),
            O('Your daughter gave them to me. Don’t blame her for not bringing me home herself. Coming alone was my idea.'),
            N('It wasn’t his idea. You open your mouth, and close it again, and Arete sees you do it, and very nearly smiles.'),
          ],
        },
      },
      {
        id: 'a14-07-s2',
        goal: 'Sit at the feast and hear the bard.',
        hint: 'Sit on the bench beside Odysseus when the bard is led in.',
        check: 'sit:a14-feast:demodocus',
        scene: {
          id: 'a14-07-bard',
          lines: [
            N('Next day there are games, and dancing, and a feast. The herald leads in the bard Demodocus, who is blind, and whom the Muse loves.'),
            N('They hang his lyre on a peg above his head, and guide his hand to it, so he can find it.'),
            N('He sings of Troy: of a quarrel between two great captains, and the long war. The Phaeacians love it; they have never been to a war.'),
            N('Odysseus draws his purple cloak up over his head to hide his face, so they won’t see him crying. Only the king notices.'),
            N('Later, Odysseus cuts the best piece of his own meat and sends it to the bard by the herald.'),
            O('Sing the horse. The wooden horse. Sing it as it was, and I’ll tell everyone a god gave you your song.'),
            N('Demodocus sings it. The page lets you hear only the shape of it, a long rise and fall, and you are glad.'),
            N('Odysseus weeps as a woman weeps over her husband who fell defending his town. Nobody but the king sees.'),
          ],
          choices: [
            {
              id: 'hide',
              label: 'Sit closer, so he’s hidden on your side.',
              then: [N('You shift along the bench so that from your side nobody can see his face. He leans, very slightly, against your shoulder.')],
            },
            {
              id: 'nubbin',
              label: 'Let your Nubbin climb into his lap.',
              then: [N('Your Nubbin climbs into his lap and sits there, under the cloak. He puts a hand on it and leaves it there.')],
            },
            {
              id: 'listen',
              label: 'Listen to the bard.',
              then: [N('You listen. Once, Demodocus’s blind face turns towards Odysseus, as if he can hear more than the music.')],
            },
          ],
        },
        done: {
          id: 'a14-07-bard-done',
          lines: [
            AL('Stop the song, Demodocus. Not everyone is enjoying it.'),
            AL('Stranger, you’ve wept twice at songs of Troy. Tell us who you are. Nobody is nobody.', 'soft'),
          ],
        },
      },
      {
        id: 'a14-07-s3',
        goal: 'Hear him say his name.',
        hint: 'Stay at the table while the hall waits.',
        check: 'talk:a14-odysseus:name',
        scene: {
          id: 'a14-07-name',
          lines: [
            N('He wipes his face. He looks round the hall at the gold, the lamps, the long tables, and at you.'),
            O('Where do I start? There’s so much of it.', 'think'),
            O('With the name, then. I am Odysseus, son of Laertes. Men know me for my tricks. My fame has gone up as high as heaven, they tell me.'),
            O('I live on Ithaca, an island you can see from a long way off. It’s all rock and goats. It grows good people. Nothing is sweeter to me.'),
            N('The Phaeacians lean in. That name was sung in this hall today, and here is the man.'),
            AL('Odysseus. Here, in my hall. Then tell it. All of it. The night is long, and nobody here is going to sleep.', 'shock'),
            AL('And you, the other guest. You came in with him. Where are you from?'),
          ],
          choices: [
            {
              id: 'grove',
              label: '“A valley called the Grove. It’s small.”',
              then: [AL('Small places make the best guests. They know what it is to be far from home.', 'soft')],
            },
            {
              id: 'gate',
              label: '“Somewhere with a gate that sticks.”',
              then: [O('A gate that sticks. Then whoever’s at home will always hear you coming.', 'think')],
            },
            {
              id: 'later',
              label: '“Let him go first. It’s his story.”',
              then: [AL('Spoken like a good guest. Very well. Odysseus, begin.')],
            },
          ],
        },
      },
    ],
    complete: {
      id: 'a14-07-complete',
      lines: [
        O('I’ll start with the giant. That’s where it all went wrong. And it was my own fault.', 'sad'),
        N('He begins. As he talks the lamps go dim, and the hall goes soft at the edges, the way the meeting-place did.'),
        N('The tables become rocks. The smell of roast meat becomes the smell of sheep: a great many sheep.'),
        N('This is what Nova’s atlas does when someone tells a story on its pages. You go in.'),
        N('Your Nubbin takes hold of the hem of your tunic, the way it does when it isn’t sure about a place.'),
      ],
    },
    rewards: [],
    sets: { 'a14-07': true },
    notes:
      'Demodocus’s songs (the quarrel, the horse) are SUMMARISED ONLY: no song words, no verse. Play them as a lyre ' +
      'melody under the narration, original music, and duck it when lines appear. The gold and silver dogs that never ' +
      'grow old (Book VII) are set up on purpose against Argos in A14-16. The games and Euryalus’s taunt are skipped. ' +
      'From the complete scene to A14-13’s complete scene you are inside Odysseus’s told story; the frame line in ' +
      'a14-13-complete brings you back to the hall.',
  },

  // ---------------------------------------------------------------- A14-8
  {
    id: 'a14-08',
    code: 'A14-8',
    title: 'Nobody',
    source: `${ODY}, Book IX: the Cyclops`,
    audience: 'all',
    trigger: { where: WHERE, when: after('A14-7') },
    requires: ['A14-7'],
    speakers: [ODYSSEUS, CYCLOPS, CYCLOPES, SAILOR],
    steps: [
      {
        id: 'a14-08-s1',
        goal: 'Go into the giant’s cave with Odysseus and his men.',
        hint: 'Climb up to the cave in the cliff above the shore.',
        check: 'explore:a14-cave:cyclops',
        scene: {
          id: 'a14-08-cave',
          lines: [
            N('A wild coast, and a cave high above the sea, with laurels over the mouth. Odysseus has brought twelve men, and you.'),
            N('Inside: racks of cheeses, pens crowded with lambs and kids, every bucket brimming with whey. Nobody at home.'),
            SA('Take the cheeses, captain. Take some lambs. And let’s go, now, before whoever lives here comes back.'),
            O('No. I want to see him. He might give us a guest-gift.', 'think'),
            N('He comes home at evening: a giant with one eye, carrying a load of dry wood. He throws it down so hard that you all run to the back of the cave.'),
            N('He drives in his flock and rolls a stone across the doorway. Twenty-two wagons couldn’t shift that stone.'),
            CY('Strangers. Who are you? Traders? Or pirates, roving the sea?'),
            O('Greeks, coming home from Troy. We’re at your knees. Give us a guest-gift, as is right. Zeus watches over strangers.'),
            CY('You’re a fool, stranger. We Cyclopes don’t care for Zeus. We’re stronger than he is.', 'angry'),
            N('Two of the men are lost that night. The page goes dark for it, and Odysseus puts a hand over your eyes, and you don’t see.'),
          ],
          choices: [
            {
              id: 'hide',
              label: 'Hide your Nubbin inside your tunic.',
              then: [N('You tuck it inside your tunic. You can feel its heart going like a bird’s.')],
            },
            {
              id: 'stand',
              label: 'Stand next to Odysseus.',
              then: [N('You stand next to him. He doesn’t look at you, but he moves half a step, so that he is between you and the fire.')],
            },
          ],
        },
        done: {
          id: 'a14-08-cave-done',
          lines: [
            N('Odysseus’s hand goes to his sword, and stops. If the giant dies, nobody can move the stone, and you are all shut in for ever.'),
            O('Not like that. Think.', 'think'),
          ],
        },
      },
      {
        id: 'a14-08-s2',
        goal: 'Give the giant the wine.',
        hint: 'Carry the bowl of wine to the giant after his dinner.',
        check: 'give:a14-wine:cyclops',
        scene: {
          id: 'a14-08-wine',
          lines: [
            N('Next day, while the giant is out with his flock, Odysseus finds a great club of green olive wood lying by the pens.'),
            N('He has the men cut a length off it, smooth it, sharpen the end and harden it in the fire. They hide it in the straw.'),
            N('At evening the giant comes home. Odysseus fills a bowl with the dark wine he brought from the ship, so strong it is mixed twenty to one.'),
            O('Here, Cyclops. Have some wine, after your dinner.'),
            CY('More. Give me more. And tell me your name, so I can give you a guest-gift you’ll like.', 'happy'),
            O('My name is Nobody. It always has been. Ask anyone at home.', 'think'),
            CY('Then here is your gift, Nobody. You’ll be the last. I’ll keep you till the very end.', 'happy'),
            N('He falls over on his back and sleeps, with his great neck bent sideways.'),
          ],
        },
        done: {
          id: 'a14-08-wine-done',
          lines: [
            N('What happens next is quick, and the page won’t show it. There is the olive stake, and the fire, and then a roar that shakes the hill.'),
            N('Your Nubbin presses its face into your side. Afterwards, nobody on the ship ever talks about it.'),
          ],
        },
      },
      {
        id: 'a14-08-s3',
        goal: 'Get out of the cave under the rams.',
        hint: 'Hold on under the woolly rams as the giant lets the flock out.',
        check: 'escort:a14-crew:cave-door',
        scene: {
          id: 'a14-08-rams',
          lines: [
            N('The other Cyclopes come out of their caves in the night, and stand outside the stone, and shout.'),
            CS('Polyphemus! What’s wrong? Is someone stealing your sheep? Is someone hurting you?'),
            CY('Nobody! Nobody is hurting me!', 'angry'),
            CS('If nobody’s hurting you, it’s a sickness sent by Zeus, and we can’t help with that. Ask your father, Poseidon.'),
            N('They go home. Inside, in the dark, Odysseus laughs once, very quietly, at his own cleverness.'),
            N('In the morning the giant sits in the doorway with his arms out, feeling for anyone slipping past among the sheep.'),
            N('Odysseus ties the rams together in threes with willow, with a man under every middle one. He takes the biggest ram for himself.'),
            N('Your Nubbin goes under a lamb, holding its wool in all four paws. You hang under a ram with your face in the fleece.'),
            CY('Old ram. Why are you last out today? You’re always first to the grass. Are you sad for me?', 'sad'),
            N('The ram goes out slowly, with Odysseus underneath. The giant’s hand passes over its back, and he doesn’t think to feel below.'),
          ],
        },
        done: {
          id: 'a14-08-rams-done',
          lines: [
            N('Out in the daylight you let go and run, driving the fat sheep down to the ship. The men left aboard see how few you are, and weep.'),
            O('No crying. Row. Row now.', 'angry'),
          ],
        },
      },
      {
        id: 'a14-08-s4',
        goal: 'Decide what to do when he shouts.',
        hint: 'Answer him, or don’t, before he fills his lungs.',
        check: 'choose:a14-name:ship',
        scene: {
          id: 'a14-08-shout',
          lines: [
            N('The ship pulls away. When it is as far out as a shout will carry, Odysseus stands up in the stern.'),
            O('Cyclops! You should have been kinder to your guests. Zeus and the other gods have paid you back.', 'angry'),
            N('The giant tears the top off a hill and throws it. It lands just ahead of the bow, and the wave washes you back towards the shore.'),
            SA('Captain, stop! Don’t make him angrier! He nearly had us!', 'shock'),
            N('The men pull at the oars and beg him under their breath. He doesn’t hear them, or won’t.'),
            N('He is filling his chest with air again. You can see the name in his mouth, ready.'),
          ],
          choices: [
            {
              id: 'dont',
              label: 'Ask him not to.',
              set: { 'a14-name': 'dont' },
              then: [
                Y('Don’t. Please. Let him go on calling you Nobody.'),
                O('You’re right. You’re right, and I can’t. I want him to know who did it.', 'angry'),
              ],
            },
            {
              id: 'shout',
              label: 'Shout with him.',
              set: { 'a14-name': 'shout' },
              then: [
                N('You stand up beside him and fill your chest too. Whatever he shouts, you’ll shout it with him.'),
                O('Ha! There. A crew of one, at least.', 'happy'),
              ],
            },
            {
              id: 'silence',
              label: 'Say nothing.',
              set: { 'a14-name': 'silence' },
              then: [
                N('You say nothing. He glances at you, and sees that you know exactly what he’s about to do, and what it will cost.'),
                N('He does it anyway.'),
              ],
            },
          ],
        },
        done: {
          id: 'a14-08-shout-done',
          lines: [
            O('Cyclops! If anyone ever asks who did this to you, tell them Odysseus. Odysseus, son of Laertes, of Ithaca!', 'angry'),
            N('There is a silence on the shore. Then the giant lifts his hands to the sky and calls on his father, Poseidon.'),
            CY('Father, if I am your son, let him never come home. Or if he must, let him come late, alone, on a stranger’s ship, to trouble in his house.', 'angry'),
            N('Another rock, bigger. It lands behind the stern this time, and the wave pushes you out to sea.'),
          ],
        },
      },
    ],
    complete: {
      id: 'a14-08-complete',
      lines: [
        N('They row on, glad to be alive and sorry for the friends they lost. Nobody speaks for a long time.'),
        N('That evening Odysseus sits apart in the stern with his knife and a split piece of oar, carving.'),
        O('Here. For the little one. It got out under a lamb, which is more than its share of courage.', 'soft'),
        N('It is a small board with one word cut into it: Nobody.'),
        O('Somebody ought to get some good out of that name. I won’t be using it again.', 'think'),
      ],
    },
    rewards: [
      {
        id: 'a14-nobody-nameplate',
        kind: 'decor',
        label: '“Nobody” Nameplate',
        description: 'A little board cut from a broken oar, with one word carved on it. It hangs over your Nubbin’s bed.',
      },
    ],
    sets: { 'a14-08': true },
    notes:
      'SIGNATURE CHOICE (a14-08-shout): a14-name = dont | shout | silence. He shouts his name in every route ' +
      '(a14-08-shout-done is shared). Pays off in A14-14 (a14-14-harbour*), A14-16 (a14-16-gate*) and A14-20 ' +
      '(a14-20-bed*, a14-20-complete-silence). CARE: the two lost men are one dark beat with Odysseus’s hand over ' +
      'your eyes; nothing is described. The blinding is a14-08-wine-done#0 only: the stake, the fire, the roar, on a ' +
      'black page with sound. "Nobody is hurting me!" is our own softened cry. The Cyclops’s scorn for Zeus is his ' +
      '(Book IX) and marks him as the one who breaks the guest-law; it is not the page’s view. The Cyclops is huge and ' +
      'frightening but never gory: one eye, a shepherd’s smock, a shepherd’s tenderness for his ram. LIFTED TEXT: ' +
      'none; Butler’s "Noman" passage is [unverified] and the name beat is in our own words (a14-08-wine#5).',
  },

  // ---------------------------------------------------------------- A14-9
  {
    id: 'a14-09',
    code: 'A14-9',
    title: 'The Bag of Winds',
    source: `${ODY}, Book X: Aeolus`,
    audience: 'all',
    trigger: { where: WHERE, when: after('A14-8') },
    requires: ['A14-8'],
    speakers: [AEOLUS, ODYSSEUS, SAILOR],
    steps: [
      {
        id: 'a14-09-s1',
        goal: 'Stay a while on the floating island.',
        hint: 'Go up to Aeolus’s hall inside the bronze wall.',
        check: 'visit:a14-aeolus:island',
        scene: {
          id: 'a14-09-aeolia',
          lines: [
            N('The island of Aeolus floats on the sea. A wall of bronze runs all the way round it, and sheer cliffs rise above the wall.'),
            N('Aeolus, keeper of the winds, lives there with his wife and their twelve children. Every day they feast; every night they sleep on soft rugs.'),
            AE('Troy! Tell me about Troy again. The horse part. And the ships. Tell me every part.', 'happy'),
            N('Odysseus tells it, for a whole month. He is a very good teller, and Aeolus a very good listener.'),
            N('Your Nubbin sleeps through most of it, on a different rug every night.'),
            AE('Now. You want to go home. Watch.'),
            N('He takes the hide of a nine-year-old ox, and into it he ties all the howling winds. He binds the neck with a shining silver thread.'),
            N('He stows it in the hold himself, so not a breath leaks out. Only the west wind he leaves free, to blow you home.'),
            AE('Don’t open it. Not for anything. Do you understand me?', 'think'),
          ],
          choices: [
            {
              id: 'promise',
              label: '“We won’t.”',
              then: [AE('Good guest. Off you go, then.')],
            },
            {
              id: 'inside',
              label: 'Ask what’s inside, exactly.',
              then: [AE('Every wind there is, but one. Try not to let them out. They don’t go back in.', 'think')],
            },
            {
              id: 'sniff',
              label: 'Let your Nubbin sniff the bag.',
              then: [N('Your Nubbin sniffs the bag. Its ears blow straight back, and stay that way for an hour.')],
            },
          ],
        },
        done: {
          id: 'a14-09-aeolia-done',
          lines: [N('The west wind fills the sail. Odysseus takes the steering oar, and won’t give it to anyone else.')],
        },
      },
      {
        id: 'a14-09-s2',
        goal: 'Keep watch on the bag while he sleeps.',
        hint: 'Stay by the hold, near the silver thread.',
        check: 'watch:a14-bag:hold',
        scene: {
          id: 'a14-09-bag',
          lines: [
            N('Nine days and nine nights he steers. He won’t let anyone take a turn, because he wants to be quicker getting home.'),
            N('On the tenth day, land. You can see men on Ithaca tending their fires, and the smoke going up.'),
            O('That’s it. That’s home. That rock, there, look. I can see the—', 'happy'),
            N('He sits down against the stern and falls asleep in the middle of the sentence. He has been awake for nine days.'),
            N('Down in the middle of the ship, the crew are whispering, and looking at the hold.'),
            SA('Everywhere he goes, people give him presents. And what do we get? What’s in that bag, eh? Gold. Silver.'),
            SA('Let’s have a look. Just a look. He’d share it if he were awake.'),
          ],
          choices: [
            {
              id: 'wind',
              label: '“It’s the winds. It’s only the winds.”',
              then: [
                SA('Course it is. And I’m a Cyclops. Move over.'),
                N('They don’t believe you, and why would they? Nobody ties up wind.'),
              ],
            },
            {
              id: 'wake',
              label: 'Try to wake Odysseus.',
              then: [N('You shake him, and he says something about goats, and doesn’t wake. Nine days is a long time.')],
            },
            {
              id: 'sit',
              label: 'Sit on the bag.',
              then: [N('You sit on the bag, and your Nubbin sits on you. Two sailors lift you both off, quite gently, and set you down out of the way.')],
            },
          ],
        },
        done: {
          id: 'a14-09-bag-done',
          lines: [
            N('They untie the silver thread. Every wind in the world comes out at once.'),
            N('The sky goes black and the ship spins round. Ithaca goes small behind you, and then you can’t see it at all.'),
            N('He wakes, and sees, and lies down in the bottom of the ship with his cloak over his face, and doesn’t get up for a long time.'),
          ],
        },
      },
      {
        id: 'a14-09-s3',
        goal: 'Go back to Aeolus and ask again.',
        hint: 'Follow Odysseus up to the hall.',
        check: 'visit:a14-aeolus:hall',
        scene: {
          id: 'a14-09-again',
          lines: [
            N('The winds blow you all the way back to the floating island. Odysseus walks up to the hall with one man, and you.'),
            N('Aeolus is at dinner with his family. He sees who it is, and stands up.'),
            AE('Odysseus? What happened? We sent you off with everything you needed.', 'shock'),
            O('My crew did it. My crew, and my own sleep. Help us. Just once more.', 'sad'),
            AE('Go. Leave my island. When the gods are set against a man like this, I daren’t help him.', 'angry'),
            N('Nobody offers you dinner. It is the first door in this story that has been shut in your face.'),
          ],
          choices: [
            {
              id: 'go',
              label: 'Go quietly.',
              then: [N('You go quietly. At the door Aeolus’s youngest daughter slips your Nubbin a fig, and says nothing.')],
            },
            {
              id: 'plead',
              label: 'Ask once more, for the crew.',
              then: [AE('No. I’m sorry. No.', 'sad')],
            },
          ],
        },
      },
    ],
    complete: {
      id: 'a14-09-complete',
      lines: [
        N('No wind now: they row, day after day. The men don’t look at Odysseus, and he doesn’t look at them.'),
        N('Twelve ships sailed home from Troy. After a harbour of giants that nobody will talk about, there is one.'),
        O('I was so close I could see the smoke from their fires.', 'sad'),
        O('That’s the worst of it. Not that it was far. That it was close.', 'sad'),
      ],
    },
    rewards: [],
    sets: { 'a14-09': true },
    notes:
      'Aeolus is a host with the winds in his keeping, not a god: he may be cheerful, and his refusal is grave. The ' +
      'giants’ harbour (the Laestrygonians, Book X) is one line in the complete scene, offscreen, and never shown. ' +
      'Odysseus’s despair after the bag is opened is shown only as lying down with his face covered (Homer has him ' +
      'think of jumping overboard; leave that out for all ages).',
  },

  // ---------------------------------------------------------------- A14-10
  {
    id: 'a14-10',
    code: 'A14-10',
    title: 'Circe',
    source: `${ODY}, Book X: Circe and the moly`,
    audience: 'all',
    trigger: { where: WHERE, when: after('A14-9') },
    requires: ['A14-9'],
    speakers: [ODYSSEUS, EURYLOCHUS, HERMES, CIRCE],
    steps: [
      {
        id: 'a14-10-s1',
        goal: 'Go up into the woods with Odysseus.',
        hint: 'Follow the smoke towards the house in the trees.',
        check: 'walk:a14-aeaea:woods',
        scene: {
          id: 'a14-10-woods',
          lines: [
            N('A low, wooded island, and smoke rising from a house deep in the trees. Odysseus sends half the men to look, under Eurylochus.'),
            N('Eurylochus comes back alone, running, and can’t speak at first for crying.'),
            EL('Wolves and lions round the house, tame. They wagged their tails at us like dogs when their master comes home.', 'shock'),
            EL('Inside, a woman was singing at a great loom. She called us in, and they all went. I stayed outside. I thought it was a trap.'),
            EL('They never came out. I waited and waited. Not one.', 'sad'),
            O('Then I’ll go. Stay here if you like.'),
            N('He slings his sword and bow on his shoulder and goes up into the woods. You go with him, because guests go with their hosts.'),
            N('On the path a young man is standing with a gold wand, as if he’d been waiting. You have seen him before, on another beach.'),
            HM('Where are you going, alone, into these woods? Your men are in Circe’s sties. Will you free them? You’ll end up with them.'),
            HM('Here. Take this herb. It will keep her spell off you.'),
            N('He draws it out of the ground: black at the root, with a flower as white as milk. The gods call it moly, and it is hard for people to dig.'),
            HM('When she strikes you with her wand, draw your sword. She will ask you to stay. Make her swear by the gods first.'),
            N('Then he goes up through the trees to high Olympus, and the path is empty.'),
          ],
          choices: [
            {
              id: 'thank',
              label: 'Thank him as he goes.',
              then: [N('You thank him, and he inclines his head, gravely. Then the path is only a path, with a little hollow where a flower was.')],
            },
            {
              id: 'flower',
              label: 'Look at the flower.',
              then: [N('It’s a plain white flower that smells of nothing much. Odysseus holds it as if it were a lamp.')],
            },
          ],
        },
        done: {
          id: 'a14-10-woods-done',
          lines: [N('The house is built of smooth stone. The wolves and lions come up wagging their tails, and your Nubbin peers out at them from behind your legs.')],
        },
      },
      {
        id: 'a14-10-s2',
        goal: 'Feed the pigs in the sty while he goes inside.',
        hint: 'Go round the side of the house to the sties.',
        check: 'feed:a14-pigs:sty',
        scene: {
          id: 'a14-10-sty',
          lines: [
            N('Odysseus goes in. You don’t, because Hermes gave you no moly, so you go round the side of the house instead.'),
            N('There are the sties, and in them the pigs: bristly, grunting, with pigs’ snouts and pigs’ voices.'),
            N('But their minds are what they were, and you can see it in their eyes. They are crying.'),
            N('Circe has thrown them acorns and beech-mast and cornel berries, the food that pigs eat. Some of it lies in the mud, untouched.'),
            N('Your Nubbin stands at the rail and looks at the biggest pig for a long time. The pig looks back.'),
            N('These are the men who opened the bag of winds, and you remember that. You feed them anyway.'),
          ],
          choices: [
            {
              id: 'talk',
              label: 'Feed them, and talk to them as men.',
              then: [N('You feed them, and talk to them like the sailors they are, about the weather and the ship. One of them stops crying to listen.')],
            },
            {
              id: 'scratch',
              label: 'Feed them, and scratch behind their ears.',
              then: [N('You feed them and scratch behind their ears, which isn’t dignified, and they lean into it anyway. Some things are true in any shape.')],
            },
            {
              id: 'nubbin',
              label: 'Let your Nubbin climb in with them.',
              then: [N('Your Nubbin climbs over the rail and lies down in the straw among them, and they settle round it, as if it had been their idea.')],
            },
          ],
        },
        done: {
          id: 'a14-10-sty-done',
          lines: [N('From inside the house comes a shout, and a cry, and then a woman’s voice: not frightened, only very surprised.')],
        },
      },
      {
        id: 'a14-10-s3',
        goal: 'See the men turned back.',
        hint: 'Stay by the sty when the door opens.',
        check: 'watch:a14-circe:sty',
        scene: {
          id: 'a14-10-change',
          lines: [
            N('The door opens. Circe comes out with her wand, and Odysseus behind her, his sword still drawn.'),
            CI('You are Odysseus. You must be. Hermes always said you would come one day, the clever one, on your way home from Troy.'),
            CI('My cup did nothing to you. Nobody has ever drunk it and stayed himself. Put your sword away. Come in.'),
            O('Not yet. First swear by the gods you’ll do me no harm. And give me back my men.', 'angry'),
            N('She swears. Then she opens the sty and goes among the pigs with a salve, and touches each one.'),
            N('The bristles fall away, and they are men again, younger than before, and taller. They hold Odysseus’s hands and weep.'),
            N('The house rings with it. Even Circe is moved, and turns away to look at the trees.'),
            N('The youngest of the men comes over and shakes your hand without a word. He remembers the acorns.'),
          ],
        },
      },
    ],
    complete: {
      id: 'a14-10-complete',
      lines: [
        CI('Stay, all of you. Eat and drink until your strength comes back. You’ve been beaten so long you’ve forgotten how to be glad.', 'soft'),
        N('They stay. Days become months: feasts, and sleep, and more feasts.'),
        N('The year turns round. One evening the men come to Odysseus and remind him, gently, that they have homes too.'),
        O('A whole year. I didn’t count. You’d think I’d be the one counting.', 'sad'),
        CI('You may go. But first you must make another journey: to the House of the Dead, to ask the prophet Tiresias your way home.', 'think'),
        N('Odysseus sits down hard on the edge of the bed and puts his head in his hands.'),
      ],
    },
    rewards: [],
    sets: { 'a14-10': true },
    notes:
      'Circe’s spell never touches you or your Nubbin: you go round to the sty and are never offered the cup. Hermes ' +
      'is grave and kind, as in Book X; the player only thanks him. The pigs are men in pigs’ bodies: sad, not funny, ' +
      'though the scratching choice may be gently wry. Circe’s loom (Book X) is drawn in her hall: the second loom of ' +
      'the line, after Penelope’s and Calypso’s. Her bed and the year’s stay are told, never shown.',
  },

  // ---------------------------------------------------------------- A14-11
  {
    id: 'a14-11',
    code: 'A14-11',
    title: 'The House of the Dead',
    source: `${ODY}, Book XI: Tiresias and Anticlea`,
    audience: 'all',
    trigger: { where: WHERE, when: after('A14-10') },
    requires: ['A14-10'],
    speakers: [ODYSSEUS, TIRESIAS, ANTICLEA],
    steps: [
      {
        id: 'a14-11-s1',
        goal: 'Sail with him to the edge of the world.',
        hint: 'Wait under the willows while he goes on alone.',
        check: 'walk:a14-ocean:edge',
        scene: {
          id: 'a14-11-edge',
          lines: [
            N('This part of his story is about his mother, and about the dead. It is sad and gentle, and you can stop and come back whenever you like.'),
            N('The wind carries the ship all day, to the edge of the world, where the river Ocean runs round everything.'),
            N('A land of mist that the sun never reaches: tall poplars, and willows that drop their seeds before they ripen. Nobody lives here.'),
            O('Circe told me what to do. It’s mine to do, not yours. Stay back here by the trees, with the little one.', 'soft'),
            N('He goes on alone to the place she told him of, and makes the offering to the dead, the old way, out of your sight.'),
            N('You sit under a willow with your Nubbin in your lap. The page is grey here, like paper left out in the rain.'),
          ],
        },
        done: {
          id: 'a14-11-edge-done',
          lines: [
            N('Then they come: the dead, up out of the dark, more than you can count. They make a sound like birds a long way off.'),
            N('They don’t frighten you. They are only sad, and thin as breath, and looking for someone.'),
          ],
        },
      },
      {
        id: 'a14-11-s2',
        goal: 'Stay near while the dead come.',
        hint: 'Keep still under the willows and watch.',
        check: 'watch:a14-shades:edge',
        scene: {
          id: 'a14-11-shades',
          lines: [
            N('The prophet Tiresias comes first, old and blind, with a gold staff. He knows Odysseus at once.'),
            TI('You want your homecoming to be sweet, Odysseus. A god will make it hard. Poseidon has not forgotten his son.'),
            TI('Leave the Sun’s cattle alone, on the island where you find them. Harm them, and you’ll come home late, alone, on a stranger’s ship.'),
            TI('And you’ll find trouble in your house: proud men eating your bread and courting your wife.'),
            N('Then a woman comes up out of the dark, and Odysseus makes a sound you have never heard a grown man make.'),
            O('Mother?', 'shock'),
            O('Mother. You were alive when I sailed. I didn’t know. Nobody told me.', 'sad'),
            AC('My child. How did you come here, living, through all that dark water? Have you still not got home?', 'soft'),
            O('Not yet. Tell me how you died. Was it a long illness? Tell me about my father, my son. And my wife: does she wait still?', 'sad'),
            AC('She waits, and cries at night. Your son keeps the land. Your father lives out on the farm, sleeps on leaves in the vineyard, and grieves.', 'soft'),
            AC('And I wasn’t ill. It was you. Missing you, and wondering where you were, and how kind you always were to me. That was what I died of.', 'soft'),
          ],
        },
        done: {
          id: 'a14-11-shades-done',
          lines: [
            N('He reaches for her, and she goes through his arms like a shadow, or a dream. He reaches again, and a third time.'),
            O('Mother. Why won’t you stay, so we can hold each other, even here?', 'sad'),
            AC('It isn’t unkindness, child. It is what we are, once we’re dead. Go back to the light. Remember all of it, and tell your wife.', 'soft'),
          ],
        },
      },
      {
        id: 'a14-11-s3',
        goal: 'Sit with him afterwards.',
        hint: 'Stay under the willows when he comes back.',
        check: 'sit:a14-odysseus:willows',
        scene: {
          id: 'a14-11-after',
          lines: [
            N('The dead go back down into the dark. Odysseus walks back to the willows, sits down beside you, and doesn’t say anything.'),
            N('His hands are open on his knees, as if he were still holding something.'),
            N('Far off, the ship is waiting. The men stand at the rail and don’t call him, because they know.'),
            O('She asked about my wife. My father. My son. Not once about herself.', 'sad'),
            N('Your Nubbin looks at him. Then it looks at you, the way it does when it wants to know what the rule is.'),
            N('You remember what Hazel did, when she didn’t know what to do. You don’t have to remember very hard.'),
          ],
          choices: [
            {
              id: 'sit',
              label: 'Sit with him. That’s all.',
              then: [
                N('You sit with him while the mist moves in the willows. After a long time he breathes out, all the way.'),
                O('Thank you. I couldn’t have borne anyone talking.', 'soft'),
              ],
            },
            {
              id: 'sorry',
              label: '“I’m sorry about your mother.”',
              then: [O('So am I. She waited too. Everyone in my house is waiting. Some of them couldn’t wait long enough.', 'sad')],
            },
            {
              id: 'nubbin',
              label: 'Let your Nubbin climb into his hands.',
              then: [
                N('Your Nubbin climbs into his open hands and sits there. It is warm and solid, and it does not go through his fingers.'),
                O('Oh.', 'soft'),
              ],
            },
          ],
        },
      },
    ],
    complete: {
      id: 'a14-11-complete',
      lines: [
        N('They sail back to Circe’s island in the morning, without a word between them all the way.'),
        N('Odysseus stands at the stern and watches the edge of the world go grey behind him, and then go.'),
        O('My father sleeps on leaves in the vineyard. In winter he sleeps by the fire, in the ashes, with the farmhands. An old king.', 'sad'),
        O('When I get home, I’ll go to him. Not first. But I’ll go.', 'soft'),
      ],
    },
    rewards: [],
    sets: { 'a14-11': true },
    notes:
      'CONTENT LINE: a14-11-edge#0 is the soft content line the outline asks for. Before it, offer the usual "you can ' +
      'leave and come back" control; the line itself plays either way. CARE: the offering is Odysseus’s alone and out ' +
      'of sight (no trench, no blood, no animals on screen). The dead are pale, quiet shapes with faces, never ' +
      'skeletal. Anticlea is gentle and grave, like Fossil; her words are our own (Butler’s Book XI line is ' +
      '[unverified]). Hazel’s third rule is acted out at a14-11-after#5 and never quoted. Laertes on the farm is set up ' +
      'here for A14-20.',
  },

  // ---------------------------------------------------------------- A14-12
  {
    id: 'a14-12',
    code: 'A14-12',
    title: 'The Sirens',
    source: `${ODY}, Book XII: Circe’s counsel; the Sirens`,
    audience: 'all',
    trigger: { where: WHERE, when: after('A14-11') },
    requires: ['A14-11'],
    speakers: [ODYSSEUS, CIRCE],
    steps: [
      {
        id: 'a14-12-s1',
        goal: 'Hear Circe’s advice for the voyage.',
        hint: 'Walk with them along the shore, away from the sleeping men.',
        check: 'talk:a14-circe:advice',
        scene: {
          id: 'a14-12-advice',
          lines: [
            N('Back on Circe’s island the men sleep by the ship. Circe takes Odysseus by the hand and leads him apart, and you walk on his other side.'),
            CI('First you’ll come to the Sirens. They sing to every sailor who passes. Whoever stops to hear them never gets home.'),
            CI('They sit in a green meadow by the sea, and the grass round them is full of the wrecks of sailors who stopped to listen.'),
            CI('Warm some wax until it’s soft, and press it into every one of your men’s ears, so that not a note gets in. And row past.'),
            CI('If you want to hear them yourself, let your men tie you to the mast, hand and foot. If you beg to be untied, they must tie you tighter.'),
            O('And after the Sirens?'),
            CI('After them there are two ways, and both are bad. I’ll tell you of them when you need it. You will want to fight. Don’t.', 'think'),
          ],
          choices: [
            {
              id: 'wax',
              label: 'Ask if you should have wax too.',
              then: [CI('Unless you want to stay in that meadow for ever. You too, little guest. And the small one.', 'think')],
            },
            {
              id: 'why',
              label: 'Ask Odysseus why he wants to hear them.',
              then: [O('Because nobody has, and lived. Because I want to know. That’s always been my trouble.', 'think')],
            },
          ],
        },
        done: {
          id: 'a14-12-advice-done',
          lines: [N('At dawn Circe walks off up the island and doesn’t look back. The ship slides out on a fair wind she sends after you.')],
        },
      },
      {
        id: 'a14-12-s2',
        goal: 'Let him seal your ears with wax.',
        hint: 'Sit on the bench and keep still while he does it.',
        check: 'place:a14-wax:ears',
        scene: {
          id: 'a14-12-wax',
          lines: [
            N('The wind drops, and the sea goes as flat as a plate. The men take down the sail and start to row.'),
            N('Odysseus cuts a round cake of wax small with his sword, and kneads it in his strong hands until the sun has made it soft.'),
            O('Ears. Everyone. You first, Eurylochus, and stop making that face.'),
            N('He goes down the benches one man at a time. Then he comes to you, and to your Nubbin, and does yours just as carefully.'),
            N('The world goes muffled, then quiet, then silent. You can feel the oars knocking through the boards, but you can’t hear them.'),
            N('The men tie Odysseus to the mast, upright, hand and foot, and go back to their oars. He nods at you, and his lips say: watch.'),
          ],
        },
        done: {
          id: 'a14-12-wax-done',
          lines: [N('Your Nubbin keeps touching its ears with its paws, in case they have gone somewhere.')],
        },
      },
      {
        id: 'a14-12-s3',
        goal: 'Watch him at the mast as the ship rows past.',
        hint: 'Stay on the bench by the mast. You won’t hear a thing.',
        check: 'watch:a14-sirens:mast',
        scene: {
          id: 'a14-12-sirens',
          lines: [
            N('A green meadow slides past on the right, very close, and two figures sit in the grass. Their mouths are open: they are singing.'),
            N('You hear nothing at all. You only see what the song does to him.'),
            N('He strains at the ropes, and the cords stand out in his neck. He nods and nods at the men to untie him, with his eyebrows, his whole face.'),
            N('Eurylochus and Perimedes get up from their oars, tie him tighter, and go back to rowing, as they were told.'),
            N('He is shouting something, over and over. You can’t hear it, and you are glad, and you are also, just a little, sorry.'),
            N('The men row harder with their eyes on their oars. Nobody looks at the meadow, and nobody looks at him either.'),
          ],
          choices: [
            {
              id: 'look',
              label: 'Keep looking at him.',
              then: [N('You keep looking at him, so that somebody does. He sees you watching, and it seems to help him hold on.')],
            },
            {
              id: 'away',
              label: 'Look away, at the sea.',
              then: [N('You look at the sea. It is flat and blue and says nothing, which is a mercy.')],
            },
            {
              id: 'paws',
              label: 'Hold your Nubbin’s paws over its ears.',
              then: [N('You hold your Nubbin’s paws over its ears, in case the wax isn’t enough. It holds yours over your ears, in case yours isn’t.')],
            },
          ],
        },
        done: {
          id: 'a14-12-sirens-done',
          lines: [
            N('The meadow falls behind. The men take the wax out of their ears, and untie him.'),
            O('They said they knew everything. Every man who fought at Troy, and everything that ever happens on the earth.', 'soft'),
            O('They said: stop, and we’ll tell you. And I’d have stopped, and stayed, and never asked for anything again.', 'sad'),
          ],
        },
      },
    ],
    complete: {
      id: 'a14-12-complete',
      lines: [
        N('He rubs his wrists where the ropes were. He looks at you as if he wants to ask what it was like, hearing nothing.'),
        O('Was it quiet? On your side?'),
        Y('Very.'),
        O('I envy you. I don’t envy you. Both.', 'think'),
      ],
    },
    rewards: [],
    sets: { 'a14-12': true },
    notes:
      'SILENCE: a14-12-wax#4 to a14-12-sirens-done#0 play with the sound muffled to nothing (no music, no voices, only ' +
      'a faint felt thump of oars as a controller rumble where available). The Sirens are two distant figures in a ' +
      'meadow, beautiful and unreadable, never monstrous, never seductive. Their song is never given; Odysseus only ' +
      'says what it promised (Book XII). Circe’s advice about the wax is in our own words (Butler’s line is ' +
      '[unverified]). The wrecks in the meadow stand in for Homer’s heap of bones.',
  },

  // ---------------------------------------------------------------- A14-13
  {
    id: 'a14-13',
    code: 'A14-13',
    title: 'Scylla and Charybdis',
    source: `${ODY}, Book XII: Scylla, Charybdis and the cattle of the Sun`,
    audience: 'all',
    trigger: { where: WHERE, when: after('A14-12') },
    requires: ['A14-12'],
    speakers: [ODYSSEUS, EURYLOCHUS, ALCINOUS],
    steps: [
      {
        id: 'a14-13-s1',
        goal: 'Watch the strait as he steers by the cliff.',
        hint: 'Stay low on the bench and keep rowing.',
        check: 'watch:a14-strait:rocks',
        scene: {
          id: 'a14-13-strait',
          lines: [
            N('Two rocks: on one side, high up, a cave in a cliff too smooth to climb. On the other, under a fig tree, the sea goes down a great hole.'),
            N('That is Charybdis. Three times a day she drinks the sea down, and three times she throws it up, and when she drinks you can see the sand.'),
            N('In the cave on the other side lives Scylla. Circe told him of her: a thing with six long necks, and a small, high voice, like a puppy’s.'),
            O('Better to lose six than lose them all. Steer close under the cliff. And don’t tell the men about her. They’d stop rowing.', 'sad'),
            N('He puts on his armour, takes two spears and stands in the bow, against Circe’s advice. He can’t help it.'),
            N('The men row, staring at Charybdis. Nobody is looking up.'),
            N('Then the page goes dark for a moment, and comes back. Six men are gone from the benches, and you didn’t see it.'),
            O('Row. Don’t look up. Row!', 'angry'),
          ],
        },
        done: {
          id: 'a14-13-strait-done',
          lines: [N('The strait opens out, and behind you the sea roars down Charybdis’s throat and comes back up. Ahead lies a green island, with cattle on it.')],
        },
      },
      {
        id: 'a14-13-s2',
        goal: 'Land on the island of the Sun.',
        hint: 'Go ashore with the crew, and keep away from the herds.',
        check: 'visit:a14-thrinacia:shore',
        scene: {
          id: 'a14-13-island',
          lines: [
            N('The island of the Sun. Fat cattle with broad brows and curling horns graze along the shore: seven herds, and seven flocks of sheep.'),
            O('Tiresias warned me. Circe warned me. We sail past.', 'think'),
            EL('You may be made of iron. The rest of us are made of tired. One night. We’ll even be quiet.', 'angry'),
            O('You have never once been quiet.'),
            EL('Then this will be a nice change for everybody.'),
            N('The men all shout for Eurylochus. Odysseus makes them swear not to touch the cattle, and they swear, and you land.'),
            N('In the night the wind changes and blows from the south for a month, and never stops. The food runs out.'),
            N('The men fish, and snare birds, and go hungry. Odysseus goes inland alone to ask the gods for help, and falls asleep.'),
            N('Eurylochus calls the men together. You can see what he’s going to say before he says it.'),
          ],
          choices: [
            {
              id: 'fetch',
              label: 'Go and find Odysseus.',
              then: [N('You run inland with your Nubbin, and find him asleep in a hollow out of the wind. By the time you wake him, you can smell the fires.')],
            },
            {
              id: 'argue',
              label: 'Stay and argue with the crew.',
              then: [
                EL('Better to drown in one gulp than starve slowly on an island. We’ll make it up to the Sun. We’ll build him a temple.', 'angry'),
                N('Nobody listens to you. They’re too hungry to listen to anybody.'),
              ],
            },
            {
              id: 'herd',
              label: 'Stand with the cattle.',
              then: [N('You stand among the cattle, calm and huge and gold in the dusk. The men walk round you, quite politely, and take them anyway.')],
            },
          ],
        },
        done: {
          id: 'a14-13-island-done',
          lines: [
            N('Odysseus comes down to the shore, smells the meat cooking, and cries out to the gods.'),
            N('Far above, the Sun goes to the gods to complain, and Zeus listens. Nothing more is said aloud on the page.'),
          ],
        },
      },
      {
        id: 'a14-13-s3',
        goal: 'Hold on to the fig tree over the whirlpool.',
        hint: 'Grab the fig tree and hang on until the timbers come back up.',
        check: 'climb:a14-fig:charybdis',
        scene: {
          id: 'a14-13-fig',
          lines: [
            N('Six days the men feast. On the seventh the wind drops and you sail, and as soon as the island is out of sight a black cloud stands over the ship.'),
            N('Zeus’s thunderbolt strikes the ship, and it fills with smoke. The men go into the sea, and the page doesn’t show you their faces.'),
            N('They are lost, every one of them but Odysseus. He lashes the mast to the keel with a leather strap, and rides them.'),
            N('You and your Nubbin are on the mast with him, holding the strap. All night the wind carries you back the way you came.'),
            O('No. Not back. Not back to her.', 'shock'),
            N('At dawn you are at Charybdis again. The sea goes down her throat, and the mast and keel go with it.'),
            N('Odysseus leaps up and catches the fig tree above her, and hangs there like a bat. You catch hold beside him, and your Nubbin holds on to you.'),
            N('There is no foothold, and no climbing up. You can only hang, and wait for her to give the timbers back.'),
          ],
          choices: [
            {
              id: 'hang',
              label: 'Hang on.',
              then: [N('You hang on, and your arms burn. Odysseus talks to you all the while, about nothing, about goats, so you don’t think about letting go.')],
            },
            {
              id: 'count',
              label: 'Count, to make it go faster.',
              then: [N('You count, and get to a number you didn’t know you knew. Odysseus counts with you, under his breath.')],
            },
            {
              id: 'look',
              label: 'Look at Odysseus.',
              then: [N('He is looking down into the whirlpool, quite calm: he has hung over worse. You decide, for now, to believe him.')],
            },
          ],
        },
        done: {
          id: 'a14-13-fig-done',
          lines: [
            N('At the hour when a judge gets up from the court to go home to supper, the timbers come back up out of Charybdis.'),
            N('Odysseus lets go and drops onto them, and you drop after him, and he paddles away with his hands.'),
          ],
        },
      },
    ],
    complete: {
      id: 'a14-13-complete',
      lines: [
        N('Nine days he drifts. On the tenth night the sea brings him to Calypso’s island, and she takes him in.'),
        N('The page turns back, and you are on a bench in the Phaeacian hall. The lamps are low, and nobody has moved.'),
        O('And the rest you know. I told it you yesterday. I don’t like telling a story twice.', 'soft'),
        N('No one in the hall says anything for a long time. Then Alcinous stands up.'),
        AL('You’ll go home tomorrow, on our fastest ship, with gifts from everyone here. Nobody will say you came to us and left with nothing.'),
      ],
    },
    rewards: [],
    sets: { 'a14-13': true },
    notes:
      'CARE: Scylla is never seen, only her cave and the shadow of the necks across the cliff for one frame; Scylla’s ' +
      'six are lost on a dark page (a14-13-strait#6), and the crew after the Sun’s cattle are "lost" with no faces. The ' +
      'cattle are taken offscreen; the smoke and smell are enough. GODS: the Sun’s complaint and Zeus’s thunderbolt ' +
      'are Homer’s (Book XII), told briefly and gravely. LIFTED TEXT: none; the Scylla line Part M lists is ' +
      '[unverified], so a14-13-strait#2 is in our own words. FRAME: a14-13-complete#1 brings you back out of the told ' +
      'story into the hall.',
  },

  // ---------------------------------------------------------------- A14-14
  {
    id: 'a14-14',
    code: 'A14-14',
    title: 'Home Asleep',
    source: `${ODY}, Book XIII: the Phaeacian ship; Athena on Ithaca`,
    audience: 'all',
    trigger: { where: WHERE, when: after('A14-13') },
    requires: ['A14-13'],
    speakers: [ODYSSEUS, SHEPHERD, ATHENA, BEGGAR],
    steps: [
      {
        id: 'a14-14-s1',
        goal: 'Sail with the Phaeacians to Ithaca.',
        hint: 'Sit in the stern beside him through the night.',
        check: 'wait:a14-ship:ithaca',
        scene: {
          id: 'a14-14-ship',
          lines: [
            N('The Phaeacian ship has no steering oar. It doesn’t need one: it knows the way to every harbour in the world.'),
            N('Odysseus lies down on a rug in the stern and is asleep at once, in a sleep so deep it is like death. He has earned it.'),
            N('The ship runs faster than a falcon, and the water hisses along her sides. You sit by him, with your Nubbin in your lap, and watch the stars.'),
            N('Behind you Scheria goes small. Ahead there is nothing but dark sea, and then, before dawn, a dark shape.'),
            N('Twenty years he has been gone: ten at the war, and ten on the way back.'),
            N('He is smiling in his sleep. You have never seen him smile without a trick behind it.'),
          ],
          choices: [
            {
              id: 'cloak',
              label: 'Pull his cloak up over his shoulder.',
              then: [N('You pull it up, and he doesn’t wake. He mutters something about a dog.')],
            },
            {
              id: 'stars',
              label: 'Watch the stars.',
              then: [N('You watch the stars. The bright one that brings the dawn comes up, and the ship runs into harbour.')],
            },
            {
              id: 'sleep',
              label: 'Sleep too.',
              then: [N('You sleep, and dream of a gate, and of somebody lifting and pushing it.')],
            },
          ],
        },
        done: {
          id: 'a14-14-ship-done',
          lines: [
            N('In the harbour an olive tree grows at the head of the bay, beside a cave of the nymphs, where bees keep honey in stone jars.'),
            N('The sailors lift him off the ship still asleep, rug and all, and lay him on the sand. They set his gifts under the olive tree, and go.'),
          ],
        },
      },
      {
        id: 'a14-14-s2',
        goal: 'Stay with him when he wakes.',
        hint: 'Wait on the sand beside him until he stirs.',
        check: 'talk:a14-athena:harbour',
        scene: {
          id: 'a14-14-harbour',
          lines: [...A14_HARBOUR, B('You told me once to keep my name. I’m keeping it now.', 'soft')],
        },
        done: {
          id: 'a14-14-harbour-done',
          lines: [
            N('Together you hide his gifts deep in the cave of the nymphs: gold and bronze and fine cloth. Athena sets a stone across the mouth.'),
            AT('Go to the swineherd. He has stayed true. I am going to Sparta, to bring your son home.'),
            N('She is gone. The beggar leans on his staff, and the staff is real, and so, now, is the limp.'),
          ],
        },
      },
    ],
    complete: {
      id: 'a14-14-complete',
      lines: [
        N('You walk up from the harbour by a rough track through the woods. Ithaca is all rock and goats and thorn, and he looks at every bit of it.'),
        B('That rock. I fell off that rock when I was six. That one too.', 'soft'),
        N('He stops to touch an olive tree, and then another. Your Nubbin touches them too, since it seems to be what’s done here.'),
        B('Home. I’m home. And I can’t tell anyone.', 'sad'),
      ],
    },
    rewards: [],
    sets: { 'a14-14': true },
    notes:
      'NAME PAYOFF (a14-name, from A14-8). The step 2 scene shown, a14-14-harbour, is for dont: its last line is the ' +
      'outline’s "You told me once to keep my name. I’m keeping it now." For shout play A14_VARIANTS ' +
      'a14-14-harbour-shout; for silence play a14-14-harbour-silence. From the wand (a14-14-harbour#10) until A14-19 ' +
      'he is "The Beggar" (speaker a14-beggar) and is drawn old, in rags, with a staff. GODS: Athena teases him as she ' +
      'does in Book XIII, fondly and with dignity, and reveals herself plainly; her disguise as the shepherd is played ' +
      'straight. The ship turned to stone on its way home (Book XIII) is left out.',
  },

  // ---------------------------------------------------------------- A14-15
  {
    id: 'a14-15',
    code: 'A14-15',
    title: 'The Swineherd',
    source: `${ODY}, Books XIV–XVI: Eumaeus; father and son`,
    audience: 'all',
    trigger: { where: WHERE, when: after('A14-14') },
    requires: ['A14-14'],
    speakers: [EUMAEUS, BEGGAR, TELEMACHUS, ODYSSEUS],
    steps: [
      {
        id: 'a14-15-s1',
        goal: 'Come to the swineherd’s hut.',
        hint: 'Climb the track to the stone yard on the hill.',
        check: 'visit:a14-eumaeus:hut',
        scene: {
          id: 'a14-15-hut',
          lines: [
            N('High on the hill, a yard walled with stones and topped with thorn: twelve sties, and four dogs as fierce as wolves.'),
            N('The dogs see the beggar and rush at him, barking. He has the sense to sit down and let his staff fall.'),
            N('A man runs out of the hut shouting, throwing stones at the dogs until they scatter. He has dropped the leather he was cutting for sandals.'),
            EP('Old man, they nearly had you. That would have been one more grief for me, and I’ve plenty.', 'shock'),
            EP('Come in, both of you. Eat first. Then tell me where you’re from and what trouble you’re in.'),
            N('He piles brushwood under a shaggy goatskin to make a seat. He brings the best he has, and wine in a wooden bowl, and serves you himself.'),
            B('May Zeus give you what you most want, friend, for taking me in like this.', 'soft'),
            EP('Every stranger and beggar is in Zeus’s care. You don’t turn them away, even when you’ve only a little to give.'),
            EP('My master would have done better by you. He was good to me. But he’s dead somewhere far off, and nobody even knows where.', 'sad'),
            N('The beggar looks into his wine, and doesn’t say anything for a moment.'),
          ],
          choices: [
            {
              id: 'alive',
              label: '“He might not be dead.”',
              then: [EP('Every beggar who comes here says that. My mistress gives them a cloak for it. I’ve stopped believing.', 'sad')],
            },
            {
              id: 'master',
              label: 'Ask Eumaeus about his master.',
              then: [EP('He was kind. He gave me this hut and these sties. If he’d come home, he’d have given me a field of my own.', 'soft')],
            },
            {
              id: 'eat',
              label: 'Eat, and let the beggar talk.',
              then: [
                B('Friend, I swear to you: he will come home. This very year, between the old moon and the new.'),
                EP('I’ll believe that when I see him walk in through that gate.', 'think'),
              ],
            },
          ],
        },
        done: {
          id: 'a14-15-hut-done',
          lines: [
            B('If he comes, give me a cloak and tunic. If he doesn’t, set your dogs on me, and I’ll deserve it.'),
            EP('That would do wonders for my good name. No, old man. Eat.', 'happy'),
          ],
        },
      },
      {
        id: 'a14-15-s2',
        goal: 'Help Eumaeus with the pigs, into the night.',
        hint: 'Pour the acorns into the troughs and herd the piglets in.',
        check: 'feed:a14-pigs:yard',
        scene: {
          id: 'a14-15-pigs',
          lines: [
            N('At evening the herdsmen drive the pigs home from the oak woods, grunting and squealing, into the sties for the night.'),
            EP('Here, you can help. Mind the big sow, she bites. And mind the little one: it’s faster than it looks.'),
            N('You pour the acorns and the mash. Your Nubbin herds the piglets, badly but with enormous seriousness, into the wrong sty.'),
            EP('Not bad. Not that one. That one. There.', 'happy'),
            N('The night comes in cold and wet, with rain on a west wind. The beggar shivers in his rags by the fire.'),
            B('Let me tell you a story. Once at Troy we lay out all night in an ambush, and I’d forgotten my cloak…', 'think'),
            N('It is a long story and a very obvious hint. Eumaeus laughs, and goes and finds him a cloak.'),
            EP('There. Nobody has to tell a tale that long to get a cloak in my hut.', 'happy'),
            N('Then Eumaeus takes his own thick cloak and his spear, and goes out into the rain to sleep by the boars, under a rock out of the wind.'),
          ],
          choices: [
            {
              id: 'out',
              label: 'Go out with Eumaeus to the boars.',
              then: [N('You go out with him. The rain is cold and the boars are warm and smell terrible, and he makes room for you under the rock without a word.')],
            },
            {
              id: 'in',
              label: 'Stay inside with the beggar.',
              then: [B('Look at him go. Out in that, for my pigs. And they say I’m a hard man to impress.', 'soft')],
            },
            {
              id: 'cloak',
              label: 'Offer Eumaeus your cloak.',
              then: [EP('Keep it, guest. I’ve done this every night for twenty years. I’d sleep worse indoors.', 'soft')],
            },
          ],
        },
        done: {
          id: 'a14-15-pigs-done',
          lines: [N('In the hut, by the fire, the beggar lies awake a long time, watching the door.')],
        },
      },
      {
        id: 'a14-15-s3',
        goal: 'Be there when Telemachus comes home.',
        hint: 'Stay in the hut when the dogs go quiet on the path.',
        check: 'watch:a14-telemachus:hut',
        scene: {
          id: 'a14-15-son',
          lines: [
            N('Days pass, and one morning the dogs don’t bark at the footsteps on the path. They crowd round the newcomer, whining with joy.'),
            N('Eumaeus is mixing wine. The bowls fall out of his hands, and he runs to the door.'),
            N('It is Telemachus, home from Sparta. He came round by another way, as Athena told him, and Antinous’s ship waited for nothing.'),
            N('Eumaeus kisses his head and his eyes and his hands, like a father whose only son has come home after ten years away.'),
            T('I came here first, before the palace. I wanted to know: has my mother married? Is my father’s bed full of cobwebs?'),
            EP('She’s still there. She waits. She cries at night.', 'soft'),
            T('Go and tell her I’m home. Tell her quietly. Not the suitors.'),
            N('Eumaeus goes. Then there is someone at the edge of the yard whom only the beggar and the dogs can see.'),
            N('The dogs don’t bark; they slink away whining to the far side of the yard. The beggar goes out to her.'),
            N('When he comes back in he is not a beggar. He is tall and dark-bearded, in a clean cloak and tunic.'),
            T('You’re… a god. You must be. Be kind to us. We’ll bring you gifts.', 'shock'),
            O('I am no god. I am your father. The one you’ve grieved for.', 'soft'),
          ],
        },
        done: {
          id: 'a14-15-son-done',
          lines: [
            N('Telemachus doesn’t believe it, and then he does. They hold each other and cry, louder than birds whose young have been taken from the nest.'),
            N('You go out into the yard with your Nubbin, sit on the wall, and leave them to it.'),
          ],
        },
      },
    ],
    complete: {
      id: 'a14-15-complete',
      lines: [
        O('Tell nobody. Not Eumaeus, not your grandfather, not your mother. Not yet.', 'think'),
        T('How many are we against? There are more than a hundred of them. And two of us.', 'sad'),
        O('Two, and the guest. And Athena, and Zeus. Do you think that will do?'),
        T('Put like that…', 'think'),
        N('By the time Eumaeus comes back, the beggar is a beggar again, sitting by the fire, warming his hands.'),
      ],
    },
    rewards: [],
    sets: { 'a14-15': true },
    notes:
      'Eumaeus is the swineherd, never a slave on this page. His feast for the stranger is "the best he has": no ' +
      'slaughter on screen. The cloak story is Homer’s joke (Book XIV) and may be played for a warm laugh. Athena ' +
      'is seen only by Odysseus and the dogs (Book XVI): draw a brightness at the yard’s edge, no figure. The ' +
      'recognition is Odysseus (speaker a14-odysseus) for this scene only; he is the Beggar again from the complete ' +
      'scene. He never says his own name here.',
  },

  // ---------------------------------------------------------------- A14-16
  {
    id: 'a14-16',
    code: 'A14-16',
    title: 'Argos',
    source: `${ODY}, Book XVII: the old dog Argos`,
    audience: 'all',
    trigger: { where: WHERE, when: after('A14-15') },
    requires: ['A14-15'],
    speakers: [BEGGAR, EUMAEUS],
    steps: [
      {
        id: 'a14-16-s1',
        goal: 'Walk into town with Eumaeus and the beggar.',
        hint: 'Carry the beggar’s bag down the track to the town spring.',
        check: 'walk:a14-road:town',
        scene: {
          id: 'a14-16-road',
          lines: [
            N('Eumaeus and the beggar set off down the rough track to the town. The beggar leans on his staff, and you carry his bag.'),
            N('At the spring outside the town, where people draw water, a goatherd driving goats to the suitors’ dinner sees you.'),
            N('He jeers at the beggar and kicks out at him as he passes. The beggar takes it, and doesn’t fall, and doesn’t answer.'),
            EP('One day the master will come home and see to you, goatherd.', 'angry'),
            N('Your Nubbin stares at the goatherd all the way out of sight without blinking, which is all it can do, and it does it thoroughly.'),
            B('Leave it. I’ve had worse from the sea.', 'think'),
          ],
        },
        done: {
          id: 'a14-16-road-done',
          lines: [N('The house comes in sight. You can hear a lyre from the yard and smell the meat: the suitors are at dinner.')],
        },
      },
      {
        id: 'a14-16-s2',
        goal: 'Stop at the gate, by the heap.',
        hint: 'Stand at the courtyard gate with them.',
        check: 'find:a14-argos:gate',
        scene: {
          id: 'a14-16-gate',
          lines: [
            ...A14_GATE,
            N('The beggar says one word under his breath, so that only the dog and you can hear it.'),
            B('Nobody.', 'soft'),
            ...A14_GATE_END,
          ],
        },
        done: {
          id: 'a14-16-gate-done',
          lines: [N('You stay at the gate with your Nubbin. Somebody should.')],
        },
      },
      {
        id: 'a14-16-s3',
        goal: 'Sit with Argos in the sun.',
        hint: 'Sit down beside the heap and stay.',
        check: 'sit:a14-argos:heap',
        scene: {
          id: 'a14-16-sit',
          lines: [...A14_SIT_START, ...A14_SIT_END],
          choices: A14_SIT_CHOICES,
        },
        done: {
          id: 'a14-16-sit-done',
          lines: [
            N('Argos puts his head down on his paws, and doesn’t lift it again.'),
            N('He waited twenty years, and saw his master come home, and then he let go.', 'soft'),
            N('Your Nubbin stays against his side for a long while after, until the sun moves off the heap.'),
          ],
        },
      },
    ],
    complete: {
      id: 'a14-16-complete',
      lines: [
        N('Later, Eumaeus comes out and finds you there. He looks at the dog for a long time.'),
        EP('He was a good dog. The best. He’d have known the master anywhere, if the master had come.', 'sad'),
        N('Eumaeus doesn’t know, and you don’t tell him. That isn’t yours to tell.'),
        N('Together you carry Argos out to the edge of the fields, under an olive tree. Your Nubbin pats the earth down flat with its paws.'),
      ],
    },
    rewards: [],
    sets: { 'a14-16': true },
    notes:
      'NAME PAYOFF (a14-name). The step 2 scene shown, a14-16-gate, is for dont: under his breath, "Nobody." For ' +
      'shout play A14_VARIANTS a14-16-gate-shout (he wipes his eyes, as in Homer); for silence play ' +
      'a14-16-gate-silence (he looks at you, once). CORVIN: if a14-corvin is set, play a14-16-sit-corvin in place of ' +
      'a14-16-sit (he sits with Argos; his cold hands are warm now). HAZEL’S MARGIN NOTE: if the campaign is already ' +
      'finished when this complete scene ends, play a14-margin-hazel (or a14-margin-hazel-family with corvinGate = ' +
      'family) straight after it; otherwise it waits (see the file header). CARE: Argos is gentle and grave, like ' +
      'Fossil. He is old, thin and tick-ridden but never shown suffering; his death is the head going down and not ' +
      'lifting. Argos never speaks and has no thought bubbles. His recognition is in our own words (Butler’s Book ' +
      'XVII line is [unverified]). The burial under the olive is ours, not Homer’s. The goatherd (Melanthius) is not ' +
      'named and is never punished. The gold and silver dogs of A14-7 are the deliberate contrast.',
  },

  // ---------------------------------------------------------------- A14-17
  {
    id: 'a14-17',
    code: 'A14-17',
    title: 'The Scar',
    source: `${ODY}, Book XIX: Penelope and the beggar; Eurycleia; the dream`,
    audience: 'all',
    trigger: { where: WHERE, when: after('A14-16') },
    requires: ['A14-16'],
    speakers: [PENELOPE, BEGGAR, EURYCLEIA],
    steps: [
      {
        id: 'a14-17-s1',
        goal: 'Sit by the fire while Penelope questions the beggar.',
        hint: 'Wait in the hall after the suitors go home.',
        check: 'talk:a14-penelope:hearth',
        scene: {
          id: 'a14-17-hearth',
          lines: [
            N('Night, and the suitors have gone home to bed. The hall is a mess of cups and crusts and spilt wine.'),
            N('Penelope comes down from her room and sits in her chair by the fire, the one inlaid with ivory and silver.'),
            PE('Stranger, first I’ll ask what everyone asks. Who are you? Where are you from? Who are your people?'),
            B('Ask me anything but that. If I start remembering I’ll cry, and your maids will say I’m drunk.', 'sad'),
            PE('Since he went, I have no beauty and no strength left. These men wear me out. I wove a shroud to keep them off, and they caught me.', 'sad'),
            N('Then the beggar tells her a long tale: that he is from Crete, and once had Odysseus as a guest in his house, on the way to Troy.'),
            PE('Then tell me what he wore. If you can, I’ll believe you.', 'think'),
            B('A purple cloak, double, with a gold brooch. On it a hound held a fawn in its paws as it struggled. Everyone stared at that brooch.', 'soft'),
            N('Penelope weeps, the way snow melts on the high mountains when the wind changes. She gave him that cloak herself.'),
            B('He’s near. He’s alive. He’ll be home within the year, between the old moon and the new.', 'soft'),
          ],
          choices: [
            {
              id: 'eyes',
              label: 'Look at the beggar’s eyes.',
              then: [N('His eyes are dry. He is holding them dry, like a man holding a door shut against the wind.')],
            },
            {
              id: 'cloth',
              label: 'Pass Penelope a cloth for her eyes.',
              then: [PE('Thank you. You’re a kind guest. You keep strange company, but you’re kind.', 'soft')],
            },
            {
              id: 'nubbin',
              label: 'Let your Nubbin sit at Penelope’s feet.',
              then: [N('Your Nubbin sits at her feet and leans on her ankle. She puts her hand down to it without looking, the way you do with an old dog.')],
            },
          ],
        },
        done: {
          id: 'a14-17-hearth-done',
          lines: [
            PE('You’re my guest now. Nurse! Come and wash this man’s feet. He’s the age your master would be.'),
            B('Not one of the young ones. They’ll laugh. If you have an old woman who has suffered as much as I have, let her do it.', 'think'),
          ],
        },
      },
      {
        id: 'a14-17-s2',
        goal: 'Hold the lamp while the old nurse washes his feet.',
        hint: 'Stand by the basin with the lamp.',
        check: 'inspect:a14-scar:basin',
        scene: {
          id: 'a14-17-scar',
          lines: [
            N('Old Eurycleia brings a shining basin and pours in cold water, and then hot.'),
            EU('Gladly, for her sake and for yours. Many strangers have come here, and none so like him. The feet, the voice.', 'think'),
            B('Everyone who saw us both says so.', 'think'),
            N('He turns quickly away from the firelight, into the shadow. Too late: he has remembered the scar.'),
            N('Long ago, as a boy, hunting on Mount Parnassus with his grandfather’s sons, a boar ran at him and tore his leg above the knee.'),
            N('Eurycleia runs her hands down his leg, and finds it, and knows it. She lets go, and his foot drops into the basin.'),
            N('The bronze rings and the basin tips. The water runs all over the floor.'),
            EU('You’re Odysseus. You are. My child. And I didn’t know you till I touched you.', 'shock'),
            N('She turns to tell Penelope. But Penelope is looking the other way: Athena has turned her thoughts elsewhere.'),
            N('The beggar puts his hand over the old woman’s mouth and draws her close.'),
            B('Nurse. Do you want to ruin me? You nursed me yourself. Be quiet. Nobody must know. Nobody.', 'angry'),
          ],
          choices: [
            {
              id: 'mop',
              label: 'Mop up the water, quickly.',
              then: [N('You mop it up with a cloth, fast, and fetch more hot water, so it looks like a spill. Penelope doesn’t turn round.')],
            },
            {
              id: 'watch',
              label: 'Watch Penelope.',
              then: [N('You watch Penelope, who is looking into the fire, very still. Whether she heard, you will never be sure.')],
            },
            {
              id: 'still',
              label: 'Keep still and say nothing.',
              then: [N('You keep still. Eurycleia’s eyes go to you over his hand, and you nod, and she nods back.')],
            },
          ],
        },
        done: {
          id: 'a14-17-scar-done',
          lines: [
            EU('I’ll be as silent as stone, or iron.', 'soft'),
            B('Hush, now. Fetch me more water. You spilt the last.', 'soft'),
          ],
        },
      },
      {
        id: 'a14-17-s3',
        goal: 'Hear Penelope’s dream.',
        hint: 'Stay by the fire while she talks.',
        check: 'talk:a14-penelope:dream',
        scene: {
          id: 'a14-17-dream',
          lines: [
            PE('Stranger, one more thing, and then I’ll let you sleep. I had a dream. Tell me what it means.'),
            PE('I keep twenty geese in the yard. I love to watch them peck their grain. In my dream a great eagle came down from the mountain.'),
            PE('When he flew off again, the geese were gone, every one. I wept, and the women came to comfort me.'),
            PE('Then the eagle came back and sat on the roof-beam, and spoke with a man’s voice. “I am your husband,” he said, “come home.”'),
            B('There’s only one way to read that, lady. The eagle told you himself.', 'soft'),
            PE('Dreams are hard to read. They come to us through two gates: one made of horn, and one of ivory.', 'think'),
            PE('The dreams that come through the ivory gate deceive us. The ones through the gate of horn come true. I don’t think mine came through the horn.', 'sad'),
            N('Two gates. You think of yours, at home, and how it sticks, and how you always know who has come through it.'),
            PE('Tomorrow I’ll set them a test: my husband’s bow, and twelve axes in a row. Whoever can string the bow and shoot through all twelve, I’ll go with.', 'sad'),
            B('Do it. Don’t put it off. He’ll be here before any of them can string it.', 'soft'),
          ],
        },
        done: {
          id: 'a14-17-dream-done',
          lines: [
            N('Penelope goes up to her room and cries for her husband until Athena closes her eyes in sleep.'),
            N('The beggar lies down in the porch on an ox-hide, with fleeces over him. He doesn’t sleep, and neither do you.'),
          ],
        },
      },
    ],
    complete: {
      id: 'a14-17-complete',
      lines: [
        N('In the night the beggar hears some of the maids going out, laughing, to meet the suitors.'),
        N('His heart growls in his chest like a dog standing over her pups. He tells it to be still: it has borne worse.'),
        B('In the cave, with the giant, I had to wait. I waited then. I can wait one more night.', 'soft'),
        N('Your Nubbin has fallen asleep against his back. He lets it.'),
      ],
    },
    rewards: [],
    sets: { 'a14-17': true },
    notes:
      'The washing beat is quick and physical (the foot, the basin, the spill); the hand over Eurycleia’s mouth is ' +
      'firm, not violent, and she is never hurt. Her offer to name the false maids (Book XIX) is cut, and the maids ' +
      'going out at night are only heard. The two gates of dreams (horn and ivory, Book XIX) are the line’s gate ' +
      'theme, and a14-17-dream#7 ties them to the Grove’s gate without naming Hazel. Penelope’s dream is told with ' +
      'the geese simply "gone".',
  },

  // ---------------------------------------------------------------- A14-18
  {
    id: 'a14-18',
    code: 'A14-18',
    title: 'The Bow',
    source: `${ODY}, Book XXI: the trial of the bow`,
    audience: 'all',
    trigger: { where: WHERE, when: after('A14-17') },
    requires: ['A14-17'],
    speakers: [PENELOPE, TELEMACHUS, ANTINOUS, BEGGAR],
    steps: [
      {
        id: 'a14-18-s1',
        goal: 'Help carry the axes into the hall.',
        hint: 'Bring the axes from the storeroom, two at a time.',
        check: 'carry:a14-axes:hall',
        scene: {
          id: 'a14-18-axes',
          lines: [
            N('Morning: a feast day for Apollo the archer. The suitors come early, as they always do, and sit down to eat.'),
            N('Penelope climbs to the high storeroom with a bronze key on an ivory handle. The doors groan open like a bull in a meadow.'),
            N('Inside, on a peg, hangs the great bow in its case. A friend gave it to Odysseus long ago, as a guest-gift.'),
            N('He never took it to Troy. He left it at home, to remember his friend by.'),
            N('Penelope sits down with the bow across her knees and cries over it. Then she gets up and carries it down to the hall.'),
            PE('Listen to me, all of you. Here is my husband’s bow. Whoever strings it most easily and shoots through all twelve axes, I’ll go with him.', 'sad'),
            N('Telemachus digs a long trench in the floor, straight to a line, and sets the axes up one behind another. You carry them in, two at a time.'),
            N('Each axe-head has a ring at the top where the handle would go: twelve rings, in one straight line, for an arrow to pass through.'),
            T('I’ll try it first. If I can string it, my mother can stay here with me.'),
            N('Three times he tries, and the fourth time he nearly has it. Then he sees the beggar give the smallest shake of the head, and stops.'),
          ],
          choices: [
            {
              id: 'nod',
              label: 'Nod at Telemachus.',
              then: [
                T('Too weak. Too young. Or the gods are against it. Let someone stronger try.'),
                N('He says it well. He sits down near his father, and nobody notices that either.'),
              ],
            },
            {
              id: 'pass',
              label: 'Pass the bow along to the suitors.',
              then: [N('You carry it down the line. It is heavier than any bow you’ve ever held, and the string hums faintly when you touch it.')],
            },
            {
              id: 'watch',
              label: 'Watch the beggar.',
              then: [N('The beggar is looking at the bow the way you’d look at an old friend across a crowded room.')],
            },
          ],
        },
        done: {
          id: 'a14-18-axes-done',
          lines: [N('The suitors line up to try, from left to right, the way the wine goes round.')],
        },
      },
      {
        id: 'a14-18-s2',
        goal: 'Watch the suitors try the bow.',
        hint: 'Stand where you can see the bow and the door.',
        check: 'watch:a14-suitors:bow',
        scene: {
          id: 'a14-18-suitors',
          lines: [
            N('Leodes tries first: the only one of them who ever disapproved of the rest. His soft hands can’t bend it an inch.'),
            AN('Warm it at the fire. Grease it with fat. It’s only stiff from the storeroom.'),
            N('They warm it and grease it. One after another they try, and fail, and pass it on, red in the face.'),
            N('Only Antinous and Eurymachus, the strongest, haven’t tried yet. They are taking their time.'),
            N('Out in the yard the beggar is talking to Eumaeus, low. Then he pulls back his rags and shows him the scar.'),
            N('Eumaeus sits down on the step as if his legs have gone. Then he gets up and hugs the beggar, and kisses his head and his shoulders.'),
            B('Go and tell the nurse to lock the women’s doors. And bar the yard gate, Eumaeus. Tie it with a rope.', 'think'),
            N('Eumaeus ropes the yard gate shut and tests it twice. It doesn’t stick; it just holds.'),
          ],
          choices: [
            {
              id: 'door',
              label: 'Stand by the hall door with Eumaeus.',
              then: [N('You stand by the door with Eumaeus, who is shaking. He tells you, very quietly, that he has never been so happy in his life.')],
            },
            {
              id: 'stool',
              label: 'Go and stand by the beggar’s stool.',
              then: [N('You go and stand by his stool. He puts a hand on your shoulder for a moment, like a man steadying himself.')],
            },
            {
              id: 'nubbin',
              label: 'Keep your Nubbin close.',
              then: [N('You pick up your Nubbin and hold it. It’s going to get loud in here; it already is.')],
            },
          ],
        },
        done: {
          id: 'a14-18-suitors-done',
          lines: [N('Eurymachus tries, and fails, and groans. Antinous says it’s a holy day, no day for bending bows: they’ll try again tomorrow.')],
        },
      },
      {
        id: 'a14-18-s3',
        goal: 'See the beggar string the bow.',
        hint: 'Watch from beside his stool.',
        check: 'watch:a14-beggar:bow',
        scene: {
          id: 'a14-18-string',
          lines: [
            B('My lords, let me try the old bow. I’d like to know if there’s any strength left in these old arms.'),
            AN('You? A beggar? You’re lucky we let you eat with us. Drink your wine and be quiet.', 'angry'),
            PE('Antinous, it isn’t right to insult a guest in this house. Do you think, if he strings it, he’ll take me home? He doesn’t think so himself.', 'angry'),
            T('The bow is mine to give, Mother. Go up to your room. I’ll see to this.', 'soft'),
            N('She goes, wondering at her son, and upstairs Athena puts her into a deep sleep. She will hear nothing of what comes next.'),
            N('Eumaeus carries the bow down the hall through the shouting and puts it into the beggar’s hands.'),
            N('He turns it over and over, feeling along it for worm in the horn after so many years. The suitors snigger.'),
            N('Then, as easily as a bard fits a new string to his lyre, he strings the great bow, without even standing up.'),
            N('He plucks the string. It sings, clear and sweet, like a swallow.'),
            N('Out of a clear sky Zeus thunders, once, and the hall goes white. The beggar smiles.'),
            N('He fits an arrow, and from where he sits he draws, and lets fly. It goes clean through all twelve axes and out the other side.'),
            B('Telemachus, your guest hasn’t shamed you. I didn’t miss, and I didn’t take long over the stringing. There’s strength in me yet.', 'soft'),
          ],
        },
      },
    ],
    complete: {
      id: 'a14-18-complete',
      lines: [
        N('The hall is silent. Somewhere outside, a dog barks, and stops.'),
        N('Telemachus picks up his sword and spear and comes and stands by his father’s chair, armed in bronze.'),
        N('The beggar stands up, and he isn’t stooping any more. He hasn’t been for a while, and nobody noticed.'),
        N('You hold your Nubbin a little tighter. It is very quiet in the hall.'),
      ],
    },
    rewards: [],
    sets: { 'a14-18': true },
    notes:
      'The bow was a guest-gift from a friend (Iphitus, Book XXI; not named on screen), which is why it becomes your ' +
      'guest-gift in A14-19. The stringing is the line’s great held breath: slow it down, one beat per line, and let ' +
      'the plucked string ring (a clear high note, original). Zeus’s thunder is a single roll from a clear sky, with ' +
      'dignity. The roped yard gate (a14-18-suitors#7) is a quiet rhyme with the Grove’s: it holds, it doesn’t stick. ' +
      'Philoetius the cowherd is left out to keep the cast small.',
  },

  // ---------------------------------------------------------------- A14-19
  {
    id: 'a14-19',
    code: 'A14-19',
    title: 'The Hall Cleared',
    source: `${ODY}, Book XXII, softened: the suitors driven out`,
    audience: 'all',
    trigger: { where: WHERE, when: after('A14-18') },
    requires: ['A14-18'],
    speakers: [ODYSSEUS, TELEMACHUS, EURYMACHUS],
    steps: [
      {
        id: 'a14-19-s1',
        goal: 'Stand behind him in the doorway.',
        hint: 'Stay just behind the threshold with Telemachus and Eumaeus.',
        check: 'watch:a14-threshold:doorway',
        scene: {
          id: 'a14-19-threshold',
          lines: [
            N('He throws off his rags. He leaps up onto the great stone threshold with the bow and the quiver, and pours the arrows out at his feet.'),
            N('Telemachus stands on one side of him and Eumaeus on the other, with spears. You are just behind, with your Nubbin.'),
            N('His first arrow knocks the gold cup out of Antinous’s hand as he lifts it to drink. The wine goes everywhere.'),
            N('The suitors look round the walls for the shields and spears that always hang there. The walls are bare: Telemachus took them down last night.'),
            O('You thought I’d never come home from Troy. You ate my house. You courted my wife while I was alive. You didn’t fear the gods.', 'angry'),
            N('He doesn’t say his name, and he doesn’t need to. Every face in the hall has gone the colour of whey.'),
            EM('If you really are Odysseus, home again, then you’re right, all of it. We’ll pay it back. Every sheep, every cup, twenty times over.', 'shock'),
            O('Not if you gave me everything your fathers ever had. This is my house.', 'angry'),
          ],
          choices: [
            {
              id: 'stand',
              label: 'Stand with Telemachus.',
              then: [N('You stand by Telemachus. He’s trembling, and so are you, and neither of you moves.')],
            },
            {
              id: 'gate',
              label: 'Slip out and untie the rope on the yard gate.',
              then: [N('You slip out and untie the rope, and leave the yard gate standing open. Whatever happens in there, there should be a way out.')],
            },
            {
              id: 'nubbin',
              label: 'Put your Nubbin behind you.',
              then: [N('You put your Nubbin behind you. It puts its paws on the backs of your knees, to be sure you’re still there.')],
            },
          ],
        },
        done: {
          id: 'a14-19-threshold-done',
          lines: [N('Eurymachus draws his sword and shouts to the others to rush the door. Nobody wants to be first, and then everyone moves at once.')],
        },
      },
      {
        id: 'a14-19-s2',
        goal: 'Hold your ground as Athena comes.',
        hint: 'Stay in the doorway. Don’t run.',
        check: 'watch:a14-aegis:hall',
        scene: {
          id: 'a14-19-aegis',
          lines: [
            N('Then there is someone else in the doorway: old Mentor, or someone wearing his face. Then a swallow flies up to the smoky roof-beam and sits there.'),
            N('From the roof Athena raises the aegis, the shield of Zeus. It touches no one; it doesn’t need to.'),
            N('Terror goes through the hall like a wind. The suitors scatter like cattle when the gadfly gets among them in the long days of spring.'),
            N('They run: out of the side door, over the courtyard wall, through the yard and down the road to the town. Cups and stools go flying.'),
            N('Antinous runs fastest of all, with his cloak over his head. Eurymachus is not far behind.'),
            N('Odysseus stands in the doorway and lets them go. Not one arrow leaves the quiver.'),
            N('Then they are gone, down the road into the town, and they don’t come back. Not that night, and not ever.'),
          ],
        },
        done: {
          id: 'a14-19-aegis-done',
          lines: [...A14_EMPTY],
        },
      },
      {
        id: 'a14-19-s3',
        goal: 'Help set the hall straight.',
        hint: 'Collect the cups from under the tables.',
        check: 'collect:a14-hall:cups',
        scene: {
          id: 'a14-19-clean',
          lines: [
            N('Old Eurycleia comes running from the women’s rooms, sees the empty hall, and opens her mouth to cheer.'),
            O('No. Be glad in your heart, nurse, and keep quiet. It isn’t right to crow over beaten men.', 'soft'),
            N('Under a table, hugging his lyre, is Phemius the bard. Beside him, under a cowhide, is Medon the herald.'),
            T('Father, leave them be. Phemius only sang because they made him. Medon looked after me when I was small.', 'soft'),
            O('Come out, both of you. You’re safe. Go and tell people that doing right is better than doing wrong.', 'soft'),
            N('Then the work. The maids carry out the broken stools, Telemachus and Eumaeus scrape the tables, and you collect cups from under everything.'),
            N('Odysseus asks for fire and sulphur to make the hall clean, and lights the fire himself. The smoke goes up through the roof, out over Ithaca.'),
          ],
          choices: [
            {
              id: 'cups',
              label: 'Stack the cups by the door.',
              then: [N('Forty-one cups: you count. Your Nubbin finds a forty-second under the bard’s chair.')],
            },
            {
              id: 'maids',
              label: 'Help the maids with the stools.',
              then: [N('The maids work fast and don’t talk. One of them, the one who told about the loom, works fastest of all, and won’t look up.')],
            },
            {
              id: 'bard',
              label: 'Sit with the shaking bard a while.',
              then: [N('You sit with Phemius on the step. His hands won’t stop shaking, so he tunes his lyre, very badly, until they do.')],
            },
          ],
        },
        done: {
          id: 'a14-19-clean-done',
          lines: [N('The hall is clean and the fire burns clear. Eurycleia goes up the stairs to wake Penelope, and nearly falls over her own feet.')],
        },
      },
    ],
    complete: {
      id: 'a14-19-complete',
      lines: [
        O('You stood in my door when it mattered. Guest-friend. Come here.', 'soft'),
        N('He takes the great bow and unstrings it, carefully, and puts it into your hands.'),
        O('A friend gave me this once, a guest-friend, long ago. I never took it to war. I kept it at home, over the door, to remember him by.'),
        O('Do the same. Keep it unstrung, over your own door, and remember you had a friend on Ithaca.', 'soft'),
      ],
    },
    rewards: [
      {
        id: 'a14-great-bow',
        kind: 'decor',
        label: 'The Great Bow, Unstrung',
        description: 'Odysseus’s guest-gift: the great bow, unstrung, hung over the cottage door. It is for remembering a friend by, not for shooting.',
      },
    ],
    sets: { 'a14-19': true },
    notes:
      'SOFTENED, AND WE SAY SO (see the header’s care notes). In Homer every suitor is killed here; on this page ' +
      'Athena’s aegis drives them out and they run to the town and never come back. No one is hit: the first arrow ' +
      'only knocks the cup from Antinous’s hand. Nobody is punished afterwards: the maids help clear the hall, and the ' +
      'one who told about the loom (A14-2) is only seen working. The aegis is drawn as a great shield held up in the ' +
      'smoke under the roof, with a cold wind of fear; no faces of terror in close-up. From a14-19-threshold#0 he is ' +
      'Odysseus again (speaker a14-odysseus), but he never says his own name (the dont payoff waits for A14-20). ' +
      'CORVIN: if a14-corvin is set, play A14_VARIANTS a14-19-aegis-done-corvin in place of a14-19-aegis-done. The ' +
      '"gate" choice in step 1 is flavour: the suitors flee the same way in every route.',
  },

  // ---------------------------------------------------------------- A14-20
  {
    id: 'a14-20',
    code: 'A14-20',
    title: 'The Olive-Tree Bed',
    source: `${ODY}, Books XXIII–XXIV: the bed; Laertes; Athena’s peace`,
    audience: 'all',
    trigger: { where: WHERE, when: after('A14-19') },
    requires: ['A14-19'],
    speakers: [EURYCLEIA, PENELOPE, TELEMACHUS, ODYSSEUS, LAERTES, ATHENA],
    steps: [
      {
        id: 'a14-20-s1',
        goal: 'Wait in the hall while Penelope comes down.',
        hint: 'Sit on the step by the hearth and keep out of the way.',
        check: 'wait:a14-penelope:hall',
        scene: {
          id: 'a14-20-hall',
          lines: [
            EU('Wake up, child! He’s home. He’s here. The beggar in the hall was him all along. Telemachus knew!', 'happy'),
            PE('Nurse. You knew my son had sailed and said nothing for twelve days. Now you wake me with this?', 'angry'),
            EU('Eleven. And this time it’s true.'),
            PE('Nurse, the gods have made you mad. Why wake me? I was sleeping so well. I haven’t slept like that since he went.', 'angry'),
            N('Penelope comes down the stair, and stops. She sits down across the hearth from him in the firelight, and looks at him, and doesn’t speak.'),
            N('He sits by a pillar with his eyes down, waiting for her to say something. She doesn’t.'),
            T('Mother. Hard mother. Your heart’s harder than stone. Any other woman would have run to him after twenty years.', 'angry'),
            PE('Child, I can’t. I can’t speak, or ask, or look him in the face. If it is him, we have signs between us. Secret ones.', 'soft'),
            N('Odysseus smiles, then. He knows her.'),
            O('Leave your mother be, Telemachus. She’ll test me. Soon she’ll know me better.', 'soft'),
          ],
          choices: [
            {
              id: 'step',
              label: 'Sit down on the step, out of the way.',
              then: [N('You sit on the step. This part is theirs, and you’re only here to see it.')],
            },
            {
              id: 'look',
              label: 'Look at Penelope.',
              then: [N('She is looking at him the way she looked at her loom all those nights: row by row, checking every stitch.')],
            },
            {
              id: 'nubbin',
              label: 'Hold your Nubbin still.',
              then: [N('You hold your Nubbin still. It badly wants to go to one of them, and can’t decide which.')],
            },
          ],
        },
        done: {
          id: 'a14-20-hall-done',
          lines: [N('He goes to bathe. When he comes back Athena has made him taller and stronger, with hair curling like hyacinth petals, and he sits down across from her again.')],
        },
      },
      {
        id: 'a14-20-s2',
        goal: 'Stay while she tests him.',
        hint: 'Keep still by the hearth and listen.',
        check: 'inspect:a14-bed:olive',
        scene: {
          id: 'a14-20-bed',
          lines: [
            ...A14_BED,
            O('Penelope. It’s me. It’s Odysseus.', 'soft'),
            N('It is the first time he has said his own name under his own roof, and you hear it. It sounds different, said quietly, at home.'),
          ],
        },
        done: {
          id: 'a14-20-bed-done',
          lines: [
            N('You go quietly out of the hall with your Nubbin, and leave them by the fire. There is a lot to tell, and the night is as long as Athena has made it.'),
            N('Your Nubbin comes away with an olive leaf from the bedpost. The tree has plenty, and nobody is moving that bed.'),
          ],
        },
      },
      {
        id: 'a14-20-s3',
        goal: 'Go with him to his father’s orchard.',
        hint: 'Walk out to Laertes’s farm in the hills.',
        check: 'visit:a14-laertes:orchard',
        scene: {
          id: 'a14-20-orchard',
          lines: [
            N('Morning. Odysseus, Telemachus, Eumaeus and you walk out to old Laertes’s farm in the hills, among the vines.'),
            N('Laertes is alone in the orchard, digging round a young tree. His tunic is patched and dirty, with leather gaiters against the thorns.'),
            N('Odysseus stands under a tall pear tree and watches him, and can’t speak for a while.'),
            O('Old man, you know your work. Every plant here is cared for: fig and vine and olive and pear. Only you aren’t cared for.', 'soft'),
            LA('Who are you? Have you come from far off? I had a son once. I suppose he’s dead.', 'sad'),
            N('Odysseus begins to tell him a story, a clever one, and stops halfway. He can’t do it, not to this old man.'),
            O('Father, it’s me. I’m the one you’ve been grieving for. I’ve come home, in the twentieth year.', 'soft'),
            LA('If you’re my son, give me a sign. A real one.', 'think'),
            O('The scar, from the boar on Parnassus. And the trees. When I was little I followed you round this orchard asking the name of every tree.'),
            O('You gave me thirteen pear trees, ten apple trees and forty figs, and fifty rows of vines, each ripening at its own time.', 'soft'),
            N('Laertes’s knees give way. He puts his arms round his son’s neck, and Odysseus catches him as he falls.'),
          ],
          choices: [
            {
              id: 'count',
              label: 'Count the pear trees.',
              then: [N('You count them: thirteen, still. Some of them are very old now, and still bearing.')],
            },
            {
              id: 'stool',
              label: 'Fetch the old man a stool.',
              then: [N('You fetch a stool from the hut. Laertes sits, and holds on to his son’s hand, and won’t let go of it.')],
            },
            {
              id: 'nubbin',
              label: 'Let your Nubbin carry his gloves.',
              then: [N('Your Nubbin carries Laertes’s gardening gloves for him, one at a time, and lays them very carefully on the wall.')],
            },
          ],
        },
        done: {
          id: 'a14-20-orchard-done',
          lines: [
            LA('Father Zeus, the gods are still on Olympus after all, if those men have had what they deserved.', 'soft'),
            N('Then the families of the suitors come up the road from the town, angry, with spears, wanting payment for their shame.'),
          ],
        },
      },
    ],
    complete: {
      id: 'a14-20-complete',
      lines: [...A14_PEACE, ...A14_HOME],
    },
    rewards: [
      {
        id: 'a14-penelope-loom',
        kind: 'decor',
        label: 'Penelope’s Loom',
        description: 'A tall loom for the cottage. Its cloth grows by one woven band each time you finish an Atlas page, and nobody ever unpicks it.',
      },
      {
        id: 'a14-olive-sapling',
        kind: 'decor',
        label: 'The Bed-Tree Olive',
        description: 'An olive sapling by the pond, grown from a cutting of the tree Odysseus built his bed around.',
      },
      {
        id: 'a14-great-voyage-bookmark',
        kind: 'item',
        label: 'Great Voyage Bookmark',
        description: 'A strip of sailcloth with a little ship drawn on it. It marks the Ithaca page, and counts towards the Great Voyage festival.',
      },
    ],
    sets: { 'a14-20': true, 'a14-done': true },
    notes:
      'NAME PAYOFF (a14-name). The step 2 scene shown, a14-20-bed, is for dont: he says his own name aloud for the first ' +
      'time under his own roof, and you hear it. For shout play A14_VARIANTS a14-20-bed-shout (he tells Penelope a friend ' +
      'once shouted his name with him at a giant, that it cost him ten years, and that he isn’t sorry about the company). ' +
      'For silence play a14-20-bed-silence in step 2, and a14-20-complete-silence in place of a14-20-complete (he ' +
      'thanks you "for not telling me what I already knew"). LIFTED TEXT: none; the olive passage Part M lists is ' +
      '[unverified], so a14-20-bed#5–6 tell it in our own words. Laertes’s trees (13 pear, 10 apple, 40 fig, 50 rows ' +
      'of vines) are Homer’s numbers. CARE: the families’ revenge (Book XXIV) is cut to the road and Athena’s peace; ' +
      'no blow is struck. Athena’s words are brief and commanding, Zeus’s thunder one roll. Odysseus’s test of Laertes ' +
      '(a cruel tale in Homer) is cut short by his own pity. CLOSE: straight after the complete scene, play ' +
      'a14-close-family if a14-corvin is set; otherwise a14-close-guest or a14-close-shut by corvinGate; nothing if ' +
      'corvinGate is unset. SIM: (a) Penelope’s loom is a cottage decoration whose cloth grows by one band per ' +
      'finished Atlas page, read through atlasDone(id) across every page (never by chores, never by time); the bands ' +
      'take each page’s colours. (b) The olive sapling is placed by the pond. (c) The Great Voyage festival (A2, A6, ' +
      'A9, A10, A12, A14, A19, any two) reads atlasDone(\'A14\').',
  },
];

// =================================================================== variants

/**
 * Variant scenes chosen by flags. Each quest's notes say which scene each one replaces.
 *   a14-name (A14-8): a14-14-harbour-*, a14-16-gate-*, a14-20-bed-*, a14-20-complete-silence.
 *   corvinGate (Grove, read-only) and a14-corvin: a14-corvin-joins, a14-16-sit-corvin,
 *     a14-19-aegis-done-corvin, a14-close-family, a14-close-guest, a14-close-shut.
 *   Campaign finished (Grove, read-only): a14-margin-hazel, a14-margin-hazel-family.
 */
export const A14_VARIANTS: Scene[] = [
  // ---------------------------------------------------------------- Corvin joins (corvinGate = family)
  {
    id: 'a14-corvin-joins',
    lines: [
      N('When the page opens, someone is standing on it beside you who wasn’t there before: Corvin Vale, in his good coat, a little out of breath.'),
      C('I saw the atlas open on the step. I hope you don’t mind. There’s no gate on a page, so I couldn’t knock.', 'soft'),
      C('I know something about the long way home.', 'soft'),
      N('Your Nubbin looks at him for a long moment. Then it walks on ahead, which means he can come.'),
    ],
    set: { 'a14-corvin': true },
  },
  // ---------------------------------------------------------------- A14-14, step 2 (shout, silence)
  {
    id: 'a14-14-harbour-shout',
    lines: [...A14_HARBOUR, B('And you. Not a word this time. Not even a little one.', 'happy')],
  },
  {
    id: 'a14-14-harbour-silence',
    lines: [...A14_HARBOUR, B('You won’t say anything. You never do. I’m counting on it.', 'soft')],
  },
  // ---------------------------------------------------------------- A14-16, step 2 (shout, silence)
  {
    id: 'a14-16-gate-shout',
    lines: [...A14_GATE, N('The beggar turns his face away and wipes a tear off quickly, so that Eumaeus won’t see.'), ...A14_GATE_END],
  },
  {
    id: 'a14-16-gate-silence',
    lines: [...A14_GATE, N('The beggar looks at you, once. That’s all.'), ...A14_GATE_END],
  },
  // ---------------------------------------------------------------- A14-16, step 3 (Corvin)
  {
    id: 'a14-16-sit-corvin',
    lines: [
      ...A14_SIT_START,
      N('Corvin comes back out through the gate and sits down on the ground on your other side, in his good coat.'),
      N('He puts a hand on the old dog’s back. His hands were cold for twenty-two years; they are warm now, and Argos leans into the warmth.'),
      C('Twenty years on a heap, waiting. Nobody waited for me like that.', 'sad'),
      C('No. That isn’t true, is it. Somebody did.', 'soft'),
      ...A14_SIT_END,
    ],
    choices: A14_SIT_CHOICES,
  },
  // ---------------------------------------------------------------- A14-19, step 2 done (Corvin)
  {
    id: 'a14-19-aegis-done-corvin',
    lines: [
      ...A14_EMPTY,
      C('I was them once. I opened a gate and let them in.', 'sad'),
      N('Nobody answers him. He looks at the hall: the spilt wine, the broken stools, the open door.'),
      C('Driven out is right. Some of them come back better.', 'soft'),
    ],
  },
  // ---------------------------------------------------------------- A14-20, step 2 (shout, silence)
  {
    id: 'a14-20-bed-shout',
    lines: [
      ...A14_BED,
      O('A friend once shouted my name with me, at a giant. It cost me ten years.', 'soft'),
      O('I’m not sorry about the company.', 'happy'),
      N('Penelope looks at you over his shoulder. She will want to hear all of it later, every word.'),
    ],
  },
  {
    id: 'a14-20-bed-silence',
    lines: [...A14_BED, N('Penelope looks at you over his shoulder for a moment, as if to ask who you are. Then she doesn’t mind.')],
  },
  // ---------------------------------------------------------------- A14-20, complete (silence)
  {
    id: 'a14-20-complete-silence',
    lines: [
      ...A14_PEACE,
      O('And thank you. For saying nothing, that day on the ship. For not telling me what I already knew.', 'soft'),
      ...A14_HOME,
    ],
  },
  // ---------------------------------------------------------------- closing the atlas (corvinGate)
  {
    id: 'a14-close-family',
    lines: [
      N('When you close the atlas, Corvin is sitting on the step beside you, rubbing his hands together. They’re warm, and he keeps checking.'),
      C('He came home, and his dog knew him. I’ll be thinking about that for a week.', 'soft'),
      N('He gets up and goes to the gate, and lifts and pushes, and goes out. It sticks behind him, the way it does for everyone who belongs here.'),
    ],
  },
  {
    id: 'a14-close-guest',
    lines: [
      N('When you close the atlas it is evening in the Grove, and somebody is at the gate.'),
      N('It is Corvin Vale, with his hands on the top bar. He doesn’t try the latch; he knocks on the gatepost, twice, and waits.'),
      C('I saw the light. I won’t stay. I only wanted to see that you’d come back.', 'soft'),
      N('You lift and push, and let him in for a cup of tea. He watches your hands, and you turn them so he can’t quite see.'),
    ],
  },
  {
    id: 'a14-close-shut',
    lines: [
      N('When you close the atlas it is evening in the Grove. You go down to the gate, for no reason you could name.'),
      N('The lane beyond it is empty. Nobody is standing there.'),
      N('You lift and push, out of habit, and it sticks, as it always does. You stand there a while anyway, listening.'),
    ],
  },
  // ---------------------------------------------------------------- Hazel's margin note (campaign finished)
  {
    id: 'a14-margin-hazel',
    lines: [
      N('Nova’s atlas lies open at the Argos page: the gate, the heap, the old dog in the sun.'),
      N('In the margin, in soft pencil you have never noticed, there is a note. You know the hand.'),
      N('“Argos waited twenty years and knew him in rags.”'),
      N('“That’s why the gate sticks.”'),
      N('“So I’d hear. H.”', 'soft'),
      N('You sit with the page open. Outside, faintly, the gate creaks in the wind, and doesn’t open.'),
    ],
  },
  {
    id: 'a14-margin-hazel-family',
    lines: [
      N('Nova’s atlas lies open at the Argos page: the gate, the heap, the old dog in the sun.'),
      N('In the margin, in soft pencil you have never noticed, there is a note. You know the hand.'),
      N('“Argos waited twenty years and knew him in rags.”'),
      N('“That’s why the gate sticks.”'),
      N('“So I’d hear. H.”', 'soft'),
      N('Underneath, in a second hand, in ink, small and careful:'),
      N('“I came back. C.”', 'soft'),
      N('You sit with the page open. Outside, faintly, the gate creaks in the wind, and doesn’t open.'),
    ],
  },
];

// =================================================================== flags and checks

/** Every flag this line sets (Atlas save only). It reads corvinGate and "campaign finished", and writes no Grove flag. */
export const ATLAS_A14_FLAGS: string[] = [
  'a14-01',
  'a14-02',
  'a14-03',
  'a14-04',
  'a14-05',
  'a14-06',
  'a14-07',
  'a14-08',
  'a14-09',
  'a14-10',
  'a14-11',
  'a14-12',
  'a14-13',
  'a14-14',
  'a14-15',
  'a14-16',
  'a14-17',
  'a14-18',
  'a14-19',
  'a14-20',
  'a14-done', // A14-20: the whole page; read by atlasDone('A14') for the Great Voyage festival and Penelope's loom
  'a14-name', // dont | shout | silence (a14-08-shout): A14-14, A14-16, A14-20
  'a14-corvin', // true (a14-corvin-joins, corvinGate = family only): A14-16, A14-19 and the close
];

export const ATLAS_A14_CHECKS: string[] = [
  'visit:a14-ithaca:gate',
  'sit:a14-mentes:hearth',
  'watch:a14-penelope:stair',
  'talk:a14-telemachus:assembly',
  'watch:a14-antinous:assembly',
  'carry:a14-torch:loom',
  'visit:a14-pylos:shore',
  'escort:a14-telemachus:sparta',
  'talk:a14-menelaus:proteus',
  'explore:a14-ogygia:cave',
  'find:a14-odysseus:shore',
  'build:a14-raft:shore',
  'watch:a14-storm:raft',
  'swim:a14-scheria:coast',
  'sit:a14-olives:bank',
  'carry:a14-washing:river',
  'watch:a14-odysseus:bushes',
  'escort:a14-odysseus:town',
  'visit:a14-alcinous:hall',
  'sit:a14-feast:demodocus',
  'talk:a14-odysseus:name',
  'explore:a14-cave:cyclops',
  'give:a14-wine:cyclops',
  'escort:a14-crew:cave-door',
  'choose:a14-name:ship',
  'visit:a14-aeolus:island',
  'watch:a14-bag:hold',
  'visit:a14-aeolus:hall',
  'walk:a14-aeaea:woods',
  'feed:a14-pigs:sty',
  'watch:a14-circe:sty',
  'walk:a14-ocean:edge',
  'watch:a14-shades:edge',
  'sit:a14-odysseus:willows',
  'talk:a14-circe:advice',
  'place:a14-wax:ears',
  'watch:a14-sirens:mast',
  'watch:a14-strait:rocks',
  'visit:a14-thrinacia:shore',
  'climb:a14-fig:charybdis',
  'wait:a14-ship:ithaca',
  'talk:a14-athena:harbour',
  'visit:a14-eumaeus:hut',
  'feed:a14-pigs:yard',
  'watch:a14-telemachus:hut',
  'walk:a14-road:town',
  'find:a14-argos:gate',
  'sit:a14-argos:heap',
  'talk:a14-penelope:hearth',
  'inspect:a14-scar:basin',
  'talk:a14-penelope:dream',
  'carry:a14-axes:hall',
  'watch:a14-suitors:bow',
  'watch:a14-beggar:bow',
  'watch:a14-threshold:doorway',
  'watch:a14-aegis:hall',
  'collect:a14-hall:cups',
  'wait:a14-penelope:hall',
  'inspect:a14-bed:olive',
  'visit:a14-laertes:orchard',
];
