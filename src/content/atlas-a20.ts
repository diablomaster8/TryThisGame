/**
 * Atlas campaign, page A20: The Weeping (Part M, rank 20). Seventeen quests, A20-1 to A20-17.
 *
 * SOURCE. Snorri Sturluson, the Prose Edda (Edda), Gylfaginning, written in Iceland in the 1220s:
 * Baldr (ch. XXII and XLIX), Loki's capture and binding (ch. L), the Fimbulwinter and Ragnarök
 * (ch. LI) and the green earth (ch. LIII). Rights: Snorri's text is public domain; the lifted
 * passages are from Arthur Gilchrist Brodeur's translation, The Prose Edda (The American-
 * Scandinavian Foundation, New York, 1916), public domain. Nothing from any film, comic, game or
 * modern retelling: no Marvel, no horned helmets, no superhero designs.
 *
 * AUDIENCE. 'all', rated All with care (Part M). Every lifted line has a `childLines` replacement
 * for the Learning Grove. The Learning Grove's own edu version (softened, no lifted text: Iceland,
 * Snorri, why frost "weeps", mistletoe, the solstice, Heathenry today) is a separate file still to
 * do; this file gives only `childLines`, as the script brief asks of Atlas pages.
 *
 * FRAME. Nova's atlas falls open at a page washed in grey and gold: a bright hall, a hall of
 * mists, a long white plain. The page's intro card (a20-01-page#1–3) says this is one telling,
 * written down by a Christian in the 1220s, not scripture, and that these gods are honoured today.
 * You and your Nubbin are guests in Frigg's hall, Fensalir, and run her errands. Baldr, Frigg,
 * Hödr, Hermódr and the gods keep their story: you carry, ride behind, ask, and sit. Your Nubbin
 * never talks; nor do the beasts and birds (Snorri gives them no speech). Running thread: your
 * Nubbin falls asleep in Baldr's light in A20-1 and is always trying to get back to it; in A20-6
 * it goes to Hödr instead; in A20-17 it finds the light again, and then comes back to you on its
 * own.
 *
 * GROVE FLAGS READ (read-only; the Atlas never writes a Grove flag):
 *   - cinder (S19: forgiven | remembered). Your Nubbin carries Cinder's Ember (S19's red pebble)
 *     in a little lantern on this page. Inserts: a20-01-ember (A20-1), a20-11-ember (A20-11: it
 *     sets the frost weeping faster), a20-15-ember-forgiven | a20-15-ember-remembered (A20-15:
 *     it keeps Líf and Lífthrasir warm, steady or flickering), a20-17-ember (A20-17: Líf asks
 *     where it came from; a choice with no flag). S19 only opens when keptStone is false, so
 *     cinder and keptStone never both hold.
 *   - keptStone. Inserts: a20-12-kept (Thökk looks at your pocket: "You understand." "Keep
 *     what you have."), a20-15-kept (the stone hums safe in the holt; the pair sit further off).
 *     Nothing else changes.
 *   - s24Done (S24). Hazel's margin note beside the cave (A20-12): ATLAS_A20_VARIANTS
 *     'a20-margin-hazel', its text exactly as S24's notes give it.
 *
 * FLAGS WRITTEN (Atlas save only, all prefixed a20-):
 *   - a20-01 … a20-17: each quest on completion. a20-done: the whole page (A20-17); the Price of
 *     Power festival reads it through atlasDone('A20').
 *   - a20-thokk = plead | sat | walked (A20-12, a20-12-cave), the signature choice. It pays off in
 *     A20-14 (a20-14-bowl*), A20-16 (a20-16-edge*) and A20-17 (a20-17-complete*): who sits
 *     closest to Hödr at the end (you, Baldr, or no one at first).
 *
 * LIFTED TEXT (verbatim; Brodeur 1916, Gylfaginning, as Part M checked it against the
 * sacred-texts copy of Brodeur; set with the game's curly quotes; each used once, each keyed in
 * `childLines`):
 *   1. "He is so fair of feature, and so bright, that light shines from him." (ch. XXII)
 *      Narration, a20-01-hall#3.
 *   2. "There grows a tree-sprout alone westward of Valhall: it is called Mistletoe; I thought it
 *      too young to ask the oath of." (ch. XLIX) Frigg, a20-05-talk#5.
 *   3. "But when the Æsir tried to speak, then it befell first that weeping broke out, so that
 *      none might speak to the others with words concerning his grief." (ch. XLIX) Narration,
 *      a20-06-fall#5.
 *   4. "If all things in the world, quick and dead, weep for him, then he shall go back to the
 *      Æsir;" (ch. XLIX) Hel, a20-10-hall#6. Our own words finish her sentence at #7.
 *   5. "and all men did this, and quick things, and the earth, and stones, and trees, and all
 *      metals,—even as thou must have seen that these things weep when they come out of frost and
 *      into the heat." (ch. XLIX) Narration, split over a20-11-stones#5 (with a leading ellipsis
 *      to mark the excerpt) and #6. Brodeur prints a double hyphen for the dash; it is set as an
 *      em dash here.
 * NOT quoted: Part M's passages 6–8 (ch. LI "frosts shall be great then…", ch. LIII "In that time
 * the earth shall emerge…" and "After that Baldr shall come there…") were checked only through a
 * course reader, so they count as unverified. Their beats are told in our own words at
 * a20-15-plain#1, a20-17-green#0–1 and a20-17-old-ground#5. Thökk's verse is left out (unchecked;
 * she refuses in plain speech). Every other line is original.
 *
 * CARE NOTES.
 *   - Heathenry. The Norse gods are honoured by living communities today (Heathenry; Iceland's
 *     Ásatrúarfélagið is a registered religious body). The gods are shown with dignity, as Snorri
 *     shows them: no jokes at their expense, no superhero designs. The small comedy belongs to
 *     the Nubbin. Before ship this script needs a read by an adviser from an inclusive Heathen
 *     organisation (Part M asks for one; none was available when this was written).
 *   - Snorri was a Christian writing in the 1220s, and his book is one telling, not scripture. The
 *     intro card says so (a20-01-page#1–3).
 *   - Symbols. No runes, valknuts or other symbols that hate groups have taken over, anywhere in
 *     the art. Any lettering on the page is plain.
 *   - Mistletoe. The later story that Frigg made mistletoe a sign of love and kissing is not in
 *     Snorri and is not used.
 *   - Softened for All, and we say so. Baldr's death is one fall with no wound (a20-06-fall).
 *     Nanna's death of grief is one line (a20-08-pyre#0). No flames on the bodies: the ship is
 *     seen going out as a light on the water. The dwarf Litr is cut. Loki's binding is three
 *     stones, the snake and Sigyn's bowl; the bonds are not shown, and his sons and the entrails
 *     are cut. Ragnarök is seen from far off with no deaths shown (A20-16).
 *   - A soft content line plays before A20-6 (a20-06-field#0; show it as a card).
 *   - Hel is grave, not monstrous: half her face "the colour of a winter dusk", no more.
 *   - Our inventions, kept small: Frigg spins a thread for every promise (A20-3), Fulla as a
 *     speaking maid, Hödr at the shore and the gift you lay on the ship (A20-8), Sigyn's second
 *     bowl (A20-14, the outline's sat path), and the order change in A20-7 (see its notes).
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

const WHERE = 'Nova’s atlas: the Weeping page (Atlas campaign)';
const after = (code: string) => `Any time after ${code}, from Nova’s atlas.`;
const SNORRI = 'Prose Edda (Snorri Sturluson, Iceland, 1220s), Gylfaginning';

// ------------------------------------------------------------------ speakers

const FRIGG = sp('a20-frigg', 'Frigg', 'Frigg, Odin’s wife and Baldr’s mother (Snorri, Gylfaginning); original design');
const FULLA = sp('a20-fulla', 'Fulla', 'Fulla, Frigg’s handmaid (Snorri, Gylfaginning); original design');
const BALDR = sp('a20-baldr', 'Baldr', 'Baldr the Good, Odin’s son (Snorri, Gylfaginning ch. XXII and XLIX); original design');
const HODR = sp('a20-hodr', 'Hödr', 'Hödr, Baldr’s blind brother (Snorri, Gylfaginning ch. XXVIII and XLIX); original design');
const THOR = sp('a20-thor', 'Thor', 'Thor (Snorri, Gylfaginning); original design, no superhero or film look');
const ODIN = sp('a20-odin', 'Odin', 'Odin, the Allfather (Snorri, Gylfaginning); original design');
const CRONE = sp('a20-crone', 'The Old Woman', 'The old woman who visits Frigg in Fensalir (Loki in disguise, Gylfaginning ch. XLIX)');
const VOICE = sp('a20-voice', 'A Voice', 'The one who guides Hödr’s arm (Loki, Gylfaginning ch. XLIX); never shown');
const HERMODR = sp('a20-hermodr', 'Hermódr', 'Hermódr the Bold, Odin’s son (Snorri, Gylfaginning ch. XLIX); original design');
const NANNA = sp('a20-nanna', 'Nanna', 'Nanna, Baldr’s wife (Snorri, Gylfaginning ch. XLIX); original design');
const MODGUDR = sp('a20-modgudr', 'Módgudr', 'Módgudr, keeper of the Gjöll bridge (Snorri, Gylfaginning ch. XLIX); original design');
const HEL = sp('a20-hel', 'Hel', 'Hel, ruler of the realm of the dead (Snorri, Gylfaginning ch. XXXIV and XLIX); original, dignified design');
const MESSENGER = sp('a20-messenger', 'A Messenger', 'One of the messengers the gods send over the world (Gylfaginning ch. XLIX)');
const THOKK = sp('a20-thokk', 'Thökk', 'Thökk, the giantess in the cave (Gylfaginning ch. XLIX; men believe she was Loki)');
const SIGYN = sp('a20-sigyn', 'Sigyn', 'Sigyn, Loki’s wife (Snorri, Gylfaginning ch. L); original design');
const LIF = sp('a20-lif', 'Líf', 'Líf, who hides in Hoddmímir’s Holt (Snorri, Gylfaginning ch. LIII); original design');
const LIFTHRASIR = sp('a20-lifthrasir', 'Lífthrasir', 'Lífthrasir, who hides in Hoddmímir’s Holt (Gylfaginning ch. LIII); original design');
const VIDARR = sp('a20-vidarr', 'Vídarr', 'Vídarr, Odin’s son, who lives on after Ragnarök (Gylfaginning ch. LIII); original design');

const N = say('narrator');
const Y = say('you');
const FR = say('a20-frigg');
const FU = say('a20-fulla');
const BA = say('a20-baldr');
const HO = say('a20-hodr');
const TH = say('a20-thor');
const OD = say('a20-odin');
const CR = say('a20-crone');
const VO = say('a20-voice');
const HE = say('a20-hermodr');
const NA = say('a20-nanna');
const MO = say('a20-modgudr');
const HL = say('a20-hel');
const MS = say('a20-messenger');
const TK = say('a20-thokk');
const SI = say('a20-sigyn');
const LI = say('a20-lif');
const LT = say('a20-lifthrasir');
const VI = say('a20-vidarr');

// ------------------------------------------------------------------ lifted text (verified)

/** Gylfaginning ch. XXII (Brodeur, 1916). */
const LIFT_BRIGHT = 'He is so fair of feature, and so bright, that light shines from him.';
/** Gylfaginning ch. XLIX (Brodeur, 1916). Frigg. */
const LIFT_MISTLETOE =
  'There grows a tree-sprout alone westward of Valhall: it is called Mistletoe; I thought it too young to ask the oath of.';
/** Gylfaginning ch. XLIX (Brodeur, 1916). */
const LIFT_WEEPING =
  'But when the Æsir tried to speak, then it befell first that weeping broke out, so that none might speak to the others with words concerning his grief.';
/** Gylfaginning ch. XLIX (Brodeur, 1916). Hel; the sentence runs on in our own words. */
const LIFT_HEL = 'If all things in the world, quick and dead, weep for him, then he shall go back to the Æsir;';
/** Gylfaginning ch. XLIX (Brodeur, 1916), split over two lines; Brodeur’s double hyphen set as an em dash. */
const LIFT_WEEP_A = '…and all men did this, and quick things, and the earth, and stones, and trees, and all metals,—';
const LIFT_WEEP_B = 'even as thou must have seen that these things weep when they come out of frost and into the heat.';

// ------------------------------------------------------------------ shared pieces

/** A20-16: the far sight, before the ship (all three Thökk variants). */
const A16_OPEN: Line[] = [
  N('From the edge of the holt you can see a long way: the white plain, the grey sea beyond it, and the sky.'),
  N('Something is happening at the end of the world. It is very far off, and you see it the way you see weather on the hills.'),
  N('Wolves are running across the sky, after the sun and after the moon. They are small with distance, and fast.'),
];

/** A20-16: the far sight, after the ship (all three Thökk variants). */
const A16_CLOSE: Line[] = [
  N('On the far edge of the world there is a line of fire, low down, like a sunset in the wrong place.'),
  N('None of it comes near. The holt is very quiet, and your Nubbin is holding on to a root with both arms.'),
];

/** A20-17: the opening of the complete scene (all three Thökk variants). */
const A17_START: Line[] = [N('The sun goes over the new land. The talk goes on, slow and easy, as if there will always be more of it.')];

/** A20-17: the sprig, the Nubbin's choice and the way home (all three Thökk variants). */
const A17_END: Line[] = [
  N('Before you go, Baldr puts something in your hand: a sprig with two leaves, from a tree at the edge of the old ground.'),
  BA('It was too young to be asked, once. It’s older now. So am I. Keep it for me.', 'soft'),
  N('Your Nubbin wakes in his light and looks at him for a long moment. Then it gets up and comes back to you, on its own.'),
  N('Líf and Lífthrasir walk out together into the morning, across the fields that nobody sowed.'),
  N('You are back in the Grove, the atlas on your knee. There is a golden game piece in your pocket, and your Nubbin is holding a sprig.'),
];

// =================================================================== THE WEEPING

