/**
 * Atlas campaign, page A5: The Lion of Mali (Part L). Fourteen quests, A5-1 to A5-14.
 *
 * SOURCE. The Epic of Sundiata (Sunjata), the Mande oral epic of the founding of the Mali Empire in
 * the 13th century, carried by griots (jeliw) in Mali, Guinea, Senegal, the Gambia and beyond. The
 * oral tradition belongs to no one and is public domain as a story; every written or recorded
 * telling has its own rights. The plot here mostly follows D. T. Niane's prose telling from the
 * griot Djeli Mamoudou Kouyaté (Soundjata ou l'épopée mandingue, Présence Africaine, 1960; English
 * by G. D. Pickett, Longman, 1965: both in copyright), with other tellings noted where they
 * differ. Will Eisner's graphic novel Sundiata (2002, in copyright) is a listed source in the
 * outline only: nothing of its art, layout or wording is used.
 *
 * AUDIENCE. 'all'. No lifted text, so no `childLines` are needed. The Learning Grove's own edu
 * version (the Mali Empire on a map, griots and oral history, the balafon, the Manden Charter,
 * Mansa Musa and Timbuktu's libraries) is a separate file still to do; this file is the main game.
 *
 * FRAME. Nova's atlas falls open at a page coloured like red earth and mud-dyed cloth. You and your
 * Nubbin step into Niani and are taken on as apprentice by Balla Fasséké, a young griot, son of
 * the king's griot Doua. A griot is a memory: Balla teaches you to hear a thing once and keep it.
 * Your Nubbin learns the balafon. Balla is the story's own voice: he pauses to say where tellings
 * differ ("Some tellers say..."), which is how the page gives its versions. In A5-6 Balla is sent
 * away to Sosso and asks you to be Sundiata's memory on the road until he can be again; in A5-12
 * you give it back to him. In A5-9 the atlas turns its own pages to show Balla in Sosso (it goes
 * "where the story is"). Sundiata, Sogolon and Balla keep their story; you carry, hold, sit and
 * remember. Your Nubbin never talks; no animal talks (the epic's buffalo is an old woman).
 *
 * GROVE FLAGS READ: none in this script. The Night of Remembering festival (A3, A5, A7, any two)
 * reads atlasDone('A5') from a05-done. Hazel's margin note for this page (beside A5-4, “The Iron
 * Rod”: “Seven years on the floor while they laughed. Then he stood up and bent iron. Never hurry
 * a slow one. H.”) is S24's data, not this file's: the engine shows it once s24Done is set
 * (side-stories-s24.ts, HAZEL’S MARGIN NOTES). This page has no margin-note variant of its own,
 * by design, and its count of seven years on the floor agrees with the note.
 *
 * FLAGS WRITTEN (Atlas save only, all prefixed a05-):
 *   - a05-01 … a05-14: each quest on completion. a05-done: the whole page (A5-14).
 *   - a05-tune = hunters | lullaby (A5-5, a05-05-lesson), the signature choice. It pays off four
 *     quests later in Soumaoro's chamber (A5-9: a05-09-chamber-done | ATLAS_A05_VARIANTS
 *     a05-09-chamber-done-lullaby) and again at the Assembly, where it opens the griot's telling
 *     (A5-14: a05-14-complete | ATLAS_A05_VARIANTS a05-14-complete-lullaby).
 *   - a05-remember = waiting | mother | sister | enemy (A5-14, a05-14-ask): what you ask the griot
 *     to remember. The then-lines carry the payoff; the Grove's balafon plays a matching phrase
 *     (see A5-14 notes). The Grove only reads this Atlas value; nothing here writes Grove state.
 *
 * LIFTED TEXT: none. Niane's English text and Eisner's book are in copyright, and the outline
 * lists no approved quotes, so every line is original. The opening griot speech ("I am a
 * griot...") is NOT quoted or echoed. Names, places and plot beats only. Tunes are described,
 * never given words: the hunters' tune and Sogolon's lullaby are original instrumental pieces
 * (AUDIO need), not traditional songs.
 *
 * VERSIONS GIVEN IN-GAME (where tellings differ): the hunter's prophecy vs starting with the two
 * hunters (A5-1); who the buffalo of Do was (A5-2); how Sundiata's name is made (A5-4); whether
 * the rod bent, broke, or was his mother's stick (A5-4); when the old king gave Balla to Sundiata
 * (A5-5); the nine old women (A5-6); the kings of the road (A5-7); whether the messengers came
 * before or after Sogolon died (A5-10); what Soumaoro was to his own people (A5-9, A5-13); where
 * Soumaoro went (A5-13); what was said at Kurukan Fuga (A5-14).
 *
 * CARE NOTES.
 *   - WEST AFRICAN ADVISERS. Before ship this script needs a read by West African (Mande) cultural
 *     advisers, ideally including a jeli, for names and spellings, music, dress, the balafon's
 *     playing and the page's art. None was available when this was written. Spellings follow
 *     Niane's French-derived forms (Manding, Soumaoro, Kouyaté); advisers may prefer Mande forms
 *     (Manden, Sumanguru, Kuyate). Unverified small names are kept generic on purpose: the two
 *     hunter brothers, the master smith, the kings of Djedeba and Wagadou.
 *   - A LIVING TRADITION. The epic is told today, at Kangaba's Kamabolon ceremony among other
 *     places, and the Kouyaté family still keep a great balafon, the Sosso-Bala, in Niagassola
 *     (Guinea), which UNESCO lists. The page presents itself as one telling among many and says so
 *     in its first scene and in Balla's version lines. Never "myth" or "legend" as dismissal.
 *   - SOGOLON. The epic calls her ugly and hunchbacked. The page shows the court laughing and
 *     shows that it is wrong: she is stooped and plain, and she is the strongest person in it.
 *   - SUNDIATA'S LEGS. He crawls until he is seven. Nobody on the page says he is less for it;
 *     Balla says he was already someone. The rod scene is the source's triumph and stays, but the
 *     waiting is honoured as much as the standing (the line's theme, "slow hands").
 *   - SOUMAORO. A great smith-king of Sosso, dreadful to Manding and remembered differently in
 *     Sosso. He is never a monster: he loves music and spares Balla for it. His chamber is
 *     softened for All (owls, old crowns, jars, the great balafon; no skins or skulls).
 *   - BATTLES are heroic and distant: dust, horns, banners, no wounds shown. The arrow at Kirina
 *     grazes; Soumaoro goes into the hills and is never seen again.
 *   - BELIEF. The Mande world of the epic holds Islam and older belief together: Niane's kings
 *     claim descent from Bilali, while hunters read cowries and Soumaoro's power is sorcery. The
 *     page shows the practices it needs (cowries, the nine women's powers, the spur) plainly and
 *     with respect, never ranks one belief over another, and leaves Islam off screen. Advisers to
 *     judge whether a line acknowledging it belongs in the main game or the Learning Grove file.
 *   - DEATH. The old king and Sogolon die gently and plainly ("goes to sleep and doesn't wake"),
 *     with comfort straight after.
 *   - Dress, buildings and instruments are drawn from the Mande world of the period with advisers
 *     (mud-brick, round thatched houses, boubous, the balafon, the ngoni, the kora only as a
 *     later instrument if at all). No Egyptian or generic "African" stand-ins.
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

const WHERE = 'Nova’s atlas: the Lion of Mali page (Atlas campaign)';
const after = (code: string) => `Any time after ${code}, from Nova’s atlas.`;
const SRC = 'The Epic of Sundiata (Mande oral epic, as told by griots; D. T. Niane’s telling, 1960)';

// ------------------------------------------------------------------ speakers

const BALLA = sp('a05-balla', 'Balla Fasséké', 'Balla Fasséké, griot to Sundiata, first of the Kouyaté griots (Mande oral epic)');
const DOUA = sp('a05-doua', 'Doua', 'Gnankouman Doua, griot to King Naré Maghan and father of Balla Fasséké (Niane’s telling)');
const HUNTER = sp('a05-hunter', 'The Hunter of Sangaran', 'The hunter-soothsayer who foretells Sundiata’s birth (Niane’s telling)');
const KING = sp('a05-king', 'King Naré Maghan', 'Naré Maghan (Maghan Kon Fatta), king of Manding, Sundiata’s father');
const BROTHER = sp('a05-brother', 'The Elder Hunter', 'One of the two Traoré hunter brothers who bring Sogolon to Manding (names differ by telling)');
const SOGOLON = sp('a05-sogolon', 'Sogolon', 'Sogolon Kedjou, the “buffalo woman” of Do, Sundiata’s mother');
const SASSOUMA = sp('a05-sassouma', 'Sassouma Bérété', 'Sassouma Bérété, the king’s first wife, mother of Dankaran Touman');
const SUNDIATA = sp('a05-sundiata', 'Sundiata', 'Sundiata Keita (Sogolon Djata, Mari Djata), founder of the Mali Empire');
const DANKARAN = sp('a05-dankaran', 'Dankaran Touman', 'Dankaran Touman, Sundiata’s elder half-brother, king after Naré Maghan');
const KOLONKAN = sp('a05-kolonkan', 'Kolonkan', 'Sogolon Kolonkan, Sundiata’s sister (Niane’s telling)');
const BORY = sp('a05-bory', 'Manding Bory', 'Manding Bory, Sundiata’s younger half-brother and companion in exile');
const SMITH = sp('a05-smith', 'The Master Smith', 'The master smith of Niani who forges the iron rod (named differently by different tellers)');
const ELDEST = sp('a05-eldest', 'The Eldest of the Nine', 'The eldest of the nine old women sent against Sundiata (Niane’s telling)');
const DJEDEBA = sp('a05-djedeba', 'The King of Djedeba', 'Mansa Konkon, king of Djedeba (Niane’s telling)');
const WAGADOU = sp('a05-wagadou', 'The King of Wagadou', 'The king of Wagadou (old Ghana), who shelters Sogolon’s family');
const MOUSSA = sp('a05-moussa', 'King Moussa Tounkara', 'Moussa Tounkara, king of Mema');
const COUNSELLOR = sp('a05-counsellor', 'The Old Counsellor', 'The old counsellor of Mema who reads Sundiata’s basket (Niane’s telling)');
const SOUMAORO = sp('a05-soumaoro', 'Soumaoro Kanté', 'Soumaoro (Sumanguru) Kanté, smith-king of Sosso');
const MESSENGER = sp('a05-messenger', 'Messenger from Manding', 'The messengers sent from Manding to find Sundiata');
const FRAN = sp('a05-fran', 'Fran Kamara', 'Fran Kamara (Tabon Wana), king of Tabon and Sundiata’s ally');
const TRIBAN = sp('a05-triban', 'Nana Triban', 'Nana Triban, Sundiata’s half-sister, daughter of Sassouma Bérété');
const FAKOLI = sp('a05-fakoli', 'Fakoli', 'Fakoli Koroma, Soumaoro’s nephew, who joins Sundiata');

const N = say('narrator');
const Y = say('you');
const B = say('a05-balla');
const DO = say('a05-doua');
const HU = say('a05-hunter');
const K = say('a05-king');
const BR = say('a05-brother');
const SO = say('a05-sogolon');
const SA = say('a05-sassouma');
const SU = say('a05-sundiata');
const DT = say('a05-dankaran');
const KO = say('a05-kolonkan');
const MB = say('a05-bory');
const SM = say('a05-smith');
const EL = say('a05-eldest');
const DJ = say('a05-djedeba');
const WG = say('a05-wagadou');
const MT = say('a05-moussa');
const CO = say('a05-counsellor');
const SK = say('a05-soumaoro');
const ME = say('a05-messenger');
const FR = say('a05-fran');
const NT = say('a05-triban');
const FK = say('a05-fakoli');

// ------------------------------------------------------------------ shared pieces

/** A5-9: Soumaoro's turn, after the tune (both tune variants). */
const A09_SPARED: Line[] = [
  SK('Nobody touches that balafon. I have killed kings for less than this.', 'angry'),
  N('Balla doesn’t stop. He plays the tune through to its end, and then, without a pause, he begins a praise song for Soumaoro.'),
  N('It is a good one. It names Soumaoro’s forges and his fathers and the walls of Sosso, and it gets every one of them right.'),
  SK('Hm.'),
  SK('Dankaran Touman sent you as a gift, griot. I think he gave me more than he knew. You stay here. You play for me now.', 'think'),
  N('Balla bows. When he straightens, he looks at you, once, and you understand: he isn’t free, but he isn’t finished.'),
];

