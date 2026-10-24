/**
 * The Learning Grove, sprout band (ages 3–6, read aloud by a grown-up): Atlas page A18, The Doll in
 * the Pocket (the East Slavic folk tale of Vasilisa the Fair).
 *
 * Source: atlas-a18.ts (ATLAS_A18 and ATLAS_A18_VARIANTS). One EduScene per original scene, id
 * `sprout:<original id>`, with the same choice ids and `set` flags (so `a18-crust` still works).
 * Every step scene, done scene, complete scene and variant has a version, each with one lesson.
 *
 * What it teaches (outline: flax to linen, birch woods, why the sky changes, the tale told in many
 * places, sharing food as care): the order flax becomes linen (pull, soak, spin, weave, bleach in
 * the sun), birch trees and the cold lands where they grow, day and night (the three riders),
 * that the same story is told in many places and by many families, and that sharing food is a way
 * of caring. Plus counting, rhymes, first sounds, feelings and a little science.
 *
 * Left out or softened for this age (EDU-STYLE.md, “Hard things”; the outline’s care notes):
 * - No quotes from the tale or its translation: every lifted line is replaced by new words.
 * - Vasilisa’s mother dies, said plainly in A18-1: “her body stopped working, and it will not start
 *   again”, with the comfort straight after (sitting beside her). The illness is never named.
 * - The fence is “white sticks with glowing round lanterns”. The skull is “a lantern with a face”,
 *   like a pumpkin lantern. No bone or burning. The stepmother and her daughters run away from
 *   its steady light in the night and do not come back: nobody is hurt.
 * - Baba Yaga is big and grumpy and fair. She sets work, pays for work and keeps her word. The
 *   outline’s “Russian smell” rhyme is cut, as in the original.
 * - Culture: a folk-tale village with birch woods, wooden houses and a Tsar of the tale. No country,
 *   flags or state symbols. The tale is told in many East Slavic places, and Baba Yaga is in
 *   Ukrainian, Belarusian and Polish stories too (said in A18-12, kept brief and respectful).
 * - The mother’s blessing is “her love”. The doll’s “pray” is left out.
 * - Choices are all kept with their ids and flags, reworded kindly, so no `defaultChoice` is
 *   needed.
 * - Facts used: wooden houses are built from logs; candles make light; plants need water and
 *   light; summer days are longer than winter days; cold breath makes a little cloud; owls are
 *   awake at night; the Earth turns, so we have day and night; birch bark is white and peels in
 *   papery strips; birches grow in cool lands; flax is a plant with blue flowers whose stems make
 *   linen; linen is made by pulling, soaking, spinning, weaving and bleaching in the sun; oats are
 *   a grain (a seed).
 */
import type { EduDomain, EduQuest, EduScene, Lesson } from './types';
import type { Line, Choice } from '../config/story';

type Mood = NonNullable<Line['mood']>;
const say =
  (who: string) =>
  (text: string, mood?: Mood): Line =>
    mood ? { who, text, mood } : { who, text };

// ---------------------------------------------------------------- speakers
const N = say('narrator');
const Y = say('you');
const V = say('a18-vasilisa');
const MO = say('a18-mother');
const MER = say('a18-merchant');
const STEP = say('a18-stepmother');
const ELD = say('a18-elder');
const YNG = say('a18-younger');
const DOLL = say('a18-doll');
const SU = say('a18-suitor');
const BY = say('a18-yaga');
const OLD = say('a18-old-woman');
const TS = say('a18-tsar');

// ---------------------------------------------------------------- builders
type Beat = Omit<Lesson, 'id'>;
type Opt = NonNullable<Lesson['options']>[number];

const words = (t: string) => t.trim().split(/\s+/).length;

/**
 * Keeps lesson lines and choice replies to 14 words or fewer and two sentences or fewer, as the
 * sprout band requires: a long line is cut at sentence ends into several lines by the same
 * speaker (the mood stays on the first). Scene lines are written short by hand, so their
 * indexes (which lessons use) never move.
 */
const sp = (lines: Line[]): Line[] => {
  const out: Line[] = [];
  const real = (s: string) => words(s.replace(/[.!?…)]+$/, '')) > 1;
  for (const l of lines) {
    const sentences = l.text.split(/(?<=[.!?”)])\s+(?=[A-Z“(])/);
    const chunks: string[][] = [];
    for (const s of sentences) {
      const last = chunks[chunks.length - 1];
      const count = last ? last.filter(real).length : 0;
      if (last && words(last.join(' ')) + words(s) <= 14 && count + (real(s) ? 1 : 0) <= 2)
        last.push(s);
      else chunks.push([s]);
    }
    chunks.forEach((c, i) => {
      const text = c.join(' ');
      out.push(i === 0 && l.mood ? { who: l.who, text, mood: l.mood } : { who: l.who, text });
    });
  }
  return out;
};

/** One answer option. `best` marks the answer the lesson teaches. */
const o = (label: string, reply: Line[], best = false): Opt =>
  best ? { label, best, reply: sp(reply) } : { label, reply: sp(reply) };

const std = (standard?: string) => (standard ? { standard } : {});

/** An ask lesson. */
const ask = (
  after: number,
  domain: EduDomain,
  skill: string,
  standard: string | undefined,
  prompt: Line[],
  options: Opt[],
  parentNote: string,
): Beat => ({
  domain,
  skill,
  ...std(standard),
  kind: 'ask',
  after,
  prompt: sp(prompt),
  options,
  parentNote,
});

/** A notice lesson: a character shares something true. */
const notice = (
  after: number,
  domain: EduDomain,
  skill: string,
  standard: string | undefined,
  lines: Line[],
  parentNote: string,
): Beat => ({
  domain,
  skill,
  ...std(standard),
  kind: 'notice',
  after,
  lines: sp(lines),
  parentNote,
});

/** A do lesson: the child does something in the Grove. */
const doit = (
  after: number,
  domain: EduDomain,
  skill: string,
  standard: string | undefined,
  check: string,
  lines: Line[],
  parentNote: string,
): Beat => ({
  domain,
  skill,
  ...std(standard),
  kind: 'do',
  after,
  check,
  lines: sp(lines),
  parentNote,
});

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

/** A choice, with the original id (and `set` flags where the original has them). */
const ch = (id: string, label: string, then: Line[], set?: Choice['set']): Choice => ({
  id,
  label,
  ...(set ? { set } : {}),
  then: sp(then),
});

const quest = (
  of: string,
  title: string,
  goals: EduQuest['goals'],
  scenes: EduScene[],
): EduQuest => ({ id: `sprout:${of}`, of, band: 'sprout', title, goals, scenes });

// ================================================================== A18-1 The Counterpane
const A01 = quest(
  'a18-01',
  'The Counterpane',
  {
    'a18-01-s1': {
      goal: 'Step into the painted page. Knock at the merchant’s house.',
      hint: 'Touch the page. Then walk up to the wooden house.',
    },
    'a18-01-s2': {
      goal: 'Walk Vasilisa to her mother’s door. Wait there.',
      hint: 'Stand at the door with your Nubbin. Don’t go in.',
    },
  },
  [
    sc(
      'a18-01-house',
      [
        N('The atlas opens to a painted page. It is yellow and black.'),
        N('Pop! You step inside. A wooden house, with snow at its edges.'),
        N('A big man in a fur hat opens the door.'),
        MER('Come in! A friend of Nova’s can stay with us.', 'happy'),
        MER('My wife is poorly. We walk softly here.', 'sad'),
        N('A little girl peeks round his knee. She has a long plait.'),
        V('What is it? Does it eat?'),
      ],
      [
        doit(
          5,
          'literacy',
          'first sound of a name',
          'RF.K.2',
          'edu:say:first-sound:v',
          [
            MER('This is my girl, Vasilisa. Vvv-asilisa.'),
            N('(Say the first sound together: vvv. Now try: van, vase, vine.)'),
          ],
          'Said the first sound of a character’s name (v) and thought of other words that start with it.',
        ),
      ],
      [
        ch('eats', 'Say it is a Nubbin. It eats everything.', [
          V('Everything? Even burnt porridge?', 'happy'),
          N('Your Nubbin nods. Burnt bits are the best bits.'),
        ]),
        ch('itself', 'Let your Nubbin say hello.', [
          N('Your Nubbin sits on her shoe. She goes very still.'),
        ]),
        ch('name', 'Ask her name first.', [
          V('Manners say you go first. But I will tell you anyway.', 'think'),
        ]),
      ],
    ),
    sc(
      'a18-01-house-done',
      [
        V('I am Vasilisa. I will be kind to guests. Mostly.'),
        MER('Go and wash your hands, Vasilisa.', 'soft'),
        N('She goes up slowly. She keeps looking back at your Nubbin.'),
        N('The house is made of big logs, laid one on another.'),
      ],
      [
        ask(
          3,
          'social-studies',
          'long ago, houses were often made of wood',
          'D2.His.2.K-2',
          [N('This house is made of logs. Where do logs come from?')],
          [
            o('Trees', [N('Yes! Long ago, many houses were built from tree logs.', 'happy')], true),
            o('Clouds', [
              N('Not clouds. Logs come from trees. A forest gave this house its walls.'),
            ]),
            o('The sea', [N('Not the sea. Logs come from trees, cut from the forest.')]),
          ],
          'Learned that long ago many houses were built from logs, which come from trees.',
        ),
      ],
    ),
    sc(
      'a18-01-counterpane',
      [
        N('That evening, a soft voice calls Vasilisa.'),
        N('You walk her to the bedroom door. You wait there.'),
        N('Her mother sits up in bed. Her blanket is made of bright scraps.'),
        MO('Vasilisa, I am very poorly. I will not get better.', 'soft'),
        N('She takes out a little doll with a red scarf.'),
        MO('This doll is my love, in a small shape. Keep her close.'),
        MO('When you need help, give her food first. Then ask her.'),
        MO('Tell nobody about her, and she will help you.', 'soft'),
        V('Food first. Then ask. Tell nobody.', 'think'),
        N('Her mother looks at you. She does not send you away.'),
      ],
      [
        ask(
          8,
          'sel',
          'naming a big feeling',
          'ELOF: Social and Emotional Development',
          [N('Vasilisa’s mother is very poorly. How might Vasilisa feel?')],
          [
            o(
              'Sad and scared',
              [N('Yes. Vasilisa feels sad and scared. Those feelings are allowed.', 'soft')],
              true,
            ),
            o('Silly and giggly', [N('Not giggly. Look at her face. She is sad and scared.')]),
            o('Hungry for pie', [N('Not pie. Her heart is heavy. She is sad and scared.')]),
          ],
          'Named the feelings (sad and scared) that someone has when a person they love is very ill.',
        ),
      ],
      [
        ch('stay', 'Stay by the door.', [
          N('You stay. Your Nubbin sits on your foot and keeps still.'),
        ]),
        ch('step', 'Step back and give them room.', [
          N('Through the gap, her mother lays a hand on Vasilisa’s head.'),
        ]),
        ch('nod', 'Nod: you will look after her.', [
          MO('Thank you. She will need a friend.', 'soft'),
        ]),
      ],
    ),
    sc(
      'a18-01-counterpane-done',
      [
        N('Vasilisa comes out. Her hands are under her apron.'),
        V('I am not to show you. So I am not showing you.', 'sad'),
        N('She walks away slowly, holding her hands close.'),
        N('You look back at the bed. The blanket has six bright patches.'),
      ],
      [
        doit(
          3,
          'maths',
          'count patches to six',
          'K.CC.B.5',
          'edu:count:patches:6',
          [
            N('(Count the patches: two red, one blue, three yellow.)'),
            N('One, two, three, four, five, six. Six patches!'),
          ],
          'Counted a small group of patches to find how many there are altogether (six).',
        ),
      ],
    ),
    sc(
      'a18-01-complete',
      [
        N('In the night, Vasilisa’s mother dies.'),
        N('That means her body stopped working. It will not start again.'),
        N('In the morning, the merchant sits with his hat in his hands.'),
        N('Vasilisa sits on the bottom stair. Someone wrapped her mother’s blanket round her.'),
        N('You do not know what to say. So you sit beside her.'),
        N('Your Nubbin climbs up and sits too.'),
        V('I am sad. I think I am crying the right amount.', 'sad'),
        Y('I think so too.'),
        N('Her hand is closed round something small. She holds on all day.'),
      ],
      [
        ask(
          7,
          'sel',
          'what helps someone who is sad',
          'CASEL: Social awareness',
          [N('Vasilisa is very sad. What helps a sad friend?')],
          [
            o(
              'Sit beside them',
              [N('Yes. Sitting close shows you care. You do not need clever words.', 'soft')],
              true,
            ),
            o('Say stop crying', [N('Crying is allowed. Sitting beside them helps much more.')]),
            o('Walk away', [N('A sad friend feels better when someone stays. Sit beside them.')]),
          ],
          'Learned that sitting beside a sad friend is a good way to help, and that crying is allowed.',
        ),
      ],
    ),
  ],
);

// ================================================================== A18-2 Dollet, Eat
const A02 = quest(
  'a18-02',
  'Little Doll, Eat',
  {
    'a18-02-s1': {
      goal: 'Follow Vasilisa down to the cellar with a candle.',
      hint: 'Take the candle from the kitchen shelf and go after her.',
    },
    'a18-02-s2': {
      goal: 'Hold the light while Vasilisa feeds the doll. Keep still.',
      hint: 'Keep the candle steady. Don’t speak.',
    },
    'a18-02-s3': {
      goal: 'Learn how to set out the food. Make Vasilisa a promise.',
      hint: 'Lay the food in a row in front of the doll. Then answer Vasilisa.',
    },
  },
  [
    sc(
      'a18-02-supper',
      [
        N('Days pass. People bring pies, then go home.'),
        N('At supper, Vasilisa eats almost nothing.'),
        N('The best bits go into her apron: a crust, an egg, a honey cake.'),
        MER('Eat, little one. You are getting thin.', 'sad'),
        V('I am eating, Father. Look!', 'think'),
        N('She chews a tiny bit of turnip. Then she slips away.'),
        N('Your Nubbin looks at you. It saw the honey cake too.'),
      ],
      [
        ask(
          3,
          'health',
          'bodies need food and water to be strong',
          'ELOF: Perceptual, Motor, and Physical Development',
          [N('Vasilisa is not eating much. What does a body need to feel strong?')],
          [
            o(
              'Food and water',
              [N('Yes! Good food and water give a body energy to play, work and grow.', 'happy')],
              true,
            ),
            o('Only pie', [N('Pie is yummy. But a body needs many foods, and water too.')]),
            o('Nothing at all', [N('Everybody needs food and water. Without them we feel weak.')]),
          ],
          'Talked about what a body needs to feel strong: food and water.',
        ),
      ],
      [
        ch('follow', 'Take the candle and follow her.', [
          N('The cellar door is open a crack. Below, a very small voice.'),
        ]),
        ch('finish', 'Finish your supper, then follow.', [
          N('You finish. Then you take the candle down after her.'),
          N('She was waiting in the dark for somebody with a light.'),
        ]),
      ],
    ),
    sc(
      'a18-02-supper-done',
      [
        V('Oh! It is you. Shut the door. Properly, it sticks.'),
        N('You shut it properly. Thud! It does stick.'),
        N('Door. Floor. They sound the same at the end.'),
      ],
      [
        doit(
          2,
          'literacy',
          'rhyming words',
          'RF.K.2',
          'edu:say:rhyme:door',
          [N('(Say door and floor. Can you find another word that rhymes? More? Store?)')],
          'Listened for the matching end sound in rhyming words (door, floor, more).',
        ),
      ],
    ),
    sc(
      'a18-02-cellar',
      [
        N('Vasilisa kneels between the potatoes and the pickle jars.'),
        N('She sets the doll down. Before it, she lays the crust, egg and cake.'),
        V('Little doll, please eat. I am very sad.', 'sad'),
        V('Mother died. Father is sad. What do I do?', 'sad'),
        N('The doll’s painted eyes begin to glow, soft and warm.'),
        N('The food is gone. Your Nubbin leans in, and the cake is gone too!'),
        DOLL('Do not be afraid, Vasilisa. You do not carry this alone.', 'soft'),
        DOLL('Go up and sleep. Tomorrow you will feel a little lighter.'),
        N('Your Nubbin stares at the doll. The doll stares back.'),
        V('She ate! She always eats. Mother said she would.', 'happy'),
      ],
      [
        ask(
          7,
          'sel',
          'how to help a sad friend',
          'CASEL: Relationship skills',
          [N('Vasilisa feels sad and alone. What helps?')],
          [
            o(
              'Stay close and listen',
              [N('Yes. Staying close and listening is how the doll helps.', 'soft')],
              true,
            ),
            o('Say hurry up', [N('Sad feelings need time. Staying close and listening helps.')]),
            o('Go away', [N('Going away leaves a sad friend alone. Stay close and listen.')]),
          ],
          'Practised choosing to stay close and listen when a friend is sad.',
        ),
      ],
      [
        ch('still', 'Keep the candle very still.', [
          N('The flame does not even lean. Vasilisa gives you a tiny nod.'),
        ]),
        ch('closer', 'Let your Nubbin go closer.', [
          N('Your Nubbin sniffs the doll. The doll lets it.'),
        ]),
      ],
    ),
    sc(
      'a18-02-cellar-done',
      [
        V('She will not help on an empty tummy. Mother said so.'),
        V('Nobody should have to.', 'soft'),
        N('Your candle makes a little ring of light in the dark cellar.'),
      ],
      [
        notice(
          2,
          'science',
          'we see things when there is light',
          '1-PS4-2',
          [
            N('A candle makes light. Light helps us see.'),
            N(
              'In a dark cellar, we cannot see much. Candles are hot, so only grown-ups hold them.',
            ),
          ],
          'Heard that we see things because there is light, and that a candle flame is hot.',
        ),
      ],
    ),
    sc(
      'a18-02-promise',
      [
        V('You saw. Now you must learn it properly.'),
        V('The best bits. First, before I have mine.'),
        V('Put them in a row, so she can see them all.'),
        N('She shows you twice. Your Nubbin watches as if there will be a test.'),
        V('Now promise. Never tell. Not Father. Not anybody.', 'think'),
        V('You are not anybody. You are my guest. I decided.'),
      ],
      [
        doit(
          2,
          'maths',
          'count three things in a row',
          'K.CC.B.5',
          'edu:count:morsels:3',
          [
            N('(Lay three things in a row: a crust, an egg, a cake. Count them.)'),
            N('One, two, three. Three morsels for the doll!'),
          ],
          'Laid out objects in a row and counted them to find how many (three).',
        ),
      ],
      [
        ch('promise', 'Promise. Never, not anybody.', [
          V('Good. Shake.'),
          N('Her hand is very small and very serious.'),
        ]),
        ch('cross', 'Cross your heart, and your Nubbin’s too.', [
          N('Your Nubbin giggles. Vasilisa says that counts double.'),
        ]),
        ch('why', 'Ask why it is a secret.', [
          V('People want things that help. And Mother said so. Promise.', 'think'),
          N('You promise.'),
        ]),
      ],
    ),
    sc(
      'a18-02-promise-done',
      [
        N('Climbing the steps, you think of a rule in Gran Hazel’s writing.'),
        N('Feed them before you feed yourself.', 'soft'),
        N('Vasilisa gives her own best food away.'),
      ],
      [
        ask(
          2,
          'sel',
          'sharing food is a way of caring',
          'CASEL: Social awareness',
          [N('Why is sharing food a kind of care?')],
          [
            o(
              'It shows we care about them',
              [N('Yes. Sharing food says: you matter to me.', 'happy')],
              true,
            ),
            o('It is only a rule', [
              N('A rule is not the reason. Caring is. Sharing says: you matter.'),
            ]),
            o('It makes food bigger', [
              N('Food gets smaller when it is shared. But hearts get warmer.'),
            ]),
          ],
          'Talked about how sharing food shows that we care about someone.',
        ),
      ],
    ),
    sc(
      'a18-02-complete',
      [
        N('After that, the best bits of supper go missing.'),
        N('Vasilisa is a little thin. But she sleeps well.'),
        N('In the mornings she sings while she plaits her hair.'),
        N('Some nights you take the napkin down yourself.'),
        N('You lay out the food in a row. You wait, and do not poke.'),
        N('The eyes glow. The food is gone.'),
        N('Your Nubbin checks the empty napkin every single time.'),
      ],
      [
        doit(
          2,
          'music',
          'feel a steady beat',
          'ELOF: Perceptual, Motor, and Physical Development',
          'edu:clap:beat:song',
          [
            N('Vasilisa’s song has a steady beat, like a heartbeat.'),
            N('(Pat your knees to the beat: pat, pat, pat, pat.)'),
          ],
          'Patted a steady beat along with a song.',
        ),
      ],
    ),
  ],
);

