/**
 * The Learning Grove, reader band (ages 7–10): Atlas page A31, The Hero Twins (the Popol Vuh,
 * K’iche’ Maya, Guatemala).
 *
 * Source: atlas-a31.ts (ATLAS_A31 and A31_VARIANTS). One EduScene per original scene, id
 * `reader:<original id>`, with every original choice id and flag kept (`a31-rat` on a31-09-roof,
 * `a31-corn` on a31-10-corn). Every step scene, done scene, complete scene and variant has a
 * version.
 *
 * What it teaches (outline: where Guatemala is and that K’iche’ Maya people live there and speak
 * K’iche’ today; how corn grows and that people in this part of the world first grew it; Maya
 * numbers, counted in twenties, with a dot, a bar and a shell for zero; the rubber ball made from
 * tree sap; why the sun and the moon seem to take turns): Central America on a map, K’iche’ as
 * a living language, the corn life cycle and the milpa, dot-and-bar numbers (7 = a bar and two
 * dots; 20 x 20 = 400, the Four Hundred Boys), rubber from latex, and the Earth’s spin. Around
 * those: sums and equal groups with the story’s own numbers, time intervals, rhythm patterns,
 * symmetry, vocabulary, character motive and theme, fair swaps, comparing fixes, and animal
 * facts. Think questions (no best answer): page-done, door, a31-06-complete, a31-10-complete,
 * the game, the curtain and the hearth.
 *
 * Softened as the outline asks (EDU-STYLE.md, “Hard things”):
 * - The fathers “stay in Xibalba”: they do not come back, and nobody says more. The Four Hundred
 *   Boys are the page’s one death, said plainly and once, with the stars as comfort.
 * - Seven Macaw snatches a blowgun. The bat takes a hat and a squash makes a pretend one. The
 *   oven is a glow, and the river hides the twins as catfish. The dancers’ wonders are a house
 *   that vanishes in smoke and a dog that lies down and jumps up. The lords’ end is a curtain
 *   and empty seats. The cigars are candles. No ceremony, copal or prayer is on the page.
 * - No lines from Spence or any translation, and none from the originals’ childLines. Every
 *   margin line is new. Hazel’s note is reworded to match.
 * - The page is a K’iche’ grandmother’s kitchen today. Nothing says “lost civilisation”.
 * - Every fact is well established: Guatemala is in Central America, south of Mexico; more than
 *   twenty Mayan languages are spoken there; the Popol Vuh was written down by K’iche’ authors in
 *   the 1550s; rubber is made from the milky latex of a tree; dry gourds make bowls; corn, beans
 *   and squash grow together in a milpa; crabs have ten legs; Guatemala has more than thirty
 *   volcanoes; baked clay cannot be turned back to soft clay; fireflies make cold light; jaguars
 *   hide in dappled light; many bats find their way by echoes; catfish have barbels; jade is
 *   carved in Guatemala; the Earth turns once in about 24 hours; the Sun rises in the east; the
 *   Moon can be seen by day; corn was first grown from a wild grass over 8,000 years ago.
 */
import type { EduDomain, EduQuest, EduScene, GlossaryEntry, Lesson } from './types';
import type { Line, Choice } from '../config/story';

type Mood = NonNullable<Line['mood']>;
const say =
  (who: string) =>
  (text: string, mood?: Mood): Line =>
    mood ? { who, text, mood } : { who, text };

// ---------------------------------------------------------------- speakers
const N = say('narrator');
const Y = say('you');
const BY = say('byte');
const GM = say('a31-gran');
const GD = say('a31-girl');
const HP = say('a31-hunahpu');
const XB = say('a31-xbalanque');
const HH = say('a31-hun');
const VH = say('a31-vucub');
const XQ = say('a31-xquic');
const XM = say('a31-xmucane');
const OW = say('a31-owls');
const GO = say('a31-gourd');
const OM = say('a31-monkey');
const OA = say('a31-artisan');
const SM = say('a31-macaw');
const OC = say('a31-elders');
const ZP = say('a31-zipacna');
const EQ = say('a31-earthquake');
const RT = say('a31-rat');
const MQ = say('a31-mosquito');
const LS = say('a31-louse');
const TD = say('a31-toad');
const FA = say('a31-falcon');
const RD = say('a31-road');
const OD = say('a31-one-death');
const SD = say('a31-seven-death');
const LD = say('a31-lords');

// ---------------------------------------------------------------- builders
type Beat = Omit<Lesson, 'id'>;
type Opt = NonNullable<Lesson['options']>[number];

/** One answer option. `best` marks the answer the lesson teaches; a think question has none. */
const o = (label: string, reply: Line[], best = false): Opt =>
  best ? { label, best, reply } : { label, reply };

const std = (standard?: string) => (standard ? { standard } : {});

const ask = (
  after: number,
  domain: EduDomain,
  skill: string,
  standard: string | undefined,
  prompt: Line[],
  options: Opt[],
  parentNote: string,
): Beat => ({ domain, skill, ...std(standard), kind: 'ask', after, prompt, options, parentNote });

const notice = (
  after: number,
  domain: EduDomain,
  skill: string,
  standard: string | undefined,
  lines: Line[],
  parentNote: string,
): Beat => ({ domain, skill, ...std(standard), kind: 'notice', after, lines, parentNote });

/** One reader scene. Lesson ids are `reader:<of>-l<n>`, numbered in play order. */
const sc = (of: string, lines: Line[], beats: Beat[], choices?: Choice[]): EduScene => ({
  id: `reader:${of}`,
  of,
  band: 'reader',
  lines,
  ...(choices ? { choices } : {}),
  lessons: [...beats]
    .sort((a, b) => a.after - b.after)
    .map((b, i) => ({ id: `reader:${of}-l${i + 1}`, ...b })),
});

const quest = (
  of: string,
  title: string,
  goals: EduQuest['goals'],
  scenes: EduScene[],
): EduQuest => ({ id: `reader:${of}`, of, band: 'reader', title, goals, scenes });

const ch = (id: string, label: string, then: Line[], set?: Choice['set']): Choice => ({
  id,
  label,
  ...(set ? { set } : {}),
  then,
});

const GLOSSARY: GlossaryEntry[] = [];
const gloss = (word: string, meaning: string, of: string): void => {
  GLOSSARY.push({ word, meaning, scene: `reader:${of}` });
};

const SOFT_EDGE = N('The page starts to go soft round the edges, like a kitchen full of smoke.');
const WHICH_SUN = GM(
  'My grandmother told me which one is which. I will tell you one day. That is how it goes.',
  'soft',
);

// ================================================================== A31-1 The Hearth
gloss('highlands', 'High, hilly land, often with mountains.', 'a31-01-page');
const Q1 = quest(
  'a31-01',
  'The Hearth',
  {
    'a31-01-s1': {
      goal: 'Step into the kitchen on the atlas page.',
      hint: 'Put your hand on the warm page, then go in through the doorway.',
    },
    'a31-01-s2': {
      goal: 'Sit by the hearth and listen to the old story.',
      hint: 'Sit on the low stool by the fire and watch the smoke go up.',
    },
  },
  [
    sc(
      'a31-01-page',
      [
        N(
          'Nova’s atlas falls open at a page that smells of woodsmoke. There is a hearth, a stack of tortillas and a green mountain with cloud on its shoulder.',
        ),
        N(
          'You put your hand flat on the page, and it is warm. Then the warmth is a fire, and you are standing in a doorway in the highlands of Guatemala.',
        ),
        N(
          'A grandmother sits by the fire, patting dough into rounds and laying them on a clay griddle. Pat, pat, turn.',
        ),
        N(
          'A girl of about nine is doing her homework at the table, badly, because she keeps watching the door.',
        ),
        GD('Grandmother. Someone’s at the door. With a… what is that?', 'shock'),
        GM('A guest, and a small guest. Come in, both of you. The cold gets in.', 'happy'),
        N(
          'Your Nubbin goes straight to the fire and sits down, as if it has been coming here for years.',
        ),
      ],
      [
        notice(
          3,
          'social-studies',
          'Guatemala is in Central America, south of Mexico; K’iche’ Maya people live there and speak K’iche’ today',
          'D2.Geo.2.3-5',
          [
            GM(
              'This kitchen is in Guatemala. Look south of Mexico on a map, and there we are, in Central America.',
            ),
            GM(
              'Many people here are K’iche’ Maya, and K’iche’ is one of more than twenty Mayan languages spoken in Guatemala.',
            ),
            GM(
              'We speak it today, at this table. It is not a language from a book. It is the one I scold you in.',
              'happy',
            ),
          ],
          'Learned where Guatemala is on a map, and that K’iche’ Maya people live there and speak K’iche’ today.',
        ),
      ],
      [
        ch('stool', 'Sit on the low stool she points to.', [
          GM('Good. Now you’re the right height for a story.'),
        ]),
        ch('help', 'Offer to help with the tortillas.', [
          N('You try. Yours comes out the shape of a country nobody would want to live in.'),
          GM('You eat that one yourself. That’s the rule.', 'happy'),
        ]),
        ch('warm', 'Let your Nubbin warm its paws.', [
          N('It holds its paws to the fire, then turns round and warms its back, very seriously.'),
        ]),
      ],
    ),
    sc(
      'a31-01-page-done',
      [
        GD('Is it a dog?'),
        GM('It’s a guest. You don’t ask a guest what it is. You give it a tortilla.'),
        N(
          'Your Nubbin is given a tortilla, warm from the griddle. It holds it in both paws like a letter from home.',
        ),
      ],
      [
        ask(
          1,
          'sel',
          'thinking about how to welcome a stranger',
          'CASEL: Social awareness',
          [
            N(
              'The grandmother welcomed a stranger with food before asking a single question. What do you think that says about how to welcome someone?',
            ),
          ],
          [
            o('Be kind first. Questions can wait.', [
              N(
                'That’s a fair answer. The grandmother would agree: first make someone comfortable, then get curious.',
              ),
            ]),
            o('Ask questions first, so you know who they are.', [
              N(
                'That’s a fair answer too: knowing who is at your door matters. The grandmother just feeds people while she works it out.',
              ),
            ]),
            o('It depends on the guest.', [
              N(
                'That’s a thoughtful answer. A good host notices who is in front of them, and what they need most.',
              ),
            ]),
          ],
          'Thought about how to welcome a stranger, with no single right answer.',
        ),
      ],
    ),
    sc(
      'a31-01-ribbons',
      [
        N(
          'The girl’s eyes go to your Nubbin’s ribbons: gold and silver, stitched together down the middle in green.',
        ),
        GD('Why’s it got two colours?', 'think'),
        N(
          'She counts the colours anyway, thread and all, under her breath: gold, silver, green, and round again.',
        ),
        N(
          'Before you can answer, her grandmother hands her a tortilla, and the question goes in with it.',
        ),
      ],
      [
        ask(
          2,
          'maths',
          'a repeating colour pattern: find the 7th',
          '4.OA.C.5',
          [
            N(
              'The girl’s colours go gold, silver, green, gold, silver, green, and on. What colour is the 7th?',
            ),
          ],
          [
            o(
              'Gold',
              [
                N(
                  'Yes. The pattern repeats every three: 1 gold, 2 silver, 3 green, 4 gold, 5 silver, 6 green, 7 gold.',
                ),
              ],
              true,
            ),
            o('Silver', [
              N(
                'Let’s count: 1 gold, 2 silver, 3 green, 4 gold, 5 silver, 6 green, 7 gold. The 7th is gold.',
              ),
            ]),
            o('Green', [
              N('Green comes 3rd and 6th. Count on: the 7th starts the pattern again with gold.'),
            ]),
          ],
          'Found the 7th item in a repeating three-colour pattern.',
        ),
      ],
    ),
    sc(
      'a31-01-story',
      [
        GD('Grandmother. Tell the old one. The twins one. With the ball.', 'happy'),
        GM('You’ve heard it a hundred times.'),
        GD('So it’s a hundred and one. Please.'),
        GM('Our people wrote it down long ago, in our own language, so it wouldn’t be lost.'),
        GM(
          'People still read it. And grandmothers still tell it, which is better, because you can interrupt a grandmother.',
          'happy',
        ),
        GD('You can’t interrupt a book.'),
        GM('You can. It just doesn’t notice.'),
        N(
          'She lays another tortilla on the griddle. The smoke goes up past the beam, slow and grey, and you watch it go.',
        ),
        GM('Before the sun was the sun, there were two brothers who played ball…'),
        N(
          'The smoke thickens, and the kitchen goes soft at the edges. You can still hear her voice, but now there is grass under your feet.',
        ),
      ],
      [
        notice(
          4,
          'literacy',
          'a story can be told aloud and written down; oral stories change as they are told',
          'RL.4.2',
          [
            GM(
              'The book was written down by K’iche’ authors in the 1550s, in our own language. People still read it.',
            ),
            GM(
              'But a told story is different. I can leave things out, add things, answer you back.',
            ),
            GM(
              'A story that is told by many voices keeps being told. That is what a living story is.',
            ),
          ],
          'Learned that a story can be both written and told aloud, and that a told story keeps changing and living.',
        ),
      ],
      [
        ch('nubbin', 'Pick your Nubbin up first.', [
          N('You scoop it off the hearth. It is warm right through, like a loaf.'),
        ]),
        ch('gran', 'Keep your eyes on the grandmother.', [
          GM('I’m still here. I’ll be here the whole time. Go on.', 'soft'),
        ]),
      ],
    ),
    sc(
      'a31-01-complete',
      [
        N(
          'You are standing on a hillside in the early morning, in a world that is mostly still being made.',
        ),
        N(
          'Somewhere close, something heavy and rubbery goes thock against a wall. Then again: thock.',
        ),
        GM('Listen. That’s them.'),
        N('Your Nubbin’s ears go up. Whatever that noise is, it wants it.'),
      ],
      [
        ask(
          1,
          'science',
          'sound is made by vibration',
          '4-PS3-2',
          [
            GM(
              'Thock. The ball hits the wall, and you hear it from here. What is happening to make that sound?',
            ),
          ],
          [
            o(
              'The ball and the wall vibrate, and the air carries the shake to our ears.',
              [
                N(
                  'Yes. A sound is a vibration, a very fast shake, passed through the air to your ears.',
                ),
              ],
              true,
            ),
            o('The ball is only loud because it is heavy.', [
              N(
                'Weight helps, because a heavy ball hits harder and shakes more. But the sound itself is the shake that travels through the air.',
              ),
            ]),
            o('The sound travels without anything shaking.', [
              N(
                'Every sound starts with something shaking. Put your fingers on your throat and hum, and you can feel it.',
              ),
            ]),
          ],
          'Learned that sound is a vibration that travels through the air to our ears.',
        ),
      ],
    ),
  ],
);

// ================================================================== A31-2 The Ballplayers
gloss('summon', 'To order someone to come to you.', 'a31-02-complete');
gloss('latex', 'The milky, sticky sap of some trees, used to make rubber.', 'a31-02-fetch');
const Q2 = quest(
  'a31-02',
  'The Ballplayers',
  {
    'a31-02-s1': {
      goal: 'Watch the two brothers play ball.',
      hint: 'Go down the hill to the ballcourt and watch from the wall.',
    },
    'a31-02-s2': {
      goal: 'Help your Nubbin bring back the ball that went over the wall.',
      hint: 'Follow your Nubbin down the slope and carry the ball back up together.',
    },
  },
  [
    sc(
      'a31-02-court',
      [
        N(
          'Below the hill is a ballcourt: two long sloping walls, with a strip of beaten earth between them.',
        ),
        N(
          'Two men are playing on it, and they are loud about it. Every point gets a shout, and every miss gets a louder one.',
        ),
        HH('Mine! That was mine, and you know it.', 'happy'),
        VH('It hit your knee. Knees don’t count. Knees have never counted.'),
        N(
          'They never touch the ball with their hands. They take it on the hip, the thigh, the shoulder, and it flies off heavy and black.',
        ),
        GM('Hun Hunahpu and his brother, Vucub Hunahpu. Good players. Terrible neighbours.'),
        N('Down under the court, a long way under, somebody is trying to sleep.'),
        N('The ball bounces off the end wall, spins once, and rolls straight towards your Nubbin.'),
      ],
      [
        ask(
          4,
          'maths',
          'add and subtract within 100 in a word problem',
          '2.OA.A.1',
          [
            N(
              'Hun Hunahpu has scored 7 points and Vucub has scored 5. How many have they scored together?',
            ),
          ],
          [
            o('12', [N('Yes. 7 + 5 = 12. And Hun is ahead by 2, which he will mention.')], true),
            o('11', [
              N(
                'Close: count on five from 7, and you get 8, 9, 10, 11, 12. They have 12 together, and Hun leads by 2.',
              ),
            ]),
            o('13', [
              N(
                'One too many: count on five from 7, and you get 8, 9, 10, 11, 12. The answer is 12.',
              ),
            ]),
          ],
          'Added 7 and 5 in a word problem and found the difference.',
        ),
      ],
      [
        ch('bump', 'Let your Nubbin have a go.', [
          N(
            'It hip-bumps the ball, and the ball does not move. Your Nubbin does, backwards, and sits down.',
          ),
          VH('Good form. Wrong direction.', 'happy'),
        ]),
        ch('hands', 'Roll it back to them.', [
          HH('Hands! Hands on the ball!', 'shock'),
          VH('Leave it. Guests get one hand-ball. It’s an old rule. I made it up just now.'),
        ]),
      ],
    ),
    sc(
      'a31-02-fetch',
      [
        N(
          'The next shot goes high over the wall and away down the hill. Both brothers look at each other, then at your Nubbin.',
        ),
        HH('Little one. Would you?'),
        N(
          'Your Nubbin is already gone, bouncing down the slope after the ball, bouncing almost as well as the ball does.',
        ),
        N('You find it sitting proudly on the ball, which is nearly as big as it is.'),
        N(
          'The ball is heavier than you expect. It’s made from tree sap, worked until it bounces, and it smells faintly of smoke.',
        ),
        GM(
          'People here made balls like that long before anyone else in the world had one. Remember that, when you play.',
        ),
        N('You carry it back up between you. Your Nubbin carries the important end.'),
      ],
      [
        notice(
          4,
          'science',
          'rubber is made from the milky latex of a tree; materials have properties',
          undefined,
          [
            GM(
              'The sap is called latex. It comes out of the rubber tree thick and white, like milk that has been left out.',
            ),
            GM(
              'Left alone, it dries into something stretchy that bounces. People in this part of the world were using it more than three thousand years ago.',
            ),
            GM(
              'A tree gave them a material that was stretchy, bouncy and waterproof. All they needed was the idea.',
            ),
          ],
          'Learned that rubber is made from the latex of a tree, and that it is stretchy and bouncy.',
        ),
      ],
      [
        ch('nubbin', 'Let your Nubbin hand it over.', [
          N(
            'It pushes the ball up to Hun Hunahpu with its whole body. He bows to it, very low, and it bows back.',
          ),
        ]),
        ch('throw', 'Throw it back over the wall.', [
          N(
            'It sails over and lands with a thock. A cheer from the court: apparently that counts as a point for somebody.',
          ),
        ]),
      ],
    ),
    sc(
      'a31-02-complete',
      [
        N(
          'Then the owls come. Four of them, out of a clear sky, and they land on the end wall in a row.',
        ),
        OW(
          'From the lords of Xibalba, One Death and Seven Death. You are loud. You are very loud.',
        ),
        OW('They summon you. Come down and play against them. Bring your gear.'),
        HH('They want a game. Good. We’re the best there is.', 'happy'),
        N(
          'That evening the brothers tie their ball and gear up in the roof of their mother Xmucane’s house, where she won’t have to look at it.',
        ),
        N('They tell her not to worry. People always tell people that.', 'sad'),
      ],
      [
        ask(
          2,
          'literacy',
          'the meaning of an unknown word from context',
          'L.3.4',
          [N('The owls say the lords “summon” the brothers. What does summon mean?')],
          [
            o(
              'To order someone to come',
              [N('Yes. You can tell from the story: the brothers are told to come down and play.')],
              true,
            ),
            o('To invite someone to dinner', [
              N(
                'A summons is not an invitation you can turn down. The owls expect the brothers to go.',
              ),
            ]),
            o('To send someone away', [
              N('It is the opposite. To summon is to call someone to you.'),
            ]),
          ],
          'Worked out the meaning of “summon” from the story.',
        ),
      ],
    ),
  ],
);

