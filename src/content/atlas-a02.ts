/**
 * Atlas campaign, page A2: The Monkey and the Monk (Part L). Nineteen quests, A2-1 to A2-19.
 *
 * SOURCE. Journey to the West (Xiyou ji), the 16th-century Chinese novel in one hundred chapters,
 * usually credited to Wu Cheng'en, and the many films, comics and anime it grew. The Chinese
 * text is public domain. Every English translation (Waley, Jenner, Yu, Lovell and others) is
 * either in copyright or unverified for our purposes, so NOTHING here is lifted from any
 * translation, film or comic: all dialogue is new, every name of a place or rank is a common
 * rendering, and no one translator's coinage is used except the long-standing nicknames
 * "Monkey", "Pigsy" and "Sandy". No designs from any film, comic or anime (no Saiyuki, no
 * Dragon Ball, no Monkey Magic): the look is our own ink-and-wash atlas style.
 *
 * AUDIENCE. 'all'. No lifted text, so no line needs a `childLines` replacement. A softened
 * Learning Grove version is planned (the real Xuanzang and the Silk Road, map-reading, zodiac
 * stories, shadow-puppet theatre); it is a separate task and not in this file.
 *
 * FRAME. Nova's atlas falls open at an ink-and-wash page of a mountain of peach trees. You and
 * your Nubbin step in on the morning a stone egg hatches a monkey, and the page turns its own
 * years past you. Monkey calls your Nubbin "Cousin", because it also came out of an egg. From
 * A2-6 on you are the pilgrims' "fifth disciple": you carry the luggage (Sandy shares the pole
 * from A2-10). The heroes keep their story: Monkey fights, the monk decides, Guanyin and the
 * Buddha settle what no one else can. You carry, hold, sit, swim, count and choose. Your Nubbin
 * never speaks; it adores the immortal peaches. The source's own speaking beings (Monkey, the
 * dragon prince, the Black Bear, the old turtle) talk, as canon 31 allows inside an Atlas world.
 *
 * GROVE FLAGS READ. None. The outline names no Grove flag for this page.
 *
 * FLAGS WRITTEN (Atlas save only, all prefixed a02-):
 *   - a02-01 … a02-19: each quest on completion. a02-done: the whole page (A2-19); festivals and
 *     the Grove keepsake read it through atlasDone('A2').
 *   - a02-believed = monkey | monk (A2-12, scene a02-12-bones, the SIGNATURE CHOICE: trust what
 *     you saw or what you were told). Paid off three quests later in A2-15: for monkey, the monk
 *     asks you which Monkey is his (a02-15-which); for monk, Monkey asks you to tell them
 *     (ATLAS_A02_VARIANTS a02-15-which-monk). Also picks the A2-19 complete scene (a02-19-complete
 *     for monkey, ATLAS_A02_VARIANTS a02-19-complete-monk for monk). Both routes reconcile the
 *     monk and Monkey, in A2-12's last step and again at the end. Default: when a02-believed is
 *     anything but monk (including unset, which A2-15's requires chain makes impossible), the
 *     base scenes play.
 *
 * LIFTED TEXT. None. The beats of famous passages (the stone egg, the three knocks on the head,
 * the writing on the Buddha's finger, the hairs that bow, the gourd that calls names, the torn
 * last pages) are told in our own words. No song lyrics. No quote from any translation.
 *
 * CARE NOTES.
 *   - The Buddha and Guanyin are as the novel presents them: wise, calm and kind, never mocked,
 *     never the butt of a joke. Lord Lao and the Jade Emperor are dignified, and gently comic
 *     only where the novel is. The Black Bear, the abbot and the demons are fairy-tale spooky.
 *   - Fights are bonks, dust, wind and noise. Nobody bleeds and no one dies on screen. Softened:
 *     Monkey's bandits are chased off, not killed (A2-6, A2-15); the White Bone Demon's three
 *     disguises crumple like empty coats, the last leaving a small chalky heap of bones (A2-12); the
 *     six-eared macaque is spared and runs off (A2-15, where the novel has Monkey kill it); the
 *     greedy abbot's fate is left out (A2-8); Sandy's necklace and Red Boy's sword-lotus are left
 *     out (A2-10, A2-14); the monk's old body in the bottomless boat is left out (A2-18).
 *   - The ginseng fruit (A2-11) are "shaped like tiny sleeping babies": said once, plainly, as the
 *     reason the monk won't eat them. Nothing more is made of it.
 *   - The golden headband (A2-6) is the novel's, used sparingly; the monk is shocked by how
 *     strong it is and never uses it lightly. The reward band (A2-19) is a toy that does nothing.
 *   - Buddhist and Daoist figures and places are treated with respect throughout; a cultural
 *     adviser should read the page before ship (atlas.md, "Advisers").
 *   - No timers: the cloud-somersault fast travel is unlimited, the peach tree and the hat are
 *     one-time rewards.
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

const WHERE = 'Nova’s atlas: the Monkey and the Monk page (Atlas campaign)';
const after = (code: string) => `Any time after ${code}, from Nova’s atlas.`;
const SRC = 'Journey to the West (16th-century novel)';

// ------------------------------------------------------------------ speakers

const MONKEY = sp('a02-monkey', 'Monkey', 'Sun Wukong, the Monkey King (Journey to the West); original design');
const MONK = sp('a02-monk', 'Tang Sanzang', 'Tang Sanzang, the pilgrim monk, the novel’s Xuanzang (Journey to the West); original design');
const PIGSY = sp('a02-pigsy', 'Pigsy', 'Zhu Bajie (Journey to the West); original design');
const SANDY = sp('a02-sandy', 'Sandy', 'Sha Wujing (Journey to the West); original design');
const GUANYIN = sp('a02-guanyin', 'Guanyin', 'Guanyin, the Bodhisattva of compassion, as the novel presents her; original design');
const BUDDHA = sp('a02-buddha', 'The Buddha', 'The Buddha (Tathagata) as the novel presents him; original design');
const JADE = sp('a02-jade', 'The Jade Emperor', 'The Jade Emperor (Journey to the West); original design');
const HERALD = sp('a02-herald', 'A heavenly herald', 'One of the Jade Emperor’s officers, ch. 1');
const GIBBON = sp('a02-gibbon', 'An old gibbon', 'The old monkeys of the Mountain of Flowers and Fruit, ch. 1');
const TEACHER = sp('a02-teacher', 'Master Subhuti', 'Patriarch Subhuti, Monkey’s teacher, ch. 1–2');
const GARDENER = sp('a02-gardener', 'The garden spirit', 'The local spirit of the Peach Garden, ch. 5');
const QUEEN = sp('a02-queen', 'The Queen Mother of the West', 'The Queen Mother of the West, ch. 5 and 7');
const DRAGON = sp('a02-dragon', 'Prince Yulong', 'The third son of the Dragon King of the Western Sea, the white dragon horse, ch. 15');
const ABBOT = sp('a02-abbot', 'The old abbot', 'The abbot of the Guanyin Chan Monastery, ch. 16');
const BEAR = sp('a02-bear', 'The Black Bear', 'The Black Bear spirit of Black Wind Mountain, ch. 16–17');
const GAO = sp('a02-gao', 'Old Gao', 'Old Gao of Gao Village, ch. 18–19');
const MOKSA = sp('a02-moksa', 'Moksa', 'Moksa (Hui’an), Guanyin’s disciple, ch. 22');
const MOON = sp('a02-moon', 'Bright Moon', 'Bright Moon, an acolyte of the Temple of Five Villages, ch. 24–26');
const WIND = sp('a02-wind', 'Pure Wind', 'Pure Wind, an acolyte of the Temple of Five Villages, ch. 24–26');
const ZHENYUAN = sp('a02-zhenyuan', 'Master Zhenyuan', 'Zhenyuan, master of the ginseng tree, ch. 24–26');
const BONE = sp('a02-bone', 'A stranger on the ridge', 'The White Bone Demon in her three disguises, ch. 27');
const SILVER = sp('a02-silver', 'Silver Horn', 'Silver Horn of Lotus Flower Cave, ch. 32–35');
const LAO = sp('a02-lao', 'Lord Lao', 'Taishang Laojun, ch. 5–7 and 35');
const REDBOY = sp('a02-redboy', 'Red Boy', 'Red Boy, son of the Bull Demon King and Princess Iron Fan, ch. 40–42');
const FALSE = sp('a02-false', 'Monkey', 'The six-eared macaque in Monkey’s shape, ch. 56–58');
const IRONFAN = sp('a02-ironfan', 'Princess Iron Fan', 'Princess Iron Fan, ch. 59–61');
const SPIDER = sp('a02-spider', 'A spinning woman', 'The spider spirits of Cobweb Cave, ch. 72');
const TURTLE = sp('a02-turtle', 'The old white turtle', 'The old white turtle of the River of Heaven, ch. 49 and 99');

const N = say('narrator');
const Y = say('you');
const MK = say('a02-monkey');
const MO = say('a02-monk');
const PG = say('a02-pigsy');
const SD = say('a02-sandy');
const GY = say('a02-guanyin');
const BU = say('a02-buddha');
const JE = say('a02-jade');
const HE = say('a02-herald');
const GB = say('a02-gibbon');
const TE = say('a02-teacher');
const GS = say('a02-gardener');
const QM = say('a02-queen');
const DR = say('a02-dragon');
const AB = say('a02-abbot');
const BR = say('a02-bear');
const GA = say('a02-gao');
const MS = say('a02-moksa');
const BM = say('a02-moon');
const PW = say('a02-wind');
const ZY = say('a02-zhenyuan');
const BN = say('a02-bone');
const SH = say('a02-silver');
const LL = say('a02-lao');
const RB = say('a02-redboy');
const FM = say('a02-false');
const IF = say('a02-ironfan');
const SS = say('a02-spider');
const TT = say('a02-turtle');

// ------------------------------------------------------------------ shared pieces

/** A2-15: the three answers to "which one is the real Monkey?" (both askers). */
const WHICH_CHOICES = (asker: 'monk' | 'monkey') => [
  {
    id: 'left',
    label: 'Point at the one on the left.',
    then: [
      FM('Ha! You see? The little luggage-carrier knows me.', 'happy'),
      MK('Ha! You see? The little luggage-carrier knows me.', 'happy'),
      N('They say it at the same moment, in the same voice, with the same grin. Your pointing finger feels very foolish.'),
      asker === 'monk'
        ? MO('That settles nothing. I am sorry I asked you to carry it.', 'sad')
        : MK('That settles nothing, Cousin’s keeper. I’m sorry I asked.', 'sad'),
    ],
  },
  {
    id: 'right',
    label: 'Point at the one on the right.',
    then: [
      MK('There! Somebody with eyes in their head at last.', 'happy'),
      FM('There! Somebody with eyes in their head at last.', 'happy'),
      N('Both of them bow to you. Both bows are exactly as deep, and exactly as rude.'),
      asker === 'monk'
        ? MO('That settles nothing. I am sorry I asked you to carry it.', 'sad')
        : MK('That settles nothing, Cousin’s keeper. I’m sorry I asked.', 'sad'),
    ],
  },
  {
    id: 'plain',
    label: 'Say it plainly: “I can’t tell. I won’t pretend I can.”',
    then: [
      N('Both Monkeys open their mouths, and then neither of them says anything at all.'),
      asker === 'monk'
        ? MO('Thank you. That is the first true thing anyone has said since this began.', 'soft')
        : MK('Good. Everyone else has been guessing, and guessing is how you lose a monk.', 'soft'),
      SD('Then we stop asking people who can’t know, and go to the one who does.'),
    ],
  },
];

// =================================================================== THE MONKEY AND THE MONK