// ================================================================== A18-3 The Widow
const A03 = quest(
  'a18-03',
  'The Widow',
  {
    'a18-03-s1': {
      goal: 'Meet the merchant’s new wife and her daughters.',
      hint: 'Wait in the yard when the cart comes in at the gate.',
    },
    'a18-03-s2': {
      goal: 'Get up before dawn. See how the work is getting done.',
      hint: 'Go out to the garden before anyone else is up.',
    },
    'a18-03-s3': {
      goal: 'Help Vasilisa look busy when her stepmother comes round.',
      hint: 'When the back door opens, give Vasilisa something to be doing.',
    },
  },
  [
    sc(
      'a18-03-cart',
      [
        N('The atlas turns a page. It is spring, and the birches are green.'),
        MER('I have found a new wife. She has two daughters.', 'think'),
        N('A cart rolls in, piled with trunks. Three people sit on top.'),
        STEP('So this is the house. And this is the girl.'),
        ELD('She is very pretty.', 'angry'),
        YNG('Too pretty. It is not fair!', 'angry'),
        STEP('Pretty fades, my loves. Sun and wind and work will see to that.'),
        N('Vasilisa curtsies and says nothing. One hand is in her pocket.'),
      ],
      [
        ask(
          2,
          'maths',
          'heavier and lighter',
          'K.MD.A.2',
          [N('The trunks are huge. The hatbox is tiny. Which is heavier to carry?')],
          [
            o(
              'The big trunk',
              [N('Yes! The big trunk is heavier. The hatbox is light.', 'happy')],
              true,
            ),
            o('The tiny hatbox', [
              N('Look again. The big trunk is much heavier. The hatbox is light.'),
            ]),
          ],
          'Compared two objects by weight: the big trunk is heavier, the little hatbox lighter.',
        ),
      ],
      [
        ch('carry', 'Offer to carry a trunk.', [
          STEP('The guest may carry all of them.'),
          N('You carry them all. Your Nubbin carries a hatbox, eyes shut.'),
        ]),
        ch('beside', 'Stand beside Vasilisa.', [
          N('You stand beside her. The stepmother looks past you.'),
        ]),
      ],
    ),
    sc(
      'a18-03-cart-done',
      [
        STEP('Vasilisa will do the garden, the water, the stove and the floors.'),
        ELD('And we will do the sitting down.', 'happy'),
        N('Vasilisa curtsies again. In her pocket, something small is very still.'),
      ],
      [
        ask(
          1,
          'literacy',
          'words and voices that show feelings',
          'RL.1.4',
          [N('The elder sister says it in a sneery voice. How does she sound?')],
          [
            o(
              'Unkind',
              [N('Yes. A sneery voice sounds unkind. Words and voices show feelings.', 'soft')],
              true,
            ),
            o('Kind', [N('Listen again. A sneery voice is not kind. It sounds unkind.')]),
            o('Sleepy', [N('Not sleepy. A sneery voice sounds unkind.')]),
          ],
          'Noticed how a voice and words can show a feeling, such as unkindness.',
        ),
      ],
    ),
    sc(
      'a18-03-dawn',
      [
        N('Before dawn you creep to the garden in your socks.'),
        N('Vasilisa sits under the apple tree making a flower crown.'),
        N('The beds are weeded. The water barrels are full.'),
        N('Smoke curls from the kitchen chimney. The stove is hot.'),
        V('Shh! I fed the doll and asked. She said sleep, so I did.', 'happy'),
        N('In the cabbage bed, the doll pulls up the last dandelion.'),
        N('Your Nubbin helps, and they tumble backwards. Pop! It comes out.'),
        N('Vasilisa puts the crown on your Nubbin. The morning begins.'),
      ],
      [
        ask(
          3,
          'science',
          'plants need water and light',
          'K-LS1-1',
          [N('The garden beds are full of plants. What do plants need to grow?')],
          [
            o(
              'Water and sunlight',
              [N('Yes! Plants drink water and use sunlight to grow.', 'happy')],
              true,
            ),
            o('Only sweets', [N('Plants do not eat sweets. They need water and sunlight.')]),
            o('Nothing at all', [N('Every plant needs water and sunlight to grow.')]),
          ],
          'Learned that plants need water and sunlight to grow.',
        ),
      ],
    ),
    sc(
      'a18-03-dawn-done',
      [
        V('Now I have to look tired. Can you look tired? I cannot.', 'think'),
        N('Vasilisa keeps a happy secret. It keeps her safe.'),
      ],
      [
        notice(
          1,
          'sel',
          'happy secrets and secrets that scare you',
          'CASEL: Responsible decision-making',
          [
            N('A happy secret is fine. It is like a surprise party.'),
            N('But if a secret makes you scared or sad, tell a grown-up you trust.'),
          ],
          'Heard that happy secrets are fine, and that a secret that feels scary should be told to a trusted grown-up.',
        ),
      ],
    ),
    sc(
      'a18-03-busy',
      [
        N('The back door bangs. The stepmother comes out with her daughters.'),
        STEP('Is the garden done? Is the water in? I do not think so.'),
        N('Vasilisa holds a flower crown and nothing else. She looks at you.'),
        ELD('She was picking flowers! She has pollen on her nose!', 'angry'),
        STEP('Where is your hoe, girl? Where is your bucket?', 'angry'),
        N('You have about one second.'),
      ],
      [
        ask(
          2,
          'health',
          'sun safety',
          'ELOF: Perceptual, Motor, and Physical Development',
          [N('Working in the sun all day can make skin hot and sore. What helps?')],
          [
            o(
              'A hat, shade and water',
              [N('Yes! A hat, a shady rest and a drink keep you safe.', 'happy')],
              true,
            ),
            o('Nothing at all', [N('Too much sun can hurt. A hat, some shade and water help.')]),
            o('A big winter coat', [N('Too hot! A hat, some shade and water are better.')]),
          ],
          'Learned that a hat, shade and water help keep us safe when we are out in the sun.',
        ),
      ],
      [
        ch('bucket', 'Hand her an empty bucket.', [
          N('She swings it as if it were full. A very good act.'),
          STEP('Hm. Carry on, then.'),
        ]),
        ch('splash', 'Splash water on her apron.', [
          N('Splash! She looks wet and tired. Perfect.'),
          YNG('She is all wet! Ha!', 'happy'),
        ]),
        ch('weed', 'Make your Nubbin stand still like a weed.', [
          N('Your Nubbin freezes in the cabbages. The stepmother walks right past.'),
        ]),
      ],
    ),
    sc(
      'a18-03-busy-done',
      [
        N('The stepmother walks round the garden. She finds nothing wrong.'),
        N('This makes her crosser than anything.'),
        STEP('Sun and wind. Every day. We shall see.', 'angry'),
      ],
      [
        ask(
          1,
          'social-studies',
          'sharing jobs fairly',
          'D2.Civ.8.K-2',
          [N('In a house, who should do the jobs? Should one person do all of them?')],
          [
            o(
              'Everybody shares the jobs',
              [N('Yes. Sharing the jobs is fair. Many hands make light work.', 'happy')],
              true,
            ),
            o('One person does everything', [
              N('That is not fair. One person gets worn out. Sharing is fair.'),
            ]),
          ],
          'Talked about fairness: in a home, jobs should be shared.',
        ),
      ],
    ),
    sc(
      'a18-03-complete',
      [
        N('Spring turns into summer. Every morning the work is done.'),
        N('Every evening the best bits go down to the cellar.'),
        N('The sisters sit in the shade. They grow pale and sour.'),
        N('Vasilisa works in the sun, or seems to. She grows strong.'),
        ELD('It is not fair. She works and gets prettier.', 'angry'),
        N('Your Nubbin, napping in the cabbages, looks well too.'),
      ],
      [
        ask(
          1,
          'science',
          'summer days are longer than winter days',
          '1-ESS1-2',
          [N('It is summer now. Are summer days longer or shorter than winter days?')],
          [
            o(
              'Longer',
              [N('Yes! In summer the sun stays up longer. There is more daylight.', 'happy')],
              true,
            ),
            o('Shorter', [N('Winter days are the short ones. Summer days are longer.')]),
          ],
          'Learned that summer days have more daylight than winter days.',
        ),
      ],
    ),
  ],
);

// ================================================================== A18-4 Suitors
const A04 = quest(
  'a18-04',
  'Suitors',
  {
    'a18-04-s1': {
      goal: 'Step back into the page, some years on.',
      hint: 'Turn the atlas page. Walk up the path to the gate.',
    },
    'a18-04-s2': {
      goal: 'See what the stepmother says to the young men at the gate.',
      hint: 'Stand near the gate and listen.',
    },
    'a18-04-s3': {
      goal: 'Hold the gate for the last young man. See him go.',
      hint: 'Open the gate when he knocks. You cannot let him in.',
    },
  },
  [
    sc(
      'a18-04-years',
      [
        N('The atlas turns many pages. Whoosh, like birds taking off.'),
        N('The birches are twice as tall now. The swing is too small.'),
        N('Vasilisa comes down the path. She is grown up, taller than you.'),
        V('You have not changed at all! Not a hair!', 'shock'),
        N('Your Nubbin walks round her twice, puzzled.'),
        V('I am glad. Everything else changes. It is nice when something stays.', 'soft'),
        V('Stay a while? Young men keep knocking at the gate.'),
      ],
      [
        ask(
          4,
          'maths',
          'taller and shorter',
          'K.MD.A.2',
          [N('Vasilisa was small. Now she is tall. Who is taller now, you or Vasilisa?')],
          [
            o('Vasilisa', [N('Yes! She is taller than you now. She has grown.', 'happy')], true),
            o('You', [N('Look again. Vasilisa has grown. She is taller than you now.')]),
          ],
          'Compared two heights and saw that a person who has grown is taller.',
        ),
      ],
      [
        ch('knocking', 'Ask who is knocking.', [
          V('Young men. For me. Not for my sisters.', 'think'),
          V('One brought a goose. He hoped the goose would do the talking.'),
          N('Your Nubbin looks round for the goose. It has time for geese.'),
        ]),
        ch('pocket', 'Ask quietly about her pocket.', [
          V('Still there. She says hello.'),
          N('The doll did not say it. Vasilisa is being kind.'),
        ]),
      ],
    ),
    sc(
      'a18-04-years-done',
      [
        N('Behind her, down at the gate, somebody is knocking.'),
        N('Knock, knock, knock! Wood makes a sound when it is tapped.'),
      ],
      [
        doit(
          1,
          'science',
          'tapping makes sound; hard is louder',
          '1-PS4-1',
          'edu:tap:sound:soft-loud',
          [N('(Tap a table softly. Then tap it hard. Which sound is louder?)')],
          'Tapped softly and hard and heard that harder taps make louder sounds.',
        ),
      ],
    ),
    sc(
      'a18-04-gate',
      [
        N('At the gate stands a young man in a clean shirt.'),
        STEP('Who is it for? Not for my girls?', 'angry'),
        N('He goes pink. He says Vasilisa’s name.'),
        STEP('Go home. The youngest does not marry before the elders.'),
        STEP('That is the custom in this house.'),
        N('He goes. The next young man does not get a word in.'),
        ELD('Nobody comes for us. It is her face.', 'sad'),
        YNG('It is her fault for having it.', 'angry'),
        N('Upstairs, a window closes very quietly.'),
      ],
      [
        ask(
          4,
          'social-studies',
          'a custom is a way people always do things',
          'D2.His.2.K-2',
          [N('A custom is something a family does again and again. Which is a custom?')],
          [
            o(
              'Saying goodnight every evening',
              [
                N(
                  'Yes! Goodnight every evening is a custom. People keep customs for years.',
                  'happy',
                ),
              ],
              true,
            ),
            o('Dropping a spoon once', [
              N('Dropping a spoon was an accident. A custom happens again and again.'),
            ]),
          ],
          'Learned that a custom is something a family or village does again and again.',
        ),
      ],
    ),
    sc(
      'a18-04-gate-done',
      [
        STEP('Guest. You will keep that gate tomorrow. Nobody comes in for her.', 'angry'),
        N('Gate. Wait. Late. They all rhyme.'),
      ],
      [
        doit(
          1,
          'literacy',
          'rhyming words',
          'RF.K.2',
          'edu:say:rhyme:gate',
          [N('(Say gate, wait, late. Can you add one more? Plate? Skate?)')],
          'Said rhyming words that end like gate and added one of their own.',
        ),
      ],
    ),
    sc(
      'a18-04-last',
      [
        N('The next evening one more comes. He is younger, with mended sleeves.'),
        N('He holds a bunch of blue cornflowers.'),
        SU('Is she in? I walked from the mill. I only wanted to ask.'),
        N('The stepmother watches from one window. Vasilisa watches from another.'),
        SU('I suppose it is no. It was always going to be no.', 'sad'),
        N('Your Nubbin holds the gate with both paws, as if that could help.'),
      ],
      [
        ask(
          4,
          'sel',
          'being kind to someone who is disappointed',
          'CASEL: Social awareness',
          [N('The young man is sad. He walked a long way. What could you do?')],
          [
            o('Be kind to him', [N('Yes. A kind word helps when someone is sad.', 'soft')], true),
            o('Laugh at him', [N('Laughing hurts. A kind word helps a sad person.')]),
            o('Pretend not to see', [N('He is sad, and you can see it. A kind word helps.')]),
          ],
          'Chose kindness towards someone who is disappointed.',
        ),
      ],
      [
        ch('flowers', 'Say she would like the cornflowers.', [
          SU('Then give them to her. Do not say who.', 'soft'),
          N('He goes off lighter than he came.'),
        ]),
        ch('hold', 'Say nothing. Hold the gate.', [
          N('He nods to you like a friend. He walks away.'),
        ]),
        ch('market', 'Whisper about the market on Thursdays.', [
          N('He grins. The window bangs open.'),
          STEP('I heard that!', 'angry'),
          N('He runs. Your Nubbin runs after him, to be kind.'),
        ]),
      ],
    ),
    sc(
      'a18-04-last-done',
      [
        N('Later, in the cellar, Vasilisa thanks you for minding the gate.'),
        N('A blue cornflower lies on the step. Somebody left it there.'),
      ],
      [
        doit(
          1,
          'art',
          'guess, then try: blue and yellow paint make green',
          'ELOF: Scientific Reasoning',
          'edu:name:colour:green',
          [
            N('Cornflowers are blue. Dandelions are yellow.'),
            N('(What if we mix blue paint and yellow paint? Guess first.)'),
            N('(Now try it, or mix them in your mind. Green!)'),
          ],
          'Guessed what blue and yellow paint would make, then tried it and found green.',
        ),
      ],
    ),
    sc(
      'a18-04-complete',
      [
        N('That winter the knocking stops. Word has gone round the lanes.'),
        STEP('That girl is a trouble to this house.', 'angry'),
        N('She says it to the stove, but loudly.'),
        N('That night, Vasilisa feeds the doll and asks nothing. She just sits.'),
        N('You sit on the step above. Nobody says a word.'),
        N('That is what everybody needed.'),
      ],
      [
        ask(
          0,
          'social-studies',
          'how news travelled before phones',
          'D2.His.2.K-2',
          [N('Long ago there were no phones. How did news go round a village?')],
          [
            o(
              'People told each other',
              [N('Yes! People talked at gates and wells. News walked from mouth to ear.', 'happy')],
              true,
            ),
            o('Robots told everyone', [
              N('There were no robots. People told each other, one by one.'),
            ]),
          ],
          'Learned that before phones, news travelled by people telling each other.',
        ),
      ],
    ),
  ],
);

