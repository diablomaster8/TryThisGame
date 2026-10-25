/**
 * Atlas campaign, page A23: Remember Who You Are (Part M, rank 26). Sixteen quests, A23-1 to A23-16.
 *
 * SOURCE. The Lion King (Walt Disney Feature Animation, 1994; directed by Roger Allers and Rob
 * Minkoff). Rights: © Disney. Fully in copyright: this page needs a licence before ship, and the
 * characters must look exactly as licensed (there are no Grove versions of them). The Pride Lands
 * are fiction; the film's artists drew them after Kenya's Hell's Gate National Park. Only the 1994
 * film is used: not the 2019 remake, not Mufasa (2024), not the stage musical, not the sequels.
 *
 * AUDIENCE. 'all' (the outline: "All ages"), except A23-8 (the gorge) and A23-15 (Scar) are 'main', so the
 * death and the fight never reach the Learning Grove. Every lifted line has a `childLines` replacement. The
 * Learning Grove's own version (a savanna page with Swahili words, the pride and the migration,
 * and no retelling of the death) is a separate task and is not in this file.
 *
 * FRAME. Nova's atlas falls open at a red rock above a golden plain at sunrise. You and your Nubbin
 * step down into Rafiki's baobab, where you lodge as his guest and helper: you mix his paints and
 * carry his gourds (the line's running thread). Nobody from the valley comes in with you. Simba,
 * Nala, Mufasa and the rest keep their story; you carry, watch, bind a wing and sit. Inside the page
 * the animals talk, because that is the story's rule (canon 31); your Nubbin never talks. It tumbles
 * with the cubs, learns to pounce (and misses), will not eat a grub, and tries to roar. Rafiki
 * teaches you polepole (slowly) in A23-1 and says it whenever you hurry. The atlas keeps your time:
 * you and your Nubbin don't age while Simba grows up. Rafiki is a grounded, dry, kind elder with
 * a craft (painting, medicine, watching), never a comic caricature of an African healer: he speaks
 * plain, exact English with a few Swahili words, and none of the film's chants.
 *
 * GROVE FLAGS READ (read-only; the Atlas never writes a Grove flag):
 *   - Campaign finished (CampaignState.ending is set, so Hazel's walk up the hill, c12-walk-*, has
 *     played). Then A23-14's clouds step ends with A23_VARIANTS a23-14-clouds-done-after in place
 *     of a23-14-clouds-done: your Nubbin looks from the clouds to you, and Rafiki puts a hand on
 *     your shoulder and says nothing. Hazel never appears and is never named.
 *   - s24Done (S24). Hazel's margin note beside the pool (A23-14): A23_VARIANTS 'a23-margin-hazel',
 *     its text exactly as S24's notes give it. It plays after a23-14-complete, or the first time the
 *     atlas is open at the pool once s24Done is set.
 *   - From the Grove side, atlasDone('A23'): the painting in Hazel's crooked tree (A23_VARIANTS
 *     a23-grove-painting), the sunset roar emote, and the Night of Remembering festival.
 *
 * FLAGS WRITTEN (Atlas save only, all prefixed a23-):
 *   - a23-01 … a23-16: each quest on completion. a23-done: the whole page (A23-16).
 *   - a23-path = simba | rafiki (A23-9, a23-09-choice). The signature choice: follow Simba into
 *     exile, or carry Zazu home to Rafiki's tree. It picks the scenes of A23-10, A23-11 and A23-13,
 *     the opening and close of A23-12, and your place at the last presentation (A23-16, seven
 *     quests later). The quests show the simba scenes; A23_VARIANTS holds the rafiki ones.
 *
 * LIFTED TEXT (copyrighted: exactly three one-sentence lines, exactly as the outline lists them,
 * checked there against Wikiquote's The Lion King page; NOT yet checked against the licensed film,
 * which the outline asks for before ship; set with the game's curly apostrophes):
 *   1. Mufasa, under the stars: "I’m only brave when I have to be." a23-07-stars#1.
 *   2. Mufasa, under the stars: "The great kings of the past look down on us from those stars."
 *      a23-07-stars#7.
 *   3. Mufasa, in the clouds: "Remember who you are." a23-14-clouds#7.
 * Each is used once, and each has a childLines entry. Every other line is original; famous film
 * lines are deliberately avoided or reworded (no "circle of life", no "long live the king", no
 * "it is time", no "look harder" spoken aloud). No song lyrics: the songs' scenes are told as
 * action (the herd chase in A23-5, the years in A23-11, the hyena decoy in A23-15). Hakuna matata
 * appears only as the everyday Swahili phrase (A23-11, A23-12), never as the song.
 *
 * SWAHILI (every word to be checked by the East African adviser, Kenyan and Tanzanian speakers):
 * karibu (welcome), polepole (slowly), twiga (giraffe), asante (thank you), pole sana (I'm so
 * sorry, said in sympathy), mvua (rain), hakuna matata (no worries; literally "there are no
 * troubles"). The adviser should also check the names as Swahili words (Simba, Rafiki, Sarabi,
 * Shenzi, Banzai, Pumbaa), Rafiki's voice, the landscape and the plants (baobab, fig, thorn scrub).
 *
 * CARE NOTES.
 *   - Mufasa's death is never seen. In A23-8 you are on the ledge with Zazu, binding his wing with
 *     your back to the gorge; you hear the stampede stop. One far-off line of a small shape lying
 *     down beside a big, still one, then the dust closes over it. Nothing is lingered on.
 *   - Scar's blame (A23-8) and his whisper (A23-15) are kept but not made crueller than the film;
 *     the whisper itself is never voiced. "It was never your fault" lands plainly in A23-15, said
 *     by Sarabi, and you start to say it in A23-13.
 *   - Scar's end is offscreen: he goes over the edge into smoke and shadow where the hyenas are,
 *     and their laughing stops. Nothing is shown or described.
 *   - Hyenas are comic menace. Nobody is bitten. Sarabi is struck once, in one line, and gets up.
 *   - The third rule (sit down next to them and wait) is acted out by Rafiki in A23-14 and offered
 *     as a choice in A23-10 and A23-13, never quoted.
 *   - Hakuna matata: in 2018 a petition asked Disney to drop its US clothing trade mark on the
 *     phrase. We use it only as the ordinary phrase, and no reward carries it.
 *   - The new cub at the end is never gendered.
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

const WHERE = 'Nova’s atlas: the Remember Who You Are page (Atlas campaign)';
const after = (code: string) => `Any time after ${code}, from Nova’s atlas.`;
const src = (beat: string) => `The Lion King (Disney, 1994): ${beat}`;
const LIC = 'licensed design, exactly as drawn in the 1994 film';

// ------------------------------------------------------------------ speakers

const RAFIKI = sp('a23-rafiki', 'Rafiki', `Rafiki, the old mandrill who keeps the baobab (The Lion King); ${LIC}`);
const SIMBA = sp('a23-simba', 'Simba', `Simba, Mufasa’s son, as a cub and grown (The Lion King); ${LIC}`);
const NALA = sp('a23-nala', 'Nala', `Nala, Simba’s friend, as a cub and grown (The Lion King); ${LIC}`);
const MUFASA = sp('a23-mufasa', 'Mufasa', `Mufasa, the king (The Lion King); ${LIC}`);
const SARABI = sp('a23-sarabi', 'Sarabi', `Sarabi, the queen, Simba’s mother (The Lion King); ${LIC}`);
const ZAZU = sp('a23-zazu', 'Zazu', `Zazu, the king’s hornbill majordomo (The Lion King); ${LIC}`);
const SCAR = sp('a23-scar', 'Scar', `Scar, Mufasa’s brother (The Lion King); ${LIC}`);
const SHENZI = sp('a23-shenzi', 'Shenzi', `Shenzi, a hyena (The Lion King); ${LIC}`);
const BANZAI = sp('a23-banzai', 'Banzai', `Banzai, a hyena (The Lion King); ${LIC}`);
const TIMON = sp('a23-timon', 'Timon', `Timon, the meerkat (The Lion King); ${LIC}`);
const PUMBAA = sp('a23-pumbaa', 'Pumbaa', `Pumbaa, the warthog (The Lion King); ${LIC}`);

const N = say('narrator');
const Y = say('you');
const RA = say('a23-rafiki');
const SI = say('a23-simba');
const NA = say('a23-nala');
const MU = say('a23-mufasa');
const SB = say('a23-sarabi');
const ZA = say('a23-zazu');
const SC = say('a23-scar');
const SH = say('a23-shenzi');
const BA = say('a23-banzai');
const TI = say('a23-timon');
const PU = say('a23-pumbaa');

// ------------------------------------------------------------------ lifted text (copyrighted; three lines, outline-approved)

/** Mufasa under the stars. As quoted on Wikiquote's The Lion King page; check against the licensed film. */
const LIFT_BRAVE = 'I’m only brave when I have to be.';
/** Mufasa under the stars. As quoted on Wikiquote's The Lion King page; check against the licensed film. */
const LIFT_KINGS = 'The great kings of the past look down on us from those stars.';
/** Mufasa in the clouds. As quoted on Wikiquote's The Lion King page; check against the licensed film. */
const LIFT_REMEMBER = 'Remember who you are.';

// ------------------------------------------------------------------ shared pieces

/** A23-16: the presentation, as seen from the rock (both endings). */
const A16_PLAIN = N('Down on the plain, everyone sees at once. The sound comes up the rock like the sea, and the whole plain kneels.');

/** A23-16: the way home (both endings). */
const A16_HOME: Line[] = [
  N('Then the light comes, and the paper, and the kitchen table. Nova’s atlas lies open at a red rock over a green plain.'),
  N('Between the pages there is a bookmark that wasn’t there before, and a smell of rain.'),
];

/** A23-12: what Nala says when she and Simba come back from the waterfall (both paths). */
const A12_BACK = N('When they come back, Nala won’t look at Simba, and Simba won’t look at anybody.');

// =================================================================== REMEMBER WHO YOU ARE

