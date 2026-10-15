/**
 * The Learning Grove, reader band (ages 7–10): educational versions of the fun quests
 * Q11–Q20 (the second half of the Python pack, quests-python.ts).
 *
 *   Q11 The Thinnest Slice      steam, pinching out mint, fractions, listening to fullness
 *   Q12 The Very Quiet Nubbin   signs of life, a fair test, evidence vs excuses, honesty
 *   Q13 Grants for Silly Walks  equal groups, feedback, balance, repeating patterns, play
 *   Q14 The Nap Patrol          soft materials, time intervals, why sleep matters, rest
 *   Q15 The Fruitless Stall     tallying, subtraction, inventory, scarcity, tempo, fair signs
 *   Q16 The Argument Booth      money sums, haggling, sand timers, rainbows, claim + reason
 *   Q17 The Dock Dance          gills, beat in threes, shoals, unbalanced forces, ducks
 *   Q18 Fruit Defence Class     bananas, raspberries, pineapples, worry, vibration
 *   Q19 The Grand Toffs’ Cup    compass directions, length, character traits, fair prizes
 *   Q20 The Larch Lesson        tree identification, the larch, silhouettes, contrast
 *
 * Every scene keeps its story, its jokes and every choice id (reader keeps every choice), with
 * lessons that come out of the joke. No original film or show quotes appear anywhere (the
 * Learning Grove rule): each approved quote in the main script is replaced by a new line. As in
 * the sprout band, the dock dancers use squeaky rubber fish, so no real fish leaves the water.
 * Shells sums use prices printed in the scene (the plush’s 12-Shell tag, Byte’s price board).
 * See EDU-STYLE.md. British spelling.
 */
import type { EduDomain, EduQuest, EduScene, GlossaryEntry, Lesson, LessonOption } from './types';
import type { Line, Choice } from '../config/story';

type Mood = NonNullable<Line['mood']>;
const say =
  (who: string) =>
  (text: string, mood?: Mood): Line =>
    mood ? { who, text, mood } : { who, text };

// ---------------------------------------------------------------- helpers

interface Meta {
  domain: EduDomain;
  skill: string;
  standard?: string;
  parentNote: string;
}
type LessonIn = Omit<Lesson, 'id'>;

/** Lesson metadata: domain, plain skill, grown-up note, and an approved standard if one fits. */
const m = (domain: EduDomain, skill: string, parentNote: string, standard?: string): Meta =>
  standard ? { domain, skill, standard, parentNote } : { domain, skill, parentNote };

const ask = (after: number, meta: Meta, prompt: Line[], options: LessonOption[]): LessonIn => ({
  ...meta,
  kind: 'ask',
  after,
  prompt,
  options,
});
/** A think question: an ask with no `best`; every reply honours the child’s reasoning. */
const think = ask;
const notice = (after: number, meta: Meta, lines: Line[]): LessonIn => ({
  ...meta,
  kind: 'notice',
  after,
  lines,
});
const act = (after: number, meta: Meta, check: string, lines: Line[]): LessonIn => ({
  ...meta,
  kind: 'do',
  after,
  check,
  lines,
});
/** The answer the lesson teaches. */
const best = (label: string, ...reply: Line[]): LessonOption => ({ label, best: true, reply });
/** Any other answer: the reply kindly shows the right one (or, in a think question, honours it). */
const opt = (label: string, ...reply: Line[]): LessonOption => ({ label, reply });

const ch = (id: string, label: string, then: Line[], set?: Choice['set']): Choice =>
  set ? { id, label, set, then } : { id, label, then };

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

const quest = (
  of: string,
  title: string,
  goals: EduQuest['goals'],
  scenes: EduScene[],
  glossary: GlossaryEntry[],
  notes: string,
): EduQuest => ({
  id: `reader:${of}`,
  of,
  band: 'reader',
  title,
  goals,
  scenes,
  glossary,
  notes,
});

const gloss = (word: string, meaning: string, of: string): GlossaryEntry => ({ word, meaning, scene: `reader:${of}` });

// ---------------------------------------------------------------- speakers

const N = say('narrator');
const Y = say('you');
const BY = say('byte');

const GB = say('gorbold');
const CR = say('mr-crisp');
const FM = say('fenwick');
const ST = say('mr-strutt');
const PO = say('brother-pouffe');
const BO = say('brother-bolster');
const TF = say('sister-tuft');
const DB = say('mr-dibble');
const PI = say('mr-pilchard');
const GR = say('mr-grampus');
const SG = say('sgt-grimble');
const MT = say('mrs-thackery');
const BU = say('bunty');
const PR = say('piers');
const AL = say('algernon');
const AR = say('mr-arbour');

// ================================================================== Q11 Wafer-Thin
const Q11 = quest(
  'q11',
  'The Thinnest Slice',
  {
    'q11-s1': {
      goal: 'Pick fresh mint for Mr Crisp.',
      hint: 'Mint grows in a small patch by the pond. Pick the top leaves, then give them to Mr Crisp.',
    },
    'q11-s2': {
      goal: 'Stay and watch Gorbold with the last thin slice.',
      hint: 'Stay in the bathhouse. If you leave, Gorbold waits politely for you to come back.',
    },
  },
  [
    scene(
      'q11-intro',
      [
        N('At the bathhouse the steam is thick, and the snack table is empty. Very, very empty.'),
        N('In the warm pool floats a Nubbin so round it has stopped swimming. It just bobs.'),
        N('This is Gorbold. Around it float fruit stones, a crust and one sad lettuce leaf.'),
        GB('More.', 'happy'),
        N('A Keeper in a crisp white apron appears at your elbow, holding a silver tray.'),
        CR('Good afternoon. Mr Crisp, in charge of refreshments. Gorbold has eaten the menu.', 'think'),
        CR('Not the food on the menu. The menu itself. Both sides.'),
        CR('Before that, the fruit. Then the fruit bowl. Then the table, and then a fern.'),
        CR('I have one last treat to serve, but I need fresh mint. Could you fetch some?'),
        Y('Is that wise? Gorbold looks very full.'),
        CR('It is a VERY small treat.', 'happy'),
      ],
      [
        ask(
          0,
          m(
            'science',
            'what steam really is: water vapour turning back into tiny drops',
            'Learned that the cloud above warm water is tiny water drops: water evaporates, then condenses in cooler air.',
            '2-PS1-4',
          ),
          [CR('Mind the steam on my tray, please. Do you know what steam actually is?')],
          [
            best(
              'Tiny drops of water floating in the air.',
              CR('Exactly. The warm pool water turns into an invisible gas called water vapour.'),
              CR('When the vapour meets cooler air, it turns back into tiny drops. That cloud is the drops.'),
            ),
            opt(
              'Smoke from a fire.',
              CR('No fire here, thank goodness. Smoke comes from burning. Steam is just water.'),
              CR('Warm water turns into invisible water vapour, which cools into tiny drops. That cloud is the drops.'),
            ),
            opt(
              'A cloud that fell out of the sky.',
              CR('Good thinking: real clouds are made of tiny water drops too! But this one rose up from the pool.'),
              CR('Warm water turns into invisible water vapour, which cools into tiny drops. A little indoor cloud.'),
            ),
          ],
        ),
      ],
      [
        ch('fetch', 'I’ll fetch the mint.', [CR('Splendid. The patch by the pond. Only the top leaves, please. I am very particular.')]),
        ch('ask', 'Ask Gorbold if that’s all right.', [GB('More.', 'happy'), N('That seems to be a yes. Gorbold says yes to most things.')], {
          'q11-asked-gorbold': true,
        }),
      ],
    ),
    scene(
      'q11-mint',
      [
        N('You pinch the top leaves off the mint plants by the pond. Your fingers smell amazing.'),
        CR('Perfect. Top leaves only. You have been listening.', 'happy'),
        CR('Now I shall make one small mint cake, and cut it into eight equal slices.'),
        N('He vanishes into the steam. There is a sound of very fine, very careful slicing.'),
        N('Gorbold bobs a little closer, to listen.'),
        GB('More?', 'happy'),
        N('A voice from the steam says, “Not yet.”'),
      ],
      [
        act(
          0,
          m(
            'science',
            'how pinching the tips makes a plant grow bushier',
            'Picked mint from the tips and learned that this makes the plant send out new side shoots.',
          ),
          'edu:pick:mint:top-leaves',
          [
            CR('Pinch just above a pair of leaves. The plant will grow new side shoots from there.'),
            CR('Pick the tips, and next week the mint is bushier than before. Gardeners call it pinching out.'),
          ],
        ),
        ask(
          3,
          m('maths', 'unit fractions: one slice of eight', 'Named one slice of a cake cut into eight equal slices as one eighth (1/8).', '3.NF.A.1'),
          [N('One cake, cut into 8 equal slices. Gorbold will get one slice.'), N('What fraction of the cake is one slice?')],
          [
            best('One eighth (1/8)', N('Yes. One slice out of eight equal slices is one eighth. A very thin eighth.')),
            opt('One half (1/2)', N('A half is one of 2 equal pieces. This cake has 8 equal pieces, so one slice is one eighth: 1/8.')),
            opt('8', N('8 is how many slices there are altogether. One slice of the 8 is one eighth: 1/8.')),
          ],
        ),
      ],
    ),
    scene(
      'q11-slice',
      [
        N('Mr Crisp returns. On the silver tray lies one slice of mint cake, so thin you could read through it.'),
        CR('For you, Gorbold. One more slice. Just a sliver.', 'soft'),
        GB('Full.', 'sad'),
        CR('It is barely a slice at all. You would hardly notice it.'),
        N('Gorbold looks at the slice. The slice, somehow, looks back at Gorbold.'),
        N('You look at the exits. There are two. Both are a long way off.'),
        N('Mr Crisp holds out the tray. The steam goes very still.'),
      ],
      [
        ask(
          6,
          m('health', 'listening to your body when it says “full”', 'Learned that feeling full is the body’s signal to stop eating, and that eating slowly helps us notice it.'),
          [N('Gorbold said one word: “Full.” That is its tummy talking.'), N('What is the best thing to do when your tummy says “full”?')],
          [
            best(
              'Stop eating, even if the food looks lovely.',
              N('Yes. Your tummy sends a message to your brain when you have had enough.'),
              N('Listening to it keeps you comfortable. The food will still be lovely later.'),
            ),
            opt(
              'Finish it anyway.',
              N('Lots of people are taught to clear their plate! But eating past full can make you feel uncomfortable.'),
              N('It is fine to stop when you are full, and save the rest for later.'),
            ),
            opt(
              'Eat it really fast, before the full feeling arrives.',
              N('Ha! The full feeling does take a little while to arrive. That is why eating slowly helps you notice it.'),
              N('When it arrives, it is fine to stop.'),
            ),
          ],
        ),
      ],
      [
        ch('nudge', 'Go on. It is very thin.', [GB('…Fine.'), N('Gorbold did say “full”, though. You make a note to listen better next time.')], {
          'q11-nudged': true,
        }),
        ch('step-back', 'Take a big step back.', [N('Mr Crisp, without even looking, takes a big step back too. He has done this before.')], {
          'q11-stepped-back': true,
        }),
      ],
    ),
    scene(
      'q11-pop',
      [
        N('Gorbold eats the slice. There is a pause. Then a tiny hiccup.'),
        N('Then a soft POP.'),
        N('Glittering confetti fills the bathhouse and drifts down onto the water like snow.'),
        N('When it clears, Gorbold is bobbing in the pool, normal-sized and blinking.'),
        GB('Light!', 'happy'),
        N('Gorbold does a slow, happy spin. It is the first time in weeks it has been able to turn round.'),
      ],
      [
        ask(
          2,
          m('literacy', 'spotting a simile', 'Learned that a simile compares two things using “like” or “as”, and picked one out.', 'L.4.5'),
          [
            N('The confetti drifts down “like snow”. Comparing two things with “like” or “as” is called a simile.'),
            N('Which of these is a simile?'),
          ],
          [
            best('Gorbold bobs like a cork.', N('Yes. “Like a cork” compares Gorbold to a cork, which bobs on water too.')),
            opt('Gorbold is very round.', N('That describes Gorbold, but it doesn’t compare it to anything. “Bobs like a cork” is a simile.')),
            opt('The confetti is glittery.', N('A good describing word, but no comparison. “Drifts down like snow” is the simile.')),
          ],
        ),
      ],
    ),
    scene(
      'q11-complete',
      [
        CR('Ah. The usual result. Lovely.', 'happy'),
        N('Mr Crisp sweeps the confetti into a perfect pile. Not one speck lands on his apron.'),
        CR('For your trouble. My own recipe.'),
        N('He hands you a paper packet of thin mint slices, and a napkin bib with a tiny mint leaf sewn on.'),
        CR('One slice fills a Nubbin to exactly full. Never over. I have had enough of over for one day.', 'think'),
        GB('More?', 'happy'),
        CR('No.'),
        N('Gorbold bobs over to your Nubbin and nudges a single fruit stone across the water towards it.'),
        GB('Yours.', 'soft'),
        N('Mr Crisp stops sweeping. In eleven years he has never once seen Gorbold give anything away.'),
      ],
      [
        notice(
          7,
          m('science', 'a fruit stone holds a seed', 'Learned that a fruit stone has a seed inside that can grow into a new tree.', '3-LS1-1'),
          [
            CR('A fruit stone is not rubbish, you know. There is a seed inside it.'),
            CR('Plant it and water it, and in time a tree grows. The tree makes fruit with stones. Round and round.'),
          ],
        ),
        think(
          9,
          m(
            'sel',
            'thinking about why someone shares',
            'Thought about why a greedy character might share for the first time; any reasoned answer was welcomed.',
            'CASEL: Social awareness',
          ),
          [N('Gorbold has only ever said “more”. Now it has given something away.'), N('Why do you think Gorbold shared, just this once?')],
          [
            opt(
              'It feels light and happy now, so it wants to share.',
              N('That’s a thoughtful answer. When we feel good, giving often comes more easily. Mr Crisp might agree.'),
            ),
            opt(
              'To say thank you for listening when it said “full”.',
              N('That’s a kind way to see it. Being listened to can make someone want to give something back.'),
            ),
            opt(
              'It just didn’t want the stone.',
              N('That’s fair! It might be true. But of everyone in the bathhouse, Gorbold chose your Nubbin. That seems to mean something.'),
            ),
          ],
        ),
      ],
    ),
  ],
  [
    gloss('refreshments', 'Food and drinks served to people, often at a party or event.', 'q11-intro'),
    gloss('water vapour', 'Water in the form of an invisible gas, floating in the air.', 'q11-intro'),
    gloss('shoot', 'A new stem growing out of a plant.', 'q11-mint'),
    gloss('sliver', 'A very thin, small piece of something.', 'q11-slice'),
    gloss('simile', 'A way of describing something by comparing it to something else, using “like” or “as”.', 'q11-pop'),
  ],
  'Gentle throughout: Gorbold is round and bobbing, never sick, and the pop is soft glitter. The approved quote is replaced ' +
    'by new lines. Reader keeps the “nudge” choice; its then-line names the cost (Gorbold said “full”). Lessons: steam ' +
    '(evaporation and condensation), pinching out mint, 1/8, fullness cues, similes, seeds in fruit stones. Think ' +
    'question: why did Gorbold share?',
);

