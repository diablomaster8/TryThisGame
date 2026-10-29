/**
 * The Learning Grove, sprout band (ages 3–6, read aloud): Book Two, chapters 5–8.
 * Educational versions of every scene in BOOK2_SCENES (campaign-book2.ts), matched by id
 * (`sprout:c5-open` replaces `c5-open`). See EDU-STYLE.md.
 *
 * Band notes
 * - Corvin is a lonely, grumpy man with cold hands. The Stillness is "a cold, sad stone that
 *   makes Nubbins too still": mysterious, never frightening.
 * - Fossil’s farewell (c6-open, c6-open-walked) uses clear words: "Fossil faded. That means she
 *   died." Never "sleep" or "going away". Then the comfort: the flower, remembering, Dusty’s
 *   friends staying close.
 * - Hazel is "very poorly"; no illness is named.
 * - Every choice in Book Two is kind and safe, so every choice id is kept.
 */
import type { EduCampaign, EduScene, Lesson } from './types';
import type { Line, Choice } from '../config/story';

type Mood = NonNullable<Line['mood']>;

const say =
  (who: string) =>
  (text: string, mood?: Mood): Line =>
    mood ? { who, text, mood } : { who, text };

const N = say('narrator');
const YOU = say('you');
const MOSS = say('moss');
const HAZEL = say('hazel');
const MARINA = say('marina');
const SPARKS = say('sparks');
const CLOVER = say('clover');
const PIXEL = say('pixel');
const FERN = say('fern');
const LUNA = say('luna');
const EMBER = say('ember');
const BYTE = say('byte');
const DUSTY = say('dusty');
const NOVA = say('nova');
const CORVIN = say('corvin');

const scene = (of: string, lines: Line[], lessons: Lesson[], choices?: Choice[]): EduScene =>
  choices
    ? { id: `sprout:${of}`, of, band: 'sprout', lines, choices, lessons }
    : { id: `sprout:${of}`, of, band: 'sprout', lines, lessons };

const lid = (of: string, n: number): string => `sprout:${of}-l${n}`;

// ---------------------------------------------------------------- chapter 5: The Circuit