export const ATLAS_A23: Quest[] = [
  // ---------------------------------------------------------------- A23-1
  {
    id: 'a23-01',
    code: 'A23-1',
    title: 'The Presentation',
    source: src('the presentation of the new cub at Pride Rock'),
    audience: 'all',
    trigger: { where: WHERE, when: 'Any time once Nova’s atlas is in the Grove; the first quest on the page.' },
    speakers: [RAFIKI, ZAZU, MUFASA, SARABI],
    steps: [
      {
        id: 'a23-01-s1',
        goal: 'Step down into the page and find Rafiki’s baobab.',
        hint: 'Touch the red rock on the page, then follow the path down to the big tree.',
        check: 'explore:a23-baobab:plain',
        scene: {
          id: 'a23-01-page',
          lines: [
            N('Nova’s atlas falls open at a page of red and gold: a great rock standing over a plain, and the sun just coming up behind it.'),
            N('The light spills off the paper and over your hands, warm as bathwater.'),
            N('Then there is dry grass to your knees, a smell of dust and dew, and a tree with a trunk as fat as a cottage.'),
            N('Somebody is sitting in the fork of it, cracking a gourd on his knee: an old mandrill with a white beard and a long stick.'),
            RA('Ah. There you are. The page said someone was coming. It didn’t say when, so I made tea for nobody, twice.', 'happy'),
            RA('Karibu. That means welcome. Come up, come up. Mind the third branch; it has opinions.'),
            N('Your Nubbin is up the trunk before you, hand over hand. It sits down in the fork as if it had always lived there.'),
            RA('I am Rafiki. This is my tree. Today a king shows his son to the world, and I need somebody to carry gourds.'),
            Y('I can carry gourds.'),
            RA('Good. Everyone can. Not everyone does. Take the small one; it is full of something you must not drink.', 'think'),
          ],
          choices: [
            {
              id: 'gourd',
              label: 'Take the small gourd, carefully.',
              then: [RA('Carefully. Good. Either you have done this before, or you are frightened of me. Both are useful.', 'happy')],
            },
            {
              id: 'nubbin',
              label: 'Ask what your Nubbin should carry.',
              then: [RA('Its own self, today. That is plenty for something so new.', 'soft')],
            },
            {
              id: 'hurry',
              label: 'Say you’d better hurry.',
              then: [
                RA('Polepole. Slowly. The sun is coming up whether we run or not.', 'think'),
                N('It is the first time he says it to you. It won’t be the last.'),
              ],
            },
          ],
        },
        done: {
          id: 'a23-01-page-done',
          lines: [
            N('Rafiki swings down from the tree on his stick and sets off across the grass without looking back. You follow.'),
            RA('Polepole. The sun is not going anywhere. Well. Up. But not anywhere.'),
          ],
        },
      },
      {
        id: 'a23-01-s2',
        goal: 'Walk with Rafiki to the great rock, through the gathering animals.',
        hint: 'Keep close behind Rafiki’s stick. The herds will part for him.',
        check: 'walk:a23-pride-rock:plain',
        scene: {
          id: 'a23-01-gathering',
          lines: [
            N('The whole plain is walking the same way: zebra, antelope, a family of elephants, and birds in clouds over all of them.'),
            N('Giraffes go past with their heads up in the morning, swaying like slow ships.'),
            RA('Twiga. Giraffe. Say it.'),
            Y('Twiga.'),
            RA('Good. Now you know one thing more than you did. Do that every day and you will be old and clever, like me.', 'happy'),
            N('The herds part for Rafiki. Elephants lift their trunks to him, and small antelope bow their heads as he passes.'),
            N('Up on the rock a big lion with a dark mane stands waiting, and a lioness beside him with something small between her paws.'),
            N('A blue-black hornbill flutters down onto a stone in front of you, very important, and looks you up and down.'),
            ZA('Name? Business? Are you on the list? There is a list. I keep the list.', 'think'),
            RA('They are with me, Zazu.'),
            ZA('Everything strange is with you. Very well. Go up. Mind the king’s tail; he’s very particular about his tail.'),
          ],
          choices: [
            {
              id: 'list',
              label: 'Ask to see the list.',
              then: [ZA('Certainly not. It is mostly in my head, which is where lists are safest.')],
            },
            {
              id: 'bow',
              label: 'Bow to Zazu.',
              then: [ZA('Oh! Well. Somebody was raised properly.', 'happy'), N('He bows back, and nearly falls off his stone.')],
            },
            {
              id: 'nubbin',
              label: 'Let your Nubbin say hello.',
              then: [N('Your Nubbin waves. Zazu looks at it for a long moment, then files it in his head under “miscellaneous”.')],
            },
          ],
        },
        done: {
          id: 'a23-01-gathering-done',
          lines: [
            N('The king comes down to meet Rafiki, and they hold each other, the big lion and the old mandrill, the way old friends do.'),
            MU('Rafiki. You came.'),
            RA('I always come. Now. Let us see him.', 'happy'),
          ],
        },
      },
      {
        id: 'a23-01-s3',
        goal: 'Watch Rafiki present the new cub from the top of the rock.',
        hint: 'Stand at the back with the gourd. Your Nubbin will want a better view.',
        check: 'watch:a23-presentation:pride-rock',
        scene: {
          id: 'a23-01-presentation',
          lines: [
            N('The lioness, Sarabi, moves her paws aside. Between them is a cub the colour of new bread, blinking at all of you.'),
            SB('Gently. He’s three days old, and already he thinks he owns the place.', 'soft'),
            N('Rafiki shakes a rattle of gourds over the cub. The cub sneezes, and the king laughs, low, like thunder a long way off.'),
            RA('The gourd. Now.'),
            N('You hand it over. Rafiki cracks it on his stick and dips his thumb in the juice inside.'),
            N('He draws one line across the cub’s brow, red as ripe fruit.'),
            N('Your Nubbin climbs your back, then your shoulder, then your head, to see.'),
            N('Rafiki walks to the very edge of the rock and holds the cub up in both hands, high, over everything.'),
            N('Down on the plain, every animal sees him at once. The sound comes up the rock like the sea.'),
            N('Elephants trumpet and zebra stamp. The birds go up in one great wheel, and then the whole plain kneels.'),
            N('A shaft of light comes down through the clouds and lands on the cub. He squints at it, crossly.'),
          ],
          choices: [
            {
              id: 'kneel',
              label: 'Kneel with the plain.',
              then: [N('You kneel on the warm stone. Your Nubbin, still on your head, kneels too, which is harder than it looks.')],
            },
            {
              id: 'watch',
              label: 'Stay standing, and watch the king’s face.',
              then: [N('The king isn’t looking at the plain. He is looking at his son, the way you look at a fire on a cold night.', 'soft')],
            },
          ],
        },
      },
    ],
    complete: {
      id: 'a23-01-complete',
      lines: [
        N('The cub goes back to his mother and falls asleep at once, worn out by being important.'),
        MU('His name is Simba. Rafiki tells me you are a guest. Then you are welcome on this rock, guest.'),
        N('Rafiki is quiet on the walk home. Halfway there he stops and looks back at the rock.'),
        RA('There was one face missing up there. The king’s brother. He did not come.', 'think'),
        RA('Well. He will come or he will not. Carry the gourds. We have painting to do.'),
      ],
    },
    rewards: [],
    sets: { 'a23-01': true },
    notes:
      'OPENING: the page is a red rock over a golden plain at sunrise; the light should pour off the paper for a beat ' +
      'before the scene fades in. You lodge in Rafiki’s baobab for the whole page. From here on you carry a gourd on ' +
      'a string at your hip on this page (a prop, not a reward). Staging: the presentation is the page’s big set ' +
      'piece; the plain kneeling is a slow wave of animals bowing outward from the rock. Your Nubbin rides on your ' +
      'head for a23-01-presentation#6 onwards. Scar is absent (the complete scene notes it). Art: every source ' +
      'character is the licensed design. SWAHILI: karibu, polepole, twiga (adviser).',
  },

  // ---------------------------------------------------------------- A23-2
  {
    id: 'a23-02',
    code: 'A23-2',
    title: 'Rafiki’s Tree',
    source: src('Rafiki paints the new cub inside his baobab'),
    audience: 'all',
    trigger: { where: WHERE, when: after('A23-1') },
    requires: ['A23-1'],
    speakers: [RAFIKI],
    steps: [
      {
        id: 'a23-02-s1',
        goal: 'Mix Rafiki’s paints: ochre from the riverbank, and red from the fruit.',
        hint: 'Bring yellow earth from the dry riverbed and ripe fruit from the tree, then grind them in the shell.',
        check: 'craft:a23-paint:baobab',
        scene: {
          id: 'a23-02-paints',
          lines: [
            N('On the way in, the third branch creaks at you. You find you have said sorry to it.'),
            RA('Good. It likes manners. Last week it threw out a bird.', 'think'),
            N('Inside, the baobab is hollow and cool, and taller than it looks. The walls are painted all the way up.'),
            N('Lions, mostly: kings and queens and cubs in rust and white and yellow, some so old they have gone the colour of tea.'),
            RA('My family. Not my family. The family I watch. Which is the same thing, if you watch long enough.'),
            RA('Now. The cub must go up on the wall. For that I need ochre, and red. You will mix them, because my knees have retired.'),
            N('He gives you a tortoise shell for a bowl and a smooth stone for grinding.'),
            RA('Ochre is the yellow earth by the dry river. Red is the fruit of this tree: the ripe ones, not the ones that make you sorry.', 'happy'),
            N('Your Nubbin has already found a fruit. It has red juice up to the elbows and looks thrilled.'),
            RA('Hm. That one has started without you.'),
          ],
          choices: [
            {
              id: 'grind',
              label: 'Grind it slowly, the way he showed you.',
              then: [RA('Polepole. Yes. Slow paint stays on the wall. Fast paint ends up on the visitor.', 'happy')],
            },
            {
              id: 'fast',
              label: 'Grind it fast, to get it done.',
              then: [N('A puff of yellow dust goes up your nose. You sneeze it all over the floor.'), RA('Polepole.', 'think')],
            },
            {
              id: 'taste',
              label: 'Wonder aloud whether the fruit is nice to eat.',
              then: [RA('It is. Eat one first. A hungry painter paints nothing but food.', 'happy')],
            },
          ],
        },
        done: {
          id: 'a23-02-paints-done',
          lines: [
            N('The paint comes up thick and warm: a yellow like dry grass at noon, and a red like the inside of the fruit.'),
            RA('Good. Asante. That is thank you. You will hear it from me more than you expect.', 'soft'),
          ],
        },
      },
      {
        id: 'a23-02-s2',
        goal: 'Hold the shell while Rafiki paints the cub on the wall of his tree.',
        hint: 'Stand still beside him with the paints. Your Nubbin will try to help.',
        check: 'watch:a23-painting:baobab',
        scene: {
          id: 'a23-02-wall',
          lines: [
            N('Rafiki climbs the inside of the tree with the shell hooked on his stick, up to a bare patch of bark at the height of your head.'),
            N('He paints with his fingers, quick and sure: a round body, four fat paws, ears like two little hills.'),
            RA('There. Simba. Not a good likeness. He is much crosser in life.', 'happy'),
            N('Last, with one dab of red, he gives the painted cub the line across its brow.'),
            RA('Now he is on the wall. As long as the wall stands, someone will know he was here.', 'soft'),
            N('Your Nubbin looks at the painted cub. Then it reaches into the shell and puts a red paw-print on its own forehead.'),
            RA('Ha! It wants to be on the wall as well.', 'happy'),
            RA('Not today, small one. Painting someone is a serious thing. It means you mean to remember them.', 'think'),
          ],
          choices: [
            {
              id: 'ask',
              label: 'Ask why he paints them.',
              then: [RA('Because a lion is quick, and a wall is slow. Somebody has to hold on to things for the quick ones.')],
            },
            {
              id: 'old',
              label: 'Look at the oldest paintings, near the top.',
              then: [N('Up near the roof, a lion is painted so faint you can only see it when you stop trying. Rafiki doesn’t say who it was.')],
            },
            {
              id: 'wipe',
              label: 'Wipe your Nubbin’s forehead.',
              then: [RA('Leave it. It suits it. Red, for a small brave one. It will wash off. Most things do.', 'soft')],
            },
          ],
        },
      },
    ],
    complete: {
      id: 'a23-02-complete',
      lines: [
        N('Rafiki climbs down and wipes his hands on the grass. He looks up at the wall for a long time.'),
        RA('You will come again. The page will bring you. Here, for the small one.'),
        N('He threads a tiny dried gourd onto a grass string and hangs it round your Nubbin’s neck.'),
        RA('For carrying. Nothing in it yet. That is the best sort of gourd: the sort that is waiting.', 'happy'),
        N('Your Nubbin shakes it. It makes a small, dry, important noise.'),
      ],
    },
    rewards: [
      {
        id: 'a23-gourd',
        kind: 'cosmetic',
        label: 'Tiny Gourd',
        description: 'A little dried gourd on a grass string, from Rafiki. Your Nubbin wears it round its neck. It rattles when it runs.',
      },
    ],
    sets: { 'a23-02': true },
    notes:
      'The baobab interior is one tall hollow room, its walls covered in faded lion paintings (our own drawings in the ' +
      'licensed style). The painted Simba cub stays on the wall from here until A23-10 (rafiki path: smudged out) and ' +
      'A23-13 (rafiki path: painted back with a mane). On the simba path it stays untouched until A23-16. Your ' +
      'Nubbin keeps the red paw-mark on its brow on this page from a23-02-wall#5 on (the Grove painting reward ' +
      'shows it). The gourd is a one-time cosmetic, worn anywhere. SWAHILI: asante (adviser).',
  },

  // ---------------------------------------------------------------- A23-3
  {
    id: 'a23-03',
    code: 'A23-3',
    title: 'Everything the Light Touches',
    source: src('Mufasa shows Simba the kingdom at sunrise; the pouncing lesson'),
    audience: 'all',
    trigger: { where: WHERE, when: after('A23-2') },
    requires: ['A23-2'],
    speakers: [MUFASA, SIMBA, ZAZU],
    steps: [
      {
        id: 'a23-03-s1',
        goal: 'Carry Rafiki’s message up to the king before sunrise.',
        hint: 'Climb the back path to the top of the rock. Arrive quietly.',
        check: 'deliver:a23-message:pride-rock',
        scene: {
          id: 'a23-03-dawn',
          lines: [
            N('The page turns. Simba is bigger now, all feet and ears, and he has been awake since long before the sun.'),
            N('Rafiki has sent you up the rock with a message for the king: the rains are late, and Rafiki is watching.'),
            N('Before you can give it, a small lion lands on your feet.'),
            SI('Are you the guest? Dad says you’re the guest. Are you staying? Do you want to see me pounce?', 'happy'),
            N('He doesn’t wait for an answer. He pounces on your Nubbin, and the two of them roll off down the rock in one ball.'),
            MU('Simba. Guests are not for pouncing.', 'think'),
            SI('It started it!'),
            N('It did not start it. Your Nubbin comes up out of the grass looking delighted, and dives straight back in.'),
            MU('Rafiki’s message?'),
            Y('The rains are late. And he’s watching.'),
            MU('He is always watching. That is a comfort, mostly. Come. There is something I want my son to see.', 'soft'),
          ],
          choices: [
            {
              id: 'wrestle',
              label: 'Let them wrestle.',
              then: [N('The two of them roll about in the grass until they are both the same colour.')],
            },
            {
              id: 'part',
              label: 'Pull them apart before anyone cries.',
              then: [N('Nobody cries. Simba thinks being lifted by the scruff is a new game, and asks for another go.')],
            },
          ],
        },
        done: {
          id: 'a23-03-dawn-done',
          lines: [N('The king walks to the very top of the rock, and Simba scrambles after him. You follow with your Nubbin under your arm.')],
        },
      },
      {
        id: 'a23-03-s2',
        goal: 'Stand with the king and his son as the sun comes up over the plain.',
        hint: 'Find a spot at the top of the rock, a little behind them. Watch where the light goes.',
        check: 'watch:a23-sunrise:pride-rock',
        scene: {
          id: 'a23-03-light',
          lines: [
            N('The sun comes up over the edge of the world, and the light runs across the plain like water spilt on a table.'),
            MU('Look, Simba. As far as the light goes. One day all of it will be yours to look after.'),
            SI('All of it? Even the bit with the river?', 'shock'),
            MU('Even the river.'),
            SI('What about over there? The dark bit?'),
            N('Far off, past the edge of the light, there is a grey place where nothing seems to grow.'),
            MU('That is beyond our borders. You must never go there.', 'think'),
            SI('But I thought a king could go anywhere.'),
            MU('A king does what he must, not what he likes. That is the whole trick of it, and it isn’t easy.'),
            MU('Everything here is joined. The grass feeds the antelope, the antelope feed us, and when we lie down at the end, we feed the grass.', 'soft'),
            MU('So we are all part of each other: the lion and the beetle and the grass. A good king remembers that.'),
            SI('So we eat the antelope, and then the antelope… eat us? A bit?', 'think'),
            MU('A bit. Later. Much later.', 'happy'),
          ],
          choices: [
            {
              id: 'lift',
              label: 'Hold your Nubbin up to see the light.',
              then: [N('It squints at the sun the way Simba did on his first morning, and sneezes.')],
            },
            {
              id: 'grey',
              label: 'Ask the king what the grey place is.',
              then: [MU('Somewhere I hope none of you ever learn about.', 'think')],
            },
          ],
        },
      },
      {
        id: 'a23-03-s3',
        goal: 'Watch the pouncing lesson, and let your Nubbin have a go.',
        hint: 'Keep low in the grass behind Simba. Zazu is the target, whether he knows it or not.',
        check: 'watch:a23-pounce:grass',
        scene: {
          id: 'a23-03-pounce',
          lines: [
            N('Zazu lands on a rock beside the king with the morning report. It is long, and he has clearly practised it.'),
            ZA('Giraffes: tall as ever. Elephants: no complaints. The cheetahs are hungry, and the hippos would like a word about mud.'),
            MU('Simba. Come here. Low down in the grass. Stay very still.'),
            SI('What are we doing?', 'think'),
            MU('A pouncing lesson. Watch his tail feathers. Slowly. Slower than that.'),
            ZA('…and the warthogs report… Sorry, sir. What is the boy doing?'),
            MU('Nothing. Turn round.'),
            N('Simba wiggles his bottom, creeps three steps, and launches himself at the hornbill with a squeak.'),
            N('He lands on Zazu with all four paws. Zazu says something that is not in the morning report.'),
            N('Your Nubbin has watched all of it with great seriousness. It wiggles, it creeps, and it pounces.'),
            N('It misses Zazu by a whole lion’s length and lands in a bush.'),
          ],
          choices: [
            {
              id: 'cheer',
              label: 'Cheer anyway.',
              then: [N('Your Nubbin climbs out of the bush and bows. Simba cheers too, much louder.')],
            },
            {
              id: 'help',
              label: 'Help it out of the bush.',
              then: [N('It comes out covered in burrs and thoroughly pleased with itself.')],
            },
          ],
        },
      },
    ],
    complete: {
      id: 'a23-03-complete',
      lines: [
        ZA('This is what comes of having guests. Everybody gets ideas.', 'angry'),
        MU('Your small one will make a fine hunter one day. In a year or two. With a bigger bush.', 'happy'),
        N('Simba lies on his back in the grass with his paws in the air, out of breath and very proud.'),
        SI('When I’m in charge, everyone will have to let me pounce on them.'),
        MU('When you’re in charge, you’ll know better. Go and find your mother.', 'soft'),
        N('Simba races off down the rock. The king watches him all the way down.'),
      ],
    },
    rewards: [],
    sets: { 'a23-03': true },
    notes:
      'The sunrise is the page’s second big light moment: gold running across the plain from the rock outwards. The ' +
      'grey place to the north is the elephant graveyard, seen as a smudge on the horizon. Mufasa’s “joined” lines ' +
      'are our own paraphrase of the outline’s beat; the film’s song title and wording are not used. The pounce is ' +
      'a small animation for both cubs and your Nubbin (it misses, lands in a bush, burrs on it for the rest of the ' +
      'quest).',
  },

  // ---------------------------------------------------------------- A23-4
  {
    id: 'a23-04',
    code: 'A23-4',
    title: 'Uncle Scar',
    source: src('Scar tells Simba about the elephant graveyard'),
    audience: 'all',
    trigger: { where: WHERE, when: after('A23-3') },
    requires: ['A23-3'],
    speakers: [SCAR, SIMBA, RAFIKI],
    steps: [
      {
        id: 'a23-04-s1',
        goal: 'Follow Simba round to his uncle’s ledge.',
        hint: 'Simba has gone round the shady side of the rock. Keep up.',
        check: 'walk:a23-ledge:pride-rock',
        scene: {
          id: 'a23-04-ledge',
          lines: [
            N('Simba can’t stop talking about the sunrise. He is going to tell everybody, and the first everybody is his uncle.'),
            N('Round the shady side of the rock, on a ledge the sun never quite reaches, a thin dark lion lies with his chin on his paws.'),
            N('His mane is black and his eyes are green, and an old scar runs down over one of them.'),
            SI('Uncle Scar! Guess what! Dad showed me the whole kingdom, and I’m going to look after all of it!', 'happy'),
            SC('How lovely for you. Do excuse me if I don’t get up. Getting up is for lions with somewhere to be.', 'think'),
            N('He looks at you over Simba’s head. He takes a long time about it, and then he smiles.'),
            SC('And a guest. Rafiki’s, I suppose. He does collect strays.'),
            SI('Uncle Scar, when I’m king, what will you be?'),
            SC('Older. Thinner. Still on this ledge.', 'think'),
          ],
          choices: [
            {
              id: 'greet',
              label: 'Say good morning politely.',
              then: [SC('Good morning. Such manners. Somebody ought to bottle them.')],
            },
            {
              id: 'stare',
              label: 'Look straight back at him.',
              then: [N('He holds your look and doesn’t blink, and you are the one who looks away first.')],
            },
            {
              id: 'behind',
              label: 'Keep your Nubbin behind your legs.',
              then: [N('Your Nubbin has climbed on every animal on the plain. It does not want to go anywhere near this one.')],
            },
          ],
        },
        done: {
          id: 'a23-04-ledge-done',
          lines: [N('Scar stretches, slow and careful, like someone with a bad back who wants you to ask about it.')],
        },
      },
      {
        id: 'a23-04-s2',
        goal: 'Listen to what Scar lets slip.',
        hint: 'Stay close to Simba and listen. Scar is choosing his words.',
        check: 'talk:a23-scar:ledge',
        scene: {
          id: 'a23-04-slip',
          lines: [
            SC('Did your father show you everything, Simba? Even what lies past the northern border?'),
            SI('He said I can’t go there.', 'sad'),
            SC('And he’s quite right. It’s a place for grown lions. Very bold ones. Not you, of course.', 'think'),
            SI('I’m bold! What’s out there?'),
            SC('Oh, no. No, I couldn’t. I’ve said too much already.'),
            N('He turns away as if he were sorry. He isn’t, and you can tell from the end of his tail.'),
            SC('Bones, Simba. Old ones, as big as trees. Where the elephants went to lie down. No place for a cub.'),
            SI('An elephant… what?', 'shock'),
            SC('Promise me you’ll keep well away. Just between us two. And don’t tell your father I mentioned it.', 'soft'),
            N('Simba’s eyes have gone round and shiny. He isn’t listening to the promise part at all.'),
          ],
          choices: [
            {
              id: 'tell',
              label: 'Say you’ll tell the king.',
              then: [
                SC('Tell him what? That I warned his son to be careful? Do. He’ll be so grateful.', 'happy'),
                N('You can’t think of an answer. That was the point.'),
              ],
            },
            {
              id: 'horrible',
              label: 'Tell Simba it sounds like a horrible place.',
              then: [SI('It sounds amazing.', 'happy')],
            },
            {
              id: 'leave',
              label: 'Take Simba away from the ledge.',
              then: [N('Simba comes with you, but he looks back twice. Scar is watching both times.')],
            },
          ],
        },
      },
    ],
    complete: {
      id: 'a23-04-complete',
      lines: [
        N('Back at the baobab, you tell Rafiki what Scar said. He stops painting and puts his finger down very carefully.'),
        RA('He told the boy where not to go. That is the same as drawing him a map.', 'think'),
        RA('Some lions want the plain. Some only want the rock at the top of it. That one has always wanted the rock.'),
        Y('What do we do?'),
        RA('We watch. And we fill the gourds, because cubs get thirsty, wherever they run.', 'soft'),
      ],
    },
    rewards: [],
    sets: { 'a23-04': true },
    notes:
      'Scar’s ledge is in permanent shade; he is drawn lying down throughout this quest. His menace is in the ' +
      'pauses, not the words: no growling, no claws. The film’s lines for this scene are not used; Scar’s ' +
      'reverse-psychology is in our own words. The choices give the player a voice and change nothing.',
  },

  // ---------------------------------------------------------------- A23-5
  {
    id: 'a23-05',
    code: 'A23-5',
    title: 'Losing Zazu',
    source: src('Simba and Nala give Zazu the slip on the way to the graveyard'),
    audience: 'all',
    trigger: { where: WHERE, when: after('A23-4') },
    requires: ['A23-4'],
    speakers: [SIMBA, NALA, ZAZU, RAFIKI],
    steps: [
      {
        id: 'a23-05-s1',
        goal: 'Set off with Simba, Nala and Zazu, to “the waterhole”.',
        hint: 'Zazu is in charge of the walk. Stay with the group, for as long as there is a group.',
        check: 'escort:a23-cubs:plain',
        scene: {
          id: 'a23-05-walk',
          lines: [
            N('Next morning Simba turns up at the baobab with a friend: a cub with pale fur and the look of a planned escape.'),
            SI('This is Nala. We’re going to the waterhole. A really good waterhole. You should come.', 'happy'),
            NA('It isn’t the waterhole. Tell them.'),
            SI('Shh! Zazu’s coming.'),
            N('Zazu is coming. Their mothers said they could go as long as he went too, and he is taking it extremely seriously.'),
            ZA('In a line, please. Single file. Nobody is to be eaten, trampled, or rude to a rhinoceros.', 'think'),
            RA('Go with them. Take water. And keep your eyes open.', 'think'),
            N('Your Nubbin trots between the two cubs, very pleased to be counted as one of the gang.'),
            NA('What is it?'),
            Y('A Nubbin.'),
            NA('Can it pounce?'),
            SI('It tries.', 'happy'),
          ],
          choices: [
            {
              id: 'back',
              label: 'Walk at the back with Zazu.',
              then: [ZA('Ah, a sensible person. You and I shall keep order, and they shall resent us. It is a calling.')],
            },
            {
              id: 'front',
              label: 'Walk at the front with the cubs.',
              then: [NA('You know it’s not the waterhole, right? You’ve worked that out?'), Y('I’ve worked that out.')],
            },
          ],
        },
        done: {
          id: 'a23-05-walk-done',
          lines: [N('Halfway across the plain, Simba gives Nala a look, and Nala gives it back. Then both of them run.')],
        },
      },
      {
        id: 'a23-05-s2',
        goal: 'Keep up with the cubs as they lose Zazu among the herds.',
        hint: 'Follow the cubs through the herds. Duck under the zebra and go round the rhinoceros.',
        check: 'race:a23-herds:plain',
        scene: {
          id: 'a23-05-chase',
          lines: [
            N('They go straight into the middle of a herd of zebra, and you have no choice but to go in after them.'),
            ZA('Come back! This is not single file! This is not any file!', 'angry'),
            N('Stripes everywhere. You lose the cubs, find them, then lose your own feet and land on your back in the dust.'),
            N('Simba runs under a giraffe. Nala goes round a rhinoceros the size of a hut, which doesn’t notice either of them.'),
            N('Your Nubbin does the last bit on the back of a startled antelope, and gets off as if it had meant to.'),
            N('Far behind you, Zazu flies straight into a flock of flamingos and doesn’t come out the other side.'),
            SI('We lost him! I am a genius!', 'happy'),
            NA('I am a genius. It was my idea.'),
            N('Everyone is far too out of breath to say anything else clever.'),
          ],
          choices: [
            {
              id: 'zazu',
              label: 'Tell them to go back for Zazu.',
              then: [SI('Zazu’s fine. Zazu’s always fine. He’ll find us. He finds everything.')],
            },
            {
              id: 'laugh',
              label: 'Laugh, because it was a bit funny.',
              then: [NA('See? The guest thinks we’re geniuses.', 'happy')],
            },
            {
              id: 'water',
              label: 'Give them a drink from Rafiki’s gourd.',
              then: [N('They drink as if they had run across a whole country. They have run across most of one.')],
            },
          ],
        },
        done: {
          id: 'a23-05-chase-done',
          lines: [N('Ahead of you, the grass stops. The ground goes grey and cracked, and steam leaks up out of it.')],
        },
      },
    ],
    complete: {
      id: 'a23-05-complete',
      lines: [
        N('A great curved rib sticks up out of the ground, white as chalk and taller than the baobab.'),
        NA('Whoa.', 'shock'),
        SI('This is it. The elephant graveyard. Told you.'),
        N('Beyond the first rib there is another, and then a whole skull as big as a cottage, with mist curling out of its eyes.'),
        N('Your Nubbin holds on to your leg and won’t let go.'),
        Y('We should go back.'),
        SI('We’ve only just got here!'),
      ],
    },
    rewards: [],
    sets: { 'a23-05': true },
    notes:
      'NO SONG. In the film this stretch is a musical number; here it is a chase through the herds, told as action ' +
      'only. The race check is a short follow-the-cubs run (no fail state: if you fall behind, the cubs wait in the ' +
      'next gap, grinning). Zazu’s flamingo exit is a gag; he reappears in A23-6. The graveyard reveal in the ' +
      'complete scene is a slow pan up the rib.',
  },

  // ---------------------------------------------------------------- A23-6
  {
    id: 'a23-06',
    code: 'A23-6',
    title: 'The Graveyard',
    source: src('the hyenas in the elephant graveyard, and Mufasa’s rescue'),
    audience: 'all',
    trigger: { where: WHERE, when: after('A23-5') },
    requires: ['A23-5'],
    speakers: [SIMBA, NALA, ZAZU, SHENZI, BANZAI, MUFASA],
    steps: [
      {
        id: 'a23-06-s1',
        goal: 'Keep the cubs together among the bones.',
        hint: 'Stay in the open between the ribs. Don’t go into the skull.',
        check: 'explore:a23-graveyard:ribs',
        scene: {
          id: 'a23-06-bones',
          lines: [
            N('Everything here is grey: the ground, the sky, the bones, and the steam that hisses out of the cracks.'),
            N('Simba walks straight up to the big skull and peers into its eye, as if he were knocking on a door.'),
            SI('I’m going in. I’m not scared. Are you scared?'),
            NA('No. Are you?'),
            N('Zazu drops out of the sky, covered in dust and furious, with a flamingo feather stuck to his head.'),
            ZA('Out. Out, out, out. This is the wrong side of the border by a very long way, and I would like to go home.', 'angry'),
            SI('Danger’s my favourite thing. I have danger for breakfast.'),
            N('Somewhere inside the skull, somebody giggles. It isn’t a nice giggle.'),
            N('Three hyenas slink out of the skull’s eyes and mouth, grinning.'),
            SH('Banzai. Banzai, wake up. Lunch has come to us. That never happens.', 'happy'),
            BA('It’s a bird, two cubs, a guest, and a… what is that? A walking egg?', 'think'),
            N('The third hyena, Ed, just laughs. He laughs and laughs, and doesn’t stop.'),
          ],
          choices: [
            {
              id: 'front',
              label: 'Step in front of the cubs.',
              then: [SH('Ooh, a brave one. Brave ones are chewy.', 'happy')],
            },
            {
              id: 'coat',
              label: 'Pick up your Nubbin.',
              then: [N('It burrows into your coat until only its feet are showing.')],
            },
          ],
        },
      },
      {
        id: 'a23-06-s2',
        goal: 'Run! Get the cubs away through the ribs.',
        hint: 'Weave between the ribs and through the steam. Keep Nala and Simba ahead of you.',
        check: 'race:a23-hyenas:graveyard',
        scene: {
          id: 'a23-06-chase',
          lines: [
            ZA('Run!', 'shock'),
            N('Zazu flies at the hyenas to slow them down. They catch him by the tail and stuff him head first into a heap of old bones.'),
            N('You run with a cub on either side, through ribs as tall as houses, round a jawbone, under a tusk.'),
            N('Teeth snap behind you. Your Nubbin, still in your coat, kicks a hyena on the nose, and the snapping stops.'),
            NA('This way!'),
            N('Nala finds a gap under a fallen tusk and squeezes through. Simba goes after her, and you go after him on your elbows.'),
            N('Then the slope of bones gives way, and all three of you slide down in a rattling grey heap.'),
            N('At the bottom there is nowhere to go: a wall of bone behind you, three hyenas in front, and Ed still laughing.'),
            BA('Nowhere to run now, cubs. Shame. I like the running bit.', 'happy'),
            N('Simba steps in front of Nala. He opens his mouth to roar, and what comes out is a squeak.'),
            N('Shenzi laughs, and Simba tries again. Then a roar comes, a real one, but it isn’t his.'),
          ],
          choices: [
            {
              id: 'bone',
              label: 'Throw a bone to distract them.',
              then: [N('Banzai turns to look at it, because he can’t help himself. It buys you one second.')],
            },
            {
              id: 'stand',
              label: 'Stay in front of the cubs.',
              then: [N('Your knees are shaking. You stay put anyway.')],
            },
          ],
        },
        done: {
          id: 'a23-06-chase-done',
          lines: [
            N('The king comes down the slope of bones like a landslide, and the hyenas scatter like skittles.'),
            MU('Never come near my son again.', 'angry'),
            SH('Your son? Oh, your son! We didn’t know he was your son! Did you know, Banzai?', 'shock'),
            N('They don’t wait for an answer. Three hyenas vanish into the steam, Ed laughing all the way.'),
          ],
        },
      },
    ],
    complete: {
      id: 'a23-06-complete',
      lines: [
        N('Mufasa stands among the bones, breathing hard. He doesn’t look at the hyenas; he looks at Simba.'),
        SI('Dad, I…', 'sad'),
        MU('Zazu. Take Nala home.', 'angry'),
        MU('Guest, you will walk with us. Rafiki would never forgive me if I lost you on the way.'),
        N('Zazu pulls himself out of the bones, straightens one feather, and goes without a single word. You have never known him do that.'),
        N('Nala looks back at Simba all the way to the edge of the grey.'),
      ],
    },
    rewards: [],
    sets: { 'a23-06': true },
    notes:
      'The graveyard is grey, steamy and big, but never gory: old bones only, no carcasses. The hyenas are comic ' +
      'menace; nobody is bitten. Ed never speaks; his laugh is a sound effect. The chase is a short weave-through ' +
      'run with no fail state (the hyenas always corner you at the end). Mufasa’s roar is the page’s first full ' +
      'roar: shake the screen gently.',
  },

  // ---------------------------------------------------------------- A23-7
  {
    id: 'a23-07',
    code: 'A23-7',
    title: 'Under the Stars',
    source: src('Mufasa and Simba under the stars'),
    audience: 'all',
    trigger: { where: WHERE, when: after('A23-6') },
    requires: ['A23-6'],
    speakers: [MUFASA, SIMBA, RAFIKI],
    steps: [
      {
        id: 'a23-07-s1',
        goal: 'Walk home behind the king and his son, a little way off.',
        hint: 'Keep your distance. This isn’t your conversation, but you’re not to get lost either.',
        check: 'walk:a23-plain:dusk',
        scene: {
          id: 'a23-07-dusk',
          lines: [
            N('The sun is going down by the time you are back on the plain. Mufasa walks ahead, and Simba walks in his footprints.'),
            N('Each of the king’s prints is bigger than the whole of Simba. He has to jump from one to the next.'),
            N('You stay well back with your Nubbin. Nobody needs to tell you to.'),
            MU('Simba.', 'think'),
            N('Simba creeps up to him with his ears down.'),
            MU('You disobeyed me. You put Nala in danger. Do you understand what could have happened?', 'angry'),
            SI('I only wanted to be like you. You’d have gone in.', 'sad'),
            MU('Running towards trouble isn’t brave. It’s only running.', 'think'),
            SI('Nothing scares you. Nothing ever has.'),
            MU('When I saw them all round you, I was more frightened than I have ever been.', 'soft'),
          ],
          choices: [
            {
              id: 'stop',
              label: 'Stop walking, so they can go on alone.',
              then: [N('You sit down in the grass. The king glances back once and gives you a small nod.')],
            },
            {
              id: 'hold',
              label: 'Hold your Nubbin a bit tighter.',
              then: [N('It lets you. It doesn’t usually.')],
            },
          ],
        },
        done: {
          id: 'a23-07-dusk-done',
          lines: [N('The two of them stop on a low rise under the first stars. You sit down a little way off, with your Nubbin on your knee.')],
        },
      },
      {
        id: 'a23-07-s2',
        goal: 'Sit a little way off while the king talks with his son under the stars.',
        hint: 'Stay where you are and look up. Your Nubbin will try to count the stars.',
        check: 'sit:a23-stars:rise',
        scene: {
          id: 'a23-07-stars',
          lines: [
            SI('Dad? Were you really frightened?', 'think'),
            MU(LIFT_BRAVE, 'soft'),
            MU('That isn’t the same as never being afraid. Anybody can be fearless, if they never stop to think.'),
            N('Simba thinks about that. Then he pounces on his father’s tail, and the king rolls him over in the grass, and they are both laughing.'),
            SI('Dad? You’ll always be here, won’t you?'),
            N('Mufasa doesn’t answer straight away. He lies down in the grass and looks up.'),
            MU('Look at the stars, Simba.'),
            MU(LIFT_KINGS),
            MU('If ever you can’t find your way, look up. You won’t be the first lion who has.', 'soft'),
            N('Simba looks up. On your knee, your Nubbin looks up too, with its mouth open.'),
            N('It starts counting the stars on its fingers, gives up, and just looks.'),
          ],
          choices: [
            {
              id: 'look',
              label: 'Look up with them.',
              then: [N('The sky is so full of stars it looks as if it might spill. You look for a long time.')],
            },
            {
              id: 'away',
              label: 'Look away, and let them have it to themselves.',
              then: [N('You look at the grass instead. Some moments should only have two people in them.', 'soft')],
            },
            {
              id: 'point',
              label: 'Point out one star to your Nubbin.',
              then: [N('You choose a bright one, low down. Your Nubbin looks at your finger, then at the star, then back at your finger.')],
            },
          ],
        },
      },
    ],
    complete: {
      id: 'a23-07-complete',
      lines: [
        N('Later, at the baobab, Rafiki is waiting up with a pot of tea that has gone cold.'),
        Y('The king said he was frightened today.'),
        RA('Then he is a good king. The ones who are never frightened are the ones to be frightened of.', 'think'),
        RA('Drink your tea. Cold tea is still tea. It is like most things that way.', 'happy'),
        N('Out of the window in the tree, far off on the shady side of the rock, a pair of green eyes is looking at nothing in particular.'),
      ],
    },
    rewards: [],
    sets: { 'a23-07': true },
    childLines: {
      'a23-07-stars#1': 'I was frightened today. Being brave means being frightened and doing the right thing anyway.',
      'a23-07-stars#7': 'Those stars have shone on this plain since long before I was born. They watched over the lions before us.',
    },
    notes:
      'LIFTED TEXT: a23-07-stars#1 and #7 are two of the line’s three copyrighted quotes (Mufasa), each used once, ' +
      'each with a childLines replacement. Staging: the rise is a low hump of grass under a huge starry sky; you sit ' +
      'apart at the left edge of the screen, the lions centre. Keep it quiet: no music cue louder than wind. The ' +
      'green eyes in the complete scene are Scar’s, unexplained.',
  },

  // ---------------------------------------------------------------- A23-8
  {
    id: 'a23-08',
    code: 'A23-8',
    title: 'The Gorge',
    source: src('the stampede in the gorge'),
    audience: 'main',
    trigger: { where: WHERE, when: after('A23-7') },
    requires: ['A23-7'],
    speakers: [ZAZU, RAFIKI, SCAR, SIMBA],
    steps: [
      {
        id: 'a23-08-s1',
        goal: 'Go with Zazu to the rim of the gorge.',
        hint: 'Zazu wants someone sensible within sight of Simba. Keep to the rim path.',
        check: 'walk:a23-gorge:rim',
        scene: {
          id: 'a23-08-rim',
          lines: [
            N('A few days later Zazu lands in the baobab in a flap. Scar has taken Simba down into the gorge, for a surprise.'),
            ZA('A surprise. From Scar. In a gorge. I don’t like any word in that sentence.', 'think'),
            ZA('The king is out on the plain. Come to the rim with me, would you? I want someone sensible within sight of the boy.'),
            RA('Go. Take the small gourd. And keep your small one close.', 'think'),
            N('The gorge is a long crack in the plain with steep sides and a dry riverbed at the bottom.'),
            N('Far below, Simba sits on a rock by himself, practising his roar on a lizard. The lizard is not impressed.'),
            N('On the far rim the grass is moving. Then the ground starts to hum under your boots.'),
            ZA('What is that? What on earth is…', 'shock'),
            N('Over the lip of the gorge comes a herd of wildebeest, hundreds, then thousands, pouring down into the bottom like water.'),
            ZA('They’re coming straight down! And the boy is right at the bottom!', 'shock'),
          ],
          choices: [
            {
              id: 'king',
              label: 'Tell Zazu to fly for the king.',
              then: [ZA('Yes. Yes! Stay here! Don’t you dare go down there!', 'shock'), N('He is gone before you can answer.')],
            },
            {
              id: 'shout',
              label: 'Shout down to Simba to climb.',
              then: [
                N('You shout until your throat hurts. Below, Simba is already climbing: a tiny thing on a dead branch.'),
                N('Zazu has gone, flying for the king as fast as he can.'),
              ],
            },
          ],
        },
        done: {
          id: 'a23-08-rim-done',
          lines: [
            N('Zazu comes back with the king, and with Scar, running along the rim. Mufasa doesn’t stop; he goes straight down into the dust.'),
            N('Zazu flutters over the gorge, shouting directions. Scar is on a ledge just below the rim, watching.'),
            N('Scar flicks out a paw. Zazu hits the rocks below the rim and doesn’t get up.'),
          ],
        },
      },
      {
        id: 'a23-08-s2',
        goal: 'Climb down to Zazu and look after his wing.',
        hint: 'He has fallen on the ledge just below you. Go carefully, and keep your back to the rock.',
        check: 'climb:a23-zazu:ledge',
        scene: {
          id: 'a23-08-zazu',
          lines: [
            N('You go down the rock on your hands and knees, with your Nubbin clinging to your back.'),
            N('Zazu is on a shelf of stone in a heap of feathers. One wing sticks out at the wrong angle.'),
            ZA('The king. Is he… did he… Don’t look at me, look for the king!', 'sad'),
            Y('Hold still.'),
            N('You fold the bad wing in against him, slowly, the way you would a Nubbin’s, and bind it with the string off your gourd.'),
            N('Behind you the dust roars and roars. You don’t turn round, because you are busy and Zazu is shaking.'),
            N('Your Nubbin holds Zazu’s good wing in both hands, as if it could keep him on the ledge by itself.'),
            ZA('He’ll get the boy. He always gets the boy. He always…', 'sad'),
            N('The roaring gets less. Then, quite suddenly, it stops.'),
            N('The quiet is worse.'),
          ],
          choices: [
            {
              id: 'stay',
              label: 'Stay with Zazu.',
              then: [N('You stay. Zazu leans his head on your arm and shuts his eyes.')],
            },
            {
              id: 'look',
              label: 'Stand up and look over.',
              then: [N('The dust is still too thick to see anything. You sit back down beside Zazu.')],
            },
          ],
        },
      },
      {
        id: 'a23-08-s3',
        goal: 'Wait on the ledge with Zazu until the dust settles.',
        hint: 'Stay where you are. There is nothing to be done by running.',
        check: 'wait:a23-dust:ledge',
        scene: {
          id: 'a23-08-dust',
          lines: [
            N('Slowly the dust thins, and the gorge comes back: trampled earth, broken branches, the last of the herd going away.'),
            N('Far below, a small shape lies down beside a big, still one. Then the dust blows across again, and you can’t see.'),
            ZA('No. No, no.', 'sad'),
            N('Scar comes down the rocks the long way, slowly, and stands over the small shape. His voice carries up to you.'),
            SC('Oh, Simba. Look what’s happened.', 'think'),
            SI('I didn’t mean to. I was only on the branch. I didn’t…', 'sad'),
            SC('Of course you didn’t. Nobody ever means to. But the king came down here because of you.'),
            SC('Everyone will know. Your mother will know. Go, Simba. Go far away, before they find out.'),
            N('Zazu tries to stand and can’t. Your Nubbin climbs into his lap and stays there.'),
            N('Down below, Simba looks up at his uncle. Then he begins to back away.'),
          ],
          choices: [
            {
              id: 'call',
              label: 'Call down to Simba.',
              then: [N('Your voice is lost in the gorge. Simba doesn’t look up.')],
            },
            {
              id: 'zazu',
              label: 'Hold on to Zazu.',
              then: [N('You hold him. He is so light, and he is crying without any noise.')],
            },
          ],
        },
      },
    ],
    complete: {
      id: 'a23-08-complete',
      lines: [
        N('Up on the rim, three grey shapes are slinking down the rocks towards the bottom of the gorge.'),
        ZA('Hyenas. He’s set the hyenas on the boy.', 'shock'),
        N('Simba sees them too. He turns and runs.'),
        N('Your Nubbin grips your sleeve so tightly its fingers go white.'),
      ],
    },
    rewards: [],
    sets: { 'a23-08': true },
    notes:
      'CARE (the outline’s care notes, followed exactly). Mufasa’s death is never seen. In step 2 the camera stays ' +
      'on the ledge, close on Zazu, your hands and your Nubbin, with your back to the gorge; the stampede is ' +
      'sound and dust only, and its stopping is the beat. Step 3 has one far-off shot (a23-08-dust#1): a small ' +
      'shape lying down beside a big, still one, very small on screen, then dust across it. No close-up, no body ' +
      'lingered on, no fall shown. Scar’s blame is kept to the film’s weight and no more. Zazu’s wing is bent, ' +
      'never bloody; he is bandaged with the gourd string (your Nubbin’s tiny gourd keeps its own string). ' +
      'Music: none after the stampede until the complete scene.',
  },

  // ---------------------------------------------------------------- A23-9
  {
    id: 'a23-09',
    code: 'A23-9',
    title: 'Run',
    source: src('the hyenas chase Simba out of the Pride Lands'),
    audience: 'all',
    trigger: { where: WHERE, when: after('A23-8') },
    requires: ['A23-8'],
    speakers: [ZAZU, SHENZI, BANZAI],
    steps: [
      {
        id: 'a23-09-s1',
        goal: 'Carry Zazu along the rim after the chase.',
        hint: 'Keep along the rim of the gorge and watch where Simba goes.',
        check: 'carry:a23-zazu:rim',
        scene: {
          id: 'a23-09-chase',
          lines: [
            N('You scoop Zazu up, bad wing and all, and run along the rim after the chase, with your Nubbin bouncing on your back.'),
            N('Below, a small gold shape is scrambling up the side of the gorge, with three grey ones snapping at its heels.'),
            SH('Get him! He’s getting away!', 'angry'),
            N('Simba reaches the top and runs flat out across the plain towards the border, where the thorn bushes grow as thick as walls.'),
            N('He throws himself into the thorns and goes through. The hyenas stop dead at the edge.'),
            BA('In there? I’m not going in there. You go in there.'),
            SH('Then let him go. There’s nothing out there. And if he ever comes back, we’ll be waiting.', 'happy'),
            N('They laugh and lope back towards the rock. Ed laughs loudest.'),
          ],
          choices: [
            {
              id: 'quiet',
              label: 'Keep still until they have gone.',
              then: [N('You crouch in the grass with Zazu against your chest until the laughing is a long way off.')],
            },
            {
              id: 'glare',
              label: 'Glare after them.',
              then: [N('They don’t see it. It makes you feel very slightly better anyway.')],
            },
          ],
        },
        done: {
          id: 'a23-09-chase-done',
          lines: [N('The thorns are still shaking where Simba went through. On the far side there is only dry country, as far as you can see.')],
        },
      },
      {
        id: 'a23-09-s2',
        goal: 'Choose: follow Simba into exile, or carry Zazu home to Rafiki’s tree.',
        hint: 'You can’t do both. Whichever you choose, the page goes on with you.',
        check: 'choose:a23-path:thorns',
        scene: {
          id: 'a23-09-choice',
          lines: [
            N('You stand at the thorns with Zazu in your arms. Behind you are the Pride Lands; in front, a gap where a cub went through.'),
            ZA('Somebody has to go with him. He’s a child. He doesn’t know anything. He doesn’t even know it wasn’t…', 'sad'),
            N('Zazu’s wing is bound, but he can’t fly, and he is shivering in the heat.'),
            ZA('And Rafiki will want to know. Somebody has to tell him. And the queen.'),
            N('Your Nubbin looks at the thorns, then at Zazu, then up at you.'),
            ZA('I can’t choose. I’m only a hornbill. You choose.', 'sad'),
          ],
          choices: [
            {
              id: 'simba',
              label: 'Follow Simba through the thorns.',
              set: { 'a23-path': 'simba' },
              then: [
                ZA('Yes. Go. Put me down under that bush. I’ll limp home. Hornbills are excellent at limping.'),
                N('You leave him in the shade with half the water in your gourd, and push into the thorns after the cub.'),
              ],
            },
            {
              id: 'rafiki',
              label: 'Carry Zazu home to Rafiki’s tree.',
              set: { 'a23-path': 'rafiki' },
              then: [
                ZA('Rafiki. Yes. He’ll know what to do. He always knows. It’s infuriating.', 'sad'),
                N('You turn your back on the thorns. It is the hardest thing you have done in a long while.'),
              ],
            },
          ],
        },
      },
    ],
    complete: {
      id: 'a23-09-complete',
      lines: [
        N('Behind you, the sun is going down red over the gorge.'),
        N('The page lets go of the day very slowly, as if it, too, wishes it hadn’t happened.'),
        N('Whichever way you chose, you will think about the other way for a long time.'),
        N('Your Nubbin has its hand in yours. It doesn’t let go once.'),
      ],
    },
    rewards: [],
    sets: { 'a23-09': true },
    notes:
      'SIGNATURE CHOICE (a23-path, a23-09-choice). simba: you follow Simba into exile; rafiki: you carry Zazu home. ' +
      'It picks the scenes of A23-10, A23-11 and A23-13 and the opening and close of A23-12 (all in A23_VARIANTS for ' +
      'rafiki), and your place at the last presentation in A23-16 (seven quests later). The choice is final for this ' +
      'page; it is never asked again. The hyenas never touch Simba; the thorns are a wall he slips through. ' +
      'Both choices are honourable: nobody in the page ever says you chose wrong.',
  },

  // ---------------------------------------------------------------- A23-10
  {
    id: 'a23-10',
    code: 'A23-10',
    title: 'The Desert',
    source: src('Simba in the desert, Timon and Pumbaa; Scar takes the throne'),
    audience: 'all',
    trigger: { where: WHERE, when: after('A23-9') },
    requires: ['A23-9'],
    speakers: [SIMBA, TIMON, PUMBAA, RAFIKI, ZAZU],
    steps: [
      {
        id: 'a23-10-s1',
        goal: 'Get through the first long day after the gorge.',
        hint: 'Stay with whoever you chose to stay with. Walk when they walk, and rest when they rest.',
        check: 'walk:a23-long-day:after-gorge',
        scene: {
          id: 'a23-10-desert',
          lines: [
            N('Beyond the thorns the ground goes from grass to scrub to nothing: just orange sand, and the sun sitting on it.'),
            N('Simba walks ahead of you and doesn’t look back. When you catch him up, he won’t look at you either.'),
            SI('Go home. You don’t have to come. Nobody has to come.', 'sad'),
            Y('I know.'),
            N('You keep walking beside him anyway. After a while he stops telling you to go.'),
            N('Your Nubbin walks in Simba’s footprints, the way Simba walked in his father’s, jumping from one to the next.'),
            N('By noon there is no shade anywhere. You give Simba the last drop from your gourd, and then there is no water either.'),
            N('He walks until he can’t, and then he lies down in the sand.'),
          ],
          choices: [
            {
              id: 'shade',
              label: 'Make shade over him with your coat.',
              then: [N('You hold your coat up over him. It isn’t much, but it is a square of shade, and he crawls into it.')],
            },
            {
              id: 'sit',
              label: 'Sit down next to him and wait.',
              then: [N('You sit down next to him, and wait. He puts his chin on your boot.', 'soft')],
            },
          ],
        },
        done: {
          id: 'a23-10-desert-done',
          lines: [
            N('Above you, shapes begin to circle: vultures, big and patient, riding the hot air round and round.'),
            N('Your Nubbin stands up on Simba’s back and shakes its tiny gourd at them, furiously. It doesn’t help, but it is very brave.'),
          ],
        },
      },
      {
        id: 'a23-10-s2',
        goal: 'See the evening in, whatever it brings.',
        hint: 'Stay close. Help is coming, one way or another.',
        check: 'wait:a23-dusk:after-gorge',
        scene: {
          id: 'a23-10-help',
          lines: [
            N('Then, from the scrub, there is a shout, and a warthog comes charging out of it with a meerkat on his back.'),
            TI('Charge! Get out of here, you feathery freeloaders! Shoo! Go and bother a rhinoceros!', 'angry'),
            N('The vultures scatter. The warthog skids to a halt beside you, puffing, and the meerkat hops down.'),
            PU('Oh, look, Timon. A little lion. He’s so tiny. And somebody with him. And a…', 'happy'),
            TI('A what? What is that? Is it a mushroom? Is it a dumpling?', 'think'),
            PU('I think it’s a friend.'),
            TI('Pumbaa, that’s a lion. Lions are the reason guys like us live in holes. Well, guys like me. You don’t fit.'),
            PU('But he’s so little. And he’s all alone. Except for them. Can we keep him?', 'sad'),
            TI('Pumbaa, are you out of your mind? …Fine. Fine! But I’m not carrying him.'),
          ],
          choices: [
            {
              id: 'thank',
              label: 'Thank them.',
              then: [TI('Don’t thank us. Thanking is how they get you. Next thing you know, you owe somebody.')],
            },
            {
              id: 'guest',
              label: 'Explain that you’re only a guest here.',
              then: [PU('That’s okay. Everybody’s a guest somewhere.', 'happy')],
            },
          ],
        },
      },
    ],
    complete: {
      id: 'a23-10-complete',
      lines: [
        N('Pumbaa carries Simba on his back to a shady bank by a stream. You carry your Nubbin, and Timon carries nothing at all.'),
        N('Simba drinks and drinks. Then he sits with his back to everyone.'),
        TI('So, kid. What’s your story?'),
        SI('I don’t have one. Not any more.', 'sad'),
        TI('No story! Great! Neither have we. Well, we have one, but it’s mostly about bugs.', 'happy'),
        PU('Did something happen, kid?'),
        SI('Yes. It was my fault. Please don’t ask me.', 'sad'),
        N('Pumbaa looks at you. You shake your head, very slightly, and he doesn’t ask again.'),
      ],
    },
    rewards: [],
    sets: { 'a23-10': true },
    notes:
      'BRANCHED by a23-path (set in A23-9). The scenes shown are for simba: the desert, the vultures, Timon and ' +
      'Pumbaa. For rafiki play A23_VARIANTS in place of each: a23-10-desert-rafiki for a23-10-desert, ' +
      'a23-10-desert-done-rafiki for a23-10-desert-done, a23-10-help-rafiki for a23-10-help, and ' +
      'a23-10-complete-rafiki for a23-10-complete. The goals, hints and checks are written to fit both paths. ' +
      'Rafiki path: he grieves and wipes the cub off his wall; Scar takes the rock and lets the hyenas in; Zazu ' +
      'walks back to the rock out of duty. SWAHILI: pole sana (rafiki path; adviser). The vultures never land.',
  },

  // ---------------------------------------------------------------- A23-11
  {
    id: 'a23-11',
    code: 'A23-11',
    title: 'No Worries',
    source: src('Simba grows up with Timon and Pumbaa; the Pride Lands fail under Scar'),
    audience: 'all',
    trigger: { where: WHERE, when: after('A23-10') },
    requires: ['A23-10'],
    speakers: [TIMON, PUMBAA, SIMBA, RAFIKI, SARABI, SCAR, NALA],
    steps: [
      {
        id: 'a23-11-s1',
        goal: 'Live through the long seasons that come next.',
        hint: 'The page turns the years over for you. Stay with whoever you are with.',
        check: 'wait:a23-years:after-gorge',
        scene: {
          id: 'a23-11-oasis',
          lines: [
            N('Timon and Pumbaa live in a green place beyond the desert: waterfalls, ferns, logs, and more bugs than seems reasonable.'),
            TI('Make yourself at home. Our home, technically. Look at this log. Is that a log, or is that a log?', 'happy'),
            PU('It’s a log.'),
            TI('Kid, listen. Bad thing happened? Fine. Don’t look at it. Look at something else. Look at the log.'),
            PU('Hakuna matata.'),
            SI('What?'),
            PU('Hakuna matata. It’s Swahili. Folks say it when the fruit falls off the tree before you can catch it. Roughly: no worries.', 'happy'),
            TI('We say it all the time. Bug in your ear? Hakuna matata. Rain? Hakuna matata. Stuck in a hole? Well. That one’s trickier.'),
            N('Simba says it to himself under his breath, trying it out. It is the first time since the gorge you have seen him smile.'),
            N('Your Nubbin says nothing, of course. But it lies down on the log next to Simba, and that seems to help.'),
          ],
          choices: [
            {
              id: 'say',
              label: 'Try saying it yourself.',
              then: [PU('Perfect! You’re a natural! No worries at all!', 'happy'), N('That isn’t true, but it is nice to hear.')],
            },
            {
              id: 'watch',
              label: 'Keep quiet and watch Simba.',
              then: [N('He’s smiling. It doesn’t quite reach his eyes yet.')],
            },
          ],
        },
        done: {
          id: 'a23-11-oasis-done',
          lines: [
            N('The page turns its seasons over, one after another, like somebody leafing through a book to find their place.'),
            N('Simba gets bigger, and so do his paws. A mane comes in, scruffy at first, then thick and dark gold.'),
            N('You and your Nubbin don’t change at all. The atlas keeps your time for you, and nobody here seems to mind.'),
          ],
        },
      },
      {
        id: 'a23-11-s2',
        goal: 'See what supper looks like now.',
        hint: 'Go where the others are gathering, and take what you’re offered.',
        check: 'feed:a23-supper:after-gorge',
        scene: {
          id: 'a23-11-grubs',
          lines: [
            N('Supper is under a log. Pumbaa rolls it over, and underneath is a wriggling crowd of grubs, beetles and worse.'),
            TI('The slimy ones are tasty. The crunchy ones are… also tasty. They’re all tasty, if you don’t think about it.', 'happy'),
            SI('You get used to it. Honestly.'),
            N('Simba, grown now, slurps up a long pink worm the way his father might have taken a bite of antelope.'),
            N('Your Nubbin looks at the grub Pumbaa is offering it. It looks at you.'),
            N('Then it turns its back on the grub, folds its arms, and sits down with a thump.'),
            PU('That’s okay, little guy. More for me.', 'happy'),
            TI('Picky. I respect that. A creature with standards.'),
          ],
          choices: [
            {
              id: 'fig',
              label: 'Find your Nubbin a fig instead.',
              then: [N('You find a wild fig in the ferns. Your Nubbin eats the whole thing, then looks at the grubs smugly.')],
            },
            {
              id: 'try',
              label: 'Try a grub yourself, to be polite.',
              then: [
                N('It’s crunchy, and then it’s something else. You swallow anyway.'),
                TI('Look at that face! That’s the face of someone who’s gonna love bugs!', 'happy'),
              ],
            },
          ],
        },
      },
    ],
    complete: {
      id: 'a23-11-complete',
      lines: [
        N('That night the four of you lie on your backs on a log and look up at the stars.'),
        PU('I always thought they were other warthogs’ campfires. Far away. Having a nice time.', 'happy'),
        SI('Somebody told me once that they’re all the old kings. Up there. Keeping an eye on things.', 'think'),
        TI('Kings? In the sky? Who’s been feeding you that?'),
        SI('Nobody. It doesn’t matter.', 'sad'),
        N('He turns over, away from the sky. Your Nubbin keeps looking at the stars long after everyone else has stopped.'),
      ],
    },
    rewards: [],
    sets: { 'a23-11': true },
    notes:
      'BRANCHED by a23-path. The scenes shown are for simba. For rafiki play A23_VARIANTS: a23-11-oasis-rafiki for ' +
      'a23-11-oasis, a23-11-oasis-done-rafiki for a23-11-oasis-done, a23-11-grubs-rafiki for a23-11-grubs, and ' +
      'a23-11-complete-rafiki for a23-11-complete (Nala slips away, and Rafiki sends you with her). NO SONG: the ' +
      'years pass as narration only (the film’s number is not used, nor its log-walk staging). HAKUNA MATATA: ' +
      'the ordinary Swahili phrase, glossed by Pumbaa; it is never sung, never a title, never on a reward. ' +
      'Simba is drawn grown from a23-11-oasis-done#1 on. Your Nubbin refuses every grub (an idle animation, arms ' +
      'folded). SWAHILI: hakuna matata; rafiki path asante, polepole (adviser).',
  },

  // ---------------------------------------------------------------- A23-12
  {
    id: 'a23-12',
    code: 'A23-12',
    title: 'Nala',
    source: src('Nala finds Simba in the jungle'),
    audience: 'all',
    trigger: { where: WHERE, when: after('A23-11') },
    requires: ['A23-11'],
    speakers: [PUMBAA, TIMON, SIMBA, NALA],
    steps: [
      {
        id: 'a23-12-s1',
        goal: 'Be there when the hunter in the long grass finds the warthog.',
        hint: 'Keep near the stream at the edge of the green place, and keep your Nubbin close.',
        check: 'explore:a23-oasis:stream',
        scene: {
          id: 'a23-12-hunt',
          lines: [
            N('One afternoon Pumbaa is snuffling for beetles by the stream when he stops with one ear up.'),
            PU('Did anybody else hear a… swishy noise? A big swishy noise?', 'think'),
            N('The long grass on the far bank is moving against the wind. Your Nubbin goes rigid on your shoulder.'),
            N('A lioness comes out of the grass at a run, low and fast, straight at Pumbaa.'),
            PU('Aaagh! She’s gonna eat me!', 'shock'),
            TI('Hey! Not him! Eat… eat the guest! Eat the dumpling!', 'shock'),
            N('Simba comes crashing out of the ferns and meets her in mid-leap. They roll over and over in the mud.'),
            N('She pins him. She knows exactly where to put her paws, and she has pinned him like that before.'),
            SI('Nala?', 'shock'),
          ],
          choices: [
            {
              id: 'hold',
              label: 'Hold on to your Nubbin.',
              then: [N('It wants to go and help. You hold on to it anyway.')],
            },
            {
              id: 'pumbaa',
              label: 'Pull Pumbaa out of the way.',
              then: [PU('My hero!', 'happy'), N('He hugs you. He is very heavy.')],
            },
          ],
        },
        done: {
          id: 'a23-12-hunt-done',
          lines: [
            NA('Simba? It is you! But everyone thinks you’re…', 'shock'),
            N('Then she sees you, standing in the stream with your Nubbin, and her eyes go wide all over again.'),
            NA('Rafiki’s guest? You’ve been with Simba? All this time, and nobody on the rock knew?'),
          ],
        },
      },
      {
        id: 'a23-12-s2',
        goal: 'Give Simba and Nala some room, and stay within call.',
        hint: 'Wait by the waterfall with Timon and Pumbaa. This is between the two of them.',
        check: 'wait:a23-waterfall:oasis',
        scene: {
          id: 'a23-12-talk',
          lines: [
            N('The two lions walk off along the stream together, shoulders touching. Timon watches them go with his mouth open.'),
            TI('I don’t like where this is going. She’s gonna take him away. I can feel it in my fur.', 'sad'),
            PU('Maybe she’s nice.'),
            TI('That’s worse!'),
            N('Later, under the waterfall, you hear them talking. Their voices carry over the water whether you want them to or not.'),
            NA('The herds are gone. The river’s mud. Scar sits on the rock, and the hyenas eat whatever’s left. We’re hungry, Simba. All of us.', 'sad'),
            SI('I can’t go back.', 'sad'),
            NA('Why not? It’s yours. It was always going to be yours.'),
            SI('Not any more. Anyway, it doesn’t matter. Hakuna matata.', 'angry'),
            NA('What?'),
            SI('No worries. You stop thinking about the things you can’t change. It’s easier.'),
            NA('I used to think you’d be better at this than anyone.', 'sad'),
          ],
          choices: [
            {
              id: 'stay',
              label: 'Stay with Timon and Pumbaa, and let them talk.',
              then: [N('Pumbaa hands you a beetle, as comfort. You hold it, as comfort.')],
            },
            {
              id: 'nubbin',
              label: 'Let your Nubbin go to Nala.',
              then: [N('It trots over and sits down beside her. She puts a paw round it without looking, the way you would with a cub.', 'soft')],
            },
          ],
        },
      },
    ],
    complete: {
      id: 'a23-12-complete',
      lines: [
        A12_BACK,
        NA('Tell him. You were there. Tell him he has to come home.', 'angry'),
        SI('Leave them out of this.'),
        N('He walks off into the dark, alone, with his head down. After a moment, you follow.'),
        TI('Kid! Where you going? Hakuna matata! …Hakuna a little bit of matata?', 'sad'),
      ],
    },
    rewards: [],
    sets: { 'a23-12': true },
    notes:
      'SHARED, with a branched opening and close (a23-path). The scenes shown are for simba. For rafiki play ' +
      'A23_VARIANTS a23-12-hunt-rafiki in place of a23-12-hunt (you arrive with Nala across the desert), ' +
      'a23-12-hunt-done-rafiki in place of a23-12-hunt-done, and a23-12-complete-rafiki in place of ' +
      'a23-12-complete (Nala sends you back to tell Rafiki). Step 2 is the same on both paths. Nala is drawn grown. ' +
      'Nala’s pounce is a playful wrestle, not a fight. The film’s dialogue for this scene is not used.',
  },

  // ---------------------------------------------------------------- A23-13
  {
    id: 'a23-13',
    code: 'A23-13',
    title: 'The Wind',
    source: src('the dust on the wind, and Rafiki’s discovery'),
    audience: 'all',
    trigger: { where: WHERE, when: after('A23-12') },
    requires: ['A23-12'],
    speakers: [SIMBA, RAFIKI],
    steps: [
      {
        id: 'a23-13-s1',
        goal: 'Get through the night after Nala’s news.',
        hint: 'Keep going. Stay with whoever needs you most tonight.',
        check: 'walk:a23-night:after-nala',
        scene: {
          id: 'a23-13-ridge',
          lines: [
            N('Simba walks until the trees thin out, then climbs a bare ridge above the green place. You climb after him.'),
            N('The sky up here is enormous, and every star is out. He doesn’t look up at any of them.'),
            SI('You were there. At the gorge. You know what I did.', 'sad'),
            Y('I saw Scar. I didn’t see what happened down below.'),
            SI('It doesn’t matter. He’s gone, and it was my fault, and nothing changes it. So why go back?', 'angry'),
            SI('You said to look up if I ever got lost. Well, I’m lost. Where are you?', 'sad'),
            N('He isn’t talking to you any more. He’s talking to the sky.'),
            N('Then he throws himself down on the ridge with a thump.'),
          ],
          choices: [
            {
              id: 'wait',
              label: 'Sit down next to him and wait.',
              then: [N('You sit down next to him, and he doesn’t tell you to go. That is something.', 'soft')],
            },
            {
              id: 'fault',
              label: 'Tell him it wasn’t his fault.',
              then: [
                SI('You don’t know that. You weren’t looking. You said so.', 'sad'),
                N('He’s right: you weren’t. You don’t take it back, though.'),
              ],
            },
          ],
        },
        done: {
          id: 'a23-13-ridge-done',
          lines: [N('A puff of dust and loose fur goes up from where he landed. The wind catches it.')],
        },
      },
      {
        id: 'a23-13-s2',
        goal: 'Watch where the wind goes.',
        hint: 'Keep still, and follow the dust with your eyes.',
        check: 'watch:a23-wind:night',
        scene: {
          id: 'a23-13-wind',
          lines: [
            N('The little cloud of fur and dust lifts off the ridge, turns over once, and goes up into the night.'),
            N('It drifts out over the green place and the desert beyond it, getting smaller, heading the way you came.'),
            N('Your Nubbin stands on its toes and watches it until it is only a dot against the stars, and then not even that.'),
            SI('What are you looking at?', 'think'),
            N('You don’t really know. Simba doesn’t ask again; he has gone back to not looking at anything.'),
            N('The wind smells of dust and, very faintly, of home.'),
          ],
          choices: [
            {
              id: 'nubbin',
              label: 'Watch it go with your Nubbin.',
              then: [N('You watch together until there is nothing left to watch, and then a little longer.')],
            },
            {
              id: 'simba',
              label: 'Watch Simba instead.',
              then: [N('He’s pretending to be asleep. He isn’t very good at it.')],
            },
          ],
        },
      },
    ],
    complete: {
      id: 'a23-13-complete',
      lines: [
        N('Late in the night, from down in the ferns, comes a noise. Somebody is humming, very badly, and getting closer.'),
        N('Then a voice, cheerful and slightly mad, from the top of a tree.'),
        RA('There you are! I have been looking all over the page for you. You and your small one. Asante, for staying with him.', 'happy'),
        N('Rafiki: older, greyer, with burrs in his beard from crossing the desert.'),
        Y('How did you find us?'),
        RA('The wind told me. The wind is a terrible gossip.', 'happy'),
      ],
    },
    rewards: [],
    sets: { 'a23-13': true },
    notes:
      'BRANCHED by a23-path. The scenes shown are for simba: you watch the dust go, and Rafiki finds you in the ' +
      'night. For rafiki play A23_VARIANTS: a23-13-ridge-rafiki for a23-13-ridge (you reach the baobab with the ' +
      'news), a23-13-ridge-done-rafiki for a23-13-ridge-done, a23-13-wind-rafiki for a23-13-wind (the dust ' +
      'reaches the tree; Rafiki sniffs it, laughs, and paints a mane on the cub), and a23-13-complete-rafiki for ' +
      'a23-13-complete (you set off together). Rafiki’s humming is wordless and our own (none of the film’s ' +
      'chants). The dust cloud is one small particle puff, tracked by the camera until it leaves the frame.',
  },

  // ---------------------------------------------------------------- A23-14
  {
    id: 'a23-14',
    code: 'A23-14',
    title: 'Look Harder',
    source: src('Rafiki leads Simba to the pool; Mufasa in the clouds'),
    audience: 'all',
    trigger: { where: WHERE, when: after('A23-13') },
    requires: ['A23-13'],
    speakers: [RAFIKI, SIMBA, MUFASA],
    steps: [
      {
        id: 'a23-14-s1',
        goal: 'Watch Rafiki find Simba in the green place.',
        hint: 'Stay back among the ferns. Rafiki has his own way of doing this.',
        check: 'watch:a23-rafiki:oasis',
        scene: {
          id: 'a23-14-find',
          lines: [
            N('In the morning Simba is sitting by himself at the edge of the trees. Rafiki walks up and sits down beside him.'),
            N('He doesn’t say anything at all. He picks a burr out of his beard and looks at the view.'),
            SI('What? Who are you? What do you want?', 'angry'),
            RA('Nothing. I am sitting. You can sit too. It is free.'),
            N('Simba gets up and moves along. Rafiki gets up, moves along with him, and sits down again.'),
            SI('Stop following me.', 'angry'),
            RA('I am not following you. I am sitting next to you. It is very different. Ask anyone.', 'happy'),
            N('This goes on for some time. You begin to see why Rafiki has never needed to lock his door.'),
            SI('…I know you. You’re the old one from the baobab. The one who painted things. Rafiki.', 'think'),
            RA('And I know you. You are Mufasa’s boy. Would you like to see your father?'),
            SI('My father is gone.', 'sad'),
            RA('Is he? Come with me, and we will look.'),
          ],
          choices: [
            {
              id: 'ferns',
              label: 'Stay back in the ferns.',
              then: [N('You stay where you are. This one isn’t yours to do.', 'soft')],
            },
            {
              id: 'sit',
              label: 'Let your Nubbin go and sit with them too.',
              then: [N('It goes and sits on Simba’s other side. Surrounded by people sitting, he gives up.', 'happy')],
            },
          ],
        },
        done: {
          id: 'a23-14-find-done',
          lines: [N('Rafiki sets off into the trees at a run, very fast for someone so old. Simba goes after him, and so do you.')],
        },
      },
      {
        id: 'a23-14-s2',
        goal: 'Follow Rafiki through the roots to the still pool.',
        hint: 'Keep up with him through the tangle. Duck under the roots and listen for his stick.',
        check: 'explore:a23-roots:pool',
        scene: {
          id: 'a23-14-pool',
          lines: [
            N('He leads you through a tangle of roots and creepers, under, over and through, until the trees open on a small round pool.'),
            N('The water is perfectly still. It holds the whole sky, and the sky is clouding over.'),
            RA('Shh. Look down. There. Into the water.'),
            N('Simba looks. He sees himself: a grown lion with an untidy mane and tired eyes.'),
            SI('It’s only me. A tired lion in a puddle.', 'sad'),
            RA('Then you are not looking properly. Again. Slower.', 'think'),
            N('Rafiki touches the water with one finger. The ripples run out, and slow, and settle.'),
            N('And as they settle, the face in the water changes: older, broader, a darker mane. A face you knew.'),
            RA('You see? He did not go anywhere. You have been carrying him about with you all along.', 'soft'),
            N('Your Nubbin leans over the edge and sees only itself, with a red mark on its brow. It looks for a long time anyway.'),
          ],
          choices: [
            {
              id: 'look',
              label: 'Look into the pool yourself.',
              then: [N('You see your own face, and the sky behind it, going grey and moving fast.')],
            },
            {
              id: 'simba',
              label: 'Keep watching Simba.',
              then: [N('Simba is holding his breath. He doesn’t want the water to move.')],
            },
          ],
        },
      },
      {
        id: 'a23-14-s3',
        goal: 'Look up at the clouds.',
        hint: 'Stand still and look up. Don’t say anything.',
        check: 'watch:a23-clouds:pool',
        scene: {
          id: 'a23-14-clouds',
          lines: [
            N('A wind comes. The clouds over the pool pile up and turn, and catch the light from somewhere far above them.'),
            N('Out of the cloud comes a shape: a great head, a mane of light, eyes like the sun through rain.'),
            SI('Father?', 'shock'),
            MU('Simba.', 'soft'),
            SI('I’m sorry. I can’t go back. I’ve been happy out here. Mostly. Nearly.', 'sad'),
            MU('You have been sad for a long time, and you have called it peace.', 'think'),
            MU('One terrible day is not the whole of you. You are my son. You have always been my son.'),
            MU(LIFT_REMEMBER, 'soft'),
            SI('Wait. Wait, please. Stay a little longer.', 'sad'),
            N('The voice comes once more, faint and very far off. Then the clouds are only clouds.'),
          ],
        },
        done: {
          id: 'a23-14-clouds-done',
          lines: [
            N('Simba stands still in the wind, looking at the place where the clouds were. Rafiki doesn’t hurry him.'),
            N('Your Nubbin looks up at the clouds for a long time. It doesn’t stop until long after the sky is plain again.'),
          ],
        },
      },
    ],
    complete: {
      id: 'a23-14-complete',
      lines: [
        SI('If I go home, everyone will look at me and know.', 'think'),
        N('Rafiki raps him smartly on the head with his stick: not hard, but hard enough.'),
        SI('Ow!', 'angry'),
        RA('That was a moment ago. Does it still sting?'),
        SI('Yes. Obviously.'),
        RA('Then a thing that happened does not stay where you left it. You can carry it, or it can chase you.', 'think'),
        RA('Only one of those lets you see where you are going.'),
        N('Rafiki swings the stick again. This time Simba ducks.'),
        RA('Ha! You see? You learn.', 'happy'),
        N('Simba looks once at the sky, then towards the desert and the grey plain beyond it. Then he starts to run.'),
      ],
    },
    rewards: [],
    sets: { 'a23-14': true },
    childLines: {
      'a23-14-clouds#7': 'Go home, my son. The ones who love you are waiting, and you belong with them.',
    },
    notes:
      'SHARED on both paths (on the rafiki path you arrived with Rafiki; on the simba path he found you in the ' +
      'night). LIFTED TEXT: a23-14-clouds#7 is the line’s third copyrighted quote (Mufasa), used once, with a ' +
      'childLines replacement. The film’s other dialogue here is not used; Rafiki’s lesson with the stick is in ' +
      'our own words. Rafiki acts out the third rule in step 1 (he sits down next to Simba and waits); it is never ' +
      'quoted. CAMPAIGN READ: if the campaign is finished (CampaignState.ending set, so Hazel’s walk up the hill ' +
      'has played), play A23_VARIANTS a23-14-clouds-done-after in place of a23-14-clouds-done: your Nubbin looks ' +
      'from the clouds to you, and Rafiki puts a hand on your shoulder and says nothing. Hazel never appears and ' +
      'is never named. Mufasa in the clouds is drawn in the licensed style, soft and golden, never frightening. ' +
      'HAZEL’S MARGIN NOTE (s24Done, read-only): if s24Done is set when a23-14-complete ends, play A23_VARIANTS ' +
      'a23-margin-hazel straight after it; otherwise it plays the first time the atlas is open at this page’s pool after ' +
      's24Done is set. From then on the note is drawn in pencil in the margin beside the pool. Its text matches S24’s notes ' +
      'exactly.',
  },

  // ---------------------------------------------------------------- A23-15
  {
    id: 'a23-15',
    code: 'A23-15',
    title: 'Home',
    source: src('Simba returns to Pride Rock and faces Scar'),
    audience: 'main',
    trigger: { where: WHERE, when: after('A23-14') },
    requires: ['A23-14'],
    speakers: [SIMBA, NALA, TIMON, PUMBAA, SHENZI, BANZAI, ZAZU, SARABI, SCAR, RAFIKI],
    steps: [
      {
        id: 'a23-15-s1',
        goal: 'Cross back into the Pride Lands.',
        hint: 'Follow Simba across the desert. Nala, Timon and Pumbaa are coming too.',
        check: 'walk:a23-pride-lands:desert',
        scene: {
          id: 'a23-15-grey',
          lines: [
            N('You come back over the desert at a run: Simba first, then Nala, Timon and Pumbaa, then you, then Rafiki’s dust far behind.'),
            N('The Pride Lands are bare: no grass, no herds, no birds. Old bones lie about in the dust, and the sky is grey.'),
            SI('This was green. All of this. As far as the light went.', 'sad'),
            NA('I told you.'),
            N('Your Nubbin climbs your back and looks out over it. It doesn’t point at anything; there is nothing to point at.'),
            N('Up at the rock, hyenas lie about in the shade. There are far too many of them between you and the top.'),
            SI('I need a way past them.', 'think'),
            TI('Oh, I see where this is going. Bait. You want us to be bait.', 'shock'),
            PU('I could be bait. I’m very good at being chased.', 'happy'),
          ],
          choices: [
            {
              id: 'bait',
              label: 'Offer to help with the distraction.',
              then: [TI('A volunteer! Okay. You and the dumpling, follow my lead. Look tasty.', 'happy')],
            },
            {
              id: 'zazu',
              label: 'Say you’ll free Zazu while they’re busy.',
              then: [NA('He’s up by Scar’s place, in a cage of old bones. Go round the back way. I’ll show you.')],
            },
          ],
        },
      },
      {
        id: 'a23-15-s2',
        goal: 'Draw off the hyenas, and get Zazu out of his cage.',
        hint: 'Keep the hyenas looking at Timon and Pumbaa. Slip round the back of the rock while they do.',
        check: 'carry:a23-zazu:back-path',
        scene: {
          id: 'a23-15-show',
          lines: [
            N('Timon walks out into the open in front of the hyenas, coughs, and holds up a paw for silence.'),
            TI('Ladies and gentlehyenas! Tonight only! Sick of bones? Have I got a warthog for you!', 'happy'),
            N('Pumbaa trots out behind him with his tail up, does a little twirl, and lies down with his legs in the air.'),
            SH('Is that… a warthog?', 'think'),
            BA('Is it, like, a free warthog?'),
            TI('Fresh! Juicy! Only slightly used! And look, he comes with a side dish!'),
            N('Your Nubbin, who has been told to look tasty, sits on Pumbaa’s tummy and does its very best.'),
            N('Every hyena on the rock gets up at once. Pumbaa gets up faster, and then everybody is running.'),
            N('While they run, you go round the back of the rock with Nala, to the place where Scar keeps his court.'),
            N('Zazu is in a cage made of old ribs, tied with dried grass. When he sees you he goes perfectly still.'),
            ZA('You. Oh, you. I knew someone would come. I didn’t know it would take this long.', 'happy'),
          ],
          choices: [
            {
              id: 'untie',
              label: 'Untie the cage.',
              then: [N('The knots are dried hard. Your Nubbin turns up, puffing from the chase, and picks the last one with its teeth.')],
            },
            {
              id: 'hush',
              label: 'Tell him to keep his voice down.',
              then: [ZA('I am keeping it down. This is down. You should hear me when it’s up.', 'angry')],
            },
          ],
        },
        done: {
          id: 'a23-15-show-done',
          lines: [ZA('The queen. He’s shouting at the queen. Hurry!', 'shock')],
        },
      },
      {
        id: 'a23-15-s3',
        goal: 'Stand with the pride on the rock while Simba faces Scar.',
        hint: 'Stay with Nala and the lionesses. This is Simba’s to do, but they need to see you standing.',
        check: 'watch:a23-scar:pride-rock',
        scene: {
          id: 'a23-15-rock',
          lines: [
            N('At the top of the rock, Scar is shouting at Sarabi. She stands in front of him with her head up.'),
            SB('There is nothing left, Scar. We have to leave.', 'angry'),
            SC('We go nowhere!', 'angry'),
            N('He strikes her, and she stumbles in the dust. On the far side of the rock, lightning finds a dead tree, and the grass catches.'),
            N('Out of the smoke walks a lion with a dark gold mane. For a moment everyone on the rock thinks they are seeing a ghost.'),
            SB('Mufasa?', 'shock'),
            SI('No, Mother. Only me.'),
            SC('Simba. Well. How unexpected. How touching.', 'think'),
            SC('Why don’t you tell them, Simba? Tell your mother why the king came down into that gorge.'),
            SI('…Because of me. It was my fault.', 'sad'),
            N('The lionesses go quiet. Scar walks Simba backwards, step by step, until his back paws slip off the edge of the rock.'),
            N('Scar leans down over him and whispers something only Simba can hear.'),
            N('Simba’s eyes go very wide. Then he comes up over the edge like a storm.'),
            SI('Say it. Say it so they can all hear.', 'angry'),
            SC('…It was me. Not the boy. Me.', 'shock'),
          ],
          choices: [
            {
              id: 'sarabi',
              label: 'Go to Sarabi.',
              then: [N('You help her up. She is thin and singed and furious, and she does not need help, and she takes it anyway.')],
            },
            {
              id: 'cubs',
              label: 'Get the young cubs behind a boulder.',
              then: [N('You herd the two smallest cubs behind a boulder with your Nubbin. They are too frightened to argue.')],
            },
          ],
        },
        done: {
          id: 'a23-15-rock-done',
          lines: [
            N('The lionesses come forward all at once, and the hyenas come back up the rock. Then there is fire everywhere, and noise.'),
            N('You keep the young cubs behind a boulder with Zazu and your Nubbin, and you don’t look. Nobody would blame you.'),
          ],
        },
      },
    ],
    complete: {
      id: 'a23-15-complete',
      lines: [
        N('At the very top of the rock, in the smoke, two shapes stand against the fire: one dark, one gold.'),
        N('Then the dark one is gone over the edge, down into the shadow where the hyenas are waiting.'),
        N('Nobody sees what happens down there. The smoke closes over it, and the hyenas’ laughing stops.'),
        N('Simba comes down from the top of the rock, singed and very tired, and stands in front of his mother.'),
        SB('Simba. Listen to me.', 'soft'),
        SB('It was never your fault. Not for one moment. Do you hear me? Never.', 'soft'),
        N('Simba puts his head down against hers, the way he did when he was small enough to fit under her chin.'),
        RA('Ha! Late again. I miss all the fighting. That is the secret of a long life.', 'happy'),
      ],
    },
    rewards: [],
    sets: { 'a23-15': true },
    notes:
      'SHARED on both paths. NO SONG: the hyena decoy is a ridiculous show in our own words (no hula, no luau, no ' +
      'number from the film). CARE: Sarabi is struck once, in one line, and stumbles; she is not hurt on screen. ' +
      'Scar’s whisper is never voiced; only its effect is shown, and he then says the truth aloud in our own ' +
      'words. The fight is fire, smoke and silhouettes, seen from behind the boulder. Scar’s end is offscreen: he ' +
      'goes over the edge into shadow and smoke, and the hyenas’ laughing stops; nothing is shown or described. ' +
      '“It was never your fault” lands plainly (a23-15-complete#5), as the outline’s care notes ask. On the simba ' +
      'path Zazu limped home after A23-9; on the rafiki path he walked back in A23-10; either way Scar caged him.',
  },

  // ---------------------------------------------------------------- A23-16
  {
    id: 'a23-16',
    code: 'A23-16',
    title: 'The Rains',
    source: src('the rains, Simba’s roar, and the new cub’s presentation'),
    audience: 'all',
    trigger: { where: WHERE, when: after('A23-15') },
    requires: ['A23-15'],
    speakers: [RAFIKI, TIMON, PUMBAA, ZAZU, NALA, SIMBA],
    steps: [
      {
        id: 'a23-16-s1',
        goal: 'Stand in the first rain on Pride Rock.',
        hint: 'Stay out in the open. Let it rain on you.',
        check: 'wait:a23-rain:pride-rock',
        scene: {
          id: 'a23-16-rain',
          lines: [
            N('The first drop lands on your nose. The next lands on your Nubbin’s head, where it sits and looks surprised.'),
            N('Then the sky opens, and it rains as though it had been saving up for years.'),
            RA('Mvua! Mvua! Rain!', 'happy'),
            N('Rafiki dances in it with his stick over his head and his beard dripping. Pumbaa lies down in the first puddle with a happy groan.'),
            N('The fires hiss and go out, one by one, and steam comes up off the rock.'),
            N('Zazu stands in the rain with his bad wing held out, letting it wash. For the first time since the gorge he looks quite cheerful.'),
            TI('Is this it? Is this the happy ending? Somebody tell me, so I can cry properly.', 'happy'),
            N('Your Nubbin splashes in every puddle on the rock, one after another, so that none of them feels left out.'),
          ],
          choices: [
            {
              id: 'dance',
              label: 'Dance with Rafiki.',
              then: [RA('Yes! Badly! It is the only way!', 'happy')],
            },
            {
              id: 'stand',
              label: 'Stand still and let it rain on you.',
              then: [N('You stand still and let it rain. It runs down your collar, and you don’t mind at all.', 'soft')],
            },
            {
              id: 'puddle',
              label: 'Join your Nubbin in the puddles.',
              then: [N('You jump in the biggest one together. Pumbaa, in the next puddle, gives you both a nod of deep respect.')],
            },
          ],
        },
        done: {
          id: 'a23-16-rain-done',
          lines: [N('Simba walks up the rock through the rain, to the very top, where his father used to stand.')],
        },
      },
      {
        id: 'a23-16-s2',
        goal: 'Watch Simba climb to the top of the rock and roar.',
        hint: 'Stay below with the pride, and look up.',
        check: 'watch:a23-roar:pride-rock',
        scene: {
          id: 'a23-16-roar',
          lines: [
            N('He stands at the edge for a long moment in the rain, looking out over the dark plain.'),
            N('Rafiki stands beside you with both hands on his stick. He doesn’t say anything; he doesn’t need to.'),
            N('Simba lifts his head and roars. It goes out over the plain and comes back from the hills, again and again.'),
            N('Below him the lionesses roar back: Nala, Sarabi, all of them, one after another.'),
            N('Your Nubbin climbs onto your shoulder, takes a deep breath, opens its mouth as wide as it will go, and lets out a tiny squeak.'),
            N('Simba looks down at it from the top of the rock. Then he roars again, gently, just for it.'),
            NA('It’s trying. Like he used to.', 'happy'),
            TI('Okay. Now I’m crying properly.', 'sad'),
          ],
          choices: [
            {
              id: 'roar',
              label: 'Roar too.',
              then: [N('You roar, and it is not very good. Nobody minds, and Pumbaa joins in, louder and much worse.', 'happy')],
            },
            {
              id: 'again',
              label: 'Help your Nubbin try again.',
              then: [N('It tries again. This time it is a slightly bigger squeak, and it looks extremely pleased with itself.')],
            },
          ],
        },
        done: {
          id: 'a23-16-roar-done',
          lines: [N('The page turns, slowly, like someone who wants to stay on the last good bit.')],
        },
      },
      {
        id: 'a23-16-s3',
        goal: 'Take your place on the rock at the new presentation.',
        hint: 'Go up to the top of the rock with Rafiki.',
        check: 'watch:a23-new-cub:pride-rock',
        scene: {
          id: 'a23-16-green',
          lines: [
            N('When it settles, the plain is green again: green to the hills, the river full, and the herds back from everywhere.'),
            N('Giraffes go past with their heads up, swaying like slow ships. Twiga, you think, and smile.'),
            N('All the animals are gathering below the rock, the way they did on the very first morning.'),
            N('At the top, Simba stands with his mane dry and full, and Nala beside him with something small between her paws.'),
            NA('Gently. Three days old, and already the bossiest one on the rock.', 'happy'),
            N('Rafiki shakes his rattle of gourds over the new cub, and the cub sneezes, just as its father did.'),
            RA('I made tea this morning. For somebody, this time.', 'happy'),
            N('He has carried three cups up the rock. The smallest is for your Nubbin, which drinks it in one go and holds the cup out for more.'),
            N('Your Nubbin climbs your back, then your shoulder, then your head, to see. Some things never change.'),
            N('Simba looks out over the plain, then up at the sky, as if checking someone is watching. Then he nods.'),
            N('Zazu lands on a stone in front of you, very important, and looks you up and down.'),
            ZA('Name? Business? …Oh, stop it. You’re on the list.'),
            ZA('You have been on the list since the first morning. I simply never said.', 'happy'),
          ],
        },
      },
    ],
    complete: {
      id: 'a23-16-complete',
      lines: [
        N('Rafiki cracks a gourd and marks the cub’s brow with a line of fruit-red. Then he holds the cub up high in both hands, over everything.'),
        A16_PLAIN,
        TI('Hey! Guest! Dumpling! Get over here! You stand with family!', 'happy'),
        N('Timon and Pumbaa pull you in between them, to the front of the rock, right beside the lions.'),
        PU('We came all this way together. You don’t get to stand at the back.', 'happy'),
        ZA('Hornbills are excellent at standing at the back.'),
        TI('Zazu. You’re at the front.'),
        N('Zazu looks down. He is, somehow, at the very front. He straightens one feather and says nothing, for once.'),
        N('You stand with them while the plain kneels. Your Nubbin, on your head, kneels too.'),
        ...A16_HOME,
      ],
    },
    rewards: [
      {
        id: 'a23-painting',
        kind: 'feature',
        label: 'Rafiki’s Painting',
        description:
          'A small painting on bark of your Nubbin, in ochre, with a line of fruit-red on its brow. It appears inside the hollow of Hazel’s crooked tree.',
      },
      {
        id: 'a23-roar',
        kind: 'feature',
        label: 'Sunset Roar',
        description: 'Every Nubbin in the Grove learns to face the sunset now and then and roar at it. It comes out as a squeak.',
      },
      {
        id: 'a23-bench',
        kind: 'decor',
        label: 'Baobab-Bark Bench',
        description: 'A low bench of smooth grey bark, wide enough for a Keeper and two Nubbins, for sitting and waiting on.',
      },
      {
        id: 'a23-remembering-bookmark',
        kind: 'item',
        label: 'Night of Remembering Bookmark',
        description: 'A strip of bark paper with a red thumb-print on it. It marks this page, and counts towards the Night of Remembering.',
      },
    ],
    sets: { 'a23-16': true, 'a23-done': true },
    notes:
      'SIGNATURE PAYOFF (a23-path, set in A23-9, seven quests earlier). The complete scene shown is for simba: Timon ' +
      'and Pumbaa pull you in to stand with them. For rafiki play A23_VARIANTS a23-16-complete-rafiki: Rafiki hands ' +
      'you the gourd to crack. Rewards are the same on both paths, all one-time. NEW CUB: never gendered, never ' +
      'named. SIM: (a) the painting is a fixed prop inside the crooked tree’s hollow, drawn from your current ' +
      'Nubbin at the moment A23-16 completes (the red brow mark always painted on); the first time you look in the ' +
      'hollow after atlasDone(\'A23\'), play A23_VARIANTS a23-grove-painting once. (b) The sunset roar is an idle ' +
      'emote every Nubbin may pick at dusk, now and then (seeded, never a timer or a task; no stat effect). (c) The ' +
      'bench is decor. (d) The bookmark is an atlas item; the Night of Remembering (A3, A5, A7, A16, A21, A23, any ' +
      'two) reads atlasDone(\'A23\'). SWAHILI: mvua (adviser).',
  },
];