// ================================================================== Q12 Just Resting
const Q12 = quest(
  'q12',
  'The Very Quiet Nubbin',
  {
    'q12-s1': {
      goal: 'Collect three pieces of evidence that the shop’s Nubbin isn’t real.',
      hint: 'Try feeding it, tickling it, and putting it in the pond. Watch carefully each time.',
    },
    'q12-s2': {
      goal: 'Win the argument with Mr Fenwick Mull.',
      hint: 'Show him all three pieces of evidence at the counter, then stand firm.',
    },
  },
  [
    scene(
      'q12-intro',
      [
        N('A parcel arrives from the shop. Inside, in a nest of wood shavings, lies a Nubbin.'),
        N('The note says: “One Nubbin, quiet breed. Hand-raised. Do not overfeed.” The price tag says 12 Shells.'),
        N('Your Nubbins crowd round and poke it. It does not move. It does not blink.'),
        N('One of its eyes is a button.'),
        N('You take it back to the shop. Mr Fenwick Mull is polishing the counter, which is already very shiny.'),
        Y('This Nubbin you sent me doesn’t move.'),
        FM('Ah, no. That’s quite normal, for that breed.', 'think'),
        FM('It’s having a little lie-down. Very sleepy breed. Famous for it.'),
        Y('It has a seam down its back.'),
        FM('Lovely stitching, isn’t it? Hand-sewn. Very rare.', 'happy'),
      ],
      [
        ask(
          9,
          m(
            'science',
            'the signs that something is alive',
            'Named the signs of life (eating, growing, breathing, reacting) to plan how to test whether something is alive.',
            'K-LS1-1',
          ),
          [N('Is this Nubbin alive? Scientists check for signs of life.'), N('Which of these is a sign that something is alive?')],
          [
            best(
              'It eats, grows, breathes and reacts.',
              N('Yes. Living things need food, they grow, they breathe and they react to the world around them.'),
              N('So let’s test this “Nubbin”.'),
            ),
            opt(
              'It has lovely stitching.',
              N('Stitching shows that someone MADE it! Living things aren’t sewn. They eat, grow, breathe and react.'),
              N('So let’s test this “Nubbin”.'),
            ),
            opt(
              'It lies very still.',
              N('Living things lie still sometimes, like when they sleep. But a sleeping Nubbin still breathes, and wakes if tickled.'),
              N('Signs of life are eating, growing, breathing and reacting. Let’s test it.'),
            ),
          ],
        ),
      ],
      [
        ch('refund', 'I want my Shells back.', [FM('A refund? We don’t do refunds. Never needed to. Nothing has ever gone wrong.', 'shock')]),
        ch('wait', 'Then I’ll wait for it to wake up.', [N('You wait. Mr Fenwick Mull waits. The Nubbin waits harder than either of you.')], {
          'q12-waited': true,
        }),
      ],
    ),
    scene(
      'q12-evidence',
      [
        N('Time for a proper investigation. You test it three ways, and watch carefully each time.'),
        N('Evidence one: you offer it a heart fruit. It does not eat it.'),
        N('No Nubbin has ever turned down a heart fruit. Not one. Not ever.'),
        N('Evidence two: you tickle its feet. Nothing.'),
        N('Your own Nubbin, watching, falls over giggling on its behalf.'),
        N('Evidence three: you set it in the pond. It floats face down, with great calm. Not one bubble.'),
        N('A price tag bobs up beside it.'),
      ],
      [
        act(
          0,
          m(
            'science',
            'running a simple test and recording the results',
            'Tested the toy for three signs of life and recorded each result, the way a scientist collects evidence.',
          ),
          'edu:test:plush:feed-tickle-float',
          [
            N('Test one: does it eat? Test two: does it react? Test three: does it breathe, and blow bubbles?'),
            N('Write down what happens each time. Writing results down is how scientists keep track of evidence.'),
          ],
        ),
      ],
    ),
    scene(
      'q12-argument',
      [
        N('Back at the shop, you lay out the evidence: one uneaten heart fruit, one damp Nubbin, one price tag.'),
        FM('Well. That’s shyness. Shy breed. It didn’t want to eat in front of you.', 'think'),
        Y('It didn’t laugh when I tickled it.'),
        FM('Tired from the journey. Long way from the warehouse. Er. The nest. The wild nest.'),
        Y('It floated face down in the pond.'),
        FM('Loves a swim. Very relaxed swimmer. Floats like a lily.', 'happy'),
        N('He gives it an encouraging pat. It topples slowly sideways off the counter.'),
        FM('Homesick. Misses its nest. They get homesick, this breed. Terribly sensitive.', 'sad'),
        N('You pick up the price tag and hold it in front of his nose.'),
        Y('This Nubbin is, and always has been, a cushion.'),
        FM('That isn’t a cushion.'),
        Y('I know. I got flustered. My point stands.'),
      ],
      [
        ask(
          7,
          m(
            'literacy',
            'telling evidence apart from excuses',
            'Picked the strongest evidence (a written label) over excuses that cannot be checked.',
          ),
          [N('Mr Fenwick Mull has an excuse for every clue. But an excuse is not evidence.'), N('Which of these is the strongest evidence?')],
          [
            best(
              'The price tag: “Plush toy. Stuffed. Not alive.”',
              N('Yes. It is written down, and it answers the question directly. You can check a tag.'),
              N('You can’t check “shy breed”. That’s an excuse.'),
            ),
            opt(
              '“It’s a shy breed.”',
              N('That’s Mr Mull’s excuse, and there’s no way to check it. The price tag is real, written evidence.'),
            ),
            opt(
              '“It floats like a lily.”',
              N('A lovely simile! But it doesn’t prove anything. The price tag, in writing, is the strongest evidence.'),
            ),
          ],
        ),
      ],
      [
        ch('stare', 'Say nothing. Hold the stare.', [N('You hold the stare. He holds it back. Somewhere a clock ticks. He blinks first.')], {
          'q12-stared': true,
        }),
        ch('read-tag', 'Read the price tag aloud.', [Y('“Plush toy. Stuffed. Not alive. Made with love.”'), FM('…Made with love, though.', 'soft')]),
        ch(
          'replace',
          'Then I’ll have a replacement.',
          [
            FM('Out of stock, sadly. But my brother has a shop over the ridge. Lovely man. Nothing like me.', 'happy'),
            N('You walk over the ridge. The shop is identical. Behind the counter, in a false moustache, stands Mr Fenwick Mull.'),
            FM('Fenwick’s brother. Never met him.', 'think'),
            N('The moustache falls off. He puts it back on, slightly higher. You walk back over the ridge together, in silence.'),
          ],
          { 'q12-brother': true },
        ),
      ],
    ),
    scene(
      'q12-crack',
      [
        N('Mr Fenwick Mull looks at the tag. Then at the toy. Then at the ceiling, for help.'),
        FM('All right. ALL RIGHT. It’s a toy. It has always been a toy.', 'sad'),
        FM('A man who sells toys told me it was a Nubbin. I believed him. I wanted to believe him.'),
        FM('I’ll give you your Shells back. I’ll even open a returns counter. The first in the valley.'),
        N('He takes a deep breath. His shoulders drop about an inch.'),
        FM('That’s better, actually. Saying it out loud.', 'soft'),
      ],
      [
        think(
          5,
          m(
            'sel',
            'thinking about honesty: being fooled vs covering up',
            'Weighed whether a character was fooled, dishonest or both, and noticed how owning up made him feel lighter.',
            'CASEL: Responsible decision-making',
          ),
          [N('Mr Mull believed a toy seller. Then he made excuse after excuse.'), N('Was he being dishonest, or was he fooled, or a bit of both?')],
          [
            opt(
              'Fooled at first, but the excuses were dishonest.',
              N('That’s a careful answer. Being tricked isn’t your fault. Covering it up afterwards is a choice.'),
            ),
            opt(
              'He was just fooled.',
              N('That’s a kind way to see it. He did believe it at first. Some might say the excuses went too far.'),
            ),
            opt(
              'Dishonest all along.',
              N('That’s fair: he made up a LOT of excuses. Notice how much better he feels once he tells the truth.'),
            ),
          ],
        ),
      ],
    ),
    scene(
      'q12-complete',
      [
        N('Mr Fenwick Mull counts your Shells back into your hand, in neat piles of four.'),
        N('He looks lighter for it, somehow.'),
        FM('Keep the toy, though. No charge. It’s grown on me. In a way that isn’t growing.', 'soft'),
        N('You carry it home. Your Nubbins take it straight to the nest and pile round it.'),
        N('By evening they are fast asleep, cuddled up to the plush Nubbin.'),
        N('It is, at last, having a genuinely lovely rest.'),
        N('From now on the shop gives refunds, if you can explain what is wrong with the thing you bought.'),
      ],
      [
        act(
          0,
          m('maths', 'counting money in equal groups', 'Counted 12 Shells as three equal groups of four (4, 8, 12).', '3.OA.A.1'),
          'edu:count:shells:12-in-fours',
          [N('Count along with him: four, eight, twelve.'), N('Three piles of four make 12. That’s the 12 Shells on the price tag, all back.')],
        ),
      ],
    ),
  ],
  [
    gloss('breed', 'A particular kind of animal, like a type of dog or sheep.', 'q12-intro'),
    gloss('seam', 'The line where two pieces of cloth are sewn together.', 'q12-intro'),
    gloss('evidence', 'Facts or clues that show whether something is true.', 'q12-evidence'),
    gloss('investigation', 'A careful search for the truth about something.', 'q12-evidence'),
    gloss('excuse', 'A reason someone gives to get out of blame, often not the real one.', 'q12-argument'),
    gloss('flustered', 'Muddled and a bit hot and bothered.', 'q12-argument'),
    gloss('refund', 'Money given back to you when you return something you bought.', 'q12-complete'),
  ],
  'All three approved quotes are replaced with new lines; the “wrong animal” joke becomes “a cushion”. Lessons: signs of ' +
    'life, a simple three-part test, evidence vs excuses, counting 12 in fours. Think question: fooled, dishonest, or both?',
);