// ================================================================== A18-5 The House by the Forest
const A05 = quest(
  'a18-05',
  'The House by the Forest',
  {
    'a18-05-s1': {
      goal: 'Say goodbye to the merchant at his sledge.',
      hint: 'Meet him by the loaded sledge in the yard.',
    },
    'a18-05-s2': {
      goal: 'Help carry the household to the new house by the forest.',
      hint: 'Load the cart. Then walk beside it to the house by the birch wood.',
    },
    'a18-05-s3': {
      goal: 'Go into the birch wood with Vasilisa. Learn the path.',
      hint: 'Follow her into the trees and watch which way she turns.',
    },
  },
  [
    sc(
      'a18-05-journey',
      [
        N('A sledge stands in the yard, loaded with bales.'),
        N('Two horses breathe little clouds into the cold air.'),
        MER('A long road this time. Far towns. Many months.', 'think'),
        MER('Vasilisa is in my wife’s hands. And a little in yours.'),
        MER('Tell Nova I still do not know who won.', 'happy'),
        MER('She sold me needles. I sold her ribbons.'),
        MER('We both think we won.'),
        V('Bring me back something small, Father. For my pocket.'),
        MER('Something small for your pocket. I will remember.', 'soft'),
      ],
      [
        doit(
          1,
          'science',
          'warm breath makes a cloud in cold air',
          'ELOF: Scientific Reasoning',
          'edu:breathe:window:mist',
          [
            N('Cold air turns warm breath into a little cloud.'),
            N('(Breathe out slowly onto a cold window. Does it go misty?)'),
          ],
          'Saw that warm breath turns misty on something cold, like the horses’ breath in cold air.',
        ),
      ],
      [
        ch('promise', 'Promise to look after her.', [MER('Good. I believe you.', 'soft')]),
        ch('when', 'Ask when he will be back.', [
          MER('When the roads let me. Spring, if they are kind.', 'sad'),
        ]),
      ],
    ),
    sc(
      'a18-05-journey-done',
      [
        N('The sledge goes out of the gate and down the lane.'),
        N('The gate creaks behind it. Creeeak! A long, low creak.'),
      ],
      [
        doit(
          1,
          'music',
          'high and low sounds, made by shaking',
          '1-PS4-1',
          'edu:sing:high-low:creak',
          [
            N('(Make a long low creak with your voice. Now a short high squeak.)'),
            N('(Hand on your throat! Can you feel it shake as you make the sound?)'),
          ],
          'Made low and high sounds with their voice, copying the gate, and felt their throat shake as they did.',
        ),
      ],
    ),
    sc(
      'a18-05-move',
      [
        N('The merchant is hardly over the hill when the stepmother sells the house.'),
        STEP('Too big. Too dear. We will be snug at the edge of the wood.', 'happy'),
        N('Everything goes on one cart. You sit on top with your Nubbin.'),
        N('The new house stands where the lane ends. Behind it, a birch wood.'),
        N('The trunks are white, then grey, then dark.'),
        ELD('Everybody says a hut stands in there.', 'shock'),
        YNG('Everybody says somebody lives in it.'),
        STEP('Hush, both of you. It is only stories.', 'think'),
      ],
      [
        ask(
          4,
          'social-studies',
          'birch trees grow in cool lands',
          'D2.Geo.2.K-2',
          [N('Birch trees have white bark. Where do they grow best?')],
          [
            o(
              'In cool lands with cold winters',
              [N('Yes! Birch woods grow across cool lands, with snow in winter.', 'happy')],
              true,
            ),
            o('In a hot desert', [
              N('Too hot and dry. Birches like cool lands with snowy winters.'),
            ]),
          ],
          'Learned that birch trees grow in cool places, like the lands of this tale.',
        ),
      ],
    ),
    sc(
      'a18-05-move-done',
      [
        N('Vasilisa unpacks the blanket last. She puts it on her bed.'),
        N('Her hand goes to her pocket. It stays there.'),
      ],
      [
        ask(
          1,
          'sel',
          'what helps when you miss someone',
          'CASEL: Self-awareness',
          [N('The blanket was her mother’s. What can help when you miss someone?')],
          [
            o(
              'Hold something of theirs, or talk about them',
              [
                N(
                  'Yes. Holding something of theirs, or talking about them, helps us feel close.',
                  'soft',
                ),
              ],
              true,
            ),
            o('Pretend you do not miss them', [
              N('Missing someone is allowed. Holding something of theirs helps.'),
            ]),
          ],
          'Talked about how holding a keepsake or talking about someone helps when we miss them.',
        ),
      ],
    ),
    sc(
      'a18-05-errand',
      [
        STEP('Vasilisa. We need bark and mushrooms. Go deep into the wood.'),
        N('Vasilisa takes her basket. She feeds the doll in the cellar first.'),
        V('Come with me, this once? Then you will know the way.'),
        N('In the wood, every birch looks like the next. The moss is soft.'),
        N('Vasilisa touches her pocket. Then she turns, sure of the way.'),
        V('She tells me. Only after she has eaten.'),
        N('Far off, you see white sticks with round lights. Then a birch hides them.'),
      ],
      [
        ask(
          3,
          'health',
          'never eat wild mushrooms without a grown-up who knows',
          'ELOF: Perceptual, Motor, and Physical Development',
          [N('Wild mushrooms can make you very ill. What should you do if you find one?')],
          [
            o(
              'Ask a grown-up who knows',
              [N('Yes! Only a grown-up who really knows can say. Never taste it!', 'happy')],
              true,
            ),
            o('Taste a tiny bit', [
              N('Never taste wild mushrooms. They can make you ill. Ask a grown-up.'),
            ]),
            o('Give one to a friend', [N('Not to a friend either. Ask a grown-up who knows.')]),
          ],
          'Learned never to eat wild mushrooms and to ask a knowledgeable grown-up.',
        ),
      ],
      [
        ch('look', 'Look harder at the white sticks.', [
          V('Not today. We are here for mushrooms.'),
          N('She turns you round, gently.'),
        ]),
        ch('notch', 'Scratch a birch so you know the way.', [
          N('You scratch three trunks. Your Nubbin scratches a fourth.'),
        ]),
        ch('mushroom', 'Help pick mushrooms.', [
          N('You pick mushrooms. Your Nubbin picks one too.'),
          V('Wait! Oh. That one is safe. Phew!', 'shock'),
        ]),
      ],
    ),
    sc(
      'a18-05-errand-done',
      [
        N('The doll brings you both home by dusk with a full basket.'),
        N('The stepmother watches from the window. She does not look pleased.'),
        N('In the basket sit four red mushrooms and three brown ones.'),
      ],
      [
        doit(
          2,
          'maths',
          'add four and three',
          'K.OA.A.2',
          'edu:add:mushrooms:7',
          [
            N('(Count four red ones. Count three brown ones. How many altogether?)'),
            N('One, two, three, four, five, six, seven. Seven!'),
          ],
          'Added four and three by counting on to make seven.',
        ),
      ],
    ),
    sc(
      'a18-05-complete',
      [
        N('It goes on like that all summer.'),
        N('Vasilisa goes into the wood for bark and berries.'),
        N('Every time, she feeds the doll first. Every time, she comes home.'),
        STEP('That girl has more luck than sense.', 'angry'),
        ELD('Or something in her pocket.', 'think'),
        N('Vasilisa goes still. Then she laughs and shows them a handkerchief.'),
        N('They lose interest. That night you keep the cellar door till morning.'),
      ],
      [
        ask(
          2,
          'literacy',
          'what happens first in a story',
          'RL.K.3',
          [N('Every time Vasilisa goes in the wood, what does she do first?')],
          [
            o(
              'Feeds the doll',
              [N('Yes! First she feeds the doll. Then she goes.', 'happy')],
              true,
            ),
            o('Eats a pie', [N('Not a pie. First she feeds the doll.')]),
            o('Goes to sleep', [N('Not sleep. First she feeds the doll.')]),
          ],
          'Recalled what a character does first, which builds understanding of the order of events.',
        ),
      ],
    ),
  ],
);

// ================================================================== A18-6 One Candle
const A06 = quest(
  'a18-06',
  'One Candle',
  {
    'a18-06-s1': {
      goal: 'Sit with the family for an evening of work by one candle.',
      hint: 'Take your place at the table, near the candle.',
    },
    'a18-06-s2': {
      goal: 'See what happens to the candle.',
      hint: 'Stay at the table. It is about to go dark.',
    },
    'a18-06-s3': {
      goal: 'Set out the doll’s supper in the dark, the way Vasilisa taught you.',
      hint: 'Feel for the napkin. Lay the food in a row. Then wait.',
    },
  },
  [
    sc(
      'a18-06-evening',
      [
        N('An autumn evening. Rain taps the window.'),
        STEP('Work, all of you. Lace for you. A stocking for you. Vasilisa, spin.'),
        N('She puts out every fire. The lamp, the stove, all of them.'),
        STEP('One candle is enough.'),
        N('One candle on the table, and four people round it.'),
        N('Your Nubbin keeps trying to sit on the warm bit.'),
        N('Vasilisa’s spindle turns and turns. Her thread is thin and even.'),
      ],
      [
        ask(
          5,
          'health',
          'candle flames are hot: keep back and tell a grown-up',
          'ELOF: Perceptual, Motor, and Physical Development',
          [N('A candle flame is hot. What should we do near a candle?')],
          [
            o(
              'Keep back, and tell a grown-up',
              [N('Yes! Flames are hot. Keep back and tell a grown-up.', 'happy')],
              true,
            ),
            o('Touch the flame', [N('Ouch! Never touch a flame. Keep back and tell a grown-up.')]),
            o('Blow on it close up', [N('Too close is not safe. Keep back and tell a grown-up.')]),
          ],
          'Learned to keep away from a candle flame and to tell a grown-up.',
        ),
      ],
      [
        ch('wool', 'Hold the wool for the younger sister.', [
          YNG('Higher. No, lower. Oh, just like that. Thank you.', 'soft'),
          N('She nearly smiles. Then she remembers to be cross.'),
        ]),
        ch('candle', 'Keep your Nubbin off the candle.', [
          N('You lift it off the table three times. Then you just hold it.'),
        ]),
      ],
    ),
    sc(
      'a18-06-evening-done',
      [
        N('The elder sister looks at the candle. Then at her mother.'),
        N('Her mother nods, very slightly.'),
      ],
      [
        notice(
          1,
          'sel',
          'faces and nods can say things without words',
          'CASEL: Social awareness',
          [
            N('A nod can mean yes. A head shake can mean no.'),
            N('Faces and nods talk without words. Watch them to see how people feel.'),
          ],
          'Heard that nods and faces send messages without words, and that watching them helps us read feelings.',
        ),
      ],
    ),
    sc(
      'a18-06-wick',
      [
        ELD('This wick wants trimming. It is smoking.'),
        N('She snips, and the flame goes out. All the light is gone.'),
        ELD('Oh! Oh dear. By accident.', 'shock'),
        N('In the dark, your Nubbin climbs into your coat.'),
        N('Somebody walks into a chair.'),
        ELD('Sorry! Oh, it is a chair. Sorry, chair.', 'shock'),
        ELD('That was not me, by the way.'),
        STEP('Now what? No fire anywhere. We must have light.'),
        YNG('I am not going. I can see by my pins.'),
        ELD('Vasilisa can fetch it. Into the wood, to Baba Yaga!', 'angry'),
        N('Both sisters push her out into the dark.'),
      ],
      [
        notice(
          6,
          'science',
          'eyes open wide in the dark',
          'ELOF: Scientific Reasoning',
          [
            N('In the dark we cannot see well at first.'),
            N('But wait a little. The dark middle of your eye opens wide, and you see more.'),
          ],
          'Heard that our eyes open wider in the dark, so we see a little more after waiting.',
        ),
      ],
    ),
    sc(
      'a18-06-wick-done',
      [
        V('Wait for me at the cellar door. I have to ask somebody first.', 'soft'),
        N('It was not her idea. The sisters sent her, and that is not fair.'),
      ],
      [
        ask(
          1,
          'social-studies',
          'it is not fair to send one person into danger',
          'D2.Civ.8.K-2',
          [N('Is it fair to send one person to do something scary, and blame them?')],
          [
            o(
              'No, that is not fair',
              [N('Right. Fair people share the scary jobs, and never blame.', 'soft')],
              true,
            ),
            o('Yes, that is fair', [
              N('Look again. One person did nothing wrong. That is not fair.'),
            ]),
          ],
          'Talked about fairness: it is not fair to send one person into danger and then blame them.',
        ),
      ],
    ),
    sc(
      'a18-06-ask',
      [
        N('There is no light in the cellar. Only the shape of her kneeling.'),
        V('My hands are shaking. You do it. You know how.', 'sad'),
        N('You lay the food out by feel, in a row.'),
        N('Your Nubbin’s nose checks the row is straight. It is.'),
        V('Little doll, here is your supper. Please eat. I am frightened.', 'sad'),
        V('They are sending me to Baba Yaga for fire. What do I do?'),
        N('Two small lights come on. The supper goes, crumb by crumb.'),
        DOLL('Do not be afraid. Go where they send you. Keep me in your pocket.', 'soft'),
        V('In my pocket. All right.'),
        N('She puts the doll away and buttons the pocket.'),
      ],
      [
        ask(
          5,
          'sel',
          'what helps when you feel scared',
          'CASEL: Self-management',
          [N('Vasilisa is frightened. What helps when you feel scared?')],
          [
            o(
              'Tell someone, and take slow breaths',
              [
                N(
                  'Yes. Telling someone and breathing slowly helps a scared feeling shrink.',
                  'soft',
                ),
              ],
              true,
            ),
            o('Hide and tell nobody', [N('Hiding makes it grow. Telling someone helps.')]),
            o('Run away from everyone', [
              N('Running alone is not safe. Tell someone, and breathe slowly.'),
            ]),
          ],
          'Practised what helps with a scared feeling: telling someone and breathing slowly.',
        ),
      ],
      [
        ch('coming', 'Tell her you are coming too.', [
          V('I hoped you would. I was not going to ask.', 'soft'),
        ]),
        ch('coat', 'Put your scarf round her neck.', [
          V('Then you will be cold.'),
          Y('I have a Nubbin down my front. I am fine.'),
        ]),
        ch('nubbin', 'Let your Nubbin decide.', [
          N('Your Nubbin sits on Vasilisa’s foot, facing the door. That settles it.'),
        ]),
      ],
    ),
    sc(
      'a18-06-ask-done',
      [
        N('Up the cellar steps. Through the dark kitchen.'),
        N('Past three people who do not say goodbye.'),
      ],
      [
        doit(
          0,
          'maths',
          'count steps to six',
          'K.CC.B.4',
          'edu:count:steps:6',
          [N('(Count the steps as you climb: one, two, three, four, five, six.)')],
          'Counted six steps in order, matching each number to one step.',
        ),
      ],
    ),
    sc(
      'a18-06-complete',
      [
        N('Nobody brings a light to see you off.'),
        N('The back gate shuts behind you on its own.'),
        N('The birches are white, even in the dark. They look like quiet people.'),
        V('I know the way. She will tell me if I do not.', 'think'),
        N('Your Nubbin rides in your coat, with only its eyes out.'),
        N('In Vasilisa’s pocket, something small is awake.'),
      ],
      [
        doit(
          2,
          'literacy',
          'describing words',
          'RL.1.4',
          'edu:name:describing-words:birch',
          [
            N('White. Quiet. Tall. Those are describing words.'),
            N('(Say three describing words for the birch wood.)'),
          ],
          'Used describing words (white, quiet, tall) to talk about a place.',
        ),
      ],
    ),
  ],
);

