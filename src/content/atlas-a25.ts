/**
 * Atlas campaign, page A25: The Nothing (Part M, rank 28). Twenty quests, A25-1 to A25-20.
 *
 * SOURCE. Michael Ende, Die unendliche Geschichte (Thienemann, Stuttgart, 1979). Rights: the Ende
 * estate (AVA international / Michael Ende Erben) and Thienemann-Esslinger; Ralph Manheim’s English
 * translation (The Neverending Story, Doubleday, 1983) is separately in copyright and is not used
 * anywhere. The 1984 and 1990 films are not used either: the page follows the novel, both halves,
 * from Coreander’s shop to Coreander’s shop. AURYN’s design and the book’s cover art belong to the
 * estate and the publisher: license them, or draw the original two-snake emblem described in the
 * notes (two pale snakes, one light and one dark, each biting the other’s tail, in our own style).
 * Treat the whole page as needing a licence before ship.
 *
 * AUDIENCE. 'all', rated with care (see CARE NOTES). Both lifted lines have `childLines`
 * replacements. The Learning Grove’s own version (reader band only, Part One only, ending at Moon
 * Child, A25-14) is a separate job and is not in this file.
 *
 * FRAME. Nova’s atlas falls open at a page with a glass door and a little bell, and a book whose
 * cover shows two snakes biting each other’s tails. You and your Nubbin step out of the page behind
 * the bell of Carl Conrad Coreander’s shop, unseen, and follow the boy who steals the book to his
 * school attic. When he opens it, so do you. The page is printed in two inks, as the novel is: the
 * attic in rust-red, Fantastica in green (the art and the UI follow this; see notes). You are a
 * traveller who came in through a page. You walk with Atreyu from the Grassy Sea to the Ivory Tower,
 * and later with Bastian’s company, and later still with Atreyu again. Neither story is yours:
 * the Empress tells you plainly that you can’t give her name (A25-13), and Uyulala says it first in
 * rhyme (A25-10). Your Nubbin rides on Artax’s saddle, then in the fur behind Falkor’s ears. It never
 * speaks. The book’s own talking creatures talk (canon 31): Artax, Morla, Falkor, Ygramul, Gmork,
 * Graógramán, Argax and the rest. Running motifs: your notebook (you write in it from A25-1, and
 * it matters in A25-15), and the attic in red ink between the green chapters.
 *
 * GROVE FLAGS READ (read-only; the Atlas never writes a Grove flag):
 *   - s6Done (S6: Ash’s true name, Ember’s three whistled notes, low, high and a little one).
 *       true:  A25-13: ATLAS_A25_VARIANTS a25-13-empress-ash replaces a25-13-empress (the Empress
 *              speaks of a name whistled back in a kitchen with one lamp lit).
 *              A25-20: a25-20-water-ash replaces a25-20-water (your Nubbin whistles the three notes
 *              softly, like a question; Atreyu looks at it and then says Bastian’s name. Atreyu still
 *              says it; your Nubbin only asks).
 *              In the Grove, after the page: a25-grove-ember plays the next time you visit Ember.
 *       false: A25-13: the Empress simply knows your Nubbin’s name and says it (the base scene).
 *              A25-20 plays as the book does (the base scene).
 *   - s24Done (S24): Hazel’s margin note, ATLAS_A25_VARIANTS a25-margin-hazel, after a25-16-complete.
 *
 * FLAGS WRITTEN (Atlas save only, all prefixed a25-):
 *   - a25-01 … a25-20: each quest on completion. a25-done: the whole page (A25-20); the Grove
 *     scenes and the Attic Nook read it through atlasDone('A25').
 *   - a25-mirror = truth | yourself | notebook (A25-15, a25-15-mirror). The signature choice. It
 *     pays off in A25-16, A25-18, A25-19 and A25-20 (five quests on), and in the Attic Nook.
 *
 * LIFTED TEXT (copyrighted: two one-sentence lines, under the limit of three, both in Ende’s German
 * exactly as Part M lists them, each followed by our own English; text of the first edition,
 * Thienemann 1979, as Part M gives it. Set with guillemets and no-break spaces):
 *   1. AURYN’s inscription, « TU WAS DU WILLST ». Ours: “Do what you wish.” a25-15-sand#8 (once).
 *   2. The book’s refrain, « Aber das ist eine andere Geschichte und soll ein andermal erzählt
 *      werden. » Ours: “But that is another story, and shall be told another time.”
 *      a25-16-hynreck#8 (with the English at #9) and a25-20-shop#10 (with the English at #11).
 * Every quoted line has a childLines entry, though the Learning Grove version stops at A25-14.
 * The Empress’s new name is “Moon Child” (German Mondenkind). Uyulala’s rhymes, Gmork’s speech, the
 * Water’s questions and every other line are original. No passage of the novel is reproduced.
 *
 * CARE NOTES.
 *   - Artax (A25-5) is one quiet scene, never repeated: he stops, and the swamp closes. Optional
 *     parent note before A25-5 (text in A25-5’s notes).
 *   - Gmork’s end is offscreen (A25-12): we see Atreyu’s face. Ygramul’s sting is a jolt and a fall
 *     through light, not a bite. Atreyu’s wound (A25-18) shows no blood.
 *   - Bastian’s body. He is a round, knock-kneed boy, drawn with affection and never a joke. The
 *     page’s signature choice treats that boy as worth liking.
 *   - Atreyu’s people (the Greenskins of the Grassy Sea) are designed fresh with an adviser, from
 *     what the book says: green-skinned hunters of the purple buffalo, who raised him all together.
 *     No feather headdresses, no war paint, no “noble savage” talk, anywhere in art or script.
 *   - The Nothing is drawn as missing pieces of the picture, never as a monster; the music drops out
 *     near it. No jump scares.
 *   - No wishing mechanic. The player never holds AURYN and never makes a wish.
 *   - Hazel’s third rule is acted out at A25-5 (sit beside it until it gets up), never quoted.
 */
import type { Line, Mood, Scene } from '../config/story';
import type { Quest, Speaker } from './types';

// ------------------------------------------------------------------ helpers

const say =
  (who: string) =>
  (text: string, mood?: Mood): Line =>
    mood ? { who, text, mood } : { who, text };

/** A source character. */
const sp = (id: string, name: string, basedOn: string): Speaker => ({
  id,
  name,
  kind: 'other',
  basedOn,
});

const WHERE = 'Nova’s atlas: the Nothing page (Atlas campaign)';
const after = (code: string) => `Any time after ${code}, from Nova’s atlas.`;
const src = (beat: string) =>
  `Die unendliche Geschichte (The Neverending Story), Michael Ende, 1979: ${beat}`;
const BOOK = 'Die unendliche Geschichte (Michael Ende, 1979)';

// ------------------------------------------------------------------ speakers

const BASTIAN = sp(
  'a25-bastian',
  'Bastian',
  `Bastian Balthazar Bux, the boy who reads the book (${BOOK}); original design`,
);
const COREANDER = sp(
  'a25-coreander',
  'Mr Coreander',
  `Carl Conrad Coreander, the bookseller (${BOOK}); original design`,
);
const ATREYU = sp(
  'a25-atreyu',
  'Atreyu',
  `Atreyu of the Greenskins, the boy hunter (${BOOK}); original design, made with an adviser`,
);
const CAIRON = sp(
  'a25-cairon',
  'Cairon',
  `Cairon, the black centaur, the Empress’s physician (${BOOK}); original design`,
);
const EMPRESS = sp(
  'a25-empress',
  'The Empress',
  `the Childlike Empress of Fantastica (${BOOK}); original design`,
);
const ARTAX = sp('a25-artax', 'Artax', `Artax, Atreyu’s horse (${BOOK}); original design`);
const MORLA = sp(
  'a25-morla',
  'Morla',
  `Morla the Aged One, the turtle mountain (${BOOK}); original design`,
);
const YGRAMUL = sp(
  'a25-ygramul',
  'Ygramul',
  `Ygramul the Many, the swarm in the Dead Mountains (${BOOK}); original design`,
);
const FALKOR = sp(
  'a25-falkor',
  'Falkor',
  `Falkor, the white luckdragon (${BOOK}); original design`,
);
const ENGYWOOK = sp(
  'a25-engywook',
  'Engywook',
  `Engywook, the gnome who studies the Oracle’s gates (${BOOK}); original design`,
);
const URGL = sp('a25-urgl', 'Urgl', `Urgl, Engywook’s wife, the healer (${BOOK}); original design`);
const UYULALA = sp(
  'a25-uyulala',
  'Uyulala',
  `Uyulala, the Southern Oracle, a voice (${BOOK}); her rhymes are original`,
);
const GMORK = sp(
  'a25-gmork',
  'Gmork',
  `Gmork the werewolf, chained in Spook City (${BOOK}); original design`,
);
const OLDMAN = sp(
  'a25-oldman',
  'The Old Man',
  `the Old Man of Wandering Mountain, who writes the story (${BOOK}); original design`,
);
const GRAO = sp(
  'a25-grao',
  'Graógramán',
  `Graógramán, the Many-Coloured Death, lion of the desert Goab (${BOOK}); original design`,
);
const HYNRECK = sp(
  'a25-hynreck',
  'Hynreck',
  `Hynreck the hero, a knight of Amarganth (${BOOK}); original design`,
);
const XAYIDE = sp(
  'a25-xayide',
  'Xayide',
  `Xayide, the sorceress of Horok (${BOOK}); original design`,
);
const ARGAX = sp(
  'a25-argax',
  'Argax',
  `Argax, the monkey of the City of Old Emperors (${BOOK}); original design`,
);
const YSKAL = sp(
  'a25-yskal',
  'The Yskálnari',
  `the Yskálnari, who say only “we” (${BOOK}); original design`,
);
const AIUOLA = sp(
  'a25-aiuola',
  'Dame Aiuóla',
  `Dame Aiuóla of the House of Change (${BOOK}); original design`,
);
const YOR = sp('a25-yor', 'Yor', `Yor, the blind miner of Minroud (${BOOK}); original design`);
const WATER = sp(
  'a25-water',
  'The Water of Life',
  `the Water of Life, a voice (${BOOK}); its questions are original`,
);
const ROCK = sp(
  'a25-rockchewer',
  'Pyornkrachzark',
  `Pyornkrachzark, the rockchewer messenger (${BOOK}); original design`,
);
const BLUBB = sp(
  'a25-blubb',
  'Blubb',
  `Blubb, the will-o’-the-wisp messenger (${BOOK}); original design`,
);
const HOB = sp(
  'a25-nighthob',
  'Ückück',
  `Ückück, the night-hob messenger on a bat (${BOOK}); original design`,
);
const TINY = sp(
  'a25-tiny',
  'Gluckuk',
  `Gluckuk, the tiny messenger on a racing snail (${BOOK}); original design`,
);
const HUNTER = sp(
  'a25-hunter',
  'Greenskin Hunter',
  `a hunter of the Grassy Sea, one of Atreyu’s people (${BOOK}); designed with an adviser`,
);
const EMBER = 'ember';

const N = say('narrator');
const Y = say('you');
const BA = say('a25-bastian');
const CO = say('a25-coreander');
const AT = say('a25-atreyu');
const CA = say('a25-cairon');
const EM = say('a25-empress');
const AR = say('a25-artax');
const MO = say('a25-morla');
const YG = say('a25-ygramul');
const FA = say('a25-falkor');
const EN = say('a25-engywook');
const UR = say('a25-urgl');
const UY = say('a25-uyulala');
const GM = say('a25-gmork');
const OM = say('a25-oldman');
const GR = say('a25-grao');
const HY = say('a25-hynreck');
const XA = say('a25-xayide');
const AG = say('a25-argax');
const YS = say('a25-yskal');
const AI = say('a25-aiuola');
const YO = say('a25-yor');
const WA = say('a25-water');
const RC = say('a25-rockchewer');
const BL = say('a25-blubb');
const HO = say('a25-nighthob');
const TI = say('a25-tiny');
const HU = say('a25-hunter');
const E = say(EMBER);

// ------------------------------------------------------------------ lifted text (copyrighted; two lines, outline-approved)

/** AURYN’s inscription, in Ende’s German (Thienemann, 1979), with our own English after it. Once only. */
const LIFT_AURYN =
  'Round the back, where the snakes’ tails meet, four words are cut into the gold: « TU WAS DU WILLST ».';
/** The novel’s refrain, in Ende’s German (Thienemann, 1979). Our English follows on its own line. */
const LIFT_REFRAIN =
  '« Aber das ist eine andere Geschichte und soll ein andermal erzählt werden. »';
const OUR_REFRAIN = 'But that is another story, and shall be told another time.';

// ------------------------------------------------------------------ shared pieces

/** A25-13: the Empress’s opening, before the name beat that changes with s6Done. */
const Q13_OPEN: Line[] = [
  N(
    'The Ivory Tower is a white spiral, and at its top a magnolia flower stands open. Inside, on cushions, sits a girl who looks about ten.',
  ),
  N('She is very pale and very calm, and she is older than anything in Fantastica.'),
  AT(
    'I failed. I went everywhere. Nobody can give you a name who lives here, and nobody from outside has come.',
    'sad',
  ),
  EM(
    'You didn’t fail. You brought him. Everything you did, someone was listening to. He is listening now.',
    'soft',
  ),
  N(
    'Atreyu stares at her. Behind your eyes, very faintly, you can see a red-ink attic, and a boy who has gone quite still.',
  ),
];
/** A25-13: what the Empress says to you, after the name beat. */
const Q13_CLOSE: Line[] = [
  EM(
    'You came in through a book, traveller. So did everyone here, in a way. That’s why it can’t be you.',
  ),
  EM(
    'It has to be him. It has to be a child from out there who opened this book and kept reading.',
  ),
  Y('He’s frightened.'),
  EM('I know. I can wait. I am very good at waiting.', 'soft'),
];

/** A25-15: the mirror choice (the signature choice of the page). */
const Q15_MIRROR = [
  {
    id: 'truth',
    label: '“No. You were round and plain and reading in an attic, and I liked you then.”',
    set: { 'a25-mirror': 'truth' },
    then: [
      BA('Round? Me?', 'shock'),
      N(
        'He laughs, because it seems so unlikely. Then he looks at you sideways, as if you might be teasing.',
      ),
      BA('You liked him? The round one?'),
      Y('Very much.'),
      BA('Huh. Well. He sounds all right, I suppose.', 'think'),
    ],
  },
  {
    id: 'yourself',
    label: '“You look like yourself.”',
    set: { 'a25-mirror': 'yourself' },
    then: [
      BA('Exactly. That’s what I thought.', 'happy'),
      N(
        'He swings the sword about once more, very pleased. It is true, and it isn’t, and you both know which half he heard.',
      ),
    ],
  },
  {
    id: 'notebook',
    label: 'Say nothing now. Write down what you saw, and keep it for him.',
    set: { 'a25-mirror': 'notebook' },
    then: [
      N('You smile and say nothing. Later, by the lion’s cooling fire, you open your notebook.'),
      N(
        'You write: “A round boy in an old grey blanket, knock-kneed, reading by candlelight in a school attic. He cried for Artax.”',
      ),
      N('You tear the page out carefully, fold it twice, and put it in your inside pocket.'),
    ],
  },
];

/** A25-20: the Water’s first question, shared by the base and Ash versions. */
const Q20_WATER_OPEN: Line[] = [
  WA('Who comes? Say your name, and you may drink.'),
  N(
    'The boy opens his mouth, and nothing comes. He has looked everywhere inside himself, and there is no name there.',
  ),
  WA('And the stories you began. Did you finish them?'),
  N(
    'He can’t answer that either. He began so many, with every wish, and left them all half-told, all over Fantastica.',
  ),
];

/** A25-20: the way home, the first lines of every ending. */
const Q20_HOME: Line[] = [
  N(
    'The water goes on singing for a while after you are out of it. Then it is rain, ordinary rain, on a shop window.',
  ),
  N(
    'You are behind the little bell again, unseen. Your Nubbin is damp and very pleased with itself.',
  ),
];
/** A25-20: Coreander’s close, shared by every ending. */
const Q20_COREANDER: Line[] = [
  CO('I never owned such a book. Somebody must have brought it in. Or it brought itself.', 'think'),
  CO(
    'Keep going there, Bastian. And keep coming back. That’s the trick of it, and nobody does both.',
  ),
];

// =================================================================== THE NOTHING

