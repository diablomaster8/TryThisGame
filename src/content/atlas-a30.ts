/**
 * Atlas campaign, page A30: The Word on the Brow (Part M, rank 37). Thirteen quests, A30-1 to A30-13.
 *
 * SOURCE. The Golem of Prague, a Jewish legend of the Czech lands. It is set in the Jewish Town of
 * Prague in the late 1500s and was attached to Rabbi Judah Loew ben Bezalel (the Maharal, about
 * 1520–1609) by storytellers of the 1800s. Rights: the legend is traditional and public domain.
 * The lifted passages are from "Golem", The Jewish Encyclopedia, vol. 6 (Funk and Wagnalls, New
 * York, 1904; Ludwig Blau, Joseph Jacobs and Judah David Eisenstein), and from the Jewish
 * Publication Society's 1917 translation of the Psalms; both are US works out of copyright (legal
 * to confirm for the UK). The Talmud story in A30-2 (Sanhedrin 65b) is retold in our own words; no
 * modern translation is quoted. Nothing from any film, novel, comic, game or modern retelling.
 *
 * AUDIENCE. 'all', rated All with care (Part M). Every lifted line has a `childLines` replacement
 * for the Learning Grove. The Learning Grove's own edu version, led by Ori from the Hebrew
 * questline (alef, mem and tav; right to left; אֱמֶת emet and, in the reader band, מֵת met; the
 * first, middle and last letters; Prague and its river; the Sabbath as a day of rest; "You know
 * alef. The quiet one goes first." if LH2 is done), is a separate file still to do. This file
 * gives only `childLines`, as the script brief asks of Atlas pages.
 *
 * FRAME. Nova's atlas falls open at a page drawn in brown ink: a steep-roofed synagogue, a lane of
 * small houses, a river. The intro card (a30-01-page#1–4) says this is a legend, that Rabbi Loew
 * was real and the golem was told about him long after, and that the page follows the 1904
 * encyclopedia and the tellings after it. You lodge with Avram, the synagogue caretaker, his wife
 * Dvora and their children Rivka, Shmuel and little Mirele (our inventions). You are a lodger and
 * a willing pair of hands: the rabbi, his helpers and the Jewish Town keep their story. Your Nubbin
 * never talks, and nor does Yossele. Running thread: from A30-6 your Nubbin follows the golem
 * everywhere, a step behind, like a duckling, and in A30-12 it sits at the foot of the attic wall.
 *
 * GROVE FLAGS READ (read-only; the Atlas never writes a Grove flag):
 *   - cinder (S19: forgiven | remembered). Your Nubbin carries Cinder's Ember (S19's red pebble) in
 *     a little lantern on this page. Inserts: a30-01-ember (A30-1), a30-10-ember (A30-10, step 2:
 *     the ember flares as Yossele grows) and a30-10-ember-settle (A30-10, step 3: it settles when
 *     the clay falls). S19 only opens when keptStone is false, so cinder and keptStone never both
 *     hold.
 *   - keptStone. Insert a30-13-kept (A30-13, step 1): the rabbi asks what is in your pocket. A
 *     choice with no flag. Nothing else changes.
 *   - s24Done (S24). Hazel's margin note beside the attic (A30-12): a30-margin-hazel, its text as
 *     the outline gives it.
 *   - The campaign chapter, mossFaded and the ending id (CampaignState.ending), for the Grove
 *     keepsake scene, checked in this order: a30-grove-tile-quiet (no Moss line) unless the campaign
 *     is past chapter 4 (c4-out seen, so he has come down), mossFaded is false and the ending is not
 *     moss-sleeps; then a30-grove-tile-cinder if cinder is set; otherwise a30-grove-tile.
 *
 * FLAGS WRITTEN (Atlas save only, all prefixed a30-):
 *   - a30-01 … a30-13: each quest on completion. a30-done: the whole page (A30-13); the Price of
 *     Power festival reads it through atlasDone('A30').
 *   - a30-order = safe | help | sit (A30-7, a30-07-order): the signature choice, Yossele's standing
 *     order. It pays off in A30-9 (a30-09-order-*), A30-10 (a30-10-grow-*), and A30-13
 *     (a30-13-order-*, the tile's pawprint, and the last image: a30-13-complete for safe, the
 *     barred shutter; a30-13-complete-help, the broom; a30-13-complete-sit, the clay bird).
 *
 * LIFTED TEXT (verbatim, each used once, each keyed in `childLines`; set with the game's curly
 * quotes):
 *   1. Jewish Encyclopedia 1904, "Golem": "The Shem was written on a piece of paper and inserted
 *      either in the mouth or in the forehead of the golem." Narration, a30-06-tellings#3, as the
 *      older tellings; the rabbi gives the outline's adapted line in his own words at #4.
 *   2. Jewish Encyclopedia 1904, "Golem": "Once the rabbi forgot to extract the Shem, and feared
 *      that the golem would desecrate the Sabbath." Narration, a30-10-psalm#5.
 *   3. Jewish Encyclopedia 1904, "Golem" (of the golem of Chełm): "Finally he extracted the Shem
 *      from the forehead of his golem, which returned to dust." The rabbi, a30-13-bench#6.
 *   4. Jewish Encyclopedia 1904, "Golem", a fragment: "…its remains are said to be still among the
 *      débris in the attic of the synagogue." Narration, a30-12-stars#8 (leading ellipsis marks
 *      the excerpt).
 *   5. Psalm 139:16, JPS 1917, a fragment: "Thine eyes did see mine unformed substance" (the
 *      Hebrew word is golmi, the only place "golem" appears in the Bible). The rabbi,
 *      a30-02-question#3, with a trailing ellipsis.
 * Psalm 92 is named, never sung or printed. Every other line is original.
 *
 * CARE NOTES.
 *   - Jewish advisers (a rabbi and Jewish educators, ideally the Jewish Museum in Prague) read
 *     this script, the Hebrew and the Prague details before it is final.
 *   - The Name. The Divine Name is never written, spoken, shown or hinted at. The making in A30-5
 *     is seen from far off and heard as nothing. There is no ritual for the player, no "spell",
 *     and no Kabbalah as a mechanic. In our telling the word on the brow is emet, which anyone may
 *     read, and the rabbi says plainly that the older tellings differ (A30-6).
 *   - Rabbi Loew is wise, warm, a little dry and human, never a wizard. The page calls it a legend.
 *   - The Sabbath. The player does no work in the Sabbath scenes. A30-10's running is to fetch the
 *     rabbi before the Sabbath has come in for the congregation (the psalm is not finished), which
 *     is what the town does in the legend. The clay is carried up only after the Sabbath ends
 *     (A30-12, three stars out). The psalm is a murmur, never words.
 *   - Persecution. The threat stays outside the walls and unnamed: a lie, men gathering at night,
 *     lantern light at the end of a street. No blood libel, no Christian neighbours shown as a mob
 *     of villains, no violence on screen. Yossele standing there is enough to send them home.
 *   - The attic is a genizah, where worn-out holy books are laid to rest. Shown with respect: no
 *     horror, no jump scares, no "cursed attic".
 *   - Rated All. No one is hurt in A30-10; things break, and the narration says so.
 *   - Hebrew. The letters are drawn exactly as in Ori's alef-bet (LH2): alef, the silent letter
 *     that holds a vowel; mem; tav, the last letter. Lines that mix Hebrew and English need the
 *     dialogue box to handle bidirectional text (isolate each Hebrew run).
 */
import type { Line, Mood, Scene } from '../config/story';
import type { Quest, Speaker } from './types';

// ------------------------------------------------------------------ helpers

const say =
  (who: string) =>
  (text: string, mood?: Mood): Line =>
    mood ? { who, text, mood } : { who, text };

/** A source character, or one of our own residents of the page. */
const sp = (id: string, name: string, basedOn: string): Speaker => ({ id, name, kind: 'other', basedOn });

const WHERE = 'Nova’s atlas: the Word on the Brow page (Atlas campaign)';
const after = (code: string) => `Any time after ${code}, from Nova’s atlas.`;
const LEGEND = 'The Golem of Prague (Jewish legend, Czech lands; set in the late 1500s, told from the 1800s)';

// ------------------------------------------------------------------ speakers

const LOEW = sp(
  'a30-loew',
  'Rabbi Loew',
  'Rabbi Judah Loew ben Bezalel, the Maharal of Prague (about 1520–1609), a real scholar and teacher; the golem legend was attached to him in the 1800s. Original design',
);
const AVRAM = sp('a30-avram', 'Avram', 'The synagogue caretaker (our invention; the legend’s Jewish Town)');
const DVORA = sp('a30-dvora', 'Dvora', 'The caretaker’s wife (our invention)');
const RIVKA = sp('a30-rivka', 'Rivka', 'The caretaker’s daughter, who presses the clay tile (the outline; our invention)');
const SHMUEL = sp('a30-shmuel', 'Shmuel', 'The caretaker’s small son (our invention)');
const MIRELE = sp('a30-mirele', 'Mirele', 'The caretaker’s youngest (our invention)');
const HANNAH = sp('a30-hannah', 'Hannah', 'The baker in the lane (our invention)');
const ISAAC = sp('a30-isaac', 'Isaac', 'The rabbi’s son-in-law, one of his two helpers in later tellings of the legend');
const JACOB = sp('a30-jacob', 'Jacob', 'The rabbi’s pupil, his other helper in later tellings of the legend');
const STUDENT = sp('a30-student', 'A Student', 'A student in the study house (our invention)');
const STUDENT2 = sp('a30-student-2', 'Another Student', 'A student in the study house (our invention)');
const BOY = sp('a30-boy', 'A Boy', 'A boy sent running for the rabbi (our invention)');

const N = say('narrator');
const M = say('moss');
const LO = say('a30-loew');
const AV = say('a30-avram');
const DV = say('a30-dvora');
const RI = say('a30-rivka');
const SH = say('a30-shmuel');
const MI = say('a30-mirele');
const HA = say('a30-hannah');
const IS = say('a30-isaac');
const JA = say('a30-jacob');
const ST = say('a30-student');
const S2 = say('a30-student-2');
const BO = say('a30-boy');

// ------------------------------------------------------------------ lifted text (verified)

/** Jewish Encyclopedia, vol. 6 (1904), "Golem". */
const LIFT_SHEM = '“The Shem was written on a piece of paper and inserted either in the mouth or in the forehead of the golem.”';
/** Jewish Encyclopedia, vol. 6 (1904), "Golem". */
const LIFT_FORGOT = '“Once the rabbi forgot to extract the Shem, and feared that the golem would desecrate the Sabbath.”';
/** Jewish Encyclopedia, vol. 6 (1904), "Golem": the golem of Chełm. */
const LIFT_CHELM = '“Finally he extracted the Shem from the forehead of his golem, which returned to dust.”';
/** Jewish Encyclopedia, vol. 6 (1904), "Golem", a fragment. */
const LIFT_ATTIC = '“…its remains are said to be still among the débris in the attic of the synagogue.”';
/** Psalm 139:16, JPS 1917, a fragment. */
const LIFT_PSALM = '“Thine eyes did see mine unformed substance…” That is a psalm.';

