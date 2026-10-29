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
    expect(tp.dots.length).toBe(5);
    for (const d of tp.dots) expect(contact(cottage, d.x, d.z, 0)).toBeNull();
    // Round it: some dot stands well off the straight line through it.
    expect(Math.max(...tp.dots.map((d) => Math.abs(d.x - cottage.x)))).toBeGreaterThan(1);
    expect(tp.mark!.z).toBeCloseTo(cottage.z - 6, 0);
    // The dots fade by 600 ms; under reduced motion they go after 200 ms.
    expect(tp.dotAlpha(700, false)).toBe(0);
    expect(tp.dotAlpha(300, true)).toBe(0);
    expect(tp.dotAlpha(100, true)).toBe(1);
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
});
