/**
 * The Learning Grove, reader band (ages 7–10): Atlas A5 The Lion of Mali.
 *
 * Source: atlas-a05.ts. One EduScene per original scene (every step scene, every done scene, every
 * complete scene and both lullaby variants), id `reader:<original id>`. Every choice keeps its original
 * id and `set`. See EDU-STYLE.md.
 *
 * What it teaches (the outline’s Learning Grove angle):
 *   - the Mali Empire on a map; West Africa; the Sahel and the savanna;
 *   - griots and oral history: how a story is kept in memory and why tellings differ;
 *   - the balafon and West African music (vibration, pitch, resonators, tempo);
 *   - the Manden Charter, proclaimed at Kurukan Fuga, which UNESCO lists as intangible cultural heritage;
 *   - the later Mali of Mansa Musa and Timbuktu’s libraries;
 *   - plus iron-working, forces, baobabs, owls, echoes, wori (a seed game), money-style sums, time
 *     intervals, similes and metaphors, point of view, fairness, and grief.
 *
 * - No line is lifted from Niane’s telling or Eisner’s book; every line is original.
 * - Care notes kept: a living tradition (Kouyaté griot families still tell it, the Sosso-Bala is still
 *   kept in Niagassola, Guinea); tellings that differ are named; Sogolon is strong and the court is wrong
 *   to laugh; Soumaoro is never a monster; battles are dust, horns and banners only; death is said
 *   plainly with comfort straight after, never as sleeping. The one mention of Islam (Mansa Musa’s
 *   journey to Mecca, in a05-14-complete) is factual and brief, and is flagged for the advisers.
 * - Nubbins and animals never speak.
 */
import type { EduQuest, EduScene, Lesson, GlossaryEntry } from './types';
import type { Line, Choice } from '../config/story';

type Mood = NonNullable<Line['mood']>;

const say =
  (who: string) =>
  (text: string, mood?: Mood): Line =>
    mood ? { who, text, mood } : { who, text };

// ---------------------------------------------------------------- speakers
const N = say('narrator');
const Y = say('you');
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
type LessonIn = Omit<Lesson, 'id'>;
type Opt = NonNullable<Lesson['options']>[number];

const o = (label: string, reply: Line | Line[], best = false): Opt => {
  const r = Array.isArray(reply) ? reply : [reply];
  return best ? { label, best, reply: r } : { label, reply: r };
};

/** A think question: every answer is honoured, none is marked best. */
const think = (label: string, reply: Line | Line[]): Opt => ({
  label,
  reply: Array.isArray(reply) ? reply : [reply],
});

const ask = (
  after: number,
  domain: Lesson['domain'],
  skill: string,
  standard: string,
  prompt: Line[],
  options: Opt[],
  parentNote: string,
): LessonIn => ({ domain, skill, standard, kind: 'ask', after, prompt, options, parentNote });

const note = (
  after: number,
  domain: Lesson['domain'],
  skill: string,
  standard: string,
  lines: Line[],
  parentNote: string,
): LessonIn => ({ domain, skill, standard, kind: 'notice', after, lines, parentNote });

const act = (
  after: number,
  domain: Lesson['domain'],
  skill: string,
  standard: string,
  check: string,
  lines: Line[],
  parentNote: string,
): LessonIn => ({ domain, skill, standard, kind: 'do', after, check, lines, parentNote });

/** Builds `reader:<of>` and numbers its lessons `reader:<of>-l1`, `-l2`, in play order. */
const scene = (of: string, lines: Line[], lessons: LessonIn[], choices?: Choice[]): EduScene => {
  const id = `reader:${of}`;
  const s: EduScene = {
    id,
    of,
    band: 'reader',
    lines,
    lessons: [...lessons]
      .sort((a, b) => a.after - b.after)
      .map((l, i) => ({ id: `${id}-l${i + 1}`, ...l })),
  };
  if (choices) s.choices = choices;
  return s;
};

const ch = (id: string, label: string, then: Line[], set?: Choice['set']): Choice =>
  set ? { id, label, set, then } : { id, label, then };

const gloss = (word: string, meaning: string, of: string): GlossaryEntry => ({
  word,
  meaning,
  scene: `reader:${of}`,
});

// ---------------------------------------------------------------- shared lines
/** A5-9: Soumaoro is stopped by the tune (both tune variants). */
const A09_SPARED: Line[] = [
  SK('Nobody touches that balafon.', 'angry'),
  N(
    'Balla doesn’t stop. He plays the tune to its end, then moves into a praise song for Soumaoro.',
  ),
  N('It names the forges, his fathers and the walls of Sosso, and gets every one right.'),
  SK('Hm.'),
  SK(
    'Dankaran Touman sent you as a gift, griot. I think he gave me more than he knew. You stay here, and you play for me.',
    'think',
  ),
  N(
    'Balla bows. When he straightens, he looks at you once, and you understand: he isn’t free, but he isn’t finished.',
  ),
  B('There’s your door, apprentice. It didn’t open the room. It opened him.', 'happy'),
];

/** A5-14: the end of the complete scene and the way home (both tune variants). */
const A14_END: Line[] = [
  B(
    'Eight hundred years from now, my children’s children will still be telling this. And they’ll argue about it.',
    'happy',
  ),
  B('That’s how you know a story is alive. Nobody argues about a dead one.'),
  N('He puts the little balafon into your arms, and the beaters into your Nubbin’s hands.'),
  N('You think about what you chose to keep, and what a griot would keep for you.'),
  B('Go home, apprentice. Remember us properly.', 'soft'),
  N('The red earth goes soft under your feet, then smooth, then paper.'),
  N(
    'You are back in the Grove with Nova’s atlas on your knee. From under the cover a tune keeps going, and your Nubbin taps it out, very nearly in time.',
  ),
];