export const ATLAS_A25: Quest[] = [
  // ---------------------------------------------------------------- A25-1
  {
    id: 'a25-01',
    code: 'A25-1',
    title: 'The Bookshop',
    source: src('ch. I, the antiquarian bookshop'),
    audience: 'all',
    trigger: {
      where: WHERE,
      when: 'Any time once Nova’s atlas is in the Grove; the first quest on the page.',
    },
    speakers: [BASTIAN, COREANDER],
    steps: [
      {
        id: 'a25-01-s1',
        goal: 'Step through the page, behind the shop bell.',
        hint: 'Touch the little bell on the page. Stay behind it; nobody in the shop can see you there.',
        check: 'explore:a25-shop:bell',
        scene: {
          id: 'a25-01-shop',
          lines: [
            N(
              'Nova’s atlas falls open at a page that is mostly a glass door. There is a little bell above it, and painted letters on the glass.',
            ),
            N(
              'It’s raining on the page. Real rain: it runs down the glass and off the edge on to your table.',
            ),
            N(
              'You touch the bell. It rings, and you are standing behind it, inside a dim shop that smells of dust and pipe smoke.',
            ),
            N(
              'Books go up to the ceiling. Between the towers, in a deep armchair, an old man in a black suit is reading.',
            ),
            N(
              'Nobody looks round at you. Your Nubbin waves at the old man, experimentally, and he turns a page.',
            ),
            N(
              'The door bangs open. A boy tumbles in, out of breath, soaked through, with a school bag on his back.',
            ),
            N(
              'He is about ten, round, and knock-kneed, with wet hair in his eyes. He shuts the door and leans on it.',
            ),
            CO(
              'Out. I don’t sell to children. Children sneeze on books and ask if they’ve got pictures.',
              'angry',
            ),
            BA('I’m not buying. There are boys outside. Just till they go past. Please.'),
            CO('Hm. What’s your name?'),
            BA('Bastian Balthazar Bux.', 'sad'),
            CO('That’s a name with too many b’s in it. Sit down, then. Don’t touch anything.'),
          ],
          choices: [
            {
              id: 'still',
              label: 'Keep very still behind the bell.',
              then: [
                N(
                  'You keep still. The bell, which is right by your ear, decides to keep still too.',
                ),
              ],
            },
            {
              id: 'notebook',
              label: 'Take out your notebook and write down the shop’s name.',
              then: [
                N(
                  'You write it down, letters from the glass backwards and then the right way round. Your pencil sounds very loud.',
                ),
              ],
            },
            {
              id: 'nubbin',
              label: 'Let your Nubbin sniff the nearest pile of books.',
              then: [
                N(
                  'Your Nubbin sniffs the nearest pile. It sneezes on a book, which proves the old man right about something.',
                ),
              ],
            },
          ],
        },
        done: {
          id: 'a25-01-shop-done',
          lines: [
            N(
              'A telephone rings in the back room. The old man gets up, grumbling, and leaves his book on the armchair.',
            ),
            N(
              'It is bound in copper-coloured silk. On the cover, two snakes, one light and one dark, are biting each other’s tails.',
            ),
          ],
        },
      },
      {
        id: 'a25-01-s2',
        goal: 'Follow the boy through the rain to his school.',
        hint: 'Keep him in sight. He’s slow on his feet, but he knows the short cuts.',
        check: 'walk:a25-street:school',
        scene: {
          id: 'a25-01-run',
          lines: [
            N(
              'Bastian looks at the book. He looks at the back room, where the old man is shouting into the telephone about an invoice.',
            ),
            N(
              'Then he picks the book up, puts it under his coat, and runs. He leaves the door open and the bell still ringing.',
            ),
            N(
              'You go after him. Your Nubbin goes after you, very fast and quite flat, the way it runs in thunderstorms.',
            ),
            BA(
              'I’m a thief now. I’m a thief. I’ve never stolen anything in my life, and now I have.',
              'sad',
            ),
            N(
              'He can’t go home, he tells a lamp-post. His father won’t shout; his father hardly says anything at all, any more.',
            ),
            N(
              'He is late for school, and he has a maths test, and he stops at the school gate with his hand on it.',
            ),
            BA('Can’t go in there either.'),
            N(
              'He goes in by the back door instead, and up the back stairs, past the caretaker’s cupboard, all the way to the top.',
            ),
          ],
        },
        done: {
          id: 'a25-01-run-done',
          lines: [
            N(
              'At the top of the stairs there is a door nobody uses. It isn’t locked, because it has never needed to be.',
            ),
          ],
        },
      },
      {
        id: 'a25-01-s3',
        goal: 'Sit in the attic with Bastian while he opens the book.',
        hint: 'Find a corner on the old gym mats. Don’t make a sound; he thinks he’s alone.',
        check: 'sit:a25-attic:mats',
        scene: {
          id: 'a25-01-attic',
          lines: [
            N(
              'The school attic is long and low, full of broken desks, rolled-up maps and a pile of old gym mats.',
            ),
            N(
              'Rain drums on the roof slates. It is grey up here, and it smells of dust and chalk.',
            ),
            N(
              'Bastian finds a heap of grey army blankets, wraps himself in two, and sits on the mats like a parcel.',
            ),
            N(
              'He takes out his sandwich and his apple, looks at them, and puts them back. He might be up here a long time.',
            ),
            BA('Just the first page. Then I’ll take it back. Probably.'),
            N(
              'He opens the book. You look over his shoulder, unseen, and see that it is printed in two colours of ink.',
            ),
            N(
              'Your Nubbin climbs into the blanket heap and settles against his side, because it’s warm there.',
            ),
            N('Bastian doesn’t notice. He has already started reading.'),
          ],
          choices: [
            {
              id: 'beside',
              label: 'Sit beside him on the mats.',
              then: [
                N(
                  'You sit down beside him. He shifts over without looking up, as people do for someone they can’t see.',
                ),
              ],
            },
            {
              id: 'window',
              label: 'Sit by the skylight and read your own copy.',
              then: [
                N(
                  'Your atlas page, when you look at it, is showing exactly the same words. You read along.',
                ),
              ],
            },
          ],
        },
      },
    ],
    complete: {
      id: 'a25-01-complete',
      lines: [
        N(
          'The attic is drawn in rust-red ink. As Bastian reads, the edges of the page begin to go green.',
        ),
        N(
          'A forest grows in from the corners, and the rain on the roof turns into wind in leaves.',
        ),
        N(
          'You are not in the attic any more. You are on a forest path at night, beside a campfire, and someone is singing badly.',
        ),
        N('Very faintly, if you listen, you can still hear a boy turning a page.'),
      ],
    },
    rewards: [],
    sets: { 'a25-01': true },
    notes:
      'OPENING: the page shows a glass door with a bell and the shop name painted backwards on the glass (our own lettering, ' +
      'not the film’s or the book’s cover). The book on the armchair is drawn with the original two-snake emblem (see header). ' +
      'TWO INKS: from here on every scene in Bastian’s world (the shop, the attic) is tinted rust-red and every scene in ' +
      'Fantastica is tinted green; the dialogue box borders follow (red for attic lines, green for Fantastica). The page ' +
      'never names the colours; the Attic Nook lamp (A25-20) does. Bastian is drawn round and knock-kneed, with affection: ' +
      'never a joke, no comic sound on his running. Coreander is gruff and kind underneath; nothing in his first scene is ' +
      'cruel. No one in the shop or attic can see or hear you; your Nubbin’s sneeze is heard by nobody.',
  },

  // ---------------------------------------------------------------- A25-2
  {
    id: 'a25-02',
    code: 'A25-2',
    title: 'The Messengers',
    source: src('ch. I, the Howling Forest and the four messengers'),
    audience: 'all',
    trigger: { where: WHERE, when: after('A25-1') },
    requires: ['A25-1'],
    speakers: [ROCK, BLUBB, HOB, TINY, BASTIAN],
    steps: [
      {
        id: 'a25-02-s1',
        goal: 'Join the messengers at the campfire in the forest.',
        hint: 'Follow the bad singing. It’s coming from the clearing with the fire.',
        check: 'visit:a25-forest:campfire',
        scene: {
          id: 'a25-02-fire',
          lines: [
            N(
              'In the clearing sits a will-o’-the-wisp, a little ball of light, singing to keep its courage up. It isn’t working.',
            ),
            N(
              'A rockchewer comes crunching out of the trees. He is the size of a hill and is eating a small piece of it.',
            ),
            N(
              'Then a night-hob riding a bat, and a tiny no bigger than your thumb, on a racing snail that has run all the way.',
            ),
            BL('Strangers! Friendly ones? Say friendly. I’m Blubb. I’m very nervous.', 'shock'),
            RC('Pyornkrachzark. Sit. Pebble?', 'happy'),
            HO(
              'Ückück. We are all going the same way, it seems. To the Ivory Tower, with bad news.',
            ),
            TI(
              'Gluckuk. My snail is the fastest in the whole of my country. Please don’t step on him.',
            ),
            N(
              'Your Nubbin sits down next to the snail, very carefully, and they look at each other for a long time.',
            ),
          ],
          choices: [
            {
              id: 'pebble',
              label: 'Accept the pebble, politely.',
              then: [
                N(
                  'You hold it as if you might eat it later, and Pyornkrachzark nods, satisfied. Good manners matter, whatever size you are.',
                ),
              ],
            },
            {
              id: 'news',
              label: 'Ask what the bad news is.',
              then: [HO('The same as everyone’s, I expect. That’s what frightens me.', 'sad')],
            },
          ],
        },
        done: {
          id: 'a25-02-fire-done',
          lines: [
            N(
              'They have each come from a different corner of Fantastica, to the same fire, carrying the same news.',
            ),
          ],
        },
      },
      {
        id: 'a25-02-s2',
        goal: 'Hear what the messengers have seen, and go with them to look.',
        hint: 'Walk with Ückück to the edge of the wood. You don’t have to go close.',
        check: 'walk:a25-forest:edge',
        scene: {
          id: 'a25-02-gap',
          lines: [
            BL(
              'In my marsh, a piece of the bank went. Not burnt. Not flooded. Just not there any more.',
            ),
            RC('Mountain too. Bit missing. Didn’t eat it. Honest.', 'sad'),
            TI(
              'A lake at home. One day it had a hole in the middle where nothing was. Not water. Not dry. Nothing.',
            ),
            HO('Come. It’s here too, now. I saw it from the air.'),
            N(
              'At the edge of the wood the trees just stop. Not a cliff, and not a clearing: the picture simply isn’t there.',
            ),
            N(
              'When you look at the gap, it feels like your eyes have gone blind on that side. The singing birds go quiet as you come near.',
            ),
            N(
              'Your Nubbin will not go a step closer. It sits down hard in the leaves and takes hold of your boot.',
            ),
            HO('It’s growing. Every land is reporting it. The Empress must know what it is.'),
          ],
          choices: [
            {
              id: 'back',
              label: 'Step back with your Nubbin.',
              then: [
                N(
                  'You step back. The birds start again, a little way off, as if nothing happened.',
                ),
              ],
            },
            {
              id: 'look',
              label: 'Look away from the gap, deliberately.',
              then: [
                N(
                  'You make yourself look at a real leaf instead, with a hole a caterpillar made. It helps.',
                ),
              ],
            },
          ],
        },
        done: {
          id: 'a25-02-gap-done',
          lines: [
            N(
              'In the end Blubb gives it a name, in a very small voice: “the Nothing”. Everyone wishes he hadn’t.',
            ),
          ],
        },
      },
    ],
    complete: {
      id: 'a25-02-complete',
      lines: [
        N(
          'The four messengers set off together at dawn, at the speed of the snail, which turns out to be very fast indeed.',
        ),
        N(
          'For a moment the green fades, and you see the attic in red. Bastian has pulled the blanket round his ears.',
        ),
        BA('I’d have gone with them. I think I would. If I could.', 'think'),
        N('He opens his satchel, breaks off a corner of his sandwich, and goes on reading.'),
      ],
    },
    rewards: [],
    sets: { 'a25-02': true },
    notes:
      'CARE (the Nothing): the gap is drawn as missing pieces of the picture, a soft-edged blank in the trees, never a ' +
      'mouth, eyes or a creature. As the player walks toward it the music drops out instrument by instrument, and comes ' +
      'back when they step away. No jump scare, no sting of sound. The step never forces the player close: the check ' +
      'fires at the wood’s edge. The four messengers are drawn as described in our own designs; Gluckuk’s snail is a real ' +
      'pet-sized companion sprite for this quest.',
  },

  // ---------------------------------------------------------------- A25-3
  {
    id: 'a25-03',
    code: 'A25-3',
    title: 'The Ivory Tower',
    source: src('ch. II, the Ivory Tower and Cairon the physician'),
    audience: 'all',
    trigger: { where: WHERE, when: after('A25-2') },
    requires: ['A25-2'],
    speakers: [CAIRON, HOB],
    steps: [
      {
        id: 'a25-03-s1',
        goal: 'Go with the messengers into the Ivory Tower.',
        hint: 'Climb the white spiral road through the gardens to the hall of physicians.',
        check: 'climb:a25-tower:hall',
        scene: {
          id: 'a25-03-tower',
          lines: [
            N(
              'The Ivory Tower stands in a labyrinth of flowers, white and very tall, like a spiral shell standing on its end.',
            ),
            N(
              'The halls are full of messengers from everywhere. Every one of them is carrying the same news, and every one thinks theirs is new.',
            ),
            HO('So many. I thought I was important.', 'sad'),
            N(
              'In a high room the Empress’s physicians are arguing. In the middle stands a black centaur with a white beard.',
            ),
            CA(
              'Enough. Enough! You can all stop shouting. None of you knows what’s wrong with her, and neither do I.',
              'angry',
            ),
            CA(
              'She is ill. She is ill in the same way the land is ill. It’s one illness. When it reaches her, there is no more Fantastica.',
            ),
            N(
              'The room goes silent. Your Nubbin hides behind a pillar, which is the most sensible thing anyone has done all day.',
            ),
          ],
        },
        done: {
          id: 'a25-03-tower-done',
          lines: [
            N(
              'Cairon stamps a hoof, and then looks very old, and sits down on the floor like a tired horse.',
            ),
          ],
        },
      },
      {
        id: 'a25-03-s2',
        goal: 'Help Cairon find the road to the Grassy Sea.',
        hint: 'Unroll the maps in the physicians’ library and find the long road east.',
        check: 'puzzle:a25-maps:grassy-sea',
        scene: {
          id: 'a25-03-maps',
          lines: [
            CA(
              'She has chosen a hero to find the cure. She has given me the Glory to carry to him.',
            ),
            N(
              'Round his neck hangs an amulet: two snakes, one light, one dark, each biting the other’s tail.',
            ),
            CA(
              'AURYN. Whoever wears it acts for her. The hero is in the Grassy Sea. Atreyu, she said. A great hunter, no doubt.',
            ),
            CA(
              'I don’t know the way. I am a physician. I know the way to the kitchen, and to people’s insides.',
            ),
            N(
              'The maps are huge and out of date. Half of them have gaps now where the Nothing has been.',
            ),
            CA('You, traveller, with the sharp eyes. Help an old horse.'),
          ],
          choices: [
            {
              id: 'river',
              label: 'Follow the river on the map.',
              then: [
                N(
                  'The river goes east for a thousand miles and ends in grass. Cairon puts his finger on it and grunts, pleased.',
                ),
              ],
            },
            {
              id: 'ask',
              label: 'Ask Ückück, who has seen it from the air.',
              then: [
                HO(
                  'East. Keep going east until there’s nothing but grass, and then go on. You can’t miss it. Really.',
                ),
              ],
            },
          ],
        },
        done: {
          id: 'a25-03-maps-done',
          lines: [
            CA(
              'Good. Then I gallop. You’re coming? I could use the company. I talk to myself on long roads, and I’m dull.',
            ),
            N(
              'Your Nubbin climbs onto his back without asking. Cairon pretends not to notice, which is kind of him.',
            ),
          ],
        },
      },
    ],
    complete: {
      id: 'a25-03-complete',
      lines: [
        N(
          'The road east goes on for days. Cairon gallops until his legs shake, and then walks, and then gallops again.',
        ),
        CA(
          'A great warrior. Strong. Wise. Grey at the temples, I should think. I shall know him at once.',
        ),
        N(
          'In the red attic, Bastian has found an old candle and put it in his pocket for later. It’s getting dark up there.',
        ),
      ],
    },
    rewards: [],
    sets: { 'a25-03': true },
    notes:
      'AURYN is drawn with the original two-snake emblem unless licensed. The physicians are a mix of Fantastican peoples ' +
      'in our own designs. Cairon’s line about the hero sets up A25-4’s surprise. The maps puzzle is a gentle find-the-' +
      'river drag; both choices succeed.',
  },

  // ---------------------------------------------------------------- A25-4
  {
    id: 'a25-04',
    code: 'A25-4',
    title: 'Atreyu',
    source: src('ch. II, the Grassy Sea and Atreyu'),
    audience: 'all',
    trigger: { where: WHERE, when: after('A25-3') },
    requires: ['A25-3'],
    speakers: [CAIRON, ATREYU, HUNTER, ARTAX],
    steps: [
      {
        id: 'a25-04-s1',
        goal: 'Bring Cairon to the hunters’ camp in the Grassy Sea.',
        hint: 'Walk ahead of him through the tall grass. The tents are by the stream.',
        check: 'escort:a25-cairon:camp',
        scene: {
          id: 'a25-04-camp',
          lines: [
            N(
              'The Grassy Sea is grass as far as you can see, moving in long waves like water. It is purple in places, where the buffalo graze.',
            ),
            N(
              'The hunters’ camp is a ring of hide tents by a stream. The people are green-skinned, quiet, and very good at seeing you coming.',
            ),
            HU('A centaur, a stranger and a… whatever that is. You’re a long way from anywhere.'),
            CA('I bring a message for Atreyu. From the Empress. Take me to him.'),
            HU(
              'Atreyu? Him? He’s out with the herd. He’s supposed to be learning to be a hunter tomorrow.',
              'think',
            ),
            N(
              'Cairon’s eyebrows go up. He doesn’t say anything, but his tail swishes once, impatiently.',
            ),
          ],
        },
        done: {
          id: 'a25-04-camp-done',
          lines: [
            N(
              'Someone runs to fetch him. Cairon combs his beard with his fingers, to look his best for a hero.',
            ),
          ],
        },
      },
      {
        id: 'a25-04-s2',
        goal: 'Watch Atreyu take the amulet.',
        hint: 'Stand at the edge of the ring and let Cairon speak. It’s not your message.',
        check: 'watch:a25-atreyu:amulet',
        scene: {
          id: 'a25-04-amulet',
          lines: [
            N(
              'A boy comes through the grass. He is about ten years old, with green skin and dark hair, in a purple-red cloak.',
            ),
            AT('You asked for me?'),
            CA('No. I asked for Atreyu. The hunter.'),
            AT('That’s me. I’m not a hunter yet. I was going to be, tomorrow.'),
            N(
              'Cairon looks at him for a long time. Then he laughs, a short tired laugh, and takes the amulet off his own neck.',
            ),
            CA(
              'She chose you. She never chooses wrongly, so I must have been wrong about heroes. It wouldn’t be the first time.',
              'soft',
            ),
            CA(
              'Go without weapons. Find out what’s wrong with her, and find the cure. Don’t ask me how. Nobody knows.',
            ),
            N(
              'Atreyu puts on AURYN. He lays his bow down in the grass, very carefully, and doesn’t look at it again.',
            ),
            AT(
              'My name means Son of All. My mother and father died when I was small, so everybody brought me up. Everyone here is mine.',
            ),
            AT('So I’m going for everyone.'),
          ],
          choices: [
            {
              id: 'bow',
              label: 'Pick up the bow and give it to a hunter to keep.',
              then: [
                HU('I’ll keep it for him. He’ll want it when he’s back.', 'soft'),
                N('She says when, not if. Everyone hears it.'),
              ],
            },
            {
              id: 'quiet',
              label: 'Say nothing. It’s his moment.',
              then: [
                N(
                  'You say nothing. The grass says it for you, a long sigh across the whole of the plain.',
                ),
              ],
            },
          ],
        },
      },
      {
        id: 'a25-04-s3',
        goal: 'Get your Nubbin down off Artax’s saddle. Or don’t.',
        hint: 'Talk to Artax. He has opinions.',
        check: 'talk:a25-artax:saddle',
        scene: {
          id: 'a25-04-saddle',
          lines: [
            N(
              'Atreyu whistles, and a small horse comes trotting out of the grass: brown, shaggy, sure-footed.',
            ),
            N(
              'By the time he arrives, your Nubbin is sitting on his saddle. Nobody saw it climb up.',
            ),
            AR('There is a thing on my back. It is soft and it has made itself comfortable.'),
            AT('Artax, this is… I don’t know what it is.'),
            AR('Neither do I. It won’t get off. I have asked it twice.', 'think'),
            AT('Will you come too, then? It looks like you’re coming anyway.'),
          ],
          choices: [
            {
              id: 'yes',
              label: '“Yes. If you’ll have us.”',
              then: [AT('I’ll have anyone. I don’t know where I’m going.', 'happy')],
            },
            {
              id: 'sorry',
              label: 'Apologise to Artax for your Nubbin.',
              then: [
                AR(
                  'It’s light. And it’s warm. There are worse things to carry across the world.',
                  'soft',
                ),
              ],
            },
          ],
        },
      },
    ],
    complete: {
      id: 'a25-04-complete',
      lines: [
        N(
          'You set out at sunset: a boy, a horse, a traveller, and a Nubbin riding where the boy should be.',
        ),
        N('Atreyu walks beside Artax for the first mile, so as not to disturb it.'),
        N(
          'Up in the attic, Bastian is grinning to himself in the half-dark. He likes Atreyu already, and he’d like to be like him.',
        ),
      ],
    },
    rewards: [],
    sets: { 'a25-04': true },
    notes:
      'CARE (Atreyu’s people): design the Greenskins fresh, with an adviser, from what the book says: a hunting people of ' +
      'the Grassy Sea, green-skinned, living in hide tents, hunting the purple buffalo, and raising Atreyu all together. ' +
      'No feather headdresses, war paint, totem poles, broken English or “noble savage” talk in art or script. Their ' +
      'clothes and tents are our own invention; the hunter who speaks is a woman of middle age, matter-of-fact. Artax ' +
      'talks (canon 31): a calm, dry, practical voice. Your Nubbin rides Artax’s saddle from here to A25-5.',
  },

  // ---------------------------------------------------------------- A25-5
  {
    id: 'a25-05',
    code: 'A25-5',
    title: 'The Swamps of Sadness',
    source: src('ch. III, the Swamps of Sadness and Artax'),
    audience: 'all',
    trigger: { where: WHERE, when: after('A25-4') },
    requires: ['A25-4'],
    speakers: [ATREYU, ARTAX],
    steps: [
      {
        id: 'a25-05-s1',
        goal: 'Cross the Swamps of Sadness with Atreyu and Artax.',
        hint: 'Keep walking. When you feel like stopping, walk anyway.',
        check: 'walk:a25-swamp:crossing',
        scene: {
          id: 'a25-05-swamp',
          lines: [
            N(
              'The swamp is grey and still. Dead trees stand in it, and the air is cold and smells of nothing much.',
            ),
            N(
              'Sadness comes up out of the mud like damp. It gets into your boots first, and then into everything.',
            ),
            AT('Don’t listen to it. It’s only the swamp. It isn’t you.'),
            N(
              'AURYN glints on his chest. Atreyu feels the sadness too, you can see it, but it can’t quite get hold of him.',
            ),
            N('Artax is slowing down. Each step is a bit shorter than the last one.'),
            AR('Master. I can’t go on.', 'sad'),
            AT('You can. You have to. Look, there’s higher ground just there.'),
            AR(
              'I know. It doesn’t matter. Nothing matters. I’m sorry. Take the little one off my back.',
              'sad',
            ),
          ],
          choices: [
            {
              id: 'head',
              label: 'Walk by Artax’s head and talk to him.',
              then: [
                N(
                  'You talk to him about nothing: grass, and stables, and apples. His ears move once, to listen.',
                ),
              ],
            },
            {
              id: 'hold',
              label: 'Hold your Nubbin tight on the saddle.',
              then: [N('You keep a hand on your Nubbin. It is very cold, and it doesn’t purr.')],
            },
          ],
        },
        done: {
          id: 'a25-05-swamp-done',
          lines: [
            N(
              'You lift your Nubbin down. It is heavy and limp in your hands, as if the sadness has got into it as well.',
            ),
          ],
        },
      },
      {
        id: 'a25-05-s2',
        goal: 'Stay with Atreyu while Artax stops.',
        hint: 'Don’t look away. You don’t have to do anything.',
        check: 'wait:a25-swamp:artax',
        scene: {
          id: 'a25-05-artax',
          lines: [
            N(
              'Artax stands still. The mud comes up over his hooves, very slowly, and he doesn’t pull against it.',
            ),
            N(
              'Atreyu puts both arms round his neck and holds his head, and talks to him quietly. You can’t hear what he says.',
            ),
            AR('Go on without me. Don’t stay. If you stay, it’ll get you too.', 'soft'),
            AT('I won’t forget you. Not one bit of you. Not ever.', 'sad'),
            N(
              'The swamp closes, gently, like water closing over a dropped stone. And then there is only Atreyu, standing alone.',
            ),
            N(
              'He stands for a long time. When he walks on, he doesn’t look back, because Artax asked him not to.',
            ),
          ],
        },
        done: {
          id: 'a25-05-artax-done',
          lines: [
            N(
              'In the red attic, Bastian is crying, and he doesn’t mind about it. Nobody can see him, and it was Artax.',
            ),
          ],
        },
      },
      {
        id: 'a25-05-s3',
        goal: 'Sit beside your Nubbin in the reeds until it gets up.',
        hint: 'Sit down next to it and wait. There’s no hurry, and nothing to press.',
        check: 'sit:a25-reeds:nubbin',
        scene: {
          id: 'a25-05-reeds',
          lines: [
            N(
              'A little way on, your Nubbin lies down in the reeds and won’t get up. Its eyes are open, but it isn’t looking at anything.',
            ),
            AT('The swamp. It got into it. It’s so small.'),
            N(
              'You don’t pick it up and you don’t pull. You sit down in the reeds next to it, close enough that it knows.',
            ),
            N('Atreyu sits down too, on its other side, though he has every reason not to.'),
            N(
              'The reeds rustle. A long time goes by, or a short one; in the swamp it’s hard to tell.',
            ),
            N('Then your Nubbin sits up, and leans against your arm, and then gets up on its own.'),
          ],
        },
      },
    ],
    complete: {
      id: 'a25-05-complete',
      lines: [
        AT('Thank you. For waiting. I didn’t know you could just… wait like that.', 'soft'),
        N(
          'You walk on, the two of you, and your Nubbin between you. At the edge of the swamp there is a mountain.',
        ),
        N('It is a strange mountain, smooth and round, with moss on its top. It sneezes.'),
      ],
    },
    rewards: [],
    sets: { 'a25-05': true },
    notes:
      'PARENT NOTE (optional; show once, before this quest starts, if the player profile is under 10): "In the next ' +
      'part of the story, the boy’s horse can’t go any further, and the boy has to go on without him. It is short and ' +
      'gentle, but it is sad. You may like to play it together." [Continue] [Play it together later]. ' +
      'CARE (Artax): this is the only scene of it, and it is never repeated, recapped or referred to in detail later. ' +
      'He stops; the swamp closes. No struggle, no sinking animation beyond a slow fade of the horse into the grey water, ' +
      'no sound but the reeds. The camera stays on Atreyu’s back, not on the horse’s face. The music is a single held note ' +
      'that ends. a25-05-reeds is Hazel’s third rule acted out (never quoted): the check only needs the player to sit; ' +
      'the Nubbin gets up on its own after about eight seconds (shorter with reduced motion). Your Nubbin walks from here.',
  },

  // ---------------------------------------------------------------- A25-6
  {
    id: 'a25-06',
    code: 'A25-6',
    title: 'Morla the Aged One',
    source: src('ch. III, Morla on the Tortoise Shell Mountain'),
    audience: 'all',
    trigger: { where: WHERE, when: after('A25-5') },
    requires: ['A25-5'],
    speakers: [ATREYU, MORLA],
    steps: [
      {
        id: 'a25-06-s1',
        goal: 'Climb the strange round mountain at the swamp’s edge.',
        hint: 'Climb up the mossy side. Mind the cave at the front; it breathes.',
        check: 'climb:a25-morla:shell',
        scene: {
          id: 'a25-06-shell',
          lines: [
            N(
              'The mountain is warm under your hands. Its slopes are covered in plates, like roof tiles, with moss between.',
            ),
            N(
              'Atreyu climbs up beside you. Halfway, the whole mountain sneezes, and you both hang on.',
            ),
            AT('It’s alive. The mountain’s alive.'),
            N(
              'At the front, a huge old head comes slowly out of a cave in the rock. Its eyes are wet and black and very tired.',
            ),
            MO('Somebody’s there, old one. Somebody small. We heard them.'),
            MO('We don’t care, though. Do we. We don’t care about anything any more.'),
          ],
        },
        done: {
          id: 'a25-06-shell-done',
          lines: [
            N(
              'She talks to herself as “we”, and answers herself as well. She has had nobody else to talk to for a very long time.',
            ),
          ],
        },
      },
      {
        id: 'a25-06-s2',
        goal: 'Ask Morla about the Empress’s illness.',
        hint: 'Choose how to ask. She will answer, eventually, if only to be left alone.',
        check: 'talk:a25-morla:oracle',
        scene: {
          id: 'a25-06-ask',
          lines: [
            AT('Morla the Aged One. The Empress is ill. Do you know what the cure is?'),
            MO(
              'The Empress. Ill. We knew her when she was young. She was young then too. She’s always young.',
            ),
            MO(
              'Old one, shall we tell him? What for? Everything ends. We’ve been old so long we can’t remember not.',
            ),
            N(
              'She sneezes. A wind goes across the swamp, and your Nubbin falls over and gets up again, offended.',
            ),
            MO(
              'We’re all there is of us. Being old is the whole of us. You wouldn’t understand. You’re a boy.',
            ),
            AT('Then help me anyway. You don’t have to care. Just tell me.'),
          ],
          choices: [
            {
              id: 'sit',
              label: 'Sit by her head and say nothing for a while.',
              then: [MO('Hm. Quiet ones. We like quiet ones. They don’t ask things.', 'soft')],
            },
            {
              id: 'old',
              label: 'Ask her what it’s like, being so old.',
              then: [
                MO(
                  'Long. Long, old one, isn’t it. Like waiting for a sneeze that doesn’t come.',
                  'think',
                ),
              ],
            },
            {
              id: 'blessing',
              label: 'Say “Bless you” when she sneezes again.',
              then: [
                MO(
                  'Bless us? Nobody’s said that in ten thousand years. Ha. Old one, it said bless us.',
                  'happy',
                ),
              ],
            },
          ],
        },
        done: {
          id: 'a25-06-ask-done',
          lines: [
            MO('The Southern Oracle. Uyulala. She might know. We don’t. We don’t mind.'),
            MO(
              'Ten thousand miles away, south. You’d be old as us before you got there. Go and find that out yourself.',
            ),
          ],
        },
      },
    ],
    complete: {
      id: 'a25-06-complete',
      lines: [
        N(
          'Morla draws her head back into her cave. She is already asleep, or near enough not to matter.',
        ),
        AT('Ten thousand miles. I couldn’t walk that if I walked my whole life.', 'sad'),
        AT('So I’ll start walking. That’s all I can do, isn’t it.'),
        N('He doesn’t say it like a hero. He says it like somebody tying his boots.'),
      ],
    },
    rewards: [],
    sets: { 'a25-06': true },
    notes:
      'Morla is a giant turtle whose shell is the mountain; drawn old, mossy and sleepy, never scary. Her sneezes are a ' +
      'gentle screen-shake (none with reduced motion). Her “we” and “old one” speech is our own wording. All three choices ' +
      'lead to the same answer.',
  },

  // ---------------------------------------------------------------- A25-7
  {
    id: 'a25-07',
    code: 'A25-7',
    title: 'Ygramul the Many',
    source: src('ch. IV, Ygramul and the luckdragon in the Dead Mountains'),
    audience: 'all',
    trigger: { where: WHERE, when: after('A25-6') },
    requires: ['A25-6'],
    speakers: [ATREYU, YGRAMUL, FALKOR],
    steps: [
      {
        id: 'a25-07-s1',
        goal: 'Cross the Dead Mountains to the great chasm.',
        hint: 'Keep to the stony path. The chasm is where the wind goes quiet.',
        check: 'explore:a25-mountains:chasm',
        scene: {
          id: 'a25-07-chasm',
          lines: [
            N(
              'Weeks pass in a few turns of the page. The Dead Mountains are black rock and no birds, and the wind tastes of iron.',
            ),
            N(
              'At the bottom of a deep chasm, stretched from side to side, there is a web. Its threads are as thick as ropes.',
            ),
            N(
              'Caught in the middle is a long white creature with pearly scales, a lion’s mane and the kindest face you have ever seen.',
            ),
            FA(
              'Hello up there! Don’t come any closer, whatever you do. I’m quite stuck. It’s very bad luck. Luckily I’m a luckdragon.',
              'happy',
            ),
            N(
              'Across the web, something stirs. It is not one creature but a cloud of steel-blue insects, moving together.',
            ),
            N(
              'They make a shape: a great face, then a hand, then a face again. Thousands of voices speak at once.',
            ),
            YG('We are Ygramul. We are many. What is it that crawls on our edge?'),
          ],
        },
        done: {
          id: 'a25-07-chasm-done',
          lines: [
            N('In the red attic, Bastian gives a small, frightened cry out loud.'),
            N(
              'Ygramul stops, all the thousands of it at once. Atreyu looks up, as if a voice had come out of the sky.',
            ),
          ],
        },
      },
      {
        id: 'a25-07-s2',
        goal: 'Stand with Atreyu while he bargains with Ygramul.',
        hint: 'Stay close. Hold his sleeve when he says the name.',
        check: 'choose:a25-ygramul:sleeve',
        scene: {
          id: 'a25-07-bargain',
          lines: [
            YG('What was that cry? Nothing cries here but our dinners.'),
            AT('I wear the Glory. You know what that means. Let the dragon go.'),
            N('The swarm shivers. It knows AURYN, and does not like it, and cannot quite say no.'),
            YG(
              'We cannot harm the Glory. But we will tell you something, small hunter, as a gift. You came for the Oracle?',
            ),
            YG(
              'Our sting is a long sleep within the hour. But before it, it takes you anywhere you name. Anywhere at all.',
            ),
            AT('The Southern Oracle. Then sting me.', 'angry'),
            FA(
              'No, no, no. Take me too, little hunter. I’m stung already. We’ll go together, and I’ll be lucky for both of us.',
            ),
          ],
          choices: [
            {
              id: 'sleeve',
              label: 'Hold Atreyu’s sleeve, tight, and your Nubbin with the other hand.',
              then: [
                N('You hold on, and your Nubbin holds on to you. AURYN glints.'),
                AT('The Southern Oracle!'),
              ],
            },
            {
              id: 'falkor',
              label: 'Put your hand on Falkor’s mane as well.',
              then: [
                FA('That’s it. All hands on the luckdragon.', 'happy'),
                AT('The Southern Oracle!'),
              ],
            },
          ],
        },
        done: {
          id: 'a25-07-bargain-done',
          lines: [
            N(
              'There is a jolt, like missing a stair in the dark. Then you are falling through light, all of you together, very fast.',
            ),
            N(
              'It doesn’t hurt. It’s more like being sneezed across the world by something very large.',
            ),
          ],
        },
      },
    ],
    complete: {
      id: 'a25-07-complete',
      lines: [
        N(
          'You land in soft sand, in a heap: a boy, a luckdragon, a traveller and a Nubbin on top.',
        ),
        FA(
          'There. Told you. Lucky. Now, I think I shall lie very still for a bit, because I feel extremely odd.',
        ),
        N(
          'Atreyu is pale, and his arm is cold where the sting caught him. Falkor’s eyes are closing.',
        ),
        N(
          'Nearby, a thin plume of smoke rises from a little round house with a telescope on the roof.',
        ),
      ],
    },
    rewards: [],
    sets: { 'a25-07': true },
    notes:
      'CARE (the sting): no bite, no wound, no pain shown. The sting is a white flash and a jolt; the screen fills with ' +
      'falling light for two seconds (a plain fade with reduced motion). Ygramul is a swarm of steel-blue insects drawn ' +
      'more beautiful than horrible, shaping faces and hands; no fangs, no gore. Its voice is many voices layered. ' +
      'BASTIAN’S CRY (a25-07-chasm-done): the attic flickers in red for one beat, then the swarm turns. This is the first ' +
      'sign the two halves can hear each other. ' +
      'Your Nubbin rides on Falkor from here, in the fur behind his ears.',
  },

  // ---------------------------------------------------------------- A25-8
  {
    id: 'a25-08',
    code: 'A25-8',
    title: 'Engywook and Urgl',
    source: src('ch. V, the gnomes by the Southern Oracle'),
    audience: 'all',
    trigger: { where: WHERE, when: after('A25-7') },
    requires: ['A25-7'],
    speakers: [ENGYWOOK, URGL, ATREYU, FALKOR],
    steps: [
      {
        id: 'a25-08-s1',
        goal: 'Fetch herbs for Urgl’s cure.',
        hint: 'The herbs she wants grow among the rocks: one silver, one bitter, one that smells of rain.',
        check: 'collect:a25-herbs:rocks',
        scene: {
          id: 'a25-08-herbs',
          lines: [
            N('Two gnomes come out of the round house, both very small and both talking at once.'),
            UR(
              'Out of the way, Engywook. They’re poisoned. Can’t you see they’re poisoned? Some scientist.',
              'angry',
            ),
            UR('You. The big one with the soft thing. Can you tell a herb from a weed?'),
            Y('Mostly.'),
            UR(
              'Mostly will have to do. Silver leaf, bitter root, and the one that smells of rain. Quick.',
            ),
            N(
              'Your Nubbin finds the one that smells of rain first. It brings it back in its mouth, which Urgl allows.',
            ),
          ],
          choices: [
            {
              id: 'quick',
              label: 'Run for the herbs.',
              then: [
                UR(
                  'Good. Now the kettle. No, the other kettle. Engywook, that one has your socks in it.',
                ),
              ],
            },
            {
              id: 'careful',
              label: 'Pick them carefully, roots and all.',
              then: [UR('Roots and all. Somebody brought you up properly.', 'soft')],
            },
          ],
        },
        done: {
          id: 'a25-08-herbs-done',
          lines: [
            N(
              'Urgl brews all night. By morning Atreyu’s arm is warm again, and Falkor is asking what there is for breakfast.',
            ),
            FA('I feel tremendous. Lucky, lucky. Is there soup?', 'happy'),
          ],
        },
      },
      {
        id: 'a25-08-s2',
        goal: 'Listen to Engywook’s theory about the sphinxes.',
        hint: 'Sit by his telescope. Nod in the right places.',
        check: 'talk:a25-engywook:telescope',
        scene: {
          id: 'a25-08-theory',
          lines: [
            EN(
              'Now. The gates. I have studied them my entire life. Nobody alive knows more about them than I do.',
            ),
            EN(
              'The first gate has two sphinxes. Their eyes are closed. If they open them on you, you freeze. For ever.',
            ),
            EN(
              'Most people they freeze. A few they let through. Why? Nobody knows! Except, very nearly, me.',
            ),
            UR('He has never been through himself.'),
            EN(
              'A scientist doesn’t need to go through. A scientist watches. My theory is nearly finished.',
              'angry',
            ),
            EN('It’s to do with the weather. Or the alphabet. Or the moon. Possibly all three.'),
          ],
          choices: [
            {
              id: 'right',
              label: 'Tell him it sounds very likely.',
              then: [
                EN('You see, Urgl? Science! Somebody appreciates it.', 'happy'),
                UR('Somebody’s being polite.'),
              ],
            },
            {
              id: 'gone',
              label: 'Ask why he’s never gone through.',
              then: [
                EN('Because then I’d know, wouldn’t I. And then what would I study?', 'think'),
              ],
            },
          ],
        },
      },
    ],
    complete: {
      id: 'a25-08-complete',
      lines: [
        UR('There. Cured, fed, and lectured. Go on, then, if you’re going.'),
        EN(
          'Watch the sphinxes. Note which way the wind is blowing. Report back. If you’re not frozen.',
        ),
        N(
          'Urgl packs you bread for the road, and a bottle of cure, “in case of more swarms”. She fusses Falkor’s mane straight.',
        ),
      ],
    },
    rewards: [],
    sets: { 'a25-08': true },
    notes:
      'The gnomes are a comic old married couple, quarrelsome and devoted; our own designs. The herb search is three ' +
      'pickups among rocks, no timer. Falkor recovers between steps and waits outside (he is too big for the house).',
  },

  // ---------------------------------------------------------------- A25-9
  {
    id: 'a25-09',
    code: 'A25-9',
    title: 'The Three Gates',
    source: src('ch. V–VI, the Great Riddle Gate, the Magic Mirror Gate and the No-Key Gate'),
    audience: 'all',
    trigger: { where: WHERE, when: after('A25-8') },
    requires: ['A25-8'],
    speakers: [ATREYU, ENGYWOOK, BASTIAN],
    steps: [
      {
        id: 'a25-09-s1',
        goal: 'Watch Atreyu pass the Great Riddle Gate.',
        hint: 'You stay on the near side. Don’t meet the sphinxes’ eyes.',
        check: 'watch:a25-sphinxes:gate',
        scene: {
          id: 'a25-09-sphinx',
          lines: [
            N(
              'Two enormous sphinxes face each other across a gap in the rocks, eyes shut. Between them lie frozen travellers, still as statues.',
            ),
            EN('Remember the wind! Note the wind!', 'shock'),
            N(
              'Atreyu walks forward. Halfway between them, the sphinxes open their eyes, and look right at him.',
            ),
            N(
              'He doesn’t freeze. He walks on, through, and out the other side, and stands there blinking.',
            ),
            AT('They looked at me. They just looked.'),
            EN('Which way was the wind? Oh, there wasn’t any. That ruins everything.', 'sad'),
          ],
          choices: [
            {
              id: 'follow',
              label: 'Follow while their eyes are still on him.',
              then: [
                N(
                  'You walk through in his shadow, your Nubbin tucked under your coat. The sphinxes don’t look round: you were never theirs to ask.',
                ),
              ],
            },
            {
              id: 'engywook',
              label: 'Tell Engywook it was nothing to do with the wind.',
              then: [
                EN('Then I start again. Good. I was getting bored.', 'happy'),
                N('Then you walk through in Atreyu’s shadow, and nobody looks at you at all.'),
              ],
            },
          ],
        },
        done: {
          id: 'a25-09-sphinx-done',
          lines: [
            N(
              'On the far side, a smooth wall of silver stands across the path, like a still lake set on its edge.',
            ),
          ],
        },
      },
      {
        id: 'a25-09-s2',
        goal: 'Look into the Magic Mirror Gate.',
        hint: 'Stand in front of it. It shows what you really are, not what you look like.',
        check: 'inspect:a25-mirror:gate',
        scene: {
          id: 'a25-09-mirror',
          lines: [
            N(
              'The Magic Mirror Gate shows you what you really are, and most people run from it. Atreyu stands still.',
            ),
            N(
              'In the silver there is no green boy at all. There is a round boy, wrapped in a grey blanket, reading in an attic.',
            ),
            AT('Who is that?', 'shock'),
            N(
              'You look too. In your own part of the mirror, you see the same thing: the round boy, the blanket, the candle.',
            ),
            N('Your Nubbin sees a round boy as well, and waves at him.'),
            N(
              'Up in the attic, Bastian has stopped reading. He is staring at the page where he has just been described.',
            ),
            BA('That’s me. That’s me in there. It can’t be.', 'shock'),
            N(
              'Atreyu walks into the picture of the boy, as if into water, and comes out the other side.',
            ),
          ],
        },
        done: {
          id: 'a25-09-mirror-done',
          lines: [
            N(
              'On the far side, you take out your notebook and write: “Round boy, blanket, attic. Saw him.”',
            ),
            N('You don’t know why. It seems like the sort of thing somebody ought to write down.'),
          ],
        },
      },
      {
        id: 'a25-09-s3',
        goal: 'Wait at the No-Key Gate until it opens.',
        hint: 'It only opens for someone who doesn’t want to go in. Sit down; stop wanting.',
        check: 'wait:a25-gate:no-key',
        scene: {
          id: 'a25-09-nokey',
          lines: [
            N(
              'The third gate is a plain door in a plain wall. It has no handle, no lock and no keyhole.',
            ),
            AT(
              'It opens only for someone who doesn’t want to go in. Engywook said so. How can I not want to?',
              'angry',
            ),
            N('He pushes it, and thumps it, and sits down with his back to it, furious.'),
            N('Your Nubbin, who has no opinions about doors at all, leans on it and yawns.'),
            AT('Fine. Fine. I don’t care. Let it stay shut.'),
            N(
              'He means it, for one second. The door swings quietly open, and your Nubbin falls inside.',
            ),
          ],
        },
      },
    ],
    complete: {
      id: 'a25-09-complete',
      lines: [
        N(
          'Beyond the last gate there is a palace of silver columns, open to the sky, and no one in it.',
        ),
        N(
          'There is only a voice, a long way off and very close by, singing, but in a way that is almost talking.',
        ),
        AT('The Oracle. We made it.', 'happy'),
        N(
          'In the attic, Bastian has pulled the blanket over his head. He isn’t sure he wants to be in a book that knows him.',
        ),
      ],
    },
    rewards: [],
    sets: { 'a25-09': true },
    notes:
      'MIRROR (a25-09-mirror): this sets up A25-15. The Keeper sees Bastian too, because the Keeper is also a reader. ' +
      'Show the mirror image in the rust-red attic ink inside the green page. Your Nubbin sees him as well. The notebook ' +
      'beat in a25-09-mirror-done is the first time the notebook is written in for a reason. ' +
      'THE NO-KEY GATE: the check is the player sitting down and leaving the input idle for about four seconds (pressing ' +
      'anything just restarts the count, gently, with no message). Sphinxes: our own designs, eyes closed; their open ' +
      'eyes are pale gold, never glaring. Frozen travellers are stone statues, peaceful, nothing grim.',
  },

  // ---------------------------------------------------------------- A25-10
  {
    id: 'a25-10',
    code: 'A25-10',
    title: 'Uyulala',
    source: src('ch. VI, the Southern Oracle'),
    audience: 'all',
    trigger: { where: WHERE, when: after('A25-9') },
    requires: ['A25-9'],
    speakers: [ATREYU, UYULALA],
    steps: [
      {
        id: 'a25-10-s1',
        goal: 'Find the voice in the silver palace.',
        hint: 'Follow the singing between the columns. It is nearest where it seems furthest away.',
        check: 'explore:a25-oracle:palace',
        scene: {
          id: 'a25-10-voice',
          lines: [
            N(
              'There is nobody in the palace. Only the voice, moving between the columns like a breeze that has learned to sing.',
            ),
            AT('Uyulala? I’ve come from the Empress. She’s ill. I need to ask you why.'),
            N(
              'Nothing answers. The voice goes on singing, to itself, about the colour of the sky.',
            ),
            AT('Why won’t she talk to me?', 'angry'),
            N(
              'Your Nubbin cocks its head. Then it hums two notes, a high one and a low one that matches it, like a rhyme.',
            ),
            UY('Who sings to me in matching sound? Speak in pairs, and I’ll be found.', 'soft'),
            AT('Rhyme. You have to rhyme. Of course you do.'),
          ],
        },
        done: {
          id: 'a25-10-voice-done',
          lines: [N('Atreyu is not, it turns out, a natural poet. He looks at you hopefully.')],
        },
      },
      {
        id: 'a25-10-s2',
        goal: 'Help Atreyu ask his question in rhyme.',
        hint: 'Pick the answer that rhymes. A wrong one costs nothing; she just waits.',
        check: 'puzzle:a25-rhyme:uyulala',
        scene: {
          id: 'a25-10-rhyme',
          lines: [
            AT(
              'The Empress is ill and the land’s going grey. Please tell us the cure, and we’ll be on our way.',
            ),
            UY(
              'She needs a new name, for the old one wore thin. She fades like a lantern with no flame within.',
            ),
            AT(
              'A name? Then who gives it? Just tell me his name, and I’ll fetch him myself, by whatever road he came.',
            ),
            UY(
              'No child of this country can name her anew. It must be a child from outside. Not you.',
              'sad',
            ),
            UY(
              'A child of the humans, from over the rim. It’s years since one came. We are waiting for him.',
            ),
            N('Atreyu turns to you. His face lights up all at once.'),
            AT('You. You’re from outside. You came in through a page!', 'happy'),
          ],
          choices: [
            {
              id: 'rhyme',
              label:
                '“I came by a page and I’m only a guest. Is that the same thing as the child at your quest?”',
              then: [
                UY(
                  'You came through a page, as did all of us here. A guest cannot give it. The giver is near.',
                  'soft',
                ),
                N('Atreyu’s face falls. He nods slowly, as if he had known.'),
              ],
            },
            {
              id: 'prose',
              label: 'Just ask her, in plain words.',
              then: [
                N(
                  'The voice goes on singing about the sky. It isn’t being rude; it simply can’t hear plain words.',
                ),
                AT('In rhyme. Try in rhyme.'),
              ],
            },
          ],
        },
        done: {
          id: 'a25-10-rhyme-done',
          lines: [
            UY(
              'The Nothing has come to the edge of my hall. I’ll go when it reaches me. That isn’t all.',
              'soft',
            ),
            UY(
              'I’m only a song, and a song can be sung again. Find him. And when he comes, tell him: begin.',
            ),
          ],
        },
      },
    ],
    complete: {
      id: 'a25-10-complete',
      lines: [
        N('The singing grows quiet, and then it stops. The columns stand in silence.'),
        AT('A human child. From outside. Then I’ll go to the border and find one.', 'think'),
        AT('Fantastica has no border. Everyone says so. Well, I’ll find it anyway.'),
        N(
          'In the attic, Bastian has gone very quiet. He looks at his own hands, holding the book.',
        ),
      ],
    },
    rewards: [],
    sets: { 'a25-10': true },
    notes:
      'UYULALA’S RHYMES are all our own (Part M: original). She is only a voice: draw no figure, just silver columns and a ' +
      'shimmer that moves with the sound. The rhyme puzzle in step 2 re-offers both choices until the rhyming one is ' +
      'picked; the plain-words choice plays its lines and loops back, no fail. The Keeper’s rhyme sets up the Empress’s ' +
      'plainer words in A25-13 (the outline places “you can’t give her name” at Q10; here Uyulala says it first, in ' +
      'rhyme, and the Empress says it plainly in A25-13).',
  },

  // ---------------------------------------------------------------- A25-11
  {
    id: 'a25-11',
    code: 'A25-11',
    title: 'The Wind Giants',
    source: src('ch. VII, the four Wind Giants'),
    audience: 'all',
    trigger: { where: WHERE, when: after('A25-10') },
    requires: ['A25-10'],
    speakers: [ATREYU, FALKOR],
    steps: [
      {
        id: 'a25-11-s1',
        goal: 'Fly for the border on Falkor’s back.',
        hint: 'Climb up behind Atreyu. Your Nubbin goes in the fur behind Falkor’s ears.',
        check: 'climb:a25-falkor:back',
        scene: {
          id: 'a25-11-flight',
          lines: [
            N(
              'Falkor flies the way water runs downhill: easily, as if the sky had been waiting for him.',
            ),
            N(
              'Your Nubbin rides in the long white fur behind his ears, where the wind can’t get at it, and sings.',
            ),
            FA(
              'There is no border. Everybody knows that. So we’ll fly until we find it. That’s how luck works.',
              'happy',
            ),
            AT('Is it?'),
            FA('Oh yes. You never find anything lucky by looking where it ought to be.'),
            N(
              'Below you the land goes by: forests, and seas, and here and there a blank place where something used to be.',
            ),
          ],
        },
        done: {
          id: 'a25-11-flight-done',
          lines: [
            N(
              'Then the sky turns dark ahead, and the wind changes, and changes again, from four sides at once.',
            ),
          ],
        },
      },
      {
        id: 'a25-11-s2',
        goal: 'Hold on through the storm of the four winds.',
        hint: 'Keep low in Falkor’s fur. You can’t catch Atreyu; don’t try.',
        check: 'watch:a25-winds:storm',
        scene: {
          id: 'a25-11-storm',
          lines: [
            N(
              'Four Wind Giants are fighting in the sky: one from each corner of the world, huge and grey and made of weather.',
            ),
            N(
              'They don’t notice you. They’re too busy shoving each other, as they have been since the world began.',
            ),
            FA('Hold on! Hold on to anything! Hold on to each other!', 'shock'),
            N(
              'The storm turns Falkor over. You hold on to his fur, and your Nubbin holds on to you.',
            ),
            N(
              'Atreyu doesn’t. One moment he’s there, and the next he’s a small dark shape falling towards the sea.',
            ),
            N('Something gold drops after him, catches the light once, and is gone.'),
          ],
        },
        done: {
          id: 'a25-11-storm-done',
          lines: [
            N(
              'The Wind Giants blow away over the horizon, still quarrelling. They never knew you were there.',
            ),
          ],
        },
      },
      {
        id: 'a25-11-s3',
        goal: 'Search the sea with Falkor.',
        hint: 'Watch the water for anything gold or anyone green. Falkor won’t stop, so neither will you.',
        check: 'explore:a25-sea:search',
        scene: {
          id: 'a25-11-search',
          lines: [
            N(
              'The sea is huge and grey, and goes on in every direction. Falkor flies low over it, back and forth.',
            ),
            FA(
              'He’ll be somewhere. People always are. Luck is just not giving up for longer than the bad luck lasts.',
            ),
            N(
              'He says it brightly. But he doesn’t stop to rest, not once, and you notice he isn’t singing any more.',
            ),
            N('Your Nubbin leans out over his ear, as far as it dares, and stares at the waves.'),
            FA(
              'He’s small and green and stubborn. That’s easy to spot. That’s practically lucky already.',
            ),
            N(
              'The sun goes down behind you. The sea turns from grey to black, and still there is nothing in it.',
            ),
          ],
          choices: [
            {
              id: 'look',
              label: 'Lean down and watch the water.',
              then: [
                N(
                  'You watch until your eyes ache. Your Nubbin watches with you, pointing at every wave that looks like anything.',
                ),
              ],
            },
            {
              id: 'sing',
              label: 'Ask Falkor to sing, so it’s not so quiet.',
              then: [
                FA(
                  'Sing? Yes. Yes, why not. Luckdragons ought to sing. It helps the luck find us.',
                  'soft',
                ),
              ],
            },
          ],
        },
      },
    ],
    complete: {
      id: 'a25-11-complete',
      lines: [
        N('Night falls on the sea. Falkor keeps flying.'),
        N(
          'Far off, on a dark shore, a boy without an amulet is waking up alone, in a ruined city.',
        ),
        N(
          'In the attic, Bastian has lit his candle. It throws his shadow up the sloping roof, very big.',
        ),
      ],
    },
    rewards: [],
    sets: { 'a25-11': true },
    notes:
      'The Wind Giants are vast grey weather-shapes in our own design, not faces. The storm is a strong screen sway with ' +
      'rain streaks (reduced motion: no sway, darker sky and sound only). Atreyu’s fall is shown small and far away, and ' +
      'never followed down: the camera stays with Falkor. The gold glint is AURYN, unnamed here.',
  },

  // ---------------------------------------------------------------- A25-12
  {
    id: 'a25-12',
    code: 'A25-12',
    title: 'Spook City',
    source: src('ch. VIII–IX, Spook City and Gmork; Falkor finds AURYN'),
    audience: 'all',
    trigger: { where: WHERE, when: after('A25-11') },
    requires: ['A25-11'],
    speakers: [FALKOR, ATREYU, GMORK],
    steps: [
      {
        id: 'a25-12-s1',
        goal: 'Help Falkor find the amulet in the sea.',
        hint: 'Watch for the gold glint under the waves, then hold on while he dives.',
        check: 'find:a25-auryn:sea',
        scene: {
          id: 'a25-12-dive',
          lines: [
            N(
              'At dawn, a long way out, something winks under the water. Gold, the size of a palm.',
            ),
            FA(
              'There! I knew it. Didn’t I say? Hold on tight, and shut your mouth. Seawater’s horrid.',
            ),
            N(
              'He folds himself up and dives. The sea goes green and cold all round you for one long breath.',
            ),
            N(
              'When you come up, Falkor has the amulet in his mouth, very gently, like a dog with an egg.',
            ),
            FA('Mmf. Now for the boy. The Glory knows where its bearer is. Can you feel it pull?'),
            N(
              'You can. The amulet tugs, ever so slightly, towards a dark shore and a broken skyline.',
            ),
          ],
        },
      },
      {
        id: 'a25-12-s2',
        goal: 'Listen from the ruined wall while Atreyu faces Gmork.',
        hint: 'Stay hidden on the wall with Falkor. Don’t go down till it’s over.',
        check: 'watch:a25-gmork:spook-city',
        scene: {
          id: 'a25-12-gmork',
          lines: [
            N(
              'Spook City is all broken towers and empty windows. In a courtyard, chained to the wall, lies a great grey wolf.',
            ),
            N(
              'He is very thin. He has been chained there a long time, and Atreyu is sitting just out of reach of him.',
            ),
            GM(
              'You want to know what the Nothing is, boy? I’ll tell you. I serve the power behind it. I know.',
            ),
            GM(
              'When you Fantasticans jump into the Nothing, you don’t vanish. You go across to the humans. And there you become lies.',
            ),
            GM(
              'Little fears. Bad ideas. Reasons not to hope. The humans stop believing anything can be different, and the Nothing grows.',
            ),
            GM(
              'I was sent to find the one hunter who might stop it. Some green boy. I never found him.',
            ),
            AT('I’m Atreyu.', 'angry'),
            N(
              'The wolf goes very still. Then he begins to laugh, a long, dry, terrible laugh that goes on and on.',
            ),
          ],
        },
        done: {
          id: 'a25-12-gmork-done',
          lines: [
            N(
              'You don’t see the wolf. You see Atreyu’s face, as the laughing stops, and the quiet after it.',
            ),
            N(
              'Then Atreyu cries out. The chained jaws have closed on his leg, even now, and they won’t open.',
            ),
          ],
        },
      },
      {
        id: 'a25-12-s3',
        goal: 'Pull Atreyu free with Falkor.',
        hint: 'Get down into the courtyard. Falkor holds the jaws; you pull.',
        check: 'carry:a25-atreyu:falkor',
        scene: {
          id: 'a25-12-free',
          lines: [
            N(
              'Falkor comes down out of the dark like a falling cloud, with the amulet still in his mouth.',
            ),
            FA('Mmf! Pull! I’ve got this end!'),
            N(
              'He gets his great paws into the jaws and heaves. You take Atreyu under the arms and pull.',
            ),
            N(
              'Your Nubbin pulls on your coat, which doesn’t help, but it is clearly doing its bit.',
            ),
            N(
              'The jaws give. Atreyu tumbles back on top of you both, and Falkor drops AURYN into his lap.',
            ),
            AT('You found it. You found me. How?', 'shock'),
            FA('Luck. And not stopping. Mostly the not stopping.', 'happy'),
          ],
          choices: [
            {
              id: 'lean',
              label: 'Let Atreyu lean on you while he stands.',
              then: [
                AT('Just for a minute. Then I can do it myself.', 'soft'),
                N('It is a good deal more than a minute. Nobody minds.'),
              ],
            },
            {
              id: 'falkor',
              label: 'Thank Falkor.',
              then: [FA('Thank the luck. Well, no, thank me. I did most of it.', 'happy')],
            },
          ],
        },
      },
    ],
    complete: {
      id: 'a25-12-complete',
      lines: [
        N(
          'Falkor flies you all out of Spook City before the sun is properly up. Nobody looks back.',
        ),
        AT(
          'He said people stop hoping, and that’s what makes the Nothing grow. Out there. In the human world.',
          'think',
        ),
        FA('Then somebody out there had better start again.'),
        N(
          'Your Nubbin is fast asleep behind his ear. A scrap of pearly scale has come loose in the fur, and it’s wrapped in it like a cape.',
        ),
        FA('Keep it. Luckdragons shed. It’s lucky, obviously.', 'happy'),
      ],
    },
    rewards: [
      {
        id: 'a25-luck-cape',
        kind: 'cosmetic',
        label: 'Pearl-Scale Cape',
        description:
          'A little cape of shed luckdragon scale, white with a pearly sheen. Any Nubbin can wear it. It ripples when they run.',
      },
    ],
    sets: { 'a25-12': true },
    notes:
      'CARE (Gmork): he is a great grey wolf, gaunt and chained, drawn sad more than savage; no fangs dripping, no blood. ' +
      'His end is offscreen: the camera holds on Atreyu’s face in close-up as the laugh fades out (a slow fade of the ' +
      'laugh, then three seconds of silence). The jaws closing on Atreyu’s leg are a sound and Atreyu’s cry, not a ' +
      'picture; the freeing is shown from the waist up. Gmork’s speech is our own words. Falkor finding AURYN is a short ' +
      'dive scene (reduced motion: a cut to underwater and back). The cape is the outline’s pearl-scale luckdragon cape.',
  },

  // ---------------------------------------------------------------- A25-13
  {
    id: 'a25-13',
    code: 'A25-13',
    title: 'The Old Man of Wandering Mountain',
    source: src('ch. X–XI, the Ivory Tower and the Old Man of Wandering Mountain'),
    audience: 'all',
    trigger: { where: WHERE, when: after('A25-12') },
    requires: ['A25-12'],
    speakers: [EMPRESS, ATREYU, OLDMAN, BASTIAN],
    steps: [
      {
        id: 'a25-13-s1',
        goal: 'Go with Atreyu to the Empress at the top of the Ivory Tower.',
        hint: 'Climb to the magnolia pavilion. Wait at the edge of the room.',
        check: 'talk:a25-empress:magnolia',
        scene: {
          id: 'a25-13-empress',
          lines: [
            ...Q13_OPEN,
            N('Then she looks past Atreyu, at your Nubbin, who is half-hidden behind your knee.'),
            EM('Hello. I know you. I know everyone here.'),
            N(
              'She says your Nubbin’s name, very softly. It is the right name, the one you gave it on the first night.',
            ),
            N(
              'Your Nubbin comes out from behind your knee all at once, as if it had been called across the Grove.',
            ),
            ...Q13_CLOSE,
          ],
        },
        done: {
          id: 'a25-13-empress-done',
          lines: [
            EM(
              'Sleep now, Atreyu. You have done more than anyone. I have one more thing to try.',
              'soft',
            ),
            N('Atreyu is asleep before he can argue. The Empress turns to you.'),
          ],
        },
      },
      {
        id: 'a25-13-s2',
        goal: 'Go with the Empress to Wandering Mountain.',
        hint: 'Climb the mountain path behind her. She goes slowly; she has never been here.',
        check: 'climb:a25-wandering:egg-house',
        scene: {
          id: 'a25-13-climb',
          lines: [
            EM('Come, if you like. You aren’t part of this story, so it won’t mind you.'),
            N(
              'Wandering Mountain is never in the same place twice. Today it is right outside the tower, as if it had been expecting her.',
            ),
            EM(
              'There is one person in Fantastica I must never meet. If I meet him, everything that has happened happens again.',
            ),
            EM('He’s the Old Man. He writes it all down, as it happens. He writes me.'),
            N(
              'At the top there is a house shaped like an egg. Inside, by blue light, an old man is writing in a book with a pen of light.',
            ),
            N(
              'It is the same book, copper silk with two snakes. Your Nubbin knows it at once and tugs your sleeve.',
            ),
          ],
          choices: [
            {
              id: 'bow',
              label: 'Bow to the Old Man.',
              then: [
                N(
                  'He doesn’t look up, but his pen writes: the traveller bows. You see the words appear.',
                ),
              ],
            },
            {
              id: 'stay',
              label: 'Stay by the door, out of the light.',
              then: [
                N(
                  'You keep to the door. The pen writes that too: the traveller keeps to the door.',
                ),
              ],
            },
          ],
        },
        done: {
          id: 'a25-13-climb-done',
          lines: [
            OM('You came. You shouldn’t have. But you came.', 'sad'),
            EM('Then read it. From the start. Read it out loud.'),
          ],
        },
      },
      {
        id: 'a25-13-s3',
        goal: 'Sit and listen while the Old Man reads the story from the beginning.',
        hint: 'Sit on the floor by the Empress. It’s a long story. Listen to how it starts.',
        check: 'sit:a25-oldman:book',
        scene: {
          id: 'a25-13-reading',
          lines: [
            OM('Very well. From the first page.'),
            OM(
              'Rain, on a shop door with a little bell. An old bookseller in an armchair. A round boy, running from other boys.',
            ),
            N('In the attic, Bastian’s mouth falls open. That’s him, and that’s his morning.'),
            OM(
              'He takes a book. He runs. He goes up to a school attic and wraps himself in blankets, and opens it.',
            ),
            OM('A forest. Four messengers by a fire. A centaur. A boy in the Grassy Sea…'),
            N(
              'You hear yourself in it: a traveller behind a bell, with a small soft creature that sneezed on a book.',
            ),
            OM(
              'And at the top of the tower, the Empress goes to the Old Man of Wandering Mountain. And he begins to read the story from the start…',
            ),
            N(
              'It is going round again. It will go round for ever, the boy reading and the old man reading him, unless someone breaks in.',
            ),
            BA(
              'It’s me. She’s waiting for me. She’ll wait for ever, and I’ll be reading this for ever, unless…',
              'shock',
            ),
          ],
        },
      },
    ],
    complete: {
      id: 'a25-13-complete',
      lines: [
        N(
          'The Empress doesn’t look at the Old Man. She looks up, at the ceiling of the egg, as if there were a skylight there.',
        ),
        EM(
          'Bastian. I know you’re there. I’ve known all along. It’s all right that you were frightened.',
          'soft',
        ),
        N(
          'In the attic the candle is nearly burnt down. Bastian stands up, with the blanket falling off his shoulders.',
        ),
      ],
    },
    rewards: [],
    sets: { 'a25-13': true },
    notes:
      'ASH (reads s6Done, read-only): if s6Done is set, play ATLAS_A25_VARIANTS a25-13-empress-ash in place of ' +
      'a25-13-empress (same check). Without it, the base scene: the Empress simply knows your Nubbin’s name and says it. ' +
      'Never show the Nubbin’s name as text here; the line describes it, and the voice actor (if any) says nothing ' +
      'audible for it: a soft chime plays where the name would be. The Empress is drawn as a pale girl of about ten with ' +
      'long white hair, in our own design. The Old Man’s reading is our own summary of the story so far, never the ' +
      'novel’s opening sentences: it echoes this page’s own scenes (the Keeper’s sneeze, a25-01-shop). ' +
      'The egg house is lit blue; the Old Man’s book glows. Keep A25-13’s close and A25-14 back to back.',
  },

  // ---------------------------------------------------------------- A25-14
  {
    id: 'a25-14',
    code: 'A25-14',
    title: 'Moon Child',
    source: src('ch. XII, the new name, and the grain of sand'),
    audience: 'all',
    trigger: { where: WHERE, when: after('A25-13') },
    requires: ['A25-13'],
    speakers: [BASTIAN, EMPRESS],
    steps: [
      {
        id: 'a25-14-s1',
        goal: 'Be in the attic when Bastian says her name.',
        hint: 'Stand by him in the red light. Don’t help. It has to be him.',
        check: 'watch:a25-attic:name',
        scene: {
          id: 'a25-14-name',
          lines: [
            N(
              'You are back in the attic all at once, in the red ink, and the candle is a stub. Outside it is dark and still raining.',
            ),
            BA(
              'I’m not right for it. I’m not brave. I’m not anything. Somebody better should do it.',
              'sad',
            ),
            N(
              'He looks at the book. Atreyu went into the swamp for her, and Falkor went into the sea.',
            ),
            BA('There isn’t anybody better. There’s only me. There’s only ever been me up here.'),
            N(
              'Your Nubbin sits on the gym mat in front of him and looks up at him, waiting, the way it waits for breakfast.',
            ),
            N(
              'Bastian takes a deep breath. He thought of the name pages ago, and was too shy to say it.',
            ),
            BA('Moon Child! Your name is Moon Child! I’m coming!', 'shock'),
          ],
        },
        done: {
          id: 'a25-14-name-done',
          lines: [
            N(
              'The candle goes out, and the attic, and everything. It goes all at once, very gently, like a blanket thrown over a cage.',
            ),
          ],
        },
      },
      {
        id: 'a25-14-s2',
        goal: 'Wait in the dark.',
        hint: 'There is nothing to see. Stay close to your Nubbin and listen.',
        check: 'wait:a25-dark:sand',
        scene: {
          id: 'a25-14-dark',
          lines: [
            N(
              'It is completely dark. Not frightening dark: the dark behind your eyes, just before you sleep.',
            ),
            BA('Hello? Is anyone there? Did I do it wrong?'),
            EM(
              'You did it right. Moon Child. Nobody has ever given me a better one. Thank you, Bastian.',
              'soft',
            ),
            BA('Where is everything? Where’s Fantastica?'),
            EM('Here. This is all that’s left of it.'),
            N(
              'In the dark, a small cool hand opens his, and puts something into it. A single grain of sand, glowing like an ember.',
            ),
            EM(
              'Everything starts again with you. It will grow from your wishes. Go carefully. Wishes are hungrier than they look.',
            ),
          ],
          choices: [
            {
              id: 'nubbin',
              label: 'Find your Nubbin in the dark.',
              then: [
                N(
                  'You feel about until you find a warm, soft ear. Your Nubbin finds your thumb and holds it.',
                ),
              ],
            },
            {
              id: 'still',
              label: 'Keep still and listen.',
              then: [
                N(
                  'You keep still. In the dark you can hear a boy breathing fast, and a girl’s voice, very calm.',
                ),
              ],
            },
          ],
        },
        done: {
          id: 'a25-14-dark-done',
          lines: [
            N(
              'Something brushes your own hand in the dark. When you look, there is a single grain of sand stuck to your Nubbin’s paw.',
            ),
            N(
              'It glows, very faintly. Your Nubbin holds its paw out flat, as if it knew it mustn’t drop it.',
            ),
          ],
        },
      },
    ],
    complete: {
      id: 'a25-14-complete',
      lines: [
        N(
          'The page goes still. Across the bottom, where the chapters usually start, there is a long space and a single line of green.',
        ),
        N(
          'This is the end of the first half. In the dark, a boy holds a grain of sand, and a whole world waits for him to wish.',
        ),
        N(
          'You tip your Nubbin’s grain into an empty glass vial from your pocket, and stopper it. It glows in your hand like a tiny moon.',
        ),
      ],
    },
    rewards: [
      {
        id: 'a25-sand-vial',
        kind: 'decor',
        label: 'Grain of Sand',
        description:
          'A single grain of sand in a little stoppered vial. By day it is just sand. At night it glows faintly, like a far-off moon.',
      },
    ],
    sets: { 'a25-14': true },
    notes:
      'THE NAME: “Moon Child” (German Mondenkind). Bastian’s shout is a full-screen moment: the attic in red, the line ' +
      'shown large. Then the screen goes fully black for a beat; the dark scene plays on a black page, with a single ' +
      'warm dot for the grain. Never scary: soft hum, no silence-then-bang. This is the END OF PART ONE; the Learning ' +
      'Grove version stops here. Show a page-turn card between A25-14 and A25-15 (“Part Two”), with no text quoted. ' +
      'Grain of Sand decor: a shelf ornament that glows faintly at night on the Grove’s clock (no reward from it).',
  },

  // ---------------------------------------------------------------- A25-15
  {
    id: 'a25-15',
    code: 'A25-15',
    title: 'Perelín and Goab',
    source: src('ch. XIII–XIV, the Night Forest Perelín and Graógramán in the desert Goab'),
    audience: 'all',
    trigger: { where: WHERE, when: after('A25-14') },
    requires: ['A25-14'],
    speakers: [BASTIAN, GRAO],
    steps: [
      {
        id: 'a25-15-s1',
        goal: 'Watch the Night Forest grow from the grain of sand.',
        hint: 'Stay near Bastian in the dark. Keep your Nubbin out from under the flowers; they grow fast.',
        check: 'watch:a25-perelin:grow',
        scene: {
          id: 'a25-15-sand',
          lines: [
            N(
              'In the dark, the grain in Bastian’s hand puts out a shoot. Then a stem, then leaves, then a whole forest, all at once.',
            ),
            BA('I wished that. I only thought it, and it’s there.', 'shock'),
            N(
              'The Night Forest grows so fast you can hear it creak. Your Nubbin hides inside a flower the size of an umbrella.',
            ),
            N('Bastian finds a pool of still water among the roots and kneels to look at himself.'),
            BA('I wish I were handsome. Tall and strong and handsome. Like a prince in a book.'),
            N(
              'And he is: the boy in the pool is slim and straight, with a fine, proud face. He laughs out loud.',
            ),
            N('Round his neck, on a chain, hangs AURYN. The Empress has left it to him.'),
            N('He turns it over in his fingers, and you see the back of it for the first time.'),
            N(LIFT_AURYN),
            BA('Do what you wish. It says do what you wish! Then I will.', 'happy'),
            N(
              'He doesn’t say goodbye to the round boy in the pool. He doesn’t notice that the round boy has gone.',
            ),
          ],
        },
        done: {
          id: 'a25-15-sand-done',
          lines: [
            N(
              'By morning he can’t quite remember being any other shape. He doesn’t try; he has a forest to explore.',
            ),
          ],
        },
      },
      {
        id: 'a25-15-s2',
        goal: 'Cross the desert of colours to the lion’s palace.',
        hint: 'Walk with Bastian over the coloured dunes. Be inside before night falls.',
        check: 'visit:a25-goab:lion',
        scene: {
          id: 'a25-15-lion',
          lines: [
            N(
              'Beyond the forest the land turns to desert, and every dune is a different colour: red, then blue, then violet, then gold.',
            ),
            N(
              'In the middle of it lies a lion as big as a house, whose coat changes colour with the sand he lies on.',
            ),
            GR(
              'I am Graógramán. They call me the Many-Coloured Death. Everything that comes near me burns away.',
            ),
            GR('Not you, though. You wear the Glory. And your companions are under it.'),
            GR(
              'At night I turn to stone, and the desert goes out. At dawn I wake, and it lights again. Every night, every dawn.',
            ),
            BA('Then I’ll stay with you tonight. So you aren’t on your own.'),
            N(
              'The lion looks at him, surprised. Then the sun sets, and he turns to cold grey stone in the middle of a word.',
            ),
          ],
          choices: [
            {
              id: 'mane',
              label: 'Sit by the stone lion all night.',
              then: [
                N(
                  'You sit with your back against his stone paw. Your Nubbin falls asleep on it, the way it does on warm steps.',
                ),
              ],
            },
            {
              id: 'bastian',
              label: 'Sit with Bastian, who isn’t sleeping.',
              then: [
                BA('He does that every night. On his own. Nobody ever stayed. Imagine.', 'think'),
              ],
            },
          ],
        },
        done: {
          id: 'a25-15-lion-done',
          lines: [
            N(
              'At dawn the lion wakes, warm and gold. He gives Bastian a sword with a plain hilt, rusty in its scabbard.',
            ),
            GR(
              'Sikanda. It leaps into your hand by itself, when it’s needed. Never draw it of your own will.',
            ),
          ],
        },
      },
      {
        id: 'a25-15-s3',
        goal: 'Answer Bastian’s question.',
        hint: 'You saw him in the Magic Mirror Gate. Choose what to tell him.',
        check: 'choose:a25-mirror:bastian',
        scene: {
          id: 'a25-15-mirror',
          lines: [
            N(
              'Bastian swings the sword through the air in the morning light. He is very pleased with everything.',
            ),
            N(
              'He catches sight of himself in the lion’s polished claw, and stops, and smiles at what he sees.',
            ),
            BA(
              'You were there from the beginning, weren’t you. In the book. I saw you, I think. Behind things.',
            ),
            BA('So tell me. Did I always look like this?'),
            N(
              'You remember the Magic Mirror Gate. A round boy in a grey blanket, by candlelight, in an attic.',
            ),
            N('Your Nubbin looks at you. It remembers too.'),
          ],
          choices: Q15_MIRROR,
        },
      },
    ],
    complete: {
      id: 'a25-15-complete',
      lines: [
        N(
          'Bastian walks out of the desert with the sword on his back and the lion’s blessing behind him.',
        ),
        N(
          'People begin to follow him. A knight, then three, then a whole company, because he is splendid and they can tell.',
        ),
        N(
          'You walk at the back of the company, with your Nubbin in your hood. It keeps looking back at the desert.',
        ),
      ],
    },
    rewards: [],
    sets: { 'a25-15': true },
    childLines: {
      'a25-15-sand#8':
        'Round the back, where the snakes’ tails meet, there are four words cut into the gold.',
      'a25-15-sand#9': 'It says I can choose. I can choose anything at all! Then I will.',
    },
    notes:
      'PART TWO starts here. The page is green now even when Bastian is in it: he is in Fantastica. ' +
      'LIFTED TEXT: a25-15-sand#8 is AURYN’s inscription in Ende’s German (« TU WAS DU WILLST », Thienemann 1979), and ' +
      '#9 is our own English in Bastian’s mouth. Show the four words engraved on the amulet’s back in a close-up. ' +
      'NO WISHING MECHANIC: the player never holds AURYN and never wishes; Bastian wishes in dialogue only. ' +
      'SIGNATURE CHOICE (a25-15-mirror): a25-mirror = truth | yourself | notebook. It pays off in A25-16 (a25-16-worry ' +
      'variants), A25-18 (a25-18-attic-truth), A25-19 (a25-19-page-notebook, a25-19-ask-yourself) and A25-20 (the three ' +
      'complete scenes), and in the Attic Nook (notebook: the torn page on the beam). ' +
      'Bastian’s new look: tall and handsome in the Fantastican manner, our own design. Graógramán is a vast lion whose ' +
      'coat cycles through the dune colours; he turns to grey stone at sunset (a slow fade, not a crack).',
  },

  // ---------------------------------------------------------------- A25-16
  {
    id: 'a25-16',
    code: 'A25-16',
    title: 'Amarganth',
    source: src('ch. XV–XVI, the silver city of Amarganth and the tournament'),
    audience: 'all',
    trigger: { where: WHERE, when: after('A25-15') },
    requires: ['A25-15'],
    speakers: [BASTIAN, HYNRECK, ATREYU, FALKOR],
    steps: [
      {
        id: 'a25-16-s1',
        goal: 'Watch the tournament at Amarganth.',
        hint: 'Find a place on the silver stands by the lake. Hynreck likes an audience.',
        check: 'watch:a25-amarganth:tournament',
        scene: {
          id: 'a25-16-hynreck',
          lines: [
            N(
              'Amarganth is a city of silver on a lake, and the whole of it is floating. It moves very slowly, like a swan asleep.',
            ),
            N(
              'There is a tournament. Bastian enters every contest, and wins every one of them, and is gracious about it.',
            ),
            N('A knight called Hynreck loses three times in one morning, and minds very much.'),
            HY(
              'He’s new! Nobody knows where he came from! I have trained my whole life for this.',
              'angry',
            ),
            HY(
              'I am doing it for a princess. Oglamar. She will only marry the greatest hero in Fantastica, and it was going to be me.',
            ),
            HY(
              'Let me tell you how I first saw her. It was spring. No, autumn. There was a horse involved, a grey horse, with a limp…',
            ),
            N(
              'He tells you about the horse’s limp, then the horse’s mother. Then about a cousin of the horse’s mother.',
            ),
            N('Your Nubbin falls asleep in your lap. The page itself seems to lose patience.'),
            N(LIFT_REFRAIN),
            N(OUR_REFRAIN),
          ],
          choices: [
            {
              id: 'kind',
              label: 'Tell Hynreck he rode very well.',
              then: [
                HY(
                  'I did, didn’t I. I did ride well. Thank you, stranger. You have taste.',
                  'soft',
                ),
              ],
            },
            {
              id: 'princess',
              label: 'Ask whether Oglamar actually likes him.',
              then: [
                HY(
                  'Likes me? What has liking got to do with it? I’m talking about heroes.',
                  'shock',
                ),
              ],
            },
          ],
        },
        done: {
          id: 'a25-16-hynreck-done',
          lines: [
            N(
              'A shout goes up from the shore. Something long and white is coming down out of the sky over the lake.',
            ),
          ],
        },
      },
      {
        id: 'a25-16-s2',
        goal: 'Meet Atreyu and Falkor again.',
        hint: 'Go down to the shore where Falkor has landed. Bastian is already there.',
        check: 'talk:a25-atreyu:amarganth',
        scene: {
          id: 'a25-16-worry',
          lines: [
            FA('It’s you! And the little one! Lucky, lucky, lucky. I said we’d find you.', 'happy'),
            N(
              'Atreyu looks at Bastian for a long time. He has heard of the new hero, and worked out who it is.',
            ),
            AT('You’re the one who gave her the name. You’re Bastian. Thank you.', 'soft'),
            BA(
              'You know what? I used to be round. Round and plain, and I read books in a school attic. Can you imagine?',
              'happy',
            ),
            BA(
              'This traveller told me. I’d forgotten. It’s funny, isn’t it. Like it was somebody else.',
            ),
            N(
              'He laughs, and Atreyu laughs too, a little. Then Bastian goes off to see Falkor’s scales, and Atreyu stops laughing.',
            ),
            AT(
              'He talks about it like a story he read. Every wish he makes, something goes. I don’t think he knows what.',
              'think',
            ),
            AT('You see it too, don’t you. Help me watch him.'),
          ],
        },
      },
    ],
    complete: {
      id: 'a25-16-complete',
      lines: [
        N(
          'That night Bastian wishes Hynreck a dragon to fight, so he can win his princess. The dragon arrives promptly.',
        ),
        N('It all goes wrong, as wishes for other people do. But that is another story.'),
        N(
          'Bastian doesn’t mind. He has already forgotten what he wished, and moves on to the next thing.',
        ),
        N(
          'Atreyu watches him go. Falkor curls round the pair of you on the shore like a long white wall.',
        ),
      ],
    },
    rewards: [],
    sets: { 'a25-16': true },
    childLines: {
      'a25-16-hynreck#8':
        'At the bottom of the page, in green, the book writes a little line to say it will tell that tale some other day.',
      'a25-16-hynreck#9':
        'Hynreck’s story will have to wait. The book has other things to tell first.',
      'a25-16-complete#1':
        'It all goes wrong, as wishes for other people do. The book doesn’t stop to tell that part.',
    },
    notes:
      'LIFTED TEXT: a25-16-hynreck#8 is the novel’s refrain in Ende’s German (Thienemann 1979), set across the foot of the ' +
      'page in green ink as if the book itself cut Hynreck off; #9 is our own English. The complete scene’s “But that is ' +
      'another story” (#1) is a deliberate half-echo in our own words, not a second use of the refrain; it has a ' +
      'childLines entry all the same. ' +
      'MIRROR PAYOFF (a25-mirror): the step 2 scene shown, a25-16-worry, is for truth. For yourself play ATLAS_A25_VARIANTS ' +
      'a25-16-worry-yourself, for notebook a25-16-worry-notebook (same check). ' +
      'HAZEL’S MARGIN NOTE (s24Done, read-only): if s24Done is set when a25-16-complete ends, play ATLAS_A25_VARIANTS ' +
      'a25-margin-hazel straight after it; otherwise it plays the first time the atlas is open at this page after s24Done ' +
      'is set. From then on the pencil note is drawn in the margin beside the picture of the amulet. Its text matches ' +
      'S24’s notes exactly. Amarganth floats; draw its silver as boat-like hulls joined by bridges, our own design.',
  },

  // ---------------------------------------------------------------- A25-17
  {
    id: 'a25-17',
    code: 'A25-17',
    title: 'Xayide',
    source: src('ch. XVII–XVIII, Xayide and Horok, the Seeing Hand'),
    audience: 'all',
    trigger: { where: WHERE, when: after('A25-16') },
    requires: ['A25-16'],
    speakers: [BASTIAN, XAYIDE, ATREYU, FALKOR],
    steps: [
      {
        id: 'a25-17-s1',
        goal: 'Go with Bastian’s company to the castle shaped like a hand.',
        hint: 'Stay behind the knights. The armour in the gate moves.',
        check: 'visit:a25-horok:gate',
        scene: {
          id: 'a25-17-horok',
          lines: [
            N(
              'The castle of Horok stands on a hill, built in the shape of a great hand with its fingers pointing at the sky.',
            ),
            N(
              'Its gate is guarded by giants in black armour. They march out with a hollow clanking, all in step.',
            ),
            N(
              'Sikanda leaps out of its scabbard into Bastian’s hand by itself, as the lion said. Bastian barely has to move.',
            ),
            N(
              'The giants fall apart. Their helmets roll on the grass, and there is nothing inside them at all.',
            ),
            N(
              'Your Nubbin peers into a helmet, and then very carefully puts its own head in, and takes it out again.',
            ),
            BA('Empty! They’re all empty. Who would make an army out of nobody?', 'shock'),
          ],
        },
        done: {
          id: 'a25-17-horok-done',
          lines: [
            N(
              'The gate of the hand opens by itself. Inside, at the top of a long stair, a woman is waiting, smiling.',
            ),
          ],
        },
      },
      {
        id: 'a25-17-s2',
        goal: 'Listen to Xayide’s advice.',
        hint: 'Stand at the back of the hall. Watch her eyes.',
        check: 'talk:a25-xayide:hall',
        scene: {
          id: 'a25-17-xayide',
          lines: [
            N(
              'Xayide is tall and beautiful, with one red eye and one green one. She bows to Bastian very low.',
            ),
            XA(
              'I surrender. Why fight the greatest hero in Fantastica? I would rather serve him. And advise him.',
              'soft',
            ),
            XA(
              'Your friend Atreyu, for instance. He watches your amulet. Have you noticed? He’d like it for himself.',
            ),
            BA('Atreyu? No. He wouldn’t.'),
            XA(
              'Of course not. Forget I spoke. You’re the one who saved us all. You should have everything you want.',
            ),
            N(
              'Bastian looks pleased, and then uneasy, and then pleased again. Your Nubbin sits on your foot and doesn’t like her.',
            ),
          ],
          choices: [
            {
              id: 'eyes',
              label: 'Look at Xayide until she looks away.',
              then: [
                N(
                  'She looks back at you with the red eye, then the green one. Then she smiles and turns away first, and doesn’t forget it.',
                ),
              ],
            },
            {
              id: 'bastian',
              label: 'Tell Bastian that Atreyu is his friend.',
              then: [BA('I know that. I know. Why does everyone keep telling me things?', 'angry')],
            },
          ],
        },
      },
      {
        id: 'a25-17-s3',
        goal: 'Keep watch in the camp at night.',
        hint: 'Sit by the fire. Something is going to happen; you can’t stop it.',
        check: 'wait:a25-camp:night',
        scene: {
          id: 'a25-17-night',
          lines: [
            N('That night, in the camp below the hand, everyone is asleep but you.'),
            N(
              'Atreyu gets up, very quietly. He kneels by Bastian and starts to lift AURYN off his neck.',
            ),
            AT(
              'I’m sorry. It’s for you. Every wish, you lose something. If I take it, you can stop.',
              'sad',
            ),
            N('Bastian’s eyes open, and he grabs Atreyu’s wrist. Everybody wakes up at the shout.'),
            BA('Thief! She said. Xayide said you would.', 'angry'),
            AT(
              'I wasn’t stealing. I was keeping it for you. You’re forgetting everything, Bastian. You don’t even know it.',
            ),
            BA('Go away. Take your dragon and go away, and don’t come back.', 'angry'),
          ],
          choices: [
            {
              id: 'speak',
              label: 'Say Atreyu was trying to help.',
              then: [
                BA('Then he should have asked.', 'angry'),
                AT('I did ask. You didn’t hear.', 'sad'),
              ],
            },
            {
              id: 'silent',
              label: 'Stay by the fire. This is theirs.',
              then: [
                N('You stay where you are. Your Nubbin climbs into your coat and stays there.'),
              ],
            },
          ],
        },
        done: {
          id: 'a25-17-night-done',
          lines: [
            N('Atreyu climbs onto Falkor without a word. He looks at you once, from up there.'),
            AT('Stay with him. Someone has to. It can’t be me.', 'sad'),
          ],
        },
      },
    ],
    complete: {
      id: 'a25-17-complete',
      lines: [
        N(
          'Falkor lifts into the dark and is gone. For a moment you think you hear him singing, very far off, and then you don’t.',
        ),
        N(
          'Xayide is standing at the castle gate, watching the sky where they went. She is smiling again.',
        ),
        N(
          'Bastian sits by the fire till morning with the amulet in his fist, and doesn’t speak to anyone.',
        ),
      ],
    },
    rewards: [],
    sets: { 'a25-17': true },
    notes:
      'Horok, the Seeing Hand: a castle in the shape of an upturned hand, our own design. The empty armour is comic-eerie, ' +
      'never horror: helmets roll, nothing inside, no bodies. Xayide is beautiful and smooth, with one red and one green ' +
      'eye; she never threatens anyone directly. Atreyu’s attempt is shown as care, not theft: the camera stays on his ' +
      'face. Your Nubbin stays with Bastian’s company from here to A25-18.',
  },

  // ---------------------------------------------------------------- A25-18
  {
    id: 'a25-18',
    code: 'A25-18',
    title: 'The Ivory Tower Falls',
    source: src('ch. XIX–XX, the empty tower, the battle, and Atreyu’s wound'),
    audience: 'all',
    trigger: { where: WHERE, when: after('A25-17') },
    requires: ['A25-17'],
    speakers: [BASTIAN, XAYIDE, ATREYU, FALKOR],
    steps: [
      {
        id: 'a25-18-s1',
        goal: 'Climb the Ivory Tower with Bastian’s company.',
        hint: 'Go up to the magnolia pavilion at the top. She isn’t there.',
        check: 'visit:a25-tower:magnolia',
        scene: {
          id: 'a25-18-empty',
          lines: [
            N(
              'The Ivory Tower is the same white spiral. But at the top the magnolia flower is closed, and nobody answers.',
            ),
            BA('Moon Child? It’s me. It’s Bastian. I came all this way.'),
            N(
              'The pavilion is empty. Only the cushions, and a little dent in them, as if somebody had just stood up.',
            ),
            XA(
              'She has gone. She does that, you know. She leaves her people alone. A land needs someone who stays.',
              'soft',
            ),
            XA('An Emperor. Someone who saved it. Who else is there?'),
            N(
              'Bastian stands in the empty pavilion for a long time, with his hands open, as if he had dropped something.',
            ),
            BA('All right. Yes. Emperor. Why not.'),
          ],
        },
        done: {
          id: 'a25-18-empty-done',
          lines: [
            N(
              'By evening, from the top of the tower, you can see an army in the plain below. At its front, on a white dragon, rides a green boy.',
            ),
          ],
        },
      },
      {
        id: 'a25-18-s2',
        goal: 'Get through the battle at the tower’s foot.',
        hint: 'Stay low by the wall. When Falkor comes down, go to him.',
        check: 'watch:a25-battle:tower',
        scene: {
          id: 'a25-18-battle',
          lines: [
            N(
              'Atreyu has raised the people against the new Emperor. Not to hurt Bastian: to stop him before he loses himself.',
            ),
            N(
              'Bastian rides out with his company and Xayide’s empty giants. The noise is enormous, and mostly shouting.',
            ),
            N(
              'In the middle of it, Bastian and Atreyu meet. Sikanda leaps into Bastian’s hand, the way it always does.',
            ),
            AT('Bastian. Stop. Please. It’s me.', 'sad'),
            N(
              'The sword moves, and Atreyu falls back, his hand pressed to his side. Bastian stares at the sword as if it were somebody else’s.',
            ),
            N(
              'Falkor comes down out of the smoke, scoops Atreyu up in his paws, and is away over the wall.',
            ),
            N(
              'Behind you, the Ivory Tower is burning. Nobody meant it to, but it burns anyway, white into grey.',
            ),
          ],
          choices: [
            {
              id: 'falkor',
              label: 'Run after Falkor.',
              then: [
                N(
                  'You run. Your Nubbin runs ahead of you, flat out, the thunderstorm run, and leaps for the tip of Falkor’s tail.',
                ),
              ],
            },
            {
              id: 'look',
              label: 'Look back once at Bastian.',
              then: [
                N(
                  'Bastian is standing alone in the smoke, with the sword still in his hand. He looks very young.',
                ),
                N('Then you run.'),
              ],
            },
          ],
        },
        done: {
          id: 'a25-18-battle-done',
          lines: [
            N(
              'Falkor circles low, once, for you, and you grab his fur. Your Nubbin is already behind his ear, waiting, fur on end.',
            ),
          ],
        },
      },
      {
        id: 'a25-18-s3',
        goal: 'Press your hands on Atreyu’s wound until Falkor lands.',
        hint: 'Kneel by Atreyu on Falkor’s back. Keep your hands where they are.',
        check: 'sit:a25-atreyu:wound',
        scene: {
          id: 'a25-18-wound',
          lines: [
            N(
              'On Falkor’s back, high above the clouds, Atreyu is lying very still with his hand over his side.',
            ),
            N(
              'You put your hands over his hand and press, the way you’d hold a door shut in the wind.',
            ),
            AT('It’s nothing. It’s fine. It’s just a scratch.'),
            N('He is lying, and you both know it, and neither of you says so.'),
            FA('Hold on, little hunter. I know a place. Quiet, and warm. Hold on for me.', 'sad'),
            N(
              'Your Nubbin lies down against Atreyu’s other side, close as it can, to keep him warm.',
            ),
            AT('He didn’t mean it. Did you see his face? He didn’t mean it at all.', 'soft'),
          ],
        },
        done: {
          id: 'a25-18-wound-done',
          lines: [
            N('Falkor lands by a quiet lake. Atreyu sleeps at last, with your coat over him.'),
            AT(
              'Go after him. Please. He’s on his own now. He’s never been any good at that.',
              'soft',
            ),
          ],
        },
      },
    ],
    complete: {
      id: 'a25-18-complete',
      lines: [
        FA(
          'I’ll stay with this one. You go with that one. Between us we’ll keep the pair of them.',
        ),
        N(
          'The Ivory Tower is a grey stump on the horizon, smoking. Far away from it, a boy is walking away from everything.',
        ),
        N(
          'You go after him. Your Nubbin looks back at Atreyu twice, and then trots to catch up with you.',
        ),
      ],
    },
    rewards: [],
    sets: { 'a25-18': true },
    notes:
      'CARE (the battle and the wound): the battle is crowd noise, banners and smoke, seen from the tower wall; nobody is ' +
      'shown struck except Atreyu, and he only falls back with his hand to his side. No blood anywhere, ever: no red on ' +
      'his clothes or Falkor’s fur. The tower burns as white smoke and grey ash, never people in it. ' +
      'MIRROR PAYOFF (a25-mirror = truth): play ATLAS_A25_VARIANTS a25-18-attic-truth straight after the ' +
      'a25-18-battle choice and before a25-18-battle-done (Bastian catches you before you reach Falkor). On yourself and notebook, nothing extra plays.',
  },

  // ---------------------------------------------------------------- A25-19
  {
    id: 'a25-19',
    code: 'A25-19',
    title: 'The Long Way Back',
    source: src(
      'ch. XX–XXV, the City of Old Emperors, the Yskálnari, Dame Aiuóla and Yor’s Minroud',
    ),
    audience: 'all',
    trigger: { where: WHERE, when: after('A25-18') },
    requires: ['A25-18'],
    speakers: [BASTIAN, ARGAX, YSKAL, AIUOLA, YOR],
    steps: [
      {
        id: 'a25-19-s1',
        goal: 'Find Bastian in the City of Old Emperors.',
        hint: 'Follow the monkey through the streets. He knows everyone, and everyone has forgotten him.',
        check: 'visit:a25-emperors:city',
        scene: {
          id: 'a25-19-emperors',
          lines: [
            N(
              'You find Bastian at the gate of a strange city. Its houses are built every which way, with stairs that go nowhere.',
            ),
            N('A little grey monkey in a cap sits on the gatepost, swinging his legs.'),
            AG(
              'Welcome, welcome. Argax. I look after the place. Somebody has to, and they certainly can’t.',
            ),
            N(
              'The streets are full of people who wander and mutter. They were all humans once, and they all wished, and wished.',
            ),
            AG(
              'Each wish took a memory. When the last one went, they couldn’t wish themselves home. They couldn’t remember where home was.',
            ),
            AG(
              'So they stay. Look: they play with dice that have letters on, in case the letters ever spell a story. They never do.',
            ),
            N(
              'Bastian watches a man throw letters in the dust, over and over. He was an Emperor once, because he wished to be.',
            ),
            BA('I’m not like that. I’m not. I still remember…', 'shock'),
            N(
              'He stops. He tries to think what he still remembers, and you watch him not be able to.',
            ),
          ],
        },
        done: {
          id: 'a25-19-emperors-done',
          lines: [
            N(
              'He walks out of the city without looking back. You walk beside him, and he doesn’t send you away.',
            ),
          ],
        },
      },
      {
        id: 'a25-19-s2',
        goal: 'Travel on with Bastian to the House of Change.',
        hint: 'Go with the Yskálnari across the sea of mist, then up to the house on the hill.',
        check: 'visit:a25-aiuola:house',
        scene: {
          id: 'a25-19-change',
          lines: [
            N(
              'On a sea of mist, you join the Yskálnari, the ship-people, who sing their boat along. None of them ever says “I”.',
            ),
            YS(
              'We are glad you are with us. We like the small one. We think it sings well.',
              'happy',
            ),
            N(
              'Bastian is happy with them for a while: one among many, with nothing to be best at. Then he wants to be someone again, and leaves.',
            ),
            N(
              'On a hill there is a house that grows and changes, like a tree that has decided to be a house. Inside is Dame Aiuóla.',
            ),
            AI(
              'Come in, come in. Sit. Eat. You look as though nobody has looked after you for years.',
              'soft',
            ),
            N(
              'Fruit grows on her as on a tree, and she feeds Bastian, and tucks him up, and loves him as if he were small.',
            ),
            N('He stays a long time. One morning he wakes up and knows what he wants most of all.'),
            BA(
              'I want to be able to love someone. I don’t think I can. I think I wished it away.',
              'sad',
            ),
            AI(
              'Then go and find out. There is a mine to the north. Bring something back from it, and you’ll know.',
            ),
          ],
          choices: [
            {
              id: 'eat',
              label: 'Eat the fruit with him.',
              then: [
                N(
                  'It tastes like the first warm day of spring. Your Nubbin eats three and has to lie down.',
                ),
              ],
            },
            {
              id: 'thank',
              label: 'Thank Dame Aiuóla for looking after him.',
              then: [
                AI(
                  'Thank me? He was hungry. That’s all. You do the same, I expect. For your little ones.',
                  'soft',
                ),
              ],
            },
          ],
        },
      },
      {
        id: 'a25-19-s3',
        goal: 'Go down into Yor’s mine with Bastian.',
        hint: 'Keep your voice down. Yor is blind and the pictures are fragile.',
        check: 'find:a25-minroud:picture',
        scene: {
          id: 'a25-19-mine',
          lines: [
            N(
              'Yor’s Minroud is a mine in the snow, worked by an old blind miner who never speaks above a whisper.',
            ),
            YO(
              'Forgotten dreams. People in your world dream, and forget, and the dreams come down here and turn to pictures.',
            ),
            YO('You may dig for one. Only one. If it’s yours, you will know.'),
            N(
              'Bastian digs for days. The pictures come out of the earth in thin, clear sheets, like frost on glass.',
            ),
            N(
              'At last he finds one: a man, frozen in a block of ice, his eyes open, looking out. Very still and very sad.',
            ),
            BA(
              'I don’t know who he is. I feel like I ought to. I feel like I ought to help him.',
              'think',
            ),
            N(
              'He doesn’t know it is his father. You do: you heard of the father’s silence in the first chapter, in red ink.',
            ),
            N(
              'Bastian holds the picture against his chest. Something goes out of his face, gently, like a lamp turned down.',
            ),
            BA('There. It’s gone. Whatever it was. I’ve only got my name left now.', 'sad'),
            N('Then, between one breath and the next, he hasn’t even got that.'),
          ],
        },
      },
    ],
    complete: {
      id: 'a25-19-complete',
      lines: [
        N(
          'A boy with a picture under his arm sits in the snow at the mouth of the mine. He doesn’t know his own name.',
        ),
        N(
          'He doesn’t cry. He just sits, the way your Nubbin sat in the reeds, and you sit down beside him.',
        ),
        N('Far off, against the white sky, something long and white is flying this way.'),
      ],
    },
    rewards: [],
    sets: { 'a25-19': true },
    notes:
      'MIRROR PAYOFF (a25-mirror): on notebook, play ATLAS_A25_VARIANTS a25-19-page-notebook straight after ' +
      'a25-19-emperors-done. On yourself, play a25-19-ask-yourself as step 3 begins, before a25-19-mine. On truth, nothing ' +
      'extra plays (he asked in A25-18). Four of the book’s places are folded into one quest, as the outline asks: the ' +
      'City of Old Emperors, the Yskálnari, Dame Aiuóla’s House of Change and Yor’s Minroud. Bastian’s father is never ' +
      'named or seen except as the picture in the ice: a still man, eyes open, gentle and sad, never frightening. Argax is ' +
      'a small grey monkey, cheerful and a little tired. The Old Emperors are dreamy, not sinister.',
  },

  // ---------------------------------------------------------------- A25-20
  {
    id: 'a25-20',
    code: 'A25-20',
    title: 'The Water of Life',
    source: src('ch. XXV–XXVI, the Water of Life and the return to the shop'),
    audience: 'all',
    trigger: { where: WHERE, when: after('A25-19') },
    requires: ['A25-19'],
    speakers: [ATREYU, FALKOR, BASTIAN, WATER, COREANDER],
    steps: [
      {
        id: 'a25-20-s1',
        goal: 'Go with Atreyu, Falkor and the boy into AURYN.',
        hint: 'Stay together. When the boy lays the amulet down, follow him in.',
        check: 'walk:a25-auryn:inside',
        scene: {
          id: 'a25-20-auryn',
          lines: [
            N(
              'Falkor lands in the snow. Atreyu slides off his back, limping a little, and walks over to the boy at the mine.',
            ),
            AT('Hello.', 'soft'),
            N(
              'The boy looks up, and doesn’t know Atreyu’s face. But he takes off the amulet, and lays it in the snow at Atreyu’s feet.',
            ),
            N('He doesn’t know why. Something in him still does.'),
            FA(
              'There. You see? Luck. It always comes round, if you wait long enough in the right sort of snow.',
              'soft',
            ),
            N(
              'The amulet grows. Its two snakes rise up, light and dark, until they make a great gold ring standing in the snow.',
            ),
            AT('Come on. All of us. Together.'),
          ],
          choices: [
            {
              id: 'hand',
              label: 'Take the boy’s other hand.',
              then: [
                N(
                  'His hand is cold from digging, and he lets you hold it. He doesn’t know why that helps, but it does.',
                ),
              ],
            },
            {
              id: 'nubbin',
              label: 'Let your Nubbin go in first.',
              then: [
                N(
                  'Your Nubbin trots into the ring without a second thought, and the light closes round it like a bath.',
                ),
              ],
            },
          ],
        },
        done: {
          id: 'a25-20-auryn-done',
          lines: [
            N(
              'Inside the ring there is a fountain, rising and falling, and the water is laughing. There is no other word for it.',
            ),
          ],
        },
      },
      {
        id: 'a25-20-s2',
        goal: 'Stand by the Water of Life with the boy.',
        hint: 'Wait at the edge. The Water asks the questions; you don’t answer them.',
        check: 'watch:a25-water:name',
        scene: {
          id: 'a25-20-water',
          lines: [
            ...Q20_WATER_OPEN,
            N('Atreyu steps up beside him and takes his hand.'),
            AT(
              'His name is Bastian Balthazar Bux. And I’ll finish his stories. Every one he left. I promise.',
            ),
            WA('Then drink, Bastian. Drink, and go home.', 'happy'),
          ],
        },
        done: {
          id: 'a25-20-water-done',
          lines: [
            N(
              'Bastian drinks, and laughs, and remembers: his father, the attic, the round boy. All of it, all at once.',
            ),
            BA('Atreyu. I’m sorry. I’m so sorry. Will I see you again?', 'sad'),
            AT('You found me once. And I found you. That’s two times already.', 'happy'),
            N(
              'Bastian fills a little flask with the water, for his father, and steps through the ring.',
            ),
          ],
        },
      },
      {
        id: 'a25-20-s3',
        goal: 'Watch from behind the bell as Bastian comes back to the shop.',
        hint: 'Stay behind the bell. He has something to say, and it’s not to you.',
        check: 'watch:a25-shop:confession',
        scene: {
          id: 'a25-20-shop',
          lines: [
            ...Q20_HOME,
            N(
              'The next day the bell rings, and Bastian comes in, round and knock-kneed and wet, and very, very brave.',
            ),
            BA(
              'I took your book. I’m sorry. I lost it. Not lost: it’s gone. I can’t give it back.',
            ),
            BA(
              'My father and I talked last night. All night. He cried, and then he laughed. We haven’t done either for ages.',
              'happy',
            ),
            CO('Hm. What book?'),
            BA('Copper silk. Two snakes on the cover. It was on your chair.'),
            N(
              'Coreander looks at him over his spectacles for a long time. Then he smiles, slowly, as if he had remembered something.',
            ),
            CO(
              'Ah. That. You went in, then. So did I, once, a long time ago. I came back with a story or two.',
            ),
            N(
              'He leans back in his armchair and fills his pipe. Then he says something in German, the way the book always did.',
            ),
            CO(LIFT_REFRAIN),
            CO(OUR_REFRAIN),
            ...Q20_COREANDER,
          ],
        },
      },
    ],
    complete: {
      id: 'a25-20-complete',
      lines: [
        N(
          'Bastian goes. He runs out of the shop past you, so close he brushes your sleeve, and stops dead in the doorway.',
        ),
        N('He looks right at the bell, where you are. For a second you are sure he sees you.'),
        BA('Thanks. Whoever you are. For liking him.', 'happy'),
        N(
          'Then he’s gone, running home in the rain, knock-kneed and quick, the bell ringing behind him.',
        ),
        N(
          'Nova’s atlas closes softly. When you open the cottage loft that evening, there’s a reading lamp up there that wasn’t before.',
        ),
      ],
    },
    rewards: [
      {
        id: 'a25-attic-nook',
        kind: 'feature',
        label: 'The Attic Nook',
        description:
          'The cottage loft gains an old grey blanket, a reading lamp that shines red on one side and green on the other, and a stack of books. Nubbins climb up and sit with you while you read.',
      },
      {
        id: 'a25-notebook-page',
        kind: 'decor',
        label: 'The Notebook Page',
        description:
          'A page torn from your notebook, pinned to the loft beam. Bastian’s neat pencil says “Thank you” at the bottom, under your words. (If you kept it for him.)',
      },
    ],
    sets: { 'a25-20': true, 'a25-done': true },
    childLines: {
      'a25-20-shop#10':
        'It’s what the book always said, in German, whenever a tale had to wait for another day.',
      'a25-20-shop#11': 'Some stories have to wait their turn. That’s all right. They keep.',
    },
    notes:
      'ASH (reads s6Done, read-only): if s6Done is set, play ATLAS_A25_VARIANTS a25-20-water-ash in place of a25-20-water ' +
      '(same check). Your Nubbin whistles the three notes (low, high, a little one, like a question: S6’s motif, as the ' +
      'whistle emote sound, played very softly); Atreyu looks at it, then says the name. Atreyu still says it; the Nubbin ' +
      'only asks. Without s6Done the base scene plays as the book does. ' +
      'LIFTED TEXT: a25-20-shop#10 is the refrain in Ende’s German (Thienemann 1979), spoken by Coreander; #11 is our own ' +
      'English. Coreander saying he never owned the book is our own wording. ' +
      'THE LAST PAGE (a25-mirror): the complete scene shown, a25-20-complete, is for truth. For yourself play ' +
      'ATLAS_A25_VARIANTS a25-20-complete-yourself; for notebook, a25-20-complete-notebook. ' +
      'REWARDS: the Attic Nook is a Grove feature in the cottage loft: the two-colour lamp (red one side, green the ' +
      'other, as the book is printed), the blanket and the books; reading from the loft shelf makes nearby Nubbins climb ' +
      'up and sit with you (idle behaviour, unlimited, no stat reward). The Notebook Page is given only on notebook, and ' +
      'is pinned to the loft beam. GROVE: if s6Done, play a25-grove-ember the next time you visit Ember after atlasDone(' +
      "'A25'). SIM: the Attic Nook reads atlasDone('A25') and the Atlas flag a25-mirror (read-only, for the page).",
  },
];