// ================================================================== A31-3 The Road Down
const Q3 = quest(
  'a31-03',
  'The Road Down',
  {
    'a31-03-s1': {
      goal: 'Listen to the grandmother tell what happened on the road down.',
      hint: 'Stay on the empty road and let her tell it.',
    },
    'a31-03-s2': {
      goal: 'Look at the tree by the road.',
      hint: 'The tree full of gourds stands just off the road. Go and look; you needn’t touch.',
    },
  },
  [
    sc(
      'a31-03-road',
      [
        N('The page goes quiet. There is a road going down between rocks, and nobody on it.'),
        GM('This part I tell. You don’t need to see it.'),
        GM('They went down and down, across rivers, to a place where four roads meet.'),
        GM('At the bottom they met the lords of Xibalba, and a test nobody could win.'),
        GM('And they didn’t come back up. They stayed there, in Xibalba.', 'sad'),
        N('The road stays empty. A little wind moves the dust on it.'),
      ],
      [
        ask(
          4,
          'sel',
          'handling the feeling of missing someone',
          'CASEL: Self-awareness',
          [
            N(
              'Xmucane is left at home, waiting. Which is a healthy way to carry the feeling of missing someone?',
            ),
          ],
          [
            o(
              'Let yourself feel it, and talk about them.',
              [
                N(
                  'Yes: a big feeling is easier to carry when it is shared. Saying their name and telling their stories keeps them close.',
                ),
              ],
              true,
            ),
            o('Keep busy so you never think about it.', [
              N(
                'Being busy can help for a while. But the feeling waits for us, and it eases when we say it out loud to someone.',
              ),
            ]),
            o('Pretend it does not hurt.', [
              N(
                'Many people try that, but it is heavy to carry alone. Telling someone you miss them makes it lighter.',
              ),
            ]),
          ],
          'Thought about healthy ways to carry the feeling of missing someone.',
        ),
      ],
      [
        ch('sit', 'Sit down at the side of the road.', [
          N('You sit. Your Nubbin sits too, close enough that you can feel it breathing.'),
        ]),
        ch('ask', 'Ask what happened to them.', [
          GM(
            'They stayed down there. That’s enough for now. The story isn’t finished with them.',
            'soft',
          ),
        ]),
      ],
    ),
    sc(
      'a31-03-tree',
      [
        N(
          'By the side of the road there is a tree you didn’t notice before. It is heavy with round green gourds.',
        ),
        N('In the atlas’s margin there is a little brown drawing of it, every gourd the same.'),
        GD('Grandmother. Why can’t anyone go near it?', 'shock'),
        GM('The lords said nobody was to touch that tree. So of course somebody did.'),
        GM('Eat your tortilla.'),
        N(
          'Your Nubbin looks up into the branches for a long time. Then it pats the trunk once, the way it pats you when you’re tired.',
        ),
      ],
      [
        notice(
          3,
          'science',
          'a dried gourd shell is hard and waterproof, so it makes a bowl or cup',
          undefined,
          [
            GM(
              'A gourd is a fruit with a thick skin. When it dries out, the skin turns hard and light, and the inside can be scooped away.',
            ),
            GM(
              'People in Guatemala still make bowls and cups from dried gourds. They are strong, light, and they hold water.',
            ),
          ],
          'Learned that a dried gourd has a hard, waterproof shell, so it makes a bowl or cup.',
        ),
      ],
      [
        ch('look', 'Look for the gourd that’s different.', [
          N('You look, and every gourd is the same. That’s the point, you think.'),
        ]),
        ch('leave', 'Leave the tree be.', [
          N('You step back onto the road. Some things you don’t need to find.'),
        ]),
      ],
    ),
    sc(
      'a31-03-complete',
      [
        N('The page turns a little, in a wind from nowhere. The road goes on being empty.'),
        GM(
          'At home, Xmucane made supper for the two grandsons she still had. Three tortillas each, because they were growing.',
        ),
        GM('Nobody came up the road. They waited.'),
        GD('And then?'),
        GM(
          'And then a girl went to look at a tree she wasn’t allowed to look at. That’s how most good stories start.',
          'happy',
        ),
      ],
      [
        ask(
          1,
          'maths',
          'multiplication as equal groups',
          '3.OA.A.3',
          [
            N(
              'Xmucane and her two grandsons eat three tortillas each. How many tortillas is that altogether?',
            ),
          ],
          [
            o('9', [N('Yes. Three people, three tortillas each: 3 x 3 = 9.')], true),
            o('6', [
              N('That counts only two people. Xmucane eats too: 3 people x 3 tortillas = 9.'),
            ]),
            o('3', [N('That is one person’s share. Three people x 3 tortillas = 9.')]),
          ],
          'Solved an equal-groups word problem: 3 people with 3 tortillas each.',
        ),
      ],
    ),
  ],
);

// ================================================================== A31-4 The Calabash Tree
gloss('forbidden', 'Not allowed.', 'a31-04-xquic');
const Q4 = quest(
  'a31-04',
  'The Calabash Tree',
  {
    'a31-04-s1': {
      goal: 'Watch the girl who comes to the forbidden tree.',
      hint: 'Hide behind the rock near the tree and watch.',
    },
    'a31-04-s2': {
      goal: 'Go with the owls and Xquic into the forest.',
      hint: 'Walk behind the owls through the red-barked trees.',
    },
    'a31-04-s3': {
      goal: 'Help press the red sap into a heart shape.',
      hint: 'Hold the bowl under the cut bark while the sap runs, then help shape it.',
    },
  },
  [
    sc(
      'a31-04-xquic',
      [
        N(
          'Down in Xibalba it is never quite night and never quite day. A girl comes along the road on her own, looking over her shoulder.',
        ),
        GM(
          'Xquic. Daughter of one of the lords. She’d heard about the tree, and she was not good at being told no.',
        ),
        XQ(
          'Everybody says don’t go near it. Nobody says why. If they said why, I might not go.',
          'think',
        ),
        N(
          'She stops under the branches. You and your Nubbin are behind a rock, which is more or less hiding.',
        ),
        GO('They’re only round things in a tree. You don’t want them. Hold out your hand.'),
        N(
          'The atlas’s margin has a brown line about it: she held out her hand, and something strange happened in her palm.',
        ),
        XQ('It’s gone. There’s nothing in my hand.', 'shock'),
        GO('Nothing you can see. Go home. Nothing will hurt you. You’ll understand later.'),
      ],
      [
        ask(
          3,
          'literacy',
          'a character’s motive',
          'RL.3.3',
          [
            N(
              'Xquic goes to the forbidden tree even though she has been told not to. Why does she go?',
            ),
          ],
          [
            o(
              'She is curious, and nobody gave her a reason.',
              [
                N(
                  'Yes: she says herself that if they said why, she might not go. Her motive is curiosity, and being left in the dark.',
                ),
              ],
              true,
            ),
            o('She is hungry for gourds.', [
              N(
                'She never says that. Look at what she says about “why”: she is curious, not hungry.',
              ),
            ]),
            o('She wants to be caught.', [
              N('Nothing in the story says so. Her words show a curious girl who wants a reason.'),
            ]),
          ],
          'Used a character’s own words to work out her motive.',
        ),
      ],
      [
        ch('hide', 'Stay hidden.', [
          N(
            'You stay behind the rock. Your Nubbin, who thinks hiding is a game, keeps popping up to see if it’s won.',
          ),
        ]),
        ch('show', 'Step out and walk her to the road.', [
          XQ('Who are you? No, don’t tell me. I’ve had enough surprises for one day.', 'think'),
        ]),
      ],
    ),
    sc(
      'a31-04-owls',
      [
        N(
          'Some months go by in the margin. When the page settles, Xquic stands in her father’s hall, and everybody can see she is expecting a baby.',
        ),
        GM(
          'Her father was furious. He told his four owls to take her out to the forest and bring back her heart in a bowl.',
        ),
        GM('The owls didn’t like it at all.'),
        N(
          'You walk behind them, through trees with red bark. The owls keep stopping and looking at each other.',
        ),
        OW('We don’t want to do this. We’ve never wanted to do anything we were told.', 'sad'),
        XQ('Then don’t. My heart is mine. It doesn’t belong to them.'),
        OW('But he’ll want to see something in the bowl.'),
        XQ('Then let’s give him something. Look at that tree.'),
      ],
      [
        ask(
          6,
          'sel',
          'refusing to do wrong and finding another way',
          'CASEL: Responsible decision-making',
          [N('The owls were ordered to do something wrong. What is the wisest thing they can do?')],
          [
            o(
              'Refuse the wrong thing, and find another way to help.',
              [N('Yes: refusing is brave, and finding another way is wise. The owls do both.')],
              true,
            ),
            o('Do it anyway, because they were ordered to.', [
              N('An order does not make a wrong thing right. The owls say so in their own way.'),
            ]),
            o('Run away and leave Xquic.', [
              N(
                'That would keep the owls safe, but it would leave Xquic alone. They choose to help her.',
              ),
            ]),
          ],
          'Thought about refusing to do wrong and finding another way to help.',
        ),
      ],
      [
        ch('tree', 'Go and look at the tree.', [
          N(
            'The bark is cut in one place. Where it’s cut, a thick red sap is running, slow as honey.',
          ),
        ]),
        ch('owls', 'Tell the owls they can be brave.', [
          OW('Can we? Nobody’s ever asked us to.', 'think'),
          N('All four owls stand up a little taller.'),
        ]),
      ],
    ),
    sc(
      'a31-04-sap',
      [
        XQ('Help me. Catch it in the bowl. Then we shape it.'),
        N(
          'You hold the bowl. Your Nubbin, who has never been asked to help with anything this important, holds the edge of it as well.',
        ),
        N(
          'Xquic presses the sap into a round, lumpy shape with her thumbs, and the owls tell her where it needs more lump.',
        ),
        OW('More on that side. Hearts are not neat.'),
        N(
          'When it’s done, it shines dark red in the bowl. It’s only sap, from a tree, and it even smells a little of woodsmoke.',
        ),
        XQ('Now go. Tell him you did it. Tell him I’m gone.'),
        OW('Where will you go?', 'sad'),
        XQ(
          'Up. To the world. There’s a grandmother up there who doesn’t know she has me yet.',
          'soft',
        ),
      ],
      [
        notice(
          2,
          'science',
          'sap carries water and food through a tree; bark protects it',
          '4-LS1-1',
          [
            N(
              'Inside a tree, tubes carry water up from the roots and sugary sap down from the leaves. The bark is the tree’s skin.',
            ),
            N(
              'When bark is cut, sap seeps out and slowly thickens over the wound, like a plaster. Sap can be white like rubber, clear like maple, or red.',
            ),
          ],
          'Learned that sap carries water and food through a tree, and that bark and sap protect it.',
        ),
      ],
      [
        ch('smooth', 'Press the last of it smooth.', [
          N(
            'You smooth the top with your thumb. The owls say it is too neat now, and rough it up again.',
          ),
        ]),
        ch('paw', 'Let your Nubbin leave a pawprint in it.', [
          N(
            'A tiny paw-shaped dent, right on top, and the owls decide that’s fine. Hearts have marks on them.',
          ),
        ]),
      ],
    ),
    sc(
      'a31-04-complete',
      [
        N(
          'The owls carry the bowl back to Xibalba. The lords put the sap heart on the fire, and the smell fills the hall, and they all lean in.',
        ),
        GM(
          'And while they were sniffing, the owls flew off and showed Xquic the way up. The lords were fooled by a smell.',
          'happy',
        ),
        GD('By owls!'),
        GM('By owls. Never trust a lord who can’t tell a heart from a tree.'),
        N(
          'Your Nubbin sniffs its paw for a long time afterwards. It still smells a bit of the tree.',
        ),
      ],
      [
        ask(
          1,
          'maths',
          'multiplication as equal groups',
          '3.OA.A.1',
          [N('Four owls fly away, and each owl has two wings. How many wings is that altogether?')],
          [
            o('8', [N('Yes. Four groups of two: 4 x 2 = 8 wings.')], true),
            o('6', [N('Count in twos: 2, 4, 6, 8. There are four owls, so that is eight wings.')]),
            o('4', [N('That is the number of owls. Each owl has two wings: 4 x 2 = 8.')]),
          ],
          'Used equal groups to multiply 4 x 2.',
        ),
      ],
    ),
  ],
);

// ================================================================== A31-5 Xmucane’s Test
gloss('thatch', 'A roof made from dried grass or straw.', 'a31-05-door');
const Q5 = quest(
  'a31-05',
  'Xmucane’s Test',
  {
    'a31-05-s1': {
      goal: 'Walk Xquic up to Xmucane’s house.',
      hint: 'Go up the hill to the house with the garden and the fire.',
    },
    'a31-05-s2': {
      goal: 'Go down to the garden with one plant in it.',
      hint: 'Sit down by the corn plant with Xquic and wait.',
    },
    'a31-05-s3': {
      goal: 'Carry the net of corn up to Xmucane.',
      hint: 'Take one end of the net; Xquic takes the other. Go slowly on the hill.',
    },
  },
  [
    sc(
      'a31-05-door',
      [
        N(
          'The page turns to a little thatch house on a hillside, with a garden and a fire. It looks a lot like the kitchen you came in by.',
        ),
        N(
          'An old woman stands in the doorway with two older boys behind her: Xmucane, and Hun Hunahpu’s first sons.',
        ),
        XQ('Grandmother. I’m your daughter-in-law. I’m carrying your son’s children.', 'soft'),
        XM(
          'My son is gone, down in Xibalba. Go away. You’re a liar, or a trick, or both.',
          'angry',
        ),
        XM(
          'Then here is a test. My grandsons are hungry. Bring me a whole net of corn from the garden down the hill, and I’ll believe you.',
        ),
        N('You look down the hill. In the garden there is one corn plant: one.'),
      ],
      [
        ask(
          4,
          'sel',
          'seeing a situation from two points of view',
          'CASEL: Social awareness',
          [
            N(
              'Xmucane sets Xquic an impossible test: is that fair? Why might Xmucane do it, and how might Xquic feel?',
            ),
          ],
          [
            o('It is unfair. Xquic is a stranger who needs help.', [
              N(
                'That’s a fair answer: Xquic is alone and frightened, and a test makes it harder. Xmucane would say she is only protecting her family.',
              ),
            ]),
            o('It is understandable. Xmucane has lost her son and is afraid.', [
              N(
                'That’s a fair answer: grief makes people guard what is left. Xquic would say that being doubted still hurts.',
              ),
            ]),
            o('Both are true at once.', [
              N(
                'That’s a thoughtful answer. Xmucane is afraid, and Xquic is hurt, and neither feeling cancels the other.',
              ),
            ]),
          ],
          'Thought about two sides of a hard moment: a grandmother’s fear and a stranger’s hurt.',
        ),
      ],
      [
        ch('net', 'Offer to carry the net.', [XQ('Thank you. I think the net is the easy part.')]),
        ch('might', 'Tell Xmucane she might be telling the truth.', [
          XM('Might. Everybody might. Go and get the corn.'),
        ]),
      ],
    ),
    sc(
      'a31-05-garden',
      [
        N(
          'One plant, with one ear on it. Xquic stands in front of it with the empty net in her hands.',
        ),
        XQ('If I pick this, there’s nothing. If I don’t, there’s nothing.', 'sad'),
        N(
          'She sits down on the earth. Your Nubbin sits next to her, and so, after a moment, do you.',
        ),
        N(
          'Then she says the names of the ones who look after food, softly, as if she is asking friends for a favour.',
        ),
        N(
          'She draws the silk from the one ear, gently, and lays it in the net. And the net is full.',
        ),
        GM('Full, from one ear. That’s the part you hold on to.', 'happy'),
        N('Your Nubbin climbs into the net to check. It is corn all the way down.'),
      ],
      [
        notice(
          5,
          'science',
          'the life cycle of corn: seed, plant, ear, seeds',
          '3-LS1-1',
          [
            GM(
              'A corn plant starts as a kernel. It sprouts, grows tall, makes silk and pollen, and the silk catches the pollen.',
            ),
            GM(
              'Every strand of silk leads to one kernel. A single ear grows several hundred kernels, and each one is a seed that could start the whole cycle again.',
            ),
          ],
          'Learned the corn life cycle: kernel, seedling, plant, silk and pollen, ear, and new kernels.',
        ),
      ],
      [
        ch('touch', 'Touch the ear left on the plant.', [
          N('It’s still there. Whatever happened, the plant wasn’t robbed.'),
        ]),
        ch('thank', 'Say thank you to nobody in particular.', [
          XQ('Yes. That. Thank you.', 'soft'),
        ]),
      ],
    ),
    sc(
      'a31-05-carry',
      [
        N(
          'The net is heavier than the ball, heavier than the bowl, heavier than anything you’ve ever carried in a book.',
        ),
        N(
          'You take one end and Xquic takes the other. Your Nubbin takes the middle, which mostly means it rides in it.',
        ),
        N('Halfway up, the older brothers come out to watch. They don’t help.'),
        XQ(
          'Artists, those two. They play the flute, and paint, and sing. They never carry anything.',
        ),
        N(
          'You put the net down in front of Xmucane. She looks at it, and goes on looking for a long time.',
        ),
        N(
          'It holds 36 ears. Xmucane counts them twice, in case the corn is lying. Then she splits them into 4 equal piles, one for each person.',
        ),
        XM('One plant. I planted it myself.', 'think'),
      ],
      [
        ask(
          5,
          'maths',
          'division within 100',
          '3.OA.A.3',
          [N('Xmucane shares 36 ears of corn into 4 equal piles. How many ears are in each pile?')],
          [
            o('9', [N('Yes. 36 divided by 4 is 9, because 4 x 9 = 36.')], true),
            o('8', [N('Check by multiplying: 4 x 8 = 32, not 36. Try 4 x 9 = 36.')]),
            o('12', [N('4 x 12 = 48, which is too many. 4 x 9 = 36.')]),
          ],
          'Divided 36 into 4 equal groups, and checked with multiplication.',
        ),
      ],
      [
        ch('wait', 'Wait outside the door.', [
          N('You wait by the door, and your Nubbin waits by your boot. It takes a while.'),
        ]),
        ch('sit', 'Sit down on the net.', [
          N(
            'You sit on the corn, and so does your Nubbin. Xquic laughs for the first time since the tree.',
          ),
        ]),
      ],
    ),
    sc(
      'a31-05-complete',
      [
        XM('Well. You’re my daughter-in-law, then. Come inside. It’s cold.', 'soft'),
        N(
          'That’s all she says. She puts another log on the fire, moves her own stool closer to it, and puts Xquic on it.',
        ),
        GM('That’s how grandmothers say sorry. You get the good stool.', 'happy'),
        GD('You never give me the good stool.'),
        GM('You never carried a net of corn up a hill.'),
      ],
      [
        ask(
          3,
          'sel',
          'a real apology: words and actions',
          'CASEL: Relationship skills',
          [N('Xmucane says sorry without using the word. What makes an apology a good one?')],
          [
            o(
              'Saying sorry, and then showing it by what you do.',
              [
                N(
                  'Yes: words matter, but actions show you mean them. The good stool says it very loudly.',
                ),
              ],
              true,
            ),
            o('Saying sorry loudly, so everyone hears.', [
              N('A loud sorry is not always a true one. The stool was quiet, and it meant more.'),
            ]),
            o('Waiting until the other person forgets.', [
              N(
                'Waiting leaves the hurt sitting there. A kind action says: I know I got it wrong.',
              ),
            ]),
          ],
          'Learned that a good apology joins words and actions.',
        ),
      ],
    ),
  ],
);