const CH5: EduScene[] = [
  scene(
    'c5-open',
    [
      N('Summer! The sun is hot. Bzzz go the wasps.'),
      N('Your Nubbin jumps into the pond. Splash!'),
      N('Someone is at the gate. Lift and push!'),
      EMBER('I’m Ember. I don’t like chatting.', 'angry'),
      EMBER('I had a Nubbin once. Her name was Ash.', 'soft'),
      EMBER('Ash was fast and brave. She bounced off the gate!'),
      EMBER('A man called Corvin took her away to train.', 'sad'),
      EMBER('She came back grey. He kept her. She won’t look at me.', 'sad'),
      N('Ember’s hands are in her pockets. They are tight fists.'),
      EMBER('Corvin wants you to race. Go. But watch him.', 'angry'),
    ],
    [
      {
        id: lid('c5-open', 1),
        domain: 'science',
        skill: 'sunlight warms things',
        standard: 'K-PS3-1',
        kind: 'ask',
        after: 1,
        prompt: [N('The pond is warm today. What made it warm?')],
        options: [
          {
            label: 'The sun',
            best: true,
            reply: [N('Yes! The sun shines on it all day.'), N('Sunshine makes things warm.')],
          },
          {
            label: 'A fish',
            reply: [N('Ha! A fish can’t warm a pond.'), N('The sun did. Sunshine makes things warm.')],
          },
          {
            label: 'The moon',
            reply: [N('The moon is pretty, but it doesn’t warm things.'), N('The sun warmed the pond.')],
          },
        ],
        parentNote: 'Learned that sunshine warms things up, like the water in a pond.',
      },
      {
        id: lid('c5-open', 2),
        domain: 'sel',
        skill: 'name feelings from faces and hands',
        standard: 'CASEL: Social awareness',
        kind: 'ask',
        after: 8,
        prompt: [N('(Point to Ember’s hands.)'), N('How does Ember feel?')],
        options: [
          {
            label: 'Sad and cross',
            best: true,
            reply: [
              N('Yes. Tight fists can mean cross.'),
              N('A quiet voice can mean sad.'),
              N('Two feelings at once is allowed.'),
            ],
          },
          {
            label: 'Happy',
            reply: [N('Look again. Her hands are tight fists.'), N('Her voice is quiet. Ember is sad and cross.')],
          },
          {
            label: 'Sleepy',
            reply: [N('Her eyes are wide open. Her hands are fists.'), N('Ember feels sad and cross.')],
          },
        ],
        parentNote: 'Read a character’s feelings from her hands and voice, and heard that two feelings can come at once.',
      },
    ],
    [
      {
        id: 'sorry',
        label: 'I’m sorry about Ash.',
        friendship: { ember: 1 },
        then: [EMBER('Sorry doesn’t fix it.'), EMBER('…But thank you. I’ll come with you.', 'soft')],
      },
      {
        id: 'come',
        label: 'Come with me.',
        friendship: { ember: 3 },
        then: [EMBER('I wasn’t going to.', 'think'), EMBER('…Fine. I’ll walk. But no talking.')],
      },
      {
        id: 'sit',
        label: 'Sit down on the step with Ember.',
        friendship: { ember: 2 },
        then: [
          N('You sit on the step. Slowly, Ember sits too.'),
          EMBER('Gran Hazel used to do that. Come on, then.', 'soft'),
        ],
      },
    ],
  ),
  scene(
    'c5-circuit',
    [
      N('The Circuit is a racetrack, up the valley.'),
      N('It’s clean and quiet. White lines. White rails.'),
      N('It’s hot. But the rails are cold and frosty!'),
      SPARKS('Brrr! Frost, in summer! That’s very strange.', 'shock'),
      N('Corvin’s Nubbins wait in a row. Grey, and very still.'),
      SPARKS('Byte has three stopwatches now!'),
      BYTE('Four! One is for timing the others.', 'happy'),
      N('Corvin comes over. His hands are cold and blue.'),
      EMBER('Where is Ash?', 'angry'),
      CORVIN('She’s safe. Now: what matters most in a race?', 'think'),
    ],
    [
      {
        id: lid('c5-circuit', 1),
        domain: 'maths',
        skill: 'count to 4; three and one more makes four',
        standard: 'K.OA.A.1',
        kind: 'do',
        after: 6,
        check: 'edu:count:stopwatches:4',
        lines: [
          BYTE('Tap my stopwatches and count them with me!', 'happy'),
          N('(Count together as your child taps: one, two, three, four.)'),
          BYTE('Four! Three, and one more, makes four. Click!'),
        ],
        parentNote: 'Counted four objects and saw that three and one more makes four.',
      },
      {
        id: lid('c5-circuit', 2),
        domain: 'literacy',
        skill: 'hear the same first sound (b in Byte and buttons)',
        standard: 'RF.K.2',
        kind: 'do',
        after: 7,
        check: 'edu:say:sound:b',
        lines: [
          SPARKS('B-b-Byte! B-b-buttons! Byte, stop counting my buttons.', 'angry'),
          BYTE('Seven. You’ve lost one.', 'think'),
          SPARKS('Byte and buttons start the same. Say it with me: b-b-b!', 'happy'),
        ],
        parentNote:
          'Said the first sound of Byte and buttons, and heard that they start the same way.',
      },
    ],
    [
      {
        id: 'race-want',
        label: 'That they want to run.',
        friendship: { sparks: 2 },
        then: [
          CORVIN('Gran Hazel’s answer. It loses, mostly.'),
          SPARKS('It does NOT! Only sometimes!', 'angry'),
        ],
      },
      {
        id: 'race-win',
        label: 'That they win. It’s a race.',
        then: [CORVIN('Good. You’ll do well here.'), EMBER('I said that too, when I was young.', 'soft')],
      },
      {
        id: 'race-home',
        label: 'That they come home after.',
        friendship: { ember: 2 },
        then: [CORVIN('…That isn’t an answer.', 'think'), EMBER('It’s the best answer.', 'soft')],
      },
    ],
  ),
  scene(
    'c5-considered',
    [
      N('At the start line, Corvin comes over again.'),
      CORVIN('Still thinking about it? My offer is still there.'),
      N('His hand is on the rail. A little frost grows. Brrr!'),
      N('Your Nubbin looks at Corvin. Then at you.'),
      N('Then it looks at its toes, very carefully.'),
      N('Ready, steady… time to race!'),
    ],
    [
      {
        id: lid('c5-considered', 1),
        domain: 'sel',
        skill: 'noticing a worried friend, and what helps',
        standard: 'CASEL: Social awareness',
        kind: 'ask',
        after: 4,
        prompt: [N('(Point to your Nubbin.)'), N('It is looking at its toes. How does it feel?')],
        options: [
          {
            label: 'Worried',
            best: true,
            reply: [N('Yes. It heard Corvin. It feels worried.'), N('Staying close and a gentle pat can help.', 'soft')],
          },
          {
            label: 'Happy',
            reply: [N('Happy Nubbins bounce about.'), N('This one is very still. It feels worried.')],
          },
          {
            label: 'Sleepy',
            reply: [N('Its eyes are wide open.'), N('It feels worried. Staying close can help.', 'soft')],
          },
        ],
        parentNote: 'Read a pet’s quiet, careful look as worry, and talked about what helps a worried friend.',
      },
    ],
  ),
  scene(
    'c5-close',
    [
      N('Ready, steady, go! Run, run, run!'),
      N('Your Nubbin wins! It keeps running, just for fun.'),
      SPARKS('YOU WON! I’m just very loud about it!', 'happy'),
      BYTE('Yours started late. It was looking at a butterfly.', 'happy'),
      CORVIN('Mine never look at butterflies. They just run.'),
      EMBER('Ash? Ash, it’s me.', 'sad'),
      N('One grey Nubbin turns her head. Just a little.'),
      EMBER('She turned her head. She did.', 'soft'),
      N('At home, there is white frost on your sleeve.'),
      N('By bedtime, it has melted away.'),
    ],
    [
      {
        id: lid('c5-close', 1),
        domain: 'science',
        skill: 'ice melts into water when it warms up',
        standard: '2-ESS2-3',
        kind: 'ask',
        after: 8,
        prompt: [N('Frost is tiny bits of ice.'), N('What happens when ice gets warm?')],
        options: [
          {
            label: 'It melts into water',
            best: true,
            reply: [N('Yes! Warm ice melts. Drip, drip.'), N('Your sleeve will just be a bit wet.')],
          },
          {
            label: 'It grows bigger',
            reply: [N('Ice grows in the cold.'), N('In the warm, it melts into water. Drip, drip.')],
          },
          {
            label: 'It turns into sand',
            reply: [N('Hm, no sand. Warm ice melts into water. Drip, drip.')],
          },
        ],
        parentNote: 'Learned that frost is ice, and ice melts into water when it gets warm.',
      },
    ],
  ),
];

// ---------------------------------------------------------------- chapter 6: Rain on the Hill
// Fossil’s farewell: clear words (faded = died; her body stopped working and won’t start again),
// never "sleep" or "going away", then the comfort: the flower, remembering, friends who stay.

const C6_FAREWELL: Line[] = [
  N('A soft bubble of light grows round Fossil. It fades.'),
  N('Fossil faded. That means she died.'),
  N('Her body stopped working, and it won’t start again.'),
  N('Where she was, a little flower grows.'),
];

