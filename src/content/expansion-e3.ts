/**
 * Expansion E3, "The Twine", for "Hazel’s Grove" (plan G12). A short arc that teaches the
 * two-partner merge (sim/partners.ts) through the Hollow’s strays, and ends with a karate
 * tournament against the ten Keepers’ champions.
 *
 * AUDIENCE. 'main'.
 *
 * FRAME. Opens a post-game morning after E1 has opened, with at least two Nubbins in the
 * roster. Dusty (they/them) has watched two Hollow strays who only walk together; Byte
 * runs the bracket. The tournament is scored in dojo wins after the bracket is posted
 * (EXPANSIONS.tournamentWins in tuning), narrated as the ten champions in rounds.
 *
 * FLAGS WRITTEN. `e3-pick` (wait | strong: which two you told Dusty you would tie),
 * `e3-wins-at` (the dojo win count when the bracket went up), `e3-merged-win` (a win
 * while merged), `e3Done`.
 *
 * TONE. Theme 1: love is a method. The merge is consent and timing, not power.
 */
import type { Line, Mood, Scene } from '../config/story';
import type { Quest, Speaker } from './types';

const say =
  (who: string) =>
  (text: string, mood?: Mood): Line =>
    mood ? { who, text, mood } : { who, text };

const N = say('narrator');
const Y = say('you');
const DUSTY = say('dusty');
const BYTE = say('byte');
const PIXEL = say('pixel');

export const EXPANSION_E3_SPEAKERS: Speaker[] = [];

const strays: Scene = {
  id: 'e3-strays',
  lines: [
    N(
      'Dusty is sitting on the Hollow’s top step, lamp off, listening to the dark the way other people listen to rain.',
    ),
    DUSTY(
      'Two strays down there walk in step. One won’t eat unless the other has. I’ve never seen that.',
    ),
    DUSTY(
      'I’ve sat here four nights. They come to the second nook about now. They don’t come up. They don’t go down.',
    ),
    DUSTY('Go down and feed one. Watch what the other does.'),
    N(
      'They hand you the lamp, unlit. You are to light it at the bottom, not before. The strays mind.',
    ),
  ],
};

const straysDone: Scene = {
  id: 'e3-strays-done',
  lines: [
    N('You hold out the fruit. The stray takes it, then stops, and turns, and waits.'),
    N(
      'Only when the second one has eaten does the first swallow. Dusty, behind you, says nothing at all, which is their loudest.',
    ),
    N(
      'The two go back into the dark in step, one a little ahead, and then the other a little ahead, taking turns.',
    ),
  ],
};

const pair: Scene = {
  id: 'e3-pair',
  lines: [
    DUSTY(
      'That’s a pair. Yours can be one too. Name two partners. Not the strongest. The two who wait for each other.',
    ),
    N('They hand you a loop of grey twine, old and soft.'),
    DUSTY('Hazel’s. She said it was for tying beans. She was lying.'),
    DUSTY('Which two, then. Say it out loud. It’s easier to keep a thing you’ve said.'),
  ],
  choices: [
    {
      id: 'wait',
      label: 'The two who wait at the gate for each other.',
      set: { 'e3-pick': 'wait' },
      then: [
        DUSTY('Good. Those.', 'soft'),
        N(
          'They look, for a moment, like someone who has been told the right answer to a question they did not ask.',
        ),
      ],
    },
    {
      id: 'strong',
      label: 'The two strongest. It’s a tournament.',
      set: { 'e3-pick': 'strong' },
      then: [
        DUSTY(
          'It is. And the twine won’t hold two who don’t wait. Pick again, or find out. Both are allowed.',
        ),
        N('They say it without heat. Dusty has never once said anything with heat.'),
      ],
    },
  ],
};

const pairDone: Scene = {
  id: 'e3-pair-done',
  lines: [
    N('Two Nubbins who keep close to you now keep close to each other as well.'),
    N(
      'At the gate, that evening, one waits for the other without being told. It is the first time. It will not be the last.',
    ),
  ],
};

