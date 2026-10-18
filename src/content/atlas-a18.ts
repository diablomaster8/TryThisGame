/**
 * Atlas campaign, page A18: The Doll in the Pocket (Part M, rank 16). Sixteen quests, A18-1 to A18-16.
 *
 * SOURCE. "Vasilisa the Fair" (Vasilisa Prekrasnaya), an East Slavic folk tale as collected by
 * Alexander Afanasyev in Narodnye russkie skazki (1855–1863). Our text follows Leonard A. Magnus's
 * English translation, Russian Folk-Tales (Kegan Paul, Trench, Trubner, London, 1915), "Vasilísa
 * the Fair". Rights: the tale is traditional, and both Afanasyev's collection and Magnus's 1915
 * translation are public domain (Magnus died in 1924). Project Gutenberg #62509 and the Standard
 * Ebooks edition carry the same text. This is Afanasyev's tale only: nothing from any film,
 * cartoon, picture book or game version, and no well-known illustrator's designs (no Bilibin
 * compositions); all art is original.
 *
 * AUDIENCE. 'all'. Every lifted line has a `childLines` replacement for the Learning Grove.
 *
 * FRAME. Nova's atlas falls open at a page painted in egg yellow and soot black: a merchant's
 * wooden house, a birch wood behind it, and a fence of pale sticks far off in the dark. You and
 * your Nubbin step in as lodgers with the merchant's family (the merchant once traded with Nova).
 * Vasilisa is the hero, and only she asks Baba Yaga for fire; you are her friend and keep her
 * secret. The atlas skips years between pages (A18-3, A18-4), and you and your Nubbin never age
 * on it, which Vasilisa notices. Running beat: your Nubbin is about the doll's size, watches the
 * doll eat with great interest, and the doll, as far as anyone can tell, watches it back. The doll
 * speaks only to Vasilisa, and only after it has eaten: it is never once fed after it helps.
 * Source characters speak; your Nubbin never does.
 *
 * GROVE FLAGS READ (read-only; the Atlas never writes a Grove flag):
 *   - s24Done: ATLAS_A18_VARIANTS 'a18-02-margin-hazel' plays once, straight after
 *     a18-02-promise-done (the "feed them first" beat in the cellar), if s24Done is set then. If
 *     S24 finishes later, it plays the first time the atlas is next open at this page. From then
 *     on Hazel's pencil note is drawn beside the cellar picture.
 *   - Sable bonded (her trust stage): ATLAS_A18_VARIANTS 'a18-16-sable' plays straight after
 *     a18-16-complete* when the atlas shuts. Sable is under the cottage table with the doll charm
 *     in her paws. She never speaks (canon 17). If she is not bonded, nothing plays.
 *
 * FLAGS WRITTEN (Atlas save only, all prefixed a18-):
 *   - a18-01 … a18-16: each quest on completion. a18-done: the whole page (A18-16); the Long
 *     Table festival and the Grove keepsakes read it through atlasDone('A18').
 *   - a18-crust = nubbin | doll | self (A18-9, a18-09-crust): THE SIGNATURE CHOICE. It picks
 *     variants in A18-10, A18-11, A18-12, A18-13, A18-15 and A18-16, which keepsake comes home,
 *     and whether the handkerchief cloth lines your Nubbin's bed in the Grove.
 *
 * LIFTED TEXT (verbatim; only the passages Part M marks as verified, from Magnus's 1915
 * translation, PG #62509, as Part M checked them against the Standard Ebooks edition of the same
 * text; set with the game's curly quotes; the stress accents in "Vasilísa" and "Vasilísushka" are
 * Magnus's and are kept inside the quotations only):
 *   1. "Vasilísushka, hear my last words. I am dying, and I will leave you my mother's blessing
 *      and this doll." The mother, a18-01-counterpane#4.
 *   2. "Keep this doll always by you, but show it to nobody, and no misfortune can befall you."
 *      The mother, a18-01-counterpane#6.
 *   3. "Vasilísa often ate nothing herself, and kept the tastiest morsels for the doll;"
 *      (a fragment, followed by our own clause) Narration, a18-02-cellar#2.
 *   4. "Dollet, eat and listen to my misery." Vasilisa, a18-02-cellar#3 and a18-06-ask#4.
 *   5. "Eat, pray, and lie down to sleep, for the morning is wiser than the evening." The doll,
 *      a18-10-night#3 (once only; see the log).
 *   6. "Ask, but not every question turns out well: too knowing is too old." Baba Yaga,
 *      a18-12-supper#3.
 *   7. "By my mother's blessing!" Vasilisa, a18-12-blessing#2; and "Ah, then, get off with you
 *      as fast as you can, blessed daughter; no one blessed may stay with me!" Baba Yaga,
 *      a18-12-blessing#4.
 *   8. "and the doll ever remained in her pocket." (a fragment, the tale's last words, set inside
 *      our own sentence) Narration, in all three a18-16-complete* scenes.
 * Magnus calls the doll "Dollet", so the doll's speaker name is Dollet. Every other line is
 * original. Phrases from the tale that Part M doesn't list (Baba Yaga's call to her servants, the
 * sisters' "go to Baba Yaga for fire", the doll's other comforts) are in our own words. Baba
 * Yaga's "Russian smell" rhyme is cut.
 *
 * CARE NOTES.
 *   - SOFTENED FOR ALL, AND WE SAY SO. In Afanasyev the skull's eyes burn the stepmother and her
 *     daughters to cinders. Here its stare drives them from the house in the night (A18-14), and
 *     they don't come back. No burning is shown, described or implied. The fence is "old bones"
 *     with skulls on the stakes; the tale's feet, hands and mouth for doorposts, bolts and lock
 *     are cut.
 *   - DEATH AND ILLNESS. The mother's death is one gentle scene (a18-01-complete), like Fossil's.
 *     The illness is never named: "not well" is all anybody says. Suggested content line before
 *     A18-1: "This page begins with a parent's death, told gently."
 *   - CULTURE. The tale is shared across East Slavic folklore, and Baba Yaga turns up in
 *     Ukrainian, Belarusian, Polish and Russian stories alike. Keep the setting a folk-tale village
 *     with birch woods, wooden houses, stoves and a Tsar of the tale: no country is named on
 *     screen, and there are no flags, state symbols, onion domes as landmarks, or political
 *     imagery. PART M ASKS FOR AN ADVISER ON EAST SLAVIC FOLKLORE BEFORE SCRIPTING: none has been
 *     consulted yet, so this draft needs that review before it is final.
 *   - FAITH. The mother's blessing and the doll's "pray" are kept brief and respectful, only where
 *     the tale has them. No icons, crosses or prayers are shown.
 *   - BABA YAGA is frightening but never cruel on screen: she threatens in hints ("we'll see what
 *     I do"), sets work, finds no fault, pays for work and keeps her word. Nobody is eaten.
 *   - Hazel's first rule ("Feed them before you feed yourself") is named twice: once when you
 *     learn the doll's rule (a18-02-promise-done) and once at the crust (a18-09-crust, nubbin).
 *     The third rule is acted (a18-01-complete, a18-04-complete, a18-14-stare) and never quoted.
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

const WHERE = 'Nova’s atlas: the Doll in the Pocket page (Atlas campaign)';
const after = (code: string) => `Any time after ${code}, from Nova’s atlas.`;
const TALE = 'Vasilisa the Fair (Afanasyev; Magnus’s translation, 1915)';

// ------------------------------------------------------------------ speakers

const VASILISA = sp('a18-vasilisa', 'Vasilisa', 'Vasilisa the Fair (Afanasyev; Magnus 1915); original design');
const MOTHER = sp('a18-mother', 'Vasilisa’s Mother', 'The merchant’s first wife, Vasilisa’s mother (Afanasyev)');
const MERCHANT = sp('a18-merchant', 'The Merchant', 'Vasilisa’s father, the merchant (Afanasyev)');
const STEPMOTHER = sp('a18-stepmother', 'The Stepmother', 'The widow the merchant marries (Afanasyev)');
const ELDER = sp('a18-elder', 'The Elder Sister', 'The stepmother’s elder daughter (Afanasyev)');
const YOUNGER = sp('a18-younger', 'The Younger Sister', 'The stepmother’s younger daughter (Afanasyev)');
const DOLLET = sp('a18-doll', 'Dollet', 'The mother’s doll, “Dollet” in Magnus’s translation; original design');
const SUITOR = sp('a18-suitor', 'A Young Man', 'One of the suitors the stepmother turns away (Afanasyev)');
const YAGA = sp('a18-yaga', 'Baba Yaga', 'Baba Yaga as she appears in “Vasilisa the Fair” (Afanasyev); original design');
const SKULL = sp('a18-skull', 'The Skull', 'The voice from the skull on the stick (Afanasyev)');
const OLDWOMAN = sp('a18-old-woman', 'The Old Woman', 'The poor old woman in town who takes Vasilisa in (Afanasyev)');
const TSAR = sp('a18-tsar', 'The Tsar', 'The Tsar of the tale (Afanasyev); no historical ruler');

const N = say('narrator');
const Y = say('you');
const V = say('a18-vasilisa');
const MO = say('a18-mother');
const MER = say('a18-merchant');
const STEP = say('a18-stepmother');
const ELD = say('a18-elder');
const YNG = say('a18-younger');
const DOLL = say('a18-doll');
const SU = say('a18-suitor');
const BY = say('a18-yaga');
const SK = say('a18-skull');
const OLD = say('a18-old-woman');
const TS = say('a18-tsar');

// ------------------------------------------------------------------ lifted text (verified)
// Magnus, Russian Folk-Tales (1915), "Vasilísa the Fair"; PG #62509, checked in Part M against the
// Standard Ebooks edition. Each has a childLines entry wherever it is used.

/** 1. The mother, A18-1. */
const LIFT_LAST =
  'Vasilísushka, hear my last words. I am dying, and I will leave you my mother’s blessing and this doll.';
/** 2. The mother, A18-1. */
const LIFT_KEEP = 'Keep this doll always by you, but show it to nobody, and no misfortune can befall you.';
/** 3. Narration, A18-2: a fragment ending in Magnus's semicolon, followed by our own clause. */
const LIFT_MORSELS = 'Vasilísa often ate nothing herself, and kept the tastiest morsels for the doll;';
/** 4. Vasilisa, A18-2 and A18-6. */
const LIFT_EAT = 'Dollet, eat and listen to my misery.';
/** 5. The doll, A18-10. */
const LIFT_SLEEP = 'Eat, pray, and lie down to sleep, for the morning is wiser than the evening.';
/** 6. Baba Yaga, A18-12. */
const LIFT_ASK = 'Ask, but not every question turns out well: too knowing is too old.';
/** 7a. Vasilisa, A18-12. */
const LIFT_BLESSING = 'By my mother’s blessing!';
/** 7b. Baba Yaga, A18-12. */
const LIFT_BEGONE =
  'Ah, then, get off with you as fast as you can, blessed daughter; no one blessed may stay with me!';
/** 8. The tale's last words, a fragment, set inside our own sentence (A18-16). */
const LIFT_POCKET = 'and the doll ever remained in her pocket.';

/** Learning Grove replacement for the last-line beat (same text in all three complete scenes). */
const CHILD_POCKET = 'The tale ends the way the old books end it: the little doll stayed in her pocket, always.';

// ------------------------------------------------------------------ shared pieces

/** A18-10, step 2: the doll's morning, before the crust paths divide. */
const A10_WORK: Line[] = [
  N('Vasilisa sleeps on, as she was told to. The doll climbs down off the bench and goes to work.'),
  N('The broom sweeps the yard with nobody holding it. The pots scrub themselves, and the linen goes into the tub grey and comes out white.'),
];

/** A18-15, step 2 done: the loom appears (all three crust paths). */
const A15_LOOM: Line = N('By morning there is a loom in the corner, small and neat, strung with Vasilisa’s thread. Nobody heard it being made.');

/** A18-16, step 2: the shirts come back from court (all three crust paths). */
const A16_COURT: Line[] = [
  N('Three days later a man from the palace knocks at the door, with the linen under his arm and a worried face.'),
  OLD('Nobody at court can sew it. The needles slide off it. The Tsar asks, whoever spun it and wove it, can she make shirts of it?'),
  V('Yes. Tell him yes.'),
];

/** A18-16 complete: the homecoming (all three crust paths). */
const A16_HOME: Line[] = [
  N('In the spring the merchant comes home over the hill, thinner and browner, with a sledge full of far-off things.'),
  MER('Married? My Vasilisa? To whom? To the… oh. Oh, my goodness.', 'shock'),
  N('She takes him to live with her, and the old woman too, who complains about the palace stairs and is very happy.'),
];

/** A18-16 complete: the doll charm, the tale's last words, and the way home (all three crust paths). */
const A16_END: Line[] = [
  N('Last of all, Vasilisa gives your Nubbin a painted doll no bigger than a thumb, in a pouch of its own on a cord.'),
  N(`The tale ends the way the old books end it: ${LIFT_POCKET}`),
  N('The page settles, and you are back in the Grove with the atlas on your knee. Your Nubbin checks its pouch twice: the small painted doll is still there.'),
];

// =================================================================== THE DOLL IN THE POCKET