/** A5-14: the end of the complete scene and the way home (both tune variants). */
const A14_END: Line[] = [
  B('Eight hundred years from now, my children’s children will still be telling this. You’ll see. And they’ll argue about it.', 'happy'),
  B('That’s how you know a story is alive. Dead ones nobody argues about.'),
  N('He puts the little balafon into your arms, and the beaters into your Nubbin’s hands.'),
  B('Go home, apprentice. Remember us properly.', 'soft'),
  N('The red earth goes soft under your feet, then smooth, then paper.'),
  N('You are back in the Grove with Nova’s atlas on your knee. Your Nubbin is tapping out a tune on the cover, very nearly in time.'),
];

// =================================================================== THE LION OF MALI

export const ATLAS_A05: Quest[] = [
  // ---------------------------------------------------------------- A5-1
  {
    id: 'a05-01',
    code: 'A5-1',
    title: 'The Hunters’ Prophecy',
    source: `${SRC}: the hunter of Sangaran`,
    audience: 'all',
    trigger: { where: WHERE, when: 'Any time once Nova’s atlas is in the Grove; the first quest on the page.' },
    speakers: [BALLA, DOUA, HUNTER, KING],
    steps: [
      {
        id: 'a05-01-s1',
        goal: 'Step into the red-earth page and find the young griot.',
        hint: 'Touch the page, then follow the sound of a balafon to the town gate.',
        check: 'explore:a05-niani:gate',
        scene: {
          id: 'a05-01-page',
          lines: [
            N('Nova’s atlas falls open at a page the colour of red earth, patterned black and white like cloth dyed with mud.'),
            N('Along the bottom someone has drawn a lion in one long line, and a buffalo in another, walking the same way.'),
            N('In the corner, in Nova’s hand: “Griots have told this for eight hundred years, and no two tell it alike.”'),
            N('Under that: “Listen to more than one.”'),
            N('The red earth warms under your palm. Then it is dust, and round thatched houses, and the smell of millet smoke.'),
            B('You came out of a picture. My father said someone would, one day. He says a lot of things.', 'shock'),
            B('I’m Balla. Balla Fasséké, son of Doua, who is griot to the king. One day I’ll be a griot too. Today I carry his things.'),
            B('You could carry some of them. A griot needs an apprentice, and I haven’t got one yet.'),
            N('Your Nubbin is already sitting on his balafon, a long row of wooden keys with gourds hung underneath. Balla doesn’t seem to mind.'),
          ],
          choices: [
            {
              id: 'what',
              label: 'Ask what a griot does.',
              then: [
                B('We remember. Who married whom, who fought where, who was brave and who only said so.'),
                B('A king without a griot is a king nobody will remember. Kings know that. It makes them polite to us.', 'happy'),
              ],
            },
            {
              id: 'carry',
              label: 'Offer to carry the balafon.',
              then: [B('Gently. It’s older than my father, and it knows it.')],
            },
          ],
        },
        done: {
          id: 'a05-01-page-done',
          lines: [
            B('Come. The king sits under the silk-cotton tree in the mornings. Something is going to happen there today.'),
            N('You don’t know how he knows. By the look of him, he doesn’t either.'),
          ],
        },
      },
      {
        id: 'a05-01-s2',
        goal: 'Stand at the back of the king’s court and listen to the hunter.',
        hint: 'Stay beside Balla under the silk-cotton tree, and don’t interrupt.',
        check: 'watch:a05-hunter:court',
        scene: {
          id: 'a05-01-court',
          lines: [
            N('King Naré Maghan sits in the shade of a great silk-cotton tree, with his court around him and a bowl of kola nuts at his elbow.'),
            N('Beside him stands a man with a calm face who seems to be listening to everything at once. That is Doua.'),
            N('A stranger comes in off the road: a hunter, with a bow on his back and a bag of cowrie shells at his belt.'),
            HU('I’m a hunter of Sangaran, king. I haven’t come for meat today. I’ve come because the shells told me to.'),
            K('Then sit, hunter. A king should hear what the shells say, even when he doesn’t like it.'),
            N('The hunter throws the cowries on a goatskin and looks at them for a long time.'),
            HU('Two hunters will come to your gate with a woman. She is not beautiful. Marry her anyway.', 'think'),
            HU('She will give you a son, and that son will make the name of Manding last as long as the sun does.'),
            N('Somebody in the court laughs. Doua looks at him, and he stops.'),
          ],
          choices: [
            {
              id: 'king',
              label: 'Watch the king’s face.',
              then: [N('The king says nothing. He turns a kola nut over in his fingers, slowly, like a man deciding to remember.')],
            },
            {
              id: 'balla',
              label: 'Watch Balla.',
              then: [N('Balla’s lips are moving. He is saying the hunter’s words over to himself, so that he will have them.')],
            },
          ],
        },
        done: {
          id: 'a05-01-court-done',
          lines: [
            DO('Hunter, the king thanks you. Eat before you go, and eat well.'),
            B('Did you get all that? Say it back to me tonight. Then we’ll both have it.'),
          ],
        },
      },
    ],
    complete: {
      id: 'a05-01-complete',
      lines: [
        N('That night, by the fire, you say the hunter’s words back to Balla. You get most of them, and he fills in the rest.'),
        B('That’s the first thing a griot learns. Hear it once, keep it always.'),
        B('Some tellers leave the hunter out, and start with the two brothers and the buffalo. My father starts here.'),
        B('He says a story should begin with a promise. Then everybody listens to find out if it’s kept.', 'happy'),
        N('Balla taps one key of the balafon with his thumb. It makes a low, round sound, like water moving in a gourd.'),
        N('Your Nubbin taps the same key. The sound comes out flatter, and much more pleased with itself.'),
        B('We’ll work on it.'),
      ],
    },
    rewards: [],
    sets: { 'a05-01': true },
    notes:
      'OPENING: the page is ochre and indigo with black-and-white mud-cloth borders (bògòlanfini; get the patterns ' +
      'from advisers, never copy a named cloth). It washes into colour as you step through. a05-01-page#2–3 are Nova’s ' +
      'margin notes, shown as handwriting. The balafon is drawn with its gourd resonators; Balla is a lanky youth of ' +
      'about fifteen here. The silk-cotton tree is a kapok (fromager). The cowries fall in a little pattern; no ' +
      'readable “reading” on screen. From here your Nubbin follows Balla’s balafon around on every visit.',
  },

  // ---------------------------------------------------------------- A5-2
  {
    id: 'a05-02',
    code: 'A5-2',
    title: 'Sogolon',
    source: `${SRC}: the buffalo of Do and Sogolon’s coming to Niani`,
    audience: 'all',
    trigger: { where: WHERE, when: after('A5-1') },
    requires: ['A5-1'],
    speakers: [BALLA, BROTHER, SOGOLON, KING, DOUA],
    steps: [
      {
        id: 'a05-02-s1',
        goal: 'Sit by the fire and hear Balla tell the tale of the buffalo of Do.',
        hint: 'Find Balla at the fire behind Doua’s house and sit down.',
        check: 'sit:a05-balla:fire',
        scene: {
          id: 'a05-02-fire',
          lines: [
            B('Before the strangers reach the gate, you should know where they’ve been. Sit. This is a fire story.'),
            B('In the land of Do there was a buffalo that nobody could hunt. It trampled the fields, and the best hunters came home with nothing.'),
            B('Two brothers went after it. On the road they met an old woman, hungry and alone, and they shared their food with her.'),
            B('She told them the truth: she was the buffalo. And because they’d been kind, she told them how to win.'),
            B('She asked one thing. The king of Do would offer them any girl they liked. They were to choose the plainest. Her name was Sogolon.', 'soft'),
            N('Your Nubbin has crept so close to the fire that its feet are warm. It doesn’t move them.'),
            B('Some tellers say the old woman was Sogolon’s aunt. Some say she was Sogolon’s own spirit, walking about without her.'),
            B('My father says it doesn’t matter which. What matters is that she was strong, and that it came to the girl.'),
          ],
          choices: [
            {
              id: 'which',
              label: 'Ask which one Balla believes.',
              then: [B('I believe whichever one I’m telling. That’s the job.', 'happy')],
            },
            {
              id: 'kind',
              label: 'Say the brothers won by being kind.',
              then: [B('Yes. Write that one down in your head. It comes back.', 'think')],
            },
          ],
        },
        done: {
          id: 'a05-02-fire-done',
          lines: [
            N('Out on the road a dog barks, and then another. Balla is on his feet before the third.'),
            B('That’s them. Come on.'),
          ],
        },
      },
      {
        id: 'a05-02-s2',
        goal: 'Walk with Sogolon from the gate to the king’s court.',
        hint: 'Meet the two hunters at the gate and walk beside the woman with them.',
        check: 'escort:a05-sogolon:court',
        scene: {
          id: 'a05-02-gate',
          lines: [
            N('Two dusty hunters come through the gate. Between them walks a young woman, stooped, with a hump on her back and very bright eyes.'),
            BR('We bring her to the king of Manding. We were told the king of Manding would know why.'),
            N('People come out of their doorways to look. Someone whispers, and someone else doesn’t bother to whisper.'),
            SO('I’ve been looked at before. It doesn’t wear me out the way they hope.'),
            BR('She’s walked from Do on her own feet. We offered her a donkey. She said the donkey looked tired.'),
            SO('It did look tired.'),
            N('She walks steadily, though the road is long and the court is a long way up it.'),
          ],
          choices: [
            {
              id: 'beside',
              label: 'Walk beside her.',
              then: [
                N('You fall in beside her. She glances at you, and something in her shoulders lets go a little.'),
                SO('A stranger from a picture, and a small round thing. Good. I like the company of odd things.'),
              ],
            },
            {
              id: 'bundle',
              label: 'Offer to carry her bundle.',
              then: [
                SO('No. It’s mine, and it’s light. But thank you for asking instead of taking it.'),
                N('Your Nubbin takes hold of one corner anyway, and walks the rest of the way like that, helping.'),
              ],
            },
          ],
        },
        done: {
          id: 'a05-02-gate-done',
          lines: [
            N('Under the silk-cotton tree, the court laughs out loud when it sees her. The king doesn’t.'),
            K('Doua. The hunter of Sangaran. Do you remember what he said?'),
            DO('Every word, my king.'),
          ],
        },
      },
    ],
    complete: {
      id: 'a05-02-complete',
      lines: [
        K('Then I know why you brought her to me. Sogolon of Do, will you be my wife?'),
        N('The laughing stops all at once, like a pot taken off the fire.'),
        SO('I will. And I’ll thank your court to stop staring. I haven’t grown a second head.', 'angry'),
        N('Doua is the first to laugh, warmly this time. Then the king laughs too, and the rest of the court has to.'),
        B('Remember that. She made them laugh with her, not at her, in one breath. My father has been trying to do that for twenty years.', 'happy'),
      ],
    },
    rewards: [],
    sets: { 'a05-02': true },
    notes:
      'The buffalo of Do is told by Balla, not shown: a small shadow-play on the hut wall by the fire (a buffalo shape, ' +
      'an old woman’s shape, two hunters). The old woman is never killed on screen and the beat is kept to “she told ' +
      'them how to win”. Sogolon is drawn stooped and plain and with great dignity; never a joke figure. The court’s ' +
      'laughter is heard, never shown as the page’s own view.',
  },

  // ---------------------------------------------------------------- A5-3
  {
    id: 'a05-03',
    code: 'A5-3',
    title: 'The Boy Who Couldn’t Walk',
    source: `${SRC}: Sundiata’s childhood and the baobab leaves`,
    audience: 'all',
    trigger: { where: WHERE, when: after('A5-2') },
    requires: ['A5-2'],
    speakers: [BALLA, SOGOLON, SUNDIATA, SASSOUMA, DOUA],
    steps: [
      {
        id: 'a05-03-s1',
        goal: 'Visit Sogolon’s house and keep her son company.',
        hint: 'Sogolon’s house is the small one at the back of the royal yard.',
        check: 'visit:a05-sogolon:house',
        scene: {
          id: 'a05-03-house',
          lines: [
            N('The atlas page turns a little, the way a griot skips ahead. A wedding, a birth and seven rainy seasons pass in a breath.'),
            N('Sogolon’s son is seven years old. He sits in the dust outside her door, broad and solemn, and he crawls wherever he goes.'),
            B('His name is Mari Djata. He doesn’t talk much. He eats like three boys and he watches everything.'),
            N('Your Nubbin toddles over and sits down in front of him. The boy looks at it for a long time.'),
            N('Then he puts out one hand, very slowly, and pats it on the head.'),
            SO('He doesn’t do that for many people. Your little round friend is honoured.', 'soft'),
            B('The old king died in the dry season, quietly, with my father beside him. Dankaran Touman is king now. His mother rules.'),
            B('Some people say the hunter was wrong. They say it where Sogolon can hear.', 'sad'),
          ],
          choices: [
            {
              id: 'sit',
              label: 'Sit down in the dust with the boy.',
              then: [
                N('You sit, and nobody says anything. The boy goes on watching the yard, and you watch it with him.'),
                N('After a while you notice he isn’t waiting for anything. He’s just looking, very hard, at all of it.'),
              ],
            },
            {
              id: 'ask',
              label: 'Ask Sogolon if he’ll walk one day.',
              then: [
                SO('He will walk when he walks. I don’t pull up seedlings to make them grow faster.'),
                SO('And until then, he is my son, and that is already a great deal.'),
              ],
            },
          ],
        },
        done: {
          id: 'a05-03-house-done',
          lines: [
            B('Mark this, apprentice. He isn’t waiting to become someone. He already is someone. He’s just not finished.', 'think'),
          ],
        },
      },
      {
        id: 'a05-03-s2',
        goal: 'Go with Sogolon to ask Queen Sassouma for baobab leaves.',
        hint: 'Walk with Sogolon across the yard to the queen mother’s house.',
        check: 'escort:a05-sogolon:sassouma-yard',
        scene: {
          id: 'a05-03-leaves',
          lines: [
            SO('I need a few baobab leaves for the sauce. Ours are gone. Sassouma has plenty.'),
            N('Queen Sassouma sits in her own yard with her women, under a baobab heavy with leaves. She sees Sogolon coming a long way off.'),
            SO('Sister. A handful of leaves, for my son’s supper.'),
            SA('Take them, of course. My son picked them for me himself, this morning. He climbed up to fetch them. On his own two legs.'),
            SA('Your son, I hear, still fetches things the way a lizard does.'),
            N('The women laugh. Sogolon takes the leaves, and her hand doesn’t shake, quite.'),
          ],
          choices: [
            {
              id: 'quiet',
              label: 'Say nothing, and walk out beside Sogolon.',
              then: [N('You walk out beside her. She keeps her back straight all the way to her own door, which is a long way, for her.')],
            },
            {
              id: 'look',
              label: 'Look Sassouma in the eye.',
              then: [
                N('You look at Sassouma. She looks back, cool and pleasant, as if you were a cloud that might rain.'),
                B('Good. She’ll remember your face. Mind you, that may not be good.', 'think'),
              ],
            },
          ],
        },
        done: {
          id: 'a05-03-leaves-done',
          lines: [
            N('At her own door, Sogolon sits down on the step and cries, quietly, with her face in the leaves.'),
            N('Her son crawls over to her. Your Nubbin sits on her other side and leans.'),
          ],
        },
      },
    ],
    complete: {
      id: 'a05-03-complete',
      lines: [
        SU('Mother. Why are you crying?'),
        N('Sogolon looks up. So does Balla, and so, it seems, does the whole yard.'),
        SO('Because of leaves. Because of a woman with a sharp tongue. Because of you, my son.', 'sad'),
        SU('Then dry your eyes, Mother. Today I stand up.', 'angry'),
        SU('Send to the forges. Ask the smiths for a rod of iron, so heavy it takes all of them to carry it.'),
        N('Balla’s mouth is open. He shuts it, and you see him say the words over to himself, quickly, so he will have them.'),
      ],
    },
    rewards: [],
    sets: { 'a05-03': true },
    notes:
      'TIME: about eight years pass in a05-03-house#0 (the wedding, the birth, then seven years; the page riffles, a ' +
      'soft sound). Balla, about fifteen in A5-1, is now in his early twenties, your ' +
      'Keeper unchanged (the atlas keeps guests as they are). The old king’s death is one plain line (#6) with no scene. ' +
      'SUNDIATA is drawn as a sturdy, watchful seven-year-old who crawls with strength and purpose: never pitiful, never ' +
      'comic. Sassouma is cool and clever, not a cartoon villain. Baobab leaves (for the sauce) are a real staple; show ' +
      'them as fresh green bunches.',
  },

  // ---------------------------------------------------------------- A5-4
  {
    id: 'a05-04',
    code: 'A5-4',
    title: 'The Iron Rod',
    source: `${SRC}: the iron rod and the baobab`,
    audience: 'all',
    trigger: { where: WHERE, when: after('A5-3') },
    requires: ['A5-3'],
    speakers: [BALLA, SMITH, SOGOLON, SUNDIATA, SASSOUMA],
    steps: [
      {
        id: 'a05-04-s1',
        goal: 'Run to the smiths with Sogolon’s message.',
        hint: 'The forges are down by the river, where the smoke is blackest.',
        check: 'deliver:a05-message:forge',
        scene: {
          id: 'a05-04-forge',
          lines: [
            N('The smiths’ quarter smells of charcoal and hot water. Hammers ring on every side, each on its own beat.'),
            N('The master smith is a big, quiet man with burn marks up both forearms. He listens to the whole message without stopping work.'),
            SM('The heaviest rod we’ve ever made. For the crawling boy.'),
            SM('My father forged a rod years ago, for a day like this. He said someone would come asking. He kept it under the bellows.'),
            N('It takes six of his apprentices to drag it out. It is as long as two of you and dark as a wet night.'),
            SM('Smiths keep secrets, apprentice. That’s half of what we are. The other half is patience.', 'think'),
          ],
          choices: [
            {
              id: 'help',
              label: 'Take hold of the rod with the apprentices.',
              then: [N('You take hold, and it is so heavy your arms forget they are yours. Your Nubbin pushes from behind, which helps exactly nothing.')],
            },
            {
              id: 'ask',
              label: 'Ask if a boy can really lift that.',
              then: [SM('No. A boy can’t. That’s the point of asking for it.')],
            },
          ],
        },
        done: {
          id: 'a05-04-forge-done',
          lines: [
            N('The whole quarter downs hammers and follows the rod up the hill. So do half the children in Niani.'),
            B('Everyone wants to see it. Half of them want to laugh. Stay close to me and keep your ears open.'),
          ],
        },
      },
      {
        id: 'a05-04-s2',
        goal: 'Watch the boy stand.',
        hint: 'Stand with Balla at the edge of the crowd outside Sogolon’s door.',
        check: 'watch:a05-rod:sogolon-door',
        scene: {
          id: 'a05-04-stand',
          lines: [
            N('The smiths lay the rod down in front of Sogolon’s door. The crowd goes quiet in a ring around it.'),
            N('The boy crawls to it. He takes it in both hands, and sets one end in the dust.'),
            N('He pulls, and his arms shake. Sweat runs down his face, and still he pulls, slowly, hand over hand, up the rod.'),
            N('Nobody breathes. Your Nubbin has its paws over its eyes, and is looking through them.'),
            N('He is on his knees, then on one foot.'),
            N('Then he is on both feet, with the iron rod bent in his hands like a hunter’s bow.'),
            B('He’s standing.', 'shock'),
            N('Then Balla is singing. It is a praise song, his own, made on the spot, and the whole hill takes it up.'),
            SO('My son is standing.', 'happy'),
          ],
          choices: [
            {
              id: 'cheer',
              label: 'Cheer.',
              then: [N('You cheer. Your Nubbin cheers, too, which is a high round squeak, and runs three times round his feet.')],
            },
            {
              id: 'sogolon',
              label: 'Look at Sogolon.',
              then: [N('Sogolon isn’t cheering; she has her hands over her mouth. She has waited seven years, and she is still waiting, one breath more.')],
            },
          ],
        },
        done: {
          id: 'a05-04-stand-done',
          lines: [
            B('Some tellers say the first rods snapped in his hands, and he leaned on his mother’s stick in the end. Some say it was a baobab branch.'),
            B('I was there. It was iron. It bent. But I’ll tell you the stick version, too, because that one’s also true.'),
          ],
        },
      },
      {
        id: 'a05-04-s3',
        goal: 'Gather the baobab’s leaves for Sogolon.',
        hint: 'Pick up the leaves around the baobab now standing at Sogolon’s door.',
        check: 'collect:a05-leaves:baobab',
        scene: {
          id: 'a05-04-baobab',
          lines: [
            SU('Mother. You wanted baobab leaves.'),
            N('He walks, a little stiffly, to the edge of the town where a young baobab grows. He puts his arms around it.'),
            N('In Niane’s telling, and plenty of others, he pulls it up by the roots and carries it home.'),
            N('He sets it down at his mother’s door. The leaves shake all over the yard.'),
            SU('From now on, the women of Niani will come to you for leaves.'),
            SO('That’s enough for one day, my son. Sit down, before you fall down.', 'happy'),
          ],
        },
        done: {
          id: 'a05-04-baobab-done',
          lines: [
            N('You and your Nubbin gather the leaves into baskets. There are a great many.'),
            N('Across the yard, Queen Sassouma’s door is shut. Nobody saw it close.'),
          ],
        },
      },
    ],
    complete: {
      id: 'a05-04-complete',
      lines: [
        B('From today they’ll call him Sogolon’s Djata. Say it quickly, and you get Sundiata.'),
        B('Djata means lion. So that’s his mother and the lion, both, in one name. Some tellers make it from other words. They’re not wrong either.'),
        N('Sogolon gives you a baobab seed, round and hard as a pebble, and folds your fingers over it.'),
        SO('For your own yard. They grow very slowly. Don’t let that worry you.', 'soft'),
        N('Your Nubbin tries to eat it, and you take it back. Sogolon laughs out loud.'),
      ],
    },
    rewards: [],
    sets: { 'a05-04': true },
    notes:
      'THE ROD: one held shot, no cuts, while the boy climbs it (a slow tilt up, about four seconds), then the rod bends ' +
      'into a bow shape. Respect prefers-reduced-motion (cut to the standing pose). Balla’s praise song is a new ' +
      'instrumental cue with a voice humming: no words on screen. The baobab is pulled up in silhouette against the sky. ' +
      'VERSIONS: a05-04-stand-done (rod, stick, branch) and the naming line (a05-04-complete#1). The baobab seed is a plot ' +
      'prop here; the baobab tree reward is given at A5-14. MARGIN: once s24Done is set (read-only), the engine shows ' +
      'S24’s Hazel margin note for this page beside this quest (side-stories-s24.ts); this file adds no variant for it.',
  },

  // ---------------------------------------------------------------- A5-5
  {
    id: 'a05-05',
    code: 'A5-5',
    title: 'The Griot',
    source: `${SRC}: Balla Fasséké becomes Sundiata’s griot`,
    audience: 'all',
    trigger: { where: WHERE, when: after('A5-4') },
    requires: ['A5-4'],
    speakers: [BALLA, DOUA, SUNDIATA, SOGOLON],
    steps: [
      {
        id: 'a05-05-s1',
        goal: 'Stand witness when Balla is given to Sundiata as his griot.',
        hint: 'Meet Doua and Balla at the hunters’ clearing outside the town.',
        check: 'talk:a05-doua:clearing',
        scene: {
          id: 'a05-05-given',
          lines: [
            N('Sundiata is ten now, and hunts with the older boys. Every hunter in Manding has already started telling stories about him.'),
            N('In the hunters’ clearing, Doua puts his hand on his son’s shoulder and walks him forward.'),
            DO('The old king asked for this before he died. Every king has a griot. My son will be yours.'),
            SU('I don’t need someone to sing at me.'),
            DO('No. You need someone to remember you. You’ll do things you’ll forget. He won’t.'),
            B('And I’ll tell you when you’re being a fool. That’s in it too. Nobody mentions that part.', 'happy'),
            SU('Then you’d better stay close. I’ll need telling.'),
            B('In my father’s telling, the old king gave me to Sundiata while he was still crawling. I tell it now, because now is when I knew.'),
          ],
        },
        done: {
          id: 'a05-05-given-done',
          lines: [
            N('Sundiata and Balla shake hands, very formally, like two old men. Then Sundiata trips Balla into the grass.'),
            B('He’s going to be a great king. Write that down.', 'sad'),
          ],
        },
      },
      {
        id: 'a05-05-s2',
        goal: 'Let Balla teach your Nubbin a tune on the balafon.',
        hint: 'Sit your Nubbin at the balafon by Balla’s house and choose the tune it learns.',
        check: 'minigame:a05-balafon:lesson',
        scene: {
          id: 'a05-05-lesson',
          lines: [
            B('Now. If you’re my apprentice, your round friend is too. It’s been staring at this balafon for ten years.'),
            N('He puts a pair of beaters into your Nubbin’s paws. They are nearly as long as it is.'),
            B('Wood on wood. The gourds underneath sing back. You don’t hit the key. You ask it.'),
            N('Your Nubbin asks it, and the key answers, round and low. Your Nubbin looks up at you with enormous pride.'),
            B('Good. One tune, to start. A griot has a thousand, but everyone has a first.'),
            B('There’s the hunters’ tune, quick and stamping, the one they play for Sundiata when he comes home with meat.'),
            B('Or there’s the one Sogolon hums at night, when she’s grinding millet. She doesn’t know anybody hears it. Everybody does.', 'soft'),
            B('Which one?'),
          ],
          choices: [
            {
              id: 'hunters',
              label: 'The hunters’ tune.',
              set: { 'a05-tune': 'hunters' },
              then: [
                N('Balla plays it once through: quick, stamping, a tune for a lot of feet coming home at dusk.'),
                N('Your Nubbin plays it back, in roughly the right order. Its feet stamp, too, which isn’t part of the tune, but helps.'),
                B('That’s a tune for a crowd. You’ll never be lonely with that one in your hands.', 'happy'),
              ],
            },
            {
              id: 'lullaby',
              label: 'Sogolon’s lullaby.',
              set: { 'a05-tune': 'lullaby' },
              then: [
                N('Balla plays it once through: slow, rocking, the sound of a grinding stone going round and round in the dark.'),
                N('Your Nubbin plays it back, very carefully, as if it might wake somebody.'),
                B('That’s a tune for one person. Whoever hears it will think it’s for them.', 'soft'),
              ],
            },
          ],
        },
        done: {
          id: 'a05-05-lesson-done',
          lines: [
            N('Your Nubbin plays its tune all evening. By night it can play it all the way through without stopping.'),
            N('Across the yard, Sogolon’s door is open, and she is sitting just inside it, listening.'),
          ],
        },
      },
    ],
    complete: {
      id: 'a05-05-complete',
      lines: [
        B('Keep that tune. Don’t trade it, don’t lose it. A tune you know by heart is a door you can always find in the dark.'),
        B('I can’t tell you which door yet. I’ll tell you when we get there.', 'think'),
        N('Your Nubbin plays the first three notes again, just to check they’re still there. They are.'),
      ],
    },
    rewards: [],
    sets: { 'a05-05': true },
    notes:
      'SIGNATURE CHOICE (a05-05-lesson): a05-tune = hunters | lullaby. It pays off in A5-9 (Balla plays this tune on ' +
      'Soumaoro’s great balafon: a05-09-chamber-done for hunters, ATLAS_A05_VARIANTS a05-09-chamber-done-lullaby for ' +
      'lullaby) and A5-14 (the tune opens the griot’s telling: a05-14-complete, or the variant a05-14-complete-lullaby). ' +
      'MINIGAME: a five-key balafon call-and-response, four phrases, no fail state (any order still plays; the right order ' +
      'sparkles). AUDIO: two original short instrumental tunes, recorded on a real balafon with an adviser (a jeli if ' +
      'possible). Neither is a traditional song, and neither has words. VERSION: a05-05-given#7.',
  },

  // ---------------------------------------------------------------- A5-6
  {
    id: 'a05-06',
    code: 'A5-6',
    title: 'Exile',
    source: `${SRC}: the nine old women, Balla sent to Sosso, Sogolon’s departure`,
    audience: 'all',
    trigger: { where: WHERE, when: after('A5-5') },
    requires: ['A5-5'],
    speakers: [BALLA, SUNDIATA, ELDEST, DANKARAN, SOGOLON, KOLONKAN, BORY],
    steps: [
      {
        id: 'a05-06-s1',
        goal: 'Keep watch in Sogolon’s vegetable garden at night.',
        hint: 'Hide behind the gourd vines with Sundiata and wait for the visitors.',
        check: 'wait:a05-garden:night',
        scene: {
          id: 'a05-06-garden',
          lines: [
            B('Sassouma has paid nine old women to come into Sogolon’s garden tonight. Everyone in Niani knows, except Sassouma, who thinks it’s a secret.'),
            B('They have powers, these nine. Some say they were sent to harm him. Some say only to steal, and make him angry enough to harm them.'),
            N('The garden is silver with moonlight. Nine bent shapes come through the gap in the fence and begin to fill their baskets with gourds and greens.'),
            N('Sundiata stands up out of the vines. The nine freeze.'),
            SU('Grandmothers. You don’t need to creep. Take what you want.', 'soft'),
            SU('If you’d asked in daylight, I’d have given you more. Here, these ones are better. Those ones are still green.'),
            N('He fills their baskets for them. Your Nubbin, catching on, brings them a gourd each, with difficulty.'),
          ],
        },
        done: {
          id: 'a05-06-garden-done',
          lines: [
            EL('We were paid to make you angry, son of Sogolon. You’ve made us ashamed instead.', 'sad'),
            EL('From tonight, we watch over you. Go carefully. The one who sent us won’t stop at nine old women.'),
          ],
        },
      },
      {
        id: 'a05-06-s2',
        goal: 'Say goodbye to Balla before he is sent away.',
        hint: 'Find Balla at the palace gate, where King Dankaran Touman’s envoys are setting out.',
        check: 'talk:a05-balla:palace-gate',
        scene: {
          id: 'a05-06-sent',
          lines: [
            N('In the morning there are horses at the palace gate, loaded with gifts. Balla stands beside them with his balafon on his back.'),
            DT('The king of Sosso grows strong. I send him gifts, and I send him a griot, to sing him our friendship. Balla Fasséké will go.'),
            N('King Dankaran Touman doesn’t look at Sundiata when he says it. He doesn’t have to.'),
            SU('You can’t take a man’s griot. He’s mine. My father gave him to me.', 'angry'),
            DT('Your father’s dead, brother. I am king.'),
            N('Balla puts a hand on Sundiata’s arm. Sundiata shakes with anger, and doesn’t move.'),
            B('Apprentice. Listen. I can’t go with him now, so you’ll have to.'),
            B('Wherever he goes, remember it for me. All of it. The good and the foolish. Then one day you’ll tell it back, and I’ll have it.', 'soft'),
          ],
          choices: [
            {
              id: 'promise',
              label: 'Promise him.',
              then: [B('Good. Then I’m not leaving him. I’m only going ahead.', 'soft')],
            },
            {
              id: 'come',
              label: 'Ask why he won’t refuse.',
              then: [
                B('Because if I refuse, Sundiata will fight his brother for me, here, in the gate, and lose. He isn’t ready yet.'),
                B('A griot has to know when to be carried off quietly. Remember that, too.', 'sad'),
              ],
            },
          ],
        },
        done: {
          id: 'a05-06-sent-done',
          lines: [
            N('The horses go out of the gate. Your Nubbin plays the first three notes of its tune after them, as loud as it can.'),
            N('Far down the road, faintly, the balafon on Balla’s back answers with the next three.'),
          ],
        },
      },
      {
        id: 'a05-06-s3',
        goal: 'Leave Niani with Sogolon’s family before dawn.',
        hint: 'Meet Sogolon and her children at the west gate in the dark.',
        check: 'walk:a05-road:west-gate',
        scene: {
          id: 'a05-06-leave',
          lines: [
            SO('We go tonight. While my son is angry, he isn’t safe here, and while we stay, nor is anyone who loves him.'),
            N('There are five of them at the west gate: Sogolon, Sundiata, his sisters Kolonkan and little Djamarou, and his half-brother Manding Bory.'),
            MB('My mother says I should stay. I said I’m going where Djata goes. She cried, and then she packed me food.', 'sad'),
            KO('Walk quietly. The road out of Niani has ears.'),
            N('Sundiata looks back once at the town, at the dark shape of the baobab at his mother’s door.'),
            SU('I’ll come back. Remember I said so.'),
          ],
          choices: [
            {
              id: 'earth',
              label: 'Pick up a handful of Niani’s red earth.',
              then: [N('You tie it in a corner of your cloth. It is very light, and it feels heavier as the night goes on.')],
            },
            {
              id: 'hold',
              label: 'Take Djamarou’s hand.',
              then: [N('Djamarou takes your hand without looking up, and holds on, and doesn’t let go until the sun is up.')],
            },
          ],
        },
      },
    ],
    complete: {
      id: 'a05-06-complete',
      lines: [
        N('By sunrise Niani is a smudge behind you. Nobody talks, and even your Nubbin walks without bouncing.'),
        N('You find you are counting things to remember: the shape of the hills, the colour of the sky, who carried what.'),
        SU('You’re doing what Balla does. Your lips move.'),
        Y('I promised him.'),
        SU('Then remember this. My mother walked out of her husband’s town with her head up. Tell him that first.'),
      ],
    },
    rewards: [],
    sets: { 'a05-06': true },
    notes:
      'THE NINE: drawn as nine elderly women in indigo, bent, with baskets: powerful, never ugly or frightening. Their ' +
      'powers are hinted (their shadows are owls on the fence for a frame), never shown as harm. VERSION in Balla’s ' +
      'second line. BALLA SENT AWAY: in Niane’s telling Dankaran Touman sends Balla to Soumaoro with an embassy; the ' +
      'page uses that, which also explains A5-9. From here until A5-12 Balla is gone and you carry the memory: the ' +
      'journal shows a small “For Balla” list that fills with one line per quest (SIM/UI: a notebook page in the Atlas ' +
      'save, read back in A5-12). The answering balafon notes (a05-06-sent-done#1) are an AUDIO cue.',
  },

  // ---------------------------------------------------------------- A5-7
  {
    id: 'a05-07',
    code: 'A5-7',
    title: 'Kingdom to Kingdom',
    source: `${SRC}: the exile at Djedeba and Wagadou`,
    audience: 'all',
    trigger: { where: WHERE, when: after('A5-6') },
    requires: ['A5-6'],
    speakers: [SUNDIATA, KOLONKAN, DJEDEBA, WAGADOU, SOGOLON, BORY],
    steps: [
      {
        id: 'a05-07-s1',
        goal: 'Watch Sundiata play the king of Djedeba at wori.',
        hint: 'Sit by the game board in the king’s yard, and watch Kolonkan.',
        check: 'minigame:a05-wori:djedeba',
        scene: {
          id: 'a05-07-djedeba',
          lines: [
            N('The first court on the road is Djedeba. Its king is friendly, too friendly, and very fond of games.'),
            DJ('Sit, son of Sogolon. Play me at wori. Seeds into pits, round and round. If you win, you have my hospitality.'),
            DJ('If you lose, well. We’ll talk about that if it happens.', 'happy'),
            N('The board is carved wood with two rows of hollows. The king’s seeds click into them very fast.'),
            KO('He plays with a ring on his finger, brother. Watch the ring, not the seeds.'),
            N('Kolonkan says it so softly that only you, Sundiata and your Nubbin hear. Your Nubbin immediately stares at the ring.'),
            N('Sundiata watches the ring. Then he starts to win.'),
          ],
          choices: [
            {
              id: 'count',
              label: 'Count the seeds for Sundiata.',
              then: [N('You count under your breath, and Sundiata nods once without looking at you. He was already counting, but he likes the company.')],
            },
            {
              id: 'nubbin',
              label: 'Let your Nubbin keep staring at the ring.',
              then: [N('The king notices, and becomes very uncomfortable. He moves the ring to the other hand, then into his sleeve.')],
            },
          ],
        },
        done: {
          id: 'a05-07-djedeba-done',
          lines: [
            DJ('You play like an old man, son of Sogolon. You don’t hurry and you don’t forgive a mistake.', 'think'),
            DJ('Stay the night. Then go on. I don’t want a boy like you near my throne.'),
          ],
        },
      },
      {
        id: 'a05-07-s2',
        goal: 'Sit in on the council of the king of Wagadou.',
        hint: 'Go into Wagadou’s council house with Sundiata and keep quiet at the back.',
        check: 'sit:a05-council:wagadou',
        scene: {
          id: 'a05-07-wagadou',
          lines: [
            N('Wagadou is old: older than Manding, older than anything you have seen on this page. Its king is kind, and tired, and careful.'),
            WG('Sogolon’s family is welcome. Your father was my friend. Sit at my council, young man, and learn how a king listens.'),
            N('All day, people come to the king: a farmer with a quarrel about a field, a widow, two traders with one goat between them.'),
            N('The king hears every one of them right to the end, even the goat men, who take a long time.'),
            SU('Why do you let them talk so long, king? You knew the answer straight away.'),
            WG('So did they, most of them. They came to be heard. A king who answers too quickly only rules people. He doesn’t keep them.'),
          ],
        },
        done: {
          id: 'a05-07-wagadou-done',
          lines: [
            N('That night Sundiata sits up late, turning the king’s words over like seeds in a pit.'),
            SU('Did you get that? Put it in the list for Balla. Put it near the top.'),
          ],
        },
      },
      {
        id: 'a05-07-s3',
        goal: 'Walk the long road east with the family.',
        hint: 'Keep pace with Sogolon at the back of the line.',
        check: 'walk:a05-road:sahel',
        scene: {
          id: 'a05-07-road',
          lines: [
            N('Months of road. Thorn trees, dry river beds, a sky so big it makes your Nubbin hold on to your ankle.'),
            N('Sogolon walks more slowly every week. Nobody mentions it.'),
            MB('Djata, we could get there by the new moon if we pushed on.'),
            SU('We go at my mother’s pace. That’s the fastest pace there is, because it’s the one where we all arrive.'),
            N('Sundiata drops back and walks beside his mother, and so the whole family walks at the back.'),
            KO('He used to be the slowest of us. Now he’s the one who waits. I think that’s the same lesson, turned round.', 'think'),
          ],
          choices: [
            {
              id: 'carry',
              label: 'Offer to carry Sogolon’s water gourd.',
              then: [SO('Thank you. My hands are glad. My pride isn’t, but my pride can walk on its own.', 'happy')],
            },
            {
              id: 'tune',
              label: 'Ask your Nubbin to play its tune as you walk.',
              then: [N('Your Nubbin plays the tune on its own knees, tapping. The family walks to it without meaning to, all at the same pace.')],
            },
          ],
        },
      },
    ],
    complete: {
      id: 'a05-07-complete',
      lines: [
        N('Seven years on the road go by in a turn of the page. Sundiata is a man now, broad as a door.'),
        KO('Tellers argue about this road. Some send us to Tabon first. Some leave Djedeba out. Some add three more kings.'),
        KO('I was on it, and I couldn’t tell you the order either. Roads are like that.', 'happy'),
        SU('What I learned was in the order it came. Patience, then listening, then my mother’s pace. Remember it that way.'),
      ],
    },
    rewards: [],
    sets: { 'a05-07': true },
    notes:
      'WORI: the mancala-family game (also oware, awalé); its West African name and board design to be checked with ' +
      'advisers. The minigame is a short, friendly round where you watch the ring and tap when it moves; no losing ' +
      'state. The Djedeba king’s ring trick is a beat from Niane’s telling (Kolonkan’s warning); kept light. WAGADOU: the ' +
      'king is unnamed on purpose. VERSION: Kolonkan’s lines in the complete scene (the road’s order differs by teller). ' +
      'TIME: the complete scene turns seven years; Sundiata is about eighteen.',
  },

  // ---------------------------------------------------------------- A5-8
  {
    id: 'a05-08',
    code: 'A5-8',
    title: 'Mema',
    source: `${SRC}: Sundiata at Mema; Sogolon’s death`,
    audience: 'all',
    trigger: { where: WHERE, when: after('A5-7') },
    requires: ['A5-7'],
    speakers: [MOUSSA, SUNDIATA, SOGOLON, KOLONKAN],
    steps: [
      {
        id: 'a05-08-s1',
        goal: 'Watch Sundiata ride out with the army of Mema.',
        hint: 'Climb the watch-mound by Mema’s wall and watch the horsemen.',
        check: 'climb:a05-mema:watch-mound',
        scene: {
          id: 'a05-08-army',
          lines: [
            N('Mema is a city on a river, with a king who loves horses and has a great many of them.'),
            MT('Sogolon’s son. I’m told you can ride, and hunt, and that you don’t lose your temper. Can you lead?'),
            SU('I don’t know yet, king. Give me twenty horsemen and I’ll find out.'),
            N('From the mound you watch them go out, a line of dust across the plain, Sundiata at the front.'),
            N('They come back at dusk with banners they didn’t leave with, and nobody missing. The city goes out to meet them.'),
            MT('Twenty horsemen, and none lost. Tomorrow, take two hundred.', 'happy'),
          ],
          choices: [
            {
              id: 'list',
              label: 'Add it to the list for Balla.',
              then: [N('You add it: Mema, the dust, the banners, and that nobody was missing. You think Balla will like that best.')],
            },
            {
              id: 'nubbin',
              label: 'Wave your Nubbin’s paw at the riders.',
              then: [N('Sundiata sees it, all the way from the gate, and lifts his spear in answer.')],
            },
          ],
        },
        done: {
          id: 'a05-08-army-done',
          lines: [
            N('Year by year Moussa Tounkara gives him more. In time Sundiata is second only to the king.'),
            MT('I have no son, and I am getting old. I don’t say anything by that. I just say it.', 'think'),
          ],
        },
      },
      {
        id: 'a05-08-s2',
        goal: 'Sit with Sogolon.',
        hint: 'She is resting on the mat in the shade behind the house. Just sit.',
        check: 'sit:a05-sogolon:mat',
        scene: {
          id: 'a05-08-mat',
          lines: [
            N('Sogolon rests a great deal now. She lies on a mat in the shade, and the shade moves round her as the day goes.'),
            SO('Sit, apprentice. You and your round one. I like a quiet visitor. My son visits like a herd of cattle.'),
            N('You sit, and your Nubbin lies down against her side. She puts her hand on it.'),
            SO('I won’t see Niani again. Don’t argue. I’m old and I can count.', 'soft'),
            SO('I’ve done my part. I carried him, and I waited for him, and I walked him to the edge of the world. He can do the rest.'),
            SO('Tell Balla that I wasn’t sad about it. Tell him I was very proud, and very tired, and both are fine.'),
          ],
          choices: [
            {
              id: 'stay',
              label: 'Stay, and say nothing.',
              then: [
                N('You stay. She closes her eyes, and the shade moves.'),
                N('After a while she is humming, very low, the tune from the grinding stone.'),
              ],
            },
            {
              id: 'promise',
              label: 'Promise to tell Balla.',
              then: [SO('Good. Say it in my voice. Make him laugh at the cattle bit.', 'happy')],
            },
          ],
        },
        done: {
          id: 'a05-08-mat-done',
          lines: [
            N('That night Sogolon goes to sleep and doesn’t wake up.'),
            N('In the morning her children sit around her mat, and you sit with them. Nobody says anything for a long time, and that is right.'),
          ],
        },
      },
    ],
    complete: {
      id: 'a05-08-complete',
      lines: [
        KO('She waited for him seven years in the dust. She’d want us to stop crying before seven days. She was strict like that.', 'sad'),
        SU('She was the strongest person I’ve ever met. Stronger than the iron rod. I only bent it. She carried it, all those years.'),
        N('Your Nubbin goes and sits on the empty mat in the shade, where it is still warm. Nobody moves it.'),
        N('After a while, Kolonkan sits down beside it, and puts her hand on its head the way her mother did.', 'soft'),
      ],
    },
    rewards: [],
    sets: { 'a05-08': true },
    notes:
      'SOGOLON’S DEATH (all-ages): said plainly and gently in one line (a05-08-mat-done#0), comfort straight after. No ' +
      'body is shown: the mat in the shade, then the children around it. The army scenes are distant dust and banners, ' +
      'no fighting on screen. If a05-tune is lullaby, the hum in the “stay” choice is that same tune; if hunters, it is ' +
      'still the lullaby (she has always hummed it) and your Nubbin looks up at a tune it doesn’t know (AUDIO cue only, ' +
      'same text). VERSION: Niane’s telling puts the messengers before her death; Balla notes this in A5-10.',
  },

  // ---------------------------------------------------------------- A5-9
  {
    id: 'a05-09',
    code: 'A5-9',
    title: 'The Sorcerer King',
    source: `${SRC}: Soumaoro’s chamber; Sosso takes Manding`,
    audience: 'all',
    trigger: { where: WHERE, when: after('A5-8') },
    requires: ['A5-8'],
    speakers: [BALLA, SOUMAORO, DANKARAN],
    steps: [
      {
        id: 'a05-09-s1',
        goal: 'Follow the atlas back to Sosso, and find Balla.',
        hint: 'The atlas has turned its own pages. Look for Balla inside Sosso’s tower.',
        check: 'explore:a05-sosso:tower',
        scene: {
          id: 'a05-09-sosso',
          lines: [
            N('The atlas pages riffle, as if a wind has come in at the window. When they settle, the red earth is grey with smoke.'),
            N('You are in Sosso, years ago, on the day Balla arrived with Dankaran Touman’s gifts. The atlas goes where the story is.'),
            N('Sosso is a city of forges. Its walls ring with hammers, and above them stands a tall tower with seven floors.'),
            B('Apprentice? You’re not supposed to be here. You’re supposed to be with him.', 'shock'),
            B('Oh. It’s the page, isn’t it. A griot can stand in two places: where it happened, and where it’s told.'),
            B('Soumaoro is out. And at the top of his tower is a door that nobody is allowed through. So, naturally.'),
          ],
          choices: [
            {
              id: 'stop',
              label: 'Tell him it’s a bad idea.',
              then: [B('It’s a very bad idea. I’m going anyway. You’ll want to be there, so you can say I was warned.', 'happy')],
            },
            {
              id: 'follow',
              label: 'Follow him up the stairs.',
              then: [N('You follow him up seven floors of stairs. Your Nubbin follows you, one step at a time, with great determination.')],
            },
          ],
        },
        done: {
          id: 'a05-09-sosso-done',
          lines: [
            N('The door at the top isn’t locked, because nobody in Sosso would dare. Balla pushes it open.'),
          ],
        },
      },
      {
        id: 'a05-09-s2',
        goal: 'Stand by Balla in Soumaoro’s secret chamber.',
        hint: 'Stay behind Balla at the great balafon. Don’t touch the owls.',
        check: 'inspect:a05-chamber:great-balafon',
        scene: {
          id: 'a05-09-chamber',
          lines: [
            N('The chamber is dim and close. Owls sit on perches in the dark and turn their heads to watch you.'),
            N('There are jars and bundles on shelves, and on one wall, a row of old crowns from kings Soumaoro has beaten.'),
            N('In the middle stands a balafon bigger than any you have seen. Its keys are dark with age, and its gourds hang like moons.'),
            B('Oh. Oh, look at that.', 'soft'),
            B('A griot can’t see a balafon like that and not play it. It would be rude. To the balafon.'),
            N('He sits. He looks at you, and at your Nubbin, and you see him decide something.'),
            B('Your tune. The one your round friend learned. Let’s see what it sounds like on a king’s instrument.'),
          ],
        },
        done: {
          id: 'a05-09-chamber-done',
          lines: [
            N('Balla plays the hunters’ tune. On this balafon it is enormous: quick, stamping, a sound like a hundred hunters coming home.'),
            N('Your Nubbin stamps along, and the owls shift on their perches. Somewhere below, a door bangs, and heavy feet climb the stairs fast.'),
            N('Soumaoro Kanté fills the doorway, tall, in a cloak the colour of iron, his face like thunder. Then he hears the tune.'),
            SK('That is a hunters’ tune. My father’s hunters played that, coming home, when I was small.', 'think'),
            ...A09_SPARED,
          ],
        },
      },
      {
        id: 'a05-09-s3',
        goal: 'Watch from the tower as Sosso’s army marches on Manding.',
        hint: 'Stand at the tower window with Balla.',
        check: 'watch:a05-sosso:army',
        scene: {
          id: 'a05-09-march',
          lines: [
            N('The page turns forward again. From the tower window, you watch Soumaoro’s army go out of Sosso like smoke out of a forge.'),
            B('He’s taking Manding. Dankaran Touman sent him gifts, and a griot, and it wasn’t enough. It never is, with a man like that.', 'sad'),
            N('Far off, the page shows Niani, small, with its gates open, and Dankaran Touman riding hard the other way.'),
            DT('Don’t tell anyone I ran. No. Tell them. It doesn’t matter now.', 'sad'),
            B('Manding has no king now. It has Soumaoro.'),
            B('Go back to him, apprentice. Remember for me still. I’ll keep the tune going here, so he has something to come home to.'),
          ],
        },
      },
    ],
    complete: {
      id: 'a05-09-complete',
      lines: [
        B('In Sosso they tell this differently. To them Soumaoro was a great smith and a great king, who stood up to bigger kings.'),
        B('In some of their tellings he was fighting for his own people, and Manding was the one in the wrong. Remember that too.'),
        B('I’m his griot now, so I have to sing him well. I find that I can. He loves music more than anyone I’ve met.', 'think'),
        N('The pages riffle again. Grey smoke goes back to red earth, and you are in Mema, in the morning, with your Nubbin asleep on your feet.'),
      ],
    },
    rewards: [],
    sets: { 'a05-09': true },
    notes:
      'SIGNATURE PAYOFF (a05-tune, set in A5-5, four quests earlier). a05-09-chamber-done is for hunters: Soumaoro hears ' +
      'his father’s hunters. For lullaby play ATLAS_A05_VARIANTS a05-09-chamber-done-lullaby in its place: Soumaoro ' +
      'hears a tune his mother hummed. Both end with A09_SPARED (he keeps Balla as his griot). THE ATLAS TURNS ITSELF: ' +
      'a05-09-sosso#0–1 go back in time to Balla’s arrival (Niane places the chamber scene on Balla’s first visit, before ' +
      'Sosso takes Manding); a05-09-march#0 turns forward; a05-09-complete#3 brings you back to Mema the morning after ' +
      'A5-8. THE CHAMBER is softened for All: owls, jars, bundles and old crowns; no skins, skulls or snakes. Soumaoro ' +
      'is dreadful and dignified, never a monster. VERSION: a05-09-complete#0–1 (Sosso’s side).',
  },

  // ---------------------------------------------------------------- A5-10
  {
    id: 'a05-10',
    code: 'A5-10',
    title: 'The Call Home',
    source: `${SRC}: the messengers from Manding; the basket for the king of Mema`,
    audience: 'all',
    trigger: { where: WHERE, when: after('A5-9') },
    requires: ['A5-9'],
    speakers: [KOLONKAN, MESSENGER, SUNDIATA, MOUSSA, COUNSELLOR],
    steps: [
      {
        id: 'a05-10-s1',
        goal: 'Help Kolonkan at her market stall.',
        hint: 'Kolonkan sells greens from home in Mema’s market. Mind the stall with her.',
        check: 'find:a05-market:kolonkan-stall',
        scene: {
          id: 'a05-10-market',
          lines: [
            N('Mema’s market is all noise and colour. Kolonkan keeps a little stall at the end, selling baobab leaves and the roots they cook at home.'),
            N('This morning, the morning after, she has opened it anyway. Her mother would have.'),
            KO('Nobody here buys them. I keep the stall so the smell is somewhere. Is that foolish?'),
            N('Four tired men in travelling clothes stop dead in front of the stall. One of them picks up a bunch of leaves and smells it.'),
            ME('These are Manding leaves. Who sells Manding leaves in Mema?', 'shock'),
            KO('Sogolon’s daughter does.'),
            ME('Sogolon’s daughter. Then her son is here. We’ve searched every market from the river to the sand for him.'),
            ME('Soumaoro has Manding. The king ran. The people send us to find the lion. Is he here?'),
          ],
          choices: [
            {
              id: 'run',
              label: 'Run for Sundiata.',
              then: [N('You run. Your Nubbin runs too, a little behind, and arrives just as Sundiata does, out of breath and very proud of itself.')],
            },
            {
              id: 'stay',
              label: 'Stay with Kolonkan.',
              then: [KO('Stay. My hands are shaking. Hold the stall while I find my brother.', 'shock')],
            },
          ],
        },
        done: {
          id: 'a05-10-market-done',
          lines: [
            SU('I said I’d come back. My mother heard me say it.'),
            SU('Now I have to go and do it, and she isn’t here to see.', 'sad'),
          ],
        },
      },
      {
        id: 'a05-10-s2',
        goal: 'Pack Sundiata’s basket for the king of Mema.',
        hint: 'Find the three things Sundiata asks for around the old house, and put them in the basket.',
        check: 'collect:a05-basket:old-house',
        scene: {
          id: 'a05-10-basket',
          lines: [
            N('There is one more thing. Sogolon must be buried, and Moussa Tounkara is not pleased that his best general is leaving.'),
            MT('A stranger’s grave needs ground, and ground has a price. And I had hoped you would stay and be my heir.', 'angry'),
            SU('He’s grieving too, in his way. He’ll get his price. Apprentice, bring me a basket.'),
            SU('Put in some broken pots from the rubbish heap. Some old straw from a fallen roof. And a few feathers, from the yard.'),
            N('You gather them into a very odd basket. Your Nubbin adds a feather of its own choosing, a large one.'),
            SU('Now take it to the king’s house. Set it down in front of his council, and say nothing at all.'),
          ],
          choices: [
            {
              id: 'ask',
              label: 'Ask what it means.',
              then: [SU('He has old counsellors. Let one of them tell him. It sounds better in an old voice.')],
            },
            {
              id: 'guess',
              label: 'Work it out yourself.',
              then: [
                N('Broken pots, a fallen roof, feathers scattered in a yard. It looks like a town after a war has been through it.'),
                SU('You’ve been listening to Balla. Don’t say it. Let them say it.'),
              ],
            },
          ],
        },
        done: {
          id: 'a05-10-basket-done',
          lines: [
            CO('King. This is a ruined town, in a basket. He says: give my mother her ground, or one day this is Mema.'),
            MT('I know what it says.', 'sad'),
            MT('Give her the best ground we have. And give him horsemen. Half of mine. I’d rather be his friend than his basket.'),
          ],
        },
      },
    ],
    complete: {
      id: 'a05-10-complete',
      lines: [
        N('Sogolon is buried in Mema, under a tree, with all honour. Moussa Tounkara stands at the graveside with his head bowed.'),
        KO('Balla will tell you the messengers came first, and that she lived just long enough to hear them. Plenty of griots tell it that way.'),
        KO('I like that telling. I won’t say it’s wrong. I just wasn’t there for it.', 'soft'),
        N('Then the horses are saddled, and the road west is open, and Sundiata is going home.'),
      ],
    },
    rewards: [],
    sets: { 'a05-10': true },
    notes:
      'ORDER: Niane’s telling has the messengers arrive before Sogolon dies, then the burial and the basket. The outline ' +
      'puts her death in A5-8, so here the messengers come the morning after it (the same morning a05-09-complete ' +
      'returns you to), before the burial; Kolonkan gives the other version in the ' +
      'complete scene. THE BASKET: our own staging of the beat (broken pottery, old thatch, feathers); the exact contents ' +
      'differ by telling. The “gather” check is three pickups with no wrong items. Moussa Tounkara is a decent, sad king, ' +
      'not a villain. The burial is one plain line with no body shown.',
  },

  // ---------------------------------------------------------------- A5-11
  {
    id: 'a05-11',
    code: 'A5-11',
    title: 'Tabon',
    source: `${SRC}: the allies gather; the first battles`,
    audience: 'all',
    trigger: { where: WHERE, when: after('A5-10') },
    requires: ['A5-10'],
    speakers: [SUNDIATA, FRAN, BORY, SOUMAORO],
    steps: [
      {
        id: 'a05-11-s1',
        goal: 'Greet the kings who come to join Sundiata.',
        hint: 'Stand with Manding Bory at the camp gate and welcome each king in.',
        check: 'talk:a05-fran:tabon',
        scene: {
          id: 'a05-11-allies',
          lines: [
            N('Word goes ahead of him on the road. At the iron hills of Tabon, kings are waiting with their people.'),
            FR('Fran Kamara, king of Tabon. I played with you when we were boys, Sogolon’s son. You used to cheat at wrestling.'),
            SU('I crawled. It was the only way to win.'),
            FR('Tabon is with you. So are the hunters of Sibi, and more are coming.', 'happy'),
            MB('Every king who’s been afraid of Soumaoro is walking up this road, Djata. They’ve just been waiting for someone to go first.'),
            N('All day they come in, with drums and banners. Your Nubbin greets every single one at the camp gate, very seriously.'),
          ],
          choices: [
            {
              id: 'list',
              label: 'Add every king’s name to the list for Balla.',
              then: [N('By sunset the list for Balla is the longest thing you have ever written in your head. You keep it all.')],
            },
            {
              id: 'drum',
              label: 'Let your Nubbin play its tune for the newcomers.',
              then: [N('A drummer from Sibi picks up your Nubbin’s tune and plays it back bigger. Soon half the camp has it.')],
            },
          ],
        },
      },
      {
        id: 'a05-11-s2',
        goal: 'Watch the battle from the ridge.',
        hint: 'Climb the ridge above the pass and stay there with the drummers.',
        check: 'watch:a05-battle:tabon-ridge',
        scene: {
          id: 'a05-11-battle',
          lines: [
            N('From the ridge the battle is dust, horns and banners, moving like weather across the plain.'),
            N('Sundiata’s horsemen go through Sosso’s lines like water through a broken dam. Sosso’s banners fall back.'),
            N('Then a figure in an iron-coloured cloak rides out alone on a black horse. The arrows fly at him and fall short, or slide off, or turn.'),
            SK('Son of the buffalo. You’ve grown. It won’t help you.'),
            N('Sundiata rides at him, and Soumaoro is simply not there any more. He is on the hill opposite, watching.'),
            N('Your Nubbin hides its face in your coat. Then, slowly, it looks out again.'),
          ],
          choices: [
            {
              id: 'hold',
              label: 'Hold your Nubbin close.',
              then: [N('You hold it. Its heart is going very fast, and so is yours.')],
            },
            {
              id: 'watch',
              label: 'Keep watching Soumaoro.',
              then: [N('He doesn’t look angry. He looks interested, like a smith testing a new blade, and that is worse.')],
            },
          ],
        },
        done: {
          id: 'a05-11-battle-done',
          lines: [
            N('By evening the pass is Sundiata’s, and Sosso’s army has gone back over the hills. Soumaoro went first, untouched.'),
          ],
        },
      },
      {
        id: 'a05-11-s3',
        goal: 'Sit in on Sundiata’s council fire.',
        hint: 'The council sits at the big fire in the middle of the camp.',
        check: 'sit:a05-council:camp-fire',
        scene: {
          id: 'a05-11-council',
          lines: [
            SU('We’ve won the pass. We’ll win the next battle, and the one after. And we still won’t have touched him.'),
            FR('Iron doesn’t cut him. Arrows don’t find him. He goes from one hill to the next like a bird.'),
            SU('Then he has a secret. Every great sorcerer has one thing that undoes him.'),
            MB('And nobody alive knows what it is. Except Soumaoro.'),
            SU('And whoever he trusts.', 'think'),
            N('Sundiata looks into the fire for a long time. You know that look: his mother had it, waiting.'),
          ],
        },
      },
    ],
    complete: {
      id: 'a05-11-complete',
      lines: [
        SU('Apprentice. My griot is in Sosso, in Soumaoro’s house. If anyone in the world can learn his secret, it’s Balla.'),
        SU('So we wait. And we win battles while we wait, because that keeps people alive. But mostly we wait.'),
        N('Your Nubbin plays the first three notes of its tune, softly, towards Sosso. Nobody answers, and it plays them again anyway.'),
      ],
    },
    rewards: [],
    sets: { 'a05-11': true },
    notes:
      'BATTLE (all-ages): seen only from the ridge; dust, horns, banners, horses; no wounds, no falling men on screen. ' +
      'Soumaoro’s vanishing is a cut: the cloak on one hill, then on the other. Fran Kamara’s boyhood friendship is from ' +
      'Niane’s telling; kept light. “Sibi” is Kamandjan’s kingdom; he is not named on screen. Advisers to check flags ' +
      'and banners (no invented emblems presented as historical).',
  },

  // ---------------------------------------------------------------- A5-12
  {
    id: 'a05-12',
    code: 'A5-12',
    title: 'The Secret',
    source: `${SRC}: Nana Triban and Balla Fasséké escape Sosso`,
    audience: 'all',
    trigger: { where: WHERE, when: after('A5-11') },
    requires: ['A5-11'],
    speakers: [BALLA, TRIBAN, SUNDIATA],
    steps: [
      {
        id: 'a05-12-s1',
        goal: 'Keep the night watch at the edge of the camp.',
        hint: 'Sit by the watch fire at the camp’s edge and wait.',
        check: 'wait:a05-camp:watch-fire',
        scene: {
          id: 'a05-12-watch',
          lines: [
            N('It is your turn to keep the night watch. The camp sleeps behind you, and your Nubbin sleeps on your feet.'),
            N('Very late, two figures come out of the dark, on foot, slowly, holding each other up.'),
            N('One is a young woman in a torn cloak. The other has a balafon on his back.'),
            B('Apprentice. You kept the fire lit. Of course you did.', 'soft'),
            N('Your Nubbin is awake. It is across the ground and up Balla’s front before he can put the balafon down.'),
            B('Yes. Hello. Yes. I missed you too. I played your tune every night, did you know? Soumaoro got very tired of it.', 'happy'),
          ],
        },
        done: {
          id: 'a05-12-watch-done',
          lines: [
            N('Sundiata comes out of his tent, sees who it is, and doesn’t say anything at all. He just holds on to Balla for a long time.'),
          ],
        },
      },
      {
        id: 'a05-12-s2',
        goal: 'Give Balla back everything you kept for him.',
        hint: 'Sit with Balla by the fire and tell him the list.',
        check: 'talk:a05-balla:watch-fire',
        scene: {
          id: 'a05-12-list',
          lines: [
            B('Well, apprentice. You promised. Tell me. All of it, the good and the foolish.'),
            N('You tell him: the west gate in the dark, the road, the wori and the ring, the king of Wagadou and the goat men.'),
            N('Mema, and the dust, and nobody missing; the mat in the shade; the market, and the basket.'),
            N('Balla doesn’t interrupt once. Now and then his lips move, saying a thing over so that he will have it.'),
            B('The goat men. I wish I’d seen the goat men.', 'happy'),
            SU('Two men and one goat, all afternoon. I learned more from that goat than from any battle since.'),
            B('Where do you want to start? A griot always knows the first thing he’ll say. It holds the rest up.'),
          ],
          choices: [
            {
              id: 'sogolon',
              label: 'Start with Sogolon walking out of Niani with her head up.',
              then: [
                B('Yes. That’s the one. Djata told you to say that first, didn’t he? I can hear him in it.', 'soft'),
                N('You give him her message about the cattle. He laughs, and then he has to stop and wipe his face.'),
              ],
            },
            {
              id: 'pace',
              label: 'Start with Sundiata walking at his mother’s pace.',
              then: [B('Good. That’s the whole king, right there. The rest is only battles.', 'think')],
            },
            {
              id: 'nobody',
              label: 'Start with “nobody missing”.',
              then: [B('A griot’s start. Most people want the glory first. You picked the counting. Keep doing that.', 'happy')],
            },
          ],
        },
        done: {
          id: 'a05-12-list-done',
          lines: [
            B('Now I have it. Now it won’t be lost. Thank you, apprentice. You’ve no idea what you’ve carried.', 'soft'),
          ],
        },
      },
      {
        id: 'a05-12-s3',
        goal: 'Hear Nana Triban tell Soumaoro’s secret.',
        hint: 'Join the council in Sundiata’s tent.',
        check: 'talk:a05-triban:tent',
        scene: {
          id: 'a05-12-secret',
          lines: [
            N('In Sundiata’s tent, the young woman lets her hood fall. She is Nana Triban, his half-sister: Sassouma’s daughter.'),
            NT('My brother the king married me to Soumaoro, to keep him friendly. It didn’t work. Nothing does, with him.'),
            NT('So I made him trust me. I praised him, and listened, and laughed in the right places, for a long time.'),
            NT('One night he told me what he fears. Not iron, not arrows. A white rooster’s spur, on the point of an arrow.'),
            SU('You’re Sassouma’s daughter. Your mother drove mine out of Niani. Why would you bring me this?'),
            NT('Because I’m my own daughter too, brother. And because Sogolon once gave me baobab leaves, when my mother wasn’t looking.', 'soft'),
          ],
        },
      },
    ],
    complete: {
      id: 'a05-12-complete',
      lines: [
        N('In the morning a farmer of the camp brings a white rooster’s spur: from an old bird who died of nothing but years.'),
        N('A smith fixes it to the point of an arrow, and you hold the shaft still while he works. Your Nubbin holds your elbow still.'),
        B('Some tellers say Balla stole the secret. Some say it was Nana Triban alone. Some say they found it together.'),
        B('Tonight I’m telling it as it happened. Tomorrow I’ll tell it as it’s told. Both of those are my job.'),
      ],
    },
    rewards: [],
    sets: { 'a05-12': true },
    notes:
      'REUNION: you give Balla the memory you kept since A5-6 (UI: the “For Balla” notebook page plays back as a short ' +
      'montage of one image per quest while a05-12-list#1–2 play). The first-line choice sets no flag. NANA TRIBAN: ' +
      'Sassouma’s daughter in Niane’s telling, married off to Soumaoro; the baobab-leaf kindness is our own small ' +
      'invention, echoing A5-3. THE SPUR: no bird is harmed on screen; the spur comes from an old bird that died ' +
      'naturally (our staging). VERSION: a05-12-complete#2–3.',
  },

  // ---------------------------------------------------------------- A5-13
  {
    id: 'a05-13',
    code: 'A5-13',
    title: 'Kirina',
    source: `${SRC}: Fakoli joins Sundiata; the battle of Kirina`,
    audience: 'all',
    trigger: { where: WHERE, when: after('A5-12') },
    requires: ['A5-12'],
    speakers: [FAKOLI, SUNDIATA, BALLA, SOUMAORO],
    steps: [
      {
        id: 'a05-13-s1',
        goal: 'Welcome Fakoli and his smiths into the camp.',
        hint: 'Meet Fakoli at the camp gate with Balla.',
        check: 'talk:a05-fakoli:camp-gate',
        scene: {
          id: 'a05-13-fakoli',
          lines: [
            N('A big man comes up the road with a company of smiths behind him, their hammers on their shoulders.'),
            FK('I am Fakoli, son of Soumaoro’s sister. I’ve made his iron all my life. I’ve come to make yours.'),
            SU('Why would Soumaoro’s nephew change sides on the eve of a battle?'),
            FK('Because he took my wife Keleya out of my house and into his. Because nothing is ever enough for him.', 'angry'),
            FK('A man who will take that from his own family will take everything from everyone. So I’ve come.'),
            B('In Sosso they’ll call Fakoli a traitor. In Manding they’ll call him a hero. He’s a man who had enough.', 'think'),
          ],
          choices: [
            {
              id: 'welcome',
              label: 'Bring him water.',
              then: [FK('Thank you. That’s the first thing anyone has given me in a long time without wanting something back.', 'soft')],
            },
            {
              id: 'smiths',
              label: 'Show the smiths where to set up their forge.',
              then: [N('By nightfall the camp has a forge, glowing at the edge. Your Nubbin sits as close as it’s allowed, warming its feet.')],
            },
          ],
        },
      },
      {
        id: 'a05-13-s2',
        goal: 'Watch the arrow at Kirina.',
        hint: 'Stand with Balla on the rise behind Sundiata’s lines.',
        check: 'watch:a05-kirina:rise',
        scene: {
          id: 'a05-13-kirina',
          lines: [
            N('The plain of Kirina at dawn: two armies in long lines, with banners, horns and drums, and dust already rising.'),
            N('Soumaoro rides out alone again, in his iron-coloured cloak, as he did at Tabon. He doesn’t need anyone else.'),
            SK('Lion cub. I’ve beaten kings who could walk before you could talk. Go home.'),
            N('Sundiata draws his bow. The arrow is plain, except for its point, where a small white spur is bound with thread.'),
            N('He looses it. It doesn’t strike hard; it only grazes Soumaoro’s shoulder.'),
            N('Soumaoro looks at his shoulder. Then he looks up at the sky, as if something has just flown out of him.'),
            SK('Who told you?', 'shock'),
          ],
        },
        done: {
          id: 'a05-13-kirina-done',
          lines: [
            N('Soumaoro turns his horse and rides. His army breaks behind him and runs, and Sundiata’s horsemen go after it.'),
            B('Not him. Leave him to Sundiata. Come on, apprentice. A griot follows the end of a story, not the middle.'),
          ],
        },
      },
      {
        id: 'a05-13-s3',
        goal: 'Follow Sundiata into the hills, to the cave.',
        hint: 'Climb the rocky path into the hills behind the plain.',
        check: 'climb:a05-koulikoro:cave-path',
        scene: {
          id: 'a05-13-cave',
          lines: [
            N('High in the hills of Koulikoro, Sundiata has stopped his horse at the mouth of a cave.'),
            N('Soumaoro’s black horse stands outside it, riderless, cropping the grass.'),
            SU('He went in. Nobody has come out.'),
            N('The cave is dark all the way back. No sound comes out of it at all.'),
            B('Some say he’s still in there. Some say he became stone, part of the hill. In Sosso they say he simply went where he chose.', 'think'),
            B('Everyone agrees on one thing: he was never seen again.'),
          ],
          choices: [
            {
              id: 'wait',
              label: 'Wait at the cave mouth a little while.',
              then: [N('You wait, and Sundiata waits with you. Nothing comes out but a little cool air, and then the sun moves.')],
            },
            {
              id: 'tune',
              label: 'Let your Nubbin play its tune into the cave.',
              then: [
                N('Your Nubbin plays its tune into the dark, softly. It comes back off the walls, the same and not quite the same.'),
                B('He loved music. Whatever else he was, he loved it. That should be remembered too.', 'soft'),
              ],
            },
          ],
        },
      },
    ],
    complete: {
      id: 'a05-13-complete',
      lines: [
        SU('He was the greatest enemy I’ll ever have. I don’t want him sung badly, griot.'),
        B('He won’t be. Not by me.'),
        N('Sundiata takes the black horse’s bridle and leads it down the hill. He doesn’t ride it; he walks beside it, all the way back.'),
      ],
    },
    rewards: [],
    sets: { 'a05-13': true },
    notes:
      'KIRINA (all-ages): the arrow is the only blow shown, and it grazes. The rout is dust and horses; nobody falls on ' +
      'screen. Soumaoro’s line “Who told you?” is our own. FAKOLI: Keleya is taken “out of my house and into his”; ' +
      'nothing more. ' +
      'Fakoli’s smiths are honoured; Mande smiths (numu) are a respected caste with their own lore, so advisers to check ' +
      'their dress and tools. THE CAVE: Koulikoro is the traditional place; no body, no fight, no death stated. ' +
      'VERSIONS: Balla on Fakoli (a05-13-fakoli#5) and on Soumaoro’s end (a05-13-cave#4).',
  },

  // ---------------------------------------------------------------- A5-14
  {
    id: 'a05-14',
    code: 'A5-14',
    title: 'The Assembly',
    source: `${SRC}: the assembly at Kurukan Fuga`,
    audience: 'all',
    trigger: { where: WHERE, when: after('A5-13') },
    requires: ['A5-13'],
    speakers: [BALLA, SUNDIATA, FRAN, FAKOLI, KOLONKAN],
    steps: [
      {
        id: 'a05-14-s1',
        goal: 'Go to the great assembly at Kurukan Fuga.',
        hint: 'Walk with Balla to the wide clearing where the kings are gathering.',
        check: 'visit:a05-kurukan-fuga:assembly',
        scene: {
          id: 'a05-14-assembly',
          lines: [
            N('At Kurukan Fuga, on a wide plain near Kangaba, the kings and peoples of Manding gather in a great ring.'),
            N('There are more people than you can count, and more drums than you can hear separately. Your Nubbin tries to count anyway.'),
            N('One by one the kings come forward and lay down their spears before Sundiata, and say what their people will do.'),
            FR('Tabon gives its iron. Its people keep their own ways and their own names.'),
            FK('The smiths give their skill. Their craft stays theirs, father to son, and nobody may take it from them.'),
            N('Then the whole ring is quiet, and Sundiata stands up.'),
            SU('Manding is one now. Every clan keeps its name and its work. A stranger is a guest. Nobody harms a messenger.'),
            SU('And every person’s life is worth something. Even the least of them. Even the ones who crawl.', 'soft'),
          ],
        },
        done: {
          id: 'a05-14-assembly-done',
          lines: [
            B('Tellers argue to this day about the exact words said here. That’s how you know they mattered.'),
            B('The rules agreed here are still remembered. People call them the Manden Charter.'),
            N('The ring roars, and they name him Mansa, king of kings. Kolonkan is crying and pretending she isn’t.'),
          ],
        },
      },
      {
        id: 'a05-14-s2',
        goal: 'Choose what you ask Balla to remember.',
        hint: 'Find Balla at the edge of the ring, where the griots sit.',
        check: 'choose:a05-remember:griots',
        scene: {
          id: 'a05-14-ask',
          lines: [
            N('At the edge of the ring, where the griots sit, Balla is tuning his balafon. He looks happier than you’ve ever seen him.'),
            B('Sundiata has made my family his griots for ever. My children, and theirs. The Kouyaté. We’ll keep this story as long as we last.'),
            N('Your Nubbin climbs onto the balafon’s frame and sits there, as it did on the very first day.'),
            B('Which means I’ll tell it ten thousand times, and every time a little differently. That’s allowed. That’s the life in it.'),
            B('But some things a griot never leaves out, however he tells the rest. One thing in every telling.'),
            N('Around you the other griots are tuning too. Each of them, you realise, will tell this day their own way.'),
            B('Apprentice, you were there for most of it. What should I never leave out?'),
          ],
          choices: [
            {
              id: 'waiting',
              label: 'That it took him seven years to stand, and that was all right.',
              set: { 'a05-remember': 'waiting' },
              then: [
                B('Yes. Everyone remembers the rod. I’ll make them remember the dust before it, and the years nobody hurried him.', 'soft'),
              ],
            },
            {
              id: 'mother',
              label: 'That his mother was the strongest person in it.',
              set: { 'a05-remember': 'mother' },
              then: [B('Sogolon. Yes. She goes in the first line, every time. I’ll make it a law in my family.', 'happy')],
            },
            {
              id: 'sister',
              label: 'That Nana Triban chose to bring the secret.',
              set: { 'a05-remember': 'sister' },
              then: [B('Sassouma’s daughter, choosing for herself. Yes. People forget her. I won’t let them.', 'think')],
            },
            {
              id: 'enemy',
              label: 'That the enemy loved music.',
              set: { 'a05-remember': 'enemy' },
              then: [B('That’s the hardest one to sing, and the truest. Yes. I’ll keep Soumaoro whole.', 'soft')],
            },
          ],
        },
      },
    ],
    complete: {
      id: 'a05-14-complete',
      lines: [
        N('The ring falls quiet. Balla stands before the kings to tell, for the first time, the story of Sundiata.'),
        B('Before I begin, my apprentice’s round friend will play us in. It learned the tune I’d have chosen myself.'),
        N('Your Nubbin plays the hunters’ tune on Balla’s balafon. A hundred hunters stamp along, and the whole ring stamps with them.'),
        SU('My hunting tune. The one they played when I came home.', 'happy'),
        ...A14_END,
      ],
    },
    rewards: [
      {
        id: 'a05-balafon',
        kind: 'feature',
        label: 'Balafon',
        description:
          'A small wooden balafon from Balla Fasséké. Play it as often as you like: your Nubbins gather round and dance, and it never leaves out what you asked Balla to keep.',
      },
      {
        id: 'a05-baobab',
        kind: 'decor',
        label: 'Baobab Tree',
        description: 'Grown from Sogolon’s seed. A baobab grows very slowly and lives a very long time. Don’t let that worry you.',
      },
      {
        id: 'a05-title-griots-apprentice',
        kind: 'title',
        label: 'Griot’s Apprentice',
        description: 'You heard it once and kept it. Balla Fasséké’s apprentice, on the Lion of Mali page.',
      },
      {
        id: 'a05-remembering-bookmark',
        kind: 'item',
        label: 'Night of Remembering Bookmark',
        description: 'A strip of mud-dyed cloth with one balafon key drawn on it. It marks this page, and counts towards the Night of Remembering.',
      },
    ],
    sets: { 'a05-14': true, 'a05-done': true },
    notes:
      'SIGNATURE PAYOFF (a05-tune, set in A5-5). The complete scene shown is for hunters. For lullaby play ' +
      'ATLAS_A05_VARIANTS a05-14-complete-lullaby (the ring goes quiet instead of stamping; Kolonkan recognises her ' +
      'mother’s grinding tune). Both end with A14_END. SECOND CHOICE (a05-14-ask): a05-remember = waiting | mother | ' +
      'sister | enemy. The then-line is the payoff; in the Grove, the balafon’s tune always adds a short phrase for the ' +
      'pick (AUDIO: four two-bar phrases), so the choice is heard every time the reward is played. The Grove reads ' +
      'a05-remember from the Atlas save, read-only; no Grove flag is written. The balafon is unlimited: play it any ' +
      'time, no cooldown. KURUKAN FUGA: what was said is told in plain words that echo the Manden ' +
      'Charter as UNESCO lists it (clans and their work, strangers as guests, the worth of every life); never quoted from ' +
      'any published text, and Balla says tellers differ. The Kouyaté line is real: Balla’s descendants are griots ' +
      'still. REWARDS (one-time, at a05-14-complete*): the Balafon feature (Nubbins dance), the Baobab Tree decor, the ' +
      'Griot’s Apprentice title, and the Night of Remembering Bookmark. SIM: the Night of Remembering festival (A3, A5, ' +
      'A7, any two) reads atlasDone(\'A5\') from a05-done.',
  },
];

