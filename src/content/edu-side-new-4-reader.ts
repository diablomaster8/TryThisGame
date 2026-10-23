/**
 * The Learning Grove, reader band (ages 7–10): side stories, new part 4 (the comedy trio).
 *
 *   S14 Tilly’s Tabletop   dice and chance, adding rolls, making up rules and fairness (think),
 *                          missing someone and playing it out, light and opaque things, writing
 *                          your own story place
 *   S20 Fort Night         scarcity and choosing (D2.Eco.1.K-2), cycles like rock-paper-scissors,
 *                          strong walls and triangles, blizzards and weather signs, the night sky,
 *                          fair play (think)
 *   S21 CL-4NK             what robots are and aren’t (think: is Clank alive, and can he be a
 *                          friend?), wheels, gravity, ramps as inclined planes (3-PS2-1), units,
 *                          tally charts, asking for help
 *
 * One EduScene per original scene: every step scene, every done scene and each complete scene.
 * This file has no variant scenes: S20’s cousin and sun-and-moon variants are line swaps, not
 * scenes (see S20’s notes for the line indices in these reader versions).
 *
 * Every choice keeps its original id and `set`; reader keeps every choice. The original quotes
 * rule doesn’t bite here (the main file is all original words), but these lines are rewritten for
 * the band anyway. Moss never speaks in S21. British spelling.
 * See EDU-STYLE.md.
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
const PX = say('pixel');
const BY = say('byte');
const TI = say('tilly');
const GO = say('gordon');
const WR = say('wren');
const CK = say('clank');

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

// ================================================================== S14 Tilly’s Tabletop
const S14_SCENES: EduScene[] = [
  // ------------------------------------------------ step 1: the table
  scene(
    's14-table',
    [
      N('Rain on the kitchen window. Sparks comes in without knocking, which is how Sparks comes in, towing a small girl in big wellies.'),
      SP('This is Tilly. My cousin. She’s nine. It’s half-term, so she’s in charge now. Sorry.', 'happy'),
      TI('I’m not in charge. I’m the Game Mistress. It’s different. It’s worse.'),
      N('She unrolls a felt-tip map across Hazel’s table, right over forty years of teapot rings. It smells strongly of felt tip.'),
      N('Then the dice: cardboard, cut out by hand, sellotaped at the corners. On every die, the six side just says “LOTS”.'),
      TI('Welcome to Keeps & Critters. Rule one: the Game Mistress is always right. Rule two: see rule one.'),
      TI('Rule three: there are snacks, but only at the end. If you ask about the snacks, the end gets further away.'),
      BY('Is there a rulebook? I’d like to read the rulebook first.', 'think'),
      TI('I’m the rulebook.'),
      N('Pixel, the inventor, is already building a dice tower out of a cereal box. Tilly watches it the way a hawk watches a vole.'),
      BY('Twenty years married, and she still builds a tower before reading the rules.'),
      PX('Twenty years, and he still reads the rules.'),
      TI('Pick your hero. Ten seconds. Nine. Four.'),
    ],
    [
      {
        domain: 'maths',
        skill: 'chance: how likely one side of a die is',
        kind: 'ask',
        after: 4,
        prompt: [
          N('Each cardboard die has six sides. Only one of them says LOTS.'),
          N('If you roll one die, how likely is it to land on LOTS?'),
        ],
        options: [
          {
            label: 'Certain. It always lands on LOTS.',
            reply: [
              N('Not quite. Five of the six sides aren’t LOTS, so most rolls won’t be.'),
              N('LOTS is unlikely: about one roll in every six.'),
            ],
          },
          {
            label: 'Likely. More often than not.',
            reply: [N('Close, but there are more not-LOTS sides than LOTS sides: five against one. So LOTS is unlikely, about one roll in six.')],
          },
          {
            label: 'Unlikely. About one roll in every six.',
            best: true,
            reply: [
              N('Yes! One side out of six. On a fair die every side has the same chance.'),
              TI('My dice are VERY fair. I cut them with the good scissors.'),
            ],
          },
        ],
        parentNote: 'Reasoned that one side of a six-sided die comes up about 1 time in 6, so it is unlikely on any single roll.',
      },
      {
        domain: 'social-studies',
        skill: 'what makes rules fair (think question)',
        standard: 'D2.Civ.8.K-2',
        kind: 'ask',
        after: 8,
        prompt: [
          N('Byte wants a rulebook. Tilly says she IS the rulebook, and she can make up rules as she goes.'),
          N('What do you think? Is it fair if one player can change the rules any time?'),
        ],
        options: [
          {
            label: 'No. Everyone should know the rules before they start.',
            reply: [N('That’s a fair answer. It’s why games have rulebooks and towns write their laws down: so the rules are the same for everybody.')],
          },
          {
            label: 'Yes, if she’s fair about it.',
            reply: [N('That’s a fair answer too. Lots of games have a referee or a storyteller who decides. It works when everyone trusts them to be fair.')],
          },
          {
            label: 'It depends if it’s still fun for everyone.',
            reply: [N('That’s a thoughtful answer. A good rule keeps a game fun and fair for all the players, not just the one in charge.')],
          },
        ],
        parentNote: 'Thought about who gets to make rules, and what makes a rule fair for everyone.',
      },
    ],
    [
      {
        id: 'knight',
        label: 'A knight with a slightly bent sword.',
        set: { 's14-hero': 'knight' },
        then: [TI('Sir You of the Bent Sword. Good. A bent sword can hit round corners.', 'happy')],
      },
      {
        id: 'wizard',
        label: 'A wizard who mostly does soup.',
        set: { 's14-hero': 'wizard' },
        then: [TI('Soup Wizard. Your spells are hot but slow, and you have to blow on them. Don’t argue. It’s canon.', 'happy')],
      },
      {
        id: 'rogue',
        label: 'A rogue disguised as a hat stand.',
        set: { 's14-hero': 'rogue' },
        then: [TI('Excellent. Nobody suspects a hat stand. Not even other hat stands.', 'happy')],
      },
    ],
  ),
  scene(
    's14-bog',
    [
      N('The Bog of Mild Peril is the pond, coloured green and labelled “BOG (MILD)”. A felt-tip frog sits in it, looking unimpressed.'),
      SP('I ATTACK THE BOG.', 'happy'),
      TI('You can’t attack a bog. Roll anyway.'),
      TI('…A one and a one. Your sword is now a sandwich.'),
      SP('What KIND of sandwich?', 'shock'),
      TI('Cheese. A sad one. You ate the good half on the way here.'),
      BY('Actually, that’s not how dice—'),
      TI('Rule four. Anybody who says “actually” loses a hit point.'),
      BY('That isn’t—', 'shock'),
      N('Byte writes “HP: 8” on his character sheet, crosses it out, and writes “HP: 7 (DISPUTED)”.'),
      N('You roll a LOTS. Tilly decides the bog likes you, and lets the whole party across. Nobody knows why, including her.'),
      TI('Session over. Nobody died. Somebody’s a sandwich. Same time tomorrow.', 'happy'),
    ],
    [
      {
        domain: 'maths',
        skill: 'adding two dice: the smallest and biggest totals',
        standard: '1.OA.A.1',
        kind: 'ask',
        after: 5,
        prompt: [
          N('Sparks rolled a one and a one. 1 + 1 = 2. That’s the smallest total two dice can make.'),
          SP('What’s the BIGGEST total? I want it. I want it for my sandwich.'),
        ],
        options: [
          {
            label: '6',
            reply: [N('Six is the biggest on one die. But there are two dice! LOTS + LOTS is 6 + 6, which makes 12.')],
          },
          {
            label: '12',
            best: true,
            reply: [N('Yes! Two LOTS: 6 + 6 = 12. Every total from 2 to 12 is possible with two dice.'), SP('TWELVE. Sandwich of DESTINY.', 'happy')],
          },
          {
            label: 'LOTS of LOTS',
            reply: [TI('That’s what I’d say.'), N('In numbers, though, LOTS is 6. So LOTS + LOTS is 6 + 6 = 12.')],
          },
        ],
        parentNote: 'Added dice faces to find the smallest (2) and largest (12) totals of two six-sided dice.',
      },
      {
        domain: 'sel',
        skill: 'how to disagree kindly',
        standard: 'CASEL: Relationship skills',
        kind: 'notice',
        after: 9,
        lines: [N('A kind way to disagree is to say: “I see it differently. Can I explain?” Byte may try it. He may not.')],
        parentNote: 'Practised a respectful way to disagree with someone.',
      },
    ],
  ),
  // ------------------------------------------------ step 2: the Tax Toad
  scene(
    's14-tower',
    [
      N('Next afternoon there’s a new tower on the map, drawn exactly where Sparks’s workshop chimney stands.'),
      SP('Hang on. That’s my chimney. Am I the Toad?'),
      TI('No comment.'),
      TI('The Tower of the Tax Toad. He taxes everything. He’s very rich and very damp.'),
      PX('Can I build a siege engine?', 'happy'),
      TI('You can build a siege engine. Roll. …Three. Your siege engine is now a toad. It works for him.'),
      N('Pixel looks at the cereal-box dice tower, then at Tilly, and very slowly moves it out of Tilly’s reach.'),
      TI('RIBBIT. That’ll be two Shells for the ribbit.', 'angry'),
      TI('There’s a tax on hats. A tax on stairs. A tax on being taller than a toad. That’s all of you. Sorry.'),
      BY('And is there a tax on paying the tax?', 'think'),
      N('Tilly’s eyes go very wide and very bright.'),
      TI('…Yes. Thanks, Byte. Thanks SO much.', 'happy'),
    ],
    [
      {
        domain: 'maths',
        skill: 'equal groups: 4 taxes of 2 Shells',
        standard: '3.OA.A.1',
        kind: 'ask',
        after: 8,
        prompt: [
          TI('Every tax is two Shells. The ribbit, the hats, the stairs, and being taller than a toad.'),
          N('Four taxes, two Shells each. How many Shells does the Toad want?'),
        ],
        options: [
          { label: '6 Shells', reply: [N('Count the taxes again: ribbit, hats, stairs, taller. That’s 4 groups of 2. 2, 4, 6, 8. Eight Shells.')] },
          {
            label: '8 Shells',
            best: true,
            reply: [N('Yes! 4 groups of 2 is 8. 4 × 2 = 8.'), TI('The Toad is pleased. The Toad is moist with joy.', 'happy')],
          },
          { label: '42 Shells', reply: [TI('Ooh. I like that number. But no.'), N('4 taxes of 2 Shells: 2, 4, 6, 8. Eight Shells.')] },
        ],
        parentNote: 'Solved 4 groups of 2 Shells as multiplication (4 × 2 = 8).',
      },
      {
        domain: 'literacy',
        skill: 'words that show a character’s feelings',
        standard: 'RL.1.4',
        kind: 'ask',
        after: 10,
        prompt: [N('“Tilly’s eyes go very wide and very bright.” What is she feeling?')],
        options: [
          {
            label: 'Thrilled. Byte just gave her a brilliant, terrible idea.',
            best: true,
            reply: [N('Yes. Wide, bright eyes show excitement. A tax on the tax! Byte will regret this.')],
          },
          { label: 'Scared of the Toad.', reply: [N('Scared eyes can go wide too. But “bright” is a happy, excited word. And look: she says thanks SO much. She’s thrilled.')] },
          { label: 'Sleepy.', reply: [N('Sleepy eyes droop and close. Hers go wide and bright. She’s wide awake and thrilled with Byte’s idea.')] },
        ],
        parentNote: 'Used describing words (wide, bright eyes) to work out how a character feels.',
      },
    ],
  ),
  scene(
    's14-toad',
    [
      BY('The tax on the tax is a tenth of it. Then a tenth of that. It shrinks and shrinks, and never quite stops.'),
      TI('The Toad doesn’t do maths. The Toad does vibes.'),
      BY('Actually—'),
      TI('Six.'),
      N('Byte changes his hit points again, in very small, very cross handwriting.'),
      N('Then Pixel’s Nubbin, asleep on the bread bin all afternoon, wakes up, climbs down onto the map, and eats the Tax Toad.'),
      N('The Toad is cardboard. The Nubbin doesn’t seem to mind. The Toad may have opinions, but nobody will hear them now.'),
      TI('…', 'shock'),
      TI('The Tax Toad has been eaten by a god. That’s canon now. Everyone’s taxes are cancelled.', 'happy'),
      SP('BEST GAME. BEST GAME EVER MADE.', 'happy'),
      N('Tilly laughs so hard she has to lie on the floor. Then she stops, quite suddenly, and looks at the top corner of the map.'),
      N('That corner is coloured grey. The felt tip was pressed so hard it went through the paper, into Hazel’s table.'),
    ],
    [
      {
        domain: 'maths',
        skill: 'a number pattern with a rule: divide by ten each time',
        standard: '4.OA.C.5',
        kind: 'ask',
        after: 0,
        prompt: [
          BY('Let’s cut each Shell into a hundred tiny bits. So the first tax is 200 bits. The tax on that is a tenth: 20 bits.'),
          BY('The rule is: divide by ten each time. 200, 20, then…?'),
        ],
        options: [
          {
            label: '2',
            best: true,
            reply: [
              N('Yes! A tenth of 20 is 2. Add them up: 200 + 20 + 2 = 222 bits. Two Shells, and then two, and two.'),
              BY('And the next tax is a tenth of a bit, and the next a tenth of that. More twos. Forever.'),
            ],
          },
          { label: '10', reply: [N('That would be halving. Byte’s rule is a tenth: 20 shared into ten parts is 2. So the next tax is 2 bits.')] },
          { label: '0', reply: [N('It gets very small, but not that fast! A tenth of 20 is 2. After that the taxes are smaller than a bit, but never quite zero.')] },
        ],
        parentNote: 'Continued a number pattern by applying the rule “divide by ten each time” (200, 20, 2).',
      },
      {
        domain: 'literacy',
        skill: 'reading a character’s actions for hidden feelings',
        standard: 'RL.3.3',
        kind: 'ask',
        after: 11,
        prompt: [N('Why do you think Tilly pressed so hard on the grey corner?')],
        options: [
          {
            label: 'Something about that corner gives her a big feeling.',
            best: true,
            reply: [N('That’s good reading. People press hard when they feel something strongly. And she stopped laughing the moment she looked at it. Keep an eye on that corner.')],
          },
          {
            label: 'Her felt tip was running out.',
            reply: [N('Maybe! But she stopped laughing very suddenly when she saw it. That’s a clue the corner means something big to her.')],
          },
          {
            label: 'She really doesn’t like grey.',
            reply: [N('Could be part of it. But look how suddenly she went quiet. That’s a clue the corner is about a big feeling, not just a colour.')],
          },
        ],
        parentNote: 'Used a character’s actions (pressing hard, going quiet) to infer a hidden feeling.',
      },
    ],
  ),
  // ------------------------------------------------ step 3: find Tilly
  scene(
    's14-sparks',
    [
      N('The morning of the last session, Sparks is waiting at your gate, quietly. You didn’t know Sparks had a quiet setting.'),
      SP('The dragon in that corner’s got bigger. She redraws it every night. Last night it got a cardigan.', 'sad'),
      SP('It’s Hazel. Obviously it’s Hazel.'),
      SP('Hazel went off at the end of the winter. She left Tilly a note, with just “Tilly” on the front. She won’t open it. It’s in her welly.'),
      SP('She won’t say the name. Just “the dragon”.'),
      SP('Tilly’s gone off somewhere. She does that. You go and find her. She likes you. You’re not a sandwich.', 'soft'),
    ],
    [
      {
        domain: 'sel',
        skill: 'missing someone, and different ways of carrying a big feeling',
        standard: 'CASEL: Self-awareness',
        kind: 'notice',
        after: 5,
        lines: [
          N('Missing someone very much is a kind of grief. It can feel sad, or cross, or both at once.'),
          SP('When I miss someone I get louder. Tilly goes into a game and makes them a dragon.'),
          N('Talking about it, playing it out, drawing it: all of these are ways to carry a big feeling.'),
        ],
        parentNote: 'Learned that missing someone is a kind of grief, and that people carry it in different ways, including play.',
      },
    ],
  ),
  scene(
    's14-gate',
    [
      N('You hear her before you see her: a whistle through two fingers, rising at the end. Every Nubbin in the Grove looks up.'),
      N('Tilly is sitting on the gate that sticks, kicking it. It doesn’t swing. It hardly ever does.'),
      TI('They think it’s supper. It isn’t supper. I just do it.'),
      TI('Hazel taught me. She said if you whistle it properly, anyone who loves you comes running.'),
      N('The Nubbins arrive, hopeful, and sit in a row in front of her wellies.'),
      TI('See. It works on them.', 'sad'),
    ],
    [
      {
        domain: 'science',
        skill: 'a whistle is vibrating air',
        standard: '1-PS4-1',
        kind: 'notice',
        after: 0,
        lines: [
          N('A whistle is air blown hard through a tiny gap. The air shakes back and forth very fast.'),
          N('That shaking is called a vibration, and it’s what you hear.'),
          N('The Nubbins have learned that this sound means food, the way a dog learns the sound of its lead.'),
        ],
        parentNote: 'Learned that a whistle’s sound comes from vibrating air, and that animals can learn what a sound means.',
      },
      {
        domain: 'sel',
        skill: 'why we keep doing things a missing person taught us (think question)',
        standard: 'CASEL: Social awareness',
        kind: 'ask',
        after: 5,
        prompt: [N('It isn’t supper, but Tilly keeps whistling the supper call. Why do you think she does it?')],
        options: [
          {
            label: 'It makes her feel close to Hazel.',
            reply: [N('That’s a kind answer. Doing something a person taught us can feel like holding their hand from far away.')],
          },
          {
            label: 'She’s hoping someone will come running.',
            reply: [N('That’s a thoughtful answer. Remember what Hazel told her: anyone who loves you comes running. Maybe Tilly is testing it.')],
          },
          {
            label: 'She just likes whistling.',
            reply: [N('That’s a fair answer. Sometimes we do things without knowing why. Feelings don’t always come with labels.')],
          },
        ],
        parentNote: 'Thought about why someone who misses a person might keep doing the things that person taught them.',
      },
    ],
    [
      {
        id: 'ask',
        label: 'Ask her about Hazel.',
        set: { 's14-approach': 'asked' },
        then: [
          TI('I’m not talking about her.', 'angry'),
          N('A long pause. A Nubbin licks her welly.'),
          TI('She went without saying goodbye. You’re supposed to say goodbye. That’s the RULE.', 'angry'),
          N('She takes the note out of her welly. It’s still folded, damp at one corner. She looks at it. She puts it back.'),
          TI('Come and play. I’ve got a dragon to do.'),
        ],
      },
      {
        id: 'play',
        label: 'Ask her about the dragon instead.',
        set: { 's14-approach': 'played' },
        then: [
          TI('She’s the Grey Grandmother. She’s very old and very rude.'),
          TI('She flew away without saying goodbye. Her treasure hoard is mostly biscuit tins.'),
          TI('She’s the final boss. Final means you can’t have another one after. Come on.', 'sad'),
        ],
      },
    ],
  ),
  // ------------------------------------------------ step 4: the Lair
  scene(
    's14-lair',
    [
      N('The last session. Tilly has drawn the curtains and put a torch under a mixing bowl for “atmosphere”. It mostly lights the bowl.'),
      TI('The Lair. Beyond this door is the Grey Grandmother. First you have to get past her geese.'),
      TI('Her geese are very rude. Rude geese, rude dragon. It runs in the family.'),
      SP('I HIT THE GOOSE WITH MY SANDWICH.', 'angry'),
      TI('Roll. …LOTS. The goose eats the sandwich and is now your friend. You have a goose.'),
      PX('My toad and I would like to help.'),
      TI('Your toad worked for the Tax Toad. The Tax Toad got eaten. Your toad is having a hard time. Roll anyway.'),
      BY('Do I still have six hit—'),
      TI('Four. You said “do” in an “actually” voice.'),
    ],
    [
      {
        domain: 'science',
        skill: 'opaque and transparent materials',
        standard: '2-PS1-1',
        kind: 'notice',
        after: 0,
        lines: [
          PX('It’s a metal bowl. Metal is opaque: light can’t get through it. So the light stays trapped inside.'),
          PX('A glass bowl is transparent. The light would shine straight through. Less spooky. More salad.'),
        ],
        parentNote: 'Learned the difference between opaque materials (block light) and transparent ones (let light through).',
      },
      {
        domain: 'maths',
        skill: 'take away: hit points from 6 to 4',
        standard: '1.OA.A.1',
        kind: 'ask',
        after: 8,
        prompt: [N('Byte had six hit points. Now Tilly says four. How many did he just lose?')],
        options: [
          { label: '1', reply: [N('Count back from 6: 5, 4. That’s two steps. 6 − 2 = 4. He lost two.')] },
          { label: '2', best: true, reply: [N('Yes. 6 − 2 = 4.'), BY('Two hit points for one syllable. I want that recorded.', 'angry')] },
          { label: '4', reply: [N('Four is what he has left. He started with 6. 6 − 4 would leave 2. He lost two: 6 − 2 = 4.')] },
        ],
        parentNote: 'Solved a take-away problem (6 − 2 = 4) by counting back.',
      },
    ],
  ),
  scene(
    's14-dragon',
    [
      N('Tilly lifts an upside-down cereal box off the top corner of the map. Under it is the dragon.'),
      N('She is cut from a biscuit-tin lid and coloured grey, with a felt-tip cardigan and a tiny whistle on a thread.'),
      TI('The Grey Grandmother. She flew away without saying goodbye. She’s the boss.'),
      SP('Right. I roll to hit the—'),
      N('Tilly snatches the dice off the table so fast that one of them tears.'),
      TI('No.', 'angry'),
      TI('Nobody hits her. She’s immune. To swords and sandwiches and toads and geese. To everything.'),
      N('It is suddenly very quiet in the kitchen. The rain has stopped. Nobody noticed when.'),
      TI('I don’t know how it ends. I don’t know how you end it if nobody’s allowed to hit her.', 'sad'),
    ],
    [
      {
        domain: 'literacy',
        skill: 'a character’s motive',
        standard: 'RL.3.3',
        kind: 'ask',
        after: 8,
        prompt: [N('Why won’t Tilly let anyone hit the dragon?')],
        options: [
          {
            label: 'Because the dragon is really Hazel, and Tilly loves her.',
            best: true,
            reply: [N('Yes. Tilly made the dragon out of missing Hazel. She can be cross with her and still never want her hurt.')],
          },
          {
            label: 'Because it’s against the rules.',
            reply: [N('She did just make it a rule. But why? The cardigan and the whistle are clues.'), N('The dragon is Hazel, and Tilly loves her too much to let anyone hit her.')],
          },
          {
            label: 'Because she wants to win.',
            reply: [N('Look again: she isn’t playing to win. She doesn’t even know how it ends. The dragon is Hazel, and Tilly loves her.')],
          },
        ],
        parentNote: 'Worked out a character’s motive from clues in the story.',
      },
    ],
    [
      {
        id: 'sit',
        label: '“My hero puts the sword down and sits next to the dragon.”',
        set: { 's14-lair': 'sat' },
        then: [TI('That’s not a move.', 'think'), TI('…What for?'), Y('Hazel’s third rule. When you don’t know what to do, sit down next to them and wait.')],
      },
      {
        id: 'roll',
        label: 'Roll to see if your hero is allowed to sit down.',
        set: { 's14-lair': 'rolled' },
        then: [
          N('You roll the torn die. It lands on the torn side, which has no number at all.'),
          TI('That’s… not a number.', 'think'),
          Y('Then the Game Mistress decides. My hero would like to sit down next to the dragon.'),
          N('Tilly looks at the torn die for a long time.'),
          TI('The dice says… the dragon allows it.', 'soft'),
        ],
      },
      {
        id: 'ask',
        label: 'Ask the Game Mistress what the dragon wants.',
        set: { 's14-lair': 'asked' },
        then: [
          TI('She doesn’t WANT anything. She just WENT.', 'angry'),
          N('You don’t say anything. Tilly glares at the dragon. The dragon, being cardboard, glares back.'),
          TI('…She wants someone to sit with her. Fine. FINE.', 'sad'),
        ],
      },
    ],
  ),
  // ------------------------------------------------ step 5: wait
  scene(
    's14-wait',
    [
      N('You move your counter to the dragon’s square, and leave it there. Your hero is a button.'),
      TI('She doesn’t do anything. She just sits there being a dragon.'),
      Y('That’s all right. We’re waiting.'),
      N('Sparks moves a button next to yours. Then Pixel. Then Byte, after looking round for a rule against it.'),
      BY('Is there a rule against it?'),
      TI('…No.', 'soft'),
      N('Four buttons round a biscuit-tin dragon. At the window, a Nubbin taps on the glass, hoping it might be supper.'),
    ],
    [
      {
        domain: 'sel',
        skill: 'calm breathing while you wait with someone',
        standard: 'CASEL: Self-management',
        kind: 'do',
        after: 2,
        lines: [
          N('Waiting is easier with slow breaths. Breathe in while you count to four. Breathe out while you count to four.'),
          N('Do it three times, with your button next to the dragon. No rolling. No rush.'),
        ],
        check: 'edu:breathe:slow:3',
        parentNote: 'Practised slow, counted breathing as a way to stay calm and patient beside someone who is upset.',
      },
    ],
  ),
  scene(
    's14-tears',
    [
      TI('The dragon says—'),
      N('She stops. She picks up the dragon and holds it in both hands.'),
      TI('The dragon says she had something important to do. Grown-ups always say that.'),
      TI('She says she didn’t say goodbye because she’s rubbish at goodbyes. She’d have cried and made it everyone’s problem.'),
      TI('She says—', 'sad'),
      TI('I don’t know what she says. I don’t KNOW. She didn’t SAY.', 'sad'),
      N('Tilly cries the way nine-year-olds cry: all at once, with her whole face.'),
      N('Sparks is round the table before anyone else can move, and says nothing at all. It is the loudest thing Sparks has ever done.'),
      N('Pixel quietly passes a tea towel. Byte quietly passes a better tea towel.'),
      N('You keep your button where it is.'),
    ],
    [
      {
        domain: 'sel',
        skill: 'crying is allowed, and what helps',
        standard: 'CASEL: Self-awareness',
        kind: 'notice',
        after: 8,
        lines: [
          N('Crying is allowed. It’s one of the ways a body lets a big feeling out.'),
          N('Afterwards, lots of people feel a little lighter. It helps to have someone close by, even if nobody says anything.'),
        ],
        parentNote: 'Learned that crying is a normal way to let out big feelings, and that having someone nearby helps.',
      },
    ],
  ),
];

const S14_COMPLETE: EduScene = scene(
  's14-complete',
  [
    TI('Session over. Everyone gets snacks. That’s a rule. It was always a rule.', 'soft'),
    N('The snacks are crisps, Fern’s slightly burnt biscuits, and a bowl of grapes the Nubbins have already found.'),
    N('Tilly eats with the dragon in her lap. She doesn’t let go of it once.'),
    TI('The Grey Grandmother isn’t a boss any more. She’s a character. She lives in the game and you can visit her.'),
    TI('And Byte gets all his hit points back. For the tea towel.'),
    BY('Thank you. I’d like that in writing. Actually—', 'happy'),
    TI('Don’t push it.'),
    N('She puts her cardboard crown on your head. The front says GAME MISTRESS. The back, smaller, says “(OR KEEPER)”.'),
    TI('You keep the map. And the dice. Not the torn one. I’m keeping the torn one.'),
    N('When they’ve gone, you find the map on Hazel’s table. Someone has coloured the grey corner yellow.'),
    N('“HERE BE HAZEL. SHE IS ALOWED.”'),
    N('Out by the gate, faintly, someone is practising the supper call. Every Nubbin in the Grove goes to look.'),
    N('Tilly still misses Hazel. But now the missing has somewhere to live: a yellow corner of a map, where you can visit.'),
  ],
  [
    {
      domain: 'literacy',
      skill: 'spelling “allowed”, and the homophone “aloud”',
      kind: 'ask',
      after: 10,
      prompt: [N('Tilly wrote ALOWED. Which spelling means “it’s OK, she’s let in”?')],
      options: [
        {
          label: 'allowed',
          best: true,
          reply: [
            N('Yes: allowed, with a double L. “Aloud” sounds just the same but means out loud, like reading aloud.'),
            N('Words that sound the same but mean different things are called homophones.'),
          ],
        },
        { label: 'aloud', reply: [N('Good ear: it sounds the same! But “aloud” means out loud, like reading aloud. Tilly means “allowed”, with a double L.')] },
        { label: 'alowed', reply: [N('That’s Tilly’s spelling, and it’s a brave one. The real word has a double L: allowed.')] },
      ],
      parentNote: 'Corrected a spelling (allowed) and learned the homophone pair allowed / aloud.',
    },
    {
      domain: 'art',
      skill: 'making your own story place on a map',
      kind: 'do',
      after: 12,
      lines: [
        N('Tilly turned a sad corner into a story place. Make one of your own.'),
        N('Draw a corner of a map. Label it “HERE BE…” and finish it with someone or something you love or miss.'),
      ],
      check: 'edu:draw:map-corner:here-be',
      parentNote: 'Drew and labelled a story map corner for someone or something they love or miss, as Tilly did.',
    },
  ],
);

const S14: EduQuest = {
  id: 'reader:s14',
  of: 's14',
  band: 'reader',
  title: 'Tilly’s Tabletop',
  goals: {
    's14-step1': {
      goal: 'Play the first session of Keeps & Critters: the Bog of Mild Peril.',
      hint: 'Roll the cardboard dice when Tilly says. Arguing with the Game Mistress makes her rulings worse, never better.',
    },
    's14-step2': {
      goal: 'Get your party up the Tower of the Tax Toad without going broke.',
      hint: 'Every Shell you pay gets taxed again. Pay with silly things the Toad hasn’t thought to tax yet, like soup or a goose.',
    },
    's14-step3': {
      goal: 'Find Tilly before the last session.',
      hint: 'Listen for a whistle through two fingers, rising at the end. It’s the supper call Hazel taught her.',
    },
    's14-step4': {
      goal: 'Play the last session: get past the Grey Grandmother’s geese and into the Lair.',
      hint: 'Three rounds of dice. You can’t lose to the geese. The worst that can happen is you get a goose.',
    },
    's14-step5': {
      goal: 'Sit next to the dragon. Wait.',
      hint: 'Don’t roll. Don’t move. Put the dice down. It takes as long as it takes.',
    },
  },
  scenes: [...S14_SCENES, S14_COMPLETE],
  glossary: [
    gloss('canon', 'The official facts of a story: the things that really happen in it.', 's14-table'),
    gloss('disputed', 'Argued about, because not everyone agrees it is true.', 's14-bog'),
    gloss('siege engine', 'A big machine built long ago for attacking castle walls.', 's14-tower'),
    gloss('vibes', 'A slangy word for the feeling something gives you.', 's14-toad'),
    gloss('setting', 'One of the levels a machine can be switched to, like loud or quiet.', 's14-sparks'),
    gloss('hoard', 'A big, secret pile of treasure, kept safe.', 's14-gate'),
    gloss('atmosphere', 'The feeling a place has, like spooky, cosy or exciting.', 's14-lair'),
    gloss('opaque', 'Not letting light through, so you can’t see through it.', 's14-lair'),
    gloss('immune', 'Safe from something, so it can’t hurt you.', 's14-dragon'),
    gloss('homophone', 'A word that sounds the same as another but means something different, like allowed and aloud.', 's14-complete'),
  ],
  notes:
    'Lessons: chance on a die (1 in 6), smallest and biggest dice totals, 4 × 2 Shells, a ÷10 pattern (200, 20, 2), ' +
    '6 − 2 hit points; fairness of made-up rules (think, D2.Civ.8.K-2); disagreeing kindly; feelings words, motives ' +
    'and a metaphor; grief as missing someone, crying is allowed, why Tilly keeps whistling (think); vibration in a ' +
    'whistle; opaque and transparent; allowed / aloud; drawing a “HERE BE” map corner. Hazel is never said to have ' +
    'died, and nothing says where she went: Tilly only knows Hazel “went off”, and left her a short note (never opened). Byte’s hit points: 8 → 7 (s14-bog) → 6 ' +
    '(s14-toad) → 4 (s14-lair), restored at the end, matching the main script. Do lessons have no scoring: any ' +
    'attempt counts. The breathing beat in s14-wait sits inside the hold-still step and must not reset its timer.',
};

// ================================================================== S20 Fort Night
const S20_SCENES: EduScene[] = [
  // ------------------------------------------------ step 1: the declaration (line indices match the main scene)
  scene(
    's20-declaration',
    [
      N('The snow after the Long Night is the deep, squeaky kind. Every child in the valley is out in it. None of them is cold, they say.'),
      N('A sheet of cereal-box card is tied to your gate. The capitals are very angry and the spelling is very brave.'),
      N('“DECLARASHUN OF WAR. FORT NIGHT. THE COMMON. BRING MITTENS. — THE OTHER FORT”'),
      N('Sparks’s cousin is back for the winter holidays, and has found out about snow.'),
      TI('You’re commanding one fort. I’m commanding the other. One of us is going to win, and it’s me.', 'happy'),
      N('On the Common, two forts are marked out in sticks: one by the hedge, one by the frozen ditch.'),
      N('Neither has a wall. Both have flags.'),
      PX('Morning. I’m the referee. I’ve written the rules. Forty-one pages. Nobody will read them. I’ll enforce them anyway.'),
      PX('Three rounds. Each round, the referee teaches one idea. This is educational. Nobody tell the children.'),
      PX('Round one: economy. Snow makes walls. Sticks make the catapult. More gatherers early means more of everything later.'),
      PX('Units: Speedy beats Splashy. Splashy beats Sturdy. Sturdy beats Speedy. It goes round and round, like the seasons. Or a grudge.'),
      N('Behind Pixel, a small boy in a bobble hat is hit in the ear by a snowball. Nobody has started yet.'),
      GO('I’m all right!', 'happy'),
      PX('That’s Gordon. Gordon gets hit. It isn’t a rule. It’s more like weather.'),
      WR('Commander! I’m Wren! What’s our battle cry, commander?', 'happy'),
    ],
    [
      {
        domain: 'literacy',
        skill: 'spelling the “-tion” ending',
        kind: 'ask',
        after: 2,
        prompt: [N('DECLARASHUN is very brave spelling. How is the word really spelt?')],
        options: [
          {
            label: 'DECLARATION',
            best: true,
            reply: [N('Yes! The ending “-tion” says “shun”. You can hear it in station, potion and, sadly, detention.')],
          },
          { label: 'DECLARASHON', reply: [N('It does sound like that! But the “shun” sound at the end of a word is very often spelt “-tion”: declaration.')] },
          { label: 'DECKLERATION', reply: [N('Good try at the start. It’s “dec”, not “deck”: declaration. And the end is “-tion”, which says “shun”.')] },
        ],
        parentNote: 'Learned that the “shun” sound at the end of many words is spelt “-tion” (declaration, station).',
      },
      {
        domain: 'maths',
        skill: 'following a rule in a cycle, like rock-paper-scissors',
        kind: 'ask',
        after: 10,
        prompt: [
          PX('Speedy beats Splashy. Splashy beats Sturdy. Sturdy beats Speedy.'),
          PX('Say the other fort sends Sturdy rollers at you. What do you send back?'),
        ],
        options: [
          { label: 'Speedy', reply: [PX('Ruling: squashed. Sturdy beats Speedy.'), N('Look for the unit that beats Sturdy: Splashy.')] },
          {
            label: 'Splashy',
            best: true,
            reply: [
              PX('Correct. Splashy beats Sturdy.'),
              N('It’s a cycle, like rock, paper, scissors. Every unit beats one and loses to one, so nobody can win every time.'),
            ],
          },
          { label: 'Sturdy', reply: [PX('Sturdy against Sturdy. Two big snowballs, very slowly. We’ll be here till spring.'), N('Splashy is the one that beats Sturdy.')] },
        ],
        parentNote: 'Used a cycle rule (each unit beats one and loses to one, like rock-paper-scissors) to choose the right counter.',
      },
    ],
    [
      {
        id: 'fort',
        label: '“FOR THE FORT!”',
        set: { 's20-cry': 'fort' },
        then: [WR('FOR THE FORT!', 'happy'), PX('Classic. Solid. Ruling: approved.')],
      },
      {
        id: 'mittens',
        label: '“FOR WREN’S NAN’S GOOD MITTENS!”',
        set: { 's20-cry': 'mittens' },
        then: [WR('FOR MY NAN’S GOOD MITTENS!', 'happy'), WR('She knitted them. They’ve got thumbs and everything.')],
      },
      {
        id: 'gordon',
        label: '“REMEMBER GORDON!”',
        set: { 's20-cry': 'gordon' },
        then: [GO('I’m right here.', 'think'), N('Your whole fort roars it anyway. Gordon looks touched. Then he is hit by a snowball.')],
      },
    ],
  ),
  scene(
    's20-round1',
    [
      WR('Yes, commander! On it, commander!'),
      N('Every time you point at Wren, she salutes and says something. You point at her rather a lot.'),
      WR('Yes, commander. Yes, commander. Commander, that’s nine times. I’m only little.', 'angry'),
      PX('Notice: your sticks are low. Sticks are scarce now. Notice: you can’t recruit more children. You’ve run out of mittens.'),
      PX('Ruling: a snowball that hits a snowman is friendly fire. The snowman has feelings. He’s called Derek.'),
      N('At the whistle, your wall is knee-high, fat and lumpy. Theirs is shoulder-high, thin, and has battlements.'),
      TI('Economy! I put everyone on snow from the very start. I learned it off the Tax Toad.', 'happy'),
      PX('Round one: a draw. Theirs is taller. Yours is fatter. Ruling: both of them are walls.'),
    ],
    [
      {
        domain: 'social-studies',
        skill: 'scarcity: choosing when there isn’t enough',
        standard: 'D2.Eco.1.K-2',
        kind: 'ask',
        after: 3,
        prompt: [PX('Your sticks are scarce. You can’t get any more. What’s the smart thing to do?')],
        options: [
          {
            label: 'Save them for the most important job, and build the rest from snow.',
            best: true,
            reply: [
              PX('Correct. When there isn’t enough of something, you have to choose what it’s for. That’s called scarcity.'),
              PX('Everybody deals with it. Shops, towns, and forts.'),
            ],
          },
          { label: 'Use them all on the first thing you see.', reply: [PX('Then there are none left for the thing that matters.'), N('When something is scarce, choose carefully what it’s for. Save sticks for the most important job.')] },
          { label: 'Cry into your mittens.', reply: [PX('You’ve run out of mittens.'), N('A better plan: when something is scarce, save it for the most important job and use snow for the rest.')] },
        ],
        parentNote: 'Learned that scarcity (not having enough) means choosing what to use something for.',
      },
      {
        domain: 'science',
        skill: 'comparing two designs: why a wide base is steadier',
        standard: '3-5-ETS1-2',
        kind: 'ask',
        after: 5,
        prompt: [N('Compare the walls. Yours: low, fat and lumpy. Theirs: tall and thin. Which one is harder to knock over?')],
        options: [
          {
            label: 'Mine: low and wide.',
            best: true,
            reply: [N('Yes. A wide base and a low height make things steady. That’s why pyramids are wide at the bottom, and why a tall, thin wall wobbles.')],
          },
          { label: 'Theirs: tall and thin.', reply: [N('It looks grander! But tall and thin is wobbly: one good push and it tips. A low, wide wall is steadier. Remember that.')] },
          { label: 'They’re exactly the same.', reply: [N('Same snow, different shapes! The low, wide one is steadier. Shape matters as much as stuff.')] },
        ],
        parentNote: 'Compared two wall designs and learned that a wide base and low height make a structure steadier.',
      },
    ],
  ),
  // ------------------------------------------------ step 2: scouting
  scene(
    's20-scout',
    [
      PX('Round two: scouting. You can’t beat what you can’t see.'),
      N('Sparks lends you a Swift Nubbin called Zip: thin as a whisker, faster than gossip, and unable to sit still for any reason.'),
      N('Zip vibrates in your mittens like a sneeze that hasn’t happened yet.'),
      PX('Send the scout round their fort. Count what they’ve got. Don’t let him get caught.'),
      PX('Being caught means a snowball to the face. For Zip, that’s most of his body.'),
      GO('Can I scout?', 'happy'),
      PX('No, Gordon. You’d get hit.'),
      GO('That’s fair.'),
    ],
    [
      {
        domain: 'literacy',
        skill: 'spotting a simile',
        standard: 'L.4.5',
        kind: 'ask',
        after: 2,
        prompt: [N('A simile compares two things using “like” or “as”. Which of these is a simile?')],
        options: [
          {
            label: '“like a sneeze that hasn’t happened yet”',
            best: true,
            reply: [N('Yes! Zip is compared to a sneeze that’s about to happen: fizzing and ready to go. “Thin as a whisker” is another one.')],
          },
          { label: '“Round two: scouting.”', reply: [N('That’s just Pixel being a referee. Look for “like” or “as”: Zip vibrates “like a sneeze that hasn’t happened yet”.')] },
          { label: '“That’s fair.”', reply: [N('That’s Gordon being very reasonable. A simile uses “like” or “as”: “like a sneeze that hasn’t happened yet”.')] },
        ],
        parentNote: 'Identified a simile (a comparison using “like” or “as”) in the story.',
      },
      {
        domain: 'social-studies',
        skill: 'drawing a simple map seen from above',
        standard: 'D2.Geo.2.K-2',
        kind: 'do',
        after: 4,
        lines: [
          PX('Scouts make maps. Maps are drawn as if you were a bird looking straight down.'),
          PX('Draw the Common: your fort by the hedge, theirs by the frozen ditch, and three snowdrifts for Zip to hide behind.'),
        ],
        check: 'edu:draw:map:the-common',
        parentNote: 'Drew a bird’s-eye map of a place, marking landmarks and hiding spots.',
      },
    ],
  ),
  scene(
    's20-intel',
    [
      N('Zip comes back with snow on his eyebrows and something urgent to say, which he says by running round you nine times.'),
      N('You read it in his tracks. Their wall is magnificent. Behind it, there is almost nobody.'),
      N('Three of their children have gone home: one lost a mitten, one lost a boot, and one just wanted his tea.'),
      TI('We are FINE. We have LOADS of people. Some of them are in the wall. As bricks.', 'angry'),
      PX('Ruling: children are not bricks.'),
      PX('…Ruling: nearly.'),
    ],
    [
      {
        domain: 'maths',
        skill: 'a two-step take-away problem',
        standard: '3.OA.D.8',
        kind: 'ask',
        after: 2,
        prompt: [
          N('Zip’s tracks say: their fort started with 10 children. 3 went home. 4 more are busy patting the wall.'),
          N('How many are left to defend it?'),
        ],
        options: [
          { label: '7', reply: [N('That’s after the 3 went home: 10 − 3 = 7. But 4 more are busy with the wall. 7 − 4 = 3.')] },
          {
            label: '3',
            best: true,
            reply: [N('Yes! Two steps: 10 − 3 = 7, then 7 − 4 = 3. Three defenders. “Almost nobody” is right.')],
          },
          { label: '6', reply: [N('Let’s do it in two steps. 10 − 3 = 7 still there… then 7 − 4 = 3 left. Three defenders.')] },
        ],
        parentNote: 'Solved a two-step subtraction problem (10 − 3 − 4 = 3).',
      },
      {
        domain: 'social-studies',
        skill: 'fair play: using a chance or waiting (think question)',
        standard: 'D2.Civ.8.K-2',
        kind: 'ask',
        after: 5,
        prompt: [N('Their fort is thin right now. Is it fair to attack while three of them are missing?')],
        options: [
          {
            label: 'Yes. In a game, you use your chances.',
            reply: [N('That’s a fair answer. Lots of games reward spotting a chance. The other commander would probably do the same, only louder.')],
          },
          {
            label: 'No. A fair fight means both sides are ready.',
            reply: [N('That’s a fair answer too. Footballers often kick the ball out when someone on the other team is hurt. It isn’t a rule. It’s fair play.')],
          },
          {
            label: 'It depends on what everyone agreed.',
            reply: [N('That’s a thoughtful answer. Fairness often comes down to the rules everyone agreed before the game. Pixel’s forty-one pages don’t say.')],
          },
        ],
        parentNote: 'Weighed up whether it is fair to take advantage of the other side’s bad luck in a game.',
      },
    ],
    [
      {
        id: 'press',
        label: 'Attack now, while they’re thin. It’s a war. They’d do the same.',
        set: { 's20-round2': 'pressed' },
        then: [
          WR('CHARGE! Yes, commander! Charging, commander!', 'happy'),
          N('Your fort pours across the Common. Their wall is splendid, and almost nobody is behind it.'),
          TI('That’s not FAIR!', 'angry'),
          TI('…That’s exactly what I’d have done. I hate it.', 'think'),
          PX('Round two to your fort. Scouting works. It’s horrible. That’s the lesson.'),
        ],
      },
      {
        id: 'wait',
        label: 'Wait till their three come back. Beating half a fort isn’t winning.',
        set: { 's20-round2': 'waited' },
        then: [
          N('You send Zip back with a snowball that has a smiley face pressed into it. It means “we’ll wait”.'),
          N('Ten minutes later, one mitten, one boot and one boy full of tea come trudging back up the lane.'),
          TI('You waited for us? That’s either very nice or very sneaky.', 'think'),
          PX('Round two: a draw. Ruling: honour is worth one point. I’ve just added it. Page forty-two.'),
        ],
      },
    ],
  ),
  // ------------------------------------------------ step 3: counters
  scene(
    's20-counters',
    [
      PX('Round three. The last one. Counters.'),
      PX('Look at what they’re sending. Send what beats it. That’s all strategy is. Everything else is shouting.'),
      N('Over the ditch, the other fort is massing Sturdy: big children rolling big snowballs, slow as weather.'),
      TI('SURRENDER OR BE ROLLED!', 'angry'),
      N('Your fort answers with its battle cries. “I AM NOT COLD, I AM BRAVE!” “FOR DEREK!” “MUM SAID BE BACK BY FOUR!”'),
      N('Above the hill the sky has gone the colour of a pigeon. Nobody is looking at it except Pixel.'),
      PX('Hm.', 'think'),
    ],
    [
      {
        domain: 'maths',
        skill: 'applying a cycle rule to a sequence',
        standard: '4.OA.C.5',
        kind: 'do',
        after: 2,
        lines: [
          PX('They’ll send three waves: Sturdy, then Speedy, then Splashy. Match each wave with the unit that beats it.'),
          PX('Remember the cycle. Speedy beats Splashy. Splashy beats Sturdy. Sturdy beats Speedy.'),
        ],
        check: 'edu:match:counters:3-waves',
        parentNote: 'Applied a rule to a sequence: matched each wave with its counter (Splashy, then Sturdy, then Speedy).',
      },
      {
        domain: 'science',
        skill: 'reading the sky for a change in the weather',
        standard: 'K-ESS2-1',
        kind: 'notice',
        after: 6,
        lines: [
          PX('Thick, dark grey clouds rolling in. The wind picking up. When the sky changes like that, the weather often changes too.'),
          PX('Weather watchers look up. Commanders, it turns out, look at flags.'),
        ],
        parentNote: 'Learned that thickening dark clouds and rising wind are signs the weather may change.',
      },
    ],
  ),
  scene(
    's20-blizzard',
    [
      N('You are one dash from their flag when the snow stops falling down and starts falling sideways.'),
      N('Then it is everywhere. You can’t see their fort. You can’t see your own. You can only hear Gordon, being hit by weather.'),
      PX('STOP. Whistle. Full stop. That’s a real one. That’s a real blizzard.', 'shock'),
      N('Pixel’s whistle is lost in the wind. Somebody small is crying, and you can’t tell which fort they belong to.'),
      TI('Our wall’s fallen in! It all fell in! I can’t find everyone!', 'shock'),
      N('Your own wall is still standing: knee-high, fat and lumpy. It is nowhere near big enough for everybody.'),
    ],
    [
      {
        domain: 'science',
        skill: 'what a blizzard is',
        standard: 'K-ESS2-1',
        kind: 'notice',
        after: 2,
        lines: [
          N('A blizzard is a snowstorm with very strong wind that goes on for a long time.'),
          N('The wind blows the snow sideways, so you can hardly see. When everything turns white, people call it a whiteout.'),
        ],
        parentNote: 'Learned what a blizzard is: strong wind, blowing snow, and very poor visibility.',
      },
      {
        domain: 'sel',
        skill: 'putting safety before winning',
        standard: 'CASEL: Responsible decision-making',
        kind: 'ask',
        after: 5,
        prompt: [N('Everyone is scared and the game has stopped. What matters most now?')],
        options: [
          {
            label: 'Getting every child, from both forts, somewhere safe.',
            best: true,
            reply: [N('Yes. When something real goes wrong, the game stops and people come first. All of them, whichever fort they’re from.')],
          },
          { label: 'Grabbing the flag. We were one dash away!', reply: [N('It’s tempting! But a game can wait. People can’t. The most important thing is getting every child safe.')] },
          { label: 'Finding just your own fort.', reply: [N('Your fort matters. But so does the small crying person, whoever they belong to. In a real emergency, everyone counts.')] },
        ],
        parentNote: 'Decided that keeping everyone safe matters more than winning a game.',
      },
    ],
  ),
  // ------------------------------------------------ step 4: one shelter
  scene(
    's20-merge',
    [
      N('Through the white you can just make out the hedge, the ditch, and children from both forts, standing about like dropped gloves.'),
      PX('Referee’s ruling.'),
      PX('…I don’t have a ruling. Commander? You’ve got a wall. They’ve got the snow. Nobody’s got enough.'),
      TI('Is this a trick? Is this a strategy?', 'think'),
      Y('Yes.'),
      N('A strategy is just a plan for getting what you want. Right now, what you want is everybody warm.'),
    ],
    [
      {
        domain: 'sel',
        skill: 'combining what you have to solve a shared problem',
        standard: 'CASEL: Relationship skills',
        kind: 'ask',
        after: 2,
        prompt: [N('You have a wall but not enough snow. They have snow but no wall. What’s the best plan?')],
        options: [
          {
            label: 'Put them together. One wall, everyone’s snow.',
            best: true,
            reply: [N('Yes. Neither side has enough alone. Together, they do. That’s what teamwork is for.')],
          },
          { label: 'Keep your wall for your own fort.', reply: [N('Your wall is too small even for your fort, and the other children are cold. Put the wall and the snow together, and everyone fits.')] },
          { label: 'Wait for the blizzard to stop.', reply: [N('Blizzards can last for hours. Better to build now: your wall plus their snow makes one shelter for everyone.')] },
        ],
        parentNote: 'Worked out that two groups can solve a problem together by combining what each one has.',
      },
    ],
    [
      {
        id: 'gate',
        label: 'Kick open your wall and shout them all in.',
        set: { 's20-merge': 'gate' },
        then: [
          N('You kick a gap in your own wall. “IN! EVERYONE IN!”'),
          N('Your fort has been taught all morning to do what you say. It does it, and starts pulling the others in by their scarves.'),
        ],
      },
      {
        id: 'carry',
        label: 'Carry your wall to them, snowball by snowball.',
        set: { 's20-merge': 'carried' },
        then: [N('Your gatherers know how to move snow fast. You taught them that this morning.'), N('It turns out that was what it was for.')],
      },
      {
        id: 'middle',
        label: 'Meet in the middle. Both walls, one shelter.',
        set: { 's20-merge': 'middle' },
        then: [
          N('You meet in the ditch between the forts. Both sides bring snow. Both sides bring sticks.'),
          N('The catapult becomes a roof beam. Derek the snowman becomes a door.'),
        ],
      },
    ],
  ),
  scene(
    's20-count',
    [
      PX('Head count.'),
      PX('…Everyone. Even Gordon.', 'soft'),
      GO('I got hit by a whole sky.', 'happy'),
      N('Inside it is close and blue and smells of wet wool. Forty mittens steam. Somebody is eating snow. Pixel rules against it, then allows it.'),
      TI('That’s my wall, in our roof. That bit’s mine.'),
      N('The roof is sticks from both forts, leaning together in pointed pairs, with snow packed on top.'),
      WR('Commander? Which fort won?'),
      N('Outside, the wind drops as suddenly as it came. Somebody pokes a hole in the roof to look.'),
    ],
    [
      {
        domain: 'maths',
        skill: 'division as sharing into pairs',
        standard: '3.OA.A.3',
        kind: 'ask',
        after: 3,
        prompt: [N('Forty mittens are steaming. Every child has two. How many children are in the shelter?')],
        options: [
          {
            label: '20',
            best: true,
            reply: [N('Yes! 40 ÷ 2 = 20. Twenty children, and not one mitten missing.'), PX('Ruling: that is everyone.', 'soft')],
          },
          { label: '40', reply: [N('That’s the mittens! Each child has two, so share the 40 into pairs. 40 ÷ 2 = 20 children.')] },
          { label: '10', reply: [N('That would be if each child had four mittens. Two each: 40 ÷ 2 = 20 children.')] },
        ],
        parentNote: 'Divided 40 mittens into pairs to find 20 children (40 ÷ 2 = 20).',
      },
      {
        domain: 'science',
        skill: 'why triangles make strong frames',
        kind: 'do',
        after: 5,
        lines: [
          PX('Look up. Two sticks leaning together, with the ground underneath, make a triangle.'),
          PX('Push on a triangle and it keeps its shape. Push on a square and it squashes into a diamond.'),
          PX('That’s why roofs and bridges are full of triangles.'),
          PX('Tap every triangle you can find in the roof.'),
        ],
        check: 'edu:tap:shape:triangle:roof',
        parentNote: 'Found triangles in a roof frame and learned that triangles keep their shape under pressure, which makes frames strong.',
      },
    ],
  ),
];

/** Line indices 4, 6, 8 and 9 match the main scene, so the Bodge swaps in S20’s notes still apply. */
const S20_COMPLETE: EduScene = scene(
  's20-complete',
  [
    N('The sky is clear and black and enormous. Every star the valley owns is out, and a few it has borrowed.'),
    N('Nobody goes home. Both forts lie on their backs in one fort and look up.'),
    WR('That one’s a mitten. That one’s Gordon. That one’s Derek.', 'happy'),
    PX('Final ruling. Both forts win. I’ve written it in pen. Pen is final.'),
    TI('So what was it for, then? The economy and the scouting and the counters?', 'think'),
    Y('So we could build one fort fast, when it mattered.'),
    TI('…That’s annoying. That’s a really good answer.'),
    N('Up at the cottage a lamp is lit in the window, and somebody in a blanket is watching the Common.'),
    N('Tilly puts two fingers in her mouth and whistles the supper call, rising at the end. From the window, faintly, it comes back.'),
    TI('She can still do it.', 'soft'),
    PX('Prizes. Commander’s hat: it was a tea cosy. Snowball launcher: a prototype. Ruling: point it away from Gordon.'),
    PX('And the fort’s yours. I’ll build you one for the Grove that only comes out when it snows.'),
    N('All morning you practised winning. In the end, the useful part was building something big enough for everybody.'),
  ],
  [
    {
      domain: 'science',
      skill: 'why the stars show on a clear night, and constellations',
      standard: '1-ESS1-1',
      kind: 'ask',
      after: 2,
      prompt: [N('Why can you see so many stars tonight?')],
      options: [
        {
          label: 'The clouds have gone, and it’s properly dark.',
          best: true,
          reply: [
            N('Yes. The blizzard’s clouds have blown away, so nothing hides the stars.'),
            N('Long ago, people joined stars into pictures too, called constellations. Wren has just invented the Mitten.'),
          ],
        },
        {
          label: 'The blizzard blew new stars in.',
          reply: [N('Ha! The stars were there all along. The blizzard’s clouds were hiding them. Now the clouds have gone, you can see them all.')],
        },
        {
          label: 'Stars only come out in winter.',
          reply: [N('Stars are there all year, even in the daytime. The Sun is just so bright that it hides them. Tonight it’s dark and clear.')],
        },
      ],
      parentNote: 'Learned that stars are always in the sky but are hidden by clouds and by daylight; met the word constellation.',
    },
    {
      domain: 'literacy',
      skill: 'finding the theme of a story',
      standard: 'RL.4.2',
      kind: 'ask',
      after: 6,
      prompt: [N('A theme is the big idea a story is about. What do you think this story’s theme is?')],
      options: [
        {
          label: 'Skills and plans matter most when they help everybody.',
          best: true,
          reply: [N('Yes. Gathering, scouting and teamwork were practice for a war. In the end they built a shelter for both sides.')],
        },
        { label: 'Always win, whatever happens.', reply: [N('Nobody won! Or everybody did. The big idea is that the skills mattered most when they helped everyone.')] },
        { label: 'Snow is cold.', reply: [N('True, and Gordon would agree. But the big idea is bigger: plans and skills matter most when they help everybody.')] },
      ],
      parentNote: 'Identified the theme of a story: skills and plans matter most when used to help everyone.',
    },
  ],
);