const CH6: EduScene[] = [
  scene(
    'c6-open',
    [
      N('It rains for three days. Drip, drop, drip.'),
      N('Dusty sits on the hill. Fossil is in their lap.'),
      DUSTY('This is Fossil. She’s very, very old. Twenty years!', 'soft'),
      N('Fossil taps Dusty’s wrist. Tap, tap. That means: you’re all right.'),
      ...C6_FAREWELL,
      DUSTY('I’m very sad. I will always remember her.', 'sad'),
      DUSTY('Will you sit with me a bit?', 'soft'),
    ],
    [
      {
        id: lid('c6-open', 1),
        domain: 'science',
        skill: 'plants need water to grow',
        standard: 'K-LS1-1',
        kind: 'ask',
        after: 1,
        prompt: [
          DUSTY('Gran Hazel never brought an umbrella.'), DUSTY('She said the hill needs the rain.'),
          DUSTY('Why does the hill need rain?', 'think'),
        ],
        options: [
          {
            label: 'Plants need water to grow',
            best: true,
            reply: [DUSTY('Yes! Plants need water.', 'happy'), DUSTY('The grass drinks the rain up through its roots.')],
          },
          {
            label: 'So the hill can have a bath',
            reply: [DUSTY('Ha! Nearly. The rain gives the plants a drink.'), DUSTY('Plants need water to grow.')],
          },
          {
            label: 'To make the sky dark',
            reply: [DUSTY('Rain clouds are dark, it’s true.'), DUSTY('But plants need the rain to grow.')],
          },
        ],
        parentNote: 'Learned that plants need water to grow, and drink it up through their roots.',
      },
      {
        id: lid('c6-open', 2),
        domain: 'sel',
        skill: 'comforting a friend who is sad',
        standard: 'CASEL: Social awareness',
        kind: 'ask',
        after: 8,
        prompt: [N('Dusty is very sad. What can we do to help?')],
        options: [
          {
            label: 'Sit with Dusty',
            best: true,
            reply: [
              DUSTY('Yes. Just sit. You needn’t say anything.', 'soft'),
              N('Friends stay close.'),
            ],
          },
          {
            label: 'Run off and play',
            reply: [N('Playing can come later.'), N('Right now Dusty needs a friend. Let’s sit with them.')],
          },
          {
            label: 'Tell Dusty to stop being sad',
            reply: [N('Sad feelings don’t stop when we say so.'), N('Sitting close helps. Let’s sit with Dusty.')],
          },
        ],
        parentNote: 'Talked about what helps a sad friend: staying close and just being there.',
      },
    ],
  ),
  scene(
    'c6-open-walked',
    [
      N('It rains for three days. Drip, drop, drip.'),
      N('Dusty sits on the hill. Fossil is in their lap.'),
      DUSTY('You came! Thank you for Fossil’s walk.', 'soft'),
      DUSTY('The cliff, the tree, the water. She loved it all.', 'happy'),
      N('Your littlest Nubbin runs up. It sits close to Fossil.'),
      ...C6_FAREWELL,
      DUSTY('I’m very sad. Will you sit with me a bit?', 'sad'),
    ],
    [
      {
        id: lid('c6-open-walked', 1),
        domain: 'maths',
        skill: 'count to 3 on fingers',
        standard: 'K.CC.B.4',
        kind: 'do',
        after: 3,
        check: 'edu:count:wishes:3',
        lines: [
          DUSTY('Fossil had three wishes.'), DUSTY('Count them with me, on your fingers.'),
          N('(Hold up a finger for each: cliff, one. Tree, two. Water, three.)'),
          DUSTY('Three wishes. She did every single one.', 'happy'),
        ],
        parentNote: 'Counted three things on fingers, one finger for each.',
      },
      {
        id: lid('c6-open-walked', 2),
        domain: 'sel',
        skill: 'remembering someone who has died',
        standard: 'CASEL: Relationship skills',
        kind: 'ask',
        after: 9,
        prompt: [N('What could help Dusty feel a little better?')],
        options: [
          {
            label: 'Sit together and remember Fossil',
            best: true,
            reply: [
              DUSTY('Yes. Remember her face in the water? I do.', 'soft'),
              N('Remembering keeps Fossil close in our hearts.'),
            ],
          },
          {
            label: 'Forget all about her',
            reply: [N('We don’t need to forget.'), N('Remembering Fossil keeps her close. Let’s remember together.')],
          },
          {
            label: 'Leave Dusty on their own',
            reply: [N('Being alone can feel lonely.'), N('Let’s stay and remember Fossil with Dusty.')],
          },
        ],
        parentNote: 'Talked about how remembering someone together can help when we are sad.',
      },
    ],
  ),
  scene(
    'c6-close',
    [
      N('You sit with Dusty by the flower. Nobody talks.'),
      N('The rain stops. Drip… drip… drop.'),
      DUSTY('Thank you. I’m off to dig. Digging helps me.', 'soft'),
      DUSTY('Nubbins fade when they are very old. Love them anyway.'),
      DUSTY('Love them even more because of it.', 'soft'),
      N('Now Moss sits by the flower. When did he come?'),
      MOSS('Briar’s was the first flower here. Now there is Fossil’s.', 'soft'),
      MOSS('That is fading done right. Fossil was loved, and let go.'),
      MOSS('We remember her. That is how we keep her.', 'soft'),
      N('Down the hill, Dusty is nearly at the gate.'),
    ],
    [
      {
        id: lid('c6-close', 1),
        domain: 'literacy',
        skill: 'hear the first sound f (Fossil, flower)',
        standard: 'RF.K.2',
        kind: 'ask',
        after: 6,
        prompt: [
          MOSS('Fossil. Flower. Listen. They both start with fff.', 'soft'),
          MOSS('Which word starts with fff too?'),
        ],
        options: [
          { label: 'Fish', best: true, reply: [MOSS('Yes. Fff-fish. Fff-Fossil. Fff-flower.', 'happy')] },
          { label: 'Moon', reply: [MOSS('Moon starts with mmm, like Moss. Fish starts with fff.')] },
          { label: 'Dog', reply: [MOSS('Dog starts with d-d-d. Fish starts with fff, like Fossil.')] },
        ],
        parentNote: 'Listened for the first sound f in Fossil and flower and found another f word.',
      },
    ],
    [
      {
        id: 'tell',
        label: 'Call after Dusty. Tell them what Moss said.',
        friendship: { dusty: 2 },
        then: [
          N('Dusty stops at the gate and listens.'),
          DUSTY('Tell him thank you.', 'soft'), DUSTY('And he’s got grass on his head.'),
          MOSS('I know about the grass.'),
          N('Moss sits by the flower until dark.'),
        ],
      },
      {
        id: 'keep',
        label: 'Keep it quiet. Some things belong to the hill.',
        then: [
          N('Dusty lifts and pushes the gate, and walks home.'),
          N('You and Moss sit by the flower until dark.'),
        ],
      },
    ],
  ),
];

