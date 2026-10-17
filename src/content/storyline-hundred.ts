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
 * BEATS. Each chapter has scenes between its opening and its goal, keyed on what the
 * player does (a visitor fed, a care slip, the first stair down) or on the story clock
 * (`days:` counts from the chapter's start; a story day is two minutes at ×1). They play
 * once each, in order, and only while the chapter is open.
 *
 * FLAGS. `partnerId` (set by the rule), `area`, `hush-wins-at`, `hush-beaten`,
 * `h-first-name` (how Ida took the news of the partner's name), `h-mill` (lit | left),
 * `h-drawing` (ida | box: what became of the drawing in the cave chest).
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
    [
      {
        when: 'days:>=1',
        scene: {
          id: 'h-c1-wait',
          lines: [
            N(
              'The egg is warm and slow about it. Ida watches you turn it, and watches the road, in about equal measure.',
            ),
            IDA('Shaking helps. Not too much. You want it keen, not seasick.'),
            IDA(
              'I had one once. Before the leaving. You don’t ask what came of it and I don’t tell you, and that’s us getting on.',
            ),
          ],
        },
      },
      {
        when: 'days:>=3',
        scene: {
          id: 'h-c1-step',
          lines: [
            IDA(
              'The step you’re sat on was the bakery. The one with the hole was the school. I taught in it, nine years.',
            ),
            N('She says it to the egg, not to you. The egg, for its part, rocks once.'),
            IDA('Nine years and not one of them could spell “February”. I miss every one.', 'soft'),
          ],
        },
      },
    ],
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
    [
      {
        when: 'count:wildArrived:>=1',
        scene: {
          id: 'h-c2-visitor',
          lines: [
            N(
              'Something wild comes to the edge of the meadow and stops where the grass goes long. It looks at your partner, not at you.',
            ),
            IDA('Don’t go to it. Let it come. Put fruit down and look at something else.'),
            N(
              'You look at the sky. Your partner looks straight at it, which is apparently allowed.',
            ),
          ],
        },
      },
      {
        when: 'count:wildFed:>=1',
        scene: {
          id: 'h-c2-fed',
          lines: [
            N('It takes the fruit from the ground, and then, after a long think, from your hand.'),
            IDA(
              'There. A few more visits like that and it’ll pick a doorway. They always pick the worst one.',
            ),
          ],
        },
      },
      {
        when: 'partner:slips:>=1',
        scene: {
          id: 'h-c2-slip',
          lines: [
            N(
              'A morning you are late with the fruit. Your partner sits by the empty bowl and does not cry, which is worse.',
            ),
            IDA('That’s one. I’m not counting. It is.'),
            N('You feed it. It eats as if nothing happened, and remembers anyway.'),
          ],
        },
      },
    ],
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
    [
      {
        when: 'count:wildArrived:>=2',
        scene: {
          id: 'h-c3-second',
          lines: [
            N(
              'A second wild one, a flier, lands on the post that has no fence and folds its wings as if it owned the post.',
            ),
            IDA(
              'That one’s particular. Feed it twice before it believes you. Three times before it believes me.',
            ),
          ],
        },
      },
      {
        when: 'partner:affection:>=30',
        scene: {
          id: 'h-c3-fond',
          lines: [
            N(
              'Your partner has started waiting at the gate with no fence, in the exact spot it last saw you.',
            ),
            IDA('That’s fondness. It’s cheap to earn and dear to keep. Keep it.'),
          ],
        },
      },
      {
        when: 'days:>=3',
        scene: {
          id: 'h-c3-evening',
          lines: [
            N(
              'Evening in the Fold. Ida lights one lamp, the only one, and sets it in the window that still has glass.',
            ),
            IDA(
              'One lamp. When there were sixty I thought it was too bright. I’d have it too bright again.',
            ),
            N('Your partner falls asleep against the broom. Ida does not move the broom.'),
          ],
        },
      },
    ],
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
      {
        when: 'area:shore&partner:happiness:>=60',
        scene: {
          id: 'h-c4-paddle',
          lines: [
            N(
              'Your partner goes into the shallows up to the knees, stops, and looks back at you with the face of something that has discovered water.',
            ),
            N(
              'It stays there until the sea comes up a hand’s width and makes the decision for it.',
            ),
          ],
        },
      },
      {
        when: 'area:shore&count:wildFed:>=3',
        scene: {
          id: 'h-c4-jetty',
          lines: [
            N(
              'The swimmer eats from the jetty, one plank over from you, and then from the water, which is cheating.',
            ),
            N(
              'Ida, up on the dune where the mud cannot reach her, nods once as if a sum had come out.',
            ),
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
    [
      {
        when: 'count:descended:>=1',
        scene: {
          id: 'h-c5-stairs',
          lines: [
            N(
              'The stairs go down into a cold that smells of iron. Your partner takes them one at a time and counts them, you are fairly sure.',
            ),
            N('Somewhere below, something drops a shell on stone and listens to it.'),
          ],
        },
      },
      {
        when: 'count:strayFed:>=1',
        scene: {
          id: 'h-c5-stray',
          lines: [
            N(
              'A stray in a nook, thin, with the look of a thing that was somebody’s once. It takes the fruit without coming out.',
            ),
            N(
              'Your partner sits down outside the nook and waits, and after a while the stray eats where it can be seen.',
            ),
          ],
        },
      },
      {
        when: 'count:chestOpened:>=1',
        scene: {
          id: 'h-c5-chest',
          lines: [
            N(
              'A box under the third stair, shut for years. Shells in it, and a child’s drawing of a village with all its roofs on.',
            ),
            N('Sixty-odd houses, counted carefully, and a lamp in every window, drawn as a dot.'),
          ],
          choices: [
            {
              id: 'ida',
              label: 'Take the drawing up for Ida.',
              set: { 'h-drawing': 'ida' },
              then: [Y('She’ll know whose it was. She knew all of them.')],
            },
            {
              id: 'box',
              label: 'Leave it in the box, where it was kept.',
              set: { 'h-drawing': 'box' },
              then: [N('You put the lid back on. Some things are kept by being left.')],
            },
          ],
        },
      },
    ],
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
    [
      {
        when: 'partner:trust:>=40',
        scene: {
          id: 'h-c6-trust',
          lines: [
            N(
              'It brings you things now. A stone. The kettle lid. Once, with great ceremony, a beetle, alive, which you give back.',
            ),
            IDA('That’s trust. It thinks you need looking after. It’s not wrong.'),
          ],
        },
      },
      {
        when: 'partner:slips:>=3',
        scene: {
          id: 'h-c6-slips',
          lines: [
            IDA(
              'Three times it’s gone without. I said I wasn’t counting. I lied, I count everything, it’s what’s left of teaching.',
            ),
            IDA(
              'It’ll come up grumpy if this goes on. Grumpy’s not the end. It’s a lamp with a dirty glass.',
            ),
            N(
              'Your partner, hearing its name in her voice, comes and leans on her boot. She lets it.',
            ),
          ],
        },
      },
      {
        when: 'partner:stage:cocoon',
        scene: {
          id: 'h-c6-cocoon',
          lines: [
            N(
              'It stops in the middle of the square one afternoon and goes still, and a shell of light closes round it like a held breath.',
            ),
            IDA(
              'Don’t touch it. Sit. It’s doing the hardest thing it’ll ever do and it can’t see you.',
            ),
            N(
              'You sit. Sorrel comes out of his roof and sits too, with the kettle, for something to hold.',
            ),
          ],
        },
      },
    ],
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
    [
      {
        when: 'area:mire',
        scene: {
          id: 'h-c7-rain',
          lines: [
            N(
              'The mire. Rain on reed and black water, and a path that is only a path if you believe in it.',
            ),
            N(
              'Your partner, grown, walks it as if it had been here before. Perhaps the mire is in all of them.',
            ),
          ],
        },
      },
      {
        when: 'recruits:>=4',
        scene: {
          id: 'h-c7-four',
          lines: [
            N(
              'Four. The fourth is a thicket thing with its ears full of rain, and it moves into the house with the best roof as if it had booked it.',
            ),
            SORREL('That’s my roof. That’s the roof I mended.'),
            N('He looks at the thicket thing. The thicket thing drips.'),
            SORREL('Fine. Fine. There’s a hole in the one next door.'),
          ],
        },
      },
    ],
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
    [
      {
        when: 'area:mill',
        scene: {
          id: 'h-c8-wheel',
          lines: [
            N(
              'Close to, the wheel is taller than the house. Moss on the paddles, a nest in the hub, the brake rusted the colour of the stream.',
            ),
            SORREL('Don’t pull that. I mean it. It’s not the lever, it’s what it’s holding back.'),
          ],
        },
      },
      {
        when: 'prosperity:>=20',
        scene: {
          id: 'h-c8-stall',
          lines: [
            N(
              'A stall on the square: a trestle, four kinds of fruit, and nobody to take your shells but a box.',
            ),
            IDA(
              'Honesty box. There was one before. It was the last thing to go and the first thing I put back.',
            ),
          ],
        },
      },
      {
        when: 'prosperity:>=40',
        scene: {
          id: 'h-c8-yard',
          lines: [
            N(
              'Somebody has cleared the yard behind the bathhouse: a lane, a beam, a bar. The square’s creatures queue for it at dawn.',
            ),
            SORREL('I didn’t do that. I was going to. I’d like to know who beat me to it.'),
            N('Ida, sweeping, does not look up, and does not stop looking pleased.'),
          ],
        },
      },
    ],
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
      {
        when: 'area:mountain&flag:h-mill:lit',
        scene: {
          id: 'h-c9-lamp-lit',
          lines: [
            N(
              'Far below, the loft lamp. One light in the whole dark valley, and the thing on the path turns its head toward it.',
            ),
            Y('You lit it. Whatever comes down now comes down to a lit house.'),
            N('Your partner stops between the Hush and the lamp, and plants its feet.'),
          ],
        },
      },
      {
        when: 'area:mountain&flag:h-mill:left',
        scene: {
          id: 'h-c9-lamp-left',
          lines: [
            N(
              'Below, the Fold is dark. You chose that: nothing to draw it down. So it walks the mountain with no light to go toward, and goes toward you.',
            ),
            N('Your partner steps in front. It is not quiet. It has never once been quiet.'),
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
    [
      {
        when: 'flag:h-first-name:quick',
        scene: {
          id: 'h-c10-name-quick',
          lines: [
            IDA(
              'You named it in a breath. I thought, that’s a child who’ll lose interest by Tuesday.',
            ),
            IDA('I was wrong, and I’m glad to say so. I don’t often get the chance.', 'soft'),
          ],
        },
      },
      {
        when: 'flag:h-first-name:slow',
        scene: {
          id: 'h-c10-name-slow',
          lines: [
            IDA(
              'You took an hour over the name. I thought, that’s one who’ll fuss over everything.',
            ),
            IDA('You did. Look where fussing got us.', 'soft'),
          ],
        },
      },
      {
        when: 'flag:h-drawing:ida',
        scene: {
          id: 'h-c10-drawing-ida',
          lines: [
            N(
              'The drawing from the cave is pinned inside Ida’s window, beside the lamp. Sixty-odd roofs, every window a dot.',
            ),
            IDA(
              'Tam drew that. Year before the cold. I set it out this morning and counted. We’re short a few roofs.',
            ),
            IDA('Short’s not the same as missing. I had to be old to learn that.'),
          ],
        },
      },
      {
        when: 'flag:h-drawing:box',
        scene: {
          id: 'h-c10-drawing-box',
          lines: [
            N(
              'Under the third stair in the cave, in a box you shut, a drawing of a village with all its roofs on.',
            ),
            N(
              'It is wrong now by only a few roofs. You find you are glad nobody but you knows that.',
            ),
          ],
        },
      },
      {
        when: 'partner:moody',
        scene: {
          id: 'h-c10-moody',
          lines: [
            N(
              'Your partner sits on the far side of the square from the others, as it has since the cocoon, and watches you with its grey face.',
            ),
            IDA(
              'It came up the way the days made it. So did I. Go and sit with it. That’s the whole method.',
            ),
          ],
        },
      },
    ],
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
    'The Hush is the dojo bout fought in chapter 9. Beats key on the storyline counters; the ' +
    '`days:` ones are the story clock from the chapter’s start.',
};

export const STORYLINE_HUNDRED_FLAGS: string[] = [
  'partnerId',
  'area',
  'h-first-name',
  'h-mill',
  'h-drawing',
  'hush-wins-at',
  'hush-beaten',
];
export const STORYLINE_HUNDRED_CHECKS: string[] = [
  ...HUNDRED_CHAPTERS.map((c) => c.goal),
  ...HUNDRED_CHAPTERS.flatMap((c) => (c.beats ?? []).map((b) => b.when)),
];
