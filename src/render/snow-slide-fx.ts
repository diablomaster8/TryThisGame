import { SLIDE_FX } from '../config/tuning-r16d1';
import { playSlideSwish } from '../platform/slide-audio';
import { sliding } from '../sim/snow-slide';
import type { World } from '../sim/types';

/**
 * R0118: shared by both renderers. `tick` plays the swish on the frame a slide starts and says
 * when a puff of snow is due off the Keeper's feet; the caller bursts it with its own particles.
 * Holds two numbers and allocates nothing; reduced motion still gets the puff (the renderers'
 * own calm bursts keep it small).
 */
export class SnowSlideFx {
  private was = false;
  private nextMs = 0;
  private swishMs = -1e9;

  tick(world: World, nowMs: number): boolean {
    const on = world.location.startsWith('region:') && sliding(world);
    if (!on) {
      this.was = false;
      return false;
    }
    if (!this.was) {
      this.was = true;
      if (nowMs - this.swishMs > SLIDE_FX.swishGapMs) {
        this.swishMs = nowMs;
        playSlideSwish();
      }
    }
    if (nowMs < this.nextMs) return false;
    this.nextMs = nowMs + SLIDE_FX.sprayMs;
    return true;
  }
}