// ================================================================== A18-7 The Three Riders
const A07 = quest(
  'a18-07',
  'The Three Riders',
  {
    'a18-07-s1': {
      goal: 'Walk through the birch wood all night with Vasilisa.',
      hint: 'Keep close behind her and turn when she turns.',
    },
    'a18-07-s2': {
      goal: 'Stand still and let the riders go by.',
      hint: 'Step off the path at dawn, and again at sunrise.',
    },
    'a18-07-s3': {
      goal: 'Reach the clearing at dusk. Let the last rider pass.',
      hint: 'Keep to the edge of the clearing. Hide your Nubbin if it wants hiding.',
    },
  },
  [
    sc(
      'a18-07-night',
      [
        N('All night you walk. There is no path, but Vasilisa is sure.'),
        N('Twice an owl floats over. Once something big passes, far away.'),
        N('The cold comes down. Your breath makes little clouds.'),
        V('Talk to me. Anything. Then I will not hear the wood.', 'sad'),
        V('If you hear hooves, stand still. Let them pass.', 'think'),
        N('Near the end of the dark, you hear hooves.'),
      ],
      [
        ask(
          1,
          'science',
          'owls are awake at night',
          'ELOF: Scientific Reasoning',
          [N('An owl floats over in the dark. When is an owl awake?')],
          [
            o(
              'At night',
              [N('Yes! Owls are awake at night. They sleep in the day.', 'happy')],
              true,
            ),
            o('Only at breakfast', [N('Owls do their hunting at night. They sleep in the day.')]),
          ],
          'Learned that owls are awake at night.',
        ),
      ],
      [
        ch('garden', 'Tell her about your gran’s garden.', [
          N('You whisper about the Grove, the pond, and a gran who grew things.'),
          V('She sounds like Mother. Not to look at. In the hands.', 'soft'),
        ]),
        ch('count', 'Count the birches with her.', [
          N('You count up to four hundred and twelve. Vasilisa says thirteen.'),
          N('Your Nubbin sneezes. That makes fourteen.'),
        ]),
        ch('hand', 'Hold her hand and say nothing.', [
          N('Her hand is cold and holds on hard. Then it warms.'),
        ]),
      ],
    ),
    sc(
      'a18-07-night-done',
      [N('Vasilisa stops. You stop.'), N('Your Nubbin holds its breath, to be safe.')],
      [
        doit(
          1,
          'health',
          'slow breathing to feel calm',
          'ELOF: Perceptual, Motor, and Physical Development',
          'edu:breathe:slow:3',
          [N('(Breathe in slowly through your nose. Blow out slowly. Do it three times.)')],
          'Practised three slow breaths, a way to feel calmer.',
        ),
      ],
    ),
    sc(
      'a18-07-white',
      [
        N('A rider comes at a walk, all in white, on a white horse.'),
        N('He passes. The sky goes from black to grey, then to milk.'),
        V('Morning! He brought the morning. Or it followed him.', 'shock'),
        N('The birds start. One, then all of them.'),
        N('Then a rider all in red, on a red horse. He trots by.'),
        N('The sun rises. Everything goes red, then gold, then bright day.'),
        V('White, then red. Somebody is counting out the day.', 'think'),
      ],
      [
        ask(
          5,
          'science',
          'the order of the day: dawn, sunrise, daytime',
          '1-ESS1-1',
          [N('The sky was dark, then grey, then gold. What comes next?')],
          [
            o('Daytime', [N('Yes! After the sun rises it is daytime.', 'happy')], true),
            o('Night time', [N('Night comes later. After the sun rises it is daytime.')]),
          ],
          'Put the parts of the day in order: dark, dawn, sunrise, daytime.',
        ),
      ],
      [
        ch('bow', 'Bow your head as he passes.', [
          N('You bow. The red rider does not notice. Or does not mind.'),
        ]),
        ch('wave', 'Let your Nubbin wave.', [
          N('Your Nubbin waves a paw. The red rider lifts one finger.'),
        ]),
      ],
    ),
    sc(
      'a18-07-white-done',
      [
        N('All day you walk. The wood gets older and darker.'),
        N('Two riders have passed. One more is coming.'),
      ],
      [
        doit(
          1,
          'maths',
          'add two and one',
          'K.OA.A.1',
          'edu:add:riders:3',
          [N('(Two riders have passed. One more is coming. How many riders in all? Three!)')],
          'Added two and one to make three, using the riders as the story objects.',
        ),
      ],
    ),
    sc(
      'a18-07-black',
      [
        N('At dusk you reach a clearing. A hut stands there, with a fence.'),
        N('Slow hooves. A rider all in black, on a black horse.'),
        N('Your Nubbin goes right down inside your coat. It shakes a little.'),
        N('The rider reaches the gate. Then he is gone.'),
        N('And night falls, all at once, like a lid.'),
        V('That was night! They were all one thing. Day, and sun, and night!', 'shock'),
      ],
      [
        notice(
          4,
          'science',
          'the Earth turns, so we have day and night',
          '1-ESS1-1',
          [
            N('The Earth turns slowly, like a spinning top.'),
            N('When our side faces the Sun, it is day. When it turns away, it is night.'),
          ],
          'Heard that the Earth turning gives us day and night.',
        ),
      ],
      [
        ch('hold', 'Put a hand over your Nubbin.', [
          N('You hold it through the wool. It stops shaking, mostly.'),
        ]),
        ch('hum', 'Hum something low for your Nubbin.', [
          N('You hum the Lantern Song. Soon Vasilisa hums it too.'),
        ]),
      ],
    ),
    sc(
      'a18-07-black-done',
      [N('Your Nubbin stays deep in your coat.'), N('It is not coming out for anybody.')],
      [
        ask(
          1,
          'sel',
          'how to comfort a scared friend',
          'CASEL: Social awareness',
          [N('Your Nubbin is scared. What could help?')],
          [
            o(
              'A warm hand and a gentle voice',
              [N('Yes. A warm hand and a gentle voice help most.', 'soft')],
              true,
            ),
            o('Shout boo', [N('Shouting makes fear bigger. A warm hand and gentle voice help.')]),
            o('Pull it out fast', [
              N('Let it come out when it is ready. Stay near, and be gentle.'),
            ]),
          ],
          'Chose a gentle way to comfort a frightened friend.',
        ),
      ],
    ),
    sc(
      'a18-07-complete',
      [
        N('In the dark round the hut, lights come on.'),
        N('Not in the windows. In the fence.'),
        V('That is her house. Everybody said.', 'sad'),
        N('Vasilisa touches her pocket. She squares her shoulders.'),
        N('She walks forward. You go with her, as you promised.'),
      ],
      [
        doit(
          0,
          'art',
          'a repeating colour pattern: white, red, black',
          'ELOF: Mathematics Development',
          'edu:make:pattern:white-red-black',
          [
            N('White rider, red rider, black rider. Every day, the same order.'),
            N('(Make a colour pattern: white, red, black, white, red… What comes next?)'),
          ],
          'Made a repeating colour pattern (white, red, black), like the three riders, and said what comes next.',
        ),
      ],
    ),
  ],
);

// ================================================================== A18-8 The Hut
const A08 = quest(
  'a18-08',
  'The Hut',
  {
    'a18-08-s1': {
      goal: 'Look at the fence round the hut. Don’t run.',
      hint: 'Walk up to the fence slowly. Your Nubbin can stay in your coat.',
    },
    'a18-08-s2': {
      goal: 'Stand your ground while Baba Yaga comes home.',
      hint: 'Stay beside Vasilisa by the gate. Keep still.',
    },
    'a18-08-s3': {
      goal: 'Answer Baba Yaga when she asks who you are.',
      hint: 'Speak up. She will know if you are fibbing.',
    },
  },
  [
    sc(
      'a18-08-fence',
      [
        N('The fence is made of white sticks, grey and smooth.'),
        N('On every stake sits a round lantern with eyes. The eyes glow.'),
        N('They all turn, slowly, to look at you.'),
        V('Do not look back at them. Look at the gate.', 'sad'),
        N('Your Nubbin looks back anyway. One lantern looks surprised.'),
        N('Behind the fence, the hut is old and black and leaning.'),
      ],
      [
        notice(
          0,
          'science',
          'wood left outside turns grey and smooth',
          'ELOF: Scientific Reasoning',
          [
            N('Wood left out in sun, rain and wind goes grey and smooth.'),
            N('The sticks are grey and smooth. That tells us they are very old.'),
          ],
          'Heard that wood left outdoors for a long time turns grey and smooth.',
        ),
      ],
      [
        ch('gate', 'Look at the gate, as she says.', [
          N('You look at the gate. It is only a gate. That helps.'),
        ]),
        ch('face', 'Turn your Nubbin’s face into your coat.', [
          N('It goes in with a small sigh. The lanterns watch the empty place.'),
        ]),
      ],
    ),
    sc(
      'a18-08-fence-done',
      [N('The trees begin to creak. Creeeak!'), N('The dry leaves all lift and turn over. Whisk!')],
      [
        doit(
          1,
          'literacy',
          'sound words',
          'ELOF: Language and Communication',
          'edu:say:sound-words:creak',
          [N('(Say the sound words together: creak, whisk, thump.)')],
          'Said sound words (creak, whisk, thump) and enjoyed how they sound like what they mean.',
        ),
      ],
    ),
    sc(
      'a18-08-mortar',
      [
        N('Out of the trees comes Baba Yaga, in a great stone mortar.'),
        N('She rows through the air with a pestle.'),
        N('Behind her she sweeps away her tracks with a broom.'),
        N('She lands by the gate. Thump! Every lantern rattles politely.'),
        BY('Hm! I smell somebody. Two somebodies, and something small and furry.', 'think'),
        BY('Who is there? I do not like waiting.', 'angry'),
        N('She is very old and very tall, with a nose like a hook.'),
        V('It is me, Granny. We need fire. We have none.'),
        BY('Work for me, and you shall have fire. If not, we shall see.', 'angry'),
      ],
      [
        notice(
          2,
          'science',
          'tracks show who has walked there',
          'ELOF: Scientific Reasoning',
          [
            N('Tracks are footprints. They show who has walked by.'),
            N('Baba Yaga sweeps hers away so nobody can follow!'),
          ],
          'Heard that footprints show who has passed, and why Baba Yaga sweeps hers away.',
        ),
      ],
    ),
    sc(
      'a18-08-mortar-done',
      [
        N('Vasilisa curtsies right down to the ground.'),
        N('Her hand does not go to her pocket, not where Baba Yaga can see.'),
      ],
      [
        ask(
          1,
          'sel',
          'being brave means doing it even when scared',
          'CASEL: Self-management',
          [N('Vasilisa is scared. But she curtsies and stays polite. Is she brave?')],
          [
            o(
              'Yes. Brave means doing it while scared',
              [N('Yes! Brave does not mean not scared. It means going on, even so.', 'happy')],
              true,
            ),
            o('No. Brave people are never scared', [
              N('Everybody gets scared. Being brave is going on anyway.'),
            ]),
          ],
          'Learned that being brave means carrying on even when you feel scared.',
        ),
      ],
    ),
    sc(
      'a18-08-who',
      [
        N('Baba Yaga bends down. Her nose nearly touches yours.'),
        BY('You are not from here. You smell of ponds. And fruit. And old paper.', 'think'),
        BY('Who are you? What do you want?'),
        N('Vasilisa holds your sleeve. The lanterns lean in to listen.'),
        N('Your Nubbin holds its breath again.'),
      ],
      [
        doit(
          2,
          'literacy',
          'say your name and one thing about you',
          'SL.K.1',
          'edu:say:name:self',
          [N('(Say your name out loud. Then say one thing you like.)')],
          'Practised introducing themselves: saying a name and one thing they like.',
        ),
      ],
      [
        ch('friend', 'I am her friend. I stay at her father’s house.', [
          BY('A friend. Friends are rarer than guests. Fine.'),
        ]),
        ch('keeper', 'A Keeper. I look after small things.', [
          BY('Do you? So do I, in my way. You would not like my way.', 'happy'),
        ]),
        ch('peek', 'Let your Nubbin peek out.', [
          N('Your Nubbin pops its head out and looks at her.'),
          BY('Never seen one of you. I have seen everything, so that is something.', 'think'),
        ]),
      ],
    ),
    sc(
      'a18-08-who-done',
      [
        BY('Same rules for you as for her. Work, and you go home.', 'angry'),
        N('She lifts one hand. The gate swings open.'),
        N('Clack, clack, clack, clack. Four bolts slide back.'),
      ],
      [
        doit(
          2,
          'maths',
          'count four sounds',
          'K.CC.B.4',
          'edu:count:bolts:4',
          [N('(Clap along as you count the clacks: one, two, three, four!)')],
          'Counted four clacks, matching a number to each sound.',
        ),
      ],
    ),
    sc(
      'a18-08-complete',
      [
        BY('In! Do not stand there letting the night in.'),
        N('Inside, the hut is hot and smoky. Pots and herbs hang everywhere.'),
        N('A great white stove takes up half the room.'),
        N('Baba Yaga stretches on a bench and puts her feet up.'),
        BY('I am home and hungry. Bring me everything in the oven.', 'happy'),
      ],
      [
        notice(
          2,
          'social-studies',
          'long ago a big stove warmed the home and cooked the food',
          'D2.His.2.K-2',
          [
            N('In cold lands long ago, a big stove warmed the whole room.'),
            N(
              'It baked bread and cooked supper. Some families even slept on top, where it was warmest.',
            ),
          ],
          'Heard how a big stove heated a home and cooked food in cold lands long ago.',
        ),
      ],
    ),
  ],
);

