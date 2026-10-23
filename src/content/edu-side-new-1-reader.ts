/**
 * The Learning Grove, reader band (ages 7–10): new side stories, part 1.
 *
 *   S11 The Blight      fungi and spores, mapping spread downwind, quarantine, ladybirds as
 *                       predators (3-LS4-4), comparing solutions (3-5-ETS1-2); think: acting fast
 *                       when you’re scared
 *   S15 Lucky Eggs      tally charts, fractions as chance (3 in 30 = 1 in 10; 3.NF.A.1, 3.MD.B.3),
 *                       honest and dishonest advertising; think: is it fair to sell “the week before”?
 *   S16 The Workyard    simple machines (waterwheel, wheel and axle), energy changing form (4-PS3-4),
 *                       rest; think: fair work and consent for animals
 *
 * One EduScene per original scene (every step scene, every done scene and each complete scene).
 * These quests have no variant scenes. Every choice keeps its original id and `set`; the reader
 * band keeps every choice. See EDU-STYLE.md. British spelling.
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
const FE = say('fern');
const SP = say('sparks');
const CL = say('clover');
const EM = say('ember');
const BY = say('byte');
const DA = say('dashwood');
const JP = say('jackpot');
const PI = say('pip');
const KD = say('kids');
const BK = say('brisk');

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

// ================================================================== S11 The Blight
const S11_SCENES: EduScene[] = [
  // ------------------------------------------------ step 1 scene: Fern at the gate
  scene(
    's11-fern',
    [
      N('Fern is at your gate before breakfast. She holds a plum out on her flat hand, as if it might bite.'),
      FE('Don’t touch it. Just look at it. Then tell me I’m imagining it.', 'sad'),
      N('The skin is freckled with black. When she tilts her hand, the plum caves in and pours out a soft grey dust.'),
      FE('Three trees at the bottom of my orchard. Fine yesterday. Today they’re… that.'),
      N('Through the hedge, wasps buzz over the windfalls, the plums that dropped in the grass. The whole slope smells of hot jam.'),
      FE('Hazel grafted half those trees for me, the year I moved in. She whitewashed every trunk herself, every spring.', 'soft'),
      FE('I haven’t told anyone. If I tell someone, it’s real.', 'sad'),
    ],
    [
      {
        domain: 'science',
        skill: 'some plant diseases are caused by a fungus, which spreads by spores',
        kind: 'notice',
        after: 3,
        lines: [
          FE('It’s the dust that frightens me. I think it’s spores. I think this is a fungus.', 'think'),
          FE('Mushrooms and mould are fungi too. Some fungi are friendly. Some make plants ill.'),
          FE('A fungus lets go of spores into the air, the way a dandelion lets go of seeds. Only far, far smaller.'),
        ],
        parentNote: 'Learned that some plant diseases are caused by a fungus, and that fungi spread by tiny spores.',
      },
      {
        domain: 'sel',
        skill: 'sharing a worry with someone you trust',
        standard: 'CASEL: Relationship skills',
        kind: 'ask',
        after: 6,
        prompt: [N('Fern has kept a big worry all to herself. What would help her most?')],
        options: [
          {
            label: 'Telling someone she trusts.',
            best: true,
            reply: [
              N('Yes. Telling someone doesn’t make the problem real. It was already real.'),
              N('Telling someone makes it shared. Then other people can help carry it.'),
            ],
          },
          {
            label: 'Keeping it secret, so nobody gets upset.',
            reply: [
              N('That’s a kind thought. But secrets can make a worry feel heavier and heavier.'),
              N('When we tell someone we trust, they can help. That’s why Fern came to your gate.'),
            ],
          },
          {
            label: 'Pretending it isn’t happening.',
            reply: [
              N('Lots of people try that. But the trees stay sick whether we look or not.'),
              N('Telling someone she trusts is braver, and it means help can come sooner.'),
            ],
          },
        ],
        parentNote: 'Thought about why sharing a worry with a trusted person helps.',
      },
    ],
    [
      {
        id: 'look',
        label: 'Go and look now.',
        set: { 's11-first': 'look' },
        then: [N('You go through the hedge. Fern follows two steps behind, as if the trees might hear her coming.')],
      },
      {
        id: 'comfort',
        label: 'Put an arm round her first.',
        set: { 's11-first': 'comfort' },
        then: [
          FE('Oh, don’t. I’ll go soggy. I’ve got a whole orchard to be soggy about.', 'sad'),
          N('She leans on you for exactly one second. Then she marches off through the hedge.'),
        ],
      },
      {
        id: 'byte',
        label: 'Say you’ll fetch Byte.',
        set: { 's11-first': 'byte' },
        then: [FE('Byte. Yes. Byte will put it in a chart. Then it’s a problem instead of a tragedy.', 'think')],
      },
    ],
  ),
  // ------------------------------------------------ step 1 done: Ember at the wall
  scene(
    's11-ember',
    [
      N('Three trees at the bottom of the slope. Their leaves have curled up like little black fists.'),
      N('Grey dust lies under them like spilt flour.'),
      N('Someone else has seen. Ember stands at the orchard wall, arms folded so tight her knuckles are white.'),
      EM('Burn it. All of it. Tonight, before the blight spreads.', 'angry'),
      FE('All of it? Ember, there are forty trees.', 'shock'),
      EM('There’ll be none if you wait. I know how waiting goes. You’re polite, you wait, and then it’s too late.', 'angry'),
      N('Clover has come up behind you with a basket of bandages. That’s what Clover brings to everything.'),
      CL('You can’t burn forty trees for three. You don’t even know what it is yet.', 'sad'),
      EM('I didn’t know what he was either, till he had Ash. Ask me how that went.', 'angry'),
      N('Fern sits down on an upturned crate between them, and says nothing at all.'),
      CL('That’s cinder-love, that is. Holding on so tight you hurt the thing you love. Don’t tell her I said so.', 'soft'),
    ],
    [
      {
        domain: 'maths',
        skill: 'subtraction within 100',
        standard: '2.OA.A.1',
        kind: 'ask',
        after: 7,
        prompt: [N('Clover is thinking about the numbers. Forty trees. Three are sick.'), N('How many healthy trees would Ember burn?')],
        options: [
          {
            label: '37',
            best: true,
            reply: [N('Yes. 40 take away 3 is 37. Thirty-seven healthy trees, burned for three sick ones.')],
          },
          {
            label: '43',
            reply: [N('Careful: that’s 40 add 3. We want the trees that are left when we take the sick ones away.'), N('40 − 3 = 37.')],
          },
          {
            label: '3',
            reply: [N('Three is how many are sick. The healthy ones are all the rest: 40 − 3 = 37.')],
          },
        ],
        parentNote: 'Subtracted within 100 (40 − 3) to see what a rash plan would cost.',
      },
      {
        domain: 'literacy',
        skill: 'working out a character’s motive from her past',
        standard: 'RL.3.3',
        kind: 'ask',
        after: 10,
        prompt: [N('Why does Ember want to burn everything, so fast?')],
        options: [
          {
            label: 'She lost Ash by waiting, and she’s scared it will happen again.',
            best: true,
            reply: [
              N('Yes. Ember’s past explains her now. She waited once, and lost Ash.'),
              N('So when something goes wrong, her fear shouts: don’t wait!'),
            ],
          },
          {
            label: 'She likes fires.',
            reply: [
              N('Nothing in the story says that. Listen to what she says: “I know how waiting goes.”'),
              N('She lost Ash by waiting. She’s frightened of waiting again.'),
            ],
          },
          {
            label: 'She’s cross with Fern.',
            reply: [
              N('She sounds cross. But she isn’t cross with Fern. She mentions Ash.'),
              N('Her anger is covering up a fear: that waiting will cost her everything again.'),
            ],
          },
        ],
        parentNote: 'Used a character’s past to explain why she acts the way she does.',
      },
    ],
  ),
  // ------------------------------------------------ step 2 scene: the lens
  scene(
    's11-lens',
    [
      N('Byte arrives at a jog. He has a hand lens on a string, a roll of luggage labels, and a pencil behind each ear.'),
      BY('Nobody burns anything until it’s been looked at. That isn’t a rule. That’s just being a person.', 'think'),
      EM('You’ve got till dusk. Then I’m doing it, with or without your little labels.', 'angry'),
      BY('They’re standard labels. They’re not little. They’re regular.', 'angry'),
      N('He ties the first label to the first sick tree. In capitals: NOT FINE.'),
      N('The next gets PROBABLY FINE. The next gets FINE (ACCORDING TO FERN). The water butt gets DO NOT DRINK.'),
      BY('Forty trees, one lens. You look, I write. Clover, stop bandaging that branch. It isn’t hurt. It’s a branch.'),
      CL('It looked lonely.', 'soft'),
      BY('Leaves for spots. Bark for holes. Fruit for dust. And don’t lick anything. I have to say that. I’ve met people.', 'think'),
      N('On his way past the wall, he labels Ember, very small and very fast: VOLATILE. She doesn’t notice. Yet.'),
    ],
    [
      {
        domain: 'science',
        skill: 'how a hand lens magnifies',
        kind: 'do',
        after: 1,
        lines: [
          BY('This is a hand lens. See how the glass is curved, thicker in the middle than at the edges?', 'think'),
          BY('That curve bends the light coming through it, so things look bigger. We say it magnifies them.'),
          BY('Try it. Hold the lens near a leaf, then move it slowly until the tiny spots look big and sharp.'),
        ],
        check: 'edu:focus:lens:leaf',
        parentNote: 'Used a hand lens and learned that its curved glass bends light to make small things look bigger.',
      },
      {
        domain: 'health',
        skill: 'staying safe around mould',
        kind: 'ask',
        after: 8,
        prompt: [BY('While you’re looking: say you find a mouldy plum on the grass. What’s the safe thing to do?')],
        options: [
          {
            label: 'Leave it, and wash my hands if I touched it.',
            best: true,
            reply: [BY('Correct. Mouldy food can make you ill. Leave it, and wash your hands. You may keep your tongue.', 'happy')],
          },
          {
            label: 'Taste a tiny bit, to check.',
            reply: [
              BY('No! That’s the licking! I knew it!', 'shock'),
              BY('Never taste mouldy food or plants you don’t know. Leave it, and wash your hands if you touched it.'),
            ],
          },
          {
            label: 'Sniff it really closely.',
            reply: [
              BY('Close sniffing can put spores right up your nose. Not nice.', 'think'),
              BY('Look with the lens instead. Leave it, and wash your hands if you touched it.'),
            ],
          },
        ],
        parentNote: 'Learned not to eat or sniff mouldy food, and to wash hands after touching it.',
      },
    ],
  ),
  // ------------------------------------------------ step 2 done: the map
  scene(
    's11-map',
    [
      N('By mid-afternoon the orchard flutters with paper labels, like a washing line. You spread the map on Fern’s crate.'),
      N('Three trees are NOT FINE, in a crooked row at the bottom. Six are INCONCLUSIVE, SMELLS. The rest are fine.'),
      BY('Inconclusive means I can’t tell yet. Those six have wasp bites. Wasps aren’t a disease. They’re just rude.', 'think'),
      BY('Now look. It isn’t random. Every sick tree is in a line with the wind that comes up off the falls.', 'think'),
      BY('An illness you catch by touching goes from each tree to the next one. This one skipped trees. It came through the air.'),
      Y('So what’s in the air?'),
      BY('Good question. I have a jar.', 'happy'),
    ],
    [
      {
        domain: 'maths',
        skill: 'two-step subtraction',
        standard: '3.OA.D.8',
        kind: 'ask',
        after: 1,
        prompt: [BY('Forty trees on the map. Three NOT FINE. Six INCONCLUSIVE. How many are FINE?')],
        options: [
          {
            label: '31',
            best: true,
            reply: [BY('Yes. 40 − 3 = 37. Then 37 − 6 = 31. Two steps. Thirty-one fine trees.', 'happy')],
          },
          {
            label: '37',
            reply: [BY('Nearly. That takes away the three NOT FINE. Now take away the six INCONCLUSIVE too.'), BY('37 − 6 = 31.')],
          },
          {
            label: '9',
            reply: [BY('Nine is the trees we’re worried about: 3 + 6. The fine ones are the rest.'), BY('40 − 9 = 31.')],
          },
        ],
        parentNote: 'Solved a two-step subtraction problem (40 − 3 − 6) from a map.',
      },
      {
        domain: 'science',
        skill: 'using a map pattern to see how a disease spreads downwind',
        kind: 'ask',
        after: 4,
        prompt: [N('On the map, the sick trees make a line along the wind, with healthy trees in between.'), N('What does that pattern tell Byte?')],
        options: [
          {
            label: 'Something is being carried on the wind.',
            best: true,
            reply: [
              BY('Exactly. The wind carries things the way it blows. They land downwind.', 'happy'),
              BY('So we follow the line back the way the wind comes from, and find where it starts.'),
            ],
          },
          {
            label: 'Trees pass it to the tree next door.',
            reply: [
              BY('If they did, the sick trees would be in a clump, all touching. These have healthy trees between them.'),
              BY('A line along the wind means the wind is carrying something. It lands downwind.'),
            ],
          },
          {
            label: 'The bottom trees are just old.',
            reply: [
              BY('Some are old. But old trees all over the orchard are fine.'),
              BY('The sick ones line up with the wind. Something is riding it, and landing downwind.'),
            ],
          },
        ],
        parentNote: 'Read a pattern on a map to work out that a disease was spreading on the wind.',
      },
    ],
  ),
  // ------------------------------------------------ step 3 scene: the jar
  scene(
    's11-jar',
    [
      N('Byte hands you a jam jar with a muslin lid. Clover hands you a second one, in case the first gets lonely.'),
      BY('Something is landing on the sick side. If we catch one, we can stop guessing.'),
      N('You crouch in the long grass. The sun is hot on your neck. Dust lifts off the black plums like smoke.'),
      N('Something small and grey lands on a leaf. The moment your shadow touches the leaf, it folds its legs and drops.'),
      CL('Keep the sun in front of you (never look straight at it), so your shadow’s behind you. Shy things hide from shadows. I would.', 'soft'),
      EM('Or we could burn the lot and not crawl about in the grass.', 'angry'),
      N('She says it, but she doesn’t leave. She stands at the wall and watches every catch you miss.'),
    ],
    [
      {
        domain: 'science',
        skill: 'how small animals use their senses to escape danger',
        standard: '4-LS1-2',
        kind: 'notice',
        after: 3,
        lines: [
          CL('To a tiny bug, a sudden shadow can mean a bird swooping down to eat it.', 'soft'),
          CL('So lots of small creatures drop or hide the moment the light changes. Their senses keep them alive.'),
        ],
        parentNote: 'Learned that many small animals sense a sudden shadow as danger and hide.',
      },
      {
        domain: 'science',
        skill: 'shadows fall on the side away from the light',
        standard: '5-ESS1-2',
        kind: 'ask',
        after: 4,
        prompt: [N('The sun is low in the west. If you turn to face it, where will your shadow fall?')],
        options: [
          {
            label: 'Behind me.',
            best: true,
            reply: [
              CL('Yes. Light travels in straight lines. Your body blocks it, so your shadow lands on the far side.', 'happy'),
              CL('Sun in front, shadow behind. Now the bugs won’t see you coming.'),
            ],
          },
          {
            label: 'In front of me.',
            reply: [
              CL('That’s what happened before, when the sun was on your neck, behind you.', 'soft'),
              CL('A shadow always falls on the side away from the light. Face the sun, and it falls behind you.'),
            ],
          },
          {
            label: 'Nowhere. Shadows go away in the sun.',
            reply: [
              CL('Bright sun makes the sharpest shadows of all!', 'soft'),
              CL('Your body blocks the light, so the shadow falls on the side away from the sun. Face it, and it’s behind you.'),
            ],
          },
        ],
        parentNote: 'Worked out that a shadow falls on the side of an object away from the light.',
      },
    ],
  ),
  // ------------------------------------------------ step 3 done: the beetle
  scene(
    's11-beetle',
    [
      N('In the jar: a beetle no bigger than a lentil. It’s grey as pencil dust, with wings folded like a paper fan.'),
      BY('Under the lens it’s covered in spores. Black ones. It isn’t the disease. It’s the postman.', 'shock'),
      N('Byte follows the sick trees back the way the wind comes. They lead to a dead wild plum in the hedge by the stream.'),
      N('The dead tree is crawling with beetles. Each puff of wind lifts a few and carries them down the row.'),
      BY('They can’t fly against the wind. Only the trees downwind of that stump get them. The rest are safe.', 'happy'),
      BY('We can contain it. Keep it in one place, so it can’t spread.'),
      CL('Ladybirds eat beetle eggs, you know. I keep a jar of them at home. They have no manners at all.', 'happy'),
      CL('That one’s clean. Right in the middle of the sick row. Look.', 'shock'),
      FE('Grudge. Hazel’s old damson. Sourest fruit in the valley. I’ve been meaning to cut it down for years.', 'think'),
      N('Byte ties a new label to the jar. It says: GUILTY.'),
    ],
    [
      {
        domain: 'science',
        skill: 'the difference between a disease and the carrier that spreads it',
        kind: 'ask',
        after: 1,
        prompt: [N('Byte calls the beetle “the postman”. What does he mean?')],
        options: [
          {
            label: 'It carries the spores from tree to tree.',
            best: true,
            reply: [
              BY('Yes. A postman doesn’t write the letters. He carries them.', 'happy'),
              BY('The fungus is the disease. The beetle is the carrier: the spores ride on it to the next tree.'),
            ],
          },
          {
            label: 'The beetle is the disease.',
            reply: [
              BY('Close, but no. The disease is the fungus. Its spores are stuck all over the beetle.'),
              BY('The beetle just carries them, like a postman carries letters. It’s the carrier.'),
            ],
          },
          {
            label: 'It bites the trees and makes them sick.',
            reply: [
              BY('It might nibble. But look at the black spores on its back. They’re the problem.'),
              BY('The beetle carries the spores to new trees, like a postman with letters. It’s the carrier.'),
            ],
          },
        ],
        parentNote: 'Learned that a disease and the creature that carries it are not the same thing.',
      },
      {
        domain: 'social-studies',
        skill: 'where the word “quarantine” comes from',
        standard: 'D2.His.2.K-2',
        kind: 'notice',
        after: 5,
        lines: [
          BY('Keeping the sick ones apart, so an illness can’t spread, has a name. Quarantine.', 'think'),
          BY('It comes from an old Italian word for forty. Long ago in Venice, ships had to wait forty days before anyone came ashore.'),
          BY('That way, if a sailor was ill, it showed before it spread. Forty. Like the trees. I find that oddly comforting.', 'soft'),
        ],
        parentNote: 'Learned what quarantine means and that the word comes from the forty days ships waited long ago.',
      },
    ],
  ),
  // ------------------------------------------------ step 4 scene: dusk
  scene(
    's11-dusk',
    [
      N('The sun goes down behind the western hill. Bats come out over the stream. Then a light comes through the hedge, low and orange.'),
      N('It’s Ember, with a burning torch. In the firelight her face isn’t angry. It’s very, very frightened.'),
      EM('I’m sorry, Fern. I’m not waiting. I waited once.', 'sad'),
      FE('Ember…', 'sad'),
      EM('When Ash went, I kept thinking: tomorrow. I’ll go and get her back tomorrow. Then tomorrow was years.', 'sad'),
      EM('Fast is the only thing I’ve got. Don’t take it off me.', 'angry'),
      N('Byte holds the map. Clover holds Fern’s hand. Everybody looks at you.'),
    ],
    [
      {
        domain: 'sel',
        skill: 'thinking about acting fast when you are scared',
        standard: 'CASEL: Self-management',
        kind: 'ask',
        after: 5,
        prompt: [
          N('Ember is scared. Her fear is telling her: act now, and act big.'),
          N('What do you think? Is it a good idea to act fast when you’re scared?'),
        ],
        options: [
          {
            label: 'Yes. Sometimes waiting makes things worse.',
            reply: [
              N('That’s a fair answer. Ember learned it the hard way, with Ash.'),
              N('Sometimes fast really is right, like pulling your hand away from something hot.'),
            ],
          },
          {
            label: 'No. Fear can make you do too much.',
            reply: [
              N('That’s fair too. Clover would say fear makes everything look bigger than it is.'),
              N('Ember’s fear saw forty trees. The real problem was three.'),
            ],
          },
          {
            label: 'Stop, breathe, look at the facts. Then act fast.',
            reply: [
              N('That’s a thoughtful answer. Byte would like it: fast and right.'),
              N('A slow breath only takes a moment. Sometimes it’s the moment that saves thirty-seven trees.'),
            ],
          },
        ],
        parentNote: 'Thought about how fear pushes us to act fast, and when pausing first helps.',
      },
      {
        domain: 'science',
        skill: 'comparing solutions to a problem',
        standard: '3-5-ETS1-2',
        kind: 'ask',
        after: 6,
        prompt: [N('Three plans for the orchard. Which one stops the blight and saves the most trees?')],
        options: [
          {
            label: 'Take out the three sick trees and the dead plum. Keep watching the rest.',
            best: true,
            reply: [
              N('Yes. It stops the beetles where they start, and it saves thirty-seven trees.'),
              N('Taking out only the sick ones and keeping them apart from the healthy ones is a quarantine.'),
            ],
          },
          {
            label: 'Burn all forty trees.',
            reply: [
              N('That would stop the blight. But it destroys thirty-seven healthy trees too.'),
              N('A better plan removes only the three sick trees and the dead plum, where the beetles start.'),
            ],
          },
          {
            label: 'Do nothing, and hope.',
            reply: [
              N('That saves trees today. But the beetles would keep blowing down the row, and more trees would fall ill.'),
              N('A better plan removes the three sick trees and the dead plum, where the beetles start.'),
            ],
          },
        ],
        parentNote: 'Compared three solutions to a problem and chose the one with the best result and least harm.',
      },
    ],
    [
      {
        id: 'stand',
        label: 'Stand between her and the trees.',
        set: { 's11-dusk': 'stood' },
        then: [
          N('You step in front of the first healthy tree. The torch is close enough to warm your face.'),
          EM('Move.', 'angry'),
          Y('No.'),
          N('For a long moment nobody breathes. Then the torch drops, slowly, until it points at the grass.'),
          EM('You’d better be right. You’d better be right, or I’ll never forgive you.', 'sad'),
          N('She doesn’t leave. In the dark, without a word, she helps Fern chop down the three sick trees and the dead stump.'),
        ],
      },
      {
        id: 'map',
        label: 'Hand her the map. Let the evidence speak.',
        set: { 's11-dusk': 'map' },
        then: [
          N('You hold out Byte’s map. She doesn’t want to take it. She takes it.'),
          N('She reads it by her own torchlight: the line of the wind, the dead plum, the jar marked GUILTY.'),
          EM('Three. Not forty.', 'think'),
          EM('Three.', 'soft'),
          N('She pushes the torch into the water butt. It goes out with a long hiss, like a held breath.'),
          EM('Show me the stump. I’ll do the stump.', 'think'),
        ],
      },
      {
        id: 'together',
        label: 'Take the torch with her. Burn only the three sick trees, together.',
        set: { 's11-dusk': 'together' },
        then: [
          N('You put your hand on the torch, next to hers. She looks at you. Then she lets you hold it too.'),
          N('You burn the three sick trees and the dead wild plum, and nothing else. It takes a long time. Neither of you lets go.'),
          CL('Goodbye, trees. You were very good plums.', 'sad'),
          EM('That’s how it should have gone, with Ash. Not on my own. Not in a rush.', 'soft'),
          N('Fern brings out tea. Ember drinks hers standing up, watching the fire, until it’s only warm.'),
        ],
      },
    ],
  ),
  // ------------------------------------------------ step 4 done: the ladybirds
  scene(
    's11-ladybirds',
    [
      N('Clover unscrews her jar. Out pour ladybirds, hundreds of them, red as rosehips. They settle along the hedge.'),
      CL('Off you go, then. Every beetle egg you can find. Manners not required.', 'happy'),
      FE('No fire. No poison. Just hungry little helpers. Hazel would have liked that.', 'soft'),
      N('One lands on your thumb and won’t get off. Then three more.'),
      N('Each one is bright red, with seven neat black spots.'),
      N('After a while they are, more or less, yours.'),
      BY('I tried to label them. It isn’t possible. They’re all called LADYBIRD now.', 'think'),
    ],
    [
      {
        domain: 'science',
        skill: 'using a predator to protect plants when a habitat changes',
        standard: '3-LS4-4',
        kind: 'notice',
        after: 2,
        lines: [
          CL('A ladybird is a predator. It hunts and eats other small creatures, which we call its prey.', 'happy'),
          CL('Ladybirds eat greenfly and the eggs of other insects. Gardeners love them.'),
          CL('Using a predator to protect plants is a way to solve a problem without harming the rest of the garden.', 'soft'),
        ],
        parentNote: 'Learned that ladybirds are predators, and that gardeners can use them instead of poison to protect plants.',
      },
      {
        domain: 'maths',
        skill: 'multiplication as equal groups',
        standard: '3.OA.A.1',
        kind: 'ask',
        after: 4,
        prompt: [N('Four ladybirds on your thumb. Seven spots each. How many spots altogether?')],
        options: [
          {
            label: '28',
            best: true,
            reply: [
              N('Yes. Four groups of seven: 4 × 7 = 28.'),
              N('These are seven-spot ladybirds. Some people say the spots tell a ladybird’s age. They don’t. That’s a myth.'),
            ],
          },
          {
            label: '11',
            reply: [N('That’s 4 + 7. But each ladybird has seven spots, so it’s four groups of seven.'), N('7, 14, 21, 28. 4 × 7 = 28.')],
          },
          {
            label: '24',
            reply: [N('Close! Let’s count in sevens, one ladybird at a time: 7, 14, 21, 28.'), N('4 × 7 = 28.')],
          },
        ],
        parentNote: 'Multiplied 4 × 7 by thinking of equal groups.',
      },
    ],
  ),
  // ------------------------------------------------ complete
  scene(
    's11-complete',
    [
      N('A week later the orchard is quiet. Three stumps at the bottom of the slope. Thirty-seven green trees above them.'),
      N('In the middle of the bare row stands one tree, untouched: Grudge, the old damson, heavy with sour purple fruit.'),
      FE('Byte says the beetles hate Grudge’s bark. Too bitter. Hazel used to say Grudge was too stubborn to die.', 'happy'),
      FE('She always told me to graft off it. I never did. Who wants sour plums? Here. She left this at mine.', 'soft'),
      N('A short curved knife with a plum-wood handle, wound in green twine. The edge is still sharp.'),
      FE('Bind a cutting of Grudge onto a young tree, and the young tree grows up stubborn too. Her trick. Yours now.'),
      FE('You saved my orchard. That makes you its warden, whether you like it or not.', 'happy'),
      N('Ember comes past the wall. She has found Byte’s label in her pocket. She reads VOLATILE, and looks at him.'),
      N('Byte takes it, crosses it out, and writes something else: FRIGHTENED. Then, underneath: (FAIR).'),
      EM('…Fair.', 'soft'),
    ],
    [
      {
        domain: 'science',
        skill: 'grafting, and how a helpful trait helps a plant survive',
        standard: '3-LS4-3',
        kind: 'notice',
        after: 5,
        lines: [
          FE('Grafting is real, you know. Lots of fruit trees are grown this way.'),
          FE('You join a twig from one tree onto a young tree. The two grow together, and the new branch keeps the old tree’s ways.'),
          FE('Grudge has bitter bark. In a beetle year, that’s what helped it survive when the others didn’t.', 'soft'),
        ],
        parentNote: 'Learned about grafting, and that a trait like bitter bark can help a plant survive a pest.',
      },
      {
        domain: 'literacy',
        skill: 'understanding why a character changes their mind',
        standard: 'RL.3.3',
        kind: 'ask',
        after: 9,
        prompt: [N('Why did Byte change VOLATILE to FRIGHTENED?')],
        options: [
          {
            label: 'He understood that Ember’s anger was really fear.',
            best: true,
            reply: [
              N('Yes. At dusk, Byte saw Ember’s face in the firelight. She wasn’t wild. She was scared.'),
              N('The new label is fairer, and Ember knows it.'),
            ],
          },
          {
            label: 'He wanted to tease her.',
            reply: [
              N('The first label was a bit of a tease. But look what he writes underneath: (FAIR).'),
              N('He changed it because he understood her: her anger was really fear.'),
            ],
          },
          {
            label: 'He made a spelling mistake.',
            reply: [
              N('Byte never makes spelling mistakes. Just ask him.'),
              N('He changed it because he understood Ember better: her anger was really fear.'),
            ],
          },
        ],
        parentNote: 'Explained why a character changed his opinion of someone else.',
      },
    ],
  ),
];

const S11: EduQuest = {
  id: 'reader:s11',
  of: 's11',
  band: 'reader',
  title: 'The Blight',
  goals: {
    's11-step1': {
      goal: 'Go next door and look at the sick plum trees in Fern’s orchard.',
      hint: 'Go through the gap in the hedge, past Fern’s water butt. The sick trees are at the bottom of the slope.',
    },
    's11-step2': {
      goal: 'Check every tree in the orchard with Byte’s hand lens, and give it a label.',
      hint: 'Look at a leaf, the bark and the fruit of each tree. Then pick a label. Notice which way the wind blows.',
    },
    's11-step3': {
      goal: 'Catch one of the things riding the wind into the bottom row.',
      hint: 'Keep the sun in front of you (never look straight at it), so your shadow falls behind you. The bugs drop the moment your shadow touches them.',
    },
    's11-step4': {
      goal: 'Help Clover let her ladybirds go in the hedge where the beetles breed.',
      hint: 'Open Clover’s jar by the dead wild plum, or where it stood. Then step back and keep still.',
    },
  },
  scenes: S11_SCENES,
  glossary: [
    gloss('orchard', 'A field or garden of fruit trees.', 's11-fern'),
    gloss('fungus', 'A living thing, like a mushroom or mould, that is not a plant and feeds on living or dead things. More than one are fungi.', 's11-fern'),
    gloss('blight', 'A disease that makes plants wither, rot and die.', 's11-ember'),
    gloss('magnify', 'To make something look bigger than it really is.', 's11-lens'),
    gloss('volatile', 'Likely to flare up or explode suddenly, like a quick temper.', 's11-lens'),
    gloss('inconclusive', 'Not clear enough to decide yet.', 's11-map'),
    gloss('downwind', 'In the direction the wind is blowing towards.', 's11-map'),
    gloss('muslin', 'Thin cotton cloth with tiny gaps that let air through.', 's11-jar'),
    gloss('carrier', 'Something that carries a disease to others without being the disease itself.', 's11-beetle'),
    gloss('quarantine', 'Keeping sick living things apart from healthy ones so an illness can’t spread.', 's11-beetle'),
    gloss('evidence', 'Facts and things you have found that show what is true.', 's11-dusk'),
    gloss('predator', 'An animal that hunts and eats other animals.', 's11-ladybirds'),
    gloss('prey', 'An animal that is hunted and eaten by another animal.', 's11-ladybirds'),
    gloss('graft', 'To join a cutting from one plant onto another so they grow together.', 's11-complete'),
    gloss('warden', 'Someone whose job is to look after and protect a place.', 's11-complete'),
  ],
  notes:
    'Lessons: fungi and spores; telling a trusted person; 40 − 3; Ember’s motive; how a hand lens magnifies; mould safety; ' +
    'a two-step subtraction from the map; reading a downwind pattern; animals sensing shadows; which way a shadow falls; ' +
    'disease vs carrier; where “quarantine” comes from; ladybirds as predators; 4 × 7 spots; grafting and survival traits; ' +
    'why Byte changes his label. Think question (s11-dusk): is acting fast when you’re scared a good idea? Reader keeps all ' +
    'three dusk choices; every route still saves the orchard. Ladybirds on the thumb are four (one, then three more).',
};

// ================================================================== S15 Lucky Eggs
const S15_SCENES: EduScene[] = [
  // ------------------------------------------------ step 1 scene: the wagon
  scene(
    's15-wagon',
    [
      N('A wagon comes down the lane, striped red and cream. A hundred little bells on its roof ring at every pothole.'),
      N('On the driver’s seat sits a man in a mustard waistcoat. On his shoulder sits a brass parrot that ticks.'),
      DA('Children of the valley! Gather round! Dashwood Prance has come, and Dashwood Prance has brought you luck!', 'happy'),
      DA('Mystery Eggs! Ten Shells each! Every egg a winner! Some eggs more winner than others!', 'happy'),
      JP('MOST EGGS ARE PLAIN.'),
      DA('Thank you, Jackpot.', 'happy'),
      N('A poster unrolls down the side of the wagon in gold letters: 1 IN 3 SPARKLY! Underneath, much smaller: (approx.)'),
      N('In the window, on a velvet cushion, an egg glitters like frost on a web. Its card says LEGENDARY. NOT FOR SALE (YET).'),
      KD('Sparkly! Sparkly! Sparkly!', 'happy'),
      PI('I’ve got forty Shells. I’ve saved since my birthday. That’s four eggs. That’s one and a third sparkly!', 'happy'),
      N('Byte, the inventor Pixel’s husband, appears at your elbow with a clipboard. His shoelace is undone, as it was all the way down the aisle at his own wedding.'),
      N('He has the face of someone who has just heard maths done wrong.'),
      BY('One in three. Says who? I want to see it happen. Thirty eggs. We count every single one.', 'think'),
      BY('And while we count, read that poster again. Properly.'),
    ],
    [
      {
        domain: 'maths',
        skill: 'keeping a tally in bundles of five',
        standard: '3.MD.B.3',
        kind: 'do',
        after: 12,
        lines: [
          BY('We’ll keep a tally. One stroke for every egg, under PLAIN or SPARKLY.'),
          BY('Four strokes standing up. The fifth goes across them, like a gate. That’s a bundle of five.'),
          BY('Bundles are quick to count: five, ten, fifteen… Try it. Mark the first five plain eggs as one gate.'),
        ],
        check: 'edu:tally:eggs:gate-of-five',
        parentNote: 'Learned to keep a tally, bundling marks in fives so they are quick to count.',
      },
      {
        domain: 'literacy',
        skill: 'spotting the small print in an advert',
        kind: 'ask',
        after: 13,
        prompt: [BY('Which part of that poster should make you most careful?')],
        options: [
          {
            label: 'The tiny word (approx.).',
            best: true,
            reply: [
              BY('Yes. “Approx.” is short for approximately: roughly, more or less.', 'happy'),
              BY('Tiny writing under a big promise is a clue. It means: check before you believe it.'),
            ],
          },
          {
            label: 'The shiny gold letters.',
            reply: [
              BY('Gold letters are there to grab your eye. They’re not a lie, just a lot of shine.'),
              BY('The real clue is the tiny word: (approx.). It means “roughly”. Tiny writing under a big promise means: check.'),
            ],
          },
          {
            label: 'Nothing. Posters always tell the truth.',
            reply: [
              BY('Some do. But posters are made to make you buy. Some stretch the truth.', 'think'),
              BY('See the tiny word, (approx.)? It means “roughly”. Tiny writing under a big promise means: check.'),
            ],
          },
        ],
        parentNote: 'Looked closely at an advert and noticed how small print can soften a big promise.',
      },
    ],
    [
      {
        id: 'buy',
        label: 'Buy an egg yourself. For science.',
        set: { 's15-bought': true },
        then: [
          DA('A Keeper! A person of taste! Choose with your heart!', 'happy'),
          N('You choose with your heart. It’s plain. Jackpot looks at it and says nothing, very loudly.'),
          BY('That’s one. Twenty-nine to go. Don’t look like that. It’s data.'),
        ],
      },
      {
        id: 'pip',
        label: 'Ask Pip to wait before she spends it all.',
        set: { 's15-pip': 'asked' },
        then: [
          PI('Wait? The sparkly ones might run out!', 'shock'),
          DA('They might! They very well might! That’s the magic of a limited time!', 'happy'),
          JP('THEY WILL NOT RUN OUT.'),
        ],
      },
      {
        id: 'odds',
        label: 'Ask Dashwood where his odds come from.',
        set: { 's15-asked': true },
        then: [
          DA('From the heart, friend! From the very bottom of the heart, where the best numbers live!', 'happy'),
          BY('That is not where numbers live.', 'angry'),
        ],
      },
    ],
  ),
  // ------------------------------------------------ step 1 done: the tally
  scene(
    's15-tally',
    [
      N('By noon Byte’s card is full. Thirty eggs. Thirty faces, mostly falling.'),
      N('The tally says it all. PLAIN: five gates and two extra strokes. SPARKLY: three strokes.'),
      BY('Twenty-seven plain. Three sparkly. That isn’t one in three. Not even close.', 'think'),
      BY('The poster promised ten sparkly. We got three. Ten divided by three is three point three three three… and the threes go on forever.', 'angry'),
      BY('That’s called recurring. I’ve underlined it. Twice.'),
      N('Pip sits on the bridge with four plain eggs in her lap. She isn’t crying. She is being extremely brave at the water.'),
      PI('The plain ones are nice too. They’re warm.', 'sad'),
    ],
    [
      {
        domain: 'maths',
        skill: 'chance as a fraction: 3 in 30 is 1 in 10',
        standard: '3.NF.A.1',
        kind: 'ask',
        after: 2,
        prompt: [
          BY('Three sparkly in thirty eggs. Split the thirty into three equal groups of ten. One sparkly in each.'),
          BY('So what’s the real chance of a sparkly egg?'),
        ],
        options: [
          {
            label: '1 in 10',
            best: true,
            reply: [
              BY('Yes. 3 in 30 is the same as 1 in 10. As a fraction, one tenth: 1/10.', 'happy'),
              BY('The poster said 1 in 3. That would be ten sparkly in thirty. We saw three.'),
            ],
          },
          {
            label: '1 in 3',
            reply: [
              BY('That’s what the poster says. If it were true, we’d have seen ten sparkly in thirty.', 'think'),
              BY('We saw three. Three groups of ten, one sparkly in each: 1 in 10.'),
            ],
          },
          {
            label: '3 in 10',
            reply: [
              BY('That would be nine sparkly in thirty. We only saw three.'),
              BY('Three groups of ten, one sparkly in each: 1 in 10. One tenth.'),
            ],
          },
        ],
        parentNote: 'Read a tally chart and saw that 3 in 30 is the same chance as 1 in 10 (one tenth).',
      },
      {
        domain: 'sel',
        skill: 'helping a friend with disappointment',
        standard: 'CASEL: Social awareness',
        kind: 'ask',
        after: 6,
        prompt: [N('Pip is disappointed, and trying very hard to be brave. What might help her?')],
        options: [
          {
            label: 'Sit with her, and tell her it’s all right to feel disappointed.',
            best: true,
            reply: [
              N('Yes. You sit on the bridge beside her. Feelings are allowed, even the droopy ones.'),
              PI('…They are quite warm, though.', 'soft'),
            ],
          },
          {
            label: 'Tell her to cheer up.',
            reply: [
              N('People often say that. But it can make someone feel they’re not allowed to be sad.'),
              N('Sitting with her, and saying it’s all right to feel disappointed, helps more.'),
            ],
          },
          {
            label: 'Buy her another egg.',
            reply: [
              N('That’s a kind thought. But remember the tally: another egg would very likely be plain too.'),
              N('Sitting with her, and saying it’s all right to feel disappointed, might help most.'),
            ],
          },
        ],
        parentNote: 'Thought about how to comfort a friend who is disappointed.',
      },
    ],
  ),
  // ------------------------------------------------ step 2 scene: the sneak
  scene(
    's15-sneak',
    [
      BY('We need a witness. Someone who’s seen the books.', 'think'),
      BY('That parrot. Every time Dashwood says something untrue, it corrects him. I don’t think it can help it.'),
      N('After lunch the wagon goes quiet. The mustard waistcoat hangs over the step. Inside, a snore like a slow saw.'),
      N('Jackpot sits on a perch at the open window, ticking. His eyes are brass buttons. One is sewn back on with red thread.'),
      BY('Careful of the bells. Touch the wagon and they’ll all ring. Come round the stream side. There’s a gap where one fell off.', 'think'),
      N('Stepping stones lead along the stream. One wobbles. One is a frog.'),
    ],
    [
      {
        domain: 'literacy',
        skill: 'what a simile tells you',
        standard: 'L.4.5',
        kind: 'ask',
        after: 2,
        prompt: [N('Dashwood’s snore is “like a slow saw”. What does that tell you about it?')],
        options: [
          {
            label: 'It’s a long, rough, rasping sound.',
            best: true,
            reply: [
              N('Yes. A saw going slowly through wood goes rrrrasp… rrrrasp. So does Dashwood.'),
              N('Comparing two things with “like” or “as” is called a simile.'),
            ],
          },
          {
            label: 'He’s sawing wood in his sleep.',
            reply: [
              N('Ha! No. The snore only sounds like a saw. It’s a comparison.'),
              N('A slow saw goes rrrrasp, so the snore is long and rough. Comparing with “like” is a simile.'),
            ],
          },
          {
            label: 'It’s a very quiet snore.',
            reply: [
              N('A saw isn’t quiet. Think of the sound: rrrrasp… rrrrasp.'),
              N('So the snore is long and rough. Comparing with “like” is a simile.'),
            ],
          },
        ],
        parentNote: 'Worked out what a simile (“a snore like a slow saw”) tells the reader.',
      },
      {
        domain: 'science',
        skill: 'sound is made by vibration',
        standard: '1-PS4-1',
        kind: 'notice',
        after: 4,
        lines: [
          BY('A bell rings because it vibrates. It shivers, very fast, when something knocks it.', 'think'),
          BY('The shivers shake the air, and the air carries the sound to your ears.'),
          BY('Bump the wagon, and a hundred bells shiver at once. Hence: tiptoe.'),
        ],
        parentNote: 'Learned that a bell makes sound by vibrating, and the air carries the sound.',
      },
    ],
  ),
  // ------------------------------------------------ step 2 done: Jackpot
  scene(
    's15-jackpot',
    [
      JP('GOOD AFTERNOON. I CANNOT LIE. IT IS A FAULT IN MY SPRINGS.'),
      Y('How many eggs are sparkly, Jackpot?'),
      JP('ONE IN TEN. HE KNOWS. HE WROTE IT IN THE LEDGER IN VERY SMALL WRITING.'),
      BY('And the poster?', 'think'),
      JP('HE SAYS THE POSTER IS A POEM. I CANNOT LIE. A POEM IS NOT A NUMBER.'),
      Y('What happens to the eggs nobody buys?'),
      JP('THEY GO UP THE VALLEY. TO A MAN WHO BUYS IN BULK. HE NEVER HAGGLES. HE NEVER SMILES.'),
      N('Among the stickers on the tailboard, you notice one small, neat silver square: the mark of Corvin’s Circuit, up the valley.'),
      JP('ALSO THE LEGENDARY EGG IS NOT LEGENDARY. I HAVE TRIED NOT TO SAY THAT. IT IS VERY UNCOMFORTABLE.'),
      N('The snoring stops. You both freeze. It starts again.'),
    ],
    [
      {
        domain: 'maths',
        skill: 'multiplying by 10 in a money problem',
        standard: '3.OA.A.3',
        kind: 'ask',
        after: 2,
        prompt: [BY('This morning the children bought thirty eggs, at ten Shells each. How many Shells did Dashwood take?', 'think')],
        options: [
          {
            label: '300 Shells',
            best: true,
            reply: [BY('Yes. 30 × 10 = 300. Three hundred Shells, for three sparkly eggs.', 'angry')],
          },
          {
            label: '40 Shells',
            reply: [BY('That’s 30 + 10. But every one of the thirty eggs cost ten Shells.'), BY('Thirty lots of ten: 30 × 10 = 300.')],
          },
          {
            label: '30 Shells',
            reply: [BY('That would be one Shell an egg. They were ten each.'), BY('30 × 10 = 300 Shells.')],
          },
        ],
        parentNote: 'Multiplied 30 × 10 to work out money taken in a story problem.',
      },
      {
        domain: 'literacy',
        skill: 'telling a fact you can check from a claim you can’t',
        kind: 'ask',
        after: 4,
        prompt: [JP('I CANNOT LIE. WHICH OF THESE CAN BE CHECKED?')],
        options: [
          {
            label: '“One egg in ten is sparkly.”',
            best: true,
            reply: [
              JP('CORRECT. YOU COUNTED IT. A FACT CAN BE CHECKED.'),
              BY('Right. “Every egg a winner” is a feeling pretending to be a fact. You can’t measure it.', 'think'),
            ],
          },
          {
            label: '“Every egg a winner!”',
            reply: [
              JP('HOW WOULD YOU CHECK IT? WHAT IS A WINNER? HE NEVER SAYS.'),
              BY('That’s a feeling pretending to be a fact. “One in ten” is a fact: we counted it.'),
            ],
          },
          {
            label: '“Dashwood has brought you luck!”',
            reply: [
              JP('LUCK CANNOT BE WEIGHED. I HAVE TRIED.'),
              BY('That’s a claim you can’t check. “One in ten” is a fact: we counted it.'),
            ],
          },
        ],
        parentNote: 'Sorted a checkable fact from claims that can’t be checked.',
      },
    ],
  ),
  // ------------------------------------------------ step 3 scene: the Legendary egg
  scene(
    's15-legendary',
    [
      N('Dashwood wakes up exactly as charming as he went to sleep. He polishes the Legendary egg on his sleeve.'),
      DA('Admiring her? Course you are. Hold her if you like. One Shell a minute. Feel the luck soak in.', 'happy'),
      BY('Here’s three Shells. We’ll need exactly three minutes.', 'think'),
      N('Under the bridge it is dim and green, and smells of watercress. Byte lights the stub of a lantern.'),
      BY('Candling. Hazel showed everybody. Shine a light behind the egg, and you can see what’s growing.', 'think'),
      BY('A sparkly egg glows all through, like a pearl. A plain one shows a little curled shadow. This one… we’ll see.'),
    ],
    [
      {
        domain: 'maths',
        skill: 'time intervals: a quarter of an hour',
        standard: '3.MD.A.1',
        kind: 'ask',
        after: 2,
        prompt: [BY('One Shell a minute. How many Shells would it cost to hold her for a quarter of an hour?')],
        options: [
          {
            label: '15 Shells',
            best: true,
            reply: [BY('Yes. An hour is 60 minutes, so a quarter of an hour is 15. Fifteen Shells. I am not paying that.')],
          },
          {
            label: '4 Shells',
            reply: [BY('Four is how many quarters make an hour. But one quarter of 60 minutes is 15 minutes.'), BY('So, 15 Shells.')],
          },
          {
            label: '25 Shells',
            reply: [BY('Close-ish. An hour is 60 minutes. Split it into four equal parts: 15 each.'), BY('So, 15 Shells.')],
          },
        ],
        parentNote: 'Worked out that a quarter of an hour is 15 minutes.',
      },
      {
        domain: 'science',
        skill: 'candling: light passes through a thin eggshell',
        kind: 'notice',
        after: 4,
        lines: [
          BY('Farmers really do this with hens’ eggs. An eggshell is translucent: it lets some light through, but not a clear picture.'),
          BY('Shine a bright light behind it, and anything inside shows up as a shadow.'),
          BY('That’s why we’re under the bridge. In the dark, the glow is much easier to see.'),
        ],
        parentNote: 'Learned how candling works: a thin eggshell lets light through, showing shadows inside.',
      },
    ],
  ),
  // ------------------------------------------------ step 3 done: painted
  scene(
    's15-painted',
    [
      N('The light comes through the shell. The glitter on it throws stars all over the underside of the bridge.'),
      N('Under the glitter, the egg glows plain pink. Inside is a small curled shadow, and it’s moving.'),
      BY('Plain. It’s a plain egg, painted. There’s a thumbprint in the varnish. A big one.', 'shock'),
      BY('A healthy plain egg, mind. It’ll hatch in about a week. It just won’t be legendary. It’ll be a Nubbin.', 'soft'),
      BY('So the LEGENDARY card was a lie. And it’s still a perfectly good egg. Both of those are true.', 'think'),
      N('Glitter comes off on your fingers. It doesn’t come off for days.'),
    ],
    [
      {
        domain: 'literacy',
        skill: 'understanding a metaphor',
        standard: 'L.4.5',
        kind: 'ask',
        after: 0,
        prompt: [N('The glitter “throws stars” all over the bridge. Are there real stars under the bridge?')],
        options: [
          {
            label: 'No. It means little sparkles of light that look like stars.',
            best: true,
            reply: [N('Yes. Describing one thing as if it really were another is called a metaphor.')],
          },
          {
            label: 'Yes, real stars.',
            reply: [
              N('That would be a very crowded bridge! The sparkles only look like stars.'),
              N('Describing one thing as if it really were another is called a metaphor.'),
            ],
          },
          {
            label: 'Someone threw the glitter at the bridge.',
            reply: [
              N('Nobody threw anything. The light bounces off the glitter and makes little star-like sparkles.'),
              N('Describing one thing as if it really were another is called a metaphor.'),
            ],
          },
        ],
        parentNote: 'Explained what a metaphor (“throws stars”) means.',
      },
      {
        domain: 'science',
        skill: 'what grows inside an egg',
        standard: '3-LS1-1',
        kind: 'notice',
        after: 3,
        lines: [
          BY('That curled shadow is the baby growing inside. In a bird’s egg it’s called an embryo.', 'soft'),
          BY('It feeds on the yolk while it grows. When it’s big enough, it hatches, and a new life cycle begins.'),
        ],
        parentNote: 'Learned that an embryo grows inside an egg, fed by the yolk, as part of a life cycle.',
      },
    ],
  ),
  // ------------------------------------------------ step 4 scene: the verdict
  scene(
    's15-verdict',
    [
      N('You come back up the bank with glitter on your hands. Dashwood sees it, and his smile stays exactly where it is.'),
      N('He steers you round the back of the wagon, where the children can’t see, and sits down on the step.'),
      DA('When I was eight, a man came through my village with a wagon. Not as nice as mine.', 'soft'),
      DA('He sold me a golden egg for every Shell I had. I carried it home in my hat. I slept curled round it like a cat.', 'soft'),
      DA('It hatched brown. Brown as a boot. It had been painted.', 'think'),
      DA('And I loved that brown thing more than anything since. The best week of my life was the week before it hatched.', 'happy'),
      DA('That’s what I sell, friend. Not eggs. The week before.', 'soft'),
      JP('HE BELIEVES THIS. I CANNOT LIE. HE DOES.'),
      N('Round the front of the wagon, the children are waiting. Pip holds her four plain eggs. Byte holds the tally.'),
    ],
    [
      {
        domain: 'literacy',
        skill: 'understanding a character’s motive from his past',
        standard: 'RL.3.3',
        kind: 'ask',
        after: 6,
        prompt: [N('What does Dashwood mean when he says he sells “the week before”?')],
        options: [
          {
            label: 'The exciting feeling of waiting and hoping.',
            best: true,
            reply: [
              N('Yes. That happy, fizzy, waiting feeling has a name: anticipation.'),
              N('Dashwood had it once, as a boy. He’s been trying to sell it ever since.'),
            ],
          },
          {
            label: 'Eggs that are a week old.',
            reply: [
              N('Not quite. Think about his story. The best week was the one before his egg hatched.'),
              N('He means the fizzy feeling of hoping. That feeling is called anticipation.'),
            ],
          },
          {
            label: 'Nothing. He’s making it up.',
            reply: [
              N('Jackpot says he believes it, and Jackpot can’t lie.'),
              N('He means the fizzy feeling of waiting and hoping. That feeling is called anticipation.'),
            ],
          },
        ],
        parentNote: 'Used a character’s childhood story to understand why he does what he does.',
      },
      {
        domain: 'sel',
        skill: 'thinking about honesty and fairness in selling',
        standard: 'CASEL: Responsible decision-making',
        kind: 'ask',
        after: 8,
        prompt: [
          N('Dashwood sells hope, and he really believes in it. But his poster wasn’t true.'),
          N('What do you think? Is it fair to sell hope with a poster that isn’t true?'),
        ],
        options: [
          {
            label: 'No. People should know the real odds, and then choose.',
            reply: [
              N('That’s a fair answer. Byte would agree: Pip spent her birthday Shells on a promise that wasn’t true.'),
              N('Knowing the truth lets people make their own choice.'),
            ],
          },
          {
            label: 'Maybe. People enjoyed the hoping.',
            reply: [
              N('That’s a fair answer too. Dashwood’s best week ever was a week of hoping.'),
              N('Byte would ask: would Pip still have bought four eggs, if she’d known it was 1 in 10?'),
            ],
          },
          {
            label: 'He could sell the hope, and tell the truth.',
            reply: [
              N('That’s a thoughtful answer. Maybe the week before is just as lovely when you know the odds.'),
              N('An honest stall might be the way to find out.'),
            ],
          },
        ],
        parentNote: 'Thought about whether hope can be sold fairly when the advertising isn’t true.',
      },
    ],
    [
      {
        id: 'expose',
        label: 'Show everyone the tally and the painted egg.',
        set: { 's15-verdict': 'exposed' },
        then: [
          N('You climb on the wagon step and hold up the painted egg. Byte reads the tally aloud, slowly, including the recurring.'),
          KD('ONE IN TEN?', 'angry'),
          N('The roof bells ring as children kick the wheels. Dashwood’s smile finally goes, and something small looks out from behind it.'),
          DA('It was a poem. It was only ever a poem.', 'sad'),
          N('He drives off before dark. He leaves his spare trestle, a crate of eggs, and the parrot, who refuses to get on.'),
          JP('I CANNOT LIE. I DID NOT WANT TO GO.'),
        ],
      },
      {
        id: 'refund',
        label: 'Make him post the true odds and give the children their Shells back.',
        set: { 's15-verdict': 'refunded' },
        then: [
          DA('Refunds? Refunds! Do you know what that does to a man’s margins?', 'shock'),
          JP('HIS MARGINS ARE ENORMOUS.'),
          N('Dashwood counts Shells back into small hands, one by one. He does it with a flourish. He can’t help that either.'),
          N('He paints out the 3 on his poster and paints in a 10. Then, after a long look, he adds: STILL WORTH IT.'),
          PI('I’m keeping one egg. I want to see what comes out. I don’t mind if it’s plain.', 'happy'),
          N('He leaves the valley the next morning with a lighter crate. The parrot stays, by very honest agreement.'),
        ],
      },
      {
        id: 'buy',
        label: 'Buy his wagon, and run an honest stall yourself.',
        set: { 's15-verdict': 'bought' },
        then: [
          DA('Buy her? Buy Marigold? You don’t buy a wagon, friend. You marry it.', 'shock'),
          DA('…How much were you thinking?', 'think'),
          N('It takes most of an afternoon and most of your Shells. Byte does the haggling. Byte enjoys it far too much.'),
          DA('Paint the stripes once a year. She likes a polish. And never, ever let her near a goat.', 'sad'),
          N('He walks off down the lane with his hands in his pockets, whistling, lighter than he came.'),
        ],
      },
    ],
  ),
  // ------------------------------------------------ step 4 done: the odds board
  scene(
    's15-odds-board',
    [
      N('Byte nails up a slate. He chalks it in big, honest numbers: PLAIN 9 IN 10. SPARKLY 1 IN 10. LEGENDARY: NO.'),
      N('Underneath, smaller: ALL OF THEM ARE WARM.'),
      PI('Those are worse odds. Why do I like it better?', 'think'),
      BY('Because you know where you are. Knowing where you are is the second-best feeling there is. After winning.', 'happy'),
      N('The children queue anyway. Some buy. Some just come to read the board.'),
      PI('Gran gave me ten Shells, for being brave about the eggs. An egg, or a bag of honey drops for the walk home?', 'think'),
    ],
    [
      {
        domain: 'maths',
        skill: 'tenths that make a whole',
        standard: '3.NF.A.1',
        kind: 'ask',
        after: 1,
        prompt: [BY('9 in 10 plain. 1 in 10 sparkly. Nine tenths and one tenth. What do they make together?')],
        options: [
          {
            label: 'Ten tenths: one whole. Every egg.',
            best: true,
            reply: [BY('Yes. 9/10 + 1/10 = 10/10, which is one whole. Every egg is either plain or sparkly.', 'happy')],
          },
          {
            label: 'Ten twentieths.',
            reply: [
              BY('Careful. When the bottom numbers match, you only add the top numbers. Tenths stay tenths.'),
              BY('9/10 + 1/10 = 10/10: one whole. Every egg.'),
            ],
          },
          {
            label: 'Half the eggs.',
            reply: [BY('Half would be five tenths. Nine and one make ten tenths: the whole crate.'), BY('Every egg is plain or sparkly.')],
          },
        ],
        parentNote: 'Added tenths (9/10 + 1/10) to see that they make one whole.',
      },
      {
        domain: 'social-studies',
        skill: 'scarcity: having only so much means choosing',
        standard: 'D2.Eco.1.K-2',
        kind: 'notice',
        after: 5,
        lines: [
          BY('Ten Shells can be an egg, or honey drops. Not both. When you only have so much, you have to choose.', 'think'),
          BY('That’s why true numbers matter. You can’t choose well if the board is telling you a poem.'),
        ],
        parentNote: 'Learned that having limited money means choosing, and that honest information helps people choose.',
      },
    ],
  ),
  // ------------------------------------------------ complete
  scene(
    's15-complete',
    [
      N('The last egg in the crate is wrapped in a red spotted handkerchief. It glows all through, like a pearl in a lamp.'),
      JP('THAT ONE IS REAL. I CANNOT LIE. I CHECKED. I CHECKED TWICE.'),
      N('Tucked in the knot is a card in loopy gold writing: “For the Keeper. Every egg a winner. This one actually. —D.P.”'),
      BY('Statistically, that’s the only certain thing he ever sold.', 'soft'),
      N('Jackpot hops onto your shoulder. He ticks. He weighs about as much as a teapot.'),
      JP('I WOULD LIKE TO LIVE WITH YOU. I CANNOT LIE. I HAVE WANTED TO SAY THAT FOR A WHILE.'),
      N('On his way out, Dashwood pushed the painted egg into Pip’s hands. She hasn’t let go of it since.'),
      N('Pip carries the painted egg home in her hat. A week later it hatches, brown as a boot.'),
      N('She loves it beyond all reason.'),
    ],
    [
      {
        domain: 'maths',
        skill: 'the language of chance: certain, unlikely, impossible',
        kind: 'ask',
        after: 3,
        prompt: [BY('Chance words. Picking a sparkly egg from Dashwood’s full crate, with your eyes shut. Was it…'), BY('certain, unlikely or impossible?')],
        options: [
          {
            label: 'Unlikely.',
            best: true,
            reply: [
              BY('Yes. 1 in 10 is unlikely, but not impossible. Three children did get one.', 'happy'),
              BY('This egg, checked twice? Certain. That’s the difference.'),
            ],
          },
          {
            label: 'Certain.',
            reply: [BY('Certain means it must happen. Twenty-seven of the thirty eggs were plain, so it wasn’t certain.'), BY('1 in 10 is unlikely.')],
          },
          {
            label: 'Impossible.',
            reply: [BY('Impossible means it can never happen. But three children did get sparkly ones.'), BY('1 in 10 is unlikely, not impossible.')],
          },
        ],
        parentNote: 'Used the words certain, unlikely and impossible to describe chance.',
      },
      {
        domain: 'literacy',
        skill: 'finding the theme of a story',
        standard: 'RL.4.2',
        kind: 'ask',
        after: 8,
        prompt: [N('Pip loves her plain brown Nubbin beyond all reason. What do you think this story is saying?')],
        options: [
          {
            label: 'Plain things can be precious, and the truth is worth knowing.',
            best: true,
            reply: [N('Yes. That big idea is the story’s theme. Pip knew the truth, chose anyway, and loves what she got.')],
          },
          {
            label: 'Sparkly things are always best.',
            reply: [
              N('Dashwood might say so! But look at Pip. Her plain brown Nubbin is the thing she loves most.'),
              N('The story’s big idea, its theme, is that plain things can be precious, and the truth is worth knowing.'),
            ],
          },
          {
            label: 'Never buy an egg.',
            reply: [
              N('The children still buy eggs at the honest stall. They just know the odds now.'),
              N('The story’s big idea, its theme, is that plain things can be precious, and the truth is worth knowing.'),
            ],
          },
        ],
        parentNote: 'Worked out the theme, the big idea, of a story.',
      },
    ],
  ),
];

const S15: EduQuest = {
  id: 'reader:s15',
  of: 's15',
  band: 'reader',
  title: 'Lucky Eggs',
  goals: {
    's15-step1': {
      goal: 'Help Byte keep a tally of what comes out of thirty Mystery Eggs.',
      hint: 'Stand by the wagon. Each time a child opens an egg, make a mark under PLAIN or SPARKLY. Bundle your marks in fives.',
    },
    's15-step2': {
      goal: 'Get Jackpot on his own and ask him some questions.',
      hint: 'Dashwood naps after lunch. Creep along the stream side of the wagon, where a bell has fallen off. Don’t touch the wheels.',
    },
    's15-step3': {
      goal: 'Shine a lantern through the Legendary egg and see what’s really inside.',
      hint: 'This is called candling. It works best somewhere dim. Try under the bridge.',
    },
    's15-step4': {
      goal: 'Set up an honest egg stall with Byte, and chalk up the real odds.',
      hint: 'Byte has a slate and chalk. Put the stall by the bridge or at your gate, and write the true numbers on the board.',
    },
  },
  scenes: S15_SCENES,
  glossary: [
    gloss('approximately', 'Roughly; close to a number, but not exactly. Often shortened to “approx.”', 's15-wagon'),
    gloss('legendary', 'So special or famous that people tell stories about it.', 's15-wagon'),
    gloss('tally', 'A quick way of counting by making a mark for each thing, in bundles of five.', 's15-tally'),
    gloss('recurring', 'Happening again and again. A recurring number repeats forever, like 3.333…', 's15-tally'),
    gloss('witness', 'Someone who saw or knows what really happened.', 's15-sneak'),
    gloss('ledger', 'A book where someone writes down money and things bought and sold.', 's15-jackpot'),
    gloss('bulk', 'A very large amount, bought all at once.', 's15-jackpot'),
    gloss('candling', 'Shining a light through an egg to see what is growing inside.', 's15-legendary'),
    gloss('translucent', 'Letting some light through, but not clearly enough to see through.', 's15-legendary'),
    gloss('varnish', 'A clear, shiny coat painted on to protect something or make it gleam.', 's15-painted'),
    gloss('embryo', 'A baby animal in its very first stage, before it is born or hatched.', 's15-painted'),
    gloss('anticipation', 'The excited feeling of waiting for something you are looking forward to.', 's15-verdict'),
    gloss('margin', 'The money a seller keeps after paying for what they sell.', 's15-verdict'),
    gloss('odds', 'How likely something is to happen, like 1 in 10.', 's15-odds-board'),
    gloss('statistically', 'Going by the numbers you have counted.', 's15-complete'),
    gloss('certain', 'Sure to happen.', 's15-complete'),
  ],
  notes:
    'Lessons: keeping a tally in fives; spotting small print in an advert; 3 in 30 = 1 in 10 (one tenth); comforting a ' +
    'disappointed friend; simile; sound and vibration (the bells); 30 × 10 Shells; fact vs uncheckable claim; a quarter of ' +
    'an hour; candling and translucent shells; metaphor; embryo and yolk; Dashwood’s motive (anticipation); 9/10 + 1/10; ' +
    'scarcity and choosing; certain/unlikely/impossible; theme. Think question (s15-verdict): is it fair to sell hope with a ' +
    'poster that isn’t true? Byte no longer says “one in ten” himself in s15-tally, so the child can work it out. The “bought” ' +
    'choice is still gated on 150+ Shells by the sim, as in the main scene.',
};

// ================================================================== S16 The Workyard
const S16_SCENES: EduScene[] = [
  // ------------------------------------------------ step 1 scene: Sparks
  scene(
    's16-sparks',
    [
      N('Sparks turns up with a coil of wire over each shoulder, like a very small, very loud pirate electrician.'),
      SP('Job upriver! A big one! A sawmill wants lights in every shed. I need someone to hold the ladder and say “wow”.', 'happy'),
      SP('The owner’s called Brisk Hollins. Nice man. Very nice. Suspiciously cheerful.'),
      SP('I’ve brought Clover. She looks after the gentlest Nubbins in the valley. She’s good with ladders.'),
      CL('I’m not good with ladders. I’m good at not falling off them. It’s different.', 'think'),
      N('The river path is soft after the rain. Somewhere ahead the saws are going: a bright, busy whine, like wasps in a jar.'),
      SP('He says his Nubbins love it there. Love it! He wrote it in his letter twice, and underlined it both times.'),
      CL('Twice is a lot of underlining.', 'think'),
    ],
    [
      {
        domain: 'science',
        skill: 'sound bends round things; light travels in straight lines',
        standard: '4-PS3-2',
        kind: 'notice',
        after: 5,
        lines: [
          CL('Funny. We can hear the saws, but we can’t see them.', 'think'),
          SP('Sound spreads out and bends round trees and corners. Light goes in straight lines, so the trees block the view.', 'happy'),
          SP('That’s why you hear a sawmill long before you see it. Same with thunder. And me.'),
        ],
        parentNote: 'Learned that sound can travel round obstacles, while light travels in straight lines.',
      },
      {
        domain: 'literacy',
        skill: 'reading between the lines',
        standard: 'RL.3.3',
        kind: 'ask',
        after: 7,
        prompt: [CL('Why does Clover think twice is a lot of underlining?')],
        options: [
          {
            label: 'When someone insists very hard, something might not be quite right.',
            best: true,
            reply: [
              N('Yes. Clover is reading between the lines: noticing what the words don’t say.'),
              N('If the Nubbins really loved it, would Brisk need to underline it twice?'),
            ],
          },
          {
            label: 'She thinks underlining is untidy.',
            reply: [
              N('Ha. Maybe! But Clover is noticing something else.'),
              N('When someone insists very hard, it can be a clue that something isn’t quite right. That’s reading between the lines.'),
            ],
          },
          {
            label: 'She doesn’t like Brisk.',
            reply: [
              N('She hasn’t met him yet! She’s noticing a clue in his letter.'),
              N('When someone insists very hard, it can mean something isn’t quite right. That’s reading between the lines.'),
            ],
          },
        ],
        parentNote: 'Noticed a clue in how something was written, not just what it said.',
      },
    ],
  ),
  // ------------------------------------------------ step 1 done: the yard
  scene(
    's16-yard',
    [
      N('The Workyard opens out at a bend in the river. Sheds, log piles, a waterwheel that isn’t turning, and Nubbins. Dozens.'),
      N('Each one wears a tiny hard hat made from half a walnut shell, painted yellow. They chop, they stack, they haul.'),
      N('Over the gate, a banner says WORK IS PLAY! In the middle of the yard, three Nubbins run inside a big wooden treadwheel.'),
      N('Wires run from the treadwheel to every shed. Every bulb in the yard flickers in time with their feet.'),
      BK('Welcome! Brisk Hollins. Pleased as punch. Output’s up this month. More logs than ever!', 'happy'),
      BK('I’m not like Corvin up at the Circuit, mind. My Nubbins get Sundays off.', 'happy'),
      N('A big Power Nubbin trundles past with a log three times his size on his back, humming. His hat says LUG in pencil.'),
      BK('That’s Lug. Best worker I’ve got. Can’t stop him. Tried once. He sulked for a week.', 'happy'),
      N('Behind the log pile sit five Nubbins. Their colours have worn grey at the edges, like a flag left out all summer.'),
      CL('Those ones are tired. Not lazy. Tired.', 'soft'),
    ],
    [
      {
        domain: 'science',
        skill: 'a device that changes energy from one form to another',
        standard: '4-PS3-4',
        kind: 'ask',
        after: 3,
        prompt: [N('Why do the bulbs flicker in time with the Nubbins’ feet?')],
        options: [
          {
            label: 'Their running turns the wheel, and the wheel makes the electricity.',
            best: true,
            reply: [
              SP('Yes! The energy changes form: running feet, turning wheel, electricity, light.', 'happy'),
              SP('Every step is a push. Between pushes the wheel slows a bit, so the lights flicker.'),
            ],
          },
          {
            label: 'The bulbs are dancing.',
            reply: [
              SP('I wish! No. The running feet turn the wheel, and the wheel makes the electricity.'),
              SP('Energy changes form: moving feet, turning wheel, electricity, light. Each push makes a flicker.'),
            ],
          },
          {
            label: 'The wind is blowing the wires.',
            reply: [
              SP('Good guess, but the flicker matches their feet exactly. The running turns the wheel, and the wheel makes the electricity.'),
              SP('Energy changes form: moving feet, turning wheel, electricity, light.'),
            ],
          },
        ],
        parentNote: 'Explained how a treadwheel changes movement energy into electricity and then light.',
      },
      {
        domain: 'sel',
        skill: 'reading how someone feels from their body',
        standard: 'CASEL: Social awareness',
        kind: 'notice',
        after: 9,
        lines: [
          CL('Look at how they sit. Slumped. Eyes half shut. Colours faded. Bodies tell you a lot, if you look.', 'soft'),
          CL('Lazy means not wanting to. Tired means your body can’t any more. They need different things.'),
        ],
        parentNote: 'Learned to notice how someone feels by looking at their body, and that tired is not the same as lazy.',
      },
    ],
  ),
  // ------------------------------------------------ step 2 scene: shadowing
  scene(
    's16-shadow',
    [
      BK('Tired? Nonsense! Look at the chart!', 'happy'),
      N('He unrolls a chart. A red line climbs so steeply it runs off the paper and carries on, in pencil, across the table.'),
      CL('That chart is about logs. I’m asking about them.', 'think'),
      BK('Same thing! Happy Nubbins, happy logs. The logs are very happy.', 'happy'),
      SP('Brisk. When nobody’s telling them what to do, what do they do?', 'think'),
      N('Brisk opens his mouth to answer. He shuts it again. He has clearly never once wondered.'),
      BK('…Well. Good question. Splendid question. Find out! Have a clipboard. I’ve got forty.', 'think'),
      N('He hands you a clipboard. Then another, in case. Then a third.'),
      CL('We’ve only got two hands each, Brisk.', 'think'),
      BK('Then you’ll want a spare.', 'happy'),
      CL('Observe them from where they can’t see you. If they know they’re watched, they’ll work to be polite. Nubbins are like that.', 'soft'),
    ],
    [
      {
        domain: 'maths',
        skill: 'a graph only shows what it measures',
        standard: '3.MD.B.3',
        kind: 'ask',
        after: 2,
        prompt: [N('Look at the labels on Brisk’s chart. What does it actually measure?')],
        options: [
          {
            label: 'How many logs get made.',
            best: true,
            reply: [
              CL('Yes. A chart can only tell you about the thing it counts.', 'soft'),
              CL('This one counts logs. It can’t tell you how a single Nubbin feels.'),
            ],
          },
          {
            label: 'How happy the Nubbins are.',
            reply: [
              CL('That’s what Brisk thinks it shows. But read the labels: LOGS, and WEEKS.'),
              CL('A chart can only tell you about the thing it counts. This one counts logs, not feelings.'),
            ],
          },
          {
            label: 'How long the table is.',
            reply: [
              CL('Ha. The line does run all the way across it. But read the labels: LOGS, and WEEKS.'),
              CL('A chart only tells you about the thing it counts. This one counts logs.'),
            ],
          },
        ],
        parentNote: 'Read a graph’s labels to see what it does and doesn’t measure.',
      },
      {
        domain: 'science',
        skill: 'observing animals without changing what they do',
        kind: 'notice',
        after: 10,
        lines: [
          CL('Scientists who study wild animals often watch from a hide: a little hut or screen the animals can’t see into.', 'soft'),
          CL('That way the animals behave as they really would. And the notes are true.'),
        ],
        parentNote: 'Learned that scientists observe animals from hiding so the animals behave naturally.',
      },
    ],
    [
      {
        id: 'lug',
        label: 'Start with Lug.',
        set: { 's16-first': 'lug' },
        then: [N('Lug puts down a log, sees you, and at once picks up a bigger one, to show you. You’ll need to be sneakier.')],
      },
      {
        id: 'tired',
        label: 'Start with the tired ones behind the log pile.',
        set: { 's16-first': 'tired' },
        then: [CL('Good. Start with the ones nobody’s counting.', 'soft')],
      },
      {
        id: 'wheel',
        label: 'Start with the treadwheel.',
        set: { 's16-first': 'wheel' },
        then: [SP('The wheel. Yeah. That thing’s bothered me since we walked in. It’s wired backwards, for a start.', 'angry')],
      },
    ],
  ),
  // ------------------------------------------------ step 2 done: the notes
  scene(
    's16-notes',
    [
      N('By sundown your clipboard is full of small handwriting and one large sawdust thumbprint.'),
      N('You watched eight Nubbins. Here is what each one chose, when nobody was asking.'),
      N('The two choppers chop on their breaks too. They like the thunk. One chops the same stump all day, very happily, for no reason.'),
      N('The stacker stacks. The two wheel runners step out the moment Brisk turns his back, and sit under the bench with their eyes shut.'),
      N('The two tired ones you watched never once choose work. They lie in a patch of sun and watch the river go by.'),
      N('And Lug, on his breaks, carries offcuts. Not to the stack. Out to the bank, behind the reeds, one at a time.'),
      N('You follow him. In the reeds stands a little lean-to of planks and bark, roofed with moss. All five tired ones are asleep inside.'),
      CL('He built them a house.', 'shock'),
      SP('Nobody asked him to. He just… did.', 'soft'),
    ],
    [
      {
        domain: 'literacy',
        skill: 'using evidence to explain a character’s actions',
        standard: 'RL.3.3',
        kind: 'ask',
        after: 8,
        prompt: [N('Why do you think Lug built the lean-to?')],
        options: [
          {
            label: 'He saw the tired ones needed somewhere to rest, and he cared.',
            best: true,
            reply: [
              N('Yes. The evidence: he carried the wood on his own breaks, one piece at a time, and nobody asked.'),
              N('Lug never speaks. His actions say it for him.'),
            ],
          },
          {
            label: 'Brisk told him to.',
            reply: [
              N('Look at the evidence: Sparks says nobody asked Lug. Brisk didn’t even know it was there.'),
              N('Lug saw the tired ones needed somewhere to rest, and he cared.'),
            ],
          },
          {
            label: 'He wanted to show off.',
            reply: [
              N('Show-offs like an audience. Lug hid the lean-to behind the reeds.'),
              N('He saw the tired ones needed somewhere to rest, and he cared. His actions say it for him.'),
            ],
          },
        ],
        parentNote: 'Used evidence from the story to explain why a character did something.',
      },
      {
        domain: 'maths',
        skill: 'turning notes into a bar chart and reading it',
        standard: '3.MD.B.3',
        kind: 'do',
        after: 8,
        lines: [
          N('Turn your clipboard into a bar chart. One bar for each choice: CHOP 2, STACK 1, REST 4, CARRY 1.'),
          N('Which bar is tallest? REST: four of the eight Nubbins. Four out of eight is one half.'),
          N('Half the Nubbins you watched chose rest, when nobody was asking.'),
        ],
        check: 'edu:chart:bar:nubbin-choices',
        parentNote: 'Made a bar chart from observation notes, found the tallest bar, and saw that 4 out of 8 is one half.',
      },
    ],
  ),
  // ------------------------------------------------ step 3 scene: the roster
  scene(
    's16-roster',
    [
      N('You show Brisk the clipboard, and then the lean-to in the reeds. He stands in the wet grass a long time.'),
      BK('I thought they loved it. They looked like they loved it. They were always so busy.', 'sad'),
      BK('…Busy isn’t the same thing, is it.', 'think'),
      N('He takes down WORK IS PLAY! and puts up a new banner: WORK IS… OFTEN PLAY!'),
      SP('That’s worse.', 'think'),
      BK('I know. I’m working on it.', 'sad'),
      SP('Right. That treadwheel’s coming off the wires. Your lights go on the waterwheel. Like a normal person’s.', 'happy'),
      SP('And a river never gets tired. It just keeps coming.'),
      CL('And every Nubbin gets a card on a roster, under the job it picked. And breaks. With fruit.', 'soft'),
      BK('And the ones who don’t want a job at all? What then? What’s a yard for?', 'shock'),
      N('Nobody answers. Brisk puts up another banner: REST IS A KIND OF WORK?? It has two question marks.'),
    ],
    [
      {
        domain: 'health',
        skill: 'why bodies need rest, food and water',
        kind: 'ask',
        after: 8,
        prompt: [CL('Why do you think workers need breaks, with fruit?', 'soft')],
        options: [
          {
            label: 'Working tires your muscles. Rest, food and water help your body recover.',
            best: true,
            reply: [CL('Yes. Muscles get tired when they work hard. Rest lets them recover, and food and water refuel you.', 'happy')],
          },
          {
            label: 'Breaks are just for being lazy.',
            reply: [
              CL('Lots of people think that. But a tired body works badly, and can get hurt.', 'soft'),
              CL('Rest lets tired muscles recover, and food and water refuel you.'),
            ],
          },
          {
            label: 'Only weak workers need breaks.',
            reply: [
              CL('Even the strongest runners rest between races. Even Lug.', 'soft'),
              CL('Every body’s muscles get tired. Rest lets them recover, and food and water refuel you.'),
            ],
          },
        ],
        parentNote: 'Learned that rest, food and water help a tired body recover.',
      },
    ],
  ),
  // ------------------------------------------------ step 3 done: the bell
  scene(
    's16-bell',
    [
      N('By evening the Fair Roster hangs by the gate: a board of little painted cards, one for every Nubbin, under the job it chose.'),
      N('Beside it hangs a small brass bell, low enough for the smallest Nubbin to reach. Clover has painted on it: NO THANK YOU.'),
      N('The big treadwheel stands still. Sparks has hung a sign on it: RETIRED. A Nubbin is already asleep inside it.'),
      N('A wheel runner waddles to the bell. It looks round at everyone. Then it rings it. Once. Very softly.'),
      N('Then it goes and sits in the sun. Nobody stops it. It looks astonished.'),
      BK('Well, I never. Output’s going to be awful.', 'shock'),
      N('He beams.'),
      BK('And I don’t mind one bit. I’m quite shocked at myself.', 'happy'),
    ],
    [
      {
        domain: 'social-studies',
        skill: 'fair rules work for everyone',
        standard: 'D2.Civ.8.K-2',
        kind: 'ask',
        after: 1,
        prompt: [N('Why did Clover hang the bell so low?')],
        options: [
          {
            label: 'So everyone, even the smallest Nubbin, can use it.',
            best: true,
            reply: [N('Yes. A rule is only fair if everyone can use it. A bell the small ones can’t reach would be no use to them.')],
          },
          {
            label: 'So nobody steals it.',
            reply: [
              N('A low bell is actually easier to take! Clover had a better reason.'),
              N('She wanted everyone, even the smallest Nubbin, to reach it. A fair rule works for everybody.'),
            ],
          },
          {
            label: 'Because Clover is short.',
            reply: [
              CL('I heard that.', 'think'),
              N('She hung it low so everyone, even the smallest Nubbin, could reach it. A fair rule works for everybody.'),
            ],
          },
        ],
        parentNote: 'Thought about why fair rules must work for everyone, including the smallest.',
      },
      {
        domain: 'sel',
        skill: 'saying no, and having it respected',
        standard: 'CASEL: Relationship skills',
        kind: 'notice',
        after: 4,
        lines: [
          CL('The wheel runner looks surprised because nobody ever listened to its “no” before.', 'soft'),
          CL('Saying no is allowed. When you ask first, and listen to the answer, that’s called consent.'),
          CL('It goes for people too. Your body, your answer. And a good friend listens.', 'soft'),
        ],
        parentNote: 'Learned that saying no is allowed, and that asking first and listening is called consent.',
      },
    ],
  ),
  // ------------------------------------------------ step 4 scene: Brisk’s question
  scene(
    's16-question',
    [
      N('Brisk walks you to the river path, hands in his pockets. He has a new slogan in his head. You can tell.'),
      BK('Can I ask you something, Keeper? Honestly? Your lot at the Grove. They fetch you things, don’t they?', 'think'),
      BK('Apples. Sticks. Do you ask them? Or do they just do it, because you’re the one who feeds them?', 'think'),
      N('You think of your Nubbins dragging fallen apples to your door. How pleased they look. How pleased you look back.'),
      Y('I don’t know.'),
      BK('No. Me neither. If they like you, you can’t tell if they’re choosing, or just being kind.', 'sad'),
      BK('Now. The five in the reeds. They don’t want to work. Not a bit. What do I do with them?', 'think'),
    ],
    [
      {
        domain: 'science',
        skill: 'what animals need to be well',
        standard: 'K-LS1-1',
        kind: 'notice',
        after: 2,
        lines: [
          N('Real working animals, like sheepdogs and horses, need more than food.'),
          N('They need water, shelter, rest, a chance to play, and someone who notices how they are feeling.'),
        ],
        parentNote: 'Learned that working animals need water, shelter, rest and play, not just food.',
      },
      {
        domain: 'sel',
        skill: 'thinking about fairness and consent for animals',
        standard: 'CASEL: Responsible decision-making',
        kind: 'ask',
        after: 5,
        prompt: [
          N('Brisk has asked a hard question. When an animal does a job because you feed it, is it really choosing?'),
          N('What do you think?'),
        ],
        options: [
          {
            label: 'Yes. If it looks happy, it’s choosing.',
            reply: [
              N('That’s a fair answer. Lug really does love carrying logs.'),
              N('Clover would add: the NO THANK YOU bell is how you find out for sure.'),
            ],
          },
          {
            label: 'Not always. It might just want the food.',
            reply: [
              N('That’s a fair point. Brisk’s Nubbins looked busy, and some of them were worn out.'),
              N('Asking, and listening for a no, is how you find out.'),
            ],
          },
          {
            label: 'You can’t know unless it’s allowed to say no.',
            reply: [
              N('That’s a thoughtful answer. It’s exactly what the bell is for.'),
              N('A yes only really counts if no was allowed too.'),
            ],
          },
        ],
        parentNote: 'Thought about whether an animal that works for food is really choosing, and why a “no” must be allowed.',
      },
    ],
    [
      {
        id: 'grove',
        label: 'Send them to the Grove. They can rest with you.',
        set: { 's16-tired': 'grove' },
        then: [
          BK('…Yes. Yes, that’s kind. Lug will want to visit. Lug will want to carry them there.', 'soft'),
          N('Lug, who has been listening, is already lifting the whole lean-to off the ground, with them inside it.'),
        ],
      },
      {
        id: 'morale',
        label: 'Keep them on, as “morale officers”.',
        set: { 's16-tired': 'morale' },
        then: [
          BK('Morale officers! Officially in charge of sitting in the sun and being lovely. Yes!', 'happy'),
          CL('They’ll be the best in the yard at it. Leave them where Lug can see them.', 'soft'),
          SP('Are we sure that isn’t just a job with a nicer hat?', 'think'),
        ],
      },
      {
        id: 'wild',
        label: 'Let them go wild, up the river.',
        set: { 's16-tired': 'wild' },
        then: [
          BK('Wild? Out there? Who’ll feed them? Who’ll—', 'shock'),
          CL('They will, maybe. Some Nubbins are happiest belonging to nobody.', 'soft'),
          N('Brisk looks up the river a long while. He doesn’t like it. He doesn’t say no.'),
        ],
      },
    ],
  ),
  // ------------------------------------------------ step 4 done: a week later
  scene(
    's16-week',
    [
      N('A week later the Workyard is louder, and slower. The saws stop for fruit at eleven o’clock and at three. Somebody has hung a hammock.'),
      N('Brisk’s banner has been through several drafts. You can read them all, crossed out, one under the other:'),
      N('WORK IS PLAY! · WORK IS… OFTEN PLAY! · REST IS A KIND OF WORK?? · ASK FIRST.'),
      BK('Output’s down eleven per cent. Lights stay on, mind. The waterwheel’s steadier than three tired Nubbins. Who knew?', 'happy'),
      SP('I knew. I said. I said it loudly.', 'happy'),
      N('Lug trundles past with a log on his back, humming. Nobody asked him. He just likes it.'),
    ],
    [
      {
        domain: 'maths',
        skill: 'time intervals in hours',
        standard: '3.MD.A.1',
        kind: 'ask',
        after: 0,
        prompt: [N('Fruit at eleven o’clock, and again at three in the afternoon. How long between the two fruit breaks?')],
        options: [
          {
            label: '4 hours',
            best: true,
            reply: [N('Yes. Eleven to twelve is one hour. Twelve to three is three more. 1 + 3 = 4 hours.')],
          },
          {
            label: '8 hours',
            reply: [
              N('That’s 11 − 3. But clocks go round: after twelve comes one again.'),
              N('Count on: eleven to twelve is one hour, twelve to three is three more. 4 hours.'),
            ],
          },
          {
            label: '3 hours',
            reply: [N('Nearly! Twelve to three is three hours. But don’t forget eleven to twelve.'), N('1 + 3 = 4 hours.')],
          },
        ],
        parentNote: 'Worked out a time interval across noon by counting on in hours.',
      },
      {
        domain: 'literacy',
        skill: 'drafting and redrafting',
        kind: 'ask',
        after: 2,
        prompt: [N('Brisk wrote four drafts. Which one says best what he learned?')],
        options: [
          {
            label: 'ASK FIRST.',
            best: true,
            reply: [
              N('Yes. Two words that hold the whole story.'),
              N('Writers often need several drafts. Each try gets a little closer to what they really mean.'),
            ],
          },
          {
            label: 'WORK IS PLAY!',
            reply: [
              N('That was his first draft, before he watched the Nubbins. It turned out not to be true for all of them.'),
              N('Writers often need several drafts to find what they mean. His last one, ASK FIRST, says what he learned.'),
            ],
          },
          {
            label: 'REST IS A KIND OF WORK??',
            reply: [
              N('He was getting closer! But two question marks means he wasn’t sure yet.'),
              N('Writers often need several drafts to find what they mean. ASK FIRST says what he learned.'),
            ],
          },
        ],
        parentNote: 'Learned that writers redraft to get closer to what they mean, and chose the clearest draft.',
      },
    ],
  ),
  // ------------------------------------------------ complete
  scene(
    's16-complete',
    [
      BK('Here. Can’t have a Keeper on my yard without a hat. Regulations. My regulations. New ones.', 'happy'),
      N('A yellow hard hat in your size, painted to match the walnut-shell ones. On the brim, in Lug’s pencil: KEEPER.'),
      N('A Workyard Nubbin tries to eat your new hard hat. It is not supper.'),
      BK('And take a copy of the roster. Try it at the Grove. Let them pick their jobs, and see what they pick.', 'soft'),
      CL('And see what they don’t. That’s just as worth knowing.', 'soft'),
      N('Back home you nail the Fair Roster by the cottage door. By morning, three Nubbins have pushed their cards under jobs.'),
      N('One has chosen watering. One has chosen fetching apples. One has pushed its card under “sitting with Moss”, and won’t be moved.'),
      SP('That last one isn’t a job.', 'think'),
      CL('It is to Moss.', 'happy'),
    ],
    [
      {
        domain: 'health',
        skill: 'how a hard hat protects your head',
        kind: 'notice',
        after: 1,
        lines: [
          N('A real hard hat has a tough shell, and straps inside that hold it a little way off your head.'),
          N('If something drops on it, the shell and the gap take the knock, not your head. That’s why builders wear them.'),
        ],
        parentNote: 'Learned how a hard hat protects the head, and why builders wear them.',
      },
      {
        domain: 'literacy',
        skill: 'your point of view and a character’s',
        standard: 'RL.3.6',
        kind: 'ask',
        after: 8,
        prompt: [N('Sparks says sitting with Moss isn’t a job. Clover says it is, to Moss. What’s your point of view?')],
        options: [
          {
            label: 'Sparks is right. A job is making or fixing something.',
            reply: [
              N('That’s a fair point of view. Sparks likes jobs you can see: lights on, wires fixed.'),
              N('Clover sees it from Moss’s side. Same Nubbin, two ways of looking.'),
            ],
          },
          {
            label: 'Clover is right. Keeping someone company helps them.',
            reply: [
              N('That’s a fair point of view too. Moss is very old, and a quiet friend means a lot to him.'),
              N('Sparks sees it differently. Same Nubbin, two ways of looking.'),
            ],
          },
          {
            label: 'Both. It depends whose eyes you look through.',
            reply: [
              N('That’s a thoughtful answer. To Sparks it’s sitting. To Moss it’s everything.'),
              N('Seeing a thing from more than one side is a big part of being fair.'),
            ],
          },
        ],
        parentNote: 'Compared their own point of view with two characters’ different views.',
      },
    ],
  ),
];

const S16: EduQuest = {
  id: 'reader:s16',
  of: 's16',
  band: 'reader',
  title: 'The Workyard',
  goals: {
    's16-step1': {
      goal: 'Go upriver with Sparks and Clover and see the Workyard.',
      hint: 'Follow the river path north, past the stepping stones. You’ll hear the saws long before you see the sheds.',
    },
    's16-step2': {
      goal: 'Watch the Workyard’s Nubbins for a day. Write down what each one does when nobody is asking.',
      hint: 'Stay hidden behind the log piles and sheds. If a Nubbin sees you, it starts working to be polite, and that note doesn’t count.',
    },
    's16-step3': {
      goal: 'Build a Fair Roster with Brisk: jobs the Nubbins like, rests, fruit breaks, a bell, and no more treadwheel.',
      hint: 'Put each Nubbin’s card under the job it chose when nobody was asking. Then hold Sparks’s ladder while she moves the lights to the waterwheel.',
    },
    's16-step4': {
      goal: 'Go back to the Workyard in a week, and see how the Fair Roster is working.',
      hint: 'Any day from a week on. Follow the river path north. Brisk will have the kettle on.',
    },
  },
  scenes: S16_SCENES,
  glossary: [
    gloss('electrician', 'Someone whose job is to fit and fix electric wires and lights.', 's16-sparks'),
    gloss('suspiciously', 'In a way that makes you think something might be wrong.', 's16-sparks'),
    gloss('treadwheel', 'A big wheel that turns when people or animals walk or run inside it.', 's16-yard'),
    gloss('output', 'How much of something is made, like logs from a sawmill.', 's16-yard'),
    gloss('observe', 'To watch something carefully, to learn about it.', 's16-shadow'),
    gloss('hide', 'Here: a small hut or screen where you can watch animals without them seeing you.', 's16-shadow'),
    gloss('offcuts', 'Small leftover pieces cut off a bigger piece of wood.', 's16-notes'),
    gloss('lean-to', 'A simple shelter with a sloping roof, often propped against something.', 's16-notes'),
    gloss('roster', 'A list that shows who does which job, and when.', 's16-roster'),
    gloss('consent', 'Saying yes because you really want to, when saying no is allowed too.', 's16-bell'),
    gloss('astonished', 'Very, very surprised.', 's16-bell'),
    gloss('slogan', 'A short, catchy phrase that is easy to remember.', 's16-question'),
    gloss('morale', 'How cheerful and confident a group of people feels.', 's16-question'),
    gloss('draft', 'One try at writing something, before it is finished.', 's16-week'),
    gloss('per cent', 'Out of every hundred. Eleven per cent means eleven in every hundred.', 's16-week'),
    gloss('regulations', 'Official rules.', 's16-complete'),
  ],
  notes:
    'Lessons: sound bends round obstacles, light doesn’t; reading between the lines; the treadwheel changing movement into ' +
    'electricity and light (4-PS3-4); tired vs lazy; what a graph measures; observing from a hide; a bar chart of the eight ' +
    'watched Nubbins (CHOP 2, STACK 1, REST 4, CARRY 1, matching the mini-game’s log) and 4/8 = one half; Lug’s motive from ' +
    'evidence; rest, food and water; fair rules for the smallest; consent; what ' +
    'working animals need; 11 to 3 is 4 hours; redrafting; hard hats; point of view. Think question (s16-question): when an ' +
    'animal works because you feed it, is it choosing? “Output’s up nine per cent” in s16-yard is simplified to “Output’s up”; ' +
    '“per cent” is glossed in s16-week. The big wooden wheel is called a treadwheel throughout.',
};

// ================================================================== exports
export const EDU_SIDE_NEW_1_READER: EduQuest[] = [S11, S15, S16];

/** Every `edu:` check used by a `do` lesson in this file. */
export const CHECKS: string[] = [
  // S11
  'edu:focus:lens:leaf',
  // S15
  'edu:tally:eggs:gate-of-five',
  // S16
  'edu:chart:bar:nubbin-choices',
];