// ================================================================== Q13 Ministry of Silly Walks
const Q13 = quest(
  'q13',
  'Grants for Silly Walks',
  {
    'q13-s1': {
      goal: 'Show Mr Strutt a walk of your own.',
      hint: 'Tap a pattern of moves on the pad (up, down, left, right, spin), then press Walk.',
    },
    'q13-s2': {
      goal: 'Show Mr Strutt a properly silly walk.',
      hint: 'Longer patterns score higher. Mix in spins, backward steps and pauses. The same move twice in a row counts less.',
    },
  },
  [
    scene(
      'q13-intro',
      [
        N('A small wooden booth has appeared at the crossroads. The sign reads: GRANTS FOR WALKS (VERY SILLY ONLY).'),
        N('Behind the counter sits a tall Keeper in a bowler hat, stamping forms.'),
        N('He stamps each form twice, for luck. There are seven forms in his pile.'),
        ST('Good morning. Hollis Strutt. I fund silly walks. Research, practice and showing off.', 'think'),
        ST('Most walks in this valley are dreadfully sensible. It keeps me up at night.', 'sad'),
        N('He shows you his own walk to the filing cabinet.'),
        N('It takes four minutes. It involves a sort of kick, a sort of sit, and a sort of question mark.'),
        ST('Now. Show me yours. Use the pad. Make up a pattern. Surprise me.'),
      ],
      [
        ask(
          2,
          m('maths', 'multiplication as equal groups', 'Worked out 7 forms × 2 stamps = 14 by thinking of equal groups.', '3.OA.A.1'),
          [N('Seven forms. Two stamps on each, for luck.'), N('How many stamps is that altogether?')],
          [
            best('14', ST('Fourteen! Seven twos are fourteen. Fourteen helpings of luck.', 'happy')),
            opt('9', N('That’s 7 add 2. But each form gets 2 stamps: seven lots of two. 2, 4, 6, 8, 10, 12, 14.')),
            opt('12', N('So close! Count in twos, one for each form: 2, 4, 6, 8, 10, 12, 14. Seven forms make 14 stamps.')),
          ],
        ),
      ],
      [
        ch('nervous', 'I’m not sure I have one.', [ST('Everyone has one. Most people keep it hidden. Such a waste.', 'sad')]),
        ch('eager', 'I’ve been practising.', [ST('Marvellous. Don’t tell me. Show me.', 'happy')], { 'q13-practised': true }),
      ],
    ),
    scene(
      'q13-first',
      [
        N('You do your walk. It has a hop in it. You are quite proud of the hop.'),
        N('Mr Strutt watches over steepled fingers. He makes a single note. It is a small note.'),
        ST('Hmm. That is a rather ordinary walk, isn’t it?'),
        ST('The hop is fine. The hop is a start. But the rest of you was just walking, with a hop on top.', 'sad'),
        N('Your cheeks go a bit warm. You were proud of that hop.'),
        ST('Don’t look so glum. Every great silly walk began as a sensible one with ideas.', 'soft'),
      ],
      [
        ask(
          4,
          m('sel', 'using feedback to improve', 'Chose to keep what worked and try again after hearing feedback.', 'CASEL: Self-management'),
          [N('Mr Strutt gave you feedback: the hop is good, the rest needs work.'), N('What is the most useful thing to do with feedback like that?')],
          [
            best('Keep the good bit, and try again.', ST('Exactly. Keep the hop. Build round it. That is how all getting-better works.', 'happy')),
            opt(
              'Give up. I’m just not a silly walker.',
              ST('Nonsense. Nobody gets it first time. Feeling a bit stung is normal.', 'soft'),
              ST('Then you keep the hop, and try again.'),
            ),
            opt(
              'Argue that the hop was enough.',
              N('It’s fine to be proud of your hop! But listening to feedback is how you improve. Keep the hop, and try again.'),
            ),
          ],
        ),
      ],
    ),
    scene(
      'q13-notes',
      [
        ST('Let me give you some notes.', 'think'),
        ST('Use more knee. Knees are underused in this valley.'),
        ST('Then do something with your elbows that nobody asked for.'),
        ST('And at least once, go backwards for no reason, and look as if there was a reason.'),
        ST('This year our budget was 2 Shells. The Ministry of Sensible Paths got forty times that. Forty. For gravel.', 'sad'),
        N('Your Nubbin has been watching. It tries the walk itself, falls over, and carries on lying down.'),
        ST('Now THAT is promising. Take notes from your Nubbin.', 'happy'),
        N('He slides a fresh form across the counter. It already has two stamps on it, for luck.'),
      ],
      [
        ask(
          4,
          m('maths', 'multiplying by a tens number', 'Worked out that forty times 2 Shells is 80 Shells.', '3.OA.A.3'),
          [N('Silly Walks got 2 Shells. Sensible Paths got forty times as much.'), N('How many Shells did Sensible Paths get?')],
          [
            best('80', ST('Eighty Shells. For gravel. Forty twos are eighty. I do this sum a lot, usually at night.', 'sad')),
            opt('42', N('That’s 40 add 2. “Forty times” means forty lots of 2: 2 × 40 = 80.')),
            opt('20', N('That would be half of 40. “Forty times” means forty lots of 2, which is 80. Poor Mr Strutt.')),
          ],
        ),
        notice(
          5,
          m('science', 'how we keep our balance', 'Learned that we balance by keeping our weight over our feet, and that arms out wide help.'),
          [
            N('Your Nubbin fell because its weight leaned out past its feet.'),
            N('To balance, keep your weight over your feet. Arms out wide help you stay steady, like a tightrope walker.'),
          ],
        ),
      ],
      [
        ch('copy', 'Copy your Nubbin.', [N('You try walking lying down. It does not work, but it is extremely silly.')], { 'q13-copied-nubbin': true }),
        ch('own', 'Make it your own.', [ST('Bold. Original. I am already reaching for the stamp.')]),
      ],
    ),
    scene(
      'q13-approved',
      [
        N('You walk. Hop, crouch, spin, backwards. Hop, crouch, spin, backwards.'),
        N('You go backwards with total confidence, as if there were an excellent reason.'),
        N('You finish with the elbows. Nobody asked for the elbows. That is the point.'),
        N('Mr Strutt rises slowly to his feet. He removes his bowler hat and presses it to his chest.'),
        ST('That is the silliest thing I have seen since Tuesday.', 'happy'),
        ST('Approved.', 'happy'),
      ],
      [
        ask(
          0,
          m('maths', 'continuing a repeating pattern', 'Found the 9th move in a pattern that repeats every 4 moves.', '4.OA.C.5'),
          [N('Your walk repeats: hop, crouch, spin, backwards, hop, crouch, spin, backwards…'), N('What is the 9th move?')],
          [
            best('Hop', N('Yes! The pattern repeats every 4 moves, so moves 1, 5 and 9 are all hops.')),
            opt('Spin', N('Let’s count: hop 1, crouch 2, spin 3, backwards 4, hop 5, crouch 6, spin 7, backwards 8, hop 9. A hop!')),
            opt('Backwards', N('Backwards is move 4 and move 8. The pattern starts again after that, so move 9 is a hop.')),
          ],
        ),
      ],
    ),
    scene(
      'q13-complete',
      [
        N('He stamps your form twice. Then a third time. He has never stamped a third time before.'),
        ST('Your grant is approved. Use it well. Walk silly, often, and in public.', 'happy'),
        N('He hands you a spare bowler hat from under the counter. It is slightly too big and absolutely perfect.'),
        ST('You may switch the walk on and off as you please. I would leave it on. But then I would.'),
        ST('Between you and me, nobody needs a grant to be silly.', 'soft'),
        ST('But people do seem to like a form that says they may.', 'soft'),
        N('Your Keeper can now walk silly whenever you like. Switch it on in the settings.'),
      ],
      [
        think(
          5,
          m(
            'sel',
            'thinking about courage and feeling free to be yourself',
            'Thought about why people want permission to be silly, and what makes it feel safe to be yourself.',
            'CASEL: Self-awareness',
          ),
          [N('Mr Strutt says nobody needs permission to be silly. But people still like a form that says they may.'), N('Why do you think that is?')],
          [
            opt('They worry about what others will think.', N('That’s a wise answer. Worrying about being laughed at stops lots of people. A form can make it feel safer.')),
            opt('Being silly in public feels brave.', N('Good thinking. It does take courage! A stamp can feel like someone saying, “You’re allowed.”')),
            opt('They don’t need one. Just be silly!', N('Mr Strutt would cheer that answer. Still, lots of people feel shy, and that’s OK too.')),
          ],
        ),
        notice(
          6,
          m('health', 'moving every day', 'Heard that children need about an hour of active movement every day, and silly walking counts.'),
          [
            ST('One more thing. A silly walk is also exercise.', 'think'),
            ST('Children need about an hour of moving about every day. Hopping counts. Elbows count.'),
          ],
        ),
      ],
    ),
  ],
  [
    gloss('grant', 'Money given to someone to help them do something.', 'q13-intro'),
    gloss('feedback', 'Comments that tell you what is working and what could be better.', 'q13-first'),
    gloss('steepled', 'With the fingertips pressed together in a point, like a church steeple.', 'q13-first'),
    gloss('budget', 'The amount of money set aside for something.', 'q13-notes'),
    gloss('confidence', 'Feeling sure of yourself.', 'q13-approved'),
  ],
  'The approved quote is replaced by a new line. Lessons: equal groups (7 × 2), using feedback, 40 × 2, balance, a ' +
    'repeating pattern, an hour of activity a day. Think question: why do people want permission to be silly?',
);

// ================================================================== Q14 The Comfy Chair
const Q14 = quest(
  'q14',
  'The Nap Patrol',
  {
    'q14-s1': {
      goal: 'Carry the comfy chair over from the Workshop.',
      hint: 'It is the big red armchair by the Workshop door. Pick it up and carry it to the nest.',
    },
    'q14-s2': {
      goal: 'Put your most tired Nubbin in the comfy chair.',
      hint: 'Tiredness shows on a Nubbin’s status card. Pick up the sleepiest one and put it on the chair.',
    },
  },
  [
    scene(
      'q14-intro',
      [
        N('You are quietly brushing a Nubbin by the nest when the gate bangs open.'),
        N('Three Keepers in long red robes sweep in. One trips on the step. They sweep in again, more carefully.'),
        PO('Surprise! It is the Nap Patrol!', 'angry'),
        N('There is a long silence. Your Nubbin, halfway through being brushed, stares at them.'),
        Y('We… did not see that coming.'),
        PO('Exactly! We rely on surprise. Surprise, and cushions. Two things: surprise and cush—', 'happy'),
        BO('And blankets.'),
        PO('Three things! Hang on. Everybody out. We shall do the door again.', 'think'),
        N('They go out. The gate bangs. They sweep in, nobody trips, and Brother Bolster raises two plump cushions, menacingly.'),
        N('Sister Tuft holds up three folded blankets, just as menacingly.'),
        BO('Soft. Very soft. You have been warned.', 'think'),
        PO('Your Nubbins look tired. Overworked. Under-napped. We shall see to that. Sister Tuft!'),
        PO('Bring forth… the big red chair!', 'angry'),
        TF('We left it at your Workshop. You said you’d carry it.', 'sad'),
        PO('…Keeper. Would you be so good as to carry it over for us?', 'sad'),
      ],
      [
        ask(
          8,
          m('literacy', 'working out a word from context', 'Used clues in the scene to work out that “menacingly” means in a threatening way.', 'L.2.4'),
          [N('Brother Bolster raises the cushions “menacingly”.'), N('What do you think “menacingly” means?')],
          [
            best(
              'In a threatening, scary way.',
              N('Yes: as if he’s about to do something terrible. With a cushion. That’s the joke: cushions are not scary.'),
            ),
            opt('Very gently.', N('Good guess, cushions ARE gentle! But “menacingly” means in a threatening way. A threatening cushion is very silly.')),
            opt('Very slowly.', N('He might be slow too! But “menacingly” means in a threatening way. That’s what makes it funny.')),
          ],
        ),
        ask(
          10,
          m('maths', 'adding three numbers', 'Added 2 cushions, 3 blankets and 1 chair to make 6 soft things.', '1.OA.A.1'),
          [N('Bolster has 2 cushions. Tuft has 3 blankets. Soon there will be 1 big chair too.'), N('How many soft things will the Nap Patrol have?')],
          [
            best('6', N('Yes: 2 + 3 = 5, and 1 more chair makes 6. Six soft things. Very well armed.')),
            opt('5', N('That’s the cushions and blankets: 2 + 3 = 5. Don’t forget the chair! 5 + 1 = 6.')),
            opt('3', N('Three is how many robed Keepers there are! Soft things: 2 cushions + 3 blankets + 1 chair = 6.')),
          ],
        ),
      ],
      [
        ch('fetch', 'Fine. I’ll fetch it.', [PO('Splendid. We shall wait here, being terrifying.', 'happy')]),
        ch('cushion', 'Can I hold a cushion?', [BO('…Just for a minute.', 'soft'), N('It is extremely soft. You can see why he is so proud of it.')], {
          'q14-held-cushion': true,
        }),
      ],
    ),
    scene(
      'q14-chair',
      [
        N('You carry the chair back to the nest. It is deep, red and squashy, with a fringe round the bottom.'),
        N('It is heavier than it looks. Most comfortable things are.'),
        TF('Behold. The comfy chair.', 'happy'),
        N('Brother Pouffe cracks his knuckles. Brother Bolster raises the cushions.'),
        N('Sister Tuft fluffs the chair twice, then a third time, to be safe.'),
        BO('Feel that cushion. Go on. Feathers inside. Full of air.', 'soft'),
      ],
      [
        act(
          5,
          m('science', 'sorting materials by how they feel', 'Sorted things into soft and hard and learned that soft things trap air.', '2-PS1-1'),
          'edu:sort:materials:soft-hard',
          [
            N('Sort what’s in the nest into soft and hard: cushion, blanket, gate post, pebble, feather, flowerpot.'),
            BO('Feathers and wool trap lots of tiny pockets of air. That’s why they squash. Wood and stone keep their shape.'),
          ],
        ),
      ],
    ),
    scene(
      'q14-sentence',
      [
        PO('Now. Bring us your most tired Nubbin.', 'angry'),
        PO('It shall sit in the comfy chair until lunchtime. With a cushion behind it. And another cushion. Beside.'),
        BO('And a blanket over its knees. A woolly one.', 'think'),
        TF('And no getting up. Not even for a snack.'),
        PO('Unless it is a very small snack.'),
        N('The Workshop clock says half past ten. Lunch in the Grove is at half past twelve.'),
        N('They exchange grim nods. They have done this many times, and it always goes exactly to plan.'),
      ],
      [
        ask(
          6,
          m('maths', 'time intervals', 'Worked out that half past ten to half past twelve is 2 hours.', '3.MD.A.1'),
          [N('It is half past ten. The nap lasts until lunch at half past twelve.'), N('How long will the nap be?')],
          [
            best('2 hours', N('Yes. Half past ten to half past eleven is 1 hour. To half past twelve is 2 hours.')),
            opt('30 minutes', N('Half an hour is a short nap! Count the hours: 10:30 to 11:30, then to 12:30. That’s 2 hours.')),
            opt('12 hours', N('That’s a whole night’s sleep! From 10:30 to 12:30 is just 2 hours.')),
          ],
        ),
      ],
      [
        ch('sleepiest', 'Bring the sleepiest Nubbin.', [N('Your sleepiest Nubbin yawns so wide it nearly falls into itself.')]),
        ch('volunteer', 'Offer to sit in the chair yourself.', [PO('Ha! Keepers are safe from cushions today. Bring us a Nubbin.', 'happy')], {
          'q14-volunteered': true,
        }),
      ],
    ),
    scene(
      'q14-asleep',
      [
        N('The Nubbin sinks into the chair. Brother Bolster tucks in a cushion.'),
        N('Sister Tuft lays a woolly blanket over its knees.'),
        N('It is asleep before the blanket lands.'),
        N('It snores very softly, like a kettle thinking about boiling.'),
        PO('Shh. The Patrol is working.', 'soft'),
        N('All three tiptoe to the edge of the nest and stand guard. Nobody has ever guarded a nap so fiercely.'),
      ],
      [
        notice(
          2,
          m('health', 'why sleep matters', 'Learned that sleep helps the body grow and repair, and that children need about 9 to 12 hours a night.'),
          [
            TF('Sleep is not doing nothing. While you sleep, your body grows and mends itself.'),
            TF('Your brain tidies up the day, too. Children your age need about 9 to 12 hours of sleep a night.'),
          ],
        ),
        ask(
          3,
          m('literacy', 'what a simile tells us', 'Worked out what a simile (“like a kettle thinking about boiling”) tells the reader about a sound.', 'L.4.5'),
          [N('The Nubbin snores “like a kettle thinking about boiling”.'), N('What does that tell you about the snore?')],
          [
            best(
              'It’s a soft, quiet, rising sort of sound.',
              N('Yes. A kettle about to boil makes a gentle, growing hum. The simile lets you hear the snore in your head.'),
            ),
            opt('It’s very loud and whistly.', N('A boiling kettle whistles! But this one is only THINKING about boiling, so it’s soft and quiet.')),
            opt('It’s hot.', N('Kettles are hot, but the simile is about the sound: soft and quietly rising, like a kettle not quite boiling.')),
          ],
        ),
      ],
    ),
    scene(
      'q14-complete',
      [
        N('Two hours later, at half past twelve, the Nubbin wakes. It stretches. It glows.'),
        N('It looks as if it has slept for a week.'),
        PO('Ha! Look at it. Utterly refreshed. Our work here is done.', 'happy'),
        BO('Best nap we have ever given. Possibly the best nap anyone has ever had.', 'soft'),
        TF('We should go. We have three more Groves to burst into before tea.'),
        N('They sweep out. One trips on the step. Then they sweep back in, because they forgot the chair.'),
        PO('Keep it. We have another. We have a whole room of them.', 'think'),
        PO('One last question, Keeper. When did YOU last sit down?', 'think'),
        N('From now on, a tired Nubbin on the comfy chair naps back to full twice as fast.'),
      ],
      [
        think(
          7,
          m(
            'sel',
            'thinking about rest and looking after yourself',
            'Thought about whether resting is a waste of time or part of looking after others; any reasoned answer was welcomed.',
            'CASEL: Self-management',
          ),
          [N('Brother Pouffe has a point. Keepers look after everyone else. Who looks after the Keeper?'), N('Is resting a waste of time, or part of the job?')],
          [
            opt('Part of the job. You can’t help others if you’re worn out.', N('That’s a wise answer. The Nap Patrol would give you a cushion for it.')),
            opt('A waste of time. There’s too much to do!', N('That’s honest, and lots of grown-ups feel the same! The Patrol would say a rested Keeper gets more done, not less.')),
            opt('It depends how tired you are.', N('Thoughtful. Noticing how tired you feel is the first step. Then you can choose.')),
          ],
        ),
      ],
      [
        ch(
          'sit',
          'Sit in the chair, just for a minute.',
          [
            N('You sit. Sister Tuft tucks a blanket over your knees.'),
            N('You wake an hour later with a cushion on your face and no idea what day it is.'),
            PO('Ha! Another one rested. Our work is never done.', 'happy'),
          ],
          { 'q14-keeper-napped': true },
        ),
        ch('busy', 'No time. There’s too much to do.', [
          TF('That is what they all say.', 'sad'),
          PO('Keep the chair, then. It will wait for you. Chairs are excellent at waiting.', 'think'),
        ]),
      ],
    ),
  ],
  [
    gloss('menacingly', 'In a threatening way, as if about to do something nasty.', 'q14-intro'),
    gloss('fringe', 'A border of hanging threads along the edge of something.', 'q14-chair'),
    gloss('grim', 'Very serious and stern.', 'q14-sentence'),
    gloss('fiercely', 'In a strong, determined way.', 'q14-asleep'),
    gloss('refreshed', 'Full of energy again after a rest.', 'q14-complete'),
  ],
  'Both approved quotes are replaced: the entrance is “Surprise! It is the Nap Patrol!” and the order is “Bring forth… the ' +
    'big red chair!”. The robes stay plain and cosy. Lessons: “menacingly” from context, 2 + 3 + 1, soft vs hard materials, ' +
    '10:30 to 12:30, why sleep matters (9–12 hours for this age), reading a simile. Think question: is rest part of the job?',
);

