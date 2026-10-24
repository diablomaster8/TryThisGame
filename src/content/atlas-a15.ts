/**
 * Atlas campaign, page A15: The Humbug (Part M, rank 9). Twenty quests, A15-1 to A15-20.
 *
 * SOURCE. L. Frank Baum, The Wonderful Wizard of Oz (George M. Hill Company, Chicago, 1900),
 * illustrated by W. W. Denslow. Rights: public domain everywhere (Baum died in 1919, Denslow in
 * 1915). There is no rights holder for the book. The 1939 MGM film (now owned by Warner Bros.) is
 * still in copyright, and Warner Bros. holds trade marks in its designs: NOTHING FROM THE FILM. No
 * ruby slippers (the shoes are silver), no green-skinned witch, no film dialogue or catchphrases,
 * no songs, no Kansas farmhands, no "it was all a dream". Glinda is the Good Witch of the South;
 * the Witch of the North is a separate, unnamed old woman. Denslow's 1900 illustrations are a
 * safe art reference; all designs here are our own.
 *
 * AUDIENCE. 'all', softened. Every lifted line has a `childLines` replacement for the Learning
 * Grove.
 *
 * FRAME. Nova's atlas falls open at a flat grey prairie with a twist of cloud in one corner. You
 * and your Nubbin step in, meet Dorothy and Toto, and step out of the page into Munchkin country
 * as the house comes down. You are a traveller who falls in with Dorothy on the road. Dorothy, the
 * Scarecrow, the Tin Woodman and the Lion keep their story; you carry the oil-can (from A15-4),
 * tie knots, read signs and keep watch. Your Nubbin trots beside Toto and is no braver than the
 * Lion, which is the point (A15-5, A15-6, A15-18). Baum's talking animals talk (the Lion, the
 * Stork, the Queen of the Field Mice, the Tiger, the Winged Monkeys: canon 31). Toto and your
 * Nubbin never talk.
 *
 * GROVE FLAGS READ (read-only, at the moment the scene plays; the Atlas never writes a Grove flag):
 *   - `corvin` (chapter 9: reconciled | bargained | forced), in A15-14 and A15-16.
 *     - A15-14, the step 2 done scene (the Wizard says he is a good man but a poor Wizard, and was
 *       afraid of the Witches all along). The scene in the quest, a15-14-screen-done, is the
 *       DEFAULT: it plays when `corvin` is unset (chapter 9 not reached) or holds any other value
 *       (the Collector route). For reconciled, bargained or forced, play ATLAS_A15_VARIANTS
 *       a15-14-screen-done-reconciled / -bargained / -forced instead. You think of someone else.
 *     - A15-16, the step 2 done scene (the balloon drifts off). The default, a15-16-launch-done, has
 *       the balloon simply get smaller. For `corvin` = reconciled, play a15-16-launch-done-reconciled:
 *       your Nubbin watches it go and looks back at you, and you think that some of them come back.
 *
 * FLAGS WRITTEN (Atlas save only, all prefixed a15-):
 *   - a15-01 … a15-20: each quest on completion. a15-done: the whole page (A15-20); the Price of
 *     Power festival reads it through atlasDone('A15').
 *   - a15-cap = asked | silent (A15-13, a15-13-flight, the signature choice): picks the A15-20
 *     ending (the Monkey King's answer, "Play.", and the feather; and who carries you to the wall).
 *   - a15-lamb = pocketed | returned (A15-17, a15-17-lamb): picks the A15-20 farewell scene (the
 *     lamb coda before Dorothy's heels click) and the A15-20 ending; pocketed also plays
 *     a15-19-complete-pocketed (the lump in your pocket goes still).
 *   - a15-secret = promised | theirs | quiet (A15-14, a15-14-secret; promised is the keep choice):
 *     picks a15-16-complete-promised / -theirs and a15-20-goodbye-promised / -theirs (the
 *     Scarecrow's first law). quiet plays the defaults.
 *
 * LIFTED TEXT (verbatim; only the passages Part M marks as verified, rechecked there on 2026-10-14
 * against Project Gutenberg #55, The Wonderful Wizard of Oz, the 1900 George M. Hill first edition
 * text; Baum's American spelling "gray" is kept inside the quotations, and the game's curly quotes
 * are used):
 *   1. "Once the house had been painted, but the sun blistered the paint and the rains washed it
 *      away, and now the house was as dull and gray as everything else." (ch. I) Narration, printed
 *      across the top of the atlas page: a15-01-page#2.
 *   2. "No matter how dreary and gray our homes are, we people of flesh and blood would rather live
 *      there than in any other country, be it ever so beautiful. There is no place like home."
 *      (ch. IV) Dorothy to the Scarecrow, split over two lines at the sentence break:
 *      a15-03-kansas#5 and a15-03-kansas#6. This is Baum's sentence from chapter IV, not the film's
 *      chant; it is never repeated at the end.
 * Each is used once. Part M marks passages 3 to 7 [unverified] (ch. XV, the good man and bad
 * Wizard; ch. XV, the spectacles; ch. XV, courage; ch. XX, the china Princess's joints; ch. XXIII,
 * Glinda and the Scarecrow on the first day). They are NOT quoted: each beat is told in our own
 * words (a15-14-screen-done*#0; a15-14-screen#11–12; a15-15-courage#5; a15-17-lamb#5; a15-20-glinda#6
 * and #8). Every other line is original. Baum's other well-known sentences (the Lion's nose
 * smacking, "I am Oz, the Great and Terrible…", "bran-new brains", "I can't come back, my dear",
 * "Take me home to Aunt Em!", the slate's message, the Golden Cap's charm words) are reworded or
 * described, never given. "Oz, the Great and Terrible", "humbug" and "bran-new" are used as names
 * and single words only.
 *
 * CARE NOTES.
 *   - Softened for 'all'. Baum is brisk about death: the Witch of the East, the Kalidahs, forty
 *     wolves, forty crows, the bees, the wildcat and the spider all die on the page. The facts
 *     stay; the staging is gentle and just off the edge of the page: one line, no blood, no
 *     bodies described, and "nobody looks" (A15-6, A15-8, A15-11, A15-18). Oz's price is "rid the
 *     land of her; put an end to her", never "kill". The Witch of the West melts quickly and
 *     quietly, like sugar in tea, with no screaming (A15-12).
 *   - The Hammer-Heads, the Winkies, the Quadlings and the china people are fairy-tale peoples:
 *     funny and odd, never anyone real. No body-shape jokes.
 *   - No Kansas cyclone is ever shown hurting anyone. The house is "carried like a cradle".
 *   - Hazel's third rule is acted out (your Nubbin and the Lion, A15-5 and A15-18), never quoted.
 *   - The Corvin lines are the outline's, word for word; they never explain chapter 9 to a player
 *     who hasn't reached it.
 *   - All art is original, in the atlas's pencil-and-wash style; Denslow (1900) is the reference.
 */
import type { Choice, Line, Mood, Scene } from '../config/story';
import type { Quest, Speaker } from './types';

// ------------------------------------------------------------------ helpers

const say =
  (who: string) =>
  (text: string, mood?: Mood): Line =>
    mood ? { who, text, mood } : { who, text };

/** A source character. */
const sp = (id: string, name: string, basedOn: string): Speaker => ({ id, name, kind: 'other', basedOn });

const WHERE = 'Nova’s atlas: the Humbug page (Atlas campaign)';
const after = (code: string) => `Any time after ${code}, from Nova’s atlas.`;
const BAUM = 'L. Frank Baum, The Wonderful Wizard of Oz, 1900';

// ------------------------------------------------------------------ speakers

const DOROTHY = sp('a15-dorothy', 'Dorothy', `Dorothy, the girl from Kansas (${BAUM}); original design after Denslow, nothing from the 1939 film`);
const SCARECROW = sp('a15-scarecrow', 'The Scarecrow', `The Scarecrow (${BAUM}); original design`);
const WOODMAN = sp('a15-woodman', 'The Tin Woodman', `The Tin Woodman (${BAUM}); original design`);
const LION = sp('a15-lion', 'The Cowardly Lion', `The Cowardly Lion (${BAUM}); original design`);
const EM = sp('a15-em', 'Aunt Em', `Aunt Em (${BAUM})`);
const HENRY = sp('a15-henry', 'Uncle Henry', `Uncle Henry (${BAUM})`);
const NORTH = sp('a15-north', 'The Witch of the North', `The Good Witch of the North, an old woman in white (${BAUM}); not Glinda`);
const MUNCHKIN = sp('a15-munchkin', 'A Munchkin', `One of the three Munchkins at the council (${BAUM})`);
const BOQ = sp('a15-boq', 'Boq', `Boq, the rich Munchkin (${BAUM})`);
const STORK = sp('a15-stork', 'The Stork', `The Stork (${BAUM})`);
const QUEEN = sp('a15-queen', 'The Queen of the Field Mice', `The Queen of the Field Mice (${BAUM})`);
const GUARDIAN = sp('a15-guardian', 'The Guardian of the Gates', `The Guardian of the Gates (${BAUM})`);
const SOLDIER = sp('a15-soldier', 'The Soldier with the Green Whiskers', `The Soldier with the Green Whiskers (${BAUM})`);
const OZ = sp('a15-oz', 'Oz', `Oz, the Great and Terrible: the Wizard, a balloonist from Omaha (${BAUM}); original design`);
const WITCH = sp('a15-witch', 'The Wicked Witch of the West', `The Wicked Witch of the West, one eye, an umbrella (${BAUM}); NOT the film's green witch`);
const WINKIE = sp('a15-winkie', 'A Winkie', `A Winkie tinsmith (${BAUM}); a fairy-tale people in yellow`);
const MONKEY = sp('a15-monkey', 'The King of the Winged Monkeys', `The King of the Winged Monkeys (${BAUM})`);
const MILKMAID = sp('a15-milkmaid', 'The China Milkmaid', `The china milkmaid (${BAUM})`);
const PRINCESS = sp('a15-princess', 'The China Princess', `The china Princess (${BAUM})`);
const TIGER = sp('a15-tiger', 'The Tiger', `The great tiger of the forest council (${BAUM})`);
const HAMMERHEAD = sp('a15-hammerhead', 'A Hammer-Head', `A Hammer-Head (${BAUM}); a fairy-tale people, funny, never anyone real`);
const GLINDA = sp('a15-glinda', 'Glinda', `Glinda, the Good Witch of the South (${BAUM}); original design`);

const N = say('narrator');
const Y = say('you');
const D = say('a15-dorothy');
const SC = say('a15-scarecrow');
const TW = say('a15-woodman');
const L = say('a15-lion');
const AE = say('a15-em');
const UH = say('a15-henry');
const NW = say('a15-north');
const MK = say('a15-munchkin');
const B = say('a15-boq');
const ST = say('a15-stork');
const Q = say('a15-queen');
const G = say('a15-guardian');
const GW = say('a15-soldier');
const O = say('a15-oz');
const W = say('a15-witch');
const WK = say('a15-winkie');
const MO = say('a15-monkey');
const MM = say('a15-milkmaid');
const PR = say('a15-princess');
const TG = say('a15-tiger');
const HH = say('a15-hammerhead');
const GL = say('a15-glinda');

// ------------------------------------------------------------------ lifted text (verified)

/** Ch. I (1900 George M. Hill text; PG #55). Baum's spelling "gray" kept. */
const LIFT_GRAY =
  'Once the house had been painted, but the sun blistered the paint and the rains washed it away, and now the house was as dull and gray as everything else.';
/** Ch. IV (1900 George M. Hill text; PG #55), first sentence. Baum's spelling "gray" kept. */
const LIFT_HOME_1 =
  'No matter how dreary and gray our homes are, we people of flesh and blood would rather live there than in any other country, be it ever so beautiful.';
/** Ch. IV (1900 George M. Hill text; PG #55), second sentence. */
const LIFT_HOME_2 = 'There is no place like home.';

// ------------------------------------------------------------------ shared pieces

/** A15-14: the Wizard's two confessions, before the Corvin thought (all four versions). Passage 3 told in our own words. */
const A14_POOR_WIZARD: Line[] = [
  O('I’m not a wicked man, my dear. Truly I’m not. I’m only a very poor Wizard. There’s a difference, though I grant it’s small.', 'sad'),
  O('And I was frightened of the Witches. All of them, all along. That’s why the walls are so high.', 'sad'),
];

/** A15-16: the balloon goes, before the drift (both versions). */
const A16_GONE: Line[] = [
  D('Wait! Wait for me! Oh, come back!', 'sad'),
  O('I can’t steer it! I never could! Goodbye, my dear! Goodbye!', 'sad'),
  N('The green balloon goes up over the green towers, and gets smaller.'),
];

/** A15-16: the spectacles come off, up to the Guardian's line (all three versions of the complete). */
const A16_SPECS: Line[] = [
  N('In the morning the Guardian of the Gates unlocks everybody’s spectacles at the gate and puts them back in his box.'),
  N('When he comes to your Nubbin, he stops, and looks at it, and looks at you.'),
  G('Keep that pair. It has got used to them. Some do. Keep yours too, if you like, to remember us by.', 'think'),
];

/** A15-16: the plain City, and the souvenir gag (SR-20261024-646), after the a15-secret beat (all three versions). */
const A16_PLAIN: Line[] = [
  N('Without the spectacles, the City is plain stone and glass, with a little green paint here and there.'),
  N('It is very pretty, and not very green at all.'),
  N('You put your pair in your pocket. Your Nubbin keeps its own on, and you let it.'),
  N('It tucks the green spectacles in with the rest of its collection. Your coat pocket is getting full.'),
];

/** A15-19: arriving among the Quadlings (both versions of the complete). */
const A19_QUADLINGS: Line[] = [
  N('The Monkeys set you down in the country of the Quadlings, and fly away. The King looks back once from the sky.'),
  N('Everything here is red: the fences, the houses, the bridges, the Quadlings’ clothes.'),
  N('The Quadlings are small and round and cheerful. They give Dorothy something to eat, and she thanks them.'),
  D('Please, which way is Glinda’s castle?'),
  N('A Quadling points. Far down the road a castle is shining in the sun.'),
];

/** A15-20: Glinda spends the Cap, up to the Scarecrow's eleven laws (all three versions of the goodbye). */
const A20_LAWS: Line[] = [
  GL('Now. The Golden Cap, and its three calls. Let me see.', 'think'),
  GL('Scarecrow: the Monkeys will carry you back to the Emerald City, to rule. The people will be lucky in you.'),
  SC('Thank you. I have just thought of eleven new laws. I shall begin with those.', 'happy'),
];

/** A15-20: the other two friends, and Glinda frees the Monkeys (all three versions of the goodbye). */
const A20_REST: Line[] = [
  GL('Woodman: they will carry you to the land of the Winkies, who want you for their ruler.'),
  TW('I shall rule them kindly. I have the heart for it now.', 'soft'),
  GL('Lion: they will carry you over the Hammer-Heads to your forest, to be King of the Beasts.'),
  L('Thank you. I shouldn’t care to meet the Hammer-Heads again, even as a King.'),
  GL('And then I shall give the Cap to the King of the Monkeys, so that he and his band are free for ever.', 'soft'),
  N('Dorothy hugs each of them in turn, and cries, and kisses the Lion on his great nose.'),
];

/** A15-20: the goodbye choices (all three versions of the goodbye). */
const A20_GOODBYE_CHOICES: Choice[] = [
  {
    id: 'oil',
    label: 'Oil the Woodman’s jaw. He is crying.',
    then: [
      N('The Woodman is crying, of course. You oil his jaw one last time, while the Scarecrow holds his hat, as he did once before.'),
      TW('Keep the can. I mean it. You have been the best oil-can-carrier in all of Oz.', 'soft'),
    ],
  },
  {
    id: 'scarecrow',
    label: 'Shake the Scarecrow’s hand.',
    then: [SC('If you ever need a thought, come to the Emerald City. I have plenty now. I can spare one.', 'happy')],
  },
  {
    id: 'lion',
    label: 'Rest your hand on the Lion’s mane.',
    then: [L('Goodbye, Keeper. Goodbye, little one. You sat by me first. I shan’t forget it.', 'soft')],
  },
];

/** A15-20: Dorothy's farewell to you (both farewell versions), before the choices. */
const A20_FAREWELL: Line[] = [
  D('You came with me the whole way. All the way from the grey. And I still don’t know where you’re from.', 'soft'),
  D('I’ll tell Aunt Em about you. She won’t believe it. She doesn’t believe in anything she can’t sweep.', 'happy'),
  D('Is it grey, where you live?'),
];

const A20_FAREWELL_CHOICES: Choice[] = [
  {
    id: 'green',
    label: 'Tell her it’s green, mostly, with a pond.',
    then: [D('Then you’ve got your own place to go back to. That’s good. Everybody ought to have one.', 'soft')],
  },
  {
    id: 'grey',
    label: 'Tell her there’s a grey one there, and you love her.',
    then: [D('Aunt Em’s grey, and I love her better than anything. So you know, then. You know already.', 'soft')],
  },
  {
    id: 'toto',
    label: 'Let your Nubbin say goodbye to Toto.',
    then: [N('Your Nubbin and Toto touch noses, the way they did on the prairie. Toto sneezes, and it means what it meant then.')],
  },
];

/** A15-20: Dorothy goes home (all four endings). */
const A20_KANSAS: Line[] = [
  N('Dorothy holds Toto tight, takes one last look at all of you, and knocks the heels of the silver shoes together three times.'),
  D('Take me home, please. To Aunt Em.', 'soft'),
  N('She is gone in three great steps, so fast you only see the wind. The silver shoes fall off in the air, and are lost in the desert for good.'),
  N('For a moment the page shows Kansas: a new little farmhouse, grey grass, and Aunt Em running across it with her arms open.', 'soft'),
];

/** A15-20: the page closes (all four endings). The ribbon is the Price of Power bookmark. */
const A20_CLOSE: Line[] = [
  N('The page folds shut, softly, and you are back in the Grove with the atlas on your knee. A thin silver ribbon keeps the place, and it was not there this morning.'),
];

/** A15-20: the lamb wakes over the wall (both pocketed endings). Passage 6's promise kept. */
const A20_LAMB_WAKES: Line[] = [
  N('Over the wall, you set the lamb down in its own field. It stands stiff for a breath, then shakes, and wakes, and runs.', 'soft'),
];

// =================================================================== THE HUMBUG

