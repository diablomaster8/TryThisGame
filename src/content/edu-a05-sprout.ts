/**
 * The Learning Grove, sprout band (ages 3–6, read aloud by a grown-up): Atlas A5 The Lion of Mali.
 *
 * Source: atlas-a05.ts. One EduScene per original scene (every step scene, every done scene, every
 * complete scene and both lullaby variants), id `sprout:<original id>`. See EDU-STYLE.md.
 *
 * - Every choice keeps its original id and `set` (`a05-tune`, `a05-remember`). Nothing in A5 is cruel
 *   or bleak for this band, so no `defaultChoice` is needed.
 * - No line is lifted from Niane’s telling or Eisner’s book; every line is original. The opening
 *   griot speech is never echoed.
 * - Hard things, the EDU-STYLE way: the old king and Sogolon die, said plainly (“her body stopped
 *   working, and it won’t start again”), never as sleeping, with comfort straight after. Soumaoro is
 *   a grumpy king who loves music, never a monster; battles are dust, horns and banners only.
 * - Care notes kept: a living tradition (“griots still tell it”), tellings that differ, Sogolon strong
 *   and dignified (the court is shown to be wrong to laugh), Islam left off screen, no “myth”.
 * - Nubbins and animals never speak.
 */
import type { EduQuest, EduScene, Lesson } from './types';
import type { Line, Choice } from '../config/story';

type Mood = Line['mood'];
const say =
  (who: string) =>
  (text: string, mood?: Mood): Line =>
    mood ? { who, text, mood } : { who, text };

// ---------------------------------------------------------------- speakers
const N = say('narrator');
const B = say('a05-balla');
const DO = say('a05-doua');
const HU = say('a05-hunter');
const K = say('a05-king');
const BR = say('a05-brother');
const SO = say('a05-sogolon');
const SA = say('a05-sassouma');
const SU = say('a05-sundiata');
const DT = say('a05-dankaran');
const KO = say('a05-kolonkan');
const MB = say('a05-bory');
const SM = say('a05-smith');
const EL = say('a05-eldest');
const DJ = say('a05-djedeba');
const WG = say('a05-wagadou');
const MT = say('a05-moussa');
const CO = say('a05-counsellor');
const SK = say('a05-soumaoro');
const ME = say('a05-messenger');
const FR = say('a05-fran');
const NT = say('a05-triban');
const FK = say('a05-fakoli');

// ---------------------------------------------------------------- builders
type Beat = Omit<Lesson, 'id'>;
type Opt = NonNullable<Lesson['options']>[number];

/** One answer option. `best` marks the answer the lesson teaches. */
const o = (label: string, reply: Line | Line[], best = false): Opt => {
  const r = Array.isArray(reply) ? reply : [reply];
  return best ? { label, best, reply: r } : { label, reply: r };
};

const ask = (
  after: number,
  domain: Lesson['domain'],
  skill: string,
  standard: string,
  prompt: Line[],
  options: Opt[],
  parentNote: string,
): Beat => ({ domain, skill, standard, kind: 'ask', after, prompt, options, parentNote });

const note = (
  after: number,
  domain: Lesson['domain'],
  skill: string,
  standard: string,
  lines: Line[],
  parentNote: string,
): Beat => ({ domain, skill, standard, kind: 'notice', after, lines, parentNote });

const act = (
  after: number,
  domain: Lesson['domain'],
  skill: string,
  standard: string,
  check: string,
  lines: Line[],
  parentNote: string,
): Beat => ({ domain, skill, standard, kind: 'do', after, check, lines, parentNote });

/** One sprout scene. Lesson ids are `sprout:<of>-l<n>`, numbered in play order. */
const sc = (of: string, lines: Line[], beats: Beat[], choices?: Choice[]): EduScene => ({
  id: `sprout:${of}`,
  of,
  band: 'sprout',
  lines,
  ...(choices ? { choices } : {}),
  lessons: [...beats]
    .sort((a, b) => a.after - b.after)
    .map((b, i) => ({ id: `sprout:${of}-l${i + 1}`, ...b })),
});

const ch = (id: string, label: string, then: Line[], set?: Choice['set']): Choice =>
  set ? { id, label, set, then } : { id, label, then };

const ELOF_SED = 'ELOF: Social and Emotional Development';
const ELOF_SCI = 'ELOF: Scientific Reasoning';
const ELOF_LANG = 'ELOF: Language and Communication';
const ELOF_MATH = 'ELOF: Mathematics Development';
const ELOF_APP = 'ELOF: Approaches to Learning';
const ELOF_MOVE = 'ELOF: Perceptual, Motor, and Physical Development';

// ---------------------------------------------------------------- shared lines
/** A5-9: Soumaoro is stopped by the tune (both tune variants). Gentle for this band. */
const A09_SPARED: Line[] = [
  SK('Who is playing my balafon?', 'angry'),
  N('Balla plays on. He plays a song about Soumaoro’s forges and walls.'),
  N('It is a good song. It gets every name right.'),
  SK('Hm.'),
  SK('Stay here, griot. Play for me.', 'think'),
  N('Balla bows and looks at you. He is not free, but he is fine.'),
  B('The tune made the king gentle. That was the door, helper!', 'happy'),
];

/** A5-14: the end of the complete scene (both tune variants). */
const A14_END: Line[] = [
  B('In eight hundred years, children will still hear this. And they’ll argue about it!', 'happy'),
  B('A story that people argue about is a story that is alive.'),
  N('He puts the little balafon in your arms.'),
  B('Go home, helper. Remember us well.', 'soft'),
  N('The red earth turns soft, then smooth, then paper.'),
  N('You are home. Your Nubbin taps a tune on the book, nearly in time.'),
];

