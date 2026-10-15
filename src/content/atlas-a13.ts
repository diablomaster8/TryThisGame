/**
 * Atlas campaign, page A13: The Wooden Boy (Part M, A13). Twenty quests, A13-1 to A13-20.
 *
 * SOURCE AND RIGHTS. Carlo Collodi (Carlo Lorenzini, 1826–1890), Le avventure di Pinocchio:
 * storia di un burattino, serialised 1881–1882 and published as a book by Felice Paggi, Florence,
 * 1883. Public domain everywhere; there is no rights holder. The English beats follow M. A.
 * Murray's translation (T. Fisher Unwin, 1892; J. M. Dent reprint, 1911), also out of copyright,
 * but no sentence of it is quoted (see LIFTED TEXT). This is Collodi's book and nothing else.
 * Disney's 1940 film, its songs, names and designs belong to Disney and are not used: no Jiminy,
 * Monstro, Figaro, Cleo, Stromboli, Honest John, Gideon, Lampwick, Pleasure Island, "Blue
 * Fairy", wishing star, Tyrolean hat or lederhosen. Collodi's Pinocchio has no strings, and the
 * word "strings" is kept off this page entirely. The illustrations of Mazzanti (1883) and
 * Mussino (1911) are not imitated: all art is original, drawn in the atlas's brown-ink style.
 *
 * AUDIENCE. 'all'. The page quotes no lifted text, so no line needs a childLines entry. Collodi's
 * darker beats are softened in the main text itself (see CARE NOTES). The Learning Grove's edu
 * version of this page is a separate job and is not in this file.
 *
 * FRAME. Nova's atlas falls open at a page in brown ink. You and your Nubbin step into Collodi's
 * Tuscany, out of the rain into Master Cherry's workshop, and Geppetto gives you the corner of his
 * room under the stairs. You are a traveller who follows the puppet from the workshop to the sea.
 * Pinocchio is the hero and keeps his story: you can warn him, and he never listens. Your Nubbin
 * rides in Geppetto's felt cap (A13-1 to A13-2, again in A13-19) and carries the candle out of the
 * Dog-fish (A13-19). Collodi's animals talk, because the Atlas is not the Grove (canon 31): the
 * Talking-cricket, the Fox and the Cat, the Tunny, the Snail and the rest. Your Nubbin never
 * talks. Clank, a machine, does. The atlas "turns its own pages" to carry you over Collodi's
 * long gaps (four months in prison, a school year, five months in the Land of Toys).
 *
 * GROVE FLAGS READ (read-only; the Atlas never writes a Grove flag):
 *   - s21Done: Clank comes too, with a folding ramp Byte made him, because Collodi's world is all
 *     steps. He is drawn in every A13 scene, silent, parked on his ramp, and speaks only in his
 *     variants: a13-01-page-clank (A13-1 step 1 scene), a13-05-coat-clank (A13-5 step 3 done),
 *     a13-19-complete-clank (A13-19 complete), a13-20-complete-clank (A13-20 complete) and then
 *     the word, a13-20-word.
 *   - s25Done (with s21Done): a13-20-word-next-door plays instead of a13-20-word. Clank says Real
 *     "lives next door" to the word, as Moss told him in S25.
 *
 * FLAGS WRITTEN (Atlas save only, all prefixed a13-):
 *   - a13-01 … a13-20: each quest on completion. a13-done: the whole page (A13-20). The Long Table
 *     festival and the Grove keepsakes read it through atlasDone('A13').
 *   - a13-cricket = carried | left (A13-3, a13-03-cricket): THE SIGNATURE CHOICE. Pays off in
 *     A13-10 (he nods to you), A13-18 (Pinocchio admits the cricket was right) and A13-20 ("And
 *     thank your friend for the hedge").
 *   - a13-crust = given | kept (A13-20, a13-20-road): the last beat of the beggars' scene. With a
 *     crust, the Cat, who really can't see now, thanks Pinocchio for it.
 *   - a13-clank-word: true, set by a13-20-word or a13-20-word-next-door (the "Clank's word" scene).
 *     S25 reads it under exactly this name (side-stories-s25.ts, s25-page-found), and so do this
 *     file's Grove keepsake scenes.
 *
 * LIFTED TEXT. None verbatim. Part M lists eight passages from Murray's 1892 translation and marks
 * all eight [unverified]: Murray is not on Project Gutenberg (#16865 is a different 1916
 * translation), and the earlier check used a reprint and a web copy that may have American edits.
 * So each beat is told in our own words, at:
 *   1. "…There was once upon a time a piece of wood." The A1_PAGE lines (a13-01-page#0–2).
 *   2. The Talking-cricket's warning to runaway boys: a13-03-cricket#2.
 *   3. "Oh, I am sick of being a puppet!": a13-16-water-done#2.
 *   4. The Fairy: he will become a boy if he deserves it: a13-16-water-done#3.
 *   5. The reunion cry in the Dog-fish: a13-19-babbo#1.
 *   6. "Get on my shoulders…": a13-19-mouth#3.
 *   7. Pinocchio's thanks to the Tunny (Clank's cue): A19_THANKS#2.
 *   8. The last line, about the puppet he was: A20_WAKE#6.
 * If any of them is later verified against a scan of the 1892 or 1911 text, it can be swapped in
 * verbatim, with a childLines entry for it. No song lyrics. The stone in A13-15 carries our own
 * softened words, not Collodi's epitaph.
 *
 * CARE NOTES.
 *   - Collodi, not Disney (above). The names are Collodi's as Murray gives them: Master Cherry,
 *     Polendina, the Talking-cricket, Fire-eater, Harlequin, Punchinello, the Inn of the Red
 *     Craw-fish, the Field of Miracles, the Fairy with blue hair, Medoro, Melampo, Alidoro,
 *     Candlewick, the Little Man, the Terrible Dog-fish, the Tunny, Giangio. The town is
 *     "Catchfools" (our rendering of Acchiappa-citrulli) and the Land of Toys is the literal
 *     paese dei balocchi, not Murray's "Land of Boobies". Pinocchio wears the flowered-paper suit,
 *     bark shoes and breadcrumb cap. He calls Geppetto "Babbo".
 *   - Softened for 'all': the Talking-cricket is knocked off the wall, never killed. Both A13-3
 *     routes show he is alive (dazed in the ash, or a walking track to the door), and he comes
 *     back as a doctor in A13-10, as in Collodi. A13-8's ghost becomes a faint "cri" in a hedge.
 *     The white blackbird gets away. The hanging is being tied by his collar to the Big Oak. The
 *     girl at the window is "going away", not dead. The rabbits carry no coffin. The Fairy's
 *     gravestone is a small stone saying she went away grieving. The serpent who laughs himself
 *     to death (ch. XX) is left out. The old watchdog Melampo is only "gone". The schoolboy
 *     Eugene gets up. The Green Fisherman is comic. The sea washes the donkey off Pinocchio
 *     ("only a sort of coat"); nothing eats him. Candlewick's death is gentle and honest, like
 *     Fossil's: he knows his friend, lays his head in his lap and stops breathing.
 *   - Commission an Italian adviser before the script is final (names, Tuscany, the masks).
 *   - Hazel's third rule is acted out, never quoted (your Nubbin by Candlewick's head).
 *   - Clank is he/him, Pixel she/her, Byte he/him. Clank never becomes anything: he is still a
 *     kettle on one wheel at the end, and that is the point.
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

const WHERE = 'Nova’s atlas: the Wooden Boy page (Atlas campaign)';
const after = (code: string) => `Any time after ${code}, from Nova’s atlas.`;
const SRC = 'The Adventures of Pinocchio (Carlo Collodi, 1883)';

// ------------------------------------------------------------------ speakers

const PINOCCHIO = sp(
  'a13-pin',
  'Pinocchio',
  'Pinocchio, the wooden puppet (Collodi, 1883); original design: flowered-paper suit, bark shoes, breadcrumb cap, no strings',
);
const GEPPETTO = sp('a13-geppetto', 'Geppetto', 'Geppetto, called Polendina for his yellow wig (Collodi, 1883); original design');
const CHERRY = sp('a13-cherry', 'Master Cherry', 'Master Antonio, called Master Cherry (Collodi, 1883, ch. I–II)');
const LOG = sp('a13-log', 'A Small Voice', 'The talking log, before it is carved (Collodi, 1883, ch. I–II)');
const CRICKET = sp('a13-cricket', 'The Talking-cricket', 'Il Grillo Parlante (Collodi, 1883); original design, nothing from any film');
const CARABINEER = sp('a13-carabineer', 'Carabineer', 'The carabineer in the street (Collodi, 1883, ch. III)');
const CHICK = sp('a13-chick', 'The Chick', 'The chick in the egg (Collodi, 1883, ch. V)');
const NIGHTCAP = sp('a13-nightcap', 'Old Man in a Nightcap', 'The old man at the window (Collodi, 1883, ch. VI)');
const HARLEQUIN = sp('a13-harlequin', 'Harlequin', 'Harlequin, a puppet of the Great Puppet Theatre (Collodi, 1883, ch. X–XI)');
const PUNCH = sp('a13-punch', 'Punchinello', 'Punchinello (Pulcinella), a puppet of the Great Puppet Theatre (Collodi, 1883)');
const FIRE = sp('a13-fireeater', 'Fire-eater', 'Mangiafuoco, the showman, in Murray’s translation Fire-eater (Collodi, 1883)');
const FOX = sp('a13-fox', 'The Fox', 'The Fox, who is not lame (Collodi, 1883)');
const CAT = sp('a13-cat', 'The Cat', 'The Cat, who is not blind until the end (Collodi, 1883)');
const INNKEEPER = sp('a13-innkeeper', 'Innkeeper', 'The host of the Inn of the Red Craw-fish (Collodi, 1883, ch. XIII)');
const SACK_TALL = sp('a13-sack-tall', 'The Taller Sack', 'One of the two assassins in charcoal sacks: the Fox (Collodi, 1883, ch. XIV)');
const SACK_SHORT = sp('a13-sack-short', 'The Shorter Sack', 'One of the two assassins in charcoal sacks: the Cat (Collodi, 1883, ch. XIV)');
const FAIRY = sp('a13-fairy', 'The Fairy', 'The Fairy with blue hair (la Fata dai capelli turchini, Collodi, 1883); not any film’s fairy');
const MEDORO = sp('a13-medoro', 'Medoro', 'Medoro, the Fairy’s poodle coachman (Collodi, 1883, ch. XVI)');
const CROW = sp('a13-crow', 'Doctor Crow', 'The Crow, first of the three doctors (Collodi, 1883, ch. XVI)');
const OWL = sp('a13-owl', 'Doctor Owl', 'The Owl, second of the three doctors (Collodi, 1883, ch. XVI)');
const RABBIT = sp('a13-rabbit', 'Black Rabbit', 'One of the four black rabbits (Collodi, 1883, ch. XVII); they carry nothing here');
const PARROT = sp('a13-parrot', 'The Parrot', 'The Parrot in the Field of Miracles (Collodi, 1883, ch. XIX)');
const JUDGE = sp('a13-judge', 'The Judge', 'The Gorilla judge of Catchfools (Collodi, 1883, ch. XIX)');
const JAILER = sp('a13-jailer', 'Jailer', 'The jailer at the amnesty (Collodi, 1883, ch. XIX)');
const FARMER = sp('a13-farmer', 'The Farmer', 'The farmer who chains Pinocchio as a watchdog (Collodi, 1883, ch. XXI–XXII)');
const MARTEN = sp('a13-marten', 'Marten', 'The martens who raid the hen-house (Collodi, 1883, ch. XXII)');
const PIGEON = sp('a13-pigeon', 'The Pigeon', 'The great Pigeon (Collodi, 1883, ch. XXIII)');
const COALMAN = sp('a13-coalman', 'Coalman', 'The coalman on the Island of Busy Bees (Collodi, 1883, ch. XXIV)');
const WOMAN = sp('a13-woman', 'A Little Woman', 'The Fairy with blue hair, grown up, before Pinocchio knows her (Collodi, 1883, ch. XXIV)');
const SCHOOLBOY = sp('a13-schoolboy', 'Schoolboy', 'Pinocchio’s schoolmates (Collodi, 1883, ch. XXVI–XXVII)');
const EUGENE = sp('a13-eugene', 'Eugene', 'Eugene, the boy hit by the arithmetic book (Collodi, 1883, ch. XXVII); he gets up');
const ALIDORO = sp('a13-alidoro', 'Alidoro', 'Alidoro, the carabineers’ mastiff (Collodi, 1883, ch. XXVII–XXVIII)');
const FISHER = sp('a13-fisher', 'The Green Fisherman', 'The Green Fisherman (Collodi, 1883, ch. XXVIII), played comic');
const CANDLEWICK = sp('a13-candlewick', 'Candlewick', 'Lucignolo, in Murray’s translation Candlewick (Collodi, 1883)');
const LITTLEMAN = sp('a13-littleman', 'The Little Man', 'The Little Man who drives the coach to the Land of Toys (Collodi, 1883, ch. XXX–XXXII)');
const MARMOT = sp('a13-marmot', 'The Marmot', 'The little Marmot who names the donkey fever (Collodi, 1883, ch. XXXII)');
const BUYER = sp('a13-buyer', 'The Drum Man', 'The man who buys the lame donkey for its hide (Collodi, 1883, ch. XXXIII–XXXIV)');
const TUNNY = sp('a13-tunny', 'The Tunny', 'The Tunny swallowed with Pinocchio (Collodi, 1883, ch. XXXIV–XXXV)');
const SNAIL = sp('a13-snail', 'The Snail', 'The Fairy’s Snail (Collodi, 1883, ch. XXIX and XXXVI)');
const GIANGIO = sp('a13-giangio', 'Giangio', 'Giangio the gardener and his water-wheel (Collodi, 1883, ch. XXXVI)');
/** The same Clank as S21 (side-stories-new-4.ts) and S25; shared id. Only with s21Done. */
const CLANK: Speaker = {
  id: 'clank',
  name: 'Clank',
  kind: 'other',
  basedOn: 'Claptrap, the CL4P-TP unit (Borderlands), reference only',
};

const N = say('narrator');
const Y = say('you');
const PX = say('pixel');
const CK = say('clank');
const P = say('a13-pin');
const G = say('a13-geppetto');
const MC = say('a13-cherry');
const LG = say('a13-log');
const CR = say('a13-cricket');
const CB = say('a13-carabineer');
const CH = say('a13-chick');
const NC = say('a13-nightcap');
const HQ = say('a13-harlequin');
const PU = say('a13-punch');
const FE = say('a13-fireeater');
const FX = say('a13-fox');
const CT = say('a13-cat');
const IK = say('a13-innkeeper');
const ST = say('a13-sack-tall');
const SS = say('a13-sack-short');
const FY = say('a13-fairy');
const MD = say('a13-medoro');
const CW = say('a13-crow');
const OW = say('a13-owl');
const RB = say('a13-rabbit');
const PR = say('a13-parrot');
const JG = say('a13-judge');
const JL = say('a13-jailer');
const FM = say('a13-farmer');
const MT = say('a13-marten');
const PG = say('a13-pigeon');
const CO = say('a13-coalman');
const WO = say('a13-woman');
const SB = say('a13-schoolboy');
const EU = say('a13-eugene');
const AL = say('a13-alidoro');
const GF = say('a13-fisher');
const CW2 = say('a13-candlewick');
const LM = say('a13-littleman');
const MA = say('a13-marmot');
const BU = say('a13-buyer');
const TU = say('a13-tunny');
const SN = say('a13-snail');
const GI = say('a13-giangio');

// ------------------------------------------------------------------ shared pieces

/** A13-1: the atlas page opening (lifted text 1, told in our own words). Both Clank variants. */
const A1_PAGE: Line[] = [
  N('Nova’s atlas falls open at a page in brown ink: a hill town, a long white road, and along the bottom edge, the sea.'),
  N('The words across the top begin the way stories for children do. Once upon a time there was… a king, you think.'),
  N('No. Once upon a time there was a piece of wood.'),
];

/** A13-1: Master Cherry and the log, after you are inside. Both Clank variants. */
const A1_LOG: Line[] = [
  N('The carpenter’s nose is so round and red and shiny that it looks like a ripe cherry. Everyone calls him Master Cherry, and you can see why.'),
  MC('I’m making a table leg. Out of this. A firewood log, a nothing log. Nothing special about it at all.'),
  N('He spits on his hands and lifts the axe.'),
  LG('Don’t hit me too hard!'),
];

/** A13-5: the coat comes home (both Clank variants of the step 3 done). */
const A5_COAT: Line[] = [
  N('He comes back an hour later with a spelling-book under his arm, in his shirt-sleeves. There is snow on his shoulders.'),
  P('Babbo, where’s your coat?'),
  G('I sold it.'),
  P('Why?'),
  G('It was too warm.', 'happy'),
  N('Pinocchio understands. He throws his arms round the old man’s neck and kisses him all over his face.'),
];

/** A13-10: the doctors leave (both cricket variants of the step 2 done). */
const A10_LEAVE: Line[] = [N('The doctors pick up their bags. The Talking-cricket goes last, very slowly, on one stiff leg.')];

/** A13-18: Pinocchio comes up out of the sea a puppet again (both cricket variants). */
const A18_SEA: Line[] = [
  N('After an hour the man hauls in his rope. Up out of the sea comes, not a donkey, but a wooden puppet, wriggling like an eel.'),
  BU('Where’s my donkey?', 'shock'),
  P('The sea washed him off. All the little fish had a nibble. It turns out the donkey was only a sort of coat.', 'happy'),
  N('He wriggles out of the rope, dives, and swims away laughing.'),
];