// =================================================================== variant scenes

/**
 * Variant scenes, chosen by flags. Where each one plays:
 *   - a23-path = rafiki (set in A23-9). Each replaces the scene with the same id minus "-rafiki":
 *       A23-10: a23-10-desert-rafiki, a23-10-desert-done-rafiki, a23-10-help-rafiki, a23-10-complete-rafiki.
 *       A23-11: a23-11-oasis-rafiki, a23-11-oasis-done-rafiki, a23-11-grubs-rafiki, a23-11-complete-rafiki.
 *       A23-12: a23-12-hunt-rafiki, a23-12-hunt-done-rafiki, a23-12-complete-rafiki (step 2 is shared).
 *       A23-13: a23-13-ridge-rafiki, a23-13-ridge-done-rafiki, a23-13-wind-rafiki, a23-13-complete-rafiki.
 *       A23-16: a23-16-complete-rafiki.
 *   - a23-14-clouds-done-after: the campaign is finished (CampaignState.ending set); replaces a23-14-clouds-done.
 *   - a23-margin-hazel: s24Done (Grove, read-only). Hazel's margin note beside the pool, after a23-14-complete
 *     (or the first time the atlas is open at the pool once s24Done is set). Text exactly as S24's notes give it.
 *   - GROVE KEEPSAKE (played in the Grove, never in the Atlas; it writes nothing):
 *       a23-grove-painting: once, the first time you look into the hollow of Hazel's crooked tree after
 *         atlasDone('A23'). The painting stays there after.
 */
