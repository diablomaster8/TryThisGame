/**
 * The Learning Grove, reader band (ages 7–10): side stories S12, S17 and S18
 * (side-stories-new-2.ts).
 *
 *   S12 The Hum             how bee colonies swarm and split (3-LS2-1); sound, tuning forks and
 *                           pitch (1-PS4-1); think question: belonging, or being yourself?
 *   S17 Nightjar            owls: silent flight, night vision, hearing, turning heads (4-LS1-1,
 *                           4-LS1-2); how birds keep and turn their eggs; grief (think question)
 *   S18 The Grove Museum    fossils and rock layers (3-LS4-1, 4-ESS1-1); moths, camouflage and
 *                           spiders; rock pools and tides; the Plough and the Pole Star; think
 *                           question: what is a museum for?
 *
 * One EduScene per original scene (every step scene, every done scene, every complete scene).
 * These quests have no variant scenes. Every choice keeps its original id and `set`; reader keeps
 * every choice. S12’s naming choice: the sim still swaps “Solo” for the chosen name, as in the
 * main script.
 *
 * S18’s twelve plaque texts (Professor Delve’s quoted lines) are kept word for word: they are
 * the museum’s readable plaques, and every one is a checked, true fact.
 *
 * Accuracy notes: the Thrums are beetle-Nubbins, not bees, so where their story differs from a
 * real honeybee swarm (in a real swarm the OLD queen leaves), the lesson says so plainly.
 * See EDU-STYLE.md. British spelling.
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
const LU = say('luna');
const PX = say('pixel');
const NO = say('nova');
const DU = say('dusty');
const MA = say('marina');
const TH = say('thrums');
const SO = say('solo');
const QM = say('queen-mother');
const NJ = say('nightjar');
const DE = say('delve');

// ---------------------------------------------------------------- builders
type LessonIn = Omit<Lesson, 'id'>;

/** Builds `reader:<of>` and numbers its lessons `reader:<of>-l1`, `-l2`. */
const scene = (of: string, lines: Line[], lessons: LessonIn[], choices?: Choice[]): EduScene => {
  const id = `reader:${of}`;
  const s: EduScene = {
    id,
    of,
    band: 'reader',
    lines,
    lessons: lessons.map((l, i) => ({ id: `${id}-l${i + 1}`, ...l })),
  };
  if (choices) s.choices = choices;
  return s;
};

const gloss = (word: string, meaning: string, of: string): GlossaryEntry => ({ word, meaning, scene: `reader:${of}` });