// ================================================================== A31-6 The Older Brothers
gloss('composing', 'Making up music.', 'a31-06-born');
const Q6 = quest(
  'a31-06',
  'The Older Brothers',
  {
    'a31-06-s1': {
      goal: 'Meet the twins.',
      hint: 'Wait by Xmucane’s house until two boys come down the hill.',
    },
    'a31-06-s2': {
      goal: 'Watch the older brothers climb the tree.',
      hint: 'Stand back from the tree. Well back.',
    },
    'a31-06-s3': {
      goal: 'Wait with Xmucane for her older grandsons to come back.',
      hint: 'Stand by the door with Xmucane and watch the trees.',
    },
  },
  [
    sc(
      'a31-06-born',
      [
        N(
          'Twins are born on the mountainside: Hunahpu and Xbalanque. They are loud from the first minute.',
        ),
        N(
          'The older brothers, One Monkey and One Artisan, don’t like the noise. They don’t much like anybody who isn’t a flute.',
        ),
        OM('Put them outside. They cry. We’re composing.', 'angry'),
        GM(
          'So the twins grew up outside, mostly. In the hills, with blowguns. And cheeky? You have no idea.',
          'happy',
        ),
        N(
          'The page skips them forward, years in a breath. Two boys come down the slope, each with a long blowgun over his shoulder.',
        ),
        HP('Who’s this? A guest? Xbalanque, we’ve got a guest. And a… what is it?', 'happy'),
        XB('It’s a guest’s guest. Hello, guest’s guest.'),
        N(
          'Your Nubbin looks up at them, and something is settled between the three of them at once: friends.',
        ),
      ],
      [
        ask(
          2,
          'literacy',
          'what a character’s words tell us about him',
          'RL.3.3',
          [
            N(
              'One Monkey wants the babies put outside, because they cry and he is composing. What does that tell us about him?',
            ),
          ],
          [
            o(
              'He cares more about his own quiet than about the babies.',
              [N('Yes: his words are all about “we” and his music. The babies come second.')],
              true,
            ),
            o('He is worried the babies are cold.', [
              N('He says nothing about cold. He says they cry, and he is composing.'),
            ]),
            o('He loves noise.', [
              N('The opposite. He wants the babies gone so he can work in peace.'),
            ]),
          ],
          'Used a character’s own words to describe his traits.',
        ),
      ],
      [
        ch('hello', 'Say hello.', [
          HP(
            'Good. Are you hungry? Nobody here eats till our brothers have eaten. Which is never, if you’re us.',
          ),
        ]),
        ch('blowgun', 'Ask about the blowguns.', [
          XB(
            'A long tube, and clay pellets. You blow very hard, and you hit what you meant to. Usually.',
            'happy',
          ),
        ]),
      ],
    ),
    sc(
      'a31-06-tree',
      [
        N(
          'The twins come home with a tale about lovely birds in a tree, and no birds. The older brothers, who have eaten everyone’s share for years, frown.',
        ),
        HP('The birds are up that tree. We can’t climb it. Somebody taller should.', 'think'),
        OA('Fine. Show us. Artists can climb.'),
        N(
          'At first the tree is about four metres tall, a very ordinary tree. The two older brothers go up it, complaining about the bark.',
        ),
        N(
          'Then the tree begins to grow. It grows six metres more, and the brothers go up with it, holding on.',
        ),
        OM('It’s getting bigger! Why is it getting bigger?', 'shock'),
        XB(
          'Untie your loincloths! Tie them round your waists with the long end behind, and you can climb down.',
        ),
        N('They do, and the long ends behind them aren’t cloth any more. They’re tails.'),
      ],
      [
        ask(
          4,
          'maths',
          'add within 100 in a word problem',
          '2.OA.A.1',
          [N('The tree was 4 metres tall, then grew 6 metres more. How tall is it now?')],
          [
            o(
              '10 metres',
              [N('Yes. 4 + 6 = 10. The brothers are as high as a three-storey building.')],
              true,
            ),
            o('2 metres', [N('That is 6 - 4. The tree grew, so we add: 4 + 6 = 10.')]),
            o('24 metres', [N('That joins the digits instead of adding them. 4 + 6 = 10.')]),
          ],
          'Added 4 and 6 in a story problem about height.',
        ),
      ],
      [
        ch('laugh', 'Laugh.', [
          N('You can’t help it. Your Nubbin falls over backwards, which is how it laughs.'),
        ]),
        ch('worry', 'Ask if they’re all right.', [
          HP('They’re fine. Look at them. They’ve never been happier in a tree.', 'happy'),
        ]),
      ],
    ),
    sc(
      'a31-06-laugh',
      [
        N(
          'The older brothers swing off into the trees as monkeys. Xmucane comes out of the house and stares.',
        ),
        XM('Where are they? Where are my older grandsons?', 'sad'),
        HP('They’ll come back, Grandmother. But you mustn’t laugh when you see them. Not once.'),
        N(
          'They do come back, swinging down to the doorway, with their long arms and curly tails and very solemn faces.',
        ),
        XM('I’m not laughing. I am not.', 'think'),
        N('She laughs. And they go back up into the trees, and this time they don’t come down.'),
        GM(
          'Don’t be sad for them. They’re still artists. Ask anyone here who paints or carves who looks after them.',
          'soft',
        ),
      ],
      [
        notice(
          3,
          'science',
          'body parts that help animals survive: monkeys’ arms and tails',
          '4-LS1-1',
          [
            GM('Monkeys have long arms for swinging and strong hands for holding on.'),
            GM(
              'Spider monkeys, which live in the forests of Guatemala, have a tail that grips like a fifth hand. They can hang from a branch by the tail alone.',
            ),
          ],
          'Learned how monkeys’ arms and tails help them climb, and that spider monkeys grip with their tails.',
        ),
      ],
      [
        ch('hold', 'Try not to laugh too.', [
          N('You hold it in, and your face goes red. Your Nubbin doesn’t even try.'),
        ]),
        ch('wave', 'Wave to the monkeys.', [
          N(
            'One of them waves back, upside down, and plays three notes on a flute from the branch.',
          ),
        ]),
      ],
    ),
    sc(
      'a31-06-complete',
      [
        N(
          'That night there is flute music in the trees, and the soft scratch of someone drawing on bark.',
        ),
        XM('Did I do that?', 'sad'),
        XB(
          'You laughed, Grandmother. They’d rather be laughed at up there than shout at us down here.',
        ),
        HP('Also, it was funny.', 'happy'),
        N(
          'Xmucane gives the twins their supper first, for the first time. They eat as if it might be taken away.',
        ),
      ],
      [
        ask(
          1,
          'sel',
          'when laughing is kind and when it hurts',
          'CASEL: Social awareness',
          [
            N(
              'Xmucane laughed, and then felt bad about it. When is laughing kind, and when does it hurt, do you think?',
            ),
          ],
          [
            o('It is kind when everyone is in on the joke.', [
              N(
                'That’s a fair answer: a joke shared by everyone is a gift. The brothers are in on it, up in their trees.',
              ),
            ]),
            o('It hurts when it is aimed at someone who feels small.', [
              N('That’s a fair answer. A laugh that picks on someone can sting for a long time.'),
            ]),
            o('It depends on how the person feels afterwards.', [
              N(
                'That’s a thoughtful answer. Noticing how the other person feels is the best test there is.',
              ),
            ]),
          ],
          'Thought about when laughter is kind and when it hurts.',
        ),
      ],
    ),
  ],
);

// ================================================================== A31-7 Seven Macaw
gloss('vain', 'Too proud of how you look.', 'a31-07-healers');
gloss('disguised', 'Dressed up so people think you are someone else.', 'a31-07-healers');
const Q7 = quest(
  'a31-07',
  'Seven Macaw',
  {
    'a31-07-s1': {
      goal: 'Go with the twins to the shining bird’s tree.',
      hint: 'Follow the twins to the tree of yellow fruit and keep low.',
    },
    'a31-07-s2': {
      goal: 'Carry the old couple’s bag of white corn to Seven Macaw’s house.',
      hint: 'Walk behind the old couple with the bag. Keep a straight face.',
    },
  },
  [
    sc(
      'a31-07-macaw',
      [
        N('The page tilts up into a sky with no sun in it yet. Only a big bird, shining.'),
        SM(
          'Look at me! My eyes are silver. My teeth are jewels. I am the sun! I am the moon as well, when I can be bothered.',
          'happy',
        ),
        GM('Seven Macaw. Before there was a sun, he said he was it. He wasn’t. He was just shiny.'),
        XB('He’s not the sun. The sun would be warm.', 'think'),
        HP('Then somebody should tell him.'),
        N(
          'Hunahpu lifts his blowgun. A clay pellet goes thup, and hits Seven Macaw right on the beak.',
        ),
        SM('My TEETH!', 'shock'),
        N(
          'Seven Macaw swoops down, snatches the blowgun from Hunahpu, and flies off home with it.',
        ),
      ],
      [
        notice(
          4,
          'science',
          'real birds have beaks, not teeth; body parts help animals survive',
          '4-LS1-1',
          [
            N('Seven Macaw’s jewel teeth are only in the story. Real birds have no teeth at all.'),
            N(
              'A bird’s beak is light, strong and shaped for its food; a macaw’s curved beak cracks nuts. Inside, a muscular stomach called the gizzard does the grinding.',
            ),
          ],
          'Learned that real birds have no teeth, and that a beak and a gizzard do the work of chewing.',
        ),
      ],
      [
        ch('hunahpu', 'Run to Hunahpu.', [
          HP('I’m all right. I’m annoyed. Mostly annoyed.', 'angry'),
        ]),
        ch('chase', 'Chase the macaw.', [
          N(
            'You run a few steps, but he is very much a bird and you are not. Your Nubbin flaps its tiny wings anyway, to show willing.',
          ),
        ]),
      ],
    ),
    sc(
      'a31-07-healers',
      [
        N(
          'At the edge of the forest the twins find an old couple: very white-haired, and very good at looking harmless.',
        ),
        OC(
          'Toothache doctors, we’ll say. You two walk behind us. You’re our grandchildren.',
          'happy',
        ),
        XB('And the guest?'),
        OC('The guest carries the bag. Every doctor has someone to carry the bag.'),
        N(
          'The bag is full of white corn, and you carry it. The old couple are disguised, and Seven Macaw is too vain to notice.',
        ),
        N(
          'He is lying on his back with his jaw in his wing, groaning. Hunahpu’s blowgun hangs from a beam.',
        ),
        SM('It hurts. Everything hurts. Doctors? Oh, thank goodness.', 'sad'),
        OC('Those teeth. Bad teeth. Out they come, and new ones go in.'),
        SM('But they’re my jewels. They’re how people know I’m the sun!', 'shock'),
        OC('These are white corn. Very fashionable. Everybody’s wearing them.'),
      ],
      [
        ask(
          4,
          'literacy',
          'the meaning of an unknown word from context',
          'L.3.4',
          [N('Seven Macaw is “too vain to notice” the trick. What does vain mean?')],
          [
            o(
              'Too proud of how you look',
              [N('Yes. Seven Macaw cares so much about his shine that he does not see the trick.')],
              true,
            ),
            o('Very tired', [
              N(
                'He is groaning, but vain is not about tiredness. It means being too proud of how you look.',
              ),
            ]),
            o('Very clever', [
              N(
                'If he were clever, he would have spotted the trick. Vain means too proud of how you look.',
              ),
            ]),
          ],
          'Worked out the meaning of “vain” from the story.',
        ),
      ],
      [
        ch('bag', 'Hand over the bag of corn with a straight face.', [
          N(
            'You manage, just. Your Nubbin hands over a single kernel, separately, which nobody asked for.',
          ),
        ]),
        ch('arm', 'Look at the blowgun on the beam.', [
          N('It hangs there by its strap. Hunahpu, behind you, gives it a small wave.'),
        ]),
      ],
    ),
    sc(
      'a31-07-complete',
      [
        N(
          'Out come the jewel teeth, and in go the white corn ones. The old couple take his silver eyes too, very politely, for cleaning.',
        ),
        N(
          'Seven Macaw sits up, and he isn’t shining. He’s a big ordinary green bird with soft white teeth.',
        ),
        SM('I don’t feel like the sun any more.', 'sad'),
        GM(
          'Without his shine, he was nobody. And nobody minded. The real sun was still coming.',
          'soft',
        ),
        N('The old woman lifts the blowgun off the beam and hands it back to Hunahpu.'),
        GM(
          'Seven Macaw’s name has a seven in it. The Maya wrote their numbers with dots and bars.',
        ),
        HP('Good as new. Better. It’s had a rest.', 'happy'),
      ],
      [
        ask(
          5,
          'maths',
          'a number system with a dot (1) and a bar (5)',
          '4.OA.C.5',
          [N('In Maya numbers a dot is 1 and a bar is 5. How do you write 7?')],
          [
            o(
              'A bar and two dots',
              [N('Yes. 5 + 1 + 1 = 7. A bar, with two dots above it.')],
              true,
            ),
            o('Seven dots', [
              N(
                'That would work, but the Maya had a shortcut: every five dots become one bar. 7 = a bar and two dots.',
              ),
            ]),
            o('Two bars', [
              N('Two bars would be 5 + 5 = 10. For 7 you need one bar (5) and two dots (2).'),
            ]),
          ],
          'Wrote 7 in Maya numbers as a bar and two dots.',
        ),
      ],
    ),
  ],
);

