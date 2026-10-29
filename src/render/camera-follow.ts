/**
 * MOVE-53: "Camera follows walking". With 45° snap turns a player walking up the screen
 * toward the edge of the view loses track. With the setting on, after `steadyMs` of walking
 * one way more than `offDeg` off the camera's forward, the view turns one 45° step toward
 * it, with the usual tween. Never in dialogue, while carrying, or outside the Grove.
 */
import { CAMERA_FOLLOW_WALK } from '../config/tuning-move';
import type { World } from '../sim/types';

/** The camera's side of this: its yaw and its own snap turn. */
export interface TurnableCamera {
  readonly currentYaw: number;
  rotate(direction: 1 | -1, nowMs?: number): void;
}

const wrap = (a: number): number => Math.atan2(Math.sin(a), Math.cos(a));

export class WalkFollow {
  private heading: number | null = null;
  private since = 0;

  /**
   * Per frame. `blocked` is true while a dialogue is up. Returns the turn made, if any (for
   * tests); the turn itself goes through `camera.rotate`.
   */
  update(world: World, camera: TurnableCamera, nowMs: number, blocked: boolean): 1 | -1 | 0 {
    const k = world.keeper;
    const F = CAMERA_FOLLOW_WALK;
    const on =
      !!world.settings.cameraFollowsWalk &&
      !blocked &&
      !k.carrying &&
      world.location === 'grove' &&
      (k.input.x !== 0 || k.input.z !== 0 || !!k.moveTarget || !!k.intent);
    if (!on) {
      this.heading = null;
      return 0;
    }
    // The Keeper faces the way it walks; a turn of more than `wobbleDeg` starts the count again.
    const wobble = (F.wobbleDeg * Math.PI) / 180;
    if (this.heading === null || Math.abs(wrap(k.facing - this.heading)) > wobble) {
      this.heading = k.facing;
      this.since = nowMs;
      return 0;
    }
    if (nowMs - this.since < F.steadyMs) return 0;
    // The camera sits at +yaw from the Keeper looking back, so its forward is yaw + π.
    const off = wrap(this.heading - (camera.currentYaw + Math.PI));
    if (Math.abs(off) <= (F.offDeg * Math.PI) / 180) return 0;
    const dir = off > 0 ? 1 : -1;
    camera.rotate(dir, nowMs);
    this.since = nowMs;
    return dir;
  }
}