// =================================================================== variants

/**
 * Variant scenes chosen by flags or Grove state. Each quest’s notes say which scene each replaces.
 *   s6Done (Grove, read-only): a25-13-empress-ash, a25-20-water-ash, a25-grove-ember.
 *   s24Done (Grove, read-only): a25-margin-hazel.
 *   a25-mirror (A25-15): a25-16-worry-yourself, a25-16-worry-notebook, a25-18-attic-truth,
 *     a25-19-page-notebook, a25-19-ask-yourself, a25-20-complete-yourself, a25-20-complete-notebook.
 */
export const ATLAS_A25_VARIANTS: Scene[] = [
  // ---------------------------------------------------------------- A25-13, step 1 (s6Done)
  {
    id: 'a25-13-empress-ash',
    lines: [
      ...Q13_OPEN,
      N('Then she looks past Atreyu, at your Nubbin, and then at you, for a long moment.'),
      EM(
        'You know about names. A girl whistled one back to someone, in a kitchen, with one lamp lit.',
        'soft',
      ),
      EM(
        'Three notes. Low, high, and a little one. I heard it from here. Everyone here hears a name when it’s given back.',
      ),
      N(
        'Your Nubbin comes out from behind your knee and stands up very straight, as if it has been introduced.',
      ),
      ...Q13_CLOSE,
    ],
  },
  // ---------------------------------------------------------------- A25-16, step 2 (a25-mirror)
  {
    id: 'a25-16-worry-yourself',
    lines: [
      FA('It’s you! And the little one! Lucky, lucky, lucky. I said we’d find you.', 'happy'),
      N(
        'Atreyu looks at Bastian for a long time. He has heard of the new hero, and worked out who it is.',
      ),
      AT('You’re the one who gave her the name. You’re Bastian. Thank you.', 'soft'),
      AT(
        'Tell me about your world. Your school. Your father. I want to know where the name came from.',
      ),
      BA('My… school. There was a school. There was…', 'think'),
      N('He can’t find it. He looks at you, quickly, the way people look for help across a room.'),
      BA(
        'You were there. You said I looked like myself. Why didn’t you tell me what that was?',
        'angry',
      ),
      N('He stalks off to look at Falkor’s scales. Atreyu watches him go.'),
      AT(
        'Every wish he makes, something goes. He doesn’t even know what. Help me watch him.',
        'think',
      ),
    ],
  },
  {
    id: 'a25-16-worry-notebook',
    lines: [
      FA('It’s you! And the little one! Lucky, lucky, lucky. I said we’d find you.', 'happy'),
      N(
        'Atreyu looks at Bastian for a long time. He has heard of the new hero, and worked out who it is.',
      ),
      AT('You’re the one who gave her the name. You’re Bastian. Thank you.', 'soft'),
      AT('Tell me about your world. Where you come from. What you were like.'),
      BA(
        'Oh, much the same. It doesn’t matter. Come and see what I can do with this sword.',
        'happy',
      ),
      N(
        'Your hand goes to your inside pocket, where the folded page is. Atreyu sees it go there, and says nothing.',
      ),
      AT(
        'Every wish he makes, something goes. He doesn’t even know what. Whatever you’ve got in there, keep it safe.',
        'think',
      ),
    ],
  },
  // ---------------------------------------------------------------- A25-18, after the battle (truth)
  {
    id: 'a25-18-attic-truth',
    lines: [
      N(
        'Before you can reach Falkor, someone catches your sleeve in the smoke. It’s Bastian, with soot on his face.',
      ),
      BA(
        'You. You told me something, once. About an attic. I was round, and I read there. What was it like?',
        'sad',
      ),
      BA(
        'I can’t remember it. I’ve tried. I can remember you saying it, but not the thing itself.',
      ),
    ],
    choices: [
      {
        id: 'cold',
        label: '“It was cold, and it rained, and you were happy.”',
        then: [
          BA('Happy. In the cold. Huh.', 'think'),
          N('He lets go of your sleeve. You run for Falkor.'),
        ],
      },
      {
        id: 'candle',
        label: '“You had one candle, and you cried for a horse.”',
        then: [
          BA('Artax. I cried for Artax.', 'soft'),
          N('He looks as if he has found a coin in an old coat. Then he lets go, and you run.'),
        ],
      },
    ],
  },
  // ---------------------------------------------------------------- A25-19, after step 1 (notebook)
  {
    id: 'a25-19-page-notebook',
    lines: [
      N(
        'Outside the city gate, you take the folded page from your pocket and read it to him, out loud.',
      ),
      Y(
        '“A round boy in an old grey blanket, knock-kneed, reading by candlelight in a school attic. He cried for Artax.”',
      ),
      N('Bastian listens all the way through. Then he shakes his head.'),
      BA('That can’t have been me. I’d remember crying. Wouldn’t I?', 'think'),
      N('He holds the page a moment longer than he needs to. Then he gives it back.'),
      BA('Keep it, then.', 'soft'),
    ],
  },
  // ---------------------------------------------------------------- A25-19, before step 3 (yourself)
  {
    id: 'a25-19-ask-yourself',
    lines: [
      N('At the top of the mine shaft, in the blowing snow, Bastian stops and turns to you.'),
      BA(
        'Back at the lion’s. I asked you if I always looked like this. You didn’t really say. What did I look like?',
      ),
    ],
    choices: [
      {
        id: 'tell',
        label: 'Tell him now: round, and plain, and reading in an attic, and you liked him.',
        then: [
          N('You tell him. All of it: the blanket, the candle, the sandwich he saved for later.'),
          BA('I don’t remember. But it sounds like a good boy. I hope I was him.', 'soft'),
          N('It’s late. It counts.'),
        ],
      },
    ],
  },
  // ---------------------------------------------------------------- A25-20, step 2 (s6Done)
  {
    id: 'a25-20-water-ash',
    lines: [
      ...Q20_WATER_OPEN,
      N(
        'In the quiet, your Nubbin whistles. Very softly: low, high, and a little one, like a question.',
      ),
      N(
        'Atreyu looks down at it. Then he looks at the boy, and steps up beside him and takes his hand.',
      ),
      AT(
        'His name is Bastian Balthazar Bux. And I’ll finish his stories. Every one he left. I promise.',
      ),
      WA('Then drink, Bastian. Drink, and go home.', 'happy'),
    ],
  },
  // ---------------------------------------------------------------- A25-20, the last page (a25-mirror)
  {
    id: 'a25-20-complete-yourself',
    lines: [
      N(
        'Bastian goes out slowly into the rain. He doesn’t hurry; there’s nowhere he’d rather be than walking home.',
      ),
      N(
        'As he passes the window, you can see his lips moving. He is saying his own name under his breath, all three parts.',
      ),
      BA('Bastian. Balthazar. Bux.', 'soft'),
      N('He says it like something he had lost down the back of a sofa and found again.'),
      N(
        'Nova’s atlas closes softly. When you open the cottage loft that evening, there’s a reading lamp up there that wasn’t before.',
      ),
    ],
  },
  {
    id: 'a25-20-complete-notebook',
    lines: [
      N('You put your hand in your inside pocket. The folded page is gone.'),
      N(
        'By the door, Bastian stops, frowning, and takes something out of his own pocket. A folded page, torn from a notebook.',
      ),
      N(
        'He unfolds it and reads your handwriting. He reads it twice, with his lips moving, and then he smiles.',
      ),
      BA('Huh. That was me.', 'soft'),
      N(
        'He folds it back up very carefully along the same creases, and puts it away, and goes home in the rain.',
      ),
      N(
        'That evening, in your cottage loft, there is a reading lamp, and the page is pinned to the beam. Someone has written “Thank you” under it.',
      ),
    ],
  },
  // ---------------------------------------------------------------- Hazel’s margin note (s24Done)
  {
    id: 'a25-margin-hazel',
    lines: [
      N(
        'Beside the picture of the amulet, low in the margin, there is a pencil note you have never noticed. You know the hand.',
      ),
      N('“Never went. Read it twice.”'),
      N(
        '“You lose a bit of yourself with every wish. I’d have printed that on the cover.”',
        'soft',
      ),
      N('Your Nubbin looks at the two snakes for a long time, and then sits on them.'),
    ],
  },
  // ---------------------------------------------------------------- In the Grove, after the page (s6Done)
  {
    id: 'a25-grove-ember',
    lines: [
      N('Ember is on her doorstep, shelling peas. Ash is lying across her feet, grey and content.'),
      N('You tell her about the boy who forgot his own name, and the friend who said it for him.'),
      E('Names. Everyone thinks they’re words.', 'think'),
      N(
        'She whistles three notes without looking up: low, high, a little one. Ash’s ear turns, the way it always does now.',
      ),
    ],
  },
];

