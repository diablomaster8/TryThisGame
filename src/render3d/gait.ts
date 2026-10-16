import { GROVE3D } from '../config/tuning';
import type { Rigged } from '../samples/species';

/**
 * Keeps a walking rig's feet from sliding. The species format walks at its own pace: the
 * body should advance `strideLength / stridePeriod` per second (in the rig's units, times
 * its scale in the Grove). The sim moves creatures at its own speeds, so each rig gets
 * its own animation clock that runs faster or slower while it walks, in proportion to how
 * fast it is really moving. Off the walk the clock runs at the real rate. The clock is
 * accumulated, so the cycle never jumps when the rate changes, and it belongs to the rig
 * (pooled rigs change hands), so a rig's time never runs backwards.
 */
class GaitClock {
  clock: number;
  constructor(t: number) {
    this.clock = t;
  }

  private lastX = NaN;
  private lastZ = NaN;
  private speed = 0;

  /** Advance with this frame's drawn position; returns the time to pass to `animate`. */
  step(rig: Rigged, x: number, z: number, dt: number, walking: boolean, rateScale: number): number {
    if (dt > 0 && Number.isFinite(this.lastX)) {
      const v = Math.hypot(x - this.lastX, z - this.lastZ) / dt;
      // Smooth over a few frames: sim positions arrive in 10 Hz steps, eased between.
      this.speed += (v - this.speed) * Math.min(1, dt * 10);
    }
    this.lastX = x;
    this.lastZ = z;
    let rate = rateScale;
    if (walking) {
      const natural = (rig.strideLength * rig.group.scale.x) / Math.max(0.05, rig.stridePeriod);
      // Capped: the figures' strides are short for the sim's speeds (a Keeper walks at
      // 6x its natural pace, a child at 9x), and past 4x the legs blur into a buzz.
      if (natural > 1e-4) rate = Math.min(GROVE3D.maxCadence, Math.max(0.35, this.speed / natural));
    }
    this.clock += dt * rate;
    return this.clock;
  }
}

const clocks = new WeakMap<Rigged, GaitClock>();

/**
 * The time to animate a rig at this frame: real time off the walk, stride-matched time on
 * it. `t` seeds a rig's clock the first time it is seen; `rateScale` slows everything
 * (a swimmer paddles at 0.6).
 */
export function gaitTime(
  rig: Rigged,
  x: number,
  z: number,
  t: number,
  dt: number,
  walking: boolean,
  rateScale = 1,
): number {
  let c = clocks.get(rig);
  if (!c) {
    c = new GaitClock(t);
    clocks.set(rig, c);
  }
  return c.step(rig, x, z, dt, walking, rateScale);
}
