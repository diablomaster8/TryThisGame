/**
 * R0321 (FUN-32): one round of peekaboo, pure and seeded so it can be tested: 3 to 5 hiding
 * spots (more as the child finds the Nubbin), one hides the Nubbin with its crown poking out,
 * each of the others hides a silly decoy. A round can never be lost: every tap shows
 * something, and the Nubbin is always there to find.
 */
import { Rng } from '../../sim/rng';

export const PEEK_SPOTS = ['tree', 'bush', 'rock', 'house', 'flower'] as const;
export const PEEK_DECOYS = ['frog', 'sock', 'stone', 'snail', 'teapot'] as const;
export const PEEK_ICONS: Record<string, string> = {
  tree: '🌳',
  bush: '🌿',
  rock: '🪨',
  house: '🏠',
  flower: '🌻',
  frog: '🐸',
  sock: '🧦',
  stone: '🙂',
  snail: '🐌',
  teapot: '🫖',
};

export interface PeekRound {
  spots: string[];
  /** Index of the spot hiding the Nubbin. */
  hidden: number;
  /** The decoy behind each spot (the hidden spot's entry is unused). */
  decoys: string[];
}

/** Round `n` (0-based): 3 spots, then 4, then 5. */
export function peekRound(seed: number, n: number): PeekRound {
  const rng = new Rng(seed * 7919 + n * 104729 + 1);
  const count = Math.min(5, 3 + n);
  const spots = [...PEEK_SPOTS];
  for (let i = spots.length - 1; i > 0; i--) {
    const j = rng.int(0, i);
    [spots[i], spots[j]] = [spots[j]!, spots[i]!];
  }
  const decoys = [...PEEK_DECOYS];
  for (let i = decoys.length - 1; i > 0; i--) {
    const j = rng.int(0, i);
    [decoys[i], decoys[j]] = [decoys[j]!, decoys[i]!];
  }
  return {
    spots: spots.slice(0, count),
    hidden: rng.int(0, count - 1),
    decoys: decoys.slice(0, count),
  };
}