export const ATLAS_A18: Quest[] = [
  // ---------------------------------------------------------------- A18-1
  {
    id: 'a18-01',
    code: 'A18-1',
    title: 'The Counterpane',
    source: `${TALE}: the mother’s blessing`,
    audience: 'all',
    trigger: { where: WHERE, when: 'Any time once Nova’s atlas is in the Grove; the first quest on the page.' },
    speakers: [MERCHANT, VASILISA, MOTHER],
    steps: [
      {
        id: 'a18-01-s1',
        goal: 'Step into the painted page and knock at the merchant’s house.',
        hint: 'Touch the page, then walk up to the wooden house with the carved shutters.',
        check: 'visit:a18-merchant:house',
        scene: {
          id: 'a18-01-house',
          lines: [
            N('Nova’s atlas falls open at a page painted in egg yellow and soot black: a wooden house, a birch wood, and far off, a fence of pale sticks.'),
            N('The paint smells of woodsmoke. Then it is woodsmoke, and you and your Nubbin are standing on a swept step with snow at its edges.'),
            N('A big man in a fur hat opens the door before you can knock, as if he has been watching the road.'),
            MER('You have the traveller’s book. The woman with the map! She sold me needles once and bought half my ribbons, and I still don’t know who won.', 'happy'),
            MER('Any friend of hers lodges here. There’s a room over the stable, and it’s warm, because the horse is.'),
            N('Behind him the house is very quiet. Somebody is keeping it quiet on purpose.'),
            MER('My wife is not well. We walk softly. You’ll walk softly too, I think.', 'sad'),
            N('A girl of eight looks round his knee. She has a plait to her waist, and she looks at your Nubbin the way you would look at a cake.'),
            V('What is it? Is it a doll? Does it eat?'),
          ],
          choices: [
            {
              id: 'eats',
              label: 'Tell her it’s a Nubbin, and it eats everything.',
              then: [
                V('Everything? Even porridge? Even the burnt bit?', 'happy'),
                N('Your Nubbin looks at her as if the burnt bit is the best bit, which it is.'),
              ],
            },
            {
              id: 'itself',
              label: 'Let your Nubbin answer for itself.',
              then: [N('Your Nubbin walks up to the girl and sits on her shoe. She goes very still, the way you do when a bird lands near you.')],
            },
            {
              id: 'name',
              label: 'Ask her name first.',
              then: [V('You’re supposed to say yours first. That’s manners. But I’ll tell you anyway, because you asked nicely.', 'think')],
            },
          ],
        },
        done: {
          id: 'a18-01-house-done',
          lines: [
            V('I’m Vasilisa. Mother says I’m to be polite to lodgers, so I will be. Mostly.'),
            MER('Go and wash your hands, Vasilisa. Your mother may want you later.', 'soft'),
            N('She goes, but slowly, looking back at your Nubbin all the way up the stairs.'),
          ],
        },
      },
      {
        id: 'a18-01-s2',
        goal: 'Walk Vasilisa to her mother’s door, and wait there.',
        hint: 'Stand at the bedroom door with your Nubbin. Don’t go in.',
        check: 'wait:a18-mother:door',
        scene: {
          id: 'a18-01-counterpane',
          lines: [
            N('That evening a voice at the end of the passage calls Vasilisa’s name. It is a quiet voice, and the whole house hears it.'),
            V('Will you come? Only to the door. I don’t like the passage when it’s dark.'),
            N('You walk her to the door with your Nubbin, and stop there. The room is warm and dim, and smells of beeswax.'),
            N('Her mother sits up against the pillows, under a counterpane sewn from a hundred bright scraps.'),
            MO(LIFT_LAST, 'soft'),
            N('From under the counterpane she takes a little doll, no longer than your hand, with a painted face and a scrap of red for a scarf.'),
            MO(LIFT_KEEP),
            MO('And listen. When you’re in trouble, give her something to eat first, and then ask her. She will tell you what to do.'),
            V('Something to eat first. Then ask. And show nobody.', 'think'),
            MO('Nobody. Good girl.', 'soft'),
            N('Her mother looks past her, to the door, to you. She doesn’t send you away.'),
          ],
          choices: [
            {
              id: 'stay',
              label: 'Stay where you are, by the door.',
              then: [N('You stay. Your Nubbin sits on your foot and does not fidget, for once.')],
            },
            {
              id: 'step',
              label: 'Step back into the passage, to give them the room.',
              then: [N('You step back. Through the gap you see her mother lift a hand and lay it on Vasilisa’s head, and leave it there.')],
            },
            {
              id: 'nod',
              label: 'Nod to her: you’ll look after the girl.',
              then: [MO('Thank you. She will need a friend who can keep quiet.', 'soft')],
            },
          ],
        },
        done: {
          id: 'a18-01-counterpane-done',
          lines: [
            N('Vasilisa comes out with both hands under her apron, holding something very carefully.'),
            V('I’m not to show you. So I’m not showing you.', 'sad'),
            N('She walks back down the passage with her hands still under her apron, and doesn’t let go.'),
          ],
        },
      },
    ],
    complete: {
      id: 'a18-01-complete',
      lines: [
        N('In the night the house goes quieter than quiet. Nobody needs to tell you why.'),
        N('In the morning the merchant sits at the kitchen table with his hat in his hands, turning it round and round.'),
        N('Vasilisa sits on the bottom stair, wrapped in her mother’s counterpane. Somebody has put it round her.'),
        N('You don’t know what to say, so you don’t say anything. You sit down on the stair beside her.'),
        N('After a while your Nubbin climbs up between you, and sits too.'),
        V('She said I’m to be good and not cry too much. I think I’m crying the right amount.', 'sad'),
        Y('I think so too.'),
        N('Under the counterpane, her hand is closed round something small. She holds on to it all day.'),
      ],
    },
    rewards: [],
    sets: { 'a18-01': true },
    childLines: {
      'a18-01-counterpane#4': 'Vasilisa, my darling, listen to me. I have to go away soon, and I am leaving you my love and this little doll.',
      'a18-01-counterpane#6': 'Keep her with you always, and keep her a secret, and she will help you when things are hard.',
    },
    notes:
      'OPENING: the page is painted in egg yellow and soot black (folk-painting colours, our own designs; no Bilibin) and ' +
      'warms into full colour as you step through. Suggested soft content line before this quest: "This page begins with ' +
      'a parent’s death, told gently." The mother’s death is never shown: the complete scene is the next morning. Nothing ' +
      'about her illness is named. The doll is about your Nubbin’s size: a painted wooden face, a cloth body, a red scrap ' +
      'scarf. From here on it is never seen by anyone but Vasilisa and you.',
  },

  // ---------------------------------------------------------------- A18-2
  {
    id: 'a18-02',
    code: 'A18-2',
    title: 'Dollet, Eat',
    source: `${TALE}: the doll is fed`,
    audience: 'all',
    trigger: { where: WHERE, when: after('A18-1') },
    requires: ['A18-1'],
    speakers: [MERCHANT, VASILISA, DOLLET],
    steps: [
      {
        id: 'a18-02-s1',
        goal: 'Follow Vasilisa down to the cellar with a candle.',
        hint: 'Take the candle from the kitchen shelf and go down after her.',
        check: 'find:a18-vasilisa:cellar',
        scene: {
          id: 'a18-02-supper',
          lines: [
            N('The days after are grey and quiet. People come with pies, stand in the kitchen, and go away again.'),
            N('At supper Vasilisa eats almost nothing. The best bits go off her plate and into her apron: the crust, the egg, the honey cake.'),
            MER('Eat, little one. You’re getting thin.', 'sad'),
            V('I am eating, Father. Look.', 'think'),
            N('She chews a bit of turnip very hard, for him to see. Then she slips off her bench and out of the room.'),
            N('Your Nubbin looks at you. It has noticed the honey cake too.'),
          ],
          choices: [
            {
              id: 'follow',
              label: 'Take the candle and follow her.',
              then: [N('The cellar door is open a crack. Below there is no light at all, and a very small voice.')],
            },
            {
              id: 'finish',
              label: 'Finish your supper first, then follow.',
              then: [
                N('You finish, because you are hungry, and take the candle down after her.'),
                N('She hasn’t got far. She was waiting in the dark for somebody with a light.'),
              ],
            },
          ],
        },
        done: {
          id: 'a18-02-supper-done',
          lines: [
            V('Oh. It’s you. Shut the door. Properly, it sticks.'),
            N('You shut it properly. It does stick, like a gate you know, a long way from here.'),
          ],
        },
      },
      {
        id: 'a18-02-s2',
        goal: 'Hold the light while Vasilisa feeds the doll, and keep still.',
        hint: 'Keep the candle steady and don’t speak.',
        check: 'watch:a18-doll:cellar',
        scene: {
          id: 'a18-02-cellar',
          lines: [
            N('Vasilisa kneels on an upturned tub between the potatoes and the pickle crocks. She sets the doll on the tub, facing her.'),
            N('Out of her apron come the crust, the egg and the honey cake. She lays them in front of the doll in a careful row.'),
            N(`${LIFT_MORSELS} tonight is the first night you see it.`),
            V(LIFT_EAT, 'sad'),
            V('Mother’s gone and Father’s sad and everybody brings pies. I don’t want pies. I want to know what to do.', 'sad'),
            N('For a moment nothing happens. Then the doll’s painted eyes begin to shine, like two drops of lamp oil with a light behind them.'),
            N('The crust is gone, and the egg. Your Nubbin leans forward to see where the honey cake went, and it is gone too.'),
            DOLL('Don’t be afraid, Vasilisa. Grief is heavy, but you don’t carry it on your own. Go up and sleep.', 'soft'),
            DOLL('Tomorrow you will be a little lighter, and the day after, a little more.'),
            N('Your Nubbin is staring at the doll. The doll, as far as anyone can tell, is staring back.'),
            V('She ate. She always eats. Mother said she would.', 'happy'),
          ],
          choices: [
            {
              id: 'still',
              label: 'Keep the candle very still.',
              then: [N('The flame doesn’t even lean. Vasilisa notices, and gives you the smallest nod.')],
            },
            {
              id: 'closer',
              label: 'Let your Nubbin go closer.',
              then: [N('Your Nubbin creeps up to the tub and sniffs the doll. The doll doesn’t move, and somehow it is clear that it allows this.')],
            },
          ],
        },
        done: {
          id: 'a18-02-cellar-done',
          lines: [
            V('She won’t help on an empty stomach. Mother said so.'),
            V('Nobody should have to.', 'soft'),
          ],
        },
      },
      {
        id: 'a18-02-s3',
        goal: 'Learn how to set the food out, and make Vasilisa a promise.',
        hint: 'Lay the morsels in a row in front of the doll, then answer Vasilisa.',
        check: 'place:a18-morsels:cellar',
        scene: {
          id: 'a18-02-promise',
          lines: [
            V('You saw. So now you have to learn it properly, in case I’m ever ill, or away, or I forget.'),
            V('The best bits. Not the leftovers. The best bits, and first, before I have mine.'),
            V('In a row, so she can see them all. Then you say the words, and you wait. You mustn’t poke her.'),
            N('She shows you twice. Your Nubbin watches as if there will be a test, which there may be.'),
            V('Now you have to promise. Never tell. Not Father, not anybody. Mother said show nobody.', 'think'),
            V('You’re not nobody, you’re the lodger. That’s different. I’ve decided.'),
          ],
          choices: [
            {
              id: 'promise',
              label: 'Promise. Never, not anybody.',
              then: [V('Good. Shake.'), N('Her hand is very small and very serious.')],
            },
            {
              id: 'cross',
              label: 'Cross your heart, and your Nubbin’s too.',
              then: [N('You cross your heart, then your Nubbin’s, which tickles it. Vasilisa decides this counts double.')],
            },
            {
              id: 'why',
              label: 'Ask why it has to be a secret.',
              then: [
                V('Because people would want her. People always want things that help.', 'think'),
                V('And because Mother said so. That’s two reasons. Promise.'),
                N('You promise.'),
              ],
            },
          ],
        },
        done: {
          id: 'a18-02-promise-done',
          lines: [
            N('Climbing the cellar steps, you think of a rule you know. It is in your gran’s handwriting, the first of three.'),
            N('Feed them before you feed yourself.', 'soft'),
          ],
        },
      },
    ],
    complete: {
      id: 'a18-02-complete',
      lines: [
        N('After that, the best bits of Vasilisa’s supper always go missing. Her father worries that she’s thin.'),
        N('She is, a little. But she sleeps, and in the mornings she sings while she plaits her hair.'),
        N('Some nights she sends you down instead, with a bundle in a napkin. You lay it out in a row, the way she showed you.'),
        N('You say her words, and wait, and don’t poke. The doll’s eyes shine, and the food is gone.'),
        N('It never says a word to you. It only ever speaks to her.'),
        N('Your Nubbin, on the way back up, looks hopefully into the empty napkin every single time.'),
      ],
    },
    rewards: [],
    sets: { 'a18-02': true },
    childLines: {
      'a18-02-cellar#2': 'Vasilisa often saved the best bits of her own supper for the doll, and tonight is the first night you see it.',
      'a18-02-cellar#3': 'Little doll, here is your supper. Please eat, and listen, because I am very sad.',
    },
    notes:
      'The doll eats off screen between two cuts: the food is there, the eyes shine, the food is gone. It never chews on ' +
      'camera. Its eyes glow warm amber, never red. The doll speaks only to Vasilisa, and only after eating (the page’s ' +
      'rule throughout). a18-02-promise-done names Hazel’s first rule; a18-02-complete#3 has the Keeper say "her words" ' +
      'without repeating the lifted line. ' +
      'HAZEL’S MARGIN NOTE (s24Done, read-only): play ATLAS_A18_VARIANTS a18-02-margin-hazel straight after ' +
      'a18-02-promise-done if s24Done is set; if S24 finishes later, play it the first time the atlas is next opened at this ' +
      'page. After that, the pencil note is drawn in the margin beside the cellar picture.',
  },

  // ---------------------------------------------------------------- A18-3
  {
    id: 'a18-03',
    code: 'A18-3',
    title: 'The Widow',
    source: `${TALE}: the stepmother`,
    audience: 'all',
    trigger: { where: WHERE, when: after('A18-2') },
    requires: ['A18-2'],
    speakers: [MERCHANT, VASILISA, STEPMOTHER, ELDER, YOUNGER],
    steps: [
      {
        id: 'a18-03-s1',
        goal: 'Meet the merchant’s new wife and her daughters.',
        hint: 'Wait in the yard when the cart comes in at the gate.',
        check: 'talk:a18-stepmother:yard',
        scene: {
          id: 'a18-03-cart',
          lines: [
            N('The atlas turns a page by itself. When you step back in, it is spring, and the birches have their small green coins on.'),
            MER('A house wants a mistress, and a girl wants a mother. I’ve found a widow, with two daughters near Vasilisa’s age.', 'think'),
            MER('She seemed a kind woman. Mostly she seemed a woman with a lot of trunks.'),
            N('A cart turns in at the gate, piled with trunks. On top sit three people in good shawls, looking at the house as if pricing it.'),
            STEP('So this is the house. And this is the girl.'),
            N('The stepmother looks Vasilisa up and down. Her daughters do the same, one after the other, like an echo.'),
            ELD('She’s very pretty.', 'angry'),
            YNG('Too pretty. It isn’t fair.', 'angry'),
            STEP('Pretty fades, my loves. Sun and wind and work see to that, and there’s a great deal of work in a house like this.'),
            N('Vasilisa curtsies and says nothing, with one hand in her apron pocket.'),
          ],
          choices: [
            {
              id: 'carry',
              label: 'Offer to carry a trunk.',
              then: [
                STEP('The lodger. Yes. You may carry all of them.'),
                N('You carry all of them. Your Nubbin carries a hatbox, very seriously, with its eyes shut.'),
              ],
            },
            {
              id: 'beside',
              label: 'Stand beside Vasilisa and say nothing.',
              then: [N('You stand beside her. The stepmother’s eyes rest on you a moment and move on, the way you would look past a chair.')],
            },
          ],
        },
        done: {
          id: 'a18-03-cart-done',
          lines: [
            STEP('Vasilisa will see to the garden, the water, the stove and the floors. A girl should be useful.'),
            ELD('And we’ll see to the sitting down.', 'happy'),
            N('Vasilisa curtsies again. In her pocket, something small is very still.'),
          ],
        },
      },
      {
        id: 'a18-03-s2',
        goal: 'Get up before dawn and see how the work is getting done.',
        hint: 'Go out to the garden before anyone else is up.',
        check: 'watch:a18-doll:garden',
        scene: {
          id: 'a18-03-dawn',
          lines: [
            N('Before dawn you hear the cellar door. You go down to the garden with your Nubbin, in your socks.'),
            N('Vasilisa is sitting in the shade of the apple tree, making a crown of dandelions.'),
            N('The beds are weeded and the water butts are full.'),
            N('Smoke is already rising from the kitchen chimney, and the stove inside is hot.'),
            V('Shh. She did it. I fed her last night and asked her, and she said go to sleep. So I did.', 'happy'),
            N('In the cabbage bed you find the doll, no taller than a weed, pulling up the last dandelion with both arms.'),
            N('Your Nubbin rushes to help and grabs the dandelion too, and the doll lets it.'),
            N('They fall over backwards together, and the dandelion comes out.'),
            V('She’s made me a salve as well, for the sun. Out of something. I don’t ask what.'),
            N('Vasilisa puts her dandelion crown on your Nubbin and the doll back in her pocket, and the morning starts.'),
          ],
        },
        done: {
          id: 'a18-03-dawn-done',
          lines: [V('Now I have to look tired. Can you look tired? I can’t. I’ve been asleep.', 'think')],
        },
      },
      {
        id: 'a18-03-s3',
        goal: 'Help Vasilisa look busy when her stepmother comes round.',
        hint: 'When the back door opens, give Vasilisa something to be doing.',
        check: 'puzzle:a18-busy:yard',
        scene: {
          id: 'a18-03-busy',
          lines: [
            N('The back door bangs. The stepmother comes out on to the step, a daughter on each side, to see how thin and brown Vasilisa has got.'),
            STEP('Well? Is the garden done? Is the water in? I don’t suppose it is.'),
            N('Vasilisa is holding a dandelion crown and nothing else. She looks at you, very fast.'),
            ELD('She’s been picking flowers! I can tell. She’s got pollen on her nose.', 'angry'),
            STEP('Where is your hoe, girl? Where is your bucket?', 'angry'),
            N('You have about a second.'),
          ],
          choices: [
            {
              id: 'bucket',
              label: 'Hand her an empty bucket.',
              then: [
                N('She takes it and swings it as if it were full and heavy. It is a very good performance.'),
                STEP('Hm. Well. Carry on, then.'),
              ],
            },
            {
              id: 'splash',
              label: 'Tip the dipper from the water butt over her apron.',
              then: [
                N('Splash. She looks soaked and hard done by, which is perfect.'),
                YNG('She’s all wet! Ha!', 'happy'),
                STEP('Hush. She looks… well, actually. How does she look so well?', 'angry'),
              ],
            },
            {
              id: 'weed',
              label: 'Get your Nubbin to stand very still, like a weed.',
              then: [
                N('Your Nubbin stands stock still in the cabbage bed, still wearing the dandelion crown.'),
                N('The stepmother walks right past it and never sees it. You are very proud of it.'),
              ],
            },
          ],
        },
        done: {
          id: 'a18-03-busy-done',
          lines: [
            N('The stepmother walks round the whole garden and finds nothing wrong with it. This makes her crosser than anything could.'),
            STEP('Sun and wind. Every day. We shall see.', 'angry'),
          ],
        },
      },
    ],
    complete: {
      id: 'a18-03-complete',
      lines: [
        N('Spring turns into summer. Every morning the work is done, and every evening the best bits go down to the cellar.'),
        N('The stepmother’s daughters sit in the shade and grow sour and pale from all the sitting.'),
        N('Vasilisa works in the sun, or seems to, and grows browner and stronger and lovelier every week.'),
        ELD('It isn’t fair. She works and works and gets prettier. We sit and sit and get worse.', 'angry'),
        N('Your Nubbin, who naps in the cabbage bed on the doll’s working mornings, has never looked better either.'),
      ],
    },
    rewards: [],
    sets: { 'a18-03': true },
    notes:
      'The page turn at the start is the atlas skipping time (a soft riffle of pages, the season changing). The doll ' +
      'working is shown in quick vignettes, never with tools bigger than itself except the dandelion. ' +
      'puzzle:a18-busy:yard is a short timing puzzle: when the back door opens, put the right prop in Vasilisa’s hands ' +
      '(bucket, wet apron or a disguised Nubbin); any of the three passes, and it can’t be failed.',
  },

  // ---------------------------------------------------------------- A18-4
  {
    id: 'a18-04',
    code: 'A18-4',
    title: 'Suitors',
    source: `${TALE}: the suitors turned away`,
    audience: 'all',
    trigger: { where: WHERE, when: after('A18-3') },
    requires: ['A18-3'],
    speakers: [VASILISA, STEPMOTHER, ELDER, YOUNGER, SUITOR],
    steps: [
      {
        id: 'a18-04-s1',
        goal: 'Step back into the page, some years on.',
        hint: 'Turn the atlas page and walk up the path to the merchant’s gate.',
        check: 'walk:a18-page:years',
        scene: {
          id: 'a18-04-years',
          lines: [
            N('The atlas turns several pages at once, with a sound like a flock of birds getting up.'),
            N('When you step in, the birches by the house are twice as tall. The apple tree has a swing on it, too small now for anyone.'),
            N('Vasilisa comes down the path. She is grown: taller than you, her plait wound round her head, a basket on her arm.'),
            V('You! You haven’t changed at all. Not a hair. And neither has it.', 'shock'),
            N('Your Nubbin walks round her twice, puzzled, as if she were a tree it used to know as a sapling.'),
            V('I’m glad. Everything else changes. It’s nice when something doesn’t.', 'soft'),
            V('Stay a while? There’s been a lot of knocking at the gate lately, and I’d like somebody sensible about.'),
          ],
          choices: [
            {
              id: 'knocking',
              label: 'Ask who’s been knocking.',
              then: [V('Young men. For me. Not for my sisters. You can imagine how that’s going.', 'think')],
            },
            {
              id: 'pocket',
              label: 'Ask, very quietly, about her pocket.',
              then: [
                V('Still there. Still eats better than I do. She says hello.'),
                N('The doll has said no such thing. Vasilisa is being kind to your Nubbin.'),
              ],
            },
          ],
        },
        done: {
          id: 'a18-04-years-done',
          lines: [N('Behind her, down at the gate, somebody is already knocking.')],
        },
      },
      {
        id: 'a18-04-s2',
        goal: 'See what the stepmother says to the young men at the gate.',
        hint: 'Stand near the gate and listen.',
        check: 'watch:a18-stepmother:gate',
        scene: {
          id: 'a18-04-gate',
          lines: [
            N('At the gate stands a young man in a clean shirt, holding his hat. There is another behind him, and another coming up the lane.'),
            STEP('Who is it for? Not for my girls?', 'angry'),
            N('The first young man goes pink and says Vasilisa’s name.'),
            STEP('Then go home. The youngest doesn’t marry before the elders. That is the custom in this house.'),
            STEP('Come back when you have something to say to my daughters.'),
            N('He goes. The second one doesn’t get his name out before the gate swings shut on him.'),
            ELD('Nobody comes for us. Not one. It’s her face.', 'sad'),
            YNG('It’s her fault for having it.', 'angry'),
            N('Upstairs, a window closes very quietly. Vasilisa doesn’t come down until they have all gone.'),
          ],
        },
        done: {
          id: 'a18-04-gate-done',
          lines: [STEP('Lodger. You’ll keep that gate tomorrow. Nobody comes in for her. Do you understand me?', 'angry')],
        },
      },
      {
        id: 'a18-04-s3',
        goal: 'Hold the gate for the last young man, and see him go.',
        hint: 'Open the gate when he knocks. You can’t let him in.',
        check: 'wait:a18-suitor:gate',
        scene: {
          id: 'a18-04-last',
          lines: [
            N('The next evening one more comes. He is younger than the others, with mended sleeves and a bunch of cornflowers.'),
            SU('Is she in? I’ve walked from the mill. I don’t want anything. I only wanted to ask her.'),
            N('Behind you the stepmother is at the window. Above her, at another window, so is Vasilisa.'),
            SU('I suppose it’s no. I suppose it was always going to be no.', 'sad'),
            N('Your Nubbin takes hold of the gate with both paws, as if that will help somebody. It isn’t clear who.'),
            N('The hinge creaks. It is the kind of creak that tells a house when somebody leaves, and when they come back.'),
          ],
          choices: [
            {
              id: 'flowers',
              label: 'Tell him she’d like the cornflowers.',
              then: [
                SU('Would she? Then give them to her. Don’t say who. She’ll guess, or she won’t.', 'soft'),
                N('He goes off down the lane lighter than he came.'),
              ],
            },
            {
              id: 'hold',
              label: 'Say nothing. Just hold the gate while he goes.',
              then: [N('He nods to you as if you were a friend, and walks off down the lane without looking back.')],
            },
            {
              id: 'market',
              label: 'Whisper that the stepmother goes to market on Thursdays.',
              then: [
                N('He grins. Behind you, the window bangs open.'),
                STEP('I heard that!', 'angry'),
                N('He runs. Your Nubbin runs a little way after him, out of sympathy.'),
              ],
            },
          ],
        },
        done: {
          id: 'a18-04-last-done',
          lines: [N('Later, at the cellar door, Vasilisa thanks you for minding the gate. She doesn’t say which part she means.')],
        },
      },
    ],
    complete: {
      id: 'a18-04-complete',
      lines: [
        N('That winter the knocking stops. Word has got round the lanes.'),
        STEP('That girl is a curse on this house. While she’s in it, my daughters are nobody.', 'angry'),
        N('She says it to the stove, but loudly enough for the whole kitchen.'),
        N('In the cellar that night, Vasilisa feeds the doll and asks it nothing at all. She only sits with it.'),
        N('You sit on the step above, with your Nubbin, and nobody says a word. That seems to be what everybody needed.'),
      ],
    },
    rewards: [],
    sets: { 'a18-04': true },
    notes:
      'The multi-page riffle at the start shows years passing (Vasilisa from eight to grown). You and your Nubbin are ' +
      'unchanged, and she notices once. The gate’s creak should echo the Grove gate’s sound, a little higher. The three ' +
      'suitors are walk-ons; only the last one speaks. No flags from this choice.',
  },

  // ---------------------------------------------------------------- A18-5
  {
    id: 'a18-05',
    code: 'A18-5',
    title: 'The House by the Forest',
    source: `${TALE}: the move to the forest’s edge`,
    audience: 'all',
    trigger: { where: WHERE, when: after('A18-4') },
    requires: ['A18-4'],
    speakers: [MERCHANT, VASILISA, STEPMOTHER, ELDER, YOUNGER],
    steps: [
      {
        id: 'a18-05-s1',
        goal: 'Say goodbye to the merchant at his sledge.',
        hint: 'Meet him by the loaded sledge in the yard.',
        check: 'talk:a18-merchant:sledge',
        scene: {
          id: 'a18-05-journey',
          lines: [
            N('The merchant’s sledge stands in the yard, loaded with bales. Two horses breathe steam at each other.'),
            MER('A long road this time. Far trade, far towns. Months, maybe more.', 'think'),
            MER('The house is in my wife’s hands. Vasilisa is in hers too. And a little in yours, lodger, if you don’t mind it.'),
            N('He doesn’t say what he means by that. He looks up at the window where his wife is standing, and then at you.'),
            MER('If you see the woman with the map, tell her I still don’t know who won.', 'happy'),
            V('Bring me back something small, Father. Something for my pocket.'),
            MER('Something small for your pocket. I’ll remember.', 'soft'),
          ],
          choices: [
            {
              id: 'promise',
              label: 'Promise to look after her.',
              then: [MER('Good. I believe you. You have the face of somebody who keeps things.', 'soft')],
            },
            {
              id: 'when',
              label: 'Ask when he’ll be back.',
              then: [MER('When the roads let me. Spring, if they’re kind. Or the one after.', 'sad')],
            },
          ],
        },
        done: {
          id: 'a18-05-journey-done',
          lines: [N('The sledge goes out of the gate and down the lane, and the gate creaks behind it.')],
        },
      },
      {
        id: 'a18-05-s2',
        goal: 'Help carry the household to the new house at the forest’s edge.',
        hint: 'Load the cart, then walk beside it to the house by the birch wood.',
        check: 'carry:a18-bundles:forest-house',
        scene: {
          id: 'a18-05-move',
          lines: [
            N('The merchant is hardly over the hill before the stepmother sells the house, to a man with a great many rings.'),
            STEP('Too big for us. Too dear. We’ll be snug at the edge of the wood.', 'happy'),
            N('Everything goes on one cart: the trunks, the crocks, the counterpane, and you on top with your Nubbin in your lap.'),
            N('The new house stands where the lane gives up. Behind it the birch wood begins: white trunks, then grey, then nothing you can see.'),
            ELD('Everybody says there’s a hut in there. With a fence.', 'shock'),
            YNG('Everybody says somebody lives in it. Somebody who… well. Somebody.'),
            STEP('Hush, both of you. It’s only stories.', 'think'),
            N('She says it looking straight at Vasilisa, as if measuring the distance from the door to the trees.'),
          ],
        },
        done: {
          id: 'a18-05-move-done',
          lines: [N('Vasilisa unpacks the counterpane last and puts it on her own bed. Her hand goes to her pocket, and stays there.')],
        },
      },
      {
        id: 'a18-05-s3',
        goal: 'Go into the birch wood with Vasilisa on an errand, and learn the path.',
        hint: 'Follow her into the trees and watch which way she turns.',
        check: 'walk:a18-path:birch-wood',
        scene: {
          id: 'a18-05-errand',
          lines: [
            STEP('Vasilisa. We need bark for the stove, and mushrooms. The best ones are deep in. Very deep in.'),
            N('Vasilisa takes her basket. Before she goes she slips down to the cellar, and comes up again with an empty napkin.'),
            V('Come with me, this once? Then you’ll know the way, if ever I need you to.'),
            N('In the wood every birch looks like every other birch. The light is white, and the moss swallows your footsteps.'),
            N('Every so often Vasilisa stops and puts a hand in her pocket. Then she turns left, or right, without a moment’s doubt.'),
            V('She tells me. Only when she’s eaten. Never on an empty stomach.'),
            N('Far off between the trunks, for one moment, you see a fence of pale sticks with round pale things on top. Then a birch is in the way.'),
          ],
          choices: [
            {
              id: 'look',
              label: 'Stop and look harder at the fence.',
              then: [
                V('Don’t. Not today. We’re here for mushrooms.'),
                N('She takes your sleeve and turns you round, gently, the way you would turn a horse.'),
              ],
            },
            {
              id: 'notch',
              label: 'Notch a birch so you’ll know the way.',
              then: [N('You notch three trunks with your thumbnail. Your Nubbin notches a fourth with its teeth, which is less tidy.')],
            },
            {
              id: 'mushroom',
              label: 'Pick mushrooms, and don’t think about it.',
              then: [
                N('You pick mushrooms. Your Nubbin picks one too and eats it, which is a different thing.'),
                V('Not that one! Oh. No, it’s all right. That one’s all right.', 'shock'),
              ],
            },
          ],
        },
        done: {
          id: 'a18-05-errand-done',
          lines: [N('The doll brings you both home by dusk with a full basket. The stepmother, at the window, doesn’t look pleased to see you.')],
        },
      },
    ],
    complete: {
      id: 'a18-05-complete',
      lines: [
        N('It goes on like that all summer. Vasilisa is sent into the wood for bark, for berries, for nothing much.'),
        N('Every time, she feeds the doll first. Every time, she comes home.'),
        STEP('That girl has more luck than sense.', 'angry'),
        ELD('Or something in her pocket.', 'think'),
        N('Vasilisa goes very still. Then she laughs, and pulls out a handkerchief to show them, and they lose interest.'),
        N('That night she asks you to keep the cellar door. You sit on the step till morning, with your Nubbin asleep on your knees.'),
      ],
    },
    rewards: [],
    sets: { 'a18-05': true },
    notes:
      'The fence glimpse in the errand scene is far off and blurred: pale sticks, pale round shapes, no detail. The birch ' +
      'wood is pale, quiet and beautiful by day, never sinister. The merchant’s "something for your pocket" pays off in ' +
      'A18-16 (a silver thimble she keeps in her other pocket).',
  },

  // ---------------------------------------------------------------- A18-6
  {
    id: 'a18-06',
    code: 'A18-6',
    title: 'One Candle',
    source: `${TALE}: the candle goes out`,
    audience: 'all',
    trigger: { where: WHERE, when: after('A18-5') },
    requires: ['A18-5'],
    speakers: [VASILISA, STEPMOTHER, ELDER, YOUNGER, DOLLET],
    steps: [
      {
        id: 'a18-06-s1',
        goal: 'Sit with the family for an evening of work by one candle.',
        hint: 'Take your place at the table, near the candle.',
        check: 'sit:a18-candle:table',
        scene: {
          id: 'a18-06-evening',
          lines: [
            N('An autumn evening, with the wind getting up. Rain needles the window.'),
            STEP('Work, all of you. Lace for you, my love. A stocking for you. Vasilisa, spin.'),
            N('She goes round the house putting out every fire: the lamp, the rushlight, even the stove, banked down to grey.'),
            STEP('One candle is enough. We’re not made of money.'),
            N('So there is one candle on the table, four people working round it, and you, and your Nubbin, which keeps trying to sit on the warm bit.'),
            N('Vasilisa’s spindle turns and turns. Her thread comes out thin and even, finer than anyone’s.'),
          ],
          choices: [
            {
              id: 'wool',
              label: 'Hold the wool for the younger sister.',
              then: [
                YNG('Higher. No, lower. No… oh. Just like that. Thank you.', 'soft'),
                N('For a moment she nearly smiles at you. Then she remembers she is cross.'),
              ],
            },
            {
              id: 'candle',
              label: 'Keep your Nubbin off the candle.',
              then: [N('You lift your Nubbin off the table three times. The fourth time you just hold it, and it watches the flame from your lap.')],
            },
          ],
        },
        done: {
          id: 'a18-06-evening-done',
          lines: [N('The elder sister looks at the candle, and then at her mother. Her mother nods, very slightly.')],
        },
      },
      {
        id: 'a18-06-s2',
        goal: 'See what happens to the candle.',
        hint: 'Stay at the table. It is about to go dark.',
        check: 'watch:a18-wick:table',
        scene: {
          id: 'a18-06-wick',
          lines: [
            ELD('This wick wants trimming. It’s smoking.'),
            N('She reaches out with the scissors and snips, and the flame goes out. All of it, every bit of light in the house.'),
            ELD('Oh! Oh dear. By accident.', 'shock'),
            N('In the dark, your Nubbin climbs straight up your front and into your coat.'),
            STEP('Now what? No fire in the house, and the stove gone out. We must have light.'),
            YNG('Well, I’m not going. I can see by my pins.'),
            ELD('And I can see by my needles. I’m not going either.'),
            ELD('Vasilisa can fetch it. Into the wood with you, to Baba Yaga, and ask her for fire!', 'angry'),
            N('Both sisters push her out of the room into the dark, as if it had been her idea.'),
          ],
        },
        done: {
          id: 'a18-06-wick-done',
          lines: [V('Wait for me at the cellar door. I have to ask somebody first.', 'soft')],
        },
      },
      {
        id: 'a18-06-s3',
        goal: 'Set out the doll’s supper in the dark, the way Vasilisa taught you.',
        hint: 'Feel for the napkin and lay the morsels in a row, then wait.',
        check: 'feed:a18-doll:cellar',
        scene: {
          id: 'a18-06-ask',
          lines: [
            N('There is no light in the cellar, only the shape of her kneeling, and the rustle of a napkin.'),
            V('My hands are shaking. You do it. You know how.', 'sad'),
            N('So you lay the morsels out by feel, in a row, the way she showed you years ago. The best bits, and all of her supper.'),
            N('Your Nubbin’s nose comes out of your coat to check the row is straight. It is.'),
            V(LIFT_EAT, 'sad'),
            V('They’re sending me to Baba Yaga for fire. Everybody says nobody comes back from her. What do I do?'),
            N('In the dark, two small lights come on. The supper goes, crumb by crumb.'),
            DOLL('Don’t be afraid. Go where they send you. Keep me in your pocket, and nothing bad will come to you there.', 'soft'),
            V('In my pocket. All right.'),
            N('She stands, and you hear her put the doll away, and button the pocket over it.'),
          ],
          choices: [
            {
              id: 'coming',
              label: 'Tell her you’re coming too.',
              then: [V('I hoped you would. I wasn’t going to ask.', 'soft')],
            },
            {
              id: 'coat',
              label: 'Put your scarf round her neck.',
              then: [V('Then you’ll be cold.'), Y('I’ve got a Nubbin down my front. I’ll be fine.')],
            },
            {
              id: 'nubbin',
              label: 'Let your Nubbin decide.',
              then: [N('Your Nubbin climbs down, crosses the dark cellar and sits on Vasilisa’s foot, facing the door. That settles it.')],
            },
          ],
        },
        done: {
          id: 'a18-06-ask-done',
          lines: [N('Up the steps, through the dark kitchen, past three people who don’t say goodbye.')],
        },
      },
    ],
    complete: {
      id: 'a18-06-complete',
      lines: [
        N('Nobody brings a light to see you off. The back gate shuts behind you on its own.'),
        N('The birches are white even in the dark, like a crowd of people who have stopped talking.'),
        V('I know the way. She’ll tell me if I don’t.', 'think'),
        N('Your Nubbin rides inside your coat with only its eyes out. In Vasilisa’s pocket, something small is awake.'),
      ],
    },
    rewards: [],
    sets: { 'a18-06': true },
    childLines: {
      'a18-06-ask#4': 'Little doll, here is your supper. Please eat, and listen, because I am frightened.',
    },
    notes:
      'feed:a18-doll:cellar: the Keeper lays out the morsels in the dark (the skill taught in A18-2) by tapping them into ' +
      'a row; any order counts, and it can’t be failed. The screen is near black, lit only by the doll’s two eyes when ' +
      'they come on. The wick-trimming is played as petty, not cruel: a snip and darkness, and no one is hurt.',
  },

  // ---------------------------------------------------------------- A18-7
  {
    id: 'a18-07',
    code: 'A18-7',
    title: 'The Three Riders',
    source: `${TALE}: the white, red and black riders`,
    audience: 'all',
    trigger: { where: WHERE, when: after('A18-6') },
    requires: ['A18-6'],
    speakers: [VASILISA],
    steps: [
      {
        id: 'a18-07-s1',
        goal: 'Walk through the birch wood all night with Vasilisa.',
        hint: 'Keep close behind her and turn when she turns.',
        check: 'walk:a18-wood:night',
        scene: {
          id: 'a18-07-night',
          lines: [
            N('All night you walk. The path isn’t a path, but Vasilisa never once stops to wonder.'),
            N('Twice an owl goes over. Once something large walks past between the trunks, and doesn’t look at you, and you don’t look at it.'),
            N('The cold comes down. Your breath and hers go up in front of you, and the Nubbin’s, smaller, from your collar.'),
            V('Talk to me. Anything. If I listen to the wood, I start to hear things.', 'sad'),
            V('And if you hear hooves, stand still. That’s what they say. Stand still and let them by.', 'think'),
            N('Then, near the end of the dark, you hear hooves.'),
          ],
          choices: [
            {
              id: 'garden',
              label: 'Tell her about your gran’s garden, quickly.',
              then: [
                N('You whisper about the Grove: the pond, the gate that sticks, a gran who could make anything grow and never sat still.'),
                V('She sounds like Mother. Not to look at. In the hands.', 'soft'),
              ],
            },
            {
              id: 'count',
              label: 'Count the birches with her, under your breath.',
              then: [
                N('You get to four hundred and twelve, and Vasilisa says thirteen.'),
                N('Your Nubbin, from inside your coat, sneezes, which makes it fourteen.'),
              ],
            },
            {
              id: 'hand',
              label: 'Hold her hand and say nothing.',
              then: [N('Her hand is cold and holds on hard. After a while it gets warmer.')],
            },
          ],
        },
        done: {
          id: 'a18-07-night-done',
          lines: [N('Vasilisa stops, and you stop. Your Nubbin stops breathing, to be on the safe side.')],
        },
      },
      {
        id: 'a18-07-s2',
        goal: 'Stand still and let the riders go by.',
        hint: 'Step off the path at dawn, and again at sunrise.',
        check: 'watch:a18-riders:dawn',
        scene: {
          id: 'a18-07-white',
          lines: [
            N('A rider comes through the trees at a walk. He is all in white, on a white horse with white harness, and his face is pale and calm.'),
            N('He doesn’t look at you. As he passes, the sky behind the birches goes from black to grey, and then to the colour of milk.'),
            V('Morning. He brought the morning. Or it followed him.', 'shock'),
            N('You walk on. The birds start: one, and then all of them.'),
            N('Then another rider, at a trot. All in red, on a red horse, red as a hearth.'),
            N('As he passes, the sun comes up over the trees, and everything you can see goes gold, then red, then plain day.'),
            V('White, then red. Somebody’s counting out the day, like coins.', 'think'),
          ],
          choices: [
            {
              id: 'bow',
              label: 'Bow your head as he passes.',
              then: [N('You bow. The red rider doesn’t notice, or does, and doesn’t mind.')],
            },
            {
              id: 'wave',
              label: 'Let your Nubbin wave.',
              then: [N('Your Nubbin puts one paw out of your coat and waves. The red rider, without turning his head, lifts one finger from the rein.')],
            },
          ],
        },
        done: {
          id: 'a18-07-white-done',
          lines: [N('All day you walk. The wood gets older and darker, and the birches give way to trees whose names you don’t know.')],
        },
      },
      {
        id: 'a18-07-s3',
        goal: 'Reach the clearing at dusk, and let the last rider pass.',
        hint: 'Keep to the edge of the clearing. Hide your Nubbin if it wants hiding.',
        check: 'watch:a18-riders:dusk',
        scene: {
          id: 'a18-07-black',
          lines: [
            N('At dusk you come out into a clearing. On the far side stands a hut, and round the hut, a fence.'),
            N('Before you can look properly, there are hooves again, slow ones.'),
            N('A rider all in black, on a black horse with black harness, comes out of the trees and crosses the clearing.'),
            N('Your Nubbin goes all the way down inside your coat. You can feel it there, a warm round lump, shaking a little.'),
            N('The black rider reaches the gate of the hut, and then he isn’t there any more, as if the ground had opened for him.'),
            N('And night falls, all at once, like a lid.'),
            V('Night. That was night. They were all one thing, weren’t they? Day, and sun, and night.', 'shock'),
          ],
          choices: [
            {
              id: 'hold',
              label: 'Put a hand over your Nubbin, through your coat.',
              then: [N('You hold it through the wool. It stops shaking, mostly.')],
            },
            {
              id: 'hum',
              label: 'Hum something very low, for your Nubbin.',
              then: [N('You hum the Lantern Song under your breath. Vasilisa doesn’t know it, but by the second line she is humming it back.')],
            },
          ],
        },
        done: {
          id: 'a18-07-black-done',
          lines: [N('Your Nubbin stays down in your coat. It isn’t coming out for anybody.')],
        },
      },
    ],
    complete: {
      id: 'a18-07-complete',
      lines: [
        N('In the dark round the hut, lights come on. Not in the windows, but in the fence.'),
        V('There. That’s her house. Everybody said.', 'sad'),
        N('Vasilisa puts her hand in her pocket. Then she takes it out, squares her shoulders, and walks forward.'),
        N('You go with her. You said you would.'),
      ],
    },
    rewards: [],
    sets: { 'a18-07': true },
    notes:
      'The riders never speak and never look at you. Each one changes the light as he passes: black to milk-white (white ' +
      'rider), gold to day (red rider), dusk to full night in one beat (black rider). These are the sky’s colours in the ' +
      'Learning Grove version. The Lantern Song is hummed only (an original song from the bible; no words are sung here).',
  },

  // ---------------------------------------------------------------- A18-8
  {
    id: 'a18-08',
    code: 'A18-8',
    title: 'The Hut',
    source: `${TALE}: Baba Yaga comes home`,
    audience: 'all',
    trigger: { where: WHERE, when: after('A18-7') },
    requires: ['A18-7'],
    speakers: [VASILISA, YAGA],
    steps: [
      {
        id: 'a18-08-s1',
        goal: 'Look at the fence round the hut, and don’t run.',
        hint: 'Walk up to the fence slowly. Your Nubbin can stay in your coat.',
        check: 'inspect:a18-fence:hut',
        scene: {
          id: 'a18-08-fence',
          lines: [
            N('The fence is made of old bones, grey and smooth, the way driftwood is. On every stake there is a skull.'),
            N('In every skull the eyes are lit, as if somebody had left a lamp burning inside.'),
            N('They turn, all of them, slowly, to look at you.'),
            V('Don’t look back at them. That’s what they say. Look at the gate.', 'sad'),
            N('Your Nubbin looks back at them anyway, from your collar. One of the skulls, you could swear, looks a little surprised.'),
            N('Behind the fence the hut is old and black and leaning. There is smoke from its chimney, but no light in its windows.'),
          ],
          choices: [
            {
              id: 'gate',
              label: 'Look at the gate, as she says.',
              then: [N('You look at the gate. It is only a gate, nearly, and that helps.')],
            },
            {
              id: 'face',
              label: 'Turn your Nubbin’s face into your coat.',
              then: [N('It goes, with a small sigh. The skulls go on looking at the place where it was.')],
            },
          ],
        },
        done: {
          id: 'a18-08-fence-done',
          lines: [N('Then the trees round the clearing begin to creak, and the dry leaves on the ground all lift and turn over at once.')],
        },
      },
      {
        id: 'a18-08-s2',
        goal: 'Stand your ground while Baba Yaga comes home.',
        hint: 'Stay beside Vasilisa by the gate, and keep still.',
        check: 'wait:a18-yaga:gate',
        scene: {
          id: 'a18-08-mortar',
          lines: [
            N('Out of the trees comes Baba Yaga, riding in a great stone mortar and rowing through the air with the pestle.'),
            N('Behind her she sweeps away her own track with a broom, so that nobody can follow where she has been.'),
            N('She lands by the gate with a thump that shakes the fence. Every skull rattles, very politely.'),
            BY('Hm. Hm! I smell something. Somebody. Two somebodies, and something small and furry.', 'think'),
            BY('Who’s there? Out with it. I don’t like waiting and I don’t like guessing.', 'angry'),
            N('She has a nose like a pruning hook and eyes like two wet stones. She is very old, very tall, and not at all slow.'),
            V('It’s me, Granny. My stepmother’s daughters sent me. For fire. We haven’t any.'),
            BY('I know your stepmother. I know her sort.', 'think'),
            BY('Fire, is it? Stay and work for me, and if you work well, you’ll have fire. If not, we’ll see what I do. Nobody wants to see twice.', 'angry'),
          ],
        },
        done: {
          id: 'a18-08-mortar-done',
          lines: [N('Vasilisa curtsies, right down to the ground. Her hand doesn’t go to her pocket once, not where Baba Yaga can see.')],
        },
      },
      {
        id: 'a18-08-s3',
        goal: 'Answer Baba Yaga when she asks who you are.',
        hint: 'Speak up. She will know if you’re fibbing.',
        check: 'talk:a18-yaga:gate',
        scene: {
          id: 'a18-08-who',
          lines: [
            N('Baba Yaga turns, and bends, and puts her nose almost on yours.'),
            BY('And you. You’re not from round here. You smell of somewhere else entirely. Ponds. Fruit. Old paper.', 'think'),
            BY('Who are you, and what do you want here?'),
            N('Vasilisa’s fingers find your sleeve and hold on.'),
            N('On the fence, the skulls lean in to listen.'),
            N('Your Nubbin, deep in your coat, holds its breath again.'),
          ],
          choices: [
            {
              id: 'friend',
              label: 'I’m her friend. I lodge at her father’s.',
              then: [BY('A friend. Hm. Friends are rarer than lodgers. Fine.')],
            },
            {
              id: 'keeper',
              label: 'A Keeper. I look after small things.',
              then: [BY('Do you. Well, so do I, in my way. You wouldn’t like my way.', 'happy')],
            },
            {
              id: 'peek',
              label: 'Let your Nubbin answer, by putting its head out.',
              then: [
                N('Your Nubbin puts its head out of your coat and looks at her.'),
                BY('Oh, you. Never seen one of you before. I’ve seen everything, so that’s something.', 'think'),
              ],
            },
          ],
        },
        done: {
          id: 'a18-08-who-done',
          lines: [
            BY('Same terms for you as for her, since you’re here. Work, and you go home. Shirk, and you don’t.', 'angry'),
            N('She lifts one hand. The gate opens by itself, and the bolts on the hut door shoot back one after another.'),
          ],
        },
      },
    ],
    complete: {
      id: 'a18-08-complete',
      lines: [
        BY('In. In! Don’t stand there letting the night in. It’s mine. I know where it’s been.'),
        N('Inside, the hut is hot and smoky and very full: pots, bunches of herbs, and a great white stove that takes up half the room.'),
        N('Baba Yaga stretches out on a bench, puts her feet up, and looks at Vasilisa.'),
        BY('Well? I’m home and I’m hungry. What’s in the oven, girl? Bring it all.', 'happy'),
      ],
    },
    rewards: [],
    sets: { 'a18-08': true },
    notes:
      'CARE: the fence is "old bones" and skulls on stakes, smooth and grey like driftwood, with lamp-like eyes. Nothing ' +
      'else: the tale’s feet, hands and mouth on the gate are cut. The skulls are spooky-funny (one looks surprised; they ' +
      'rattle "politely"), never gory. Baba Yaga is tall, fast and frightening, with an original design (no Bilibin, no ' +
      'film look). Her threat is only ever a hint. Her "Russian smell" rhyme is cut and replaced with her sniffing out ' +
      '"two somebodies, and something small and furry".',
  },

  // ---------------------------------------------------------------- A18-9
  {
    id: 'a18-09',
    code: 'A18-9',
    title: 'Supper for Ten',
    source: `${TALE}: Baba Yaga’s supper`,
    audience: 'all',
    trigger: { where: WHERE, when: after('A18-8') },
    requires: ['A18-8'],
    speakers: [VASILISA, YAGA, DOLLET],
    steps: [
      {
        id: 'a18-09-s1',
        goal: 'Help Vasilisa carry Baba Yaga’s supper to the table.',
        hint: 'Bring dish after dish out of the great white stove.',
        check: 'carry:a18-supper:stove',
        scene: {
          id: 'a18-09-supper',
          lines: [
            N('Out of the stove come pots, and pots, and pots. Vasilisa carries, and you carry, and your Nubbin carries a spoon.'),
            N('Soup enough for ten. A side of pork, pies, porridge, a whole goose, a jug of kvass, a jug of milk, and another jug of milk.'),
            BY('More! Is that the lot? Look in the back. There’s always something at the back.', 'happy'),
            N('She eats the way the wind takes a field: all of it, from one side to the other, and nothing left standing.'),
            N('Your Nubbin watches the goose go, with an expression of real grief.'),
            BY('Ah. Better. That’s what an old woman needs. A little something.', 'happy'),
            N('On the table she leaves a bowl with a little soup at the bottom, a crust, and a scrap of pork the size of your thumb.'),
            BY('That’s yours, girl. Supper. And a crust for you, friend from elsewhere, since you carried. Don’t say I’m not fair.'),
          ],
        },
        done: {
          id: 'a18-09-supper-done',
          lines: [N('Baba Yaga climbs up on to the stove, pulls a quilt over herself, and starts to snore like a saw going through a log.')],
        },
      },
      {
        id: 'a18-09-s2',
        goal: 'Decide who has your crust.',
        hint: 'There is one crust, and a long day tomorrow. Choose.',
        check: 'choose:a18-crust:table',
        scene: {
          id: 'a18-09-crust',
          lines: [
            N('Vasilisa takes her soup and her crust and her scrap of pork into the corner behind the stove, where Baba Yaga can’t see.'),
            N('You hear the napkin, and her whisper. Two small lights come on in the corner, and her supper is gone.'),
            V('She needed it more. She has to do tomorrow. I only have to stand there.', 'soft'),
            N('Vasilisa is very pale. She hasn’t eaten since yesterday.'),
            N('Your crust sits on the table in front of you: hard, grey, and the only food left in the hut.'),
            N('Your Nubbin climbs out of your coat on to the table. It looks at the crust, and then at you, and doesn’t touch it.'),
            N('Tomorrow is going to be very long. You know it the way you know it is going to rain.'),
          ],
          choices: [
            {
              id: 'nubbin',
              label: 'Give it to your Nubbin.',
              set: { 'a18-crust': 'nubbin' },
              then: [
                N('You break it small and hold it out. Your Nubbin eats every crumb, slowly, looking at you the whole time.'),
                N('Feed them before you feed yourself. You’re hungry and it isn’t, and that seems a fair trade.', 'soft'),
              ],
            },
            {
              id: 'doll',
              label: 'Give it to the doll, for Vasilisa.',
              set: { 'a18-crust': 'doll' },
              then: [
                V('For her? But it’s yours.', 'shock'),
                Y('She’s working for both of you tomorrow. She ought to eat for two.'),
                N('Vasilisa sets your crust in front of the doll. The little lights come on again, brighter than before.'),
              ],
            },
            {
              id: 'self',
              label: 'Eat it yourself. Tomorrow is long.',
              set: { 'a18-crust': 'self' },
              then: [
                N('You eat it. It is very dry, and takes a long time, and then it is gone.'),
                N('Your Nubbin watches the last bit go. Then it curls up on your feet anyway, which is generous of it.'),
              ],
            },
          ],
        },
        done: {
          id: 'a18-09-crust-done',
          lines: [N('The fire in the stove sinks to red. Vasilisa curls up on the bench with one hand in her pocket.')],
        },
      },
    ],
    complete: {
      id: 'a18-09-complete',
      lines: [
        N('Baba Yaga stops snoring all at once, and speaks from the top of the stove without opening her eyes.'),
        BY('Tomorrow I go out. While I’m gone, sweep the yard, clean the hut, cook my dinner and wash my linen.'),
        BY('Then go to the barn, take a quarter of oats, and sift them clean. Every husk. Every bit of chaff.'),
        BY('And if it isn’t all done when I come back… well. We’ll see. Goodnight.', 'happy'),
        N('She starts snoring again, exactly where she left off.'),
      ],
    },
    rewards: [],
    sets: { 'a18-09': true },
    notes:
      'SIGNATURE CHOICE (a18-09-crust): a18-crust = nubbin | doll | self. No path is wrong and none is scolded. It pays ' +
      'off in A18-10 (a18-10-chores*), A18-11 (a18-11-poppy-self), A18-12 (a18-12-gate*), A18-13 (a18-13-dark*), A18-15 ' +
      '(a18-15-loom-done*) and A18-16 (a18-16-shirts-self, a18-16-complete*), and decides the keepsake you take home ' +
      '(a bag of Baba Yaga’s oats, the handkerchief cloth, or a plain shirt button). Only Vasilisa feeds the doll, in the ' +
      'corner; Baba Yaga never sees it. The supper list is a comic pile-up; "kvass" is the only culture-specific food word.',
  },

  // ---------------------------------------------------------------- A18-10
  {
    id: 'a18-10',
    code: 'A18-10',
    title: 'The First Day',
    source: `${TALE}: the first day’s work`,
    audience: 'all',
    trigger: { where: WHERE, when: after('A18-9') },
    requires: ['A18-9'],
    speakers: [VASILISA, YAGA, DOLLET],
    steps: [
      {
        id: 'a18-10-s1',
        goal: 'Keep close while Vasilisa asks the doll what to do.',
        hint: 'Stay by the warm stove and listen.',
        check: 'sit:a18-doll:stove',
        scene: {
          id: 'a18-10-night',
          lines: [
            N('When the snoring is steady, Vasilisa takes the doll out of her pocket, very slowly, and sits it on her knee.'),
            V('There’s so much. I can’t do it all. Nobody could. What do I do?', 'sad'),
            N('There is nothing left to give it; it has eaten already tonight. The two little lights come on all the same.'),
            DOLL(LIFT_SLEEP, 'soft'),
            V('That’s what Mother used to say. Not the same words. The same thing.', 'soft'),
            N('She lies down on the bench, and is asleep before she has finished lying down.'),
          ],
          choices: [
            {
              id: 'watch',
              label: 'Stay awake and keep watch.',
              then: [N('You keep watch, and so does the doll, sitting up on the end of the bench. Every so often you look at it, and it looks at you.')],
            },
            {
              id: 'sleep',
              label: 'Do as the doll says, and sleep.',
              then: [N('You lie down by the stove. The last thing you see is the doll, still sitting up, keeping watch for all of you.')],
            },
          ],
        },
        done: {
          id: 'a18-10-night-done',
          lines: [N('At first light the white rider goes past the window. Baba Yaga whistles, her mortar comes, and she is gone.')],
        },
      },
      {
        id: 'a18-10-s2',
        goal: 'Help with the yard, the hut and the oats while Vasilisa sleeps.',
        hint: 'Sweep, scrub and sift. The doll is working too.',
        check: 'collect:a18-chores:yard',
        scene: {
          id: 'a18-10-chores',
          lines: [
            ...A10_WORK,
            N('Your Nubbin slept well, on a full stomach. It wakes up bright, and goes straight to the barn with you.'),
            N('A quarter of oats is a great many oats. You sift, and your Nubbin picks out the black grains one at a time and spits them in a pile.'),
            N('The doll comes in, looks at the pile, and nods once, the way a foreman does. Then it goes to see about the dinner.'),
            N('By noon the oats are clean. Your Nubbin is asleep on the sack, and you are covered in chaff to the eyebrows.'),
          ],
        },
        done: {
          id: 'a18-10-chores-done',
          lines: [N('At dusk Vasilisa wakes, and the doll climbs back into her pocket, just as the black rider crosses the clearing.')],
        },
      },
      {
        id: 'a18-10-s3',
        goal: 'Stand by while Baba Yaga looks over the work.',
        hint: 'Wait in the yard as the night comes down.',
        check: 'watch:a18-hands:barn',
        scene: {
          id: 'a18-10-hands',
          lines: [
            N('The fence’s eyes light up and the trees creak. Baba Yaga comes down in the yard with her mortar and her broom.'),
            BY('Well? Well?', 'angry'),
            N('She looks at the yard, and at the hut. She tastes the dinner, runs a finger along the top of the stove, and looks at the finger.'),
            N('She goes to the barn, puts her nose in the oats, and sniffs for a long time.'),
            BY('Hm. Nothing to find fault with. I hate it when there’s nothing to find fault with.', 'think'),
            BY('Servants of mine! Old friends! Here are oats. Take them away and grind them.', 'happy'),
            N('Out of nowhere, three pairs of hands appear. Just hands, in the air, with nobody attached.'),
            N('They lift the sack of oats and carry it off into the dark, and are gone.'),
          ],
          choices: [
            {
              id: 'look',
              label: 'Watch the hands go.',
              then: [N('You watch them all the way to the edge of the dark. One of them, you are nearly sure, waves.')],
            },
            {
              id: 'ground',
              label: 'Look at the ground until they’ve gone.',
              then: [N('You look at the ground, which seems wiser. Vasilisa is looking at the ground too.')],
            },
            {
              id: 'holdback',
              label: 'Hold your Nubbin back from following them.',
              then: [N('Your Nubbin wants very much to see where the hands go. You hold on to it with both arms.')],
            },
          ],
        },
        done: {
          id: 'a18-10-hands-done',
          lines: [BY('Same again tomorrow. Different job. Go to sleep.')],
        },
      },
    ],
    complete: {
      id: 'a18-10-complete',
      lines: [
        N('Baba Yaga eats her dinner, all of it, leaves a little at the bottom of the pot, and goes to sleep on the stove.'),
        N('Vasilisa looks at the empty air where the hands were, opens her mouth, and closes it again.'),
        V('I’m not going to ask. I don’t want to know where they go.', 'think'),
        N('She takes out the doll and feeds it what she has, and the little lights come on.'),
      ],
    },
    rewards: [],
    sets: { 'a18-10': true },
    childLines: {
      'a18-10-night#3': 'Don’t be afraid. Lie down and go to sleep. Things always look smaller in the morning.',
    },
    notes:
      'CRUST PAYOFF (a18-crust). The step 2 scene shown, a18-10-chores, is for nubbin (it slept well and helps with the ' +
      'oats). For doll play ATLAS_A18_VARIANTS a18-10-chores-doll (fed twice, the doll does your share too); for self play ' +
      'a18-10-chores-self (you do your share by hand, slowly). collect:a18-chores:yard is a short chores loop (sweep, scrub, ' +
      'sift); on the doll path it completes as soon as you sit on the stool. The three pairs of hands are pale and graceful, ' +
      'never grabbing, never severed-looking: they fade in and out at the wrist like mist.',
  },

  // ---------------------------------------------------------------- A18-11
  {
    id: 'a18-11',
    code: 'A18-11',
    title: 'The Second Day',
    source: `${TALE}: the second day’s work`,
    audience: 'all',
    trigger: { where: WHERE, when: after('A18-10') },
    requires: ['A18-10'],
    speakers: [VASILISA, YAGA, DOLLET],
    steps: [
      {
        id: 'a18-11-s1',
        goal: 'Hear what the second day’s work is.',
        hint: 'Listen to Baba Yaga before she goes out.',
        check: 'talk:a18-yaga:list',
        scene: {
          id: 'a18-11-list',
          lines: [
            BY('Up! Up. Today the same: yard, hut, dinner, linen. And one thing more.', 'happy'),
            N('She drags a sack across the floor and opens it. It is full of poppy seed from her field, tiny and blue-black.'),
            N('Mixed all through the seed there is earth: dry, crumbly, the same colour, and every bit as fine.'),
            BY('Somebody did that to me once, out of spite. Somebody always does, sooner or later.', 'angry'),
            BY('Get every bit of earth out of it. Every speck. I’ll know.'),
            N('She whistles, her mortar comes to the door, and she goes off over the treetops with the broom sweeping behind her.'),
            V('Every speck. You can’t even see which ones are the specks.', 'sad'),
          ],
          choices: [
            {
              id: 'try',
              label: 'Say you’ll try, at least.',
              then: [V('Thank you. I knew you’d say that. I’ll ask her first, though.')],
            },
            {
              id: 'remind',
              label: 'Remind her what the doll told her last night.',
              then: [V('Sleep first, and ask, and see. Yes. I know.', 'soft')],
            },
          ],
        },
        done: {
          id: 'a18-11-list-done',
          lines: [N('Vasilisa takes out the doll, feeds it the last of her bread, and listens to it with her head on one side.')],
        },
      },
      {
        id: 'a18-11-s2',
        goal: 'Help get the earth out of the poppy seed.',
        hint: 'Work at the barn table. Your Nubbin can help.',
        check: 'collect:a18-poppy:barn',
        scene: {
          id: 'a18-11-poppy',
          lines: [
            N('The doll climbs down off the table and walks into the poppy seed like somebody wading into a pond.'),
            N('Where it goes, the seed runs one way and the earth runs the other, as if they had fallen out with each other.'),
            N('You work the edges with a feather and a saucer. Your Nubbin blows the dust off the top, gently, and then too hard.'),
            N('By noon the seed is in one sack and the earth in a heap by the door, and not one speck is in the wrong place.'),
            N('Vasilisa sleeps through the whole thing with a smile on her face. You don’t blame her.'),
            N('The doll climbs on to the heap of earth and sits there, the way you sit on a hill you have just climbed.'),
          ],
        },
        done: {
          id: 'a18-11-poppy-done',
          lines: [N('The black rider crosses the clearing, and the fence’s eyes come on. In the trees, something begins to creak.')],
        },
      },
      {
        id: 'a18-11-s3',
        goal: 'Watch Baba Yaga find no fault, a second time.',
        hint: 'Wait in the yard as night falls.',
        check: 'watch:a18-hands:poppy',
        scene: {
          id: 'a18-11-oil',
          lines: [
            N('Baba Yaga comes down in her mortar, climbs out, and goes straight to the barn without a word.'),
            N('She puts her nose in the poppy seed and sniffs. She puts her nose in the earth and sniffs, and then does both again.'),
            BY('Not a speck. Not one speck. Twice running. It isn’t natural.', 'angry'),
            BY('Servants of mine! Old friends! Take the poppy and press it. I want oil by morning.'),
            N('The three pairs of hands come out of the dark, take the sack of poppy seed, and are gone with it.'),
            N('Baba Yaga stands looking at the empty floor, and then at you, for a long time.'),
            BY('Hm. You helped, didn’t you. Don’t answer. I can see it on your sleeves.', 'think'),
            BY('I pay for work. I always pay for work. Here.'),
            N('She takes an old mortar and pestle off a shelf, no bigger than a teacup and cracked down one side, and drops them in your hands.'),
            BY('Too small for flying. Too good to burn. Plant something in it.'),
          ],
          choices: [
            {
              id: 'thank',
              label: 'Thank her properly.',
              then: [
                BY('Don’t thank me. I said, it’s pay. Pay isn’t a present.', 'angry'),
                N('But for a moment she looks almost pleased.'),
              ],
            },
            {
              id: 'flew',
              label: 'Ask whether it ever flew.',
              then: [
                BY('Once. A very short way. Into a pond.', 'think'),
                N('She doesn’t explain, and you don’t ask again.'),
              ],
            },
          ],
        },
        done: {
          id: 'a18-11-oil-done',
          lines: [N('By morning there is a jar of poppy-seed oil on the table, golden, and nobody saw it arrive.')],
        },
      },
    ],
    complete: {
      id: 'a18-11-complete',
      lines: [
        N('That night there is soup again, and a crust, and a scrap of something. Baba Yaga eats the rest.'),
        N('The little mortar sits on the windowsill, where the fence’s light catches the crack in it.'),
        V('Tomorrow she’ll let me go. Or she won’t. I can feel it coming, like weather.', 'think'),
        N('Your Nubbin climbs into the cracked mortar, which fits it exactly, and goes to sleep there.'),
      ],
    },
    rewards: [
      {
        id: 'a18-mortar-planter',
        kind: 'decor',
        label: 'Baba Yaga’s Little Mortar',
        description: 'A cracked mortar and pestle no bigger than a teacup, too small for flying. Plant something in it; Nubbins like to sit in it.',
      },
    ],
    sets: { 'a18-11': true },
    notes:
      'CRUST PAYOFF (a18-crust). The step 2 scene shown, a18-11-poppy, is for nubbin and doll. For self play ' +
      'ATLAS_A18_VARIANTS a18-11-poppy-self (you do your half by hand, slowly). ' +
      'CHANGE FROM OUTLINE: Part M says earth was mixed "into the hay in Baba Yaga’s field", then has the hands carry ' +
      'off the poppy. In Afanasyev the task is to clean earth out of poppy seed, so it is poppy seed from her field ' +
      'here, which also makes the oil make sense. Baba Yaga’s "somebody did that to me out of spite" is our addition, ' +
      'from the outline. Mortar planter: one-time decor, the Nubbin idle (sitting in it) is unlimited and gives nothing.',
  },

  // ---------------------------------------------------------------- A18-12
  {
    id: 'a18-12',
    code: 'A18-12',
    title: 'Questions',
    source: `${TALE}: questions, and the mother’s blessing`,
    audience: 'all',
    trigger: { where: WHERE, when: after('A18-11') },
    requires: ['A18-11'],
    speakers: [VASILISA, YAGA],
    steps: [
      {
        id: 'a18-12-s1',
        goal: 'Stand by Vasilisa while Baba Yaga eats, and listen.',
        hint: 'Keep quiet at the table. Vasilisa will speak.',
        check: 'sit:a18-yaga:supper',
        scene: {
          id: 'a18-12-supper',
          lines: [
            N('Baba Yaga eats, and eats, and Vasilisa stands by the table with her hands folded, saying nothing.'),
            BY('What are you standing there for, dumb as a post? Say something. It’s like eating with a gatepost watching.', 'angry'),
            V('Granny, may I ask you some questions?'),
            BY(LIFT_ASK, 'think'),
            V('On the road a rider went past me, all in white, on a white horse. Who was he?'),
            BY('That was my bright day.'),
            V('And then another, all in red, on a red horse?'),
            BY('That was my red sun.'),
            V('And at your gate, one all in black?'),
            BY('My dark night. All three mine, all faithful. They come and go when I say.', 'happy'),
            N('Vasilisa thinks of the three pairs of hands; you can see her think of them. She shuts her mouth.'),
          ],
        },
        done: {
          id: 'a18-12-supper-done',
          lines: [BY('Is that all? Nothing else?')],
        },
      },
      {
        id: 'a18-12-s2',
        goal: 'Decide whether to ask a question of your own.',
        hint: 'Think about what Baba Yaga just said about questions.',
        check: 'choose:a18-question:table',
        scene: {
          id: 'a18-12-question',
          lines: [
            V('That’s all, Granny. You said so yourself: knowing too much makes you old.'),
            BY('So I did, and so it does. Good girl. You only ask about what’s outside my yard, not what’s in it.', 'think'),
            BY('People who ask about what goes on inside… well. I don’t like them. They don’t stay long, one way and another.'),
            N('Baba Yaga turns her wet-stone eyes on you.'),
            BY('And you? Hm? Anything you want to know, friend from elsewhere?'),
            N('You think of the hands, and you can’t help it. They are right there in your head, waving.'),
          ],
          choices: [
            {
              id: 'hands',
              label: 'Ask about the hands.',
              then: [
                N('You open your mouth. Under the table, Vasilisa stands on your foot, hard.'),
                Y('…About the weather. Is it going to be cold tomorrow?'),
                BY('Very. Good question. Much better than the one you were going to ask.', 'happy'),
              ],
            },
            {
              id: 'nothing',
              label: 'Ask nothing. Shake your head.',
              then: [BY('Wise. Wiser than you look. That isn’t hard, but still.', 'think')],
            },
            {
              id: 'birches',
              label: 'Ask about something outside the yard: the birches.',
              then: [
                Y('Why are the birches white?'),
                BY('So my bright day has something to shine on when I’m not using him. Next.', 'happy'),
              ],
            },
          ],
        },
        done: {
          id: 'a18-12-question-done',
          lines: [N('Baba Yaga leans back. She has eaten everything, as usual, and is in the mood to ask a question herself.')],
        },
      },
      {
        id: 'a18-12-s3',
        goal: 'Hear how Vasilisa answers Baba Yaga’s question.',
        hint: 'Stay near the door. It may be time to go quickly.',
        check: 'talk:a18-yaga:blessing',
        scene: {
          id: 'a18-12-blessing',
          lines: [
            BY('Now I’ll ask one. How did you get all my work done? Every husk. Every speck. Twice.', 'think'),
            N('Vasilisa’s hand goes towards her pocket, and stops, and goes back to her apron.'),
            V(LIFT_BLESSING),
            N('Baba Yaga goes very still. Then she gets up, all of her, right up to the rafters.'),
            BY(LIFT_BEGONE, 'angry'),
            N('She bundles Vasilisa out of the hut, and you, and your Nubbin, and slams the door so hard the herbs fall off the beams.'),
            N('In the yard she pulls a skull off the fence, stake and all. Its eyes are burning like two coals.'),
            BY('Here. Here’s fire for your stepmother’s daughters. That’s what you came for. Take it and go!'),
          ],
        },
        done: {
          id: 'a18-12-gate',
          lines: [
            N('At the gate, Baba Yaga stops you with one long finger. She bends and sniffs your Nubbin, and then you.'),
            BY('Someone here feeds others first. I can smell it.', 'think'),
            BY('Here. A bag of my oats, for whoever it was. The little one can carry it. Don’t come back.'),
            N('Your Nubbin takes the bag in its mouth, which is all of its mouth, and doesn’t drop it the whole way home.'),
          ],
        },
      },
    ],
    complete: {
      id: 'a18-12-complete',
      lines: [
        N('The gate swings shut behind you. The fence’s eyes watch you go, all but one pair, which is in Vasilisa’s hands.'),
        N('She holds the stick out in front of her as far as her arms will reach. The skull lights the path like a lantern.'),
        V('I said it. I said Mother. I didn’t know it would make her so cross.', 'shock'),
        Y('You didn’t say anything wrong.'),
        V('No. I didn’t, did I.', 'soft'),
      ],
    },
    rewards: [],
    sets: { 'a18-12': true },
    childLines: {
      'a18-12-supper#3': 'Ask, if you like. But be careful: some questions are better left alone.',
      'a18-12-blessing#2': 'My mother’s love helped me!',
      'a18-12-blessing#4': 'Love like that? Then off you go, as fast as you can! Nobody so loved can stay with me!',
    },
    notes:
      'CRUST PAYOFF (a18-crust). The step 3 done shown, a18-12-gate, is for nubbin (Baba Yaga smells it, and gives a bag ' +
      'of oats your Nubbin carries home). For doll play ATLAS_A18_VARIANTS a18-12-gate-doll; for self play ' +
      'a18-12-gate-self ("Honest, at least", and a fair handful of oats as wages). ' +
      'FAITH: the blessing is said once, plainly, and Baba Yaga’s reply is played as rage at something she can’t ' +
      'touch, not as mockery. The skull on the stick: lamp-bright eyes, no gore. Nobody is hurt being "thrown out": ' +
      'it is a bundling and a slammed door.',
  },

  // ---------------------------------------------------------------- A18-13
  {
    id: 'a18-13',
    code: 'A18-13',
    title: 'The Skull on a Stick',
    source: `${TALE}: home by the skull’s light`,
    audience: 'all',
    trigger: { where: WHERE, when: after('A18-12') },
    requires: ['A18-12'],
    speakers: [VASILISA, SKULL],
    steps: [
      {
        id: 'a18-13-s1',
        goal: 'Walk home through the dark wood by the skull’s light.',
        hint: 'Keep inside the circle of light and walk where it shines.',
        check: 'walk:a18-skull:wood',
        scene: {
          id: 'a18-13-dark',
          lines: [
            N('The wood at night is a different wood. The skull’s light makes a small round room of it, and you walk inside the room.'),
            N('Your Nubbin, full and rested, walks ahead of you at the very edge of the light, unafraid.'),
            N('When the path forks it stops and waits, and the skull’s light swings that way, as if the two of them had agreed it.'),
            V('Look at it. It isn’t frightened at all. How is it not frightened?', 'shock'),
            V('Mother used to say: a fed child sleeps, and a hungry one sees wolves.', 'soft'),
            N('You walk all night and all the next day. The skull’s light goes pale in the sun, but never goes out.'),
          ],
        },
        done: {
          id: 'a18-13-dark-done',
          lines: [N('At dusk on the second day you see the stepmother’s house ahead. There is no light in it at all.')],
        },
      },
      {
        id: 'a18-13-s2',
        goal: 'Stay with Vasilisa when she wants to throw the skull away.',
        hint: 'Wait beside her at the edge of the wood.',
        check: 'wait:a18-skull:edge',
        scene: {
          id: 'a18-13-throw',
          lines: [
            N('At the edge of the wood Vasilisa stops. Her arms are shaking from holding the stick out all this way.'),
            V('I can’t take it into the house. It’s a head. It’s somebody’s head. I’ll throw it in the ditch.', 'sad'),
            V('They’ll have fire by now. They’ll have got some from a neighbour. They won’t need it.'),
            N('She lifts the stick to throw. Your Nubbin puts both paws over its eyes.'),
            SK('Don’t throw me away.'),
            N('The voice comes from the skull. It is a dry voice, like leaves, and not at all unkind.'),
            SK('Take me to your stepmother’s house. That is where I’m wanted.'),
            V('Oh.', 'shock'),
          ],
          choices: [
            {
              id: 'listen',
              label: 'Tell her to do as it says.',
              then: [V('Yes. All right. Yes. It did nearly say please.', 'think')],
            },
            {
              id: 'hers',
              label: 'Say nothing. It’s her choice.',
              then: [
                N('You wait. Vasilisa looks at the skull for a long time, and the skull, patiently, looks back.'),
                V('All right. Home.'),
              ],
            },
          ],
        },
        done: {
          id: 'a18-13-throw-done',
          lines: [N('She lowers the stick. Her arms are trembling so much that the light shakes on the snow.')],
        },
      },
      {
        id: 'a18-13-s3',
        goal: 'Carry the skull the last stretch, so Vasilisa’s arms can rest.',
        hint: 'Take the stick, hold it out in front, and walk to the house.',
        check: 'carry:a18-skull:stepmother-house',
        scene: {
          id: 'a18-13-carry',
          lines: [
            Y('Give it to me. Just as far as the gate.'),
            N('You take the stick. It is lighter than you thought, and warm, like a cup of something.'),
            N('Vasilisa shakes out her arms and blows on her hands, and walks beside you with one hand on your sleeve.'),
            N('The skull looks ahead at the dark house. Its eyes get brighter the nearer you come.'),
            SK('Nearly there.', 'think'),
            N('Your Nubbin climbs up on to your shoulder to see where you’re all going.'),
          ],
          choices: [
            {
              id: 'steady',
              label: 'Hold it steady, far out in front.',
              then: [N('You hold it at arm’s length. The light goes before you up the path, like a carpet being unrolled.')],
            },
            {
              id: 'polite',
              label: 'Ask the skull, politely, how it is.',
              then: [SK('Busy. It has been a long time since anybody asked.'), N('It doesn’t say any more, and you don’t ask again.')],
            },
          ],
        },
        done: {
          id: 'a18-13-carry-done',
          lines: [N('At the gate you hand the stick back to Vasilisa. It should be her who carries it in.')],
        },
      },
    ],
    complete: {
      id: 'a18-13-complete',
      lines: [
        N('The house is dark from top to bottom: no candle, no lamp, no glow from the stove, not a chink anywhere.'),
        V('They’re waiting for me. They’ve never once waited for me before.', 'think'),
        N('Your Nubbin climbs down off your shoulder and stands close against your leg.'),
        N('The door flies open before you reach it.'),
      ],
    },
    rewards: [],
    sets: { 'a18-13': true },
    notes:
      'CRUST PAYOFF (a18-crust). The step 1 scene shown, a18-13-dark, is for nubbin (it walks ahead in the skull’s light, ' +
      'unafraid). For doll play ATLAS_A18_VARIANTS a18-13-dark-doll (it rides in your coat, shivering); for self play ' +
      'a18-13-dark-self (you feed it Baba Yaga’s handful of oats on the way, late but not too late). The skull speaks ' +
      'only in this quest: a dry, quiet, not unkind voice. Its light is warm amber, like the doll’s eyes but steadier.',
  },

  // ---------------------------------------------------------------- A18-14
  {
    id: 'a18-14',
    code: 'A18-14',
    title: 'No Fire',
    source: `${TALE}: the skull comes home (softened)`,
    audience: 'all',
    trigger: { where: WHERE, when: after('A18-13') },
    requires: ['A18-13'],
    speakers: [VASILISA, STEPMOTHER, ELDER, YOUNGER, DOLLET],
    steps: [
      {
        id: 'a18-14-s1',
        goal: 'Bring the skull into the house with Vasilisa.',
        hint: 'Follow her through the door.',
        check: 'deliver:a18-skull:house',
        scene: {
          id: 'a18-14-door',
          lines: [
            STEP('You! You came back. And you’ve brought fire. Well, come in, come in, don’t stand there.', 'shock'),
            N('For the first time ever she is pleased to see Vasilisa. It doesn’t suit her face.'),
            ELD('We’ve had no light since you went. None. We tried and tried.', 'sad'),
            YNG('We fetched fire from the neighbours, three times. Every time we brought it in at the door, it went out.'),
            ELD('Candles, coals, a lamp. Out, out, out, the moment they crossed the step.', 'shock'),
            STEP('Well, never mind that. Put it on the table. It’ll do for a lamp.'),
            N('Vasilisa sets the skull on the table, on its stick, facing the room. Its eyes are very bright.'),
          ],
          choices: [
            {
              id: 'stand',
              label: 'Stand next to Vasilisa, by the door.',
              then: [N('You stand by her. The stepmother doesn’t look at you: she is looking at the skull, and the skull is looking at her.')],
            },
            {
              id: 'close',
              label: 'Keep your Nubbin close.',
              then: [N('You pick your Nubbin up and hold it against your chest. It doesn’t want to look at the table either.')],
            },
          ],
        },
        done: {
          id: 'a18-14-door-done',
          lines: [N('The stepmother moves to the stove, and the skull’s eyes follow her. She moves to the window, and they follow her there too.')],
        },
      },
      {
        id: 'a18-14-s2',
        goal: 'Stay by the cold stove with Vasilisa through the long night.',
        hint: 'Sit by the hearth and don’t leave her on her own.',
        check: 'sit:a18-hearth:night',
        scene: {
          id: 'a18-14-stare',
          lines: [
            STEP('Turn it round. Turn it to the wall!', 'shock'),
            N('Vasilisa turns it to the wall. The eyes still look at the stepmother, from the back of the skull, somehow.'),
            ELD('It’s looking at me. Mother, it’s looking at me!'),
            N('The sisters go down to the cellar, and the eyes find them there. They climb to the loft, and the eyes find them in the loft.'),
            N('There is no shouting. There is only the light, and three people trying to get out of it, and not managing.'),
            N('Vasilisa sits by the cold stove, and you sit beside her with your Nubbin in your lap. The light never once looks at you.'),
            V('I didn’t want this. I only went for fire.', 'sad'),
          ],
          choices: [
            {
              id: 'sit',
              label: 'Sit with her, and say nothing.',
              then: [N('You sit with her. It is the longest night you have ever sat through, and you sit through all of it.')],
            },
            {
              id: 'sleeve',
              label: 'Put your sleeve over her eyes.',
              then: [N('She leans against your shoulder with your sleeve over her eyes. After a while, she sleeps.')],
            },
            {
              id: 'tell',
              label: 'Tell her it isn’t her doing.',
              then: [Y('You went for fire. That’s all you did.'), V('I know. I know. Will you stay up with me anyway?', 'soft')],
            },
          ],
        },
        done: {
          id: 'a18-14-stare-done',
          lines: [N('Some time before dawn, the back door opens and shuts, three times. Then the house is quiet.')],
        },
      },
      {
        id: 'a18-14-s3',
        goal: 'Help Vasilisa bury the skull and lock up the house.',
        hint: 'Dig under the birch by the gate, then walk her to the road.',
        check: 'build:a18-mound:birch',
        scene: {
          id: 'a18-14-morning',
          lines: [
            N('In the morning the house is empty. The stepmother’s shawl is gone from its hook, and her daughters’ boots from the step.'),
            N('Three sets of footprints go off down the lane in the snow, fast. They don’t come back, that day or any day.'),
            V('Gone. Just… gone. I didn’t hate them. I don’t think I ever hated them.', 'sad'),
            N('The skull sits on the table, dim now, as if it were tired. Vasilisa wraps it in a clean cloth.'),
            V('It did what it came to do. It should go in the ground, under a tree. Somewhere quiet.'),
            N('You dig under the birch by the gate, where the snow is thin. Your Nubbin digs too, which helps less but means more.'),
          ],
          choices: [
            {
              id: 'stone',
              label: 'Set a flat stone on top.',
              then: [N('You find a flat stone and set it over the place, and Vasilisa nods. It looks like a place somebody remembers.')],
            },
            {
              id: 'words',
              label: 'Ask if she wants to say something.',
              then: [V('Thank you for the light. That’s all. I think that’s enough.', 'soft')],
            },
          ],
        },
        done: {
          id: 'a18-14-morning-done',
          lines: [N('Vasilisa locks the door, hangs the key on a string round her neck, and doesn’t look back at the house.')],
        },
      },
    ],
    complete: {
      id: 'a18-14-complete',
      lines: [
        V('I’ll go to town and find somewhere to wait for Father. He said spring, if the roads were kind.'),
        N('You walk with her down the lane, the way the footprints went, and then the other way, towards the town.'),
        N('Halfway, she stops and feeds the doll a piece of the bread you brought. The little lights come on, even in daylight.'),
        V('She says we’ll be all right. She says we’ll find a kind old woman.', 'happy'),
        DOLL('Go on, Vasilisa. It’s not far now.', 'soft'),
      ],
    },
    rewards: [],
    sets: { 'a18-14': true },
    notes:
      'SOFTENED FOR ALL (Part M care note). In Afanasyev the skull’s eyes burn the stepmother and her daughters to ' +
      'cinders. Here its stare follows them all night, they flee through the back door before dawn, and they never come ' +
      'back. No burning, no heat, no screams, no smoke: the stare is a still, steady light, and the camera stays with ' +
      'Vasilisa and you by the stove. Their fate is left open: they are gone, not dead. ' +
      'Burying the skull is a gentle, respectful beat (build:a18-mound:birch: a small mound under the birch, with an ' +
      'optional stone).',
  },

  // ---------------------------------------------------------------- A18-15
  {
    id: 'a18-15',
    code: 'A18-15',
    title: 'The Loom',
    source: `${TALE}: the flax and the loom`,
    audience: 'all',
    trigger: { where: WHERE, when: after('A18-14') },
    requires: ['A18-14'],
    speakers: [VASILISA, OLDWOMAN, DOLLET],
    steps: [
      {
        id: 'a18-15-s1',
        goal: 'Find Vasilisa somewhere to stay in town.',
        hint: 'Knock at the little house at the end of the last lane.',
        check: 'visit:a18-old-woman:town',
        scene: {
          id: 'a18-15-town',
          lines: [
            N('The town is all fences and smoke and dogs. At the very end of the last lane stands a little house with one window and a crooked step.'),
            N('An old woman answers the door, with flour on her hands and nobody else in the house.'),
            OLD('A girl on her own, and a… whatever that is. Come in. You’ve both the look of somebody waiting for something.', 'soft'),
            V('For my father. He’s far away, trading. Could I stay, Granny, till he comes? I’ll work.'),
            OLD('Stay. I’ve a bench and a stove and nobody to talk to but the cat, and he’s rude.', 'happy'),
            N('The cat looks at your Nubbin, and your Nubbin looks at the cat. Neither of them blinks first.'),
          ],
          choices: [
            {
              id: 'water',
              label: 'Offer to fetch the water.',
              then: [OLD('Two pails, then. The well’s at the corner. Mind the dog. He’s worse than the cat.')],
            },
            {
              id: 'cat',
              label: 'Introduce your Nubbin to the cat.',
              then: [N('Your Nubbin walks up to the cat and sits down beside it. After a long time, the cat allows this.')],
            },
          ],
        },
        done: {
          id: 'a18-15-town-done',
          lines: [V('Granny, I can’t sit idle. Will you buy me some flax? The best you can find. I’ll spin it.')],
        },
      },
      {
        id: 'a18-15-s2',
        goal: 'Find an old comb, a shuttle and a horse’s mane for the doll.',
        hint: 'Ask round the town: the barber, the weaver’s widow, the stable.',
        check: 'collect:a18-loom-parts:town',
        scene: {
          id: 'a18-15-loom',
          lines: [
            N('Vasilisa spins through the dark days. Her thread comes out so fine it is like hair, like nothing, like a thought.'),
            OLD('Lovely. Too lovely. There isn’t a loom in this town that will take thread like that. It’ll snap in the reed.', 'sad'),
            N('That night Vasilisa goes down to the old woman’s little cellar with a crust, and you go with her, holding the light.'),
            N('The doll eats, and the lights come on. It talks to Vasilisa, low, for a long time.'),
            V('An old comb. An old shuttle. And a horse’s mane. That’s what she wants.', 'think'),
            V('Will you find them? I can’t ask Granny for a horse’s mane. She’ll think I’ve gone strange.'),
          ],
          choices: [
            {
              id: 'ask',
              label: 'Go out first thing and ask round.',
              then: [N('The barber has a comb with three teeth missing, and the weaver’s widow has a shuttle. The stableman cuts you a mane’s worth and asks no questions.')],
            },
            {
              id: 'stable',
              label: 'Send your Nubbin to the stable, where it has made friends with the horse.',
              then: [N('Your Nubbin comes back with a long switch of mane trailing from its mouth. The horse, it seems, didn’t mind.')],
            },
          ],
        },
        done: {
          id: 'a18-15-loom-done',
          lines: [
            A15_LOOM,
            N('While you thread it, your Nubbin falls asleep in the heap of combed flax beside it, curled up tight. Nobody has the heart to move it.'),
          ],
        },
      },
      {
        id: 'a18-15-s3',
        goal: 'Help bleach the linen on the spring grass.',
        hint: 'Spread the linen on the meadow and keep it damp.',
        check: 'place:a18-linen:meadow',
        scene: {
          id: 'a18-15-bleach',
          lines: [
            N('All winter Vasilisa weaves. By the time the snow goes there is a roll of linen as thick as a log and as light as a scarf.'),
            OLD('Now it wants the sun. Out on the grass with it.'),
            N('You carry it to the meadow and spread it on the new grass, a long white road through the green.'),
            N('Every hour you sprinkle it from the can, and the sun works on it, and it gets whiter by the day.'),
            N('Your Nubbin is not allowed on the linen. It understands this perfectly, and lies at the very edge with one paw on.'),
            V('It’s the first thing I’ve made all by myself. Well. Me and her. And you, carrying.', 'happy'),
          ],
          choices: [
            {
              id: 'sprinkle',
              label: 'Take a turn with the watering can.',
              then: [N('You sprinkle the whole length, end to end. A little rainbow follows you, then gives up.')],
            },
            {
              id: 'lie',
              label: 'Lie in the grass beside it and watch the sky.',
              then: [N('You lie down beside the linen, and Vasilisa lies down too. For one afternoon, nobody has to do anything at all.')],
            },
          ],
        },
        done: {
          id: 'a18-15-bleach-done',
          lines: [OLD('Whiter than snow. Finer than anything. I’ve never seen the like, and I’ve seen a lot.', 'happy')],
        },
      },
    ],
    complete: {
      id: 'a18-15-complete',
      lines: [
        N('All winter the old woman has been whittling by the stove, and wouldn’t say what. Now she puts it in your hands.'),
        N('It is a lantern shade carved from birch, round, with two eye-holes: a skull, but a kind one. There is no bone in it anywhere.'),
        OLD('For the light that brought her home. Without the rest of it.', 'soft'),
        N('Put a candle inside, and the eyes glow warm and slow, like somebody pleased to see you.'),
      ],
    },
    rewards: [
      {
        id: 'a18-skull-shade',
        kind: 'decor',
        label: 'The Birch Skull Lantern',
        description: 'A lantern shade carved from birch in the shape of a skull, with no bone in it. With a candle inside, its eyes glow warm and kind.',
      },
    ],
    sets: { 'a18-15': true },
    notes:
      'CRUST PAYOFF (a18-crust). The step 2 done shown, a18-15-loom-done, is for nubbin (it sleeps curled in the flax ' +
      'while you work). For doll play ATLAS_A18_VARIANTS a18-15-loom-done-doll (the doll has built a second, tiny loom, ' +
      'with a handkerchief-sized cloth on it); for self play a18-15-loom-done-self. ' +
      'The flax-to-linen steps (spinning, weaving, bleaching on the grass) are shown plainly; they are the Learning ' +
      'Grove’s lesson for this page. The skull lantern shade is carved birch only (no bone, never a real skull).',
  },

  // ---------------------------------------------------------------- A18-16
  {
    id: 'a18-16',
    code: 'A18-16',
    title: 'Twelve Shirts',
    source: `${TALE}: the Tsar’s shirts, and the end`,
    audience: 'all',
    trigger: { where: WHERE, when: after('A18-15') },
    requires: ['A18-15'],
    speakers: [VASILISA, OLDWOMAN, TSAR, MERCHANT],
    steps: [
      {
        id: 'a18-16-s1',
        goal: 'Walk with the old woman to the palace with the linen.',
        hint: 'Carry the roll. She does the talking.',
        check: 'deliver:a18-linen:palace',
        scene: {
          id: 'a18-16-palace',
          lines: [
            V('Sell it, Granny. Keep the money, for both of us.'),
            OLD('Sell cloth like this? No. Cloth like this is a gift, or it’s nothing. It’s going to the Tsar.', 'think'),
            N('So off you go to the palace, the old woman in her best shawl and you with the roll of linen on your shoulder.'),
            N('She walks up and down under the palace windows with the linen over her arm, as if she had always meant to.'),
            N('A window opens. A man looks out, then comes down, and turns out to be the Tsar, in his slippers.'),
            TS('What’s that you have, old mother?'),
            OLD('A wonder, Majesty. I’ll show it to nobody but you.'),
            TS('Then I’d better see it.'),
            N('He holds the linen up to the light, and the light goes through it as if it weren’t there.'),
            TS('What do you want for it?'),
            OLD('Nothing. Nobody could put a price on it, so I shan’t try. It’s a gift.', 'soft'),
          ],
          choices: [
            {
              id: 'bow',
              label: 'Bow, since everyone else is.',
              then: [N('You bow. Your Nubbin, sitting on the roll of linen, bows too, and slides off.')],
            },
            {
              id: 'off',
              label: 'Keep your Nubbin off the linen.',
              then: [N('You catch your Nubbin just as it reaches for a corner. The Tsar laughs, which lets the guards laugh, carefully.')],
            },
          ],
        },
        done: {
          id: 'a18-16-palace-done',
          lines: [N('The Tsar thanks her and sends her home with presents. But that isn’t the end of it.')],
        },
      },
      {
        id: 'a18-16-s2',
        goal: 'Help make up the twelve shirts.',
        hint: 'Sit at the window with Vasilisa, where the light is best.',
        check: 'craft:a18-shirts:old-woman-house',
        scene: {
          id: 'a18-16-shirts',
          lines: [
            ...A16_COURT,
            N('She sews for a week: twelve shirts, one after another, at the window where the light is best.'),
            N('You thread her needles, because her eyes are tired by evening. Your Nubbin sorts the buttons into rows.'),
            N('The doll works at night. In the morning there is always one more seam done than anybody remembers sewing.'),
          ],
        },
        done: {
          id: 'a18-16-shirts-done',
          lines: [N('Twelve shirts lie folded on the table, white as first snow, and the old woman carries them to the palace.')],
        },
      },
      {
        id: 'a18-16-s3',
        goal: 'Stand with Vasilisa when the Tsar asks to meet the seamstress.',
        hint: 'Walk her to the palace. She’s shaking.',
        check: 'escort:a18-vasilisa:palace',
        scene: {
          id: 'a18-16-tsar',
          lines: [
            N('The Tsar puts on one of the shirts, and then sends for the seamstress. He wants to see who made such things with her two hands.'),
            V('Me? At the palace? Like this?', 'shock'),
            OLD('Like that. Wash your face. It’s a very good face.', 'happy'),
            N('You walk her there. On the steps she stops and puts her hand in her pocket, and takes it out again, steadier.'),
            N('The Tsar looks at Vasilisa, and goes on looking, and forgets entirely what he meant to say.'),
            TS('You made these? All of them?'),
            V('Yes, Majesty. With help.'),
            TS('Then I don’t want to let you go. Not today, and I’d like it to be not ever. Would you mind that very much?', 'soft'),
            N('Vasilisa looks at you, and you look at her. She doesn’t need anybody to tell her what to say.'),
            V('I wouldn’t mind it at all.', 'happy'),
          ],
          choices: [
            {
              id: 'cheer',
              label: 'Cheer, out loud, in a palace.',
              then: [N('You cheer. Your Nubbin cheers in its own way, which is to run round the throne room twice.')],
            },
            {
              id: 'squeeze',
              label: 'Just squeeze her hand.',
              then: [N('You squeeze her hand. She squeezes back so hard it hurts, and laughs.')],
            },
          ],
        },
        done: {
          id: 'a18-16-tsar-done',
          lines: [N('They are married within the month. Bells ring, somebody throws grain, and your Nubbin eats a good deal of it.')],
        },
      },
    ],
    complete: {
      id: 'a18-16-complete',
      lines: [
        ...A16_HOME,
        N('Your Nubbin carries Baba Yaga’s bag of oats down the palace steps, as proudly as it carried it out of the wood.'),
        ...A16_END,
      ],
    },
    rewards: [
      {
        id: 'a18-doll-charm',
        kind: 'cosmetic',
        label: 'The Doll Charm',
        description: 'A little painted doll with a red scrap of scarf, in a pouch your Nubbin carries on a cord. It is never fed, and never needs to be.',
      },
      {
        id: 'a18-long-table-bookmark',
        kind: 'item',
        label: 'Long Table Bookmark',
        description: 'A strip of paper painted like a long table laid for everyone. It marks the Doll in the Pocket page and counts towards the Long Table festival.',
      },
      {
        id: 'a18-yaga-oats',
        kind: 'decor',
        label: 'Baba Yaga’s Oats',
        description: 'A small sack of grey oats tied with bark, given for feeding others first (crust: nubbin). Nubbins like to sleep against it.',
      },
      {
        id: 'a18-hanky-cloth',
        kind: 'feature',
        label: 'The Doll’s Handkerchief',
        description: 'A cloth the size of a handkerchief, woven on a tiny loom, fine as breath (crust: doll). It lines your Nubbin’s bed in the Grove.',
      },
      {
        id: 'a18-shirt-button',
        kind: 'cosmetic',
        label: 'A Plain Shirt Button',
        description: 'The spare button from the plainest of the Tsar’s twelve shirts, the one you sewed (crust: self). Your Nubbin wears it on a thread.',
      },
    ],
    sets: { 'a18-16': true, 'a18-done': true },
    childLines: {
      'a18-16-complete#5': CHILD_POCKET,
      'a18-16-complete-doll#6': CHILD_POCKET,
      'a18-16-complete-self#6': CHILD_POCKET,
    },
    notes:
      'CRUST PAYOFF (a18-crust). Step 2: the scene shown, a18-16-shirts, is for nubbin and doll; for self play ' +
      'ATLAS_A18_VARIANTS a18-16-shirts-self (you sew one of the twelve). Complete: the scene shown, a18-16-complete, is ' +
      'for nubbin (the bag of oats comes home). For doll play a18-16-complete-doll (Vasilisa gives you the handkerchief: ' +
      '"She wants your little one to have something"); for self play a18-16-complete-self (the Tsar picks your shirt as ' +
      'the plainest, and you keep its spare button). In every path the doll stays in Vasilisa’s pocket. ' +
      'REWARDS: the doll charm and the Long Table bookmark on every path. Grant only the keepsake matching a18-crust: ' +
      'nubbin → a18-yaga-oats, doll → a18-hanky-cloth, self → a18-shirt-button. All one-time. ' +
      'LIFTED TEXT: the tale’s last words, as a fragment inside our own sentence, at A16_END#1 in all three complete ' +
      'scenes (a18-16-complete#5, a18-16-complete-doll#6, a18-16-complete-self#6). ' +
      'SABLE (read-only): if Sable is bonded in the Grove, play ATLAS_A18_VARIANTS a18-16-sable straight after ' +
      'a18-16-complete*, as the atlas shuts. ' +
      'SIM: (a) the doll charm is a cosmetic pouch on a cord, worn by one Nubbin at a time. (b) The handkerchief cloth ' +
      'lines your Nubbin’s bed in the Grove (Tier 2): a texture swap on the bed, read through a read-only ' +
      'atlasFlag(\'a18-crust\') lookup beside atlasDone(id). (c) The bookmark is an atlas item; the Long Table festival ' +
      '(A11, A13, A17, A18, A22, any two) reads atlasDone(\'A18\'), and when A18 is done the festival lays one empty ' +
      'place at the table with the best morsels on it, "for the doll". (d) The merchant’s silver thimble is a story beat ' +
      'only, not a reward.',
  },
];