export const ATLAS_A15: Quest[] = [
  // ---------------------------------------------------------------- A15-1
  {
    id: 'a15-01',
    code: 'A15-1',
    title: 'The Grey Prairie',
    source: 'The Wonderful Wizard of Oz (1900), ch. I: The Cyclone',
    audience: 'all',
    trigger: {
      where: WHERE,
      when: 'Any time once Nova’s atlas is in the Grove; the first quest on the page.',
    },
    speakers: [DOROTHY, EM, HENRY],
    steps: [
      {
        id: 'a15-01-s1',
        goal: 'Step into the grey page and find the farmhouse.',
        hint: 'Touch the page, then walk across the prairie to the only house on it.',
        check: 'explore:a15-prairie:farmhouse',
        scene: {
          id: 'a15-01-page',
          lines: [
            N('Nova’s atlas falls open at a page that is almost all grey: flat land to the edges of the paper, and one small house.'),
            N('In the top corner someone has drawn a twist of cloud, in darker pencil. Across the top runs a line of print.'),
            N(LIFT_GRAY),
            N('The grey goes soft under your fingers. Then it is dry grass, baked flat, and you and your Nubbin are standing in it.'),
            N('There is no tree, no hill, no fence. The sky comes all the way down to the ground on every side.'),
            N('A small black dog comes running through the grass, barking at your Nubbin as if he has waited all day for something new.'),
            D('Toto! Toto, come back! Oh. Hello. I didn’t know anybody lived out this way. Nobody does.'),
            D('I’m Dorothy, and that’s Toto. He’s the only thing round here that isn’t grey, and he knows it.'),
            N('Your Nubbin and Toto sniff each other, nose to nose. Toto decides it is all right, and sneezes.'),
          ],
          choices: [
            {
              id: 'name',
              label: 'Tell her your name.',
              then: [D('That’s a nice name. It sounds like it comes from somewhere with trees.')],
            },
            {
              id: 'grey',
              label: 'Ask why everything is grey.',
              then: [D('The sun, mostly, and the wind. Aunt Em came out here young and pretty, Uncle Henry says. It took the shine off her.', 'sad')],
            },
            {
              id: 'play',
              label: 'Let your Nubbin play with Toto.',
              then: [N('Your Nubbin and Toto race twice round you and fall over in the dust. It is the first noise the prairie has heard all day.')],
            },
          ],
        },
        done: {
          id: 'a15-01-page-done',
          lines: [D('Come up to the house. Aunt Em will want to look at you. She looks at everything as if it might be a cloud.')],
        },
      },
      {
        id: 'a15-01-s2',
        goal: 'Help Uncle Henry and Aunt Em make ready for the storm.',
        hint: 'Watch the sky to the north, then help at the square door in the floor.',
        check: 'watch:a15-cyclone:north',
        scene: {
          id: 'a15-01-storm',
          lines: [
            N('The house is one room: a stove, a table, a cupboard, three or four chairs and two beds. In the floor there is a square door.'),
            N('Uncle Henry is standing on the doorstep, looking at the sky. It has gone a darker grey than usual.'),
            UH('Storm’s coming, Em. A big one. I’m going to see to the animals.', 'think'),
            N('From the north comes a low wail in the wind. The long grass bows down flat, all the way to the edge of the world.'),
            AE('Dorothy! The cellar! Now, child!', 'shock'),
            N('Aunt Em throws open the trap door and climbs down the ladder into the small dark hole underneath.'),
            N('Toto jumps out of Dorothy’s arms and hides under the bed. Dorothy goes down on her knees after him.'),
            D('Toto! Come out! Oh, you bad dog, come out this minute!'),
          ],
          choices: [
            {
              id: 'door',
              label: 'Hold the trap door open for her.',
              then: [N('You kneel and hold the trap door. Aunt Em is calling from below, and the whole house has begun to shake.')],
            },
            {
              id: 'bed',
              label: 'Reach under the bed for Toto.',
              then: [N('You get a hand on Toto’s collar and pass him, wriggling, to Dorothy. The floor is already shaking.')],
            },
            {
              id: 'nubbin',
              label: 'Grab your Nubbin first.',
              then: [N('Your Nubbin is in your arms before you know you’ve reached for it. It is trembling, and so is the floor.')],
            },
          ],
        },
        done: {
          id: 'a15-01-storm-done',
          lines: [
            N('The wind gives a great shriek, and the house shakes so hard that Dorothy sits down suddenly on the floor.'),
            N('Then the house turns round twice, quite slowly, and lifts off the ground like a balloon.'),
          ],
        },
      },
      {
        id: 'a15-01-s3',
        goal: 'Ride out the cyclone, then step out of the page where the house comes down.',
        hint: 'Keep hold of your Nubbin; when the edge of the page curls, step through.',
        check: 'wait:a15-house:munchkin-land',
        scene: {
          id: 'a15-01-cyclone',
          lines: [
            N('The house is carried up to the very middle of the cyclone, where it is strangely quiet, and it rocks along like a cradle.'),
            N('Toto runs about barking. Then he goes too near the open trap door, and falls in.'),
            N('The wind holds him up. Dorothy lies flat on the floor, reaches down, and pulls him back by one ear.'),
            D('There. That’s quite enough adventure for one dog.'),
            N('Hours go by. Nothing happens but the wind, and Dorothy shuts the trap door so that nobody else falls in.'),
            D('I’m going to lie down. If the house is going to fall, I’d rather be asleep for it.', 'think'),
            N('She lies down on her bed with Toto beside her. The house rocks, and she sleeps.'),
            N('You stay awake, with your Nubbin in your lap. Somebody ought to.'),
            N('The edge of the page has begun to curl. Through the gap you can see grass: green grass, and a great deal of it.'),
          ],
          choices: [
            {
              id: 'step',
              label: 'Step through the gap with your Nubbin.',
              then: [N('You step through. Behind you the house drops the last few feet, with a bump that makes the whole page jump.')],
            },
            {
              id: 'look',
              label: 'Take a last look at Dorothy, asleep.',
              then: [N('She is fast asleep, with one arm over Toto. You step through the gap, and the house comes down behind you.')],
            },
          ],
        },
        done: {
          id: 'a15-01-cyclone-done',
          lines: [
            N('You land in soft grass. After all that grey, everything is very bright: green banks, tall trees heavy with fruit, a brook, birds.'),
            N('Behind you the grey farmhouse sits in the middle of it all, a little crooked, as if it had sat down suddenly.'),
          ],
        },
      },
    ],
    complete: {
      id: 'a15-01-complete',
      lines: [
        N('Your Nubbin rolls over and over in the green grass, the way it does in the Grove after rain.'),
        N('The door of the house opens. Dorothy looks out, with Toto in her arms, and her mouth falls open.'),
        D('Oh. Oh, my. Where has Kansas gone?', 'shock'),
        N('Some little people in blue are coming towards the house, very slowly, as if they are not sure it will stay where it is.'),
        N('Under one corner of the house, two feet in silver shoes are sticking out. Nobody has noticed them yet but your Nubbin.'),
      ],
    },
    rewards: [],
    sets: { 'a15-01': true },
    childLines: {
      'a15-01-page#2': 'Long ago the little house was painted, but the sun peeled the paint and the rain washed it off, and now it was grey like everything else.',
    },
    notes:
      'OPENING: the atlas page is pencil and grey wash; it colours in only when you step out into Munchkin country ' +
      '(a slow wash of green, two seconds, at a15-01-cyclone-done). a15-01-page#1–2 show the line of print across the top ' +
      'of the page; voice it as narration. The cyclone is calm and safe on screen: the house rocks "like a cradle", nobody ' +
      'is hurt, and the Kansas cellar is never shown from inside. Toto is a small black dog with long silky hair ' +
      '(Denslow). Dorothy wears a faded gingham frock here; the blue-and-white one comes in A15-2. NO film imagery: no ' +
      'sepia, no farmhands, no Miss Gulch, no bicycle in the sky.',
  },

  // ---------------------------------------------------------------- A15-2
  {
    id: 'a15-02',
    code: 'A15-2',
    title: 'The Council with the Munchkins',
    source: 'The Wonderful Wizard of Oz (1900), ch. II–III: the council, the silver shoes and Boq’s feast',
    audience: 'all',
    trigger: { where: WHERE, when: after('A15-1') },
    requires: ['A15-1'],
    speakers: [DOROTHY, NORTH, MUNCHKIN, BOQ],
    steps: [
      {
        id: 'a15-02-s1',
        goal: 'Greet the little people and the old woman in white.',
        hint: 'Walk round the house to where the Munchkins are waiting.',
        check: 'talk:a15-north:council',
        scene: {
          id: 'a15-02-council',
          lines: [
            N('Three men and a woman come up, no taller than Dorothy. They wear blue, and round pointed hats with little bells that tinkle.'),
            N('The woman is very old, with white hair and a white gown sprinkled with stars. She bows low to Dorothy.'),
            NW('Welcome to the land of the Munchkins, my dear. They have asked me to thank you for setting them free.'),
            D('Thank you. But I think you’ve muddled me up with somebody else. I haven’t done anything.', 'shock'),
            NW('Your house did, then, which comes to the same. Look there, under the corner.', 'think'),
            N('Dorothy looks, and gives a little cry. Two feet in silver shoes are sticking out from under the house.'),
            D('Oh, no. Oh, the poor thing. The house came down right on top of her.', 'sad'),
            NW('Nothing at all. She was the Wicked Witch of the East, and she kept these people working for her night and day.'),
            MK('Night and day! For years! And now she’s gone!', 'happy'),
            N('When they look again, the feet have gone. The old Witch was so very old that she has dried up in the sun, like a dewdrop.'),
            N('Only the silver shoes are left, lying in the grass.'),
            NW('The shoes are yours now. They have some magic in them, though nobody ever learned what.'),
          ],
          choices: [
            {
              id: 'try',
              label: 'Tell Dorothy to try them on.',
              then: [D('They fit. They fit exactly, as if they’d been waiting for me.', 'happy')],
            },
            {
              id: 'careful',
              label: 'Tell her to be careful with them.',
              then: [NW('Wise. A charm is like a dog: best to know what it will do before you take it for a walk.', 'think')],
            },
            {
              id: 'sniff',
              label: 'Let your Nubbin sniff the shoes.',
              then: [N('Your Nubbin sniffs the shoes, sneezes, and sits on them, as if somebody ought to keep them warm.')],
            },
          ],
        },
        done: {
          id: 'a15-02-council-done',
          lines: [
            D('Thank you. But please, can you help me get back to my Aunt Em and Uncle Henry? They’ll be so worried.'),
            NW('Ah. That is harder. Let me see.', 'think'),
          ],
        },
      },
      {
        id: 'a15-02-s2',
        goal: 'Ask the way home, and see what the slate says.',
        hint: 'Watch the Witch of the North’s hat while she counts.',
        check: 'watch:a15-slate:north-hat',
        scene: {
          id: 'a15-02-slate',
          lines: [
            N('The Munchkins shake their heads. To the east there is a great desert, they say, and to the south, and to the west.'),
            MK('And to the north, where she lives, it’s desert too. Nobody crosses. Nobody ever has.', 'sad'),
            N('Dorothy begins to cry. The Munchkins, to be kind, begin to cry too, and their hat bells tinkle sadly.'),
            N('The Witch of the North takes off her pointed hat, balances it on the tip of her nose, and counts: one, two, three.'),
            N('The hat turns into a slate. On it, in big white chalk letters, it says that Dorothy should go to the City of Emeralds.'),
            NW('Are you Dorothy, my dear?'),
            D('Yes.', 'think'),
            NW('Then the City of Emeralds it is. Oz lives there, the great Wizard. Keep to the road of yellow brick and you can’t go wrong.'),
            D('Couldn’t you come too?'),
            NW('I can’t. But I can give you my kiss. Nobody in all this land would dare to hurt someone I have kissed.'),
            N('She kisses Dorothy on the forehead. Where her lips touch, there is a round, shining mark.'),
          ],
          choices: [
            {
              id: 'you',
              label: 'Ask if she’ll kiss you too.',
              then: [NW('You are only visiting, dear. Visitors bring their own luck. Mind you share it.', 'soft')],
            },
            {
              id: 'mark',
              label: 'Look closely at the mark.',
              then: [N('It shines faintly, like a coin at the bottom of a well. Dorothy can’t see it, but everyone else can.')],
            },
            {
              id: 'nose',
              label: 'Hold your Nubbin up to say goodbye.',
              then: [N('The Witch of the North taps your Nubbin once on the nose. It goes cross-eyed with pride, and stays that way some time.')],
            },
          ],
        },
        done: {
          id: 'a15-02-slate-done',
          lines: [N('Then she spins round three times on her left heel, and is gone. Toto barks at the place where she was.')],
        },
      },
      {
        id: 'a15-02-s3',
        goal: 'Help Boq’s household lay the table for the night.',
        hint: 'Carry the blue dishes from the dresser to the long tables outside.',
        check: 'place:a15-table:boq',
        scene: {
          id: 'a15-02-boq',
          lines: [
            N('By evening you have walked a fair way along the road of yellow brick. Dorothy has changed into her clean blue-and-white checked frock.'),
            N('You come to a big house where a rich Munchkin called Boq is giving a feast. Everyone for miles seems to be there.'),
            B('Welcome! Welcome, Sorceress! And the Sorceress’s friend! And the Sorceress’s friend’s… whatever that is.', 'happy'),
            D('I’m not a Sorceress. I’m Dorothy.'),
            B('But you wear silver shoes, and there is white in your frock. Only witches and sorceresses wear white.'),
            D('My frock is blue and white checks.', 'think'),
            B('Then you are a kind witch. That is the best sort. Now: the tables! Five of them, and every plate must be blue.'),
            N('You carry dishes. Everything is blue: the plates, the cups, the jugs, the napkins, the little iced cakes.'),
            B('And where shall the Sorceress’s friend’s whatever-it-is sit?'),
          ],
          choices: [
            {
              id: 'toto',
              label: 'Next to Toto, at the end.',
              then: [N('Your Nubbin and Toto share the end of the bench, and a blue cake, and nobody minds at all.')],
            },
            {
              id: 'dorothy',
              label: 'Next to Dorothy, of course.',
              then: [B('Of course! A place of honour! Fetch the tall stool!', 'happy')],
            },
            {
              id: 'under',
              label: 'Under the table, where the crumbs land.',
              then: [B('Ah, a practical creature. My grandmother was the same.')],
            },
          ],
        },
        done: {
          id: 'a15-02-boq-done',
          lines: [N('Three Munchkins play fiddles and everyone else dances. Dorothy laughs, for the first time since the cyclone.')],
        },
      },
    ],
    complete: {
      id: 'a15-02-complete',
      lines: [
        N('Boq gives Dorothy his best bed, with blue sheets. She falls asleep at once, with Toto curled at her feet.'),
        N('You sit up a while with Boq on his front step. The yellow road runs off into the dark, glowing faintly.'),
        B('It is a long way to the City of Emeralds. Many days. Mind the wild parts.', 'think'),
        B('But she has the Witch’s kiss, and the silver shoes. And she has you, which I suppose is something.'),
        N('Your Nubbin falls asleep beside the silver shoes, one paw on each, as if they might walk off without it.'),
      ],
    },
    rewards: [],
    sets: { 'a15-02': true },
    notes:
      'SOFTENING: the Witch of the East is never seen, only her feet in silver shoes; she "dries up in the sun, like a ' +
      'dewdrop" and is gone between two looks. Nobody celebrates a death: the Munchkins celebrate being free. The slate’s ' +
      'message is described, not quoted (Baum’s wording is not verified). The Witch of the North is an old woman in a ' +
      'white starred gown; she is NOT Glinda and is never named. Munchkin blue everywhere; Boq’s house is round with a ' +
      'domed roof (Denslow).',
  },

  // ---------------------------------------------------------------- A15-3
  {
    id: 'a15-03',
    code: 'A15-3',
    title: 'The Scarecrow',
    source: 'The Wonderful Wizard of Oz (1900), ch. III–IV: the Scarecrow and the road through the forest',
    audience: 'all',
    trigger: { where: WHERE, when: after('A15-2') },
    requires: ['A15-2'],
    speakers: [DOROTHY, SCARECROW],
    steps: [
      {
        id: 'a15-03-s1',
        goal: 'Help lift the Scarecrow down from his pole.',
        hint: 'Climb the fence into the cornfield and hold the pole steady while Dorothy lifts.',
        check: 'climb:a15-pole:cornfield',
        scene: {
          id: 'a15-03-pole',
          lines: [
            N('In the morning the road runs past a big field of ripe corn. High on a pole in the middle, keeping the birds off, there is a Scarecrow.'),
            N('His head is a little sack stuffed with straw, with a face painted on it. He wears an old pointed blue hat.'),
            N('As you look at him, he winks: slowly, with his left eye.'),
            D('Did you see that? I must have dreamed it. Scarecrows in Kansas never wink.', 'shock'),
            SC('Good morning.', 'happy'),
            D('Was that you?'),
            SC('It was. How do you do? Not very well myself, if you want the truth. It is dreadfully dull, up a pole all day.'),
            D('Are you stuck up there?'),
            SC('Not on my own. There’s a pole up the back of my coat, you see. If you could just lift me off it, I’d be ever so grateful.'),
            N('Dorothy reaches up with both arms. Someone needs to hold the pole steady, or it will go over with him on it.'),
          ],
          choices: [
            {
              id: 'hold',
              label: 'Hold the pole steady.',
              then: [N('You hold the pole. Dorothy lifts him off, and the pole jumps in your hands as if it is glad too.')],
            },
            {
              id: 'catch',
              label: 'Stand underneath, ready to catch him.',
              then: [N('Dorothy lifts him off. He tips, and lands on you, which is like being hit by a large, polite pillow.')],
            },
          ],
        },
        done: {
          id: 'a15-03-pole-done',
          lines: [
            SC('Thank you. Thank you both. I feel ever so much more like a person, down here.', 'happy'),
            N('He stretches, yawns, and falls flat on his face. Then he gets up, and falls over sideways.'),
          ],
        },
      },
      {
        id: 'a15-03-s2',
        goal: 'Help the Scarecrow find his feet.',
        hint: 'Walk beside him on the yellow bricks and catch him when he tips.',
        check: 'walk:a15-scarecrow:yellow-brick',
        scene: {
          id: 'a15-03-feet',
          lines: [
            N('The Scarecrow has never walked before. His legs go wherever they like, and they don’t consult each other first.'),
            SC('I was only made the day before yesterday. Before that I was nothing at all, which is restful, but not interesting.'),
            D('I’m going to the City of Emeralds, to ask the great Oz to send me back to Kansas.'),
            SC('This Oz. Does he have brains to spare, do you suppose? I’d take any size.', 'think'),
            SC('Straw arms and legs I don’t mind; they can’t be hurt. But a straw head is another matter. People call you a fool.'),
            D('I don’t know. But come anyway. If he hasn’t any, you’ll have lost nothing but the walk.'),
            SC('So I shall. What a comfort.', 'happy'),
            N('He steps into a hole in the road and goes full length on the bricks. He isn’t hurt in the least.'),
            SC('You see? That is either brains or the lack of them. I can never tell which.'),
          ],
          choices: [
            {
              id: 'arm',
              label: 'Offer him your arm.',
              then: [SC('An arm! The very thing. I shall try very hard not to take it home with me.', 'happy')],
            },
            {
              id: 'holes',
              label: 'Walk ahead and call out the holes.',
              then: [N('“Hole,” you call, and he steps round it; “hole,” and he steps round; “brick,” and he falls over the brick.')],
            },
            {
              id: 'nubbin',
              label: 'Let your Nubbin lead him.',
              then: [N('Your Nubbin walks in front, very slowly. The Scarecrow copies every step, and falls over only twice.')],
            },
          ],
        },
        done: {
          id: 'a15-03-feet-done',
          lines: [N('By noon he can walk a straight line. By afternoon he can very nearly walk a curved one.')],
        },
      },
      {
        id: 'a15-03-s3',
        goal: 'Sit by the road and listen while Dorothy tells him about Kansas.',
        hint: 'Sit with them on the bank while Dorothy eats her bread.',
        check: 'sit:a15-road:bank',
        scene: {
          id: 'a15-03-kansas',
          lines: [
            N('You sit down on the bank, and Dorothy shares out her bread. The Scarecrow doesn’t eat, but he likes being passed things.'),
            SC('Tell me about your country. Kansas, was it?'),
            D('It’s all grey. The ground and the house and the sky. Even Aunt Em and Uncle Henry, nearly.'),
            SC('But here there is green, and birds, and corn. Why would anyone go back to all that grey?', 'think'),
            D('You’d see it differently if you had brains.'),
            D(LIFT_HOME_1),
            D(LIFT_HOME_2, 'soft'),
            SC('I see. So it is brains that make people go home to grey places. Then Kansas is very lucky you have them.', 'think'),
          ],
          choices: [
            {
              id: 'mine',
              label: 'Tell him what you miss about your own home.',
              then: [SC('There you are, then. Everybody with brains has a place somewhere that they’d rather be.', 'happy')],
            },
            {
              id: 'his',
              label: 'Ask him where his home is.',
              then: [SC('A pole in a cornfield. I don’t miss it at all. Perhaps that’s how you can tell it wasn’t home.', 'think')],
            },
            {
              id: 'asleep',
              label: 'Watch your Nubbin, asleep in Dorothy’s lap.',
              then: [N('Your Nubbin is asleep in Dorothy’s lap, and Toto in yours. Nobody has asked them about home; they seem to have found it anyway.')],
            },
          ],
        },
        done: {
          id: 'a15-03-kansas-done',
          lines: [N('The road goes on, and the fields begin to give way to trees. The Scarecrow walks between you, nearly straight.')],
        },
      },
    ],
    complete: {
      id: 'a15-03-complete',
      lines: [
        SC('Shall I tell you a secret? I am afraid of exactly one thing.'),
        D('Crows?'),
        SC('No. Crows are all bluster. Matches. A lighted match.', 'sad'),
        N('You quietly move your matches to the bottom of your bag, under everything.'),
        N('That night he stands in a corner, since he never gets tired. He watches over you all till morning, and says it is the most useful he has ever felt.'),
      ],
    },
    rewards: [],
    sets: { 'a15-03': true },
    childLines: {
      'a15-03-kansas#5': 'Even if home is plain and grey, it’s where my people are. I’d still rather be there than anywhere, however pretty.',
      'a15-03-kansas#6': 'Nowhere else is home.',
    },
    notes:
      'LIFTED TEXT: a15-03-kansas#5–6 are Baum’s chapter IV words, verbatim, split at the sentence break (spoken as one ' +
      'speech, two dialogue boxes). Keep "gray" as Baum spelled it. The surrounding exchange is our own: Baum’s own ' +
      'lines for the Scarecrow’s question and reply are not verified and are not used. The Scarecrow’s face is painted ' +
      'on a sack; his hat is a pointed blue Munchkin hat (Denslow). The matches beat sets up nothing; it is a kindness.',
  },

  // ---------------------------------------------------------------- A15-4
  {
    id: 'a15-04',
    code: 'A15-4',
    title: 'The Tin Woodman',
    source: 'The Wonderful Wizard of Oz (1900), ch. V: the rescue of the Tin Woodman',
    audience: 'all',
    trigger: { where: WHERE, when: after('A15-3') },
    requires: ['A15-3'],
    speakers: [DOROTHY, SCARECROW, WOODMAN],
    steps: [
      {
        id: 'a15-04-s1',
        goal: 'Follow the groaning sound into the forest.',
        hint: 'Leave the road where the trees are thickest, and listen.',
        check: 'find:a15-woodman:forest',
        scene: {
          id: 'a15-04-groan',
          lines: [
            N('In the morning Dorothy goes into the trees to look for water. Not far off, somebody groans.'),
            D('What was that?', 'shock'),
            SC('I can’t imagine. But we might go and see.'),
            N('In a clearing stands a man made all of tin. His axe is raised over his head, as if he had stopped in the middle of a stroke.'),
            N('He is perfectly still. Beside him a tree is half chopped through, and has been for some time.'),
            D('Was that you, groaning?'),
            TW('Mm. Mm-hm. I have been groaning for a year or more. You are the first to come and see why.', 'sad'),
            N('He speaks through his teeth, because his jaw won’t open. His voice comes out like a gate that wants oiling.'),
            D('What can we do?'),
            TW('Oil. Please. I have rusted solid. There is a can of it on the shelf in my cottage, just through the trees.'),
          ],
          choices: [
            {
              id: 'go',
              label: 'Say you’ll fetch it.',
              then: [TW('Thank you. Mind the step. I made it before I was tin, and it has never been level.')],
            },
            {
              id: 'how',
              label: 'Ask how it happened.',
              then: [TW('A rainstorm. I was chopping, and it rained, and I forgot to shelter. That is all. It is always all.', 'sad')],
            },
          ],
        },
        done: {
          id: 'a15-04-groan-done',
          lines: [N('The cottage is just through the trees. You go, with your Nubbin at your heels.')],
        },
      },
      {
        id: 'a15-04-s2',
        goal: 'Find the oil-can in the Woodman’s cottage.',
        hint: 'Look along the shelf; you want the can with the long thin spout.',
        check: 'find:a15-oilcan:cottage',
        scene: {
          id: 'a15-04-cottage',
          lines: [
            N('The cottage is small and very tidy. Everything has been put away by somebody with all the time in the world.'),
            N('There is a bed nobody sleeps in, a table nobody eats at, and a shelf of tins, each with a little dust on top.'),
            N('On the shelf stand three oil-cans: a big square one, a small round one, and a middle one with a long thin spout.'),
            N('Your Nubbin sits under the shelf and looks up, interested, the way it looks at the fruit trees at home.'),
            N('Behind the door a picture is pinned up: a Munchkin girl, drawn in pencil, smiling at someone outside the frame.'),
            N('Under it someone has written a name, crossed it out, and written it again.'),
          ],
          choices: [
            {
              id: 'spout',
              label: 'Take the one with the long spout.',
              then: [N('The long spout will reach right into the joints. You tuck the can under your arm, and it sloshes, comfortably full.')],
            },
            {
              id: 'big',
              label: 'Take the big square one, to be sure.',
              then: [N('The big one is empty, and the one with the spout is full. You take that one instead, and feel you have learned something.')],
            },
            {
              id: 'picture',
              label: 'Look at the picture a little longer.',
              then: [
                N('She has a kind, untidy face. Somebody drew it very carefully, a long time ago.'),
                N('You take the can with the long spout, and go.'),
              ],
            },
          ],
        },
        done: {
          id: 'a15-04-cottage-done',
          lines: [N('You run back through the trees. The Woodman hasn’t moved, because he can’t, but his eyes are glad to see you.')],
        },
      },
      {
        id: 'a15-04-s3',
        goal: 'Oil the Woodman’s joints, in the right order.',
        hint: 'Start with whatever lets him speak; then whatever is tiredest.',
        check: 'puzzle:a15-joints:woodman',
        scene: {
          id: 'a15-04-oil',
          lines: [
            D('Where shall we start?'),
            TW('Mm. Mmm-m.', 'sad'),
            SC('I think he says “neck”. Though I may only think so because I haven’t any brains.'),
            N('The neck is rusted so badly that Dorothy has to work the head from side to side while you oil.'),
            N('At last it turns. The Woodman moves his head, very carefully, as if it might come off.'),
            TW('Thank you. Now my arms, please. I have held this axe up for a year, and I should very much like to put it down.'),
            N('You oil the arms. They creak, then give, and he lowers the axe and leans it against the tree with a great sigh.'),
            TW('That is a great comfort. And now…'),
          ],
          choices: [
            {
              id: 'legs',
              label: 'Do his legs.',
              then: [N('You oil his legs, one joint at a time, until he can walk. He takes three steps, then three more, for the pleasure of it.')],
            },
            {
              id: 'jaw',
              label: 'Give his jaw another drop first.',
              then: [
                TW('Ah. Yes. Much better. I hadn’t liked to ask.', 'happy'),
                N('Then you do his legs, and he takes three steps for the pleasure of it.'),
              ],
            },
            {
              id: 'all',
              label: 'Oil everything you can find, twice.',
              then: [
                N('You oil him from top to toe, twice. He shines like a new kettle.'),
                TW('I may slip over. But I shall slip over very smoothly.', 'happy'),
              ],
            },
          ],
        },
        done: {
          id: 'a15-04-oil-done',
          lines: [TW('Another year and I’d have been a statue. I am more obliged to you than I can say.', 'soft')],
        },
      },
    ],
    complete: {
      id: 'a15-04-complete',
      lines: [
        TW('May I ask why you are in the great forest?'),
        D('We’re going to the City of Emeralds, to see the great Oz. I want to go home, and the Scarecrow wants some brains.'),
        TW('This Oz. Might he have a heart he could spare?', 'think'),
        N('He taps his chest. It rings, hollow, like an empty pail.'),
        TW('I had one once. I was a man, and I loved a Munchkin girl. Then my axe was enchanted, and I lost myself a piece at a time.', 'sad'),
        TW('The tinsmith made me new pieces, one after another. But he never made a heart, and without one I forgot how to love her.', 'sad'),
        SC('I shall still ask for brains. A heart is no use to somebody who can’t think what to do with it.'),
        TW('And I shall ask for a heart. A clever man can be miserable. I would rather be happy, and a heart is how.'),
        N('Dorothy puts the oil-can into your hands. From now on, it seems, it is yours to carry.'),
      ],
    },
    rewards: [],
    sets: { 'a15-04': true },
    notes:
      'PUZZLE (puzzle:a15-joints:woodman): oil neck, then arms, then legs. Any other order still works but the ' +
      'Woodman says so, politely, one line each (sim may pick from: "Not the legs first, please; I should walk off with ' +
      'my arms in the air."). The step can’t be failed. The OIL-CAN is a prop from here to A15-20: show it at your hip on ' +
      'this page only (Atlas save). The enchanted axe is told in one line and never shown; no cutting is described. The ' +
      'pencil girl behind the door is the Munchkin girl he loved; nothing more is made of her.',
  },

  // ---------------------------------------------------------------- A15-5
  {
    id: 'a15-05',
    code: 'A15-5',
    title: 'The Cowardly Lion',
    source: 'The Wonderful Wizard of Oz (1900), ch. VI–VII: the Cowardly Lion, and the beetle',
    audience: 'all',
    trigger: { where: WHERE, when: after('A15-4') },
    requires: ['A15-4'],
    speakers: [DOROTHY, SCARECROW, WOODMAN, LION],
    steps: [
      {
        id: 'a15-05-s1',
        goal: 'Walk on through the deep forest.',
        hint: 'Stay together on the yellow bricks; the woods are darker here.',
        check: 'walk:a15-forest:deep',
        scene: {
          id: 'a15-05-roar',
          lines: [
            N('The road runs into thick woods. It is dim under the trees, and now and then something growls a long way off.'),
            N('Your Nubbin walks so close to your boots that you keep treading on it.'),
            N('Then comes a terrible roar, and out of the trees bounds a great Lion.'),
            N('One blow of his paw sends the Scarecrow spinning to the side of the road. His claws strike the Woodman, and only scratch the tin.'),
            N('Little Toto runs at the Lion, barking. The Lion opens his great mouth.'),
            N('Dorothy rushes forward and smacks the Lion on the nose, as hard as she can.'),
            D('Leave him alone! You great bully, picking on a little dog. You ought to be ashamed!', 'angry'),
            L('I didn’t bite him.', 'sad'),
            N('The Lion rubs his nose with his paw where Dorothy hit it. His eyes are filling up.'),
          ],
          choices: [
            {
              id: 'still',
              label: 'Stand still. Your Nubbin is behind your boots.',
              then: [N('Your Nubbin is pressed flat behind your heels, shaking. You don’t move, so that it has something to hide behind.')],
            },
            {
              id: 'scarecrow',
              label: 'Go and pick up the Scarecrow.',
              then: [
                N('You set the Scarecrow on his feet and pat him back into shape.'),
                SC('Thank you. Is the Lion still there? I couldn’t see, being upside down.'),
              ],
            },
          ],
        },
        done: {
          id: 'a15-05-roar-done',
          lines: [
            D('No, but you meant to frighten him, which is nearly as bad.'),
            L('I know. I’ve always known. Knowing doesn’t help.', 'sad'),
          ],
        },
      },
      {
        id: 'a15-05-s2',
        goal: 'Let your Nubbin decide about the Lion, in its own time.',
        hint: 'Sit down on the roadside and wait. Don’t pull your Nubbin forward.',
        check: 'sit:a15-lion:roadside',
        scene: {
          id: 'a15-05-sit',
          lines: [
            N('The Lion sits down in the road and wipes his eyes with the tip of his tail. He looks very large, and very miserable.'),
            L('A lion is meant to be brave. King of Beasts, and all that. So I roar, and everyone runs away.'),
            L('But if anything ever stood up to me, I should run myself. I can’t help it.', 'sad'),
            TW('Perhaps there is something wrong with your heart.'),
            L('Perhaps there is.', 'sad'),
            TW('Then be glad of it. Something wrong with a heart means there is a heart. I haven’t even that.', 'sad'),
            N('Your Nubbin comes out from behind your boots a little at a time: one paw, then its nose, then the rest of it.'),
            N('It walks across the road, stops, thinks about going back, and doesn’t. Then it sits down beside the Lion, against his foreleg.'),
            L('Oh. Oh, look. It isn’t afraid of me.', 'soft'),
          ],
          choices: [
            {
              id: 'tell',
              label: 'Tell him it’s just as frightened as he is.',
              then: [L('Is it? And it came over anyway? Well. Well, I never.', 'think')],
            },
            {
              id: 'nothing',
              label: 'Say nothing. Let them sit.',
              then: [N('You say nothing. The Lion doesn’t move a whisker, in case your Nubbin changes its mind.')],
            },
          ],
        },
        done: {
          id: 'a15-05-sit-done',
          lines: [
            D('We’re going to the great Oz. He’ll give the Scarecrow brains, and the Woodman a heart.'),
            L('Would he have any courage to spare, do you think? For a lion?', 'think'),
            D('I should think he has a cupboard full. Come with us.'),
          ],
        },
      },
    ],
    complete: {
      id: 'a15-05-complete',
      lines: [
        N('So you all go on together, the Lion walking beside Dorothy with great dignity, and Toto not at all sure about it.'),
        N('Later the Woodman steps on a beetle by accident, and is so sorry that tears run down his face.'),
        N('The tears run into the hinges of his jaw, and in a moment his jaw has rusted shut.'),
        TW('Mm. Mmm!', 'sad'),
        N('You have the oil-can. You do his jaw while the Scarecrow holds his hat.'),
        TW('Thank you. Having no heart, I must take great care never to be unkind to anything. I must watch where I step.', 'sad'),
        N('After that he walks looking down at the road, and steps over every ant.'),
      ],
    },
    rewards: [],
    sets: { 'a15-05': true },
    notes:
      'THE NUBBIN AND THE LION: the slow approach in a15-05-sit#6–7 is the page’s quiet heart. Animate it in real time ' +
      '(about five seconds), with no music. The roar knocks the Scarecrow over and scratches the Woodman: no wounds. ' +
      'Dorothy’s smack is a flat-handed tap on the nose; the Lion is more hurt in his feelings. The Lion’s design is a ' +
      'big, shaggy, sad-eyed lion after Denslow; no film costume, no bow in his mane.',
  },

  // ---------------------------------------------------------------- A15-6
  {
    id: 'a15-06',
    code: 'A15-6',
    title: 'The Kalidahs',
    source: 'The Wonderful Wizard of Oz (1900), ch. VII: the journey to the great Oz',
    audience: 'all',
    trigger: { where: WHERE, when: after('A15-5') },
    requires: ['A15-5'],
    speakers: [DOROTHY, SCARECROW, WOODMAN, LION],
    steps: [
      {
        id: 'a15-06-s1',
        goal: 'Cross the first ditch on the Lion’s back.',
        hint: 'Climb on when the Lion crouches; hold his mane and don’t look down.',
        check: 'climb:a15-lion:first-ditch',
        scene: {
          id: 'a15-06-ditch',
          lines: [
            N('The road comes to a ditch, right across it, wide and very deep. At the bottom are big jagged rocks.'),
            SC('Well, we can’t fly, and I don’t fancy climbing down. So it’s jump it or stay put.'),
            L('I might… I might be able to jump that.', 'think'),
            SC('Then you’re our bridge! One at a time, on your back.'),
            L('Well, I’ll try. Who will go first?'),
            SC('I will. If you jumped short, I shouldn’t mind much, being straw. The rest of you would.'),
            L('I’m frightened of heights, you know. And of ditches. But I’ll try.', 'sad'),
          ],
          choices: [
            {
              id: 'second',
              label: 'Go second, with your Nubbin in your coat.',
              then: [N('You go second, with your Nubbin buttoned into your coat. The Lion leaps, and for a moment there is nothing under you at all.')],
            },
            {
              id: 'last',
              label: 'Go last, after Dorothy.',
              then: [N('You go last. By then the Lion has the knack of it, and lands like a cat coming down off a wall.')],
            },
          ],
        },
        done: {
          id: 'a15-06-ditch-done',
          lines: [
            L('There. That was very frightening. I shall have to sit down.', 'shock'),
            N('He sits, panting. Your Nubbin climbs out of your coat and sits beside him, panting too, to keep him company.'),
          ],
        },
      },
      {
        id: 'a15-06-s2',
        goal: 'Keep watch at the back as the wood grows darker.',
        hint: 'Walk last and listen for growls among the trees.',
        check: 'watch:a15-forest:kalidahs',
        scene: {
          id: 'a15-06-watch',
          lines: [
            N('On this side the forest is darker still. Strange noises come out of the trees, deep and rumbling.'),
            L('Those are the Kalidahs. They live in this part of the forest.', 'shock'),
            D('What are Kalidahs?'),
            L('Great beasts with bodies like bears and heads like tigers, and long, long claws. I am more afraid of them than of anything.'),
            N('You walk at the back. Every time a twig snaps, your Nubbin checks behind you, and then behind itself.'),
            N('Soon the road comes to another ditch. This one is so wide that the Lion knows at once he cannot jump it.'),
            TW('There is a tall tree here by the edge. If I chop it so that it falls across, we can walk over.'),
            SC('A bridge! That is just the sort of thing I shall think of myself, once I have brains.', 'happy'),
          ],
          choices: [
            {
              id: 'listen',
              label: 'Keep listening to the trees.',
              then: [N('You keep listening. The rumbling has stopped, which is worse than the rumbling.')],
            },
            {
              id: 'tree',
              label: 'Help the Woodman choose the tree.',
              then: [N('You pick the straightest tree. The Woodman agrees, and sets his axe to it.')],
            },
          ],
        },
        done: {
          id: 'a15-06-watch-done',
          lines: [N('The tree begins to creak. Behind you, in the dark wood, something else begins to move.')],
        },
      },
      {
        id: 'a15-06-s3',
        goal: 'Help bring the tree down across the ditch, then hurry everyone over.',
        hint: 'Pull the rope when the Woodman shouts; cross quickly and don’t stop on the trunk.',
        check: 'build:a15-bridge:second-ditch',
        scene: {
          id: 'a15-06-bridge',
          lines: [
            N('You loop a rope round the top of the tree. When the Woodman shouts, you and the Lion pull, and it falls with a crash across the ditch.'),
            N('You are just starting over when there is a sharp growl behind you. Two great beasts are running out of the trees.'),
            L('The Kalidahs!', 'shock'),
            SC('Quick! Get across!'),
            N('Dorothy goes first, with Toto in her arms, then the Woodman, then the Scarecrow. You go with your Nubbin under your arm.'),
            N('The Lion goes last. On the far side he turns and gives a roar so terrible that the Scarecrow falls over backwards.'),
            N('The Kalidahs stop short. Then they see that they are bigger than the Lion, and that there are two of them, and they come on.'),
            L('Stand behind me, all of you. I’ll hold them as long as I can.', 'angry'),
            SC('Wait! The tree! Chop the tree!', 'shock'),
          ],
          choices: [
            {
              id: 'beside',
              label: 'Stand beside the Lion.',
              then: [N('You stand by the Lion with your knees shaking, and his are shaking too. You can both feel it.')],
            },
            {
              id: 'back',
              label: 'Pull Dorothy back from the edge.',
              then: [N('You pull Dorothy back from the edge and hold on to her sleeve. She holds on to yours.')],
            },
          ],
        },
        done: {
          id: 'a15-06-bridge-done',
          lines: [
            N('The Woodman swings his axe. Just as the Kalidahs are halfway over, the tree splits, and falls into the gulf, beasts and all.'),
            N('Nobody looks down. After a while, the Lion lets out a long breath.'),
            L('Well. That was very nearly the end of me, and I didn’t care for it at all.', 'shock'),
          ],
        },
      },
    ],
    complete: {
      id: 'a15-06-complete',
      lines: [
        N('The trees thin out. In the afternoon you come to a broad river, running fast; on the far side the yellow road goes on through meadows.'),
        SC('We must make a raft. Woodman, you cut the logs. I shall stand here and think about it.'),
        N('The Woodman starts chopping. Your Nubbin finds a patch of sun on the bank and lies in it, flat as a pancake.'),
        L('That was brave of you, standing by me. You were shaking, though.', 'think'),
        Y('So were you.'),
        L('Yes. I noticed. But we both stayed, didn’t we?', 'soft'),
      ],
    },
    rewards: [],
    sets: { 'a15-06': true },
    notes:
      'SOFTENING: Baum’s Kalidahs are "dashed to pieces" on the rocks. Here the tree splits and falls "beasts and all", ' +
      'the camera stays on the friends’ faces, and nobody looks down: no sound of landing. The Kalidahs are drawn ' +
      'bear-bodied and tiger-headed, big and shaggy rather than gory; no blood, no teeth close-ups. The Lion’s roar ' +
      'makes the Scarecrow fall over backwards, which is the beat’s small joke.',
  },

  // ---------------------------------------------------------------- A15-7
  {
    id: 'a15-07',
    code: 'A15-7',
    title: 'The River and the Stork',
    source: 'The Wonderful Wizard of Oz (1900), ch. VII–VIII: the raft, and the Stork',
    audience: 'all',
    trigger: { where: WHERE, when: after('A15-6') },
    requires: ['A15-6'],
    speakers: [DOROTHY, SCARECROW, WOODMAN, LION, STORK],
    steps: [
      {
        id: 'a15-07-s1',
        goal: 'Tie the logs into a raft.',
        hint: 'Bind each log to the next with a double knot; your Nubbin will hand you the ends.',
        check: 'build:a15-raft:river',
        scene: {
          id: 'a15-07-raft',
          lines: [
            N('By morning the Woodman has cut enough logs. He pegs them together, and you tie every join twice, to be sure.'),
            TW('I don’t know any knots. I was a woodman. Woodmen only know how to make things fall down.'),
            N('Your Nubbin holds the rope ends in its mouth and hands them to you one at a time, very solemnly.'),
            N('The Scarecrow cuts poles to push the raft along. He cuts one for himself, very long, and is proud of it.'),
            L('I shall sit in the middle and keep very still. It’s what I’m best at.'),
            D('Where did you learn your knots?'),
          ],
          choices: [
            {
              id: 'gran',
              label: 'From your gran. She tied up everything.',
              then: [D('Mine are Aunt Em’s. She ties the bread-cloth so tight you need a knife to get in.', 'happy')],
            },
            {
              id: 'book',
              label: 'From a book with pictures in it.',
              then: [SC('A book! Brains come in books, I’ve heard. Perhaps I could stuff one in.', 'think')],
            },
            {
              id: 'chew',
              label: 'Your Nubbin taught you. It chews them.',
              then: [N('Your Nubbin, hearing this, chews the next knot. You tie it again.')],
            },
          ],
        },
        done: {
          id: 'a15-07-raft-done',
          lines: [N('The raft floats. Everyone climbs aboard, and it sinks a little under the Lion, and comes up again.')],
        },
      },
      {
        id: 'a15-07-s2',
        goal: 'Ride the raft across, and get everyone ashore.',
        hint: 'Hold on in the middle; when the Lion swims, hold the Woodman’s belt.',
        check: 'wait:a15-raft:current',
        scene: {
          id: 'a15-07-current',
          lines: [
            N('At first the raft goes well. Then, in the middle, the current takes it and carries it downstream, away from the yellow road.'),
            SC('We’re going the wrong way! This river runs west, to the Wicked Witch’s country!', 'shock'),
            N('The Scarecrow pushes his long pole into the river bottom as hard as he can. It sticks fast in the mud.'),
            N('Before he can pull it out, the raft is swept away from under him. He is left clinging to the top of the pole, in the middle of the river.'),
            SC('Goodbye!', 'sad'),
            D('Oh, the poor Scarecrow!', 'sad'),
            L('We must do something. I can swim. Hold on to my tail, Woodman, and I’ll pull us to the bank.'),
            N('The Lion jumps in. The Woodman holds his tail, you hold the Woodman’s belt, and the Lion swims with all his strength.'),
          ],
          choices: [
            {
              id: 'shout',
              label: 'Shout to the Scarecrow that you’ll come back.',
              then: [SC('Thank you! I shan’t go anywhere! I can’t!', 'sad')],
            },
            {
              id: 'spray',
              label: 'Hold your Nubbin out of the spray.',
              then: [N('You hold your Nubbin up out of the spray. It watches the Scarecrow the whole way, until he is a dot.')],
            },
          ],
        },
        done: {
          id: 'a15-07-current-done',
          lines: [
            N('At last you reach the bank, far downstream. Everyone is soaked, and you oil the Woodman at once.'),
            D('Now we must walk back up the bank and find him.'),
          ],
        },
      },
      {
        id: 'a15-07-s3',
        goal: 'Wave down the Stork and ask her to fetch the Scarecrow.',
        hint: 'Walk back up the bank until you see the pole, then signal the big bird overhead.',
        check: 'talk:a15-stork:riverbank',
        scene: {
          id: 'a15-07-stork',
          lines: [
            N('You walk back along the bank a long way. At last you see him, sitting on his pole in the middle of the river, very lonely.'),
            D('He’s too far out. Nobody could swim to him now.', 'sad'),
            N('The Lion and the Woodman sit down on the bank. The Woodman is very near tears, and you get the oil-can ready.'),
            TW('I would give a great deal to have him back. I had no friends at all, before this week.', 'sad'),
            N('A big Stork is flying over, quite low, looking for fish.'),
            N('Your Nubbin sees her first, and stands up on its back legs.'),
          ],
          choices: [
            {
              id: 'wave',
              label: 'Wave both arms at the Stork.',
              then: [N('You wave both arms. The Stork tilts, circles, and lands on the bank beside you, folding up like an umbrella.')],
            },
            {
              id: 'whistle',
              label: 'Whistle as loud as you can.',
              then: [N('You whistle. The Stork wheels round to see what bird could make such a dreadful noise, and lands beside you.')],
            },
            {
              id: 'hold',
              label: 'Hold your Nubbin up so she can see it.',
              then: [N('You hold your Nubbin up. The Stork comes down for a closer look, decides it isn’t a fish, and stays to talk.')],
            },
          ],
        },
        done: {
          id: 'a15-07-stork-done',
          lines: [
            ST('Well? What’s all this waving about?'),
            D('I’m Dorothy, and these are my friends. That’s our friend the Scarecrow, out there on the pole.'),
            ST('Is he heavy? I can’t carry anything heavy. I dropped a goose once and I have never heard the end of it.'),
            D('He’s only straw. He weighs hardly anything.'),
            ST('Then I’ll try. But if he’s heavier than he looks, back in the river he goes.'),
          ],
        },
      },
    ],
    complete: {
      id: 'a15-07-complete',
      lines: [
        N('The Stork flies out over the water, takes the Scarecrow by the arm in her long claws, and carries him back to the bank.'),
        SC('I was beginning to think I’d spend the rest of my life on a stick. Again!', 'happy'),
        N('He hugs everybody, even the Lion and Toto. He hugs you twice, and your Nubbin once, carefully.'),
        SC('When I’ve got my brains, I’ll come back and think of something splendid to do for you.'),
        ST('Don’t mention it. I’ve a nest full of chicks to get back to, and they will not stop shouting.', 'happy'),
        N('She flies away. The Scarecrow waves until she is gone, and then a little longer.'),
      ],
    },
    rewards: [],
    sets: { 'a15-07': true },
    notes:
      'The river is never dangerous to you or Dorothy on screen: the raft drifts, nobody falls in but the Lion, who means ' +
      'to. The Scarecrow on his pole is the comic picture of the page (Denslow drew it). The Stork is a talking animal ' +
      'in Oz and may speak; she is brisk and motherly.',
  },

  // ---------------------------------------------------------------- A15-8
  {
    id: 'a15-08',
    code: 'A15-8',
    title: 'The Poppy Field and the Field Mice',
    source: 'The Wonderful Wizard of Oz (1900), ch. VIII–IX: the deadly poppy field, and the Queen of the Field Mice',
    audience: 'all',
    trigger: { where: WHERE, when: after('A15-7') },
    requires: ['A15-7'],
    speakers: [DOROTHY, SCARECROW, WOODMAN, LION, QUEEN],
    steps: [
      {
        id: 'a15-08-s1',
        goal: 'Carry your Nubbin out of the poppies.',
        hint: 'Hold your breath where the flowers are thickest and head for the green beyond.',
        check: 'carry:a15-nubbin:poppies',
        scene: {
          id: 'a15-08-poppies',
          lines: [
            N('The road leads you through meadows of flowers, yellow and white and blue. Then, ahead, a great field of scarlet poppies.'),
            N('Their smell is very strong and very sweet. Dorothy breathes it in, and yawns.'),
            D('I think I’ll sit down for a minute. Just one minute.', 'soft'),
            TW('Don’t sit down! The smell of these flowers sends you to sleep, and you sleep and sleep and nobody can wake you.', 'shock'),
            N('But Dorothy’s eyes close, and she sinks down among the poppies. Toto lies down beside her.'),
            N('Your Nubbin walks slower and slower. It lies down with its nose in a red flower, and is gone.'),
            N('You feel it too: a heaviness in your arms and legs, as if the page itself wanted you to lie down.'),
            L('Run, all of you! I’ll go as fast as I can, and wait for you on the other side.', 'shock'),
            SC('The Woodman and I don’t breathe, so we can carry Dorothy and Toto. You carry your Nubbin, Keeper. Quick!'),
          ],
          choices: [
            {
              id: 'breath',
              label: 'Hold your breath and run.',
              then: [N('You hold your breath, scoop up your Nubbin, and run until your chest burns.')],
            },
            {
              id: 'sleeve',
              label: 'Breathe through your sleeve and walk steadily.',
              then: [N('You breathe through your sleeve and put one foot in front of the other, and don’t look at how far it is.')],
            },
          ],
        },
        done: {
          id: 'a15-08-poppies-done',
          lines: [
            N('You come out on to grass at the edge of the field. Your Nubbin sneezes and wakes up, very cross about it.'),
            N('The Lion is lying asleep among the poppies, a long way back. He very nearly made it.'),
            SC('We can do nothing for him. He is much too heavy to lift.', 'sad'),
          ],
        },
      },
      {
        id: 'a15-08-s2',
        goal: 'Watch over Dorothy by the river, out of the poppies.',
        hint: 'Stay on the grass by the river bank, where the breeze is fresh.',
        check: 'watch:a15-wildcat:meadow',
        scene: {
          id: 'a15-08-wildcat',
          lines: [
            N('You lay Dorothy on the grass by the river, where the fresh breeze can wake her.'),
            N('A low growl, and a great yellow wildcat comes bounding through the grass, chasing something small and grey.'),
            N('It is a little field mouse, running for her life. The wildcat is gaining on her with every bound.'),
            N('The Woodman, though he has no heart, knows it is wrong for the big one to catch the small one. He lifts his axe.'),
            N('One swing, and the wildcat will never chase anything again.'),
            N('The Woodman doesn’t look at where it lies. He looks at the mouse.'),
            Q('Oh, thank you! Thank you! I thought that was the end of me.'),
            TW('Please don’t mention it. I have no heart, you see, so I try to help anyone who needs a friend. Even a mouse.'),
            Q('A mouse? I am the Queen. The Queen of every Field Mouse there is!', 'shock'),
            N('Out of the grass come mice, dozens of mice, then hundreds, all running and squeaking to their Queen.'),
          ],
          choices: [
            {
              id: 'bow',
              label: 'Bow to the Queen.',
              then: [Q('Thank you. Most people don’t, at my size. It is very hard to be a Queen at my size.', 'happy')],
            },
            {
              id: 'still',
              label: 'Make sure your Nubbin keeps still.',
              then: [N('Your Nubbin keeps perfectly still, with a mouse on its head. It has decided this is an honour.')],
            },
            {
              id: 'lion',
              label: 'Ask if the mice can help the Lion.',
              then: [Q('A Lion? In the poppies? A friend of yours? He would not… eat us?', 'shock')],
            },
          ],
        },
        done: {
          id: 'a15-08-wildcat-done',
          lines: [
            SC('Oh! I have thought of something! A great many mice. And the Lion!', 'happy'),
            Q('A Lion? Won’t he eat us?'),
            SC('Not he. He’s a coward. Also he’s asleep. Also he’s our friend.'),
          ],
        },
      },
      {
        id: 'a15-08-s3',
        goal: 'Tie a string to every mouse.',
        hint: 'Take a string from the pile, loop it gently round a mouse, and pass the other end to the Woodman.',
        check: 'craft:a15-strings:cart',
        scene: {
          id: 'a15-08-strings',
          lines: [
            SC('Woodman, make us a cart with wheels, out of these trees. Your Majesty, tell all your people to bring a long piece of string.'),
            N('The Woodman chops and pegs. In an hour he has made a low cart, with wheels cut from a tree trunk.'),
            N('The mice arrive in their thousands, each with a piece of string: big mice and little mice and middle-sized mice.'),
            SC('Now: one string round each mouse, very loose. Round the middle, not the neck. They must be comfortable.'),
            N('So you tie: loop, knot, next mouse; loop, knot, next mouse.'),
            N('Your Nubbin hands you the strings, and the Woodman ties the other ends to the cart.'),
            Q('Mind the little one at the end. She is very young and very proud of being asked.'),
            N('At last every string is tied. The mice stand in long rows in front of the cart, like a great grey carpet with whiskers.'),
          ],
          choices: [
            {
              id: 'count',
              label: 'Count the mice.',
              then: [N('You get to four hundred and twelve, then a mouse moves and you have to start again. You decide “a great many” will do.')],
            },
            {
              id: 'bow',
              label: 'Tie the little one’s string last, with a bow.',
              then: [Q('A bow! She will be impossible now. Thank you.', 'happy')],
            },
          ],
        },
        done: {
          id: 'a15-08-strings-done',
          lines: [
            N('The Scarecrow and the Woodman go into the poppies, without breathing, and roll the sleeping Lion on to the cart.'),
            N('Then the Queen gives the word, and the mice pull, thousands of them together, and the heavy cart begins to move.'),
          ],
        },
      },
    ],
    complete: {
      id: 'a15-08-complete',
      lines: [
        N('They haul the Lion out of the poppies and on to the green grass, where the air is fresh. Then you untie every mouse.'),
        N('Dorothy wakes up on the bank. She hears the whole story, and thanks every mouse she can reach.'),
        Q('You have only to call us. Come out into the fields and call, and we shall come running. We are quick, for our size.'),
        N('Much later the Lion wakes up. He is very glad to be alive, and very surprised to hear how.'),
        L('Mice? Mice carried me? Little mice?', 'shock'),
        N('Your Nubbin climbs up and lies down between his ears, very pleased with itself, as if it did most of the pulling.'),
      ],
    },
    rewards: [],
    sets: { 'a15-08': true },
    notes:
      'SOFTENING: Baum’s Woodman cuts off the wildcat’s head. Here it is one swing, cut away before it lands; the next ' +
      'shot is the Woodman looking at the mouse. Nothing lies on screen. The poppies are the danger, but sleep is shown ' +
      'as plain sleep: Dorothy, Toto, your Nubbin and the Lion are all clearly breathing. The mice’s strings go round ' +
      'their middles, loosely (Baum ties them round the neck). The Keeper is a visitor and feels the poppies slowly; ' +
      'the step can’t be failed.',
  },

  // ---------------------------------------------------------------- A15-9
  {
    id: 'a15-09',
    code: 'A15-9',
    title: 'The Green Spectacles',
    source: 'The Wonderful Wizard of Oz (1900), ch. X–XI: the Guardian of the Gate, and the Emerald City',
    audience: 'all',
    trigger: { where: WHERE, when: after('A15-8') },
    requires: ['A15-8'],
    speakers: [DOROTHY, SCARECROW, WOODMAN, LION, GUARDIAN, SOLDIER],
    steps: [
      {
        id: 'a15-09-s1',
        goal: 'Follow the yellow road to the great green gate.',
        hint: 'Walk on until the sky itself looks green, then ring the bell by the gate.',
        check: 'walk:a15-road:emerald-gate',
        scene: {
          id: 'a15-09-gate',
          lines: [
            N('The fences by the road are painted green now, and so are the houses. Even the light seems a little green.'),
            SC('That must be the Emerald City.'),
            N('Ahead there is a green glow in the sky. Then a great high wall, bright green, and a gate studded with emeralds.'),
            N('There is a bell beside the gate. Dorothy pushes the button, and a silvery tinkle sounds inside.'),
            N('The gate swings slowly open. You all go through into a high arched room, glittering with green.'),
            N('Before you stands a little man, about the size of a Munchkin. He is dressed in green from head to foot, and even his skin is faintly green.'),
            G('And what brings you to the Emerald City?'),
            D('Please, we’d like to see the Great Oz.', 'think'),
            G('To see Oz? Nobody has asked that in years. He is powerful and terrible, and a foolish errand might make him very angry.', 'shock'),
          ],
          choices: [
            {
              id: 'not',
              label: 'Say it isn’t a foolish errand.',
              then: [SC('Foolish? Certainly not. Important. Very. And we hear he’s a good Wizard, besides.')],
            },
            {
              id: 'far',
              label: 'Say you’ve all come a very long way.',
              then: [G('Everybody has, to get here. It’s a long way from everywhere. That’s rather the point of it.')],
            },
            {
              id: 'foot',
              label: 'Let your Nubbin answer, its own way.',
              then: [N('Your Nubbin walks up to the Guardian and sits on his foot. He looks down at it, and seems a little less worried.')],
            },
          ],
        },
        done: {
          id: 'a15-09-gate-done',
          lines: [G('Then you’ll want to see him. But spectacles first. Nobody goes in without spectacles.')],
        },
      },
      {
        id: 'a15-09-s2',
        goal: 'Let the Guardian lock the green spectacles on you, and on your Nubbin.',
        hint: 'Sit still while he buckles them; your Nubbin will want to watch you go first.',
        check: 'inspect:a15-spectacles:gate',
        scene: {
          id: 'a15-09-spectacles',
          lines: [
            D('Why?'),
            G('Because the City is so bright and so glorious that it would blind you without them. Everyone wears them. Even the people who live here.'),
            G('They are locked on. Oz ordered it so when the City was first built, and I have the only key.'),
            N('He opens a big box. It is full of spectacles of every size and shape, and every one has green glass in it.'),
            N('He fits a pair on Dorothy, and on the Scarecrow, and the Woodman, and the Lion. He even finds a little pair for Toto.'),
            N('Two gold bands go round the back of each head, and lock together with a key he wears on a chain round his neck.'),
            G('And for… whatever this is.', 'think'),
            N('He hunts through the box a long time. At last he finds a very small pair with round lenses, and fits them on your Nubbin.'),
            N('Then yours. The gold bands click shut behind your ears.'),
            N('Everything is green: the walls, the floor, your own hands. Your Nubbin looks up at you, green, through its little green lenses.'),
          ],
          choices: [
            {
              id: 'ask',
              label: 'Ask why they have to be locked.',
              then: [G('Because Oz said so. That is the best sort of reason. It saves everybody a great deal of thinking.')],
            },
            {
              id: 'check',
              label: 'Check that your Nubbin is all right.',
              then: [N('Your Nubbin turns its head left, then right, then looks at you for a long time, as if to make sure you are still you.')],
            },
          ],
        },
        done: {
          id: 'a15-09-spectacles-done',
          lines: [
            N('The others look at one another through green glass, and nobody asks why.'),
            N('It is easier, somehow, not to.'),
          ],
        },
      },
      {
        id: 'a15-09-s3',
        goal: 'Walk through the streets of the Emerald City.',
        hint: 'Follow the Guardian through the streets to the Palace in the middle.',
        check: 'explore:a15-city:streets',
        scene: {
          id: 'a15-09-streets',
          lines: [
            N('Even through green spectacles the City dazzles you. The streets are lined with fine houses, set with emeralds.'),
            N('The people are dressed in green, and their skin looks green too. They stare at the Lion, and the children hide behind their mothers.'),
            N('A man is selling green lemonade. A boy is selling green popcorn, and the children pay for it with green pennies.'),
            SC('Everything is green. I wonder why.', 'think'),
            D('It’s the Emerald City. It’s meant to be green.'),
            SC('Of course. Of course it is.'),
            N('Everyone looks happy and contented and well off. Nobody looks up very much.'),
          ],
          choices: [
            {
              id: 'lemonade',
              label: 'Buy your Nubbin a green lemonade.',
              then: [
                N('Your Nubbin drinks it all and looks up for more.'),
                N('Whether the lemonade is really green, you’ll never know. The spectacles don’t come off.'),
              ],
            },
            {
              id: 'towers',
              label: 'Look up at the towers.',
              then: [N('The towers are green against a green sky. It is very beautiful, and it gives you a slight headache.')],
            },
          ],
        },
        done: {
          id: 'a15-09-streets-done',
          lines: [N('At last you come to a great building in the middle of the City: the Palace of Oz, the Great Wizard.')],
        },
      },
    ],
    complete: {
      id: 'a15-09-complete',
      lines: [
        N('At the door stands a soldier in a green uniform, with a long green beard that reaches to his knees.'),
        GW('You wish to see the Great Oz. I shall tell him you are here.', 'think'),
        N('He goes in, and is gone a long time. You all stand in the green hall, on a green carpet, under a green ceiling.'),
        GW('Oz will see you. But one at a time, and one each day.'),
        GW('Until then you may each have a room in the Palace, with a green bed, and a green bath, and green books.'),
        N('Your room has a little green fountain in it. Your Nubbin sleeps in the basin, with its spectacles on.'),
      ],
    },
    rewards: [],
    sets: { 'a15-09': true },
    notes:
      'GREEN SPECTACLES (screen tint): from a15-09-spectacles#8 to A15-10’s complete, and again from A15-13’s complete ' +
      'to A15-16’s complete, the whole page is drawn through a green tint, your Nubbin included. "Nobody asks why" is ' +
      'the point: only the player can ask, and the answer is no answer. The Emerald City art is lavish and green; its ' +
      'people are cheerful and incurious. No film Emerald City (no Art Deco towers, no Horse of a Different Colour).',
  },

  // ---------------------------------------------------------------- A15-10
  {
    id: 'a15-10',
    code: 'A15-10',
    title: 'Oz, the Great and Terrible',
    source: 'The Wonderful Wizard of Oz (1900), ch. XI: the Wonderful City of Oz',
    audience: 'all',
    trigger: { where: WHERE, when: after('A15-9') },
    requires: ['A15-9'],
    speakers: [DOROTHY, SCARECROW, WOODMAN, LION, OZ],
    steps: [
      {
        id: 'a15-10-s1',
        goal: 'Go into the Throne Room with Dorothy.',
        hint: 'Walk in behind Dorothy, stand where the Soldier puts you, and keep still.',
        check: 'escort:a15-dorothy:throne-room',
        scene: {
          id: 'a15-10-head',
          lines: [
            N('In the morning the Soldier comes for Dorothy. She holds on to your sleeve, and he looks at you, and lets you come.'),
            N('The Throne Room is big and round, with a high arched roof. Walls, ceiling and floor are covered in emeralds, set close together.'),
            N('In the middle is a big throne of green marble. On it, with no body to hold it up, is an enormous Head.'),
            N('It has no arms or legs at all. Its eyes turn slowly, and look at Dorothy, and then at you.'),
            O('I am Oz, the Great and Terrible. Speak. What do you want of me?', 'angry'),
            D('I’m Dorothy. I’m nobody very much. I’ve come to ask for your help.'),
            O('Those silver shoes. How did you come by them?'),
            D('From the Wicked Witch of the East. My house fell on her.'),
            O('And the mark on your forehead?'),
            D('The Witch of the North kissed me there. Please, I want to go back to Kansas, to Aunt Em and Uncle Henry.'),
            O('Then you must do something for me first. Nothing is free here. You must earn it.', 'think'),
          ],
          choices: [
            {
              id: 'hand',
              label: 'Hold Dorothy’s hand.',
              then: [N('Dorothy’s hand is cold, and holds on tight. The Head watches you both, and doesn’t blink.')],
            },
            {
              id: 'look',
              label: 'Look at the Head very carefully.',
              then: [
                N('You look carefully. The eyes move, and the mouth.'),
                N('It is a very good Head, almost too good.'),
              ],
            },
          ],
        },
        done: {
          id: 'a15-10-head-done',
          lines: [
            O('Rid the land of the Wicked Witch of the West. Put an end to her. Then I will send you home.'),
            D('But I can’t! I’ve never hurt anything on purpose in my whole life.', 'sad'),
            O('You have my answer. Until the Witch is gone, you will not see your Aunt and Uncle again. Go.'),
          ],
        },
      },
      {
        id: 'a15-10-s2',
        goal: 'Hear what Oz looked like to the others.',
        hint: 'Wait in the green hall each day and talk to whoever comes out.',
        check: 'talk:a15-friends:green-hall',
        scene: {
          id: 'a15-10-reports',
          lines: [
            N('The next day it is the Scarecrow’s turn. He comes out of the Throne Room looking dazed, and sits down on the floor.'),
            SC('He wasn’t a Head. He was a lovely Lady in green silk gauze, with wings. She said I should have brains when the Witch was gone.'),
            N('The day after, the Woodman goes in. He comes out walking very carefully, the way he does when he has been frightened.'),
            TW('He was not a Lady. He was a terrible Beast, nearly as big as an elephant, with five eyes and five arms and woolly hair all over.', 'shock'),
            TW('He said the same. The Witch, first. Then a heart.', 'sad'),
            D('He was a Head when I went in.', 'think'),
            SC('Then which is he really?'),
          ],
          choices: [
            {
              id: 'all',
              label: 'Say he might be all of them.',
              then: [SC('All of them? That is a great deal of Wizard. I should be quite worn out, being so many things.', 'think')],
            },
            {
              id: 'none',
              label: 'Say he might be none of them.',
              then: [N('Everyone goes quiet.'), TW('None of them? Then what is in there?', 'shock')],
            },
            {
              id: 'wait',
              label: 'Say you’ll know when the Lion has been.',
              then: [L('Me? Oh. Oh, dear. I’d forgotten it was me tomorrow.', 'shock')],
            },
          ],
        },
        done: {
          id: 'a15-10-reports-done',
          lines: [L('I shall roar at him. Then he’ll have to give me what I ask. Or I shall run away. It could go either way.', 'think')],
        },
      },
      {
        id: 'a15-10-s3',
        goal: 'Wait outside the Throne Room while the Lion goes in.',
        hint: 'Stand by the door with the others and watch the light under it.',
        check: 'wait:a15-lion:throne-door',
        scene: {
          id: 'a15-10-fire',
          lines: [
            N('On the fourth day the Lion goes in, last, which he says is out of politeness. The door shuts behind him with a click.'),
            N('You wait outside with the others. Under the door there is a line of light, and it is getting brighter, and redder.'),
            N('Then the heat comes, so strong that the Woodman takes a step back and the Scarecrow takes three.'),
            SC('Mind the door. Mind the door, please. I am very dry.', 'shock'),
            N('The door bursts open and the Lion comes out at a gallop, with his tail between his legs.'),
            L('A Ball of Fire! He was a Ball of Fire, so hot I couldn’t look at it!', 'shock'),
            L('I tried to go nearer and it singed my whiskers. So I came out. Quite quickly, as you saw.'),
            N('Your Nubbin runs to him and pats out a small smoking place on the end of his tail.'),
          ],
          choices: [
            {
              id: 'whiskers',
              label: 'Look at his whiskers.',
              then: [N('Three whiskers are curled at the ends, like the corners of an old letter. Later he is rather proud of them.')],
            },
            {
              id: 'said',
              label: 'Ask what the Ball of Fire said.',
              then: [L('Exactly what he said to all of you. The Witch, first. Then courage. Then everything.', 'sad')],
            },
          ],
        },
        done: {
          id: 'a15-10-fire-done',
          lines: [L('He’s the same, whatever he looks like. He wants the Witch gone, and he wants us to do it.')],
        },
      },
    ],
    complete: {
      id: 'a15-10-complete',
      lines: [
        N('That night you all sit in the green hall and talk it over. Nobody wants to go, and nobody can see another way.'),
        D('I suppose we must try. But I don’t want to hurt anybody. Not even her.', 'sad'),
        L('I’ll come. I shall be too frightened to be much use. But I’ll come.'),
        SC('I shall come too. I shan’t be much use either, being such a fool.'),
        TW('I haven’t the heart to harm even a Witch. But if you go, I must go with you.'),
        N('In the morning the Guardian unlocks your spectacles and puts them back in his box. He points west, where there is no road at all.'),
      ],
    },
    rewards: [],
    sets: { 'a15-10': true },
    notes:
      'SOFTENING: Oz’s price is "rid the land of her; put an end to her" (Baum: kill her). Dorothy’s reply keeps the ' +
      'book’s point, that she has never hurt anything on purpose. THE FOUR FORMS: Dorothy and you see the Head (a huge ' +
      'bald head on the throne, no body); the others report the Lady, the Beast and the Ball of Fire, and only the Ball of ' +
      'Fire is shown, as light and heat under the door. All four are the Wizard’s stagecraft; play them as theatre: grand, ' +
      'a little too grand. You are let in with Dorothy as her companion; the Soldier says nothing about it.',
  },

  // ---------------------------------------------------------------- A15-11
  {
    id: 'a15-11',
    code: 'A15-11',
    title: 'The Witch of the West',
    source: 'The Wonderful Wizard of Oz (1900), ch. XII: the search for the Wicked Witch',
    audience: 'all',
    trigger: { where: WHERE, when: after('A15-10') },
    requires: ['A15-10'],
    speakers: [DOROTHY, SCARECROW, LION, WITCH, MONKEY],
    steps: [
      {
        id: 'a15-11-s1',
        goal: 'Keep watch while the Witch sends her creatures.',
        hint: 'Stay close to the others; when you see the next wave coming, call it.',
        check: 'watch:a15-witch:west',
        scene: {
          id: 'a15-11-waves',
          lines: [
            N('The country to the west is rough and hilly, with no farms and no houses. Everything there is yellow, the Winkies’ colour.'),
            N('The Wicked Witch of the West has only one eye, but it sees as far as a telescope. From her castle door she sees you all.'),
            N('She blows a silver whistle. Out of the far hills comes a pack of great wolves, running hard.'),
            N('You see them first, because you are keeping watch. The Woodman goes to stand in front of the rest of you, with his axe.'),
            N('When the sun comes up, none of the wolves will ever trouble anyone again. You don’t look long.'),
            N('Next she sends a flock of wild crows. The Scarecrow stands up with his arms stretched out, and when it is over the sky is empty.'),
            N('Then a swarm of black bees. The Scarecrow pulls out his own straw and covers Dorothy, Toto, the Lion, you and your Nubbin with it.'),
            N('The bees find only the Woodman, who is tin. Their stings break on him, and that is the end of the bees.'),
            N('Last she sends a dozen Winkie soldiers with spears. The Lion gives one great roar, and they run all the way home.'),
            N('Far away in her castle, the Witch stamps her foot.'),
            W('Then I shall use the Cap. There is nothing else left.', 'angry'),
          ],
          choices: [
            {
              id: 'straw',
              label: 'Help stuff the Scarecrow again.',
              then: [SC('Thank you. I feel quite myself. A bit lumpy round the middle, but that is how I like it.', 'happy')],
            },
            {
              id: 'fur',
              label: 'Pick the straw out of your Nubbin’s fur.',
              then: [N('Your Nubbin has straw in its ears and its fur and its mouth. It seems to like the taste.')],
            },
          ],
        },
        done: {
          id: 'a15-11-waves-done',
          lines: [
            N('In the Witch’s cupboard is a Golden Cap with a ring of diamonds round it.'),
            N('The Cap comes with a bargain: whoever owns it may call the Winged Monkeys three times. Nobody asked the Monkeys.'),
            N('She has used it twice already. She puts it on, stands on one foot and then the other, and says the words.'),
          ],
        },
      },
      {
        id: 'a15-11-s2',
        goal: 'Hold on to Dorothy when the Winged Monkeys come.',
        hint: 'Don’t run. Hold Dorothy’s hand and keep your Nubbin close.',
        check: 'wait:a15-monkeys:sky',
        scene: {
          id: 'a15-11-monkeys',
          lines: [
            N('The sky darkens, and there is a great rushing of wings. A band of Monkeys comes down out of the sky, each with a pair of huge wings.'),
            MO('Sorry about this. We have no choice in it. That is the whole trouble with us.', 'sad'),
            N('Some of them seize the Woodman, fly high over a rocky place, and drop him. He lies there dented and battered, and can’t move.'),
            N('Others catch the Scarecrow and pull out all his straw. His hat and boots and clothes go into the top of a tall tree.'),
            N('The rest throw ropes round the Lion, lift him up, and fly off with him towards the Witch’s castle.'),
            N('Then the King flies down at Dorothy with his long arms out, and stops.'),
            MO('Stop! The mark of the Good Witch, on her forehead. We can’t touch her. Nor anyone holding her hand.'),
            N('You are holding her hand, and hadn’t known you were.'),
            N('Your Nubbin is holding on to your boot.'),
          ],
          choices: [
            {
              id: 'tighter',
              label: 'Hold on tighter.',
              then: [N('You hold on tighter. The Monkeys lift the three of you, very gently, as if you were eggs.')],
            },
            {
              id: 'shout',
              label: 'Shout to the Scarecrow that you’ll come back.',
              then: [N('Up in the tree the Scarecrow’s hat nods, or the wind does it. You decide it was the Scarecrow.')],
            },
          ],
        },
        done: {
          id: 'a15-11-monkeys-done',
          lines: [
            N('The Monkeys carry you over the hills to the Witch’s castle, set you down at the door, and fly away.'),
            W('Hm. The Good Witch’s mark. And the silver shoes.', 'think'),
            N('For a moment the Witch looks afraid. Then she looks into Dorothy’s eyes, and sees that the girl has no idea what the shoes can do.'),
            W('She doesn’t know. Look at her. She hasn’t the least idea.', 'happy'),
          ],
        },
      },
      {
        id: 'a15-11-s3',
        goal: 'Bring the Lion food in secret, as Dorothy does.',
        hint: 'When the Witch is asleep, carry what you saved from supper out to the yard.',
        check: 'feed:a15-lion:yard',
        scene: {
          id: 'a15-11-yard',
          lines: [
            W('You! Girl! Clean the pots, sweep the floor, and keep the fire fed. And you, whatever you are, help her.', 'angry'),
            N('So you work in the Witch’s kitchen with Dorothy.'),
            N('The Witch doesn’t dare touch her, because of the mark, so she shouts instead.'),
            N('Out in the yard the Lion is shut behind a gate. The Witch means to harness him like a horse, to pull her carriage.'),
            N('Every time she comes near, he roars so loud that she jumps back.'),
            W('Then you shall have nothing to eat until you do as I say.', 'angry'),
            N('So every night, when the Witch is asleep, Dorothy carries food to the Lion from the cupboard. You keep watch at the kitchen door.'),
            N('Tonight it is your turn to carry it. Your Nubbin follows you out across the dark yard, on its softest feet.'),
          ],
          choices: [
            {
              id: 'bread',
              label: 'Bring him the bread you saved from supper.',
              then: [L('Bread. Lovely. You must have gone hungry for this.', 'soft')],
            },
            {
              id: 'stew',
              label: 'Bring him a bowl of the Witch’s own stew.',
              then: [L('Her own stew? From her own pot? That is the bravest thing I ever saw.', 'happy')],
            },
            {
              id: 'sit',
              label: 'Bring the food, then stay and sit with him.',
              then: [N('You sit with your back against his side. He is warm, and he purrs, very quietly, in case the Witch hears.')],
            },
          ],
        },
        done: {
          id: 'a15-11-yard-done',
          lines: [
            L('How shall we ever get away? Is there any way at all?', 'sad'),
            D('I don’t know. But we’ll find one. Somebody always does.'),
          ],
        },
      },
    ],
    complete: {
      id: 'a15-11-complete',
      lines: [
        N('Days go by. The Witch watches the silver shoes all the time with her one eye, and wants them more than anything.'),
        N('Dorothy only takes them off at night, and for her bath.'),
        N('The Witch is afraid of the dark, and more afraid of water, so she never comes near either.'),
        W('I have commanded wolves, crows, bees and Monkeys. I cannot get one girl to sweep behind the door.', 'angry'),
        N('You sweep round the bucket by the kitchen door instead. It is full to the brim.'),
        W('And somebody empty that bucket!', 'angry'),
        N('Nobody does. Your Nubbin looks at it every day, and decides it is not its job.'),
      ],
    },
    rewards: [],
    sets: { 'a15-11': true },
    notes:
      'SOFTENING (care notes): Baum’s forty wolves, forty crows and the bees all die on the page, the wolves and crows by ' +
      'the Woodman’s axe and the Scarecrow’s hands. Here each wave is one narrator line that ends the danger and looks ' +
      'away: the Woodman stands in front (cut to dawn), the Scarecrow stretches his arms (cut to empty sky), the bees ' +
      'break their stings on tin. No bodies, no sound effects of harm. The Winkies just run. The Winged Monkeys are ' +
      'rough but never cruel on screen: the Scarecrow is scattered (comic), the Woodman dented (no damage close-up), the ' +
      'Lion roped. THE WITCH: one eye, an umbrella, plaits, after Denslow; ordinary skin; she is cross and greedy and a ' +
      'little afraid, never cackling. The yard beat (feed:a15-lion:yard) is one secret meal; it is not a nightly chore ' +
      'for the player.',
  },

  // ---------------------------------------------------------------- A15-12
  {
    id: 'a15-12',
    code: 'A15-12',
    title: 'The Bucket of Water',
    source: 'The Wonderful Wizard of Oz (1900), ch. XII–XIII: the bucket, and the rescue',
    audience: 'all',
    trigger: { where: WHERE, when: after('A15-11') },
    requires: ['A15-11'],
    speakers: [DOROTHY, SCARECROW, WOODMAN, WITCH, WINKIE],
    steps: [
      {
        id: 'a15-12-s1',
        goal: 'See the Witch’s trick, and try to warn Dorothy.',
        hint: 'Sweep near the middle of the kitchen floor; something there isn’t right.',
        check: 'inspect:a15-bar:kitchen',
        scene: {
          id: 'a15-12-bar',
          lines: [
            N('One morning the Witch is in a very good mood. She hums, and doesn’t shout once.'),
            N('In the middle of the kitchen floor she has laid an iron bar, and by her magic made it so nobody can see it.'),
            N('You don’t see it. But your Nubbin stops and sniffs at a place on the floor where there is nothing, and won’t walk over it.'),
            N('Dorothy comes in with the pail, humming too, because it seems to be catching.'),
            W('Fetch me the wood, girl. Quickly now. Straight across the floor. Don’t mind me.', 'happy'),
            N('Dorothy starts across the floor, and you see your Nubbin’s ears go flat.'),
          ],
          choices: [
            {
              id: 'warn',
              label: 'Call out to Dorothy to stop.',
              then: [N('You call out. Dorothy turns to look at you, steps backwards, and falls over the bar.')],
            },
            {
              id: 'feel',
              label: 'Kneel and feel the floor where your Nubbin is sniffing.',
              then: [N('Your hand finds cold iron where there is nothing to see. Before you can say so, Dorothy walks straight into it.')],
            },
          ],
        },
        done: {
          id: 'a15-12-bar-done',
          lines: [
            N('Dorothy trips and falls flat, and one silver shoe comes off.'),
            N('Before she can reach it, the Witch has snatched it up and put it on her own thin foot.'),
            W('Ha! One silver shoe. Half a charm is a great deal better than none.', 'happy'),
          ],
        },
      },
      {
        id: 'a15-12-s2',
        goal: 'Stand clear while Dorothy throws the bucket.',
        hint: 'Step back from the doorway, and mind your Nubbin’s feet.',
        check: 'watch:a15-bucket:kitchen',
        scene: {
          id: 'a15-12-bucket',
          lines: [
            D('Give me back my shoe!', 'angry'),
            W('Certainly not. It’s mine now. Finders keepers.', 'happy'),
            D('It isn’t yours! You’ve no right to it! You’re a mean, wicked old thing!', 'angry'),
            W('Shout all you like, girl. I’ll have the other one off you too, one fine day.', 'happy'),
            N('Dorothy is so angry that she picks up the bucket of water by the door and throws it over the Witch, from head to foot.'),
            N('The Witch gives a gasp. Then, as Dorothy stares at her, she begins to shrink.'),
            W('Water! Oh, you wretched girl, water! I’m going, I’m going…', 'shock'),
            D('I’m sorry! I didn’t know!', 'shock'),
            N('She melts quickly and quietly, like sugar in hot tea. In a moment there is only a brown puddle on the floor, and her empty dress.'),
          ],
          choices: [
            {
              id: 'back',
              label: 'Hold your Nubbin back from the puddle.',
              then: [N('Your Nubbin very much wants to sniff the puddle. You don’t let it.')],
            },
            {
              id: 'dorothy',
              label: 'Go to Dorothy.',
              then: [
                D('I didn’t know. I didn’t know it would do that.', 'sad'),
                N('You stand with her a moment. She is shaking a little, and so is the bucket in her hand.'),
              ],
            },
          ],
        },
        done: {
          id: 'a15-12-bucket-done',
          lines: [
            N('Your Nubbin looks at the empty bucket, then at you. It is very glad it never emptied it.'),
            N('Dorothy picks the silver shoe out of the puddle, dries it, and puts it back on.'),
            N('Then she pours a fresh bucket over the puddle and sweeps it all out of the door.'),
            D('She’s gone. She’s really gone. Now the Lion can come in.'),
          ],
        },
      },
      {
        id: 'a15-12-s3',
        goal: 'Help the Winkies mend the Woodman and restuff the Scarecrow.',
        hint: 'Go with the Winkies to the rocks and the tall tree; carry straw back for the Scarecrow.',
        check: 'craft:a15-friends:mend',
        scene: {
          id: 'a15-12-mend',
          lines: [
            N('Dorothy lets the Lion out of the yard. Then she calls all the Winkies together and tells them they are free.'),
            WK('Free? No more working for her? Not ever?', 'shock'),
            N('The Winkies hold a feast day and dance, all in yellow. It is their colour, as blue is the Munchkins’.'),
            D('Now, please, can you help us find our friends?'),
            WK('We have tinsmiths. The best in the land. Show us where the tin man fell.'),
            N('You lead them to the rocks. The Woodman lies there, badly dented, with his axe rusted and its blade broken.'),
            N('The tinsmiths work for three days and four nights, hammering and soldering and polishing, until he is straight again.'),
            N('Then you all go to the tall tree where the Scarecrow’s clothes are caught. The Woodman chops it down with his new axe.'),
            N('You stuff the clothes with clean, fresh straw. Your Nubbin packs it in, very hard, with its paws.'),
          ],
          choices: [
            {
              id: 'oil',
              label: 'Oil the Woodman’s new joints.',
              then: [TW('Ah. Thank you. They made me splendid, but they forgot I am a person who needs oiling.', 'happy')],
            },
            {
              id: 'straw',
              label: 'Give the Scarecrow an extra handful of straw.',
              then: [SC('Oh! I feel so plump and important. As if I might have a thought at any moment.', 'happy')],
            },
          ],
        },
        done: {
          id: 'a15-12-mend-done',
          lines: [
            SC('There. Am I myself again? It feels like me.', 'happy'),
            N('He is himself, and the Woodman is himself, and the Lion is purring. Dorothy laughs, then cries, then laughs again.'),
          ],
        },
      },
    ],
    complete: {
      id: 'a15-12-complete',
      lines: [
        N('Before you leave, Dorothy goes to the Witch’s cupboard to fill her basket. On the shelf she finds the Golden Cap.'),
        D('It’s very pretty. And it fits. I’ll wear it instead of my sunbonnet.'),
        N('She doesn’t know what it does, and neither, exactly, do you. It sits on her head, glittering, waiting.'),
        WK('And this is for your little one. We made it in the night.', 'happy'),
        N('It is a tiny gold cap, beaten thin, with glass beads round the band for diamonds. It fits your Nubbin exactly.'),
        WK('It doesn’t call anything. It’s just a hat. But it’s a very good hat.'),
        N('The Winkies ask the Woodman to stay and rule them. He says he will come back, once he has a heart.'),
      ],
    },
    rewards: [
      {
        id: 'a15-golden-cap-hat',
        kind: 'cosmetic',
        label: 'Golden Cap (Nubbin hat)',
        description: 'A tiny beaten-gold cap with a band of glass beads, made by the Winkie tinsmiths. It has no calls left in it, and never had any.',
      },
    ],
    sets: { 'a15-12': true },
    notes:
      'SOFTENING (care notes): the melting is quick, quiet and not frightening: the Witch shrinks like sugar in tea, says ' +
      'one line, and is a small puddle and an empty dress within two seconds. No screaming, no smoke, no face close-up. ' +
      'Dorothy is sorry; nobody cheers her death, only their freedom. REWARD: the Golden Cap hat (cosmetic) is granted ' +
      'at the complete scene, one time. It is gold-coloured tin, not the real Cap, which stays with Dorothy and goes to ' +
      'Glinda in A15-20.',
  },

  // ---------------------------------------------------------------- A15-13
  {
    id: 'a15-13',
    code: 'A15-13',
    title: 'The Golden Cap',
    source: 'The Wonderful Wizard of Oz (1900), ch. XIV: the Winged Monkeys',
    audience: 'all',
    trigger: { where: WHERE, when: after('A15-12') },
    requires: ['A15-12'],
    speakers: [DOROTHY, SCARECROW, QUEEN, MONKEY, GUARDIAN],
    steps: [
      {
        id: 'a15-13-s1',
        goal: 'Read the words inside the Golden Cap.',
        hint: 'Turn the Cap over and read the lining aloud; it tells you which foot to stand on.',
        check: 'puzzle:a15-cap:lining',
        scene: {
          id: 'a15-13-lost',
          lines: [
            N('Going back east there is no road. You walk towards the rising sun, but the grass all looks the same, and soon you are lost.'),
            SC('I have no brains, so I can’t help. But it seems to me we have passed that bush three times.', 'think'),
            N('Days go by. The Lion is hungry, and the Woodman has stopped talking to save his oil.'),
            D('I know! The Queen of the Field Mice!'),
            N('Dorothy calls, the way the Queen told her. In a minute a great many little feet come pattering through the grass.'),
            Q('Friends! What do you need?'),
            D('We’re lost. Which way is the Emerald City?'),
            Q('Miles and miles. But you’re wearing the Cap that calls the Winged Monkeys. Didn’t you know? They could fly you there before lunch.', 'think'),
            N('Dorothy turns the Cap over and hands it to you. You are the one who reads the signs, and this seems to be a sign.'),
            N('Inside the band are three odd words, and small instructions about which foot to stand on. They look like nonsense, which is how charms look.'),
          ],
          choices: [
            {
              id: 'read',
              label: 'Read the words out for her, slowly.',
              then: [N('You read them slowly. Dorothy says them after you, standing on her left foot, then her right, then both.')],
            },
            {
              id: 'foot',
              label: 'Let your Nubbin stand on one foot too.',
              then: [N('Your Nubbin stands on one foot, falls over, stands on the other, and falls over again. Dorothy laughs in the middle of the charm.')],
            },
          ],
        },
        done: {
          id: 'a15-13-lost-done',
          lines: [
            N('A great chattering and flapping, and the band of Winged Monkeys lands all round you.'),
            MO('First call. What is it you want?', 'think'),
            D('Please, carry us to the Emerald City. We’ve lost our way.'),
          ],
        },
      },
      {
        id: 'a15-13-s2',
        goal: 'Fly to the Emerald City, and listen to the Monkey King.',
        hint: 'Hold on to the King as he carries you; ask him something, or let him be.',
        check: 'talk:a15-monkey-king:flight',
        scene: {
          id: 'a15-13-flight',
          lines: [
            N('Two Monkeys make a chair of their hands for Dorothy. Others take the Scarecrow and the Woodman, and a whole team takes the Lion.'),
            N('The King carries you himself, with your Nubbin held tight. The ground goes by far below, like a green and yellow blanket.'),
            D('Why do you have to do what the Cap says?', 'think'),
            MO('It’s a long story. But we have a long way to go, so I will tell it.', 'sad'),
            MO('We were free, once. The forest was ours. We went where we liked and ate what we found, and nobody gave us orders.'),
            MO('There was a princess, a sorceress, called Gayelette. She was to marry a young man named Quelala, the best and wisest in the land.'),
            MO('One day my grandfather, who was King then, saw Quelala walking by the river in fine clothes. He thought it would be funny.'),
            MO('We dropped him in the river. He climbed out laughing, but Gayelette did not laugh at all.'),
            MO('So she bound us to the Golden Cap. Whoever owns it may call us three times, and we must obey.', 'sad'),
            MO('We have been called ever since. We go where we are sent, and carry what we are told, and drop what we are told.', 'sad'),
          ],
          choices: [
            {
              id: 'ask',
              label: 'Ask what they would do, if they were free.',
              set: { 'a15-cap': 'asked' },
              then: [
                MO('Free?', 'shock'),
                MO('I don’t know. Nobody has ever asked. I shall have to think about it.', 'think'),
                N('He flies on in silence. Every so often you see him look up at the sky, as if it had changed.'),
              ],
            },
            {
              id: 'silent',
              label: 'Say nothing. Listen to the wind.',
              set: { 'a15-cap': 'silent' },
              then: [N('You say nothing. The King flies on, and the wind takes his story away behind you, over the fields.')],
            },
          ],
        },
        done: {
          id: 'a15-13-flight-done',
          lines: [
            N('The Monkeys set you all down at the gate of the Emerald City, bow once, and fly away fast.'),
            SC('Now that is how to travel. No ditches at all.', 'happy'),
          ],
        },
      },
    ],
    complete: {
      id: 'a15-13-complete',
      lines: [
        N('The Guardian of the Gates is very surprised to see you. He looks at you all twice, as if counting.'),
        G('You went to see the Wicked Witch of the West. And you came back?', 'shock'),
        SC('Melted, with a bucket. Dorothy did it.'),
        G('Melted? Truly? Well, well, well.', 'happy'),
        N('He opens his big box and locks the green spectacles on you all again. The gold bands click shut behind your ears.'),
        N('Your Nubbin holds still for its pair without being asked. It has got used to the world being green.'),
      ],
    },
    rewards: [],
    sets: { 'a15-13': true },
    notes:
      'SIGNATURE CHOICE (a15-13-flight): a15-cap = asked | silent. It pays off in A15-20’s ending, seven quests later: ' +
      'if asked, the King answers "Play." when Glinda frees him, his band loops over the castle, and a feather falls ' +
      'for your Nubbin (the Monkey Feather reward), and if you also pocketed the lamb his band flies you to the china ' +
      'wall. If silent, they simply fly away. THE CHARM: Baum’s three charm words are not quoted (not verified); the ' +
      'lining is drawn with three squiggly words the player can’t quite read. The Queen of the Field Mice answers ' +
      'Dorothy’s call (Baum gives Dorothy a whistle in ch. IX; a call does the same here). This is Dorothy’s first call ' +
      'of three; the Witch’s calls were her own.',
  },

  // ---------------------------------------------------------------- A15-14
  {
    id: 'a15-14',
    code: 'A15-14',
    title: 'The Humbug',
    source: 'The Wonderful Wizard of Oz (1900), ch. XV: the discovery of Oz, the Terrible',
    audience: 'all',
    trigger: { where: WHERE, when: after('A15-13') },
    requires: ['A15-13'],
    speakers: [DOROTHY, SCARECROW, WOODMAN, LION, OZ],
    steps: [
      {
        id: 'a15-14-s1',
        goal: 'Go into the Throne Room together, all of you.',
        hint: 'Stand together in the middle of the room, and keep your eyes open.',
        check: 'visit:a15-throne:together',
        scene: {
          id: 'a15-14-voice',
          lines: [
            N('Oz keeps you waiting four days. On the fifth, the Scarecrow sends word that the Winged Monkeys might be asked their opinion.'),
            N('You are let in at once, all of you together.'),
            N('There is no Head, no Lady, no Beast and no Ball of Fire: only the empty throne, and a hush.'),
            O('I am Oz, the Great and Terrible. Why have you come?'),
            N('The voice comes from near the top of the great dome. It seems to come from everywhere at once.'),
            D('We’ve come for what you promised us. The Wicked Witch is gone.'),
            O('Is she really gone?', 'shock'),
            D('Yes. I melted her with a bucket of water.'),
            O('Goodness. Melted. Well… give me a day. I shall need a little time to think it over.'),
            TW('You have had weeks to think!', 'angry'),
            SC('Not one more day. Not one.', 'angry'),
            L('I think… I think I should roar now.', 'think'),
          ],
          choices: [
            {
              id: 'roar',
              label: 'Tell the Lion to go on, then.',
              then: [N('The Lion gives a roar so loud and fierce that Toto jumps away from him in alarm, and runs off into a corner.')],
            },
            {
              id: 'let',
              label: 'Let go of your Nubbin.',
              then: [N('Your Nubbin, let go, runs after Toto, who has run off barking at a corner of the room.')],
            },
          ],
        },
        done: {
          id: 'a15-14-voice-done',
          lines: [
            N('Toto tips over a screen that stands in the corner. It falls with a crash.'),
            N('Behind it stands a little old man, with a bald head and a wrinkled face. He looks as surprised as anybody.'),
          ],
        },
      },
      {
        id: 'a15-14-s2',
        goal: 'Hear the little man out.',
        hint: 'Stand still and let him talk; he’s more frightened than you are.',
        check: 'talk:a15-oz:screen',
        scene: {
          id: 'a15-14-screen',
          lines: [
            N('The Woodman raises his axe and rushes at the little man.'),
            TW('Who are you?', 'angry'),
            O('I… I am Oz. The Great. And the… please, put that down. Please. I’ll do whatever you like.', 'shock'),
            D('But you were a Head! A great big Head!'),
            SC('You were a Lady, with wings.'),
            L('You were on fire!'),
            O('All of those were me, and none of them were. It was pretending, you see. All pretending.', 'sad'),
            SC('Then you’re a humbug!', 'shock'),
            O('Yes. A humbug. That is quite the right word for it.', 'sad'),
            O('I was born in Omaha. I was a ventriloquist, which means I can throw my voice. Into a bird, or a statue, or a dome.'),
            O('Then I went up in balloons at the circus, to draw the crowds. One day the ropes got twisted, and I couldn’t come down.'),
            O('I came down here, out of the clouds, and the people thought I was a great Wizard. It was green, mostly, so I called it the Emerald City.'),
            O('Then I had to make the name come true. So I gave everybody spectacles. Green ones. Locked on. It was only a small lie, to begin with.', 'sad'),
          ],
          choices: [
            {
              id: 'band',
              label: 'Touch the gold band behind your ear.',
              then: [N('The City is green because you are wearing green. It was never very much else.')],
            },
            {
              id: 'lenses',
              label: 'Look at your Nubbin, in its little green lenses.',
              then: [N('Your Nubbin looks back at you through two green circles. It has never once seen this place as it really is.')],
            },
          ],
        },
        done: {
          id: 'a15-14-screen-done',
          lines: [
            ...A14_POOR_WIZARD,
            N('Somebody back home sells safety too.'),
            N('You hope he never meets this little man. They would get on far too well.'),
          ],
        },
      },
      {
        id: 'a15-14-s3',
        goal: 'Decide whether to keep his secret.',
        hint: 'He’s asking you, of all of them. Answer him.',
        check: 'choose:a15-oz:secret',
        scene: {
          id: 'a15-14-secret',
          lines: [
            N('Dorothy and the others have gone to the far side of the room to talk it over in angry whispers. The little man turns to you.'),
            O('You haven’t said anything. You’re from somewhere else, aren’t you? I can always tell. I was from somewhere else once.'),
            O('Please don’t tell anyone outside this room. The people here are happy. They think they are safe, because I am here.'),
            O('If they knew, they would be frightened. And then they would be very angry with me, and that would frighten me.'),
            N('He looks very old and very small, like someone who has been holding his breath for years.'),
            O('I’ll do my best for your friends, I promise. I am good at making people feel better. It’s nearly the same thing.', 'think'),
          ],
          choices: [
            {
              id: 'keep',
              label: 'Promise to keep his secret.',
              set: { 'a15-secret': 'promised' },
              then: [
                O('Thank you. Thank you. You don’t know what that is, to someone like me.', 'soft'),
                N('He shakes your hand. His hand is warm and damp, the hand of a frightened man.'),
              ],
            },
            {
              id: 'theirs',
              label: 'Tell him it isn’t yours to keep. It’s theirs.',
              set: { 'a15-secret': 'theirs' },
              then: [
                O('Theirs. Yes. I suppose it is. I suppose it always was.', 'sad'),
                N('He doesn’t argue. He looks almost relieved, the way people do when the worst has been said out loud.'),
              ],
            },
            {
              id: 'quiet',
              label: 'Say nothing, and look at the screen.',
              set: { 'a15-secret': 'quiet' },
              then: [N('You look at the screen on the floor, and so does he. Neither of you says anything for quite a long time.')],
            },
          ],
        },
        done: {
          id: 'a15-14-secret-done',
          lines: [O('Come to me in the morning, all of you. I shall have something for each of you. I always do.')],
        },
      },
    ],
    complete: {
      id: 'a15-14-complete',
      lines: [
        D('But how will I get home to Kansas?'),
        O('Ah. Kansas. That one will take some thinking. Give me a few days. I’ll find a way, I promise.'),
        SC('And my brains?'),
        O('Tomorrow. Brains, a heart and courage. Come in the morning, one at a time.'),
        L('But you’re only a humbug. How can a humbug give anybody anything?', 'think'),
        O('You’d be surprised. Most of what people want, they only want to be told they have.', 'think'),
        N('Going out, you stand the screen back up in its corner. It seems kinder, somehow, than leaving it on the floor.'),
      ],
    },
    rewards: [],
    sets: { 'a15-14': true },
    notes:
      'CORVIN READ (Grove flag `corvin`, read-only, at the moment a15-14-screen-done plays). The scene shown is the ' +
      'DEFAULT: `corvin` unset (chapter 9 not reached) or any value other than the three below (the Collector route). ' +
      'For reconciled play ATLAS_A15_VARIANTS a15-14-screen-done-reconciled; for bargained, a15-14-screen-done-bargained; ' +
      'for forced, a15-14-screen-done-forced. Each keeps the Wizard’s two lines and changes only the two narrator lines ' +
      'after them (the outline’s words, split at a sentence break). Hold a beat (one second, no music) before the ' +
      'narrator lines. LIFTED TEXT: none here; passages 3 and 4 are told in our own words (A14_POOR_WIZARD#0, ' +
      'a15-14-screen#11–12). SECRET CHOICE (a15-14-secret): a15-secret = promised (keep) | theirs | quiet. It pays off ' +
      'twice: a small beat in a15-16-complete (ATLAS_A15_VARIANTS a15-16-complete-promised / -theirs) and the real one ' +
      'six quests on, in the Scarecrow’s first law at a15-20-goodbye (a15-20-goodbye-promised / -theirs). quiet plays ' +
      'the default scenes. The keep value is "promised", not "keep", because the Grove flag finalChoice can be keep and ' +
      'variants answer Grove values too. The screen is a plain folding ' +
      'screen. The Wizard is a little bald man in an ordinary coat (Denslow); NO film curtain, no booth of levers.',
  },

  // ---------------------------------------------------------------- A15-15
  {
    id: 'a15-15',
    code: 'A15-15',
    title: 'The Magic Art',
    source: 'The Wonderful Wizard of Oz (1900), ch. XVI: the magic art of the Great Humbug',
    audience: 'all',
    trigger: { where: WHERE, when: after('A15-14') },
    requires: ['A15-14'],
    speakers: [SCARECROW, WOODMAN, LION, OZ],
    steps: [
      {
        id: 'a15-15-s1',
        goal: 'Help Oz mix the Scarecrow’s brains.',
        hint: 'Measure out the bran, then hand Oz the pins and needles, points away from you.',
        check: 'craft:a15-brains:bran',
        scene: {
          id: 'a15-15-brains',
          lines: [
            N('In the morning the Scarecrow goes in first. Oz asks for an assistant, and looks at you.'),
            O('Sit there, if you please. I’m afraid I shall have to take your head off. Only for a minute. Brains go in at the top.'),
            SC('Take it off by all means. I hardly use it.', 'happy'),
            N('Oz unpins the Scarecrow’s head and takes out the straw. Then he fetches a sack of bran from the back room.'),
            O('Now. A measure of bran. Then pins and needles, for sharpness. Hand me those, will you? Points away from you.'),
            N('You hand him pins and needles a pinch at a time. He stirs them into the bran with a wooden spoon.'),
          ],
          choices: [
            {
              id: 'more',
              label: 'Suggest a few more pins, to be safe.',
              then: [O('More pins. Yes. He’ll be very sharp. Sharp is good in a Scarecrow; it keeps the crows thoughtful.')],
            },
            {
              id: 'spoon',
              label: 'Ask what the spoon is for.',
              then: [O('For stirring. And for looking busy. Most of magic is looking busy, my dear.', 'think')],
            },
            {
              id: 'taste',
              label: 'Watch your Nubbin, who is eating the bran.',
              then: [N('Your Nubbin eats a mouthful of bran, makes a face, and doesn’t try any more brains.')],
            },
          ],
        },
        done: {
          id: 'a15-15-brains-done',
          lines: [
            N('Oz fills the Scarecrow’s head with the mixture and packs straw round it to hold it in. Then he pins the head back on.'),
            O('There. Bran-new brains. You will be a very great thinker now.', 'happy'),
            SC('I feel wise. Very wise. There is a bump on my head, and that is the brains.', 'happy'),
          ],
        },
      },
      {
        id: 'a15-15-s2',
        goal: 'Help Oz make the Woodman’s heart.',
        hint: 'Hold the silk heart steady while Oz stuffs it with sawdust.',
        check: 'craft:a15-heart:silk',
        scene: {
          id: 'a15-15-heart',
          lines: [
            N('Next comes the Woodman. Oz takes a pair of tinsmith’s shears and cuts a small square hole in the left side of his chest.'),
            TW('Will it hurt?', 'think'),
            O('Not at all. You won’t feel a thing. That’s rather the trouble you came about, isn’t it?'),
            N('From a chest of drawers Oz takes a pretty heart, made all of silk. You hold it steady while he stuffs it with sawdust.'),
            TW('It is very beautiful. But will it be kind?', 'think'),
            O('The kindest I have in stock.'),
            N('He puts it in the Woodman’s chest, puts back the square of tin, and solders it, very neatly.'),
          ],
          choices: [
            {
              id: 'listen',
              label: 'Put your ear to the Woodman’s chest.',
              then: [N('You listen. There is a soft rustle in there, like someone turning over in bed, and the Woodman holds very still.')],
            },
            {
              id: 'polish',
              label: 'Polish the patch where the hole was.',
              then: [TW('Thank you. I should like it to show. A heart ought to show a little, I think.', 'soft')],
            },
          ],
        },
        done: {
          id: 'a15-15-heart-done',
          lines: [
            TW('I feel it. I am sure I feel it. Thank you, thank you.', 'happy'),
            O('Don’t mention it. Please. Really, don’t.', 'think'),
          ],
        },
      },
      {
        id: 'a15-15-s3',
        goal: 'Pour out the Lion’s courage.',
        hint: 'Hold the green dish while Oz pours from the square green bottle, then pass it to the Lion.',
        check: 'give:a15-lion:courage',
        scene: {
          id: 'a15-15-courage',
          lines: [
            N('Last comes the Lion. Oz takes down a square green bottle from a high shelf, and you hold the dish while he pours.'),
            N('It is green, and it fizzes a little. It smells of nothing at all.'),
            L('What is it?', 'think'),
            O('Courage. Or it will be, once it’s inside you. That’s where courage lives. Out here in the dish, it’s only green.'),
            L('I’ve been afraid all the way here. Of the Kalidahs, the river, the Witch. Of everything.', 'sad'),
            O('Of course you have. Every creature facing danger is afraid. Brave is going on anyway, and you’ve done that the whole way.', 'soft'),
            O('But drink it anyway. It’s a very nice green.'),
          ],
          choices: [
            {
              id: 'hand',
              label: 'Hand the Lion the dish.',
              then: [N('You hold the dish out. The Lion looks at it, and at you, and drinks it to the bottom.')],
            },
            {
              id: 'carry',
              label: 'Let your Nubbin carry it over.',
              then: [N('Your Nubbin carries the dish over in its mouth, very carefully, spilling only a little. The Lion drinks the rest.')],
            },
          ],
        },
        done: {
          id: 'a15-15-courage-done',
          lines: [L('Oh! I feel… I feel very full of something. Courage, I expect.', 'happy')],
        },
      },
    ],
    complete: {
      id: 'a15-15-complete',
      lines: [
        N('Your friends go out into the green hall: the Scarecrow thinking hard, the Woodman listening to his chest, the Lion walking very tall.'),
        N('Everyone feels better. You can see it from here.'),
        O('What else could I do? They ask me for things nobody in the world can give.', 'sad'),
        O('So I give them something else, and tell them it’s the thing. And it works, mostly. Bran, and sawdust, and green water.'),
        N('You watch them through the doorway, happy, all three, with what they had all along.'),
        N('You wonder whether it matters that it is bran, and you aren’t sure.'),
        N('Your Nubbin leans on your leg. It isn’t sure either.'),
        O('Dorothy will be harder. You can’t fill a girl’s head with bran and tell her she’s in Kansas.', 'sad'),
      ],
    },
    rewards: [],
    sets: { 'a15-15': true },
    notes:
      'LIFTED TEXT: none. Passage 5 (the Wizard on courage) is told in our own words at a15-15-courage#5. "Bran-new" is ' +
      'Baum’s one-word pun, used as a word only. THEME: the quest is the page’s quiet turn, comfort that only looks like ' +
      'the real thing, and the player is left wondering; nobody answers it. Play the complete without music. The green ' +
      'drink is plainly a drink; it is never called medicine.',
  },

  // ---------------------------------------------------------------- A15-16
  {
    id: 'a15-16',
    code: 'A15-16',
    title: 'The Balloon',
    source: 'The Wonderful Wizard of Oz (1900), ch. XVII–XVIII: how the balloon was launched, and away to the South',
    audience: 'all',
    trigger: { where: WHERE, when: after('A15-15') },
    requires: ['A15-15'],
    speakers: [DOROTHY, SCARECROW, WOODMAN, LION, OZ, SOLDIER, MONKEY, GUARDIAN],
    steps: [
      {
        id: 'a15-16-s1',
        goal: 'Help sew the great green balloon.',
        hint: 'Hold the silk strips straight while Dorothy sews the seams.',
        check: 'craft:a15-balloon:silk',
        scene: {
          id: 'a15-16-sew',
          lines: [
            N('On the third day Oz sends for Dorothy. He has thought of a way, he says: he came here in a balloon, and he will leave in one.'),
            O('And I’ll come too. I’ve had enough of humbugging. A circus would suit me better; at least everyone knows the clown is a clown.', 'happy'),
            D('Oh! Shall we really go home?'),
            O('We shall make a balloon of silk and fill it with hot air. Hot air I have plenty of. It’s the silk we need.'),
            N('So for three days you sit with Dorothy and sew strips of green silk together, while Oz cuts them out.'),
            N('You hold the strips straight while Dorothy sews.'),
            N('Your Nubbin sits in the pile of offcuts like an egg in a green nest.'),
            O('Then a coat of glue inside, to keep the air in. And a big clothes-basket to sit in.'),
          ],
          choices: [
            {
              id: 'stitch',
              label: 'Ask Dorothy to show you her stitch.',
              then: [D('Aunt Em taught me. Small and even, she says. Small and even, and don’t pull.', 'soft')],
            },
            {
              id: 'basket',
              label: 'Test the clothes-basket with your Nubbin.',
              then: [N('Your Nubbin climbs in, turns round three times, and goes to sleep. The basket seems to work.')],
            },
            {
              id: 'steer',
              label: 'Ask Oz if he has ever steered one.',
              then: [O('Steered? My dear, nobody steers a balloon. You go where the wind likes. That is how I got here.', 'think')],
            },
          ],
        },
        done: {
          id: 'a15-16-sew-done',
          lines: [N('At last the balloon is finished: more than twenty feet long, green as everything else, and shining with glue.')],
        },
      },
      {
        id: 'a15-16-s2',
        goal: 'See the balloon off from the Palace yard.',
        hint: 'Stand by the ropes in front of the Palace, and keep an eye on Toto.',
        check: 'watch:a15-balloon:launch',
        scene: {
          id: 'a15-16-launch',
          lines: [
            N('Word goes round the City that the Great Oz is going up into the clouds. Everybody comes to see.'),
            N('The Woodman has built a fire. Oz holds the bottom of the balloon over it, and the hot air fills it out.'),
            O('Good people! I am off to call on a brother Wizard in the clouds. The Scarecrow will rule while I’m gone. Be good to him.', 'happy'),
            SC('Me? Oh. Well. I do have the brains for it now.', 'happy'),
            N('The balloon swells and tugs against its ropes. Oz climbs into the basket.'),
            O('Dorothy! Quickly! It won’t wait!', 'shock'),
            D('I can’t find Toto anywhere!', 'shock'),
            N('Toto has run into the crowd, barking at a kitten. Dorothy runs after him, catches him, and runs back.'),
            N('Oz is holding out his hands to help her in. Then, crack: the ropes give way, and the balloon rises without her.'),
          ],
          choices: [
            {
              id: 'rope',
              label: 'Run after the trailing rope.',
              then: [N('You run after the trailing rope, and jump, and miss it by a long way. It goes up past the roofs.')],
            },
            {
              id: 'catch',
              label: 'Catch Dorothy before she falls.',
              then: [N('Dorothy stumbles, and you catch her. Toto is still in her arms, looking very pleased with himself.')],
            },
          ],
        },
        done: {
          id: 'a15-16-launch-done',
          lines: [...A16_GONE, N('Then smaller. Then it is gone.')],
        },
      },
      {
        id: 'a15-16-s3',
        goal: 'Ask about the way south, now the balloon has gone.',
        hint: 'Go with Dorothy to the Palace, where the Scarecrow now sits, and listen to the Soldier.',
        check: 'talk:a15-soldier:south',
        scene: {
          id: 'a15-16-south',
          lines: [
            N('Dorothy cries for a long time. Then she wipes her eyes and puts on the Golden Cap.'),
            D('The Monkeys could carry me over the desert. I’ll use the second call.'),
            N('She says the words, on her left foot and her right. The Monkeys come down into the Palace garden.'),
            D('Please. Fly me to Kansas.'),
            MO('We can’t. Our wings stop where Oz stops. The desert is the end of us as much as it is of you.', 'sad'),
            MO('I’m sorry. That is a call gone for nothing. I wish it weren’t so.', 'sad'),
            N('They fly away. Dorothy sits down on the steps, and Toto licks her face.'),
            SC('Let us ask the Soldier with the green whiskers. He has been here all along, and may know something.'),
            GW('You might try Glinda. She is the Good Witch of the South, and stronger than any of the others. The Quadlings are her people.'),
            GW('She lives right at the edge of the desert. If anyone knows the way over, she will.'),
            D('Then I’ll go to Glinda.'),
          ],
          choices: [
            {
              id: 'come',
              label: 'Say you’ll go with her.',
              then: [D('Will you? Oh, thank you. I don’t think I could start again on my own.', 'soft')],
            },
            {
              id: 'look',
              label: 'Look round at the others.',
              then: [N('Nobody needs to be asked. The Lion is already standing up.')],
            },
          ],
        },
        done: {
          id: 'a15-16-south-done',
          lines: [
            L('I’ll come, of course. And when she’s home, I shall go and find a forest and live there.'),
            SC('I shall come as far as Glinda’s. Then I shall come back and rule. With my brains.', 'happy'),
            TW('And I. My heart wouldn’t let me stay behind.', 'soft'),
          ],
        },
      },
    ],
    complete: {
      id: 'a15-16-complete',
      lines: [...A16_SPECS, ...A16_PLAIN],
    },
    rewards: [
      {
        id: 'a15-green-spectacles',
        kind: 'cosmetic',
        label: 'Green Spectacles',
        description: 'The Guardian’s green spectacles, with the lock taken off. Wear them and the whole screen goes green; take them off whenever you like.',
      },
    ],
    sets: { 'a15-16': true },
    notes:
      'CORVIN READ (Grove flag `corvin`, read-only, when a15-16-launch-done plays). The scene shown is the DEFAULT: the ' +
      'balloon simply gets smaller. For `corvin` = reconciled only, play ATLAS_A15_VARIANTS a15-16-launch-done-reconciled ' +
      'instead: your Nubbin watches it go and looks back at you, and you think that some of them come back. Bargained, ' +
      'forced, unset and the Collector route all get the default. LIFTED TEXT: none; the Wizard’s parting words and the ' +
      'Monkey King’s refusal are our own. REWARD: Green Spectacles (cosmetic, one-time, at the complete scene); the ' +
      'screen tint can be toggled off at any time. The kitten is a plain kitten and is fine.',
  },

  // ---------------------------------------------------------------- A15-17
  {
    id: 'a15-17',
    code: 'A15-17',
    title: 'The Fighting Trees and the China Country',
    source: 'The Wonderful Wizard of Oz (1900), ch. XIX–XX: the fighting trees, and the dainty china country',
    audience: 'all',
    trigger: { where: WHERE, when: after('A15-16') },
    requires: ['A15-16'],
    speakers: [DOROTHY, SCARECROW, WOODMAN, LION, MILKMAID, PRINCESS],
    steps: [
      {
        id: 'a15-17-s1',
        goal: 'Get through the forest of fighting trees.',
        hint: 'Keep behind the Woodman; when a branch grabs, let him chop.',
        check: 'walk:a15-forest:fighting-trees',
        scene: {
          id: 'a15-17-trees',
          lines: [
            N('South of the City the land is rough. On the second day you come to a thick wood, with no way round it.'),
            N('The Scarecrow goes in first. As he comes under the first tree, its branches bend down and twine round him.'),
            N('In a moment he is lifted off the ground and flung, head over heels, back among the rest of you.'),
            SC('Well! That was very rude. I shall try another tree.', 'shock'),
            N('He tries another tree, and is flung back again.'),
            TW('Let me go first.'),
            N('When a big branch bends down to seize him, the Woodman chops it through. The whole tree shakes its branches, crossly, and lets him by.'),
            L('Only the first row fights, I think. They are guarding the wood.'),
          ],
          choices: [
            {
              id: 'behind',
              label: 'Keep right behind the Woodman.',
              then: [N('You keep so close behind the Woodman that a branch reaching for you finds his axe instead, and thinks better of it.')],
            },
            {
              id: 'coat',
              label: 'Tuck your Nubbin inside your coat.',
              then: [N('You button your Nubbin into your coat. A branch pats you all over, finds nothing to grab, and gives up.')],
            },
          ],
        },
        done: {
          id: 'a15-17-trees-done',
          lines: [N('Behind the first row, the trees are only trees. Everyone gets through, the Scarecrow last, very ruffled.')],
        },
      },
      {
        id: 'a15-17-s2',
        goal: 'Climb the white wall, and help the cross milkmaid.',
        hint: 'Climb the ladder the Woodman makes, and go down very carefully on the other side.',
        check: 'climb:a15-wall:china',
        scene: {
          id: 'a15-17-wall',
          lines: [
            N('On the far side of the wood is a high wall, smooth and white, like the side of a dinner plate.'),
            N('The Woodman makes a ladder. The Scarecrow climbs it first, looks over, and says nothing at all for a moment, which isn’t like him.'),
            N('On the other side the ground is white and smooth and shining, like the bottom of a great platter.'),
            N('There are little houses, all made of china and brightly painted. The people are china too, and the tallest comes up to your knee.'),
            N('Nearest the wall, a china milkmaid is milking a china cow. As you jump down, the cow gives a kick.'),
            N('Over goes the stool, and over goes the pail, and over goes the milkmaid herself, with a clatter.'),
            N('The cow’s leg has snapped clean off. The pail is chipped, and the milkmaid has a nick in her elbow.'),
            MM('Look what you’ve done! Her leg’s off! Now it’s the mender’s for her, and glue, and a week of standing still!', 'angry'),
            D('I’m very sorry. Please forgive us.', 'sad'),
          ],
          choices: [
            {
              id: 'leg',
              label: 'Pick up the cow’s leg and hand it back.',
              then: [MM('Well. Thank you. You might have broken it worse, I suppose, being so enormous.', 'think')],
            },
            {
              id: 'small',
              label: 'Say sorry too, as small as you can.',
              then: [N('You crouch down very small and say you’re sorry. The milkmaid sniffs, and is a little less cross.')],
            },
          ],
        },
        done: {
          id: 'a15-17-wall-done',
          lines: [
            N('The milkmaid leads the cow away limping on three legs, carrying the fourth, and looks back over her shoulder at you all.'),
            D('We’ll have to walk very carefully. Everything here breaks.', 'think'),
          ],
        },
      },
      {
        id: 'a15-17-s3',
        goal: 'Meet the china Princess, and decide about the lamb.',
        hint: 'Stand still and speak softly; then choose, with your Nubbin at the fence.',
        check: 'choose:a15-lamb:field',
        scene: {
          id: 'a15-17-lamb',
          lines: [
            N('A little further on you meet a beautiful china Princess in a dress of many colours. She stops, and then she runs.'),
            D('Wait! Please! We won’t hurt you!'),
            PR('Oh! Please don’t run at me! If I fall I might break, and it is not at all nice, being mended.', 'shock'),
            D('You’re so lovely. Would you come home with me? Aunt Em hasn’t a single pretty thing in the house.'),
            PR('Oh, no. Here we walk about, and talk, and visit, and do as we like.'),
            PR('Out there our joints would set hard. We’d stand on a shelf being admired, and never walk again. Pretty is all we’d be.', 'sad'),
            D('Then I won’t ask again. I’d hate you to be unhappy.', 'soft'),
            N('Beside the path is a little field with a china fence round it. China lambs, no bigger than a thimble, are grazing on china grass.'),
            N('One of them comes to the fence. Your Nubbin goes to the fence too, and they touch noses, very gently.'),
            N('Your Nubbin looks up at you, and then at your pocket, which is just the right size, and then at the lamb.'),
            N('It has never wanted anything this much. You can tell.'),
          ],
          choices: [
            {
              id: 'pocket',
              label: 'Slip the lamb into your pocket, to keep it safe.',
              set: { 'a15-lamb': 'pocketed' },
              then: [
                N('You lift the lamb over the fence. It is warm and light, and its legs kick a little.'),
                N('You slip it into your pocket, to keep it safe. Your Nubbin keeps one paw on the outside of the pocket all the way.'),
              ],
            },
            {
              id: 'field',
              label: 'Put it back in its field.',
              set: { 'a15-lamb': 'returned' },
              then: [
                N('You lift your Nubbin gently away from the fence. The lamb bleats once, very small, like a spoon on a cup.'),
                N('Your Nubbin looks back three times. Then it stops looking back, and walks closer to you.'),
              ],
            },
          ],
        },
      },
    ],
    complete: {
      id: 'a15-17-complete',
      lines: [
        N('Crossing the china country, the Lion’s tail swings round by accident and knocks over a little china church.'),
        L('Oh dear. Oh dear, oh dear. I’ll go the long way round. On tiptoe.', 'shock'),
        N('China people come running with glue pots. They seem quite used to it.'),
        N('At the far side is another wall, not so high. You climb it, drop into tall grass, and the china country is behind you.'),
        D('I’m glad we saw it. I’m glad we didn’t take anything away.', 'soft'),
      ],
    },
    rewards: [],
    sets: { 'a15-17': true },
    notes:
      'SECOND CHOICE (a15-17-lamb): a15-lamb = pocketed | returned. It pays off in A15-20, three quests later: the ' +
      'farewell scene (pocketed plays ATLAS_A15_VARIANTS a15-20-farewell-pocketed, where you find the lamb stiff and ' +
      'Glinda tells you to carry it home) and the four endings. "To keep it safe" is deliberate and is never explained. ' +
      'If pocketed, draw a small lump in your coat pocket on this page only (A15-17 to A15-20), and have your Nubbin ' +
      'check the pocket now and then in idle animations. Dorothy’s last line in the complete is the same in both ' +
      'routes; let it land on its own. LIFTED TEXT: none; passage 6 (the Princess’s joints) is told in our own words ' +
      'at a15-17-lamb#5. The milkmaid’s cow loses a leg to be glued back on: china, not flesh; play it as comedy.',
  },

  // ---------------------------------------------------------------- A15-18
  {
    id: 'a15-18',
    code: 'A15-18',
    title: 'The King of Beasts',
    source: 'The Wonderful Wizard of Oz (1900), ch. XXI: the Lion becomes the King of Beasts',
    audience: 'all',
    trigger: { where: WHERE, when: after('A15-17') },
    requires: ['A15-17'],
    speakers: [DOROTHY, SCARECROW, WOODMAN, LION, TIGER],
    steps: [
      {
        id: 'a15-18-s1',
        goal: 'Go with the Lion into the great old forest.',
        hint: 'Walk among the old trees until you find the gathering of animals.',
        check: 'visit:a15-forest:council',
        scene: {
          id: 'a15-18-council',
          lines: [
            N('Past the tall grass is a forest of great old trees, the biggest you have ever seen. It is dark and quiet, and the ground is soft with leaves.'),
            L('What a forest. I could live in a forest like this for ever.', 'soft'),
            N('In a big clearing there are hundreds of animals: tigers and elephants, bears and foxes, all talking at once.'),
            N('When they see the Lion, they all go quiet. A great tiger comes up and bows.'),
            TG('King of Beasts! You’ve come. You’ve come at last. We need you badly.', 'happy'),
            L('What has happened here?', 'think'),
            TG('A monster. A spider bigger than an elephant, with legs like tree trunks, eight of them.'),
            TG('It creeps through the forest and catches us, one by one. None of us is safe. We were talking about what to do.', 'sad'),
            TG('We have held nine meetings about the spider. We agreed a seating plan. We have not agreed on the spider.', 'think'),
            L('I’ll go.'),
            N('Nobody objects. That is how you know a meeting is over.'),
            N('Your Nubbin is pressed against the back of your legs again, the way it was on the road the day you met the Lion.'),
          ],
          choices: [
            {
              id: 'lion',
              label: 'Look at the Lion.',
              then: [N('The Lion is very still, with his mane up. You can’t tell whether that is courage or the other thing.')],
            },
            {
              id: 'pick',
              label: 'Pick up your Nubbin.',
              then: [N('You pick up your Nubbin. Its heart is going fast, and so is yours.')],
            },
          ],
        },
        done: {
          id: 'a15-18-council-done',
          lines: [
            L('If I deal with this spider, will you have me for your King?', 'think'),
            TG('Gladly. All of us.'),
            L('Then wait here.'),
          ],
        },
      },
      {
        id: 'a15-18-s2',
        goal: 'Wait at the edge of the clearing while the Lion goes alone.',
        hint: 'Stay with Dorothy at the clearing’s edge, and keep your Nubbin with you.',
        check: 'wait:a15-lion:forest-edge',
        scene: {
          id: 'a15-18-wait',
          lines: [
            L('Look after my friends for me. I’m going now, before I think about it.', 'think'),
            N('He goes off into the trees alone. Nobody follows him, because he asked them not to.'),
            N('Your Nubbin starts after him. It stops at the edge of the trees, comes back to you, and sits down.'),
            D('He was so frightened of the Kalidahs. He was nearly frightened of a mouse.', 'sad'),
            SC('He drank his courage. I saw it. It was green.', 'think'),
            TW('I don’t think it was ever in the dish. I think it was in him all along. My heart tells me so.', 'soft'),
            N('You wait. The forest is very quiet: the kind of quiet that is listening.'),
            N('Nobody talks. Even the Scarecrow doesn’t think out loud.'),
          ],
          choices: [
            {
              id: 'sit',
              label: 'Sit down and wait, with your Nubbin in your lap.',
              then: [N('You sit, and your Nubbin climbs into your lap. You wait the way you would wait for anyone.')],
            },
            {
              id: 'stand',
              label: 'Stand at the edge and watch the trees.',
              then: [N('You stand and watch the dark between the trees. Once, far off, there is a sound, and then nothing.')],
            },
          ],
        },
        done: {
          id: 'a15-18-wait-done',
          lines: [
            N('At last, in the grey of the morning, the Lion comes back through the trees. He walks slowly, and very straight.'),
            L('It’s done. It won’t catch anyone any more. You can stop being afraid.'),
            N('He doesn’t say how, and nobody asks him.'),
          ],
        },
      },
    ],
    complete: {
      id: 'a15-18-complete',
      lines: [
        N('All the animals bow down to the Lion as their King.'),
        L('I’ll be back to look after you, once Dorothy is safe on her way home. Not before.'),
        TG('We will wait, Your Majesty.'),
        N('The Lion comes back to you. He lies down and puts his great head on the ground, so that your Nubbin can reach his nose.'),
        L('I was afraid the whole time. The whole time. My knees knocked.', 'soft'),
        Y('I know. You went anyway.'),
        L('Yes. I did, didn’t I?', 'soft'),
        N('Your Nubbin pats his nose, very gently, the way it did on the road where you met.'),
      ],
    },
    rewards: [],
    sets: { 'a15-18': true },
    notes:
      'SOFTENING (care notes): Baum’s Lion knocks the sleeping spider’s head off. Here the Lion goes alone into the ' +
      'trees, the camera stays with the friends, and there is "a sound, and then nothing". The spider is described once ' +
      'by the Tiger and never shown. The Lion says only that it won’t catch anyone any more. THEME: this is the payoff ' +
      'of A15-5 (your Nubbin sat by him first) and A15-15 (the green dish); the Woodman says the thing outright, once.',
  },

  // ---------------------------------------------------------------- A15-19
  {
    id: 'a15-19',
    code: 'A15-19',
    title: 'The Hammer-Heads',
    source: 'The Wonderful Wizard of Oz (1900), ch. XXII: the country of the Quadlings',
    audience: 'all',
    trigger: { where: WHERE, when: after('A15-18') },
    requires: ['A15-18'],
    speakers: [DOROTHY, SCARECROW, WOODMAN, LION, HAMMERHEAD, MONKEY],
    steps: [
      {
        id: 'a15-19-s1',
        goal: 'Climb the rocky hill towards the south.',
        hint: 'Follow the Scarecrow up the rocks, and stop when a voice tells you to.',
        check: 'climb:a15-hill:rocky',
        scene: {
          id: 'a15-19-hill',
          lines: [
            N('Past the forest a steep hill rises, covered from top to bottom with great pieces of rock.'),
            SC('Rocks. A great many rocks. Well, up we go.'),
            N('He leads the way. You are halfway up the first rocks when a rough voice calls out.'),
            HH('Stop there! Our hill! Nobody goes over our hill!', 'angry'),
            N('From behind a rock comes a very odd man: short and stout, with a big head, flat on top, on a thick, wrinkled neck.'),
            N('He has no arms at all. The Scarecrow, seeing that, is not a bit afraid of him.'),
            SC('Terribly sorry, but we have to get over. We’re on our way south, to the Quadlings.'),
            N('Quick as lightning, the man’s head shoots forward on its stretching neck, and the flat top of it hits the Scarecrow in the middle.'),
            N('The Scarecrow goes tumbling, head over heels, all the way down the hill.'),
            N('From behind every rock, a hundred more Hammer-Heads pop up, laughing a hard, rough laugh.'),
          ],
          choices: [
            {
              id: 'pick',
              label: 'Run down and pick up the Scarecrow.',
              then: [
                N('You find him at the bottom, upside down in a bush.'),
                SC('I have brains now, and I can tell you I did not see that coming.', 'shock'),
              ],
            },
            {
              id: 'duck',
              label: 'Duck behind a rock with your Nubbin.',
              then: [N('You duck behind a rock. A head on a long neck comes round the side, looks at your Nubbin, and goes back again.')],
            },
          ],
        },
        done: {
          id: 'a15-19-hill-done',
          lines: [
            N('The Lion, very brave now, roars and dashes up the hill. A head shoots out, and down he rolls too, like a big cannon-ball.'),
            L('Ow. Ow. Courage is all very well, but it doesn’t help your nose.', 'sad'),
          ],
        },
      },
      {
        id: 'a15-19-s2',
        goal: 'Read the charm with Dorothy for her third and last call.',
        hint: 'Stand by Dorothy and read the words inside the Cap with her.',
        check: 'watch:a15-monkeys:third-call',
        scene: {
          id: 'a15-19-call',
          lines: [
            D('It’s no good fighting people who shoot their heads out. What shall we do?'),
            TW('Call the Winged Monkeys. You have one call left.', 'think'),
            D('It’s the last one. After this, the Cap won’t do anything for me ever again.', 'sad'),
            SC('Then use it on something worth it. This seems worth it. My middle hurts.'),
            N('Dorothy puts on the Golden Cap and says the words. You read them out with her, very clearly, since it is the last time.'),
            N('The Monkeys come down as fast as ever, the whole band, and line up in front of her.'),
            MO('Third call. The last. What is it to be?', 'think'),
            D('Carry us over the hill to the country of the Quadlings.'),
            MO('Up you come, then.'),
          ],
          choices: [
            {
              id: 'thank',
              label: 'Thank the Monkey King.',
              then: [MO('Thank us? Hm. Nobody does that. The Cap doesn’t say anything about thanks.', 'think')],
            },
            {
              id: 'watch',
              label: 'Watch the Monkey King as he lifts you.',
              then: [N('He lifts you as gently as before. His wings beat hard and slow, and he looks, you think, very tired.')],
            },
          ],
        },
        done: {
          id: 'a15-19-call-done',
          lines: [
            N('The Monkeys carry you all over the hill. The Hammer-Heads shoot their heads high in the air, and can’t reach.'),
            N('Your Nubbin looks down at them, and they look up at your Nubbin, and that is the end of the Hammer-Heads.'),
          ],
        },
      },
    ],
    complete: {
      id: 'a15-19-complete',
      lines: A19_QUADLINGS,
    },
    rewards: [],
    sets: { 'a15-19': true },
    notes:
      'The Hammer-Heads (care notes) are a fairy-tale people: armless, flat-headed, and funny. Draw them as cheerful ' +
      'rock-dwellers with springy necks, nothing that reads as a real disability or a real people; nobody is hurt but ' +
      'the Scarecrow’s dignity and the Lion’s nose. This is Dorothy’s third and last call; the Cap is now spent for her. ' +
      'The King’s tiredness sets up A15-20.',
  },

  // ---------------------------------------------------------------- A15-20
  {
    id: 'a15-20',
    code: 'A15-20',
    title: 'Glinda',
    source: 'The Wonderful Wizard of Oz (1900), ch. XXIII–XXIV: Glinda grants Dorothy’s wish, and home again',
    audience: 'all',
    trigger: { where: WHERE, when: after('A15-19') },
    requires: ['A15-19'],
    speakers: [DOROTHY, SCARECROW, WOODMAN, LION, MONKEY, GLINDA],
    steps: [
      {
        id: 'a15-20-s1',
        goal: 'Go before Glinda, the Good Witch of the South.',
        hint: 'Walk up to Glinda’s throne with Dorothy and the others, and listen.',
        check: 'visit:a15-glinda:castle',
        scene: {
          id: 'a15-20-glinda',
          lines: [
            N('At the castle gate stand three girls in handsome red uniforms. They lead you all into a great room.'),
            N('Glinda sits on a red throne. She is beautiful and young-looking, with rich red hair, and her eyes are blue and kind.'),
            GL('Well, my dear. What is it you need?', 'soft'),
            D('I want to go home to Kansas. Aunt Em will be sure I’m lost for good by now.', 'sad'),
            GL('There is a way, my dear, and I’ll tell you. But I shall want the Golden Cap in return.', 'soft'),
            D('Gladly. It’s no use to me now. I’ve used all three calls.'),
            GL('The silver shoes will carry you over the desert. You could have gone home the day you came, if you had only known what they do.'),
            D('The very first day?', 'shock'),
            SC('But then I’d never have got my brains! I’d have spent my whole life up a pole in a cornfield.', 'shock'),
            TW('And I would still be standing in that clearing with my axe in the air.'),
            L('And I’d still be roaring at little dogs, and crying about it afterwards.'),
            N('Dorothy looks down at the silver shoes for a long time. They have been on her feet the whole way.'),
          ],
          choices: [
            {
              id: 'shoes',
              label: 'Look at the shoes.',
              then: [N('They are dusty from the road and scuffed at the toes. They don’t look like much.')],
            },
            {
              id: 'mind',
              label: 'Ask Dorothy if she minds.',
              then: [D('No. I’m glad I didn’t know. I’d have gone straight home, and none of them would have anything.', 'soft')],
            },
          ],
        },
        done: {
          id: 'a15-20-glinda-done',
          lines: [GL('Knock the heels together three times and tell them where you want to go. They will take you there in three steps.')],
        },
      },
      {
        id: 'a15-20-s2',
        goal: 'Hear how Glinda will spend the Cap’s calls, and say your goodbyes.',
        hint: 'Stand with your friends while Glinda tells each of them where he will go.',
        check: 'talk:a15-friends:goodbye',
        scene: {
          id: 'a15-20-goodbye',
          lines: [...A20_LAWS, ...A20_REST],
          choices: A20_GOODBYE_CHOICES,
        },
        done: {
          id: 'a15-20-goodbye-done',
          lines: [
            N('Glinda’s girls bring you a present: a pair of silver shoes, just your size, shining.'),
            N('You put them on, and knock your heels together three times.'),
            N('Nothing happens at all.'),
            GL('They’re only shoes, dear. Most shoes are.', 'happy'),
          ],
        },
      },
      {
        id: 'a15-20-s3',
        goal: 'Say goodbye to Dorothy.',
        hint: 'Stay by Dorothy and Toto until she is ready to go.',
        check: 'talk:a15-dorothy:farewell',
        scene: {
          id: 'a15-20-farewell',
          lines: [
            N('Dorothy turns to you last. Toto is in her arms, and your Nubbin is sitting on your feet.'),
            N('She looks at you as if she is fixing you in her memory, the way you fix a house you are leaving.'),
            N('Glinda’s girls have gone quiet. Even Toto keeps still.'),
            ...A20_FAREWELL,
          ],
          choices: A20_FAREWELL_CHOICES,
        },
      },
    ],
    complete: {
      id: 'a15-20-complete',
      lines: [
        ...A20_KANSAS,
        N('Then the Monkeys come for your friends: the Scarecrow north, the Woodman west, the Lion over the hill to his forest.'),
        N('Glinda gives the Golden Cap to the King of the Monkeys. He bows, and the band flies off without a word.'),
        N('The page carries you home the way you came. Its last picture is the china wall, and a lamb by it, waiting to see you off.', 'soft'),
        ...A20_CLOSE,
      ],
    },
    rewards: [
      {
        id: 'a15-silver-shoes',
        kind: 'cosmetic',
        label: 'Silver Shoes',
        description: 'A pair of silver shoes from Glinda’s castle, for your Keeper. They don’t do anything. Most shoes don’t.',
      },
      {
        id: 'a15-monkey-feather',
        kind: 'cosmetic',
        label: 'Monkey Feather',
        description: 'A long dark feather from the Winged Monkeys, the first thing they gave away free. Only if you asked the Monkey King what they would do if they were free (a15-cap = asked).',
      },
      {
        id: 'a15-bookmark-price-of-power',
        kind: 'item',
        label: 'The Price of Power Bookmark',
        description: 'A thin silver ribbon that marks the Humbug page. Two bookmarks from the Price of Power pages open that festival in the Grove.',
      },
    ],
    sets: { 'a15-20': true, 'a15-done': true },
    notes:
      'ENDINGS (two flags, four versions of the complete scene; all start with A20_KANSAS and end with A20_CLOSE):\n' +
      '  - a15-cap = silent, a15-lamb = returned: the scene shown here, a15-20-complete.\n' +
      '  - a15-cap = asked, a15-lamb = returned: ATLAS_A15_VARIANTS a15-20-complete-asked (the King says "Play."; the ' +
      'feather; the lamb waits by the wall).\n' +
      '  - a15-cap = asked, a15-lamb = pocketed: a15-20-complete-asked-pocketed (the feather; the free band flies you to ' +
      'the china wall as their first free favour; the lamb wakes and runs).\n' +
      '  - a15-cap = silent, a15-lamb = pocketed: a15-20-complete-pocketed (the Lion walks you to the wall, since his ' +
      'forest lies that way; the lamb wakes and runs).\n' +
      'FAREWELL (step 3): for a15-lamb = pocketed, play a15-20-farewell-pocketed in place of a15-20-farewell: you take ' +
      'the lamb out to show Glinda and find it stiff, and Glinda tells you what the Princess told you. This is the coda ' +
      'before Dorothy’s heels click. SILVER SHOES: the joke is made once, at a15-20-goodbye-done; the cosmetic does ' +
      'nothing anywhere, ever. REWARDS (one-time): Silver Shoes at a15-20-goodbye-done; Monkey Feather at the complete, ' +
      'asked routes only; the Price of Power Bookmark at the complete (the silver ribbon in A20_CLOSE). The real Golden ' +
      'Cap goes to the Monkey King in every route. LIFTED TEXT: none; passage 7 is told in our own words ' +
      '(a15-20-glinda#6 and #8). Dorothy’s words to the shoes are our own (not Baum’s, not the film’s). Kansas is shown ' +
      'for one line only, through the page: no dream framing, no bedroom, no "there’s no place like home" chant.',
  },
];

