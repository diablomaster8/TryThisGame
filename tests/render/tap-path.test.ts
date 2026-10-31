// MOVE-44: a tap behind the cottage shows dots that curve round it (not straight through),
// and a tap on a terrace top puts the marker up on the terrace.
import { describe, expect, it } from 'vitest';
import { SIM } from '../../src/config/tuning';
import { TapPath } from '../../src/render/tap-path';
import { contact, obstacles } from '../../src/sim/obstacles';
import { hillHeight, TERRACES } from '../../src/sim/terrain';
import { applyCommand, createWorld, stepWorld } from '../../src/sim/world';

describe('tap path preview (MOVE-44)', () => {
  it('curves the dots round the cottage and none sits inside it', () => {
    const w = createWorld(7, 0);
    w.nubbins = [];
    const cottage = obstacles(w).find((c) => c.id === 'cottage')!;
    w.keeper.pos = { x: cottage.x, z: cottage.z + 6 };
    applyCommand(w, { kind: 'moveKeeperTo', pos: { x: cottage.x, z: cottage.z - 6 } }, []);
    stepWorld(w, SIM.stepMs);
    const tp = new TapPath();
    expect(tp.update(w, 0)).toBe(true);
    // WORLD-41: a print every 0.8 u of a walk at least 12 u long.
    expect(tp.dots.length).toBeGreaterThanOrEqual(14);
    for (const d of tp.dots) expect(contact(cottage, d.x, d.z, 0)).toBeNull();
    // Round it: some dot stands well off the straight line through it.
    expect(Math.max(...tp.dots.map((d) => Math.abs(d.x - cottage.x)))).toBeGreaterThan(1);
    expect(tp.mark!.z).toBeCloseTo(cottage.z - 6, 0);
    expect(tp.unreached).toBeNull();
    // Neighbouring prints lie about 0.8 u apart (a little more where the feet swap sides).
    for (let i = 1; i < tp.dots.length; i++) {
      const a = tp.dots[i - 1]!;
      const b = tp.dots[i]!;
      const gap = Math.hypot(b.x - a.x, b.z - a.z);
      expect(gap).toBeGreaterThan(0.5);
      expect(gap).toBeLessThan(0.85);
    }
    // The prints fade over 1.2 s; under reduced motion they stay whole, then go.
    expect(tp.dotAlpha(600, false)).toBeCloseTo(0.5, 5);
    expect(tp.dotAlpha(1300, false)).toBe(0);
    expect(tp.dotAlpha(1100, true)).toBe(1);
    expect(tp.dotAlpha(1300, true)).toBe(0);
  });

  it('puts the target marker on a terrace top', () => {
    const w = createWorld(8, 0);
    w.nubbins = [];
    const t = TERRACES[0]!;
    w.keeper.pos = { x: t.x + t.reach + 3, z: t.z };
    applyCommand(w, { kind: 'moveKeeperTo', pos: { x: t.x, z: t.z } }, []);
    stepWorld(w, SIM.stepMs);
    const tp = new TapPath();
    tp.update(w, 0);
    expect(tp.mark!.y).toBeGreaterThan(hillHeight(t.x, t.z) - 0.3);
    expect(tp.mark!.y).toBeGreaterThan(1);
  });

  it('puffs a "?" at the nearest point when the tap is shut in (WORLD-41)', () => {
    const w = createWorld(7, 0);
    w.nubbins = [];
    const cottage = obstacles(w).find((c) => c.id === 'cottage')!;
    w.keeper.pos = { x: cottage.x, z: cottage.z + 6 };
    applyCommand(w, { kind: 'moveKeeperTo', pos: { x: cottage.x, z: cottage.z } }, []);
    stepWorld(w, SIM.stepMs);
    const tp = new TapPath();
    expect(tp.update(w, 0)).toBe(true);
    expect(tp.unreached).not.toBeNull();
    expect(Math.hypot(tp.unreached!.x - cottage.x, tp.unreached!.z - cottage.z)).toBeGreaterThan(1);
    expect(tp.puffLife(500, false)).toBeGreaterThan(0);
    expect(tp.puffLife(500, true)).toBe(0.5);
    expect(tp.puffLife(1200, false)).toBeNull();
    // It outlives the short walk: the target clears on arrival, the puff stays its time.
    w.keeper.moveTarget = null;
    expect(tp.update(w, 600)).toBe(true);
    expect(tp.dots.length).toBe(0);
    expect(tp.update(w, 1200)).toBe(false);
  });
});
