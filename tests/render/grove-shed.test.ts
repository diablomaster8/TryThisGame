import { describe, expect, it } from 'vitest';
import { GROVE3D, GROVE_SHED, TIER_BUDGET } from '../../src/config/tuning';
import { FrameGovernor } from '../../src/render3d/governor';
import { GroveShed } from '../../src/render3d/grove-shed';

/** TECH-52: the tier's start values, the Grove's shed list and the remembered level. */
describe('3D start at the device tier', () => {
  it('caps the render scale at the tier and never lifts it past', () => {
    const g = new FrameGovernor(2);
    expect(g.ratio).toBe(GROVE3D.governor.maxRatio);
    g.capRatio(TIER_BUDGET.mid.three.ratio);
    expect(g.ratio).toBe(1);
    for (let i = 0; i < 2000; i++) g.sample(8);
    expect(g.ratio).toBe(1);
    const low = new FrameGovernor(3);
    low.capRatio(TIER_BUDGET.low.three.ratio);
    expect(low.ratio).toBe(0.75);
  });

  it('restores a remembered level inside the device range', () => {
    const g = new FrameGovernor(1.5);
    g.capRatio(1);
    g.restore({ ratio: 1.4, cpu: 9, shed: 0 });
    expect(g.ratio).toBe(1);
    expect(g.cpuLevel).toBe(GROVE3D.governor.cpuLevels);
    g.restore({ ratio: 0.6, cpu: 1, shed: 0 });
    expect(g.ratio).toBe(0.6);
    expect(g.cpuLevel).toBe(1);
    // And climbs back once frames come easily: savings first, then sharpness.
    for (let i = 0; i < 5000; i++) g.sample(8);
    expect(g.cpuLevel).toBe(0);
    expect(g.ratio).toBe(1);
  });

  it('sheds the Grove list, in order, before the render scale', () => {
    const shed = new GroveShed();
    const log: string[] = [];
    for (const name of shed.order) shed.register({ name, apply: (s) => s && log.push(name) });
    const g = new FrameGovernor(1.5);
    g.setShedSteps(shed.steps, 'grove', GROVE3D.governor);
    let firstRatioDrop = -1;
    for (let i = 0; i < 400; i++) {
      g.sample(45);
      shed.apply(g.shedLevel);
      if (firstRatioDrop < 0 && g.ratio < 1.5) firstRatioDrop = g.shedLevel;
    }
    expect(log).toEqual([...GROVE_SHED.order]);
    expect(firstRatioDrop).toBe(shed.steps);
  });

  it('keeps everything on a device that holds 30 fps', () => {
    const g = new FrameGovernor(1.5);
    g.setShedSteps(4, 'grove', GROVE3D.governor);
    for (let i = 0; i < 1000; i++) g.sample(25);
    expect(g.shedLevel).toBe(0);
    expect(g.ratio).toBe(1.5);
  });

  it('starts the Grove list at the remembered step and the cave list clean', () => {
    const g = new FrameGovernor(1.5);
    g.setShedSteps(4, 'grove', GROVE3D.governor, 2);
    expect(g.shedLevel).toBe(2);
    expect(g.settled.shed).toBe(2);
    g.setShedSteps(3, 'cave');
    expect(g.shedLevel).toBe(0);
    expect(g.settled.shed).toBe(0);
    // Same step count, other place: still a fresh list.
    g.setShedSteps(3, 'grove', GROVE3D.governor, 1);
    expect(g.shedLevel).toBe(1);
  });
});
