/**
 * Atlas campaign, page A16: The Fox and the Rose (Part M, rank 10). Seventeen quests, A16-1 to A16-17.
 *
 * SOURCE. Antoine de Saint-Exupéry, Le Petit Prince (Reynal & Hitchcock, New York, 1943; Gallimard,
 * Paris, 1946). Rights: under US copyright until the end of 2038 (Part M: "until 2039"). The
 * text, the author's own watercolours and the "Little Prince" name and trade marks belong to the
 * Saint-Exupéry estate (Succession Antoine de Saint-Exupéry-d'Agay) and its licensees; Gallimard
 * publishes the French text, and the Woods (1943) and Richard Howard (2000) translations are
 * separately in copyright. Terms outside the US vary (France extends them for authors "mort pour la France"), so treat it as
 * copyrighted everywhere. Part M lists this page among those that NEED A LICENCE TO SHIP: the quote
 * limit covers the words, not the characters. Get a legal check before ship. "Little Prince" stays
 * out of the page title and the speaker names (he is "The Prince"); the source field may name
 * the book.
 *
 * AUDIENCE. 'all'. The three lifted lines each have a `childLines` replacement for the Learning
 * Grove. The Learning Grove's own version (reader band only, ending at the well) is not in this
 * file.
 *
 * FRAME. Nova's atlas falls open at a nearly empty page: one small planet, one chair, a sunset.
 * You and your Nubbin step into the Sahara, a few dunes from a pilot's crashed plane. You are a
 * second stranger in the desert. The pilot and the prince keep their story. You hand tools,
 * carry things, sit and listen. Your Nubbin sits on the box with the sheep in it, and neither of
 * you can see the sheep. The prince tells his travels by the plane at night (A16-3 to A16-14),
 * and the telling carries you into each of them as he tells it. The fox, the snake, the flowers,
 * the roses and the echo talk, as the book's do (canon 31): the Atlas is not the Grove. Your Nubbin
 * and Sable never talk. Running motifs: your Nubbin can see insides (the elephant in the snake,
 * A16-1), and it sits on the sheep's box.
 *
 * GROVE STATE READ (read-only; the Atlas never writes a Grove flag):
 *   - SABLE'S STAGE, read when A16-1, A16-13, A16-15 and A16-16 start, and when you step out of
 *     the page after A16-17:
 *       none   = no Sable in the Grove (before chapter 3, or Sable is gone).
 *       t20    = Sable is in the Grove, not bonded, trust under 45 (this includes trust 10–19).
 *       t45    = trust 45 or more, not bonded.
 *       bonded = Sable is bonded.
 *     none and t20: she doesn't come into the page. t45: she comes and stays in your shadow.
 *     bonded: she walks at your heel. Wherever she has come, the art shows her in every scene;
 *     the script names her only in the variants below. She never speaks: narration only.
 *       A16-1:  a16-01-desert-t45 / a16-01-desert-bonded replace a16-01-desert.
 *       A16-13: a16-13-fox-t45 / a16-13-fox-bonded replace a16-13-fox; a16-13-hour-t45 replaces
 *               a16-13-hour; a16-13-hour-done-t20 / -t45 / -bonded replace a16-13-hour-done
 *               (the base is for none: "the hill where something small and grey once watched").
 *       A16-15: a16-15-well-done-bonded replaces a16-15-well-done (Sable drinks first).
 *       A16-16: a16-16-lean-bonded plays after a16-16-wall-done (she leans on your shin).
 *       After A16-17, in the Grove: a16-grove-t20 (stage t20 then); a16-grove-luna (a16-sable).
 *
 * FLAGS WRITTEN (Atlas save only, all prefixed a16-):
 *   - a16-01 … a16-17 on each quest; a16-done on A16-17 (the Night of Remembering festival and the
 *     Grove scenes read it through atlasDone('A16')).
 *   - a16-strap = asked | left (A16-2, a16-02-muzzle): the muzzle, paid off in A16-16 and A16-17.
 *   - a16-globe = free | glass (A16-5, a16-05-goodbye): paid off in A16-13, A16-16 and A16-17.
 *   - a16-sable = came: set by the Sable variants of A16-1 and A16-13. The Grove's Luna scene
 *     reads it (atlasFlag, read-only).
 *   Endings: free or glass × asked or left = four last pages (a16-17-complete*).
 *
 * LIFTED TEXT (copyrighted: three one-sentence lines, the most allowed, all spoken by the fox in
 * ch. XXI, in the French original with our own English, exactly as Part M lists them. Part M
 * rechecked the French on 2026-10-14 against a course copy of ch. XXI. Set with the game's curly
 * apostrophes and guillemets with no-break spaces). Neither the Woods nor the Howard translation
 * is used anywhere:
 *   1. «L'essentiel est invisible pour les yeux.» / "What matters most can't be seen with the
 *      eyes." a16-13-secret#9.
 *   2. «C'est le temps que tu as perdu pour ta rose qui fait ta rose si importante.» / "It's the
 *      time you gave your rose that makes your rose so important." a16-13-secret#11.
 *   3. «Tu deviens responsable pour toujours de ce que tu as apprivoisé.» / "You become
 *      responsible, forever, for what you have tamed." a16-13-secret#13.
 * Each is used once. Every other line is original. The book's famous lines (the sheep "asleep",
 * "grown-ups are odd", the drinker's circle, the businessman's sums, "orders are orders", the
 * wheat speech, "only the children know", the laughing-stars speech, the prince's "responsible
 * for my rose") are told in our own words or left out.
 *
 * CARE NOTES.
 *   - The snake. The book leaves the prince's death uncertain, and so does this page. The bite is
 *     never shown, named or hinted at: no "bite", "poison" or "die" anywhere. In A16-11 the snake
 *     speaks in riddles; in A16-16 it is only a thin gold line in the sand at the foot of the wall,
 *     and it pours away without striking. In A16-16 the prince asks you to look at the stars; the
 *     camera lifts to the sky, and when it comes down he is lying softly in the sand. Nothing more.
 *     In A16-17 there is nothing in the sand, and the pilot says he went home to his rose. Never
 *     "he died".
 *   - Parent note for under-10s: optional, before A16-16 (text in A16-16's notes). The Learning
 *     Grove version stops at the well and skips A16-16 and A16-17.
 *   - The same-hour ritual (A16-13) runs only on the page's own clock: a desert day there lasts a
 *     few minutes, and the hour is shown by the apple tree's shadow touching a white stone. Never
 *     the real clock, never "come back tomorrow".
 *   - The prince's grown-ups are gentle satire: comic, not cruel. The drinker is played sad, not
 *     funny: plain bottles, no hiccups, no slurring.
 *   - All art is original. Saint-Exupéry's watercolours are copyrighted too: no copy of his
 *     prince (no green suit, no gold-scarf silhouette), his boa drawings, his B-612, his fox or his
 *     baobabs. Our scarves, planets and drawings are our own.
 *   - Hazel's third rule is acted out (A16-12, the rose garden) and never quoted.
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

const WHERE = 'Nova’s atlas: the Fox and the Rose page (Atlas campaign)';
const after = (code: string) => `Any time after ${code}, from Nova’s atlas.`;
const BOOK = 'Le Petit Prince (Antoine de Saint-Exupéry, 1943)';

// ------------------------------------------------------------------ speakers

const PILOT = sp('a16-pilot', 'The Pilot', 'the aviator who tells the story in Le Petit Prince (1943); original design');
const PRINCE = sp('a16-prince', 'The Prince', 'the little prince of asteroid B-612 (Le Petit Prince, 1943); original design');
const ROSE = sp('a16-rose', 'The Rose', 'the prince’s rose (Le Petit Prince, 1943); original design');
const KING = sp('a16-king', 'The King', 'the king of asteroid 325 (Le Petit Prince, ch. X); original design');
const VAIN = sp('a16-vain', 'The Man in the Hat', 'the vain man (Le Petit Prince, ch. XI); original design');
const DRINKER = sp('a16-drinker', 'The Drinker', 'the drinker (Le Petit Prince, ch. XII); original design');
const BUSINESS = sp('a16-business', 'The Businessman', 'the businessman (Le Petit Prince, ch. XIII); original design');
const LAMP = sp('a16-lamplighter', 'The Lamplighter', 'the lamplighter (Le Petit Prince, ch. XIV); original design');
const GEO = sp('a16-geographer', 'The Geographer', 'the old geographer (Le Petit Prince, ch. XV); original design');
const SNAKE = sp('a16-snake', 'The Snake', 'the yellow snake (Le Petit Prince, ch. XVII and XXVI); original design');
const FLOWER = sp('a16-flower', 'The Desert Flower', 'the three-petalled flower (Le Petit Prince, ch. XVIII); original design');
const ECHO = sp('a16-echo', 'The Echo', 'the mountain echo (Le Petit Prince, ch. XIX)');
const ROSES = sp('a16-roses', 'The Roses', 'the garden of roses (Le Petit Prince, ch. XX); original design');
const FOX = sp('a16-fox', 'The Fox', 'the fox (Le Petit Prince, ch. XXI); original design');
const SWITCH = sp('a16-switchman', 'The Switchman', 'the railway switchman (Le Petit Prince, ch. XXII); original design');
const MERCHANT = sp('a16-merchant', 'The Merchant', 'the merchant of thirst pills (Le Petit Prince, ch. XXIII); original design');

const N = say('narrator');
const Y = say('you');
const PI = say('a16-pilot');
const PR = say('a16-prince');
const RO = say('a16-rose');
const KI = say('a16-king');
const VA = say('a16-vain');
const DR = say('a16-drinker');
const BU = say('a16-business');
const LA = say('a16-lamplighter');
const GE = say('a16-geographer');
const SN = say('a16-snake');
const FL = say('a16-flower');
const EC = say('a16-echo');
const RS = say('a16-roses');
const FX = say('a16-fox');
const SW = say('a16-switchman');
const ME = say('a16-merchant');
const LU = say('luna');
const SPK = say('sparks');

// ------------------------------------------------------------------ lifted text (copyrighted, three lines)

/** Ch. XXI, the fox. French original (1943), with our own English. Lift 1 of 3. */
const LIFT_ESSENTIAL = '« L’essentiel est invisible pour les yeux. » What matters most can’t be seen with the eyes.';
/** Ch. XXI, the fox. French original (1943), with our own English. Lift 2 of 3. */
const LIFT_TIME =
  '« C’est le temps que tu as perdu pour ta rose qui fait ta rose si importante. » It’s the time you gave your rose that makes your rose so important.';
/** Ch. XXI, the fox. French original (1943), with our own English. Lift 3 of 3. */
const LIFT_TAMED =
  '« Tu deviens responsable pour toujours de ce que tu as apprivoisé. » You become responsible, forever, for what you have tamed.';

// ------------------------------------------------------------------ shared pieces

/** A16-1: the opening of a16-01-desert, before any Sable line. */
const A1_OPEN: Line[] = [
  N('Nova’s atlas falls open at a page that is nearly empty: one small round planet, one chair, and a sunset going on behind it.'),
  N('You touch the sunset. It is warm the way sand is warm, and then it is sand, and you are standing in it.'),
  N('Dunes in every direction, and a sky so clean it looks scrubbed. Your Nubbin sneezes at the size of it.'),
];

/** A16-1: the rest of a16-01-desert. */
const A1_REST: Line[] = [
  N('A few dunes off, a small aeroplane sits nose-down in the sand. A pair of legs sticks out from under the engine.'),
  PI('Unless you’re a mechanic, don’t come any closer. If you are, come quickly.', 'think'),
  N('He slides out on his back: a man with oil to the elbows and a face that hasn’t slept.'),
  PI('You’re the last thing I expected. I’m days from anywhere, and I’ve water for about eight of them.'),
  PI('Where did you come from? No. Don’t tell me. I’ve stopped expecting sensible answers out here.'),
];

const A1_CHOICES = [
  {
    id: 'spanner',
    label: 'Offer to hold the spanner.',
    then: [PI('Hold it, and don’t hand it to me unless I ask. I have a system. It’s mostly muttering.')],
  },
  {
    id: 'hurt',
    label: 'Ask if he’s hurt.',
    then: [PI('Only my pride. And the engine. The engine’s worse.', 'soft')],
  },
  {
    id: 'shade',
    label: 'Sit down in the shade of the wing.',
    then: [N('You sit, and your Nubbin sits. After a moment the man sits too, because it seems rude not to.')],
  },
];

/** A16-13: the fox's first scene, after its opening line. */
const A13_FOX_OPEN: Line[] = [N('The fox sits in the grass under the apple tree, tail wrapped round its feet, and comes no nearer.')];
const A13_FOX_REST: Line[] = [
  PR('Come and play with me. Please. I’ve had a very bad day.', 'sad'),
  FX('Play? I can’t. Nobody’s tamed me.'),
  PR('Tamed?'),
  FX('It’s an old word. Nobody uses it properly any more. It means you make ties with someone, slowly, one at a time.'),
  FX('Right now you’re one more pair of feet on the sand, to me. And I’m one more fox. There are plenty of both.'),
  FX('Tame me, and I’ll know your step from every other step in the world. And you’ll need me. And I’ll need you.'),
  FX('Every day here is the same day. Hens, hunters, hens. A friend would make the days different.'),
  PR('I don’t know how to tame anybody. I don’t think I know how to be tamed, either.', 'sad'),
];
const A13_FOX_CHOICES = [
  {
    id: 'how',
    label: 'Ask the fox how it’s done.',
    then: [FX('Patience. That’s nearly all of it. I’ll show you.')],
  },
  {
    id: 'hand',
    label: 'Hold out your hand to the fox.',
    then: [N('The fox leans back all at once, ears flat.'), FX('Too fast. That’s the first thing. Never quick.')],
  },
  {
    id: 'sniff',
    label: 'Let your Nubbin sniff the air.',
    then: [N('Your Nubbin sniffs, and the fox sniffs back. Neither moves an inch, and it seems to be going rather well.')],
  },
];