// ================================================================== A31-8 Zipacna and Earthquake
gloss('ravine', 'A deep, narrow valley with steep sides.', 'a31-08-crab');
const Q8 = quest(
  'a31-08',
  'Zipacna and Earthquake',
  {
    'a31-08-s1': {
      goal: 'Help the twins make a crab that isn’t a crab.',
      hint: 'Gather broad leaves, red flowers and a flat stone, and take them to the ravine.',
    },
    'a31-08-s2': {
      goal: 'Watch Zipacna go after the crab.',
      hint: 'Hide up on the ravine’s edge with the twins.',
    },
    'a31-08-s3': {
      goal: 'Dig clay from the riverbank for Earthquake’s supper.',
      hint: 'The wet clay is at the bend of the river. Bring both hands full.',
    },
  },
  [
    sc(
      'a31-08-crab',
      [
        GM('Seven Macaw had two sons. Both of them bigger, and both of them worse.'),
        GM(
          'Zipacna was the first. He carried mountains about. And he was cruel to the Four Hundred Boys, and they died.',
          'sad',
        ),
        GD('Were they all right?', 'sad'),
        GM(
          'They died. That’s a hard thing, and I won’t pretend it isn’t. But in the story they rose into the sky as stars. Hold on to that.',
        ),
        GM('Now: Zipacna loved crabs. That was his weak spot.'),
        N(
          'You gather broad leaves and red flowers, and Xbalanque finds a flat stone for the shell. Your Nubbin finds a stick, and is very proud of it.',
        ),
        N('You put it all together at the bottom of a ravine, under a mountain: a big red crab.'),
        XB('It’s the best crab I’ve ever seen that isn’t a crab.', 'happy'),
      ],
      [
        notice(
          6,
          'science',
          'a crab’s hard outer skeleton and ten legs help it survive',
          '4-LS1-1',
          [
            XB(
              'A real crab wears its skeleton on the outside, a hard shell that protects it. It has ten legs, counting the two claws.',
            ),
            XB(
              'It walks on the other eight, mostly sideways. Ours will have to manage with leaves and a stick.',
            ),
          ],
          'Learned that a crab has a hard outer shell and ten legs, including two claws.',
        ),
      ],
      [
        ch('claw', 'Give it your Nubbin’s stick for a claw.', [
          N(
            'Your Nubbin hands the stick over with great ceremony. The crab now has one claw and a lot of dignity.',
          ),
        ]),
        ch('eyes', 'Give it two pebbles for eyes.', [
          N('Now it’s looking at you. You rather wish it wasn’t.'),
        ]),
      ],
    ),
    sc(
      'a31-08-zipacna',
      [
        N(
          'Zipacna comes down the river, huge and hungry, looking for crabs. He has not eaten for days.',
        ),
        ZP('A crab? Where?', 'happy'),
        HP('Down there. Under the mountain. A big one. We couldn’t catch it.'),
        N(
          'Zipacna lies on his front and squeezes in under the overhang, reaching. The crab, which is leaves, does not move.',
        ),
        N(
          'Then the mountain settles, the way mountains do, with a long slow sigh. Zipacna is under it, and there he stays.',
        ),
        GM(
          'Some say he turned to stone there. Either way, he doesn’t carry mountains about any more.',
        ),
        N('Your Nubbin goes down afterwards and takes its stick back, very carefully.'),
      ],
      [
        notice(
          4,
          'social-studies',
          'the geography of Guatemala: highlands and volcanoes',
          'D2.Geo.2.3-5',
          [
            GM(
              'Mountains matter here. Guatemala has highlands running through the middle, and more than thirty volcanoes.',
            ),
            GM(
              'The K’iche’ homeland is in those highlands, so the tale’s mountains are the very ones outside the window.',
            ),
          ],
          'Learned that Guatemala has highlands and more than thirty volcanoes, and that the K’iche’ homeland is in the highlands.',
        ),
      ],
      [
        ch('quiet', 'Keep very quiet.', [
          N('You keep so quiet you can hear your Nubbin thinking. It is thinking about the stick.'),
        ]),
        ch('mountain', 'Pat the mountain.', [
          N(
            'You pat the mountain, and it doesn’t seem to mind. Mountains are used to being where they’re put.',
          ),
        ]),
      ],
    ),
    sc(
      'a31-08-earthquake',
      [
        GM(
          'The second son was Earthquake. He knocked mountains down for fun. His brother’s trick, the other way round.',
        ),
        N('Earthquake is stamping through the hills, and every stamp shakes a mountain loose.'),
        XB('He’s hungry too. They’re always hungry, this family. We need clay.'),
        N(
          'You dig wet clay from the riverbank with your hands. The twins roast a bird, and coat it all over, thick, with the earth you bring.',
        ),
        EQ('That smells good. Is that for me?', 'happy'),
        N(
          'He eats it. Then he sits down rather suddenly, as if he is very tired, and doesn’t get up again.',
        ),
        N(
          'He is part of the hills now. The ground still shakes a little sometimes, when he turns over in his sleep.',
        ),
      ],
      [
        ask(
          3,
          'science',
          'some changes can be reversed and some cannot',
          undefined,
          [
            N(
              'Wet clay can be squished into any shape. Once clay is baked hard in a fire, can it be made soft again?',
            ),
          ],
          [
            o(
              'No. Baking is a change that cannot be undone.',
              [
                N(
                  'Yes: baked clay is pottery for good. Melting ice can be refrozen, but a baked pot cannot go back to soft clay.',
                ),
              ],
              true,
            ),
            o('Yes, just add water.', [
              N(
                'Sun-dried clay can be soaked soft again, but clay that has been fired in a hot oven or kiln is changed for good.',
              ),
            ]),
            o('Yes, if you leave it in the sun.', [
              N(
                'The sun cannot undo it. Fire changes clay for good, which is why pots last for thousands of years.',
              ),
            ]),
          ],
          'Learned that heating can cause a change that cannot be reversed, like baking clay.',
        ),
      ],
      [
        ch('wash', 'Wash the clay off in the river.', [
          N(
            'Your hands come clean. Your Nubbin does not want its paws clean, and walks about printing them on everything.',
          ),
        ]),
        ch('listen', 'Put your ear to the ground.', [
          N('Far down, very faint, there is a snore. You decide not to mention it.'),
        ]),
      ],
    ),
    sc(
      'a31-08-complete',
      [
        N('The world is quieter. The mountains stay where they are put.'),
        HP('Is that all of them?'),
        XB('All the shiny, boasting ones.'),
        GM('The Maya counted in twenties, not tens: fingers and toes, with 5 on each hand and foot.'),
        GM('Now: somebody has to go down to Xibalba. You know who.'),
        GD('The twins!'),
        GM('Not yet. First, a rat. Eat your tortilla.'),
      ],
      [
        ask(
          4,
          'maths',
          'dividing within 100: how many twenties make a hundred',
          '3.OA.A.3',
          [N('The Maya counted in twenties. How many twenties make a hundred?')],
          [
            o('5', [N('Yes. 20, 40, 60, 80, 100: five twenties. 5 x 20 = 100.')], true),
            o('4', [N('Four twenties make only 80. Five twenties make 100, because 5 x 20 = 100.')]),
            o('10', [N('Ten twenties make 200. Five twenties make 100, because 5 x 20 = 100.')]),
          ],
          'Worked out that five twenties make a hundred, counting like the Maya.',
        ),
      ],
    ),
  ],
);

// ================================================================== A31-9 The Rat
const Q9 = quest(
  'a31-09',
  'The Rat',
  {
    'a31-09-s1': {
      goal: 'Help the twins clear the garden. Or let their tools do it.',
      hint: 'Go to the garden on the hill and keep watch with the dove.',
    },
    'a31-09-s2': {
      goal: 'Wait up in the garden at night to see who undoes it.',
      hint: 'Hide behind the bush with the twins. Keep your Nubbin quiet. Try, anyway.',
    },
    'a31-09-s3': {
      goal: 'Take the water jar to Xmucane at the river, slowly.',
      hint: 'The twins give you the jar. Take it down to the river and don’t hurry.',
    },
  },
  [
    sc(
      'a31-09-tools',
      [
        N(
          'The twins are meant to clear a garden. Instead they lie in the shade, and their hoe and axe do it for them.',
        ),
        HP('Hoe, dig. Axe, chop.', 'happy'),
        N(
          'A dove sits on the fence, ready to call if anyone comes. In the morning the garden is a forest again, every tree back as if nobody had touched it.',
        ),
        XB(
          'When Grandmother comes, we rub earth on our faces and look tired. That’s the hard-work part.',
        ),
        HP('What? Who did this?', 'shock'),
      ],
      [
        notice(
          2,
          'science',
          'plants need water and light; the milpa grows corn, beans and squash together',
          undefined,
          [
            GM(
              'Seeds sleep in the soil until water and sun wake them. That is why a cleared garden turns green again so fast.',
            ),
            GM(
              'Here the farmers plant a milpa: corn, beans and squash together. The beans climb the corn, and the squash leaves shade the soil.',
            ),
          ],
          'Learned that seeds wake up with water and light, and that a milpa grows corn, beans and squash together.',
        ),
      ],
      [
        ch('hoe', 'Let your Nubbin help the hoe.', [
          N(
            'It holds the hoe’s handle and gets dragged round the garden at speed. It has never been happier.',
          ),
        ]),
        ch('dove', 'Keep watch with the dove.', [
          N('The dove nods at you, one lookout to another.'),
        ]),
      ],
    ),
    sc(
      'a31-09-night',
      [
        N(
          'So you wait up in the garden that night with the twins, behind a bush. Your Nubbin is meant to be quiet, and mostly it is.',
        ),
        N(
          'At midnight the animals come: the puma, the jaguar, the deer, the rabbit. They tell the trees to stand up, and the trees do.',
        ),
        XB('Get them!'),
        N(
          'Everyone gets away except one. Hunahpu catches a rat by the tail, and holds it upside down, firmly.',
        ),
        RT('Don’t eat me! I’m not even nice to eat! I know a secret!', 'shock'),
        RT(
          'Your father’s things. His ball, his gloves, his hip-pads. They’re up in your grandmother’s roof, where he tied them before he went.',
        ),
        N('The twins look at each other. Something lights up in both their faces.'),
        RT('And while we’re talking: I’d like food. For ever. That’s my price.'),
      ],
      [
        ask(
          7,
          'social-studies',
          'what makes a swap fair',
          'D2.Civ.8.3-5',
          [N('The rat trades a secret for food for ever. What makes a swap fair?')],
          [
            o(
              'Both sides get something they value, and both agree.',
              [N('Yes. A fair swap is one where each side gains something and nobody is forced.')],
              true,
            ),
            o('The strongest side decides the price.', [
              N(
                'The twins are stronger, but a price set by force is not a swap. The rat has to agree too.',
              ),
            ]),
            o('Both sides get exactly the same thing.', [
              N(
                'Not always: the rat gets food and the twins get a secret. Fair means each side is content, not identical.',
              ),
            ]),
          ],
          'Learned that a swap is fair when both sides gain something and both agree.',
        ),
      ],
      [
        ch('fair', 'Tell the rat it’s a fair price.', [
          RT('A fair price. You hear that? The guest says fair.', 'happy'),
        ]),
        ch('nose', 'Let your Nubbin say hello.', [
          N(
            'Your Nubbin touches noses with the rat, very formally. The rat sneezes, which counts as a hello.',
          ),
        ]),
      ],
    ),
    sc(
      'a31-09-roof',
      [
        N(
          'Back at the house the twins sit down to lunch and complain, loudly, about the chilli sauce.',
        ),
        HP('Grandmother, this is so hot. We need water. Lots of water.'),
        N(
          'Xmucane goes down to the river to fill the big jar. At the river a mosquito lands on it and makes a tiny hole, very neatly.',
        ),
        MQ('Pardon me. So sorry. Pardon.'),
        N(
          'The water runs out as fast as she pours it in. She stands there trying to stop it, and Xquic comes down to help, and so do you.',
        ),
        N(
          'Back in the empty house, the rat runs up the post and along the beam and gnaws through a cord. Down falls a bundle: a ball, gloves, hip-pads.',
        ),
        XB('Father’s.', 'soft'),
      ],
      [
        ask(
          4,
          'science',
          'comparing solutions to a problem',
          '3-5-ETS1-2',
          [N('The jar has a hole and the water runs out. Which fix would work best?')],
          [
            o(
              'Press a lump of wet clay firmly into the hole.',
              [
                N(
                  'Yes: wet clay is sticky and packs tight into a small hole, so it stops the leak. It fixes the cause, not just the drip.',
                ),
              ],
              true,
            ),
            o('Pour faster than it leaks.', [
              N(
                'That might work for a minute, but it wastes water and tires you out. Fixing the hole solves the real problem.',
              ),
            ]),
            o('Tie a leaf over the hole.', [
              N(
                'A leaf might slow the leak, but it would slip off. Clay sticks and seals, so it is the better fix.',
              ),
            ]),
          ],
          'Compared three solutions to a leaking jar and picked the one that fixes the cause.',
        ),
      ],
      [
        ch(
          'share',
          'Bring the rat a share of your own lunch too.',
          [
            N(
              'You give the rat half your tortilla. It looks at you for a long time, as if it is writing you down somewhere.',
            ),
            RT('You. I’ll remember you.', 'soft'),
          ],
          { 'a31-rat': 'share' },
        ),
        ch(
          'twins',
          'Leave it to the twins.',
          [
            XB('From now on, rat, you eat what we eat. Nobody chases you out of the corn. Ever.'),
            RT('Ever is a good length.', 'happy'),
          ],
          { 'a31-rat': 'twins' },
        ),
        ch(
          'come',
          'Ask the rat to come with you to Xibalba.',
          [
            RT('Xibalba? Me? There are owls down there.', 'shock'),
            RT('…Fine. But I’m riding on your Nubbin.'),
          ],
          { 'a31-rat': 'come' },
        ),
      ],
    ),
    sc(
      'a31-09-complete',
      [
        N(
          'That evening the twins sweep out their father’s old ballcourt and play on it, all night, loudly.',
        ),
        N(
          'The rat watches from the wall, eating. Your Nubbin chases every ball that leaves the court.',
        ),
        N('Thock, thock, thock, rest. They play it four times round, and the beat goes on and on.'),
        GM('And who do you think heard them?'),
        GD('The lords!'),
        GM('The lords. Under the court, trying to sleep. Exactly like before.', 'think'),
      ],
      [
        ask(
          2,
          'music',
          'equal groups in a rhythm',
          '3.OA.A.1',
          [
            N(
              'The beat is thock, thock, thock, rest, played 4 times. How many thocks is that altogether?',
            ),
          ],
          [
            o('12', [N('Yes. Three thocks in each round, 4 rounds: 3 x 4 = 12.')], true),
            o('16', [
              N(
                'That counts the rests too: 4 beats x 4 rounds = 16 beats. But only 3 of each 4 beats are thocks: 12.',
              ),
            ]),
            o('7', [N('That adds 3 + 4. There are 4 rounds of 3, so multiply: 3 x 4 = 12.')]),
          ],
          'Used multiplication to count beats in a repeating rhythm.',
        ),
      ],
    ),
  ],
);

// ================================================================== A31-10 The Summons
const Q10 = quest(
  'a31-10',
  'The Summons',
  {
    'a31-10-s1': {
      goal: 'Follow the message from Xmucane’s door to the ballcourt.',
      hint: 'Go with the louse. It is not quick. Everyone it meets is quicker.',
    },
    'a31-10-s2': {
      goal: 'See the twins plant their corn in the middle of the house, and decide where you’ll be.',
      hint: 'Go back to Xmucane’s house and stand by the hearth while they plant it.',
    },
  },
  [
    sc(
      'a31-10-relay',
      [
        N(
          'The owls come to Xmucane’s door. The twins are out at the court, so it’s Xmucane they tell.',
        ),
        OW('One Death and Seven Death say: the boys are to come and play. Bring the gear.'),
        N(
          'Xmucane sits down on her stool and doesn’t get up for a while. Then she lifts a louse off her own sleeve.',
        ),
        XM('Go and tell my grandsons. Quickly.', 'sad'),
        N(
          'The louse sets off, and it is not quick. A toad offers it a lift inside its mouth, then a snake offers the toad one, and a falcon the snake.',
        ),
        LS('Very kind. Bit damp.'),
        N(
          'The falcon lands on the ballcourt wall and coughs up the snake, who coughs up the toad, who tries to cough up the louse and can’t.',
        ),
        TD('It’s in there. It’s fine. It’s just stuck.', 'think'),
        LS('Your grandmother says come home. The lords say come down. In that order.'),
      ],
      [
        ask(
          8,
          'social-studies',
          'how people sent messages in the past and today',
          'D2.His.2.3-5',
          [
            N(
              'The message went from the owls to Xmucane, then along four carriers. What could go wrong with a message passed along like this?',
            ),
          ],
          [
            o(
              'It could change as it is passed. Repeating it back helps.',
              [
                N(
                  'Yes: every retelling can add mistakes. Checking by repeating it back is how people kept messages true.',
                ),
              ],
              true,
            ),
            o('Nothing. Messages never change.', [
              N(
                'They do, as anyone who has played a whispering game knows. Every messenger can drop or change a word.',
              ),
            ]),
            o('It would arrive faster than a phone call.', [
              N(
                'Phones are far quicker. In the past a message could take days, carried by people on foot.',
              ),
            ]),
          ],
          'Compared how messages travelled in the past with today, and how to keep a message accurate.',
        ),
      ],
      [
        ch('thank', 'Thank every messenger in turn.', [
          N(
            'You thank the falcon, the snake, the toad and the louse, in order. The falcon looks embarrassed, and the louse bows.',
          ),
        ]),
        ch('laugh', 'Try not to laugh at the louse.', [
          LS('Laugh if you like. I got here, didn’t I?'),
        ]),
      ],
    ),
    sc(
      'a31-10-corn',
      [
        N(
          'Before they go, the twins come home. Each of them takes an ear of corn and plants it in the middle of the house, in the earth floor.',
        ),
        HP('Grandmother, look at these. Every day.'),
        XB('If they droop, come and look for us. If they stay green, we’re all right.'),
        XM('And if they do both?', 'think'),
        HP('Then we’re being clever. Don’t worry. You’ll know.'),
        GM(
          'Some books say canes. In our kitchen it is always corn. Nobody argues with the corn.',
          'soft',
        ),
        N(
          'The twins pick up their father’s gear, and your Nubbin looks at you. You look at the corn, and at Xmucane, and at the road.',
        ),
      ],
      [
        ask(
          4,
          'science',
          'living plants show how they are doing',
          '3-LS1-1',
          [
            N(
              'Green corn is alive. Drooping corn means trouble. What will Xmucane look for each morning?',
            ),
          ],
          [
            o(
              'Whether the corn is green or drooping.',
              [
                N(
                  'Yes: green means the twins are safe, and drooping means trouble. A living plant shows how it is doing.',
                ),
              ],
              true,
            ),
            o('Whether the corn has grown into a tree.', [
              N(
                'Corn does not grow that fast. The twins gave her one simple sign: green or drooping.',
              ),
            ]),
            o('Whether the corn has been eaten.', [
              N(
                'Nobody is eating it. It is planted as a sign, and she checks if it is green or drooping.',
              ),
            ]),
          ],
          'Learned that a living plant shows its health: green means well, drooping means trouble.',
        ),
      ],
      [
        ch(
          'stay',
          'Stay with Xmucane and watch the corn.',
          [
            XM('Oh. You don’t have to.', 'soft'),
            Y('I know.'),
            N(
              'She doesn’t say anything else. She moves her stool over, so there’s room for yours.',
            ),
          ],
          { 'a31-corn': 'stay' },
        ),
        ch(
          'go',
          'Go down with the twins.',
          [
            XB('Good. Bring the little one. We’ll need someone who can fetch.', 'happy'),
            XM('Look after them. And look after yourself. It’s the same thing, really.', 'soft'),
          ],
          { 'a31-corn': 'go' },
        ),
      ],
    ),
    sc(
      'a31-10-complete',
      [
        N(
          'In the morning the twins go off down the road, swinging their father’s ball between them.',
        ),
        N(
          'Behind them, in the middle of the house, two ears of corn stand in the earth floor, green.',
        ),
        GM('Now. Which way did you go?'),
        N('The page waits a moment, as if it’s listening for your answer.'),
      ],
      [
        ask(
          2,
          'sel',
          'two kinds of courage: going and staying',
          'CASEL: Responsible decision-making',
          [
            N(
              'Going down is brave, and staying to wait is brave too. Which takes more courage, do you think?',
            ),
          ],
          [
            o('Going, because it is dangerous.', [
              N(
                'That’s a fair answer: going into the unknown takes nerve. Xmucane would say the waiting is its own kind of dangerous.',
              ),
            ]),
            o('Staying, because waiting is hard.', [
              N(
                'That’s a fair answer: not being able to do anything is hard. The twins would say the road is no picnic either.',
              ),
            ]),
            o('They are different kinds of courage.', [
              N(
                'That’s a thoughtful answer: the twins are brave with their feet, and Xmucane with her patience. The story needs both.',
              ),
            ]),
          ],
          'Thought about the different courage in going and in staying, with no single right answer.',
        ),
      ],
    ),
  ],
);