// =================================================================== variants

/**
 * Variant scenes chosen by flags. Each quest's notes say which scene each replaces.
 *   a18-crust (A18-9): a18-10-chores-*, a18-11-poppy-self, a18-12-gate-*, a18-13-dark-*,
 *     a18-15-loom-done-*, a18-16-shirts-self, a18-16-complete-*.
 *   s24Done (Grove, read-only): a18-02-margin-hazel.
 *   Sable bonded (Grove, read-only): a18-16-sable.
 */
export const ATLAS_A18_VARIANTS: Scene[] = [
  // ---------------------------------------------------------------- Hazel's margin note (s24Done)
  {
    id: 'a18-02-margin-hazel',
    lines: [
      N('Beside the cellar picture, low in the margin, there is a pencil note you have never noticed. You know the hand.'),
      N('“Feed them first. Somebody’s mother said it before I did.”', 'soft'),
      N('And under it, one letter: H.'),
      N('Your Nubbin puts its chin on the page, right on the H, and leaves it there.'),
    ],
  },
  // ---------------------------------------------------------------- A18-10, step 2 (doll, self)
  {
    id: 'a18-10-chores-doll',
    lines: [
      ...A10_WORK,
      N('The doll was fed twice last night, and it works like two dolls. When you get to the barn, the oats are already sifted.'),
      N('Every husk is gone, and every black grain, and the sack is tied. Your share was done before you were awake.'),
      N('You pick up the broom. The doll takes it out of your hands, firmly, and gives you a stool to sit on.'),
      N('So you sit. It is a very strange morning, being the only one in the hut doing nothing.'),
      N('Once, going past with the washing, the doll pats your Nubbin on the head. It doesn’t stop working to do it.'),
    ],
  },
  {
    id: 'a18-10-chores-self',
    lines: [
      ...A10_WORK,
      N('Your crust is inside you, and your arms work. So you sift your share yourself, the slow way, a handful at a time.'),
      N('A quarter of oats is a great many oats. Your Nubbin is hungry and droopy, and lies on the sack and watches.'),
      N('The doll does its share, and Vasilisa’s, and keeps the dinner going. Yours it leaves to you.'),
      N('By the time the white light is high, your hands are raw and the chaff is up to your knees.'),
      N('By the time it has gone red and low, you are done, every husk. You checked twice.'),
    ],
  },
  // ---------------------------------------------------------------- A18-11, step 2 (self)
  {
    id: 'a18-11-poppy-self',
    lines: [
      N('The doll climbs down off the table and walks into the poppy seed, and the seed and the earth start running apart around it.'),
      N('It works Vasilisa’s half, and leaves your half alone.'),
      N('It looks at you once, and you understand that it isn’t unkind. It is only fair.'),
      N('So you pick earth out of poppy seed, speck by speck, with the point of a pin and a great deal of patience.'),
      N('Your Nubbin, hungry and slow today, sits by your elbow and noses the specks you’ve missed towards you.'),
      N('By dusk your eyes are watering, and it is done.'),
      N('The doll walks all the way round your half, slowly, and finds nothing wrong with it.'),
    ],
  },
  // ---------------------------------------------------------------- A18-12, step 3 done (doll, self)
  {
    id: 'a18-12-gate-doll',
    lines: [
      N('At the gate, Baba Yaga stops you with one long finger. She bends and sniffs your pockets, and Vasilisa’s, and frowns.'),
      BY('Twice the work done, and nobody tired. I don’t ask how. I don’t ask whose hands.', 'think'),
      BY('Go on. Don’t come back.'),
    ],
  },
  {
    id: 'a18-12-gate-self',
    lines: [
      N('At the gate, Baba Yaga stops you with one long finger. She takes your hand, turns it over, and looks at the blisters.'),
      BY('Hm. Honest, at least.', 'think'),
      BY('You worked. I pay for work.'),
      N('She tips a fair handful of oats into your palm, folds your fingers over it, and pushes you out of the gate.'),
    ],
  },
  // ---------------------------------------------------------------- A18-13, step 1 (doll, self)
  {
    id: 'a18-13-dark-doll',
    lines: [
      N('The wood at night is a different wood. The skull’s light makes a small round room of it, and you walk inside the room.'),
      N('Your Nubbin rides inside your coat with its eyes shut tight. Every time an owl calls, it shivers.'),
      N('Vasilisa goes first, holding the skull out in front of her, as far from herself as she can.'),
      V('It keeps looking at me. Not at the path. At me.', 'sad'),
      N('In her pocket the doll is warm and full. Her steps are surer than yours, and she never once looks back.'),
      N('You walk all night and all the next day. The skull’s light goes pale in the sun, but never goes out.'),
    ],
  },
  {
    id: 'a18-13-dark-self',
    lines: [
      N('The wood at night is a different wood. The skull’s light makes a small round room of it, and you walk inside the room.'),
      N('Your Nubbin rides inside your coat with its eyes shut tight. Every time an owl calls, it shivers.'),
      N('Somewhere in the night you open your fist and give it Baba Yaga’s oats, a few at a time, as you walk.'),
      N('It eats them all, and stops shivering. Late, but not too late.', 'soft'),
      V('You gave it your wages.', 'soft'),
      N('You walk all night and all the next day. The skull’s light goes pale in the sun, but never goes out.'),
    ],
  },
  // ---------------------------------------------------------------- A18-15, step 2 done (doll, self)
  {
    id: 'a18-15-loom-done-doll',
    lines: [
      A15_LOOM,
      N('Beside it stands a second loom, no bigger than a slipper. On it, half woven, is a cloth the size of a handkerchief.'),
      V('That one isn’t for me. She won’t say who it’s for. I can guess.', 'happy'),
    ],
  },
  {
    id: 'a18-15-loom-done-self',
    lines: [
      A15_LOOM,
      N('Your Nubbin is awake and helping, handing up the bobbins one at a time. It has kept close to your hands ever since the oats.'),
    ],
  },
  // ---------------------------------------------------------------- A18-16, step 2 (self)
  {
    id: 'a18-16-shirts-self',
    lines: [
      ...A16_COURT,
      V('Will you sew one? You’ve good hands now. I saw them on the oats.'),
      N('So you sew one shirt of the twelve, slowly, a stitch at a time, the way you sifted. It comes out very plain and very straight.'),
      N('Your Nubbin sorts the buttons. It keeps back the plainest two for your shirt, and guards them.'),
    ],
  },
  // ---------------------------------------------------------------- A18-16, complete (doll, self)
  {
    id: 'a18-16-complete-doll',
    lines: [
      ...A16_HOME,
      V('She wove this on her little loom. She wants your little one to have something.', 'soft'),
      N('A cloth the size of a handkerchief, fine as breath. Your Nubbin sniffs it, and lies down on it at once.'),
      ...A16_END,
    ],
  },
  {
    id: 'a18-16-complete-self',
    lines: [
      ...A16_HOME,
      N('At the wedding the Tsar wears one shirt you know: yours, the plainest of the twelve. He says it is for ordinary days.'),
      N('Vasilisa presses its spare button into your hand. It is plain, and white, and yours.'),
      ...A16_END,
    ],
  },
  // ---------------------------------------------------------------- Sable bonded (Grove, read-only)
  {
    id: 'a18-16-sable',
    lines: [
      N('You shut the atlas. Under the cottage table, in the dark, something grey has been waiting for you to come back.'),
      N('Sable. She has the little painted doll between her paws, held very carefully, the way she would hold an egg.'),
      N('She doesn’t give it back, and she doesn’t run. After a while she puts her chin down on it and shuts her eyes.', 'soft'),
      N('Your Nubbin looks at its empty pouch, and then at her, and sits down beside her to wait.'),
    ],
  },
];