// ------------------------------------------------------------------ shared pieces

/** A30-13: the opening of the complete scene (all three orders). */
const A13_START: Line[] = [
  N('Rivka walks you to the end of the lane, where the page begins to go thin and brown at the edges.'),
  N('Behind you the steep roof of the synagogue stands against the evening, and high in its gable, the attic window.'),
];

/** A30-13: the way home (all three orders). */
const A13_END: Line[] = [
  N('Your Nubbin looks up at the window for a long time. Then it takes your hand, which it doesn’t often do.'),
  N('You are back in the Grove, the atlas on your knee. There is a clay tile in your pocket, still a little cool.'),
];

// =================================================================== THE WORD ON THE BROW

export const ATLAS_A30: Quest[] = [
  // ---------------------------------------------------------------- A30-1
  {
    id: 'a30-01',
    code: 'A30-1',
    title: 'The Jewish Town',
    source: `${LEGEND}: the Jewish Town of Prague`,
    audience: 'all',
    trigger: { where: WHERE, when: 'Any time once Nova’s atlas is in the Grove; the first quest on the page.' },
    speakers: [AVRAM, DVORA, RIVKA, HANNAH],
    steps: [
      {
        id: 'a30-01-s1',
        goal: 'Step into the brown-ink page and find the caretaker’s house.',
        hint: 'Touch the page, then follow the lane to the door with the ring of keys.',
        check: 'explore:a30-lanes:gate',
        scene: {
          id: 'a30-01-page',
          lines: [
            N('Nova’s atlas falls open at a page drawn in brown ink: a steep-roofed synagogue, a lane of small houses, a river.'),
            N('Across the top of the page, in plain letters: the Golem of Prague, a Jewish legend from the Czech lands.'),
            N('Rabbi Judah Loew was real, a great scholar and teacher in Prague four hundred years ago.'),
            N('The golem story was told about him long after he died. It is a legend, and people have told it many ways.'),
            N('This page follows the legend as an encyclopedia printed in New York in 1904 sets it down, and the tellings after it.'),
            N('The paper goes cool and gritty under your hand, like a doorstep. Then it is a doorstep, and you are sitting on it.'),
            N('A narrow lane, wet cobbles, the smell of bread. A man with a ring of keys at his belt looks down at you both.'),
            AV('You’ll be the lodger. Good. I’m Avram. I look after the synagogue, which mostly means I look after its keys.'),
            AV('My wife has made up the bed in the loft. It’s small. So, forgive me, is the small one.'),
            N('Your Nubbin holds up both arms, to show that it will fit anywhere at all.'),
          ],
          choices: [
            {
              id: 'hand',
              label: 'Shake his hand.',
              then: [AV('A good grip. You’ll carry water.', 'happy'), N('He says it as if it were the highest praise he knows.')],
            },
            {
              id: 'keys',
              label: 'Ask which key is which.',
              then: [
                AV('This one is the big door. This one is the cupboard. This one, I have no idea. I’ve had it twenty years.', 'think'),
                AV('One day a door will turn up for it, and I’ll be ready.'),
              ],
            },
            {
              id: 'basket',
              label: 'Take the basket he’s carrying.',
              then: [N('He lets you take it, and looks at you sideways, the way people do when they’ve been helped before they asked.')],
            },
          ],
        },
        done: {
          id: 'a30-01-page-done',
          lines: [
            DV('Avram, bring them in, you’re letting the warm out. Water first, lodger. Then you can be a guest.'),
            RI('I’ll show them the well! I know the well better than anyone.'),
          ],
        },
      },
      {
        id: 'a30-01-s2',
        goal: 'Carry water from the well, and learn where things are.',
        hint: 'Rivka knows the way. The well is where three lanes meet.',
        check: 'carry:a30-water:well',
        scene: {
          id: 'a30-01-water',
          lines: [
            N('Rivka is about nine, and walks backwards the whole way so she can talk to you.'),
            RI('That’s the study house. That’s the bathhouse. That’s Hannah’s bakery. Don’t look at it, you’ll want everything.'),
            N('Your Nubbin looks at it.'),
            RI('The big synagogue is the old one with the steep roof. Papa has a key to every door except the attic.'),
            RI('Nobody goes in the attic. It’s where the worn-out books go. You don’t throw away a holy book; you put it to rest.'),
            N('At the well two women are talking low, the way people talk about weather that hasn’t arrived yet.'),
            N('They talk about the great rabbi, who teaches in the study house. Then, more quietly, about the talk outside the walls.'),
            RI('Mama says not to listen at wells. Mama listens at wells all the time.'),
            N('You carry two buckets home. Your Nubbin carries a cup, spills about half of it, and is very proud of the half.'),
          ],
        },
        done: {
          id: 'a30-01-water-done',
          lines: [
            DV('Good. Now you’re a guest. Rivka, take them to Hannah’s before she shuts, and don’t eat the change.'),
          ],
        },
      },
      {
        id: 'a30-01-s3',
        goal: 'Fetch the bread from Hannah’s bakery.',
        hint: 'The bakery is the door with the warm step. Your Nubbin has already found it.',
        check: 'visit:a30-bakery:lane',
        scene: {
          id: 'a30-01-bakery',
          lines: [
            N('Your Nubbin is already sitting on the bakery step, which is warm from the oven inside, with its eyes shut.'),
            HA('Is this yours? It’s been there since you came round the corner. It hasn’t moved.'),
            N('Hannah is flour to the elbows. Behind her, plaited loaves stand in rows, shining, waiting for Friday.'),
            HA('Those are for the Sabbath. Nobody touches those. This, on the other hand, is a crust I burnt.', 'happy'),
            N('She holds it out. Your Nubbin takes it in both paws as if it were a medal.'),
            RI('She burns one every day. On purpose. Everyone knows.'),
            HA('Rivka, if you tell everyone, I’ll have to stop.'),
            N('You carry the bread home. Your Nubbin carries the crust, and does not spill any of it.'),
          ],
        },
      },
    ],
    complete: {
      id: 'a30-01-complete',
      lines: [
        N('The loft is small and smells of apples. Through its little window you can see across the lane to the study house.'),
        N('There is still a lamp burning there, late, in one window. Someone is reading.'),
        RI('That’s the rabbi. He reads all night sometimes. Papa says it’s because he’s wise. Mama says it’s because he forgets.'),
        N('Your Nubbin falls asleep with flour on its nose and the last of the crust under its arm.'),
      ],
    },
    rewards: [],
    sets: { 'a30-01': true },
    notes:
      'OPENING: a30-01-page#1–4 are the page’s INTRO CARD, required by the care notes: show them as a plain card over the ' +
      'brown-ink page before the step-through (#5 onwards is the step-through itself). The card names it a legend, says ' +
      'Rabbi Loew was real and the golem was attached to him later, and names the 1904 encyclopedia the page follows. ' +
      'ART: the Jewish Town of the late 1500s, from period views (advisers and ideally the Jewish Museum in Prague to ' +
      'check): narrow lanes, small houses, the Old-New Synagogue’s steep brick gable. No caricature of any kind; ordinary ' +
      'people in ordinary clothes. The plaited loaves are challah. ' +
      'CINDER (cinder set, S19): play ATLAS_A30_VARIANTS a30-01-ember after a30-01-page’s choice, before a30-01-page-done. ' +
      'From then on your Nubbin carries a little lantern with the red pebble in it on this page (Atlas save, a prop).',
  },

  // ---------------------------------------------------------------- A30-2
  {
    id: 'a30-02',
    code: 'A30-2',
    title: 'The Rabbi',
    source: `${LEGEND}: Rabbi Loew in the study house; the Talmud, Sanhedrin 65b; Psalm 139`,
    audience: 'all',
    trigger: { where: WHERE, when: after('A30-1') },
    requires: ['A30-1'],
    speakers: [AVRAM, LOEW, STUDENT, STUDENT2],
    steps: [
      {
        id: 'a30-02-s1',
        goal: 'Go to the study house with Avram and sit at the back.',
        hint: 'The bench by the door. Sit still, and listen.',
        check: 'sit:a30-study-house:back-bench',
        scene: {
          id: 'a30-02-study',
          lines: [
            N('The study house is one long room full of books and noise. Students sit in pairs, arguing over a page, both talking at once.'),
            AV('It’s meant to be loud. A quiet study house is one where nobody’s thinking.'),
            AV('Sit at the back. If anyone asks, you’re with me. If anyone asks me, I’ll say you’re with the rabbi.'),
            N('At the front sits an old man with a plain grey beard and ink on his fingers. The room goes quiet for him without being asked.'),
            N('He doesn’t look like a wonder-worker. He looks like someone’s grandfather who has read everything twice.'),
            AV('Rabbi Judah Loew. People call him the Maharal: the first letters of “our teacher, the rabbi Loew”.'),
            LO('I’m going to tell you a story from the Talmud. Don’t write it down. Listen to it.'),
            LO('Rava made a man, and sent him to Rabbi Zeira. Rabbi Zeira spoke to him, and the man did not answer.'),
            LO('So Rabbi Zeira said to him: then go back to your dust.'),
            N('Your Nubbin, on the bench beside you, has gone very still.'),
          ],
        },
        done: {
          id: 'a30-02-study-done',
          lines: [N('The rabbi lets the story sit in the room a while, the way you let bread rest before you cut it.')],
        },
      },
      {
        id: 'a30-02-s2',
        goal: 'Answer the rabbi’s question, if you can.',
        hint: 'He is looking at the back bench. There is no wrong answer.',
        check: 'talk:a30-loew:study-house',
        scene: {
          id: 'a30-02-question',
          lines: [
            LO('Now. What is a person, if not that? Someone tell me.'),
            ST('Someone who answers, Rabbi.'),
            S2('Someone who can be spoken to. Which is not quite the same.', 'think'),
            LO(LIFT_PSALM),
            LO('In the Hebrew it is one word: golmi. My unshaped clay. It is the only place the word golem is in the whole Bible.'),
            LO('So every one of us was clay once, and somebody saw it. What makes the difference?', 'think'),
            N('He is looking past the students, at the back bench. At you.'),
          ],
          choices: [
            {
              id: 'answers',
              label: '“Someone who can answer.”',
              then: [LO('The same as the student said, but braver, from the back of the room. Good.', 'happy')],
            },
            {
              id: 'asks',
              label: '“Someone who can ask.”',
              then: [LO('Then this is a room full of people, and I have been worrying for nothing.', 'happy')],
            },
            {
              id: 'nubbin',
              label: 'Look at your Nubbin, who can’t say a word.',
              then: [
                LO('Yes. It doesn’t speak. And it answered me just now: it looked up when I said clay.', 'soft'),
                LO('Answering is more than words. Remember that. I may need reminding.'),
              ],
            },
          ],
        },
      },
    ],
    complete: {
      id: 'a30-02-complete',
      lines: [
        N('Afterwards, at the door, the rabbi stops beside your Nubbin and looks down at it for a long moment.'),
        LO('I have never seen one of these. Does it do as it’s told?'),
        AV('Never, Rabbi. Not once. It’s a great comfort to the household.'),
        LO('Good. I’d worry about it otherwise.', 'happy'),
        N('He goes out into the lane with a book under each arm, and leaves his coat behind on the peg.'),
      ],
    },
    rewards: [],
    sets: { 'a30-02': true },
    childLines: {
      'a30-02-question#3': 'There is a song in the Bible that says: before I was even made, you saw me.',
    },
    notes:
      'THE TALMUD STORY (a30-02-study#7–8) is Sanhedrin 65b, retold in our own words; advisers to check the wording. No ' +
      'modern translation is quoted. LIFTED TEXT: a30-02-question#3 (Psalm 139:16, JPS 1917, a fragment) in the rabbi’s ' +
      'mouth, with “That is a psalm.” in our words after it. ART: the rabbi is an old scholar, warm and plain; no glow, no ' +
      'staff, no wizard robes. The study house is noisy on purpose (paired study).',
  },

  // ---------------------------------------------------------------- A30-3
  {
    id: 'a30-03',
    code: 'A30-3',
    title: 'Fear',
    source: `${LEGEND}: the danger outside the walls`,
    audience: 'all',
    trigger: { where: WHERE, when: after('A30-2') },
    requires: ['A30-2'],
    speakers: [AVRAM, DVORA, RIVKA, SHMUEL, LOEW],
    steps: [
      {
        id: 'a30-03-s1',
        goal: 'Find out why Avram has come home early.',
        hint: 'He is in the courtyard, sitting on the woodpile, which he never does.',
        check: 'talk:a30-avram:courtyard',
        scene: {
          id: 'a30-03-rumour',
          lines: [
            N('Avram comes home at noon, which he never does, and sits on the woodpile, which he never does either.'),
            AV('There’s a story going round outside the walls. About us. It isn’t true.'),
            AV('I won’t tell you what it is. Saying it again is how it travels.', 'sad'),
            DV('It’s been told before. It’s always been a lie. It always finds people who want it.'),
            N('Dvora puts her hand on his shoulder, and leaves it there.'),
            AV('There were men at the gate last night, talking. Only talking. Tonight there may be more of them.'),
            RI('Will they come in?'),
            DV('The gates are shut at night. And there are a great many of us, and we’re all very good at shouting.'),
          ],
        },
        done: {
          id: 'a30-03-rumour-done',
          lines: [AV('Bar the shutters at dusk. That’s all. Then we sleep, if we can.')],
        },
      },
      {
        id: 'a30-03-s2',
        goal: 'Get through the night.',
        hint: 'Choose where to be. Nothing will happen to you; it is only a long night.',
        check: 'wait:a30-window:night',
        scene: {
          id: 'a30-03-night',
          lines: [
            N('After dark there is lantern light at the far end of the street, beyond the gate. Voices, low, and then louder.'),
            N('You can’t hear the words. You don’t want to.'),
            N('The house goes very quiet. Shmuel gets into his sister’s bed without asking, and she lets him.'),
            N('Across the lane, in the rabbi’s window, the lamp is lit. It stays lit.'),
            SH('Is the rabbi scared?'),
            RI('The rabbi is thinking. It looks the same from outside.'),
          ],
          choices: [
            {
              id: 'children',
              label: 'Sit on the floor by the children’s bed.',
              then: [
                N('You sit on the floor with your back to the bed. After a while a small hand comes down and holds your collar.'),
                N('Your Nubbin climbs up between them, and Shmuel goes to sleep with his face in its fur.'),
              ],
            },
            {
              id: 'watch',
              label: 'Keep watch at the shutter with Avram.',
              then: [
                AV('There’s nothing to see. I know. I look anyway.'),
                N('You look anyway, together, through the crack in the shutter, until the lights at the gate go out one by one.'),
              ],
            },
            {
              id: 'rabbi',
              label: 'Watch the rabbi’s window.',
              then: [N('Once, very late, a shadow crosses the rabbi’s lamp, back and forth, back and forth. Somebody walking, and not sleeping.')],
            },
          ],
        },
      },
    ],
    complete: {
      id: 'a30-03-complete',
      lines: [
        N('In the morning the men are gone; nothing happened, this time. Hannah’s oven is lit, and the lane smells of bread.'),
        N('The rabbi passes on his way to the study house, and nods to Avram. He looks as if he has not slept at all.'),
        LO('Good morning. It is a good morning. They all are, until they aren’t.', 'think'),
        DV('He didn’t sleep. You can always tell. He gets philosophical before breakfast.'),
      ],
    },
    rewards: [],
    sets: { 'a30-03': true },
    notes:
      'CARE: the lie is never named or hinted at (no blood libel). The men are lantern light and voices beyond the gate: ' +
      'never seen close, never given faces, never shown as a mob of Christian villains. Nothing happens. Keep the scene ' +
      'short; the fear is in the household’s small actions. The choice sets no flag.',
  },

  // ---------------------------------------------------------------- A30-4
  {
    id: 'a30-04',
    code: 'A30-4',
    title: 'The Answer',
    source: `${LEGEND}: the rabbi’s question, and the dream`,
    audience: 'all',
    trigger: { where: WHERE, when: after('A30-3') },
    requires: ['A30-3'],
    speakers: [LOEW, ISAAC, JACOB, RIVKA],
    steps: [
      {
        id: 'a30-04-s1',
        goal: 'Take the rabbi his supper in the study house.',
        hint: 'Dvora has wrapped it in a cloth. He will forget to eat it.',
        check: 'deliver:a30-supper:study-house',
        scene: {
          id: 'a30-04-ask',
          lines: [
            N('Dvora sends you across the lane with bread and a bowl of soup under a cloth. The study house is empty but for him.'),
            N('He is not reading. He is sitting with his hand over his eyes, very still.'),
            LO('Put it there, thank you. I’ll eat it. I may even eat it tonight.'),
            LO('Do you know what I asked for, when I prayed this evening? How to keep them safe. Only that.', 'think'),
            LO('It’s a very old question. Usually the answer is: be patient, be careful, be kind to your neighbours, and wait.'),
            LO('I have been all four. I’d like a fifth.', 'sad'),
            N('Your Nubbin climbs up on the bench and pushes the soup an inch closer to him, as a suggestion.'),
          ],
        },
        done: {
          id: 'a30-04-ask-done',
          lines: [N('When you go back for the bowl in the morning, it is empty. He is asleep at the table with his cheek on a book.')],
        },
      },
      {
        id: 'a30-04-s2',
        goal: 'Listen to what the rabbi asks of you.',
        hint: 'He is at the study house door with two men.',
        check: 'talk:a30-isaac:door',
        scene: {
          id: 'a30-04-helpers',
          lines: [
            N('By noon he is awake, and changed. Something has settled in his face, the way dust settles in a still room.'),
            LO('A question I asked in the night was answered in a dream. That is all I’ll say about it.'),
            N('Two men stand with him: Isaac, his son-in-law, broad and quiet, and Jacob, his pupil, thin and quick.'),
            LO('Isaac, Jacob: be ready tonight, after midnight. Wear old clothes. Bring nothing.'),
            IS('Nothing, Rabbi?'),
            LO('Nothing. Our hands will do.'),
            N('Then he turns to you, and you think he’s going to tell you something. He doesn’t.'),
            LO('Keep a lantern lit in Avram’s window until we come back. And don’t follow us.', 'soft'),
            LO('Not because you aren’t trusted. Because some things are better done without anyone watching.'),
          ],
          choices: [
            {
              id: 'promise',
              label: '“I’ll keep it lit.”',
              then: [LO('Thank you. It helps, coming home, to see a light someone kept.', 'soft')],
            },
            {
              id: 'why',
              label: 'Ask where they’re going.',
              then: [
                JA('To the river.', 'shock'),
                N('Isaac looks at him. Jacob looks at his shoes.'),
                LO('Well. To the river. You may as well know that much. It’s not a secret where rivers are.', 'happy'),
              ],
            },
            {
              id: 'nod',
              label: 'Just nod.',
              then: [N('The rabbi nods back, once, as if you have agreed to something larger than a lantern.')],
            },
          ],
        },
      },
      {
        id: 'a30-04-s3',
        goal: 'Light the lantern in Avram’s window.',
        hint: 'The lantern hangs by the door. The window is in the loft.',
        check: 'carry:a30-lantern:window',
        scene: {
          id: 'a30-04-lantern',
          lines: [
            N('You carry the lantern up to the loft window and light it. The flame stands up straight in the still air.'),
            RI('Why is it lit? Who’s it for?'),
            N('You tell her it’s for the rabbi. She takes this very seriously.'),
            RI('Then I’ll mind it too. I’m good at minding things. I minded Shmuel for a whole year and he’s still alive.'),
            N('She sits cross-legged beside the lantern, with her chin in her hands.'),
            N('Your Nubbin sits beside her, and copies her exactly.'),
          ],
        },
      },
    ],
    complete: {
      id: 'a30-04-complete',
      lines: [
        N('At midnight the study house door opens and shuts softly. Three shapes go down the lane towards the river.'),
        N('Rivka is still awake, and looks at you, and looks at the lantern.'),
        RI('Go on, then. I’ll mind it. You’re not very good at not following, are you?'),
      ],
    },
    rewards: [],
    sets: { 'a30-04': true },
    notes:
      'CARE: no ritual is shown and nothing is said of how the dream came or what it said. The rabbi prays “the way the ' +
      'town prays”: off screen, in the past tense. The fifth thing he asks for is the hook; the game never names it.',
  },

  // ---------------------------------------------------------------- A30-5
  {
    id: 'a30-05',
    code: 'A30-5',
    title: 'Clay from the River',
    source: `${LEGEND}: the making, by the Vltava at night`,
    audience: 'all',
    trigger: { where: WHERE, when: after('A30-4') },
    requires: ['A30-4'],
    speakers: [ISAAC, RIVKA],
    steps: [
      {
        id: 'a30-05-s1',
        goal: 'Follow the three of them to the river, at a distance.',
        hint: 'Keep well back. Stop at the willows above the bank.',
        check: 'walk:a30-river:willows',
        scene: {
          id: 'a30-05-follow',
          lines: [
            N('You follow at a distance, through the sleeping lanes, out by the little water gate to the river.'),
            N('The Vltava is wide and black and talking to itself. The town is behind you, with one lit window in it.'),
            N('You stop in the willows above the bank. Your Nubbin stops too, and holds on to your trouser leg.'),
            N('Below you, on the mud, three men are kneeling. They have their sleeves rolled up.'),
            N('They are digging clay out of the bank with their hands, and laying it out on the ground.'),
            N('You can see their mouths move. You can’t hear a word over the river, and you don’t try to.'),
          ],
          choices: [
            {
              id: 'closer',
              label: 'Go a little closer.',
              then: [N('You go one tree closer, and stop. It feels like walking into a room where someone is praying.')],
            },
            {
              id: 'stay',
              label: 'Stay where you are.',
              then: [N('You stay in the willows. Your Nubbin looks up at you, then back down at the bank, thinking.')],
            },
          ],
        },
      },
      {
        id: 'a30-05-s2',
        goal: 'Let your Nubbin help, if they’ll have it.',
        hint: 'Your Nubbin has made up its own mind. Stay on the bank.',
        check: 'carry:a30-river-water:clay',
        scene: {
          id: 'a30-05-clay',
          lines: [
            N('The clay on the ground is taking a shape: a head, shoulders, two long arms. It is as long as a door.'),
            N('The rabbi bends over the head. The other two work at the arms and legs, smoothing, as if they were making bread.'),
            N('The clay is drying in the wind off the water. Isaac keeps going down to the river with cupped hands, and it’s slow.'),
            N('Your Nubbin lets go of your trouser leg. Before you can stop it, it is down the bank.'),
            N('It goes to the water’s edge, fills its cheeks, and trots back up to the clay. Then it wets the clay, very carefully.'),
            N('Isaac looks at it, then up at the willows, straight at you. Then he moves over, and makes room.'),
            N('Your Nubbin goes back to the river, and again, and again. You stay where you are, and the night goes on.'),
          ],
        },
        done: {
          id: 'a30-05-clay-done',
          lines: [
            N('Near dawn Isaac carries your Nubbin back up the bank himself, and sets it down at your feet, muddy to the ears.'),
            IS('Go home. He knows you’re here. He knew before I did.', 'soft'),
          ],
        },
      },
    ],
    complete: {
      id: 'a30-05-complete',
      lines: [
        N('You go home ahead of them. The lantern is still burning in the loft window.'),
        N('Rivka is asleep beside it, sitting up, with one hand still held out towards it, minding.'),
        N('You put a blanket over her. Your Nubbin falls asleep on the end of it, still smelling of river.'),
      ],
    },
    rewards: [],
    sets: { 'a30-05': true },
    notes:
      'CARE: the making is seen from far off (the willows above the bank) and heard as nothing but the river. No words, ' +
      'no letters, no gestures that read as a rite; the men shape clay the way you knead bread. The player stays on the ' +
      'bank: only the Nubbin goes down, with water. ART: the Vltava at night, the town behind with one lit window.',
  },

  // ---------------------------------------------------------------- A30-6
  {
    id: 'a30-06',
    code: 'A30-6',
    title: 'The Word',
    source: `${LEGEND}: emet on the brow (older tellings and many modern ones); the Shem in the mouth (Prague tellings)`,
    audience: 'all',
    trigger: { where: WHERE, when: after('A30-5') },
    requires: ['A30-5'],
    speakers: [LOEW, ISAAC, JACOB],
    steps: [
      {
        id: 'a30-06-s1',
        goal: 'Go back down to the river when the rabbi sends for you.',
        hint: 'Jacob is at the door. Go with him.',
        check: 'talk:a30-loew:riverbank',
        scene: {
          id: 'a30-06-tellings',
          lines: [
            N('Before sunrise Jacob knocks at the door. The rabbi wants you at the river, and your Nubbin, he says, especially.'),
            LO('You followed. I thought you would. Come and see, then, and don’t say anything for a little while.'),
            N('The clay man lies on the bank under the grey sky. He is plain and smooth and as long as a door.'),
            N(LIFT_SHEM),
            LO('Some say the word goes in the mouth, some say on the brow. The tellings don’t agree. They rarely do.', 'think'),
            LO('In some it is a holy Name, written on a slip of paper. We will leave that where it belongs.'),
            LO('Here it will be a plain word on the brow, one that anyone may read. Three letters. Watch which ones.'),
          ],
          choices: [
            {
              id: 'why',
              label: '“Why truth?”',
              then: [LO('Because a guard should stand on something true. And because anyone in the lane can read it, even Shmuel.', 'happy')],
            },
            {
              id: 'quiet',
              label: 'Say nothing, as he asked.',
              then: [LO('Good. You were listening. That is most of it.', 'soft')],
            },
          ],
        },
      },
      {
        id: 'a30-06-s2',
        goal: 'Watch the rabbi write the three letters.',
        hint: 'Stand where he puts you. Your Nubbin will want to be nearer.',
        check: 'watch:a30-clay:brow',
        scene: {
          id: 'a30-06-letters',
          lines: [
            LO('Hebrew is read from the right. So the first letter goes on the right.'),
            LO('Alef, א. It makes no sound of its own. It only holds a vowel, the way a cup holds water.'),
            N('He draws it on the clay brow with one finger. The clay is cold and takes the line cleanly.'),
            LO('Mem, מ, from the middle of the alef-bet. And tav, ת, the very last letter of all.'),
            N('Three letters in a row, right to left: אמת.'),
            LO('Emet. Truth. The first letter, the middle and the last. The old teachers liked that: truth stands on all of it.'),
            N('For a moment nothing happens. Then the clay under your feet feels warm, like a step in the sun.'),
            N('The clay man opens his eyes. He sits up, slowly, looks at the rabbi, and waits to be told what to do.'),
            IS('He’s waiting.', 'shock'),
            LO('So he is. Well. Get up, then, my friend. We’ll walk home.', 'soft'),
          ],
        },
        done: {
          id: 'a30-06-letters-done',
          lines: [
            N('He gets up, a head taller than Isaac. He stands with his hands open at his sides, and doesn’t speak.'),
            JA('What do we call him?'),
            LO('Josef. A good plain name.'),
          ],
        },
      },
    ],
    complete: {
      id: 'a30-06-complete',
      lines: [
        N('You walk back to the town in the first light: the rabbi, his two helpers, a tall clay man, you.'),
        N('Your Nubbin walks a step behind the clay man, exactly a step, the way a duckling walks behind something large.'),
        N('By breakfast the children of the lane have met him. By noon nobody calls him Josef: he is Yossele.'),
        LO('There. He has a name the children gave him. That is worth more than mine.', 'happy'),
      ],
    },
    rewards: [],
    sets: { 'a30-06': true },
    childLines: {
      'a30-06-tellings#3': 'Some people tell this story one way, and some tell it another. Stories grow when they are told many times.',
    },
    notes:
      'LIFTED TEXT: a30-06-tellings#3 (Jewish Encyclopedia 1904, “Golem”), voiced as narration for the older tellings. #4–5 ' +
      'are the outline’s adapted line and the turn away from the Name, in the rabbi’s own words. CARE: the Name is never ' +
      'written, spoken, shown or hinted at; no slip of paper appears on screen. Emet on the brow is the older and modern ' +
      'telling; we use it with the advisers’ agreement and say so here. HEBREW: the letters are drawn exactly as in Ori’s ' +
      'alef-bet (LH2), written right to left, alef first. The rabbi’s explanation is the main-game version of what Ori ' +
      'teaches in the Learning Grove. The finger-drawing is shown once, plainly; no glow, no sound effect beyond the river. ' +
      'Show the three letters large on screen as he names them (art, not text-only). The first-middle-last point is a ' +
      'traditional teaching (advisers to confirm the attribution if one is shown).',
  },

  // ---------------------------------------------------------------- A30-7
  {
    id: 'a30-07',
    code: 'A30-7',
    title: 'Yossele’s Work',
    source: `${LEGEND}: the golem as servant`,
    audience: 'all',
    trigger: { where: WHERE, when: after('A30-6') },
    requires: ['A30-6'],
    speakers: [LOEW, DVORA, AVRAM, RIVKA],
    steps: [
      {
        id: 'a30-07-s1',
        goal: 'Watch Yossele at his work.',
        hint: 'He is in the courtyard. Your Nubbin is already a step behind him.',
        check: 'watch:a30-yossele:chores',
        scene: {
          id: 'a30-07-chores',
          lines: [
            N('Yossele lives in the rabbi’s house now, and works wherever he is sent. He fetches water, chops wood and sweeps.'),
            N('He never speaks, and never tires. He never does one thing more than he is told.'),
            AV('Told to sweep the step, he sweeps the step. Not the step next to it. I find it very restful.', 'happy'),
            N('Everywhere he goes, your Nubbin goes too, a step behind. When he stops, it stops; when he turns, it turns.'),
            N('He has never once looked down at it. But he has never once stepped on it either.'),
            RI('He’s like a big quiet uncle. Without the opinions.'),
          ],
        },
      },
      {
        id: 'a30-07-s2',
        goal: 'Stop the kitchen flooding.',
        hint: 'Bail, mop, and fetch the rabbi. Yossele will not stop on his own.',
        check: 'carry:a30-buckets:kitchen',
        scene: {
          id: 'a30-07-flood',
          lines: [
            DV('Yossele, fill the barrel for me, there’s a dear. I’ll be back before you know it.'),
            N('He fills the barrel. Then he fills it again, because nobody has told him to stop.'),
            N('Water runs over the rim, across the kitchen, under the door, and out into the lane in a bright sheet.'),
            N('Yossele goes on fetching, steady as a mill wheel, through his own flood.'),
            N('You bail with a pan. Your Nubbin bails with its cheeks, which is no help at all, and very sincere.'),
            DV('Oh, no. No, no, no. Yossele! That’s enough! Enough!', 'shock'),
            N('He doesn’t stop. She isn’t the one who made him.'),
            N('Then the rabbi is at the door with his sleeves wet to the elbow, and says one word. Yossele sets the bucket down.'),
          ],
        },
        done: {
          id: 'a30-07-flood-done',
          lines: [
            DV('My kitchen. My good floor. My onions are floating.', 'sad'),
            N('She looks at you, soaked to the knees, and hands you an apron. Too late, but kindly meant.'),
            DV('Keep it. You’ve earned it. You’ll need it again, in this house.'),
          ],
        },
      },
      {
        id: 'a30-07-s3',
        goal: 'Give Yossele his standing order.',
        hint: 'The rabbi asks you. Choose what Yossele does when no one has told him anything.',
        check: 'choose:a30-order:study-house',
        scene: {
          id: 'a30-07-order',
          lines: [
            N('That evening the rabbi sits on the study house step with you, and watches Yossele sweeping the lane in the dusk.'),
            LO('He does what he’s told, and only that. So when nobody tells him anything, he stands and waits. For hours.'),
            LO('A thing that only waits is a sad thing to have made. He should have something of his own to do.', 'think'),
            LO('One standing order. For when no one else has told him anything. You choose it.'),
            LO('You came to the river when you were told not to. I think that makes you the right person to ask.', 'happy'),
            N('Yossele has stopped sweeping, and your Nubbin, a step behind him, has stopped too. They are both waiting.'),
          ],
          choices: [
            {
              id: 'safe',
              label: '“Keep everyone safe.”',
              set: { 'a30-order': 'safe' },
              then: [
                LO('Keep everyone safe. That’s what I made him for. Well, then.', 'soft'),
                N('The rabbi says it to Yossele, quietly. Yossele turns and looks down the lane, at every door in it, one by one.'),
              ],
            },
            {
              id: 'help',
              label: '“Help where you’re asked.”',
              set: { 'a30-order': 'help' },
              then: [
                LO('Help where you’re asked. Modest. Dvora will be glad.', 'happy'),
                N('The rabbi tells him. Yossele picks the broom up again, and holds it, ready, looking from door to door.'),
              ],
            },
            {
              id: 'sit',
              label: '“Sit with the little ones.”',
              set: { 'a30-order': 'sit' },
              then: [
                LO('The little ones. You mean the children, and this one. Hm.', 'think'),
                N('The rabbi tells him, and Yossele looks down, for the first time, at your Nubbin. Then he sits on the step beside it.'),
              ],
            },
          ],
        },
      },
    ],
    complete: {
      id: 'a30-07-complete',
      lines: [
        N('Dvora hangs the onions up to dry from the kitchen beam, all in a row, as if that had been the plan all along.'),
        AV('He fills barrels very well. Nobody can say he doesn’t fill barrels.'),
        N('You go up to the loft in your new apron, still damp at the hem. Your Nubbin is asleep before you are.'),
      ],
    },
    rewards: [
      {
        id: 'a30-caretakers-apron',
        kind: 'cosmetic',
        label: 'Caretaker’s Apron',
        description: 'A plain linen apron from Dvora’s kitchen, a little water-marked at the hem. Given after the flood, too late, but kindly meant.',
      },
    ],
    sets: { 'a30-07': true },
    notes:
      'SIGNATURE CHOICE (a30-07-order): a30-order = safe | help | sit, Yossele’s standing order. It pays off in A30-9 ' +
      '(a30-09-order-*), A30-10 (a30-10-grow-*) and A30-13 (a30-13-order-*, the tile and the last image). The rabbi’s word ' +
      'that stops Yossele in a30-07-flood#7 is never given: show only his mouth moving and the bucket going down. COMEDY: ' +
      'the flood is the page’s one big laugh; keep it bright and quick. Nobody is hurt; onions float. REWARD: the apron, ' +
      'one-time, at a30-07-flood-done.',
  },

  // ---------------------------------------------------------------- A30-8
  {
    id: 'a30-08',
    code: 'A30-8',
    title: 'The Night Guard',
    source: `${LEGEND}: the golem guards the Jewish Town`,
    audience: 'all',
    trigger: { where: WHERE, when: after('A30-7') },
    requires: ['A30-7'],
    speakers: [AVRAM, LOEW],
    steps: [
      {
        id: 'a30-08-s1',
        goal: 'Walk the night round with Yossele.',
        hint: 'Every lane, every gate, once. Your Nubbin will try to keep up.',
        check: 'walk:a30-night-round:lanes',
        scene: {
          id: 'a30-08-round',
          lines: [
            N('At night Yossele walks the lanes of the Jewish Town, end to end, gate to gate. Tonight you walk with him.'),
            N('He goes slowly, and never stops. The houses are dark, and the cobbles are wet, and your footsteps are the only ones.'),
            N('At every gate he puts his hand flat on the wood for a moment, as if to feel whether it is cold.'),
            N('Your Nubbin keeps up for three lanes. On the fourth it sits down in the road, and holds up both arms.'),
            N('Yossele stops. Nobody has told him what to do about this.'),
            N('You lift your Nubbin up and set it on his shoulder, and he walks on. It holds on to his ear, and is asleep in a minute.'),
          ],
        },
      },
      {
        id: 'a30-08-s2',
        goal: 'Stand with Yossele at the end of the street.',
        hint: 'He knows where to stand. Stand behind him.',
        check: 'watch:a30-yossele:street-end',
        scene: {
          id: 'a30-08-street-end',
          lines: [
            N('At the street’s end there is lantern light again, beyond the gate. Voices, more than last time.'),
            N('Yossele walks to the middle of the street and stands there, in the light, as tall as a door. He does nothing at all.'),
            N('Your Nubbin is still asleep on his shoulder, with one ear in its mouth.'),
            N('The voices stop. For a long moment nobody on the far side moves.'),
            N('Then the lanterns turn, one by one, and go away up the hill, the way lanterns go when people decide they are tired.'),
            N('Yossele stands there till the last one is gone. Then he turns, and goes on with the round.'),
          ],
          choices: [
            {
              id: 'behind',
              label: 'Stand close behind him.',
              then: [N('You stand at his back, close enough to touch. He is warm, like a wall at the end of a sunny day.')],
            },
            {
              id: 'foot',
              label: 'Hold your Nubbin’s dangling foot.',
              then: [N('You reach up and hold your Nubbin’s foot. It curls its toes round your finger in its sleep.')],
            },
          ],
        },
      },
    ],
    complete: {
      id: 'a30-08-complete',
      lines: [
        N('Word goes round the lanes by breakfast. Nobody says much about it, but everybody says they slept well.'),
        AV('I slept like a stone. First time in a month. I dreamt about keys.', 'happy'),
        LO('He didn’t have to do anything. That’s the best kind of guard there is.', 'soft'),
        N('Avram gives you a small lantern with a horn window, for walking the round. Your Nubbin takes it and won’t give it back.'),
      ],
    },
    rewards: [
      {
        id: 'a30-night-round-lantern',
        kind: 'feature',
        label: 'Night-Round Lantern',
        description: 'A small horn-windowed lantern from Avram. In the Grove your Nubbin carries it on its own little walk round the paths at dusk.',
      },
    ],
    sets: { 'a30-08': true },
    notes:
      'CARE: the men are lantern light beyond the gate; never seen, never heard clearly. Yossele does nothing but stand; no ' +
      'one is touched or threatened. REWARD: the Night-Round Lantern, one-time; in the Grove it is an unlimited idle ' +
      'behaviour (your Nubbin walks a short round at dusk carrying it), never a task or a timer.',
  },

  // ---------------------------------------------------------------- A30-9
  {
    id: 'a30-09',
    code: 'A30-9',
    title: 'Fridays',
    source: `${LEGEND}: the golem laid to rest each Friday before the Sabbath`,
    audience: 'all',
    trigger: { where: WHERE, when: after('A30-8') },
    requires: ['A30-8'],
    speakers: [LOEW, DVORA, RIVKA, SHMUEL, MIRELE],
    steps: [
      {
        id: 'a30-09-s1',
        goal: 'Find Yossele before the Sabbath comes in.',
        hint: 'Friday afternoon. Everyone is hurrying; Yossele isn’t.',
        check: 'find:a30-yossele:friday',
        scene: {
          id: 'a30-09-friday',
          lines: [
            N('Friday afternoon. The whole lane is hurrying: floors swept, pots on, children scrubbed whether they like it or not.'),
            N('Hannah’s plaited loaves go past the window in baskets, shining. Everyone is getting ready for the Sabbath.'),
            DV('The rabbi will want Yossele before sunset. Go and find him, will you? I’ve got four things on the fire.'),
            N('Your Nubbin knows exactly where he is. It sets off at a run, and you follow.'),
            N('You find him at the caretaker’s door, where the children are.'),
            N('Behind you, the rabbi is already coming down the lane, wiping ink off his fingers.'),
          ],
        },
      },
      {
        id: 'a30-09-s2',
        goal: 'Help the rabbi lay Yossele down to rest.',
        hint: 'Gently. Support his head.',
        check: 'sit:a30-yossele:rest',
        scene: {
          id: 'a30-09-rest',
          lines: [
            LO('Yossele. Come and lie down.'),
            N('He comes, and lies down on a blanket in the rabbi’s back room, as long as a door. You hold his head as it goes down.'),
            LO('Every week, before the Sabbath. Everything rests on the Sabbath. Even this.'),
            N('He reaches up and rubs out the first letter, the alef. It comes away under his thumb like flour.'),
            N('Two letters are left on the brow: מת, met. Dead.'),
            N('Yossele closes his eyes, and the warmth goes out of him slowly, like a stove at night. The clay is only clay.'),
            N('Your Nubbin climbs up beside the clay and puts its paw on the arm, and keeps it there.'),
          ],
          choices: [
            {
              id: 'blanket',
              label: 'Pull the blanket up over him.',
              then: [LO('Yes. I do that too. I don’t know who it’s for.', 'soft')],
            },
            {
              id: 'ask',
              label: '“Does he know?”',
              then: [
                LO('I don’t know. I have never known. I tell myself he sleeps.', 'think'),
                LO('It is one letter. That is all there ever is between the two.'),
              ],
            },
          ],
        },
        done: {
          id: 'a30-09-rest-done',
          lines: [
            N('On Saturday night, when three stars are out, the rabbi writes the alef again. Yossele sits up as if from a nap.'),
            N('Your Nubbin is waiting by the door, and falls in a step behind him as if it had never been away.'),
          ],
        },
      },
    ],
    complete: {
      id: 'a30-09-complete',
      lines: [
        N('It happens every Friday after that. You learn to hold his head, and the rabbi learns to let you.'),
        LO('You have good hands for it. Slow ones. Most people hurry the slow things.', 'soft'),
        N('Dvora lights the candles. The lane goes quiet, the way it only does on Friday night, as if the whole town has sat down.'),
      ],
    },
    rewards: [],
    sets: { 'a30-09': true },
    notes:
      'ORDER PAYOFF (a30-order): play ATLAS_A30_VARIANTS a30-09-order-safe | a30-09-order-help | a30-09-order-sit right ' +
      'after a30-09-friday, before step 2. HEBREW: מת is shown large, as the letters were in A30-6 (alef gone from the ' +
      'right). The word “Dead” is said once and plainly, the outline’s line; no death imagery: the clay simply goes still. ' +
      'CARE: all this is Friday afternoon, before sunset; the laying down is not Sabbath work. The candle-lighting in the ' +
      'complete scene is Dvora’s, seen from the loft.',
  },

  // ---------------------------------------------------------------- A30-10
  {
    id: 'a30-10',
    code: 'A30-10',
    title: 'The Forgotten Friday',
    source: `${LEGEND}: the Friday the rabbi forgot`,
    audience: 'all',
    trigger: { where: WHERE, when: after('A30-9') },
    requires: ['A30-9'],
    speakers: [LOEW, BOY, AVRAM, DVORA, RIVKA, SHMUEL, MIRELE],
    steps: [
      {
        id: 'a30-10-s1',
        goal: 'Get through Friday afternoon. The rabbi has been called away.',
        hint: 'Help in the house. The rabbi will be back before sunset. He always is.',
        check: 'talk:a30-boy:gate',
        scene: {
          id: 'a30-10-called',
          lines: [
            N('Another Friday. You are helping Dvora when a boy comes running up the lane, out of breath.'),
            BO('Rabbi! Rabbi Loew! At the far end of the town, by the old cemetery. A baby’s coming, and it’s slow.'),
            BO('The family asks will you come and sit with them. They’re frightened. They asked for you.'),
            LO('Of course. Of course I’ll come.'),
            N('He goes at once, as he is, with his coat half on. He doesn’t look back at the rabbi’s house.'),
            N('Yossele is standing in the courtyard, waiting. Nobody has told him anything.'),
          ],
          choices: [
            {
              id: 'ask',
              label: '“What about Yossele?”',
              then: [N('But the rabbi is already round the corner, and nobody hears the question but you.')],
            },
            {
              id: 'pots',
              label: 'Help Dvora with the pots.',
              then: [N('You scrub, and stir, and fetch. The afternoon goes the way Friday afternoons do, all at once.')],
            },
          ],
        },
        done: {
          id: 'a30-10-called-done',
          lines: [DV('He’ll be back. He’s never once been late for the Sabbath. Not once in thirty years.')],
        },
      },
      {
        id: 'a30-10-s2',
        goal: 'Wait in the synagogue courtyard as the Sabbath comes in.',
        hint: 'The rabbi went straight to the synagogue from the far end of town. Watch the lane.',
        check: 'wait:a30-synagogue:courtyard',
        scene: {
          id: 'a30-10-psalm',
          lines: [
            N('The sun is low over the roofs. The baby came, a girl, and the rabbi has hurried straight to the synagogue.'),
            N('From inside the old synagogue comes the murmur of men praying. Then they begin Psalm 92, the psalm for the Sabbath day.'),
            N('You are in the courtyard with the children. The Sabbath is coming in, the way it does, like a tide.'),
            N('Rivka looks down the lane towards the rabbi’s house. Then she grabs your sleeve.'),
            RI('He didn’t. Did he? He didn’t lay Yossele down.', 'shock'),
            N(LIFT_FORGOT),
            N('Down the lane, in the rabbi’s courtyard, something begins to move.'),
          ],
        },
      },
      {
        id: 'a30-10-s3',
        goal: 'Run for the rabbi.',
        hint: 'To the synagogue door. Avram is there; he can fetch him.',
        check: 'deliver:a30-word:synagogue-door',
        scene: {
          id: 'a30-10-fetch',
          lines: [
            N('You run. Through the courtyard, to the synagogue door, where Avram stands with his keys.'),
            AV('What? What is it?'),
            N('You don’t have to say. He looks past you, down the lane, and goes in without another word.'),
            N('The murmur stops. Then the rabbi is in the doorway, without his coat, and running, which you have never seen.'),
            N('He goes down the lane straight to Yossele, and doesn’t slow down, and reaches up.'),
            N('He rubs out the alef, and two letters are left. The great clay man stands still for one breath.'),
            N('Then he falls, all at once, like a wall of sand when the tide goes out, and is only clay in the lane.'),
            N('Nobody is hurt. Things are broken, and the lane is a mess, and nobody, nobody at all, is hurt.'),
          ],
        },
      },
    ],
    complete: {
      id: 'a30-10-complete',
      lines: [
        N('The lane is very quiet. The clay lies in a long heap across the cobbles, with two letters on what was a brow.'),
        N('The rabbi stands over it, out of breath, with his hand on the cold clay. He doesn’t say anything for a long time.'),
        LO('I forgot. A baby was born, and I was so glad, and I forgot him.', 'sad'),
        LO('Come. They’re waiting. The Sabbath doesn’t wait, and nor should we.', 'soft'),
      ],
    },
    rewards: [],
    sets: { 'a30-10': true },
    childLines: {
      'a30-10-psalm#5': 'The rabbi had forgotten. Yossele had not been put to rest, and the day of rest had come.',
    },
    notes:
      'LIFTED TEXT: a30-10-psalm#5 (Jewish Encyclopedia 1904, “Golem”), narration. The encyclopedia says “the Shem”; our ' +
      'telling uses the letter, and the narration quotes the old book as it is. PSALM 92 is named only; the prayer is a ' +
      'murmur through the wall, never words, never sung on screen. ' +
      'ORDER PAYOFF (a30-order): play ATLAS_A30_VARIANTS a30-10-grow-safe | a30-10-grow-help | a30-10-grow-sit right after ' +
      'a30-10-psalm, before step 3. Each shows him restless, then strong, then too strong, and things break. ' +
      'CINDER (cinder set): play a30-10-ember after the grow insert, and a30-10-ember-settle after a30-10-fetch. ' +
      'CARE: the Sabbath has not yet come in for the congregation while the psalm is unfinished; the rabbi stops the ' +
      'prayer, goes out, and rubs out the letter, as in the legend (advisers to check). The player only runs to fetch ' +
      'him. No one is hurt (said twice, on purpose). The fall is clay falling, like sand; no death imagery, no sound of a ' +
      'body. The baby and her family are a happy reason, not a danger.',
  },

  // ---------------------------------------------------------------- A30-11
  {
    id: 'a30-11',
    code: 'A30-11',
    title: 'Twice',
    source: `${LEGEND}: Psalm 92 said twice in the Old-New Synagogue`,
    audience: 'all',
    trigger: { where: WHERE, when: after('A30-10') },
    requires: ['A30-10'],
    speakers: [LOEW, DVORA, AVRAM, SHMUEL, RIVKA],
    steps: [
      {
        id: 'a30-11-s1',
        goal: 'Wait at the synagogue door while they begin again.',
        hint: 'Sit on the step. You don’t need to do anything.',
        check: 'wait:a30-psalm:door',
        scene: {
          id: 'a30-11-again',
          lines: [
            N('The rabbi goes back into the synagogue. The men follow him in, and the door closes.'),
            N('You sit on the step outside with your Nubbin. Inside, there is a pause, and then a single voice begins.'),
            N('They are saying the psalm again, from the very start, as if the first time had not happened.'),
            N('You hear it twice tonight, the same psalm. It comes through the old wall as a murmur, low and steady, like rain.'),
            N('They still do, the legend says. In that synagogue, they say that psalm twice, every Friday, to this day.'),
            N('Your Nubbin leans against your side. It is shivering a little, though the evening is warm.'),
          ],
        },
      },
      {
        id: 'a30-11-s2',
        goal: 'Go home to the Sabbath table.',
        hint: 'Dvora has kept your places. There is nothing you need to do tonight.',
        check: 'sit:a30-sabbath-table:avram',
        scene: {
          id: 'a30-11-table',
          lines: [
            N('At Avram’s house the candles are lit and the table is laid with a white cloth. Hannah’s loaf sits under its cover.'),
            N('Nobody talks about the lane. Avram blesses the wine, and the bread, and passes it round.'),
            SH('Is Yossele dead?'),
            DV('Tomorrow. We’ll talk about Yossele tomorrow night. Tonight is the Sabbath, and we rest, even from that.', 'soft'),
            N('Shmuel thinks about this, and nods, and eats his bread.'),
            N('Your Nubbin sits on the bench between Rivka and you, and nobody asks it to do anything at all.'),
          ],
          choices: [
            {
              id: 'eat',
              label: 'Eat, and say nothing.',
              then: [N('You eat. The bread is soft and sweet, and better than anything you have eaten all week.')],
            },
            {
              id: 'share',
              label: 'Give your Nubbin half your bread.',
              then: [N('Your Nubbin eats it very slowly, as if it knows this is not an ordinary loaf.')],
            },
          ],
        },
      },
    ],
    complete: {
      id: 'a30-11-complete',
      lines: [
        N('Late, the rabbi comes by, but doesn’t come in. He stands at the window a moment, looking at the table, at the candles.'),
        LO('Good. Good. Rest. That’s the whole of it.', 'soft'),
        N('He goes home up the lane, slowly. He walks round the place where the clay is, and doesn’t look at it.'),
      ],
    },
    rewards: [],
    sets: { 'a30-11': true },
    notes:
      'PSALM 92 is named once (in A30-10) and is a murmur here; no words, not sung on screen, no printed verse. The custom ' +
      'of saying it twice in the Old-New Synagogue is “the legend says”: advisers to check how it is described today. ' +
      'CARE: the Sabbath meal is shown simply and correctly (candles already lit, the wine and the bread blessed by Avram, ' +
      'off-voice); advisers to check every detail. The player does no work: steps are wait and sit only.',
  },

  // ---------------------------------------------------------------- A30-12
  {
    id: 'a30-12',
    code: 'A30-12',
    title: 'The Attic',
    source: `${LEGEND}: the clay laid in the synagogue attic`,
    audience: 'all',
    trigger: { where: WHERE, when: after('A30-11') },
    requires: ['A30-11'],
    speakers: [LOEW, ISAAC, JACOB, AVRAM],
    steps: [
      {
        id: 'a30-12-s1',
        goal: 'Hold the lantern at the foot of the attic steps.',
        hint: 'Saturday night, once three stars are out. Stand where the light reaches the top.',
        check: 'carry:a30-lantern:attic-stair',
        scene: {
          id: 'a30-12-stars',
          lines: [
            N('Saturday night. Three stars are out over the steep roof, and the Sabbath is over.'),
            N('The rabbi, Isaac and Jacob carry the clay up the lane on a door, the way you would carry someone home.'),
            AV('The attic. He wants it in the attic. I’ve brought the key I never knew the door for.', 'soft'),
            N('It fits. Avram looks at it in the lock for a moment, as if it had been waiting twenty years to be useful.'),
            N('You hold the lantern at the foot of the steps. The three of them carry the clay up into the dark.'),
            N('Up there, the old pages are stacked and laid in rows, worn-out books that held holy words, put to rest.'),
            N('They lay the clay among them, gently, and cover it over with pages, the way you’d tuck in a child.'),
            N('The encyclopedia, three hundred years on, will say only this:'),
            N(LIFT_ATTIC),
          ],
        },
      },
      {
        id: 'a30-12-s2',
        goal: 'Stay with your Nubbin at the foot of the wall.',
        hint: 'It won’t come away yet. Sit down next to it, and wait.',
        check: 'sit:a30-nubbin:attic-wall',
        scene: {
          id: 'a30-12-steps',
          lines: [
            N('The rabbi comes down last. At the bottom he turns and speaks to everyone in the courtyard.'),
            LO('Nobody is to go up there. Not for curiosity, not for courage, not for anything. Let him rest.'),
            N('Isaac and Jacob take the steps away, one by one, and carry them off. The attic door is high in the wall now.'),
            N('Your Nubbin sits down at the foot of the wall, right under the door, and looks up.'),
            N('It doesn’t move when you call it. It doesn’t move when Avram goes in, or when the lamps go out.'),
            N('So you sit down next to it, on the cold cobbles, and wait.'),
          ],
          choices: [
            {
              id: 'arm',
              label: 'Put your arm round it.',
              then: [N('It leans into you, and keeps looking up.')],
            },
            {
              id: 'call',
              label: 'Call it once more, softly.',
              then: [N('It looks at you, and then back up at the door. It isn’t ready, and nor are you.')],
            },
          ],
        },
        done: {
          id: 'a30-12-steps-done',
          lines: [
            N('Near midnight the rabbi comes back out, with a blanket, and sits down on the other side of your Nubbin.'),
            LO('I thought there would be someone here. I hoped so.', 'soft'),
            N('The three of you sit under the wall a long time, saying nothing. Then your Nubbin gets up, and lets you take it home.'),
          ],
        },
      },
    ],
    complete: {
      id: 'a30-12-complete',
      lines: [
        N('In the morning there is a little heap of river clay at the foot of the wall, where your Nubbin sat.'),
        N('Nobody sweeps it away. Not Avram, not Dvora, not anyone, all week.'),
      ],
    },
    rewards: [],
    sets: { 'a30-12': true },
    childLines: {
      'a30-12-stars#8': 'People still say that the clay is up there, sleeping among the old books, to this day.',
    },
    notes:
      'LIFTED TEXT: a30-12-stars#8 (Jewish Encyclopedia 1904, “Golem”, a fragment, with a leading ellipsis), narration, ' +
      'introduced by #7. CARE: the attic is a genizah, where worn-out holy books are laid to rest (Rivka says so in A30-1). ' +
      'Show it with respect: warm lantern light, rows of pages, no cobwebs-and-horror, no jump scare, no “cursed attic”. ' +
      'The clay is carried after the Sabbath has ended (three stars out). Avram’s unknown key (A30-1) fits the attic door: ' +
      'our small invention. The third rule lands in a30-12-steps without being named. ' +
      'HAZEL (s24Done): play ATLAS_A30_VARIANTS a30-margin-hazel after a30-12-complete, back in the Grove with the atlas ' +
      'open at the attic.',
  },

  // ---------------------------------------------------------------- A30-13
  {
    id: 'a30-13',
    code: 'A30-13',
    title: 'What the Rabbi Says',
    source: `${LEGEND}: the rabbi after the golem; the golem of Chełm`,
    audience: 'all',
    trigger: { where: WHERE, when: after('A30-12') },
    requires: ['A30-12'],
    speakers: [LOEW, RIVKA],
    steps: [
      {
        id: 'a30-13-s1',
        goal: 'Sit with the rabbi on the study house bench.',
        hint: 'A week later. He has kept a place for you.',
        check: 'talk:a30-loew:bench',
        scene: {
          id: 'a30-13-bench',
          lines: [
            N('A week later. The rabbi sits on the bench outside the study house in the sun, and moves over to make room.'),
            LO('I have been thinking about my clay man. I think about very little else. My students have noticed.', 'think'),
            LO('He was a good guard. He did what he was told, and only that. I wanted that. I asked for it.'),
            LO('But a thing that only obeys has no brakes of its own. All its brakes are in your hands. And hands forget.', 'sad'),
            LO('I am not the first, you know. In Chełm, they say, a rabbi made one before me, and it grew, and kept growing.'),
            LO('He was afraid it would fill the world. So:'),
            LO(LIFT_CHELM),
            LO('He had more sense than me. He did it before anyone had to run.'),
          ],
          choices: [
            {
              id: 'baby',
              label: '“You were glad about the baby.”',
              then: [LO('I was. I am. I would forget him again, for her. That is the worst of it, and the best.', 'soft')],
            },
            {
              id: 'sit',
              label: 'Sit with him, and say nothing.',
              then: [N('So you sit. After a while he pats your knee, twice, and that is the conversation finished.')],
            },
          ],
        },
      },
      {
        id: 'a30-13-s2',
        goal: 'Go and see what Rivka has made for you.',
        hint: 'She is at the caretaker’s door, holding something behind her back.',
        check: 'collect:a30-tile:rivka',
        scene: {
          id: 'a30-13-tile',
          lines: [
            N('Rivka is waiting at the door with both hands behind her back, which means it’s a present.'),
            RI('I took some of the clay from under the wall. Only a little. From the outside, not the attic. Nobody said not to.'),
            N('She holds out a small square tile, pressed flat and dried in the sun. There are three letters on it, a bit wobbly.'),
            N('אמת, emet. Alef first, on the right.'),
            RI('I did the alef first, like the rabbi. So it’s true. So it stays.'),
            N('She has made a little clay bird as well, out of the last scrap. It has a very fat tummy and no feet.'),
            RI('That one’s for your Nubbin. It doesn’t do anything. It just sits there. That’s the point of it.'),
          ],
        },
      },
    ],
    complete: {
      id: 'a30-13-complete',
      lines: [
        ...A13_START,
        N('The shutter of the attic window has been closed, and barred across from the inside. Nobody remembers doing it.'),
        N('It looks like a door holding itself shut, the way he held the lane. Safe, and nobody in, and nobody out.'),
        ...A13_END,
      ],
    },
    rewards: [
      {
        id: 'a30-clay-tile',
        kind: 'decor',
        label: 'Clay Tile',
        description:
          'A small tile of river clay pressed by Rivka, with three Hebrew letters: אמת, emet, “truth”. Rub out the first and it reads מת, met, “dead”. It sits on the cottage hearth beside Hazel’s old clay tablets.',
      },
      {
        id: 'a30-clay-bird',
        kind: 'decor',
        label: 'Clay Bird',
        description: 'A little clay bird with a fat tummy and no feet, made by Rivka from the last scrap. It doesn’t do anything. That’s the point of it.',
      },
      {
        id: 'a30-price-of-power-bookmark',
        kind: 'item',
        label: 'Price of Power Bookmark',
        description: 'A strip of brown paper with three small letters on it. It marks the Word on the Brow page, and counts towards the Price of Power festival.',
      },
    ],
    sets: { 'a30-13': true, 'a30-done': true },
    childLines: {
      'a30-13-bench#6': 'So he rubbed out the word, very gently, and his clay man lay down and went to sleep for good.',
    },
    notes:
      'LIFTED TEXT: a30-13-bench#6 (Jewish Encyclopedia 1904, “Golem”, of the golem of Chełm), in the rabbi’s mouth as the ' +
      'older story; #4–5 introduce it in our words. ' +
      'ORDER PAYOFF (a30-order): play ATLAS_A30_VARIANTS a30-13-order-safe | a30-13-order-help | a30-13-order-sit after ' +
      'a30-13-bench, before step 2 (what the rabbi says of what you chose). With sit, also play a30-13-tile-paw after ' +
      'a30-13-tile (the pawprint). The complete scene shown, a30-13-complete, is for safe (the barred shutter). For help ' +
      'play a30-13-complete-help (the broom); for sit, a30-13-complete-sit (the clay bird on the sill). ' +
      'KEPTSTONE: play a30-13-kept after the order insert, before step 2 (a choice with no flag). ' +
      'REWARDS (one-time, at a30-13-complete*): the Clay Tile (the Grove keepsake, on the cottage hearth; with sit it has ' +
      'a tiny pawprint beside the letters), the Clay Bird decor and the Price of Power Bookmark. SIM: the Price of Power ' +
      'festival (A1, A4, A8, A15, A20, A30, any two) reads atlasDone(\'A30\') from a30-done. The Grove keepsake scene plays ' +
      'the first time you enter the cottage after a30-done, checked in this order: a30-grove-tile-quiet unless the ' +
      'campaign is past chapter 4 (c4-out seen), mossFaded is false and the ending is not moss-sleeps (so Moss never ' +
      'speaks before he has come down or after he has faded); then a30-grove-tile-cinder if cinder is set; otherwise ' +
      'a30-grove-tile.',
  },
];

