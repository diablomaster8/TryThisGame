/**
 * The Learning Grove, reader band (ages 7–10): Atlas page A11, The Enchanted Place (Forest, England).
 *
 * Source: atlas-a11.ts (ATLAS_A11 and A11_VARIANTS). One EduScene per original scene, id
 * `reader:<original id>`: every step scene, every done scene, the twenty complete scenes and all
 * eleven variants. Every choice keeps its original id and `set`; the reader band keeps every
 * choice (Rabbit’s plans in A11-7 and A11-17 stay as written, and each carries a think question
 * about fairness or kindness). See EDU-STYLE.md.
 *
 *   Learning angles (from the outline): which way a stream flows and why the stick on the fast
 *   side wins (A11-16); spelling wobbles are fine, and how to sound a word out (A11-15); counting
 *   a circle of “sixty-something” trees (A11-20); weather words (snow, blustery, flood, mist); and
 *   how to be a friend to someone gloomy: sit with them (A11-4, 6, 10, 16, 19). Also: forces and
 *   floating (A11-1, 2, 9), the water cycle, sound and light, kangaroos and bees, simple
 *   measurement, fractions, factors, similes, word meanings, apologies and honesty.
 *   Think questions (a `kind: 'ask'` lesson with no `best`): admitting “I don’t know” (A11-1),
 *   “told you so” to someone stuck (A11-2), whether to tell Pooh early (A11-3), whether gloomy
 *   means “leave me alone” (A11-4), trapping an unknown animal (A11-5), what Eeyore means by “it
 *   doesn’t matter” (A11-6), how to treat newcomers (A11-7), being left out (A11-8), whether small
 *   means weak (A11-9), assuming the party is yours (A11-10), kind silence versus honesty (A11-11),
 *   trying new food (A11-12), who deserves credit (A11-13), saying you are scared (A11-14),
 *   “everybody knows” (A11-15), whether a new player makes the game unfair (A11-16), “for his own
 *   good” (A11-17), being brave while scared (A11-18), saying goodbye in a poem (A11-19) and
 *   whether doing Nothing is nothing (A11-20).
 *
 * - No lifted text. The five lines the original quotes are replaced by the quest’s own childLines
 *   wording (a11-01-page#2 is a fresh line); Pooh’s hums, Eeyore’s poem and the Rissolution are
 *   described, never given. No quotes from the books appear in any lesson.
 * - Hard things: nothing dies on this page. The goodbye stays gentle and unexplained; nobody says
 *   “school”. Hazel’s margin note is read with a reflective lesson about being remembered.
 * - Facts are well established (honey bee colonies, kangaroo tendons, the water cycle, mist,
 *   a stream running fastest in the middle, gale speeds, pencil grades, how malt is made, owl
 *   nesting, sound direction, hares’ forms, herbaria). Temperatures use °C with °F in brackets.
 */
import type { EduDomain, EduQuest, EduScene, GlossaryEntry, Lesson } from './types';
import type { Choice, Line, Mood } from '../config/story';

const say =
  (who: string) =>
  (text: string, mood?: Mood): Line =>
    mood ? { who, text, mood } : { who, text };

// ---------------------------------------------------------------- speakers
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

// ---------------------------------------------------------------- builders
type LessonIn = Omit<Lesson, 'id'>;
type Opt = NonNullable<Lesson['options']>[number];

const opt = (label: string, reply: Line[], best = false): Opt =>
  best ? { label, best, reply } : { label, reply };

/** An ask lesson. Leave every option without `best` for a think question. */
const ask = (
  after: number,
  domain: EduDomain,
  skill: string,
  standard: string | null,
  prompt: Line[],
  options: Opt[],
  parentNote: string,
): LessonIn => ({
  domain,
  skill,
  ...(standard ? { standard } : {}),
  kind: 'ask',
  after,
  prompt,
  options,
  parentNote,
});

const notice = (
  after: number,
  domain: EduDomain,
  skill: string,
  standard: string | null,
  lines: Line[],
  parentNote: string,
): LessonIn => ({
  domain,
  skill,
  ...(standard ? { standard } : {}),
  kind: 'notice',
  after,
  lines,
  parentNote,
});

const doIt = (
  after: number,
  domain: EduDomain,
  skill: string,
  standard: string | null,
  check: string,
  lines: Line[],
  parentNote: string,
): LessonIn => ({
  domain,
  skill,
  ...(standard ? { standard } : {}),
  kind: 'do',
  after,
  check,
  lines,
  parentNote,
});

const gloss = (word: string, meaning: string, of: string): GlossaryEntry => ({
  word,
  meaning,
  scene: `reader:${of}`,
});

// ================================================================== the scenes (lines and choices)
type SceneData = { lines: Line[]; choices?: Choice[] };