// ================================================================== A31-11 The Crossroads
const Q11 = quest(
  'a31-11',
  'The Crossroads',
  {
    'a31-11-s1': {
      goal: 'Go down to the crossroads with the twins.',
      hint: 'Follow the twins down the rock stairs to where the four roads meet.',
    },
    'a31-11-s2': {
      goal: 'Watch the mosquito go along the row of lords.',
      hint: 'Stand at the back of the hall and keep well away from the bench.',
    },
  },
  [
    sc(
      'a31-11-road',
      [
        N(
          'The way down is steep: stairs cut in rock, a river canyon, then another river. The twins go down it whistling.',
        ),
        N('At the bottom, four roads meet: a red one, a white one, a yellow one and a black one.'),
        RD('I’m the way. Me. Take me. I go straight to the lords.'),
        XB('That’s the road that talked to our father.', 'think'),
        HP('And it was telling the truth. It just didn’t say what was at the end of it.'),
        N(
          'Hunahpu pulls one hair from his shin, wincing, and blows on it. It turns into a mosquito, which hovers politely in front of his nose.',
        ),
        MQ('Good afternoon. How may I help?'),
        HP('Go ahead of us. Bite everyone sitting down there. Every one.'),
        MQ('Bite? Strangers? Without being introduced?', 'shock'),
        XB('Introduce yourself after.'),
      ],
      [
        ask(
          9,
          'literacy',
          'a true statement can leave out what matters',
          'RL.3.3',
          [
            N(
              'The black road said it went straight to the lords. That was true. What did it leave out?',
            ),
          ],
          [
            o(
              'What was waiting at the end.',
              [N('Yes. A true thing can still hide the part that matters.')],
              true,
            ),
            o('It told a lie.', [
              N(
                'It didn’t lie. It just didn’t say what was at the end. That is why Hunahpu doesn’t trust it.',
              ),
            ]),
            o('Nothing. It said everything.', [
              N('It said where it goes, but not what is there. Hunahpu notices the missing part.'),
            ]),
          ],
          'Noticed that a road, or a person, can say something true and still hide the part that matters.',
        ),
      ],
      [
        ch('wave', 'Let your Nubbin wave the mosquito off.', [
          N(
            'It waves. The mosquito bows in the air three times, which is a lot of bowing for something that small.',
          ),
        ]),
        ch('road', 'Thank the black road.', [RD('Nobody thanks a road. Huh.', 'think')]),
      ],
    ),
    sc(
      'a31-11-road-stay',
      [
        N(
          'The house is very quiet with the twins gone. Xmucane sweeps the floor round the two ears of corn, carefully, not too close.',
        ),
        XM('Don’t stand on them. Don’t breathe on them. I know. I’m being silly.', 'think'),
        N(
          'Xquic grinds corn at the stone. You fetch water from the river twice, then a third time, because it’s something to do.',
        ),
        N('Your Nubbin sits by the corn and looks at it. The corn looks back, being corn.'),
        XM(
          'They’ll be at the crossroads by now. Their father took the black road. I told him not to.',
          'sad',
        ),
        XQ('Did he listen?'),
        XM('Of course not. He was my son.'),
      ],
      [
        notice(
          2,
          'social-studies',
          'how corn becomes tortillas, then and now',
          'D2.His.2.3-5',
          [
            XQ(
              'We soak the dry corn in water with lime, a white powder made from stone, not the fruit. It softens the corn and makes it better for you.',
            ),
            XQ(
              'Then it is ground into dough. I use a flat stone, as my mother did. In some houses today, a small mill does that job.',
            ),
          ],
          'Learned how corn is soaked and ground into tortilla dough, by stone in the past and sometimes by mill today.',
        ),
      ],
      [
        ch('sweep', 'Take over the sweeping.', [
          XM('Hm. You hold the broom the way he did. All wrong.', 'soft'),
        ]),
        ch('sit', 'Sit by the corn with your Nubbin.', [
          N('You sit down. Nobody tells you to, and nobody tells you not to.'),
        ]),
      ],
    ),
    sc(
      'a31-11-lords',
      [
        N(
          'The hall of Xibalba is long and dim. A row of lords sits along one wall, very still, and some of them are wooden.',
        ),
        N(
          'The mosquito bites the first lord in the row: nothing, wood. It bites the second: wood again, and then the third.',
        ),
        OD('Ow!', 'shock'),
        SD('One Death? What is it, One Death?'),
        OD('Something bit me, Seven Death!'),
        N(
          'All the way down the row it goes. Every real lord yells, and the lord beside him asks what happened, by name.',
        ),
        HP(
          'Good day, One Death. Good day, Seven Death. Good day to the rest of the row, one at a time.',
          'happy',
        ),
        N('It takes a while. There are a lot of lords.'),
        XB('And good day to the wooden ones. Very nice carving.'),
        N('The lords stare at them. Nobody has ever done that before.'),
        LD('Sit down. Have a seat. Please.'),
        N('The seat glows faintly at the edges. It is a stone, and it is hot.'),
        XB('No thanks. We’ve been sitting all the way down.'),
      ],
      [
        ask(
          9,
          'sel',
          'why greeting people by name matters',
          'CASEL: Social awareness',
          [
            N(
              'The twins greet every lord by name, and even the wooden ones. Why does using someone’s name matter?',
            ),
          ],
          [
            o(
              'It shows you see them as a person.',
              [
                N(
                  'Yes: a name says you are someone, not just a seat in a row. The twins even greet the wooden lords, with a wink.',
                ),
              ],
              true,
            ),
            o('It does not matter. Names are just labels.', [
              N(
                'Names are more than labels. Think how it feels when someone gets yours wrong, or gets it right.',
              ),
            ]),
            o('It is only a trick to confuse them.', [
              N(
                'It is partly a trick here, but in real life using a name is a kind way to show you noticed someone.',
              ),
            ]),
          ],
          'Thought about why saying someone’s name shows respect.',
        ),
      ],
      [
        ch('grin', 'Try very hard not to grin.', [
          N(
            'You fail. One of the lords sees, and glares, and you look at the ceiling as if it is very interesting.',
          ),
        ]),
        ch('back', 'Stand well back from the bench.', [
          N(
            'You stand well back. Your Nubbin, which has strong views about hot seats, stands further back still. Then a bit further.',
          ),
        ]),
      ],
    ),
    sc(
      'a31-11-lords-stay',
      [
        N('In the evening the falcon lands on the doorpost, out of breath, which falcons hate.'),
        FA('Message. From below. From me, really. I went to look.'),
        FA(
          'They sent a mosquito ahead. It bit every lord on the bench, and the real ones yelled each other’s names.',
        ),
        FA(
          'So the boys said good day to every one of them, by name. And good day to the wooden ones, for manners.',
        ),
        XM('And the bench? The hot one?', 'think'),
        FA('Didn’t sit on it. Said they’d been sitting all the way down.'),
        N(
          'Xmucane laughs once, out loud. Then she puts her hand over her mouth, as if she’s been caught.',
        ),
        XM('Their father sat on it.', 'soft'),
      ],
      [
        ask(
          7,
          'sel',
          'feeling two feelings at once',
          'CASEL: Self-awareness',
          [
            N(
              'Xmucane laughs, then goes quiet with sorrow. Can a person feel funny and sad in the same minute?',
            ),
          ],
          [
            o(
              'Yes. Feelings can mix, and that is normal.',
              [
                N(
                  'Yes: gladness and grief can sit side by side. Xmucane laughs because she is proud, and goes quiet because she misses her son.',
                ),
              ],
              true,
            ),
            o('No. It is one feeling at a time.', [
              N(
                'It can feel that way, but real feelings mix all the time. Xmucane is proud of the twins and sad about her son at once.',
              ),
            ]),
            o('Only grown-ups feel that.', [
              N(
                'Children feel mixed feelings too, like being excited and nervous before a first day somewhere new.',
              ),
            ]),
          ],
          'Learned that people can feel two feelings at the same time, and that it is normal.',
        ),
      ],
      [
        ch('water', 'Give the falcon some water.', [
          FA('Thank you. Nobody ever gives the messenger water.', 'happy'),
        ]),
        ch('corn', 'Look at the corn.', [N('Green. Both ears, green to the tips.')]),
      ],
    ),
    sc(
      'a31-11-complete',
      [
        GM(
          'Every lord by name. No bowing to the wood. No sitting on the hot bench. Their father hadn’t known. They did.',
          'happy',
        ),
        GD('Because of a mosquito.'),
        GM('Because of a mosquito. Never think small help is small.'),
        N(
          'Later, the mosquito comes looking for your Nubbin. It lands on its crown, and asks very politely if it may come along.',
        ),
        N(
          'It bows three times to each of you: you, your Nubbin and the two twins. Then it waits for an answer.',
        ),
        N(
          'Your Nubbin says nothing, as usual. The mosquito takes that as a yes, which is how most good friendships start.',
        ),
      ],
      [
        ask(
          4,
          'maths',
          'multiplication as equal groups',
          '3.OA.A.1',
          [
            N(
              'The mosquito bows three times to each of four friends. How many bows is that in all?',
            ),
          ],
          [
            o('12', [N('Yes. Four friends, three bows each: 4 x 3 = 12.')], true),
            o('7', [N('That adds 4 + 3. There are four groups of three bows: 4 x 3 = 12.')]),
            o('9', [N('That is 3 x 3, three friends. There are four friends: 4 x 3 = 12.')]),
          ],
          'Used equal groups to multiply 4 x 3.',
        ),
      ],
    ),
  ],
);

// ================================================================== A31-12 The Houses
gloss('camouflage', 'Colours or patterns that help an animal hide.', 'a31-12-houses');
gloss('bioluminescence', 'Light made by a living thing, like a firefly.', 'a31-12-dark');
const Q12 = quest(
  'a31-12',
  'The Houses',
  {
    'a31-12-s1': {
      goal: 'Spend the night in the Dark House, or sit up with Xmucane.',
      hint: 'Stay close to the twins in the dark, or by the corn.',
    },
    'a31-12-s2': {
      goal: 'Go through the other houses, or do the house’s work while you wait.',
      hint: 'Carry pine cones, or bring water up from the river and look at the corn.',
    },
  },
  [
    sc(
      'a31-12-dark',
      [
        N('The lords send them to the Dark House for the night, with a torch and two candles.'),
        LD(
          'Keep them lit all night. And give them back to us in the morning, whole. Exactly as they are now.',
        ),
        N(
          'Inside it is dark the way the inside of a shut fist is dark. Your Nubbin presses against your leg.',
        ),
        XB(
          'Lit all night, and whole in the morning. That’s impossible. Which is the point.',
          'think',
        ),
        HP('So we don’t light them.'),
        N(
          'Hunahpu ties a red macaw’s tail feather to the top of the torch. In the dark, it looks exactly like a flame.',
        ),
        N('Xbalanque catches two fireflies and sets one on each candle. They glow: on, off, on.'),
        N('Every so often a guard looks in, and everything glows. He goes away satisfied.'),
      ],
      [
        notice(
          6,
          'science',
          'living things that make light; light and seeing',
          '4-PS3-2',
          [
            XB('Fireflies make light inside their own bodies. Scientists call it bioluminescence.'),
            XB(
              'It is a chemical reaction, and it gives out almost no heat. That is why it is called cold light, and why our candles stay whole.',
            ),
          ],
          'Learned that fireflies make light with a chemical reaction that gives out almost no heat.',
        ),
      ],
      [
        ch('firefly', 'Help catch the fireflies.', [
          N('You catch one in your cupped hands. It sits there glowing, pleased to be useful.'),
        ]),
        ch('torch', 'Let your Nubbin hold the torch.', [
          N(
            'It holds the torch very upright, as if it is the most important job in the world. The feather doesn’t burn.',
          ),
        ]),
      ],
    ),
    sc(
      'a31-12-dark-stay',
      [
        N(
          'That night Xmucane can’t sleep. She sits up by the corn, and you sit with her, and Xquic sleeps against the wall.',
        ),
        XM(
          'They’ll have been given the Dark House tonight. Their father had to keep a torch lit all night. He couldn’t.',
          'sad',
        ),
        N(
          'The fire is low. Your Nubbin curls up in its warm patch and watches the corn with one eye.',
        ),
        N('Before dawn Xmucane puts another log on the coals and sits straight again.'),
        XM('My mother did that when anyone was away. So I do.', 'soft'),
        N('The corn stays green. All night, both ears, green.'),
      ],
      [
        ask(
          4,
          'sel',
          'how company helps when you cannot fix a problem',
          'CASEL: Relationship skills',
          [N('You cannot fix Xmucane’s worry. How does sitting up beside her still help?')],
          [
            o(
              'She does not have to face the night alone.',
              [N('Yes. Company does not solve the problem, but it makes the waiting bearable.')],
              true,
            ),
            o('It does not help. Only solving the problem helps.', [
              N('Some problems cannot be solved yet. Being there is what helps then.'),
            ]),
            o('It helps you more than her.', [
              N(
                'Perhaps a little, but Xmucane notices you there all night. Sitting together helps both of you.',
              ),
            ]),
          ],
          'Learned that being there for someone helps even when you cannot fix their problem.',
        ),
      ],
      [
        ch('awake', 'Stay awake with her.', [
          N('You stay awake. When your head nods, she pokes you, kindly, and you sit up again.'),
        ]),
        ch('feet', 'Let your Nubbin sleep on your feet.', [
          N(
            'It sleeps on your feet, and you don’t move them for hours. Xmucane notices, says nothing, and approves.',
          ),
        ]),
      ],
    ),
    sc(
      'a31-12-dark-done',
      [
        N(
          'In the morning they hand back the torch and the candles, whole and unlit. The lords look at them for a long time.',
        ),
        OD('How?', 'shock'),
        HP('Good morning.', 'happy'),
        N('The twins were shut in at six in the evening, and let out at six the next morning.'),
      ],
      [
        ask(
          3,
          'maths',
          'time intervals in hours',
          '3.MD.A.1',
          [N('How many hours were the twins shut in the Dark House?')],
          [
            o(
              '12 hours',
              [
                N(
                  'Yes. Six in the evening to midnight is 6 hours, and midnight to six in the morning is 6 more: 12 hours.',
                ),
              ],
              true,
            ),
            o('6 hours', [
              N(
                'That is only half the night. Evening to midnight is 6, and midnight to morning is 6 more: 12.',
              ),
            ]),
            o('18 hours', [
              N(
                'That is too many. Count from 6 pm to midnight (6 hours), then midnight to 6 am (6 hours): 12.',
              ),
            ]),
          ],
          'Worked out a time interval across midnight: 12 hours.',
        ),
      ],
    ),
    sc(
      'a31-12-dark-done-stay',
      [
        XM('Still green.', 'soft'),
        N('She says it every morning after that. By the third morning you are saying it with her.'),
      ],
      [
        ask(
          1,
          'literacy',
          'repeated lines make a refrain',
          'RL.4.2',
          [
            N(
              'Xmucane says “Still green” every morning, and then you join in. What does a repeated line like that do?',
            ),
          ],
          [
            o(
              'It gives the family something steady to hold on to.',
              [
                N(
                  'Yes: a repeated line is called a refrain. It turns worry into a small, shared habit.',
                ),
              ],
              true,
            ),
            o('It makes the story longer.', [
              N(
                'It does add words, but its real job is feeling. A refrain gives a worried household a steady rhythm.',
              ),
            ]),
            o('It is only there to be funny.', [
              N(
                'There is a gentle smile in it, but mostly it is comfort. By day three even you are saying it.',
              ),
            ]),
          ],
          'Learned that a refrain, a line that repeats, can give comfort and rhythm.',
        ),
      ],
    ),
    sc(
      'a31-12-houses',
      [
        GM(
          'Then the Razor House, where the knives are always hungry. The twins promised them the meat of animals one day, and the knives lay down.',
        ),
        N(
          'In the Cold House, frost is thick on the walls. The twins build a fire of old pine cones, and the cold goes and sulks in a corner.',
        ),
        N(
          'In the Jaguar House, the jaguars pace. The twins throw them bones from the lords’ own kitchen, and the jaguars lie down and crunch.',
        ),
        N(
          'In the Fire House, the fire roars and roars, and doesn’t burn them. Possibly it liked them.',
        ),
        N(
          'Your Nubbin carries a pine cone for the fire, then another. Then all of them, one at a time, because it has found a job.',
        ),
        HP('Every house. Every one. And we’re still here.', 'happy'),
        XB('Don’t say that. It’s asking for it.'),
      ],
      [
        notice(
          2,
          'science',
          'camouflage: how jaguars survive in their habitat',
          '3-LS4-3',
          [
            GM(
              'Real jaguars live in the forests of Guatemala. Their golden coats are marked with rosettes, rings of dark spots.',
            ),
            GM(
              'In dappled forest light, the spots break up the jaguar’s shape. That is camouflage, and it helps the cat creep up on its food.',
            ),
          ],
          'Learned that a jaguar’s spots work as camouflage in dappled forest light.',
        ),
      ],
      [
        ch('cold', 'Warm your hands at the pine-cone fire.', [
          N(
            'The fire smells of resin and somewhere better. You hold your hands to it until they hurt in the good way.',
          ),
        ]),
        ch('jaguar', 'Keep well away from the jaguars.', [
          N(
            'A jaguar looks at you over its bone, decides you aren’t dinner, and goes back to its bone.',
          ),
        ]),
      ],
    ),
    sc(
      'a31-12-houses-stay',
      [
        N(
          'The days are long. You do the things a house needs: water from the river, wood from the hill, weeds from round the one corn plant.',
        ),
        XM('Hoe that row. No, that row. The boys always did the wrong row.', 'think'),
        XQ(
          'Xibalba’s houses are not as bad as they sound. They’re worse. But my boys are cleverer than their father.',
        ),
        N(
          'Every time you come in from outside, the first thing you do is look at the corn. So does everyone.',
        ),
        N('One ear has six leaves, and the other has seven.'),
        XM('Still green.', 'soft'),
      ],
      [
        ask(
          4,
          'maths',
          'add within 100 in a word problem',
          '2.OA.A.1',
          [
            N(
              'One ear has 6 leaves and the other has 7. How many leaves are there in all, and how many more does the second ear have?',
            ),
          ],
          [
            o('13 in all, and 1 more', [N('Yes. 6 + 7 = 13, and 7 - 6 = 1.')], true),
            o('12 in all, and 1 more', [
              N('Check the adding: 6 + 7 = 13. The difference is right: 7 - 6 = 1.'),
            ]),
            o('13 in all, and 2 more', [N('The total is right, but the difference is 7 - 6 = 1.')]),
          ],
          'Added 6 and 7, and found how many more one group has than the other.',
        ),
      ],
      [
        ch('row', 'Hoe the wrong row, carefully.', [XM('…That one’s fine too, I suppose.')]),
        ch('count', 'Count the leaves on the corn.', [
          N(
            'Six on one ear, seven on the other. The next day you count again: still six and seven.',
          ),
        ]),
      ],
    ),
    sc(
      'a31-12-complete',
      [
        GM('Five houses. Clever every time.'),
        GM(
          'And up on the mountain, in the middle of their grandmother’s house, the corn stayed green the whole while.',
        ),
        GD('Because they were safe.'),
        GM('Because they were clever. Being safe came with it.', 'happy'),
      ],
      [
        ask(
          1,
          'literacy',
          'theme: what a story is about',
          'RL.4.2',
          [
            N(
              'In every house the twins win by a clever idea, not by being strong. What is the theme?',
            ),
          ],
          [
            o(
              'Cleverness and kindness can beat brute strength.',
              [
                N(
                  'Yes: the feather, the fireflies and the pine cones all show it. A theme is the big idea under a story.',
                ),
              ],
              true,
            ),
            o('Always do what the lords say.', [
              N('The twins do the opposite. They turn the lords’ own tests against them.'),
            ]),
            o('Nobody can ever be safe.', [
              N('The twins stay safe in every house. The story says wit can see you through.'),
            ]),
          ],
          'Identified the theme of a story: cleverness beats brute strength.',
        ),
      ],
    ),
  ],
);