// ================================================================== the scenes
const SCENES: EduScene[] = [
  // ------------------------------------------------ A5-1 The Hunters’ Prophecy
  scene(
    'a05-01-page',
    [
      N(
        'Nova’s atlas falls open at a page the colour of red earth, patterned black and white like cloth dyed with mud.',
      ),
      N(
        'In the corner, in Nova’s hand: “Griots have told this for eight hundred years, and no two tell it alike.”',
      ),
      N('Under that: “Listen to more than one.”'),
      N(
        'The earth warms under your palm. Then it is dust, and round thatched houses, and the smell of millet smoke.',
      ),
      B(
        'You came out of a picture. My father said someone would, one day. He says a lot of things.',
        'shock',
      ),
      B(
        'I’m Balla Fasséké, son of Doua, who is griot to the king. One day I’ll be a griot too. Today I carry his things.',
      ),
      B('You could carry some. A griot needs an apprentice, and I haven’t got one yet.'),
      N(
        'Your Nubbin is already sitting on his balafon, a row of wooden keys with gourds hung underneath.',
      ),
    ],
    [
      note(
        3,
        'social-studies',
        'Manding and the Mali Empire on the map: West Africa, and how old this story is',
        'D2.Geo.2.K-2',
        [
          N(
            'This page is set in Manding, in West Africa, south of the Sahara desert. Today its lands lie in Mali and Guinea.',
          ),
          N(
            'The story tells how the Mali Empire began, about 800 years ago. Today’s Mali is named after it, and griots across the region still tell it.',
          ),
        ],
        'Learned that the story is set in Manding, in West Africa, where the Mali Empire began about 800 years ago, and that griots still tell it.',
      ),
    ],
    [
      ch('what', 'Ask what a griot does.', [
        B('We remember. Who married whom, who fought where, who was brave and who only said so.'),
        B(
          'A king without a griot is a king nobody will remember. It makes kings polite to us.',
          'happy',
        ),
      ]),
      ch('carry', 'Offer to carry the balafon.', [
        B('Gently. It’s older than my father, and it knows it.'),
      ]),
    ],
  ),
  scene(
    'a05-01-page-done',
    [
      B(
        'Come. The king sits under the silk-cotton tree in the mornings. Something is going to happen there today.',
      ),
      N('You don’t know how he knows. By the look of him, he doesn’t either.'),
    ],
    [
      ask(
        1,
        'literacy',
        'a think question: what do you predict, and why?',
        'RL.3.3',
        [
          N(
            'Balla says something will happen today, and can’t explain how he knows. What do you think is going on?',
          ),
        ],
        [
          think(
            'He has a griot’s feeling for stories',
            B('A good guess. A griot learns to sense when a story is about to start.'),
          ),
          think('He has heard a rumour', B('Could be. News travels fast in a king’s town.')),
          think(
            'He is just guessing',
            B('That’s a fair answer. To be honest, I’m not sure myself.'),
          ),
        ],
        'Made a prediction from a clue in the text and gave a reason for it (no single right answer).',
      ),
    ],
  ),
  scene(
    'a05-01-court',
    [
      N(
        'King Naré Maghan sits in the shade of a great silk-cotton tree, with his court around him.',
      ),
      N('Beside him stands Doua, who seems to be listening to everything at once.'),
      N(
        'A stranger comes in off the road: a hunter, with a bow on his back and a bag of cowrie shells at his belt.',
      ),
      HU('I’m a hunter of Sangaran, king. I’ve come because the shells told me to.'),
      K('Then sit, hunter. A king should hear what the shells say, even when he doesn’t like it.'),
      N('The hunter throws the cowries on a goatskin and looks at them for a long time.'),
      HU('Two hunters will come to your gate with a woman. She is strong. Marry her.', 'think'),
      HU(
        'She will give you a son, and that son will make the name of Manding last as long as the sun does.',
      ),
    ],
    [
      note(
        7,
        'social-studies',
        'oral history: stories carried by memory and the word “prophecy”',
        'D2.His.2.K-2',
        [
          N('A prophecy is a statement about what will happen in the future.'),
          N('Stories like this one were passed down aloud for centuries.'),
          N(
            'That is called oral history: the past kept alive by spoken words instead of books. Griots train for years to remember it.',
          ),
        ],
        'Learned that a prophecy is a statement about the future, and what oral history is.',
      ),
    ],
    [
      ch('king', 'Watch the king’s face.', [
        N(
          'The king says nothing. He turns a kola nut over in his fingers, slowly, like a man deciding to remember.',
        ),
      ]),
      ch('balla', 'Watch Balla.', [
        N(
          'Balla’s lips are moving. He is saying the hunter’s words over to himself, so that he will have them.',
        ),
      ]),
    ],
  ),
  scene(
    'a05-01-court-done',
    [
      DO('Hunter, the king thanks you. Eat before you go, and eat well.'),
      B('Did you get all that? Say it back to me tonight. Then we’ll both have it.'),
    ],
    [
      ask(
        1,
        'literacy',
        'ways to remember something heard once',
        'CASEL: Self-management',
        [N('You have to remember the hunter’s words by tonight. Which helps most?')],
        [
          o(
            'Say it aloud in order, again and again',
            B('Yes. Repeating in order is how griots keep a long telling safe.'),
            true,
          ),
          o(
            'Hope you remember it',
            B('Hope is nice, but practice works better. Say it aloud, in order.'),
          ),
          o(
            'Think about something else',
            B('Your mind will wander off. Say it aloud, again and again.'),
          ),
        ],
        'Chose repetition aloud, in order, as a way to remember something.',
      ),
    ],
  ),
  scene(
    'a05-01-complete',
    [
      N(
        'That night, by the fire, you say the hunter’s words back to Balla. You get most of them, and he fills in the rest.',
      ),
      B('That’s the first thing a griot learns. Hear it once, keep it always.'),
      B(
        'Some tellers leave the hunter out, and start with the two brothers and the buffalo. My father starts here.',
      ),
      B(
        'He says a story should begin with a promise. Then everybody listens to find out if it’s kept.',
        'happy',
      ),
      N(
        'Balla taps one key of the balafon with his thumb. It makes a low, round sound, like water moving in a gourd.',
      ),
      N(
        'Your Nubbin taps a shorter key. The sound comes out higher and flatter, and much more pleased with itself.',
      ),
      B('We’ll work on it.'),
    ],
    [
      ask(
        5,
        'science',
        'vibration and pitch: longer bars make lower notes',
        '1-PS4-1',
        [
          N(
            'Balla’s key sounds low and round, and your Nubbin’s sounds higher. Which key is longer?',
          ),
        ],
        [
          o(
            'Balla’s key, the lower one',
            N('Yes. Longer bars vibrate more slowly, and slower vibrations make lower notes.'),
            true,
          ),
          o(
            'Your Nubbin’s key',
            N(
              'It’s the other way round: longer keys shake slowly, giving low notes. Short keys give high ones.',
            ),
          ),
        ],
        'Learned that vibrations make sound, and that longer balafon keys make lower notes.',
      ),
    ],
  ),

  // ------------------------------------------------ A5-2 Sogolon
  scene(
    'a05-02-fire',
    [
      B(
        'Before the strangers reach the gate, you should know where they’ve been. Sit. This is a fire story.',
      ),
      B(
        'In the land of Do there was a buffalo nobody could hunt. It trampled the fields, and the best hunters came home with nothing.',
      ),
      B(
        'Two brothers went after it. On the road they met an old woman, hungry and alone, and they shared their food with her.',
      ),
      B(
        'She told them the truth: she was the buffalo. Because they’d been kind, she told them how to win.',
      ),
      B(
        'She asked one thing. The king of Do would offer them any girl they liked. They were to choose the plainest. Her name was Sogolon.',
        'soft',
      ),
      N('Your Nubbin has crept so close to the fire that its feet are warm. It doesn’t move them.'),
      B(
        'Some tellers say the old woman was Sogolon’s aunt. Some say she was Sogolon’s own spirit, walking about without her.',
      ),
      B(
        'My father says it doesn’t matter which. What matters is that she was strong, and that it came to the girl.',
      ),
    ],
    [
      ask(
        7,
        'literacy',
        'a think question: why do tellings differ?',
        'RL.3.6',
        [
          N(
            'Balla tells two versions of who the old woman was, and won’t say which is true. Why might a griot do that?',
          ),
        ],
        [
          think(
            'Each version teaches something',
            B('A fair answer. Each version shows a different thing about Sogolon.'),
          ),
          think(
            'Nobody knows for sure',
            B('That could be it. Stories passed by mouth change a little in every telling.'),
          ),
          think(
            'So listeners can choose',
            B('A good thought. A griot trusts the listener to think too.'),
          ),
        ],
        'Thought about why a storyteller might share more than one version (no single right answer).',
      ),
      ask(
        4,
        'sel',
        'kindness is repaid',
        'CASEL: Social awareness',
        [N('What made the old woman help the two brothers?')],
        [
          o(
            'They shared their food with her',
            B('Yes. They were kind when they didn’t need to be.'),
            true,
          ),
          o(
            'They begged her for help',
            N('They didn’t beg. They shared their food, and she chose to help.'),
          ),
        ],
        'Noticed that the brothers’ kindness is why the old woman helped them.',
      ),
    ],
    [
      ch('which', 'Ask which one Balla believes.', [
        B('I believe whichever one I’m telling. That’s the job.', 'happy'),
      ]),
      ch('kind', 'Say the brothers won by being kind.', [
        B('Yes. Write that one down in your head. It comes back.', 'think'),
      ]),
    ],
  ),
  scene(
    'a05-02-fire-done',
    [
      N('Out on the road a dog barks, and then another. Balla is on his feet before the third.'),
      B('That’s them. Come on.'),
    ],
    [
      note(
        0,
        'science',
        'animals’ senses: dogs hear more than people',
        '4-LS1-2',
        [
          N('Dogs can hear much softer and higher sounds than people can.'),
          N(
            'That’s why the village dogs notice travellers long before anyone else. Their ears are an early warning.',
          ),
        ],
        'Learned that dogs hear better than people, which is why they bark at faraway visitors.',
      ),
    ],
  ),
  scene(
    'a05-02-gate',
    [
      N(
        'Two dusty hunters come through the gate. Between them walks a young woman, stooped, with a hump on her back and very bright eyes.',
      ),
      BR('We bring her to the king of Manding. We were told he would know why.'),
      N(
        'People come out of their doorways to look. Someone whispers, and someone else doesn’t bother to whisper.',
      ),
      SO('I’ve been looked at before. It doesn’t wear me out the way they hope.'),
      BR(
        'She walked from Do on her own feet. We offered her a donkey. She said the donkey looked tired.',
      ),
      SO('It did look tired.'),
    ],
    [
      ask(
        5,
        'sel',
        'what helps someone who is being stared at',
        'CASEL: Social awareness',
        [N('People stare at Sogolon as she walks. What would help her most?')],
        [
          o(
            'Walk beside her',
            SO('A stranger from a picture, and a small round thing. Good company.'),
            true,
          ),
          o(
            'Stare to see what she looks like',
            N('Staring is exactly what hurts. Walking beside her says “you are not alone”.'),
          ),
          o(
            'Whisper to a neighbour',
            N('Whispering is another way of staring. Walking beside her is kinder.'),
          ),
        ],
        'Chose to walk beside someone who is being stared at, rather than join in staring.',
      ),
    ],
    [
      ch('beside', 'Walk beside her.', [
        N(
          'You fall in beside her. She glances at you, and something in her shoulders lets go a little.',
        ),
        SO(
          'A stranger from a picture, and a small round thing. Good. I like the company of odd things.',
        ),
      ]),
      ch('bundle', 'Offer to carry her bundle.', [
        SO('No. It’s mine, and it’s light. But thank you for asking instead of taking it.'),
        N(
          'Your Nubbin takes hold of one corner anyway, and walks the rest of the way like that, helping.',
        ),
      ]),
    ],
  ),
  scene(
    'a05-02-gate-done',
    [
      N(
        'Under the silk-cotton tree, the court laughs out loud when it sees her. The king doesn’t.',
      ),
      K('Doua. The hunter of Sangaran. Do you remember what he said?'),
      DO('Every word, my king.'),
    ],
    [
      ask(
        2,
        'literacy',
        'what a character’s silence tells us',
        'RL.3.3',
        [N('The court laughs, but the king doesn’t. What does that tell you about him?')],
        [
          o(
            'He takes the prophecy seriously',
            N('Yes. He’s thinking about the hunter’s words, not about how she looks.'),
            true,
          ),
          o('He is bored', N('A bored king wouldn’t be asking Doua to recall the prophecy.')),
          o(
            'He is angry at Sogolon',
            N('He asks about the prophecy, not about her. He’s listening, not judging.'),
          ),
        ],
        'Read a character’s motive from his actions: the king takes the prophecy seriously.',
      ),
    ],
  ),
  scene(
    'a05-02-complete',
    [
      K('Then I know why you brought her to me. Sogolon of Do, will you be my wife?'),
      N('The laughing stops all at once, like a pot taken off the fire.'),
      SO(
        'I will. And I’ll thank your court to stop staring. I haven’t grown a second head.',
        'angry',
      ),
      N(
        'Doua is the first to laugh, warmly this time. Then the king laughs too, and the rest of the court has to.',
      ),
      B(
        'Remember that. She made them laugh with her, not at her, in one breath. My father has been trying to do that for twenty years.',
        'happy',
      ),
    ],
    [
      ask(
        3,
        'sel',
        'how a character handles being laughed at',
        'CASEL: Self-awareness',
        [N('Sogolon turns laughing-at into laughing-with. What gave her that dignity?')],
        [
          o(
            'She spoke up, honestly and with humour',
            B('Yes. Dignity means keeping your self-respect, even when others don’t.'),
            true,
          ),
          o(
            'She ignored everybody',
            N('She didn’t ignore them. She answered, calmly and with a joke.'),
          ),
          o(
            'She got angry and shouted',
            N('Her words were sharp, but she stayed calm. That calm is dignity.'),
          ),
        ],
        'Described how Sogolon kept her dignity: speaking up honestly, calmly and with humour.',
      ),
    ],
  ),

  // ------------------------------------------------ A5-3 The Boy Who Couldn’t Walk
  scene(
    'a05-03-house',
    [
      N(
        'The atlas page turns a little, the way a griot skips ahead. A wedding, a birth and seven rainy seasons pass in a breath.',
      ),
      N(
        'Sogolon’s son is seven years old. He sits in the dust outside her door, broad and solemn, and he crawls wherever he goes.',
      ),
      B(
        'His name is Mari Djata. One day everyone will call him Sundiata. He doesn’t talk much. He eats like three boys and he watches everything.',
      ),
      N(
        'Your Nubbin toddles over and sits down in front of him. The boy looks at it for a long time.',
      ),
      N('Then he puts out one hand, very slowly, and pats it on the head.'),
      SO('He doesn’t do that for many people. Your little round friend is honoured.', 'soft'),
      B(
        'The old king died in the dry season, with my father beside him. Dankaran Touman is king now, and his mother rules.',
        'sad',
      ),
      B('Some people say the hunter was wrong. They say it where Sogolon can hear.', 'sad'),
    ],
    [
      note(
        0,
        'science',
        'wet and dry seasons in West Africa',
        '3-ESS2-1',
        [
          N(
            'In much of West Africa the year is split into a rainy season and a dry season, rather than summer and winter.',
          ),
          N(
            'Seven rainy seasons means seven years. The rains grow the crops, which are harvested as the dry season begins.',
          ),
        ],
        'Learned that much of West Africa has rainy and dry seasons, and that seven rainy seasons means seven years.',
      ),
      ask(
        4,
        'literacy',
        'reading a character’s trust from what he does',
        'RL.3.3',
        [N('Sundiata doesn’t pat many people. How can you tell he trusts your Nubbin?')],
        [
          o(
            'He chose to touch it, slowly and gently',
            N('Yes. Actions can show feelings that words don’t.'),
            true,
          ),
          o('He said so out loud', N('He didn’t say a thing. What he did tells us.')),
        ],
        'Inferred a character’s feeling from his actions rather than his words.',
      ),
    ],
    [
      ch('sit', 'Sit down in the dust with the boy.', [
        N(
          'You sit, and nobody says anything. The boy goes on watching the yard, and you watch it with him.',
        ),
        N(
          'After a while you notice he isn’t waiting for anything. He’s just looking, very hard, at all of it.',
        ),
      ]),
      ch('ask', 'Ask Sogolon if he’ll walk one day.', [
        SO('He will walk when he walks. I don’t pull up seedlings to make them grow faster.'),
        SO('And until then, he is my son, and that is already a great deal.'),
      ]),
    ],
  ),
  scene(
    'a05-03-house-done',
    [
      B(
        'Mark this, apprentice. He isn’t waiting to become someone. He already is someone. He’s just not finished.',
        'think',
      ),
    ],
    [
      ask(
        0,
        'sel',
        'a think question: is slow the same as behind?',
        'CASEL: Self-awareness',
        [
          N(
            'Balla says Sundiata is already someone, only not finished. Is going slowly the same as being behind?',
          ),
        ],
        [
          think(
            'No. Everyone grows at their own pace',
            B('A thoughtful answer. A seed isn’t behind a tree. It’s a seed.'),
          ),
          think(
            'Sometimes, but it can still be fine',
            B('That’s honest. Being slower can feel like being behind, even when it isn’t.'),
          ),
          think(
            'I’m not sure',
            B('That’s fair. It’s the kind of question griots think about for years.'),
          ),
        ],
        'Reflected on whether going slowly means being behind (no single right answer).',
      ),
    ],
  ),
  scene(
    'a05-03-leaves',
    [
      SO('I need a few baobab leaves for the sauce. Ours are gone. Sassouma has plenty.'),
      N(
        'Queen Sassouma sits in her own yard with her women, under a baobab heavy with leaves. She sees Sogolon coming a long way off.',
      ),
      SO('Sister. A handful of leaves, for my son’s supper.'),
      SA(
        'Take them, of course. My son picked them for me himself, this morning. He climbed up to fetch them. On his own two legs.',
      ),
      SA('Your son, I hear, still fetches things the way a lizard does.'),
      N('The women laugh. Sogolon takes the leaves, and her hand doesn’t shake, quite.'),
    ],
    [
      note(
        1,
        'science',
        'baobabs drop their leaves in the dry season to save water',
        '3-LS4-3',
        [
          N(
            'A baobab is deciduous: it loses all its leaves in the dry season, and grows them again when the rains come.',
          ),
          N(
            'Dropping leaves saves water. In many parts of West Africa, fresh baobab leaves are cooked in sauces, which is why a tree full of them is worth asking for.',
          ),
        ],
        'Learned that baobabs lose their leaves in the dry season to save water, and that the leaves are eaten.',
      ),
    ],
    [
      ch('quiet', 'Say nothing, and walk out beside Sogolon.', [
        N(
          'You walk out beside her. She keeps her back straight all the way to her own door, which is a long way, for her.',
        ),
      ]),
      ch('look', 'Look Sassouma in the eye.', [
        N(
          'You look at Sassouma. She looks back, cool and pleasant, as if you were a cloud that might rain.',
        ),
        B('Good. She’ll remember your face. Mind you, that may not be good.', 'think'),
      ]),
    ],
  ),
  scene(
    'a05-03-leaves-done',
    [
      N(
        'At her own door, Sogolon sits down on the step and cries, quietly, with her face in the leaves.',
      ),
      N('Her son crawls over to her. Your Nubbin sits on her other side and leans.'),
    ],
    [
      ask(
        1,
        'sel',
        'how to comfort someone who is crying',
        'CASEL: Social awareness',
        [N('Sogolon is crying. Which is the best way to comfort her?')],
        [
          o(
            'Sit close and stay',
            N('Yes. Being there is the comfort; you don’t have to fix anything.'),
            true,
          ),
          o(
            'Tell her to stop crying',
            N('Crying is a way of letting sadness out. Sit close and let her.'),
          ),
          o(
            'Change the subject',
            N('Changing the subject can make a sad person feel unheard. Stay close instead.'),
          ),
        ],
        'Chose to sit close and stay with someone who is crying.',
      ),
    ],
  ),
  scene(
    'a05-03-complete',
    [
      SU('Mother. Why are you crying?'),
      N('Sogolon looks up. So does Balla, and so, it seems, does the whole yard.'),
      SO(
        'Because of leaves. Because of a woman with a sharp tongue. Because of you, my son.',
        'sad',
      ),
      SU('Then dry your eyes, Mother. Today I stand up.', 'angry'),
      SU(
        'Send to the forges. Ask the smiths for a rod of iron, so heavy it takes all of them to carry it.',
      ),
      N(
        'Balla’s mouth is open. He shuts it, and you see him say the words over to himself, quickly, so he will have them.',
      ),
    ],
    [
      ask(
        4,
        'maths',
        'multiply to change years into months',
        '3.OA.A.3',
        [
          N(
            'Sundiata crawled for seven years, and there are 12 months in a year. How many months is that?',
          ),
        ],
        [
          o(
            '84 months',
            N('Yes: 7 × 12 = 84. Eighty-four months of crawling, and he never stopped trying.'),
            true,
          ),
          o('19 months', N('That’s 7 + 12. We need 7 groups of 12: 7 × 12 = 84.')),
          o('70 months', N('Close, but 7 × 10 is 70. A year has 12 months: 7 × 12 = 84.')),
        ],
        'Multiplied 7 × 12 to find the number of months in seven years.',
      ),
    ],
  ),

  // ------------------------------------------------ A5-4 The Iron Rod
  scene(
    'a05-04-forge',
    [
      N(
        'The smiths’ quarter smells of charcoal and hot water. Hammers ring on every side, each on its own beat.',
      ),
      N(
        'The master smith is a big, quiet man with burn marks up both forearms. He listens to the whole message without stopping work.',
      ),
      SM('The heaviest rod we’ve ever made. For the crawling boy.'),
      SM(
        'My father forged a rod years ago, for a day like this. He said someone would come asking. He kept it under the bellows.',
      ),
      N(
        'It takes six of his apprentices to drag it out. It is as long as two of you and dark as a wet night.',
      ),
      SM(
        'Smiths keep secrets, apprentice. That’s half of what we are. The other half is patience.',
        'think',
      ),
    ],
    [
      note(
        4,
        'science',
        'heating makes iron soft; cooling makes it hard again',
        '2-PS1-4',
        [
          SM(
            'A forge is a hearth, hot enough to make iron glow. Bellows pump air in to make the charcoal burn even hotter.',
          ),
          SM(
            'Hot iron goes soft, so I can bend and hammer it. When it cools, it goes hard again. That change can be done again and again.',
          ),
        ],
        'Learned that heating softens iron and cooling hardens it, and that bellows feed the fire with air.',
      ),
    ],
    [
      ch('help', 'Take hold of the rod with the apprentices.', [
        N(
          'You take hold, and it is so heavy your arms forget they are yours. Your Nubbin pushes from behind, which helps exactly nothing.',
        ),
      ]),
      ch('ask', 'Ask if a boy can really lift that.', [
        SM('No. A boy can’t. That’s the point of asking for it.'),
      ]),
    ],
  ),
  scene(
    'a05-04-forge-done',
    [
      N(
        'The whole quarter downs hammers and follows the rod up the hill. So do half the children in Niani.',
      ),
      B(
        'Everyone wants to see it. Half of them want to laugh. Stay close to me and keep your ears open.',
      ),
    ],
    [
      ask(
        0,
        'maths',
        'multiply to find a total',
        '3.OA.A.3',
        [
          N(
            'Six apprentices drag the rod, and say each one could drag 15 kilograms alone. How much can they drag together?',
          ),
        ],
        [
          o('90 kilograms', N('Yes: 6 × 15 = 90. And still it took all six to move it.'), true),
          o('21 kilograms', N('That’s 6 + 15. Six groups of 15 is 6 × 15 = 90.')),
          o('60 kilograms', N('Try again: 6 × 10 = 60, and 6 × 5 = 30. Together, 90.')),
        ],
        'Multiplied 6 × 15 to find the combined pull of six apprentices (an in-story sum).',
      ),
    ],
  ),
  scene(
    'a05-04-stand',
    [
      N(
        'The smiths lay the rod down in front of Sogolon’s door. The crowd goes quiet in a ring around it.',
      ),
      N('The boy crawls to it. He takes it in both hands, and sets one end in the dust.'),
      N(
        'He pulls, and his arms shake. Sweat runs down his face, and still he pulls, slowly, hand over hand, up the rod.',
      ),
      N(
        'He is on his knees, then on one foot. Then he is on both feet, with the iron rod bent in his hands like a hunter’s bow.',
      ),
      B('He’s standing.', 'shock'),
      N(
        'Then Balla is singing. It is a praise song, his own, made on the spot, and the whole hill takes it up.',
      ),
      SO('My son is standing.', 'happy'),
    ],
    [
      ask(
        3,
        'science',
        'balanced and unbalanced forces',
        '3-PS2-1',
        [
          N(
            'Gravity pulls Sundiata down towards the ground. For him to pull himself up the rod, what must be true?',
          ),
        ],
        [
          o(
            'His pull must be bigger than gravity’s pull on him',
            N('Yes. When forces are unbalanced, things move, and his muscles finally won.'),
            true,
          ),
          o(
            'Gravity must switch off',
            N('Gravity never switches off. His pull has to be stronger than the pull down.'),
          ),
          o(
            'The rod must pull him up',
            N('The rod is just a handle. It’s Sundiata’s pull that wins over gravity.'),
          ),
        ],
        'Learned that an object moves when one force is bigger than the other (unbalanced forces).',
      ),
    ],
    [
      ch('cheer', 'Cheer.', [
        N(
          'You cheer. Your Nubbin cheers, too, which is a high round squeak, and runs three times round his feet.',
        ),
      ]),
      ch('sogolon', 'Look at Sogolon.', [
        N(
          'Sogolon isn’t cheering; she has her hands over her mouth. She has waited seven years, and she is still waiting, one breath more.',
        ),
      ]),
    ],
  ),
  scene(
    'a05-04-stand-done',
    [
      B(
        'Some tellers say the first rods snapped in his hands, and he leaned on his mother’s stick in the end. Some say it was a baobab branch.',
      ),
      B(
        'I was there. It was iron. It bent. But I’ll tell you the stick version, too, because that one’s also true.',
      ),
    ],
    [
      ask(
        1,
        'literacy',
        'a think question: can two tellings both be true?',
        'RL.3.6',
        [
          N(
            'Balla says the stick version is also true. How can two different tellings both be true?',
          ),
        ],
        [
          think(
            'Each one holds a true part of the story',
            B('A fair answer. The truth can have more than one side.'),
          ),
          think(
            'They can’t both be true',
            B('That’s a fair answer too. Historians also ask which telling is most likely.'),
          ),
          think(
            'It depends what “true” means',
            B('A sharp thought. Is “true” about facts, or about what the story means?'),
          ),
        ],
        'Reflected on how differing tellings can both hold truth, and compared a teller’s view with their own (no single right answer).',
      ),
    ],
  ),
  scene(
    'a05-04-baobab',
    [
      SU('Mother. You wanted baobab leaves.'),
      N(
        'He walks, a little stiffly, to the edge of the town where a young baobab grows. He puts his arms around it.',
      ),
      N(
        'In Niane’s telling, and plenty of others, he pulls it up by the roots and carries it home.',
      ),
      N('He sets it down at his mother’s door. The leaves shake all over the yard.'),
      SU('From now on, the women of Niani will come to you for leaves.'),
      SO('That’s enough for one day, my son. Sit down, before you fall down.', 'happy'),
    ],
    [
      note(
        2,
        'science',
        'baobabs: huge trunks that store water, live for centuries',
        '3-LS4-3',
        [
          N(
            'A real baobab has a trunk so wide it can store thousands of litres of water. That helps it survive long dry seasons.',
          ),
          N(
            'Baobabs grow slowly and can live for hundreds of years, some for over a thousand. Pulling one up is the kind of thing only a legend could do.',
          ),
        ],
        'Learned that baobabs store water in their trunks, grow slowly and can live for centuries.',
      ),
    ],
  ),
  scene(
    'a05-04-baobab-done',
    [
      N('You and your Nubbin gather the leaves into baskets. There are a great many.'),
      N('Across the yard, Queen Sassouma’s door is shut. Nobody saw it close.'),
    ],
    [
      ask(
        0,
        'maths',
        'divide into equal groups',
        '3.OA.A.3',
        [
          N(
            'You gather 24 leaves and share them equally between 4 baskets. How many go in each basket?',
          ),
        ],
        [
          o('6 leaves', N('Yes. 24 ÷ 4 = 6, because 4 × 6 = 24.'), true),
          o('20 leaves', N('That’s 24 − 4. Dividing means equal groups: 24 ÷ 4 = 6.')),
          o('8 leaves', N('Check it: 4 × 8 = 32, too many. 4 × 6 = 24, so it’s 6.')),
        ],
        'Divided 24 leaves into 4 equal baskets: 24 ÷ 4 = 6.',
      ),
    ],
  ),
  scene(
    'a05-04-complete',
    [
      B('From today they’ll call him Sogolon’s Djata. Say it quickly, and you get Sundiata.'),
      B(
        'Djata means lion. So that’s his mother and the lion, both, in one name. Some tellers make it from other words. They’re not wrong either.',
      ),
      N(
        'Sogolon gives you a baobab seed, round and hard as a pebble, and folds your fingers over it.',
      ),
      SO('For your own yard. They grow very slowly. Don’t let that worry you.', 'soft'),
      N('Your Nubbin tries to eat it, and you take it back. Sogolon laughs out loud.'),
    ],
    [
      ask(
        1,
        'literacy',
        'metaphors: calling a person a lion',
        'L.4.5',
        [
          N(
            'Calling Sundiata a lion is a metaphor, which says one thing is another. What does it tell us about him?',
          ),
        ],
        [
          o(
            'He is brave and strong',
            B('Yes. A metaphor lends the lion’s qualities to the person.'),
            true,
          ),
          o(
            'He has a mane',
            N('A metaphor isn’t about looks here. It’s about the lion’s courage and strength.'),
          ),
          o(
            'He lives on the grassland',
            N('He doesn’t literally. The metaphor borrows what a lion is like: brave and strong.'),
          ),
        ],
        'Explained what the metaphor “lion” says about Sundiata’s character.',
      ),
    ],
  ),

  // ------------------------------------------------ A5-5 The Griot
  scene(
    'a05-05-given',
    [
      N(
        'Sundiata is ten now, and hunts with the older boys. Every hunter in Manding has already started telling stories about him.',
      ),
      N(
        'In the hunters’ clearing, Doua puts his hand on his son’s shoulder and walks him forward.',
      ),
      DO(
        'The old king asked for this before he died. Every king has a griot. My son will be yours.',
      ),
      SU('I don’t need someone to sing at me.'),
      DO('No. You need someone to remember you. You’ll do things you’ll forget. He won’t.'),
      B(
        'And I’ll tell you when you’re being a fool. That’s in it too. Nobody mentions that part.',
        'happy',
      ),
      SU('Then you’d better stay close. I’ll need telling.'),
      B(
        'In my father’s telling, the old king gave me to Sundiata while he was still crawling. I tell it now, because now is when I knew.',
      ),
    ],
    [
      ask(
        4,
        'literacy',
        'a character’s motive: why a king needs a griot',
        'RL.3.3',
        [
          N(
            'Sundiata says he doesn’t need someone to sing at him. Why does Doua say he does need a griot?',
          ),
        ],
        [
          o(
            'To remember him, and tell him the truth',
            DO('Yes. A good griot is memory and conscience together.'),
            true,
          ),
          o(
            'To keep him entertained',
            N('Songs are part of it, but Doua says it’s about being remembered.'),
          ),
          o(
            'To carry his things',
            N('That’s a small job. Doua is talking about something much bigger.'),
          ),
        ],
        'Identified why a king needs a griot: to remember him and tell him the truth.',
      ),
    ],
  ),
  scene(
    'a05-05-given-done',
    [
      N(
        'Sundiata and Balla shake hands, very formally, like two old men. Then Sundiata trips Balla into the grass.',
      ),
      B('He’s going to be a great king. Write that down.', 'sad'),
    ],
    [
      ask(
        1,
        'maths',
        'time intervals: subtract ages',
        '2.OA.A.1',
        [
          N(
            'Sundiata stood up at age 7, and now he is 10. How many years have passed since he stood?',
          ),
        ],
        [
          o('3 years', N('Yes: 10 − 7 = 3. Three years of walking, hunting and growing.'), true),
          o('17 years', N('That’s 10 + 7. To find how long has passed, subtract: 10 − 7 = 3.')),
          o('7 years', N('Seven is how old he was. The gap to 10 is 10 − 7 = 3.')),
        ],
        'Subtracted ages to find a time interval: 10 − 7 = 3 years.',
      ),
    ],
  ),
  scene(
    'a05-05-lesson',
    [
      B(
        'Now. If you’re my apprentice, your round friend is too. It’s been staring at this balafon for ten years.',
      ),
      N('He puts a pair of beaters into your Nubbin’s paws. They are nearly as long as it is.'),
      B('Wood on wood. The gourds underneath sing back. You don’t hit the key. You ask it.'),
      N(
        'Your Nubbin asks it, and the key answers, round and low. Your Nubbin looks up at you with enormous pride.',
      ),
      B('Good. One tune, to start. A griot has a thousand, but everyone has a first.'),
      B(
        'There’s the hunters’ tune, quick and stamping, the one they play for Sundiata when he comes home with meat.',
      ),
      B(
        'Or there’s the one Sogolon hums at night, when she’s grinding millet. She doesn’t know anybody hears it. Everybody does.',
        'soft',
      ),
      B('Which one?'),
    ],
    [
      note(
        3,
        'science',
        'resonators: the gourds make the sound louder',
        '4-PS3-2',
        [
          B(
            'A struck key only shakes a little. The gourd underneath is a resonator: air inside it shakes along and makes the note louder.',
          ),
          B(
            'That’s why a balafon’s gourds are different sizes. Each one is matched to the key above it.',
          ),
        ],
        'Learned that gourd resonators amplify balafon notes by vibrating air.',
      ),
      {
        domain: 'music',
        skill: 'tempo: fast and slow',
        kind: 'ask',
        after: 6,
        prompt: [
          N(
            'Balla describes two tunes. Which one has the faster tempo? (Tempo means the speed of the music.)',
          ),
        ],
        options: [
          o('The hunters’ tune', B('Yes. Quick and stamping. Fast tempo.'), true),
          o(
            'Sogolon’s lullaby',
            N('The lullaby is slow and rocking, like a grinding stone. That’s a slow tempo.'),
          ),
        ],
        parentNote: 'Identified the faster tune and learned that tempo means the speed of music.',
      },
    ],
    [
      ch(
        'hunters',
        'The hunters’ tune.',
        [
          N(
            'Balla plays it once through: quick, stamping, a tune for a lot of feet coming home at dusk.',
          ),
          N(
            'Your Nubbin plays it back, in roughly the right order. Its feet stamp, too, which isn’t part of the tune, but helps.',
          ),
          B(
            'That’s a tune for a crowd. You’ll never be lonely with that one in your hands.',
            'happy',
          ),
        ],
        { 'a05-tune': 'hunters' },
      ),
      ch(
        'lullaby',
        'Sogolon’s lullaby.',
        [
          N(
            'Balla plays it once through: slow, rocking, the sound of a grinding stone going round and round in the dark.',
          ),
          N('Your Nubbin plays it back, very carefully, as if it might wake somebody.'),
          B('That’s a tune for one person. Whoever hears it will think it’s for them.', 'soft'),
        ],
        { 'a05-tune': 'lullaby' },
      ),
    ],
  ),
  scene(
    'a05-05-lesson-done',
    [
      N(
        'Your Nubbin plays its tune all evening. By night it can play it all the way through without stopping.',
      ),
      N('Across the yard, Sogolon’s door is open, and she is sitting just inside it, listening.'),
    ],
    [
      ask(
        0,
        'maths',
        'number patterns that follow a rule',
        '4.OA.C.5',
        [
          N(
            'Practising, your Nubbin plays 2 notes, then 4, then 6, then 8. If the pattern continues, how many notes next?',
          ),
        ],
        [
          o('10 notes', N('Yes. The rule is “add 2 each time”: 2, 4, 6, 8, 10.'), true),
          o('9 notes', N('Look at the gaps: 2, 4, 6, 8. Each time we add 2, so next is 10.')),
          o(
            '16 notes',
            N('That would be doubling the last. The pattern adds 2 each time: next is 10.'),
          ),
        ],
        'Found the rule (+2) in a number pattern and continued it.',
      ),
    ],
  ),
  scene(
    'a05-05-complete',
    [
      B(
        'Keep that tune. Don’t trade it, don’t lose it. A tune you know by heart is a door you can always find in the dark.',
      ),
      B('I can’t tell you which door yet. I’ll tell you when we get there.', 'think'),
      N(
        'Your Nubbin plays the first three notes again, just to check they’re still there. They are.',
      ),
    ],
    [
      ask(
        1,
        'literacy',
        'a think question: what does Balla’s metaphor mean?',
        'L.4.5',
        [
          N(
            'Balla says a tune you know by heart is a door you can always find in the dark. What do you think he means?',
          ),
        ],
        [
          think(
            'Music can lead you home when you’re lost or scared',
            B('A fair answer. A tune can be a place to go.'),
          ),
          think(
            'Something learned by heart is always with you',
            B('Yes, that’s one way. It can’t be taken away, even in the dark.'),
          ),
          think(
            'It will open something later in the story',
            B('That’s a good hunch. I did say I’d tell you which door.'),
          ),
        ],
        'Interpreted a metaphor in their own words (no single right answer).',
      ),
    ],
  ),

  // ------------------------------------------------ A5-6 Exile
  scene(
    'a05-06-garden',
    [
      B(
        'Sassouma has paid nine old women to come into Sogolon’s garden tonight. Sassouma thinks it’s a secret. The cooks told me before breakfast.',
      ),
      B(
        'They have powers, these nine. Some say they were sent to harm him. Some say only to steal, and make him angry enough to harm them.',
      ),
      N(
        'The garden is silver with moonlight. Nine bent shapes come through the gap in the fence and begin to fill their baskets with gourds and greens.',
      ),
      N('Sundiata stands up out of the vines. The nine freeze.'),
      SU('Grandmothers. You don’t need to creep. Take what you want.', 'soft'),
      SU(
        'If you’d asked in daylight, I’d have given you more. Here, these ones are better. Those ones are still green.',
      ),
      N(
        'He fills their baskets for them. Your Nubbin, catching on, brings them a gourd each, with difficulty.',
      ),
    ],
    [
      note(
        2,
        'science',
        'the Moon shines because it reflects sunlight',
        '1-ESS1-1',
        [
          N(
            'The Moon has no light of its own. It looks silver because it reflects light from the Sun.',
          ),
          N(
            'On a clear night with a bright Moon, you can see a whole garden in silver and shadow, even with no fire at all.',
          ),
        ],
        'Learned that the Moon reflects sunlight rather than making its own light.',
      ),
    ],
  ),
  scene(
    'a05-06-garden-done',
    [
      EL('We were paid to make you angry, son of Sogolon. You’ve made us ashamed instead.', 'sad'),
      EL(
        'From tonight, we watch over you. Go carefully. The one who sent us won’t stop at nine old women.',
      ),
    ],
    [
      ask(
        1,
        'sel',
        'a think question: why did kindness work better than anger?',
        'CASEL: Responsible decision-making',
        [
          N(
            'The nine women came to make Sundiata angry, but he was kind, and they changed sides. Why do you think that worked?',
          ),
        ],
        [
          think(
            'They had expected a fight and had no answer to kindness',
            EL('A sharp answer. Kindness can leave an unkind plan with nothing to push against.'),
          ),
          think(
            'They realised what they were doing was wrong',
            EL(
              'A fair answer. Sometimes people need to see themselves clearly before they change.',
            ),
          ),
          think(
            'It may not always work',
            EL('That’s honest. It worked here. Kindness isn’t magic, but it often opens a door.'),
          ),
        ],
        'Thought about why kindness can change someone’s behaviour better than anger (no single right answer).',
      ),
    ],
  ),
  scene(
    'a05-06-sent',
    [
      N(
        'In the morning there are horses at the palace gate, loaded with gifts. Balla stands beside them with his balafon on his back.',
      ),
      DT(
        'The king of Sosso grows strong. I send him gifts, and I send him a griot, to sing him our friendship. Balla Fasséké will go.',
      ),
      SU('You can’t take a man’s griot. He’s mine. My father gave him to me.', 'angry'),
      DT('Your father’s dead, brother. I am king.'),
      N('Balla puts a hand on Sundiata’s arm. Sundiata shakes with anger, and doesn’t move.'),
      B('Apprentice. Listen. I can’t go with him now, so you’ll have to.'),
      B(
        'Wherever he goes, remember it for me. All of it. The good and the foolish. Then one day you’ll tell it back, and I’ll have it.',
        'soft',
      ),
    ],
    [
      ask(
        4,
        'literacy',
        'a character’s motive: why Balla goes quietly',
        'RL.3.3',
        [N('Balla doesn’t refuse to go. Why does he let himself be sent away?')],
        [
          o(
            'A fight now would hurt Sundiata and he’d lose',
            B('Yes. Knowing when not to fight is a kind of strength.'),
            true,
          ),
          o(
            'He is afraid of the king',
            N('Look at what he says: it’s about protecting Sundiata, not himself.'),
          ),
          o(
            'He wants to go to Sosso',
            N('He doesn’t. He goes because refusing would put Sundiata in danger.'),
          ),
        ],
        'Worked out Balla’s motive: going quietly protects Sundiata from a fight he would lose.',
      ),
    ],
    [
      ch('promise', 'Promise him.', [
        B('Good. Then I’m not leaving him. I’m only going ahead.', 'soft'),
      ]),
      ch('come', 'Ask why he won’t refuse.', [
        B(
          'Because if I refuse, Sundiata will fight his brother for me, here, in the gate, and lose. He isn’t ready yet.',
        ),
        B('A griot has to know when to be carried off quietly. Remember that, too.', 'sad'),
      ]),
    ],
  ),
  scene(
    'a05-06-sent-done',
    [
      N(
        'The horses go out of the gate. Your Nubbin plays the first three notes of its tune after them, as loud as it can.',
      ),
      N('Far down the road, faintly, the balafon on Balla’s back answers with the next three.'),
    ],
    [
      note(
        1,
        'science',
        'sound gets quieter as it travels',
        '4-PS3-2',
        [
          N(
            'Sound is energy that travels in waves. As the waves spread out and travel further, they get weaker.',
          ),
          N(
            'That’s why Balla’s answer is faint: it has come a long way. Close up it would sound loud.',
          ),
        ],
        'Learned that sound energy spreads out and weakens with distance.',
      ),
    ],
  ),
  scene(
    'a05-06-leave',
    [
      SO(
        'We go tonight. While my son is angry, he isn’t safe here, and while we stay, nor is anyone who loves him.',
      ),
      N(
        'There are five of them at the west gate: Sogolon, Sundiata, his sisters Kolonkan and little Djamarou, and his half-brother Manding Bory.',
      ),
      MB(
        'My mother says I should stay. I said I’m going where Djata goes. She cried, and then she packed me food.',
        'sad',
      ),
      KO('Walk quietly. Someone on the road out of Niani may be listening.'),
      N(
        'Sundiata looks back once at the town, at the dark shape of the baobab at his mother’s door.',
      ),
      SU('I’ll come back. Remember I said so.'),
    ],
    [
      ask(
        5,
        'social-studies',
        'compass directions: facing west, what is behind you?',
        'D2.Geo.2.K-2',
        [
          N(
            'At the west gate, the family walks out facing west, away from the town. In which direction is the town behind them?',
          ),
        ],
        [
          o(
            'East',
            N('Yes. East is the opposite of west, so the town is behind them to the east.'),
            true,
          ),
          o(
            'North',
            N(
              'North is to their right as they face west. Behind them, the opposite of west, is east.',
            ),
          ),
          o('West', N('West is where they’re heading. The town is opposite: east.')),
        ],
        'Used compass directions: the opposite of west is east.',
      ),
    ],
    [
      ch('earth', 'Pick up a handful of Niani’s red earth.', [
        N(
          'You tie it in a corner of your cloth. It is very light, and it feels heavier as the night goes on.',
        ),
      ]),
      ch('hold', 'Take Djamarou’s hand.', [
        N(
          'Djamarou takes your hand without looking up, and holds on, and doesn’t let go until the sun is up.',
        ),
      ]),
    ],
  ),
  scene(
    'a05-06-complete',
    [
      N(
        'By sunrise Niani is a smudge behind you. Nobody talks, and even your Nubbin walks without bouncing.',
      ),
      N(
        'You find you are counting things to remember: the shape of the hills, the colour of the sky, who carried what.',
      ),
      SU('You’re doing what Balla does. Your lips move.'),
      Y('I promised him.'),
      SU(
        'Then remember this. My mother walked out of her husband’s town with her head up. Tell him that first.',
      ),
    ],
    [
      note(
        1,
        'literacy',
        'memory tricks: group things in threes',
        'CASEL: Self-management',
        [
          N('You noticed the hills, the sky and who carried what. Three things.'),
          N(
            'Griots, like many people, remember best by grouping things in small sets, and saying them in the same order every time.',
          ),
        ],
        'Learned that grouping information into small sets helps memory.',
      ),
    ],
  ),

  // ------------------------------------------------ A5-7 Kingdom to Kingdom
  scene(
    'a05-07-djedeba',
    [
      N(
        'The first court on the road is Djedeba. Its king is friendly, too friendly, and very fond of games.',
      ),
      DJ(
        'Sit, son of Sogolon. Play me at wori. Seeds into pits, round and round. If you win, you have my hospitality.',
      ),
      DJ('If you lose, well. We’ll talk about that if it happens.', 'happy'),
      N(
        'The board is carved wood with two rows of hollows. The king’s seeds click into them very fast.',
      ),
      KO('He plays with a ring on his finger, brother. Watch the ring, not the seeds.'),
      N(
        'Kolonkan says it so softly that only you, Sundiata and your Nubbin hear. Your Nubbin immediately stares at the ring.',
      ),
      N('Sundiata watches the ring. Then he starts to win.'),
    ],
    [
      note(
        0,
        'social-studies',
        'wori belongs to a family of seed games played across Africa and beyond',
        'D2.His.2.K-2',
        [
          N(
            'Wori is one of a large family of “sowing” games, played with seeds or stones in rows of pits, across Africa and parts of Asia for many centuries.',
          ),
          N(
            'Players take turns, scooping seeds and dropping one in each pit round the board. It rewards counting and planning ahead.',
          ),
        ],
        'Heard that wori is one of an old family of seed-sowing board games played across Africa and Asia.',
      ),
      ask(
        3,
        'maths',
        'odd and even',
        '2.OA.C.3',
        [N('A pit on the wori board holds 7 seeds. Is 7 odd or even?')],
        [
          o(
            'Odd',
            N(
              'Yes: seven seeds make three pairs, with one left over. Odd numbers always have one left over.',
            ),
            true,
          ),
          o(
            'Even',
            N('Pair them up: 2, 4, 6 seeds make three pairs, and one is left over. So 7 is odd.'),
          ),
        ],
        'Decided that 7 is odd by pairing objects.',
      ),
    ],
    [
      ch('count', 'Count the seeds for Sundiata.', [
        N(
          'You count under your breath, and Sundiata nods once without looking at you. He was already counting, but he likes the company.',
        ),
      ]),
      ch('nubbin', 'Let your Nubbin keep staring at the ring.', [
        N(
          'The king notices, and becomes very uncomfortable. He moves the ring to the other hand, then into his sleeve.',
        ),
      ]),
    ],
  ),
  scene(
    'a05-07-djedeba-done',
    [
      DJ(
        'You play like an old man, son of Sogolon. You don’t hurry and you don’t forgive a mistake.',
        'think',
      ),
      DJ('Stay the night. Then go on. I don’t want a boy like you near my throne.'),
    ],
    [
      ask(
        1,
        'literacy',
        'vocabulary in context: hospitality',
        'L.3.4',
        [N('The king promised “hospitality” to Sundiata if he won. What does hospitality mean?')],
        [
          o(
            'Welcoming guests kindly, with food and a bed',
            N('Yes. Hospitality is looking after visitors, even strangers.'),
            true,
          ),
          o(
            'A game played with seeds',
            N('That’s wori. Hospitality is what the king offers: food, a bed and a welcome.'),
          ),
          o(
            'A fee to enter a town',
            N('Not a fee. Hospitality is a welcome given freely to guests.'),
          ),
        ],
        'Worked out the meaning of “hospitality” from context.',
      ),
    ],
  ),
  scene(
    'a05-07-wagadou',
    [
      N(
        'Wagadou is old: older than Manding, older than anything you have seen on this page. Its king is kind, and tired, and careful.',
      ),
      WG(
        'Sogolon’s family is welcome. Your father was my friend. Sit at my council, young man, and learn how a king listens.',
      ),
      N(
        'All day, people come to the king: a farmer with a quarrel about a field, a widow, two traders with one goat between them.',
      ),
      N(
        'The king hears every one of them right to the end, even the goat men, who take a long time.',
      ),
      SU('Why do you let them talk so long, king? You knew the answer straight away.'),
      WG(
        'So did they, most of them. They came to be heard. A king who answers too quickly only rules people. He doesn’t keep them.',
      ),
    ],
    [
      note(
        1,
        'social-studies',
        'Wagadou, the early kingdom often called ancient Ghana',
        'D2.His.2.K-2',
        [
          N(
            'Wagadou is the name the Soninke people gave to a great kingdom of the western Sahel. Outsiders called it Ghana, though it was not where today’s Ghana is.',
          ),
          N(
            'It grew rich on the trade in gold and salt, and it was already ancient when Mali began.',
          ),
        ],
        'Learned that Wagadou (often called ancient Ghana) was an early West African kingdom built on the gold and salt trade.',
      ),
      ask(
        5,
        'sel',
        'a think question: what does the king mean?',
        'CASEL: Relationship skills',
        [
          N(
            'The king says a king who answers too quickly only rules people, but doesn’t keep them. What do you think he means?',
          ),
        ],
        [
          think(
            'People stay loyal when they feel listened to',
            WG('A fair answer. Being heard builds trust.'),
          ),
          think(
            'Quick answers can be wrong answers',
            WG('That’s true as well. Listening first gives better decisions.'),
          ),
          think(
            'He’s just tired and likes to talk',
            WG('Ha. That’s a fair guess. But I think there is more in it.'),
          ),
        ],
        'Interpreted a king’s advice about listening in their own words (no single right answer).',
      ),
    ],
  ),
  scene(
    'a05-07-wagadou-done',
    [
      N('That night Sundiata sits up late, turning the king’s words over like seeds in a pit.'),
      SU('Did you get that? Put it in the list for Balla. Put it near the top.'),
    ],
    [
      ask(
        0,
        'literacy',
        'similes and metaphors',
        'L.4.5',
        [N('“Turning the king’s words over like seeds in a pit.” Is that a simile or a metaphor?')],
        [
          o(
            'A simile, because it uses “like”',
            N(
              'Yes: a simile compares two things using “like” or “as”. A metaphor says one thing is another.',
            ),
            true,
          ),
          o(
            'A metaphor, because it compares',
            N('Both compare, but a simile uses “like” or “as”, as this one does.'),
          ),
        ],
        'Identified a simile by the word “like”.',
      ),
    ],
  ),
  scene(
    'a05-07-road',
    [
      N(
        'Months of road. Thorn trees, dry river beds, a sky so big it makes your Nubbin hold on to your ankle.',
      ),
      N('Sogolon walks more slowly every week. Nobody mentions it.'),
      MB('Djata, we could get there by the new moon if we pushed on.'),
      SU(
        'We go at my mother’s pace. That’s the fastest pace there is, because it’s the one where we all arrive.',
      ),
      N(
        'Sundiata drops back and walks beside his mother, and so the whole family walks at the back.',
      ),
      KO(
        'He used to be the slowest of us. Now he’s the one who waits. I think that’s the same lesson, turned round.',
        'think',
      ),
    ],
    [
      note(
        0,
        'science',
        'the Sahel: dry land with thorny trees and seasonal rivers',
        '2-LS4-1',
        [
          N(
            'The road crosses the Sahel, a belt of dry grassland south of the Sahara. Trees there are thorny and spaced apart, and many rivers only run in the rainy season.',
          ),
          N('Plants and animals that live there are adapted to long dry spells.'),
        ],
        'Learned that the Sahel is a dry habitat with thorn trees and seasonal rivers.',
      ),
      ask(
        4,
        'maths',
        'distance, speed and time',
        '4.MD.A.2',
        [
          N(
            'At Sogolon’s pace the family walks 3 kilometres in an hour. How far do they go in 6 hours?',
          ),
        ],
        [
          o(
            '18 kilometres',
            N('Yes: 3 × 6 = 18. Slow and steady adds up, and everyone arrives.'),
            true,
          ),
          o('9 kilometres', N('That’s 3 + 6. Each hour adds 3 km, six times: 3 × 6 = 18.')),
          o('36 kilometres', N('Check it: 6 × 6 is 36. They walk 3 km each hour, so 3 × 6 = 18.')),
        ],
        'Multiplied speed by time (3 km/h × 6 h) to find a distance.',
      ),
    ],
    [
      ch('carry', 'Offer to carry Sogolon’s water gourd.', [
        SO(
          'Thank you. My hands are glad. My pride isn’t, but my pride can walk on its own.',
          'happy',
        ),
      ]),
      ch('tune', 'Ask your Nubbin to play its tune as you walk.', [
        N(
          'Your Nubbin plays the tune on its own knees, tapping. The family walks to it without meaning to, all at the same pace.',
        ),
      ]),
    ],
  ),
  scene(
    'a05-07-complete',
    [
      N(
        'Seven years on the road go by in a turn of the page. Sundiata is a man now, broad as a door.',
      ),
      KO(
        'Tellers argue about this road. Some send us to Tabon first. Some leave Djedeba out. Some add three more kings.',
      ),
      KO('I was on it, and I couldn’t tell you the order either. Roads are like that.', 'happy'),
      SU(
        'What I learned was in the order it came. Patience, then listening, then my mother’s pace. Remember it that way.',
      ),
    ],
    [
      ask(
        3,
        'literacy',
        'theme: what the road teaches',
        'RL.4.2',
        [N('Patience, listening, and walking at a mother’s pace. What is the theme of the road?')],
        [
          o(
            'Going slowly and together can be a strength',
            SU('Yes. That’s what I carry out of it.'),
            true,
          ),
          o(
            'Faster travel is always better',
            N('The story says the opposite: the slowest pace was the one where everyone arrived.'),
          ),
          o(
            'Kings never listen',
            N('Kings in this chapter listen carefully. The theme is about patience and care.'),
          ),
        ],
        'Identified the theme of the chapter: slowness and togetherness as strength.',
      ),
    ],
  ),

  // ------------------------------------------------ A5-8 Mema
  scene(
    'a05-08-army',
    [
      N('Mema is a city on a river, with a king who loves horses and has a great many of them.'),
      MT(
        'Sogolon’s son. I’m told you can ride, and hunt, and that you don’t lose your temper. Can you lead?',
      ),
      SU('I don’t know yet, king. Give me twenty horsemen and I’ll find out.'),
      N(
        'From the mound you watch them go out, a line of dust across the plain, Sundiata at the front.',
      ),
      N(
        'They come back at dusk with banners they didn’t leave with, and nobody missing. The city goes out to meet them.',
      ),
      MT('Twenty horsemen, and none lost. Tomorrow, take two hundred.', 'happy'),
    ],
    [
      ask(
        5,
        'maths',
        'multiply by 10',
        '3.OA.A.3',
        [
          N(
            'The king gives Sundiata 20 horsemen first, and then 200. How many times as many is 200 as 20?',
          ),
        ],
        [
          o(
            '10 times as many',
            N('Yes: 20 × 10 = 200. Ten times the riders, and he lost nobody the first time.'),
            true,
          ),
          o('2 times as many', N('Doubling 20 gives 40. To reach 200 we need 20 × 10.')),
          o('180 times as many', N('180 is the difference, not the multiple. 20 × 10 = 200.')),
        ],
        'Found that 200 is 10 times 20.',
      ),
    ],
    [
      ch('list', 'Add it to the list for Balla.', [
        N(
          'You add it: Mema, the dust, the banners, and that nobody was missing. You think Balla will like that best.',
        ),
      ]),
      ch('nubbin', 'Wave your Nubbin’s paw at the riders.', [
        N('Sundiata sees it, all the way from the gate, and lifts his spear in answer.'),
      ]),
    ],
  ),
  scene(
    'a05-08-army-done',
    [
      N(
        'Year by year Moussa Tounkara gives him more. In time Sundiata is second only to the king.',
      ),
      MT(
        'I have no son, and I am getting old. I don’t say anything by that. I just say it.',
        'think',
      ),
    ],
    [
      ask(
        1,
        'literacy',
        'reading between the lines',
        'RL.3.3',
        [
          N(
            'The king says he has no son and is getting old, “and doesn’t say anything by that”. What is he hinting?',
          ),
        ],
        [
          o('That Sundiata could become his heir', MT('You read me well.', 'soft'), true),
          o(
            'That he is bored of ruling',
            N('Look at what he says: no son, getting old. He’s thinking about who comes next.'),
          ),
          o(
            'That he wants a horse',
            N('He’s hinting about something bigger than a horse: who will rule after him.'),
          ),
        ],
        'Inferred a hint: the king is suggesting that Sundiata could be his heir.',
      ),
    ],
  ),
  scene(
    'a05-08-mat',
    [
      N(
        'Sogolon rests a great deal now. She lies on a mat in the shade, and the shade moves round her as the day goes.',
      ),
      SO(
        'Sit, apprentice. You and your round one. I like a quiet visitor. My son visits like a herd of cattle.',
      ),
      N('You sit, and your Nubbin lies down against her side. She puts her hand on it.'),
      SO('I won’t see Niani again. Don’t argue. I’m very old, and my body is tired.', 'soft'),
      SO(
        'I’ve done my part. I carried him, and I waited for him, and I walked him to the edge of the world. He can do the rest.',
      ),
      SO(
        'Tell Balla that I wasn’t sad about it. Tell him I was very proud, and very tired, and both are fine.',
      ),
    ],
    [
      ask(
        2,
        'science',
        'why shade moves during the day',
        '5-ESS1-2',
        [N('Sogolon’s shade moves round her as the day goes. Why does it move?')],
        [
          o(
            'The Earth turns, so the Sun seems to cross the sky',
            N('Yes. As the Sun’s place in the sky changes, shadows swing round and change length.'),
            true,
          ),
          o(
            'The tree is slowly walking',
            N('Trees stay put. The light moves instead, because the Earth turns.'),
          ),
          o(
            'The wind blows the shade',
            N(
              'Wind moves the leaves, not the shade. Shade moves because the Sun seems to cross the sky.',
            ),
          ),
        ],
        'Learned that shadows move during the day because the Earth turns and the Sun appears to cross the sky.',
      ),
    ],
    [
      ch('stay', 'Stay, and say nothing.', [
        N('You stay. She closes her eyes, and the shade moves.'),
        N('After a while she is humming, very low, the tune from the grinding stone.'),
      ]),
      ch('promise', 'Promise to tell Balla.', [
        SO('Good. Say it in my voice. Make him laugh at the cattle bit.', 'happy'),
      ]),
    ],
  ),
  scene(
    'a05-08-mat-done',
    [
      N('That night, Sogolon dies. Her body stops working, and it will not start again.', 'sad'),
      N(
        'In the morning her children sit around her mat, and you sit with them. Nobody says anything for a long time, and that is right.',
      ),
    ],
    [
      note(
        1,
        'sel',
        'grief: sadness is allowed, and being together helps',
        'CASEL: Self-awareness',
        [
          N(
            'When someone you love dies, you can feel sad, numb, cross, or all of them. None of those feelings is wrong.',
          ),
          N(
            'Sitting together, crying, remembering and telling stories all help. Grief comes from love, and it softens with company.',
          ),
        ],
        'Heard plainly that Sogolon died, that all feelings in grief are allowed, and that company and remembering help.',
      ),
    ],
  ),
  scene(
    'a05-08-complete',
    [
      KO(
        'She waited for him seven years in the dust. She’d want us to stop crying before seven days. She was strict like that.',
        'sad',
      ),
      SU(
        'She was the strongest person I’ve ever met. Stronger than the iron rod. I only bent it. She carried it, all those years.',
      ),
      N(
        'Your Nubbin goes and sits on the empty mat in the shade, where it is still warm. Nobody moves it.',
      ),
      N(
        'After a while, Kolonkan sits down beside it, and puts her hand on its head the way her mother did.',
        'soft',
      ),
    ],
    [
      ask(
        1,
        'literacy',
        'figurative language: stronger than the iron rod',
        'L.4.5',
        [N('Sundiata says his mother was “stronger than the iron rod”. What is he comparing?')],
        [
          o(
            'Her patience and love against the rod’s hardness',
            SU('Yes. She carried what couldn’t be lifted with hands.'),
            true,
          ),
          o('How heavy she was', N('He doesn’t mean her weight. He means her strength of spirit.')),
          o('Their colour', N('It isn’t about colour. It’s about inner strength.')),
        ],
        'Explained the comparison in a metaphor about Sogolon’s strength.',
      ),
      ask(
        3,
        'sel',
        'a think question: what is remembering for?',
        'CASEL: Self-awareness',
        [
          N(
            'Kolonkan says her mother would want them to stop crying. Does remembering someone mean being sad, or something else?',
          ),
        ],
        [
          think(
            'It means keeping their stories and habits alive',
            KO('A lovely answer. She’d like that: her way of laughing, living on.'),
          ),
          think(
            'It can mean both sadness and gladness',
            KO('That’s honest. Remembering often holds them together.'),
          ),
          think('I’m not sure', KO('That’s fine. Nobody is sure at first.')),
        ],
        'Reflected on what remembering someone means: sadness, gladness, or keeping their ways alive (no single right answer).',
      ),
    ],
  ),

  // ------------------------------------------------ A5-9 The Sorcerer King
  scene(
    'a05-09-sosso',
    [
      N(
        'The atlas pages riffle, as if a wind has come in at the window. When they settle, the red earth is grey with smoke.',
      ),
      N(
        'You are in Sosso, years ago, on the day Balla arrived with Dankaran Touman’s gifts. The atlas goes where the story is.',
      ),
      N(
        'Sosso is a city of forges. Its walls ring with hammers, and above them stands a tall tower with seven floors.',
      ),
      B('Apprentice? You’re not supposed to be here. You’re supposed to be with him.', 'shock'),
      B(
        'Oh. It’s the page, isn’t it. A griot can stand in two places: where it happened, and where it’s told.',
      ),
      B(
        'Soumaoro is out. And at the top of his tower is a door that nobody is allowed through. So of course we’re going to look. Griots are nosy.',
      ),
    ],
    [
      ask(
        2,
        'maths',
        'multiply to count steps',
        '3.OA.A.3',
        [
          N(
            'The tower has 7 floors, with 12 steps between floors. How many steps in all, if you climb every floor?',
          ),
        ],
        [
          o(
            '84 steps',
            N('Yes: 7 × 12 = 84. Your Nubbin counted every one of them, slowly.'),
            true,
          ),
          o('19 steps', N('That’s 7 + 12. Seven floors of 12 steps each: 7 × 12 = 84.')),
          o('72 steps', N('Check it: 6 × 12 is 72, one floor short. For 7 floors, 7 × 12 = 84.')),
        ],
        'Multiplied 7 × 12 to count the steps of a seven-floor tower.',
      ),
      note(
        4,
        'literacy',
        'a storyteller can stand where it happened and where it’s told',
        'RL.3.6',
        [
          N('A griot tells a story as it happened, and as tellers before him told it.'),
          N('Those are two points of view, and a good griot holds both.'),
        ],
        'Heard that a storyteller can show events as they happened and as they are told, two different points of view.',
      ),
    ],
    [
      ch('stop', 'Tell him it’s a bad idea.', [
        B(
          'It’s a very bad idea. I’m going anyway. You’ll want to be there, so you can say I was warned.',
          'happy',
        ),
      ]),
      ch('follow', 'Follow him up the stairs.', [
        N(
          'You follow him up seven floors of stairs. Your Nubbin follows you, one step at a time, with great determination.',
        ),
      ]),
    ],
  ),
  scene(
    'a05-09-sosso-done',
    [
      N(
        'The door at the top isn’t locked, because nobody in Sosso would dare. Balla pushes it open.',
      ),
    ],
    [
      ask(
        0,
        'sel',
        'careful decisions: planning for the unexpected',
        'CASEL: Responsible decision-making',
        [
          N(
            'Balla is about to open a door that is forbidden. What would a careful person do first?',
          ),
        ],
        [
          o(
            'Keep a lookout, and know the way out',
            B('Yes. If you’re going to take a risk, plan your escape.'),
            true,
          ),
          o(
            'Shout, so everyone knows',
            N('Shouting would bring the guards. A careful person stays quiet and watches.'),
          ),
          o(
            'Run away at once',
            N('Running away is safe, but Balla chooses to look. If you do, plan your way out.'),
          ),
        ],
        'Chose to keep a lookout and plan a way out before taking a risk.',
      ),
    ],
  ),
  scene(
    'a05-09-chamber',
    [
      N(
        'The chamber is dim and close. Owls sit on perches in the dark and turn their heads to watch you.',
      ),
      N(
        'There are jars and bundles on shelves, and on one wall, a row of old crowns from kings Soumaoro has beaten.',
      ),
      N(
        'In the middle stands a balafon bigger than any you have seen. Its keys are dark with age, and its gourds hang like moons.',
      ),
      B('Oh. Oh, look at that.', 'soft'),
      B('A griot can’t see a balafon like that and not play it. It would be rude. To the balafon.'),
      N('He sits. He looks at you, and at your Nubbin, and you see him decide something.'),
      B(
        'Your tune. The one your round friend learned. Let’s see what it sounds like on a king’s instrument.',
      ),
    ],
    [
      note(
        0,
        'science',
        'owls: nocturnal hunters with special senses',
        '4-LS1-2',
        [
          N(
            'Owls are nocturnal: they sleep by day and hunt at night. Their huge eyes gather scraps of light, and their soft feathers let them fly almost silently.',
          ),
          N(
            'An owl can turn its head about 270 degrees, because its eyes are fixed in place and cannot move.',
          ),
        ],
        'Learned that owls are nocturnal and have large eyes, silent feathers and a very flexible neck.',
      ),
    ],
  ),
  scene(
    'a05-09-chamber-done',
    [
      N(
        'Balla plays the hunters’ tune. On this balafon it is enormous: quick, stamping, a sound like a hundred hunters coming home.',
      ),
      N(
        'Your Nubbin stamps along, and the owls shift on their perches. Somewhere below, a door bangs, and heavy feet climb the stairs fast.',
      ),
      N(
        'Soumaoro Kanté fills the doorway, tall, in a cloak the colour of iron, his face like thunder. Then he hears the tune.',
      ),
      SK(
        'That is a hunters’ tune. My father’s hunters played that, coming home, when I was small.',
        'think',
      ),
      ...A09_SPARED,
    ],
    [
      ask(
        1,
        'music',
        'bigger instruments make lower sounds',
        '1-PS4-1',
        [
          N(
            'Soumaoro’s balafon is much bigger than Balla’s little one, with bigger keys and gourds. Will its lowest note be lower or higher than Balla’s?',
          ),
        ],
        [
          o(
            'Lower',
            B('Yes. Bigger bars and bigger resonators mean slower vibrations and deeper notes.'),
            true,
          ),
          o(
            'Higher',
            N('It’s the other way round. Longer keys and bigger gourds make deeper, lower notes.'),
          ),
        ],
        'Predicted that a larger balafon makes lower notes.',
      ),
    ],
  ),
  scene(
    'a05-09-march',
    [
      N(
        'The page turns forward again. From the tower window, you watch Soumaoro’s army go out of Sosso like smoke out of a forge.',
      ),
      B(
        'He’s taking Manding. Dankaran Touman sent him gifts, and a griot, and it wasn’t enough. It never is, with a man like that.',
        'sad',
      ),
      N(
        'Far off, the page shows Niani, small, with its gates open, and Dankaran Touman riding hard the other way.',
      ),
      DT('Don’t tell anyone I ran. No. Tell them. It doesn’t matter now.', 'sad'),
      B('Manding has no king now. It has Soumaoro.'),
      B(
        'Go back to him, apprentice. Remember for me still. I’ll keep the tune going here, so he has something to come home to.',
      ),
    ],
    [
      ask(
        4,
        'sel',
        'a think question: can gifts keep the peace?',
        'CASEL: Responsible decision-making',
        [
          N(
            'Dankaran sent gifts and a griot, hoping to keep the peace. Why might gifts not be enough?',
          ),
        ],
        [
          think(
            'A powerful person may just want more',
            B('A sharp answer. Gifts can show that you are weak and invite more asking.'),
          ),
          think(
            'Peace needs trust, which gifts cannot buy',
            B('That’s a thoughtful one. Trust has to be earned, not paid.'),
          ),
          think(
            'Gifts might work sometimes',
            B('That’s fair. Sometimes they do. Here, they didn’t.'),
          ),
        ],
        'Reasoned about why gifts alone might not keep the peace (no single right answer).',
      ),
    ],
  ),
  scene(
    'a05-09-complete',
    [
      B(
        'In Sosso they tell this differently. To them Soumaoro was a great smith and a great king, who stood up to bigger kings.',
      ),
      B(
        'In some of their tellings he was fighting for his own people, and Manding was the one in the wrong. Remember that too.',
      ),
      B(
        'I’m his griot now, so I have to sing him well. I find that I can. He loves music more than anyone I’ve met.',
        'think',
      ),
      N(
        'The pages riffle again. Grey smoke goes back to red earth, and you are in Mema, in the morning, with your Nubbin asleep on your feet.',
      ),
    ],
    [
      ask(
        2,
        'literacy',
        'point of view: why would Sosso tell the story differently?',
        'RL.3.6',
        [
          N(
            'Point of view means how someone sees events. Why might griots in Sosso tell Soumaoro’s story differently?',
          ),
        ],
        [
          o(
            'They are on Sosso’s side and know different things',
            B('Yes. Who tells a story, and who it is for, shapes what is told.'),
            true,
          ),
          o(
            'They are telling lies on purpose',
            N(
              'Not necessarily. People remember from where they stand, and two views can both be honest.',
            ),
          ),
          o(
            'They have forgotten the story',
            N('They remember it carefully. They just see it from Sosso’s side.'),
          ),
        ],
        'Explained that a storyteller’s side and knowledge shape how the story is told.',
      ),
    ],
  ),

  // ------------------------------------------------ A5-10 The Call Home
  scene(
    'a05-10-market',
    [
      N(
        'Mema’s market is all noise and colour. Kolonkan keeps a little stall at the end, selling baobab leaves and the roots they cook at home.',
      ),
      N('This morning, the morning after, she has opened it anyway. Her mother would have.'),
      KO('Nobody here buys them. I keep the stall so the smell is somewhere. Is that foolish?'),
      N(
        'Four tired men in travelling clothes stop dead in front of the stall. One of them picks up a bunch of leaves and smells it.',
      ),
      ME('These are Manding leaves. Who sells Manding leaves in Mema?', 'shock'),
      KO('Sogolon’s daughter does.'),
      ME(
        'Sogolon’s daughter. Then her son is here. We’ve searched every market from the river to the sand for him.',
      ),
      ME('Soumaoro has Manding. The king ran. The people send us to find the lion. Is he here?'),
    ],
    [
      note(
        3,
        'science',
        'smell and memory',
        '4-LS1-2',
        [
          N(
            'Smell is closely linked to memory. The part of the brain that handles smell sits next to the parts that store memories and feelings.',
          ),
          N('That’s why a single sniff of leaves can bring a man all the way home.'),
        ],
        'Learned that smell is closely tied to memory, which is why a familiar scent can bring a place to mind.',
      ),
      ask(
        7,
        'maths',
        'multiply to find a cost',
        '3.OA.A.3',
        [
          N(
            'The four men each buy a bunch of leaves for 8 Shells. How many Shells do they spend in all?',
          ),
        ],
        [
          o('32 Shells', N('Yes: 4 × 8 = 32. Kolonkan has her first sale in days.'), true),
          o('12 Shells', N('That’s 4 + 8. Four men, 8 Shells each: 4 × 8 = 32.')),
          o('24 Shells', N('That’s 3 × 8. There are four men: 4 × 8 = 32.')),
        ],
        'Multiplied 4 × 8 to find the total cost.',
      ),
    ],
    [
      ch('run', 'Run for Sundiata.', [
        N(
          'You run. Your Nubbin runs too, a little behind, and arrives just as Sundiata does, out of breath and very proud of itself.',
        ),
      ]),
      ch('stay', 'Stay with Kolonkan.', [
        KO('Stay. My hands are shaking. Hold the stall while I find my brother.', 'shock'),
      ]),
    ],
  ),
  scene(
    'a05-10-market-done',
    [
      SU('I said I’d come back. My mother heard me say it.'),
      SU('Now I have to go and do it, and she isn’t here to see.', 'sad'),
    ],
    [
      note(
        1,
        'sel',
        'missing someone and keeping a promise',
        'CASEL: Self-awareness',
        [
          N(
            'Missing someone doesn’t go away when you get on with things. It can sit beside you while you do them.',
          ),
          N(
            'Sundiata keeps his promise even though the person he made it to cannot see it. Some promises are for the people we have lost.',
          ),
        ],
        'Heard that missing someone sits alongside action, and that keeping a promise can honour someone who has died.',
      ),
    ],
  ),
  scene(
    'a05-10-basket',
    [
      N(
        'There is one more thing. Sogolon must be buried, and Moussa Tounkara is not pleased that his best general is leaving.',
      ),
      MT(
        'A stranger’s grave needs ground, and ground has a price. And I had hoped you would stay and be my heir.',
        'angry',
      ),
      SU('He’s grieving too, in his way. He’ll get his price. Apprentice, bring me a basket.'),
      SU(
        'Put in some broken pots from the rubbish heap. Some old straw from a fallen roof. And a few feathers, from the yard.',
      ),
      N(
        'You gather them into a very odd basket. Your Nubbin adds a feather of its own choosing, a large one.',
      ),
      SU(
        'Now take it to the king’s house. Set it down in front of his council, and say nothing at all.',
      ),
    ],
    [
      ask(
        5,
        'literacy',
        'a think question: when is a message without words clearer than words?',
        'RL.4.2',
        [
          N(
            'Sundiata sends a message with no words, only objects. When might that be clearer, or less clear, than speaking?',
          ),
        ],
        [
          think(
            'Objects can say hard things without anyone being insulted',
            SU('A fair answer. A basket can be a blunt message with a polite shape.'),
          ),
          think(
            'Words are clearer, because objects can be misread',
            SU('That’s true too. It works here only because the old counsellor can read it.'),
          ),
          think(
            'It depends who is reading it',
            SU('Yes. A symbol only works if people share the same understanding of it.'),
          ),
        ],
        'Thought about the clarity of a symbolic message compared with spoken words (no single right answer).',
      ),
    ],
    [
      ch('ask', 'Ask what it means.', [
        SU('He has old counsellors. Let one of them tell him. It sounds better in an old voice.'),
      ]),
      ch('guess', 'Work it out yourself.', [
        N(
          'Broken pots, a fallen roof, feathers scattered in a yard. It looks like a town after a war has been through it.',
        ),
        SU('You’ve been listening to Balla. Don’t say it. Let them say it.'),
      ]),
    ],
  ),
  scene(
    'a05-10-basket-done',
    [
      CO(
        'King. This is a ruined town, in a basket. He says: give my mother her ground, or one day this is Mema.',
      ),
      MT('I know what it says.', 'sad'),
      MT(
        'Give her the best ground we have. And give him horsemen. Half of mine. I’d rather be his friend than his basket.',
      ),
    ],
    [
      ask(
        2,
        'sel',
        'what a decision shows about a character',
        'CASEL: Relationship skills',
        [
          N(
            'The king gives the best ground and half his horsemen. What does that tell you about him?',
          ),
        ],
        [
          o(
            'He values friendship over keeping his army',
            N('Yes. Choosing a friend over a fight shows wisdom, and some generosity.'),
            true,
          ),
          o(
            'He is afraid of the basket',
            N(
              'He says he knows what it says, so he isn’t afraid of a basket. He’s choosing wisely.',
            ),
          ),
          o(
            'He doesn’t care about his horsemen',
            N('He cares, but he values the friendship more. That’s a choice, not carelessness.'),
          ),
        ],
        'Inferred a character’s values from the choice he makes.',
      ),
    ],
  ),
  scene(
    'a05-10-complete',
    [
      N(
        'Sogolon is buried in Mema, under a tree, with all honour. Moussa Tounkara stands at the graveside with his head bowed.',
      ),
      KO(
        'Balla will tell you the messengers came first, and that she lived just long enough to hear them. Plenty of griots tell it that way.',
      ),
      KO('I like that telling. I won’t say it’s wrong. I just wasn’t there for it.', 'soft'),
      N('Then the horses are saddled, and the road west is open, and Sundiata is going home.'),
    ],
    [
      note(
        2,
        'social-studies',
        'how historians use oral history alongside other sources',
        'D2.His.2.K-2',
        [
          N(
            'Different griots tell the same events in slightly different orders. Historians don’t throw the tellings away.',
          ),
          N(
            'They compare many tellings and, where they can, written records and the places themselves, to see what most agree on.',
          ),
        ],
        'Learned that historians compare many tellings and other sources when using oral history.',
      ),
    ],
  ),

  // ------------------------------------------------ A5-11 Tabon
  scene(
    'a05-11-allies',
    [
      N(
        'Word goes ahead of him on the road. At the iron hills of Tabon, kings are waiting with their people.',
      ),
      FR(
        'Fran Kamara, king of Tabon. I played with you when we were boys, Sogolon’s son. You used to cheat at wrestling.',
      ),
      SU('I crawled. It was the only way to win.'),
      FR('Tabon is with you. So are the hunters of Sibi, and more are coming.', 'happy'),
      MB(
        'Every king who’s been afraid of Soumaoro is walking up this road, Djata. They’ve just been waiting for someone to go first.',
      ),
      N(
        'All day they come in, with drums and banners. Your Nubbin greets every single one at the camp gate, very seriously.',
      ),
    ],
    [
      ask(
        5,
        'maths',
        'add within 20: totals of arrivals',
        '1.OA.A.1',
        [
          N(
            'Two kings arrive in the morning, five at noon, and four at dusk. How many kings is that in all?',
          ),
        ],
        [
          o('11 kings', N('Yes: 2 + 5 + 4 = 11. Your Nubbin greeted every one.'), true),
          o('9 kings', N('That’s 5 + 4. Add the morning kings too: 2 + 5 + 4 = 11.')),
          o('13 kings', N('Count again: 2 + 5 = 7, and 7 + 4 = 11.')),
        ],
        'Added three numbers within 20 to find a total.',
      ),
    ],
    [
      ch('list', 'Add every king’s name to the list for Balla.', [
        N(
          'By sunset the list for Balla is the longest thing you have ever written in your head. You keep it all.',
        ),
      ]),
      ch('drum', 'Let your Nubbin play its tune for the newcomers.', [
        N(
          'A drummer from Sibi picks up your Nubbin’s tune and plays it back bigger. Soon half the camp has it.',
        ),
      ]),
    ],
  ),
  scene(
    'a05-11-battle',
    [
      N(
        'From the ridge the battle is dust, horns and banners, moving like weather across the plain.',
      ),
      N(
        'Sundiata’s horsemen go through Sosso’s lines like water through a broken dam. Sosso’s banners fall back.',
      ),
      N(
        'Then a figure in an iron-coloured cloak rides out alone on a black horse. The arrows fly at him and fall short, or slide off, or turn.',
      ),
      SK('Son of the buffalo. You’ve grown. It won’t help you.'),
      N(
        'Sundiata rides at him, and Soumaoro is simply not there any more. He is on the hill opposite, watching.',
      ),
      N('Your Nubbin hides its face in your coat. Then, slowly, it looks out again.'),
    ],
    [
      ask(
        5,
        'sel',
        'how to help someone who is frightened',
        'CASEL: Self-management',
        [N('Your Nubbin is frightened. Which helps a scared friend most?')],
        [
          o(
            'Hold them close and breathe slowly together',
            N('Yes. A calm body helps a scared one calm down.'),
            true,
          ),
          o(
            'Tell them there is nothing to be scared of',
            N(
              'Fear is real, even if danger is far. Holding close and breathing together helps more.',
            ),
          ),
          o(
            'Make them watch',
            N('Watching can make fear worse. Holding close and breathing slowly is kinder.'),
          ),
        ],
        'Chose to hold a frightened friend close and breathe slowly together.',
      ),
    ],
    [
      ch('hold', 'Hold your Nubbin close.', [
        N('You hold it. Its heart is going very fast, and so is yours.'),
      ]),
      ch('watch', 'Keep watching Soumaoro.', [
        N(
          'He doesn’t look angry. He looks interested, like a smith testing a new blade, and that is worse.',
        ),
      ]),
    ],
  ),
  scene(
    'a05-11-battle-done',
    [
      N(
        'By evening the pass is Sundiata’s, and Sosso’s army has gone back over the hills. Soumaoro went first, untouched.',
      ),
    ],
    [
      note(
        0,
        'social-studies',
        'what a mountain pass is, and why armies fight over them',
        '4-ESS2-2',
        [
          N(
            'A pass is a gap between hills or mountains that people can travel through. Tabon’s pass is a narrow route between high ground.',
          ),
          N(
            'Whoever holds a pass can control who travels, trades or marches through the land beyond it.',
          ),
        ],
        'Learned what a mountain pass is and why controlling one matters.',
      ),
    ],
  ),
  scene(
    'a05-11-council',
    [
      SU(
        'We’ve won the pass. We’ll win the next battle, and the one after. And we still won’t have touched him.',
      ),
      FR(
        'Iron doesn’t cut him. Arrows don’t find him. He goes from one hill to the next like a bird.',
      ),
      SU('Then he has a secret. Every great sorcerer has one thing that undoes him.'),
      MB('And nobody alive knows what it is. Except Soumaoro.'),
      SU('And whoever he trusts.', 'think'),
      N(
        'Sundiata looks into the fire for a long time. You know that look: his mother had it, waiting.',
      ),
      N('Your Nubbin falls asleep by the fire with one foot still tapping the tune.'),
    ],
    [
      ask(
        4,
        'sel',
        'a think question: is trust a risk?',
        'CASEL: Relationship skills',
        [
          N(
            'Sundiata says whoever Soumaoro trusts may know the secret. Is trusting someone always a risk, and why?',
          ),
        ],
        [
          think(
            'Yes, because they could pass your secret on',
            SU('A fair answer. Trust is a bet, and bets can be lost.'),
          ),
          think(
            'Yes, but it’s worth it for good friends',
            SU('A thoughtful one. Without some trust, nobody could be close.'),
          ),
          think(
            'It depends who you trust',
            SU('True. Trust is easier to give to people who’ve earned it.'),
          ),
        ],
        'Reflected on whether trusting someone is a risk (no single right answer).',
      ),
      note(
        5,
        'science',
        'defining a problem is the first step to solving it',
        '3-5-ETS1-2',
        [
          N(
            'Sundiata names the problem exactly: “We can’t hurt him, so what protects him?” Engineers and scientists start the same way.',
          ),
          N(
            'Once a problem is clearly stated, you can compare ideas for solving it, and test which works best.',
          ),
        ],
        'Learned that stating a problem clearly is the first step in comparing solutions.',
      ),
    ],
  ),
  scene(
    'a05-11-complete',
    [
      SU(
        'Apprentice. My griot is in Sosso, in Soumaoro’s house. If anyone in the world can learn his secret, it’s Balla.',
      ),
      SU(
        'So we wait. And we win battles while we wait, because that keeps people alive. But mostly we wait.',
      ),
      N(
        'Your Nubbin plays the first three notes of its tune, softly, towards Sosso. Nobody answers, and it plays them again anyway.',
      ),
    ],
    [
      ask(
        1,
        'literacy',
        'theme: how waiting connects the story',
        'RL.4.2',
        [
          N(
            'Sogolon waited for years, and now Sundiata waits for Balla. How are the two waits alike?',
          ),
        ],
        [
          o(
            'Both use patience as a kind of strength',
            N(
              'Yes. In this story, patience isn’t doing nothing; it’s doing the right thing at the right pace.',
            ),
            true,
          ),
          o(
            'Both are just wasting time',
            N('Neither wastes time. The waiting leads to standing up, and to the secret.'),
          ),
          o(
            'Both are about to give up',
            N('Nobody gives up. Your Nubbin plays its notes again, anyway.'),
          ),
        ],
        'Linked two moments of waiting to the story’s theme of patience as strength.',
      ),
    ],
  ),

  // ------------------------------------------------ A5-12 The Secret
  scene(
    'a05-12-watch',
    [
      N(
        'It is your turn to keep the night watch. The camp sleeps behind you, and your Nubbin sleeps on your feet.',
      ),
      N('Very late, two figures come out of the dark, on foot, slowly, holding each other up.'),
      N('One is a young woman in a torn cloak. The other has a balafon on his back.'),
      B('Apprentice. You kept the fire lit. Of course you did.', 'soft'),
      N(
        'Your Nubbin is awake. It is across the ground and up Balla’s front before he can put the balafon down.',
      ),
      B(
        'Yes. Hello. Yes. I missed you too. I played your tune every night, did you know? Soumaoro got very tired of it.',
        'happy',
      ),
    ],
    [
      note(
        1,
        'science',
        'we see only when light reaches our eyes: firelight at night',
        '1-PS4-2',
        [
          N(
            'At night, you can’t see the two figures until they come into the light. We see things when light bounces off them and enters our eyes.',
          ),
          N('The watch fire sends out light, and the figures reflect a little of it back to you.'),
        ],
        'Learned that we see objects when light bounces off them into our eyes.',
      ),
    ],
  ),
  scene(
    'a05-12-watch-done',
    [
      N(
        'Sundiata comes out of his tent, sees who it is, and doesn’t say anything at all. He just holds on to Balla for a long time.',
      ),
    ],
    [
      ask(
        0,
        'literacy',
        'words for feelings: relief',
        'RL.1.4',
        [N('Sundiata says nothing and holds on to Balla. Which word names what he feels?')],
        [
          o(
            'Relief and joy',
            N('Yes. Relief is the feeling when a long worry finally lifts.'),
            true,
          ),
          o('Boredom', N('A long hug from a silent man is rarely boredom. It’s relief and joy.')),
          o('Anger', N('He holds Balla close. That is relief, mixed with joy.')),
        ],
        'Named a character’s feelings (relief and joy) from his actions.',
      ),
    ],
  ),
  scene(
    'a05-12-list',
    [
      B('Well, apprentice. You promised. Tell me. All of it, the good and the foolish.'),
      N(
        'You tell him: the west gate in the dark, the road, the wori and the ring, the king of Wagadou and the goat men.',
      ),
      N(
        'Mema, and the dust, and nobody missing; the mat in the shade; the market, and the basket.',
      ),
      N(
        'Balla doesn’t interrupt once. Now and then his lips move, saying a thing over so that he will have it.',
      ),
      B('The goat men. I wish I’d seen the goat men.', 'happy'),
      SU(
        'Two men and one goat, all afternoon. I learned more from that goat than from any battle since.',
      ),
      B(
        'Where do you want to start? A griot always knows the first thing he’ll say. It holds the rest up.',
      ),
    ],
    [
      act(
        3,
        'social-studies',
        'oral history: griots retell events in order',
        'D2.His.2.K-2',
        'edu:order:journey:gate-wori-wagadou-mema',
        [
          N(
            '(Put the journey in order: the west gate, the wori game, the king of Wagadou, then Mema.)',
          ),
          N('Retelling in order is how a griot makes sure nothing is lost.'),
        ],
        'Put the events of the journey in the order they happened.',
      ),
      note(
        6,
        'literacy',
        'an opening line holds up the rest of a story',
        'RL.4.2',
        [
          B(
            'The first line of a telling is like the centre pole of a tent. Everything else hangs from it.',
          ),
          B('So choosing where to begin is choosing what the whole story is about.'),
        ],
        'Heard that the opening of a story shapes what it is about.',
      ),
    ],
    [
      ch('sogolon', 'Start with Sogolon walking out of Niani with her head up.', [
        B(
          'Yes. That’s the one. Djata told you to say that first, didn’t he? I can hear him in it.',
          'soft',
        ),
        N(
          'You give him her message about the cattle. He laughs, and then he has to stop and wipe his face.',
        ),
      ]),
      ch('pace', 'Start with Sundiata walking at his mother’s pace.', [
        B('Good. That’s the whole king, right there. The rest is only battles.', 'think'),
      ]),
      ch('nobody', 'Start with “nobody missing”.', [
        B(
          'A griot’s start. Most people want the glory first. You picked the counting. Keep doing that.',
          'happy',
        ),
      ]),
    ],
  ),
  scene(
    'a05-12-list-done',
    [
      B(
        'Now I have it. Now it won’t be lost. Thank you, apprentice. You’ve no idea what you’ve carried.',
        'soft',
      ),
    ],
    [
      note(
        0,
        'social-studies',
        'oral and written traditions both keep the past',
        'D2.His.2.K-2',
        [
          N(
            'Many cultures keep the past in memory, through griots, songs and sayings; others write it down. Mali would later keep it both ways.',
          ),
          N(
            'Neither is better. A story kept by memory depends on people like you, passing it from one generation to the next.',
          ),
        ],
        'Learned that memory and writing are both ways to keep the past, and that oral traditions depend on people.',
      ),
    ],
  ),
  scene(
    'a05-12-secret',
    [
      N(
        'In Sundiata’s tent, the young woman lets her hood fall. She is Nana Triban, his half-sister: Sassouma’s daughter.',
      ),
      NT(
        'My brother Dankaran sent me to Soumaoro as a gift, to keep him friendly. He sends everyone as gifts. It didn’t work.',
      ),
      NT(
        'So I made him trust me. I praised him, and listened, and laughed in the right places, for a long time.',
      ),
      NT(
        'One night he told me what he fears. Not iron, not arrows. A white rooster’s spur, on the point of an arrow.',
      ),
      SU(
        'You’re Sassouma’s daughter. Your mother drove mine out of Niani. Why would you bring me this?',
      ),
      NT(
        'Because I’m my own daughter too, brother. And because Sogolon once gave me baobab leaves, when my mother wasn’t looking.',
        'soft',
      ),
    ],
    [
      note(
        3,
        'science',
        'a rooster’s spur is a hard spike used for defence',
        '4-LS1-1',
        [
          N(
            'A spur is a hard, pointed spike on the back of a rooster’s leg. Roosters use their spurs to defend themselves and their flock.',
          ),
          N('Like claws, beaks and horns, spurs are body parts that help animals survive.'),
        ],
        'Learned that a rooster’s spur is a body part that helps it defend itself.',
      ),
      ask(
        5,
        'sel',
        'a think question: why do people choose differently from their family?',
        'CASEL: Responsible decision-making',
        [
          N(
            'Nana Triban chooses differently from her mother. What makes a person choose a different path from their family?',
          ),
        ],
        [
          think(
            'A single kindness can change how you see someone',
            NT('A fair answer. Sogolon’s kindness stayed with me.'),
          ),
          think(
            'Seeing the harm others do',
            NT('A thoughtful one. Sometimes you see what the family can’t.'),
          ),
          think(
            'Thinking for yourself',
            NT('Yes. We all belong to our families and to ourselves.'),
          ),
        ],
        'Reflected on why someone might make different choices from their family (no single right answer).',
      ),
    ],
  ),
  scene(
    'a05-12-complete',
    [
      N(
        'In the morning a farmer of the camp brings a white rooster’s spur: from an old bird who died of nothing but years.',
      ),
      N(
        'A smith fixes it to the point of an arrow, and you hold the shaft still while he works. Your Nubbin holds your elbow still.',
      ),
      B(
        'Some tellers say Balla stole the secret. Some say it was Nana Triban alone. Some say they found it together.',
      ),
      B(
        'Tonight I’m telling it as it happened. Tomorrow I’ll tell it as it’s told. Both of those are my job.',
      ),
    ],
    [
      ask(
        1,
        'maths',
        'divide to compare lengths',
        '3.OA.A.3',
        [
          N(
            'The spur is about 3 centimetres long, and the arrow is 60 centimetres. How many spurs laid end to end would match the arrow?',
          ),
        ],
        [
          o('20 spurs', N('Yes. 60 ÷ 3 = 20, because 3 × 20 = 60.'), true),
          o('57 spurs', N('That’s 60 − 3. We want how many 3s fit in 60: 60 ÷ 3 = 20.')),
          o('180 spurs', N('That’s 60 × 3. Dividing gives how many 3s fit in 60: 20.')),
        ],
        'Divided 60 by 3 to compare two lengths.',
      ),
    ],
  ),

  // ------------------------------------------------ A5-13 Kirina
  scene(
    'a05-13-fakoli',
    [
      N(
        'A big man comes up the road with a company of smiths behind him, their hammers on their shoulders.',
      ),
      FK(
        'I am Fakoli, son of Soumaoro’s sister. I’ve made his iron all my life. I’ve come to make yours.',
      ),
      SU('Why would Soumaoro’s nephew change sides on the eve of a battle?'),
      FK(
        'Because he took my wife, Keleya, away from me. Because nothing is ever enough for him.',
        'angry',
      ),
      FK(
        'A man who will take that from his own family will take everything from everyone. So I’ve come.',
      ),
      B(
        'In Sosso they’ll call Fakoli a traitor. In Manding they’ll call him a hero. He’s a man who had enough.',
        'think',
      ),
      N('A smith’s hammer slips. Your Nubbin catches it, then falls over with it. Fakoli laughs for the first time that day.'),
    ],
    [
      note(
        0,
        'social-studies',
        'in Mande society, crafts such as smithing and griotry were handed down in families',
        'D2.His.2.K-2',
        [
          N(
            'In the Mande world, certain crafts, such as working iron and being a griot, were traditionally passed down in particular families, from parent to child.',
          ),
          N(
            'Smiths were honoured for their skill, and they kept it in the family, just as the Kouyaté kept the telling of this story.',
          ),
        ],
        'Learned that smithing and griotry were traditionally family crafts handed from parent to child.',
      ),
      ask(
        5,
        'literacy',
        'point of view: traitor or hero?',
        'RL.3.6',
        [
          N(
            'A traitor is someone who betrays their own side. Why is Fakoli called a traitor in Sosso, but a hero in Manding?',
          ),
        ],
        [
          o(
            'Each side judges him by who it thinks he should be loyal to',
            B('Yes. Loyalty and betrayal look different from different places.'),
            true,
          ),
          o(
            'Because Sosso and Manding are wrong',
            N('Neither side is simply wrong. They see the same act from different points of view.'),
          ),
          o(
            'Because he changed his name',
            N('His name didn’t change. What changed was which side he stood on.'),
          ),
        ],
        'Explained that “traitor” and “hero” depend on the point of view of whoever is judging.',
      ),
    ],
    [
      ch('welcome', 'Bring him water.', [
        FK(
          'Thank you. That’s the first thing anyone has given me in a long time without wanting something back.',
          'soft',
        ),
      ]),
      ch('smiths', 'Show the smiths where to set up their forge.', [
        N(
          'By nightfall the camp has a forge, glowing at the edge. Your Nubbin sits as close as it’s allowed, warming its feet.',
        ),
      ]),
    ],
  ),
  scene(
    'a05-13-kirina',
    [
      N(
        'The plain of Kirina at dawn: two armies in long lines, with banners, horns and drums, and dust already rising.',
      ),
      N(
        'Soumaoro rides out alone again, in his iron-coloured cloak, as he did at Tabon. He doesn’t need anyone else.',
      ),
      SK('Lion cub. I’ve beaten kings who could walk before you could talk. Go home.'),
      N(
        'Sundiata draws his bow. The arrow is plain, except for its point, where a small white spur is bound with thread.',
      ),
      N('He looses it. It doesn’t strike hard; it only grazes Soumaoro’s shoulder.'),
      N(
        'Soumaoro looks at his shoulder. Then he looks up at the sky, as if something has just flown out of him.',
      ),
      SK('Who told you?', 'shock'),
    ],
    [
      note(
        3,
        'science',
        'a bent bow stores energy and changes it to motion',
        '4-PS3-4',
        [
          N('When Sundiata draws a bow, the bent wood stores energy, like a stretched spring.'),
          N(
            'When he lets go, that stored energy turns into the motion of the arrow. A bow is a device that changes one form of energy into another.',
          ),
        ],
        'Learned that a drawn bow stores energy that changes into the arrow’s motion.',
      ),
    ],
  ),
  scene(
    'a05-13-kirina-done',
    [
      N(
        'Soumaoro turns his horse and rides. His army breaks behind him and runs, and Sundiata’s horsemen go after it.',
      ),
      B(
        'Not him. Leave him to Sundiata. Come on, apprentice. A griot follows the end of a story, not the middle.',
      ),
    ],
    [
      ask(
        0,
        'literacy',
        'how characters respond to events',
        'RL.2.3',
        [N('Soumaoro rides away after the arrow. How does his army respond?')],
        [
          o(
            'It breaks and runs behind him',
            N('Yes. Without its leader, the army loses its courage.'),
            true,
          ),
          o(
            'It charges even harder',
            N('The text says it breaks and runs. The army follows its leader’s example.'),
          ),
          o('It stands still', N('It doesn’t stand still. It breaks and runs behind its leader.')),
        ],
        'Described how a group responds to what happens to its leader.',
      ),
    ],
  ),
  scene(
    'a05-13-cave',
    [
      N('High in the hills of Koulikoro, Sundiata has stopped his horse at the mouth of a cave.'),
      N('Soumaoro’s black horse stands outside it, riderless, cropping the grass.'),
      SU('He went in. Nobody has come out.'),
      N('The cave is dark all the way back. No sound comes out of it at all.'),
      B(
        'Some say he’s still in there. Some say he became stone, part of the hill. In Sosso they say he simply went where he chose.',
        'think',
      ),
      B('Everyone agrees on one thing: he was never seen again.'),
    ],
    [
      note(
        3,
        'science',
        'echoes: sound waves bounce off hard surfaces',
        '4-PS3-2',
        [
          N(
            'When sound waves hit a hard, smooth surface such as a cave wall, they bounce back. That bounce is an echo.',
          ),
          N('Caves are good at echoes because their walls are rock and the space is closed in.'),
        ],
        'Learned that echoes are sound waves bouncing off hard surfaces such as cave walls.',
      ),
      ask(
        5,
        'literacy',
        'a think question: why not pick one ending?',
        'RL.3.6',
        [
          N(
            'Griots tell three versions of where Soumaoro went. Why not pick one, and which would you tell?',
          ),
        ],
        [
          think(
            'Keeping all three is more honest',
            B('A fair answer. When no one knows, honesty means saying so.'),
          ),
          think(
            'I would pick the one that seems most likely',
            B('That’s a good approach too. A historian would think that way.'),
          ),
          think(
            'I would tell the one I like best',
            B('A storyteller’s answer. Just be honest that it’s your choice.'),
          ),
        ],
        'Reasoned about how to tell a story with several endings (no single right answer).',
      ),
    ],
    [
      ch('wait', 'Wait at the cave mouth a little while.', [
        N(
          'You wait, and Sundiata waits with you. Nothing comes out but a little cool air, and then the sun moves.',
        ),
      ]),
      ch('tune', 'Let your Nubbin play its tune into the cave.', [
        N(
          'Your Nubbin plays its tune into the dark, softly. It comes back off the walls, the same and not quite the same.',
        ),
        B(
          'He loved music. Whatever else he was, he loved it. That should be remembered too.',
          'soft',
        ),
      ]),
    ],
  ),
  scene(
    'a05-13-complete',
    [
      SU('He was the greatest enemy I’ll ever have. I don’t want him sung badly, griot.'),
      B('He won’t be. Not by me.'),
      N(
        'Sundiata takes the black horse’s bridle and leads it down the hill. He doesn’t ride it; he walks beside it, all the way back.',
      ),
    ],
    [
      ask(
        1,
        'sel',
        'fairness to someone who was an enemy',
        'CASEL: Social awareness',
        [
          N(
            'Sundiata wants his greatest enemy sung truthfully, not badly. What does that show about him?',
          ),
        ],
        [
          o(
            'He is fair, even to an enemy',
            B('Yes. Telling the truth about an enemy takes courage and fairness.'),
            true,
          ),
          o(
            'He still hates him',
            N('If he hated him, he’d want him sung badly. He wants the truth told.'),
          ),
          o(
            'He has forgotten what happened',
            N('He remembers everything. That’s why he wants it sung truthfully.'),
          ),
        ],
        'Understood that wanting an enemy remembered truthfully shows fairness.',
      ),
    ],
  ),

  // ------------------------------------------------ A5-14 The Assembly
  scene(
    'a05-14-assembly',
    [
      N(
        'At Kurukan Fuga, on a wide plain near Kangaba, the kings and peoples of Manding gather in a great ring.',
      ),
      N(
        'There are more people than you can count, and more drums than you can hear separately. Your Nubbin tries to count anyway.',
      ),
      N(
        'One by one the kings come forward and lay down their spears before Sundiata, and say what their people will do.',
      ),
      FR('Tabon gives its iron. Its people keep their own ways and their own names.'),
      FK(
        'The smiths give their skill. Their craft stays theirs, father to son, and nobody may take it from them.',
      ),
      N('Then the whole ring is quiet, and Sundiata stands up.'),
      SU(
        'Manding is one now. Every clan keeps its name and its work. A stranger is a guest. Nobody harms a messenger.',
      ),
      SU(
        'And every person’s life is worth something. Even the least of them. Even the ones who crawl.',
        'soft',
      ),
    ],
    [
      note(
        7,
        'social-studies',
        'the Manden Charter and Kurukan Fuga',
        'D2.Civ.8.K-2',
        [
          N('A charter is a set of rules for how people live together.'),
          N(
            'The Manden Charter is remembered as proclaimed at Kurukan Fuga, and it is still spoken today.',
          ),
          N(
            'UNESCO, a United Nations organisation, lists it as part of humanity’s intangible cultural heritage: a living tradition, kept in people rather than in stone.',
          ),
        ],
        'Learned what the Manden Charter is, and that UNESCO lists it as intangible cultural heritage.',
      ),
      ask(
        6,
        'sel',
        'fairness and rules: guests and messengers',
        'CASEL: Responsible decision-making',
        [
          N(
            'Sundiata names rules: a stranger is a guest, and nobody harms a messenger. Why would these be good rules for a large kingdom?',
          ),
        ],
        [
          o(
            'They let people travel and talk safely, so peace can last',
            SU('Yes. Rules that protect strangers help many peoples live together.'),
            true,
          ),
          o(
            'They make the king richer',
            N(
              'The rules are about safety, not riches. A messenger who is safe can carry words instead of weapons.',
            ),
          ),
          o(
            'They only matter in battle',
            N('They matter most in peacetime: travel, trade and talk all depend on them.'),
          ),
        ],
        'Explained why rules protecting guests and messengers help peoples live together.',
      ),
    ],
  ),
  scene(
    'a05-14-assembly-done',
    [
      B(
        'Tellers argue to this day about the exact words said here. That’s how you know they mattered.',
      ),
      B('The rules agreed here are still remembered. People call them the Manden Charter.'),
      N(
        'The ring roars, and they name him Mansa, king of kings. Kolonkan is crying and pretending she isn’t.',
      ),
    ],
    [
      ask(
        1,
        'maths',
        'units of time: centuries',
        '4.MD.A.1',
        [
          N(
            'Balla says this will be told for 800 years, and a century is 100 years. How many centuries is that?',
          ),
        ],
        [
          o('8 centuries', N('Yes: 800 ÷ 100 = 8. Eight centuries of telling and arguing.'), true),
          o('80 centuries', N('That’s 80 × 10. A century is 100 years, so 800 ÷ 100 = 8.')),
          o('100 centuries', N('That would be 10,000 years. 800 years is 8 centuries.')),
        ],
        'Converted 800 years into 8 centuries.',
      ),
      ask(
        2,
        'sel',
        'a think question: are fair rules easy to keep?',
        'CASEL: Responsible decision-making',
        [
          N(
            'The assembly agrees that every life is worth something, even the least. Is a rule like that easy to keep, and why?',
          ),
        ],
        [
          think(
            'No, because people are tempted to put themselves first',
            B('A fair answer. Good rules matter most when they are hard.'),
          ),
          think(
            'Yes, if everyone agrees and reminds each other',
            B('A hopeful answer. That is why the charter is spoken aloud, again and again.'),
          ),
          think(
            'It depends who is watching',
            B('A sharp thought. The best rules are kept even when nobody watches.'),
          ),
        ],
        'Reflected on whether fair rules are easy to keep (no single right answer).',
      ),
    ],
  ),
  scene(
    'a05-14-ask',
    [
      N(
        'At the edge of the ring, where the griots sit, Balla is tuning his balafon. He looks happier than you’ve ever seen him.',
      ),
      B(
        'Sundiata has made my family his griots for ever. My children, and theirs. The Kouyaté. We’ll keep this story as long as we last.',
      ),
      N(
        'Your Nubbin climbs onto the balafon’s frame and sits there, as it did on the very first day.',
      ),
      B(
        'Which means I’ll tell it ten thousand times, and every time a little differently. That’s allowed. That’s the life in it.',
      ),
      B(
        'But some things a griot never leaves out, however he tells the rest. One thing in every telling.',
      ),
      N(
        'Around you the other griots are tuning too. Each of them, you realise, will tell this day their own way.',
      ),
      B('Apprentice, you were there for most of it. What should I never leave out?'),
    ],
    [
      note(
        1,
        'social-studies',
        'jeli: a living tradition of storytellers',
        'D2.His.2.K-2',
        [
          N(
            'In the Mande languages, a griot is called a jeli (plural jeliw). Jeli families, such as the Kouyaté, have kept their people’s history for centuries.',
          ),
          N(
            'They are still telling Sundiata’s story today, in Mali, Guinea and nearby countries, so it is a living tradition, not an old story that has ended.',
          ),
        ],
        'Learned that jeliw are hereditary keepers of history, and that the tradition is alive today.',
      ),
    ],
    [
      ch(
        'waiting',
        'That it took him seven years to stand, and that was all right.',
        [
          B(
            'Yes. Everyone remembers the rod. I’ll make them remember the dust before it, and the years nobody hurried him.',
            'soft',
          ),
        ],
        { 'a05-remember': 'waiting' },
      ),
      ch(
        'mother',
        'That his mother was the strongest person in it.',
        [
          B(
            'Sogolon. Yes. She goes in the first line, every time. I’ll make it a law in my family.',
            'happy',
          ),
        ],
        { 'a05-remember': 'mother' },
      ),
      ch(
        'sister',
        'That Nana Triban chose to bring the secret.',
        [
          B(
            'Sassouma’s daughter, choosing for herself. Yes. People forget her. I won’t let them.',
            'think',
          ),
        ],
        { 'a05-remember': 'sister' },
      ),
      ch(
        'enemy',
        'That the enemy loved music.',
        [
          B(
            'That’s the hardest one to sing, and the truest. Yes. I’ll keep Soumaoro whole.',
            'soft',
          ),
        ],
        { 'a05-remember': 'enemy' },
      ),
    ],
  ),
  scene(
    'a05-14-complete',
    [
      N(
        'The ring falls quiet. Balla stands before the kings to tell, for the first time, the story of Sundiata.',
      ),
      B(
        'Before I begin, my apprentice’s round friend will play us in. It learned the tune I’d have chosen myself.',
      ),
      N(
        'Your Nubbin plays the hunters’ tune on Balla’s balafon. A hundred hunters stamp along, and the whole ring stamps with them.',
      ),
      SU('My hunting tune. The one they played when I came home.', 'happy'),
      ...A14_END,
    ],
    [
      note(
        6,
        'social-studies',
        'later Mali: Mansa Musa and the libraries of Timbuktu',
        'D2.His.2.K-2',
        [
          N(
            'Less than a hundred years after Sundiata, Mali’s most famous ruler, Mansa Musa, made a celebrated journey to Mecca.',
          ),
          N('He carried so much gold that people talked about it for generations.'),
          N('Under later Malian and Songhai rulers, Timbuktu became a centre of learning.'),
          N(
            'Its libraries still hold hundreds of thousands of handwritten manuscripts: science, law, poetry and history.',
          ),
        ],
        'Learned that Mansa Musa ruled Mali less than a century later, and that Timbuktu’s libraries hold ancient manuscripts.',
      ),
      note(
        6,
        'music',
        'the balafon today: the Sosso-Bala is still kept in Niagassola',
        'D2.His.2.K-2',
        [
          N(
            'A very old balafon called the Sosso-Bala is still kept in Niagassola, in Guinea, by Kouyaté families.',
          ),
          N(
            'Tradition says it is Soumaoro’s own great balafon, the one Balla played in the tower.',
          ),
          N('UNESCO lists its tradition as heritage worth protecting.'),
          N(
            'Balafons are still played at weddings, celebrations and ceremonies across West Africa, and the keys are still tuned by ear.',
          ),
        ],
        'Learned that the balafon tradition is alive today, and that the Sosso-Bala is kept in Niagassola, Guinea.',
      ),
    ],
  ),
];

