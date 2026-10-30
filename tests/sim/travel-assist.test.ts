import { describe, expect, it } from 'vitest';
import { SIM } from '../../src/config/tuning';
import { objectivePoi } from '../../src/sim/beacon';
import { travelMode } from '../../src/sim/travel';
import type { Settings, World } from '../../src/sim/types';
import { applyCommand, createWorld, stepWorld } from '../../src/sim/world';

/** R0102 (WORLD-44): the Travel assist setting. */
function setUp(): World {
  const world = createWorld(11, 0);
  stepWorld(world, SIM.stepMs);
  return world;
}

const walked = (world: World, from: { x: number; z: number }): number =>
  Math.hypot(world.keeper.pos.x - from.x, world.keeper.pos.z - from.z);

describe('Travel assist (R0102)', () => {
  it('reads Walk unset, Auto-walk in a Learning Grove, and ignores a bad saved value', () => {
    const world = setUp();
    expect(travelMode(world)).toBe('walk');
    world.edu = { band: 'sprout' } as World['edu'];
    expect(travelMode(world)).toBe('auto');
    world.edu = undefined as unknown as World['edu'];
    world.settings = { ...world.settings, travel: 'teleport' as NonNullable<Settings['travel']> };
    expect(travelMode(world)).toBe('walk');
    world.settings = { ...world.settings, travel: 'skip' };
    expect(travelMode(world)).toBe('skip');
  });

  it('Skip: tapping the beacon arrives at the objective within a second of sim time', () => {
    const world = setUp();
    world.settings = { ...world.settings, travel: 'skip' };
    const egg = world.nubbins.find((n) => n.stage === 'egg')!;
    egg.pos = { x: -20, z: -20 };
    world.keeper.pos = { x: 20, z: 20 };
    const at = objectivePoi(world, 'grove:hatch')!;
    expect(at).not.toBeNull();
    // What the beacon chip sends in Skip mode (`ui/beacon-arrow.ts`).
    applyCommand(world, { kind: 'fastTravel', pos: at }, []);
    for (let t = 0; t < 1000; t += SIM.stepMs) stepWorld(world, SIM.stepMs);
    expect(walked(world, at)).toBeLessThan(2);
  });

  it('Auto-walk runs: it covers more ground than a plain tap walk, and a tap cancels it', () => {
    const plain = setUp();
    const assist = setUp();
    const start = { x: 0, z: 30 };
    const to = { x: 0, z: 40 };
    for (const w of [plain, assist]) {
      w.settings = { ...w.settings, autoRun: false };
      w.keeper.pos = { ...start };
    }
    applyCommand(plain, { kind: 'moveKeeperTo', pos: to }, []);
    applyCommand(assist, { kind: 'travelAssist', pos: to }, []);
    for (let t = 0; t < 1500; t += SIM.stepMs) {
      stepWorld(plain, SIM.stepMs);
      stepWorld(assist, SIM.stepMs);
    }
    expect(walked(assist, start)).toBeGreaterThan(walked(plain, start) * 1.3);
    // Any tap walk replaces it, at walking pace.
    applyCommand(assist, { kind: 'moveKeeperTo', pos: { x: 0, z: 30 } }, []);
    expect(assist.keeper.moveTarget).toEqual({ x: 0, z: 30 });
  });
});
