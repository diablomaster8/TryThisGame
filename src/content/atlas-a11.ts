/**
 * Atlas campaign, page A11: The Enchanted Place (Part M, rank 2). Twenty quests, A11-1 to A11-20.
 *
 * SOURCE. A. A. Milne, Winnie-the-Pooh (Methuen, London, 1926) and The House at Pooh Corner
 * (Methuen, 1928). Rights: both texts are public domain in the US (since 1 January 2022 and
 * 1 January 2024). In the UK, Milne died in 1956, so the texts stay in copyright (the Trustees of
 * the Pooh Properties) until 31 December 2026: DO NOT SHIP THIS PAGE IN THE UK BEFORE 1 JANUARY
 * 2027. E. H. Shepard's illustrations stay in UK copyright until 2047: no Shepard image, pose or
 * design. Disney holds trade marks in the name and its own designs: nothing from any Disney film,
 * song or design (no red shirt, no Gopher, no "Lumpy", no bow on Eeyore's tail, no Disney
 * catchphrases), and "Winnie-the-Pooh" stays out of the page title and marketing. Get a legal
 * check before ship.
 *
 * AUDIENCE. 'all'. Every lifted line has a `childLines` replacement for the Learning Grove.
 *
 * FRAME. Nova's atlas falls open at a page drawn in soft pencil. You and your Nubbin step into
 * the Forest, where Christopher Robin finds you at the edge. Nobody else from the valley comes:
 * this page belongs to the Forest's own people. Christopher Robin and Pooh are the heroes; you
 * carry things, hold the other end, and sit. The Forest's animals talk, as Milne's do (canon 31);
 * your Nubbin never talks. Running jokes: Pooh is sure your Nubbin is a very small Heffalump;
 * Piglet suspects it is a Woozle; it is very good at Poohsticks because it doesn't mind getting
 * wet. In A11-1 Christopher Robin ties a blue "Friend" ribbon on your Nubbin (a plot prop, not a
 * reward), which may be given away in A11-6.
 *
 * GROVE FLAGS READ (read-only; the Atlas never writes a Grove flag):
 *   - Campaign finished (CampaignState.ending is set, so chapter 12's finalChoice is done AND
 *     Hazel's walk up the hill, c12-walk-*, has played). Then A11_VARIANTS 'a11-margin-hazel'
 *     plays once, the first time the atlas is open at this page's last page (Galleons Lap) after
 *     that; or straight after a11-20-complete if the campaign is already finished then. From
 *     then on, the pencil note is drawn in the margin of that page. Never before the walk.
 *     S24 adds no second note here.
 *
 * FLAGS WRITTEN (Atlas save only, all prefixed a11-):
 *   - a11-01 … a11-20: each quest on completion. a11-done: the whole page (A11-20); the Long
 *     Table festival and the Grove keepsake read it through atlasDone('A11').
 *   - a11-gift = ribbon | thistle | sat (A11-6, a11-06-gift): picks variants in A11-11, A11-16,
 *     A11-19 and A11-20, and the detail on the Grove's Poohsticks bridge.
 *   - a11-mist = rabbit | tigger (A11-17, a11-17-plan): picks variants in A11-17 and A11-19.
 *
 * LIFTED TEXT (verbatim; only the passages Part M marks as verified, rechecked there on
 * 2026-10-14 against Project Gutenberg #67098, Winnie-the-Pooh, 1926 Methuen text, and #73011,
 * The House at Pooh Corner, 1928 Methuen text; set with the game's curly quotes):
 *   1. "Here is Edward Bear, coming downstairs now, bump, bump, bump, on the back of his head,
 *      behind Christopher Robin." (WtP ch. I) Narration, a11-01-page#2.
 *   2. "For I am a Bear of Very Little Brain, and long words Bother me." (WtP ch. IV) Pooh,
 *      a11-04-owl#6.
 *   3. "Silly old Bear, … what were you doing?" (WtP ch. III; the dialogue tag "he said" is
 *      dropped, the spoken words are exact; "were" is italic in #67098, so italicise it if the
 *      dialogue box supports emphasis.) Christopher Robin, a11-03-count-done#1.
 *   4. "Tiggers don't like honey." (HAPC ch. II) Tigger, a11-12-breakfast#1.
 *   5. "you can't help respecting anybody who can spell TUESDAY" (HAPC ch. V, a fragment, set
 *      inside our own sentence). Rabbit, a11-15-owl#5.
 * Each is used once. Part M marks three passages [unverified] (WtP ch. IX's "It rained and it
 * rained and it rained."; HAPC ch. X's promise exchange and its last line). They are NOT quoted:
 * the beats are told in our own words (a11-09-rain#0; a11-20-knight#8–11; the last-line beat in
 * the a11-20-complete* scenes). Every other line is original. Pooh's hums, Eeyore's poem and the
 * Rissolution's text are described, never given (no lyrics, no verse). Milne's coined words used
 * as names only: Heffalump, Woozle, Backson, Expotition, Rissolution, Poohsticks, Galleons Lap,
 * The Chestnuts, The Floating Bear, The Brain of Pooh.
 *
 * CARE NOTES.
 *   - Christopher Robin's model was Milne's real son. No commentary on the real family, ever.
 *   - Nothing sad happens but the goodbye, and it stays Milne's: gentle and unexplained. Nobody
 *     says "school"; nobody says "growing up" except Christopher Robin's one joke about being
 *     enormous.
 *   - The flood (A11-9) is safe on screen: you paddle a wash-tub, your Nubbin rides on your head,
 *     and nobody is ever in danger longer than a line. The popgun (A11-1) is a cork popgun.
 *   - Hazel's third rule is acted out (A11-6's "sit" choice, the mist hollow) and never quoted.
 *   - All art is original: no Shepard, no Disney. Tigger's stripes, Pooh's shape and the Forest
 *     map are our own, drawn in the atlas's soft-pencil style.
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

const WHERE = 'Nova’s atlas: the Enchanted Place page (Atlas campaign)';
const after = (code: string) => `Any time after ${code}, from Nova’s atlas.`;

// ------------------------------------------------------------------ speakers

const POOH = sp('a11-pooh', 'Pooh', 'Edward Bear, called Winnie-the-Pooh (A. A. Milne, 1926 and 1928); original design');
const PIGLET = sp('a11-piglet', 'Piglet', 'Piglet (A. A. Milne, 1926 and 1928); original design');
const CROBIN = sp('a11-cr', 'Christopher Robin', 'Christopher Robin as Milne wrote him (1926 and 1928); original design');
const EEYORE = sp('a11-eeyore', 'Eeyore', 'Eeyore, the old grey donkey (A. A. Milne, 1926 and 1928); original design');
const OWL = sp('a11-owl', 'Owl', 'Owl (A. A. Milne, 1926 and 1928); original design');
const RABBIT = sp('a11-rabbit', 'Rabbit', 'Rabbit (A. A. Milne, 1926 and 1928); original design');
const KANGA = sp('a11-kanga', 'Kanga', 'Kanga (A. A. Milne, 1926 and 1928); original design');
const ROO = sp('a11-roo', 'Roo', 'Baby Roo (A. A. Milne, 1926 and 1928); original design');
const TIGGER = sp('a11-tigger', 'Tigger', 'Tigger (A. A. Milne, The House at Pooh Corner, 1928); original design');

const N = say('narrator');
const Y = say('you');
const P = say('a11-pooh');
const PG = say('a11-piglet');
const CR = say('a11-cr');
const E = say('a11-eeyore');
const O = say('a11-owl');
const R = say('a11-rabbit');
const K = say('a11-kanga');
const RO = say('a11-roo');
const T = say('a11-tigger');

// ------------------------------------------------------------------ lifted text (verified)

/** WtP ch. I (1926 Methuen; PG #67098). */
const LIFT_BUMP =
  'Here is Edward Bear, coming downstairs now, bump, bump, bump, on the back of his head, behind Christopher Robin.';
/** WtP ch. IV (1926 Methuen; PG #67098). */
const LIFT_BRAIN = 'For I am a Bear of Very Little Brain, and long words Bother me.';
/** WtP ch. III (1926 Methuen; PG #67098). Spoken words only; "were" is italic in the source. */
const LIFT_SILLY = 'Silly old Bear, what were you doing?';
/** HAPC ch. II (1928 Methuen; PG #73011). */
const LIFT_HONEY = 'Tiggers don’t like honey.';
/** HAPC ch. V (1928 Methuen; PG #73011), a fragment inside our own sentence. */
const LIFT_TUESDAY = 'Owl may not know what a Backson is. But you can’t help respecting anybody who can spell TUESDAY.';

// ------------------------------------------------------------------ shared pieces

/** A11-19: the walk to Christopher Robin's door, after the scroll beat (all three gift variants). */
const A19_DELIVER: Line[] = [
  N('Everyone walks to Christopher Robin’s house together. At the door, nobody wants to go first.'),
  N('In the end Eeyore goes first, because it is his poem, and everybody else crowds in behind him.'),
  CR('What’s this?'),
  E('It’s a Rissolution. From all of us. You read it. We’ll just… we’ll go.', 'sad'),
  N('Christopher Robin reads it right to the end, and all the names, and he doesn’t say anything for a moment.'),
  CR('Thank you. All of you. Thank you.', 'soft'),
];

/** A11-20: the opening of the complete scene (all three gift variants). */
const A20_START: Line[] = [
  N('Christopher Robin and Pooh go off together, out of the far side of the circle. You don’t follow, because this bit is theirs.'),
];

/** A11-20: the last-line beat (Milne's last line is [unverified]: told in our own words) and the way home. */
const A20_END: Line[] = [
  N('Whatever comes next for them, there is a ring of trees at the top of the Forest that nobody can count.'),
  N('A boy and his Bear are playing in it. Nobody ever stops them.', 'soft'),
  N('The page settles under your hand, gently, like a door somebody is careful not to bang.'),
  N('You are back in the Grove, with Nova’s atlas on your knee. There is a stick in your Nubbin’s mouth, and nobody saw where it came from.'),
];

// =================================================================== THE ENCHANTED PLACE