const twine: Scene = {
  id: 'e3-twine',
  lines: [
    DUSTY(
      'Mine’s too old to hold. The stall sells twine now. Buy a length. It only works when both of them are sure of you.',
    ),
    DUSTY(
      'Sure isn’t fond. Fond is easy. Sure is when they’d let you tie a knot round them and not look at the knot.',
    ),
    N(
      'They wind the old loop round two fingers and put it in a pocket, carefully, the way you keep a thing that no longer works.',
    ),
  ],
};

const twineDone: Scene = {
  id: 'e3-twine-done',
  lines: [
    N('A loop of twine, new and stiff. It smells of the stall.'),
    N('Your two sniff it, and look at each other, and then at you, and decide something.'),
  ],
};

const merge: Scene = {
  id: 'e3-merge',
  lines: [
    DUSTY('Both grown. Both fond of you past the point of doubt. Then tie it, and stand back.'),
    DUSTY(
      'They don’t become one thing. They become two things that agree. It lasts a minute. It changes nothing when it ends.',
    ),
    DUSTY(
      'Hazel tied it twice in her life that I saw. Once, she said, for the beans. There were no beans.',
    ),
    DUSTY('Once the winter the lane froze, and she never said for what.'),
    N('They do not say who she tied it round. You do not ask. Some tying is private.'),
  ],
};

const MERGE_SHAPE = N(
  'The twine goes slack and then isn’t there. Where two Nubbins stood there is a shape made of both, glowing at the seams.',
);
const MERGE_END: Line[] = [
  N('It moves like the faster one and stands like the stronger.'),
  N(
    'It does not yet know which half is steering, and walks into the dojo door twice. Both halves look at you as if you moved it.',
  ),
  N('After a minute it is two again, blinking, pleased.'),
  DUSTY('That’s it. That’s the whole trick. The rest is being worth tying to.', 'soft'),
  N(
    'The two of them sit down on the same side of you, closer than they were, and stay there till dark.',
  ),
];

const mergeDone: Scene = {
  id: 'e3-merge-done',
  lines: [MERGE_SHAPE, ...MERGE_END],
};

// Plays instead of e3-merge-done when you told Dusty you would tie the two strongest (e3-pick).
const mergeDoneStrong: Scene = {
  id: 'e3-merge-done-strong',
  lines: [
    MERGE_SHAPE,
    N('For one second the shape tries to go two ways at once.'),
    N('Then the stronger one waits, for the first time in its life, and it holds.'),
    ...MERGE_END,
  ],
};

const tournament: Scene = {
  id: 'e3-tournament',
  lines: [
    N(
      'Byte has pinned a bracket to the dojo door. Ten names, ten champions, one line through the middle with yours on it.',
    ),
    BYTE(
      'Every Keeper sent their best. Fern’s, Marina’s, Sparks’s, all of them. Luna’s is terrifying.',
    ),
    BYTE(
      'Win your rounds in the dojo. The twine is allowed. Everyone agreed, after some shouting.',
    ),
    PIXEL('He drew the bracket himself. Eleven lines for ten names.'),
    BYTE('The eleventh is structural.'),
    PIXEL('So’s your shoelace.'),
    N('He does not look down. It is undone.'),
    BYTE(
      'Luna did most of the shouting. Then she said “fine” in a way that was not fine. Then she sent her champion anyway.',
    ),
    Y('You look at the names and then at your two, who are looking at each other.'),
    N(
      'Dusty is at the back of the crowd, lamp off, looking at nothing in particular, which is where they look when they are proud.',
    ),
  ],
};

const tournamentDone: Scene = {
  id: 'e3-tournament-done',
  lines: [
    N('Round one: your two reach the ring and politely wave each other in first, for a full minute.'),
    N('The referee rings the bell out of despair.'),
    N(
      'Clover’s champion falls for a feint it saw coming. Ember’s runs out of puff and sits down, offended.',
    ),
    N('Luna’s is last. Your two look at each other and step left together.'),
    N('Luna’s champion hits the place they used to be.'),
    BYTE('That’s the bracket. I have never seen a bracket do that.', 'shock'),
    N('Luna says nothing, and claps twice, slowly, which from Luna is a speech.'),
  ],
};