// ================================================================== A18-9 Supper for Ten
const A09 = quest(
  'a18-09',
  'Supper for Ten',
  {
    'a18-09-s1': {
      goal: 'Help Vasilisa carry Baba Yaga’s supper to the table.',
      hint: 'Bring dish after dish out of the great white stove.',
    },
    'a18-09-s2': {
      goal: 'Decide who has your crust.',
      hint: 'There is one crust and a long day tomorrow. Choose.',
    },
  },
  [
    sc(
      'a18-09-supper',
      [
        N('Out of the stove come pots, and pots, and pots.'),
        N('Vasilisa carries, you carry, and your Nubbin carries a spoon.'),
        N('Soup, pork, pies, porridge, a goose, and three big jugs.'),
        BY('More! Look in the back. There is always something at the back.', 'happy'),
        N('She eats like the wind crossing a field. All of it!'),
        N('Your Nubbin watches the goose go. It puts a paw on its heart.'),
        BY('What? It was a small goose.'),
        N('It was not.'),
        BY('Ah. Better. That is what an old woman needs.', 'happy'),
        N('She leaves a little soup, a crust and a tiny scrap of pork.'),
        BY('That is yours, girl. And a crust for you, since you carried.'),
      ],
      [
        ask(
          9,
          'maths',
          'more and fewer',
          'K.CC.C.6',
          [N('Baba Yaga ate a mountain of food. Vasilisa has a tiny bowl. Who has more?')],
          [
            o(
              'Baba Yaga',
              [N('Yes! Baba Yaga had much more. Vasilisa has very little.', 'happy')],
              true,
            ),
            o('Vasilisa', [N('Look again. Baba Yaga ate a mountain. Vasilisa has just a little.')]),
          ],
          'Compared two amounts of food and said which was more.',
        ),
      ],
    ),
    sc(
      'a18-09-supper-done',
      [
        N('Baba Yaga climbs on the stove and pulls a quilt over her.'),
        N('She snores like a saw going through a log. Zzzrrr!'),
      ],
      [
        doit(
          1,
          'science',
          'sounds are made by shaking',
          '1-PS4-1',
          'edu:hum:throat:feel',
          [
            N('Every sound is made by something shaking.'),
            N('(Touch your throat and hum. Feel the tickle?)'),
            N('That tickle is your voice shaking!'),
          ],
          'Felt their throat shake while humming, learning that sound comes from vibrations.',
        ),
      ],
    ),
    sc(
      'a18-09-crust',
      [
        N('Vasilisa takes her supper into the corner behind the stove.'),
        N('You hear the napkin. Two small lights come on, and her supper is gone.'),
        V('She needed it more. She has to work tomorrow.', 'soft'),
        N('Vasilisa is very pale. She has not eaten since yesterday.'),
        N('Your crust sits on the table. It is the only food left.'),
        N('Your Nubbin climbs up and looks at the crust. It does not touch it.'),
        N('Tomorrow will be very long.'),
      ],
      [
        notice(
          6,
          'sel',
          'there is no wrong choice; caring for others and for yourself',
          'CASEL: Responsible decision-making',
          [
            N('There is no wrong choice here.'),
            N('Sharing with others is a kind way to care. Looking after yourself matters too.'),
          ],
          'Heard that sharing food is a way to care, and that looking after yourself matters as well.',
        ),
      ],
      [
        ch(
          'nubbin',
          'Give it to your Nubbin.',
          [
            N('You break it small. Your Nubbin eats every crumb, looking at you.'),
            N('Feed them first, says Gran Hazel. You are hungry, but it feels right.', 'soft'),
          ],
          { 'a18-crust': 'nubbin' },
        ),
        ch(
          'doll',
          'Give it to the doll, for Vasilisa.',
          [
            V('For her? But it is yours!', 'shock'),
            Y('She works for two tomorrow. She should eat for two.'),
            N('The doll’s lights come on, brighter than before.'),
          ],
          { 'a18-crust': 'doll' },
        ),
        ch(
          'self',
          'Eat it yourself. Tomorrow is long.',
          [
            N('You eat it. It is very dry, and then it is gone.'),
            N('Your Nubbin curls up on your feet anyway. That is kind.'),
          ],
          { 'a18-crust': 'self' },
        ),
      ],
    ),
    sc(
      'a18-09-crust-done',
      [
        N('The fire in the stove sinks to red.'),
        N('Vasilisa curls up on the bench with one hand in her pocket.'),
        N('A crust can be shared, and broken in half.'),
      ],
      [
        doit(
          2,
          'maths',
          'halves',
          '1.G.A.3',
          'edu:fold:paper:halves',
          [N('(Fold a paper in half. Two equal parts!)'), N('Each part is called one half.')],
          'Folded paper into halves and saw two equal parts.',
        ),
      ],
    ),
    sc(
      'a18-09-complete',
      [
        N('Baba Yaga stops snoring. She speaks without opening her eyes.'),
        BY('Tomorrow I go out. First, sweep the yard and clean the hut.'),
        BY('Next, cook my dinner and wash my linen.'),
        BY('Last, sift the oats. Every husk, every bit of chaff.'),
        BY('If it is not done when I come back, we shall see.', 'happy'),
        N('She starts snoring again, right where she stopped.'),
      ],
      [
        ask(
          3,
          'literacy',
          'first, next, last',
          'ELOF: Language and Communication',
          [N('Which job comes last: sweeping the yard, cooking dinner, or sifting oats?')],
          [
            o(
              'Sifting the oats',
              [N('Yes! First the yard and hut, next dinner and linen, last the oats.', 'happy')],
              true,
            ),
            o('Sweeping the yard', [N('Sweeping comes first. The oats are last.')]),
            o('Cooking dinner', [N('Dinner is the middle job. The oats are last.')]),
          ],
          'Listened to a list of jobs and named the one that comes last (first, next, last).',
        ),
      ],
    ),
  ],
);

// ================================================================== A18-10 The First Day
const A10 = quest(
  'a18-10',
  'The First Day',
  {
    'a18-10-s1': {
      goal: 'Keep close while Vasilisa asks the doll what to do.',
      hint: 'Stay by the warm stove and listen.',
    },
    'a18-10-s2': {
      goal: 'Help with the yard, the hut and the oats while Vasilisa sleeps.',
      hint: 'Sweep, scrub and sift. The doll is working too.',
    },
    'a18-10-s3': {
      goal: 'Stand by while Baba Yaga looks over the work.',
      hint: 'Wait in the yard as the night comes down.',
    },
  },
  [
    sc(
      'a18-10-night',
      [
        N('When the snoring is steady, Vasilisa takes the doll out.'),
        V('Too much to do! I cannot do it all. What do I do?', 'sad'),
        N('There is no food left to give. The two little lights come on anyway.'),
        DOLL('Lie down and rest. A good sleep makes you strong.', 'soft'),
        DOLL('Things look better when you wake.'),
        V('That is what Mother used to say. The same thing.', 'soft'),
        N('She lies down on the bench. She is asleep in a blink.'),
      ],
      [
        ask(
          4,
          'health',
          'sleep helps our bodies',
          'ELOF: Perceptual, Motor, and Physical Development',
          [N('Sleep is good for us. What does a good sleep do?')],
          [
            o(
              'Gives us energy and helps us grow',
              [N('Yes! Sleep gives our bodies energy and helps us grow.', 'happy')],
              true,
            ),
            o('Makes us hungry for pie', [N('Not pie. Sleep gives us energy and helps us grow.')]),
          ],
          'Learned that sleep gives the body energy and helps children grow.',
        ),
      ],
      [
        ch('watch', 'Stay awake and keep watch.', [
          N('You keep watch. So does the doll, sitting on the bench.'),
        ]),
        ch('sleep', 'Do as the doll says, and sleep.', [
          N('You lie down by the stove. The doll keeps watch for all of you.'),
        ]),
      ],
    ),
    sc(
      'a18-10-night-done',
      [
        N('At first light the white rider goes past the window.'),
        N('Baba Yaga whistles, her mortar comes, and she is gone.'),
      ],
      [
        doit(
          1,
          'music',
          'whistling and humming: sound is air shaking',
          '1-PS4-1',
          'edu:hum:tune:short',
          [
            N('Baba Yaga whistles. A whistle is air shaking as it rushes out.'),
            N('(Try to whistle a little tune. If you cannot whistle yet, hum instead!)'),
          ],
          'Tried whistling or humming a short tune, and heard that the sound is made by air shaking.',
        ),
      ],
    ),
    sc(
      'a18-10-chores',
      [
        N('Vasilisa sleeps on, as she was told. The doll climbs down and works.'),
        N('The broom sweeps by itself. The pots scrub themselves.'),
        N('Your Nubbin slept well on a full tummy. It follows you to the barn.'),
        N('The sack of oats is bigger than your Nubbin. You sift and sift.'),
        N('Your Nubbin picks out the black grains and spits them in a pile.'),
        N('The doll looks at the pile and nods like a foreman.'),
        N('By noon the oats are clean. Your Nubbin sleeps on the sack.'),
      ],
      [
        doit(
          4,
          'maths',
          'sort into two groups and count',
          'K.MD.B.3',
          'edu:sort:grains:pale-dark',
          [N('(Sort buttons or beans into two piles: dark and pale.)'), N('(Count each pile.)')],
          'Sorted objects into two groups and counted each group.',
        ),
      ],
    ),
    sc(
      'a18-10-chores-done',
      [
        N('At dusk Vasilisa wakes. The doll climbs back into her pocket.'),
        N('The black rider crosses the clearing.'),
      ],
      [
        notice(
          1,
          'sel',
          'asking for help is clever and brave',
          'CASEL: Relationship skills',
          [
            N('Vasilisa could not do all the work alone. So she asked for help.'),
            N('Asking for help is clever and brave. Everybody needs help sometimes.'),
          ],
          'Heard that asking for help is clever and brave, and that everybody needs help sometimes.',
        ),
      ],
    ),
    sc(
      'a18-10-hands',
      [
        N('The fence’s eyes light up. Baba Yaga lands in the yard.'),
        BY('Well? Well?', 'angry'),
        N('She looks at the yard and the hut. She tastes the dinner.'),
        N('She sniffs the oats for a long time.'),
        BY('Hm. Nothing to find fault with. I hate that.', 'think'),
        BY('Servants of mine! Take the oats and grind them.', 'happy'),
        N('Three pairs of hands appear in the air. Just hands.'),
        N('They lift the sack and carry it off into the dark.'),
      ],
      [
        doit(
          7,
          'literacy',
          'action words',
          'ELOF: Language and Communication',
          'edu:act:action-words:lift',
          [N('(Act it out! Lift, carry, wave. Those are action words.)')],
          'Acted out action words (lift, carry, wave) from the story.',
        ),
      ],
      [
        ch('look', 'Watch the hands go.', [
          N('You watch them to the edge of the dark. One waves, you think.'),
        ]),
        ch('ground', 'Look at the ground until they have gone.', [
          N('You look at the ground. Vasilisa does too.'),
        ]),
        ch('holdback', 'Hold your Nubbin back.', [
          N('Your Nubbin wants to follow. You hold on tight.'),
        ]),
      ],
    ),
    sc(
      'a18-10-hands-done',
      [
        BY('Same again tomorrow. Different job. Go to sleep.'),
        N('You think of the hands. Three pairs of them.'),
      ],
      [
        doit(
          1,
          'maths',
          'count by twos to six',
          'K.CC.B.5',
          'edu:count:hands:6',
          [
            N('(Hold up your two hands. That is one pair.)'),
            N('(Count three pairs: two, four, six!)'),
          ],
          'Counted pairs of hands to find six hands altogether.',
        ),
      ],
    ),
    sc(
      'a18-10-complete',
      [
        N('Baba Yaga eats her dinner. She leaves a little in the pot.'),
        N('Vasilisa looks at the empty air where the hands were.'),
        V('I am not going to ask. I do not want to know.', 'think'),
        N('She feeds the doll what she has. The little lights come on.'),
      ],
      [
        notice(
          2,
          'sel',
          'questions are good, and some things are private',
          'CASEL: Social awareness',
          [
            N('Asking questions is good. It is how we learn!'),
            N('But if someone says it is private, we leave it alone. That is respect.'),
          ],
          'Heard that asking questions is good, and that we respect it when something is private.',
        ),
      ],
    ),
  ],
);

// ================================================================== A18-11 The Second Day
const A11 = quest(
  'a18-11',
  'The Second Day',
  {
    'a18-11-s1': {
      goal: 'Hear what the second day’s work is.',
      hint: 'Listen to Baba Yaga before she goes out.',
    },
    'a18-11-s2': {
      goal: 'Help get the earth out of the poppy seeds.',
      hint: 'Work at the barn table. Your Nubbin can help.',
    },
    'a18-11-s3': {
      goal: 'Watch Baba Yaga find no fault, a second time.',
      hint: 'Wait in the yard as night falls.',
    },
  },
  [
    sc(
      'a18-11-list',
      [
        BY('Up! Today the same jobs. And one thing more.', 'happy'),
        N('She drags a sack across the floor. It is full of tiny poppy seeds.'),
        N('Earth is mixed through them, the same colour and size.'),
        BY('Somebody did this to me once. Somebody always does.', 'angry'),
        BY('Get every speck of earth out. I will know.'),
        N('She whistles, her mortar comes, and she is gone.'),
        V('Every speck. You cannot even see which are specks.', 'sad'),
      ],
      [
        ask(
          4,
          'science',
          'a sieve sorts small from big',
          'ELOF: Scientific Reasoning',
          [N('A sieve is a bowl with tiny holes. What does a sieve do?')],
          [
            o(
              'Lets small bits fall through',
              [N('Yes! Small bits fall through. Bigger bits stay in the sieve.', 'happy')],
              true,
            ),
            o('Makes things bigger', [
              N('A sieve does not grow things. Small bits fall through the holes.'),
            ]),
          ],
          'Learned that a sieve lets small bits fall through while larger bits stay behind.',
        ),
      ],
      [
        ch('try', 'Say you will try.', [V('Thank you. I knew you would. I will ask her first.')]),
        ch('remind', 'Remind her what the doll said.', [
          V('Sleep first, and ask, and see. Yes. I know.', 'soft'),
        ]),
      ],
    ),
    sc(
      'a18-11-list-done',
      [
        N('Vasilisa takes out the doll. She feeds it the last of her bread.'),
        N('She listens with her head on one side.'),
      ],
      [
        doit(
          1,
          'sel',
          'good listening with your whole body',
          'CASEL: Relationship skills',
          'edu:show:listening:body',
          [N('(Show how you listen. Look at me. Mouth quiet. Ears ready!)')],
          'Practised good listening: eyes on the speaker, a quiet mouth and ready ears.',
        ),
      ],
    ),
    sc(
      'a18-11-poppy',
      [
        N('The doll walks into the poppy seeds, like wading into a pond.'),
        N('Where it goes, seeds go one way and earth goes the other.'),
        N('You help with a feather and a saucer.'),
        N('Five specks of earth are left on the saucer.'),
        N('Your Nubbin blows two away, very gently. Puff, puff!'),
        N('By noon there is seed in one sack and earth in a heap.'),
        N('Vasilisa sleeps through it all, smiling.'),
      ],
      [
        doit(
          4,
          'maths',
          'take away: five take away two',
          'K.OA.A.2',
          'edu:subtract:specks:3',
          [N('(Put five beads on a plate. Take two away. How many are left? Three!)')],
          'Took two away from five to find three, using beads as specks.',
        ),
      ],
    ),
    sc(
      'a18-11-poppy-done',
      [
        N('The black rider crosses the clearing. The fence’s eyes come on.'),
        N('A poppy seed is tiny, and blue-black, almost the colour of night.'),
      ],
      [
        doit(
          1,
          'art',
          'guess, then try: black and white paint make grey',
          'ELOF: Scientific Reasoning',
          'edu:name:colour:grey',
          [
            N('(What if we add a drop of white paint to black? Guess first.)'),
            N('(Now try it, or mix them in your mind. Grey!)'),
          ],
          'Guessed what black and white paint would make, then tried it and found grey.',
        ),
      ],
    ),
    sc(
      'a18-11-oil',
      [
        N('Baba Yaga comes down in her mortar and goes straight to the barn.'),
        N('She sniffs the seeds. She sniffs the earth. Twice.'),
        BY('Not a speck. Twice running. It is not natural.', 'angry'),
        BY('Servants of mine! Take the poppy and press it. I want oil by morning.'),
        N('Three pairs of hands come out of the dark and take the sack.'),
        BY('You helped, did you not. I can see it on your sleeves.', 'think'),
        BY('I pay for work. Here.'),
        N('She hands you a tiny cracked mortar and pestle.'),
        BY('Too small for flying. Plant something in it.'),
      ],
      [
        ask(
          6,
          'social-studies',
          'work deserves fair pay',
          'D2.Civ.8.K-2',
          [N('Baba Yaga pays for work. Is it fair to pay someone who worked for you?')],
          [
            o(
              'Yes. Work deserves thanks and pay',
              [N('Yes! Fair people pay or thank those who work for them.', 'happy')],
              true,
            ),
            o('No. Work should be free', [
              N('Work takes effort. It is fair to pay or thank people who work.'),
            ]),
          ],
          'Talked about fairness: someone who works for us should be paid or properly thanked.',
        ),
      ],
      [
        ch('thank', 'Thank her properly.', [
          BY('Do not thank me. It is pay. Pay is not a present.', 'angry'),
          N('But for a moment she looks pleased.'),
        ]),
        ch('flew', 'Ask whether it ever flew.', [
          BY('Once. A very short way. Into a pond.', 'think'),
          N('She does not explain. You do not ask again.'),
        ]),
      ],
    ),
    sc(
      'a18-11-oil-done',
      [
        N('By morning there is a jar of golden poppy oil on the table.'),
        N('Nobody saw it arrive.'),
      ],
      [
        notice(
          1,
          'science',
          'many seeds hold oil that can be pressed out',
          'ELOF: Scientific Reasoning',
          [
            N('Many seeds have oil inside them. Press them hard, and the oil comes out.'),
            N('Poppy seeds do this. So do sunflower seeds!'),
          ],
          'Heard that some seeds, like poppy and sunflower seeds, contain oil that can be pressed out.',
        ),
      ],
    ),
    sc(
      'a18-11-complete',
      [
        N('That night there is soup again, a crust, and a scrap.'),
        N('The little mortar sits on the windowsill.'),
        V('Tomorrow she will let me go. Or not. I feel it coming, like weather.', 'think'),
        N('Your Nubbin climbs into the cracked mortar. It fits exactly.'),
        N('It goes to sleep there.'),
      ],
      [
        ask(
          2,
          'literacy',
          'words that show feelings',
          'RL.1.4',
          [N('Vasilisa feels something coming, like weather. How might she feel?')],
          [
            o(
              'Worried and hopeful',
              [N('Yes! Worried and hopeful, both at once. Feelings can mix.', 'soft')],
              true,
            ),
            o('Only sleepy', [N('She is thinking hard. Worried and hopeful, both at once.')]),
          ],
          'Named mixed feelings (worried and hopeful) from a character’s words.',
        ),
      ],
    ),
  ],
);