// =================================================================== variants

/**
 * Variant scenes chosen by flags. Each quest's notes say exactly where each plays.
 * Order inserts read a30-order; ember inserts read cinder; a30-13-kept reads keptStone; the margin
 * note reads s24Done; the Grove scenes read the chapter, mossFaded, the ending and cinder (A30-13's
 * notes give the order: the quiet scene first whenever Moss is not there to speak).
 */
export const ATLAS_A30_VARIANTS: Scene[] = [
  // ---------------------------------------------------------------- A30-1, insert (cinder)
  {
    id: 'a30-01-ember',
    lines: [
      N('Your Nubbin is carrying its little lantern, with the red pebble glowing in it. Dvora bends to look.'),
      DV('A coal that needs no fire. Well. Don’t put it near my curtains, whatever it is.'),
      N('Your Nubbin holds the lantern a little closer to itself, the way you hold something lent.'),
    ],
  },
  // ---------------------------------------------------------------- A30-9, insert (safe)
  {
    id: 'a30-09-order-safe',
    lines: [
      N('Yossele is standing in the caretaker’s doorway with one arm across it, like a bar on a gate.'),
      N('Behind his arm Shmuel and Mirele are bouncing, trying to get out to the lane. He doesn’t move.'),
      SH('He won’t let us out! We only want to see the bread!', 'angry'),
      N('Gently, completely, he keeps them in. Every time one of them ducks under, he lifts them back with one hand.'),
      DV('He’s started doing that. Every door, all afternoon. They’re safe, I suppose. They’re very safe.', 'think'),
    ],
  },
  // ---------------------------------------------------------------- A30-9, insert (help)
  {
    id: 'a30-09-order-help',
    lines: [
      N('Yossele is sweeping the caretaker’s step. It is very clean, as if it has been swept a great many times.'),
      N('Every neighbour who passes says “Yossele, would you…” and he would. He has a basket, two buckets and a broom.'),
      RI('Old Mrs Weiss asked him to carry her chair in, and he carried her in too. She was sitting in it.'),
      N('Behind him, in a neat row, are six chairs nobody asked to be moved. He has started helping before he’s asked.'),
    ],
  },
  // ---------------------------------------------------------------- A30-9, insert (sit)
  {
    id: 'a30-09-order-sit',
    lines: [
      N('Yossele is sitting on the caretaker’s step, as long as the step. Three children are sitting with him.'),
      N('Shmuel is on one knee and Mirele on the other, and Rivka is leaning on his arm, telling him a long story.'),
      N('Your Nubbin is asleep in his lap, on its back, with its paws in the air.'),
      MI('He doesn’t talk. But he listens properly. Not like Papa.', 'happy'),
      N('Yossele doesn’t move. He has been sitting like this since noon, very still, so nobody falls.'),
    ],
  },
  // ---------------------------------------------------------------- A30-10, insert (safe)
  {
    id: 'a30-10-grow-safe',
    lines: [
      N('Yossele is going down the lane, door to door, shutting each one with his hand flat on it. Then the next.'),
      N('Every time he moves he is a little taller. The cobbles crack under his feet.'),
      N('He drags Hannah’s cart across the end of the lane, and the gate behind it, and holds them there. Nobody in, nobody out.'),
      N('People call from behind their shutters, and he doesn’t hear them. He is keeping everyone safe, and he is getting bigger.'),
      RI('He’s shut the whole lane in! Mama’s behind one of those doors, and the rabbi doesn’t know!', 'shock'),
    ],
  },
  // ---------------------------------------------------------------- A30-10, insert (help)
  {
    id: 'a30-10-grow-help',
    lines: [
      N('Yossele is doing everything at once. Sweeping the lane, fetching water, chopping wood, faster and faster.'),
      N('Every time he moves he is a little taller. The broom snaps in his hands; he picks up another, and that snaps too.'),
      N('The woodpile goes to splinters and the water barrel splits. Hannah’s oven door comes off its hinges.'),
      N('Nobody has asked him. He is helping, and helping, and helping, and he is getting bigger.'),
      DV('My pots! He’s scrubbing my pots! He’s scrubbing them into pieces!', 'shock'),
    ],
  },
  // ---------------------------------------------------------------- A30-10, insert (sit)
  {
    id: 'a30-10-grow-sit',
    lines: [
      N('In the rabbi’s courtyard Yossele is sitting on the step, with your Nubbin in his lap. He is restless.'),
      N('He grows a little as you watch, then a little more. The step cracks under him.'),
      N('He stands up. Very carefully, before anything else, he lifts your Nubbin and sets it down on the step, on its feet.'),
      N('Then he goes. Barrels roll, the fence goes over, the woodpile spills across the cobbles, and he is getting bigger.'),
      RI('He put it down first. Did you see? He put it down first.', 'shock'),
    ],
  },
  // ---------------------------------------------------------------- A30-10, insert (cinder): the flare
  {
    id: 'a30-10-ember',
    lines: [
      N('In your Nubbin’s little lantern the red pebble flares up, bright and hot, as Yossele grows.'),
      N('Your Nubbin holds the lantern away from itself with both arms, and looks at you. It knows that light.'),
    ],
  },
  // ---------------------------------------------------------------- A30-10, insert (cinder): the settling
  {
    id: 'a30-10-ember-settle',
    lines: [
      N('In the little lantern the red pebble dims, slowly, back to its own small glow. It settles, like someone sitting down.'),
      N('Your Nubbin holds it close again.'),
    ],
  },
  // ---------------------------------------------------------------- A30-12, after complete (s24Done)
  {
    id: 'a30-margin-hazel',
    lines: [
      N('Nova’s atlas lies open at the steep roof of the synagogue, and the little window high in its gable.'),
      N('Beside the window, in faint pencil you have never noticed, there is a note in the margin. You know the hand.'),
      N('“Clay, a word, and a man who forgot one Friday. I’d have forgotten every Friday.”'),
      N('Your Nubbin puts one paw on the drawing of the attic window, and leaves it there.'),
    ],
  },
  // ---------------------------------------------------------------- A30-13, insert (safe)
  {
    id: 'a30-13-order-safe',
    lines: [
      LO('You told him to keep everyone safe. And he did. On that last night he kept the whole lane in.', 'soft'),
      LO('A guard who keeps everyone in isn’t a guard any more. He’s a wall.'),
      LO('And a wall, however kind, is not a home. A home has a door that opens.', 'think'),
      LO('It was a good order. It was the order I gave him myself, in my heart. That’s why I know.'),
    ],
  },
  // ---------------------------------------------------------------- A30-13, insert (help)
  {
    id: 'a30-13-order-help',
    lines: [
      LO('You told him to help where he was asked. And at the end he helped where nobody asked at all.'),
      N('He laughs a little, sadly, and shakes his head.'),
      LO('He was a very good servant. That was the trouble.', 'sad'),
      LO('Help with no one asking for it isn’t help. It’s weather. Dvora’s pots would agree with me.'),
    ],
  },
  // ---------------------------------------------------------------- A30-13, insert (sit)
  {
    id: 'a30-13-order-sit',
    lines: [
      LO('You told him to sit with the little ones. I’ve been thinking about that most of all.', 'think'),
      LO('Everything in him, I put there. The clay, the word, the work. Even the order was put there, by you.'),
      LO('But at the end, wild as he was, he put your little one down on the step before he went.'),
      LO('Nobody told him to do that. I didn’t put that there. It is the only thing in him I didn’t.', 'soft'),
      N('Your Nubbin, at your feet, is looking at the attic window.'),
    ],
  },
  // ---------------------------------------------------------------- A30-13, insert (keptStone)
  {
    id: 'a30-13-kept',
    lines: [
      N('The rabbi looks at your pocket, where the stone is. You hadn’t thought it showed.'),
      LO('You carry something. Heavy, for its size. What is it?'),
    ],
    choices: [
      {
        id: 'tell',
        label: 'Tell him about the stone.',
        then: [
          N('You tell him, and it hums one word, safe, while you talk. He listens to the end, and doesn’t interrupt.'),
          LO('Some things are made to protect. And then they have to be put somewhere high.', 'soft'),
          LO('There’s no shame in carrying them up the steps. I did.'),
        ],
      },
      {
        id: 'keep',
        label: 'Keep it to yourself.',
        then: [
          LO('Then keep it. You’re allowed.', 'soft'),
          LO('Only, some things are made to protect, and then have to be put somewhere high. There’s no shame in carrying them up the steps.'),
        ],
      },
    ],
  },
  // ---------------------------------------------------------------- A30-13, after step 2 (sit)
  {
    id: 'a30-13-tile-paw',
    lines: [
      N('Beside the three letters there is a tiny pawprint, pressed into the corner of the tile.'),
      RI('Your Nubbin did that. I was holding it out to show it, and it put its paw on. I didn’t smooth it.', 'happy'),
    ],
  },
  // ---------------------------------------------------------------- A30-13, complete (help)
  {
    id: 'a30-13-complete-help',
    lines: [
      ...A13_START,
      N('On the sill outside the attic window, high up where nobody can reach, a broom leans against the wall.'),
      N('Nobody knows how it got there. Nobody has tried to fetch it down.'),
      ...A13_END,
    ],
  },
  // ---------------------------------------------------------------- A30-13, complete (sit)
  {
    id: 'a30-13-complete-sit',
    lines: [
      ...A13_START,
      N('On the sill of the attic window, high up where nobody can reach, there is a small clay bird. A child’s.'),
      N('Rivka looks up at it, and then at you, and doesn’t say anything. She only had enough clay for one, she said.'),
      ...A13_END,
    ],
  },
  // ---------------------------------------------------------------- Grove keepsake (cinder set)
  {
    id: 'a30-grove-tile-cinder',
    lines: [
      N('You set the clay tile on the cottage hearth, beside Hazel’s old clay tablets, the ones about the Heartstone.'),
      N('Moss comes in from the step, and stops beside it. He looks at the three letters for a long time.'),
      M('She’d have liked him. That’s the trouble with her.', 'soft'),
      N('He goes back out to his flat stone. Your Nubbin puts its night-round lantern down beside the tile, and leaves it there.'),
    ],
  },
  // ---------------------------------------------------------------- Grove keepsake (cinder not set)
  {
    id: 'a30-grove-tile',
    lines: [
      N('You set the clay tile on the cottage hearth, beside Hazel’s old clay tablets, the ones about the Heartstone.'),
      N('Moss comes in from the step, and stops beside it. You tell him what the letters say, and what one letter less says.'),
      M('Truth, and then one letter less. That’s how close it always is.', 'soft'),
      N('He goes back out to his flat stone. Your Nubbin sits by the hearth and looks at the tile until it gets dark.'),
    ],
  },
  // ---------------------------------------------------------------- Grove keepsake (moss-sleeps)
  {
    id: 'a30-grove-tile-quiet',
    lines: [
      N('You set the clay tile on the cottage hearth, beside Hazel’s old clay tablets, the ones about the Heartstone.'),
      N('There is nobody in the cottage to tell what the letters say. You say it anyway, out loud: truth, and then one letter less.'),
      N('Your Nubbin sits by the hearth and looks at the tile until it gets dark.'),
    ],
  },
];