const tournamentDoneMerged: Scene = {
  id: 'e3-tournament-done-merged',
  lines: [
    N('Round one: your two reach the ring and politely wave each other in first, for a full minute.'),
    N('The referee rings the bell out of despair.'),
    N(
      'Round after round, and the last one tied. Luna’s champion swings at a shape made of two and hits the agreement between them.',
    ),
    BYTE(
      'That’s the bracket. Luna is going to want a rematch and I am going to tell her no.',
      'shock',
    ),
    N('Luna says nothing, and claps twice, slowly, which from Luna is a speech.'),
  ],
};

const complete: Scene = {
  id: 'e3-complete',
  lines: [
    N(
      'A cup, dented, on the dojo bench. Dusty puts the old grey twine inside it and leaves it there.',
    ),
    DUSTY('Hazel said beans. Twenty years, she said beans. I never once saw a bean.'),
    BYTE('I’m writing this up as a draw. For diplomacy.'),
    N(
      'Your two sit either side of the cup and look at the twine in it as if it were theirs now. It is.',
    ),
    N('Down in the Hollow, two strays walk in step and do not need anyone to tell them why.'),
  ],
};

export const EXPANSION_E3: Quest[] = [
  {
    id: 'e3',
    code: 'E3',
    title: 'The Twine',
    source: 'Original (the two-partner merge, Digimon-style jogress; the dojo tournament)',
    audience: 'main',
    trigger: { where: 'The Hollow steps, then the dojo', when: 'A morning after the ending' },
    speakers: EXPANSION_E3_SPEAKERS,
    steps: [
      {
        id: 'e3-s1',
        goal: 'Feed a stray in the Hollow Below.',
        hint: 'Take fruit down. Strays wait in the nooks.',
        check: 'count:strayFed:>=1',
        scene: strays,
        done: straysDone,
      },
      {
        id: 'e3-s2',
        goal: 'Name two partners.',
        hint: 'The partners panel. Pick the two who wait for each other.',
        check: 'partners:set',
        scene: pair,
        done: pairDone,
      },
      {
        id: 'e3-s3',
        goal: 'Buy a length of twine.',
        hint: 'The stall sells it.',
        check: 'twine:>=1',
        scene: twine,
        done: twineDone,
      },
      {
        id: 'e3-s4',
        goal: 'Tie the twine: merge your partners.',
        hint: 'Both adults, both fond of you (affection 60), one twine.',
        check: 'merged',
        scene: merge,
        done: mergeDone,
      },
      {
        id: 'e3-s5',
        goal: 'Win the bracket in the dojo.',
        hint: 'Three wins after the bracket goes up. Merged counts.',
        check: 'karate:tournament',
        scene: tournament,
        done: tournamentDone,
      },
    ],
    complete,
    rewards: [
      {
        id: 'twine-champion',
        kind: 'title',
        label: 'Twine Champion',
        description: 'Two who agree beat ten who did not.',
      },
    ],
    sets: { e3Done: true },
    notes:
      'Steps 1–5 are met by the sim (autoOnly). Step 5 counts dojo wins since the bracket ' +
      'scene; e3-tournament-done-merged plays if a win came while merged. The e3-pair choice ' +
      '(e3-pick) changes no sim rule: "strong" plays e3-merge-done-strong, where the shape ' +
      'nearly pulls two ways and holds; the merge’s own affection rule is what refuses two ' +
      'who are not sure.',
  },
];

export const EXPANSION_E3_VARIANTS: Scene[] = [mergeDoneStrong, tournamentDoneMerged];
export const EXPANSION_E3_FLAGS: string[] = ['e3-pick', 'e3-wins-at', 'e3-merged-win', 'e3Done'];
export const EXPANSION_E3_CHECKS: string[] = [
  'count:strayFed:>=1',
  'partners:set',
  'twine:>=1',
  'merged',
  'karate:tournament',
];