// ================================================================== A31-13 The Bat House
gloss('echo', 'A sound that bounces off something and comes back.', 'a31-13-bats');
const Q13 = quest(
  'a31-13',
  'The Bat House',
  {
    'a31-13-s1': {
      goal: 'Get through the night in the Bat House, or watch the corn with Xmucane.',
      hint: 'Stay under the bench, or by the corn, until morning.',
    },
    'a31-13-s2': {
      goal: 'Watch the game in the great ballcourt, or hear the falcon’s news at noon.',
      hint: 'Sit on the wall by the trees, or go to the doorway when the falcon comes in.',
    },
  },
  [
    sc(
      'a31-13-bats',
      [
        N(
          'The last house is the Bat House. It is full of bats with noses like knives, and they never stop flying.',
        ),
        XB('Into the blowguns. We sleep inside them. The bats can’t get in.'),
        N(
          'So they crawl inside their long blowguns to sleep. You and your Nubbin squeeze under a bench for a long night.',
        ),
        HP('Is it morning yet? I’m going to look.'),
        XB('Don’t!', 'shock'),
        N(
          'Hunahpu looks out of the end of his blowgun. A bat swoops, quick as a blink, and flies off into the dark with his hat.',
        ),
        XB('Animals! Everyone! Anyone! I need help!', 'sad'),
        N(
          'They come out of the dark from everywhere, every kind of animal, each one carrying what it eats.',
        ),
        N(
          'Last comes the coati, nosing along a big round squash, and she rolls it to Xbalanque’s feet.',
        ),
        N(
          'By morning he has carved the squash into a pretend hat, and Hunahpu is sitting up, blinking and cold-headed.',
        ),
      ],
      [
        notice(
          5,
          'science',
          'animals’ senses: many bats use echoes to find their way',
          '4-LS1-2',
          [
            XB(
              'Bats can fly in total darkness. Many of them squeak, too high for us to hear, and listen to the echoes that come back.',
            ),
            XB(
              'The echoes tell a bat where things are and how far away. It is a sense of its own, a bit like seeing with sound.',
            ),
          ],
          'Learned that many bats find their way in the dark by listening to echoes of their own squeaks.',
        ),
      ],
      [
        ch('squash', 'Help roll the squash.', [
          N(
            'It is very round and very heavy, and it wants to go everywhere except where you push it.',
          ),
        ]),
        ch('hold', 'Hold your Nubbin close in the dark.', [
          N(
            'It holds on to your sleeve, and you hold on to it. Neither of you lets go until morning.',
          ),
        ]),
      ],
    ),
    sc(
      'a31-13-bats-stay',
      [
        N(
          'In the night you wake, though nobody made a sound. Xmucane is already sitting up, very straight, looking at the corn.',
        ),
        N('One ear has drooped. Its leaves hang down, as if it’s tired, or worse.'),
        XM('No. No, no.', 'sad'),
        N(
          'She doesn’t touch it, and she doesn’t cry. She looks at it, and you look at it, and the fire ticks.',
        ),
        N('Your Nubbin climbs into your lap without being asked, and holds on to your sleeve.'),
        XM('Sit with me. Don’t say anything. There isn’t anything.', 'soft'),
        N(
          'So you don’t. You sit together with the corn and breathe slowly, and nobody speaks for a long time.',
        ),
        N('Then, near dawn, the drooping ear lifts. Slowly, leaf by leaf, as if it’s waking up.'),
        XM('Oh.', 'soft'),
      ],
      [
        ask(
          6,
          'sel',
          'calming a big worry',
          'CASEL: Self-management',
          [
            N(
              'Xmucane has a very big worry in the night. What helps most when a worry is too big to fix?',
            ),
          ],
          [
            o(
              'Slow breaths, and someone sitting beside you.',
              [N('Yes. Slow breathing calms the body, and company calms the heart.')],
              true,
            ),
            o('Doing something loud to forget it.', [
              N(
                'A loud distraction can help for a moment. The worry waits, though, and slow breaths do more.',
              ),
            ]),
            o('Going over every bad thing that could happen.', [
              N('That tends to make a worry bigger. Slow breaths and a friend help it shrink.'),
            ]),
          ],
          'Learned that slow breathing and good company help with a worry that is too big to fix.',
        ),
      ],
      [
        ch('arm', 'Put your hand on her arm.', [
          N('She puts her own hand over yours and leaves it there.'),
        ]),
        ch('quiet', 'Say nothing at all.', [
          N('You say nothing. It turns out to be the right thing.'),
        ]),
      ],
    ),
    sc(
      'a31-13-rat-coati',
      [
        N('Behind the coati trots a rat, chest out. It went and fetched her specially.'),
        N('It catches your eye and nods once. Lunch, it seems to say, was remembered.'),
      ],
      [
        ask(
          1,
          'literacy',
          'a character’s motive',
          'RL.3.3',
          [N('Why did the rat bring the coati to help?')],
          [
            o(
              'Because you shared your lunch with it, and it remembered.',
              [
                N(
                  'Yes: its motive is gratitude. A small kindness came back at the moment it was needed.',
                ),
              ],
              true,
            ),
            o('Because it wanted a squash.', [
              N('The rat’s nod is about the lunch. Its motive is thanks.'),
            ]),
            o('Because the twins ordered it to.', [
              N('Nobody orders it. It chooses to help the friend who shared with it.'),
            ]),
          ],
          'Linked a character’s action to its motive: gratitude for a shared lunch.',
        ),
      ],
    ),
    sc(
      'a31-13-game',
      [
        N(
          'The ballcourt of Xibalba is huge, with walls that go up into darkness. Above the end wall, out of reach, the lords have hung Hunahpu’s hat.',
        ),
        OD('Play! And afterwards, perhaps we’ll use that up there for a ball.', 'happy'),
        XB('Play first.'),
        N(
          'Xbalanque hits the ball so hard it flies right out of the court and bounces away into the trees.',
        ),
        N(
          'A rabbit, which has been waiting there all night, picks it up and bounds off with it, and the lords go charging after.',
        ),
        LD('After it! After the ball!'),
        N(
          'While they’re all off in the trees, Xbalanque climbs the end wall and takes back his brother’s hat. He hangs the squash up instead.',
        ),
        HP('Ah. That’s better. That’s much better.', 'happy'),
        N(
          'The lords come back, panting. One of them takes down the squash to serve with, and it hits the wall and bursts, seeds everywhere.',
        ),
        OD('That’s cheating!', 'angry'),
        HP('That’s squash.'),
      ],
      [
        ask(
          10,
          'sel',
          'fair play and tricking someone who is unfair',
          'CASEL: Responsible decision-making',
          [
            N(
              'The lords planned to wreck Hunahpu’s hat in a game, and the twins tricked them. Was it fair play, or cheating?',
            ),
          ],
          [
            o('Fair, because the lords were being unfair first.', [
              N(
                'That’s a fair answer: the lords planned to be cruel, and the twins answered cleverly. Hunahpu might say that is just good sport.',
              ),
            ]),
            o('Cheating, because a trick is still a trick.', [
              N(
                'That’s a fair answer: keeping to the rules matters even when the other side does not. One Death would agree, loudly.',
              ),
            ]),
            o('It is complicated.', [
              N(
                'That’s a thoughtful answer. Tricking someone who means harm is not the same as tricking a friend, but it is worth asking where the line is.',
              ),
            ]),
          ],
          'Thought about fair play and whether tricking an unfair opponent is cheating.',
        ),
      ],
      [
        ch('cheer', 'Cheer.', [
          N(
            'You cheer, and your Nubbin cheers by jumping. The rabbit, back on the wall, cheers by washing its ears.',
          ),
        ]),
        ch('seeds', 'Pick up the squash seeds.', [
          N(
            'You pocket a handful of seeds without knowing why. It seems like something somebody should remember.',
          ),
        ]),
      ],
    ),
    sc(
      'a31-13-rat-court',
      [
        N(
          'Right behind the rabbit goes the rat, who rode all the way down on your Nubbin’s head. It runs between the lords’ legs, squeaking.',
        ),
        RT('Slow! Call that running? I’ve seen faster cheese!', 'happy'),
        N('The lords chase it twice as far. That’s twice as long for Xbalanque.'),
      ],
      [
        ask(
          1,
          'literacy',
          'describing a character in depth',
          'RL.4.3',
          [
            N(
              'The rat shouts insults at the lords while running between their legs. Which word describes it best?',
            ),
          ],
          [
            o(
              'Cheeky',
              [N('Yes: it is brave, quick and rude in the friendliest way. That is cheek.')],
              true,
            ),
            o('Shy', [
              N(
                'A shy rat would stay hidden. This one runs between the lords’ feet and mocks them.',
              ),
            ]),
            o('Gloomy', [
              N('The rat is having a wonderful time. Its words are all fun and mischief.'),
            ]),
          ],
          'Chose an exact word to describe a character’s personality.',
        ),
      ],
    ),
    sc(
      'a31-13-game-stay',
      [
        N(
          'The falcon comes at noon with its feathers every which way. It is talking before it lands.',
        ),
        FA('A bat took Hunahpu’s hat! Then a coati brought a squash. A squash!', 'shock'),
        FA(
          'And in the game a rabbit ran off with the ball, and everyone chased it, and everything got put back where it belongs.',
        ),
        XQ('Everything?'),
        FA(
          'Everything. Both of them are fine. They burst a squash on the lords. You should have seen their faces.',
          'happy',
        ),
        XM('I saw his corn.', 'soft'),
        N(
          'Xmucane gets up and makes tortillas, very fast, far too many, and gives the first one to the falcon.',
        ),
      ],
      [
        ask(
          6,
          'literacy',
          'how characters respond to events',
          'RL.3.3',
          [
            N(
              'Xmucane makes far too many tortillas, very fast. What does that show about how she feels?',
            ),
          ],
          [
            o(
              'She is so relieved she cannot sit still.',
              [N('Yes: her hands need a job. Relief and joy can come out as busyness.')],
              true,
            ),
            o('She is angry at the falcon.', [
              N('She gives the falcon the very first tortilla. That is thanks, not anger.'),
            ]),
            o('She is bored.', [
              N(
                'A bored person is slow. She is quick, and she makes far too many: that is relief.',
              ),
            ]),
          ],
          'Inferred a character’s feeling from what she does.',
        ),
      ],
      [
        ch('perch', 'Give the falcon a seat by the fire.', [
          N('It sits by the fire with its tortilla and looks, for a falcon, almost cosy.'),
        ]),
        ch('tortillas', 'Help with the tortillas.', [
          XM('Yours are the wrong shape. Make more.', 'happy'),
        ]),
      ],
    ),
    sc(
      'a31-13-rat-coati-told',
      [
        FA(
          'And a rat went and fetched the coati. Said somebody had shared their lunch with it once, and it doesn’t forget.',
        ),
      ],
      [
        notice(
          0,
          'science',
          'coatis: a real animal and its body parts',
          '4-LS1-1',
          [
            GM(
              'A coati is a real animal, a cousin of the raccoon, and it lives in the forests of Central America.',
            ),
            GM(
              'It has a long, ringed tail for balance, and a long, bendy nose for sniffing out insects and fruit.',
            ),
          ],
          'Learned that coatis have a long ringed tail for balance and a long nose for finding food.',
        ),
      ],
    ),
    sc(
      'a31-13-rat-court-told',
      [
        FA(
          'Oh, and a rat. It went down in Hunahpu’s pocket and ran rings round the lords. Kept shouting about cheese.',
          'happy',
        ),
      ],
      [
        notice(
          0,
          'science',
          'animals’ senses: whiskers',
          '4-LS1-2',
          [
            GM(
              'A rat’s whiskers are very sensitive. They brush against walls and corners and tell the rat what is nearby, even in the dark.',
            ),
            GM(
              'Rats also have an excellent sense of smell, which is why the lords’ legs were not hard to find.',
            ),
          ],
          'Learned that a rat’s whiskers and nose are sensitive senses for finding its way.',
        ),
      ],
    ),
    sc(
      'a31-13-complete',
      [
        GM(
          'That’s the hard night. And they came through it, both of them, with a squash for a spare.',
          'happy',
        ),
        GD('I like the rabbit.'),
        GM(
          'Everybody likes the rabbit. Hunahpu slept all the next day, and ate three breakfasts when he woke.',
        ),
        N('Far above, on the mountain, two ears of corn lift their leaves in the morning light.'),
      ],
      [
        ask(
          2,
          'health',
          'looking after your body after a hard night',
          'CASEL: Self-management',
          [
            N(
              'Hunahpu slept all day and ate three breakfasts. What helps your body recover after a very hard night?',
            ),
          ],
          [
            o(
              'Sleep, water and a good meal',
              [N('Yes. Rest repairs the body, water refills it and food gives it energy.')],
              true,
            ),
            o('Staying up even later', [
              N('That makes tiredness worse. Sleep is how bodies recover.'),
            ]),
            o('Skipping breakfast', [
              N('After a hard night your body needs fuel. Hunahpu is right to eat.'),
            ]),
          ],
          'Learned that sleep, water and food help the body recover after a hard night.',
        ),
      ],
    ),
  ],
);