export const ATLAS_A02: Quest[] = [
  // ---------------------------------------------------------------- A2-1
  {
    id: 'a02-01',
    code: 'A2-1',
    title: 'Born from Stone',
    source: `${SRC}, ch. 1: the stone egg on the Mountain of Flowers and Fruit`,
    audience: 'all',
    trigger: { where: WHERE, when: 'Any time once Nova’s atlas is in the Grove; the first quest on the page.' },
    speakers: [MONKEY, JADE, HERALD],
    steps: [
      {
        id: 'a02-01-s1',
        goal: 'Step into the ink-and-wash page and climb to the top of the mountain.',
        hint: 'Touch the page, then follow the smell of peaches uphill.',
        check: 'explore:a02-mountain:summit',
        scene: {
          id: 'a02-01-page',
          lines: [
            N('Nova’s atlas falls open at a page painted in ink and wash: a mountain of peach trees, a waterfall, and clouds drawn as curls.'),
            N('In the margin Nova has pencilled: “A very long walk. Take snacks.”'),
            N('The ink goes wet under your fingers, then warm. You and your Nubbin are standing on warm rock, high above the clouds.'),
            N('This is the Mountain of Flowers and Fruit. Everything on it smells of peaches, even the stones.'),
            N('Right at the top sits an egg made of stone, taller than you are. Your Nubbin walks round it twice, very slowly.'),
            N('It presses its cheek to the stone and listens. Then it looks up at you, solemn as a doctor.'),
          ],
          choices: [
            {
              id: 'knock',
              label: 'Knock on the egg.',
              then: [N('Something inside knocks back. Your Nubbin knocks again, delighted, and it goes on like that for some time.')],
            },
            {
              id: 'sit',
              label: 'Sit down beside it and wait.',
              then: [N('You sit, and your Nubbin sits. The wind comes and sits too, and the egg seems to like the company.')],
            },
          ],
        },
        done: {
          id: 'a02-01-page-done',
          lines: [N('A wind gets up from nowhere and leans on the egg, the way you lean on a stuck door.')],
        },
      },
      {
        id: 'a02-01-s2',
        goal: 'Watch the stone egg hatch.',
        hint: 'Stay close to the egg. Your Nubbin knows what hatching sounds like.',
        check: 'watch:a02-egg:summit',
        scene: {
          id: 'a02-01-hatch',
          lines: [
            N('The egg cracks with a sound like a dropped plate. A stone ball rolls out, and the ball unfolds into a monkey.'),
            N('He is the grey of the rock, all knees and elbows. He bows to the north, the south, the east and the west.'),
            N('Then he opens his eyes. Two beams of gold shoot up through the clouds, as if he were checking the sky for holes.'),
            MK('Ha! Who are you? Are you a rock as well? You’re very round for a rock.', 'happy'),
            N('Your Nubbin, who also came out of an egg, decides on the spot that this is family.'),
            MK('A cousin! I knew there’d be others. Everything up here is mine, I think. You can have some of the view.'),
            MK('Not the peaches. Well. One peach.'),
          ],
        },
        done: {
          id: 'a02-01-hatch-done',
          lines: [N('Far above, the gold light reaches a hall in the clouds, and somebody very important has to put his tea down.')],
        },
      },
      {
        id: 'a02-01-s3',
        goal: 'Look down from the clouds with Heaven’s court.',
        hint: 'Follow the gold light up to the Hall of Divine Mists.',
        check: 'watch:a02-heaven:mists',
        scene: {
          id: 'a02-01-heaven',
          lines: [
            N('The page turns up one corner of itself, and you are on a cloud above a hall of jade and gold.'),
            JE('Two beams of light from a mountain in the east. Who is making a fuss down there?', 'think'),
            N('A herald bows very low and stays down there, to be safe.'),
            HE('Only a monkey, Majesty. Born from a stone this morning. He has eaten something, and the light has gone out.'),
            JE('Then let him be. Heaven and earth make strange things all the time. Let him play.', 'soft'),
            N('Your Nubbin leans over the edge of the cloud and waves at a small grey dot. The dot waves back.'),
            JE('Still. Write it down somewhere. Small things grow.'),
          ],
        },
      },
    ],
    complete: {
      id: 'a02-01-complete',
      lines: [
        N('By evening the stone monkey has learned to walk, climb, eat peaches and argue with other monkeys, in that order.'),
        MK('Cousin! You came back down. Tomorrow I’m going to do something enormous. I haven’t decided what.', 'happy'),
        N('He gives your Nubbin a peach that is mostly bite marks. Your Nubbin holds it like treasure.'),
        N('Nova has drawn a tiny peach in the margin. Now a tiny ink monkey sits beside it, eating it.'),
      ],
    },
    rewards: [],
    sets: { 'a02-01': true },
    notes:
      'OPENING: the page is ink and wash and fills with colour as you step through (a two-second wash). The ' +
      'golden eye-beams are two thin gold columns, soft-edged, no flash (respect reduced motion: a steady glow). ' +
      'Monkey’s look is our own: a lean grey-gold monkey, no film or anime design. He calls your Nubbin “Cousin” ' +
      'from here to the end of the page.',
  },

  // ---------------------------------------------------------------- A2-2
  {
    id: 'a02-02',
    code: 'A2-2',
    title: 'The Water-Curtain Cave',
    source: `${SRC}, ch. 1: the leap through the waterfall`,
    audience: 'all',
    trigger: { where: WHERE, when: after('A2-1') },
    requires: ['A2-1'],
    speakers: [MONKEY, GIBBON],
    steps: [
      {
        id: 'a02-02-s1',
        goal: 'Follow the monkeys upstream to the source of the stream.',
        hint: 'Keep to the bank. The noise ahead is the waterfall.',
        check: 'explore:a02-stream:source',
        scene: {
          id: 'a02-02-stream',
          lines: [
            N('A hot afternoon. The monkeys splash in the stream until somebody asks where all the water comes from.'),
            N('Nobody knows, so everybody goes to look. You and your Nubbin go too, because everybody means everybody.'),
            N('The stream ends at a waterfall that hangs down the cliff like a white curtain. Behind it, nobody can see anything.'),
            GB('Whoever goes through that curtain and comes back with all their fur on, we make them king.'),
            N('Every monkey looks at its own feet. A few look at their neighbours’ feet, which is a sort of suggestion.'),
            MK('I’ll go! I was born from a rock. Rocks don’t mind water.', 'happy'),
            N('Your Nubbin steps up beside him, quite serious about it. It has always liked a waterfall.'),
          ],
          choices: [
            {
              id: 'careful',
              label: 'Tell them both to be careful.',
              then: [MK('Careful is for monkeys who aren’t going to be king.', 'happy')],
            },
            {
              id: 'count',
              label: 'Offer to count them in.',
              then: [MK('Yes! Count. Kings should start on a number.'), N('You count to three. Monkey goes on two.')],
            },
          ],
        },
        done: {
          id: 'a02-02-stream-done',
          lines: [N('He crouches, shuts his eyes tight, and leaps.')],
        },
      },
      {
        id: 'a02-02-s2',
        goal: 'Swim through the waterfall after Monkey.',
        hint: 'Your Nubbin knows the way. Swim straight into the white water.',
        check: 'swim:a02-waterfall:curtain',
        scene: {
          id: 'a02-02-leap',
          lines: [
            N('Your Nubbin dives after him, and you follow your Nubbin. The water thunders on your head, and then it stops.'),
            N('Behind the curtain it is dry. An iron bridge crosses to a cave with stone beds, stone pots and stone bowls.'),
            N('Over the doorway someone has carved the cave a name, long ago, in tidy characters.'),
            MK('Nobody lives here! It’s got beds. It’s got pots. It’s got a front door made of waterfall!', 'happy'),
            N('Your Nubbin tries every stone bed in turn and finds them all exactly right.'),
            MK('Wait here. If I come back alone they’ll say I made it up.'),
          ],
        },
        done: {
          id: 'a02-02-leap-done',
          lines: [N('He shoots back out through the curtain, shouting. A moment later, a lot of wet monkeys shoot in.')],
        },
      },
      {
        id: 'a02-02-s3',
        goal: 'Feast with the new king, and listen when he goes quiet.',
        hint: 'Sit at the long stone table in the Water-Curtain Cave.',
        check: 'sit:a02-feast:cave',
        scene: {
          id: 'a02-02-king',
          lines: [
            N('They make him king, as promised. He takes the name Handsome Monkey King, and nobody dares laugh.'),
            N('The page turns a few years, as easily as a page. The feasts go on and on, and then, one night, the king cries.'),
            MK('One day I’ll be old. One day I’ll stop. All this, and one day it won’t be mine.', 'sad'),
            N('The cave goes very quiet. Your Nubbin climbs into his lap, which is all it knows to do.'),
            GB('There are some who never grow old, they say. Buddhas, immortals and sages. They live far off, among people.'),
            MK('Then I’ll go and find them. I’ll learn it. I’ll learn not to stop.'),
          ],
          choices: [
            {
              id: 'old',
              label: 'Tell him growing old isn’t the worst thing.',
              then: [MK('You say that because you aren’t a king.', 'think'), N('He keeps your Nubbin on his lap, though.')],
            },
            {
              id: 'go',
              label: 'Tell him to go and find out.',
              then: [MK('Yes. That’s the right answer. Cousin’s keeper gives the right answers.', 'happy')],
            },
          ],
        },
      },
    ],
    complete: {
      id: 'a02-02-complete',
      lines: [
        N('In the morning the monkeys build him a raft and pile it with fruit. They wave until he is a dot.'),
        N('You and your Nubbin are on the raft too. It seems rude to wave from the shore.'),
        MK('I’ll be back. When I come back, I won’t ever have to stop.'),
        N('Years go by on the water, as fast as you can turn a page. He learns to wear clothes and to walk like a person.'),
      ],
    },
    rewards: [],
    sets: { 'a02-02': true },
    notes:
      'The cave’s name above the door is shown as brush characters only, never translated on screen (no lifted ' +
      'rendering). The swim through the waterfall is a short swim minigame-free walk: hold forward, white-out, dry ' +
      'cave. The “years go by” lines use the page-turn transition.',
  },

  // ---------------------------------------------------------------- A2-3
  {
    id: 'a02-03',
    code: 'A2-3',
    title: 'Lessons in Shape-Changing',
    source: `${SRC}, ch. 1–2: the teacher, the three knocks, the seventy-two changes`,
    audience: 'all',
    trigger: { where: WHERE, when: after('A2-2') },
    requires: ['A2-2'],
    speakers: [MONKEY, TEACHER],
    steps: [
      {
        id: 'a02-03-s1',
        goal: 'Find the teacher in the mountain cave and sit in on a lesson.',
        hint: 'The cave is at the top of the pine path, past the woodcutter.',
        check: 'visit:a02-teacher:cave',
        scene: {
          id: 'a02-03-lesson',
          lines: [
            N('High on a quiet mountain there is a cave, and in the cave a teacher with a great many students.'),
            TE('A monkey. Then you shall have a name: Sun Wukong, Awake to Emptiness. It suits you. You are mostly noise.', 'soft'),
            N('The page turns seven years of sweeping floors. Then the teacher offers Monkey a choice of lessons.'),
            TE('I could teach you to see fortunes. To sit still. To make medicines. To read the old books.'),
            MK('Will any of them make me live for ever?'),
            TE('No.'),
            MK('Then no, thank you.'),
            N('The teacher climbs down from his seat, taps Monkey three times on the head with his ruler, and walks out with his hands behind his back.'),
            N('The other students are furious. Monkey is grinning from ear to ear.'),
          ],
          choices: [
            {
              id: 'ask',
              label: 'Ask Monkey why he’s grinning.',
              then: [
                MK('Three taps: come at the third watch of the night. Hands behind his back: use the back door.', 'happy'),
                MK('He’s going to teach me in secret. Don’t tell the others. Don’t tell Cousin, it can’t keep a secret.'),
              ],
            },
            {
              id: 'guess',
              label: 'Work it out for yourself.',
              then: [N('Three taps, hands behind the back. You catch Monkey’s eye, and he winks.')],
            },
          ],
        },
      },
      {
        id: 'a02-03-s2',
        goal: 'Wait by the back door at the third watch.',
        hint: 'Sit by the back door after dark. Keep your Nubbin awake if you can.',
        check: 'sit:a02-teacher:back-door',
        scene: {
          id: 'a02-03-night',
          lines: [
            N('At the third watch the back door is open a crack, and Monkey slips through it. You sit outside on the step.'),
            N('Your Nubbin falls asleep against the door almost at once. It snores in a small, polite way.'),
            N('Inside, the teacher talks for a long time in a low voice. You don’t hear the words, and you aren’t meant to.'),
            N('The page turns three more years of nights. Then one evening Monkey comes out walking a foot above the ground.'),
            MK('Seventy-two changes! I can be anything. And look, look at this.', 'happy'),
            N('He does a somersault on a cloud, and is gone. A moment later he is back, a little out of breath.'),
            MK('Halfway round the world and back. A hundred and eight thousand li in one go. Cousin, did you see?'),
            N('Your Nubbin, half awake, claps slowly.'),
          ],
        },
      },
      {
        id: 'a02-03-s3',
        goal: 'Watch Monkey show off in the yard.',
        hint: 'The students are gathering under the pines.',
        check: 'watch:a02-pine:yard',
        scene: {
          id: 'a02-03-pine',
          lines: [
            N('The other students have heard rumours. They gather round Monkey under the pines, all asking at once.'),
            MK('A pine tree? Easy.'),
            N('There is a pop, and in Monkey’s place stands a pine tree, very proud of itself. The students cheer.'),
            N('Your Nubbin stands beside it with both arms up, very still. It is being a small pine tree.'),
            TE('Who is shouting in my yard?', 'angry'),
            N('The pine tree turns back into a monkey, quite quickly.'),
            TE('You show off. A gift you show off makes other people want it, and then they come for it. And for you.'),
            TE('Go home. And never tell anyone who taught you. Not one word.', 'sad'),
          ],
          choices: [
            {
              id: 'speak',
              label: 'Tell the teacher Monkey meant no harm.',
              then: [TE('I know. That is the trouble with him. He never means any.', 'soft')],
            },
            {
              id: 'quiet',
              label: 'Stay out of it.',
              then: [N('You stay out of it. Your Nubbin, still being a pine tree, stays out of it too.')],
            },
          ],
        },
      },
    ],
    complete: {
      id: 'a02-03-complete',
      lines: [
        N('Monkey bows to his teacher, properly, all the way to the floor. For once he doesn’t say anything clever.'),
        MK('Hold on to my tail, Cousin’s keeper. I know a quick way home.', 'soft'),
        N('One somersault, and the world rolls under you like a rug being shaken. Then there are peaches again.'),
        N('Your Nubbin tumbles off the cloud and lies on the grass, beaming. It would like to do that again, please.'),
      ],
    },
    rewards: [],
    sets: { 'a02-03': true },
    notes:
      'The cloud somersault is shown here for the first time: a curl of cloud, a roll, a white streak. Use the same ' +
      'animation for the A2-19 fast-travel reward. The teacher is a calm, kindly old figure, never comic; his ruler ' +
      'taps are light. Nobody hears the secret lessons (respect the source and avoid inventing doctrine).',
  },

  // ---------------------------------------------------------------- A2-4
  {
    id: 'a02-04',
    code: 'A2-4',
    title: 'Havoc in Heaven',
    source: `${SRC}, ch. 3–5: the heavenly stables, the Peach Garden and the banquet`,
    audience: 'all',
    trigger: { where: WHERE, when: after('A2-3') },
    requires: ['A2-3'],
    speakers: [MONKEY, GARDENER, JADE],
    steps: [
      {
        id: 'a02-04-s1',
        goal: 'Go up to Heaven with Monkey and see what job they give him.',
        hint: 'Climb the cloud stair to the heavenly stables.',
        check: 'visit:a02-stables:heaven',
        scene: {
          id: 'a02-04-stables',
          lines: [
            N('Since the teacher, Monkey has been busy. He has an iron staff from the sea-dragons, and he has rubbed his name out of the Book of Life and Death.'),
            N('Heaven decides it would be simpler to give him a job. So up you all go.'),
            MK('Keeper of the Heavenly Horses! A grand title. They must think a lot of me.', 'happy'),
            N('He is very good with the horses. They grow fat and shiny, and your Nubbin rides one round the paddock.'),
            MK('Wait. What rank is Keeper of the Horses, exactly?'),
            N('A stable hand tells him: it is the lowest job in Heaven. Monkey throws down his hat and goes straight home.'),
            N('Heaven sighs, and tries again: Great Sage Equal to Heaven. A big title with no work at all.'),
          ],
        },
        done: {
          id: 'a02-04-stables-done',
          lines: [JE('Give him the Peach Garden to look after. It will keep him busy and out of trouble.', 'think')],
        },
      },
      {
        id: 'a02-04-s2',
        goal: 'Walk the Peach Garden with its keeper spirit.',
        hint: 'Follow the garden spirit along the rows of trees.',
        check: 'inspect:a02-peaches:garden',
        scene: {
          id: 'a02-04-garden',
          lines: [
            GS('Three thousand six hundred trees, Great Sage. These ripen every three thousand years. These, every six thousand.'),
            GS('And these at the back, every nine thousand. Eat one, and you live as long as heaven and earth.'),
            N('Your Nubbin has gone very still. It is looking at the peaches the way it looks at you at teatime.'),
            MK('Thank you. You may go. I shall inspect the trees alone. Very carefully.'),
            N('The spirit goes. Monkey shrinks to the size of your thumb, climbs the oldest tree, and eats the best peach on it.'),
            N('Then the next best. Then he falls asleep in a fork of the branches, round as a plum.'),
            N('A ripe peach drops into the grass at your Nubbin’s feet. It glows faintly, like a lamp turned low.'),
          ],
          choices: [
            {
              id: 'hang',
              label: 'Hang the peach back on its branch.',
              then: [
                N('You can’t, of course; it won’t stay. You put it gently at the foot of the tree instead.'),
                N('Your Nubbin watches you do it, sighs from its toes, and lets it go.'),
              ],
            },
            {
              id: 'sniff',
              label: 'Let your Nubbin sniff it, and no more.',
              then: [N('Your Nubbin sniffs it for a long, long time. It glows a tiny bit just from the smell, and leaves it be.')],
            },
          ],
        },
      },
      {
        id: 'a02-04-s3',
        goal: 'Follow Monkey to the Queen Mother’s banquet.',
        hint: 'Find the Jade Pool. Follow the sound of snoring servants.',
        check: 'watch:a02-banquet:jade-pool',
        scene: {
          id: 'a02-04-banquet',
          lines: [
            N('Seven fairy maidens come to pick peaches for the Queen Mother’s banquet. They find very few left.'),
            N('They tell him who is invited: everyone. Everyone except the Great Sage Equal to Heaven.'),
            MK('Everyone?', 'angry'),
            N('He freezes the maidens where they stand with one word, and is off to the Jade Pool before you can blink.'),
            N('He puts the servants to sleep and eats the whole banquet. Then he wanders into Lord Lao’s palace.'),
            N('On the table are five gourds of golden elixir pills. He eats them like roasted beans.'),
            MK('Oh. Oh, no. That might have been a mistake.', 'shock'),
            MK('Cousin! Keeper! Home! Now!'),
          ],
        },
      },
    ],
    complete: {
      id: 'a02-04-complete',
      lines: [
        N('Heaven sends its armies after him. They fight for days, and it is all dust and thunder and bonks on helmets.'),
        N('Nothing can hurt him now. He has eaten the peaches, the banquet and the elixir.'),
        MK('Ha! Equal to Heaven? I’m better than equal. Tell them, Cousin.', 'happy'),
        N('Your Nubbin, behind a rock, would rather not tell anybody anything.'),
        N('The fairy maidens unfreeze at last, look at the empty trees, and go to tell the Queen Mother.'),
      ],
    },
    rewards: [],
    sets: { 'a02-04': true },
    notes:
      'The peach glow is a soft pink-gold, the same colour as the A2-5 peach-tree reward’s fruit. Your Nubbin does ' +
      'not eat a stolen peach in either choice; it is given one freely in A2-5. The battle is offscreen-ish: a ' +
      'dust cloud with stars and helmets popping out. Lord Lao is mentioned, not mocked.',
  },

  // ---------------------------------------------------------------- A2-5
  {
    id: 'a02-05',
    code: 'A2-5',
    title: 'Under the Mountain',
    source: `${SRC}, ch. 6–7: the furnace, the wager on the Buddha’s palm, the Five Elements Mountain`,
    audience: 'all',
    trigger: { where: WHERE, when: after('A2-4') },
    requires: ['A2-4'],
    speakers: [MONKEY, BUDDHA, JADE, QUEEN],
    steps: [
      {
        id: 'a02-05-s1',
        goal: 'Watch from a safe corner while Monkey breaks out of Lord Lao’s furnace.',
        hint: 'Hide behind the big bronze cauldron in the Tushita Palace.',
        check: 'watch:a02-furnace:tushita',
        scene: {
          id: 'a02-05-furnace',
          lines: [
            N('In the end a great warrior and his dog catch Monkey, and nothing in Heaven can harm him. So Lord Lao puts him in his furnace.'),
            N('Forty-nine days the fire burns. Your Nubbin sits by the furnace door the whole time, worried, and won’t be moved.'),
            N('Monkey hides in the one corner where there is only wind. The smoke makes his eyes red, and then gold.'),
            N('On the forty-ninth day the lid comes off with a bang. Out jumps Monkey, with eyes like two little suns.'),
            MK('Cousin! You waited. Stand back. I’m going to be very rude to everyone.', 'happy'),
            N('He kicks the furnace over and runs the length of Heaven, scattering generals like skittles.'),
          ],
        },
        done: {
          id: 'a02-05-furnace-done',
          lines: [JE('Fetch the Buddha. Ask him, please, to come.', 'sad')],
        },
      },
      {
        id: 'a02-05-s2',
        goal: 'Witness the wager on the Buddha’s palm.',
        hint: 'Stand where you can see the Buddha’s open hand.',
        check: 'talk:a02-buddha:palm',
        scene: {
          id: 'a02-05-palm',
          lines: [
            N('The Buddha comes in quietly. Everything else goes quiet with him, even Monkey, for a breath.'),
            BU('What is it you want?', 'soft'),
            MK('The Jade Emperor’s throne. He’s had it long enough. It’s my turn.'),
            BU('Then here is a wager. Jump out of my right hand, and the throne is yours. If you cannot, go back down and learn.'),
            MK('Your hand? It isn’t a foot across. I go a hundred and eight thousand li in one somersault!', 'happy'),
            N('He jumps onto the open palm, and is gone in a streak of cloud.'),
            N('Your Nubbin is standing beside you, near the Buddha’s wrist. From here you can see everything.'),
            N('You can see Monkey fly to five pink pillars at the edge of the world, and write his title on the middle one.'),
            N('You can see that the pillars are fingers.'),
          ],
          choices: [
            {
              id: 'gentle',
              label: 'When he lands, tell him gently: it was the hand all along.',
              then: [MK('Rubbish. I went to the end of the world. I wrote my name on it.', 'angry')],
            },
            {
              id: 'quiet',
              label: 'Say nothing. Let the Buddha show him.',
              then: [N('You say nothing. The Buddha glances at you, briefly, and something in his face says thank you.')],
            },
          ],
        },
        done: {
          id: 'a02-05-palm-done',
          lines: [
            N('The Buddha lifts his hand. On the base of one finger, in very small and very familiar writing, is Monkey’s title.'),
            MK('That’s… that can’t… I went…', 'shock'),
          ],
        },
      },
      {
        id: 'a02-05-s3',
        goal: 'Stay by Monkey under the Five Elements Mountain.',
        hint: 'Climb down the mountainside to where his head sticks out.',
        check: 'sit:a02-monkey:five-elements',
        scene: {
          id: 'a02-05-mountain',
          lines: [
            N('The Buddha turns his hand over. It comes down gently and becomes a mountain with five peaks.'),
            N('Monkey is underneath, with only his head and one hand sticking out. He is not hurt, only, for the first time, stopped.'),
            BU('Feed him when he is hungry. Give him water when he is thirsty. When he has learned enough, someone will come.', 'soft'),
            MK('How long?', 'sad'),
            BU('As long as it takes. Not one day more.'),
            N('Your Nubbin climbs down and sits by Monkey’s free hand. Monkey holds on to one of its feet and says nothing at all.'),
          ],
        },
      },
    ],
    complete: {
      id: 'a02-05-complete',
      lines: [
        N('Heaven holds a feast to thank the Buddha. The Queen Mother of the West brings him a dish of her peaches.'),
        N('She looks at your Nubbin, who is trying very hard not to look at the peaches.'),
        QM('You stood by my trees and took nothing. Here. This one is given, not taken. That makes it a different fruit.', 'soft'),
        N('Your Nubbin eats it slowly, with its eyes shut, and glows all over like a paper lantern.'),
        QM('Keep the stone. Plant it somewhere you will be glad to see it.'),
        N('Then the page turns, and turns, and turns. Five hundred years go by, and you sit through all of them with Monkey.'),
        N('Grass grows in his ears, and moss on his hand. Your Nubbin keeps one foot in that hand the whole time.'),
      ],
    },
    rewards: [
      {
        id: 'a02-peach-tree',
        kind: 'decor',
        label: 'Immortal peach tree',
        description: 'A peach tree grown from the Queen Mother’s gift. Cosmetic; a Nubbin that eats its fruit glows softly for a while.',
      },
    ],
    sets: { 'a02-05': true },
    notes:
      'The Buddha is wise, calm and unhurried; the wager is told plainly and without any joke at his expense. The ' +
      'mountain is not a punishment shown as pain: Monkey is unhurt, and the earth spirits feed him (implied by ' +
      'the Buddha’s instruction). The five hundred years pass as a page-turn montage: seasons, snow on Monkey’s ' +
      'head, a bird nesting, your Nubbin still there. The peach-tree reward reaches the Grove at once (one-time). ' +
      'Its glow on a Nubbin is cosmetic and has no stat effect.',
  },

  // ---------------------------------------------------------------- A2-6
  {
    id: 'a02-06',
    code: 'A2-6',
    title: 'The Monk',
    source: `${SRC}, ch. 13–14: Tang Sanzang frees Monkey; the golden band`,
    audience: 'all',
    trigger: { where: WHERE, when: after('A2-5') },
    requires: ['A2-5'],
    speakers: [MONKEY, MONK, GUANYIN],
    steps: [
      {
        id: 'a02-06-s1',
        goal: 'Meet the monk on the road west, and take up his luggage.',
        hint: 'He is the one on the pale horse, looking at a map upside down.',
        check: 'escort:a02-monk:frontier',
        scene: {
          id: 'a02-06-road',
          lines: [
            N('A monk comes along the road on a pale horse. He has a begging bowl, a staff, a robe, and far too much luggage.'),
            MO('Good morning. Forgive me. Is this still the road west? Everyone who was walking with me has gone home.'),
            MO('I am Tang Sanzang. The emperor sent me to India, to bring back the true scriptures. It is a long way.', 'think'),
            N('He says “a long way” the way people say it about the bottom of the garden. He has no idea.'),
            MO('You are carrying nothing, and I am carrying everything. Would you think it rude if I asked?'),
            N('You take the luggage. It weighs about as much as your Nubbin, which climbs on top of it to make it heavier.'),
            MO('Thank you. Then you are my first disciple. No, my second. I keep forgetting the horse.', 'happy'),
          ],
        },
        done: {
          id: 'a02-06-road-done',
          lines: [N('From the mountain ahead, a voice you know shouts loud enough to shake the leaves.')],
        },
      },
      {
        id: 'a02-06-s2',
        goal: 'Help the monk climb up to the seal on the mountain.',
        hint: 'Hold the monk’s staff while he climbs to the golden paper at the top.',
        check: 'climb:a02-seal:summit',
        scene: {
          id: 'a02-06-seal',
          lines: [
            MK('Master! Master! You’ve come! A lady told me to wait for a monk, and I waited, and you’re a monk!', 'happy'),
            N('Monkey’s head sticks out of the mountainside, with grass in his ears. He sees your Nubbin and nearly cries.'),
            MK('Cousin. Cousin, you’re still here.', 'soft'),
            MO('Oh dear. Are you a demon?', 'shock'),
            MK('I’m your disciple. I’ve been your disciple for five hundred years. Go up and peel the paper off the top. Please.'),
            N('The monk climbs. You hold his staff and push when he slips, which is often.'),
            N('At the top there is a strip of gold paper. He peels it away, very carefully, as if it might mind.'),
          ],
        },
        done: {
          id: 'a02-06-seal-done',
          lines: [
            N('The mountain splits like bread. Monkey bounds out, bows four times to the monk, and hugs your Nubbin off its feet.'),
            MK('Right! Where are we going? India? Easy. I’ll have us there by lunch.', 'happy'),
          ],
        },
      },
      {
        id: 'a02-06-s3',
        goal: 'Keep the monk company while Monkey sulks, and see what the old woman gives him.',
        hint: 'Wait by the roadside where Monkey left you.',
        check: 'wait:a02-band:roadside',
        scene: {
          id: 'a02-06-band',
          lines: [
            N('Six robbers jump out of the trees. Monkey chases them over three hills with his staff, roaring, until there are no robbers anywhere.'),
            MO('You frightened them half to death! A monk must not frighten people half to death.', 'angry'),
            MK('Five hundred years under a mountain, and this is the thanks?', 'angry'),
            N('He somersaults off in a huff, and the road is suddenly very empty.'),
            N('An old woman comes along. She gives the monk a cap with a thin gold band, and teaches him a few quiet words.'),
            N('As she goes, she looks back at you. Her eyes are very kind and very old, and you are almost sure she isn’t an old woman.'),
            N('When Monkey comes back, a little sheepish, he sees the cap and puts it straight on.'),
            MK('Very fine. Does it suit me?', 'happy'),
            N('The monk murmurs the quiet words. The band tightens, and Monkey goes hopping round the road, holding his head.'),
          ],
          choices: [
            {
              id: 'stop',
              label: 'Ask the monk to stop.',
              then: [
                MO('Oh! Yes. Of course. I had no idea it would be so strong.', 'shock'),
                MO('I will only use it when I must. I promise you both.'),
              ],
            },
            {
              id: 'wait',
              label: 'Wait. He’s stopping already.',
              then: [N('The monk stops almost at once, looking as shaken as Monkey. He clearly had no idea it would be so strong.')],
            },
          ],
        },
      },
    ],
    complete: {
      id: 'a02-06-complete',
      lines: [
        N('Monkey tugs at the band. It won’t come off, and as far as anyone knows, it never will.'),
        MK('Fine. I’ll behave. Mostly. Some of the time.', 'sad'),
        MO('That is all anyone can promise.', 'soft'),
        N('You pick up the luggage, and your Nubbin climbs onto it. The four of you, and the horse, set off west.'),
      ],
    },
    rewards: [],
    sets: { 'a02-06': true },
    notes:
      'From here the Keeper is the “fifth disciple” in the page’s own count (the monk loses track): you carry the ' +
      'luggage pack on screen until A2-10, then share a pole with Sandy. The robbers are chased off, not killed ' +
      '(softened; see header). The old woman is Guanyin in disguise; she is never named here, and is drawn with a ' +
      'faint light about her. The band tightening is shown as a gold glint and hopping, no pain imagery.',
  },

  // ---------------------------------------------------------------- A2-7
  {
    id: 'a02-07',
    code: 'A2-7',
    title: 'The White Dragon Horse',
    source: `${SRC}, ch. 15: Eagle Grief Stream`,
    audience: 'all',
    trigger: { where: WHERE, when: after('A2-6') },
    requires: ['A2-6'],
    speakers: [MONKEY, MONK, GUANYIN, DRAGON],
    steps: [
      {
        id: 'a02-07-s1',
        goal: 'Walk with the pilgrims to Eagle Grief Stream.',
        hint: 'Follow the road down into the gorge.',
        check: 'walk:a02-stream:eagle-grief',
        scene: {
          id: 'a02-07-stream',
          lines: [
            N('Eagle Grief Stream runs fast and green between steep rocks. The horse doesn’t like it, and neither does your Nubbin.'),
            N('Out of the water comes a white dragon, all teeth and spray. It swallows the horse, saddle and all, and is gone.'),
            MO('My horse! How will I ever cross the world now?', 'sad'),
            MK('I’ll get it back. Wait there.', 'angry'),
            N('Monkey fights the dragon up and down the stream. Every time he gets close, it dives where he can’t follow.'),
            MK('It won’t come out. Water is cheating.', 'angry'),
            N('Your Nubbin, who likes water a great deal, peers down into the stream and sees a long white shape, sulking.'),
          ],
        },
        done: {
          id: 'a02-07-stream-done',
          lines: [MK('The local spirits say a lady put that dragon here. I know which lady. I’m fetching her.')],
        },
      },
      {
        id: 'a02-07-s2',
        goal: 'Meet Guanyin when she comes to the stream.',
        hint: 'Wait on the bank for the light on the water.',
        check: 'talk:a02-guanyin:stream',
        scene: {
          id: 'a02-07-guanyin',
          lines: [
            N('A light comes over the water like morning, though it is already afternoon. In it stands a lady with a vase and a willow branch.'),
            N('You know her eyes. She was the old woman on the road.'),
            MK('You gave him the band! You told him the words!', 'angry'),
            GY('I did. Without it, you would not listen to him. Without him, you would never get there.', 'soft'),
            GY('You are cleverer than all of them, Monkey. That is exactly why you need someone to walk beside.'),
            N('Monkey has no answer. Your Nubbin offers Guanyin a pebble, which is its highest honour, and she takes it.'),
          ],
        },
      },
      {
        id: 'a02-07-s3',
        goal: 'Watch the dragon become a horse.',
        hint: 'Stay at the water’s edge while Guanyin calls him.',
        check: 'watch:a02-dragon:stream',
        scene: {
          id: 'a02-07-dragon',
          lines: [
            GY('Prince Yulong. Come up. The monk you were told to wait for is standing on your bank.', 'soft'),
            N('The white dragon rises from the stream, dripping and ashamed of itself.'),
            DR('I didn’t know who he was. I was hungry, and cross, and sorry for myself.', 'sad'),
            GY('Then be something better. Carry him all the way, and you will be forgiven all the way.'),
            N('She touches his head with the willow branch. He shrinks and changes, and a white horse stands on the bank.'),
            N('The horse shakes the water out of his mane, straight over your Nubbin.'),
          ],
          choices: [
            {
              id: 'peach',
              label: 'Let your Nubbin give the horse its peach stone to sniff.',
              then: [N('The horse sniffs the stone and blows softly. Your Nubbin takes this as the start of a long friendship.')],
            },
            {
              id: 'stroke',
              label: 'Stroke his nose.',
              then: [N('He lets you. His nose is cool, like the inside of a river.')],
            },
          ],
        },
      },
    ],
    complete: {
      id: 'a02-07-complete',
      lines: [
        N('Guanyin gives Monkey three hairs from the willow branch, for the day he truly needs them. Then the light goes off the water.'),
        MO('A dragon. I am riding a dragon. Nobody at home will believe me.', 'happy'),
        MK('They won’t believe the rest of it either. Get used to it.'),
        N('The white horse doesn’t speak again. He carries the monk with great care, all the way.'),
      ],
    },
    rewards: [],
    sets: { 'a02-07': true },
    notes:
      'The dragon “swallows” the horse in one gulp, cartoon-style; no harm shown. Guanyin is drawn with calm and ' +
      'light, never comic; her answer to Monkey is the centre of the quest. The dragon prince speaks once, as a ' +
      'dragon (the source’s own speaking being, canon 31); as a horse he never speaks.',
  },

  // ---------------------------------------------------------------- A2-8
  {
    id: 'a02-08',
    code: 'A2-8',
    title: 'The Stolen Robe',
    source: `${SRC}, ch. 16–17: the Guanyin Chan Monastery and the Black Bear`,
    audience: 'all',
    trigger: { where: WHERE, when: after('A2-7') },
    requires: ['A2-7'],
    speakers: [MONKEY, MONK, ABBOT, BEAR, GUANYIN],
    steps: [
      {
        id: 'a02-08-s1',
        goal: 'Stay the night at the monastery, and keep an eye on the robe.',
        hint: 'You are in the guest hall. The robe is in the luggage you carry.',
        check: 'visit:a02-monastery:guest-hall',
        scene: {
          id: 'a02-08-hall',
          lines: [
            N('The monastery is rich and the abbot is very old. He has collected fine robes for two hundred years and shows you every one.'),
            AB('Seven hundred robes! Has anyone, anywhere, ever seen more?', 'happy'),
            MK('My master has one better than all of them. Show him, master.'),
            MO('Please, no. One should never show off to a collector.', 'think'),
            N('Monkey shows it anyway. It is the robe the Buddha himself sent with the monk, and the whole hall fills with light.'),
            AB('Oh. Oh my. May I borrow it, just for tonight? Only to look at. An old man’s eyes are slow.', 'soft'),
            N('The monk sighs, and says yes. The abbot looks at the robe the way your Nubbin looks at peaches, only worse.'),
          ],
        },
      },
      {
        id: 'a02-08-s2',
        goal: 'Wake up when the smoke comes, and get everyone out.',
        hint: 'Smoke means move. Check every door on the way out.',
        check: 'inspect:a02-fire:guest-hall',
        scene: {
          id: 'a02-08-fire',
          lines: [
            N('In the night your Nubbin wakes you by sitting on your face. There is smoke under the door.'),
            N('The abbot’s monks have piled firewood round the guest hall. They mean to keep the robe and blame the fire.'),
            N('Monkey is already awake. He has borrowed a fireproof cover from Heaven and spread it over the monk, who is still asleep.'),
            MK('And now a little wind. Let’s see whose hall burns.', 'angry'),
            N('He blows, and the fire turns round and goes the other way, straight into the abbot’s own halls.'),
            N('Your Nubbin is already at the door, pulling your sleeve towards the cloisters where the young monks sleep.'),
          ],
          choices: [
            {
              id: 'shout',
              label: 'Run and shout until every monk is out.',
              then: [
                N('You run through the cloisters shouting. Monks tumble out of doorways in their nightclothes, coughing, all safe.'),
                MK('You’re rescuing them? They lit it!', 'shock'),
                N('Monkey grumbles. Then he blows the fire away from the dormitory, just slightly.'),
              ],
            },
            {
              id: 'wake',
              label: 'Wake the monk. He would want to know.',
              then: [
                MO('Fire? Then everyone out. Everyone, Wukong. I don’t care who started it.', 'shock'),
                N('Monkey groans, and blows the fire away from the dormitory.'),
              ],
            },
          ],
        },
        done: {
          id: 'a02-08-fire-done',
          lines: [
            N('On the hill above, something large and black has come down to “help” with the fire. It finds the robe instead.'),
            N('By morning the robe is gone, and so is the black shape, and the abbot is nowhere to be seen.'),
          ],
        },
      },
      {
        id: 'a02-08-s3',
        goal: 'Go with Monkey and Guanyin to Black Wind Mountain to get the robe back.',
        hint: 'The Black Bear is holding a party in his cave. You’re carrying the pill on a dish.',
        check: 'find:a02-robe:black-wind',
        scene: {
          id: 'a02-08-bear',
          lines: [
            N('On Black Wind Mountain, the Black Bear is planning a party called the Feast of the Buddha’s Robe. He is very pleased with the name.'),
            N('Guanyin has come. She takes the shape of the Bear’s friend, a guest on his way to the feast.'),
            N('Monkey turns himself into a pill, a little round red one. You carry it up the mountain on a dish.'),
            BR('A gift from my old friend! How kind. I’ll take it straight away.', 'happy'),
            N('He swallows it. There is a short silence, and then a great deal of somersaulting inside the Bear.'),
            BR('Ow. Ow! All right! The robe! Take the robe!', 'shock'),
          ],
          choices: [
            {
              id: 'sorry',
              label: 'Tell the Bear you’re sorry about his tummy.',
              then: [BR('So am I. You’re the only one who has said so.', 'sad')],
            },
            {
              id: 'robe',
              label: 'Hold out your arms for the robe.',
              then: [N('The robe comes back into your arms, warm and faintly smoky. Your Nubbin smooths it flat, very seriously.')],
            },
          ],
        },
      },
    ],
    complete: {
      id: 'a02-08-complete',
      lines: [
        N('Monkey pops out of the Bear’s mouth, very pleased with himself. The Bear sits down hard.'),
        GY('You have a strong arm and a greedy heart. Come and guard my mountain. It will use the one and quiet the other.', 'soft'),
        BR('Yes. All right. Thank you. I think.', 'sad'),
        N('Back at the monastery the monks sweep up very quietly. The monk gives them the last of his rice, which surprises them most of all.'),
      ],
    },
    rewards: [],
    sets: { 'a02-08': true },
    notes:
      'The abbot is the novel’s greedy monk; he is a person who wanted a thing too much, not a joke about monks. ' +
      'His fate in the novel is left out (care note). The fire never touches anyone: show smoke and orange glow, and ' +
      'every monk safe in both choices. Monkey “somersaulting inside the Bear” is shown from outside only (the Bear ' +
      'bouncing, cartoon stars).',
  },

  // ---------------------------------------------------------------- A2-9
  {
    id: 'a02-09',
    code: 'A2-9',
    title: 'Pigsy',
    source: `${SRC}, ch. 18–19: Gao Village`,
    audience: 'all',
    trigger: { where: WHERE, when: after('A2-8') },
    requires: ['A2-8'],
    speakers: [MONKEY, MONK, GAO, PIGSY],
    steps: [
      {
        id: 'a02-09-s1',
        goal: 'Hear Old Gao’s trouble with his son-in-law.',
        hint: 'Old Gao is the farmer wringing his hat at the gate.',
        check: 'talk:a02-gao:farm',
        scene: {
          id: 'a02-09-gao',
          lines: [
            GA('He came three years ago. A fine strong young man. He ploughed without an ox, and dug without a spade.', 'sad'),
            GA('Then his face started to change. Now he has big ears and a long snout, and eats a whole barn a week.'),
            GA('And he’s shut my daughter in the back house and won’t let anyone see her. Can you send him away?'),
            MK('A monster with big ears who eats a lot? I’ll sort it. I’ll need a dress.', 'happy'),
            MO('A what?', 'shock'),
            MK('A dress. Trust me.'),
          ],
        },
      },
      {
        id: 'a02-09-s2',
        goal: 'Hide in the back house with “Miss Gao” and wait for the son-in-law.',
        hint: 'Keep your Nubbin quiet behind the screen.',
        check: 'wait:a02-backhouse:night',
        scene: {
          id: 'a02-09-backhouse',
          lines: [
            N('Miss Gao goes safely home to her father. In her bed, in her nightcap, lies Monkey, looking deeply unconvincing.'),
            N('You and your Nubbin hide behind a screen. Your Nubbin has its paws over its mouth, just in case.'),
            N('A wind blows the door open. In comes a big, round, black-bristled fellow with a snout, carrying flowers.'),
            PG('I brought you some flowers. I picked them myself, mostly. Why are you so hairy tonight, my dear?', 'soft'),
            MK('I’m not well. My father says he’ll fetch a holy man to chase you off.', 'sad'),
            PG('Ha! Let him. Nobody can catch me. Unless it’s that stone monkey who caused all that havoc in Heaven. I’m not scared of anybody else.'),
            MK('Funny you should say that.', 'happy'),
            N('Monkey sits up and pulls off the nightcap. The son-in-law gives a squeal and is out of the window in a gust of wind.'),
          ],
        },
        done: {
          id: 'a02-09-backhouse-done',
          lines: [N('Your Nubbin picks up the dropped flowers and keeps them. Somebody ought to.')],
        },
      },
      {
        id: 'a02-09-s3',
        goal: 'Follow the chase to the Cloud-Pathway Cave.',
        hint: 'Follow the trail of dropped flowers and crumbs into the hills.',
        check: 'talk:a02-pigsy:cloud-pathway',
        scene: {
          id: 'a02-09-cave',
          lines: [
            N('Monkey and the son-in-law fight all night outside his cave, staff against nine-toothed rake.'),
            PG('Who are you, anyway? What are you doing here?', 'angry'),
            MK('Escorting a monk from the East to fetch the scriptures. Tang Sanzang. You won’t have heard of him.'),
            N('The rake drops. The pig-faced fellow goes pink all over.'),
            PG('Tang Sanzang? The lady told me to wait for him! I’ve been waiting! I just got hungry while I waited.', 'shock'),
            PG('I used to be a marshal in Heaven, you know. I got a bit too merry at a party. Long story.', 'sad'),
          ],
          choices: [
            {
              id: 'flowers',
              label: 'Let your Nubbin give him back his flowers.',
              then: [PG('You kept them! Oh, you’re a good little thing. I’m going to like you.', 'happy')],
            },
            {
              id: 'welcome',
              label: 'Tell him there’s room on the road.',
              then: [PG('Is there room for lunch on the road? That’s the main thing.', 'happy')],
            },
          ],
        },
      },
    ],
    complete: {
      id: 'a02-09-complete',
      lines: [
        N('He burns his cave down to show he means it, and walks back to Gao Village with his rake over his shoulder.'),
        MO('You shall be called Bajie. It means Eight Rules. They are mostly about not eating.', 'soft'),
        PG('Pigsy for short. Everyone does.'),
        PG('Father-in-law, keep my room for me, will you? Just in case the scriptures don’t work out.'),
        N('Old Gao says nothing, very politely. Pigsy takes the luggage pole for a whole mile before giving it back to you.'),
      ],
    },
    rewards: [],
    sets: { 'a02-09': true },
    notes:
      'Played for comedy, as the novel plays it. Miss Gao is safe with her father before the trick; she is never in ' +
      'the scene. Pigsy is lazy, greedy and lovable, never cruel; his “too merry at a party” line keeps the novel’s ' +
      'reason for his banishment child-safe. “Eight Rules” glosses the name Bajie in our own words.',
  },

  // ---------------------------------------------------------------- A2-10
  {
    id: 'a02-10',
    code: 'A2-10',
    title: 'Sandy',
    source: `${SRC}, ch. 22: the River of Flowing Sands`,
    audience: 'all',
    trigger: { where: WHERE, when: after('A2-9') },
    requires: ['A2-9'],
    speakers: [MONKEY, MONK, PIGSY, SANDY, MOKSA],
    steps: [
      {
        id: 'a02-10-s1',
        goal: 'Find a way across the River of Flowing Sands.',
        hint: 'Walk the bank. Look for anything that floats.',
        check: 'walk:a02-river:flowing-sands',
        scene: {
          id: 'a02-10-river',
          lines: [
            N('The River of Flowing Sands is eight hundred li wide and the colour of weak tea. A stone on the bank says that not even a feather floats on it.'),
            N('Your Nubbin drops a feather in, to check. It sinks.'),
            PG('Well, that’s that. Back to Gao Village, everyone.', 'happy'),
            N('Out of the water, with a roar, comes a big blue-faced river spirit with a monk’s spade. He grabs for the monk.'),
            N('Monkey knocks him back, and Pigsy dives in after him. They splash and bellow and come up spitting sand.'),
            MK('I can’t fight in water. Pigsy can, but Pigsy keeps stopping for a rest.', 'angry'),
          ],
        },
      },
      {
        id: 'a02-10-s2',
        goal: 'Swim down with your Nubbin and see what the river spirit is.',
        hint: 'Your Nubbin swims better than anyone here. Follow it down.',
        check: 'swim:a02-river:sandy',
        scene: {
          id: 'a02-10-under',
          lines: [
            N('Your Nubbin slips into the river without a splash. You hold your breath and follow it.'),
            N('Down in the brown water, the river spirit is sitting on a rock by himself, with his chin on his spade.'),
            N('He is not frightening down here. He looks like someone who has been waiting a very long time for a bus.'),
            SD('Another one. Every traveller who comes to this river wants to fight me, or run away.', 'sad'),
            SD('I used to lift the curtains in Heaven. I broke a crystal cup. One cup. They sent me here.'),
            N('Your Nubbin pats his knee. He looks at it with great surprise, and then, slowly, pats it back.'),
          ],
        },
        done: {
          id: 'a02-10-under-done',
          lines: [N('You come up gasping. Monkey has already somersaulted off to fetch help from the South Sea.')],
        },
      },
      {
        id: 'a02-10-s3',
        goal: 'Wait on the bank for Guanyin’s messenger.',
        hint: 'Sit by the luggage. Help is coming over the water.',
        check: 'wait:a02-moksa:bank',
        scene: {
          id: 'a02-10-moksa',
          lines: [
            N('Monkey comes back with Moksa, Guanyin’s disciple, who carries a small red gourd.'),
            MS('Sha Wujing! The monk you were told to wait for is on the bank. Come up.'),
            N('The river spirit comes up out of the water at once, spade over his shoulder, and kneels on the sand.'),
            SD('I didn’t know. Nobody told me he’d look so ordinary.', 'shock'),
            MO('I am very ordinary. That is rather the point.', 'soft'),
            N('Moksa sets the red gourd on the water. It grows into a raft, steady as a floor.'),
          ],
          choices: [
            {
              id: 'pole',
              label: 'Offer Sandy the other end of the luggage pole.',
              then: [SD('Thank you. I’ll carry it. I like carrying things. You know where you are with a weight.', 'soft')],
            },
            {
              id: 'raft',
              label: 'Help Sandy load the raft.',
              then: [N('He loads it neatly, heaviest at the bottom. Pigsy sits on the lightest bit and calls it helping.')],
            },
          ],
        },
      },
    ],
    complete: {
      id: 'a02-10-complete',
      lines: [
        N('The raft crosses eight hundred li in what feels like an afternoon. On the far bank it shrinks back into a gourd.'),
        MO('Wujing. Sha Wujing. We shall call you Sandy.', 'soft'),
        MO('Wukong, Bajie, Wujing, the horse, and you. My fifth disciple. I think I have the count right at last.', 'happy'),
        N('Now there are six of you, and the horse. Sandy takes the back end of the luggage pole, and you take the front.'),
        N('It is much easier like that. Your Nubbin rides in the middle and does the steering.'),
      ],
    },
    rewards: [],
    sets: { 'a02-10': true },
    notes:
      'Sandy’s fiercer details from the novel (his necklace, the flying swords) are left out (care note). He is ' +
      'quiet, steady and kind, and becomes the Keeper’s pole partner: from here, the luggage is a pole with a pack ' +
      'at each end, you in front, Sandy behind. Underwater, you can hold your breath as long as the scene needs.',
  },

  // ---------------------------------------------------------------- A2-11
  {
    id: 'a02-11',
    code: 'A2-11',
    title: 'The Ginseng Fruit',
    source: `${SRC}, ch. 24–26: the Temple of Five Villages`,
    audience: 'all',
    trigger: { where: WHERE, when: after('A2-10') },
    requires: ['A2-10'],
    speakers: [MONKEY, MONK, PIGSY, SANDY, MOON, WIND, ZHENYUAN, GUANYIN],
    steps: [
      {
        id: 'a02-11-s1',
        goal: 'Stay at the Temple of Five Villages while its master is away.',
        hint: 'The two young acolytes are expecting you in the hall.',
        check: 'visit:a02-temple:five-villages',
        scene: {
          id: 'a02-11-temple',
          lines: [
            N('The temple is quiet and lovely. Its master is away, and two young acolytes, Bright Moon and Pure Wind, look after it.'),
            BM('Our master said a monk would come, and we were to give him two of the fruits from the tree.'),
            PW('They ripen once in nine thousand years. Smell one, and you live three hundred and sixty years.'),
            N('They bring two fruits on a dish. Each is shaped like a tiny sleeping baby.'),
            MO('No! No, no. Take them away. I couldn’t possibly.', 'shock'),
            BM('They’re fruit. They grow on a tree.'),
            MO('Take them away, please.'),
            N('So the acolytes eat them themselves, in the kitchen. Pigsy, listening at the wall, makes a small hungry sound.'),
          ],
        },
      },
      {
        id: 'a02-11-s2',
        goal: 'See what happens when Pigsy talks Monkey into it.',
        hint: 'The tree is in the walled garden behind the kitchen.',
        check: 'inspect:a02-tree:garden',
        scene: {
          id: 'a02-11-tree',
          lines: [
            PG('Brother. Elder brother. Wise and handsome brother. Just three. One each. Nobody would notice.', 'soft'),
            N('Monkey knocks a fruit down with a golden rod. It hits the ground and sinks straight into it, like water.'),
            N('He knocks down three more and catches them in his robe. Monkey, Pigsy and Sandy eat one each, very fast.'),
            PG('I didn’t taste it. I swallowed it whole. Get me another so I can taste it.', 'sad'),
            N('The acolytes count their fruit and come back shouting thief. They shout it a great many times.'),
            MK('Thief? Thief? Fine. Then nobody gets any.', 'angry'),
            N('Monkey goes back to the garden in a temper and pushes the whole tree over. Its roots come up out of the ground.'),
          ],
          choices: [
            {
              id: 'own',
              label: 'Tell the acolytes the truth: you saw it all.',
              then: [
                BM('Thank you. At least someone in this party is honest.', 'sad'),
                N('Monkey glares at you. Then, after a moment, he stops glaring.'),
              ],
            },
            {
              id: 'tree',
              label: 'Go and kneel by the fallen tree.',
              then: [N('Its leaves are already curling. Your Nubbin lies down beside the roots, the way it lies by anything that’s hurt.')],
            },
          ],
        },
        done: {
          id: 'a02-11-tree-done',
          lines: [
            N('Master Zhenyuan comes home that night. With one sweep of his sleeve he scoops up all six of you and the horse, like crumbs.'),
            ZY('Mend my tree, and I will let you go. I don’t much mind how.', 'angry'),
          ],
        },
      },
      {
        id: 'a02-11-s3',
        goal: 'Help Guanyin bring the tree back to life.',
        hint: 'Carry water in the jade cups and pour where Guanyin tells you.',
        check: 'carry:a02-dew:tree',
        scene: {
          id: 'a02-11-mend',
          lines: [
            N('Monkey searches the three islands of the immortals for a cure, and nobody has one. At last he goes to the South Sea.'),
            N('Guanyin comes with her vase. She draws a sign on Monkey’s palm and has him lay his hand on the roots.'),
            GY('Bring water. Jade cups only. Pour gently.', 'soft'),
            N('You carry cup after cup. Your Nubbin carries a very small cup, and pours very slowly, and gets most of it in.'),
            N('Guanyin dips her willow branch in the vase and sprinkles the dew over all of it.'),
            N('The tree stands up, and its leaves uncurl, green and glossy. There are fruit on it, exactly the right number.'),
          ],
        },
      },
    ],
    complete: {
      id: 'a02-11-complete',
      lines: [
        ZY('Well. That is the most trouble anyone has caused me in a thousand years. Come and eat with me.', 'happy'),
        N('There is a feast of the ginseng fruit. This time the monk eats one, now he knows it is only fruit.'),
        MO('It tastes like the first morning of spring.', 'soft'),
        N('Master Zhenyuan and Monkey swear to be brothers. Monkey looks almost embarrassed, which is new.'),
      ],
    },
    rewards: [],
    sets: { 'a02-11': true },
    notes:
      'The baby-shaped fruit is said once, plainly, as the monk’s reason (care note); draw them as small pale round ' +
      'fruit with a soft suggestion of a curled shape, nothing more. Your Nubbin does not eat one. Zhenyuan’s ' +
      'sleeve scoop is a comic gust; nobody is harmed. Guanyin restores the tree; she is the calm centre of the scene.',
  },

  // ---------------------------------------------------------------- A2-12
  {
    id: 'a02-12',
    code: 'A2-12',
    title: 'The White Bone Demon',
    source: `${SRC}, ch. 27–31: White Tiger Ridge, the banishing and the return`,
    audience: 'all',
    trigger: { where: WHERE, when: after('A2-11') },
    requires: ['A2-11'],
    speakers: [MONKEY, MONK, PIGSY, SANDY, BONE],
    steps: [
      {
        id: 'a02-12-s1',
        goal: 'Watch the girl with the basket on White Tiger Ridge.',
        hint: 'Stay with the monk. Keep your eyes open.',
        check: 'watch:a02-girl:white-tiger-ridge',
        scene: {
          id: 'a02-12-girl',
          lines: [
            N('White Tiger Ridge is all bare rock and thin wind. The monk is hungry, and Monkey has gone to find fruit.'),
            N('A girl comes down the path with a basket of rice and noodles. She smiles at everyone and doesn’t blink.'),
            BN('Kind travellers! Please, eat. I brought this up for my father, but you need it more.', 'soft'),
            N('Your Nubbin hides behind your legs. It has never once hidden from somebody with food.'),
            N('Monkey comes back, takes one look, and swings his staff. The girl crumples like an empty coat, and a cold puff of air goes up.'),
            MO('Wukong! She was only a girl with a basket!', 'shock'),
            MK('She was a demon. Look in the basket.'),
            N('In the basket there are no noodles, only worms and frogs, wriggling. The monk looks, and looks away.'),
            PG('He’s turned the noodles into worms so you won’t be cross with him. He can do that, you know.'),
          ],
        },
        done: {
          id: 'a02-12-girl-done',
          lines: [N('The monk says the quiet words. Monkey holds his head and says nothing back.')],
        },
      },
      {
        id: 'a02-12-s2',
        goal: 'Watch the old woman who comes looking for her daughter.',
        hint: 'She is coming up the path with a bamboo stick.',
        check: 'watch:a02-old-woman:white-tiger-ridge',
        scene: {
          id: 'a02-12-old-woman',
          lines: [
            N('An old woman comes up the path, leaning on a stick, weeping. She is looking for her daughter.'),
            BN('Have you seen my girl? She went this way with a basket.', 'sad'),
            N('She doesn’t blink either. Your Nubbin is pressed so hard against your ankles you can feel it shaking.'),
            N('Monkey swings again. The old woman folds away like paper, and a puff of cold air goes up and over the ridge.'),
            MO('Twice! Twice in one morning!', 'angry'),
            MK('The same demon twice. She keeps getting away, and she keeps coming back.', 'angry'),
          ],
        },
      },
      {
        id: 'a02-12-s3',
        goal: 'Decide who you believe.',
        hint: 'You have seen everything the monk has seen. Choose.',
        check: 'choose:a02-believe:white-tiger-ridge',
        scene: {
          id: 'a02-12-bones',
          lines: [
            N('An old man comes last, fingering prayer beads, looking for his wife and daughter. He does not blink.'),
            N('This time Monkey calls the mountain spirits to stand guard, so she can’t slip away. Then he swings.'),
            N('The old man folds up like an empty coat. Where he stood lies a small heap of white bones, chalky as old shells.'),
            MK('There. Bones. There’s your demon. Now do you believe me?', 'angry'),
            PG('He’s made them look like bones. It’s a trick, so you’ll stop saying the words.', 'think'),
            MO('Three people, Wukong. A girl, her mother, her father. I can’t walk beside someone who does that.', 'sad'),
            N('The monk writes a letter of dismissal and holds it out. Then everybody, even Monkey, looks at you.'),
            MO('You carry our things. You have seen all we have seen. What do you think?', 'sad'),
          ],
          choices: [
            {
              id: 'monkey',
              label: 'Believe Monkey. You saw your Nubbin hide.',
              set: { 'a02-believed': 'monkey' },
              then: [
                Y('I believe him. My Nubbin hid from her three times. It never hides from anyone.'),
                MO('A Nubbin’s feelings are not proof. I am sorry. I can’t risk it.', 'sad'),
                MK('Cousin’s keeper. Thank you. Remember you said it.', 'soft'),
              ],
            },
            {
              id: 'monk',
              label: 'Believe the monk. You can’t strike people on a hunch.',
              set: { 'a02-believed': 'monk' },
              then: [
                Y('Even if you’re right, you can’t just hit people because you’re sure.'),
                MK('I wasn’t sure. I knew.', 'angry'),
                MK('Fine. Remember you said it, Cousin’s keeper.', 'sad'),
              ],
            },
          ],
        },
        done: {
          id: 'a02-12-bones-done',
          lines: [
            N('Monkey can’t leave without bowing to his master, and the monk won’t look at him. So he pulls three hairs and blows on them.'),
            N('Three more Monkeys appear, and the monk is surrounded. Four bows, on every side, all the way to the ground.'),
            N('Then Monkey is gone, and your Nubbin sits in the road looking at the place where he was.'),
          ],
        },
      },
      {
        id: 'a02-12-s4',
        goal: 'Go with Pigsy to the Mountain of Flowers and Fruit and bring Monkey back.',
        hint: 'The monk has been caught by the Yellow Robe demon. Only Monkey can help.',
        check: 'walk:a02-pigsy:flowers-mountain',
        scene: {
          id: 'a02-12-return',
          lines: [
            N('Without Monkey, it goes badly. A demon in a yellow robe catches the monk and turns him into a tiger, of all things.'),
            PG('I’ll have to fetch him. I’ll have to say sorry. I hate saying sorry. You come too, it’s easier with two.', 'sad'),
            N('Back at the Mountain of Flowers and Fruit, Monkey is king again, with his feet up. Your Nubbin runs at him and he catches it.'),
            PG('The demon says he isn’t frightened of you. Says you’re just a jumped-up monkey.', 'think'),
            MK('He said that? He said that? Right.', 'angry'),
            N('Pigsy winks at you. It is the cleverest thing you have ever seen him do.'),
          ],
        },
        done: {
          id: 'a02-12-return-done',
          lines: [
            N('Monkey beats the demon, and the monk is a monk again, shaking and ashamed.'),
            MO('I was wrong to send you away, Wukong. I am sorry.', 'sad'),
            MK('You were wrong about her. You weren’t wrong to be scared of what I can do. I’m scared of it too, sometimes.', 'soft'),
          ],
        },
      },
    ],
    complete: {
      id: 'a02-12-complete',
      lines: [
        N('The monk takes Monkey’s hand in both of his. It is the first time either of them has done that.'),
        N('Sandy picks up the back of the luggage pole. You pick up the front.'),
        MK('Cousin’s keeper. I haven’t forgotten what you said.', 'think'),
        N('He doesn’t say whether that is good or bad. Your Nubbin rides on his shoulder for the rest of the day.'),
      ],
    },
    rewards: [],
    sets: { 'a02-12': true },
    notes:
      'SIGNATURE CHOICE (a02-12-bones): a02-believed = monkey | monk. Paid off in A2-15 (a02-15-which or the variant ' +
      'a02-15-which-monk) and A2-19 (a02-19-complete or a02-19-complete-monk). Neither answer is “wrong”: the ' +
      'demon is real, and the monk’s fear is fair; both routes reconcile in step 4. CARE: the three disguises ' +
      'crumple like empty coats and give off a puff of cold air; the heap of bones is chalky, small and fairy-tale, ' +
      'like beach bones, with no skull close-up. The worms and frogs are cartoon wriggles. The monk-as-tiger is ' +
      'brief and comic-sad. Steps 1–3 are ch. 27; step 4 condenses ch. 28–31.',
  },

  // ---------------------------------------------------------------- A2-13
  {
    id: 'a02-13',
    code: 'A2-13',
    title: 'The Magic Gourd',
    source: `${SRC}, ch. 32–35: Lotus Flower Cave`,
    audience: 'all',
    trigger: { where: WHERE, when: after('A2-12') },
    requires: ['A2-12'],
    speakers: [MONKEY, PIGSY, SANDY, SILVER, LAO],
    steps: [
      {
        id: 'a02-13-s1',
        goal: 'Hear the rule of the gourd from Monkey.',
        hint: 'Find Monkey in the pine wood. He’s just escaped from something.',
        check: 'talk:a02-monkey:pine-wood',
        scene: {
          id: 'a02-13-rule',
          lines: [
            N('On Level Top Mountain live two demon brothers, Gold Horn and Silver Horn. They have caught the monk and Pigsy already.'),
            MK('They have a gourd. Purple and gold. They call your name, and if you answer, whoosh, you’re inside it.'),
            SD('So don’t answer.'),
            MK('I answered. I gave them a made-up name, and answered to that, and it still got me. It doesn’t care if the name is real.', 'think'),
            MK('It only cares that you answered. I got out by pretending I’d melted. Don’t ask.'),
            N('Your Nubbin looks very hard at its own mouth, as if to check it is shut.'),
          ],
        },
      },
      {
        id: 'a02-13-s2',
        goal: 'Walk past the gourd without answering.',
        hint: 'Whatever you hear, keep walking and keep your mouth shut.',
        check: 'wait:a02-gourd:lotus-cave',
        scene: {
          id: 'a02-13-gourd',
          lines: [
            N('Silver Horn stands at the cave mouth with the gourd held upside down, and calls into the trees.'),
            SH('Little round one! You, with the big eyes! Little Nubbin!'),
            N('Your Nubbin looks at him, and blinks, and says nothing. It has never said anything in its life.'),
            SH('Answer me! It’s rude not to answer!', 'angry'),
            N('It blinks again. Silver Horn shakes the gourd, as if it might be broken.'),
            SH('All right. You, then. The one carrying the luggage. Answer me!'),
          ],
          choices: [
            {
              id: 'silent',
              label: 'Keep your mouth shut, like your Nubbin.',
              then: [N('You say nothing. Your Nubbin looks up at you with enormous approval.')],
            },
            {
              id: 'answer',
              label: 'Start to say, “Who wants to know?”',
              then: [
                N('You get as far as “Who” before the gourd begins to pull. Monkey yanks you behind a rock by the collar.'),
                MK('What did I just say? What did I literally just say?', 'shock'),
              ],
            },
          ],
        },
      },
      {
        id: 'a02-13-s3',
        goal: 'Watch Monkey turn the gourd on its owner.',
        hint: 'Monkey has swapped the gourds. Stay behind the rock.',
        check: 'watch:a02-gourd:lotus-cave',
        scene: {
          id: 'a02-13-swap',
          lines: [
            N('While Silver Horn shouts at your Nubbin, a little fly lands on his sleeve. A moment later his gourd has been swapped for a fake.'),
            N('Monkey stands on a rock with the real one, upside down.'),
            MK('Silver Horn!', 'happy'),
            SH('What?', 'angry'),
            N('Whoosh. Monkey puts the stopper in, and shakes the gourd next to his ear.'),
            MK('Never answer to your own name, little brother. Didn’t anyone tell you?', 'happy'),
          ],
        },
        done: {
          id: 'a02-13-swap-done',
          lines: [N('Gold Horn goes the same way before the afternoon is out. Sandy unties the monk, and Pigsy, who complains the whole time.')],
        },
      },
    ],
    complete: {
      id: 'a02-13-complete',
      lines: [
        N('An old man with a long white beard comes walking out of the clouds. It is Lord Lao, looking a little tired.'),
        LL('Those two are my furnace boys. They ran off with my gourd and my fan and my good rope. May I have them back?'),
        MK('You might have kept a closer eye on them.', 'think'),
        LL('So might the Jade Emperor, on you. And yet here we all are.', 'soft'),
        N('He lets Silver Horn out of the gourd and leads both brothers home by the ear. Your Nubbin is still not saying anything.'),
      ],
    },
    rewards: [],
    sets: { 'a02-13': true },
    notes:
      'A Nubbin can’t answer because Nubbins don’t speak: that is the joke and the win, and the Keeper’s choice ' +
      'never fails (Monkey pulls you clear). The gourd’s pull is a swirl and a whoosh, nobody hurt. Lord Lao is ' +
      'dignified and dry. Condenses ch. 32–35; Gold Horn is not a speaker.',
  },

  // ---------------------------------------------------------------- A2-14
  {
    id: 'a02-14',
    code: 'A2-14',
    title: 'Red Boy',
    source: `${SRC}, ch. 40–42: Fire Cloud Cave`,
    audience: 'all',
    trigger: { where: WHERE, when: after('A2-13') },
    requires: ['A2-13'],
    speakers: [MONKEY, MONK, PIGSY, SANDY, REDBOY, GUANYIN],
    steps: [
      {
        id: 'a02-14-s1',
        goal: 'Find out who is crying in the pine tree.',
        hint: 'The crying comes from the tall pine on the left of the road.',
        check: 'inspect:a02-boy:pine',
        scene: {
          id: 'a02-14-pine',
          lines: [
            N('A child is tied to the top of a pine tree, crying for help. He is about seven, with a red jacket and a hopeful face.'),
            RB('Robbers left me here! Please, kind master, take me home!', 'sad'),
            MO('Wukong, untie him at once and carry him.'),
            N('Monkey looks at the boy. Then he looks at you, the way he looked at you on White Tiger Ridge.'),
            MK('Master, a child doesn’t tie himself to the top of a pine tree. Robbers aren’t that tidy.', 'think'),
            MO('Wukong. A child is crying. Untie him.', 'angry'),
          ],
          choices: [
            {
              id: 'eyes',
              label: 'Look at your Nubbin first.',
              then: [
                N('Your Nubbin isn’t hiding. It is staring at the boy with its head on one side, puzzled, as if he smells of bonfires.'),
                MK('Puzzled. Not scared. Good. I’ll carry him. Carefully.', 'think'),
              ],
            },
            {
              id: 'help',
              label: 'Help untie him.',
              then: [N('The knots are very easy to undo, too easy. Monkey takes the boy on his back without a word.')],
            },
          ],
        },
        done: {
          id: 'a02-14-pine-done',
          lines: [
            N('The boy makes himself as heavy as a mountain on Monkey’s back. Then, with a gust of wind, he and the monk are gone.'),
            MK('Of course. Of course he was.', 'angry'),
          ],
        },
      },
      {
        id: 'a02-14-s2',
        goal: 'Carry cold water to Monkey at Fire Cloud Cave.',
        hint: 'Fill the bucket at the stream and run it to Monkey.',
        check: 'carry:a02-water:fire-cloud-cave',
        scene: {
          id: 'a02-14-fire',
          lines: [
            N('At Fire Cloud Cave the boy comes out with a spear, pushes two little carts in front of him, and breathes fire.'),
            RB('I am Red Boy! The Bull Demon King is my father. You’re supposed to be my uncle, but I don’t care.', 'happy'),
            N('Monkey calls the dragon kings, and they rain on the fire. It only burns hotter: this fire doesn’t mind water at all.'),
            N('Monkey comes out singed and smoking, and dives into a cold stream to cool off. The cold knocks him flat.'),
            SD('Water. More water, cold. Not too fast.', 'shock'),
            N('You run with the bucket. Pigsy rubs Monkey’s back and hands, the way you rub a cold child after a swim.'),
            N('Your Nubbin lies on Monkey’s chest, because that is where it would want someone to lie.'),
          ],
        },
        done: {
          id: 'a02-14-fire-done',
          lines: [
            MK('Ugh. I’m all right. I’m all right. Get off, Cousin. No, stay there a minute.', 'soft'),
            MK('Fire I can’t beat, demon I can’t catch. There’s only one person for this.'),
          ],
        },
      },
      {
        id: 'a02-14-s3',
        goal: 'Go with Monkey to fetch Guanyin, and watch her deal with Red Boy.',
        hint: 'Stand back at the cave mouth when Guanyin arrives.',
        check: 'talk:a02-guanyin:fire-cloud-cave',
        scene: {
          id: 'a02-14-lotus',
          lines: [
            N('Guanyin comes from the South Sea. She sets a lotus seat on the ground outside the cave, and steps away from it.'),
            GY('Bring him out, Monkey. Then let him see this seat.', 'soft'),
            N('Red Boy chases Monkey out, sees the lovely lotus seat with nobody on it, and sits straight down on it, laughing.'),
            N('The seat closes gently round him like a flower at evening. He can’t get up, and the fire goes out of him.'),
            RB('Let me go! Let me go! I want my mother!', 'sad'),
            GY('You shall see her. But first, you shall learn a little. Will you come with me?', 'soft'),
            N('Red Boy looks at her for a long time. Then he nods, and puts his hands together, and bows.'),
          ],
        },
      },
    ],
    complete: {
      id: 'a02-14-complete',
      lines: [
        N('The monk is untied, smelling of smoke. Red Boy goes with Guanyin, walking a step behind her, quite quiet.'),
        MO('He was only a boy, really.', 'sad'),
        MK('He was a boy who set fire to me. But yes.', 'think'),
        N('Your Nubbin finds a little red ribbon from his jacket by the cave. It keeps it, for his mother, in case.'),
      ],
    },
    rewards: [],
    sets: { 'a02-14': true },
    notes:
      'The fire is orange and noisy and never burns anyone on screen; Monkey is singed and then cold (a faint, not ' +
      'a death). Softened: the novel’s lotus seat of blades is a lotus seat that closes gently (care note). Red Boy ' +
      'becomes Guanyin’s attendant, as in the novel. The red ribbon your Nubbin keeps is a plot prop for A2-16, not ' +
      'a reward.',
  },

  // ---------------------------------------------------------------- A2-15
  {
    id: 'a02-15',
    code: 'A2-15',
    title: 'The Two Monkeys',
    source: `${SRC}, ch. 56–58: the true and the false Monkey`,
    audience: 'all',
    trigger: { where: WHERE, when: after('A2-14') },
    requires: ['A2-14'],
    speakers: [MONKEY, FALSE, MONK, SANDY, GUANYIN, BUDDHA],
    steps: [
      {
        id: 'a02-15-s1',
        goal: 'Hold on to the luggage when Monkey comes back.',
        hint: 'Monkey was sent away again. Stay with the monk and the luggage.',
        check: 'carry:a02-luggage:road',
        scene: {
          id: 'a02-15-snatch',
          lines: [
            N('It happens again: bandits on the road, Monkey too rough with them, the monk too angry. Monkey is sent away.'),
            N('This time nobody cries; everyone is too tired. Pigsy goes to find water, and Sandy goes after Pigsy.'),
            N('Then Monkey comes back, alone, with a cup of water held out in both hands.'),
            FM('Master. I’m sorry. Here. Drink.', 'soft'),
            MO('Go away, Wukong. I meant it.', 'sad'),
            N('Monkey’s face changes. He knocks the monk flat, and grabs for the luggage you are carrying.'),
            N('Your Nubbin hisses at him. It has never hissed at Monkey in its life.'),
          ],
        },
        done: {
          id: 'a02-15-snatch-done',
          lines: [
            N('He tears the pack off the pole and is gone in a streak of cloud. The monk sits up, dizzy but unhurt.'),
            SD('That wasn’t like him. Even at his worst, that wasn’t like him.', 'think'),
          ],
        },
      },
      {
        id: 'a02-15-s2',
        goal: 'Follow the two Monkeys from the South Sea to Heaven.',
        hint: 'Keep up with Sandy. The fight is moving fast.',
        check: 'watch:a02-twins:south-sea',
        scene: {
          id: 'a02-15-twins',
          lines: [
            N('Sandy goes to the Mountain of Flowers and Fruit. He comes back with news: Monkey is there with a monk, a Pigsy, a Sandy and your luggage.'),
            N('At Guanyin’s island Sandy finds the real Monkey, who has been sulking there all along. Then the false one turns up, and there are two of him.'),
            MK('Who are you? Why have you got my face?', 'angry'),
            FM('Who are you? Why have you got my face?', 'angry'),
            N('Guanyin says the quiet words of the band. Both Monkeys clutch their heads and roll on the ground together.'),
            GY('I cannot tell them apart.', 'think'),
            N('They fight all the way up to Heaven. The Jade Emperor’s mirror shows two Monkeys, exactly the same, down to the last hair.'),
            N('Your Nubbin, who can always find Monkey in a crowd, looks from one to the other and starts to cry.'),
          ],
        },
      },
      {
        id: 'a02-15-s3',
        goal: 'Answer the question: which Monkey is the real one?',
        hint: 'Think about what you can honestly say.',
        check: 'choose:a02-which:road',
        scene: {
          id: 'a02-15-which',
          lines: [
            N('The two Monkeys tumble down out of the sky and land in the road in front of the monk, still fighting.'),
            N('The monk stands up. He doesn’t look at either of them; he looks at you.'),
            MO('On White Tiger Ridge, you believed him when I would not. You trusted what you saw.', 'sad'),
            MO('So look now. Which one is my disciple?'),
            N('Two Monkeys, two staffs, two golden bands. Both faces are looking at you, hopeful and furious, exactly alike.'),
            N('Your Nubbin is holding both their tails, one in each paw, and won’t let go of either.'),
          ],
          choices: WHICH_CHOICES('monk'),
        },
      },
      {
        id: 'a02-15-s4',
        goal: 'Go to Thunder Monastery and hear the Buddha name the false Monkey.',
        hint: 'Follow everyone west to the Buddha.',
        check: 'talk:a02-buddha:thunder-monastery',
        scene: {
          id: 'a02-15-named',
          lines: [
            N('The two Monkeys fight all the way to the Buddha’s hall. The Buddha is talking with his disciples, and he stops, and smiles.'),
            BU('There are four kinds of monkey that the world does not list. This is the one with six ears. He hears everything, from everywhere.', 'soft'),
            BU('He heard your story, Wukong, and wanted to be you. That is all.'),
            N('The false Monkey tries to run. The Buddha’s golden bowl comes down over him like a lid on a pot.'),
            N('When it lifts, there is only a small monkey with six ears, shaking. Monkey raises his staff.'),
            N('Then he looks at the monk, and at your Nubbin, and lowers it.'),
            MK('Go on. Go. Be yourself somewhere. It’s harder, but it’s yours.', 'soft'),
          ],
        },
      },
    ],
    complete: {
      id: 'a02-15-complete',
      lines: [
        N('The six-eared monkey runs off into the trees and doesn’t look back. The luggage comes home, a bit dusty.'),
        MO('Wukong. Will you come back? Please?', 'sad'),
        MK('Only if you say it twice.', 'soft'),
        MO('Please.', 'soft'),
        N('Your Nubbin lets go of the tail it has been holding. It has been holding the right one, as it happens, all along.'),
      ],
    },
    rewards: [],
    sets: { 'a02-15': true },
    notes:
      'SIGNATURE PAYOFF (a02-believed, set in A2-12). Step 3’s scene a02-15-which is for a02-believed = monkey (the ' +
      'monk asks you). For monk, play ATLAS_A02_VARIANTS a02-15-which-monk in its place (Monkey asks you). Both ' +
      'offer the same three choices (ids left, right, plain): guessing settles nothing, because both Monkeys answer ' +
      'alike; saying plainly that you can’t tell is the right answer and gets the thanks. No flag: every route goes ' +
      'to the Buddha. SOFTENED: the novel has Monkey kill the six-eared macaque; here Monkey spares it (care note). ' +
      'The monk is knocked flat, not hurt. Your Nubbin’s crying is quiet, with one tear.',
  },

  // ---------------------------------------------------------------- A2-16
  {
    id: 'a02-16',
    code: 'A2-16',
    title: 'The Flaming Mountains',
    source: `${SRC}, ch. 59–61: Princess Iron Fan and the palm-leaf fan`,
    audience: 'all',
    trigger: { where: WHERE, when: after('A2-15') },
    requires: ['A2-15'],
    speakers: [MONKEY, MONK, PIGSY, IRONFAN],
    steps: [
      {
        id: 'a02-16-s1',
        goal: 'Go with Monkey to ask Princess Iron Fan for her fan.',
        hint: 'Her cave is on Emerald Cloud Mountain. Knock politely.',
        check: 'talk:a02-ironfan:palm-leaf-cave',
        scene: {
          id: 'a02-16-ask',
          lines: [
            N('Ahead the whole land is on fire: the Flaming Mountains, eight hundred li of them. The only way over is a magic palm-leaf fan.'),
            N('It belongs to Princess Iron Fan. She is Red Boy’s mother.'),
            IF('You! You gave my son to that lady. He lives on her island and sweeps her floors now!', 'angry'),
            MK('He’s happy! He’s learning things! He’s not setting fire to people any more!'),
            N('She takes out the fan and waves it once. Monkey goes flying fifty thousand li, end over end, and out of sight.'),
            N('Your Nubbin steps forward and holds out the red ribbon from Red Boy’s jacket.'),
          ],
          choices: [
            {
              id: 'ribbon',
              label: 'Tell her where your Nubbin found it.',
              then: [
                IF('His. That’s his. He was always losing it.', 'sad'),
                N('She holds it for a long time. She doesn’t give you the fan, but she doesn’t blow you away, either.'),
              ],
            },
            {
              id: 'quiet',
              label: 'Let her take it without a word.',
              then: [N('She takes it and turns away, and you hear her breathe out, slowly. The door stays open.')],
            },
          ],
        },
        done: {
          id: 'a02-16-ask-done',
          lines: [
            N('Monkey comes back with a wind-fixing pill in his cheek, turns into a tiny fly, and gets into her tea.'),
            N('After some time, and some kicking from inside, the princess hands over a fan. Monkey comes out very pleased.'),
          ],
        },
      },
      {
        id: 'a02-16-s2',
        goal: 'Watch Monkey try the fan on the mountains.',
        hint: 'Stand well back from the fire. Further. Further than that.',
        check: 'watch:a02-fake-fan:flaming-mountains',
        scene: {
          id: 'a02-16-fake',
          lines: [
            N('Monkey stands at the edge of the flames and waves the fan with a flourish.'),
            N('The fire leaps up twice as high. He waves again, and it leaps higher still, and his tail starts to smoke.'),
            MK('It’s a fake! She gave me a fake!', 'angry'),
            PG('Run!', 'shock'),
            N('Everybody runs. Pigsy runs fastest, which nobody has ever seen before.'),
            MO('Wukong, your tail. Your tail is on fire.', 'shock'),
          ],
          choices: [
            {
              id: 'tail',
              label: 'Pat out Monkey’s tail.',
              then: [MK('Thank you. That’s my good tail. I only have the one.', 'soft')],
            },
            {
              id: 'laugh',
              label: 'Try very hard not to laugh.',
              then: [
                N('You fail. Your Nubbin fails too, rolling about in the dust.'),
                MK('Yes. All right. It was quite funny.', 'think'),
              ],
            },
          ],
        },
      },
      {
        id: 'a02-16-s3',
        goal: 'Carry the real fan, and help count forty-nine waves.',
        hint: 'Hold the fan steady while Monkey works it. Count every wave aloud.',
        check: 'carry:a02-fan:flaming-mountains',
        scene: {
          id: 'a02-16-real',
          lines: [
            N('There is a long and complicated business with the Bull Demon King, Monkey in disguise, and Pigsy in a temper.'),
            N('In the end, Princess Iron Fan comes out herself with the real fan, and gives it to the monk, not to Monkey.'),
            IF('Wave it forty-nine times. Then the fire goes out for ever, and it rains, and things grow.', 'soft'),
            IF('My boy would have wanted the fire. I think I want the rain.'),
            N('The fan is enormous. It takes you and Sandy together to hold it up, and Monkey to swing it.'),
            N('Your Nubbin sits on top of your head and counts on its paws. It runs out of paws at four, and starts again.'),
          ],
        },
        done: {
          id: 'a02-16-real-done',
          lines: [N('Forty-nine, and the flames go out. The first rain in a thousand years comes down, cool and grey, and steam rises everywhere.')],
        },
      },
    ],
    complete: {
      id: 'a02-16-complete',
      lines: [
        N('You walk over the Flaming Mountains in the rain. The ground is warm under your feet, and already a bit green.'),
        N('Monkey gives the fan back to Princess Iron Fan, which surprises everyone, including Monkey.'),
        IF('Tell my son I kept his ribbon.', 'soft'),
        MO('We shall tell him.'),
      ],
    },
    rewards: [],
    sets: { 'a02-16': true },
    notes:
      'Condenses ch. 59–61: the Bull Demon King’s disguises and fights are one narrated line (no speaker). The ' +
      'Nubbin’s red ribbon from A2-14 is the warm thread. In the novel the fan passes through several hands; here ' +
      'Princess Iron Fan gives it freely in the end, as she does after the Bull King’s defeat. The counting beat ' +
      'is a light tap-along (forty-nine taps, skippable).',
  },

  // ---------------------------------------------------------------- A2-17
  {
    id: 'a02-17',
    code: 'A2-17',
    title: 'Cobweb Cave',
    source: `${SRC}, ch. 72–73: the spider spirits of Silk Ridge`,
    audience: 'all',
    trigger: { where: WHERE, when: after('A2-16') },
    requires: ['A2-16'],
    speakers: [MONKEY, MONK, PIGSY, SANDY, SPIDER],
    steps: [
      {
        id: 'a02-17-s1',
        goal: 'Let the monk go begging by himself, and keep watch from the trees.',
        hint: 'Stay far enough back that he doesn’t see you.',
        check: 'visit:a02-cottage:silk-ridge',
        scene: {
          id: 'a02-17-cottage',
          lines: [
            MO('All this way, and you have fetched every meal. Let me fetch one. I am a monk. Begging is my job.', 'soft'),
            MK('Master, I really think…'),
            MO('Let me.'),
            N('So he goes alone to a pretty cottage at the edge of the trees. Monkey sends you and your Nubbin after him, quietly.'),
            N('Seven women sit in the garden, spinning, very politely. Their eyes are a little too many, and a little too shiny.'),
            SS('A monk? How lovely. Come in. Do sit down. Do stay.', 'soft'),
            N('Your Nubbin tugs your sleeve. There are threads across the path behind the monk, fine as hair, catching the light.'),
          ],
        },
        done: {
          id: 'a02-17-cottage-done',
          lines: [N('When he tries to leave, the threads are everywhere. The monk is wrapped up and hung in the doorway like a parcel.')],
        },
      },
      {
        id: 'a02-17-s2',
        goal: 'Find the anchor thread of the web.',
        hint: 'Your Nubbin is small enough to follow a single thread. Let it lead.',
        check: 'puzzle:a02-silk:cobweb-cave',
        scene: {
          id: 'a02-17-web',
          lines: [
            N('The cottage is really a cave, and the cave is all web. Silk hangs everywhere in great white sheets.'),
            MK('I can cut it, but there’s more every time. It’s like trying to sweep up fog.', 'angry'),
            N('Your Nubbin puts one paw on a thread and follows it with its eyes. Then it starts walking along it.'),
            N('It goes round three rocks and under a root, very slowly, to a peg of stone at the back. Every thread comes back here.'),
            SD('Of course. Everything that holds on has to hold on to something.', 'think'),
            MK('Cousin. If I’d been a bit smaller and a lot more patient, I’d have found that.', 'soft'),
          ],
          choices: [
            {
              id: 'cut',
              label: 'Untie the anchor thread from the peg.',
              then: [N('You untie it. All through the cave, the white sheets go slack, and drift down, and lie on the floor like snow.')],
            },
            {
              id: 'monkey',
              label: 'Call Monkey to cut it.',
              then: [MK('There? That little one? Cousin, you’re a genius.', 'happy'), N('One stroke. The whole web sighs down to the floor.')],
            },
          ],
        },
      },
      {
        id: 'a02-17-s3',
        goal: 'Get the monk safely out of the cave.',
        hint: 'Carry the monk’s bowl. Sandy will carry the monk.',
        check: 'escort:a02-monk:cave-mouth',
        scene: {
          id: 'a02-17-out',
          lines: [
            N('Sandy unwraps the monk, who is grey with dust, and furious with himself, and fine.'),
            MO('I wanted to do one thing for you all. One thing.', 'sad'),
            MK('You did. You showed us where the spiders lived.', 'soft'),
            N('The seven spinners have become seven spiders, scuttling for the cracks. Pigsy lifts his rake.'),
            MO('Leave them. Let them spin somewhere else.'),
            N('Pigsy lowers it. Your Nubbin watches the last spider go, and waves.'),
          ],
        },
      },
    ],
    complete: {
      id: 'a02-17-complete',
      lines: [
        N('That night the monk eats the supper Monkey fetches, and says thank you twice.'),
        MO('Perhaps it is all right to be the one who is carried, now and then.', 'soft'),
        PG('I’ve always said so. Nobody listens.'),
        N('Your Nubbin has a thread of silk caught round one ear. It keeps it there for days, like a ribbon.'),
      ],
    },
    rewards: [],
    sets: { 'a02-17': true },
    notes:
      'The spinners are fairy-tale spooky: too many shiny eyes, polite voices, no bathing scene and nothing from the ' +
      'novel’s Filthy Pool. Their brother (the hundred-eyed Daoist, ch. 73) is left out; ch. 72–73 condensed. The ' +
      'spiders are spared and scuttle away. The anchor-thread puzzle is a short trace-the-line minigame.',
  },

  // ---------------------------------------------------------------- A2-18
  {
    id: 'a02-18',
    code: 'A2-18',
    title: 'Vulture Peak',
    source: `${SRC}, ch. 98: the scriptures are received`,
    audience: 'all',
    trigger: { where: WHERE, when: after('A2-17') },
    requires: ['A2-17'],
    speakers: [MONKEY, MONK, PIGSY, SANDY, BUDDHA],
    steps: [
      {
        id: 'a02-18-s1',
        goal: 'Walk the last of the road to the Buddha’s land.',
        hint: 'Keep west. You’ll know it when you see it.',
        check: 'walk:a02-road:vulture-peak',
        scene: {
          id: 'a02-18-road',
          lines: [
            N('The page says you have been walking for fourteen years. It feels like a long afternoon, and also like a life.'),
            N('The land ahead is quiet and green. People look up from their fields and smile, as if they knew you were coming.'),
            MO('Is this it? Wukong, is this it?', 'shock'),
            MK('That’s it, master. That mountain there. You can stop worrying now.', 'soft'),
            N('The monk sits down in the road, and cries, and laughs, and cannot stop doing either.'),
            N('Your Nubbin climbs into his lap. Pigsy sits down too, mainly because everyone else is sitting.'),
          ],
        },
      },
      {
        id: 'a02-18-s2',
        goal: 'Cross the river in the boat without a bottom.',
        hint: 'Step in after the monk. Trust it.',
        check: 'escort:a02-monk:bottomless-boat',
        scene: {
          id: 'a02-18-boat',
          lines: [
            N('Between you and the mountain runs a wide river. The only bridge is a single slippery log.'),
            N('A ferryman poles over in a boat with no bottom. You can see the water rushing straight through it.'),
            MO('I can’t. It has no bottom. I really can’t.', 'shock'),
            MK('You’ve walked fourteen years on trust, master. Try one more step.'),
            N('Monkey gives him a gentle shove. The monk steps in, and the bottomless boat holds him up as if it were stone.'),
            N('The ferryman smiles at you, and holds out a hand.'),
          ],
          choices: [
            {
              id: 'step',
              label: 'Step in after him.',
              then: [N('Your foot goes onto nothing, and the nothing holds. Your Nubbin hops in after you, looking very pleased with itself.')],
            },
            {
              id: 'nubbin',
              label: 'Let your Nubbin go first.',
              then: [N('Your Nubbin hops in without a second thought; it has never once doubted a boat. You follow it.')],
            },
          ],
        },
        done: {
          id: 'a02-18-boat-done',
          lines: [N('On the far side, everyone feels lighter, as if they have put down a pack they forgot they were carrying.')],
        },
      },
      {
        id: 'a02-18-s3',
        goal: 'Stand with the pilgrims before the Buddha.',
        hint: 'Put the luggage down at the gate. You won’t need to carry it in.',
        check: 'talk:a02-buddha:vulture-peak',
        scene: {
          id: 'a02-18-scriptures',
          lines: [
            N('The Buddha’s hall is full of light and very calm. The monk kneels, and Monkey kneels too, without being asked.'),
            BU('You have come a long way. Rest a little, and then take what you came for.', 'soft'),
            N('Disciples bring out scrolls, bundle after bundle. You load them onto the horse and the pole with Sandy, carefully.'),
            N('Halfway down the mountain a wind tears open a bundle. The pages inside are blank, every one.'),
            MO('Blank? After all this? Did we do something wrong?', 'sad'),
            N('You go back up. The Buddha is not cross, and not surprised.'),
            BU('The blank ones are the truest. But in the East, people need words. So: words.', 'soft'),
            N('As thanks, the monk gives the golden bowl the emperor gave him, which is all he has. The new scrolls are full of writing.'),
          ],
        },
      },
    ],
    complete: {
      id: 'a02-18-complete',
      lines: [
        N('Five thousand and forty-eight rolls of scripture, tied up in neat bundles. You and Sandy take the pole between you.'),
        MO('We have them. We actually have them.', 'happy'),
        MK('Told you. India by lunch.', 'happy'),
        PG('It was fourteen years.', 'think'),
        MK('A very long lunch.'),
      ],
    },
    rewards: [],
    sets: { 'a02-18': true },
    notes:
      'The Buddha is calm, kind and wise throughout (care note): the blank scrolls are his teaching, not a trick, ' +
      'and no one asks for a bribe on screen (the monk freely gives his bowl as thanks). The novel’s image of the ' +
      'monk’s old body floating away in the bottomless boat is left out (care note). The scroll count is the ' +
      'novel’s and is told, not shown.',
  },

  // ---------------------------------------------------------------- A2-19
  {
    id: 'a02-19',
    code: 'A2-19',
    title: 'The Eighty-First Hardship',
    source: `${SRC}, ch. 99–100: the river, the torn pages and the return`,
    audience: 'all',
    trigger: { where: WHERE, when: after('A2-18') },
    requires: ['A2-18'],
    speakers: [MONKEY, MONK, PIGSY, SANDY, TURTLE, GUANYIN],
    steps: [
      {
        id: 'a02-19-s1',
        goal: 'Ride home over the River of Heaven on the old white turtle.',
        hint: 'The turtle is waiting for you at the river.',
        check: 'swim:a02-turtle:river-of-heaven',
        scene: {
          id: 'a02-19-turtle',
          lines: [
            N('Far away, Guanyin is reading a list of every hardship the pilgrims met. There were eighty, and there ought to be eighty-one.'),
            GY('One more, then. A gentle one.', 'soft'),
            N('At the River of Heaven, the old white turtle who carried you all across on the way out is waiting, smiling.'),
            N('The page skipped that crossing years ago, between one chapter and the next. The turtle has not skipped anything.'),
            TT('Welcome back. Did you ask the Buddha my question? When I shall stop being a turtle, and become a person?'),
            MO('Oh. Oh, no. I forgot. I am so sorry. I forgot.', 'sad'),
            N('The turtle doesn’t say anything. He just sinks, very slowly and quite sadly, into the river.'),
            N('Everyone goes into the water: monk, Monkey, Pigsy, Sandy, horse, scrolls, you. Your Nubbin is delighted.'),
          ],
        },
        done: {
          id: 'a02-19-turtle-done',
          lines: [
            N('Your Nubbin swims round and round the turtle, then sits on his shell and pats it, as if to say it was a fair point.'),
            TT('No harm done. I only wanted to be remembered.', 'soft'),
          ],
        },
      },
      {
        id: 'a02-19-s2',
        goal: 'Dry the scriptures on the flat rock by the river.',
        hint: 'Spread the scrolls out in the sun. Peel them up gently.',
        check: 'carry:a02-scrolls:rock',
        scene: {
          id: 'a02-19-rock',
          lines: [
            N('You all haul the scrolls out of the river and lay them on a big flat rock to dry in the sun.'),
            N('When you lift them, a few of the last pages stick fast to the stone. They tear, and the ends stay behind.'),
            MO('No. No! We came all this way. We crossed the whole world. And now they’re not whole.', 'sad'),
            N('Monkey looks at the torn edges for a long time. He doesn’t make a joke.'),
            MK('Heaven and earth aren’t whole either, master. Nothing is. These are just honest about it.', 'soft'),
            MK('Maybe they’re meant to be not quite finished. So there’s room for whoever reads them next.'),
          ],
          choices: [
            {
              id: 'peel',
              label: 'Try to peel the last pages free.',
              then: [N('You try, very carefully, but they stay where they are. In the end you leave them, and the rock keeps a few words for itself.')],
            },
            {
              id: 'leave',
              label: 'Leave them on the rock.',
              then: [N('You leave them. Your Nubbin pats the torn edges, as if they were a pet that had done its best.')],
            },
          ],
        },
        done: {
          id: 'a02-19-rock-done',
          lines: [MO('Not quite complete. Yes. All right. That will do.', 'soft')],
        },
      },
      {
        id: 'a02-19-s3',
        goal: 'Carry the scriptures home, and go back to Vulture Peak with the pilgrims.',
        hint: 'Take the front of the pole. Sandy has the back.',
        check: 'deliver:a02-scrolls:chang-an',
        scene: {
          id: 'a02-19-home',
          lines: [
            N('The city of Chang’an turns out to meet you. The pines by the monastery gate, people say, all turned to point east the morning he came home.'),
            N('The emperor himself walks out to meet the monk, and the scrolls are carried in with music.'),
            N('Then, before anyone has finished cheering, the pilgrims are lifted back to Vulture Peak on a soft wind.'),
            N('The Buddha gives each of them a new name. The monk becomes a buddha, and so does Monkey.'),
            MK('A buddha! Me! Then take this band off, master. A buddha in a headband looks silly.', 'happy'),
            MO('Touch your head, Wukong.', 'soft'),
            N('Monkey touches his head, and the band is gone. Nobody saw it go.'),
          ],
        },
      },
    ],
    complete: {
      id: 'a02-19-complete',
      lines: [
        MK('Gone. It went when I stopped needing it. Of course it did.', 'soft'),
        N('He turns to you. His eyes are still little suns, but kinder now, the way the sun is kinder in the evening.'),
        MK('You believed me once, when nobody else did. On the ridge. I never forgot.', 'soft'),
        MO('And you were right. I was afraid, and I called it being careful. I am glad he came back.', 'soft'),
        N('He plucks a hair and blows on it. It becomes a thin gold band, just Nubbin-sized.'),
        MK('This one does nothing at all. It doesn’t tighten. It doesn’t come off unless you want it to. That’s the best kind.', 'happy'),
        MK('And here. A little cloud. For when your Grove feels too big. Somersault, Cousin, and there you are.'),
        N('Your Nubbin tries the cloud at once, rolls over twice, and lands in your arms. Then the page turns, and you are home.'),
      ],
    },
    rewards: [
      {
        id: 'a02-golden-band',
        kind: 'cosmetic',
        label: 'Golden band',
        description: 'A thin gold circlet, made from one of Monkey’s hairs. A hat that does nothing at all, which is the best kind.',
      },
      {
        id: 'a02-cloud-somersault',
        kind: 'feature',
        label: 'Cloud somersault',
        description: 'Fast travel around the Grove on a little cloud, with a playful roll. Use it any time, as often as you like.',
      },
    ],
    sets: { 'a02-19': true, 'a02-done': true },
    notes:
      'SIGNATURE PAYOFF (a02-believed). The complete scene shown, a02-19-complete, is for monkey. For monk, play ' +
      'ATLAS_A02_VARIANTS a02-19-complete-monk instead. Both reconcile monk and Monkey (they are both buddhas now, ' +
      'side by side) and give both rewards. CLOUD SOMERSAULT: an unlimited fast-travel feature (no cooldown, no ' +
      'daily count), using the A2-3 cloud animation; with reduced motion, a soft fade. GOLDEN BAND: cosmetic hat, ' +
      'one-time. The turtle is sad, not angry, and the dunking is gentle. The pine trees turning east is the novel’s ' +
      'own homecoming detail, told in our words. The monk’s title, Monkey’s title (Victorious Fighting Buddha) and ' +
      'Pigsy’s and Sandy’s are not named on screen (adviser check). Sets a02-done for atlasDone(\'A2\').',
  },
];

