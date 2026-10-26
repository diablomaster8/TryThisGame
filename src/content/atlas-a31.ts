/**
 * Atlas campaign, page A31: The Hero Twins (Part M, rank 40). Seventeen quests, A31-1 to A31-17.
 *
 * SOURCE. The Popol Vuh, the K’iche’ Maya book of the community, written down in K’iche’ in Latin
 * letters by K’iche’ authors in the 1550s and copied (with a Spanish translation) by the friar
 * Francisco Ximénez around 1701. Public domain. It is a sacred and living text for many K’iche’
 * people; Guatemala’s Ministry of Culture declared it intangible cultural heritage in 2012. The
 * page presents it that way: a book still read, from a people still here, told by a grandmother in
 * a real kitchen today. No “lost civilisation” talk anywhere. Rights holder: none (public domain);
 * the frame family and the K’iche’ advisers (see CARE NOTES) are the authority over this page.
 *
 * AUDIENCE. 'all' (Rated All, with care). Deaths are told, not shown. Every lifted line has a
 * childLines replacement. The Learning Grove versions (both bands, softened as the outline asks)
 * are a separate task and are not in this file.
 *
 * FRAME. Nova’s atlas falls open at a hearth, a stack of tortillas and a green mountain. You and
 * your Nubbin step into a kitchen in the highlands of Guatemala, today. A K’iche’ grandmother is
 * making tortillas; her granddaughter wants the old story, and interrupts it. The smoke rises, and
 * you go in. You are a listener, then a helper in Xmucane’s house (carrying water, hoeing,
 * watching). The twins keep their story. Your Nubbin makes friends with every small animal they
 * meet (the rat, the mosquito, the rabbit) and never speaks. In this page the source’s animals talk
 * (the owls, the rat, the mosquito, the louse, the toad, the falcon, the gourd), as the canon allows
 * on Atlas pages. The grandmother is heard over the page as a voice-over throughout.
 *
 * NAMES. On screen the page uses the familiar forms below. K’iche’ advisers choose the final
 * spellings (for example Junajpu and Xb’alanke in modern K’iche’), with the familiar forms as
 * subtitles if they agree. Every name is a plain string, so a find-and-replace is enough. Modern
 * forms below are for the advisers to confirm, not settled:
 *   Hunahpu (Junajpu) · Xbalanque (Xb’alanke) · Hun Hunahpu (Jun Junajpu) · Vucub Hunahpu
 *   (Wuqub’ Junajpu) · Xquic (Xkik’) · Xmucane (Ixmukane) · One Death (Jun Kame) · Seven Death
 *   (Wuqub’ Kame) · Xibalba (Xib’alb’a) · Seven Macaw (Wuqub’ Kaqix) · Zipacna (Sipakna) ·
 *   Earthquake (Kab’raqan) · One Monkey (Jun B’atz’) · One Artisan (Jun Chowen) · Xulu and Pacam.
 *
 * GROVE FLAGS READ (read-only; the Atlas never writes a Grove flag):
 *   - s3Done (S3: the Sun and Moon ribbons).
 *       true:  your Nubbin wears the Sun and Moon ribbons on this page. a31-01-ribbons (insert after
 *              a31-01-page-done: the girl notices them); a31-16-ribbons (insert after the rise, on
 *              either branch: she points at them, two colours stitched down the middle); and in
 *              the Grove, once, a31-grove-byte (Byte’s line, exactly as the outline gives it).
 *       false: no ribbons are drawn, and none of those three scenes plays.
 *   - s24Done (S24: Hazel’s margin notes). a31-margin-hazel, its text exactly as the outline gives
 *     it, beside the empty seats of Xibalba (see A31-15’s notes).
 *
 * FLAGS WRITTEN (Atlas save only, all prefixed a31-):
 *   - a31-01 … a31-17: each quest on completion. a31-done: the whole page (A31-17), read by
 *     atlasDone('A31').
 *   - a31-corn = stay | go (A31-10, a31-10-corn). THE SIGNATURE CHOICE. 'go' plays the default
 *     scenes of A31-11 to A31-16 (you go down with the twins and help as the animals help).
 *     'stay' plays the -stay variants (you stay with Xmucane and watch the corn: rule three as a
 *     whole quest line, never quoted). It pays off in A31-16 (the sunrise from the ballcourt or from
 *     Xmucane’s doorway, six quests later) and A31-17 (the ear of corn: golden or green, seven
 *     quests later), and in the Grove (the corn on the cottage’s middle beam).
 *   - a31-rat = share | twins | come (A31-9, a31-09-roof). Pays off in A31-13: share, the rat
 *     fetches the coati (a31-13-rat-coati); come, the rat runs the lords ragged (a31-13-rat-court);
 *     twins, the rabbit does it alone (the default). On the stay branch the falcon tells it
 *     (a31-13-rat-coati-told, a31-13-rat-court-told).
 *
 * LIFTED TEXT (public domain). Lewis Spence, The Popol Vuh: The Mythic and Heroic Sagas of the
 * Kichés of Central America (London: David Nutt, 1908), Project Gutenberg eBook #56550. Each
 * passage below was checked word for word against that eBook’s text on 2026-10-15. Spence
 * summarises and partly translates Brasseur de Bourbourg’s French of 1861. On screen the atlas
 * prints each one in its margin “in brown type”, as a line from an old English book, so the
 * grandmother’s voice stays her own. Adaptations are the outline’s.
 *   1. Q3, a fragment, “Hunhun-Ahpu” shown as “Hun Hunahpu”: LIFT_GOURDS, a31-03-tree#2.
 *   2. Q4, a fragment, “the head of Hunhun-Ahpu” shown as “the gourd”: LIFT_PALM, a31-04-xquic#6.
 *   3. Q14, whole sentence, verbatim: LIFT_RIVER, a31-14-river#1 (go) or a31-14-river-stay#6 (stay).
 *   4. Q15, a fragment, verbatim: LIFT_FORBIDDEN, a31-15-complete#1.
 *   5. NOT USED. “who now mounted to heaven and became the sun and moon,”: in Spence this clause
 *      is about the twins’ father and uncle, not the twins. Quoting it over the twins would put
 *      words in Spence’s mouth, so Q16 says it in our own words.
 *   6. Q16, a fragment, “the four hundred youths” shown as “the Four Hundred Boys”: LIFT_STARS,
 *      a31-16-rise#6 (go) or a31-16-rise-stay#5 (stay).
 * Everything else is our own retelling. Spence says the twins plant canes; translations from the
 * K’iche’ say ears of corn, and the page follows them (the grandmother says so in a31-10-corn).
 * No later translation (Goetz and Morley, Tedlock, Christenson) is quoted.
 *
 * CARE NOTES.
 *   - K’iche’ advisers (and K’iche’ writers or storytellers) read this script before it is final,
 *     and draw the frame family with us: a real kitchen, not a costume. The grandmother and the
 *     granddaughter are unnamed until the advisers name them. They speak English on the page;
 *     the advisers may give them K’iche’ or Spanish words (none are guessed here).
 *   - WHICH TWIN BECOMES THE SUN is the advisers’ decision. The script never says. The slot is
 *     WHICH_SUN (the grandmother: her grandmother told her which, and one day she’ll tell the girl).
 *     Replace that one line if the advisers want it named.
 *   - No ceremony on screen. The grandmother tells a story; she performs nothing. Xquic asks the
 *     guardians of food in one plain line. Xmucane puts a little copal on the coals (stay branch,
 *     a31-12-dark-stay) because her mother did, with no ritual words. Daykeepers and the calendar
 *     are not mentioned; add them only if the advisers ask.
 *   - Told, not shown: the fathers’ fate over an empty road (A31-3); Hunahpu’s head as a bat flying
 *     off and a squash arriving (A31-13); the oven as a glow (A31-14); the sacrifice show as a
 *     curtain (A31-15). Seven Macaw loses his shine, not his life; Hunahpu’s arm is taken and
 *     returned; Zipacna and Earthquake become part of the hills. The half-brothers become monkeys
 *     and stay artists. An optional parent note plays before A31-13 (its notes).
 *   - Ball, not war. The game is a game throughout, and the reward is a game with no hands.
 *   - The third rule is acted out on the stay branch (A31-11 to A31-16), never quoted or named.
 */
import type { Line, Mood, Scene } from '../config/story';
import type { Quest, Speaker } from './types';

// ------------------------------------------------------------------ helpers

const say =
  (who: string) =>
  (text: string, mood?: Mood): Line =>
    mood ? { who, text, mood } : { who, text };

/** A source or frame character. */
const sp = (id: string, name: string, basedOn: string): Speaker => ({ id, name, kind: 'other', basedOn });

const WHERE = 'Nova’s atlas: the Hero Twins page (Atlas campaign)';
const after = (code: string) => `Any time after ${code}, from Nova’s atlas.`;
const src = (beat: string) => `Popol Vuh (K’iche’ Maya; written down in the 1550s, Ximénez copy c. 1701), retold: ${beat}`;
const PV = 'Popol Vuh';

// ------------------------------------------------------------------ speakers

const GRAN = sp('a31-gran', 'Grandmother', 'A K’iche’ Maya grandmother in the Guatemalan highlands today, the storyteller (our own; drawn and named with the advisers)');
const GIRL = sp('a31-girl', 'Granddaughter', 'Her granddaughter, about nine, who interrupts (our own; drawn and named with the advisers)');
const HUNAHPU = sp('a31-hunahpu', 'Hunahpu', `Hunahpu (Junajpu), one of the Hero Twins (${PV})`);
const XBALANQUE = sp('a31-xbalanque', 'Xbalanque', `Xbalanque (Xb’alanke), one of the Hero Twins (${PV})`);
const HUN = sp('a31-hun', 'Hun Hunahpu', `Hun Hunahpu (Jun Junajpu), the twins’ father (${PV})`);
const VUCUB = sp('a31-vucub', 'Vucub Hunahpu', `Vucub Hunahpu (Wuqub’ Junajpu), the twins’ uncle (${PV})`);
const XQUIC = sp('a31-xquic', 'Xquic', `Xquic (Xkik’), daughter of a lord of Xibalba, the twins’ mother (${PV})`);
const XMUCANE = sp('a31-xmucane', 'Xmucane', `Xmucane (Ixmukane), the twins’ grandmother (${PV})`);
const OWLS = sp('a31-owls', 'Owls', `The four owl messengers of Xibalba, speaking as one (${PV})`);
const GOURD = sp('a31-gourd', 'The Gourd', `The head of Hun Hunahpu in the calabash tree, here only ever “the gourd” (${PV})`);
const MONKEY = sp('a31-monkey', 'One Monkey', `One Monkey (Jun B’atz’), the twins’ older half-brother (${PV})`);
const ARTISAN = sp('a31-artisan', 'One Artisan', `One Artisan (Jun Chowen), the twins’ older half-brother (${PV})`);
const MACAW = sp('a31-macaw', 'Seven Macaw', `Seven Macaw (Wuqub’ Kaqix), the false sun (${PV})`);
const ELDERS = sp('a31-elders', 'Old Couple', `The old grandparents who pretend to be healers, Great White Peccary and Great White Coati (${PV})`);
const ZIPACNA = sp('a31-zipacna', 'Zipacna', `Zipacna (Sipakna), Seven Macaw’s first son (${PV})`);
const QUAKE = sp('a31-earthquake', 'Earthquake', `Earthquake (Kab’raqan), Seven Macaw’s second son (${PV})`);
const RAT = sp('a31-rat', 'Rat', `The rat who tells the twins where their father’s gear is (${PV})`);
const MOSQUITO = sp('a31-mosquito', 'Mosquito', `The mosquito made from a hair of Hunahpu’s shin, here surprisingly polite (${PV})`);
const LOUSE = sp('a31-louse', 'Louse', `The louse who carries Xmucane’s message (${PV})`);
const TOAD = sp('a31-toad', 'Toad', `The toad who carries the louse (${PV})`);
const FALCON = sp('a31-falcon', 'Falcon', `The falcon who carries the message to the twins; here also the stay branch’s messenger (${PV}, extended)`);
const ROAD = sp('a31-road', 'Black Road', `The black road at the crossroads, which speaks (${PV})`);
const ONEDEATH = sp('a31-one-death', 'One Death', `One Death (Jun Kame), a high lord of Xibalba (${PV})`);
const SEVENDEATH = sp('a31-seven-death', 'Seven Death', `Seven Death (Wuqub’ Kame), a high lord of Xibalba (${PV})`);
const LORDS = sp('a31-lords', 'Lords of Xibalba', `The other lords of Xibalba and their guards (${PV})`);

const N = say('narrator');
const Y = say('you');
const BY = say('byte');
const GM = say('a31-gran');
const GD = say('a31-girl');
const HP = say('a31-hunahpu');
const XB = say('a31-xbalanque');
const HH = say('a31-hun');
const VH = say('a31-vucub');
const XQ = say('a31-xquic');
const XM = say('a31-xmucane');
const OW = say('a31-owls');
const GO = say('a31-gourd');
const OM = say('a31-monkey');
const OA = say('a31-artisan');
const SM = say('a31-macaw');
const OC = say('a31-elders');
const ZP = say('a31-zipacna');
const EQ = say('a31-earthquake');
const RT = say('a31-rat');
const MQ = say('a31-mosquito');
const LS = say('a31-louse');
const TD = say('a31-toad');
const FA = say('a31-falcon');
const RD = say('a31-road');
const OD = say('a31-one-death');
const SD = say('a31-seven-death');
const LD = say('a31-lords');

// ------------------------------------------------------------------ lifted text (public domain; checked 2026-10-15)

/** Spence 1908, PG #56550. Fragment; “Hunhun-Ahpu” shown as “Hun Hunahpu”. */
const LIFT_GOURDS = 'The head of Hun Hunahpu was, however, suspended from a tree, which speedily became covered with gourds…';
/** Spence 1908, PG #56550. Fragment; “the head of Hunhun-Ahpu” shown as “the gourd”. */
const LIFT_PALM = '…the maiden stretched out her hand, and the gourd spat into the palm.';
/** Spence 1908, PG #56550. Whole sentence, verbatim. */
const LIFT_RIVER = 'Their bones were beaten to powder and thrown into the river, where they sank, and were transformed into young men.';
/** Spence 1908, PG #56550. Fragment, verbatim (of the lords of Xibalba). */
const LIFT_FORBIDDEN = 'The game of ball was forbidden them, they were to perform menial tasks…';
/** Spence 1908, PG #56550. Fragment; “the four hundred youths” shown as “the Four Hundred Boys”. */
const LIFT_STARS = '…whilst the Four Hundred Boys slain by Zipacna became the stars.';

const margin = (lift: string) => N(`In the atlas’s margin, in brown type: “${lift}”`);

/** Child replacements for the lifted lines (original words). */
const CHILD_GOURDS = 'In the margin the atlas says: the tree by the road was suddenly full of round green gourds.';
const CHILD_PALM = 'In the margin the atlas says: she held out her hand, and something magic happened in it.';
const CHILD_RIVER = 'In the margin the atlas says: the river kept them safe, and they came back as boys again.';
const CHILD_FORBIDDEN = 'In the margin the atlas says: the lords could never play ball again, and had to do the chores instead.';
const CHILD_STARS = 'In the margin the atlas says: and the Four Hundred Boys went up too, and became the stars.';

// ------------------------------------------------------------------ shared pieces

/**
 * ADVISERS: which twin becomes the Sun is the K’iche’ advisers’ decision. This line is the only
 * place it would be said. Until they decide, the grandmother keeps it for later, as tellers do.
 */
const WHICH_SUN = GM('My grandmother told me which one is which. One day I’ll tell you. That’s how it goes.', 'soft');

