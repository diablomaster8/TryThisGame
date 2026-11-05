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
    at: { x: -4, z: -24 },
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
    at: { x: -26, z: -4 },
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
    at: { x: 3, z: -3 },
    lines: [
      { who: 'narrator', text: 'A pair of small boots waits on a step, laces tied together.' },
      { who: 'narrator', text: 'They are dry inside. Somebody comes back for them, sometimes.' },
    ],
    childLines: {},
  },
  // The Lane
  {
    id: 'lane-squeaky-gate',
    region: 'lane',
    at: { x: 0, z: -34 },
    lines: [
      { who: 'narrator', text: 'A garden gate hangs open and squeaks in the breeze, always on the same note.' },
      { who: 'narrator', text: 'Nobody oils it. The neighbours say it tells them who is home.', mood: 'happy' },
    ],
    childLines: {},
  },
  {
    id: 'lane-postbox',
    region: 'lane',
    at: { x: 0, z: -4 },
    lines: [
      { who: 'narrator', text: 'A postbox leans against the hedge, its flag stuck halfway up.' },
      { who: 'narrator', text: 'Inside is one letter, addressed to "Whoever is next". It is not yours, yet.' },
    ],
    childLines: {},
  },
  {
    id: 'lane-clipped-hedge',
    region: 'lane',
    at: { x: 0, z: 22 },
    lines: [
      { who: 'narrator', text: 'Somebody has clipped the hedge into a round, lopsided Nubbin.' },
      { who: 'narrator', text: 'One ear is longer than the other. It looks very pleased with itself.', mood: 'happy' },
    ],
    childLines: {},
  },
  // The Shore
  {
    id: 'shore-bottle',
    region: 'shore',
    at: { x: -44, z: -1 },
    lines: [
      { who: 'narrator', text: 'A bottle in the wrack holds a child\'s drawing: a round blue friend with a yellow tip.' },
      { who: 'narrator', text: 'Under it, in crayon: "PIP\'S. DO NOT TAKE."', mood: 'happy' },
    ],
    childLines: {},
  },
  {
    id: 'shore-boat-name',
    region: 'shore',
    at: { x: -22, z: 6 },
    lines: [
      { who: 'narrator', text: 'An upturned boat rests above the tide line. Its name has been painted over twice.' },
      { who: 'narrator', text: 'The first name has faded to nothing. The newest is a painted Nubbin, grinning.', mood: 'happy' },
    ],
    childLines: {},
  },
  {
    id: 'shore-shell-path',
    region: 'shore',
    at: { x: 18, z: 6 },
    lines: [
      { who: 'narrator', text: 'Shells are pressed into the path in a spiral, the big ones at the middle.' },
      { who: 'narrator', text: 'Someone patient did this. Someone with small hands helped, badly.', mood: 'happy' },
    ],
    childLines: {},
  },
  // The Ridge
  {
    id: 'ridge-hut-latch',
    region: 'ridge',
    at: { x: -15, z: 5 },
    lines: [
      { who: 'narrator', text: "The hut latch is polished bright by hands, though the hut is always empty." },
      { who: 'narrator', text: "A stack of dry kindling waits by the door. Someone expects you to need it.", mood: 'soft' },
    ],
    childLines: {},
  },
  {
    id: 'ridge-falls-notches',
    region: 'ridge',
    at: { x: -20, z: 52 },
    lines: [
      { who: 'narrator', text: "Notches climb a flat rock by the pool, one for every brave swimmer." },
      { who: 'narrator', text: "The newest has a tiny crown scratched beside it. Somebody was very proud.", mood: 'happy' },
    ],
    childLines: {},
  },
  {
    id: 'ridge-summit-log',
    region: 'ridge',
    at: { x: 1, z: -64 },
    lines: [
      { who: 'narrator', text: "A tin box under the cairn holds a notebook. Every entry is a date and \"Still there.\"" },
      { who: 'narrator', text: "The first, in Hazel's hand: \"Still here. Cold. Worth it.\"", mood: 'soft' },
    ],
    childLines: {},
  },
  // The Sun lands
  {
    id: 'sun-fountain-coins',
    region: 'sunlands',
    at: { x: 4, z: 6 },
    lines: [
      { who: 'narrator', text: "Coins glint in the fountain, each worn smooth by wishing." },
      { who: 'narrator', text: "One of them is a button. It is, on balance, the happiest wish in there.", mood: 'happy' },
    ],
    childLines: {},
  },
  {
    id: 'sun-dial-rim',
    region: 'sunlands',
    at: { x: 4, z: -26 },
    lines: [
      { who: 'narrator', text: "The dial rim reads: \"I count only the bright hours.\"" },
      { who: 'narrator', text: "Someone has added, very small: \"Lazy.\" The carving looks fond.", mood: 'happy' },
    ],
    childLines: {},
  },
  {
    id: 'sun-two-initials',
    region: 'sunlands',
    at: { x: 26, z: 5 },
    lines: [
      { who: 'narrator', text: "Two sets of initials share the bench: one neat and faded, one large and keen." },
      { who: 'narrator', text: "Between them sits a small heart. Someone tried to scratch it out, then thought better.", mood: 'happy' },
    ],
    childLines: {},
  },
  // The Moon lands
  {
    id: 'moon-paper-boat',
    region: 'moonlands',
    at: { x: 0, z: 18 },
    lines: [
      { who: 'narrator', text: "A paper boat rests on the lake rim, folded from a page of tiny writing." },
      { who: 'narrator', text: "The ink has run. One word is left, and it is \"Remember.\"", mood: 'soft' },
    ],
    childLines: {},
  },
  {
    id: 'moon-moss-names',
    region: 'moonlands',
    at: { x: -28, z: 22 },
    lines: [
      { who: 'narrator', text: "Small names are traced in the moss in a ring, where the fireflies settle." },
      { who: 'narrator', text: "The fireflies keep the ring bright. Nobody asked them to.", mood: 'soft' },
    ],
    childLines: {},
  },
  {
    id: 'moon-crystal-hum',
    region: 'moonlands',
    at: { x: 28, z: -22 },
    lines: [
      { who: 'narrator', text: "A crystal hums when you stand near, on a note too low to name." },
      { who: 'narrator', text: "It stops when you step away, as if listening for someone.", mood: 'soft' },
    ],
    childLines: {},
  },
];

/** The flags tapping a trace can set (`trace:<id>`). */
export const WORLD_TRACES_FLAGS: string[] = WORLD_TRACES.map((t) => `trace:${t.id}`);

/** Traces ask nothing of the sim beyond the tap. */
export const WORLD_TRACES_CHECKS: string[] = [];