// ---------------------------------------------------------------- chapter 7: What Fear Teaches
// The Stillness, sprout version: a cold, sad stone that makes Nubbins too still.
// Mysterious and a little strange, never frightening.

const CH7: EduScene[] = [
  scene(
    'c7-open',
    [
      N('Sable sleeps near you now. Not next to you. Near.'),
      N('You wake up early. Brrr! It’s cold!'),
      N('Outside, there is white frost. But only in one place.'),
      N('It runs from the long grass to the fourth post.'),
      N('Sable stares at the post. She is very, very still.'),
      LUNA('Morning! Well, it’s my bedtime. I work at night.', 'happy'),
      LUNA('I found out where Sable lived before. In Corvin’s garden.', 'think'),
      LUNA('It’s cold there. Sable was hungry and scared. She ran away.', 'sad'),
      LUNA('She chose you. She liked your slow hands.', 'soft'),
      LUNA('Moss is coming. Listen to him properly.'),
    ],
    [
      {
        id: lid('c7-open', 1),
        domain: 'maths',
        skill: 'count to 4 and spot the odd one out',
        standard: 'K.CC.B.5',
        kind: 'do',
        after: 3,
        check: 'edu:count:lantern-posts:4',
        lines: [
          N('(Count the lantern posts together. Tap each one.)'),
          N('One, two, three, four. Four posts!'), N('Only one is white with frost.'),
        ],
        parentNote: 'Counted four lantern posts and noticed which one was different.',
      },
      {
        id: lid('c7-open', 2),
        domain: 'science',
        skill: 'some animals are awake at night',
        standard: 'ELOF: Scientific Reasoning',
        kind: 'ask',
        after: 5,
        prompt: [
          N('A hedgehog snuffles past Luna’s boots. Snuffle, snuffle.'),
          LUNA('Who else is awake at night, like me?', 'think'),
        ],
        options: [
          {
            label: 'A hedgehog',
            best: true,
            reply: [LUNA('Yes! Hedgehogs, and owls, and me.', 'happy'), LUNA('We sleep in the day.')],
          },
          {
            label: 'A butterfly',
            reply: [LUNA('Butterflies like sunny days.'), LUNA('Hedgehogs are awake at night. So am I.')],
          },
          {
            label: 'A sunflower',
            reply: [LUNA('Sunflowers love the sun!'), LUNA('Hedgehogs are awake at night. So am I.')],
          },
        ],
        parentNote: 'Learned that some animals, like hedgehogs, are awake at night and rest in the day.',
      },
    ],
  ),
  scene(
    'c7-stillness',
    [
      N('Moss comes down the hill. His feet leave no prints.'),
      N('He stops at the frosty post, and looks and looks.'),
      N('Your Nubbin licks the frost. Brr! Out pops its tongue.'),
      N('Sable licks it too, very slowly. Now they both look shocked.'),
      MOSS('Yes. It is cold. That is the point.'),
      MOSS('Something was hidden under this post. It isn’t there now.', 'think'),
      MOSS('Sit with me. This is a long story.'),
      N('You sit on the cold grass. Sable sits near you.'),
      MOSS('Let me tell you about the Stillness.'),
      MOSS('It is a cold, sad stone that makes Nubbins too still.'),
      N('Hmm. A stone that makes things still. How very strange!'),
    ],
    [
      {
        id: lid('c7-stillness', 1),
        domain: 'sel',
        skill: 'calm down with slow breaths',
        standard: 'CASEL: Self-management',
        kind: 'do',
        after: 7,
        check: 'edu:breathe:slow:3',
        lines: [
          MOSS('Before a long story, we breathe slowly. Like a tree.', 'soft'),
          N('(Breathe in through your nose… and out through your mouth.)'), N('(Do it three times together, nice and slow.)'),
          MOSS('Good. Now we are calm, and ready to listen.'),
        ],
        parentNote: 'Practised three slow breaths to feel calm and ready to listen.',
      },
    ],
    [
      {
        id: 'grey',
        label: 'Why are they grey?',
        then: [
          MOSS('Grey is what the cold leaves behind. Like a mark.'),
          MOSS('First the colour goes. Then the wanting to play.', 'sad'),
        ],
      },
      {
        id: 'hurt',
        label: 'Does it hurt them?',
        then: [
          MOSS('No. It does not hurt.'),
          MOSS('But they stop feeling happy too.', 'sad'), MOSS('That is the sad part.'),
        ],
      },
      {
        id: 'sable',
        label: 'Did it happen to Sable?',
        then: [
          MOSS('A little. Her old home was very cold.'),
          N('Sable turns one ear towards Moss. Just one.'),
          MOSS('But she ran away.', 'soft'), MOSS('Part of her kept wanting to be happy.'),
        ],
      },
    ],
  ),
  scene(
    'c7-stillness-2',
    [
      MOSS('The stone is not a monster. It doesn’t shout.'),
      MOSS('It whispers just one little word.'),
      N('Moss waits. And waits. Then he says it.'),
      MOSS('Safe.'),
      N('Sable’s ears go flat. She doesn’t like that word.'),
      MOSS('The stone says: stay still, and nothing can hurt you.'),
      MOSS('That sounds kind. But still Nubbins can’t run up the hill.', 'think'),
    ],
    [
      {
        id: lid('c7-stillness-2', 1),
        domain: 'literacy',
        skill: 'rhyming words (still, hill, spill)',
        standard: 'RF.K.2',
        kind: 'ask',
        after: 6,
        prompt: [
          MOSS('Still… hill. Those words rhyme. They end the same way.', 'soft'),
          MOSS('Which word rhymes with still?'),
        ],
        options: [
          { label: 'Spill', best: true, reply: [MOSS('Yes. Still, hill, spill. They all end the same!', 'happy')] },
          { label: 'Sock', reply: [MOSS('Sock ends with ock. Spill ends with ill, like still.')] },
          { label: 'Moon', reply: [MOSS('Moon ends with oon. Spill ends with ill. Still, spill!')] },
        ],
        parentNote: 'Listened for words that rhyme with "still".',
      },
    ],
    [
      {
        id: 'cinder',
        label: 'Did Cinder hear it?',
        then: [
          MOSS('Yes. She heard it first.'), MOSS('She loved the Nubbins very much.'),
          MOSS('She held them too tight. Love should be gentle.', 'soft'),
        ],
      },
      {
        id: 'who',
        label: 'Who would listen to that?',
        then: [
          MOSS('Anyone who is scared for someone they love.'),
          MOSS('They aren’t bad. Just scared, and tired.', 'soft'),
        ],
      },
      {
        id: 'me',
        label: 'Could I hear it?',
        then: [
          MOSS('Maybe. You love your Nubbins very much.'),
          MOSS('So I will stay close to you.', 'soft'), MOSS('You won’t be alone.'),
        ],
      },
    ],
  ),
  scene(
    'c7-stillness-3',
    [
      MOSS('Gran Hazel had a word for the opposite.'),
      MOSS('Her word was: well.'),
      N('The sun comes up. The frost starts to steam.'),
      MOSS('A well Nubbin runs and plays. It eats a beetle.'),
      MOSS('It gets a bump. It comes back. It is happy.'),
      MOSS('A still Nubbin gets no bumps. And it never plays.'),
      MOSS('Safe is not the same as well.', 'soft'),
      MOSS('Sable is grey, and she always will be.'),
      MOSS('But grey is just a mark. Sable can still be well.', 'soft'),
    ],
    [
      {
        id: lid('c7-stillness-3', 1),
        domain: 'science',
        skill: 'what animals need to live',
        standard: 'K-LS1-1',
        kind: 'ask',
        after: 4,
        prompt: [MOSS('What does a Nubbin need, to be well?', 'think')],
        options: [
          {
            label: 'Food, water and a cosy home',
            best: true,
            reply: [
              MOSS('Yes! Food, water and a home.', 'happy'),
              MOSS('And Nubbins need love. Lots of it.', 'soft'),
            ],
          },
          {
            label: 'A cold, still stone',
            reply: [MOSS('A Nubbin on a cold stone? Brr! Still as a pebble, and about as happy.'), MOSS('They need food, water and a home.')],
          },
          {
            label: 'Nothing at all',
            reply: [MOSS('Every living thing needs something! Food, water and a home.')],
          },
        ],
        parentNote: 'Learned that animals need food, water and a place to live.',
      },
    ],
    [
      {
        id: 'what',
        label: 'What can I do for Sable?',
        then: [
          MOSS('Do what Gran Hazel did.'), MOSS('Feed her first. Never, ever throw her.'),
          MOSS('And when you don’t know what to do—'),
          YOU('—sit down next to her and wait.'),
          MOSS('Yes. You were listening.', 'soft'),
        ],
      },
      {
        id: 'where',
        label: 'Where did the stone from this post go?',
        then: [
          MOSS('That is not mine to tell.', 'think'),
          MOSS('Gran Hazel wrote everything down. Find what she wrote.'),
        ],
      },
      {
        id: 'quiet',
        label: 'Say nothing. Just sit.',
        then: [
          N('You sit by the post with Moss and Sable.'), N('The sun warms you.'),
          MOSS('Good. You are learning.', 'soft'),
        ],
      },
    ],
  ),
  scene(
    'c7-close',
    [
      N('One sunny afternoon, Sable walks up to you.'),
      N('She leans her whole body on your leg. Lean.'),
      N('She is heavy! You stand very still and let her.'),
      CLOVER('Oh! Look at her!', 'happy'),
      LUNA('Still grey. Always will be. And look at her anyway.', 'soft'),
      BYTE('I’m writing that down as nice.', 'think'),
      CLOVER('Write it down twice!', 'happy'),
      PIXEL('I’m Pixel. Byte is my husband. We argue about machines.', 'happy'),
      PIXEL('I made Sable a trust meter! It says MAYBE.', 'happy'),
      BYTE('Your machines never measure things right.', 'think'),
      PIXEL('Byte, your shoelace is undone.'),
      N('Byte looks down. It is tied!'),
      PIXEL('Got you. That one measured you right.', 'happy'),
      N('The needle wobbles. MAYBE. Sable leans on you even harder.'),
      N('Up on the hill, Moss smiles and looks away.'),
    ],
    [
      {
        id: lid('c7-close', 1),
        domain: 'sel',
        skill: 'reading trust in body language',
        standard: 'CASEL: Social awareness',
        kind: 'ask',
        after: 2,
        prompt: [N('(Look at Sable.) How does Sable feel, leaning on you?')],
        options: [
          {
            label: 'Calm and cosy',
            best: true,
            reply: [N('Yes. Leaning on someone says: I trust you.')],
          },
          {
            label: 'Scared',
            reply: [N('She was scared before. Now she leans close.'), N('She feels calm, and she trusts you.')],
          },
          {
            label: 'Cross',
            reply: [N('Cross Nubbins stomp away. Sable leans close.'), N('She feels calm and cosy.')],
          },
        ],
        parentNote: 'Read how a shy animal shows trust with its body.',
      },
      {
        id: lid('c7-close', 2),
        domain: 'literacy',
        skill: 'the letter M and its sound',
        standard: 'ELOF: Literacy',
        kind: 'do',
        after: 12,
        check: 'edu:say:sound:m',
        lines: [
          PIXEL('MAYBE starts with the letter M. Mmm!', 'happy'),
          PIXEL('Say the sound with me: m-m-maybe, m-m-Moss!'),
        ],
        parentNote: 'Said the sound of the letter M and heard it in Maybe and Moss.',
      },
    ],
  ),
];