// ================================================================== Q15 The Fruitless Fruit Stall
const Q15 = quest(
  'q15',
  'The Fruitless Fruit Stall',
  {
    'q15-s1': {
      goal: 'Ask Mr Dibble for six different fruits.',
      hint: 'Pick a fruit from the order list at the stall. Each fruit counts once.',
    },
    'q15-s2': {
      goal: 'Keep asking until you have tried all twelve fruits.',
      hint: 'Keep choosing from the order list, and keep a tally. Something changes at twelve.',
    },
  },
  [
    scene(
      'q15-intro',
      [
        N('A smart green stall has opened by the bridge. The sign says: DIBBLE’S. EVERY FRUIT IN THE VALLEY, AND THEN SOME.'),
        N('Behind it stands Mr Pomeroy Dibble, in a striped apron and a straw boater, beaming.'),
        DB('Good morning! Whatever fruit you fancy, we have it. Every fruit in the valley. Possibly more.', 'happy'),
        N('Behind him are twelve crates, each under a cloth. Neat, clean, suspiciously flat cloths.'),
        Y('A run fruit, please.'),
        DB('Ah. Run fruit. Just out, I’m afraid. There was a rush on them. They ran.', 'sad'),
        Y('A swim fruit, then.'),
        DB('Swim fruit! Normally, yes. Today the delivery Nubbin went for a swim, and so did the fruit.'),
      ],
      [
        ask(
          3,
          m('literacy', 'making an inference from a clue', 'Used a clue word (“suspiciously flat”) to guess that the crates might be empty.'),
          [N('Look closely at those cloths: “suspiciously flat”.'), N('What might the flat cloths be telling you?')],
          [
            best(
              'There might be nothing under them.',
              N('Good detective work. A cloth over fruit would be lumpy. Writers leave clues like this on purpose.'),
            ),
            opt('The fruit is very small.', N('Possible! But even small fruit makes bumps. Flat cloths are a clue the crates might be empty.')),
            opt('The cloths are brand new.', N('They might be! But “suspiciously” is the clue word. The writer wants you to wonder what’s under them. Maybe nothing.')),
          ],
        ),
      ],
      [
        ch('polite', 'Keep asking politely.', [DB('Please do! Asking is half the fun. For me.', 'happy')]),
        ch('peek', 'Lift a cloth.', [N('You lift a corner. Mr Dibble lowers it again, gently, with one finger.'), DB('Let’s not spoil the surprise.')], {
          'q15-peeked': true,
        }),
      ],
    ),
    scene(
      'q15-six',
      [
        Y('Fly fruit?'),
        DB('Flew.'),
        Y('Power fruit?'),
        DB('Lifted. By a very strong Nubbin. Carried off over its head.'),
        Y('Stamina fruit?'),
        DB('Eaten by a tired one. Fair enough, really.'),
        Y('Sun fruit?'),
        DB('Set. They do that, in the evening.', 'sad'),
      ],
      [
        ask(
          7,
          m('literacy', 'words with more than one meaning', 'Explained the joke in “the sun fruit set”: “set” can mean the sun going down.', 'L.3.4'),
          [N('Mr Dibble’s excuses are word jokes. “The sun fruit set.”'), N('What does “set” mean when we talk about the sun?')],
          [
            best('It goes down in the evening.', N('Yes. The sun sets in the evening. So the sun fruit “set” too, and vanished. Very convenient.')),
            opt('A group of things, like a set of pens.', N('That IS a meaning of “set”! Words can have several. For the sun, “set” means going down in the evening.')),
            opt('Ready to go, like “ready, steady, set”.', N('Another real meaning! But with the sun, “set” means going down below the hills in the evening.')),
          ],
        ),
        ask(
          7,
          m('maths', 'subtraction within 20', 'Worked out 12 − 6 = 6 fruits left to ask about.', '2.OA.A.1'),
          [N('The order list has twelve fruits. You have asked for six. Every one was “just out”.'), N('How many fruits are left to ask about?')],
          [
            best('6', N('Yes: 12 − 6 = 6. Halfway. Mr Dibble needs six more excuses.')),
            opt('18', N('That’s 12 add 6. You’ve used some up, so take them away: 12 − 6 = 6.')),
            opt('0', N('Not yet! You’ve asked for 6 of the 12. 12 − 6 = 6 still to go.')),
          ],
        ),
      ],
    ),
    scene(
      'q15-twelve',
      [
        N('You keep going. Mr Dibble keeps smiling. It is a smile that has had a great deal of practice.'),
        N('Somewhere behind the stall, a Nubbin is plucking a tiny mandolin. Slowly. The same three notes.'),
        Y('Moon fruit?'),
        DB('Only at night. And at night I’m closed.'),
        Y('Heart fruit?'),
        DB('A Nubbin looked at it with such love that I hadn’t the heart to sell it. I gave it away.', 'soft'),
        Y('A coconut. Just one coconut.'),
        DB('There is one palm in the whole valley, and frankly it has had a difficult week.', 'think'),
        Y('Could the music stop?'),
        DB('Stop? It’s the atmosphere.', 'shock'),
        N('The Nubbin plays the three notes again, more slowly, out of spite.'),
      ],
      [
        ask(
          10,
          m('music', 'tempo: how fast or slow music goes', 'Learned that tempo means the speed of music, and told it apart from volume and pitch.'),
          [N('The Nubbin played the same three notes, but slower. The speed of music is called its tempo.'), N('What happened to the tempo?')],
          [
            best('It got slower.', N('Yes. Same notes, slower tempo. Slow music can feel sleepy or sad. Or, in this case, very annoying.')),
            opt('It got louder.', N('Louder is about volume, not tempo. Tempo is speed, and the Nubbin played slower.')),
            opt('It got higher.', N('Higher or lower is about pitch. Tempo is speed. The notes stayed the same; they just got slower.')),
          ],
        ),
      ],
    ),
    scene(
      'q15-confess',
      [
        N('By the twelfth fruit, Mr Dibble has stopped smiling. He takes off his boater and holds it in both hands.'),
        DB('I have a confession. There has never been any fruit. Not a single pip.', 'sad'),
        DB('I just liked the stall.'),
        Y('So the stall that sells every fruit sells… no fruit.'),
        DB('When you put it like that, it sounds bad.'),
        Y('How would you put it?'),
        DB('…Exactly like that, really.', 'sad'),
        N('Mr Dibble looks at his twelve empty crates as if seeing them for the first time.'),
      ],
      [
        act(
          2,
          m('maths', 'keeping a tally', 'Kept a tally of 12 fruits asked for (two bundles of five and two more) against 0 sold.'),
          'edu:tally:fruits-asked:12',
          [
            N('Make a tally of the fruits you asked for: one mark each, and every fifth mark crosses the other four.'),
            N('Twelve fruits: two bundles of five, and two more. Fruits sold: zero marks at all.'),
          ],
        ),
        think(
          7,
          m(
            'sel',
            'thinking about honest signs and fairness to customers',
            'Thought about whether a sign that promises something untrue is fair, even when it is friendly.',
            'CASEL: Responsible decision-making',
          ),
          [N('Mr Dibble’s sign promised EVERY FRUIT. He had none.'), N('Is it fair for a sign to promise something that isn’t true, even if the stall is friendly?')],
          [
            opt('No. People trust signs.', N('That’s a fair answer. A sign is a kind of promise. Breaking it, even kindly, wastes people’s time.')),
            opt('It’s fine. It’s only a joke.', N('Some people would agree, and it IS funny! But someone who really needed fruit might not laugh.')),
            opt('It depends who it affects.', N('Thoughtful. Asking “who does this affect?” is a great way to judge whether something is fair.')),
          ],
        ),
      ],
      [
        ch(
          'stock',
          'Let’s stock it. With real fruit.',
          [
            DB('Real fruit? But then people would buy it. And then it would be gone.', 'shock'),
            DB('…I’ll put out one run fruit. On a cushion. Facing the wall, so it doesn’t get ideas.', 'soft'),
          ],
          { 'q15-stocked': true },
        ),
        ch(
          'leave-it',
          'Don’t change a thing.',
          [
            DB('Really? You don’t mind?', 'soft'),
            Y('It’s the friendliest stall in the valley. It just isn’t a shop.'),
            DB('That is the nicest thing anyone has ever said to me over an empty crate.', 'happy'),
          ],
          { 'q15-stocked': false },
        ),
      ],
    ),
    scene(
      'q15-complete',
      [
        DB('You’re right. Quite right. But I’ll tell you what I do have. Knowledge.', 'think'),
        N('From under the counter he brings out a thick, beautifully drawn page: every fruit in the valley, with notes on each.'),
        DB('Where it grows. What it does. Which Nubbins like it best.'),
        DB('I know everything about fruit except where to get any.'),
        N('He slips it into your Collection book. It fits perfectly, as if there was always a gap for it.'),
        DB('And the boater. Take it. It belongs on someone with fruit.', 'soft'),
        N('As you leave, you hear him greet the next customer with great cheer: “Just out, I’m afraid!”'),
      ],
      [
        act(
          5,
          m('maths', 'writing an inventory with subtraction', 'Wrote a shop inventory and used subtraction (1 − 1 = 0) to update it.'),
          'edu:list:inventory:dibble-stall',
          [
            N('A shop keeps an inventory: a list of everything it has. Help Mr Dibble write his.'),
            N('Crates: 12. Cloths: 12. Mandolins: 1. Boaters: 1, take away the one he gave you, makes 0. Fruit: still 0.'),
          ],
        ),
        ask(
          6,
          m('social-studies', 'scarcity means choosing', 'Learned that when there is not enough of something, people must choose; this is called scarcity.', 'D2.Eco.1.K-2'),
          [DB('Suppose I DID put out one run fruit, and two customers both wanted it. What then?', 'think')],
          [
            best(
              'Only one could have it, so they’d have to choose, or share it.',
              DB('Exactly. When there isn’t enough of something to go round, people have to make choices.'),
              DB('That’s called scarcity. It’s why I never stock anything. Far less worrying.', 'happy'),
            ),
            opt(
              'They could both have it.',
              DB('Both? It’s one fruit! Unless they cut it in half and share it. When there isn’t enough to go round, that’s scarcity.'),
            ),
            opt(
              'Just make more fruit appear.',
              DB('If only. Fruit takes time to grow. When there isn’t enough to go round, people must choose. That’s scarcity.'),
            ),
          ],
        ),
      ],
    ),
  ],
  [
    gloss('suspiciously', 'In a way that makes you think something is not quite right.', 'q15-intro'),
    gloss('stamina', 'The energy to keep going for a long time.', 'q15-six'),
    gloss('tempo', 'The speed of a piece of music.', 'q15-twelve'),
    gloss('mandolin', 'A small stringed instrument with a rounded back, a bit like a little guitar.', 'q15-twelve'),
    gloss('confession', 'Telling someone the truth about something you have done.', 'q15-confess'),
    gloss('tally', 'A way of counting with marks, where every fifth mark crosses the four before it.', 'q15-confess'),
    gloss('inventory', 'A list of everything a shop or person has.', 'q15-complete'),
    gloss('scarcity', 'When there is not enough of something for everyone who wants it.', 'q15-complete'),
  ],
  'The approved quote and the two lines after it are replaced by a new exchange (“So the stall that sells every fruit ' +
    'sells… no fruit.”). Lessons: inference from “suspiciously flat”, “set” as a multiple-meaning word, 12 − 6, tempo, ' +
    'a tally of 12, an inventory with 1 − 1 = 0, scarcity. Think question: is a friendly but untrue sign fair?',
);

