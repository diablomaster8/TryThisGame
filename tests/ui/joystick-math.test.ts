import { describe, expect, it } from 'vitest';
import { inPadZone, stickSpeed, stickState, stickToWorld } from '../../src/ui/joystick-math';
import { JOYSTICK_TUNING as J } from '../../src/config/tuning-move-joy';

describe('joystick speed curve', () => {
  it('is zero in the dead zone and one near the rim', () => {
    expect(stickSpeed(0.1)).toBe(0);
    expect(stickSpeed(0.9)).toBe(1);
    expect(stickSpeed(1)).toBe(1);
  });
  it('gives about half pace at half tilt and rises monotonically', () => {
    expect(stickSpeed(0.5)).toBeGreaterThan(0.4);
    expect(stickSpeed(0.5)).toBeLessThan(0.55);
    let prev = 0;
    for (let l = 0; l <= 1; l += 0.05) {
      const v = stickSpeed(l);
      expect(v).toBeGreaterThanOrEqual(prev);
      prev = v;
    }
  });
});

describe('screen to world', () => {
  it('pushing up walks along the camera forward for the yaw', () => {
    const a = stickToWorld(0, -1, 0);
    expect(a.x).toBeCloseTo(0);
    expect(a.z).toBeCloseTo(-1);
    const b = stickToWorld(0, -1, Math.PI / 2);
    expect(b.x).toBeCloseTo(-1);
    expect(b.z).toBeCloseTo(0);
  });
  it('turns with the yaw frame by frame and keeps its length', () => {
    const a = stickToWorld(0.3, -0.4, 0);
    const b = stickToWorld(0.3, -0.4, Math.PI / 4);
    expect(Math.hypot(a.x, a.z)).toBeCloseTo(Math.hypot(b.x, b.z));
    expect(a.x).not.toBeCloseTo(b.x);
  });
  it('clamps to a unit vector and is still inside the dead zone', () => {
    expect(Math.hypot(...Object.values(stickToWorld(3, 4, 1)))).toBeCloseTo(1);
    expect(stickToWorld(0.05, 0.05, 0)).toEqual({ x: 0, z: 0 });
  });
});

describe('floating pad', () => {
  it('keeps its centre while the thumb stays inside 1.4 radii', () => {
    const c = { x: 100, y: 400 };
    const s = stickState(c, { x: 100 + J.radius * 1.3, y: 400 });
    expect(s.centre).toBe(c);
    expect(s.len).toBe(1);
    expect(s.knob.x).toBeCloseTo(J.radius);
  });
  it('recentres so the thumb sits 1.4 radii from the centre when dragged past it', () => {
    const c = { x: 100, y: 400 };
    const s = stickState(c, { x: 100 + J.radius * 3, y: 400 });
    expect(s.centre.x).toBeCloseTo(100 + J.radius * 1.6);
    expect(s.vec.x).toBeCloseTo(1);
  });
  it('lands anywhere in the left 45% below the top bar', () => {
    expect(inPadZone(100, 300, 400, 60)).toBe(true);
    expect(inPadZone(200, 300, 400, 60)).toBe(false);
    expect(inPadZone(100, 40, 400, 60)).toBe(false);
  });
});
