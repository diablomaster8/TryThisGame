/**
 * Atlas campaign, page A21: The Flower Field (Part M, rank 23). Twenty quests, A21-1 to A21-20.
 *
 * SOURCE. Frieren: Beyond Journey’s End (Sōsō no Frieren), story by Kanehito Yamada, art by
 * Tsukasa Abe, serialised by Shogakukan in Weekly Shōnen Sunday from 2020; the anime by Madhouse
 * (first season, 28 episodes, 2023–24). Rights: © Kanehito Yamada and Tsukasa Abe / Shogakukan,
 * and the anime’s production committee; English manga by VIZ Media, English anime track by
 * Crunchyroll. Fully in copyright: this page needs a licence before ship. The page follows the
 * first season and the manga up to the end of the First-Class Mage Exam, and no further. The
 * characters must look exactly as licensed: there are no Grove versions of them.
 *
 * AUDIENCE. 'main': the main game only, never the Learning Grove (the outline rules out a Learning
 * Grove version: the demon battles keep it out). So no childLines. The outline says Maor may
 * rate it 'teen' like A1 instead; nothing in the text would need to change.
 *
 * FRAME. Nova’s atlas falls open at a meteor shower over a royal capital. You step in with Keeper
 * Fern from next door (and Bramble, if Fern has found her). You are travellers who fall in with
 * Frieren’s party and are carried through its years by the page: you carry packs and water, cook,
 * sit up with people, and at the exam you carry the Association’s bird cages, which lets you
 * watch. Frieren, Fern and Stark keep their story; you never fight. The atlas keeps time for you,
 * so you and Keeper Fern never age while the decades pass (Heiter notices). Your Nubbin is the
 * party’s mascot: it hates mimics (from A21-6) and loves Stark, who is as frightened as it is; from
 * A21-12 it rides in his cloak. Nubbins never speak. Nobody in Frieren’s world is a talking animal.
 * Two speakers share the name Fern: Keeper Fern is the campaign’s `fern`; the apprentice is
 * `a21-fern`. Narration always calls them “Keeper Fern” and “young Fern”.
 *
 * GROVE FLAGS READ (read-only; the Atlas never writes a Grove flag):
 *   - s8Reunited (S8: Fern has found Bramble).
 *       true:  Bramble comes along (a21-01-page-done-bramble; drawn at Keeper Fern’s heel through
 *              the page, with no other lines); the mist monster wears Hazel’s coat
 *              (a21-11-ghost-hazel, a21-11-sit-hazel); Keeper Fern talks of Hazel to Kraft
 *              (a21-15-hut-done-hazel).
 *       false: the monster wears Bramble’s folded ear (the default scenes).
 *   - The campaign’s progress, for Keeper Fern’s line at the funeral (A21-2):
 *       before chapter 10’s dawn (Hazel not yet home): a21-02-burial-done (the default);
 *       from chapter 10’s dawn until the ending (Hazel home): a21-02-burial-done-home;
 *       campaign finished (CampaignState.ending set, so Hazel’s walk has played):
 *       a21-02-burial-done-after.
 *   - From the Grove side (for the keepsake scenes in A21_VARIANTS): atlasDone('A21'), the Atlas
 *     flag a21-search, and Moss faded (mossFaded).
 *
 * FLAGS WRITTEN (Atlas save only, all prefixed a21-):
 *   - a21-01 … a21-20: each quest on completion. a21-done: the whole page (A21-20). The Night of
 *     Remembering festival and the Grove keepsakes read it through atlasDone('A21').
 *   - a21-search = with | ahead (A21-7, a21-07-flower). The signature choice: picks the A21-7
 *     search or wait scenes, the ring scene in A21-16 (nine quests later) and the farewell in
 *     A21-20 (thirteen quests later), and the Grove keepsake (the moon-weed or the pressed flower).
 *
 * LIFTED TEXT (copyrighted: exactly three one-sentence lines, exactly as the outline lists them,
 * from the English subtitles of the anime’s first season as quoted by Reactor; NOT yet checked
 * against the licensed Crunchyroll track, which the outline asks for before ship; set with the
 * game’s curly apostrophes):
 *   1. Frieren, at the funeral: “Why didn’t I try to get to know him better?” a21-02-burial#6.
 *   2. Himmel, in flashback: “I pose for these statues so you won’t feel alone in the future.”
 *      a21-13-statues#9.
 *   3. Frieren, at New Year: “I wouldn’t have been able to see this sunrise if I’d been on my
 *      own.” a21-09-sunrise#12.
 * Each is used once. Every other line is original. No other Frieren dialogue is quoted or closely
 * paraphrased. The odd little spells in A21-6 are our own inventions. Spell names from the source
 * are not used: Qual’s spell is “his killing spell”, Fern’s shield is “a pane of light”.
 *
 * CARE NOTES.
 *   - Fern’s past: in the source she meant to end her life before Heiter stopped her. Never said,
 *     never hinted. Here Heiter found her alone after the war and took her home (a21-03-step#2).
 *   - Himmel and Heiter die of old age, gently. Himmel’s funeral is quiet. Heiter dies offstage,
 *     after the party has gone, as he asks; nobody shows it.
 *   - Demons (Qual, Lügner, Linie, Aura) come apart into motes of dark light. No blood, no wounds
 *     shown. Lügner’s blood magic is “thin red threads”. Aura’s end is offscreen: the scales turn
 *     her own spell on her and the player looks away (both choices in a21-14-aura do).
 *   - Aura’s army is “old armour that walks”, never bodies or the dead.
 *   - Exam injuries are softened: struck down, bottles broken, carried out safe by the bottle’s
 *     spirit. Nobody dies in the exam.
 *   - The Goddess is the story’s own faith, not a real one. Kraft’s faith is treated with respect.
 *   - The third rule (sit down next to them and wait) is acted out in A21-11 and A21-12, never
 *     quoted.
 *   - Keeper Fern’s grief for Bramble and for Hazel is the line’s own thread. In the Hazel
 *     variants her words work whether Hazel is missing, home or gone.
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

const WHERE = 'Nova’s atlas: the Flower Field page (Atlas campaign)';
const after = (code: string) => `Any time after ${code}, from Nova’s atlas.`;
const src = (beat: string) => `Frieren: Beyond Journey’s End (Kanehito Yamada and Tsukasa Abe), first anime season and manga: ${beat}`;
const LIC = 'licensed design, exactly as drawn in the source';

// ------------------------------------------------------------------ speakers

const FRIEREN = sp('a21-frieren', 'Frieren', `Frieren, the elf mage (Frieren: Beyond Journey’s End); ${LIC}`);
const FERN = sp('a21-fern', 'Fern', `Fern, Heiter’s ward and Frieren’s apprentice (Frieren: Beyond Journey’s End); ${LIC}`);
const STARK = sp('a21-stark', 'Stark', `Stark, Eisen’s student, the warrior (Frieren: Beyond Journey’s End); ${LIC}`);
const HIMMEL = sp('a21-himmel', 'Himmel', `Himmel the Hero, old and in flashback (Frieren: Beyond Journey’s End); ${LIC}`);
const HEITER = sp('a21-heiter', 'Heiter', `Heiter, the priest of the hero’s party (Frieren: Beyond Journey’s End); ${LIC}`);
const EISEN = sp('a21-eisen', 'Eisen', `Eisen, the dwarf warrior of the hero’s party (Frieren: Beyond Journey’s End); ${LIC}`);
const ELDER = sp('a21-elder', 'Village Elder', 'The elder of the village below Qual’s seal, who met Frieren as a boy');
const QUAL = sp('a21-qual', 'Qual', `Qual, the sealed demon (Frieren: Beyond Journey’s End); ${LIC}`);
const OLDWOMAN = sp('a21-oldwoman', 'Old Woman', 'The old woman who asks Frieren to clean the hero’s statue');
const VILLAGER = sp('a21-villager', 'Villager', 'Townsfolk along the road north (unnamed in the source)');
const LUGNER = sp('a21-lugner', 'Lügner', `Lügner, Aura’s envoy (Frieren: Beyond Journey’s End); ${LIC}`);
const GRANAT = sp('a21-granat', 'Graf Granat', `Graf Granat, lord of the northern city (Frieren: Beyond Journey’s End); ${LIC}`);
const AURA = sp('a21-aura', 'Aura', `Aura the Guillotine, demon (Frieren: Beyond Journey’s End); ${LIC}`);
const KRAFT = sp('a21-kraft', 'Kraft', `Kraft, the elf monk (Frieren: Beyond Journey’s End); ${LIC}`);
const PROCTOR = sp('a21-proctor', 'Examiner', 'The Mages’ Association’s exam proctors (Frieren: Beyond Journey’s End)');
const LAWINE = sp('a21-lawine', 'Lawine', `Lawine, examinee (Frieren: Beyond Journey’s End); ${LIC}`);
const KANNE = sp('a21-kanne', 'Kanne', `Kanne, examinee (Frieren: Beyond Journey’s End); ${LIC}`);
const UBEL = sp('a21-ubel', 'Übel', `Übel, examinee (Frieren: Beyond Journey’s End); ${LIC}`);
const DENKEN = sp('a21-denken', 'Denken', `Denken, examinee (Frieren: Beyond Journey’s End); ${LIC}`);
const SMITH = sp('a21-smith', 'Smith', 'A night smith on a bridge in Äußerst (our own)');
const SERIE = sp('a21-serie', 'Serie', `Serie, the great mage, founder of the Mages’ Association (Frieren: Beyond Journey’s End); ${LIC}`);

const N = say('narrator');
const Y = say('you');
const K = say('fern'); // Keeper Fern
const MO = say('moss');
const FR = say('a21-frieren');
const FN = say('a21-fern'); // young Fern, the apprentice
const ST = say('a21-stark');
const HI = say('a21-himmel');
const HE = say('a21-heiter');
const EI = say('a21-eisen');
const EL = say('a21-elder');
const QU = say('a21-qual');
const OW = say('a21-oldwoman');
const VI = say('a21-villager');
const LU = say('a21-lugner');
const GR = say('a21-granat');
const AU = say('a21-aura');
const KR = say('a21-kraft');
const PR = say('a21-proctor');
const LA = say('a21-lawine');
const KA = say('a21-kanne');
const UB = say('a21-ubel');
const DE = say('a21-denken');
const SM = say('a21-smith');
const SE = say('a21-serie');

// ------------------------------------------------------------------ lifted text (copyrighted; three lines, outline-approved)

/** Frieren at Himmel’s funeral. English subtitles, first season, as quoted by Reactor; check against Crunchyroll. */
const LIFT_KNOW = 'Why didn’t I try to get to know him better?';
/** Himmel, in flashback, on the statues. English subtitles, first season, as quoted by Reactor; check against Crunchyroll. */
const LIFT_STATUES = 'I pose for these statues so you won’t feel alone in the future.';
/** Frieren at the New Year sunrise. English subtitles, first season, as quoted by Reactor; check against Crunchyroll. */
const LIFT_SUNRISE = 'I wouldn’t have been able to see this sunrise if I’d been on my own.';

// ------------------------------------------------------------------ shared pieces

/** A21-2: the first and last lines of Keeper Fern’s moment at the graveside (all three campaign states). */
const A2_FERN_OPEN = N('Keeper Fern stands beside you with her blue flowers still in her hands. She has forgotten to put them down.');
const A2_FERN_CLOSE = N('She lays them on the grass, carefully, right at the back, where nobody will tread on them.');

/** A21-11: the young Fern beat, shared by the Bramble and Hazel versions of the ghost. */
const A11_YOUNG_FERN: Line[] = [
  FN('Keeper Fern. Look at me. Not at it.', 'think'),
  N('Young Fern steps between them with her staff up. The thing in the mist turns its face to her, and for a moment it is an old priest.'),
  FN('No. Lord Heiter didn’t want me standing at any more graves. I won’t stand at this one.', 'angry'),
];

/** A21-11: the choices while the ghost is there (both versions). */
const A11_HOLD = [
  {
    id: 'hold',
    label: 'Keep hold of Keeper Fern’s sleeve.',
    then: [N('You hold on. She pulls once, hard, and then not again.')],
  },
  {
    id: 'turn',
    label: 'Turn her round to face you.',
    then: [N('You turn her by the shoulders, and she looks at you instead. It is the bravest thing you have ever seen anyone do.')],
  },
];

/** A21-16: the ring beat, before and after the line that changes with a21-search. */
const A16_RING_START: Line[] = [
  N('That evening Frieren goes white. She turns out her pockets, then her bag, then young Fern’s bag.'),
  FR('The ring. The one Himmel gave me. It’s gone.', 'shock'),
  N('Everybody searches: the inn, the road, the market. Your Nubbin searches inside every boot in the hall.'),
];
const A16_RING_END: Line[] = [
  N('In the end Frieren finds it herself, in the flower bed by the inn door, where she knelt to look at the blue ones.'),
  FR('Of course. I was looking at flowers. He’d laugh at me.', 'happy'),
  N('Before bed, young Fern hands Keeper Fern a folded purple coat: her old travelling one, let out at the seams.'),
  FN('You’ve been cold since the snow. It’s warmer than it looks. Most things are.', 'soft'),
  K('Fern. Thank you. I’ll wear it. Sometimes. When I’m feeling brave.', 'happy'),
];

/** A21-20: the way home (both endings). */
const A20_HOME: Line[] = [
  N('The flowers go soft at the edges, then softer, until they are paper and pressed petals and your own kitchen table.'),
  N('You are back in the Grove with Nova’s atlas open. Between the pages, where the field was, there is a bookmark that wasn’t there before.'),
  K('I’m going to ask people things. Little things, while they’re here. Starting with you. What biscuits do you like?', 'soft'),
];

// =================================================================== THE FLOWER FIELD