const S20: EduQuest = {
  id: 'reader:s20',
  of: 's20',
  band: 'reader',
  title: 'Fort Night',
  goals: {
    's20-step1': {
      goal: 'Round one: gather snow and sticks, and build your wall before the other fort does.',
      hint: 'Put lots of children on gathering early. Wall first, catapult second: a catapult with no wall is just a target with a spoon.',
    },
    's20-step2': {
      goal: 'Round two: send Zip to scout the other fort, and get him back without being seen.',
      hint: 'Snowdrifts block their lookout’s view. Dash between them when the lookout turns away. Zip’s ears go flat if he’s spotted.',
    },
    's20-step3': {
      goal: 'Round three: send the units that beat theirs, and take their flag.',
      hint: 'Splashy beats Sturdy: wet slush soaks a big snowball and it slumps. Watch what they switch to, and switch too.',
    },
    's20-step4': {
      goal: 'Build one shelter out of both forts, and get every child inside.',
      hint: 'Speedy children fetch, Sturdy children roll, Splashy children pack the gaps. Count heads: there should be 20. Wren is small and easy to miss.',
    },
  },
  scenes: [...S20_SCENES, S20_COMPLETE],
  glossary: [
    gloss('referee', 'The person who makes sure everyone follows the rules of a game.', 's20-declaration'),
    gloss('economy', 'How people get, share and use the things they need.', 's20-declaration'),
    gloss('scarce', 'In short supply, so there isn’t enough for everything.', 's20-round1'),
    gloss('battlements', 'The up-and-down gaps along the top of a castle wall.', 's20-round1'),
    gloss('scout', 'Someone sent ahead to look around and bring back information.', 's20-scout'),
    gloss('magnificent', 'Very grand and impressive.', 's20-intel'),
    gloss('strategy', 'A plan for how to win or reach a goal.', 's20-counters'),
    gloss('blizzard', 'A snowstorm with very strong wind that lasts a long time.', 's20-blizzard'),
    gloss('constellation', 'A group of stars that people join up into a picture.', 's20-complete'),
  ],
  notes:
    'Lessons: “-tion” spelling; cycle rules like rock-paper-scissors (ask, then a three-wave match); scarcity ' +
    '(D2.Eco.1.K-2); comparing wall designs (a wide base is steadier); similes; drawing a bird’s-eye map; 10 − 3 − 4; ' +
    'fair play (think, D2.Civ.8.K-2); weather signs and blizzards; safety before winning; combining resources; ' +
    '40 ÷ 2 mittens; triangles in the roof; stars hidden by clouds and daylight, constellations; theme. The child ' +
    'count is 20 (10 a fort, matching the main notes’ “all 20 are in”). COUSIN VARIANT: line indices match the main ' +
    'scenes, so the same swaps apply. If s14Done is false, every tilly line is played by bodge, with these reader ' +
    'replacements: reader:s20-declaration#3 → (narrator) “Sparks’s other cousin has come for the winter holidays, and ' +
    'has found out about snow.”; reader:s20-declaration#4 → “Bodge. Commander. You command one fort. I command the other. Expected ' +
    'result: me.”; reader:s20-round1#6 → “Economy. Everyone on snow from minute one. I read a book about it.”; ' +
    'reader:s20-complete#8 → (narrator) “Bodge looks up at the cottage window, where somebody in a blanket is waving, ' +
    'and salutes.”; reader:s20-complete#9 → (bodge) “Everyone’s saluting tonight.” No lesson line names Tilly. ' +
    'SUN AND MOON VARIANT: if s3Done, reader:s20-declaration#5 (the first of the two lines about the Common; #6, ' +
    '“Neither has a wall. Both have flags.”, stays) becomes “On the Common, two forts are marked out in ' +
    'sticks, one under a sun flag and one under a moon. Since the Moot, it’s a friendly war. Mostly.” Hazel is never ' +
    'named in the window glimpse. Do lessons have no scoring: any attempt counts.',
};

