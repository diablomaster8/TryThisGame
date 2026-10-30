import { FIRST_FEED, UI } from '../config/tuning';
import type { Nubbin } from './types';

/**
 * TECH-01: a Nubbin fresh from its first hatch (never reborn) that has not yet eaten its fill.
 * The Grove shows a 🍎 bubble over it and the objective chip says to feed it.
 */
export function wantsFirstFruit(n: Nubbin): boolean {
  return (
    n.stage === 'child' &&
    n.rebirths === 0 &&
    n.stageMs < FIRST_FEED.cueMs &&
    n.needs.hunger < UI.feedFullAt
  );
}