// =================================================================== variants

/**
 * Scenes chosen by a02-believed = monk (see the notes on A2-15 and A2-19). Any other value,
 * including unset, plays the base scene.
 */
export const ATLAS_A02_VARIANTS: Scene[] = [
  {
    // A2-15 step 3, in place of a02-15-which when a02-believed = monk.
    id: 'a02-15-which-monk',
    lines: [
      N('The two Monkeys tumble down out of the sky and land in the road in front of the monk, still fighting.'),
      N('One of them steps back, and the other steps back too, in exactly the same way. Both look at you.'),
      MK('On White Tiger Ridge you took his side, not mine. You said you can’t strike on a hunch.', 'sad'),
      FM('On White Tiger Ridge you took his side, not mine. You said you can’t strike on a hunch.', 'sad'),
      N('Two voices, one sentence. Both faces are looking at you, hopeful and furious, exactly alike.'),
      MK('So no hunches now, Cousin’s keeper. Tell them. Which one of us is me?'),
      N('Your Nubbin is holding both their tails, one in each paw, and won’t let go of either.'),
    ],
    choices: WHICH_CHOICES('monkey'),
  },
  {
    // A2-19, in place of a02-19-complete when a02-believed = monk.
    id: 'a02-19-complete-monk',
    lines: [
      MK('Gone. It went when I stopped needing it. Of course it did.', 'soft'),
      N('He turns to you. His eyes are still little suns, but kinder now, the way the sun is kinder in the evening.'),
      MK('On the ridge you took his side. I was so angry. You were right not to just take my word, though.', 'soft'),
      MO('And he was right about the demon. We were both a little right. That is how it usually goes.', 'soft'),
      N('Monkey plucks a hair and blows on it. It becomes a thin gold band, just Nubbin-sized.'),
      MK('This one does nothing at all. It doesn’t tighten. It doesn’t come off unless you want it to. That’s the best kind.', 'happy'),
      MK('And here. A little cloud. For when your Grove feels too big. Somersault, Cousin, and there you are.'),
      N('Your Nubbin tries the cloud at once, rolls over twice, and lands in your arms. Then the page turns, and you are home.'),
    ],
  },
];