/** A13-19: on the shore with the Tunny (lifted text 7, told in our own words). Both Clank variants. */
const A19_THANKS: Line[] = [
  N('On the sand Pinocchio helps his father up, gently, as if Geppetto were made of glass. Then he turns to the Tunny.'),
  N('He opens his mouth, and shuts it, and opens it again.'),
  P('You saved my babbo. I want to thank you properly, and I can’t. I’ve looked, and there isn’t a word big enough.', 'soft'),
  N('So he kisses the Tunny on the nose instead. The Tunny, who is not used to it, dives at once, so that nobody will see him cry.'),
];

/** A13-19: the last line of both complete scenes. */
const A19_CANDLE: Line[] = [
  N('Your Nubbin is still holding the green bottle. The candle went out in the sea, but the bottle kept it dry, and it won’t give it up.'),
];

/** A13-20: the beggars by the road (scene opening). */
const A20_ROAD: Line[] = [
  N('Geppetto can hardly stand. Pinocchio gives him his arm, you walk on his other side, and the three of you go up the road very slowly.'),
  N('By the road sit two beggars: a Fox, thin and mangy, with no tail, and a Cat.'),
  N('The Cat is blind. Really blind, now.'),
  FX('Oh, Pinocchio! Have pity on two poor sick old creatures!', 'sad'),
  CT('Sick old creatures.', 'sad'),
  FX('We’re so poor I had to sell my tail to a pedlar. He wanted it for a fly-whisk.'),
  P('Goodbye, you cheats. You fooled me once. You won’t fool me twice.', 'angry'),
  P('Money you steal never lasts the week. And a tail you sell doesn’t grow back.'),
  N('He walks on, holding his father up. Behind you, the Cat turns his face to the sound of your feet.'),
];

/** A13-20: the Talking-cricket in the straw hut (both cricket variants). */
const A20_HUT: Line[] = [
  CR('Oh, my Pinocchio.'),
  P('Oh, my dear little Cricket!', 'happy'),
  CR('My dear little Cricket, now, is it? Do you remember the mallet?'),
  P('You’re right. Throw one at me. I deserve it. Only, please, spare my poor father.', 'sad'),
  CR('I shall spare you both. I only wanted to remind you.', 'soft'),
  CR('In this world, be kind to everyone you can. Then, on your bad day, somebody may be kind to you.'),
  CR('This hut was given to me yesterday by a little goat with blue wool. I don’t know where she went.'),
  P('Blue wool…', 'think'),
];

/** A13-20: waking up a boy (lifted text 8, told in our own words, is the last line). All complete scenes. */
const A20_WAKE: Line[] = [
  N('He isn’t wood. He jumps out of bed, and his feet are feet, and he is a boy, with chestnut hair and blue eyes and a hole in his sock.'),
  N('The straw hut is a bright little room. There is a new suit on the chair, and in its pocket a purse with forty gold coins instead of forty pennies.'),
  N('Geppetto is at a new bench by the window, well again, carving a picture frame full of leaves and flowers, and whistling.'),
  P('Babbo! Look at me!', 'happy'),
  G('I am looking. I’ve been looking all your life.', 'soft'),
  N('In the corner, leaning against a chair, is the old wooden puppet. Its head is on one side, and its legs are crossed, as if it were very tired.'),
  P('Look at him. Did I really go about like that, all knees and nose? I’m glad that’s over. I’m so glad I’m me.', 'happy'),
];

/** A13-20: the way home (the last two lines of the page, in every ending). */
const A20_HOME: Line[] = [
  G('And take my old bench, traveller. The little Nubbin on it never got finished. It’s lovely as it is.', 'soft'),
  N('The page settles under your hand like a door closed quietly. You are back in the Grove, with sawdust in your hair and pine on your sleeve.'),
];

/** A13-20: Clank's word, opening (both s25 variants). */
const WORD_START: Line[] = [
  CK('Did they love this one? The wooden one?', 'think'),
  Y('Yes. He sold his coat for that one.'),
  CK('Before it was useful.'),
  G('Before it was anything.', 'soft'),
  N('Clank clicks, and clicks again, the way he did on the shelf in the lantern shed, looking for a word he hasn’t got.'),
  CK('If I stop being useful, will you still love me.', 'soft'),
  N('It isn’t a question. He says it the way you say a thing you have just found in your pocket.'),
  N('Nobody answers. Your Nubbin climbs up onto his hood and sits there, warm, and Geppetto puts down his chisel.'),
  CK('Love. That’s the word.', 'soft'),
];

/** A13-20: Clank's word, close (both s25 variants). */
const WORD_END: Line[] = [
  CK('Pixel didn’t put it in. Nobody puts it in. Somebody does it to you first, and then it’s there.'),
  N('He doesn’t become anything. He is still a kettle on one wheel, with a ramp that says BYTE underneath, and that is the whole point.'),
];

// =================================================================== THE WOODEN BOY

