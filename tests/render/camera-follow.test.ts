import { describe, expect, it } from 'vitest';
import { OrbitCamera } from '../../src/render/camera';
import { WalkFollow } from '../../src/render/camera-follow';
import { createWorld } from '../../src/sim/world';

// MOVE-53: Camera follows walking.

/** Walk the Keeper to screen-right for `ms`, frame by frame; the turns made. */
function walkRight(on: boolean, ms: number, talking = false): number[] {
  const w = createWorld(1, 0);
  w.settings.cameraFollowsWalk = on;
  const cam = new OrbitCamera();
  cam.reduceMotion = true;
  const f = new WalkFollow();
  // Screen-right as the walk starts: the camera's right vector (cos yaw, −sin yaw).
  const yaw = cam.currentYaw;
  w.keeper.facing = Math.atan2(Math.cos(yaw), -Math.sin(yaw));
  w.keeper.input = { x: Math.sin(w.keeper.facing), z: Math.cos(w.keeper.facing) };
  const turns: number[] = [];
  for (let t = 0; t <= ms; t += 16) {
    const d = f.update(w, cam, t, talking);
    if (d !== 0) turns.push(d);
  }
  return turns;
}

describe('Camera follows walking (MOVE-53)', () => {
  it('on: a 5 s walk to screen-right turns the view one step', () => {
    expect(walkRight(true, 5000)).toHaveLength(1);
  });

  it('the turn brings the walk nearer the camera forward', () => {
    const w = createWorld(1, 0);
    w.settings.cameraFollowsWalk = true;
    const cam = new OrbitCamera();
    cam.reduceMotion = true;
    const yaw = cam.currentYaw;
    w.keeper.facing = Math.atan2(Math.cos(yaw), -Math.sin(yaw));
    w.keeper.input = { x: 1, z: 0 };
    const off = (): number => {
      const a = w.keeper.facing - (cam.currentYaw + Math.PI);
      return Math.abs(Math.atan2(Math.sin(a), Math.cos(a)));
    };
    const before = off();
    const f = new WalkFollow();
    for (let t = 0; t <= 3200; t += 16) f.update(w, cam, t, false);
    expect(off()).toBeCloseTo(before - Math.PI / 4, 5);
  });

  it('off, or in dialogue: no turn', () => {
    expect(walkRight(false, 5000)).toHaveLength(0);
    expect(walkRight(true, 5000, true)).toHaveLength(0);
  });
});