// ================================================================== S21 CL-4NK
const S21_SCENES: EduScene[] = [
  // ------------------------------------------------ step 1: the unveiling
  scene(
    's21-unveil',
    [
      N('Something is coming up the lane, squeaking. It’s Pixel, pushing a wheelbarrow with a tea towel over it.'),
      PX('Morning. Don’t be alarmed. Be a bit alarmed. A normal amount.'),
      PX('After Sparks fixed the lantern posts, there was a whole box of parts left over. I couldn’t just leave them in a box.'),
      N('Off comes the tea towel. Underneath: a lantern hood, a glass chimney, a brass wick-winder for a nose, and one wheel.'),
      PX('Garden helper. Watering, weeding, carrying. In theory.'),
      N('Pixel turns the wick-winder. Something inside warms up, then whistles, rising, like a kettle that has just heard good news.'),
      CK('HELLO! Hello hello HELLO. I am CL-4NK! The four is silent! So is the dash!', 'happy'),
      CK('Call me Clank! You are my BEST FRIEND!', 'happy'),
      Y('We’ve only just—'),
      CK('Best friend. Decided. Announcement: I HAVE A BEST FRIEND!', 'happy'),
      N('He rolls forward to shake your hand, rolls straight off the cottage step, and lands on his hood in the thyme.'),
      CK('Announcement! I have found the step!', 'happy'),
      CK('The step is very good. The step is also my best friend.'),
      PX('That’s one. I gave it a week before he met the step. I was being optimistic.', 'think'),
    ],
    [
      {
        domain: 'science',
        skill: 'what a robot is',
        kind: 'notice',
        after: 4,
        lines: [
          PX('A robot is a machine that can sense things, follow instructions, and move or do jobs.'),
          PX('The instructions are called a program. People write them. I wrote his. Mostly in capital letters, it turns out.'),
        ],
        parentNote: 'Learned that a robot is a machine that senses, follows a program of instructions written by people, and acts.',
      },
      {
        domain: 'literacy',
        skill: 'numbers standing in for letters in a name',
        kind: 'ask',
        after: 6,
        prompt: [N('Clank says the four in CL-4NK is silent. But look at its shape. Which letter is the 4 pretending to be?')],
        options: [
          {
            label: 'A',
            best: true,
            reply: [
              N('Yes! CL-A-NK. A 4 looks a bit like a pointy A. People sometimes swap in numbers that look like letters.'),
              N('So the four isn’t silent at all. It’s an A in disguise. Don’t tell him.'),
            ],
          },
          { label: 'B', reply: [N('B would make CL-B-NK, which sounds like a sneeze. A 4 looks more like a pointy A: CL-A-NK. Clank!')] },
          { label: 'F', reply: [N('CL-F-NK? Tricky to say! The 4 is shaped a bit like a pointy A: CL-A-NK. Clank!')] },
        ],
        parentNote: 'Decoded a name where a number (4) stands in for a similar-looking letter (A).',
      },
    ],
  ),
  scene(
    's21-tour',
    [
      CK('Announcement: this is a POND! Announcement: this is a GATE! It sticks! Best friend!', 'happy'),
      CK('Announcement: I am announcing!'),
      N('You go round roots and kerbs, not over them. On the flat path his one wheel whizzes. At the smallest bump, he wobbles.'),
      N('By the foot of the hill, every Nubbin in the Grove is following him in a line, like ducklings behind a teapot.'),
      N('One climbs onto his hood. Then three. He turns his chimney-light down low for them, and they purr.'),
      CK('They like me. Announcement: they LIKE me.', 'shock'),
      CK('I didn’t know that was available.', 'soft'),
    ],
    [
      {
        domain: 'science',
        skill: 'what wheels are good at, and what they can’t do',
        kind: 'notice',
        after: 2,
        lines: [
          N('A wheel rolls instead of dragging, so on smooth, flat ground it needs only a small push.'),
          N('But a wheel can’t roll up something that sticks straight up, like a step. That’s why prams, wheelchairs and suitcases love a ramp.'),
        ],
        parentNote: 'Learned that wheels roll easily on smooth ground but struggle with steps and bumps.',
      },
      {
        domain: 'literacy',
        skill: 'what a simile tells you',
        standard: 'L.4.5',
        kind: 'ask',
        after: 3,
        prompt: [N('“Like ducklings behind a teapot.” What does that simile help you picture?')],
        options: [
          {
            label: 'The Nubbins follow him in a neat little line, and he’s round and warm like a teapot.',
            best: true,
            reply: [N('Yes! Two pictures in one: a wobbly line of followers, and a round, warm, whistling leader.')],
          },
          { label: 'The Nubbins are actually ducks.', reply: [N('Ha! They’re still Nubbins. The simile says they follow him LIKE ducklings: in a neat little line behind a round, warm teapot.')] },
          { label: 'Clank is making tea.', reply: [N('Not today. The simile compares him to a teapot because he’s round and warm, with a line of little followers behind.')] },
        ],
        parentNote: 'Explained what a simile helps the reader picture.',
      },
    ],
  ),
  // ------------------------------------------------ step 2: undo the help
  scene(
    's21-help',
    [
      N('You are woken at dawn by a whistle going up and up, and an announcement right outside your bedroom window.'),
      CK('GOOD MORNING, BEST FRIEND! I have done SO MUCH HELPING!', 'happy'),
      N('Fern is in her garden in her dressing gown, holding her cat at arm’s length. Mustard is soaked, and furious about it.'),
      FE('He watered Mustard. He watered my cat. In fairness, Mustard was in the beans. And he is a bit bean-coloured.', 'think'),
      CK('Cats are plants that run! I looked it up! In my head!'),
      N('Behind her, Fern’s one good apple tree has been pruned. Carefully. Thoroughly. Into the shape of a duck.'),
      FE('That’s the wrong tree. The ones I’m keeping alive, badly, have never looked better. That one was my good one.', 'sad'),
      N('Then you notice the western hill. The small old shape that is always on top of it isn’t there.'),
      CK('Also! I rescued a little old one! He was stranded up the hill! For HOURS! He wasn’t even MOVING!', 'happy'),
      N('Speeding round the pond at what can only be called full kettle is Clank.'),
      N('He is holding the little grey watcher from the hill out in front of him, like a pie.'),
    ],
    [
      {
        domain: 'science',
        skill: 'how plants and animals get food',
        standard: 'K-LS1-1',
        kind: 'ask',
        after: 4,
        prompt: [N('Clank says cats are plants that run. Is he right?')],
        options: [
          {
            label: 'No. A cat is an animal. It eats its food and moves about.',
            best: true,
            reply: [
              N('Right. Plants make their own food, using sunlight, air and water. Cats have to eat theirs.'),
              N('Both need water, which is the one thing Clank got right. Just not poured on the outside.'),
            ],
          },
          { label: 'Yes. Cats are plants.', reply: [N('Mustard would like a word. Plants make their own food from sunlight, air and water. Cats eat theirs. So a cat is an animal.')] },
          { label: 'A cat is a kind of bean.', reply: [FE('He is bean-coloured. I’ll give you that.'), N('But beans are plants that make their own food from sunlight. Cats eat theirs. Mustard is an animal.')] },
        ],
        parentNote: 'Explained a difference between plants (make their own food) and animals (eat food), while noting both need water.',
      },
      {
        domain: 'sel',
        skill: 'helping by asking first',
        standard: 'CASEL: Social awareness',
        kind: 'notice',
        after: 6,
        lines: [
          N('Clank really wanted to help. But helping works best when you ask first: “Would you like me to…?”'),
          N('Then you help with what the person actually needs. Fern needed the beans watered. Not the cat.'),
        ],
        parentNote: 'Learned that real helping starts with asking what someone needs.',
      },
    ],
  ),
  scene(
    's21-moss',
    [
      N('You catch up with Clank at the cottage. So does the step.'),
      N('Clank goes over the edge. The little grey one leaves his hands, turns once in the air, and lands on his feet, as if he’d planned the morning.'),
      CK('Announcement… I have found the step again.', 'sad'),
      N('He looks at you for a long time. It’s the look of something very old that has been carried round a pond like a pie.'),
      N('Then he turns and walks back up the hill, very dignified. It takes him the rest of the morning. He doesn’t look back once.'),
      PX('That’s two.'),
    ],
    [
      {
        domain: 'science',
        skill: 'balanced and unbalanced forces: why things fall off edges',
        standard: '3-PS2-1',
        kind: 'notice',
        after: 1,
        lines: [
          PX('On flat ground, gravity pulls him down and the ground pushes back up. The pushes balance, so he stays put.'),
          PX('Off the edge, nothing pushes up. The forces are unbalanced. Gravity wins. Down he goes. Every time.'),
        ],
        parentNote: 'Learned that balanced forces keep an object still, and unbalanced forces (like gravity with nothing pushing back) make it move.',
      },
      {
        domain: 'literacy',
        skill: 'reading a silent character’s body language',
        standard: 'RL.3.3',
        kind: 'ask',
        after: 4,
        prompt: [N('The little grey one doesn’t say a word. What do his long look and his slow walk away tell you?')],
        options: [
          {
            label: 'He wasn’t pleased, but he’s far too dignified to make a fuss.',
            best: true,
            reply: [N('Good reading. A long look and a walk with no looking back can say more than shouting.'), N('He has been carried like a pie, and he has feelings about it.')],
          },
          { label: 'He loved the ride and wants another go.', reply: [N('If he loved it, he might stay! He walks all the way back without looking round. That says: not pleased, but too dignified to fuss.')] },
          { label: 'He’s lost.', reply: [N('He knows exactly where he’s going: back to the top of his hill. The slow, proud walk says he wasn’t pleased.')] },
        ],
        parentNote: 'Inferred a silent character’s feelings from his actions and body language.',
      },
    ],
  ),
  // ------------------------------------------------ step 3: Byte’s log
  scene(
    's21-log',
    [
      N('That afternoon Byte is at the gate with a clipboard, a pencil behind each ear, and the face of someone who has made a table.'),
      BY('Incident log. Since breakfast: one wet cat. One duck-shaped tree. One old Nubbin, moved at about eleven miles an hour.'),
      BY('Two falls down the step. Fourteen announcements of best friendship. One of them to a bucket.'),
      BY('He’s a kettle on a wheel who wants to help. That is exactly how accidents introduce themselves.', 'think'),
      BY('Next time it’s a Nubbin he waters. Or drops. Pixel should switch Clank off. Tonight. Before he hurts someone.'),
      N('Behind you, a small whistle starts to rise, and stops halfway.'),
      N('Clank is at the top of the cottage step. He has heard all of it. His chimney-light has gone very dim.'),
      N('He reverses. He goes off the step backwards, lands in the thyme, and doesn’t announce anything at all.'),
      PX('…That’s three.', 'sad'),
      N('By the time you reach the step he’s gone. There’s just a wheel-track through the herbs, heading for the lantern shed.'),
      BY('I didn’t know he could hear. I didn’t know he could… mind.', 'sad'),
    ],
    [
      {
        domain: 'maths',
        skill: 'making and reading a tally chart',
        standard: '2.MD.D.10',
        kind: 'do',
        after: 2,
        lines: [
          BY('Help me turn my log into a tally chart. One row each: wet cats, duck trees, carried Nubbins, falls, best friends.'),
          BY('Tally marks go in fives: four lines, then one across. Which row is longest?'),
        ],
        check: 'edu:make:tally-chart:incident-log',
        parentNote: 'Made a tally chart from a list of events (1, 1, 1, 2, 14) and found the largest category.',
      },
      {
        domain: 'science',
        skill: 'what makes something alive; can a robot be a friend (think question)',
        kind: 'ask',
        after: 10,
        prompt: [N('Byte didn’t know Clank could mind. What do you think? Is Clank alive? Can a robot be a real friend?')],
        options: [
          {
            label: 'He’s a machine, so he isn’t alive. But he can still be a friend.',
            reply: [
              N('That’s a fair answer. Scientists say living things grow, need food and water, and make young. Clank does none of those.'),
              N('But being a friend is about how you treat each other. He’s very good at that part.'),
            ],
          },
          {
            label: 'He might be alive. He has feelings.',
            reply: [
              N('That’s a fair answer. Clank seems to mind things, and that matters.'),
              N('A scientist would say he doesn’t grow, eat or make young. Nobody is quite sure what his feelings are made of. Not even Pixel.'),
            ],
          },
          {
            label: 'He’s a tool, like a watering can.',
            reply: [
              N('That’s a fair answer. He was built to do jobs.'),
              N('But a watering can doesn’t hide when its feelings are hurt. Maybe Clank is something new: a tool who wants to be a friend.'),
            ],
          },
        ],
        parentNote: 'Thought about what makes something alive (growing, needing food and water, making young) and whether a robot can be a friend.',
      },
    ],
    [
      {
        id: 'fair',
        label: 'Tell Byte he had a point. Clank does need to learn.',
        set: { 's21-byte': 'fair' },
        then: [
          BY('I did have a point. I hate that I had a point. It’s much worse having one when it hurts.', 'sad'),
          PX('Something between “on” and “kettle”. That’s all he needs. I can build that.', 'think'),
        ],
      },
      {
        id: 'unfair',
        label: 'Tell Byte that wasn’t fair. He’s only days old.',
        set: { 's21-byte': 'unfair' },
        then: [BY('Days old. I didn’t count that in.', 'sad'), BY('I was days old once. I’m told I bit a vicar.')],
      },
    ],
  ),
  scene(
    's21-shed',
    [
      N('The lantern shed smells of paraffin and old string. Clank is on the back shelf among the spare chimneys, pretending to be a lantern.'),
      N('He is very bad at it. Lanterns don’t shake.'),
      CK('Announcement. I’m a lantern now. Lanterns are useful. Nobody switches off a lantern.', 'sad'),
      CK('Except in the morning. They do switch them off in the morning.'),
      CK('Byte’s right. I watered a cat. I made a tree into a duck. I carried the old one too fast and he didn’t say one single thing.'),
      CK('Am I a friend? Or am I a thing that does jobs?', 'think'),
      CK('Because if it’s jobs, I can do jobs better. I can learn. But if I stop being useful…'),
      CK('If I stop being useful, will you still…'),
      N('He stops. Something inside him clicks, and clicks again, looking for a word it hasn’t got.'),
      CK('I don’t have the word. Pixel didn’t put it in.', 'sad'),
    ],
    [
      {
        domain: 'sel',
        skill: 'putting a word to a worry',
        standard: 'CASEL: Self-awareness',
        kind: 'ask',
        after: 9,
        prompt: [N('“If I stop being useful, will you still…” Which word do you think Clank is looking for?')],
        options: [
          {
            label: '…like me?',
            reply: [N('That could be it. Clank is worried: scared about something that might happen. Finding the word for a worry makes it easier to share.')],
          },
          {
            label: '…want me?',
            reply: [N('That could be it. Clank is worried he only matters when he’s doing jobs. Saying a worry out loud is the first step to someone helping.')],
          },
          {
            label: '…love me?',
            reply: [N('That could be it. It’s a big word for a small kettle.'), N('Clank is worried. Naming a worry is brave, even if you need help finding the word.')],
          },
        ],
        parentNote: 'Helped a character find words for a worry, and learned that naming a worry makes it easier to share.',
      },
    ],
    [
      {
        id: 'sit',
        label: 'Sit down below the shelf, and wait.',
        set: { 's21-lesson': 'sit' },
        then: [
          N('You sit on the shed floor under the shelf. It isn’t comfortable. You stay.'),
          CK('What are you doing? Is it a job?'),
          Y('No. I’m just here.'),
          CK('Just here for what?', 'think'),
          Y('Nothing. That’s the whole thing.'),
          N('After a long time Clank comes down off the shelf, very carefully, and parks beside you. He doesn’t announce it.'),
        ],
      },
      {
        id: 'step',
        label: 'Teach him the step: it’s all right to ask for help.',
        set: { 's21-lesson': 'step' },
        then: [
          Y('Do you know why you keep falling down the step?'),
          CK('Because I am brave?', 'happy'),
          Y('Because you never ask anyone to help you down it.'),
          CK('But then I’d be needing. Helpers don’t need. Needing is the opposite of a job.', 'think'),
          Y('Everybody needs a hand with a step sometimes. Fern does. Hazel did. I do, on bad days.'),
          N('Clank thinks about this for so long that his whistle goes off by itself, very softly.'),
        ],
      },
    ],
  ),
  // ------------------------------------------------ step 4: the ramp
  scene(
    's21-ramp',
    [
      N('Next afternoon Byte comes up the lane with a plank, a saw, and the face of a sum that won’t come out.'),
      BY('I measured the step. Nineteen centimetres. The safe height for one wheel is, as far as I can find, zero.'),
      BY('So it isn’t him. Statistically, it’s the step.'),
      BY('I said he should be switched off. That was a conclusion. I hadn’t finished collecting the data.', 'think'),
      BY('The data now includes eleven Nubbins who follow him everywhere. That is a significant result.', 'soft'),
      CK('Byte! Byte! Does that mean you’re my best—', 'happy'),
      BY('Provisionally.', 'happy'),
    ],
    [
      {
        domain: 'maths',
        skill: 'choosing a sensible unit of length',
        standard: '4.MD.A.1',
        kind: 'ask',
        after: 1,
        prompt: [N('Byte says the step is nineteen… what? Which unit makes sense for a step?')],
        options: [
          {
            label: 'Centimetres',
            best: true,
            reply: [N('Yes. 19 cm is about the length of a pencil. A good size for a step, and a bad size for one wheel.')],
          },
          { label: 'Metres', reply: [N('19 metres is taller than a house! That would be quite a step. For a step, centimetres make sense: 19 cm.')] },
          { label: 'Kilometres', reply: [N('19 kilometres would take about four hours to walk! For a step, centimetres make sense: 19 cm.')] },
        ],
        parentNote: 'Chose centimetres as the sensible unit for a step’s height, comparing it with metres and kilometres.',
      },
      {
        domain: 'science',
        skill: 'defining the real problem before fixing it',
        standard: 'K-2-ETS1-1',
        kind: 'notice',
        after: 4,
        lines: [
          N('Byte has changed the problem. Not “Clank keeps falling”, but “the step is too high for a wheel”.'),
          N('Engineers and scientists work like this. Say exactly what the problem is, look at all the data, and change your mind when the data changes.'),
        ],
        parentNote: 'Learned that solving a problem starts with defining it clearly, and that good thinkers change their minds when new evidence arrives.',
      },
    ],
  ),
  scene(
    's21-down',
    [
      N('The ramp is finished: small, sanded, very well made. Byte calls it an inclined plane. Everyone else calls it a ramp.'),
      CK('Announcement. I am going down the step.', 'soft'),
      CK('Announcement. Would somebody… come with me? The first time?'),
      N('Byte puts one hand on his hood. You put one on the other side. Pixel holds the wheelbarrow, for reasons.'),
      N('He goes down the ramp at the speed of a snail with doubts. He reaches the bottom. Nothing falls.'),
      CK('I DID THE STEP! I did the step and I didn’t find it!', 'happy'),
      N('He does a little dance: forward, back, a spin on his one wheel. You copy it. Byte copies it, and later denies it.'),
      PX('That’s… none. I’ll take none.', 'happy'),
    ],
    [
      {
        domain: 'sel',
        skill: 'asking for help is brave',
        standard: 'CASEL: Relationship skills',
        kind: 'notice',
        after: 2,
        lines: [
          N('That might be the bravest thing Clank has done. He asked for help.'),
          N('Asking isn’t the opposite of being helpful. It’s how everybody gets down hard steps. Robots included.'),
        ],
        parentNote: 'Learned that asking for help is a brave and normal thing to do.',
      },
      {
        domain: 'science',
        skill: 'why a ramp (inclined plane) is gentler than a step',
        standard: '3-PS2-1',
        kind: 'ask',
        after: 4,
        prompt: [N('Why can Clank go down the ramp safely, when the step always tipped him over?')],
        options: [
          {
            label: 'The ramp spreads the drop over a long, gentle slope, so he goes down a little at a time.',
            best: true,
            reply: [
              N('Yes. Gravity still pulls, but the slope means it pulls him gently along instead of straight down all at once.'),
              N('A steeper ramp would make him go faster. Byte checked. Eleven times.'),
            ],
          },
          { label: 'Ramps switch gravity off.', reply: [N('Gravity never switches off! The ramp spreads the drop out over a long slope, so gravity pulls him down gently, a little at a time.')] },
          { label: 'It’s magic.', reply: [N('It feels like magic! But it’s a simple machine: a slope spreads the drop out, so gravity takes him down gently, a bit at a time.')] },
        ],
        parentNote: 'Explained that a ramp (inclined plane) spreads a drop over a longer distance, so gravity moves an object down more gently.',
      },
    ],
  ),
  // ------------------------------------------------ step 5: just here
  scene(
    's21-evening',
    [
      N('The afternoon goes gold. Clank parks at the bottom of the new ramp and doesn’t water anything, which costs him a great deal.'),
      CK('Announcement: I am not helping. I am just… here.', 'think'),
      CK('Is that allowed? Is just here allowed?'),
      Y('Just here is allowed.'),
      CK('Announcement: just here is allowed.', 'soft'),
      N('He twitches towards a dandelion. He stops himself. It is the hardest thing he has done all week.'),
    ],
    [
      {
        domain: 'science',
        skill: 'why evening sunlight looks golden',
        kind: 'notice',
        after: 0,
        lines: [
          N('Why does the afternoon go gold? When the Sun is low, its light travels through much more air to reach you.'),
          N('The air scatters away lots of the blue light on the way. What gets through looks warm and golden.'),
        ],
        parentNote: 'Learned that low evening sunlight passes through more air, which scatters blue light, so it looks golden.',
      },
      {
        domain: 'sel',
        skill: 'being still and noticing',
        standard: 'CASEL: Self-management',
        kind: 'do',
        after: 5,
        lines: [
          N('Be “just here” with Clank. Sit still and listen.'),
          N('Can you hear three different sounds? Maybe a bird, the pond, and a very small kettle-whistle trying not to happen.'),
        ],
        check: 'edu:listen:sounds:3',
        parentNote: 'Practised sitting still and noticing three sounds, a simple calming exercise.',
      },
    ],
  ),
];