export const ATLAS_A13: Quest[] = [
  // ---------------------------------------------------------------- A13-1
  {
    id: 'a13-01',
    code: 'A13-1',
    title: 'The Piece of Wood',
    source: `${SRC}, ch. I–II: Master Cherry’s log, and Geppetto’s wig`,
    audience: 'all',
    trigger: {
      where: WHERE,
      when: 'Any time once Nova’s atlas is in the Grove; the first quest on the page. With s21Done, Clank comes too.',
    },
    speakers: [CHERRY, LOG, GEPPETTO, CLANK],
    steps: [
      {
        id: 'a13-01-s1',
        goal: 'Step into the brown-ink page, and out of the rain.',
        hint: 'Touch the page. Then find the open door with sawdust on its step.',
        check: 'explore:a13-tuscany:workshop',
        scene: {
          id: 'a13-01-page',
          lines: [
            ...A1_PAGE,
            N('The ink goes wet under your fingers, and then it is rain. You and your Nubbin are standing in a steep stone lane, getting wetter.'),
            N('One door is open, with sawdust on the step and a warm smell of pine. You go in, because the rain has decided for you.'),
            MC('Come in, come in, shut the weather out. Mind the shavings. Mind the cat.'),
            MC('There isn’t a cat. Mind it anyway. It saves arguments.'),
            ...A1_LOG,
          ],
        },
        done: {
          id: 'a13-01-page-done',
          lines: [
            N('Master Cherry looks under the bench, in the cupboard and up the chimney. There is nobody in the shop but you, and you are a stranger.'),
            MC('Did you say that? You didn’t say that. Your little friend didn’t say that. Nobody said that.', 'shock'),
            MC('I imagined it. Wine and weather. That’s all it was.'),
          ],
        },
      },
      {
        id: 'a13-01-s2',
        goal: 'Stay in Master Cherry’s shop while he planes the log.',
        hint: 'Stand by the bench. When the old men start, keep your Nubbin out from under their feet.',
        check: 'watch:a13-cherry:plane',
        scene: {
          id: 'a13-01-plane',
          lines: [
            N('He gives the log a proper whack this time.'),
            LG('Ow! That hurt!'),
            N('Master Cherry sits down on the floor, very suddenly. Then he gets up, very slowly, and picks up his plane instead.'),
            N('He planes. The log giggles.'),
            LG('Stop it! You’re tickling!'),
            N('Master Cherry falls flat like a sack of meal. His red nose goes quite blue with fright.'),
            N('Somebody knocks, and in comes a little old man in a bright yellow wig.'),
            N('The wig is exactly the colour of polenta, so the boys of the town call him Polendina. He hates it more than anything in the world.'),
            G('Good morning, Master Antonio. What are you doing down there?'),
            MC('Teaching the ants their letters. What brings you, Geppetto?'),
            G('An idea. A wooden puppet that dances and fences and turns somersaults. I’ll take him round the world and earn my crust.'),
            LG('Good idea, Polendina!'),
            N('Geppetto turns the colour of a beetroot, and looks straight at Master Cherry.'),
          ],
          choices: [
            {
              id: 'log',
              label: 'Tell Geppetto it was the log.',
              then: [G('The log. A log called me Polendina. And I suppose the bench calls me Grandad.', 'angry'), N('So that went well.')],
            },
            {
              id: 'out',
              label: 'Keep out of it. It’s their argument.',
              then: [N('You keep out of it. That lasts about a second and a half.')],
            },
          ],
        },
        done: {
          id: 'a13-01-plane-done',
          lines: [
            N('The two old men go at each other like cats on a roof. When they come apart, Geppetto is wearing Master Cherry’s grey wig, and Master Cherry the yellow.'),
            N('They swap back, shake hands, and swear to be friends for the rest of their lives.'),
            N('Master Cherry gives him the log very gladly. It jumps out of his hands and cracks Geppetto on the shins, and they start all over again.'),
            N('In the end, peace. Geppetto puts the log on his shoulder and limps off, and the rain has stopped.'),
          ],
        },
      },
    ],
    complete: {
      id: 'a13-01-complete',
      lines: [
        G('You. The traveller. You’ve no roof, have you? I can always tell. I’ve hardly a roof myself. Come on.'),
        N('His room is under the stairs, lit by one small window. A chair, a poor sort of bed, and a table that has seen better tables.'),
        N('In the back wall there is a fireplace with a fire in it and a pot on top, merrily steaming. It is painted.'),
        G('It’s a very good painting. It keeps me warm, if I don’t think about it.', 'happy'),
        G('You sleep in the corner. I’d offer you supper, but that’s painted too.'),
        N('He hangs his felt cap on the nail by the door. Your Nubbin climbs into it, turns round twice and settles, like a pip in a pod.'),
        G('Ha. It may stay. It’s the warmest thing in the house.', 'happy'),
      ],
    },
    rewards: [],
    sets: { 'a13-01': true },
    notes:
      'OPENING: the page is drawn in brown ink and washes into colour as you step through (two seconds). A1_PAGE is the ' +
      'line of print across the top, voiced as narration: Collodi’s opening joke in our own words (lifted text 1 is ' +
      '[unverified]). The log’s voice is a child’s, and is Pinocchio’s voice later. CLANK (s21Done): play A13_VARIANTS ' +
      'a13-01-page-clank in place of a13-01-page. From then on Clank is drawn in every scene on this page, parked on his ' +
      'folding ramp, which he unfolds at every step and folds again (a small animation, never a puzzle). The felt cap on ' +
      'the nail is your Nubbin’s seat in A13-1 and A13-2.',
  },

  // ---------------------------------------------------------------- A13-2
  {
    id: 'a13-02',
    code: 'A13-2',
    title: 'Geppetto Carves a Puppet',
    source: `${SRC}, ch. III: the carving, the kick, and the carabineer`,
    audience: 'all',
    trigger: { where: WHERE, when: after('A13-1') },
    requires: ['A13-1'],
    speakers: [GEPPETTO, PINOCCHIO, CARABINEER],
    steps: [
      {
        id: 'a13-02-s1',
        goal: 'Hold the lamp while Geppetto carves.',
        hint: 'Stand at his elbow with the lamp. Watch the nose.',
        check: 'watch:a13-geppetto:carving',
        scene: {
          id: 'a13-02-carve',
          lines: [
            N('Geppetto lays the log on his bench, rolls up his sleeves and looks at it for a long time, the way you look at a letter before you open it.'),
            G('What shall I call him? Pinocchio. I knew a whole family of Pinocchios once, and they all did splendidly.'),
            G('The richest of them begged for a living. You see? Lucky.', 'happy'),
            N('A pinocchio is a pine nut. It suits a thing made of pine, with a hard little head on it.'),
            N('He carves the hair, then the forehead, then the eyes. The eyes move, and stare at him.'),
            G('Wooden eyes, why are you looking at me?', 'shock'),
            N('Nobody answers. He carves the nose, and the nose begins to grow.'),
            N('He cuts it shorter, and it grows longer. He cuts it again, and it grows again, until he gives up and leaves it.'),
            N('He carves the mouth. Before he has quite finished, it laughs at him and sticks its tongue out.'),
            G('Stop laughing!', 'angry'),
            N('The mouth stops laughing. It goes on sticking its tongue out.'),
          ],
          choices: [
            {
              id: 'nose',
              label: 'Point out that the nose is growing again.',
              then: [G('I know. I’ve decided not to notice. You should try it.', 'think')],
            },
            {
              id: 'quiet',
              label: 'Keep the lamp steady and say nothing.',
              then: [N('You keep the lamp steady. Geppetto works faster, the way people do when their work is watching them back.')],
            },
          ],
        },
        done: {
          id: 'a13-02-carve-done',
          lines: [
            N('Geppetto carves the hands. The moment they are finished, they snatch the yellow wig off his head and put it on their own.'),
            G('Pinocchio! Give that back this minute!'),
            N('Pinocchio gives it back. His eyes are laughing.'),
          ],
        },
      },
      {
        id: 'a13-02-s2',
        goal: 'Help Geppetto teach the puppet to walk.',
        hint: 'Hold one wooden hand; Geppetto holds the other. Mind the door.',
        check: 'walk:a13-pin:first-steps',
        scene: {
          id: 'a13-02-legs',
          lines: [
            G('You young rascal. You’re not even finished, and already you have no respect for your father.', 'sad'),
            N('He carves the legs and the feet. The first thing the feet do is kick him on the end of the nose.'),
            G('I deserved that. I ought to have thought of it before I made them.', 'think'),
            N('He sets Pinocchio on the floor to teach him to walk. You take one wooden hand, and he takes the other.'),
            N('The legs are stiff, then less stiff. Pinocchio takes one step, and another, and then he is running.'),
            P('Ha! Legs! I’ve got LEGS!', 'happy'),
            N('He is out of the door before either of you can shut it, and away down the street, clack-clack-clack on the cobbles.'),
            G('Catch him! Catch him!'),
            N('People in the street watch him go by, and nobody catches him. They are laughing too hard to catch anything.'),
          ],
        },
        done: {
          id: 'a13-02-street',
          lines: [
            N('At the bottom of the street a carabineer steps out and catches Pinocchio neatly by the nose. It is a very convenient nose for it.'),
            N('Geppetto arrives out of breath and gives him a good shake. Pinocchio throws himself on the cobbles and refuses to walk another step.'),
            N('A crowd gathers. The crowd decides, as crowds do, that the poor little puppet is frightened of the dreadful old man.'),
            CB('Well. If that’s how he treats them, he can come along with me.'),
          ],
        },
      },
    ],
    complete: {
      id: 'a13-02-complete',
      lines: [
        N('So it is Geppetto who is marched off to prison, crying all the way.'),
        G('Wretched boy! I worked so hard to make him a good puppet. It serves me right. I should have thought.', 'sad'),
        N('Your Nubbin, still in the felt cap he snatched up as he ran, jumps out as he goes. The carabineer walks him round the corner, and the street is empty.'),
        N('Pinocchio picks himself up, brushes off his knees and runs home over the fields, as fast as a hare with somewhere to be.'),
        N('You follow. The room under the stairs is very quiet without the old man in it.'),
      ],
    },
    rewards: [],
    sets: { 'a13-02': true },
    notes:
      'The nose grows as Geppetto carves (Collodi), before any lie: it is not yet the lying nose, only a stubborn one. ' +
      'The kick is comic, one line, no injury shown. The carabineer marches Geppetto off; the prison is never shown. ' +
      'Your Nubbin leaves the cap here and gets back into it in A13-19.',
  },

  // ---------------------------------------------------------------- A13-3
  {
    id: 'a13-03',
    code: 'A13-3',
    title: 'The Talking-cricket',
    source: `${SRC}, ch. IV: the Talking-cricket and the mallet`,
    audience: 'all',
    trigger: { where: WHERE, when: after('A13-2') },
    requires: ['A13-2'],
    speakers: [PINOCCHIO, CRICKET],
    steps: [
      {
        id: 'a13-03-s1',
        goal: 'Find what is going cri-cri-cri in the dark.',
        hint: 'Listen along the wall by the hearth.',
        check: 'find:a13-cricket:wall',
        scene: {
          id: 'a13-03-cri',
          lines: [
            N('Pinocchio bangs the door shut, sits on the floor and lets out a great sigh. A whole room, and nobody in it to tell him anything.'),
            P('Mine. All of it. The chair, the table, the painted fire. You can stay too, if you don’t tell me anything.', 'happy'),
            N('Then, from somewhere in the room, a small sound: cri-cri-cri.'),
            P('Who’s that?', 'shock'),
            N('Cri-cri-cri, from the wall by the hearth. Your Nubbin’s ears go straight up.'),
            P('It’s you, isn’t it? Doing a voice. Stop doing a voice.'),
          ],
        },
        done: {
          id: 'a13-03-cri-done',
          lines: [
            N('There on the wall, climbing slowly upwards, is a big cricket. He has the air of somebody who has paid the rent.'),
            CR('It is I. The Talking-cricket. I have lived in this room for more than a hundred years.'),
          ],
        },
      },
      {
        id: 'a13-03-s2',
        goal: 'Listen to the Talking-cricket. Then decide what to do about the hearth.',
        hint: 'Hear him out. When it goes quiet, you’ll know what you can do.',
        check: 'choose:a13-cricket:hearth',
        scene: {
          id: 'a13-03-cricket',
          lines: [
            P('Well, it’s my room now. Off you go. And don’t look back.'),
            CR('I shan’t go until I have told you one great truth.', 'think'),
            CR('Boys who turn their backs on their fathers, and run off from home to please themselves, come to no good. Sooner or later. Usually sooner.'),
            P('Sing away, Cricket. I’m off at first light. If I stay, they’ll send me to school, and I’d rather chase butterflies.'),
            CR('Then you’ll grow up a perfect donkey, and everyone will laugh at you.'),
            CR('At least learn a trade. Something to earn an honest crust.'),
            P('There’s only one trade I fancy. Eating, drinking, sleeping, having fun, and wandering about from morning till night.', 'happy'),
            CR('Everyone who follows that trade ends up in hospital or in prison. I am sorry for you, Pinocchio.', 'sad'),
            P('Sorry? Why?'),
            CR('Because you are a puppet. And, worse, because you have a wooden head.'),
            N('Pinocchio grabs the mallet off the bench and throws it, not really aiming. That is the trouble with not really aiming.'),
            N('It catches the cricket and knocks him clean off the wall, down into the cold ash of the hearth. Then nothing.'),
            P('I didn’t… He shouldn’t have said wooden head. He shouldn’t have.', 'shock'),
          ],
          choices: [
            {
              id: 'search',
              label: 'Search the hearth.',
              set: { 'a13-cricket': 'carried' },
              then: [
                N('You kneel at the hearth and sift the ash with your fingers. Your Nubbin finds him first, and squeaks.'),
                N('He is on his back, grey with ash, one leg going round and round like a little wheel. He is very much alive, and very cross.'),
                CR('I am not hurt. I am insulted. There is a difference, and I am a hundred years old, and I know it.', 'angry'),
                N('You carry him out in your cupped hands to the hedge by the door, and set him on a leaf. He straightens his feelers with great dignity.'),
                CR('Thank you. Tell him nothing. He wouldn’t listen. He never listens.'),
              ],
            },
            {
              id: 'leave',
              label: 'Leave it. It’s his mess to put right.',
              set: { 'a13-cricket': 'left' },
              then: [
                N('You leave it. Pinocchio looks at the hearth for a long time, and then turns his back on it.'),
                N('Later, when he isn’t looking, you look. There is a tiny track through the ash, all the way to the crack under the door.'),
                N('Whatever made it was walking. Slowly, and in a temper, but walking.'),
              ],
            },
          ],
        },
        done: {
          id: 'a13-03-cricket-done',
          lines: [
            N('The room is quiet. Pinocchio sits at the table with his chin on his fists and says nothing for a long time, which for him is a minute.'),
            P('Anyway. I’m hungry.'),
          ],
        },
      },
    ],
    complete: {
      id: 'a13-03-complete',
      lines: [
        N('Night comes on, and with it a hunger like a small dog barking inside him.'),
        P('Do you think the cricket was right? No. Don’t answer. I’m too hungry for answers.'),
        N('You don’t answer, and your Nubbin curls up against your boot. Outside, the wind is getting up.'),
        P('Is there any supper? There’s always supper. Somewhere.'),
      ],
    },
    rewards: [],
    sets: { 'a13-03': true },
    notes:
      'SIGNATURE CHOICE (a13-cricket = carried | left). Pays off in A13-10 (he nods to you), A13-18 (Pinocchio admits ' +
      'the cricket was right) and A13-20 (“And thank your friend for the hedge”). CARE: the cricket is knocked off the ' +
      'wall, never killed. Both routes say he is alive: dazed and cross in the ash (search), or a walking track to the ' +
      'door (leave). No still body is ever drawn; the hearth is in shadow and the mallet hit is a thump and a puff of ' +
      'ash. Lifted text 2 (the warning) is [unverified] and told in our own words at a13-03-cricket#2.',
  },

  // ---------------------------------------------------------------- A13-4
  {
    id: 'a13-04',
    code: 'A13-4',
    title: 'The Flying Egg',
    source: `${SRC}, ch. V–VI: the egg, the storm, and the brazier`,
    audience: 'all',
    trigger: { where: WHERE, when: after('A13-3') },
    requires: ['A13-3'],
    speakers: [PINOCCHIO, CHICK, NIGHTCAP, GEPPETTO],
    steps: [
      {
        id: 'a13-04-s1',
        goal: 'Help Pinocchio look for something to eat.',
        hint: 'Try the cupboard, the drawers, and the heap of sweepings in the corner.',
        check: 'find:a13-egg:rubbish',
        scene: {
          id: 'a13-04-hungry',
          lines: [
            N('Pinocchio runs to the fire to lift the lid off the pot. His nose goes straight through the canvas, where the pot is painted on it.'),
            P('Painted. Even the soup’s painted. What kind of house is this?', 'sad'),
            N('He tries the drawers: a button, a cork, a bent nail. He tries the cupboard: dust, and a smell of dust.'),
            N('He would eat anything now: a cherry stone, a fish bone, the crust off a crust.'),
            P('The cricket said this would happen. Not this exactly. He didn’t mention soup.'),
            N('Your Nubbin goes to the heap of sweepings in the corner and begins to dig, as if it has an idea.'),
          ],
          choices: [
            {
              id: 'dig',
              label: 'Dig with your Nubbin.',
              then: [N('You dig too. It isn’t dignified, but it’s company.')],
            },
            {
              id: 'cheer',
              label: 'Tell Pinocchio there’s sure to be something.',
              then: [P('There’d better be. I’m wooden all the way through, and all of it is empty.', 'sad')],
            },
          ],
        },
        done: {
          id: 'a13-04-hungry-done',
          lines: [
            N('In the sweepings there is something round and white. An egg!'),
            P('An egg! A whole egg! I’ll fry it. No, I’ll poach it. No, I can’t wait to decide. I’ll fry it.', 'happy'),
          ],
        },
      },
      {
        id: 'a13-04-s2',
        goal: 'Watch Pinocchio cook his egg.',
        hint: 'Stand back from the pan. Something is about to happen to it.',
        check: 'watch:a13-egg:pan',
        scene: {
          id: 'a13-04-egg',
          lines: [
            N('He sets a little pan on the brazier, with a drop of water in it for want of oil. The water begins to steam.'),
            N('He cracks the egg over the pan. Out of it, instead of a yolk, comes a small, fluffy and extremely polite chick.'),
            CH('Many thanks, Master Pinocchio, for saving me the trouble of breaking the shell.', 'happy'),
            CH('Good evening. Kind regards to all at home.'),
            N('It flies out of the open window and away into the dark.'),
            N('Pinocchio stands with the empty shell in his hands and his mouth wide open.'),
            P('The cricket was right. The cricket was RIGHT. I wish I’d never run off. Babbo would have fed me.', 'sad'),
          ],
        },
        done: {
          id: 'a13-04-egg-done',
          lines: [
            N('Outside, the wind has turned into a storm. Pinocchio puts his cap on.'),
            P('There’s a village. Somebody in it will give me bread. I’ll ask nicely. I can ask nicely.'),
          ],
        },
      },
      {
        id: 'a13-04-s3',
        goal: 'Go with Pinocchio into the storm, to the village.',
        hint: 'Keep your Nubbin under your coat. It’s a long way for very little.',
        check: 'walk:a13-village:storm',
        scene: {
          id: 'a13-04-storm',
          lines: [
            N('The night is black, with thunder rolling over the hills and lightning that turns the road white. The village is shut up tight.'),
            N('Every shutter is closed, and there isn’t even a dog in the street. It is like a village put away in a drawer for the night.'),
            N('Pinocchio finds a doorbell and pulls it, and pulls it again, and goes on pulling it.'),
            NC('What do you want at this hour?', 'angry'),
            N('An old man in a nightcap has put his head out of the window above.'),
            P('Will you be kind enough to give me a bit of bread?'),
            NC('Wait there. I’ll be straight down.'),
            N('He isn’t straight down. He comes back to the window with a basin, and empties the whole of it over Pinocchio’s head.'),
          ],
        },
        done: {
          id: 'a13-04-storm-done',
          lines: [
            N('You walk back together through the rain, Pinocchio dripping and you dripping. Your Nubbin, under your coat, is the only dry thing in the world.'),
            N('At home he puts his wet feet up on the brazier to dry, and falls asleep in the chair. You sleep in the corner.'),
          ],
        },
      },
    ],
    complete: {
      id: 'a13-04-complete',
      lines: [
        N('In the morning there is a knock at the door. Pinocchio wakes up, yawning.'),
        G('Pinocchio! It’s me. Open the door.'),
        P('Babbo!', 'happy'),
        N('He jumps up to run to the door, and falls flat on his face.'),
        N('In the night his feet have burned away on the brazier, right down to two black stumps. He didn’t feel a thing; he’s wood.'),
        N('Which is a mercy, and also the whole problem.'),
      ],
    },
    rewards: [],
    sets: { 'a13-04': true },
    notes:
      'The chick is a comic beat: it bows in the air before it goes. The storm is noise and light, never danger. The ' +
      'burnt feet are charcoal stumps with no pain (he is wood); draw them as two scorched blocks, played for comedy, and ' +
      'keep the brazier glow low and cosy.',
  },

  // ---------------------------------------------------------------- A13-5
  {
    id: 'a13-05',
    code: 'A13-5',
    title: 'Three Pears',
    source: `${SRC}, ch. VII–VIII: the three pears, the new feet, and the coat`,
    audience: 'all',
    trigger: { where: WHERE, when: after('A13-4') },
    requires: ['A13-4'],
    speakers: [PINOCCHIO, GEPPETTO, CLANK],
    steps: [
      {
        id: 'a13-05-s1',
        goal: 'Let Geppetto in.',
        hint: 'Pinocchio can’t reach the door now. The window is open; give Geppetto a hand over the sill.',
        check: 'climb:a13-window:geppetto',
        scene: {
          id: 'a13-05-window',
          lines: [
            P('Babbo, I can’t open the door! My feet have gone!', 'sad'),
            G('Gone? Gone where? Open this door at once.'),
            P('I can’t stand up! I’ll have to walk on my knees for the rest of my life!'),
            N('Geppetto thinks this is another trick, so he climbs in through the window. He tries to; he is not a young man, and it is not a large window.'),
            N('You lean out and take his arm, and he comes over the sill like a sack of meal.'),
            G('Now, you young— Oh. Oh, my boy. Your feet.', 'shock'),
            N('He came in meaning to give Pinocchio the scolding of his life. He looks at the feet, and gathers him up instead, and kisses him.'),
          ],
        },
        done: {
          id: 'a13-05-window-done',
          lines: [
            P('I’m so hungry, Babbo. I’ve had nothing but a chick, and the chick left.', 'sad'),
            N('Geppetto takes three pears out of his pocket: his breakfast. He holds them out and says nothing about it.'),
          ],
        },
      },
      {
        id: 'a13-05-s2',
        goal: 'Help with breakfast: three pears, peeled.',
        hint: 'Pinocchio wants them peeled. Don’t throw the peel away. You’ll see.',
        check: 'feed:a13-pin:pears',
        scene: {
          id: 'a13-05-pears',
          lines: [
            P('Peel them for me, please. I can’t eat skins. I’m very particular.'),
            G('Particular. At your age. With your feet in the fire. Well, well.', 'think'),
            N('He peels them anyway, and lays the peel and the cores in a corner of the table.'),
            N('Pinocchio eats the first pear in two bites and throws the core away. Then the second, then the third.'),
            P('I’m still hungry.', 'sad'),
            G('Well, I’ve nothing else. Except the peel and the cores.'),
            P('I don’t eat peel. I don’t eat cores.'),
            N('He looks at them for quite a long while.'),
          ],
          choices: [
            {
              id: 'ask',
              label: 'Ask Geppetto whether he has eaten.',
              then: [G('Me? Oh, yes. Ages ago. Hours.', 'happy'), N('His stomach rumbles, loudly. He talks over it.')],
            },
            {
              id: 'save',
              label: 'Put the peel and cores on a plate, for later.',
              then: [N('You put them on a plate. Pinocchio says he won’t, and you say nothing, and the plate waits.')],
            },
          ],
        },
        done: {
          id: 'a13-05-pears-done',
          lines: [
            N('A minute later the peel is gone, and the cores after it. Pinocchio pats his front.'),
            P('I feel very well now.', 'happy'),
            G('You see? It doesn’t pay to be too fussy, my boy. You never know what’s coming.'),
          ],
        },
      },
      {
        id: 'a13-05-s3',
        goal: 'Wait at the window while Geppetto goes out into the snow.',
        hint: 'Keep the room warm for him. Watch the road.',
        check: 'wait:a13-geppetto:snow',
        scene: {
          id: 'a13-05-snow',
          lines: [
            N('Pinocchio cries for new feet until Geppetto gives in. They take an hour, and they are the best feet he has ever made.'),
            N('From the offcut, while the glue dries, he starts a little wooden Nubbin for you. He gets as far as the ears.'),
            G('I’ll finish it tomorrow. There’s always tomorrow for the small things.', 'happy'),
            P('Babbo, I’ll go to school! I’ll learn a trade, and I’ll look after you when you’re old.', 'happy'),
            N('Geppetto makes him a suit out of flowered paper, a pair of shoes out of bark, and a cap out of the soft middle of a loaf.'),
            N('Pinocchio admires himself in a basin of water. He looks, he says, exactly like a gentleman.'),
            P('But I haven’t got a spelling-book. You can’t go to school without a spelling-book.'),
            G('No. You can’t.', 'think'),
            N('Geppetto has no money at all. He puts on his old coat, all patches and darns, and goes out, and it is snowing.'),
          ],
        },
        done: {
          id: 'a13-05-coat',
          lines: [...A5_COAT],
        },
      },
    ],
    complete: {
      id: 'a13-05-complete',
      lines: [
        N('Next morning the snow has stopped. Pinocchio sets off for school with his book under his arm, talking all the way.'),
        P('Today I learn to read. Tomorrow, to write. The day after, sums.', 'happy'),
        P('Then I’ll earn lots of money, and buy Babbo a new coat. A gold one. With diamonds for buttons.'),
        N('Geppetto watches him go from the doorway, in his shirt-sleeves, and doesn’t feel the cold at all. Or says he doesn’t.'),
        N('The half-carved Nubbin sits on the bench, ears and nothing else, waiting for tomorrow.'),
      ],
    },
    rewards: [],
    sets: { 'a13-05': true },
    notes:
      'The heart of the page: Geppetto sells his only coat for the book on the second day, before the puppet has done a ' +
      'single useful thing. “It was too warm” comes back in A13-20, when Pinocchio gives away his own coat money. ' +
      'CLANK (s21Done): play A13_VARIANTS a13-05-coat-clank in place of the step 3 done a13-05-coat. The half-carved ' +
      'wooden Nubbin (ears only) stays on Geppetto’s bench in every later scene in this room, and comes home with the ' +
      'bench in A13-20 (reward). Collodi’s line about clean clothes is not used.',
  },

  // ---------------------------------------------------------------- A13-6
  {
    id: 'a13-06',
    code: 'A13-6',
    title: 'The Puppet Show',
    source: `${SRC}, ch. IX–X: the spelling-book sold, and the Great Puppet Theatre`,
    audience: 'all',
    trigger: { where: WHERE, when: after('A13-5') },
    requires: ['A13-5'],
    speakers: [PINOCCHIO, HARLEQUIN, PUNCH, FIRE],
    steps: [
      {
        id: 'a13-06-s1',
        goal: 'Walk Pinocchio to school.',
        hint: 'Keep to the road. Something down by the sea is making a lot of noise.',
        check: 'walk:a13-pin:school-road',
        scene: {
          id: 'a13-06-road',
          lines: [
            N('Halfway to school there is music: fifes, and a big drum going boom, boom, from down towards the sea.'),
            P('Do you hear that? Fifes. And a drum.', 'happy'),
            P('School will be there tomorrow. School is always there. That’s the whole point of school.'),
            N('He stands in the middle of the road, one foot pointing to school and one foot pointing to the music.'),
            P('Today, the music. Tomorrow, school. School can’t run away.'),
            N('At the bottom of the hill there is a great painted tent with flags on it. The poster says THE GREAT PUPPET THEATRE.'),
          ],
          choices: [
            {
              id: 'coat',
              label: 'Remind him what the spelling-book cost.',
              then: [P('I know what it cost! I’ll go tomorrow. I’ll go twice tomorrow.', 'angry'), N('He doesn’t look at you while he says it.')],
            },
            {
              id: 'let',
              label: 'Say nothing. It’s his road.',
              then: [N('You say nothing. He looks at you, as if he’d been hoping you would.')],
            },
          ],
        },
        done: {
          id: 'a13-06-road-done',
          lines: [
            N('A ticket costs four pennies, and Pinocchio hasn’t got four pennies. He has a spelling-book.'),
            N('He sells it to a man who deals in old clothes, for four pennies exactly, before you can catch his arm.'),
          ],
        },
      },
      {
        id: 'a13-06-s2',
        goal: 'Get into the puppet theatre.',
        hint: 'You have no ticket. Your Nubbin knows a gap under the canvas.',
        check: 'explore:a13-theatre:canvas',
        scene: {
          id: 'a13-06-show',
          lines: [
            N('You crawl in under the canvas behind your Nubbin, and find a place at the back among the boots.'),
            N('The curtain is up. On the stage Harlequin and Punchinello are quarrelling, as they always do, and about to hit each other with a stick.'),
            N('The audience is laughing so much it hurts. Then Harlequin stops, and points out over everybody’s heads.'),
            HQ('Look! Look there! Is it? It IS!', 'shock'),
            PU('Our brother! It’s our brother Pinocchio!', 'happy'),
            N('Every puppet on the stage runs to the front. Pinocchio jumps from the cheap seats to the band, and from the band onto the stage.'),
            N('Such hugging, such kissing, such friendly punches on the nose!'),
            N('The audience shouts for the show; they have paid. The puppets don’t care: they have a brother back.'),
          ],
        },
        done: {
          id: 'a13-06-show-done',
          lines: [
            N('Then the showman comes out. He is a giant of a man, with a black beard that reaches the floor, so that he treads on it when he walks.'),
            N('His mouth is as wide as an oven, and his eyes are like two red lanterns. He cracks a long whip, and every puppet goes still.'),
            FE('What is all this? Who is that?', 'angry'),
          ],
        },
      },
    ],
    complete: {
      id: 'a13-06-complete',
      lines: [
        N('Nobody answers. Even the drum has stopped.'),
        FE('We’ll see about him after the show. Hang him on the nail.'),
        N('Pinocchio is hung by the back of his paper jacket on a nail in the wings, among the other puppets, kicking his bark heels.'),
        N('The showman is called Fire-eater. You hope it is only a name.'),
      ],
    },
    rewards: [],
    sets: { 'a13-06': true },
    notes:
      'Harlequin and Punchinello are the old commedia masks (the Learning Grove version teaches them); draw them as ' +
      'Collodi’s puppets, original designs. The whip only cracks in the air. Pinocchio on the nail is hung by his ' +
      'jacket, not his neck.',
  },

  // ---------------------------------------------------------------- A13-7
  {
    id: 'a13-07',
    code: 'A13-7',
    title: 'Fire-eater Sneezes',
    source: `${SRC}, ch. XI–XII: Fire-eater sneezes, and gives five gold pieces`,
    audience: 'all',
    trigger: { where: WHERE, when: after('A13-6') },
    requires: ['A13-6'],
    speakers: [FIRE, HARLEQUIN, PINOCCHIO],
    steps: [
      {
        id: 'a13-07-s1',
        goal: 'Follow the puppets to Fire-eater’s kitchen.',
        hint: 'Keep behind Harlequin. Fire-eater doesn’t look down much.',
        check: 'visit:a13-fireeater:kitchen',
        scene: {
          id: 'a13-07-kitchen',
          lines: [
            N('After the show Fire-eater sits down to his supper. A whole sheep is turning on a spit before the fire, and the fire is getting low.'),
            FE('Wood. Not enough wood. Bring me that new puppet. He’s good dry pine; he’ll burn beautifully.'),
            N('Harlequin and Punchinello look at each other. Then they go, because when Fire-eater says go, everybody goes.'),
            N('They come back with Pinocchio between them, wriggling like an eel.'),
            P('Babbo! Babbo, save me! I don’t want to burn!', 'shock'),
            N('Fire-eater looks terrible. But he isn’t so very wicked underneath, if you can find underneath.'),
            N('He goes pale, his nose twitches and his eyes water. He holds it, and holds it, and then he sneezes.'),
            HQ('Good news, brother. When he sneezes, it means he’s sorry for you. You’re saved.', 'happy'),
          ],
          choices: [
            {
              id: 'speak',
              label: 'Step forward and speak up for Pinocchio.',
              then: [
                FE('And who are you? A traveller? Sit down, traveller. You’re in my light.'),
                N('You sit. But he looks at you twice after that.'),
              ],
            },
            {
              id: 'hold',
              label: 'Hold your Nubbin tight and keep still.',
              then: [N('You keep still. Your Nubbin, held tight, watches the whip the way you’d watch a wasp.')],
            },
          ],
        },
        done: {
          id: 'a13-07-kitchen-done',
          lines: [
            FE('Very well. I won’t burn you. But my mutton must be cooked.', 'think'),
            FE('Bring me Harlequin. He’s good dry wood too.'),
          ],
        },
      },
      {
        id: 'a13-07-s2',
        goal: 'Stay close while Pinocchio pleads for Harlequin.',
        hint: 'Stand near. This bit is his.',
        check: 'watch:a13-pin:pleading',
        scene: {
          id: 'a13-07-harlequin',
          lines: [
            N('Two wooden guards fetch Harlequin. He is so frightened that his legs have folded up under him like a camp stool.'),
            P('Have pity, Mister Fire-eater!', 'sad'),
            FE('There are no misters here.'),
            P('Have pity, Sir!'),
            FE('No sirs, either.'),
            P('Have pity, Your Excellency!'),
            N('Fire-eater sits up a little straighter. He likes Your Excellency very much.'),
            FE('Well? What do you want?'),
            P('If you have to burn somebody, burn me. It isn’t right that Harlequin should burn because of me.'),
            N('He takes off his breadcrumb cap and holds it to his chest. He means it.'),
            N('Fire-eater’s nose twitches. He sneezes, and sneezes again, and goes on sneezing until the pots rattle on the shelf.'),
          ],
        },
        done: {
          id: 'a13-07-harlequin-done',
          lines: [
            FE('Oh, very well! Nobody burns tonight. I shall eat my mutton half-raw.', 'sad'),
            FE('But next time, woe betide! Atchoo!'),
            N('The puppets dance till dawn, and so do you. Your Nubbin dances along Fire-eater’s beard, and he doesn’t even notice.'),
          ],
        },
      },
    ],
    complete: {
      id: 'a13-07-complete',
      lines: [
        N('In the morning Fire-eater calls Pinocchio over and asks him about his father.'),
        P('He’s very poor. He sold his coat to buy me a spelling-book. And I sold the book.', 'sad'),
        N('Fire-eater sneezes again. He counts five gold pieces out of his purse into Pinocchio’s hand.'),
        FE('Take these to your father, with my respects. Tell him to buy a coat.', 'soft'),
        N('Pinocchio thanks him a thousand times, hugs every puppet in the company twice, and sets off for home with the gold in his fist.'),
      ],
    },
    rewards: [],
    sets: { 'a13-07': true },
    notes:
      'Collodi’s sneeze is the joke and the heart: Fire-eater sneezes when he is moved. Nobody is put near the fire on ' +
      'screen; the threat is words. Pinocchio offering himself for Harlequin is his first unselfish act. Keep it plain.',
  },

  // ---------------------------------------------------------------- A13-8
  {
    id: 'a13-08',
    code: 'A13-8',
    title: 'The Fox and the Cat',
    source: `${SRC}, ch. XII–XIV: the Fox and the Cat, and the Inn of the Red Craw-fish`,
    audience: 'all',
    trigger: { where: WHERE, when: after('A13-7') },
    requires: ['A13-7'],
    speakers: [FOX, CAT, PINOCCHIO, INNKEEPER],
    steps: [
      {
        id: 'a13-08-s1',
        goal: 'Walk home with Pinocchio and his five gold pieces.',
        hint: 'Keep to the road home. Watch who you meet on it.',
        check: 'talk:a13-fox:road',
        scene: {
          id: 'a13-08-road',
          lines: [
            N('Half a mile along the road you meet a Fox who is lame in one leg, and a Cat who is blind in both eyes. They lean on each other as they go.'),
            FX('Good day, Pinocchio.', 'happy'),
            P('How do you know my name?'),
            FX('I know your father well. I saw him yesterday at his door, in his shirt-sleeves, shivering.', 'sad'),
            P('Poor Babbo. But he won’t shiver any more. Look. Five gold pieces. I’m going to buy him a coat.', 'happy'),
            N('He holds them up. They catch the sun.'),
            N('The Fox, without meaning to, stretches out the leg that is lame. The Cat opens two great green eyes, and shuts them again at once.'),
            N('Nobody sees it but you.'),
          ],
          choices: [
            {
              id: 'warn',
              label: 'Warn him. The Cat opened its eyes.',
              then: [
                P('Shame on you. He’s blind. Poor animals get blamed for everything.', 'angry'),
                CT('We forgive you, traveller. We forgive everybody. It’s our only luxury.'),
              ],
            },
            {
              id: 'quiet',
              label: 'Say nothing yet, and watch the Fox.',
              then: [N('You say nothing. The Fox catches you watching, and smiles at you very warmly, with all his teeth.')],
            },
          ],
        },
        done: {
          id: 'a13-08-road-done',
          lines: [
            FX('Five gold pieces. Is that all? Would you like to make them a thousand?'),
            FX('Just outside the town of Catchfools there is a field, the Field of Miracles. Plant a gold coin there, and it grows a tree hung with gold.'),
            N('On the hedge a white blackbird calls out to Pinocchio not to listen. The Cat springs at it, and it gets away in a burst of feathers.'),
            CT('Only stretching. My legs. Being blind is very stiff work.'),
          ],
        },
      },
      {
        id: 'a13-08-s2',
        goal: 'Stop for supper at the Inn of the Red Craw-fish.',
        hint: 'Pinocchio is paying. He doesn’t know that yet.',
        check: 'visit:a13-inn:red-crawfish',
        scene: {
          id: 'a13-08-inn',
          lines: [
            N('By evening you reach the Inn of the Red Craw-fish and sit down to supper, because the Fox says no great venture was ever begun hungry.'),
            N('The Cat orders thirty-five red mullet in tomato sauce and four helpings of tripe with cheese. He says he isn’t very hungry.'),
            N('The Fox would like something light: a hare in sauce, six chickens and a few young partridges. His doctor insists.'),
            N('Pinocchio, too excited to eat, has a walnut and a heel of bread, and leaves half the bread.'),
            P('Tonight a seed. Tomorrow a tree. Babbo will have a coat on every branch.', 'happy'),
            N('Then you all go up to bed. Pinocchio dreams out loud of gold coins clinking on branches, like little bells.'),
          ],
          choices: [
            {
              id: 'bill',
              label: 'Ask who is paying for all this.',
              then: [
                FX('Paying? Among friends? My dear fellow, what a question.', 'happy'),
                N('He changes the subject to the weather, which he says looks golden.'),
              ],
            },
            {
              id: 'pocket',
              label: 'Wrap Pinocchio’s leftover bread for his pocket.',
              then: [N('You wrap the heel of bread in a cloth and tuck it in his pocket. He won’t thank you for it tonight.')],
            },
          ],
        },
        done: {
          id: 'a13-08-inn-done',
          lines: [
            N('At midnight the innkeeper knocks: your friends have gone ahead. The Cat’s eldest kitten has chilblains, he says, and they had to hurry.'),
            IK('They said you’d settle the bill. One gold piece, and a bargain at that.'),
            N('Pinocchio pays it without a word, and has four gold pieces left. He sets off alone into the dark, and you go after him.'),
          ],
        },
      },
    ],
    complete: {
      id: 'a13-08-complete',
      lines: [
        N('The night is so dark you can’t see your own hand. Something rustles in the hedge beside the road.'),
        N('Very faintly, from somewhere low in the leaves, comes a small sound: cri.'),
        P('Not you. You’re… Not you. I’m not listening.', 'shock'),
        N('He walks faster. You look back once, and there is nothing in the hedge but dark.'),
      ],
    },
    rewards: [],
    sets: { 'a13-08': true },
    notes:
      'You can warn him; he goes anyway (the outline’s point). CARE: Collodi’s Cat eats the white blackbird; here it ' +
      'gets away. Collodi’s ghost of the Talking-cricket becomes one faint “cri” in a hedge, so the cricket is never ' +
      'shown dead or as a ghost. Whether it is him is left open until A13-10. Do not light the hedge.',
  },

  // ---------------------------------------------------------------- A13-9
  {
    id: 'a13-09',
    code: 'A13-9',
    title: 'The Assassins',
    source: `${SRC}, ch. XIV–XV: the assassins, the white house, and the Big Oak`,
    audience: 'all',
    trigger: { where: WHERE, when: after('A13-8') },
    requires: ['A13-8'],
    speakers: [PINOCCHIO, SACK_TALL, SACK_SHORT, FAIRY],
    steps: [
      {
        id: 'a13-09-s1',
        goal: 'Keep close to Pinocchio on the dark road.',
        hint: 'Stay on the road. Whatever is behind you is quicker than it looks.',
        check: 'walk:a13-road:night',
        scene: {
          id: 'a13-09-sacks',
          lines: [
            N('Behind you, the leaves rustle. Two black shapes are following, wrapped in charcoal sacks, hopping along on tiptoe like ghosts.'),
            P('Here they come. Robbers. Assassins!', 'shock'),
            N('He pops the four gold pieces into his mouth, under his tongue, quick as a squirrel.'),
            ST('Your money or your life!'),
            N('Pinocchio can’t say a word, because of the money. He makes a face instead, which isn’t an answer.'),
            SS('Your money, or you’ll be sorry. And your father too!'),
            N('One of them sounds very like a Fox with a cold. The other sounds like a Cat trying hard to sound like nobody.'),
          ],
          choices: [
            {
              id: 'stick',
              label: 'Grab a stick and stand with him.',
              then: [
                N('You grab a stick. The taller sack takes it off you, quite politely, and puts you in the ditch.'),
                N('The ditch is full of nettles. Your Nubbin comes in after you, to keep you company.'),
              ],
            },
            {
              id: 'shout',
              label: 'Pick up your Nubbin and shout for help.',
              then: [N('You shout until the hills shout back, and nobody comes. On this road, at this hour, nobody ever does.')],
            },
          ],
        },
        done: {
          id: 'a13-09-sacks-done',
          lines: [
            N('The shorter sack takes Pinocchio by the jaw, to get his mouth open. Pinocchio bites down hard, and spits out what he bit.'),
            N('It isn’t a hand. It’s a cat’s paw.'),
            N('While they are both staring at that, he is over the hedge and running.'),
          ],
        },
      },
      {
        id: 'a13-09-s2',
        goal: 'Run after Pinocchio across the fields.',
        hint: 'Follow the clack of his feet. Jump the ditch; don’t land in it.',
        check: 'race:a13-assassins:white-house',
        scene: {
          id: 'a13-09-chase',
          lines: [
            N('He runs across the fields and you run after him, and the two sacks run after you both.'),
            N('There is a ditch full of muddy water. Pinocchio jumps it, you jump it, and the sacks jump it too, and land in the middle.'),
            N('They climb out dripping, and keep coming.'),
            N('Far off among the trees there is a little house as white as snow. Pinocchio runs to its door and hammers on it.'),
            P('Help! Open up! Please!'),
            N('A window opens, and in it is a girl with blue hair and a face as white as wax. Her eyes are shut, and her hands are folded.'),
            FY('There is nobody in this house. Everybody has gone away.', 'soft'),
            P('Then you open the door!'),
            FY('I am going away too. I am only waiting.', 'soft'),
            N('The window closes, without a sound.'),
          ],
        },
        done: {
          id: 'a13-09-chase-done',
          lines: [
            N('The sacks catch him at the door. They shake him, and shake him, and the gold won’t come out.'),
            N('So they tie him by the collar of his paper jacket to a branch of the Big Oak, and leave him swinging there.'),
            ST('We’ll be back in the morning. Perhaps you’ll feel like opening your mouth by then.'),
          ],
        },
      },
    ],
    complete: {
      id: 'a13-09-complete',
      lines: [
        N('You can’t reach the branch. You try from your own shoulders, and from a stone, and with your Nubbin standing on your head.'),
        N('The north wind gets up and swings him to and fro, like the clapper of a bell with no bell round it.'),
        P('Oh, Babbo. If you were here.', 'sad'),
        N('He stops kicking. He shuts his eyes, and goes very still, the way wood goes.'),
        N('Behind you, the window of the white house opens again.'),
      ],
    },
    rewards: [],
    sets: { 'a13-09': true },
    notes:
      'race:a13-assassins:white-house is a short chase that cannot be lost (the sacks always fall in the ditch, and ' +
      'always catch him at the door). CARE: the hanging becomes being tied by the collar of his jacket; he dangles by ' +
      'the back of it, arms out, like a coat on a peg, never by the neck. The girl at the window is “going away”, not ' +
      'dead; draw her pale and still, but plainly a living girl at a window. The paw is one quick beat, no blood: a ' +
      'cartoon paw, dropped in the road. He goes still because he is exhausted; A13-10 opens with his rescue.',
  },

  // ---------------------------------------------------------------- A13-10
  {
    id: 'a13-10',
    code: 'A13-10',
    title: 'The Big Oak',
    source: `${SRC}, ch. XV–XVI: the Fairy with blue hair, and the three doctors`,
    audience: 'all',
    trigger: { where: WHERE, when: after('A13-9') },
    requires: ['A13-9'],
    speakers: [FAIRY, MEDORO, CROW, OWL, CRICKET, PINOCCHIO],
    steps: [
      {
        id: 'a13-10-s1',
        goal: 'Watch the Fairy’s falcon cut Pinocchio down.',
        hint: 'Stand under the oak. Be ready to catch.',
        check: 'watch:a13-falcon:oak',
        scene: {
          id: 'a13-10-falcon',
          lines: [
            N('The girl at the window is not just a girl. She is a Fairy, who has lived at the edge of this wood for more than a thousand years.'),
            N('She claps her hands three times. A great Falcon comes down out of the dark and lands on the sill.'),
            FY('Do you see that puppet on the Big Oak? Cut the knot with your beak, and let him down gently.'),
            N('The Falcon goes, and the knot gives. You are under the branch, and you catch Pinocchio, and he is as light as a stick of kindling.'),
            FY('Thank you. Bring him in. Medoro! The coach!'),
            N('A poodle comes out of the house on his hind legs, in a coachman’s coat with gold buttons and a wig of white curls.'),
            N('Behind him comes a little coach the colour of the air, lined with canary feathers and drawn by a hundred pairs of white mice.'),
            MD('Madam. Traveller. Patient. Mind the custard; it’s for the journey.'),
          ],
          choices: [
            {
              id: 'who',
              label: 'Ask the Fairy who she is.',
              then: [FY('Someone who lives here, and has been waiting for somebody to knock. Bring him in.', 'soft')],
            },
            {
              id: 'lift',
              label: 'Lift Pinocchio into the coach yourself.',
              then: [N('You lay him on the canary feathers. Your Nubbin climbs in beside him and sits on his chest, to keep it warm.')],
            },
          ],
        },
        done: {
          id: 'a13-10-falcon-done',
          lines: [N('The Fairy puts Pinocchio to bed, and sends for the three best doctors in the neighbourhood.')],
        },
      },
      {
        id: 'a13-10-s2',
        goal: 'Wait by the bed while the doctors look at Pinocchio.',
        hint: 'Stand at the foot of the bed. Look at the third doctor.',
        check: 'wait:a13-doctors:bedside',
        scene: {
          id: 'a13-10-doctors',
          lines: [
            N('The doctors arrive one after another: a Crow, an Owl, and, last of all, a Talking-cricket.'),
            N('You look twice. It is him, a little grey at the edges, a little stiff in one leg, in a very bad temper, and alive.'),
            FY('Doctors, tell me. Is this poor puppet alive, or dead?'),
            CW('In my opinion, the puppet is dead. But if by any chance he is not dead, then he is certainly alive.', 'think'),
            OW('I am sorry to disagree with my learned friend. He is alive. But if by any chance he is not alive, then he is certainly dead.'),
            FY('And you, sir? You say nothing?'),
            CR('A wise doctor, when he doesn’t know, keeps quiet. But I know this puppet. I have known him a little while.'),
            N('Pinocchio, who has been lying as stiff as a plank, gives a small shiver all over.'),
            CR('That puppet is a rascal, and a runaway, and a disobedient son. He will break his poor father’s heart.', 'angry'),
            N('From under the sheet comes a sound of crying.'),
            CW('When the dead cry, it is a sign they are getting better.'),
            OW('When the dead cry, it is a sign they are sorry to be dead.'),
          ],
        },
        done: {
          id: 'a13-10-doctors-done',
          lines: [
            ...A10_LEAVE,
            N('Under the sheet, Pinocchio stops crying long enough to listen to that slow, uneven step go down the stairs.'),
          ],
        },
      },
    ],
    complete: {
      id: 'a13-10-complete',
      lines: [
        N('When they have all gone, the Fairy sits on the edge of the bed and puts her hand on Pinocchio’s forehead. He is burning hot.'),
        FY('Fever. Silly boy. Silly, silly boy.', 'soft'),
        N('She looks across at you, over the sheet.'),
        FY('You came in with him. Stay, then. He will need somebody to be cross with when he wakes up.'),
      ],
    },
    rewards: [],
    sets: { 'a13-10': true },
    notes:
      'CRICKET PAYOFF (a13-cricket). The step 2 done shown, a13-10-doctors-done, is for left. For carried, play ' +
      'A13_VARIANTS a13-10-doctors-done-carried: he nods to you at the door. Either way he is plainly alive, as in ' +
      'Collodi; draw him with a little grey ash still in his feelers and one stiff leg. The Crow and the Owl are ' +
      'Collodi’s comic doctors; keep their exchange quick and silly. The coach: canary feathers, white mice, custard ' +
      '(Collodi’s), all original art.',
  },

  // ---------------------------------------------------------------- A13-11
  {
    id: 'a13-11',
    code: 'A13-11',
    title: 'The Nose',
    source: `${SRC}, ch. XVII: the medicine, the black rabbits, and the nose`,
    audience: 'all',
    trigger: { where: WHERE, when: after('A13-10') },
    requires: ['A13-10'],
    speakers: [FAIRY, PINOCCHIO, RABBIT],
    steps: [
      {
        id: 'a13-11-s1',
        goal: 'Get Pinocchio to take his medicine.',
        hint: 'He’ll bargain. Let him. Sugar first, then the glass.',
        check: 'give:a13-medicine:pin',
        scene: {
          id: 'a13-11-medicine',
          lines: [
            FY('Drink this, and you’ll be well in a day or two.'),
            P('Is it sweet or bitter?'),
            FY('Bitter. But it’s good for you.'),
            P('If it’s bitter, I don’t want it. Give me a lump of sugar first. Then I’ll drink it. Probably.'),
            N('The Fairy gives him a lump of sugar. He crunches it up, and pushes the glass away.'),
            P('Another lump. Then I’ll drink it.'),
            N('Another lump, more crunching, more pushing.'),
            P('The pillow’s on my feet. I can’t drink with a pillow on my feet. Also, the door’s open.'),
            N('The door opens wider. In come four rabbits, as black as ink, walking on their hind legs.'),
            RB('We’ve come for you. We were told you weren’t taking your medicine.', 'think'),
            P('Give me the glass! Quick, give it here!', 'shock'),
            N('He drinks the whole thing at one gulp.'),
            RB('Well. That’s a wasted walk.'),
            N('The four black rabbits go out again, grumbling between their teeth.'),
          ],
        },
        done: {
          id: 'a13-11-medicine-done',
          lines: [
            N('In a few minutes Pinocchio jumps out of bed, quite well. Puppets are lucky that way: ill quickly, and well quickly.'),
          ],
        },
      },
      {
        id: 'a13-11-s2',
        goal: 'Stay while the Fairy asks about the gold.',
        hint: 'You can’t stop him lying. You can stand where he can see you.',
        check: 'inspect:a13-nose:door',
        scene: {
          id: 'a13-11-nose',
          lines: [
            FY('Now. Where are the four gold pieces?'),
            P('I lost them.'),
            N('He is lying; they are in his pocket. His nose, which is long already, grows two fingers longer.'),
            FY('Where did you lose them?'),
            P('In the wood. Near here.'),
            N('His nose grows again.'),
            FY('Then we’ll go and look for them. Everything lost in this wood is always found.'),
            P('Ah. No. Now I remember. I didn’t lose them. I swallowed them, with the medicine.'),
            N('At that third lie his nose shoots out so far that he can’t turn round. It knocks the bed, and the window, and the wall.'),
            N('He tries to get out of the door, and can’t, because his nose won’t fit through it.'),
            FY('Lies are found out at once, my boy. Some lies have short legs, and some have long noses. Yours are the long-nosed kind.'),
          ],
          choices: [
            {
              id: 'laugh',
              label: 'Laugh, kindly. You can’t help it.',
              then: [P('It isn’t funny!', 'angry'), N('It is a bit funny. In a minute even he thinks so, though he would never say.')],
            },
            {
              id: 'truth',
              label: 'Tell him the coins are in his pocket. He knows.',
              then: [P('…They’re in my pocket.', 'sad'), N('His nose doesn’t shrink. But it stops growing, which is a start.')],
            },
          ],
        },
        done: {
          id: 'a13-11-nose-done',
          lines: [
            N('Pinocchio cries for half an hour, because he can’t get out of the room. The Fairy lets him; lessons take half an hour, she says.'),
            N('Then she claps her hands. A thousand woodpeckers fly in at the window and peck the nose back to its proper size in no time at all.'),
          ],
        },
      },
    ],
    complete: {
      id: 'a13-11-complete',
      lines: [
        FY('There. I’ll be your sister, if you’ll be a good brother. And your father is on his way; I sent for him. He’ll be here by dark.', 'soft'),
        P('Babbo? Here? I’ll go and meet him on the road!', 'happy'),
        N('He is gone in a rattle of bark shoes.'),
        FY('Go with him. He has never yet gone anywhere in a straight line.', 'soft'),
      ],
    },
    rewards: [],
    sets: { 'a13-11': true },
    notes:
      'CARE: the four black rabbits carry no coffin and nothing at all; their errand is left vague and comic, and they ' +
      'leave grumbling. The nose is pure comedy: it bumps furniture, it never hurts. Honesty, gently (the Learning ' +
      'Grove theme): nobody shames him; the “truth” choice stops the nose growing. The woodpeckers are a cloud of ' +
      'small birds tapping like rain.',
  },

  // ---------------------------------------------------------------- A13-12
  {
    id: 'a13-12',
    code: 'A13-12',
    title: 'The Field of Miracles',
    source: `${SRC}, ch. XVIII–XIX: Catchfools, the Field of Miracles, and the Parrot`,
    audience: 'all',
    trigger: { where: WHERE, when: after('A13-11') },
    requires: ['A13-11'],
    speakers: [FOX, CAT, PINOCCHIO, PARROT],
    steps: [
      {
        id: 'a13-12-s1',
        goal: 'Walk with Pinocchio to meet Geppetto on the road.',
        hint: 'The road goes past the Big Oak. Somebody is waiting there.',
        check: 'talk:a13-fox:oak',
        scene: {
          id: 'a13-12-oak',
          lines: [
            N('At the Big Oak, sitting in the shade as if nothing had ever happened, are the Fox and the Cat.'),
            FX('Our dear Pinocchio! What are you doing here?', 'happy'),
            N('The Cat keeps one paw tucked inside his coat, like a gentleman with a secret.'),
            P('What happened to his paw?'),
            FX('Charity. We met a poor old wolf, starving on the road, and my friend gave him a hand. Well. A paw.', 'sad'),
            N('Pinocchio wipes away a tear. You remember whose teeth that paw last met, and say nothing.'),
            P('Fox, I can’t come to the field. I’m going to meet my father. The Fairy said—'),
            FX('With four coins, when you could bring him two thousand? Think how proud he’ll be.'),
            N('Pinocchio thinks of the Fairy, and of Babbo, and for a moment of the cricket. Then he thinks of two thousand.'),
            P('Is it far?'),
          ],
          choices: [
            {
              id: 'babbo',
              label: 'Remind him Geppetto is on this very road.',
              then: [P('Then he’ll wait! He always waits. He’s good at it.'), N('He says it as if it were a reason.')],
            },
            {
              id: 'go',
              label: 'Go with him. Somebody should.',
              then: [N('You go with him. The Fox gives you the look of someone counting heads at a table.')],
            },
          ],
        },
        done: {
          id: 'a13-12-oak-done',
          lines: [
            N('The town of Catchfools is full of coatless dogs yawning with hunger, shorn sheep shivering, and hens with no crests begging for a grain.'),
            N('There are butterflies who have sold their wings, and peacocks ashamed of their tails. Now and then a fine coach goes by, with a fox in it, or a magpie.'),
          ],
        },
      },
      {
        id: 'a13-12-s2',
        goal: 'Help Pinocchio plant his coins in the Field of Miracles.',
        hint: 'Dig, plant, water, salt. Then the Fox says to go away for twenty minutes.',
        check: 'place:a13-gold:field-of-miracles',
        scene: {
          id: 'a13-12-field',
          lines: [
            N('Just outside the town there is a lonely field that looks like every other field.'),
            FX('This is it. Dig a hole. Plant the coins. Cover them up. Water them from the ditch, and add a pinch of salt.'),
            N('Pinocchio digs with his hands, and you help. He has nothing to carry water in, so he fills his shoe at the ditch and pours it on.'),
            FX('Now go away for twenty minutes. Trees are very shy when you watch them grow.'),
            CT('And we want nothing for it. Nothing at all. Our reward is your happiness.'),
            N('They go off down the road together, very quickly for a lame Fox and a blind Cat.'),
          ],
          choices: [
            {
              id: 'stay',
              label: 'Offer to stay and watch the hole.',
              then: [P('You heard him! Trees are shy! Come on. You’ll spoil everything.'), N('He tugs you away by the sleeve.')],
            },
            {
              id: 'count',
              label: 'Count the twenty minutes with him in town.',
              then: [N('He counts every minute aloud, and some of them twice.')],
            },
          ],
        },
        done: {
          id: 'a13-12-field-done',
          lines: [
            N('Twenty minutes, and back to the field. There is no tree, only the hole, and it is empty.'),
            N('In a tree nearby, a Parrot is preening his feathers and laughing so much that he nearly falls off his branch.'),
            PR('I laugh at fools who believe every silly thing they’re told.', 'happy'),
            PR('While you were counting, your friends came back, dug up your gold and ran off like the wind. You’ll never catch them now.'),
          ],
        },
      },
    ],
    complete: {
      id: 'a13-12-complete',
      lines: [
        N('Pinocchio digs and digs, until the hole is deep enough to stand a haystack in. There is nothing at the bottom but more field.'),
        P('Then I’ll go to the judge. There’s a judge in this town. Judges are for exactly this.', 'angry'),
        N('The Parrot laughs again. Your Nubbin throws a small clod of earth at him, which is not like it at all.'),
        N('The clod misses. The Parrot laughs at that too.'),
      ],
    },
    rewards: [],
    sets: { 'a13-12': true },
    notes:
      '“Catchfools” is our rendering of Collodi’s Acchiappa-citrulli (Murray has another). The town’s sad animals ' +
      '(Collodi’s satire) are drawn gently, a little comic. The Cat’s missing paw is tucked in his coat and never ' +
      'shown. The Fox’s “gave him a hand” pun is ours.',
  },

  // ---------------------------------------------------------------- A13-13
  {
    id: 'a13-13',
    code: 'A13-13',
    title: 'The Gorilla Judge',
    source: `${SRC}, ch. XIX: the judge of Catchfools, and the amnesty`,
    audience: 'all',
    trigger: { where: WHERE, when: after('A13-12') },
    requires: ['A13-12'],
    speakers: [JUDGE, JAILER, PINOCCHIO],
    steps: [
      {
        id: 'a13-13-s1',
        goal: 'Go with Pinocchio to the court in Catchfools.',
        hint: 'The courthouse has the biggest door in town. Wipe your feet.',
        check: 'visit:a13-court:catchfools',
        scene: {
          id: 'a13-13-court',
          lines: [
            N('The judge of Catchfools is a large old Gorilla, much respected for his age, his white beard and his gold spectacles.'),
            N('The spectacles have no glass in them. He wears them, he says, for his weak eyes.'),
            N('Pinocchio tells him everything: the names, the descriptions, the field, the hole, the Parrot. He asks for justice.'),
            JG('Dear me. Dear me. Poor boy.', 'sad'),
            N('The Judge listens with great kindness, nodding all the way through, and blows his nose. Then he rings a bell.'),
            N('Two mastiffs come in, dressed as policemen.'),
            JG('This poor creature has been robbed of four gold pieces. Take him away, and put him in prison at once.'),
          ],
          choices: [
            {
              id: 'object',
              label: 'Object. He’s the one who was robbed!',
              then: [
                JG('Exactly so. And the robbers are not here, so who else am I to lock up?', 'think'),
                N('In Catchfools, it seems, that counts as an answer.'),
              ],
            },
            {
              id: 'quiet',
              label: 'Keep quiet. Nothing here makes sense anyway.',
              then: [N('You keep quiet. One of the mastiffs gives you a long, sorry look, as if he would have liked to object too.')],
            },
          ],
        },
        done: {
          id: 'a13-13-court-done',
          lines: [N('Four months in prison, for the crime of being robbed. Pinocchio is led away with his mouth open, too surprised to cry.')],
        },
      },
      {
        id: 'a13-13-s2',
        goal: 'Wait outside the prison.',
        hint: 'His window is round the back. Your Nubbin fits between the bars.',
        check: 'wait:a13-prison:amnesty',
        scene: {
          id: 'a13-13-prison',
          lines: [
            N('The atlas turns its own pages, softly, and four months go by. You take a room over the baker’s, round the corner from his window.'),
            N('Your Nubbin climbs in through the bars with crusts, and comes back out with messages, which are mostly “I’m bored”.'),
            N('Then one morning, bells. The young Emperor of Catchfools has won a great victory over somebody, and there are flags everywhere.'),
            N('All the prisons are to be opened. All the rogues are to go free.'),
            N('The jailer lets out the thieves, the cheats and the pickpockets. Then he shuts the door again in Pinocchio’s face.'),
            JL('Not you. You’re not one of them.'),
            P('I beg your pardon. I’m a rogue as well.'),
            JL('Oh. Well, that’s quite different.', 'happy'),
            N('He takes off his cap, bows, and opens the door.'),
          ],
        },
        done: {
          id: 'a13-13-prison-done',
          lines: [N('Pinocchio walks out into the sunshine. His nose, you notice, stays exactly where it is.'), N('Make of that what you will.')],
        },
      },
    ],
    complete: {
      id: 'a13-13-complete',
      lines: [
        P('Straight home now. Straight to the Fairy, then straight to Babbo. No stopping. Not for anything.'),
        N('You set off at a great pace. After an hour he is walking more slowly, and after two he is looking at the vineyards.'),
        P('Just one bunch of grapes. One. I’m so hungry I could eat my own cap. It is bread, after all.', 'sad'),
        N('He is over the vineyard wall before you can say anything about whose grapes they are.'),
      ],
    },
    rewards: [],
    sets: { 'a13-13': true },
    notes:
      'The four months pass in a page-turn: no daily visits for the player, no timer. The prison is never shown from ' +
      'inside. CARE: Collodi’s serpent, who laughs until he bursts (ch. XX), is left out; the road goes straight from ' +
      'the prison to the vineyard.',
  },

  // ---------------------------------------------------------------- A13-14
  {
    id: 'a13-14',
    code: 'A13-14',
    title: 'The Guard Dog',
    source: `${SRC}, ch. XX–XXII: the trap, the kennel, and the martens`,
    audience: 'all',
    trigger: { where: WHERE, when: after('A13-13') },
    requires: ['A13-13'],
    speakers: [PINOCCHIO, FARMER, MARTEN],
    steps: [
      {
        id: 'a13-14-s1',
        goal: 'Go after Pinocchio into the vineyard.',
        hint: 'Watch where you put your feet. Something under the vines is set for thieves.',
        check: 'inspect:a13-trap:vineyard',
        scene: {
          id: 'a13-14-trap',
          lines: [
            N('Pinocchio reaches for the first bunch. Snap: something under the vines closes on both his ankles, and holds.'),
            N('It is a trap, set by the farmer for the martens that come after his hens. His ankles are wood, so it doesn’t hurt; it just won’t let go.'),
            P('Help! Get it off! Get it OFF!'),
            N('You pull, and your Nubbin pulls on you. The trap does not care how many of you there are.'),
            N('At dark a farmer comes along the rows with a lantern, and holds it up to Pinocchio’s face.'),
            FM('So. You’re the one who’s been at my hens.', 'angry'),
            P('No! I only came for two bunches of grapes!'),
            FM('A grape thief is a hen thief, given time. My dog Melampo kept watch here for me. He’s gone.'),
            FM('So you can be my watchdog tonight.'),
          ],
          choices: [
            {
              id: 'plead',
              label: 'Tell the farmer he’s only a hungry puppet.',
              then: [
                FM('Then he’ll be a hungry watchdog. It’s one night. The kennel’s dry.'),
                N('He isn’t unkind. He is a man with a great many hens and no dog.'),
              ],
            },
            {
              id: 'straw',
              label: 'Help Pinocchio settle into the kennel straw.',
              then: [N('You shake out the straw and pat it flat. Pinocchio climbs in and sits there in his paper suit, the saddest dog in Tuscany.')],
            },
          ],
        },
        done: {
          id: 'a13-14-trap-done',
          lines: [
            N('The farmer buckles a brass collar round Pinocchio’s neck, on a long chain, and fastens the chain to the kennel.'),
            FM('If thieves come, bark. Goodnight.'),
            P('The cricket said this would happen. Not the dog part. Everything else.', 'sad'),
          ],
        },
      },
      {
        id: 'a13-14-s2',
        goal: 'Keep watch with Pinocchio by the hen-house.',
        hint: 'Sit in the dark. Don’t move when the visitors come.',
        check: 'watch:a13-martens:hen-house',
        scene: {
          id: 'a13-14-martens',
          lines: [
            N('Around midnight four little shapes come slipping out of the dark. They have long bodies and short legs, and they smell of hens.'),
            N('They are martens. They like eggs, and chickens, and most of all they like not being seen.'),
            MT('Good evening, Melampo.'),
            P('I’m not Melampo.'),
            MT('Then where’s the old dog?'),
            P('Gone. This morning.'),
            MT('Gone? Poor beast. He was such a reasonable dog.', 'sad'),
            MT('You look reasonable too. Here’s what we had with him. You keep quiet, we take seven hens, and you get one, plucked.'),
            P('Oh, yes. Very reasonable. Go right in.'),
            N('The martens go into the hen-house, one after another. Pinocchio waits until the last tail is through the door.'),
            N('Then he pushes the door shut with his foot and rolls a stone against it. He barks like a proper dog: bow-wow, bow-wow, bow-wow!'),
          ],
        },
        done: {
          id: 'a13-14-martens-done',
          lines: [
            N('The farmer comes running in his nightshirt and nightcap, with his lantern, and catches all four martens in a sack.'),
            FM('Well, I never! Well done, dog. Well done, boy. Whatever you are.', 'happy'),
          ],
        },
      },
    ],
    complete: {
      id: 'a13-14-complete',
      lines: [
        FM('And Melampo, all those years. Did he take hens off them?'),
        N('Pinocchio knows; you can see him knowing it. He looks at the empty kennel for a long moment.'),
        P('Melampo’s gone. Let him be gone with a good name. It doesn’t cost anything.', 'soft'),
        N('The farmer takes off the collar and lets him go. He gives you both a handful of grapes for the road, which seems fair.'),
      ],
    },
    rewards: [],
    sets: { 'a13-14': true },
    notes:
      'CARE: Melampo is only “gone”, never dead on screen. The trap is a wooden clamp that grips, with no teeth and no ' +
      'pain. The martens are taken off in a sack “to market”; nothing more is said. Pinocchio refusing to blacken the ' +
      'old dog’s name is Collodi’s and is his second unselfish act; keep it quiet.',
  },

  // ---------------------------------------------------------------- A13-15
  {
    id: 'a13-15',
    code: 'A13-15',
    title: 'The Stone and the Pigeon',
    source: `${SRC}, ch. XXIII: the stone, the Pigeon, and Geppetto’s boat`,
    audience: 'all',
    trigger: { where: WHERE, when: after('A13-14') },
    requires: ['A13-14'],
    speakers: [PINOCCHIO, PIGEON],
    steps: [
      {
        id: 'a13-15-s1',
        goal: 'Go with Pinocchio to the Fairy’s white house.',
        hint: 'Through the wood, past the Big Oak. Read what you find there.',
        check: 'find:a13-stone:white-house',
        scene: {
          id: 'a13-15-stone',
          lines: [
            N('Pinocchio runs all the way to the Big Oak. Past it, where the little white house stood, there is no house.'),
            N('There is grass, and a small white stone. On the stone there are words, cut carefully, in small letters.'),
            P('What does it say? Read it. I can’t read. I was going to learn. I sold the book.', 'sad'),
            N('You kneel down by the stone. Your Nubbin brushes the leaves off it with both paws.'),
            P('Read it. Please.'),
            N('The wind goes through the grass. The Big Oak creaks behind you, the way it did that night.'),
          ],
          choices: [
            {
              id: 'exact',
              label: 'Read it exactly as it is written.',
              then: [
                Y('“Here the girl with blue hair waited for her little brother Pinocchio. He did not come, and she went away grieving.”'),
                N('Pinocchio sits down on the grass very suddenly, as if his legs had come unglued.'),
              ],
            },
            {
              id: 'gentle',
              label: 'Read it gently, and leave out the grieving.',
              then: [
                Y('It says she waited for you. And then she had to go away.'),
                P('That isn’t all of it. Your mouth stopped. Read the rest.', 'sad'),
                Y('“…and she went away grieving.”'),
                N('Pinocchio sits down on the grass very suddenly, as if his legs had come unglued.'),
              ],
            },
          ],
        },
        done: {
          id: 'a13-15-stone-done',
          lines: [
            N('He cries all night. The hills hear him and cry back, in echoes, until morning.'),
            P('Little Fairy, come back. Where’s Babbo? Who’s going to give me bread now? Who’s going to tell me off?', 'sad'),
          ],
        },
      },
      {
        id: 'a13-15-s2',
        goal: 'Follow the Pigeon to the sea.',
        hint: 'The Pigeon takes Pinocchio. You take the coast road, and you’ll have to hurry.',
        check: 'walk:a13-coast-road:shore',
        scene: {
          id: 'a13-15-pigeon',
          lines: [
            N('In the morning a great Pigeon, as big as a turkey, comes circling down out of the sky.'),
            PG('Do you happen to know a puppet called Pinocchio?'),
            P('Know him? It’s me!'),
            PG('Then you’ll know Geppetto. Three days ago I left him on the seashore, building himself a little boat.'),
            PG('He has walked the country for four months looking for you. Now he means to cross the sea and look for you on the other side.'),
            P('Babbo! Is it far? Can you take me?', 'shock'),
            PG('Climb on my back, and hold on. Traveller, it’s the coast road for you. I’m strong, but I’m not a cart.'),
            N('Off they go, over the trees. You and your Nubbin take the coast road, and walk all day and half the night.'),
          ],
        },
        done: {
          id: 'a13-15-pigeon-done',
          lines: [
            N('At dawn you come out on the shore. There is a crowd on the beach, all pointing out to sea.'),
            N('Far out there is a tiny boat, and an old man in it, rowing. Pinocchio is on a rock at the water’s edge, waving his breadcrumb cap.'),
          ],
        },
      },
    ],
    complete: {
      id: 'a13-15-complete',
      lines: [
        P('Babbo! BABBO! It’s me!', 'happy'),
        N('Out on the water the little old man stops rowing, and waves back. He has seen.'),
        N('Then a wave comes, bigger than all the others, and the boat is gone under it.'),
        N('The crowd groans, but Pinocchio doesn’t make a sound. He climbs to the top of the rock, and jumps.'),
        P('I’ll save him!'),
        N('He swims like a fish, because he is wood, and wood floats. He goes out and out through the waves, until you can’t see him at all.'),
      ],
    },
    rewards: [],
    sets: { 'a13-15': true },
    notes:
      'CARE: Collodi’s gravestone (“died of sorrow”) becomes a small white stone that says she went away grieving. The ' +
      'words on it are our own. The player reads them aloud because Pinocchio cannot read: he sold the book. Both ' +
      'choices end with the full words; the gentle one only delays them. The boat goes under at a distance and is ' +
      'never shown sinking close up.',
  },

  // ---------------------------------------------------------------- A13-16
  {
    id: 'a13-16',
    code: 'A13-16',
    title: 'The Island of Busy Bees',
    source: `${SRC}, ch. XXIV–XXV: the Island of Busy Bees, and the woman with the water cans`,
    audience: 'all',
    trigger: { where: WHERE, when: after('A13-15') },
    requires: ['A13-15'],
    speakers: [PINOCCHIO, COALMAN, WOMAN, FAIRY],
    steps: [
      {
        id: 'a13-16-s1',
        goal: 'Cross to the island and find Pinocchio.',
        hint: 'A fishing boat will take you. Look for the puppet asking everybody for a penny.',
        check: 'explore:a13-island:busy-bees',
        scene: {
          id: 'a13-16-island',
          lines: [
            N('A fishing boat takes you over at first light. On the island there is a town where everybody is busy, which is why it is called the Island of Busy Bees.'),
            N('Pinocchio washed up here in the night, with no Babbo. A Dolphin told him the sea has a Terrible Dog-fish in it, and said no more.'),
            N('Now he is going up and down the street, very hungry, asking everybody for a penny.'),
            CO('A penny? Help me pull this coal cart home, and I’ll give you forty.'),
            P('Pull a cart? I’m not a donkey! I’ve never pulled a cart in my life!', 'angry'),
            CO('Then eat your pride, lad, if you’re hungry. I’m told it’s very filling.'),
            N('He asks a bricklayer next. Carry lime for an hour, says the bricklayer, and there’s a supper in it.'),
            P('Lime is heavy. I’m not built for heavy. Look at my arms.'),
          ],
          choices: [
            {
              id: 'carry',
              label: 'Carry a hod of lime yourself, to show him.',
              then: [
                N('You carry it, and it is heavy. Your Nubbin carries one brick, very proudly, the whole way.'),
                P('You’re a Keeper. You’re made for that sort of thing.', 'think'),
                N('You don’t think anybody is made for it. You just do it.'),
              ],
            },
            {
              id: 'tell',
              label: 'Tell him work isn’t the end of the world.',
              then: [
                P('It’s the end of the morning, and that’s worse.'),
                N('But he watches the coal cart go off up the hill, and for a moment he looks as if he might go after it.'),
              ],
            },
          ],
        },
        done: {
          id: 'a13-16-island-done',
          lines: [N('Along the street comes a little woman, carrying two cans of water from the fountain.')],
        },
      },
      {
        id: 'a13-16-s2',
        goal: 'Help carry the water home.',
        hint: 'Pinocchio takes one can. Your Nubbin will try to take the other.',
        check: 'carry:a13-water:fountain',
        scene: {
          id: 'a13-16-water',
          lines: [
            P('Good woman, will you give me a drink?'),
            WO('Drink, child. Then carry one of these home for me, and I’ll give you a good piece of bread.'),
            N('Pinocchio looks at the can, which is nearly the size of him. He thinks about the bread, and picks up the can.'),
            N('Your Nubbin tries to pick up the other one, and very nearly drowns in a puddle of its own making.'),
            N('At her house the little woman gives him bread, a whole cauliflower dressed with oil and vinegar, and a sweet with cream in the middle.'),
            N('He eats like a wolf. Then he looks up at her to say thank you, and stops, and stares.'),
            P('You’ve got blue hair. Like her. Just like her.', 'shock'),
            N('The little woman says nothing. She smiles, and that is enough.'),
            P('It’s you! You were a little girl, and now you’re grown up. You’re almost like a mother.', 'happy'),
            FY('Then call me mother, if you like.', 'soft'),
          ],
        },
        done: {
          id: 'a13-16-water-done',
          lines: [
            P('Why did you grow, and I didn’t? Look at me. I’m the same size as the day I was carved.'),
            FY('Puppets don’t grow. They stay just as they were made.'),
            P('Then I’m tired of being made of wood! I want to be a boy, a proper one, like everybody else!', 'sad'),
            FY('You can be. But it has to be earned, and nobody in the world can earn it for you.', 'soft'),
          ],
        },
      },
      {
        id: 'a13-16-s3',
        goal: 'Walk Pinocchio to the island school.',
        hint: 'He has promised. Walk beside him so he keeps it.',
        check: 'walk:a13-school:island',
        scene: {
          id: 'a13-16-school',
          lines: [
            P('I’ll be good. I’ll go to school. I’ll work. I’ll tell the truth. And Babbo? Will I see Babbo again?'),
            FY('If you are good, I think you will.'),
            N('Next morning he goes to school, the only wooden boy in a class of forty.'),
            N('The other boys try to hang their caps on his nose, and draw a moustache on him in ink.'),
            N('He puts up with it for a morning. Then he kicks a few shins with his bark shoes, and after that they like him very much.'),
            N('The schoolmaster praises him. He is quick, he pays attention, and he is first through the door every morning.'),
          ],
        },
        done: {
          id: 'a13-16-school-done',
          lines: [N('The atlas turns a page, gently, and a whole school year goes by. Pinocchio comes top in the examinations.')],
        },
      },
    ],
    complete: {
      id: 'a13-16-complete',
      lines: [
        FY('I am pleased with you. Go on like this.', 'soft'),
        P('I will. I’ll go on and on. You’ll see.', 'happy'),
        N('He means it, at the time. That is the trouble with Pinocchio: he always means it, at the time.'),
        N('Your Nubbin, who has been to school every day too, can now sit still for nearly a minute.'),
      ],
    },
    rewards: [],
    sets: { 'a13-16': true },
    notes:
      'The little woman is the Fairy, grown up: she is the speaker a13-woman until Pinocchio knows her, then ' +
      'a13-fairy. Lifted texts 3 and 4 are [unverified] and told in our own words at a13-16-water-done#2–3. ' +
      'Collodi’s “liqueur” sweet is a cream sweet. Collodi’s boys tie threads to him; here they hang caps on his ' +
      'nose (no strings on this page). The coalman’s “I’m not a donkey” is set up for A13-18.',
  },

  // ---------------------------------------------------------------- A13-17
  {
    id: 'a13-17',
    code: 'A13-17',
    title: 'The Dog-fish Trick',
    source: `${SRC}, ch. XXVI–XXIX: the trick, the fight, Alidoro and the Green Fisherman`,
    audience: 'all',
    trigger: { where: WHERE, when: after('A13-16') },
    requires: ['A13-16'],
    speakers: [SCHOOLBOY, PINOCCHIO, EUGENE, ALIDORO, FISHER, FAIRY],
    steps: [
      {
        id: 'a13-17-s1',
        goal: 'Go down to the beach with Pinocchio and the schoolboys.',
        hint: 'Keep up. They’re running, and they don’t want to be followed.',
        check: 'walk:a13-beach:dogfish',
        scene: {
          id: 'a13-17-lure',
          lines: [
            SB('Pinocchio! The Terrible Dog-fish has come to the beach! It’s as big as a mountain! Come and see!'),
            P('The Dog-fish? Perhaps it’s the one that… Babbo’s boat…', 'think'),
            P('After school. We’ll go after school.'),
            SB('After school he’ll be gone! Do you think he’ll wait for you? He’s a fish!'),
            N('The schoolboys are already running. Pinocchio looks at the school door, and then at the road to the sea.'),
            N('You know which one he’s going to choose. So does he.'),
          ],
          choices: [
            {
              id: 'school',
              label: 'Tell him: school first, the beach after.',
              then: [P('After! Everything’s after, with you. With everyone.', 'angry'), N('He runs. You follow, because somebody should.')],
            },
            {
              id: 'go',
              label: 'Go with him. You want to see the Dog-fish too.',
              then: [N('You go. It is a bad idea, and you both know it, and the sun is out.')],
            },
          ],
        },
        done: {
          id: 'a13-17-lure-done',
          lines: [N('At the beach the sea is flat and empty, as smooth as a plate. There is no Dog-fish, and there never was.')],
        },
      },
      {
        id: 'a13-17-s2',
        goal: 'Keep clear of the fight on the beach.',
        hint: 'You can’t stop it. Watch the books.',
        check: 'watch:a13-fight:beach',
        scene: {
          id: 'a13-17-fight',
          lines: [
            SB('Ha! You came! Now you’ll be in trouble like the rest of us. You make us look bad, being good all the time.', 'happy'),
            N('Pinocchio goes red under his paint. Somebody pushes somebody, and in a moment there is a fight.'),
            N('They throw their school books at him. He ducks, and the books sail over his head into the sea.'),
            N('The fish come up to taste them. They nibble a page, spit it out and swim off, as if they get enough of that at home.'),
            N('Then somebody throws the big arithmetic book, the heaviest book in the school.'),
            N('It misses Pinocchio. It hits a boy called Eugene on the head, and he goes down on the sand.'),
            N('Everyone runs. Everyone except Pinocchio, who kneels by Eugene and wets his handkerchief in the sea for his forehead.'),
          ],
        },
        done: {
          id: 'a13-17-fight-done',
          lines: [
            EU('Ow. Who threw the sums?'),
            N('Eugene sits up, with a bump on his head like half an egg. He is going to be all right, and Pinocchio goes weak with relief.'),
            N('Then two carabineers come down the beach. They see a wooden boy, a boy on the sand and a book, and decide what they’ve seen.'),
            N('Pinocchio runs. They let their dog off the lead after him.'),
          ],
        },
      },
      {
        id: 'a13-17-s3',
        goal: 'Get Alidoro out of the sea.',
        hint: 'Pinocchio is in the water. So is the dog, and the dog can’t swim. Wade in from the shallows.',
        check: 'swim:a13-alidoro:sea',
        scene: {
          id: 'a13-17-alidoro',
          lines: [
            N('The dog is a great mastiff called Alidoro, and he runs like a train. Pinocchio throws himself into the sea, and Alidoro goes in after him.'),
            N('Alidoro cannot swim. He goes under, comes up, and goes under again, paddling wildly and getting nowhere.'),
            AL('Help! Pinocchio! Save me!', 'shock'),
            N('Pinocchio is already halfway to the horizon. He stops, and treads water, and looks back.'),
            P('If I save you, will you promise not to chase me?'),
            AL('I promise! I promise! Anything!'),
          ],
        },
        done: {
          id: 'a13-17-alidoro-done',
          lines: [
            N('Pinocchio swims back and gets Alidoro by the tail. You wade in and take the other end, and the dog comes out like a wet carpet.'),
            AL('You saved me. I don’t forget a thing like that.', 'soft'),
            N('He shakes himself all over you, by way of thanks, and trots off home.'),
          ],
        },
      },
      {
        id: 'a13-17-s4',
        goal: 'Find Pinocchio along the shore.',
        hint: 'He swam round the point. Look for smoke coming out of a cave.',
        check: 'find:a13-pin:cave',
        scene: {
          id: 'a13-17-fisher',
          lines: [
            N('Round the point there is a cave with smoke coming out of it. You go in carefully, and stop at the back in the dark.'),
            N('A fisherman is frying fish. He is green all over: green skin, green hair, and a beard of long green grass, like a lizard that has stood up.'),
            N('He has a net full of fish, and he is sorting them, very pleased with himself. In the middle of the net is Pinocchio.'),
            GF('Mullet. Into the pan. Bream. Into the pan. Anchovies, into the pan. And what are you?', 'happy'),
            P('I’m a puppet!'),
            GF('A puppet-fish! I’ve never had a puppet-fish. A talking one, too. I’ll keep you for last, as a treat.', 'happy'),
            N('He rolls Pinocchio in flour from head to foot, until he looks like a plaster saint, and holds him over the pan by one leg.'),
            P('I’m not a fish! Fish don’t wear shoes!', 'shock'),
          ],
        },
        done: {
          id: 'a13-17-fisher-done',
          lines: [
            N('Something big comes bounding past you into the cave: Alidoro, dry now, following his nose, which is a very good nose for flour.'),
            N('He takes Pinocchio out of the fisherman’s hand, gently, in his teeth, and is gone before the green man can say “anchovy”.'),
            AL('Now we’re even.', 'happy'),
          ],
        },
      },
    ],
    complete: {
      id: 'a13-17-complete',
      lines: [
        N('Pinocchio walks home to the Fairy that night, floured like a loaf, and knocks. The Snail who keeps the door looks out of the top window.'),
        N('It takes her nine hours to come down. Pinocchio is asleep on the step when the door opens.'),
        N('The Fairy forgives him, again. He goes back to school, and works, and this time he is good for a whole year.'),
        FY('Tomorrow you will stop being a puppet. Tomorrow, you will be a boy.', 'soft'),
        P('Tomorrow? Really tomorrow? I’ll invite everybody! I’ll go and invite them now!', 'happy'),
      ],
    },
    rewards: [],
    sets: { 'a13-17': true },
    notes:
      'CARE: Eugene gets up (Collodi leaves him lying hurt); he sits up with a bump and speaks his first line. The ' +
      'carabineers only chase; nobody is arrested on screen. The Green Fisherman is comic, never menacing: a big green ' +
      'man delighted with his catch. Alidoro carries Pinocchio gently. swim:a13-alidoro:sea is a short wade from the ' +
      'shallows; it cannot fail. The Snail is the same Snail who comes back in A13-20.',
  },

  // ---------------------------------------------------------------- A13-18
  {
    id: 'a13-18',
    code: 'A13-18',
    title: 'The Land of Toys',
    source: `${SRC}, ch. XXX–XXXIV: Candlewick, the Land of Toys, donkey ears, and the sea`,
    audience: 'all',
    trigger: { where: WHERE, when: after('A13-17') },
    requires: ['A13-17'],
    speakers: [CANDLEWICK, PINOCCHIO, LITTLEMAN, MARMOT, BUYER],
    steps: [
      {
        id: 'a13-18-s1',
        goal: 'Go with Pinocchio to invite his friends.',
        hint: 'The last one on his list is the hardest to find.',
        check: 'talk:a13-candlewick:road',
        scene: {
          id: 'a13-18-candlewick',
          lines: [
            N('The last friend on Pinocchio’s list is the laziest boy in the school: tall and thin and pale, like the wick of a new candle. Everyone calls him Candlewick.'),
            N('You find him at midnight in a doorway on the road out of town, with a bundle.'),
            CW2('Me? A party? Can’t. I’m going away tonight. To the Land of Toys.', 'happy'),
            CW2('No schools. No teachers. No books. The holidays start on the first of January and end on the last day of December.'),
            CW2('Every week has six Saturdays and a Sunday. Come with me. Why don’t you come?'),
            P('I can’t. I promised the Fairy. Tomorrow I’m going to be a boy.'),
            N('Down the road comes a coach, with no sound at all. It is drawn by twelve pairs of donkeys, and the donkeys are all wearing white leather boots.'),
            N('Driving it is a Little Man, wider than he is tall, soft and shiny like a pat of butter, with a little mouth that never stops smiling.'),
            LM('Climb up, my dears. Plenty of room. There’s always room, for boys.', 'happy'),
          ],
          choices: [
            {
              id: 'coat',
              label: 'Remind him of the coat Geppetto sold.',
              then: [P('That was ages ago! I’ll be back before he… I’ll only stay a day.', 'angry'), N('He doesn’t look at you, and he climbs up anyway.')],
            },
            {
              id: 'hand',
              label: 'Take his hand and turn him towards home.',
              then: [N('He lets you, for three steps. Then he pulls his hand away and runs, and climbs up beside Candlewick.')],
            },
          ],
        },
        done: {
          id: 'a13-18-candlewick-done',
          lines: [
            N('As he climbs up, the donkey nearest you turns its head and speaks, very low. Poor fool, it says, you’ll be sorry.'),
            N('Nobody else hears. The Little Man flicks his whip, and the coach goes without a sound, and you run after it all night.'),
          ],
        },
      },
      {
        id: 'a13-18-s2',
        goal: 'Find Pinocchio in the Land of Toys.',
        hint: 'Look anywhere there’s noise. That narrows it down to everywhere.',
        check: 'explore:a13-toys:square',
        scene: {
          id: 'a13-18-toys',
          lines: [
            N('The Land of Toys is boys and nothing else. Boys playing ball, boys on stilts, boys dressed as generals, boys shouting just to hear the noise.'),
            N('On the walls, in chalk, it says LONG LIF TOYS and DOWN WITH SKOOL and NO MOR SUMS. The spelling is a matter of taste.'),
            N('Pinocchio is in the middle of it all with Candlewick, laughing so hard that he has to hold on to a lamp-post.'),
            P('Isn’t it wonderful? Admit it! Admit it’s wonderful!', 'happy'),
            N('At a stall your Nubbin finds a pair of paper donkey ears on a band, and wears them about. They are only paper, and they come off.'),
            N('The atlas turns its pages, one after another. Five months go by, and every one of them is a holiday.'),
          ],
        },
        done: {
          id: 'a13-18-toys-done',
          lines: [
            N('Then one morning Pinocchio wakes up and puts his hand to his head. He has ears: long, hairy ears, like a donkey’s.'),
            N('A little Marmot who lives upstairs looks at them, and shakes her head.'),
            MA('Donkey fever. Boys who do nothing but play all catch it in the end. In an hour or two you won’t be a boy or a puppet. You’ll be a donkey.', 'sad'),
          ],
        },
      },
      {
        id: 'a13-18-s3',
        goal: 'Stay near Pinocchio in the circus ring.',
        hint: 'He can’t talk any more. Watch the lady in the box above the ring.',
        check: 'watch:a13-circus:ring',
        scene: {
          id: 'a13-18-circus',
          lines: [
            N('Candlewick has the ears too. They laugh at each other until the laughing turns to braying, and then they are both donkeys, right down to the tail.'),
            N('The Little Man comes to collect them, smiling his little smile, and sells them at the market. That was always his business.'),
            N('Candlewick goes to a farmer. Pinocchio goes to a circus, where the director teaches him to dance and jump through hoops, and is not gentle about it.'),
            N('On the first night, in a box above the ring, there is a lady with a gold locket. In the locket is a picture of a puppet.'),
            N('Pinocchio sees her and tries to call out to her. What comes out is a bray, so loud that the audience laughs.'),
            N('He jumps for the hoop, catches his back leg on it and comes down hard. After that he is lame.'),
            N('The director sells him for a few pennies to a man who wants a donkey’s hide to make a drum.'),
            N('The man ties a rope to him and drops him off a rock into the sea, to soak the hide soft. You watch from the cliff, and can’t stop it.'),
          ],
        },
        done: {
          id: 'a13-18-sea',
          lines: [...A18_SEA],
        },
      },
    ],
    complete: {
      id: 'a13-18-complete',
      lines: [
        N('The drum man lends you his boat to go after his donkey, grumbling. You row out, with your Nubbin in the bows, still in its paper ears.'),
        N('Ahead, Pinocchio is swimming for a white rock where a little goat stands bleating at him. Her wool is blue.'),
        N('Behind him, the sea rises up out of itself. A head comes out of the water, as big as a house, with a mouth like a cave.'),
        N('It is the Terrible Dog-fish. It breathes in, and in goes Pinocchio, and in goes the sea, and in go you, boat and all.'),
      ],
    },
    rewards: [
      {
        id: 'a13-donkey-ears-hat',
        kind: 'cosmetic',
        label: 'Donkey-ears hat',
        description: 'A pair of paper donkey ears on a band, from a stall in the Land of Toys. Your Nubbin wears them proudly. They are only paper, and they come off.',
      },
    ],
    sets: { 'a13-18': true },
    notes:
      'CRICKET PAYOFF (a13-cricket). The step 3 done shown, a13-18-sea, is for left. For carried, play A13_VARIANTS ' +
      'a13-18-sea-carried: Pinocchio tells you the cricket was right. CARE: the Land of Toys is Collodi’s literal paese ' +
      'dei balocchi (not Pleasure Island, not Murray’s name for it). The Little Man is unsettling but never shown ' +
      'hurting anyone; the circus training is “not gentle”, never shown. The lame leg is a stumble and a limp. The sea ' +
      'washes the donkey off him like a coat; nothing is eaten. The chalk misspellings are ours. The goat with blue ' +
      'wool is the Fairy (Collodi, ch. XXXIV). The donkey-ears hat is given at the complete scene and is only paper ' +
      'from the start: your Nubbin never has donkey fever.',
  },

  // ---------------------------------------------------------------- A13-19
  {
    id: 'a13-19',
    code: 'A13-19',
    title: 'The Terrible Dog-fish',
    source: `${SRC}, ch. XXXIV–XXXV: the Tunny, Geppetto by candlelight, and the escape`,
    audience: 'all',
    trigger: { where: WHERE, when: after('A13-18') },
    requires: ['A13-18'],
    speakers: [PINOCCHIO, TUNNY, GEPPETTO, CLANK],
    steps: [
      {
        id: 'a13-19-s1',
        goal: 'Find your way through the dark inside the Dog-fish.',
        hint: 'Follow the faint light, far off. Mind the puddles; they’re mostly sea.',
        check: 'explore:a13-dogfish:belly',
        scene: {
          id: 'a13-19-belly',
          lines: [
            N('It is dark and wet, and it smells of fried fish, which is not reassuring when you are inside one.'),
            N('Your boat lies on its side in a shallow pool.'),
            P('Help! Help! Isn’t anyone here?', 'shock'),
            TU('Only us unfortunates.'),
            P('Who’s that?'),
            TU('A poor Tunny, swallowed at the same time as you. What sort of fish are you?'),
            P('I’m not any sort of fish! I’m a puppet. And that’s a traveller, and that’s a Nubbin.'),
            TU('Then why let yourselves be swallowed? Never mind. Now we wait to be digested, with dignity.', 'think'),
            P('I don’t want to be digested!'),
            N('Far away, down the long dark of the Dog-fish, there is a little light.'),
          ],
          choices: [
            {
              id: 'light',
              label: 'Head for the light.',
              then: [N('You start towards it. Your Nubbin goes first, because it is smallest and has the best eyes.')],
            },
            {
              id: 'how',
              label: 'Ask the Tunny how big the Dog-fish is.',
              then: [
                TU('A mile long, not counting the tail. I have never counted the tail. Nobody comes back from counting the tail.'),
                N('You decide to head for the light.'),
              ],
            },
          ],
        },
        done: {
          id: 'a13-19-belly-done',
          lines: [
            N('The light is a candle, stuck in the neck of a green glass bottle on a little table.'),
            N('At the table sits an old man, as white as snow, eating a very small fish.'),
          ],
        },
      },
      {
        id: 'a13-19-s2',
        goal: 'Go to the old man at the table.',
        hint: 'You know who it is. So does Pinocchio. Let him go first.',
        check: 'talk:a13-geppetto:dogfish',
        scene: {
          id: 'a13-19-babbo',
          lines: [
            N('Pinocchio stops, and shakes all over. He tries to speak and can’t, and then he can.'),
            P('Babbo! It’s you! It’s really you! I won’t leave you again. Not ever. Not ever, ever!', 'happy'),
            G('Pinocchio? Is it you? My Pinocchio?', 'shock'),
            N('Pinocchio is in his arms before he has finished, kissing him, talking, crying, all at once.'),
            P('I sold the book, and Fire-eater sneezed, and the Fox and the Cat, and the oak, and the nose, and I was a donkey, Babbo, a whole donkey—'),
            G('Hush. Hush. You’re here.', 'soft'),
            G('Two years I’ve been in here. A ship was swallowed the same day, full of stores: biscuits, cheese, candles, matches. It lasted, till now.'),
            G('This is the last candle. When it goes out, we’ll be in the dark.', 'sad'),
            P('Then we have to get out. Now. Through the mouth.'),
            G('I can’t swim, my boy.'),
            P('I can. I’m wood. I’ll carry you.'),
          ],
        },
        done: {
          id: 'a13-19-babbo-done',
          lines: [
            G('And you. The traveller who slept in my corner. You came all this way.', 'soft'),
            N('Your Nubbin climbs up onto his shoulder, the way it rode in his cap, and he laughs for the first time in two years.'),
          ],
        },
      },
      {
        id: 'a13-19-s3',
        goal: 'Light the way to the Dog-fish’s mouth.',
        hint: 'Your Nubbin carries the candle. Walk softly; the Dog-fish is asleep.',
        check: 'carry:a13-candle:dogfish-mouth',
        scene: {
          id: 'a13-19-mouth',
          lines: [
            N('Your Nubbin carries the candle in its green bottle, held up in both paws, and leads the way up the long throat.'),
            N('The Dog-fish is very old, and has asthma, and sleeps with its mouth open. Past its teeth you can see a piece of sky full of stars.'),
            N('You climb over the tongue, which is as wide as a road and as soft as a bad mattress. Three rows of teeth stand up against the stars.'),
            P('Babbo, climb onto my back, and put your arms round my neck. Hold on as tight as you can. Leave the rest to me.'),
            N('Just as you all reach the teeth, the Dog-fish sneezes, and throws you back down its throat in a great rush of wind.'),
            N('Up again, and over the tongue again. Quietly, this time, with nobody breathing.'),
            N('Then Pinocchio jumps into the sea, with Geppetto on his back. You jump after him, and your Nubbin holds the bottle up high.'),
          ],
        },
        done: {
          id: 'a13-19-mouth-done',
          lines: [
            N('Pinocchio swims and swims. The shore is far away, and Geppetto is heavy, and the water is cold.'),
            P('Babbo. I can’t. I’m sorry. I’m going under.', 'sad'),
            TU('Who’s going under?'),
            N('It is the Tunny, who followed your example and swam out after you. He comes up underneath them both, like a boat.'),
          ],
        },
      },
    ],
    complete: {
      id: 'a13-19-complete',
      lines: [
        N('The Tunny carries Pinocchio and Geppetto all the way to the shore, and you swim alongside, holding on to his fin.'),
        ...A19_THANKS,
        ...A19_CANDLE,
      ],
    },
    rewards: [
      {
        id: 'a13-green-bottle-candle',
        kind: 'decor',
        label: 'The Dog-fish’s candle',
        description: 'Geppetto’s last candle, in its green glass bottle. A Grove decoration that glows softly green at night.',
      },
    ],
    sets: { 'a13-19': true },
    notes:
      'Lifted texts 5, 6 and 7 are [unverified] and told in our own words (a13-19-babbo#1, a13-19-mouth#3, ' +
      'A19_THANKS#2). CLANK (s21Done): play A13_VARIANTS a13-19-complete-clank in place of a13-19-complete. Clank has ' +
      'been in the Dog-fish with you all along (he was in the boat), and rides out on the Tunny’s back, because a ' +
      'kettle sinks; draw him on the Tunny in the escape. The Dog-fish is huge and sleepy, never fierce: an old ' +
      'wheezing thing. Geppetto eats “a very small fish”, not live ones. The candle goes out in the sea; the bottle ' +
      'is the reward, and in the Grove it glows (the decoration, not a real flame).',
  },

  // ---------------------------------------------------------------- A13-20
  {
    id: 'a13-20',
    code: 'A13-20',
    title: 'The Wheel and the Chair',
    source: `${SRC}, ch. XXXVI: the beggars, the cricket’s hut, the water-wheel, the Snail, and the boy`,
    audience: 'all',
    trigger: { where: WHERE, when: after('A13-19') },
    requires: ['A13-19'],
    speakers: [PINOCCHIO, GEPPETTO, FOX, CAT, CRICKET, GIANGIO, CANDLEWICK, SNAIL, CLANK],
    steps: [
      {
        id: 'a13-20-s1',
        goal: 'Walk with Pinocchio and Geppetto, and find shelter.',
        hint: 'Geppetto is weak, so go slowly. Somebody is begging by the road.',
        check: 'walk:a13-road:hut',
        scene: {
          id: 'a13-20-road',
          lines: [...A20_ROAD],
          choices: [
            {
              id: 'crust',
              label: 'Give the Cat a crust from your pocket.',
              set: { 'a13-crust': 'given' },
              then: [
                N('You go back and put a crust into the Cat’s paw. You don’t say anything.'),
                N('He can’t see who it was. He turns his face up the road, to where Pinocchio is walking, and calls after him.'),
                CT('Thank you, Pinocchio. You were always the kind one.', 'soft'),
                N('Pinocchio stops, and his ears go red. He doesn’t say anything either, and neither do you, and that is how the Cat keeps it.'),
              ],
            },
            {
              id: 'walk',
              label: 'Walk on with Pinocchio.',
              set: { 'a13-crust': 'kept' },
              then: [N('You walk on. Behind you, the Fox is explaining to the Cat that it was only the wind.')],
            },
          ],
        },
        done: {
          id: 'a13-20-road-done',
          lines: [
            N('At the end of a lane there is a little hut of straw with a tiled roof. A sign on the door says PULL THE CORD, so Pinocchio pulls it.'),
            N('Inside, on a beam, sits the Talking-cricket.'),
          ],
        },
      },
      {
        id: 'a13-20-s2',
        goal: 'Stand by Pinocchio while he speaks to the Talking-cricket.',
        hint: 'Let him say it himself. It has taken him the whole book.',
        check: 'talk:a13-cricket:hut',
        scene: {
          id: 'a13-20-hut',
          lines: [...A20_HUT],
        },
        done: {
          id: 'a13-20-hut-done',
          lines: [
            N('Pinocchio lays his father on the straw. Geppetto is so weak that he can only smile.'),
            P('Milk. He needs milk. I’ll get him milk.'),
          ],
        },
      },
      {
        id: 'a13-20-s3',
        goal: 'Help Pinocchio earn a glass of milk at the water-wheel.',
        hint: 'A hundred buckets for one glass. Count with him.',
        check: 'carry:a13-buckets:water-wheel',
        scene: {
          id: 'a13-20-wheel',
          lines: [
            N('The gardener up the lane is called Giangio. He has milk, at a penny a glass, and Pinocchio hasn’t got a penny.'),
            GI('Then turn my water-wheel. Draw up a hundred buckets, and you’ll have your glass.'),
            N('Pinocchio turns the wheel, and you count. Your Nubbin counts on its paws, and loses its place at four, every time.'),
            N('He has never worked so hard in his life. At a hundred buckets he is wet through to the grain.'),
            GI('Till now my donkey turned that wheel. He’s dying, poor beast.'),
            N('Pinocchio goes into the stable. On the straw lies a donkey, worn out with hunger and work, as thin as a ladder.'),
            N('Pinocchio kneels down and looks at him. The donkey opens his eyes, and knows him.'),
            CW2('Pinocchio. It’s me. Candlewick.', 'soft'),
            P('Candlewick! Oh, Candlewick.', 'sad'),
            N('Candlewick lays his head in Pinocchio’s lap and closes his eyes. After a little while he stops breathing, very quietly, like a candle at the end of an evening.'),
          ],
        },
        done: {
          id: 'a13-20-wheel-done',
          lines: [
            GI('Why cry over a donkey? He cost you nothing.'),
            P('He was my friend. We sat at the same desk at school.', 'sad'),
            N('Your Nubbin sits down by the donkey’s head and doesn’t move, so you don’t either, for a while.'),
          ],
        },
      },
      {
        id: 'a13-20-s4',
        goal: 'Keep Pinocchio company through the winter.',
        hint: 'He works every day now. The pennies in the jar are for a new coat.',
        check: 'give:a13-coat-money:snail',
        scene: {
          id: 'a13-20-coat',
          lines: [
            N('The atlas turns its pages slowly now. Pinocchio turns the wheel every morning, and weaves rush baskets every evening, and sells them.'),
            N('He reads by the fire, from a book with no cover. He looks after Geppetto as if Geppetto were the puppet.'),
            N('He saves forty pennies in a jar. Forty pennies is a new coat, and his paper jacket has lost most of its flowers.'),
            N('One morning, on his way to market to buy the coat, he sees a Snail coming across the road towards him. It takes some time.'),
            SN('Pinocchio. Do you remember me? I kept the Fairy’s door.'),
            SN('She is ill, and in hospital. She has nothing left, not even enough for bread.', 'sad'),
            P('The Fairy? Ill? Wait.'),
            N('He tips out the jar. Every penny of the coat money goes into the Snail’s keeping.'),
            P('Take her this. All of it. I’ll make more baskets. I don’t need a coat. It was too warm anyway.', 'soft'),
            N('Too warm. You know where he got that.'),
            SN('I’ll go as fast as I can.', 'happy'),
            N('And the Snail, for the first time in her long, slow life, hurries.'),
          ],
        },
        done: {
          id: 'a13-20-coat-done',
          lines: [
            N('That night Pinocchio dreams of the Fairy, smiling and well again. She tells him his good heart has made up for everything.'),
            N('In the morning, he wakes up.'),
          ],
        },
      },
    ],
    complete: {
      id: 'a13-20-complete',
      lines: [
        ...A20_WAKE,
        N('Your Nubbin goes over to the old puppet, climbs up, and curls up in its lap, nose to tail, as if it had waited all day for a lap to come free.'),
        G('Leave it. He’d like the company. He always did.', 'soft'),
        ...A20_HOME,
      ],
    },
    rewards: [
      {
        id: 'a13-geppetto-bench',
        kind: 'decor',
        label: 'Geppetto’s workbench',
        description:
          'An old, scarred workbench that smells of pine. On it sits a little wooden Nubbin, carved as far as the ears. Nobody finishes it. It’s lovely as it is.',
      },
      {
        id: 'a13-long-table-bookmark',
        kind: 'item',
        label: 'Long Table Bookmark',
        description: 'A strip of paper drawn like a long table laid for everyone. It marks the Wooden Boy page, and counts towards the Long Table festival.',
      },
    ],
    sets: { 'a13-20': true, 'a13-done': true },
    notes:
      'CRUST (a13-crust, set at a13-20-road): given, the Cat (really blind now) thanks Pinocchio for your crust, and ' +
      'neither of you corrects him; kept, the Fox says it was the wind. CRICKET PAYOFF (a13-cricket): the step 2 scene ' +
      'shown, a13-20-hut, is for left; for carried, play A13_VARIANTS a13-20-hut-carried (“And thank your friend for ' +
      'the hedge”). CANDLEWICK: gentle and honest, like Fossil’s fading in c6-open; he knows his friend, lays his head ' +
      'in his lap and stops breathing. No close-up, no tears drawn on the donkey; the camera stays on Pinocchio. ' +
      '“It was too warm anyway” is Geppetto’s A13-5 line coming back. ENDING: the complete shown is for the page ' +
      'without Clank: your Nubbin curls up in the old puppet’s lap and Geppetto lets it stay. CLANK (s21Done): play ' +
      'A13_VARIANTS a13-20-complete-clank in place of a13-20-complete, then straight after it a13-20-word (or ' +
      'a13-20-word-next-door if s25Done is also set). Both word scenes set a13-clank-word. Lifted text 8 (the last ' +
      'line) is [unverified] and told in our own words at A20_WAKE#6. The old puppet: head on one side, arms down, ' +
      'legs crossed (Collodi’s last picture), drawn exactly as the puppet looked through the page. SIM: (a) the ' +
      'workbench is Grove decor, one-time; the half-carved Nubbin on it is part of the model. (b) The bookmark is an ' +
      'item in the atlas; the Long Table festival (A11, A13, A17, A18, A22) reads atlasDone(\'A13\').',
  },
];