// ================================================================== the scenes
const SCENES: EduScene[] = [
  // ------------------------------------------------ A5-1 The Hunters’ Prophecy
  sc(
    'a05-01-page',
    [
      N('A big book falls open. The page is red, like earth.'),
      N('Black and white zigzags run round the edge. Zig, zag, zig, zag!'),
      N('You step into the page: dust, round houses, smoke!'),
      B('Hello! I’m Balla. I carry my father’s things.', 'happy'),
      B('I’m a griot. A griot remembers stories.'),
      B('Will you be my helper?'),
      N('Your Nubbin sits on Balla’s balafon. Balla smiles.'),
    ],
    [
      note(
        2,
        'social-studies',
        'a place on the map: Africa, West Africa, Manding and Mali',
        'D2.Geo.2.K-2',
        [
          N('You are in a land called Manding. It is in West Africa.'),
          N('Manding will grow into a great kingdom called Mali.'),
          N('This story is about 800 years old.'),
        ],
        'Heard that this story happens in Manding, in West Africa, which grew into the kingdom of Mali long ago.',
      ),
    ],
    [
      ch('what', 'Ask what a griot does.', [
        B('Griots remember who was brave. Who was kind.'),
        B('We sing and tell stories, too!', 'happy'),
      ]),
      ch('carry', 'Offer to carry the balafon.', [B('Gently, please. It is very old.')]),
    ],
  ),
  sc(
    'a05-01-page-done',
    [
      B('Come! The king sits under a big tree.'),
      N('Something is going to happen there today.'),
      N('(Look at the page. Can you see round houses?)'),
    ],
    [
      act(
        2,
        'maths',
        'count to 5',
        'K.CC.B.5',
        'edu:count:houses:5',
        [N('(Count the round houses together.)'), N('One, two, three, four, five. Five houses!')],
        'Counted five round houses, one finger each.',
      ),
    ],
  ),
  sc(
    'a05-01-court',
    [
      N('The king sits under a huge tree. People sit all around.'),
      N('A hunter comes in with a bag of shiny shells.'),
      HU('King, the shells have something to tell you.'),
      K('Sit, hunter. I will listen.'),
      N('The hunter throws the shells on a goatskin. Clatter!'),
      HU('A strong woman will come to your gate.'),
      HU('She will have a son. He will make Manding great.'),
    ],
    [
      ask(
        6,
        'sel',
        'listening with ears and eyes',
        'SL.K.1',
        [N('The king listens to the hunter. What do good listeners do?')],
        [
          o(
            'They listen and look at the speaker',
            K('Yes. I listen with my ears and my eyes.'),
            true,
          ),
          o(
            'They shout over the top',
            N('Shouting makes it hard to hear. Good listeners stay quiet.'),
          ),
          o(
            'They run round and round',
            N('Running is fun, but it’s hard to listen then. Sit still and listen.'),
          ),
        ],
        'Practised listening with ears and eyes while someone is talking.',
      ),
    ],
    [
      ch('king', 'Watch the king’s face.', [
        N('The king says nothing. He turns a nut in his fingers.'),
      ]),
      ch('balla', 'Watch Balla.', [
        N('Balla’s lips move. He says the hunter’s words again, to keep them.'),
      ]),
    ],
  ),
  sc(
    'a05-01-court-done',
    [
      DO('Hunter, thank you. Please eat before you go.'),
      B('Did you get all that? Say it back to me tonight.'),
    ],
    [
      note(
        1,
        'literacy',
        'saying words again and again helps us remember',
        ELOF_APP,
        [
          B('A griot says words again and again, until they stick.'),
          B('Try it. Say “shells, son, strong” three times.'),
        ],
        'Learned that repeating words aloud is a way to remember them.',
      ),
    ],
  ),
  sc(
    'a05-01-complete',
    [
      N('By the fire, you say the hunter’s words back to Balla.'),
      B('Hear it once. Keep it always.'),
      B('A story begins with a promise. Everyone listens to see if it comes true.', 'happy'),
      N('Balla taps one key with his thumb. A low, round sound!'),
      N('Your Nubbin taps it too. Its sound is flat and very proud.'),
      B('We’ll work on it.'),
    ],
    [
      act(
        3,
        'science',
        'tapping makes a shaking, and shaking makes sound',
        '1-PS4-1',
        'edu:act:tap:hands',
        [
          N('(Tap the table softly. Put your other hand on it.)'),
          N('Can you feel it shake? Shaking makes sound.'),
        ],
        'Tapped a surface and felt it shake: vibrations make sound.',
      ),
    ],
  ),

  // ------------------------------------------------ A5-2 Sogolon
  sc(
    'a05-02-fire',
    [
      B('Sit by the fire. This is a fire story.'),
      B('A huge buffalo trampled the fields. Nobody could catch it.'),
      B('Two brothers went to find it. On the road they met an old woman.'),
      B('She was hungry. The brothers shared their food.'),
      B('That was kind. So she told them how to win.'),
      B('She asked for one thing. “Choose Sogolon. She is strong.”', 'soft'),
      N('Your Nubbin’s feet are warm by the fire.'),
      B('Some say the old woman was the buffalo. Some say she was Sogolon’s aunt.'),
    ],
    [
      ask(
        4,
        'sel',
        'sharing is a kind thing to do',
        ELOF_SED,
        [N('What did the brothers do that was kind?')],
        [
          o(
            'They shared their food',
            B('Yes! Sharing is kind. And kindness came back to them.', 'happy'),
            true,
          ),
          o(
            'They ate it all',
            N('The brothers didn’t eat it all. They shared it with the old woman.'),
          ),
          o('They ran away', N('They didn’t run. They sat down and shared.')),
        ],
        'Picked out sharing food as the kind act in the story.',
      ),
    ],
    [
      ch('which', 'Ask which one Balla believes.', [
        B('I believe the one I’m telling. That’s my job.', 'happy'),
      ]),
      ch('kind', 'Say the brothers won by being kind.', [B('Yes! Keep that one.', 'think')]),
    ],
  ),
  sc(
    'a05-02-fire-done',
    [
      N('Out on the road, a dog barks. Woof!'),
      N('Another dog barks, woof! Then a third, woof!'),
      B('That’s them! Come on!'),
    ],
    [
      act(
        2,
        'maths',
        'count to 3',
        'K.CC.B.5',
        'edu:count:barks:3',
        [N('(Bark three times together and count on your fingers.)'), N('One, two, three!')],
        'Counted three barks on three fingers.',
      ),
    ],
  ),
  sc(
    'a05-02-gate',
    [
      N('Two dusty hunters come through the gate.'),
      N('Between them walks a young woman. She is stooped, with very bright eyes.'),
      BR('We bring her to the king.'),
      N('People come to look. Some stare, and some whisper.'),
      SO('People look at me. It doesn’t stop me walking.'),
      BR('We offered her a donkey. She said it looked tired!'),
      SO('It did look tired.'),
    ],
    [
      ask(
        4,
        'sel',
        'being kind when others stare',
        ELOF_SED,
        [N('People stare at Sogolon. What could you do that is kind?')],
        [
          o('Walk beside her', SO('A friend beside me. Good.', 'soft'), true),
          o('Stare too', N('Staring can hurt. Walking beside her says, “I’m with you.”')),
          o('Hide behind a wall', N('Hiding doesn’t help her. Walking beside her does.')),
        ],
        'Chose to walk beside someone being stared at, rather than stare.',
      ),
    ],
    [
      ch('beside', 'Walk beside her.', [
        N('You walk beside her. Her shoulders relax.'),
        SO('A small round friend. I like odd company.'),
      ]),
      ch('bundle', 'Offer to carry her bundle.', [
        SO('No, it’s light. But thank you for asking.'),
        N('Your Nubbin holds one corner anyway.'),
      ]),
    ],
  ),
  sc(
    'a05-02-gate-done',
    [
      N('Under the big tree, the court laughs. The king does not.'),
      K('Doua. Do you remember what the hunter said?'),
      DO('Every word, my king.'),
    ],
    [
      act(
        1,
        'literacy',
        'clap the beats in a name',
        'RF.K.2',
        'edu:clap:syllables:sogolon',
        [
          N('(Clap the parts of her name: So-go-lon.)'),
          N('One, two, three claps. Sogolon has three parts!'),
        ],
        'Clapped the three syllables of “Sogolon”.',
      ),
    ],
  ),
  sc(
    'a05-02-complete',
    [
      K('Sogolon of Do, will you be my wife?'),
      N('The laughing stops all at once.'),
      SO('I will. And please stop staring. I have only one head.', 'angry'),
      N('Doua laughs kindly, and the king laughs. Then everyone does.'),
      B('She made them laugh with her, not at her!', 'happy'),
    ],
    [
      note(
        4,
        'sel',
        'laughing with someone is different from laughing at them',
        ELOF_SED,
        [
          B('Laughing with someone is fun for everyone.'),
          B('Laughing at someone hurts. Sogolon showed the difference.'),
        ],
        'Heard the difference between laughing with and laughing at someone.',
      ),
    ],
  ),

  // ------------------------------------------------ A5-3 The Boy Who Couldn’t Walk
  sc(
    'a05-03-house',
    [
      N('The page turns. A wedding, a baby, and seven years go by.'),
      N('Sogolon’s son is seven. He crawls everywhere, and he watches everything.'),
      B('His name is Djata.'),
      B('One day they will call him Sundiata. He doesn’t talk much.'),
      N('Your Nubbin sits in front of him. He pats its head, slowly.'),
      SO('He doesn’t do that for many people. Your friend is honoured.', 'soft'),
      B('The old king died. His body stopped working, and it won’t start again.', 'sad'),
      B('I’m very sad. His big brother is king now.'),
    ],
    [
      ask(
        7,
        'sel',
        'what helps when someone is sad',
        'CASEL: Social awareness',
        [N('Balla is sad. What helps a sad friend?')],
        [
          o('Sit with them', N('Yes. Sitting close shows you care.'), true),
          o('Tell them to stop', N('Sad feelings can’t be told to stop. Sitting close helps.')),
          o('Run away', N('A friend stays close. Sit with them.')),
        ],
        'Chose to sit with a sad friend. Heard plainly that the old king died.',
      ),
    ],
    [
      ch('sit', 'Sit down in the dust with the boy.', [
        N('You sit. Nobody speaks.'),
        N('He is not waiting. He is just looking, very hard.'),
      ]),
      ch('ask', 'Ask Sogolon if he’ll walk one day.', [
        SO('He will walk when he walks.'),
        SO('I don’t pull up seedlings to make them grow.'),
      ]),
    ],
  ),
  sc(
    'a05-03-house-done',
    [
      B('Mark this, helper. He isn’t waiting to become someone.', 'think'),
      B('He is someone already. He is just not finished.'),
    ],
    [
      note(
        0,
        'science',
        'plants need water, sun and time; pulling does not help',
        'K-LS1-1',
        [SO('A seedling needs water, sun and time.'), SO('If I pull it up, it dies. So I wait.')],
        'Heard that plants need water, sunshine and time to grow.',
      ),
    ],
  ),
  sc(
    'a05-03-leaves',
    [
      SO('I need baobab leaves for supper. Sassouma has plenty.'),
      N('Queen Sassouma sits under a baobab full of leaves.'),
      SO('Sister, a handful of leaves, please.'),
      SA('Take them. My son picked them. He climbed up himself.'),
      SA('Your son only crawls.'),
      N('The women laugh. Sogolon takes the leaves, and she is hurt.'),
    ],
    [
      ask(
        2,
        'literacy',
        'first sounds: b for baobab',
        'RF.K.2',
        [N('Baobab starts with a “b” sound. B, b, baobab!'), N('Which word starts like baobab?')],
        [
          o('Ball', N('Yes! B, b, ball, and b, b, baobab.'), true),
          o('Sun', N('Sun starts with “s”. Ball starts with “b”, like baobab.')),
          o('Moon', N('Moon starts with “m”. Ball starts with “b”, like baobab.')),
        ],
        'Matched the first sound “b” in baobab and ball.',
      ),
    ],
    [
      ch('quiet', 'Say nothing, and walk out beside Sogolon.', [
        N('You walk out beside her. She keeps her back straight.'),
      ]),
      ch('look', 'Look Sassouma in the eye.', [
        N('You look at Sassouma. She looks back, cool and calm.'),
        B('She’ll remember your face.', 'think'),
      ]),
    ],
  ),
  sc(
    'a05-03-leaves-done',
    [
      N('At her door, Sogolon sits down. She cries, with her face in the leaves.'),
      N('Her son crawls over. Your Nubbin leans on her other side.'),
    ],
    [
      note(
        1,
        'sel',
        'crying is allowed, and a hug or company helps',
        ELOF_SED,
        [
          N('Sogolon is sad, and it’s all right to cry.'),
          N('Her son and your Nubbin stay close. Being close helps.'),
        ],
        'Heard that crying is allowed and that staying close helps.',
      ),
    ],
  ),
  sc(
    'a05-03-complete',
    [
      SU('Mother. Why are you crying?'),
      SO('Because of leaves. Because of sharp words. Because of you, my son.', 'sad'),
      SU('Dry your eyes, Mother. Today I stand up.', 'angry'),
      SU('Ask the smiths for a rod of iron. The heaviest one.'),
      N('Balla says the words over to himself, to keep them.'),
    ],
    [
      act(
        3,
        'maths',
        'count to 7',
        'K.CC.B.5',
        'edu:count:years:7',
        [
          N('(Hold up seven fingers.)'),
          N('Sundiata crawled for seven years. One, two, three, four, five, six, seven.'),
        ],
        'Counted to seven for the seven years Sundiata crawled.',
      ),
    ],
  ),

  // ------------------------------------------------ A5-4 The Iron Rod
  sc(
    'a05-04-forge',
    [
      N('The smiths’ street smells of smoke. Hammers ring: clang, clang!'),
      N('The master smith is big and quiet.'),
      SM('The heaviest rod we have ever made. For the crawling boy.'),
      SM('My father made it long ago. It waited for this day.'),
      N('It is as long as two of you. It is dark as night.'),
      SM('Smiths keep secrets, helper. And we are patient.', 'think'),
    ],
    [
      note(
        4,
        'science',
        'fire makes iron hot and soft; cooling makes it hard again',
        '2-PS1-4',
        [
          SM('I put iron in the fire until it glows.'),
          SM('Hot iron is soft, so I can shape it.'),
          SM('When it cools, it is hard again.'),
        ],
        'Heard that heat softens iron and cooling hardens it again.',
      ),
    ],
    [
      ch('help', 'Take hold of the rod with the helpers.', [
        N('You pull, and it is so heavy! Your Nubbin pushes from behind.'),
      ]),
      ch('ask', 'Ask if a boy can really lift that.', [SM('No. That is the point.')]),
    ],
  ),
  sc(
    'a05-04-forge-done',
    [
      N('Six helpers carry the rod up the hill.'),
      N('Your Nubbin sits on the end to help. The rod does not notice.'),
      N('Half the children in town follow.'),
      B('Everyone wants to see. Stay close to me.'),
    ],
    [
      act(
        0,
        'maths',
        'count to 6',
        'K.CC.B.5',
        'edu:count:helpers:6',
        [N('(Count the six helpers on your fingers.)'), N('Six helpers!')],
        'Counted six helpers carrying the rod.',
      ),
    ],
  ),
  sc(
    'a05-04-stand',
    [
      N('The rod lies by Sogolon’s door. The crowd goes quiet.'),
      N('The boy takes it in both hands. He pulls and pulls.'),
      N('He is on his knees. Then on one foot.'),
      N('Then he is standing! The rod bends like a bow.'),
      B('He’s standing!', 'shock'),
      N('Balla sings a praise song. The whole hill joins in.'),
      SO('My son is standing.', 'happy'),
    ],
    [
      act(
        4,
        'science',
        'pushing and pulling',
        ELOF_SCI,
        'edu:act:push-pull:hands',
        [
          N('(Put your hands together and push. Now pull them apart.)'),
          N('Push, pull! Sundiata pulled to stand up.'),
        ],
        'Tried pushing and pulling with their hands.',
      ),
    ],
    [
      ch('cheer', 'Cheer.', [N('You cheer! Your Nubbin squeaks and runs round his feet.')]),
      ch('sogolon', 'Look at Sogolon.', [
        N('Sogolon has her hands over her mouth. She waited seven years.'),
      ]),
    ],
  ),
  sc(
    'a05-04-stand-done',
    [
      B('Some tellers say it was a stick. Some say a branch.'),
      B('I was there. It was iron. But I’ll tell the stick one too.'),
    ],
    [
      note(
        0,
        'literacy',
        'one story can be told in different ways',
        ELOF_LANG,
        [
          B('Griots tell a story in different ways.'),
          B('The same story can have more than one telling.'),
        ],
        'Heard that one story can be told in more than one way.',
      ),
    ],
  ),
  sc(
    'a05-04-baobab',
    [
      SU('Mother, you wanted baobab leaves.'),
      N('He walks to a young baobab. He puts his arms round it.'),
      N('In some tellings, he pulls it up and carries it home.'),
      N('He sets it down at his mother’s door.'),
      SO('That’s enough for one day, my son. Sit down.', 'happy'),
    ],
    [
      act(
        2,
        'science',
        'baobabs are very wide and live a very long time',
        ELOF_SCI,
        'edu:act:arms:wide',
        [
          N('(Stretch your arms out as wide as you can.)'),
          N('A baobab trunk is wider than that!'),
          N('It grows slowly. Some live for hundreds of years.'),
        ],
        'Stretched arms wide to imagine a baobab trunk; heard that baobabs live a very long time.',
      ),
    ],
  ),
  sc(
    'a05-04-baobab-done',
    [
      N('You gather the leaves. Basket one has 3 leaves.'),
      N('Basket two has 5 leaves.'),
      N('Across the yard, Sassouma’s door is shut.'),
    ],
    [
      ask(
        1,
        'maths',
        'which group has more',
        'K.CC.C.6',
        [N('Basket one has 3 leaves, and basket two has 5. Which has more?')],
        [
          o('Basket two', N('Yes! Five is more than three.'), true),
          o(
            'Basket one',
            N('Let’s count again: basket one has 3, basket two has 5. Five is more.'),
          ),
        ],
        'Compared 3 leaves with 5 leaves and picked the larger group.',
      ),
    ],
  ),
  sc(
    'a05-04-complete',
    [
      B('Now they call him Sogolon’s Djata. Say it fast: Sundiata!'),
      B('Djata means lion. His mother and a lion, in one name.'),
      N('Sogolon gives you a baobab seed. It is hard and round.'),
      SO('For your yard. They grow slowly. Don’t worry.', 'soft'),
      N('Your Nubbin tries to eat it, so you take it back. Sogolon laughs.'),
    ],
    [
      ask(
        1,
        'literacy',
        'first sounds',
        'RF.K.2',
        [N('Sundiata and Sogolon start with the same sound. Which starts like them?')],
        [
          o('Sun', N('Yes! Sss-un, Sss-ogolon and Sss-undiata all start with “s”.'), true),
          o('Moon', N('Moon starts with “m”. Sundiata starts with “s”, like sun.')),
          o('Tree', N('Tree starts with “t”. Sundiata starts with “s”, like sun.')),
        ],
        'Matched the first sound “s” in Sundiata and Sogolon.',
      ),
    ],
  ),

  // ------------------------------------------------ A5-5 The Griot
  sc(
    'a05-05-given',
    [
      N('Sundiata is ten now. He hunts with the older boys.'),
      DO('Every king has a griot. My son will be yours.'),
      SU('I don’t need someone to sing at me.'),
      DO('You need someone to remember you.'),
      B('And I’ll tell you when you’re being a fool!', 'happy'),
      SU('Then stay close. I’ll need telling.'),
    ],
    [
      ask(
        5,
        'maths',
        'take away to find the difference',
        'K.OA.A.2',
        [N('Sundiata stood at 7. Now he is 10.'), N('How many years later is that?')],
        [
          o('3 years', N('Yes! Hold up 7 fingers, then 3 more to make 10.'), true),
          o('7 years', N('Start at 7 and count up: 8, 9, 10. Three years.')),
          o('1 year', N('Count up from 7: 8, 9, 10. That’s three years.')),
        ],
        'Worked out that from age 7 to 10 is 3 years.',
      ),
    ],
  ),
  sc(
    'a05-05-given-done',
    [
      N('Sundiata and Balla shake hands, very seriously.'),
      N('Then Sundiata gives him a playful push into the grass.'),
      N('They both laugh.'),
    ],
    [
      note(
        2,
        'sel',
        'play is when everyone is laughing',
        ELOF_SED,
        [
          N('Friends can play and tease. It’s fine when both are laughing.'),
          N('If someone isn’t laughing, stop and say sorry.'),
        ],
        'Heard that friendly play is when both are laughing; stop if someone isn’t.',
      ),
    ],
  ),
  sc(
    'a05-05-lesson',
    [
      B('If you’re my helper, your round friend is too.'),
      N('He gives your Nubbin two beaters. They are very long.'),
      B('You don’t hit the key. You ask it.'),
      N('Your Nubbin asks. The key answers, round and low!'),
      B('There’s the hunters’ tune: quick and stamping.'),
      B('Or Sogolon’s humming tune: slow and rocking.', 'soft'),
      B('Which one?'),
    ],
    [
      act(
        5,
        'music',
        'fast and slow',
        ELOF_MOVE,
        'edu:clap:tempo:fast-slow',
        [
          N('(Clap fast, like the hunters. Clap slow, like the humming tune.)'),
          N('Fast, fast, fast. Slow… slow… slow.'),
        ],
        'Clapped a fast beat and a slow beat.',
      ),
    ],
    [
      ch(
        'hunters',
        'The hunters’ tune.',
        [
          N('Balla plays it once: quick and stamping, like lots of feet.'),
          N('Your Nubbin plays it back. Its feet stamp too.'),
          B('A tune for a crowd. You’ll never be lonely.', 'happy'),
        ],
        { 'a05-tune': 'hunters' },
      ),
      ch(
        'lullaby',
        'Sogolon’s lullaby.',
        [
          N('Balla plays it once. Slow, rocking, round and round.'),
          N('Your Nubbin plays it back, very carefully.'),
          B('A tune for one person. They’ll think it’s just for them.', 'soft'),
        ],
        { 'a05-tune': 'lullaby' },
      ),
    ],
  ),
  sc(
    'a05-05-lesson-done',
    [
      N('Your Nubbin plays its tune all evening.'),
      N('By night it plays the whole tune without stopping.'),
      N('Sogolon’s door is open. She sits just inside, listening.'),
    ],
    [
      ask(
        1,
        'maths',
        'a pattern: what comes next',
        ELOF_MATH,
        [N('The tune goes: low, high, low, high, low… What comes next?')],
        [
          o('High', N('Yes! Low, high, low, high, low, high is a pattern!'), true),
          o('Low', N('Listen again: low, high, low, high, low… next is high.')),
        ],
        'Continued a two-note pattern: low, high, low, high.',
      ),
    ],
  ),
  sc(
    'a05-05-complete',
    [
      B('Keep that tune. One day it will open a door for us.'),
      B('I won’t say which door yet.', 'think'),
      N('Your Nubbin plays the first three notes. They’re still there.'),
    ],
    [
      act(
        1,
        'literacy',
        'first, next, last',
        'RL.K.3',
        'edu:order:tune:first-next-last',
        [
          N('(Put three things in order: first, next, last.)'),
          N('To learn a tune: first listen, next copy, last play it by heart.'),
        ],
        'Put the steps of learning a tune in order: listen, copy, play.',
      ),
    ],
  ),

  // ------------------------------------------------ A5-6 Exile
  sc(
    'a05-06-garden',
    [
      N('At night, nine old women creep into Sogolon’s garden.'),
      N('They want to take her greens, and make Sundiata cross.'),
      N('The garden is silver in the moonlight.'),
      N('Sundiata stands up out of the vines.'),
      SU('Grandmothers, you needn’t creep. Take what you like.', 'soft'),
      SU('These ones are better. Those are still green.'),
      N('He fills their baskets. Your Nubbin brings a gourd each.'),
    ],
    [
      act(
        6,
        'maths',
        'count to 9',
        'K.CC.B.5',
        'edu:count:women:9',
        [
          N('(Count the nine old women with your finger.)'),
          N('One, two, three, four, five, six, seven, eight, nine!'),
        ],
        'Counted nine old women, one finger each.',
      ),
    ],
  ),
  sc(
    'a05-06-garden-done',
    [
      EL('We came to make you cross. You made us ashamed instead.', 'sad'),
      EL('From tonight, we watch over you.'),
    ],
    [
      note(
        1,
        'literacy',
        'a feeling word: ashamed',
        'RL.1.4',
        [
          N('“Ashamed” is a feeling word. It means you feel bad about something you did.'),
          N('Sundiata was kind, so the old women felt ashamed. Saying sorry helps.'),
        ],
        'Heard what the feeling word “ashamed” means, and that kindness can change someone’s mind.',
      ),
    ],
  ),
  sc(
    'a05-06-sent',
    [
      N('In the morning, horses wait at the palace gate.'),
      DT('The king of Sosso is strong, and I am scared.'),
      DT('So I send him gifts. And Balla.'),
      SU('You can’t take my griot!', 'angry'),
      DT('I am king now, brother.'),
      N('Balla touches Sundiata’s arm. Sundiata shakes, but stays.'),
      B('Helper, listen. Remember it all for me. Then tell it back.', 'soft'),
    ],
    [
      ask(
        5,
        'sel',
        'a good way to handle a big feeling',
        'CASEL: Self-management',
        [N('Sundiata feels cross and sad. What helps a big feeling?')],
        [
          o('Slow, deep breaths', N('Yes. In… and out… Big feelings get smaller.'), true),
          o('Hit something', N('Hitting hurts. Slow breaths help the feeling pass.')),
          o('Hide and say nothing', N('Hiding can make it grow. Breathe, and tell someone.')),
        ],
        'Chose slow breaths to handle a big feeling.',
      ),
    ],
    [
      ch('promise', 'Promise him.', [
        B('Good. Then I’m not leaving. I’m only going ahead.', 'soft'),
      ]),
      ch('come', 'Ask why he won’t say no.', [
        B('If I say no, there will be a fight. Sundiata isn’t ready.'),
        B('Sometimes going quietly is wise.', 'sad'),
      ]),
    ],
  ),
  sc(
    'a05-06-sent-done',
    [
      N('The horses leave. Your Nubbin plays three notes after them.'),
      N('Far down the road, Balla’s balafon answers with three more.'),
    ],
    [
      ask(
        1,
        'maths',
        'add 3 and 3',
        'K.OA.A.1',
        [N('Three notes, and three more notes. How many notes in all?')],
        [
          o('6', N('Yes! 3 and 3 make 6.'), true),
          o('3', N('That’s one group. Both together make 1, 2, 3, 4, 5, 6!')),
          o('9', N('Let’s count: 1, 2, 3, then 4, 5, 6. Six notes.')),
        ],
        'Added 3 and 3 to make 6 notes.',
      ),
    ],
  ),
  sc(
    'a05-06-leave',
    [
      SO('Queen Sassouma does not want Sundiata here.'),
      SO('So we go tonight, while it is dark.'),
      N('Five wait at the west gate: Sogolon, Sundiata, two sisters and Bory.'),
      MB('I’m going where Djata goes.', 'sad'),
      SO('Walk quietly.'),
      N('Sundiata looks back at the dark baobab.'),
      SU('I’ll come back. Remember I said so.'),
    ],
    [
      ask(
        3,
        'social-studies',
        'the sun sets in the west',
        'D2.Geo.2.K-2',
        [N('They leave by the west gate.'), N('Where does the sun go down: east or west?')],
        [
          o('West', N('Yes! The sun rises in the east and sets in the west.'), true),
          o('East', N('The sun comes up in the east. It goes down in the west.')),
        ],
        'Learned that the sun sets in the west.',
      ),
    ],
    [
      ch('earth', 'Pick up a handful of red earth.', [
        N('You tie it in a corner of your cloth. It feels heavier all night.'),
      ]),
      ch('hold', 'Take Djamarou’s hand.', [
        N('Little Djamarou holds on tight until the sun is up.'),
      ]),
    ],
  ),
  sc(
    'a05-06-complete',
    [
      N('By sunrise, Niani is a smudge behind you.'),
      N('Nobody talks. Even your Nubbin walks quietly.'),
      N('You count things to remember: hills, sky, who carried what.'),
      SU('You’re doing what Balla does. Your lips move.'),
      SU('Remember this. My mother walked out with her head up.'),
    ],
    [
      note(
        0,
        'science',
        'the sun rises after the night',
        '1-ESS1-1',
        [
          N('After the dark night, the sun comes up. It always does.'),
          N('Morning is a new start. The sun rises in the east.'),
        ],
        'Heard that the sun rises each morning after the night.',
      ),
    ],
  ),

  // ------------------------------------------------ A5-7 Kingdom to Kingdom
  sc(
    'a05-07-djedeba',
    [
      N('The first king on the road loves games.'),
      DJ('Play me at wori! Seeds into pits, round and round.'),
      N('The board is carved wood with two rows of little pits.'),
      KO('The king is tricky, brother. Watch him closely.'),
      N('Your Nubbin stares at the king’s hands.'),
      N('Sundiata watches carefully. Then he starts to win.'),
    ],
    [
      ask(
        3,
        'maths',
        'more and fewer',
        'K.CC.C.6',
        [N('One pit has 4 seeds, and another has 7. Which pit has more?')],
        [
          o('The pit with 7', N('Yes! Seven is more than four.'), true),
          o(
            'The pit with 4',
            N('Count them: 4 stops sooner, and 7 goes on longer. Seven is more.'),
          ),
        ],
        'Compared 4 seeds with 7 seeds and found which is more.',
      ),
    ],
    [
      ch('count', 'Count the seeds for Sundiata.', [
        N('You count under your breath, and Sundiata nods. He likes the company.'),
      ]),
      ch('nubbin', 'Let your Nubbin keep staring.', [
        N('The king feels uncomfortable. He hides his hands in his sleeves.'),
      ]),
    ],
  ),
  sc(
    'a05-07-djedeba-done',
    [DJ('You play well. You think before you move.', 'think'), DJ('Stay the night. Then go on.')],
    [
      note(
        1,
        'sel',
        'taking turns',
        ELOF_SED,
        [
          N('In wori, you take turns. First me, then you.'),
          N('Waiting for your turn is a kind thing to do.'),
        ],
        'Heard that taking turns is fair and kind.',
      ),
    ],
  ),
  sc(
    'a05-07-wagadou',
    [
      N('Wagadou is a very old kingdom. Its king is kind and careful.'),
      WG('Sit at my council. Learn how a king listens.'),
      N('All day, people come: a farmer, a lady, two men with one goat.'),
      N('The king listens to every one, even the goat men.'),
      SU('Why do you let them talk so long?'),
      WG('They came to be heard. Listening is how we keep people.'),
    ],
    [
      ask(
        3,
        'social-studies',
        'being fair means listening to both sides',
        'D2.Civ.8.K-2',
        [N('Two men both say the goat is theirs. What does a fair king do?')],
        [
          o('Listen to both men', WG('Yes. Everyone gets a turn to speak.'), true),
          o('Pick one man', N('Picking quickly isn’t fair. Listen to both first.')),
          o('Keep the goat', N('The goat isn’t the king’s. Fair means listening to both men.')),
        ],
        'Chose to listen to both sides before deciding.',
      ),
    ],
  ),
  sc(
    'a05-07-wagadou-done',
    [
      N('That night, Sundiata sits up late, thinking.'),
      SU('Put that one near the top of the list for Balla.'),
      N('(Think of the two men and their goat.)'),
    ],
    [
      ask(
        2,
        'literacy',
        'rhyming words',
        'RF.K.2',
        [N('Goat rhymes with… which word?')],
        [
          o('Boat', N('Yes! Goat and boat sound the same at the end.'), true),
          o('Hen', N('Hen doesn’t sound like goat. Boat does: goat, boat!')),
          o('Dog', N('Dog doesn’t rhyme with goat. Boat does: goat, boat!')),
        ],
        'Found a word that rhymes with “goat”.',
      ),
    ],
  ),
  sc(
    'a05-07-road',
    [
      N('Months of road: thorn trees, dry river beds, a huge sky.'),
      N('Sogolon walks slower every week. Nobody says so.'),
      MB('Djata, we could go faster!'),
      SU('We go at my mother’s pace, so we all arrive.'),
      N('Sundiata walks beside his mother. The whole family follows.'),
      KO('He used to be the slowest. Now he’s the one who waits.', 'think'),
    ],
    [
      ask(
        5,
        'sel',
        'patience and waiting for others',
        'CASEL: Relationship skills',
        [N('Why does Sundiata walk slowly?')],
        [
          o('So everyone arrives together', SU('Yes. We go together.'), true),
          o('Because he is tired', N('He isn’t tired. He walks slowly for his mother.')),
          o('Because he is lost', N('He isn’t lost. He chooses to walk with his mother.')),
        ],
        'Understood that Sundiata walks slowly so the whole family arrives together.',
      ),
    ],
    [
      ch('carry', 'Offer to carry Sogolon’s water gourd.', [
        SO('Thank you. My hands are glad.', 'happy'),
      ]),
      ch('tune', 'Ask your Nubbin to play its tune.', [
        N('Your Nubbin taps its knees. The family walks to the beat.'),
      ]),
    ],
  ),
  sc(
    'a05-07-complete',
    [
      N('Seven years go by in a turn of the page.'),
      N('Sundiata is a man now, broad as a door.'),
      KO('Tellers disagree about the order of this road.', 'happy'),
      SU('I learned: patience, then listening, then my mother’s pace.'),
    ],
    [
      act(
        3,
        'literacy',
        'put events in order',
        'RL.K.3',
        'edu:order:lessons:patience-listening-pace',
        [
          N('(Say the three lessons in order.)'),
          N('First patience, next listening, last his mother’s pace.'),
        ],
        'Said the three lessons from the road in order: first, next, last.',
      ),
    ],
  ),

  // ------------------------------------------------ A5-8 Mema
  sc(
    'a05-08-army',
    [
      N('Mema is a city on a river. Its king loves horses.'),
      MT('Can you lead?'),
      SU('Give me twenty horsemen. I’ll find out.'),
      N('From the mound you watch them go, a line of dust.'),
      N('They come back at dusk. Twenty went, and twenty came back!'),
      MT('Nobody missing. Well done!', 'happy'),
    ],
    [
      act(
        4,
        'maths',
        'count to 20',
        'K.CC.A.1',
        'edu:count:horsemen:20',
        [
          N('(Count to twenty together, as fast as the horses.)'),
          N('One, two, three… all the way to twenty!'),
        ],
        'Counted up to twenty, for the twenty horsemen.',
      ),
    ],
    [
      ch('list', 'Add it to the list for Balla.', [
        N('You add it: nobody was missing. Balla will like that best.'),
      ]),
      ch('nubbin', 'Wave your Nubbin’s paw.', [N('Sundiata sees it and lifts his spear.')]),
    ],
  ),
  sc(
    'a05-08-army-done',
    [
      N('Year by year, the king gives Sundiata more to lead.'),
      MT('I am getting old. I have no son.', 'think'),
    ],
    [
      note(
        1,
        'social-studies',
        'life long ago and today',
        'D2.His.2.K-2',
        [N('The king rides a horse. There are no cars yet.'), N('Horses need grass and water.')],
        'Learned that long ago people travelled by horse or on foot.',
      ),
    ],
  ),
  sc(
    'a05-08-mat',
    [
      N('Sogolon is old now. She rests on a mat in the shade.'),
      SO('Sit with me. I like a quiet visitor.'),
      N('Your Nubbin lies down against her side.'),
      SO('I won’t see Niani again. I am old, and my body is tired.', 'soft'),
      SO('I carried him. I waited for him. I am proud, and tired.'),
      SO('Tell Balla. Both are fine.'),
    ],
    [
      note(
        0,
        'science',
        'the sun moves across the sky, so shade moves too',
        '1-ESS1-1',
        [
          N('(Point up, to where the sun would be.)'),
          N('The sun moves across the sky all day. So the shade moves too.'),
          N('Sogolon’s shade moves round her as the day goes by.'),
        ],
        'Heard that the sun moves across the sky during the day, so shade moves too.',
      ),
    ],
    [
      ch('stay', 'Stay, and say nothing.', [
        N('You stay, and she closes her eyes. The shade moves.'),
        N('She hums, very low, her grinding-stone tune.'),
      ]),
      ch('promise', 'Promise to tell Balla.', [
        SO('Good. Make him laugh at the cattle bit.', 'happy'),
      ]),
    ],
  ),
  sc(
    'a05-08-mat-done',
    [
      N('That night, Sogolon dies.'),
      N('Her body has stopped working, and it won’t start again.', 'sad'),
      N('In the morning her children sit round her mat. You sit too.'),
      N('Nobody speaks for a long time. That is all right.'),
    ],
    [
      note(
        3,
        'sel',
        'when someone dies it is sad; being together helps',
        'CASEL: Self-awareness',
        [
          N('When someone dies, we feel very sad. That’s all right.'),
          N('Crying is allowed. Sitting close and telling stories helps.'),
        ],
        'Heard plainly that Sogolon died, that sadness is allowed, and that being together helps.',
      ),
    ],
  ),
  sc(
    'a05-08-complete',
    [
      KO('She’d want us to stop crying soon. She was strict.', 'sad'),
      SU('She was the strongest person I’ve ever met.'),
      N('Your Nubbin sits on the empty mat. It is still warm.'),
      N('Kolonkan sits beside it. She pats its head, as her mother did.', 'soft'),
    ],
    [
      act(
        3,
        'literacy',
        'telling a short memory out loud',
        'SL.K.1',
        'edu:say:memory:one',
        [
          N('(Say one thing you remember about someone you love.)'),
          N('We keep people with us by remembering them.'),
        ],
        'Said one memory of someone they love.',
      ),
    ],
  ),

  // ------------------------------------------------ A5-9 The Sorcerer King
  sc(
    'a05-09-sosso',
    [
      N('The pages riffle. The red earth turns grey with smoke.'),
      N('You are in Sosso, a city of forges. Hammers ring.'),
      N('A tall tower has seven floors.'),
      B('Helper? You’re not meant to be here!', 'shock'),
      B('A griot goes where the story goes.'),
      B('At the top of this tower is a door nobody opens.'),
    ],
    [
      act(
        2,
        'maths',
        'count to 7',
        'K.CC.B.5',
        'edu:count:floors:7',
        [N('(Count the floors of the tower with your finger.)'), N('One to seven. Seven floors!')],
        'Counted seven floors of the tower.',
      ),
    ],
    [
      ch('stop', 'Tell him it’s a bad idea.', [
        B('It is. I’m going anyway. Now you can say I was warned.', 'happy'),
      ]),
      ch('follow', 'Follow him up the stairs.', [
        N('Up seven floors you go. Your Nubbin climbs one step at a time.'),
      ]),
    ],
  ),
  sc(
    'a05-09-sosso-done',
    [N('The door isn’t locked. Nobody dares.'), N('Balla pushes. Creeeak!')],
    [
      ask(
        1,
        'literacy',
        'sound words',
        'RL.1.4',
        [N('Balla pushes the old door. What sound does it make?')],
        [
          o('Creeeak!', N('Yes! Creeeak goes the old door.'), true),
          o('Moo!', N('Moo is a cow! An old door goes creeeak.')),
          o('Splash!', N('Splash is water! An old door goes creeeak.')),
        ],
        'Remembered and said the sound word for an old door opening.',
      ),
    ],
  ),
  sc(
    'a05-09-chamber',
    [
      N('The room is dim. Owls sit on perches, watching.'),
      N('Jars sit on shelves. Old crowns hang on the wall.'),
      N('In the middle is a huge balafon, dark with age.'),
      B('Oh, look at that.', 'soft'),
      B('A griot can’t see a balafon like that and not play it.'),
      B('Your tune. Let’s hear it on a king’s balafon.'),
    ],
    [
      note(
        1,
        'science',
        'owls sleep by day and wake at night',
        ELOF_SCI,
        [
          N('Owls sleep in the daytime and wake up at night.'),
          N('They have big eyes to see in the dark. Whoo!'),
        ],
        'Heard that owls are awake at night and have big eyes.',
      ),
    ],
  ),
  sc(
    'a05-09-chamber-done',
    [
      N('Balla plays the hunters’ tune. It is enormous!'),
      N('Your Nubbin stamps, and the owls shuffle. Heavy feet climb the stairs.'),
      N('Soumaoro fills the doorway, in a cloak the colour of iron.'),
      SK('That is a hunters’ tune. My father’s hunters played it when I was small.', 'think'),
      ...A09_SPARED,
    ],
    [
      note(
        2,
        'music',
        'long keys make low sounds, short keys make high sounds',
        '1-PS4-1',
        [
          B('This balafon is huge. Its long keys make deep, low sounds.'),
          B('Short keys make high sounds. Long is low. Short is high.'),
        ],
        'Heard that long keys make low sounds and short keys make high sounds.',
      ),
    ],
  ),
  sc(
    'a05-09-march',
    [
      N('The page turns. Soumaoro’s soldiers leave Sosso.'),
      B('He is taking Manding. The gifts weren’t enough.', 'sad'),
      N('Far off, the king, Dankaran, rides the other way. He has run away.'),
      B('Manding has no king now.'),
      B('Go back to Sundiata, helper. I’ll keep the tune going here.'),
    ],
    [
      ask(
        2,
        'sel',
        'what to do when you are frightened',
        ELOF_SED,
        [N('Dankaran ran away because he was scared. What helps when you’re scared?')],
        [
          o('Tell someone, and get help', N('Yes. Telling someone you trust is brave.'), true),
          o('Hide in the dark', N('Hiding alone can make it worse. Tell someone you trust.')),
          o('Pretend nothing is wrong', N('Feelings need to be shared. Tell someone you trust.')),
        ],
        'Chose to tell someone and get help when frightened.',
      ),
    ],
  ),
  sc(
    'a05-09-complete',
    [
      B('In Sosso they tell it differently.'),
      B('They say Soumaoro was a great smith and king.'),
      B('Remember that too.'),
      B('I’m his griot now. I sing him well. He loves music.', 'think'),
      N('The pages riffle, and grey smoke turns to red earth. You are in Mema.'),
    ],
    [
      note(
        1,
        'literacy',
        'different people tell the same story differently',
        ELOF_LANG,
        [
          B('People in Sosso and people in Manding tell this story differently.'),
          B('Both can feel true to the people telling.'),
        ],
        'Heard that two groups can tell the same story differently.',
      ),
    ],
  ),

  // ------------------------------------------------ A5-10 The Call Home
  sc(
    'a05-10-market',
    [
      N('Mema’s market is full of noise and colour.'),
      N('Kolonkan sells baobab leaves at a little stall.'),
      KO('Nobody buys them. I keep the stall so the smell is here.'),
      N('Four tired travellers stop. One sniffs a bunch of leaves.'),
      ME('These are Manding leaves! Is Sogolon’s son here?', 'shock'),
      KO('Sogolon’s daughter sells them.'),
      ME('Then he’s here! Manding needs him.'),
    ],
    [
      ask(
        3,
        'science',
        'we smell with our noses',
        ELOF_SCI,
        [N('The man smells the leaves. Which part of you smells?')],
        [
          o('My nose', N('Yes! Sniff, sniff: the smell reminds him of home.'), true),
          o('My toes', N('Toes can’t smell. Noses do!')),
          o('My ears', N('Ears are for hearing. Noses smell.')),
        ],
        'Named the nose as the part of the body we smell with.',
      ),
    ],
    [
      ch('run', 'Run for Sundiata.', [
        N('You run. Your Nubbin follows, and arrives just as proud.'),
      ]),
      ch('stay', 'Stay with Kolonkan.', [KO('Stay. My hands are shaking.', 'shock')]),
    ],
  ),
  sc(
    'a05-10-market-done',
    [
      SU('I said I’d come back. My mother heard me.'),
      SU('Now I must go. I wish she could see.', 'sad'),
    ],
    [
      note(
        1,
        'sel',
        'it is all right to miss someone, and to keep a promise',
        'CASEL: Self-awareness',
        [
          N('Sundiata misses his mother. It’s all right to miss someone.'),
          N('He keeps his promise because it matters.'),
        ],
        'Heard that missing someone is all right, and that keeping a promise matters.',
      ),
    ],
  ),
  sc(
    'a05-10-basket',
    [
      N('Sogolon must be buried. The king of Mema is unhappy.'),
      MT('Sogolon may not rest in my ground.', 'angry'),
      MT('I want Sundiata to stay here.'),
      SU('Bring me a basket, helper.'),
      SU('Put in broken pots, old straw and some feathers.'),
      N('Your Nubbin adds one big feather.'),
      SU('Set it before the king’s council. Say nothing.'),
    ],
    [
      act(
        5,
        'maths',
        'sort into three groups',
        'K.MD.B.3',
        'edu:sort:basket:pots-straw-feathers',
        [
          N('(Sort the three things: pots, straw, feathers.)'),
          N('Pots here, straw there, feathers over here: three groups!'),
        ],
        'Sorted objects into three groups: pots, straw and feathers.',
      ),
    ],
    [
      ch('ask', 'Ask what it means.', [
        SU('An old counsellor will tell him. It sounds better in an old voice.'),
      ]),
      ch('guess', 'Work it out yourself.', [
        N('Broken pots, fallen straw, scattered feathers. It looks like a sad, ruined town.'),
        SU('Don’t say it. Let them say it.'),
      ]),
    ],
  ),
  sc(
    'a05-10-basket-done',
    [
      CO('King, this basket is a broken town.'),
      CO('He says: be kind to his mother. Then your town stays whole.'),
      MT('I know what it says.', 'sad'),
      MT('Give her the best ground. Give him horsemen. I’d rather be his friend.'),
    ],
    [
      note(
        1,
        'literacy',
        'things can tell a story without words',
        ELOF_LANG,
        [
          N('A basket told a story with no words at all.'),
          N('Pictures, gifts and objects can say things too.'),
        ],
        'Heard that objects and pictures can tell a story without words.',
      ),
    ],
  ),
  sc(
    'a05-10-complete',
    [
      N('Sogolon is buried in Mema, under a tree, with great honour.'),
      N('The king of Mema bows his head.'),
      KO('Some griots tell it with the messengers coming first. That’s all right.'),
      N('Then the horses are saddled. The road home is open.'),
    ],
    [
      note(
        1,
        'social-studies',
        'people remember loved ones in special ways, then and now',
        'D2.His.2.K-2',
        [
          N('Long ago, and today, people remember loved ones in special ways.'),
          N('A tree, a flower, a story, a song. We remember with care.'),
        ],
        'Heard that people long ago and today remember loved ones with trees, flowers and stories.',
      ),
    ],
  ),

  // ------------------------------------------------ A5-11 Tabon
  sc(
    'a05-11-allies',
    [
      N('Word goes ahead of Sundiata. Kings wait at the iron hills.'),
      FR('I’m Fran Kamara. We wrestled as boys. You always cheated!'),
      SU('I crawled. It was the only way to win.'),
      FR('Tabon is with you!', 'happy'),
      MB('Every king who was afraid is coming up this road.'),
      N('They come with drums and banners. Your Nubbin greets each one.'),
      N('It bows to every king, so low that it rolls over. Thump!'),
    ],
    [
      act(
        5,
        'maths',
        'count to 10',
        'K.CC.A.1',
        'edu:count:to:10',
        [
          N('(Count ten drums together, tapping each one.)'),
          N('One, two, three, four, five, six, seven, eight, nine, ten!'),
        ],
        'Counted to ten on ten drums.',
      ),
    ],
    [
      ch('list', 'Add every king’s name to the list for Balla.', [
        N('By sunset, the list is the longest you’ve ever kept in your head.'),
      ]),
      ch('drum', 'Let your Nubbin play its tune.', [
        N('A drummer from Sibi plays it back, bigger. Soon half the camp knows it.'),
      ]),
    ],
  ),
  sc(
    'a05-11-battle',
    [
      N('From the ridge, the battle is dust, horns and banners.'),
      N('Sundiata’s riders push Sosso’s riders back.'),
      N('A rider in an iron-coloured cloak comes out alone.'),
      SK('You’ve grown, son of the buffalo.'),
      N('He is not there any more. He is on the far hill, watching.'),
      N('Your Nubbin hides its face. Then it peeks out.'),
    ],
    [
      act(
        4,
        'sel',
        'slow breaths when you feel scared',
        'CASEL: Self-management',
        'edu:act:breath:slow',
        [
          N('Your Nubbin is a little scared. (Breathe in slowly, and out.)'),
          N('In… and out. Scared feelings get smaller.'),
        ],
        'Practised slow breathing for a scared feeling.',
      ),
    ],
    [
      ch('hold', 'Hold your Nubbin close.', [
        N('You hold it. Its heart is fast, and so is yours.'),
      ]),
      ch('watch', 'Keep watching Soumaoro.', [
        N('He doesn’t look angry. He looks curious, like a smith testing a blade.'),
      ]),
    ],
  ),
  sc(
    'a05-11-battle-done',
    [
      N('By evening, the pass is Sundiata’s.'),
      N('Sosso’s army goes back over the hills.'),
      N('The horns are quiet. The drums are soft.'),
    ],
    [
      act(
        2,
        'music',
        'loud and soft',
        ELOF_MOVE,
        'edu:clap:loud-soft',
        [
          N('(Clap loud, like the horns. Now clap soft, like the evening.)'),
          N('Loud, loud, loud. Soft… soft… soft.'),
        ],
        'Clapped loud and soft beats.',
      ),
    ],
  ),
  sc(
    'a05-11-council',
    [
      SU('We’ve won the pass. But we can’t touch him.'),
      FR('Arrows don’t find him. He goes from hill to hill.'),
      SU('Then he has a secret. Every great sorcerer has one.'),
      MB('Nobody knows it. Except Soumaoro.'),
      SU('And whoever he trusts.', 'think'),
    ],
    [
      ask(
        3,
        'science',
        'define a problem and look for a solution',
        'K-2-ETS1-1',
        [N('Arrows can’t hurt Soumaoro, and Sundiata needs to know why. What can he do?')],
        [
          o('Ask someone who knows', SU('Yes. Someone close to him may know.'), true),
          o('Give up', N('Giving up doesn’t solve it. Asking someone who knows might.')),
          o('Shout at the hills', N('Shouting won’t help. Asking someone who knows might.')),
        ],
        'Suggested asking someone who knows as a way to solve a problem.',
      ),
    ],
  ),
  sc(
    'a05-11-complete',
    [
      SU('Helper, Balla is in Sosso. He may learn the secret.'),
      SU('So we wait. Waiting is hard.'),
      N('Your Nubbin plays three notes towards Sosso.'),
      N('Nobody answers. It plays them again anyway.'),
    ],
    [
      note(
        1,
        'sel',
        'waiting is hard; counting or playing helps',
        'CASEL: Self-management',
        [
          N('Waiting is hard for everyone, even kings.'),
          N('Counting, playing a tune, or taking a deep breath can help.'),
        ],
        'Heard that waiting is hard and that a calm activity can help.',
      ),
    ],
  ),

  // ------------------------------------------------ A5-12 The Secret
  sc(
    'a05-12-watch',
    [
      N('It’s your turn to keep the night watch. The camp is asleep.'),
      N('Very late, two figures come out of the dark.'),
      N('One is a young woman in a torn cloak. One carries a balafon.'),
      B('Helper. You kept the fire lit.', 'soft'),
      N('Your Nubbin leaps up Balla’s front!'),
      B('I played your tune every night. Soumaoro got tired of it!', 'happy'),
    ],
    [
      note(
        1,
        'science',
        'we see in the dark only when there is light',
        '1-PS4-2',
        [
          N('At night it’s dark. A fire gives light, so you can see.'),
          N('We see things when light bounces off them into our eyes.'),
        ],
        'Heard that we see when there is light, like firelight at night.',
      ),
    ],
  ),
  sc(
    'a05-12-watch-done',
    [
      N('Sundiata comes out of his tent. He says nothing.'),
      N('He just holds on to Balla for a long time.'),
    ],
    [
      note(
        1,
        'sel',
        'naming feelings: relief and joy',
        ELOF_SED,
        [
          N('Sundiata feels happy and relieved. Relieved means a worry has gone.'),
          N('Sometimes a hug says it better than words.'),
        ],
        'Named the feelings of relief and joy, and that a hug can say them.',
      ),
    ],
  ),
  sc(
    'a05-12-list',
    [
      B('Well, helper. You promised. Tell me everything.'),
      N('You tell him: the gate, the road, the game, the goat men.'),
      N('Mema, and the dust, and the mat in the shade.'),
      B('The goat men! I wish I’d seen them.', 'happy'),
      B('Where do you want to start?'),
    ],
    [
      act(
        2,
        'literacy',
        'telling a story in order',
        'RL.K.3',
        'edu:order:journey:gate-road-mema',
        [
          N('(Put it in order: first the gate, next the road, last Mema.)'),
          N('First, next, last. That is how to tell a story.'),
        ],
        'Told the journey in order: gate, road, Mema.',
      ),
    ],
    [
      ch('sogolon', 'Start with Sogolon walking out with her head up.', [
        B('Yes. That’s the one.', 'soft'),
        N('You give him her message. He laughs, then wipes his face.'),
      ]),
      ch('pace', 'Start with Sundiata walking at his mother’s pace.', [
        B('Good. That’s the whole king, right there.', 'think'),
      ]),
      ch('nobody', 'Start with “nobody missing”.', [
        B('A griot’s start. You picked the counting. Keep doing that.', 'happy'),
      ]),
    ],
  ),
  sc(
    'a05-12-list-done',
    [
      B('Now I have it. Now it won’t be lost.', 'soft'),
      B('Thank you, helper. You’ve carried so much.'),
    ],
    [
      ask(
        1,
        'sel',
        'saying thank you',
        'CASEL: Relationship skills',
        [N('Balla says thank you. What do we say when someone helps us?')],
        [
          o('Thank you', B('You’re welcome, helper.', 'happy'), true),
          o('Nothing', N('We can say “thank you”. It makes people feel good.')),
        ],
        'Practised saying thank you when someone helps.',
      ),
    ],
  ),
  sc(
    'a05-12-secret',
    [
      N('In Sundiata’s tent, the young woman lowers her hood.'),
      N('She is Nana Triban, his half-sister.'),
      NT('I stayed in Sosso a long time. I made him trust me.'),
      NT('One night he told me his secret. A white rooster’s spur.'),
      SU('Your mother was unkind to mine. Why help me?'),
      NT('Your mother gave me leaves once. I did not forget.', 'soft'),
    ],
    [
      ask(
        3,
        'science',
        'animal sounds',
        ELOF_SCI,
        [N('A rooster is a boy chicken. What sound does a rooster make?')],
        [
          o('Cock-a-doodle-doo', N('Yes, cock-a-doodle-doo! It wakes the farm up.'), true),
          o('Moo', N('Moo is a cow. A rooster goes cock-a-doodle-doo!')),
          o('Quack', N('Quack is a duck. A rooster goes cock-a-doodle-doo!')),
        ],
        'Matched the rooster with its sound.',
      ),
    ],
  ),
  sc(
    'a05-12-complete',
    [
      N('In the morning, a farmer brings a spur from an old rooster.'),
      N('The bird had died of old age.'),
      N('A smith fixes it to an arrow point. You hold the shaft still.'),
      B('Some say Balla found the secret. Some say Triban. Some say both.'),
      B('Tonight I tell it as it happened. Tomorrow, as it’s told.'),
    ],
    [
      act(
        4,
        'maths',
        'name a triangle',
        'K.G.A.2',
        'edu:tap:shape:triangle',
        [
          N('An arrow point is a triangle: three sides, three corners.'),
          N('(Tap the triangle on the page.)'),
        ],
        'Found and named a triangle shape on an arrow point.',
      ),
    ],
  ),

  // ------------------------------------------------ A5-13 Kirina
  sc(
    'a05-13-fakoli',
    [
      N('A big man comes up the road. Smiths follow, hammers on shoulders.'),
      FK('I’m Fakoli. I made Soumaoro’s iron. Now I’ll make yours.'),
      SU('Why change sides now?'),
      FK('Soumaoro was very unkind to my family.', 'angry'),
      B('In Sosso they’ll call Fakoli a traitor. In Manding, a hero.', 'think'),
      FK('I walked all night. My mouth is dry.'),
    ],
    [
      ask(
        5,
        'sel',
        'doing something kind for a tired traveller',
        ELOF_SED,
        [N('Fakoli has walked far, and he is thirsty. What could you give him?')],
        [
          o('A drink of water', FK('Thank you. That is kind.', 'soft'), true),
          o('A big shout', N('Shouting isn’t kind. A drink of water is.')),
          o('Nothing', N('A kind helper gives a drink. Water is a good gift.')),
        ],
        'Chose to give a tired, thirsty traveller a drink.',
      ),
    ],
    [
      ch('welcome', 'Bring Fakoli water.', [
        FK('Thank you. That’s the first kindness in a long time.', 'soft'),
      ]),
      ch('smiths', 'Show the smiths where to set up their forge.', [
        N('By night, a forge glows at the edge. Your Nubbin warms its feet.'),
      ]),
    ],
  ),
  sc(
    'a05-13-kirina',
    [
      N('The plain of Kirina at dawn. Two armies, banners, horns and drums.'),
      N('Soumaoro rides out alone, in front of his army.'),
      SK('Go home, lion cub.'),
      N('Sundiata draws his bow. A white spur is tied to the arrow.'),
      N('The arrow only brushes Soumaoro’s shoulder.'),
      SK('Who told you?', 'shock'),
    ],
    [
      ask(
        2,
        'maths',
        'positions: in front, behind',
        'K.G.A.1',
        [N('Soumaoro rides in front of his army. Where is the army?')],
        [
          o('Behind him', N('Yes! The army is behind him.'), true),
          o('In front of him', N('He is the one in front. The army is behind.')),
        ],
        'Said that the army is behind the rider, using position words.',
      ),
    ],
  ),
  sc(
    'a05-13-kirina-done',
    [
      N('Soumaoro turns his horse and rides away.'),
      N('His army runs after him. Sundiata’s riders chase it.'),
      B('Leave him to Sundiata. Follow the end of the story, helper.'),
    ],
    [
      note(
        2,
        'literacy',
        'stories have a beginning, a middle and an end',
        'RL.K.3',
        [B('Every story has a beginning, a middle and an end.'), B('We are near the end now.')],
        'Heard that stories have a beginning, a middle and an end.',
      ),
    ],
  ),
  sc(
    'a05-13-cave',
    [
      N('High in the hills, Sundiata stops at a cave.'),
      N('Soumaoro’s black horse stands outside, cropping grass.'),
      SU('He went in. Nobody has come out.'),
      N('The cave is dark. Nothing makes a sound.'),
      B('Some say he’s still in there. Some say he became stone.', 'think'),
      B('Everyone agrees: he was never seen again.'),
    ],
    [
      note(
        5,
        'science',
        'sound bounces back in a cave',
        ELOF_SCI,
        [
          N('Call “hello” into a cave, and “hello” comes back.'),
          N('That is called an echo. Sound bounces off the hard walls.'),
        ],
        'Heard that sound bounces off cave walls and comes back as an echo.',
      ),
    ],
    [
      ch('wait', 'Wait at the cave mouth a little while.', [
        N('You wait, and Sundiata waits too. Only a cool breath of air comes out.'),
      ]),
      ch('tune', 'Let your Nubbin play its tune into the cave.', [
        N('The tune comes back off the walls, the same and not the same.'),
        B('He loved music. That should be remembered too.', 'soft'),
      ]),
    ],
  ),
  sc(
    'a05-13-complete',
    [
      SU('He was my greatest enemy. I don’t want him sung badly.'),
      B('He won’t be. Not by me.'),
      N('Sundiata leads the black horse down the hill.'),
      N('He walks beside it. He does not ride.'),
    ],
    [
      note(
        1,
        'sel',
        'being fair and gentle, even to those who were unkind',
        'CASEL: Social awareness',
        [
          N('Soumaoro was wrong to be unkind. But he loved music.'),
          N('Sundiata is gentle with the horse. The horse did nothing wrong.'),
        ],
        'Heard that we can be fair and gentle, even about someone who was wrong.',
      ),
    ],
  ),

  // ------------------------------------------------ A5-14 The Assembly
  sc(
    'a05-14-assembly',
    [
      N('At Kurukan Fuga, kings and peoples gather in a great ring.'),
      N('There are more people than you can count. And so many drums!'),
      FR('Tabon gives its iron. Its people keep their own ways.'),
      FK('The smiths give their skill. It stays theirs.'),
      SU('Manding is one. A stranger is a guest. Nobody hurts a messenger.'),
      SU('Every person matters. Even the smallest. Even one who crawled.', 'soft'),
    ],
    [
      ask(
        4,
        'sel',
        'a kind rule: welcome guests',
        'CASEL: Social awareness',
        [N('One rule is “a stranger is a guest”.'), N('What do we do when a visitor comes?')],
        [
          o('Welcome them kindly', N('Yes! A guest is welcome.'), true),
          o('Shut the door', N('A guest is to be welcomed, not shut out.')),
        ],
        'Understood the rule that guests are welcomed kindly.',
      ),
    ],
  ),
  sc(
    'a05-14-assembly-done',
    [
      B('Tellers still argue about the exact words said here.'),
      B('The rules agreed here are remembered. They are called the Manden Charter.'),
      N('The ring roars. They name him Mansa, king of kings.'),
      N('Kolonkan is crying happy tears.'),
    ],
    [
      note(
        1,
        'social-studies',
        'old rules are still remembered today',
        'D2.His.2.K-2',
        [
          B('That was about 800 years ago. People still remember these rules today.'),
          B('Griots still tell Sundiata’s story. It is a living story.'),
        ],
        'Heard that the rules and the story of Sundiata are still remembered about 800 years later.',
      ),
    ],
  ),
  sc(
    'a05-14-ask',
    [
      N('At the edge of the ring, Balla tunes his balafon. He looks happy.'),
      B('Sundiata made my family his griots for ever.'),
      N('Your Nubbin climbs on the frame and sits, as it did on day one.'),
      B('I’ll tell this story ten thousand times, a little different each time.'),
      B('But there is one thing I’ll never leave out.'),
      B('Helper, what should I never leave out?'),
    ],
    [
      note(
        4,
        'sel',
        'choosing what matters most, and saying why',
        ELOF_APP,
        [
          N('Every storyteller chooses what matters most.'),
          N('You are choosing too. There is no wrong answer.'),
        ],
        'Chose what matters most in a story, and heard there is no wrong answer.',
      ),
    ],
    [
      ch(
        'waiting',
        'That it took him seven years to stand, and that was all right.',
        [B('Yes. I’ll tell the dust before the rod, and the years nobody hurried him.', 'soft')],
        { 'a05-remember': 'waiting' },
      ),
      ch(
        'mother',
        'That his mother was the strongest person in it.',
        [B('Sogolon. She goes in the first line, every time.', 'happy')],
        { 'a05-remember': 'mother' },
      ),
      ch(
        'sister',
        'That Nana Triban chose to bring the secret.',
        [B('Yes. People forget her. I won’t.', 'think')],
        { 'a05-remember': 'sister' },
      ),
      ch(
        'enemy',
        'That the enemy loved music.',
        [B('The hardest to sing, and the truest. I’ll keep Soumaoro whole.', 'soft')],
        { 'a05-remember': 'enemy' },
      ),
    ],
  ),
  sc(
    'a05-14-complete',
    [
      N('The ring falls quiet. Balla stands to tell Sundiata’s story.'),
      B('My helper’s round friend will play us in.'),
      N('Your Nubbin plays the hunters’ tune. The whole ring stamps along!'),
      SU('My hunting tune! The one they played when I came home.', 'happy'),
      ...A14_END,
    ],
    [
      act(
        2,
        'music',
        'keep a steady beat',
        ELOF_MOVE,
        'edu:act:stamp:beat',
        [N('(Stamp a steady beat with your feet. Stamp, stamp, stamp, stamp.)')],
        'Stamped a steady beat along with the hunters’ tune.',
      ),
    ],
  ),
];