// ================================================================== A18-12 Questions
const A12 = quest(
  'a18-12',
  'Questions',
  {
    'a18-12-s1': {
      goal: 'Stand by Vasilisa while Baba Yaga eats. Listen.',
      hint: 'Keep quiet at the table. Vasilisa will speak.',
    },
    'a18-12-s2': {
      goal: 'Decide whether to ask a question of your own.',
      hint: 'Think about what Baba Yaga just said about questions.',
    },
    'a18-12-s3': {
      goal: 'Hear how Vasilisa answers Baba Yaga’s question.',
      hint: 'Stay near the door. It may be time to go quickly.',
    },
  },
  [
    sc(
      'a18-12-supper',
      [
        N('Baba Yaga eats and eats. Vasilisa stands by, as still as a post.'),
        V('Granny, may I ask you some questions?'),
        BY('Ask, then. Mind you pick good ones.', 'think'),
        V('A rider in white went by. Who was he?'),
        BY('That was my bright day.'),
        V('And a rider all in red?'),
        BY('That was my red sun.'),
        V('And one all in black, at your gate?'),
        BY('My dark night. All three are mine, and faithful.', 'happy'),
        N('Vasilisa thinks of the hands. She shuts her mouth.'),
      ],
      [
        notice(
          9,
          'social-studies',
          'old tales are told in many places',
          'D2.His.2.K-2',
          [
            N('This tale is very old. People told it aloud for hundreds of years.'),
            N('Baba Yaga is in Ukrainian, Belarusian, Polish and Russian stories too.'),
            N('Each place tells her a little differently. Stories travel with people.'),
          ],
          'Heard that this old tale, and Baba Yaga, are told in many places, each a little differently.',
        ),
      ],
    ),
    sc(
      'a18-12-supper-done',
      [BY('Is that all? Nothing else?'), N('Bright day, red sun, dark night. A pattern of three!')],
      [
        doit(
          1,
          'literacy',
          'repeated lines and patterns of three',
          'RL.2.4',
          'edu:say:repeat:three',
          [N('(Say it with me: bright day, red sun, dark night.)')],
          'Said a pattern of three phrases aloud, noticing the rhythm of repetition.',
        ),
      ],
    ),
    sc(
      'a18-12-question',
      [
        V('That is all, Granny. Too many questions are not always good.'),
        BY('Good girl. You only ask about outside my yard, not inside it.', 'think'),
        N('Baba Yaga turns her wet-stone eyes on you.'),
        BY('And you? Anything you want to know?'),
        N('You think of the hands. They are waving in your head.'),
      ],
      [
        ask(
          4,
          'sel',
          'polite questions and private things',
          'CASEL: Social awareness',
          [
            N(
              'Which is a polite question: Will it be cold tomorrow? Or what is in your private box?',
            ),
          ],
          [
            o(
              'Will it be cold tomorrow?',
              [N('Yes. A question about the weather is polite.', 'happy')],
              true,
            ),
            o('What is in your private box?', [
              N('A private box is private. Questions about the weather are polite.'),
            ]),
          ],
          'Chose a polite question and recognised that some things are private.',
        ),
      ],
      [
        ch('hands', 'Ask about the hands.', [
          N('You open your mouth. Vasilisa steps on your foot, hard.'),
          Y('…About the weather. Will it be cold tomorrow?'),
          BY('Very. A much better question.', 'happy'),
        ]),
        ch('nothing', 'Ask nothing. Shake your head.', [BY('Wise. Wiser than you look.', 'think')]),
        ch('birches', 'Ask about the birches.', [
          Y('Why are the birches white?'),
          BY('So my bright day has something to shine on. Next.', 'happy'),
        ]),
      ],
    ),
    sc(
      'a18-12-question-done',
      [
        N('Baba Yaga leans back. She has eaten everything.'),
        N('Birch bark is white and papery. It peels in thin strips.'),
      ],
      [
        notice(
          1,
          'science',
          'birch bark is white, peels, and people once wrote on it',
          'ELOF: Scientific Reasoning',
          [
            N('Birch bark peels off in thin papery strips.'),
            N('Long ago, people in some lands wrote letters on birch bark!'),
          ],
          'Heard that birch bark peels in papery strips and that people once wrote on it.',
        ),
      ],
    ),
    sc(
      'a18-12-blessing',
      [
        BY('Now I ask one. How did you do all my work? Twice.', 'think'),
        N('Vasilisa’s hand goes to her pocket. It stops.'),
        V('My mother’s love helped me!'),
        N('Baba Yaga goes very still. She rises up to the rafters.'),
        BY('Love like that? Then off you go, quick! Nobody so loved stays here!', 'angry'),
        N('She bundles you out and slams the door. The herbs fall down.'),
        N('In the yard she lifts a lantern on a stick. Its eyes glow warm.'),
        BY('Here is your fire. That is what you came for. Go!'),
        N('Herbs land on your Nubbin. It wears them as a hat home.'),
      ],
      [
        notice(
          8,
          'sel',
          'feeling loved helps us feel brave',
          'CASEL: Self-awareness',
          [
            N('Feeling loved helps us feel brave.'),
            N('Think of one person who loves you. (Wait for an answer.)'),
          ],
          'Thought about a person who loves them and how feeling loved helps us feel brave.',
        ),
      ],
    ),
    sc(
      'a18-12-gate',
      [
        N('At the gate, Baba Yaga stops you with one long finger.'),
        N('She sniffs your Nubbin, then you.'),
        BY('Someone here feeds others first. I can smell it.', 'think'),
        BY('Here, a bag of my oats for whoever it was. Do not come back.'),
        N('Your Nubbin carries the bag in its mouth all the way home.'),
      ],
      [
        notice(
          3,
          'science',
          'oats are a grain, which is a seed',
          'ELOF: Scientific Reasoning',
          [
            N('Oats are a grain. A grain is a seed.'),
            N('Oats grow on tall stalks in fields. People cook them into porridge.'),
          ],
          'Heard that oats are a grain (a seed) that grows in fields and is cooked into porridge.',
        ),
      ],
    ),
    sc(
      'a18-12-complete',
      [
        N('The gate swings shut behind you. The fence’s eyes watch you go.'),
        N('Vasilisa holds the stick far out. The lantern lights the path.'),
        V('I said it. I did not know it would make her so cross.', 'shock'),
        Y('You did not say anything wrong.'),
        V('No. I did not, did I.', 'soft'),
      ],
      [
        doit(
          1,
          'art',
          'sort colours into warm and cool, and count each group',
          'K.MD.B.3',
          'edu:sort:crayons:warm-cool',
          [
            N('The lantern glows amber, like honey. That is a warm colour.'),
            N('Red, orange and yellow are warm. Blue, green and purple are cool.'),
            N('(Sort some crayons into warm and cool. Count each pile.)'),
          ],
          'Sorted colours into warm and cool groups and counted each group.',
        ),
      ],
    ),
  ],
);

// ================================================================== A18-13 The Skull on a Stick
const A13 = quest(
  'a18-13',
  'The Lantern on a Stick',
  {
    'a18-13-s1': {
      goal: 'Walk home through the dark wood by the lantern’s light.',
      hint: 'Keep inside the circle of light and walk where it shines.',
    },
    'a18-13-s2': {
      goal: 'Stay with Vasilisa when she wants to throw the lantern away.',
      hint: 'Wait beside her at the edge of the wood.',
    },
    'a18-13-s3': {
      goal: 'Carry the lantern the last stretch, so Vasilisa’s arms can rest.',
      hint: 'Take the stick, hold it out in front, and walk to the house.',
    },
  },
  [
    sc(
      'a18-13-dark',
      [
        N('The night wood is different. The lantern makes a small round room of light.'),
        N('You walk inside the room of light.'),
        N('Your Nubbin walks ahead, at the edge of the light. It is not afraid.'),
        N('At a fork it stops and waits. The light swings that way.'),
        V('Look! It is not frightened at all. How is it not frightened?', 'shock'),
        V('Mother said: a fed child sleeps. A hungry one sees wolves.', 'soft'),
        N('You walk all night and all the next day. The light never goes out.'),
      ],
      [
        doit(
          1,
          'science',
          'light cannot pass through your hand: shadows',
          '1-PS4-2',
          'edu:make:shadow:hand',
          [
            N('(Shine a torch on a wall. Hold your hand in front. See the shadow?)'),
            N('Light cannot go through your hand. So the dark patch is a shadow.'),
          ],
          'Made a hand shadow and saw that light cannot pass through a hand.',
        ),
      ],
    ),
    sc(
      'a18-13-dark-done',
      [
        N('At dusk on the second day you see the stepmother’s house.'),
        N('There is no light in it at all.'),
        N('Long ago there were no electric lights. Homes used candles, lamps and fires.'),
      ],
      [
        ask(
          2,
          'social-studies',
          'how people lit their homes long ago',
          'D2.His.2.K-2',
          [N('Long ago, before electric lights, how did people light their homes at night?')],
          [
            o(
              'With candles, lamps and fires',
              [N('Yes! Candles, lamps and fires lit the evening.', 'happy')],
              true,
            ),
            o('With a plug in the wall', [
              N('Plugs came much later. Long ago, it was candles, lamps and fires.'),
            ]),
          ],
          'Learned that before electric lights, homes were lit by candles, lamps and fires.',
        ),
      ],
    ),
    sc(
      'a18-13-throw',
      [
        N('At the edge of the wood Vasilisa stops. Her arms are shaking.'),
        V('I cannot take it into the house. I will throw it in the ditch.', 'sad'),
        V('They have fire by now. They will not need it.'),
        N('She lifts the stick to throw. Your Nubbin covers its eyes.'),
        N('The lantern gives a little flicker. A dry, kind voice comes out of it.'),
        N('The lantern says: Please do not throw me away.'),
        N('The voice is dry as leaves, and not unkind.'),
        N('The lantern says: Take me to your stepmother’s house. I am wanted there.'),
        V('Oh.', 'shock'),
        N('The lantern says: And mind you do not swing me.'),
        N('Vasilisa holds the stick very still. Your Nubbin peeks to see lantern manners.'),
      ],
      [
        ask(
          3,
          'sel',
          'stop, breathe, then choose',
          'CASEL: Self-management',
          [N('Vasilisa feels like throwing it away. What helps when a feeling is very big?')],
          [
            o(
              'Stop, breathe, then choose',
              [N('Yes. Stop, breathe, then choose. That is what Vasilisa does.', 'happy')],
              true,
            ),
            o('Do it fast without thinking', [
              N('Fast can lead to a mistake. Stop, breathe, then choose.'),
            ]),
            o('Shout at someone', [N('Shouting hurts others. Stop, breathe, then choose.')]),
          ],
          'Practised a calming way to handle a big feeling: stop, breathe, then choose.',
        ),
      ],
      [
        ch('listen', 'Tell her to do as it says.', [
          V('Yes. All right. It did nearly say please.', 'think'),
        ]),
        ch('hers', 'Say nothing. It is her choice.', [
          N('You wait. Vasilisa looks at the lantern. It looks back.'),
          V('All right. Home.'),
        ]),
      ],
    ),
    sc(
      'a18-13-throw-done',
      [N('She lowers the stick. Her arms tremble.'), N('The light shakes on the snow.')],
      [
        doit(
          1,
          'health',
          'tired muscles need rest',
          'ELOF: Perceptual, Motor, and Physical Development',
          'edu:hold:arms:rest',
          [
            N('When we hold something up for a long time, our muscles get tired.'),
            N('(Hold your arms out straight and count to ten.)'),
            N('(Now shake them out and rest.)'),
          ],
          'Felt muscles tire from holding arms out and learned that resting helps.',
        ),
      ],
    ),
    sc(
      'a18-13-carry',
      [
        Y('Give it to me. Just to the gate.'),
        N('You take the stick. It is lighter than you thought, and warm.'),
        N('Vasilisa shakes out her arms. She walks beside you.'),
        N('The lantern looks at the dark house. Its eyes get brighter.'),
        N('The lantern says: Nearly there.', 'think'),
        N('Your Nubbin climbs on your shoulder to see.'),
      ],
      [
        ask(
          1,
          'maths',
          'heavier and lighter',
          'K.MD.A.2',
          [N('The lantern on its stick is light. Which is lighter: the stick, or a big stone?')],
          [
            o('The stick', [N('Yes! A big stone is heavy. The stick is lighter.', 'happy')], true),
            o('The big stone', [N('A big stone is very heavy. The stick is lighter.')]),
          ],
          'Compared two objects and said which is lighter.',
        ),
      ],
      [
        ch('steady', 'Hold it steady, far out in front.', [
          N('You hold it far out. The light goes ahead like a carpet.'),
        ]),
        ch('polite', 'Ask the lantern how it is.', [
          N('The lantern says: Busy. It has been long since anybody asked.'),
          N('It says no more. You do not ask again.'),
        ]),
      ],
    ),
    sc(
      'a18-13-carry-done',
      [
        N('At the gate you give the stick back to Vasilisa.'),
        N('It should be her who carries it in.'),
      ],
      [
        notice(
          1,
          'sel',
          'help, then step back so the other person can finish',
          'CASEL: Relationship skills',
          [
            N('You helped, and then you stepped back.'),
            N('A kind helper lets a friend finish what they started.'),
          ],
          'Heard that a kind helper steps back and lets the other person finish.',
        ),
      ],
    ),
    sc(
      'a18-13-complete',
      [
        N('The house is dark from top to bottom.'),
        V('They are waiting for me. They never waited for me before.', 'think'),
        N('Your Nubbin stands close against your leg.'),
        N('The door flies open before you reach it.'),
      ],
      [
        notice(
          3,
          'literacy',
          'predicting what happens next',
          'RL.K.3',
          [
            N('Good listeners guess what comes next. That is called predicting.'),
            N('What do you think will happen? (Wait for an answer.)'),
          ],
          'Made a prediction about what will happen next in a story.',
        ),
      ],
    ),
  ],
);

// ================================================================== A18-14 No Fire
const A14 = quest(
  'a18-14',
  'No Fire',
  {
    'a18-14-s1': {
      goal: 'Bring the lantern into the house with Vasilisa.',
      hint: 'Follow her through the door.',
    },
    'a18-14-s2': {
      goal: 'Stay by the cold stove with Vasilisa through the long night.',
      hint: 'Sit by the hearth. Don’t leave her on her own.',
    },
    'a18-14-s3': {
      goal: 'Help Vasilisa lay the lantern to rest and lock up the house.',
      hint: 'Dig under the birch by the gate. Then walk her to the road.',
    },
  },
  [
    sc(
      'a18-14-door',
      [
        STEP('You! You came back. And you have fire!', 'shock'),
        N('For the first time, she is pleased to see Vasilisa.'),
        ELD('We have had no light since you left. None.', 'sad'),
        YNG('We fetched fire three times. Each time it went out!'),
        ELD('Out! Out! Out!'),
        N('The lantern on the stick does not go out. The sisters glare at it.'),
        STEP('Never mind that. Put it on the table. It will do for a lamp.'),
        N('Vasilisa sets the lantern on the table, facing the room.'),
      ],
      [
        notice(
          7,
          'science',
          'fire needs air to burn',
          'ELOF: Scientific Reasoning',
          [
            N('A fire needs air to burn. Cover a candle with a jar, and it runs out of air.'),
            N('Never play with fire. Only grown-ups light or put out flames.'),
          ],
          'Heard that fire needs air, and that only grown-ups handle flames.',
        ),
      ],
      [
        ch('stand', 'Stand next to Vasilisa, by the door.', [
          N('You stand by her. The stepmother looks at the lantern. It looks at her.'),
        ]),
        ch('close', 'Keep your Nubbin close.', [
          N('You hold your Nubbin to your chest. It does not want to look.'),
        ]),
      ],
    ),
    sc(
      'a18-14-door-done',
      [
        N('The stepmother moves to the stove. The lantern’s eyes follow.'),
        N('She moves to the window. They follow her there too.'),
      ],
      [
        doit(
          1,
          'maths',
          'positions: by the stove, at the window',
          'K.G.A.1',
          'edu:point:position:stove-window',
          [N('(Where is she now? Point to the stove. Now point to the window.)')],
          'Used position words (by the stove, at the window) and pointed to each place.',
        ),
      ],
    ),
    sc(
      'a18-14-stare',
      [
        STEP('Turn it round! Turn it to the wall!', 'shock'),
        N('Vasilisa turns it. The light still shines at the stepmother.'),
        ELD('It is looking at me! Mother, it is looking at me!'),
        N('The sisters hide in the cellar. The light finds them.'),
        N('They climb to the loft. The light finds them there.'),
        N('Nobody is hurt. There is only a steady light, and three people running.'),
        N('The light never looks at you. Your Nubbin is a bit cross about that.'),
        N('Vasilisa sits by the cold stove. You sit beside her.'),
        V('I did not want this. I only went for fire.', 'sad'),
      ],
      [
        ask(
          8,
          'sel',
          'naming mixed feelings: sorry and upset',
          'CASEL: Self-awareness',
          [N('Vasilisa did not want anyone frightened. How does she feel?')],
          [
            o(
              'Sorry and upset',
              [N('Yes. She feels sorry and upset, though she did nothing wrong.', 'soft')],
              true,
            ),
            o('Proud and bossy', [N('Look at her face. She is sorry and upset.')]),
            o('Sleepy and silly', [N('Not silly. Her heart is heavy. She feels sorry and upset.')]),
          ],
          'Named mixed feelings (sorry and upset) in a character who did nothing wrong.',
        ),
      ],
      [
        ch('sit', 'Sit with her, and say nothing.', [
          N('You sit with her. It is a very long night. You stay for all of it.'),
        ]),
        ch('sleeve', 'Put your sleeve over her eyes.', [
          N('She leans on your shoulder with your sleeve over her eyes. Soon she sleeps.'),
        ]),
        ch('tell', 'Tell her it was not her doing.', [
          Y('You went for fire. That is all you did.'),
          V('I know. Will you stay up with me anyway?', 'soft'),
        ]),
      ],
    ),
    sc(
      'a18-14-stare-done',
      [
        N('Some time before dawn, the back door opens and shuts.'),
        N('Three times. Then the house is quiet.'),
      ],
      [
        ask(
          1,
          'health',
          'ways to rest when you are worried',
          'ELOF: Perceptual, Motor, and Physical Development',
          [N('It is a worrying night. What helps you rest when you are worried?')],
          [
            o(
              'A cuddle and slow breaths',
              [N('Yes. A cuddle and slow breaths help a worried body rest.', 'soft')],
              true,
            ),
            o('Shouting', [N('Shouting does not help us rest. A cuddle and slow breaths do.')]),
          ],
          'Chose calming ways to rest when worried: a cuddle and slow breaths.',
        ),
      ],
    ),
    sc(
      'a18-14-morning',
      [
        N('In the morning the house is empty. The shawl and boots are gone.'),
        N('Footprints go off down the lane in the snow. They do not come back.'),
        V('They are gone. I did not hate them. I never did.', 'sad'),
        N('The lantern sits on the table, dim, as if it were tired.'),
        V('It did its job. It should rest in the ground, under a tree.'),
        N('You dig under the birch by the gate. Your Nubbin digs too.'),
      ],
      [
        notice(
          5,
          'social-studies',
          'marking a special place with a stone or tree',
          'D2.His.2.K-2',
          [
            N('People put things to rest kindly. A stone or a tree can mark the place.'),
            N('Marking a place helps us remember.'),
          ],
          'Heard that people mark special places with a stone or a tree, to remember them.',
        ),
      ],
      [
        ch('stone', 'Set a flat stone on top.', [
          N('You set a flat stone over the place. Vasilisa nods.'),
        ]),
        ch('words', 'Ask if she wants to say something.', [
          V('Thank you for the light. That is all. That is enough.', 'soft'),
        ]),
      ],
    ),
    sc(
      'a18-14-morning-done',
      [
        N('Vasilisa locks the door.'),
        N('She hangs the key on a string round her neck.'),
        N('She does not look back at the house.'),
      ],
      [
        ask(
          1,
          'maths',
          'longer and shorter',
          'K.MD.A.2',
          [N('The string is long. The key is short. Which is longer?')],
          [
            o('The string', [N('Yes! The string is longer. The key is shorter.', 'happy')], true),
            o('The key', [N('Look again. The string is longer than the key.')]),
          ],
          'Compared two lengths and said which is longer.',
        ),
      ],
    ),
    sc(
      'a18-14-complete',
      [
        V('I will go to town and wait for Father. He said spring.'),
        N('You walk with her down the lane, and then towards the town.'),
        N('Halfway, she feeds the doll some bread. The little lights glow, even in daylight.'),
        V('She says we will be all right. We will find a kind old woman.', 'happy'),
        DOLL('Go on, Vasilisa. It is not far now.', 'soft'),
      ],
      [
        doit(
          1,
          'music',
          'a slow beat and a fast beat',
          'ELOF: Perceptual, Motor, and Physical Development',
          'edu:march:beat:slow-fast',
          [
            N('(March on the spot to a steady beat: slow, slow, slow.)'),
            N('(Now fast, fast, fast!)'),
          ],
          'Marched to a steady beat, slow and then fast.',
        ),
      ],
    ),
  ],
);

