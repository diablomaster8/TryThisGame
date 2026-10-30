/**
 * World gags (R0129, WORLD-63): the places should be funny. Each gag belongs to one tappable
 * piece of the outer ring (`config/outer-ring.ts`) and answers taps with its lines in turn:
 * a piece that already has a line of its own says that first and the gag on later taps; a
 * piece made for the gag starts with it. One or two narrator lines, phone-short, no quotes.
 * They assume nothing about any story being played (the story-review rule) and set no flags.
 *
 * Audience 'all': every gag reaches the Learning Grove, with `childLines` keyed
 * `"<gag id>#<line index>"` where a line needs a plainer reading.
 */
import type { Line } from '../config/story';
import type { RegionId } from '../config/regions';

export interface WorldGag {
  id: string;
  region: RegionId;
  /** The outer-ring piece that is tapped (`OUTER_PROPS` id). */
  piece: string;
  lines: Line[];
  childLines: Record<string, string>;
}

export const WORLD_GAGS: WorldGag[] = [
  {
    id: 'gag-scarecrow',
    region: 'grove',
    piece: 'wm-crow',
    lines: [
      { who: 'narrator', text: 'You look away, then back. The scarecrow is facing you now.' },
      { who: 'narrator', text: 'It is very much pretending it was always facing you.', mood: 'happy' },
    ],
    childLines: {},
  },
  {
    id: 'gag-every-way',
    region: 'grove',
    piece: 'fo-sign',
    lines: [
      { who: 'narrator', text: 'Every arrow on this signpost points to the Grove. Every single one.' },
      { who: 'narrator', text: 'Somebody out here was very sure where everything is.', mood: 'happy' },
    ],
    childLines: {
      'gag-every-way#1': 'Whoever made this sign really loves the Grove.',
    },
  },
  {
    id: 'gag-no-feeding',
    region: 'grove',
    piece: 'sm-sign',
    lines: [
      { who: 'narrator', text: 'A sign: DO NOT FEED THE NUBBINS. One corner has been nibbled off, neatly.' },
      { who: 'narrator', text: 'Under it, smaller: WE MEAN IT. Under that, smaller still: PLEASE.', mood: 'happy' },
    ],
    childLines: {},
  },
  {
    id: 'gag-bee-queue',
    region: 'grove',
    piece: 'fo-hive',
    lines: [
      { who: 'narrator', text: 'The bees have formed a small, disapproving queue.' },
      { who: 'narrator', text: 'One bee at the back is only here because the others are.', mood: 'happy' },
    ],
    childLines: {},
  },
];

/** Gags set no flags. */
export const WORLD_GAGS_FLAGS: string[] = [];

/** Gags ask nothing of the sim. */
export const WORLD_GAGS_CHECKS: string[] = [];