export const ATLAS_A11: Quest[] = [
  // ---------------------------------------------------------------- A11-1
  {
    id: 'a11-01',
    code: 'A11-1',
    title: 'Bump, Bump, Bump',
    source: 'Winnie-the-Pooh (1926), ch. I: Pooh and some bees',
    audience: 'all',
    trigger: {
      where: WHERE,
      when: 'Any time once Nova’s atlas is in the Grove; the first quest on the page. Not in the UK before 1 January 2027.',
    },
    speakers: [CROBIN, POOH],
    steps: [
      {
        id: 'a11-01-s1',
        goal: 'Step into the pencil Forest and meet the boy at its edge.',
        hint: 'Touch the page, then walk up the path to the boy with the bear.',
        check: 'explore:a11-forest:edge',
        scene: {
          id: 'a11-01-page',
          lines: [
            N('Nova’s atlas falls open at a page drawn in soft pencil: a stream, a bridge, and a hill with a ring of trees on top.'),
            N('Across the top there is writing, in slow, careful print.'),
            N(LIFT_BUMP),
            N('The pencil goes soft under your fingers, then softer. Then it is pine needles, and you and your Nubbin are standing in them.'),
            N('A boy is coming up the path with a bear under his arm, upside down. Neither of them seems to mind.'),
            CR('Hallo. You’re not from the Forest. I know everybody in the Forest.'),
            CR('This is Pooh. He came down the stairs on his head, so he may be a bit muddled. He usually is anyway.'),
            P('How do you do. Is that a Heffalump?', 'think'),
            CR('No, Pooh.'),
            P('A very small one, I expect. They start small. Everything does.'),
            N('Your Nubbin looks behind itself, in case there is a Heffalump there.'),
          ],
          choices: [
            {
              id: 'nubbin',
              label: 'Tell Pooh it’s a Nubbin.',
              then: [P('A Nubbin. Yes. That’s just what a very small Heffalump would say.', 'think')],
            },
            {
              id: 'decide',
              label: 'Let your Nubbin decide.',
              then: [N('Your Nubbin sits on Pooh’s foot. Pooh decides that is a friendly thing for a Heffalump to do, and lets it.')],
            },
            {
              id: 'what',
              label: 'Ask what a Heffalump is.',
              then: [CR('Nobody knows exactly. That’s the best sort of animal.')],
            },
          ],
        },
        done: {
          id: 'a11-01-page-done',
          lines: [
            P('I was just going to see about some honey. You can come, if you like.'),
            P('Honey always goes better with somebody watching.', 'happy'),
          ],
        },
      },
      {
        id: 'a11-01-s2',
        goal: 'Hold the balloon string while Pooh floats up to the bees.',
        hint: 'Stand under the tall oak and keep both hands on the string.',
        check: 'wait:a11-balloon:oak',
        scene: {
          id: 'a11-01-balloon',
          lines: [
            N('High in an oak there is a buzzing. Pooh stops so suddenly that your Nubbin walks into the back of him.'),
            P('That is a honey sort of buzz. I’d know it anywhere.', 'happy'),
            P('The trouble with honey is that it’s always at the top of things. Christopher Robin, have you got such a thing as a balloon?'),
            CR('I’ve got two. A green one and a blue one. What do you want a balloon for?'),
            P('Honey.', 'think'),
            P('The blue one, please. Bees won’t mind a bit of blue sky. And I shall roll in the mud, so I look like a small black cloud.'),
            N('He does, very thoroughly. Your Nubbin rolls in the mud too, in case it’s a rule.'),
            CR('You hold the string. Don’t let go unless he says. And don’t laugh. It hurts his feelings.'),
            N('Up goes Pooh, past the branches, round and black and very hopeful. He stops at exactly the height of the nest.'),
          ],
        },
        done: {
          id: 'a11-01-balloon-done',
          lines: [
            N('The string tugs in your hands like a kite that has been told about honey.'),
            P('Christopher Robin? These bees are looking at me in a very suspicious sort of way.', 'think'),
          ],
        },
      },
      {
        id: 'a11-01-s3',
        goal: 'Help get Pooh down again, without laughing.',
        hint: 'Keep the string steady while Christopher Robin aims his popgun.',
        check: 'watch:a11-bees:oak',
        scene: {
          id: 'a11-01-bees',
          lines: [
            P('Would you walk up and down with your umbrella, Christopher Robin, and say it looks like rain? Then they’ll believe I’m a cloud.'),
            N('Christopher Robin walks up and down under his umbrella, saying it looks like rain. It doesn’t, and the bees know.'),
            P('I think these are the wrong sort of bees. They would make the wrong sort of honey. I shall come down now.'),
            CR('How?'),
            N('Pooh hadn’t thought about that. He holds on, with the face of a bear doing a hard sum.'),
            P('If you were to shoot the balloon with your popgun, I should come down. Gently. I hope.'),
            CR('I might miss.'),
            P('You might. Try not to.'),
          ],
          choices: [
            {
              id: 'lip',
              label: 'Bite your lip and hold steady.',
              then: [N('You bite your lip, and the string stays steady. Pooh looks down at you gratefully.')],
            },
            {
              id: 'laugh',
              label: 'Laugh, a little, into your sleeve.',
              then: [
                P('I heard that.', 'sad'),
                CR('It’s all right. I laughed the first time too. He forgave me by lunch.'),
              ],
            },
          ],
        },
        done: {
          id: 'a11-01-bees-done',
          lines: [
            N('Pop goes the popgun. “Ow!” says Pooh.'),
            CR('Did I miss?'),
            P('You hit something. It wasn’t the balloon.', 'sad'),
            N('The second cork gets the balloon. Pooh floats down into your arms like a large, muddy leaf.'),
          ],
        },
      },
    ],
    complete: {
      id: 'a11-01-complete',
      lines: [
        N('Pooh’s arms have held the string so long that they stay up in the air, like a bear about to be surprised.'),
        CR('They’ll come down in a week or so. If a fly lands on his nose, he has to blow it off. Like that. Pooh!'),
        N('Pooh blows a fly off his nose. He looks pleased to be good at something.'),
        CR('You can come back, you know. There’s always something on in the Forest. Or nothing, which is better.'),
        N('He ties a blue ribbon round your Nubbin’s middle, in a careful double bow.'),
        CR('So everyone knows it’s a Friend. Otherwise Piglet will think it’s a Woozle, and then there’s no talking to him.'),
      ],
    },
    rewards: [],
    sets: { 'a11-01': true },
    childLines: {
      'a11-01-page#2': 'A boy is coming down the stairs, and behind him, by one paw, comes his bear, bumping all the way.',
    },
    notes:
      'OPENING: the atlas page is drawn in soft pencil and colours in as you step through (a slow wash, two seconds). ' +
      'a11-01-page#1–2 show the line of print across the top of the page; voice it as narration. The popgun is a toy ' +
      'cork popgun; the bees are a cloud of small dots and never sting. Pooh floats on a blue balloon (our own drawing, ' +
      'no Shepard pose). From the complete scene on, your Nubbin wears a blue double bow on this page only (Atlas ' +
      'save); it stays until A11-6, where it may be given away (a11-gift = ribbon). It is not a reward and never ' +
      'appears in the Grove.',
  },

  // ---------------------------------------------------------------- A11-2
  {
    id: 'a11-02',
    code: 'A11-2',
    title: 'A Tight Place',
    source: 'Winnie-the-Pooh (1926), ch. II: Pooh goes visiting and gets into a tight place',
    audience: 'all',
    trigger: { where: WHERE, when: after('A11-1') },
    requires: ['A11-1'],
    speakers: [POOH, RABBIT, CROBIN],
    steps: [
      {
        id: 'a11-02-s1',
        goal: 'Go visiting with Pooh, to Rabbit’s.',
        hint: 'Follow Pooh along the sandbank to the hole in it.',
        check: 'visit:a11-rabbit:burrow',
        scene: {
          id: 'a11-02-visit',
          lines: [
            N('Pooh is humming along the sandbank, which is what he does when he isn’t doing anything else.'),
            P('A hole. A hole means Rabbit, and Rabbit means company, and company means a little something.', 'happy'),
            P('Hallo? Anybody in?'),
            R('Nobody’s in. Go away.'),
            P('Then who said that?', 'think'),
            R('Nobody. I said it for him.'),
            N('Rabbit puts his head out, sighs, and looks at your Nubbin.'),
            R('And what is that?'),
            P('A very small Heffalump.'),
            R('It is not. It’s wearing a bow. Heffalumps don’t wear bows. Come in, then, both of you. Wipe your feet.'),
            N('Rabbit gets out the honey. Pooh has a little, and then a little more, and then the rest, so it won’t feel left out.'),
            N('Your Nubbin has one crumb. Rabbit watches it eat the crumb as if it might be the start of something.'),
          ],
        },
        done: {
          id: 'a11-02-visit-done',
          lines: [
            R('Well. Must you be going? Already? What a shame.'),
            N('Pooh starts out of the front door, and his front half gets out. The rest of him has had too much honey to follow.'),
            P('Oh, dear. I seem to have stopped.', 'shock'),
          ],
        },
      },
      {
        id: 'a11-02-s2',
        goal: 'Fetch Christopher Robin to look at the stuck bear.',
        hint: 'Run up the path to Christopher Robin’s house, then walk him back.',
        check: 'escort:a11-cr:rabbit-door',
        scene: {
          id: 'a11-02-stuck',
          lines: [
            N('Pooh is stuck. His head and arms are out in the morning, and the rest of him is in Rabbit’s hall.'),
            P('I can’t go forwards and I can’t go back. It’s all on account of the door being too narrow.', 'sad'),
            R('It’s all on account of somebody eating too much honey. I’m only saying.'),
            R('You. Keeper. Go and get Christopher Robin. Run.'),
            N('You run. Christopher Robin comes back at a sensible walk, because he has seen this sort of thing before.'),
            CR('There’s only one thing for it. He’ll have to stay there until he’s thin again.'),
            P('How long does getting thin take?', 'shock'),
            CR('About a week, I should think.'),
            P('A week! What about meals?'),
            CR('No meals. That’s rather the point.'),
            N('A tear rolls down Pooh’s nose and drips on the sand. Your Nubbin sits in front of him, nose to nose.'),
            P('Then would you read to me? Something comforting. A Sustaining Book, for a Bear in a Tight Place.', 'sad'),
          ],
        },
        done: {
          id: 'a11-02-stuck-done',
          lines: [CR('We’ll take turns. You read in the mornings, and I’ll read in the afternoons.')],
        },
      },
      {
        id: 'a11-02-s3',
        goal: 'Read to Pooh while he gets thinner.',
        hint: 'Sit by Pooh’s head and pick something to read; the week passes as the story goes on.',
        check: 'sit:a11-pooh:rabbit-door',
        scene: {
          id: 'a11-02-week',
          lines: [
            N('So for a week you sit on the sandbank and read to the North end of Pooh. Christopher Robin takes the afternoons.'),
            N('At the South end, inside, Rabbit has hung his washing on Pooh’s back legs.'),
            R('It’s a waste of a perfectly good pair of legs otherwise. Do you mind, Pooh?', 'think'),
            P('I don’t mind. I should like to know what’s on them, though.'),
            R('Tea towels.'),
            P('Ah.'),
            N('Your Nubbin brings Pooh an acorn to look at, since he isn’t allowed to eat anything.'),
            P('What are we reading today?'),
          ],
          choices: [
            {
              id: 'bear',
              label: 'A story about a bear who was exactly the right size.',
              then: [P('I like him already. Does he get stuck?', 'happy'), Y('Never.'), P('Lucky bear.')],
            },
            {
              id: 'sea',
              label: 'A book about the sea, where there aren’t any doors.',
              then: [P('No doors at all? That sounds like a very comfortable place for a bear.', 'soft')],
            },
            {
              id: 'quiet',
              label: 'Just sit with him. Don’t read anything.',
              then: [
                N('You sit by his head and say nothing at all.'),
                P('That’s the most sustaining one so far.', 'soft'),
              ],
            },
          ],
        },
        done: {
          id: 'a11-02-week-done',
          lines: [
            N('On the seventh day Christopher Robin takes Pooh’s front paws. Rabbit takes Christopher Robin.'),
            N('Rabbit’s friends-and-relations take Rabbit, all of them, in a long line. You take the end, and your Nubbin takes you.'),
            CR('Pull!'),
            N('For a long time nothing happens. Then, with a pop like a ginger-beer cork, out comes Pooh, and everyone sits down at once.'),
          ],
        },
      },
    ],
    complete: {
      id: 'a11-02-complete',
      lines: [
        P('Thank you. All of you. Especially the one at the end, who I couldn’t see but could feel.', 'happy'),
        N('Pooh nods to his friends and walks off into the Forest, humming, a little thinner and not at all wiser.'),
        R('He’ll be back. He knows where the honey is now. I shall have to get a wider door.', 'think'),
        N('Rabbit looks at the hall where the legs were. He looks very nearly as if he misses them.'),
      ],
    },
    rewards: [],
    sets: { 'a11-02': true },
    notes:
      'The week passes in the scene, not in real time: no daily visits (canon 22). Rabbit’s friends-and-relations ' +
      'are a long line of small silhouettes of all shapes (hedgehog, mouse, beetle); none speaks. The pull is a ' +
      'tug-of-war beat with a held pose and a pop sound.',
  },

  // ---------------------------------------------------------------- A11-3
  {
    id: 'a11-03',
    code: 'A11-3',
    title: 'The Woozle',
    source: 'Winnie-the-Pooh (1926), ch. III: Pooh and Piglet go hunting',
    audience: 'all',
    trigger: { where: WHERE, when: after('A11-2') },
    requires: ['A11-2'],
    speakers: [PIGLET, POOH, CROBIN],
    steps: [
      {
        id: 'a11-03-s1',
        goal: 'Follow Pooh round the spinney after the mysterious tracks.',
        hint: 'Walk round the larch spinney in the snow behind Pooh and Piglet. Don’t spoil it.',
        check: 'walk:a11-spinney:larches',
        scene: {
          id: 'a11-03-tracks',
          lines: [
            N('It is a fine winter’s day. Piglet is brushing snow off his front step when Pooh goes past, round in a circle.'),
            PG('Pooh? Why are you going round and round?'),
            P('Following something. I don’t know what yet. That’s the exciting part.', 'think'),
            P('Look. Paw-marks. Something has been round here, and round, and I have been round after it.'),
            PG('Could it be… a Woozle?', 'shock'),
            P('It might. Woozles are very hard to tell from the front.'),
            N('Piglet looks at your Nubbin, hard. Your Nubbin looks back with great innocence.'),
            PG('That one’s got a bow on. Christopher Robin s-said it was a Friend. But a Woozle would say that.', 'think'),
            N('Your Nubbin trots after Pooh round the spinney of larches, putting its small feet very carefully in the snow.'),
          ],
          choices: [
            {
              id: 'tell',
              label: 'Tell them the little prints are your Nubbin’s.',
              then: [
                P('Yes, yes. And these others are something else. Do keep up.'),
                N('Nobody is listening. It is very hard to spoil a thing when nobody is listening.'),
              ],
            },
            {
              id: 'hush',
              label: 'Say nothing. Let it play out.',
              then: [N('You say nothing. It feels like carrying a very full cup, very still.')],
            },
            {
              id: 'again',
              label: 'Let your Nubbin go round once more.',
              then: [N('Your Nubbin goes round once more, very pleased with itself. Now there is one more set of tracks.')],
            },
          ],
        },
        done: {
          id: 'a11-03-tracks-done',
          lines: [N('Round they go. Every time they come back to the same place, there are more tracks than before.')],
        },
      },
      {
        id: 'a11-03-s2',
        goal: 'Watch from the oak with Christopher Robin until they work it out.',
        hint: 'Climb the big oak by the spinney and keep quiet.',
        check: 'watch:a11-spinney:oak',
        scene: {
          id: 'a11-03-count',
          lines: [
            P('Look! Two of them now. And one very small. And a third, and something else besides.', 'shock'),
            PG('Three Woozles and a Wizzle, perhaps. Pooh, I’ve just remembered something I meant to do yesterday. I’d better go and do it.', 'shock'),
            N('Up in a big oak, Christopher Robin is sitting very still. He beckons you up, and your Nubbin rides in your hood.'),
            CR('Don’t say anything. He gets there in the end. He always does, and it’s better when he gets there himself.'),
            N('Pooh stops and looks at the tracks. He puts his own foot into one of them, and it fits.'),
            P('Oh.', 'think'),
            N('He puts his foot into another. It fits too.'),
            N('Piglet, a little way off, looks at the tiny prints, then at your Nubbin’s feet, and goes pink.'),
          ],
        },
        done: {
          id: 'a11-03-count-done',
          lines: [
            N('Christopher Robin climbs down from the tree.'),
            CR(LIFT_SILLY, 'happy'),
            P('I have been going round and round after my own feet. I am a Bear with no Brain worth mentioning.', 'sad'),
            CR('There isn’t a better bear anywhere. I’d know.', 'soft'),
          ],
        },
      },
    ],
    complete: {
      id: 'a11-03-complete',
      lines: [
        P('Being silly is very hungry work. Is it lunch?', 'happy'),
        N('Pooh and Christopher Robin go home together. Piglet walks a long way round your Nubbin, then, after a while, a shorter way.'),
        PG('I knew it wasn’t a Woozle. Mostly.', 'soft'),
        N('Your Nubbin holds out a paw. Piglet shakes it quickly, and then a second time, slower.'),
      ],
    },
    rewards: [],
    sets: { 'a11-03': true },
    childLines: {
      'a11-03-count-done#1': 'Oh, Pooh. Whose footprints do you think those are?',
    },
    notes:
      'Snow scene. Each lap of the spinney adds a set of prints (Pooh’s, Piglet’s, then your Nubbin’s tiny ones); ' +
      'the player walks the laps. a11-03-count-done#1 is Milne’s line: italicise “were” if the dialogue box allows. ' +
      'Christopher Robin and you sit in the oak; show the spinney from above for the reveal.',
  },

  // ---------------------------------------------------------------- A11-4
  {
    id: 'a11-04',
    code: 'A11-4',
    title: 'Eeyore’s Tail',
    source: 'Winnie-the-Pooh (1926), ch. IV: Eeyore loses a tail and Pooh finds one',
    audience: 'all',
    trigger: { where: WHERE, when: after('A11-3') },
    requires: ['A11-3'],
    speakers: [POOH, EEYORE, OWL, CROBIN],
    steps: [
      {
        id: 'a11-04-s1',
        goal: 'Find out what is wrong with Eeyore.',
        hint: 'Eeyore stands in the thistly corner of the Forest.',
        check: 'talk:a11-eeyore:thistles',
        scene: {
          id: 'a11-04-gloomy',
          lines: [
            N('Eeyore, the old grey donkey, stands by himself in a thistly corner of the Forest, with his head on one side.'),
            N('Sometimes he thinks sadly about things. Sometimes he just thinks.'),
            P('Good morning, Eeyore.'),
            E('Good morning, Pooh. If it is a good morning. Which I doubt.', 'sad'),
            P('Why, what’s the matter?'),
            E('Nothing. Nobody minds. Nobody ever does.'),
            N('Pooh walks all the way round Eeyore. Then he walks round again, to be sure.'),
            P('Eeyore. What has happened to your tail?', 'shock'),
            N('Eeyore turns slowly to look, and turns, and turns, and comes back to where he started.'),
            E('You’re right. It’s gone. That explains a great deal.', 'sad'),
            E('Somebody must have taken it. How like them.'),
          ],
          choices: [
            {
              id: 'promise',
              label: 'Promise you’ll help find it.',
              then: [E('Kind of you. Don’t trouble. I expect somebody is using it for something important.')],
            },
            {
              id: 'sit',
              label: 'Sit with him for a moment first.',
              then: [N('You sit in the thistles beside him, which are very prickly. Eeyore notices, and doesn’t say so, which is a sort of thank you.')],
            },
            {
              id: 'look',
              label: 'Look behind the thistles.',
              then: [N('Your Nubbin looks behind the thistles, under a stone and inside its own bow. No tail.')],
            },
          ],
        },
        done: {
          id: 'a11-04-gloomy-done',
          lines: [
            P('I shall find your tail for you, Eeyore. Me. Pooh.'),
            E('Thank you, Pooh. You’re a real friend. Not like some.', 'soft'),
          ],
        },
      },
      {
        id: 'a11-04-s2',
        goal: 'Go with Pooh to ask Owl.',
        hint: 'Owl lives at The Chestnuts, high in a tree, behind the grandest door in the Forest.',
        check: 'visit:a11-owl:chestnuts',
        scene: {
          id: 'a11-04-owl',
          lines: [
            N('Owl lives at The Chestnuts, high in a tree, behind a very grand door with a knocker and a bell-pull.'),
            N('There are two notices by the door, in Owl’s spelling: one says to ring, and the other to knock if the ringing doesn’t work.'),
            N('Pooh knocks and rings. Your Nubbin, who can reach neither, stands on Pooh.'),
            O('Ah, Pooh. And company. How do you do. What can I do for you?'),
            P('Eeyore has lost his tail, and he’s very sad about it. Could you tell me how to find it?'),
            O('Well. In cases of this sort there is a Customary Procedure. First, one Issues a Notice.'),
            P(LIFT_BRAIN, 'sad'),
            O('It means the Thing to Do. Then one offers a Reward. Then one considers the Matter in all its Aspects.'),
            N('Owl talks for some time, in longer and longer words. Pooh nods at the places where nodding seems to be wanted.'),
            N('Your Nubbin isn’t listening. It is looking at the bell-pull, which is grey, and hairy, and has a tuft at the end.'),
          ],
        },
        done: {
          id: 'a11-04-owl-done',
          lines: [
            P('Owl. That bell-pull. Where did you get it?', 'think'),
            O('Came across it in the Forest, hanging on a bush. I gave it a pull to see who was in. Nobody was. It came away in my wing.'),
            P('It belongs to Eeyore. He’s been missing it all morning, and the back of him hasn’t known what to do.'),
          ],
        },
      },
      {
        id: 'a11-04-s3',
        goal: 'Hold the tail straight while Christopher Robin nails it back on.',
        hint: 'Carry the tail back to the thistles and hold it where Christopher Robin points.',
        check: 'place:a11-tail:eeyore',
        scene: {
          id: 'a11-04-nail',
          lines: [
            N('You carry the tail back through the Forest, very carefully, as if it might wake up.'),
            N('Christopher Robin meets you at the thistles with a little hammer and one very short nail.'),
            CR('Hold it straight. Not that straight. There. Eeyore, this won’t hurt. It’s a very small nail.'),
            E('Don’t mind me. Nobody does.'),
            N('Tap, tap: Eeyore doesn’t flinch. Your Nubbin flinches for him, both times.'),
            N('Then Eeyore swishes his tail, carefully, like somebody trying a new door.'),
            E('Hm. It works. Not that anybody asked.'),
            N('He swishes it again, and frisks about among the thistles. He is happy, though he would rather you didn’t mention it.'),
          ],
        },
        done: {
          id: 'a11-04-nail-done',
          lines: [E('Thank you, Pooh. And the one with the bow. Thank you.', 'soft')],
        },
      },
    ],
    complete: {
      id: 'a11-04-complete',
      lines: [
        N('Pooh walks home feeling that he has done a Good Deed, which he has.'),
        N('He feels so pleased that he is ready for a little something by eleven o’clock. So he has one.'),
        P('Owl knows ever such a lot. Long words and everything. But it was your Nubbin who looked at the bell-pull.', 'happy'),
        N('Your Nubbin looks proud. Then, to be safe, it looks for every other bell-pull in the Forest, and there aren’t any.'),
      ],
    },
    rewards: [],
    sets: { 'a11-04': true },
    childLines: {
      'a11-04-owl#6': 'I’m only a small bear, Owl, and big words make my head go fuzzy.',
    },
    notes:
      'Owl’s two notices are drawn as hand-lettered signs in our own misspelling (not Milne’s wording); keep them ' +
      'unreadable at phone size. The nailing is off-screen behind Eeyore: show the hammer rising and a “tap” sound only. ' +
      'The “sit” choice in a11-04-gloomy is a foreshadow of A11-6 and sets nothing.',
  },

  // ---------------------------------------------------------------- A11-5
  {
    id: 'a11-05',
    code: 'A11-5',
    title: 'The Heffalump Trap',
    source: 'Winnie-the-Pooh (1926), ch. V: Piglet meets a Heffalump',
    audience: 'all',
    trigger: { where: WHERE, when: after('A11-4') },
    requires: ['A11-4'],
    speakers: [CROBIN, PIGLET, POOH],
    steps: [
      {
        id: 'a11-05-s1',
        goal: 'Help Pooh and Piglet dig a Very Deep Pit by the Six Pine Trees.',
        hint: 'Dig where Pooh points; Piglet supervises the supervising.',
        check: 'build:a11-pit:six-pines',
        scene: {
          id: 'a11-05-dig',
          lines: [
            CR('I saw a Heffalump today. I think.'),
            N('Christopher Robin says it carelessly, the way you might mention rain, and then goes home to his lunch.'),
            PG('A Heffalump. Here. Pooh, what does one do with a Heffalump?', 'shock'),
            P('Catch it. In a Very Deep Pit. A cunning one, near where Heffalumps walk. The Six Pine Trees, I should think.', 'think'),
            N('Piglet digs and Pooh supervises. You do most of it, and your Nubbin moves one pebble a long way, very proudly.'),
            PG('Won’t the Heffalump see the pit?'),
            P('We cover it with sticks and leaves. And at the bottom we put something it likes, so it comes.'),
            PG('What do Heffalumps like?'),
            P('Honey.', 'happy'),
            PG('Are you sure?'),
            P('Everybody likes honey.'),
          ],
          choices: [
            {
              id: 'then',
              label: 'Ask what they’ll do once it’s caught.',
              then: [P('Be very polite to it, I expect. It’ll be cross otherwise.'), PG('Oh, d-dear.', 'shock')],
            },
            {
              id: 'step',
              label: 'Dig a little step in one side, in case.',
              then: [
                PG('A step? For the Heffalump?'),
                Y('For anyone who falls in by mistake.'),
                P('Very sensible. Nobody will.'),
              ],
            },
            {
              id: 'deep',
              label: 'Check it’s deep enough.',
              then: [N('You climb in to look, and it comes up to your chin. Your Nubbin, at the top, looks down at you as if you are the Heffalump.')],
            },
          ],
        },
        done: {
          id: 'a11-05-dig-done',
          lines: [N('Pooh fetches his very last jar of honey and lowers it into the pit. He looks at it for some time after.')],
        },
      },
      {
        id: 'a11-05-s2',
        goal: 'Keep the lantern steady while Pooh checks on the honey in the night.',
        hint: 'Walk with Pooh to the Six Pine Trees and hold the lantern still.',
        check: 'carry:a11-lantern:six-pines',
        scene: {
          id: 'a11-05-night',
          lines: [
            N('That night Pooh can’t sleep. He tries counting sheep, but they keep turning into Heffalumps, and all of them are eating his honey.'),
            P('Who’s there? Oh, it’s you. Good. I am going to see if the honey is still there. Only to see. Will you hold the lantern?', 'think'),
            N('You walk to the Six Pine Trees with the lantern. Your Nubbin walks inside the circle of light and won’t step out of it.'),
            N('The honey is still there. Pooh climbs down into the pit and looks at it closely, the way you’d look at an old friend.'),
            P('I’ll just check it’s honey all the way down. It might be cheese at the bottom. You never know with jars.'),
            N('He puts his head in to look, and licks, to be sure. Then he licks further in.'),
            P('Mmff. Mmff mff.', 'shock'),
            N('Pooh stands up in the bottom of the pit with the jar on his head.'),
          ],
          choices: [
            {
              id: 'steady',
              label: 'Hold the lantern steady and wait.',
              then: [N('You hold it steady. It trembles only once, because you are laughing, and you stop, because you mustn’t.')],
            },
            {
              id: 'pull',
              label: 'Try to pull the jar off.',
              then: [N('It won’t come, because Pooh’s ears are on the inside. This will have to be a morning job.')],
            },
          ],
        },
        done: {
          id: 'a11-05-night-done',
          lines: [N('Pooh climbs out somehow and wanders off into the grey morning, booming inside the jar.')],
        },
      },
      {
        id: 'a11-05-s3',
        goal: 'Let Piglet meet the Heffalump. Don’t explain.',
        hint: 'Stay by the pit with the lantern and let the morning happen.',
        check: 'wait:a11-piglet:six-pines',
        scene: {
          id: 'a11-05-morning',
          lines: [
            N('At first light Piglet comes to see if there is a Heffalump in the pit. He comes very quietly, and very slowly.'),
            N('There is a Heffalump. It is walking round the pit with a huge round head, and it is roaring.'),
            PG('Help! Help! It’s a Heffalump! And it’s got Pooh’s honey!', 'shock'),
            N('Piglet runs all the way to Christopher Robin’s door without touching the ground more than four times.'),
            N('He comes back with Christopher Robin. You are still there with your lantern, not explaining, because some things are better found out.'),
            N('The Heffalump bangs its head on a tree root. The jar breaks, and there is Pooh, sticky and very pleased to see everyone.'),
            N('Christopher Robin begins to laugh, and laughs, and can’t stop.'),
            PG('…Oh. It was Pooh.', 'sad'),
          ],
        },
        done: {
          id: 'a11-05-morning-done',
          lines: [
            N('Piglet goes home to bed with a headache. Pooh goes home to breakfast.'),
            N('Your Nubbin keeps one piece of the broken jar: the piece with a little honey left on it.'),
          ],
        },
      },
    ],
    complete: {
      id: 'a11-05-complete',
      lines: [
        P('I did think, for a moment, that I might be a Heffalump. It was very dark and echoey in there.'),
        CR('You’re not. You were a bear in a jar. That’s much better.'),
        P('Then who is the Heffalump?', 'think'),
        N('Everyone looks at your Nubbin. Your Nubbin looks behind itself again.'),
        P('A very small one. I’m nearly sure.'),
      ],
    },
    rewards: [],
    sets: { 'a11-05': true },
    notes:
      'Night scene lit by your lantern only. The “Heffalump” is Pooh with a jar on his head, seen in silhouette ' +
      'against the dawn so the reveal works; never draw a Heffalump. The pit stays on the map (A11-13 uses it). ' +
      'The “step” choice sets nothing.',
  },

  // ---------------------------------------------------------------- A11-6
  {
    id: 'a11-06',
    code: 'A11-6',
    title: 'Eeyore’s Birthday',
    source: 'Winnie-the-Pooh (1926), ch. VI: Eeyore has a birthday and gets two presents',
    audience: 'all',
    trigger: { where: WHERE, when: after('A11-5') },
    requires: ['A11-5'],
    speakers: [EEYORE, POOH, PIGLET, CROBIN],
    steps: [
      {
        id: 'a11-06-s1',
        goal: 'Find out why Eeyore is gloomier than usual.',
        hint: 'Eeyore is down by the stream, looking at himself in the water.',
        check: 'talk:a11-eeyore:stream',
        scene: {
          id: 'a11-06-stream',
          lines: [
            N('Eeyore is standing by the stream, looking at himself in the water.'),
            E('Look at him down there. Even the reflection’s glum, and it doesn’t have to be.', 'sad'),
            P('Good morning, Eeyore.'),
            E('Is it? It would be just like it.'),
            N('Pooh hums at him, to be cheerful. Eeyore waits for the hum to finish, politely, as if it were rain.'),
            E('It’s my birthday, as it happens. Not that it matters.'),
            P('Your birthday?', 'shock'),
            E('Of course it is. You can tell by all the presents. All none of them.'),
            N('Pooh looks to the right and to the left, very carefully, in case there are presents he has missed. There aren’t.'),
            P('Wait here, Eeyore.'),
            N('Pooh hurries off home. Your Nubbin stays behind for one moment, looking at Eeyore, and then follows.'),
          ],
        },
      },
      {
        id: 'a11-06-s2',
        goal: 'Go with Pooh and Piglet to fetch presents.',
        hint: 'Carry the honey pot for Pooh as far as he lets you.',
        check: 'carry:a11-pot:hundred-acre',
        scene: {
          id: 'a11-06-presents',
          lines: [
            N('At home, Pooh finds he has a pot of honey, which is the right sort of present for anybody.'),
            N('Piglet has a balloon, a big green one he was saving for something special. This is special.'),
            N('Somewhere on the way, your Nubbin has picked a thistle. It carries it in both paws, prickles and all, and won’t say why.'),
            N('Halfway there, Pooh begins to feel a little eleven o’clock-ish. He sits down and takes the lid off the honey, only to see.'),
            N('He licks the top, and round the edges, and the bottom. Then there is nothing left in the pot.'),
            P('Bother. I had a present, and I’ve eaten it.', 'sad'),
            P('But a pot is a Very Useful Thing. You can put things in it. I shall give him a Useful Pot to Keep Things In.', 'happy'),
            N('Meanwhile Piglet, running to be first, trips in a rabbit-hole and lands flat on his balloon. Bang.'),
            PG('Oh, d-dear. Oh, dear, oh, dear. It was a balloon, and now it’s a bit of damp rag.', 'sad'),
            N('He picks up the bit of damp rag, very sadly, and carries it on to Eeyore’s anyway.'),
          ],
        },
        done: {
          id: 'a11-06-presents-done',
          lines: [N('Your Nubbin looks at the empty pot, and at the rag, and down at its own blue bow, and at the thistle.')],
        },
      },
      {
        id: 'a11-06-s3',
        goal: 'Choose what your Nubbin gives Eeyore.',
        hint: 'There is no wrong present. Nothing at all is one of the choices.',
        check: 'give:a11-eeyore:birthday',
        scene: {
          id: 'a11-06-gift',
          lines: [
            PG('Many happy returns of the day, Eeyore. I’ve brought you a balloon.'),
            E('A balloon? For me?', 'shock'),
            PG('It was a balloon. It got burst. I’m very sorry.', 'sad'),
            P('And I’ve brought you a Useful Pot. To put things in. There’s nothing in it. That’s what makes it so useful.', 'happy'),
            N('Eeyore looks at the pot, and at the rag. Then he picks up the rag in his teeth and drops it in the pot.'),
            N('He takes it out, and puts it back in. He takes it out again.'),
            E('It goes in and out. You wouldn’t think it, but it does.', 'happy'),
            N('Everyone watches Eeyore being happy, which nobody has seen before. Nobody says anything, in case it stops.'),
            N('Your Nubbin steps forward. It has something to give too, or nothing, which is also a thing.'),
          ],
          choices: [
            {
              id: 'ribbon',
              label: 'Your Nubbin gives Eeyore its blue ribbon.',
              set: { 'a11-gift': 'ribbon' },
              then: [
                N('Your Nubbin tugs at its double bow until it comes undone, and lays the blue ribbon at Eeyore’s feet.'),
                E('That’s your Friend ribbon. Christopher Robin tied it. I know what it says.', 'shock'),
                E('Well. I shan’t wear it. I’ll keep it. Somewhere safe. In the pot.', 'soft'),
              ],
            },
            {
              id: 'thistle',
              label: 'Your Nubbin gives him the thistle it carried.',
              set: { 'a11-gift': 'thistle' },
              then: [
                N('Your Nubbin holds out the thistle. It has been prickling its paws every step of the way.'),
                E('The good sort. Purple on top. Somebody carried that a long way, by the look of their paws.', 'soft'),
                E('I shan’t eat it. Not today. I’ll keep it for a bit.'),
              ],
            },
            {
              id: 'sat',
              label: 'Nothing. You both just sit with him.',
              set: { 'a11-gift': 'sat' },
              then: [
                N('You sit down on the bank beside Eeyore, and your Nubbin sits down beside you. Nobody says anything.'),
                N('Pooh and Piglet go home after a while. You stay, and the afternoon goes by slowly, the way they do when nobody hurries them.'),
                E('Hm. Nobody’s done that before. Sat, I mean. Without wanting anything.', 'soft'),
              ],
            },
          ],
        },
        done: {
          id: 'a11-06-gift-done',
          lines: [N('By evening Eeyore is still putting the balloon in the pot and taking it out again. He looks, for Eeyore, almost cheerful.')],
        },
      },
    ],
    complete: {
      id: 'a11-06-complete',
      lines: [
        N('Christopher Robin arrives late with a cake, and everyone has a slice, and Eeyore has the piece with the most icing, under protest.'),
        E('A Useful Pot, a balloon, and cake. People will say I’m spoiled.'),
        P('Will they?'),
        E('No. But they could.'),
        N('Pooh turns out to have another empty pot at home, which is lucky, as he is very good at making them. He gives it to you.'),
        N('Eeyore tears off a corner of balloon to go in it.'),
        E('Every pot wants something to go in and out. Otherwise what’s the point.'),
      ],
    },
    rewards: [
      {
        id: 'a11-useful-pot',
        kind: 'decor',
        label: 'A Useful Pot',
        description: 'An empty honey pot with a scrap of burst balloon in it. Your Nubbins put it in and take it out again.',
      },
    ],
    sets: { 'a11-06': true },
    notes:
      'SIGNATURE CHOICE (a11-06-gift): a11-gift = ribbon | thistle | sat. It pays off in A11-11 (a11-11-door*), ' +
      'A11-16 (sat only, a11-16-bounced-sat), A11-19 (a11-19-scroll*) and A11-20 (a11-20-complete*), and picks the ' +
      'detail on the Grove’s Poohsticks bridge (see A11-20). If ribbon, your Nubbin wears no bow from here on (Atlas ' +
      'save). Piglet’s balloon is green (Milne doesn’t say; not Disney’s red). Useful Pot decor: Nubbins idle by ' +
      'putting the balloon scrap in and out (an idle animation, unlimited, no reward from it).',
  },

  // ---------------------------------------------------------------- A11-7
  {
    id: 'a11-07',
    code: 'A11-7',
    title: 'Kanga and Baby Roo',
    source: 'Winnie-the-Pooh (1926), ch. VII: Kanga and Baby Roo come to the Forest, and Piglet has a bath',
    audience: 'all',
    trigger: { where: WHERE, when: after('A11-6') },
    requires: ['A11-6'],
    speakers: [RABBIT, PIGLET, POOH, ROO, KANGA],
    steps: [
      {
        id: 'a11-07-s1',
        goal: 'Listen to Rabbit’s plan about the newcomers.',
        hint: 'Rabbit is holding a meeting by his front door. He has a list.',
        check: 'talk:a11-rabbit:plan',
        scene: {
          id: 'a11-07-plan',
          lines: [
            N('Nobody knows where they came from, but there they are in the Forest: Kanga, and Baby Roo in her pocket.'),
            R('One morning, nobody. Next morning, a Kanga. Who said she could? And she keeps her child in her pocket!', 'angry'),
            P('Where should she keep it?'),
            R('That’s not the point. Here is the plan. We wait until Kanga isn’t looking. We take Baby Roo, and hide him.'),
            R('Then she says, “Where is Baby Roo?” And we say, “We know where he is.” And she says, “Oh, I see,” and goes away.', 'happy'),
            R('And Piglet jumps into her pocket instead, so she doesn’t notice. Piglet is very small.'),
            PG('V-very small. Yes. Small enough to be b-brave about it.', 'shock'),
            N('Your Nubbin looks at you, and you look at Rabbit. Rabbit is looking at his list.'),
          ],
          choices: [
            {
              id: 'bad',
              label: 'Say it’s a bad plan.',
              then: [
                R('It is a very good plan. It has Steps.'),
                N('There is no stopping a plan once it has Steps.'),
              ],
            },
            {
              id: 'roo',
              label: 'Ask what happens to Roo.',
              then: [
                R('He comes to stay at mine. Briefly. He’ll be quite safe.'),
                N('You decide you will be there when he does.'),
              ],
            },
            {
              id: 'follow',
              label: 'Say nothing, and go along.',
              then: [N('You go along. Somebody should be there who isn’t part of the plan.')],
            },
          ],
        },
        done: {
          id: 'a11-07-plan-done',
          lines: [R('You look after Roo on the way, Keeper. Keep him happy. Happy Roos don’t squeak.')],
        },
      },
      {
        id: 'a11-07-s2',
        goal: 'Make sure Roo has a nice time in Rabbit’s pocket.',
        hint: 'Run alongside Rabbit to his burrow and keep Roo company.',
        check: 'escort:a11-roo:rabbit-burrow',
        scene: {
          id: 'a11-07-swap',
          lines: [
            N('By the Sandy Pit, Kanga is teaching Roo to jump. Pooh distracts her with a very long poem about nothing in particular.'),
            N('While she looks the other way, Rabbit lifts Roo out, and Piglet jumps in, with his eyes shut.'),
            N('Rabbit runs off with Roo in a pillowcase he has made into a pocket for the purpose. You run alongside.'),
            RO('Is this a game? I like games. Am I in a pocket? It’s a different pocket. It smells of carrots.', 'happy'),
            R('Hush. You’re being Hidden. Hidden things are quiet.'),
            RO('Can your Nubbin come in the pocket too?'),
          ],
          choices: [
            {
              id: 'ride',
              label: 'Let your Nubbin ride with Roo.',
              then: [N('Your Nubbin climbs into the pillowcase. Roo laughs so much the pocket wriggles all the way to Rabbit’s.')],
            },
            {
              id: 'count',
              label: 'Count the trees with Roo as they go by.',
              then: [RO('One, two, lots, lots, lots, lots, lots, home!', 'happy')],
            },
            {
              id: 'story',
              label: 'Tell Roo a story.',
              then: [RO('Is there a Roo in it?'), Y('There is now.'), RO('Good. Make him jump a lot.', 'happy')],
            },
          ],
        },
        done: {
          id: 'a11-07-swap-done',
          lines: [N('At Rabbit’s, Roo practises jumping off the front step. Rabbit pretends not to count the jumps, and counts them anyway.')],
        },
      },
      {
        id: 'a11-07-s3',
        goal: 'Go back and see how Piglet is getting on.',
        hint: 'Kanga’s house is by the Sandy Pit.',
        check: 'visit:a11-kanga:sandy-pit',
        scene: {
          id: 'a11-07-bath',
          lines: [
            N('At Kanga’s house, Kanga has noticed. Kangas always notice.'),
            K('Bath-time, Roo dear.', 'soft'),
            N('She says it to Piglet, looking straight at Piglet, and runs the bath anyway.'),
            PG('I’m not Roo! I’m Piglet!', 'shock'),
            K('Of course you are, dear. And the water’s lovely and cold.', 'happy'),
            N('Kanga scrubs Piglet very thoroughly, and gives him a big spoonful of Strengthening Medicine.'),
            PG('Ugh. I’m Piglet. Ask anyone. Ask the Keeper.'),
            N('You open your mouth. Kanga catches your eye over Piglet’s head, and you close it again: she knows, and she is enjoying herself.'),
            N('Piglet escapes the towel at last, rolls in the road to get his own colour back, and runs home.'),
          ],
        },
        done: {
          id: 'a11-07-bath-done',
          lines: [N('Kanga collects Roo from Rabbit’s with a smile that says she has known all along. Rabbit says he was only borrowing.')],
        },
      },
    ],
    complete: {
      id: 'a11-07-complete',
      lines: [
        R('Well. She can stay. I suppose. Roo jumps very well, for a Roo.', 'think'),
        N('Kanga is friendly to everybody from then on, and Rabbit is friendly back, a bit stiffly, like a new shoe.'),
        RO('Can I go in the pillowcase again? Can your Nubbin come?', 'happy'),
        K('Thank you for keeping an eye on him, dear. I knew somebody was.', 'soft'),
      ],
    },
    rewards: [],
    sets: { 'a11-07': true },
    notes:
      'Rabbit’s plan is comic and nobody is ever frightened: Roo thinks it is a game throughout, and Kanga is in on ' +
      'the joke from the start (play her knowing look in a11-07-bath#7 as a close-up). Pooh’s poem is heard as a ' +
      'murmur only. The bath is cold water, a scrub and a spoon of medicine; Piglet is cross, not hurt.',
  },

  // ---------------------------------------------------------------- A11-8
  {
    id: 'a11-08',
    code: 'A11-8',
    title: 'The Expotition',
    source: 'Winnie-the-Pooh (1926), ch. VIII: Christopher Robin leads an expotition to the North Pole',
    audience: 'all',
    trigger: { where: WHERE, when: after('A11-7') },
    requires: ['A11-7'],
    speakers: [CROBIN, POOH, EEYORE, RABBIT, PIGLET, ROO, KANGA],
    steps: [
      {
        id: 'a11-08-s1',
        goal: 'Join Christopher Robin’s Expotition to the North Pole.',
        hint: 'Christopher Robin is outside his house, in his Big Boots.',
        check: 'talk:a11-cr:expotition',
        scene: {
          id: 'a11-08-setoff',
          lines: [
            N('Christopher Robin is putting on his Big Boots, which means an Adventure.'),
            CR('We’re going on an Expotition. All of us. To discover the North Pole.'),
            P('Oh. What is the North Pole?', 'think'),
            CR('It’s… a thing. At the North. You’ll know it when you find it.'),
            N('Everyone comes: Rabbit and all his friends-and-relations, Kanga and Roo, Owl, Piglet, and Eeyore last, being last.'),
            E('Nobody told me. Well, somebody did. But not properly.'),
            R('Single file! And look out for Ambushes!'),
            P('Is an Ambush a sort of gorse-bush?'),
            PG('I th-think it’s worse.', 'shock'),
            N('Your Nubbin marches between Pooh and Piglet in single file, which it takes very seriously.'),
          ],
          choices: [
            {
              id: 'back',
              label: 'Walk at the back with Eeyore.',
              then: [E('Somebody has to bring up the rear. It might as well be the ones nobody notices.')],
            },
            {
              id: 'front',
              label: 'Walk at the front with Christopher Robin.',
              then: [CR('Good. You can look out for the Pole.')],
            },
            {
              id: 'ambush',
              label: 'Look out for Ambushes.',
              then: [N('You look out for Ambushes. You find two gorse-bushes, a fallen log and Owl.')],
            },
          ],
        },
      },
      {
        id: 'a11-08-s2',
        goal: 'Help get Roo out of the stream.',
        hint: 'Take the other end of Pooh’s pole and hold it across the water.',
        check: 'carry:a11-pole:stream',
        scene: {
          id: 'a11-08-roo',
          lines: [
            N('By a pool in the stream everyone stops for lunch. Roo washes his face and paws, to show Kanga he can.'),
            N('Then Roo falls in, with a small splash, and the water carries him off.'),
            RO('Kanga, look! I’m swimming! Am I swimming? I am!', 'happy'),
            K('Are you all right, Roo dear?', 'shock'),
            N('Eeyore turns round and dangles his tail in for Roo to hold. Owl explains how important it is not to panic.'),
            N('Your Nubbin, who doesn’t mind getting wet, is in at once, paddling beside Roo like a small furry float.'),
            N('Pooh has found a long pole. He holds it across the stream lower down, and you take the other end.'),
            N('Roo bumps into the pole, and holds on, and the two of you lift him out, dripping and delighted.'),
          ],
        },
        done: {
          id: 'a11-08-roo-done',
          lines: [
            RO('Did you see me swimming? Did you?', 'happy'),
            K('We did, dear. Now come and be dried.', 'soft'),
          ],
        },
      },
      {
        id: 'a11-08-s3',
        goal: 'Help Christopher Robin mark the spot.',
        hint: 'Push the pole into the bank where Christopher Robin points.',
        check: 'place:a11-pole:stream',
        scene: {
          id: 'a11-08-pole',
          lines: [
            CR('Pooh. Do you know what you’re holding?', 'think'),
            P('A pole. A wet one.'),
            CR('It’s the North Pole. We’ve discovered it. Well, you have.', 'happy'),
            P('Oh!', 'shock'),
            N('Pooh looks at the pole as if he ought to have recognised it.'),
            N('Christopher Robin pushes the pole into the bank, and writes a notice on it saying who found it, spelled about as well as you’d expect.'),
            E('I’ve had my tail in a pool for ten minutes. Nobody noticed. It’s gone numb. But don’t mind me.', 'sad'),
            CR('Oh, Eeyore. Here, let me dry it.'),
          ],
        },
        done: {
          id: 'a11-08-pole-done',
          lines: [N('Everyone walks home in a long happy line, with Roo asleep on Kanga, and Pooh walking very upright, the way discoverers do.')],
        },
      },
    ],
    complete: {
      id: 'a11-08-complete',
      lines: [
        CR('There were two poles, really. This is the spare. Every Expotition needs somewhere to hang its hat afterwards.'),
        N('He gives you a shorter pole with a forked top, which has been, all along, a perfectly good hat-stand.'),
        P('Did I really discover it?'),
        CR('You did.'),
        P('I thought it would be bigger. But it’s very nice.', 'happy'),
      ],
    },
    rewards: [
      {
        id: 'a11-expotition-pole',
        kind: 'decor',
        label: 'Expotition Pole',
        description: 'A forked pole with a hand-lettered notice on it. Hang a hat on it. Your Nubbins like to stand under it and look North.',
      },
    ],
    sets: { 'a11-08': true },
    notes:
      'Water safety: Roo is never in trouble for more than two lines, and the stream is shallow and slow. The notice ' +
      'on the pole is our own lettering, unreadable at phone size (not Milne’s wording). Owl and the friends-and-' +
      'relations walk in the line but have no lines here.',
  },

  // ---------------------------------------------------------------- A11-9
  {
    id: 'a11-09',
    code: 'A11-9',
    title: 'Entirely Surrounded by Water',
    source: 'Winnie-the-Pooh (1926), ch. IX: Piglet is entirely surrounded by water',
    audience: 'all',
    trigger: { where: WHERE, when: after('A11-8') },
    requires: ['A11-8'],
    speakers: [PIGLET, POOH, CROBIN],
    steps: [
      {
        id: 'a11-09-s1',
        goal: 'Find out where Piglet is, in all this rain.',
        hint: 'Watch the flood from the high bank across from Piglet’s beech tree.',
        check: 'explore:a11-flood:high-bank',
        scene: {
          id: 'a11-09-rain',
          lines: [
            N('The rain comes down all day, and all night, and all the next day. Then it keeps going.'),
            N('The stream climbs over its banks and the Forest fills up, until the low places are ponds and the ponds are lakes.'),
            N('Piglet’s house is in the middle of a beech tree, and the beech tree is in the middle of the water.'),
            PG('Everyone else will be all right. Pooh can float. Owl can fly. Kanga can jump. And I’m just… small. And wet.', 'sad'),
            N('He finds a bottle, a pencil and a scrap of paper. He writes HELP, then his name, then that it is him, in case anyone wonders.'),
            N('He corks the bottle and throws it as far as he can, which is not very far, and watches it float away.'),
            N('You and your Nubbin, up on the high bank, see the bottle go by.'),
          ],
        },
        done: {
          id: 'a11-09-rain-done',
          lines: [N('You follow it along the bank. It bobs all the way to where Pooh is sitting on a branch above his own front door, with his honey.')],
        },
      },
      {
        id: 'a11-09-s2',
        goal: 'Help Pooh get the message to Christopher Robin.',
        hint: 'Paddle the wash-tub alongside the Floating Bear to the hill where Christopher Robin lives.',
        check: 'deliver:a11-bottle:cr-hill',
        scene: {
          id: 'a11-09-bear',
          lines: [
            P('A bottle with a letter in. I can’t read it, except the P. P is for Pooh, so it must be for me.', 'think'),
            P('Christopher Robin can read. I must get to him. But he’s on the high ground, and I’m on a branch.'),
            N('Pooh thinks. Then he takes his largest empty jar, lays it on the water, and climbs aboard.'),
            N('It turns over at once. Pooh tries again, the other way up, and sits on top, and it floats.'),
            P('This is my boat. It’s called the Floating Bear. Mostly it floats. Sometimes it’s mostly Bear.', 'happy'),
            N('You find Christopher Robin’s old wash-tub caught in a bush, and climb in, and paddle with your hands.'),
            N('Your Nubbin rides on your head, well out of the wet. It would be happy to swim, but today you’d rather it didn’t.'),
          ],
          choices: [
            {
              id: 'close',
              label: 'Paddle close enough to grab him.',
              then: [N('Twice the Floating Bear turns over, and twice you push it back up. Pooh carries on as if nothing has happened.')],
            },
            {
              id: 'tow',
              label: 'Tow him with a bit of string.',
              then: [P('A tow! Like a proper ship. I shall sit very still and be steered.', 'happy')],
            },
          ],
        },
        done: {
          id: 'a11-09-bear-done',
          lines: [N('You bump into the hill where Christopher Robin lives. It is an island now, with a boy on it.')],
        },
      },
      {
        id: 'a11-09-s3',
        goal: 'Sail The Brain of Pooh to Piglet’s tree.',
        hint: 'Keep your wash-tub beside the umbrella, and look out for Piglet’s window.',
        check: 'escort:a11-brain-of-pooh:beech',
        scene: {
          id: 'a11-09-umbrella',
          lines: [
            CR('It says help. It’s from Piglet. He’s stuck in his tree, and the water’s still coming up. We need a boat.'),
            CR('The Floating Bear isn’t big enough for two. And I’m much too big for a jar.'),
            P('Your umbrella is a sort of bowl, if you turn it over. And a bowl is a sort of boat.', 'think'),
            N('Christopher Robin looks at Pooh for a long moment. Then he opens his umbrella and sets it upside down on the water.'),
            N('It floats, and wobbles, and holds. Christopher Robin climbs in, and then Pooh, and it holds them both.'),
            CR('I name this ship The Brain of Pooh. Because it was your idea.', 'happy'),
            P('The Brain of Pooh. Oh.', 'soft'),
            N('Off they go, slowly, turning round and round, with you paddling alongside and your Nubbin as lookout.'),
          ],
        },
        done: {
          id: 'a11-09-umbrella-done',
          lines: [
            N('Piglet is at his window, very small and very wet. When he sees The Brain of Pooh, he jumps up and down.'),
            PG('Pooh! Christopher Robin! And the Keeper! You came!', 'happy'),
          ],
        },
      },
    ],
    complete: {
      id: 'a11-09-complete',
      lines: [
        N('Piglet climbs down into the umbrella, and it holds three, just. The ship turns round twice and heads for home.'),
        PG('I knew somebody would come. I didn’t know it would be a bear on a jar and a boy in an umbrella.'),
        CR('It was Pooh’s idea. All of it.'),
        P('Was it? It was a very good idea. I must have more of them.', 'happy'),
        N('Your Nubbin, on your head, sneezes once. It is the driest thing for miles.'),
      ],
    },
    rewards: [],
    sets: { 'a11-09': true },
    notes:
      'LIFTED TEXT: none. Milne’s “It rained and it rained and it rained.” is [unverified] in Part M, so a11-09-rain#0 ' +
      'tells it in our own words; swap in the verbatim line only if it is verified against PG #67098 ch. IX. Piglet’s ' +
      'message is never shown as text (describe it). Flood safety: everyone is on high ground or afloat and calm; no ' +
      'one goes under. The flood is a lake of soft pencil-grey water with trees standing in it.',
  },

  // ---------------------------------------------------------------- A11-10
  {
    id: 'a11-10',
    code: 'A11-10',
    title: 'The Pooh Party',
    source: 'Winnie-the-Pooh (1926), ch. X: Christopher Robin gives a Pooh party',
    audience: 'all',
    trigger: { where: WHERE, when: after('A11-9') },
    requires: ['A11-9'],
    speakers: [CROBIN, OWL, EEYORE, RABBIT, POOH],
    steps: [
      {
        id: 'a11-10-s1',
        goal: 'Help Owl tell everyone about the party.',
        hint: 'Go round the Forest with Owl, and tell everyone again in words they can follow.',
        check: 'deliver:a11-invitations:forest',
        scene: {
          id: 'a11-10-invites',
          lines: [
            CR('Owl, fly round to everybody and tell them there’s a party. For Pooh. Because of what he did, saving Piglet.'),
            O('A party. Very good. I shall Announce it.'),
            N('Owl flies off to tell everyone, and you go too, to tell everyone again in shorter words.'),
            N('At the Gloomy Place, Owl tells Eeyore. Eeyore nods slowly, and stops listening halfway.'),
            E('A party. For me. Well. Fancy that. Better late than never, I suppose.', 'think'),
            O('No, it is for…'),
            N('But Eeyore has turned away to think about it, and Owl has a great many more trees to visit.'),
          ],
          choices: [
            {
              id: 'tell',
              label: 'Tell Eeyore it’s for Pooh.',
              then: [E('Is it. Well. Somebody’s party. I’ll come anyway, if I’m wanted. Which I doubt.')],
            },
            {
              id: 'seat',
              label: 'Tell him there’ll be a seat for him.',
              then: [
                E('A seat. At the end, I expect.'),
                Y('Wherever you like.'),
                E('…The end. I like the end. You can see who’s leaving.'),
              ],
            },
          ],
        },
      },
      {
        id: 'a11-10-s2',
        goal: 'Set the long table, and save Eeyore a seat at the end.',
        hint: 'Lay the plates down the long table, then put a cushion on the last chair.',
        check: 'place:a11-table:eeyore-seat',
        scene: {
          id: 'a11-10-table',
          lines: [
            N('Christopher Robin has made a long table out of some long pieces of wood, out in the open, and everyone helps lay it.'),
            N('You lay the plates. Your Nubbin puts one leaf on each plate, very exactly, as a napkin.'),
            R('Not there! Owl at the top, because he’s Owl. Then Kanga, then me, then my friends-and-relations, all of them…'),
            N('Rabbit organises the seats until there aren’t any left. There is one chair at the very end, where Rabbit hasn’t looked.'),
            N('You put a cushion on it, and a card that says EEYORE in your best letters.'),
            E('A place. At the end. With my name on. I didn’t ask.', 'soft'),
            E('…The cushion’s a nice touch.'),
            N('Everyone sits. There is a great deal of eating, and Roo talks with his mouth full, and nobody minds.'),
          ],
        },
        done: {
          id: 'a11-10-table-done',
          lines: [
            CR('Everybody! This party is because of what somebody did, and we all know who.'),
            N('Eeyore half stands up to make a speech. Then Christopher Robin hands Pooh a present, and Eeyore sits down again.'),
          ],
        },
      },
    ],
    complete: {
      id: 'a11-10-complete',
      lines: [
        N('Pooh’s present is a Special Pencil Case. Inside are pencils marked B, for Bear, and HB, for Helping Bear, and BB, for Brave Bear.'),
        P('Oh!', 'happy'),
        N('Pooh can’t write, but he looks at every pencil, one at a time, and is very happy.'),
        E('Pencils. Hm. When I was young we had sticks. You could do a great deal with a stick.'),
        N('Walking home, Pooh and Piglet don’t say anything for a long time. It is the friendly kind of quiet.'),
      ],
    },
    rewards: [],
    sets: { 'a11-10': true },
    notes:
      'The long table is the image the Long Table festival grows from (A11-20’s bookmark): draw it as one long ' +
      'trestle in the open with mismatched chairs, Eeyore’s cushion at the far end. Eeyore’s “sticks” line sets up ' +
      'his A in A11-15.',
  },

  // ---------------------------------------------------------------- A11-11
  {
    id: 'a11-11',
    code: 'A11-11',
    title: 'A House at Pooh Corner',
    source: 'The House at Pooh Corner (1928), ch. I: a house is built at Pooh Corner for Eeyore',
    audience: 'all',
    trigger: { where: WHERE, when: after('A11-10') },
    requires: ['A11-10'],
    speakers: [POOH, PIGLET, EEYORE, CROBIN],
    steps: [
      {
        id: 'a11-11-s1',
        goal: 'Help Pooh and Piglet build Eeyore a house.',
        hint: 'Carry sticks from the heap on the other side of the wood to Pooh Corner.',
        check: 'build:a11-house:pooh-corner',
        scene: {
          id: 'a11-11-snow',
          lines: [
            N('It is snowing, and the Forest is white and soft. Pooh is humming a hum about snow, which gets longer as it goes, like snow does.'),
            N('He goes round to Piglet’s, humming. Piglet is sitting by his fire, warming his toes.'),
            P('I’ve been thinking about Eeyore. He hasn’t got a house. Everybody has a house except him.', 'think'),
            PG('We could build him one. Here, at Pooh Corner. Out of sticks.'),
            N('There is a heap of sticks on the other side of the wood, in a sheltered spot. Nobody seems to be using it.'),
            N('You carry sticks. Your Nubbin carries one stick at a time, the long way round, for reasons of its own.'),
            PG('It’s a very good house. Eeyore will be pleased.'),
            P('Nobody’s ever built him one before.', 'happy'),
          ],
          choices: [
            {
              id: 'wide',
              label: 'Make the doorway wide enough for a donkey.',
              then: [N('You make it wider. Pooh, remembering Rabbit’s, approves of wide doors in general.')],
            },
            {
              id: 'roof',
              label: 'Put a roof on, in case.',
              then: [PG('In case of snow? It already is snow.'), Y('In case of more.'), PG('Oh. Yes. There might be.')],
            },
            {
              id: 'last',
              label: 'Let your Nubbin choose the last stick.',
              then: [N('It chooses a crooked one. It looks right, somehow.')],
            },
          ],
        },
        done: {
          id: 'a11-11-snow-done',
          lines: [N('The house stands at Pooh Corner, a little lopsided, in the snow.')],
        },
      },
      {
        id: 'a11-11-s2',
        goal: 'Go with Christopher Robin and Eeyore to look for Eeyore’s missing house.',
        hint: 'Walk Eeyore through the snow to Pooh Corner.',
        check: 'escort:a11-eeyore:pooh-corner',
        scene: {
          id: 'a11-11-missing',
          lines: [
            N('Meanwhile, at Christopher Robin’s door, Eeyore is standing in the snow, with snow on his back.'),
            E('I don’t want to complain. But it’s snowing, and I built a house, and now it isn’t there.', 'sad'),
            CR('Your house? Where was it?'),
            E('Down by the wood. A house of sticks. I built it myself, in a sheltered spot. I came back and it had gone.'),
            N('You think of a heap of sticks in a sheltered spot. Something goes cold in your middle, and it isn’t the snow.'),
            CR('Let’s go and look. Come on, Keeper.'),
            N('You walk with them through the snow. Your Nubbin walks very close to your boots and doesn’t look anyone in the eye.'),
          ],
        },
        done: {
          id: 'a11-11-missing-done',
          lines: [N('At Pooh Corner there is a house of sticks, standing up in the snow. Pooh and Piglet are admiring it.')],
        },
      },
      {
        id: 'a11-11-s3',
        goal: 'Let Eeyore work it out his own way.',
        hint: 'Stand back and let Eeyore look at the house.',
        check: 'wait:a11-eeyore:pooh-corner',
        scene: {
          id: 'a11-11-wind',
          lines: [
            E('There. That’s my house. It’s here. And I built it there.', 'shock'),
            E('The wind must have done it. Picked it up, all in one piece, over the wood, and set it down here.', 'think'),
            N('Pooh and Piglet look at each other, and then at you. You say nothing, which, all things considered, is the kind thing.'),
            E('And it’s better here. Not so draughty. The wind did a better job than I did.', 'happy'),
            E('Funny thing, wind. You never know.'),
            CR('It’s a lovely house, Eeyore.'),
            E('It is, isn’t it. Better than before. Somebody somewhere must like me. I’d never have thought it.', 'soft'),
          ],
        },
        done: {
          id: 'a11-11-door',
          lines: [
            N('Eeyore goes in, turns round, and comes out again to look at his door.'),
            N('On the latch, tied in a careful double bow, is a blue ribbon. It was in the Useful Pot, and now it is here.'),
            E('Keeps the door from banging. Useful. Like a Friend.', 'soft'),
          ],
        },
      },
    ],
    complete: {
      id: 'a11-11-complete',
      lines: [
        N('Pooh and Piglet walk home in the snow. For a long time neither of them says anything about the sticks.'),
        PG('Pooh. Did we… take Eeyore’s house?'),
        P('We did. And then we gave it back, in a better place. I think that counts.', 'think'),
        PG('I think it counts too.', 'soft'),
        N('Your Nubbin walks behind them in Pooh’s footprints all the way home, which takes a great deal of jumping.'),
      ],
    },
    rewards: [],
    sets: { 'a11-11': true },
    notes:
      'GIFT PAYOFF (a11-gift, set in A11-6). The step 3 done scene shown, a11-11-door, is for ribbon. For thistle ' +
      'play A11_VARIANTS a11-11-door-thistle; for sat play a11-11-door-sat. Pooh’s snow hum is heard as humming only ' +
      '(no words on screen: it is a Milne song). The heap of sticks is visibly Eeyore’s house, fallen in, in step 1.',
  },

  // ---------------------------------------------------------------- A11-12
  {
    id: 'a11-12',
    code: 'A11-12',
    title: 'Tigger Comes to the Forest',
    source: 'The House at Pooh Corner (1928), ch. II: Tigger comes to the Forest and has breakfast',
    audience: 'all',
    trigger: { where: WHERE, when: after('A11-11') },
    requires: ['A11-11'],
    speakers: [POOH, TIGGER, EEYORE, ROO, KANGA],
    steps: [
      {
        id: 'a11-12-s1',
        goal: 'Find out what is making that noise at Pooh’s door.',
        hint: 'You are staying the night at Pooh’s. Open the door.',
        check: 'inspect:a11-noise:pooh-door',
        scene: {
          id: 'a11-12-night',
          lines: [
            N('In the middle of the night, at Pooh’s house, there is a noise. You and your Nubbin, on the sofa, hear it first.'),
            N('It is a growly, wobbly sort of noise: the noise of something very pleased about something.'),
            P('What is it? Is it you?', 'think'),
            N('It isn’t you. Pooh opens the door.'),
            T('Hallo! I’m Tigger. I’ve just come. Is this where everybody is?', 'happy'),
            N('Tigger sees the tablecloth, and has a fight with it, and wins, and is very proud.'),
            N('Then he sees your Nubbin, and bounces it over, gently, to say hello. Your Nubbin bounces back.'),
            T('A small Tigger! Is it a Tigger?'),
            P('It’s a very small Heffalump.'),
            T('Is it? It bounces like a Tigger.'),
          ],
          choices: [
            {
              id: 'breakfast',
              label: 'Offer to help find Tigger some breakfast.',
              then: [T('Breakfast! Tiggers like everything for breakfast. Probably.', 'happy')],
            },
            {
              id: 'cloth',
              label: 'Put the tablecloth back.',
              then: [N('You put it back. Tigger watches it, in case it starts something again.')],
            },
            {
              id: 'where',
              label: 'Ask Tigger where he came from.',
              then: [T('From the Forest. From over there. From just now. Is there breakfast?')],
            },
          ],
        },
        done: {
          id: 'a11-12-night-done',
          lines: [N('In the morning Pooh sets out a pot of honey for Tigger. The very best kind.')],
        },
      },
      {
        id: 'a11-12-s2',
        goal: 'Help Tigger try honey, haycorns and thistles.',
        hint: 'Go from Pooh’s to Piglet’s to Eeyore’s with Tigger.',
        check: 'feed:a11-tigger:breakfast',
        scene: {
          id: 'a11-12-breakfast',
          lines: [
            N('Tigger takes a large mouthful of honey. Then he looks up at the ceiling, with his head on one side.'),
            T(LIFT_HONEY, 'sad'),
            N('Pooh tries to sound sorry. He is secretly relieved, and has the rest himself.'),
            N('So you all go to Piglet’s, where there are haycorns. Tigger takes a large mouthful, and his face goes slowly round.'),
            T('Ee-ugh. They’re all corners. Tiggers don’t do corners.'),
            N('So you go on to Eeyore’s, where there are thistles. Eeyore offers one, the way you offer a thing you hope will be refused.'),
            N('Tigger takes a large mouthful, and sits down, and puts a paw in his mouth, and takes it out again.'),
            T('Ow! Prickly! That’s not a breakfast. That’s a punishment.', 'shock'),
            E('I see. Some of us eat them every day and don’t complain. Much.', 'sad'),
          ],
        },
        done: {
          id: 'a11-12-breakfast-done',
          lines: [P('There’s nobody left but Kanga. She might have something. Kangas usually do.', 'think')],
        },
      },
      {
        id: 'a11-12-s3',
        goal: 'Take Tigger to Kanga’s for one last try.',
        hint: 'Kanga’s house is by the Sandy Pit. Roo is having his medicine.',
        check: 'visit:a11-kanga:breakfast',
        scene: {
          id: 'a11-12-malt',
          lines: [
            N('At Kanga’s house, Roo is having his Strengthening Medicine. He does not want it; he wants anything else.'),
            RO('Do I have to? It’s Extract of Malt. It’s brown, and it sticks to the spoon, and it goes on and on.'),
            K('Just one spoonful, dear. It makes you big and strong.'),
            N('Tigger leans over Roo’s shoulder, sniffs, and takes the whole spoonful.'),
            N('Kanga stares, and Roo stares. Your Nubbin, who has been staring at everything since the thistles, stares harder.'),
            T('That’s it! That’s the one! That’s a Tigger breakfast!', 'happy'),
            RO('He can have mine! All of it! Always!', 'happy'),
            K('Well. I suppose he’d better stay, then. I’ll fetch another spoon.', 'soft'),
          ],
        },
        done: {
          id: 'a11-12-malt-done',
          lines: [N('So Tigger lives at Kanga’s from then on, and has Extract of Malt for breakfast, dinner and tea.')],
        },
      },
    ],
    complete: {
      id: 'a11-12-complete',
      lines: [
        P('So Tiggers like the one thing nobody else does. That’s very handy, really.', 'think'),
        T('And Tiggers like Keepers! And small bouncy whatever-they-ares! Bounce!', 'happy'),
        N('Tigger bounces your Nubbin, gently, right over. It lands on its feet and looks, for the first time, as if it might bounce back on purpose.'),
      ],
    },
    rewards: [],
    sets: { 'a11-12': true },
    childLines: {
      'a11-12-breakfast#1': 'Ugh. Honey is far too sticky for a Tigger.',
    },
    notes:
      'Tigger is an original design: stripes, a long tail he can bounce on, no Disney look or voice, no catchphrases. ' +
      'The night noise is friendly, never scary. Extract of Malt is a real old-fashioned tonic; show a brown jar and ' +
      'a spoon.',
  },

  // ---------------------------------------------------------------- A11-13
  {
    id: 'a11-13',
    code: 'A11-13',
    title: 'The Search for Small',
    source: 'The House at Pooh Corner (1928), ch. III: a search is organised, and Piglet nearly meets the Heffalump again',
    audience: 'all',
    trigger: { where: WHERE, when: after('A11-12') },
    requires: ['A11-12'],
    speakers: [RABBIT, POOH, PIGLET, CROBIN],
    steps: [
      {
        id: 'a11-13-s1',
        goal: 'Get your orders from Captain Rabbit.',
        hint: 'Rabbit has a list, a pencil and a Captain’s face.',
        check: 'talk:a11-rabbit:search',
        scene: {
          id: 'a11-13-orders',
          lines: [
            N('Rabbit is very busy, and likes it. He has a list, and a pencil, and a Captain’s face.'),
            R('Small is missing. One of my friends-and-relations. A very small beetle. Nobody has seen him since yesterday.', 'think'),
            P('What does Small look like?'),
            R('Small.'),
            P('Ah. That helps.'),
            R('Pooh, you search by the Six Pine Trees. Keeper, go with Pooh. Your Nubbin is low to the ground. That’s useful.'),
            R('Everybody is to be Thorough. That means looking under things.'),
            N('Your Nubbin looks under a leaf at once, to show it understands.'),
          ],
          choices: [
            {
              id: 'salute',
              label: 'Salute.',
              then: [R('Good. Good. Somebody here understands organisation.', 'happy')],
            },
            {
              id: 'how',
              label: 'Ask how small, exactly.',
              then: [R('Smaller than that. Smaller than you think. No. Smaller.')],
            },
            {
              id: 'go',
              label: 'Start looking straight away.',
              then: [N('Your Nubbin is already under a stone.')],
            },
          ],
        },
      },
      {
        id: 'a11-13-s2',
        goal: 'Search by the Six Pine Trees, where the old pit is.',
        hint: 'Walk with Pooh to the Six Pine Trees. Mind the pit.',
        check: 'explore:a11-search:six-pines',
        scene: {
          id: 'a11-13-pit',
          lines: [
            N('Pooh walks along thinking about Small, and about honey, but mostly about honey, and doesn’t look where he is going.'),
            N('You remember the pit by the Six Pine Trees. You remember it a moment too late.'),
            N('Pooh disappears with a whump. From down below comes a small, squeaky voice.'),
            PG('Help! Help! Something’s fallen on me! It’s… it’s the Heffalump!', 'shock'),
            P('It isn’t, Piglet. It’s me. I think. I hope.'),
            N('You look over the edge. There is Pooh, and under Pooh there is Piglet, and both of them are looking up at you.'),
            PG('Pooh, what are you doing in the Heffalump trap?'),
            P('Falling in it, mostly. What are you doing?'),
            PG('I was searching. Very Thoroughly. Under things.', 'sad'),
          ],
        },
        done: {
          id: 'a11-13-pit-done',
          lines: [N('Christopher Robin arrives at the top of the pit. He takes one look, and sits down on the edge to laugh.')],
        },
      },
      {
        id: 'a11-13-s3',
        goal: 'Help everyone out of the pit, and look carefully at Pooh.',
        hint: 'Take one of Pooh’s paws while Christopher Robin takes the other.',
        check: 'find:a11-small:pooh-back',
        scene: {
          id: 'a11-13-small',
          lines: [
            CR('Out you come. Pooh, take my hand. Keeper, take his other paw.'),
            N('You heave. Up comes Pooh, and up comes Piglet after him, holding on to Pooh’s leg.'),
            N('Your Nubbin climbs up Pooh to help, stops in the middle of his back, and stares.'),
            N('There, sitting quietly in Pooh’s fur, is a very small beetle, as if it has been waiting all morning for somebody to notice.'),
            CR('Pooh! You’ve found Small!', 'happy'),
            P('Have I? Where was he?'),
            CR('On you.'),
            P('Ah. I thought something was looking at me.'),
          ],
        },
      },
    ],
    complete: {
      id: 'a11-13-complete',
      lines: [
        R('Found! Found by my search, which I organised. Well done, everybody. Especially me.', 'happy'),
        N('Small says nothing, being a beetle, and goes back to his own business, which is very small.'),
        P('I found him without looking. That’s the easiest way.', 'happy'),
        N('Your Nubbin looks under every leaf on the way home anyway, in case there are other beetles who’d like to be found.'),
      ],
    },
    rewards: [],
    sets: { 'a11-13': true },
    notes:
      'Uses the pit from A11-5. Small is a tiny beetle sprite, never a speaker. The fall is a soft comic “whump” onto ' +
      'Piglet; nobody is hurt.',
  },

  // ---------------------------------------------------------------- A11-14
  {
    id: 'a11-14',
    code: 'A11-14',
    title: 'Tiggers Don’t Climb Trees',
    source: 'The House at Pooh Corner (1928), ch. IV: it is shown that Tiggers don’t climb trees',
    audience: 'all',
    trigger: { where: WHERE, when: after('A11-13') },
    requires: ['A11-13'],
    speakers: [ROO, TIGGER, CROBIN, POOH, EEYORE],
    steps: [
      {
        id: 'a11-14-s1',
        goal: 'Follow Tigger and Roo into the Forest.',
        hint: 'They went towards the tall pines with a bag of sandwiches.',
        check: 'walk:a11-tigger:pines',
        scene: {
          id: 'a11-14-climb',
          lines: [
            N('Tigger is taking Roo for a walk, with Kanga’s permission and a bag of malt sandwiches.'),
            RO('Can Tiggers climb trees?'),
            T('Climb trees? Tiggers are the best tree-climbers there are. Better than Poohs.', 'happy'),
            N('Up the tall pine goes Tigger, with Roo on his back, very fast. Your Nubbin sits at the bottom with its head right back.'),
            N('Then Tigger looks down. He looks down for a long time.'),
            T('Tiggers can climb up. That part’s easy. It’s the coming down. It’s not their best thing.', 'shock'),
            RO('We’re stuck! Isn’t it lovely? We’re up a tree!', 'happy'),
          ],
          choices: [
            {
              id: 'call',
              label: 'Call up that help is coming.',
              then: [T('Good! Good. Tiggers aren’t worried. But do hurry.')],
            },
            {
              id: 'company',
              label: 'Send your Nubbin up to sit with them.',
              then: [N('Your Nubbin climbs to the lowest branch, then the next, and sits there, halfway, for company. It can’t do more, and that’s all right.')],
            },
            {
              id: 'run',
              label: 'Run for Christopher Robin.',
              then: [N('You run. Pooh and Piglet are already coming, with Christopher Robin and Eeyore behind.')],
            },
          ],
        },
        done: {
          id: 'a11-14-climb-done',
          lines: [N('Soon everyone is standing at the bottom of the pine, looking up.')],
        },
      },
      {
        id: 'a11-14-s2',
        goal: 'Hold one corner of the tunic while Tigger jumps.',
        hint: 'Pull your corner tight and don’t let go, however long Tigger thinks about it.',
        check: 'place:a11-tunic:pine',
        scene: {
          id: 'a11-14-tunic',
          lines: [
            N('Christopher Robin takes off his tunic and holds it out under the tree like a sheet. Everyone takes an edge.'),
            CR('You take that corner, Keeper. Pull it tight. Pooh, yours is sagging.'),
            P('It isn’t sagging. It’s resting.'),
            CR('Roo first!'),
            N('Roo jumps, squeaking with joy, lands in the middle, and bounces right out and in again.'),
            RO('Again! Can I do it again?', 'happy'),
            CR('No. Now you, Tigger!'),
            T('In a moment. Tiggers like to think about jumping first. For quite a long time.'),
            N('Tigger thinks, and you hold your corner. Your arms begin to ache, and you don’t let go.'),
            N('Then Tigger jumps, all at once, the way he does everything.'),
          ],
        },
        done: {
          id: 'a11-14-tunic-done',
          lines: [
            N('There is a great crash. Everyone falls over in a heap, and somebody at the bottom of the heap says something gloomy.'),
            E('Thank you. I was quite comfortable down here. Nobody need hurry.', 'sad'),
          ],
        },
      },
    ],
    complete: {
      id: 'a11-14-complete',
      lines: [
        T('Did you see me? Tiggers can jump out of trees. It’s a thing they do. Easily.', 'happy'),
        CR('Let’s say it’s a thing they do with help.'),
        N('Christopher Robin puts his tunic back on. It has a Tigger-shaped stretch in the middle now, and he says he likes it better.'),
        N('Your Nubbin finds it can’t get down the last bit of its branch either, and has to be lifted.'),
      ],
    },
    rewards: [],
    sets: { 'a11-14': true },
    notes:
      'The pine is tall but the scene is comic: nobody is ever in danger. The tunic is a plain smock (never a red ' +
      'shirt). The heap is a soft pile-up with Eeyore at the bottom, unhurt.',
  },

  // ---------------------------------------------------------------- A11-15
  {
    id: 'a11-15',
    code: 'A11-15',
    title: 'Rabbit’s Busy Day',
    source: 'The House at Pooh Corner (1928), ch. V: Rabbit has a busy day, and we learn what Christopher Robin does in the mornings',
    audience: 'all',
    trigger: { where: WHERE, when: after('A11-14') },
    requires: ['A11-14'],
    speakers: [RABBIT, OWL, EEYORE, CROBIN],
    steps: [
      {
        id: 'a11-15-s1',
        goal: 'Go with Rabbit to Christopher Robin’s house.',
        hint: 'Rabbit is off to tell Christopher Robin what to do today.',
        check: 'visit:a11-cr:door',
        scene: {
          id: 'a11-15-note',
          lines: [
            N('Rabbit wakes up feeling important, as if everything depends on him. It is a very Captain-ish sort of morning.'),
            R('I shall go and see Christopher Robin. He’ll want to know what to do today, and I shall tell him.'),
            N('But Christopher Robin isn’t at home. There is a note pinned to his door.'),
            N('It says he has gone out, and will be back soon, and is busy. It is in Christopher Robin’s spelling, which is generous with its letters.'),
            R('“Backson.” What is a Backson? Gone out with a Backson? Is it some sort of animal?', 'think'),
            R('I must ask Owl. Owl can read. Owl can spell.'),
          ],
          choices: [
            {
              id: 'again',
              label: 'Read the note again, slowly.',
              then: [N('You read it again, and it doesn’t get any clearer. Some notes are like that.')],
            },
            {
              id: 'seen',
              label: 'Ask Rabbit if he’s ever seen a Backson.',
              then: [R('Certainly not. But that’s just what a Backson would want me to say.', 'think')],
            },
            {
              id: 'sniff',
              label: 'Let your Nubbin sniff the note.',
              then: [N('Your Nubbin sniffs it. It smells of breakfast and pencil.')],
            },
          ],
        },
      },
      {
        id: 'a11-15-s2',
        goal: 'Ask Owl what the note means.',
        hint: 'Take the note to The Chestnuts.',
        check: 'talk:a11-owl:note',
        scene: {
          id: 'a11-15-owl',
          lines: [
            O('Ah. Yes. Let me see.', 'think'),
            N('Owl reads the note upside down, then the right way up, then holds it very far away.'),
            O('A perfectly ordinary message. He has gone out. With a Backson. A busy one, by the look of it.'),
            R('What does a Backson look like?'),
            O('Like any Backson. Large, I should think. With a… with a sort of look about it.'),
            R(LIFT_TUESDAY, 'think'),
            O('Tuesday. T, U… There is an S in it. There’s certainly a Y somewhere.'),
            N('Your Nubbin, who can’t spell anything, looks at Owl with great respect too.'),
          ],
        },
        done: {
          id: 'a11-15-owl-done',
          lines: [R('Eeyore. Eeyore might have seen it. He sees most things, and complains about them.')],
        },
      },
      {
        id: 'a11-15-s3',
        goal: 'Ask Eeyore, who has been learning something with sticks.',
        hint: 'Eeyore is standing over three sticks in the Gloomy Place.',
        check: 'inspect:a11-sticks:gloomy-place',
        scene: {
          id: 'a11-15-a',
          lines: [
            N('Eeyore is standing over three sticks laid on the ground: two lean together at the top, and one goes across the middle.'),
            E('Do you know what that is? It’s an A. I made it. Nobody else in the Forest knows that.', 'think'),
            R('It’s an A. Of course it is. Everybody knows that.'),
            N('Rabbit says it airily, and Eeyore’s ears go down.'),
            E('Everybody. Oh. I thought it was something. Learning.', 'sad'),
            N('You crouch down by the sticks with your Nubbin, and look at the A properly, the way it deserves.'),
            E('Christopher Robin taught me it. He goes out in the mornings now. To learn things. Then he comes and tells me one.'),
            R('Learn? Then the Backson is… Christopher Robin is… Oh.', 'think'),
            N('Rabbit stands very still. It is the first time today he hasn’t been busy.'),
          ],
        },
        done: {
          id: 'a11-15-a-done',
          lines: [E('Somebody has to look after the A. In case he forgets it, wherever he goes to learn the others.', 'soft')],
        },
      },
    ],
    complete: {
      id: 'a11-15-complete',
      lines: [
        N('Christopher Robin comes home at lunchtime with ink on his fingers and a great many new words, some of them spelled right.'),
        CR('Hallo! Did you see my note? I said I’d be back soon. And I am.', 'happy'),
        N('He is. But Rabbit walks home slowly, thinking about mornings, and doesn’t organise anything for the rest of the day.'),
        N('Your Nubbin stands guard over Eeyore’s A until Eeyore says it can go.'),
      ],
    },
    rewards: [],
    sets: { 'a11-15': true },
    childLines: {
      'a11-15-owl#5': 'Owl may not know what a Backson is. But anyone who can spell the days of the week deserves a little respect.',
    },
    notes:
      'Christopher Robin’s note is never shown as text (describe it; Milne’s wording is not used). Nobody says ' +
      '“school”. The quest’s quiet turn is Rabbit standing still in a11-15-a#8: hold the frame a beat. TUESDAY in ' +
      'capitals is Milne’s.',
  },

  // ---------------------------------------------------------------- A11-16
  {
    id: 'a11-16',
    code: 'A11-16',
    title: 'Poohsticks',
    source: 'The House at Pooh Corner (1928), ch. VI: Pooh invents a new game and Eeyore joins in',
    audience: 'all',
    trigger: { where: WHERE, when: after('A11-15') },
    requires: ['A11-15'],
    speakers: [POOH, CROBIN, ROO, PIGLET, EEYORE, TIGGER],
    steps: [
      {
        id: 'a11-16-s1',
        goal: 'Watch Pooh invent a game on the bridge.',
        hint: 'Pooh is on the little wooden bridge with a fir-cone.',
        check: 'watch:a11-pooh:bridge',
        scene: {
          id: 'a11-16-cone',
          lines: [
            N('Pooh is crossing the bridge with a fir-cone, thinking of a hum. He trips over nothing, and the fir-cone drops into the river.'),
            P('Bother.'),
            N('He goes to the other side to watch it float away. It comes out from under the bridge, which surprises him.'),
            P('That’s interesting. I dropped it on that side and it came out on this one. I wonder if it would do it again.', 'think'),
            N('He drops two fir-cones at once, a big one and a small one, and runs across. The big one comes out first.'),
            P('The big one won! I wanted the big one to win.', 'happy'),
            N('Fir-cones are hard to tell apart, so he goes on with sticks. That is how the game of Poohsticks begins.'),
          ],
        },
      },
      {
        id: 'a11-16-s2',
        goal: 'Play Poohsticks with everyone on the bridge.',
        hint: 'Drop your stick on “now”, then run to the other side to see whose comes out first.',
        check: 'minigame:a11-poohsticks:bridge',
        scene: {
          id: 'a11-16-game',
          lines: [
            N('Soon everyone is playing: Pooh and Piglet, Rabbit and Roo, you and your Nubbin.'),
            CR('Everybody drop on “now”. Then everybody run to the other side. And no pushing, Roo.'),
            N('Your Nubbin drops its stick. Then, before anyone can stop it, it drops itself in after it.'),
            N('It swims along beside its stick under the bridge, nudging it with its nose, in no hurry, enjoying the wet.'),
            RO('That’s not fair! Is it fair? Can I do that?'),
            CR('No, Roo.'),
            P('I think it’s fair. Nothing in the game says you can’t go with your stick. I should have thought of it.', 'think'),
            N('Your Nubbin’s stick comes out first, and so does your Nubbin, very pleased and very wet. It shakes itself all over Piglet.'),
            PG('Oh! Oh, d-dear. Woozles shake like that. I’m nearly sure.', 'shock'),
          ],
          choices: [
            {
              id: 'counts',
              label: 'Let it count.',
              then: [P('It counts. It’s my game, so I say.', 'happy')],
            },
            {
              id: 'not',
              label: 'Say it shouldn’t count.',
              then: [P('Then it won the next best thing, which is getting wet on purpose.')],
            },
            {
              id: 'mine',
              label: 'Drop your own stick and run.',
              then: [N('Your stick comes out last. Some sticks just like the view.')],
            },
          ],
        },
      },
      {
        id: 'a11-16-s3',
        goal: 'Help Pooh wash Eeyore to the bank.',
        hint: 'Help lift the big stone to the rail and drop it beside Eeyore, not on him.',
        check: 'carry:a11-stone:bridge',
        scene: {
          id: 'a11-16-eeyore',
          lines: [
            N('Then something big and grey comes out from under the bridge. It is Eeyore, floating on his back, upside down, looking calm.'),
            E('Don’t mind me. I’m just being upside down in a river. It’s very restful. Nobody should bother.', 'sad'),
            CR('Eeyore, what are you doing there?'),
            E('Floating. In a river. On my back. Not by choice, if anybody wondered. Nobody did.'),
            P('If I drop a big stone in beside him, it will make a wave, and the wave will wash him to the bank.', 'think'),
            PG('What if you hit him?'),
            P('I won’t. Probably.'),
            N('The stone is too big for Pooh. You help him lift it, and your Nubbin pushes from underneath, and you hold it over the rail.'),
            P('Now!'),
            N('Splash: a great wave. Eeyore disappears, comes up, rolls over, and walks out on to the bank.'),
          ],
        },
        done: {
          id: 'a11-16-bounced',
          lines: [
            E('I was bounced. Into the river. Tigger bounced me.', 'angry'),
            N('Tigger, arriving, says he only coughed. Everyone looks at Tigger, and Tigger looks at the sky.'),
            T('Just a cough. A big Tigger cough. Eeyore happened to be in front of it.'),
            E('Hm. Some coughs are bouncier than others. That’s all I’m saying.'),
          ],
        },
      },
    ],
    complete: {
      id: 'a11-16-complete',
      lines: [
        N('Afterwards everyone plays Poohsticks again, Eeyore too, dripping. He wins twice and says it doesn’t count.'),
        P('The best thing about Poohsticks is that you can play it for ever, and it never gets any different.', 'happy'),
        N('Your Nubbin sits on the rail watching the water go under: the same water, and new water, both at once.'),
        CR('You could have a bridge like this at home, you know. Any stream will do. And any sticks.'),
      ],
    },
    rewards: [],
    sets: { 'a11-16': true },
    notes:
      'GIFT PAYOFF (a11-gift = sat only). The step 3 done scene shown, a11-16-bounced, is for ribbon and thistle. If ' +
      'a11-gift = sat, play A11_VARIANTS a11-16-bounced-sat instead: Eeyore asks you, and only you, to tell the others ' +
      'he was bounced. MINIGAME a11-poohsticks: drop on “now”, run to the far rail; a stick on the fast side of the ' +
      'current wins (the same rule the Grove bridge uses, see A11-20). It cannot be lost; any finish completes the ' +
      'step. Eeyore floats calmly on his back the whole time and is never under water.',
  },

  // ---------------------------------------------------------------- A11-17
  {
    id: 'a11-17',
    code: 'A11-17',
    title: 'Tigger Is Unbounced',
    source: 'The House at Pooh Corner (1928), ch. VII: Tigger is unbounced',
    audience: 'all',
    trigger: { where: WHERE, when: after('A11-16') },
    requires: ['A11-16'],
    speakers: [RABBIT, POOH, PIGLET, TIGGER],
    steps: [
      {
        id: 'a11-17-s1',
        goal: 'Hear Rabbit’s plan, and choose whom to walk with.',
        hint: 'Your choice decides where you are when the mist comes down.',
        check: 'choose:a11-mist:plan',
        scene: {
          id: 'a11-17-plan',
          lines: [
            R('Tigger is getting very Bouncy. Too bouncy. Bouncing on Eeyore. Bouncing on everyone.', 'angry'),
            R('Here is my plan. We take Tigger for a long walk, somewhere he’s never been, and lose him there. Then we go home.'),
            P('Why?'),
            R('So that next morning he’s a smaller Tigger. A sorry sort of Tigger. A Tigger who says thank you.'),
            PG('That’s not very kind.'),
            R('It’s very kind. It’s for his own good. That’s the kindest sort.'),
            N('A mist is coming up from the river, white and thick, and the Forest is going soft round the edges.'),
            T('A walk! Where are we going? Tiggers love walks. Tiggers walk best of anyone.', 'happy'),
          ],
          choices: [
            {
              id: 'rabbit',
              label: 'Go with Rabbit.',
              set: { 'a11-mist': 'rabbit' },
              then: [R('Good. I knew somebody sensible would. Keep up, and keep quiet.')],
            },
            {
              id: 'tigger',
              label: 'Stay with Tigger.',
              set: { 'a11-mist': 'tigger' },
              then: [T('Hooray! Tiggers like company. Especially company that doesn’t run off.', 'happy')],
            },
          ],
        },
        done: {
          id: 'a11-17-plan-done',
          lines: [N('Into the mist they all go: Rabbit leading, everybody following, and Tigger bouncing round the outside of everybody.')],
        },
      },
      {
        id: 'a11-17-s2',
        goal: 'Get through the mist.',
        hint: 'Stay close to whoever you are with, and listen.',
        check: 'explore:a11-mist:hollow',
        scene: {
          id: 'a11-17-mist',
          lines: [
            N('At the top of the Forest, in a hollow, Rabbit whispers “Now!”, and he and Pooh and Piglet duck behind a bank.'),
            N('Tigger bounces on ahead without noticing. You go with him, because you said you would.'),
            T('Where’s everybody gone? Hallo? Rabbit? Pooh?', 'think'),
            T('They must have got lost. Poor things. Mist is very difficult if you aren’t a Tigger.'),
            N('Tigger isn’t worried at all. He bounces along a short way home that his feet seem to know.'),
            N('At Kanga’s, Pooh and Piglet arrive soon after, damp, following the smell of honey. Rabbit isn’t with them.'),
            T('Rabbit? Lost? In the mist? Don’t worry. Tiggers never get lost. I’ll fetch him.', 'happy'),
            N('He bounces off into the white. You go after him, holding your Nubbin close, so the mist can’t have it.'),
          ],
        },
        done: {
          id: 'a11-17-found',
          lines: [
            N('You hear him before you see him: a small voice in a hollow, saying “Hallo?” to the mist, very bravely.'),
            T('Rabbit! There you are! I’ve come to find you. Tiggers are good at finding.', 'happy'),
            N('Rabbit comes out of the hollow and looks at Tigger. For once, he hasn’t got a plan.'),
            R('Tigger. Oh, Tigger. I am glad to see you.', 'soft'),
          ],
        },
      },
    ],
    complete: {
      id: 'a11-17-complete',
      lines: [
        N('Tigger takes everyone home, bouncing, by a way that is short and obvious once you’ve been shown it.'),
        R('He’s still very bouncy. Too bouncy.', 'think'),
        N('Rabbit says it quietly, the way people say a thing they don’t quite mean any more.'),
        T('Tiggers don’t get lost. Tiggers find. That’s what Tiggers are for.', 'happy'),
      ],
    },
    rewards: [],
    sets: { 'a11-17': true },
    notes:
      'SECOND CHOICE (a11-17-plan): a11-mist = rabbit | tigger. The step 2 scenes shown (a11-17-mist, done ' +
      'a11-17-found) are for tigger. For rabbit play A11_VARIANTS a11-17-mist-rabbit in place of a11-17-mist and ' +
      'a11-17-found-rabbit in place of a11-17-found: you are lost with Rabbit in the hollow and you hear Tigger first. ' +
      'It pays off in A11-19 (a11-19-signed-rabbit). The mist is soft white, never dark or frightening.',
  },

  // ---------------------------------------------------------------- A11-18
  {
    id: 'a11-18',
    code: 'A11-18',
    title: 'Piglet Does a Very Grand Thing',
    source: 'The House at Pooh Corner (1928), chs. VIII and IX: Piglet does a very grand thing; Eeyore finds a house for Owl',
    audience: 'all',
    trigger: { where: WHERE, when: after('A11-17') },
    requires: ['A11-17'],
    speakers: [PIGLET, POOH, OWL, EEYORE],
    steps: [
      {
        id: 'a11-18-s1',
        goal: 'Visit Owl with Pooh and Piglet on a very windy day.',
        hint: 'Hold on to something on the way to The Chestnuts.',
        check: 'visit:a11-owl:windy',
        scene: {
          id: 'a11-18-wind',
          lines: [
            N('It is a very windy day. Piglet’s ears stream out behind him like flags, and he has to hold on to Pooh.'),
            PG('What if a tree fell, Pooh? While we were under it?', 'shock'),
            P('Then we’d be under it. But it mightn’t. Most trees stay up. That’s what they’re best at.'),
            N('You all reach The Chestnuts and go in. Owl tells a long story about a great-uncle who once flew backwards through a wind like this.'),
            N('Then there is a great crash, and the room tips over, slowly, and everything slides into one corner, including you.'),
            N('When it stops, the floor is a wall, the wall is the floor, and the door is in the ceiling.'),
            PG('Pooh? Is it… is it still the same day?', 'shock'),
            O('My house. My house is on its side. This has never happened to me before.', 'sad'),
          ],
          choices: [
            {
              id: 'check',
              label: 'Check everyone’s all right.',
              then: [N('Everyone is all right: Owl is ruffled, and Pooh is sitting on the tablecloth. Your Nubbin is under a chair, pleased to be found.')],
            },
            {
              id: 'out',
              label: 'Look for a way out.',
              then: [N('The windows are full of branches. There is only the letter-box, high up in what used to be the door.')],
            },
            {
              id: 'hand',
              label: 'Hold Piglet’s hand.',
              then: [PG('Th-thank you. I’m not frightened. My hand is.', 'soft')],
            },
          ],
        },
        done: {
          id: 'a11-18-wind-done',
          lines: [P('The letter-box. It’s very high up and very small. Only somebody very small could get through it.', 'think')],
        },
      },
      {
        id: 'a11-18-s2',
        goal: 'Hold the string while Piglet climbs out through the letter-box.',
        hint: 'Take your place on the string behind Pooh and pull slowly.',
        check: 'escort:a11-piglet:letterbox',
        scene: {
          id: 'a11-18-letterbox',
          lines: [
            N('Everyone looks at Piglet. Piglet looks at the letter-box, and gets smaller.'),
            PG('M-me? Through there? And then what?'),
            P('Then you fetch Christopher Robin, and he gets us out.'),
            O('I shall tie a string round you. My knots are well known.'),
            N('Owl ties the string, and Pooh holds the end. You hold the end of Pooh, and your Nubbin holds the end of you.'),
            N('Slowly, carefully, you all pull, and up goes Piglet to the letter-box in the ceiling.'),
            PG('I’m here. It’s very small. It’s very, very small.', 'shock'),
            N('He squeezes, and wriggles, and goes through with a squeak. You hear him scramble down the tree outside.'),
            PG('I’m going for Christopher Robin! I’m n-not frightened! Only a bit!'),
          ],
        },
        done: {
          id: 'a11-18-letterbox-done',
          lines: [N('Not long after, Christopher Robin arrives with a ladder, and Piglet arrives with Christopher Robin, very proud and trying not to be.')],
        },
      },
      {
        id: 'a11-18-s3',
        goal: 'Help Eeyore find a new house for Owl.',
        hint: 'Follow Eeyore through the Forest. He is very pleased with what he has found.',
        check: 'find:a11-owl-house:beech',
        scene: {
          id: 'a11-18-house',
          lines: [
            N('Afterwards Pooh makes up a long hum about Piglet’s Very Grand Thing. You hear all seven verses of it, as humming.'),
            N('Piglet listens to every one, going pink at the bits about himself, and at the end he asks to hear it again.'),
            O('I shall need a new house. A suitable residence. With a knocker.', 'sad'),
            E('Leave it to me. I know the Forest. I go everywhere, mostly alone.'),
            N('Eeyore goes off, and comes back the next day, and leads you all to a beech tree, very pleased with himself.'),
            E('There. A house. Nobody using it, I should think. It’s got a name on and everything. And a step.', 'happy'),
            N('It is Piglet’s house. Everybody knows it is Piglet’s house, except Eeyore.'),
            N('Piglet looks at his house for a long time. Then he looks at Eeyore, who is happier than anybody has ever seen him.'),
          ],
        },
        done: {
          id: 'a11-18-house-done',
          lines: [
            PG('Yes. It’s just the house for Owl. I hope he’ll be very happy in it.', 'soft'),
            N('Piglet says it bravely, because he is brave, and then he has to look at the ground for a while.'),
          ],
        },
      },
    ],
    complete: {
      id: 'a11-18-complete',
      lines: [
        P('Piglet. You could come and live with me. Will you?', 'soft'),
        PG('Oh, Pooh. Yes. Thank you, Pooh.', 'happy'),
        N('So Owl moves into Piglet’s old house, and gives it a grand new name, and spells it wrong.'),
        N('Your Nubbin carries Piglet’s smallest chair to Pooh’s house, the long way round, as carefully as if it were made of eggs.'),
      ],
    },
    rewards: [],
    sets: { 'a11-18': true },
    notes:
      'Merges HAPC VIII and IX, as Part M’s outline does. Pooh’s song for Piglet is a Milne poem: it is heard ONLY ' +
      'as humming, never shown or sung in words. The fallen house is played for comedy: a slow tilt, soft slide, ' +
      'no injuries. The letter-box climb is hand-over-hand on the string, Piglet always roped.',
  },

  // ---------------------------------------------------------------- A11-19
  {
    id: 'a11-19',
    code: 'A11-19',
    title: 'The Rissolution',
    source: 'The House at Pooh Corner (1928), ch. X (opening): the Rissolution',
    audience: 'all',
    trigger: { where: WHERE, when: after('A11-18') },
    requires: ['A11-18'],
    speakers: [RABBIT, EEYORE, PIGLET, POOH, TIGGER, CROBIN],
    steps: [
      {
        id: 'a11-19-s1',
        goal: 'Go to the meeting Rabbit has called, and sign the Rissolution.',
        hint: 'Everyone is gathered at Pooh Corner. Sign at the bottom, any way you like.',
        check: 'visit:a11-meeting:pooh-corner',
        scene: {
          id: 'a11-19-meeting',
          lines: [
            N('Christopher Robin is going away. Nobody knows how they know it, and nobody says it, but everybody knows.'),
            N('Even Small knows, though he isn’t saying much. He never does.'),
            R('A Meeting has been called. By me. To pass a Resolution. Eeyore has written a poem for it.', 'think'),
            E('A Rissolution. That’s what it is. A poem. Don’t expect much.', 'sad'),
            N('Eeyore reads it out. It is long, and it rhymes in places, and it says, more or less, that they will all miss him.'),
            N('Nobody laughs. Even Tigger stands still until the end.'),
            PG('It’s a very good poem, Eeyore.'),
            E('Is it? I hadn’t noticed. Bit long.', 'soft'),
            R('Now everybody signs. Write your names at the bottom. Or something like your names.'),
          ],
          choices: [
            {
              id: 'name',
              label: 'Sign your name.',
              then: [N('You sign it, in your best letters, under Piglet’s.')],
            },
            {
              id: 'paw',
              label: 'Let your Nubbin sign with a paw.',
              then: [N('Your Nubbin dips a paw in Owl’s ink and presses it carefully at the bottom: slightly crooked, and entirely its own.')],
            },
            {
              id: 'pooh',
              label: 'Help Pooh with his letters.',
              then: [P('P, O, O, H. Is that right? It looks right. It looks like me.', 'happy')],
            },
          ],
        },
        done: {
          id: 'a11-19-signed',
          lines: [
            N('Tigger signs next to you, with a T that bounces right off the edge of the paper.'),
            T('Is he coming back? He’s coming back. Isn’t he?', 'think'),
            N('Nobody answers. Tigger bounces once, very small, to show he doesn’t mind.'),
          ],
        },
      },
      {
        id: 'a11-19-s2',
        goal: 'Take the Rissolution to Christopher Robin.',
        hint: 'Walk with everyone to Christopher Robin’s door.',
        check: 'deliver:a11-rissolution:cr-house',
        scene: {
          id: 'a11-19-scroll',
          lines: [
            N('Rabbit rolls up the scroll. Then he stops, because something is already round it: a blue ribbon, tied in a careful double bow.'),
            E('I had it in my pot. Seemed right. It’s a Friend ribbon. He’ll know what it says.', 'soft'),
            ...A19_DELIVER,
          ],
        },
        done: {
          id: 'a11-19-scroll-done',
          lines: [
            N('Then everyone goes away, quietly, one by one, until only Pooh is left.'),
            N('You go and wait by the gate with your Nubbin. Nobody asked you to, but it seems the right place to be.'),
          ],
        },
      },
    ],
    complete: {
      id: 'a11-19-complete',
      lines: [
        N('After a while Christopher Robin comes out. Pooh is with him.'),
        CR('We’re going for a walk. To the top of the Forest. Will you come? Some of the way?', 'soft'),
        N('Your Nubbin is already on its feet.'),
      ],
    },
    rewards: [],
    sets: { 'a11-19': true },
    notes:
      'GIFT PAYOFF (a11-gift). The step 2 scene shown, a11-19-scroll, is for ribbon. For thistle play A11_VARIANTS ' +
      'a11-19-scroll-thistle; for sat play a11-19-scroll-sat (Eeyore adds “Somebody sat with me” to the bottom). All ' +
      'three end with the same delivery lines. MIST PAYOFF (a11-mist). The step 1 done scene shown, a11-19-signed, is ' +
      'for tigger; for rabbit play a11-19-signed-rabbit (Rabbit signs next to you and thanks you, stiffly, for the ' +
      'company in the mist). Eeyore’s poem and the Rissolution’s text are Milne’s verse: describe them, never show ' +
      'them. Nobody says where Christopher Robin is going.',
  },

  // ---------------------------------------------------------------- A11-20
  {
    id: 'a11-20',
    code: 'A11-20',
    title: 'An Enchanted Place',
    source: 'The House at Pooh Corner (1928), ch. X: Christopher Robin and Pooh come to an enchanted place',
    audience: 'all',
    trigger: { where: WHERE, when: after('A11-19') },
    requires: ['A11-19'],
    speakers: [CROBIN, POOH],
    steps: [
      {
        id: 'a11-20-s1',
        goal: 'Walk with Christopher Robin and Pooh to the top of the Forest.',
        hint: 'Walk a little way behind them, up through the Forest to Galleons Lap.',
        check: 'walk:a11-galleons-lap:climb',
        scene: {
          id: 'a11-20-climb',
          lines: [
            N('Christopher Robin and Pooh walk up through the Forest, and you walk a little way behind, with your Nubbin.'),
            N('Nobody is in a hurry. Christopher Robin points things out, the way you do when you want to remember the way.'),
            CR('Pooh. Of all the things there are to do, what do you like best?', 'think'),
            P('Coming round to yours. And you saying there’s honey. And there being honey. And Piglet. Mostly that.'),
            CR('I like that too. But what I like best of all is doing Nothing.'),
            P('Nothing? What does Nothing look like, when you’re doing it?', 'think'),
            CR('It’s when you go out for no reason, and come back for no reason, and the whole day in between is yours.'),
            P('Oh. I do that a lot.', 'happy'),
            CR('I know. You’re very good at it.'),
            N('They come out at the top of the Forest. There is a ring of trees there, sixty-something of them, standing round as if they’ve been waiting.'),
            N('Nobody has ever been able to count them: sixty-three, or sixty-four. It changes a little every time you try.'),
          ],
          choices: [
            {
              id: 'count',
              label: 'Count the trees.',
              then: [N('You count sixty-three, then again, and get sixty-four. Your Nubbin, counting on its paws, gives up at four and is content.')],
            },
            {
              id: 'look',
              label: 'Don’t count them. Just look.',
              then: [N('You don’t count them. It seems like the kind of place that would rather not be counted.')],
            },
          ],
        },
      },
      {
        id: 'a11-20-s2',
        goal: 'Wait at the edge of the circle while Christopher Robin and Pooh talk.',
        hint: 'Stay at the edge. This bit is theirs.',
        check: 'wait:a11-galleons-lap:edge',
        scene: {
          id: 'a11-20-knight',
          lines: [
            N('At the edge of the circle you stop. Your Nubbin stops too, and sits down without being told.'),
            N('Christopher Robin and Pooh go into the middle, where the grass is soft, and sit, and talk about everything.'),
            N('Kings and queens, and a thing called Factors, and a place called Brazil. Pooh listens, and doesn’t mind not knowing.'),
            CR('Pooh. Stand up.'),
            N('Christopher Robin takes a stick and touches Pooh on each shoulder with it, very gravely.'),
            CR('Arise, Sir Pooh. Knight of the Forest, and my truest friend.'),
            N('Pooh rises, and thinks about being a knight, and decides he likes it, though he isn’t sure what it involves.'),
            N('Then Christopher Robin is quiet for a long time, looking at the trees.'),
            CR('Pooh. Promise you won’t forget me. Not ever. Not even when I’m grown up and enormous.', 'soft'),
            P('Will I be enormous too?', 'think'),
            CR('No. You’ll be just the right size.'),
            P('Then I promise.', 'soft'),
            CR('And if I’m not here so much, you’ll know it isn’t because of you. Won’t you?'),
            P('I shall know. Even if I don’t know why.'),
          ],
        },
        done: {
          id: 'a11-20-knight-done',
          lines: [
            N('Christopher Robin laughs, and jumps up, and holds out his hand. Pooh takes it.'),
            CR('Come on, Pooh.'),
            P('Where?'),
            CR('Anywhere.', 'happy'),
          ],
        },
      },
    ],
    complete: {
      id: 'a11-20-complete',
      lines: [
        ...A20_START,
        N('On the way up, Christopher Robin gave your Nubbin back its blue ribbon, off the scroll. Now it ties it round the nearest tree.'),
        ...A20_END,
        N('Down by the Grove stream there is a little wooden bridge that wasn’t there this morning. A bit of blue ribbon is tied to its rail.'),
      ],
    },
    rewards: [
      {
        id: 'a11-poohsticks-bridge',
        kind: 'feature',
        label: 'The Poohsticks Bridge',
        description:
          'A little wooden bridge over the Grove stream. Drop sticks with your Nubbins and run to the other rail to see whose comes out first.',
      },
      {
        id: 'a11-long-table-bookmark',
        kind: 'item',
        label: 'Long Table Bookmark',
        description: 'A strip of paper drawn like a long table laid for everyone. It marks the Forest page, and counts towards the Long Table festival.',
      },
    ],
    sets: { 'a11-20': true, 'a11-done': true },
    notes:
      'GIFT PAYOFF (a11-gift). The complete scene shown, a11-20-complete, is for ribbon. For thistle play ' +
      'A11_VARIANTS a11-20-complete-thistle; for sat play a11-20-complete-sat. Each leaves the matching thing at ' +
      'Galleons Lap (ribbon on a tree, thistle planted, a flattened round in the grass) and names the matching detail ' +
      'on the Grove bridge (ribbon on the rail, a thistle at the far end, a worn place on the parapet). ' +
      'LIFTED TEXT: none. Milne’s promise exchange and last line are [unverified] in Part M, so a11-20-knight#8–11 ' +
      'and A20_END#0–1 tell the beats in our own words; do not swap in Milne’s wording unless it is verified against ' +
      'PG #73011 ch. X. Staging: you stop at the edge of the circle and never go in; the camera stays with you. The ' +
      'last two lines of A20_END and the bridge line play over the Grove, the atlas closing. ' +
      'HAZEL’S MARGIN NOTE: if the campaign is already finished when this scene ends, play A11_VARIANTS ' +
      'a11-margin-hazel straight after it. Otherwise it waits (see the file header). ' +
      'SIM: (a) the Poohsticks bridge is a new Grove feature over the stream: drop a stick per Nubbin, the sticks ' +
      'drift with the current (fast side wins, a small random wobble from the seeded rng), unlimited play, no prizes. ' +
      '(b) The bridge detail reads a11-gift from the Atlas save, read-only, through an atlasFlag(\'a11-gift\') lookup ' +
      'beside atlasDone(id). (c) The bookmark is an item in the atlas; the Long Table festival (A11, A13, A17, A18, ' +
      'A22, any two) reads atlasDone(\'A11\').',
  },
];