export const ATLAS_A21: Quest[] = [
  // ---------------------------------------------------------------- A21-1
  {
    id: 'a21-01',
    code: 'A21-1',
    title: 'The Era Meteors',
    source: src('the Era Meteors, fifty years after the Demon King fell'),
    audience: 'main',
    trigger: { where: WHERE, when: 'Any time once Nova’s atlas is in the Grove; the first quest on the page.' },
    speakers: [HIMMEL, HEITER, EISEN, FRIEREN],
    steps: [
      {
        id: 'a21-01-s1',
        goal: 'Step into the page with Keeper Fern, under the falling stars.',
        hint: 'Touch the page where the stars fall, then walk in through the city gate.',
        check: 'explore:a21-capital:gate',
        scene: {
          id: 'a21-01-page',
          lines: [
            N('Fern from next door is round for tea. She leans over your shoulder to see what you’re reading.'),
            N('Nova’s atlas lies open at a page washed in dark blue: a royal city on a hill, and the sky above it full of falling stars.'),
            K('Is it meant to move like that? Pages don’t move. Mine don’t. Mine have jam on them.', 'shock'),
            N('The stars drip off the paper onto your fingers, cool as rain. Then there are cobbles under your boots, and a crowd, and roast chestnuts.'),
            K('We’re in it. We’re in the book. Do I look like I’m in a book?', 'think'),
            N('By the fountain in the square, four people stand a little apart from the crowd, looking up.'),
            N('An old man in a blue cloak leans on a stick, beside an old priest with a bottle and a dwarf with a beard to his belt.'),
            N('And an elf with pale hair in two tails, who looks about fifteen. You will learn she has looked it for a thousand years.'),
            HI('Hello! You look lost. Lost is good. Everyone interesting is a little bit lost.', 'happy'),
            HI('I’m Himmel. That’s Heiter, that’s Eisen, and that’s Frieren. We beat the Demon King. Fifty years ago, so don’t be impressed.'),
          ],
          choices: [
            {
              id: 'travellers',
              label: 'Say you’re travellers, from a long way off.',
              then: [HI('Then you’re just in time. These come once every fifty years. We promised we’d watch them together.')],
            },
            {
              id: 'book',
              label: 'Say you’re Keepers, from a valley outside the book.',
              then: [HE('Outside the book. Well. I’ve heard stranger confessions. Not many, but some.', 'think')],
            },
            {
              id: 'nubbin',
              label: 'Introduce your Nubbin first.',
              then: [N('Your Nubbin bows, which it learned from a duck.'), EI('Good manners. Better than his.')],
            },
          ],
        },
        done: {
          id: 'a21-01-page-done',
          lines: [
            N('Keeper Fern glances down at her boots, where nobody is sitting. It’s an old habit, and she catches herself at it.'),
            K('Right. Stars. Lead on.'),
          ],
        },
      },
      {
        id: 'a21-01-s2',
        goal: 'Walk up to the hill outside the city with the old party.',
        hint: 'Walk at Himmel’s pace, not yours. Stop when he stops.',
        check: 'walk:a21-hill:capital',
        scene: {
          id: 'a21-01-hill',
          lines: [
            FR('There’s a better spot up the hill, away from the lamps. We went there last time.'),
            HI('Last time I could run up it.', 'happy'),
            N('He can’t now. He walks with the stick, and stops every so often to admire a view that is mostly hedge.'),
            N('Frieren walks ahead, then waits, then walks ahead again. Each time she waits a little longer, as if she’s only just noticing.'),
            FR('You’ve got slow, Himmel.', 'think'),
            HI('I’ve got old. It happens to the rest of us. You should try it. It’s very educational.'),
            HE('Speak for yourself. I have aged like a fine wine.'),
            EI('You’ve aged like a wine cellar.'),
            N('Your Nubbin trots beside Himmel’s stick, matching it step for step.'),
          ],
          choices: [
            {
              id: 'arm',
              label: 'Offer Himmel your arm.',
              then: [HI('Thank you. Don’t tell her. She thinks I’m still twenty-four.', 'soft'), FR('I can hear you.')],
            },
            {
              id: 'frieren',
              label: 'Hang back with Frieren.',
              then: [FR('He used to be quick. When did that stop?', 'think'), Y('Slowly, probably.'), FR('Hm.')],
            },
            {
              id: 'bottle',
              label: 'Carry Heiter’s bottle for him.',
              then: [HE('A true friend of the church. Mind you don’t spill the church.', 'happy')],
            },
          ],
        },
        done: {
          id: 'a21-01-hill-done',
          lines: [
            N('At the top the grass is cold and the city lights are small. Himmel sits down with a long, happy groan.'),
            HI('Same spot. Same four of us. Plus guests. That’s an improvement on last time.', 'happy'),
          ],
        },
      },
      {
        id: 'a21-01-s3',
        goal: 'Watch the Era Meteors from the hilltop.',
        hint: 'Sit in the grass with the others and look up. Your Nubbin will try to count them.',
        check: 'watch:a21-meteors:hill',
        scene: {
          id: 'a21-01-meteors',
          lines: [
            N('Then the sky begins: one streak, then ten, then more than anyone could name, falling slow and silver over the city.'),
            N('Your Nubbin starts counting them on its feet. It runs out of feet almost at once, and starts again.'),
            K('It’s doing its best. That’s all you can ask of anyone.'),
            HI('Fifty years since the last ones. It’s nice when a promise turns out to be an easy one.', 'soft'),
            FR('Fifty years. It doesn’t feel like it.', 'think'),
            HE('It does to my knees.'),
            N('Himmel isn’t watching the sky. He is watching Frieren watch it.'),
            FR('I know somewhere better, up north. You can see the whole sky from there. I’ll show you next time.'),
            N('Nobody says anything about next time. Eisen looks at his boots, and Heiter takes a long drink.'),
            HI('I’d like that.', 'soft'),
          ],
          choices: [
            {
              id: 'count',
              label: 'Help your Nubbin count.',
              then: [N('You count them together. You get to two hundred and eleven, then you both lose track and lie back in the grass.')],
            },
            {
              id: 'lose',
              label: 'Let it lose count.',
              then: [N('Your Nubbin loses count, sits down, and just watches. It looks a lot happier.')],
            },
            {
              id: 'himmel',
              label: 'Watch Himmel instead.',
              then: [N('His face is old and creased and lit silver. He looks like a man getting exactly what he came for.', 'soft')],
            },
          ],
        },
      },
    ],
    complete: {
      id: 'a21-01-complete',
      lines: [
        N('The meteors thin out and stop. Down below, the city bells ring midnight.'),
        HI('That was a good night. The best kind. The kind you only notice afterwards.', 'soft'),
        FR('It was only a few stars.'),
        N('Frieren says it lightly. One day she will think about it for a long time.'),
        N('The page sighs under you like a book left open in the wind. The grass goes soft, and then it is paper again.'),
        K('I’d have stayed longer. Is that silly? I don’t even know them.', 'soft'),
      ],
    },
    rewards: [],
    sets: { 'a21-01': true },
    notes:
      'OPENING: the page is a night sky over a royal capital, the meteors moving on the paper. Keeper Fern comes in ' +
      'with you on every visit to this page. BRAMBLE (reads s8Reunited): if true, play A21_VARIANTS ' +
      'a21-01-page-done-bramble in place of a21-01-page-done, and draw Bramble (old, grey, left ear folded at the ' +
      'tip) at Keeper Fern’s heel on every A21 scene from here on. She has no lines anywhere on this page except in ' +
      'variants; the quests never wait on her. Staging: the old party are drawn as licensed (Himmel, Heiter and ' +
      'Eisen fifty years on). The meteor shower is a slow particle effect; your Nubbin’s counting is an idle ' +
      'animation (paws up, one by one).',
  },

  // ---------------------------------------------------------------- A21-2
  {
    id: 'a21-02',
    code: 'A21-2',
    title: 'The Funeral',
    source: src('Himmel’s funeral'),
    audience: 'main',
    trigger: { where: WHERE, when: after('A21-1') },
    requires: ['A21-1'],
    speakers: [HEITER, EISEN, FRIEREN],
    steps: [
      {
        id: 'a21-02-s1',
        goal: 'Carry flowers to the hero’s funeral in the capital.',
        hint: 'Take the flowers from the stall in the market and carry them up to the cathedral steps.',
        check: 'carry:a21-flowers:cathedral',
        scene: {
          id: 'a21-02-flowers',
          lines: [
            N('The page turns itself. When it settles, the same city is hung in black, and every bell in it is quiet.'),
            N('Only a few years have gone. Hardly any time, for an elf.'),
            K('Oh. Oh, no. It’s him, isn’t it. The old man with the stick.', 'sad'),
            N('In the market a flower-seller is giving away everything she has. People carry armfuls up to the cathedral.'),
            N('She hands you a bundle of white lilies, and Keeper Fern a bundle of something blue, without a word.'),
            N('Heiter stands at the steps in his priest’s robes, sober for once. Eisen is beside him, very still.'),
            HE('Ah. Our guests from the book. He’d have liked that you came. He always liked a crowd.', 'sad'),
            N('Frieren arrives last. She walks through the mourners as if she were late for something ordinary.'),
            FR('It was only ten years, really. Our journey. And it’s been fifty since then.', 'think'),
            FR('I don’t know why everyone’s looking at me like that.'),
          ],
          choices: [
            {
              id: 'lay',
              label: 'Lay your lilies with the others.',
              then: [N('You lay them by the cathedral doors. They join a white drift that comes up to your knees.')],
            },
            {
              id: 'give',
              label: 'Give your flowers to Frieren to lay.',
              then: [FR('Why me?'), Y('You knew him best.'), FR('…Did I?', 'think')],
            },
            {
              id: 'keep',
              label: 'Hold on to them for now.',
              then: [N('You keep the lilies against your chest. They smell of rain and somebody else’s garden.')],
            },
          ],
        },
        done: {
          id: 'a21-02-flowers-done',
          lines: [N('Inside, the cathedral is full to the doors. Someone has kept three places at the front, and two behind them.')],
        },
      },
      {
        id: 'a21-02-s2',
        goal: 'Stand with the party at Himmel’s burial.',
        hint: 'Follow the mourners out to the churchyard and stand at the back with Keeper Fern.',
        check: 'wait:a21-burial:churchyard',
        scene: {
          id: 'a21-02-burial',
          lines: [
            N('They bury him in the churchyard behind the cathedral, on a grey morning with no wind.'),
            N('Heiter says the words. Eisen takes off his helmet, which nobody here has ever seen him do.'),
            N('Frieren stands at the edge of the grave with her hands folded. She looks at the coffin as if it were a puzzle.'),
            FR('I only knew him for ten years. And I never even…', 'think'),
            N('The first spadeful of earth goes in. Then her face crumples all at once, as if something had been holding it up.'),
            FR('I knew he’d go. Humans do. I knew it the whole time.', 'sad'),
            FR(LIFT_KNOW, 'sad'),
            N('Nobody answers. Heiter puts a hand on her shoulder, and leaves it there.'),
            N('Your Nubbin climbs into your arms and hides its face in your coat.'),
          ],
          choices: [
            {
              id: 'stay',
              label: 'Stay where you are, at the back.',
              then: [N('You stay. From the back of a funeral you can see who needs a hand on their shoulder.')],
            },
            {
              id: 'nubbin',
              label: 'Hold your Nubbin a little tighter.',
              then: [N('It holds your thumb in both paws, and doesn’t let go until the last of the earth is in.')],
            },
          ],
        },
        done: {
          id: 'a21-02-burial-done',
          lines: [
            A2_FERN_OPEN,
            K('Hazel’s been gone since the snow. I keep thinking of things I never asked her.', 'sad'),
            A2_FERN_CLOSE,
          ],
        },
      },
    ],
    complete: {
      id: 'a21-02-complete',
      lines: [
        N('At the churchyard gate, Frieren dries her face on her sleeve, crossly, as if it had done it on purpose.'),
        FR('I’m going to travel. Collect spells. And find out about humans. Properly, this time.'),
        EI('Good. Start with the ones still here.'),
        HE('Come and see me some time. Not in fifty years. I won’t keep.', 'soft'),
        FR('I’ll come.'),
        N('The page turns slowly, like a heavy door. The churchyard goes back to paper, with the lilies still on it.'),
      ],
    },
    rewards: [],
    sets: { 'a21-02': true },
    notes:
      'KEEPER FERN’S LINE reads the campaign (read-only). a21-02-burial-done, as shown, plays before chapter 10’s ' +
      'dawn (Hazel not yet home). From chapter 10’s dawn until the ending (Hazel home), play A21_VARIANTS ' +
      'a21-02-burial-done-home. Once the campaign is finished (CampaignState.ending set), play ' +
      'a21-02-burial-done-after. LIFTED TEXT 1: a21-02-burial#6 (see the header); say it plainly, no music sting. ' +
      'CARE: Himmel died of old age; the funeral is quiet. No body is shown: a closed coffin, earth, flowers. Eisen ' +
      'takes his helmet off (a small animation). Keep the music to a single held note, or silence.',
  },

  // ---------------------------------------------------------------- A21-3
  {
    id: 'a21-03',
    code: 'A21-3',
    title: 'Fern Meets Fern',
    source: src('Heiter in Strahl, and the girl he took in'),
    audience: 'main',
    trigger: { where: WHERE, when: after('A21-2') },
    requires: ['A21-2'],
    speakers: [HEITER, FRIEREN, FERN],
    steps: [
      {
        id: 'a21-03-s1',
        goal: 'Travel with Frieren to Heiter’s house in Strahl.',
        hint: 'Follow the road up through the holy city to the house with the overgrown garden.',
        check: 'visit:a21-heiter:strahl',
        scene: {
          id: 'a21-03-strahl',
          lines: [
            N('Twenty years go by in the margin, like weather. When the page settles, the road runs up into a city of white towers: Strahl.'),
            N('Frieren is on the road, not changed at all. Neither, the atlas seems to have decided, have you.'),
            K('Twenty years. I didn’t even need a cardigan.', 'think'),
            N('At the top of the town there is a small house with a garden gone to seed. An old man is asleep on the porch with a cup.'),
            HE('Frieren! You came. I said not fifty years. I’m touched you managed twenty.', 'happy'),
            FR('You’re very old, Heiter.'),
            HE('I’m dying, actually. Slowly, and comfortably, which is the good way. And you two haven’t aged a day.'),
            K('It’s the book. We’re not from round here. You look very… comfortable.'),
            HE('Frieren, I have a favour to ask. Two, in fact. The first is a grimoire, and I know you can’t say no to a grimoire.'),
            FR('I can say no to anything.'),
            HE('It’s very old. Very rare. Written by a sage nobody has ever managed to read.'),
            FR('…How long would it take?', 'think'),
          ],
          choices: [
            {
              id: 'second',
              label: 'Ask what the second favour is.',
              then: [HE('Ah. The second favour is shy. She’s inside, pretending not to listen.')],
            },
            {
              id: 'garden',
              label: 'Look at the garden.',
              then: [K('Whoever planted this gave up in the spring. I know the look. I do it myself, most years.')],
            },
          ],
        },
        done: {
          id: 'a21-03-strahl-done',
          lines: [FR('Years. Four, perhaps five, if I don’t sleep much.'), HE('Perfect. That’s just long enough.', 'happy')],
        },
      },
      {
        id: 'a21-03-s2',
        goal: 'Meet the girl Heiter took in.',
        hint: 'Go up to the doorstep when Heiter calls her out. Mind the step.',
        check: 'talk:a21-fern:doorstep',
        scene: {
          id: 'a21-03-step',
          lines: [
            HE('Fern! Come and meet people. Bring your staff, they’ll want to see you can hold it.'),
            N('A girl comes to the door: dark purple hair, a very straight back, and eyes that check every face once and file it.'),
            HE('I found her after the war, on her own. I brought her home. Now she lives here and complains about my drinking.', 'soft'),
            FN('Someone has to.'),
            N('She bows to Frieren, neatly and deeply, the way somebody bows who has practised in a mirror.'),
            FN('My name is Fern. Lord Heiter says you are the greatest mage alive. Please teach me.'),
            N('Keeper Fern, coming up the path to say hello, trips over the step and lands on her hands at the girl’s feet.'),
            K('Sorry. Sorry! That’s… that’s my name too. Fern. I’m a Fern. Sorry.', 'shock'),
            FN('It’s a common name. You needn’t apologise for it.'),
            N('She helps Keeper Fern up by the elbow, briskly, like someone who does a lot of helping people up.'),
          ],
          choices: [
            {
              id: 'introduce',
              label: 'Introduce yourself properly.',
              then: [Y('I’m a Keeper. So is she. We look after small things.'), FN('So does Lord Heiter. Badly.', 'think')],
            },
            {
              id: 'name',
              label: 'Tell her it’s a good name.',
              then: [
                FN('Lord Heiter chose it. He said it’s a plant that grows where nothing else wants to.'),
                K('That’s… actually, that’s exactly right.', 'soft'),
              ],
            },
            {
              id: 'nubbin',
              label: 'Let your Nubbin say hello.',
              then: [
                N('Your Nubbin copies her bow. It is too round to bow, and falls forward onto its face.'),
                FN('Thank you. That was very formal.'),
              ],
            },
          ],
        },
        done: {
          id: 'a21-03-step-done',
          lines: [K('She’s going to be much better at being Fern than I am. I can tell already.', 'happy')],
        },
      },
    ],
    complete: {
      id: 'a21-03-complete',
      lines: [
        FR('I don’t take apprentices.'),
        HE('Of course not. You’ll just be here, for four or five years, reading a grimoire. And she’ll be here. In the same house.', 'happy'),
        FR('…You did that on purpose.'),
        HE('I’m a priest. I’m allowed a small lie in a good cause. It’s in the small print.'),
        N('Frieren looks at the girl. The girl looks back without blinking.'),
        FR('Fine. Show me what you can do, Fern. The other Fern can water something.'),
        K('I can do that. Badly, but I can do it.', 'happy'),
      ],
    },
    rewards: [],
    sets: { 'a21-03': true },
    notes:
      'FERN MEETS FERN: the title beat. Young Fern’s line at a21-03-step#8 is the outline’s own (not lifted). ' +
      'CARE: Fern’s past is told only as a21-03-step#2: Heiter found her alone after the war. Nothing else, ever. ' +
      'The trip is a small stumble animation; Keeper Fern is not hurt. Young Fern is a child here (as licensed), and ' +
      'grows up over A21-4. Heiter’s cup is never named as drink on screen; the joke is in the lines.',
  },

  // ---------------------------------------------------------------- A21-4
  {
    id: 'a21-04',
    code: 'A21-4',
    title: 'The Rock',
    source: src('Fern’s training in Strahl, and the far rock'),
    audience: 'main',
    trigger: { where: WHERE, when: after('A21-3') },
    requires: ['A21-3'],
    speakers: [FERN, FRIEREN, HEITER],
    steps: [
      {
        id: 'a21-04-s1',
        goal: 'Fetch water for both Ferns: one for the girl, one for the sapling.',
        hint: 'Fill both buckets at the well. Who you take water to first is up to you.',
        check: 'carry:a21-water:well',
        scene: {
          id: 'a21-04-well',
          lines: [
            N('Months pass, and then years. The page keeps them in its corners, like pressed leaves.'),
            N('Every morning young Fern walks to the end of the field and aims her staff at a rock on the hillside opposite.'),
            N('It is a long way off. Her spells fall short, or go wide, or hit the hill and frighten the goats.'),
            FN('Again.', 'angry'),
            N('Every morning Keeper Fern kneels in Heiter’s garden by a sapling she planted, and talks to it.'),
            K('Come on. You’re a tree. Trees grow. It’s your one job. I believe in you. A bit.'),
            N('The sapling has three leaves. It had four yesterday.'),
            FR('Fetch some water, would you? One of them will need a drink, and so will the other one.'),
          ],
          choices: [
            {
              id: 'girl',
              label: 'Young Fern first: she’s been at it since dawn.',
              then: [
                FN('Thank you.'),
                N('She drinks half, pours the other half over her head, and goes straight back to the rock.'),
              ],
            },
            {
              id: 'sapling',
              label: 'The sapling first: it’s smaller.',
              then: [K('Thank you. It won’t say so. It doesn’t say anything. That’s probably the trouble.', 'soft')],
            },
            {
              id: 'fair',
              label: 'Split it fairly, a bucket each.',
              then: [FR('Very fair. I’ve never seen the point of fair. That was very fair, though.', 'think')],
            },
          ],
        },
        done: {
          id: 'a21-04-well-done',
          lines: [
            HE('She means to hit that rock before I go. She thinks I’ll rest easier.', 'soft'),
            HE('She’s right. I will. Don’t tell her I said so. She’d only try harder, and she’s trying quite hard enough.'),
          ],
        },
      },
      {
        id: 'a21-04-s2',
        goal: 'Watch from the field when young Fern tries for the rock again.',
        hint: 'Stand at the end of the field, and keep your Nubbin well back.',
        check: 'watch:a21-rock:field',
        scene: {
          id: 'a21-04-rock',
          lines: [
            N('It is the fourth spring. Heiter sits on the porch with a blanket now, even in the sun.'),
            N('Young Fern is taller. She stands at the end of the field, very still, the staff steady in both hands.'),
            FR('Don’t aim at the rock. Aim past it. Aim at whatever’s behind it.', 'think'),
            FN('There’s nothing behind it.'),
            FR('Then aim at nothing. It’s a very big target.'),
            K('That’s either very wise or complete rubbish. I honestly can’t tell.', 'think'),
            N('Your Nubbin covers its eyes with both paws, then uncovers one.'),
            N('Young Fern breathes in. The air in front of her staff bends, like water over a stone.'),
          ],
          choices: [
            {
              id: 'breath',
              label: 'Hold your breath with her.',
              then: [N('You hold it, and so does Keeper Fern. So, from the porch, does Heiter.')],
            },
            {
              id: 'heiter',
              label: 'Look at Heiter instead.',
              then: [N('He is leaning forward in his chair, gripping the blanket, like a man waiting to hear his own name called.')],
            },
          ],
        },
        done: {
          id: 'a21-04-rock-done',
          lines: [
            N('The light leaves her staff in a straight line, across the field and the gap, and the rock on the far hill bursts into gravel.'),
            N('The goats run. Young Fern stays exactly where she is, staring.'),
            FN('I hit it.', 'shock'),
          ],
        },
      },
    ],
    complete: {
      id: 'a21-04-complete',
      lines: [
        N('Heiter claps from the porch, slowly, three times, because that is all he has the breath for.'),
        HE('Well done, Fern. Oh, well done.', 'happy'),
        N('Young Fern runs to him. She doesn’t run, usually.'),
        K('Look. Look, it’s got a new leaf. Today of all days. It was waiting for her.', 'happy'),
        N('The sapling has four leaves. Nobody else notices, so you notice for everyone.'),
        FR('Four years. That was quick.', 'think'),
      ],
    },
    rewards: [],
    sets: { 'a21-04': true },
    notes:
      'Time passes in two jumps (a21-04-well#0 and a21-04-rock#0): show it as the garden changing round a still ' +
      'camera, seasons in a few seconds. Young Fern grows from a child to a teenager (licensed designs for both ' +
      'ages). Keeper Fern’s sapling is our own prop, planted in Heiter’s garden; it pays off in A21-5. The spell is a ' +
      'single line of light; the rock bursts into gravel, nobody near it.',
  },

  // ---------------------------------------------------------------- A21-5
  {
    id: 'a21-05',
    code: 'A21-5',
    title: 'Heiter’s Goodbye',
    source: src('the grimoire, and Heiter’s farewell in Strahl'),
    audience: 'main',
    trigger: { where: WHERE, when: after('A21-4') },
    requires: ['A21-4'],
    speakers: [FRIEREN, HEITER, FERN],
    steps: [
      {
        id: 'a21-05-s1',
        goal: 'Help Frieren finish the old grimoire in Heiter’s study.',
        hint: 'Carry the lamp in and hold the pages flat while she reads the last chapter.',
        check: 'inspect:a21-grimoire:study',
        scene: {
          id: 'a21-05-grimoire',
          lines: [
            N('The grimoire lies on Heiter’s desk under a lamp. Frieren turns the last page and frowns at it.'),
            FR('There’s nothing here about living longer. Nothing at all. It’s a great deal of very pretty nonsense.', 'think'),
            HE('I know. I had it read years ago.', 'soft'),
            FR('Then why…'),
            HE('Because you’d stay for a grimoire, and you wouldn’t stay for me. And Fern needed teaching.'),
            HE('She’s ready now. Ready to travel. Ready to have someone who isn’t me.'),
            FR('You lied to me for four years.'),
            HE('I’m a priest. I told you. Small print.', 'happy'),
            K('That’s quite clever, honestly. I’d never think of it. I’d just ask, and then apologise for asking.'),
          ],
          choices: [
            {
              id: 'kind',
              label: 'Tell Heiter it was a kind lie.',
              then: [HE('The Goddess and I have an arrangement. She overlooks the kind ones. I hope.', 'soft')],
            },
            {
              id: 'her',
              label: 'Tell Frieren he did it for her as well.',
              then: [FR('For me?'), Y('So you wouldn’t be on your own.'), FR('…Hm.', 'think')],
            },
            {
              id: 'lamp',
              label: 'Hold the lamp, and say nothing.',
              then: [N('You hold the lamp. It is the sort of moment that needs one person to keep the light steady.')],
            },
          ],
        },
        done: {
          id: 'a21-05-grimoire-done',
          lines: [HE('Now. The second favour. Then I’ll stop asking for things. Well. Nearly.')],
        },
      },
      {
        id: 'a21-05-s2',
        goal: 'Hear Heiter’s last favour on the porch.',
        hint: 'Sit with Heiter on the porch, and stay until he has finished.',
        check: 'sit:a21-heiter:porch',
        scene: {
          id: 'a21-05-porch',
          lines: [
            N('Evening. Heiter’s chair, Heiter’s blanket, and the far hill with a bite out of it where the rock was.'),
            HE('I want you to take Fern and go. Soon. Before I die.', 'soft'),
            FR('Why before?'),
            HE('She lost everyone once. I won’t have her stand at another grave so young. Let her be on the road when it happens.'),
            HE('Let her hear it in a letter, somewhere with good bread. That’s all I want.'),
            N('Frieren sits very still. Then she wipes her eyes, angrily, the way she did at the churchyard gate.'),
            FR('Then we do it properly. A proper goodbye. I’m not sneaking off as if I didn’t care.', 'sad'),
            HE('You’ve changed, Frieren.', 'soft'),
            FR('It’s been twenty years. That’s nothing.'),
            HE('It isn’t nothing. That’s the whole point.'),
          ],
          choices: [
            {
              id: 'sapling',
              label: 'Ask Keeper Fern to plant her sapling by his chair.',
              then: [K('Right where he can see it. It’ll get the sun, and he’ll get the company.', 'soft')],
            },
            {
              id: 'promise',
              label: 'Promise to look after young Fern.',
              then: [HE('She’ll look after you, I expect. But thank you. It’s nice to hear it said out loud.')],
            },
            {
              id: 'sit',
              label: 'Just sit with him.',
              then: [N('You sit on the step by his chair. After a while he puts a hand on your head, lightly, like a blessing he can’t be bothered to say.')],
            },
          ],
        },
        done: {
          id: 'a21-05-porch-done',
          lines: [
            HE('One more thing. Fern, my dear. Your staff.'),
            N('He gives her a new staff, long and pale, with a silver clasp at the head. He has had it hidden under the porch for a month.'),
            FN('Lord Heiter, I can’t…'),
            HE('You can. It’s a staff. You just hold the end.', 'happy'),
          ],
        },
      },
    ],
    complete: {
      id: 'a21-05-complete',
      lines: [
        N('In the morning there is a proper goodbye. Heiter stands at his gate with a stick, because he insists.'),
        FN('Thank you for everything, Lord Heiter.', 'sad'),
        HE('Write to me. Tell me about the bread.'),
        N('Young Fern bows once more, very deeply. Then she walks quickly down the hill without looking back, because she has to.'),
        N('Frieren looks back. Twice.'),
        K('He knows they’ll be coming. The letters. That’s something, isn’t it?', 'sad'),
        N('Nobody answers. The road runs out of Strahl, and you go with it.'),
      ],
    },
    rewards: [],
    sets: { 'a21-05': true },
    notes:
      'CARE: Heiter dies offstage, of old age, after the party has gone, as he asks. Nothing on this page shows or ' +
      'narrates his death; later quests speak of him in the past tense. Staff: Heiter’s gift (a21-05-porch-done) is ' +
      'the staff that breaks in A21-18 and is mended there; keep its silver clasp visible in every later scene. ' +
      'Keeper Fern’s sapling stays in Heiter’s garden whichever choice is picked (the “sapling” choice just says so).',
  },

  // ---------------------------------------------------------------- A21-6
  {
    id: 'a21-06',
    code: 'A21-6',
    title: 'Paid in Spells',
    source: src('odd jobs in the Turk region, and the hero’s statue'),
    audience: 'main',
    trigger: { where: WHERE, when: after('A21-5') },
    requires: ['A21-5'],
    speakers: [FRIEREN, FERN, OLDWOMAN],
    steps: [
      {
        id: 'a21-06-s1',
        goal: 'Help with odd jobs across the Turk region.',
        hint: 'Take the jobs off the notice boards one by one. Frieren only wants the ones that pay in spells.',
        check: 'collect:a21-jobs:turk',
        scene: {
          id: 'a21-06-jobs',
          lines: [
            N('The Turk region is all small towns and long hedges. Frieren reads every notice board as if it were a menu.'),
            FR('Clear a cellar of slimes. Pays in a spell that finds lost buttons. Yes.', 'happy'),
            FN('Frieren. We need money. For food. And an inn with a roof.', 'angry'),
            FR('This one pays in a spell that keeps tea at exactly the right heat for an hour.'),
            FN('We have no tea.'),
            FR('Then we’ll want the spell all the more when we do.'),
            K('Sorry, Fern, I’m on her side. A spell for buttons. I lose so many buttons.', 'happy'),
            N('By the end of the week Frieren has learned seven spells, and young Fern has sold her winter gloves for bread.'),
            N('The last job is a ruin outside town. In its cellar there is a single wooden chest.'),
            FR('A chest. I have a spell that says if it’s a mimic. It’s right ninety-nine times in a hundred.', 'think'),
            N('She casts it, and the spell says mimic. She opens the chest anyway, head first.'),
          ],
          choices: [
            {
              id: 'pull',
              label: 'Grab her boots and pull.',
              then: [N('You pull, and young Fern pulls you. The chest lets go with a pop, and Frieren comes out cross and damp.')],
            },
            {
              id: 'ask',
              label: 'Ask young Fern what to do.',
              then: [
                FN('Pull her legs. It isn’t the first time. It won’t be the last.', 'think'),
                N('You pull, she comes out, and the chest burps.'),
              ],
            },
            {
              id: 'nubbin',
              label: 'Let your Nubbin deal with it.',
              then: [N('Your Nubbin bites the chest, and the chest bites back. Then everyone is pulling everyone, and out comes Frieren.')],
            },
          ],
        },
        done: {
          id: 'a21-06-jobs-done',
          lines: [
            FR('It was very dark in there. And damp. I thought this might be the hundredth one.', 'sad'),
            N('Your Nubbin glares at the chest. From now on it will glare at every chest it meets, on principle.'),
          ],
        },
      },
      {
        id: 'a21-06-s2',
        goal: 'Clean the statue of Himmel in the town square.',
        hint: 'Carry the bucket up the ladder. Frieren will do the spell.',
        check: 'climb:a21-statue:square',
        scene: {
          id: 'a21-06-statue',
          lines: [
            N('In the next town’s square there is a statue of a young man with a sword, gone green with weather. It is Himmel, aged twenty-four.'),
            N('An old woman with a broom stops Frieren in the street.'),
            OW('You’re the elf. From the party. I knew you’d come by one day. He’s gone ever so green.', 'think'),
            OW('Would you clean him? I can’t get up there any more. I used to do it every spring.'),
            FR('I have a spell that takes moss and rust off bronze.'),
            FN('Of course you do.', 'think'),
            FR('It took me twelve years to find. It was worth it.'),
            N('You carry the bucket up the ladder. Frieren murmurs, and the green slides off the bronze like a wet sheet.'),
            N('Underneath, Himmel is smiling with his chin up. Someone told the sculptor about his chin.'),
          ],
          choices: [
            {
              id: 'nose',
              label: 'Polish his nose.',
              then: [N('You give his nose a good polish until it shines. He looks pleased with himself, which he would have been.')],
            },
            {
              id: 'like',
              label: 'Ask Frieren if it looks like him.',
              then: [FR('No. His hair was worse. But the smile’s right.', 'soft')],
            },
            {
              id: 'cloth',
              label: 'Hand the cloth to Frieren.',
              then: [N('Frieren takes it and polishes the hand on the sword, slowly, finger by finger.')],
            },
          ],
        },
        done: {
          id: 'a21-06-statue-done',
          lines: [OW('There. There he is.', 'happy')],
        },
      },
    ],
    complete: {
      id: 'a21-06-complete',
      lines: [
        N('Frieren stands in the square and looks up at the statue for a long time. Long enough that young Fern stops talking about money.'),
        FR('He looks a bit bare, doesn’t he.', 'think'),
        FN('He’s a statue.'),
        FR('He liked flowers. One kind especially.'),
        K('Oh, no. I know that face. That’s a garden face. That’s the face I make before a very long afternoon.'),
      ],
    },
    rewards: [],
    sets: { 'a21-06': true },
    notes:
      'MIMIC RUNNING JOKE starts here: your Nubbin hates mimics, and glares at every chest on this page from now on ' +
      '(an idle animation near any chest prop). The mimic is a comic gulp; Frieren is never hurt, only cross and ' +
      'damp. The odd spells (buttons, tea, bronze) are our own inventions, not the source’s. The statue is Himmel ' +
      'at twenty-four (licensed likeness), green before and bronze after; it gets its wreath in A21-7.',
  },

  // ---------------------------------------------------------------- A21-7
  {
    id: 'a21-07',
    code: 'A21-7',
    title: 'Himmel’s Flower',
    source: src('the search for the blue moon-weed'),
    audience: 'main',
    trigger: { where: WHERE, when: after('A21-6') },
    requires: ['A21-6'],
    speakers: [FRIEREN, FERN, OLDWOMAN],
    steps: [
      {
        id: 'a21-07-s1',
        goal: 'Hear what Frieren means to look for, and decide whether to search with her.',
        hint: 'Talk to the old woman by the statue, then choose: search with Frieren, or go ahead with young Fern.',
        check: 'choose:a21-moonweed:search',
        scene: {
          id: 'a21-07-flower',
          lines: [
            FR('Blue moon-weed. Little blue flowers like stars. Himmel showed me a field of it once, near where he grew up.'),
            FR('I’d like to crown him with it. A wreath. Since he’s clean now.'),
            OW('Moon-weed? Bless you. That hasn’t grown round here since I was a girl.', 'shock'),
            FR('Then I’ll find where it does. I have a spell for finding flowers. It only shows the ones I’m looking for.'),
            FN('How long will it take?'),
            FR('Not long.', 'think'),
            FN('How long is “not long”, Frieren? In human?', 'angry'),
            FR('…Six months. Perhaps. It could be more.'),
            FN('Then I’ll go ahead to the next town and wait. And find a job that pays in money.'),
            N('Frieren is already walking out of the square with her head down, as if the flowers might be between the cobbles.'),
            K('Six months for a wreath. That’s mad. That’s… actually, that’s quite lovely.', 'soft'),
          ],
          choices: [
            {
              id: 'with',
              label: 'Search with her, however long it takes.',
              set: { 'a21-search': 'with' },
              then: [
                FR('You don’t have to. It’s only a flower.'),
                N('You fall in beside her anyway.'),
                FR('…All right. Keep up. And watch out for little rats with seeds in their cheeks.'),
              ],
            },
            {
              id: 'ahead',
              label: 'Go ahead with young Fern, and wait in the next town.',
              set: { 'a21-search': 'ahead' },
              then: [FN('Thank you. Someone in this party has to know where the bread is.'), FR('I’ll catch you up.', 'think')],
            },
          ],
        },
        done: {
          id: 'a21-07-flower-done',
          lines: [K('Whichever way, I’m with you. I’ve been waiting for things to grow my whole life. It’s my main skill.')],
        },
      },
      {
        id: 'a21-07-s2',
        goal: 'Let the six months go by.',
        hint: 'Follow the seasons as they turn. The page keeps the time for you.',
        check: 'wait:a21-moonweed:half-year',
        scene: {
          id: 'a21-07-search',
          lines: [
            N('You walk with Frieren from field to field for six months, while the summer turns, and turns again.'),
            N('She stops at every hedge and murmurs. The spell lights nothing, and she walks on.'),
            FR('You’re still here.', 'think'),
            Y('You said keep up.'),
            FR('Himmel used to come on errands like this. Never complained once. He complained about everything else.'),
            K('I complain about the weeds every morning. To the weeds. It’s how we get on.'),
            N('In the autumn, by a ruined tower, your Nubbin spots a fat little rat with its cheeks full of something blue.'),
            FR('A seed rat. They carry seeds up high to store them. All the way up.', 'shock'),
            N('The rat whisks into a crack at the foot of the tower. Far above, at the very top, something blue moves in the wind.'),
          ],
          choices: [
            {
              id: 'follow',
              label: 'Follow the rat in.',
              then: [N('You squeeze through after it. The stairs inside are mostly gone, but the walls are good for climbing.')],
            },
            {
              id: 'nubbin',
              label: 'Let your Nubbin go first.',
              then: [N('Your Nubbin scrambles up after the rat, and stops on every ledge to make sure you’re coming.')],
            },
          ],
        },
        done: {
          id: 'a21-07-search-done',
          lines: [
            N('At the top the roof has fallen in, and in the square of open sky there is a whole small field of blue moon-weed, nodding.'),
            FR('There. There it is.', 'soft'),
            N('She kneels and picks, carefully, only what she needs. She takes some seeds from the rat’s store too, and leaves it a biscuit.'),
          ],
        },
      },
      {
        id: 'a21-07-s3',
        goal: 'Crown the statue of Himmel with the wreath.',
        hint: 'Carry the wreath up the ladder in the square and set it on his head.',
        check: 'place:a21-wreath:statue',
        scene: {
          id: 'a21-07-wreath',
          lines: [
            N('Back in the square, Frieren sits on the plinth and weaves the moon-weed into a ring. Her fingers are slow and exact.'),
            OW('Oh. Oh, my. I haven’t seen that blue since I was a girl.', 'shock'),
            FR('He’d have made a fuss. He liked being given things.'),
            FN('Everybody likes being given things.'),
            FR('Not like him. He kept them for years, and showed them to people.', 'soft'),
            N('She hands you the wreath, and holds the ladder.'),
          ],
          choices: [
            {
              id: 'straight',
              label: 'Set it on straight.',
              then: [N('You set it straight on his bronze head. He looks like a hero, and also like a boy at a fair.')],
            },
            {
              id: 'angle',
              label: 'Set it at a jaunty angle.',
              then: [FR('Yes. That’s right. That’s exactly right.', 'happy')],
            },
          ],
        },
        done: {
          id: 'a21-07-wreath-done',
          lines: [N('From the ground, Himmel wears blue. The old woman cries a little, and says it is the wind.')],
        },
      },
    ],
    complete: {
      id: 'a21-07-complete',
      lines: [
        FR('I should have looked at it properly, that field. When he showed me. I was thinking about spells.', 'think'),
        K('You looked properly today. That counts. It has to count, or I’m in real trouble.'),
        FN('We should go, Frieren. It’s a long way north.'),
        N('The wreath is still on the statue as you leave. The blue is the last you see of the town.'),
      ],
    },
    rewards: [],
    sets: { 'a21-07': true },
    notes:
      'THE SIGNATURE CHOICE (a21-07-flower): a21-search = with | ahead. It picks the scenes in step 2 here, the ring ' +
      'scene in A21-16 (a21-16-complete or a21-16-complete-ahead) and the farewell in A21-20 (a21-20-complete or ' +
      'a21-20-complete-ahead), and the Grove keepsake. STEP 2 VARIANTS: the scene and done shown (a21-07-search, ' +
      'a21-07-search-done) are for “with”. For “ahead” play A21_VARIANTS a21-07-wait in place of a21-07-search and ' +
      'a21-07-wait-done in place of a21-07-search-done. The check (wait:a21-moonweed:half-year) is the same in both: ' +
      'the half-year passes as the scene plays. In both, the statue gets its wreath (step 3). Staging for “with”: the ' +
      'seed rat is a small brown rat with blue in its cheeks (it doesn’t talk); the tower climb is a short ' +
      'climbing section with no fall damage.',
  },

  // ---------------------------------------------------------------- A21-8
  {
    id: 'a21-08',
    code: 'A21-8',
    title: 'The Sealed Demon',
    source: src('Qual, sealed eighty years'),
    audience: 'main',
    trigger: { where: WHERE, when: after('A21-7') },
    requires: ['A21-7'],
    speakers: [ELDER, FRIEREN, FERN, QUAL],
    steps: [
      {
        id: 'a21-08-s1',
        goal: 'Visit the village where Frieren sealed a demon long ago.',
        hint: 'Find the elder’s house, by the well under the hill.',
        check: 'visit:a21-elder:village',
        scene: {
          id: 'a21-08-village',
          lines: [
            N('The village sits under a hill with a ring of old stones on top. Even the birds fly round it.'),
            N('The elder is an old man with a bad hip. When he sees Frieren, he drops his cup.'),
            EL('You. You haven’t changed. Not one hair.', 'shock'),
            FR('Do I know you?'),
            EL('I was eight. You gave me a sweet that tasted of nothing. You said it was a spell for sweets that taste of nothing.', 'happy'),
            FR('Oh, that one. I still have it.'),
            EL('Eighty years ago you sealed the demon on the hill. Qual. The hero came back every year after, to check the seal.'),
            EL('Every year, till he couldn’t manage the hill any more. Then I went up for him.'),
            FR('He never told me.', 'think'),
            EL('He said you’d come back one day and finish it. No hurry, he said. You’d get round to it.'),
            K('He knew her, didn’t he. Properly.', 'soft'),
          ],
          choices: [
            {
              id: 'qual',
              label: 'Ask what Qual was like.',
              then: [EL('Before? He had a spell nobody could block. Half the knights of the north fell to it.', 'sad')],
            },
            {
              id: 'visits',
              label: 'Ask about Himmel’s visits.',
              then: [EL('He always brought me sweets. Proper ones. He said one of us ought to have a sweet that tasted of something.', 'happy')],
            },
          ],
        },
        done: {
          id: 'a21-08-village-done',
          lines: [FR('Then let’s finish it. Fern, with me. You two, stay back. Well back. Further than that.')],
        },
      },
      {
        id: 'a21-08-s2',
        goal: 'Watch from the far stones while the seal breaks.',
        hint: 'Keep behind the stones at the foot of the hill, and hold on to your Nubbin.',
        check: 'watch:a21-qual:hill',
        scene: {
          id: 'a21-08-qual',
          lines: [
            N('Frieren lifts the seal. The old stones crack one by one, like ice on a pond.'),
            N('In the middle stands a tall figure in a long coat, with horns, blinking as if he had only just sat down.'),
            QU('The elf. I was just about to kill you.', 'think'),
            FR('Yes. Eighty years ago.'),
            QU('Was it? Then let me finish the sentence.'),
            N('He lifts a hand, and his killing spell leaps out: a thin bright line that once went through shields like paper.'),
            N('Young Fern raises her staff, and a pane of light opens in front of her. The bright line hits it, and stops.'),
            QU('…That should not be possible.', 'shock'),
            FR('Mages studied your spell while you slept. Now every one of them learns to block it in their first year. It’s ordinary magic.'),
            FN('We did it in the first week. It’s quite easy.'),
            N('Your Nubbin, who did not do it in the first week, climbs inside your coat.'),
          ],
          choices: [
            {
              id: 'down',
              label: 'Keep your head down.',
              then: [N('You keep your head down behind the stones. Keeper Fern keeps hers down even further, behind you.')],
            },
            {
              id: 'watch',
              label: 'Watch young Fern.',
              then: [N('She doesn’t step back once. Her feet are planted just as Frieren taught her, years ago, in a field in Strahl.')],
            },
          ],
        },
        done: {
          id: 'a21-08-qual-done',
          lines: [
            N('Then Frieren casts his own spell back at him, quick and plain. It goes through his guard like paper.'),
            N('Qual stands a moment, surprised. Then he comes apart into motes of dark light, and the wind takes them off the hill.'),
          ],
        },
      },
    ],
    complete: {
      id: 'a21-08-complete',
      lines: [
        EL('That’s it, then. Eighty years, and it took a minute.', 'think'),
        FR('Humans got better while he slept. They do that. It still surprises me.', 'soft'),
        EL('There’s a stone for the hero here too. Up the lane. I keep it tidy.'),
        FR('I’ll go and see it.'),
        N('She goes up the lane alone, with a sweet from her pocket. You don’t see what she does with it.'),
      ],
    },
    rewards: [],
    sets: { 'a21-08': true },
    notes:
      'CARE: Qual is undone without a wound: he comes apart into motes of dark light (the rule for every demon on ' +
      'this page). His spell is “his killing spell”, a thin bright line; Fern’s shield is “a pane of light”. Source ' +
      'spell names are not used. The elder’s sweet-that-tastes-of-nothing is our own detail.',
  },

  // ---------------------------------------------------------------- A21-9
  {
    id: 'a21-09',
    code: 'A21-9',
    title: 'Sunrise',
    source: src('the New Year sunrise'),
    audience: 'main',
    trigger: { where: WHERE, when: after('A21-8') },
    requires: ['A21-8'],
    speakers: [FERN, FRIEREN],
    steps: [
      {
        id: 'a21-09-s1',
        goal: 'Help young Fern get Frieren out of bed before dawn on New Year’s morning.',
        hint: 'Go to Frieren’s room at the inn and try something. Anything.',
        check: 'visit:a21-inn:frieren-room',
        scene: {
          id: 'a21-09-bed',
          lines: [
            N('New Year’s morning, two hours before dawn. Snow on the inn roof, and a candle in young Fern’s hand.'),
            FN('The first sunrise of the year. The whole village goes up the hill for it. I want to go. With Frieren.'),
            FN('She won’t get up. She never gets up. I once watched her sleep through a thunderstorm and a goat.'),
            N('Frieren is a shape under three blankets. One hand sticks out, holding a grimoire.'),
            FR('Five more minutes.'),
            FN('You said that an hour ago.', 'angry'),
            FR('Then it’s working.'),
          ],
          choices: [
            {
              id: 'tea',
              label: 'Hold a hot cup of tea under her nose.',
              then: [N('The shape sniffs, and one eye opens. The hand without the grimoire comes out for the tea.')],
            },
            {
              id: 'shutters',
              label: 'Throw the shutters open.',
              then: [N('Cold air pours in, and Frieren burrows deeper. Then she sneezes, which counts as awake.')],
            },
            {
              id: 'nubbin',
              label: 'Put your Nubbin on her face.',
              then: [N('Your Nubbin lies across Frieren’s face like a warm hat. She surfaces, outraged, and quite awake.')],
            },
          ],
        },
        done: {
          id: 'a21-09-bed-done',
          lines: [
            FR('Fine. Fine. It’s only the sun. It does this every day.', 'angry'),
            FN('Not the first one. Coat. Scarf. Boots. I put them by the door last night.'),
          ],
        },
      },
      {
        id: 'a21-09-s2',
        goal: 'Climb the hill and see the first sunrise of the year.',
        hint: 'Follow the villagers’ lanterns up the hill path and find a place on the ridge.',
        check: 'watch:a21-sunrise:ridge',
        scene: {
          id: 'a21-09-sunrise',
          lines: [
            N('The hill path is full of lanterns: families, dogs, grandmothers wrapped like parcels. Frieren climbs it yawning.'),
            N('At the top, Keeper Fern is already there, on a rock, with a kettle on a little fire.'),
            K('I was up anyway. I’m always up. Tea?', 'happy'),
            FN('How did you get up here first?'),
            K('Gardener. We get up when the light does. It isn’t a virtue. It’s a condition.'),
            N('She hands round tea in mismatched cups. Your Nubbin gets the smallest one.'),
            N('Then the sun comes up over the far mountains, gold and slow, and every lantern on the hill looks suddenly silly.'),
            N('Frieren stops yawning. She holds her tea and forgets to drink it.'),
            FR('Himmel used to drag me up to see these. I always said it was only the sun. He always looked so let down.', 'think'),
            FR('I never understood why it mattered. Missing one.'),
            N('She looks at young Fern beside her, red-nosed and glowing in the light. Then at the rest of you.'),
            N('Frieren speaks so quietly that only the people next to her hear. That is everyone who matters.'),
            FR(LIFT_SUNRISE, 'soft'),
            FN('…Happy New Year, Frieren.', 'soft'),
          ],
          choices: [
            {
              id: 'cup',
              label: 'Raise your cup.',
              then: [K('To getting up. Just this once.', 'happy')],
            },
            {
              id: 'watch',
              label: 'Just watch it.',
              then: [N('You watch the sun until it’s too bright to look at. Then you watch it on everyone’s faces.')],
            },
          ],
        },
      },
    ],
    complete: {
      id: 'a21-09-complete',
      lines: [
        FR('We’ll come again next year.', 'think'),
        FN('You’ll say five more minutes.'),
        FR('Then drag me. That’s what he did.'),
        K('Write that down, Fern. Write it in the front of a book. She’ll deny it.', 'happy'),
        N('On the way down, Frieren holds young Fern’s hand on the icy bits. Neither of them mentions it.'),
      ],
    },
    rewards: [],
    sets: { 'a21-09': true },
    notes:
      'LIFTED TEXT 3: a21-09-sunrise#12 (see the header). Staging: the sunrise is the page’s brightest moment so far; ' +
      'let the light come up across the whole screen over a21-09-sunrise#6–7 before anyone speaks. Keeper Fern’s ' +
      'kettle and mismatched cups are hers (she brought them through the page). No timers: the sunrise is a scene, ' +
      'not an event you can miss.',
  },

  // ---------------------------------------------------------------- A21-10
  {
    id: 'a21-10',
    code: 'A21-10',
    title: 'Flamme’s Grimoire',
    source: src('Eisen’s errand, and Flamme’s true grimoire'),
    audience: 'main',
    trigger: { where: WHERE, when: after('A21-9') },
    requires: ['A21-9'],
    speakers: [EISEN, FRIEREN, FERN],
    steps: [
      {
        id: 'a21-10-s1',
        goal: 'Visit Eisen in his cabin in the pines.',
        hint: 'Follow the smoke to the cabin in the pines. Knock loudly: he’s a little deaf.',
        check: 'visit:a21-eisen:cabin',
        scene: {
          id: 'a21-10-eisen',
          lines: [
            N('Eisen lives alone in a cabin in the pines, with a forge that doesn’t get lit much any more.'),
            EI('Frieren. And the book people. Everyone’s got older, apart from the ones who haven’t.', 'think'),
            EI('I’ve a favour. Flamme’s grimoire. The true one, not the copies in the libraries.'),
            FR('Flamme’s? Why?'),
            EI('Because Himmel’s gone, and Heiter’s gone. And there’s a place in the old stories where souls rest. Aureole. Far north.'),
            EI('If anyone wrote down where it is, it was her.'),
            FR('You want me to go to Aureole. And talk to Himmel.', 'shock'),
            EI('I want you to say what you didn’t. You had ten years. I watched you not say it.'),
            EI('I’m too old to come. My knees have given notice. You’re not too old for anything.'),
            K('He’s quite blunt, isn’t he. I like it. Nobody’s blunt with me. They’re all far too nice about the pear tree.'),
          ],
          choices: [
            {
              id: 'come',
              label: 'Ask Eisen to come anyway.',
              then: [EI('I’d slow you down. And I’d be scared the whole way. Dwarves don’t like being scared in company.')],
            },
            {
              id: 'word',
              label: 'Promise to send word.',
              then: [EI('Send it to the forge. I’ll be at the forge. I’m always at the forge.', 'soft')],
            },
          ],
        },
        done: {
          id: 'a21-10-eisen-done',
          lines: [
            EI('Her old house is south, in the hills. Look for the flowers. She always had too many flowers.'),
            EI('And one more thing. I had a student once. Stark. He ran off. If you pass a village by a cliff, look in.'),
          ],
        },
      },
      {
        id: 'a21-10-s2',
        goal: 'Search Flamme’s old house for the true grimoire.',
        hint: 'Explore the meadow round the ruin. Frieren will know the place when she sees it.',
        check: 'explore:a21-flamme:meadow',
        scene: {
          id: 'a21-10-meadow',
          lines: [
            N('Flamme’s house is a ruin of grey stones. Round it, as far as you can see, there is a meadow in full flower.'),
            N('It is the wrong season for flowers. They don’t care.'),
            K('Oh. Oh, look at them. Nobody’s watered these. Nobody’s watered these for a thousand years.', 'shock'),
            FR('It’s her spell. The one that makes a field of flowers. It’s still holding.', 'soft'),
            FR('Flamme was my teacher. She found me when my village burned. She was human. She died a long time ago.'),
            FR('She knew a thousand spells, and that was the one she loved best. It’s no use at all.', 'happy'),
            FN('Then why was it the one she loved?'),
            FR('She said magic ought to be for something. Even if it’s only flowers.'),
            FR('It’s my favourite too. I never told her.'),
            N('Your Nubbin rolls in the flowers until one whole side of it is yellow.'),
          ],
          choices: [
            {
              id: 'teach',
              label: 'Ask Frieren to teach young Fern the spell.',
              then: [FR('Later. It isn’t hard. It just has to be meant.', 'think')],
            },
            {
              id: 'roots',
              label: 'Help Keeper Fern look among the roots.',
              then: [K('Old houses always hide things under the roses. Hazel kept the good jam under hers.')],
            },
          ],
        },
        done: {
          id: 'a21-10-meadow-done',
          lines: [
            N('Frieren walks to the place where the flowers grow thickest, kneels, and parts the stems like hair.'),
            N('Underneath is a small stone box. Inside is a notebook in a neat, sloping hand.'),
          ],
        },
      },
    ],
    complete: {
      id: 'a21-10-complete',
      lines: [
        FR('Aureole. Past the old castle in the north, where the Demon King lived.', 'think'),
        FN('Where the Demon King lived. Of course it is.', 'think'),
        FR('It’s on the way. Everything is, sooner or later.'),
        N('As she leaves, Frieren casts the flower spell once at the ruin’s empty doorstep. A ring of small white flowers comes up.'),
        FR('For the house. It’s only polite.'),
      ],
    },
    rewards: [],
    sets: { 'a21-10': true },
    notes:
      'SETS UP A21-20: the flower spell is shown small here (a ring at a doorstep) so its full field in A21-20 lands. ' +
      'Flamme appears only in Frieren’s words; no flashback figure. The meadow is out of season (show snow on the ' +
      'hills behind it). Eisen’s last line (a21-10-eisen-done#1) sends the party towards Stark for A21-12.',
  },

  // ---------------------------------------------------------------- A21-11
  {
    id: 'a21-11',
    code: 'A21-11',
    title: 'Ghosts in the Mist',
    source: src('the village in the mist, and the monster that wears the faces of the missed'),
    audience: 'main',
    trigger: { where: WHERE, when: after('A21-10') },
    requires: ['A21-10'],
    speakers: [VILLAGER, FRIEREN, FERN],
    steps: [
      {
        id: 'a21-11-s1',
        goal: 'Walk into the misty village where people vanish.',
        hint: 'Keep close to the party in the fog, and don’t follow anyone you know.',
        check: 'explore:a21-mist:village',
        scene: {
          id: 'a21-11-mist',
          lines: [
            N('The village sits in a valley where the mist never lifts. Half the houses have an empty chair by the door.'),
            N('A woman at the well tells you about it without being asked.'),
            VI('People see someone in the fog. Someone they’ve lost. They go off after them, and they don’t come back.', 'sad'),
            FR('A monster. It reads what you miss and wears it. It doesn’t talk much. It doesn’t have to.', 'think'),
            FN('What do we do if we see someone?'),
            FR('Don’t follow. Keep hold of something. A hand. A strap. A Nubbin.'),
            N('Your Nubbin takes hold of the hem of your coat with both paws, as if it had been told personally.'),
            K('Right. Don’t follow. Hold on. I can do that. I’m very good at standing still. Ask anyone.', 'think'),
            N('The mist comes down as thick as wool. You can see your own hand, just.'),
          ],
          choices: [
            {
              id: 'sleeve',
              label: 'Hold Keeper Fern’s sleeve.',
              then: [K('Thanks. You hold mine, I’ll hold yours. Then neither of us goes anywhere stupid.', 'soft')],
            },
            {
              id: 'nubbin',
              label: 'Pick up your Nubbin.',
              then: [N('You pick it up. It is warm, and real, and heavier than it looks, and that helps.')],
            },
          ],
        },
        done: {
          id: 'a21-11-mist-done',
          lines: [N('Somewhere ahead, in the white, something moves. Keeper Fern stops so suddenly that you walk into her.')],
        },
      },
      {
        id: 'a21-11-s2',
        goal: 'Stand by Keeper Fern while young Fern faces the thing in the mist.',
        hint: 'Keep hold of Keeper Fern. Don’t let her walk forward.',
        check: 'wait:a21-ghost:mist',
        scene: {
          id: 'a21-11-ghost',
          lines: [
            N('In the mist sits a Nubbin, round and brown, with a faded ribbon on one ear. The ear folds over at the tip.'),
            N('It is the colour Bramble was before the rail, six years ago. It looks at Keeper Fern and doesn’t blink.'),
            K('Bramble?', 'shock'),
            K('Bramble, love. It’s me. I looked for you. I stood at the bottom till dark.', 'sad'),
            N('She takes one step forward. Your hand is on her sleeve.'),
            N('The Nubbin in the mist tilts its head, exactly the way Bramble did. It knows all her ways, and that’s the cruelty of it.'),
            ...A11_YOUNG_FERN,
          ],
          choices: A11_HOLD,
        },
        done: {
          id: 'a21-11-ghost-done',
          lines: [
            N('Young Fern’s spell goes through the mist in one clean line. The thing in it comes apart into grey motes.'),
            N('The fog thins at once. Where it sat, there is only wet grass, and nobody’s footprints.'),
          ],
        },
      },
      {
        id: 'a21-11-s3',
        goal: 'Sit with Keeper Fern afterwards.',
        hint: 'Sit down next to her on the edge of the well. You don’t have to say anything.',
        check: 'sit:a21-keeper-fern:well',
        scene: {
          id: 'a21-11-sit',
          lines: [
            N('Keeper Fern sits on the edge of the well with her hands between her knees. She is very quiet, which she never is.'),
            K('It had her ear. The fold at the tip. I used to fold it back up, and it’d flop straight down again.', 'sad'),
            K('Six years. You’d think a person would stop seeing her. I see her in every hedge.'),
            N('Young Fern comes and stands a little way off, holding her staff, not sure if she’s allowed.'),
            FN('I saw Lord Heiter. It was nothing like him, really. He’d have been asleep.', 'soft'),
            K('Ha. Yes. Bramble would have been eating something she shouldn’t.', 'happy'),
            N('Frieren sits down on Keeper Fern’s other side and says nothing at all. She seems to know that’s the point.'),
          ],
          choices: [
            {
              id: 'wait',
              label: 'Sit down beside her and wait.',
              then: [N('You sit down next to her, and wait. After a while she leans on you, very slightly.')],
            },
            {
              id: 'out-there',
              label: 'Tell her Bramble might still be out there.',
              then: [
                K('Don’t. Don’t say that unless…', 'sad'),
                N('She stops. Then she takes your hand anyway, hard, and doesn’t let go for a long time.'),
              ],
            },
            {
              id: 'nubbin',
              label: 'Put your Nubbin in her lap.',
              then: [N('She holds it. It lets her, which it doesn’t, usually, for anyone but you.')],
            },
          ],
        },
        done: {
          id: 'a21-11-sit-done',
          lines: [
            K('Thanks. All of you. You’re very good at this. I’m terrible at it.'),
            FR('You sat still. That’s most of it.', 'think'),
          ],
        },
      },
    ],
    complete: {
      id: 'a21-11-complete',
      lines: [
        N('The mist lifts off the village like a lid off a pot. The chairs by the doors are only chairs again.'),
        FR('A cheap trick, that monster. It showed people what they missed, and called it a door.', 'think'),
        FN('Did you see someone, Frieren?'),
        FR('Yes.'),
        N('She doesn’t say who. She doesn’t need to.'),
      ],
    },
    rewards: [],
    sets: { 'a21-11': true },
    notes:
      'THE GHOST READS THE GROVE (s8Reunited, read-only). The scenes shown are for Fern not yet having found Bramble: ' +
      'the monster wears Bramble as she was before the rail (brown, the faded ribbon with Fern’s stitched leaf, the ' +
      'left ear folded at the tip). If s8Reunited is true, Bramble is here with Fern, and the monster wears Hazel’s ' +
      'coat: play A21_VARIANTS a21-11-ghost-hazel in place of a21-11-ghost and a21-11-sit-hazel in place of ' +
      'a21-11-sit. The done scenes are shared. The figure in Hazel’s coat never turns round: we never see a face. ' +
      'The young Fern beat (an old priest’s shape) is the same in both. CARE: the monster is undone in motes; no ' +
      'missing person is found dead. The third rule is acted out in step 3 and never quoted. Keeper Fern’s “Don’t ' +
      'say that unless…” echoes her line in S8.',
  },

  // ---------------------------------------------------------------- A21-12
  {
    id: 'a21-12',
    code: 'A21-12',
    title: 'Stark',
    source: src('Stark and the dragon'),
    audience: 'main',
    trigger: { where: WHERE, when: after('A21-11') },
    requires: ['A21-11'],
    speakers: [VILLAGER, STARK, FRIEREN, FERN],
    steps: [
      {
        id: 'a21-12-s1',
        goal: 'Find the young warrior the village is pinning its hopes on.',
        hint: 'Ask in the village, then climb to the house by the cliff.',
        check: 'visit:a21-stark:cliff-house',
        scene: {
          id: 'a21-12-stark',
          lines: [
            N('The village by the cliff is very proud of Stark. A red dragon lives on the cliff top, and for three years it hasn’t come down.'),
            VI('He’s the bravest lad there is. The dragon won’t come near while he’s about.', 'happy'),
            N('Stark, when you find him, is a tall young man with an axe and both hands shaking.'),
            ST('Oh, no. More people. Look, I don’t actually fight it. It just thinks I might.', 'shock'),
            ST('I haven’t fought anything. Not properly. I ran away from Eisen. I’m good at running.', 'sad'),
            N('Your Nubbin looks at Stark, and Stark looks at your Nubbin. Two frightened things recognise each other.'),
            N('It walks over and sits on his boot.'),
            ST('Hello. Are you scared too? You look scared. That’s all right. Everyone here thinks I’m not.', 'soft'),
            FR('The dragon’s waking. It’ll come down tomorrow. We could see to it ourselves.', 'think'),
            ST('No. No, it should be me. They took me in. It should be me. I just need to stop shaking first.'),
          ],
          choices: [
            {
              id: 'chests',
              label: 'Tell Stark your Nubbin is scared of chests.',
              then: [ST('Chests? Like boxes? …Yeah. Fair. Boxes could be anything.', 'think')],
            },
            {
              id: 'eisen',
              label: 'Ask why he left Eisen.',
              then: [
                ST('I thought he was disappointed in me. I left before he could say it.', 'sad'),
                FR('Eisen? He doesn’t get disappointed. He gets worried, and stands very still.'),
              ],
            },
          ],
        },
        done: {
          id: 'a21-12-stark-done',
          lines: [ST('I just need one night. To get the shaking out.')],
        },
      },
      {
        id: 'a21-12-s2',
        goal: 'Sit up through the night with Stark.',
        hint: 'Sit by Stark’s fire until dawn. Your Nubbin will keep his boots warm.',
        check: 'sit:a21-stark:fire',
        scene: {
          id: 'a21-12-night',
          lines: [
            N('Stark sits by his fire all night, and his hands shake all night. He holds them out to the fire as if it were the cold.'),
            ST('Look at them. Some warrior.', 'sad'),
            K('My hands shake when I prune. Every time. Twenty years of gardening, and they still shake.', 'soft'),
            ST('What do you do?'),
            K('Prune. Badly. But I do it.'),
            N('Around midnight Frieren comes out and sits on Stark’s other side, with a grimoire she isn’t reading.'),
            FR('Eisen was scared before every fight. Every single one. His hands shook just like that.', 'think'),
            ST('Eisen? No. He never…', 'shock'),
            FR('He never let you see. He was your teacher. Teachers hide things. I should know.'),
            N('Stark looks at his hands, still shaking. He looks at them as if they belonged to someone braver.'),
          ],
          choices: [
            {
              id: 'tea',
              label: 'Make him a cup of tea.',
              then: [ST('Thanks. I’ll spill it. …I spilled it. Thanks anyway.', 'happy')],
            },
            {
              id: 'quiet',
              label: 'Sit, and say nothing.',
              then: [N('You sit, and your Nubbin sits on Stark’s boot. By dawn there are three of you not saying anything, and it helps.')],
            },
            {
              id: 'believe',
              label: 'Tell him the village believes in him.',
              then: [ST('That’s the problem. That’s the whole problem.', 'sad'), N('But he sits up a little straighter anyway.')],
            },
          ],
        },
        done: {
          id: 'a21-12-night-done',
          lines: [N('At dawn the cliff top roars, and Stark stands up. His hands are still shaking, and he picks up the axe anyway.')],
        },
      },
      {
        id: 'a21-12-s3',
        goal: 'Watch from the village wall as Stark goes up to meet the dragon.',
        hint: 'Climb the wall and keep your Nubbin with you. It may have other ideas.',
        check: 'watch:a21-dragon:cliff',
        scene: {
          id: 'a21-12-dragon',
          lines: [
            N('The dragon comes down off the cliff like a red landslide. The whole village runs for the cellars.'),
            N('Stark walks the other way, up the slope, alone, with the axe on his shoulder and his knees knocking.'),
            FN('Should we help him?', 'think'),
            FR('Not yet. Let him find out.'),
            N('Your Nubbin wriggles out of your arms and runs up the slope after Stark. Halfway, it stops, frightened, and stays there anyway.'),
            N('The dragon swings its head down at him. Stark sets his feet the way Eisen taught him, as a boy in a mountain yard.'),
            N('Then he swings, once, with everything he has.'),
          ],
          choices: [
            {
              id: 'shout',
              label: 'Shout his name.',
              then: [N('You shout it, and so does Keeper Fern. Down in the cellars, so does the whole village.')],
            },
            {
              id: 'eyes',
              label: 'Cover your eyes.',
              then: [N('You cover your eyes. Between your fingers you see the axe go up.')],
            },
          ],
        },
        done: {
          id: 'a21-12-dragon-done',
          lines: [
            N('The dragon goes down in the grass and doesn’t get up. Stark stands over it, panting and astonished.'),
            ST('I did it. I actually… Did I do that?', 'shock'),
          ],
        },
      },
    ],
    complete: {
      id: 'a21-12-complete',
      lines: [
        N('Your Nubbin reaches him first. It climbs up his leg and into his cloak, and stays there, peering out at the collar.'),
        ST('Oh. Hello. You can stay there if you like. It’s warm. I’m warm. I’m very warm, actually. I might be sick.', 'happy'),
        FR('Come with us. North. We could use someone who’s scared properly.'),
        ST('Yeah. All right. Yes. If the little one can come. It seems to have decided.', 'soft'),
        N('From then on your Nubbin travels in Stark’s cloak: two frightened things, keeping each other brave.'),
        K('That’s two of them now who are good at running. Lucky they’re running the same way.', 'happy'),
      ],
    },
    rewards: [],
    sets: { 'a21-12': true },
    notes:
      'FROM HERE your Nubbin rides in Stark’s cloak on every A21 scene (peeking out at the collar) until A21-20. ' +
      'CARE: the dragon falls and doesn’t get up; no wound is drawn, and it never comes apart (it isn’t a demon). ' +
      'The night by the fire is the line’s second “sit with them” scene (the third rule, acted out, never quoted).',
  },

  // ---------------------------------------------------------------- A21-13
  {
    id: 'a21-13',
    code: 'A21-13',
    title: 'The Statues',
    source: src('the statues of the hero’s party, and the city under Aura'),
    audience: 'main',
    trigger: { where: WHERE, when: after('A21-12') },
    requires: ['A21-12'],
    speakers: [STARK, FRIEREN, FERN, HIMMEL, LUGNER, GRANAT],
    steps: [
      {
        id: 'a21-13-s1',
        goal: 'Visit the village with the statues of the old party.',
        hint: 'Walk into the square and look at all four of them.',
        check: 'visit:a21-statues:square',
        scene: {
          id: 'a21-13-statues',
          lines: [
            N('In the next village there are four statues in the square: Himmel, Heiter, Eisen and Frieren, all young and all clean.'),
            ST('That’s you! That’s actually you. You’ve got your hand like that.', 'happy'),
            FR('He made us pose for every one. Every village. Every town that offered.', 'think'),
            FN('Why?'),
            FR('I asked him once. He said…'),
            N('The square goes soft at the edges, as if the page were remembering. A young man in a blue cloak stands on a plinth, posing.'),
            HI('Frieren, come and stand here. No, here. Look heroic. Think of something heroic.', 'happy'),
            FR('Why do you care about statues, Himmel? They’ll only crumble.'),
            HI('Not for ages. Long after me.', 'soft'),
            HI(LIFT_STATUES, 'soft'),
            N('The square comes back. Himmel’s statue looks down at you all with its chin up, as promised.'),
          ],
          choices: [
            {
              id: 'frieren',
              label: 'Look at Frieren.',
              then: [N('She is looking at the statue the way she looked at the meteors on the hill: as if she has only just noticed it.')],
            },
            {
              id: 'statue',
              label: 'Look at Himmel’s statue.',
              then: [N('Someone has tucked a little blue flower behind its ear. It isn’t moon-weed, but it’s trying.')],
            },
            {
              id: 'fern',
              label: 'Look at Keeper Fern.',
              then: [K('He knew. Didn’t he. He knew she’d be on her own.', 'sad')],
            },
          ],
        },
        done: {
          id: 'a21-13-statues-done',
          lines: [FR('He was always thinking ahead. It was very annoying.', 'soft')],
        },
      },
      {
        id: 'a21-13-s2',
        goal: 'Go on to the northern city that lives in Aura’s shadow.',
        hint: 'Walk to the city gate with the party, and stay close when the envoy arrives.',
        check: 'walk:a21-city:gate',
        scene: {
          id: 'a21-13-city',
          lines: [
            N('The northern city is walled and quiet. The people in its streets talk in low voices, and they all keep looking north.'),
            N('In the hall of Graf Granat, the city’s lord, a tall young man with horns is being very polite.'),
            LU('We have come to make peace. Aura the Guillotine wants an end to the fighting. So do we all.', 'happy'),
            GR('My son was killed by demons who wanted peace.', 'angry'),
            LU('Not by us, my lord. Never by us.'),
            FR('He’s lying. Demons don’t have a word for peace. They learn ours, because it works on us.', 'angry'),
            LU('What a rude elf. Is this how your city treats its guests?'),
            N('Frieren raises her staff. The guards seize her before the spell is out.'),
            GR('Enough! We are in talks. Put her in the cells until the envoy has gone.'),
          ],
          choices: [
            {
              id: 'right',
              label: 'Tell the guards she’s right.',
              then: [N('They don’t listen. You get a cold look from Lügner instead, which is worse.')],
            },
            {
              id: 'watch',
              label: 'Say nothing, and watch the envoy.',
              then: [N('Lügner smiles at you, a very good smile. He has practised it on a great many humans.')],
            },
            {
              id: 'stark',
              label: 'Hold Stark back.',
              then: [ST('Let go. Let go, I’m… No. You’re right. Don’t let go.', 'shock')],
            },
          ],
        },
        done: {
          id: 'a21-13-city-done',
          lines: [FR('Fern. Stark. Watch him. When he stops smiling, he’ll strike.', 'think')],
        },
      },
      {
        id: 'a21-13-s3',
        goal: 'Help get Graf Granat to safety when the envoy strikes.',
        hint: 'When the hall goes dark, find Graf Granat and lead him to the back stair.',
        check: 'escort:a21-granat:back-stair',
        scene: {
          id: 'a21-13-strike',
          lines: [
            N('That night Lügner comes back to the lord’s hall. He isn’t smiling any more.'),
            N('Thin red threads lash across the room, and the candles go out. Granat’s guards stumble back.'),
            N('Young Fern is already there, staff up, between the threads and the lord. Stark comes in through the window with the axe, terrified.'),
            ST('I’m here! I’m here. Where’s the bad one? Is it the horns? It’s the horns.', 'shock'),
            FN('Get Lord Granat out. Now.', 'angry'),
            N('You find Granat in the dark by the sound of him swearing at his own furniture.'),
            GR('Who’s that? The book people? Good. Fine. Which way?'),
          ],
          choices: [
            {
              id: 'stair',
              label: 'The back stair.',
              then: [N('You take his arm. Your Nubbin runs ahead, peering round corners and running back to report.')],
            },
            {
              id: 'fern',
              label: 'Keeper Fern knows a way.',
              then: [K('I don’t. I’m going to pretend I do. Follow me confidently.', 'think')],
            },
          ],
        },
        done: {
          id: 'a21-13-strike-done',
          lines: [
            N('Behind you in the hall there are bright flashes, and Stark yelling, and then quiet.'),
            N('Lügner has gone out of the window. Young Fern and Stark stand in the dark, both unhurt, both shaking.'),
          ],
        },
      },
    ],
    complete: {
      id: 'a21-13-complete',
      lines: [
        GR('I was wrong about the elf. Let her out. Let her out at once.', 'sad'),
        N('In the morning they let Frieren out. She has spent the night reading a grimoire she found under the bench.'),
        FR('This cell has a very good library.', 'happy'),
        FN('Frieren. They tried to kill him.'),
        FR('I know. Now Aura will come herself. Good. It’s quicker.', 'think'),
      ],
    },
    rewards: [],
    sets: { 'a21-13': true },
    notes:
      'LIFTED TEXT 2: a21-13-statues#9, Himmel in flashback (see the header). The flashback is the square “going ' +
      'soft at the edges”: a sepia wash, young Himmel (licensed design) on a plinth. CARE: Lügner’s attack is “thin ' +
      'red threads”; never call it blood. Nobody is hurt in the hall; Lügner escapes here and is undone in A21-14. ' +
      'Your Nubbin is in Stark’s cloak except where it runs ahead (the “stair” choice).',
  },

  // ---------------------------------------------------------------- A21-14
  {
    id: 'a21-14',
    code: 'A21-14',
    title: 'The Scales',
    source: src('Aura’s Scales of Obedience'),
    audience: 'main',
    trigger: { where: WHERE, when: after('A21-13') },
    requires: ['A21-13'],
    speakers: [FRIEREN, STARK, FERN, VILLAGER, GRANAT, AURA],
    steps: [
      {
        id: 'a21-14-s1',
        goal: 'Hear Frieren’s plan for Aura’s scales.',
        hint: 'Sit with the party in Granat’s kitchen while she explains.',
        check: 'talk:a21-frieren:plan',
        scene: {
          id: 'a21-14-plan',
          lines: [
            N('Granat’s kitchen at dawn: bread, cheese, and a map of the hills with an army of old armour drawn on it.'),
            FR('Aura has a pair of scales. She weighs her mana against yours, and the stronger takes control of the weaker.', 'think'),
            FR('Whoever loses does whatever the winner says. For ever.'),
            ST('Right. Good. So, don’t lose.', 'shock'),
            FR('Demons show their mana off. It’s pride. They think hiding it is cowardly.'),
            FR('Flamme taught me to hide mine. All of it, every day, for a thousand years. And I taught Fern.'),
            FN('I’ve been hiding mine for years. I thought you were just being odd.', 'think'),
            FR('I was. But for a reason.'),
            K('She hid it for a thousand years. I can’t hide that I’ve had a biscuit.', 'think'),
          ],
          choices: [
            {
              id: 'how-much',
              label: 'Ask how much mana she really has.',
              then: [FR('More than Aura. I think. I’ve never actually checked.', 'think'), ST('You’ve never checked?', 'shock')],
            },
            {
              id: 'job',
              label: 'Ask what you can do.',
              then: [FR('Get Granat’s people indoors. And keep your Nubbin out of Stark’s way. He swings wide.')],
            },
          ],
        },
        done: {
          id: 'a21-14-plan-done',
          lines: [
            FR('Fern takes Lügner. Stark takes the other one, Linie. I’ll take Aura.'),
            ST('Why do I get the one I don’t know anything about?'),
            FR('You don’t know anything about any of them.'),
          ],
        },
      },
      {
        id: 'a21-14-s2',
        goal: 'Get Granat’s people indoors while Fern and Stark fight.',
        hint: 'Go from door to door along the main street and see everyone safe inside.',
        check: 'escort:a21-townsfolk:indoors',
        scene: {
          id: 'a21-14-street',
          lines: [
            N('On the walls, Lügner faces young Fern. In the square, a demon girl with a pigtail faces Stark.'),
            N('You go door to door, getting people in: a baker, two old men with a chessboard, a small boy with a wooden sword.'),
            VI('I want to watch!'),
            K('So do I. From inside. Under a table. That’s where all the best watching is.', 'happy'),
            N('Through the shutters you see young Fern stand quite still while Lügner throws everything he has. She blocks all of it.'),
            N('Then she lets her mana show, just a little, and Lügner’s smile slides off his face.'),
            N('He looked at her and measured her and got it wrong. Everyone always does.'),
            N('In the square Stark is knocked down, and gets up, and is knocked down, and gets up. Your Nubbin holds on inside his cloak.'),
          ],
          choices: [
            {
              id: 'fern',
              label: 'Watch young Fern.',
              then: [N('The light from her staff is very thin and very straight. Lügner comes apart into motes, astonished to the end.')],
            },
            {
              id: 'stark',
              label: 'Watch Stark.',
              then: [N('Stark gets up one last time, and swings. The demon girl comes apart into motes halfway through a laugh.')],
            },
          ],
        },
        done: {
          id: 'a21-14-street-done',
          lines: [
            N('Both of them are done. Lügner and Linie drift off over the rooftops as grey motes.'),
            ST('Is it over? Is it? I can’t feel my arm. Is my arm on?', 'shock'),
            FN('Your arm is on. Sit down, Stark.'),
          ],
        },
      },
      {
        id: 'a21-14-s3',
        goal: 'Watch from the ridge as Frieren meets Aura.',
        hint: 'Climb to the ridge above the field and stay behind the rocks.',
        check: 'watch:a21-aura:field',
        scene: {
          id: 'a21-14-aura',
          lines: [
            N('In the field outside the walls, rows of old armour stand empty and walking. In front of them stands Aura, with her scales.'),
            AU('Frieren. I heard you’d come north. I am going to weigh you, and then you will kneel.', 'happy'),
            FR('All right.'),
            N('Aura sets her mana on the scales. It pours off her like heat off a road, and her pan sinks deep.'),
            AU('Five hundred years of mana. Kneel now, and I won’t make you fight your old friends’ armour.'),
            N('Frieren sets her mana on the other pan.'),
            N('For a moment nothing happens. Then the scales tip, slowly, and keep tipping, and don’t stop.'),
            AU('That’s… no. No. You were hiding it. That isn’t fair. That isn’t…', 'shock'),
            FR('You weighed what you could see. You never asked about what you couldn’t.', 'think'),
            N('The scales go all the way down. Aura’s own spell turns round on her, the way a key turns in a lock.'),
          ],
          choices: [
            {
              id: 'away',
              label: 'Look away.',
              then: [N('You look away at the hills, and Keeper Fern looks away with you. Some things don’t need watching.')],
            },
            {
              id: 'hold',
              label: 'Hold Keeper Fern’s hand.',
              then: [N('She grips it, and you both keep your eyes on the grass. You don’t see the end, and you don’t need to.')],
            },
          ],
        },
        done: {
          id: 'a21-14-aura-done',
          lines: [
            N('When you look back the field is empty. The old armour lies in neat heaps in the grass, at rest, and Aura is gone.'),
            N('A few grey motes go up past the ridge and away.'),
          ],
        },
      },
    ],
    complete: {
      id: 'a21-14-complete',
      lines: [
        GR('The city owes you. I owe you. My son… would have liked to see that.', 'sad'),
        FR('We’d like a meal. And a pass north.'),
        GR('You’ll have both. And a statue, if you want one.'),
        FR('No. Well. Perhaps a small one.', 'think'),
        K('Himmel would be thrilled.', 'happy'),
      ],
    },
    rewards: [],
    sets: { 'a21-14': true },
    notes:
      'CARE: Aura’s end is offscreen. The camera turns away with you on a21-14-aura#9 (both choices keep it turned ' +
      'away); a21-14-aura-done shows only the empty field and motes. Aura never speaks a command to herself on ' +
      'screen. Her army is “old armour that walks”: empty suits, no bodies, no heads, never “the dead”. Lügner and ' +
      'Linie come apart into motes. Linie has no lines (she is “a demon girl with a pigtail”). Stark is knocked ' +
      'down, never wounded.',
  },

  // ---------------------------------------------------------------- A21-15
  {
    id: 'a21-15',
    code: 'A21-15',
    title: 'Kraft',
    source: src('the winter with Kraft'),
    audience: 'main',
    trigger: { where: WHERE, when: after('A21-14') },
    requires: ['A21-14'],
    speakers: [STARK, FERN, FRIEREN, KRAFT],
    steps: [
      {
        id: 'a21-15-s1',
        goal: 'Get Stark out of the blizzard and into shelter.',
        hint: 'Take one of Stark’s arms and carry him through the snow towards the light.',
        check: 'carry:a21-stark:hut',
        scene: {
          id: 'a21-15-snow',
          lines: [
            N('North of the city the snow comes sideways, for days. On the third day Stark stops making jokes, which is how you know.'),
            ST('I’m fine. I’m great. I can’t feel my face. Is it there?', 'sad'),
            FN('He’s chilled right through. Frieren, he needs a fire. Now.', 'angry'),
            FR('There’s a light. Over there. Someone’s home.'),
            N('You take one of Stark’s arms, and young Fern takes the other. Keeper Fern carries the axe, badly, upside down.'),
            K('How is this so heavy? Why is it this heavy? He swings this?', 'shock'),
            N('Your Nubbin rides inside Stark’s cloak and presses against his chest, as if it could warm the whole of him from there.'),
          ],
          choices: [
            {
              id: 'scarf',
              label: 'Wrap your scarf round Stark.',
              then: [ST('Thanks. It smells of jam. That’s… good. Somehow.', 'soft')],
            },
            {
              id: 'talk',
              label: 'Keep him talking.',
              then: [ST('Talking. Right. Uh. Favourite food: hamburg steak. Eisen made it on my birthday. That’s all I’ve got.')],
            },
          ],
        },
        done: {
          id: 'a21-15-snow-done',
          lines: [
            N('The hut door opens before you knock. A tall elf in a monk’s robe stands in the light, with a pot of soup already on.'),
            KR('Come in. I saw you three days ago. I’ve been keeping it warm.', 'happy'),
          ],
        },
      },
      {
        id: 'a21-15-s2',
        goal: 'Wait out the winter in the hut with Kraft.',
        hint: 'Help with the firewood and sit by the fire in the evenings. The six months pass on their own.',
        check: 'wait:a21-kraft:winter',
        scene: {
          id: 'a21-15-hut',
          lines: [
            N('The blizzard lasts six months. The hut is small, Kraft is good company, and there is a great deal of soup.'),
            N('Stark thaws in a week. After that he chops firewood every morning, to have something to be brave about.'),
            KR('I am older than her. Older than anyone you’ve met. I was walking this world before the Demon King.', 'think'),
            FR('I never heard of you.'),
            KR('No. Nobody has. Everyone who saw what I did is gone. Every friend I had. There’s no one left who remembers.', 'soft'),
            KR('So I believe in the Goddess. Someone ought to remember. She will. It saves me minding so much.'),
            N('Keeper Fern sits close to the fire with her hands round a cup. She looks at Kraft for a long time.'),
            K('Can I ask you something? How many friends have you outlived?', 'think'),
            KR('I stopped counting. Not because there were too many. Because counting made them a number.', 'soft'),
            KR('I remember their hands. How each of them held a cup. That’s what I keep.'),
          ],
          choices: [
            {
              id: 'advice',
              label: 'Ask Kraft what he’d tell someone young.',
              then: [KR('Ask them things while they’re here. Not big things. Little things. The little things are the ones you lose.')],
            },
            {
              id: 'frieren',
              label: 'Look at Frieren.',
              then: [N('Frieren is looking into the fire. She has gone very still, the way she did in the churchyard.')],
            },
          ],
        },
        done: {
          id: 'a21-15-hut-done',
          lines: [
            K('I lost a Nubbin, once. Bramble. I still see her ear in every hedge. Is it like that? For ever?', 'sad'),
            KR('It gets quieter. It doesn’t go. You learn to be glad it doesn’t go.'),
            K('…Yes. I think I might be, already.', 'soft'),
          ],
        },
      },
    ],
    complete: {
      id: 'a21-15-complete',
      lines: [
        N('In the spring the snow stops all at once, as if someone had shut a window.'),
        KR('Before you go, Frieren, let me praise you. For what you did. Someone ought to, out loud.', 'happy'),
        FR('No, thank you. Heiter said he’d do it. When I see him again.', 'soft'),
        KR('After? You believe that?'),
        FR('No. But he did. I’d hate him to have nothing to do.', 'think'),
        KR('Ha. Fair. Go on, then. Remember the soup.'),
      ],
    },
    rewards: [],
    sets: { 'a21-15': true },
    notes:
      'KEEPER FERN BUILDS ON THE GHOST (s8Reunited, read-only). The done scene shown (a21-15-hut-done) is for Fern ' +
      'not having found Bramble. If s8Reunited is true, play A21_VARIANTS a21-15-hut-done-hazel instead. Kraft’s ' +
      'faith in the Goddess is the story’s own religion; treat it plainly and kindly. The six months pass as the ' +
      'scene plays (the snow outside the window changing); no timer. Kraft’s “little things” line sets up Keeper ' +
      'Fern’s last line in A21-20.',
  },

  // ---------------------------------------------------------------- A21-16
  {
    id: 'a21-16',
    code: 'A21-16',
    title: 'Birthdays',
    source: src('the sword in the stone, and two birthdays'),
    audience: 'main',
    trigger: { where: WHERE, when: after('A21-15') },
    requires: ['A21-15'],
    speakers: [VILLAGER, FRIEREN, STARK, FERN],
    steps: [
      {
        id: 'a21-16-s1',
        goal: 'Visit the village of the sword in the stone.',
        hint: 'Follow the path up to the shrine above the village.',
        check: 'visit:a21-sword:shrine',
        scene: {
          id: 'a21-16-sword',
          lines: [
            N('High in the hills there is a village with a sword in a stone, and a little shrine round it with a box for coins.'),
            VI('The hero pulled it out, you know. Then put it back, for the next one. That’s what the songs say.', 'happy'),
            FR('He didn’t. He tried for a whole morning. It didn’t move.', 'happy'),
            ST('Wait. Himmel didn’t pull it out?', 'shock'),
            FR('He said a sword doesn’t make a hero. Then he bought a cheap one in the market and went to fight the Demon King with it.'),
            FR('It broke twice. He mended it with string.'),
            ST('That’s brilliant. That’s so much better than the song.', 'happy'),
            N('Your Nubbin tries to pull the sword out, and then to push it further in. Neither works.'),
          ],
          choices: [
            {
              id: 'pull',
              label: 'Have a go yourself.',
              then: [N('You pull, and Keeper Fern pulls and sits down hard. Stark pulls, the whole shrine creaks, and he lets go fast.')],
            },
            {
              id: 'coin',
              label: 'Put a coin in the box.',
              then: [FR('For the shrine. It’s a nice lie. He’d have liked it.', 'soft')],
            },
          ],
        },
        done: {
          id: 'a21-16-sword-done',
          lines: [FN('Stark. Isn’t it your birthday today?', 'think'), ST('…How do you know that?'), FN('You told the innkeeper three times.')],
        },
      },
      {
        id: 'a21-16-s2',
        goal: 'Help Frieren cook Eisen’s hamburg steak for Stark’s birthday.',
        hint: 'Bring meat, onions and bread from the market to the inn kitchen, then help at the stove.',
        check: 'craft:a21-hamburg:inn-kitchen',
        scene: {
          id: 'a21-16-steak',
          lines: [
            N('That night Frieren takes over the inn kitchen with her sleeves rolled up.'),
            FR('Eisen made this every year on his student’s birthday. A huge hamburg steak. He told me how, at the cabin.', 'think'),
            FR('In case you turned up, he said.'),
            ST('He… what? He told you? He remembered?', 'shock'),
            N('Stark goes very red and very quiet. Your Nubbin climbs out of his cloak and onto his head, to make it better.'),
            K('Onions. I can chop onions. Onions don’t die if you’re bad with them.', 'happy'),
            N('The steak, when it comes, is the size of a plate. Frieren sets it down in front of Stark without a word.'),
          ],
          choices: [
            {
              id: 'sing',
              label: 'Sing him something.',
              then: [N('You sing the valley’s birthday song, and Keeper Fern joins in a beat behind. Stark hides his face in his hands.')],
            },
            {
              id: 'peace',
              label: 'Let him eat in peace.',
              then: [N('Stark eats all of it, slowly, like a man reading a letter from home.')],
            },
          ],
        },
        done: {
          id: 'a21-16-steak-done',
          lines: [ST('It tastes just like his. Exactly like. I didn’t think I’d ever…', 'sad'), FR('That was the idea.', 'soft')],
        },
      },
      {
        id: 'a21-16-s3',
        goal: 'Help Stark make it up to young Fern on her birthday.',
        hint: 'Go with Stark to the jeweller’s stall in the market and help him choose.',
        check: 'choose:a21-bracelet:stall',
        scene: {
          id: 'a21-16-bracelet',
          lines: [
            N('Two weeks later it is young Fern’s birthday, and Stark has forgotten. Young Fern has not forgotten that he’s forgotten.'),
            FN('It doesn’t matter. It’s nothing. It’s only a day.', 'angry'),
            ST('She says it doesn’t matter. That means it matters, right? It matters a lot?', 'shock'),
            K('Enormously. I say “it doesn’t matter” about once a week. It always does.'),
            N('In the market there is a jeweller’s stall. Stark stands in front of it like a man in front of a dragon.'),
            ST('What do I get? I don’t know what she likes. She likes being right. Do they sell that?'),
            N('On the stall there is a little silver bracelet with a mirror-lotus on it, a flower for a love that lasts.'),
            N('Stark doesn’t know what the mirror-lotus means. Keeper Fern does, and decides not to tell him.'),
          ],
          choices: [
            {
              id: 'point',
              label: 'Point at the mirror-lotus bracelet.',
              then: [ST('That one. Yeah. It looks like her. Calm, and then suddenly not.', 'happy')],
            },
            {
              id: 'himself',
              label: 'Tell him to choose it himself.',
              then: [N('Stark dithers for an hour. In the end he buys the mirror-lotus bracelet, because it was the first one he saw.')],
            },
          ],
        },
        done: {
          id: 'a21-16-bracelet-done',
          lines: [
            N('Young Fern opens the box and looks at the bracelet for a long time. Then she puts it on, and turns away so nobody sees her face.'),
            FN('…It’s acceptable.', 'soft'),
            ST('Acceptable! I’ll take acceptable!', 'happy'),
          ],
        },
      },
    ],
    complete: {
      id: 'a21-16-complete',
      lines: [
        ...A16_RING_START,
        FR('You looked with me before. For the flowers. You’re good at looking. Help me.', 'soft'),
        ...A16_RING_END,
      ],
    },
    rewards: [
      {
        id: 'a21-fern-coat',
        kind: 'cosmetic',
        label: 'Fern’s Purple Coat',
        description:
          'Young Fern’s old travelling coat, let out at the seams, for Keeper Fern. She wears it in the Grove when she feels like it: her choice, not yours.',
      },
    ],
    sets: { 'a21-16': true },
    notes:
      'SIGNATURE CHOICE ECHO (a21-search). The complete scene shown is for “with” (Frieren remembers you searching ' +
      'with her). For “ahead” play A21_VARIANTS a21-16-complete-ahead. COAT: the reward is a cosmetic for Keeper ' +
      'Fern only. SIM: she is drawn in it on some days and not others (seeded per in-game day, never a daily ' +
      'chore or reward); the player can’t put it on her. The ring is Himmel’s gift (licensed design). The ' +
      'mirror-lotus meaning is said once, in narration. “The valley’s birthday song” is hummed, never given as ' +
      'lyrics.',
  },

  // ---------------------------------------------------------------- A21-17
  {
    id: 'a21-17',
    code: 'A21-17',
    title: 'The Stille',
    source: src('the First-Class Mage Exam, first test: the Stille'),
    audience: 'main',
    trigger: { where: WHERE, when: after('A21-16') },
    requires: ['A21-16'],
    speakers: [PROCTOR, LAWINE, KANNE, UBEL, FERN, FRIEREN, STARK, DENKEN],
    steps: [
      {
        id: 'a21-17-s1',
        goal: 'Sign on with the Mages’ Association to carry cages for the exam.',
        hint: 'Find the porters’ table in the Association hall at Äußerst and pick up your cages.',
        check: 'collect:a21-cages:aussert',
        scene: {
          id: 'a21-17-hall',
          lines: [
            N('Äußerst is a city of tall grey towers, all full of mages. Every few years they hold the First-Class Mage Exam.'),
            N('The Association is short of porters. Someone hands you a stack of bird cages and a badge before you can say no.'),
            K('We’re porters. We’re porting. I’ve never ported anything in my life.', 'happy'),
            PR('First test. Teams of three. Bring me a Stille, alive, in one of these cages, by sundown on the third day.'),
            PR('A Stille is a bird that flies faster than sound. Nobody catches one on purpose. Good luck.'),
            N('Frieren is put with two girls who argue: Lawine, who is all sharp ice, and Kanne, who does tricks with water.'),
            LA('We get the old elf? She looks about twelve.', 'angry'),
            KA('She looks about twelve and she’s already reading. That’s worse.'),
            N('Young Fern is put with a quiet young man called Land, and with Übel, who smiles at everything slightly too much.'),
            UB('Oh, I like you. You don’t say anything unless you mean it. That’s so rare.', 'happy'),
            FN('…Thank you.', 'think'),
          ],
          choices: [
            {
              id: 'frieren',
              label: 'Carry for Frieren’s team.',
              then: [FR('Good. Bring the big cage. Stilles look small, but they sulk.')],
            },
            {
              id: 'fern',
              label: 'Carry for young Fern’s team.',
              then: [FN('Thank you. Please stand behind me. Übel is… please just stand behind me.')],
            },
          ],
        },
        done: {
          id: 'a21-17-hall-done',
          lines: [
            N('Stark has to wait in the city: he isn’t a mage. Your Nubbin climbs out of his cloak and into one of your cages, to help.'),
            ST('Bring it back! I mean, bring yourself back. Both. Bring both.', 'shock'),
          ],
        },
      },
      {
        id: 'a21-17-s2',
        goal: 'Keep the cage ready by Frieren’s trap at the lake.',
        hint: 'Crouch by the last open pool with the cage door open, and keep still.',
        check: 'wait:a21-stille:pool',
        scene: {
          id: 'a21-17-lake',
          lines: [
            N('The test ground is a forest round a wide lake. Stilles flash across it like skimmed stones, too fast to follow.'),
            FR('They’re fast. But they’re thirsty. Every bird has to drink.', 'think'),
            N('She lays a hand on the water. Frost runs out from her fingers across the whole lake until it is all ice, but for one small pool.'),
            LA('…Oh. That’s quite clever.', 'shock'),
            KA('Don’t tell her. She’ll get smug.'),
            N('You crouch by the pool with the cage, very still. Your Nubbin sits in the cage, also very still, being bait without being asked.'),
            N('Then a Stille lands on the ice, small and grey and blinking, and dips its beak to drink.'),
          ],
          choices: [
            {
              id: 'close',
              label: 'Close the cage door gently.',
              then: [N('You close it. The Stille and your Nubbin look at each other, and neither of them knows what happens next.')],
            },
            {
              id: 'kanne',
              label: 'Let Kanne do it.',
              then: [N('Kanne lifts a loop of water out of the pool and drops it round the bird like a lasso. It sits in the cage, wet and offended.')],
            },
          ],
        },
        done: {
          id: 'a21-17-lake-done',
          lines: [
            N('Then the trees on the far shore part. An old mage in a long coat walks out, with two others behind him.'),
            DE('That bird will do for my team. I’ll take it, if you don’t mind. I’ll take it if you do.', 'think'),
          ],
        },
      },
      {
        id: 'a21-17-s3',
        goal: 'Keep the Stille safe while Frieren deals with Denken.',
        hint: 'Hold the cage behind the rocks on the shore, and don’t let go of it.',
        check: 'carry:a21-stille:shore',
        scene: {
          id: 'a21-17-denken',
          lines: [
            N('Denken is old and stubborn and very good. His spells come out of the trees one after another, from every side.'),
            DE('I grew up with nothing. I’m not going home with nothing. Not at my age.', 'angry'),
            FR('That’s a good reason. It isn’t enough of one.', 'think'),
            N('Frieren steps aside from every spell, unhurried, as if they were people on a busy pavement.'),
            N('Lawine and Kanne take the other two, shouting at each other the whole time. It seems to help.'),
            N('You crouch behind a rock with the cage while the Stille sulks. Your Nubbin sits on top of the cage, guarding it.'),
            N('Then Frieren casts once, plainly, and Denken’s shield breaks like a plate. He sits down hard on the ice.'),
            DE('…Well. I’ve been beaten by worse. Not recently.', 'think'),
          ],
          choices: [
            {
              id: 'hand',
              label: 'Offer Denken a hand up.',
              then: [DE('Thank you. My knees thank you. My pride will write to you later.')],
            },
            {
              id: 'cage',
              label: 'Keep hold of the cage.',
              then: [N('You keep hold of it. The Stille, sensing it is now the most important bird in the world, preens.')],
            },
          ],
        },
        done: {
          id: 'a21-17-denken-done',
          lines: [FR('Sundown. Let’s take it in.')],
        },
      },
    ],
    complete: {
      id: 'a21-17-complete',
      lines: [
        PR('Frieren’s team: pass. Fern’s team: pass. Denken’s team…', 'think'),
        N('Denken’s team passes too. In the last hour they caught a Stille of their own, because Denken would not go home with nothing.'),
        FN('Ours was easy. Land is very patient. Übel wanted to cut down a tree.'),
        N('Your Nubbin climbs straight back into Stark’s cloak, as if it had never been away.'),
        K('I ported! I ported a bird! Put that on a plaque somewhere. A small one.', 'happy'),
      ],
    },
    rewards: [],
    sets: { 'a21-17': true },
    notes:
      'THE EXAM (A21-17 to A21-19): you are a porter for the Mages’ Association, carrying the bird cages, which is ' +
      'how you get to watch. You never cast or fight. CARE: Denken is beaten without a wound (sits down hard on the ' +
      'ice). Fern’s team’s catch happens offscreen; Land and Übel have no fight shown. The Stille is a small grey ' +
      'bird drawn as a blur in flight; it never comes to harm. Frieren’s frozen lake is a frost spreading over the ' +
      'whole water but one pool.',
  },

  // ---------------------------------------------------------------- A21-18
  {
    id: 'a21-18',
    code: 'A21-18',
    title: 'The Replicas',
    source: src('the First-Class Mage Exam, second test: the dungeon and Spiegel'),
    audience: 'main',
    trigger: { where: WHERE, when: after('A21-17') },
    requires: ['A21-17'],
    speakers: [PROCTOR, FRIEREN, FERN, LAWINE, SMITH, DENKEN, UBEL],
    steps: [
      {
        id: 'a21-18-s1',
        goal: 'Carry the cages and lamps down into the dungeon behind the examinees.',
        hint: 'Follow the party down the stair. Mind the chests.',
        check: 'explore:a21-dungeon:stair',
        scene: {
          id: 'a21-18-dungeon',
          lines: [
            PR('Second test. The old dungeon under the hill. Reach the bottom by dawn.'),
            PR('You each get a bottle. Break it, and a spirit carries you out, safe. You’ll fail. But you’ll be alive to sulk about it.'),
            N('The porters go down behind the examinees, with lamps, cages, and spare bottles packed in straw.'),
            K('A dungeon. Underground. In the dark. Good. Great. I love that. I don’t.', 'shock'),
            N('Halfway down, on a landing, there is a wooden chest. Your Nubbin stops dead and puffs up to twice its size.'),
            FR('A chest. In a dungeon. How exciting.', 'happy'),
            FN('Frieren. No.'),
            FR('My spell says it’s a mimic. My spell is right ninety-nine times in a hundred.'),
            FN('Frieren.'),
          ],
          choices: [
            {
              id: 'between',
              label: 'Stand between Frieren and the chest.',
              then: [
                FR('Move, please. It might be a grimoire.'),
                N('It isn’t: it is a mimic. Your Nubbin knew, as it always knew.'),
              ],
            },
            {
              id: 'let',
              label: 'Let her open it.',
              then: [N('She opens it, and it eats her, head first, to the knees. Young Fern sighs and takes her by the boots.')],
            },
            {
              id: 'nubbin',
              label: 'Let your Nubbin warn her.',
              then: [N('Your Nubbin hisses at the chest so hard it falls over. Frieren opens it anyway, and it eats her anyway.')],
            },
          ],
        },
        done: {
          id: 'a21-18-dungeon-done',
          lines: [
            FR('Ninety-nine in a hundred. I keep hoping.', 'sad'),
            N('Your Nubbin bites the mimic on the way past, very hard, for all the times.'),
          ],
        },
      },
      {
        id: 'a21-18-s2',
        goal: 'Keep the lamp lit at the bottom when the copies come.',
        hint: 'Hold the lamp by the last door, and stay behind young Fern.',
        check: 'watch:a21-spiegel:depths',
        scene: {
          id: 'a21-18-spiegel',
          lines: [
            N('At the bottom of the dungeon something waits like a pool of quicksilver. It is called Spiegel, and it makes copies.'),
            N('It looks at everyone who comes down, and remembers them. Then it makes them again out of mirror, and sends the copies to fight.'),
            N('The copies are perfect, with every spell and every trick. One of them is a copy of Frieren.'),
            LA('We can’t beat that. Nobody can beat that. That’s her.', 'shock'),
            FN('It isn’t her. It only knows what she shows people.', 'think'),
            FN('When Frieren casts, she can’t sense mana. Only for a moment, only while the spell is going. She’s always been like that.'),
            FR('That’s true. I’d forgotten I told you.', 'think'),
            FN('You never told me. I noticed.'),
            N('Your Nubbin hides behind your boots. Every examinee who breaks a bottle goes up past you in a swirl of light, safe and furious.'),
          ],
          choices: [
            {
              id: 'lamp',
              label: 'Hold the lamp steady.',
              then: [N('You hold it steady. Young Fern needs to see the copy’s hands, and you make sure she can.')],
            },
            {
              id: 'bottles',
              label: 'Keep the spare bottles coming.',
              then: [N('You pass spare bottles down the line. Three people use them, and three people go home cross, and whole.')],
            },
          ],
        },
        done: {
          id: 'a21-18-spiegel-done',
          lines: [
            N('The copy of Frieren casts. In that half-breath, young Fern’s spell goes through the gap, very thin and very straight.'),
            N('The copy shatters like a dropped mirror. Young Fern’s staff cracks across in her hands.'),
            FN('…Oh. Oh, no. Lord Heiter’s staff.', 'sad'),
          ],
        },
      },
      {
        id: 'a21-18-s3',
        goal: 'Take the broken staff to the smith, quietly.',
        hint: 'Take the pieces and the purse from Frieren to the night smith on the bridge, before morning.',
        check: 'deliver:a21-staff:smith',
        scene: {
          id: 'a21-18-staff',
          lines: [
            N('Up in the city that night, young Fern sleeps with the two pieces of her staff beside the pillow.'),
            N('Frieren comes to your door with the pieces in her hands. She must have taken them very gently.'),
            FR('There’s a smith on the bridge who works at night. Take it to him. Here’s the money. Don’t tell her it was me.', 'think'),
            K('Why not? You’re allowed to be kind. People are kind to people all the time.'),
            FR('If she knows, she’ll thank me. She’ll be polite about it for a week. I couldn’t bear it.', 'soft'),
            N('The smith on the bridge turns the pieces over, looks at the silver clasp, and whistles.'),
            SM('Good old work. A priest’s, by the marks. I’ll have it whole by dawn. You’ll never see the join.'),
          ],
          choices: [
            {
              id: 'clasp',
              label: 'Ask him to leave Heiter’s clasp just as it is.',
              then: [SM('Wouldn’t dream of touching it. That’s the bit that matters.')],
            },
            {
              id: 'tell',
              label: 'Tell young Fern in the morning who paid.',
              then: [N('You tell her, and young Fern goes very quiet, then very polite, for a week. Frieren pretends not to notice.')],
            },
            {
              id: 'secret',
              label: 'Keep Frieren’s secret.',
              then: [N('You keep it. Young Fern finds the staff mended by her bed and thanks the Association, and Frieren lets her.')],
            },
          ],
        },
        done: {
          id: 'a21-18-staff-done',
          lines: [N('By dawn the staff is whole again, pale and straight, with Heiter’s clasp shining at the head.')],
        },
      },
    ],
    complete: {
      id: 'a21-18-complete',
      lines: [
        PR('Second test. Pass: everyone who reached the bottom by dawn. Which is, against all reason, quite a few of you.', 'think'),
        N('Frieren passes, and so does young Fern. Denken passes limping, and Übel passes smiling.'),
        UB('Your Nubbin bit a mimic. I saw. I liked that very much.', 'happy'),
        N('On your way out, the Association gives you a little wooden chest for your trouble. It looks perfectly ordinary.'),
        K('Don’t open it. Don’t. You’re going to open it, aren’t you.'),
        N('Your Nubbin glares at the chest all the way back to the inn, and refuses to sit anywhere near it.'),
      ],
    },
    rewards: [
      {
        id: 'a21-mimic-chest',
        kind: 'decor',
        label: 'Mimic Chest',
        description:
          'A little wooden chest for the Grove. The first time anyone opens it, it nips the nearest Nubbin, once, gently. After that it’s just a chest.',
      },
    ],
    sets: { 'a21-18': true },
    notes:
      'CARE: the bottles are the exam’s safety rule: break one and a spirit carries you out unhurt (a swirl of light ' +
      'up the stair). Nobody is hurt by the copies; examinees are “struck down” only by breaking their bottles. ' +
      'Spiegel is a pool of quicksilver; the copies are mirror-bright versions of the licensed designs. The staff ' +
      'is Heiter’s gift from A21-5; the smith is our own. The tell/secret choice sets no flag. MIMIC CHEST (SIM): ' +
      'one-time decor; the first open plays a small nip animation on the nearest Nubbin (no stat change, no harm), ' +
      'then it behaves as an ordinary chest for ever.',
  },

  // ---------------------------------------------------------------- A21-19
  {
    id: 'a21-19',
    code: 'A21-19',
    title: 'Serie',
    source: src('the First-Class Mage Exam, third test: Serie’s interview'),
    audience: 'main',
    trigger: { where: WHERE, when: after('A21-18') },
    requires: ['A21-18'],
    speakers: [STARK, DENKEN, PROCTOR, SERIE, FRIEREN, FERN],
    steps: [
      {
        id: 'a21-19-s1',
        goal: 'Wait outside the interview hall with Stark and Keeper Fern.',
        hint: 'Sit on the bench outside the doors. It takes as long as it takes.',
        check: 'wait:a21-interview:bench',
        scene: {
          id: 'a21-19-bench',
          lines: [
            N('The third test is an interview: one examiner, alone, in a hall at the top of the tallest tower.'),
            ST('That’s not a test. That’s a chat. How do you fail a chat?', 'think'),
            K('I failed a chat once. With a man, about a cow. I still don’t know how.'),
            N('The examiner is Serie, the great mage who founded the Association. She is older than anyone has dared to count.'),
            N('The examinees go in one by one. Most come out looking as if they’ve been weighed and found wrong.'),
            DE('She looked at me. Just looked. Then she said “pass”. I’ve never been so frightened of a word.', 'shock'),
            N('Your Nubbin is back in Stark’s cloak, where it lives now. Stark holds it like a hot-water bottle.'),
          ],
          choices: [
            {
              id: 'mage',
              label: 'Ask Stark if he wishes he were a mage.',
              then: [ST('No. No. They have to talk to her. I’d rather fight the dragon again. Twice.')],
            },
            {
              id: 'keyhole',
              label: 'Peek through the keyhole.',
              then: [N('You peek. You see a small pale elf on a plain chair, looking at nothing, and a room that feels as if it’s looking back.')],
            },
          ],
        },
        done: {
          id: 'a21-19-bench-done',
          lines: [PR('Frieren. Then Fern. The porters may stand at the back. Serie likes a witness.')],
        },
      },
      {
        id: 'a21-19-s2',
        goal: 'Stand at the back of the hall while Serie sees Frieren and Fern.',
        hint: 'Carry the cages in, set them by the wall, and stand very still.',
        check: 'place:a21-cages:hall',
        scene: {
          id: 'a21-19-serie',
          lines: [
            N('The hall is huge and nearly empty. Serie sits at the far end on a plain chair, small and old and as frightening as a mountain.'),
            SE('Frieren. Flamme’s pupil. You hide your mana, the way she taught you. You think I can’t see it.', 'think'),
            FR('I know you can see it.'),
            SE('You could be the greatest mage alive. You don’t care for fighting. You never did.'),
            FR('No.'),
            SE('Then you fail. And you are banned from every Association building for a thousand years. Flamme would laugh.', 'happy'),
            FR('She would. Thank you. May I have my grimoires back?'),
            N('Frieren walks out, not looking upset at all. She looks like somebody let out of school early.'),
            N('Then young Fern walks in with her mended staff, and bows, the way she bowed on a doorstep in Strahl.'),
            SE('You. I can see all of you. Be my apprentice. You’ll be greater than her in fifty years.', 'think'),
            FN('No, thank you. I’m Frieren’s apprentice.'),
            SE('She failed.'),
            FN('Yes. She does that. I’m still hers.'),
            N('Serie looks at her for a long moment. Then, very slightly, she smiles.'),
          ],
          choices: [
            {
              id: 'breath',
              label: 'Hold your breath.',
              then: [N('You hold it. Keeper Fern grips your arm and holds hers too, on your behalf.')],
            },
            {
              id: 'eye',
              label: 'Catch young Fern’s eye.',
              then: [N('She sees you at the back. She doesn’t smile, but her chin goes up, like a statue in a square.')],
            },
          ],
        },
        done: {
          id: 'a21-19-serie-done',
          lines: [SE('Pass.', 'happy')],
        },
      },
    ],
    complete: {
      id: 'a21-19-complete',
      lines: [
        PR('This year’s first-class mages: Fern. Denken. Wirbel. Land. Übel. Methode.'),
        N('Young Fern walks out with a new badge and her old staff, and hands the badge straight to Frieren to hold.'),
        FN('I didn’t want it from her. I wanted it with you there.', 'soft'),
        FR('I was banned from the building.'),
        FN('You were outside the door. I could feel you. You weren’t hiding your mana very well.', 'happy'),
        ST('Did you pass? You passed! She passed! Little one, she passed!', 'happy'),
        K('Banned for a thousand years. That’s the most impressive thing I’ve ever seen anybody fail.', 'happy'),
      ],
    },
    rewards: [],
    sets: { 'a21-19': true },
    notes:
      'Serie is drawn small and very still (licensed design); the hall is huge. Wirbel and Methode are named in the ' +
      'pass list only and have no speaking role. Frieren’s ban is played for comedy; she is pleased. Young Fern’s ' +
      'bow at a21-19-serie#8 should reuse the bow animation from A21-3.',
  },

  // ---------------------------------------------------------------- A21-20
  {
    id: 'a21-20',
    code: 'A21-20',
    title: 'The Flower Field',
    source: src('the departure from Äußerst (the flower field farewell is our own scene)'),
    audience: 'main',
    trigger: { where: WHERE, when: after('A21-19') },
    requires: ['A21-19'],
    speakers: [FERN, STARK, FRIEREN],
    steps: [
      {
        id: 'a21-20-s1',
        goal: 'Walk to the city gate with the party for the goodbye.',
        hint: 'Walk with Frieren, Fern and Stark to the north gate of Äußerst.',
        check: 'walk:a21-gate:north',
        scene: {
          id: 'a21-20-gate',
          lines: [
            N('The morning after, the party packs to go north, to Aureole. You and Keeper Fern have come as far as the page goes.'),
            N('At the north gate young Fern stops, and holds her staff very straight, and doesn’t cry.'),
            FN('Lord Himmel hated tearful goodbyes. Frieren told me. He wanted the kind you can laugh about later.', 'soft'),
            FN('So I won’t. I want to laugh about this later.'),
            K('I’m going to. Cry, I mean. Sorry. I always do. I cried at a pear tree once.', 'sad'),
            FN('That’s all right. You can do it for both of us. We have the same name, after all.', 'happy'),
            ST('Can I keep the little one? No. I know. I know I can’t. I’m asking anyway.', 'sad'),
            N('Your Nubbin climbs out of Stark’s cloak for the last time, slowly, and stops at the collar to look at him.'),
          ],
          choices: [
            {
              id: 'own-way',
              label: 'Let your Nubbin say goodbye its own way.',
              then: [N('It pats Stark’s cheek once with a paw, the way it pats the eggs at home. Stark goes to pieces completely.')],
            },
            {
              id: 'visit',
              label: 'Tell Stark he can visit.',
              then: [ST('In a book? Can you visit a book? I’ll ask Frieren. She knows some very odd spells.', 'happy')],
            },
            {
              id: 'scarf',
              label: 'Give Stark your scarf to keep.',
              then: [ST('The jam one. Thanks. I’ll never wash it.', 'soft')],
            },
          ],
        },
        done: {
          id: 'a21-20-gate-done',
          lines: [FR('Wait. Before you go. Both of you. Ferns.', 'think')],
        },
      },
      {
        id: 'a21-20-s2',
        goal: 'Stand in the field outside the gate while Frieren casts her favourite spell.',
        hint: 'Stand in the open grass with Keeper Fern, and keep still.',
        check: 'watch:a21-field:north-gate',
        scene: {
          id: 'a21-20-field',
          lines: [
            N('Outside the gate there is a bare field of winter grass, flattened by carts. Frieren walks out into the middle of it.'),
            FR('This is the spell I love best. My teacher’s. It doesn’t do anything. I know a thousand spells that do things.', 'soft'),
            FR('This one is for the two Ferns. One who stayed with me, and one who came a long way to visit.'),
            N('She lifts her staff, and says something too quiet to hear.'),
            N('Flowers open round your boots. Then round everyone’s, then across the whole field to the road: white and yellow and blue.'),
            K('Oh.', 'shock'),
            K('Oh, Frieren. Look at them. I couldn’t grow this in a hundred years.', 'happy'),
            FN('You’d try, though. That’s what you’re for. Lord Heiter would have liked you very much.', 'soft'),
            N('Your Nubbin runs through the flowers in a circle, then another circle, then lies down in the middle of them.'),
            FR('I used to think the time I had with people was short. It is. I’d rather know it now.', 'think'),
          ],
          choices: [
            {
              id: 'thank',
              label: 'Thank her.',
              then: [FR('Himmel always thanked me. It took me fifty years to work out I should have said it back. So: thank you.', 'soft')],
            },
            {
              id: 'remember',
              label: 'Tell her you’ll remember this.',
              then: [FR('Good. That’s the whole job. Remembering. Somebody has to.', 'soft')],
            },
            {
              id: 'look',
              label: 'Say nothing, and look.',
              then: [N('You look. You look properly, the way she didn’t at the first field, a long time ago.')],
            },
          ],
        },
      },
    ],
    complete: {
      id: 'a21-20-complete',
      lines: [
        N('Frieren kneels in the flowers and puts two things into your hand: a sprig of blue moon-weed, and one small brown seed.'),
        FR('From the tower. You were there. You should have some.', 'soft'),
        FR('Plant it somewhere you’ll walk past. It takes its time. The good ones do.'),
        ...A20_HOME,
      ],
    },
    rewards: [
      {
        id: 'a21-moonweed',
        kind: 'decor',
        label: 'Blue Moon-Weed',
        description:
          'If you searched with Frieren: a seed from the top of a ruined tower. It grows by the cottage gate and flowers blue every spring.',
      },
      {
        id: 'a21-pressed-flower',
        kind: 'item',
        label: 'Pressed Moon-Weed',
        description: 'If you went on ahead: one blue moon-weed, pressed flat. It goes in your journal, at the page where you waited.',
      },
      {
        id: 'a21-remembering-bookmark',
        kind: 'item',
        label: 'Night of Remembering Bookmark',
        description: 'A strip of paper pressed with tiny flowers. It marks the Flower Field page, and counts towards the Night of Remembering.',
      },
    ],
    sets: { 'a21-20': true, 'a21-done': true },
    notes:
      'SIGNATURE PAYOFF (a21-search, set in A21-7). The complete scene shown is for “with”: moon-weed and a seed; grant ' +
      'a21-moonweed (not a21-pressed-flower). For “ahead” play A21_VARIANTS a21-20-complete-ahead (“Next time, look ' +
      'with me.”) and grant a21-pressed-flower (not a21-moonweed). The bookmark is granted either way. All rewards ' +
      'are one-time. THE FIELD: the outline marks this farewell as our own scene; Frieren’s flower spell is shown ' +
      'in full for the first time (it was a doorstep ring in A21-10). Staging: flowers spread out from the party in ' +
      'a ring, the whole screen filling over a21-20-field#4. Your Nubbin leaves Stark’s cloak in step 1; it is in ' +
      'the flowers for step 2. The last two lines of A20_HOME play over the Grove kitchen, the atlas closing. ' +
      'SIM: (a) the moon-weed is a decor plant fixed by the cottage gate that flowers each spring (a seasonal ' +
      'look, not a harvest). (b) The pressed flower is a journal page item. (c) The Night of Remembering (A3, A5, ' +
      'A7, A16, A21, A23, any two) reads atlasDone(\'A21\'). (d) The Grove keepsake scenes are in A21_VARIANTS ' +
      '(a21-grove-*): see their notes there.',
  },
];