/** A16-13: the same-hour lesson, before it is played out. */
const A13_HOUR_RULES: Line[] = [
  FX('You must be very patient. First you sit down a little way off, like that, in the grass.'),
  FX('Don’t look straight at me, and don’t talk. Talking gets in the way.'),
  FX('And come at the same hour each day. When the apple tree’s shadow touches that white stone.'),
  PR('Why the same hour?'),
  FX('So I know you’re coming. From the moment the shadow starts to move, I’ll be happy already.'),
  FX('If you come any old time, I won’t know when to start looking forward. Looking forward is half of it.'),
  N('Days on this page are short: a few minutes from sunrise to stars. You watch the shadow crawl towards the white stone.'),
];

/** A16-13: the first line of every a16-13-hour-done version. */
const A13_HOUR_DONE: Line = N(
  'The fox lets the boy put a hand on its head. Soon they are sitting together, looking at the same sunset.',
);

/** A16-16: the stars gift, before the keepsake. */
const A16_STARS_OPEN: Line[] = [
  PR('I’m going to give you a present. All of them. All the stars.', 'happy'),
  PR('One of them will be mine. I’ll be laughing on it. You won’t know which, so you’ll have to listen to all of them.', 'happy'),
  N('He laughs, right then, and it is the nicest sound you have heard in the desert.'),
];
const A16_STARS_ASK: Line = PR('Will you do something for me? Look up at the stars. Just for a bit. Don’t look at me.', 'soft');
const A16_STARS_CHOICES = [
  { id: 'look', label: 'Look up at the stars.', then: [N('You look up.')] },
  {
    id: 'hand',
    label: 'Hold his hand first, then look up.',
    then: [N('You hold his hand for a moment, small and warm. Then he lets go, and you look up.')],
  },
];

/** A16-17: the last page, in parts. Four endings: free or glass × asked or left. */
const A17_START: Line[] = [
  N('The desert is very big and very quiet. You sit down on your box with holes, with your Nubbin on your knee.'),
  N('The first stars come out. You look up, and you wonder whether the sheep has eaten the flower.'),
];
const A17_ASKED: Line[] = [
  N('No: the muzzle had a strap and a buckle, and the pilot didn’t forget. The rose is safe.'),
  N('You listen, and all the stars are laughing.', 'happy'),
];
const A17_LEFT: Line[] = [
  N('The muzzle had no strap. Perhaps he tied it on with something, or perhaps the sheep shook it off in the night.'),
  N('Some nights, when you look up, all the stars are laughing, and some nights they aren’t. You never know which it will be.', 'soft'),
];
const A17_PETAL: Line = N('You step out of the page with the pilot’s notebook page in your hand. Pressed flat inside it, a little red still shows.');
const A17_GLASS: Line = N('You step out of the page with the glass globe in both hands. It is empty and clear, and you will never put it over anything.');
const A17_PICTURE_ASKED: Line = N('On the atlas page there is one small planet, one chair and one rose, and above them, drawn small, the stars are laughing.');
const A17_PICTURE_LEFT: Line = N('On the atlas page there is one small planet, one chair and one rose. Above them the stars are drawn, and among them, a question mark.');

// =================================================================== THE FOX AND THE ROSE