// =================================================================== variants

/**
 * Variant scenes chosen by flags. Each quest's notes say exactly where each plays.
 *   a05-tune = lullaby (A5-5): a05-09-chamber-done-lullaby (replaces a05-09-chamber-done),
 *   a05-14-complete-lullaby (replaces a05-14-complete). The main scenes are the hunters' versions,
 *   and they also play whenever a05-tune is unset (it can't be once A5-5 is done, but the engine
 *   should default to hunters).
 */
export const ATLAS_A05_VARIANTS: Scene[] = [
  // ---------------------------------------------------------------- A5-9, replacement (lullaby)
  {
    id: 'a05-09-chamber-done-lullaby',
    lines: [
      N('Balla plays Sogolon’s lullaby. On this balafon it is huge and slow, like a grinding stone going round under the whole of Sosso.'),
      N('Your Nubbin sways, and the owls close their eyes. Somewhere below, a door bangs, and heavy feet climb the stairs fast.'),
      N('Soumaoro Kanté fills the doorway, tall, in a cloak the colour of iron, his face like thunder. Then he hears the tune.'),
      SK('My mother hummed that. At night, at the grinding stone, when she thought I was asleep.', 'soft'),
      ...A09_SPARED,
    ],
  },
  // ---------------------------------------------------------------- A5-14, replacement (lullaby)
  {
    id: 'a05-14-complete-lullaby',
    lines: [
      N('The ring falls quiet. Balla stands before the kings to tell, for the first time, the story of Sundiata.'),
      B('Before I begin, my apprentice’s round friend will play us in. It learned the tune I’d have chosen myself.'),
      N('Your Nubbin plays Sogolon’s lullaby on Balla’s balafon. Thousands of people go quiet to hear it.'),
      KO('That’s our mother’s grinding tune. She never knew anyone heard it.', 'soft'),
      SU('She’d be cross to be the first thing in the story. Then she’d be very pleased.', 'happy'),
      ...A14_END,
    ],
  },
];

