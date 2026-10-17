/**
 * Storyline S4, "Dawn & Dusk" (plan G12): two mirrored short campaigns in the `dawndusk`
 * save mode, picked at the title (Dawn is the Sun Keepers’ half, Dusk the Moon Keepers’).
 * Each serves the four houses of the valley’s creatures through scan-and-convert
 * (sim/scans.ts, the Collection Book), climbs the dojo’s three rank tests, and solves the
 * reverting (sim/degeneration.ts) from its own angle. The other half unlocks on the title
 * once one has an ending; a half started with the other finished sees the whole day.
 *
 * AUDIENCE. 'main'.
 *
 * SOURCE. Digimon World: Dawn / Dusk (2007): the two-version frame, the species houses,
 * the tamer ranks, scan-and-convert, the degeneration mystery. Mechanics only.
 *
 * SPEAKERS. The Penhallow twins keep the houses: Marigold by day, Ash by night. Teodor
 * Vask runs the dojo on both halves.
 *
 * BEATS. Built into the template, so both halves breathe the same way: the other twin
 * (when their half is done), the Book’s first visitor and settler, the egg that must not
 * be hatched, the second page, Vask between belts, and the day after the cause. Each
 * plays once, in order, only while its chapter is open.
 *
 * FLAGS. `side`, `dd-other-done` (passed in by the title), `dd-reverted` (the Nubbin’s
 * id), `dd-cause` (the chosen cause), `dd-right` (whether it was the real one).
 */
import type { Line, Mood, Scene } from '../config/story';
import type { Speaker, Storyline, StorylineChapter } from './types';

const say =
  (who: string) =>
  (text: string, mood?: Mood): Line =>
    mood ? { who, text, mood } : { who, text };

const N = say('narrator');
const Y = say('you');
const VASK = say('d-vask');

export const DAWNDUSK_SPEAKERS: Speaker[] = [
  { id: 'd-marigold', name: 'Marigold Penhallow', kind: 'other' },
  { id: 'd-ash', name: 'Ash Penhallow', kind: 'other' },
  { id: 'd-vask', name: 'Teodor Vask', kind: 'other' },
];

export type Side = 'dawn' | 'dusk';

interface Half {
  id: Side;
  title: string;
  tagline: string;
  steward: string;
  stewardId: string;
  light: string;
  /** This half of the day, and the other twin. */
  half: 'day' | 'night';
  sibling: 'brother' | 'sister';
  siblingHe: 'he' | 'she';
  /** The real cause on this side, and the decoy. */
  right: { id: string; label: string; name: string };
  wrong: { id: string; label: string; name: string };
  /** What Vask found at the shrine, and what the other half found. */
  found: string;
  otherFound: string;
}

const HALVES: Record<Side, Half> = {
  dawn: {
    id: 'dawn',
    title: 'Dawn',
    tagline: 'The Sun Keepers’ half of one long day.',
    steward: 'Marigold',
    stewardId: 'd-marigold',
    light: 'first light',
    half: 'day',
    sibling: 'brother',
    siblingHe: 'he',
    right: {
      id: 'lamp',
      label: 'The shrine lamp. Its new glass throws light into the scanner.',
      name: 'the shrine lamp',
    },
    wrong: {
      id: 'scanner',
      label: 'The scanner itself. It was always going to do this.',
      name: 'the scanner',
    },
    found: 'The new lamp glass, and a scanner lens under it, cracked.',
    otherFound: 'bell',
  },
  dusk: {
    id: 'dusk',
    title: 'Dusk',
    tagline: 'The Moon Keepers’ half of one long day.',
    steward: 'Ash',
    stewardId: 'd-ash',
    light: 'last light',
    half: 'night',
    sibling: 'sister',
    siblingHe: 'she',
    right: {
      id: 'bell',
      label: 'The old bell. Someone has been ringing it at midnight.',
      name: 'the old bell',
    },
    wrong: {
      id: 'mist',
      label: 'The night mist. It comes off the pond and it always has.',
      name: 'the mist',
    },
    found: 'A rope on the old bell, new, and footprints that come at midnight.',
    otherFound: 'lamp',
  },
};