// ================================================================== A18-15 The Loom
const A15 = quest(
  'a18-15',
  'The Loom',
  {
    'a18-15-s1': {
      goal: 'Find Vasilisa somewhere to stay in town.',
      hint: 'Knock at the little house at the end of the last lane.',
    },
    'a18-15-s2': {
      goal: 'Find an old comb, a shuttle and a horse’s mane for the doll.',
      hint: 'Ask round the town: the barber, the weaver’s widow, the stable.',
    },
    'a18-15-s3': {
      goal: 'Help bleach the linen on the spring grass.',
      hint: 'Spread the linen on the meadow and keep it damp.',
    },
  },
  [
    sc(
      'a18-15-town',
      [
        N('The town is fences and smoke and dogs.'),
        N('At the end of the last lane is a little house with one window.'),
        N('An old woman answers. She has flour on her hands.'),
        OLD('A girl on her own, and a… whatever that is. Come in.', 'soft'),
        V('I wait for my father, far away. May I stay? I will work.'),
        OLD('Stay. I have a bench and a stove and a rude cat.', 'happy'),
        N('The cat looks at your Nubbin. Your Nubbin looks at the cat.'),
      ],
      [
        ask(
          5,
          'sel',
          'welcoming someone new',
          'CASEL: Relationship skills',
          [N('The old woman welcomes a stranger. What is a kind way to welcome someone new?')],
          [
            o(
              'Say hello and make room',
              [N('Yes! Hello and a place to sit make a stranger feel welcome.', 'happy')],
              true,
            ),
            o('Shut the door', [
              N('A shut door says go away. Hello and a place to sit are kinder.'),
            ]),
            o('Ignore them', [N('Ignoring makes people feel lonely. Say hello and make room.')]),
          ],
          'Chose a kind way to welcome a newcomer.',
        ),
      ],
      [
        ch('water', 'Offer to fetch the water.', [
          OLD('Two pails, then. Mind the dog. He is worse than the cat.'),
        ]),
        ch('cat', 'Introduce your Nubbin to the cat.', [
          N('Your Nubbin sits beside the cat. After a long time, the cat allows this.'),
        ]),
      ],
    ),
    sc(
      'a18-15-town-done',
      [
        V('Granny, I cannot sit idle. Please buy me flax to spin.'),
        N('Flax is a plant with tall, thin stems and blue flowers.'),
        N('Its stems hold long, strong fibres. Fibres can be spun into thread.'),
      ],
      [
        ask(
          2,
          'science',
          'plant fibres can be spun into thread and cloth',
          'ELOF: Scientific Reasoning',
          [N('Flax is a plant. Its fibres can be spun. What can thread be woven into?')],
          [
            o(
              'Cloth',
              [N('Yes! Thread is woven into cloth. Flax makes a cloth called linen.', 'happy')],
              true,
            ),
            o('Soup', [N('Not soup. Thread is woven into cloth. Flax makes linen.')]),
          ],
          'Learned that flax is a plant whose fibres are spun into thread and woven into linen cloth.',
        ),
      ],
    ),
    sc(
      'a18-15-loom',
      [
        N('Vasilisa spins through the dark days. Her thread is fine as hair.'),
        OLD('Lovely. But no loom here will take thread so fine.', 'sad'),
        N('That night Vasilisa takes a crust to the cellar. You hold the light.'),
        N('The doll eats, and its lights come on. It talks to Vasilisa, low.'),
        V('She wants an old comb, a shuttle and a horse’s mane.', 'think'),
        V('Will you find them? I cannot ask Granny for a horse’s mane.'),
      ],
      [
        doit(
          5,
          'maths',
          'a repeating pattern: over, under, over, under',
          'ELOF: Mathematics Development',
          'edu:say:pattern:over-under',
          [
            N('A loom weaves thread over, under, over, under. That is a pattern.'),
            N('(Weave your fingers in the air and say it: over, under, over, under.)'),
          ],
          'Said and acted out a repeating pattern (over, under) like weaving.',
        ),
      ],
      [
        ch('ask', 'Go out first thing and ask round.', [
          N('The barber has a comb. The weaver’s widow has a shuttle. The stableman cuts a mane.'),
        ]),
        ch('stable', 'Send your Nubbin to the stable.', [
          N('Your Nubbin comes back with a long switch of mane. The horse did not mind.'),
        ]),
      ],
    ),
    sc(
      'a18-15-loom-done',
      [
        N('By morning there is a loom in the corner, small and neat.'),
        N('Nobody heard it being made.'),
        N('Your Nubbin falls asleep in the heap of combed flax.'),
      ],
      [
        doit(
          1,
          'literacy',
          'first, next, last: how flax becomes cloth',
          'ELOF: Literacy',
          'edu:order:flax:pull-spin-weave',
          [
            N(
              'Flax becomes cloth in steps. First, we pull the flax. Next, we spin it into thread.',
            ),
            N('Last, we weave the thread into cloth.'),
            N('(Say it with me: pull, spin, weave.)'),
          ],
          'Put three steps in order (pull, spin, weave) using first, next and last.',
        ),
      ],
    ),
    sc(
      'a18-15-bleach',
      [
        N('All winter Vasilisa weaves. By spring there is a roll of linen.'),
        OLD('Now it wants the sun. Out on the grass with it.'),
        N('You spread it on the new grass, a long white road through the green.'),
        N('Every hour you sprinkle it. The sun works on it.'),
        N('It gets whiter by the day.'),
        N('Your Nubbin lies at the edge with one paw on the linen.'),
        V('I made this myself. Well, with her, and with you carrying.', 'happy'),
      ],
      [
        notice(
          4,
          'science',
          'sunlight can lighten cloth',
          'ELOF: Scientific Reasoning',
          [
            N('Sunlight can fade colours and make cloth whiter.'),
            N('That is why washing hung in the sun can look so bright.'),
          ],
          'Heard that sunlight can lighten cloth, which is why linen was bleached in the sun.',
        ),
      ],
      [
        ch('sprinkle', 'Take a turn with the watering can.', [
          N('You sprinkle it end to end. A little rainbow follows, then gives up.'),
        ]),
        ch('lie', 'Lie in the grass beside it and watch the sky.', [
          N('You lie down beside the linen. For one afternoon, nobody has to do anything.'),
        ]),
      ],
    ),
    sc(
      'a18-15-bleach-done',
      [OLD('Whiter than snow. Finer than anything. I have never seen the like.', 'happy')],
      [
        ask(
          0,
          'sel',
          'feeling proud of work done together',
          'CASEL: Self-awareness',
          [N('Vasilisa made the linen with help. How does she feel?')],
          [
            o('Proud', [N('Yes! Proud, and thankful for the help.', 'happy')], true),
            o('Cross', [N('Not cross. She looks happy. She feels proud.')]),
          ],
          'Named the feeling of pride in work done with others.',
        ),
      ],
    ),
    sc(
      'a18-15-complete',
      [
        N('All winter the old woman has whittled by the stove.'),
        N('Now she puts a lantern shade in your hands. It is carved birch.'),
        N('It has two round eye holes. It looks like a kind, sleepy face.'),
        OLD('For the light that brought her home. A friendly one.', 'soft'),
        N('Put a candle inside, and the eyes glow warm.'),
      ],
      [
        notice(
          4,
          'art',
          'wood blocks light; carved holes let it through',
          'ELOF: Scientific Reasoning',
          [
            N('Wood stops the light. The carved holes let it through.'),
            N('So bright spots glow on the wall. Only grown-ups use carving knives.'),
            N('(Shine a torch through a colander. Can you see the spots of light?)'),
          ],
          'Heard that wood blocks light while carved holes let it through, and looked at spots of light through a colander.',
        ),
      ],
    ),
  ],
);

// ================================================================== A18-16 Twelve Shirts
const A16 = quest(
  'a18-16',
  'Twelve Shirts',
  {
    'a18-16-s1': {
      goal: 'Walk with the old woman to the palace with the linen.',
      hint: 'Carry the roll. She does the talking.',
    },
    'a18-16-s2': {
      goal: 'Help make up the twelve shirts.',
      hint: 'Sit at the window with Vasilisa, where the light is best.',
    },
    'a18-16-s3': {
      goal: 'Stand with Vasilisa when the Tsar asks to meet the seamstress.',
      hint: 'Walk her to the palace. She is shaking.',
    },
  },
  [
    sc(
      'a18-16-palace',
      [
        V('Sell it, Granny. Keep the money for both of us.'),
        OLD('Sell cloth like this? No. It is a gift, or it is nothing.', 'think'),
        N('You walk to the palace. The old woman carries her linen like treasure.'),
        N('She walks under the windows. A window opens, and a man looks out.'),
        N('He is the Tsar, in his slippers.'),
        TS('What do you have there, old mother?'),
        OLD('A wonder. I will show it only to you.'),
        N('He holds the linen up. The light goes through it.'),
        TS('What do you want for it?'),
        OLD('Nothing. It is a gift.', 'soft'),
      ],
      [
        ask(
          9,
          'sel',
          'a gift is given freely',
          'CASEL: Relationship skills',
          [N('The old woman gives the linen as a gift. What is a gift?')],
          [
            o(
              'Something given freely, asking nothing back',
              [N('Yes! A gift is given freely, with nothing asked back.', 'happy')],
              true,
            ),
            o('Something you swap for money', [N('That is selling. A gift is given freely.')]),
          ],
          'Learned the difference between a gift (given freely) and something sold.',
        ),
      ],
      [
        ch('bow', 'Bow, as everyone else does.', [
          N('You bow. Your Nubbin bows too and slides off the linen.'),
        ]),
        ch('off', 'Keep your Nubbin off the linen.', [
          N('You catch your Nubbin as it reaches for a corner. The Tsar laughs.'),
        ]),
      ],
    ),
    sc(
      'a18-16-palace-done',
      [
        N('The Tsar thanks her and sends her home with presents.'),
        N('A Tsar is the old word for a ruler, a bit like a king.'),
      ],
      [
        ask(
          1,
          'literacy',
          'the word Tsar',
          'ELOF: Language and Communication',
          [N('In this tale, what is a Tsar?')],
          [
            o(
              'A ruler, like a king',
              [N('Yes! A Tsar is a ruler, a bit like a king.', 'happy')],
              true,
            ),
            o('A baker', [N('Not a baker. A Tsar is a ruler, like a king.')]),
            o('A horse', [N('Not a horse. A Tsar is a ruler, like a king.')]),
          ],
          'Learned the meaning of the word Tsar (a ruler, like a king) from the story.',
        ),
      ],
    ),
    sc(
      'a18-16-shirts',
      [
        N('A man from the palace knocks. He holds the linen and looks worried.'),
        OLD('Nobody at court can sew it. Can she make it into shirts?'),
        V('Yes. Tell him yes.'),
        N('She sews twelve shirts at the window where the light is best.'),
        N('You thread her needles. Your Nubbin sorts the buttons into rows.'),
        N('The doll works at night. In the morning there is one more seam done.'),
      ],
      [
        doit(
          3,
          'maths',
          'count to twelve',
          'K.CC.B.5',
          'edu:count:shirts:12',
          [N('(Count the shirts together, one to twelve: twelve shirts!)')],
          'Counted to twelve to find how many shirts there are.',
        ),
      ],
    ),
    sc(
      'a18-16-shirts-done',
      [
        N('Twelve shirts lie folded on the table, white as first snow.'),
        N('Vasilisa rubs her tired eyes.'),
        N('The old woman carries the shirts to the palace.'),
      ],
      [
        notice(
          1,
          'health',
          'rest your eyes when doing close work',
          'ELOF: Perceptual, Motor, and Physical Development',
          [
            N('Sewing is close work. It tires the eyes.'),
            N('Use good light. Look far away sometimes, and rest your eyes.'),
          ],
          'Heard how to rest tired eyes after close work: good light, looking far away, resting.',
        ),
      ],
    ),
    sc(
      'a18-16-tsar',
      [
        N('The Tsar puts on one shirt. He sends for the seamstress.'),
        V('Me? At the palace? Like this?', 'shock'),
        OLD('Like that. Wash your face. It is a very good face.', 'happy'),
        N('On the steps she touches her pocket, then takes her hand out, steadier.'),
        TS('You made these? All of them?'),
        V('Yes, Majesty. With help.'),
        TS('Then I do not want to let you go. Would you mind very much?', 'soft'),
        V('I would not mind at all.', 'happy'),
      ],
      [
        ask(
          5,
          'sel',
          'honesty and sharing the thanks',
          'CASEL: Responsible decision-making',
          [N('Vasilisa says: with help. Why is that a good thing to say?')],
          [
            o(
              'It is true, and it shares the thanks',
              [N('Yes. Honest people share the thanks with those who helped.', 'happy')],
              true,
            ),
            o('It makes the shirts bigger', [
              N('Not bigger. It is honest, and it shares the thanks.'),
            ]),
          ],
          'Talked about honesty: saying who helped, and sharing the thanks.',
        ),
      ],
      [
        ch('cheer', 'Cheer, out loud, in a palace.', [
          N('You cheer. Your Nubbin runs round the throne room twice.'),
        ]),
        ch('squeeze', 'Just squeeze her hand.', [
          N('You squeeze her hand. She squeezes back so hard it hurts, and laughs.'),
        ]),
      ],
    ),
    sc(
      'a18-16-tsar-done',
      [
        N('They marry within the month.'),
        N('Bells ring, and somebody throws grain. Your Nubbin eats a good deal of it.'),
      ],
      [
        doit(
          1,
          'music',
          'loud and soft sounds',
          'ELOF: Perceptual, Motor, and Physical Development',
          'edu:clap:loud-soft:bells',
          [N('(Ring a pretend bell. Loud, loud, loud. Now soft, soft, soft.)')],
          'Made loud and soft sounds, like bells ringing.',
        ),
      ],
    ),
    sc(
      'a18-16-complete',
      [
        N('In spring the merchant comes home over the hill.'),
        MER('Married? My Vasilisa? To whom? To the… oh. Oh, my goodness.', 'shock'),
        N('He finds what he promised: a silver thimble. It goes in her other pocket.'),        MER('Did Nova say who won?', 'happy'),        Y('She says it was a draw. Nobody won.'),        MER('That is just what a winner would say.', 'think'),        N('She takes him to live with her, and the old woman too.'),
        N('Your Nubbin carries Baba Yaga’s bag of oats down the palace steps.'),
        N('Last of all, Vasilisa gives your Nubbin a little painted doll in a pouch.'),
        V('The real one stays with me. This one just needs looking after.', 'soft'),
        N('Your Nubbin looks at the pouch, then her pocket. It thinks that is fair.'),
        N('The tale ends the old way: the little doll stayed in her pocket, always.'),
        N('The page settles under your hand. You are back in the Grove.'),
      N('The doll goes in with the rest of its collection, in your coat.'),
      N('Your coat pocket has stopped trying.'),
      ],
      [
        ask(
          11,
          'literacy',
          'the main idea of a story',
          'ELOF: Literacy',
          [N('What is this story mostly about?')],
          [
            o(
              'Caring for others',
              [N('Yes! Vasilisa feeds and cares for others, and care comes back to her.', 'happy')],
              true,
            ),
            o('Winning a race', [N('There was no race. The story is about caring for others.')]),
            o('A lost hat', [N('No lost hat. The story is about caring for others.')]),
          ],
          'Named the main idea of the story: caring for others.',
        ),
      ],
    ),
  ],
);