// ================================================================== Q16 The Argument Booth
const Q16 = quest(
  'q16',
  'The Argument Booth',
  {
    'q16-s1': {
      goal: 'Pay Byte 5 Shells for an argument.',
      hint: 'Tap Byte’s booth and choose Pay. You need 5 Shells.',
    },
    'q16-s2': {
      goal: 'Win the argument before the sand runs out.',
      hint: 'Saying the opposite back only feeds him. Point out that he isn’t giving any reasons.',
    },
  },
  [
    scene(
      'q16-intro',
      [
        N('Byte has set up a booth outside the Workshop. The sign says: ARGUMENTS. 5 SHELLS. ONE MINUTE EXACTLY.'),
        N('There is a sand timer on the counter. Byte is looking at it the way other people look at cake.'),
        N('Next to it stands a smaller booth marked COMPLAINTS: 2 SHELLS. It is also Byte, in a different hat.'),
        BY('Good afternoon. Would you like an argument?', 'think'),
        Y('What sort of argument?'),
        BY('The best sort. You give reasons. I give reasons. The sand keeps it fair.'),
        BY('It is five Shells. Please pay first. I find arguments about payment unpleasant.'),
      ],
      [
        ask(
          2,
          m('maths', 'adding prices', 'Added two prices (5 + 2 = 7 Shells) for an argument and a complaint.', '1.OA.A.1'),
          [N('An argument costs 5 Shells. A complaint costs 2 Shells.'), N('How much for one of each?')],
          [
            best('7 Shells', N('Yes: 5 + 2 = 7. Byte has priced this very carefully.')),
            opt('3 Shells', N('That’s the difference between them: 5 − 2 = 3. For one of each, add them: 5 + 2 = 7.')),
            opt('10 Shells', N('That would be two arguments! One argument and one complaint is 5 + 2 = 7.')),
          ],
        ),
        ask(
          6,
          m('sel', 'negotiating calmly with a reason', 'Learned that a calm offer with a good reason is the best way to negotiate, and that the other side may still say no.', 'CASEL: Relationship skills'),
          [N('You could try to haggle: offer a lower price.'), N('Which way of asking is most likely to work?')],
          [
            best(
              'Offer four Shells, calmly, and give a good reason.',
              N('Yes. In a negotiation, a reason helps the other person see what’s in it for them.'),
              N('Even then, they might still say no. That’s fair too.'),
            ),
            opt('Just say “four Shells” and stare.', N('Sometimes that works at a market! But with no reason, Byte has no reason to agree. Give one.')),
            opt('Shout “Five is too much!”', N('Shouting makes people dig their heels in. A calm offer with a good reason works much better.')),
          ],
        ),
      ],
      [
        ch('pay', 'Pay the five Shells.', [BY('Thank you. Your minute begins when you sit down.', 'happy')]),
        ch('four', 'Four Shells?', [BY('No. And you gave no reason. That one was free. Please do not do it again.', 'think')], { 'q16-haggled': true }),
      ],
    ),
    scene(
      'q16-flip',
      [
        N('You sit down on the stool. Your Nubbin climbs onto the stool beside you.'),
        N('Byte turns the sand timer over with great ceremony.'),
        N('The sand begins to trickle through the narrow middle, in a thin, steady stream.'),
        BY('Your minute has begun. Sixty seconds. Please begin.'),
        BY('I will not count them aloud. I will count them inside, very loudly.', 'think'),
        N('Your Nubbin stares at the falling sand as if it might do a trick.'),
      ],
      [
        notice(
          2,
          m('science', 'how a sand timer uses gravity', 'Learned that gravity pulls the sand down, and a narrow neck makes it fall slowly enough to measure time.'),
          [
            BY('Gravity pulls the sand down. The middle is narrow, so only a little gets through at a time.'),
            BY('Make the neck the right size, and all the sand takes exactly one minute. That is how sand tells time.'),
          ],
        ),
        ask(
          3,
          m('maths', 'seconds in a minute', 'Used 1 minute = 60 seconds to work out that half a minute is 30 seconds.', '3.MD.A.1'),
          [N('One minute is 60 seconds.'), N('When half the sand has fallen, how many seconds will be left?')],
          [
            best('30 seconds', N('Yes. Half of 60 is 30. Watch for the halfway point.')),
            opt('50 seconds', N('Half of 60 is 30, not 50. When half the sand is gone, 30 seconds are left.')),
            opt('6 seconds', N('That would be a very quick argument! Half of 60 seconds is 30 seconds.')),
          ],
        ),
      ],
    ),
    scene(
      'q16-minute',
      [
        Y('Your booth is very nice.'),
        BY('Disagree.'),
        Y('It’s a lovely day for it.'),
        BY('False. It is a medium day.'),
        Y('It’s sunny AND drizzling. There’s a rainbow.'),
        BY('That is a smudge.', 'think'),
        N('Your Nubbin, on the stool beside you, looks from Byte to the window, then back to Byte.'),
        Y('You’re just contradicting everything I say.'),
        BY('Incorrect.'),
        N('The sand is half gone. Thirty seconds left.'),
      ],
      [
        ask(
          5,
          m('science', 'what makes a rainbow', 'Learned that a rainbow needs sunshine and raindrops at the same time, and named its colours in order.'),
          [N('Rainbow or smudge? Think about what makes a rainbow.'), N('What do you need to see a rainbow?')],
          [
            best(
              'Sunshine and raindrops at the same time.',
              N('Yes. Sunlight shines into raindrops and splits into colours: red, orange, yellow, green, blue, indigo, violet.'),
              N('Sunny and drizzling is perfect rainbow weather. It’s a rainbow.'),
            ),
            opt('Just rain.', N('Rain is half of it. You need sunshine too. Sun plus raindrops makes a rainbow, and today has both.')),
            opt('A smudge on the window.', N('Ha! That’s Byte’s answer, and he gave no reason. You need sun and raindrops, and today has both.')),
          ],
        ),
      ],
      [
        ch(
          'agree',
          'Agree with Byte, to see what happens.',
          [Y('You’re right. It’s a smudge.'), BY('It is clearly a rainbow.', 'angry'), N('Byte hears himself. He frowns. That was not supposed to happen.')],
          { 'q16-agreed': true },
        ),
        ch('breathe', 'Take a breath.', [N('You take a breath. Byte takes one too, in case that was a point.')]),
      ],
    ),
    scene(
      'q16-win',
      [
        Y('Hold on. You’re not giving me any reasons.'),
        BY('I am.'),
        Y('Saying “no” every time isn’t a reason. It’s just the opposite of what I said.'),
        Y('A real argument goes: I think this, because of that.'),
        N('Byte opens his mouth to disagree. Then he stops, and looks at the sand timer for help.'),
        N('The sand timer, being sand, offers none.'),
        BY('…That is a fair point.', 'shock'),
      ],
      [
        ask(
          3,
          m('literacy', 'a good argument: a claim plus a reason', 'Told a real argument (a claim with a reason) apart from simple contradiction and name-calling.'),
          [N('A good argument has a claim (what you think) and a reason (why you think it).'), N('Which of these is a real argument?')],
          [
            best(
              '“It’s a rainbow, because it’s sunny and raining and the colours are in order.”',
              N('Yes. Claim: it’s a rainbow. Reason: sun, rain, colours in order. That beats “smudge” every time.'),
            ),
            opt(
              '“Is.” “Isn’t.” “Is.” “Isn’t.”',
              N('That’s just saying the opposite, back and forth. Nobody learns anything. Add a reason: “because it’s sunny and raining”.'),
            ),
            opt(
              '“It’s a rainbow, and you’re silly.”',
              N('Calling someone silly isn’t a reason, and it makes them less likely to listen. Give a reason instead.'),
            ),
          ],
        ),
      ],
      [
        ch(
          'complain',
          'Take it up with Complaints.',
          [
            N('You step next door. Byte swaps hats and steps next door too.'),
            BY('Complaints. Go on.', 'think'),
            Y('The argument man just said the opposite of everything.'),
            BY('Did he. I shall have a word with him.', 'angry'),
            N('He swaps hats, turns to face the empty stool, and has a long, stern word with himself.'),
          ],
          { 'q16-complained': true },
        ),
        ch('shake', 'Shake hands. Good game.', [BY('It was not a game. It was a— yes. Fine. Good game.', 'soft')]),
      ],
    ),
    scene(
      'q16-complete',
      [
        N('The last grain of sand drops. Byte stares at it for a long moment.'),
        BY('Nobody has ever won before. Most people just get cross until the sand runs out.', 'think'),
        BY('Disagreeing is easy. I have been doing it for years and calling it thinking.', 'soft'),
        BY('You may keep the timer. I will make another. I have a great deal of sand.'),
        BY('And I am putting you on the board. Debate Club. Founding member. There are no other members.', 'happy'),
        Y('Is there a club?'),
        BY('There is now. Do not argue.'),
      ],
      [
        think(
          2,
          m(
            'sel',
            'disagreeing vs thinking',
            'Thought about the difference between disagreeing and really thinking, such as having reasons and being open to changing your mind.',
            'CASEL: Responsible decision-making',
          ),
          [N('Byte says he has been disagreeing for years and calling it thinking.'), N('What’s the difference between disagreeing and really thinking?')],
          [
            opt('Thinking means you might change your mind.', N('That’s a deep answer. Real thinkers listen, and sometimes the other person is right. Byte just found that out.')),
            opt('Thinking means having reasons.', N('A strong answer. Disagreeing with no reasons is just noise. With reasons, it’s thinking.')),
            opt('There isn’t one. Disagreeing is fine!', N('Fair: disagreeing is fine, and often useful. Byte might say the trouble starts when you disagree with everything.')),
          ],
        ),
      ],
    ),
  ],
  [
    gloss('haggle', 'To argue politely about a price, to try to make it lower.', 'q16-intro'),
    gloss('negotiation', 'Talking together to reach an agreement both sides can accept.', 'q16-intro'),
    gloss('ceremony', 'A special, serious way of doing something.', 'q16-flip'),
    gloss('gravity', 'The force that pulls things down towards the ground.', 'q16-flip'),
    gloss('drizzling', 'Raining lightly, in tiny drops.', 'q16-minute'),
    gloss('contradict', 'To say the opposite of what someone else has said.', 'q16-minute'),
    gloss('claim', 'Something you say is true.', 'q16-win'),
    gloss('debate', 'A discussion where people give reasons for different sides.', 'q16-complete'),
  ],
  'Both approved quotes are replaced with new lines (“You’re not giving me any reasons”; “I think this, because of that”). ' +
    'Byte’s COMPLAINTS booth gains a 2-Shell price for the money sum. The “Four Shells?” choice becomes a haggling and ' +
    'negotiation lesson. Lessons: 5 + 2, negotiating with a reason, gravity in a sand timer, 60 seconds, rainbows, claim ' +
    'plus reason. Think question: disagreeing vs thinking.',
);