// ================================================================== variants (lullaby)
const EDU_A05_SPROUT_VARIANTS_BASE: EduScene[] = [
  sc(
    'a05-09-chamber-done-lullaby',
    [
      N('Balla plays Sogolon’s lullaby. On this balafon it is huge and slow.'),
      N('Your Nubbin sways, and the owls close their eyes. Heavy feet climb the stairs.'),
      N('Soumaoro fills the doorway, in a cloak the colour of iron.'),
      SK('My mother hummed that. At night, when she thought I was asleep.', 'soft'),
      ...A09_SPARED,
    ],
    [
      note(
        3,
        'music',
        'music can remind us of people we love',
        ELOF_SED,
        [
          N('A tune can bring back a memory.'),
          N('Soumaoro remembered his mother. Music can remind us of people we love.'),
        ],
        'Heard that music can bring back memories of people we love.',
      ),
    ],
  ),
  sc(
    'a05-14-complete-lullaby',
    [
      N('The ring falls quiet. Balla stands to tell Sundiata’s story.'),
      B('My helper’s round friend will play us in.'),
      N('Your Nubbin plays Sogolon’s lullaby. Thousands of people go quiet.'),
      KO('That’s our mother’s grinding tune. She never knew anyone heard it.', 'soft'),
      SU('She’d be cross to come first. Then she’d be very pleased.', 'happy'),
      ...A14_END,
    ],
    [
      act(
        2,
        'music',
        'a slow, gentle beat',
        ELOF_MOVE,
        'edu:act:sway:slow',
        [N('(Sway slowly from side to side, like the lullaby.)')],
        'Swayed to a slow, gentle beat.',
      ),
    ],
  ),
];