const S21_COMPLETE: EduScene = scene(
  's21-complete',
  [
    N('At dusk the Nubbins come in from the long grass one by one, and climb onto Clank, because he’s warm, like a kettle that’s just been on.'),
    N('Seven of them. Eight. One on his wheel. One perched on his lantern hood, like a hat.'),
    CK('Announcement.', 'soft'),
    CK('I am being very still.', 'soft'),
    N('He is. For an hour, the chattiest thing in the valley doesn’t move a bolt. Not even to announce that he isn’t moving.'),
    N('You sit beside him. That’s all. It turns out that’s plenty.'),
    PX('Keep him. He’s yours now. He’ll water things, slowly. Mostly plants.'),
    N('Pixel drops a spare lantern hood on your head. It fits, as if it was waiting to.'),
    N('Next morning he is out among the beans with a watering can, one bean a minute. Mustard watches from Fern’s wall, from very far away.'),
    N('Clank is still a machine. He is also, it turns out, somebody’s friend. Both things can be true at once.'),
  ],
  [
    {
      domain: 'science',
      skill: 'heat moves from warmer things to cooler things',
      standard: '4-PS3-2',
      kind: 'notice',
      after: 1,
      lines: [
        N('Heat moves from warmer things to cooler things. As dusk cools the air, Clank’s warmth flows into the Nubbins snuggled on him.'),
        N('That’s why they choose him. He’s the warmest seat in the Grove.'),
      ],
      parentNote: 'Learned that heat moves from warmer objects to cooler ones.',
    },
    {
      domain: 'maths',
      skill: 'a time interval: one bean a minute',
      standard: '3.MD.A.1',
      kind: 'ask',
      after: 8,
      prompt: [N('Clank waters one bean a minute. There are 30 beans in the row. How long will the whole row take?')],
      options: [
        {
          label: '30 minutes',
          best: true,
          reply: [N('Yes! One a minute, 30 beans: 30 minutes. That’s half an hour of very loud watering.')],
        },
        { label: '3 minutes', reply: [N('That would be ten beans a minute, and Clank is a one-bean-a-minute robot. 30 beans takes 30 minutes: half an hour.')] },
        { label: '30 hours', reply: [N('He’s slow, but not that slow! One bean a minute means 30 beans take 30 minutes: half an hour.')] },
      ],
      parentNote: 'Worked out a time interval (30 beans at one a minute takes 30 minutes, half an hour).',
    },
  ],
);

