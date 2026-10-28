import { describe, expect, it } from 'vitest';
import {
  bearingOnRose,
  compassTicks,
  minimapModeOf,
  minimapVisible,
  nearestUnfound,
  roseAngle,
} from '../../src/ui/hud-world-math';

const deg = (r: number) => (r * 180) / Math.PI;
const diff = (a: number, b: number) => Math.abs(((a - b + 540) % 360) - 180);
const STEP = Math.PI / 4;

describe('compass bearing', () => {
  it('points within 10 degrees of the true bearing at every yaw step', () => {
    const from = { x: 0, z: 0 };
    for (let k = 0; k < 8; k++) {
      const yaw = k * STEP;
      // North is at the rose's roseAngle; east lies a quarter turn clockwise of north.
      const north = deg(bearingOnRose(from, { x: 0, z: -10 }, yaw));
      const east = deg(bearingOnRose(from, { x: 10, z: 0 }, yaw));
      expect(diff(north, deg(roseAngle(yaw)))).toBeLessThan(10);
      expect(diff(east, deg(roseAngle(yaw)) + 90)).toBeLessThan(10);
    }
  });

  it('shows north straight up at yaw 0 and to the right when the camera stands east', () => {
    expect(deg(roseAngle(0))).toBeCloseTo(0, 5);
    expect(deg(roseAngle(Math.PI / 2))).toBeCloseTo(90, 5);
  });

  it('turns the rose a full 360 degrees over eight 45 degree yaw steps', () => {
    let total = 0;
    let prev = roseAngle(0);
    for (let k = 1; k <= 8; k++) {
      const a = roseAngle(k * STEP);
      let d = a - prev;
      if (d < -Math.PI) d += 2 * Math.PI;
      total += d;
      prev = a;
    }
    expect(deg(total)).toBeCloseTo(360, 5);
  });
});

describe('compass ticks', () => {
  const lms = [
    { id: 'a', x: 10, z: 0 },
    { id: 'b', x: 70, z: 0 },
  ];
  it('picks the nearest undiscovered landmark in range', () => {
    expect(nearestUnfound({ x: 0, z: 0 }, lms, {}, 60)?.id).toBe('a');
    expect(nearestUnfound({ x: 0, z: 0 }, lms, { a: 1 }, 60)).toBeNull();
  });
  it('gives the home tick outside the Grove and a landmark tick inside', () => {
    const base = {
      keeper: { x: 0, z: 0 },
      yaw: 0,
      landmarks: lms,
      found: {},
      range: 60,
      maxTicks: 3,
    };
    expect(compassTicks({ ...base, inGrove: false }).map((t) => t.kind)).toEqual(['home']);
    const t = compassTicks({ ...base, inGrove: true });
    expect(t).toHaveLength(1);
    expect(deg(t[0]!.angle)).toBeCloseTo(90, 5);
  });
});

describe('minimap visibility', () => {
  it('follows the setting, the Grove, the height and the sprout band', () => {
    expect(minimapModeOf(undefined)).toBe('auto');
    expect(minimapVisible('auto', true, 812, 700, false)).toBe(true);
    expect(minimapVisible('auto', true, 600, 700, false)).toBe(false);
    expect(minimapVisible('on', true, 600, 700, false)).toBe(true);
    expect(minimapVisible('off', true, 900, 700, false)).toBe(false);
    expect(minimapVisible('on', true, 900, 700, true)).toBe(false);
    expect(minimapVisible('on', false, 900, 700, false)).toBe(false);
  });
});