// ================================================================== A31-14 The Oven and the River
gloss('seers', 'People who are said to see what others cannot.', 'a31-14-oven');
const Q14 = quest(
  'a31-14',
  'The Oven and the River',
  {
    'a31-14-s1': {
      goal: 'Stand by the twins on the night of their last plan, or stay beside Xmucane.',
      hint: 'Stay near the twins and look where you are told, or pull your stool up beside Xmucane.',
    },
    'a31-14-s2': {
      goal: 'Wait five days.',
      hint: 'Sit on the bank, or by the corn. The page will turn the days for you.',
    },
  },
  [
    sc(
      'a31-14-oven',
      [
        N(
          'The lords are tired of losing, and they make one last plan. Nobody pretends it is a kind one.',
        ),
        XB('They mean to trap us. Fine. We knew that.', 'think'),
        N(
          'The twins find two seers, Xulu and Pacam, and speak to them quietly in a corner, where the lords can’t hear.',
        ),
        HP(
          'When they ask what to do with us, say: put them in the river. Say it like it’s your own idea.',
        ),
        N('Then Hunahpu turns round, sees you and your Nubbin, and crouches down.'),
        HP(
          'Don’t look at the glow. Look at the river. We’ll be there. Five days. Promise.',
          'soft',
        ),
        N(
          'They take hands and walk towards the light, and that is all you see. There is a glow, very bright, and then less bright.',
        ),
        N('Your Nubbin hides its face in your coat. You don’t blame it.', 'sad'),
      ],
      [
        ask(
          7,
          'sel',
          'calming down when you are frightened',
          'CASEL: Self-management',
          [
            N(
              'Hunahpu tells you to look at the river, not the glow. How does giving a scared person one steady thing to look at help?',
            ),
          ],
          [
            o(
              'It gives the mind something calm to hold on to.',
              [N('Yes. Focusing on one steady thing, with a slow breath, calms a racing heart.')],
              true,
            ),
            o('It tricks them into thinking nothing is wrong.', [
              N(
                'It is not a trick. The river really is there, and so are the twins’ promise and the five days.',
              ),
            ]),
            o('It does not help. Fear should be faced head on.', [
              N(
                'Facing fear is sometimes right. But calming first, then thinking, is how brave people usually do it.',
              ),
            ]),
          ],
          'Learned that focusing on one steady thing, with slow breathing, can calm a frightened mind.',
        ),
      ],
      [
        ch('river', 'Look at the river, like he said.', [
          N('You look at the river. It goes on being a river, which is something.'),
        ]),
        ch('hold', 'Hold your Nubbin.', [
          N(
            'You hold it, and it holds you, and the light behind you goes down slowly, like a sunset in the wrong place.',
          ),
        ]),
      ],
    ),
    sc(
      'a31-14-oven-stay',
      [
        N(
          'The next day, the corn begins to dry. Not droop: dry, from the tips down, brown and papery.',
        ),
        XM('No.', 'sad'),
        N(
          'By evening both ears are dry all over, and they rattle when the door opens. Xquic shuts it very gently, so they won’t.',
        ),
        N(
          'Xmucane weeps, and doesn’t hide it. She sits on her stool by the dry corn with her hands in her lap, and weeps.',
        ),
        N('You don’t know what to do. So you pull your stool up beside hers, and stay.'),
        N(
          'Your Nubbin goes and sits right beside the dry corn, close, as if it is keeping it company.',
        ),
        XQ('They said: if it does both, we’re being clever.', 'soft'),
        XM('I know what they said.', 'sad'),
      ],
      [
        ask(
          6,
          'sel',
          'supporting a friend who is crying',
          'CASEL: Social awareness',
          [N('Xmucane is crying and you do not know what to do. What helps most?')],
          [
            o(
              'Staying close and not hurrying her.',
              [N('Yes: staying close says “I am here”. You do not need the right words.')],
              true,
            ),
            o('Telling her it will be fine.', [
              N(
                'Hopeful words are kind, but you cannot promise. Sitting beside her is more honest.',
              ),
            ]),
            o('Leaving her alone to cry in private.', [
              N(
                'Some people want that, and it is fine to ask. But staying close is often what helps most.',
              ),
            ]),
          ],
          'Learned that staying close and not rushing helps a friend who is crying.',
        ),
      ],
      [
        ch('stay', 'Stay beside her.', [
          N('You stay. The fire goes down, and you build it up again, and you stay.'),
        ]),
        ch('xquic', 'Sit with Xquic instead.', [
          N(
            'Xquic leans her head on your shoulder. She’s their mother, and she’s frightened too, and nobody has asked her.',
          ),
        ]),
      ],
    ),
    sc(
      'a31-14-river',
      [
        N('The lords do just what the seers tell them. They are very pleased with themselves.'),
        N(
          'The river has taken the twins into itself. The atlas’s margin says only that it kept them safe, and gave them back as boys.',
        ),
        N(
          'You wait on the bank. The page turns its days over gently: one, two, three, four, five.',
        ),
        N(
          'On the second day there are catfish in the shallows, two of them, side by side, looking up at you.',
        ),
        N('Your Nubbin lies on its front at the edge, nose to nose with them, every day.'),
        N(
          'On the fifth day, two boys climb out of the river, dripping, and shake their hair like dogs.',
        ),
        XB('Told you. Five days. Did you keep looking at the river?', 'happy'),
        HP('I’m starving. Is there anything to eat that isn’t squash?'),
      ],
      [
        ask(
          2,
          'maths',
          'multiplication in a time word problem',
          '4.MD.A.2',
          [N('You waited five days, and there are 24 hours in a day. How many hours is that?')],
          [
            o(
              '120 hours',
              [N('Yes. 5 x 24 = 120. Ten times 24 is 240, so half of that is 120.')],
              true,
            ),
            o('100 hours', [N('That would be 5 x 20. A day has 24 hours, so 5 x 24 = 120.')]),
            o('29 hours', [N('That adds 5 + 24. Five days of 24 hours each: 5 x 24 = 120.')]),
          ],
          'Multiplied 5 x 24 to find the hours in five days.',
        ),
      ],
      [
        ch('hug', 'Hug them both, wet as they are.', [
          N(
            'They’re cold and wet and smell of river. Your Nubbin hugs a leg each, which takes some doing.',
          ),
        ]),
        ch('food', 'Find them something to eat.', [
          N(
            'You have half a tortilla in your pocket from the kitchen. They split it exactly down the middle.',
          ),
        ]),
      ],
    ),
    sc(
      'a31-14-river-stay',
      [
        N('One day, two. Xmucane gets up each morning, and looks, and sits down again.'),
        N(
          'Three days, four. You bring the water and the wood, and nobody says a word about the corn, which is the loudest thing in the house.',
        ),
        N(
          'On the fifth morning your Nubbin wakes you by sitting on your face. It turns your head with both paws, towards the middle of the house.',
        ),
        N('A green shoot, then another. Both ears, green from the earth up.'),
        XM('Oh, you clever, clever boys.', 'happy'),
        XQ('Five days. They promised. They always keep the silly promises.', 'happy'),
      ],
      [
        ask(
          2,
          'maths',
          'writing numbers with dots and bars',
          '4.OA.C.5',
          [
            N(
              'In Maya numbers a dot is 1 and a bar is 5. How would you write the days one to five?',
            ),
          ],
          [
            o(
              'One dot, two dots, three dots, four dots, then a bar.',
              [
                N(
                  'Yes: four is four dots, and five is a single bar. The rule is that five dots become one bar.',
                ),
              ],
              true,
            ),
            o('Five dots for day five.', [
              N(
                'It would work, but the Maya shortcut is a bar for every five dots. Day five is one bar.',
              ),
            ]),
            o('A bar for each day.', [
              N('A bar is already five. Days 1 to 4 need dots, and day 5 is the first bar.'),
            ]),
          ],
          'Wrote the numbers 1 to 5 in Maya dots and bars.',
        ),
      ],
      [
        ch('laugh', 'Laugh out loud.', [
          N(
            'You laugh, and Xquic laughs, and your Nubbin runs round the corn three times for no reason at all.',
          ),
        ]),
        ch('hug', 'Hug Xmucane.', [XM('Get off. No. Stay there a minute.', 'soft')]),
      ],
    ),
    sc(
      'a31-14-complete',
      [
        GM('Five days. Their grandmother counted every one.', 'soft'),
        GD('Did she know they’d come back?'),
        GM('No. That’s why it counts.'),
        N('And far up the mountain, in the middle of a little house, two ears of corn are green.'),
      ],
      [
        notice(
          0,
          'science',
          'animals’ senses: catfish barbels',
          '4-LS1-2',
          [
            GM('A catfish has whiskers called barbels. They are covered in tiny taste buds.'),
            GM(
              'In muddy river water, where it is hard to see, a catfish feels and tastes its way along the bottom with them.',
            ),
          ],
          'Learned that a catfish’s barbels work as touch and taste organs in muddy water.',
        ),
      ],
    ),
  ],
);

// ================================================================== A31-15 The Performers
gloss('mercy', 'Kindness shown to someone who has been unkind.', 'a31-15-curtain');
const Q15 = quest(
  'a31-15',
  'The Performers',
  {
    'a31-15-s1': {
      goal: 'Watch the two ragged dancers do wonders in Xibalba, or hear the falcon’s news of them.',
      hint: 'Follow the crowd to the street where the dancers are, or wait by the door for the falcon.',
    },
    'a31-15-s2': {
      goal: 'Watch the last wonder, or wait at the house for the end of the show.',
      hint: 'Stay by the curtain, or in by the corn until the falcon comes back at dusk.',
    },
  },
  [
    sc(
      'a31-15-dancers',
      [
        N(
          'Two ragged dancers turn up in Xibalba, and nobody knows where they came from. They have very familiar grins.',
        ),
        N(
          'In the street a house of straw vanishes in smoke, and stands up whole. A dog lies down, and gets up wagging.',
        ),
        LD('Who are those two? Bring them here. We want a show.'),
        XB('Oh no. A show. For lords. We couldn’t possibly.', 'happy'),
        HP('Unless they asked very nicely.'),
        N(
          'The dancers stamp a pattern on the stones: stomp, stomp, clap, stomp, stomp, clap, on and on.',
        ),
        N(
          'Your Nubbin is given a job: minding the curtain rope. It takes the job extremely seriously.',
        ),
        N(
          'The lords sit in a row, the real ones, no wooden ones this time. They clap whenever something vanishes.',
        ),
      ],
      [
        ask(
          5,
          'music',
          'finding a term in a repeating pattern',
          '4.OA.C.5',
          [
            N(
              'The beat goes: stomp, stomp, clap, stomp, stomp, clap, and on. What is the 8th beat?',
            ),
          ],
          [
            o(
              'Stomp',
              [
                N(
                  'Yes: beats 3 and 6 are claps, so beats 7 and 8 are stomps. Beat 9 would be the next clap.',
                ),
              ],
              true,
            ),
            o('Clap', [N('Claps come on every third beat: 3, 6, 9. Beat 8 is a stomp.')]),
            o('Rest', [
              N(
                'There is no rest in this pattern. The 8th beat is the second stomp of a new round: stomp.',
              ),
            ]),
          ],
          'Found the 8th beat in a repeating rhythm pattern with a three-beat rule.',
        ),
      ],
      [
        ch('rope', 'Help your Nubbin mind the rope.', [
          N('You both hold the rope. It is a very well-minded rope.'),
        ]),
        ch('faces', 'Watch the lords’ faces.', [
          N(
            'They look like children at a fair, and that’s almost the worst part. They do want wonders.',
          ),
        ]),
      ],
    ),
    sc(
      'a31-15-dancers-stay',
      [
        N(
          'The corn grows. It grows faster than corn grows, a leaf a day, and Xmucane talks to it while she works.',
        ),
        XM('Eat something. You’re too thin. Tell your brother to wear a hat.'),
        N(
          'The falcon comes again, and this time it lands properly, folds its wings, and looks pleased with itself.',
        ),
        FA(
          'Two dancers have turned up in Xibalba. Ragged ones. They make houses vanish in smoke, and the houses are fine.',
        ),
        XQ('Two of them?'),
        FA('Two. With grins.'),
        XM('Oh, I know those grins.', 'happy'),
      ],
      [
        ask(
          0,
          'maths',
          'multiplication in a word problem',
          '3.OA.A.3',
          [
            N(
              'In the story the corn grows one leaf a day. How many leaves is that after three weeks?',
            ),
          ],
          [
            o('21', [N('Yes. A week has 7 days, so 3 weeks is 3 x 7 = 21 leaves.')], true),
            o('10', [N('That adds 7 + 3. Three weeks of seven days: 3 x 7 = 21.')]),
            o('14', [N('That is two weeks: 2 x 7. For three weeks: 3 x 7 = 21.')]),
          ],
          'Multiplied 3 x 7 to find the days, and so the leaves, in three weeks.',
        ),
      ],
      [
        ch('again', 'Ask the falcon to go and look again.', [
          FA('I was going anyway. I want to see how it ends.'),
        ]),
        ch('tell', 'Tell the corn the news.', [
          N('You tell the corn, and Xmucane doesn’t laugh at you. She adds a bit you forgot.'),
        ]),
      ],
    ),
    sc(
      'a31-15-curtain',
      [
        OD('Do it to us! Make us a wonder. Then bring us back.', 'happy'),
        SD('Me too. Both of us. Together.'),
        HP('Are you sure?', 'think'),
        OD('Sure! Sure!'),
        N('Xbalanque takes the rope from your Nubbin, gently, and lets the curtain down.'),
        N(
          'When it goes up again, One Death and Seven Death aren’t there: two empty seats. The twins stand in front of them.',
        ),
        HP(
          'I am Hunahpu. This is my brother Xbalanque. Our father is Hun Hunahpu, whom you kept down here.',
        ),
        N('The rest of Xibalba goes down on its knees, all at once, and begs.'),
        LD('Mercy. Please. Mercy.', 'shock'),
        XB('You can have mercy. But not greatness. Not any more.'),
      ],
      [
        ask(
          9,
          'sel',
          'mercy, fairness and second chances',
          'CASEL: Responsible decision-making',
          [
            N(
              'The twins give mercy but take away the lords’ greatness. When someone has been unkind and says sorry, how far should mercy go?',
            ),
          ],
          [
            o('Forgive them, but make sure they can’t do harm again.', [
              N(
                'That’s a fair answer, and it is the twins’ own: kindness, with a safe distance. They would agree.',
              ),
            ]),
            o('Forgive them fully and trust them again straight away.', [
              N(
                'That’s a fair answer: a fresh start is generous. The twins would add that trust needs time to grow.',
              ),
            ]),
            o('It depends on whether they truly mean it.', [
              N(
                'That’s a thoughtful answer. Real sorrow changes what people do afterwards, and that is worth watching for.',
              ),
            ]),
          ],
          'Thought about mercy and fairness when someone says sorry, with no single right answer.',
        ),
      ],
      [
        ch('nubbin', 'Pick up your Nubbin.', [
          N(
            'It looks at the empty seats, then at you, as if asking whether all this was right. You hold it close.',
          ),
        ]),
        ch('still', 'Stand still.', [
          N('You stand very still. In the whole hall, nobody else does.'),
        ]),
      ],
    ),
    sc(
      'a31-15-curtain-stay',
      [
        N('You wait all day. Xquic grinds enough corn for a feast for twenty.'),
        N(
          'At dusk the falcon comes back slowly, sits on the doorpost, and for a while doesn’t say anything.',
        ),
        FA(
          'The lords asked for the wonder to be done to them. The boys did it. And then the lords were gone, and didn’t come back.',
        ),
        N('Nobody in the house says anything. Outside, the wind goes over the corn on the hill.'),
        FA('The rest of them begged. The boys said: mercy, yes. Greatness, no.'),
        XM('Good boys. Hard, but good.', 'soft'),
      ],
      [
        ask(
          4,
          'sel',
          'mixed feelings about an ending',
          'CASEL: Social awareness',
          [
            N(
              'Xquic grew up in Xibalba, and some of the people begging were people she knew. How might she feel?',
            ),
          ],
          [
            o(
              'Relieved, and sad for people she knew.',
              [N('Yes: both feelings are true at once. An ending can be good and still hurt.')],
              true,
            ),
            o('Only glad that it is over.', [
              N(
                'She may be glad. But she has a history down there, and that makes it complicated.',
              ),
            ]),
            o('Angry at her sons.', [
              N(
                'Nothing suggests that. The story gives her stillness, which sounds more like mixed feelings.',
              ),
            ]),
          ],
          'Recognised mixed feelings at the end of a hard story.',
        ),
      ],
      [
        ch('xquic', 'Look at Xquic.', [
          N(
            'Xquic is very still. She grew up down there, and some of the ones on their knees are people she knew.',
            'sad',
          ),
        ]),
        ch('corn', 'Look at the corn.', [N('Green and tall. Waiting, like you.')]),
      ],
    ),
    sc(
      'a31-15-complete',
      [
        GM('And from that day the lords of Xibalba were small. Not gone. Small.'),
        GM(
          'After that, the lords had no more ball games. They had jobs to do, like everyone else.',
        ),
        GD('No more ball!', 'happy'),
        GM('No more ball. That was the worst thing you could tell a lord. Worse than anything.'),
        N(
          'Somewhere in Xibalba, a ball rolls into a corner and stays there. Nobody is allowed to pick it up.',
        ),
      ],
      [
        ask(
          1,
          'social-studies',
          'why rules and chores apply to everyone',
          'D2.Civ.8.3-5',
          [
            N(
              'The lords now have to do chores like everyone else. Why is it fair when rules and jobs apply to everybody?',
            ),
          ],
          [
            o(
              'Nobody is above the rules, so the community stays fair.',
              [N('Yes. Fairness means the same rules for lords and neighbours alike.')],
              true,
            ),
            o('It is only fair for people who are lazy.', [
              N(
                'Fairness has nothing to do with laziness. It is about everyone doing their share.',
              ),
            ]),
            o('It is not fair. Leaders should have easier jobs.', [
              N(
                'Leaders do carry more responsibility, but fairness means no one gets to skip the shared work.',
              ),
            ]),
          ],
          'Learned that fairness means the same rules and shared jobs for everyone.',
        ),
      ],
    ),
    sc(
      'a31-margin-hazel',
      [
        N('Nova’s atlas lies open at the hall of Xibalba: two empty seats, and a curtain half up.'),
        N(
          'In the margin, in faint pencil you have never noticed, there is a note. You know the hand.',
        ),
        N('“Two boys who won by being cheeky to a pair of grumpy lords. My kind of boys.”'),
        N(
          'Your Nubbin looks at the note for a long time. Then it looks at you, as if asking whether it’s allowed to laugh, and it is.',
        ),
      ],
      [
        ask(
          2,
          'literacy',
          'describing a character from a short note',
          'RL.4.3',
          [N('Hazel’s note is only one line long. What does it tell you about Hazel herself?')],
          [
            o(
              'She admires clever people who are a little cheeky.',
              [
                N(
                  'Yes: “my kind of boys” says she sees herself in them. One short line can show a whole personality.',
                ),
              ],
              true,
            ),
            o('She is cross with the twins.', [
              N('A cross person would not say “my kind of boys.” The tone is fond.'),
            ]),
            o('She does not care about the story.', [
              N('She cared enough to write in the margin, and to come back to it.'),
            ]),
          ],
          'Described a character from a short note she wrote.',
        ),
      ],
    ),
  ],
);