const SCENES: Record<string, SceneData> = {
  'a11-01-page': {
    lines: [
      N(
        'Nova’s atlas falls open at a page drawn in soft pencil: a stream, a bridge, and a hill with a ring of trees on top.',
      ),
      N('Across the top there is writing, in slow, careful print.'),
      N('It is the start of a story about a bear who comes downstairs in a very bumpy way.'),
      N(
        'The pencil goes soft under your fingers, then softer. Then it is pine needles, and you and your Nubbin are standing in them.',
      ),
      N(
        'A boy is coming up the path with a bear under his arm, upside down. Neither of them seems to mind.',
      ),
      CR('Hallo. You’re not from the Forest. I know everybody in the Forest.'),
      CR(
        'This is Pooh. He came down the stairs on his head, so he may be a bit muddled. He usually is anyway.',
      ),
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
        then: [
          N(
            'Your Nubbin sits on Pooh’s foot. Pooh decides that is a friendly thing for a Heffalump to do, and lets it.',
          ),
        ],
      },
      {
        id: 'what',
        label: 'Ask what a Heffalump is.',
        then: [CR('Nobody knows exactly. That’s the best sort of animal.')],
      },
    ],
  },
  'a11-01-page-done': {
    lines: [
      P('I was just going to see about some honey. You can come, if you like.'),
      P('Honey always goes better with somebody watching.', 'happy'),
    ],
  },
  'a11-01-balloon': {
    lines: [
      N(
        'High in an oak there is a buzzing. Pooh stops so suddenly that your Nubbin walks into the back of him.',
      ),
      P('That is a honey sort of buzz. I’d know it anywhere.', 'happy'),
      P(
        'The trouble with honey is that it’s always at the top of things. Christopher Robin, have you got such a thing as a balloon?',
      ),
      CR('I’ve got two. A green one and a blue one. What do you want a balloon for?'),
      P('Honey.', 'think'),
      P(
        'The blue one, please. Bees won’t mind a bit of blue sky. And I shall roll in the mud, so I look like a small black cloud.',
      ),
      N('He does, very thoroughly. Your Nubbin rolls in the mud too, in case it’s a rule.'),
      CR(
        'You hold the string. Don’t let go unless he says. And don’t laugh. It hurts his feelings.',
      ),
      N(
        'Up goes Pooh, past the branches, round and black and very hopeful. He stops at exactly the height of the nest.',
      ),
    ],
  },
  'a11-01-balloon-done': {
    lines: [
      N('The string tugs in your hands like a kite that has been told about honey.'),
      P(
        'Christopher Robin? These bees are looking at me in a very suspicious sort of way.',
        'think',
      ),
    ],
  },
  'a11-01-bees': {
    lines: [
      P(
        'Would you walk up and down with your umbrella, Christopher Robin, and say it looks like rain? Then they’ll believe I’m a cloud.',
      ),
      N(
        'Christopher Robin walks up and down under his umbrella, saying it looks like rain. It doesn’t, and the bees know.',
      ),
      P(
        'I think these are the wrong sort of bees. They would make the wrong sort of honey. I shall come down now.',
      ),
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
        then: [
          N('You bite your lip, and the string stays steady. Pooh looks down at you gratefully.'),
        ],
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
  'a11-01-bees-done': {
    lines: [
      N('Pop goes the popgun. “Ow!” says Pooh.'),
      CR('Did I miss?'),
      P('You hit something. It wasn’t the balloon.', 'sad'),
      N(
        'The second cork gets the balloon. Pooh floats down into your arms like a large, muddy leaf.',
      ),
    ],
  },
  'a11-01-complete': {
    lines: [
      N(
        'Pooh’s arms have held the string so long that they stay up in the air, like a bear about to be surprised.',
      ),
      CR(
        'They’ll come down in a week or so. If a fly lands on his nose, he has to blow it off. Like that. Pooh!',
      ),
      N('Pooh blows a fly off his nose. He looks pleased to be good at something.'),
      CR(
        'You can come back, you know. There’s always something on in the Forest. Or nothing, which is better.',
      ),
      N('He ties a blue ribbon round your Nubbin’s middle, in a careful double bow.'),
      CR(
        'So everyone knows it’s a Friend. Otherwise Piglet will think it’s a Woozle, and then there’s no talking to him.',
      ),
    ],
  },
  'a11-02-visit': {
    lines: [
      N(
        'Pooh is humming along the sandbank, which is what he does when he isn’t doing anything else.',
      ),
      P(
        'A hole. A hole means Rabbit, and Rabbit means company, and company means a little something.',
        'happy',
      ),
      P('Hallo? Anybody in?'),
      R('Nobody’s in. Go away.'),
      P('Then who said that?', 'think'),
      R('Nobody. I said it for him.'),
      N('Rabbit puts his head out, sighs, and looks at your Nubbin.'),
      R('And what is that?'),
      P('A very small Heffalump.'),
      R(
        'It is not. It’s wearing a bow. Heffalumps don’t wear bows. Come in, then, both of you. Wipe your feet.',
      ),
      N(
        'Rabbit gets out the honey. Pooh has a little, and then a little more, and then the rest, so it won’t feel left out.',
      ),
      N(
        'Your Nubbin has one crumb. Rabbit watches it eat the crumb as if it might be the start of something.',
      ),
    ],
  },
  'a11-02-visit-done': {
    lines: [
      R('Well. Must you be going? Already? What a shame.'),
      N(
        'Pooh starts out of the front door, and his front half gets out. The rest of him has had too much honey to follow.',
      ),
      P('Oh, dear. I seem to have stopped.', 'shock'),
    ],
  },
  'a11-02-stuck': {
    lines: [
      N(
        'Pooh is stuck. His head and arms are out in the morning, and the rest of him is in Rabbit’s hall.',
      ),
      P(
        'I can’t go forwards and I can’t go back. It’s all on account of the door being too narrow.',
        'sad',
      ),
      R('It’s all on account of somebody eating too much honey. I’m only saying.'),
      R('You. Keeper. Go and get Christopher Robin. Run.'),
      N(
        'You run. Christopher Robin comes back at a sensible walk, because he has seen this sort of thing before.',
      ),
      CR('There’s only one thing for it. He’ll have to stay there until he’s thin again.'),
      P('How long does getting thin take?', 'shock'),
      CR('About a week, I should think.'),
      P('A week! What about meals?'),
      CR('No meals. That’s rather the point.'),
      N(
        'A tear rolls down Pooh’s nose and drips on the sand. Your Nubbin sits in front of him, nose to nose.',
      ),
      P(
        'Then would you read to me? Something comforting. A sustaining sort of book, for a Bear in a Tight Place.',
        'sad',
      ),
    ],
  },
  'a11-02-stuck-done': {
    lines: [CR('We’ll take turns. You read in the mornings, and I’ll read in the afternoons.')],
  },
  'a11-02-week': {
    lines: [
      N(
        'So for a week you sit on the sandbank and read to the North end of Pooh. Christopher Robin takes the afternoons.',
      ),
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
  'a11-02-week-done': {
    lines: [
      N(
        'On the seventh day Christopher Robin takes Pooh’s front paws. Rabbit takes Christopher Robin.',
      ),
      N(
        'Rabbit’s friends-and-relations take Rabbit, all of them, in a long line. You take the end, and your Nubbin takes you.',
      ),
      CR('Pull!'),
      N(
        'For a long time nothing happens. Then, with a pop like a ginger-beer cork, out comes Pooh, and everyone sits down at once.',
      ),
    ],
  },
  'a11-02-complete': {
    lines: [
      P(
        'Thank you. All of you. Especially the one at the end, who I couldn’t see but could feel.',
        'happy',
      ),
      N(
        'Pooh nods to his friends and walks off into the Forest, humming, a little thinner and not at all wiser.',
      ),
      R(
        'He’ll be back. He knows where the honey is now. I shall have to get a wider door.',
        'think',
      ),
      N('Rabbit looks at the hall where the legs were. He looks very nearly as if he misses them.'),
    ],
  },
  'a11-03-tracks': {
    lines: [
      N(
        'It is a fine winter’s day. Piglet is brushing snow off his front step when Pooh goes past, round in a circle.',
      ),
      PG('Pooh? Why are you going round and round?'),
      P('Following something. I don’t know what yet. That’s the exciting part.', 'think'),
      P(
        'Look. Paw-marks. Something has been round here, and round, and I have been round after it.',
      ),
      PG('Could it be… a Woozle?', 'shock'),
      P('It might. Woozles are very hard to tell from the front.'),
      N('Piglet looks at your Nubbin, hard. Your Nubbin looks back with great innocence.'),
      PG(
        'That one’s got a bow on. Christopher Robin s-said it was a Friend. But a Woozle would say that.',
        'think',
      ),
      N(
        'Your Nubbin trots after Pooh round the spinney of larches, putting its small feet very carefully in the snow.',
      ),
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
        then: [
          N(
            'Your Nubbin goes round once more, very pleased with itself. Now there is one more set of tracks.',
          ),
        ],
      },
    ],
  },
  'a11-03-tracks-done': {
    lines: [
      N(
        'Round they go. Every time they come back to the same place, there are more tracks than before.',
      ),
    ],
  },
  'a11-03-count': {
    lines: [
      P(
        'Look! Two of them now. And one very small. And a third, and something else besides.',
        'shock',
      ),
      PG(
        'Three Woozles and a Wizzle, perhaps. Pooh, I’ve just remembered something I meant to do yesterday. I’d better go and do it.',
        'shock',
      ),
      N(
        'Up in a big oak, Christopher Robin is sitting very still. He beckons you up, and your Nubbin rides in your hood.',
      ),
      CR(
        'Don’t say anything. He gets there in the end. He always does, and it’s better when he gets there himself.',
      ),
      N('Pooh stops and looks at the tracks. He puts his own foot into one of them, and it fits.'),
      P('Oh.', 'think'),
      N('He puts his foot into another. It fits too.'),
      N(
        'Piglet, a little way off, looks at the tiny prints, then at your Nubbin’s feet, and goes pink.',
      ),
    ],
  },
  'a11-03-count-done': {
    lines: [
      N('Christopher Robin climbs down from the tree.'),
      CR('Oh, Pooh. Whose footprints do you think those are?', 'happy'),
      P(
        'I have been going round and round after my own feet. I am a Bear with no Brain worth mentioning.',
        'sad',
      ),
      CR('There isn’t a better bear anywhere. I’d know.', 'soft'),
    ],
  },
  'a11-03-complete': {
    lines: [
      P('Being silly is very hungry work. Is it lunch?', 'happy'),
      N(
        'Pooh and Christopher Robin go home together. Piglet walks a long way round your Nubbin, then, after a while, a shorter way.',
      ),
      PG('I knew it wasn’t a Woozle. Mostly.', 'soft'),
      N('Your Nubbin holds out a paw. Piglet shakes it quickly, and then a second time, slower.'),
    ],
  },
  'a11-04-gloomy': {
    lines: [
      N(
        'Eeyore, the old grey donkey, stands by himself in a thistly corner of the Forest, with his head on one side.',
      ),
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
        then: [
          E('Kind of you. Don’t trouble. I expect somebody is using it for something important.'),
        ],
      },
      {
        id: 'sit',
        label: 'Sit with him for a moment first.',
        then: [
          N(
            'You sit in the thistles beside him, which are very prickly. Eeyore notices, and doesn’t say so, which is a sort of thank you.',
          ),
        ],
      },
      {
        id: 'look',
        label: 'Look behind the thistles.',
        then: [
          N(
            'Your Nubbin looks behind the thistles, under a stone and inside its own bow. No tail.',
          ),
        ],
      },
    ],
  },
  'a11-04-gloomy-done': {
    lines: [
      P('I shall find your tail for you, Eeyore. Me. Pooh.'),
      E('Thank you, Pooh. You’re a real friend. Better than most.', 'soft'),
    ],
  },
  'a11-04-owl': {
    lines: [
      N(
        'Owl lives at The Chestnuts, high in a tree, behind a very grand door with a knocker and a bell-pull.',
      ),
      N(
        'There are two notices by the door, in Owl’s spelling: one says to ring, and the other to knock if the ringing doesn’t work.',
      ),
      N('Pooh knocks and rings. Your Nubbin, who can reach neither, stands on Pooh.'),
      O('Ah, Pooh. And company. How do you do. What can I do for you?'),
      P('Eeyore has lost his tail, and he’s very sad about it. Could you tell me how to find it?'),
      O('Well. In cases of this sort there is a Proper Procedure. First, one Issues a Notice.'),
      P('I’m only a small bear, Owl, and big words make my head go fuzzy.', 'sad'),
      O(
        'It means the Thing to Do. Then one offers a Reward. Then one considers the Matter in all its Aspects.',
      ),
      N(
        'Owl talks for some time, in longer and longer words. Pooh nods at the places where nodding seems to be wanted.',
      ),
      N(
        'Your Nubbin isn’t listening. It is looking at the bell-pull, which is grey, and hairy, and has a tuft at the end.',
      ),
    ],
  },
  'a11-04-owl-done': {
    lines: [
      P('Owl. That bell-pull. Where did you get it?', 'think'),
      O(
        'Came across it in the Forest, hanging on a bush. I gave it a pull to see who was in. Nobody was. It came away in my wing.',
      ),
      P(
        'It belongs to Eeyore. He’s been missing it all morning, and the back of him hasn’t known what to do.',
      ),
    ],
  },
  'a11-04-nail': {
    lines: [
      N('You carry the tail back through the Forest, very carefully, as if it might wake up.'),
      N(
        'Christopher Robin meets you at the thistles with a little hammer and one very short nail.',
      ),
      CR(
        'Hold it straight. Not that straight. There. Eeyore, this won’t hurt. It’s a very small nail.',
      ),
      E('Don’t mind me. Nobody does.'),
      N('Tap, tap: Eeyore doesn’t flinch. Your Nubbin flinches for him, both times.'),
      N('Then Eeyore swishes his tail, carefully, like somebody trying a new door.'),
      E('Hm. It works. Not that anybody asked.'),
      N(
        'He swishes it again, and frisks about among the thistles. He is happy, though he would rather you didn’t mention it.',
      ),
    ],
  },
  'a11-04-nail-done': {
    lines: [E('Thank you, Pooh. And the one with the bow. Thank you.', 'soft')],
  },
  'a11-04-complete': {
    lines: [
      N('Pooh walks home feeling that he has done a Good Deed, which he has.'),
      N(
        'He feels so pleased that he is ready for a little something by eleven o’clock. So he has one.',
      ),
      P(
        'Owl knows ever such a lot. Long words and everything. But it was your Nubbin who looked at the bell-pull.',
        'happy',
      ),
      N(
        'Your Nubbin looks proud. Then, to be safe, it looks for every other bell-pull in the Forest, and there aren’t any.',
      ),
    ],
  },
  'a11-05-dig': {
    lines: [
      CR('I saw a Heffalump today. I think.'),
      N(
        'Christopher Robin says it carelessly, the way you might mention rain, and then goes home to his lunch.',
      ),
      PG('A Heffalump. Here. Pooh, what does one do with a Heffalump?', 'shock'),
      P(
        'Catch it. In a Very Deep Pit. A cunning one, near where Heffalumps walk. The Six Pine Trees, I should think.',
        'think',
      ),
      N(
        'Piglet digs and Pooh supervises. You do most of it, and your Nubbin moves one pebble a long way, very proudly.',
      ),
      PG('Won’t the Heffalump see the pit?'),
      P(
        'We cover it with sticks and leaves. And at the bottom we put something it likes, so it comes.',
      ),
      PG('What do Heffalumps like?'),
      P('Honey.', 'happy'),
      PG('Are you sure?'),
      P('Everybody likes honey.'),
    ],
    choices: [
      {
        id: 'then',
        label: 'Ask what they’ll do once it’s caught.',
        then: [
          P('Be very polite to it, I expect. It’ll be cross otherwise.'),
          PG('Oh, d-dear.', 'shock'),
        ],
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
        then: [
          N(
            'You climb in to look, and it comes up to your chin. Your Nubbin, at the top, looks down at you as if you are the Heffalump.',
          ),
        ],
      },
    ],
  },
  'a11-05-dig-done': {
    lines: [
      N(
        'Pooh fetches his very last jar of honey and lowers it into the pit. He looks at it for some time after.',
      ),
    ],
  },
  'a11-05-night': {
    lines: [
      N(
        'That night Pooh can’t sleep. He tries counting sheep, but they keep turning into Heffalumps, and all of them are eating his honey.',
      ),
      P(
        'Who’s there? Oh, it’s you. Good. I am going to see if the honey is still there. Only to see. Will you hold the lantern?',
        'think',
      ),
      N(
        'You walk to the Six Pine Trees with the lantern. Your Nubbin walks inside the circle of light and won’t step out of it.',
      ),
      N(
        'The honey is still there. Pooh climbs down into the pit and looks at it closely, the way you’d look at an old friend.',
      ),
      P(
        'I’ll just check it’s honey all the way down. It might be cheese at the bottom. You never know with jars.',
      ),
      N('He puts his head in to look, and licks, to be sure. Then he licks further in.'),
      P('Mmff. Mmff mff.', 'shock'),
      N('Pooh stands up in the bottom of the pit with the jar on his head.'),
    ],
    choices: [
      {
        id: 'steady',
        label: 'Hold the lantern steady and wait.',
        then: [
          N(
            'You hold it steady. It trembles only once, because you are laughing, and you stop, because you mustn’t.',
          ),
        ],
      },
      {
        id: 'pull',
        label: 'Try to pull the jar off.',
        then: [
          N(
            'It won’t come, because Pooh’s ears are on the inside. This will have to be a morning job.',
          ),
        ],
      },
    ],
  },
  'a11-05-night-done': {
    lines: [
      N('Pooh climbs out somehow and wanders off into the grey morning, booming inside the jar.'),
    ],
  },
  'a11-05-morning': {
    lines: [
      N(
        'At first light Piglet comes to see if there is a Heffalump in the pit. He comes very quietly, and very slowly.',
      ),
      N(
        'There is a Heffalump. It is walking round the pit with a huge round head, and it is roaring.',
      ),
      PG('Help! Help! It’s a Heffalump! And it’s got Pooh’s honey!', 'shock'),
      N(
        'Piglet runs all the way to Christopher Robin’s door without touching the ground more than four times.',
      ),
      N(
        'He comes back with Christopher Robin. You are still there with your lantern, not explaining, because some things are better found out.',
      ),
      N(
        'The Heffalump bangs its head on a tree root. The jar breaks, and there is Pooh, sticky and very pleased to see everyone.',
      ),
      N('Christopher Robin begins to laugh, and laughs, and can’t stop.'),
      PG('…Oh. It was Pooh.', 'sad'),
    ],
  },
  'a11-05-morning-done': {
    lines: [
      N('Piglet goes home to bed with a headache. Pooh goes home to breakfast.'),
      N('Your Nubbin keeps one piece of the broken jar: the piece with a little honey left on it.'),
    ],
  },
  'a11-05-complete': {
    lines: [
      P(
        'I did think, for a moment, that I might be a Heffalump. It was very dark and echoey in there.',
      ),
      CR('You’re not. You were a bear in a jar. That’s much better.'),
      P('Then who is the Heffalump?', 'think'),
      N('Everyone looks at your Nubbin. Your Nubbin looks behind itself again.'),
      P('A very small one. I’m nearly sure.'),
    ],
  },
  'a11-06-stream': {
    lines: [
      N('Eeyore is standing by the stream, looking at himself in the water.'),
      E('Look at him down there. Even the reflection’s glum, and it doesn’t have to be.', 'sad'),
      P('Good morning, Eeyore.'),
      E('Is it? It would be just like it.'),
      N(
        'Pooh hums at him, to be cheerful. Eeyore waits for the hum to finish, politely, as if it were rain.',
      ),
      E('It’s my birthday, as it happens. Not that it matters.'),
      P('Your birthday?', 'shock'),
      E('Of course it is. You can tell by all the presents. All none of them.'),
      N(
        'Pooh looks to the right and to the left, very carefully, in case there are presents he has missed. There aren’t.',
      ),
      P('Wait here, Eeyore.'),
      N(
        'Pooh hurries off home. Your Nubbin stays behind for one moment, looking at Eeyore, and then follows.',
      ),
    ],
  },
  'a11-06-presents': {
    lines: [
      N(
        'At home, Pooh finds he has a pot of honey, which is the right sort of present for anybody.',
      ),
      N(
        'Piglet has a balloon, a big green one he was saving for something special. This is special.',
      ),
      N(
        'Somewhere on the way, your Nubbin has picked a thistle. It carries it in both paws, prickles and all, and won’t say why.',
      ),
      N(
        'Halfway there, Pooh begins to feel a little eleven o’clock-ish. He sits down and takes the lid off the honey, only to see.',
      ),
      N(
        'He licks the top, and round the edges, and the bottom. Then there is nothing left in the pot.',
      ),
      P('Bother. I had a present, and I’ve eaten it.', 'sad'),
      P(
        'But a pot is a Very Useful Thing. You can put things in it. I shall give him a Useful Pot, for keeping things in.',
        'happy',
      ),
      N(
        'Meanwhile Piglet, running to be first, trips in a rabbit-hole and lands flat on his balloon. Bang.',
      ),
      PG(
        'Oh, d-dear. Oh, dear, oh, dear. It was a balloon, and now it’s a bit of damp rag.',
        'sad',
      ),
      N('He picks up the bit of damp rag, very sadly, and carries it on to Eeyore’s anyway.'),
    ],
  },
  'a11-06-presents-done': {
    lines: [
      N(
        'Your Nubbin looks at the empty pot, and at the rag, and down at its own blue bow, and at the thistle.',
      ),
    ],
  },
  'a11-06-gift': {
    lines: [
      PG('Many happy returns of the day, Eeyore. I’ve brought you a balloon.'),
      E('A balloon? For me?', 'shock'),
      PG('It was a balloon. It got burst. I’m very sorry.', 'sad'),
      P(
        'And I’ve brought you a Useful Pot. To put things in. There’s nothing in it. That’s what makes it so useful.',
        'happy',
      ),
      N(
        'Eeyore looks at the pot, and at the rag. Then he picks up the rag in his teeth and drops it in the pot.',
      ),
      N('He takes it out, and puts it back in. He takes it out again.'),
      E('It goes in and out. You wouldn’t think it, but it does.', 'happy'),
      N(
        'Everyone watches Eeyore being happy, which nobody has seen before. Nobody says anything, in case it stops.',
      ),
      N(
        'Your Nubbin steps forward. It has something to give too, or nothing, which is also a thing.',
      ),
    ],
    choices: [
      {
        id: 'ribbon',
        label: 'Your Nubbin gives Eeyore its blue ribbon.',
        set: { 'a11-gift': 'ribbon' },
        then: [
          N(
            'Your Nubbin tugs at its double bow until it comes undone, and lays the blue ribbon at Eeyore’s feet.',
          ),
          E('That’s your Friend ribbon. Christopher Robin tied it. I know what it says.', 'shock'),
          E('Well. I shan’t wear it. I’ll keep it. Somewhere safe. In the pot.', 'soft'),
        ],
      },
      {
        id: 'thistle',
        label: 'Your Nubbin gives him the thistle it carried.',
        set: { 'a11-gift': 'thistle' },
        then: [
          N(
            'Your Nubbin holds out the thistle. It has been prickling its paws every step of the way.',
          ),
          E(
            'The good sort. Purple on top. Somebody carried that a long way, by the look of their paws.',
            'soft',
          ),
          E('I shan’t eat it. Not today. I’ll keep it for a bit.'),
        ],
      },
      {
        id: 'sat',
        label: 'Nothing. You both just sit with him.',
        set: { 'a11-gift': 'sat' },
        then: [
          N(
            'You sit down on the bank beside Eeyore, and your Nubbin sits down beside you. Nobody says anything.',
          ),
          N(
            'Pooh and Piglet go home after a while. You stay, and the afternoon goes by slowly, the way they do when nobody hurries them.',
          ),
          E('Hm. Nobody’s done that before. Sat, I mean. Without wanting anything.', 'soft'),
        ],
      },
    ],
  },
  'a11-06-gift-done': {
    lines: [
      N(
        'By evening Eeyore is still putting the balloon in the pot and taking it out again. He looks, for Eeyore, almost cheerful.',
      ),
    ],
  },
  'a11-06-complete': {
    lines: [
      N(
        'Christopher Robin arrives late with a cake, and everyone has a slice, and Eeyore has the piece with the most icing, under protest.',
      ),
      E('A Useful Pot, a balloon, and cake. People will say I’m spoiled.'),
      P('Will they?'),
      E('No. But they could.'),
      N(
        'Pooh turns out to have another empty pot at home, which is lucky, as he is very good at making them. He gives it to you.',
      ),
      N('Eeyore tears off a corner of balloon to go in it.'),
      E('Every pot wants something to go in and out. Otherwise what’s the point.'),
    ],
  },
  'a11-07-plan': {
    lines: [
      N(
        'Nobody knows where they came from, but there they are in the Forest: Kanga, and Baby Roo in her pocket.',
      ),
      R(
        'One morning, nobody. Next morning, a Kanga. Who said she could? And she keeps her child in her pocket!',
        'angry',
      ),
      P('Where should she keep it?'),
      R(
        'That’s not the point. Here is the plan. We wait until Kanga isn’t looking. We take Baby Roo, and hide him.',
      ),
      R(
        'Then she says, “Where is Baby Roo?” And we say, “We know where he is.” And she says, “Oh, I see,” and goes away.',
        'happy',
      ),
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
  'a11-07-plan-done': {
    lines: [R('You look after Roo on the way, Keeper. Keep him happy. Happy Roos don’t squeak.')],
  },
  'a11-07-swap': {
    lines: [
      N(
        'By the Sandy Pit, Kanga is teaching Roo to jump. Pooh distracts her with a very long poem about nothing in particular.',
      ),
      N(
        'While she looks the other way, Rabbit lifts Roo out, and Piglet jumps in, with his eyes shut.',
      ),
      N(
        'Rabbit runs off with Roo in a pillowcase he has made into a pocket for the purpose. You run alongside.',
      ),
      RO(
        'Is this a game? I like games. Am I in a pocket? It’s a different pocket. It smells of carrots.',
        'happy',
      ),
      R('Hush. You’re being Hidden. Hidden things are quiet.'),
      RO('Can your Nubbin come in the pocket too?'),
    ],
    choices: [
      {
        id: 'ride',
        label: 'Let your Nubbin ride with Roo.',
        then: [
          N(
            'Your Nubbin climbs into the pillowcase. Roo laughs so much the pocket wriggles all the way to Rabbit’s.',
          ),
        ],
      },
      {
        id: 'count',
        label: 'Count the trees with Roo as they go by.',
        then: [RO('One, two, lots, lots, lots, lots, lots, home!', 'happy')],
      },
      {
        id: 'story',
        label: 'Tell Roo a story.',
        then: [
          RO('Is there a Roo in it?'),
          Y('There is now.'),
          RO('Good. Make him jump a lot.', 'happy'),
        ],
      },
    ],
  },
  'a11-07-swap-done': {
    lines: [
      N(
        'At Rabbit’s, Roo practises jumping off the front step. Rabbit pretends not to count the jumps, and counts them anyway.',
      ),
    ],
  },
  'a11-07-bath': {
    lines: [
      N('At Kanga’s house, Kanga has noticed. Kangas always notice.'),
      K('Bath-time, Roo dear.', 'soft'),
      N('She says it to Piglet, looking straight at Piglet, and runs the bath anyway.'),
      PG('I’m not Roo! I’m Piglet!', 'shock'),
      K('Of course you are, dear. And the water’s lovely and cold.', 'happy'),
      N(
        'Kanga scrubs Piglet very thoroughly, and gives him a big spoonful of medicine, to make him strong.',
      ),
      PG('Ugh. I’m Piglet. Ask anyone. Ask the Keeper.'),
      N(
        'You open your mouth. Kanga catches your eye over Piglet’s head, and you close it again: she knows, and she is enjoying herself.',
      ),
      N(
        'Piglet escapes the towel at last, rolls in the road to get his own colour back, and runs home.',
      ),
    ],
  },
  'a11-07-bath-done': {
    lines: [
      N(
        'Kanga collects Roo from Rabbit’s with a smile that says she has known all along. Rabbit says he was only borrowing.',
      ),
    ],
  },
  'a11-07-complete': {
    lines: [
      R('Well. She can stay. I suppose. Roo jumps very well, for a Roo.', 'think'),
      N(
        'Kanga is friendly to everybody from then on, and Rabbit is friendly back, a bit stiffly, like a new shoe.',
      ),
      RO('Can I go in the pillowcase again? Can your Nubbin come?', 'happy'),
      K('Thank you for keeping an eye on him, dear. I knew somebody was.', 'soft'),
    ],
  },
  'a11-08-setoff': {
    lines: [
      N('Christopher Robin is putting on his Big Boots, which means an Adventure.'),
      CR('We’re going on an Expotition. All of us. To discover the North Pole.'),
      P('Oh. What is the North Pole?', 'think'),
      CR('It’s… a thing. At the North. You’ll know it when you find it.'),
      N(
        'Everyone comes: Rabbit and all his friends-and-relations, Kanga and Roo, Owl, Piglet, and Eeyore last, being last.',
      ),
      E('Nobody told me. Well, somebody did. But not properly.'),
      R('Single file! And look out for Ambushes!'),
      P('Is an Ambush a sort of gorse-bush?'),
      PG('I th-think it’s worse.', 'shock'),
      N(
        'Your Nubbin marches between Pooh and Piglet in single file, which it takes very seriously.',
      ),
    ],
    choices: [
      {
        id: 'back',
        label: 'Walk at the back with Eeyore.',
        then: [
          E('Somebody has to bring up the rear. It might as well be the ones nobody notices.'),
        ],
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
  'a11-08-roo': {
    lines: [
      N(
        'By a pool in the stream everyone stops for lunch. Roo washes his face and paws, to show Kanga he can.',
      ),
      N('Then Roo falls in, with a small splash, and the water carries him off.'),
      RO('Kanga, look! I’m swimming! Am I swimming? I am!', 'happy'),
      K('Are you all right, Roo dear?', 'shock'),
      N(
        'Eeyore turns round and dangles his tail in for Roo to hold. Owl explains how important it is not to panic.',
      ),
      N(
        'Your Nubbin, who doesn’t mind getting wet, is in at once, paddling beside Roo like a small furry float.',
      ),
      N(
        'Pooh has found a long pole. He holds it across the stream lower down, and you take the other end.',
      ),
      N(
        'Roo bumps into the pole, and holds on, and the two of you lift him out, dripping and delighted.',
      ),
    ],
  },
  'a11-08-roo-done': {
    lines: [
      RO('Did you see me swimming? Did you?', 'happy'),
      K('We did, dear. Now come and be dried.', 'soft'),
    ],
  },
  'a11-08-pole': {
    lines: [
      CR('Pooh. Do you know what you’re holding?', 'think'),
      P('A pole. A wet one.'),
      CR('It’s the North Pole. We’ve discovered it. Well, you have.', 'happy'),
      P('Oh!', 'shock'),
      N('Pooh looks at the pole as if he ought to have recognised it.'),
      N(
        'Christopher Robin pushes the pole into the bank, and writes a notice on it saying who found it, spelled about as well as you’d expect.',
      ),
      E(
        'I’ve had my tail in a pool for ten minutes. Nobody noticed. It’s gone numb. But don’t mind me.',
        'sad',
      ),
      CR('Oh, Eeyore. Here, let me dry it.'),
    ],
  },
  'a11-08-pole-done': {
    lines: [
      N(
        'Everyone walks home in a long happy line, with Roo asleep on Kanga, and Pooh walking very upright, the way discoverers do.',
      ),
    ],
  },
  'a11-08-complete': {
    lines: [
      CR(
        'There were two poles, really. This is the spare. Every Expotition needs somewhere to hang its hat afterwards.',
      ),
      N(
        'He gives you a shorter pole with a forked top, which has been, all along, a perfectly good hat-stand.',
      ),
      P('Did I really discover it?'),
      CR('You did.'),
      P('I thought it would be bigger. But it’s very nice.', 'happy'),
    ],
  },
  'a11-09-rain': {
    lines: [
      N('The rain comes down all day, and all night, and all the next day. Then it keeps going.'),
      N(
        'The stream climbs over its banks and the Forest fills up, until the low places are ponds and the ponds are lakes.',
      ),
      N(
        'Piglet’s house is in the middle of a beech tree, and the beech tree is in the middle of the water.',
      ),
      PG(
        'Everyone else will be all right. Pooh can float. Owl can fly. Kanga can jump. And I’m just… small. And wet.',
        'sad',
      ),
      N(
        'He finds a bottle, a pencil and a scrap of paper. He writes HELP, then his name, then that it is him, in case anyone wonders.',
      ),
      N(
        'He corks the bottle and throws it as far as he can, which is not very far, and watches it float away.',
      ),
      N('You and your Nubbin, up on the high bank, see the bottle go by.'),
    ],
  },
  'a11-09-rain-done': {
    lines: [
      N(
        'You follow it along the bank. It bobs all the way to where Pooh is sitting on a branch above his own front door, with his honey.',
      ),
    ],
  },
  'a11-09-bear': {
    lines: [
      P(
        'A bottle with a letter in. I can’t read it, except the P. P is for Pooh, so it must be for me.',
        'think',
      ),
      P(
        'Christopher Robin can read. I must get to him. But he’s on the high ground, and I’m on a branch.',
      ),
      N(
        'Pooh thinks. Then he takes his largest empty jar, lays it on the water, and climbs aboard.',
      ),
      N(
        'It turns over at once. Pooh tries again, the other way up, and sits on top, and it floats.',
      ),
      P(
        'This is my boat. It’s called the Floating Bear. Mostly it floats. Sometimes it’s mostly Bear.',
        'happy',
      ),
      N(
        'You find Christopher Robin’s old wash-tub caught in a bush, and climb in, and paddle with your hands.',
      ),
      N(
        'Your Nubbin rides on your head, well out of the wet. It would be happy to swim, but today you’d rather it didn’t.',
      ),
    ],
    choices: [
      {
        id: 'close',
        label: 'Paddle close enough to grab him.',
        then: [
          N(
            'Twice the Floating Bear turns over, and twice you push it back up. Pooh carries on as if nothing has happened.',
          ),
        ],
      },
      {
        id: 'tow',
        label: 'Tow him with a bit of string.',
        then: [P('A tow! Like a proper ship. I shall sit very still and be steered.', 'happy')],
      },
    ],
  },
  'a11-09-bear-done': {
    lines: [
      N(
        'You bump into the hill where Christopher Robin lives. It is an island now, with a boy on it.',
      ),
    ],
  },
  'a11-09-umbrella': {
    lines: [
      CR(
        'It says help. It’s from Piglet. He’s stuck in his tree, and the water’s still coming up. We need a boat.',
      ),
      CR('The Floating Bear isn’t big enough for two. And I’m much too big for a jar.'),
      P(
        'Your umbrella is a sort of bowl, if you turn it over. And a bowl is a sort of boat.',
        'think',
      ),
      N(
        'Christopher Robin looks at Pooh for a long moment. Then he opens his umbrella and sets it upside down on the water.',
      ),
      N(
        'It floats, and wobbles, and holds. Christopher Robin climbs in, and then Pooh, and it holds them both.',
      ),
      CR('I name this ship The Brain of Pooh. Because it was your idea.', 'happy'),
      P('The Brain of Pooh. Oh.', 'soft'),
      N(
        'Off they go, slowly, turning round and round, with you paddling alongside and your Nubbin as lookout.',
      ),
    ],
  },
  'a11-09-umbrella-done': {
    lines: [
      N(
        'Piglet is at his window, very small and very wet. When he sees The Brain of Pooh, he jumps up and down.',
      ),
      PG('Pooh! Christopher Robin! And the Keeper! You came!', 'happy'),
    ],
  },
  'a11-09-complete': {
    lines: [
      N(
        'Piglet climbs down into the umbrella, and it holds three, just. The ship turns round twice and heads for home.',
      ),
      PG(
        'I knew somebody would come. I didn’t know it would be a bear on a jar and a boy in an umbrella.',
      ),
      CR('It was Pooh’s idea. All of it.'),
      P('Was it? It was a very good idea. I must have more of them.', 'happy'),
      N('Your Nubbin, on your head, sneezes once. It is the driest thing for miles.'),
    ],
  },
  'a11-10-invites': {
    lines: [
      CR(
        'Owl, fly round to everybody and tell them there’s a party. For Pooh. Because of what he did, saving Piglet.',
      ),
      O('A party. Very good. I shall Announce it.'),
      N('Owl flies off to tell everyone, and you go too, to tell everyone again in shorter words.'),
      N('At the Gloomy Place, Owl tells Eeyore. Eeyore nods slowly, and stops listening halfway.'),
      E('A party. For me. Well. Fancy that. Better late than never, I suppose.', 'think'),
      O('No, it is for…'),
      N(
        'But Eeyore has turned away to think about it, and Owl has a great many more trees to visit.',
      ),
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
  'a11-10-table': {
    lines: [
      N(
        'Christopher Robin has made a long table out of some long pieces of wood, out in the open, and everyone helps lay it.',
      ),
      N('You lay the plates. Your Nubbin puts one leaf on each plate, very exactly, as a napkin.'),
      R(
        'Not there! Owl at the top, because he’s Owl. Then Kanga, then me, then my friends-and-relations, all of them…',
      ),
      N(
        'Rabbit organises the seats until there aren’t any left. There is one chair at the very end, where Rabbit hasn’t looked.',
      ),
      N('You put a cushion on it, and a card that says EEYORE in your best letters.'),
      E('A place. At the end. With my name on. I didn’t ask.', 'soft'),
      E('…The cushion’s a nice touch.'),
      N(
        'Everyone sits. There is a great deal of eating, and Roo talks with his mouth full, and nobody minds.',
      ),
    ],
  },
  'a11-10-table-done': {
    lines: [
      CR('Everybody! This party is because of what somebody did, and we all know who.'),
      N(
        'Eeyore half stands up to make a speech. Then Christopher Robin hands Pooh a present, and Eeyore sits down again.',
      ),
    ],
  },
  'a11-10-complete': {
    lines: [
      N(
        'Pooh’s present is a Special Pencil Case. Inside are pencils with letters on them, B and HB and BB, and Pooh is sure every letter is about him.',
      ),
      P('Oh!', 'happy'),
      N('Pooh can’t write, but he looks at every pencil, one at a time, and is very happy.'),
      E('Pencils. Hm. When I was young we had sticks. You could do a great deal with a stick.'),
      N(
        'Walking home, Pooh and Piglet don’t say anything for a long time. It is the friendly kind of quiet.',
      ),
    ],
  },
  'a11-11-snow': {
    lines: [
      N(
        'It is snowing, and the Forest is white and soft. Pooh is humming a hum about snow, which gets longer as it goes, like snow does.',
      ),
      N('He goes round to Piglet’s, humming. Piglet is sitting by his fire, warming his toes.'),
      P(
        'I’ve been thinking about Eeyore. He hasn’t got a house. Everybody has a house except him.',
        'think',
      ),
      PG('We could build him one. Here, at Pooh Corner. Out of sticks.'),
      N(
        'There is a heap of sticks on the other side of the wood, in a sheltered spot. Nobody seems to be using it.',
      ),
      N(
        'You carry sticks. Your Nubbin carries one stick at a time, the long way round, for reasons of its own.',
      ),
      PG('It’s a very good house. Eeyore will be pleased.'),
      P('Nobody’s ever built him one before.', 'happy'),
    ],
    choices: [
      {
        id: 'wide',
        label: 'Make the doorway wide enough for a donkey.',
        then: [
          N('You make it wider. Pooh, remembering Rabbit’s, approves of wide doors in general.'),
        ],
      },
      {
        id: 'roof',
        label: 'Put a roof on, in case.',
        then: [
          PG('In case of snow? It already is snow.'),
          Y('In case of more.'),
          PG('Oh. Yes. There might be.'),
        ],
      },
      {
        id: 'last',
        label: 'Let your Nubbin choose the last stick.',
        then: [N('It chooses a crooked one. It looks right, somehow.')],
      },
    ],
  },
  'a11-11-snow-done': {
    lines: [N('The house stands at Pooh Corner, a little lopsided, in the snow.')],
  },
  'a11-11-missing': {
    lines: [
      N(
        'Meanwhile, at Christopher Robin’s door, Eeyore is standing in the snow, with snow on his back.',
      ),
      E(
        'I don’t want to complain. But it’s snowing, and I built a house, and now it isn’t there.',
        'sad',
      ),
      CR('Your house? Where was it?'),
      E(
        'Down by the wood. A house of sticks. I built it myself, in a sheltered spot. I came back and it had gone.',
      ),
      N(
        'You think of a heap of sticks in a sheltered spot. Something goes cold in your middle, and it isn’t the snow.',
      ),
      CR('Let’s go and look. Come on, Keeper.'),
      N(
        'You walk with them through the snow. Your Nubbin walks very close to your boots and doesn’t look anyone in the eye.',
      ),
    ],
  },
  'a11-11-missing-done': {
    lines: [
      N(
        'At Pooh Corner there is a house of sticks, standing up in the snow. Pooh and Piglet are admiring it.',
      ),
    ],
  },
  'a11-11-wind': {
    lines: [
      E('There. That’s my house. It’s here. And I built it there.', 'shock'),
      E(
        'The wind must have done it. Picked it up, all in one piece, over the wood, and set it down here.',
        'think',
      ),
      N(
        'Pooh and Piglet look at each other, and then at you. You say nothing, which, all things considered, is the kind thing.',
      ),
      E('And it’s better here. Not so draughty. The wind did a better job than I did.', 'happy'),
      E('Funny thing, wind. You never know.'),
      CR('It’s a lovely house, Eeyore.'),
      E(
        'It is, isn’t it. Better than before. Somebody somewhere must like me. I’d never have thought it.',
        'soft',
      ),
    ],
  },
  'a11-11-door': {
    lines: [
      N('Eeyore goes in, turns round, and comes out again to look at his door.'),
      N(
        'On the latch, tied in a careful double bow, is a blue ribbon. It was in the Useful Pot, and now it is here.',
      ),
      E('Keeps the door from banging. Useful. Like a Friend.', 'soft'),
    ],
  },
  'a11-11-complete': {
    lines: [
      N(
        'Pooh and Piglet walk home in the snow. For a long time neither of them says anything about the sticks.',
      ),
      PG('Pooh. Did we… take Eeyore’s house?'),
      P('We did. And then we gave it back, in a better place. I think that counts.', 'think'),
      PG('I think it counts too.', 'soft'),
      N(
        'Your Nubbin walks behind them in Pooh’s footprints all the way home, which takes a great deal of jumping.',
      ),
    ],
  },
  'a11-12-night': {
    lines: [
      N(
        'In the middle of the night, at Pooh’s house, there is a noise. You and your Nubbin, on the sofa, hear it first.',
      ),
      N(
        'It is a growly, wobbly sort of noise: the noise of something very pleased about something.',
      ),
      P('What is it? Is it you?', 'think'),
      N('It isn’t you. Pooh opens the door.'),
      T('Hallo! I’m Tigger. I’ve just come. Is this where everybody is?', 'happy'),
      N('Tigger sees the tablecloth, and has a fight with it, and wins, and is very proud.'),
      N(
        'Then he sees your Nubbin, and bounces it over, gently, to say hello. Your Nubbin bounces back.',
      ),
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
  'a11-12-night-done': {
    lines: [N('In the morning Pooh sets out a pot of honey for Tigger. The very best kind.')],
  },
  'a11-12-breakfast': {
    lines: [
      N(
        'Tigger takes a large mouthful of honey. Then he looks up at the ceiling, with his head on one side.',
      ),
      T('Ugh. Honey is far too sticky for a Tigger.', 'sad'),
      N('Pooh tries to sound sorry. He is secretly relieved, and has the rest himself.'),
      N(
        'So you all go to Piglet’s, where there are haycorns. Tigger takes a large mouthful, and his face goes slowly round.',
      ),
      T('Ee-ugh. They’re all corners. Tiggers don’t do corners.'),
      N(
        'So you go on to Eeyore’s, where there are thistles. Eeyore offers one, the way you offer a thing you hope will be refused.',
      ),
      N(
        'Tigger takes a large mouthful, and sits down, and puts a paw in his mouth, and takes it out again.',
      ),
      T('Ow! Prickly! That’s not a breakfast. That’s a punishment.', 'shock'),
      E('I see. Some of us eat them every day and don’t complain. Much.', 'sad'),
    ],
  },
  'a11-12-breakfast-done': {
    lines: [
      P('There’s nobody left but Kanga. She might have something. Kangas usually do.', 'think'),
    ],
  },
  'a11-12-malt': {
    lines: [
      N(
        'At Kanga’s house, Roo is having his medicine. He does not want it; he wants anything else.',
      ),
      RO(
        'Do I have to? It’s Extract of Malt. It’s brown, and it sticks to the spoon, and it goes on and on.',
      ),
      K('Just one spoonful, dear. It makes you big and strong.'),
      N('Tigger leans over Roo’s shoulder, sniffs, and takes the whole spoonful.'),
      N(
        'Kanga stares, and Roo stares. Your Nubbin, who has been staring at everything since the thistles, stares harder.',
      ),
      T('That’s it! That’s the one! That’s a Tigger breakfast!', 'happy'),
      RO('He can have mine! All of it! Always!', 'happy'),
      K('Well. I suppose he’d better stay, then. I’ll fetch another spoon.', 'soft'),
    ],
  },
  'a11-12-malt-done': {
    lines: [
      N(
        'So Tigger lives at Kanga’s from then on, and has Extract of Malt for breakfast, dinner and tea.',
      ),
    ],
  },
  'a11-12-complete': {
    lines: [
      P('So Tiggers like the one thing nobody else does. That’s very handy, really.', 'think'),
      T('And Tiggers like Keepers! And small bouncy whatever-they-ares! Bounce!', 'happy'),
      N(
        'Tigger bounces your Nubbin, gently, right over. It lands on its feet and looks, for the first time, as if it might bounce back on purpose.',
      ),
    ],
  },
  'a11-13-orders': {
    lines: [
      N('Rabbit is very busy, and likes it. He has a list, and a pencil, and a Captain’s face.'),
      R(
        'Small is missing. One of my friends-and-relations. A very small beetle. Nobody has seen him since yesterday.',
        'think',
      ),
      P('What does Small look like?'),
      R('Small.'),
      P('Ah. That helps.'),
      R(
        'Pooh, you search by the Six Pine Trees. Keeper, go with Pooh. Your Nubbin is low to the ground. That’s useful.',
      ),
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
  'a11-13-pit': {
    lines: [
      N(
        'Pooh walks along thinking about Small, and about honey, but mostly about honey, and doesn’t look where he is going.',
      ),
      N('You remember the pit by the Six Pine Trees. You remember it a moment too late.'),
      N('Pooh disappears with a whump. From down below comes a small, squeaky voice.'),
      PG('Help! Help! Something’s fallen on me! It’s… it’s the Heffalump!', 'shock'),
      P('It isn’t, Piglet. It’s me. I think. I hope.'),
      N(
        'You look over the edge. There is Pooh, and under Pooh there is Piglet, and both of them are looking up at you.',
      ),
      PG('Pooh, what are you doing in the Heffalump trap?'),
      P('Falling in it, mostly. What are you doing?'),
      PG('I was searching. Very Thoroughly. Under things.', 'sad'),
    ],
  },
  'a11-13-pit-done': {
    lines: [
      N(
        'Christopher Robin arrives at the top of the pit. He takes one look, and sits down on the edge to laugh.',
      ),
    ],
  },
  'a11-13-small': {
    lines: [
      CR('Out you come. Pooh, take my hand. Keeper, take his other paw.'),
      N('You heave. Up comes Pooh, and up comes Piglet after him, holding on to Pooh’s leg.'),
      N('Your Nubbin climbs up Pooh to help, stops in the middle of his back, and stares.'),
      N(
        'There, sitting quietly in Pooh’s fur, is a very small beetle, as if it has been waiting all morning for somebody to notice.',
      ),
      CR('Pooh! You’ve found Small!', 'happy'),
      P('Have I? Where was he?'),
      CR('On you.'),
      P('Ah. I thought something was looking at me.'),
    ],
  },
  'a11-13-complete': {
    lines: [
      R(
        'Found! Found by my search, which I organised. Well done, everybody. Especially me.',
        'happy',
      ),
      N(
        'Small says nothing, being a beetle, and goes back to his own business, which is very small.',
      ),
      P('I found him without looking. That’s the easiest way.', 'happy'),
      N(
        'Your Nubbin looks under every leaf on the way home anyway, in case there are other beetles who’d like to be found.',
      ),
    ],
  },
  'a11-14-climb': {
    lines: [
      N('Tigger is taking Roo for a walk, with Kanga’s permission and a bag of malt sandwiches.'),
      RO('Can Tiggers climb trees?'),
      T('Climb trees? Tiggers are the best tree-climbers there are. Better than Poohs.', 'happy'),
      N(
        'Up the tall pine goes Tigger, with Roo on his back, very fast. Your Nubbin sits at the bottom with its head right back.',
      ),
      N('Then Tigger looks down. He looks down for a long time.'),
      T(
        'Tiggers can climb up. That part’s easy. It’s the coming down. It’s not their best thing.',
        'shock',
      ),
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
        then: [
          N(
            'Your Nubbin climbs to the lowest branch, then the next, and sits there, halfway, for company. It can’t do more, and that’s all right.',
          ),
        ],
      },
      {
        id: 'run',
        label: 'Run for Christopher Robin.',
        then: [
          N(
            'You run. Pooh and Piglet are already coming, with Christopher Robin and Eeyore behind.',
          ),
        ],
      },
    ],
  },
  'a11-14-climb-done': {
    lines: [N('Soon everyone is standing at the bottom of the pine, looking up.')],
  },
  'a11-14-tunic': {
    lines: [
      N(
        'Christopher Robin takes off his tunic and holds it out under the tree like a sheet. Everyone takes an edge.',
      ),
      CR('You take that corner, Keeper. Pull it tight. Pooh, yours is sagging.'),
      P('It isn’t sagging. It’s having a little sit-down.'),
      CR('Roo first!'),
      N('Roo jumps, squeaking with joy, lands in the middle, and bounces right out and in again.'),
      RO('Again! Can I do it again?', 'happy'),
      CR('No. Now you, Tigger!'),
      T('In a moment. Tiggers like to think about jumping first. For quite a long time.'),
      N('Tigger thinks, and you hold your corner. Your arms begin to ache, and you don’t let go.'),
      N('Then Tigger jumps, all at once, the way he does everything.'),
    ],
  },
  'a11-14-tunic-done': {
    lines: [
      N(
        'There is a great crash. Everyone falls over in a heap, and somebody at the bottom of the heap says something gloomy.',
      ),
      E('Thank you. I was quite comfortable down here. Nobody need hurry.', 'sad'),
    ],
  },
  'a11-14-complete': {
    lines: [
      T('Did you see me? Tiggers can jump out of trees. It’s a thing they do. Easily.', 'happy'),
      CR('Let’s say it’s a thing they do with help.'),
      N(
        'Christopher Robin puts his tunic back on. It has a Tigger-shaped stretch in the middle now, and he says he likes it better.',
      ),
      N(
        'Your Nubbin finds it can’t get down the last bit of its branch either, and has to be lifted.',
      ),
    ],
  },
  'a11-15-note': {
    lines: [
      N(
        'Rabbit wakes up feeling important, as if everything depends on him. It is a very Captain-ish sort of morning.',
      ),
      R(
        'I shall go and see Christopher Robin. He’ll want to know what to do today, and I shall tell him.',
      ),
      N('But Christopher Robin isn’t at home. There is a note pinned to his door.'),
      N(
        'It says he has gone out, and will be back soon, and is busy. It is in Christopher Robin’s spelling, which is generous with its letters.',
      ),
      R(
        '“Backson.” What is a Backson? Gone out with a Backson? Is it some sort of animal?',
        'think',
      ),
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
  'a11-15-owl': {
    lines: [
      O('Ah. Yes. Let me see.', 'think'),
      N('Owl reads the note upside down, then the right way up, then holds it very far away.'),
      O(
        'A perfectly ordinary message. He has gone out. With a Backson. A busy one, by the look of it.',
      ),
      R('What does a Backson look like?'),
      O('Like any Backson. Large, I should think. With a… with a sort of look about it.'),
      R(
        'Owl may not know what a Backson is. But anyone who can spell the days of the week deserves a little respect.',
        'think',
      ),
      O('Tuesday. T, U… There is an S in it. There’s certainly a Y somewhere.'),
      N('Your Nubbin, who can’t spell anything, looks at Owl with great respect too.'),
    ],
  },
  'a11-15-owl-done': {
    lines: [R('Eeyore. Eeyore might have seen it. He sees most things, and complains about them.')],
  },
  'a11-15-a': {
    lines: [
      N(
        'Eeyore is standing over three sticks laid on the ground: two lean together at the top, and one goes across the middle.',
      ),
      E(
        'Do you know what that is? It’s an A. I made it. Nobody else in the Forest knows that.',
        'think',
      ),
      R('It’s an A. Of course it is. Everybody knows that.'),
      N('Rabbit says it airily, and Eeyore’s ears go down.'),
      E('Everybody. Oh. I thought it was something. Learning.', 'sad'),
      N(
        'You crouch down by the sticks with your Nubbin, and look at the A properly, the way it deserves.',
      ),
      E(
        'Christopher Robin taught me it. He goes out in the mornings now. To learn things. Then he comes and tells me one.',
      ),
      R('Learn? Then the Backson is… Christopher Robin is… Oh.', 'think'),
      N('Rabbit stands very still. It is the first time today he hasn’t been busy.'),
    ],
  },
  'a11-15-a-done': {
    lines: [
      E(
        'Somebody has to look after the A. In case he forgets it, wherever he goes to learn the others.',
        'soft',
      ),
    ],
  },
  'a11-15-complete': {
    lines: [
      N(
        'Christopher Robin comes home at lunchtime with ink on his fingers and a great many new words, some of them spelled right.',
      ),
      CR('Hallo! Did you see my note? I said I’d be back soon. And I am.', 'happy'),
      N(
        'He is. But Rabbit walks home slowly, thinking about mornings, and doesn’t organise anything for the rest of the day.',
      ),
      N('Your Nubbin stands guard over Eeyore’s A until Eeyore says it can go.'),
    ],
  },
  'a11-16-cone': {
    lines: [
      N(
        'Pooh is crossing the bridge with a fir-cone, thinking of a hum. He trips over nothing, and the fir-cone drops into the river.',
      ),
      P('Bother.'),
      N(
        'He goes to the other side to watch it float away. It comes out from under the bridge, which surprises him.',
      ),
      P(
        'That’s interesting. I dropped it on that side and it came out on this one. I wonder if it would do it again.',
        'think',
      ),
      N(
        'He drops two fir-cones at once, a big one and a small one, and runs across. The big one comes out first.',
      ),
      P('The big one won! I wanted the big one to win.', 'happy'),
      N(
        'Fir-cones are hard to tell apart, so he goes on with sticks. That is how the game of Poohsticks begins.',
      ),
    ],
  },
  'a11-16-game': {
    lines: [
      N('Soon everyone is playing: Pooh and Piglet, Rabbit and Roo, you and your Nubbin.'),
      CR('Everybody drop on “now”. Then everybody run to the other side. And no pushing, Roo.'),
      N(
        'Your Nubbin drops its stick. Then, before anyone can stop it, it drops itself in after it.',
      ),
      N(
        'It swims along beside its stick under the bridge, nudging it with its nose, in no hurry, enjoying the wet.',
      ),
      RO('That’s not fair! Is it fair? Can I do that?'),
      CR('No, Roo.'),
      P(
        'I think it’s fair. Nothing in the game says you can’t go with your stick. I should have thought of it.',
        'think',
      ),
      N(
        'Your Nubbin’s stick comes out first, and so does your Nubbin, very pleased and very wet. It shakes itself all over Piglet.',
      ),
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
  'a11-16-eeyore': {
    lines: [
      N(
        'Then something big and grey comes out from under the bridge. It is Eeyore, floating on his back, upside down, looking calm.',
      ),
      E(
        'Don’t mind me. I’m just being upside down in a river. It’s very restful. Nobody should bother.',
        'sad',
      ),
      CR('Eeyore, what are you doing there?'),
      E('Floating. In a river. On my back. Not by choice, if anybody wondered. Nobody did.'),
      P(
        'If I drop a big stone in beside him, it will make a wave, and the wave will wash him to the bank.',
        'think',
      ),
      PG('What if you hit him?'),
      P('I won’t. Probably.'),
      N(
        'The stone is too big for Pooh. You help him lift it, and your Nubbin pushes from underneath, and you hold it over the rail.',
      ),
      P('Now!'),
      N(
        'Splash: a great wave. Eeyore disappears, comes up, rolls over, and walks out on to the bank.',
      ),
    ],
  },
  'a11-16-bounced': {
    lines: [
      E('I was bounced. Into the river. Tigger bounced me.', 'angry'),
      N(
        'Tigger, arriving, says he only coughed. Everyone looks at Tigger, and Tigger looks at the sky.',
      ),
      T('Just a cough. A big Tigger cough. Eeyore happened to be in front of it.'),
      E('Hm. Some coughs are bouncier than others. That’s all I’m saying.'),
    ],
  },
  'a11-16-complete': {
    lines: [
      N(
        'Afterwards everyone plays Poohsticks again, Eeyore too, dripping. He wins twice and says it doesn’t count.',
      ),
      P(
        'The best thing about Poohsticks is that you can play it for ever, and it never gets any different.',
        'happy',
      ),
      N(
        'Your Nubbin sits on the rail watching the water go under: the same water, and new water, both at once.',
      ),
      CR(
        'You could have a bridge like this at home, you know. Any stream will do. And any sticks.',
      ),
    ],
  },
  'a11-17-plan': {
    lines: [
      R(
        'Tigger is getting very Bouncy. Too bouncy. Bouncing on Eeyore. Bouncing on everyone.',
        'angry',
      ),
      R(
        'Here is my plan. We take Tigger for a long walk, somewhere he’s never been, and lose him there. Then we go home.',
      ),
      P('Why?'),
      R(
        'So that next morning he’s a smaller Tigger. A sorry sort of Tigger. A Tigger who says thank you.',
      ),
      PG('That’s not very kind.'),
      R('It’s very kind. It’s for his own good. That’s the kindest sort.'),
      N(
        'A mist is coming up from the river, white and thick, and the Forest is going soft round the edges.',
      ),
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
        then: [
          T('Hooray! Tiggers like company. Especially company that doesn’t run off.', 'happy'),
        ],
      },
    ],
  },
  'a11-17-plan-done': {
    lines: [
      N(
        'Into the mist they all go: Rabbit leading, everybody following, and Tigger bouncing round the outside of everybody.',
      ),
    ],
  },
  'a11-17-mist': {
    lines: [
      N(
        'At the top of the Forest, in a hollow, Rabbit whispers “Now!”, and he and Pooh and Piglet duck behind a bank.',
      ),
      N('Tigger bounces on ahead without noticing. You go with him, because you said you would.'),
      T('Where’s everybody gone? Hallo? Rabbit? Pooh?', 'think'),
      T('They must have got lost. Poor things. Mist is very difficult if you aren’t a Tigger.'),
      N(
        'Tigger isn’t worried at all. He bounces along a short way home that his feet seem to know.',
      ),
      N(
        'At Kanga’s, Pooh and Piglet arrive soon after, damp, following the smell of honey. Rabbit isn’t with them.',
      ),
      T('Rabbit? Lost? In the mist? Don’t worry. Tiggers never get lost. I’ll fetch him.', 'happy'),
      N(
        'He bounces off into the white. You go after him, holding your Nubbin close, so the mist can’t have it.',
      ),
    ],
  },
  'a11-17-found': {
    lines: [
      N(
        'You hear him before you see him: a small voice in a hollow, saying “Hallo?” to the mist, very bravely.',
      ),
      T('Rabbit! There you are! I’ve come to find you. Tiggers are good at finding.', 'happy'),
      N('Rabbit comes out of the hollow and looks at Tigger. For once, he hasn’t got a plan.'),
      R('Tigger. Oh, Tigger. I am glad to see you.', 'soft'),
    ],
  },
  'a11-17-complete': {
    lines: [
      N(
        'Tigger takes everyone home, bouncing, by a way that is short and obvious once you’ve been shown it.',
      ),
      R('He’s still very bouncy. Too bouncy.', 'think'),
      N('Rabbit says it quietly, the way people say a thing they don’t quite mean any more.'),
      T('Tiggers don’t get lost. Tiggers find. That’s what Tiggers are for.', 'happy'),
    ],
  },
  'a11-18-wind': {
    lines: [
      N(
        'It is a very windy day. Piglet’s ears stream out behind him like flags, and he has to hold on to Pooh.',
      ),
      PG('What if a tree fell, Pooh? While we were under it?', 'shock'),
      P('Then we’d be under it. But it mightn’t. Most trees stay up. That’s what they’re best at.'),
      N(
        'You all reach The Chestnuts and go in. Owl tells a long story about a great-uncle who once flew backwards through a wind like this.',
      ),
      N(
        'Then there is a great crash, and the room tips over, slowly, and everything slides into one corner, including you.',
      ),
      N(
        'When it stops, the floor is a wall, the wall is the floor, and the door is in the ceiling.',
      ),
      PG('Pooh? Is it… is it still the same day?', 'shock'),
      O('My house. My house is on its side. This has never happened to me before.', 'sad'),
    ],
    choices: [
      {
        id: 'check',
        label: 'Check everyone’s all right.',
        then: [
          N(
            'Everyone is all right: Owl is ruffled, and Pooh is sitting on the tablecloth. Your Nubbin is under a chair, pleased to be found.',
          ),
        ],
      },
      {
        id: 'out',
        label: 'Look for a way out.',
        then: [
          N(
            'The windows are full of branches. There is only the letter-box, high up in what used to be the door.',
          ),
        ],
      },
      {
        id: 'hand',
        label: 'Hold Piglet’s hand.',
        then: [PG('Th-thank you. I’m not frightened. My hand is.', 'soft')],
      },
    ],
  },
  'a11-18-wind-done': {
    lines: [
      P(
        'The letter-box. It’s very high up and very small. Only somebody very small could get through it.',
        'think',
      ),
    ],
  },
  'a11-18-letterbox': {
    lines: [
      N('Everyone looks at Piglet. Piglet looks at the letter-box, and gets smaller.'),
      PG('M-me? Through there? And then what?'),
      P('Then you fetch Christopher Robin, and he gets us out.'),
      O('I shall tie a string round you. My knots are well known.'),
      N(
        'Owl ties the string, and Pooh holds the end. You hold the end of Pooh, and your Nubbin holds the end of you.',
      ),
      N('Slowly, carefully, you all pull, and up goes Piglet to the letter-box in the ceiling.'),
      PG('I’m here. It’s very small. It’s very, very small.', 'shock'),
      N(
        'He squeezes, and wriggles, and goes through with a squeak. You hear him scramble down the tree outside.',
      ),
      PG('I’m going for Christopher Robin! I’m n-not frightened! Only a bit!'),
    ],
  },
  'a11-18-letterbox-done': {
    lines: [
      N(
        'Not long after, Christopher Robin arrives with a ladder, and Piglet arrives with Christopher Robin, very proud and trying not to be.',
      ),
    ],
  },
  'a11-18-house': {
    lines: [
      N(
        'Afterwards Pooh makes up a long hum about Piglet’s Very Grand Thing. You hear all seven verses of it, as humming.',
      ),
      N(
        'Piglet listens to every one, going pink at the bits about himself, and at the end he asks to hear it again.',
      ),
      O('I shall need a new house. A suitable residence. With a knocker.', 'sad'),
      E('Leave it to me. I know the Forest. I go everywhere, mostly alone.'),
      N(
        'Eeyore goes off, and comes back the next day, and leads you all to a beech tree, very pleased with himself.',
      ),
      E(
        'There. A house. Nobody using it, I should think. It’s got a name on and everything. And a step.',
        'happy',
      ),
      N('It is Piglet’s house. Everybody knows it is Piglet’s house, except Eeyore.'),
      N(
        'Piglet looks at his house for a long time. Then he looks at Eeyore, who is happier than anybody has ever seen him.',
      ),
    ],
  },
  'a11-18-house-done': {
    lines: [
      PG('Yes. It’s just the house for Owl. I hope he’ll be very happy in it.', 'soft'),
      N(
        'Piglet says it bravely, because he is brave, and then he has to look at the ground for a while.',
      ),
    ],
  },
  'a11-18-complete': {
    lines: [
      P('Piglet. You could come and live with me. Will you?', 'soft'),
      PG('Oh, Pooh. Yes. Thank you, Pooh.', 'happy'),
      N(
        'So Owl moves into Piglet’s old house, and gives it a grand new name, and spells it wrong.',
      ),
      N(
        'Your Nubbin carries Piglet’s smallest chair to Pooh’s house, the long way round, as carefully as if it were made of eggs.',
      ),
    ],
  },
  'a11-19-meeting': {
    lines: [
      N(
        'Christopher Robin is going away. Nobody knows how they know it, and nobody says it, but everybody knows.',
      ),
      N('Even Small knows, though he isn’t saying much. He never does.'),
      R(
        'A Meeting has been called. By me. To pass a Resolution. Eeyore has written a poem for it.',
        'think',
      ),
      E('A Rissolution. That’s what it is. A poem. Don’t expect much.', 'sad'),
      N(
        'Eeyore reads it out. It is long, and it rhymes in places, and it says, more or less, that they will all miss him.',
      ),
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
        then: [
          N(
            'Your Nubbin dips a paw in Owl’s ink and presses it carefully at the bottom: slightly crooked, and entirely its own.',
          ),
        ],
      },
      {
        id: 'pooh',
        label: 'Help Pooh with his letters.',
        then: [P('P, O, O, H. Is that right? It looks right. It looks like me.', 'happy')],
      },
    ],
  },
  'a11-19-signed': {
    lines: [
      N('Tigger signs next to you, with a T that bounces right off the edge of the paper.'),
      T('Is he coming back? He’s coming back. Isn’t he?', 'think'),
      N('Nobody answers. Tigger bounces once, very small, to show he doesn’t mind.'),
    ],
  },
  'a11-19-scroll': {
    lines: [
      N(
        'Rabbit rolls up the scroll. Then he stops, because something is already round it: a blue ribbon, tied in a careful double bow.',
      ),
      E('I had it in my pot. Seemed right. It’s a Friend ribbon. He’ll know what it says.', 'soft'),
      N(
        'Everyone walks to Christopher Robin’s house together. At the door, nobody wants to go first.',
      ),
      N(
        'In the end Eeyore goes first, because it is his poem, and everybody else crowds in behind him.',
      ),
      CR('What’s this?'),
      E('It’s a Rissolution. From all of us. You read it. We’ll just… we’ll go.', 'sad'),
      N(
        'Christopher Robin reads it right to the end, and all the names, and he doesn’t say anything for a moment.',
      ),
      CR('Thank you. All of you. Thank you.', 'soft'),
    ],
  },
  'a11-19-scroll-done': {
    lines: [
      N('Then everyone goes away, quietly, one by one, until only Pooh is left.'),
      N(
        'You go and wait by the gate with your Nubbin. Nobody asked you to, but it seems the right place to be.',
      ),
    ],
  },
  'a11-19-complete': {
    lines: [
      N('After a while Christopher Robin comes out. Pooh is with him.'),
      CR(
        'We’re going for a walk. To the top of the Forest. Will you come? Some of the way?',
        'soft',
      ),
      N('Your Nubbin is already on its feet.'),
    ],
  },
  'a11-20-climb': {
    lines: [
      N(
        'Christopher Robin and Pooh walk up through the Forest, and you walk a little way behind, with your Nubbin.',
      ),
      N(
        'Nobody is in a hurry. Christopher Robin points things out, the way you do when you want to remember the way.',
      ),
      CR('Pooh. Of all the things there are to do, what do you like best?', 'think'),
      P(
        'Coming round to yours. And you saying there’s honey. And there being honey. And Piglet. Mostly that.',
      ),
      CR('I like that too. But what I like best of all is doing Nothing.'),
      P('Nothing? What does Nothing look like, when you’re doing it?', 'think'),
      CR(
        'It’s when you go out for no reason, and come back for no reason, and the whole day in between is yours.',
      ),
      P('Oh. I do that a lot.', 'happy'),
      CR('I know. You’re very good at it.'),
      N(
        'They come out at the top of the Forest. There is a ring of trees there, sixty-something of them, standing round as if they’ve been waiting.',
      ),
      N(
        'Nobody has ever been able to count them: sixty-three, or sixty-four. It changes a little every time you try.',
      ),
    ],
    choices: [
      {
        id: 'count',
        label: 'Count the trees.',
        then: [
          N(
            'You count sixty-three, then again, and get sixty-four. Your Nubbin, counting on its paws, gives up at four and is content.',
          ),
        ],
      },
      {
        id: 'look',
        label: 'Don’t count them. Just look.',
        then: [
          N(
            'You don’t count them. It seems like the kind of place that would rather not be counted.',
          ),
        ],
      },
    ],
  },
  'a11-20-knight': {
    lines: [
      N(
        'At the edge of the circle you stop. Your Nubbin stops too, and sits down without being told.',
      ),
      N(
        'Christopher Robin and Pooh go into the middle, where the grass is soft, and sit, and talk about everything.',
      ),
      N(
        'Kings and queens, and a thing called Factors, and a place called Brazil. Pooh listens, and doesn’t mind not knowing.',
      ),
      CR('Pooh. Stand up.'),
      N('Christopher Robin takes a stick and touches Pooh on each shoulder with it, very gravely.'),
      CR('Arise, Sir Pooh. Knight of the Forest, and my truest friend.'),
      N(
        'Pooh rises, and thinks about being a knight, and decides he likes it, though he isn’t sure what it involves.',
      ),
      N('Then Christopher Robin is quiet for a long time, looking at the trees.'),
      CR('Pooh. Will you remember me, always? Even when I am grown up and enormous?', 'soft'),
      P('Will I be enormous too?', 'think'),
      CR('No. You’ll be just the right size.'),
      P('Then I promise.', 'soft'),
      CR('And if I’m not here so much, you’ll know it isn’t because of you. Won’t you?'),
      P('I shall know. Even if I don’t know why.'),
    ],
  },
  'a11-20-knight-done': {
    lines: [
      N('Christopher Robin laughs, and jumps up, and holds out his hand. Pooh takes it.'),
      CR('Come on, Pooh.'),
      P('Where?'),
      CR('Anywhere.', 'happy'),
    ],
  },
  'a11-20-complete': {
    lines: [
      N(
        'Christopher Robin and Pooh go off together, out of the far side of the circle. You don’t follow, because this bit is theirs.',
      ),
      N(
        'On the way up, Christopher Robin gave your Nubbin back its blue ribbon, off the scroll. Now it ties it round the nearest tree.',
      ),
      N(
        'Whatever comes next for them, there is a ring of trees at the top of the Forest that nobody can count.',
      ),
      N('A boy and his Bear are playing in it. Nobody ever stops them.', 'soft'),
      N('The page settles under your hand, gently, like a door somebody is careful not to bang.'),
      N(
        'You are back in the Grove, with Nova’s atlas on your knee and a stick in your Nubbin’s mouth that wasn’t there before.',
      ),
      N(
        'Down by the Grove stream there is a little wooden bridge that wasn’t there this morning. A bit of blue ribbon is tied to its rail.',
      ),
    ],
  },
  'a11-11-door-thistle': {
    lines: [
      N('Eeyore goes in, turns round, and comes out again to look at his step.'),
      N(
        'Beside the step, its purple top just showing through the snow, is the thistle your Nubbin gave him. He has planted it.',
      ),
      E(
        'I didn’t eat it. I thought it ought to have somewhere to live. Everybody should, it turns out.',
        'soft',
      ),
    ],
  },
  'a11-11-door-sat': {
    lines: [
      N('Eeyore goes in, turns round, comes out again, and sits down on his new step.'),
      N(
        'Then he shuffles to one side. There is a space left exactly the size of you, and a smaller one beside it.',
      ),
      E('I kept you a place. In case. Not that you have to. Sit, I mean.', 'soft'),
    ],
  },
  'a11-16-bounced-sat': {
    lines: [
      N(
        'Eeyore stands dripping on the bank. He looks round at everybody, and then, slowly, at you.',
      ),
      E('You tell them. You’re the one who sits. They’ll believe you.', 'soft'),
      N(
        'So you tell them, plainly, that Eeyore was bounced. Everyone listens, and Eeyore stands a little taller while you say it.',
      ),
      N(
        'Tigger, arriving, says he only coughed. Everyone looks at Tigger, and Tigger looks at the sky.',
      ),
      T('Well. It was a bouncy sort of cough. Sorry, Eeyore.', 'sad'),
      E('Hm. That’s the first sorry I’ve had this year. I shall keep it.', 'soft'),
    ],
  },
  'a11-17-mist-rabbit': {
    lines: [
      N(
        'At the top of the Forest, in a hollow, Rabbit whispers “Now!”, and you duck behind a bank with him and Pooh and Piglet.',
      ),
      N(
        'Tigger bounces on without noticing. His bounces get further off, and then there are no bounces at all.',
      ),
      R('There. Now we go home.', 'happy'),
      N(
        'Rabbit leads you all home. After a while you pass a sand-pit, and after a while longer you pass the same sand-pit again.',
      ),
      P(
        'Every time we try to get away from this pit, we find it. So if we tried to find it, we might get away.',
        'think',
      ),
      R('Nonsense. I’ll walk away from it and come straight back, and you’ll see.'),
      N('Rabbit walks off into the mist to prove it, and doesn’t come back.'),
      N(
        'Pooh hears his honey calling him from far off, and he and Piglet follow it home. You don’t, because Rabbit is out there on his own.',
      ),
      N(
        'So you go after him, with your Nubbin, into the white. You find him in a hollow, small and damp, listening to every noise.',
      ),
      R(
        'Is that you? Oh. Good. I wasn’t lost. I was waiting for somebody to come. That’s all.',
        'sad',
      ),
    ],
  },
  'a11-17-found-rabbit': {
    lines: [
      N(
        'You sit with Rabbit in the hollow while the mist drips. Rabbit doesn’t say anything, and neither do you.',
      ),
      N(
        'Then, far off, you hear it before Rabbit does: a bounce, and another. Then a voice, calling.',
      ),
      Y('Listen.'),
      T('Rabbit? Keeper? Tiggers are good at finding! I can hear you being quiet!', 'happy'),
      R('Tigger. Oh, Tigger. I am glad to see you.', 'soft'),
    ],
  },
  'a11-19-signed-rabbit': {
    lines: [
      N('Rabbit signs next to you, very neatly, and then stays there, and clears his throat.'),
      R(
        'About the mist. In the hollow. I was grateful for the company. That’s all. It has been noted.',
        'soft',
      ),
      N('He goes back to his list at once, and doesn’t look up for some time.'),
    ],
  },
  'a11-19-scroll-thistle': {
    lines: [
      N(
        'Rabbit rolls up the scroll. Something falls out of it: a thistle, pressed flat, its purple top gone pale.',
      ),
      E('I put that in. From my step. It’s not much. Well. It is, actually.', 'soft'),
      N(
        'Everyone walks to Christopher Robin’s house together. At the door, nobody wants to go first.',
      ),
      N(
        'In the end Eeyore goes first, because it is his poem, and everybody else crowds in behind him.',
      ),
      CR('What’s this?'),
      E('It’s a Rissolution. From all of us. You read it. We’ll just… we’ll go.', 'sad'),
      N(
        'Christopher Robin reads it right to the end, and all the names, and he doesn’t say anything for a moment.',
      ),
      CR('Thank you. All of you. Thank you.', 'soft'),
    ],
  },
  'a11-19-scroll-sat': {
    lines: [
      N(
        'Rabbit rolls up the scroll. Eeyore stops him with a hoof, asks for it back, and adds one more line at the bottom.',
      ),
      E('Somebody sat with me.', 'soft'),
      N('He doesn’t explain it. He hands it back, and doesn’t look at you, and doesn’t need to.'),
      N(
        'Everyone walks to Christopher Robin’s house together. At the door, nobody wants to go first.',
      ),
      N(
        'In the end Eeyore goes first, because it is his poem, and everybody else crowds in behind him.',
      ),
      CR('What’s this?'),
      E('It’s a Rissolution. From all of us. You read it. We’ll just… we’ll go.', 'sad'),
      N(
        'Christopher Robin reads it right to the end, and all the names, and he doesn’t say anything for a moment.',
      ),
      CR('Thank you. All of you. Thank you.', 'soft'),
    ],
  },
  'a11-20-complete-thistle': {
    lines: [
      N(
        'Christopher Robin and Pooh go off together, out of the far side of the circle. You don’t follow, because this bit is theirs.',
      ),
      N(
        'Your Nubbin has carried something up the hill: a thistle head from Eeyore’s step. It plants it at the edge of the circle and pats the earth down.',
      ),
      N(
        'Whatever comes next for them, there is a ring of trees at the top of the Forest that nobody can count.',
      ),
      N('A boy and his Bear are playing in it. Nobody ever stops them.', 'soft'),
      N('The page settles under your hand, gently, like a door somebody is careful not to bang.'),
      N(
        'You are back in the Grove, with Nova’s atlas on your knee and a stick in your Nubbin’s mouth that wasn’t there before.',
      ),
      N(
        'Down by the Grove stream there is a little wooden bridge that wasn’t there this morning. A thistle is coming up at the far end.',
      ),
    ],
  },
  'a11-20-complete-sat': {
    lines: [
      N(
        'Christopher Robin and Pooh go off together, out of the far side of the circle. You don’t follow, because this bit is theirs.',
      ),
      N(
        'Your Nubbin turns round three times in the grass at the edge of the circle, and sits. It leaves a flattened round, like the one by Eeyore’s step.',
      ),
      N(
        'Whatever comes next for them, there is a ring of trees at the top of the Forest that nobody can count.',
      ),
      N('A boy and his Bear are playing in it. Nobody ever stops them.', 'soft'),
      N('The page settles under your hand, gently, like a door somebody is careful not to bang.'),
      N(
        'You are back in the Grove, with Nova’s atlas on your knee and a stick in your Nubbin’s mouth that wasn’t there before.',
      ),
      N(
        'Down by the Grove stream there is a little wooden bridge that wasn’t there this morning. One place on its parapet is worn smooth, just right for sitting.',
      ),
    ],
  },
  'a11-margin-hazel': {
    lines: [
      N(
        'Nova’s atlas lies open at the last page of the Forest, where the ring of trees stands on top of the hill.',
      ),
      N(
        'Beside the trees, in soft pencil you have never noticed, there is a note in the margin. You know the hand.',
      ),
      N(
        '“Read this to the little one, the summer they stayed. They asked where Christopher Robin went.”',
      ),
      N('“Somewhere, I said. Not away.”', 'soft'),
      N('And under it, one letter: H.'),
      N('You don’t remember that summer. Or you do, a little: a lap, a voice, a page turning.'),
      N(
        'Your Nubbin climbs into your lap. You sit with the page open for a long time, and it waits with you.',
      ),
    ],
  },
};

const QUEST_DEFS: { of: string; title: string; goals: EduQuest['goals']; scenes: string[] }[] = [
  {
    of: 'a11-01',
    title: 'A Bear on the Stairs',
    goals: {
      'a11-01-s1': {
        goal: 'Step into the pencil Forest and meet the boy at its edge.',
        hint: 'Touch the page, then walk up the path to the boy with the bear.',
      },
      'a11-01-s2': {
        goal: 'Hold the balloon string while Pooh floats up to the bees.',
        hint: 'Stand under the tall oak and keep both hands on the string.',
      },
      'a11-01-s3': {
        goal: 'Help get Pooh down again, without laughing.',
        hint: 'Keep the string steady while Christopher Robin aims his popgun.',
      },
    },
    scenes: [
      'a11-01-page',
      'a11-01-page-done',
      'a11-01-balloon',
      'a11-01-balloon-done',
      'a11-01-bees',
      'a11-01-bees-done',
      'a11-01-complete',
    ],
  },
  {
    of: 'a11-02',
    title: 'A Tight Place',
    goals: {
      'a11-02-s1': {
        goal: 'Go visiting with Pooh, to Rabbit’s.',
        hint: 'Follow Pooh along the sandbank to the hole in it.',
      },
      'a11-02-s2': {
        goal: 'Fetch Christopher Robin to look at the stuck bear.',
        hint: 'Run up the path to Christopher Robin’s house, then walk him back.',
      },
      'a11-02-s3': {
        goal: 'Read to Pooh while he gets thinner.',
        hint: 'Sit by Pooh’s head and pick something to read; the week passes as the story goes on.',
      },
    },
    scenes: [
      'a11-02-visit',
      'a11-02-visit-done',
      'a11-02-stuck',
      'a11-02-stuck-done',
      'a11-02-week',
      'a11-02-week-done',
      'a11-02-complete',
    ],
  },
  {
    of: 'a11-03',
    title: 'The Woozle',
    goals: {
      'a11-03-s1': {
        goal: 'Follow Pooh round the spinney after the mysterious tracks.',
        hint: 'Walk round the larch spinney in the snow behind Pooh and Piglet. Don’t spoil it.',
      },
      'a11-03-s2': {
        goal: 'Watch from the oak with Christopher Robin until they work it out.',
        hint: 'Climb the big oak by the spinney and keep quiet.',
      },
    },
    scenes: [
      'a11-03-tracks',
      'a11-03-tracks-done',
      'a11-03-count',
      'a11-03-count-done',
      'a11-03-complete',
    ],
  },
  {
    of: 'a11-04',
    title: 'Eeyore’s Tail',
    goals: {
      'a11-04-s1': {
        goal: 'Find out what is wrong with Eeyore.',
        hint: 'Eeyore stands in the thistly corner of the Forest.',
      },
      'a11-04-s2': {
        goal: 'Go with Pooh to ask Owl.',
        hint: 'Owl lives at The Chestnuts, high in a tree, behind the grandest door in the Forest.',
      },
      'a11-04-s3': {
        goal: 'Hold the tail straight while Christopher Robin nails it back on.',
        hint: 'Carry the tail back to the thistles and hold it where Christopher Robin points.',
      },
    },
    scenes: [
      'a11-04-gloomy',
      'a11-04-gloomy-done',
      'a11-04-owl',
      'a11-04-owl-done',
      'a11-04-nail',
      'a11-04-nail-done',
      'a11-04-complete',
    ],
  },
  {
    of: 'a11-05',
    title: 'The Heffalump Trap',
    goals: {
      'a11-05-s1': {
        goal: 'Help Pooh and Piglet dig a Very Deep Pit by the Six Pine Trees.',
        hint: 'Dig where Pooh points; Piglet supervises the supervising.',
      },
      'a11-05-s2': {
        goal: 'Keep the lantern steady while Pooh checks on the honey in the night.',
        hint: 'Walk with Pooh to the Six Pine Trees and hold the lantern still.',
      },
      'a11-05-s3': {
        goal: 'Let Piglet meet the Heffalump. Don’t explain.',
        hint: 'Stay by the pit with the lantern and let the morning happen.',
      },
    },
    scenes: [
      'a11-05-dig',
      'a11-05-dig-done',
      'a11-05-night',
      'a11-05-night-done',
      'a11-05-morning',
      'a11-05-morning-done',
      'a11-05-complete',
    ],
  },
  {
    of: 'a11-06',
    title: 'Eeyore’s Birthday',
    goals: {
      'a11-06-s1': {
        goal: 'Find out why Eeyore is gloomier than usual.',
        hint: 'Eeyore is down by the stream, looking at himself in the water.',
      },
      'a11-06-s2': {
        goal: 'Go with Pooh and Piglet to fetch presents.',
        hint: 'Carry the honey pot for Pooh as far as he lets you.',
      },
      'a11-06-s3': {
        goal: 'Choose what your Nubbin gives Eeyore.',
        hint: 'There is no wrong present. Nothing at all is one of the choices.',
      },
    },
    scenes: [
      'a11-06-stream',
      'a11-06-presents',
      'a11-06-presents-done',
      'a11-06-gift',
      'a11-06-gift-done',
      'a11-06-complete',
    ],
  },
  {
    of: 'a11-07',
    title: 'Kanga and Baby Roo',
    goals: {
      'a11-07-s1': {
        goal: 'Listen to Rabbit’s plan about the newcomers.',
        hint: 'Rabbit is holding a meeting by his front door. He has a list.',
      },
      'a11-07-s2': {
        goal: 'Make sure Roo has a nice time in Rabbit’s pocket.',
        hint: 'Run alongside Rabbit to his burrow and keep Roo company.',
      },
      'a11-07-s3': {
        goal: 'Go back and see how Piglet is getting on.',
        hint: 'Kanga’s house is by the Sandy Pit.',
      },
    },
    scenes: [
      'a11-07-plan',
      'a11-07-plan-done',
      'a11-07-swap',
      'a11-07-swap-done',
      'a11-07-bath',
      'a11-07-bath-done',
      'a11-07-complete',
    ],
  },
  {
    of: 'a11-08',
    title: 'The Expotition',
    goals: {
      'a11-08-s1': {
        goal: 'Join Christopher Robin’s Expotition to the North Pole.',
        hint: 'Christopher Robin is outside his house, in his Big Boots.',
      },
      'a11-08-s2': {
        goal: 'Help get Roo out of the stream.',
        hint: 'Take the other end of Pooh’s pole and hold it across the water.',
      },
      'a11-08-s3': {
        goal: 'Help Christopher Robin mark the spot.',
        hint: 'Push the pole into the bank where Christopher Robin points.',
      },
    },
    scenes: [
      'a11-08-setoff',
      'a11-08-roo',
      'a11-08-roo-done',
      'a11-08-pole',
      'a11-08-pole-done',
      'a11-08-complete',
    ],
  },
  {
    of: 'a11-09',
    title: 'Entirely Surrounded by Water',
    goals: {
      'a11-09-s1': {
        goal: 'Find out where Piglet is, in all this rain.',
        hint: 'Watch the flood from the high bank across from Piglet’s beech tree.',
      },
      'a11-09-s2': {
        goal: 'Help Pooh get the message to Christopher Robin.',
        hint: 'Paddle the wash-tub alongside the Floating Bear to the hill where Christopher Robin lives.',
      },
      'a11-09-s3': {
        goal: 'Sail The Brain of Pooh to Piglet’s tree.',
        hint: 'Keep your wash-tub beside the umbrella, and look out for Piglet’s window.',
      },
    },
    scenes: [
      'a11-09-rain',
      'a11-09-rain-done',
      'a11-09-bear',
      'a11-09-bear-done',
      'a11-09-umbrella',
      'a11-09-umbrella-done',
      'a11-09-complete',
    ],
  },
  {
    of: 'a11-10',
    title: 'The Pooh Party',
    goals: {
      'a11-10-s1': {
        goal: 'Help Owl tell everyone about the party.',
        hint: 'Go round the Forest with Owl, and tell everyone again in words they can follow.',
      },
      'a11-10-s2': {
        goal: 'Set the long table, and save Eeyore a seat at the end.',
        hint: 'Lay the plates down the long table, then put a cushion on the last chair.',
      },
    },
    scenes: ['a11-10-invites', 'a11-10-table', 'a11-10-table-done', 'a11-10-complete'],
  },
  {
    of: 'a11-11',
    title: 'A House at Pooh Corner',
    goals: {
      'a11-11-s1': {
        goal: 'Help Pooh and Piglet build Eeyore a house.',
        hint: 'Carry sticks from the heap on the other side of the wood to Pooh Corner.',
      },
      'a11-11-s2': {
        goal: 'Go with Christopher Robin and Eeyore to look for Eeyore’s missing house.',
        hint: 'Walk Eeyore through the snow to Pooh Corner.',
      },
      'a11-11-s3': {
        goal: 'Let Eeyore work it out his own way.',
        hint: 'Stand back and let Eeyore look at the house.',
      },
    },
    scenes: [
      'a11-11-snow',
      'a11-11-snow-done',
      'a11-11-missing',
      'a11-11-missing-done',
      'a11-11-wind',
      'a11-11-door',
      'a11-11-complete',
    ],
  },
  {
    of: 'a11-12',
    title: 'Tigger Comes to the Forest',
    goals: {
      'a11-12-s1': {
        goal: 'Find out what is making that noise at Pooh’s door.',
        hint: 'You are staying the night at Pooh’s. Open the door.',
      },
      'a11-12-s2': {
        goal: 'Help Tigger try honey, haycorns and thistles.',
        hint: 'Go from Pooh’s to Piglet’s to Eeyore’s with Tigger.',
      },
      'a11-12-s3': {
        goal: 'Take Tigger to Kanga’s for one last try.',
        hint: 'Kanga’s house is by the Sandy Pit. Roo is having his medicine.',
      },
    },
    scenes: [
      'a11-12-night',
      'a11-12-night-done',
      'a11-12-breakfast',
      'a11-12-breakfast-done',
      'a11-12-malt',
      'a11-12-malt-done',
      'a11-12-complete',
    ],
  },
  {
    of: 'a11-13',
    title: 'The Search for Small',
    goals: {
      'a11-13-s1': {
        goal: 'Get your orders from Captain Rabbit.',
        hint: 'Rabbit has a list, a pencil and a Captain’s face.',
      },
      'a11-13-s2': {
        goal: 'Search by the Six Pine Trees, where the old pit is.',
        hint: 'Walk with Pooh to the Six Pine Trees. Mind the pit.',
      },
      'a11-13-s3': {
        goal: 'Help everyone out of the pit, and look carefully at Pooh.',
        hint: 'Take one of Pooh’s paws while Christopher Robin takes the other.',
      },
    },
    scenes: ['a11-13-orders', 'a11-13-pit', 'a11-13-pit-done', 'a11-13-small', 'a11-13-complete'],
  },
  {
    of: 'a11-14',
    title: 'Tiggers Don’t Climb Trees',
    goals: {
      'a11-14-s1': {
        goal: 'Follow Tigger and Roo into the Forest.',
        hint: 'They went towards the tall pines with a bag of sandwiches.',
      },
      'a11-14-s2': {
        goal: 'Hold one corner of the tunic while Tigger jumps.',
        hint: 'Pull your corner tight and don’t let go, however long Tigger thinks about it.',
      },
    },
    scenes: [
      'a11-14-climb',
      'a11-14-climb-done',
      'a11-14-tunic',
      'a11-14-tunic-done',
      'a11-14-complete',
    ],
  },
  {
    of: 'a11-15',
    title: 'Rabbit’s Busy Day',
    goals: {
      'a11-15-s1': {
        goal: 'Go with Rabbit to Christopher Robin’s house.',
        hint: 'Rabbit is off to tell Christopher Robin what to do today.',
      },
      'a11-15-s2': {
        goal: 'Ask Owl what the note means.',
        hint: 'Take the note to The Chestnuts.',
      },
      'a11-15-s3': {
        goal: 'Ask Eeyore, who has been learning something with sticks.',
        hint: 'Eeyore is standing over three sticks in the Gloomy Place.',
      },
    },
    scenes: [
      'a11-15-note',
      'a11-15-owl',
      'a11-15-owl-done',
      'a11-15-a',
      'a11-15-a-done',
      'a11-15-complete',
    ],
  },
  {
    of: 'a11-16',
    title: 'Poohsticks',
    goals: {
      'a11-16-s1': {
        goal: 'Watch Pooh invent a game on the bridge.',
        hint: 'Pooh is on the little wooden bridge with a fir-cone.',
      },
      'a11-16-s2': {
        goal: 'Play Poohsticks with everyone on the bridge.',
        hint: 'Drop your stick on “now”, then run to the other side to see whose comes out first.',
      },
      'a11-16-s3': {
        goal: 'Help Pooh wash Eeyore to the bank.',
        hint: 'Help lift the big stone to the rail and drop it beside Eeyore, not on him.',
      },
    },
    scenes: ['a11-16-cone', 'a11-16-game', 'a11-16-eeyore', 'a11-16-bounced', 'a11-16-complete'],
  },
  {
    of: 'a11-17',
    title: 'Tigger Is Unbounced',
    goals: {
      'a11-17-s1': {
        goal: 'Hear Rabbit’s plan, and choose whom to walk with.',
        hint: 'Your choice decides where you are when the mist comes down.',
      },
      'a11-17-s2': {
        goal: 'Get through the mist.',
        hint: 'Stay close to whoever you are with, and listen.',
      },
    },
    scenes: ['a11-17-plan', 'a11-17-plan-done', 'a11-17-mist', 'a11-17-found', 'a11-17-complete'],
  },
  {
    of: 'a11-18',
    title: 'Piglet Does a Very Grand Thing',
    goals: {
      'a11-18-s1': {
        goal: 'Visit Owl with Pooh and Piglet on a very windy day.',
        hint: 'Hold on to something on the way to The Chestnuts.',
      },
      'a11-18-s2': {
        goal: 'Hold the string while Piglet climbs out through the letter-box.',
        hint: 'Take your place on the string behind Pooh and pull slowly.',
      },
      'a11-18-s3': {
        goal: 'Help Eeyore find a new house for Owl.',
        hint: 'Follow Eeyore through the Forest. He is very pleased with what he has found.',
      },
    },
    scenes: [
      'a11-18-wind',
      'a11-18-wind-done',
      'a11-18-letterbox',
      'a11-18-letterbox-done',
      'a11-18-house',
      'a11-18-house-done',
      'a11-18-complete',
    ],
  },
  {
    of: 'a11-19',
    title: 'The Rissolution',
    goals: {
      'a11-19-s1': {
        goal: 'Go to the meeting Rabbit has called, and sign the Rissolution.',
        hint: 'Everyone is gathered at Pooh Corner. Sign at the bottom, any way you like.',
      },
      'a11-19-s2': {
        goal: 'Take the Rissolution to Christopher Robin.',
        hint: 'Walk with everyone to Christopher Robin’s door.',
      },
    },
    scenes: [
      'a11-19-meeting',
      'a11-19-signed',
      'a11-19-scroll',
      'a11-19-scroll-done',
      'a11-19-complete',
    ],
  },
  {
    of: 'a11-20',
    title: 'An Enchanted Place',
    goals: {
      'a11-20-s1': {
        goal: 'Walk with Christopher Robin and Pooh to the top of the Forest.',
        hint: 'Walk a little way behind them, up through the Forest to Galleons Lap.',
      },
      'a11-20-s2': {
        goal: 'Wait at the edge of the circle while Christopher Robin and Pooh talk.',
        hint: 'Stay at the edge. This bit is theirs.',
      },
    },
    scenes: ['a11-20-climb', 'a11-20-knight', 'a11-20-knight-done', 'a11-20-complete'],
  },
];

const VARIANT_IDS: string[] = [
  'a11-11-door-thistle',
  'a11-11-door-sat',
  'a11-16-bounced-sat',
  'a11-17-mist-rabbit',
  'a11-17-found-rabbit',
  'a11-19-signed-rabbit',
  'a11-19-scroll-thistle',
  'a11-19-scroll-sat',
  'a11-20-complete-thistle',
  'a11-20-complete-sat',
  'a11-margin-hazel',
];

// ================================================================== the lessons, by scene
const LESSONS: Record<string, LessonIn[]> = {
  // ---------------------------------------------------------------- A11-1
  'a11-01-page': [
    ask(
      9,
      'sel',
      'saying “I don’t know” instead of guessing',
      'CASEL: Self-awareness',
      [
        N(
          'Pooh is sure your Nubbin is a very small Heffalump, though nobody knows what a Heffalump is. Is it better to say “I don’t know”, or to guess?',
        ),
      ],
      [
        opt('Say “I don’t know”', [
          CR(
            'That’s honest, and it leaves room to find out. Pooh’s sort of guess is more fun, but yours is safer.',
          ),
        ]),
        opt('Make a good guess', [
          N(
            'A guess can be a fine start, if you say it is a guess. Pooh says his like a fact, and that is where it gets tricky.',
          ),
        ]),
        opt('It depends on the question', [
          N('That is a thoughtful answer. Some questions need care, and some are only a game.'),
        ]),
      ],
      'Thought about when it is better to say “I don’t know” than to guess.',
    ),
  ],
  'a11-01-page-done': [
    notice(
      1,
      'literacy',
      'a character’s motive is the reason they act',
      'RL.3.3',
      [
        CR(
          'A motive is the reason a character does something. Pooh’s motive for going out today is honey.',
        ),
        CR(
          'Knowing a character’s motive helps you guess what they will do next. Try it on the bees.',
        ),
      ],
      'Learned that a motive is the reason a character does something.',
    ),
  ],
  'a11-01-balloon': [
    ask(
      8,
      'science',
      'balanced forces: a balloon pulling up, gravity pulling down',
      '3-PS2-1',
      [
        N(
          'Pooh hangs in the air, neither rising nor falling. The balloon pulls him up and gravity pulls him down. What do we call it when the pulls are equal?',
        ),
      ],
      [
        opt(
          'Balanced forces',
          [CR('Yes. Equal pulls in opposite directions cancel out, so Pooh stays put.')],
          true,
        ),
        opt('Unbalanced forces', [
          CR(
            'Not quite. With unbalanced forces he would be rising or falling. He is still, so the pulls are equal.',
          ),
        ]),
        opt('No forces at all', [
          CR(
            'Forces are still there. Gravity never switches off. They are just equal, so he does not move.',
          ),
        ]),
      ],
      'Learned that equal forces pulling in opposite directions are balanced and cause no movement.',
    ),
  ],
  'a11-01-balloon-done': [
    notice(
      1,
      'literacy',
      'using context to work out a new word: suspicious',
      'L.2.4',
      [
        CR(
          'Suspicious means not trusting someone, and thinking they may be up to something. The bees are quite right to be.',
        ),
        CR(
          'You can often work out a new word from what is around it. A muddy “cloud” has come for their honey: no wonder they look at it oddly.',
        ),
      ],
      'Worked out the word suspicious from context.',
    ),
  ],
  'a11-01-bees': [
    ask(
      7,
      'sel',
      'what to do when a laugh hurts someone',
      'CASEL: Relationship skills',
      [
        N(
          'Christopher Robin says laughing hurts Pooh’s feelings, then admits he laughed too. What is the best thing to do if you laugh and someone is hurt?',
        ),
      ],
      [
        opt(
          'Say sorry, and mean it',
          [CR('Yes. Funny things can still sting. A real sorry mends it faster than anything.')],
          true,
        ),
        opt('Pretend you did not laugh', [
          N('That tends to make it worse. The hurt is still there, and now it is a secret too.'),
        ]),
        opt('Say it was only a joke', [
          N('“Only a joke” does not take the sting away. Saying sorry does.'),
        ]),
      ],
      'Chose a real apology after a laugh hurt someone’s feelings.',
    ),
  ],
  'a11-01-bees-done': [
    notice(
      3,
      'literacy',
      'a simile compares two things using like or as',
      'L.4.5',
      [
        N(
          '“Pooh floats down into your arms like a large, muddy leaf.” That is a simile: it compares two things using “like” or “as”.',
        ),
        N('Try one of your own: “Pooh was as round as…” What would you pick?'),
      ],
      'Learned that a simile compares two things using like or as.',
    ),
  ],
  'a11-01-complete': [
    ask(
      5,
      'maths',
      'multiplying days: 2 weeks of 7 days',
      '3.OA.A.3',
      [
        N(
          'Christopher Robin says Pooh’s arms will come down in about a week. A week has 7 days. How many days is 2 weeks?',
        ),
      ],
      [
        opt('14 days', [CR('Yes. Two groups of seven is 2 × 7 = 14.')], true),
        opt('9 days', [CR('Check again: 2 weeks is 7 + 7, which is 14. That is 2 × 7.')]),
        opt('12 days', [CR('Close. Two weeks is 7 + 7 = 14 days.')]),
      ],
      'Used multiplication to work out the days in two weeks.',
    ),
  ],

  // ---------------------------------------------------------------- A11-2
  'a11-02-visit': [
    notice(
      10,
      'science',
      'bees carry pollen from flower to flower while making honey',
      '2-LS2-2',
      [
        CR(
          'To make honey, bees drink a sweet juice called nectar from flowers. A single worker makes only about a twelfth of a teaspoon in her whole life.',
        ),
        CR(
          'As she goes from flower to flower, pollen sticks to her. That is how bees help plants make seeds. We say they pollinate.',
        ),
      ],
      'Learned that bees make honey from nectar and pollinate flowers as they feed.',
    ),
  ],
  'a11-02-visit-done': [
    ask(
      1,
      'maths',
      'subtracting to find the gap: 45 − 30',
      '2.OA.A.1',
      [
        N(
          'Rabbit’s door is 30 cm wide. Pooh, after all that honey, is 45 cm across. By how many centimetres is Pooh too wide?',
        ),
      ],
      [
        opt('15 cm', [CR('Yes. 45 − 30 = 15. That is a lot of honey.')], true),
        opt('75 cm', [
          CR('That is 45 + 30. To find the gap, take the smaller from the bigger: 45 − 30 = 15.'),
        ]),
        opt('5 cm', [CR('Try again: 45 − 30. Take away 3 tens to get 15.')]),
      ],
      'Subtracted two measurements to find how much wider Pooh was than the door.',
    ),
  ],
  'a11-02-stuck': [
    ask(
      11,
      'sel',
      'whether to say “I told you so” to someone in trouble',
      'CASEL: Relationship skills',
      [
        N(
          'Rabbit says it is all on account of somebody eating too much honey. He is right. But is it kind to say so to someone who is stuck?',
        ),
      ],
      [
        opt('Yes, it is only true', [
          CR(
            'It is true. But true and helpful are not always the same thing. What does Pooh need most right now?',
          ),
        ]),
        opt('No, help first, talk later', [
          CR(
            'Rabbit might agree, if he were not so cross. Help is the thing a stuck bear remembers.',
          ),
        ]),
        opt('It depends how you say it', [
          N(
            'A good point. A friendly “bit of a squeeze, isn’t it?” is very different from “I told you so”.',
          ),
        ]),
      ],
      'Thought about whether being right justifies saying “I told you so”.',
    ),
  ],
  'a11-02-stuck-done': [
    notice(
      0,
      'literacy',
      'sustaining means giving strength; context clues',
      'L.2.4',
      [
        CR(
          'Pooh asked for a sustaining sort of book. Sustaining means something that keeps you going, like a hearty soup.',
        ),
        CR(
          'Could you tell from the sentence? When a word is new, look at the words around it for clues.',
        ),
      ],
      'Learned the word sustaining and practised using context clues.',
    ),
  ],
  'a11-02-week': [
    doIt(
      7,
      'maths',
      'a tally of the days of a week',
      null,
      'edu:tally:days-of-week:7',
      [
        CR(
          'A week has seven days. Let us keep a tally: one stroke for each day, four strokes standing up and the fifth across them like a gate.',
        ),
        CR(
          'Make one gate and two more strokes. That is seven, and Pooh is free on the seventh day.',
        ),
      ],
      'Made a tally of seven, bundling the first five marks into a gate.',
    ),
  ],
  'a11-02-week-done': [
    notice(
      3,
      'science',
      'unbalanced forces: friction holds, a bigger pull wins',
      '3-PS2-1',
      [
        CR(
          'All week the door gripped Pooh tightly. That grip, between surfaces rubbing together, is called friction.',
        ),
        CR(
          'By the seventh day Pooh was thinner, so the grip was weaker, and the long line of friends pulled harder than it held. Unbalanced forces: out he popped.',
        ),
      ],
      'Learned that friction can hold something until a bigger pull makes it move.',
    ),
  ],
  'a11-02-complete': [
    notice(
      3,
      'sel',
      'feelings can be mixed: glad and a little lonely',
      'CASEL: Self-awareness',
      [
        N(
          'Rabbit wanted Pooh out of his door. Now Pooh is out, and Rabbit looks as if he misses him.',
        ),
        N(
          'Two feelings at once is normal. You can be relieved and a bit lonely in the same minute.',
        ),
      ],
      'Heard that people can feel two different things at once.',
    ),
  ],

  // ---------------------------------------------------------------- A11-3
  'a11-03-tracks': [
    notice(
      3,
      'science',
      'tracks tell us size, speed and direction',
      null,
      [
        CR(
          'Animal trackers read prints like a story. The size shows how big the animal is, and the spacing shows how fast it moved.',
        ),
        CR(
          'A line of prints shows where it went. A circle of prints, though, shows somebody going round in circles.',
        ),
      ],
      'Learned that tracks show an animal’s size, speed and direction.',
    ),
  ],
  'a11-03-tracks-done': [
    ask(
      0,
      'maths',
      'a pattern that follows a rule: adding 2 each lap',
      '4.OA.C.5',
      [
        N('Each lap round the larches, Pooh and Piglet each add one set of prints.'),
        N('After lap 1 there are 2 sets. After lap 2 there are 4. How many after lap 5?'),
      ],
      [
        opt('10 sets', [CR('Yes. The rule is add 2 each lap: 2, 4, 6, 8, 10.')], true),
        opt('8 sets', [CR('That is lap 4. Keep going one more: 2, 4, 6, 8, 10.')]),
        opt('5 sets', [
          CR('That would be adding 1. The rule here is add 2 each lap, so lap 5 gives 10.'),
        ]),
      ],
      'Continued a number pattern by applying the rule add 2.',
    ),
  ],
  'a11-03-count': [
    notice(
      4,
      'science',
      'a hypothesis is an idea you can test',
      null,
      [
        CR(
          'Pooh has an idea: these prints belong to a Woozle. An idea you can test is called a hypothesis.',
        ),
        CR(
          'Pooh tests his by fitting his own foot in the print. It fits, so the hypothesis is in trouble.',
        ),
      ],
      'Learned that a hypothesis is an idea that can be tested.',
    ),
    ask(
      3,
      'sel',
      'letting someone find out for themselves',
      'CASEL: Responsible decision-making',
      [
        N(
          'Christopher Robin says it is better when Pooh gets there himself. Would you have told Pooh the answer early? Why, or why not?',
        ),
      ],
      [
        opt('Yes, tell him early', [
          CR(
            'That is kind, and it would save Pooh a lot of walking. But Christopher Robin thinks finding it himself is worth something.',
          ),
        ]),
        opt('No, let him find out', [
          CR(
            'That is Christopher Robin’s view too. When you work it out yourself, you remember it.',
          ),
        ]),
        opt('Tell him if he asks', [
          N(
            'A fair middle path. Being ready to help without taking the discovery away from someone is a skill.',
          ),
        ]),
      ],
      'Thought about helping someone without taking away their chance to discover.',
    ),
  ],
  'a11-03-count-done': [
    notice(
      3,
      'sel',
      'kind words when someone feels silly',
      'CASEL: Relationship skills',
      [
        N(
          'Pooh feels silly: he followed his own feet. Christopher Robin does not laugh. He says something warm.',
        ),
        N('When someone feels foolish, a kind sentence can turn the whole day around.'),
      ],
      'Heard how a kind reply helps someone who feels silly.',
    ),
  ],
  'a11-03-complete': [
    notice(
      3,
      'literacy',
      'actions show a character’s feelings',
      'RL.3.3',
      [
        N(
          'Piglet walks a long way round your Nubbin, then a shorter way, then shakes its paw twice. Nobody says he is less afraid.',
        ),
        N(
          'His actions tell you instead. Watching what characters do, not only what they say, is how readers find out how they feel.',
        ),
      ],
      'Noticed that a character’s actions can show a change of feeling.',
    ),
  ],

  // ---------------------------------------------------------------- A11-4
  'a11-04-gloomy': [
    ask(
      10,
      'sel',
      'gloomy does not always mean “leave me alone”',
      'CASEL: Social awareness',
      [
        N(
          'Eeyore says “Nobody minds. Nobody ever does.” Does that mean he wants to be left alone, or something else?',
        ),
      ],
      [
        opt('He wants to be left alone', [
          N(
            'Sometimes people do. But Pooh asked, and then stayed, and Eeyore did not send him away.',
          ),
        ]),
        opt('He wants somebody to notice', [
          N('That fits the story. “Nobody minds” is often a quiet way of hoping somebody does.'),
        ]),
        opt('You can only find out by asking', [
          N('A wise answer. Asking, and then staying close, is how Pooh does it.'),
        ]),
      ],
      'Thought about what a gloomy friend might really need.',
    ),
  ],
  'a11-04-gloomy-done': [
    notice(
      1,
      'science',
      'thistle prickles protect the plant; donkeys cope',
      '4-LS1-1',
      [
        CR(
          'A thistle is covered in sharp spines. The spines are a structure that helps the plant survive, because most animals do not want a mouthful.',
        ),
        CR(
          'Donkeys really do eat thistles. Their lips and mouths are tough enough for the prickles.',
        ),
      ],
      'Learned that thistle spines protect the plant and that donkeys can eat thistles.',
    ),
  ],
  'a11-04-owl': [
    ask(
      7,
      'literacy',
      'words with more than one meaning: notice',
      'L.3.4',
      [
        N(
          'You can notice a tail is missing: that means to see. Owl says to “Issue a Notice”. What does notice mean there?',
        ),
      ],
      [
        opt(
          'A sign with information on it',
          [CR('Yes. As a noun, a notice is a sign. A word can change its meaning with its job.')],
          true,
        ),
        opt('To see something', [
          CR(
            'That is the verb. Owl is using the noun: a notice is a sign you pin up for everyone.',
          ),
        ]),
        opt('To forget something', [
          CR('Not quite. A notice is a sign that tells people something, like a lost tail poster.'),
        ]),
      ],
      'Worked out that notice can mean to see or a sign, depending on how it is used.',
    ),
  ],
  'a11-04-owl-done': [
    notice(
      2,
      'social-studies',
      'returning what you find',
      'D2.Civ.8.K-2',
      [
        CR(
          'Owl found the tail on a bush and made it his bell-pull. He did not know whose it was, but he never asked around either.',
        ),
        CR(
          'When you find something that might be lost, the fair thing is to ask whose it is, or hand it in. Someone may be missing it.',
        ),
      ],
      'Thought about the fair thing to do with something you find.',
    ),
  ],
  'a11-04-nail': [
    notice(
      4,
      'science',
      'sound is vibration',
      '4-PS3-2',
      [
        CR(
          'Each tap of the hammer makes the nail and the wood vibrate, shaking very fast and very slightly. The shaking pushes the air, and you hear it as a tap.',
        ),
        CR('All sounds are vibrations. That is why you can feel a drum with your hand.'),
      ],
      'Learned that sound is caused by vibrations travelling through the air.',
    ),
  ],
  'a11-04-nail-done': [
    notice(
      0,
      'sel',
      'gratitude names the people who helped',
      'CASEL: Relationship skills',
      [
        N('Eeyore thanks Pooh, and then the one with the bow. He names who helped.'),
        N(
          'Thanks land best when they are specific. “Thank you for holding it straight” beats just “thanks”.',
        ),
      ],
      'Heard that naming what someone did makes thanks feel more real.',
    ),
  ],
  'a11-04-complete': [
    ask(
      3,
      'maths',
      'time intervals: 10:20 to 11:00',
      '3.MD.A.1',
      [
        N(
          'Pooh leaves Eeyore at 10:20, and his little something is at eleven o’clock. How many minutes does he have to wait?',
        ),
      ],
      [
        opt(
          '40 minutes',
          [CR('Yes. From 10:20 to 11:00 is 40 minutes: 10:20 to 10:30 is 10, then 30 more.')],
          true,
        ),
        opt('30 minutes', [
          CR(
            'Count again: 10:20 to 10:30 is 10 minutes, and 10:30 to 11:00 is another 30. That is 40.',
          ),
        ]),
        opt('20 minutes', [
          CR('That is the minutes already on the clock. The wait to 11:00 is 40 minutes.'),
        ]),
      ],
      'Worked out a time interval from 10:20 to 11:00.',
    ),
  ],

  // ---------------------------------------------------------------- A11-5
  'a11-05-dig': [
    ask(
      3,
      'maths',
      'area of a rectangle',
      '3.MD.C.7',
      [N('Pooh wants the pit floor to be 3 metres long and 2 metres wide. What is its area?')],
      [
        opt(
          '6 square metres',
          [CR('Yes. Area of a rectangle is length × width: 3 × 2 = 6.')],
          true,
        ),
        opt('5 square metres', [CR('That is 3 + 2. For area, multiply: 3 × 2 = 6.')]),
        opt('10 square metres', [
          CR('That is the distance round the edge (perimeter). Area is 3 × 2 = 6.'),
        ]),
      ],
      'Found the area of a rectangle by multiplying length by width.',
    ),
    ask(
      10,
      'sel',
      'whether it is fair to trap an animal you have never met',
      'CASEL: Responsible decision-making',
      [
        N(
          'Pooh and Piglet set a trap for a creature they have never met, because they are curious and a little afraid. Is that fair to the creature?',
        ),
      ],
      [
        opt('No, it did nothing wrong', [
          N('That is a strong point. Being afraid of something is not a reason to harm it.'),
        ]),
        opt('Yes, if it is dangerous', [
          N('They do not know if it is dangerous. That is the problem: they have only guessed.'),
        ]),
        opt('Find out about it first', [
          N(
            'Many people would agree. Looking and learning before acting is fairer to animals and safer for us.',
          ),
        ]),
      ],
      'Thought about fairness to an animal you know nothing about.',
    ),
  ],
  'a11-05-dig-done': [
    notice(
      0,
      'literacy',
      'an inference is a conclusion from clues',
      'RL.3.3',
      [
        N(
          'Pooh looks at the honey for some time after. The story does not say he is sorry to leave it there, but you can tell.',
        ),
        N(
          'Working something out from clues, when the text does not say it, is called an inference. Good readers do it all the time.',
        ),
      ],
      'Made an inference about a character’s feelings from a clue.',
    ),
  ],
  'a11-05-night': [
    ask(
      7,
      'science',
      'sound is muffled by a jar',
      '4-PS3-2',
      [N('Pooh talks with a jar on his head and it sounds like “Mmff”. Why is his voice muffled?')],
      [
        opt(
          'The jar traps and muffles the sound vibrations',
          [
            CR(
              'Yes. His voice makes vibrations, but the jar round his head keeps most of them in. Only a muffled sound gets out.',
            ),
          ],
          true,
        ),
        opt('The jar makes his voice louder', [
          CR(
            'A jar sometimes echoes, but with it on his head, most of the sound stays inside. So it is quieter.',
          ),
        ]),
        opt('He is tired', [CR('He may well be! But this one is the jar, not sleepiness.')]),
      ],
      'Explained why a jar over the head muffles a voice.',
    ),
  ],
  'a11-05-night-done': [
    notice(
      0,
      'literacy',
      'writers show how someone sounds, not only what they say',
      null,
      [
        N('“Mmm mmff.” Writers spell out muffled sounds so you can hear them in your head.'),
        N(
          'Dialogue can show how someone sounds, not just what they say. Try writing Piglet saying “help” very quietly.',
        ),
      ],
      'Noticed that spelling can show how a voice sounds.',
    ),
  ],
  'a11-05-morning': [
    ask(
      6,
      'science',
      'shadows and dim light can fool us',
      '5-ESS1-2',
      [
        N(
          'At dawn Piglet sees a huge round-headed shape and shouts “Heffalump!” Why did Pooh with a jar look so strange?',
        ),
      ],
      [
        opt(
          'In dim light we see only an outline',
          [
            CR(
              'Yes. With little light, we cannot see colours or details, only a dark shape, and our brain guesses.',
            ),
          ],
          true,
        ),
        opt('Pooh really grew bigger', [
          CR(
            'He did not! Low morning light makes long shadows and big outlines, which can make small things look huge.',
          ),
        ]),
        opt('The jar was magic', [CR('It was only a jar. Light and shadow did the rest.')]),
      ],
      'Learned that in dim light we see only outlines, which can be misread.',
    ),
  ],
  'a11-05-morning-done': [
    notice(
      1,
      'sel',
      'calming down after a fright',
      'CASEL: Self-management',
      [
        N('Piglet’s heart is still thumping from his fright, and he has a headache.'),
        N(
          'A few slow breaths, a drink of water, and telling somebody what happened all help the body settle.',
        ),
      ],
      'Learned ways to calm down after a fright.',
    ),
  ],
  'a11-05-complete': [
    notice(
      2,
      'literacy',
      'authors let readers know more than characters',
      'RL.3.6',
      [
        N(
          'You knew it was Pooh in the jar before Piglet did. Your point of view is bigger than his.',
        ),
        N(
          'When an author lets you know more than a character, it can be funny, or tense. Here it is funny.',
        ),
      ],
      'Noticed that a reader can know more than a character.',
    ),
  ],

  // ---------------------------------------------------------------- A11-6
  'a11-06-stream': [
    ask(
      7,
      'sel',
      'what “it doesn’t matter” can really mean',
      'CASEL: Social awareness',
      [N('Eeyore says “It’s my birthday. Not that it matters.” Do you think he means it?')],
      [
        opt('Yes, he really does not mind', [
          N('Maybe. But he mentions it, and he is standing alone looking at the water. Hmm.'),
        ]),
        opt('No, he hopes someone will notice', [
          N('That fits the clues. People often say “it doesn’t matter” when it matters a lot.'),
        ]),
        opt('I can’t tell from just that', [
          N('A careful answer. That is why Pooh does not argue: he just goes to fetch presents.'),
        ]),
      ],
      'Thought about what people mean when they say something does not matter.',
    ),
  ],
  'a11-06-presents': [
    ask(
      8,
      'science',
      'why a balloon bursts when squashed',
      null,
      [
        N(
          'Piglet falls on his balloon and it goes bang. What happens to the air inside when he lands on it?',
        ),
      ],
      [
        opt(
          'It is squeezed until the rubber cannot stretch more',
          [
            CR(
              'Yes. Air presses outwards on the rubber in every direction. Squash it, and the pressure rises until the rubber tears.',
            ),
          ],
          true,
        ),
        opt('The air disappears', [
          CR('Air does not vanish. It rushed out through the tear in a hurry: that is the bang.'),
        ]),
        opt('The air gets colder', [
          CR(
            'Not really. It is the pressure that matters: Piglet squeezed it harder than the rubber could take.',
          ),
        ]),
      ],
      'Learned that squeezing a balloon raises the air pressure until the rubber tears.',
    ),
  ],
  'a11-06-presents-done': [
    notice(
      0,
      'sel',
      'a gift that fits the person',
      'CASEL: Social awareness',
      [
        N(
          'Your Nubbin chose a thistle without being told. Eeyore eats thistles, so it is a gift that fits him.',
        ),
        N(
          'A good gift is one that shows you thought about the person: what they like, what they need.',
        ),
      ],
      'Heard that a good gift shows you thought about the person.',
    ),
  ],
  'a11-06-gift': [
    notice(
      8,
      'social-studies',
      'choosing means giving something up',
      'D2.Eco.1.K-2',
      [
        N(
          'Your Nubbin has three things it could give: the ribbon, the thistle, or its time. It cannot give all three at once.',
        ),
        N(
          'Whenever you pick one thing, you give up the others. People call that a choice, and it is how every shop, family and garden works.',
        ),
      ],
      'Learned that choosing one thing means giving up others.',
    ),
  ],
  'a11-06-gift-done': [
    notice(
      0,
      'literacy',
      'repetition makes a funny image',
      null,
      [
        N(
          'In, out, in, out, in, out. Authors repeat a small action to make a moment funny, or touching.',
        ),
        N('Here it does both: it is silly, and it shows that a small thing can make Eeyore happy.'),
      ],
      'Noticed how repetition can make a moment funny and touching.',
    ),
  ],
  'a11-06-complete': [
    ask(
      1,
      'maths',
      'unit fractions: one slice of eight',
      '3.NF.A.1',
      [
        N(
          'Christopher Robin cuts the cake into 8 equal slices and gives Eeyore the one with the most icing. What fraction of the cake is that slice?',
        ),
      ],
      [
        opt('1/8', [CR('Yes. One of eight equal parts is one eighth, written 1/8.')], true),
        opt('1/2', [CR('One half would be 4 of the 8 slices. One slice on its own is 1/8.')]),
        opt('8/1', [
          CR('Careful: the fraction goes one part over the total number of parts: 1/8.'),
        ]),
      ],
      'Named a unit fraction: one equal slice out of eight.',
    ),
  ],

  // ---------------------------------------------------------------- A11-7
  'a11-07-plan': [
    notice(
      1,
      'science',
      'baby kangaroos grow in the pouch',
      '1-LS1-2',
      [
        CR(
          'Real kangaroos are marsupials. A baby, called a joey, is born tiny and finishes growing in its mother’s pouch.',
        ),
        CR(
          'The pouch keeps it warm and safe, and she can feed it there. Nobody in the Forest has seen that before.',
        ),
      ],
      'Learned that kangaroo joeys grow in their mother’s pouch.',
    ),
    ask(
      7,
      'social-studies',
      'how to treat newcomers',
      'D2.Civ.8.K-2',
      [
        N(
          'Rabbit wants Kanga and Roo to leave, just because they are new and do things differently. Pooh asks “Where should she keep it?” Whose side is the better one?',
        ),
      ],
      [
        opt('Rabbit’s: newcomers should fit in', [
          N(
            'Fitting in matters to Rabbit. But what is the harm in a pocket? That is Pooh’s question.',
          ),
        ]),
        opt('Pooh’s: there is no harm', [
          N(
            'Pooh asks it lightly, but it is a good test. If no one is hurt, why would they need to leave?',
          ),
        ]),
        opt('Neither, give them time', [
          N(
            'Many of the best neighbours start as strangers. Time and a little curiosity often do the work.',
          ),
        ]),
      ],
      'Thought about fairness towards people who are new and different.',
    ),
  ],
  'a11-07-plan-done': [
    notice(
      0,
      'health',
      'a grown-up must always know where a child is',
      'CASEL: Responsible decision-making',
      [
        N(
          'In the Forest, Kanga knows all along and it is a game. In real life, a child should never be taken away from their grown-up, even as a game.',
        ),
        N(
          'If it happens, say no loudly, stay close to other people, and tell a trusted adult straight away.',
        ),
      ],
      'Learned that a grown-up should always know where a child is, and who to tell if not.',
    ),
  ],
  'a11-07-swap': [
    notice(
      5,
      'science',
      'tendons store energy for a kangaroo’s hop',
      '4-LS1-1',
      [
        CR(
          'A kangaroo’s back legs have long, stretchy tendons. Each landing stretches them like springs, and they spring back to help with the next hop.',
        ),
        CR(
          'That saves the kangaroo energy, so a big red kangaroo can keep hopping for a long way.',
        ),
      ],
      'Learned that kangaroo tendons store energy like springs.',
    ),
  ],
  'a11-07-swap-done': [
    ask(
      0,
      'maths',
      'multiplication: 6 hops a minute for 5 minutes',
      '3.OA.A.3',
      [N('Roo hops off Rabbit’s step 6 times every minute. How many hops in 5 minutes?')],
      [
        opt('30 hops', [CR('Yes. Five groups of six: 5 × 6 = 30.')], true),
        opt('11 hops', [CR('That is 6 + 5. Each minute has 6 hops, so multiply: 5 × 6 = 30.')]),
        opt('36 hops', [CR('Close, but that would be 6 minutes. Five minutes is 5 × 6 = 30.')]),
      ],
      'Used multiplication to count hops over five minutes.',
    ),
  ],
  'a11-07-bath': [
    notice(
      5,
      'health',
      'medicine is only safe from a trusted adult',
      'CASEL: Responsible decision-making',
      [
        N(
          'Medicine can help a body get well, but the dose matters. Too much can make you ill instead.',
        ),
        N(
          'So only a trusted grown-up should give you medicine. Never take it by yourself, even if it tastes like a sweet.',
        ),
      ],
      'Learned that only a trusted adult should give medicine.',
    ),
  ],
  'a11-07-bath-done': [
    ask(
      0,
      'sel',
      'borrowing means asking first',
      'CASEL: Responsible decision-making',
      [N('Rabbit says he was only borrowing. Which of these is really borrowing?')],
      [
        opt(
          'Asking, then giving it back',
          [CR('Yes. Borrowing needs permission and a return. Without them, it is just taking.')],
          true,
        ),
        opt('Taking it quietly and returning it later', [
          CR('The “returning” part is good. But without asking first, the owner has no say.'),
        ]),
        opt('Keeping it until someone notices', [
          CR(
            'That is a long way from borrowing. Borrowing has an end, and the owner agrees to it.',
          ),
        ]),
      ],
      'Learned that borrowing means asking first and giving it back.',
    ),
  ],
  'a11-07-complete': [
    notice(
      1,
      'literacy',
      'a simile for stiff friendliness',
      'L.4.5',
      [
        N('“Rabbit is friendly back, a bit stiffly, like a new shoe.” Another simile.'),
        N(
          'A new shoe is stiff because it has not been worn in. The simile tells us Rabbit’s friendliness is real but unpractised.',
        ),
      ],
      'Understood how a simile can describe a feeling.',
    ),
  ],

  // ---------------------------------------------------------------- A11-8
  'a11-08-setoff': [
    ask(
      3,
      'social-studies',
      'north on a map',
      '2-ESS2-2',
      [
        N(
          'Pooh asks what the North Pole is. On most maps, north is at the top. If you face north, which way is east?',
        ),
      ],
      [
        opt(
          'To your right',
          [CR('Yes. Facing north, east is on your right and west on your left.')],
          true,
        ),
        opt('To your left', [CR('That is west. Facing north, east is on your right.')]),
        opt('Behind you', [CR('Behind you is south. East is on your right when you face north.')]),
      ],
      'Used the compass directions: east is to the right when facing north.',
    ),
    ask(
      5,
      'sel',
      'being told “not properly”',
      'CASEL: Social awareness',
      [
        N(
          'Eeyore says: “Nobody told me. Well, somebody did. But not properly.” Is that being left out, or just Eeyore being gloomy?',
        ),
      ],
      [
        opt('He was left out', [
          N('That is how it sounds. Being told in passing is not the same as being asked.'),
        ]),
        opt('He is just being gloomy', [
          N('Maybe. But gloomy people are often the ones who feel left out most.'),
        ]),
        opt('Perhaps both', [N('That is very possible. Feelings and facts can both be true.')]),
      ],
      'Thought about the difference between being informed and being included.',
    ),
  ],
  'a11-08-roo': [
    notice(
      7,
      'health',
      'water safety: reach, throw, do not go',
      'CASEL: Responsible decision-making',
      [
        CR(
          'Nubbins do not mind water, but people should. If someone falls in, the safe rule is reach or throw, do not go.',
        ),
        CR(
          'Hold out a pole or a branch from the bank, or throw something that floats, and shout for a grown-up.',
        ),
      ],
      'Learned the water-safety rule: reach or throw, do not go in.',
    ),
  ],
  'a11-08-roo-done': [
    notice(
      1,
      'science',
      'streams run downhill and carry things along',
      null,
      [
        CR(
          'Water always runs downhill, pulled by gravity. A stream can carry leaves, sticks and even a small Roo along with it.',
        ),
        CR('Remember that: it matters for a game on the bridge later.'),
      ],
      'Learned that streams flow downhill and carry things along.',
    ),
  ],
  'a11-08-pole': [
    ask(
      2,
      'literacy',
      'a word with two meanings: pole',
      'L.3.4',
      [
        N(
          'Pooh holds a wet pole. Christopher Robin says it is the North Pole. Are those the same kind of pole?',
        ),
      ],
      [
        opt(
          'No: one is a stick, one is a place',
          [
            CR(
              'Yes. “Pole” can mean a long stick or either end of the Earth. Context tells you which.',
            ),
          ],
          true,
        ),
        opt('Yes: the same thing', [
          CR(
            'Not quite. The real North Pole is a place at the top of the world. This one is a stick, which is the joke.',
          ),
        ]),
        opt('Neither is real', [
          CR('Both are real! One is a stick, and the other is a place on Earth.'),
        ]),
      ],
      'Worked out that pole can mean a stick or a place at the end of the Earth.',
    ),
  ],
  'a11-08-pole-done': [
    notice(
      0,
      'social-studies',
      'the real North Pole is a spot on a frozen ocean',
      'D2.Geo.2.K-2',
      [
        CR(
          'The real North Pole is a point at the very top of the Earth. It is not land but floating sea ice on the Arctic Ocean.',
        ),
        CR(
          'An expedition is a journey made for a purpose, like exploring. Pooh’s was a very short one.',
        ),
      ],
      'Learned that the real North Pole is on floating sea ice, and what an expedition is.',
    ),
  ],
  'a11-08-complete': [
    ask(
      2,
      'maths',
      'lines of symmetry',
      '4.G.A.3',
      [
        N(
          'The hat-stand pole forks into a neat Y shape, with two equal arms. How many lines of symmetry does a Y have?',
        ),
      ],
      [
        opt(
          'One',
          [CR('Yes. Fold it down the middle, from top to bottom, and both halves match.')],
          true,
        ),
        opt('None', [
          CR(
            'Look again: there is one line, straight down the middle, that makes the halves match.',
          ),
        ]),
        opt('Two', [
          CR(
            'A second fold, across the middle, would not match top and bottom. Just one line works.',
          ),
        ]),
      ],
      'Found the one line of symmetry in a Y shape.',
    ),
  ],

  // ---------------------------------------------------------------- A11-9
  'a11-09-rain': [
    notice(
      1,
      'science',
      'the water cycle and floods',
      '3-ESS2-1',
      [
        CR(
          'Rain starts as water vapour rising from seas and lakes. It cools into drops, which fall as rain. Rivers carry it back to the sea.',
        ),
        CR('A flood happens when rain falls faster than the ground and streams can carry it away.'),
      ],
      'Learned that rain is part of the water cycle and that floods happen when too much falls too fast.',
    ),
    ask(
      3,
      'sel',
      'whether being small means being weak',
      'CASEL: Self-awareness',
      [
        N(
          'Piglet says everyone else can float, fly or jump, and he is “just small and wet”. Then he sends a message in a bottle. Is small the same as weak?',
        ),
      ],
      [
        opt('Yes, he cannot do much', [
          N('He did one clever thing, though: he asked for help in writing. That is not weak.'),
        ]),
        opt('No, he has other strengths', [
          N('That fits. A clear message and the sense to send it are real strengths.'),
        ]),
        opt('Everyone feels small sometimes', [
          N('They do. It is worth remembering when you see a friend who looks small.'),
        ]),
      ],
      'Thought about whether being small means being weak.',
    ),
  ],
  'a11-09-rain-done': [
    notice(
      0,
      'science',
      'a corked bottle floats because it is mostly air',
      '2-PS1-1',
      [
        CR(
          'A corked bottle is mostly air, so it is light for its size. We say it is buoyant, and it floats.',
        ),
        CR(
          'A stone is heavy for its size, so it sinks. Weight alone does not decide it: size and shape matter too.',
        ),
      ],
      'Learned that something light for its size, like a corked bottle, floats.',
    ),
  ],
  'a11-09-bear': [
    ask(
      1,
      'literacy',
      'one clue may not be enough',
      'RL.3.3',
      [
        N(
          'Pooh can read only the letter P, and decides the letter is for him. Is that good reasoning?',
        ),
      ],
      [
        opt(
          'Not quite: Piglet starts with P too',
          [
            CR(
              'Yes. A single clue can fit more than one answer. Good readers look for another clue before deciding.',
            ),
          ],
          true,
        ),
        opt('Yes, P is for Pooh', [
          CR(
            'It might be! But P also fits Piglet, and the message is from him. One clue is not always enough.',
          ),
        ]),
        opt('He should not read it at all', [
          CR(
            'Reading as much as you can is good. Just keep an open mind about what the rest might say.',
          ),
        ]),
      ],
      'Learned that one clue can fit more than one answer.',
    ),
  ],
  'a11-09-bear-done': [
    notice(
      0,
      'social-studies',
      'floods make temporary islands; high ground is safe',
      '2-ESS2-2',
      [
        CR(
          'The hill is an island now: land with water all around it. On a map, an island is land surrounded by blue.',
        ),
        CR(
          'In a real flood, high ground is the safest place. Water fills the lowest places first.',
        ),
      ],
      'Learned what an island is and that high ground is safest in a flood.',
    ),
  ],
  'a11-09-umbrella': [
    notice(
      3,
      'science',
      'comparing two designs for a boat',
      '3-5-ETS1-2',
      [
        CR(
          'There are two boats now: an empty jar for one, and an upturned umbrella for two. Both float because their shape holds air and pushes water aside.',
        ),
        CR(
          'Comparing designs is how engineers choose. The umbrella is wider, so it carries more. The jar is easier to steer.',
        ),
      ],
      'Compared two boat designs and learned why bowl shapes float.',
    ),
  ],
  'a11-09-umbrella-done': [
    notice(
      1,
      'sel',
      'asking for help is a strength',
      'CASEL: Relationship skills',
      [
        N(
          'Piglet was scared, but he wrote HELP and his name and sent it. It reached the right person.',
        ),
        N(
          'Asking for help is a skill, not a failure. The people who love you would far rather know.',
        ),
      ],
      'Heard that asking for help is a skill.',
    ),
  ],
  'a11-09-complete': [
    ask(
      2,
      'maths',
      'two-step problem with a remainder',
      '3.OA.D.8',
      [
        N(
          'The umbrella boat carries 3 friends at a time. How many trips would it need to carry 10 friends?',
        ),
      ],
      [
        opt(
          '4 trips',
          [CR('Yes. Three trips carry 9 friends, and a fourth trip takes the last one.')],
          true,
        ),
        opt('3 trips', [CR('Three trips carry only 9. The tenth friend needs a fourth trip.')]),
        opt('7 trips', [
          CR('That would be too many. 10 ÷ 3 is 3 with 1 left over, so 3 + 1 = 4 trips.'),
        ]),
      ],
      'Solved a division problem and handled the remainder.',
    ),
  ],

  // ---------------------------------------------------------------- A11-10
  'a11-10-invites': [
    ask(
      3,
      'literacy',
      'choosing words for the audience',
      'L.3.4',
      [
        N(
          'Owl “Announces” the party in grand words. You tell it in shorter ones. Which message would reach a sleepy Eeyore best?',
        ),
      ],
      [
        opt(
          '“Party for Pooh, today, come along!”',
          [
            CR(
              'Yes. Short, clear words fit the listener. Grand words are fine at a ceremony, less so on a doorstep.',
            ),
          ],
          true,
        ),
        opt('“A convivial gathering is to be convened.”', [
          CR(
            'That is very grand, and Eeyore would understand about half of it. Pick words your audience will catch.',
          ),
        ]),
        opt('“Something’s on.”', [
          CR('Short, but he would not know what or why. Clear needs enough detail too.'),
        ]),
      ],
      'Chose words to suit the listener.',
    ),
    ask(
      5,
      'sel',
      'assuming something is about you',
      'CASEL: Self-awareness',
      [
        N(
          'Eeyore hears about a party and assumes it is for him, in his gloomy way. Is it kind to correct him straight away?',
        ),
      ],
      [
        opt('Yes, honesty comes first', [
          N('Honesty matters. But so does choosing a gentle way and a good moment to say it.'),
        ]),
        opt('No, let him enjoy it', [
          N('That is kind, but the party is for Pooh, and the misunderstanding may sting later.'),
        ]),
        opt('Tell him kindly, and give him a seat', [
          N('That is what you do. You tell the truth and make sure he has a place.'),
        ]),
      ],
      'Thought about telling someone the truth kindly.',
    ),
  ],
  'a11-10-table': [
    ask(
      3,
      'maths',
      'equal groups: 12 seats in 3 rows',
      '3.OA.A.3',
      [N('Rabbit seats 12 friends-and-relations in 3 equal rows. How many are in each row?')],
      [
        opt('4 in each row', [CR('Yes. 12 ÷ 3 = 4, since 3 × 4 = 12.')], true),
        opt('9 in each row', [CR('That is 12 − 3. Share 12 equally into 3 rows: 12 ÷ 3 = 4.')]),
        opt('3 in each row', [CR('Three rows of 3 would be only 9. Three rows of 4 make 12.')]),
      ],
      'Divided 12 into 3 equal groups.',
    ),
  ],
  'a11-10-table-done': [
    notice(
      1,
      'literacy',
      'showing character through action',
      'RL.3.3',
      [
        N(
          'Eeyore “half stands up to make a speech”, then sits down again. The author never says he is shy or doubtful.',
        ),
        N(
          'We work it out from what he does. That is called showing, not telling, and it is how stories get under your skin.',
        ),
      ],
      'Learned that actions can show a character’s feelings without saying them.',
    ),
  ],
  'a11-10-complete': [
    notice(
      1,
      'science',
      'pencil grades: B, HB and H',
      '2-PS1-1',
      [
        CR(
          'Pencil “lead” is really graphite mixed with clay. More clay makes it harder and lighter. More graphite makes it softer and blacker.',
        ),
        CR(
          'B means black and soft. H means hard. HB is in the middle, the pencil most of us use at school.',
        ),
      ],
      'Learned that pencil grades describe how soft or hard the graphite is.',
    ),
  ],

  // ---------------------------------------------------------------- A11-11
  'a11-11-snow': [
    notice(
      0,
      'science',
      'snow is frozen water; freezing point',
      '2-ESS2-3',
      [
        CR('Snow is water that has frozen into tiny crystals. Water freezes at 0 °C (32 °F).'),
        CR(
          'When the air warms above that, snow melts back into water. In spring, it feeds the streams.',
        ),
      ],
      'Learned that snow is frozen water, and that water freezes at 0 °C (32 °F).',
    ),
  ],
  'a11-11-snow-done': [
    ask(
      0,
      'maths',
      'perimeter: the wall of sticks',
      '3.MD.D.8',
      [
        N(
          'Eeyore’s house is a rectangle, 3 metres long and 2 metres wide. How many metres of sticks does it take to go all the way round?',
        ),
      ],
      [
        opt('10 metres', [CR('Yes. Perimeter is the distance round: 3 + 2 + 3 + 2 = 10.')], true),
        opt('6 metres', [
          CR('That is 3 × 2, the area of the floor. Perimeter adds all four sides: 10.'),
        ]),
        opt('5 metres', [CR('That is only two of the sides. Add all four: 3 + 2 + 3 + 2 = 10.')]),
      ],
      'Found a perimeter by adding all four sides.',
    ),
  ],
  'a11-11-missing': [
    notice(
      4,
      'sel',
      'a cold feeling in your middle can be guilt',
      'CASEL: Self-awareness',
      [
        N(
          'Something goes cold in your middle, and it is not the snow. That feeling is often guilt, or worry that you have caused a problem.',
        ),
        N(
          'It is not a bad feeling. It is a signal. It tells you something may need putting right.',
        ),
      ],
      'Learned that guilt is a signal that something may need putting right.',
    ),
  ],
  'a11-11-missing-done': [
    notice(
      0,
      'literacy',
      'dramatic irony: knowing more than the characters',
      'RL.3.6',
      [
        N(
          'Pooh and Piglet are admiring the house. You know something they do not: whose sticks those were.',
        ),
        N(
          'When the reader knows more than the characters, it is called dramatic irony. It makes a scene funny and a little uncomfortable at once.',
        ),
      ],
      'Learned the term dramatic irony.',
    ),
  ],
  'a11-11-wind': [
    notice(
      1,
      'science',
      'wind is moving air',
      '3-ESS2-1',
      [
        CR(
          'Wind is air on the move. When the sun warms the ground, the air above rises, and cooler air rushes in to take its place.',
        ),
        CR(
          'A gentle wind rustles leaves. It would take an enormous one to carry off a whole house, so Eeyore’s idea needs some help.',
        ),
      ],
      'Learned that wind is moving air caused by warm air rising and cool air rushing in.',
    ),
    ask(
      6,
      'sel',
      'kind silence versus honesty',
      'CASEL: Responsible decision-making',
      [
        N(
          'Eeyore believes the wind moved his house, and he is happy. Pooh, Piglet and you say nothing. Is staying quiet kind, or should someone tell him the truth?',
        ),
      ],
      [
        opt('Stay quiet: it is kind', [
          N(
            'It does feel kind. But it also means Eeyore cannot understand what really happened, or thank anyone.',
          ),
        ]),
        opt('Tell him: honesty matters', [
          N(
            'Honesty does matter. A good way might be to tell him gently, and to offer to fix things.',
          ),
        ]),
        opt('It depends on what he needs', [
          N(
            'A thoughtful answer. Sometimes the kindest thing is to wait, and sometimes to speak. Think who it helps.',
          ),
        ]),
      ],
      'Thought about when kind silence is right and when honesty matters more.',
    ),
  ],
  'a11-11-door': [
    notice(
      2,
      'literacy',
      'theme: small kindnesses come back',
      'RL.4.2',
      [
        N(
          'The ribbon from the Useful Pot is now on the door. A small gift from earlier comes back later, doing a job.',
        ),
        N(
          'A theme is the big idea under a story. One theme here: small kindnesses are never wasted.',
        ),
      ],
      'Noticed that a small gift returning later can show a story’s theme.',
    ),
  ],
  'a11-11-complete': [
    ask(
      4,
      'maths',
      'distance: 14 hops of 30 cm',
      '4.MD.A.1',
      [
        N(
          'Your Nubbin hops from footprint to footprint, each 30 cm apart. It makes 14 hops. How far is that in metres?',
        ),
      ],
      [
        opt(
          '4 metres 20 centimetres',
          [CR('Yes. 14 × 30 = 420 cm, which is 4 m and 20 cm.')],
          true,
        ),
        opt('42 metres', [CR('That is ten times too big. 420 cm is 4.2 m.')]),
        opt('4 metres', [CR('Nearly: 14 × 30 = 420 cm. That is 4 m and a further 20 cm.')]),
      ],
      'Converted centimetres to metres after multiplying.',
    ),
  ],

  // ---------------------------------------------------------------- A11-12
  'a11-12-night': [
    notice(
      1,
      'science',
      'a growl is a low pitch: slow vibrations',
      '4-PS3-2',
      [
        CR(
          'A growl is a low-pitched sound: the throat vibrates slowly. A squeak is high-pitched, with very fast vibrations.',
        ),
        CR('Pitch is how high or low a sound is. Volume is how loud. They are different things.'),
      ],
      'Learned that pitch depends on how fast something vibrates.',
    ),
  ],
  'a11-12-night-done': [
    ask(
      0,
      'maths',
      'volume in millilitres',
      '4.MD.A.2',
      [
        N(
          'Pooh puts out a jar with 500 millilitres of honey. If Tigger tries 50 millilitres at a time, how many tries would empty the jar?',
        ),
      ],
      [
        opt('10 tries', [CR('Yes. 500 ÷ 50 = 10.')], true),
        opt('5 tries', [CR('Five tries would be only 250 millilitres. You need 10.')]),
        opt('50 tries', [CR('That is far too many. Each try is a tenth of the jar, so 10 tries.')]),
      ],
      'Divided a volume of 500 millilitres into 50 millilitre portions.',
    ),
  ],
  'a11-12-breakfast': [
    notice(
      1,
      'science',
      'taste and touch: two senses at work',
      '4-LS1-2',
      [
        CR(
          'Tigger uses touch and taste at once. His tongue feels that honey is sticky and tastes that it is sweet, and nerves send both messages to his brain.',
        ),
        CR(
          'Our senses are our body’s way of gathering information. A thistle is a good lesson in touch.',
        ),
      ],
      'Learned that senses send information to the brain.',
    ),
    ask(
      8,
      'sel',
      'trying new food, and saying you dislike it',
      'CASEL: Self-management',
      [
        N(
          'Tigger tries three foods and likes none of them. Is it worth trying new foods when you might not like them?',
        ),
      ],
      [
        opt('Yes, you might find a favourite', [
          N('Tigger did, in the end. Trying costs a moment and can win you a lifelong favourite.'),
        ]),
        opt('No, stick to what you know', [
          N('It is safe. But Tigger would have gone hungry. Safe is not always the same as well.'),
        ]),
        opt('Try a little, and it is fine to say no', [
          N('Many people agree. A small taste, and honesty about it, seems fair to everyone.'),
        ]),
      ],
      'Thought about the balance between trying new food and saying you dislike it.',
    ),
  ],
  'a11-12-breakfast-done': [
    ask(
      0,
      'maths',
      'money-style addition with Shells',
      '1.OA.A.1',
      [
        N(
          'At the market, honey costs 3 Shells, haycorns 2 Shells and thistles 1 Shell. How many Shells to buy all three for Tigger to try?',
        ),
      ],
      [
        opt('6 Shells', [CR('Yes. 3 + 2 + 1 = 6.')], true),
        opt('5 Shells', [CR('Check again: 3 + 2 is 5, plus 1 more makes 6.')]),
        opt('7 Shells', [CR('Close. 3 + 2 + 1 comes to 6.')]),
      ],
      'Added three prices in Shells.',
    ),
  ],
  'a11-12-malt': [
    notice(
      1,
      'science',
      'how malt extract is made',
      null,
      [
        CR(
          'Extract of malt is made from barley. The grains are soaked until they sprout, then dried: that is malt.',
        ),
        CR(
          'Soak the malt in hot water, boil the sweet liquid down, and you get a thick, sticky syrup: the extract. No wonder it sticks to the spoon.',
        ),
      ],
      'Learned that malt extract is made from sprouted, dried barley.',
    ),
  ],
  'a11-12-malt-done': [
    notice(
      0,
      'sel',
      'finding where you fit',
      'CASEL: Social awareness',
      [
        N(
          'Tigger found a home because Kanga made room, and Roo shared. Nobody asked him to be like the others first.',
        ),
        N(
          'A good group has room for different tastes. Belonging does not have to mean being the same.',
        ),
      ],
      'Heard that belonging does not require being the same as everyone else.',
    ),
  ],
  'a11-12-complete': [
    notice(
      1,
      'literacy',
      'theme: being different can be handy',
      'RL.4.2',
      [
        P('Tiggers like the one thing nobody else does. That is very handy, really.'),
        N(
          'A theme is the big idea under a story. Here, it might be: being different is not a problem, it is just a different shape of fit.',
        ),
      ],
      'Identified a theme about being different.',
    ),
  ],

  // ---------------------------------------------------------------- A11-13
  'a11-13-orders': [
    ask(
      4,
      'maths',
      'units: millimetres in a centimetre',
      '4.MD.A.1',
      [
        N(
          'Small is a beetle about 5 millimetres long. There are 10 millimetres in a centimetre. How many Smalls, end to end, make 1 centimetre?',
        ),
      ],
      [
        opt('2', [CR('Yes. 10 ÷ 5 = 2. Two Smalls make one centimetre.')], true),
        opt('5', [CR('Five Smalls would be 25 millimetres. 10 ÷ 5 = 2.')]),
        opt('10', [CR('That would be 50 millimetres. Divide: 10 ÷ 5 = 2.')]),
      ],
      'Converted millimetres to centimetres to compare lengths.',
    ),
  ],
  'a11-13-pit': [
    ask(
      2,
      'science',
      'gravity pulls everything down',
      '3-PS2-1',
      [N('Pooh walks into the pit and falls onto Piglet. What pulls him down?')],
      [
        opt(
          'Gravity',
          [
            CR(
              'Yes. Gravity pulls everything towards the ground, whether it is a bear or a beetle.',
            ),
          ],
          true,
        ),
        opt('The wind', [CR('The wind can push, but this is gravity: a pull towards the Earth.')]),
        opt('Piglet', [
          CR('Piglet wishes! The pull comes from the whole Earth. We call it gravity.'),
        ]),
      ],
      'Learned that gravity pulls everything towards the ground.',
    ),
  ],
  'a11-13-pit-done': [
    notice(
      0,
      'sel',
      'what makes laughter kind',
      'CASEL: Social awareness',
      [
        N(
          'Christopher Robin laughs, and Pooh and Piglet do too. Laughter is kind when everybody is in on it.',
        ),
        N(
          'A good test: would the person laugh if they could see it from outside? With friends, they usually do.',
        ),
      ],
      'Heard how to tell kind laughter from unkind laughter.',
    ),
  ],
  'a11-13-small': [
    notice(
      3,
      'science',
      'beetles go through four stages of life',
      '3-LS1-1',
      [
        CR(
          'A beetle starts as an egg, hatches into a larva, becomes a pupa, and finally an adult. That change is called metamorphosis.',
        ),
        CR('Small has finished all four stages. He is as grown as a beetle gets.'),
      ],
      'Learned that beetles change through egg, larva, pupa and adult stages.',
    ),
  ],
  'a11-13-complete': [
    ask(
      2,
      'sel',
      'who deserves credit',
      'CASEL: Social awareness',
      [
        N(
          'Rabbit says he found Small by organising a search. Pooh says he found him without looking. Who deserves the credit?',
        ),
      ],
      [
        opt('Rabbit, he organised it', [
          CR(
            'Organising made the search happen. Without it, nobody would have been looking. That is real work.',
          ),
        ]),
        opt('Pooh, he had Small on him', [
          CR(
            'It was luck, but he was also the one willing to be rescued from a pit. Credit can be funny.',
          ),
        ]),
        opt('Everyone who helped', [
          CR('That is the most generous answer, and probably the most accurate.'),
        ]),
      ],
      'Thought about who deserves credit for a team effort.',
    ),
  ],

  // ---------------------------------------------------------------- A11-14
  'a11-14-climb': [
    notice(
      5,
      'science',
      'cats climb up easily; claws curve one way',
      '4-LS1-1',
      [
        CR(
          'Real cats do the same as Tigger: up a tree in a flash, then stuck. Their claws curve backwards, which is ideal for climbing up.',
        ),
        CR(
          'Going down head-first, the claws point the wrong way. Cats have to learn to back down, or be rescued.',
        ),
      ],
      'Learned why cats find climbing down harder than climbing up.',
    ),
  ],
  'a11-14-climb-done': [
    ask(
      0,
      'sel',
      'is it brave to say you are scared',
      'CASEL: Self-awareness',
      [
        N(
          'Tigger said “Tiggers aren’t worried” while stuck up a tree. Is it braver to say you are scared, or to pretend you are not?',
        ),
      ],
      [
        opt('Say you are scared', [
          N(
            'Many people think so. It tells your friends what you need, and it takes courage to say.',
          ),
        ]),
        opt('Pretend you are not', [
          N('Pretending can feel strong, but it can leave you without help when you need it most.'),
        ]),
        opt('Say it and carry on anyway', [
          N('That is a very good answer. Brave does not mean you are never scared.'),
        ]),
      ],
      'Thought about whether admitting fear is brave.',
    ),
  ],
  'a11-14-tunic': [
    notice(
      8,
      'science',
      'sharing a load between four holders',
      '3-PS2-1',
      [
        CR(
          'Four people share the weight of Tigger’s landing, so each pulls less than one would alone. The tunic must be tight, so it does not sag to the ground.',
        ),
        CR(
          'Spreading the force over more people and more cloth is how safety nets and trampolines work.',
        ),
      ],
      'Learned that sharing a load makes each person’s job smaller.',
    ),
  ],
  'a11-14-tunic-done': [
    notice(
      1,
      'literacy',
      'a character acts true to character',
      'RL.3.3',
      [
        N(
          'At the bottom of a heap of friends, Eeyore says something gloomy. It is exactly what Eeyore would say.',
        ),
        N(
          'Writers keep characters consistent so readers feel they know them. That is why the joke works.',
        ),
      ],
      'Noticed that characters behave consistently, which makes humour work.',
    ),
  ],
  'a11-14-complete': [
    ask(
      3,
      'maths',
      'area of a square',
      '3.MD.C.7',
      [N('Christopher Robin’s tunic is a square, 2 metres on each side. What is its area?')],
      [
        opt('4 square metres', [CR('Yes. A square’s area is side × side: 2 × 2 = 4.')], true),
        opt('8 square metres', [
          CR('That is the perimeter, going round the edge. Area is 2 × 2 = 4.'),
        ]),
        opt('2 square metres', [CR('Multiply the sides, not just count one: 2 × 2 = 4.')]),
      ],
      'Found the area of a square by multiplying the side by itself.',
    ),
  ],

  // ---------------------------------------------------------------- A11-15
  'a11-15-note': [
    ask(
      4,
      'literacy',
      'sounding out an invented spelling',
      'L.2.4',
      [
        N(
          'Rabbit reads “Backson” on the note and panics. Say it slowly: back… son. What might Christopher Robin have meant?',
        ),
      ],
      [
        opt(
          'Back soon',
          [CR('Yes. He wrote it the way it sounds. Sounding out is how everyone starts spelling.')],
          true,
        ),
        opt('A big animal called a Backson', [
          CR(
            'Say it slowly again: back-son. Does it sound like another phrase that fits a note on a door?',
          ),
        ]),
        opt('A very bad spelling of “bus”', [
          CR('Interesting guess! Try sounding it in two parts: back… son.'),
        ]),
      ],
      'Sounded out an invented spelling and found it said back soon.',
    ),
  ],
  'a11-15-owl': [
    notice(
      6,
      'social-studies',
      'weekday names come from old gods',
      'D2.His.2.K-2',
      [
        CR(
          'Tuesday is named after Tiw, a god of war the early English believed in. Wednesday comes from Woden, and Thursday from Thor.',
        ),
        CR(
          'Many of our weekday names are old, and spelling them has been wobbly for a very long time. Owl is in good company.',
        ),
      ],
      'Learned that weekday names come from old gods.',
    ),
  ],
  'a11-15-owl-done': [
    ask(
      0,
      'maths',
      'time: finding the end time',
      '3.MD.A.1',
      [
        N(
          'Rabbit leaves home at 10:15, walks for 20 minutes to Owl’s, and stays 15 minutes. What time is it when he leaves Owl’s?',
        ),
      ],
      [
        opt('10:50', [CR('Yes. 10:15 + 20 = 10:35, and 10:35 + 15 = 10:50.')], true),
        opt('10:35', [CR('That is when he arrives. He stays another 15 minutes, so 10:50.')]),
        opt('11:00', [CR('Close. Add carefully: 10:15 + 20 = 10:35, then + 15 = 10:50.')]),
      ],
      'Added two time intervals to find an end time.',
    ),
  ],
  'a11-15-a': [
    notice(
      5,
      'maths',
      'the letter A has one line of symmetry',
      '4.G.A.3',
      [
        CR(
          'Look at Eeyore’s A. Fold it down the middle, from the point at the top to the ground, and the two halves match.',
        ),
        CR('That fold is a line of symmetry. The letter A has exactly one.'),
      ],
      'Saw that the letter A has one line of symmetry.',
    ),
    ask(
      3,
      'sel',
      'what to say instead of “everybody knows”',
      'CASEL: Relationship skills',
      [
        N(
          'Rabbit says “Everybody knows that,” and Eeyore’s ears go down. What could Rabbit have said instead?',
        ),
      ],
      [
        opt('“Well done, that’s an A.”', [
          N('That would make Eeyore feel proud. Praise for the effort is a strong thing to give.'),
        ]),
        opt('“Show me how you made it.”', [
          N('That is generous too. Curiosity tells someone their work matters.'),
        ]),
        opt('Nothing: he was right', [
          N('He was right. But being right can feel small if it makes someone else feel small.'),
        ]),
      ],
      'Thought about how to respond kindly to someone proud of something new.',
    ),
  ],
  'a11-15-a-done': [
    notice(
      0,
      'literacy',
      'theme: learning takes courage at any age',
      'RL.4.2',
      [
        N(
          'Eeyore is grown-up, and he is learning his letters from a boy. He minds a little, and he does it anyway.',
        ),
        N('A theme here: it is never too late to learn something, and learning takes courage.'),
      ],
      'Noticed a theme about learning at any age.',
    ),
  ],
  'a11-15-complete': [
    notice(
      1,
      'social-studies',
      'spelling was not always fixed',
      'D2.His.2.K-2',
      [
        CR(
          '“Back soon” turned into “Backson”: a spelling by ear. English spelling was not fixed until around the 1700s.',
        ),
        CR(
          'Before that, even famous writers spelled the same word several ways. Shakespeare’s own signatures vary. Wobbles are old news.',
        ),
      ],
      'Learned that English spelling was not fixed until about the 1700s.',
    ),
  ],

  // ---------------------------------------------------------------- A11-16
  'a11-16-cone': [
    ask(
      3,
      'social-studies',
      'upstream and downstream',
      'D2.Geo.2.K-2',
      [
        N(
          'Pooh drops the cone on one side of the bridge and sees it come out the other. Which side did he drop it on: upstream or downstream?',
        ),
      ],
      [
        opt(
          'Upstream, where the water comes from',
          [
            CR(
              'Yes. Upstream is where the water comes from. Downstream is where it flows to. Pooh drops it upstream.',
            ),
          ],
          true,
        ),
        opt('Downstream, where it goes to', [
          CR(
            'Downstream is where the water goes. He dropped the cone on the other side, upstream.',
          ),
        ]),
        opt('Either, it is a still pond', [
          CR('A still pond would not carry it. This is a stream, and it flows one way.'),
        ]),
      ],
      'Learned the words upstream and downstream.',
    ),
    notice(
      5,
      'science',
      'a fair test changes one thing and repeats',
      '3-5-ETS1-2',
      [
        CR(
          'Pooh drops a big and a small cone together. The big one wins. Is that proof? A fair test changes one thing only and repeats it.',
        ),
        CR(
          'Pooh should try it again, and again, and drop them at the very same spot. One go is only a hint.',
        ),
      ],
      'Learned that a fair test changes one thing and is repeated.',
    ),
  ],
  'a11-16-game': [
    doIt(
      7,
      'science',
      'the middle of a stream flows fastest',
      null,
      'edu:drop:stick:fast-water',
      [
        CR(
          'A stream flows fastest in the middle, away from the banks, which rub against the water and slow it.',
        ),
        CR(
          'Try it: drop one stick near the bank and one in the middle. The middle one wins. That is why the fast side wins.',
        ),
      ],
      'Learned that a stream flows fastest in the middle, so a stick dropped there wins.',
    ),
    ask(
      6,
      'social-studies',
      'does a new player make the game unfair',
      'D2.Civ.8.K-2',
      [
        N(
          'Your Nubbin went into the water with its stick. Pooh says “nothing in the game says you can’t”. Who decides if something is fair?',
        ),
      ],
      [
        opt('The people who play, together', [
          N('That is how Pooh sees it: it is his game, and the players agree the rules.'),
        ]),
        opt('The inventor, Pooh', [
          N(
            'Pooh invented it, and he agrees. Though rules usually work best when everyone has a say.',
          ),
        ]),
        opt('The rules written down', [
          N('Rules help. But nobody wrote any here, so the players had to decide as they went.'),
        ]),
      ],
      'Thought about who decides whether a game is fair.',
    ),
  ],
  'a11-16-eeyore': [
    ask(
      6,
      'maths',
      'equal groups: three lifters of 2 kg',
      '3.OA.A.1',
      [
        N(
          'The stone weighs 6 kilograms. Pooh can lift 2 kilograms, and so can you and your Nubbin. Can the three of you lift it together?',
        ),
      ],
      [
        opt(
          'Yes: 3 × 2 = 6',
          [CR('Yes. Three lifters of 2 kg each make 6 kg, just enough.')],
          true,
        ),
        opt('No: 2 + 2 is only 4', [CR('There are three lifters, not two: 2 + 2 + 2 = 6.')]),
        opt('Only if Eeyore helps', [
          CR('He is busy floating! Three lifters at 2 kg each is already 6 kg.'),
        ]),
      ],
      'Used equal groups to check three lifters can lift 6 kg.',
    ),
  ],
  'a11-16-bounced': [
    ask(
      3,
      'sel',
      'what a good apology contains',
      'CASEL: Relationship skills',
      [N('Tigger says “Just a cough. A big Tigger cough.” Which of these is a real apology?')],
      [
        opt(
          '“Sorry I bounced you, Eeyore. I’ll be more careful.”',
          [CR('Yes. A real apology says what you did, owns it, and offers to do better.')],
          true,
        ),
        opt('“It was only a cough.”', [
          CR('That explains, but it does not apologise. Eeyore is still soaked.'),
        ]),
        opt('“You should have moved.”', [
          CR('That puts the blame on Eeyore. A real apology keeps the blame where it belongs.'),
        ]),
      ],
      'Learned the parts of a real apology.',
    ),
  ],
  'a11-16-complete': [
    notice(
      2,
      'science',
      'the same river, always new water',
      '2-ESS2-3',
      [
        N(
          '“Same water, new water.” A river looks the same each day, but its water is always new. It arrives from upstream and leaves downstream.',
        ),
        N(
          'All that water is on a long loop: sea, cloud, rain, river, and back to the sea. That loop is the water cycle.',
        ),
      ],
      'Understood that a river is always carrying new water as part of the water cycle.',
    ),
  ],

  // ---------------------------------------------------------------- A11-17
  'a11-17-plan': [
    ask(
      5,
      'sel',
      'can something unkind be “for his own good”',
      'CASEL: Social awareness',
      [
        N(
          'Rabbit says losing Tigger in the mist is “for his own good”. Piglet says it is not very kind. Can something unkind be for someone’s good?',
        ),
      ],
      [
        opt('Yes, if it teaches a lesson', [
          N(
            'Sometimes. But a lesson that comes from frightening a friend is rarely the one you meant to teach.',
          ),
        ]),
        opt('No, kindness is part of good', [
          N('Many would agree. “For your own good” has been used to excuse many unkind things.'),
        ]),
        opt('Only if the person agrees', [
          N(
            'That is a strong test. If Tigger agreed, it might be a game. If he did not, it is something else.',
          ),
        ]),
      ],
      'Thought about whether something unkind can be for someone’s own good.',
    ),
    notice(
      6,
      'science',
      'mist is a cloud near the ground',
      '3-ESS2-1',
      [
        CR(
          'Mist is made of tiny drops of water floating in the air. It forms when moist air cools, which is how clouds form too.',
        ),
        CR(
          'Mist is basically a low cloud. Fog is the same, only thicker. In thick fog you can barely see your own hand.',
        ),
      ],
      'Learned that mist is tiny water drops that form as moist air cools.',
    ),
  ],
  'a11-17-plan-done': [
    notice(
      0,
      'literacy',
      'foreshadowing',
      'RL.4.3',
      [
        N(
          'The mist is coming up from the river. Authors use weather to hint at what is coming. That is called foreshadowing.',
        ),
        N(
          'Here, the soft white mist hints that someone is about to lose someone, and that it will not go as planned.',
        ),
      ],
      'Learned that foreshadowing hints at what will happen next.',
    ),
  ],
  'a11-17-mist': [
    ask(
      7,
      'health',
      'what to do if you are lost',
      'CASEL: Responsible decision-making',
      [
        N(
          'Rabbit is lost somewhere in the mist. If you were lost in thick mist, what is the safest thing to do?',
        ),
      ],
      [
        opt(
          'Stay where you are and call out',
          [
            CR(
              'Yes. Stay put, call out, and wait. People find you faster when you are not moving.',
            ),
          ],
          true,
        ),
        opt('Walk until you find something', [
          CR(
            'It feels natural, but in thick mist you can walk in circles and get further from help.',
          ),
        ]),
        opt('Run, to get out of it faster', [
          CR('Running makes it easier to fall and harder to be found. Stay put and call.'),
        ]),
      ],
      'Learned the rule: if lost, stay put and call out.',
    ),
  ],
  'a11-17-found': [
    notice(
      0,
      'science',
      'we can tell which direction a sound comes from',
      '4-LS1-2',
      [
        CR(
          'In mist you hear before you see. Your two ears are a little apart, so a sound reaches one ear a split second before the other.',
        ),
        CR(
          'Your brain uses that tiny difference to tell which way the sound came from. You can follow a voice you cannot see.',
        ),
      ],
      'Learned that two ears let the brain work out the direction of a sound.',
    ),
  ],
  'a11-17-complete': [
    notice(
      2,
      'literacy',
      'how a character changes',
      'RL.3.3',
      [
        N(
          'Rabbit still says Tigger is too bouncy, but quietly, the way people say something they do not quite mean any more.',
        ),
        N(
          'Rabbit wanted a smaller, sorrier Tigger. By the end, the one who has changed is Rabbit. Stories often turn round like that.',
        ),
      ],
      'Noticed how a character changes over a story.',
    ),
  ],

  // ---------------------------------------------------------------- A11-18
  'a11-18-wind': [
    notice(
      0,
      'science',
      'wind words: breeze, blustery, gale',
      '3-ESS2-1',
      [
        CR(
          'Weather people have names for wind. A breeze is gentle. A blustery day has strong, gusty winds that come and go.',
        ),
        CR(
          'A gale blows at roughly 60 to 75 kilometres an hour (about 40 to 45 miles an hour). It can bring down branches, and sometimes chimneys.',
        ),
      ],
      'Learned the weather words breeze, blustery and gale.',
    ),
  ],
  'a11-18-wind-done': [
    ask(
      0,
      'maths',
      'subtraction with measurements',
      '2.OA.A.1',
      [
        N(
          'The letter-box is 25 centimetres wide. Piglet is 18 centimetres across. Will he fit, and by how many centimetres?',
        ),
      ],
      [
        opt(
          'Yes, by 7 centimetres',
          [CR('Yes. 25 − 18 = 7. It is a tight squeeze, but he can do it.')],
          true,
        ),
        opt('No, he is too wide', [
          CR('Check: 18 is smaller than 25, so he fits, with 7 centimetres to spare.'),
        ]),
        opt('Yes, by 43 centimetres', [
          CR('That is adding. To find the gap, subtract: 25 − 18 = 7.'),
        ]),
      ],
      'Subtracted two measurements to see whether something fits.',
    ),
  ],
  'a11-18-letterbox': [
    ask(
      8,
      'sel',
      'being brave while scared',
      'CASEL: Self-management',
      [N('Piglet shouts “I’m not frightened! Only a bit!” Is he brave? What does brave mean?')],
      [
        opt('Yes: brave means going on while scared', [
          N('Many people think so. Brave is not the lack of fear. It is what you do with it.'),
        ]),
        opt('No: real brave means not scared', [
          N(
            'That is a common idea. But if you are not scared, there is nothing to be brave about.',
          ),
        ]),
        opt('He is both scared and brave', [
          N('Exactly. Piglet is the best example in the Forest of both at once.'),
        ]),
      ],
      'Thought about what brave means.',
    ),
  ],
  'a11-18-letterbox-done': [
    notice(
      0,
      'literacy',
      'climax and resolution',
      'RL.3.3',
      [
        N(
          'A story’s climax is the moment of most tension. Piglet squeezing through the letter-box is this story’s.',
        ),
        N(
          'The resolution is how things settle after: here, the ladder arrives and Piglet arrives proud. Can you find both in your favourite book?',
        ),
      ],
      'Learned the terms climax and resolution.',
    ),
  ],
  'a11-18-house': [
    notice(
      6,
      'science',
      'owls nest in tree holes',
      '2-LS4-1',
      [
        CR(
          'Many owls are cavity nesters. They use holes in old trees, and sometimes barns, instead of building a nest.',
        ),
        CR(
          'So Owl in a hole of a beech tree is true to life. Different animals use different habitats: squirrels in dreys, badgers in setts, owls in holes.',
        ),
      ],
      'Learned that many owls nest in holes in trees.',
    ),
  ],
  'a11-18-house-done': [
    notice(
      1,
      'sel',
      'feelings can mix',
      'CASEL: Self-awareness',
      [
        N(
          'Piglet says yes bravely, then looks at the ground. He is proud of helping, and sad about the house. Both are true.',
        ),
        N(
          'When feelings mix, there is nothing wrong. You can name both: “I feel proud, and a little sad.”',
        ),
      ],
      'Heard that people can feel proud and sad at the same time.',
    ),
  ],
  'a11-18-complete': [
    notice(
      1,
      'social-studies',
      'a community looks after its own',
      'D2.Civ.8.K-2',
      [
        N(
          'Piglet gave up a house. Pooh offered a home. One generous act led to another, and nobody in the Forest was left without a roof.',
        ),
        N(
          'That is what a community does: it notices who is in need, and the people who can help, do.',
        ),
      ],
      'Heard how generosity spreads and communities look after each other.',
    ),
  ],

  // ---------------------------------------------------------------- A11-19
  'a11-19-meeting': [
    notice(
      3,
      'literacy',
      'resolution has more than one meaning',
      'L.3.4',
      [
        CR(
          'Eeyore calls his poem a Rissolution. The real word is resolution, which has several meanings.',
        ),
        CR(
          'A resolution can be a firm decision, the end of a story, or how sharp a picture is. Context tells you which. Here it is a decision to remember.',
        ),
      ],
      'Learned that resolution has several meanings and that spelling wobbles are fine.',
    ),
    ask(
      5,
      'sel',
      'saying a hard thing aloud, or in a poem',
      'CASEL: Self-awareness',
      [
        N(
          'Everyone knows Christopher Robin is going somewhere, and nobody says it aloud. Instead, Eeyore writes a poem.',
        ),
        N('Is it better to say hard things aloud, or to put them in a poem?'),
      ],
      [
        opt('Say it aloud', [
          N(
            'Saying it plainly can be a relief. But it is hard, and not everyone is ready at once.',
          ),
        ]),
        opt('Put it in a poem', [
          N(
            'A poem can hold feelings too big for ordinary words. And you can give it away, like a present.',
          ),
        ]),
        opt('Whichever feels possible', [
          N(
            'That is wise. People find their own way to say goodbye. What matters is that it gets said.',
          ),
        ]),
      ],
      'Thought about different ways of expressing hard feelings.',
    ),
  ],
  'a11-19-signed': [
    notice(
      1,
      'literacy',
      'what characters do not say',
      'RL.3.3',
      [
        N(
          'Tigger asks if Christopher Robin is coming back, and nobody answers. Sometimes what characters do not say tells you the most.',
        ),
        N(
          'If someone asks you a question like Tigger’s, an honest comfort is possible: “I don’t know, but he cares about you very much.”',
        ),
      ],
      'Noticed what a silence shows, and how to give honest comfort.',
    ),
  ],
  'a11-19-signed-rabbit': [
    notice(
      1,
      'literacy',
      'formal words show discomfort',
      'RL.3.3',
      [
        N(
          'Rabbit says “It has been noted.” Hardly anybody talks like that unless they are uncomfortable.',
        ),
        N(
          'Formal words are a way of keeping feelings at arm’s length. Reading between the lines, Rabbit is saying thank you.',
        ),
      ],
      'Noticed that formal words can show someone is uncomfortable with feelings.',
    ),
  ],
  'a11-19-scroll': [
    notice(
      1,
      'social-studies',
      'scrolls and signatures',
      'D2.His.2.K-2',
      [
        CR(
          'Before there were bound books, long texts were written on scrolls: rolls of papyrus or parchment. People have signed documents for thousands of years.',
        ),
        CR(
          'A signature says: I was here, and I agree. Every name on the Rissolution says that, in its own handwriting.',
        ),
      ],
      'Learned that long documents were once written on scrolls and signed.',
    ),
  ],
  'a11-19-scroll-done': [
    notice(
      1,
      'literacy',
      'how pace and quiet set a mood',
      'RL.4.3',
      [
        N(
          'Everyone goes “quietly, one by one”. The story slows right down, and the sentences go quiet too.',
        ),
        N(
          'Writers set a mood with pace as well as words. Here the slow, quiet ending tells you this is a sad goodbye, and a gentle one.',
        ),
      ],
      'Noticed how a writer uses pace to set a mood.',
    ),
  ],
  'a11-19-scroll-thistle': [
    notice(
      1,
      'science',
      'how pressing preserves a plant',
      null,
      [
        CR(
          'Eeyore’s thistle is pressed flat and dry. Pressing squeezes out the water, and a dry plant can last for hundreds of years.',
        ),
        CR(
          'Botanists keep pressed plants in a herbarium, a library of dried plants, as a record of what grew where and when.',
        ),
      ],
      'Learned that pressing a plant dries it so it can be kept as a record.',
    ),
  ],
  'a11-19-scroll-sat': [
    notice(
      2,
      'sel',
      'kindness is remembered',
      'CASEL: Relationship skills',
      [
        N(
          'Eeyore writes one line at the bottom: Somebody sat with me. He does not say who, and he does not need to.',
        ),
        N(
          'Small kindnesses often matter more than we know. Sitting with someone, with nothing to give, is one of the biggest.',
        ),
      ],
      'Heard that quiet kindness is remembered.',
    ),
  ],
  'a11-19-complete': [
    ask(
      1,
      'maths',
      'halves of a distance',
      '3.NF.A.1',
      [
        N(
          'The path to the top of the Forest is 2 kilometres. Christopher Robin asks you to come “some of the way”. If you walk half, how far is that?',
        ),
      ],
      [
        opt('1 kilometre', [CR('Yes. Half of 2 is 1. Some of the way, at its simplest.')], true),
        opt('2 kilometres', [CR('That would be all of the way. Half of 2 is 1.')]),
        opt('4 kilometres', [CR('That is double. Half means divide by 2: 2 ÷ 2 = 1.')]),
      ],
      'Found half of a distance.',
    ),
  ],

  // ---------------------------------------------------------------- A11-20
  'a11-20-climb': [
    doIt(
      9,
      'maths',
      'counting a circle in groups',
      '3.OA.A.3',
      'edu:count:trees:groups-of-7',
      [
        CR(
          'Counting in a circle is tricky, because there is no first tree. Tie a ribbon on one, and count round until you come back to the ribbon.',
        ),
        CR(
          'Try groups to check: nine groups of seven trees is 9 × 7 = 63. Or ten groups of six and a few more. Try several ways and compare.',
        ),
      ],
      'Learned to count a circle by marking a start and checking in groups.',
    ),
    ask(
      10,
      'sel',
      'is doing Nothing really nothing',
      'CASEL: Self-awareness',
      [
        N(
          'Christopher Robin says what he likes best is doing Nothing. Is doing Nothing really nothing? What happens when you do it?',
        ),
      ],
      [
        opt('It is resting your mind', [
          N(
            'Many people find that. Free time, without a plan, lets thoughts settle, and ideas arrive.',
          ),
        ]),
        opt('It is the best sort of something', [
          N(
            'Christopher Robin might say so. It is noticing and wandering, and that is not nothing at all.',
          ),
        ]),
        opt('It is boring', [
          N('For some, at first. Sometimes the boredom is the doorway to something good.'),
        ]),
      ],
      'Thought about the value of unplanned free time.',
    ),
  ],
  'a11-20-knight': [
    ask(
      2,
      'maths',
      'factors of a number',
      '3.OA.A.3',
      [
        N(
          'Christopher Robin and Pooh talk about a thing called Factors. Factors are numbers that multiply to make another.',
        ),
        N('2 and 6 are factors of 12, because 2 × 6 = 12. Which of these is a factor of 12?'),
      ],
      [
        opt('4', [CR('Yes. 4 × 3 = 12, so 4 and 3 are factors of 12.')], true),
        opt('5', [CR('5 does not divide 12 exactly: 5 × 2 = 10 and 5 × 3 = 15. Try 4.')]),
        opt('7', [
          CR('7 × 1 = 7 and 7 × 2 = 14, so 7 misses 12. Factors of 12 are 1, 2, 3, 4, 6 and 12.'),
        ]),
      ],
      'Learned what a factor is and found one of 12.',
    ),
    notice(
      5,
      'social-studies',
      'knighthood and the accolade',
      'D2.His.2.K-2',
      [
        CR('In the Middle Ages, a knight was a trained warrior who served a lord.'),
        CR(
          'To make someone a knight, the lord tapped each shoulder with a sword. That tap is called the accolade.',
        ),
        CR(
          'Christopher Robin uses a stick, which is the right size for a Bear. The honour is the same.',
        ),
      ],
      'Learned what a knight was and how knighting worked.',
    ),
  ],
  'a11-20-knight-done': [
    notice(
      1,
      'sel',
      'promises and remembering',
      'CASEL: Relationship skills',
      [
        N(
          'Pooh promised to remember. We are made partly of being remembered: the people who remember us carry us with them.',
        ),
        N(
          'A promise like this does not need words every day. It only needs keeping, quietly, for ever.',
        ),
      ],
      'Heard that promises and remembering keep people close.',
    ),
  ],
  'a11-20-complete': [
    ask(
      2,
      'maths',
      'why a marker helps when counting a circle',
      null,
      [
        N(
          'Your Nubbin ties its ribbon round one tree. Why does a marker help when counting trees in a circle?',
        ),
      ],
      [
        opt(
          'It shows where you started',
          [
            CR(
              'Yes. In a circle you can go round again and again, so the ribbon tells you when you are back.',
            ),
          ],
          true,
        ),
        opt('It makes the tree easier to climb', [
          CR(
            'It might! But the real reason is that a marker tells you when the count is finished.',
          ),
        ]),
        opt('It does not help at all', [
          CR('Try counting without one and you may find yourself counting some trees twice.'),
        ]),
      ],
      'Understood that a marker shows where counting started.',
    ),
  ],

  // ---------------------------------------------------------------- variants
  'a11-11-door-thistle': [
    notice(
      2,
      'science',
      'plants rest in winter and grow in spring',
      '2-LS2-1',
      [
        CR(
          'Eeyore has planted the thistle by his step in the snow. Many plants rest through winter, and grow again when the ground warms.',
        ),
        CR(
          'A thistle needs water and sunlight to grow, and spring brings both. Give it time, and it will be a plant again.',
        ),
      ],
      'Learned that plants rest through winter and need water and light to grow.',
    ),
  ],
  'a11-11-door-sat': [
    notice(
      2,
      'literacy',
      'reading between the lines',
      'RL.3.3',
      [
        N(
          'Eeyore says you do not have to sit there. But he has kept a space exactly your size, and a smaller one for your Nubbin.',
        ),
        N(
          'Reading between the lines, he very much hopes you will. Sitting with a gloomy friend is the sort of kindness that gets remembered.',
        ),
      ],
      'Read between the lines of what a character says and does.',
    ),
  ],
  'a11-16-bounced-sat': [
    notice(
      5,
      'sel',
      'trust grows from kindness',
      'CASEL: Social awareness',
      [
        N(
          'Eeyore asks you to tell the others, because you are the one who sits with him. They will believe you.',
        ),
        N(
          'Trust is built from small kindnesses over time. People believe those who have been steady and kind to them.',
        ),
      ],
      'Heard that trust is built from kind actions over time.',
    ),
  ],
  'a11-17-mist-rabbit': [
    notice(
      3,
      'science',
      'people walk in circles when they cannot see far',
      null,
      [
        CR(
          'Rabbit passes the same sand-pit twice. Experiments show that people who cannot see landmarks, in thick fog or a dark forest, tend to walk in circles.',
        ),
        CR(
          'With no marker to aim at, tiny differences in each step add up. That is why “stop and call out” beats “keep walking”.',
        ),
      ],
      'Learned that people tend to walk in circles when they cannot see landmarks.',
    ),
  ],
  'a11-17-found-rabbit': [
    notice(
      1,
      'sel',
      'sitting quietly with a scared friend',
      'CASEL: Social awareness',
      [
        N(
          'You did not need words in the hollow. Sitting quietly beside Rabbit while the mist drips was enough.',
        ),
        N('A scared person often does not need advice. They need to know they are not alone.'),
      ],
      'Heard that sitting quietly with a scared friend helps them feel less alone.',
    ),
  ],
  'a11-20-complete-thistle': [
    notice(
      1,
      'science',
      'thistle seeds travel on fluff',
      '2-LS2-2',
      [
        CR(
          'A thistle’s seeds each have a fluffy parachute, so the wind carries them far. Goldfinches love to eat them, and spill some, which helps them spread.',
        ),
        CR(
          'That is how thistles end up planted in places nobody chose. This one is planted by choice, at the edge of the ring.',
        ),
      ],
      'Learned that thistle seeds travel on wind and are spread by birds.',
    ),
  ],
  'a11-20-complete-sat': [
    notice(
      1,
      'science',
      'signs animals leave: a hare’s form',
      null,
      [
        CR(
          'A flattened round in the grass is a sign that somebody has rested there. A hare’s resting place is even called a form.',
        ),
        CR(
          'Naturalists read signs like these: flattened grass, feathers, tracks and droppings tell them who has been there, and when.',
        ),
      ],
      'Learned that flattened grass is a sign an animal has rested there.',
    ),
  ],
  'a11-margin-hazel': [
    notice(
      5,
      'sel',
      'writing keeps people close',
      'CASEL: Self-awareness',
      [
        N(
          'Hazel wrote this note long ago, for a child who would read it later. And here it is, reaching you.',
        ),
        N(
          'We are made partly of being remembered. A note, a drawing or a letter can keep someone close, long after the pencil has stopped.',
        ),
      ],
      'Heard that a written note can keep someone close.',
    ),
  ],
};

// ================================================================== the glossary (reader vocabulary)
const GLOSSARY: GlossaryEntry[] = [
  gloss('gravity', 'The pull that drags everything towards the ground.', 'a11-01-balloon'),
  gloss('motive', 'The reason a character does something.', 'a11-01-page-done'),
  gloss(
    'suspicious',
    'Not trusting someone, and thinking they may be up to something.',
    'a11-01-balloon-done',
  ),
  gloss(
    'simile',
    'A comparison that uses “like” or “as”, such as “as round as a ball”.',
    'a11-01-bees-done',
  ),
  gloss('nectar', 'The sweet juice inside flowers that bees collect.', 'a11-02-visit'),
  gloss(
    'pollinate',
    'To carry pollen from flower to flower so plants can make seeds.',
    'a11-02-visit',
  ),
  gloss(
    'sustaining',
    'Keeping you going and giving you strength, like a hearty meal.',
    'a11-02-stuck',
  ),
  gloss(
    'friction',
    'The grip between two surfaces that rub against each other, which slows things down.',
    'a11-02-week-done',
  ),
  gloss('hypothesis', 'An idea about how something works that you can test.', 'a11-03-count'),
  gloss('procedure', 'The steps for doing something in a set order.', 'a11-04-owl'),
  gloss(
    'notice',
    'A sign that gives people information. It can also mean to see something.',
    'a11-04-owl',
  ),
  gloss('inference', 'A conclusion you work out from clues.', 'a11-05-dig-done'),
  gloss('marsupial', 'An animal that carries its baby in a pouch, like a kangaroo.', 'a11-07-plan'),
  gloss('joey', 'A baby kangaroo.', 'a11-07-plan'),
  gloss('tendon', 'A strong, stretchy cord that joins muscle to bone.', 'a11-07-swap'),
  gloss('expedition', 'A journey made for a purpose, such as exploring.', 'a11-08-pole-done'),
  gloss('flood', 'Too much water flowing over land that is usually dry.', 'a11-09-rain'),
  gloss('buoyant', 'Able to float.', 'a11-09-rain-done'),
  gloss(
    'graphite',
    'The soft, dark mineral in pencils that leaves marks on paper.',
    'a11-10-complete',
  ),
  gloss('perimeter', 'The distance all the way round the edge of a shape.', 'a11-11-snow-done'),
  gloss(
    'dramatic irony',
    'When the reader knows something the characters do not.',
    'a11-11-missing-done',
  ),
  gloss('theme', 'The big idea underneath a story.', 'a11-11-door'),
  gloss('extract', 'The strong part of something, squeezed or boiled out of it.', 'a11-12-malt'),
  gloss(
    'metamorphosis',
    'A big change in an animal’s body as it grows, like a caterpillar becoming a butterfly.',
    'a11-13-small',
  ),
  gloss(
    'upstream',
    'In the direction a river comes from. The other way is downstream.',
    'a11-16-cone',
  ),
  gloss('fair test', 'An experiment where you change only one thing and repeat it.', 'a11-16-cone'),
  gloss('foreshadowing', 'Hints in a story about what will happen later.', 'a11-17-plan-done'),
  gloss('blustery', 'Windy, with strong gusts that come and go.', 'a11-18-wind'),
  gloss('gale', 'A very strong wind.', 'a11-18-wind'),
  gloss('climax', 'The most exciting or tense moment in a story.', 'a11-18-letterbox-done'),
  gloss(
    'resolution',
    'A firm decision. It can also mean the way a story’s problem is settled.',
    'a11-19-meeting',
  ),
  gloss(
    'factor',
    'A number that divides exactly into another number, such as 3 and 4 for 12.',
    'a11-20-knight',
  ),
  gloss(
    'accolade',
    'The ceremony of making someone a knight by touching their shoulders with a sword.',
    'a11-20-knight',
  ),
];

// ================================================================== assembling the quests
const build = (of: string): EduScene => {
  const data = SCENES[of];
  const lessons = LESSONS[of];
  if (!data || !lessons) throw new Error(`edu-a11-reader: scene ${of} is missing lines or lessons`);
  return {
    id: `reader:${of}`,
    of,
    band: 'reader',
    lines: data.lines,
    ...(data.choices ? { choices: data.choices } : {}),
    lessons: [...lessons]
      .sort((a, b) => a.after - b.after)
      .map((l, i) => ({ id: `reader:${of}-l${i + 1}`, ...l })),
  };
};

export const EDU_A11_READER: EduQuest[] = QUEST_DEFS.map((q) => ({
  id: `reader:${q.of}`,
  of: q.of,
  band: 'reader',
  title: q.title,
  goals: q.goals,
  scenes: q.scenes.map(build),
  glossary: GLOSSARY.filter((g) => g.scene.startsWith(`reader:${q.of}-`)),
}));

/** Reader versions of every scene in A11_VARIANTS. */
export const EDU_A11_READER_VARIANTS: EduScene[] = VARIANT_IDS.map(build);

/** Every `edu:` check used by a `do` lesson in this file. */
export const CHECKS: string[] = [
  'edu:tally:days-of-week:7',
  'edu:drop:stick:fast-water',
  'edu:count:trees:groups-of-7',
];