export const ATLAS_A16: Quest[] = [
  // ---------------------------------------------------------------- A16-1
  {
    id: 'a16-01',
    code: 'A16-1',
    title: 'Drawing Number One',
    source: `${BOOK}, ch. I–II: the drawing and the crash`,
    audience: 'all',
    trigger: {
      where: WHERE,
      when: 'Any time once Nova’s atlas is in the Grove; the first quest on the page. Not before the licence is in place.',
    },
    speakers: [PILOT],
    steps: [
      {
        id: 'a16-01-s1',
        goal: 'Step into the desert page and find the stranger under the plane.',
        hint: 'Touch the little planet on the page, then walk towards the plane in the dunes.',
        check: 'explore:a16-desert:plane',
        scene: {
          id: 'a16-01-desert',
          lines: [...A1_OPEN, ...A1_REST],
          choices: A1_CHOICES,
        },
        done: {
          id: 'a16-01-desert-done',
          lines: [
            N('He goes back under the engine. Every so often a hand comes out for a tool and goes back in again.'),
            PI('When I’ve got this running, I’ll show you something. Nobody’s ever got it right. Not once.'),
          ],
        },
      },
      {
        id: 'a16-01-s2',
        goal: 'Look at the pilot’s first drawing, and say what you see.',
        hint: 'Sit by the pilot when he takes out his notebook at noon.',
        check: 'inspect:a16-drawing:notebook',
        scene: {
          id: 'a16-01-drawing',
          lines: [
            N('At noon the sun is too high to work in. The pilot crawls out, wipes his hands, and takes a battered notebook from his jacket.'),
            PI('When I was six, I drew this. My first drawing. I showed it to every grown-up I knew.'),
            N('It is a brown shape like a hill, or a lump, or a hat with a very low crown.'),
            PI('I asked them if it frightened them. They all said, why would anybody be frightened of a hat?'),
            PI('So now I show it to everyone I meet. It’s a test. Go on. What is it?'),
            N('Your Nubbin climbs onto your knee to see. It looks at the drawing for a long time, with its head on one side.'),
          ],
          choices: [
            {
              id: 'hat',
              label: 'Say it’s a hat.',
              then: [PI('Of course it is. Everybody says so.', 'sad'), N('But your Nubbin is still looking.')],
            },
            {
              id: 'wait',
              label: 'Wait for your Nubbin.',
              then: [N('You wait, and the pilot waits. Your Nubbin is in no hurry at all.')],
            },
            {
              id: 'inside',
              label: 'Say it looks like something with something inside it.',
              then: [PI('Go on…', 'think')],
            },
          ],
        },
        done: {
          id: 'a16-01-drawing-done',
          lines: [
            N('Your Nubbin puts one paw on the lump and traces it: a long body, a tail, and in the middle a great round bulge with a trunk.'),
            N('Then it lies down flat on its tummy and tries to look as full as possible.'),
            PI('A snake. A snake that has swallowed an elephant whole.', 'shock'),
            PI('Twenty-odd years. Twenty-odd years, and the first one to see it is… that.', 'happy'),
          ],
        },
      },
    ],
    complete: {
      id: 'a16-01-complete',
      lines: [
        N('He turns the page. There is the same snake again, drawn open like a map, with a very calm elephant inside.'),
        PI('I had to draw them the inside. Grown-ups always need it explained.'),
        PI('After that they told me to stop drawing and learn something useful. So I learnt to fly. Which is how I got here.'),
        N('He looks at the nose-down plane and laughs, which you didn’t expect.'),
        PI('Stay, if you like. It’s a big desert. There’s room in it for two strangers. Three, with that one.'),
      ],
    },
    rewards: [],
    sets: { 'a16-01': true },
    notes:
      'OPENING: the atlas page is nearly blank (a small planet, a chair, a sunset, our own drawing) and turns to warm sand ' +
      'under your hand. SABLE (read when this quest starts): for t45 play ATLAS_A16_VARIANTS a16-01-desert-t45, for bonded ' +
      'a16-01-desert-bonded, in place of a16-01-desert; both set a16-sable = came. From then on the art shows her in your ' +
      'shadow (t45) or at your heel (bonded) in every scene of the page. Drawing Number One and Two are our own drawings ' +
      '(a brown hat-shape; the same opened up, an elephant inside), never Saint-Exupéry’s. Your Nubbin’s "full" pose is an ' +
      'idle animation it keeps on this page.',
  },

  // ---------------------------------------------------------------- A16-2
  {
    id: 'a16-02',
    code: 'A16-2',
    title: 'Draw Me a Sheep',
    source: `${BOOK}, ch. II: the sheep in the box`,
    audience: 'all',
    trigger: { where: WHERE, when: after('A16-1') },
    requires: ['A16-1'],
    speakers: [PILOT, PRINCE],
    steps: [
      {
        id: 'a16-02-s1',
        goal: 'Spend the night by the plane, and see who comes at sunrise.',
        hint: 'Rest in the shade of the wing until the page’s dawn.',
        check: 'wait:a16-plane:dawn',
        scene: {
          id: 'a16-02-dawn',
          lines: [
            N('That night you sleep on the sand by the wing. There are so many stars that the dark between them looks crowded.'),
            N('At sunrise a small voice wakes the pilot. It is quite a polite voice, and quite certain.'),
            PR('Please. Would you draw a sheep for me?'),
            N('A boy is standing in the sand. He has a long scarf, a serious face, and not a speck of dust on him anywhere.'),
            PI('A what?'),
            PR('A sheep. Please. If you’re not too busy.', 'soft'),
            N('The pilot looks at the desert, and the plane, and the boy, who is days from anywhere and doesn’t seem to mind.'),
            PI('I can’t really draw. I only ever learnt the one. Here.'),
            N('He draws the snake with the elephant inside it, from the outside, and hands it over with a shrug.'),
            PR('No, not an elephant in a snake. Snakes are dangerous, and elephants take up far too much room. A sheep.'),
            N('The pilot’s mouth falls open. Your Nubbin looks very pleased, as if it has found a cousin.'),
          ],
          choices: [
            {
              id: 'sit',
              label: 'Sit down to watch.',
              then: [N('You sit cross-legged in the sand. The boy sits too, opposite, and waits for his sheep as if it were a bus.')],
            },
            {
              id: 'hello',
              label: 'Say hello to the boy.',
              then: [PR('Hello. Can you draw sheep?'), Y('No. Sorry.'), PR('That’s all right. Nobody can, it seems.')],
            },
          ],
        },
      },
      {
        id: 'a16-02-s2',
        goal: 'Watch the pilot try to draw a sheep good enough.',
        hint: 'Stay by the boy while the pilot draws.',
        check: 'watch:a16-sheep:drawings',
        scene: {
          id: 'a16-02-drawings',
          lines: [
            N('The pilot draws a sheep. The boy studies it with great care.'),
            PR('No. That one’s poorly already. Another, please.'),
            N('He draws a second, fluffier sheep. The boy smiles kindly, the way you smile at a mistake.'),
            PR('That one has horns. That’s a ram. I asked for a sheep.'),
            N('The third is a small, neat sheep with a tidy face.'),
            PR('He’s nearly worn out, that one. Mine has to last.', 'sad'),
            N('The pilot looks at his engine, which is waiting, and at the sun, which is climbing. He scribbles four quick lines.'),
            PI('This is a box. The sheep you want is inside.'),
            N('It is a plain box with three holes in the side. The boy’s whole face lights up.'),
            PR('That’s him! That’s exactly him! Will he need much grass?', 'happy'),
            PI('Why?'),
            PR('Where I live, there isn’t much room for grass. Or for anything.'),
            N('He bends close to the holes, and whispers, so as not to wake anybody.'),
            PR('Shh. He’s asleep already.', 'soft'),
          ],
        },
        done: {
          id: 'a16-02-drawings-done',
          lines: [
            N('Your Nubbin climbs onto the box and sits on the lid, very gently, as if it might be someone’s bed.'),
            N('Neither of you can see the sheep, but the boy can. That seems to be enough for everybody.'),
          ],
        },
      },
      {
        id: 'a16-02-s3',
        goal: 'Decide whether to ask for a muzzle for the sheep.',
        hint: 'Talk to the pilot while the boy is busy with his box.',
        check: 'choose:a16-muzzle:box',
        scene: {
          id: 'a16-02-muzzle',
          lines: [
            N('The boy lies on his front with one eye to the holes. The pilot has gone back under his engine.'),
            PR('Sheep eat bushes, don’t they?'),
            N('From under the plane comes a muffled “Mostly.”'),
            PR('Good. That’s useful. That’s very useful.', 'think'),
            PR('And flowers? Do they eat flowers?'),
            N('The voice under the plane says sheep eat whatever they find: even flowers, even flowers with thorns.'),
            N('The boy goes quiet, the way people do when they’ve thought of something and put it away for later.'),
            N('You look at the box, with your Nubbin on the lid. A sheep that eats everything might need something on its nose, one day.'),
          ],
          choices: [
            {
              id: 'asked',
              label: 'Ask the pilot to draw a muzzle for the sheep now, before it’s too late.',
              set: { 'a16-strap': 'asked' },
              then: [
                PI('A muzzle. Fair enough. Pass me the pencil.'),
                N('He draws one on a scrap of paper: a little muzzle, a leather strap to fasten it, and a proper buckle.'),
                PR('Not now. He’s asleep. He’d hate it.', 'soft'),
                PI('Then I’ll keep it till you need it. Strap and all.'),
                N('He folds the scrap into the very back of his notebook.'),
              ],
            },
            {
              id: 'left',
              label: 'Leave it. The sheep’s asleep.',
              set: { 'a16-strap': 'left' },
              then: [N('You leave it. The boy has his sheep, the sheep has its box, and nobody is thinking about muzzles yet.')],
            },
          ],
        },
        done: {
          id: 'a16-02-muzzle-done',
          lines: [
            PR('At night I can put him in his box. Then nobody ever has to tie him up.'),
            PI('Where’s that? Where do you live?'),
            N('The boy doesn’t answer. He asks what the plane is instead, and is delighted to hear that it fell out of the sky.'),
            PR('You fell out of the sky? So did I, in a way. Which star’s yours?', 'happy'),
          ],
        },
      },
    ],
    complete: {
      id: 'a16-02-complete',
      lines: [
        N('The pilot laughs and wipes his forehead with his wrist, leaving a long black streak.'),
        PI('Here. One for you as well. Every… whatever that is, ought to have a sheep.'),
        N('He draws another box with three holes in it, and gives it to you. Your Nubbin climbs straight in and peers out of a hole.'),
        PR('Yours is asleep too. You can tell from how quiet it is.', 'happy'),
      ],
    },
    rewards: [
      {
        id: 'a16-sheep-box',
        kind: 'decor',
        label: 'Box with Holes',
        description: 'A drawn box with three holes in the side. There’s a sheep inside, asleep. Your Nubbins like to peer in.',
      },
    ],
    sets: { 'a16-02': true },
    notes:
      'SIGNATURE CHOICE (a16-02-muzzle): a16-strap = asked | left. It pays off fourteen quests later: in A16-16 ' +
      '(a16-16-muzzle for asked, a16-16-muzzle-left for left) and on the last page of A16-17 (a16-17-complete*). ' +
      'The boy’s three failed sheep and the box are our own drawings. Box with Holes decor: Nubbins idle by peering into ' +
      'a hole (an idle animation, unlimited, no reward from it). The boy’s design is original: a long scarf, a serious ' +
      'face, never the watercolour prince.',
  },

  // ---------------------------------------------------------------- A16-3
  {
    id: 'a16-03',
    code: 'A16-3',
    title: 'Asteroid B-612',
    source: `${BOOK}, ch. IV–V: the planet and the baobabs`,
    audience: 'all',
    trigger: { where: WHERE, when: after('A16-2') },
    requires: ['A16-2'],
    speakers: [PILOT, PRINCE],
    steps: [
      {
        id: 'a16-03-s1',
        goal: 'Listen to the boy tell where he comes from.',
        hint: 'Sit by the plane after dark, when the boy starts talking.',
        check: 'talk:a16-prince:plane',
        scene: {
          id: 'a16-03-telling',
          lines: [
            N('It takes days to get anything out of him. He asks questions all the time, and hardly hears yours.'),
            N('But at night, by the plane, with the engine cold and the stars out, the boy begins to tell.'),
            PR('My planet is hardly bigger than a house. You can walk all round it before your tea gets cold.'),
            N('The pilot murmurs that it must be an asteroid, one of the little ones with only a number for a name.'),
            PI('There’s one called B-612. An astronomer saw it once, and nobody believed him till he came back in a better suit.'),
            PR('Grown-ups like numbers. Tell them about a new friend, and they ask how much he weighs.'),
            PR('You can come, if you like. When I tell it, you’ll see.'),
            N('He tells it so well that the sand under you curves. The sky comes down close, and you are standing on a planet the size of a house.'),
          ],
          choices: [
            {
              id: 'colour',
              label: 'Ask what colour his sunsets are.',
              then: [PR('Every colour, one after another. You’ll see those too.', 'happy')],
            },
            {
              id: 'steps',
              label: 'Ask how many steps it is round.',
              then: [PR('That’s a grown-up question.', 'sad'), PR('Forty-one. Not counting going round the rose.')],
            },
            {
              id: 'nubbin',
              label: 'Watch your Nubbin.',
              then: [N('Your Nubbin has already set off round the planet. It comes back from the other side almost at once, astonished.')],
            },
          ],
        },
      },
      {
        id: 'a16-03-s2',
        goal: 'Help with one morning’s weeding on the little planet.',
        hint: 'Pull the baobab shoots while they’re tiny. Leave anything that might be a rose.',
        check: 'collect:a16-baobab:shoots',
        scene: {
          id: 'a16-03-weeding',
          lines: [
            N('It is morning on the little planet. There are three volcanoes, each about knee-high, and two of them are warm.'),
            PR('I sweep them out every day. Then they burn slow and steady, and I can heat my breakfast on them.'),
            PR('That one’s asleep. I sweep it anyway. You never know with volcanoes.', 'think'),
            N('Then he kneels and shows you the soil. Little green shoots are coming up all over it, all looking much the same.'),
            PR('These are baobabs. They grow into trees as big as hills. Let them, and their roots go right through the planet.'),
            PR('And these, the same size, might be roses. You have to tell them apart while they’re small. Then you mustn’t wait.'),
            N('Your Nubbin takes hold of a shoot with both paws and looks up, waiting to be told.'),
          ],
          choices: [
            {
              id: 'pull',
              label: 'Pull it. It has a baobab’s fat stem.',
              then: [
                N('Out it comes, root and all. Your Nubbin holds it up like a prize fish.'),
                N('It checks twice that it is not a rose. The boy nods once, like a teacher who has seen a sum done right.'),
              ],
            },
            {
              id: 'ask',
              label: 'Ask him which it is first.',
              then: [PR('Baobab. Good. Asking is better than pulling up a rose.'), N('Out it comes, root and all.')],
            },
            {
              id: 'wait',
              label: 'Leave it a day, to be sure.',
              then: [PR('No. By tomorrow it’ll be too big to tell you anything but trouble.'), N('He pulls it himself, gently and at once.')],
            },
          ],
        },
        done: {
          id: 'a16-03-weeding-done',
          lines: [
            N('By the time the sun is properly up, the planet is clean. You have a small heap of baobab shoots, and not one rose in it.'),
            PR('I knew a planet where a lazy man left three of them. You can’t see the ground there any more.', 'sad'),
          ],
        },
      },
    ],
    complete: {
      id: 'a16-03-complete',
      lines: [
        PR('Every morning, first thing. If you leave it for later, later turns into trees.'),
        N('The telling fades. The sand comes back under you, and the pilot is lying by the plane with his hands behind his head.'),
        PI('Baobabs. All right. I’ll draw you one, so nobody forgets.'),
        N('He draws a little planet with three enormous trees squeezing it. Your Nubbin gives the drawing a very hard look.'),
      ],
    },
    rewards: [],
    sets: { 'a16-03': true },
    notes:
      'THE TELLINGS (A16-3 to A16-14): each starts by the plane at night; the sand curves and the scene becomes the place ' +
      'the boy describes, then folds back to the plane. You and your Nubbin walk inside the telling; the pilot stays by the ' +
      'plane and is heard only at the ends. Weeding is one morning only, played once: tap shoots; baobab shoots have fat ' +
      'stems, rose shoots thin red ones. Pulling a rose shoot just makes the boy wince and replant it (no fail state). ' +
      'The astronomer in a better suit is our own one-line nod; no costume or nationality is shown.',
  },

  // ---------------------------------------------------------------- A16-4
  {
    id: 'a16-04',
    code: 'A16-4',
    title: 'The Sunsets',
    source: `${BOOK}, ch. VI: the sunsets`,
    audience: 'all',
    trigger: { where: WHERE, when: after('A16-3') },
    requires: ['A16-3'],
    speakers: [PILOT, PRINCE],
    steps: [
      {
        id: 'a16-04-s1',
        goal: 'Sit with the boy on his planet, and watch the sunsets.',
        hint: 'Sit in the chair beside his. Move when he moves.',
        check: 'sit:a16-chair:sunset',
        scene: {
          id: 'a16-04-chairs',
          lines: [
            N('Another evening by the plane, and another telling. This time the boy says only one word: sunsets.'),
            N('Then you are on his planet again, and he is setting out two chairs. One is a chair, and the other is a pebble, for your Nubbin.'),
            PR('On my planet you don’t have to wait for the sun to set. You just move your chair a few steps, and it sets again.'),
            N('The sun goes down. He gets up, moves his chair a few steps and sits, and the sun goes down again.'),
            N('You move your chair, and your Nubbin rolls its pebble. The sun goes down a third time, pink and then gold.'),
            PR('Once I watched it lots and lots of times in one day. I lost count somewhere after forty.'),
            N('He doesn’t say why. He moves his chair again, and sits, and holds his knees.'),
          ],
          choices: [
            {
              id: 'why',
              label: 'Ask him why.',
              then: [PR('You only want that many when something’s wrong.', 'sad'), N('He doesn’t say what.')],
            },
            {
              id: 'quiet',
              label: 'Say nothing, and move your chair when he does.',
              then: [N('You move when he moves. Sunset after sunset, nobody says anything, and nobody has to.')],
            },
            {
              id: 'lean',
              label: 'Let your Nubbin lean on him.',
              then: [N('Your Nubbin leaves its pebble and leans on his ankle. He doesn’t look down, but he moves his foot so it fits better.')],
            },
          ],
        },
        done: {
          id: 'a16-04-chairs-done',
          lines: [
            N('Pink, gold, red, violet. The planet is so small you can feel it turning under the chair legs.'),
            N('After a long time he stops moving his chair, and lets the night come.'),
          ],
        },
      },
      {
        id: 'a16-04-s2',
        goal: 'Stay with him until the last sunset is over.',
        hint: 'Keep sitting. Wait for the stars.',
        check: 'wait:a16-sunset:dark',
        scene: {
          id: 'a16-04-dark',
          lines: [
            N('The stars come out over the little planet one by one, the way lamps come on in a street.'),
            PR('There’s a flower. On my planet. That’s why I couldn’t stop watching.'),
            PR('I’ll tell you about her. Not tonight.', 'soft'),
            N('The planet lets go of you. You’re back on the sand, and the pilot is turning a bolt over and over in his fingers.'),
            PI('He cries sometimes, you know. I don’t know what to do about it.'),
            PI('I’ve never known what to do about anybody crying. They don’t teach you that with engines.', 'sad'),
          ],
        },
      },
    ],
    complete: {
      id: 'a16-04-complete',
      lines: [
        N('The boy has fallen asleep against the plane’s wheel, with his scarf over his nose.'),
        N('The pilot puts his jacket over him very carefully, as if he has never done it before. He probably hasn’t.'),
        PI('A flower. All that, for a flower.', 'think'),
        PI('Well. I suppose that’s as good a reason as any.', 'soft'),
      ],
    },
    rewards: [],
    sets: { 'a16-04': true },
    notes:
      'The sunsets run on the page’s own clock, about ten seconds each; the player moves the chair (one tap) to get the ' +
      'next one, as many as they like, and the step completes once the boy stops (after five or so). Never a real-time ' +
      'wait. Your Nubbin’s pebble rolls with it. The boy never says how many; "lost count somewhere after forty" is ours.',
  },

  // ---------------------------------------------------------------- A16-5
  {
    id: 'a16-05',
    code: 'A16-5',
    title: 'The Rose',
    source: `${BOOK}, ch. VIII–IX: the rose and the leaving`,
    audience: 'all',
    trigger: { where: WHERE, when: after('A16-4') },
    requires: ['A16-4'],
    speakers: [PRINCE, ROSE, PILOT],
    steps: [
      {
        id: 'a16-05-s1',
        goal: 'See the new flower on the boy’s planet come out.',
        hint: 'Wait by the strange shoot until it opens at sunrise.',
        check: 'watch:a16-rose:bud',
        scene: {
          id: 'a16-05-bud',
          lines: [
            N('This time he tells it as soon as the sun is down, as if he has been saving it up.'),
            N('His planet, long ago: one morning, a shoot nobody has seen before, not a baobab, not a weed. He watches it every day.'),
            N('It grows a bud, an enormous one, and then it takes ages. Inside the green, something is choosing its colours very carefully.'),
            PR('She wanted to come out perfect. She wasn’t going to be rushed. Not by me. Not by the sun.', 'soft'),
            N('Then one morning, exactly at sunrise, she opens, and yawns.'),
            RO('Oh. I’ve only just woken up. Please excuse me. I must look a sight.'),
            PR('You look like nothing I’ve ever seen.', 'shock'),
            RO('Naturally. And I came out at sunrise, which is the proper time.'),
            RO('I believe it’s time for breakfast. If somebody would be so kind.'),
            N('He runs for the watering can. Your Nubbin runs too, though nobody asked it to and it has no watering can.'),
          ],
          choices: [
            {
              id: 'bow',
              label: 'Bow to her.',
              then: [RO('Well. At least somebody here has manners.', 'happy')],
            },
            {
              id: 'can',
              label: 'Help him fill the watering can.',
              then: [N('You hold the can and he pours. The rose watches you both as if she is marking you out of ten.')],
            },
            {
              id: 'thorns',
              label: 'Look at her thorns.',
              then: [RO('Four. Quite enough for anything with claws. Let them come.'), N('Your Nubbin takes a step back, to be polite.')],
            },
          ],
        },
        done: {
          id: 'a16-05-bud-done',
          lines: [
            RO('There’s a wind on this planet that comes from nowhere. A screen would be the least you could do.'),
            N('She coughs, a small cough and possibly an invented one. He runs for the screen anyway.'),
          ],
        },
      },
      {
        id: 'a16-05-s2',
        goal: 'Help the boy carry a glass globe to the rose, for her nights.',
        hint: 'Carry the globe round the planet to her, and don’t drop it.',
        check: 'carry:a16-globe:rose',
        scene: {
          id: 'a16-05-globe',
          lines: [
            N('After that she is always wanting something: water, the screen, a better angle to the sun. He brings it all, and gets sadder.'),
            PR('I believed every word she said. That was the trouble.', 'sad'),
            PR('She filled the whole planet with her smell, every morning, and I only noticed the complaining.'),
            N('He has made a glass globe for her, to keep off the cold at night. It is as clear as water and nearly as heavy.'),
            PR('Help me carry it? It’s the only thing on my planet that can break.'),
            N('You take one side and he takes the other. Your Nubbin walks in front, looking for stones to warn you about.'),
          ],
          choices: [
            {
              id: 'slow',
              label: 'Go slowly round the volcanoes.',
              then: [N('Slowly round the warm ones, slower round the sleeping one. The globe catches the sun the whole way.')],
            },
            {
              id: 'asked',
              label: 'Ask if she asked for it.',
              then: [PR('Not exactly. She said she was cold. I thought a globe was the same as listening.', 'think')],
            },
          ],
        },
        done: {
          id: 'a16-05-globe-done',
          lines: [
            N('He puts the globe over her that night. Through the glass she looks like a flower in a story, and very far away.'),
            RO('It’s warm. Thank you. It’s very quiet in here.', 'soft'),
          ],
        },
      },
      {
        id: 'a16-05-s3',
        goal: 'Be there on the morning the boy leaves his rose.',
        hint: 'Stay by the rose while he says goodbye.',
        check: 'choose:a16-globe:morning',
        scene: {
          id: 'a16-05-goodbye',
          lines: [
            N('Then comes the morning he decides to go. He sweeps the volcanoes, all three, and pulls the last baobab shoots.'),
            N('He waters the rose one last time, and his hands are not quite steady.'),
            RO('I was difficult. I know I was. I’m sorry.', 'soft'),
            RO('Go and be happy somewhere. That’s an order, since I’m the one giving them.'),
            N('He reaches for the glass globe, the way he does every evening.'),
            RO('No, not that. I’m a flower, not a cake on a plate. I can stand a little cold.'),
            PR('But at night. Anything could happen.'),
            RO('Then it can happen. I have four thorns. I am not made of glass.'),
            N('He turns to you with the globe in his hands. He looks very young, and very frightened for her.'),
            PR('Should I put it on her anyway? Just to be safe?'),
          ],
          choices: [
            {
              id: 'free',
              label: 'Leave her free.',
              set: { 'a16-globe': 'free' },
              then: [
                PR('Free. Yes. She’d never forgive me otherwise.', 'soft'),
                N('He sets the globe down beside her, empty. As he turns away, one petal falls, and he puts it in his pocket without a word.'),
              ],
            },
            {
              id: 'glass',
              label: 'Put the globe on her.',
              set: { 'a16-globe': 'glass' },
              then: [
                N('He lifts it over her. She looks at him through the glass, and he can’t do it, and lifts it away again.'),
                PR('She said no. I’ll take it with me, so it isn’t sitting here looking at her.'),
              ],
            },
          ],
        },
        done: {
          id: 'a16-05-goodbye-done',
          lines: [
            RO('Go on, then. Don’t hang about. You’ve decided.'),
            N('She looks very hard at the sun, so he can’t see her face. Nobody is prouder than a rose.'),
          ],
        },
      },
    ],
    complete: {
      id: 'a16-05-complete',
      lines: [
        N('He goes with a flock of wild birds passing over, and the little planet drops away under him.'),
        N('Back on the sand, the boy is quiet for a long time. Then he takes a stick and draws four tiny thorns.'),
        PR('I didn’t know how to look after her. I thought looking after was the same as fussing.', 'sad'),
        PI('Do you think she’s all right?'),
        PR('She has four thorns.', 'soft'),
      ],
    },
    rewards: [],
    sets: { 'a16-05': true },
    notes:
      'SECOND CHOICE (a16-05-goodbye): a16-globe = free | glass. He does as she asks either way: the globe never stays ' +
      'on her. Free: he leaves it beside her and keeps a fallen petal. Glass: he takes the globe with him. Pays off in ' +
      'A16-13 (a16-13-secret-done-glass: the fox turns to you too), A16-16 (the petal or the globe) and A16-17 (the last ' +
      'page). The rose is our own design: red, four thorns, a slightly theatrical cough. The birds are a flock in flight, ' +
      'not the book’s picture of a boy held up by strings.',
  },

  // ---------------------------------------------------------------- A16-6
  {
    id: 'a16-06',
    code: 'A16-6',
    title: 'The King',
    source: `${BOOK}, ch. X: the king`,
    audience: 'all',
    trigger: { where: WHERE, when: after('A16-5') },
    requires: ['A16-5'],
    speakers: [PRINCE, KING],
    steps: [
      {
        id: 'a16-06-s1',
        goal: 'Visit the first planet on the boy’s travels, and the king who rules it.',
        hint: 'Follow the boy onto the planet covered in robe.',
        check: 'visit:a16-king:throne',
        scene: {
          id: 'a16-06-king',
          lines: [
            N('The boy tells his travels in order, a planet a night. The first is so small that the king’s robe covers nearly all of it.'),
            N('It is purple, trimmed with white fur, and you have to step over it to go anywhere.'),
            KI('Ah! A subject! Two subjects! And a… third, smaller subject. Approach.'),
            PR('How does he know who we are? He’s never seen us.'),
            KI('To a king, everybody is a subject. It saves a great deal of introducing.'),
            N('It has been a long night’s telling. Your Nubbin yawns, enormously.'),
            KI('A yawn! At court! That is not done.', 'angry'),
            N('Your Nubbin yawns again. It can’t help it: it came out by itself.'),
            KI('Then I command it. Yawn, small subject. Yawn as much as you like. By royal order.', 'happy'),
          ],
          choices: [
            {
              id: 'bow',
              label: 'Bow to the king.',
              then: [KI('Splendid. I command you to bow. There. Obeyed at once.', 'happy')],
            },
            {
              id: 'yawn',
              label: 'Yawn as well.',
              then: [KI('Yes, yes. Commanded. All of it. Nobody yawns here without my say-so.')],
            },
            {
              id: 'sit',
              label: 'Ask if you may sit down.',
              then: [KI('Sit! At once! That was my idea, you understand.'), N('There is nowhere to sit that isn’t robe. You sit on the robe.')],
            },
          ],
        },
        done: {
          id: 'a16-06-king-done',
          lines: [
            KI('I rule over everything, you know. But I am reasonable about it. I only give orders that can be obeyed.'),
            KI('If I ordered the sand to stand up and dance, and it didn’t, I should look very silly. So I don’t.', 'think'),
          ],
        },
      },
      {
        id: 'a16-06-s2',
        goal: 'Ask the king for a sunset, and wait for it.',
        hint: 'Stay with the king until his almanac says it’s time.',
        check: 'wait:a16-king:sunset',
        scene: {
          id: 'a16-06-sunset',
          lines: [
            PR('Please, would you order the sun to set? I’d like a sunset.', 'soft'),
            KI('Certainly. Certainly. You shall have one. At the proper time.'),
            N('He brings out an enormous almanac, licks his thumb, and turns a great many pages.'),
            KI('This evening. At sunset. That is when I shall command it. And you will see how well I am obeyed.'),
            N('The boy sighs. Your Nubbin sits down to wait, which turns out to be the right thing.'),
            KI('Meanwhile I shall make you my Minister of Justice. There’s an old rat somewhere under the robe. Judge him.'),
            PR('I don’t want to judge anybody. And there’s nobody else here.'),
            KI('Then judge yourself. That is the hardest of all. Do that well, and you are wiser than most kings.'),
          ],
          choices: [
            {
              id: 'wait',
              label: 'Wait for the sunset with the king.',
              then: [N('You wait, and the king fidgets with his robe. The sun goes down exactly when it was always going to.')],
            },
            {
              id: 'minister',
              label: 'Ask the king to make you a minister too.',
              then: [
                KI('You are Minister of… of Small Subjects. Your first duty is to wait.'),
                N('So you wait, officially. The sun goes down exactly when it was always going to.'),
              ],
            },
          ],
        },
        done: {
          id: 'a16-06-sunset-done',
          lines: [
            KI('Sun! I command you to set!', 'happy'),
            N('The sun sets. The king looks so pleased that nobody has the heart to say anything.'),
          ],
        },
      },
    ],
    complete: {
      id: 'a16-06-complete',
      lines: [
        PR('I think I’ll go now.'),
        KI('Go? But I have only just… Then I make you my ambassador! Go! By order!', 'shock'),
        N('The boy steps off the edge of the planet with your Nubbin under his arm, and the telling lets you down onto the sand.'),
        PR('He was nice, really. He just didn’t have anybody to order about but the sun.', 'think'),
        N('Your Nubbin is still yawning. Somewhere, a very small king is taking the credit.'),
      ],
    },
    rewards: [],
    sets: { 'a16-06': true },
    notes:
      'Gentle satire: the king is vain and kind and a bit lonely; play him comic, never cruel. The robe is our own design ' +
      '(purple with white trim) and covers the planet like a tablecloth; walking means stepping over folds. The rat is ' +
      'never seen.',
  },

  // ---------------------------------------------------------------- A16-7
  {
    id: 'a16-07',
    code: 'A16-7',
    title: 'The Vain Man and the Drinker',
    source: `${BOOK}, ch. XI–XII: the vain man and the drinker`,
    audience: 'all',
    trigger: { where: WHERE, when: after('A16-6') },
    requires: ['A16-6'],
    speakers: [PRINCE, VAIN, DRINKER, PILOT],
    steps: [
      {
        id: 'a16-07-s1',
        goal: 'Visit the planet of the man who wants to be admired.',
        hint: 'Follow the boy to the next planet and meet the man in the hat.',
        check: 'visit:a16-vain:hat',
        scene: {
          id: 'a16-07-vain',
          lines: [
            N('The second planet belongs to a man in a very tall hat. He sees you coming from a long way off, and stands up straight.'),
            VA('Visitors! Admirers! I knew you’d come eventually.', 'happy'),
            PR('That’s a funny hat.'),
            VA('It is for raising. When people clap me, I raise it. Unfortunately, people hardly ever come this way.'),
            N('The boy claps a few times, to be kind, and off comes the hat. It goes on for five minutes, and gets very dull.'),
            N('Now the man looks at you, hopefully. He has arranged his feet for bowing.'),
          ],
          choices: [
            {
              id: 'clap',
              label: 'Clap.',
              then: [N('You clap, and off comes the hat with a sweep. You clap again, and off it comes again.'), VA('More! More!', 'happy')],
            },
            {
              id: 'nubbin',
              label: 'Let your Nubbin clap.',
              then: [N('Your Nubbin claps its paws together, very seriously. The man bows to it so low his hat falls off.')],
            },
            {
              id: 'why',
              label: 'Ask him why he wants clapping.',
              then: [VA('Because I deserve it. Ask anyone on this planet.'), PR('There’s only you.'), VA('Exactly. And I think so.', 'happy')],
            },
          ],
        },
        done: {
          id: 'a16-07-vain-done',
          lines: [
            PR('Do people really need clapping that much?', 'think'),
            N('Your Nubbin looks at the man, then at the hat, then at you. It has never been so baffled in its life.'),
          ],
        },
      },
      {
        id: 'a16-07-s2',
        goal: 'Visit the drinker’s planet, quietly.',
        hint: 'Go gently. Stay by the boy.',
        check: 'visit:a16-drinker:bottles',
        scene: {
          id: 'a16-07-drinker',
          lines: [
            N('The next planet is very small and very quiet. A man sits there among rows of bottles, a few full, most empty.'),
            N('He doesn’t look up when you come. He looks as if he hasn’t looked up for a long time.'),
            PR('Are you all right?'),
            DR('No. That’s why the bottles.', 'sad'),
            DR('I drink so I don’t have to think about the drinking. Thinking about it makes me ashamed. So I drink.'),
            N('He says it as if it were a sum he has done many times, and gets the same answer every time.'),
            PR('Isn’t there a way out of it?'),
            DR('I expect there is. I can’t see it from here.', 'sad'),
          ],
          choices: [
            {
              id: 'sit',
              label: 'Sit with him a moment.',
              then: [N('You sit on the edge of his little planet. He doesn’t say anything, but he doesn’t ask you to go.')],
            },
            {
              id: 'leave',
              label: 'Leave him quietly.',
              then: [N('You step away softly, the way you’d leave a room where someone is sleeping badly.')],
            },
          ],
        },
        done: {
          id: 'a16-07-drinker-done',
          lines: [
            N('The boy goes away very sad. He doesn’t say anything for a long time.'),
            N('Neither does your Nubbin. It holds on to the end of his scarf the whole way.'),
          ],
        },
      },
    ],
    complete: {
      id: 'a16-07-complete',
      lines: [
        N('Back by the plane, the boy throws pebbles at nothing. Your Nubbin brings them back, one by one.'),
        PR('The man in the hat only wanted clapping. The other one only wanted to stop. Neither of them got it.', 'think'),
        PI('Grown-ups.'),
        PR('Grown-ups.', 'sad'),
        N('Your Nubbin looks from one to the other. It doesn’t understand them either, and says so by sitting on the pilot’s foot.'),
      ],
    },
    rewards: [],
    sets: { 'a16-07': true },
    notes:
      'CARE: the vain man is comic; the drinker is played sad, not funny. Plain unlabelled bottles, no hiccups, no ' +
      'slurring, no stumbling, nothing glamorous; he sits still and speaks quietly. Keep his planet dim and his voice ' +
      'gentle. The Learning Grove reader version (written separately) may describe him as "a sad man who can’t stop ' +
      'doing something that makes him sadder".',
  },

  // ---------------------------------------------------------------- A16-8
  {
    id: 'a16-08',
    code: 'A16-8',
    title: 'The Businessman',
    source: `${BOOK}, ch. XIII: the businessman`,
    audience: 'all',
    trigger: { where: WHERE, when: after('A16-7') },
    requires: ['A16-7'],
    speakers: [PRINCE, BUSINESS, PILOT],
    steps: [
      {
        id: 'a16-08-s1',
        goal: 'Visit the businessman who says he owns the stars.',
        hint: 'Follow the boy to the planet with the desk.',
        check: 'visit:a16-business:desk',
        scene: {
          id: 'a16-08-desk',
          lines: [
            N('The fourth planet is all desk. Behind the desk is a man adding up, so busy that he doesn’t hear you arrive.'),
            BU('Four hundred and six, four hundred and seven… Don’t interrupt. I’ll lose my place.'),
            PR('What are you counting?'),
            BU('The little shiny things. The ones idle people stare at and daydream about. I am not idle. I count them.'),
            N('He means the stars. You can tell, because he will not look up at a single one of them.'),
            BU('Several hundred million, and rising. They are all mine.'),
            PR('How can anybody own a star?'),
            BU('Nobody else had thought of owning them. So I did. That’s how owning works.'),
          ],
          choices: [
            {
              id: 'what',
              label: 'Ask what he does with them.',
              then: [BU('I count them, and count them again. Then I put them in the bank.')],
            },
            {
              id: 'up',
              label: 'Ask him to look up, just once.',
              then: [BU('Look up? I haven’t time to look up. I have them to count.', 'angry'),
                N('He still doesn’t.'),
                N('Your Nubbin helps by counting the stars out loud, in squeaks: one, two, three, two.'),
                BU('Four hundred and… four hundred and… Now look what it’s done.', 'angry'),
                PR('It’s lost its place too. You’re even.'),
              ],
            },
          ],
        },
        done: {
          id: 'a16-08-desk-done',
          lines: [
            N('He writes the total on a slip of paper, puts it in a drawer, and locks the drawer with a little key.'),
            BU('There. In the bank. Perfectly safe.', 'happy'),
          ],
        },
      },
      {
        id: 'a16-08-s2',
        goal: 'Hear what the boy says to the businessman.',
        hint: 'Stay by the desk while the boy thinks it through.',
        check: 'talk:a16-prince:desk',
        scene: {
          id: 'a16-08-useful',
          lines: [
            PR('I own a flower. I water her every day.'),
            PR('I own three volcanoes. I sweep them out, even the sleeping one.'),
            PR('My volcanoes are better for it. My flower is better for it. Are the stars any better for being in your drawer?', 'think'),
            N('The businessman opens his mouth, then shuts it again. Nobody has ever asked him that before.'),
            N('Your Nubbin climbs onto the desk and looks at him, then up at the sky, then at him again, to give him the idea.'),
            BU('I… must get on. Where was I?', 'think'),
            N('He doesn’t know. For the first time in years, he has lost count.'),
          ],
        },
      },
    ],
    complete: {
      id: 'a16-08-complete',
      lines: [
        N('As you leave, you look back. He is bent over his paper, adding it all up again from the start.'),
        N('Above him every one of his stars is shining, and he hasn’t seen a single one.'),
        PR('All those stars, and he’s never once looked up. I think that’s the saddest planet so far.', 'sad'),
        PI('Sadder than the drinker?'),
        PR('No. The drinker knows he’s sad.', 'soft'),
      ],
    },
    rewards: [],
    sets: { 'a16-08': true },
    notes:
      'Gentle satire, comic not cruel. No cigarette (the book has one). The book’s exact star total is not used. The ' +
      'drawer "bank" is a little locked desk drawer; the key is tiny and gold.',
  },

  // ---------------------------------------------------------------- A16-9
  {
    id: 'a16-09',
    code: 'A16-9',
    title: 'The Lamplighter',
    source: `${BOOK}, ch. XIV: the lamplighter`,
    audience: 'all',
    trigger: { where: WHERE, when: after('A16-8') },
    requires: ['A16-8'],
    speakers: [PRINCE, LAMP],
    steps: [
      {
        id: 'a16-09-s1',
        goal: 'Visit the smallest planet, where a lamplighter never rests.',
        hint: 'Follow the boy to the planet with one street lamp.',
        check: 'visit:a16-lamplighter:planet',
        scene: {
          id: 'a16-09-lamp',
          lines: [
            N('The fifth planet is the smallest of all. There is just room on it for one street lamp and one lamplighter.'),
            N('As you land it is dusk, and he lights the lamp. Then it is dawn, and he puts it out, and then it is dusk again.'),
            LA('Good evening. Good morning. Good evening.', 'sad'),
            PR('Why do you keep lighting it and putting it out?'),
            LA('Those are my orders. Light it at dusk, out at dawn. It was a good job once. I had the whole night to sleep.'),
            LA('But the planet turns faster every year, and the orders never changed. Now a whole day goes by in a minute.'),
            N('He mops his forehead with a large handkerchief. Dusk: he lights the lamp.'),
            LA('I haven’t sat down in a month. Good morning.'),
          ],
          choices: [
            {
              id: 'help',
              label: 'Offer to help with the lamp.',
              then: [LA('Would you? Just the once. Dusk is coming. It’s always coming.', 'happy')],
            },
            {
              id: 'stop',
              label: 'Ask why he doesn’t just stop.',
              then: [
                LA('Then the lamp would be out when it ought to be lit. Somebody might be looking for it.'),
                PR('Who?'),
                LA('I don’t know. That’s why I keep it lit.'),
              ],
            },
          ],
        },
        done: {
          id: 'a16-09-lamp-done',
          lines: [
            PR('Your planet’s so tiny, you could just stroll after the sun. You’d never get to dusk at all.'),
            LA('I don’t want it to be day for ever. I want a night off.', 'sad'),
          ],
        },
      },
      {
        id: 'a16-09-s2',
        goal: 'Help the lamplighter light his lamp, once.',
        hint: 'When the sky goes violet, lift the taper to the lamp.',
        check: 'place:a16-taper:lamp',
        scene: {
          id: 'a16-09-light',
          lines: [
            N('He hands you a long taper with a small flame at the end. It smells of beeswax.'),
            LA('Dusk is in… now. No. Now. Ready?'),
            N('The sky slides from gold to violet in the time it takes to breathe. The lamp waits, cold, at the top of its post.'),
            LA('Up, and in, and… there.'),
            N('You lift the taper, with your Nubbin on your shoulder leaning too. The wick catches, and light spreads over the whole planet.'),
            LA('Oh, that’s lovely. I haven’t seen it from the outside in years.', 'happy'),
            N('For one whole minute he stands back with his hands in his pockets, and just looks at his lamp.'),
          ],
        },
        done: {
          id: 'a16-09-light-done',
          lines: [
            N('Then it is dawn, and he must put it out. He does, very gently.'),
            PR('Of all of them, he’s the one I’d have stayed with. He looks after something that isn’t himself.', 'soft'),
            PR('Only there isn’t room. It’s him, and the lamp, and that’s the whole planet.', 'sad'),
          ],
        },
      },
    ],
    complete: {
      id: 'a16-09-complete',
      lines: [
        LA('Here. Take this. It’s a spare, from before the orders got silly.'),
        N('He gives you a small lamp on a short post, green, with brass at the top. It is the right size for a hill.'),
        LA('It lights itself at dusk and goes out at dawn. It doesn’t need anybody. Somebody ought to have a lamp like that.', 'soft'),
        LA('Good evening. Good morning. Goodbye.'),
        N('He waves his handkerchief until the telling folds him away.'),
      ],
    },
    rewards: [
      {
        id: 'a16-lamplighter-lamp',
        kind: 'feature',
        label: 'The Lamplighter’s Lamp',
        description: 'A small green lamp post for the hill. It lights itself at dusk and goes out at dawn, and asks nothing of you.',
      },
    ],
    sets: { 'a16-09': true },
    notes:
      'Lighting is one timed tap on the page’s own clock (a planet day lasts a minute; dusk comes every minute, so a ' +
      'missed tap simply waits for the next dusk; no fail state). One time only. ' +
      'SIM: the Lamplighter’s Lamp is a Grove feature placed on the hill (a spot away from the memorial flowers and the ' +
      'flat stone). It follows the Grove’s own day: lit at dusk, out at dawn, no interaction needed or offered. It is NOT ' +
      'a lantern post: it never counts for lanternsLit, chapter goals, Lantern Night or the Long Night. ' +
      'The first time Sparks is in the Grove at dusk after it is placed, play ATLAS_A16_VARIANTS a16-grove-sparks.',
  },

  // ---------------------------------------------------------------- A16-10
  {
    id: 'a16-10',
    code: 'A16-10',
    title: 'The Geographer',
    source: `${BOOK}, ch. XV: the geographer`,
    audience: 'all',
    trigger: { where: WHERE, when: after('A16-9') },
    requires: ['A16-9'],
    speakers: [PRINCE, GEO, PILOT],
    steps: [
      {
        id: 'a16-10-s1',
        goal: 'Visit the old geographer and his books.',
        hint: 'Follow the boy to the planet ten times bigger than the last.',
        check: 'visit:a16-geographer:desk',
        scene: {
          id: 'a16-10-books',
          lines: [
            N('The sixth planet is ten times bigger, and an old gentleman lives on it among books piled higher than his head.'),
            GE('An explorer! At last! Sit down, sit down. Tell me everything.'),
            PR('What are all these books?'),
            GE('I am a geographer. I write down where the seas are, and the rivers, the towns, the mountains and the deserts.'),
            PR('Are there seas on your planet?'),
            GE('Haven’t the least idea. Going and looking is for explorers. I sit here, and they come and tell me.'),
            GE('Then I check what they say. If it’s a mountain, I make them bring me a big stone off it.'),
          ],
          choices: [
            {
              id: 'grove',
              label: 'Describe the Grove for his book.',
              then: [
                N('You tell him about a pond, and a hill, and a gate that sticks. He writes down the pond and the hill.'),
                GE('A gate? A gate is not geography. Gates change.'),
              ],
            },
            {
              id: 'seen',
              label: 'Ask him if he’s ever seen a mountain.',
              then: [GE('Seen one? Good heavens, no. I have written down four hundred.', 'happy')],
            },
          ],
        },
        done: {
          id: 'a16-10-books-done',
          lines: [
            GE('Now, young man. Your planet. Describe it.'),
            N('He opens a fresh page and licks his pencil. The boy stands up a little straighter.'),
          ],
        },
      },
      {
        id: 'a16-10-s2',
        goal: 'Hear what the geographer says about flowers.',
        hint: 'Stay while the boy describes his planet.',
        check: 'talk:a16-geographer:flower',
        scene: {
          id: 'a16-10-flower',
          lines: [
            PR('There are three volcanoes. Two awake and one asleep.'),
            GE('Asleep or awake, a volcano is a volcano. I’ll put down three.'),
            PR('And I have a flower.'),
            GE('We don’t write down flowers.'),
            PR('Why not? She’s the prettiest thing on it!'),
            GE('Because flowers don’t last. Geography is for things that stay: mountains, seas. A flower is here, and then it isn’t.'),
            GE('Not tomorrow, perhaps. But one day. That is what flowers are like.'),
            N('The boy goes very still. For the first time since he left, he thinks of his rose with worry instead of hurt.'),
            PR('Four thorns. That’s all she’s got. And I just went.', 'sad'),
          ],
        },
        done: {
          id: 'a16-10-flower-done',
          lines: [
            PR('Where should I go next? Where’s worth seeing?'),
            GE('Try the Earth. Big. Well thought of. Plenty to write down, I hear.'),
          ],
        },
      },
    ],
    complete: {
      id: 'a16-10-complete',
      lines: [
        N('So he goes to Earth, thinking about his flower the whole way.'),
        N('The telling stops. By the plane, the boy is sitting with his chin on his knees, looking at nothing.'),
        PI('Is that when you came here?'),
        PR('That’s when I came here.', 'soft'),
      ],
    },
    rewards: [],
    sets: { 'a16-10': true },
    notes:
      'Gentle satire: the geographer is pompous and harmless. This is the turn of the page: the boy’s worry for the rose ' +
      'starts here. The gate line in the "grove" choice is a light echo of the Grove’s gate that sticks; it is a joke, ' +
      'not a read of Grove state.',
  },

  // ---------------------------------------------------------------- A16-11
  {
    id: 'a16-11',
    code: 'A16-11',
    title: 'The Yellow Snake',
    source: `${BOOK}, ch. XVI–XVII: the Earth and the snake`,
    audience: 'all',
    trigger: { where: WHERE, when: after('A16-10') },
    requires: ['A16-10'],
    speakers: [PRINCE, SNAKE, PILOT],
    steps: [
      {
        id: 'a16-11-s1',
        goal: 'Follow the boy’s first night on Earth, in the empty desert.',
        hint: 'Walk with the boy over the dunes.',
        check: 'explore:a16-earth:dunes',
        scene: {
          id: 'a16-11-earth',
          lines: [
            N('In the telling, the boy lands on Earth, in this same desert, a year ago. Nobody is there, nobody at all.'),
            PR('I thought I’d got the wrong planet. The geographer said it was full of people.'),
            N('It is a very big planet, and all the people on it would fit in one corner of it if they stood close. None of them are here.'),
            N('Something moves in the sand by his foot: a ring the colour of moonlight, thin as a finger.'),
            PR('Good evening.'),
            N('The ring lifts its head. It is a snake, small and yellow, and it says good evening back.'),
          ],
          choices: [
            {
              id: 'close',
              label: 'Stay close beside the boy.',
              then: [N('You stand at his shoulder. The snake looks at you, and then away, as if you aren’t the one it came about.')],
            },
            {
              id: 'nubbin',
              label: 'Pick up your Nubbin.',
              then: [N('You pick up your Nubbin. It doesn’t struggle, but watches the snake over your arm without blinking.')],
            },
          ],
        },
      },
      {
        id: 'a16-11-s2',
        goal: 'Hear what the snake says, and remember it.',
        hint: 'Stay by the boy while the snake talks.',
        check: 'talk:a16-snake:dunes',
        scene: {
          id: 'a16-11-riddles',
          lines: [
            PR('Which planet is this?'),
            SN('The Earth. The desert part. People don’t stay in deserts.'),
            PR('You’re a funny animal. You’re as thin as a finger.'),
            SN('I’m more than I look. Whatever I touch goes back where it came from. Sand to sand. Stars to stars.'),
            PR('That’s a riddle.'),
            SN('Everything I say is. Riddles keep better.'),
            SN('You’re very far from home, and very new. One day you may miss your planet more than you can carry.'),
            SN('If that day comes, look for me. I’m the shortest way there is.'),
            N('The boy looks at it for a long time. Then he shakes his head.'),
            PR('Not yet. I don’t need you yet.', 'soft'),
            N('The snake doesn’t mind. It settles back into its ring, as if it had all the time in the world, which it has.'),
          ],
        },
      },
    ],
    complete: {
      id: 'a16-11-complete',
      lines: [
        N('The telling goes quiet. By the plane, the pilot has stopped working, a spanner in one hand.'),
        PI('I don’t like that snake.'),
        PR('It wasn’t unkind. It was just very sure.', 'think'),
        N('Your Nubbin wriggles round in your arms so that it can keep its back to the dunes for the rest of the night.'),
      ],
    },
    rewards: [],
    sets: { 'a16-11': true },
    notes:
      'CARE: the snake is eerie, calm and courteous, never threatening. It never strikes, bares fangs or rears up; no ' +
      'word for bite or poison is used anywhere. Its promise is said only in riddles ("goes back where it came from", ' +
      '"the shortest way"). Art: a thin coil the colour of moonlight, our own design. Sound: a dry whisper, no hiss.',
  },

  // ---------------------------------------------------------------- A16-12
  {
    id: 'a16-12',
    code: 'A16-12',
    title: 'The Echo and the Garden',
    source: `${BOOK}, ch. XVIII–XX: the flower, the mountain and the rose garden`,
    audience: 'all',
    trigger: { where: WHERE, when: after('A16-11') },
    requires: ['A16-11'],
    speakers: [PRINCE, FLOWER, ECHO, ROSES, FOX],
    steps: [
      {
        id: 'a16-12-s1',
        goal: 'Cross the desert with the boy, and meet the one flower in it.',
        hint: 'Walk with the boy until you find the flower.',
        check: 'find:a16-flower:desert',
        scene: {
          id: 'a16-12-flower',
          lines: [
            N('The boy crosses the desert in the telling. In all that sand he meets one flower: three petals, and nothing much else.'),
            PR('Good morning. Where are the people?'),
            FL('People? A few went by. A long time ago. They were in a great hurry.'),
            FL('They go past. They’re always looking for something, and they never stop long enough to find it.'),
            PR('Which way did they go?'),
            FL('That way. Or that way. The wind moves the sand about. Nobody leaves tracks here.'),
          ],
          choices: [
            {
              id: 'shade',
              label: 'Give her a little shade.',
              then: [
                N('You stand so your shadow falls across her. Her three petals open a little wider, in surprise.'),
                FL('Oh. Thank you. Nobody’s ever stopped before.', 'soft'),
              ],
            },
            {
              id: 'thank',
              label: 'Thank her, and go on.',
              then: [FL('Goodbye. I’ll remember you. There isn’t much else to remember.', 'soft')],
            },
          ],
        },
      },
      {
        id: 'a16-12-s2',
        goal: 'Climb the high mountain with the boy, and see what’s at the top.',
        hint: 'Follow him up to the peak.',
        check: 'climb:a16-mountain:peak',
        scene: {
          id: 'a16-12-echo',
          lines: [
            N('Then a high mountain, the first he has ever climbed. On his planet the volcanoes only came up to his knee.'),
            PR('From up there I’ll see the whole planet, and all the people at once.', 'happy'),
            N('From the top you see peaks, sharp as needles, all the way round. No people at all.'),
            PR('Hello?'),
            EC('Hello… hello… hello…'),
            PR('Who’s there?'),
            EC('…there? …there? …there?'),
            PR('I’d like a friend. Is anybody there?', 'sad'),
            EC('…anybody… there… there…'),
            N('Your Nubbin sits down very firmly on the peak, and looks at the echo as if it has been rude.'),
            PR('This planet doesn’t talk back. It only copies.', 'sad'),
          ],
        },
      },
      {
        id: 'a16-12-s3',
        goal: 'Sit down next to the boy in the garden of roses, and wait.',
        hint: 'When he lies down in the grass, sit beside him. Don’t say anything.',
        check: 'sit:a16-prince:garden',
        scene: {
          id: 'a16-12-roses',
          lines: [
            N('After a long time walking there is a road, and the road leads to a garden, and the garden is full of roses.'),
            N('Five thousand of them, nodding in rows. Every single one looks exactly like his.'),
            RS('Good morning. We are roses.'),
            PR('Roses.', 'shock'),
            N('He stares at them. She told him she was the only one of her kind anywhere.'),
            PR('If she saw this, she’d be furious. And then she’d be ever so ill, all of a sudden.'),
            PR('I thought she was the only one. I thought that made me somebody.', 'sad'),
            PR('She’s just a rose. And my volcanoes only come up to my knee.'),
            N('He lies down in the grass, puts his face in his arms, and cries.'),
          ],
          choices: [
            {
              id: 'sit',
              label: 'Sit down beside him, and wait.',
              then: [N('You sit down in the grass beside him and don’t say anything. Your Nubbin lies against his side, warm, and waits too.')],
            },
            {
              id: 'tell',
              label: 'Tell him she’s still special.',
              then: [
                PR('You don’t know that. You’ve never met her.', 'sad'),
                N('He’s right. So you sit down beside him instead, and wait, and that turns out to be the thing.'),
              ],
            },
          ],
        },
        done: {
          id: 'a16-12-roses-done',
          lines: [
            N('The roses nod on their stalks, and the sun moves. After a long time he stops crying, rolls over, and looks at the sky.'),
            PR('Thank you for not saying anything.', 'soft'),
          ],
        },
      },
    ],
    complete: {
      id: 'a16-12-complete',
      lines: [
        N('Someone is watching from under an apple tree at the edge of the garden. Someone with a tail.'),
        N('The telling holds its breath. So does your Nubbin.'),
        FX('Good morning.'),
        PR('Good morning. I can’t see you properly. Who are you?'),
        FX('A fox. And you’re in a bad way. I can tell from here.'),
      ],
    },
    rewards: [],
    sets: { 'a16-12': true },
    notes:
      'HAZEL’S THIRD RULE is acted out in a16-12-roses and never quoted or named; both choices end with you sitting beside ' +
      'him. The echo is a voice only (no speaker portrait; its lines fade in volume). The rose garden is our own design: ' +
      'rows of red roses on a low wall, a gravel road. Grief here is quiet; the camera stays on the two of you in the grass.',
  },

  // ---------------------------------------------------------------- A16-13
  {
    id: 'a16-13',
    code: 'A16-13',
    title: 'The Fox',
    source: `${BOOK}, ch. XXI: the fox`,
    audience: 'all',
    trigger: { where: WHERE, when: after('A16-12') },
    requires: ['A16-12'],
    speakers: [PRINCE, FOX, PILOT],
    steps: [
      {
        id: 'a16-13-s1',
        goal: 'Meet the fox under the apple tree, and hear what taming is.',
        hint: 'Walk with the boy to the apple tree. Don’t go too close.',
        check: 'talk:a16-fox:apple-tree',
        scene: {
          id: 'a16-13-fox',
          lines: [...A13_FOX_OPEN, ...A13_FOX_REST],
          choices: A13_FOX_CHOICES,
        },
      },
      {
        id: 'a16-13-s2',
        goal: 'Help the boy tame the fox: sit at the same hour, a little closer each time.',
        hint: 'When the tree’s shadow touches the white stone, sit. Say nothing. Each time, a little nearer.',
        check: 'sit:a16-fox:hour',
        scene: {
          id: 'a16-13-hour',
          lines: [
            ...A13_HOUR_RULES,
            N('The shadow touches the stone. The boy sits down a long way off and says nothing, and the fox looks at him sideways.'),
            N('Sunset, stars, sunrise. The shadow crawls, and the boy sits down again, a little nearer.'),
            N('And again, a little nearer. On the fourth day, the fox is waiting at the stone before the shadow gets there.', 'happy'),
          ],
        },
        done: {
          id: 'a16-13-hour-done',
          lines: [A13_HOUR_DONE, N('You think of the hill where something small and grey once watched.', 'soft')],
        },
      },
      {
        id: 'a16-13-s3',
        goal: 'Say goodbye to the fox, and hear its secret.',
        hint: 'Go and see the roses once more, then come back to the apple tree.',
        check: 'walk:a16-garden:roses',
        scene: {
          id: 'a16-13-secret',
          lines: [
            N('Then the hour comes for the boy to go. The fox knows before he says it.'),
            FX('There. Now I’m going to cry. I knew I would.', 'sad'),
            PR('Then taming you was no good to you at all.', 'sad'),
            FX('It was. Wheat never meant a thing to me. Now it’s the colour of your hair, and every time the wind goes through it, I’ll have you.'),
            FX('Go and look at the roses again. Then come back, and I’ll give you a secret for a present.'),
            N('So you go back to the garden with him. He stands in front of the five thousand roses, and isn’t afraid of them any more.'),
            PR('You’re lovely. But you’re nobody’s yet. Nobody’s sat with you. She’s mine, because she’s the one I looked after.'),
            N('He comes back to the apple tree. The fox is waiting at the white stone, though it isn’t quite the hour.'),
            FX('Here it is. It’s very simple.'),
            FX(LIFT_ESSENTIAL),
            PR('So I have to know it. Not see it.', 'think'),
            FX(LIFT_TIME),
            PR('All those mornings. The water, and the screen.', 'soft'),
            FX(LIFT_TAMED),
            PR('My rose. I have to look after my rose.', 'soft'),
          ],
        },
        done: {
          id: 'a16-13-secret-done',
          lines: [
            N('The fox goes back into the wheat. You can see where it goes by the way the gold moves.'),
            PR('I’ll remember. I have to remember.', 'soft'),
          ],
        },
      },
    ],
    complete: {
      id: 'a16-13-complete',
      lines: [
        N('By the plane the telling ends. The boy is quiet and very calm, the way you are after crying.'),
        PI('A fox told you all that?'),
        PR('A fox let me tame it. That’s how it told me.', 'happy'),
        N('Your Nubbin is sitting a little nearer the boy than it was this morning. Nobody saw it move.'),
      ],
    },
    rewards: [],
    sets: { 'a16-13': true },
    childLines: {
      'a16-13-secret#9': 'Your eyes see the outside of things. Knowing someone is how you see the rest.',
      'a16-13-secret#11': 'All the care you gave her, morning after morning, is what makes her yours.',
      'a16-13-secret#13': 'When someone trusts you, you look after them. That part doesn’t stop.',
    },
    notes:
      'LIFTED TEXT: the page’s only three quotes, at a16-13-secret#9, #11 and #13, each spoken once by the fox, French ' +
      'first then our English, in one dialogue box (the French in italics if the box supports it). Voice: a French actor ' +
      'reads the French, then the same voice reads our English. Do not swap in any published translation. ' +
      'THE SAME HOUR: this step runs on the page’s own clock only. A page day is about two minutes, sunrise to stars. The ' +
      'hour is shown by the apple tree’s shadow touching a white stone. Four page days; at each hour the player taps Sit ' +
      'and the boy (and you) move one step nearer. Missing an hour just waits for the next page day; no fail state. ' +
      'Never the real clock, never "come back tomorrow". ' +
      'SABLE (read when this quest starts): t45 plays a16-13-fox-t45 for a16-13-fox and a16-13-hour-t45 for ' +
      'a16-13-hour (the lesson plays twice: Sable steps one step nearer you at each hour), and a16-13-hour-done-t45. ' +
      'Bonded plays a16-13-fox-bonded and a16-13-hour-done-bonded. t20 plays a16-13-hour-done-t20. none plays the base ' +
      'scenes. The Sable variants of a16-13-fox set a16-sable = came. ' +
      'GLOBE PAYOFF: for a16-globe = glass, play a16-13-secret-done-glass for a16-13-secret-done (the fox turns to you ' +
      'as well). HAZEL’S MARGIN NOTE (S24) sits on this quest.',
  },

  // ---------------------------------------------------------------- A16-14
  {
    id: 'a16-14',
    code: 'A16-14',
    title: 'The Switchman and the Merchant',
    source: `${BOOK}, ch. XXII–XXIV: the switchman, the merchant and the eighth day`,
    audience: 'all',
    trigger: { where: WHERE, when: after('A16-13') },
    requires: ['A16-13'],
    speakers: [PRINCE, SWITCH, MERCHANT, PILOT],
    steps: [
      {
        id: 'a16-14-s1',
        goal: 'Watch the trains go by at the switchman’s box.',
        hint: 'Stand by the switchman while the trains rush past.',
        check: 'watch:a16-trains:switch',
        scene: {
          id: 'a16-14-trains',
          lines: [
            N('More of the telling, the night after. A railway in the dark, and a switchman in his box, sorting trains.'),
            SW('Evening. Mind the rails. They’re coming through in bundles of a thousand tonight.'),
            N('A lit-up express roars past one way, rattling the box. A minute later, another roars past the other way.'),
            PR('They’re in a great hurry. What are they looking for?'),
            SW('Couldn’t tell you. I don’t think they could either. Everybody wants to be where they aren’t.'),
            N('A third train thunders by. In every window grown-ups sleep or yawn, but here and there a child has its nose to the glass.'),
            PR('The children are looking out. They’re the only ones looking.', 'soft'),
            SW('Hm. I never noticed that. I don’t look in the windows much.'),
          ],
          choices: [
            {
              id: 'wave',
              label: 'Wave at the children.',
              then: [
                N('You wave. A small hand waves back from a window, and then the train is gone into the dark.'),
                N('Your Nubbin waves too, with both paws, at the train going the other way.'),
              ],
            },
            {
              id: 'where',
              label: 'Ask where they’re all going.',
              then: [SW('Somewhere else. Then back again. Same as yesterday.')],
            },
          ],
        },
      },
      {
        id: 'a16-14-s2',
        goal: 'Meet the merchant and his thirst pills.',
        hint: 'Follow the boy to the man with the tray.',
        check: 'talk:a16-merchant:tray',
        scene: {
          id: 'a16-14-pills',
          lines: [
            N('Then a merchant with a tray round his neck, selling little pills.'),
            ME('One a week, and you’ll never be thirsty. Saves fifty-three minutes. Experts worked it out.'),
            PR('What do you do with the fifty-three minutes?'),
            ME('Use them! Anything at all!', 'happy'),
            PR('What do the experts do with theirs?'),
            ME('They write reports about saving minutes. It takes ages.'),
            N('Your Nubbin sniffs the tray, decides the pills are not food, and looks at the merchant as if he ought to know better.'),
            N('The boy thinks about it seriously, the way he thinks about everything.'),
            PR('If I had fifty-three minutes to spare, I’d spend them walking to a spring. Very slowly.', 'soft'),
            N('The merchant looks at his tray, and at the boy, and doesn’t seem to know what to say.'),
          ],
          choices: [
            {
              id: 'ask',
              label: 'Ask what he does with his own minutes.',
              then: [ME('Mine? I… I haven’t saved enough yet to spend any.', 'think')],
            },
            {
              id: 'walk',
              label: 'Say you’d walk too.',
              then: [PR('You see? Two of us. You should sell walks instead.', 'happy')],
            },
          ],
        },
      },
    ],
    complete: {
      id: 'a16-14-complete',
      lines: [
        N('The telling stops: the boy has finished his travels. He looks at the pilot, who is staring at his water tin.'),
        PI('That’s a lovely story. I mean it. But I’ve just drunk the last of the water.', 'sad'),
        PI('It’s the eighth day. I ought to be walking to a spring myself, if I knew where there was one.'),
        PR('My friend the fox said…'),
        PI('Not now. I’m sorry. Not the fox. We’re out of water, and that’s serious.', 'sad'),
        PR('I’m thirsty too. Let’s look for a well.'),
      ],
    },
    rewards: [],
    sets: { 'a16-14': true },
    notes:
      'The pills are drawn as plain white tablets in a tin and are never taken by anyone on screen; there is no option ' +
      'to buy or try one. The trains are lit carriages passing at speed, our own design; the children at the windows are ' +
      'silhouettes. The complete scene turns the page from the tellings to the present: from here on the story is ' +
      'the desert, now.',
  },

  // ---------------------------------------------------------------- A16-15
  {
    id: 'a16-15',
    code: 'A16-15',
    title: 'The Well',
    source: `${BOOK}, ch. XXIV–XXV: the walk and the well`,
    audience: 'all',
    trigger: { where: WHERE, when: after('A16-14') },
    requires: ['A16-14'],
    speakers: [PRINCE, PILOT],
    steps: [
      {
        id: 'a16-15-s1',
        goal: 'Walk through the night with the pilot, looking for a well.',
        hint: 'Keep up with the pilot across the dunes. Don’t stop.',
        check: 'walk:a16-desert:night',
        scene: {
          id: 'a16-15-night',
          lines: [
            N('A well, in all this desert, is a silly idea. You set off anyway, all of you, with your Nubbin in front as if it knows the way.'),
            N('The stars come out. The sand is cold under your feet, and silver, and goes on for ever.'),
            PI('Here. Your little one’s shivering.'),
            N('He unwinds the long scarf from his own neck and winds it round and round your Nubbin, until only its eyes show.'),
            PR('There’s water somewhere. You can tell. The sand goes quiet over it.', 'think'),
            N('After a long time the boy stumbles, and sits, and falls asleep where he sits.'),
            N('The pilot picks him up very carefully, as if he might break, and carries him on through the night.'),
            PI('He weighs nothing. I keep thinking I’ll drop him, and he weighs nothing at all.', 'soft'),
          ],
          choices: [
            {
              id: 'box',
              label: 'Carry the sheep box.',
              then: [N('You carry the box with holes. Your Nubbin rides on it in its scarf, keeping an eye on the sheep.')],
            },
            {
              id: 'tin',
              label: 'Carry the empty water tin.',
              then: [N('It is very light, and it rattles. You carry it anyway, so you’ll have something to fill.')],
            },
            {
              id: 'wind',
              label: 'Walk on the windy side of the pilot.',
              then: [N('You walk on the wind’s side. The pilot doesn’t say anything, but he walks a little closer.')],
            },
          ],
        },
        done: {
          id: 'a16-15-night-done',
          lines: [N('Dawn comes up grey, then gold. The boy wakes in the pilot’s arms, and points.')],
        },
      },
      {
        id: 'a16-15-s2',
        goal: 'Find the well at daybreak, and draw up the water.',
        hint: 'Help the pilot haul the bucket. Steady it on the wall.',
        check: 'find:a16-well:daybreak',
        scene: {
          id: 'a16-15-well',
          lines: [
            N('A well. Not a hole in the sand, like desert wells, but a real one: a stone ring, a rope, a pulley and a bucket.'),
            PI('This doesn’t belong here. It’s a village well. Where’s the village?', 'shock'),
            PR('Shh. Listen.'),
            N('He takes hold of the rope and pulls. The pulley turns and creaks, like an old gate that hasn’t been asked to open for years.'),
            PR('It’s complaining. Nobody’s woken it up for ages.', 'happy'),
            PI('Let me. It’s too heavy for you.'),
            N('The pilot hauls the bucket up, hand over hand, muttering.'),
            PI('Don’t ask. It’s the system.'),
            N('You steady it on the stone, with the sun shaking in the water. Your Nubbin mutters too, to help.'),
          ],
        },
        done: {
          id: 'a16-15-well-done',
          lines: [N('The bucket sits on the wall, full to the brim. The water in it is gold with the sunrise.')],
        },
      },
      {
        id: 'a16-15-s3',
        goal: 'Share the water.',
        hint: 'Hold the bucket so that everyone can drink.',
        check: 'collect:a16-water:well',
        scene: {
          id: 'a16-15-water',
          lines: [
            PR('Can I have some? That’s the water I wanted. That one.'),
            N('The pilot lifts the bucket to the boy’s lips. He drinks with his eyes shut, as if it were his birthday.'),
            PR('It isn’t the water. It’s the walk.', 'soft'),
            PI('Your turn.'),
            N('The bucket is heavy and cold on the outside, and the sun is in it.'),
            N('Your Nubbin stands on tiptoe on the stone, looking in.'),
          ],
          choices: [
            {
              id: 'nubbin',
              label: 'Let your Nubbin drink first.',
              then: [N('You tip the bucket for your Nubbin. It puts its whole face in, scarf and all, and comes up dripping and happy.')],
            },
            {
              id: 'drink',
              label: 'Drink.',
              then: [N('You drink. Your Nubbin drinks after you, with its nose right in the bucket.')],
            },
            {
              id: 'hold',
              label: 'Hold the bucket for the pilot.',
              then: [N('You hold it while he drinks, both hands round it. He nods at you over the rim, and doesn’t stop for a long time.')],
            },
          ],
        },
        done: {
          id: 'a16-15-water-done',
          lines: [
            N('It tastes of the walk: the cold sand and the stars, the creak of the pulley, and being carried.'),
            PI('That’s the best thing I’ve ever drunk.', 'happy'),
          ],
        },
      },
    ],
    complete: {
      id: 'a16-15-complete',
      lines: [
        N('You all sit with your backs against the warm stone. The boy looks at the pilot sideways.'),
        PR('You must go back to your engine now. Then come back here, tomorrow evening.'),
        PR('Tomorrow it will be a year since I came down. I came down just near here.'),
        PR('I’m going home to my rose. It’s a long way.', 'soft'),
        N('The pilot unwinds the scarf from your Nubbin, looks at it, and winds it back on again.'),
        PI('Keep it. It’s walked further than I have tonight.'),
        N('Whatever else your Nubbin has picked up on its travels, the scarf is winning.'),
      ],
    },
    rewards: [
      {
        id: 'a16-long-scarf',
        kind: 'cosmetic',
        label: 'The Long Scarf',
        description: 'The pilot’s long flying scarf, wound round and round your Nubbin until only its eyes show.',
      },
    ],
    sets: { 'a16-15': true },
    notes:
      'The night walk is a slow auto-walk under the stars (about a minute of play), with the pilot carrying the sleeping ' +
      'boy; no fail state, no thirst meter. The well is a stone village well with a creaking pulley, our own design. ' +
      'SABLE (read when this quest starts): for bonded, play a16-15-well-done-bonded for a16-15-well-done (she drinks ' +
      'first). The scarf is our own design (a long knitted oatmeal scarf with a stripe), not the prince’s. ' +
      'LEARNING GROVE: the reader-band version ends here, on "I’m going home to my rose", and skips A16-16 and A16-17.',
  },

  // ---------------------------------------------------------------- A16-16
  {
    id: 'a16-16',
    code: 'A16-16',
    title: 'The Wall',
    source: `${BOOK}, ch. XXV–XXVI: the muzzle and the wall`,
    audience: 'all',
    trigger: { where: WHERE, when: after('A16-15') },
    requires: ['A16-15'],
    speakers: [PRINCE, PILOT],
    steps: [
      {
        id: 'a16-16-s1',
        goal: 'Find the boy at the old stone wall by the well, at dusk.',
        hint: 'Walk back to the well with the pilot as the sun goes down.',
        check: 'watch:a16-wall:dusk',
        scene: {
          id: 'a16-16-wall',
          lines: [
            N('The next evening the pilot comes back from the plane with oil to his elbows and good news. The engine works.'),
            N('By the well there is an old stone wall, half fallen. The boy is sitting on top of it, legs dangling, talking to someone below.'),
            PR('Not here. Where I first came down. You know the spot.'),
            N('You can’t hear the answer. You can only see a thin gold line in the sand at the foot of the wall, as still as a crack.'),
            PR('Tonight, then. Go on now. I’m coming down.', 'soft'),
            N('The gold line pours itself away between the stones, without hurrying, and is gone. Your Nubbin watches the place where it was.'),
            PR('Your engine’s mended, isn’t it? I can tell by your face. You can go home.', 'happy'),
            PI('How did you know that?', 'shock'),
            PR('I’m going home too. Tonight.'),
          ],
          choices: [
            {
              id: 'who',
              label: 'Ask who he was talking to.',
              then: [PR('Someone who’s going to help me get home.'), N('He doesn’t say any more, and you don’t ask.')],
            },
            {
              id: 'sit',
              label: 'Sit on the wall next to him.',
              then: [N('You climb up and sit beside him on stone still warm from the day. He bumps your shoulder, once, with his.')],
            },
          ],
        },
        done: {
          id: 'a16-16-wall-done',
          lines: [N('Night comes down over the desert, and the stars come out, all of them at once.')],
        },
      },
      {
        id: 'a16-16-s2',
        goal: 'Give the boy the muzzle for his sheep.',
        hint: 'Stay by the pilot while he finds the drawing.',
        check: 'give:a16-prince:muzzle',
        scene: {
          id: 'a16-16-muzzle',
          lines: [
            PR('The muzzle you drew, on the first morning. Can I have it now?', 'think'),
            PI('I’ve had it in my notebook all this time.'),
            N('He takes out the notebook, and from the very back a folded scrap of paper, gone soft at the creases.'),
            N('It is the muzzle he drew on the first morning: a little muzzle, a leather strap, and a proper buckle.'),
            PI('Strap and all. I didn’t forget.', 'soft'),
            PR('He won’t be able to get it off. She’ll be safe. And he won’t ever be blamed for anything.', 'happy'),
            N('He folds it into his pocket, next to the box with the sheep in it, and pats the pocket twice.'),
          ],
        },
      },
      {
        id: 'a16-16-s3',
        goal: 'Take the boy’s present, and look up at the stars when he asks.',
        hint: 'Stay by the boy. When he asks, look at the sky.',
        check: 'watch:a16-stars:night',
        scene: {
          id: 'a16-16-stars',
          lines: [
            ...A16_STARS_OPEN,
            PR('And this is for you. To keep.'),
            N('He holds out a petal: one of hers, fallen on the morning he left. It is dry and thin as paper, and still a little red.'),
            PI('Give it here. I’ll press it flat for you.', 'soft'),
            N('The pilot lays it in his notebook, shuts it tight, and tears out the page for you.'),
            A16_STARS_ASK,
          ],
          choices: A16_STARS_CHOICES,
        },
        done: {
          id: 'a16-16-stars-done',
          lines: [
            N('You look up, and up. The stars are very many and very near, and for a moment one of them seems brighter than it should.'),
            N('When you look down again, he is lying softly in the sand.'),
          ],
        },
      },
    ],
    complete: {
      id: 'a16-16-complete',
      lines: [
        N('The page goes dark and soft, like a lamp turned low.'),
        N('For a while there is only the wind moving the sand, very gently, the way you’d smooth a blanket.'),
        N('Your Nubbin has fallen asleep in its scarf, against your side.'),
        N('Then the dark turns grey, and the grey turns gold, and it is morning.'),
      ],
    },
    rewards: [
      {
        id: 'a16-pressed-petal',
        kind: 'decor',
        label: 'The Pressed Petal',
        description: 'A page from the pilot’s notebook with one of the rose’s petals pressed flat inside. A little red still shows. (If you left her free.)',
      },
      {
        id: 'a16-glass-globe',
        kind: 'decor',
        label: 'The Glass Globe',
        description: 'The rose’s glass globe, empty and clear. It sits on a shelf and covers nothing. (If you wanted her under glass.)',
      },
    ],
    sets: { 'a16-16': true },
    notes:
      'PARENT NOTE (optional, for under-10s; show once, before this quest starts, if the player profile is under 10): ' +
      '"The next part of the story is the sad part of the book. The boy goes home to his rose in a way the story never ' +
      'explains, and the game doesn’t show it. You may like to play it together." [Continue] [Play it together later]. ' +
      'The Learning Grove version skips this quest altogether. ' +
      'CARE (the snake): it is only a thin gold line in the sand, seen from a distance, and it pours away without ' +
      'striking. Nothing is bitten, nothing is said about bites or poison. In a16-16-stars-done the camera tilts up from ' +
      'the boy to the sky (hold on the stars for about three seconds, one star brightening a little), then tilts back ' +
      'down: he is lying softly in the sand, curled as if asleep, the scarf over him. No sound, no fall, no reaction ' +
      'shot. Then straight to the complete scene. ' +
      'STRAP PAYOFF (a16-strap): the step 2 scene shown, a16-16-muzzle, is for asked. For left play ATLAS_A16_VARIANTS ' +
      'a16-16-muzzle-left (the pilot draws it then and there, and forgets the strap). ' +
      'GLOBE PAYOFF (a16-globe): the step 3 scene shown, a16-16-stars, is for free (the pressed petal). For glass play ' +
      'a16-16-stars-glass (the globe). Grant only the matching reward: the Pressed Petal for free, the Glass Globe for ' +
      'glass. ' +
      'SABLE (read when this quest starts): for bonded, play a16-16-lean-bonded straight after a16-16-wall-done.',
  },

  // ---------------------------------------------------------------- A16-17
  {
    id: 'a16-17',
    code: 'A16-17',
    title: 'The Stars',
    source: `${BOOK}, ch. XXVII and the last page`,
    audience: 'all',
    trigger: { where: WHERE, when: after('A16-16') },
    requires: ['A16-16'],
    speakers: [PILOT],
    steps: [
      {
        id: 'a16-17-s1',
        goal: 'Go back to the wall in the morning.',
        hint: 'Walk with the pilot to the wall by the well.',
        check: 'explore:a16-wall:morning',
        scene: {
          id: 'a16-17-morning',
          lines: [
            N('In the morning you go back to the wall with the pilot. The sand at the foot of it is smooth, and there is nobody there.'),
            N('No footprints, nothing at all, as if he had never been heavy enough to leave a mark.'),
            PI('There’s nothing here. He got home.', 'soft'),
            PI('He went home to his rose.'),
            N('He says it as if he has checked, and he has. He looks for a long time, and then nods, very firmly.'),
            PI('He was always lighter than he should have been. I noticed it, carrying him.'),
          ],
          choices: [
            {
              id: 'agree',
              label: 'Tell the pilot you think so too.',
              then: [PI('Good. Then that’s two of us. Three.', 'soft')],
            },
            {
              id: 'up',
              label: 'Look up.',
              then: [N('You look up. It is daytime, and the stars are all hidden, but you know they’re there.')],
            },
            {
              id: 'sit',
              label: 'Sit with the pilot.',
              then: [N('You sit beside him on the warm stones. After a while he puts his hand on your Nubbin’s head, and leaves it there.')],
            },
          ],
        },
      },
      {
        id: 'a16-17-s2',
        goal: 'See the pilot off.',
        hint: 'Walk with the pilot back to his plane.',
        check: 'watch:a16-plane:takeoff',
        scene: {
          id: 'a16-17-plane',
          lines: [
            N('The engine starts first time. The pilot sits in the cockpit with it running, and doesn’t go anywhere yet.'),
            PI('If you ever see a boy in a long scarf, asking somebody to draw him something, tell him there’s a pilot who’d like a word.'),
            PI('I’ll look up at night, I think. Most nights. I’ll be listening.'),
            N('He pulls his goggles down. The plane runs along the sand, and lifts, and grows small, and is a dot, and is gone.'),
            N('Your Nubbin watches the dot until there is no dot. Then it watches the sky where the dot was.'),
            N('The sun goes down over the desert, the way it does on every page of the atlas, slowly, for anyone who wants it.'),
          ],
        },
      },
    ],
    complete: {
      id: 'a16-17-complete',
      lines: [...A17_START, ...A17_ASKED, A17_PETAL, A17_PICTURE_ASKED],
    },
    rewards: [],
    sets: { 'a16-17': true, 'a16-done': true },
    notes:
      'CARE: never "he died". The morning has no body, no scarf, no footprint; the pilot says he went home to his rose, ' +
      'and the page agrees. ' +
      'THE LAST PAGE (four endings). The complete scene shown, a16-17-complete, is for a16-globe = free and a16-strap = ' +
      'asked. Otherwise play ATLAS_A16_VARIANTS a16-17-complete-free-left, a16-17-complete-glass-asked or ' +
      'a16-17-complete-glass-left. The last line is the page’s last picture: for asked, the stars drawn laughing; for ' +
      'left, the stars with a small question mark among them (open: some nights they laugh, some nights they don’t). ' +
      'That picture stays on the atlas page from then on. ' +
      'AFTER THE PAGE (in the Grove, read-only; nothing here writes Grove state): if Sable’s stage is t20 when you step ' +
      'out, play a16-grove-t20 (a one-time staging: her idle spot is shown a few tiles nearer the cottage for that ' +
      'scene; no trust change). If a16-sable = came, play a16-grove-luna the next time you talk to Luna. ' +
      'SIM: the Night of Remembering festival (A3, A5, A7, A16, A21, A23; any two) reads atlasDone(\'A16\').',
  },
];