/** A31-16: the soft edge that ends both versions of the rise. */
const SOFT_EDGE = N('The page starts to go soft round the edges, like a kitchen full of smoke.');

/** A31-17: the way home, before the corn (both branches). */
const HOME_START: Line[] = [
  N('The smoke rises past the beam, and the kitchen goes soft, and you are back at your own table with the atlas open.'),
  N('There is a black rubber ball on the floor. Your Nubbin is already sitting on it.'),
];
const HOME_END: Line[] = [
  N('You hang it from the middle beam of the cottage. It turns a little in the draught from the door.'),
  N('Out by the pond, the Nubbins come to look at the new ball. Nobody uses hands, and nobody has to be told.'),
];

// =================================================================== THE HERO TWINS

export const ATLAS_A31: Quest[] = [
  // ---------------------------------------------------------------- A31-1
  {
    id: 'a31-01',
    code: 'A31-1',
    title: 'The Hearth',
    source: src('the frame: a K’iche’ kitchen today, and the story asked for'),
    audience: 'all',
    trigger: { where: WHERE, when: 'Any time once Nova’s atlas is in the Grove; the first quest on the page.' },
    speakers: [GRAN, GIRL],
    steps: [
      {
        id: 'a31-01-s1',
        goal: 'Step into the kitchen on the atlas page.',
        hint: 'Put your hand on the warm page, then go in through the doorway.',
        check: 'visit:a31-kitchen:highlands',
        scene: {
          id: 'a31-01-page',
          lines: [
            N('Nova’s atlas falls open at a page that smells of woodsmoke. A hearth, a stack of tortillas, and a green mountain with cloud on its shoulder.'),
            N('There is no title on this one. Just a kitchen.'),
            N('You put your hand flat on the page to hold it still, and it is warm. Then the warmth is a fire, and you are standing in a doorway in the highlands of Guatemala.'),
            N('A grandmother sits by the fire, patting dough into rounds and laying them on a clay griddle. Pat, pat, turn.'),
            N('A girl of about nine is doing her homework at the table, badly, because she keeps watching the door.'),
            GD('Grandmother. Someone’s at the door. With a… what is that?', 'shock'),
            GM('A guest, and a small guest. Come in, both of you. The cold gets in.', 'happy'),
            N('Your Nubbin goes straight to the fire and sits down in front of it, as if it has been coming here for years.'),
            GM('That one knows a good kitchen.'),
          ],
          choices: [
            {
              id: 'stool',
              label: 'Sit on the low stool she points to.',
              then: [GM('Good. Now you’re the right height for a story.')],
            },
            {
              id: 'help',
              label: 'Offer to help with the tortillas.',
              then: [
                N('You try. Yours comes out the shape of a country nobody would want to live in.'),
                GM('You eat that one yourself. That’s the rule.', 'happy'),
              ],
            },
            {
              id: 'warm',
              label: 'Let your Nubbin warm its paws.',
              then: [N('It holds its paws to the fire, then turns round and warms its back, then its front again, very seriously.')],
            },
          ],
        },
        done: {
          id: 'a31-01-page-done',
          lines: [
            GD('Is it a dog?'),
            GM('It’s a guest. You don’t ask a guest what it is. You give it a tortilla.'),
            N('Your Nubbin is given a tortilla, warm from the griddle. It holds it in both paws like a letter from home.'),
          ],
        },
      },
      {
        id: 'a31-01-s2',
        goal: 'Sit by the hearth and listen to the old story.',
        hint: 'Sit on the low stool by the fire and watch the smoke go up.',
        check: 'sit:a31-stool:hearth',
        scene: {
          id: 'a31-01-story',
          lines: [
            GD('Grandmother. Tell the old one. The twins one. With the ball.', 'happy'),
            GM('You’ve heard it a hundred times.'),
            GD('So it’s a hundred and one. Please.'),
            GM('Our people wrote it down long ago, in our own language, so it wouldn’t be lost.'),
            GM('People still read it. And grandmothers still tell it, which is better, because you can interrupt a grandmother.', 'happy'),
            GD('You can’t interrupt a book.'),
            GM('You can. It just doesn’t notice.'),
            N('She lays another tortilla on the griddle. The smoke goes up past the beam, slow and grey, and you watch it go.'),
            GM('Before the sun was the sun, there were two brothers who played ball…'),
            N('The smoke thickens, and the kitchen goes soft at the edges. You can still hear her voice, but now there is grass under your feet.'),
          ],
          choices: [
            {
              id: 'nubbin',
              label: 'Pick your Nubbin up first.',
              then: [N('You scoop it off the hearth. It is warm right through, like a loaf.')],
            },
            {
              id: 'gran',
              label: 'Keep your eyes on the grandmother.',
              then: [GM('I’m still here. I’ll be here the whole time. Go on.', 'soft')],
            },
          ],
        },
      },
    ],
    complete: {
      id: 'a31-01-complete',
      lines: [
        N('You are standing on a hillside in the early morning, in a world that is mostly still being made.'),
        N('Somewhere close, something heavy and rubbery goes thock against a wall. Then again: thock.'),
        GM('Listen. That’s them.'),
        N('Your Nubbin’s ears go up. Whatever that noise is, it wants it.'),
      ],
    },
    rewards: [],
    sets: { 'a31-01': true },
    notes:
      'OPENING: the page is a hearth, a stack of tortillas and a green mountain; the kitchen is drawn with the K’iche’ ' +
      'advisers (a real home today, not a costume). The grandmother’s voice continues as a voice-over on every later ' +
      'quest (speaker a31-gran over the page). RIBBONS (reads s3Done): if true, draw the Sun and Moon ribbons on your ' +
      'Nubbin for the whole page, and play A31_VARIANTS a31-01-ribbons straight after a31-01-page-done. ' +
      'SMOKE: the way in and out of the story is the hearth smoke thickening (a slow dither to white).',
  },

  // ---------------------------------------------------------------- A31-2
  {
    id: 'a31-02',
    code: 'A31-2',
    title: 'The Ballplayers',
    source: src('Hun Hunahpu and Vucub Hunahpu play ball, and the owls summon them'),
    audience: 'all',
    trigger: { where: WHERE, when: after('A31-1') },
    requires: ['A31-1'],
    speakers: [GRAN, HUN, VUCUB, OWLS],
    steps: [
      {
        id: 'a31-02-s1',
        goal: 'Watch the two brothers play ball.',
        hint: 'Go down the hill to the ballcourt and watch from the wall.',
        check: 'watch:a31-ballgame:fathers',
        scene: {
          id: 'a31-02-court',
          lines: [
            N('Below the hill is a ballcourt: two long sloping walls, with a strip of beaten earth between them.'),
            N('Two men are playing on it, and they are loud about it. Every point gets a shout, and every miss gets a louder one.'),
            HH('Mine! That was mine, and you know it.', 'happy'),
            VH('It hit your knee. Knees don’t count. Knees have never counted.'),
            N('They never touch the ball with their hands. They take it on the hip, the thigh, the shoulder, and it flies off heavy and black.'),
            GM('Hun Hunahpu and his brother, Vucub Hunahpu. Good players. Terrible neighbours.'),
            N('Down under the court, under the earth, a long way under, somebody is trying to sleep.'),
            N('The ball bounces off the end wall, spins once, and rolls straight towards your Nubbin.'),
          ],
          choices: [
            {
              id: 'bump',
              label: 'Let your Nubbin have a go.',
              then: [
                N('It hip-bumps the ball, and the ball does not move. Your Nubbin does, backwards, and sits down.'),
                VH('Good form. Wrong direction.', 'happy'),
              ],
            },
            {
              id: 'hands',
              label: 'Roll it back to them.',
              then: [HH('Hands! Hands on the ball!', 'shock'), VH('Leave it. Guests get one hand-ball. It’s an old rule. I made it up just now.')],
            },
          ],
        },
      },
      {
        id: 'a31-02-s2',
        goal: 'Help your Nubbin bring back the ball that went over the wall.',
        hint: 'Follow your Nubbin down the slope and carry the ball back up together.',
        check: 'carry:a31-ball:court',
        scene: {
          id: 'a31-02-fetch',
          lines: [
            N('The next shot goes high over the wall and away down the hill. Both brothers look at each other, then at your Nubbin.'),
            HH('Little one. Would you?'),
            N('Your Nubbin is already gone, bouncing down the slope after the ball, bouncing almost as well as the ball does.'),
            N('You go after it, through long grass and over a stream, and find it sitting proudly on the ball, which is nearly as big as it is.'),
            N('The ball is heavier than you expect. It’s made from tree sap, worked until it bounces, and it smells faintly of smoke.'),
            GM('People here made balls like that long before anyone else in the world had one. Remember that, when you play.'),
            N('You carry it back up between you. Your Nubbin carries the important end.'),
          ],
          choices: [
            {
              id: 'nubbin',
              label: 'Let your Nubbin hand it over.',
              then: [N('It pushes the ball up to Hun Hunahpu with its whole body. He bows to it, very low, and it bows back.')],
            },
            {
              id: 'throw',
              label: 'Throw it back over the wall.',
              then: [N('It sails over and lands with a thock. A cheer from the court: apparently that counts as a point for somebody.')],
            },
          ],
        },
      },
    ],
    complete: {
      id: 'a31-02-complete',
      lines: [
        N('Then the owls come. Four of them, out of a clear sky, and they land on the end wall in a row.'),
        OW('From the lords of Xibalba, One Death and Seven Death. You are loud. You are very loud.'),
        OW('They say: come down and play against them. Bring your gear.'),
        HH('They want a game. Good. We’re the best there is.', 'happy'),
        N('That evening the brothers tie their ball and gear up in the roof of their mother Xmucane’s house, where she won’t have to look at it.'),
        N('They tell her not to worry. People always tell people that.', 'sad'),
      ],
    },
    rewards: [],
    sets: { 'a31-02': true },
    notes:
      'BALL, NOT WAR: the game is played with hips, thighs and shoulders, never hands, and it stays a game. The ball is ' +
      'drawn black and heavy (natural rubber). The gear tied in the roof is seen briefly here; A31-9 pays it off. ' +
      'The owls are four, drawn alike; one speaker id voices them together.',
  },

  // ---------------------------------------------------------------- A31-3
  {
    id: 'a31-03',
    code: 'A31-3',
    title: 'The Road Down',
    source: src('the fathers go down to Xibalba and do not come back; the calabash tree'),
    audience: 'all',
    trigger: { where: WHERE, when: after('A31-2') },
    requires: ['A31-2'],
    speakers: [GRAN, GIRL],
    steps: [
      {
        id: 'a31-03-s1',
        goal: 'Listen to the grandmother tell what happened on the road down.',
        hint: 'Stay on the empty road and let her tell it.',
        check: 'watch:a31-road:empty',
        scene: {
          id: 'a31-03-road',
          lines: [
            N('The page goes quiet. There is a road going down between rocks, and nobody on it.'),
            GM('This part I tell. You don’t need to see it.'),
            GM('They went down and down, across rivers, to a place where four roads meet.'),
            GM('The black road spoke up and said, I am the way. And they believed it, because they were in a hurry.'),
            GM('At the bottom, lords sat in a row. The brothers bowed and said good day, and the lords didn’t answer, because they were made of wood.'),
            GD('That’s the funny bit.', 'happy'),
            GM('It is. The lords of Xibalba thought so too.'),
            GM('Then they were offered a seat, and the seat was a hot stone. Then a night in a dark house, and a test nobody could win.'),
            GM('They lost every test. And they didn’t come back up.', 'sad'),
            N('The road stays empty. A little wind moves the dust on it.'),
          ],
          choices: [
            {
              id: 'sit',
              label: 'Sit down at the side of the road.',
              then: [N('You sit. Your Nubbin sits too, close enough that you can feel it breathing.')],
            },
            {
              id: 'ask',
              label: 'Ask what happened to them.',
              then: [GM('They stayed down there. That’s enough for now. The story isn’t finished with them.', 'soft')],
            },
          ],
        },
      },
      {
        id: 'a31-03-s2',
        goal: 'Look at the tree by the road.',
        hint: 'The tree full of gourds stands just off the road. Go and look; you needn’t touch.',
        check: 'inspect:a31-gourd-tree:road',
        scene: {
          id: 'a31-03-tree',
          lines: [
            N('By the side of the road there is a tree you didn’t notice before. It is heavy with round green gourds.'),
            N('Beside it, the atlas prints a line from an old book in English.'),
            margin(LIFT_GOURDS),
            GD('Grandmother. His head?', 'shock'),
            GM('Among the gourds, and you can’t tell which. The lords said nobody was to touch that tree.', 'soft'),
            GM('So of course somebody did. Eat your tortilla.'),
            N('Your Nubbin looks up into the branches for a long time. Then it pats the trunk once, the way it pats you when you’re tired.'),
          ],
          choices: [
            {
              id: 'look',
              label: 'Look for the gourd that’s different.',
              then: [N('You look, and every gourd is the same. That’s the point, you think.')],
            },
            {
              id: 'leave',
              label: 'Leave the tree be.',
              then: [N('You step back onto the road. Some things you don’t need to find.')],
            },
          ],
        },
      },
    ],
    complete: {
      id: 'a31-03-complete',
      lines: [
        N('The page turns a little, in a wind from nowhere. The road goes on being empty.'),
        GM('Hun Hunahpu had two sons already, and his mother Xmucane at home. They waited. Nobody came up the road.'),
        GD('And then?'),
        GM('And then a girl went to look at a tree she wasn’t allowed to look at. That’s how most good stories start.', 'happy'),
      ],
    },
    rewards: [],
    sets: { 'a31-03': true },
    childLines: { 'a31-03-tree#2': CHILD_GOURDS },
    notes:
      'TOLD, NOT SHOWN: the whole fate of the fathers is the grandmother’s voice over a picture of an empty road. Nothing ' +
      'of Xibalba is drawn in this quest except the tree. The gourds are ordinary round gourds; no head is ever drawn. ' +
      'The margin line is drawn as printed type in the atlas margin (brown ink, an old typeface), not as a speech box.',
  },

  // ---------------------------------------------------------------- A31-4
  {
    id: 'a31-04',
    code: 'A31-4',
    title: 'The Calabash Tree',
    source: src('Xquic and the gourd, the owls, and the heart of sap'),
    audience: 'all',
    trigger: { where: WHERE, when: after('A31-3') },
    requires: ['A31-3'],
    speakers: [GRAN, GIRL, XQUIC, GOURD, OWLS],
    steps: [
      {
        id: 'a31-04-s1',
        goal: 'Watch the girl who comes to the forbidden tree.',
        hint: 'Hide behind the rock near the tree and watch.',
        check: 'watch:a31-xquic:tree',
        scene: {
          id: 'a31-04-xquic',
          lines: [
            N('Down in Xibalba it is never quite night and never quite day. A girl comes along the road on her own, looking over her shoulder.'),
            GM('Xquic. Daughter of one of the lords. She’d heard about the tree, and she was not good at being told no.'),
            XQ('Everybody says don’t go near it. Nobody says why. If they said why, I might not go.', 'think'),
            N('She stops under the branches. You and your Nubbin are behind a rock, which is more or less hiding.'),
            XQ('Are they sweet? Would it be so terrible if I picked one?'),
            GO('They’re only round things in a tree. You don’t want them. Hold out your hand.'),
            margin(LIFT_PALM),
            GD('Ew.', 'shock'),
            GM('It’s a blessing. Blessings are often a bit ew.', 'happy'),
            XQ('It’s gone. There’s nothing in my hand.', 'shock'),
            GO('Nothing you can see. Go home. Nothing will hurt you. You’ll understand later.'),
          ],
          choices: [
            {
              id: 'hide',
              label: 'Stay hidden.',
              then: [N('You stay behind the rock. Your Nubbin, who thinks hiding is a game, keeps popping up to see if it’s won.')],
            },
            {
              id: 'show',
              label: 'Step out and walk her to the road.',
              then: [XQ('Who are you? No, don’t tell me. I’ve had enough surprises for one day.', 'think')],
            },
          ],
        },
      },
      {
        id: 'a31-04-s2',
        goal: 'Go with the owls and Xquic into the forest.',
        hint: 'Walk behind the owls through the red-barked trees.',
        check: 'escort:a31-xquic:forest',
        scene: {
          id: 'a31-04-owls',
          lines: [
            N('Some months go by in the margin. When the page settles, Xquic stands in her father’s hall, and everybody can see she is expecting a baby.'),
            GM('Her father was angry. Lords of Xibalba are always angry; it’s how you know them.'),
            GM('He told his four owls to take her out to the forest and bring back her heart in a bowl. The owls didn’t like it at all.'),
            N('You walk behind them, through trees with red bark. The owls keep stopping and looking at each other.'),
            OW('We don’t want to do this. We’ve never wanted to do anything we were told.', 'sad'),
            XQ('Then don’t. My heart is mine. It doesn’t belong to them.'),
            OW('But he’ll want to see something in the bowl.'),
            XQ('Then let’s give him something. Look at that tree.'),
          ],
          choices: [
            {
              id: 'tree',
              label: 'Go and look at the tree.',
              then: [N('The bark is cut in one place. Where it’s cut, a thick red sap is running, slow as honey.')],
            },
            {
              id: 'owls',
              label: 'Tell the owls they can be brave.',
              then: [OW('Can we? Nobody’s ever asked us to.', 'think'), N('All four owls stand up a little taller.')],
            },
          ],
        },
      },
      {
        id: 'a31-04-s3',
        goal: 'Help press the red sap into a heart.',
        hint: 'Hold the bowl under the cut bark while the sap runs, then help shape it.',
        check: 'craft:a31-sap-heart:forest',
        scene: {
          id: 'a31-04-sap',
          lines: [
            XQ('Help me. Catch it in the bowl. Then we shape it.'),
            N('You hold the bowl. Your Nubbin, who has never been asked to help with anything this important, holds the edge of it as well.'),
            N('The sap fills it slowly. Xquic presses it into a round, lumpy shape with her thumbs, and the owls tell her where it needs more lump.'),
            OW('More on that side. Hearts are not neat.'),
            N('When it’s done, it shines dark red in the bowl. It even smells right: warm, and sweet, and a little of woodsmoke.'),
            XQ('Now go. Tell him you did it. Tell him I’m gone.'),
            OW('Where will you go?', 'sad'),
            XQ('Up. To the world. There’s a grandmother up there who doesn’t know she has me yet.', 'soft'),
          ],
          choices: [
            {
              id: 'smooth',
              label: 'Press the last of it smooth.',
              then: [N('You smooth the top with your thumb. The owls say it is too neat now, and rough it up again.')],
            },
            {
              id: 'paw',
              label: 'Let your Nubbin leave a pawprint in it.',
              then: [N('A tiny paw-shaped dent, right on top, and the owls decide that’s fine. Hearts have marks on them.')],
            },
          ],
        },
      },
    ],
    complete: {
      id: 'a31-04-complete',
      lines: [
        N('The owls carry the bowl back to Xibalba. The lords put the sap heart on the fire, and the smell fills the hall, and they all lean in.'),
        GM('And while they were sniffing, the owls flew off and showed Xquic the way up. The lords were fooled by a smell.', 'happy'),
        GD('By owls!'),
        GM('By owls. Never trust a lord who can’t tell a heart from a tree.'),
        N('Your Nubbin sniffs its paw for a long time afterwards. It still smells a bit of the tree.'),
      ],
    },
    rewards: [],
    sets: { 'a31-04': true },
    childLines: { 'a31-04-xquic#6': CHILD_PALM },
    notes:
      'The gourd speaks from the tree; draw a gourd among gourds, never a face or a head. The “heart” is only ever ' +
      'a bowl of red sap (a croton tree’s), clearly a thing of tree and bowl. Her father is never on screen. ' +
      'Xquic’s line “My heart is mine” is the quest’s heart; let it sit for a beat.',
  },

  // ---------------------------------------------------------------- A31-5
  {
    id: 'a31-05',
    code: 'A31-5',
    title: 'Xmucane’s Test',
    source: src('Xquic comes to Xmucane, and the net of corn from one plant'),
    audience: 'all',
    trigger: { where: WHERE, when: after('A31-4') },
    requires: ['A31-4'],
    speakers: [GRAN, GIRL, XQUIC, XMUCANE],
    steps: [
      {
        id: 'a31-05-s1',
        goal: 'Walk Xquic up to Xmucane’s house.',
        hint: 'Go up the hill to the house with the garden and the fire.',
        check: 'escort:a31-xquic:xmucane-house',
        scene: {
          id: 'a31-05-door',
          lines: [
            N('The page turns to a little house of poles and thatch on a hillside, with a garden and a fire. It looks a lot like the kitchen you came in by.'),
            N('An old woman stands in the doorway with two older boys behind her: Xmucane, and Hun Hunahpu’s first sons.'),
            XQ('Grandmother. I’m your daughter-in-law. I’m carrying your son’s children.', 'soft'),
            XM('My son is gone, down in Xibalba. Go away. You’re a liar, or a trick, or both.', 'angry'),
            XQ('He isn’t gone. Not all of him. You’ll see.'),
            XM('Will I. Then here is a test. My grandsons are hungry.'),
            XM('There’s a garden down the hill. Bring me a whole net of corn, full, and I’ll believe you.'),
            N('You look down the hill. In the garden there is one corn plant: one.'),
          ],
          choices: [
            {
              id: 'net',
              label: 'Offer to carry the net.',
              then: [XQ('Thank you. I think the net is the easy part.')],
            },
            {
              id: 'might',
              label: 'Tell Xmucane she might be telling the truth.',
              then: [XM('Might. Everybody might. Go and get the corn.')],
            },
          ],
        },
      },
      {
        id: 'a31-05-s2',
        goal: 'Go down to the garden with one plant in it.',
        hint: 'Sit down by the corn plant with Xquic and wait.',
        check: 'visit:a31-garden:one-plant',
        scene: {
          id: 'a31-05-garden',
          lines: [
            N('One plant, with one ear on it. Xquic stands in front of it with the empty net in her hands.'),
            XQ('If I pick this, there’s nothing. If I don’t, there’s nothing.', 'sad'),
            N('She sits down on the earth. Your Nubbin sits next to her, and so, after a moment, do you.'),
            N('Then she says the names of the ones who look after food, softly, as if she is asking friends for a favour.'),
            N('She draws the silk from the one ear, gently, and lays it in the net. And the net is full.'),
            GM('Full, from one ear. That’s the part you hold on to.', 'happy'),
            N('Your Nubbin climbs into the net to check. It is corn all the way down.'),
          ],
          choices: [
            {
              id: 'touch',
              label: 'Touch the ear left on the plant.',
              then: [N('It’s still there. Whatever happened, the plant wasn’t robbed.')],
            },
            {
              id: 'thank',
              label: 'Say thank you to nobody in particular.',
              then: [XQ('Yes. That. Thank you.', 'soft')],
            },
          ],
        },
      },
      {
        id: 'a31-05-s3',
        goal: 'Carry the net of corn up to Xmucane.',
        hint: 'Take one end of the net; Xquic takes the other. Go slowly on the hill.',
        check: 'carry:a31-net:xmucane-house',
        scene: {
          id: 'a31-05-carry',
          lines: [
            N('The net is heavier than the ball, heavier than the bowl, heavier than anything you’ve ever carried in a book.'),
            N('You take one end and Xquic takes the other. Your Nubbin takes the middle, which mostly means it rides in it.'),
            N('Halfway up, the older brothers come out to watch. They don’t help.'),
            XQ('Artists, those two. They play the flute, and paint, and sing. They never carry anything.'),
            N('You put the net down in front of Xmucane. She looks at it, and goes on looking for a long time.'),
            XM('One plant. I planted it myself.', 'think'),
            N('Then she goes down to the garden on her own, and finds the print of the net in the earth, where it lay.'),
          ],
          choices: [
            {
              id: 'wait',
              label: 'Wait outside the door.',
              then: [N('You wait by the door, and your Nubbin waits by your boot. It takes a while.')],
            },
            {
              id: 'sit',
              label: 'Sit down on the net.',
              then: [N('You sit on the corn, and so does your Nubbin. Xquic laughs for the first time since the tree.')],
            },
          ],
        },
      },
    ],
    complete: {
      id: 'a31-05-complete',
      lines: [
        XM('Well. You’re my daughter-in-law, then. Come inside. It’s cold.', 'soft'),
        N('That’s all she says. She puts another log on the fire, moves her own stool closer to it, and puts Xquic on it.'),
        GM('That’s how grandmothers say sorry. You get the good stool.', 'happy'),
        GD('You never give me the good stool.'),
        GM('You never carried a net of corn up a hill.'),
      ],
    },
    rewards: [],
    sets: { 'a31-05': true },
    notes:
      'NO CEREMONY: Xquic’s asking is one narrated line, quiet, with no words of prayer on screen; the advisers may ' +
      'name the guardians or leave them unnamed. Xmucane’s house is the page’s second home: it is the stay branch’s ' +
      'whole stage from A31-11, so draw the earth floor’s middle clearly (the corn goes there in A31-10).',
  },

  // ---------------------------------------------------------------- A31-6
  {
    id: 'a31-06',
    code: 'A31-6',
    title: 'The Older Brothers',
    source: src('the twins are born; One Monkey and One Artisan go up the tree'),
    audience: 'all',
    trigger: { where: WHERE, when: after('A31-5') },
    requires: ['A31-5'],
    speakers: [GRAN, HUNAHPU, XBALANQUE, MONKEY, ARTISAN, XMUCANE],
    steps: [
      {
        id: 'a31-06-s1',
        goal: 'Meet the twins.',
        hint: 'Wait by Xmucane’s house until two boys come down the hill.',
        check: 'talk:a31-twins',
        scene: {
          id: 'a31-06-born',
          lines: [
            N('Twins are born on the mountainside: Hunahpu and Xbalanque. They are loud from the first minute.'),
            N('The older brothers, One Monkey and One Artisan, don’t like the noise. They don’t much like anybody who isn’t a flute.'),
            OM('Put them outside. They cry. We’re composing.', 'angry'),
            GM('So the twins grew up outside, mostly. In the hills, with blowguns. And cheeky? You have no idea.', 'happy'),
            N('The page skips them forward, years in a breath. Two boys come down the slope, each with a long blowgun over his shoulder.'),
            HP('Who’s this? A guest? Xbalanque, we’ve got a guest. And a… what is it?', 'happy'),
            XB('It’s a guest’s guest. Hello, guest’s guest.'),
            N('Your Nubbin looks up at them, and something is settled between the three of them at once: friends.'),
          ],
          choices: [
            {
              id: 'hello',
              label: 'Say hello.',
              then: [HP('Good. Are you hungry? Nobody here eats till our brothers have eaten. Which is never, if you’re us.')],
            },
            {
              id: 'blowgun',
              label: 'Ask about the blowguns.',
              then: [XB('Clay pellets. You blow very hard, and you hit what you meant to. Usually. Ask him about the time he didn’t.', 'happy')],
            },
          ],
        },
      },
      {
        id: 'a31-06-s2',
        goal: 'Watch the older brothers climb the tree.',
        hint: 'Stand back from the tree. Well back.',
        check: 'watch:a31-tree:grows',
        scene: {
          id: 'a31-06-tree',
          lines: [
            N('The twins come home with no birds. The older brothers, who have eaten everyone’s share for years, frown.'),
            HP('We shot plenty. They’re all stuck up a tree. We can’t climb it. Somebody taller should.', 'think'),
            OA('Fine. Show us. Artists can climb.'),
            N('The tree is very ordinary. The two older brothers go up it, complaining about the bark.'),
            N('Then the tree begins to grow. It grows, and grows, and the brothers go up with it, holding on.'),
            OM('It’s getting bigger! Why is it getting bigger?', 'shock'),
            XB('Untie your loincloths! Tie them round your waists with the long end behind, and you can climb down.'),
            N('They do, and the long ends behind them aren’t cloth any more. They’re tails.'),
          ],
          choices: [
            {
              id: 'laugh',
              label: 'Laugh.',
              then: [N('You can’t help it. Your Nubbin falls over backwards, which is how it laughs.')],
            },
            {
              id: 'worry',
              label: 'Ask if they’re all right.',
              then: [HP('They’re fine. Look at them. They’ve never been happier in a tree.', 'happy')],
            },
          ],
        },
      },
      {
        id: 'a31-06-s3',
        goal: 'Wait with Xmucane for her older grandsons to come back.',
        hint: 'Stand by the door with Xmucane and watch the trees.',
        check: 'wait:a31-brothers:house',
        scene: {
          id: 'a31-06-laugh',
          lines: [
            N('The older brothers swing off into the trees as monkeys. Xmucane comes out of the house and stares.'),
            XM('Where are they? Where are my older grandsons?', 'sad'),
            HP('They’ll come back, Grandmother. But you mustn’t laugh when you see them. Not once.'),
            N('They do come back, swinging down to the doorway, with their long arms and curly tails and very solemn faces.'),
            XM('I’m not laughing. I am not.', 'think'),
            N('She laughs. And they go back up into the trees, and this time they don’t come down.'),
            GM('Don’t be sad for them. They’re still artists. Ask anyone here who paints or carves who looks after them.', 'soft'),
          ],
          choices: [
            {
              id: 'hold',
              label: 'Try not to laugh too.',
              then: [N('You hold it in, and your face goes red. Your Nubbin doesn’t even try.')],
            },
            {
              id: 'wave',
              label: 'Wave to the monkeys.',
              then: [N('One of them waves back, upside down, and plays three notes on a flute from the branch.')],
            },
          ],
        },
      },
    ],
    complete: {
      id: 'a31-06-complete',
      lines: [
        N('That night there is flute music in the trees, and the soft scratch of someone drawing on bark.'),
        XM('Did I do that?', 'sad'),
        XB('You laughed, Grandmother. They’d rather be laughed at up there than shout at us down here.'),
        HP('Also, it was funny.', 'happy'),
        N('Xmucane gives the twins their supper first, for the first time. They eat as if it might be taken away.'),
      ],
    },
    rewards: [],
    sets: { 'a31-06': true },
    notes:
      'NO ONE IS HURT: the older brothers become monkeys and stay artists (flute, painting) in the trees; the grandmother ' +
      'says so. The twins as babies are not shown left outside in danger: “grew up outside, mostly” and the hills. ' +
      'The advisers may wish to say more about One Monkey and One Artisan as patrons of artists in a31-06-laugh#6.',
  },

  // ---------------------------------------------------------------- A31-7
  {
    id: 'a31-07',
    code: 'A31-7',
    title: 'Seven Macaw',
    source: src('Seven Macaw, the false sun, and the old couple who mend his teeth'),
    audience: 'all',
    trigger: { where: WHERE, when: after('A31-6') },
    requires: ['A31-6'],
    speakers: [GRAN, GIRL, HUNAHPU, XBALANQUE, MACAW, ELDERS],
    steps: [
      {
        id: 'a31-07-s1',
        goal: 'Go with the twins to the shining bird’s tree.',
        hint: 'Follow the twins to the tree of yellow fruit and keep low.',
        check: 'watch:a31-macaw:tree',
        scene: {
          id: 'a31-07-macaw',
          lines: [
            N('The page tilts up into a sky with no sun in it yet. Only a big bird, shining.'),
            SM('Look at me! My eyes are silver. My teeth are jewels. I am the sun! I am the moon as well, when I can be bothered.', 'happy'),
            GM('Seven Macaw. Before there was a sun, he said he was it. He wasn’t. He was just shiny.'),
            N('He sits in a tree of yellow fruit, eating, and lights up the sky about as well as a lantern in fog.'),
            XB('He’s not the sun. The sun would be warm.', 'think'),
            HP('Then somebody should tell him.'),
            N('Hunahpu lifts his blowgun. A clay pellet goes thup, and hits Seven Macaw right on the jaw.'),
            SM('My TEETH!', 'shock'),
            N('Seven Macaw swoops down, grabs Hunahpu’s arm, and pulls, and flies off home with it. Just like that, the arm is taken.'),
            GD('His ARM?', 'shock'),
            GM('He gets it back. Sit still. You’ll get flour on the story.'),
          ],
          choices: [
            {
              id: 'hunahpu',
              label: 'Run to Hunahpu.',
              then: [HP('I’m all right. I’m annoyed. Mostly annoyed.', 'angry')],
            },
            {
              id: 'chase',
              label: 'Chase the macaw.',
              then: [N('You run a few steps, but he is very much a bird and you are not. Your Nubbin flaps its tiny wings anyway, to show willing.')],
            },
          ],
        },
      },
      {
        id: 'a31-07-s2',
        goal: 'Carry the old couple’s bag of white corn to Seven Macaw’s house.',
        hint: 'Walk behind the old couple with the bag. Keep a straight face.',
        check: 'carry:a31-white-corn:macaw-house',
        scene: {
          id: 'a31-07-healers',
          lines: [
            N('At the edge of the forest the twins find an old couple: very white-haired, and very good at looking harmless.'),
            OC('Toothache doctors, we’ll say. You two walk behind us. You’re our grandchildren.', 'happy'),
            XB('And the guest?'),
            OC('The guest carries the bag. Every doctor has someone to carry the bag.'),
            N('The bag is full of white corn, and you carry it. Your Nubbin carries itself, which takes concentration.'),
            N('Seven Macaw is lying on his back with his jaw in his wing, groaning. Hunahpu’s arm hangs from a beam by its sleeve.'),
            SM('It hurts. Everything hurts. Doctors? Oh, thank goodness.', 'sad'),
            OC('It’s those teeth. Bad teeth. Out they come, and new ones go in.'),
            SM('But they’re my jewels. They’re how people know I’m the sun.', 'shock'),
            OC('These are white corn. Very fashionable. Everybody’s wearing them.'),
          ],
          choices: [
            {
              id: 'bag',
              label: 'Hand over the bag of corn with a straight face.',
              then: [N('You manage, just. Your Nubbin hands over a single kernel, separately, which nobody asked for.')],
            },
            {
              id: 'arm',
              label: 'Look at the arm on the beam.',
              then: [N('It hangs there by its sleeve. Hunahpu, behind you, gives it a small wave with his other hand.')],
            },
          ],
        },
      },
    ],
    complete: {
      id: 'a31-07-complete',
      lines: [
        N('Out come the jewel teeth, and in go the white corn ones. The old couple take his silver eyes too, very politely, for cleaning.'),
        N('Seven Macaw sits up, and he isn’t shining. He’s a bird, a big ordinary green bird with soft white teeth.'),
        SM('I don’t feel like the sun any more.', 'sad'),
        GM('Without his shine, he was nobody. And nobody minded. The real sun was still coming.', 'soft'),
        N('The old grandmother reaches up and takes Hunahpu’s arm off the beam, and fits it back on, and it is his again. Just like that, the arm is returned.'),
        HP('Good as new. Better. It’s had a rest.', 'happy'),
      ],
    },
    rewards: [],
    sets: { 'a31-07': true },
    notes:
      'SOFTENED as the outline asks: no blood. The arm is “taken” and “returned”; it hangs by its sleeve from a beam ' +
      '(never over the fire). Seven Macaw loses his shine and lives on as an ordinary bird; the page says nothing of his ' +
      'death. The old couple are drawn as kindly tricksters.',
  },

  // ---------------------------------------------------------------- A31-8
  {
    id: 'a31-08',
    code: 'A31-8',
    title: 'Zipacna and Earthquake',
    source: src('Seven Macaw’s sons: the pretend crab, and the bird coated in earth'),
    audience: 'all',
    trigger: { where: WHERE, when: after('A31-7') },
    requires: ['A31-7'],
    speakers: [GRAN, GIRL, HUNAHPU, XBALANQUE, ZIPACNA, QUAKE],
    steps: [
      {
        id: 'a31-08-s1',
        goal: 'Help the twins make a crab that isn’t a crab.',
        hint: 'Gather broad leaves, red flowers and a flat stone, and take them to the ravine.',
        check: 'craft:a31-crab:ravine',
        scene: {
          id: 'a31-08-crab',
          lines: [
            GM('Seven Macaw had two sons. Both of them bigger, and both of them worse.'),
            GM('Zipacna was the first. He carried mountains about. And once he tricked the Four Hundred Boys and brought their own house down on them.', 'sad'),
            GD('Were they all right?', 'sad'),
            GM('They became stars, later. Hold on to that. Now: Zipacna loved crabs. That was his weak spot.'),
            HP('Crabs. Right. Who can make a crab?'),
            N('You gather broad leaves and red flowers, and Xbalanque finds a flat stone for the shell. Your Nubbin finds a stick, and is very proud of it.'),
            N('You put it all together at the bottom of a ravine, under a mountain: a big red crab.'),
            XB('It’s the best crab I’ve ever seen that isn’t a crab.', 'happy'),
          ],
          choices: [
            {
              id: 'claw',
              label: 'Give it your Nubbin’s stick for a claw.',
              then: [N('Your Nubbin hands the stick over with great ceremony. The crab now has one claw and a lot of dignity.')],
            },
            {
              id: 'eyes',
              label: 'Give it two pebbles for eyes.',
              then: [N('Now it’s looking at you. You rather wish it wasn’t.')],
            },
          ],
        },
      },
      {
        id: 'a31-08-s2',
        goal: 'Watch Zipacna go after the crab.',
        hint: 'Hide up on the ravine’s edge with the twins.',
        check: 'watch:a31-zipacna:mountain',
        scene: {
          id: 'a31-08-zipacna',
          lines: [
            N('Zipacna comes down the river, huge and hungry, looking for crabs. He has not eaten for days.'),
            ZP('A crab? Where?', 'happy'),
            HP('Down there. Under the mountain. A big one. We couldn’t catch it.'),
            N('Zipacna lies on his front and squeezes in under the overhang, reaching. The crab, which is leaves, does not move.'),
            ZP('Nearly… nearly…'),
            N('Then the mountain settles, the way mountains do, with a long slow sigh. Zipacna is under it, and there he stays.'),
            GM('Some say he turned to stone there. Either way, he doesn’t carry mountains about any more.'),
            N('Your Nubbin goes down afterwards and takes its stick back, very carefully.'),
          ],
          choices: [
            {
              id: 'quiet',
              label: 'Keep very quiet.',
              then: [N('You keep so quiet you can hear your Nubbin thinking. It is thinking about the stick.')],
            },
            {
              id: 'mountain',
              label: 'Pat the mountain.',
              then: [N('You pat the mountain, and it doesn’t seem to mind. Mountains are used to being where they’re put.')],
            },
          ],
        },
      },
      {
        id: 'a31-08-s3',
        goal: 'Dig clay from the riverbank for Earthquake’s supper.',
        hint: 'The wet clay is at the bend of the river. Bring both hands full.',
        check: 'collect:a31-clay:riverbank',
        scene: {
          id: 'a31-08-earthquake',
          lines: [
            GM('The second son was Earthquake. He knocked mountains down for fun. His brother’s trick, the other way round.'),
            N('Earthquake is stamping through the hills, and every stamp shakes a mountain loose.'),
            XB('He’s hungry too. They’re always hungry, this family. We need clay.'),
            N('You dig wet clay from the riverbank with your hands. The twins roast a bird, and coat it all over, thick, with the earth you bring.'),
            HP('There. Earth outside. And earth inside, once he’s eaten it.'),
            EQ('That smells good. Is that for me?', 'happy'),
            N('He eats it.'),
            EQ('Crunchy. Is it meant to be crunchy?'),
            HP('Family recipe.'),
            EQ('…Lovely.'),
            N('Then he sits down rather suddenly, as if he is very tired, and doesn’t get up again.'),
            N('He is part of the hills now. The ground still shakes a little sometimes, when he turns over in his sleep.'),
          ],
          choices: [
            {
              id: 'wash',
              label: 'Wash the clay off in the river.',
              then: [N('Your hands come clean. Your Nubbin does not want its paws clean, and walks about printing them on everything.')],
            },
            {
              id: 'listen',
              label: 'Put your ear to the ground.',
              then: [N('Far down, very faint, there is a snore. You decide not to mention it.')],
            },
          ],
        },
      },
    ],
    complete: {
      id: 'a31-08-complete',
      lines: [
        N('The world is quieter. The mountains stay where they are put.'),
        HP('Is that all of them?'),
        XB('All the shiny, boasting ones.'),
        GM('So. Now somebody has to go down to Xibalba. You know who.'),
        GD('The twins!'),
        GM('Not yet. First, a rat. Eat your tortilla.'),
      ],
    },
    rewards: [],
    sets: { 'a31-08': true },
    notes:
      'TOLD GENTLY: the Four Hundred Boys’ end is one line in the grandmother’s voice, with the promise that they become ' +
      'stars (paid off in A31-16). Zipacna is settled under a mountain and Earthquake becomes part of the hills; neither ' +
      'is shown hurt. The ground shake is a small screen wobble (off under reduced motion).',
  },

  // ---------------------------------------------------------------- A31-9
  {
    id: 'a31-09',
    code: 'A31-9',
    title: 'The Rat',
    source: src('the garden that unmakes itself, the rat, and the father’s gear in the roof'),
    audience: 'all',
    trigger: { where: WHERE, when: after('A31-8') },
    requires: ['A31-8'],
    speakers: [GRAN, GIRL, HUNAHPU, XBALANQUE, RAT, MOSQUITO, XMUCANE],
    steps: [
      {
        id: 'a31-09-s1',
        goal: 'Help the twins clear the garden. Or let their tools do it.',
        hint: 'Go to the garden on the hill and keep watch with the dove.',
        check: 'watch:a31-tools:garden',
        scene: {
          id: 'a31-09-tools',
          lines: [
            N('The twins are meant to clear a garden. Instead they lie in the shade, and their hoe and axe do it for them.'),
            HP('Hoe, dig. Axe, chop.', 'happy'),
            N('The hoe digs on its own, the axe chops on its own, and a dove sits on the fence, ready to call if anyone comes.'),
            XB('When Grandmother comes, we rub earth on our faces and look tired. That’s the hard-work part.'),
            N('In the morning the garden is a forest again. Every tree is back, every bush is back, as if nobody had touched it.'),
            HP('What? Who did this?', 'shock'),
          ],
          choices: [
            {
              id: 'hoe',
              label: 'Let your Nubbin help the hoe.',
              then: [N('It holds the hoe’s handle and gets dragged round the garden at speed. It has never been happier.')],
            },
            {
              id: 'dove',
              label: 'Keep watch with the dove.',
              then: [N('The dove nods at you, one lookout to another.')],
            },
          ],
        },
      },
      {
        id: 'a31-09-s2',
        goal: 'Wait up in the garden at night to see who undoes it.',
        hint: 'Hide behind the bush with the twins. Keep your Nubbin quiet. Try, anyway.',
        check: 'wait:a31-garden:night',
        scene: {
          id: 'a31-09-night',
          lines: [
            N('So you wait up in the garden that night with the twins, behind a bush. Your Nubbin is meant to be quiet, and mostly it is.'),
            N('At midnight the animals come: the puma, the jaguar, the deer, the rabbit. They tell the trees to stand up, and the trees do.'),
            XB('Get them!'),
            N('Everyone gets away except one. Hunahpu catches a rat by the tail, and holds it upside down, firmly.'),
            RT('Don’t eat me! I’m not even nice to eat! I know a secret!', 'shock'),
            HP('Go on.'),
            RT('Your father’s things. His ball, his gloves, his hip-pads. They’re up in your grandmother’s roof, where he tied them before he went.'),
            N('The twins look at each other. Something lights up in both their faces.'),
            RT('And while we’re talking: I’d like food. For ever. That’s my price.'),
          ],
          choices: [
            {
              id: 'fair',
              label: 'Tell the rat it’s a fair price.',
              then: [RT('A fair price. You hear that? The guest says fair.', 'happy')],
            },
            {
              id: 'nose',
              label: 'Let your Nubbin say hello.',
              then: [N('Your Nubbin touches noses with the rat, very formally. The rat sneezes, which counts as a hello.')],
            },
          ],
        },
      },
      {
        id: 'a31-09-s3',
        goal: 'Take the water jar to Xmucane at the river, slowly.',
        hint: 'The twins give you the jar. Take it down to the river and don’t hurry.',
        check: 'deliver:a31-water-jar:river',
        scene: {
          id: 'a31-09-roof',
          lines: [
            N('Back at the house the twins sit down to lunch and complain, loudly, about the chilli sauce.'),
            HP('Grandmother, this is so hot. We need water. Lots of water.'),
            N('Xmucane goes down to the river to fill the big jar, and the twins hand you the small one to take after her. Slowly.'),
            N('At the river a mosquito lands on Xmucane’s big jar and makes a tiny hole in it, very neatly.'),
            MQ('Pardon me. So sorry. Pardon.'),
            N('The water runs out as fast as she pours it in. Yours is the only jar on the bank that holds any.'),
            XM('Lunch. Chilli. A small jar, sent slowly. A mosquito with manners.', 'think'),
            XM('Those boys.'),
            N('Xquic comes down to help, and so do you. Nobody hurries.'),
            N('Back in the empty house, the rat runs up the post and along the beam and gnaws through a cord. Down falls a bundle: a ball, gloves, hip-pads.'),
            XB('Father’s.', 'soft'),
            N('Hunahpu holds the ball for a while without saying anything.'),
          ],
          choices: [
            {
              id: 'share',
              label: 'Bring the rat a share of your own lunch too.',
              set: { 'a31-rat': 'share' },
              then: [
                N('You give the rat half your tortilla. It looks at you for a long time, as if it is writing you down somewhere.'),
                RT('You. I’ll remember you.', 'soft'),
              ],
            },
            {
              id: 'twins',
              label: 'Leave it to the twins.',
              set: { 'a31-rat': 'twins' },
              then: [
                XB('From now on, rat, you eat what we eat. Nobody chases you out of the corn. Ever.'),
                RT('Ever is a good length.', 'happy'),
              ],
            },
            {
              id: 'come',
              label: 'Ask the rat to come with you to Xibalba.',
              set: { 'a31-rat': 'come' },
              then: [
                RT('Xibalba? Me? There are owls down there.', 'shock'),
                RT('…Fine. But I’m not walking. Somebody carries me, or I stay and eat the corn.'),
                XB('We’ll carry you.'),
                RT('Then I’m coming. Under protest. Write that down.', 'soft'),
              ],
            },
          ],
        },
      },
    ],
    complete: {
      id: 'a31-09-complete',
      lines: [
        N('That evening the twins sweep out their father’s old ballcourt and play on it, all night, loudly.'),
        N('The rat watches from the wall, eating. Your Nubbin chases every ball that leaves the court.'),
        GM('And who do you think heard them?'),
        GD('The lords!'),
        GM('The lords. Under the court, trying to sleep. Exactly like before.', 'think'),
      ],
    },
    rewards: [],
    sets: { 'a31-09': true },
    notes:
      'CHOICE a31-rat (a31-09-roof) = share | twins | come. A smaller payoff, four quests later in A31-13: share, the ' +
      'rat fetches the coati (a31-13-rat-coati); come, it runs the lords ragged beside the rabbit (a31-13-rat-court); ' +
      'twins, the rabbit does it alone. On the stay branch the falcon tells it instead (…-told). If “come”, draw the ' +
      'rat riding on your Nubbin’s head from A31-11 to A31-16 on the go branch; on the stay branch it went down in ' +
      'Hunahpu’s pocket and is not drawn. The mosquito here is the same polite mosquito as A31-11 (a cameo). The rat ' +
      'is in the source held by the tail over a fire; here it is only held upside down.',
  },

  // ---------------------------------------------------------------- A31-10
  {
    id: 'a31-10',
    code: 'A31-10',
    title: 'The Summons',
    source: src('the message by louse, toad, snake and falcon; the corn planted in the house'),
    audience: 'all',
    trigger: { where: WHERE, when: after('A31-9') },
    requires: ['A31-9'],
    speakers: [GRAN, OWLS, XMUCANE, LOUSE, TOAD, HUNAHPU, XBALANQUE],
    steps: [
      {
        id: 'a31-10-s1',
        goal: 'Follow the message from Xmucane’s door to the ballcourt.',
        hint: 'Go with the louse. It is not quick. Everyone it meets is quicker.',
        check: 'watch:a31-relay:messengers',
        scene: {
          id: 'a31-10-relay',
          lines: [
            N('The owls come to Xmucane’s door. The twins are out at the court, so it’s Xmucane they tell.'),
            OW('One Death and Seven Death say: the boys are to come and play. Bring the gear.'),
            N('Xmucane sits down on her stool and doesn’t get up for a while. Then she lifts a louse off her own sleeve.'),
            XM('Go and tell my grandsons. Quickly.', 'sad'),
            N('The louse sets off, and it is not quick. On the road, a toad offers it a lift, and the lift is inside the toad’s mouth.'),
            LS('Very kind. Bit damp.'),
            N('The toad isn’t quick either, so a snake offers it a lift, the same way. Then a falcon offers the snake one.'),
            N('Your Nubbin watches each one go into the next, with its own mouth open in deep sympathy.'),
            N('The falcon lands on the ballcourt wall and coughs up the snake, who coughs up the toad, who tries to cough up the louse and can’t.'),
            TD('It’s in there. It’s fine. It’s just stuck.', 'think'),
            N('Hunahpu looks into the toad’s mouth. The louse is sitting just behind its lip, holding the message, perfectly safe.'),
            LS('Your grandmother says come home. The lords say come down. In that order.'),
          ],
          choices: [
            {
              id: 'thank',
              label: 'Thank every messenger in turn.',
              then: [N('You thank the falcon, the snake, the toad and the louse, in order. The falcon looks embarrassed, and the louse bows.')],
            },
            {
              id: 'laugh',
              label: 'Try not to laugh at the louse.',
              then: [LS('Laugh if you like. I got here, didn’t I?')],
            },
          ],
        },
      },
      {
        id: 'a31-10-s2',
        goal: 'See the twins plant their corn in the middle of the house, and decide where you’ll be.',
        hint: 'Go back to Xmucane’s house and stand by the hearth while they plant it.',
        check: 'place:a31-corn:house-middle',
        scene: {
          id: 'a31-10-corn',
          lines: [
            N('Before they go, the twins come home. Each of them takes an ear of corn and plants it in the middle of the house, in the earth floor.'),
            HP('Grandmother, look at these. Every day.'),
            XB('If they dry up, we’re gone. If they sprout, we’re alive.'),
            XM('And if they do both?', 'think'),
            HP('Then we’re being clever. Don’t worry. You’ll know.'),
            GM('An old book in English says they planted canes. We say corn. We are made of corn, you know. That’s another story.', 'soft'),
            N('The twins pick up their father’s gear, and your Nubbin looks at you. You look at the corn, and at Xmucane, and at the road.'),
          ],
          choices: [
            {
              id: 'stay',
              label: 'Stay with Xmucane and watch the corn.',
              set: { 'a31-corn': 'stay' },
              then: [
                XM('Oh. You don’t have to.', 'soft'),
                Y('I know.'),
                N('She doesn’t say anything else. She moves her stool over, so there’s room for yours.'),
              ],
            },
            {
              id: 'go',
              label: 'Go down with the twins.',
              set: { 'a31-corn': 'go' },
              then: [
                XB('Good. Bring the little one. We’ll need someone who can fetch.', 'happy'),
                XM('Look after them. And look after yourself. It’s the same thing, really.', 'soft'),
              ],
            },
          ],
        },
      },
    ],
    complete: {
      id: 'a31-10-complete',
      lines: [
        N('In the morning the twins go off down the road, swinging their father’s ball between them.'),
        N('Behind them, in the middle of the house, two ears of corn stand in the earth floor, green.'),
        GM('Now. Which way did you go?'),
        N('The page waits a moment, as if it’s listening for your answer.'),
      ],
    },
    rewards: [],
    sets: { 'a31-10': true },
    notes:
      'SIGNATURE CHOICE a31-corn (a31-10-corn) = stay | go. It decides the scenes of A31-11 to A31-16 (go: the default ' +
      'scenes; stay: the -stay variants in A31_VARIANTS) and the ear of corn in A31-17 (golden for go, green for stay). ' +
      'Neither branch is better; one is a travelling story and one is a waiting one. CORN, NOT CANES: Spence says canes; ' +
      'translations from the K’iche’ say ears of corn, and the grandmother says so (a31-10-corn#5). The advisers may ' +
      'reword her line about people being made of corn (the creation of people from maize in the Popol Vuh). ' +
      'RELAY: the swallowing is played as comic “lifts”; nobody is hurt and every messenger comes out again.',
  },

  // ---------------------------------------------------------------- A31-11
  {
    id: 'a31-11',
    code: 'A31-11',
    title: 'The Crossroads',
    source: src('the four roads, the mosquito, and the lords named by name'),
    audience: 'all',
    trigger: { where: WHERE, when: after('A31-10') },
    requires: ['A31-10'],
    speakers: [GRAN, GIRL, HUNAHPU, XBALANQUE, ROAD, MOSQUITO, ONEDEATH, SEVENDEATH, LORDS, XMUCANE, XQUIC, FALCON],
    steps: [
      {
        id: 'a31-11-s1',
        goal: 'Go down to the crossroads with the twins.',
        hint: 'Follow the twins down the rock stairs to where the four roads meet.',
        check: 'walk:a31-road:crossroads',
        scene: {
          id: 'a31-11-road',
          lines: [
            N('The way down is steep: stairs cut in rock, a river canyon, then another river. The twins go down it whistling.'),
            N('At the bottom, four roads meet: a red one, a white one, a yellow one and a black one.'),
            RD('I’m the way. Me. Take me. I go straight to the lords.'),
            XB('That’s the road that talked to our father.', 'think'),
            HP('And it was telling the truth. It just didn’t say what was at the end of it.'),
            N('Hunahpu pulls one hair from his shin, wincing, and blows on it. It turns into a mosquito, which hovers politely in front of his nose.'),
            MQ('Good afternoon. We’ve met. At the jar. Sorry again about the jar.'),
            HP('Same hair. It keeps.'),
            MQ('How may I help?'),
            HP('Go ahead of us. Bite everyone sitting down there. Every one.'),
            MQ('Bite? Strangers? Without being introduced?', 'shock'),
            XB('Introduce yourself after.'),
          ],
          choices: [
            {
              id: 'wave',
              label: 'Let your Nubbin wave the mosquito off.',
              then: [N('It waves. The mosquito bows in the air three times, which is a lot of bowing for something that small.')],
            },
            {
              id: 'road',
              label: 'Thank the black road.',
              then: [RD('Nobody thanks a road. Huh.', 'think')],
            },
          ],
        },
      },
      {
        id: 'a31-11-s2',
        goal: 'Watch the mosquito go along the row of lords.',
        hint: 'Stand at the back of the hall and keep well away from the bench.',
        check: 'watch:a31-mosquito:lords',
        scene: {
          id: 'a31-11-lords',
          lines: [
            N('The hall of Xibalba is long and dim. A row of lords sits along one wall, very still, and some of them are wooden.'),
            N('The mosquito bites the first lord in the row: nothing, wood. It bites the second: wood again.'),
            MQ('Do excuse me.'),
            N('It bites the third.'),
            OD('Ow!', 'shock'),
            SD('One Death? What is it, One Death?'),
            OD('Something bit me, Seven Death!'),
            N('All the way down the row it goes. Every real lord yells, and the lord beside him asks what happened, by name.'),
            HP('Good day, One Death. Good day, Seven Death. Good day, Wing. Good day, Packstrap.', 'happy'),
            XB('And good day to the wooden ones. Very nice carving.'),
            N('The lords stare at them. Nobody has ever greeted the wood before. Then One Death points at your Nubbin.'),
            OD('And what is THAT?'),
            HP('It’s a guest. You don’t ask a guest what it is. You give it a tortilla.'),
            SD('We haven’t got any tortillas.'),
            XB('Then you’re not much of a house.'),
            LD('Sit down. Have a seat. Please.'),
            N('The seat glows faintly at the edges. It is a stone, and it is hot.'),
            XB('No thanks. We’ve been sitting all the way down.'),
          ],
          choices: [
            {
              id: 'grin',
              label: 'Try very hard not to grin.',
              then: [N('You fail. One of the lords sees, and glares, and you look at the ceiling as if it is very interesting.')],
            },
            {
              id: 'back',
              label: 'Stand well back from the bench.',
              then: [N('You stand well back. Your Nubbin, which has strong views about hot seats, stands further back still. Then a bit further.')],
            },
          ],
        },
      },
    ],
    complete: {
      id: 'a31-11-complete',
      lines: [
        GM('Every lord by name. No bowing to the wood. No sitting on the hot bench. Their father hadn’t known. They did.', 'happy'),
        GD('Because of a mosquito.'),
        GM('Because of a mosquito. Never think small help is small.'),
        N('Later, the mosquito comes looking for your Nubbin. It lands on its crown, bows, and asks very politely if it may come along.'),
        N('Your Nubbin says nothing, as usual. The mosquito takes that as a yes, which is how most good friendships start.'),
      ],
    },
    rewards: [
      {
        id: 'a31-mosquito-petpet',
        kind: 'cosmetic',
        label: 'A polite mosquito',
        description: 'A tiny mosquito petpet that rides on your Nubbin’s crown, bows to everyone, and has never bitten anybody without asking.',
      },
    ],
    sets: { 'a31-11': true },
    notes:
      'BRANCH (a31-corn). go: these scenes. stay: play A31_VARIANTS a31-11-road-stay in place of a31-11-road (step ' +
      'check becomes wait:a31-house:morning) and a31-11-lords-stay in place of a31-11-lords (check becomes ' +
      'talk:a31-falcon:door). The complete scene is the grandmother’s voice-over and plays on both; on the stay ' +
      'branch the mosquito finds your Nubbin at Xmucane’s door. Lord names: only the mild ones (Wing, Packstrap) are ' +
      'spoken; the advisers may add others. The hot bench is a glowing stone, nobody sits on it. REWARD: the mosquito ' +
      'petpet is one-time, given here on either branch. STAY JOURNAL (the step goal and hint on the stay branch): s1 ' +
      'goal “Stay at Xmucane’s house while the twins go down.”, hint “Sweep, fetch water, or sit by the corn until ' +
      'morning.”; s2 goal “Hear the falcon’s news at the door.”, hint “Wait by the doorpost in the evening; the falcon ' +
      'lands there.”',
  },

  // ---------------------------------------------------------------- A31-12
  {
    id: 'a31-12',
    code: 'A31-12',
    title: 'The Houses',
    source: src('the Dark House, and the Razor, Cold, Jaguar and Fire Houses'),
    audience: 'all',
    trigger: { where: WHERE, when: after('A31-11') },
    requires: ['A31-11'],
    speakers: [GRAN, GIRL, HUNAHPU, XBALANQUE, LORDS, ONEDEATH, XMUCANE, XQUIC],
    steps: [
      {
        id: 'a31-12-s1',
        goal: 'Spend the night in the Dark House with the twins.',
        hint: 'Stay close to the twins in the dark. Help with whatever glows.',
        check: 'wait:a31-dark-house:night',
        scene: {
          id: 'a31-12-dark',
          lines: [
            N('The lords send them to the Dark House for the night, with a torch and two cigars.'),
            LD('Keep them lit all night. And give them back to us in the morning, whole. Exactly as they are now.'),
            N('Inside it is dark the way the inside of a shut fist is dark. Your Nubbin presses against your leg.'),
            XB('Lit all night, and whole in the morning. That’s impossible. Which is the point.', 'think'),
            HP('So we don’t light them.'),
            N('Hunahpu ties a red macaw’s tail feather to the top of the torch. In the dark, it looks exactly like a flame.'),
            N('Xbalanque catches two fireflies and sets one on the tip of each cigar. They glow: on, off, on.'),
            N('Every so often a guard looks in, and everything glows. He goes away satisfied.'),
          ],
          choices: [
            {
              id: 'firefly',
              label: 'Help catch the fireflies.',
              then: [N('You catch one in your cupped hands. It sits there glowing, pleased to be useful.')],
            },
            {
              id: 'torch',
              label: 'Let your Nubbin hold the torch.',
              then: [N('It holds the torch very upright, as if it is the most important job in the world. The feather doesn’t burn.')],
            },
          ],
        },
        done: {
          id: 'a31-12-dark-done',
          lines: [
            N('In the morning they hand back the torch and the cigars, whole and unlit. The lords look at them for a long time.'),
            OD('How?', 'shock'),
            HP('Good morning.', 'happy'),
          ],
        },
      },
      {
        id: 'a31-12-s2',
        goal: 'Go through the other houses with the twins.',
        hint: 'Carry pine cones for the Cold House fire. Keep away from the jaguars.',
        check: 'explore:a31-houses:xibalba',
        scene: {
          id: 'a31-12-houses',
          lines: [
            GM('Then the Razor House, where the knives are always hungry. The twins promised them the meat of animals one day, and the knives lay down.'),
            N('In the Cold House, frost is thick on the walls. The twins build a fire of old pine cones, and the cold goes and sulks in a corner.'),
            N('In the Jaguar House, the jaguars pace. The twins throw them bones from the lords’ own kitchen, and the jaguars lie down and crunch.'),
            N('Your Nubbin offers the nearest jaguar its stick. The jaguar sniffs it, and gives it back, with better manners than any lord.'),
            N('In the Fire House, the fire roars and roars, and doesn’t burn them. Possibly it liked them.'),
            N('Your Nubbin carries a pine cone for the fire, then another. Then all of them, one at a time, because it has found a job.'),
            HP('Every house. Every one. And we’re still here.', 'happy'),
            XB('Don’t say that. It’s asking for it.'),
          ],
          choices: [
            {
              id: 'cold',
              label: 'Warm your hands at the pine-cone fire.',
              then: [N('The fire smells of resin and somewhere better. You hold your hands to it until they hurt in the good way.')],
            },
            {
              id: 'jaguar',
              label: 'Keep well away from the jaguars.',
              then: [N('A jaguar looks at you over its bone, decides you aren’t dinner, and goes back to its bone.')],
            },
          ],
        },
      },
    ],
    complete: {
      id: 'a31-12-complete',
      lines: [
        GM('Five houses. Clever every time.'),
        GM('And up on the mountain, in the middle of their grandmother’s house, the corn stayed green the whole while.'),
        GD('Because they were alive.'),
        GM('Because they were clever. Being alive came with it.', 'happy'),
      ],
    },
    rewards: [],
    sets: { 'a31-12': true },
    notes:
      'BRANCH (a31-corn). go: these scenes. stay: a31-12-dark-stay replaces a31-12-dark (check becomes ' +
      'watch:a31-corn:night), a31-12-dark-done-stay replaces a31-12-dark-done, and a31-12-houses-stay replaces ' +
      'a31-12-houses (check becomes carry:a31-water:river). The complete is shared. The cigars are props from the ' +
      'source and are never smoked; the Learning Grove version may make them candles. The Razor House is told only. ' +
      'STAY JOURNAL (the step goal and hint on the stay branch): s1 goal “Sit up with Xmucane and watch the corn ' +
      'through the night.”, hint “Stay by the corn in the middle of the house until dawn.”; s2 goal “Do the house’s ' +
      'work while you wait for news.”, hint “Bring water up from the river, and look at the corn each time you come in.”',
  },

  // ---------------------------------------------------------------- A31-13
  {
    id: 'a31-13',
    code: 'A31-13',
    title: 'The Bat House',
    source: src('the Bat House, the coati’s squash, the rabbit and the ball'),
    audience: 'all',
    trigger: { where: WHERE, when: after('A31-12') },
    requires: ['A31-12'],
    speakers: [GRAN, GIRL, HUNAHPU, XBALANQUE, ONEDEATH, LORDS, RAT, XMUCANE, XQUIC, FALCON],
    steps: [
      {
        id: 'a31-13-s1',
        goal: 'Get through the night in the Bat House.',
        hint: 'Stay under the bench with your Nubbin until morning. Help with the squash.',
        check: 'wait:a31-bat-house:night',
        scene: {
          id: 'a31-13-bats',
          lines: [
            N('The last house is the Bat House. It is full of bats with noses like knives, and they never stop flying.'),
            XB('Into the blowguns. We sleep inside them. The bats can’t get in.'),
            N('So they crawl inside their own long blowguns to sleep. You and your Nubbin squeeze under a bench for a long night.'),
            HP('Is it morning yet? I’m going to look.'),
            XB('Don’t!', 'shock'),
            N('Hunahpu looks out of the end of his blowgun. A bat swoops, quick as a blink, and flies away up into the dark.'),
            N('Xbalanque calls his brother’s name, and nobody answers.', 'sad'),
            XB('Animals! Everyone! Anyone! I need help!', 'sad'),
            N('They come out of the dark from everywhere, every kind of animal, each one carrying what it eats.'),
            N('Last comes the coati, nosing along a big round squash, and she rolls it to Xbalanque’s feet.'),
            N('By morning he has carved the squash, and set it where it belongs, and Hunahpu is sitting up, blinking.'),
            HP('I feel a bit seedy.', 'think'),
            XB('You look it. Come on. We’ve got a game.'),
          ],
          choices: [
            {
              id: 'squash',
              label: 'Help roll the squash.',
              then: [N('It is very round and very heavy, and it wants to go everywhere except where you push it.')],
            },
            {
              id: 'hold',
              label: 'Hold your Nubbin close in the dark.',
              then: [N('It holds on to your sleeve, and you hold on to it. Neither of you lets go until morning.')],
            },
          ],
        },
      },
      {
        id: 'a31-13-s2',
        goal: 'Watch the game in the great ballcourt of Xibalba.',
        hint: 'Sit on the wall by the trees, where the rabbit is waiting.',
        check: 'watch:a31-ballgame:xibalba',
        scene: {
          id: 'a31-13-game',
          lines: [
            N('The ballcourt of Xibalba is huge, with walls that go up into darkness. Above the end wall, out of reach, the lords have hung the bat’s prize.'),
            OD('Play! And afterwards, perhaps we’ll use that up there for a ball.', 'happy'),
            XB('Play first.'),
            N('Xbalanque hits the ball so hard it flies right out of the court and bounces away into the trees.'),
            N('A rabbit, which has been waiting there all night, picks it up and bounds off with it, and the lords go charging after.'),
            LD('After it! After the ball!'),
            N('While they’re all off in the trees, Xbalanque climbs the end wall and puts back what is his brother’s. He hangs the squash up instead.'),
            HP('Ah. That’s better. That’s much better.', 'happy'),
            N('The lords come back, panting. One of them takes down the squash to serve with, and serves.'),
            N('It hits the wall and bursts, seeds everywhere. The lords stare at it, then at the twins, who are both perfectly well.'),
            OD('That’s cheating!', 'angry'),
            HP('That’s squash.'),
          ],
          choices: [
            {
              id: 'cheer',
              label: 'Cheer.',
              then: [N('You cheer, and your Nubbin cheers by jumping. The rabbit, back on the wall, cheers by washing its ears.')],
            },
            {
              id: 'seeds',
              label: 'Pick up the squash seeds.',
              then: [N('You pocket a handful of seeds without knowing why. It seems like something somebody should remember.')],
            },
          ],
        },
      },
    ],
    complete: {
      id: 'a31-13-complete',
      lines: [
        GM('That’s the hard night. And they came through it, both of them, with a squash for a spare.', 'happy'),
        GD('I like the rabbit.'),
        GM('Everybody likes the rabbit.'),
        N('Far above, on the mountain, two ears of corn lift their leaves in the morning light.'),
      ],
    },
    rewards: [],
    sets: { 'a31-13': true },
    notes:
      'PARENT NOTE (optional card before this quest, skippable, shown only if the parent-notes option is on): “In this ' +
      'part of the story a bat carries off one twin, and his brother makes him well again with a squash. Nothing is ' +
      'shown; it is told, and it ends happily.” TOLD, NOT SHOWN: Hunahpu’s head is only ever “the bat’s prize” and “what ' +
      'is his brother’s”; draw a bundle in a cloth on the wall, never a head. BRANCH (a31-corn). go: these scenes. ' +
      'stay: a31-13-bats-stay replaces a31-13-bats (check becomes watch:a31-corn:droop) and a31-13-game-stay replaces ' +
      'a31-13-game (check becomes talk:a31-falcon:noon). RAT (a31-rat). go: if share, insert a31-13-rat-coati after ' +
      'a31-13-bats#9 (the coati); if come, insert a31-13-rat-court after a31-13-game#5 (the lords’ shout, after the ' +
      'rabbit). stay: if share, insert a31-13-rat-coati-told after a31-13-game-stay#4 (the falcon’s “Everything.”, so ' +
      'Xquic’s question still gets its answer); if come, insert a31-13-rat-court-told at the same place. twins: no ' +
      'insert. The complete is shared. STAY JOURNAL (the step goal and hint on the stay branch): s1 goal “Watch the ' +
      'corn with Xmucane through the hard night.”, hint “Sit by the corn and say nothing. Wait for dawn.”; s2 goal ' +
      '“Hear the falcon’s news at noon.”, hint “Go to the doorway when the falcon comes in.”',
  },

  // ---------------------------------------------------------------- A31-14
  {
    id: 'a31-14',
    code: 'A31-14',
    title: 'The Oven and the River',
    source: src('the twins let themselves be burned; the bones in the river; five days'),
    audience: 'all',
    trigger: { where: WHERE, when: after('A31-13') },
    requires: ['A31-13'],
    speakers: [GRAN, GIRL, HUNAHPU, XBALANQUE, XMUCANE, XQUIC],
    steps: [
      {
        id: 'a31-14-s1',
        goal: 'Stand by the twins on the night of the oven.',
        hint: 'Stay near the twins. When Hunahpu tells you where to look, look there.',
        check: 'watch:a31-oven:glow',
        scene: {
          id: 'a31-14-oven',
          lines: [
            N('The lords are tired of losing. They build a great oven and light it, and nobody pretends it is for bread.'),
            XB('They mean to burn us. Fine. We knew that.', 'think'),
            N('The twins find two seers, Xulu and Pacam, and speak to them quietly in a corner, where the lords can’t hear.'),
            HP('When they ask what to do with our bones, say: grind them, and pour them in the river. Say it like it’s your own idea.'),
            N('Then Hunahpu turns round, sees you and your Nubbin, and crouches down.'),
            HP('Don’t look at the oven. Look at the river. We’ll be there. Five days. Promise.', 'soft'),
            N('They take hands and walk towards the light, and that is all you see. There is a glow, very bright, and then less bright.'),
            N('Your Nubbin hides its face in your coat. You don’t blame it.', 'sad'),
          ],
          choices: [
            {
              id: 'river',
              label: 'Look at the river, like he said.',
              then: [N('You look at the river. It goes on being a river, which is something.')],
            },
            {
              id: 'hold',
              label: 'Hold your Nubbin.',
              then: [N('You hold it, and it holds you, and the light behind you goes down slowly, like a sunset in the wrong place.')],
            },
          ],
        },
      },
      {
        id: 'a31-14-s2',
        goal: 'Wait by the river for five days.',
        hint: 'Sit on the bank and watch the shallows. The page will turn the days for you.',
        check: 'wait:a31-river:five-days',
        scene: {
          id: 'a31-14-river',
          lines: [
            N('The lords do just what the seers tell them. They are very pleased with themselves.'),
            margin(LIFT_RIVER),
            N('You wait on the bank. The page turns its days over gently: one, two, three, four, five.'),
            N('On the second day there are catfish in the shallows, two of them, side by side, looking up at you.'),
            N('Your Nubbin lies on its front at the edge, nose to nose with them, every day.'),
            N('On the fifth day, two boys climb out of the river, dripping, and shake their hair like dogs.'),
            XB('Told you. Five days. Did you keep looking at the river?', 'happy'),
            HP('I’m starving. Is there anything to eat that isn’t squash?'),
          ],
          choices: [
            {
              id: 'hug',
              label: 'Hug them both, wet as they are.',
              then: [N('They’re cold and wet and smell of river. Your Nubbin hugs a leg each, which takes some doing.')],
            },
            {
              id: 'food',
              label: 'Find them something to eat.',
              then: [N('You have half a tortilla in your pocket from the kitchen. They split it exactly down the middle.')],
            },
          ],
        },
      },
    ],
    complete: {
      id: 'a31-14-complete',
      lines: [
        GM('Five days. Their grandmother counted every one.', 'soft'),
        GD('Did she know they’d come back?'),
        GM('No. That’s why it counts.'),
        N('And far up the mountain, in the middle of a little house, two ears of corn are green.'),
      ],
    },
    rewards: [],
    sets: { 'a31-14': true },
    childLines: {
      'a31-14-river#1': CHILD_RIVER,
      'a31-14-river-stay#6': CHILD_RIVER,
    },
    notes:
      'TOLD, NOT SHOWN: the oven is a glow seen from behind; the twins walk into light holding hands, and the player is ' +
      'told to look at the river. No fire touches anyone on screen. Catfish, then boys. BRANCH (a31-corn). go: these ' +
      'scenes. stay: a31-14-oven-stay replaces a31-14-oven (check becomes watch:a31-corn:dried) and a31-14-river-stay ' +
      'replaces a31-14-river (check becomes wait:a31-corn:five-days). The lifted line plays once on either branch ' +
      '(childLines keys cover both scenes). The complete is shared. STAY JOURNAL (the step goal and hint on the stay ' +
      'branch): s1 goal “Stay beside Xmucane while the corn dries.”, hint “Pull your stool up beside hers, and stay.”; ' +
      's2 goal “Wait five days by the corn.”, hint “Fetch the water and wood, and look at the corn each morning. The ' +
      'page will turn the days for you.”',
  },

  // ---------------------------------------------------------------- A31-15
  {
    id: 'a31-15',
    code: 'A31-15',
    title: 'The Performers',
    source: src('the ragged dancers, the wonders, and the lords made small'),
    audience: 'all',
    trigger: { where: WHERE, when: after('A31-14') },
    requires: ['A31-14'],
    speakers: [GRAN, GIRL, HUNAHPU, XBALANQUE, LORDS, ONEDEATH, SEVENDEATH, XMUCANE, XQUIC, FALCON],
    steps: [
      {
        id: 'a31-15-s1',
        goal: 'Watch the two ragged dancers do wonders in Xibalba.',
        hint: 'Follow the crowd to the street where the dancers are. Your Nubbin is minding the curtain rope.',
        check: 'watch:a31-dancers:xibalba',
        scene: {
          id: 'a31-15-dancers',
          lines: [
            N('Two ragged dancers turn up in Xibalba, and nobody knows where they came from. They have very familiar grins.'),
            N('In the street a house burns, and stands up whole. A dog lies down for good, and gets up wagging.'),
            LD('Who are those two? Bring them here. The lords want a show.'),
            XB('Oh no. A show. For lords. We couldn’t possibly.', 'happy'),
            HP('Unless they asked very nicely.'),
            N('Your Nubbin is given a job: minding the curtain rope. It takes the job extremely seriously.'),
            N('The lords sit in a row, the real ones, no wooden ones this time. They clap whenever something burns.'),
          ],
          choices: [
            {
              id: 'rope',
              label: 'Help your Nubbin mind the rope.',
              then: [N('You both hold the rope. It is a very well-minded rope.')],
            },
            {
              id: 'faces',
              label: 'Watch the lords’ faces.',
              then: [N('They look like children at a fair, and that’s almost the worst part. They do want wonders.')],
            },
          ],
        },
      },
      {
        id: 'a31-15-s2',
        goal: 'Watch the last wonder.',
        hint: 'Stay by the curtain. Xbalanque will take the rope from here.',
        check: 'watch:a31-show:curtain',
        scene: {
          id: 'a31-15-curtain',
          lines: [
            OD('Do it to us! Make us a wonder. Then bring us back.', 'happy'),
            SD('Me too. Both of us. Together.'),
            HP('Are you sure?', 'think'),
            OD('Sure! Sure!'),
            N('Xbalanque takes the rope from your Nubbin, gently, and lets the curtain down.'),
            N('When it goes up again, One Death and Seven Death aren’t there: two empty seats. The twins stand in front of them.'),
            N('Nobody brings them back.'),
            HP('I am Hunahpu. This is my brother Xbalanque. Our father is Hun Hunahpu, whom you kept down here.'),
            N('The rest of Xibalba goes down on its knees, all at once, and begs.'),
            LD('Mercy. Please. Mercy.', 'shock'),
            XB('You can have mercy. But not greatness. Not any more.'),
          ],
          choices: [
            {
              id: 'nubbin',
              label: 'Pick up your Nubbin.',
              then: [N('It looks at the empty seats, then at you, as if asking whether all this was right. You hold it close.')],
            },
            {
              id: 'still',
              label: 'Stand still.',
              then: [N('You stand very still. In the whole hall, nobody else does.')],
            },
          ],
        },
      },
    ],
    complete: {
      id: 'a31-15-complete',
      lines: [
        GM('And from that day the lords of Xibalba were small. Not gone. Small.'),
        margin(LIFT_FORBIDDEN),
        GD('No more ball!', 'happy'),
        GM('No more ball. That was the worst thing you could tell a lord. Worse than anything.'),
        N('Somewhere in Xibalba, a ball rolls into a corner and stays there. Nobody is allowed to pick it up.'),
      ],
    },
    rewards: [],
    sets: { 'a31-15': true },
    childLines: { 'a31-15-complete#1': CHILD_FORBIDDEN },
    notes:
      'TOLD, NOT SHOWN: the wonders are a street show (a house burns and stands up whole; a dog lies down and gets up), ' +
      'and the lords’ end is a curtain: when it rises they simply aren’t there. Your Nubbin minds the rope but ' +
      'Xbalanque lowers it; the Nubbin never does the deed. BRANCH (a31-corn). go: these scenes. stay: ' +
      'a31-15-dancers-stay replaces a31-15-dancers (check becomes talk:a31-falcon:wonders) and a31-15-curtain-stay ' +
      'replaces a31-15-curtain (check becomes wait:a31-house:news). The complete is shared. HAZEL’S MARGIN NOTE (reads ' +
      's24Done): if set, play A31_VARIANTS a31-margin-hazel straight after a31-15-complete; if s24Done is set later, ' +
      'it plays the first time the atlas is open at this page afterwards. From then on the note is drawn in pencil ' +
      'beside the empty seats. Its text is exactly the outline’s (unsigned there, so no “H.” line is added). STAY ' +
      'JOURNAL (the step goal and hint on the stay branch): s1 goal “Hear the falcon’s news of the two dancers.”, hint ' +
      '“Wait by the door for the falcon.”; s2 goal “Wait at the house for the end of the show.”, hint “Stay in by the ' +
      'corn until the falcon comes back at dusk.”',
  },

  // ---------------------------------------------------------------- A31-16
  {
    id: 'a31-16',
    code: 'A31-16',
    title: 'The Ballcourt and the Sky',
    source: src('the twins honour their father, and rise as the Sun and the Moon'),
    audience: 'all',
    trigger: { where: WHERE, when: after('A31-15') },
    requires: ['A31-15'],
    speakers: [GRAN, GIRL, HUNAHPU, XBALANQUE, XMUCANE, FALCON],
    steps: [
      {
        id: 'a31-16-s1',
        goal: 'Go with the twins to their father’s resting place.',
        hint: 'Walk to the end wall of the great ballcourt, where the twins are kneeling.',
        check: 'visit:a31-ballcourt:father',
        scene: {
          id: 'a31-16-father',
          lines: [
            N('The twins go to the ballcourt of Xibalba, where their father has lain all this time, by the end wall.'),
            N('There isn’t much to see, only a place in the earth. They kneel by it.'),
            HP('Father. We played. We won.', 'soft'),
            XB('You’ll be remembered. You’ll be the first one people call on. Before anyone, before us. Always.'),
            N('They talk to him a while, telling him the games point by point, the way you tell someone a story they half know.'),
            N('Your Nubbin fetches the ball from the corner, slowly, and puts it down beside the place where he lies.'),
            HP('Thank you, little one. He’d have liked you. He’d have hip-bumped you right off the court.', 'happy'),
          ],
          choices: [
            {
              id: 'kneel',
              label: 'Kneel with them.',
              then: [N('You kneel on the cool earth. It doesn’t feel like a sad place any more; it feels looked after.')],
            },
            {
              id: 'back',
              label: 'Stand back and let them talk.',
              then: [N('You stand back, because some talk is for family. Your Nubbin stands back with you, very straight.')],
            },
          ],
        },
      },
      {
        id: 'a31-16-s2',
        goal: 'Watch the first sunrise.',
        hint: 'Stay where you are and look up. Your Nubbin is already looking.',
        check: 'watch:a31-sunrise:ballcourt',
        scene: {
          id: 'a31-16-rise',
          lines: [
            N('Then the twins stand up, look at each other, grin the same grin, and start to climb.'),
            N('Not up the walls: up into the dark above the court, which is turning grey at one edge, then gold.'),
            N('One of them goes up and becomes the Sun. The other goes up and becomes the Moon.'),
            WHICH_SUN,
            N('After them, rising, come four hundred small lights. You’d know them anywhere: the boys from the house that fell.'),
            N('They spread out across the sky and stay there.'),
            margin(LIFT_STARS),
            N('The first sunlight comes over the edge of the court and lands on the place where their father lies. Then on you, and everything.'),
          ],
          choices: [
            {
              id: 'wave',
              label: 'Wave.',
              then: [N('You wave, which is a silly thing to do at the sun. You do it anyway, and so does your Nubbin, with both paws.')],
            },
            {
              id: 'watch',
              label: 'Just watch.',
              then: [N('You watch until your eyes water. It is the first morning there has ever been.')],
            },
          ],
        },
      },
    ],
    complete: {
      id: 'a31-16-complete',
      lines: [
        N('When the light is all the way up, there is a green stone on a cord lying on the ball by the end wall. Jade, the colour of new corn.'),
        N('It wasn’t there before, and you know exactly who left it. Your Nubbin lets you tie it round its neck, then can’t stop looking down at it.'),
        GM('They were cheeky boys. But they never forgot anyone who fetched for them.', 'soft'),
        SOFT_EDGE,
      ],
    },
    rewards: [
      {
        id: 'a31-jade-pendant',
        kind: 'cosmetic',
        label: 'Jade-green pendant',
        description: 'A green stone on a cord, the colour of new corn. From the twins at the ballcourt, or from Xmucane at her door.',
      },
    ],
    sets: { 'a31-16': true },
    childLines: {
      'a31-16-rise#6': CHILD_STARS,
      'a31-16-rise-stay#5': CHILD_STARS,
    },
    notes:
      'THE SIGNATURE PAYOFF (a31-corn). go: these scenes; the sunrise is watched from the ballcourt by the father’s ' +
      'resting place. stay: a31-16-father-stay replaces a31-16-father (check becomes sit:a31-doorway:xmucane), ' +
      'a31-16-rise-stay replaces a31-16-rise (check becomes watch:a31-sunrise:doorway) and a31-16-complete-stay ' +
      'replaces a31-16-complete: the sunrise from Xmucane’s doorway, beside the green corn, her hand on your shoulder, ' +
      'and her line from the outline. WHICH TWIN IS THE SUN: never said; see WHICH_SUN (advisers decide). The rise is ' +
      'two lights climbing; neither twin is labelled. The “sun and moon” clause of Spence (outline lift 5) is not ' +
      'quoted: in Spence it is said of the father and uncle. RIBBONS (reads s3Done): if set, insert A31_VARIANTS ' +
      'a31-16-ribbons straight after the rise scene (a31-16-rise or a31-16-rise-stay), before the complete. The ' +
      'pendant is one-time, given in whichever complete plays. STAY JOURNAL (the step goal and hint on the stay ' +
      'branch): s1 goal “Sit in the doorway with Xmucane before dawn.”, hint “When the falcon has been, sit on the ' +
      'doorstep beside her.”; s2 goal “Watch the first sunrise from Xmucane’s doorway.”, hint “Stay where you are and ' +
      'look east. Your Nubbin is already looking.”',
  },

  // ---------------------------------------------------------------- A31-17
  {
    id: 'a31-17',
    code: 'A31-17',
    title: 'The Hearth Again',
    source: src('the frame: the story finished'),
    audience: 'all',
    trigger: { where: WHERE, when: after('A31-16') },
    requires: ['A31-16'],
    speakers: [GRAN, GIRL],
    steps: [
      {
        id: 'a31-17-s1',
        goal: 'Hear the end of the story by the hearth.',
        hint: 'Stay on the low stool while the smoke clears.',
        check: 'sit:a31-hearth:again',
        scene: {
          id: 'a31-17-hearth',
          lines: [
            N('The smoke clears. You are on the low stool in the kitchen, with your Nubbin asleep on your feet and a cold tortilla in your hand.'),
            GM('And that’s the story.'),
            GD('Is it true?', 'think'),
            GM('The sun came up this morning, didn’t it?'),
            GD('…Yes.'),
            GM('Then eat a tortilla. Go home.', 'happy'),
            GD('Can I put it in my homework?', 'think'),
            GM('In your own words. Not mine. I’ll know.'),
            GD('How?'),
            GM('I’m a grandmother.'),
            N('Outside the window, the green mountain has the evening on it. Somebody down the road is calling a dog in for its supper.'),
          ],
          choices: [
            {
              id: 'thanks',
              label: 'Thank her for the story.',
              then: [GM('Thank my grandmother. And hers. I only carried it.', 'soft')],
            },
            {
              id: 'again',
              label: 'Ask if you can come back and hear it again.',
              then: [GM('It’ll be here. It’s been here a long time.')],
            },
          ],
        },
      },
      {
        id: 'a31-17-s2',
        goal: 'Give your Nubbin a warm tortilla before you go.',
        hint: 'Take a tortilla from the griddle and give it to your Nubbin.',
        check: 'feed:a31-tortilla:nubbin',
        scene: {
          id: 'a31-17-ball',
          lines: [
            N('The girl has fetched something from under the table: a rubber ball, black and heavy and scuffed all over.'),
            GD('Your little one chased the ball the whole story. I could tell. It kept twitching.', 'happy'),
            GD('No hands. Hips. Like this.'),
            N('She bumps the ball off her hip against the wall, thock, and your Nubbin is awake at once.'),
            N('It hip-bumps the ball back, and the ball goes the wrong way, as usual. The girl laughs so hard she has to sit down.'),
            GD('You can have it. I’ve got another. Mine’s better. Don’t tell it.'),
            GM('Give the little one a tortilla first. Nobody leaves this kitchen hungry.'),
          ],
          choices: [
            {
              id: 'tortilla',
              label: 'Give your Nubbin a warm tortilla.',
              then: [N('It eats it in four bites, slowly, which for a Nubbin is a mark of great respect.')],
            },
            {
              id: 'share',
              label: 'Share it, half and half.',
              then: [N('Half each. The girl says that’s fair, and her grandmother says that’s how it’s done.')],
            },
          ],
        },
      },
    ],
    complete: {
      id: 'a31-17-complete',
      lines: [
        ...HOME_START,
        N('And caught in the atlas’s spine there is an ear of corn, dry and golden, the colour of a long walk in the sun.'),
        ...HOME_END,
      ],
    },
    rewards: [
      {
        id: 'a31-ear-of-corn',
        kind: 'decor',
        label: 'Ear of corn',
        description: 'An ear of corn that hangs from the cottage’s middle beam: golden if you went down with the twins, green if you stayed and watched.',
      },
      {
        id: 'a31-rubber-ball',
        kind: 'item',
        label: 'Rubber ball',
        description: 'A black rubber ball, heavy and scuffed, from a girl in the highlands who says hers is better.',
      },
      {
        id: 'a31-ballgame',
        kind: 'feature',
        label: 'Hip-ball',
        description: 'Nubbins play a hip-bump ballgame on the flat grass by the pond with the rubber ball. No hands allowed.',
      },
    ],
    sets: { 'a31-17': true, 'a31-done': true },
    notes:
      'ENDING (a31-corn). go: a31-17-complete (golden corn). stay: A31_VARIANTS a31-17-complete-stay (green corn). ' +
      'SIM: the ear of corn is a fixed decor on the cottage’s middle beam, coloured by atlasFlag(\'a31-corn\'). The ' +
      'ballgame is an idle behaviour by the pond once the ball is placed there: Nubbins bump it with hips and bellies, ' +
      'never paws; no score, no timer, no reward. The grandmother’s answer is the outline’s, kept short: the frame ' +
      'leaves belief to the family. BYTE (reads s3Done): after a31-done, A31_VARIANTS a31-grove-byte plays once in the ' +
      'Grove (see its header note).',
  },
];