// =================================================================== variants

/**
 * Variant scenes chosen by flags. Each quest's notes say which scene each replaces.
 *   a11-gift (A11-6): a11-11-door-*, a11-16-bounced-sat, a11-19-scroll-*, a11-20-complete-*.
 *   a11-mist (A11-17): a11-17-mist-rabbit, a11-17-found-rabbit, a11-19-signed-rabbit.
 *   Campaign finished (Grove, read-only): a11-margin-hazel.
 */
export const A11_VARIANTS: Scene[] = [
  // ---------------------------------------------------------------- A11-11, step 3 done
  {
    id: 'a11-11-door-thistle',
    lines: [
      N('Eeyore goes in, turns round, and comes out again to look at his step.'),
      N('Beside the step, its purple top just showing through the snow, is the thistle your Nubbin gave him. He has planted it.'),
      E('I didn’t eat it. I thought it ought to have somewhere to live. Everybody should, it turns out.', 'soft'),
    ],
  },
  {
    id: 'a11-11-door-sat',
    lines: [
      N('Eeyore goes in, turns round, comes out again, and sits down on his new step.'),
      N('Then he shuffles to one side. There is a space left exactly the size of you, and a smaller one beside it.'),
      E('I kept you a place. In case. Not that you have to. Sit, I mean.', 'soft'),
    ],
  },
  // ---------------------------------------------------------------- A11-16, step 3 done (sat)
  {
    id: 'a11-16-bounced-sat',
    lines: [
      N('Eeyore stands dripping on the bank. He looks round at everybody, and then, slowly, at you.'),
      E('You tell them. You’re the one who sits. They’ll believe you.', 'soft'),
      N('So you tell them, plainly, that Eeyore was bounced. Everyone listens, and Eeyore stands a little taller while you say it.'),
      N('Tigger, arriving, says he only coughed. Everyone looks at Tigger, and Tigger looks at the sky.'),
      T('Well. It was a bouncy sort of cough. Sorry, Eeyore.', 'sad'),
      E('Hm. That’s the first sorry I’ve had this year. I shall keep it.', 'soft'),
    ],
  },
  // ---------------------------------------------------------------- A11-17, step 2 (rabbit)
  {
    id: 'a11-17-mist-rabbit',
    lines: [
      N('At the top of the Forest, in a hollow, Rabbit whispers “Now!”, and you duck behind a bank with him and Pooh and Piglet.'),
      N('Tigger bounces on without noticing. His bounces get further off, and then there are no bounces at all.'),
      R('There. Now we go home.', 'happy'),
      N('Rabbit leads you all home. After a while you pass a sand-pit, and after a while longer you pass the same sand-pit again.'),
      P('Every time we try to get away from this pit, we find it. So if we tried to find it, we might get away.', 'think'),
      R('Nonsense. I’ll walk away from it and come straight back, and you’ll see.'),
      N('Rabbit walks off into the mist to prove it, and doesn’t come back.'),
      N('Pooh hears his honey calling him from far off, and he and Piglet follow it home. You don’t, because Rabbit is out there on his own.'),
      N('So you go after him, with your Nubbin, into the white. You find him in a hollow, small and damp, listening to every noise.'),
      R('Is that you? Oh. Good. I wasn’t lost. I was waiting for somebody to come. That’s all.', 'sad'),
    ],
  },
  // ---------------------------------------------------------------- A11-17, step 2 done (rabbit)
  {
    id: 'a11-17-found-rabbit',
    lines: [
      N('You sit with Rabbit in the hollow while the mist drips. Rabbit doesn’t say anything, and neither do you.'),
      N('Then, far off, you hear it before Rabbit does: a bounce, and another. Then a voice, calling.'),
      Y('Listen.'),
      T('Rabbit? Keeper? Tiggers are good at finding! I can hear you being quiet!', 'happy'),
      R('Tigger. Oh, Tigger. I am glad to see you.', 'soft'),
    ],
  },
  // ---------------------------------------------------------------- A11-19, step 1 done (rabbit)
  {
    id: 'a11-19-signed-rabbit',
    lines: [
      N('Rabbit signs next to you, very neatly, and then stays there, and clears his throat.'),
      R('About the mist. In the hollow. I was grateful for the company. That’s all. It has been noted.', 'soft'),
      N('He goes back to his list at once, and doesn’t look up for some time.'),
    ],
  },
  // ---------------------------------------------------------------- A11-19, step 2 scene (thistle, sat)
  {
    id: 'a11-19-scroll-thistle',
    lines: [
      N('Rabbit rolls up the scroll. Something falls out of it: a thistle, pressed flat, its purple top gone pale.'),
      E('I put that in. From my step. It’s not much. Well. It is, actually.', 'soft'),
      ...A19_DELIVER,
    ],
  },
  {
    id: 'a11-19-scroll-sat',
    lines: [
      N('Rabbit rolls up the scroll. Eeyore stops him with a hoof, asks for it back, and adds one more line at the bottom.'),
      E('Somebody sat with me.', 'soft'),
      N('He doesn’t explain it. He hands it back, and doesn’t look at you, and doesn’t need to.'),
      ...A19_DELIVER,
    ],
  },
  // ---------------------------------------------------------------- A11-20, complete (thistle, sat)
  {
    id: 'a11-20-complete-thistle',
    lines: [
      ...A20_START,
      N('Your Nubbin has carried something up the hill: a thistle head from Eeyore’s step. It plants it at the edge of the circle and pats the earth down.'),
      ...A20_END,
      N('Down by the Grove stream there is a little wooden bridge that wasn’t there this morning. A thistle is coming up at the far end.'),
    ],
  },
  {
    id: 'a11-20-complete-sat',
    lines: [
      ...A20_START,
      N('Your Nubbin turns round three times in the grass at the edge of the circle, and sits. It leaves a flattened round, like the one by Eeyore’s step.'),
      ...A20_END,
      N('Down by the Grove stream there is a little wooden bridge that wasn’t there this morning. One place on its parapet is worn smooth, just right for sitting.'),
    ],
  },
  // ---------------------------------------------------------------- Hazel's margin note (campaign finished)
  {
    id: 'a11-margin-hazel',
    lines: [
      N('Nova’s atlas lies open at the last page of the Forest, where the ring of trees stands on top of the hill.'),
      N('Beside the trees, in soft pencil you have never noticed, there is a note in the margin. You know the hand.'),
      N('“Read this to the little one, the summer they stayed. They asked where Christopher Robin went.”'),
      N('“Somewhere, I said. Not away.”', 'soft'),
      N('And under it, one letter: H.'),
      N('You don’t remember that summer. Or you do, a little: a lap, a voice, a page turning.'),
      N('Your Nubbin climbs into your lap. You sit with the page open for a long time, and it waits with you.'),
    ],
  },
];