// =================================================================== flags and checks

/** Every flag this line sets (Atlas save only). It reads s24Done and Sable's trust stage, and writes no Grove flag. */
export const ATLAS_A18_FLAGS: string[] = [
  'a18-01',
  'a18-02',
  'a18-03',
  'a18-04',
  'a18-05',
  'a18-06',
  'a18-07',
  'a18-08',
  'a18-09',
  'a18-10',
  'a18-11',
  'a18-12',
  'a18-13',
  'a18-14',
  'a18-15',
  'a18-16',
  'a18-done', // A18-16: the whole page; read by atlasDone('A18') for the Long Table festival and the doll charm
  'a18-crust', // nubbin | doll | self (a18-09-crust): A18-10, -11, -12, -13, -15, -16, the keepsake and the Grove bed lining
];

export const ATLAS_A18_CHECKS: string[] = [
  'visit:a18-merchant:house',
  'wait:a18-mother:door',
  'find:a18-vasilisa:cellar',
  'watch:a18-doll:cellar',
  'place:a18-morsels:cellar',
  'talk:a18-stepmother:yard',
  'watch:a18-doll:garden',
  'puzzle:a18-busy:yard',
  'walk:a18-page:years',
  'watch:a18-stepmother:gate',
  'wait:a18-suitor:gate',
  'talk:a18-merchant:sledge',
  'carry:a18-bundles:forest-house',
  'walk:a18-path:birch-wood',
  'sit:a18-candle:table',
  'watch:a18-wick:table',
  'feed:a18-doll:cellar',
  'walk:a18-wood:night',
  'watch:a18-riders:dawn',
  'watch:a18-riders:dusk',
  'inspect:a18-fence:hut',
  'wait:a18-yaga:gate',
  'talk:a18-yaga:gate',
  'carry:a18-supper:stove',
  'choose:a18-crust:table',
  'sit:a18-doll:stove',
  'collect:a18-chores:yard',
  'watch:a18-hands:barn',
  'talk:a18-yaga:list',
  'collect:a18-poppy:barn',
  'watch:a18-hands:poppy',
  'sit:a18-yaga:supper',
  'choose:a18-question:table',
  'talk:a18-yaga:blessing',
  'walk:a18-skull:wood',
  'wait:a18-skull:edge',
  'carry:a18-skull:stepmother-house',
  'deliver:a18-skull:house',
  'sit:a18-hearth:night',
  'build:a18-mound:birch',
  'visit:a18-old-woman:town',
  'collect:a18-loom-parts:town',
  'place:a18-linen:meadow',
  'deliver:a18-linen:palace',
  'craft:a18-shirts:old-woman-house',
  'escort:a18-vasilisa:palace',
];