// =================================================================== variants

/**
 * Variant scenes chosen by flags. Each quest’s notes say exactly where each plays.
 *   a31-corn = stay (Atlas, A31-10): the -stay scenes of A31-11 to A31-17 replace the default (go) scenes.
 *   a31-rat (Atlas, A31-9): a31-13-rat-coati | -court (go), a31-13-rat-coati-told | -court-told (stay) (inserts).
 *   s3Done (Grove, read-only): a31-01-ribbons, a31-16-ribbons (inserts); a31-grove-byte (Grove keepsake).
 *   s24Done (Grove, read-only): a31-margin-hazel.
 *
 * GROVE KEEPSAKE (played in the Grove, never in the Atlas; it writes nothing):
 *   a31-grove-byte: once, the first dusk after atlasDone('A31') that Byte is in the Grove, if s3Done. For the
 *   scene your Nubbin plays hip-ball by the pond wearing the Sun and Moon ribbons (drawn on for the scene, as on
 *   the page, so it never waits on the wardrobe). If s3Done is not set it never plays.
 */
export const A31_VARIANTS: Scene[] = [
  // ---------------------------------------------------------------- A31-1, insert (s3Done)
  {
    id: 'a31-01-ribbons',
    lines: [
      N('The girl’s eyes go to your Nubbin’s ribbons: gold and silver, stitched together down the middle in green.'),
      GD('Why’s it got two colours?', 'think'),
      N('Before you can answer, her grandmother hands her a tortilla, and the question goes in with it.'),
    ],
  },

  // ---------------------------------------------------------------- A31-11, stay
  {
    id: 'a31-11-road-stay',
    lines: [
      N('The house is very quiet with the twins gone. Xmucane sweeps the floor round the two ears of corn, carefully, not too close.'),
      XM('Don’t stand on them. Don’t breathe on them. I know. I’m being silly.', 'think'),
      N('Xquic grinds corn at the stone. You fetch water from the river twice, then a third time, because it’s something to do.'),
      N('Your Nubbin sits by the corn and looks at it. The corn looks back, being corn.'),
      XM('They’ll be at the crossroads by now. Their father took the black road. I told him not to.', 'sad'),
      XQ('Did he listen?'),
      XM('Of course not. He was my son.'),
    ],
    choices: [
      {
        id: 'sweep',
        label: 'Take over the sweeping.',
        then: [XM('Hm. You hold the broom the way he did. All wrong.', 'soft')],
      },
      {
        id: 'sit',
        label: 'Sit by the corn with your Nubbin.',
        then: [N('You sit down. Nobody tells you to, and nobody tells you not to.')],
      },
    ],
  },
  {
    id: 'a31-11-lords-stay',
    lines: [
      N('In the evening the falcon lands on the doorpost, out of breath, which falcons hate.'),
      FA('Message. From below. From me, really. I went to look.'),
      FA('They sent a mosquito ahead. It bit every lord on the bench, and the real ones yelled each other’s names.'),
      FA('So the boys said good day to every one of them, by name. And good day to the wooden ones, for manners.'),
      XM('And the bench? The hot one?', 'think'),
      FA('Didn’t sit on it. Said they’d been sitting all the way down.'),
      N('Xmucane laughs once, out loud. Then she puts her hand over her mouth, as if she’s been caught.'),
      XM('Their father sat on it.', 'soft'),
    ],
    choices: [
      {
        id: 'water',
        label: 'Give the falcon some water.',
        then: [FA('Thank you. Nobody ever gives the messenger water.', 'happy')],
      },
      {
        id: 'corn',
        label: 'Look at the corn.',
        then: [N('Green. Both ears, green to the tips.')],
      },
    ],
  },

  // ---------------------------------------------------------------- A31-12, stay
  {
    id: 'a31-12-dark-stay',
    lines: [
      N('That night Xmucane can’t sleep. She sits up by the corn, and you sit with her, and Xquic sleeps against the wall.'),
      XM('They’ll have been given the Dark House tonight. Their father had to keep a torch lit all night. He couldn’t.', 'sad'),
      N('The fire is low. Your Nubbin curls up in its warm patch and watches the corn with one eye.'),
      N('Before dawn Xmucane puts a little copal on the coals. The smoke goes up white and sweet.'),
      XM('My mother did that when anyone was away. So I do.', 'soft'),
      N('The corn stays green. All night, both ears, green.'),
    ],
    choices: [
      {
        id: 'awake',
        label: 'Stay awake with her.',
        then: [N('You stay awake. When your head nods, she pokes you, kindly, and you sit up again.')],
      },
      {
        id: 'feet',
        label: 'Let your Nubbin sleep on your feet.',
        then: [N('It sleeps on your feet, and you don’t move them for hours. Xmucane notices, says nothing, and approves.')],
      },
    ],
  },
  {
    id: 'a31-12-dark-done-stay',
    lines: [XM('Still green.', 'soft'), N('She says it every morning after that. By the third morning you are saying it with her.')],
  },
  {
    id: 'a31-12-houses-stay',
    lines: [
      N('The days are long. You do the things a house needs: water from the river, wood from the hill, weeds from round the one corn plant.'),
      XM('Hoe that row. No, that row. The boys always did the wrong row.', 'think'),
      N('Xquic tells you about Xibalba while you work: the Razor House, the Cold House, the Jaguar House, the Fire House.'),
      XQ('I grew up next door to all of them. They’re not as bad as they sound. They’re worse.', 'think'),
      XQ('But my boys are clever. Cleverer than their father, which I’d never say to her.'),
      N('Every time you come in from outside, the first thing you do is look at the corn. So does everyone.'),
      XM('Still green.', 'soft'),
    ],
    choices: [
      {
        id: 'row',
        label: 'Hoe the wrong row, carefully.',
        then: [XM('…That one’s fine too, I suppose.')],
      },
      {
        id: 'count',
        label: 'Count the leaves on the corn.',
        then: [N('Six on one ear, seven on the other. The next day you count again: still six and seven.')],
      },
    ],
  },

  // ---------------------------------------------------------------- A31-13, rat inserts (go)
  {
    id: 'a31-13-rat-coati',
    lines: [
      N('Behind the coati trots a rat, chest out. It went and fetched her specially.'),
      N('It catches your eye and nods once. Lunch, it seems to say, was remembered.'),
    ],
  },
  {
    id: 'a31-13-rat-court',
    lines: [
      N('Right behind the rabbit goes the rat, who rode all the way down on your Nubbin’s head. It runs between the lords’ legs, squeaking.'),
      RT('Slow! Call that running? I’ve seen faster cheese!', 'happy'),
      N('The lords chase it twice as far. That’s twice as long for Xbalanque.'),
    ],
  },

  // ---------------------------------------------------------------- A31-13, stay
  {
    id: 'a31-13-bats-stay',
    lines: [
      N('In the night you wake, though nobody made a sound. Xmucane is already sitting up, very straight, looking at the corn.'),
      N('One ear has drooped. Its leaves hang down, as if it’s tired, or worse.'),
      XM('No. No, no.', 'sad'),
      N('She doesn’t touch it, and she doesn’t cry. She looks at it, and you look at it, and the fire ticks.'),
      N('Your Nubbin climbs into your lap without being asked, and holds on to your sleeve.'),
      XM('Sit with me. Don’t say anything. There isn’t anything.', 'soft'),
      N('So you don’t. You sit there together with the corn, and nobody says a word for a long time.'),
      N('Then, near dawn, the drooping ear lifts. Slowly, leaf by leaf, as if it’s waking up.'),
      XM('Oh.', 'soft'),
    ],
    choices: [
      {
        id: 'arm',
        label: 'Put your hand on her arm.',
        then: [N('She puts her own hand over yours and leaves it there.')],
      },
      {
        id: 'quiet',
        label: 'Say nothing at all.',
        then: [N('You say nothing. It turns out to be the right thing.')],
      },
    ],
  },
  {
    id: 'a31-13-game-stay',
    lines: [
      N('The falcon comes at noon with its feathers every which way. It is talking before it lands.'),
      FA('A bat took him! Took Hunahpu! Then a coati brought a squash. A squash!', 'shock'),
      FA('And in the game a rabbit ran off with the ball, and everyone chased it, and everything got put back where it belongs.'),
      XQ('Everything?'),
      FA('Everything. He’s fine. Both of them. They burst a squash on the lords. You should have seen their faces.', 'happy'),
      XM('I saw his corn.', 'soft'),
      N('Xmucane gets up and makes tortillas, very fast, far too many, and gives the first one to the falcon.'),
    ],
    choices: [
      {
        id: 'perch',
        label: 'Give the falcon a seat by the fire.',
        then: [N('It sits by the fire with its tortilla and looks, for a falcon, almost cosy.')],
      },
      {
        id: 'tortillas',
        label: 'Help with the tortillas.',
        then: [XM('Yours are the wrong shape. Make more.', 'happy')],
      },
    ],
  },
  {
    id: 'a31-13-rat-coati-told',
    lines: [FA('And a rat went and fetched the coati. Said somebody had shared their lunch with it once, and it doesn’t forget.')],
  },
  {
    id: 'a31-13-rat-court-told',
    lines: [FA('Oh, and a rat. It went down in Hunahpu’s pocket and ran rings round the lords. Kept shouting about cheese.', 'happy')],
  },

  // ---------------------------------------------------------------- A31-14, stay
  {
    id: 'a31-14-oven-stay',
    lines: [
      N('The next day, the corn begins to dry. Not droop: dry, from the tips down, brown and papery.'),
      XM('No.', 'sad'),
      N('By evening both ears are dry all over, and they rattle when the door opens. Xquic shuts it very gently, so they won’t.'),
      N('Xmucane weeps, and doesn’t hide it. She sits on her stool by the dry corn with her hands in her lap, and weeps.'),
      N('You don’t know what to do. So you pull your stool up beside hers, and stay.'),
      N('Your Nubbin goes and sits right beside the dry corn, close, as if it is keeping it company.'),
      XQ('They said: if it does both, we’re being clever.', 'soft'),
      XM('I know what they said.', 'sad'),
    ],
    choices: [
      {
        id: 'stay',
        label: 'Stay beside her.',
        then: [N('You stay. The fire goes down, and you build it up again, and you stay.')],
      },
      {
        id: 'xquic',
        label: 'Sit with Xquic instead.',
        then: [N('Xquic leans her head on your shoulder. She’s their mother, and she’s frightened too, and nobody has asked her.')],
      },
    ],
  },
  {
    id: 'a31-14-river-stay',
    lines: [
      N('One day, two. Xmucane gets up each morning, and looks, and sits down again.'),
      N('Three days, four. You bring the water and the wood, and nobody says a word about the corn, which is the loudest thing in the house.'),
      N('On the fifth morning your Nubbin wakes you by sitting on your face. It turns your head with both paws, towards the middle of the house.'),
      N('A green shoot, then another. Both ears, green from the earth up.'),
      XM('Oh, you clever, clever boys.', 'happy'),
      XQ('Five days. They promised. They always keep the silly promises.', 'happy'),
      margin(LIFT_RIVER),
    ],
    choices: [
      {
        id: 'laugh',
        label: 'Laugh out loud.',
        then: [N('You laugh, and Xquic laughs, and your Nubbin runs round the corn three times for no reason at all.')],
      },
      {
        id: 'hug',
        label: 'Hug Xmucane.',
        then: [XM('Get off. No. Stay there a minute.', 'soft')],
      },
    ],
  },

  // ---------------------------------------------------------------- A31-15, stay
  {
    id: 'a31-15-dancers-stay',
    lines: [
      N('The corn grows. It grows faster than corn grows, a leaf a day, and Xmucane talks to it while she works.'),
      XM('Eat something. You’re too thin. Tell your brother to wear a hat.'),
      N('The falcon comes again, and this time it lands properly, folds its wings, and looks pleased with itself.'),
      FA('Two dancers have turned up in Xibalba. Ragged ones. They burn houses down, and the houses are fine.'),
      XQ('Two of them?'),
      FA('Two. With grins.'),
      XM('Oh, I know those grins.', 'happy'),
    ],
    choices: [
      {
        id: 'again',
        label: 'Ask the falcon to go and look again.',
        then: [FA('I was going anyway. I want to see how it ends.')],
      },
      {
        id: 'tell',
        label: 'Tell the corn the news.',
        then: [N('You tell the corn, and Xmucane doesn’t laugh at you. She adds a bit you forgot.')],
      },
    ],
  },
  {
    id: 'a31-15-curtain-stay',
    lines: [
      N('You wait all day. Xquic grinds enough corn for a feast for twenty.'),
      N('At dusk the falcon comes back slowly, sits on the doorpost, and for a while doesn’t say anything.'),
      FA('The lords asked for the wonder to be done to them. The boys did it. And then they didn’t bring them back.'),
      N('Nobody in the house says anything. Outside, the wind goes over the corn on the hill.'),
      FA('The rest of them begged. The boys said: mercy, yes. Greatness, no.'),
      XM('Good boys. Hard, but good.', 'soft'),
    ],
    choices: [
      {
        id: 'xquic',
        label: 'Look at Xquic.',
        then: [N('Xquic is very still. She grew up down there, and some of the ones on their knees are people she knew.', 'sad')],
      },
      {
        id: 'corn',
        label: 'Look at the corn.',
        then: [N('Green and tall. Waiting, like you.')],
      },
    ],
  },

  // ---------------------------------------------------------------- Hazel's margin note (s24Done)
  {
    id: 'a31-margin-hazel',
    lines: [
      N('Nova’s atlas lies open at the hall of Xibalba: two empty seats, and a curtain half up.'),
      N('In the margin, in faint pencil you have never noticed, there is a note. You know the hand.'),
      N('“Two boys who beat Death by being cheeky to it. My kind of boys.”'),
      N('Your Nubbin looks at the note for a long time. Then it looks at you, as if asking whether it’s allowed to laugh, and it is.'),
    ],
  },

  // ---------------------------------------------------------------- A31-16, stay
  {
    id: 'a31-16-father-stay',
    lines: [
      N('The corn is taller than the stools now. Nobody pretends not to look at it.'),
      N('The falcon comes for the last time, at night, and lands on Xmucane’s knee, which it has never done before.'),
      FA('They’re at the ballcourt. Their father’s place. They’re telling him everything. Every point.', 'soft'),
      XM('He always liked to hear the score.', 'soft'),
      FA('They told him he’ll be remembered. Called on first, before anyone. Before them.'),
      XM('Good. That’s right. That’s how it should be.'),
      N('She takes your hand without looking, the way you’d take a rail on the stairs.'),
      XM('Come and sit in the door. It’ll be morning soon. I want to see it.'),
    ],
    choices: [
      {
        id: 'door',
        label: 'Sit in the doorway with her.',
        then: [N('The doorstep is still warm from yesterday. You sit, and she sits, and the dark goes on a while longer.')],
      },
      {
        id: 'nubbin',
        label: 'Bring your Nubbin out too.',
        then: [N('It sits between you on the doorstep, facing east, as if it knows something.')],
      },
    ],
  },
  {
    id: 'a31-16-rise-stay',
    lines: [
      N('From Xmucane’s doorway the whole world is dark mountains, with a grey line along the top of them.'),
      N('Behind you, in the middle of the house, the corn stands up green in the dark.'),
      N('Then two lights come up out of the earth, far away, and climb. One becomes the Sun, and the other the Moon.'),
      WHICH_SUN,
      N('After them come four hundred small lights, rising and spreading out, until the sky is full of them.'),
      margin(LIFT_STARS),
      N('The first sunlight comes over the mountain and through the door, and lands on the corn. Xmucane’s hand is on your shoulder.'),
      XM('There they are. There they both are.', 'happy'),
    ],
    choices: [
      {
        id: 'wave',
        label: 'Wave.',
        then: [N('You wave at the sun. After a moment Xmucane waves too, as if nobody is watching, and nobody is but your Nubbin.')],
      },
      {
        id: 'still',
        label: 'Stay still under her hand.',
        then: [N('You don’t move, and neither does she. The sun gets on with it.')],
      },
    ],
  },
  {
    id: 'a31-16-complete-stay',
    lines: [
      XM('You watched the corn with me. That’s the hard part. The boys only had to be clever.', 'soft'),
      N('She takes something from round her own neck: a green stone on a cord, jade, the colour of new corn. She ties it on your Nubbin.'),
      XM('For sitting up. Nobody gives you anything for sitting up. They should.'),
      SOFT_EDGE,
    ],
  },

  // ---------------------------------------------------------------- A31-16, insert (s3Done)
  {
    id: 'a31-16-ribbons',
    lines: [
      N('For a moment the smoke parts, and you’re back in the kitchen. The girl is pointing at your Nubbin’s ribbons.'),
      GD('Look. Look! It’s both. Sun and Moon, sewn together down the middle.', 'happy'),
      GM('So it is. Somebody sewed that very carefully.', 'soft'),
      N('Then the smoke closes again, and you’re back in the sunrise.'),
    ],
  },

  // ---------------------------------------------------------------- A31-17, stay
  {
    id: 'a31-17-complete-stay',
    lines: [
      ...HOME_START,
      N('And caught in the atlas’s spine there is an ear of corn, still green, the colour of a house where somebody waited.'),
      ...HOME_END,
    ],
  },

  // ---------------------------------------------------------------- Grove keepsake (s3Done)
  {
    id: 'a31-grove-byte',
    lines: [
      N('Byte is by the pond, watching your Nubbin play hip-ball. Its ribbons flap as it bumps: gold and silver, green down the middle.'),
      N('The sun is going down behind the hill. On the other side, the moon is already up.'),
      BY('Same sky. It was always the same sky. I’d like that read into the record.'),
      N('He goes back to his notebook. He doesn’t write anything down, though.'),
    ],
  },
];