// ================================================================== variants
export const EDU_A18_SPROUT_VARIANTS: EduScene[] = [
  // ---------------------------------------------------------------- Hazel’s margin note (s24Done)
  sc(
    'a18-02-margin-hazel',
    [
      N('Beside the cellar picture, there is a pencil note in the margin.'),
      N('You know the handwriting.'),
      N('“Feed them first. Somebody’s mother said it before I did.”', 'soft'),
      N('Under it is one letter: H.'),
      N('Your Nubbin puts its chin on the H.'),
    ],
    [
      doit(
        3,
        'literacy',
        'first sound and first letter of a name',
        'RF.K.2',
        'edu:say:first-sound:h',
        [
          N('(Hazel starts with hhh. Blow a little breath: hhh.)'),
          N('(What else starts with h? Hat? Horse?)'),
        ],
        'Said the first sound of Hazel (h) and thought of other words that start with it.',
      ),
    ],
  ),
  // ---------------------------------------------------------------- A18-10, step 2 (doll, self)
  sc(
    'a18-10-chores-doll',
    [
      N('Vasilisa sleeps on. The doll climbs down and works.'),
      N('It was fed twice last night. It works like two dolls!'),
      N('In the barn, the oats are already sifted. Your share is done.'),
      N('You pick up the broom. The doll takes it away.'),
      N('It gives you a stool, so you sit. It is very strange.'),
    ],
    [
      doit(
        1,
        'maths',
        'add one and one',
        'K.OA.A.1',
        'edu:add:dolls:2',
        [N('(One doll, and one more doll. How many dolls’ worth of work? Two!)')],
        'Added one and one to make two, using the doll’s double work.',
      ),
    ],
  ),
  sc(
    'a18-10-chores-self',
    [
      N('Vasilisa sleeps on. The doll climbs down and works.'),
      N('Your crust is inside you. So you sift your share by hand.'),
      N('You sift three scoops, then three more. Your Nubbin watches from the sack.'),
      N('The doll does its share, and Vasilisa’s. Yours it leaves to you.'),
      N('By evening your hands are sore, and every husk is gone. You checked twice.'),
    ],
    [
      doit(
        2,
        'maths',
        'add three and three',
        'K.OA.A.2',
        'edu:add:scoops:6',
        [N('(Three scoops now, and three more later. How many scoops? Six!)')],
        'Added three and three to make six scoops.',
      ),
    ],
  ),
  // ---------------------------------------------------------------- A18-11, step 2 (self)
  sc(
    'a18-11-poppy-self',
    [
      N('The doll walks into the poppy seeds. Seed and earth run apart around it.'),
      N('It works Vasilisa’s half. It leaves your half alone.'),
      N('It looks at you once. It is not unkind, only fair.'),
      N('You pick earth out of the seeds with a pin. Four specks are left.'),
      N('You pick out one. Your Nubbin noses the rest towards you.'),
      N('By dusk your eyes water. It is done.'),
    ],
    [
      doit(
        4,
        'maths',
        'take away: four take away one',
        'K.OA.A.2',
        'edu:subtract:specks:3',
        [N('(Put four beads on a plate. Take one away. How many are left? Three!)')],
        'Took one away from four to find three, using beads as specks.',
      ),
    ],
  ),
  // ---------------------------------------------------------------- A18-12, step 3 done (doll, self)
  sc(
    'a18-12-gate-doll',
    [
      N('At the gate, Baba Yaga stops you with one long finger.'),
      N('She sniffs your pockets, and Vasilisa’s, and frowns.'),
      BY('Twice the work done, and nobody tired. I do not ask how.', 'think'),
      BY('Go on. Do not come back.'),
    ],
    [
      notice(
        1,
        'science',
        'smell is one of our five senses',
        'ELOF: Scientific Reasoning',
        [
          N('Baba Yaga uses her nose to find things out. Smell is one of our senses.'),
          N('We have five: see, hear, smell, taste and touch.'),
        ],
        'Heard that smell is one of the five senses: see, hear, smell, taste, touch.',
      ),
    ],
  ),
  sc(
    'a18-12-gate-self',
    [
      N('At the gate, Baba Yaga stops you with one long finger.'),
      N('She takes your hand and looks at the sore red patches.'),
      BY('Hm. Honest, at least.', 'think'),
      BY('You worked. I pay for work.'),
      N('She tips a fair handful of oats into your palm. She pushes you out.'),
    ],
    [
      notice(
        2,
        'health',
        'sore hands: rest them and tell a grown-up',
        'ELOF: Perceptual, Motor, and Physical Development',
        [
          N('Lots of rubbing and lifting can make hands sore.'),
          N('Rest them. If they hurt, tell a grown-up.'),
        ],
        'Heard that hands can get sore from lots of work and that resting and telling a grown-up helps.',
      ),
    ],
  ),
  // ---------------------------------------------------------------- A18-13, step 1 (doll, self)
  sc(
    'a18-13-dark-doll',
    [
      N('The night wood is different. The lantern makes a small round room of light.'),
      N('Your Nubbin rides in your coat with its eyes shut. It shivers.'),
      N('Vasilisa goes first. She holds the lantern far from herself.'),
      V('It keeps looking at me. Not at the path. At me.', 'sad'),
      N('In her pocket the doll is warm and full. Her steps are sure.'),
      N('You walk all night and all the next day. The light never goes out.'),
    ],
    [
      notice(
        1,
        'science',
        'shivering helps a body make heat',
        'ELOF: Scientific Reasoning',
        [
          N('Your Nubbin shivers. Shivering is how a body makes itself warmer.'),
          N('Little shakes make heat. Bodies are clever!'),
        ],
        'Heard that shivering is the body’s way of making heat.',
      ),
    ],
  ),
  sc(
    'a18-13-dark-self',
    [
      N('The night wood is different. The lantern makes a small round room of light.'),
      N('Your Nubbin rides in your coat with its eyes shut. It shivers.'),
      N('You open your fist and feed it Baba Yaga’s oats, bit by bit.'),
      N('It eats them all, and stops shivering. Late, but not too late.', 'soft'),
      V('You gave it your wages.', 'soft'),
      N('You walk all night and all the next day. The light never goes out.'),
    ],
    [
      notice(
        3,
        'health',
        'food gives us energy',
        'ELOF: Perceptual, Motor, and Physical Development',
        [
          N('Oats are a healthy food. They give a body energy.'),
          N('When we eat, our bodies turn food into energy to move and keep warm.'),
        ],
        'Heard that food, like oats, gives our bodies energy to move and keep warm.',
      ),
    ],
  ),
  // ---------------------------------------------------------------- A18-15, step 2 done (doll, self)
  sc(
    'a18-15-loom-done-doll',
    [
      N('By morning there is a loom in the corner, small and neat.'),
      N('Beside it is a second loom, tiny as a slipper.'),
      N('On it is a cloth the size of a handkerchief.'),
      V('That one is not for me. I can guess who it is for.', 'happy'),
    ],
    [
      doit(
        1,
        'literacy',
        'size words: tiny, small, big',
        'RL.1.4',
        'edu:say:size-words:tiny-big',
        [N('(Say the size words: tiny, small, big, huge. Which is the tiny loom?)')],
        'Said size words (tiny, small, big, huge) to describe the two looms.',
      ),
    ],
  ),
  sc(
    'a18-15-loom-done-self',
    [
      N('By morning there is a loom in the corner, small and neat.'),
      N('Your Nubbin is awake and helping. It hands up the bobbins one by one.'),
      N('It has stayed close to your hands ever since the oats.'),
    ],
    [
      doit(
        1,
        'literacy',
        'first, next, last: how flax becomes cloth',
        'ELOF: Literacy',
        'edu:order:flax:pull-spin-weave',
        [
          N('Flax becomes cloth in steps. First, we pull the flax. Next, we spin thread.'),
          N('Last, we weave the thread into cloth. (Say it: pull, spin, weave.)'),
        ],
        'Put three steps in order (pull, spin, weave) using first, next and last.',
      ),
    ],
  ),
  // ---------------------------------------------------------------- A18-16, step 2 (self)
  sc(
    'a18-16-shirts-self',
    [
      N('A man from the palace knocks. Nobody at court can sew the linen.'),
      V('Will you sew one? You have good hands now. I saw them sift.'),
      N('So you sew one of the twelve, slowly. It comes out plain and straight.'),
      N('Vasilisa sews eleven. You sew one.'),
      N('Your Nubbin sorts the buttons. It keeps the plainest two for your shirt.'),
    ],
    [
      doit(
        3,
        'maths',
        'add eleven and one',
        '1.OA.A.1',
        'edu:add:shirts:12',
        [N('(Vasilisa sews eleven. You sew one. How many shirts in all? Twelve!)')],
        'Added eleven and one to make twelve shirts.',
      ),
    ],
  ),
  // ---------------------------------------------------------------- A18-16, complete (doll, self)
  sc(
    'a18-16-complete-doll',
    [
      N('In spring the merchant comes home over the hill.'),
      MER('Married? My Vasilisa? To whom? To the… oh. Oh, my goodness.', 'shock'),
      N('He finds what he promised: a silver thimble. It goes in her other pocket.'),      MER('Did Nova say who won?', 'happy'),      Y('She says it was a draw. Nobody won.'),      MER('That is just what a winner would say.', 'think'),      N('She takes him to live with her, and the old woman too.'),
      V('She wove this on her little loom. It is for your little one.', 'soft'),
      N('A cloth the size of a handkerchief. Your Nubbin lies down on it.'),
      N('Last of all, Vasilisa gives your Nubbin a little painted doll in a pouch.'),
      V('The real one stays with me. This one just needs looking after.', 'soft'),
      N('Your Nubbin looks at the pouch, then her pocket. It thinks that is fair.'),
      N('The tale ends the old way: the little doll stayed in her pocket, always.'),
      N('The page settles under your hand. You are back in the Grove.'),
      N('The doll goes in with the rest of its collection, in your coat.'),
      N('Your coat pocket has stopped trying.'),
    ],
    [
      ask(
        12,
        'literacy',
        'the main idea of a story',
        'ELOF: Literacy',
        [N('The doll made a gift for your Nubbin. What does that show?')],
        [
          o(
            'Kindness comes back round',
            [N('Yes! Care for others comes back round to you.', 'happy')],
            true,
          ),
          o('Dolls like bread', [N('Not bread. The gift shows that kindness comes back round.')]),
        ],
        'Talked about the story’s main idea: kindness comes back round.',
      ),
    ],
  ),
  sc(
    'a18-16-complete-self',
    [
      N('In spring the merchant comes home over the hill.'),
      MER('Married? My Vasilisa? To whom? To the… oh. Oh, my goodness.', 'shock'),
      N('He finds what he promised: a silver thimble. It goes in her other pocket.'),      MER('Did Nova say who won?', 'happy'),      Y('She says it was a draw. Nobody won.'),      MER('That is just what a winner would say.', 'think'),      N('She takes him to live with her, and the old woman too.'),
      N('At the wedding the Tsar wears one shirt you know. Yours, the plainest.'),
      N('He says it is for ordinary days. Vasilisa gives you its spare button.'),
      N('Last of all, Vasilisa gives your Nubbin a little painted doll in a pouch.'),
      V('The real one stays with me. This one just needs looking after.', 'soft'),
      N('Your Nubbin looks at the pouch, then her pocket. It thinks that is fair.'),
      N('The tale ends the old way: the little doll stayed in her pocket, always.'),
      N('The page settles under your hand. You are back in the Grove.'),
      N('The doll goes in with the rest of its collection, in your coat.'),
      N('Your coat pocket has stopped trying.'),
    ],
    [
      ask(
        12,
        'literacy',
        'the main idea of a story',
        'ELOF: Literacy',
        [N('Your plain shirt was chosen for ordinary days. What does that show?')],
        [
          o(
            'Plain, honest work is good work',
            [N('Yes! Honest work matters, even when it is plain.', 'happy')],
            true,
          ),
          o('Only fancy things matter', [N('Fancy is nice. But honest work matters too.')]),
        ],
        'Talked about the story’s main idea: honest work matters, even when it is plain.',
      ),
    ],
  ),
  // ---------------------------------------------------------------- Sable bonded (Grove, read-only)
  sc(
    'a18-16-sable',
    [
      N('You shut the atlas. Under the cottage table, something grey is waiting.'),
      N('Sable. She has the little painted doll between her paws.'),
      N('She holds it very carefully, as if it were an egg.'),
      N('She does not give it back. She does not run.', 'soft'),
      N('She puts her chin down on it and shuts her eyes.'),
      N('Your Nubbin looks at its empty pouch. Then it sits down beside her.'),
    ],
    [
      ask(
        3,
        'sel',
        'being gentle with a shy animal',
        'CASEL: Social awareness',
        [N('Sable is shy and slow to trust. What is a kind way to be with her?')],
        [
          o(
            'Sit quietly and wait',
            [N('Yes. Sitting quietly and waiting helps a shy friend feel safe.', 'soft')],
            true,
          ),
          o('Grab the doll back', [N('Grabbing would scare her. Sit quietly and wait.')]),
          o('Shout hello', [N('Shouting would frighten her. Sit quietly and wait.')]),
        ],
        'Chose a gentle way to be with a shy animal: sit quietly and wait.',
      ),
    ],
  ),
];

// ================================================================== exports
export const EDU_A18_SPROUT: EduQuest[] = [
  A01,
  A02,
  A03,
  A04,
  A05,
  A06,
  A07,
  A08,
  A09,
  A10,
  A11,
  A12,
  A13,
  A14,
  A15,
  A16,
];
/** Every `edu:` check string used by the lessons above. */
export const CHECKS: string[] = [
  'edu:act:action-words:lift',
  'edu:add:dolls:2',
  'edu:add:mushrooms:7',
  'edu:add:riders:3',
  'edu:add:scoops:6',
  'edu:add:shirts:12',
  'edu:breathe:slow:3',
  'edu:breathe:window:mist',
  'edu:clap:beat:song',
  'edu:clap:loud-soft:bells',
  'edu:count:bolts:4',
  'edu:count:hands:6',
  'edu:count:morsels:3',
  'edu:count:patches:6',
  'edu:count:shirts:12',
  'edu:count:steps:6',
  'edu:fold:paper:halves',
  'edu:hold:arms:rest',
  'edu:hum:throat:feel',
  'edu:hum:tune:short',
  'edu:make:pattern:white-red-black',
  'edu:make:shadow:hand',
  'edu:march:beat:slow-fast',
  'edu:name:colour:green',
  'edu:name:colour:grey',
  'edu:name:describing-words:birch',
  'edu:order:flax:pull-spin-weave',
  'edu:point:position:stove-window',
  'edu:say:first-sound:h',
  'edu:say:first-sound:v',
  'edu:say:name:self',
  'edu:say:pattern:over-under',
  'edu:say:repeat:three',
  'edu:say:rhyme:door',
  'edu:say:rhyme:gate',
  'edu:say:size-words:tiny-big',
  'edu:say:sound-words:creak',
  'edu:show:listening:body',
  'edu:sing:high-low:creak',
  'edu:sort:crayons:warm-cool',
  'edu:sort:grains:pale-dark',
  'edu:subtract:specks:3',
  'edu:tap:sound:soft-loud',
];