// ================================================================== Q17 The Fish-Slapping Dance
const Q17 = quest(
  'q17',
  'The Dock Dance',
  {
    'q17-s1': {
      goal: 'Learn the steps of the dock dance.',
      hint: 'Open Karate on the dock. Tap in time with the beat markers: step, bow, tap.',
    },
    'q17-s2': {
      goal: 'Dance the full performance on the dock.',
      hint: 'It is a timing bout on the karate screen. Hit every beat. The last beat is not yours to win.',
    },
  },
  [
    scene(
      'q17-intro',
      [
        N('On the end of the dock, two Keepers in crisp white shirts and sun hats stand very straight.'),
        N('Each holds a small, shiny rubber fish. They hold them the way other people hold violins.'),
        PI('Good morning. Pilchard. This is Grampus. We are a dance society.', 'think'),
        GR('Of two.'),
        PI('We perform the old dance of the dock. It is very formal. We have an opening for a third.'),
        GR('The last third went in.', 'think'),
        N('Mr Pilchard shows you: a small step, a bow, and a gentle tap on Mr Grampus’s cheek with the fish. Squeak.'),
        N('Mr Grampus does it back. They both bow. Neither smiles. It is beautiful, in a confusing way.'),
        GR('Will you dance?'),
      ],
      [
        ask(
          1,
          m('science', 'how fish breathe, and being fair to animals', 'Learned that real fish breathe through gills and need water, which is why the dancers use rubber fish.', '4-LS1-1'),
          [N('Why do you think the dancers use rubber fish, not real ones?')],
          [
            best(
              'Real fish need to stay in water to breathe.',
              GR('Quite right. Real fish breathe through gills, which take oxygen out of water.', 'soft'),
              GR('Out of the water, they can’t breathe. We would never.'),
            ),
            opt(
              'Rubber fish are shinier.',
              PI('They are rather shiny. But real fish breathe through gills, in water. We would never take one out.'),
            ),
            opt(
              'Real fish are too heavy.',
              PI('Some are! But the real reason is that real fish need water to breathe, through their gills. Rubber ones don’t mind.'),
            ),
          ],
        ),
      ],
      [
        ch('honoured', 'I’d be honoured.', [PI('Splendid. You will need a fish.', 'happy')]),
        ch(
          'fish-mind',
          'Do the fish mind?',
          [GR('These ones are rubber. The real fish stay in the pond, where they are happy.', 'soft'), PI('The rubber ones were consulted. They squeaked yes.')],
          { 'q17-asked-fish': true },
        ),
      ],
    ),
    scene(
      'q17-learned',
      [
        N('Step, bow, tap. Step, bow, tap. Your fish is a sprat: small, rubber and very squeaky.'),
        N('It does its best.'),
        PI('Good. Very good. The wrist is a little eager.', 'think'),
        GR('Eager wrists end up in the water.'),
        PI('Again. Feel the beat. Step on one, bow on two, tap on three.'),
        N('Step, bow, tap. Squeak. Step, bow, tap. Squeak.'),
      ],
      [
        act(
          4,
          m('music', 'keeping a steady beat in threes', 'Clapped a steady beat in groups of three, with the first beat strongest, like a waltz.'),
          'edu:clap:beat:step-bow-tap',
          [
            N('Clap along: ONE, two, three. ONE, two, three. Keep it steady.'),
            PI('A beat in threes, with the first one strongest, is the same pulse as a waltz. Very formal. Very us.'),
          ],
        ),
      ],
    ),
    scene(
      'q17-performance',
      [
        PI('Now. The full performance. In front of the whole pond.', 'happy'),
        N('A small audience of Nubbins has gathered on the bank. One has brought a snack.'),
        GR('Keep the timing. Whatever happens, keep the timing.'),
        N('Mr Grampus reaches behind a crate and brings out a second rubber fish.'),
        N('It is much, much bigger: a herring as long as a draught excluder.'),
        Y('That’s not the same fish.'),
        GR('It is the finale fish.', 'think'),
        PI('Your sprat is 10 centimetres long. The finale herring is 80.'),
      ],
      [
        ask(
          7,
          m('maths', 'comparing lengths with division', 'Worked out that an 80 cm herring is 8 times as long as a 10 cm sprat (80 ÷ 10 = 8).', '3.OA.A.3'),
          [N('How many sprats, laid nose to tail, would make one finale herring?')],
          [
            best('8', N('Yes: 80 ÷ 10 = 8. Eight sprats long. That is a lot of finale.')),
            opt('70', N('70 is how much LONGER it is. To find how many sprats fit, divide: 80 ÷ 10 = 8.')),
            opt('90', N('That’s 80 add 10. To find how many 10s fit into 80, count in tens: 10, 20, 30… 80. That’s 8 sprats.')),
          ],
        ),
        notice(
          7,
          m('science', 'fish that live in shoals', 'Learned that real sprats and herring swim in big groups called shoals, which helps keep them safe.', '3-LS2-1'),
          [
            PI('Real sprats and herring are cousins. They swim together in enormous groups called shoals.'),
            GR('In a crowd, it is much harder for a hungry bird to pick out just one. Safety in numbers.'),
          ],
        ),
      ],
      [
        ch('keep-time', 'Keep the timing.', [N('You set your feet. Your sprat trembles. Squeak.')], { 'q17-kept-time': true }),
        ch('ask-finale', 'Ask what the finale involves.', [PI('Water, mostly.'), GR('Gently, though. We are a very polite society.')]),
      ],
    ),
    scene(
      'q17-splash',
      [
        N('Step, bow, tap. Step, bow, tap. Perfect timing, every beat.'),
        N('Then Mr Grampus swings the finale fish, very slowly and very gently.'),
        N('Boing. It nudges your shoulder. You wobble. You wobble some more.'),
        N('You topple off the dock into the pond with a soft splash.'),
        N('The water is warm. A duck paddles over and looks at you. Its feathers are perfectly dry.'),
        N('The Nubbins on the bank cheer as if this was the plan. It was.'),
      ],
      [
        ask(
          3,
          m('science', 'balanced and unbalanced forces', 'Explained that a push with nothing to balance it makes things move.', '3-PS2-1'),
          [N('You were standing still, perfectly balanced. Then the herring pushed you.'), N('Why did you fall in?')],
          [
            best(
              'The push was a force, and nothing balanced it.',
              N('Yes. When the forces on something are balanced, it stays still. The herring’s push made them unbalanced, so you moved. Splash.'),
            ),
            opt('The dock was slippery.', N('It might be! But here it was the push. A push with nothing to balance it makes things move.')),
            opt('The herring was magic.', N('Ha. Not magic, just a push. When a push isn’t balanced by anything, things move.')),
          ],
        ),
        notice(
          4,
          m('science', 'how ducks stay dry', 'Learned that ducks spread oil on their feathers to keep water out.', '4-LS1-1'),
          [
            N('Ducks have a little gland near their tail that makes oil. They spread it over their feathers with their beaks.'),
            N('The oil keeps water out, so the duck stays dry. You, sadly, have no such gland.'),
          ],
        ),
      ],
    ),
    scene(
      'q17-complete',
      [
        N('You climb out. Mr Pilchard hands you a towel. Mr Grampus hands you the finale fish.'),
        GR('Traditional. The one who goes in keeps the herring.', 'soft'),
        PI('It is excellent for knocking fruit out of trees from a distance. Give it to your strongest Nubbin.'),
        PI('And you may keep the bow. It suits you.', 'happy'),
        GR('We dance it every morning. Usually for nobody.', 'soft'),
        GR('It is nice to be watched. But we would do it anyway.', 'soft'),
        N('Your Power Nubbins can now knock fruit down from afar with the herring. You also have a new karate victory pose.'),
      ],
      [
        think(
          5,
          m(
            'sel',
            'doing things for the joy of them',
            'Thought about what they would do even if nobody was watching, and why.',
            'CASEL: Self-awareness',
          ),
          [N('Pilchard and Grampus dance every morning, even when nobody watches.'), N('Is there something you would do even if nobody ever saw it?')],
          [
            opt('Yes, something I just love doing.', N('That’s a lovely answer. Doing things for the joy of it is one of the best feelings there is.')),
            opt('Not really. I like an audience.', N('That’s honest! Lots of people love sharing what they do. Even Grampus admits he likes being watched.')),
            opt('I’m not sure yet.', N('That’s fine. Noticing what you’d do with nobody watching is a good way to find out what you love.')),
          ],
        ),
      ],
    ),
  ],
  [
    gloss('formal', 'Done in a proper, serious way, following set rules.', 'q17-intro'),
    gloss('society', 'A club of people who share an interest.', 'q17-intro'),
    gloss('eager', 'Very keen; wanting to do something a lot.', 'q17-learned'),
    gloss('finale', 'The last, biggest part of a show.', 'q17-performance'),
    gloss('draught excluder', 'A long, stuffed cloth tube laid by a door to stop cold air getting in.', 'q17-performance'),
    gloss('topple', 'To wobble and fall over.', 'q17-splash'),
    gloss('traditional', 'Done the same way for a very long time.', 'q17-complete'),
  ],
  'No source quotes. As in the sprout band, the fish are squeaky rubber; the “Do the fish mind?” choice and the first ' +
    'lesson make clear that real fish stay in the water, where they can breathe. The fall is gentle and warm. Lessons: ' +
    'gills, a beat in threes, 80 ÷ 10, shoals, unbalanced forces, duck feathers. Think question: what would you do if ' +
    'nobody was watching?',
);