// ================================================================== variants (lullaby)
export const EDU_A05_READER_VARIANTS: EduScene[] = [
  scene(
    'a05-09-chamber-done-lullaby',
    [
      N(
        'Balla plays Sogolon’s lullaby. On this balafon it is huge and slow, like a grinding stone going round under the whole of Sosso.',
      ),
      N(
        'Your Nubbin sways, and the owls close their eyes. Somewhere below, a door bangs, and heavy feet climb the stairs fast.',
      ),
      N(
        'Soumaoro Kanté fills the doorway, tall, in a cloak the colour of iron, his face like thunder. Then he hears the tune.',
      ),
      SK(
        'My mother hummed that. At night, at the grinding stone, when she thought I was asleep.',
        'soft',
      ),
      ...A09_SPARED,
    ],
    [
      note(
        3,
        'music',
        'music can bring back memories of people we love',
        'CASEL: Self-awareness',
        [
          N(
            'Soumaoro, the fearsome king, is stopped by a lullaby, because it reminds him of his mother.',
          ),
          N(
            'Music and memory are closely linked: a tune heard long ago can bring back a person, a place and a whole feeling, years later.',
          ),
        ],
        'Learned that music can bring back memories and feelings of people we love.',
      ),
    ],
  ),
  scene(
    'a05-14-complete-lullaby',
    [
      N(
        'The ring falls quiet. Balla stands before the kings to tell, for the first time, the story of Sundiata.',
      ),
      B(
        'Before I begin, my apprentice’s round friend will play us in. It learned the tune I’d have chosen myself.',
      ),
      N(
        'Your Nubbin plays Sogolon’s lullaby on Balla’s balafon. Thousands of people go quiet to hear it.',
      ),
      KO('That’s our mother’s grinding tune. She never knew anyone heard it.', 'soft'),
      SU('She’d be cross to be the first thing in the story. Then she’d be very pleased.', 'happy'),
      ...A14_END,
    ],
    [
      note(
        7,
        'social-studies',
        'later Mali: Mansa Musa and the libraries of Timbuktu',
        'D2.His.2.K-2',
        [
          N(
            'Less than a hundred years after Sundiata, Mali’s most famous ruler, Mansa Musa, made a celebrated journey to Mecca.',
          ),
          N('He carried so much gold that people talked about it for generations.'),
          N('Under later Malian and Songhai rulers, Timbuktu became a centre of learning.'),
          N(
            'Its libraries still hold hundreds of thousands of handwritten manuscripts: science, law, poetry and history.',
          ),
        ],
        'Learned that Mansa Musa ruled Mali less than a century later, and that Timbuktu’s libraries hold ancient manuscripts.',
      ),
      note(
        7,
        'music',
        'the balafon today: the Sosso-Bala is still kept in Niagassola',
        'D2.His.2.K-2',
        [
          N(
            'A very old balafon called the Sosso-Bala is still kept in Niagassola, in Guinea, by Kouyaté families.',
          ),
          N(
            'Tradition says it is Soumaoro’s own great balafon, the one Balla played in the tower.',
          ),
          N('UNESCO lists its tradition as heritage worth protecting.'),
          N(
            'Balafons are still played at weddings, celebrations and ceremonies across West Africa, and the keys are still tuned by ear.',
          ),
        ],
        'Learned that the balafon tradition is alive today, and that the Sosso-Bala is kept in Niagassola, Guinea.',
      ),
    ],
  ),
];