// =================================================================== flags and checks

/** Every flag this line sets (Atlas save only). It reads one Grove fact (campaign finished) and writes no Grove flag. */
export const ATLAS_A11_FLAGS: string[] = [
  'a11-01',
  'a11-02',
  'a11-03',
  'a11-04',
  'a11-05',
  'a11-06',
  'a11-07',
  'a11-08',
  'a11-09',
  'a11-10',
  'a11-11',
  'a11-12',
  'a11-13',
  'a11-14',
  'a11-15',
  'a11-16',
  'a11-17',
  'a11-18',
  'a11-19',
  'a11-20',
  'a11-done', // A11-20: the whole page; read by atlasDone('A11') for the Long Table festival and the bridge
  'a11-gift', // ribbon | thistle | sat (a11-06-gift): A11-11, A11-16, A11-19, A11-20 and the Grove bridge detail
  'a11-mist', // rabbit | tigger (a11-17-plan): A11-17 and A11-19
];

export const ATLAS_A11_CHECKS: string[] = [
  'explore:a11-forest:edge',
  'wait:a11-balloon:oak',
  'watch:a11-bees:oak',
  'visit:a11-rabbit:burrow',
  'escort:a11-cr:rabbit-door',
  'sit:a11-pooh:rabbit-door',
  'walk:a11-spinney:larches',
  'watch:a11-spinney:oak',
  'talk:a11-eeyore:thistles',
  'visit:a11-owl:chestnuts',
  'place:a11-tail:eeyore',
  'build:a11-pit:six-pines',
  'carry:a11-lantern:six-pines',
  'wait:a11-piglet:six-pines',
  'talk:a11-eeyore:stream',
  'carry:a11-pot:hundred-acre',
  'give:a11-eeyore:birthday',
  'talk:a11-rabbit:plan',
  'escort:a11-roo:rabbit-burrow',
  'visit:a11-kanga:sandy-pit',
  'talk:a11-cr:expotition',
  'carry:a11-pole:stream',
  'place:a11-pole:stream',
  'explore:a11-flood:high-bank',
  'deliver:a11-bottle:cr-hill',
  'escort:a11-brain-of-pooh:beech',
  'deliver:a11-invitations:forest',
  'place:a11-table:eeyore-seat',
  'build:a11-house:pooh-corner',
  'escort:a11-eeyore:pooh-corner',
  'wait:a11-eeyore:pooh-corner',
  'inspect:a11-noise:pooh-door',
  'feed:a11-tigger:breakfast',
  'visit:a11-kanga:breakfast',
  'talk:a11-rabbit:search',
  'explore:a11-search:six-pines',
  'find:a11-small:pooh-back',
  'walk:a11-tigger:pines',
  'place:a11-tunic:pine',
  'visit:a11-cr:door',
  'talk:a11-owl:note',
  'inspect:a11-sticks:gloomy-place',
  'watch:a11-pooh:bridge',
  'minigame:a11-poohsticks:bridge',
  'carry:a11-stone:bridge',
  'choose:a11-mist:plan',
  'explore:a11-mist:hollow',
  'visit:a11-owl:windy',
  'escort:a11-piglet:letterbox',
  'find:a11-owl-house:beech',
  'visit:a11-meeting:pooh-corner',
  'deliver:a11-rissolution:cr-house',
  'walk:a11-galleons-lap:climb',
  'wait:a11-galleons-lap:edge',
];