// =================================================================== variant scenes

/**
 * Variant scenes, chosen by flags. Where each one plays:
 *   - a21-01-page-done-bramble: s8Reunited; replaces a21-01-page-done (A21-1, step 1 done).
 *   - a21-02-burial-done-home: Hazel home (chapter 10’s dawn has played, the campaign isn’t finished);
 *     replaces a21-02-burial-done (A21-2, step 2 done).
 *   - a21-02-burial-done-after: campaign finished (CampaignState.ending set); replaces a21-02-burial-done.
 *   - a21-07-wait, a21-07-wait-done: a21-search = ahead; replace a21-07-search and a21-07-search-done (A21-7, step 2).
 *   - a21-11-ghost-hazel, a21-11-sit-hazel: s8Reunited; replace a21-11-ghost and a21-11-sit (A21-11, steps 2 and 3).
 *   - a21-15-hut-done-hazel: s8Reunited; replaces a21-15-hut-done (A21-15, step 2 done).
 *   - a21-16-complete-ahead: a21-search = ahead; replaces a21-16-complete.
 *   - a21-20-complete-ahead: a21-search = ahead; replaces a21-20-complete.
 *   - GROVE KEEPSAKES (played in the Grove, never in the Atlas; they write nothing):
 *       a21-grove-moss: once, the first time you walk past Moss on the western hill after atlasDone('A21'),
 *         if Moss has not faded. From then on Keeper Fern is sometimes drawn sitting beside him (no timer).
 *       a21-grove-moss-faded: the same, if Moss has faded: Fern by his flower at the flat stone.
 *       a21-grove-moonweed: once, the first spring morning after atlasDone('A21') with a21-search = with,
 *         when the moon-weed by the cottage gate first flowers.
 */