// =================================================================== variants

/** Variant scenes chosen by flags. Each names the scene it replaces in its quest’s notes. */
export const ATLAS_A15_VARIANTS: Scene[] = [
  // ---------------------------------------------------------------- A15-14, step 2 done (corvin)
  {
    id: 'a15-14-screen-done-reconciled',
    lines: [...A14_POOR_WIZARD, N('You knew a man like this.'), N('He gave the trick back. His hand was blue.', 'soft')],
  },
  {
    id: 'a15-14-screen-done-bargained',
    lines: [...A14_POOR_WIZARD, N('You knew a man like this.'), N('He sold the trick, along with everything else.')],
  },
  {
    id: 'a15-14-screen-done-forced',
    lines: [...A14_POOR_WIZARD, N('You knew a man like this.'), N('He only let go when he fell.', 'sad')],
  },
  // ---------------------------------------------------------------- A15-16, step 2 done (corvin = reconciled)
  {
    id: 'a15-16-launch-done-reconciled',
    lines: [
      ...A16_GONE,
      N('Your Nubbin watches it go. Then it turns and looks back at you, for a long moment.'),
      N('Some of them come back, you think.', 'soft'),
    ],
  },
  // ---------------------------------------------------------------- A15-16, complete (a15-secret)
  {
    id: 'a15-16-complete-promised',
    lines: [...A16_SPECS, N('He winks at you, the wink of a man who has been told a secret too.'), ...A16_PLAIN],
  },
  {
    id: 'a15-16-complete-theirs',
    lines: [
      ...A16_SPECS,
      G('The Scarecrow says everyone may know the City is only paint. Nobody minded as much as I feared.', 'happy'),
      ...A16_PLAIN,
    ],
  },
  // ---------------------------------------------------------------- A15-19, complete (a15-lamb = pocketed)
  {
    id: 'a15-19-complete-pocketed',
    lines: [
      ...A19_QUADLINGS,
      N('Your Nubbin pats the pocket. The lump has gone very still, and the Nubbin pats it again, slower.'),
    ],
  },
  // ---------------------------------------------------------------- A15-20, step 2 scene (a15-secret)
  {
    id: 'a15-20-goodbye-promised',
    lines: [...A20_LAWS, SC('Law one: nobody looks behind screens. It’s restful.', 'happy'), ...A20_REST],
    choices: A20_GOODBYE_CHOICES,
  },
  {
    id: 'a15-20-goodbye-theirs',
    lines: [
      ...A20_LAWS,
      SC('Law one: no more locked spectacles. Law two: the screen stays up, but anyone may look behind it.', 'happy'),
      ...A20_REST,
    ],
    choices: A20_GOODBYE_CHOICES,
  },
  // ---------------------------------------------------------------- A15-20, step 3 scene (a15-lamb = pocketed)
  {
    id: 'a15-20-farewell-pocketed',
    lines: [
      N('Before Dorothy goes, you take the china lamb out of your pocket to show Glinda.'),
      N('It is cold, and stiff, and its legs are set hard.'),
      N('It is only an ornament now: pretty, and still.', 'sad'),
      N('Your Nubbin touches it with its nose, and nothing happens, and it touches it again.'),
      GL('Ah. You meant to keep it safe. The ones who love them best so often do.', 'soft'),
      GL('You heard what the Princess told you. Carry it home, back over its own wall, and it will wake.'),
      L('My forest lies that way. If nobody else can take you, I’ll walk you there myself.'),
      ...A20_FAREWELL,
    ],
    choices: A20_FAREWELL_CHOICES,
  },
  // ---------------------------------------------------------------- A15-20, complete (three more endings)
  {
    id: 'a15-20-complete-asked',
    lines: [
      ...A20_KANSAS,
      N('Then the Monkeys carry your friends away, and Glinda puts the Golden Cap into the King’s hands. He holds it a long time, looking at you.'),
      MO('You asked me what we would do, if we were free. I have thought about it all this way.', 'think'),
      MO('Play.', 'happy'),
      N('The whole band loops over Glinda’s castle, round and round, shrieking. A feather comes down and lands on your Nubbin’s head.'),
      N('The page carries you home the way you came. Its last picture is the china wall, and a lamb by it, waiting to see you off.', 'soft'),
      ...A20_CLOSE,
    ],
  },
  {
    id: 'a15-20-complete-asked-pocketed',
    lines: [
      ...A20_KANSAS,
      N('Then the Monkeys carry your friends away, and Glinda puts the Golden Cap into the King’s hands. He looks at you over it.'),
      MO('You asked me what we’d do, if we were free. Play. But a favour first, our first free one, if you’ll let us.', 'happy'),
      N('They loop once over the castle, shrieking, and a feather drops on your Nubbin’s head. Then they lift you, and fly north to the china wall.'),
      ...A20_LAMB_WAKES,
      ...A20_CLOSE,
    ],
  },
  {
    id: 'a15-20-complete-pocketed',
    lines: [
      ...A20_KANSAS,
      N('The Monkeys come for the Scarecrow and the Woodman. The Lion lets them go without him.'),
      L('I’ll walk. My forest lies that way, and so does the china wall. A King can walk into his own forest.', 'soft'),
      N('Glinda gives the Golden Cap to the King of the Monkeys, and the band flies off without a word.'),
      N('The Lion walks you north, all the way to the china wall, with your Nubbin riding on his back.'),
      ...A20_LAMB_WAKES,
      ...A20_CLOSE,
    ],
  },
];

