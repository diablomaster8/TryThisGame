/**
 * World traces (WORLD-26): small things in each region that remember Hazel and the old
 * history, for anyone who stops to look. Each is a tappable prop with one or two narrator
 * lines; children just see something pretty, adults find the deeper register. Tapping one
 * sets `trace:<id>` on the campaign's flags (`sim/regions-trace.ts`), which a later chapter
 * may read for an optional payoff; nothing ever requires one.
 *
 * Audience 'all': every trace reaches the Learning Grove, so each has `childLines` keyed
 * `"<trace id>#<line index>"`, plainer and gentler where the line leans on the old sorrow.
 * Positions are region-local; the Grove's and the Wood's are placed, the rest wait for their
 * layouts. Canon checked against docs/canon.md: Briar's flower is the first on the hill, by
 * the big stone, and nothing there is older than it; Moss and young Hazel's winter is never
 * placed, so the Wood's seat only hints.
 */
import type { Line } from '../config/story';
import type { RegionId } from '../config/regions';

export interface WorldTrace {
  id: string;
  region: RegionId;
  /** Region-local spot, once the region is laid out. */
  at?: { x: number; z: number };
  lines: Line[];
  childLines: Record<string, string>;
}

export const WORLD_TRACES: WorldTrace[] = [
  // The Grove
  {
    id: 'grove-first-flower',
    region: 'grove',
    at: { x: -14, z: 15 },
    lines: [
      { who: 'narrator', text: 'The first flower on the hill grows by the big stone. Its petals lean toward the cottage.' },
      { who: 'narrator', text: 'Somebody keeps the moss off the stone. It is not you, not yet.', mood: 'soft' },
    ],
    childLines: {
      'grove-first-flower#1': 'Somebody keeps the stone clean. Maybe one day it will be you.',
    },
  },
  {
    id: 'grove-door-marks',
    region: 'grove',
    at: { x: -6, z: 11 },
    lines: [
      { who: 'narrator', text: 'Pencil marks climb the cottage door frame, each with a little name. Nubbins, on tiptoe.' },
      { who: 'narrator', text: 'At the very top, in Hazel\'s hand: "Me, in my boots. Cheating."', mood: 'happy' },
    ],
    childLines: {},
  },
  {
    id: 'grove-trowel',
    region: 'grove',
    at: { x: 28, z: 37 },
    lines: [
      { who: 'narrator', text: 'A trowel lies in the long grass, rusted to the colour of a fox.' },
      { who: 'narrator', text: 'The handle is worn thin where a thumb pressed, year after year.' },
    ],
    childLines: {},
  },
  {
    // R0111 (WORLD-28): the clue to the Grove's secret, 4 u from the nook at the falls' foot.
    id: 'grove-falls-moss',
    region: 'grove',
    at: { x: 9.2, z: -12.6 },
    lines: [
      { who: 'narrator', text: 'Moss on this stone has grown round the shape of a key. It points at the falls.' },
    ],
    childLines: {},
  },
  // The Wood
  {
    id: 'wood-winter-seat',
    region: 'wood',
    at: { x: -22, z: -30 },
    lines: [
      { who: 'narrator', text: 'Two flat stones sit side by side under the oak. One is worn smooth on top.' },
      { who: 'narrator', text: 'The other is scuffed all round its edges, as if someone could not sit still.' },
    ],
    childLines: {},
  },
  {
    id: 'wood-mill-ledger',
    region: 'wood',
    at: { x: 36, z: 4 },
    lines: [
      { who: 'narrator', text: 'Inside the mill door, a ledger hangs on a nail. The last page counts sacks of flour.' },
      { who: 'narrator', text: 'In the margin, small and neat: "Long Night. Gave it all away."', mood: 'soft' },
    ],
    childLines: {
      'wood-mill-ledger#1': 'In the margin, small and neat: "A hard winter. Gave it all away."',
    },
  },
  {
    id: 'wood-carved-hearts',
    region: 'wood',
    at: { x: -34, z: 12 },
    lines: [
      { who: 'narrator', text: 'Inside the mushroom ring, a birch carries two carved initials. One of them is an H.' },
      { who: 'narrator', text: 'The bark has grown round them like a hand closing gently.' },
    ],
    childLines: {},
  },
  // The Ruins
  {
    id: 'ruins-long-night',
    region: 'ruins',
    lines: [
      { who: 'narrator', text: 'Carvings run along the old wall: people, then lanterns, then a great dark shape.' },
      { who: 'narrator', text: 'After the dark, the carver went back to people. Fewer of them, holding hands.', mood: 'soft' },
    ],
    childLines: {
      'ruins-long-night#0': 'Carvings run along the old wall: people, then lanterns, then a long dark night.',
      'ruins-long-night#1': 'After the night, the carver drew people again, holding hands.',
    },
  },
  {
    id: 'ruins-cracked-lanterns',
    region: 'ruins',
    lines: [
      { who: 'narrator', text: 'A row of lanterns stands in the grass, every glass split by frost.' },
      { who: 'narrator', text: 'Someone set a candle stub in each one anyway. They are all burnt down.' },
    ],
    childLines: {
      'ruins-cracked-lanterns#1': 'Someone put a little candle in each one anyway, long ago.',
    },
  },
  {
    id: 'ruins-small-boots',
    region: 'ruins',
    lines: [
      { who: 'narrator', text: 'A pair of small boots waits on a step, laces tied together.' },
      { who: 'narrator', text: 'They are dry inside. Somebody comes back for them, sometimes.' },
    ],
    childLines: {},
  },
  // The Shore
  {
    id: 'shore-bottle',
    region: 'shore',
    lines: [
      { who: 'narrator', text: 'A bottle in the wrack holds a child\'s drawing: a round blue friend with a yellow tip.' },
      { who: 'narrator', text: 'Under it, in crayon: "PIP\'S. DO NOT TAKE."', mood: 'happy' },
    ],
    childLines: {},
  },
  {
    id: 'shore-boat-name',
    region: 'shore',
    lines: [
      { who: 'narrator', text: 'An upturned boat rests above the tide line. Its name has been painted over twice.' },
      { who: 'narrator', text: 'The first name has faded to nothing. The newest is a painted Nubbin, grinning.', mood: 'happy' },
    ],
    childLines: {},
  },
  {
    id: 'shore-shell-path',
    region: 'shore',
    lines: [
      { who: 'narrator', text: 'Shells are pressed into the path in a spiral, the big ones at the middle.' },
      { who: 'narrator', text: 'Someone patient did this. Someone with small hands helped, badly.', mood: 'happy' },
    ],
    childLines: {},
  },
];

/** The flags tapping a trace can set (`trace:<id>`). */
export const WORLD_TRACES_FLAGS: string[] = WORLD_TRACES.map((t) => `trace:${t.id}`);

/** Traces ask nothing of the sim beyond the tap. */
export const WORLD_TRACES_CHECKS: string[] = [];