export const A21_VARIANTS: Scene[] = [
  // ---------------------------------------------------------------- A21-1: Bramble comes along
  {
    id: 'a21-01-page-done-bramble',
    lines: [
      N('Bramble sits on Keeper Fern’s boots, grey and solemn, her folded ear twitching at the noise of the crowd.'),
      K('She came down from the Hollow for this. She doesn’t do crowds. Or books. She’s making an exception.', 'soft'),
      HI('A guardian. Good. Every party needs one who keeps an eye on the exits.', 'happy'),
    ],
  },
  // ---------------------------------------------------------------- A21-2: Keeper Fern at the graveside
  {
    id: 'a21-02-burial-done-home',
    lines: [
      A2_FERN_OPEN,
      K('Hazel’s home. She sleeps most of the day. I sit by her and think of things to ask, and then I let her sleep.', 'sad'),
      A2_FERN_CLOSE,
    ],
  },
  {
    id: 'a21-02-burial-done-after',
    lines: [
      A2_FERN_OPEN,
      K('I lived next door to Hazel for years. I knew which biscuits she liked. That’s about it.', 'sad'),
      A2_FERN_CLOSE,
    ],
  },
  // ---------------------------------------------------------------- A21-7: you went ahead
  {
    id: 'a21-07-wait',
    lines: [
      N('The next town has an inn with a roof, and a job at the bakery that pays in actual money. Young Fern is delighted.'),
      FN('Money. Look. It’s round, and you can spend it.', 'happy'),
      N('Six months go by, and young Fern bakes. Keeper Fern weeds the inn’s herb bed, whether or not it wants weeding.'),
      K('It didn’t ask. I could tell it wanted to.'),
      N('In the evenings young Fern sits at the window that looks back down the road.'),
      FN('She forgets, you know. Time. She doesn’t mean to. It just goes past her.', 'soft'),
      FN('Lord Heiter said to be patient with her. He said she was worth it. He said it a lot. I think he was telling himself.'),
      N('Your Nubbin sits on the windowsill and watches the road with her.'),
    ],
    choices: [
      {
        id: 'come',
        label: 'Tell her Frieren will come.',
        then: [FN('I know she will. I just like to see her come.', 'soft')],
      },
      {
        id: 'heiter',
        label: 'Ask what Heiter was like.',
        then: [FN('Lazy. Kind. Very bad at hiding bottles. I miss him all the time.', 'sad')],
      },
    ],
  },
  {
    id: 'a21-07-wait-done',
    lines: [
      N('On the last day of autumn a small figure comes up the road, with dusty boots and a fistful of blue.'),
      FR('Found it. At the top of a tower. A rat helped.', 'happy'),
      FN('You’re late.'),
      FR('I’m early. For me.'),
    ],
  },
  // ---------------------------------------------------------------- A21-11: the ghost wears Hazel’s coat (Bramble found)
  {
    id: 'a21-11-ghost-hazel',
    lines: [
      N('Bramble presses hard against Keeper Fern’s boots and growls, low, which she never does.'),
      N('In the mist stands a woman with her back to you, in Hazel’s coat: the big one she wore to feed the strays, patched at the elbow.'),
      K('…Hazel?', 'shock'),
      K('Hazel, it’s me. It’s Fern. From next door. I’ve got so much to ask you. I never asked you anything.', 'sad'),
      N('She takes one step forward, with your hand on her sleeve. Bramble sits down on her boots, both of them, and stays.'),
      N('The figure begins to turn round. It knows all of Hazel’s ways, and that’s the cruelty of it.'),
      ...A11_YOUNG_FERN,
    ],
    choices: A11_HOLD,
  },
  {
    id: 'a21-11-sit-hazel',
    lines: [
      N('Keeper Fern sits on the edge of the well with her hands between her knees. She is very quiet, which she never is.'),
      K('It had her coat. She used to hang it on my gate when she came round, as if it were waiting to be taken home.', 'sad'),
      K('All those mornings. I never once asked her where she was going in it.', 'sad'),
      N('Young Fern comes and stands a little way off, holding her staff, not sure if she’s allowed.'),
      FN('I saw Lord Heiter. It was nothing like him, really. He’d have been asleep.', 'soft'),
      K('Ha. Yes. Hazel would have told it to wipe its feet.', 'happy'),
      N('Bramble climbs into Keeper Fern’s lap, which is too small for her, and stays there anyway.'),
      N('Frieren sits down on Keeper Fern’s other side and says nothing at all. She seems to know that’s the point.'),
    ],
    choices: [
      {
        id: 'wait',
        label: 'Sit down beside her and wait.',
        then: [N('You sit down next to her, and wait. After a while she leans on you, very slightly.')],
      },
      {
        id: 'knew',
        label: 'Tell her Hazel knew she cared.',
        then: [K('Did she? I suppose she did. She noticed everything. Even me.', 'soft')],
      },
      {
        id: 'nubbin',
        label: 'Put your Nubbin in her lap, next to Bramble.',
        then: [N('Bramble washes it, ear to ear, as if it were one of hers. Keeper Fern laughs, wetly, and that helps.')],
      },
    ],
  },
  // ---------------------------------------------------------------- A21-15: Keeper Fern to Kraft (Bramble found)
  {
    id: 'a21-15-hut-done-hazel',
    lines: [
      K('I lived next door to a woman for years. Hazel. I don’t know how she held a cup. I never looked.', 'sad'),
      KR('Then look at the next one. That’s all the second chance anyone gets.'),
      K('Right. Yes. I’m going to stare at everyone’s hands now. It’ll be very odd.', 'happy'),
    ],
  },
  // ---------------------------------------------------------------- A21-16: the ring (you went ahead)
  {
    id: 'a21-16-complete-ahead',
    lines: [
      ...A16_RING_START,
      FR('I’m bad at looking for things. I take too long. Help me. Please.', 'sad'),
      ...A16_RING_END,
    ],
  },
  // ---------------------------------------------------------------- A21-20: the farewell (you went ahead)
  {
    id: 'a21-20-complete-ahead',
    lines: [
      N('Frieren kneels in the flowers and puts one thing into your hand: a single blue moon-weed, pressed flat between two leaves.'),
      FR('From the tower. You weren’t there. I wish you had been. It was a good tower.', 'soft'),
      FR('Next time, look with me.'),
      ...A20_HOME,
    ],
  },
  // ---------------------------------------------------------------- Grove keepsakes (read atlasDone('A21'))
  {
    id: 'a21-grove-moss',
    lines: [
      N('Fern from next door is up on the western hill beside Moss, with a flask of tea and her knees pulled up.'),
      K('How many friends have you outlived, Moss? You don’t have to say. I’m asking everyone things now.'),
      MO('Enough to stop counting. Not enough to stop minding.', 'soft'),
      MO('You’ve been reading about elves. We’re not like that. We are worse at birthdays.', 'think'),
      K('Have you even got one? A birthday?'),
      MO('I came up out of the water before anyone was counting.'),
      K('Then you can have the first warm day after the thaw. I’ve decided. I’m bringing a cake.', 'happy'),
      MO('…I suppose I shall have to be here, then.', 'soft'),
    ],
  },
  {
    id: 'a21-grove-moss-faded',
    lines: [
      N('Fern from next door is up on the hill, sitting by the flat stone where Moss always sat, beside his flower.'),
      K('I’m asking people things now. Little things. I should have asked you more.', 'sad'),
      K('What it was like, being the first. Whether you minded the rain. Whether you liked it when I talked to the trees.'),
      N('The flower moves a little in the wind. Fern nods, as if it had answered.'),
      K('I’ll come back. I’ve got a list.', 'soft'),
    ],
  },
  {
    id: 'a21-grove-moonweed',
    lines: [
      N('By the cottage gate, where you planted Frieren’s seed, something has come up: thin stems, and small blue flowers like stars.'),
      N('Your Nubbin sits down beside it and looks up at you, very pleased with itself, as if it had done all the work.'),
    ],
  },
];

