/**
 * Storyline SL3, "The Beetle Road" (plan G12): an expedition campaign in its own save
 * mode. A guard team to join, the Beetle Run (sim/tank.ts) through the cave domains of
 * the Hollow Below with a boss at each door, a careful, consented fusion of two Nubbins
 * into one (sim/fusion.ts), the quartermaster's errands, and a reveal about the valley's
 * "weather machine".
 *
 * AUDIENCE. 'main'.
 *
 * SOURCE. Digimon World 2 (2000): the guard teams, the tank, the domains, DNA fusion.
 * Mechanics only; every name, line and place is original.
 *
 * SPEAKERS. Hob, the guard's quartermaster; Ottoline Vane, the engineer who built the
 * machine. The team leader is whichever team the Keeper joins (Marina, Luna or Fern).
 *
 * BEATS. Between each chapter's opening and its goal: the banners, the leader's errands
 * (`count:missionDone`), the first stair and the torches, the Beetle's second run and the
 * third floor, the two partners, and chapter 8's look back at the fusion and the lever.
 * Each plays once, in order, only while its chapter is open.
 *
 * FLAGS. `b-boss-1`, `b-boss-2` (dojo wins in chapters 4 and 8), `b-torch` (left | kept:
 * fruit for whoever lights the torches), `b-fusion` (fused | refused), `b-machine`
 * (stop | keep), `b-vane` (stayed | left).
 */
import type { Line, LineGesture, Mood, Scene } from '../config/story';
import type { Speaker, Storyline, StorylineChapter } from './types';

const say =
  (who: string) =>
  (text: string, mood?: Mood, gesture?: LineGesture): Line => ({
    who,
    text,
    ...(mood ? { mood } : {}),
    ...(gesture ? { gesture } : {}),
  });

const N = say('narrator');
const Y = say('you');
const HOB = say('b-hob');
const VANE = say('b-vane');