// =================================================================== flags and checks

/** Every flag this line sets (Atlas save only). It reads Grove state and writes no Grove flag. */
export const ATLAS_A31_FLAGS: string[] = [
  'a31-01',
  'a31-02',
  'a31-03',
  'a31-04',
  'a31-05',
  'a31-06',
  'a31-07',
  'a31-08',
  'a31-09',
  'a31-10',
  'a31-11',
  'a31-12',
  'a31-13',
  'a31-14',
  'a31-15',
  'a31-16',
  'a31-17',
  'a31-done', // A31-17: the whole page; read by atlasDone('A31') (the corn decor, the Byte keepsake)
  'a31-rat', // share | twins | come (a31-09-roof): A31-13’s rat inserts
  'a31-corn', // stay | go (a31-10-corn): A31-11 to A31-17, and the corn on the cottage beam
];

/** Every check string: the step checks, then the stay branch’s replacement checks (see each quest’s notes). */
export const ATLAS_A31_CHECKS: string[] = [
  'visit:a31-kitchen:highlands',
  'sit:a31-stool:hearth',
  'watch:a31-ballgame:fathers',
  'carry:a31-ball:court',
  'watch:a31-road:empty',
  'inspect:a31-gourd-tree:road',
  'watch:a31-xquic:tree',
  'escort:a31-xquic:forest',
  'craft:a31-sap-heart:forest',
  'escort:a31-xquic:xmucane-house',
  'visit:a31-garden:one-plant',
  'carry:a31-net:xmucane-house',
  'talk:a31-twins',
  'watch:a31-tree:grows',
  'wait:a31-brothers:house',
  'watch:a31-macaw:tree',
  'carry:a31-white-corn:macaw-house',
  'craft:a31-crab:ravine',
  'watch:a31-zipacna:mountain',
  'collect:a31-clay:riverbank',
  'watch:a31-tools:garden',
  'wait:a31-garden:night',
  'deliver:a31-water-jar:river',
  'watch:a31-relay:messengers',
  'place:a31-corn:house-middle',
  'walk:a31-road:crossroads',
  'watch:a31-mosquito:lords',
  'wait:a31-dark-house:night',
  'explore:a31-houses:xibalba',
  'wait:a31-bat-house:night',
  'watch:a31-ballgame:xibalba',
  'watch:a31-oven:glow',
  'wait:a31-river:five-days',
  'watch:a31-dancers:xibalba',
  'watch:a31-show:curtain',
  'visit:a31-ballcourt:father',
  'watch:a31-sunrise:ballcourt',
  'sit:a31-hearth:again',
  'feed:a31-tortilla:nubbin',
  // stay branch (a31-corn = stay) replacements
  'wait:a31-house:morning',
  'talk:a31-falcon:door',
  'watch:a31-corn:night',
  'carry:a31-water:river',
  'watch:a31-corn:droop',
  'talk:a31-falcon:noon',
  'watch:a31-corn:dried',
  'wait:a31-corn:five-days',
  'talk:a31-falcon:wonders',
  'wait:a31-house:news',
  'sit:a31-doorway:xmucane',
  'watch:a31-sunrise:doorway',
];