// =================================================================== flags and checks

/** Every flag this line sets (Atlas save only). It reads s6Done and s24Done, and writes no Grove flag. */
export const ATLAS_A25_FLAGS: string[] = [
  'a25-01',
  'a25-02',
  'a25-03',
  'a25-04',
  'a25-05',
  'a25-06',
  'a25-07',
  'a25-08',
  'a25-09',
  'a25-10',
  'a25-11',
  'a25-12',
  'a25-13',
  'a25-14',
  'a25-15',
  'a25-16',
  'a25-17',
  'a25-18',
  'a25-19',
  'a25-20',
  'a25-done', // A25-20: the whole page; read by atlasDone('A25') for the Attic Nook and the Grove scenes
  'a25-mirror', // truth | yourself | notebook (a25-15-mirror): A25-16, A25-18, A25-19, A25-20 and the Attic Nook
];

export const ATLAS_A25_CHECKS: string[] = [
  'explore:a25-shop:bell',
  'walk:a25-street:school',
  'sit:a25-attic:mats',
  'visit:a25-forest:campfire',
  'walk:a25-forest:edge',
  'climb:a25-tower:hall',
  'puzzle:a25-maps:grassy-sea',
  'escort:a25-cairon:camp',
  'watch:a25-atreyu:amulet',
  'talk:a25-artax:saddle',
  'walk:a25-swamp:crossing',
  'wait:a25-swamp:artax',
  'sit:a25-reeds:nubbin',
  'climb:a25-morla:shell',
  'talk:a25-morla:oracle',
  'explore:a25-mountains:chasm',
  'choose:a25-ygramul:sleeve',
  'collect:a25-herbs:rocks',
  'talk:a25-engywook:telescope',
  'watch:a25-sphinxes:gate',
  'inspect:a25-mirror:gate',
  'wait:a25-gate:no-key',
  'explore:a25-oracle:palace',
  'puzzle:a25-rhyme:uyulala',
  'climb:a25-falkor:back',
  'watch:a25-winds:storm',
  'explore:a25-sea:search',
  'find:a25-auryn:sea',
  'watch:a25-gmork:spook-city',
  'carry:a25-atreyu:falkor',
  'talk:a25-empress:magnolia',
  'climb:a25-wandering:egg-house',
  'sit:a25-oldman:book',
  'watch:a25-attic:name',
  'wait:a25-dark:sand',
  'watch:a25-perelin:grow',
  'visit:a25-goab:lion',
  'choose:a25-mirror:bastian',
  'watch:a25-amarganth:tournament',
  'talk:a25-atreyu:amarganth',
  'visit:a25-horok:gate',
  'talk:a25-xayide:hall',
  'wait:a25-camp:night',
  'visit:a25-tower:magnolia',
  'watch:a25-battle:tower',
  'sit:a25-atreyu:wound',
  'visit:a25-emperors:city',
  'visit:a25-aiuola:house',
  'find:a25-minroud:picture',
  'walk:a25-auryn:inside',
  'watch:a25-water:name',
  'watch:a25-shop:confession',
];