// ================================================================== Q18 Self-Defence Against Fresh Fruit
const Q18 = quest(
  'q18',
  'Fruit Defence Class',
  {
    'q18-s1': {
      goal: 'Disarm the Nubbin with the banana.',
      hint: 'When the Nubbin swings the banana, tap Peel at the top of the swing.',
    },
    'q18-s2': {
      goal: 'Catch every raspberry in the bowl.',
      hint: 'Slide the bowl left and right under the falling raspberries: five waves of eight. Missing three restarts the drill.',
    },
    'q18-s3': {
      goal: 'Toss the pineapple to your Nubbin from across the clearing.',
      hint: 'Hold the pineapple, aim at your Nubbin and tap Throw. Your Nubbin will run to meet it.',
    },
  },
  [
    scene(
      'q18-intro',
      [
        N('In the clearing, a Keeper with a moustache like a yard brush is pacing in front of a row of logs.'),
        N('Three Nubbins sit on the logs. They look as if they were here first and have been told off for it.'),
        SG('YOU! Late! Sit! On a log!', 'angry'),
        SG('Sergeant Grimble. Tonight’s class: what to do when somebody waves fresh fruit at you, with menace.'),
        SG('Dried fruit is next week. Dried fruit is a whole different animal.', 'think'),
        N('A Nubbin on the end log raises a paw.'),
        SG('NO. Not sticks. Every class wants sticks. Tonight is FRUIT.', 'angry'),
        N('The Nubbin lowers its paw very slowly. It was going to ask about sticks.'),
        SG('First. The banana. Somebody waves a banana at you, very meaningfully. What do you do?'),
      ],
      [
        notice(
          8,
          m('science', 'why bananas are curved', 'Learned that bananas curve because they bend upwards towards the light as they grow.'),
          [
            SG('Know your enemy. Bananas grow in big bunches, hanging from the plant.', 'think'),
            SG('As each one grows, it bends up towards the light. THAT is where the curve comes from. Sneaky.'),
          ],
        ),
      ],
      [
        ch('duck', 'Duck.', [SG('DUCK? A banana CURVES, Keeper. It will find you.', 'angry')]),
        ch('reason', 'Talk them down.', [SG('With a BANANA in their hand? They are beyond reason!', 'angry')]),
        ch('peel', 'Peel it.', [SG('…Correct. Who told you? Nobody ever knows that.', 'shock')], { 'q18-knew-peel': true }),
      ],
    ),
    scene(
      'q18-banana',
      [
        N('A Nubbin lunges at you with a banana.'),
        N('You peel it in one smooth move: zip, zip, zip.'),
        N('The Nubbin stares at the bare banana, deeply embarrassed.'),
        N('It sits back down on its log and looks at its feet.'),
        SG('TEXTBOOK! A peeled banana is a defeated banana!', 'happy'),
        N('The Nubbin’s ears droop a little lower.'),
      ],
      [
        ask(
          5,
          m('sel', 'helping someone who feels embarrassed', 'Chose a kind way to help someone who felt embarrassed.', 'CASEL: Social awareness'),
          [N('The Nubbin feels embarrassed. Its ears are drooping.'), N('What could you do to help it feel better?')],
          [
            best('Say “Good swing!” and offer it half the banana.', N('That’s kind. A friendly word and a share can turn embarrassed back into fine.')),
            opt('Laugh at it.', N('It IS a funny sight! But laughing at someone who already feels embarrassed makes it worse. A kind word helps more.')),
            opt('Ignore it.', N('Sometimes people want space. But a quick kind word, like “Good swing!”, usually helps.')),
          ],
        ),
      ],
    ),
    scene(
      'q18-raspberry',
      [
        SG('Next. The raspberry. Small. Fast. Underestimated. The raspberry is a professional.', 'think'),
        SG('It does not come alone. Where there is one raspberry, there are forty.'),
        N('A Nubbin rises from its log holding a bowl of raspberries, eyes narrowed.'),
        SG('They will come in five waves. Eight raspberries a wave.'),
        SG('Your defence is a bowl. Hold out a bowl. Catch them all. Leave none on the floor.'),
        Y('Why can’t any land on the floor?'),
        SG('Because they STAIN, Keeper. Do you want your floor to remember this?', 'angry'),
      ],
      [
        ask(
          3,
          m('maths', 'multiplication as equal groups', 'Worked out 5 waves × 8 raspberries = 40.', '3.OA.A.1'),
          [N('Five waves. Eight raspberries in each wave.'), N('How many raspberries is that altogether?')],
          [
            best('40', SG('FORTY! Five eights are forty. As I said. I am never wrong about raspberries.', 'happy')),
            opt('13', N('That’s 5 add 8. But there are five waves OF eight: 8, 16, 24, 32, 40. That’s 40.')),
            opt('35', N('Close! That’s five sevens. Five eights: 8, 16, 24, 32, 40.')),
          ],
        ),
      ],
    ),
    scene(
      'q18-raspberry-done',
      [
        N('Wave one. Wave two. Wave three. You slide the bowl left and right.'),
        N('Wave four. Wave five. Forty raspberries. Forty catches.'),
        N('Your bowl is full and the floor is spotless.'),
        N('The Nubbin with the empty bowl looks at its paws, then at yours, then quietly eats one of yours.'),
        SG('Acceptable. Move on.'),
        N('You look into the bowl. Each raspberry is a little cluster of tiny round bumps.'),
      ],
      [
        notice(
          5,
          m('science', 'what a raspberry is made of', 'Learned that a raspberry is made of many tiny parts called drupelets, each with its own seed.'),
          [
            SG('Each tiny bump is called a drupelet. Every drupelet has its own little seed inside.', 'think'),
            SG('So one raspberry is not one fruit. It is a whole squad. I respect that.'),
          ],
        ),
      ],
    ),
    scene(
      'q18-pineapple',
      [
        SG('And now. The big one.', 'think'),
        N('He lifts the cloth off a crate. In it sits a whole pineapple, prickly and enormous, wearing a small pair of sunglasses.'),
        SG('The pineapple. Spiky. Heavy. Thinks it’s better than you. It may be right.'),
        SG('Nobody defends against the pineapple. You can only teach it to be on your side.'),
        Y('How?'),
        SG('Throw it. Gently. To your Nubbin. Let your Nubbin catch it, and you have an ally.', 'happy'),
      ],
      [
        notice(
          1,
          m('health', 'protecting your eyes from the sun', 'Learned that bright sunlight can harm eyes and that we should never look straight at the Sun.'),
          [
            SG('Sensible sunglasses, mind. Bright sun can harm your eyes.', 'think'),
            SG('And never look straight at the Sun. Not even with sunglasses. Not even if a pineapple dares you.'),
          ],
        ),
        ask(
          2,
          m('science', 'how pineapples grow', 'Learned that a pineapple grows in the middle of a low, spiky plant, not on a tree.'),
          [SG('Know your enemy. Where do pineapples grow?', 'think')],
          [
            best(
              'In the middle of a low, spiky plant on the ground.',
              SG('CORRECT. One pineapple grows in the middle of a low, spiky plant. Not on a tree.', 'happy'),
              SG('And it is really lots of little fruits, all joined together into one.'),
            ),
            opt('On tall trees, like coconuts.', SG('Most people think so! But pineapples grow in the middle of a low, spiky plant, near the ground.')),
            opt('Underground, like potatoes.', SG('Good guess, but no. They grow above the ground, in the middle of a low, spiky plant.')),
          ],
        ),
      ],
      [
        ch('toss', 'Just toss it.', [SG('No ceremony. I like it.')]),
        ch('sunglasses', 'Take its sunglasses off first.', [SG('Bold. Very bold. It respects that.', 'shock')], { 'q18-sunglasses-off': true }),
      ],
    ),
    scene(
      'q18-catch',
      [
        N('You toss the pineapple, gently, in a high, slow curve.'),
        N('Your Nubbin runs, jumps, and catches it in both arms with a soft “oof”.'),
        N('It holds the pineapple up like a trophy.'),
        N('The pineapple seems content with the arrangement.'),
        SG('Did you see that? Soft hands. Both arms. Textbook.', 'happy'),
        N('The three class Nubbins on the logs clap their paws. One claps a raspberry by mistake.'),
      ],
      [
        ask(
          3,
          m('literacy', 'personification', 'Recognised personification: a writer giving human feelings to something that is not human.'),
          [N('The pineapple “seems content”. Can a pineapple really feel content?')],
          [
            best(
              'No. The writer gives it a human feeling, to be funny.',
              N('Yes. Giving human feelings to things that aren’t human is called personification. It turns the pineapple into a character.'),
            ),
            opt('Yes, pineapples have feelings.', N('In this story it seems to! But real pineapples can’t feel. The writer is using personification, for fun.')),
            opt('Only when it wears sunglasses.', N('Ha! The sunglasses help. But it’s the writer giving it human feelings. That’s called personification.')),
          ],
        ),
      ],
    ),
    scene(
      'q18-complete',
      [
        SG('CLASS DISMISSED!', 'happy'),
        SG('You are now qualified to face fresh fruit without fear. And, more importantly, to throw it.'),
        SG('Between you and me, Keeper? Forty years, and not once has anybody attacked me with fruit.', 'soft'),
        SG('I have been ready the entire time. It has been exhausting.', 'think'),
        N('He presses a battered brass whistle into your hand. It has clearly been blown a great deal.'),
        SG('Blow that, and your Nubbins will look up. Throw, and they will catch. Any fruit. Any distance.'),
        SG('Except dried fruit. Next week. Bring a hat.', 'think'),
        N('From now on, your Nubbins can catch fruit you toss to them from a distance.'),
      ],
      [
        think(
          3,
          m(
            'sel',
            'managing worries about things that may never happen',
            'Thought about ways to handle worries about unlikely things, such as talking, checking the evidence or doing something fun.',
            'CASEL: Self-management',
          ),
          [N('Sergeant Grimble spent forty years ready for something that never happened.'), N('What could help someone who worries about things that probably won’t happen?')],
          [
            opt('Talking to a friend about the worry.', N('That’s a wise answer. Saying a worry out loud often makes it smaller.')),
            opt('Checking how likely it really is.', N('Good thinking. Forty years, zero fruit attacks: the evidence says he can relax!')),
            opt('Doing something fun to take their mind off it.', N('That works for lots of people. Perhaps Grimble should join the dance on the dock.')),
          ],
        ),
        notice(
          5,
          m('science', 'sound is made by vibration', 'Learned that a whistle makes sound by making the air vibrate.', '1-PS4-1'),
          [
            N('When you blow the whistle, the air inside it shakes very fast. These shakes are called vibrations.'),
            N('The vibrations travel through the air to your Nubbins’ ears, and they hear a sound.'),
          ],
        ),
      ],
    ),
  ],
  [
    gloss('armed', 'Holding a weapon. Or, tonight, a fruit.', 'q18-intro'),
    gloss('embarrassed', 'Feeling silly and uncomfortable because others saw something go wrong.', 'q18-banana'),
    gloss('textbook', 'Done exactly right, as if copied from a book of instructions.', 'q18-banana'),
    gloss('underestimated', 'Thought to be weaker or less important than it really is.', 'q18-raspberry'),
    gloss('drupelet', 'One of the tiny round bumps that make up a raspberry, each with a seed.', 'q18-raspberry-done'),
    gloss('ally', 'A friend who is on your side.', 'q18-pineapple'),
    gloss('content', 'Happy and satisfied.', 'q18-catch'),
    gloss('personification', 'Giving human feelings or actions to something that is not human.', 'q18-catch'),
    gloss('qualified', 'Trained and allowed to do something.', 'q18-complete'),
    gloss('vibrations', 'Very fast shaking movements, like the ones that make sound.', 'q18-complete'),
  ],
  'No source quotes. Nobody is hit by fruit; the sergeant is loud but kind. Lessons: why bananas curve, helping someone ' +
    'embarrassed, 5 × 8, drupelets, eye safety in sunlight, how pineapples grow, personification, sound as vibration. ' +
    'Think question: handling worries about things that may never happen.',
);

// ================================================================== Q19 Upper-Class Twit of the Year
const Q19 = quest(
  'q19',
  'The Grand Toffs’ Cup',
  {
    'q19-s1': {
      goal: 'Enter the Grand Toffs’ Cup in the meadow.',
      hint: 'Sign the entry book on Mrs Thackery’s table.',
    },
    'q19-s2': {
      goal: 'Win the Grand Toffs’ Cup.',
      hint: 'Run the course. Jump the matchboxes and step round the sleeping Keeper. Don’t wake them; it takes ages.',
    },
  },
  [
    scene(
      'q19-intro',
      [
        N('A banner over the meadow reads: THE GRAND TOFFS’ CUP. ENTRANTS WELCOME. NO EXPERIENCE NEEDED, OR WANTED.'),
        MT('Roll up! The obstacle race! Three gentlemen entrants so far. We could do with a fourth.', 'happy'),
        N('The three gentlemen are standing on the start line. One of them is facing the wrong way.'),
        BU('I say. Is this the start or the end? It looks awfully like the start.', 'think'),
        PR('It’s the middle, Bunty. Everything is the middle, if you think about it.'),
        AL('I have entered every year for nine years. I have never once found the start line. Tremendously exciting.', 'happy'),
        N('The finish flag is to the north. Bunty is looking south, at a cow.'),
      ],
      [
        ask(
          6,
          m('social-studies', 'compass directions', 'Used north and south as opposites to turn a racer the right way.', 'D2.Geo.2.K-2'),
          [N('The finish flag is to the north. Bunty is facing south.'), N('Which way should Bunty turn to face the finish?')],
          [
            best('Turn right round, to face north.', N('Yes. North and south are opposites. A half turn takes Bunty from facing south to facing north.')),
            opt('Turn to face east.', N('East is only a quarter turn, towards the side of the course! North is opposite south: a half turn.')),
            opt('Stay facing south.', N('Then Bunty would run away from the finish, towards the cow. Turn halfway round to face north.')),
          ],
        ),
      ],
      [
        ch('enter', 'Sign up.', [MT('Splendid! Pop your name in the book. Spell it however you like.')]),
        ch('turn-bunty', 'Turn Bunty round first.', [N('You turn Bunty round to face north. Bunty thanks you warmly, then turns back round, to be polite.')], {
          'q19-turned-bunty': true,
        }),
      ],
    ),
    scene(
      'q19-ready',
      [
        MT('Four entrants! Record turnout!', 'happy'),
        MT('The course: one row of matchboxes, one low wall, one sleeping Keeper. Mind the Keeper.'),
        N('There are six matchboxes in the row, laid end to end. Each one is 5 centimetres long.'),
        N('At the far end of the course, a Keeper is snoring in a deckchair.'),
        N('Nobody knows who put them there. Nobody likes to ask.'),
        AL('Is that the start line? It’s very snory.', 'think'),
      ],
      [
        ask(
          2,
          m('maths', 'multiplying to find a length', 'Worked out that six 5 cm matchboxes laid end to end make 30 cm.', '3.OA.A.3'),
          [N('Six matchboxes, end to end. Each is 5 centimetres long.'), N('How long is the whole row?')],
          [
            best('30 centimetres', N('Yes: 6 × 5 = 30. Count in fives: 5, 10, 15, 20, 25, 30.')),
            opt('11 centimetres', N('That’s 6 add 5. But there are six boxes OF 5 cm each: 5, 10, 15, 20, 25, 30. That’s 30 cm.')),
            opt('65 centimetres', N('Hmm, that’s a 6 and a 5 side by side! Six lots of 5 cm is 6 × 5 = 30 cm.')),
          ],
        ),
      ],
    ),
    scene(
      'q19-race',
      [
        MT('On your marks! Get set!', 'happy'),
        N('A whistle blows. You run. Behind you, nobody else moves.'),
        MT('And the Keeper is away! Bunty is checking which way is forward. Piers is tying his shoelace. To Algernon’s shoelace.', 'shock'),
        N('At the matchboxes, Piers finally arrives and leaps each one with enormous effort, about 30 centimetres too high.'),
        AL('I’ve found the start line! Hello, start line!', 'happy'),
        N('Bunty reaches the sleeping Keeper, stops, and taps them gently on the shoulder.'),
        BU('Frightfully sorry. Would you like to come? It’s ever so jolly.'),
      ],
      [
        ask(
          6,
          m('literacy', 'describing a character from their actions', 'Used what a character does to choose a word that describes them (kind).', 'RL.3.3'),
          [N('Bunty is in a race, but stops to invite the sleeping Keeper along.'), N('Which word best describes Bunty?')],
          [
            best('Kind', N('Yes. Bunty puts someone else ahead of winning. What a character DOES tells us who they are.')),
            opt('Fast', N('Bunty is not fast! Look at what Bunty does: stopping to include someone. That shows kindness.')),
            opt('Sneaky', N('Nothing sneaky here! Bunty stops to include someone who might feel left out. That’s kind.')),
          ],
        ),
      ],
      [
        ch('straight-face', 'Keep a straight face and run.', [N('You keep a perfectly straight face. It is the hardest thing you have ever done.')], {
          'q19-straight-face': true,
        }),
        ch('laugh', 'Laugh all the way to the finish.', [N('You laugh so hard you have to walk the last stretch. You are still miles ahead.')]),
      ],
    ),
    scene(
      'q19-win',
      [
        MT('The Keeper wins! By a margin of… well. By everybody.', 'happy'),
        N('Piers comes second, trailing a very long shoelace.'),
        N('Far behind, Algernon is waving goodbye to the start line as if seeing off a ship.'),
        N('Bunty finishes last of all, having walked the whole course arm in arm with the sleeping Keeper.'),
        N('The sleeping Keeper is still asleep.'),
        MT('Results! First, the Keeper. Second, Piers. Third, Bunty. Algernon: still saying goodbye.'),
      ],
      [
        think(
          5,
          m(
            'sel',
            'thinking about fair prizes: speed or kindness',
            'Weighed whether helping someone should earn a prize in a race, thinking about rules and kindness.',
            'CASEL: Responsible decision-making',
          ),
          [N('Bunty came last, but stopped to help someone along the way.'), N('Should there be a prize for helping, even in a race?')],
          [
            opt('Yes. Kindness matters more than speed.', N('That’s a warm answer. You might be able to persuade Mrs Thackery.')),
            opt('No. A race prize is for the fastest.', N('That’s fair too. A race measures speed, and rules are rules. Maybe kindness needs a prize of its own.')),
            opt('Yes, but a different prize.', N('Clever. One prize for speed and another for kindness. Then both get noticed.')),
          ],
        ),
      ],
      [
        ch(
          'bunty-prize',
          'Bunty should get a prize for stopping to help.',
          [
            MT('There isn’t a prize for that.', 'think'),
            Y('There should be.'),
            MT('…There is now. It’s a slightly smaller hat.', 'happy'),
            N('Bunty accepts it with tears in both eyes, and puts it on the sleeping Keeper.'),
          ],
          { 'q19-bunty-prize': true },
        ),
        ch('gracious', 'Accept graciously.', [N('You bow. Piers bows back. Algernon bows to the start line, which he has grown very fond of.')]),
      ],
    ),
    scene(
      'q19-complete',
      [
        N('The three gentlemen gather to congratulate you. Two of them congratulate a fence post first.'),
        PR('Jolly well run. Frightfully fast. We had no idea people could go in that direction.', 'happy'),
        BU('Here. The prize. It’s a top hat. And the monocle’s from me. I’ve two more. I can’t find either.'),
        N('The hat is tall and glossy. The monocle stays in only if you raise one eyebrow, permanently.'),
        AL('Same time next year? That will be my tenth go. I shall start looking for the start line tonight.', 'happy'),
        N('The sleeping Keeper wakes, sees you in the top hat, and goes straight back to sleep.'),
      ],
      [
        notice(
          3,
          m('science', 'how a lens helps us see', 'Learned that a lens is curved glass that bends light so blurry things look sharp.'),
          [
            N('A monocle is a single lens, for one eye. A lens is a piece of curved glass that bends light.'),
            N('Bending the light the right way makes blurry things look sharp. Glasses are just two lenses joined together.'),
          ],
        ),
      ],
    ),
  ],
  [
    gloss('entrant', 'Someone who has entered a race or competition.', 'q19-intro'),
    gloss('obstacle', 'Something in the way that you have to get over or round.', 'q19-intro'),
    gloss('turnout', 'The number of people who come to an event.', 'q19-ready'),
    gloss('frightfully', 'Very. A posh, old-fashioned way of saying it.', 'q19-race'),
    gloss('margin', 'The amount by which someone wins.', 'q19-win'),
    gloss('graciously', 'In a polite, kind way, especially when you have won.', 'q19-win'),
    gloss('monocle', 'A single round lens worn in front of one eye.', 'q19-complete'),
    gloss('congratulate', 'To tell someone you are pleased about their success.', 'q19-complete'),
  ],
  'No source quotes; the rivals are invented and gentle. The results line gives a finishing order (Keeper, Piers, ' +
    'Bunty; Algernon never leaves the start). Lessons: north and south, 6 × 5 cm, a character trait from actions, how a ' +
    'lens works. Think question: should helping win a prize?',
);

