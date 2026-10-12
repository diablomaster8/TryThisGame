import { ALIGNMENT, TYPE_LEAN } from '../config/tuning';
import type { AlignmentBand, KeeperAlignment, Nubbin, NubbinType } from './types';
import { NUBBIN_TYPES } from './types';

export function bandOf(alignment: number): AlignmentBand {
  if (alignment > ALIGNMENT.sunThreshold) return 'sun';
  if (alignment < ALIGNMENT.moonThreshold) return 'moon';
  return 'neutral';
}

/** Every kind action nudges alignment toward the active Keeper. */
export function nudgeAlignment(nubbin: Nubbin, keeper: KeeperAlignment): void {
  const delta = keeper === 'sun' ? ALIGNMENT.kindActionDelta : -ALIGNMENT.kindActionDelta;
  nubbin.alignment = Math.max(-1, Math.min(1, nubbin.alignment + delta));
}

/** Children show faint hints of where they are heading. */
export function childHint(alignment: number): AlignmentBand {
  if (alignment >= ALIGNMENT.childHintThreshold) return 'sun';
  if (alignment <= -ALIGNMENT.childHintThreshold) return 'moon';
  return 'neutral';
}

/** The winning type, or Normal when no type leads the runner-up by the margin. */
export function winningType(lean: Record<NubbinType, number>): NubbinType {
  let best: NubbinType = 'normal';
  let bestScore = -Infinity;
  let second = -Infinity;
  for (const type of NUBBIN_TYPES) {
    if (type === 'normal') continue;
    const score = lean[type];
    if (score > bestScore) {
      second = bestScore;
      bestScore = score;
      best = type;
    } else if (score > second) {
      second = score;
    }
  }
  if (bestScore <= 0) return 'normal';
  if (second <= 0) return best;
  if (bestScore < second * (1 + TYPE_LEAN.leadMargin)) return 'normal';
  return best;
}