// ---------------------------------------------------------------- chapter 8: The Hollow

const C8_GATE: Line[] = [
  N('Fern brings a bag: fruit, a jumper, a whistle, and another jumper!'),
  FERN('It’s cold where you’re going. So: jumpers!', 'happy'),
  FERN('Two jumpers! One for you. One for your Nubbin.', 'happy'),
  FERN('I knitted them myself. They are very, very itchy.'),
  FERN('It will look very silly.'),
  N('Your Nubbin tries its jumper on. It wears it as a hat.'),
  N('Sable sits by the gate. She will wait here.'),
];

const C8_LEDGE: Line[] = [
  N('Behind the waterfall it is very loud. Whoosh! Roar!'),
  N('Through a gap: a warm pool, with steam rising.'),
  MARINA('That’s the Wellspring. The first Nubbins came from there.', 'soft'),
  N('But look! A thin line of frost, round the warm pool.'),
];

const C8_HOLLOW = N('Past the falls, grey Nubbins peek from the dark trees.');

const CH8: EduScene[] = [
  scene(
    'c8-open',
    [
      N('Autumn is here. The leaves turn yellow. Crunch, crunch.'),
      N('Nova is at the gate. She lifts and pushes.'),
      N('Nova visits sometimes. She never stays for tea.'),
      NOVA('I need to ask for help. I’m bad at asking.', 'think'),
      NOVA('Past the waterfall is the Hollow. Lost Nubbins live there.'),
      NOVA('Someone was feeding them. A lady with a lantern.'),
      N('Could it be Gran Hazel?'),
      NOVA('Her fire has gone cold. The Nubbins are hungry.', 'soft'),
      NOVA('I don’t want to go alone. Will you come?'),
      MOSS('Gran Hazel went with a lantern and fruit. Take both.', 'soft'),
    ],
    [
      {
        id: lid('c8-open', 1),
        domain: 'science',
        skill: 'seasons: leaves change colour in autumn',
        standard: 'K-ESS2-1',
        kind: 'ask',
        after: 1,
        prompt: [NOVA('Look at the plum tree. Yellow leaves!', 'think'), NOVA('Which season is it?')],
        options: [
          {
            label: 'Autumn',
            best: true,
            reply: [NOVA('Yes! In autumn, lots of leaves change colour.', 'happy'), NOVA('Yellow, orange, red. Then they fall.')],
          },
          {
            label: 'Spring',
            reply: [NOVA('In spring, new green leaves grow. Yellow leaves mean autumn.')],
          },
          {
            label: 'Summer',
            reply: [NOVA('Summer leaves are green. When they turn yellow, it’s autumn.')],
          },
        ],
        parentNote: 'Learned that many trees’ leaves turn yellow, orange and red in autumn, then fall.',
      },
      {
        id: lid('c8-open', 2),
        domain: 'sel',
        skill: 'asking for help',
        standard: 'CASEL: Relationship skills',
        kind: 'ask',
        after: 8,
        prompt: [MOSS('Nova asked for help. That is hard for her.', 'think'), MOSS('Was it a good idea?')],
        options: [
          {
            label: 'Yes. Asking for help is brave',
            best: true,
            reply: [MOSS('Yes. Asking for help is brave, and clever too.', 'soft')],
          },
          {
            label: 'No. She should do it alone',
            reply: [MOSS('Some things are too big to do alone.'), MOSS('Asking for help is brave.')],
          },
        ],
        parentNote: 'Talked about how asking for help is a brave and sensible thing to do.',
      },
    ],
    [
      {
        id: 'yes',
        label: 'Yes. Let’s go now.',
        friendship: { nova: 3 },
        then: [
          NOVA('Oh! Good. That was easier than I thought.', 'happy'),
          NOVA('I made up a speech. It has owls in it. Hoo, hoo!', 'happy'),
          NOVA('I’ll get Marina. You get fruit. Lots of fruit!'),
          N('Nova runs off down the lane, calling for Marina.'),
        ],
      },
      {
        id: 'hazel',
        label: 'Is Gran all right?',
        friendship: { nova: 2 },
        then: [NOVA('I don’t know. That’s the true answer.', 'sad'), NOVA('Bring fruit. Lots of fruit. More than that!')],
      },
      {
        id: 'falls',
        label: 'How do we get past the waterfall?',
        friendship: { nova: 1, marina: 1 },
        then: [
          NOVA('Marina knows the way. We follow her, very close.'),
          NOVA('Bring fruit. Lots of fruit. More than that!'),
        ],
      },
    ],
  ),
  scene(
    'c8-ledge',
    [
      ...C8_GATE,
      MARINA('Don’t be brave. Be careful. Hold the rock. Watch my feet.'),
      MARINA('Rule four still counts. Don’t be Sparks!', 'happy'),
      N('Nova unfolds a long speech. Both sides of the page!'),
      NOVA('I would like to say a few words. About owls.', 'happy'),
      MARINA('Hand on the rock, Nova.'),
      N('Nova puts the speech away. Later, she whispers “owls” to the rock.'),
      ...C8_LEDGE,
      MARINA('That’s new. It’s never been cold here before.', 'shock'),
      C8_HOLLOW,
    ],
    [
      {
        id: lid('c8-ledge', 1),
        domain: 'maths',
        skill: 'count to 4',
        standard: 'K.CC.B.5',
        kind: 'do',
        after: 5,
        check: 'edu:count:bag-items:4',
        lines: [
          FERN('Count my bag with me! Tap each thing.', 'happy'),
          N('(Count together: fruit, one. Jumper, two. Whistle, three. Jumper, four.)'),
          FERN('Four things! Two are jumpers.'), FERN('Sorry about the jumpers.'),
        ],
        parentNote: 'Counted four things in a bag, touching each one once.',
      },
      {
        id: lid('c8-ledge', 2),
        domain: 'health',
        skill: 'staying safe near water',
        standard: 'ELOF: Perceptual, Motor, and Physical Development',
        kind: 'ask',
        after: 8,
        prompt: [MARINA('Why do we go slowly near water?', 'think')],
        options: [
          {
            label: 'So we don’t slip and fall in',
            best: true,
            reply: [MARINA('Yes. Wet rocks are slippery.', 'happy'), MARINA('Go slowly, and stay close to a grown-up.')],
          },
          {
            label: 'So we can be fast',
            reply: [MARINA('Near water, slow is best! Wet rocks are slippery.'), MARINA('Stay close to a grown-up.')],
          },
          {
            label: 'Because water is boring',
            reply: [MARINA('Water is great fun! But wet rocks are slippery.'), MARINA('Go slowly, with a grown-up.')],
          },
        ],
        parentNote: 'Learned to go slowly near water, because wet rocks are slippery, and to stay with a grown-up.',
      },
    ],
  ),
  scene(
    'c8-ledge-s4',
    [
      ...C8_GATE,
      MARINA('You know my rules. Hold the rock. Watch my feet.', 'happy'),
      N('Nova unfolds a long speech. Both sides of the page!'),
      NOVA('I would like to say a few words. About owls.', 'happy'),
      MARINA('Hand on the rock, Nova.'),
      N('Nova puts the speech away. Later, she whispers “owls” to the rock.'),
      ...C8_LEDGE,
      MARINA('That wasn’t there last time we came!', 'shock'),
      C8_HOLLOW,
    ],
    [
      {
        id: lid('c8-ledge-s4', 1),
        domain: 'maths',
        skill: 'count a small group (2)',
        standard: 'K.CC.B.5',
        kind: 'ask',
        after: 5,
        prompt: [FERN('How many jumpers did I pack?', 'think'), FERN('Count them in the bag.')],
        options: [
          {
            label: 'Two',
            best: true,
            reply: [FERN('Two jumpers! One, two. Sorry about the jumpers.', 'happy')],
          },
          {
            label: 'One',
            reply: [FERN('Look again: one jumper… and another! One, two. Two jumpers.')],
          },
          {
            label: 'Five',
            reply: [FERN('Five would be a lot!'), FERN('Count again: one, two. Two jumpers.')],
          },
        ],
        parentNote: 'Counted a small group and said how many there were.',
      },
      {
        id: lid('c8-ledge-s4', 2),
        domain: 'health',
        skill: 'staying safe near water',
        standard: 'ELOF: Perceptual, Motor, and Physical Development',
        kind: 'ask',
        after: 7,
        prompt: [MARINA('Do you remember my rules near water?', 'think')],
        options: [
          {
            label: 'Go slowly and hold on',
            best: true,
            reply: [MARINA('Yes! Slow feet. Hand on the rock.', 'happy'), MARINA('And stay close to a grown-up.')],
          },
          {
            label: 'Run and jump',
            reply: [MARINA('Not near water! Wet rocks are slippery.'), MARINA('Go slowly and hold on.')],
          },
          {
            label: 'Go on your own',
            reply: [MARINA('Never alone near water.'), MARINA('Stay close to a grown-up, and go slowly.')],
          },
        ],
        parentNote: 'Remembered how to stay safe near water: go slowly, hold on, and stay with a grown-up.',
      },
    ],
  ),
  scene(
    'c8-close',
    [
      N('Gran’s camp. No Gran. A cold fire. Empty bowls.'),
      N('Grey Nubbins watch from the trees, quiet as mice.'),
      N('On a flat stone is Gran’s notebook.'),
      HAZEL('“Fed nineteen today. The brown one let me touch her ear.”', 'soft'),
      HAZEL('“It took two months. Worth it.”', 'happy'),
      HAZEL('“I’m very poorly. The doctors can’t make me better.”'),
      HAZEL('“So I decided to make this year a good one.”'),
      HAZEL('“To my grandchild: I love you. Lift and push.”', 'soft'),
      HAZEL('“The cold comes from Corvin’s house. I hope he brings it back.”'),
      NOVA('Her footprints go up the valley, into the cold. Brave Gran.', 'soft'),
      N('Your Nubbin puts its head on your knee. That helps.'),
    ],
    [
      {
        id: lid('c8-close', 1),
        domain: 'maths',
        skill: 'count to 12',
        standard: 'K.CC.B.5',
        kind: 'do',
        after: 0,
        check: 'edu:count:bowls:12',
        lines: [
          NOVA('Gran left lots of bowls. Let’s count them.'),
          N('(Count the bowls together. Point to each one.)'),
          NOVA('Twelve bowls! That’s a lot of hungry Nubbins.'),
        ],
        parentNote: 'Counted twelve objects, pointing to each one once.',
      },
      {
        id: lid('c8-close', 2),
        domain: 'sel',
        skill: 'what helps when we miss someone',
        standard: 'CASEL: Self-awareness',
        kind: 'ask',
        after: 10,
        prompt: [N('You miss Gran. What helps when we miss someone?')],
        options: [
          {
            label: 'A cuddle, or telling someone',
            best: true,
            reply: [N('Yes. A cuddle helps. Saying “I miss her” helps too.')],
          },
          {
            label: 'Keeping it all inside',
            reply: [N('Big feelings feel lighter when we share them.'), N('A cuddle or a talk helps.')],
          },
          {
            label: 'Pretending you’re fine',
            reply: [N('It’s all right not to feel fine.'), N('A cuddle, or telling someone, helps.')],
          },
        ],
        parentNote: 'Talked about missing someone, and that a cuddle or telling someone can help.',
      },
    ],
    [
      {
        id: 'feed',
        label: 'Fill the bowls before you go.',
        friendship: { nova: 2 },
        then: [
          N('You fill all twelve bowls. Plop, plop, plop.'),
          N('When you look back, three are already empty!'),
          NOVA('That’s how Gran did it. One bowl at a time.', 'soft'),
        ],
      },
      {
        id: 'wait',
        label: 'Sit down by the cold fire, and wait.',
        friendship: { nova: 2 },
        then: [
          N('You sit and wait. That’s Gran’s rule number three.'),
          N('One grey Nubbin climbs down to a low branch.'), N('It watches you.'),
          NOVA('That’s closer than they ever come for me.', 'soft'),
        ],
      },
    ],
  ),
  scene(
    'c8-nova',
    [
      N('You walk back with Gran’s notebook in your coat.'),
      N('Little lights blink in the dark. Fireflies!'),
      N('Behind you, a grey Nubbin eats. It doesn’t run away.'),
      NOVA('Can I ask you something?', 'think'),
      NOVA('Gran could have spent her year at home, with you.'),
      NOVA('She came here to help the lost Nubbins instead.'),
      NOVA('Do you mind? It’s all right if you do.', 'soft'),
    ],
    [
      {
        id: lid('c8-nova', 1),
        domain: 'science',
        skill: 'fireflies are beetles that make their own light',
        standard: 'ELOF: Scientific Reasoning',
        kind: 'ask',
        after: 1,
        prompt: [NOVA('Fireflies like summer. The warm spring keeps them cosy here.'), NOVA('What are fireflies, do you think?', 'think')],
        options: [
          {
            label: 'Tiny beetles that glow',
            best: true,
            reply: [NOVA('Yes! The end of their body lights up.', 'happy'), NOVA('They flash to find each other.')],
          },
          {
            label: 'Little lamps',
            reply: [NOVA('They look like lamps!'), NOVA('But they’re tiny beetles. The end of their body glows.')],
          },
          {
            label: 'Stars that fell down',
            reply: [NOVA('Stars stay up in the sky.'), NOVA('Fireflies are tiny beetles that glow.')],
          },
        ],
        parentNote: 'Learned that fireflies are small beetles that make their own light.',
      },
    ],
    [
      {
        id: 'year-mind',
        label: 'Yes. I wish she’d been home.',
        friendship: { nova: 2 },
        then: [NOVA('That’s all right. Tell her, when you see her.', 'soft')],
      },
      {
        id: 'year-right',
        label: 'No. The lost Nubbins needed her.',
        friendship: { nova: 1 },
        then: [NOVA('Maybe. But you needed her too. Both matter.', 'think')],
      },
      {
        id: 'year-both',
        label: 'Both. I miss her, and she was right.',
        friendship: { nova: 2 },
        then: [NOVA('Both are true, then.', 'soft'), N('That is just what Gran wrote.')],
      },
    ],
  ),
];

