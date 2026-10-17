/**
 * Storyline S1, "The Hundred Days" (plan G12): a single-partner campaign in its own save
 * mode. One egg, one life stretched to about fifteen real days (`Nubbin.spanScale`), a
 * ruined village in the valley, the Fold, to refill by winning over wild creatures across
 * six areas (sim/storyline-rules-hundred.ts maps them to places both renderers draw),
 * prosperity gating the story, care slips shaping the partner, and a Shadow colossus, the
 * Hush, at the mountain. The ending comes from the partner's final form and the Fold's
 * prosperity.
 *
 * AUDIENCE. 'main'.
 *
 * SOURCE. Digimon World (1999): the single partner, the town that refills, the final
 * threat. Mechanics only; every name, line and place here is original.
 *
 * SPEAKERS. Ida Brack, the last warden of the Fold; Sorrel, a tinker who comes back as
 * the Fold refills. The Keeper is whichever trainer was picked at the title.
 *
 * FLAGS. `partnerId` (set by the rule), `area`, `hush-wins-at`, `hush-beaten`,
 * `h-first-name` (how Ida took the news of the partner's name), `h-mill` (lit | left).
 */
import type { Line, Mood, Scene } from '../config/story';
import type { Speaker, Storyline, StorylineChapter } from './types';

const say =
  (who: string) =>
  (text: string, mood?: Mood): Line =>
    mood ? { who, text, mood } : { who, text };

const N = say('narrator');
const Y = say('you');
const IDA = say('h-ida');
const SORREL = say('h-sorrel');

export const HUNDRED_SPEAKERS: Speaker[] = [
  { id: 'h-ida', name: 'Ida Brack', kind: 'other' },
  { id: 'h-sorrel', name: 'Sorrel', kind: 'other' },
];

const ch = (
  n: number,
  title: string,
  opening: Scene,
  goal: string,
  goalText: string,
  hint: string,
  closing: Scene,
  beats?: StorylineChapter['beats'],
): StorylineChapter => ({
  n,
  title,
  opening,
  goal,
  goalText,
  hint,
  closing,
  ...(beats ? { beats } : {}),
});

