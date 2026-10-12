import { Vector3 } from 'three';
import { describe, expect, it } from 'vitest';
import {
  computeViewHeight,
  orbitPosition,
  shortestAngleDelta,
  wrapYawIndex,
  yawIndexToRadians,
} from '../../src/render/camera';

describe('wrapYawIndex', () => {
  it('wraps in both directions over 8 steps', () => {
    expect(wrapYawIndex(0)).toBe(0);
    expect(wrapYawIndex(8)).toBe(0);
    expect(wrapYawIndex(-1)).toBe(7);
    expect(wrapYawIndex(9)).toBe(1);
    expect(wrapYawIndex(-9)).toBe(7);
  });
});

describe('yawIndexToRadians', () => {
  it('maps indices to 45° steps', () => {
    expect(yawIndexToRadians(0)).toBeCloseTo(0);
    expect(yawIndexToRadians(2)).toBeCloseTo(Math.PI / 2);
    expect(yawIndexToRadians(4)).toBeCloseTo(Math.PI);
  });
});

describe('shortestAngleDelta', () => {
  it('takes the short way round', () => {
    expect(shortestAngleDelta(0, Math.PI / 4)).toBeCloseTo(Math.PI / 4);
    expect(shortestAngleDelta(0, (7 * Math.PI) / 4)).toBeCloseTo(-Math.PI / 4);
    expect(shortestAngleDelta((7 * Math.PI) / 4, 0)).toBeCloseTo(Math.PI / 4);
  });

  it('is zero for equal angles', () => {
    expect(shortestAngleDelta(1.23, 1.23)).toBe(0);
  });
});

describe('computeViewHeight', () => {
  it('derives visible world height from pixels per unit', () => {
    expect(computeViewHeight(270, 8)).toBeCloseTo(33.75);
    expect(computeViewHeight(270, 16)).toBeCloseTo(16.875);
  });
});

describe('orbitPosition', () => {
  const pitch = (35 * Math.PI) / 180;

  it('places the camera above and behind the target at yaw 0', () => {
    const p = orbitPosition(0, pitch, 10, new Vector3(0, 0, 0));
    expect(p.x).toBeCloseTo(0);
    expect(p.y).toBeCloseTo(10 * Math.sin(pitch));
    expect(p.z).toBeCloseTo(10 * Math.cos(pitch));
  });

  it('stays at the orbit distance for any yaw', () => {
    const target = new Vector3(2, 0, -3);
    for (let i = 0; i < 8; i++) {
      const p = orbitPosition(yawIndexToRadians(i), pitch, 10, target);
      expect(p.distanceTo(target)).toBeCloseTo(10);
      expect(p.y).toBeCloseTo(10 * Math.sin(pitch));
    }
  });
});
