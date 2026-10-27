/**
 * The Learning Grove, reader band (ages 7–10): the Avatar fun quests Q56–Q65 (quests-avatar.ts).
 *
 *   Q56 Earth Rumble             forces and pushes (3-PS2-1); feeling vibrations (4-LS1-2); time
 *   Q57 The Painted Lady         rivers flow downstream; clean water (K-ESS3-3); mist; similes
 *   Q58 The Fortuneteller        volcanoes, fast and slow change (2-ESS1-1); the water cycle; clouds
 *   Q59 The Waterbending Scroll  pushing water; comparing widths; conscience (think: stealing from a thief)
 *   Q60 The Winged Lemur         animal adaptations (4-LS1-1); tally charts; fairness to animals (think)
 *   Q61 Avatar Day               judging the past (think); evidence and diaries; fair trials; time
 *   Q62 Penguin Sledding         melting and freezing (2-PS1-4); huddling; friction on ice
 *   Q63 King Rumbold’s Challenges  slopes and gravity; sink or float; quarters of a cake
 *   Q64 Kaito’s Big Speech       practice and kind self-talk; a scared body; second chances (think)
 *   Q65 The White Lotus          number patterns (4.OA.C.5); symmetry; heat moving; metaphor
 *
 * One EduScene per original scene (every step scene, done scene and complete scene). Every
 * choice keeps its original id and `set`; reader keeps every choice.
 * The approved quotes from the show never appear here, and Kaito’s adapted greeting in Q64 is
 * rewritten too, so no line needs a childLines swap. Uncle Tenzo’s sayings are all new.
 * See EDU-STYLE.md. British spelling.
 */
import type { EduDomain, EduQuest, EduScene, GlossaryEntry, Lesson, LessonOption } from './types';
import type { Choice, Line } from '../config/story';

type Mood = NonNullable<Line['mood']>;

const say =
  (who: string) =>
  (text: string, mood?: Mood): Line =>
    mood ? { who, text, mood } : { who, text };

// ---------------------------------------------------------------- speakers
const N = say('narrator');
const P = say('pemba');
const K = say('nalu');
const T = say('tuk');
const B = say('bao');
const Z = say('kaito');
const I = say('tenzo');
const M = say('lumi');
const BU = say('rumbold');
const W = say('aunt-wen');
const G = say('gorro');
const SL = say('big-slab');
const RE = say('ma-reedy');
const CH = say('captain-hake');
const TI = say('mayor-tibbs');
const MT = say('mrs-tibbs');
const C = say('cabbage-merchant');

// ---------------------------------------------------------------- builders
type LessonDraft = Omit<Lesson, 'id'>;