// ================================================================== S12 The Hum
const S12_SCENES: EduScene[] = [
  // ------------------------------------------------ step 1: the one who says “I”
  scene(
    's12-solo',
    [
      N('Dusk in Luna’s night garden. The moonflowers open one by one, with a sound like someone unwrapping a sweet.'),
      LU('Keeper. Over here. Quietly. I’ve got something in a teacup, and I don’t know what to do with it.', 'think'),
      N('In the teacup is a beetle the size of your thumb. It is round and bronze, with a fuzzy back like a peach.'),
      N('It is, just about, a Nubbin. Its wings buzz whenever anyone speaks.'),
      LU('It’s a Thrum. Hundreds of them live in Hush’s old wall, in a colony. They hum. They never come out alone.'),
      N('The beetle looks up at you. It clears its throat, which for a beetle is mostly wings.'),
      SO('We are— no.', 'shock'),
      SO('I. I am. Good evening. I am sorry. I am not sure who is sorry. I think it is me.', 'sad'),
      LU('It’s been doing that for an hour. It finds it very upsetting.', 'soft'),
      LU('It needs a name, I think. Things that say “I” usually do.'),
    ],
    [
      {
        domain: 'science',
        skill: 'insects that live together in a colony',
        standard: '3-LS2-1',
        kind: 'notice',
        after: 4,
        lines: [
          LU('Thrums live a bit like honeybees. A honeybee colony can be tens of thousands of bees, all sharing one home.'),
          LU('Each bee has a job: cleaning, building wax, feeding babies, guarding the door, fetching nectar.'),
          LU('Together they survive things no single bee could. Alone, one bee doesn’t last long at all.'),
        ],
        parentNote: 'Learned that honeybees live in colonies where each bee has a job, and the group helps them all survive.',
      },
      {
        domain: 'literacy',
        skill: 'the meaning of the word “solo”',
        standard: 'L.3.4',
        kind: 'ask',
        after: 9,
        prompt: [
          LU('In music, when one person sings on their own, it’s called a solo.'),
          LU('So what might “Solo” mean, as a name for a beetle?'),
        ],
        options: [
          {
            label: 'One on its own.',
            best: true,
            reply: [LU('Exactly. A solo is one voice on its own. That’s what this beetle is, for the first time ever.')],
          },
          {
            label: 'Very loud.',
            reply: [
              LU('A solo can be loud, but that isn’t what the word means.'),
              LU('It means one on its own. A solo singer sings alone.'),
            ],
          },
          {
            label: 'A kind of beetle.',
            reply: [LU('Good guess, but no. “Solo” means one on its own, like a singer singing alone.')],
          },
        ],
        parentNote: 'Worked out the meaning of “solo” from its use in music.',
      },
    ],
    [
      {
        id: 'solo',
        label: 'Call it Solo.',
        set: { 's12-name': 'solo' },
        then: [
          SO('Solo. Solo is… one of something. Yes. That is what I am. For now.', 'think'),
          LU('For now. Good. Always leave yourself a way back.', 'soft'),
        ],
      },
      {
        id: 'own',
        label: 'Give it a name of your own.',
        set: { 's12-name': 'own' },
        then: [
          N('You say a name. The beetle repeats it three times under its breath, like testing a step.'),
          SO('Nobody has ever said a thing just to me before. It is very loud.', 'shock'),
        ],
      },
      {
        id: 'ask',
        label: 'Ask what it would like to be called.',
        set: { 's12-name': 'asked' },
        then: [
          SO('Like? I have never liked anything on my own. We like things. Together. When we all agree.', 'think'),
          SO('…I would like you to choose. Is that allowed? That is my first like.', 'soft'),
          N('You call it Solo. It seems to fit, the way a borrowed coat fits.'),
        ],
      },
    ],
  ),
  scene(
    's12-wall',
    [
      N('The old wall hums. You feel it before you hear it. Lay a palm on the stone and it buzzes like a purring cat.'),
      N('The cracks smell faintly of honey. Every crack has a tiny round door, and every door has a face in it.'),
      TH('Good evening, Keeper.'),
      TH('We would like to say: thank you for returning the one.'),
      TH('We would also like to say: the one is welcome. One moment. We are checking we all agree about “welcome”.', 'think'),
      N('There is a long pause, full of buzzing.'),
      TH('We do. Welcome. We are sorry about the delay. We are very many.', 'happy'),
      N('Solo does not get out of the teacup. Solo climbs up your sleeve instead, and stays there, humming quietly, alone.'),
      SO('In a minute. I will go in in a minute.', 'sad'),
      N('It does not go in.'),
    ],
    [
      {
        domain: 'science',
        skill: 'sound is made by vibration, and vibration can be felt',
        standard: '1-PS4-1',
        kind: 'ask',
        after: 0,
        prompt: [N('The wall buzzes under your hand. Stone can’t hum by itself. So what are you feeling?')],
        options: [
          {
            label: 'Hundreds of tiny wings shaking, and the shaking passing into the stone.',
            best: true,
            reply: [
              N('Yes. Fast shaking is called vibration. The Thrums’ wings vibrate, and that makes the hum.'),
              N('The vibration travels into the stone, so your hand can feel the sound as well as hear it.'),
            ],
          },
          {
            label: 'The wind blowing through the cracks.',
            reply: [
              N('Wind can whistle, but tonight the air is still.'),
              N('It’s the Thrums’ wings. They shake very fast. That shaking is called vibration, and it makes the hum.'),
            ],
          },
          {
            label: 'The stone is warm.',
            reply: [
              N('Warmth doesn’t buzz. A buzz is a shake.'),
              N('The Thrums’ wings shake very fast. That’s vibration, and vibration makes sound you can feel.'),
            ],
          },
        ],
        parentNote: 'Learned that sound is made by vibration, and that vibrations can be felt through solid things.',
      },
      {
        domain: 'sel',
        skill: 'noticing when someone isn’t ready',
        standard: 'CASEL: Social awareness',
        kind: 'notice',
        after: 9,
        lines: [
          N('Solo says “in a minute”, but doesn’t move. Sometimes that means: I’m not ready, and I don’t know how to say so.'),
          N('You don’t have to push. You can let someone stay close until they are ready.'),
        ],
        parentNote: 'Noticed that a character wasn’t ready, and that giving someone time is a kind response.',
      },
    ],
  ),
  // ------------------------------------------------ step 2: the hum goes flat
  scene(
    's12-flat',
    [
      N('Next morning Pixel is at the old wall with a tuning fork, a notebook and a very serious face.'),
      PX('Hi. Don’t move. Sorry. You can move. Just don’t buzz.', 'think'),
      PX('I tune my lantern timer to this wall. Have done for years. It hums a perfect B-flat. Nearly. Always has.'),
      N('She taps the fork on her knee and holds it to the stone. The fork sings. The wall sings back, a tiny bit lower.'),
      PX('It’s gone flat. Walls don’t go flat. Walls don’t do anything. That’s their whole thing.', 'shock'),
      TH('Good morning. We are sorry about the flat.', 'sad'),
      TH('It is our Queen-Mother. She is the middle of the hum. She is getting quieter.'),
      TH('When the middle goes quiet, the hum splits. Half of us leave with a new queen. Half of us stay.'),
      TH('We have done it before. We do not remember it. The ones who remember always leave.'),
      PX('That is the saddest thing a wall has ever said to me.', 'sad'),
      N('In your sleeve, Solo has gone completely still.'),
    ],
    [
      {
        domain: 'music',
        skill: 'pitch: what “flat” means in music',
        standard: '1-PS4-1',
        kind: 'ask',
        after: 4,
        prompt: [
          PX('A tuning fork always plays the same note. That’s what makes it useful.'),
          PX('The wall’s note is now a little lower than the fork’s. So what does “flat” mean in music?'),
        ],
        options: [
          {
            label: 'A note that’s a bit lower than it should be.',
            best: true,
            reply: [
              PX('Exactly. Flat means a little too low. A bit too high is called sharp.'),
              PX('Slower vibrations make lower notes. Something in that wall has slowed down.'),
            ],
          },
          {
            label: 'A note that’s too loud.',
            reply: [
              PX('Loud and soft is a different thing. That’s volume.'),
              PX('Flat is about pitch: a note that’s a little too low. Slower vibrations make lower notes.'),
            ],
          },
          {
            label: 'A wall with no bumps.',
            reply: [
              PX('Ha! That’s the other meaning. Same word, two jobs.'),
              PX('In music, flat means a note a little too low. Slower vibrations make lower notes.'),
            ],
          },
        ],
        parentNote: 'Learned that “flat” means a note slightly too low, and that slower vibrations make lower notes.',
      },
      {
        domain: 'science',
        skill: 'how a honeybee colony swarms and splits',
        standard: '3-LS2-1',
        kind: 'notice',
        after: 8,
        lines: [
          PX('Real honeybees do this too. It’s called swarming. When a hive gets crowded, the colony splits in two.'),
          PX('In bees it’s the old queen who leaves, with about half the workers. A new queen grows up in the old hive.'),
          PX('Thrums aren’t bees, so they do it their own way. But a split is how one colony becomes two.'),
        ],
        parentNote: 'Learned that a honeybee colony splits by swarming: the old queen leaves with about half the bees.',
      },
    ],
  ),
  scene(
    's12-queen',
    [
      N('At dusk you lie in the grass with your ear against the bottom stone, where the moss is warmest.'),
      N('Deep in the wall, under all the others, there is one slow note, like a big bee in a shut room.'),
      QM('Ah. The Keeper. And the one in your sleeve. Yes, I can hear it. I can hear all of them.', 'soft'),
      QM('I will tell you a secret. Don’t tell the others. They all think together, as one big “we”.'),
      QM('I have said “I” for a very long time. Somebody has to, in the middle of a we. Somebody has to decide when.', 'think'),
      QM('It is quite lonely. Nobody tells you that about the middle.', 'sad'),
      N('Solo makes a small sound in your sleeve, like a question with no words in it.'),
      QM('On the first warm, still morning, half will go. The young one must choose. Go, stay, or something else.', 'soft'),
      QM('Don’t choose for it. Then you would be one more crowd, deciding for one small beetle.', 'happy'),
    ],
    [
      {
        domain: 'science',
        skill: 'sound travels well through solids',
        standard: '4-PS3-2',
        kind: 'do',
        after: 1,
        lines: [
          N('Press your ear right against the stone. Now lift it away, just a little. Now press it back.'),
          N('The deep note is clearer with your ear on the stone. Sound travels through solids, and often better than through air.'),
          N('It’s why you can hear a tap on a table so clearly with your ear pressed to the wood.'),
        ],
        check: 'edu:listen:old-wall:ear-to-stone',
        parentNote: 'Compared listening through stone and through air, to learn that sound travels through solid things.',
      },
      {
        domain: 'sel',
        skill: 'letting others make their own choices',
        standard: 'CASEL: Responsible decision-making',
        kind: 'ask',
        after: 8,
        prompt: [N('Why does the Queen-Mother tell you not to choose for Solo?')],
        options: [
          {
            label: 'Because Solo has only just learned to say “I”, and should get to choose.',
            best: true,
            reply: [
              N('Yes. If you chose, you’d be one more crowd deciding for Solo.'),
              N('You can help someone think. The choice is still theirs.'),
            ],
          },
          {
            label: 'Because she wants to choose herself.',
            reply: [
              N('She could, but she doesn’t. She says the young one must choose.'),
              N('Solo has just started saying “I”. Choosing for itself is part of that.'),
            ],
          },
          {
            label: 'Because it doesn’t matter what Solo does.',
            reply: [
              N('It matters a lot to Solo. That’s exactly why the choice should be Solo’s.'),
              N('You can help someone think. The choice is still theirs.'),
            ],
          },
        ],
        parentNote: 'Thought about why people should get to make their own choices, with help rather than orders.',
      },
    ],
  ),
  // ------------------------------------------------ step 3: a night alone
  scene(
    's12-dark',
    [
      N('Solo won’t go into the wall and won’t come out of your sleeve. So that evening you take it to Luna’s garden.'),
      N('Luna has raked the gravel into slow spirals. In the dark they shine a little, like the inside of a shell.'),
      SO('In the hum I am warm on every side. Nothing is my fault. Nothing is mine. It is very restful.', 'soft'),
      SO('Out here everything is mine. The dark is mine. The cold is mine. This leaf is mine, and I did not ask for it.', 'sad'),
      SO('If I go back, I stop. Not die. Stop being the one who is frightened. I would quite like to stop.'),
      SO('But I would also like to see what happens next. To me. Is that greedy?', 'think'),
      LU('I garden at night because nobody else does. I liked being on my own before I liked anything else.', 'soft'),
      N('Solo buzzes so hard at every word that the teacup rattles. Luna holds it still with one finger, and carries on.'),
      LU('No. That’s not true. It took years. Some nights I still don’t like it. I come out anyway.'),
      LU('That isn’t an answer. I haven’t got one. I’ve just got a garden.', 'think'),
    ],
    [
      {
        domain: 'literacy',
        skill: 'similes: comparing with “like”',
        standard: 'L.4.5',
        kind: 'notice',
        after: 1,
        lines: [
          N('“Like the inside of a shell” is a simile. A simile compares two things using “like” or “as”.'),
          N('It helps you picture the gravel: pale, smooth, with a soft shine.'),
        ],
        parentNote: 'Spotted a simile and talked about the picture it puts in the reader’s mind.',
      },
      {
        domain: 'sel',
        skill: 'thinking about belonging and being yourself',
        standard: 'CASEL: Self-awareness',
        kind: 'ask',
        after: 9,
        prompt: [
          N('Solo is torn. In the hum it belongs, and it’s safe. Out here it’s itself, and it’s scared.'),
          N('What do you think matters more: belonging to a group, or being yourself?'),
        ],
        options: [
          {
            label: 'Belonging. Being part of something keeps you warm and safe.',
            reply: [
              N('That’s a fair answer. Groups look after us, and nobody does well completely alone.'),
              N('The Queen-Mother might add: a good group still lets you be you inside it.'),
            ],
          },
          {
            label: 'Being yourself. You should get to think your own thoughts.',
            reply: [
              N('That’s a fair answer. Your own thoughts, likes and choices matter.'),
              N('Luna might add: being yourself can be lonely sometimes, and that’s all right too.'),
            ],
          },
          {
            label: 'Both. You can be yourself and still belong.',
            reply: [
              N('That’s a fair answer, and a hard one to manage. Most people spend their whole lives working on it.'),
              N('Friends who like you as you are are a way of having both.'),
            ],
          },
          {
            label: 'I don’t know yet.',
            reply: [
              N('That’s an honest answer. Luna doesn’t know either, and she’s had years to think about it.'),
              N('Some questions are worth carrying around for a while.'),
            ],
          },
        ],
        parentNote: 'Think question (no right answer): weighed belonging to a group against being yourself.',
      },
    ],
  ),
  scene(
    's12-swarm-goes',
    [
      N('You wake on the bench with dew in your hair. The air is warm and doesn’t move. It is the morning she meant.'),
      N('Across the Grove, the old wall roars.'),
      N('Bronze pours out of every crack at once and turns in the air, glittering, like a handful of pennies thrown at the sun.'),
      TH('Goodbye. Goodbye. We are leaving. Some of us are leaving. We are deciding which.', 'shock'),
      TH('It is going very slowly. We are sorry. We are trying to be quick and also polite.'),
      SO('I want to see where they go. Not to go. To see. Is there a difference?', 'think'),
      PX('There’s a difference. I’ve got a tuning fork. Come on.', 'happy'),
    ],
    [
      {
        domain: 'science',
        skill: 'when and how swarms leave',
        standard: '3-LS2-1',
        kind: 'notice',
        after: 2,
        lines: [
          PX('Honeybees swarm on warm, calm days too. Thousands pour out at once and swirl in a big cloud.'),
          PX('Swarms are usually gentle. They have no home and no honey to guard yet, so they’re busy, not cross.'),
        ],
        parentNote: 'Learned that honeybee swarms leave on warm days and are usually gentle because they have no home to guard.',
      },
      {
        domain: 'maths',
        skill: 'finding half of a number',
        standard: '3.NF.A.1',
        kind: 'ask',
        after: 4,
        prompt: [PX('Say there were 400 Thrums in the wall, and exactly half leave. How many are leaving?')],
        options: [
          {
            label: '200',
            best: true,
            reply: [PX('Yes. Half means two equal parts. 200 go and 200 stay. 200 and 200 make 400.')],
          },
          {
            label: '100',
            reply: [
              PX('100 is a quarter of 400: that’s four equal parts.'),
              PX('Half means two equal parts. 400 split in two is 200 and 200.'),
            ],
          },
          {
            label: '40',
            reply: [
              PX('Not quite. 40 is much smaller than half.'),
              PX('Half of 4 is 2, so half of 400 is 200. 200 go and 200 stay.'),
            ],
          },
        ],
        parentNote: 'Found half of 400 by splitting it into two equal parts.',
      },
    ],
  ),
  // ------------------------------------------------ step 4: follow the swarm
  scene(
    's12-follow',
    [
      N('Pixel presses the fork into your hand. It is warm from her pocket and has PROPERTY OF PIXEL scratched on the handle.'),
      PX('Strike it on your knee. Hold it up. Turn slowly.'),
      PX('When the fork and the swarm match, it buzzes in your fingers. That means you’re facing them.'),
      PX('Walk that way. Strike it again when it goes quiet.'),
      PX('Don’t walk into the stream. People do.'),
      PX('Not me. Other people. Specific other people.', 'think'),
    ],
    [
      {
        domain: 'science',
        skill: 'a tuning fork vibrates to make its note',
        standard: '1-PS4-1',
        kind: 'notice',
        after: 1,
        lines: [
          N('Strike the fork and look closely. The two prongs blur. They are shaking back and forth very fast.'),
          N('That shaking pushes the air, and the pushes reach your ear as sound. Dip a ringing fork in water and it splashes.'),
          N('As the shaking dies away, the sound fades. That’s why you have to strike it again.'),
        ],
        parentNote: 'Learned that a tuning fork makes sound by vibrating, and the sound fades as the vibration dies away.',
      },
      {
        domain: 'science',
        skill: 'using sound to find where something is',
        standard: '4-LS1-2',
        kind: 'do',
        after: 3,
        lines: [
          N('Strike the fork. Turn slowly, a little at a time. Stop where the hum sounds loudest in your ears.'),
          N('Your ears do this all day, too. Turn your head, and a sound gets louder when you face it.'),
        ],
        check: 'edu:turn:tuning-fork:loudest',
        parentNote: 'Turned to find the direction a sound was strongest, to locate something by hearing.',
      },
    ],
  ),
  scene(
    's12-settled',
    [
      N('The fork leads you over the stream to Hazel’s crooked tree.'),
      N('The swarm hangs from a branch in a great buzzing lump, the shape of a pear.'),
      N('Pixel holds her fork to it, then towards the wall, then to it again. Then she sits down hard on the bank.'),
      N('Her left boot squelches. She does not mention it.'),
      PX('It was never one note.', 'shock'),
      PX('It’s hundreds of tiny notes, all a bit different. Together they sound like one big note. That’s all a hum is.'),
      PX('I’ve been tuning a clock to a crowd. For years.', 'happy'),
      TH('We are here. We are a new we. We are not yet sure what we are like.', 'think'),
      TH('One. Solo. Will you come into a we? This one or the old one. Either is warm.', 'soft'),
      SO('Keeper. I don’t know. Sit with me. No. Tell me. No. Both. Is that allowed?', 'sad'),
      N('You don’t choose for it. You sit down on the bank beside the teacup, and wait for Solo to decide.'),
    ],
    [
      {
        domain: 'science',
        skill: 'how a swarm finds a new home',
        standard: '3-LS2-1',
        kind: 'notice',
        after: 1,
        lines: [
          N('A real bee swarm does this too. It hangs in a cluster on a branch, with the queen tucked safely inside.'),
          N('Scout bees fly off to look for a new home, like a hollow tree.'),
          N('Back at the cluster, a scout does a special dance that shows the others which way to go.'),
        ],
        parentNote: 'Learned that a bee swarm waits in a cluster while scout bees find a new home and dance to share it.',
      },
      {
        domain: 'music',
        skill: 'many voices on nearly the same note sound like one',
        kind: 'notice',
        after: 6,
        lines: [
          PX('A choir works the same way. Lots of voices, each a tiny bit different, blend into one big, rich sound.'),
          PX('One voice is a solo. Lots together is a chorus. Both are music.'),
        ],
        parentNote: 'Learned how many voices singing nearly the same note blend into one sound, as in a choir.',
      },
    ],
    [
      {
        id: 'hum',
        label: 'Solo chooses the hum. You nod.',
        set: { 's12-solo': 'hum' },
        then: [
          N('You carry the teacup back to the old wall. Solo looks at you for a long moment, then climbs out.'),
          SO('I will forget being frightened. I think I will forget this, too. Will you remember it for me?', 'soft'),
          N('It walks in through a round door in the stone. The hum goes on, a tiny bit fuller than before.'),
          PX('Listen to that. B-flat. Nearly. It’s back in tune.', 'soft'),
        ],
      },
      {
        id: 'alone',
        label: 'Solo chooses a home of its own. You nod.',
        set: { 's12-solo': 'alone' },
        then: [
          N('You find it a knot-hole in the gatepost, out of the wind, with a view of the pond. It inspects it for a long time.'),
          SO('Mine. The knot-hole is mine. I chose it. Nobody agreed.', 'happy'),
          SO('It is very quiet in here. I will get used to it. Or I will get used to not being used to it.'),
          N('Every dusk after that, a tiny hum comes from the gatepost. One note. Slightly flat. All its own.'),
        ],
      },
      {
        id: 'gaps',
        label: 'Solo asks the hum to leave a little room. You nod.',
        set: { 's12-solo': 'gaps' },
        then: [
          SO('Lean. But leave a gap. For one. Is that allowed?', 'think'),
          TH('We will discuss it.', 'think'),
          N('They discuss it. It takes until lunch. Pixel eats a sandwich. Then a second sandwich. Then yours.'),
          TH('We have agreed. We will be a hum with gaps in it. Ones may go out, and come in, and go out.', 'happy'),
          TH('We have also agreed this was the longest meeting in the history of the wall. We are very proud.'),
          SO('In for supper. Out for the stars. I can do that. I can be both, slowly.', 'happy'),
        ],
      },
    ],
  ),
  // ------------------------------------------------ complete
  scene(
    's12-complete',
    [
      N('A week later, the Queen-Mother dies in the night. She was very old, and the whole wall hummed round her, so she was not alone.'),
      N('It is sad, and it is all right to be sad.'),
      N('In the morning there is a gift on your doorstep: a little hive of clay and wax, no bigger than a teapot.'),
      TH('For the Keeper. It hums. We taught it. We hope that is not rude.', 'soft'),
      N('At dusk it hums a tune you know: the bit of the Lantern Song that comes round twice.'),
      N('Beside it stands a thimble of pale gold nectar that smells of the wall in summer.'),
      TH('Hum-nectar. A Nubbin who sips it is calm for a day. Only a day. We did not want to overdo it.'),
      N('You find you can now hum in tune with anyone nearby. You and Pixel try it, and get B-flat. Nearly.'),
      PX('I’ve retuned the lantern timer. Not to B-flat. To the whole crowd. It runs a bit early now. Byte will hate it. I like it.', 'happy'),
    ],
    [
      {
        domain: 'maths',
        skill: 'hexagons, and shapes that fit together with no gaps',
        kind: 'do',
        after: 2,
        lines: [
          N('Look inside the little hive. The wax is made of rows of tiny cells, like real honeycomb.'),
          N('Tap one cell and count its sides. Six sides: a hexagon. Bees build their honeycomb cells this shape too.'),
          N('Hexagons fit together with no gaps between them, so no space and no wax is wasted.'),
        ],
        check: 'edu:tap:shape:hexagon',
        parentNote: 'Counted the six sides of a honeycomb cell and learned that hexagons fit together without gaps.',
      },
      {
        domain: 'sel',
        skill: 'ways to feel calm',
        standard: 'CASEL: Self-management',
        kind: 'notice',
        after: 7,
        lines: [
          N('There’s no hum-nectar for people. But there are other ways to calm down when feelings get big.'),
          N('Slow breaths. A quiet hum. Sitting with someone you trust. Each of these can help, and you can try more than one.'),
        ],
        parentNote: 'Talked about real ways to calm down: slow breathing, humming, and sitting with someone trusted.',
      },
    ],
  ),
];