export const ATLAS_A20: Quest[] = [
  // ---------------------------------------------------------------- A20-1
  {
    id: 'a20-01',
    code: 'A20-1',
    title: 'The Bright One',
    source: `${SNORRI}, ch. XXII: Baldr and Breidablik`,
    audience: 'all',
    trigger: { where: WHERE, when: 'Any time once Nova’s atlas is in the Grove; the first quest on the page.' },
    speakers: [FRIGG, FULLA, BALDR],
    steps: [
      {
        id: 'a20-01-s1',
        goal: 'Step into the grey-and-gold page and find Frigg’s hall.',
        hint: 'Touch the page, then go in at the door where the spindle is turning.',
        check: 'explore:a20-fensalir:door',
        scene: {
          id: 'a20-01-page',
          lines: [
            N('Nova’s atlas falls open at a page washed in grey and gold: a bright hall, a hall of mists, and a long white plain.'),
            N('Across the top, in plain letters: a story from the Prose Edda, written down in Iceland about eight hundred years ago.'),
            N('Snorri Sturluson wrote it down. He was a Christian, setting out the old stories of his people’s gods.'),
            N('His book is one telling, not scripture. These gods are still honoured today, by people whose faith is called Heathenry.'),
            N('The page goes cool and soft under your hand, like linen off the line. Then it is swept boards, and you are standing on them.'),
            N('A long hall, full of the small sound of a spindle. A woman sits by the fire with her work in her lap, and looks up.'),
            FR('A guest. Come in out of the draught. This is Fensalir, and I am Frigg.'),
            FR('There are more errands in this house than there are hands. Will you run some of them, while you stay?', 'soft'),
            FU('And the small one? Does it carry things?'),
            N('Your Nubbin holds up both arms, to show it will carry anything at all.'),
          ],
          choices: [
            {
              id: 'bow',
              label: 'Bow, as you would to someone old and kind.',
              then: [
                N('Frigg inclines her head to you, exactly as low as you bowed to her.'),
                FR('Guests and hosts bow the same distance in this house. It saves a great deal of arguing.'),
              ],
            },
            {
              id: 'name',
              label: 'Say your name, plainly.',
              then: [
                FR('A good name. I’ll remember it.', 'soft'),
                N('She says it back to you once, and you have the odd feeling it has been written down somewhere.'),
              ],
            },
            {
              id: 'carry',
              label: 'Ask what needs carrying first.',
              then: [FU('Oh, I like this one.', 'happy')],
            },
          ],
        },
        done: {
          id: 'a20-01-page-done',
          lines: [
            FR('Then the first errand is the easiest. Take this cloak up the hill to my son. He gives his away to anyone who looks cold.'),
            FU('Breidablik. The hall on the rise. You can’t miss it. Nobody ever has.'),
          ],
        },
      },
      {
        id: 'a20-01-s2',
        goal: 'Carry Frigg’s cloak up to Breidablik, Baldr’s hall.',
        hint: 'Follow the path up the rise to the pale hall; you will see it long before you reach it.',
        check: 'deliver:a20-cloak:breidablik',
        scene: {
          id: 'a20-01-hall',
          lines: [
            N('Breidablik stands on a rise above everything. Its roof is so pale it is hard to say where it stops and the sky begins.'),
            N('Fulla said nothing unclean can be in this hall. You wipe your feet twice, and your Nubbin wipes both of its.'),
            N('Inside there is a long table, and a man at it, mending a strap. He looks up.'),
            N(LIFT_BRIGHT),
            BA('You’ve come from my mother. I know her cloak. She thinks I’m always cold.', 'happy'),
            BA('I’m never cold. Put it on the bench, and sit. Everyone who climbs this far ought to sit.'),
            N('The light off him is like sun off snow in the morning: everywhere at once, and easy on the eyes.'),
            N('Your Nubbin sits down in it, and blinks, and slowly tips over sideways.'),
            BA('Ah. It does that to the small ones. Leave it be. It will wake when it’s ready.', 'soft'),
          ],
        },
        done: {
          id: 'a20-01-hall-done',
          lines: [
            N('Your Nubbin is asleep on the warm boards, in the brightest part of the floor, with one arm over its face.'),
            BA('Stay till it wakes. I’d like the company.'),
          ],
        },
      },
      {
        id: 'a20-01-s3',
        goal: 'Sit with Baldr while your Nubbin sleeps.',
        hint: 'Take the bench by the long table; there is no hurry in this hall.',
        check: 'sit:a20-baldr:breidablik',
        scene: {
          id: 'a20-01-sit',
          lines: [
            N('You sit on the bench. Baldr goes back to his strap, and for a while there is no sound but the needle going through leather.'),
            BA('My mother says you’re running her errands. That’s kind. She has more of them than usual this year.'),
            BA('Everyone climbs up here in the end with a question. Mostly it’s which of two people is right.'),
            BA('I tell them as kindly as I can. It’s the part of the day I like best.', 'happy'),
            N('He looks over at your Nubbin, which is snoring very slightly in the light.'),
            BA('Ask me something, then. You’ve climbed as far as anyone.'),
          ],
          choices: [
            {
              id: 'bright',
              label: 'Ask him why he is so bright.',
              then: [BA('I don’t know. I’ve never been anything else. I’d like to see the dark properly one day, just to know.', 'think')],
            },
            {
              id: 'brother',
              label: 'Ask him if he has brothers.',
              then: [
                BA('Hödr. He’s blind, and stronger than any of us, and he laughs at my jokes before I finish them.', 'happy'),
                BA('You’ll meet him. He’s always just outside where the noise is, listening.'),
              ],
            },
            {
              id: 'sit',
              label: 'Don’t ask anything. Just sit.',
              then: [
                N('So you sit. After a while Baldr puts the strap down and sits too, doing nothing, as if he never gets the chance.'),
                BA('That was a good question.', 'soft'),
              ],
            },
          ],
        },
      },
    ],
    complete: {
      id: 'a20-01-complete',
      lines: [
        N('Your Nubbin wakes when the light moves across the floor. It gets up and moves after it.'),
        BA('It’ll follow me about now. The small ones do. I don’t know what they think they’ll find.', 'soft'),
        N('He folds his mother’s cloak and lays it on the end of the bench, where he will see it every time he passes.'),
        BA('Tell her I’ll wear it. She’ll know I mean it kindly.', 'happy'),
        N('Going down the hill, your Nubbin stops every few steps to look back at the pale hall.'),
      ],
    },
    rewards: [],
    sets: { 'a20-01': true },
    childLines: {
      'a20-01-hall#3': 'He is so kind and so glad that he seems to shine, and the whole room is lighter for him.',
    },
    notes:
      'OPENING: the page is a grey-and-gold wash (a bright hall, a hall of mists, a long white plain) and colours in as you ' +
      'step through. a20-01-page#1–3 are the page’s INTRO CARD, required by the care notes: show them as a plain card over ' +
      'the page before the step-through (no runes, no knotwork, plain lettering). LIFTED TEXT: a20-01-hall#3 (Brodeur ch. ' +
      'XXII), voiced as narration. ART: Baldr is a man, not a superhero; his light is soft and morning-coloured, never a ' +
      'glow effect with rays. Breidablik is pale timber, not gold. Frigg’s spindle is a plain drop spindle. ' +
      'CINDER (cinder set, S19): play ATLAS_A20_VARIANTS a20-01-ember after a20-01-page’s choice, before a20-01-page-done. ' +
      'From then on your Nubbin carries a little lantern with the red pebble in it on this page (Atlas save, a prop).',
  },

  // ---------------------------------------------------------------- A20-2
  {
    id: 'a20-02',
    code: 'A20-2',
    title: 'Bad Dreams',
    source: `${SNORRI}, ch. XLIX: Baldr’s dreams, and the gods take counsel`,
    audience: 'all',
    trigger: { where: WHERE, when: after('A20-1') },
    requires: ['A20-1'],
    speakers: [FULLA, BALDR, THOR, ODIN, FRIGG],
    steps: [
      {
        id: 'a20-02-s1',
        goal: 'Take lamp oil up to Breidablik, late at night.',
        hint: 'Fulla has the oil jar at Fensalir’s door; carry it up the rise.',
        check: 'carry:a20-oil:breidablik',
        scene: {
          id: 'a20-02-oil',
          lines: [
            N('It is late. Fensalir’s fire is down to red, and Fulla is still up, holding a jar of lamp oil.'),
            FU('His lamp’s been burning three nights running. He doesn’t sleep. Take this up to him? Mind the step.'),
            N('Breidablik is never dark, but tonight the lamp is lit as well, as if he wanted more light than his own.'),
            N('Baldr sits at the long table with his hands round a cup that has gone cold.'),
            BA('Oh. It’s you. Come in. I’m glad it’s you, and not somebody who’d ask how I am.', 'soft'),
            BA('I’ve been dreaming. The same road every night, going down. And at the bottom of it, somebody saying my name.', 'sad'),
            BA('Not unkindly. Quietly. As if they were setting a place for me.', 'sad'),
            N('Your Nubbin climbs onto the bench beside him and sits as close to his light as it can get.'),
          ],
          choices: [
            {
              id: 'only',
              label: 'Tell him dreams are only dreams.',
              then: [BA('That’s what I keep telling myself. I’m not as good at believing me as I used to be.', 'think')],
            },
            {
              id: 'tell',
              label: 'Say he should tell the others.',
              then: [BA('Yes. You’re right. I hate to worry them. But it’s worse, keeping it up here alone.')],
            },
            {
              id: 'wait',
              label: 'Sit, and wait for him to say more.',
              then: [N('You sit, and he doesn’t say more. After a while he puts his hand on your Nubbin’s head, and leaves it there.')],
            },
          ],
        },
        done: {
          id: 'a20-02-oil-done',
          lines: [
            BA('In the morning I’ll tell them. All of them. Will you walk down with me?'),
            N('He sleeps a little after that, with the lamp still lit. Your Nubbin sleeps in his light, and you keep watch.'),
          ],
        },
      },
      {
        id: 'a20-02-s2',
        goal: 'Walk down with Baldr while he tells the gods his dreams.',
        hint: 'Go with Baldr to the great hall where the gods meet, and stay by the door.',
        check: 'escort:a20-baldr:gladsheim',
        scene: {
          id: 'a20-02-telling',
          lines: [
            N('In the morning the gods are gathered in their great hall. They stop talking when Baldr comes in, because he never looks like this.'),
            N('He tells them plainly: the road, the going down, his name said quietly at the bottom of it.'),
            N('Odin listens with his one eye on his son and says nothing at all. Thor’s hands close and open on his knees.'),
            TH('A dream. Dreams are smoke. Show me the thing that means him harm, and I’ll deal with it.'),
            OD('Not every harm stands where you can reach it.', 'think'),
            FR('Then we will go where it stands. Whatever it is.'),
            N('They begin to take counsel together, slowly, the way old friends do when a matter is serious.'),
            N('Fulla finds you a stool by the door. Your Nubbin keeps edging along the floor towards Baldr’s light.'),
          ],
        },
        done: {
          id: 'a20-02-telling-done',
          lines: [N('The talk goes on through the morning and into the dark. You fetch, and carry, and listen.')],
        },
      },
      {
        id: 'a20-02-s3',
        goal: 'Keep the hall going through the long council.',
        hint: 'Keep the fire fed and the cups filled until the gods have decided.',
        check: 'wait:a20-council:gladsheim',
        scene: {
          id: 'a20-02-council',
          lines: [
            N('The hall gets dark and the fire gets low. Nobody has noticed but you.'),
            TH('We could ward him. Stand round him day and night.'),
            OD('And he would live in a ring of spears. That is no life for him.', 'sad'),
            BA('I’d rather not, if it’s all the same. I’d miss people.', 'soft'),
            N('Frigg has said nothing for a long time. She is turning something over, the way she turns her spindle.'),
            FR('Then I will ask. Everything in the world, one by one. I will ask each of them to promise not to harm him.', 'think'),
            TH('Everything? There’s a great deal of everything.'),
            FR('Then I had better start early.'),
          ],
          choices: [
            {
              id: 'fire',
              label: 'Build the fire up again.',
              then: [N('You build the fire up. Odin watches you do it, and nods, once, as if that were a kind of counsel too.')],
            },
            {
              id: 'cups',
              label: 'Fill the cups.',
              then: [N('You fill the cups, and Thor takes his with a nod. His hands are steadier for having something to hold.')],
            },
            {
              id: 'listen',
              label: 'Sit by the door and listen.',
              then: [N('You sit by the door and listen. It is the kind of night somebody should remember all of, start to finish.')],
            },
          ],
        },
      },
    ],
    complete: {
      id: 'a20-02-complete',
      lines: [
        N('By dawn it is settled. The gods go out of the hall into a cold, clear morning.'),
        FR('Tomorrow we walk. You, and I, and Fulla. We will ask the whole world.', 'soft'),
        BA('Mother. You don’t have to.'),
        FR('I know.'),
        N('Your Nubbin falls asleep on the way home, and you carry it. It is facing back up the hill.'),
      ],
    },
    rewards: [],
    sets: { 'a20-02': true },
    notes:
      'Snorri gives the dreams in one line (“great and perilous dreams touching his life”); Baldr’s road and the quiet voice ' +
      'are our own, kept unfrightening. The great hall is Gladsheim in the check id only; the text just says “their great ' +
      'hall”. Odin is shown with one eye, simply, with no wound and no eyepatch joke. No council-table comedy.',
  },

  // ---------------------------------------------------------------- A20-3
  {
    id: 'a20-03',
    code: 'A20-3',
    title: 'The Oaths',
    source: `${SNORRI}, ch. XLIX: Frigg takes oaths of all things`,
    audience: 'all',
    trigger: { where: WHERE, when: after('A20-2') },
    requires: ['A20-2'],
    speakers: [FRIGG, FULLA],
    steps: [
      {
        id: 'a20-03-s1',
        goal: 'Walk with Frigg while she asks the fire, the water, the iron and the stones.',
        hint: 'Keep a step behind Frigg; she stops at each thing she asks.',
        check: 'watch:a20-oaths:frigg',
        scene: {
          id: 'a20-03-asking',
          lines: [
            N('Frigg walks out at first light with no escort, only Fulla and you, and your Nubbin trotting to keep up.'),
            N('She stops at the hearth first, and kneels, and asks the fire. The flames lie down low along the logs, all at once.'),
            FR('That is yes. Fire never says much.'),
            N('At the spring she asks the water, and it goes still as glass. At the smithy she asks the iron, and every blade on the wall rings.'),
            N('She asks every metal by name, and the earth, and the stones. The stones say nothing, which for a stone is a promise.'),
            N('She asks the trees, every kind, a whole wood of them. They bend their tops to her as if a wind went over.'),
            FU('She asks the sicknesses herself, at night. They take the longest. They always want to argue.', 'soft'),
            FR('Everything can be asked. It only takes time, and remembering not to leave anything out.'),
            N('West of Valhall you pass an old oak. On one of its branches is a sprig so small and new it has only two leaves.'),
            N('Your Nubbin stops and looks at it. Frigg is already walking on.'),
          ],
        },
        done: {
          id: 'a20-03-asking-done',
          lines: [FR('The beasts and the birds now. My feet are older than my asking. Will you carry it for me?')],
        },
      },
      {
        id: 'a20-03-s2',
        goal: 'Carry Frigg’s asking to the beasts and the birds.',
        hint: 'Go out over the meadows and along the wood edge; anything that runs, flies or creeps should be asked.',
        check: 'deliver:a20-asking:beasts',
        scene: {
          id: 'a20-03-beasts',
          lines: [
            N('You go out over the meadows with Frigg’s asking. It sits in your mouth like a smooth stone, and you say it the way she said it.'),
            N('The hare listens with both ears and thumps the ground, once. The bear lies down flat, which takes some time.'),
            N('A reindeer lowers her antlers until they touch the grass. A fox looks away, then back, then sits.'),
            N('The birds you ask all together, from the top of a hill. They go up in one great turning cloud and come down again.'),
            N('The ravens come last. They hear you out, and nod, and fly off towards Valhall to tell somebody.'),
            N('Snakes and poisons Frigg asks herself. Some askings, she says, are not for guests.'),
            FU('That’s everything with legs and wings. Everything with neither, too. Is that all?', 'think'),
            N('Your Nubbin is tugging at your sleeve. Nobody has asked it.'),
          ],
        },
      },
      {
        id: 'a20-03-s3',
        goal: 'Let your Nubbin make its own promise.',
        hint: 'Bring your Nubbin to Frigg on Fensalir’s step.',
        check: 'talk:a20-frigg:promise',
        scene: {
          id: 'a20-03-promise',
          lines: [
            N('Frigg is sitting on Fensalir’s step, tired, with her hands open in her lap. Your Nubbin walks straight up to her.'),
            N('It stands in front of her with its feet together and its arms at its sides, as straight as it can stand.'),
            FU('Oh. It wants to be asked.', 'soft'),
            FR('Of course it does. Everything should be. Come here, little one.'),
            FR('Will you promise not to harm my son? Not ever, not by anything you do?'),
            N('Your Nubbin thinks about this for a long time, very seriously.'),
          ],
          choices: [
            {
              id: 'paw',
              label: 'Let it put its paw in Frigg’s hand.',
              then: [
                N('It puts its paw in her hand, flat, and holds it there until she closes her fingers round it.'),
                FR('That will hold.', 'soft'),
              ],
            },
            {
              id: 'bow',
              label: 'Let it bow, the way the hare did.',
              then: [
                N('It bows so low it nearly topples. Then, to be sure, it thumps the step with one foot, like the hare.'),
                FR('Twice promised. I’ll count it twice.', 'happy'),
              ],
            },
            {
              id: 'for',
              label: 'Promise for it.',
              then: [
                FR('No. Let it promise for itself. A promise carried by somebody else is only an errand.'),
                N('Your Nubbin nods at her, hard, three times. Frigg nods back three times.'),
              ],
            },
          ],
        },
      },
    ],
    complete: {
      id: 'a20-03-complete',
      lines: [
        N('By evening it is done: fire and water, iron and every metal, stones, earth and trees, sickness, beasts, birds, poison and snakes.'),
        FR('Everything has promised. Everything I could think of.', 'soft'),
        N('She has been spinning as she walked, a twist of thread for every promise. Now the spindle is full, and she cuts the thread.'),
        FR('Keep the spindle. It has done its work. I’d like it to live somewhere far away, where nothing has ever been afraid.'),
        N('Your Nubbin is already asleep on the step, facing up the hill towards the pale hall.'),
      ],
    },
    rewards: [
      {
        id: 'a20-frigg-spindle',
        kind: 'decor',
        label: 'Frigg’s Spindle',
        description: 'A plain wooden drop spindle from Fensalir, empty, its thread all spent on promises. A decoration for the cottage.',
      },
    ],
    sets: { 'a20-03': true },
    notes:
      'Snorri’s list (fire, water, iron and every metal, stones, earth, trees, sicknesses, beasts, birds, poison, snakes) is ' +
      'given in full in a20-03-complete#0. Each thing promises “in its own way”: nobody but Frigg and Fulla speaks; the ' +
      'beasts and birds are never voiced. a20-03-asking#8–9 is the only sight of the mistletoe before A20-5: a sprig with ' +
      'two leaves on an oak west of Valhall (it grows on the oak, as mistletoe does; draw it plainly, no berries-and-ribbon ' +
      'Christmas look). Frigg’s spinning a thread per promise is our invention, kept small. The spindle is decor, one-time.',
  },

  // ---------------------------------------------------------------- A20-4
  {
    id: 'a20-04',
    code: 'A20-4',
    title: 'The Game',
    source: `${SNORRI}, ch. XLIX: the gods make sport of Baldr at the Thing`,
    audience: 'all',
    trigger: { where: WHERE, when: after('A20-3') },
    requires: ['A20-3'],
    speakers: [BALDR, THOR, FULLA, HODR],
    steps: [
      {
        id: 'a20-04-s1',
        goal: 'Go with the gods to the Thing-field.',
        hint: 'Follow the crowd out to the gods’ meeting-place and its ring of stones.',
        check: 'walk:a20-thing:field',
        scene: {
          id: 'a20-04-field',
          lines: [
            N('The Thing-field is the gods’ meeting-place, a wide green with a ring of standing stones. Today it is full of laughing.'),
            N('Baldr stands in the middle of the ring. The gods stand round him, and they throw things at him.'),
            N('A stone bounces off his shoulder and lands softly in the grass. An arrow turns aside as if it had changed its mind.'),
            N('Nothing hurts him, because everything has promised. The game is a way of honouring him, and everyone wants a turn.'),
            TH('Your turn again, brother! Stand still. This one’s heavy.', 'happy'),
            BA('I’m always standing still! It’s the one thing I’m good at today!', 'happy'),
            N('Thor throws a stone the size of a loaf. It stops a hand’s width from Baldr, seems to think about it, and drops.'),
            N('Everyone laughs, and Baldr laughs most of all, with his head back.'),
          ],
        },
        done: {
          id: 'a20-04-field-done',
          lines: [N('Your Nubbin has found the edge of Baldr’s light, at the very edge of the ring. It lies down in it like a cat in a sunbeam.')],
        },
      },
      {
        id: 'a20-04-s2',
        goal: 'Join the game, or watch it from the edge.',
        hint: 'Thor will offer you something to throw; you don’t have to take it.',
        check: 'choose:a20-game:ring',
        scene: {
          id: 'a20-04-turn',
          lines: [
            TH('Guest! A guest’s throw is good luck. Here.'),
            N('He holds out a pebble from the field, smooth and grey, small enough for a child to throw.'),
            BA('Go on. It only tickles. Everything tickles now. I’ve never laughed so much in my life.', 'happy'),
            N('Outside the ring, a little apart, a tall man is standing with his hands empty. Baldr waves to him whenever something bounces.'),
            N('The tall man can’t see him wave. But he smiles each time the laughing comes, as if he can.'),
            FU('That’s Hödr, Baldr’s brother. He can’t see to throw, so he stands out there.', 'soft'),
          ],
          choices: [
            {
              id: 'throw',
              label: 'Throw the pebble, gently, underarm.',
              then: [N('Your pebble bumps off Baldr’s knee and rolls back to your feet. He bows to it, deeply, and everyone cheers.')],
            },
            {
              id: 'watch',
              label: 'Give the pebble back. Watch from the edge.',
              then: [
                TH('Fair enough. Somebody ought to keep the score.'),
                N('You go and stand at the edge of the ring, where the laughing is quieter.'),
              ],
            },
            {
              id: 'nubbin',
              label: 'Let your Nubbin have the throw.',
              then: [
                N('Your Nubbin rolls the pebble along the grass. It stops at Baldr’s feet, and he picks it up and hands it back.'),
                BA('A draw.', 'happy'),
              ],
            },
          ],
        },
      },
      {
        id: 'a20-04-s3',
        goal: 'Find Hödr outside the ring, and tell him what is happening.',
        hint: 'Walk round the outside of the stones to the tall man standing apart.',
        check: 'talk:a20-hodr:ring-edge',
        scene: {
          id: 'a20-04-hodr',
          lines: [
            N('You walk round the outside of the stones to where Hödr stands. He turns his head before you reach him.'),
            HO('You’re the guest. Frigg’s errand-runner. You walk like someone who’s been carrying things.', 'happy'),
            HO('Tell me what they’re doing. I can hear them laughing. I like to know what at.'),
            N('So you tell him: Thor’s loaf of a stone, the arrow that changed its mind, your Nubbin asleep at the edge of the ring.'),
            HO('The arrow! I wish I’d seen that.', 'happy'),
            HO('I’d throw something myself, if I could see where he was. But it isn’t a game you play blind.', 'soft'),
            N('He says it lightly. He has said it to himself a good many times before.'),
          ],
        },
        done: {
          id: 'a20-04-hodr-done',
          lines: [HO('Come and tell me the next good one. You tell it better than they do. They just laugh and expect me to know.', 'happy')],
        },
      },
    ],
    complete: {
      id: 'a20-04-complete',
      lines: [
        N('The game goes on till the light goes. Nobody is hurt; nobody can be.'),
        N('Baldr comes out of the ring with grass in his hair and puts an arm round his brother’s shoulders.'),
        BA('Did you hear about the arrow? It went round me like a dog round a puddle.', 'happy'),
        HO('I heard everything. The guest told me the rest.'),
        N('Your Nubbin follows them home, walking in Baldr’s light and holding on to Hödr’s bootlace.'),
      ],
    },
    rewards: [],
    sets: { 'a20-04': true },
    notes:
      'The game honours Baldr (Snorri: “it seemed to all a great honour”). Keep it joyful and never cruel: the things thrown ' +
      'stop, turn aside or drop; nothing strikes and bounces painfully. The Thing-field is a green with a ring of plain ' +
      'standing stones (no carvings). Hödr is introduced here so that A20-6 lands: he always stands outside the ring. The ' +
      'choice has no flag; every option ends at the edge with Hödr.',
  },

  // ---------------------------------------------------------------- A20-5
  {
    id: 'a20-05',
    code: 'A20-5',
    title: 'The Old Woman',
    source: `${SNORRI}, ch. XLIX: the old woman at Fensalir`,
    audience: 'all',
    trigger: { where: WHERE, when: after('A20-4') },
    requires: ['A20-4'],
    speakers: [FULLA, FRIGG, CRONE],
    steps: [
      {
        id: 'a20-05-s1',
        goal: 'Fetch water for Fensalir.',
        hint: 'Take the pails down to the spring and carry them back up.',
        check: 'carry:a20-water:fensalir',
        scene: {
          id: 'a20-05-water',
          lines: [
            N('Fensalir needs water, and the spring is down the slope. You take two pails, and your Nubbin takes a thimble.'),
            N('When you come back up the path, there is an old woman at the door, leaning on a stick.'),
            N('She is wrapped in so many shawls that you can see nothing of her but her hands, which do not look old at all.'),
            FU('A traveller. Frigg never turns one away. Bring the water in. She’ll want to give her a cup.'),
            N('The old woman looks at your Nubbin. Your Nubbin looks back, and then it goes and stands behind your legs.'),
            N('It has never done that before, with anyone.'),
          ],
        },
      },
      {
        id: 'a20-05-s2',
        goal: 'Sit by Fensalir’s hearth while Frigg talks with the traveller.',
        hint: 'Wind the wool by the fire, and stay in the room.',
        check: 'wait:a20-fensalir:hearth',
        scene: {
          id: 'a20-05-talk',
          lines: [
            N('Frigg gives the old woman the best seat and a cup of the new water. You sit by the hearth with a skein of wool to wind.'),
            CR('I came by the Thing-field. Such a noise. What are the gods doing there, lady?'),
            FR('Making sport. They throw at my son, and nothing harms him. Everything in the world has promised.', 'happy'),
            CR('Everything? Every single thing?', 'think'),
            FR('Every thing but one.'),
            FR(LIFT_MISTLETOE),
            N('The old woman puts her cup down very carefully, as if it had become important not to spill it.'),
            CR('Too young. Yes. Very wise.'),
          ],
          choices: [
            {
              id: 'wind',
              label: 'Keep winding the wool.',
              then: [N('You keep winding, round and round your hands, and you don’t look up. Later you will wish you had.')],
            },
            {
              id: 'look',
              label: 'Look up at the old woman.',
              then: [N('You look up. Under the shawls, for a moment, someone is smiling, and then it is only shawls.')],
            },
            {
              id: 'hold',
              label: 'Pick up your Nubbin.',
              then: [N('You pick up your Nubbin. It is trembling very slightly all over, like a cup of water on a table someone has bumped.')],
            },
          ],
        },
        done: {
          id: 'a20-05-talk-done',
          lines: [
            N('The old woman thanks Frigg, and gets up, and goes out of the door.'),
            N('You go to the doorway a moment after, and the path runs empty both ways. You didn’t see which way she went.'),
          ],
        },
      },
    ],
    complete: {
      id: 'a20-05-complete',
      lines: [
        FR('An odd guest. Kind enough. She asked a great many questions for someone so tired.', 'think'),
        FU('I’ll bolt the door tonight.'),
        FR('Whatever for? Nothing can hurt him.', 'soft'),
        N('She goes back to her work. Your Nubbin sits by the door all evening, facing west.'),
      ],
    },
    rewards: [],
    sets: { 'a20-05': true },
    childLines: {
      'a20-05-talk#5': 'There is one little green sprout, growing on an oak to the west. It was so new that I didn’t ask it.',
    },
    notes:
      'LIFTED TEXT: a20-05-talk#5 is Frigg’s answer, verbatim (Brodeur ch. XLIX). The old woman is Loki in disguise in ' +
      'Snorri, but the page never says so: we hear it, and we don’t see which way she goes (the outline’s beat). Her hands ' +
      '(a20-05-water#2) and the smile (choice look) are the only hints. ART: a bundle of shawls and a stick; never a face. ' +
      'Your Nubbin hides behind you from her, the only time it does so on the page.',
  },

  // ---------------------------------------------------------------- A20-6
  {
    id: 'a20-06',
    code: 'A20-6',
    title: 'Hödr',
    source: `${SNORRI}, ch. XLIX: the death of Baldr`,
    audience: 'all',
    trigger: { where: WHERE, when: `${after('A20-5')} The soft content line (a20-06-field#0) plays first, as a card.` },
    requires: ['A20-5'],
    speakers: [HODR, VOICE, FULLA],
    steps: [
      {
        id: 'a20-06-s1',
        goal: 'Go back to the Thing-field for the game.',
        hint: 'Walk out to the ring of stones; Hödr will be standing apart again.',
        check: 'walk:a20-thing:return',
        scene: {
          id: 'a20-06-field',
          lines: [
            N('A quiet word before this part: Baldr dies in it. It is told gently, and no hurt is shown.'),
            N('The next day the game is on again. The Thing-field is full of the gods, and the ring is full of laughing.'),
            N('Hödr stands outside the ring where he always stands, with his hands empty.'),
            N('Somebody comes up beside him. You can’t see a face, only a cloak, and a hand holding something green.'),
            VO('Why aren’t you throwing? Everyone honours your brother but you.'),
            HO('I can’t see where he is. And I’ve nothing to throw.'),
            VO('Then here’s something. A little sprig. I’ll guide your arm. Do as the others do.'),
            N('The sprig is put in his hand: two leaves. You know it, and your Nubbin knows it, and starts to run.'),
            HO('Thank you. I’d like that. I’d like to be in the game, just once.', 'happy'),
          ],
        },
      },
      {
        id: 'a20-06-s2',
        goal: 'Run for the ring.',
        hint: 'There is no reaching it in time. Go anyway.',
        check: 'watch:a20-baldr:fall',
        scene: {
          id: 'a20-06-fall',
          lines: [
            N('The hand on Hödr’s arm turns him a little, and lifts it. You are running, and the field is very wide.'),
            N('Hödr throws. The sprig goes through the air with nothing to stop it, because nobody asked it to stop.'),
            N('Baldr falls.'),
            N('He falls the way a tall thing falls when it is not ready: all at once, and then still. There is no wound to see.'),
            N('Nobody laughs. The field is so quiet you can hear the grass.'),
            N(LIFT_WEEPING),
            N('The cloak at Hödr’s elbow is gone. Nobody saw it go.'),
            N('Your Nubbin doesn’t go to Baldr. It goes past the ring and the weeping gods, straight to Hödr, and sits down by his feet.'),
          ],
        },
      },
      {
        id: 'a20-06-s3',
        goal: 'Sit with Hödr.',
        hint: 'Stay beside him outside the ring. Don’t leave him alone in it.',
        check: 'sit:a20-hodr:ring-edge',
        scene: {
          id: 'a20-06-hodr',
          lines: [
            HO('What happened? Why has it gone quiet?', 'shock'),
            HO('Somebody tell me. Why has everybody stopped?', 'shock'),
            N('Nobody answers him; the gods are weeping, and cannot speak. Your Nubbin leans against his shins.'),
            HO('You’re there. The guest. Tell me. You always tell it right.', 'sad'),
            N('You are the one who has to tell him. There is no way of telling it that is right.'),
            N('So you tell him plainly, and he doesn’t move. Then his hand opens, and lets go of nothing.'),
            HO('I only wanted to be in the game.', 'sad'),
          ],
          choices: [
            {
              id: 'sit',
              label: 'Sit down next to him, and stay.',
              then: [N('You sit down in the grass beside him. After a long time he sits down too, all at once, as if his legs decided.')],
            },
            {
              id: 'hand',
              label: 'Take his hand.',
              then: [N('You take his hand, the hand that threw. He holds on to yours as if the field were tipping.')],
            },
            {
              id: 'guided',
              label: 'Tell him somebody guided his arm.',
              then: [HO('I know. I felt it. It doesn’t help yet. It might one day. Stay anyway.', 'sad')],
            },
          ],
        },
      },
    ],
    complete: {
      id: 'a20-06-complete',
      lines: [
        N('No one may take vengeance on the Thing-field. It is a place of peace, so holy that no hand can be raised there.'),
        N('So the gods stand and weep. Odin weeps hardest, because he understands best how much has been lost.'),
        N('Hödr sits in the grass outside the ring. Nobody comes to him but you, and your Nubbin, which has not moved from his feet.'),
        FU('Bring him to Fensalir. Frigg says so. Nobody should sit out here alone tonight.', 'sad'),
      ],
    },
    rewards: [],
    sets: { 'a20-06': true },
    childLines: {
      'a20-06-fall#5': 'The gods try to speak to each other, but they are crying too hard, and nobody can find any words.',
    },
    notes:
      'CONTENT LINE (care notes): a20-06-field#0 is a soft content card before the scene, not dialogue. Keep it on screen ' +
      'until tapped. THE FALL: a20-06-fall#2 is one beat on its own; hold it. No wound, no blood, no arrow-through; the ' +
      'camera stays wide and low on the grass. Baldr is not seen after the fall in this quest. The voice at Hödr’s elbow ' +
      'is Loki in Snorri; it is a cloak and a hand only, never a face, and it is not named until A20-13. LIFTED TEXT: ' +
      'a20-06-fall#5 (Brodeur ch. XLIX), narration. Your Nubbin goes to Hödr, not Baldr: the outline’s turn. ' +
      'Snorri’s “place of peace” beat is told in our words (a20-06-complete#0). Hödr is never blamed by the page.',
  },

  // ---------------------------------------------------------------- A20-7
  {
    id: 'a20-07',
    code: 'A20-7',
    title: 'Who Will Ride',
    source: `${SNORRI}, ch. XLIX: Hermódr rides for Baldr`,
    audience: 'all',
    trigger: { where: WHERE, when: after('A20-6') },
    requires: ['A20-6'],
    speakers: [FRIGG, HERMODR, ODIN, FULLA],
    steps: [
      {
        id: 'a20-07-s1',
        goal: 'Be in Fensalir when Frigg speaks to the gods.',
        hint: 'Bring Hödr to Fensalir and stay by the door.',
        check: 'visit:a20-frigg:fensalir',
        scene: {
          id: 'a20-07-asks',
          lines: [
            N('The gods come to Fensalir in the evening, and nobody sits. Hödr sits, because you brought him a stool.'),
            N('Frigg stands by the cold hearth. She has stopped weeping, which is harder to look at.'),
            FR('Which of you will ride the road to Hel for me? Find my son, and offer her a ransom, and have all my thanks.', 'sad'),
            N('The hall is very quiet. Nobody has ridden the road to Hel and come back to tell it.'),
            HE('I will.'),
            N('It is Hermódr the Bold, Baldr’s brother, a quick, plain man who has never sat still in his life.'),
            HE('I’ll ride. Tell me the way, and I’ll ride it.'),
            FR('Thank you.', 'soft'),
          ],
        },
        done: {
          id: 'a20-07-asks-done',
          lines: [OD('Take my horse. Nothing else could make that road.')],
        },
      },
      {
        id: 'a20-07-s2',
        goal: 'Bring Sleipnir from Odin’s stable.',
        hint: 'The stable is behind the great hall; the grey horse is the one with too many legs.',
        check: 'escort:a20-sleipnir:fensalir',
        scene: {
          id: 'a20-07-sleipnir',
          lines: [
            N('Odin’s stable is long and warm and smells of hay. At the end of it stands a grey horse, taller than the door.'),
            N('Sleipnir has eight legs. Your Nubbin counts them twice, then counts its own, and looks thoughtful.'),
            N('He lets you take the halter without fuss. He has carried Odin over worse roads, and knows a serious errand.'),
            N('You lead him out. All eight hooves go down on the cobbles in an order you can’t follow.'),
            HE('Good lad. Good. We’ll go far, you and I.'),
            HE('Guest. You’ve run Frigg’s errands all this while. Will you run this one?'),
            N('He looks at the horse’s broad grey back, and then at you. There is room for two.'),
          ],
        },
      },
      {
        id: 'a20-07-s3',
        goal: 'Say goodbye to Frigg before the road.',
        hint: 'Find Frigg at Fensalir’s door; Hermódr will wait.',
        check: 'talk:a20-frigg:door',
        scene: {
          id: 'a20-07-door',
          lines: [
            N('Frigg is at the door when you come back leading Sleipnir. She has bread for each of you, and a cloak.'),
            HE('We’ll go after the ship. I’ll see my brother off first, and ride at first light.'),
            FR('Yes. He would want you there.', 'soft'),
            N('She turns to you, puts the cloak round your shoulders herself, and does up the fastening as if you were small.'),
            FR('You don’t have to go so far for my son. You came here as a guest.'),
            N('Your Nubbin is already sitting on Sleipnir’s back, holding his mane in both arms. It has decided.'),
          ],
          choices: [
            {
              id: 'home',
              label: '“We’ll bring him home.”',
              then: [FR('Don’t promise me that. Promise me you’ll try. That one, I can hold you to.', 'soft')],
            },
            {
              id: 'try',
              label: '“We’ll try.”',
              then: [FR('Thank you. That’s all I asked of the world. Trying.', 'soft')],
            },
            {
              id: 'hand',
              label: 'Say nothing. Take her hand.',
              then: [N('You take her hand. She holds it a moment, then puts it on Sleipnir’s halter, and steps back.')],
            },
          ],
        },
      },
    ],
    complete: {
      id: 'a20-07-complete',
      lines: [
        N('That night you sleep in Fensalir’s hall. Hermódr doesn’t; you hear him outside, talking to the horse in a low voice.'),
        N('Your Nubbin creeps out to the step and sits looking up at the pale hall on the rise. There is no light in it.'),
        N('For the first time since it came here, it doesn’t know which way to face.'),
        FU('Come in, small one. Come in. It’s cold.', 'soft'),
      ],
    },
    rewards: [],
    sets: { 'a20-07': true },
    notes:
      'ORDER CHANGE: in Snorri, Hermódr rides off at once and the funeral is told while he is away. Here he waits to see ' +
      'the ship off and rides at first light (a20-07-door#1), so that you can be at the shore in A20-8 and ride behind him ' +
      'in A20-9. Frigg’s ransom speech is in our own words. Sleipnir does not talk (Snorri gives him no speech). ART: ' +
      'eight legs drawn plainly and gracefully, a grey horse, nothing monstrous.',
  },

  // ---------------------------------------------------------------- A20-8
  {
    id: 'a20-08',
    code: 'A20-8',
    title: 'The Ship',
    source: `${SNORRI}, ch. XLIX: Baldr’s ship, Hringhorni`,
    audience: 'all',
    trigger: { where: WHERE, when: after('A20-7') },
    requires: ['A20-7'],
    speakers: [THOR, ODIN, FULLA, HERMODR],
    steps: [
      {
        id: 'a20-08-s1',
        goal: 'Help the gods launch Baldr’s ship.',
        hint: 'Put your shoulder to the hull with the others when Thor calls.',
        check: 'carry:a20-rollers:shore',
        scene: {
          id: 'a20-08-shore',
          lines: [
            N('Baldr’s ship is called Hringhorni. It is the greatest of all ships, and it lies on the shore on rollers, its prow to the sea.'),
            N('The gods have carried Baldr down to it, and laid him on board, and covered him. You see nothing but the cloth.'),
            TH('Now. All together. Push.'),
            N('Everyone puts a shoulder to the hull. You find a place low down by a roller, and your Nubbin finds a place under your elbow.'),
            N('The ship does not move, not a finger’s width. It is as if the shore will not let him go.'),
            TH('Again!'),
            N('Again, and nothing. The gods stand back, breathing hard, and look at one another.'),
            OD('Send to Jötunheim. There is one there who could move it.'),
          ],
        },
      },
      {
        id: 'a20-08-s2',
        goal: 'Watch for the one who comes from Jötunheim.',
        hint: 'Stand back from the hull and watch the road down from the mountains.',
        check: 'watch:a20-hyrrokkin:shore',
        scene: {
          id: 'a20-08-giantess',
          lines: [
            N('She comes down from the mountains riding a wolf, with snakes for reins. Her name is Hyrrokkin.'),
            N('The wolf is grey as old ice. Four of the gods hold it when she gets down, and even they can hardly hold it still.'),
            N('She walks to the prow of Hringhorni without a word to anyone, puts her hands on it, and pushes. Once.'),
            N('The ship goes down the rollers with a roar. Sparks jump from the rollers, and the whole shore shakes.'),
            N('Thor’s hand goes to his hammer. He is grieving, and grief looks for somewhere to go.'),
            OD('No. She came to help. Let her be.'),
            N('Thor takes his hand away. Hyrrokkin looks at him a long moment, and nods, and goes back the way she came.'),
          ],
        },
      },
      {
        id: 'a20-08-s3',
        goal: 'Lay something on the ship for Baldr, or stand back.',
        hint: 'Wade out to the ship’s side, where Fulla will take what you bring.',
        check: 'place:a20-gift:hringhorni',
        scene: {
          id: 'a20-08-pyre',
          lines: [
            N('Baldr’s wife, Nanna, has stood on the shore all morning. When the ship moves, her heart breaks with grief, and she dies there.'),
            N('They lay her on the ship beside him, gently, under the same cloth.'),
            N('Thor stands at the ship’s side and raises his hammer over them, and hallows them both, so that they go well.'),
            N('Odin lays a gold ring on the cloth. It is called Draupnir, and it is the best thing he owns.'),
            N('The ship rocks a little in the shallows, waiting.'),
            FU('Everyone gives something. You don’t have to. But you can.', 'soft'),
          ],
          choices: [
            {
              id: 'stone',
              label: 'Lay a pebble from the Thing-field.',
              then: [N('You lay a grey pebble from the game beside Draupnir. It looks small there, and exactly right.')],
            },
            {
              id: 'thread',
              label: 'Lay a twist of thread from Frigg’s spindle.',
              then: [N('You lay a twist of the thread on the cloth: one of the promises, going with him.')],
            },
            {
              id: 'back',
              label: 'Lay nothing. Stand back with Hödr.',
              then: [N('You stand back on the stones beside Hödr, who can’t see the ship. You tell him, quietly, where everything is.')],
            },
          ],
        },
      },
    ],
    complete: {
      id: 'a20-08-complete',
      lines: [
        N('Then they light the pyre and push the ship out. You don’t watch the burning; you watch the light go.'),
        N('Out on the water it is one bright thing, then a small bright thing, then a star sitting low on the sea.'),
        N('Your Nubbin stands at the edge of the waves and watches it until it is gone. Then it keeps watching the place.'),
        HE('First light.', 'sad'),
        HE('Eat something. Sleep if you can. We have a long way to go down.'),
      ],
    },
    rewards: [],
    sets: { 'a20-08': true },
    notes:
      'GENTLE AND GRAVE (care notes). Baldr and Nanna are always under the cloth; no flames are ever drawn on them. The ' +
      'pyre is lit off-screen; we see only the ship going out as a light on the water (a20-08-complete#0–1). Nanna’s death ' +
      'of grief is one line (a20-08-pyre#0). Snorri’s dwarf Litr, kicked into the fire, is cut. Hyrrokkin is a giantess, ' +
      'strong and dignified, not a joke; Thor’s anger is grief and is stopped by Odin with one line (Snorri has the gods ' +
      'ask for her peace). Thor hallows with his hammer: draw it as a plain short-hafted hammer, no film design. The choice ' +
      'has no flag. Hödr at the shore is our addition.',
  },

  // ---------------------------------------------------------------- A20-9
  {
    id: 'a20-09',
    code: 'A20-9',
    title: 'Nine Nights',
    source: `${SNORRI}, ch. XLIX: Hermódr’s ride and the Gjöll bridge`,
    audience: 'all',
    trigger: { where: WHERE, when: after('A20-8') },
    requires: ['A20-8'],
    speakers: [HERMODR, MODGUDR],
    steps: [
      {
        id: 'a20-09-s1',
        goal: 'Ride behind Hermódr down the road to Hel.',
        hint: 'Hold on to Hermódr’s belt; Sleipnir knows the way.',
        check: 'walk:a20-hel-road:dales',
        scene: {
          id: 'a20-09-dales',
          lines: [
            N('Sleipnir goes down out of the morning into dales so deep and dark that the light can’t follow.'),
            N('You ride behind Hermódr with your arms round his belt. Your Nubbin rides inside your cloak, with just its eyes out.'),
            N('You ride for nine nights. There is nothing to see: not a star, not your own hand in front of your face.'),
            HE('Still there, guest?'),
            Y('Still here.'),
            HE('Good. Keep saying so. I like to know.'),
            N('All you can hear is eight hooves, and the cold, and Hermódr breathing.'),
          ],
          choices: [
            {
              id: 'count',
              label: 'Count the nights aloud.',
              then: [N('You count them: one, two. By the sixth, Hermódr is counting with you.')],
            },
            {
              id: 'baldr',
              label: 'Talk about Baldr.',
              then: [
                HE('Yes. Tell me something he did. Anything. I don’t want to forget the sound of him.', 'sad'),
                N('You tell him about the strap Baldr was mending, and how he said everyone ought to sit. Hermódr laughs, once.'),
              ],
            },
            {
              id: 'quiet',
              label: 'Keep quiet, and hold on.',
              then: [N('You say nothing. Every so often Hermódr puts one hand back over yours on his belt, to check.')],
            },
          ],
        },
      },
      {
        id: 'a20-09-s2',
        goal: 'Cross the gold-roofed bridge over the river Gjöll.',
        hint: 'Ride up to the bridge and answer the woman who keeps it.',
        check: 'visit:a20-gjoll:bridge',
        scene: {
          id: 'a20-09-bridge',
          lines: [
            N('On the ninth night there is light ahead: a bridge over a loud river, roofed all over with gold that shines on its own.'),
            N('The river is Gjöll. A woman stands at the near end of the bridge, tall and plain, with her hands folded.'),
            MO('I am Módgudr, and I keep this bridge. Tell me your name and your kin, and why you ride it living.'),
            HE('Hermódr, Odin’s son. I ride for my brother Baldr. Has he come this way?'),
            MO('Yesterday five troops of the dead rode over this bridge, and it hardly made a sound under them.'),
            MO('Tonight it rings under one horse as if an army were crossing. You aren’t dead. None of you. Not even the small one.', 'think'),
            N('Your Nubbin puts its head out of your cloak to check.'),
            MO('Baldr rode over. Yes. The road to Hel lies down, and to the north.', 'soft'),
          ],
        },
        done: {
          id: 'a20-09-bridge-done',
          lines: [MO('Go gently. Everyone down there was somebody’s.', 'soft')],
        },
      },
    ],
    complete: {
      id: 'a20-09-complete',
      lines: [
        N('You ride on, down and to the north. The road grows wider and quieter, as if it were used to people.'),
        N('Ahead there is a gate, very tall, with no one at it.'),
        HE('Hold on. Both of you. Tighter than that.'),
        N('Your Nubbin wraps itself round your middle, under the cloak, and holds on.'),
      ],
    },
    rewards: [],
    sets: { 'a20-09': true },
    notes:
      'The nine nights are a dark screen with only sound (hooves, breath, cold wind) and the lines; the choice lines play ' +
      'over it. The Gjöll bridge’s gold roof is the only light. Módgudr’s questions and the five troops are Snorri’s beats in ' +
      'our own words. “The dead” are never shown: Módgudr only tells of them.',
  },

  // ---------------------------------------------------------------- A20-10
  {
    id: 'a20-10',
    code: 'A20-10',
    title: 'Hel’s Hall',
    source: `${SNORRI}, ch. XLIX: Hermódr in Hel, and Hel’s price`,
    audience: 'all',
    trigger: { where: WHERE, when: after('A20-9') },
    requires: ['A20-9'],
    speakers: [HERMODR, BALDR, HEL, NANNA],
    steps: [
      {
        id: 'a20-10-s1',
        goal: 'Hold on while Sleipnir leaps Hel’s gate.',
        hint: 'Hold Hermódr’s belt with both hands, and lean when he leans.',
        check: 'climb:a20-helgate:leap',
        scene: {
          id: 'a20-10-gate',
          lines: [
            N('Hermódr gets down and pulls the girth tight. Then he mounts again and turns Sleipnir back from the gate, a long way back.'),
            HE('He’s jumped worse. Not much worse. Lean when I lean.'),
            N('Sleipnir runs at the gate. Eight hooves, and then none.'),
            N('He goes over so high and so clean that he never touches it. Your stomach stays on the far side for a moment.'),
            N('Then you are down, inside, on a floor like cold stone, and it is very quiet.'),
            N('Your Nubbin puts its head out of your cloak. Then it wriggles free, drops to the floor, and runs.'),
          ],
        },
        done: {
          id: 'a20-10-gate-done',
          lines: [N('It has seen a light, not a bright one. But it would know it anywhere.')],
        },
      },
      {
        id: 'a20-10-s2',
        goal: 'Stand with Hermódr in Hel’s hall while he asks for his brother.',
        hint: 'Follow your Nubbin to the high seat and stay at Hermódr’s side.',
        check: 'talk:a20-hel:hall',
        scene: {
          id: 'a20-10-hall',
          lines: [
            N('Baldr is sitting in the high seat of the hall. His light is low, like a lamp turned down, but it is his.'),
            N('Your Nubbin is already asleep on the step below him, curled up in what light there is.'),
            BA('Brother. And the guest. You came all this way.', 'soft'),
            N('Hel comes into her hall. She is tall and grave, half her face the colour of a winter dusk, and she does not hurry.'),
            HE('Lady. Everyone above weeps for my brother. Let him ride home with me, and name your price.'),
            HL('Everyone? People say that. I will see whether he is as loved as they say.', 'think'),
            HL(LIFT_HEL),
            HL('but if one thing will not weep, he stays with me. That is my price, and it is a fair one.'),
            HE('Everything will. You don’t know him.'),
            HL('No. But I will.', 'soft'),
          ],
        },
      },
      {
        id: 'a20-10-s3',
        goal: 'Carry Baldr’s and Nanna’s gifts for home.',
        hint: 'Take what Baldr and Nanna give you, and keep it safe for the road.',
        check: 'carry:a20-gifts:hel',
        scene: {
          id: 'a20-10-gifts',
          lines: [
            N('Baldr comes down from the high seat to walk you to the door. Your Nubbin wakes and walks with him, in his light.'),
            N('He takes the ring Draupnir from his arm and puts it in Hermódr’s hand.'),
            BA('Give this back to Father, for a remembrance. He’ll want something to turn in his hands.', 'soft'),
            N('Nanna comes behind him with a folded linen smock, and a gold ring.'),
            NA('The linen is for Frigg. The ring is for Fulla. Tell her thank you, for all the times she did my hair.', 'soft'),
            BA('Guest. What did my mother say, when you left?'),
          ],
          choices: [
            {
              id: 'try',
              label: 'She asked us to try.',
              then: [BA('That’s her. She never asks for more than you can carry.', 'soft')],
            },
            {
              id: 'ask',
              label: 'She asked the whole world once. She’ll ask it again.',
              then: [BA('She will. She’ll ask until her voice gives out. Tell her I’m warm here. It’s true.', 'soft')],
            },
            {
              id: 'step',
              label: 'She sat on the step, and didn’t say anything.',
              then: [
                N('Baldr is quiet a long while.'),
                BA('Then sit with her, when you get back. She won’t ask that either.', 'soft'),
              ],
            },
          ],
        },
      },
    ],
    complete: {
      id: 'a20-10-complete',
      lines: [
        N('Your Nubbin will not leave his light. In the end Baldr picks it up himself and hands it to you at the gate.'),
        BA('Go on. I’ll be here. It isn’t so bad. There’s room, and it’s quiet, and Nanna is with me.', 'soft'),
        N('Sleipnir takes you back up the road: nine nights, the dark, the gold bridge, and Módgudr lifting one hand as you pass.'),
        HE('Everything has to weep. Everything.', 'think'),
        HE('Then we ask everything. Again.'),
      ],
    },
    rewards: [],
    sets: { 'a20-10': true },
    childLines: {
      'a20-10-hall#6': 'If everything in the world cries for him, every living thing and every stone, he may go home,',
    },
    notes:
      'LIFTED TEXT: a20-10-hall#6 is Hel’s condition, verbatim (Brodeur ch. XLIX), ending on its semicolon; #7 finishes her ' +
      'sentence in our own words (it begins with a small “but” on purpose). The childLines version of #6 ends with a comma so ' +
      '#7 still follows. HEL (care notes): grave and fair, never a monster. Snorri’s half-dark, half-flesh face is drawn as ' +
      'half her face in winter-dusk blue; no rot, no skull. The hall is quiet and dim, not frightening. Nanna’s gifts and ' +
      'Draupnir follow Snorri; the hair line is ours. Draupnir goes home with Hermódr (A20-11 shows Odin holding it).',
  },

  // ---------------------------------------------------------------- A20-11
  {
    id: 'a20-11',
    code: 'A20-11',
    title: 'Everything Weeps',
    source: `${SNORRI}, ch. XLIX: the messengers, and all things weep`,
    audience: 'all',
    trigger: { where: WHERE, when: after('A20-10') },
    requires: ['A20-10'],
    speakers: [FRIGG, MESSENGER],
    steps: [
      {
        id: 'a20-11-s1',
        goal: 'Go out with the messengers to ask the whole world to weep.',
        hint: 'Choose a road at Fensalir’s door; every road needs somebody.',
        check: 'choose:a20-road:fensalir',
        scene: {
          id: 'a20-11-send',
          lines: [
            N('Hermódr tells it all in Fensalir: the road, the bridge, the high seat, and Hel’s price.'),
            N('Odin turns Draupnir over and over in his hands. Fulla wears her ring on a cord round her neck.'),
            FR('Then we ask again. Everything. Every road. Send out messengers.', 'soft'),
            MS('There are more roads than messengers, lady.'),
            FR('Then take the guest. And the small one. It already knows how to ask.'),
            N('Your Nubbin stands up straight, with its feet together, as it did when it made its own promise.'),
          ],
          choices: [
            {
              id: 'hills',
              label: 'Take the road to the hills.',
              then: [MS('Stones, then, and old snow. Slow to answer. We’ll go slowly.')],
            },
            {
              id: 'shore',
              label: 'Take the road to the shore.',
              then: [MS('Salt and shingle. The sea will weep. It always looks as if it might.')],
            },
            {
              id: 'woods',
              label: 'Take the road through the woods.',
              then: [MS('Trees. They weep easily. It’s the iron under the ground I worry about.')],
            },
          ],
        },
      },
      {
        id: 'a20-11-s2',
        goal: 'Carry frosted stones from the shade into the sun.',
        hint: 'Pick up the white-rimed stones on the north side and set them down in the sunlight.',
        check: 'carry:a20-frost-stones:sun',
        scene: {
          id: 'a20-11-stones',
          lines: [
            N('Everywhere you go, things weep: men and women at their doors, beasts in the fields, the earth itself in dark wet patches.'),
            N('In a hollow on the north side there are stones still white with frost. Nobody has asked them yet.'),
            MS('Carry them out, into the sun. You’ll see.'),
            N('You carry the first one out and set it down where the sun is. The frost on it shines, goes clear, and begins to run.'),
            N('Across the bottom of the page, the old book’s words run on:'),
            N(LIFT_WEEP_A),
            N(LIFT_WEEP_B),
            N('You carry stone after stone into the light, and every one of them weeps.'),
          ],
        },
        done: {
          id: 'a20-11-stones-done',
          lines: [N('The iron in a gate weeps, and the copper on a roof. Even the gold on a ring weeps a little, in the warm.')],
        },
      },
      {
        id: 'a20-11-s3',
        goal: 'Stay with your Nubbin.',
        hint: 'Sit down by your Nubbin in the sun.',
        check: 'sit:a20-nubbin:sun',
        scene: {
          id: 'a20-11-nubbin',
          lines: [
            N('You look round for your Nubbin. It is sitting in the sun beside the last stone, very still.'),
            N('Water is running down its face, and it isn’t frost. It wipes at it with both arms, and looks at its arms, astonished.'),
            N('It has never done this before. It looks up at you, as if to ask whether it is doing it wrong.'),
            MS('Ah. There’s one more thing weeping than we asked.', 'soft'),
            N('You sit down beside it. It climbs into your lap and goes on weeping, more easily now that it knows what it is.'),
            N('Somewhere very far down, you think, Baldr’s light might be a little brighter.'),
          ],
        },
      },
    ],
    complete: {
      id: 'a20-11-complete',
      lines: [
        N('By evening every road you walked is wet, and the sun is going down red over a weeping world.'),
        MS('That’s ours done. Everything we asked, wept. Time to go home.', 'soft'),
        N('Your Nubbin carries one of the frost-stones home in both arms, and won’t put it down.'),
        N('Whenever the sun touches it, it weeps a little still. It always will.'),
      ],
    },
    rewards: [
      {
        id: 'a20-weeping-stone',
        kind: 'decor',
        label: 'The Weeping Stone',
        description:
          'A grey stone from the frosted hollow, set by the Grove pond. When the sun is on it, it weeps a little, the way frost does coming into the warm. Pure decoration.',
      },
    ],
    sets: { 'a20-11': true },
    childLines: {
      'a20-11-stones#5': 'Everybody wept, and every animal, and the ground, and the stones, and the trees, and every kind of metal.',
      'a20-11-stones#6': 'You know how frost turns to drops of water when you bring it in from the cold? That is how they wept.',
    },
    notes:
      'LIFTED TEXT: a20-11-stones#5–6 are one Brodeur sentence (ch. XLIX) split over two lines; #5 opens with an ellipsis ' +
      'to mark the excerpt, and Brodeur’s double hyphen is set as an em dash. #4 introduces them as the page’s own print. ' +
      'Show #5–6 as a line of print along the bottom of the page, like A11-1’s opening print. The road choice has no flag. ' +
      'CINDER (cinder set): play ATLAS_A20_VARIANTS a20-11-ember after a20-11-stones, before a20-11-stones-done. ' +
      'SIM: the Weeping Stone is decor by the pond. When the Grove’s sun is on it, it shows a slow drip-and-sparkle; at night ' +
      'or in shade it is dry. No timer, no yield, nothing to collect. One-time reward.',
  },

  // ---------------------------------------------------------------- A20-12
  {
    id: 'a20-12',
    code: 'A20-12',
    title: 'The Cave',
    source: `${SNORRI}, ch. XLIX: Thökk in the cave`,
    audience: 'all',
    trigger: { where: WHERE, when: after('A20-11') },
    requires: ['A20-11'],
    speakers: [MESSENGER, THOKK, FRIGG],
    steps: [
      {
        id: 'a20-12-s1',
        goal: 'Walk home with the messengers.',
        hint: 'Follow the road back towards Fensalir, under the cliff.',
        check: 'walk:a20-messengers:home',
        scene: {
          id: 'a20-12-road',
          lines: [
            N('The messengers come home along every road at once, wet to the knees and very quiet.'),
            MS('Nothing said no. Not one thing. Not a stone, not a beetle.', 'happy'),
            MS('He’ll be home by morning. Think of her face.', 'happy'),
            N('The road home runs under a cliff. In the cliff there is a cave, and in the mouth of the cave somebody is sitting.'),
            N('A giantess. She has her knees drawn up and her arms round them, and her eyes are perfectly dry.'),
            MS('One more. Just one. Then we’re done.'),
          ],
        },
      },
      {
        id: 'a20-12-s2',
        goal: 'Ask the giantess in the cave to weep for Baldr.',
        hint: 'Go into the cave mouth with the messengers.',
        check: 'talk:a20-thokk:cave',
        scene: {
          id: 'a20-12-cave',
          lines: [
            MS('Mother, everything in the world weeps for Baldr, to bring him home from Hel. Will you weep too?'),
            TK('My name is Thökk. And no.'),
            TK('I’ll weep for him with dry eyes. That’s all he’ll get from me.', 'angry'),
            TK('I had no joy of him living, and I’ll have none of him dead. Let Hel keep what she has.'),
            N('The messengers stand very still. They have asked the whole world, and it said yes; they don’t know what to do with no.'),
            N('Your Nubbin looks at you. Its face is still wet from the stones.'),
          ],
          choices: [
            {
              id: 'plead',
              label: 'Plead with her.',
              set: { 'a20-thokk': 'plead' },
              then: [
                Y('Please. He was kind to everyone. He was kind to me, and I was a stranger.'),
                Y('Please weep. Just a little. It’s all it would take.'),
                TK('Then it’s a great deal, isn’t it, from me. No.', 'angry'),
              ],
            },
            {
              id: 'sat',
              label: 'Sit down next to her, and say nothing.',
              set: { 'a20-thokk': 'sat' },
              then: [
                N('You sit down in the cave mouth beside her, a little apart. You don’t ask her anything.'),
                N('She looks at you sideways, and lets you stay. For a while, neither of you says a word.'),
                TK('…It won’t make me weep, you know.'),
                N('You nod. You know.'),
              ],
            },
            {
              id: 'walked',
              label: 'Walk away.',
              set: { 'a20-thokk': 'walked' },
              then: [
                N('You turn and walk out of the cave, because you can’t look at her. Behind you the messengers ask again, and again.'),
                N('Her answer is the same each time. You can hear it from the road.'),
              ],
            },
          ],
        },
        done: {
          id: 'a20-12-cave-done',
          lines: [
            TK('Go home. Tell them Thökk wouldn’t.'),
            N('Whatever you do, she will not weep. The cave stays dry, and so do her eyes.'),
          ],
        },
      },
    ],
    complete: {
      id: 'a20-12-complete',
      lines: [
        N('The messengers go home slowly. Nobody wants to be the one who reaches Fensalir first.'),
        N('They tell Frigg. She doesn’t weep again; she sits down on the step, and Fulla sits beside her.'),
        FR('One. Out of everything.', 'sad'),
        N('People believe the giantess in the cave was Loki, in another shape. That is how the old book tells it.'),
        N('Your Nubbin keeps looking back at the cliff the whole way home.'),
      ],
    },
    rewards: [],
    sets: { 'a20-12': true },
    notes:
      'SIGNATURE CHOICE (a20-12-cave): a20-thokk = plead | sat | walked. Thökk refuses whatever you do. It pays off in ' +
      'A20-14 (a20-14-bowl*), A20-16 (a20-16-edge*) and A20-17 (a20-17-complete*). The sat option is the third rule acted ' +
      'out, never quoted here; it lands in Baldr’s line in a20-17-complete-sat. THÖKK’S VERSE is left out (not checked ' +
      'against Brodeur); she refuses in plain speech, in our own words. Her “dry eyes” is the verse’s idea, not its wording. ' +
      'ART: a giantess, large and still, arms round her knees; never comic, never ugly. The messengers call her “Mother” ' +
      'as a courtesy to an old woman. ' +
      'KEPT STONE (keptStone): play ATLAS_A20_VARIANTS a20-12-kept after the choice’s then lines, before a20-12-cave-done. ' +
      'HAZEL’S MARGIN NOTE (s24Done, read-only): if s24Done is set when a20-12-complete ends, play ATLAS_A20_VARIANTS ' +
      'a20-margin-hazel straight after it; otherwise it plays the first time the atlas is open at this page’s cave after ' +
      's24Done is set. From then on the note is drawn in pencil in the margin beside the cave. Its text matches S24’s notes ' +
      'exactly.',
  },

  // ---------------------------------------------------------------- A20-13
  {
    id: 'a20-13',
    code: 'A20-13',
    title: 'The Salmon',
    source: `${SNORRI}, ch. L: Loki in Franang’s Falls`,
    audience: 'all',
    trigger: { where: WHERE, when: after('A20-12') },
    requires: ['A20-12'],
    speakers: [THOR, ODIN],
    steps: [
      {
        id: 'a20-13-s1',
        goal: 'Climb with the gods to the house with four doors.',
        hint: 'Follow the gods up the mountain path; the house is near the top.',
        check: 'climb:a20-mountain:four-doors',
        scene: {
          id: 'a20-13-house',
          lines: [
            N('The gods know now whose hand was at Hödr’s elbow. It was Loki’s, and he has run.'),
            N('They hunt for him a long time. In the end they find a house high on a mountain, with a door in every wall.'),
            TH('Four doors. So he could watch every way at once.', 'angry'),
            N('The house is empty, and the fire is still warm. Beside it lies a little heap of grey ash, in a shape like knots.'),
            OD('He was making something. And he burned it when he saw us on the path.', 'think'),
            N('Below the mountain a waterfall comes down white into a deep pool. Your Nubbin goes to the door to look at it.'),
          ],
        },
      },
      {
        id: 'a20-13-s2',
        goal: 'Help the gods work out what was burned, and make one like it.',
        hint: 'Look closely at the ash by the hearth, then hold the cord while the gods knot.',
        check: 'inspect:a20-ash:hearth',
        scene: {
          id: 'a20-13-ash',
          lines: [
            N('The wisest of the gods, Kvasir, kneels by the hearth and looks at the ash a long time without touching it.'),
            N('It is the shape of a net, and nobody has ever made a net before. Loki made the first one, and then he burned it.'),
            OD('Then he is in the water. He knew we would make one too, sooner or later. So we shall.', 'think'),
            N('The gods sit down and make a net by the shape of the ash. It is slow work, and your Nubbin keeps getting knotted into it.'),
            TH('Hold still, small one. You’re not the fish.', 'happy'),
            N('It is the first time anyone has smiled since the Thing-field. It doesn’t last, but it happens.'),
          ],
          choices: [
            {
              id: 'cord',
              label: 'Hold the cord steady.',
              then: [N('You hold it steady through every knot. Kvasir nods to you once, when it is done.')],
            },
            {
              id: 'knot',
              label: 'Tie some of the knots yourself.',
              then: [N('You tie a row of knots. Thor checks every one and doesn’t undo any of them, which is praise.')],
            },
            {
              id: 'untangle',
              label: 'Untangle your Nubbin first.',
              then: [N('You untangle your Nubbin. It sits on the bench and watches the rest with great interest and both arms folded.')],
            },
          ],
        },
      },
      {
        id: 'a20-13-s3',
        goal: 'Hold the net across Franang’s Falls.',
        hint: 'Take the bank end of the net and keep it low as the gods walk it down the river.',
        check: 'carry:a20-net:falls',
        scene: {
          id: 'a20-13-falls',
          lines: [
            N('The waterfall is Franang’s Falls. In the pool under it, by day, a salmon lies very still, and it is Loki.'),
            N('Thor wades into the middle of the river with the net. You take one end on the bank, and the gods take the other.'),
            N('You drag it down the river. The salmon slips over the top of the net and is away towards the sea.'),
            N('Again. This time the salmon must choose: the open sea, or a leap back over the net.'),
            N('It leaps. Thor grabs at it in mid-air, and catches it by the tail.'),
            N('It slides through his hand, and his hand closes, and holds. That, the old book says, is why the salmon tapers at the tail.'),
          ],
        },
        done: {
          id: 'a20-13-falls-done',
          lines: [N('In Thor’s hand the salmon is a man again, soaked and still. He doesn’t struggle, and he doesn’t say anything at all.')],
        },
      },
    ],
    complete: {
      id: 'a20-13-complete',
      lines: [
        N('The gods take Loki away with them, down the mountain. Nobody speaks.'),
        N('Your Nubbin stands on the bank looking at the falls. Then it looks at you, as if there is a question it can’t find the shape of.'),
        OD('Go home to Fensalir, guest. What happens next is ours to do.', 'sad'),
        N('The page turns anyway, the way pages do. There is one more place to go before the snow.'),
      ],
    },
    rewards: [],
    sets: { 'a20-13': true },
    notes:
      'Snorri’s capture, in our own words: the four-doored house, the first net burned, Kvasir reading the ash, the two ' +
      'drags, the leap, Thor’s catch, and the just-so about the salmon’s tail. Loki is first named here (a20-13-house#0). ' +
      'He never speaks on the page. The one smile (a20-13-ash#4–5) is the only lightness after A20-6; keep it small. ' +
      'ART: the net is plain cord; the salmon is a real salmon, silver, no face.',
  },

  // ---------------------------------------------------------------- A20-14
  {
    id: 'a20-14',
    code: 'A20-14',
    title: 'The Bowl',
    source: `${SNORRI}, ch. L: Loki bound, and Sigyn’s bowl (softened)`,
    audience: 'all',
    trigger: { where: WHERE, when: after('A20-13') },
    requires: ['A20-13'],
    speakers: [SIGYN],
    steps: [
      {
        id: 'a20-14-s1',
        goal: 'Follow the stair down under the earth.',
        hint: 'Take the steep stair at the back of the cave, and keep your Nubbin close.',
        check: 'walk:a20-under-earth:stair',
        scene: {
          id: 'a20-14-cave',
          lines: [
            N('Under the earth there is a cave, and in the cave three flat stones. Loki is bound across them.'),
            N('The page doesn’t show the binding. It shows only that he cannot move, and that he will not be let go.'),
            N('Above his face a snake hangs from the rock. Its venom gathers, slowly, and drips.'),
            N('A woman kneels beside him, holding a bowl up under the drops. It is Sigyn, his wife.'),
            N('She has been holding it a long time. Her arms are shaking.'),
            N('Your Nubbin stops at the bottom of the stair and holds on to your trouser leg.'),
          ],
        },
      },
      {
        id: 'a20-14-s2',
        goal: 'Stay with Sigyn by the bowl, as near as you can bear.',
        hint: 'Go nearer to Sigyn and the three stones, or stay where you are.',
        check: 'sit:a20-sigyn:bowl',
        scene: {
          id: 'a20-14-bowl',
          lines: [
            N('You go nearer. Sigyn knows who you are: the guest who ran Frigg’s errands, and begged at the cave.'),
            N('She doesn’t look at you. She looks at the bowl, and at nothing else.'),
            SI('You asked so nicely, in the cave. Everybody heard about it.', 'sad'),
            SI('I don’t ask anything of you. Don’t ask anything of me.'),
            N('The bowl fills, drop by drop. Sigyn keeps her eyes on it, and her arms up.'),
            N('Your Nubbin sits down at the edge of the lamplight and doesn’t come any closer.'),
          ],
        },
      },
      {
        id: 'a20-14-s3',
        goal: 'See what happens when the bowl is full.',
        hint: 'Stay still; it won’t take long.',
        check: 'watch:a20-earth:shakes',
        scene: {
          id: 'a20-14-shake',
          lines: [
            N('The bowl is full. Sigyn has to take it away to empty it.'),
            N('While she is gone, the drops fall on him. He shudders, so hard that the whole earth shakes.'),
            N('Far above, people feel the ground move and call it an earthquake. In this story, now you know why.'),
            N('Then Sigyn is back with the bowl, and the drops fall into it, and the shaking stops.'),
            N('The old book says he lies like this until the end of things. And she kneels there with him, all that time.'),
            N('Your Nubbin is holding on to you with both arms.'),
          ],
          choices: [
            {
              id: 'hold',
              label: 'Hold your Nubbin close.',
              then: [N('You hold it close. It is shaking too, a little, like the earth, and then it isn’t.')],
            },
            {
              id: 'stay',
              label: 'Stay a while longer, for Sigyn.',
              then: [N('You stay, and Sigyn doesn’t look round. But when you go, she lifts one hand off the bowl, just for a moment.')],
            },
            {
              id: 'go',
              label: 'Go back up the stair.',
              then: [N('You go up the stair into the cold air. Behind you the earth is quiet again, for now.')],
            },
          ],
        },
      },
    ],
    complete: {
      id: 'a20-14-complete',
      lines: [
        N('You climb up out of the earth into a grey evening. The wind has changed, and it smells of snow.'),
        N('The page turns under your hand. On the other side it is white from edge to edge.'),
        N('There is no road on this side. There is only the plain.'),
        N('Your Nubbin pulls your cloak round both of you, and you step out onto the snow.'),
      ],
    },
    rewards: [],
    sets: { 'a20-14': true },
    notes:
      'SOFTENED (care notes), and the page says so (a20-14-cave#1). Three stones, the snake, Sigyn’s bowl. The bonds are not ' +
      'drawn or named; his sons, their deaths and the entrails are cut. Loki is seen lying still under a dim lamp; the ' +
      'venom is a slow clear drop, never a burn. The earthquake is Snorri’s just-so, in our words. ' +
      'THÖKK PAYOFF (a20-thokk). The step 2 scene shown, a20-14-bowl, is for plead (Sigyn won’t look at you). For sat play ' +
      'ATLAS_A20_VARIANTS a20-14-bowl-sat (she lets you hold a second bowl while she empties hers, so for a moment no drops ' +
      'fall). For walked play a20-14-bowl-walked (you watch from the cave mouth). In walked, the step 3 lines are seen from ' +
      'the foot of the stair; they need no change. Sigyn speaks only of “the cave”; the page never confirms who Thökk was.',
  },

  // ---------------------------------------------------------------- A20-15
  {
    id: 'a20-15',
    code: 'A20-15',
    title: 'The Fimbulwinter',
    source: `${SNORRI}, ch. LI and LIII: the Fimbulwinter, and Líf and Lífthrasir`,
    audience: 'all',
    trigger: { where: WHERE, when: after('A20-14') },
    requires: ['A20-14'],
    speakers: [LIF, LIFTHRASIR],
    steps: [
      {
        id: 'a20-15-s1',
        goal: 'Cross the long white plain.',
        hint: 'Keep the wind at your back and walk towards the dark line of trees.',
        check: 'walk:a20-plain:white',
        scene: {
          id: 'a20-15-plain',
          lines: [
            N('Now comes the great winter. The old book calls it the Fimbulwinter.'),
            N('Snow drives in from every side. The frost bites hard, the wind cuts, and the sun hangs pale and gives no heat.'),
            N('Three winters come one after another, with no summer between them. The seasons simply forget to turn.'),
            N('You walk with your head down. Your Nubbin rides inside your cloak, tucked up against your chest.'),
            N('You think of a valley you know, where a winter once would not end, and the small ones went still in the long grass.'),
            N('Ahead, through the white, there is a dark line of trees.'),
          ],
        },
      },
      {
        id: 'a20-15-s2',
        goal: 'Find the two who are hiding in the wood.',
        hint: 'Walk in under the trees and look for where the snow is trodden.',
        check: 'find:a20-holt:hoddmimir',
        scene: {
          id: 'a20-15-holt',
          lines: [
            N('The wood is called Hoddmímir’s Holt. Under its trees the snow is thinner, and the wind can’t find you.'),
            N('Two people are sitting in a hollow under the roots of a great tree, wrapped in one blanket: a woman and a man.'),
            LI('Oh. Someone. I thought there was nobody left who could walk.', 'shock'),
            LT('We’re Líf and Lífthrasir. We hide here. We live on the dew, every morning, off the leaves.'),
            LI('It isn’t much. But it’s enough, if you don’t want very much.', 'soft'),
            N('Your Nubbin climbs out of your cloak and goes straight to them. It sits down between them, under the blanket.'),
            LT('It’s warm. Can it stay?'),
          ],
        },
      },
      {
        id: 'a20-15-s3',
        goal: 'Keep Líf and Lífthrasir company through the winter.',
        hint: 'Sit in the hollow with them; there is nowhere else you need to be.',
        check: 'sit:a20-lif:holt',
        scene: {
          id: 'a20-15-company',
          lines: [
            N('So you stay in the holt, through the snow. Every morning the four of you lick the dew off the leaves, and it tastes of nothing.'),
            N('Every night you sit close, under one blanket and your cloak, and the winter goes on outside the trees.'),
            N('Your Nubbin shares itself out: a night by Líf, a night by Lífthrasir, a night in your lap.'),
            LT('We used to have names for the days. We stopped. There didn’t seem to be any point.'),
            N('Outside, the third winter starts without the second one having ended.'),
            LI('Tell us something. Anything that isn’t snow.'),
          ],
          choices: [
            {
              id: 'valley',
              label: 'Tell them about your valley.',
              then: [
                Y('There’s a pond, and a gate that sticks. You have to lift it and push.'),
                LT('A gate that sticks. That sounds like a good place to live.', 'happy'),
              ],
            },
            {
              id: 'hall',
              label: 'Tell them about the bright hall on the rise.',
              then: [
                N('You tell them about Breidablik, and the light coming off him, and your Nubbin asleep on the boards.'),
                LI('Then there was a light once. Good. I hoped there was.', 'soft'),
              ],
            },
            {
              id: 'close',
              label: 'Say nothing. Just sit close.',
              then: [N('You sit close and say nothing. After a while Lífthrasir puts his head on your shoulder, and sleeps.')],
            },
          ],
        },
        done: {
          id: 'a20-15-company-done',
          lines: [LI('You stayed. Nobody stays anywhere any more. Everybody’s running somewhere.', 'soft')],
        },
      },
    ],
    complete: {
      id: 'a20-15-complete',
      lines: [
        N('One morning the dew tastes different: not warmer, just different, as if something far off had changed its mind.'),
        LT('Something’s coming. I can feel it in the roots.', 'think'),
        LI('Not here, though. It won’t come here. Will it?'),
        N('Your Nubbin climbs the tree roots to the edge of the holt, and looks out.'),
      ],
    },
    rewards: [],
    sets: { 'a20-15': true },
    notes:
      'The Fimbulwinter is the White Year in another key: a20-15-plain#4 is the only line that says so, and it never names ' +
      'Cinder or the Heartstone. LIFTED TEXT: none. Brodeur ch. LI (“frosts shall be great then…”) is unverified in Part M, ' +
      'so a20-15-plain#1 tells it in our own words; do not swap in Brodeur’s wording unless it is checked. Líf and ' +
      'Lífthrasir are Snorri’s pair who hide in Hoddmímir’s Holt and live on the morning dew. ' +
      'CINDER (cinder set): after a20-15-company’s choice, before a20-15-company-done, play ATLAS_A20_VARIANTS ' +
      'a20-15-ember-forgiven (cinder = forgiven: it burns steady) or a20-15-ember-remembered (cinder = remembered: it ' +
      'flickers but never goes out). KEPT STONE (keptStone): at the same point play a20-15-kept instead (the stone hums; ' +
      'the pair sit further off; nothing else changes). cinder and keptStone never both hold.',
  },

  // ---------------------------------------------------------------- A20-16
  {
    id: 'a20-16',
    code: 'A20-16',
    title: 'The Twilight',
    source: `${SNORRI}, ch. LI: Ragnarök, seen from far off`,
    audience: 'all',
    trigger: { where: WHERE, when: after('A20-15') },
    requires: ['A20-15'],
    speakers: [LIF, LIFTHRASIR],
    steps: [
      {
        id: 'a20-16-s1',
        goal: 'Look out from the edge of the holt.',
        hint: 'Climb the roots at the wood’s edge, where your Nubbin is.',
        check: 'climb:a20-holt:edge',
        scene: {
          id: 'a20-16-edge',
          lines: [
            ...A16_OPEN,
            N('A ship is coming over the sea. It is huge and dark, and very slow.'),
            N('There is a figure in its bow. It stands looking ahead at the land, and never turns round.'),
            ...A16_CLOSE,
          ],
        },
      },
      {
        id: 'a20-16-s2',
        goal: 'Wait at the holt’s edge until it is over.',
        hint: 'Stay with Líf and Lífthrasir; nothing will reach the trees.',
        check: 'wait:a20-holt:twilight',
        scene: {
          id: 'a20-16-wait',
          lines: [
            N('Líf and Lífthrasir come up beside you. They don’t look out; they look at you, to see how bad it is.'),
            LI('Tell us. Is it coming here?'),
            N('You watch the fire, and the running wolves, and the sky. None of it comes towards the trees.'),
            Y('No. Not here.'),
            LT('Then we’ll wait. We’re good at waiting.', 'soft'),
            N('The light changes. The noise far off gets less, and less, and is gone.'),
          ],
          choices: [
            {
              id: 'hand',
              label: 'Hold Líf’s hand.',
              then: [N('You hold Líf’s hand. Her fingers are cold, and then they aren’t.')],
            },
            {
              id: 'tuck',
              label: 'Tuck your Nubbin inside your cloak.',
              then: [N('You tuck your Nubbin inside your cloak. It puts one eye out, to keep watch with you.')],
            },
            {
              id: 'watch',
              label: 'Keep watching, so that someone does.',
              then: [N('You keep watching. It is a hard thing to see, even far off, and someone should, so that it isn’t only told.')],
            },
          ],
        },
      },
    ],
    complete: {
      id: 'a20-16-complete',
      lines: [
        N('Then it is quiet. Not the quiet of the snow: a new quiet, like a room after everybody has gone home.'),
        N('The snow stops. Nobody notices for a while, because it has been snowing for so long.'),
        LI('Is it over?'),
        N('Your Nubbin sniffs the air, and sneezes. The air smells of salt, and of something green.'),
      ],
    },
    rewards: [],
    sets: { 'a20-16': true },
    notes:
      'TOLD, NOT SHOWN UP CLOSE (care notes). Everything is a far view from the holt: small running wolves against the sky, ' +
      'a dark ship far out, a low line of fire. No battle, no deaths, no named gods falling; nothing reaches the holt. Draw ' +
      'it like weather on distant hills. The ship is Snorri’s; the page doesn’t name it or the figure in its bow. ' +
      'THÖKK PAYOFF (a20-thokk). The step 1 scene shown, a20-16-edge, is for plead (the figure never turns). For sat play ' +
      'ATLAS_A20_VARIANTS a20-16-edge-sat (it looks straight at the holt, once). For walked play a20-16-edge-walked (you hear ' +
      'the ship but never see it).',
  },

  // ---------------------------------------------------------------- A20-17
  {
    id: 'a20-17',
    code: 'A20-17',
    title: 'The Green Earth',
    source: `${SNORRI}, ch. LIII: the earth rises again`,
    audience: 'all',
    trigger: { where: WHERE, when: after('A20-16') },
    requires: ['A20-16'],
    speakers: [LIF, LIFTHRASIR, VIDARR, BALDR, HODR],
    steps: [
      {
        id: 'a20-17-s1',
        goal: 'Walk out of the holt into the new land.',
        hint: 'Follow Líf and Lífthrasir out from under the trees.',
        check: 'explore:a20-green:fields',
        scene: {
          id: 'a20-17-green',
          lines: [
            N('The sea goes down. Out of it the land comes up again, wet and new, and green as a first leaf.'),
            N('There are fields on it already. Corn is growing in them, and nobody sowed it.'),
            N('Líf and Lífthrasir walk out from under the trees, slowly, holding on to each other. Then faster.'),
            LI('Grass. Feel it. It’s grass.', 'happy'),
            LT('And the sun. Look. It’s warm. It’s warm again.', 'happy'),
            N('The sun had a daughter before the end, the old book says. Now she rides her mother’s road, just as bright.'),
            N('Your Nubbin runs out into the middle of a field and lies down flat in the sun, arms and legs out.'),
          ],
        },
      },
      {
        id: 'a20-17-s2',
        goal: 'Go to the old ground where the gods’ halls stood.',
        hint: 'Walk across the fields to the plain where grass grows over old stones.',
        check: 'visit:a20-idavoll:old-ground',
        scene: {
          id: 'a20-17-old-ground',
          lines: [
            N('Where the gods’ halls stood there is a plain of grass, with old stones showing through it here and there.'),
            N('People are gathering there: the gods’ sons, who came through the end of things, Vídarr and Váli, Módi and Magni.'),
            N('Módi and Magni have their father’s hammer between them. They carry it gently, like something asleep.'),
            VI('Guest. You came through as well. Sit with us. There’s a great deal to talk about, and all the time in the world.', 'soft'),
            N('Then two more come walking up out of the ground, by the road that goes down. They come from Hel.'),
            N('Baldr comes, and Hödr with him.'),
            N('Baldr’s light is just as it was. Your Nubbin is up and running before you can stand.'),
          ],
        },
        done: {
          id: 'a20-17-old-ground-done',
          lines: [
            N('Your Nubbin runs straight into Baldr’s light and falls asleep in it, at once, in the grass.'),
            N('It has been trying to get back there all this time.', 'soft'),
          ],
        },
      },
      {
        id: 'a20-17-s3',
        goal: 'Look in the grass for what the gods once played with.',
        hint: 'Search the long grass round the old stones.',
        check: 'find:a20-game-pieces:grass',
        scene: {
          id: 'a20-17-pieces',
          lines: [
            N('The brothers sit down on the grass, and the others sit round them, and they talk about old things.'),
            BA('Do you remember the Thing-field? The arrow that went round me?', 'happy'),
            HO('I remember the guest telling it. Better than you did, as well.', 'happy'),
            N('In the long grass by the old stones, your hand closes on something small and cold. You pull it out.'),
            N('It is a game piece, made of gold. There are more of them in the grass: the pieces the gods played with in the old days.'),
            VI('They were ours, before. Now they’re anybody’s.', 'soft'),
          ],
          choices: [
            {
              id: 'baldr',
              label: 'Give the first piece to Baldr.',
              then: [BA('Ha. I always lost with this one. Every single time.', 'happy')],
            },
            {
              id: 'hodr',
              label: 'Give the first piece to Hödr.',
              then: [
                N('Hödr turns it over in his fingers, feeling the shape of it.'),
                HO('A little horse. I know this one. I always wanted to be the horse.', 'happy'),
              ],
            },
            {
              id: 'between',
              label: 'Set it on the grass between them.',
              then: [N('You set it on the grass between the two brothers. They both reach for it at once, and both laugh.')],
            },
          ],
        },
      },
    ],
    complete: {
      id: 'a20-17-complete',
      lines: [
        ...A17_START,
        N('Hödr turns his face towards you. You find you are sitting beside him, closer than anyone.'),
        HO('You rode down to fetch my brother home, and you begged for him in the cave. I heard about that.', 'soft'),
        HO('Thank you for trying.', 'soft'),
        ...A17_END,
      ],
    },
    rewards: [
      {
        id: 'a20-mistletoe-sprig',
        kind: 'cosmetic',
        label: 'Mistletoe Sprig',
        description:
          'A sprig with two leaves, for your Nubbin to wear. Frigg asked everything not to harm her son, but one small sprout she thought too young to ask. When he died, everything in the world wept for him but one.',
      },
      {
        id: 'a20-golden-game-piece',
        kind: 'decor',
        label: 'Golden Game Piece',
        description: 'A little gold piece from the gods’ old game, found in the grass of the green earth. It stands on the cottage shelf.',
      },
      {
        id: 'a20-price-of-power-bookmark',
        kind: 'item',
        label: 'Price of Power Bookmark',
        description: 'A strip of grey linen with one green thread through it. It marks the Weeping page, and counts towards the Price of Power festival.',
      },
    ],
    sets: { 'a20-17': true, 'a20-done': true },
    notes:
      'LIFTED TEXT: none. Brodeur ch. LIII (“In that time the earth shall emerge out of the sea…” and “After that Baldr shall ' +
      'come there, and Hödr, from Hel;”) is unverified in Part M (checked only through a course reader), so a20-17-green#0–1 ' +
      'and a20-17-old-ground#4–5 tell the beats in our own words. Swap in Brodeur’s wording only once it is checked, and ' +
      'add childLines then. The sun’s daughter (a20-17-green#5) and Thor’s sons with the hammer are Snorri’s beats in our ' +
      'words. The old ground is Idavoll in the check id only. ' +
      'THÖKK PAYOFF (a20-thokk): who sits closest to Hödr. The complete scene shown, a20-17-complete, is for plead (you; ' +
      'Hödr thanks you for trying). For sat play ATLAS_A20_VARIANTS a20-17-complete-sat (Baldr; his line lands the third ' +
      'rule). For walked play a20-17-complete-walked (no one at first, until Baldr calls him over). On every path the earth ' +
      'comes up green and the sprig is given. ' +
      'CINDER (cinder set): play ATLAS_A20_VARIANTS a20-17-ember after a20-17-green, before step 2 (Líf asks where the ' +
      'ember came from; the choice sets no flag). ' +
      'REWARDS (one-time, at a20-17-complete*): the Mistletoe Sprig cosmetic (its description is its story in two plain ' +
      'lines, as Part M asks; never a kissing or Christmas-love story), the Golden Game Piece decor, and the Price of Power ' +
      'Bookmark. SIM: the Price of Power festival (A1, A4, A8, A15, A20, A30, any two) reads atlasDone(\'A20\') from a20-done.',
  },
];