export const A23_VARIANTS: Scene[] = [
  // ---------------------------------------------------------------- A23-10 (rafiki): the baobab
  {
    id: 'a23-10-desert-rafiki',
    lines: [
      N('It is dark by the time you reach the baobab. Zazu has gone quiet in your arms, which frightens you more than anything.'),
      N('Rafiki is sitting in the fork of the tree. He doesn’t call down; he already knows.'),
      RA('The wind came by a little while ago. It smelled wrong. Bring him up.', 'sad'),
      N('He takes Zazu from you, gently, and looks at the wing you bound. He doesn’t undo any of it.'),
      RA('That is good work. Slow work. You did not hurry, even then.', 'soft'),
      ZA('The king, Rafiki. And the boy. The boy ran…', 'sad'),
      RA('I know. Hush. I know.'),
      N('Rafiki lays him on a bed of leaves. Zazu is asleep before he has finished complaining about it.'),
    ],
    choices: [
      {
        id: 'tell',
        label: 'Tell Rafiki what you saw.',
        then: [N('You tell him all of it, as well as you can. He listens without a word, nodding slowly.')],
      },
      {
        id: 'sit',
        label: 'Sit down beside him and say nothing.',
        then: [N('You sit down beside him. After a while he puts his old hand on top of yours.', 'soft')],
      },
    ],
  },
  {
    id: 'a23-10-desert-done-rafiki',
    lines: [
      N('Rafiki climbs up inside the tree in the dark. You hear him find the painted cub on the wall.'),
      N('He stands looking at it for a long time. Then he wipes it out with the flat of his hand.'),
      RA('Pole sana, little one. Pole sana.', 'sad'),
    ],
  },
  {
    id: 'a23-10-help-rafiki',
    lines: [
      N('In the morning you climb to the top of the baobab with Rafiki to look at the rock.'),
      N('A thin dark lion stands at the very top, where the king used to stand. The lionesses are below him, heads down.'),
      RA('Scar.', 'angry'),
      N('Up the back path of the rock, in a long grey line, come the hyenas: dozens of them, and then more.'),
      ZA('He’s letting them in. He’s letting them in!', 'shock'),
      N('Zazu is up, wobbling, with his bound wing held close, peering through the leaves.'),
      RA('Hyenas eat and eat, and never plant anything. It won’t be long now.', 'think'),
      ZA('I have to go back. Someone has to stand by the queen.', 'sad'),
      RA('Your wing.'),
      ZA('I’ll walk. Hornbills are excellent at walking.'),
    ],
    choices: [
      {
        id: 'help',
        label: 'Help Zazu down the tree.',
        then: [N('You carry him down and set him on the path. He walks off towards the rock with his chin up, very small.')],
      },
      {
        id: 'stay',
        label: 'Ask him to stay.',
        then: [ZA('I can’t. It’s my job. It has been my job since before you were born. Whatever you are.', 'soft')],
      },
    ],
  },
  {
    id: 'a23-10-complete-rafiki',
    lines: [
      N('That evening you sit in the hollow of the tree while Rafiki mends a gourd that doesn’t need mending.'),
      RA('A king is gone, and a cub is gone. And the one who wanted the rock has got it.'),
      Y('What do we do?'),
      RA('What we did before. We watch. We carry water. We wait.'),
      RA('Waiting is not nothing. Done properly, it is the hardest work there is.', 'think'),
      N('Your Nubbin sits under the smudge where the cub used to be, and looks up at it.'),
    ],
  },
  // ---------------------------------------------------------------- A23-11 (rafiki): the dry years
  {
    id: 'a23-11-oasis-rafiki',
    lines: [
      N('The page turns its seasons over, one after another, and each one is drier than the last.'),
      N('The herds go first. One morning the zebra and wildebeest are there; the next they are a line of dust going away.'),
      N('The grass goes yellow, then grey, then nothing. The river at the bottom of the plain shrinks to a string of mud.'),
      RA('A plain is not just grass. It is everyone on it, looking after each other without knowing. When that stops…', 'sad'),
      N('You and your Nubbin don’t change at all; the atlas keeps your time for you. Rafiki gets a little greyer round the beard.'),
      N('Every day you carry water up to the rock in Rafiki’s gourds, for whoever needs it. There is always someone.'),
      N('Every morning Rafiki sets out two cups, in case. Every evening he drinks both, cold.'),
      RA('Polepole. You walk too fast in this heat. A dropped gourd helps nobody.', 'think'),
    ],
    choices: [
      {
        id: 'carry',
        label: 'Carry an extra gourd up the rock.',
        then: [N('It is heavy. You carry it anyway, all the way up.')],
      },
      {
        id: 'rest',
        label: 'Rest in the shade first.',
        then: [RA('Good. Resting is part of carrying. Nobody tells you that.', 'happy')],
      },
    ],
  },
  {
    id: 'a23-11-oasis-done-rafiki',
    lines: [
      N('Up at the rock, the hyenas lie about in the shade, picking their teeth with old bones. There is nothing left to eat.'),
      N('Zazu is up there too, in a cage of old ribs by Scar’s place. When he sees you, he puts his chin up.'),
    ],
  },
  {
    id: 'a23-11-grubs-rafiki',
    lines: [
      N('At the top of the rock, the lionesses come back from hunting with nothing. You can count their ribs.'),
      N('Sarabi walks at the front. She is thinner than she was, and she walks exactly as straight.'),
      SC('Sarabi. Your hunting party seems to have mislaid the hunting.', 'think'),
      SB('There is nothing left to hunt, Scar. The herds have gone, and we should follow them.'),
      SC('Nobody leaves my rock.', 'angry'),
      SB('A king would know when it was time to move. He would feel it in his bones.'),
      SC('I am king here. I decide what anyone feels in their bones.', 'angry'),
      N('You set your gourd down at Sarabi’s feet. She drinks a little, then gives the rest to the youngest lioness.'),
      SB('Asante, guest. Tell Rafiki we are still here. Tell him we are holding.', 'soft'),
    ],
    choices: [
      {
        id: 'stand',
        label: 'Stand beside Sarabi.',
        then: [N('Scar looks at you as if you were something stuck to his paw. You stand beside her and don’t move.')],
      },
      {
        id: 'cubs',
        label: 'Let your Nubbin play with the cubs.',
        then: [N('The two cubs left on the rock tumble about with your Nubbin in the dust, and for a minute nobody is hungry.')],
      },
    ],
  },
  {
    id: 'a23-11-complete-rafiki',
    lines: [
      N('That night someone scratches at the baobab. It is Nala, grown, thin as a reed, with her eyes very bright.'),
      NA('I’m going. Out past the border, to find help. Anyone. Anything. Don’t tell Scar.', 'think'),
      RA('I will not tell Scar. I have not told Scar anything for years. It is very restful.', 'happy'),
      RA('Go with her, guest. Carry water. She will need it, and somebody should see what she finds.', 'think'),
      N('You fill every gourd you can carry. Your Nubbin takes its own tiny one, which holds one swallow.'),
      NA('Come on, then. Keep up. Polepole is for people with tea waiting.'),
      RA('I heard that. And the tea is cold.', 'happy'),
    ],
  },
  // ---------------------------------------------------------------- A23-12 (rafiki): you come with Nala
  {
    id: 'a23-12-hunt-rafiki',
    lines: [
      N('Two days out in the desert, the gourds are nearly empty. Then the sand turns to scrub, and the scrub to green.'),
      N('There are waterfalls, ferns and trees heavy with fruit. Nala stops with her nose up, and her whole body goes still.'),
      NA('Warthog.', 'think'),
      N('Before you can say anything, she is gone into the long grass, low and fast.'),
      N('Down by a stream, a big warthog is snuffling for beetles, with a meerkat sunbathing on his back.'),
      PU('Aaagh! She’s gonna eat me!', 'shock'),
      N('A young lion comes crashing out of the ferns and meets her in mid-leap. They roll over and over in the mud.'),
      N('She pins him. She knows exactly where to put her paws; she pinned him like that a long time ago.'),
      SI('Nala?', 'shock'),
    ],
    choices: [
      {
        id: 'hold',
        label: 'Hold on to your Nubbin.',
        then: [N('It wants to go and help. You hold on to it anyway.')],
      },
      {
        id: 'run',
        label: 'Run after her.',
        then: [N('You get there out of breath, with half the desert in your boots, just in time to see who it is.')],
      },
    ],
  },
  {
    id: 'a23-12-hunt-done-rafiki',
    lines: [
      SI('And you. Rafiki’s guest. You haven’t changed at all. How haven’t you changed?', 'shock'),
      Y('It’s a long story. There’s a book in it.'),
      NA('Rafiki sent them with me. Simba, they think you’re… everyone thinks you’re…', 'sad'),
      TI('Hold it. Who’s this? And what is that? A mushroom? A dumpling?', 'shock'),
      PU('Can we keep them too?', 'happy'),
      TI('Pumbaa, we are not collecting… Fine. Fine!'),
    ],
  },
  {
    id: 'a23-12-complete-rafiki',
    lines: [
      A12_BACK,
      NA('Go back to Rafiki. Tell him Simba’s alive. Tell him he won’t come. I’m staying; I’m not giving up on him.', 'angry'),
      SI('Rafiki? He thinks I’m…', 'think'),
      N('He doesn’t finish. He walks off into the dark, alone, and Timon and Pumbaa look at each other.'),
      N('You fill your gourds at the stream and turn for home across the desert, with your Nubbin on your back.'),
    ],
  },
  // ---------------------------------------------------------------- A23-13 (rafiki): the wind reaches the baobab
  {
    id: 'a23-13-ridge-rafiki',
    lines: [
      N('You cross the desert back the way you came: two days of sand, then the thorns, the grey plain and the baobab.'),
      N('Rafiki sees you coming a long way off. He comes down to meet you, quicker than he usually moves.'),
      RA('Well? Polepole. Breathe first. Then tell me.'),
      Y('He’s alive. Simba’s alive. He’s grown up, and he won’t come home.'),
      N('Rafiki sits down hard on a root, as though somebody had pulled the ground out from under him.'),
      RA('Alive.', 'shock'),
      RA('And I wiped him off my wall. Oh, I am an old fool. A blind old fool.', 'sad'),
    ],
    choices: [
      {
        id: 'known',
        label: 'Tell him he couldn’t have known.',
        then: [RA('No. But I could have hoped. Hope is cheap, and I was being mean with it.', 'think')],
      },
      {
        id: 'wait',
        label: 'Sit down next to him and wait.',
        then: [N('You sit down next to him on the root. Your Nubbin climbs into his lap, and he lets it.', 'soft')],
      },
    ],
  },
  {
    id: 'a23-13-ridge-done-rafiki',
    lines: [N('Out over the desert, the wind is getting up. It blows through the branches of the baobab, and they creak.')],
  },
  {
    id: 'a23-13-wind-rafiki',
    lines: [
      N('A puff of dust comes in on the wind, with a few loose hairs in it, gold and dark gold, and drifts in at the baobab’s door.'),
      N('Rafiki catches it in his fist. He opens his hand and sniffs, and his whole face changes.'),
      RA('Him. That is him. That is the boy, grown.', 'shock'),
      N('Then he laughs, a great cackling whoop, and goes up the inside of the tree like a much younger mandrill.'),
      RA('Paint! Ochre! Quickly! No. Polepole. But quickly!', 'happy'),
      N('You mix the yellow earth with shaking hands. Rafiki takes the shell and finds the smudge where the cub used to be.'),
      N('He paints the cub back in. Then, round its head, in big round strokes, he paints a mane.'),
      RA('There. Now the wall is right again. Now we go and fetch him.', 'happy'),
    ],
    choices: [
      {
        id: 'mane',
        label: 'Help him with the mane.',
        then: [N('You do the last bit, round the back, and it comes out lopsided. Rafiki says that is exactly what Simba’s looks like.')],
      },
      {
        id: 'nubbin',
        label: 'Lift your Nubbin up to look.',
        then: [N('Your Nubbin puts its red forehead right up against the painted lion’s, nose to nose.')],
      },
    ],
  },
  {
    id: 'a23-13-complete-rafiki',
    lines: [
      N('Rafiki takes his stick and his biggest gourd. He doesn’t lock the tree, because he has never locked it.'),
      RA('Come. You know the way now. That makes you the guide and me the guest. How funny.', 'happy'),
      N('You set off together across the grey plain towards the desert, with the wind at your backs.'),
      N('Your Nubbin walks in front, very important, as though it knew the way better than either of you.'),
    ],
  },
  // ---------------------------------------------------------------- A23-14: after the campaign ends
  {
    id: 'a23-14-clouds-done-after',
    lines: [
      N('Simba stands still in the wind, looking at the place where the clouds were. Rafiki doesn’t hurry him.'),
      N('Your Nubbin looks up at the clouds for a long time. Then it turns, and looks at you.'),
      N('Rafiki comes and stands beside you. He puts one old hand on your shoulder, and says nothing at all.'),
      N('You stand like that, the three of you, until the wind goes down.'),
    ],
  },
  // ---------------------------------------------------------------- Hazel's margin note (s24Done)
  {
    id: 'a23-margin-hazel',
    lines: [
      N('Nova’s atlas lies open at the still pool among the roots, and a grown lion looking down into it.'),
      N('Beside the pool, in faint pencil you have never noticed, there is a note in the margin. You know the hand.'),
      N('“He saw his father in the pool. They stay, you know.”'),
      N('“In the face. Usually the chin.”', 'soft'),
      N('And under it, one letter: H.'),
      N('You find you have put a hand to your own chin. Your Nubbin looks at you, then at the pool, as if comparing.'),
    ],
  },
  // ---------------------------------------------------------------- A23-16 (rafiki): you crack the gourd
  {
    id: 'a23-16-complete-rafiki',
    lines: [
      N('Rafiki walks to the edge of the rock, stops, and turns round. He holds out a gourd to you.'),
      RA('Here. You crack it.', 'happy'),
      Y('Me?'),
      RA('You. You carried every gourd on this page. You can carry this one the last step.'),
      N('You crack it on his stick. He marks the cub’s brow with a line of fruit-red, and lifts the cub up high over everything.'),
      A16_PLAIN,
      RA('Asante, guest. Slowly you came, and slowly you stayed. That is how anything good gets done.', 'soft'),
      ...A16_HOME,
    ],
  },
  // ---------------------------------------------------------------- Grove keepsake (reads atlasDone('A23'))
  {
    id: 'a23-grove-painting',
    lines: [
      N('You look into the hollow of Hazel’s crooked tree, the way you do sometimes, for no reason. Something is in there that wasn’t before.'),
      N('A little painting on a piece of bark: your Nubbin in yellow ochre, round and pleased, with a line of fruit-red across its brow.'),
      N('Your Nubbin looks at it for a long time. Then it touches its own forehead, where the red mark used to be.'),
      N('Painting someone means you mean to remember them. Somebody, somewhere, means to.'),
    ],
  },
];