/** Builds `reader:<of>` and numbers its lessons `reader:<of>-l1`, `-l2`. */
const scene = (of: string, lines: Line[], lessons: LessonDraft[], choices?: Choice[]): EduScene => {
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

const ch = (id: string, label: string, then: Line[], set?: Choice['set']): Choice =>
  set ? { id, label, set, then } : { id, label, then };

const opt = (label: string, reply: Line[], best?: boolean): LessonOption =>
  best ? { label, best: true, reply } : { label, reply };

/** An `ask` beat. A think question is an `ask` whose options have no `best`. */
const ask = (
  after: number,
  domain: EduDomain,
  skill: string,
  prompt: Line[],
  options: LessonOption[],
  parentNote: string,
  standard?: string,
): LessonDraft => ({
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
  lines: Line[],
  parentNote: string,
  standard?: string,
): LessonDraft => ({
  domain,
  skill,
  ...(standard ? { standard } : {}),
  kind: 'notice',
  after,
  lines,
  parentNote,
});

const act = (
  after: number,
  domain: EduDomain,
  skill: string,
  check: string,
  lines: Line[],
  parentNote: string,
  standard?: string,
): LessonDraft => ({
  domain,
  skill,
  ...(standard ? { standard } : {}),
  kind: 'do',
  after,
  check,
  lines,
  parentNote,
});

const gloss = (word: string, meaning: string, of: string): GlossaryEntry => ({ word, meaning, scene: `reader:${of}` });

// ================================================================== Q56 Earth Rumble
const Q56: EduQuest = {
  id: 'reader:q56',
  of: 'q56',
  band: 'reader',
  title: 'Earth Rumble',
  goals: {
    'q56-s1': {
      goal: 'Follow the flyer to the secret arena under the big boulder.',
      hint: 'The big boulder in the rocky section has a crack in it. Knock twice.',
    },
    'q56-s2': {
      goal: 'Enter your Power Nubbin in a match against the Little Landslide. Win, or lose like a good sport.',
      hint: 'She feels your footsteps through the ground. Stand very still to puzzle her, then push.',
    },
  },
  scenes: [
    scene(
      'q56-flyer',
      [
        N('A crumpled flyer blows across the Grove and sticks to your Nubbin’s face.'),
        T('“RUMBLE NIGHT! Wrestling under the big boulder. Doors open at half past seven. Bring snacks.” Huh.'),
        T('Secret wrestling under a boulder. Of course. Why would anything round here happen above ground?', 'think'),
        P('We have to go! I’ve never seen wrestling. Is it like hugging, but crosser?', 'happy'),
        T('That’s… actually a perfect description. Two people push each other until one of them leaves the ring.'),
        N('Your strongest Nubbin flexes its tiny arms at the flyer. It seems to think it has been invited.'),
        P('It says the first match starts at eight o’clock. How long do we have to wait?', 'think'),
      ],
      [
        ask(
          6,
          'maths',
          'work out a time interval in minutes',
          [T('Doors open at half past seven. The first match is at eight. How long is that?')],
          [
            opt('30 minutes', [T('Right. Half an hour. Just long enough to eat all the snacks before it starts.')], true),
            opt('1 hour', [
              T('Not quite. From half past seven to eight, the minute hand goes from the 6 to the 12.'),
              T('That’s half the clock: 30 minutes.'),
            ]),
            opt('15 minutes', [T('That would be quarter to eight. Half past seven to eight is half an hour: 30 minutes.')]),
          ],
          'Worked out a half-hour time interval from half past seven to eight o’clock.',
          '3.MD.A.1',
        ),
      ],
      [
        ch('snacks', 'Pack snacks, as the flyer says', [T('Finally, someone who reads the instructions. I’ll carry the noodles.')], {
          'q56-snacks': true,
        }),
        ch('nubbin', 'Bring your Power Nubbin', [N('Your Power Nubbin marches ahead of you, stomping on purpose so everyone knows it’s coming.')]),
        ch('unsure', 'Ask whether this is a good idea', [T('It isn’t. But I want to see it. Those are two different things.')]),
      ],
    ),
    scene(
      'q56-flyer-done',
      [
        N('At the big boulder you find a crack just wide enough for a fist. You knock twice.'),
        N('With a deep, grinding rumble, the boulder slides aside. Stone steps lead down into the ground.'),
        N('Below, a crowd roars by torchlight around a square ring of sand.'),
        T('Okay. That’s a cool door. I’ll give them the door.'),
        P('Listen! No, feel! I can feel the cheering in my feet!', 'happy'),
        N('He’s right. Every stamp and every cheer makes the stone steps tremble very slightly.'),
        T('Great. A room so loud the floor joins in.'),
      ],
      [
        act(
          5,
          'science',
          'sound is a vibration, and it travels through solid things',
          'edu:tap:table:ear-down',
          [
            P('Try this! Put your ear flat on a table, and gently tap the far end with one finger.'),
            N('The tap sounds louder through the table than through the air. Sound is a vibration: a very fast shaking.'),
            N('Vibrations travel well through solid things like wood and stone. That’s why the steps tremble when the crowd stamps.'),
          ],
          'Listened to a tap through a tabletop and learned that sound is a vibration that travels through solids.',
          '1-PS4-1',
        ),
      ],
    ),
    scene(
      'q56-bout',
      [
        G('WELCOME TO RUMBLE NIGHT! Tonight our champion defends her belt against the mighty Big Slab!', 'happy'),
        SL('The Big Slab is feeling confident! The Big Slab is feeling enormous!', 'angry'),
        T('Why is he talking about himself like that?'),
        N('The champion walks into the ring barefoot. She is tiny, dressed in green, with a fringe over her pale eyes.'),
        G('THE LITTLE LANDSLIDE!'),
        N('The Little Landslide says, “Let’s get this over with. I have a bedtime.”'),
        N('The Big Slab charges. The champion plants her bare feet wide apart and doesn’t budge.'),
        N('He pushes. She pushes back just as hard. For a long moment, nobody moves at all.'),
        N('Then she shoves harder. The ground lifts like a trapdoor, and he sails out of the ring into the noodle stand.'),
        N('She says, “Next! Anybody? Come on, I can feel you all shuffling.”'),
        N('Your Power Nubbin steps forward. The whole arena goes quiet.'),
        N('She says, “Huh. Small, heavy, walks like it means it. I like it already.”'),
      ],
      [
        ask(
          8,
          'science',
          'balanced and unbalanced forces',
          [
            N('When they pushed equally hard, nobody moved. Then the Little Landslide pushed harder.'),
            N('What happened to the Big Slab?'),
          ],
          [
            opt('He moved, in the direction she was pushing.', [
              N('She says, “Yep. Equal pushes are balanced, so nothing moves. A bigger push on one side is unbalanced, and something goes flying.”'),
              N('She says, “Usually him.”'),
            ], true),
            opt('Nothing. He’s bigger, so he stays put.', [
              N('Being big helps, but the pushes decide. When her push became bigger than his, the forces were unbalanced, and he moved.'),
            ]),
            opt('They both slid backwards.', [
              N('Not this time. When one push is bigger, things move the way the bigger push goes. Out of the ring, into the noodles.'),
            ]),
          ],
          'Explained that equal pushes are balanced and a bigger push on one side makes something move.',
          '3-PS2-1',
        ),
      ],
      [
        ch('easy', 'Ask her to go easy on it', [N('She says, “Nope. Going easy would be an insult. Your Nubbin deserves a real match.”')]),
        ch('all', 'Tell her not to hold back', [N('She says, “Oh, I won’t. But I like that you asked.”')]),
        ch(
          'bow',
          'Bow to her',
          [N('She says, “You know I can’t see that, right?”'), N('She grins anyway. She felt the floorboards creak as you bent.')],
          { 'q56-bowed': true },
        ),
      ],
    ),
    scene(
      'q56-bout-done',
      [
        N('The match is short and very sandy. Your Nubbin stands perfectly still, and for a second she loses track of it.'),
        N('Then it shuffles one foot, and she finds it at once.'),
        N('She says, “Not bad! Not bad at all. Hardly anyone lasts that long.”'),
        N('Your Nubbin is either covered in glory or covered in sand. Possibly both.'),
        N('She says, “And you didn’t run. Most people run. Running’s loud.”'),
        T('Is it me, or did she just say “good job” in the grumpiest way possible?'),
        N('She says, “I heard that, Ponytail. And yes.”'),
      ],
      [
        notice(
          1,
          'science',
          'some animals sense the world through vibrations',
          [
            N('She says, “I can’t see with my eyes, so I see with my feet. Every step sends a little shake through the ground.”'),
            N('Some real animals do this too. A spider feels tiny shakes in its web, and knows where a fly has landed.'),
            N('When your Nubbin stood still, it made no shakes at all. So for a moment, it was hidden.'),
          ],
          'Learned that some animals, like spiders, sense movement through vibrations.',
          '4-LS1-2',
        ),
        ask(
          6,
          'sel',
          'being a good sport',
          [N('Your Nubbin gave it everything. What does a good sport do at the end of a match?')],
          [
            opt('Shake hands (or paws) and say “good match”.', [N('She says, “That’s the one. Win or lose, you thank the person who gave you a real fight.”')], true),
            opt('Say the sand was unfair.', [
              N('She says, “Blaming the sand? The sand was the same for both of us, Keeper.”'),
              N('A good sport thanks the other player instead: “Good match.”'),
            ]),
            opt('Stomp off without a word.', [
              N('It’s fine to feel disappointed. But a good sport still says “good match” first, then has a sulk later if they need one.'),
            ]),
          ],
          'Practised what a good sport says and does at the end of a match.',
          'CASEL: Self-management',
        ),
      ],
    ),
    scene(
      'q56-complete',
      [
        N('After the show, the Little Landslide finds you by the noodle stand, which has been rebuilt.'),
        B('The name’s Bao. Don’t tell anyone. Up there, I’m a nice quiet girl who has to wear shoes.'),
        B('Up there, everyone helps me across the road whether I want it or not. Down here, nobody helps me. It’s the best.', 'soft'),
        T('You were incredible. How do you know where they’re going?'),
        B('I feel it through my feet. Your feet are louder than your mouth, Ponytail. Which is saying something.', 'happy'),
        B('Here. A spare belt. I’ve got a cupboard full. Your Nubbin earned it, win or lose.'),
        N('The belt is far too big. Your Nubbin wears it anyway, dragging it proudly behind like a tail.'),
        G('And take a ring post! Every great champion needs an arena!', 'happy'),
      ],
      [
        ask(
          2,
          'sel',
          'think question: the best way to help someone',
          [
            N('Bao says people help her whether she wants it or not. Down here, she gets to do things herself.'),
            N('What do you think is the best way to help someone?'),
          ],
          [
            opt('Ask first: “Would you like some help?”', [B('Ha. Now there’s a question people forget. Asking means I get to choose.', 'happy')]),
            opt('Just help. Helping is kind.', [
              B('It is kind, and you clearly have a kind heart.'),
              B('I’d just add: ask first, so the other person gets a say too.'),
            ]),
            opt('Wait and watch, and only help if they get stuck.', [B('That’s pretty smart. Lots of people like to try on their own first.', 'think')]),
          ],
          'Thought about how to offer help in a way that respects what the other person wants.',
          'CASEL: Social awareness',
        ),
      ],
    ),
  ],
  glossary: [
    gloss('flex', 'To tighten your muscles to show how strong you are.', 'q56-flyer'),
    gloss('arena', 'A big space where crowds watch sports or shows.', 'q56-flyer-done'),
    gloss('tremble', 'To shake a little.', 'q56-flyer-done'),
    gloss('confident', 'Sure of yourself, and not at all shy.', 'q56-bout'),
    gloss('budge', 'To move even a tiny bit, usually when someone is trying to move you.', 'q56-bout'),
    gloss('glory', 'Great praise and honour for doing something brave or difficult.', 'q56-bout-done'),
  ],
  notes:
    'Lessons: half-hour time interval; sound as vibration through solids (do: ear on the table); balanced and ' +
    'unbalanced pushes; sensing vibrations like a spider; being a good sport; think question on offering help. ' +
    'Bao is blind; only she jokes about it, as in the main script.',
};

// ================================================================== Q57 The Painted Lady
const Q57: EduQuest = {
  id: 'reader:q57',
  of: 'q57',
  band: 'reader',
  title: 'The Painted Lady',
  goals: {
    'q57-s1': {
      goal: 'Take food and medicine to five houses in the river village.',
      hint: 'Fruit from the Grove and herbs from the healer’s shelf will both do. Knock gently; people are poorly.',
    },
    'q57-s2': {
      goal: 'Clean the river by moonlight without the villagers seeing you.',
      hint: 'Steer the boat through the brown patches. If a lantern turns your way, drift into the mist and wait.',
    },
  },
  scenes: [
    scene(
      'q57-sick',
      [
        N('Downstream from the Grove, the river turns a sickly brown. A village of stilt houses stands in the murk, quiet and grey.'),
        RE('The fish are all gone. Half the village is coughing. It’s the works upstream. They pour their sludge in and call it progress.', 'sad'),
        K('That’s awful. Someone has to do something.', 'angry'),
        T('Someone will. Probably not us. We have a schedule.'),
        K('Tuk.'),
        T('…I’m just saying the schedule exists.'),
        RE('The old folk say a river spirit once watched over us. A lady in white with a painted face. She hasn’t come in years.', 'soft'),
        N('A little girl in a doorway holds up an empty fish basket, upside down, as if it might be hiding a fish.'),
        N('Nalu goes very quiet. You can see an idea forming. Tuk can see it too, and he sighs.'),
      ],
      [
        notice(
          1,
          'science',
          'rivers carry pollution downstream to everyone below',
          [
            K('A river only flows one way: downhill. So whatever goes in upstream ends up with everyone downstream.'),
            N('That’s why this village is sick, even though the works is far away. A river is shared by everyone who lives along it.'),
          ],
          'Learned that rivers flow downhill, so pollution put in upstream reaches everyone downstream.',
          'K-ESS3-3',
        ),
      ],
      [
        ch('help', 'Promise to help', [RE('You’re kind. But kind won’t clean a river, dear.', 'soft'), K('Watch us.')]),
        ch('fruit', 'Offer fruit from the Grove', [RE('Real fruit! The children haven’t had any for weeks.', 'happy')], {
          'q57-gave-fruit': true,
        }),
        ch('spirit', 'Ask about the river spirit', [
          RE('She came at night. Mist on the water, a lantern on a boat. In the morning, the sick were well.'),
        ]),
      ],
    ),
    scene(
      'q57-sick-done',
      [
        N('You go from house to house with fruit and herbs. Five houses, five creaky ladders.'),
        N('Each house gets three pieces of fruit: one for breakfast, one for lunch and one for supper.'),
        RE('Bless you. Nobody’s brought us anything but sludge for months.', 'soft'),
        N('At the last house, a little boy gives you a drawing of a lady with a painted face.'),
        N('Underneath, in wobbly letters, he has written: COME BACK PLEASE.'),
        K('That settles it.', 'soft'),
        T('I know that face. That’s your “I have a plan and it needs a costume” face.'),
      ],
      [
        ask(
          1,
          'maths',
          'multiplication as equal groups',
          [T('Five houses, three fruits each. How many fruits did we carry? I need to know how sore my arms are allowed to be.')],
          [
            opt('15', [T('Fifteen. Five groups of three: 3, 6, 9, 12, 15. My arms were right to complain.')], true),
            opt('8', [T('That’s 5 add 3. But every house got 3, so it’s five groups of three: 3, 6, 9, 12, 15. Fifteen.')]),
            opt('12', [T('Close! That’s four houses. Count one more group of three, and you get 15.')]),
          ],
          'Solved 5 groups of 3 as a multiplication: 15 pieces of fruit.',
          '3.OA.A.1',
        ),
      ],
    ),
    scene(
      'q57-night',
      [
        N('Midnight. Nalu steps into a boat wearing a white veil, a wide straw hat and red painted marks.'),
        K('Well? Do I look like a river spirit?'),
        N('The veil tickles. A very small, very un-spirit-like sneeze escapes.'),
        T('Spirits don’t sneeze.'),
        K('This one does.'),
        T('You look like Nalu in a hat. But a really mysterious hat.'),
        P('I think you look amazing. And spooky. Amazing-spooky.', 'happy'),
        N('Mist rises off the river and curls round the boat like steam from a bath.'),
        K('Here’s the plan. I lift the sludge out of the water. You and the Nubbins scoop it into barrels. Nobody gets seen.'),
        N('Your Swim Nubbin slips silently into the river, then pops up holding a rusty can like a trophy.'),
        T('And tomorrow, when the works start pouring again?', 'think'),
        K('Then the Painted Lady pays them a visit too.', 'angry'),
      ],
      [
        notice(
          7,
          'science',
          'mist is made of tiny drops of water',
          [
            K('Mist is really a cloud sitting low on the water. It’s millions of tiny water drops, too small to see one by one.'),
            N('On a cold night, water rises off the river as an invisible gas. In the cold air it cools into those tiny drops.'),
          ],
          'Learned that mist is a low cloud of tiny water drops that forms when water vapour cools.',
        ),
        ask(
          9,
          'literacy',
          'understand a simile',
          [
            N('The Nubbin holds up the can “like a trophy”. A simile compares two things using “like” or “as”.'),
            N('What does this simile tell you?'),
          ],
          [
            opt('The Nubbin is very proud of what it found.', [N('Yes. People hold trophies up high when they’ve won. The simile shows how proud the Nubbin feels.')], true),
            opt('The can is made of gold.', [N('Not at all: it’s rusty! The simile isn’t about the can. It shows how proud the Nubbin feels.')]),
            opt('The Nubbin won a race.', [N('No race tonight. The simile borrows the feeling of winning to show how proud the Nubbin is.')]),
          ],
          'Explained what a simile (“like a trophy”) shows about a character’s feelings.',
          'L.4.5',
        ),
      ],
      [
        ch('clean', 'Clean the river first', [K('Right. Rescue first. Everything else can wait till morning.')], { 'q57-plan': 'clean' }),
        ch('pipe', 'Block the sludge pipe', [T('Now that I can help with. I brought a very large cork.', 'happy')], { 'q57-plan': 'pipe' }),
        ch('note', 'Leave a stern note at the works', [K('“Stop it. Love, the river.” Perfect.', 'happy')], { 'q57-plan': 'note' }),
      ],
    ),
    scene(
      'q57-night-done',
      [
        N('All night you scoop. Barrel after barrel fills with brown gloop.'),
        N('By dawn the water runs clear enough to see the stones on the bottom.'),
        N('A fish flips up into the light, and someone on the bank gasps.'),
        RE('The Painted Lady came back!', 'shock'),
        N('Ma Reedy turns towards your boat, half hidden in the mist. Nalu, still painted, freezes.'),
        K('(whispering) Do we tell her?'),
      ],
      [
        notice(
          2,
          'science',
          'fish need clean water to breathe',
          [
            N('Why did the fish come back? Fish breathe with gills, which take in oxygen from the water.'),
            N('Sludge clouds the water and blocks the sunlight that water plants need. Clean, clear water means fish can live here again.'),
          ],
          'Learned that fish use gills to get oxygen from water, and need clean water to live.',
          '4-LS1-1',
        ),
        ask(
          5,
          'sel',
          'think question: the truth or the legend',
          [
            K('Help me think. If we stay secret, the Painted Lady story gives them hope. If we tell, Ma Reedy knows the truth.'),
            N('Which matters more here: the truth, or the hope? There’s no wrong answer.'),
          ],
          [
            opt('The truth. People deserve to know.', [K('That’s fair. Honest people are easier to trust, and Ma Reedy has been let down before.')]),
            opt('The hope. The story helps them.', [K('I think that too, sometimes. A story can keep people going.', 'soft')]),
            opt('Both: tell Ma Reedy, but let the story carry on.', [K('Ooh. The truth for her, and the legend for everyone else. That’s clever.', 'happy')]),
          ],
          'Weighed honesty against a hopeful story, with no single right answer.',
          'CASEL: Responsible decision-making',
        ),
      ],
      [
        ch(
          'q57-tell',
          'Step out of the mist and tell her the truth',
          [
            RE('I know, dear. I knew the first night. Spirits don’t sneeze.', 'soft'),
            RE('The Painted Lady was always just somebody who decided to be her. Now it’s you.'),
          ],
          { 'q57-legend': 'told' },
        ),
        ch(
          'q57-mist',
          'Drift back into the mist',
          [
            N('You drift away. Behind you, the village is already telling the story, and it gets better every time.'),
            K('Maybe they need her more than they need to know who she is.', 'soft'),
          ],
          { 'q57-legend': 'kept' },
        ),
      ],
    ),
    scene(
      'q57-complete',
      [
        N('The village wakes to clear water and full fish baskets.'),
        N('The works upstream has hung up a nervous sign: PIPE CLOSED. SORRY.'),
        RE('She came back. After all these years, she came back.', 'happy'),
        K('I bet she was happy to help.', 'soft'),
        T('She was very happy. And very wet. And she owes me new trousers.'),
        N('Ma Reedy gives you a wide straw hat, still faintly marked with river-spirit paint.'),
        RE('And these little fish. Put them in your stream. They nibble the muck and keep the water clear for good.'),
        K('The fish can keep it clean. But it’s still up to us not to make it dirty.'),
      ],
      [
        ask(
          7,
          'social-studies',
          'how people can look after rivers',
          [N('What’s one way people can help keep rivers and streams clean?')],
          [
            opt('Keep rubbish and waste out of the water.', [K('Yes. Bin it, don’t drop it. Everything in a stream ends up downstream.')], true),
            opt('Throw rubbish in. The fish will eat it.', [
              K('The little fish nibble muck, but they can’t eat cans or sludge. Rubbish belongs in a bin, not a river.'),
            ]),
            opt('Leave it to the river spirits.', [K('Ha! Even the Painted Lady was just a person. Anyone can help, by keeping rubbish out of the water.')]),
          ],
          'Named a way people can help keep rivers clean for everyone.',
          'K-ESS3-3',
        ),
      ],
    ),
  ],
  glossary: [
    gloss('downstream', 'Further along a river, in the direction the water flows.', 'q57-sick'),
    gloss('sludge', 'Thick, dirty, sticky mud or waste.', 'q57-sick'),
    gloss('veil', 'A thin piece of cloth worn over the face or head.', 'q57-night'),
    gloss('mysterious', 'Strange and hard to explain or understand.', 'q57-night'),
    gloss('gills', 'The body parts a fish uses to breathe under water.', 'q57-night-done'),
    gloss('upstream', 'Further back along a river, towards where the water comes from.', 'q57-complete'),
  ],
  notes:
    'Lessons: rivers carry pollution downstream (K-ESS3-3); 5 × 3 = 15; mist as tiny water drops; the simile ' +
    '“like a trophy”; gills and clean water; think question on truth versus a hopeful legend; keeping rivers clean. ' +
    'The illness stays mild (coughs, tiredness), as in the main script.',
};

// ================================================================== Q58 The Fortuneteller
const Q58: EduQuest = {
  id: 'reader:q58',
  of: 'q58',
  band: 'reader',
  title: 'The Fortuneteller',
  goals: {
    'q58-s1': {
      goal: 'Have Aunt Wen read the bones for you and your Nubbin.',
      hint: 'Join the queue at the house with stars on the door. Bring a fruit; it’s polite.',
    },
    'q58-s2': {
      goal: 'Climb Mount Grumble and look inside the crater.',
      hint: 'Take the zigzag path, or call Puffin if you’ve found him. Keep your Nubbin well away from the edge.',
    },
    'q58-s3': {
      goal: 'Help Pemba push the clouds into a giant angry-volcano shape over the village.',
      hint: 'Drag the cloud puffs into the outline. The wind blows the clouds east, so start on the west side.',
    },
  },
  scenes: [
    scene(
      'q58-reading',
      [
        N('In the village of Hillstead, everyone queues outside a little house with stars painted on the door.'),
        W('Come in, come in! Aunt Wen sees all. Or most. Some of it is blurry.', 'happy'),
        N('She drops a bone into the fire. It cracks with a pop. She peers at the cracks and gasps happily.'),
        W('Your Nubbin will find something lovely today. Possibly a snack. Probably a snack.'),
        T('That’s not a fortune. That’s just odds. Nubbins always find snacks.'),
        W('And you, young man, will have a very bad day if you keep saying things like that.'),
        N('Outside, a villager carries an umbrella on a cloudless day. Another refuses to walk on the left of the road.'),
        P('She’s amazing! She said I’ll have a great adventure! Do you think it’s today?', 'happy'),
        K('She says that to everyone, Pemba.'),
      ],
      [
        ask(
          4,
          'science',
          'testing a claim with evidence',
          [T('Everyone here believes her. But how could we actually test whether her fortunes come true?')],
          [
            opt('Write her fortunes down, then check later how many came true.', [
              T('Exactly. Collect the evidence, then count. That’s how you test any claim, from fortunes to frogs.'),
            ], true),
            opt('Believe her. She sounds very sure.', [
              T('Sounding sure isn’t the same as being right. A fairer test: write the fortunes down and check how many come true.'),
            ]),
            opt('Ask her if she’s right.', [T('She’ll say yes! Better to write her fortunes down and check them later. Evidence beats asking.')]),
          ],
          'Planned a fair way to test a claim by collecting evidence and checking it.',
        ),
      ],
      [
        ch(
          'believe',
          'Believe her',
          [W('A wise Keeper. Your Nubbin agrees. Look, it’s nodding.', 'happy'), N('Your Nubbin is nodding off.')],
          { 'q58-belief': 'believe' },
        ),
        ch('doubt', 'Side with Tuk', [T('Finally. Someone with a brain. Hello, brain.', 'happy')], { 'q58-belief': 'doubt' }),
        ch('wait', 'Say you’ll wait and see', [W('Fair. The bones are patient. So am I. Mostly.')], { 'q58-belief': 'wait' }),
      ],
    ),
    scene(
      'q58-reading-done',
      [
        W('Oh, and the mountain won’t erupt this year. I read the clouds this morning. Nice and fluffy.'),
        T('…The mountain can erupt?', 'think'),
        N('Everyone turns to look at Mount Grumble, high above the village. A thin thread of grey smoke drifts from its top.'),
        W('Every few hundred years. Nothing to worry about. The clouds said so.', 'happy'),
        T('A volcano. You built your whole village under a volcano.'),
        W('The soil is wonderful for turnips.'),
      ],
      [
        notice(
          5,
          'science',
          'why people farm near volcanoes',
          [
            N('Aunt Wen has a point about the turnips. Ash from old eruptions breaks down into rich soil that plants love.'),
            N('That’s why people have farmed near volcanoes for thousands of years, even though it can be risky.'),
          ],
          'Learned that volcanic ash makes rich soil, which is why people farm near volcanoes.',
        ),
      ],
    ),
    scene(
      'q58-mountain',
      [
        N('Above Hillstead, Mount Grumble sends up a thin grey thread of smoke. Tuk stares at it.'),
        T('Everyone here trusts clouds over common sense. I’m going up there. I want to see with my own eyes.'),
        P('I’ll come! Puffin, my sky bison, can fly us most of the way. Or my glider, if he’s sulking.'),
        K('I’ll stay and talk to the villagers. Just in case.'),
        N('At the top, the air is hot and smells of boiled eggs. Inside the crater, red rock bubbles and hisses.'),
        T('That is not “nice and fluffy”. That is “very much about to go off”.', 'shock'),
        P('We have to tell everyone! Today!', 'shock'),
        T('They won’t listen to us. They only listen to Aunt Wen. And Aunt Wen only listens to clouds.', 'think'),
      ],
      [
        notice(
          4,
          'science',
          'magma, lava and volcanic gas',
          [
            T('That’s rock so hot it has melted. Under the ground it’s called magma. Once it pours out of a volcano, it’s called lava.'),
            T('And the eggy smell is gas coming up from deep underground. Volcanoes are famous for it.'),
          ],
          'Learned the difference between magma (under the ground) and lava (above it).',
        ),
      ],
    ),
    scene(
      'q58-mountain-done',
      [
        N('You hurry back down the zigzag path. A hot wind pushes at your back.'),
        P('Wait. If they only listen to clouds…', 'happy'),
        T('…then we give them a cloud. Pemba, you wonderful little weather machine.', 'happy'),
        P('I can push clouds around with my wind. But I can’t make them out of nothing.'),
        T('So where do clouds even come from?', 'think'),
        P('From water! Every cloud started out in a river, a lake or the sea.', 'happy'),
      ],
      [
        act(
          5,
          'science',
          'the water cycle',
          'edu:order:water-cycle',
          [
            P('Help me put the water cycle in order! Then I’ll know which clouds to grab.'),
            N('Drag the cards: the sun warms the lake. Water rises as invisible vapour. High up, it cools into tiny drops.'),
            N('The drops crowd together into a cloud. The cloud rains, and the water runs back to the lake.'),
            P('And round it goes, again and again. The same water, over and over!', 'happy'),
          ],
          'Put the stages of the water cycle in order: warming, rising vapour, cooling into drops, clouds, rain.',
        ),
      ],
    ),
    scene(
      'q58-clouds',
      [
        N('The whole village has gathered in the square for Aunt Wen’s evening cloud reading.'),
        W('The clouds will now speak! Let us see. Yes. Ah. Hmm. That one looks like a duck.'),
        N('High above, Pemba and Puffin swoop through the clouds, pushing great gusts of wind. Your Nubbins flap along behind.'),
        T('Okay. Steady. We need one shape. The village sign for “danger”. Big, clear, impossible to argue with.'),
        K('And what is the village sign for danger?'),
        T('A big angry mountain with a frowny face.'),
        K('…That’s not a real sign.'),
        T('It will be in five minutes.'),
        K('Tuk. We’re tricking them. Is that really any better than what Aunt Wen does?', 'think'),
        T('…Hm. I hate it when you ask the good questions while I’m busy.'),
      ],
      [
        ask(
          2,
          'social-studies',
          'compass directions: east and west',
          [T('The wind is blowing the clouds towards the east. Which side should Pemba start from, so they drift into place?')],
          [
            opt('The west side', [T('Yes! Start in the west, and the wind carries the clouds east, right into the shape.')], true),
            opt('The east side', [T('Then the wind would blow them straight off the shape! Start in the west, and the wind carries them east.')]),
            opt('The north side', [T('North would send them sideways. The wind moves from west to east, so start in the west.')]),
          ],
          'Used compass directions to work out that wind blowing east carries things from the west.',
          'D2.Geo.2.K-2',
        ),
        ask(
          9,
          'sel',
          'think question: is a trick ever all right?',
          [
            K('Help me with this one. We’re tricking them to save them. Aunt Wen tricks them by accident.'),
            N('Is our trick okay? What do you think?'),
          ],
          [
            opt('Yes: it keeps them safe, and we’ll show them the truth tomorrow.', [
              T('That’s my thinking. A trick to keep them safe tonight, then the real evidence in daylight.'),
            ]),
            opt('No: we should find a way to show them the truth tonight.', [K('That’s brave. The truth might be slower, but it’s theirs to know.', 'soft')]),
            opt('I’m not sure.', [K('Me neither. Not being sure means you’re thinking hard about it. That’s good.')]),
          ],
          'Thought about whether a trick can be right if it keeps people safe.',
          'CASEL: Responsible decision-making',
        ),
      ],
      [
        ch(
          'q58-warning',
          'Shape the frowning volcano. Get them moving.',
          [
            T('Tonight we trick them out of danger. Tomorrow we walk them up and show them the crater.'),
            K('Promise?'),
            T('Promise. With diagrams.'),
          ],
          { 'q58-cloud': 'warning' },
        ),
        ch(
          'q58-arrow',
          'Shape a giant arrow pointing at the mountain',
          [
            K('Yes. Don’t tell them what to think. Show them where to look.', 'happy'),
            N('Below, a hundred heads turn from the sky to the smoking mountain, for the first time in years.'),
          ],
          { 'q58-cloud': 'arrow' },
        ),
      ],
    ),
    scene(
      'q58-clouds-done',
      [
        N('A huge cloud hangs over Hillstead, impossible to argue with.'),
        N('Your Nubbins drift down out of it, damp and proud. Their fur is dotted with tiny drops of water.'),
        P('See? Clouds are wet inside! It’s like flying through a cold bath.', 'happy'),
        W('Oh dear. Oh dear oh dear. The clouds have NEVER been this clear.', 'shock'),
        W('Everyone, get your shovels!', 'shock'),
        T('Shovels. She said shovels. That’s the most sensible thing anyone’s said all day.'),
      ],
      [
        ask(
          2,
          'science',
          'reading clouds for the weather',
          [
            N('Aunt Wen said fluffy clouds meant good news. For the weather, she was partly right!'),
            N('Which clouds usually bring storms?'),
          ],
          [
            opt('Tall, dark, towering clouds', [
              P('Yes! Small, fluffy white clouds usually mean fair weather. Tall, dark ones can bring heavy rain and thunder.'),
            ], true),
            opt('Small, fluffy white clouds', [P('Those usually mean a nice day. It’s the tall, dark, towering clouds that bring storms.')]),
            opt('Thin, wispy clouds', [P('Thin wispy clouds are very high up and don’t usually bring rain. The tall, dark, towering ones are the stormy ones.')]),
          ],
          'Learned that small fluffy clouds usually mean fair weather and tall dark clouds can bring storms.',
          'K-ESS2-1',
        ),
      ],
    ),
    scene(
      'q58-complete',
      [
        N('The villagers dig a trench all night. When Mount Grumble finally pops, the lava runs down the trench and away from the houses.'),
        W('I owe you, young man. Even if you don’t believe a word I say.', 'soft'),
        T('I believe one word. “Shovels.” That was a great call.'),
        W('Then let me give the Keeper something. Bring your Nubbins to me whenever you like. I’ll read the bones for them.', 'happy'),
        W('I’m right more often than not. And much more often about Nubbins than about mountains.'),
        N('Aunt Wen now reads bones at the Grove’s fortune tent. Tuk says he will never go. He goes twice a week, in a hat.'),
      ],
      [
        ask(
          0,
          'science',
          'some changes to the land are fast and some are slow',
          [
            T('Lava flows downhill, like very slow, very hot porridge. The trench gave it an easier path, away from the houses.'),
            P('Some changes to the land happen slowly, over thousands of years. Some happen fast. Which kind was the lava?'),
          ],
          [
            opt('Fast: it changed the land in hours or days.', [
              T('Right. A river wearing out a valley takes ages. An eruption can reshape a mountainside in a day.'),
            ], true),
            opt('Slow: it takes thousands of years.', [
              T('The mountain took a very long time to build up. But the lava running down the trench was fast: hours, not years.'),
            ]),
          ],
          'Sorted a volcanic eruption as a fast change to the land, compared with slow changes like a river wearing a valley.',
          '2-ESS1-1',
        ),
        ask(
          5,
          'literacy',
          'work out a character’s motive from what he does',
          [N('Tuk says he’ll never go to Aunt Wen. So why do you think he goes twice a week… in a hat?')],
          [
            opt('So nobody recognises him, because he said he never would.', [
              N('Yes! The hat is a disguise. Tuk is a bit embarrassed to have changed his mind, so he hides it.'),
            ], true),
            opt('Because it’s raining.', [N('Maybe! But twice a week, every week? The hat is more likely a disguise: Tuk doesn’t want anyone to know he goes.')]),
            opt('Because he likes hats.', [N('He might. But it’s funnier than that. He said he’d never go, so the hat helps him go without being spotted.')]),
          ],
          'Used a character’s actions to work out his hidden reason (he is embarrassed to have changed his mind).',
          'RL.3.3',
        ),
      ],
    ),
  ],
  glossary: [
    gloss('fortune', 'What someone says will happen to you in the future.', 'q58-reading'),
    gloss('odds', 'How likely it is that something will happen.', 'q58-reading'),
    gloss('erupt', 'When a volcano bursts open and hot melted rock, ash or gas comes out.', 'q58-reading-done'),
    gloss('crater', 'The bowl-shaped hole at the top of a volcano.', 'q58-mountain'),
    gloss('magma', 'Melted rock deep under the ground.', 'q58-mountain'),
    gloss('vapour', 'Water as an invisible gas in the air.', 'q58-mountain-done'),
    gloss('gust', 'A sudden, strong rush of wind.', 'q58-clouds'),
    gloss('sensible', 'Showing good sense; wise and practical.', 'q58-clouds-done'),
    gloss('trench', 'A long, narrow ditch dug in the ground.', 'q58-complete'),
  ],
  notes:
    'Lessons: testing a claim with evidence; volcanic soil; magma and lava; eruptions as fast change (2-ESS1-1); ' +
    'the water cycle (do: order the cards); east and west with the wind; think question on whether a trick can be ' +
    'right; storm clouds and fair-weather clouds; lava steered by barriers; Tuk’s hat as a motive. No one is hurt.',
};

// ================================================================== Q59 The Waterbending Scroll
const Q59: EduQuest = {
  id: 'reader:q59',
  of: 'q59',
  band: 'reader',
  title: 'The Waterbending Scroll',
  goals: {
    'q59-s1': {
      goal: 'Keep Captain Hake talking while Nalu takes a closer look at the scroll.',
      hint: 'Ask about every item on the deck. The bison whistle is good for at least a minute.',
    },
    'q59-s2': {
      goal: 'Escape the pirates down the river rapids.',
      hint: 'Steer between the rocks, and let your Swim Nubbins push on the straight bits.',
    },
  },
  scenes: [
    scene(
      'q59-market',
      [
        N('A battered pirate ship is moored at the river market, its deck piled with “treasures” of every kind.'),
        CH('Step up! Rare goods, fair prices, absolutely no questions answered!', 'happy'),
        P('Look! A whistle shaped like a bison! It’s only 45 gold pieces, and I’ve got 100!', 'happy'),
        T('It’s a stick with a hole in it. You’re buying a stick.'),
        N('Nalu has gone very still. In a glass case lies an old scroll covered in drawings of moving water.'),
        K('That’s a waterbending scroll. A real one. It could teach me everything my village couldn’t.', 'soft'),
        CH('Ah, the lady has taste. Two hundred gold pieces. Or your bison, your Nubbin and the boy with the boomerang.'),
        T('That’s a lot of value for one scroll. I’m flattered, in a horrible way.'),
      ],
      [
        ask(
          3,
          'maths',
          'subtract to find change',
          [T('Fine. If you buy your stick for 45 gold pieces and pay with 100, how much change should you get back?')],
          [
            opt('55 gold pieces', [T('Right. 45 and 5 makes 50, and 50 more makes 100. So 55 back. Count it, he’s a pirate.')], true),
            opt('65 gold pieces', [T('Check it: 45 and 65 makes 110. Too much! 45 and 55 makes 100, so the change is 55.')]),
            opt('45 gold pieces', [T('That’s the price, not the change. 100 take away 45 leaves 55.')]),
          ],
          'Worked out change from 100 by counting on: 100 − 45 = 55.',
          '2.OA.A.1',
        ),
      ],
      [
        ch(
          'haggle',
          'Haggle',
          [CH('Two hundred! My final offer! Two hundred and ten!'), T('That’s not how haggling works. The price is meant to go DOWN.')],
          { 'q59-haggled': true },
        ),
        ch('walk', 'Pretend to walk away', [CH('Fine! Nobody wanted it anyway! …Two hundred!', 'angry')]),
        ch('where', 'Ask where he got it', [CH('I found it. In a… temple. On a… shelf. That was open. Partly.', 'think')]),
      ],
    ),
    scene(
      'q59-market-done',
      [
        N('You turn round. Nalu is walking briskly towards your boat.'),
        N('The glass case is empty.'),
        T('Did you just—', 'shock'),
        K('Walk. Normally. Now.'),
        N('Tuk walks normally. It is the least normal walk you have ever seen.'),
        CH('THIEVES! After them, lads!', 'angry'),
      ],
      [
        ask(
          0,
          'literacy',
          'work out a word’s meaning from clues',
          [N('Nalu walks “briskly”. Look for clues: she wants to get away before anyone notices. What does “briskly” mean?')],
          [
            opt('Quickly and with energy', [N('Yes. Brisk walking is fast and purposeful. Not running, which would look suspicious.')], true),
            opt('Slowly and sleepily', [N('Not with a pirate behind her! She wants to get away fast, so “briskly” means quickly and with energy.')]),
            opt('Backwards', [N('Ha! That would be quite a trick. “Briskly” means quickly and with energy.')]),
          ],
          'Used clues in the story to work out the meaning of “briskly”.',
          'L.2.4',
        ),
      ],
    ),
    scene(
      'q59-chase',
      [
        N('You tumble into your boat and push off. Behind you, the pirate ship swings round, sails cracking.'),
        T('You STOLE it? You tell me off for picking fruit from other people’s trees!', 'angry'),
        K('It was already stolen! I’m borrowing it from the thieves. That’s practically returning it.'),
        P('This is so exciting! Are we pirates now? Can I have a hat?', 'happy'),
        CH('Bring back my scroll! And my whistle! He never paid for the whistle!', 'angry'),
        P('Oh. Oops.', 'shock'),
        N('The river narrows and tips downhill. The water speeds up and churns white around the rocks.'),
        N('Your Swim Nubbins leap in and paddle hard, pushing the boat along like little furry engines.'),
      ],
      [
        ask(
          2,
          'sel',
          'think question: is taking from a thief still stealing?',
          [N('Nalu says taking something from a thief is “practically returning it”. What do you think?')],
          [
            opt('It’s still taking. It should go back to its real owners.', [K('…You might be right. I need to think about who it really belongs to.', 'think')]),
            opt('It’s fair. The pirates stole it first.', [T('I can see that. But Nalu isn’t the owner either. So who should end up with it?')]),
            opt('It depends what she does with it next.', [K('Hm. That’s a good point. What I do next matters a lot.', 'think')]),
          ],
          'Thought about whether taking something from a thief is fair, and who it really belongs to.',
          'CASEL: Responsible decision-making',
        ),
        notice(
          7,
          'science',
          'pushing water back moves a boat forward',
          [
            N('Your Nubbins push the water backwards with their paws, and the water pushes the boat forwards.'),
            T('Same as rowing. Push the water back, go forward. I knew that. I was just checking.'),
          ],
          'Learned that pushing water backwards makes a boat move forwards.',
          '3-PS2-1',
        ),
      ],
      [
        ch('wrong', 'Tell Nalu it was wrong', [K('I know. I’ll make it right. After we don’t get caught.', 'sad')], { 'q59-told-off': true }),
        ch('cause', 'Tell Nalu it’s for a good cause', [
          K('Thank you. See, Tuk? The Keeper understands.'),
          T('The Keeper is now part of a crime. Congratulations, Keeper.'),
        ]),
        ch(
          'whistle',
          'Make Pemba blow the whistle',
          [N('Pemba blows. Somewhere far upriver, a very confused sky bison turns his head.')],
          { 'q59-whistle': true },
        ),
      ],
    ),
    scene(
      'q59-chase-done',
      [
        N('Ahead, two big rocks stick up out of the rapids with a narrow gap between them.'),
        N('Your little boat slips through. The pirate ship, which is much wider, does not.'),
        N('It wedges itself between the rocks with a sad crunch. You sail on.'),
        CH('THIS ISN’T OVER! Also, does anyone have a long pole?', 'angry'),
        T('Small boat, big win. I’m putting that on a flag.'),
        P('Bye! Sorry about the whistle! I’ll pay you back!', 'happy'),
      ],
      [
        ask(
          1,
          'maths',
          'compare lengths in metres',
          [
            T('The gap is 3 metres wide. Our boat is 2 metres wide. The pirate ship is 6 metres wide.'),
            T('Which one fits through?'),
          ],
          [
            opt('Only our boat', [T('Right. 2 metres fits in a 3-metre gap with 1 to spare. 6 metres is twice as wide as the gap. Crunch.')], true),
            opt('Both of them', [T('The pirate ship is 6 metres: that’s twice as wide as the 3-metre gap. Only our 2-metre boat fits.')]),
            opt('Only the pirate ship', [T('It’s the other way round! 6 metres won’t fit in 3. Our 2-metre boat slips through.')]),
          ],
          'Compared widths in metres to decide what fits through a gap.',
          '4.MD.A.2',
        ),
      ],
    ),
    scene(
      'q59-complete',
      [
        N('That night by the fire, Nalu unrolls the scroll and practises one move over and over: a whip of water, snapping out and back.'),
        K('Look! I did it! I actually did it!', 'happy'),
        T('Great. Now do the move where we don’t steal things.'),
        K('I’ll take it to the water villages once I’ve learned it. It belongs to them. I promise.', 'soft'),
        K('And I won’t forget how my tummy twisted when I picked up that case.', 'think'),
        N('Your Swim Nubbins have been watching closely. One flicks its tail at the stream, and a ribbon of water snaps through the air.'),
        P('Your Nubbin can do it too! Your Nubbin learned waterbending!', 'happy'),
      ],
      [
        notice(
          4,
          'sel',
          'noticing feelings in your body',
          [
            K('That twisty feeling in my tummy was my conscience. It’s the part of you that knows when something isn’t right.'),
            N('Feelings often show up in our bodies first. Noticing them can help you make a better choice next time.'),
          ],
          'Learned that a “twisty tummy” can be a feeling worth listening to before making a choice.',
          'CASEL: Self-awareness',
        ),
        notice(
          5,
          'science',
          'liquids take the shape of their container',
          [
            N('Water is a liquid. It has no shape of its own: it takes the shape of whatever holds it.'),
            N('In a cup, it’s cup-shaped. In a river, it’s river-shaped. That’s what makes it so good at bending and whipping.'),
          ],
          'Learned that liquids like water take the shape of their container.',
          '2-PS1-1',
        ),
      ],
    ),
  ],
  glossary: [
    gloss('moored', 'Tied up so it can’t float away, like a boat at a dock.', 'q59-market'),
    gloss('haggle', 'To argue about a price to try to make it lower.', 'q59-market'),
    gloss('briskly', 'Quickly and with energy.', 'q59-market-done'),
    gloss('practically', 'Almost, or very nearly.', 'q59-chase'),
    gloss('churns', 'Stirs and swirls about roughly.', 'q59-chase'),
    gloss('wedges', 'Gets stuck tight in a narrow space.', 'q59-chase-done'),
    gloss('conscience', 'The feeling inside you that tells you whether something is right or wrong.', 'q59-complete'),
  ],
  notes:
    'Lessons: change from 100 (100 − 45 = 55); “briskly” from context; think question on taking from a thief; ' +
    'pushing water back to move forward; comparing widths in metres; conscience as a body feeling; liquids take ' +
    'the shape of their container. Nalu’s “borrowing” stays wrong-but-understandable, and she promises to return it.',
};

// ================================================================== Q60 The Winged Lemur
const Q60: EduQuest = {
  id: 'reader:q60',
  of: 'q60',
  band: 'reader',
  title: 'The Winged Lemur',
  goals: {
    'q60-s1': {
      goal: 'Follow the winged lemur through the old temple ruins.',
      hint: 'It glides from high ledge to high ledge. Climb where it lands, and keep your eyes on its tail.',
    },
    'q60-s2': {
      goal: 'Make friends with the lemur: feed it three fruits by hand.',
      hint: 'Hold the fruit out and stay still. It comes closer each time, as long as you don’t grab.',
    },
  },
  scenes: [
    scene(
      'q60-thief',
      [
        N('Your fruit basket is empty. Again. There are tiny footprints in the dew, and a peach stone on the fence.'),
        P('Third time this week? That’s no bird. Birds don’t leave the stones in a neat little pile.', 'think'),
        N('Above you, something with huge ears and leathery wings sits on a branch, eating your last peach.'),
        N('“Chirrup!” chirps the lemur, delighted with itself.'),
        P('A winged lemur! I haven’t seen one since I was little. They used to live at the old temple.', 'happy'),
        N('The lemur stuffs the peach in its cheek, launches off the branch and glides away towards the hills.'),
        P('Come on, let’s follow it! Gently! Wingy little things scare easily.'),
      ],
      [
        ask(
          5,
          'science',
          'body parts that help animals survive',
          [P('Look at it! Big ears, big eyes, wings and a long tail. Which part helps it get away from us so fast?')],
          [
            opt('Its wings', [P('Yes! Its wings let it glide from tree to tree. Every part of an animal’s body helps it survive somehow.')], true),
            opt('Its ears', [P('Its big ears help it hear us coming! But for getting away fast, it’s the wings.')]),
            opt('Its tail', [P('The tail helps it balance on branches. But for getting away fast: wings!')]),
          ],
          'Matched an animal’s body parts to the jobs they do, like wings for escaping.',
          '4-LS1-1',
        ),
        notice(
          6,
          'science',
          'a real gliding animal: the colugo',
          [
            N('In our world there’s an animal called a colugo, sometimes nicknamed a “flying lemur”.'),
            N('It isn’t really a lemur, and it can’t really fly. It glides between trees on a cape of stretchy skin between its legs.'),
          ],
          'Learned about the colugo, a real gliding animal sometimes called a “flying lemur”.',
        ),
      ],
      [
        ch('chase', 'Run after it', [N('You run. The lemur looks back, and seems to decide this is a game.')]),
        ch('bait', 'Leave a fruit out as bait', [P('Smart! It’ll come back for more. Then we follow it home.')], { 'q60-bait': true }),
        ch('name', 'Ask what you should call it', [
          P('Not yet. A name should fit, and we hardly know it.', 'think'),
          N('From up the hill, the lemur chirrups, as if it agrees.'),
        ]),
      ],
    ),
    scene(
      'q60-thief-done',
      [
        N('You follow the lemur up the hill to the ruins of an old temple.'),
        N('Under the broken roof you find its nest. You tip it out carefully to see what’s inside.'),
        N('Twelve fruit stones. Five buttons. Three shiny pebbles. And one of your spoons.'),
        P('Oh. It lives up here all alone.', 'soft'),
        P('Let’s put everything back exactly how we found it. It’s its home, after all.'),
        N('Your Nubbin puts the spoon back in the nest. Then, after a long think, it takes the spoon out again.'),
      ],
      [
        act(
          2,
          'maths',
          'make and read a tally chart',
          'edu:tally:nest-treasures',
          [
            P('Let’s make a tally chart before we put it all back!'),
            N('Draw a tally mark for each thing: fruit stones, buttons, pebbles, spoons. Four marks and a line across makes five.'),
            P('Fruit stones win by a mile. Twelve! That’s more than all the others put together.', 'happy'),
          ],
          'Made a tally chart of the nest’s treasures and compared the totals (12 is more than 5 + 3 + 1).',
          '2.MD.D.10',
        ),
      ],
    ),
    scene(
      'q60-friends',
      [
        N('The temple is quiet and cold. Faded paintings on the walls show monks laughing with lemurs on their shoulders.'),
        P('This is where I learned to fly. It used to be full of people. Now it’s just… this.', 'sad'),
        N('The lemur peeks down from a beam. It watches Pemba, then you, then your Nubbin.'),
        P('It’s been on its own for ages. It isn’t really stealing. It’s just hungry and lonely. Like me, a bit.', 'soft'),
        N('Your Nubbin takes a fruit from your bag, walks to the middle of the floor and sits holding it up high.'),
        N('It doesn’t move a whisker. It doesn’t grab. It just waits.'),
        N('“…Chirr?” The lemur tilts its head.'),
      ],
      [
        ask(
          3,
          'sel',
          'showing empathy to a sad friend',
          [N('Pemba is sad about the empty temple. What could you say to help?')],
          [
            opt('“It sounds like you really miss it.”', [P('…Yeah. I do. Thanks for noticing.', 'soft')], true),
            opt('“Let’s talk about snacks instead.”', [P('Snacks are nice. But I think I needed someone to notice I was sad first.', 'soft')]),
            opt('“Don’t be sad.”', [P('I can’t just switch it off. But it helps when someone says it’s okay to miss things.', 'soft')]),
          ],
          'Practised noticing and naming a friend’s sad feelings.',
          'CASEL: Social awareness',
        ),
        notice(
          5,
          'science',
          'how to be calm around a wild animal',
          [
            N('Wild animals are often frightened by sudden movements and loud noises.'),
            N('Staying still and quiet, like your Nubbin, shows an animal you are not a danger. Then it can choose to come closer.'),
          ],
          'Learned that staying still and quiet helps a wild animal feel safe.',
        ),
      ],
    ),
    scene(
      'q60-friends-done',
      [
        N('The lemur creeps closer. One fruit. Two. Three. On the third, it lands on your shoulder.'),
        N('It wraps its long tail round your neck and falls asleep. It is warm, and it smells faintly of peaches.'),
        P('It likes you! Ha, it really likes you!', 'happy'),
        P('So… do we take it home? Or is this its home? It’s the only one it’s ever had.', 'think'),
        P('It can’t tell us in words. We have to work out what’s fair to it.'),
        N('The lemur snores. It is not helping.'),
      ],
      [
        ask(
          4,
          'sel',
          'think question: being fair to animals',
          [N('Animals can’t say yes or no in words. How can we be fair to them when we decide things for them?')],
          [
            opt('Watch what it does. If it follows us, it wants to come.', [P('Good thinking. Animals “talk” with what they do.')]),
            opt('Take it where there’s food and friends. That’s good for it.', [P('That’s caring. Food and friends matter a lot to a lonely lemur.', 'soft')]),
            opt('Let it stay. This is its home.', [P('That’s fair too. Home matters, even when it’s a bit broken.', 'soft')]),
          ],
          'Thought about how to be fair to an animal that can’t say what it wants.',
          'CASEL: Responsible decision-making',
        ),
      ],
      [
        ch(
          'q60-carry',
          'Carry it home to the Grove',
          [P('The Grove has fruit and friends. That’s a good kind of home to be carried to.', 'soft')],
          { 'q60-home': 'carried' },
        ),
        ch(
          'q60-choose',
          'Set it down, leave the door open and let it choose',
          [
            N('You set it on a beam and walk away slowly. Halfway down the hill, there’s a flap of wings, and a weight on your shoulder.'),
            P('It chose you! It chose us!', 'happy'),
          ],
          { 'q60-home': 'chose' },
        ),
      ],
    ),
    scene(
      'q60-complete',
      [
        P('Right. Shiny things, sneaky snacks, enormous eyes. I’ve got it. You’re Lumi!', 'happy'),
        P('Welcome home, Lumi. The Grove has fruit and friends, and nobody’s alone there.', 'soft'),
        M('Chirrup chirrup!', 'happy'),
        N('Lumi rides home on your shoulder, nibbling your hair.'),
        N('That night it sleeps curled up in the fruit basket, which explains a lot.'),
        N('Its huge eyes stay open long after everyone else is asleep, watching the dark garden.'),
        P('Every Grove needs a little thief. Just… count your spoons.', 'happy'),
      ],
      [
        notice(
          5,
          'science',
          'nocturnal animals and big eyes',
          [
            N('Big eyes are a clue! Many animals that are busy at night have very large eyes, to catch every bit of dim light.'),
            N('Real colugos come out at night too. Animals that are awake at night are called nocturnal.'),
          ],
          'Learned that many nocturnal animals have large eyes to see in dim light.',
          '4-LS1-1',
        ),
      ],
    ),
  ],
  glossary: [
    gloss('leathery', 'Tough and smooth, a bit like leather.', 'q60-thief'),
    gloss('glide', 'To move smoothly through the air without flapping.', 'q60-thief'),
    gloss('ruins', 'What is left of an old building that has fallen down.', 'q60-thief-done'),
    gloss('tally', 'A mark you make to keep count of things.', 'q60-thief-done'),
    gloss('faded', 'Lost its colour slowly over a long time.', 'q60-friends'),
    gloss('nocturnal', 'Awake and busy at night, and asleep in the day.', 'q60-complete'),
  ],
  notes:
    'Lessons: body parts and survival (4-LS1-1); the colugo, a real glider that is neither a lemur nor a flier; ' +
    'tally chart (do); empathy for Pemba; staying calm around wild animals; think question on fairness to animals ' +
    '(it pairs with the carry/choose choice); nocturnal animals and big eyes.',
};

// ================================================================== Q61 Avatar Day
const Q61: EduQuest = {
  id: 'reader:q61',
  of: 'q61',
  band: 'reader',
  title: 'Avatar Day',
  goals: {
    'q61-s1': {
      goal: 'Search the Kettleby records hall for the true story of Marshal Brag.',
      hint: 'Records are filed by year, with the oldest at the back. Your Nubbin can squeeze behind the dusty shelves.',
    },
    'q61-s2': {
      goal: 'Show the evidence at Pemba’s trial.',
      hint: 'Choose your strongest piece. Any of them will do; some get a bigger cheer.',
    },
  },
  scenes: [
    scene(
      'q61-trial',
      [
        N('Kettleby is having a festival. There is bunting, there are sweets, and there is a straw statue of a past Avatar.'),
        N('People are hitting the statue with sticks.'),
        P('Hey! That’s Avatar Kesh! She was me, a long time ago. Sort of. It’s complicated.', 'shock'),
        TI('He admits it! Four hundred years ago, Avatar Kesh ruined our founder, the Great Marshal Brag!', 'angry'),
        P('Wait, what? What did she do?'),
        TI('She split the land in two, and Marshal Brag fell into the sea! Now you shall stand trial for it!'),
        T('Hold on. He’s twelve. Four hundred years ago he wasn’t even a thought.'),
        TI('Under Kettleby law, every past life counts. It’s in the rules. We wrote the rules.'),
        N('Two guards walk Pemba to a cage. It has bunting on it. Pemba waves at you through the bars, smiling a small smile.'),
        K('We need proof that Kesh wasn’t the villain. Where do they keep the old records?', 'angry'),
      ],
      [
        ask(
          7,
          'social-studies',
          'think question: judging the past fairly',
          [
            T('Kettleby wants to punish Pemba for something Kesh did four hundred years ago.'),
            N('Is it fair to blame someone today for what someone else did long ago? What do you think?'),
          ],
          [
            opt('No. You can only be blamed for your own choices.', [T('That’s how I see it. Pemba wasn’t there. He didn’t choose any of it.')]),
            opt('Maybe, if he really is the same person.', [
              K('Hm. That’s a real puzzle. Is someone with a past life the same person? Even grown-ups argue about that.', 'think'),
            ]),
            opt('We need to find out what really happened first.', [K('Yes! Before anyone blames anyone, get the facts. That’s exactly what we’re going to do.')]),
          ],
          'Thought about whether people today can be blamed for what others did in the past.',
          'D2.Civ.8.K-2',
        ),
        notice(
          8,
          'sel',
          'reading a brave face',
          [
            N('Pemba is smiling, but his wave is small and slow. Sometimes people smile even when they feel scared.'),
            K('Hang on, Pemba. We’re coming back for you.', 'soft'),
          ],
          'Noticed that a smile can hide a worried feeling, and that a kind word helps.',
          'CASEL: Social awareness',
        ),
      ],
      [
        ch('fair', 'Ask for a fair trial', [TI('Of course! Fair, quick, and finished by lunch.')]),
        ch(
          'tuk',
          'Let Tuk do the talking',
          [T('Mr Mayor. Your Honour. Sir. I represent the defence.'), TI('Do you have any experience?'), T('I’ve read a book.')],
          { 'q61-tuk-lawyer': true },
        ),
        ch('sweet', 'Buy a festival sweet', [N('It is shaped like a smashed statue. It tastes of peppermint and guilt.')], { 'q61-sweet': true }),
      ],
    ),
    scene(
      'q61-trial-done',
      [
        N('The records hall is dark and dusty. Shelves stretch back and back, each one labelled with a year.'),
        K('Newest at the front, oldest at the back. It’s 1425 now, and Kesh lived four hundred years ago.'),
        T('So we want 1025. Right at the back. Of course it’s right at the back.'),
        N('Your Nubbin squeezes behind the oldest shelf. There is a sneeze, a scrabble and a cloud of dust.'),
        N('It comes back out holding a scroll sealed with Marshal Brag’s own stamp, and an old map it has been using as a blanket.'),
        K('It’s his diary. Written by Brag himself. Look at this entry. And this one.', 'shock'),
      ],
      [
        act(
          2,
          'maths',
          'put years in order, oldest first',
          'edu:order:years:oldest-first',
          [
            N('Help your Nubbin find the way. Put these shelf labels in order, oldest first: 1400, 1025, 1250, 1180.'),
            N('Oldest means the smallest year number: 1025, 1180, 1250, 1400.'),
            K('So the very back shelf is 1025. That’s where Brag’s papers will be.'),
          ],
          'Ordered four-digit years from oldest (smallest) to newest (largest).',
        ),
        notice(
          5,
          'social-studies',
          'a diary is evidence from the time',
          [
            K('A diary is one of the best kinds of evidence. It was written at the time, by someone who was really there.'),
            N('Stories told later can grow and change as people pass them on. A diary stays just as it was written.'),
          ],
          'Learned why a diary written at the time is strong evidence about the past.',
          'D2.His.2.K-2',
        ),
      ],
    ),
    scene(
      'q61-evidence',
      [
        N('The trial is held in the village square. The judge is Mayor Tibbs. The jury is also Mayor Tibbs.'),
        N('Mrs Tibbs, the mayor’s wife, is in the front row.'),
        MT('Dear. You can’t be the judge. You can’t find your own socks.'),
        TI('I found one of them.'),
        TI('The prisoner may speak, but briefly. We have a parade at four.'),
        T('Your Honour. We have found Marshal Brag’s diary, written in his own hand.'),
        K('“Today I shall march onto Avatar Kesh’s island and take it. Then the next island. Then all the islands.”'),
        T('“Note to self: build a bigger hat.”'),
        N('The crowd murmurs. Someone at the back takes off a Marshal Brag hat and quietly puts it in a bin.'),
        TI('That… does sound a bit like a bully.', 'shock'),
        K('Kesh didn’t attack anyone. She protected her home. Brag fell in because he wouldn’t step back when the cliff cracked.'),
        TI('One more piece of evidence and I’ll be convinced. Keeper? What else did you find?', 'think'),
      ],
      [
        notice(
          0,
          'social-studies',
          'what makes a trial fair',
          [
            T('Hang on. One person is the accuser, the judge AND the jury? That hardly seems fair.'),
            N('In a fair trial, the people who decide should listen to both sides before they make up their minds.'),
            N('That’s why real courts have a judge, and often a jury, who did not bring the case.'),
          ],
          'Thought about why fair trials need people who listen to both sides before deciding.',
          'D2.Civ.8.K-2',
        ),
        ask(
          7,
          'literacy',
          'describe a character from his own words',
          [N('Brag’s own words tell us what he was like. Which word fits him best?')],
          [
            opt('Greedy: he wanted island after island.', [K('Yes. Take one island, then the next, then all of them. That’s greed, in his own handwriting.')], true),
            opt('Kind', [T('Kind people don’t plan to take everyone’s islands. His words show he was greedy.')]),
            opt('Shy', [T('A shy person doesn’t want a bigger hat! His words show he was greedy, and a bit of a show-off.')]),
          ],
          'Described a character’s traits using evidence from his own words.',
          'RL.3.3',
        ),
      ],
      [
        ch(
          'stone',
          'Point at the founding stone under the statue',
          [TI('“Thank you, Kesh, for our peace.” It was under the statue all along!', 'shock')],
          { 'q61-evidence': 'stone' },
        ),
        ch(
          'map',
          'Show the old map with Kettleby on Kesh’s side',
          [TI('We were… on her island. Oh dear. She was protecting us.')],
          { 'q61-evidence': 'map' },
        ),
        ch(
          'kind',
          'Point out that Pemba has been nice to everyone all day',
          [TI('That is not evidence. That is, however, very true.', 'soft')],
          { 'q61-evidence': 'kind' },
        ),
      ],
    ),
    scene(
      'q61-evidence-done',
      [
        TI('The court finds the prisoner… not guilty! Release the Avatar!'),
        N('The guards open the cage. Pemba steps out, still wearing a strand of bunting like a scarf.'),
        P('Yay! Can I keep the bunting?', 'happy'),
        TI('Take it! Started at quarter past three, finished at twenty to four. The fastest trial in Kettleby history!', 'happy'),
        P('Keeper? Even if Kesh had done something bad… should I say sorry for it? It wasn’t me. But it sort of was.', 'think'),
        N('Pemba waits for your answer. For once, he is completely still.'),
      ],
      [
        ask(
          3,
          'maths',
          'find a time interval to the minute',
          [T('Quarter past three to twenty to four. How long did the trial take?')],
          [
            opt('25 minutes', [T('Yes. Quarter past three is 3:15. Twenty to four is 3:40. From 15 to 40 is 25 minutes.')], true),
            opt('20 minutes', [T('Close! 3:15 to 3:35 is 20 minutes, and five more gets to 3:40. That’s 25.')]),
            opt('45 minutes', [T('That would be 3:15 to 4:00. But it finished at twenty to four, which is 3:40. That’s 25 minutes.')]),
          ],
          'Worked out the time from 3:15 to 3:40: 25 minutes.',
          '3.MD.A.1',
        ),
      ],
      [
        ch(
          'q61-not-yours',
          '“You’re not to blame for what she did.”',
          [P('Okay. Then I’ll just try to be someone who deserves a nicer statue.', 'soft')],
          { 'q61-past': 'not-yours' },
        ),
        ch(
          'q61-make-right',
          '“It isn’t your fault. But you can still help fix things.”',
          [
            P('Oh. I like that better than blame. Blame just sits there. Fixing gets to do things.', 'happy'),
            T('Write that down. That’s going on a sign.'),
          ],
          { 'q61-past': 'make-right' },
        ),
      ],
    ),
    scene(
      'q61-complete',
      [
        N('That evening the straw statue comes down. In its place the villagers build a new one. It looks a lot like Pemba.'),
        TI('From now on, Avatar Day will be Pemba Day! With fewer sticks and more sweets.', 'happy'),
        P('That’s the best day I’ve ever heard of!', 'happy'),
        T('You realise you’re a holiday now. That’s going to go straight to your head.'),
        P('It’s already in my head. It’s having a party.'),
        TI('And from now on, we read our own records before anyone picks up a stick. We should have done that years ago.', 'soft'),
        N('The mayor hands you a painted festival mask, and an invitation: Pemba Day will come once to the Grove.'),
      ],
      [
        ask(
          5,
          'literacy',
          'find the theme of a story',
          [N('Every good story teaches something. What lesson did Kettleby learn today?')],
          [
            opt('Find out the facts before you blame someone.', [TI('Exactly. We had the truth on our own shelves all along. We just never looked.', 'soft')], true),
            opt('Statues are a bad idea.', [N('The statue wasn’t the problem. Blaming without checking was. The lesson: find out the facts first.')]),
            opt('Never have festivals.', [N('Ha! They’re having a bigger festival than ever. The lesson is to find out the facts before you blame someone.')]),
          ],
          'Named the theme of the quest: find out the facts before blaming anyone.',
          'RL.4.2',
        ),
      ],
    ),
  ],
  glossary: [
    gloss('founder', 'The person who started a town, a club or a business.', 'q61-trial'),
    gloss('trial', 'A meeting where someone decides whether a rule or law has been broken.', 'q61-trial'),
    gloss('evidence', 'Facts or things that help show what is true.', 'q61-trial-done'),
    gloss('entry', 'One piece of writing in a diary, usually for one day.', 'q61-trial-done'),
    gloss('jury', 'A group of people who listen at a trial and decide what is true.', 'q61-evidence'),
    gloss('murmurs', 'Talks in low, quiet voices.', 'q61-evidence'),
    gloss('guilty', 'Having done the wrong thing you are accused of.', 'q61-evidence-done'),
  ],
  notes:
    'Lessons: think question on blaming people for the past (D2.Civ.8.K-2); reading a brave face; ordering years ' +
    '(do); a diary as evidence from the time; what makes a trial fair; Brag’s traits from his own words; 3:15 to ' +
    '3:40; theme. Brag only “fell into the sea”, as in the main script. Both q61-past answers are treated as right.',
};

// ================================================================== Q62 Penguin Sledding
const Q62: EduQuest = {
  id: 'reader:q62',
  of: 'q62',
  band: 'reader',
  title: 'Penguin Sledding',
  goals: {
    'q62-s1': {
      goal: 'Break Pemba out of the block of ice.',
      hint: 'Tap the glowing cracks. Your Nubbins warm the ice when they huddle close.',
    },
    'q62-s2': {
      goal: 'Make friends with a penguin and race Pemba down the snowy hill.',
      hint: 'Offer a fish first, then lean left and right to steer. Lying flat on your tummy is fastest.',
    },
  },
  scenes: [
    scene(
      'q62-iceberg',
      [
        N('Snow covers the Grove. On the bank of the frozen pond, Nalu and Tuk are poking at a huge block of ice that wasn’t there yesterday.'),
        T('For the record, I said leave it. Mysterious glowing ice is never good news.'),
        K('It’s Pemba! He sat down by the pond last night to meditate, and he just… didn’t stop.', 'shock'),
        T('Or, hear me out, we fetch a grown-up with a chisel. And nobody sets foot on that pond. Pond ice is thinner than it looks.'),
        N('Your Nubbin presses its paws to the ice and looks up at you. Under the surface, a blue arrow glows faintly.'),
        K('Please. He could be freezing in there.'),
        T('He’s inside a block of ice, Nalu. I think it’s a bit late to worry about that.'),
      ],
      [
        ask(
          6,
          'science',
          'melting and freezing can be reversed',
          [K('Think! How can we turn this ice back into water?')],
          [
            opt('Warm it up', [
              K('Yes! Heat melts ice into water. And if the water gets cold enough, it freezes back into ice. It works both ways.'),
            ], true),
            opt('Shout at it', [T('I’ve tried. It doesn’t listen. Warmth is what melts ice.')]),
            opt('Pile more snow on it', [K('More snow would keep it cold! We need warmth to melt it.')]),
          ],
          'Learned that warming melts ice into water, and cooling can freeze it again.',
          '2-PS1-4',
        ),
      ],
      [
        ch('crack', 'Crack it with a stone', [N('You strike. A thin crack zigzags across the ice.')]),
        ch(
          'huddle',
          'Get your Nubbins to huddle round it',
          [N('Your Nubbins press together against the ice. It starts to drip, then trickle.')],
          { 'q62-huddle': true },
        ),
        ch('tuk', 'Hand Tuk his boomerang', [T('Fine. FINE. But once he’s defrosted, he’s hearing all about who said leave it.')]),
      ],
    ),
    scene(
      'q62-iceberg-done',
      [
        N('Drip. Trickle. Crack! The ice splits with a whoosh of air.'),
        N('Pemba sits up and blinks. His eyebrows have gone white with frost.'),
        K('Are you all right? Are you cold? Are you hurt?', 'shock'),
        N('Your Nubbins huddle round him in a warm, furry heap.'),
        P('Morning, everyone! Have I missed breakfast? And, important question: any penguins?'),
        T('Of all the questions. OF ALL THE QUESTIONS.'),
      ],
      [
        notice(
          3,
          'science',
          'animals in groups keep each other warm',
          [
            K('Huddling is clever. Emperor penguins do it all winter, crowding together to share warmth in the freezing wind.'),
            N('They even take turns. The ones on the cold outside shuffle slowly into the warm middle.'),
          ],
          'Learned that emperor penguins huddle and take turns to survive the cold together.',
          '3-LS2-1',
        ),
      ],
    ),
    scene(
      'q62-sled',
      [
        K('Do we have… what?'),
        P('Penguins! A whole row of them waddled past while I was meditating. Round ones. Slippy ones.', 'happy'),
        T('He spent the whole night as an ice cube, and his first question is about penguins.'),
        P('What would your first question be?'),
        T('…Probably “where’s the food”. Okay, fair.', 'think'),
        K('Pemba… how long were you stuck in there?', 'soft'),
        P('All night, I think. It was lovely and calm. And then it was very, very cold.'),
        P('I need warming up. Do you think a penguin would let me sit on it?', 'happy'),
        N('On the snowy hill, a line of penguins waddles past, sleek and round and not at all in the mood.'),
        P('The trick is fish. You give them a fish, they give you a ride. Everyone knows that.'),
        N('Your Nubbin is already holding out a fish to the smallest penguin. The penguin considers it carefully.'),
        P('Race you to the bottom! Loser carries the fish!', 'happy'),
        N('The smallest penguin takes the fish, looks at Pemba, and waddles over to your Nubbin instead. It has chosen.'),
        T('That penguin has better judgement than most of us.'),
      ],
      [
        ask(
          6,
          'sel',
          'think question: too much of a good thing',
          [
            N('Meditating is good for Pemba. It makes him calm. But he did it for so long that he froze.'),
            N('Can a good thing turn into too much? What do you think?'),
          ],
          [
            opt('Yes. Even good things need a stopping point.', [P('That’s fair. Next time I’ll set an alarm. A loud one.', 'happy')]),
            opt('No. Good things are always good.', [
              K('Lots of good things stay good. But too much sun, or too much cake, or too much sitting in the snow…', 'think'),
              K('I think how much matters too.'),
            ]),
            opt('It depends on the thing, and on how you feel.', [K('That’s wise. Your body usually tells you when to stop. Pemba just wasn’t listening.')]),
          ],
          'Thought about whether a good thing can become too much, and how to notice when to stop.',
          'CASEL: Self-management',
        ),
        notice(
          9,
          'science',
          'penguins are birds that swim and slide',
          [
            K('Penguins are birds, but they can’t fly. They swim instead, and they catch fish to eat.'),
            T('And on ice, penguins sometimes slide along on their tummies, pushing with their feet. It’s faster than waddling.'),
          ],
          'Learned that penguins are flightless birds that swim, eat fish and slide on their bellies.',
        ),
      ],
    ),
    scene(
      'q62-sled-done',
      [
        N('The penguin flops onto its tummy. You flop onto its back. Your Nubbin flops onto you.'),
        N('Down the hill you whizz, over the snow, then across a long, glassy frozen puddle at the bottom and into a snowdrift.'),
        N('On the snow you were fast. On the ice you were even faster, and you hardly slowed down at all.'),
        N('Pemba lands beside you, laughing too hard to stand.'),
        P('Again! Again! AGAIN!', 'happy'),
        T('Hang on. Why did we go so much faster on the ice than on the snow?', 'think'),
      ],
      [
        ask(
          5,
          'science',
          'friction slows things down',
          [K('Good question. What do you think?')],
          [
            opt('Ice is smoother, so there’s less friction to slow us down.', [
              K('Exactly. Friction is a force that slows things when they rub together. Smooth ice has very little of it.'),
            ], true),
            opt('Penguins like ice better.', [
              K('They probably do! But the real reason is friction. Snow rubs and slows you more; smooth ice barely does.'),
            ]),
            opt('The ice was pushing us.', [K('Ice can’t push. It just has less friction, so there’s less to slow you down.')]),
          ],
          'Explained that smooth ice has less friction than snow, so sliders go faster on it.',
          '3-PS2-1',
        ),
      ],
    ),
    scene(
      'q62-complete',
      [
        K('I haven’t seen anyone laugh like that in a long time.', 'soft'),
        T('I haven’t seen anyone eat that much snow in a long time. You’re a walking snowman.'),
        P('The penguins say you can come back any snow day. Well, they didn’t say it. But they looked it.', 'happy'),
        P('Thanks for defrosting me, everyone. And for the penguin. The penguin was the best bit.', 'soft'),
        K('Next time you meditate in the snow, take a blanket. And a friend.', 'soft'),
        N('The penguins waddle home over the hill. The smallest one turns back to stare at your Nubbin, who waves.'),
      ],
      [
        ask(
          1,
          'literacy',
          'understand a metaphor',
          [N('Tuk calls Pemba “a walking snowman”. Is Pemba really a snowman?')],
          [
            opt('No. Tuk means he’s so covered in snow he looks like one.', [
              K('Yes. That’s a metaphor: saying someone IS something, to show what they’re like.'),
            ], true),
            opt('Yes. He turned into a snowman in the ice.', [
              T('Ha! He’d be a lot quieter if he had. It’s a metaphor: I mean he’s so snowy he looks like one.'),
            ]),
          ],
          'Explained a metaphor that calls a snow-covered friend “a walking snowman”.',
          'L.4.5',
        ),
      ],
    ),
  ],
  glossary: [
    gloss('chisel', 'A metal tool with a sharp edge, for chipping wood, stone or ice.', 'q62-iceberg'),
    gloss('meditate', 'To sit quietly and still for a while, calming your mind.', 'q62-iceberg'),
    gloss('huddle', 'To crowd closely together, often to keep warm.', 'q62-iceberg-done'),
    gloss('sleek', 'Smooth and shiny.', 'q62-sled'),
    gloss('considers', 'Thinks carefully about something.', 'q62-sled'),
    gloss('snowdrift', 'A deep heap of snow piled up by the wind.', 'q62-sled-done'),
    gloss('friction', 'A force that slows things down when they rub against each other.', 'q62-sled-done'),
  ],
  notes:
    'Lessons: melting and freezing both ways (2-PS1-4); emperor penguins huddle and rotate (3-LS2-1); think ' +
    'question on too much of a good thing; penguins swim and belly-slide; friction on ice and snow (3-PS2-1); ' +
    'the “walking snowman” metaphor. A mishap, not Pemba’s origin: he is already a friend from Q46 and froze in ' +
    'while meditating by the pond overnight. Nobody goes onto the pond ice (the block is on the bank, the sled ' +
    'run ends on a frozen puddle), to match the ice-safety lesson in reader:c10-ledge-l2.',
};

// ================================================================== Q63 King Rumbold’s Challenges
const Q63: EduQuest = {
  id: 'reader:q63',
  of: 'q63',
  band: 'reader',
  title: 'King Rumbold’s Challenges',
  goals: {
    'q63-s1': {
      goal: 'Fetch the king’s key from the bottom of the waterfall.',
      hint: 'A Swim Nubbin can dive into the pool. Otherwise, wait for the water to drop at noon.',
    },
    'q63-s2': {
      goal: 'Find Biscuit the goat-yak somewhere in Stonereach.',
      hint: 'Follow the bleating. Goat-yaks love high places and anything that looks like a cabbage.',
    },
    'q63-s3': {
      goal: 'Ride the mail chutes to the bottom of Stonereach with King Rumbold.',
      hint: 'Lean into the bends and duck under the letter slots. The king will not slow down.',
    },
  },
  scenes: [
    scene(
      'q63-throne',
      [
        N('In the city of Stonereach, carved into the cliffs, the king sits on a stone throne. He is very old, very wrinkled, and grinning.'),
        BU('Visitors! I love visitors. You will face three challenges. If you fail, you will be… hmm… sent home without pudding.', 'happy'),
        T('That’s… actually a pretty scary punishment.'),
        N('King Rumbold throws back his head and laughs: a loud, honking bray, like a donkey that has heard a very good joke.'),
        BU('Challenge one! I have dropped the key to my snack cupboard to the bottom of the waterfall. Fetch it!'),
        P('How did it get down there?'),
        BU('I threw it. I wanted to see if it could fly. It could not.', 'happy'),
        T('And before you try it, Your Majesty: keys don’t float either.'),
      ],
      [
        ask(
          3,
          'literacy',
          'understand a simile',
          [N('His laugh is “like a donkey that has heard a very good joke”. What does this simile tell you about it?')],
          [
            opt('It’s loud, honking and silly.', [N('Yes! Donkeys bray loudly. Adding “a very good joke” makes it sound happy and ridiculous too.')], true),
            opt('It’s quiet and polite.', [N('Have you ever heard a donkey bray? It’s very loud! The simile tells you his laugh is loud and silly.')]),
            opt('He looks like a donkey.', [N('The simile is about how his laugh sounds, not how he looks. Loud, honking and silly.')]),
          ],
          'Explained what a simile tells the reader about a character’s laugh.',
          'L.4.5',
        ),
        notice(
          7,
          'science',
          'why some things sink and others float',
          [
            T('A metal key is heavy for its size, so it sinks. A wooden spoon is light for its size, so it floats.'),
            N('Whether something floats depends on what it’s made of, not just on how big it is. A huge log floats; a tiny pebble sinks.'),
          ],
          'Learned that whether an object floats depends on its material, not just its size.',
          '2-PS1-1',
        ),
      ],
      [
        ch('accept', 'Accept the challenge', [BU('Wonderful! Off you go! Mind the fish, they nibble.')]),
        ch('why', 'Ask why he needs the key', [BU('Because I am hungry, child. Why does anyone want anything?', 'think')]),
        ch(
          'laugh',
          'Laugh along with him',
          [N('You laugh. He laughs harder. Your Nubbin brays. The guards look very tired.')],
          { 'q63-laughed': true },
        ),
      ],
    ),
    scene(
      'q63-throne-done',
      [
        N('Your Nubbin climbs back up the cliff path, dripping, with the key in its mouth.'),
        BU('My key! My snacks are safe! Challenge one complete!', 'happy'),
        N('He unlocks the cupboard and takes out a whole round cake, already cut into eight slices.'),
        BU('Would you like some? There are four of us. That’s… hmm… a lot of maths.', 'think'),
        N('Before anyone can answer, he eats the whole cake in one bite, without breaking eye contact.'),
        T('Eight slices. One bite. I’m impressed and upset at the same time.'),
      ],
      [
        ask(
          3,
          'maths',
          'unit fractions: sharing into quarters',
          [T('Eight slices, four of us. If we shared fairly, what fraction of the cake would each of us get?')],
          [
            opt('Two slices each: one quarter of the cake', [
              T('Yes! Eight shared by four is two each. Two out of eight is the same as one quarter. Not that it matters now.'),
            ], true),
            opt('One slice each: one eighth', [T('That would leave four slices over! Eight shared by four is two each: one quarter of the cake.')]),
            opt('Half each', [T('Half each only works for two people. With four of us, it’s a quarter each: two slices.')]),
          ],
          'Shared 8 slices among 4 and named each share as one quarter.',
          '3.NF.A.1',
        ),
      ],
    ),
    scene(
      'q63-pet',
      [
        BU('Challenge two! My pet, Biscuit, has run away again. He is somewhere in the city. Find him!'),
        T('What kind of animal is Biscuit?'),
        BU('He is a goat-yak. You will know him because he looks like a goat, and also like a yak.', 'happy'),
        N('A stone mail chute rattles past your head. Somewhere in the city, something bleats.'),
        T('Stone city. Narrow streets. One goat-yak. Okay, we sweep from the top down. Pemba, you take the roofs.', 'think'),
        P('I love roofs!', 'happy'),
        BU('Or! Instead of looking for Biscuit, you could think like Biscuit.', 'happy'),
        T('I am not going to think like a goat-yak.'),
        N('Your Nubbin is already climbing the highest wall in sight, chewing a leaf thoughtfully.'),
      ],
      [
        notice(
          8,
          'science',
          'mountain goats are built for climbing',
          [
            N('Thinking like Biscuit is good science! Real mountain goats are amazing climbers.'),
            N('Their hooves have hard edges, with soft, grippy pads underneath. That helps them cling to steep rock.'),
          ],
          'Learned how a mountain goat’s hooves help it climb steep rock.',
          '4-LS1-1',
        ),
      ],
    ),
    scene(
      'q63-pet-done',
      [
        N('You find Biscuit on a rooftop, eating a cabbage from a cart that looks very familiar.'),
        C('Not the cabbages! Not up there!'),
        T('I know that wail. Somebody’s having a bad cabbage day.'),
        BU('Biscuit! You found him! That’s two!', 'happy'),
        N('Biscuit chews the last leaf, looks at you, and burps.'),
        BU('He says thank you. That is how goat-yaks say thank you.'),
      ],
      [
        ask(
          5,
          'sel',
          'putting things right when your pet causes trouble',
          [N('Biscuit ate the cabbage merchant’s cabbage. What would be the fair thing to do?')],
          [
            opt('Pay the merchant back for the cabbage.', [
              BU('Quite right! The royal purse shall pay. Biscuit, that comes out of your pocket money.', 'happy'),
            ], true),
            opt('Nothing. Biscuit is only a goat-yak.', [
              N('Biscuit didn’t know better, but his owner does. Fixing the harm is still fair: pay the merchant back.'),
            ]),
            opt('Blame the merchant for leaving it out.', [
              N('Leaving a cart in the street isn’t asking for it to be eaten! The fair thing is to pay him back.'),
            ]),
          ],
          'Decided that when your pet causes harm, the fair thing is to put it right.',
          'CASEL: Responsible decision-making',
        ),
      ],
    ),
    scene(
      'q63-opponent',
      [
        BU('Challenge three. The last, and the most dangerous. You must face an opponent. And you may choose who!'),
        N('He points to a huge guard with a hammer, to a hulking rock beast in a cage, and to himself.'),
        T('Okay. Easy. Don’t pick the beast. Don’t pick the hammer. Pick the very old man.'),
        P('Tuk, I think the very old man is the scary one.', 'think'),
        BU('Choose wisely! Or unwisely! I enjoy both!', 'happy'),
        N('Your Nubbin points at the guard, then the beast, then shakes its head firmly at both.'),
      ],
      [
        ask(
          4,
          'literacy',
          'predict using what you know about a character',
          [N('So far, King Rumbold’s challenges have been a thrown key and a runaway pet. What do you predict challenge three really is?')],
          [
            opt('Something silly and fun', [N('Good prediction! Everything the king does is a bit silly. Let’s see if you’re right.')], true),
            opt('A real, terrible fight', [N('It could be! But the king loves jokes. His challenges so far were silly, so this one probably is too.')]),
            opt('A maths test', [N('Ha! There was some maths with the cake. But the king seems to like fun more than tests.')]),
          ],
          'Used what a character has done so far to predict what he will do next.',
          'RL.3.3',
        ),
      ],
      [
        ch(
          'guard',
          'Choose the guard',
          [BU('Wrong! Your true opponent is… the MAIL CHUTES! Nobody beats the mail chutes!', 'happy')],
          { 'q63-opponent': 'guard' },
        ),
        ch(
          'beast',
          'Choose the rock beast',
          [BU('Wrong! Your true opponent is… the MAIL CHUTES! Nobody beats the mail chutes!', 'happy')],
          { 'q63-opponent': 'beast' },
        ),
        ch(
          'king',
          'Choose King Rumbold himself',
          [BU('Ooh, closer! But still wrong!', 'happy'), BU('Your true opponent is… the MAIL CHUTES! And I am coming with you!')],
          { 'q63-opponent': 'king' },
        ),
      ],
    ),
    scene(
      'q63-opponent-done',
      [
        N('The mail chutes are long stone slides that carry letters from the top of the city to the bottom.'),
        N('You sit at the top. King Rumbold sits behind you. Nobody asks if this is allowed. He is the king.'),
        N('You start slowly. Then the chute tips steeply down, and you go faster and faster.'),
        N('You shoot out of the last chute into a pile of letters. The king lands on top of you, honking with laughter.'),
        BU('Again! Oh, wait. I’m the king. I can do this whenever I like.', 'happy'),
        T('Why do the steep bits go so much faster than the flat bits?', 'think'),
      ],
      [
        ask(
          5,
          'science',
          'gravity and slopes',
          [BU('Ah, a scientist! Well, Keeper? Why?')],
          [
            opt('Gravity pulls us down, and a steep slope lets it pull us along faster.', [
              BU('Exactly! Gravity always pulls down. The steeper the chute, the more of that pull sends you whizzing.', 'happy'),
            ], true),
            opt('The letters push us.', [BU('Ha! Letters are lazy. It’s gravity: it pulls you down, and a steep slope turns that pull into speed.')]),
            opt('The flat bits are sticky.', [
              BU('Not sticky! On the flat, gravity pulls you into the floor, not along it. On a steep chute, it pulls you along.'),
            ]),
          ],
          'Explained that gravity pulls things down a slope, and steeper slopes make them go faster.',
          '3-PS2-1',
        ),
        act(
          5,
          'science',
          'test a steep ramp against a gentle one',
          'edu:test:ramp:steep-gentle',
          [
            BU('Try it yourself! Lean a book on one other book to make a ramp, and roll a ball down it.'),
            N('Now add another book underneath to make the ramp steeper. Roll the ball again. Which run was faster?'),
            BU('The steep one! Gravity, at work. Now do it a hundred more times. I did.', 'happy'),
          ],
          'Tested a ball on a gentle ramp and a steeper ramp and compared the speeds.',
          '3-PS2-1',
        ),
      ],
    ),
    scene(
      'q63-complete',
      [
        BU('You passed. All three. Do you know why I set them?', 'soft'),
        P('To see if we were brave?'),
        BU('No. To see if you’d have fun. Most people forget how to play. I wanted to see if you remembered.'),
        T('That’s… surprisingly wise.'),
        BU('I know! Now take a bit of my mail chute. And my laugh. I have plenty.', 'happy'),
        BU('Biscuit also says thank you. He is saying it by eating your hat.'),
        N('You go home with a short stone slide for the Grove, and a laugh that makes everyone nearby turn round.'),
      ],
      [
        ask(
          3,
          'sel',
          'think question: why play matters',
          [BU('Most people forget how to play as they grow up. Why do you think playing matters, even for kings?')],
          [
            opt('It makes you happy, and happy people are kinder.', [BU('Ha! Yes. A happy king makes fewer silly laws. Mostly.', 'happy')]),
            opt('You learn things when you play.', [BU('Exactly! You learned about slopes today, and you never even noticed.')]),
            opt('It helps you make friends.', [BU('It does! I have never once made a friend while doing paperwork.', 'happy')]),
          ],
          'Thought about why play matters for people of every age.',
          'CASEL: Self-awareness',
        ),
      ],
    ),
  ],
  glossary: [
    gloss('throne', 'A special chair for a king or queen.', 'q63-throne'),
    gloss('bray', 'The loud, harsh noise a donkey makes.', 'q63-throne'),
    gloss('impressed', 'Feeling that someone has done something surprising or very good.', 'q63-throne-done'),
    gloss('bleats', 'Makes the shaky cry of a goat or a sheep.', 'q63-pet'),
    gloss('thoughtfully', 'In a way that shows you are thinking hard.', 'q63-pet'),
    gloss('wails', 'Cries out loudly and sadly.', 'q63-pet-done'),
    gloss('opponent', 'The person or team you play against.', 'q63-opponent'),
    gloss('hulking', 'Very big and heavy-looking.', 'q63-opponent'),
    gloss('chute', 'A sloping slide or tube that things slide down.', 'q63-opponent-done'),
    gloss('steeply', 'Going up or down at a sharp angle.', 'q63-opponent-done'),
  ],
  notes:
    'Lessons: the donkey simile; sink or float by material; 8 slices among 4 is one quarter (3.NF.A.1); mountain ' +
    'goat hooves; paying back for a pet’s mischief; predicting from character; gravity and slopes with a ramp test ' +
    '(do); think question on why play matters. The cabbage merchant stays off screen, with no words.',
};

// ================================================================== Q64 Kaito’s Big Speech
const Q64: EduQuest = {
  id: 'reader:q64',
  of: 'q64',
  band: 'reader',
  title: 'Kaito’s Big Speech',
  goals: {
    'q64-s1': {
      goal: 'Help Kaito rehearse his speech three times.',
      hint: 'Pick the advice you think helps. Each try, he gets a little less awful.',
    },
    'q64-s2': {
      goal: 'Stand by Kaito while he asks to join the group.',
      hint: 'Stay close to the campfire. Kaito does better with someone friendly beside him.',
    },
  },
  scenes: [
    scene(
      'q64-rehearse',
      [
        N('Kaito used to chase Pemba across half the world, and he was unkind to all of them. Now he wants to say sorry.'),
        N('Behind a broken pillar, you find Kaito pacing in circles, muttering to a rock.'),
        Z('Oh! Keeper. I wasn’t… I’m not talking to a rock. Why would I be talking to a rock.', 'shock'),
        Z('Fine. I was talking to the rock. I’m practising. I want to ask Pemba if I can join his group.'),
        Z('The problem is, I keep getting it wrong. Last time I said “I have changed” and then stood there for a whole minute.', 'sad'),
        Z('I chased them right round the world in a very loud boat. All summer. At night.'),
        Z('In my defence, I was very tired. In nobody’s defence, I was very loud.', 'sad'),
        N('Your Nubbin climbs onto the rock and sits on it, as if it were the audience.'),
        Z('Can you listen? Tell me if it’s bad. It’s going to be bad. Okay. Here goes.', 'think'),
        Z('Pemba. Greetings. I am… a person. Who used to be… the bad kind of person. But now I’m the good kind. Probably. Thanks.'),
      ],
      [
        notice(
          3,
          'sel',
          'practice makes hard things easier',
          [
            N('Practising out loud is a real trick. Actors, singers and sports players all rehearse before the big moment.'),
            N('Each try helps your brain and your mouth learn the way. It gets a little easier every time.'),
          ],
          'Learned that rehearsing out loud makes a hard moment easier.',
          'CASEL: Self-management',
        ),
        ask(
          8,
          'sel',
          'kind self-talk',
          [N('Kaito just told himself, “It’s going to be bad.” What could he say to himself instead?')],
          [
            opt('“I can do this. If I muddle it, I can try again.”', [Z('…That sounds better than what’s usually in my head.', 'soft')], true),
            opt('“I’m hopeless.”', [
              N('That’s what Kaito usually tells himself, and it makes him more nervous.'),
              N('Kinder words, like “I can try again”, help much more.'),
            ]),
            opt('“Everyone will laugh at me.”', [N('Worries like that make it harder. Telling yourself “I can try again” is kinder, and it really helps.')]),
          ],
          'Practised swapping a worried thought for kind, encouraging self-talk.',
          'CASEL: Self-awareness',
        ),
      ],
      [
        ch('honest', 'Tell him it’s a bit stiff', [Z('Stiff. Right. I can do less stiff. I think.', 'sad')], { 'q64-advice': 'honest' }),
        ch(
          'kind',
          'Tell him it’s a good start',
          [Z('Really? You’re not just saying that?', 'happy'), N('You are just saying that, a little.')],
          { 'q64-advice': 'kind' },
        ),
        ch(
          'smile',
          'Suggest he smiles',
          [N('Kaito smiles. It looks like it hurts. Your Nubbin hides behind the rock.'), Z('Too much?')],
          { 'q64-advice': 'smile' },
        ),
      ],
    ),
    scene(
      'q64-rehearse-done',
      [
        Z('Attempt two. “Pemba. I have brought you a gift. The gift is me.”'),
        N('Your Nubbin falls off the rock.'),
        Z('No. Awful. Attempt three. “I’m sorry. I want to help.”', 'think'),
        N('It is the shortest one. It is also, by far, the best.'),
        Z('Okay. Okay. I think that’s it. Short and friendly. Short and friendly.'),
        Z('What if I just wave? Waving is friendly. Isn’t it?', 'think'),
      ],
      [
        ask(
          3,
          'literacy',
          'saying something clearly',
          [N('Why is attempt three the best one?')],
          [
            opt('It says clearly what he feels and what he wants.', [
              N('Yes. “I’m sorry” says how he feels. “I want to help” says what he wants. Nothing extra gets in the way.'),
            ], true),
            opt('It has the most words.', [N('It has the fewest! Short can be strong: “I’m sorry. I want to help” says exactly what he means.')]),
            opt('It rhymes.', [N('It doesn’t rhyme, actually. It’s best because it says clearly what he feels and what he wants.')]),
          ],
          'Compared three versions of a speech and explained why the short, clear one works best.',
        ),
      ],
    ),
    scene(
      'q64-ask',
      [
        N('Pemba, Nalu, Tuk and Bao sit round a campfire in the ruins. Kaito steps out of the shadows. Everyone jumps.'),
        T('Oh good. A surprise prince. Exactly what this evening needed.', 'shock'),
        B('Relax. His heart’s going like a rabbit’s. He’s more scared than you are.'),
        N('Kaito raises one hand in a stiff little wave. Then he forgets to put it down.'),
        Z('Um. Hi. Hello. It’s me. Hi.'),
        Z('…That was not the speech. That was not any of the speeches.', 'think'),
        K('What do you want, Kaito?', 'angry'),
        N('Kaito looks at you. Your Nubbin looks at you. Everyone, suddenly, is looking at you.'),
      ],
      [
        notice(
          2,
          'health',
          'what fear does to your body, and how to calm it',
          [
            B('When you’re scared, your heart beats faster and you breathe faster. That’s your body getting ready for trouble.'),
            N('Slow, deep breaths can help your body calm down again. Try it: in through your nose, and slowly out through your mouth.'),
          ],
          'Learned that fear speeds up the heartbeat and breathing, and that slow breaths help calm the body.',
          'CASEL: Self-management',
        ),
      ],
      [
        ch(
          'vouch',
          'Tell them he’s been practising for hours',
          [P('Practising? For us? Kaito, that’s the nicest thing anyone’s ever done badly.', 'happy')],
          { 'q64-help': 'vouch' },
        ),
        ch(
          'nudge',
          'Nudge him to try again',
          [Z('I’m sorry. I want to help. I was wrong about a lot of things. I want to be on your side, if you’ll let me.', 'soft')],
          { 'q64-help': 'nudge' },
        ),
        ch(
          'wave',
          'Wave back',
          [N('You wave back. Pemba waves too. Bao waves in entirely the wrong direction, on purpose.')],
          { 'q64-help': 'wave' },
        ),
      ],
    ),
    scene(
      'q64-ask-done',
      [
        P('Okay. You can join. Welcome to the team!', 'happy'),
        Z('Really? Just like that?', 'shock'),
        T('No. Not just like that. There will be a trial period. With paperwork.'),
        K('I haven’t forgotten what you did, Kaito. All that chasing.'),
        Z('Good. You shouldn’t. I don’t want you to forget it. I want the chance to be more than it.', 'soft'),
        K('…One chance.'),
      ],
      [
        ask(
          5,
          'sel',
          'think question: second chances',
          [
            N('Nalu is still hurt by what Kaito did before. But she gives him one chance.'),
            N('When someone has hurt you and says sorry, should you give them another chance?'),
          ],
          [
            opt('Yes, if they really mean it.', [K('That’s what I’m trying. I’ll be watching to see if he means it.')]),
            opt('Only after they show they’ve changed.', [T('Exactly. Hence the paperwork.')]),
            opt('You can forgive them and still be careful.', [K('Yes. That’s exactly how I feel. Both at once.', 'soft')]),
          ],
          'Thought about forgiveness and how trust can be rebuilt after someone says sorry.',
          'CASEL: Relationship skills',
        ),
      ],
    ),
    scene(
      'q64-complete',
      [
        N('Later, Kaito finds you by the pillar. His hand is still slightly raised, as if it got stuck.'),
        Z('Thank you. For listening. And for the rock.', 'soft'),
        Z('I’m still not good at this. Talking. People. Waving.', 'think'),
        Z('But I think I got a bit better today. Three tries, and the last one was nearly normal.', 'happy'),
        N('He waves at you. It is stiff, awkward and slightly too long.'),
        N('Your Nubbin copies it perfectly. Kaito pretends not to be pleased. He is extremely pleased.'),
      ],
      [
        ask(
          3,
          'literacy',
          'how a character changes',
          [N('Think back to Kaito muttering to a rock. How has he changed since then?')],
          [
            opt('He’s braver about saying what he really feels.', [N('Yes. He started with stiff, silly speeches. He ended by saying sorry, simply and honestly.')], true),
            opt('He hasn’t changed at all.', [N('He’s still awkward! But he went from talking to a rock to saying sorry to real people. That’s a big change.')]),
            opt('He’s become a great speech-maker.', [N('Not quite yet! But he’s braver about saying what he feels, and that matters more.')]),
          ],
          'Described how a character changed from the start of the story to the end.',
          'RL.3.3',
        ),
      ],
    ),
  ],
  glossary: [
    gloss('pacing', 'Walking up and down, often because you feel nervous.', 'q64-rehearse'),
    gloss('rehearse', 'To practise something before you do it for real.', 'q64-rehearse'),
    gloss('attempt', 'A try at doing something.', 'q64-rehearse-done'),
    gloss('awkward', 'Clumsy or uncomfortable, especially around other people.', 'q64-complete'),
  ],
  notes:
    'Lessons: rehearsing out loud; kind self-talk; the clearest of three speeches; fear in the body and slow ' +
    'breathing; think question on second chances; how Kaito changes. Kaito’s adapted greeting from the main script ' +
    'is rewritten (q64-ask line 4), so no line here echoes the show.',
};

// ================================================================== Q65 The White Lotus
const Q65: EduQuest = {
  id: 'reader:q65',
  of: 'q65',
  band: 'reader',
  title: 'The White Lotus',
  goals: {
    'q65-s1': {
      goal: 'Learn the tile game: finish Uncle Tenzo’s practice round.',
      hint: 'Grow flowers in the middle and block with rocks at the edge. Uncle Tenzo will point out mistakes, kindly.',
    },
    'q65-s2': {
      goal: 'Win a game of tiles against Uncle Tenzo.',
      hint: 'Save your lotus tile for last. It can’t be blocked, and it changes the whole board.',
    },
  },
  scenes: [
    scene(
      'q65-tiles',
      [
        N('Rain patters on the leaves. Under the big tree, Uncle Tenzo has laid out a round wooden board and a box of painted tiles.'),
        I('Ah, Keeper. Will you keep an old man company? This game is no fun alone. I always win, and then I feel bad.', 'happy'),
        N('The tiles show flowers, rocks and wind. One tile, set apart from the rest, shows a single white lotus.'),
        I('The rules are simple. Flowers grow. Rocks block. Wind moves things. The lotus does nothing at all.'),
        I('Which is, of course, why it is the most important tile.', 'think'),
        Z('Uncle, every time you explain this game, it gets more confusing.'),
        I('That is how you know it is a good game, nephew. The rules are easy. The game is not.', 'soft'),
        N('Your Nubbin picks up a flower tile and sniffs it hopefully. It is wood. It is disappointed.'),
      ],
      [
        ask(
          6,
          'literacy',
          'work out what a character means',
          [N('Uncle Tenzo says, “The rules are easy. The game is not.” What does he mean?')],
          [
            opt('Learning the rules is quick, but playing well takes practice.', [
              I('Just so. You can learn the rules over one cup of tea. Playing well takes many pots.', 'happy'),
            ], true),
            opt('The rules are secretly very hard.', [I('No, no. The rules really are easy! It is using them well that takes time and practice.')]),
            opt('The game is impossible to win.', [I('Not impossible. I have lost twice. Learning the rules is quick; playing well takes practice.', 'happy')]),
          ],
          'Explained the meaning behind a character’s saying: easy rules, but skill takes practice.',
        ),
      ],
      [
        ch('teach', 'Ask him to teach you properly', [I('With pleasure. First lesson: a tile placed in a hurry is a tile you will stare at all game.', 'happy')]),
        ch('lotus', 'Ask what the lotus tile does', [I('Patience. In this game, and perhaps outside it, the quiet ones matter most.', 'soft')]),
        ch(
          'snacks',
          'Ask if there are snacks',
          [I('There are always snacks. A board game without snacks is a punishment.', 'happy')],
          { 'q65-snacks': true },
        ),
      ],
    ),
    scene(
      'q65-tiles-done',
      [
        N('You play slowly. Uncle Tenzo points out mistakes kindly, and only once each.'),
        N('Your flowers spread in a growing pattern. Turn one: 1 flower. Turn two: 3. Turn three: 5. Turn four: 7.'),
        I('Good. You don’t rush. You look at the whole board, not just your own tile. That is rare.'),
        Z('He says that to everyone.'),
        I('I have never said it to you, nephew.'),
        Z('…', 'shock'),
      ],
      [
        ask(
          1,
          'maths',
          'find the rule in a number pattern',
          [I('1, 3, 5, 7… Can you see the rule? How many flowers will there be on turn five?')],
          [
            opt('9', [I('Yes! The rule is “add 2” each turn: 7 add 2 is 9. A pattern tells you the future better than any fortune teller.', 'happy')], true),
            opt('8', [I('Close. But each turn adds 2, not 1: 1, 3, 5, 7… so next comes 9.')]),
            opt('14', [I('That would be doubling 7. But the rule is “add 2”: 1, 3, 5, 7, 9.')]),
          ],
          'Found the rule “add 2” in the pattern 1, 3, 5, 7 and used it to predict the next number.',
          '4.OA.C.5',
        ),
      ],
    ),
    scene(
      'q65-game',
      [
        I('Now, a real game. I will not go easy on you. I will go medium.'),
        N('The rain grows heavier. The tea grows cold. Kaito falls asleep against the tree trunk, snoring gently.'),
        I('Do you know why I love this game? Because every tile matters, but no tile wins alone.', 'soft'),
        I('A general learns that slowly. A gardener learns it quickly. Be a gardener, Keeper.'),
        I('And if you lose, do not sulk. A lost game is a lesson the board gives you for free.'),
        N('Your Nubbins sit in a row by the board, watching each move like it is the most exciting thing in the world.'),
        I('Hmm. That was a clever move. Did you mean it, or was it luck?', 'think'),
      ],
      [
        notice(
          1,
          'science',
          'heat moves from hot things to cooler things',
          [
            I('My tea has gone cold again. It always does when the game is good.'),
            N('Heat always moves from hot things to cooler things. The hot tea warms the air around it, and loses its own heat.'),
            N('It keeps cooling until the tea and the air are the same temperature.'),
          ],
          'Learned that heat moves from a hot drink into the cooler air until they are the same temperature.',
          '4-PS3-2',
        ),
        ask(
          4,
          'literacy',
          'understand a metaphor',
          [N('Uncle Tenzo says a lost game is “a lesson the board gives you for free”. What does he mean?')],
          [
            opt('Losing teaches you something, so it isn’t wasted.', [I('Exactly. Every loss shows you a move you will never make again.', 'soft')], true),
            opt('The board can talk.', [I('Ha! I wish. No: it means a loss teaches you something, like a lesson you didn’t have to pay for.', 'happy')]),
            opt('You have to pay if you lose.', [I('The opposite! It costs nothing, and it teaches you something. That is a good deal.')]),
          ],
          'Explained a metaphor comparing a lost game to a free lesson.',
          'L.4.5',
        ),
      ],
      [
        ch('meant', 'Say you meant it', [I('Then I am in trouble.', 'happy')]),
        ch('luck', 'Admit it was luck', [I('Honest! Luck is kinder to honest players than you would think.', 'soft')]),
        ch(
          'nubbin',
          'Point at your Nubbin',
          [I('Ah! A Nubbin with a strategic mind! I should have known.', 'happy')],
          { 'q65-credit': 'nubbin' },
        ),
      ],
    ),
    scene(
      'q65-game-done',
      [
        N('You place your last tile, the white lotus. Nothing can block it.'),
        N('Flowers bloom across the board. The pattern is symmetrical: the left side is a mirror of the right.'),
        I('Beaten! Fair and square! What a happy afternoon!', 'happy'),
        N('Uncle Tenzo sits back and smiles, very wide. He looks happier than if he had won.'),
        I('Shake my hand, Keeper. A good winner is as rare as a good loser. I think you are both.'),
        Z('(sleepily) Did someone win? Was it me?'),
      ],
      [
        ask(
          1,
          'maths',
          'lines of symmetry in a square',
          [I('Each tile is a square. How many lines of symmetry does a square have?')],
          [
            opt('4', [I('Yes! Top to bottom, side to side, and corner to corner both ways. Four ways to fold it so the halves match.', 'happy')], true),
            opt('2', [I('Two is a good start: top to bottom and side to side. You can also fold it corner to corner, both ways. Four!')]),
            opt('1', [I('There are more! Top to bottom, side to side, and both diagonals. A square has four lines of symmetry.')]),
          ],
          'Found the four lines of symmetry of a square.',
          '4.G.A.3',
        ),
      ],
    ),
    scene(
      'q65-complete',
      [
        I('Keep this. The white lotus tile. It belongs with someone who has learned patience.', 'soft'),
        N('He presses the little tile into your palm. It is old, smooth, and warmer than wood should be.'),
        I('And now a secret. In any town, any market, if you see this tile on a stall or a door, you are among friends.'),
        I('There are more of us than you would think. Old people who play slow games and keep an eye on things.', 'soft'),
        Z('…Uncle. Are you in a secret society?'),
        I('I am in a tea society. Mostly. Go back to sleep, nephew.', 'happy'),
        N('Your Nubbin carries the board home on its head. The lotus tile hangs from your belt, quietly mattering.'),
      ],
      [
        ask(
          6,
          'sel',
          'think question: quiet people who matter',
          [
            I('The lotus does nothing, yet it matters most. Some people are like that too: quiet, but very important.'),
            N('What kind of quiet person matters most to you?'),
          ],
          [
            opt('Someone who listens when I’m sad.', [I('Ah. A listener. They are worth more than a hundred talkers.', 'soft')]),
            opt('Someone who helps without being asked.', [I('Yes. The kind of help you only notice when it stops. Remember to thank them.', 'soft')]),
            opt('Someone who notices when people are left out.', [I('A rare and precious kind of person. Perhaps you are one yourself.', 'soft')]),
          ],
          'Reflected on the quiet people in their life who matter, and why.',
          'CASEL: Social awareness',
        ),
      ],
    ),
  ],
  glossary: [
    gloss('patters', 'Makes quick, light tapping sounds.', 'q65-tiles'),
    gloss('nephew', 'The son of your brother or sister.', 'q65-tiles'),
    gloss('rare', 'Not found or seen very often.', 'q65-tiles-done'),
    gloss('general', 'An army leader in charge of many soldiers.', 'q65-game'),
    gloss('sulk', 'To be quiet and grumpy because you are upset.', 'q65-game'),
    gloss('symmetrical', 'When one half is a mirror image of the other half.', 'q65-game-done'),
    gloss('society', 'A group of people who meet because they share an interest.', 'q65-complete'),
  ],
  notes:
    'Lessons: easy rules versus skill; the “add 2” pattern 1, 3, 5, 7, 9 (4.OA.C.5); heat moving out of cold tea ' +
    '(4-PS3-2); the “free lesson” metaphor; four lines of symmetry in a square (4.G.A.3); think question on quiet ' +
    'people who matter. The tile game is the original simple game from the main script, not real Pai Sho.',
};

// ================================================================== exports
export const EDU_AVATAR_2_READER: EduQuest[] = [Q56, Q57, Q58, Q59, Q60, Q61, Q62, Q63, Q64, Q65];

/** Every `edu:` check used by a `do` lesson in this file. */
export const CHECKS: string[] = [
  'edu:tap:table:ear-down', // Q56
  'edu:order:water-cycle', // Q58
  'edu:tally:nest-treasures', // Q60
  'edu:order:years:oldest-first', // Q61
  'edu:test:ramp:steep-gentle', // Q63
];