// =================================================================== flags and checks

/** Every flag this line sets (Atlas save only). It reads Grove state and writes no Grove flag. */
export const ATLAS_A21_FLAGS: string[] = [
  'a21-01',
  'a21-02',
  'a21-03',
  'a21-04',
  'a21-05',
  'a21-06',
  'a21-07',
  'a21-08',
  'a21-09',
  'a21-10',
  'a21-11',
  'a21-12',
  'a21-13',
  'a21-14',
  'a21-15',
  'a21-16',
  'a21-17',
  'a21-18',
  'a21-19',
  'a21-20',
  'a21-done', // A21-20: the whole page; read by atlasDone('A21') for the Night of Remembering and the Grove keepsakes
  'a21-search', // with | ahead (a21-07-flower): A21-7 step 2, A21-16 complete, A21-20 complete, the Grove keepsake
];

export const ATLAS_A21_CHECKS: string[] = [
  'explore:a21-capital:gate',
  'walk:a21-hill:capital',
  'watch:a21-meteors:hill',
  'carry:a21-flowers:cathedral',
  'wait:a21-burial:churchyard',
  'visit:a21-heiter:strahl',
  'talk:a21-fern:doorstep',
  'carry:a21-water:well',
  'watch:a21-rock:field',
  'inspect:a21-grimoire:study',
  'sit:a21-heiter:porch',
  'collect:a21-jobs:turk',
  'climb:a21-statue:square',
  'choose:a21-moonweed:search',
  'wait:a21-moonweed:half-year',
  'place:a21-wreath:statue',
  'visit:a21-elder:village',
  'watch:a21-qual:hill',
  'visit:a21-inn:frieren-room',
  'watch:a21-sunrise:ridge',
  'visit:a21-eisen:cabin',
  'explore:a21-flamme:meadow',
  'explore:a21-mist:village',
  'wait:a21-ghost:mist',
  'sit:a21-keeper-fern:well',
  'visit:a21-stark:cliff-house',
  'sit:a21-stark:fire',
  'watch:a21-dragon:cliff',
  'visit:a21-statues:square',
  'walk:a21-city:gate',
  'escort:a21-granat:back-stair',
  'talk:a21-frieren:plan',
  'escort:a21-townsfolk:indoors',
  'watch:a21-aura:field',
  'carry:a21-stark:hut',
  'wait:a21-kraft:winter',
  'visit:a21-sword:shrine',
  'craft:a21-hamburg:inn-kitchen',
  'choose:a21-bracelet:stall',
  'collect:a21-cages:aussert',
  'wait:a21-stille:pool',
  'carry:a21-stille:shore',
  'explore:a21-dungeon:stair',
  'watch:a21-spiegel:depths',
  'deliver:a21-staff:smith',
  'wait:a21-interview:bench',
  'place:a21-cages:hall',
  'walk:a21-gate:north',
  'watch:a21-field:north-gate',
];
