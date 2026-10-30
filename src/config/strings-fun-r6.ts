/**
 * Lane A round 6 (FUN): player-facing text for the rest of the micro-game kit (R0294), the
 * per-verb Do-it labels (R0369) and the other round-6 comedy bits. Kept beside
 * `strings-fun-r5.ts` so the shared strings file only gains a re-export line.
 */
import type { MicroKind } from '../sim/micro';
import { REQUEST_VOICE } from './strings-requests';

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

/** R0325 (FUN-36): one quirk per rival, shown with its name in the standings. */
export const RIVAL_QUIRKS: readonly string[] = [
  'who stops to wave',
  'who hums the whole way',
  'who runs with its eyes shut',
  'who has a lucky leaf',
  'who bows at the start',
  'who is mostly here for the snacks',
  'who waves at its own shadow',
  'who once beat a snail, narrowly',
  'who claps for everyone',
  'who sneezes at the gun',
  'who brought a spare sock',
  'who runs in a very straight line',
  'who apologises to the hurdles',
  'who is wearing its best face',
  'who counts its steps out loud',
  'who has never seen a butterfly',
  'who has seen every butterfly',
  'who naps between races',
  'who trained on a hill, once',
  'who thinks the finish line is lunch',
  'who high-fives the finish post',
  'who races its own reflection',
  'who carries a pebble for luck',
  'who is very serious about this',
  'who giggles on the corners',
  'who wobbles but never falls',
  'who stops to smell everything',
  'who would rather be swimming',
  'who is secretly very fast',
  'who is openly very slow',
  'who does a little skip',
  'who forgot which way to go',
  'who knows exactly which way to go',
  'who waves at the crowd of one',
  'who fluffs up before the start',
  'who likes the mud bit best',
  'who blinks a lot in the sun',
  'who is still thinking about breakfast',
  'who has a cheer of its own',
  'who never looks back, then does',
];

/** R0325: a rival's name with its quirk ("Pudding, who stops to wave"). */
export function rivalLabel(name: string, quirk: number | undefined): string {
  const q = quirk === undefined ? undefined : RIVAL_QUIRKS[quirk % RIVAL_QUIRKS.length];
  return q ? `${name}, ${q}` : name;
}

/** R0325: the race's butterfly beats, for the track and the results. */
export const RACE_GAG_TEXT = {
  gaze: '🦋',
  perk: '!',
  tip: (name: string) => `${name} stopped to look at a butterfly. Worth it.`,
} as const;

/**
 * R0327 (FUN-38): a request's voiced ask or thank-you: the asking Keeper's own line, the
 * narrated Nubbin line (`nubbin` true: `from` is a Nubbin's name), else the kind's fallback.
 */
export function requestLine(
  template: string,
  from: string,
  nubbin: boolean,
  which: 'ask' | 'thanks',
): string | null {
  const v = REQUEST_VOICE[template];
  if (!v) return null;
  if (nubbin) return v.nubbin[which].replace(/\{name\}/g, from);
  return (v.by[from] ?? v.fallback)[which];
}