// ================================================================== variants (Balla's telling)
/** A5-14: Balla's first line of the telling, by what you asked him never to leave out (a05-remember). */
const A14_TELLING: Record<'waiting' | 'mother' | 'sister' | 'enemy', Line[]> = {
  waiting: [
    B('This is the story of a boy nobody hurried.'),
    SU('You start there?', 'shock'),
    B('My helper asked me to. Ask my helper!', 'happy'),
  ],
  mother: [
    B('This is the story of Sogolon, who carried it all.'),
    SU('You start with my mother?', 'shock'),
    B('My helper asked me to. Ask my helper!', 'happy'),
  ],
  sister: [
    B('This is the story of Nana Triban, who chose.'),
    SU('You start there?', 'shock'),
    B('My helper asked me to. Ask my helper!', 'happy'),
  ],
  enemy: [
    B('This is the story of Sundiata, and an enemy who loved music.'),
    SU('You start there?', 'shock'),
    B('My helper asked me to. Ask my helper!', 'happy'),
  ],
};

/** Clones a complete scene with Balla's telling spliced in before the shared ending. */
const withTelling = (base: EduScene, pick: keyof typeof A14_TELLING, ofId: string): EduScene => {
  const at = base.lines.length - A14_END.length;
  const extra = A14_TELLING[pick];
  return {
    ...base,
    id: `sprout:${ofId}`,
    of: ofId,
    lines: [...base.lines.slice(0, at), ...extra, ...base.lines.slice(at)],
    lessons: base.lessons.map((l, i) => ({
      ...l,
      id: `sprout:${ofId}-l${i + 1}`,
      after: l.after >= at ? l.after + extra.length : l.after,
    })),
  };
};