// =================================================================== flags and checks

/** Every flag this line sets (Atlas save only). It reads no Grove flag and writes none. */
export const ATLAS_A05_FLAGS: string[] = [
  'a05-01',
  'a05-02',
  'a05-03',
  'a05-04',
  'a05-05',
  'a05-06',
  'a05-07',
  'a05-08',
  'a05-09',
  'a05-10',
  'a05-11',
  'a05-12',
  'a05-13',
  'a05-14',
  'a05-done', // A5-14: the whole page; read by atlasDone('A5') for the Night of Remembering festival
  'a05-tune', // hunters | lullaby (a05-05-lesson): A5-9 and A5-14 variants
  'a05-remember', // waiting | mother | sister | enemy (a05-14-ask): the Grove balafon's added phrase
];

export const ATLAS_A05_CHECKS: string[] = [
  'explore:a05-niani:gate',
  'watch:a05-hunter:court',
  'sit:a05-balla:fire',
  'escort:a05-sogolon:court',
  'visit:a05-sogolon:house',
  'escort:a05-sogolon:sassouma-yard',
  'deliver:a05-message:forge',
  'watch:a05-rod:sogolon-door',
  'collect:a05-leaves:baobab',
  'talk:a05-doua:clearing',
  'minigame:a05-balafon:lesson',
  'wait:a05-garden:night',
  'talk:a05-balla:palace-gate',
  'walk:a05-road:west-gate',
  'minigame:a05-wori:djedeba',
  'sit:a05-council:wagadou',
  'walk:a05-road:sahel',
  'climb:a05-mema:watch-mound',
  'sit:a05-sogolon:mat',
  'explore:a05-sosso:tower',
  'inspect:a05-chamber:great-balafon',
  'watch:a05-sosso:army',
  'find:a05-market:kolonkan-stall',
  'collect:a05-basket:old-house',
  'talk:a05-fran:tabon',
  'watch:a05-battle:tabon-ridge',
  'sit:a05-council:camp-fire',
  'wait:a05-camp:watch-fire',
  'talk:a05-balla:watch-fire',
  'talk:a05-triban:tent',
  'talk:a05-fakoli:camp-gate',
  'watch:a05-kirina:rise',
  'climb:a05-koulikoro:cave-path',
  'visit:a05-kurukan-fuga:assembly',
  'choose:a05-remember:griots',
];
