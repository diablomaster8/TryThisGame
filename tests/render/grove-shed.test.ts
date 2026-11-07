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

  it('keeps everything on a device that holds 60 fps', () => {
    const g = new FrameGovernor(1.5);
    g.setShedSteps(GROVE_SHED.order.length, 'grove', GROVE3D.governor);
    for (let i = 0; i < 1000; i++) g.sample(16.7);
    expect(g.shedLevel).toBe(0);
    expect(g.ratio).toBe(1.5);
  });

  it('starts shedding once the frame runs past 60 fps (hot/perf-leaks)', () => {
    const g = new FrameGovernor(1.5);
    g.setShedSteps(GROVE_SHED.order.length, 'grove', GROVE3D.governor);
    // 45 fps: once over the 30 fps floor this was left alone.
    for (let i = 0; i < 200; i++) g.sample(22);
    expect(g.shedLevel).toBeGreaterThan(0);
  });

  it('keeps everything at 60 fps with the odd dropped frame (round 3)', () => {
    const g = new FrameGovernor(1.5);
    g.setShedSteps(GROVE_SHED.order.length, 'grove', GROVE3D.governor);
    // 16.7 ms frames with a 33 ms hitch every second.
    for (let i = 0; i < 3000; i++) g.sample(i % 60 === 0 ? 33.4 : 16.7);
    expect(g.shedLevel).toBe(0);
    expect(g.cpuLevel).toBe(0);
    expect(g.ratio).toBe(1.5);
  });

  it('never reaches the race steps on a device that holds 60 fps with jitter (round 5)', () => {
    const g = new FrameGovernor(1.5);
    g.setShedSteps(GROVE_SHED.order.length, 'grove', GROVE3D.governor);
    // A phone at 60 with ordinary jitter: most frames on time, a few late, one missed a second.
    const jitter = [16.7, 16.6, 16.8, 17.5, 16.7, 16.2, 18.4, 16.7, 16.9, 16.5];
    for (let i = 0; i < 6000; i++) g.sample(i % 60 === 30 ? 33.4 : jitter[i % jitter.length]!);
    expect(g.cpuLevel).toBeLessThan(GROVE3D.governor.cpuStandIns);
    expect(g.cpuLevel).toBe(0);
    expect(g.shedLevel).toBe(0);
    expect(g.ratio).toBe(1.5);
  });

  it('reaches the one-whole-runner step under sustained load and gives it back after (round 5)', () => {
    const g = new FrameGovernor(1.5);
    g.setShedSteps(GROVE_SHED.order.length, 'grove', GROVE3D.governor);
    for (let i = 0; i < 200; i++) g.sample(40);
    expect(g.cpuLevel).toBeGreaterThanOrEqual(GROVE3D.governor.cpuRaceOne);
    // The load lifts: every step comes back in time, the latest first.
    for (let i = 0; i < 20000; i++) g.sample(12);
    expect(g.cpuLevel).toBe(0);
    expect(g.shedLevel).toBe(0);
  });

  it('walks the whole ladder within two seconds on a phone at half speed (round 3)', () => {
    const g = new FrameGovernor(1.5);
    g.setShedSteps(GROVE_SHED.order.length, 'grove', GROVE3D.governor);
    // CPU-bound at 35 ms a frame: fewer pixels buy nothing.
    let ms = 0;
    while (g.cpuLevel < GROVE3D.governor.cpuLevels && ms < 10_000) {
      g.sample(35);
      ms += 35;
    }
    expect(g.shedLevel).toBe(GROVE_SHED.order.length);
    expect(g.cpuLevel).toBe(GROVE3D.governor.cpuLevels);
    expect(ms).toBeLessThanOrEqual(2000);
    // ...and stays there, sharp, without flickering.
    const at = [g.ratio, g.cpuLevel, g.shedLevel].join();
    for (let i = 0; i < 2000; i++) g.sample(35);
    expect([g.ratio, g.cpuLevel, g.shedLevel].join()).toBe(at);
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
