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
  /** The real cause on this side, and the decoy. */
  right: { id: string; label: string };
  wrong: { id: string; label: string };
}

const HALVES: Record<Side, Half> = {
  dawn: {
    id: 'dawn',
    title: 'Dawn',
    tagline: 'The Sun Keepers’ half of one long day.',
    steward: 'Marigold',
    stewardId: 'd-marigold',
    light: 'first light',
    right: { id: 'lamp', label: 'The shrine lamp. Its new glass throws light into the scanner.' },
    wrong: { id: 'scanner', label: 'The scanner itself. It was always going to do this.' },
  },
  dusk: {
    id: 'dusk',
    title: 'Dusk',
    tagline: 'The Moon Keepers’ half of one long day.',
    steward: 'Ash',
    stewardId: 'd-ash',
    light: 'last light',
    right: { id: 'bell', label: 'The old bell. Someone has been ringing it at midnight.' },
    wrong: { id: 'mist', label: 'The night mist. It comes off the pond and it always has.' },
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
  const chapters: StorylineChapter[] = [
    ch(
      1,
      h.id === 'dawn' ? 'First Light' : 'Last Light',
      {
        id: `${p}-c1-open`,
        lines: [
          N(`You come into the valley at ${h.light}. Four houses stand round the green, each with a creature carved over its door: a flier, a runner, a swimmer, a thicket thing.`),
          S(`${h.steward} Penhallow. I keep the houses by ${h.id === 'dawn' ? 'day' : 'night'}; my ${h.id === 'dawn' ? 'brother' : 'sister'} keeps them the other half. We don’t overlap. We don’t agree, either.`),
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
    ),
    ch(
      2,
      'The First House',
      {
        id: `${p}-c2-open`,
        lines: [
          S('The houses are served by knowing their creatures. Meet one kind until the Book knows it whole. That’s a scan. The Book remembers what you kept company with.'),
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
    ),
    ch(
      3,
      'The Reverting',
      {
        id: `${p}-c3-open`,
        lines: [
          N('Morning, or evening: one of yours is an egg. Not a new egg. Its own egg, with its own name still on it, and nothing in it that remembers walking.'),
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
          VASK('Yellow. Fine. It started the week the shrine was done up. That’s all I know and it’s more than Penhallow does.'),
        ],
      },
    ),
    ch(
      4,
      'Two Houses More',
      {
        id: `${p}-c4-open`,
        lines: [
          S('Two more houses, and this time convert a scan: the Book can turn a full page into an egg of that kind. That’s how the houses were filled the first time.'),
        ],
      },
      'scans:full:>=1&count:converted:>=1',
      'Fill a second scan and convert one into an egg.',
      'The Collection Book’s Convert button on a full page; the roster needs room.',
      {
        id: `${p}-c4-close`,
        lines: [N('An egg from a page. Two lamps lit on the green.')],
      },
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
        lines: [
          VASK(`There. ${h.id === 'dawn' ? 'The new lamp glass, and a scanner lens under it, cracked.' : 'A rope on the old bell, new, and footprints that come at midnight.'}`),
        ],
      },
    ),
    ch(
      6,
      'The Cause',
      {
        id: `${p}-c6-open`,
        lines: [
          S('So. Which is it. Say it, and we fix that one, and if you’re wrong we’ve fixed the wrong thing and the reverting goes on.'),
          Y('You think about what Vask showed you.'),
        ],
        choices: [
          { id: h.right.id, label: h.right.label, set: { 'dd-cause': h.right.id, 'dd-right': true } },
          { id: h.wrong.id, label: h.wrong.label, set: { 'dd-cause': h.wrong.id, 'dd-right': false } },
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
              N('The egg with the old name on it cracks from the inside, and what comes out is grown, and remembers walking, and comes straight to you.'),
              S('That’s the one. That was the cause.', 'happy'),
            ],
          },
        },
        {
          when: 'flag:dd-right:false',
          scene: {
            id: `${p}-c6-wrong`,
            lines: [
              N('The egg with the old name on it stays an egg, and hatches in its own time, small, with everything to learn again.'),
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
          N(`${h.light[0]!.toUpperCase()}${h.light.slice(1)} on the green. Four lamps, or most of them. The other half of the day belongs to someone else.`),
        ],
      },
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
          N(`The green at ${h.light}, four lamps lit, and the reverted one asleep against your boot as if nothing had happened to it.`),
          S('Half a day. The other half’s not mine to tell.', 'soft'),
          N(`Dawn & Dusk: ${h.id === 'dawn' ? 'First Light' : 'Last Light'}.`),
        ],
      },
      {
        id: `end-${p}-wrong-cause`,
        lines: [
          N('The green, four lamps lit, and a small one at your boot learning the grass again from the beginning.'),
          S('We fixed a thing. Not the thing. The valley goes on. So does it.'),
          N('Dawn & Dusk: a Fixed Shadow.'),
        ],
      },
      {
        id: `end-${p}-whole-day`,
        lines: [
          N(`The green at ${h.light}. For once the twins are both on it, not overlapping, not agreeing, and the four lamps are lit on both sides.`),
          S(`${h.id === 'dawn' ? 'He' : 'She'} found the ${h.id === 'dawn' ? 'bell' : 'lamp'}. You found the ${h.right.id}. It took both halves. It usually does.`, 'happy'),
          N('Dawn & Dusk: the Whole Day.'),
        ],
      },
    ],
    notes:
      'Built from one template per half. The rule degenerates the oldest grown Nubbin when ' +
      'chapter 3 opens and restores it when the right cause is named, if it is still an egg.',
  };
}

export const STORYLINE_DAWN: Storyline = makeHalf(HALVES.dawn);
export const STORYLINE_DUSK: Storyline = makeHalf(HALVES.dusk);
export const STORYLINE_DAWNDUSK_FLAGS: string[] = ['side', 'dd-other-done', 'dd-reverted', 'dd-cause', 'dd-right'];
export const STORYLINE_DAWNDUSK_CHECKS: string[] = STORYLINE_DAWN.chapters.map((c) => c.goal);