// =================================================================== flags and checks

/** Every flag this line sets (Atlas save only). It reads one Grove flag (`corvin`) and writes none. */
export const ATLAS_A15_FLAGS: string[] = [
  'a15-01',
  'a15-02',
  'a15-03',
  'a15-04',
  'a15-05',
  'a15-06',
  'a15-07',
  'a15-08',
  'a15-09',
  'a15-10',
  'a15-11',
  'a15-12',
  'a15-13',
  'a15-14',
  'a15-15',
  'a15-16',
  'a15-17',
  'a15-18',
  'a15-19',
  'a15-20',
  'a15-done', // A15-20: the whole page; read by atlasDone('A15') for the Price of Power festival
  'a15-cap', // asked | silent (a15-13-flight): the A15-20 ending
  'a15-lamb', // pocketed | returned (a15-17-lamb): the A15-20 farewell and ending; the A15-19 complete
  'a15-secret', // promised | theirs | quiet (a15-14-secret): the A15-16 complete and the A15-20 goodbye
];

export const ATLAS_A15_CHECKS: string[] = [
  'explore:a15-prairie:farmhouse',
  'watch:a15-cyclone:north',
  'wait:a15-house:munchkin-land',
  'talk:a15-north:council',
  'watch:a15-slate:north-hat',
  'place:a15-table:boq',
  'climb:a15-pole:cornfield',
  'walk:a15-scarecrow:yellow-brick',
  'sit:a15-road:bank',
  'find:a15-woodman:forest',
  'find:a15-oilcan:cottage',
  'puzzle:a15-joints:woodman',
  'walk:a15-forest:deep',
  'sit:a15-lion:roadside',
  'climb:a15-lion:first-ditch',
  'watch:a15-forest:kalidahs',
  'build:a15-bridge:second-ditch',
  'build:a15-raft:river',
  'wait:a15-raft:current',
  'talk:a15-stork:riverbank',
  'carry:a15-nubbin:poppies',
  'watch:a15-wildcat:meadow',
  'craft:a15-strings:cart',
  'walk:a15-road:emerald-gate',
  'inspect:a15-spectacles:gate',
  'explore:a15-city:streets',
  'escort:a15-dorothy:throne-room',
  'talk:a15-friends:green-hall',
  'wait:a15-lion:throne-door',
  'watch:a15-witch:west',
  'wait:a15-monkeys:sky',
  'feed:a15-lion:yard',
  'inspect:a15-bar:kitchen',
  'watch:a15-bucket:kitchen',
  'craft:a15-friends:mend',
  'puzzle:a15-cap:lining',
  'talk:a15-monkey-king:flight',
  'visit:a15-throne:together',
  'talk:a15-oz:screen',
  'choose:a15-oz:secret',
  'craft:a15-brains:bran',
  'craft:a15-heart:silk',
  'give:a15-lion:courage',
  'craft:a15-balloon:silk',
  'watch:a15-balloon:launch',
  'talk:a15-soldier:south',
  'walk:a15-forest:fighting-trees',
  'climb:a15-wall:china',
  'choose:a15-lamb:field',
  'visit:a15-forest:council',
  'wait:a15-lion:forest-edge',
  'climb:a15-hill:rocky',
  'watch:a15-monkeys:third-call',
  'visit:a15-glinda:castle',
  'talk:a15-friends:goodbye',
  'talk:a15-dorothy:farewell',
];
