/**
 * HOT-3c: hold to walk. A press on open ground that lasts past the tap window, or slides,
 * turns into a hold: the Keeper walks toward the point under the finger and follows it as
 * it moves, and stops when it lifts. A quick press stays a tap-to-move. Presses on a
 * Nubbin, an item or scenery are never holds, so lifting and dragging stay as they were.
 * Pure, so the tests can walk the rule without a DOM.
 */
import { HOLD_WALK } from '../config/tuning-move';
import type { Vec2 } from '../sim/types';
import { isDrag } from './press-kind';

/** Whether a press still down turns into a hold-walk: open ground, held long or slid. */
export function isGroundHold(
  pointerType: string,
  onGround: boolean,
  movedPx: number,
  heldMs: number,
): boolean {
  return onGround && (heldMs >= HOLD_WALK.startMs || isDrag(pointerType, movedPx));
}

/** The goal a hold sends while it lasts: re-sent as the point moves, and on a steady beat. */
export class HoldWalk {
  private last: Vec2 | null = null;
  private lastMs = 0;

  get active(): boolean {
    return this.last !== null;
  }

  /** The hold starts at this point: walk there now. */
  start(at: Vec2, nowMs: number): Vec2 {
    this.last = { x: at.x, z: at.z };
    this.lastMs = nowMs;
    return this.last;
  }

  /** The point under the finger this frame: the goal to send, or null to leave it be. */
  follow(at: Vec2 | null, nowMs: number): Vec2 | null {
    if (!this.last || !at) return null;
    const moved = Math.hypot(at.x - this.last.x, at.z - this.last.z);
    if (moved < HOLD_WALK.minStepU && nowMs - this.lastMs < HOLD_WALK.resendMs) return null;
    return this.start(at, nowMs);
  }

  /** The finger lifted (or a second one came down): true if a hold was walking. */
  end(): boolean {
    const was = this.last !== null;
    this.last = null;
    return was;
  }
}