// =================================================================== variants

/**
 * Variant scenes chosen by flags. Each quest's notes say exactly where each plays.
 *   cinder (Grove, read-only): a20-01-ember, a20-11-ember, a20-15-ember-forgiven | -remembered, a20-17-ember (inserts).
 *   keptStone (Grove, read-only): a20-12-kept, a20-15-kept (inserts).
 *   s24Done (Grove, read-only): a20-margin-hazel.
 *   a20-thokk (A20-12): a20-14-bowl-sat | -walked, a20-16-edge-sat | -walked, a20-17-complete-sat | -walked (replacements).
 */
export const ATLAS_A20_VARIANTS: Scene[] = [
  // ---------------------------------------------------------------- A20-1, insert (cinder)
  {
    id: 'a20-01-ember',
    lines: [
      N('Your Nubbin is carrying its little lantern, as it does everywhere now. Inside it, the red pebble from the high pass glows.'),
      FU('A lamp with no flame. It’s warm, though. My hands are warm just being near it.', 'think'),
      FR('Somebody gave that away who had very little left to give. Keep it close, little one.', 'soft'),
    ],
  },
  // ---------------------------------------------------------------- A20-11, insert (cinder)
  {
    id: 'a20-11-ember',
    lines: [
      N('Your Nubbin holds its little lantern up close to a stone that is slow to weep. The red pebble inside glows.'),
      N('The frost on that stone runs at once, faster than any of the others, as if it had only been waiting to be asked kindly.'),
      MS('What’s that you carry?', 'think'),
      Y('Something warm. From a long way off.'),
    ],
  },
  // ---------------------------------------------------------------- A20-12, insert (keptStone)
  {
    id: 'a20-12-kept',
    lines: [
      N('Thökk’s eyes go to your pocket, where the stone sits, and stay there.'),
      TK('You understand.', 'think'),
      TK('Keep what you have.'),
      N('Your hand goes to your pocket. The stone is cold through the cloth, as it always is.'),
    ],
  },
  // ---------------------------------------------------------------- Hazel's margin note (s24Done)
  {
    id: 'a20-margin-hazel',
    lines: [
      N('Nova’s atlas lies open at the cave in the cliff, and the giantess with her arms round her knees.'),
      N('Beside the cave, in faint pencil you have never noticed, there is a note in the margin. You know the hand.'),
      N('“Everything wept but one. Don’t hate her for it.”'),
      N('“Feel sorry for her.”', 'soft'),
      N('And under it, one letter: H.'),
      N('Your Nubbin puts one paw on the drawing of the cave, gently, the way it would on somebody’s arm.'),
    ],
  },
  // ---------------------------------------------------------------- A20-14, step 2 scene (sat)
  {
    id: 'a20-14-bowl-sat',
    lines: [
      N('You go nearer. Sigyn looks up at you for a long moment; she knows who you are.'),
      SI('You’re the one who sat down, in the cave mouth. I know about that.', 'soft'),
      N('Her bowl is nearly full, and her arms are shaking.'),
      SI('Hold this, under the drops. Just while I empty mine.'),
      N('She gives you a second bowl, a little wooden one. You hold it up under the snake, and she goes to empty hers.'),
      N('For a moment, while you hold it, no drops fall on him at all. His face goes quiet.'),
      N('Then Sigyn is back, and takes her place, and holds her bowl up again.'),
      SI('Thank you.', 'soft'),
    ],
  },
  // ---------------------------------------------------------------- A20-14, step 2 scene (walked)
  {
    id: 'a20-14-bowl-walked',
    lines: [
      N('You stop at the cave mouth, at the bottom of the stair, and go no further.'),
      N('From there you can see the lamp, and the three stones, and Sigyn kneeling with her bowl held up.'),
      N('She doesn’t know you’re there, or doesn’t look. The bowl fills, drop by drop.'),
      N('Your Nubbin sits down beside you on the bottom step. Neither of you goes in.'),
      N('You watch from the cave mouth. It is as near as you can bear to stand.'),
      N('Above you the earth is quiet, and waiting.'),
    ],
  },
  // ---------------------------------------------------------------- A20-15, insert (cinder = forgiven)
  {
    id: 'a20-15-ember-forgiven',
    lines: [
      N('Your Nubbin opens its little lantern and sets it in the hollow, between Líf and Lífthrasir. The red pebble glows.'),
      N('It burns steady all winter long, never hot, always warm. The snow draws back from it in a ring.'),
      LI('Oh. Warm. I’d forgotten.', 'soft'),
      N('Your Nubbin sits with its paws round the lantern, carefully, as if it were something lent.'),
    ],
  },
  // ---------------------------------------------------------------- A20-15, insert (cinder = remembered)
  {
    id: 'a20-15-ember-remembered',
    lines: [
      N('Your Nubbin opens its little lantern and sets it in the hollow, between Líf and Lífthrasir. The red pebble glows.'),
      N('It flickers in the wind that gets in under the trees. Some nights it is so low you think it has gone.'),
      N('But it never goes out. In the morning it is always there, small and red and warm.'),
      LT('It keeps trying. Look at it. It just keeps trying.', 'soft'),
    ],
  },
  // ---------------------------------------------------------------- A20-15, insert (keptStone)
  {
    id: 'a20-15-kept',
    lines: [
      N('In your pocket the stone wakes in the cold. It hums one word, the only word it has: safe.'),
      N('Líf and Lífthrasir hear it, and don’t like it. Without a word they move to the far side of the hollow.'),
      LT('What is that? It sounds like the snow, talking.', 'think'),
      N('Nothing else changes. They still let you stay; they just sit a little further off.'),
    ],
  },
  // ---------------------------------------------------------------- A20-16, step 1 scene (sat)
  {
    id: 'a20-16-edge-sat',
    lines: [
      ...A16_OPEN,
      N('A ship is coming over the sea. It is huge and dark, and very slow.'),
      N('There is a figure in its bow. Once, just once, it turns its head and looks straight across the sea, at the holt.'),
      N('Then it looks ahead again, and does not turn back.'),
      ...A16_CLOSE,
    ],
  },
  // ---------------------------------------------------------------- A20-16, step 1 scene (walked)
  {
    id: 'a20-16-edge-walked',
    lines: [
      ...A16_OPEN,
      N('Something is coming over the sea. You can hear it, a long creak of timbers and slow oars, but you can’t see it.'),
      N('The mist lies low on the water. You look and look, and you never see the ship.'),
      ...A16_CLOSE,
    ],
  },
  // ---------------------------------------------------------------- A20-17, insert (cinder)
  {
    id: 'a20-17-ember',
    lines: [
      N('Líf stops by your Nubbin’s little lantern at the edge of the field. The red pebble is still glowing, though the sun is warm now.'),
      LI('That kept us alive, I think. Where did it come from?'),
    ],
    choices: [
      {
        id: 'tight',
        label: '“From someone who held on too tight, once.”',
        then: [LI('And let go, in the end?'), Y('In the end.'), LI('Then it’s a good thing to carry.', 'soft')],
      },
      {
        id: 'nothing',
        label: 'Say nothing.',
        then: [N('You say nothing. Líf looks at the pebble a while longer, and nods, as if that were an answer too.')],
      },
    ],
  },
  // ---------------------------------------------------------------- A20-17, complete (sat)
  {
    id: 'a20-17-complete-sat',
    lines: [
      ...A17_START,
      N('Baldr sits down beside Hödr, close, shoulder to shoulder, the way they always used to sit.'),
      BA('You sat with the one who wouldn’t weep. Someone should.', 'soft'),
      N('Hödr nods. He doesn’t say anything, and he doesn’t need to.'),
      ...A17_END,
    ],
  },
  // ---------------------------------------------------------------- A20-17, complete (walked)
  {
    id: 'a20-17-complete-walked',
    lines: [
      ...A17_START,
      N('Hödr sits a little apart from the others, at the edge of the grass, with his hands empty.'),
      N('Nobody goes to him at first. You don’t either.'),
      BA('Brother. Come and sit here. There’s room. There was always room.', 'soft'),
      N('Hödr gets up, and comes over, and sits down next to him.'),
      ...A17_END,
    ],
  },
];