// ================================================================== the quests
const GLOSSARY: GlossaryEntry[] = [
  gloss(
    'griot',
    'A West African storyteller, singer and keeper of history, who remembers things for a whole people.',
    'a05-01-page',
  ),
  gloss('prophecy', 'A statement about something that will happen in the future.', 'a05-01-court'),
  gloss(
    'oral history',
    'The past kept alive by spoken words and memory instead of written books.',
    'a05-01-court',
  ),
  gloss(
    'dignity',
    'Keeping your self-respect and calm, even when others are unkind.',
    'a05-02-complete',
  ),
  gloss(
    'deciduous',
    'Describes a plant that loses all its leaves for part of the year.',
    'a05-03-leaves',
  ),
  gloss('forge', 'A very hot fire where a smith heats metal to shape it.', 'a05-04-forge'),
  gloss('bellows', 'A pump that blows air onto a fire to make it hotter.', 'a05-04-forge'),
  gloss(
    'metaphor',
    'A comparison that says one thing is another, such as “he is a lion”.',
    'a05-04-complete',
  ),
  gloss(
    'resonator',
    'A hollow space, like a gourd, that makes a sound louder when air inside it vibrates.',
    'a05-05-lesson',
  ),
  gloss('tempo', 'The speed of a piece of music.', 'a05-05-lesson'),
  gloss(
    'hospitality',
    'Welcoming guests kindly, with food, a bed and good company.',
    'a05-07-djedeba',
  ),
  gloss(
    'heir',
    'The person who will take over a title or land after its owner.',
    'a05-08-army-done',
  ),
  gloss('nocturnal', 'Awake and active at night, and asleep in the day.', 'a05-09-chamber'),
  gloss('symbol', 'An object or picture that stands for an idea.', 'a05-10-basket'),
  gloss(
    'pass',
    'A gap between hills or mountains that people can travel through.',
    'a05-11-battle-done',
  ),
  gloss('spur', 'A hard, pointed spike on the back of a rooster’s leg.', 'a05-12-secret'),
  gloss('traitor', 'Someone who betrays the side they once belonged to.', 'a05-13-fakoli'),
  gloss('charter', 'A set of rules for how people live together.', 'a05-14-assembly'),
  gloss(
    'intangible cultural heritage',
    'Traditions that live in people, such as stories, music and skills, rather than in buildings or objects.',
    'a05-14-assembly',
  ),
  gloss('jeli', 'The Mande word for a griot. The plural is jeliw.', 'a05-14-ask'),
  gloss('manuscript', 'A book or document written by hand.', 'a05-14-complete'),
];