// ================================================================== A31-16 The Ballcourt and the Sky
gloss('jade', 'A hard green stone that people carve into beads and ornaments.', 'a31-16-complete');
const Q16 = quest(
  'a31-16',
  'The Ballcourt and the Sky',
  {
    'a31-16-s1': {
      goal: 'Go with the twins to their father’s resting place, or sit in the doorway with Xmucane.',
      hint: 'Walk to the end wall of the great ballcourt, or sit on the doorstep beside Xmucane.',
    },
    'a31-16-s2': {
      goal: 'Watch the first sunrise.',
      hint: 'Stay where you are and look up. Your Nubbin is already looking.',
    },
  },
  [
    sc(
      'a31-16-father',
      [
        N(
          'The twins go to the ballcourt of Xibalba, where their father stayed when he didn’t come home.',
        ),
        N('There isn’t much to see, only a quiet place by the end wall. They kneel by it.'),
        HP('Father. We played. We won.', 'soft'),
        XB(
          'You’ll be remembered. You’ll be the first one people call on. Before anyone, before us. Always.',
        ),
        N(
          'They talk to him a while, telling him the games point by point, the way you tell someone a story they half know.',
        ),
        N(
          'Your Nubbin fetches the ball from the corner, slowly, and puts it down beside the quiet place.',
        ),
        HP(
          'Thank you, little one. He’d have liked you. He’d have hip-bumped you right off the court.',
          'happy',
        ),
      ],
      [
        ask(
          4,
          'sel',
          'ways of remembering someone',
          'CASEL: Self-awareness',
          [
            N(
              'The twins keep their father’s memory alive by telling him the whole game. What are some good ways to remember someone?',
            ),
          ],
          [
            o(
              'Telling their stories and saying their name.',
              [N('Yes. A name said aloud and a story told keep a person present.')],
              true,
            ),
            o('Putting away everything that reminds you of them.', [
              N(
                'That can feel easier at first, but it is lonely. Most people find comfort in small reminders.',
              ),
            ]),
            o('Never speaking of them, to avoid sadness.', [
              N(
                'Sadness often eases when shared. The twins talk to their father for the whole night.',
              ),
            ]),
          ],
          'Talked about ways to keep someone’s memory alive: stories, names and shared moments.',
        ),
      ],
      [
        ch('kneel', 'Kneel with them.', [
          N(
            'You kneel on the cool earth. It doesn’t feel like a sad place any more; it feels looked after.',
          ),
        ]),
        ch('back', 'Stand back and let them talk.', [
          N(
            'You stand back, because some talk is for family. Your Nubbin stands back with you, very straight.',
          ),
        ]),
      ],
    ),
    sc(
      'a31-16-father-stay',
      [
        N('The corn is taller than the stools now. Nobody pretends not to look at it.'),
        N(
          'The falcon comes for the last time, at night, and lands on Xmucane’s knee, which it has never done before.',
        ),
        FA(
          'They’re at the ballcourt. Their father’s place. They’re telling him everything. Every point.',
          'soft',
        ),
        XM('He always liked to hear the score.', 'soft'),
        FA('They told him he’ll be remembered. Called on first, before anyone. Before them.'),
        XM('Good. That’s right. That’s how it should be.'),
        N('She takes your hand without looking, the way you’d take a rail on the stairs.'),
        XM('Come and sit in the door. It’ll be morning soon. I want to see it.'),
      ],
      [
        ask(
          3,
          'sel',
          'small memories keep people close',
          'CASEL: Social awareness',
          [
            N(
              '“He always liked to hear the score.” Why do little memories like this matter when we miss someone?',
            ),
          ],
          [
            o(
              'They keep the person feeling real and close.',
              [N('Yes. Small, specific memories are often the ones that warm us most.')],
              true,
            ),
            o('They only make it sadder.', [
              N(
                'They can sting at first. In time they usually become something to smile about, as Xmucane does here.',
              ),
            ]),
            o('They do not matter. Only big things count.', [
              N(
                'Xmucane would disagree. A score, a joke or a way of holding a broom can say more than a grand speech.',
              ),
            ]),
          ],
          'Thought about why small memories keep someone close.',
        ),
      ],
      [
        ch('door', 'Sit in the doorway with her.', [
          N(
            'The doorstep is still warm from yesterday. You sit, and she sits, and the dark goes on a while longer.',
          ),
        ]),
        ch('nubbin', 'Bring your Nubbin out too.', [
          N('It sits between you on the doorstep, facing east, as if it knows something.'),
        ]),
      ],
    ),
    sc(
      'a31-16-rise',
      [
        N('Then the twins stand up, look at each other, grin the same grin, and start to climb.'),
        N(
          'Not up the walls: up into the dark above the court, which is turning grey at one edge, then gold.',
        ),
        N('One of them goes up and becomes the Sun. The other goes up and becomes the Moon.'),
        WHICH_SUN,
        N(
          'After them, rising, come four hundred small lights. You’d know them anywhere: the Four Hundred Boys.',
        ),
        N(
          'They spread out across the sky and stay there. The atlas’s margin says it simply: now they are the stars.',
        ),
        N(
          'The first sunlight comes over the edge of the court and lands on the place where their father stayed. Then on you, and everything.',
        ),
      ],
      [
        ask(
          5,
          'science',
          'why the Sun and Moon seem to take turns',
          '5-ESS1-2',
          [N('The Sun and the Moon seem to take turns in the sky. What really makes that happen?')],
          [
            o(
              'The Earth spins, so we turn towards the Sun and then away.',
              [
                N(
                  'Yes: the Earth turns once about every 24 hours. When our side faces the Sun it is day, and when it faces away it is night.',
                ),
              ],
              true,
            ),
            o('The Sun goes round the Earth once a day.', [
              N(
                'It looks that way, and people believed it for ages. In fact the Earth is the one turning.',
              ),
            ]),
            o('The Moon chases the Sun away.', [
              N(
                'They do not chase each other. The Earth’s spin shows us each in turn, and the Moon can sometimes be seen by day too.',
              ),
            ]),
          ],
          'Learned that the Earth’s spin makes the Sun and Moon seem to take turns in the sky.',
        ),
      ],
      [
        ch('wave', 'Wave.', [
          N(
            'You wave, which is a silly thing to do at the sun. You do it anyway, and so does your Nubbin, with both paws.',
          ),
        ]),
        ch('watch', 'Just watch.', [
          N('You watch until your eyes water. It is the first morning there has ever been.'),
        ]),
      ],
    ),
    sc(
      'a31-16-rise-stay',
      [
        N(
          'From Xmucane’s doorway the whole world is dark mountains, with a grey line along the top of them.',
        ),
        N('Behind you, in the middle of the house, the corn stands up green in the dark.'),
        N(
          'Then two lights come up out of the earth, far away, and climb. One becomes the Sun, and the other the Moon.',
        ),
        WHICH_SUN,
        N(
          'After them come four hundred small lights, rising and spreading out, until the sky is full of them.',
        ),
        N('The atlas’s margin says: the Four Hundred Boys became the stars.'),
        N(
          'The first sunlight comes over the mountain and through the door, and lands on the corn. Xmucane’s hand is on your shoulder.',
        ),
        XM('There they are. There they both are.', 'happy'),
      ],
      [
        ask(
          5,
          'science',
          'the Sun rises in the east and sets in the west',
          '5-ESS1-2',
          [
            N(
              'Xmucane is looking east, towards the sunrise. When the Sun sinks in the evening, which direction will she look?',
            ),
          ],
          [
            o(
              'West',
              [N('Yes. The Sun rises in the east and sets in the west, opposite each other.')],
              true,
            ),
            o('East again', [
              N(
                'The Sun moves across the sky during the day. By evening it is on the opposite side, west.',
              ),
            ]),
            o('North', [
              N(
                'In Guatemala the Sun crosses the sky from east to west. North is the direction the compass points to, not where the Sun goes.',
              ),
            ]),
          ],
          'Used the Sun’s path to name the direction of sunset: west.',
        ),
      ],
      [
        ch('wave', 'Wave.', [
          N(
            'You wave at the sun. After a moment Xmucane waves too, as if nobody is watching, and nobody is but your Nubbin.',
          ),
        ]),
        ch('still', 'Stay still under her hand.', [
          N('You don’t move, and neither does she. The sun gets on with it.'),
        ]),
      ],
    ),
    sc(
      'a31-16-ribbons',
      [
        N(
          'For a moment the smoke parts, and you’re back in the kitchen. The girl is pointing at your Nubbin’s ribbons.',
        ),
        GD('Look. Look! It’s both. Sun and Moon, sewn together down the middle.', 'happy'),
        GM('So it is. Somebody sewed that very carefully.', 'soft'),
        N(
          'Each ribbon is a long rectangle with green stitches down its middle. Then the smoke closes, and you’re back at sunrise.',
        ),
      ],
      [
        ask(
          3,
          'art',
          'lines of symmetry in a rectangle',
          '4.G.A.3',
          [
            N(
              'A plain rectangle that is not a square can be folded to match in two ways. How many lines of symmetry does it have?',
            ),
          ],
          [
            o(
              '2',
              [
                N(
                  'Yes: fold it lengthways, or fold it across the middle. A square has four, but a plain rectangle has two.',
                ),
              ],
              true,
            ),
            o('1', [
              N(
                'There is one line down the middle, but there is another one across the middle too. That makes two.',
              ),
            ]),
            o('4', [
              N(
                'Four is for a square, which also has two diagonal lines. A plain rectangle has just two.',
              ),
            ]),
          ],
          'Counted two lines of symmetry in a plain rectangle.',
        ),
      ],
    ),
    sc(
      'a31-16-complete',
      [
        N(
          'When the light is all the way up, there is a green stone on a cord lying on the ball by the end wall. Jade, the colour of new corn.',
        ),
        N(
          'It wasn’t there before, and you know exactly who left it. Your Nubbin lets you tie it round its neck, then can’t stop looking down at it.',
        ),
        GM(
          'Jade is a hard green stone. People in Guatemala have been carving it for thousands of years, and they still do.',
        ),
        GM('They were cheeky boys. But they never forgot anyone who fetched for them.', 'soft'),
        SOFT_EDGE,
      ],
      [
        notice(
          2,
          'social-studies',
          'jade is carved in Guatemala, then and now',
          'D2.His.2.3-5',
          [
            GM(
              'Jade is found in the Motagua valley in Guatemala. It is very hard, so carvers shape it by rubbing it with sand and patience.',
            ),
            GM(
              'Maya people carved it long ago, and Guatemalan carvers still make jade jewellery today. The craft never stopped.',
            ),
          ],
          'Learned that jade is found in Guatemala and has been carved there for thousands of years, up to the present day.',
        ),
      ],
    ),
    sc(
      'a31-16-complete-stay',
      [
        XM(
          'You watched the corn with me. That’s the hard part. The boys only had to be clever.',
          'soft',
        ),
        N(
          'She takes something from round her own neck: a green stone on a cord, jade, the colour of new corn. She ties it on your Nubbin.',
        ),
        XM('For sitting up. Nobody gives you anything for sitting up. They should.'),
        SOFT_EDGE,
      ],
      [
        notice(
          1,
          'sel',
          'patience and waiting with someone are real help',
          'CASEL: Relationship skills',
          [
            GM(
              'Some help is loud, like the twins’ tricks. Some help is quiet, like sitting up all night.',
            ),
            GM(
              'Quiet help is easy to miss because nothing happens. But it is often the kind that people remember longest.',
            ),
          ],
          'Learned that quiet help, like waiting with someone, is real help that people remember.',
        ),
      ],
    ),
  ],
);

// ================================================================== A31-17 The Hearth Again
gloss('teosinte', 'A wild grass that people long ago grew into corn.', 'a31-17-complete');
const Q17 = quest(
  'a31-17',
  'The Hearth Again',
  {
    'a31-17-s1': {
      goal: 'Hear the end of the story by the hearth.',
      hint: 'Stay on the low stool while the smoke clears.',
    },
    'a31-17-s2': {
      goal: 'Give your Nubbin a warm tortilla before you go.',
      hint: 'Take a tortilla from the griddle and give it to your Nubbin.',
    },
  },
  [
    sc(
      'a31-17-hearth',
      [
        N(
          'The smoke clears. You are on the low stool in the kitchen, with your Nubbin asleep on your feet and a cold tortilla in your hand.',
        ),
        GM('And that’s the story.'),
        GD('Is it true?', 'think'),
        GM('The sun came up this morning, didn’t it?'),
        GD('…Yes.'),
        GM('Then eat a tortilla. Go home.', 'happy'),
        N(
          'Outside the window, the green mountain has the evening on it. Somebody down the road is calling a dog in for its supper.',
        ),
      ],
      [
        ask(
          5,
          'literacy',
          'stories, truth and what a story is for',
          'RL.4.2',
          [
            N(
              'The girl asks if the story is true, and the grandmother answers with a question about the sun. What do you think she means?',
            ),
          ],
          [
            o('Some things are true because we live by them every day.', [
              N(
                'That’s a fair answer: the sun rising is certain, and stories can carry that kind of certainty. The grandmother would nod.',
              ),
            ]),
            o('She is dodging, because it is only a story.', [
              N(
                'That’s a fair answer: she does not say yes or no. Still, it works, because the girl stops asking.',
              ),
            ]),
            o('A story can be true in a different way from a fact.', [
              N(
                'That’s a thoughtful answer. A true story can be about waiting, courage and being remembered, even when it has talking owls in it.',
              ),
            ]),
          ],
          'Thought about how a story can be true in a way that is different from a fact.',
        ),
      ],
      [
        ch('thanks', 'Thank her for the story.', [
          GM('Thank my grandmother. And hers. I only carried it.', 'soft'),
        ]),
        ch('again', 'Ask if you can come back and hear it again.', [
          GM('It’ll be here. It’s been here a long time.'),
        ]),
      ],
    ),
    sc(
      'a31-17-ball',
      [
        N(
          'The girl has fetched something from under the table: a rubber ball, black and heavy and scuffed all over.',
        ),
        GD(
          'Your little one chased the ball the whole story. I could tell. It kept twitching.',
          'happy',
        ),
        GD('No hands. Hips. Like this.'),
        N(
          'She bumps the ball off her hip against the wall, thock, and your Nubbin is awake at once.',
        ),
        N(
          'It hip-bumps the ball back, and the ball goes the wrong way, as usual. The girl laughs so hard she has to sit down.',
        ),
        GD('You can have it. I’ve got another. Mine’s better. Don’t tell it.'),
        GM('Give the little one a tortilla first. Nobody leaves this kitchen hungry.'),
      ],
      [
        ask(
          6,
          'maths',
          'unit fractions: halves',
          '3.NF.A.1',
          [
            N(
              'You can share one tortilla fairly by cutting it into two equal parts. What fraction of the tortilla does each part make?',
            ),
          ],
          [
            o(
              'One half',
              [N('Yes: two equal parts make halves. Each part is 1/2 of the whole tortilla.')],
              true,
            ),
            o('One third', [N('Thirds need three equal parts. Two equal parts make halves: 1/2.')]),
            o('One quarter', [
              N('Quarters need four equal parts. Two equal parts are halves: 1/2.'),
            ]),
          ],
          'Named a unit fraction: halves, from two equal parts of a tortilla.',
        ),
      ],
      [
        ch('tortilla', 'Give your Nubbin a warm tortilla.', [
          N('It eats it in four bites, slowly, which for a Nubbin is a mark of great respect.'),
        ]),
        ch('share', 'Share it, half and half.', [
          N('Half each. The girl says that’s fair, and her grandmother says that’s how it’s done.'),
        ]),
      ],
    ),
    sc(
      'a31-17-complete',
      [
        N(
          'The smoke rises past the beam, and the kitchen goes soft, and you are back at your own table with the atlas open.',
        ),
        N('There is a black rubber ball on the floor. Your Nubbin is already sitting on it.'),
        N(
          'And caught in the atlas’s spine there is an ear of corn, dry and golden, the colour of a long walk in the sun.',
        ),
        N(
          'The people of this part of the world first grew corn from a wild grass called teosinte, over eight thousand years ago.',
        ),
        N(
          'You hang it from the middle beam of the cottage. It turns a little in the draught from the door.',
        ),
        N(
          'Out by the pond, the Nubbins come to look at the new ball. Nobody uses hands, and nobody has to be told.',
        ),
      ],
      [
        notice(
          3,
          'social-studies',
          'where corn comes from, and who still grows it',
          'D2.His.2.3-5',
          [
            N(
              'Teosinte looks like a thin grass with a few hard seeds. Over many seasons, farmers kept the best seeds and planted them again, and the plant slowly became corn.',
            ),
            N(
              'Corn now feeds people all over the world. In Guatemala, K’iche’ families still grow it, and tortillas like your Nubbin’s are still made from it.',
            ),
          ],
          'Learned that corn was first grown from a wild grass called teosinte by people in this part of the world, and is still grown there.',
        ),
      ],
    ),
    sc(
      'a31-17-complete-stay',
      [
        N(
          'The smoke rises past the beam, and the kitchen goes soft, and you are back at your own table with the atlas open.',
        ),
        N('There is a black rubber ball on the floor. Your Nubbin is already sitting on it.'),
        N(
          'And caught in the atlas’s spine there is an ear of corn, still green, the colour of a house where somebody waited.',
        ),
        N(
          'You hang it from the middle beam of the cottage. It turns a little in the draught from the door.',
        ),
        N(
          'Out by the pond, the Nubbins come to look at the new ball. Nobody uses hands, and nobody has to be told.',
        ),
      ],
      [
        ask(
          2,
          'science',
          'the corn life cycle: from green to dry',
          '3-LS1-1',
          [N('The ear of corn is still green. What will happen to it as it ripens?')],
          [
            o(
              'It turns golden and dry, and its kernels can be planted as seeds.',
              [
                N(
                  'Yes: ripe corn dries on the plant. Its kernels can be ground into flour or planted to start the cycle again.',
                ),
              ],
              true,
            ),
            o('It stays green for ever.', [
              N(
                'Green corn is still growing. Left on the plant, it ripens, dries and turns golden.',
              ),
            ]),
            o('It turns back into a seed at once.', [
              N(
                'The ear first ripens and dries. The kernels are the seeds, and they wait to be planted.',
              ),
            ]),
          ],
          'Understood that green corn ripens into dry, golden corn whose kernels are seeds.',
        ),
      ],
    ),
    sc(
      'a31-grove-byte',
      [
        N(
          'Byte is by the pond, watching your Nubbin play hip-ball. Its ribbons flap as it bumps: gold and silver, green down the middle.',
        ),
        N('The sun is going down behind the hill. On the other side, the moon is already up.'),
        BY('Same sky. It was always the same sky. I’d like that read into the record.'),
        N('He goes back to his notebook. He doesn’t write anything down, though.'),
      ],
      [
        ask(
          2,
          'science',
          'the Sun and Moon can share the sky',
          '5-ESS1-2',
          [
            N(
              'Byte sees the Sun and the Moon in the sky together. Is that possible, or only in stories?',
            ),
          ],
          [
            o(
              'It is real. The Moon is often up in the daytime.',
              [
                N(
                  'Yes. The Moon is in the sky for about half of each day, and we can often see it pale against the blue.',
                ),
              ],
              true,
            ),
            o('It cannot happen. They only appear at different times.', [
              N(
                'They take turns, but the turns overlap. Look up some afternoon, and you may well see a pale Moon beside the Sun.',
              ),
            ]),
            o('It happens only in stories.', [
              N(
                'You can check it yourself. The pale daytime Moon is real, and a half Moon is easiest to spot.',
              ),
            ]),
          ],
          'Learned that the Moon can be seen in the daytime, so the Sun and Moon can share the sky.',
        ),
      ],
    ),
  ],
);

// ================================================================== exports
export const EDU_A31_READER: EduQuest[] = [
  Q1,
  Q2,
  Q3,
  Q4,
  Q5,
  Q6,
  Q7,
  Q8,
  Q9,
  Q10,
  Q11,
  Q12,
  Q13,
  Q14,
  Q15,
  Q16,
  Q17,
];

/** Variant scenes, pulled out of the quests above (the quests carry the step, done and complete scenes). */
const VARIANT_OFS = new Set([
  'a31-01-ribbons',
  'a31-11-road-stay',
  'a31-11-lords-stay',
  'a31-12-dark-stay',
  'a31-12-dark-done-stay',
  'a31-12-houses-stay',
  'a31-13-rat-coati',
  'a31-13-rat-court',
  'a31-13-bats-stay',
  'a31-13-game-stay',
  'a31-13-rat-coati-told',
  'a31-13-rat-court-told',
  'a31-14-oven-stay',
  'a31-14-river-stay',
  'a31-15-dancers-stay',
  'a31-15-curtain-stay',
  'a31-margin-hazel',
  'a31-16-father-stay',
  'a31-16-rise-stay',
  'a31-16-complete-stay',
  'a31-16-ribbons',
  'a31-17-complete-stay',
  'a31-grove-byte',
]);

const ALL_SCENES = EDU_A31_READER.flatMap((q) => q.scenes);

// Each quest carries the glossary words that first appear in its scenes (variants included).
for (const q of EDU_A31_READER) {
  const ids = new Set(q.scenes.map((x) => x.id));
  const words = GLOSSARY.filter((g) => ids.has(g.scene));
  if (words.length) q.glossary = words;
}

export const EDU_A31_READER_VARIANTS: EduScene[] = ALL_SCENES.filter((s) => VARIANT_OFS.has(s.of));

// The quests list only their own step, done and complete scenes.
for (const q of EDU_A31_READER) q.scenes = q.scenes.filter((s) => !VARIANT_OFS.has(s.of));

/** Every `edu:` check string used by the lessons above (the reader band has no `do` lessons). */
export const CHECKS: string[] = [
  ...new Set(ALL_SCENES.flatMap((s) => s.lessons.flatMap((l) => (l.check ? [l.check] : [])))),
].sort();