const S12: EduQuest = {
  id: 'reader:s12',
  of: 's12',
  band: 'reader',
  title: 'The Hum',
  goals: {
    's12-step1': {
      goal: 'Carry Solo home to the Thrums in the old wall.',
      hint: 'Hush’s old wall is the tumbled stone one on the north side of the Grove. Keep the teacup level: Solo gets seasick.',
    },
    's12-step2': {
      goal: 'Put your ear to the old wall at dusk and listen for the Queen-Mother.',
      hint: 'She lives at the heart of the wall, low down by Hush’s lantern post. Go when the hum is quietest, and keep still.',
    },
    's12-step3': {
      goal: 'Sit with Solo in Luna’s garden until the first warm, still morning.',
      hint: 'Sit on the bench by the moonflowers after dark, and don’t get up. Solo doesn’t need answers. It needs company.',
    },
    's12-step4': {
      goal: 'Follow the swarm by sound with Pixel’s tuning fork.',
      hint: 'Strike the fork and turn slowly. The hum sounds loudest when you face the swarm. If you lose them, stand still and strike it again.',
    },
  },
  scenes: S12_SCENES,
  glossary: [
    gloss('colony', 'A big group of animals of one kind that live together and help each other.', 's12-solo'),
    gloss('vibration', 'A very fast shaking, back and forth. Vibrations make sound.', 's12-wall'),
    gloss('flat', 'In music, a note that is a little lower than it should be.', 's12-flat'),
    gloss('swarm', 'A big group of insects flying together, like bees leaving to find a new home.', 's12-flat'),
    gloss('simile', 'A way of describing something by comparing it to another thing, using “like” or “as”.', 's12-dark'),
    gloss('scout', 'Someone sent ahead to look around and find out what is there.', 's12-settled'),
    gloss('chorus', 'A group of voices speaking or singing together.', 's12-settled'),
    gloss('hexagon', 'A flat shape with six straight sides.', 's12-complete'),
  ],
  notes:
    'Lessons: honeybee colonies, swarming and scouts (3-LS2-1; the lesson says plainly that in real bees the OLD queen ' +
    'leaves, since the Thrums are not bees); sound as vibration, tuning forks, pitch and “flat”, sound through solids, ' +
    'finding a sound’s direction; half of 400; hexagons in honeycomb; the word “solo”; a simile; think question on ' +
    'belonging vs being yourself; letting others choose; ways to calm down. The do lessons have no scoring.',
};

