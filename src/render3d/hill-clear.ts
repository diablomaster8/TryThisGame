/**
 * MOVE-52: the 3D orbit camera never looks at the Keeper through a hill. Once the Keeper is
 * on a terrace or behind a hill the 24° orbit can sit inside the slope; each frame the line
 * from the look point to the camera is checked against the ground's heights, and when it is
 * blocked the camera tilts up (up to 15° more), then pulls in (to 70%), whichever first
 * clears. It gets out of the way fast and eases back over half a second. Staged shots frame
 * themselves, so the scene passes `active` false for them.
 */
import { HILL_CLEAR } from '../config/tuning-move';

type Height = (x: number, z: number) => number;

/** Whether the ground stays under the line from `t` to the camera at (yaw, pitch, dist). */
export function lineClear(
  t: { x: number; y: number; z: number },
  yaw: number,
  pitch: number,
  dist: number,
  height: Height,
): boolean {
  const ux = Math.sin(yaw) * Math.cos(pitch);
  const uy = Math.sin(pitch);
  const uz = Math.cos(yaw) * Math.cos(pitch);
  // Start a step out: the look point itself sits over the Keeper's own ground.
  for (let s = HILL_CLEAR.step; s <= dist; s += HILL_CLEAR.step) {
    const y = t.y + uy * s;
    if (height(t.x + ux * s, t.z + uz * s) + HILL_CLEAR.margin > y) return false;
  }
  return true;
}

/**
 * The extra pitch (radians) and the distance factor that clear the line: the least tilt
 * first, then the least pull-in at the full tilt. Falls back to the most of both.
 */
export function clearShot(
  t: { x: number; y: number; z: number },
  yaw: number,
  pitch: number,
  dist: number,
  height: Height,
): { lift: number; k: number } {
  const C = HILL_CLEAR;
  const most = (C.maxPitchDeg * Math.PI) / 180;
  for (let i = 0; i <= C.pitchSteps; i++) {
    const lift = (most * i) / C.pitchSteps;
    if (lineClear(t, yaw, pitch + lift, dist, height)) return { lift, k: 1 };
  }
  for (let i = 1; i <= C.distSteps; i++) {
    const k = 1 - ((1 - C.minDist) * i) / C.distSteps;
    if (lineClear(t, yaw, pitch + most, dist * k, height)) return { lift: most, k };
  }
  return { lift: most, k: C.minDist };
}

/** The eased lift and pull-in the scene applies to its orbit, frame by frame. */
export class HillClear {
  lift = 0;
  k = 1;

  /** Ease toward what clears this frame's line (or back to nothing when not active). */
  update(
    t: { x: number; y: number; z: number },
    yaw: number,
    pitch: number,
    dist: number,
    height: Height,
    dtS: number,
    active: boolean,
  ): void {
    const want = active ? clearShot(t, yaw, pitch, dist, height) : { lift: 0, k: 1 };
    const C = HILL_CLEAR;
    const ms = dtS * 1000;
    const most = (C.maxPitchDeg * Math.PI) / 180;
    // Out of the way quickly; back at a steady rate over `outMs`.
    const inK = 1 - Math.exp(-ms / C.inMs);
    this.lift =
      want.lift > this.lift
        ? this.lift + (want.lift - this.lift) * inK
        : Math.max(want.lift, this.lift - (most * ms) / C.outMs);
    this.k =
      want.k < this.k
        ? this.k + (want.k - this.k) * inK
        : Math.min(want.k, this.k + ((1 - C.minDist) * ms) / C.outMs);
  }
}