const quest = (
  n: number,
  title: string,
  goals: Record<string, { goal: string; hint: string }>,
): EduQuest => {
  const num = String(n).padStart(2, '0');
  const of = `a05-${num}`;
  const scenes = SCENES.filter((s) => s.of.startsWith(`${of}-`));
  const sceneIds = new Set(scenes.map((s) => s.id));
  return {
    id: `reader:${of}`,
    of,
    band: 'reader',
    title,
    goals,
    scenes,
    glossary: GLOSSARY.filter((g) => sceneIds.has(g.scene)),
  };
};

export const EDU_A05_READER: EduQuest[] = [
  quest(1, 'The Hunters’ Prophecy', {
    'a05-01-s1': {
      goal: 'Step into the red-earth page and find the young griot.',
      hint: 'Touch the page, then follow the sound of a balafon to the town gate.',
    },
    'a05-01-s2': {
      goal: 'Stand at the back of the king’s court and listen to the hunter.',
      hint: 'Stay beside Balla under the silk-cotton tree, and listen closely.',
    },
  }),
  quest(2, 'Sogolon', {
    'a05-02-s1': {
      goal: 'Sit by the fire and hear Balla tell the tale of the buffalo of Do.',
      hint: 'Find Balla at the fire behind Doua’s house and sit down.',
    },
    'a05-02-s2': {
      goal: 'Walk with Sogolon from the gate to the king’s court.',
      hint: 'Meet the two hunters at the gate and walk beside the woman with them.',
    },
  }),
  quest(3, 'The Boy Who Couldn’t Walk', {
    'a05-03-s1': {
      goal: 'Visit Sogolon’s house and keep her son company.',
      hint: 'Sogolon’s house is the small one at the back of the royal yard.',
    },
    'a05-03-s2': {
      goal: 'Go with Sogolon to ask Queen Sassouma for baobab leaves.',
      hint: 'Walk with Sogolon across the yard to the queen mother’s house.',
    },
  }),
  quest(4, 'The Iron Rod', {
    'a05-04-s1': {
      goal: 'Run to the smiths with Sogolon’s message.',
      hint: 'The forges are down by the river, where the smoke is blackest.',
    },
    'a05-04-s2': {
      goal: 'Watch the boy stand.',
      hint: 'Stand with Balla at the edge of the crowd outside Sogolon’s door.',
    },
    'a05-04-s3': {
      goal: 'Gather the baobab’s leaves for Sogolon.',
      hint: 'Pick up the leaves around the baobab now standing at Sogolon’s door.',
    },
  }),
  quest(5, 'The Griot', {
    'a05-05-s1': {
      goal: 'Stand witness when Balla is given to Sundiata as his griot.',
      hint: 'Meet Doua and Balla at the hunters’ clearing outside the town.',
    },
    'a05-05-s2': {
      goal: 'Let Balla teach your Nubbin a tune on the balafon.',
      hint: 'Sit your Nubbin at the balafon by Balla’s house and choose the tune it learns.',
    },
  }),
  quest(6, 'Exile', {
    'a05-06-s1': {
      goal: 'Keep watch in Sogolon’s vegetable garden at night.',
      hint: 'Hide behind the gourd vines with Sundiata and wait for the visitors.',
    },
    'a05-06-s2': {
      goal: 'Say goodbye to Balla before he is sent away.',
      hint: 'Find Balla at the palace gate, where the king’s envoys are setting out.',
    },
    'a05-06-s3': {
      goal: 'Leave Niani with Sogolon’s family before dawn.',
      hint: 'Meet Sogolon and her children at the west gate in the dark.',
    },
  }),
  quest(7, 'Kingdom to Kingdom', {
    'a05-07-s1': {
      goal: 'Watch Sundiata play the king of Djedeba at wori.',
      hint: 'Sit by the game board in the king’s yard, and watch Kolonkan.',
    },
    'a05-07-s2': {
      goal: 'Sit in on the council of the king of Wagadou.',
      hint: 'Go into Wagadou’s council house with Sundiata and keep quiet at the back.',
    },
    'a05-07-s3': {
      goal: 'Walk the long road with the family.',
      hint: 'Keep pace with Sogolon at the back of the line.',
    },
  }),
  quest(8, 'Mema', {
    'a05-08-s1': {
      goal: 'Watch Sundiata ride out with the army of Mema.',
      hint: 'Climb the watch-mound by Mema’s wall and watch the horsemen.',
    },
    'a05-08-s2': {
      goal: 'Sit with Sogolon.',
      hint: 'She is resting on the mat in the shade behind the house. Just sit.',
    },
  }),
  quest(9, 'The Sorcerer King', {
    'a05-09-s1': {
      goal: 'Follow the atlas back to Sosso, and find Balla.',
      hint: 'The atlas has turned its own pages. Look for Balla inside Sosso’s tower.',
    },
    'a05-09-s2': {
      goal: 'Stand by Balla in Soumaoro’s secret chamber.',
      hint: 'Stay behind Balla at the great balafon. Don’t touch the owls.',
    },
    'a05-09-s3': {
      goal: 'Watch from the tower as Sosso’s army marches on Manding.',
      hint: 'Stand at the tower window with Balla.',
    },
  }),
  quest(10, 'The Call Home', {
    'a05-10-s1': {
      goal: 'Help Kolonkan at her market stall.',
      hint: 'Kolonkan sells greens from home in Mema’s market. Mind the stall with her.',
    },
    'a05-10-s2': {
      goal: 'Pack Sundiata’s basket for the king of Mema.',
      hint: 'Find the three things Sundiata asks for around the old house, and put them in the basket.',
    },
  }),
  quest(11, 'Tabon', {
    'a05-11-s1': {
      goal: 'Greet the kings who come to join Sundiata.',
      hint: 'Stand with Manding Bory at the camp gate and welcome each king in.',
    },
    'a05-11-s2': {
      goal: 'Watch the battle from the ridge.',
      hint: 'Climb the ridge above the pass and stay there with the drummers.',
    },
    'a05-11-s3': {
      goal: 'Sit in on Sundiata’s council fire.',
      hint: 'The council sits at the big fire in the middle of the camp.',
    },
  }),
  quest(12, 'The Secret', {
    'a05-12-s1': {
      goal: 'Keep the night watch at the edge of the camp.',
      hint: 'Sit by the watch fire at the camp’s edge and wait.',
    },
    'a05-12-s2': {
      goal: 'Give Balla back everything you kept for him.',
      hint: 'Sit with Balla by the fire and tell him the list.',
    },
    'a05-12-s3': {
      goal: 'Hear Nana Triban tell Soumaoro’s secret.',
      hint: 'Join the council in Sundiata’s tent.',
    },
  }),
  quest(13, 'Kirina', {
    'a05-13-s1': {
      goal: 'Welcome Fakoli and his smiths into the camp.',
      hint: 'Meet Fakoli at the camp gate with Balla.',
    },
    'a05-13-s2': {
      goal: 'Watch the arrow at Kirina.',
      hint: 'Stand with Balla on the rise behind Sundiata’s lines.',
    },
    'a05-13-s3': {
      goal: 'Follow Sundiata into the hills, to the cave.',
      hint: 'Climb the rocky path into the hills behind the plain.',
    },
  }),
  quest(14, 'The Assembly', {
    'a05-14-s1': {
      goal: 'Go to the great assembly at Kurukan Fuga.',
      hint: 'Walk with Balla to the wide clearing where the kings are gathering.',
    },
    'a05-14-s2': {
      goal: 'Choose what you ask Balla to remember.',
      hint: 'Find Balla at the edge of the ring, where the griots sit.',
    },
  }),
];

/** Every `edu:` check string used in this file. */
export const CHECKS: string[] = ['edu:order:journey:gate-wori-wagadou-mema'];
