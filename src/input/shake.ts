/**
 * TECH-16: the shake gesture while dragging. It reads `clientX` against the swing so far
 * (never `movementX`, which iOS Safari and some touch browsers leave at 0), and counts a
 * reversal only when the pointer has travelled at least `minSwingPx` one way and then
 * `minSwingPx` back, so a wobbly drag is not a shake. Enough reversals inside the window
 * fire one shake and start counting again.
 */
import { INPUT } from '../config/tuning';
import { SHAKE_GESTURE } from '../config/tuning-tech';

export class ShakeDetector {
  private dir = 0;
  private start = 0;
  private extreme = 0;
  private reversals: number[] = [];

  reset(x: number): void {
    this.dir = 0;
    this.start = this.extreme = x;
    this.reversals = [];
  }

  /** Reversals in the window so far, for a shake meter. */
  progress(now: number): number {
    return this.reversals.filter((t) => now - t < SHAKE_GESTURE.windowMs).length;
  }

  /** A pointer sample; true when it completes a shake. */
  feed(x: number, now: number): boolean {
    const min = SHAKE_GESTURE.minSwingPx;
    if (this.dir === 0) {
      if (Math.abs(x - this.start) < min) return false;
      this.dir = Math.sign(x - this.start);
      this.extreme = x;
      return false;
    }
    if ((x - this.extreme) * this.dir >= 0) {
      this.extreme = x;
      return false;
    }
    if (Math.abs(x - this.extreme) < min) return false;
    // Turned back far enough after a full swing: a reversal.
    if (Math.abs(this.extreme - this.start) >= min) this.reversals.push(now);
    this.start = this.extreme;
    this.extreme = x;
    this.dir = -this.dir;
    this.reversals = this.reversals.filter((t) => now - t < SHAKE_GESTURE.windowMs);
    if (this.reversals.length < INPUT.shakeReversalsPerSecond) return false;
    this.reversals = [];
    return true;
  }
}