// ---------------------------------------------------------------- the campaign slice

export const EDU_CAMPAIGN_2_SPROUT: EduCampaign = {
  id: 'sprout:book2',
  band: 'sprout',
  chapters: {
    5: {
      title: 'The Circuit',
      goalText: 'Win a race with your Nubbin!',
      hint: 'Tap Races at the top. A big, strong Nubbin runs best.',
    },
    6: {
      title: 'Rain on the Hill',
      goalText: 'Sit with Dusty by the flower.',
      hint: 'Walk up to Dusty and tap them.',
    },
    7: {
      title: 'Sable Leans In',
      goalText: 'Help Sable trust you more and more.',
      hint: 'Feed Sable and pet her gently. Never throw her. Go slowly.',
    },
    8: {
      title: 'The Hollow',
      goalText: 'Go into the Hollow and find Gran’s notebook.',
      hint: 'It’s dark. Follow the fireflies to a flat stone, and tap the notebook.',
    },
  },
  scenes: [...CH5, ...CH6, ...CH7, ...CH8],
  notes:
    'Sprout (read aloud) versions of Book Two, chapters 5–8. Every scene in BOOK2_SCENES has a version, ' +
    'except c5-sold (cut 2026-10-22: no sprout choice sells a Nubbin), including the variants c5-considered, c6-open-walked and c8-ledge-s4. All original choice ids are kept: none ' +
    'of Book Two’s choices is cruel or bleak, so no defaultChoice is needed. Fossil’s farewell uses the ' +
    'EDU-STYLE wording on death (faded = died; body stopped working and won’t start again; never sleep), then ' +
    'comfort. The Stillness is "a cold, sad stone that makes Nubbins too still". Hazel is "very poorly", no ' +
    'illness named. Corvin is presented only as a cold-handed, grumpy man; his wrongdoing is left for later books. ' +
    'c5-considered plays only after the kept “consider” choice in c2-corvin (sell is left out of sprout). Lesson ' +
    'prompts in c5-open and c5-close are the narrator’s, because Moss isn’t at the Circuit. The Hollow’s autumn ' +
    'fireflies are kept warm by the Wellspring (c8-nova-l1).',
};

export const CHECKS: string[] = [
  'edu:say:sound:b',
  'edu:say:sound:m',
  'edu:count:stopwatches:4',
  'edu:count:wishes:3',
  'edu:count:lantern-posts:4',
  'edu:breathe:slow:3',
  'edu:count:bag-items:4',
  'edu:count:bowls:12',
];