// ================================================================== S17 Nightjar
const S17_SCENES: EduScene[] = [
  // ------------------------------------------------ step 1: the missing eggs
  scene(
    's17-missing',
    [
      N('Autumn. The first conkers are down, and the nursery straw is damp with dew.'),
      N('In the straw there is a round, warm dent where an egg was last night. It is the fourth dent this fortnight.'),
      LU('One a night. Always the warmest one. Never a crack, never a crumb of shell. Whatever it is, it’s careful.', 'think'),
      NO('Morning. I’m not stopping. I was passing, and I heard there was a mystery, and I’m not stopping.'),
      NO('Badger.', 'think'),
      LU('It’s not a badger.'),
      NO('A tall badger.'),
      LU('Look at the straw before you trample it, both of you. Then we can talk about tall badgers.', 'soft'),
    ],
    [
      {
        domain: 'literacy',
        skill: 'using clues to back up an idea',
        standard: 'RL.3.3',
        kind: 'ask',
        after: 2,
        prompt: [N('Luna says, “Whatever it is, it’s careful.” Which clue tells her that?')],
        options: [
          {
            label: 'There’s never a crack or a crumb of shell.',
            best: true,
            reply: [N('Yes. A clumsy thief would break things. Not one crumb means something handled the eggs very gently.')],
          },
          {
            label: 'It takes one egg a night.',
            reply: [
              N('That clue tells us how often it comes, not how it behaves.'),
              N('The careful clue is the shells: never a crack, never a crumb.'),
            ],
          },
          {
            label: 'The straw is damp with dew.',
            reply: [
              N('The dew tells us it was a cool, damp night. It doesn’t tell us about the thief.'),
              N('The careful clue is the shells: never a crack, never a crumb.'),
            ],
          },
        ],
        parentNote: 'Picked the clue in the text that supports a character’s idea.',
      },
      {
        domain: 'science',
        skill: 'eggs need steady warmth to grow',
        standard: '1-LS1-2',
        kind: 'notice',
        after: 7,
        lines: [
          LU('Notice it always takes the warmest egg. A bird’s egg needs steady warmth, or the chick inside can’t grow.'),
          LU('That’s why parent birds spend most of the day and night sitting on their eggs.'),
        ],
        parentNote: 'Learned that a bird’s egg needs steady warmth from a parent for the chick inside to grow.',
      },
    ],
  ),
  scene(
    's17-clues',
    [
      N('On the top rail of the fence: a grey feather as long as your forearm, soft as smoke. Its edge is torn, as if on rock.'),
      N('On the roof, faint scratches. Something landed very gently here, and left very gently.'),
      N('And the dent in the straw is still warm, hours later. Something kept that egg warm until the last second.'),
      LU('That’s an owl’s. A big owl. Bigger than an owl has any business being.', 'shock'),
      NO('Two badgers in a coat, holding an owl feather to throw us off.', 'happy'),
      LU('Nova.'),
      NO('It stays on the list. Lists should be long. Tonight, then? I’m not stopping. I’m just staying up.', 'think'),
    ],
    [
      {
        domain: 'maths',
        skill: 'choosing the right unit of length',
        standard: '4.MD.A.1',
        kind: 'ask',
        after: 0,
        prompt: [N('You want to write down how long the feather is. Which unit would you use?')],
        options: [
          {
            label: 'Centimetres',
            best: true,
            reply: [N('Yes. Centimetres suit things you can hold in your hands. This feather is about 30 centimetres long.')],
          },
          {
            label: 'Kilometres',
            reply: [
              N('A kilometre is a thousand metres: about a quarter of an hour’s walk. Far too big for a feather!'),
              N('Centimetres suit things you can hold. This feather is about 30 centimetres long.'),
            ],
          },
          {
            label: 'Metres',
            reply: [
              N('A metre is about one big stride. The feather is much shorter than that.'),
              N('Centimetres fit better. This feather is about 30 centimetres long.'),
            ],
          },
        ],
        parentNote: 'Chose centimetres as the sensible unit for measuring a feather, comparing it with metres and kilometres.',
      },
      {
        domain: 'science',
        skill: 'how owls fly silently',
        standard: '4-LS1-1',
        kind: 'notice',
        after: 3,
        lines: [
          LU('Run your finger along the front edge. Feel that soft fringe, like the teeth of a comb?'),
          LU('Most birds’ feathers are stiff and smooth there. An owl’s break up the rushing air, so its wings hardly make a sound.'),
          LU('That’s how an owl flies silently. Mice don’t hear it coming. And nor did we.'),
        ],
        parentNote: 'Learned that the soft, comb-like edges of owl feathers let owls fly almost silently.',
      },
    ],
  ),
  // ------------------------------------------------ step 2: the night garden
  scene(
    's17-night',
    [
      N('After dark, Luna’s garden feels like another country. The white flowers are wide open, and the raked paths glow faintly.'),
      LU('We watch the nursery from in here. The flower beds give shadow. The gravel doesn’t.', 'think'),
      LU('Gravel tells everyone everything.'),
      LU('Stay on the moss. Stay low. If something lands, don’t stare at it. Owls hate being stared at. So do I.'),
      NO('Can I bring the list?'),
      LU('You can bring the list in your head. Quietly.', 'soft'),
    ],
    [
      {
        domain: 'science',
        skill: 'owls’ amazing hearing',
        standard: '4-LS1-2',
        kind: 'notice',
        after: 2,
        lines: [
          LU('We have to be quiet because owls hear astonishingly well.'),
          LU('Many owls have a round, flat face, like a dish. It gathers sounds and steers them to their ears.'),
          LU('Some owls can catch a mouse hidden under snow, just by listening for it.'),
        ],
        parentNote: 'Learned that an owl’s dish-shaped face gathers sound, giving it superb hearing for hunting.',
      },
      {
        domain: 'science',
        skill: 'sorting materials by a property: quiet or noisy underfoot',
        standard: '2-PS1-1',
        kind: 'do',
        after: 5,
        lines: [
          N('Before you set off, test the ground. Tap each patch: moss, thyme, gravel, dry leaves, an old snail shell.'),
          N('Sort them into quiet and noisy. Soft, springy things are quiet. Hard, brittle, crunchy things are noisy.'),
        ],
        check: 'edu:sort:ground:quiet-noisy',
        parentNote: 'Sorted materials into quiet and noisy by testing them, linking sound to how soft or hard they are.',
      },
    ],
    [
      {
        id: 'luna',
        label: 'Follow Luna’s path exactly.',
        set: { 's17-path': 'luna' },
        then: [LU('Good. Left foot on the thyme. It doesn’t mind. It smells nicer for it.', 'soft')],
      },
      {
        id: 'own',
        label: 'Find your own way through.',
        set: { 's17-path': 'own' },
        then: [
          N('You step on a snail shell. It cracks, as loud as a firework. The whole garden holds its breath. So does Luna.'),
          LU('…Your own way is very loud.', 'think'),
        ],
      },
    ],
  ),
  scene(
    's17-reveal',
    [
      N('Midnight. The wind drops. Something crosses the moon without a sound, and the garden goes still beneath it.'),
      N('An owl lands on the nursery roof. She is enormous, grey as ash, and one long feather on her left wing is torn.'),
      N('She lifts an egg out of the straw in her feet, slowly, the way you would carry a held breath.'),
      N('Then she turns her head right round and looks at your hiding place. For a long moment she only looks.'),
      NJ('Hoo-oo.', 'soft'),
      N('Then she’s gone towards the cliffs, low over the hedges, carrying the egg as if it were the only thing in the world.'),
      NO('…I’m crossing off the badgers.', 'shock'),
      LU('Nightjar. That’s what Hazel called her. I thought she was a story. The biggest owl in the valley, Hazel said.', 'soft'),
      LU('And the saddest.'),
    ],
    [
      {
        domain: 'science',
        skill: 'why owls turn their heads',
        standard: '4-LS1-1',
        kind: 'ask',
        after: 5,
        prompt: [
          N('Before she flew off, the owl turned her whole head to look at you.'),
          N('You can look sideways just by moving your eyes. Why does an owl turn its whole head instead?'),
        ],
        options: [
          {
            label: 'Its eyes can’t move in their sockets.',
            best: true,
            reply: [
              N('Yes. An owl’s eyes are shaped like short tubes, fixed in place. So it turns its head instead.'),
              N('Its neck bends so well that it can turn its head about three-quarters of the way round.'),
              N('Her eyes are huge, too. Big eyes let in lots of light, so owls see well when it’s nearly dark. Animals active at night are called nocturnal.'),
            ],
          },
          {
            label: 'Because it’s showing off.',
            reply: [
              N('It does look like showing off! But an owl has to do it.'),
              N('Its eyes are fixed in place and can’t roll like ours. So it turns its head, nearly three-quarters of the way round.'),
              N('Her eyes are huge, too. Big eyes let in lots of light, so owls see well when it’s nearly dark. Animals active at night are called nocturnal.'),
            ],
          },
          {
            label: 'To hear better.',
            reply: [
              N('Turning helps owls hear too. But the main reason is its eyes: they can’t move in their sockets.'),
              N('So it turns its whole head, about three-quarters of the way round.'),
              N('Her eyes are huge, too. Big eyes let in lots of light, so owls see well when it’s nearly dark. Animals active at night are called nocturnal.'),
            ],
          },
        ],
        parentNote:
          'Learned that owls’ eyes are fixed in their sockets, so owls turn their heads to look around, and that their very large eyes gather lots of light to see at night.',
      },
    ],
  ),
  // ------------------------------------------------ step 3: the nest on the cliff
  scene(
    's17-cliffs',
    [
      N('Next night you follow the way she flew, past the ridge to the high cliffs. The wind smells of salt and cold stone.'),
      N('Halfway up, wedged in a crack, is a ledge. On it is a nest the size of a cartwheel.'),
      NO('I’ve slept up here. Years back. An owl called all night, the same two notes. I thought it was the wind.', 'think'),
      LU('She hunts at the turn of the tide. That’s soon. We could climb up while she’s out.', 'think'),
      LU('Or we could wait for her, and let her see us coming. Owls remember faces.'),
      LU('Either way, slowly. It’s her home, not ours.', 'soft'),
    ],
    [
      {
        domain: 'sel',
        skill: 'being fair to animals: not frightening them',
        standard: 'CASEL: Social awareness',
        kind: 'ask',
        after: 5,
        prompt: [N('Luna says it’s Nightjar’s home. How would you feel if someone climbed into your home while you were out?')],
        options: [
          {
            label: 'Scared or cross, coming back to find a stranger there.',
            best: true,
            reply: [
              N('Most of us would. Animals feel fear too.'),
              N('Letting her see you coming gives her the choice. That’s fairer, even if it’s slower.'),
            ],
          },
          {
            label: 'I wouldn’t mind.',
            reply: [
              N('Maybe you’re very easy-going! But a wild mother on her nest would probably be frightened.'),
              N('Letting her see you coming gives her the choice. That’s fairer.'),
            ],
          },
          {
            label: 'It depends who it was.',
            reply: [
              N('That’s true. A friend is different from a stranger. To Nightjar, you’re still a stranger.'),
              N('Letting her see you coming is how you start to stop being one.'),
            ],
          },
        ],
        parentNote: 'Put themselves in an animal’s place and thought about fair, gentle ways to approach wildlife.',
      },
    ],
    [
      {
        id: 'sneak',
        label: 'Climb while she’s out hunting.',
        set: { 's17-approach': 'sneak' },
        then: [
          N('You climb fast, hand over hand. You are nearly at the ledge when a shadow drops past you, silent, and settles.'),
          N('She is home. She sits on the nest and looks at you, and does not move.'),
          NO('Well. She was always going to be home, wasn’t she.', 'soft'),
        ],
      },
      {
        id: 'wait',
        label: 'Wait for her, where she can see you.',
        set: { 's17-approach': 'wait' },
        then: [
          N('You sit on a rock below the ledge, in plain view. She comes home at the turn of the tide and looks at you a long time.'),
          N('Then she shuffles over, just a little, as if making room.'),
          LU('That’s an invitation. Or a warning. With owls it’s mostly both.', 'think'),
        ],
      },
    ],
  ),
  scene(
    's17-nest',
    [
      N('The nest is woven of heather, sheep’s wool and grey feathers. Under her, packed snug in a ring, are eggs.'),
      N('Five eggs. Four glow faintly, the way the Grove’s eggs do. Every one is whole. Every one is warm.'),
      N('She has turned them so that each one gets its time in the middle.'),
      N('Woven deep into the lining, where they can never be dropped, are two very old eggshells, grey and cracked across.'),
      LU('Hazel told me about a night before my time. Spring, blossom out. Then a cold came down the valley, out of season.', 'soft'),
      LU('Frost on the blossom. Ice in the stream. Two of her chicks died that night. In the morning she was calling and calling.', 'sad'),
      LU('Hazel said she never really stopped. That was twenty-two years ago.'),
      N('Nova goes quiet, counting something on her fingers.'),
      NO('Twenty-two. That number keeps turning up.', 'think'),
      NJ('Hoo-oo.', 'sad'),
      N('She settles lower over the eggs, the way you would pull a blanket up over someone already asleep.'),
    ],
    [
      {
        domain: 'science',
        skill: 'how birds incubate and turn their eggs',
        standard: '1-LS1-2',
        kind: 'notice',
        after: 2,
        lines: [
          LU('Real birds do this. Sitting on eggs to keep them warm is called incubating.'),
          LU('Many birds grow a bare patch of skin on their belly, so their warm skin touches the eggs.'),
          LU('And they turn their eggs often. It helps the chick inside grow properly and stops it sticking to the shell.'),
        ],
        parentNote: 'Learned that birds incubate eggs with their body heat and turn them often to help the chicks grow.',
      },
      {
        domain: 'sel',
        skill: 'understanding grief',
        standard: 'CASEL: Social awareness',
        kind: 'notice',
        after: 6,
        lines: [
          N('Those two old eggs never hatched. The chicks inside died in the cold, and they can’t come back.'),
          N('Nightjar still keeps their shells. That deep sadness after losing someone you love is called grief.'),
          N('Grief can last a long time. It isn’t wrong, and it’s all right to be sad. It shows how much she loved them.'),
        ],
        parentNote: 'Learned the word grief, in plain words about death, and that grief is a sign of love.',
      },
    ],
  ),
  // ------------------------------------------------ step 4: one at a time
  scene(
    's17-return',
    [
      N('She won’t let you take them all at once. You lift two, and she clacks her beak once, like a door shutting.'),
      LU('One at a time, then. Down and back. Let her watch each one go, and see you come back for the next.', 'soft'),
      NO('That’s four climbs. In the dark.', 'shock'),
      LU('That’s four climbs. In the dark.', 'happy'),
      N('Nightjar watches you lift the first egg.'),
      N('Her eyes follow it all the way down, and all the way back up to you.'),
    ],
    [
      {
        domain: 'maths',
        skill: 'multiplication as equal groups',
        standard: '3.OA.A.1',
        kind: 'ask',
        after: 3,
        prompt: [
          N('Nova says four climbs. But each egg needs one trip down and one trip back up.'),
          N('Four eggs. How many trips is that altogether?'),
        ],
        options: [
          {
            label: '8',
            best: true,
            reply: [N('Yes. 4 eggs, 2 trips each: 4 × 2 = 8. Down, up, down, up, down, up, down, up. Nova will be thrilled.')],
          },
          {
            label: '4',
            reply: [
              N('That’s just the trips down. You have to come back up each time too.'),
              N('4 eggs, 2 trips each: 4 × 2 = 8 trips.'),
            ],
          },
          {
            label: '6',
            reply: [
              N('Close! Let’s count in pairs: down-up for each egg. 2, 4, 6, 8.'),
              N('4 eggs, 2 trips each: 4 × 2 = 8 trips.'),
            ],
          },
        ],
        parentNote: 'Solved a trips problem as 4 equal groups of 2 (4 × 2 = 8).',
      },
      {
        domain: 'sel',
        skill: 'building trust slowly',
        standard: 'CASEL: Relationship skills',
        kind: 'notice',
        after: 5,
        lines: [
          LU('This is why we go one at a time. Each trip shows her the egg is safe and you come back.'),
          LU('Trust gets built like that: small promises, kept, again and again.'),
        ],
        parentNote: 'Learned that trust is built through small promises kept over and over.',
      },
    ],
  ),
  scene(
    's17-wild',
    [
      N('Dawn. Four eggs are back in the nursery straw. You climb up one last time for the lantern you left behind.'),
      N('There is still one egg under her. Small, speckled like lichen, and it doesn’t glow. It isn’t the Grove’s.'),
      NO('That’s nobody’s. Wild. Its mother never came back, I’d guess. It happens.', 'think'),
      N('Nightjar looks at the egg, then at you. She does not hide it. She does not move off it, either.'),
      LU('Leave it with her. Let her keep one egg warm, and see it hatch.', 'soft'),
      N('You leave it. On the way down, Luna stops on the path.'),
      LU('Next spring she’ll come back to the nursery. Grief keeps a better calendar than I do. What do we do?', 'think'),
    ],
    [
      {
        domain: 'sel',
        skill: 'thinking about right and wrong when someone is hurting',
        standard: 'CASEL: Responsible decision-making',
        kind: 'ask',
        after: 4,
        prompt: [
          N('Nightjar took eggs that weren’t hers. But she kept every one safe and warm, because she was grieving.'),
          N('Was what she did wrong?'),
        ],
        options: [
          {
            label: 'Yes. They weren’t hers to take.',
            reply: [
              N('That’s a fair answer. Taking what isn’t yours causes worry, even if you mean well.'),
              N('Luna might add: you can say something was wrong and still feel sorry for the one who did it.'),
            ],
          },
          {
            label: 'No. She was sad, and she kept them safe.',
            reply: [
              N('That’s a fair answer. She never harmed a single egg.'),
              N('Nova might add: the nursery still worried all fortnight. Kind reasons don’t stop other people being upset.'),
            ],
          },
          {
            label: 'A bit of both.',
            reply: [
              N('That’s a fair answer. Lots of things are like that: a wrong thing, done for a sad, loving reason.'),
              N('Understanding why helps you choose what to do next.'),
            ],
          },
        ],
        parentNote: 'Think question (no right answer): considered whether an action can be wrong even when the reason is love and grief.',
      },
      {
        domain: 'literacy',
        skill: 'metaphors: saying one thing is another',
        standard: 'L.4.5',
        kind: 'ask',
        after: 6,
        prompt: [N('Luna says grief “keeps a better calendar” than she does. What does she mean?')],
        options: [
          {
            label: 'Sad feelings remember the time of year a sad thing happened, and come back then.',
            best: true,
            reply: [
              N('Yes. Nightjar’s chicks died in a cold spring. So every spring, the sadness comes round again, right on time.'),
              N('Grief can’t really keep a calendar. Talking about a feeling as if it were a person with a diary is a metaphor.'),
            ],
          },
          {
            label: 'Owls can’t read calendars.',
            reply: [
              N('True, and funny! But Luna means something bigger.'),
              N('Grief remembers the time of year a sad thing happened, and comes back then. Saying it “keeps a calendar” is a metaphor.'),
            ],
          },
          {
            label: 'Grief is over quickly.',
            reply: [
              N('It’s nearly the opposite. Grief remembers, sometimes better than we do.'),
              N('Her chicks died in spring, so spring brings the sadness back. That’s why she’ll come back next spring.'),
            ],
          },
        ],
        parentNote: 'Explained the meaning of a metaphor about grief.',
      },
    ],
    [
      {
        id: 'open',
        label: 'Leave the nursery open, with a lantern lit for her.',
        set: { 's17-nursery': 'open' },
        then: [
          NO('A night nurse. With a beak. That’s either brilliant or a disaster.', 'happy'),
          LU('If she wants eggs to sit on, she can sit on ours, where we can see. Hazel would have done that.', 'soft'),
          LU('Then she’d have worried all night. Then she’d have done it again.'),
        ],
      },
      {
        id: 'shut',
        label: 'Move the nursery in by the stove, with a latch.',
        set: { 's17-nursery': 'shut' },
        then: [
          LU('That’s fair. The eggs come first. Feed them before you feed yourself, nearly.', 'think'),
          NO('She won’t take it personally. She’ll just sit on the roof and look at the chimney. Sadly. For ever.', 'sad'),
          LU('Then I’ll leave her a mouse on the step now and then. Grief gets hungry.', 'soft'),
        ],
      },
    ],
  ),
  // ------------------------------------------------ step 5: the hatching
  scene(
    's17-feathers',
    [
      N('Some weeks later there is a feather on your windowsill. Grey, soft as smoke, laid down carefully.'),
      N('Next night, there is another.'),
      LU('She’s calling you. The wild one must be hatching.', 'soft'),
      LU('Go after dark. Take nothing. Just go.'),
      NO('I’m not coming. I’m not stopping.'),
      NO('I’ll be on the cliff path by accident, about nine.'),
    ],
    [
      {
        domain: 'science',
        skill: 'how long a big owl’s egg takes to hatch',
        standard: '3-LS1-1',
        kind: 'notice',
        after: 2,
        lines: [
          LU('A big owl sits on her eggs for about four or five weeks before they hatch.'),
          LU('All that time she keeps them warm and turns them. She hardly leaves the nest at all.'),
        ],
        parentNote: 'Learned that a big owl incubates its eggs for about four or five weeks before they hatch.',
      },
      {
        domain: 'maths',
        skill: 'converting weeks to days',
        standard: '4.MD.A.1',
        kind: 'ask',
        after: 5,
        prompt: [N('Say it takes 4 weeks. A week has 7 days. How many days are there in 4 weeks?')],
        options: [
          {
            label: '28',
            best: true,
            reply: [N('Yes. 4 × 7 = 28. That’s 28 nights of sitting still on a cold cliff. Owls are very patient.')],
          },
          {
            label: '11',
            reply: [
              N('That’s 4 + 7. But we need 4 lots of 7.'),
              N('7, 14, 21, 28. Four weeks is 28 days.'),
            ],
          },
          {
            label: '24',
            reply: [
              N('Close. Let’s count in sevens: 7, 14, 21, 28.'),
              N('Four weeks is 28 days.'),
            ],
          },
        ],
        parentNote: 'Converted 4 weeks into 28 days by counting in sevens.',
      },
    ],
  ),
  scene(
    's17-hatching',
    [
      N('The wind has dropped. The egg under her is rocking. Nightjar shifts off it, just enough, and you both watch.'),
      N('At nine o’clock exactly, Nova comes up the cliff path, out of breath, by accident.'),
      NO('Don’t look at me. I’m not here. I’m not stopping.'),
      N('Nova sits down beside you anyway, and stays till dawn.'),
      N('A crack. A beak like a fingernail. Then a damp grey thing the size of a dumpling, eyes shut tight, very offended.'),
      NJ('Hoo-oo. Hoo-oo.', 'happy'),
      N('The same two notes. They don’t sound the same at all.'),
      N('Later the owlet tumbles across the rock and into your lap. Nightjar watches. She does not call it back.'),
      LU('She’s sharing. Owls don’t share. Look at that.', 'soft'),
      NO('It’s small and cross and fluffy.'),
      LU('Like someone I know.', 'happy'),
      N('Nova does not ask who.'),
    ],
    [
      {
        domain: 'science',
        skill: 'an owl’s life cycle, and how a chick hatches',
        standard: '3-LS1-1',
        kind: 'do',
        after: 4,
        lines: [
          LU('See the tiny hard point on its beak? That’s an egg tooth. Chicks use it to chip their way out. It drops off soon after.'),
          LU('Owlets hatch with their eyes shut and a coat of soft, fluffy feathers called down.'),
          N('Put the owl’s life in order: egg, hatchling, fledgling (learning to fly), adult.'),
        ],
        check: 'edu:order:owl-life-cycle',
        parentNote: 'Learned how a chick hatches using its egg tooth, and put an owl’s life cycle in order.',
      },
      {
        domain: 'literacy',
        skill: 'how a character’s feelings change the meaning',
        standard: 'RL.2.3',
        kind: 'ask',
        after: 6,
        prompt: [N('Nightjar calls the same two notes she always calls. Why don’t they sound the same?')],
        options: [
          {
            label: 'Because now she’s happy, not grieving.',
            best: true,
            reply: [N('Yes. The notes are the same. The feeling behind them has changed, and you can hear it.')],
          },
          {
            label: 'Because she has a cold.',
            reply: [
              N('Ha! No. Look at her mood: happy.'),
              N('Same notes, new feeling. For the first time in twenty-two years, her call isn’t sad.'),
            ],
          },
          {
            label: 'Because it’s a different owl.',
            reply: [
              N('It’s Nightjar, all right. The torn feather’s still there.'),
              N('Same owl, same notes, new feeling. Now she’s happy.'),
            ],
          },
        ],
        parentNote: 'Explained how a character’s change of feeling changes how the same words or sounds come across.',
      },
    ],
  ),
  // ------------------------------------------------ complete
  scene(
    's17-complete',
    [
      N('At the end of autumn Nightjar moults, and the wind brings her old grey feathers down into the Grove.'),
      LU('I’ve sewn them into a cloak. Don’t ask how long it took. I’ll tell you, and then you’ll feel bad.', 'happy'),
      N('It is as light as breath and as warm as a bird.'),
      N('That night, on the cliff top in the cloak, you hear a hush of wings behind you. Two careful feet take hold of your collar.'),
      N('The valley turns under you, silver and black. The Grove comes up to meet you, as gently as an egg set down in straw.'),
      NO('Show-off. I walked for years to see this valley properly, and you did it in a minute.', 'happy'),
      NO('…Take me next time.', 'soft'),
    ],
    [
      {
        domain: 'science',
        skill: 'why birds moult',
        standard: '4-LS1-1',
        kind: 'notice',
        after: 0,
        lines: [
          N('Feathers wear out, like old socks. So birds moult: old feathers drop out, and new ones grow in their place.'),
          N('Most birds don’t lose them all at once. They swap a few at a time, so they can still fly and keep warm.'),
        ],
        parentNote: 'Learned that birds moult, replacing worn feathers a few at a time.',
      },
      {
        domain: 'sel',
        skill: 'asking for what you want',
        standard: 'CASEL: Relationship skills',
        kind: 'notice',
        after: 6,
        lines: [
          N('Nova never asks for things. “Take me next time” was hard for her to say. That’s why it came out so quietly.'),
          N('Asking for what you’d like can feel brave. Good friends are glad you asked.'),
        ],
        parentNote: 'Noticed that asking for what you want can take courage, and that friends welcome it.',
      },
    ],
  ),
];