// =================================================================== flags and checks

export const ATLAS_A02_FLAGS: string[] = [
  'a02-01',
  'a02-02',
  'a02-03',
  'a02-04',
  'a02-05',
  'a02-06',
  'a02-07',
  'a02-08',
  'a02-09',
  'a02-10',
  'a02-11',
  'a02-12',
  'a02-13',
  'a02-14',
  'a02-15',
  'a02-16',
  'a02-17',
  'a02-18',
  'a02-19',
  'a02-done', // A2-19: the whole page; read by atlasDone('A2')
  'a02-believed', // monkey | monk (a02-12-bones): A2-15 step 3 and the A2-19 complete scene
];

export const ATLAS_A02_CHECKS: string[] = [
  'explore:a02-mountain:summit',
  'watch:a02-egg:summit',
  'watch:a02-heaven:mists',
  'explore:a02-stream:source',
  'swim:a02-waterfall:curtain',
  'sit:a02-feast:cave',
  'visit:a02-teacher:cave',
  'sit:a02-teacher:back-door',
  'watch:a02-pine:yard',
  'visit:a02-stables:heaven',
  'inspect:a02-peaches:garden',
  'watch:a02-banquet:jade-pool',
  'watch:a02-furnace:tushita',
  'talk:a02-buddha:palm',
  'sit:a02-monkey:five-elements',
  'escort:a02-monk:frontier',
  'climb:a02-seal:summit',
  'wait:a02-band:roadside',
  'walk:a02-stream:eagle-grief',
  'talk:a02-guanyin:stream',
  'watch:a02-dragon:stream',
  'visit:a02-monastery:guest-hall',
  'inspect:a02-fire:guest-hall',
  'find:a02-robe:black-wind',
  'talk:a02-gao:farm',
  'wait:a02-backhouse:night',
  'talk:a02-pigsy:cloud-pathway',
  'walk:a02-river:flowing-sands',
  'swim:a02-river:sandy',
  'wait:a02-moksa:bank',
  'visit:a02-temple:five-villages',
  'inspect:a02-tree:garden',
  'carry:a02-dew:tree',
  'watch:a02-girl:white-tiger-ridge',
  'watch:a02-old-woman:white-tiger-ridge',
  'choose:a02-believe:white-tiger-ridge',
  'walk:a02-pigsy:flowers-mountain',
  'talk:a02-monkey:pine-wood',
  'wait:a02-gourd:lotus-cave',
  'watch:a02-gourd:lotus-cave',
  'inspect:a02-boy:pine',
  'carry:a02-water:fire-cloud-cave',
  'talk:a02-guanyin:fire-cloud-cave',
  'carry:a02-luggage:road',
  'watch:a02-twins:south-sea',
  'choose:a02-which:road',
  'talk:a02-buddha:thunder-monastery',
  'talk:a02-ironfan:palm-leaf-cave',
  'watch:a02-fake-fan:flaming-mountains',
  'carry:a02-fan:flaming-mountains',
  'visit:a02-cottage:silk-ridge',
  'puzzle:a02-silk:cobweb-cave',
  'escort:a02-monk:cave-mouth',
  'walk:a02-road:vulture-peak',
  'escort:a02-monk:bottomless-boat',
  'talk:a02-buddha:vulture-peak',
  'swim:a02-turtle:river-of-heaven',
  'carry:a02-scrolls:rock',
  'deliver:a02-scrolls:chang-an',
];
