/**
 * Lane A round 6 (FUN): player-facing text for the rest of the micro-game kit (R0294), the
 * per-verb Do-it labels (R0369) and the other round-6 comedy bits. Kept beside
 * `strings-fun-r5.ts` so the shared strings file only gains a re-export line.
 */
import type { MicroKind } from '../sim/micro';

export const MICRO6_TEXT = {
  escort: {
    title: 'Lead the way',
    help: 'Your Nubbin follows. When it stops to stare at something, tap Come on!',
    call: 'Come on!',
    stops: [
      'A butterfly. Very important.',
      'A snail. It is winning.',
      'Its own shadow. A new friend.',
      'A dandelion clock. Must be blown.',
    ],
    walking: 'Off again. Slowly. Slower.',
    done: 'Arrived. Only a little late.',
  },
  climb: {
    title: 'Up you go',
    help: 'Tap Climb when the ring is gold.',
    tap: 'Climb',
    slip: 'Wheee… down a step. Up again.',
    step: (n: number, of: number) => `${n} of ${of}.`,
    done: 'Top! A small wave from up here.',
  },
  puzzle: {
    title: 'Put it together',
    help: 'Tap a piece, then tap the slot with the same number.',
    wrong: 'Boing. That one goes somewhere else.',
    placed: (n: number, of: number) => `${n} of ${of} in place.`,
    done: 'It holds. Nobody lean on it yet.',
  },
  survive: {
    title: 'Hold your ground',
    help: 'Watch the swing, then tap the matching guard.',
    guards: ['◀ Left', 'Right ▶', '▲ Duck'],
    swing: ['From the left!', 'From the right!', 'Over the top!'],
    blocked: 'Blocked. A tiny bow.',
    bonk: 'Bonk. A wobble, a blink, still standing.',
    round: (n: number) => `Round ${n} of 3.`,
    done: 'Three rounds. Everyone is still upright, more or less.',
  },
  explore: {
    title: 'Go and see',
    help: 'Tap a square next to your Nubbin to step. Find the ✕.',
    sillies: ['A puddle. Stamped in.', 'A daisy. Sniffed.', 'A pebble. Pocketed.'],
    done: 'Here it is. Exactly where the map said, for once.',
  },
} as const;

/**
 * R0369 (FUN-80): the button and its one-line aside per micro-game kind, so "Do it" reads
 * as the verb it stands for. `real` is the fallback for steps a real command answers.
 */
export const DO_IT_BY: Record<MicroKind | 'real', { label: string; aside: string }> = {
  balance: { label: 'Heave', aside: 'Your Nubbin did most of it.' },
  hunt: { label: 'Look under everything', aside: 'Something is always under something.' },
  escort: { label: 'Lead the way', aside: 'Slowly. Slower.' },
  catch: { label: 'Hold out the basket', aside: 'Things fall. You catch some.' },
  climb: { label: 'Up we go', aside: 'One hand, one paw, one hand.' },
  puzzle: { label: 'Fit it together', aside: 'Corners first. Then the wobbly bit.' },
  survive: { label: 'Stand your ground', aside: 'Bravely. Mostly.' },
  explore: { label: 'Go and see', aside: 'The map is roughly right.' },
  real: { label: 'Do it', aside: 'Off you go.' },
};

/** R0294: the accessibility switch that skips the micro-games. */
export const MICRO_SKIP_TEXT = {
  label: 'Skip quest mini-games',
  help: 'Do it finishes a step straight away. On by default for Little Sprouts.',
} as const;

/** The Do-it button for a micro-game kind: hints say "tap Do it", so it keeps those words. */
export function doItLabel(kind: MicroKind | null): string {
  return kind ? `Do it · ${DO_IT_BY[kind].label}` : DO_IT_BY.real.label;
}

/** R0313 (FUN-24): Fern's cairn in the Journal's Friends block. */
export function fernCairnLine(stones: number): string {
  if (stones <= 1) return 'Fern’s stone by the signpost: one, and very good.';
  return `Fern’s cairn by the signpost: ${stones} stones, each the best one.`;
}

/** R0324 (FUN-35): the Expedition's comic layer. */
export const EXPEDITION_FUN_TEXT = {
  things: { rock: 'one rock', log: 'one sleeping log', bush: 'one bush' } as Record<string, string>,
  mostDropped: (n: number, on: string) => `Most Shells dropped on ${on}: ${n}.`,
  longestAir: (s: string) => `Longest time spent in the air: ${s} s.`,
  bubbles: (n: number) => `Critters rescued, by bubble: ${n}.`,
  logs: (n: number) => `Logs woken up: ${n}. They have gone back to sleep.`,
  noHits: 'Things bumped into: none. Suspiciously tidy.',
  jumps: (n: number) => `Jumps: ${n}. Every one of them excellent.`,
  nothing: 'Nothing this time, but the jumping was excellent.',
  /** What an obstacle says when it is bumped. */
  quips: {
    log: ['Zzz… oh. Sorry. Carry on.', 'The log was asleep. It still is.', 'A sleepy “mmf”.'],
    rock: ['The rock does not apologise.', 'Bonk. The rock wins.', 'The rock looks smug.'],
    bush: [
      'The bush rustles. Huffily.',
      'Leaves everywhere. The bush is fine.',
      'A snail in the bush says sorry.',
    ],
  } as Record<string, readonly string[]>,
} as const;