const S17: EduQuest = {
  id: 'reader:s17',
  of: 's17',
  band: 'reader',
  title: 'Nightjar',
  goals: {
    's17-step1': {
      goal: 'Search the nursery and the fence for clues.',
      hint: 'Look closely at the straw, the nursery roof and the top rail of the fence. Show Luna anything you find.',
    },
    's17-step2': {
      goal: 'Creep through Luna’s garden to the hide by the nursery without being heard.',
      hint: 'Move when the wind rustles the leaves. Keep to moss and thyme, off the gravel, in the shadows of the big flowers.',
    },
    's17-step3': {
      goal: 'Climb slowly to Nightjar’s nest on the cliff.',
      hint: 'Use the cracks with ferns growing in them: those are the solid ones. Keep still whenever she turns her head.',
    },
    's17-step4': {
      goal: 'Carry the Grove’s eggs back to the nursery, one at a time, while Nightjar watches.',
      hint: 'Carry each egg in both hands, and walk, don’t run. If you hurry, she follows you down and you start that egg again.',
    },
    's17-step5': {
      goal: 'Visit Nightjar’s nest on the night the wild egg hatches.',
      hint: 'Take the cliff path after dark. Sit below the ledge and wait. She shuffles aside when she’s ready.',
    },
  },
  scenes: S17_SCENES,
  glossary: [
    gloss('fortnight', 'Two weeks, or fourteen days.', 's17-missing'),
    gloss('trample', 'To tread heavily on something and squash it.', 's17-missing'),
    gloss('nocturnal', 'Awake and active at night, and asleep in the day.', 's17-reveal'),
    gloss('incubate', 'To keep eggs warm so the babies inside can grow.', 's17-nest'),
    gloss('grief', 'The deep sadness you feel when someone you love has died.', 's17-nest'),
    gloss('metaphor', 'Words that describe something as if it were something else, to make you see it in a new way.', 's17-wild'),
    gloss('owlet', 'A baby owl.', 's17-hatching'),
    gloss('moult', 'When a bird’s old feathers drop out and new ones grow in their place.', 's17-complete'),
  ],
  notes:
    'Lessons: owls’ silent flight, fixed eyes and head-turning, big eyes for night vision, dish-shaped faces for hearing ' +
    '(4-LS1-1, 4-LS1-2); eggs need warmth, incubation, turning eggs, the egg tooth, an owl’s life cycle, moulting; ' +
    'choosing centimetres; 4 × 2 trips; 4 weeks = 28 days; clue reading, a metaphor, a changed feeling; grief told ' +
    'plainly (the chicks died and can’t come back); think question on whether a wrong act done from grief is wrong; ' +
    'fairness to wild animals; trust; asking for what you want. The old cold twenty-two years ago is never explained. ' +
    'In s17-hatching the newly hatched owlet has its eyes shut (real owlets hatch with closed eyes). ' +
    'NURSERY PAYOFF (mirrors the S17 notes): s17-complete plays one extra narrator line after index 2 (“It is as light as ' +
    'breath…”). With open: “A lantern burns on the nursery roof every night now. Some nights a grey shape sits beside it, ' +
    'very still.” With shut: “Some nights a grey shape sits on the cottage roof and peers down the chimney. Luna leaves a ' +
    'mouse on the step.” S17 shows no ordinary frost (frost in chapter 7 is the shard’s sign), so s17-missing has dew.',
};

