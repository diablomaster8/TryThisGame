/**
 * Which stroke a Nubbin swims (LOOK-23, R0391), shared by both renderers: a dog-paddle with
 * only the head out below Swim 20, a breaststroke up to 60, and a front crawl above. Every
 * Nubbin in the pond swims its own stroke now (children paddle); render reads, never writes.
 */
import { SWIM_STYLE } from '../config/tuning-look';
import { levelOf } from '../sim/stats';
import type { Nubbin } from '../sim/types';

export type SwimStyle = 'paddle' | 'breast' | 'crawl';

export function swimStyle(n: Nubbin): SwimStyle {
  const lv = levelOf(n.stats.swim.points);
  if (lv < SWIM_STYLE.paddleBelow) return 'paddle';
  return lv > SWIM_STYLE.crawlAbove ? 'crawl' : 'breast';
}

/** The Pixel clip for a style: the stock `swim` clip is the breaststroke. */
export function swimClip(n: Nubbin): 'paddle' | 'swim' | 'crawl' {
  const s = swimStyle(n);
  return s === 'breast' ? 'swim' : s;
}
