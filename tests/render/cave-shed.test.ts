import { describe, expect, it } from 'vitest';
import { GROVE3D } from '../../src/config/tuning';
import { CaveShed, type CaveShedName } from '../../src/render3d/cave-shed';
import { FrameGovernor } from '../../src/render3d/governor';

/** Underground the governor sheds particles, triplanar, then bloom, before the render scale. */
const feed = (g: FrameGovernor, frames: number, ms: (ratio: number) => number) => {
  for (let i = 0; i < frames; i++) g.sample(ms(g.ratio));
};

describe('cave shed order', () => {
  it('follows the spec order', () => {
    expect(GROVE3D.cave.light.governor.order).toEqual(['particles', 'triplanar', 'bloom']);
  });

  it('sheds every cave step before it lowers the render scale', () => {
    const shed = new CaveShed();
    const log: string[] = [];
    for (const name of shed.order) {
      shed.register({ name, apply: (s) => s && log.push(name) });
    }
    const g = new FrameGovernor(1.5);
    g.setShedSteps(shed.steps);
    const seen: Array<[number, number]> = [];
    for (let i = 0; i < 400; i++) {
      // Fill-bound: slow at full scale whatever is shed.
      g.sample(45 * (g.ratio / 1.5) ** 2);
      shed.apply(g.shedLevel);
      seen.push([g.shedLevel, g.ratio]);
    }
    expect(log).toEqual(['particles', 'triplanar', 'bloom']);
    // The scale stays at full until all three steps are shed.
    for (const [level, ratio] of seen) if (level < 3) expect(ratio).toBe(1.5);
    expect(g.ratio).toBeLessThan(1.5);
  });

  it('sheds toward the phone target at 37 fps, keeping full sharpness', () => {
    const g = new FrameGovernor(1.5);
    g.setShedSteps(3);
    feed(g, 400, () => 27);
    expect(g.shedLevel).toBe(3);
    expect(g.ratio).toBe(1.5);
    // Above ground the same frame time sheds nothing and keeps the scale.
    const grove = new FrameGovernor(1.5);
    feed(grove, 400, () => 27);
    expect(grove.shedLevel).toBe(0);
    expect(grove.ratio).toBe(1.5);
  });

  it('gives the shed steps back at 60 fps', () => {
    const g = new FrameGovernor(1.5);
    g.setShedSteps(3);
    feed(g, 400, () => 27);
    feed(g, 2000, () => 16.7);
    expect(g.shedLevel).toBe(0);
  });

  it('gives sharpness back before the shed steps', () => {
    const g = new FrameGovernor(1.5);
    g.setShedSteps(3);
    feed(g, 400, (r) => 45 * (r / 1.5) ** 2);
    expect(g.shedLevel).toBe(3);
    const seen: Array<[number, number]> = [];
    for (let i = 0; i < 4000; i++) {
      g.sample(12);
      seen.push([g.shedLevel, g.ratio]);
    }
    for (const [level, ratio] of seen) if (level < 3) expect(ratio).toBe(1.5);
    expect(g.shedLevel).toBe(0);
  });

  it('leaves the Grove order alone and resets on leaving the cave', () => {
    const g = new FrameGovernor(1.5);
    feed(g, 400, (r) => 45 * (r / 1.5) ** 2);
    expect(g.shedLevel).toBe(0);
    expect(g.ratio).toBeLessThan(1.5);
    g.setShedSteps(3);
    feed(g, 30, () => 45);
    expect(g.shedLevel).toBeGreaterThan(0);
    g.setShedSteps(0);
    expect(g.shedLevel).toBe(0);
  });

  it('is a no-op with nothing registered, and tells a late hook the current state', () => {
    const shed = new CaveShed();
    expect(() => shed.apply(2)).not.toThrow();
    const got: Array<[CaveShedName, boolean]> = [];
    shed.register({ name: 'particles', apply: (s) => got.push(['particles', s]) });
    const off = shed.register({ name: 'bloom', apply: (s) => got.push(['bloom', s]) });
    expect(got).toEqual([
      ['particles', true],
      ['bloom', false],
    ]);
    off();
    shed.apply(3);
    expect(got).toHaveLength(2);
    shed.apply(0);
    expect(got.at(-1)).toEqual(['particles', false]);
  });
});