// =================================================================== variants

/**
 * Variant scenes chosen by flags or Grove state. Each quest's notes say which scene each replaces.
 *   Sable's stage (Grove, read-only): a16-01-desert-*, a16-13-fox-*, a16-13-hour-t45,
 *     a16-13-hour-done-*, a16-15-well-done-bonded, a16-16-lean-bonded, a16-grove-t20.
 *   a16-sable (Atlas): a16-grove-luna.
 *   a16-strap (A16-2): a16-16-muzzle-left, a16-17-complete-*-left.
 *   a16-globe (A16-5): a16-13-secret-done-glass, a16-16-stars-glass, a16-17-complete-glass-*.
 *   The lamp (A16-9): a16-grove-sparks.
 */
export const ATLAS_A16_VARIANTS: Scene[] = [
  // ---------------------------------------------------------------- A16-1, step 1 scene (Sable)
  {
    id: 'a16-01-desert-t45',
    lines: [
      ...A1_OPEN,
      N('Sable has come with you. She stands in your shadow, exactly inside it, as if the sun might not notice her there.'),
      ...A1_REST,
    ],
    choices: A1_CHOICES,
    set: { 'a16-sable': 'came' },
  },
  {
    id: 'a16-01-desert-bonded',
    lines: [
      ...A1_OPEN,
      N('Sable has come with you. She walks at your heel, grey as a pebble against the gold, and doesn’t hide.'),
      ...A1_REST,
    ],
    choices: A1_CHOICES,
    set: { 'a16-sable': 'came' },
  },
  // ---------------------------------------------------------------- A16-13, step 1 scene (Sable)
  {
    id: 'a16-13-fox-t45',
    lines: [
      ...A13_FOX_OPEN,
      N('Sable is with you, in your shadow. The fox’s ears turn towards her, and then politely away.'),
      ...A13_FOX_REST,
    ],
    choices: A13_FOX_CHOICES,
    set: { 'a16-sable': 'came' },
  },
  {
    id: 'a16-13-fox-bonded',
    lines: [
      ...A13_FOX_OPEN,
      N('Sable sits at your heel, grey in the long grass. The fox looks at her for a long moment.'),
      FX('That one’s already tamed. Look how she watches you.'),
      ...A13_FOX_REST,
    ],
    choices: A13_FOX_CHOICES,
    set: { 'a16-sable': 'came' },
  },
  // ---------------------------------------------------------------- A16-13, step 2 scene (t45: the lesson plays twice)
  {
    id: 'a16-13-hour-t45',
    lines: [
      ...A13_HOUR_RULES,
      N('The shadow touches the stone, and the boy sits down a long way off. Behind you, out of your shadow, Sable sits down too.'),
      FX('Oh, look. She’s listening. Go on, then. Same hour, for her as well.'),
      N('Sunset, stars, sunrise, and the shadow touches the stone. The boy moves nearer the fox, and Sable moves one step nearer you.'),
      N('And again, one step, her ears up. She doesn’t look straight at you, and you don’t look straight at her.'),
      N('On the fourth day, when the shadow touches the white stone, Sable is sitting one step from your hand.', 'soft'),
    ],
  },
  // ---------------------------------------------------------------- A16-13, step 2 done (t20, t45, bonded)
  {
    id: 'a16-13-hour-done-t20',
    lines: [
      A13_HOUR_DONE,
      N('You think of the long grass at home, where something small and grey still runs when you come near. Same hour, a little nearer.', 'soft'),
    ],
  },
  {
    id: 'a16-13-hour-done-t45',
    lines: [
      A13_HOUR_DONE,
      N('Sable comes no closer than that one step. But she doesn’t go back into your shadow, either.', 'soft'),
    ],
  },
  {
    id: 'a16-13-hour-done-bonded',
    lines: [
      A13_HOUR_DONE,
      N('Sable has watched it all from your heel without moving. The fox catches her eye, and its tail twitches, as if they agree.', 'soft'),
    ],
  },
  // ---------------------------------------------------------------- A16-13, step 3 done (glass)
  {
    id: 'a16-13-secret-done-glass',
    lines: [
      N('Then the fox turns its head, and looks at you as well.'),
      FX('You as well. You’re the one who wanted her under glass. Glass isn’t taming. Remember it, for both of you.'),
      N('Then it goes back into the wheat. You can see where it goes by the way the gold moves.'),
      PR('I’ll remember. I have to remember.', 'soft'),
    ],
  },
  // ---------------------------------------------------------------- A16-15, step 2 done (bonded)
  {
    id: 'a16-15-well-done-bonded',
    lines: [
      N('The bucket sits on the wall, full to the brim. The water in it is gold with the sunrise.'),
      N('Sable puts her front paws on the stone and drinks first, before anyone. Nobody says a word; everyone waits for her.'),
    ],
  },
  // ---------------------------------------------------------------- A16-16, after the wall (bonded)
  {
    id: 'a16-16-lean-bonded',
    lines: [
      N('Sable has come up onto the wall beside you without a sound. She leans her whole weight against your shin, and stays there.'),
      N('She doesn’t move for the rest of the night. Not once.'),
    ],
  },
  // ---------------------------------------------------------------- A16-16, step 2 scene (left)
  {
    id: 'a16-16-muzzle-left',
    lines: [
      PR('Will you draw a muzzle for my sheep? So he can’t eat her.', 'think'),
      PI('A muzzle. Yes. Hang on.'),
      N('He takes out his pencil and draws one quickly on the back of a page, by starlight: a little muzzle for a little sheep.'),
      PR('Thank you. Now she’ll be safe.', 'happy'),
      N('He folds it into his pocket, next to the box with the sheep in it, and pats the pocket twice.'),
      N('Nobody notices that there is no strap to fasten it on with. Not tonight.'),
    ],
  },
  // ---------------------------------------------------------------- A16-16, step 3 scene (glass)
  {
    id: 'a16-16-stars-glass',
    lines: [
      ...A16_STARS_OPEN,
      PR('And this is for you. I won’t need it.'),
      N('It is the glass globe, cool and clear, the size of your two hands together. The stars are in it, upside down.'),
      PI('Hold it with both hands. It’s the only thing he had that could break.', 'soft'),
      A16_STARS_ASK,
    ],
    choices: A16_STARS_CHOICES,
  },
  // ---------------------------------------------------------------- A16-17, the last page (four endings)
  {
    id: 'a16-17-complete-free-left',
    lines: [...A17_START, ...A17_LEFT, A17_PETAL, A17_PICTURE_LEFT],
  },
  {
    id: 'a16-17-complete-glass-asked',
    lines: [...A17_START, ...A17_ASKED, A17_GLASS, A17_PICTURE_ASKED],
  },
  {
    id: 'a16-17-complete-glass-left',
    lines: [...A17_START, ...A17_LEFT, A17_GLASS, A17_PICTURE_LEFT],
  },
  // ---------------------------------------------------------------- the Grove, after the page
  {
    id: 'a16-grove-t20',
    lines: [
      N('When you close the atlas, Sable is sitting in the long grass. She is a little nearer the cottage than she was when you opened it.'),
      N('She doesn’t come any closer. But she doesn’t go, either.', 'soft'),
    ],
  },
  {
    id: 'a16-grove-luna',
    lines: [
      LU('She went into a book with you? Into a whole desert, and didn’t hide?'),
      LU('She tamed you, you know. Not the other way round.', 'soft'),
      N('Sable, somewhere near, says nothing. Her ears stay up.'),
    ],
  },
  {
    id: 'a16-grove-sparks',
    lines: [
      SPK('Hang on. Hang on. That lamp on the hill just lit itself.', 'shock'),
      SPK('No wires. No switch. No timer that I can see. How’s it wired?', 'think'),
      N('You tell her it came from a planet where a day lasts a minute. She looks at you, and then at the lamp.'),
      SPK('Right. Well. I’m having a look at it anyway. Some evening.', 'happy'),
    ],
  },
];