// =================================================================== variants

/**
 * Variant scenes chosen by flags. Each quest's notes say which scene each replaces.
 *   s21Done (Grove, read-only): a13-01-page-clank, a13-05-coat-clank, a13-19-complete-clank,
 *     a13-20-complete-clank, then a13-20-word (or a13-20-word-next-door with s25Done as well).
 *   a13-cricket = carried (A13-3): a13-10-doctors-done-carried, a13-18-sea-carried, a13-20-hut-carried.
 *   Grove keepsakes (played in the Grove; read atlasFlag('a13-clank-word'); write nothing):
 *     a13-grove-clank-dusk, a13-grove-pixel, a13-grove-clank-idle.
 */
export const A13_VARIANTS: Scene[] = [
  // ---------------------------------------------------------------- A13-1, step 1 scene (s21Done)
  {
    id: 'a13-01-page-clank',
    lines: [
      ...A1_PAGE,
      N('The ink goes wet under your fingers, and then it is rain. You, your Nubbin and Clank are standing in a steep stone lane, getting wetter.'),
      CK('Announcement: it’s steps. It’s ALL steps. This whole country is made of steps.', 'shock'),
      N('Clank unfolds the ramp Byte made him for the trip: three hinged boards, sanded smooth, with BYTE pencilled on the underneath.'),
      CK('Unfold, roll, fold up. Byte made me practise forty times. Forty-one. The last one was for luck. Byte doesn’t believe in luck.'),
      N('One door is open, with sawdust on the step and a warm smell of pine. You go in, and Clank comes in after you, down his ramp.'),
      MC('Come in, come in, shut the weather out. Mind the shavings. And bring your… kettle. Is that a kettle?'),
      CK('Announcement: I am Clank! I am a guest! Is this a house? I love it!', 'happy'),
      ...A1_LOG,
    ],
  },
  // ---------------------------------------------------------------- A13-5, step 3 done (s21Done)
  {
    id: 'a13-05-coat-clank',
    lines: [
      ...A5_COAT,
      CK('He sold his coat. For a thing that kicked him on the nose.', 'think'),
      CK('Is that a job? Is that what a job is?'),
      Y('No. It isn’t a job.'),
      N('Clank’s chimney-light flickers, as if he has put something down somewhere safe, to look at later.'),
    ],
  },
  // ---------------------------------------------------------------- A13-10, step 2 done (carried)
  {
    id: 'a13-10-doctors-done-carried',
    lines: [
      ...A10_LEAVE,
      N('At the door he stops, turns round, and nods to you. One small, exact nod, the kind a hundred-year-old cricket doesn’t give to just anybody.'),
      N('Then he goes down the stairs, and doesn’t look back. He doesn’t need to.'),
    ],
  },
  // ---------------------------------------------------------------- A13-18, step 3 done (carried)
  {
    id: 'a13-18-sea-carried',
    lines: [
      ...A18_SEA,
      N('He passes under the rock where you are standing, treads water, and looks up at you.'),
      P('Your cricket. The one you carried out to the hedge. He was right. He said I’d grow up a donkey, and I did, all of me.', 'sad'),
      P('Don’t tell him I said so.'),
    ],
  },
  // ---------------------------------------------------------------- A13-19, complete (s21Done)
  {
    id: 'a13-19-complete-clank',
    lines: [
      N('The Tunny carries Pinocchio and Geppetto to the shore. Clank, who would sink like a kettle, rides on his back like a figurehead.'),
      ...A19_THANKS,
      N('Clank is looking at Pinocchio, his chimney-light very steady. Something inside him clicks, and clicks again.'),
      CK('He doesn’t have it either.', 'soft'),
      CK('The word. He looked, and he doesn’t have it either. Nobody put it in him.'),
      ...A19_CANDLE,
    ],
  },
  // ---------------------------------------------------------------- A13-20, step 2 scene (carried)
  {
    id: 'a13-20-hut-carried',
    lines: [
      ...A20_HUT,
      CR('And thank your friend for the hedge.', 'soft'),
      N('He says no more about it. He settles himself on his beam, and looks at you over Pinocchio’s head, and that is plenty.'),
    ],
  },
  // ---------------------------------------------------------------- A13-20, complete (s21Done)
  {
    id: 'a13-20-complete-clank',
    lines: [
      ...A20_WAKE,
      N('Clank rolls down his ramp, crosses the room, and parks beside the old puppet. He doesn’t announce it.'),
    ],
  },
  // ---------------------------------------------------------------- Clank's word (s21Done, not s25Done)
  {
    id: 'a13-20-word',
    lines: [...WORD_START, ...WORD_END, ...A20_HOME],
    set: { 'a13-clank-word': true },
  },
  // ---------------------------------------------------------------- Clank's word (s21Done and s25Done)
  {
    id: 'a13-20-word-next-door',
    lines: [
      ...WORD_START,
      CK('Moss said Real lives next door to it. I went next door. This is the house.', 'happy'),
      ...WORD_END,
      ...A20_HOME,
    ],
    set: { 'a13-clank-word': true },
  },
  // ---------------------------------------------------------------- Grove keepsake: one dusk (once)
  {
    id: 'a13-grove-clank-dusk',
    lines: [
      N('Dusk in the Grove. The Nubbins come in from the long grass one by one and climb onto Clank, because he is warm.'),
      N('One on his wheel, one on his hood like a hat. He turns his chimney-light down low for them.'),
      CK('Announcement.', 'soft'),
      CK('Love.', 'soft'),
      CK('I’m only saying it once, so it doesn’t wear out.'),
      N('He doesn’t say it again. He doesn’t need to; it’s there.'),
    ],
  },
  // ---------------------------------------------------------------- Grove keepsake: Pixel (once)
  {
    id: 'a13-grove-pixel',
    lines: [
      N('Pixel is at the lantern shed with Clank’s wick-winder nose in pieces on a cloth, giving it its spring clean.'),
      CK('Pixel. You didn’t put it in.'),
      PX('Put what in?', 'think'),
      CK('The word. The one I didn’t have.'),
      N('Pixel stops polishing. She knows which word; she has always known which word.'),
      PX('I know. I’m sorry.', 'sad'),
      CK('Don’t be. Geppetto didn’t either.', 'happy'),
      N('Pixel laughs, the way people do when they are let off something they didn’t know they were carrying, and puts his nose back on.'),
    ],
  },
  // ---------------------------------------------------------------- Grove keepsake: Clank's idle pool
  {
    id: 'a13-grove-clank-idle',
    lines: [
      CK('Announcement: I am just here.', 'soft'),
      CK('Announcement: still just here.'),
      CK('Not helping. Just here. Both are allowed.', 'happy'),
    ],
  },
];