const S21: EduQuest = {
  id: 'reader:s21',
  of: 's21',
  band: 'reader',
  title: 'CL-4NK',
  goals: {
    's21-step1': {
      goal: 'Show Clank round the Grove.',
      hint: 'He follows you on one wheel. Go round things, not over them. He can’t do steps, kerbs or roots, though he believes he can.',
    },
    's21-step2': {
      goal: 'Undo Clank’s helping before he helps anything else.',
      hint: 'Dry the cat, prop up the tree, then try to catch Clank before he reaches the step. In that order, if you can. You won’t.',
    },
    's21-step3': {
      goal: 'Find Clank.',
      hint: 'Follow the wheel-track through the thyme. He’s hiding somewhere he thinks he fits in.',
    },
    's21-step4': {
      goal: 'Help Byte build a ramp for the cottage step.',
      hint: 'Byte measures; you saw. Measure twice. Byte will measure eleven times. Let him.',
    },
    's21-step5': {
      goal: 'Stay in the Grove with Clank until dusk.',
      hint: 'Feed the Nubbins first. Then sit by the cottage step and do nothing at all. It’s harder than it sounds.',
    },
  },
  scenes: [...S21_SCENES, S21_COMPLETE],
  glossary: [
    gloss('optimistic', 'Hoping and expecting that things will turn out well.', 's21-unveil'),
    gloss('announcement', 'Something said out loud so that everyone knows it.', 's21-tour'),
    gloss('pruned', 'Cut back, to trim a plant or tree into shape.', 's21-help'),
    gloss('stranded', 'Stuck somewhere with no way to get back.', 's21-help'),
    gloss('dignified', 'Calm and proud, even when something silly happens.', 's21-moss'),
    gloss('incident', 'Something that happens, often something that goes wrong.', 's21-log'),
    gloss('paraffin', 'A kind of oil that is burned in lamps and lanterns.', 's21-shed'),
    gloss('data', 'Facts and measurements collected so you can find something out.', 's21-ramp'),
    gloss('provisionally', 'For now, until it is checked or decided for sure.', 's21-ramp'),
    gloss('inclined plane', 'A flat surface set at a slope: a ramp. It is one of the simple machines.', 's21-down'),
  ],
  notes:
    'Lessons: what a robot is (senses, follows a program, acts); 4 for A in CL-4NK; wheels and steps; similes; plants ' +
    'make food, animals eat (K-LS1-1); helping by asking first; balanced and unbalanced forces off the step (3-PS2-1); ' +
    'reading the little grey one’s silence; a tally chart of Byte’s log (1, 1, 1, 2, 14); is Clank alive, can a robot be a friend ' +
    '(think); naming a worry; units (19 cm); defining the problem (K-2-ETS1-1); asking for help is brave; ramps as ' +
    'inclined planes (3-PS2-1); golden evening light; a three-sounds stillness beat; heat moves warm to cool ' +
    '(4-PS3-2); 30 beans at one a minute. Moss never speaks, as in the main script, and the narration never names him ' +
    '(S21 can run before c4-open, where the player learns his name): he is “the little grey watcher from the hill” or ' +
    '“the little grey one”, never “older than the trees”. Nothing mentions the shard, ' +
    'Corvin or where Hazel went. The step-fall count (one, two, three, none) is kept. The listening beat in ' +
    's21-evening sits inside the wait-until-dusk step and must not break it. Do lessons have no scoring.',
};

// ================================================================== exports
export const EDU_SIDE_NEW_4_READER: EduQuest[] = [S14, S20, S21];

/** Every `edu:` check used by a `do` lesson in this file. */
export const CHECKS: string[] = [
  // S14
  'edu:breathe:slow:3',
  'edu:draw:map-corner:here-be',
  // S20
  'edu:draw:map:the-common',
  'edu:match:counters:3-waves',
  'edu:tap:shape:triangle:roof',
  // S21
  'edu:make:tally-chart:incident-log',
  'edu:listen:sounds:3',
];