// =================================================================== flags and checks

/** Every flag this line sets (Atlas save only). It reads cinder, keptStone and s24Done, and writes no Grove flag. */
export const ATLAS_A20_FLAGS: string[] = [
  'a20-01',
  'a20-02',
  'a20-03',
  'a20-04',
  'a20-05',
  'a20-06',
  'a20-07',
  'a20-08',
  'a20-09',
  'a20-10',
  'a20-11',
  'a20-12',
  'a20-13',
  'a20-14',
  'a20-15',
  'a20-16',
  'a20-17',
  'a20-done', // A20-17: the whole page; read by atlasDone('A20') for the Price of Power festival
  'a20-thokk', // plead | sat | walked (a20-12-cave): A20-14, A20-16 and A20-17
];

export const ATLAS_A20_CHECKS: string[] = [
  'explore:a20-fensalir:door',
  'deliver:a20-cloak:breidablik',
  'sit:a20-baldr:breidablik',
  'carry:a20-oil:breidablik',
  'escort:a20-baldr:gladsheim',
  'wait:a20-council:gladsheim',
  'watch:a20-oaths:frigg',
  'deliver:a20-asking:beasts',
  'talk:a20-frigg:promise',
  'walk:a20-thing:field',
  'choose:a20-game:ring',
  'talk:a20-hodr:ring-edge',
  'carry:a20-water:fensalir',
  'wait:a20-fensalir:hearth',
  'walk:a20-thing:return',
  'watch:a20-baldr:fall',
  'sit:a20-hodr:ring-edge',
  'visit:a20-frigg:fensalir',
  'escort:a20-sleipnir:fensalir',
  'talk:a20-frigg:door',
  'carry:a20-rollers:shore',
  'watch:a20-hyrrokkin:shore',
  'place:a20-gift:hringhorni',
  'walk:a20-hel-road:dales',
  'visit:a20-gjoll:bridge',
  'climb:a20-helgate:leap',
  'talk:a20-hel:hall',
  'carry:a20-gifts:hel',
  'choose:a20-road:fensalir',
  'carry:a20-frost-stones:sun',
  'sit:a20-nubbin:sun',
  'walk:a20-messengers:home',
  'talk:a20-thokk:cave',
  'climb:a20-mountain:four-doors',
  'inspect:a20-ash:hearth',
  'carry:a20-net:falls',
  'walk:a20-under-earth:stair',
  'sit:a20-sigyn:bowl',
  'watch:a20-earth:shakes',
  'walk:a20-plain:white',
  'find:a20-holt:hoddmimir',
  'sit:a20-lif:holt',
  'climb:a20-holt:edge',
  'wait:a20-holt:twilight',
  'explore:a20-green:fields',
  'visit:a20-idavoll:old-ground',
  'find:a20-game-pieces:grass',
];
