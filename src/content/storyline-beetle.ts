/**
 * Storyline S3, "The Beetle Road" (plan G12): an expedition campaign in its own save
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
 * FLAGS. `b-boss-1`, `b-boss-2` (dojo wins in chapters 4 and 8), `b-fusion`
 * (fused | refused), `b-machine` (stop | keep), `b-vane` (stayed | left).
 */
import type { Line, Mood, Scene } from '../config/story';
import type { Speaker, Storyline, StorylineChapter } from './types';

const say =
  (who: string) =>
  (text: string, mood?: Mood): Line =>
    mood ? { who, text, mood } : { who, text };

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
          'The guard house is a shed with ambitions. Three team banners on the wall, Dawn, Dusk and Dew, and a man behind a counter who has counted everything in the room twice.',
        ),
        HOB(
          'Hob. Quartermaster. You want down the Beetle Road, you want a team. Pick one, I don’t care which, they all owe me.',
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
        ),
      ],
    },
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
        ),
      ],
    },
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
            ),
          ],
          set: { 'b-fusion': 'refused' },
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
        ),
        HOB('I’m not on the lever. I count things. Count this one yourself.'),
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
        ),
      ],
      choices: [
        { id: 'stayed', label: 'Ask her to come up for a bit first.', set: { 'b-vane': 'stayed' } },
        { id: 'left', label: 'Leave her to the gauges.', set: { 'b-vane': 'left' } },
      ],
    },
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
  code: 'S3',
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
    'is the journal’s Fuse button on two partners (sim/fusion.ts); refusing is the Do-it.',
};

export const STORYLINE_BEETLE_FLAGS: string[] = [
  'b-boss-1',
  'b-boss-2',
  'b-fusion',
  'b-machine',
  'b-vane',
];
export const STORYLINE_BEETLE_CHECKS: string[] = BEETLE_CHAPTERS.map((c) => c.goal);