// ================================================================== S18 The Grove Museum
const S18_SCENES: EduScene[] = [
  // ------------------------------------------------ step 1: the barn, and the fossils
  scene(
    's18-barn',
    [
      N('Hazel’s old barn smells of hay, apples and long-ago rain. Swallows’ nests line the rafters like little clay cups.'),
      N('In the middle of the floor stands a mole in a tweed waistcoat, beside a wheelbarrow full of empty glass cases.'),
      DE('Ah. The grandchild. Professor Delve, archivist. I wrote to your grandmother about a museum. She said yes.', 'happy'),
      DE('“In principle,” Hazel said. That means “yes, one day”. That was eleven years ago.'),
      DE('Moles are patient. I have come to collect my “one day”.'),
      DE('Four wings. Three exhibits each. Fossils, night creatures, shore life, the heavens. Twelve. A tidy number.'),
      DE('Every exhibit gets a plaque, and every plaque must be true. Not nearly true. Not true-ish. True.', 'think'),
      N('A small brown moth drifts down from the rafters and lands on the end of his nose.'),
      DE('Oh. Oh dear. Oh, no, not one of—', 'shock'),
      N('Professor Delve faints, quite neatly, into the wheelbarrow.'),
      DE('I’m perfectly all right. I’m simply horizontal.', 'sad'),
      N('Dusty stands in the doorway, muddy, holding a trowel with nothing to dig. Dusty’s Nubbin, Fossil, died two days ago.'),
      DU('I heard “fossils”. From the lane. My hands want something to do. Can they do this?', 'soft'),
    ],
    [
      {
        domain: 'maths',
        skill: 'multiplication as equal groups',
        standard: '3.OA.A.1',
        kind: 'ask',
        after: 5,
        prompt: [DE('Check my sums, please. Four wings, three exhibits in each. How many exhibits altogether?')],
        options: [
          {
            label: '12',
            best: true,
            reply: [DE('Correct. 4 groups of 3: 3, 6, 9, 12. Or 4 × 3 = 12. A tidy number, as I said.', 'happy')],
          },
          {
            label: '7',
            reply: [
              DE('That is 4 + 3. But we have four groups, with three in each.'),
              DE('3, 6, 9, 12. Four lots of three is 12.'),
            ],
          },
          {
            label: '16',
            reply: [
              DE('That would be four in each wing. We have three.'),
              DE('3, 6, 9, 12. Four lots of three is 12.'),
            ],
          },
        ],
        parentNote: 'Worked out 4 groups of 3 as 4 × 3 = 12.',
      },
      {
        domain: 'sel',
        skill: 'how keeping busy can help with grief',
        standard: 'CASEL: Self-management',
        kind: 'notice',
        after: 12,
        lines: [
          N('Losing Fossil is a big loss, and Dusty is still very sad. It’s sad, and it’s all right to be sad.'),
          N('Sometimes, when you’re grieving, it helps to give your hands a job, especially alongside a friend.'),
          N('It doesn’t make the sadness go away. It gives it somewhere to sit for a while.'),
        ],
        parentNote: 'Learned that a gentle, shared task can help someone who is grieving.',
      },
    ],
  ),
  scene(
    's18-fossils',
    [
      N('The cliff is striped like a cake: sand, then red rock, then grey shale, then a dark band just above the beach.'),
      DU('Deeper’s older. Rock goes down in layers, like blankets on a bed. Nobody puts the bottom blanket on last.', 'think'),
      N('A coiled shell near the top. A fern pressed flat in the red rock. And deep in the dark band, a little armoured bug.'),
      DU('Fossil used to sit right there while I dug. Supervising. She was terrible at it. She slept.', 'happy'),
      DU('…It’s quiet without the snoring.', 'soft'),
      N('Back at the barn, Professor Delve reads each plaque aloud before he’ll let it go on the wall.'),
      DE('“Trilobites were sea animals with jointed shells, relatives of insects and crabs. They lived for over 250 million years.”'),
      DE('“Ferns have no flowers and no seeds. They spread by spores, which usually form under their leaves.”'),
      DE('“Ammonites were sea animals related to squid and octopus. They died out about 66 million years ago.”'),
      DE('True, true and true. Wing one. Somebody check my nose for moths.', 'happy'),
    ],
    [
      {
        domain: 'science',
        skill: 'rock layers: deeper layers are older',
        standard: '4-ESS1-1',
        kind: 'do',
        after: 2,
        lines: [
          DU('Put the three finds in order, oldest first. Remember the blankets: the deepest layer went down first.'),
          N('Oldest: the armoured bug from the dark band. Then the fern from the red rock. Youngest: the coiled shell near the top.'),
        ],
        check: 'edu:order:fossils:oldest-first',
        parentNote: 'Put fossils in order of age using the rule that deeper rock layers are older.',
      },
      {
        domain: 'science',
        skill: 'what fossils tell us about the past',
        standard: '3-LS4-1',
        kind: 'ask',
        after: 8,
        prompt: [
          DU('Trilobites and ammonites lived in the sea. But we dug them out of a cliff, on dry land.'),
          DU('What does that tell us?'),
        ],
        options: [
          {
            label: 'Long ago, this land was under the sea.',
            best: true,
            reply: [
              DU('Yes. When they died, mud and sand on the sea floor buried them.'),
              DU('Over millions of years the mud pressed into rock, and the shells turned into fossils. Later the land rose.'),
            ],
          },
          {
            label: 'They crawled up the cliff.',
            reply: [
              DU('Good thought, but they were sea animals. They couldn’t live out of water.'),
              DU('They’re in the cliff because this land was once sea floor. Mud buried them, and over millions of years it became rock.'),
            ],
          },
          {
            label: 'Someone put them there.',
            reply: [
              DU('Nobody could. They’re inside solid rock, deep in the layers.'),
              DU('This land was once sea floor. Mud buried them, and over millions of years it became rock.'),
            ],
          },
        ],
        parentNote: 'Used sea fossils found on land to work out that the area was once under the sea.',
      },
    ],
  ),
  // ------------------------------------------------ step 2: night creatures
  scene(
    's18-night',
    [
      N('Luna hangs a white sheet between two apple trees and sets a lantern under it. The sheet glows like a sail at sea.'),
      LU('A moth trap. Nothing gets hurt. They land on the sheet, we look, we draw, and at dawn they go home.', 'soft'),
      LU('The museum gets the drawings. Living things aren’t exhibits. They’re neighbours.'),
      DE('I shall supervise from a safe distance. Of about a mile.', 'think'),
      N('He sits under a blanket at the far end of the garden, holding a tin of smelling salts like a cup of tea.'),
      LU('Now the hard part. We wait, and we don’t talk.', 'soft'),
      LU('…That was me talking. Starting now.', 'happy'),
    ],
    [
      {
        domain: 'science',
        skill: 'moths and butterflies: how to tell them apart',
        kind: 'notice',
        after: 1,
        lines: [
          LU('Most moths fly at night, and lots of them are drawn to lights. That’s why the lantern works.'),
          LU('To tell a moth from a butterfly, look at the antennae, the feelers on its head.'),
          LU('A butterfly’s end in little knobs. Most moths’ are thin, or feathery like tiny ferns.'),
        ],
        parentNote: 'Learned that most moths fly at night and can be told from butterflies by their antennae.',
      },
      {
        domain: 'literacy',
        skill: 'exaggeration for a joke',
        standard: 'L.4.5',
        kind: 'ask',
        after: 3,
        prompt: [N('Luna’s garden is not a mile long. So why does Professor Delve say “about a mile”?')],
        options: [
          {
            label: 'He’s exaggerating, to show how scared of moths he is.',
            best: true,
            reply: [N('Yes. To exaggerate is to make something sound much bigger than it is. Here it’s a joke, and it tells us how he feels.')],
          },
          {
            label: 'He measured it.',
            reply: [
              N('A mile is a long walk: about 20 minutes. He’d be in the next valley!'),
              N('He’s exaggerating: making it sound bigger than it is, to show how scared he is.'),
            ],
          },
          {
            label: 'He can’t count.',
            reply: [
              N('He counts very well. He’s a professor!'),
              N('He’s exaggerating: making it sound bigger than it is, to show how scared he is.'),
            ],
          },
        ],
        parentNote: 'Recognised exaggeration used for humour and to show a character’s feelings.',
      },
    ],
  ),
  scene(
    's18-night-finds',
    [
      N('Near midnight a moth lands on the sheet, green and black like lichen on old bark. You lose it twice while looking at it.'),
      LU('Merveille du Jour. It means “marvel of the day”, and it flies by night. Somebody had a sense of humour.', 'happy'),
      N('From the far end of the garden comes a soft thump. Professor Delve has fainted from a mile away, just to be safe.'),
      N('By dawn you have a drawing of the moth, a spider’s web lifted whole onto black card, and an owl pellet from under the ash.'),
      DE('“The Merveille du Jour is a moth that flies in autumn. Its green and black wings hide it on lichen-covered bark.”'),
      DE('“Owls swallow small prey whole. The fur and bones they can’t digest are pressed into a pellet and coughed up.”'),
      DE('“Garden spiders spin webs from silk made in their own bodies. They often eat the old web before spinning a new one.”'),
      DE('Recycling. Admirable. Somebody turn the moth drawing to face the wall whenever I walk past.', 'think'),
    ],
    [
      {
        domain: 'science',
        skill: 'camouflage helps animals survive',
        standard: '3-LS4-3',
        kind: 'ask',
        after: 0,
        prompt: [N('You lost the moth twice, and it was right in front of you. Why is it so hard to see on bark?')],
        options: [
          {
            label: 'Its colours match the lichen, so it blends in.',
            best: true,
            reply: [
              N('Yes. That’s called camouflage. Birds hunting by day fly right past it.'),
              N('Moths that blend in best are the ones most likely to survive.'),
            ],
          },
          {
            label: 'It’s invisible.',
            reply: [
              N('It just seems that way! It’s there, but its green and black match the lichen.'),
              N('Blending in like that is called camouflage. It keeps the moth safe from hungry birds.'),
            ],
          },
          {
            label: 'It’s too small to see.',
            reply: [
              N('It’s small, but you could see it easily on the white sheet.'),
              N('On bark, its colours match the lichen. That’s camouflage, and it hides the moth from birds.'),
            ],
          },
        ],
        parentNote: 'Learned that camouflage helps animals hide from predators and survive.',
      },
      {
        domain: 'science',
        skill: 'spiders are not insects',
        standard: '4-LS1-1',
        kind: 'do',
        after: 6,
        lines: [
          N('Count the legs in your drawings. Tap each one. The moth has 6 legs. The spider who made the web has 8.'),
          N('Insects have 6 legs and 3 body parts. Spiders have 8 legs and 2 body parts. So a spider isn’t an insect at all.'),
        ],
        check: 'edu:sort:legs:insect-spider',
        parentNote: 'Counted legs to sort an insect (6) from a spider (8), and learned spiders are not insects.',
      },
    ],
  ),
  // ------------------------------------------------ step 3: shore life
  scene(
    's18-shore',
    [
      N('Low tide past the ridge. Marina’s rock pools are full of sky, and the seaweed smells of salt and pennies.'),
      MA('Rules. Turn a stone, turn it back the same way up. That’s somebody’s roof.', 'think'),
      MA('Living things go back before the tide turns. The museum gets drawings, and whatever they’ve finished with.'),
      MA('And the tide comes back whether you’re ready or not. It’s very rude like that.', 'happy'),
      DE('I have brought a bucket, a net and a deep respect for things with pincers.'),
      N('A small crab sidles past the professor’s boot. He doesn’t faint. He looks extremely pleased about it.'),
      DE('Not a moth. A good day.', 'happy'),
    ],
    [
      {
        domain: 'science',
        skill: 'looking after living things in their habitat',
        standard: 'K-ESS3-3',
        kind: 'do',
        after: 1,
        lines: [
          N('Lift a flat stone gently. Underneath: tiny shrimps, a curled worm, a periwinkle. It’s damp and dark down there.'),
          N('Now turn it back the same way up. The creatures underneath need the shade and wet to stay alive.'),
        ],
        check: 'edu:turn:stone:same-way-up',
        parentNote: 'Turned a rock-pool stone back carefully, learning to protect the creatures that live under it.',
      },
      {
        domain: 'maths',
        skill: 'time intervals: working out when the tide comes in',
        standard: '3.MD.A.1',
        kind: 'ask',
        after: 3,
        prompt: [
          MA('On most coasts the sea comes in and goes out about twice a day.'),
          MA('From low tide to high tide takes about 6 hours. Low tide today is 11 o’clock in the morning. When is high tide?'),
        ],
        options: [
          {
            label: 'About 5 o’clock in the afternoon.',
            best: true,
            reply: [MA('Spot on. 11 o’clock, plus 1 hour is 12, then 5 more hours is 5 o’clock. Plenty of time, if we don’t dawdle.', 'happy')],
          },
          {
            label: 'About 6 o’clock.',
            reply: [
              MA('Count on from 11: 12, 1, 2, 3, 4, 5. That’s 6 hours, and we land on 5 o’clock.'),
            ],
          },
          {
            label: 'About 4 o’clock.',
            reply: [
              MA('Nearly! Count on from 11: 12, 1, 2, 3, 4 is only 5 hours.'),
              MA('One more hour, and we land on 5 o’clock.'),
            ],
          },
        ],
        parentNote: 'Added 6 hours to 11 o’clock to find a later time.',
      },
    ],
  ),
  scene(
    's18-shore-finds',
    [
      N('A sea star the colour of a ripe apricot, one arm short and growing back. A limpet, clamped in its own worn hollow.'),
      N('And a hermit crab halfway between houses, hurrying out of a cramped winkle shell into a roomy whelk.'),
      DE('Drafts for the plaques. “A sea star can regrow an arm it has lost. Many have a simple eye at the tip of each arm.”'),
      DE('“A limpet grazes on the rock when the tide is in. When the tide goes out, it returns to its own spot, its home scar.”'),
      DE('“A hermit crab keeps its soft body inside an empty snail shell. When it outgrows one, it moves to a bigger one.”'),
      MA('Look. It’s left the old shell behind. Perfect, that. Somebody else will want it. A smaller crab.', 'think'),
      DE('Or a museum. A museum would want it very much. I am only saying.', 'think'),
    ],
    [
      {
        domain: 'science',
        skill: 'a sea star is not a fish',
        kind: 'ask',
        after: 0,
        prompt: [MA('Some people call it a starfish. Is a sea star really a fish?')],
        options: [
          {
            label: 'No. It has no backbone, no fins and no gills like a fish.',
            best: true,
            reply: [
              MA('Right. That’s why “sea star” is the better name.'),
              MA('It moves on hundreds of tiny tube feet under its arms. Fish don’t have those.'),
            ],
          },
          {
            label: 'Yes. It lives in the sea.',
            reply: [
              MA('Lots of things live in the sea that aren’t fish: crabs, limpets, seaweed.'),
              MA('A sea star has no backbone and no fins. That’s why “sea star” is the better name.'),
            ],
          },
          {
            label: 'Yes. It’s got “fish” in its name.',
            reply: [
              MA('Names can trick you! A sea star has no backbone and no fins, so it isn’t a fish.'),
              MA('That’s why “sea star” is the better name.'),
            ],
          },
        ],
        parentNote: 'Learned that a sea star is not a fish, because it has no backbone or fins.',
      },
      {
        domain: 'science',
        skill: 'how a limpet survives low tide',
        standard: '4-LS1-1',
        kind: 'notice',
        after: 3,
        lines: [
          MA('Try to lift a limpet once it’s clamped down. You can’t. Don’t try too hard, mind.'),
          MA('Its strong foot grips the rock and holds a little seawater in. That stops it drying out till the tide comes back.'),
        ],
        parentNote: 'Learned how a limpet’s shell and strong foot help it survive when the tide goes out.',
      },
    ],
    [
      {
        id: 'take',
        label: 'Take the empty shell for the museum.',
        set: { 's18-shell': 'taken' },
        then: [
          MA('Fair. There are plenty of shells. There’s only one museum.'),
          DE('It shall have a velvet cushion. A small one. The crab would want it small.', 'happy'),
        ],
      },
      {
        id: 'leave',
        label: 'Leave the shell for the next crab.',
        set: { 's18-shell': 'left' },
        then: [
          MA('Good. That’s how pools work. Somebody’s old house is somebody’s new one.', 'soft'),
          DE('Then we shall have a drawing. Drawings never need a bigger house.', 'happy'),
        ],
      },
    ],
  ),
  // ------------------------------------------------ step 4: the heavens
  scene(
    's18-stars',
    [
      N('Nova is on the western hill at nightfall, flat on her back in the cold grass beside the memorial flowers.'),
      NO('Clear night. No moon till late. Best sky in the valley. I’ve slept under most of them, so I’d know.'),
      NO('I brought you something for the museum. I don’t give people things. It’s a rock. Please don’t say anything nice. I’ll go red.', 'think'),
      N('She drops a stone the size of a walnut into your palm: black, heavy for its size, with a crust like burnt toast.'),
      N('A Nubbin sniffs the rock that looks like burnt toast. It is still not toast.'),
      NO('I watched it come down over the moor, years back. Walked two days to find it. Carried it ever since.'),
      DE('A meteorite! Oh, that is wonderful. And it isn’t a moth. A very good day.', 'happy'),
      NO('Now. Find me north. Then you can have the other two exhibits as well.'),
    ],
    [
      {
        domain: 'literacy',
        skill: 'working out a character’s hidden feelings',
        standard: 'RL.3.3',
        kind: 'ask',
        after: 5,
        prompt: [N('Nova has carried that rock for years. Then she says, “Please don’t say anything nice.” Why?')],
        options: [
          {
            label: 'It matters a lot to her, and she feels shy showing it.',
            best: true,
            reply: [N('Yes. Some people go gruff when they care most. Carrying it for years gives her away.')],
          },
          {
            label: 'She doesn’t care about the rock.',
            reply: [
              N('Nobody carries a rock for years and walks two days for it unless they care.'),
              N('She feels shy about showing how much it matters, so she keeps it short.'),
            ],
          },
          {
            label: 'She’s in a hurry.',
            reply: [
              N('She’s lying in the grass all evening. Not much of a hurry!'),
              N('She cares a lot, and feels shy showing it, so she keeps it short.'),
            ],
          },
        ],
        parentNote: 'Used a character’s actions to understand feelings she doesn’t say out loud.',
      },
      {
        domain: 'science',
        skill: 'what a meteorite is',
        kind: 'notice',
        after: 6,
        lines: [
          DE('A meteorite is a rock from space that falls all the way to the ground.'),
          DE('That black crust formed as its outside melted, rushing down through Earth’s air.'),
          DE('Many meteorites have iron metal inside. That’s why it feels so heavy for its size.'),
        ],
        parentNote: 'Learned what a meteorite is, why it has a burnt crust, and why many feel heavy.',
      },
    ],
  ),
  scene(
    's18-star-finds',
    [
      N('The Pole Star isn’t the brightest. It’s just the one that stays put while the whole sky wheels slowly round it.'),
      NO('That one got me home more times than I’ve told anyone. Which is none.', 'soft'),
      N('Near midnight the Moon comes up over the ridge, low and orange, and turns white as it climbs.'),
      NO('Same face. Always the same face. Hazel looked at that face. So did whoever was here before her.', 'soft'),
      DE('“Polaris, the Pole Star, sits almost directly above Earth’s North Pole, so it hardly moves across the night sky.”'),
      DE('“The Moon always shows Earth the same face. Its pull, together with the Sun’s, raises the tides.”'),
      DE('“A shooting star isn’t a star. It is space rock or dust burning up in Earth’s air. A piece that lands is a meteorite.”', 'happy'),
      N('Whoosh! A shooting star. Professor Delve ducks under his hat.'),
      DE('It isn’t a moth. I just like to be safe.', 'shock'),
      NO('You read plaques to the sky, Professor.', 'happy'),
      DE('The sky has never once corrected me. I find that very restful.', 'soft'),
    ],
    [
      {
        domain: 'science',
        skill: 'finding the Pole Star from the Plough',
        standard: '1-ESS1-1',
        kind: 'do',
        after: 0,
        lines: [
          NO('Find the Plough first: seven bright stars in the shape of a saucepan with a bent handle.'),
          NO('Tap the two stars at the end of the pan. Draw a line through them, about five times the gap between them.'),
          NO('That’s the Pole Star. Face it, and you’re facing north. Turn round, and that’s south.'),
        ],
        check: 'edu:draw:pointer-line:pole-star',
        parentNote: 'Used the two pointer stars of the Plough to find the Pole Star and north.',
      },
    ],
  ),
  // ------------------------------------------------ step 5: the centre case
  scene(
    's18-heart',
    [
      N('Twelve cases full, and one more. The big one in the middle of the barn, under the empty swallows’ nests, is bare.'),
      DE('The centre case. Every museum has one. It holds the thing the rest of the museum is for.', 'think'),
      N('Dusty comes in out of the cold, turning something over in their hands: a card, bent at one corner.'),
      DU('Fossil’s card. From the hill. The rain got at it, so I made a new one for the flower and kept this.', 'soft'),
      DU('I don’t want it in a drawer. I don’t want it rained on. I want it somewhere people come.', 'sad'),
      DE('That is exactly what a museum is for. A museum is a place where a valley remembers.', 'soft'),
      DE('Though I wonder. Your grandmother kept a hatch register: a book of every egg she hatched in forty years, and its first sound.'),
      DE('That is not one Nubbin remembered. That is all of them. It could go in the middle. On loan, naturally.', 'think'),
      DU('…That’s fair. That’s a good thing. It just isn’t Fossil.', 'sad'),
    ],
    [
      {
        domain: 'social-studies',
        skill: 'what museums are for',
        standard: 'D2.His.2.K-2',
        kind: 'ask',
        after: 5,
        prompt: [N('Professor Delve says a museum is where a valley remembers. What do you think a museum is for?')],
        options: [
          {
            label: 'Remembering people and the past.',
            reply: [
              N('That’s a fair answer, and it’s the professor’s too.'),
              N('Things in a museum help us picture lives long ago, and people we’ve lost.'),
            ],
          },
          {
            label: 'Learning true things.',
            reply: [
              N('That’s a fair answer. Every plaque here has to be true. People come to find out about the world.'),
              N('Dusty might add: you can learn about a person, too, not just about rocks.'),
            ],
          },
          {
            label: 'Keeping precious things safe.',
            reply: [
              N('That’s a fair answer. Glass cases keep things safe from rain, dust and drawers.'),
              N('And safe means they’ll still be there for people a hundred years from now.'),
            ],
          },
          {
            label: 'Sharing special things with everyone.',
            reply: [
              N('That’s a fair answer. A thing in a drawer belongs to one person. A thing in a museum belongs to everyone who visits.'),
              N('That’s what Dusty wants: somewhere people come.'),
            ],
          },
        ],
        parentNote: 'Think question (no right answer): considered what museums are for, from remembering the past to sharing knowledge.',
      },
      {
        domain: 'sel',
        skill: 'remembering helps with grief',
        standard: 'CASEL: Social awareness',
        kind: 'notice',
        after: 8,
        lines: [
          N('Dusty agrees the register is a good idea. But a good idea can still feel wrong when you miss someone.'),
          N('Moss says we are made of being remembered. Dusty wants people to remember Fossil, and that’s a kind of love.'),
        ],
        parentNote: 'Talked about how remembering someone who has died is part of grieving, and a kind of love.',
      },
    ],
    [
      {
        id: 'card',
        label: 'Put Fossil’s card in the centre case.',
        set: { 's18-centre': 'card' },
        then: [
          DU('Thank you. She’d hate the glass. She’d sit on top of it.', 'happy'),
          DE('And the register stays in the cottage, where it is still being written. Quite right. It isn’t finished.', 'soft'),
        ],
      },
      {
        id: 'register',
        label: 'Put Hazel’s hatch register in the centre case.',
        set: { 's18-centre': 'register' },
        then: [
          DU('Can her card go in it? Tucked in the front. Like a bookmark.', 'soft'),
          DE('A bookmark is permitted. A bookmark is, in fact, encouraged.', 'happy'),
          DE('It is only on loan, mind. The moment the family wants it back, I shall carry it home myself.', 'soft'),
        ],
      },
      {
        id: 'empty',
        label: 'Leave the case empty, for whoever comes next.',
        set: { 's18-centre': 'empty' },
        then: [
          N('You prop a card in the empty case: “For whoever this valley remembers next.”'),
          DE('An empty case. Most unusual. People will stand in front of it for a very long time.', 'think'),
          DU('Good. Let them. Fossil’s card can go on the ledge beside it, where people put their hands.', 'soft'),
        ],
      },
    ],
  ),
  scene(
    's18-door',
    [
      N('The barn is swept. Twelve plaques shine.'),
      N('The swallows are long gone south, and have left their little clay cups behind.'),
      DE('They have left their cups unwashed. Very untidy. They will be back for them in spring.'),
      DE('One last matter. The door. Glass needs polishing. Plaques come loose. Archivists need… worms.', 'think'),
      DE('Two Shells a visit would pay for the upkeep and keep the place standing.'),
      DE('Or it could be free, and we would manage. Somehow. Probably.'),
      N('Dusty raises an eyebrow at the word “worms”. The professor pretends not to see.'),
    ],
    [
      {
        domain: 'science',
        skill: 'birds that migrate',
        kind: 'notice',
        after: 1,
        lines: [
          N('Swallows migrate. In autumn they fly south, thousands of kilometres, to Africa, where it’s warm and there are insects to eat.'),
          N('In spring they fly all the way back. Many return to the very same barn, and even the same nest.'),
        ],
        parentNote: 'Learned that swallows migrate south in autumn and return in spring, often to the same nest.',
      },
      {
        domain: 'maths',
        skill: 'multiplying to find a total cost',
        standard: '3.OA.A.3',
        kind: 'ask',
        after: 5,
        prompt: [DE('Suppose 9 visitors come on a Saturday, and each pays 2 Shells. How many Shells is that?')],
        options: [
          {
            label: '18',
            best: true,
            reply: [DE('Correct. 9 × 2 = 18. Enough for polish, glue, and a modest quantity of worms.', 'happy')],
          },
          {
            label: '11',
            reply: [
              DE('That is 9 + 2. But each of the nine pays two.'),
              DE('9 lots of 2: 2, 4, 6, 8, 10, 12, 14, 16, 18. 18 Shells.'),
            ],
          },
          {
            label: '16',
            reply: [
              DE('Close. That would be 8 visitors. Let us count all nine in twos.'),
              DE('2, 4, 6, 8, 10, 12, 14, 16, 18. 18 Shells.'),
            ],
          },
        ],
        parentNote: 'Worked out 9 visitors × 2 Shells = 18 Shells.',
      },
    ],
    [
      {
        id: 'shells',
        label: 'Charge two Shells, for upkeep.',
        set: { 's18-entry': 'shells' },
        then: [
          DE('Sensible. A place that costs nothing is a place nobody remembers to mend.', 'think'),
          DE('Anyone shorter than the door handle goes free. I insist. I have measured.', 'happy'),
        ],
      },
      {
        id: 'free',
        label: 'Keep it free.',
        set: { 's18-entry': 'free' },
        then: [
          DE('Free. Hm. A place where a valley remembers ought to belong to the valley. I agree.', 'think'),
          DE('I shall put out a jar. Nobody need put anything in it. The jar is merely hopeful.', 'happy'),
        ],
      },
    ],
  ),
  // ------------------------------------------------ complete
  scene(
    's18-complete',
    [
      N('On opening day half the valley comes. Most of them stand at the centre case longer than they meant to.'),
      N('Children press their noses to the trilobite. Sparks reads every plaque aloud, loudly, to people already reading them.'),
      DE('You did this, Curator. I only had the “one day”.', 'happy'),
      N('He gives you a brass magnifying glass on a ribbon, worn smooth where a great many thumbs have held it.'),
      DE('It was mine. I can’t see much through it any more. I’d like it to keep looking at things.', 'soft'),
      N('Then a moth comes in through the open door, and the Curator’s first official act is to catch the professor.'),
    ],
    [
      {
        domain: 'literacy',
        skill: 'working out a new word from context',
        standard: 'L.2.4',
        kind: 'ask',
        after: 2,
        prompt: [N('The professor calls you “Curator”. You found the exhibits, checked the plaques and filled the cases. So what is a curator?')],
        options: [
          {
            label: 'Someone who looks after a museum’s collection.',
            best: true,
            reply: [N('Yes. A curator chooses, cares for and explains the things in a museum. That’s been you, all along.')],
          },
          {
            label: 'A kind of doctor.',
            reply: [
              N('It does sound a bit like “cure”! But a curator looks after a museum’s collection.'),
              N('They choose things, care for them and explain them. Just what you did.'),
            ],
          },
          {
            label: 'Someone who faints at moths.',
            reply: [
              N('That’s just the professor! A curator looks after a museum’s collection.'),
              N('They choose things, care for them and explain them. Just what you did.'),
            ],
          },
        ],
        parentNote: 'Worked out the meaning of “curator” from clues in the story.',
      },
      {
        domain: 'science',
        skill: 'how a magnifying glass works',
        kind: 'notice',
        after: 4,
        lines: [
          N('A magnifying glass has a lens: glass that bulges out in the middle.'),
          N('The curved glass bends the light coming through it, so things look bigger than they really are.'),
        ],
        parentNote: 'Learned that a magnifying lens bends light to make things look bigger.',
      },
    ],
  ),
];