// =================================================================== flags and checks

/** Every flag this line sets (Atlas save only). It reads s21Done and s25Done and writes no Grove flag. */
export const ATLAS_A13_FLAGS: string[] = [
  'a13-01',
  'a13-02',
  'a13-03',
  'a13-04',
  'a13-05',
  'a13-06',
  'a13-07',
  'a13-08',
  'a13-09',
  'a13-10',
  'a13-11',
  'a13-12',
  'a13-13',
  'a13-14',
  'a13-15',
  'a13-16',
  'a13-17',
  'a13-18',
  'a13-19',
  'a13-20',
  'a13-done', // A13-20: the whole page; read by atlasDone('A13') for the Long Table festival
  'a13-cricket', // carried | left (a13-03-cricket): A13-10, A13-18, A13-20
  'a13-crust', // given | kept (a13-20-road): the beggars' last beat
  'a13-clank-word', // true (a13-20-word, a13-20-word-next-door): read by S25 and the Grove keepsakes
];

export const ATLAS_A13_CHECKS: string[] = [
  'explore:a13-tuscany:workshop',
  'watch:a13-cherry:plane',
  'watch:a13-geppetto:carving',
  'walk:a13-pin:first-steps',
  'find:a13-cricket:wall',
  'choose:a13-cricket:hearth',
  'find:a13-egg:rubbish',
  'watch:a13-egg:pan',
  'walk:a13-village:storm',
  'climb:a13-window:geppetto',
  'feed:a13-pin:pears',
  'wait:a13-geppetto:snow',
  'walk:a13-pin:school-road',
  'explore:a13-theatre:canvas',
  'visit:a13-fireeater:kitchen',
  'watch:a13-pin:pleading',
  'talk:a13-fox:road',
  'visit:a13-inn:red-crawfish',
  'walk:a13-road:night',
  'race:a13-assassins:white-house',
  'watch:a13-falcon:oak',
  'wait:a13-doctors:bedside',
  'give:a13-medicine:pin',
  'inspect:a13-nose:door',
  'talk:a13-fox:oak',
  'place:a13-gold:field-of-miracles',
  'visit:a13-court:catchfools',
  'wait:a13-prison:amnesty',
  'inspect:a13-trap:vineyard',
  'watch:a13-martens:hen-house',
  'find:a13-stone:white-house',
  'walk:a13-coast-road:shore',
  'explore:a13-island:busy-bees',
  'carry:a13-water:fountain',
  'walk:a13-school:island',
  'walk:a13-beach:dogfish',
  'watch:a13-fight:beach',
  'swim:a13-alidoro:sea',
  'find:a13-pin:cave',
  'talk:a13-candlewick:road',
  'explore:a13-toys:square',
  'watch:a13-circus:ring',
  'explore:a13-dogfish:belly',
  'talk:a13-geppetto:dogfish',
  'carry:a13-candle:dogfish-mouth',
  'walk:a13-road:hut',
  'talk:a13-cricket:hut',
  'carry:a13-buckets:water-wheel',
  'give:a13-coat-money:snail',
];
