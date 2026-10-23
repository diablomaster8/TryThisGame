/**
 * Expansion E2, "Nova’s Season", for "Hazel’s Grove" (plan G12). A twelve-day side story
 * told through the lifespan clock (sim/curfew.ts `dayCount`, sim/slips.ts): Nova brings an
 * egg from a short line. Dandy lives twelve days of the clock, and how the Keeper raises
 * it (the care slips) shapes the middle of the story. Both ends are written: a glowing
 * cocoon and a rebirth, or a soft cocoon and a flower on the hill.
 *
 * AUDIENCE. 'main'.
 *
 * FRAME. Opens a post-game morning after E1 has opened, when the roster has room. The
 * rule spawns the egg once e2-egg has played and sets its `spanScale` so the whole life
 * is twelve days of the clock. Steps are gated by Dandy’s day.
 *
 * FLAGS WRITTEN. `e2-answer` (enough | short), `e2-nubbin` (its id), `e2-asked` (asked |
 * quiet: whether you asked Nova which cocoon she expects), `e2-outcome` (reborn |
 * departed), `e2Done`.
 *
 * TONE. Theme 2 and 4 of the bible: the grey stays, and we are made of being remembered.
 * Nova is a Moon Keeper and says less than she means. Death is said plainly, gently,
 * with comfort straight after.
 */
import type { Line, Mood, Scene } from '../config/story';
import type { Quest, Speaker } from './types';

const say =
  (who: string) =>
  (text: string, mood?: Mood): Line =>
    mood ? { who, text, mood } : { who, text };

const N = say('narrator');
const NOVA = say('nova');

export const EXPANSION_E2_SPEAKERS: Speaker[] = [];

const egg: Scene = {
  id: 'e2-egg',
  lines: [
    N(
      'Nova is at the gate before the dew is off. She has an egg under her coat, held the way you hold a hot drink.',
    ),
    NOVA('Short line. Twelve days, hatch to hill. I don’t have a garden that’s quiet enough.'),
    NOVA('The strays’ ring is no place for it. It wants a step and a tree and somebody who stays.'),
    NOVA('You can say no. People do.'),
  ],
  choices: [
    {
      id: 'enough',
      label: 'Twelve days is enough.',
      set: { 'e2-answer': 'enough' },
      then: [NOVA('That’s what I hoped someone would say.', 'soft')],
    },
    {
      id: 'short',
      label: 'That’s not long.',
      set: { 'e2-answer': 'short' },
      then: [NOVA('No. But it’s all of it, for them. That’s the thing.')],
    },
  ],
};

const eggDone: Scene = {
  id: 'e2-egg-done',
  lines: [
    N(
      'It hatches small, even for a Nubbin. It looks up as if it has been waiting for you specifically.',
    ),
    N('There is a freckle on its brow, one, off-centre, the kind a thumb would find.'),
    N('You call it Dandy. Nova, at the gate, writes the name on the back of her hand.'),
    NOVA('Day one. I’ll come on four. Don’t count out loud, it hears you.'),
  ],
};

const day4: Scene = {
  id: 'e2-day4',
  lines: [
    N('Day four. Nova comes by with nothing in her hands, which for Nova is a kind of gift.'),
    NOVA('A third gone. Doesn’t look it, does it. They never do till day nine.'),
    N(
      'Dandy has found the step, and the tree, and the place under the tree where the step is in shade.',
    ),
    NOVA('It’s got the freckle. The whole line has it. I don’t know why I find that so steadying.'),
    NOVA('Pet it for me. I don’t want to be a stranger it liked once.'),
  ],
};

const day4Slips: Scene = {
  id: 'e2-day4-slips',
  lines: [
    N('Day four. Nova comes by and watches Dandy for a while before she says anything.'),
    NOVA(
      'It’s gone hungry twice. Sleepy once. I’m not telling you off. I’m telling you the clock.',
    ),
    NOVA('On a long life that’s a bad week. On twelve days it’s a bad year. They carry it.'),
    N('Dandy, who does not know it is carrying anything, climbs her boot.'),
    NOVA('Pet it for me. There isn’t a lot of day four left.'),
  ],
};

const day8: Scene = {
  id: 'e2-day8',
  lines: [
    N(
      'Day eight. Dandy is grown now, whatever grown means in a week. It sits where the sun lands first.',
    ),
    NOVA('Past the middle. This is the part I always want to stretch.'),
    N('She sits down on the step. Dandy moves over, exactly a Nova’s width, without looking.'),
    NOVA('It did that for the last one too. The step thing. I never taught it. Nobody teaches it.'),
    NOVA('Feed it something good. The last third should taste of something.'),
  ],
};

const day8Moody: Scene = {
  id: 'e2-day8-moody',
  lines: [
    N('Day eight. Dandy is grown and grumpy with it, a small cloud that follows the sun around.'),
    NOVA('It came up moody. That’s on the days we missed, not on it.'),
    N('It sits on the far end of the step from her. It is still on the step.'),
    N('It glares at the sun, which comes up anyway.'),
    NOVA('Don’t take it personally. It glares at everything. You’re just nearer than the sun.'),
    NOVA('See that. Grumpy, and on the step. That’s the whole of what I know about love.'),
    NOVA('Feed it something good anyway. Grumpy isn’t the same as unloved.'),
  ],
};