export const HUNDRED_CHAPTERS: StorylineChapter[] = [
  ch(
    1,
    'One Egg',
    {
      id: 'h-c1-open',
      lines: [
        N(
          'The road into the valley ends at a gate with no fence either side of it. Past the gate, the Fold: roofs with the sky in them.',
        ),
        N(
          'An old woman sits on the one whole step with a broom across her knees. She looks at the egg under your arm before she looks at you.',
        ),
        IDA(
          'One, is it. That’s how it starts. One egg and a hundred days to see what it comes to.',
        ),
        IDA('I’m Ida. I stayed. Hatch it where I can see, I like to know who I’m feeding.'),
      ],
    },
    'stat:hatched:>=1',
    'Hatch your one egg.',
    'Hold it and shake it to hurry it along. There is nothing else to hatch.',
    {
      id: 'h-c1-close',
      lines: [
        N(
          'The shell goes. Something small blinks at the ruined square as if it were a palace, and at you as if you built it.',
        ),
        IDA('Name it. I’ll not call it “the egg” for a hundred days.'),
      ],
      choices: [
        { id: 'quick', label: 'Say the first name that comes.', set: { 'h-first-name': 'quick' } },
        { id: 'slow', label: 'Take a while over it.', set: { 'h-first-name': 'slow' } },
      ],
    },
  ),
  ch(
    2,
    'The Fold',
    {
      id: 'h-c2-open',
      lines: [
        IDA(
          'Sixty of us, once. A mill, a bathhouse, a dojo I never went in. Then the cold year, and then the leaving.',
        ),
        IDA(
          'Creatures still come to the meadow. Wild ones. Win one over and it stays, and a stayed thing is a house with a light in it.',
        ),
        N('She hands you the broom, which is a kind of oath.'),
      ],
    },
    'recruits:>=1',
    'Win over one wild creature so it moves into the Fold.',
    'Wild visitors come to a finished patch. Feed one, or let it visit three times, and it settles.',
    {
      id: 'h-c2-close',
      lines: [
        N(
          'The first one moves into the square and chooses a doorway. Ida sweeps the step in front of it, which she has not done for anyone in years.',
        ),
        IDA(
          'Two of us, then. Three, counting yours. The Fold’s not a ruin at three. It’s a small village.',
        ),
      ],
    },
  ),
  ch(
    3,
    'Meadow Days',
    {
      id: 'h-c3-open',
      lines: [
        N(
          'Mornings in the meadow. Your partner learns the grass, the fruit trees, the one puddle it will not walk round.',
        ),
        IDA(
          'Every day you miss a feed, it shows. Not now. Later, when it grows. I’ve seen it go both ways.',
        ),
        IDA('One more for the square and I’ll show you the shore.'),
      ],
    },
    'recruits:>=2',
    'Win over a second creature.',
    'The meadow brings the fliers and the plain ones. Keep your partner fed while you wait.',
    {
      id: 'h-c3-close',
      lines: [
        N(
          'Two in the square. One has found the well and sits on its lip all day, pleased with the echo.',
        ),
        IDA('Shore’s that way. Mind the mud, it remembers feet.'),
      ],
    },
  ),
  ch(
    4,
    'The Shore',
    {
      id: 'h-c4-open',
      lines: [
        N(
          'The shore is a line of grey sand and a jetty with one plank in five. Swimmers come here, Ida says, when nobody is looking.',
        ),
        IDA('Go down and stand still a while. They don’t come to walking people.'),
      ],
    },
    'area:shore&recruits:>=3',
    'Go to the shore and win over a swimmer for the Fold.',
    'The journal’s Where To takes you there. A swimmer visits once you are standing on the sand.',
    {
      id: 'h-c4-close',
      lines: [
        N(
          'A swimmer follows you up from the shore with the walk of something that has never had legs for long. It takes the house nearest the well.',
        ),
        IDA(
          'Three. The bathhouse wants a fourth before it’ll steam. Don’t ask me why, I don’t make the rules, I only kept them.',
        ),
      ],
    },
    [
      {
        when: 'area:shore',
        scene: {
          id: 'h-c4-sand',
          lines: [
            N(
              'Sand under your boots, and under your partner’s feet, which it inspects one at a time.',
            ),
            N('Out past the jetty something rolls over in the water and looks back.'),
          ],
        },
      },
    ],
  ),
  ch(
    5,
    'The Cave',
    {
      id: 'h-c5-open',
      lines: [
        N(
          'A man is sitting on the well lip beside the swimmer, mending a kettle that was not his. He stands when he sees you.',
        ),
        SORREL(
          'Sorrel. Tinker. I heard the square had lights again and I don’t believe things till I’ve mended something in them.',
        ),
        SORREL(
          'There’s a cave under the east hill. Things down there nobody’s fed in years. Go down, come back. I want to know if the stairs hold.',
        ),
      ],
    },
    'hollow:runs:>=1',
    'Go down into the cave and come back up.',
    'Where To: the cave. Take fruit for the strays. Come back up when you like.',
    {
      id: 'h-c5-close',
      lines: [
        N(
          'The stairs hold. You come up with dust in your hair and your partner carrying a shell it will not put down.',
        ),
        SORREL('Stairs hold. Good. I’ll stay a bit, then.'),
        N('Sorrel takes a roof with a hole in it and starts, that evening, on the hole.'),
      ],
    },
  ),
  ch(
    6,
    'Grown',
    {
      id: 'h-c6-open',
      lines: [
        IDA('It’s nearly there. You can see it in how it stands. A few more days and the cocoon.'),
        IDA(
          'What comes out is the days you gave it. I’m not telling you off. I’m telling you the clock.',
        ),
      ],
    },
    'partner:adult',
    'Raise your partner through the cocoon.',
    'A child evolves at the end of its childhood. Its care slips and its type lean decide the adult.',
    {
      id: 'h-c6-close',
      lines: [
        N(
          'The cocoon splits. What steps out is bigger and sure of itself, and comes straight to you to be told it is still the same.',
        ),
        IDA('There it is, then. That’s the one that sees the hundredth day.', 'soft'),
      ],
    },
  ),
  ch(
    7,
    'The Mire',
    {
      id: 'h-c7-open',
      lines: [
        SORREL(
          'West of the Fold is the mire. It rains there when it rains nowhere else. The thicket creatures like it. Nobody else does.',
        ),
        SORREL(
          'Two more for the square and the mill will want looking at. I can’t mend a mill alone.',
        ),
      ],
    },
    'area:mire&recruits:>=5',
    'Go to the mire and bring the Fold to five.',
    'Where To: the mire. It rains. Thicket creatures visit while you are there.',
    {
      id: 'h-c7-close',
      lines: [
        N(
          'Five in the square. The mire’s two sit under Sorrel’s mended roof and drip on the floor, and he says nothing, which is his way of saying welcome.',
        ),
      ],
    },
  ),
  ch(
    8,
    'The Mill',
    {
      id: 'h-c8-open',
      lines: [
        N(
          'The old mill stands over the stream with its wheel stopped at a quarter past something. Sorrel walks round it twice before he speaks.',
        ),
        SORREL(
          'It’ll turn. The square has to be worth turning it for. Fill the Fold till the bathhouse steams, and I’ll lift the brake.',
        ),
        IDA('Sixty of us, that wheel fed. Don’t go for sixty. Go for enough.'),
      ],
    },
    'area:mill&prosperity:>=60',
    'Fill the Fold until the bathhouse steams, then go to the mill.',
    'Prosperity 60 opens the bathhouse. Where To: the old mill.',
    {
      id: 'h-c8-close',
      lines: [
        N(
          'The brake lifts. The wheel moves a quarter inch, thinks about it, and turns. Water on wood: the sound the valley lost.',
        ),
        SORREL(
          'Light the lamp in the loft, or leave it. The loft lamp’s the one the mountain sees.',
        ),
      ],
      choices: [
        { id: 'lit', label: 'Light the loft lamp.', set: { 'h-mill': 'lit' } },
        { id: 'left', label: 'Leave it dark.', set: { 'h-mill': 'left' } },
      ],
    },
  ),
  ch(
    9,
    'The Hush',
    {
      id: 'h-c9-open',
      lines: [
        N(
          'It comes down the mountain the night the wheel turns: a shape made of every quiet the valley kept. The Hush. Where it walks, lamps go out.',
        ),
        IDA('That’s what emptied us. Not cold. That. It eats what nobody minds.'),
        SORREL('It can be fought. Something has to stand in front of it and not be quiet.'),
        Y('You look at your partner. Your partner looks up the mountain, and does not look away.'),
      ],
    },
    'flag:hush-beaten',
    'Face the Hush with your partner and win.',
    'Where To: the mountain. The dojo bout at the top is the Hush. Stamina and Power carry it.',
    {
      id: 'h-c9-close',
      lines: [
        N(
          'It breaks like fog breaks, not all at once, and then all at once. Where it stood, the mountain path, and the Fold’s lamps lit below it one by one.',
        ),
        IDA('Nobody stood in front of it last time. I did. I was eleven.', 'sad'),
        IDA('You can put that broom down now.', 'soft'),
      ],
    },
    [
      {
        when: 'area:mountain',
        scene: {
          id: 'h-c9-mountain',
          lines: [
            N(
              'The mountain path is cold and the cold is listening. Your partner walks ahead of you for the first time in a hundred days.',
            ),
          ],
        },
      },
    ],
  ),
  ch(
    10,
    'The Hundredth Day',
    {
      id: 'h-c10-open',
      lines: [
        N(
          'The last morning. The wheel turns, the bathhouse steams, and something is sitting on every doorstep of the Fold.',
        ),
        IDA('A hundred days. Sit a while. Let it be a day before it’s the last one.'),
      ],
    },
    'days:>=1',
    'Let the hundredth day pass.',
    'Nothing to do. Sit with your partner. The day turns on its own.',
    {
      id: 'h-c10-close',
      lines: [
        N(
          'Dusk. Your partner leans against your knee, the weight of a hundred days, and the Fold lights its lamps without being asked.',
        ),
      ],
    },
  ),
];