// =================================================================== flags and checks

/** Every flag this line sets (Atlas save only). It reads Sable's stage from the Grove and writes no Grove flag. */
export const ATLAS_A16_FLAGS: string[] = [
  'a16-01',
  'a16-02',
  'a16-03',
  'a16-04',
  'a16-05',
  'a16-06',
  'a16-07',
  'a16-08',
  'a16-09',
  'a16-10',
  'a16-11',
  'a16-12',
  'a16-13',
  'a16-14',
  'a16-15',
  'a16-16',
  'a16-17',
  'a16-done', // A16-17: the whole page; read by atlasDone('A16') for the Night of Remembering and the Grove scenes
  'a16-strap', // asked | left (a16-02-muzzle): A16-16 and the last page
  'a16-globe', // free | glass (a16-05-goodbye): A16-13, A16-16 and the last page
  'a16-sable', // came (Sable variants of A16-1 and A16-13): the Grove's Luna scene
];

export const ATLAS_A16_CHECKS: string[] = [
  'explore:a16-desert:plane',
  'inspect:a16-drawing:notebook',
  'wait:a16-plane:dawn',
  'watch:a16-sheep:drawings',
  'choose:a16-muzzle:box',
  'talk:a16-prince:plane',
  'collect:a16-baobab:shoots',
  'sit:a16-chair:sunset',
  'wait:a16-sunset:dark',
  'watch:a16-rose:bud',
  'carry:a16-globe:rose',
  'choose:a16-globe:morning',
  'visit:a16-king:throne',
  'wait:a16-king:sunset',
  'visit:a16-vain:hat',
  'visit:a16-drinker:bottles',
  'visit:a16-business:desk',
  'talk:a16-prince:desk',
  'visit:a16-lamplighter:planet',
  'place:a16-taper:lamp',
  'visit:a16-geographer:desk',
  'talk:a16-geographer:flower',
  'explore:a16-earth:dunes',
  'talk:a16-snake:dunes',
  'find:a16-flower:desert',
  'climb:a16-mountain:peak',
  'sit:a16-prince:garden',
  'talk:a16-fox:apple-tree',
  'sit:a16-fox:hour',
  'walk:a16-garden:roses',
  'watch:a16-trains:switch',
  'talk:a16-merchant:tray',
  'walk:a16-desert:night',
  'find:a16-well:daybreak',
  'collect:a16-water:well',
  'watch:a16-wall:dusk',
  'give:a16-prince:muzzle',
  'watch:a16-stars:night',
  'explore:a16-wall:morning',
  'watch:a16-plane:takeoff',
];