const S18: EduQuest = {
  id: 'reader:s18',
  of: 's18',
  band: 'reader',
  title: 'The Grove Museum',
  goals: {
    's18-step1': {
      goal: 'Dig three fossils from the cliff layers with Dusty, and sort them from oldest to youngest.',
      hint: 'Lower layers were laid down first, so they are older. Note how deep each find was, then sort them.',
    },
    's18-step2': {
      goal: 'Run the moth trap in Luna’s garden and wait quietly for three night finds.',
      hint: 'Sit still near the sheet: every time you move, the finds come more slowly. At dawn, look under the ash tree.',
    },
    's18-step3': {
      goal: 'Find three shore creatures in Marina’s rock pools before the tide turns.',
      hint: 'Look under the weed and the flat stones, and put each stone back the way you found it. When the water reaches the barnacles, the tide is turning.',
    },
    's18-step4': {
      goal: 'On a clear night on the hill, find the Pole Star with Nova, then wait up for the Moon.',
      hint: 'Find the seven stars of the Plough. The two at the end of the pan point to the Pole Star. The Moon rises late, in the east.',
    },
    's18-step5': {
      goal: 'Fill the centre case, then talk to Professor Delve at the barn door.',
      hint: 'Place the centre-case exhibit in the middle of the barn, then speak to the professor by the door.',
    },
  },
  scenes: S18_SCENES,
  glossary: [
    gloss('archivist', 'Someone whose job is to look after old records and important things from the past.', 's18-barn'),
    gloss('horizontal', 'Lying flat, side to side, like the horizon.', 's18-barn'),
    gloss('shale', 'A soft grey rock made from mud pressed hard over a very long time. It splits into thin layers.', 's18-fossils'),
    gloss('antennae', 'The two long feelers on an insect’s head, used to touch and smell.', 's18-night'),
    gloss('exaggerate', 'To make something sound bigger or more than it really is.', 's18-night'),
    gloss('camouflage', 'Colours or patterns that help an animal blend in with what is around it.', 's18-night-finds'),
    gloss('sidles', 'Moves sideways, slowly or shyly.', 's18-shore'),
    gloss('tide', 'The rise and fall of the sea, which happens about twice a day.', 's18-shore'),
    gloss('backbone', 'The row of bones down the middle of the back of animals such as fish, birds and people.', 's18-shore-finds'),
    gloss('meteorite', 'A rock from space that has fallen all the way to the ground.', 's18-stars'),
    gloss('on loan', 'Lent for a while, and given back later.', 's18-heart'),
    gloss('migrate', 'To travel a long way to a different place at a certain time of year, and back again.', 's18-door'),
    gloss('upkeep', 'The work and money needed to keep something in good condition.', 's18-door'),
    gloss('curator', 'A person who looks after the things in a museum and explains them to visitors.', 's18-complete'),
  ],
  notes:
    'Lessons: rock layers, oldest at the bottom (4-ESS1-1) and sea fossils on land (3-LS4-1); moths vs butterflies; ' +
    'camouflage; spiders vs insects; turning stones back; tide timing (11 o’clock + 6 hours); sea stars are not fish; ' +
    'limpets at low tide; meteorites; the Plough’s pointers to the Pole Star (1-ESS1-1); ' +
    'swallows migrating; 4 × 3, 9 × 2; exaggeration, hidden feelings, “curator” from context; grief and remembering; ' +
    'think question on what a museum is for. The twelve plaque texts are kept word for word from the main script.',
};

// ================================================================== exports
export const EDU_SIDE_NEW_2_READER: EduQuest[] = [S12, S17, S18];

/** Every `edu:` check used by a `do` lesson in this file. */
export const CHECKS: string[] = [
  // S12
  'edu:listen:old-wall:ear-to-stone',
  'edu:turn:tuning-fork:loudest',
  'edu:tap:shape:hexagon',
  // S17
  'edu:sort:ground:quiet-noisy',
  'edu:order:owl-life-cycle',
  // S18
  'edu:order:fossils:oldest-first',
  'edu:sort:legs:insect-spider',
  'edu:turn:stone:same-way-up',
  'edu:draw:pointer-line:pole-star',
];