export const HUNDRED_ENDINGS: Record<string, { title: string; how: string }> = {
  'bright-fold': {
    title: 'The Bright Fold',
    how: 'Fill the Fold to a standing festival, and raise a partner without a moody evolution.',
  },
  'the-fold': {
    title: 'The Fold',
    how: 'Reach the hundredth day with the bathhouse steaming.',
  },
  'quiet-fold': {
    title: 'The Quiet Fold',
    how: 'Reach the hundredth day with the Fold still half empty.',
  },
  'grey-fold': {
    title: 'A Grey Lamp',
    how: 'Reach the hundredth day with a partner the care slips made moody.',
  },
};

export const HUNDRED_EXTRA: Scene[] = [
  {
    id: 'end-hundred-bright-fold',
    lines: [
      N(
        'Bunting on the mill. A festival on the square. Sorrel has mended a drum and is wrong about how to play it.',
      ),
      IDA('Sixty, once. I counted this morning. We’re past sixty.', 'happy'),
      N(
        'Your partner sleeps through the whole festival on the warm step, and nobody will wake it, and nobody needs to.',
      ),
      N('The Hundred Days: the Bright Fold.'),
    ],
  },
  {
    id: 'end-hundred-the-fold',
    lines: [
      N(
        'The bathhouse steams. The wheel turns. Not sixty, but enough, and enough was what Ida asked for.',
      ),
      IDA('That’ll do. That’s the Fold. It was never more than that at its best.', 'soft'),
      N('The Hundred Days: the Fold.'),
    ],
  },
  {
    id: 'end-hundred-quiet-fold',
    lines: [
      N(
        'Half the doorsteps have someone on them. Half the Fold is still sky in the roofs. Ida sweeps the whole square anyway.',
      ),
      IDA('Quiet’s not empty. Quiet’s a start. Somebody else will come with one egg.'),
      N('The Hundred Days: the Quiet Fold.'),
    ],
  },
  {
    id: 'end-hundred-grey-fold',
    lines: [
      N(
        'Your partner sits apart on the last evening, the way it has since the cocoon, and watches the lamps with the face the missed days gave it.',
      ),
      IDA(
        'It stood in front of the Hush all the same. Grumpy doesn’t mean it didn’t love you. Ask me how I know.',
        'sad',
      ),
      N('You sit down beside it. After a while it leans.'),
      N('The Hundred Days: a Grey Lamp.'),
    ],
  },
];

export const STORYLINE_HUNDRED: Storyline = {
  id: 'hundred',
  code: 'S1',
  title: 'The Hundred Days',
  tagline: 'One egg. One life. A village to fill.',
  source: 'Digimon World (1999): mechanics only',
  audience: 'main',
  speakers: HUNDRED_SPEAKERS,
  chapters: HUNDRED_CHAPTERS,
  endings: HUNDRED_ENDINGS,
  extra: HUNDRED_EXTRA,
  notes:
    'Areas: meadow, shore, cave, mountain, mire, mill (STORYLINE_TEXT.areas). The rule maps ' +
    'them to the Grove, the Hollow run, the story Hollow set and Corvin’s garden with rain. ' +
    'The Hush is the dojo bout fought in chapter 9.',
};

export const STORYLINE_HUNDRED_FLAGS: string[] = [
  'partnerId',
  'area',
  'h-first-name',
  'h-mill',
  'hush-wins-at',
  'hush-beaten',
];
export const STORYLINE_HUNDRED_CHECKS: string[] = HUNDRED_CHAPTERS.map((c) => c.goal);
