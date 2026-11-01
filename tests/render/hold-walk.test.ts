import { describe, expect, it } from 'vitest';
import { HOLD_WALK } from '../../src/config/tuning-move';
import { INPUT, KEEPER } from '../../src/config/tuning';
import { HoldWalk, isGroundHold } from '../../src/input/hold-walk';
import { isTap } from '../../src/input/press-kind';
import type { Vec2 } from '../../src/sim/types';

// HOT-3c: press and hold on open ground walks the Keeper; a quick press is still a tap.
describe('HOT-3c hold vs tap', () => {
  it('starts a hold only after the tap window, so a quick press stays a tap', () => {
    expect(HOLD_WALK.startMs).toBeGreaterThanOrEqual(INPUT.tapMaxMs);
    for (const type of ['touch', 'mouse', 'pen']) {
      expect(isTap(type, 2, 120)).toBe(true);
      expect(isGroundHold(type, true, 2, 120)).toBe(false);
      expect(isGroundHold(type, true, 2, HOLD_WALK.startMs)).toBe(true);
    }
  });

  it('turns a press that slides on the ground into a hold at once', () => {
    expect(isGroundHold('touch', true, 20, 60)).toBe(true);
    expect(isGroundHold('touch', true, 10, 60)).toBe(false);
    expect(isGroundHold('mouse', true, 8, 60)).toBe(true);
  });

  it('never holds on a Nubbin, an item or scenery', () => {
    expect(isGroundHold('touch', false, 0, 5000)).toBe(false);
    expect(isGroundHold('mouse', false, 40, 5000)).toBe(false);
  });
});

describe('HOT-3c following a moving hold point', () => {
  it('re-aims as the finger moves, on a beat when still, and stops on release', () => {
    const h = new HoldWalk();
    expect(h.follow({ x: 1, z: 1 }, 0)).toBeNull();
    expect(h.start({ x: 1, z: 0 }, 0)).toEqual({ x: 1, z: 0 });
    // A wobble under the step, inside the beat: nothing new to send.
    expect(h.follow({ x: 1.1, z: 0 }, 16)).toBeNull();
    // A real move: the new point at once.
    expect(h.follow({ x: 2, z: 0 }, 32)).toEqual({ x: 2, z: 0 });
    // Still finger: re-sent on the beat (the ground under it shifts as the camera follows).
    expect(h.follow({ x: 2, z: 0 }, 32 + HOLD_WALK.resendMs)).toEqual({ x: 2, z: 0 });
    expect(h.end()).toBe(true);
    expect(h.active).toBe(false);
    expect(h.follow({ x: 3, z: 0 }, 400)).toBeNull();
    expect(h.end()).toBe(false);
  });

  it('keeps a walking Keeper on a finger that circles round it', () => {
    const h = new HoldWalk();
    const keeper = { x: 0, z: 0 };
    let goal: Vec2 = h.start({ x: 3, z: 0 }, 0);
    const dt = 1000 / 60;
    let far = 0;
    for (let t = dt; t < 4000; t += dt) {
      const a = t / 1000;
      const finger = { x: keeper.x + 3 * Math.cos(a), z: keeper.z + 3 * Math.sin(a) };
      goal = h.follow(finger, t) ?? goal;
      // The goal is never more than one step plus a beat's drift behind the finger.
      far = Math.max(far, Math.hypot(goal.x - finger.x, goal.z - finger.z));
      const left = Math.hypot(goal.x - keeper.x, goal.z - keeper.z);
      const step = Math.min(KEEPER.speed * (dt / 1000), left);
      if (left > 0) {
        keeper.x += ((goal.x - keeper.x) / left) * step;
        keeper.z += ((goal.z - keeper.z) / left) * step;
      }
    }
    expect(far).toBeLessThan(HOLD_WALK.minStepU + 3 * (HOLD_WALK.resendMs / 1000) + 1e-6);
    // It walked (about 4 s at full pace), following the finger round.
    expect(Math.hypot(keeper.x, keeper.z)).toBeGreaterThan(1);
  });
});