const day11: Scene = {
  id: 'e2-day11',
  lines: [
    N('Day eleven. Nova sits down on the step beside you without asking, and stays.'),
    NOVA(
      'Tomorrow it goes into the cocoon. One or the other kind. You’ll know which by the light.',
    ),
    N('Dandy is asleep between you, heavy for its size, the freckle turned up to the sky.'),
  ],
  choices: [
    {
      id: 'asked',
      label: 'Ask her which she thinks.',
      set: { 'e2-asked': 'asked' },
      then: [
        NOVA('I think it liked you. That’s the only thing I’ve ever been able to tell in advance.'),
        NOVA(
          'The rest is the light. Sit with it till dark. That’s all there is to do, and it’s a lot.',
          'soft',
        ),
      ],
    },
    {
      id: 'quiet',
      label: 'Don’t ask.',
      set: { 'e2-asked': 'quiet' },
      then: [
        N('You don’t ask. Nova notices, and leans on your shoulder for a moment.'),
        NOVA('Sit with it till dark. That’s all there is to do, and it’s a lot.', 'soft'),
      ],
    },
  ],
};

const end: Scene = {
  id: 'e2-end',
  lines: [
    N('Morning. The cocoon on the grass is still, and the light on it has decided.'),
    N('Nova is at the gate already. She has not come in. She is waiting to be told which.'),
  ],
};

// Nova answers what you said at the gate on day one (e2-answer), in both ends.
const ANSWER_ENOUGH = NOVA(
  'You said twelve was enough. You were right. I don’t know how you knew.',
  'soft',
);
const ANSWER_SHORT = NOVA('You said it wasn’t long. It wasn’t. It was all of it, though.', 'soft');

const reborn = (id: string, answer: Line): Scene => ({
  id,
  lines: [
    N(
      'The cocoon glows from the inside, slow, like a lamp turned up. It splits. An egg, warm, with the same freckle on it.',
    ),
    NOVA('Twelve days and it wanted twelve more. That’s what you did.', 'happy'),
    answer,
    N('When it hatches it greets you with a heart, and remembers its name before you say it.'),
    N('It goes to the step, and moves over a Nova’s width, and waits.'),
    NOVA('I’ll come on day four. Don’t be a stranger it liked once.'),
  ],
});

const departed = (id: string, answer: Line): Scene => ({
  id,
  lines: [
    N(
      'The cocoon is soft and grey and getting softer. There is no bang and no door. It simply isn’t there, and then a flower is.',
    ),
    NOVA(
      'Twelve days. It had all twelve. That’s the whole of what there was, and it was yours.',
      'sad',
    ),
    answer,
    N('The flower has a mark on one petal, off-centre, the kind a thumb would find.'),
    N(
      'Nova stays until the flower has opened. Then she goes, and comes back the next morning anyway.',
    ),
    NOVA('Short line. I keep taking them on. You’d think I’d learn.', 'soft'),
  ],
});

// e2-answer = enough (the first choice) plays the plain ids; short plays the -short variants.
const completeReborn = reborn('e2-complete-reborn', ANSWER_ENOUGH);
const completeRebornShort = reborn('e2-complete-reborn-short', ANSWER_SHORT);
const completeDeparted = departed('e2-complete-departed', ANSWER_ENOUGH);
const completeDepartedShort = departed('e2-complete-departed-short', ANSWER_SHORT);

export const EXPANSION_E2: Quest[] = [
  {
    id: 'e2',
    code: 'E2',
    title: 'Nova’s Season',
    source: 'Original (the lifespan clock, Digimon-style short lives)',
    audience: 'main',
    trigger: { where: 'The gate', when: 'A morning after the ending, once the square has begun' },
    speakers: EXPANSION_E2_SPEAKERS,
    steps: [
      {
        id: 'e2-s1',
        goal: 'Hatch Nova’s egg.',
        hint: 'It hatches in a few minutes. Shake it while held to hurry it.',
        check: 'hatch:dandy',
        scene: egg,
        done: eggDone,
      },
      {
        id: 'e2-s2',
        goal: 'On day four, pet Dandy.',
        hint: 'The stats sheet shows the day.',
        check: 'pet:dandy',
        scene: day4,
      },
      {
        id: 'e2-s3',
        goal: 'On day eight, feed Dandy.',
        hint: 'Fruit from a tree, or something better.',
        check: 'feed:nubbin',
        scene: day8,
      },
      {
        id: 'e2-s4',
        goal: 'On day eleven, sit with Dandy till dark.',
        hint: 'Stay near. Dusk comes on its own.',
        check: 'wait:dusk',
        scene: day11,
      },
      {
        id: 'e2-s5',
        goal: 'See the cocoon through.',
        hint: 'Rebirth needs a happy life and real affection. Departure leaves a flower.',
        check: 'choose:outcome',
        scene: end,
      },
    ],
    complete: completeReborn,
    rewards: [
      {
        id: 'twelve-days',
        kind: 'title',
        label: 'Twelve Days',
        description: 'You kept a short line company from hatch to hill.',
      },
    ],
    sets: { e2Done: true },
    notes:
      'Day gates come from dayCount on the flagged Nubbin. e2-day4-slips plays with two or ' +
      'more slips; e2-day8-moody when it evolved moody. The complete scene is ' +
      'e2-complete-departed when the Nubbin departed; either takes a -short suffix ' +
      '(e2-complete-reborn-short, e2-complete-departed-short) when e2-answer is short. The ' +
      'day-11 choice (e2-asked) pays off inside its own branch: Nova answers, or leans on you.',
  },
];

export const EXPANSION_E2_VARIANTS: Scene[] = [
  day4Slips,
  day8Moody,
  completeDeparted,
  completeRebornShort,
  completeDepartedShort,
];
export const EXPANSION_E2_FLAGS: string[] = [
  'e2-answer',
  'e2-nubbin',
  'e2-asked',
  'e2-outcome',
  'e2Done',
];
export const EXPANSION_E2_CHECKS: string[] = [
  'hatch:dandy',
  'pet:dandy',
  'feed:nubbin',
  'wait:dusk',
  'choose:outcome',
];
