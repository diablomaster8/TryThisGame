import { ALIGNMENT, TYPE_LEAN } from '../config/tuning';
import type { AlignmentBand, KeeperAlignment, Nubbin, NubbinType } from './types';
import { NUBBIN_TYPES } from './types';

/**
 * Alignment moves in hundredths, so it is kept and compared as a whole number of
 * hundredths: 80 kind acts give exactly 0.80, never 0.8000000000000005, and a drifted
 * value from an older save reads as the hundredth it was meant to be.
 */
export function roundAlignment(alignment: number): number {
  return Math.round(alignment * 100) / 100;
}

export function bandOf(alignment: number): AlignmentBand {
  const a = roundAlignment(alignment);
  if (a > ALIGNMENT.sunThreshold) return 'sun';
  if (a < ALIGNMENT.moonThreshold) return 'moon';
  return 'neutral';
}

/** Every kind action nudges alignment toward the active Keeper. */
export function nudgeAlignment(nubbin: Nubbin, keeper: KeeperAlignment): void {
  const delta = keeper === 'sun' ? ALIGNMENT.kindActionDelta : -ALIGNMENT.kindActionDelta;
  nubbin.alignment = roundAlignment(Math.max(-1, Math.min(1, nubbin.alignment + delta)));
}

/** Children show faint hints of where they are heading. */
export function childHint(alignment: number): AlignmentBand {
  const a = roundAlignment(alignment);
  if (a >= ALIGNMENT.childHintThreshold) return 'sun';
  if (a <= -ALIGNMENT.childHintThreshold) return 'moon';
  return 'neutral';
}

/**
 * The winning type, or Normal when no type leads the runner-up by the margin. Normal lean
 * (fusion, plant fruit) competes like the others: it can win outright, and as the
 * runner-up it can hold back a narrow lead.
 */
export function winningType(lean: Record<NubbinType, number>): NubbinType {
  let best: NubbinType = 'normal';
  let bestScore = -Infinity;
  let second = -Infinity;
  for (const type of NUBBIN_TYPES) {
    const score = lean[type];
    if (score > bestScore) {
      second = bestScore;
      bestScore = score;
      best = type;
    } else if (score > second) {
      second = score;
    }
  }
  if (bestScore < TYPE_LEAN.minToCount) return 'normal';
  if (second <= 0) return best;
  if (bestScore < second * (1 + TYPE_LEAN.leadMargin)) return 'normal';
  return best;
}