// =================================================================== flags and checks

/** Every flag this line sets (Atlas save only). It reads the campaign ending and s24Done, and writes no Grove flag. */
export const ATLAS_A23_FLAGS: string[] = [
  'a23-01',
  'a23-02',
  'a23-03',
  'a23-04',
  'a23-05',
  'a23-06',
  'a23-07',
  'a23-08',
  'a23-09',
  'a23-10',
  'a23-11',
  'a23-12',
  'a23-13',
  'a23-14',
  'a23-15',
  'a23-16',
  'a23-done', // A23-16: the whole page; read by atlasDone('A23') for the Night of Remembering and the Grove painting
  'a23-path', // simba | rafiki (a23-09-choice): A23-10, A23-11, A23-12 (opening and close), A23-13, A23-16 complete
];

export const ATLAS_A23_CHECKS: string[] = [
  'explore:a23-baobab:plain',
  'walk:a23-pride-rock:plain',
  'watch:a23-presentation:pride-rock',
  'craft:a23-paint:baobab',
  'watch:a23-painting:baobab',
  'deliver:a23-message:pride-rock',
  'watch:a23-sunrise:pride-rock',
  'watch:a23-pounce:grass',
  'walk:a23-ledge:pride-rock',
  'talk:a23-scar:ledge',
  'escort:a23-cubs:plain',
  'race:a23-herds:plain',
  'explore:a23-graveyard:ribs',
  'race:a23-hyenas:graveyard',
  'walk:a23-plain:dusk',
  'sit:a23-stars:rise',
  'walk:a23-gorge:rim',
  'climb:a23-zazu:ledge',
  'wait:a23-dust:ledge',
  'carry:a23-zazu:rim',
  'choose:a23-path:thorns',
  'walk:a23-long-day:after-gorge',
  'wait:a23-dusk:after-gorge',
  'wait:a23-years:after-gorge',
  'feed:a23-supper:after-gorge',
  'explore:a23-oasis:stream',
  'wait:a23-waterfall:oasis',
  'walk:a23-night:after-nala',
  'watch:a23-wind:night',
  'watch:a23-rafiki:oasis',
  'explore:a23-roots:pool',
  'watch:a23-clouds:pool',
  'walk:a23-pride-lands:desert',
  'carry:a23-zazu:back-path',
  'watch:a23-scar:pride-rock',
  'wait:a23-rain:pride-rock',
  'watch:a23-roar:pride-rock',
  'watch:a23-new-cub:pride-rock',
];