function makeHalf(h: Half): Storyline {
  const S = say(h.stewardId);
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
  const p = h.id;
  const Light = `${h.light[0]!.toUpperCase()}${h.light.slice(1)}`;
  const chapters: StorylineChapter[] = [
    ch(
      1,
      h.id === 'dawn' ? 'First Light' : 'Last Light',
      {
        id: `${p}-c1-open`,
        lines: [
          N(
            `You come into the valley at ${h.light}. Four houses stand round the green, each with a creature carved over its door: a flier, a runner, a swimmer, a thicket thing.`,
          ),
          S(
            `${h.steward} Penhallow. I keep the houses by ${h.half}; my ${h.sibling} keeps them the other half. We don’t overlap. We don’t agree, either.`,
          ),
          S('Hatch what you brought. The houses like a Keeper who has something to lose.'),
        ],
      },
      'stat:hatched:>=1',
      'Hatch an egg.',
      'Hold and shake it.',
      {
        id: `${p}-c1-close`,
        lines: [N('Hatched, and already looking at the four doors as if choosing one.')],
      },
      [
        {
          when: 'flag:dd-other-done',
          scene: {
            id: `${p}-c1-other`,
            lines: [
              S(
                `My ${h.sibling} finished ${h.siblingHe === 'he' ? 'his' : 'her'} half. Found a cause, fixed it, told me nothing, which is how I know it went well.`,
              ),
              S(
                'If you find the other half of it, we’ll have the whole day. We have never once had the whole day.',
              ),
              N(`${h.steward} looks at the green as if measuring it for something.`),
            ],
          },
        },
        {
          when: 'days:>=1',
          scene: {
            id: `${p}-c1-houses`,
            lines: [
              N(
                `The four houses are shut and their lamps are out. Over each door the carved creature has been touched smooth by years of hands.`,
              ),
              S(
                'They were full once. Each house kept its kind, and the kind kept the house. Then the Keepers stopped coming.',
              ),
              S(
                'I don’t blame them. The valley’s a long walk from anywhere, and the houses don’t pay.',
              ),
            ],
          },
        },
      ],
    ),
    ch(
      2,
      'The First House',
      {
        id: `${p}-c2-open`,
        lines: [
          S(
            'The houses are served by knowing their creatures. Meet one kind until the Book knows it whole. That’s a scan. The Book remembers what you kept company with.',
          ),
          S('The meadow house first. Finish a patch and the wild ones come to it.'),
        ],
      },
      'scans:full:>=1',
      'Fill one species’ scan in the Collection Book.',
      'Wild visitors scan on arrival and while they stay. A finished habitat patch brings them.',
      {
        id: `${p}-c2-close`,
        lines: [N('The Book closes on a page that is full. The meadow house lights its lamp.')],
      },
      [
        {
          when: 'count:wildArrived:>=1',
          scene: {
            id: `${p}-c2-visitor`,
            lines: [
              N(
                'A wild one at the meadow patch, at the edge of the finished grass. The Book warms in your pocket, which it has not done before.',
              ),
              S(
                'Stay near it. The Book learns by company. It’s the only honest way to learn anything.',
              ),
              N(
                'Your Nubbin goes and sits an arm’s length from the visitor, and the two of them ignore each other with great care.',
              ),
            ],
          },
        },
        {
          when: 'count:wildSettled:>=1',
          scene: {
            id: `${p}-c2-settled`,
            lines: [
              N(
                'The visitor stops visiting and starts living here. It picks a corner of the green and the corner is now its.',
              ),
              S(
                'The meadow house will take that one. They know which door. Nobody tells them and they know.',
              ),
            ],
          },
        },
        {
          when: 'days:>=2',
          scene: {
            id: `${p}-c2-book`,
            lines: [
              N(
                `You open the Book by ${h.light}. Pages and pages of creatures half-drawn, in two hands: one neat, one not.`,
              ),
              S(
                `The neat hand’s mine. The other is my ${h.sibling}’s. We’ve never once finished a page together.`,
              ),
            ],
          },
        },
      ],
    ),
    ch(
      3,
      'The Reverting',
      {
        id: `${p}-c3-open`,
        lines: [
          N(
            'Morning, or evening: one of yours is an egg. Not a new egg. Its own egg, with its own name still on it, and nothing in it that remembers walking.',
          ),
          S('It’s happening across the valley. Grown ones going back. Nobody knows why.', 'shock'),
          VASK('I might. I don’t talk to Keepers without a rank. Dojo. Yellow belt. Then we talk.'),
        ],
      },
      'karate:belt:>=1',
      'Win the dojo’s first rank test.',
      'Tier 1 in the dojo. A win earns the yellow belt.',
      {
        id: `${p}-c3-close`,
        lines: [
          VASK(
            'Yellow. Fine. It started the week the shrine was done up. That’s all I know and it’s more than Penhallow does.',
          ),
        ],
      },
      [
        {
          when: 'days:>=1',
          scene: {
            id: `${p}-c3-egg`,
            lines: [
              N(
                'The egg with the old name sits in the shade where it used to nap. You find yourself talking to it. It does not rock.',
              ),
              S(
                'Keep it warm. Don’t hatch it. If it hatches it’s a child, and whatever it was is gone for good.',
              ),
              S('I know you want to hold it. Hold it. Just don’t shake it.', 'soft'),
            ],
          },
        },
        {
          when: 'days:>=3',
          scene: {
            id: `${p}-c3-dojo`,
            lines: [
              N(
                'The dojo is a long room with a mat and a man who stands at the far end of it as if the room were his argument.',
              ),
              VASK('Yellow belt is a Keeper who turns up twice. Most don’t. Turn up twice.'),
            ],
          },
        },
      ],
    ),
    ch(
      4,
      'Two Houses More',
      {
        id: `${p}-c4-open`,
        lines: [
          S(
            'Two more houses, and this time convert a scan: the Book can turn a full page into an egg of that kind. That’s how the houses were filled the first time.',
          ),
        ],
      },
      'scans:full:>=1&count:converted:>=1',
      'Fill a second scan and convert one into an egg.',
      'The Collection Book’s Convert button on a full page; the roster needs room.',
      {
        id: `${p}-c4-close`,
        lines: [N('An egg from a page. Two lamps lit on the green.')],
      },
      [
        {
          when: 'scans:full:>=2',
          scene: {
            id: `${p}-c4-page`,
            lines: [
              N(
                'A second page fills. The Book is heavier than it was, which is not how books work.',
              ),
              S(
                'Now convert it. The page gives up a little of itself and you get an egg of the kind it knew. A fair trade.',
              ),
              S('The page doesn’t think so. Pages never do.'),
            ],
          },
        },
        {
          when: 'days:>=2',
          scene: {
            id: `${p}-c4-second-house`,
            lines: [
              N(
                `The second house is the ${h.half === 'day' ? 'runners’' : 'swimmers’'}, and its door has been shut so long the latch has grown into the frame.`,
              ),
              S(
                'I oil it every week. Forty years of oil and it still won’t give. It wants someone it knows on the other side.',
              ),
            ],
          },
        },
      ],
    ),
    ch(
      5,
      'The Second Rank',
      {
        id: `${p}-c5-open`,
        lines: [VASK('Green belt. Then I’ll show you what I found at the shrine.')],
      },
      'karate:belt:>=2',
      'Win the dojo’s second rank test.',
      'Tier 2.',
      {
        id: `${p}-c5-close`,
        lines: [VASK(`There. ${h.found}`)],
      },
      [
        {
          when: 'days:>=1',
          scene: {
            id: `${p}-c5-dojo`,
            lines: [
              VASK('You’re back. Most aren’t. Green belt is where the dojo stops being polite.'),
              VASK(
                'Your reverted one. Still an egg? Keep it so. I’ve seen the valley hatch them out of impatience and regret it.',
              ),
            ],
          },
        },
        {
          when: 'stat:evolved:>=1',
          scene: {
            id: `${p}-c5-grown`,
            lines: [
              N(
                'One of yours comes out of its cocoon grown, and the first thing it does is go and sit beside the egg with the old name on it.',
              ),
              S(
                'It remembers who that was. They do. It’s the one thing in the valley the reverting hasn’t touched.',
                'soft',
              ),
            ],
          },
        },
      ],
    ),
    ch(
      6,
      'The Cause',
      {
        id: `${p}-c6-open`,
        lines: [
          S(
            'So. Which is it. Say it, and we fix that one, and if you’re wrong we’ve fixed the wrong thing and the reverting goes on.',
          ),
          Y('You think about what Vask showed you.'),
        ],
        choices: [
          {
            id: h.right.id,
            label: h.right.label,
            set: { 'dd-cause': h.right.id, 'dd-right': true },
          },
          {
            id: h.wrong.id,
            label: h.wrong.label,
            set: { 'dd-cause': h.wrong.id, 'dd-right': false },
          },
        ],
      },
      'flag:dd-cause',
      'Name the cause.',
      'The choice is the goal.',
      {
        id: `${p}-c6-close`,
        lines: [N('Whatever you named, something is done about it before the half-day is out.')],
      },
      [
        {
          when: 'flag:dd-right:true',
          scene: {
            id: `${p}-c6-restored`,
            lines: [
              N(
                'The egg with the old name on it cracks from the inside, and what comes out is grown, and remembers walking, and comes straight to you.',
              ),
              S('That’s the one. That was the cause.', 'happy'),
            ],
          },
        },
        {
          when: 'flag:dd-right:false',
          scene: {
            id: `${p}-c6-wrong`,
            lines: [
              N(
                'The egg with the old name on it stays an egg, and hatches in its own time, small, with everything to learn again.',
              ),
              S('Not that one, then. Well. It will grow. They do.', 'sad'),
            ],
          },
        },
      ],
    ),
    ch(
      7,
      'The Whole Day',
      {
        id: `${p}-c7-open`,
        lines: [VASK('Black belt, and the valley is yours to keep, this half of it anyway.')],
      },
      'karate:belt:>=3',
      'Win the dojo’s last rank test.',
      'Tier 3.',
      {
        id: `${p}-c7-close`,
        lines: [
          N(
            `${Light} on the green. Four lamps, or most of them. The other half of the day belongs to someone else.`,
          ),
        ],
      },
      [
        {
          when: 'flag:dd-right:true',
          scene: {
            id: `${p}-c7-after-right`,
            lines: [
              S(
                `${h.right.name[0]!.toUpperCase()}${h.right.name.slice(1)}. Forty years of ${h.half} and I never once looked at it. Vask looked. You looked. I kept houses.`,
              ),
              S('Keeping houses is looking, I used to think. It’s only half of it.', 'soft'),
            ],
          },
        },
        {
          when: 'flag:dd-right:false',
          scene: {
            id: `${p}-c7-after-wrong`,
            lines: [
              S(
                `We fixed ${h.wrong.name}. The reverting goes on somewhere, slower. Somebody will find the real one.`,
              ),
              S(
                `Maybe my ${h.sibling}. ${h.siblingHe === 'he' ? 'He' : 'She'}’d like that. I’d let ${h.siblingHe === 'he' ? 'him' : 'her'}.`,
              ),
            ],
          },
        },
        {
          when: 'days:>=1',
          scene: {
            id: `${p}-c7-black`,
            lines: [
              VASK(
                'Black belt isn’t strength. It’s turning up when there’s nothing left to prove. Turn up.',
              ),
              N(
                'Your Nubbin, on the mat, bows the way it has seen you do it, which is badly, and with feeling.',
              ),
            ],
          },
        },
      ],
    ),
  ];
  return {
    id: h.id,
    code: 'S4',
    title: `Dawn & Dusk: ${h.title}`,
    tagline: h.tagline,
    source: 'Digimon World: Dawn / Dusk (2007): mechanics only',
    audience: 'main',
    speakers: DAWNDUSK_SPEAKERS,
    chapters,
    endings: {
      'half-day': {
        title: h.id === 'dawn' ? 'First Light' : 'Last Light',
        how: 'Name the real cause and win the black belt.',
      },
      'wrong-cause': {
        title: 'A Fixed Shadow',
        how: 'Name the wrong cause: the reverted one hatches small and grows again.',
      },
      'whole-day': {
        title: 'The Whole Day',
        how: 'Name the real cause on a half started after the other half reached an ending.',
      },
    },
    extra: [
      {
        id: `end-${p}-half-day`,
        lines: [
          N(
            `The green at ${h.light}, four lamps lit, and the reverted one asleep against your boot as if nothing had happened to it.`,
          ),
          S('Half a day. The other half’s not mine to tell.', 'soft'),
          N(`Dawn & Dusk: ${h.id === 'dawn' ? 'First Light' : 'Last Light'}.`),
        ],
      },
      {
        id: `end-${p}-wrong-cause`,
        lines: [
          N(
            'The green, four lamps lit, and a small one at your boot learning the grass again from the beginning.',
          ),
          S('We fixed a thing. Not the thing. The valley goes on. So does it.'),
          N('Dawn & Dusk: a Fixed Shadow.'),
        ],
      },
      {
        id: `end-${p}-whole-day`,
        lines: [
          N(
            `The green at ${h.light}. For once the twins are both on it, not overlapping, not agreeing, and the four lamps are lit on both sides.`,
          ),
          S(
            `${h.siblingHe === 'he' ? 'He' : 'She'} found the ${h.otherFound}. You found the ${h.right.id}. It took both halves. It usually does.`,
            'happy',
          ),
          N('Dawn & Dusk: the Whole Day.'),
        ],
      },
    ],
    notes:
      'Built from one template per half. The rule degenerates the oldest grown Nubbin when ' +
      'chapter 3 opens and restores it when the right cause is named, if it is still an egg. ' +
      'The `days:` beats are the story clock from the chapter’s start.',
  };
}

export const STORYLINE_DAWN: Storyline = makeHalf(HALVES.dawn);
export const STORYLINE_DUSK: Storyline = makeHalf(HALVES.dusk);
export const STORYLINE_DAWNDUSK_FLAGS: string[] = [
  'side',
  'dd-other-done',
  'dd-reverted',
  'dd-cause',
  'dd-right',
];
export const STORYLINE_DAWNDUSK_CHECKS: string[] = [
  ...STORYLINE_DAWN.chapters.map((c) => c.goal),
  ...STORYLINE_DAWN.chapters.flatMap((c) => (c.beats ?? []).map((b) => b.when)),
];