const A14_PICKS = ['waiting', 'mother', 'sister', 'enemy'] as const;
const A14_HUNTERS = SCENES.find((s) => s.of === 'a05-14-complete')!;
const A14_LULLABY = EDU_A05_SPROUT_VARIANTS_BASE.find((s) => s.of === 'a05-14-complete-lullaby')!;

export const EDU_A05_SPROUT_VARIANTS: EduScene[] = [
  ...EDU_A05_SPROUT_VARIANTS_BASE,
  ...A14_PICKS.map((p) => withTelling(A14_HUNTERS, p, `a05-14-complete-${p}`)),
  ...A14_PICKS.map((p) => withTelling(A14_LULLABY, p, `a05-14-complete-lullaby-${p}`)),
];

// ================================================================== the quests
/** Groups scenes under their quests, and gives each quest its journal text. */
const quest = (
  n: number,
  title: string,
  goals: Record<string, { goal: string; hint: string }>,
): EduQuest => {
  const num = String(n).padStart(2, '0');
  const of = `a05-${num}`;
  return {
    id: `sprout:${of}`,
    of,
    band: 'sprout',
    title,
    goals,
    scenes: SCENES.filter((s) => s.of.startsWith(`${of}-`)),
  };
};

export const EDU_A05_SPROUT: EduQuest[] = [
  quest(1, 'The Hunters’ Prophecy', {
    'a05-01-s1': {
      goal: 'Step into the red page and find Balla.',
      hint: 'Touch the page. Follow the balafon.',
    },
    'a05-01-s2': {
      goal: 'Listen to the hunter, under the big tree.',
      hint: 'Stay by Balla. Listen quietly.',
    },
  }),
  quest(2, 'Sogolon', {
    'a05-02-s1': { goal: 'Sit by the fire and hear a story.', hint: 'Find Balla at the fire.' },
    'a05-02-s2': { goal: 'Walk with Sogolon to the king.', hint: 'Meet the hunters at the gate.' },
  }),
  quest(3, 'The Boy Who Couldn’t Walk', {
    'a05-03-s1': {
      goal: 'Visit Sogolon’s house. Sit with her son.',
      hint: 'It is the small house at the back.',
    },
    'a05-03-s2': {
      goal: 'Go with Sogolon to ask for leaves.',
      hint: 'Walk across the yard with her.',
    },
  }),
  quest(4, 'The Iron Rod', {
    'a05-04-s1': {
      goal: 'Run to the smiths with a message.',
      hint: 'The forges are by the river.',
    },
    'a05-04-s2': {
      goal: 'Watch the boy stand.',
      hint: 'Stand with Balla at the edge of the crowd.',
    },
    'a05-04-s3': { goal: 'Gather leaves for Sogolon.', hint: 'The leaves are round the baobab.' },
  }),
  quest(5, 'The Griot', {
    'a05-05-s1': {
      goal: 'Watch Balla become Sundiata’s griot.',
      hint: 'Go to the hunters’ clearing.',
    },
    'a05-05-s2': {
      goal: 'Help your Nubbin learn a tune.',
      hint: 'Sit your Nubbin at the balafon.',
    },
  }),
  quest(6, 'Exile', {
    'a05-06-s1': { goal: 'Keep watch in the garden at night.', hint: 'Hide behind the vines.' },
    'a05-06-s2': { goal: 'Say goodbye to Balla.', hint: 'Find him at the palace gate.' },
    'a05-06-s3': {
      goal: 'Leave the town with Sogolon’s family.',
      hint: 'Meet them at the west gate.',
    },
  }),
  quest(7, 'Kingdom to Kingdom', {
    'a05-07-s1': { goal: 'Watch Sundiata play wori.', hint: 'Sit by the game board.' },
    'a05-07-s2': { goal: 'Listen to the king of Wagadou.', hint: 'Sit quietly at the back.' },
    'a05-07-s3': { goal: 'Walk the long road with the family.', hint: 'Keep pace with Sogolon.' },
  }),
  quest(8, 'Mema', {
    'a05-08-s1': { goal: 'Watch the horsemen ride out.', hint: 'Climb the mound by the wall.' },
    'a05-08-s2': { goal: 'Sit with Sogolon.', hint: 'She is on the mat in the shade.' },
  }),
  quest(9, 'The Sorcerer King', {
    'a05-09-s1': {
      goal: 'Find Balla in the tower of Sosso.',
      hint: 'Look for him inside the tower.',
    },
    'a05-09-s2': {
      goal: 'Stand by Balla in the secret room.',
      hint: 'Stay behind Balla. Don’t touch the owls.',
    },
    'a05-09-s3': { goal: 'Watch from the tower window.', hint: 'Stand with Balla.' },
  }),
  quest(10, 'The Call Home', {
    'a05-10-s1': { goal: 'Help Kolonkan at her stall.', hint: 'Mind the stall with her.' },
    'a05-10-s2': {
      goal: 'Pack a basket for the king.',
      hint: 'Find three things in the old house.',
    },
  }),
  quest(11, 'Tabon', {
    'a05-11-s1': { goal: 'Welcome the kings to camp.', hint: 'Stand at the camp gate with Bory.' },
    'a05-11-s2': { goal: 'Watch from the ridge.', hint: 'Stay with the drummers.' },
    'a05-11-s3': {
      goal: 'Sit at the council fire.',
      hint: 'The big fire is in the middle of camp.',
    },
  }),
  quest(12, 'The Secret', {
    'a05-12-s1': { goal: 'Keep the night watch.', hint: 'Sit by the watch fire and wait.' },
    'a05-12-s2': { goal: 'Tell Balla what you kept for him.', hint: 'Sit with Balla by the fire.' },
    'a05-12-s3': { goal: 'Hear Nana Triban’s secret.', hint: 'Go into Sundiata’s tent.' },
  }),
  quest(13, 'Kirina', {
    'a05-13-s1': { goal: 'Welcome Fakoli and his smiths.', hint: 'Meet him at the camp gate.' },
    'a05-13-s2': { goal: 'Watch the arrow at Kirina.', hint: 'Stand with Balla on the rise.' },
    'a05-13-s3': { goal: 'Follow Sundiata to the cave.', hint: 'Climb the rocky path.' },
  }),
  quest(14, 'The Assembly', {
    'a05-14-s1': {
      goal: 'Go to the great gathering.',
      hint: 'Walk with Balla to the wide clearing.',
    },
    'a05-14-s2': {
      goal: 'Choose what Balla should remember.',
      hint: 'Find him where the griots sit.',
    },
  }),
];

/** Every `edu:` check string used in this file. */
export const CHECKS: string[] = [
  'edu:count:houses:5',
  'edu:act:tap:hands',
  'edu:count:barks:3',
  'edu:clap:syllables:sogolon',
  'edu:count:years:7',
  'edu:count:helpers:6',
  'edu:act:push-pull:hands',
  'edu:act:arms:wide',
  'edu:clap:tempo:fast-slow',
  'edu:order:tune:first-next-last',
  'edu:count:women:9',
  'edu:order:lessons:patience-listening-pace',
  'edu:count:horsemen:20',
  'edu:say:memory:one',
  'edu:count:floors:7',
  'edu:sort:basket:pots-straw-feathers',
  'edu:count:to:10',
  'edu:act:breath:slow',
  'edu:clap:loud-soft',
  'edu:order:journey:gate-road-mema',
  'edu:tap:shape:triangle',
  'edu:act:stamp:beat',
  'edu:act:sway:slow',
];