// =================================================================== flags and checks

/** Every flag this line sets (Atlas save only). It reads cinder, keptStone, s24Done, the chapter, mossFaded and the ending, and writes no Grove flag. */
export const ATLAS_A30_FLAGS: string[] = [
  'a30-01',
  'a30-02',
  'a30-03',
  'a30-04',
  'a30-05',
  'a30-06',
  'a30-07',
  'a30-08',
  'a30-09',
  'a30-10',
  'a30-11',
  'a30-12',
  'a30-13',
  'a30-done', // A30-13: the whole page; read by atlasDone('A30') for the Price of Power festival
  'a30-order', // safe | help | sit (a30-07-order): A30-9, A30-10 and A30-13
];

export const ATLAS_A30_CHECKS: string[] = [
  'explore:a30-lanes:gate',
  'carry:a30-water:well',
  'visit:a30-bakery:lane',
  'sit:a30-study-house:back-bench',
  'talk:a30-loew:study-house',
  'talk:a30-avram:courtyard',
  'wait:a30-window:night',
  'deliver:a30-supper:study-house',
  'talk:a30-isaac:door',
  'carry:a30-lantern:window',
  'walk:a30-river:willows',
  'carry:a30-river-water:clay',
  'talk:a30-loew:riverbank',
  'watch:a30-clay:brow',
  'watch:a30-yossele:chores',
  'carry:a30-buckets:kitchen',
  'choose:a30-order:study-house',
  'walk:a30-night-round:lanes',
  'watch:a30-yossele:street-end',
  'find:a30-yossele:friday',
  'sit:a30-yossele:rest',
  'talk:a30-boy:gate',
  'wait:a30-synagogue:courtyard',
  'deliver:a30-word:synagogue-door',
  'wait:a30-psalm:door',
  'sit:a30-sabbath-table:avram',
  'carry:a30-lantern:attic-stair',
  'sit:a30-nubbin:attic-wall',
  'talk:a30-loew:bench',
  'collect:a30-tile:rivka',
];