// ================================================================== Q20 And Now, the Larch
const Q20 = quest(
  'q20',
  'The Larch Lesson',
  {
    'q20-s1': {
      goal: 'Find and tap one of every kind of tree in the Grove.',
      hint: 'Your Grove has one tree for each fruit, plus the palm on the coast. Keep a tally: your journal ticks each one off.',
    },
    'q20-s2': {
      goal: 'Photograph Mr Arbour’s board from the meadow.',
      hint: 'Open Photo mode, zoom in on the far ridge, and take the picture with the board in frame.',
    },
  },
  [
    scene(
      'q20-intro',
      [
        N('At the orchard’s edge, a Keeper in a grey suit stands beside a signboard showing a tree.'),
        AR('Good afternoon. Today we shall learn to recognise the different trees of the Grove.', 'think'),
        AR('From quite near, mostly. My eyesight is not what it was.'),
        AR('Tree number one.'),
        AR('Behold. A larch.'),
        N('He points at the picture. It is a tall, thin, pointy tree, quite unlike anything in your Grove.'),
        Y('There aren’t any of those here.'),
        AR('Correct. Tree number two.', 'think'),
        N('He turns the board over. It is the same tree.'),
        AR('Behold, once more. A larch.'),
        Y('That’s the same tree.'),
        AR('It is a larch. It is very important to recognise it. Particularly when it is absent.'),
        AR('Your task: find one of every tree you DO have, and tap it. Recognise it. Up close.'),
      ],
      [
        notice(
          11,
          m('science', 'how to recognise a larch', 'Learned that a larch is a conifer with needles in tufts, and that unlike most conifers it drops its needles in autumn.'),
          [
            AR('Since you ask, which you did not: the larch is a conifer. It grows cones, and needles instead of flat leaves.'),
            AR('Its needles grow in little tufts. And, unlike most conifers, in autumn they turn gold and fall off.'),
            AR('So in winter a larch can look quite bare. It is only waiting for spring.'),
          ],
        ),
      ],
      [
        ch('three', 'Is number three a larch?', [AR('…Let us not get ahead of ourselves.', 'think')], { 'q20-asked-three': true }),
        ch('off-you-go', 'Off I go, then.', [AR('I shall wait here, by my larch.', 'happy')]),
      ],
    ),
    scene(
      'q20-trees',
      [
        N('Run, swim, fly, power, stamina, sun, moon, heart. Eight fruit trees.'),
        N('Then the palm, on the coast, looking tired.'),
        N('Each tree, once tapped, rustles slightly, as if pleased to be recognised.'),
        N('You look closely at each one: the shape of its leaves, the feel of its bark, the fruit it bears.'),
        N('There is no larch. You check twice.'),
        N('You feel, absurdly, that you have let Mr Arbour down.'),
      ],
      [
        act(
          1,
          m('maths', 'tallying and adding', 'Tallied each kind of tree as it was found: 8 fruit trees + 1 palm = 9 kinds.'),
          'edu:tally:trees:9',
          [N('Make a tally mark for each kind of tree as you tap it.'), N('Eight fruit trees and one palm: 8 + 1 = 9 kinds. Larches: 0.')],
        ),
        ask(
          3,
          m('science', 'clues for identifying trees up close', 'Learned that leaves, bark, fruit or seeds, and shape are all clues for identifying a tree.'),
          [N('Up close, which clues help you tell one kind of tree from another?')],
          [
            best(
              'Leaves, bark, fruit and shape: all of them.',
              N('Yes. Tree experts use every clue: leaf shape, bark, fruit or seeds, and the shape of the whole tree.'),
            ),
            opt('Only the colour.', N('Colour helps, but lots of trees are green! Leaves, bark, fruit and shape are better clues.')),
            opt('Only how tall it is.', N('Height changes as a tree grows. Leaves, bark, fruit and shape tell you much more.')),
          ],
        ),
      ],
    ),
    scene(
      'q20-far',
      [
        AR('Very good. Now the advanced class. Recognising a tree from quite a long way away.', 'think'),
        N('He picks up his signboard and walks off with it. He keeps walking. He goes over the hill.'),
        N('After a while, a tiny figure appears on the far ridge, holding up a tiny board.'),
        AR('Can you see it?', 'happy'),
        N('You can just make out the board. It shows a tall, thin, pointy tree. Of course it does.'),
        AR('Take a photograph! I shall stand here until you do, which is fine! I have brought a sandwich!'),
      ],
      [
        notice(
          2,
          m('science', 'distance makes things look smaller', 'Noticed that things look smaller the further away they are, even though their real size stays the same.'),
          [
            N('Mr Arbour is exactly the same size as before. He only looks tiny because he is far away.'),
            N('The further away something is, the smaller it looks. Hold up your thumb: it can hide him completely.'),
          ],
        ),
        ask(
          4,
          m('science', 'identifying trees from far away by their outline', 'Learned that from a distance a tree’s outline, or silhouette, is the best clue to what it is.'),
          [N('From far away you can’t see needles or bark. What helps you recognise a tree from a distance?')],
          [
            best(
              'Its outline: the shape of the whole tree.',
              N('Yes. From far away, the outline is the best clue, and a larch’s is tall and pointed. It’s called a silhouette.'),
            ),
            opt('Its leaves.', N('Too small to see from here! From far away, the outline of the whole tree is what you can see.')),
            opt('Its smell.', N('Not from the meadow! From far away, the best clue is the outline: the shape of the whole tree.')),
          ],
        ),
      ],
    ),
    scene(
      'q20-photo',
      [
        N('You open Photo mode and zoom in, and in, and in.'),
        N('Click.'),
        N('The picture is mostly sky, a bit of hill, and one small, clear, unmistakable larch.'),
        N('Far away, a tiny Mr Arbour lowers the board.'),
        N('He takes a dignified bite of his sandwich.'),
        N('Even from here, you can tell it is cheese and pickle. You don’t know how.'),
      ],
      [
        ask(
          2,
          m('art', 'contrast in a picture', 'Learned that a dark shape against a plain, light background stands out; artists call this contrast.'),
          [N('The larch is tiny in your photo, but easy to spot. Why?')],
          [
            best('It stands out against the plain sky.', N('Yes. A dark shape against a plain, light background really stands out. Artists call that contrast.')),
            opt('Because it’s in the middle.', N('Being in the middle can help! But the big reason is contrast: dark board, light sky.')),
            opt('Because it’s the biggest thing.', N('It’s actually tiny! It stands out because of contrast: a dark shape against light sky.')),
          ],
        ),
      ],
    ),
    scene(
      'q20-complete',
      [
        N('Mr Arbour returns, slightly out of breath, and studies your photograph for a long time.'),
        AR('Yes. That is a larch.', 'soft'),
        AR('Most people walk past every tree they own and never once look up. You tapped all of yours.', 'think'),
        AR('The larch was only there to get you looking. You are the first student ever to recognise it twice. Here. Plant your own.'),
        N('He presses a small, winged seed into your palm. A larch seed: a new tree for your Grove.'),
        AR('And a little button for your camera. Press it, and the picture turns into something else entirely.', 'think'),
        N('Photo mode has a new button that swaps to a random filter.'),
        N('Mr Arbour walks back to the orchard edge to stand beside nothing.'),
        N('A very large foot comes down out of the sky, considers the orchard, and goes back up again. Nobody mentions it.'),
      ],
      [
        think(
          2,
          m(
            'sel',
            'noticing the everyday world around you',
            'Thought about something they pass every day but have never really looked at.',
            'CASEL: Self-awareness',
          ),
          [N('Mr Arbour says most people never look up at their own trees.'), N('What’s something near you every day that you’ve never really looked at?')],
          [
            opt('Something outside, like a tree or the sky.', N('Lovely. Next time you pass it, give it a proper look. Mr Arbour would be proud.')),
            opt('Something at home, like a picture on the wall.', N('Good one. Things we see every day can become almost invisible. Looking again can surprise you.')),
            opt('I’m not sure. That’s why I’ve never looked!', N('Ha! A very honest answer. Maybe today is the day to find out.')),
          ],
        ),
        act(
          4,
          m('science', 'the life cycle of a tree', 'Put the stages of a larch’s life cycle in order, from seed to cones and new seeds.', '3-LS1-1'),
          'edu:order:larch-life-cycle',
          [
            N('Put the larch’s life in order: seed, seedling, young tree, grown tree with cones, new seeds.'),
            AR('Larch seeds grow inside the cones. They have little wings, so the wind can carry them off to grow somewhere new.', 'think'),
          ],
        ),
      ],
    ),
  ],
  [
    gloss('recognise', 'To know what something is because you have seen it before.', 'q20-intro'),
    gloss('conifer', 'A tree that grows cones, usually with needles instead of flat leaves.', 'q20-intro'),
    gloss('bark', 'The tough outer skin of a tree’s trunk and branches.', 'q20-trees'),
    gloss('absurdly', 'In a silly, unreasonable way.', 'q20-trees'),
    gloss('silhouette', 'The dark outline of something, seen against a light background.', 'q20-far'),
    gloss('ridge', 'A long, narrow hilltop.', 'q20-far'),
    gloss('contrast', 'A big difference between two things, like dark against light.', 'q20-photo'),
    gloss('dignified', 'Calm, serious and proud.', 'q20-photo'),
    gloss('seedling', 'A very young plant that has just grown from a seed.', 'q20-complete'),
  ],
  'Both approved quotes are replaced (“Behold. A larch.” and “Behold, once more. A larch.”), and the reward name for the ' +
    'Photo mode button is never spoken. Lessons: the larch (a conifer that drops its needles), tallying 9 kinds of tree, ' +
    'clues for identifying trees, distance and apparent size, silhouettes, contrast, a tree’s life cycle. Think ' +
    'question: what have you never really looked at?',
);

// ================================================================== exports
export const EDU_PYTHON_2_READER: EduQuest[] = [Q11, Q12, Q13, Q14, Q15, Q16, Q17, Q18, Q19, Q20];

/** Every `edu:` check used by a `do` lesson in this file. */
export const CHECKS: string[] = [
  // Q11
  'edu:pick:mint:top-leaves',
  // Q12
  'edu:test:plush:feed-tickle-float',
  'edu:count:shells:12-in-fours',
  // Q14
  'edu:sort:materials:soft-hard',
  // Q15
  'edu:tally:fruits-asked:12',
  'edu:list:inventory:dibble-stall',
  // Q17
  'edu:clap:beat:step-bow-tap',
  // Q20
  'edu:tally:trees:9',
  'edu:order:larch-life-cycle',
];