export const BEETLE_SPEAKERS: Speaker[] = [
  { id: 'b-hob', name: 'Hob', kind: 'other' },
  { id: 'b-vane', name: 'Ottoline Vane', kind: 'other' },
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

export const BEETLE_CHAPTERS: StorylineChapter[] = [
  ch(
    1,
    'The Guard',
    {
      id: 'b-c1-open',
      lines: [
        N(
          'The guard house is a shed with ambitions. Three team banners hang on the wall: Dawn, Dusk and Dew.',
        ),
        N('Behind the counter sits a man who has counted everything in the room twice.'),
        HOB(
          'Hob. Quartermaster. You want down the Beetle Road, you want a team. Pick one, I don’t care which, they all owe me.',
          undefined,
          'shrug',
        ),
      ],
    },
    'team:joined',
    'Join a guard team.',
    'The guard panel. Dawn, Dusk or Dew: each has a leader and a colour.',
    {
      id: 'b-c1-close',
      lines: [
        HOB(
          'Good. Here’s your badge, it’s a bottle cap. Your leader will have errands. Errands are how you find out what the road wants.',
          undefined,
          'nod',
        ),
      ],
    },
    [
      {
        when: 'days:>=1',
        scene: {
          id: 'b-c1-banners',
          lines: [
            N(
              'Three banners. Dawn’s is gold and torn. Dusk’s is blue and mended. Dew’s is green and has, you think, been washed.',
            ),
            HOB(
              'Marina’s lot shout. Luna’s lot brood. Fern’s lot knit. Any of them gets you down the road.',
            ),
            HOB('None of them gets you back up. That’s the Beetle’s job, and mine.'),
          ],
        },
      },
      {
        when: 'days:>=3',
        scene: {
          id: 'b-c1-ledger',
          lines: [
            N(
              'Hob writes in a ledger while you decide. Every so often he reads a line back to himself and nods.',
            ),
            HOB(
              'Forty years of who went down and who came up. Same number in each column. I check it most mornings.',
            ),
          ],
        },
      },
    ],
  ),
  ch(
    2,
    'The Beetle',
    {
      id: 'b-c2-open',
      lines: [
        N(
          'Behind the guard house, under a tarp, the Beetle: a cart the size of a bath with a lamp on the front and a dent for every year it has run the cave.',
        ),
        HOB(
          'Three lanes, spores, loose rock, acid. Cargo fills, you come home. You hit a spore, you come home slower. Nobody has ever not come home.',
        ),
        HOB('Take it round once. The road wants to know your weight.'),
      ],
    },
    'tank:runs:>=1',
    'Take the Beetle through the cave once.',
    'The Beetle Run from the guard panel. Tap up or down to change lane.',
    {
      id: 'b-c2-close',
      lines: [
        N(
          'You come home with shells in the cargo and a spore stuck to the lamp. Hob peels it off and writes something in a ledger.',
        ),
        HOB(
          'That’ll do. The first domain’s under the lamp room. It has a door. The door has an opinion.',
          undefined,
          'nod',
        ),
      ],
    },
    [
      {
        when: 'days:>=1',
        scene: {
          id: 'b-c2-tarp',
          lines: [
            HOB('She was my father’s. He drove her thirty years and dented her twice.'),
            HOB(
              'I’ve dented her forty times and driven her ten. Draw your own conclusions, I’ve drawn mine.',
            ),
            N('He pats the dent nearest him. It is, you notice, the one he keeps polished.'),
          ],
        },
      },
      {
        when: 'count:missionDone:>=1',
        scene: {
          id: 'b-c2-errand',
          lines: [
            N(
              'Your leader’s first errand is small and particular: a message to the lamp room, a bag of nails, a look at the weather vane.',
            ),
            HOB(
              'Errand done? Good. Write it in the book. The book’s how the road knows you were here.',
            ),
            N('You write it. Your hand is the newest in forty years of hands.'),
          ],
        },
      },
    ],
  ),
  ch(
    3,
    'The First Domain',
    {
      id: 'b-c3-open',
      lines: [
        N(
          'The Hollow Below, by the guard’s stairs. The first domain is the second floor down: wider, wetter, with torches someone keeps lit and nobody admits to.',
        ),
        HOB('Get to the second floor and come back. I want the map before I want the door.'),
      ],
    },
    'hollow:best:>=2',
    'Reach the second floor of the Hollow Below.',
    'Take Nubbins down with you. The way down is at the far end of each floor.',
    {
      id: 'b-c3-close',
      lines: [
        N(
          'The second floor has a door in its far wall, iron, with a wheel on it and a drawing of a beetle scratched above the wheel.',
        ),
        HOB('Somebody drew that before the guard existed. Think about that and then don’t.'),
      ],
    },
    [
      {
        when: 'count:descended:>=1',
        scene: {
          id: 'b-c3-stair',
          lines: [
            N(
              'The first stair down. The air changes at the fourth step, the way it does in a cellar, and your Nubbins notice before you do.',
            ),
            N(
              'A torch burns in a bracket at the bottom. It has been lit recently. There is nobody here.',
            ),
          ],
        },
      },
      {
        when: 'hollow:runs:>=1',
        scene: {
          id: 'b-c3-back-up',
          lines: [
            HOB('First floor and back. That’s a map of the first floor. I want the second.'),
            HOB(
              'Go again. Take more fruit. The strays down there have opinions about the way down and they’ll trade them.',
            ),
          ],
        },
      },
      {
        when: 'count:strayFed:>=1',
        scene: {
          id: 'b-c3-torches',
          lines: [
            N(
              'A stray by one of the torches nobody admits to lighting. It eats, and then it goes and sits by the torch as if it had lit it.',
            ),
            N('You have one piece of fruit left.'),
          ],
          choices: [
            {
              id: 'left',
              label: 'Leave it by the torch, for whoever lights them.',
              set: { 'b-torch': 'left' },
              then: [
                N('You set it on the bracket. The stray watches you do it, and does not take it.'),
              ],
            },
            {
              id: 'kept',
              label: 'Keep it for the next stray.',
              set: { 'b-torch': 'kept' },
              then: [
                N(
                  'The next nook has a thinner one in it. It was the right call. It still felt like a choice.',
                ),
              ],
            },
          ],
        },
      },
    ],
  ),
  ch(
    4,
    'The Door’s Opinion',
    {
      id: 'b-c4-open',
      lines: [
        N(
          'Something keeps the first door. It is big and it is patient and it has been down there since the beetle was drawn.',
        ),
        HOB(
          'Bosses fight by the dojo rules, it’s the one thing the road’s fair about. Send your best. Win, and the wheel turns.',
        ),
      ],
    },
    'flag:b-boss-1',
    'Beat the keeper of the first door.',
    'A dojo win while this chapter is open counts as the door.',
    {
      id: 'b-c4-close',
      lines: [
        N(
          'The wheel turns. Beyond the door, a tunnel the Beetle could drive, sloping down into a draught that smells of rain.',
        ),
        HOB('Rain. Down there. Write that down, I’m not going to.'),
      ],
    },
    [
      {
        when: 'days:>=1',
        scene: {
          id: 'b-c4-wait',
          lines: [
            HOB('It’s not hurrying. It’s had four hundred years. You can have a day.'),
            N(
              'Your Nubbins train in the yard. The one you have in mind for the door knows it, and stands a little taller.',
            ),
          ],
        },
      },
      {
        when: 'count:missionDone:>=3',
        scene: {
          id: 'b-c4-errands',
          lines: [
            HOB('Three errands. The leader says you’re all right.'),
            HOB(
              'The leader says that about everyone and means it about four. Congratulations, you’re one of the four.',
            ),
          ],
        },
      },
    ],
  ),
  ch(
    5,
    'Two Into One',
    {
      id: 'b-c5-open',
      lines: [
        N(
          'A woman is sitting on the Beetle’s bonnet when you come up, swinging her boots, with a notebook older than the guard.',
        ),
        VANE(
          'Ottoline Vane. I built the thing under the second domain. Don’t look like that, everyone looks like that.',
        ),
        VANE(
          'The second door won’t open to two. It opens to one who used to be two. I know how that’s done, and I know what it costs, and I won’t tell you to.',
        ),
        VANE(
          'Two who are both certain of you, both grown, and you certain of them. Then they can agree to be one. One of them stops being a name. Think about it.',
        ),
      ],
    },
    'fused:>=1|flag:b-fusion:refused',
    'Decide about the fusion: join two partners into one, or refuse.',
    'The journal’s Fuse button needs two adult partners at full affection and high trust. The refusal is a choice, not a failure.',
    {
      id: 'b-c5-close',
      lines: [N('Vane closes the notebook. Whatever you decided, she writes nothing down.')],
    },
    [
      {
        when: 'fused:>=1',
        scene: {
          id: 'b-c5-fused',
          lines: [
            N(
              'They stand together. Then there is one, and it knows both names, and it answers to the one you kept.',
            ),
            VANE(
              'That’s the cost. It’s not nothing. Don’t let anyone tell you it was nothing.',
              'soft',
            ),
            Y('You say the other name once, out loud, so it has been said.'),
          ],
          set: { 'b-fusion': 'fused' },
        },
      },
      {
        when: 'act:refuse-the-fusion',
        scene: {
          id: 'b-c5-refused',
          lines: [
            Y('No. They stay two.'),
            VANE(
              'Good answer. Not the only one, but a good one. The second door has a side way, it’s narrower, and it’s the Beetle that fits it.',
              undefined,
              'nod',
            ),
          ],
          set: { 'b-fusion': 'refused' },
        },
      },
      {
        when: 'partners',
        scene: {
          id: 'b-c5-two',
          lines: [
            N(
              'Two names on the partner slots. They stand either side of you in the guard yard, which is how they always stand, you realise.',
            ),
            N('They have been waiting for you to notice.'),
            VANE('Don’t decide tonight. Nobody decides anything right sat on the Beetle’s bonnet.'),
          ],
        },
      },
      {
        when: 'days:>=2',
        scene: {
          id: 'b-c5-notebook',
          lines: [
            VANE(
              'I did it once. Two of mine, the year of the machine. I kept the name of the one who was louder.',
            ),
            VANE('I still catch myself calling it the other name. It still turns round.', 'soft'),
            HOB('She tells everyone that. It’s true every time.'),
          ],
        },
      },
    ],
  ),
  ch(
    6,
    'The Second Domain',
    {
      id: 'b-c6-open',
      lines: [
        HOB('Fourth floor. The Beetle goes in first, three times, to clear the slope. Then you.'),
        VANE(
          'There’s weather on the fourth floor. I’d say I’m sorry, but I was very young and it was a very good idea.',
          undefined,
          'chest',
        ),
      ],
    },
    'hollow:best:>=4&tank:runs:>=3',
    'Run the Beetle three times and reach the fourth floor.',
    'The Beetle clears the slope; the Hollow takes you down. Both count.',
    {
      id: 'b-c6-close',
      lines: [
        N(
          'The fourth floor rains. Underground, on a floor of stone, it rains, lightly and forever, out of a ceiling of pipes.',
        ),
      ],
    },
    [
      {
        when: 'tank:runs:>=2',
        scene: {
          id: 'b-c6-second-run',
          lines: [
            N('The second run goes down the new slope. The lamp finds rain before it finds rock.'),
            HOB('Wet cargo. Weighs more, worth the same. I’ll allow it.'),
          ],
        },
      },
      {
        when: 'hollow:best:>=3',
        scene: {
          id: 'b-c6-third-floor',
          lines: [
            N(
              'The third floor is a staircase pretending to be a floor. At the bottom of it, a sound like a roof in weather.',
            ),
            N(
              'Your Nubbins stop on the last step and listen, ears up, to rain they have never been under.',
            ),
          ],
        },
      },
      {
        when: 'hollow:best:>=3&flag:b-torch:left',
        scene: {
          id: 'b-c6-torch',
          lines: [
            N(
              'By the third-floor stair, a torch is lit, and beside it your fruit, eaten to the core, the core set down tidily on the bracket.',
            ),
            N('Whoever lights them says thank you the only way the Hollow allows.'),
          ],
        },
      },
    ],
  ),
  ch(
    7,
    'The Weather Machine',
    {
      id: 'b-c7-open',
      lines: [
        N(
          'In the middle of the fourth floor: a machine the size of the guard house, humming, with the valley’s whole weather in its gauges.',
        ),
        VANE(
          'I built it the year the crops failed. It has rained when the valley needed rain for forty years. It also kept this floor flooded and the lower ones dark.',
        ),
        VANE(
          'There’s a lever. Down stops it: real weather again, whatever that turns out to be. Leave it, and the valley keeps its guarantee and the Hollow keeps its rain.',
          undefined,
          'shrug',
        ),
        HOB('I’m not on the lever. I count things. Count this one yourself.', undefined, 'chest'),
      ],
      choices: [
        {
          id: 'stop',
          label: 'Pull the lever. Let the sky be the sky.',
          set: { 'b-machine': 'stop' },
          then: [VANE('Forty years. All right. All right.', 'soft')],
        },
        {
          id: 'keep',
          label: 'Leave it running.',
          set: { 'b-machine': 'keep' },
          then: [VANE('Thank you. I think. Ask me in another forty.')],
        },
      ],
    },
    'flag:b-machine',
    'Decide about the machine.',
    'The lever is the choice.',
    {
      id: 'b-c7-close',
      lines: [
        N(
          'Whatever you chose, something on the fourth floor has stopped waiting. The last door stands at the end of the rain.',
        ),
      ],
    },
  ),
  ch(
    8,
    'The Road Home',
    {
      id: 'b-c8-open',
      lines: [
        N('The last door’s keeper is older than the first and does not bother to be patient.'),
        HOB('Dojo rules. Same as before. Win, and the road’s the guard’s, top to bottom.'),
      ],
    },
    'flag:b-boss-2',
    'Beat the keeper of the last door.',
    'A dojo win while this chapter is open counts.',
    {
      id: 'b-c8-close',
      lines: [
        N(
          'The last wheel turns. The Beetle Road runs from the guard house to the bottom of the world, and you drove it.',
        ),
        VANE(
          'I’ll stay on the fourth floor a while. Someone should watch what the weather does next.',
          undefined,
          'chest',
        ),
      ],
      choices: [
        { id: 'stayed', label: 'Ask her to come up for a bit first.', set: { 'b-vane': 'stayed' } },
        { id: 'left', label: 'Leave her to the gauges.', set: { 'b-vane': 'left' } },
      ],
    },
    [
      {
        when: 'flag:b-machine:stop',
        scene: {
          id: 'b-c8-dry',
          lines: [
            N(
              'The rain on the fourth floor has stopped. The drips take a while to understand this.',
            ),
            VANE('Listen. That’s what forty years sounds like, finishing.'),
          ],
        },
      },
      {
        when: 'flag:b-machine:keep',
        scene: {
          id: 'b-c8-wet',
          lines: [
            N('The rain on the fourth floor goes on, light and even, out of its ceiling of pipes.'),
            VANE('I thought I’d mind. I find I’d mind more if it stopped. Don’t tell Hob.'),
            HOB('I counted that. I count everything.'),
          ],
        },
      },
      {
        when: 'flag:b-fusion:fused',
        scene: {
          id: 'b-c8-one',
          lines: [
            N(
              'The one who was two walks ahead of you to the last door, and stops, and waits, which both of them always did.',
            ),
            Y('You say both names, quietly. It turns round for both.'),
          ],
        },
      },
      {
        when: 'flag:b-fusion:refused',
        scene: {
          id: 'b-c8-two',
          lines: [
            N('Two of them at the last door, either side of you, in the way they always stand.'),
            VANE('Narrower way. Longer road. You got here all the same. Write that in Hob’s book.'),
          ],
        },
      },
    ],
  ),
];

export const BEETLE_ENDINGS: Record<string, { title: string; how: string }> = {
  'open-sky': {
    title: 'The Open Sky',
    how: 'Pull the lever on the weather machine and win the last door.',
  },
  'two-as-one': {
    title: 'Two As One',
    how: 'Pull the lever, having fused two partners into one along the road.',
  },
  'steady-rain': {
    title: 'Steady Rain',
    how: 'Leave the machine running and win the last door.',
  },
};

export const BEETLE_EXTRA: Scene[] = [
  {
    id: 'end-beetle-open-sky',
    lines: [
      N(
        'You come up the guard stairs into weather nobody ordered. Cloud, then not cloud, then a wind that smells of somewhere else.',
      ),
      HOB(
        'First real rain in forty years is due Thursday. I counted. I don’t know how, I just did.',
        undefined,
        'shrug',
      ),
      N('The Beetle Road: the Open Sky.'),
    ],
  },
  {
    id: 'end-beetle-two-as-one',
    lines: [
      N(
        'You come up the guard stairs into weather nobody ordered, with one partner who answers to one name and knows two.',
      ),
      VANE(
        'It kept both. I wasn’t sure it would. I’m glad I was wrong about one thing this year.',
        'soft',
      ),
      N('The Beetle Road: Two As One.'),
    ],
  },
  {
    id: 'end-beetle-steady-rain',
    lines: [
      N(
        'You come up the guard stairs into a light rain, on time, the way it has fallen for forty years. The valley does not know what it was spared.',
      ),
      HOB('Rain Thursday. Rain next Thursday. I like a Thursday I can count on.'),
      N('The Beetle Road: Steady Rain.'),
    ],
  },
];

export const STORYLINE_BEETLE: Storyline = {
  id: 'beetle',
  code: 'SL3',
  title: 'The Beetle Road',
  tagline: 'A guard team, a cart, two doors, and the weather.',
  source: 'Digimon World 2 (2000): mechanics only',
  audience: 'main',
  speakers: BEETLE_SPEAKERS,
  chapters: BEETLE_CHAPTERS,
  endings: BEETLE_ENDINGS,
  extra: BEETLE_EXTRA,
  notes:
    'Bosses are dojo wins while chapters 4 and 8 are open (the rule flags them). Fusion ' +
    'is the journal’s Fuse button on two partners (sim/fusion.ts); refusing is the Do-it. ' +
    'The errand beats count the guard’s missions (`count:missionDone`), which are never goals.',
};

export const STORYLINE_BEETLE_FLAGS: string[] = [
  'b-boss-1',
  'b-boss-2',
  'b-torch',
  'b-fusion',
  'b-machine',
  'b-vane',
];
export const STORYLINE_BEETLE_CHECKS: string[] = [
  ...BEETLE_CHAPTERS.map((c) => c.goal),
  ...BEETLE_CHAPTERS.flatMap((c) => (c.beats ?? []).map((b) => b.when)),
];
